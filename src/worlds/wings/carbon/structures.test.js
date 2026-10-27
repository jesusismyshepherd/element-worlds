import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkHands, MOLECULES } from '../../../chem/molecules.js'
import {
  DIAMOND, GRAPHENE, BODY, C14, c14Left, diamondCluster, grapheneFlake, graphiteStack, inHexagon, nanotube, c60,
  brilliant, cuboOctahedron, ethane, ethanol, glucose, dist, dot, sub, norm,
} from './structures.js'

const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps
const angle = (a, b) => (Math.acos(dot(norm(a), norm(b))) * 180) / Math.PI

test('diamond: four neighbours at 1.545 Å and 109.47° round every inner atom', () => {
  const { atoms, bonds } = diamondCluster()
  assert.ok(close(DIAMOND.bond, 1.5446, 1e-4))
  const nb = atoms.map(() => [])
  for (const [i, j] of bonds) {
    assert.ok(close(dist(atoms[i], atoms[j]), DIAMOND.bond, 1e-9))
    nb[i].push(j)
    nb[j].push(i)
  }
  const centre = atoms.findIndex(p => p.every(v => v === 0))
  assert.equal(nb[centre].length, 4)
  const v = nb[centre].map(j => sub(atoms[j], atoms[centre]))
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) assert.ok(close(angle(v[a], v[b]), 109.4712, 1e-3))
  assert.ok(nb.every(n => n.length >= 2 && n.length <= 4))
})

test('graphene and graphite: 1.42 Å bonds, three neighbours, AB layers 3.35 Å apart', () => {
  const flake = grapheneFlake(inHexagon(6.2))
  for (const [i, j] of flake.bonds) assert.ok(close(dist(flake.atoms[i], flake.atoms[j]), GRAPHENE.bond, 1e-9))
  const deg = flake.atoms.map(() => 0)
  for (const [i, j] of flake.bonds) deg[i]++, deg[j]++
  assert.ok(deg.every(d => d >= 2 && d <= 3))
  const [a, b] = graphiteStack(2, inHexagon(6.2))
  assert.equal(b.z - a.z, 3.35)
  // half of layer B's atoms sit right over an atom of layer A, the other half over a hexagon's middle
  const over = b.atoms.filter(p => a.atoms.some(q => close(q[0], p[0], 1e-6) && close(q[1], p[1], 1e-6))).length
  const inner = b.atoms.filter(p => Math.hypot(p[0], p[1]) < 3.5)
  const overInner = inner.filter(p => a.atoms.some(q => close(q[0], p[0], 1e-6) && close(q[1], p[1], 1e-6))).length
  assert.ok(over > 0 && Math.abs(overInner / inner.length - 0.5) < 0.15)
})

test('the (6,6) armchair nanotube: 0.814 nm across, 24 atoms per 2.46 Å period, every inner atom with 3 bonds', () => {
  const t = nanotube(6, 6, 8)
  assert.ok(close(t.radius * 2, 8.137, 2e-3))
  assert.ok(close(t.period, 2.4595, 1e-3))
  assert.equal(t.atoms.length, 24 * 8)
  const deg = t.atoms.map(() => 0)
  for (const [i, j] of t.bonds) deg[i]++, deg[j]++
  assert.equal(deg.filter(d => d === 3).length, t.atoms.length - 24) // only the two open rims have 2
  for (const p of t.atoms) assert.ok(close(Math.hypot(p[0], p[1]), t.radius, 1e-9))
})

test('C60: 60 atoms, 90 bonds (30 at 1.40 Å, 60 at 1.45 Å), 12 pentagons, 20 hexagons, every hand held', () => {
  const c = c60()
  assert.equal(c.atoms.length, 60)
  assert.equal(c.bonds.length, 90)
  assert.equal(c.pentagons.length, 12)
  assert.equal(c.hexagons.length, 20)
  assert.equal(c.atoms.length - c.bonds.length + c.pentagons.length + c.hexagons.length, 2) // Euler
  const doubles = c.bonds.filter(b => b[2] === 2)
  assert.equal(doubles.length, 30)
  for (const [i, j, o] of c.bonds) assert.ok(close(dist(c.atoms[i], c.atoms[j]), o === 2 ? 1.4 : 1.45, 1e-9))
  for (const p of c.atoms) assert.ok(close(Math.hypot(...p), c.atoms[0].reduce((s, v) => s + v * v, 0) ** 0.5, 1e-9))
  assert.ok(close(Math.hypot(...c.atoms[0]) * 2, 7.1, 0.01))
  assert.deepEqual(checkHands({ atoms: c.atoms.map(p => ({ el: 'C', p })), bonds: c.bonds }), [])
  // every atom is in one pentagon and two hexagons
  const inP = c.atoms.map((_, i) => c.pentagons.filter(r => r.includes(i)).length)
  const inH = c.atoms.map((_, i) => c.hexagons.filter(r => r.includes(i)).length)
  assert.ok(inP.every(n => n === 1) && inH.every(n => n === 2))
})

test('the round brilliant: 57 flat facets, Tolkowsky proportions', () => {
  const b = brilliant()
  assert.equal(b.facets.length, 57)
  b.facets.forEach((f, i) => {
    for (const p of f.pts) assert.ok(close(dot(b.planes[i], p), b.planes[i][3], 1e-9))
  })
  assert.ok(close(b.crownHeight / 2, 0.162, 0.002)) // crown height 16.2% of the diameter
  assert.ok(close(b.pavilionDepth / 2, 0.431, 0.002)) // pavilion depth 43.1%
  assert.equal(cuboOctahedron().facets.length, 14)
})

test('life molecules hold every hand, with real bond lengths', () => {
  const g = glucose()
  const count = el => g.atoms.filter(a => a.el === el).length
  assert.deepEqual([count('C'), count('H'), count('O')], [6, 12, 6])
  for (const m of [ethane(), ethanol(), g, MOLECULES.CH4, MOLECULES.C6H6]) {
    assert.deepEqual(checkHands(m), [], m.id)
    for (const [i, j] of m.bonds) {
      const d = dist(m.atoms[i].p, m.atoms[j].p)
      assert.ok(d > 0.9 && d < 1.6, `${m.id} bond ${d}`)
    }
    for (let i = 0; i < m.atoms.length; i++) {
      for (let j = i + 1; j < m.atoms.length; j++) assert.ok(dist(m.atoms[i].p, m.atoms[j].p) > 0.9, `${m.id} atoms too close`)
    }
  }
})

test('body by mass adds up to 100%, carbon 18%; carbon-14 halves every 5730 years', () => {
  assert.ok(close(BODY.reduce((s, e) => s + e.mass, 0), 100))
  assert.equal(BODY.find(e => e.el === 'C').mass, 18)
  assert.ok(close(c14Left(C14.halfLife), 0.5))
  assert.ok(close(c14Left(C14.halfLife * C14.sampleHalvings), 1 / 16))
})
