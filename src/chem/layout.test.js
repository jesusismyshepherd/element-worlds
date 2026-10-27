import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from './build.js'
import { relax, angleAt } from './layout.js'

const make = (els, pairs) => pairs.reduce((m, [i, j]) => join(m, i, j), { atoms: els.map(el => ({ el })), bonds: [] })
const shape = (mol, steps = 600) => relax(mol, {}, { steps }).pos

test('carbon dioxide is a straight line', () => {
  const p = shape(make(['C', 'O', 'O'], [[0, 1], [0, 1], [0, 2], [0, 2]]))
  assert.ok(angleAt(p, 0, 1, 2) > 172, `${angleAt(p, 0, 1, 2)}`)
})

test('methane is a tetrahedron (109.5 degrees)', () => {
  const p = shape(make(['C', 'H', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3], [0, 4]]))
  for (const [a, b] of [[1, 2], [1, 3], [2, 4], [3, 4]]) {
    const ang = angleAt(p, 0, a, b)
    assert.ok(Math.abs(ang - 109.5) < 4, `${ang}`)
  }
})

test('water is bent, a little under the tetrahedral angle', () => {
  const p = shape(make(['O', 'H', 'H'], [[0, 1], [0, 2]]))
  const ang = angleAt(p, 0, 1, 2)
  assert.ok(ang > 96 && ang < 110, `${ang}`)
})

test('ammonia is a low pyramid', () => {
  const p = shape(make(['N', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3]]))
  const ang = angleAt(p, 0, 1, 2)
  assert.ok(ang > 98 && ang < 112, `${ang}`)
})

test('bonds settle near their length', () => {
  const p = shape(make(['O', 'H', 'H'], [[0, 1], [0, 2]]))
  const d = Math.hypot(...p[1].map((v, k) => v - p[0][k]))
  assert.ok(Math.abs(d - 1.6) < 0.25, `${d}`)
})

test('a long layout is turned level along x, its shape unchanged', async () => {
  const { level } = await import('./layout.js')
  const pos = [[0, -2, 0.1], [0, 0, 0], [0.05, 2, -0.1]]
  const out = level({ pos, extra: [[], [{ kind: 'lone', dir: [0, 0, 1] }], []] })
  const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
  assert.ok(Math.abs(d(out.pos[0], out.pos[2]) - d(pos[0], pos[2])) < 1e-9)
  assert.ok(Math.abs(out.pos[0][1] - out.pos[2][1]) < 0.05, 'level')
  assert.ok(Math.abs(out.pos[0][0] - out.pos[2][0]) > 3.9, 'along x')
  assert.ok(Math.abs(Math.hypot(...out.extra[1][0].dir) - 1) < 1e-9)
  // a compact shape (a tetrahedron) is left as it is
  const tet = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]
  assert.deepEqual(level({ pos: tet, extra: [] }).pos, tet)
})
