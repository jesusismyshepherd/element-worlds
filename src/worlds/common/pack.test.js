import { test } from 'node:test'
import assert from 'node:assert/strict'
import { packBall } from './pack.js'

test('a packed ball fills every octant evenly', () => {
  for (const n of [12, 56, 238, 294]) {
    const pts = packBall(n, 1)
    const oct = Array(8).fill(0)
    for (const p of pts) oct[(p.x > 0 ? 1 : 0) + (p.y > 0 ? 2 : 0) + (p.z > 0 ? 4 : 0)]++
    const want = n / 8
    for (const c of oct) assert.ok(Math.abs(c - want) <= Math.max(2, want * 0.35), `${n}: octants ${oct}`)
    assert.ok(pts.every(p => p.length() <= 1 + 1e-9))
  }
})
