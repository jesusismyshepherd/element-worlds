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

// ---- rings (2026-11-09: benzene, glucose and the DNA bases in the lab) ----
const ringTools = async () => {
  const b = await import('./build.js')
  const l = await import('./layout.js')
  // how far the atoms stand from the plane that fits them best, in bonds
  const offPlane = (pos, idx) => {
    const pts = idx.map(i => pos[i])
    const c = [0, 1, 2].map(k => pts.reduce((s, p) => s + p[k], 0) / pts.length)
    const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    for (const p of pts) for (let a = 0; a < 3; a++) for (let q = 0; q < 3; q++) m[a][q] += (p[a] - c[a]) * (p[q] - c[q])
    const n = l.eigen3(m)[2].vector
    return pts.map(p => (p[0] - c[0]) * n[0] + (p[1] - c[1]) * n[1] + (p[2] - c[2]) * n[2])
  }
  return { b, l, offPlane }
}

test('benzene is a flat hexagon, its hydrogens pointing straight out (the lab\'s "show me")', async () => {
  const { b, l, offPlane } = await ringTools()
  const mol = b.fromBuild(b.RING_BUILDS.C6H6)
  const { pos } = l.level(relax(mol, {}, { steps: 500, bond: 2.3 }))
  const ring = [0, 1, 2, 3, 4, 5]
  for (const d of offPlane(pos, [...ring, 6, 7, 8, 9, 10, 11])) assert.ok(Math.abs(d) < 0.05 * 2.3, `off the plane by ${d}`)
  for (let t = 0; t < 6; t++) {
    const ang = angleAt(pos, ring[t], ring[(t + 5) % 6], ring[(t + 1) % 6])
    assert.ok(Math.abs(ang - 120) < 3, `ring angle ${ang}`)
    // the hydrogen on the bisector, outwards: 120 degrees from both ring neighbours
    for (const nb of [ring[(t + 5) % 6], ring[(t + 1) % 6]]) {
      const h = angleAt(pos, ring[t], t + 6, nb)
      assert.ok(Math.abs(h - 120) < 3, `H-C-C ${h}`)
    }
  }
  // facing the default view: the ring's plane across z
  const zs = ring.map(i => pos[i][2])
  assert.ok(Math.max(...zs) - Math.min(...zs) < 0.1, 'facing the view')
})

test('benzene built atom by atom in the lab, the ring closed by hand, is a flat hexagon too', async () => {
  const { b, l, offPlane } = await ringTools()
  let mol = { atoms: [], bonds: [] }
  let lay = { pos: [], extra: [] }
  const frames = k => {
    for (let f = 0; f < k; f++) lay = relax(mol, lay, { steps: 3, bond: 2.3 })
  }
  const change = next => {
    mol = next
    lay = l.level(relax(mol, lay, { steps: 160, bond: 2.3 }))
    frames(30)
  }
  // six carbons in a chain, each new one joined to the last (as the lab's palette does)
  for (let i = 0; i < 6; i++) {
    const atoms = [...mol.atoms, { el: 'C' }]
    let next = { atoms, bonds: mol.bonds }
    if (i) next = b.join(next, i - 1, i)
    change(next)
  }
  change(b.join(mol, 5, 0)) // the ring closed
  for (const [i, j] of [[0, 1], [2, 3], [4, 5]]) change(b.join(mol, i, j))
  for (let i = 0; i < 6; i++) {
    const atoms = [...mol.atoms, { el: 'H' }]
    change(b.join({ atoms, bonds: mol.bonds }, i, atoms.length - 1))
  }
  frames(300)
  assert.equal(b.recognise(mol)?.show, 'C6H6')
  for (const d of offPlane(lay.pos, [...Array(12).keys()])) assert.ok(Math.abs(d) < 0.08 * 2.3, `off the plane by ${d}`)
  for (let t = 0; t < 6; t++) {
    const ang = angleAt(lay.pos, t, (t + 5) % 6, (t + 1) % 6)
    assert.ok(Math.abs(ang - 120) < 4, `ring angle ${ang}`)
  }
})

test('glucose\'s ring is not flat: six tetrahedral atoms pucker (a chair)', async () => {
  const { b, offPlane } = await ringTools()
  const mol = b.fromBuild(b.RING_BUILDS.C6H12O6)
  const { pos } = relax(mol, {}, { steps: 500, bond: 2.3 })
  const ring = [0, 1, 2, 3, 4, 6]
  const off = offPlane(pos, ring)
  assert.ok(Math.max(...off.map(Math.abs)) > 0.15 * 2.3, `flat: ${off}`)
  // round the ring the atoms go up and down in turn: a chair
  for (let t = 0; t < 6; t++) assert.ok(Math.sign(off[t]) !== Math.sign(off[(t + 1) % 6]), `not a chair: ${off.map(x => x.toFixed(2))}`)
  // near the tetrahedral angle (the model opens the ring's oxygen to about 120 degrees; really about 113)
  for (let t = 0; t < 6; t++) {
    const ang = angleAt(pos, ring[t], ring[(t + 5) % 6], ring[(t + 1) % 6])
    assert.ok(ang > 102 && ang < (ring[t] === 6 ? 124 : 116), `ring angle ${ang}`)
  }
})

test('the four DNA bases are flat, their NH and NH2 groups too', async () => {
  const { b, offPlane } = await ringTools()
  for (const show of ['C5H5N5', 'C5H6N2O2', 'C5H5N5O', 'C4H5N3O']) {
    const build = b.RING_BUILDS[show]
    const mol = b.fromBuild(build)
    const { pos } = relax(mol, {}, { steps: 500, bond: 2.3 })
    // every atom but the methyl's hydrogens (thymine: atoms 12-14)
    const idx = build.atoms.map((_, i) => i).filter(i => !(show === 'C5H6N2O2' && i >= 12))
    const off = offPlane(pos, idx)
    assert.ok(Math.max(...off.map(Math.abs)) < 0.06 * 2.3, `${show} not flat: ${Math.max(...off.map(Math.abs))}`)
    assert.equal(b.recognise(mol)?.show, show)
  }
})

test('rings are found once each: benzene one, a purine a six and a five', async () => {
  const { b, l } = await ringTools()
  assert.deepEqual(l.rings(b.fromBuild(b.RING_BUILDS.C6H6)).map(r => r.length), [6])
  assert.deepEqual(l.rings(b.fromBuild(b.RING_BUILDS.C5H5N5)).map(r => r.length).sort(), [5, 6])
  assert.deepEqual(l.rings(make(['O', 'H', 'H'], [[0, 1], [0, 2]])), [])
})

test('ethane is staggered: the hydrogens at either end 60 degrees apart, not eclipsed', () => {
  const p = shape(make(['C', 'C', 'H', 'H', 'H', 'H', 'H', 'H'], [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [1, 7]]))
  const sub = (a, b) => a.map((x, k) => x - b[k])
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const dihedral = (a, b, c, d) => {
    const b1 = sub(p[b], p[a])
    const b2 = sub(p[c], p[b])
    const b3 = sub(p[d], p[c])
    const n1 = cross(b1, b2)
    const n2 = cross(b2, b3)
    return (Math.atan2(Math.hypot(...b2) * dot(b1, n2), dot(n1, n2)) * 180) / Math.PI
  }
  for (const h of [5, 6, 7]) {
    const d = Math.abs(dihedral(2, 0, 1, h))
    const off = Math.min(Math.abs(d - 60), Math.abs(d - 180))
    assert.ok(off < 12, `H-C-C-H ${d}`)
  }
})
