import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { useChart, nuclide } from '../../chem/nucleus.js'
import { sDecay, sRun, rPath, rProducts, elementsOf, settle, SEED, R_TOP } from './neutrons.js'

useChart(JSON.parse(readFileSync(new URL('../../data/nuclides.json', import.meta.url), 'utf8')))

test('the slow capture: what decays first and what waits for the next neutron', () => {
  assert.equal(sDecay(26, 30), null) // iron-56 is stable
  assert.equal(sDecay(26, 33)?.mode, 'B-') // iron-59 (44.5 days) turns into cobalt first
  assert.equal(sDecay(26, 33).Z, 27)
  assert.equal(sDecay(43, 56), null) // technetium-99 (211,000 years) catches the next neutron
})

test('the slow capture climbs the valley from iron to lead and goes round lead and bismuth', () => {
  const steps = sRun(SEED.Z, SEED.N, 200)
  // never far from stability: every nucleus on the way is known, none past the drip lines
  for (const s of steps) assert.notEqual(nuclide(s.Z, s.N).kind, 'unknown', `${s.Z}-${s.Z + s.N}`)
  const zs = new Set(steps.map(s => s.Z))
  for (const z of [27, 28, 38, 43, 56, 79, 82, 83]) assert.ok(zs.has(z), `passes Z=${z}`)
  // technetium on the way (Merrill saw it in red giants in 1952: the proof that stars make elements)
  assert.ok(steps.some(s => s.Z === 43 && s.N === 56))
  // the end: bismuth-209 + n -> bismuth-210 -> polonium-210 -> alpha -> lead-206
  const toPb206 = steps.findIndex(s => s.op === 'A' && s.Z === 82 && s.N === 124)
  assert.ok(toPb206 > 0)
  assert.equal(steps[toPb206 - 1].Z, 84)
  assert.ok(Math.max(...steps.map(s => s.Z)) <= 84)
  // about 150 neutrons from iron to lead
  const toLead = steps.findIndex(s => s.Z === 82)
  const n = steps.slice(0, toLead).filter(s => s.op === 'n').length
  assert.ok(n > 140 && n < 160, `${n} neutrons to lead`)
})

test('the rapid capture runs far out on the neutron-rich side and up to plutonium', () => {
  const path = rPath()
  assert.equal(path[0].op, 'seed')
  assert.equal(path[path.length - 1].Z, R_TOP)
  for (const s of path) assert.notEqual(nuclide(s.Z, s.N).kind, 'unknown', `${s.Z}-${s.Z + s.N}`)
  // far from stability: zinc on the path has 50 or more neutrons (zinc-64, stable, has 34)
  assert.ok(Math.max(...path.filter(s => s.Z === 30).map(s => s.N)) >= 50)
})

test('the rapid capture decays back into gold, platinum, thorium and uranium', () => {
  const products = rProducts()
  const at = A => products.find(p => p.A === A).to
  assert.deepEqual(at(197), { Z: 79, N: 118, way: at(197).way }) // gold-197
  assert.equal(at(195).Z, 78) // platinum-195
  assert.equal(at(232).Z, 90) // thorium-232
  assert.equal(at(235).Z, 92) // uranium-235
  assert.equal(at(238).Z, 92) // uranium-238
  const els = elementsOf(products)
  for (const z of [53, 54, 63, 78, 79, 90, 92]) assert.ok(els.includes(z), `makes Z=${z}`)
  // no technetium or promethium survives (no long-lived isotope), nor anything past uranium
  assert.ok(!els.includes(43) && !els.includes(61) && Math.max(...els) === 92)
  // every product is stable or lasts long enough to be on Earth still
  for (const p of products) {
    const k = nuclide(p.to.Z, p.to.N)
    assert.ok(k.kind === 'stable' || k.t > 1e16, `${p.A}: ${p.to.Z}-${p.A}`)
  }
})

test('settling keeps the mass number through beta decays', () => {
  const s = settle(36, 54) // krypton-90, a fission product: four beta decays to zirconium-90
  assert.deepEqual([s.Z, s.N], [40, 50])
  assert.ok(s.way.every(m => m === 'B-'))
})
