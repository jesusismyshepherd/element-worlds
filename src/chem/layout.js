// Where the atoms of a molecule being built stand (the Molecule Lab): a small force layout. Bonds are
// springs; round each atom its "domains" (bonded neighbours, lone pairs and still-free hands) push
// each other apart on a sphere, which gives VSEPR's shapes: two domains a line, three a triangle,
// four a tetrahedron. Lone pairs push a little harder, so water bends to about 104.5 degrees and
// ammonia makes a low pyramid, as real ones do.
// Rings (2026-11-09): a molecule with rings starts from a flat drawing of itself (stress layout on the
// graph's distances), so its rings come out untangled; a ring just closed by hand is laid out as a regular
// polygon first. A nitrogen whose lone pair joins a neighbouring double bond (amides, the DNA bases'
// NH and NH2) is flat, its pair standing across the plane; atoms on both ends of a bond in such a flat
// (conjugated) system keep their neighbours in one plane. So benzene is a flat hexagon with its hydrogens
// pointing out, the bases are flat, and glucose's ring of tetrahedral atoms puckers.
import { freeHands, lonePairs } from './build.js'

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = a => Math.hypot(a[0], a[1], a[2]) || 1e-9
const norm = a => {
  const l = len(a)
  return [a[0] / l, a[1] / l, a[2] / l]
}

/** A fresh direction for something new, spread by index (deterministic). */
export function spread(i) {
  const y = 1 - ((i * 0.618034 + 0.31) % 1) * 2
  const a = i * 2.399963 + 0.7
  const r = Math.sqrt(1 - y * y)
  return [Math.cos(a) * r, y, Math.sin(a) * r]
}

const neighboursOf = mol => mol.atoms.map((_, i) => mol.bonds.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a)))

/** The rings of a molecule: for each bond, the shortest way round back to it without using it (the atoms
 *  in order round the ring), each ring once, up to eight atoms (benzene one ring of six, a purine a six
 *  and a five). */
export function rings(mol) {
  const n = mol.atoms.length
  const nb = neighboursOf(mol)
  const out = []
  const seen = new Set()
  for (const [a, b] of mol.bonds) {
    const prev = new Array(n).fill(-1)
    prev[a] = a
    const queue = [a]
    while (queue.length && prev[b] === -1) {
      const i = queue.shift()
      for (const j of nb[i]) {
        if (prev[j] !== -1 || (i === a && j === b)) continue
        prev[j] = i
        queue.push(j)
      }
    }
    if (prev[b] === -1) continue
    const path = [b]
    while (path[path.length - 1] !== a) path.push(prev[path[path.length - 1]])
    if (path.length > 8) continue
    const key = [...path].sort((x, y) => x - y).join(',')
    if (seen.has(key)) continue
    seen.add(key)
    out.push(path)
  }
  return out
}

/** The eigenvalues (largest first) and unit eigenvectors of a symmetric 3x3 matrix (Jacobi rotations). */
export function eigen3(m) {
  const a = m.map(r => [...r])
  const v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  for (let sweep = 0; sweep < 30; sweep++) {
    const off = a[0][1] ** 2 + a[0][2] ** 2 + a[1][2] ** 2
    if (off < 1e-20) break
    for (const [p, q] of [[0, 1], [0, 2], [1, 2]]) {
      if (Math.abs(a[p][q]) < 1e-15) continue
      const theta = (a[q][q] - a[p][p]) / (2 * a[p][q])
      const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
      const c = 1 / Math.sqrt(t * t + 1)
      const s = t * c
      for (let k = 0; k < 3; k++) {
        const akp = a[k][p]
        const akq = a[k][q]
        a[k][p] = c * akp - s * akq
        a[k][q] = s * akp + c * akq
      }
      for (let k = 0; k < 3; k++) {
        const apk = a[p][k]
        const aqk = a[q][k]
        a[p][k] = c * apk - s * aqk
        a[q][k] = s * apk + c * aqk
      }
      for (let k = 0; k < 3; k++) {
        const vkp = v[k][p]
        const vkq = v[k][q]
        v[k][p] = c * vkp - s * vkq
        v[k][q] = s * vkp + c * vkq
      }
    }
  }
  return [0, 1, 2].map(i => ({ value: a[i][i], vector: norm([v[0][i], v[1][i], v[2][i]]) })).sort((x, y) => y.value - x.value)
}

/** The rotation (a function on vectors) taking unit vector u to unit vector w by the shortest way. */
function turning(u, w) {
  const axis = cross(u, w)
  const s = len(axis)
  const c = dot(u, w)
  if (s < 1e-9) return null
  const k = axis.map(x => x / s)
  return p => {
    const kxp = cross(k, p)
    const kdp = dot(k, p)
    return [0, 1, 2].map(i => p[i] * c + kxp[i] * s + k[i] * kdp * (1 - c))
  }
}

/** The layout turned so its longest axis lies along x (level, across the default view), when it is
 *  clearly longer one way (a row of atoms), and a flat molecule (a ring, the DNA bases) turned to face
 *  the default view (its plane across z); positions and the extra domains' directions turn together.
 *  The shape is unchanged: the force layout does not care which way a molecule points. Each turn is
 *  the shortest one, so a layout already level and facing stays as it is. */
export function level(state) {
  const pos = state.pos
  const n = pos.length
  if (n < 2) return state
  const c = [0, 1, 2].map(k => pos.reduce((s, p) => s + p[k], 0) / n)
  const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  for (const p of pos) {
    const d = [p[0] - c[0], p[1] - c[1], p[2] - c[2]]
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) m[a][b] += d[a] * d[b]
  }
  const trace = m[0][0] + m[1][1] + m[2][2]
  if (trace < 1e-9) return state
  const [e1, e2, e3] = eigen3(m)
  const long = e1.value >= trace * 0.6
  const flat = n >= 3 && e3.value < trace * 0.015 && e2.value > trace * 0.08
  const turns = []
  if (long) {
    const v = e1.vector[0] < 0 ? e1.vector.map(x => -x) : e1.vector
    const r = turning(v, [1, 0, 0])
    if (r) turns.push(r)
  }
  if (flat) {
    let nrm = turns.reduce((p, r) => r(p), e3.vector)
    if (nrm[2] < 0) nrm = nrm.map(x => -x)
    // a long one only rolls about x (its length stays along x); a round one takes the shortest turn
    const target = long ? norm([0, nrm[1], nrm[2]]) : null
    const r = long ? (Math.hypot(nrm[1], nrm[2]) > 1e-6 ? turning(target, [0, 0, 1]) : null) : turning(nrm, [0, 0, 1])
    if (r) turns.push(r)
  }
  if (!turns.length) return state
  const rot = p => turns.reduce((q, r) => r(q), p)
  return {
    ...state,
    pos: pos.map(p => add(rot(sub(p, c)), c)),
    extra: (state.extra ?? []).map(list => list.map(e => ({ ...e, dir: rot(e.dir) }))),
  }
}

/** A flat drawing of the molecule (x, y): classical scaling of the graph's distances, then a stress
 *  layout. Rings come out as rings, untangled, whatever order the atoms were added in. */
function drawing(mol, nb, bond) {
  const n = mol.atoms.length
  const D = Array.from({ length: n }, () => new Array(n).fill(Infinity))
  for (let s = 0; s < n; s++) {
    D[s][s] = 0
    const queue = [s]
    while (queue.length) {
      const i = queue.shift()
      for (const j of nb[i]) {
        if (D[s][j] !== Infinity) continue
        D[s][j] = D[s][i] + 1
        queue.push(j)
      }
    }
  }
  let far = 0
  for (const row of D) for (const d of row) if (d !== Infinity) far = Math.max(far, d)
  const want = D.map(row => row.map(g => bond * Math.pow(g === Infinity ? far + 2 : g, 0.85)))
  // classical scaling: the two leading eigenvectors of the double-centred squared distances
  const sq = want.map(row => row.map(d => d * d))
  const rowMean = sq.map(r => r.reduce((s, x) => s + x, 0) / n)
  const all = rowMean.reduce((s, x) => s + x, 0) / n
  const B = sq.map((r, i) => r.map((x, j) => -0.5 * (x - rowMean[i] - rowMean[j] + all)))
  const shift = Math.max(...B.map(r => r.reduce((s, x) => s + Math.abs(x), 0)))
  const vecs = []
  for (let k = 0; k < 2; k++) {
    let v = Array.from({ length: n }, (_, i) => Math.sin(i * 1.7 + k * 2.3 + 0.4))
    let value = 0
    for (let it = 0; it < 200; it++) {
      for (const u of vecs) {
        const d = v.reduce((s, x, i) => s + x * u.v[i], 0)
        v = v.map((x, i) => x - d * u.v[i])
      }
      const w = v.map((_, i) => B[i].reduce((s, x, j) => s + x * v[j], 0) + shift * v[i])
      const l = Math.hypot(...w) || 1
      value = l - shift
      v = w.map(x => x / l)
    }
    vecs.push({ v, value: Math.max(value, 1e-6) })
  }
  const X = Array.from({ length: n }, (_, i) => [vecs[0].v[i] * Math.sqrt(vecs[0].value), vecs[1].v[i] * Math.sqrt(vecs[1].value)])
  // stress: each atom moved to where its distances to the others are best kept (weights 1/d^2)
  for (let it = 0; it < 120; it++) {
    for (let i = 0; i < n; i++) {
      let nx = 0
      let ny = 0
      let den = 0
      for (let j = 0; j < n; j++) {
        if (j === i) continue
        const d = want[i][j]
        const w = 1 / (d * d)
        const dx = X[i][0] - X[j][0]
        const dy = X[i][1] - X[j][1]
        const l = Math.hypot(dx, dy) || 1e-6
        nx += w * (X[j][0] + (d * dx) / l)
        ny += w * (X[j][1] + (d * dy) / l)
        den += w
      }
      X[i] = [nx / den, ny / den]
    }
  }
  return X
}

/** A plane's normal through points (Newell's method round a polygon). */
function planeNormal(points) {
  let nx = 0
  let ny = 0
  let nz = 0
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    nx += (a[1] - b[1]) * (a[2] + b[2])
    ny += (a[2] - b[2]) * (a[0] + b[0])
    nz += (a[0] - b[0]) * (a[1] + b[1])
  }
  const l = Math.hypot(nx, ny, nz)
  return l < 1e-9 ? null : [nx / l, ny / l, nz / l]
}

/** A ring just closed by hand (one of its bonds far too long) laid out as a regular polygon: on the edge
 *  it shares with a ring already in shape (away from that ring, in its plane), else in the plane it lies
 *  closest to (a ring of tetrahedral atoms as a chair). What hangs off a moved atom moves with it. */
function shapeRings(pos, nb, bond, ringList, chair) {
  const stretched = ring => ring.some((a, t) => len(sub(pos[a], pos[ring[(t + 1) % ring.length]])) > bond * 1.8)
  const done = new Set()
  for (const r of ringList) if (!stretched(r)) for (const a of r) done.add(a)
  for (const ring of ringList) {
    if (!stretched(ring)) continue
    const k = ring.length
    const step = (2 * Math.PI) / k
    const R = bond / (2 * Math.sin(Math.PI / k))
    const target = new Map()
    // an edge shared with a ring in shape
    const t = ring.findIndex((a, i) => done.has(a) && done.has(ring[(i + 1) % k]))
    if (t >= 0) {
      const p = pos[ring[t]]
      const q = pos[ring[(t + 1) % k]]
      const other = ringList.find(r => r !== ring && !stretched(r) && r.includes(ring[t]) && r.includes(ring[(t + 1) % k]))
      const oc = other.reduce((s, a) => add(s, pos[a], 1 / other.length), [0, 0, 0])
      const nrm = planeNormal(other.map(a => pos[a])) ?? [0, 0, 1]
      const e = norm(sub(q, p))
      let u = norm(cross(nrm, e))
      const mid = add(p, q).map(x => x / 2)
      if (dot(u, sub(mid, oc)) < 0) u = u.map(x => -x)
      const L = len(sub(q, p))
      const Rr = L / (2 * Math.sin(Math.PI / k))
      const centre = add(mid, u, Rr * Math.cos(Math.PI / k))
      const ang = x => Math.atan2(dot(sub(x, centre), u), dot(sub(x, centre), e))
      const a0 = ang(p)
      // which way round from p reaches q first
      const turn = Math.atan2(Math.sin(ang(q) - a0), Math.cos(ang(q) - a0))
      const sign = turn >= 0 ? 1 : -1
      for (let s = 2; s < k; s++) {
        const a = a0 + sign * s * step
        target.set(ring[(t + s) % k], add(add(centre, e, Rr * Math.cos(a)), u, Rr * Math.sin(a)))
      }
    } else {
      const centre = ring.reduce((s, a) => add(s, pos[a], 1 / k), [0, 0, 0])
      const nrm = planeNormal(ring.map(a => pos[a])) ?? [0, 0, 1]
      let e1 = sub(pos[ring[0]], centre)
      e1 = norm(sub(e1, nrm.map(x => x * dot(e1, nrm))))
      const e2 = cross(nrm, e1)
      // (a ring of tetrahedral atoms as a chair, up and down in turn)
      const lift = chair(ring) ? bond * 0.22 : 0
      ring.forEach((a, s) => target.set(a, add(add(add(centre, e1, R * Math.cos(s * step)), e2, R * Math.sin(s * step)), nrm, s % 2 ? -lift : lift)))
    }
    // move the ring's atoms, and what hangs off each of them with it
    const shift = new Map([...target].map(([a, p]) => [a, sub(p, pos[a])]))
    const owner = new Map([...target.keys()].map(a => [a, a]))
    const queue = [...target.keys()]
    while (queue.length) {
      const i = queue.shift()
      for (const j of nb[i]) {
        if (owner.has(j) || ring.includes(j) || done.has(j)) continue
        owner.set(j, owner.get(i))
        queue.push(j)
      }
    }
    for (const [a, o] of owner) pos[a] = add(pos[a], shift.get(o))
    for (const a of ring) done.add(a)
  }
}

/** Relax the layout. `pos`: [[x, y, z]] per atom (missing ones are placed); `extra`: per atom the
 *  directions of its free hands and lone pairs (kept between calls so they move smoothly). Returns
 *  { pos, extra } with extra[i] = [{ kind: 'free' | 'lone', dir, pi? }] (pi: a lone pair that joins a
 *  neighbouring double bond, standing across the flat part). `bond`: the bond length (m). */
export function relax(mol, state = {}, { steps = 200, bond = 1.6 } = {}) {
  const n = mol.atoms.length
  const neighbours = neighboursOf(mol)
  const ringList = rings(mol)
  const fresh = mol.atoms.every((_, i) => !state.pos?.[i])
  let pos = mol.atoms.map((_, i) => state.pos?.[i] ?? null)
  // a little seeded jitter early on shakes the layout out of symmetric dead ends (a square instead of a
  // tetrahedron, a straight water)
  let seed = 12345 + n * 7919
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647 - 0.5
  }
  // the highest bond order at each atom; conjugation: a nitrogen-like atom (one lone pair, single bonds
  // only, every hand held) next to a double bond lends its pair to it: the pair stands across the plane
  // and pushes nothing
  const top = mol.atoms.map(() => 0)
  for (const [a, b, o] of mol.bonds) {
    top[a] = Math.max(top[a], o)
    top[b] = Math.max(top[b], o)
  }
  const pi = mol.atoms.map((_, i) => lonePairs(mol, i) === 1 && top[i] === 1 && freeHands(mol, i) <= 0 && neighbours[i].some(j => top[j] === 2))
  // a ring of six tetrahedral atoms (glucose's) starts as a chair: up and down in turn round the ring
  // (the layout has no twist between neighbours' bonds, which is what makes the real chair best)
  const chair = ring => ring.length % 2 === 0 && ring.every(a => top[a] === 1 && !pi[a])
  if (fresh && ringList.length) {
    // a molecule with rings starts from its flat drawing, a breath out of the plane
    pos = drawing(mol, neighbours, bond).map(([x, y]) => [x, y, rand() * bond * 0.05])
    for (const ring of ringList) if (chair(ring)) ring.forEach((a, t) => (pos[a][2] = (t % 2 ? -1 : 1) * bond * 0.22))
  }
  // a new atom starts next to the one it is joined to, else near the middle
  for (let i = 0; i < n; i++) {
    if (pos[i]) continue
    const link = mol.bonds.find(([a, b]) => (a === i && pos[b]) || (b === i && pos[a]))
    const from = link ? pos[link[0] === i ? link[1] : link[0]] : [0, 0, 0]
    pos[i] = add(from, spread(i + n), link ? bond : bond * 1.4 * (i ? 1 : 0))
  }
  if (!fresh && ringList.length) shapeRings(pos, neighbours, bond, ringList, chair)
  // the extra domains of each atom: lone pairs and free hands, as directions from it
  const extra = mol.atoms.map((_, i) => {
    const want = [...Array(lonePairs(mol, i)).fill('lone'), ...Array(Math.max(0, freeHands(mol, i))).fill('free')]
    const had = state.extra?.[i] ?? []
    return want.map((kind, k) => ({ kind, dir: had[k]?.dir ?? spread(i * 7 + k + 3), ...(pi[i] && k === 0 ? { pi: true } : {}) }))
  })
  // flat atoms: a double bond with three domains round it, or a lent pair with three left (sp2)
  const domainsOf = i => neighbours[i].length + extra[i].filter(e => !e.pi).length
  const flat = mol.atoms.map((_, i) => (top[i] === 2 || pi[i]) && domainsOf(i) === 3)
  const flatBonds = mol.bonds.filter(([a, b]) => flat[a] && flat[b])
  // staggered, not eclipsed: round a bond between two tetrahedral atoms (one a carbon) the neighbours at
  // either end keep 60 degrees apart (a threefold twist energy, as force fields have), which is what
  // makes ethane staggered and glucose's ring a chair
  const tetra = mol.atoms.map((_, i) => top[i] === 1 && !pi[i] && domainsOf(i) === 4)
  const torsions = []
  for (const [b, c] of mol.bonds) {
    if (!tetra[b] || !tetra[c] || (mol.atoms[b].el !== 'C' && mol.atoms[c].el !== 'C')) continue
    for (const a of neighbours[b]) for (const d of neighbours[c]) if (a !== c && d !== b && a !== d) torsions.push([a, b, c, d])
  }
  const twistEnergy = (p1, p2, p3, p4) => {
    const b1 = sub(p2, p1)
    const b2 = sub(p3, p2)
    const b3 = sub(p4, p3)
    const n1 = cross(b1, b2)
    const n2 = cross(b2, b3)
    const phi = Math.atan2(len(b2) * dot(b1, n2), dot(n1, n2))
    return 1 + Math.cos(3 * phi)
  }
  const vel = pos.map(() => [0, 0, 0])
  const dirVel = extra.map(list => list.map(() => [0, 0, 0]))
  /** The normal of the plane an atom's neighbours make with it (null with fewer than two). */
  const normalAt = c => {
    const nb = neighbours[c]
    if (nb.length < 2) return null
    const v = nb.length >= 3 ? cross(sub(pos[nb[1]], pos[nb[0]]), sub(pos[nb[2]], pos[nb[0]])) : cross(sub(pos[nb[0]], pos[c]), sub(pos[nb[1]], pos[c]))
    return len(v) < 1e-9 ? null : norm(v)
  }

  for (let step = 0; step < steps; step++) {
    // (only a fresh layout is shaken: the lab's few steps a frame would otherwise add up to a drift
    // that turned and bent molecules over time)
    const shake = steps < 20 ? 0 : Math.max(0, 1 - step / (steps * 0.6)) * 0.03
    const force = pos.map(() => [0, 0, 0])
    // bonds: springs
    for (const [a, b] of mol.bonds) {
      const d = sub(pos[b], pos[a])
      const l = len(d)
      const f = (l - bond) * 0.5
      const u = [d[0] / l, d[1] / l, d[2] / l]
      force[a] = add(force[a], u, f)
      force[b] = add(force[b], u, -f)
    }
    // domains round each atom push apart (on the unit sphere round it); a lent pair takes no part
    for (let c = 0; c < n; c++) {
      const doms = [
        ...neighbours[c].map(j => ({ atom: j, dir: norm(sub(pos[j], pos[c])), w: 1 })),
        ...extra[c].flatMap((e, k) => (e.pi ? [] : [{ extra: k, dir: e.dir, w: e.kind === 'lone' ? 1.25 : 0.9 }])),
      ]
      for (let x = 0; x < doms.length; x++) {
        for (let y = x + 1; y < doms.length; y++) {
          const d = sub(doms[x].dir, doms[y].dir)
          const l = Math.max(len(d), 0.05)
          const f = (0.12 * doms[x].w * doms[y].w) / (l * l)
          const u = [d[0] / l, d[1] / l, d[2] / l]
          for (const [dom, sign] of [[doms[x], 1], [doms[y], -1]]) {
            if (dom.atom != null) {
              // pushed round the centre (sideways only: the bond's spring keeps its length); the centre
              // takes the opposite push
              const k = u[0] * dom.dir[0] + u[1] * dom.dir[1] + u[2] * dom.dir[2]
              const t = [u[0] - dom.dir[0] * k, u[1] - dom.dir[1] * k, u[2] - dom.dir[2] * k]
              force[dom.atom] = add(force[dom.atom], t, sign * f * bond)
              force[c] = add(force[c], t, -sign * f * bond)
            } else dirVel[c][dom.extra] = add(dirVel[c][dom.extra], u, sign * f * 0.6)
          }
        }
      }
    }
    // a conjugated (flat) system stays in one plane: across each bond between two flat atoms, the far
    // atom's neighbours are drawn into the near atom's plane
    for (const [a, b] of flatBonds) {
      for (const [B, C] of [[a, b], [b, a]]) {
        const nrm = normalAt(B)
        if (!nrm) continue
        for (const X of neighbours[C]) {
          if (X === B) continue
          const d = dot(nrm, sub(pos[X], pos[B]))
          force[X] = add(force[X], nrm, -0.25 * d)
          force[C] = add(force[C], nrm, 0.25 * d)
        }
      }
    }
    // the twist round single bonds (its pull found by nudging each of the four atoms a little)
    for (const t of torsions) {
      const P = t.map(i => pos[i])
      const e0 = twistEnergy(...P)
      if (e0 < 1e-4) continue
      const h = bond * 1e-3
      t.forEach((atom, k) => {
        const g = [0, 1, 2].map(axis => {
          const Q = P.map((p, m) => (m === k ? p.map((x, ax) => (ax === axis ? x + h : x)) : p))
          return (twistEnergy(...Q) - e0) / h
        })
        force[atom] = add(force[atom], g, -0.01 * bond)
      })
    }
    // atoms that are neither bonded nor share a neighbour keep their distance (the domains round a
    // shared neighbour already space those)
    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        if (neighbours[a].includes(b) || neighbours[a].some(c => neighbours[b].includes(c))) continue
        const d = sub(pos[b], pos[a])
        const l = Math.max(len(d), 0.1)
        if (l > bond * 2.2) continue
        const f = (0.35 * bond * bond) / (l * l)
        const u = [d[0] / l, d[1] / l, d[2] / l]
        force[a] = add(force[a], u, -f)
        force[b] = add(force[b], u, f)
      }
    }
    for (let i = 0; i < n; i++) {
      vel[i] = add(vel[i].map(v => v * 0.78), force[i], 0.08)
      pos[i] = add(pos[i], [vel[i][0] + rand() * shake, vel[i][1] + rand() * shake, vel[i][2] + rand() * shake])
      for (let k = 0; k < extra[i].length; k++) {
        if (extra[i][k].pi) {
          // a lent pair stands across its atom's plane (the side it was on)
          const nrm = normalAt(i)
          if (nrm) extra[i][k].dir = dot(nrm, extra[i][k].dir) < 0 ? nrm.map(x => -x) : nrm
          continue
        }
        dirVel[i][k] = dirVel[i][k].map(v => v * 0.7)
        const jig = [rand() * shake * 3, rand() * shake * 3, rand() * shake * 3]
        extra[i][k].dir = norm(add(add(extra[i][k].dir, dirVel[i][k], 0.4), jig))
      }
    }
  }
  // keep the molecule centred
  const mid = pos.reduce((s, p) => add(s, p, 1 / n), [0, 0, 0])
  return { pos: pos.map(p => sub(p, mid)), extra }
}

/** The angle at atom c between atoms a and b, in degrees (for tests and the scientist's panel). */
export function angleAt(pos, c, a, b) {
  const u = norm(sub(pos[a], pos[c]))
  const v = norm(sub(pos[b], pos[c]))
  return (Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1] + u[2] * v[2]))) * 180) / Math.PI
}
