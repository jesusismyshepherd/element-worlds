import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ELEMENTS, element, cellOf } from '../data/elements.js'
import { subshells, shellsOf, valenceElectrons, octetPlaces, bondCount, hands, nucleus } from './atom.js'
import * as ATOM from './atom.js'

test('118 elements, numbered 1 to 118, each with both names', () => {
  assert.equal(ELEMENTS.length, 118)
  ELEMENTS.forEach((e, i) => {
    assert.equal(e.z, i + 1)
    assert.ok(e.name.en && e.name['pt-pt'], e.symbol)
  })
})

test('every element has its own cell in the table', () => {
  const seen = new Set()
  for (const e of ELEMENTS) {
    const { col, row } = cellOf(e)
    assert.ok(col >= 1 && col <= 18 && row >= 1 && row <= 10 && row !== 8, `${e.symbol} at ${col},${row}`)
    const key = `${col},${row}`
    assert.ok(!seen.has(key), `${e.symbol} shares ${key}`)
    seen.add(key)
  }
  assert.deepEqual(cellOf(element('C')), { col: 14, row: 2 })
  assert.deepEqual(cellOf(element('La')), { col: 3, row: 9 })
  assert.deepEqual(cellOf(element('Lr')), { col: 17, row: 10 })
})

test('configurations expand to the right subshells and add up to Z', () => {
  assert.deepEqual(subshells('[He]2s2 2p2'), [
    { n: 1, l: 's', count: 2 }, { n: 2, l: 's', count: 2 }, { n: 2, l: 'p', count: 2 },
  ])
  for (const e of ELEMENTS) {
    const total = subshells(e.config).reduce((a, s) => a + s.count, 0)
    assert.equal(total, e.z, `${e.symbol}: ${e.config}`)
  }
})

test('shells agree between the two sources, except for predicted superheavy configurations', () => {
  const raw = JSON.parse(readFileSync(new URL('../../scripts/data/mendeleev.json', import.meta.url), 'utf8'))
  const differ = ELEMENTS.filter(e => shellsOf(e.config).join() !== raw[e.z - 1].shells.join())
  assert.deepEqual(differ.map(e => e.symbol), ['Lr', 'Ds', 'Rg'])
  for (const e of ELEMENTS) assert.deepEqual(e.shells, shellsOf(e.config), e.symbol)
})

test('valence electrons and octet places of known elements', () => {
  const v = s => valenceElectrons(element(s))
  assert.deepEqual(['H', 'He', 'Li', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Cl', 'Ar'].map(v), [1, 2, 1, 4, 5, 6, 7, 8, 1, 7, 8])
  assert.equal(v('Fe'), 2)
  assert.equal(v('Cu'), 1)
  assert.equal(v('Pd'), 0)
  assert.equal(octetPlaces(element('H')), 2)
  assert.equal(octetPlaces(element('O')), 8)
  assert.equal(octetPlaces(element('Fe')), null)
})

test('hands: the bonds an element forms, or the electrons a metal gives', () => {
  const b = s => bondCount(element(s))
  assert.deepEqual(['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'].map(b), [1, 0, 1, 2, 3, 4, 3, 2, 1, 0])
  assert.deepEqual(['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'].map(b), [1, 2, 3, 4, 3, 2, 1, 0])
  assert.deepEqual(['Fe', 'Cu', 'Ag', 'Au', 'Zn', 'U', 'Pb', 'Tl'].map(b), [3, 2, 1, 3, 2, 6, 2, 1])
  for (const e of ELEMENTS) {
    const h = hands(e)
    assert.ok(h.count >= 0 && h.count <= 4, e.symbol)
  }
  assert.deepEqual(hands(element('C')), { count: 4, giving: false })
  assert.deepEqual(hands(element('Na')), { count: 1, giving: true })
  assert.equal(hands(element('U')).count, 4)
})

test('nucleus of the commonest isotope', () => {
  assert.deepEqual(nucleus(element('C')), { A: 12, protons: 6, neutrons: 6 })
  assert.deepEqual(nucleus(element('O')), { A: 16, protons: 8, neutrons: 8 })
  assert.deepEqual(nucleus(element('U')), { A: 238, protons: 92, neutrons: 146 })
  assert.equal(nucleus(element('Tc')).A, 97)
  for (const e of ELEMENTS) assert.ok(nucleus(e).neutrons >= 0, e.symbol)
})

test('Lewis places: singles on each side first, then pairs', () => {
  const { lewisSlots } = ATOM
  assert.deepEqual(lewisSlots(4, 8), [true, false, true, false, true, false, true, false])
  assert.deepEqual(lewisSlots(6, 8), [true, true, true, true, true, false, true, false])
  assert.equal(lewisSlots(7, 8).filter(Boolean).length, 7)
  assert.deepEqual(lewisSlots(1, 2), [true, false])
})

test('discovery years follow one rule (recognised or isolated, not a compound known earlier)', () => {
  assert.equal(element('F').discovered, 1886)
  assert.equal(element('Al').discovered, 1825)
  assert.equal(element('Ca').discovered, 1808)
  assert.equal(element('O').discovered, 1774)
  assert.equal(element('Au').ancient, true)
  assert.ok(!/Ramsey|Fredrich|Tenant\b/.test(ELEMENTS.map(e => e.discoverers ?? '').join(' ')))
})
