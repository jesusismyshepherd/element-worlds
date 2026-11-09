// The lab's clouds (bondDomains.js): every valence electron drawn once, the shapes chemists draw.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from '../../chem/build.js'
import { relax } from '../../chem/layout.js'
import { element } from '../../data/elements.js'
import { valenceElectrons } from '../../chem/atom.js'
import { domainsOf, electronsIn, polarity, density, levelOf, zetaOf, lambdaOf } from './bondDomains.js'

const build = (atoms, pairs) => {
  let mol = { atoms: atoms.map((el, k) => ({ el, id: String(k) })), bonds: [] }
  for (const [i, j] of pairs) mol = join(mol, i, j) ?? mol
  const lay = relax(mol, {}, { steps: 400, bond: 2.3 })
  return { mol, lay, clouds: domainsOf(mol, lay.pos, lay.extra) }
}
const kinds = clouds => clouds.reduce((a, c) => ({ ...a, [c.kind]: (a[c.kind] ?? 0) + 1 }), {})
const valence = atoms => atoms.reduce((a, el) => a + valenceElectrons(element(el)), 0)

test('every valence electron is in exactly one cloud', () => {
  for (const [atoms, pairs] of [
    [['H', 'H'], [[0, 1]]],
    [['O', 'H', 'H'], [[0, 1], [0, 2]]],
    [['C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3], [0, 4]]],
    [['C', 'O', 'O'], [[0, 1], [0, 1], [0, 2], [0, 2]]],
    [['N', 'N'], [[0, 1], [0, 1], [0, 1]]],
    [['O', 'O'], [[0, 1], [0, 1]]],
    [['C', 'C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 1], [0, 2], [0, 3], [1, 4], [1, 5]]],
    [['H', 'Cl'], [[0, 1]]],
    [['Na', 'Cl'], [[0, 1]]],
    [['Mg', 'O'], [[0, 1], [0, 1]]],
    [['Ca', 'Cl', 'Cl'], [[0, 1], [0, 2]]],
    // half-built: free hands are clouds with one electron each
    [['O', 'H'], [[0, 1]]],
    [['C'], []],
    [['H'], []],
  ]) {
    const { clouds } = build(atoms, pairs)
    assert.equal(electronsIn(clouds), valence(atoms), atoms.join(''))
  }
})

test('the shapes: methane four bonds, water two bonds and two lone pairs, nitrogen a triple bond', () => {
  assert.deepEqual(kinds(build(['C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3], [0, 4]]).clouds), { sigma: 4 })
  assert.deepEqual(kinds(build(['O', 'H', 'H'], [[0, 1], [0, 2]]).clouds), { sigma: 2, lone: 2 })
  assert.deepEqual(kinds(build(['N', 'N'], [[0, 1], [0, 1], [0, 1]]).clouds), { sigma: 1, pi: 2, lone: 2 })
  assert.deepEqual(kinds(build(['C', 'C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 1], [0, 2], [0, 3], [1, 4], [1, 5]]).clouds), { sigma: 5, pi: 1 })
  assert.deepEqual(kinds(build(['H'], []).clouds), { free: 1 })
  assert.deepEqual(kinds(build(['Na', 'Cl'], [[0, 1]]).clouds), { ion: 1, lone: 3 })
  // ethene's π cloud stands at right angles to the plane of its atoms
  const { lay, clouds } = build(['C', 'C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 1], [0, 2], [0, 3], [1, 4], [1, 5]])
  const pi = clouds.find(c => c.kind === 'pi')
  for (const h of [2, 3]) {
    const v = lay.pos[h].map((x, k) => x - lay.pos[0][k])
    const l = Math.hypot(...v)
    assert.ok(Math.abs(v.reduce((a, x, k) => a + x * pi.dA[k], 0) / l) < 0.15, 'π axis at right angles to C-H')
  }
  // nitrogen's two π clouds at right angles to each other
  const n2 = build(['N', 'N'], [[0, 1], [0, 1], [0, 1]]).clouds.filter(c => c.kind === 'pi')
  assert.ok(Math.abs(n2[0].dA.reduce((a, x, k) => a + x * n2[1].dA[k], 0)) < 1e-6)
})

test('a shared cloud leans toward the more electronegative atom: water is polar, hydrogen gas is not', () => {
  const oh = polarity('O', 'H')
  assert.ok(oh.cA > oh.cB, 'O-H: more of the cloud near the oxygen')
  const hh = polarity('H', 'H')
  assert.equal(hh.cA, hh.cB)
  // the density at a point a third of the way from O toward H is more than a third of the way from H toward O
  const { mol, lay, clouds } = build(['O', 'H', 'H'], [[0, 1], [0, 2]])
  const bond = clouds.find(c => c.kind === 'sigma')
  const at = f => bond.A.map((x, k) => x + (bond.B[k] - x) * f)
  assert.ok(density(bond, at(0.3)) > density(bond, at(0.7)))
  assert.ok(mol && lay)
})

test('sizes and hybrids: sodium holds its electron loosely, fluorine tightly; hydrogen is a plain sphere', () => {
  assert.ok(zetaOf('Na') < zetaOf('C') && zetaOf('C') < zetaOf('F'))
  assert.equal(lambdaOf('H', 1), 0)
  assert.equal(lambdaOf('C', 4), Math.sqrt(3))
  assert.equal(lambdaOf('C', 3), Math.sqrt(2))
  assert.equal(lambdaOf('C', 2), 1)
  const { clouds } = build(['C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3], [0, 4]])
  for (const c of clouds) assert.ok(levelOf(c) > 0 && Number.isFinite(levelOf(c)))
})

test('the clouds\' words in every language at both depths', async () => {
  const { labCloudLine, cloudKey, LAB_CLOUD_WORDS } = await import('./cloudWords.js')
  const { CODES } = await import('../../i18n/langs.js')
  const cases = [
    { show: 'O2', free: 0, bonds: 1, pi: 1, ionic: null, polar: null },
    { show: 'NaCl', free: 0, bonds: 1, pi: 0, ionic: { anion: 'Cl', cation: 'Na' }, polar: null },
    { show: null, free: 1, bonds: 1, pi: 0, ionic: null, polar: { sym: 'O' } },
    { show: null, free: 3, bonds: 0, pi: 0, ionic: null, polar: null },
    { show: 'H2O', free: 0, bonds: 2, pi: 0, ionic: null, polar: { sym: 'O' } },
    { show: 'C2H4', free: 0, bonds: 5, pi: 1, ionic: null, polar: null },
    { show: 'CH4', free: 0, bonds: 4, pi: 0, ionic: null, polar: null },
  ]
  for (const lang of CODES) {
    assert.ok(LAB_CLOUD_WORDS[lang], lang)
    for (const k of ['sigma', 'pi', 'lone', 'free', 'ion']) assert.ok(cloudKey(lang)[k], `${lang} key ${k}`)
    for (const level of ['explorer', 'scientist']) for (const c of cases) {
      const line = labCloudLine(c, lang, level)
      assert.ok(line && line.length > 20 && !/undefined|NaN/.test(line), `${lang} ${level} ${JSON.stringify(c)}: ${line}`)
      assert.ok(!line.includes('—'), `${lang} ${level}: an em dash`)
    }
  }
  assert.equal(labCloudLine({ free: 0, bonds: 0, ionic: null }, 'en', 'explorer'), null)
  assert.match(labCloudLine(cases[4], 'en', 'explorer'), /^Oxygen pulls the shared clouds/)
})
