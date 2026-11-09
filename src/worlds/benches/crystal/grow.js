// Growing Crystals: how a crystal grows, ion by ion, the same on every screen (pure; grow.test.js). A
// model of the shapes real crystals take (docs/knowledge/crystal.md, "The growth model"), not a
// simulation of the water:
//
// - An ion sticks only on a free place of the lattice next to ions of the other charge (a candidate), and
//   it stays more readily where it touches more of them: each candidate weighs B^(bonds), bonds scaled to
//   six as in rock salt (an ion alone on a face has 1, at a step 2, in a kink 3). So a new layer starts
//   rarely and then fills at once, and the faces stay flat: layer growth (the Kossel crystal).
// - Where the crystal may grow is an envelope that widens as it fills (the supply: how much salt the water
//   brings). Grown slowly, the envelope is a cube: every face gets the same and the crystal is a perfect
//   cube. Grown fast, the corners and edges, reaching out into the water, get more salt than the middles
//   of the faces (the Berg effect): the envelope's faces sink in towards their middles, so the edges run
//   ahead and each face is a hollow of steps, a hopper crystal. `hollow` (0 to 16) is how deep: the
//   middle of a face lies hollow/16 of the way in.
// - On fast-evaporating brine salt grows floating at the surface ("salt boats"): a square frame at the
//   surface, and as the crystal grows heavier it floats lower and a larger frame grows round its top: a
//   hollow pyramid upside down. Its envelope: square rings, each level one wider than the one below,
//   `wall` thick, the top rising as it grows.
//
// Everything comes from a seeded random generator and arithmetic on whole numbers, so every device grows
// the same crystal from the same seed (a room's dish: crystal.js `shared`).
import { STRUCTURES, keyOf } from './lattice.js'

/** A small, fast, seeded random generator (mulberry32): the same numbers on every device. */
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The bond weights: per kind, per count of neighbours (rounded to 1/4096, so that a power computed a hair
 *  differently on another browser gives the same weight). */
function bondTable(structure, beta) {
  return STRUCTURES[structure].cn.map(cn => {
    const row = [0]
    for (let n = 1; n <= cn; n++) row.push(Math.round(Math.pow(beta, (n * 6) / cn - 1) * 4096) / 4096)
    return row
  })
}

const abs = v => (v < 0 ? -v : v)

/** Is (x, y, z) inside a free crystal's envelope of size R (in grid units from the nucleus)? A cube, its
 *  faces sunk in towards their middles by hollow/16 of R. Whole numbers only. */
export function inCube(x, y, z, R, hollow = 0) {
  const ax = abs(x)
  const ay = abs(y)
  const az = abs(z)
  const m = ax >= ay ? (ax >= az ? ax : az) : ay >= az ? ay : az
  if (m === 0) return true
  if (m > R) return false
  if (!hollow) return true
  // b: the second largest, one more (the edges are ridges two ions wide: a ridge one ion wide would touch
  // nothing in rock salt, whose neighbours lie along the axes); (m - b) / m: how near the middle of its
  // face (1 there, 0 at an edge)
  const b = Math.min(m, ax + ay + az - m - (ax <= ay ? (ax <= az ? ax : az) : ay <= az ? ay : az) + 1)
  return 16 * m * m <= 16 * R * m - hollow * R * (m - b)
}

/** Is (x, y, z) inside a boat's envelope: levels up from its tip to its top T, each one wider than the one
 *  below, the rings `wall` thick (2 at least: each ring then rests on the one below), the tip solid? */
export function inBoat(x, y, z, T, wall = 2) {
  if (y > T || y < 0) return false
  const h = Math.max(abs(x), abs(z))
  const w = y + 1 // the ring's half-width at this level: one wider at each level up
  if (h > w) return false
  return y < 1 || h > w - wall
}

/** One crystal growing from its nucleus, inside its envelope. `mode`: 'free' (a cube or a hopper:
 *  `hollow`) or 'boat'. The envelope's last size is `size` (R or T): the crystal is done when it is
 *  full. The ions in order: `sites` ({ x, y, z, kind, n }). */
export class Crystal {
  constructor({ structure = 'rocksalt', seed = 1, mode = 'free', beta = 400, hollow = 0, wall = 2, size = 6 } = {}) {
    this.structure = structure
    this.S = STRUCTURES[structure]
    this.random = rng(seed)
    this.mode = mode
    this.hollow = hollow
    this.wall = wall
    this.size = size
    this.bond = bondTable(structure, beta)
    this.sites = []
    this.at = new Map() // key -> index in sites
    this.cand = new Map() // key -> { x, y, z, kind, n }
    this.R = 1 // the envelope now
    this.full = false
    const [x, y, z] = this.S.seed
    this.place(x, y, z)
  }

  /** Inside the envelope of size r? */
  inside(x, y, z, r = this.R) {
    return this.mode === 'boat' ? inBoat(x, y, z, r, this.wall) : inCube(x, y, z, r, this.hollow)
  }

  place(x, y, z) {
    const key = keyOf(x, y, z)
    const kind = this.S.kind(x, y, z)
    const c = this.cand.get(key)
    this.cand.delete(key)
    this.at.set(key, this.sites.length)
    this.sites.push({ x, y, z, kind, n: c?.n ?? 0 })
    // its free neighbours become candidates, or touch one more ion
    for (const [dx, dy, dz] of this.S.steps(kind)) {
      const nx = x + dx
      const ny = y + dy
      const nz = z + dz
      if (this.S.kind(nx, ny, nz) !== 1 - kind) continue
      const k = keyOf(nx, ny, nz)
      if (this.at.has(k)) continue
      const old = this.cand.get(k)
      if (old) old.n += 1
      else this.cand.set(k, { x: nx, y: ny, z: nz, kind: 1 - kind, n: 1 })
    }
  }

  /** Add one ion. False when the crystal is full (its envelope at its last size and filled). */
  step() {
    if (this.full) return false
    for (;;) {
      let total = 0
      const list = []
      const weights = []
      for (const c of this.cand.values()) {
        if (!this.inside(c.x, c.y, c.z)) continue
        const w = this.bond[c.kind][c.n]
        list.push(c)
        weights.push(w)
        total += w
      }
      if (list.length) {
        let u = this.random() * total
        let i = 0
        for (; i < list.length - 1; i++) {
          u -= weights[i]
          if (u < 0) break
        }
        const c = list[i]
        this.place(c.x, c.y, c.z)
        return true
      }
      // the envelope is full: it widens (the water brings more), or the crystal is done
      if (this.R >= this.size) {
        this.full = true
        return false
      }
      this.R += 1
    }
  }

  /** Grow to n ions (or until full). */
  growTo(n) {
    while (this.sites.length < n && this.step());
    return this.sites.length
  }

  /** The ion at a point, or -1. */
  indexAt(x, y, z) {
    return this.at.get(keyOf(x, y, z)) ?? -1
  }

  /** The occupied neighbours of ion i among the first `upTo` (their indices). */
  neighboursOf(i, upTo = this.sites.length) {
    const s = this.sites[i]
    const out = []
    for (const [dx, dy, dz] of this.S.steps(s.kind)) {
      const j = this.indexAt(s.x + dx, s.y + dy, s.z + dz)
      if (j >= 0 && j < upTo && this.sites[j].kind !== s.kind) out.push(j)
    }
    return out
  }

  /** The box round the first n ions: { min: [x, y, z], max: [x, y, z] }. */
  bounds(n = this.sites.length) {
    const min = [Infinity, Infinity, Infinity]
    const max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < n && i < this.sites.length; i++) {
      const s = this.sites[i]
      const p = [s.x, s.y, s.z]
      for (let a = 0; a < 3; a++) {
        if (p[a] < min[a]) min[a] = p[a]
        if (p[a] > max[a]) max[a] = p[a]
      }
    }
    return { min, max }
  }
}

/** How many ions a crystal holds when full (its envelope's places of the lattice that it reaches). */
export function fullCount(opts) {
  const c = new Crystal(opts)
  while (c.step());
  return c.sites.length
}

/** The places of the lattice inside a crystal's last envelope, by kind ([cations, anions]): what it holds
 *  when full, counted without growing it (grow.test.js checks the two agree). */
export function capacity({ structure = 'rocksalt', mode = 'free', hollow = 0, wall = 2, size = 6 } = {}) {
  const S = STRUCTURES[structure]
  const out = [0, 0]
  const inside = (x, y, z) => (mode === 'boat' ? inBoat(x, y, z, size, wall) : inCube(x, y, z, size, hollow))
  const lo = mode === 'boat' ? -size - 1 : -size
  const hi = size + 1
  for (let x = lo; x <= hi; x++) {
    for (let y = mode === 'boat' ? 0 : -size; y <= size; y++) {
      for (let z = lo; z <= hi; z++) {
        const k = S.kind(x, y, z)
        if (k >= 0 && inside(x, y, z)) out[k] += 1
      }
    }
  }
  return out
}
