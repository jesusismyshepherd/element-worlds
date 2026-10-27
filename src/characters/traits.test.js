import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, element } from '../data/elements.js'
import { traitsOf, H_MIN, H_MAX } from './traits.js'

const tr = s => traitsOf(element(s))

test('hands are bonds: hydrogen 1, oxygen 2, nitrogen 3, carbon 4, noble gases none', () => {
  assert.deepEqual(['H', 'O', 'N', 'C', 'He', 'Ne', 'F', 'Na'].map(s => tr(s).hands), [1, 2, 3, 4, 0, 0, 1, 1])
  assert.equal(tr('Na').giving, true)
  assert.equal(tr('C').giving, false)
  assert.equal(tr('Na').electronsInHands, true)
  assert.equal(tr('Fe').electronsInHands, false)
})

test('the hoop: outer electrons and the octet places', () => {
  assert.deepEqual([tr('C').valence, tr('C').places], [4, 8])
  assert.deepEqual([tr('O').valence, tr('O').places], [6, 8])
  assert.deepEqual([tr('H').valence, tr('H').places], [1, 2])
  assert.equal(tr('Ne').full, true)
  assert.equal(tr('He').full, true)
  assert.equal(tr('O').full, false)
  assert.deepEqual(tr('O').inner, [2])
  assert.deepEqual(tr('Fe').places, null)
})

test('gases float (light ones high), liquids slide, solids walk', () => {
  assert.equal(tr('C').locomotion, 'walk')
  assert.equal(tr('O').locomotion, 'float')
  assert.equal(tr('Hg').locomotion, 'slide')
  assert.equal(tr('Br').locomotion, 'slide')
  assert.ok(tr('He').hover > tr('O').hover, 'helium floats higher than oxygen')
  assert.ok(tr('H').hover > 1, 'hydrogen is far lighter than air')
  assert.ok(tr('Rn').hover < tr('O').hover, 'radon is the heaviest gas')
})

test('size follows the atomic radius: down a group bigger, along a period smaller', () => {
  for (const e of ELEMENTS) {
    const h = traitsOf(e).height
    assert.ok(h >= H_MIN - 1e-9 && h <= H_MAX + 1e-9, e.symbol)
  }
  assert.ok(tr('Li').height > tr('C').height && tr('C').height > tr('O').height)
  assert.ok(tr('Cs').height > tr('Na').height && tr('Na').height > tr('Li').height)
  assert.ok(tr('La').height > tr('Lu').height, 'the lanthanide contraction')
})

test('materials, colours and family marks', () => {
  assert.equal(tr('Fe').material, 'metal')
  assert.equal(tr('Si').material, 'metalloid')
  assert.equal(tr('C').material, 'nonmetal')
  assert.equal(tr('Ar').material, 'noble')
  assert.equal(tr('Cu').body, '#e0875e')
  assert.equal(tr('O').body, '#ff0d0d')
  assert.equal(tr('Ne').body, '#ff5a3c')
  assert.equal(tr('Na').mark, 'flame')
  assert.equal(tr('Cl').mark, 'crest')
  assert.equal(tr('Kr').mark, 'halo')
  assert.equal(tr('H').mark, 'curl')
  assert.equal(tr('Og').superheavy, true)
})

test('heavier, smaller walkers are slower; floaters glide', () => {
  assert.ok(tr('Cs').speeds.walk > tr('Be').speeds.walk)
  assert.ok(tr('U').speeds.walk < tr('Ba').speeds.walk * 1.1)
  for (const e of ELEMENTS) assert.ok(traitsOf(e).speeds.run > traitsOf(e).speeds.walk, e.symbol)
})
