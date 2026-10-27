// Where the atoms of a molecule being built stand (the Molecule Lab): a small force layout. Bonds are
// springs; round each atom its "domains" (bonded neighbours, lone pairs and still-free hands) push
// each other apart on a sphere, which gives VSEPR's shapes: two domains a line, three a triangle,
// four a tetrahedron. Lone pairs push a little harder, so water bends to about 104.5 degrees and
// ammonia makes a low pyramid, as real ones do.
import { freeHands, lonePairs } from './build.js'

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
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

/** Relax the layout. `pos`: [[x, y, z]] per atom (missing ones are placed); `extra`: per atom the
 *  directions of its free hands and lone pairs (kept between calls so they move smoothly). Returns
 *  { pos, extra } with extra[i] = [{ kind: 'free' | 'lone', dir }]. `bond`: the bond length (m). */
export function relax(mol, state = {}, { steps = 200, bond = 1.6 } = {}) {
  const n = mol.atoms.length
  const pos = mol.atoms.map((_, i) => state.pos?.[i] ?? null)
  // a new atom starts next to the one it is joined to, else near the middle
  for (let i = 0; i < n; i++) {
    if (pos[i]) continue
    const link = mol.bonds.find(([a, b]) => (a === i && pos[b]) || (b === i && pos[a]))
    const from = link ? pos[link[0] === i ? link[1] : link[0]] : [0, 0, 0]
    pos[i] = add(from, spread(i + n), link ? bond : bond * 1.4 * (i ? 1 : 0))
  }
  // the extra domains of each atom: lone pairs and free hands, as directions from it
  const extra = mol.atoms.map((_, i) => {
    const want = [...Array(lonePairs(mol, i)).fill('lone'), ...Array(Math.max(0, freeHands(mol, i))).fill('free')]
    const had = state.extra?.[i] ?? []
    return want.map((kind, k) => ({ kind, dir: had[k]?.dir ?? spread(i * 7 + k + 3) }))
  })
  const neighbours = mol.atoms.map((_, i) => mol.bonds.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a)))
  const vel = pos.map(() => [0, 0, 0])
  const dirVel = extra.map(list => list.map(() => [0, 0, 0]))
  // a little seeded jitter early on shakes the layout out of symmetric dead ends (a square instead of a
  // tetrahedron, a straight water)
  let seed = 12345 + n * 7919
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647 - 0.5
  }

  for (let step = 0; step < steps; step++) {
    const shake = Math.max(0, 1 - step / (steps * 0.6)) * 0.03
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
    // domains round each atom push apart (on the unit sphere round it)
    for (let c = 0; c < n; c++) {
      const doms = [
        ...neighbours[c].map(j => ({ atom: j, dir: norm(sub(pos[j], pos[c])), w: 1 })),
        ...extra[c].map((e, k) => ({ extra: k, dir: e.dir, w: e.kind === 'lone' ? 1.25 : 0.9 })),
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
