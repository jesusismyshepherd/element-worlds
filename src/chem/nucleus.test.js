import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { useChart, nuclide, decay, chain, ionShells, nuclideSymbol, commonestN, halfLifeParts, modeFamily, knownRange, collide } from './nucleus.js'

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

test('the beam: famous reactions as history saw them, and superheavies made as they were', () => {
  const r = (Z, N, beam) => {
    const c = collide(Z, N, beam)
    return [c.famous, c.result.Z, c.result.N, c.out.join(' ')]
  }
  assert.deepEqual(r(7, 7, 'a'), ['transmute', 8, 9, 'proton']) // Rutherford 1919: N-14 + alpha -> O-17 + p
  assert.deepEqual(r(4, 5, 'a'), ['neutron', 6, 6, 'neutron']) // Chadwick 1932: Be-9 + alpha -> C-12 + n
  assert.deepEqual(r(92, 143, 'n'), ['fission', 56, 85, 'fragment neutron neutron neutron'])
  assert.deepEqual(r(1, 1, 't'), ['fusion', 2, 2, 'neutron'])
  // hot fusion on actinides boils off three neutrons: oganesson-294 from californium-249 (Dubna 2006),
  // tennessine-294 from berkelium-249 (2010)
  assert.deepEqual(r(98, 151, 'Ca48'), [null, 118, 176, 'neutron neutron neutron'])
  assert.deepEqual(r(97, 152, 'Ca48'), [null, 117, 177, 'neutron neutron neutron'])
  // cold fusion on bismuth and lead boils off one: meitnerium-266 (GSI 1982), copernicium-277 (1996),
  // nihonium-278 (RIKEN 2004)
  assert.deepEqual(r(83, 126, 'Fe58'), [null, 109, 157, 'neutron'])
  assert.deepEqual(r(82, 126, 'Zn70'), [null, 112, 165, 'neutron'])
  assert.deepEqual(r(83, 126, 'Zn70'), [null, 113, 165, 'neutron'])
  // a light pair just fuses
  assert.deepEqual(r(6, 6, 'a'), [null, 8, 8, ''])
  // every famous reaction keeps its protons and neutrons (what goes in comes out)
  const NUC = { proton: [1, 0], neutron: [0, 1], alpha: [2, 2], positron: [1, -1], neutrino: [0, 0] } // (a positron leaves as a proton turns into a neutron)
  for (const [Z, N, beam] of [[1, 0, 'p'], [1, 1, 't'], [1, 2, 'd'], [3, 4, 'p'], [4, 5, 'a'], [4, 4, 'a'], [7, 7, 'n'], [7, 7, 'a'], [13, 14, 'a'], [92, 143, 'n']]) {
    const c = collide(Z, N, beam)
    let z = c.result.Z
    let n = c.result.N
    for (const o of c.out) {
      if (o === 'fragment') {
        z += c.fragment.Z
        n += c.fragment.N
      } else {
        z += NUC[o][0]
        n += NUC[o][1]
      }
    }
    assert.deepEqual([z, n], [c.compound.Z, c.compound.N], `${Z},${N} + ${beam}`)
  }
})
