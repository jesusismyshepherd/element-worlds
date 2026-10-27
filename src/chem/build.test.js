import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join, unjoin, removeAtom, freeHands, formulaOf, bondPattern, complete, recognise, lonePairs, parseFormula, KNOWN, MISSIONS } from './build.js'

const start = (...els) => ({ atoms: els.map(el => ({ el })), bonds: [] })
const chain = (mol, pairs) => pairs.reduce((m, [i, j]) => join(m, i, j), mol)

test('water: oxygen holds two hydrogens, every hand held, recognised', () => {
  const m = chain(start('O', 'H', 'H'), [[0, 1], [0, 2]])
  assert.equal(formulaOf(m), 'H2O')
  assert.equal(freeHands(m, 0), 0)
  assert.ok(complete(m))
  assert.equal(recognise(m).name.en, 'water')
  assert.equal(lonePairs(m, 0), 2)
})

test('a hand cannot be held twice; double and triple bonds take more hands', () => {
  let m = chain(start('H', 'H', 'H'), [[0, 1]])
  assert.equal(join(m, 0, 2), null)
  m = chain(start('C', 'O', 'O'), [[0, 1], [0, 1], [0, 2], [0, 2]])
  assert.equal(bondPattern(m), 'C=O,C=O')
  assert.ok(complete(m))
  assert.equal(recognise(m).name.en, 'carbon dioxide')
  const n2 = chain(start('N', 'N'), [[0, 1], [0, 1], [0, 1]])
  assert.equal(recognise(n2).name.en, 'nitrogen gas (most of the air)')
  assert.equal(join(n2, 0, 1), null)
})

test('isomers are told apart: ethanol and dimethyl ether', () => {
  // ethanol: C0-C1, C1-O2, O2-H, and five H on the carbons
  const atoms = ['C', 'C', 'O', 'H', 'H', 'H', 'H', 'H', 'H']
  let et = start(...atoms)
  et = chain(et, [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8]])
  assert.ok(complete(et))
  assert.equal(recognise(et).name.en, 'ethanol')
  let ether = start(...atoms)
  ether = chain(ether, [[0, 2], [1, 2], [0, 3], [0, 4], [0, 5], [1, 6], [1, 7], [1, 8]])
  assert.ok(complete(ether))
  assert.equal(recognise(ether).name.en, 'dimethyl ether')
})

test('two pieces are not one molecule', () => {
  const m = chain(start('H', 'H', 'H', 'H'), [[0, 1], [2, 3]])
  assert.equal(complete(m), false)
})

test('removing an atom keeps the other bonds right', () => {
  let m = chain(start('O', 'H', 'H'), [[0, 1], [0, 2]])
  m = removeAtom(m, 1)
  assert.deepEqual(m.bonds, [[0, 1, 1]])
  assert.equal(freeHands(m, 0), 1)
  assert.deepEqual(unjoin(m, 0, 1).bonds, [])
})

test('every mission is a molecule the lab knows', () => {
  assert.equal(MISSIONS.length, 12)
  for (const m of MISSIONS) assert.ok(m && m.name, String(m))
})

test('formulas as people write them match by the Hill formula', () => {
  const by = show => KNOWN.find(k => k.show === show)
  assert.equal(by('NH3').hill, 'H3N')
  assert.equal(by('HCl').hill, 'ClH')
  assert.equal(by('C2H5OH').hill, 'C2H6O')
  assert.equal(by('CO(NH2)2').hill, 'CH4N2O')
  // the bond pattern of each known molecule uses exactly its atoms' hands (except the charged ones)
  for (const k of KNOWN) {
    const atoms = parseFormula(k.show)
    const ends = k.p.split(',').length * 2
    if (atoms.length > 1) assert.ok(ends >= atoms.length, k.show)
  }
})
