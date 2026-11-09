import { test } from 'node:test'
import assert from 'node:assert/strict'
import { STRUCTURES, COMPOUNDS, COMPOUND, COMPLICATED, IONS, CATION, ANION, neighbours, keyOf, pointOf, radiusOf, nearestDistance, grainCount, radiusRatio, chargeText } from './lattice.js'
import { KNOWN } from '../../../chem/build.js'

test('every point of each structure has its coordination number of neighbours, all of the other kind', () => {
  for (const [name, S] of Object.entries(STRUCTURES)) {
    let seen = [0, 0]
    for (let x = -4; x <= 4; x++) {
      for (let y = -4; y <= 4; y++) {
        for (let z = -4; z <= 4; z++) {
          const k = S.kind(x, y, z)
          if (k < 0) continue
          seen[k] += 1
          const nb = neighbours(name, x, y, z)
          assert.equal(nb.length, S.cn[k], `${name} (${x},${y},${z})`)
          for (const [a, b, c] of nb) assert.equal(S.kind(a, b, c), 1 - k)
        }
      }
    }
    assert.ok(seen[0] > 0 && seen[1] > 0, name)
  }
})

test('the ions in a cell: rock salt 4 + 4, fluorite 4 cations and 8 anions, antifluorite the other way', () => {
  const inCell = name => {
    const S = STRUCTURES[name]
    const n = [0, 0]
    for (let x = 0; x < S.div; x++) for (let y = 0; y < S.div; y++) for (let z = 0; z < S.div; z++) {
      const k = S.kind(x, y, z)
      if (k >= 0) n[k] += 1
    }
    return n
  }
  assert.deepEqual(inCell('rocksalt'), [4, 4])
  assert.deepEqual(inCell('fluorite'), [4, 8])
  assert.deepEqual(inCell('antifluorite'), [8, 4])
  for (const [name, S] of Object.entries(STRUCTURES)) assert.equal(inCell(name)[0] + inCell(name)[1], S.ionsPerCell)
})

test('points pack into keys and back', () => {
  for (const p of [[0, 0, 0], [-7, 3, 11], [500, -500, 1], [-1, -1, -1]]) assert.deepEqual(pointOf(keyOf(...p)), p)
})

test('Shannon radii for the coordination each ion has (pm)', () => {
  assert.equal(radiusOf('NaCl', CATION), 102)
  assert.equal(radiusOf('NaCl', ANION), 181)
  assert.equal(radiusOf('CaF2', CATION), 112) // eight fluorides round each calcium
  assert.equal(radiusOf('CaF2', ANION), 131) // four calciums round each fluoride
  assert.equal(radiusOf('Li2O', CATION), 59)
  assert.equal(radiusOf('Li2O', ANION), 142)
  assert.equal(radiusOf('MgO', CATION), 72)
  // the hydride: half the cell less the cation
  assert.equal(radiusOf('LiH', ANION), Math.round(408.3 / 2 - 76))
  assert.equal(radiusOf('NaH', ANION), Math.round(488 / 2 - 102))
})

test('the radii add up to the distance the cell gives (within 4 %)', () => {
  for (const c of COMPOUNDS) {
    const sum = radiusOf(c, CATION) + radiusOf(c, ANION)
    const d = nearestDistance(c)
    assert.ok(Math.abs(sum - d) / d < 0.04, `${c.id}: ${sum} pm against ${d.toFixed(1)} pm`)
  }
})

test('rock salt radius ratios fall where the structure is expected or near it', () => {
  for (const c of COMPOUNDS.filter(x => x.structure === 'rocksalt')) {
    const r = radiusRatio(c)
    assert.ok(r > 0.38 && r < 1.1, `${c.id} ${r}`)
  }
})

test('a grain of salt 0.3 mm across: about 1.2 × 10^18 ions, half of them formula units', () => {
  const g = grainCount('NaCl')
  assert.ok(Math.abs(g.ions / 1.2e18 - 1) < 0.01, String(g.ions))
  assert.ok(Math.abs(g.units * 2 - g.ions) < 1)
  // its mass from the density (2.165 g/cm3): 0.0585 mg, and from the count and the molar mass the same
  const mass = (g.units * 58.44) / 6.02214e23
  assert.ok(Math.abs(mass / (2.165 * 0.03 ** 3) - 1) < 0.02, String(mass))
})

test('the compounds are the lab’s ionic ones: modelled or named as more complicated, every one', () => {
  const ionic = KNOWN.filter(k => k.ionic).map(k => k.show).sort()
  const here = [...COMPOUNDS.map(c => c.id), ...Object.keys(COMPLICATED)].sort()
  assert.deepEqual(here, ionic)
  for (const c of COMPOUNDS) {
    assert.ok(IONS[c.cation].q > 0 && IONS[c.anion].q < 0, c.id)
    assert.ok(['water', 'melt'].includes(c.medium), c.id)
    assert.ok(c.a > 300 && c.a < 700, c.id)
    // neutral: the formula's charges add to nothing
    const per = c.structure === 'rocksalt' ? [1, 1] : c.structure === 'fluorite' ? [1, 2] : [2, 1]
    assert.equal(per[0] * IONS[c.cation].q + per[1] * IONS[c.anion].q, 0, c.id)
    if (c.medium === 'melt') assert.ok(c.solubility != null || c.water, `${c.id}: why not from water`)
  }
  assert.equal(COMPOUND.NaCl.medium, 'water')
})

test('charges as text', () => {
  assert.equal(chargeText(1), '+')
  assert.equal(chargeText(2), '2+')
  assert.equal(chargeText(-1), '−')
  assert.equal(chargeText(-2), '2−')
})
