import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MOLECULES, checkHands, formula } from './molecules.js'

const dist = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]))

test('every molecule uses exactly every hand of every atom', () => {
  for (const mol of Object.values(MOLECULES)) assert.deepEqual(checkHands(mol), [], mol.id)
})

test('a molecule with a free hand is caught', () => {
  const oh = { atoms: [{ el: 'O', p: [0, 0, 0] }, { el: 'H', p: [1, 0, 0] }], bonds: [[0, 1, 1]] }
  assert.deepEqual(checkHands(oh).map(a => a.el), ['O'])
})

test('shapes: water bent at 104.5°, methane tetrahedral, bond lengths kept', () => {
  const [o, h1, h2] = MOLECULES.H2O.atoms.map(a => a.p)
  const v1 = h1.map((x, i) => x - o[i])
  const v2 = h2.map((x, i) => x - o[i])
  const cos = v1.reduce((s, x, i) => s + x * v2[i], 0) / (dist(h1, o) * dist(h2, o))
  assert.ok(Math.abs((Math.acos(cos) * 180) / Math.PI - 104.5) < 0.01)
  const c = MOLECULES.CH4.atoms[0].p
  for (const a of MOLECULES.CH4.atoms.slice(1)) assert.ok(Math.abs(dist(a.p, c) - 1.09) < 1e-9)
  const hs = MOLECULES.CH4.atoms.slice(1).map(a => a.p)
  assert.ok(Math.abs(dist(hs[0], hs[1]) - dist(hs[2], hs[3])) < 1e-9)
  const n = MOLECULES.NH3.atoms
  assert.ok(Math.abs(dist(n[1].p, n[0].p) - 1.01) < 1e-9)
})

test('formulas with subscripts', () => {
  assert.equal(formula('CO2'), 'CO₂')
  assert.equal(formula('C6H6'), 'C₆H₆')
})
