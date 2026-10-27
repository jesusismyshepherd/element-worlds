import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { useChart, nuclide, decay, chain, ionShells, nuclideSymbol, commonestN, halfLifeParts, modeFamily, knownRange } from './nucleus.js'

useChart(JSON.parse(readFileSync(new URL('../data/nuclides.json', import.meta.url), 'utf8')))

test('the chart knows the stable and the radioactive', () => {
  assert.equal(nuclide(6, 6).kind, 'stable')
  assert.equal(nuclide(6, 7).kind, 'stable')
  const c14 = nuclide(6, 8)
  assert.equal(c14.kind, 'radioactive')
  assert.equal(c14.modes[0], 'B-')
  assert.ok(Math.abs(c14.t / 3.15576e7 - 5700) < 100, `C-14 half-life ${c14.t / 3.15576e7} years`)
  assert.equal(nuclide(26, 30).kind, 'stable')
  assert.equal(nuclide(43, 55).kind, 'radioactive') // technetium has no stable isotope
  assert.equal(nuclide(1, 0).kind, 'stable')
  assert.equal(nuclide(1, 2).kind, 'radioactive') // tritium
  assert.equal(nuclide(2, 3).kind, 'instant') // helium-5 sheds a neutron at once
})

test('lone neutrons, nothing, and nuclei nobody has seen', () => {
  assert.equal(nuclide(0, 0).kind, 'empty')
  assert.equal(nuclide(0, 1).kind, 'neutron')
  assert.equal(nuclide(0, 2).kind, 'neutrons')
  const far = nuclide(6, 30)
  assert.equal(far.kind, 'unknown')
  assert.equal(far.side, 'rich')
  assert.equal(nuclide(6, 0).side, 'poor')
  // one past the heaviest oganesson made: not made yet, not impossible
  const og = nuclide(118, 177)
  assert.equal(og.kind, 'unknown')
  assert.equal(og.side, null)
})

test('decays move the nucleus on the chart', () => {
  assert.deepEqual(decay(6, 8).Z, 7) // carbon-14 becomes nitrogen-14
  assert.equal(decay(6, 8).N, 7)
  assert.deepEqual(decay(92, 146), { mode: 'A', Z: 90, N: 144, emitted: ['alpha'] })
  assert.equal(decay(6, 6), null) // stable
  assert.deepEqual([decay(0, 1).Z, decay(0, 1).N], [1, 0]) // a free neutron becomes hydrogen
  const drip = decay(6, 30)
  assert.equal(drip.N, 29)
  assert.equal(modeFamily('B-'), 'betaMinus')
  assert.equal(modeFamily('EC'), 'capture')
  assert.equal(modeFamily('SF'), 'fission')
  assert.equal(modeFamily('14C'), 'cluster')
})

test('uranium-238 decays to lead-206 in 8 alpha and 6 beta steps', () => {
  const steps = chain(92, 146)
  const last = steps[steps.length - 1]
  assert.deepEqual([last.Z, last.N], [82, 124])
  assert.equal(steps.filter(s => s.mode === 'A').length, 8)
  assert.equal(steps.filter(s => s.mode === 'B-').length, 6)
  assert.equal(nuclide(82, 124).kind, 'stable')
})

test('every element has known isotopes and a sensible first isotope', () => {
  for (let z = 1; z <= 118; z++) {
    assert.ok(knownRange(z), `no isotopes for ${z}`)
    const n = commonestN(z)
    assert.notEqual(nuclide(z, n).kind, 'unknown', `${z}: ${n}`)
  }
  assert.equal(commonestN(6), 6)
  assert.equal(commonestN(92), 146)
  assert.equal(commonestN(43), 54) // technetium-97, the longest-lived (4.21 million years, NUBASE2020)
  assert.equal(commonestN(118), 176)
})

test('ions take electrons from the outside and add them to the outer shell', () => {
  assert.deepEqual(ionShells(11, 10), [2, 8]) // Na+
  assert.deepEqual(ionShells(17, 18), [2, 8, 8]) // Cl-
  assert.deepEqual(ionShells(26, 24), [2, 8, 14]) // Fe2+ loses its 4s electrons first
  assert.deepEqual(ionShells(26, 23), [2, 8, 13]) // Fe3+
  assert.deepEqual(ionShells(1, 2), [2]) // H-
  assert.deepEqual(ionShells(2, 0), [])
  assert.equal(nuclideSymbol(6, 8, 6), '¹⁴C')
  assert.equal(nuclideSymbol(11, 12, 10), '²³Na⁺')
  assert.equal(nuclideSymbol(8, 8, 10), '¹⁶O²⁻')
  assert.equal(nuclideSymbol(2, 2, 0), '⁴He²⁺')
})

test('half-lives in words', () => {
  assert.deepEqual(halfLifeParts(5700 * 3.15576e7), { value: 5700, unit: 'years' })
  assert.equal(halfLifeParts(1.4e17).unit, 'billionYears')
  assert.deepEqual(halfLifeParts(0.0007), { value: 700, unit: 'us' })
  assert.equal(halfLifeParts(6e-22).unit, 'secondsSci')
})
