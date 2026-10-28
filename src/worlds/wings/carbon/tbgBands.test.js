import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TBG, bandsAt, widthAt, speedAt } from './tbgBands.js'

test('the bands are read for any angle from 0.5 to 12 degrees', () => {
  assert.equal(bandsAt(0.2), null)
  const e = bandsAt(2.37)
  assert.equal(e.length, TBG.x.length * TBG.bands)
  assert.ok(e.every(Number.isFinite))
  // the path starts and ends at K', and passes K, Gamma and M
  assert.deepEqual(TBG.ticks.map(t => t.label), ['K′', 'K', 'Γ', 'M', 'K′'])
})

test('the middle bands are flattest at the magic angle, where the electrons almost stop', () => {
  const flattest = TBG.angles.reduce((best, a) => (widthAt(a) < widthAt(best) ? a : best), TBG.angles[0])
  assert.ok(Math.abs(flattest - 1.1) < 0.06, `flattest at ${flattest}`)
  assert.ok(widthAt(1.1) < 10, `${widthAt(1.1)} meV`)
  assert.ok(speedAt(1.1) < 0.03)
  // far from it, graphene's own speed comes back
  assert.ok(speedAt(12) > 0.95 && speedAt(12) < 1)
  assert.ok(widthAt(3) > 50 * widthAt(1.1))
})

test('at the Dirac point K the two middle bands meet at zero energy', () => {
  const e = bandsAt(1.5)
  const k = TBG.x.findIndex(x => Math.abs(x - TBG.ticks[1].x) < 1e-3)
  const mid = TBG.bands / 2
  assert.ok(Math.abs(e[k * TBG.bands + mid] - e[k * TBG.bands + mid - 1]) < 3)
})
