import { test } from 'node:test'
import assert from 'node:assert/strict'
import { coverId, setCover, insets, freeArea } from './covers.js'

test('the largest cover per edge counts, cleared ones are forgotten', () => {
  const a = coverId()
  const b = coverId()
  setCover(a, { side: 'right', size: 300 })
  setCover(b, { side: 'right', size: 120 })
  assert.equal(insets().right, 300)
  setCover(a, null)
  assert.equal(insets().right, 120)
  setCover(b, null)
  assert.deepEqual(insets(), { top: 0, right: 0, bottom: 0, left: 0 })
})

test('the 3D keeps at least a third of each side', () => {
  const f = freeArea(400, 800, { top: 50, right: 0, bottom: 700, left: 0 })
  assert.ok(Math.abs(f.h - 800 / 3) < 1e-9)
  assert.ok(f.y > 0)
  assert.equal(f.w, 400)
  assert.deepEqual(freeArea(1000, 600, { top: 60, right: 400, bottom: 0, left: 0 }), { x: 0, y: 60, w: 600, h: 540 })
})
