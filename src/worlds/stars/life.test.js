import { test } from 'node:test'
import assert from 'node:assert/strict'
import { phasesOf, endOf, kindOf, hydrogenYears, lifeYears, placeAt, ageAt, NURSERY, M_MIN, M_MAX, UNIVERSE_YEARS } from './life.js'

const ids = m => phasesOf(m).map(p => p.id).join(' ')

test('the burnings by mass: red dwarfs only hydrogen, Sun-like stars to helium, heavy ones to silicon', () => {
  assert.equal(ids(0.25), 'h')
  assert.equal(ids(1), 'h rg he agb')
  assert.equal(ids(3), 'h rg he agb')
  assert.equal(ids(9), 'h he c')
  assert.equal(ids(15), 'h he c ne o si')
  assert.equal(ids(25), 'h he c ne o si')
  assert.equal(kindOf(0.49), 'dwarf')
  assert.equal(kindOf(0.5), 'low')
  assert.equal(kindOf(8), 'super')
  assert.equal(kindOf(10), 'massive')
})

test('the Sun burns by the proton-proton chain, heavier stars by the CNO cycle (and make nitrogen)', () => {
  assert.equal(phasesOf(1)[0].chain, 'pp')
  assert.deepEqual(phasesOf(1)[0].makes, [2])
  assert.equal(phasesOf(3)[0].chain, 'cno')
  assert.ok(phasesOf(3)[0].makes.includes(7))
  assert.equal(phasesOf(15)[1].chain, 'alpha')
})

test('lifetimes follow the models: the Sun 10 billion years, a 15-sun star 11 million, heavier stars shorter', () => {
  assert.equal(hydrogenYears(1), 1e10)
  assert.equal(hydrogenYears(0.25), 1e12)
  assert.equal(hydrogenYears(15), 1.11e7)
  assert.equal(hydrogenYears(25), 6.71e6)
  for (let m = M_MIN; m < M_MAX; m *= 1.07) assert.ok(hydrogenYears(m * 1.07) < hydrogenYears(m), `shorter above ${m.toFixed(2)}`)
  // a 20-sun star, Woosley, Heger & Weaver 2002 (in Paxton et al. 2011)
  const p20 = Object.fromEntries(phasesOf(20).map(p => [p.id, p.years]))
  assert.ok(Math.abs(p20.he - 1.17e6) < 1)
  assert.ok(Math.abs(p20.c - 976) < 0.01)
  assert.ok(Math.abs(p20.si - 0.0315) < 1e-6) // about 11.5 days
  // each later burning of a heavy star is far shorter than hydrogen's
  for (const m of [12, 15, 20, 25]) {
    const ph = phasesOf(m)
    assert.ok(ph[1].years < ph[0].years / 4 && ph[2].years < ph[1].years / 100 && ph[5].years < 1)
  }
})

test('core temperatures climb with each burning (a 20-sun star: 37 million K to 3.3 billion)', () => {
  const ph = phasesOf(20)
  assert.equal(Math.round(ph[0].T / 1e6), 37)
  assert.equal(ph[5].T, 3.3e9)
  for (let i = 1; i < ph.length; i++) assert.ok(ph[i].T > ph[i - 1].T)
  assert.equal(Math.round(phasesOf(1)[0].T / 1e5), 157)
})

test('how stars end', () => {
  assert.equal(endOf(0.25).remnant, 'heWD')
  assert.equal(endOf(0.25).notYet, true) // a trillion years: none has died yet
  assert.equal(endOf(1).remnant, 'wd')
  assert.equal(endOf(1).notYet, false)
  assert.equal(endOf(0.8).notYet, true) // longer than the universe's 13.8 billion years
  assert.equal(endOf(9).remnant, 'oneWD')
  assert.equal(endOf(15).kind, 'sn')
  assert.equal(endOf(15).remnant, 'ns')
  assert.equal(endOf(25).remnant, 'bh')
  assert.ok(lifeYears(1) < UNIVERSE_YEARS && lifeYears(1) > 1e10)
})

test('every element a star makes is a real one, and iron comes only from silicon burning', () => {
  for (const { m } of NURSERY) {
    for (const p of phasesOf(m)) for (const z of p.makes) assert.ok(z >= 1 && z <= 37)
  }
  const si = phasesOf(15).find(p => p.id === 'si')
  assert.ok(si.makes.includes(26))
  assert.ok(!phasesOf(3).some(p => p.makes.includes(26)))
})

test('the life slider: each phase an equal share, the age adding up', () => {
  assert.deepEqual(placeAt(15, 0), { i: 0, f: 0 })
  assert.equal(placeAt(15, 1).i, 5)
  assert.equal(placeAt(15, 1).f, 1)
  assert.equal(placeAt(1, 0.5).i, 2)
  assert.equal(ageAt(1, 1, 0), 1e10)
  assert.ok(Math.abs(ageAt(15, 6, 0) - lifeYears(15)) < 1)
})
