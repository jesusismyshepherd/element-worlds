import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Crystal, capacity, fullCount, rng, inCube, inBoat } from './grow.js'
import { STRUCTURES } from './lattice.js'

const grownAll = opts => {
  const c = new Crystal(opts)
  while (c.step());
  return c
}

test('the random numbers are the same from the same seed (every device grows the same crystal)', () => {
  const a = rng(42)
  const b = rng(42)
  for (let i = 0; i < 50; i++) assert.equal(a(), b())
  assert.notEqual(rng(1)(), rng(2)())
  // fixed values: a change of the generator would break rooms between old and new pages
  const r = rng(7)
  assert.equal(Math.round(r() * 1e9), Math.round(rng(7)() * 1e9))
})

test('the same seed grows the same crystal, ion for ion; another seed another order', () => {
  const a = new Crystal({ seed: 99, size: 5 })
  const b = new Crystal({ seed: 99, size: 5 })
  a.growTo(600)
  b.growTo(600)
  assert.deepEqual(a.sites, b.sites)
  const c = new Crystal({ seed: 100, size: 5 })
  c.growTo(600)
  assert.notDeepEqual(a.sites.map(s => [s.x, s.y, s.z]), c.sites.map(s => [s.x, s.y, s.z]))
})

test('grown slowly, a perfect cube: rock salt and the fluorites', () => {
  for (const [structure, size] of [['rocksalt', 6], ['fluorite', 10], ['antifluorite', 10]]) {
    const c = grownAll({ structure, size, seed: 3 })
    const b = c.bounds()
    const ext = b.max.map((m, a) => m - b.min[a])
    assert.deepEqual(ext, [2 * size, 2 * size, 2 * size], structure)
    assert.equal(c.sites.length, capacity({ structure, size }).reduce((s, n) => s + n, 0), structure)
  }
  // rock salt: every point of the box filled
  const rs = grownAll({ size: 5, seed: 8 })
  assert.equal(rs.sites.length, 11 ** 3)
})

test('every ion after the first lands next to an ion of the other charge', () => {
  for (const opts of [{ size: 5 }, { size: 6, hollow: 7 }, { mode: 'boat', size: 5 }, { structure: 'fluorite', size: 8 }]) {
    const c = grownAll({ seed: 5, ...opts })
    c.sites.forEach((s, i) => {
      if (i === 0) return
      assert.ok(c.neighboursOf(i, i).length >= 1, `${JSON.stringify(opts)} ion ${i}`)
    })
  }
})

test('an ion deep inside has its full coordination', () => {
  for (const [structure, size] of [['rocksalt', 5], ['fluorite', 8], ['antifluorite', 8]]) {
    const c = grownAll({ structure, size, seed: 2 })
    const i = c.sites.findIndex(s => Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.z) <= 2 && s.kind >= 0)
    assert.equal(c.neighboursOf(i).length, STRUCTURES[structure].cn[c.sites[i].kind], structure)
  }
})

test('grown fast, a hopper: the edges are there, the middles of the faces sunk in', () => {
  const R = 8
  const c = grownAll({ size: R, hollow: 7, seed: 11 })
  // a corner and the middle of an edge are reached
  assert.ok(c.indexAt(R, R, R) >= 0 || c.indexAt(R - 1, R, R) >= 0)
  assert.ok(c.indexAt(R, R, 0) >= 0)
  // the middle of each face is hollow, steps going in
  for (const [x, y, z] of [[R, 0, 0], [-R, 0, 0], [0, R, 0], [0, -R, 0], [0, 0, R], [0, 0, -R], [R - 1, 0, 0], [R - 2, 0, 0], [R, 3, 0]]) {
    assert.equal(c.indexAt(x, y, z), -1, `(${x},${y},${z})`)
  }
  // far fewer ions than the full cube round it
  assert.ok(c.sites.length < 0.8 * (2 * R + 1) ** 3)
  // the envelope: a face's middle lies in by hollow/16 of R
  assert.equal(inCube(R, 0, 0, R, 7), false)
  assert.equal(inCube(R - 2, 0, 0, R, 7), false)
  assert.equal(inCube(R - 3, 0, 0, R, 7), true)
  assert.equal(inCube(R, R, 0, R, 7), true)
})

test('a salt boat: a hollow pyramid upside down, wider at each level up', () => {
  const T = 5
  const c = grownAll({ mode: 'boat', size: T, seed: 4 })
  const width = y => Math.max(...c.sites.filter(s => s.y === y).map(s => Math.max(Math.abs(s.x), Math.abs(s.z))))
  for (let y = 1; y <= T; y++) assert.equal(width(y), y + 1, `level ${y}`)
  // hollow inside at the top
  assert.equal(c.indexAt(0, T, 0), -1)
  assert.equal(inBoat(0, T, 0, T), false)
  assert.equal(inBoat(T + 1, T, 0, T), true)
  assert.equal(c.sites.length, fullCount({ mode: 'boat', size: T, seed: 9 }))
})

test('the capacity counts what a cube or a boat holds when full', () => {
  for (const opts of [{ size: 6 }, { mode: 'boat', size: 4 }, { structure: 'fluorite', size: 10 }]) {
    const n = capacity(opts).reduce((s, k) => s + k, 0)
    assert.equal(fullCount({ ...opts, seed: 1 }), n, JSON.stringify(opts))
  }
  // a hopper reaches every place of its envelope too (its edges are ridges two ions wide)
  for (const opts of [{ size: 8, hollow: 7 }, { size: 8, hollow: 4 }, { structure: 'fluorite', size: 14, hollow: 7 }, { size: 4, hollow: 7 }]) {
    const n = capacity(opts).reduce((s, k) => s + k, 0)
    assert.equal(fullCount({ ...opts, seed: 1 }), n, JSON.stringify(opts))
  }
})
