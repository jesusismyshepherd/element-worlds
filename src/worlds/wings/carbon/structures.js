// Carbon's structures as exact geometry, in ångström (pure: no three.js, so the tests can check them):
// the diamond lattice, graphene and graphite (AB stacking), an armchair nanotube rolled from graphene,
// C60 (a truncated icosahedron with its two bond lengths), the facets of a round brilliant, and the
// small organic molecules of the life wing. Atoms are [x, y, z]; bonds are [i, j] or [i, j, order].

export const TAU = Math.PI * 2
const SQ3 = Math.sqrt(3)

// ---- small vector helpers on arrays ----
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const len = a => Math.hypot(a[0], a[1], a[2])
export const norm = a => mul(a, 1 / (len(a) || 1))
export const dist = (a, b) => len(sub(a, b))
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a))

/** A small seeded random generator (mulberry32), so the worlds look the same every visit. */
export function rng(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Bonds between atoms whose distance lies in [min, max]. */
export function bondsByDistance(atoms, max, min = 0.2) {
  const out = []
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const d = dist(atoms[i], atoms[j])
      if (d >= min && d <= max) out.push([i, j])
    }
  }
  return out
}

/** Drop atoms with fewer than `least` bonds (again and again: a loose end can leave another). */
export function prune({ atoms, bonds }, least = 2) {
  let A = atoms
  let B = bonds
  for (;;) {
    const deg = A.map(() => 0)
    for (const [i, j] of B) {
      deg[i]++
      deg[j]++
    }
    const keep = A.map((_, i) => deg[i] >= least)
    if (keep.every(Boolean)) return { atoms: A, bonds: B }
    const map = []
    const next = []
    A.forEach((a, i) => {
      if (keep[i]) {
        map[i] = next.length
        next.push(a)
      }
    })
    B = B.filter(([i, j]) => keep[i] && keep[j]).map(([i, j, o]) => (o ? [map[i], map[j], o] : [map[i], map[j]]))
    A = next
  }
}

// ---- diamond ----
export const DIAMOND = { a: 3.567, bond: (3.567 * SQ3) / 4 } // C–C 1.5446 Å, 109.47°

/** A piece of the diamond lattice (two interpenetrating fcc lattices), centred on an atom at the
 *  origin: every site for which `inside(p)` is true, loose ends pruned. */
export function diamondCluster(inside = p => Math.max(...p.map(Math.abs)) <= DIAMOND.a + 1e-6, a = DIAMOND.a) {
  const fcc = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]
  const atoms = []
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      for (let k = -3; k <= 3; k++) {
        for (const b of fcc) {
          for (const s of [0, 0.25]) {
            const p = [(i + b[0] + s) * a, (j + b[1] + s) * a, (k + b[2] + s) * a]
            if (inside(p)) atoms.push(p)
          }
        }
      }
    }
  }
  const bond = (a * SQ3) / 4
  return prune({ atoms, bonds: bondsByDistance(atoms, bond * 1.03, bond * 0.97) })
}

// ---- graphene and graphite ----
export const GRAPHENE = { bond: 1.42, a: 1.42 * SQ3, layer: 3.35 } // a = 2.46 Å, graphite layers 3.35 Å apart

/** A flake of graphene in the x-y plane (zigzag rows along x): atoms A at m·a1 + n·a2, B one bond
 *  above them; `shift` moves the whole lattice (graphite's B layer is shifted by one bond). */
export function grapheneFlake(inside, { bond = GRAPHENE.bond, shift = [0, 0] } = {}) {
  const a = bond * SQ3
  const atoms = []
  for (let m = -14; m <= 14; m++) {
    for (let n = -14; n <= 14; n++) {
      for (const by of [0, bond]) {
        const x = m * a + n * (a / 2) + shift[0]
        const y = n * ((a * SQ3) / 2) + by + shift[1]
        if (inside(x, y)) atoms.push([x, y, 0])
      }
    }
  }
  return prune({ atoms, bonds: bondsByDistance(atoms, bond * 1.04, bond * 0.96) })
}

/** A regular hexagon of circumradius r (pointy along x), as an inside test. */
export const inHexagon = r => (x, y) => {
  const ax = Math.abs(x)
  const ay = Math.abs(y)
  return ax <= r && ax * 0.5 + ay * (SQ3 / 2) <= r * (SQ3 / 2)
}

/** Graphite: `layers` flakes stacked ABAB (Bernal): every other layer shifted by one bond, so half of
 *  its atoms sit over atoms below and half over the middle of a hexagon. Layer k lies at z = k·3.35 Å. */
export function graphiteStack(layers, inside) {
  const out = []
  for (let k = 0; k < layers; k++) {
    const flake = grapheneFlake(inside, { shift: [0, k % 2 ? GRAPHENE.bond : 0] })
    out.push({ ...flake, z: k * GRAPHENE.layer, kind: k % 2 ? 'B' : 'A' })
  }
  return out
}

// ---- nanotube ----
/** An (n, m) nanotube rolled from graphene: atoms on a cylinder about the z axis, `cells` translation
 *  periods long. Returns { atoms, bonds, radius, length, chiral, period }. Armchair (n, n) tubes are
 *  metallic; (6, 6) is 8.14 Å across. */
export function nanotube(n, m, cells = 8, bond = GRAPHENE.bond) {
  const a = bond * SQ3
  const a1 = [a, 0]
  const a2 = [a / 2, (a * SQ3) / 2]
  const C = [n * a1[0] + m * a2[0], n * a1[1] + m * a2[1]]
  const cl = Math.hypot(C[0], C[1])
  const dR = gcd(2 * m + n, 2 * n + m)
  const t1 = (2 * m + n) / dR
  const t2 = -(2 * n + m) / dR
  const T = [t1 * a1[0] + t2 * a2[0], t1 * a1[1] + t2 * a2[1]]
  const tl = Math.hypot(T[0], T[1])
  const u = [C[0] / cl, C[1] / cl]
  const v = [T[0] / tl, T[1] / tl]
  const R = cl / TAU
  const L = cells * tl
  const atoms = []
  const seen = new Set()
  const reach = Math.ceil((cl + L) / a) + 2
  for (let i = -reach; i <= reach; i++) {
    for (let j = -reach; j <= reach; j++) {
      for (const by of [0, bond]) {
        const x = i * a1[0] + j * a2[0]
        const y = i * a1[1] + j * a2[1] + by
        let s = x * u[0] + y * u[1]
        const t = x * v[0] + y * v[1]
        if (t < -1e-6 || t >= L - 1e-6) continue
        s = ((s % cl) + cl) % cl
        if (cl - s < 1e-6) s = 0
        const key = `${Math.round(s * 1e4)},${Math.round(t * 1e4)}`
        if (seen.has(key)) continue
        seen.add(key)
        const th = (TAU * s) / cl
        atoms.push([R * Math.cos(th), R * Math.sin(th), t])
      }
    }
  }
  return { atoms, bonds: bondsByDistance(atoms, bond * 1.04, bond * 0.9), radius: R, length: L, chiral: [n, m], period: tl }
}

// ---- C60 ----
/** Buckminsterfullerene: the icosahedron with every corner cut off. Each of its 30 edges keeps a
 *  middle piece (a 6:6 bond, between two hexagons, 1.40 Å, the "double" bonds) and gives two 5:6 bonds
 *  (1.45 Å) to the pentagons round its ends. Returns { atoms, bonds: [i, j, order], pentagons,
 *  hexagons } with faces as rings of atom indices; centred on the origin (radius 3.55 Å). */
export function c60({ single = 1.45, double = 1.4 } = {}) {
  const phi = (1 + Math.sqrt(5)) / 2
  const L = double + 2 * single // the icosahedron's edge
  const t = single / L
  const ico = []
  for (const s1 of [-1, 1]) {
    for (const s2 of [-1, 1]) ico.push([0, s1, s2 * phi], [s1, s2 * phi, 0], [s2 * phi, 0, s1])
  }
  const V = ico.map(p => mul(p, L / 2))
  const edges = []
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) if (Math.abs(dist(V[i], V[j]) - L) < 1e-6) edges.push([i, j])
  const idx = new Map()
  const atoms = []
  for (const [i, j] of edges) {
    for (const [p, q] of [[i, j], [j, i]]) {
      idx.set(`${p},${q}`, atoms.length)
      atoms.push(lerp3(V[p], V[q], t))
    }
  }
  const at = (p, q) => idx.get(`${p},${q}`)
  const bonds = edges.map(([i, j]) => [at(i, j), at(j, i), 2])
  const pentagons = []
  for (let i = 0; i < 12; i++) {
    const nb = edges.filter(e => e.includes(i)).map(e => (e[0] === i ? e[1] : e[0]))
    const n = norm(V[i])
    const e1 = norm(sub(sub(V[nb[0]], V[i]), mul(n, dot(sub(V[nb[0]], V[i]), n))))
    const e2 = cross(n, e1)
    nb.sort((p, q) => {
      const dp = sub(V[p], V[i])
      const dq = sub(V[q], V[i])
      return Math.atan2(dot(dp, e2), dot(dp, e1)) - Math.atan2(dot(dq, e2), dot(dq, e1))
    })
    const ring = nb.map(j => at(i, j))
    pentagons.push(ring)
    for (let r = 0; r < 5; r++) bonds.push([ring[r], ring[(r + 1) % 5], 1])
  }
  const hexagons = []
  for (const [i, j] of edges) {
    for (let k = j + 1; k < 12; k++) {
      if (Math.abs(dist(V[i], V[k]) - L) < 1e-6 && Math.abs(dist(V[j], V[k]) - L) < 1e-6) {
        hexagons.push([at(i, j), at(j, i), at(j, k), at(k, j), at(k, i), at(i, k)])
      }
    }
  }
  return { atoms, bonds, pentagons, hexagons }
}

// ---- the round brilliant ----
/** The 57 facets of a round brilliant cut (Tolkowsky's proportions: table 53%, crown 34.5°, pavilion
 *  40.75°), girdle radius 1, the girdle at y = 0, table up. Each facet is a list of [x, y, z] corners;
 *  `planes` are their outward planes [nx, ny, nz, d] (n·p = d on the facet). */
export function brilliant({ table = 0.53, crown = 34.5, pavilion = 40.75, star = 0.5, lower = 0.77 } = {}) {
  const D = Math.PI / 180
  const R = 1
  const rt = table // table circumradius (table width 53% of the girdle diameter)
  const hc = (R - rt) * Math.tan(crown * D)
  const hp = R * Math.tan(pavilion * D)
  const c22 = Math.cos(22.5 * D)
  const ang = k => (k * Math.PI) / 4
  const T = k => [rt * Math.cos(ang(k)), hc, rt * Math.sin(ang(k))]
  const G = j => [R * Math.cos((j * Math.PI) / 8), 0, R * Math.sin((j * Math.PI) / 8)]
  // star and lower-girdle points sit half way between two main facets, on both their planes
  const rs = (rt + star * (R - rt)) / c22
  const S = k => [rs * Math.cos(ang(k) + 22.5 * D), hc * (1 - star), rs * Math.sin(ang(k) + 22.5 * D)]
  const rl = ((1 - lower) * R) / c22
  const Lp = k => [rl * Math.cos(ang(k) + 22.5 * D), -hp * lower, rl * Math.sin(ang(k) + 22.5 * D)]
  const C = [0, -hp, 0]
  const w = k => ((k % 8) + 8) % 8
  const facets = [{ kind: 'table', pts: [0, 1, 2, 3, 4, 5, 6, 7].map(T) }]
  for (let k = 0; k < 8; k++) {
    facets.push({ kind: 'star', pts: [T(k), T(w(k + 1)), S(k)] })
    facets.push({ kind: 'bezel', pts: [T(k), S(w(k - 1)), G(2 * k), S(k)] })
    facets.push({ kind: 'upper girdle', pts: [S(k), G(2 * k), G(2 * k + 1)] })
    facets.push({ kind: 'upper girdle', pts: [S(k), G(2 * k + 1), G((2 * k + 2) % 16)] })
    facets.push({ kind: 'lower girdle', pts: [Lp(k), G(2 * k + 1), G(2 * k)] })
    facets.push({ kind: 'lower girdle', pts: [Lp(k), G((2 * k + 2) % 16), G(2 * k + 1)] })
    facets.push({ kind: 'pavilion', pts: [C, Lp(w(k - 1)), G(2 * k), Lp(k)] })
  }
  return withPlanes(facets, { crownHeight: hc, pavilionDepth: hp })
}

/** Outward planes for facets of a convex solid that contains the origin (and windings made outward). */
function withPlanes(facets, extra = {}) {
  const planes = []
  for (const f of facets) {
    const c = f.pts.reduce((s, p) => add(s, p), [0, 0, 0]).map(v => v / f.pts.length)
    let n = [0, 0, 0]
    for (let i = 0; i < f.pts.length; i++) n = add(n, cross(sub(f.pts[i], c), sub(f.pts[(i + 1) % f.pts.length], c)))
    n = norm(n)
    if (dot(n, c) < 0) {
      n = mul(n, -1)
      f.pts.reverse()
    }
    f.normal = n
    planes.push([...n, dot(n, c)])
  }
  return { facets, planes, ...extra }
}

/** The solid bounded by planes [nx, ny, nz, d] (convex, around the origin), as facets: every corner
 *  where three planes meet inside all the others, gathered per plane and put in order round it. */
export function polytope(planes) {
  const corners = []
  const inside = p => planes.every(([x, y, z, d]) => x * p[0] + y * p[1] + z * p[2] <= d + 1e-7)
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      for (let k = j + 1; k < planes.length; k++) {
        const [a, b, c] = [planes[i], planes[j], planes[k]]
        const n1 = a.slice(0, 3)
        const n2 = b.slice(0, 3)
        const n3 = c.slice(0, 3)
        const det = dot(n1, cross(n2, n3))
        if (Math.abs(det) < 1e-9) continue
        const p = mul(add(add(mul(cross(n2, n3), a[3]), mul(cross(n3, n1), b[3])), mul(cross(n1, n2), c[3])), 1 / det)
        if (inside(p) && !corners.some(q => dist(p, q) < 1e-6)) corners.push(p)
      }
    }
  }
  const facets = []
  for (const pl of planes) {
    const n = pl.slice(0, 3)
    const pts = corners.filter(p => Math.abs(dot(n, p) - pl[3]) < 1e-6)
    if (pts.length < 3) continue
    const c = pts.reduce((s, p) => add(s, p), [0, 0, 0]).map(v => v / pts.length)
    const e1 = norm(sub(pts[0], c))
    const e2 = cross(n, e1)
    pts.sort((p, q) => Math.atan2(dot(sub(p, c), e2), dot(sub(p, c), e1)) - Math.atan2(dot(sub(q, c), e2), dot(sub(q, c), e1)))
    facets.push({ kind: 'face', pts })
  }
  return withPlanes(facets)
}

/** A synthetic (HPHT) diamond as it grows in a press: a cubo-octahedron, octahedron faces cut by cube faces. */
export function cuboOctahedron(cube = 0.72) {
  const planes = []
  const k = 1 / SQ3
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) planes.push([x * k, y * k, z * k, k])
  for (const ax of [0, 1, 2]) {
    for (const s of [-1, 1]) {
      const n = [0, 0, 0]
      n[ax] = s
      planes.push([...n, cube])
    }
  }
  return polytope(planes)
}

// ---- life: the human body, carbon-14 ----
/** The body by mass (percent): oxygen mostly in water, carbon the backbone of every biomolecule. */
export const BODY = [
  { el: 'O', mass: 65, color: '#ff4b42' },
  { el: 'C', mass: 18, color: '#3c4250' },
  { el: 'H', mass: 10, color: '#eef3ff' },
  { el: 'N', mass: 3, color: '#4f7bff' },
  { el: 'Ca', mass: 1.5, color: '#9be07a' },
  { el: 'P', mass: 1, color: '#ff9a3c' },
  { el: 'other', mass: 1.5, color: '#c58bff' },
]

/** By number of atoms (percent), for the Scientist. */
export const BODY_ATOMS = { H: 62, O: 24, C: 12, N: 1.1 }

export const C14 = { halfLife: 5730, sampleHalvings: 4, limit: 50000 }
export const c14Left = years => Math.pow(0.5, years / C14.halfLife)

// ---- life: molecules built atom by atom (bond lengths in Å, tetrahedral angles) ----
const TETRA = Math.acos(-1 / 3)
const LEN = { CC: 1.53, CH: 1.09, CO: 1.43, OH: 0.96 }

/** Three directions completing a tetrahedron round an atom whose fourth bond points along `b`, the
 *  first of them in the half-plane of `ref`. */
export function tetraFrom(b, ref, turn = 0) {
  const u = norm(b)
  let e1 = sub(ref, mul(u, dot(ref, u)))
  if (len(e1) < 1e-6) e1 = Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
  e1 = norm(sub(e1, mul(u, dot(e1, u))))
  const e2 = cross(u, e1)
  const out = []
  for (let i = 0; i < 3; i++) {
    const f = turn + (i * TAU) / 3
    out.push(norm(add(mul(u, Math.cos(TETRA)), mul(add(mul(e1, Math.cos(f)), mul(e2, Math.sin(f))), Math.sin(TETRA)))))
  }
  return out
}

function molecule(id) {
  const atoms = []
  const bonds = []
  return {
    id,
    atoms,
    bonds,
    add(el, p, from = null, order = 1) {
      atoms.push({ el, p })
      if (from !== null) bonds.push([from, atoms.length - 1, order])
      return atoms.length - 1
    },
    at: i => atoms[i].p,
    done() {
      const c = atoms.reduce((s, a) => add(s, a.p), [0, 0, 0]).map(v => v / atoms.length)
      for (const a of atoms) a.p = sub(a.p, c)
      return { id, atoms, bonds }
    },
  }
}

/** Ethane, staggered: two carbons holding hands, three hydrogens each. */
export function ethane() {
  const m = molecule('C2H6')
  const c1 = m.add('C', [-LEN.CC / 2, 0, 0])
  const c2 = m.add('C', [LEN.CC / 2, 0, 0], c1)
  tetraFrom([1, 0, 0], [0, 1, 0]).forEach(d => m.add('H', add(m.at(c1), mul(d, LEN.CH)), c1))
  tetraFrom([-1, 0, 0], [0, 1, 0], Math.PI / 3).forEach(d => m.add('H', add(m.at(c2), mul(d, LEN.CH)), c2))
  return m.done()
}

/** Ethanol, CH3–CH2–OH, the C–C–O–H chain stretched out (anti). */
export function ethanol() {
  const m = molecule('C2H5OH')
  const c1 = m.add('C', [0, 0, 0])
  const dir = [Math.sin(TETRA / 2), Math.cos(TETRA / 2), 0] // zigzag in the x-y plane
  const c2 = m.add('C', mul(dir, LEN.CC), c1)
  const back = [-dir[0], -dir[1], 0]
  // the oxygen continues the zigzag in the plane; two hydrogens stand out of it
  const [toO, h1, h2] = tetraFrom(back, [1, -1, 0])
  const o = m.add('O', add(m.at(c2), mul(toO, LEN.CO)), c2)
  m.add('H', add(m.at(c2), mul(h1, LEN.CH)), c2)
  m.add('H', add(m.at(c2), mul(h2, LEN.CH)), c2)
  const [toH] = tetraFrom(mul(toO, -1), dir) // anti: the H points away from the first carbon
  m.add('H', add(m.at(o), mul(toH, LEN.OH)), o)
  tetraFrom(dir, [1, -1, 0], Math.PI).forEach(d => m.add('H', add(m.at(c1), mul(d, LEN.CH)), c1)) // staggered
  return m.done()
}

/** β-D-glucose (β-D-glucopyranose) in its 4C1 chair: C1 to C5 and the ring oxygen O5, going clockwise
 *  seen from above, C4 up and C1 down; every OH and the CH2OH equatorial, the five ring hydrogens axial.
 *  The ring uses one bond length (1.50 Å) for its C–C and C–O bonds. */
export function glucose() {
  const m = molecule('C6H12O6')
  const ringBond = 1.5
  const z0 = ringBond / 6
  const r = ringBond * Math.sqrt(8 / 9)
  const names = ['C', 'C', 'C', 'C', 'C', 'O'] // C1..C5, O5
  const ring = names.map((el, k) => {
    const th = (-k * Math.PI) / 3
    return [r * Math.cos(th), r * Math.sin(th), k % 2 ? z0 : -z0]
  })
  const ids = ring.map((p, k) => m.add(names[k], p))
  for (let k = 0; k < 6; k++) m.bonds.push([ids[k], ids[(k + 1) % 6], 1])
  // axial and equatorial directions at each ring atom
  const up = k => (k % 2 ? 1 : -1)
  const axial = k => [0, 0, up(k)]
  const equatorial = k => {
    const p = ring[k]
    const out = norm([p[0], p[1], 0])
    return norm([out[0] * Math.sqrt(8 / 9), out[1] * Math.sqrt(8 / 9), -up(k) / 3])
  }
  const hydroxyl = (carbon, d) => {
    const o = m.add('O', add(m.at(carbon), mul(d, LEN.CO)), carbon)
    const [h] = tetraFrom(mul(d, -1), [0, 0, 1])
    m.add('H', add(m.at(o), mul(h, LEN.OH)), o)
  }
  for (let k = 0; k < 5; k++) {
    m.add('H', add(ring[k], mul(axial(k), LEN.CH)), ids[k])
    if (k < 4) hydroxyl(ids[k], equatorial(k))
  }
  // C6: the CH2OH on C5
  const e5 = equatorial(4)
  const c6 = m.add('C', add(ring[4], mul(e5, LEN.CC)), ids[4])
  const [toO6, h6a, h6b] = tetraFrom(mul(e5, -1), [0, 0, 1])
  hydroxyl(c6, toO6)
  m.add('H', add(m.at(c6), mul(h6a, LEN.CH)), c6)
  m.add('H', add(m.at(c6), mul(h6b, LEN.CH)), c6)
  return m.done()
}
