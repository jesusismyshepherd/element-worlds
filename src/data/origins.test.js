import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { originOf, mainOrigin, bodyBySource, BODY, SOURCE } from './origins.js'

test('every element to lawrencium has its sources, adding up to 100 per cent', () => {
  for (let z = 1; z <= 103; z++) {
    const o = originOf(z)
    const sum = o.reduce((s, x) => s + x.share, 0)
    assert.ok(Math.abs(sum - 1) < 0.006, `Z=${z}: ${sum}`)
    for (const x of o) assert.ok(SOURCE[x.id], `Z=${z}: ${x.id}`)
  }
  assert.equal(mainOrigin(118), 'x')
})

test("Johnson's chart: the Big Bang's hydrogen, the stars' carbon, the mergers' gold", () => {
  assert.equal(mainOrigin(1), 'b')
  assert.equal(mainOrigin(2), 'b')
  assert.equal(mainOrigin(4), 'c') // beryllium: cosmic rays
  assert.equal(mainOrigin(6), 'l') // carbon: mostly dying low-mass stars
  assert.equal(mainOrigin(8), 'm') // oxygen: exploding massive stars
  assert.equal(mainOrigin(25), 'w') // manganese: exploding white dwarfs
  assert.equal(mainOrigin(56), 'l') // barium: the slow capture in giants
  assert.equal(mainOrigin(79), 'n') // gold
  assert.equal(mainOrigin(63), 'n') // europium
  assert.equal(mainOrigin(43), 'x') // technetium: no stable isotope
})

test('a body: three quarters from exploding massive stars, a tenth from the Big Bang', () => {
  const by = bodyBySource()
  const total = BODY.reduce((s, [, p]) => s + p, 0)
  assert.ok(total > 99.5 && total < 100.5)
  assert.equal(Math.round(by.b), 10)
  assert.ok(by.m > 70 && by.m < 76, `massive ${by.m}`)
  assert.ok(by.l > 14 && by.l < 18, `low-mass ${by.l}`)
  assert.ok(by.w > 0.5 && by.w < 1.5, `white dwarfs ${by.w}`)
})

test('the binding curve: nickel-62 the most tightly bound, iron-56 next to it', () => {
  const rows = JSON.parse(readFileSync(new URL('./binding.json', import.meta.url), 'utf8'))
  const top = rows.reduce((a, b) => (b[2] > a[2] ? b : a))
  assert.deepEqual(top.slice(0, 2), [62, 28])
  const at = A => rows.find(r => r[0] === A)
  assert.ok(Math.abs(at(56)[2] - 8.790) < 0.001 && at(56)[1] === 26)
  assert.ok(Math.abs(at(4)[2] - 7.074) < 0.001)
  assert.ok(Math.abs(at(12)[2] - 7.680) < 0.001)
  assert.ok(at(238)[2] < 7.6 && at(238)[2] > 7.5)
})
