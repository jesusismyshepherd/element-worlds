// The electron's clouds, from an element's configuration (the room inside every hall's atom,
// src/worlds/atom/): hydrogen's exact orbitals (a radial wave times a real spherical harmonic), sized
// for any atom by the nuclear charge its other electrons leave over (Slater's rules); the filling order
// (Madelung's n + l rule) and where an element's real configuration departs from it; Hund's boxes and
// the unpaired electrons; each cloud's 90 % skin; and places drawn at random where an electron would be
// found (Born's rule: the chance of finding it at a place is the square of its wave there).
// Distances are in Bohr radii (a0 = 52.9 pm). Pure functions, checked for all 118 by orbitals.test.js.
import { subshells } from './atom.js'
import { SKINS } from './orbitalSkins.js'

export const A0_PM = 52.917721
export const LETTERS = ['s', 'p', 'd', 'f']
const L_OF = { s: 0, p: 1, d: 2, f: 3 }

// ---- the angular part: real spherical harmonics on the unit sphere ----
// The orbitals chemists draw (pz, dxy, fz³...): real combinations of the complex Y_lm, normalised so that
// their square integrates to 1 over the sphere. `sub` is the subscript (pz, dx²−y²). `k` is the index the
// shader knows them by (src/worlds/atom/cloud.js has the same polynomials: keep the two in step).
export const HARMONICS = [
  [{ k: 0, sub: '', f: () => 0.28209479 }],
  [
    { k: 1, sub: 'x', f: x => 0.48860251 * x },
    { k: 2, sub: 'y', f: (x, y) => 0.48860251 * y },
    { k: 3, sub: 'z', f: (x, y, z) => 0.48860251 * z },
  ],
  [
    { k: 4, sub: 'xy', f: (x, y) => 1.09254843 * x * y },
    { k: 5, sub: 'xz', f: (x, y, z) => 1.09254843 * x * z },
    { k: 6, sub: 'yz', f: (x, y, z) => 1.09254843 * y * z },
    { k: 7, sub: 'x²−y²', f: (x, y) => 0.54627422 * (x * x - y * y) },
    { k: 8, sub: 'z²', f: (x, y, z) => 0.31539157 * (3 * z * z - 1) },
  ],
  [
    { k: 9, sub: 'z³', f: (x, y, z) => 0.37317633 * z * (5 * z * z - 3) },
    { k: 10, sub: 'xz²', f: (x, y, z) => 0.4570458 * x * (5 * z * z - 1) },
    { k: 11, sub: 'yz²', f: (x, y, z) => 0.4570458 * y * (5 * z * z - 1) },
    { k: 12, sub: 'xyz', f: (x, y, z) => 2.89061144 * x * y * z },
    { k: 13, sub: 'z(x²−y²)', f: (x, y, z) => 1.44530572 * z * (x * x - y * y) },
    { k: 14, sub: 'x(x²−3y²)', f: (x, y) => 0.59004359 * x * (x * x - 3 * y * y) },
    { k: 15, sub: 'y(3x²−y²)', f: (x, y) => 0.59004359 * y * (3 * x * x - y * y) },
  ],
]

// ---- the radial part: hydrogen's, for a nuclear charge Z ----
const FACT = [1]
for (let i = 1; i <= 20; i++) FACT[i] = FACT[i - 1] * i

/** The generalised Laguerre polynomial L_k^alpha(x), by its recurrence. */
export function laguerre(k, alpha, x) {
  if (k === 0) return 1
  let a = 1
  let b = 1 + alpha - x
  for (let i = 1; i < k; i++) {
    const c = ((2 * i + 1 + alpha - x) * b - (i + alpha) * a) / (i + 1)
    a = b
    b = c
  }
  return b
}

/** The normalising factor of R_nl for charge Z (so that the integral of r² R² dr is 1). */
export const radialNorm = (n, l, Z) => Math.sqrt(Math.pow((2 * Z) / n, 3) * (FACT[n - l - 1] / (2 * n * FACT[n + l])))

/** Hydrogen's radial wave R_nl(r) for a nuclear charge Z, r in a0. */
export function radial(n, l, Z, r) {
  const rho = (2 * Z * r) / n
  return radialNorm(n, l, Z) * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerre(n - l - 1, 2 * l + 1, rho)
}

/** Where r² R_nl² (the chance of being at a distance r) peaks for the last time, for Z = 1 (a0).
 *  Hydrogen's 1s peaks at 1 a0, 2p at 4, 2s at 3 + √5. */
export function outerPeak(n, l) {
  // hydrogen's outermost lobe is also its biggest: the highest point, found on a fine walk, then refined
  const f = r => r * r * radial(n, l, 1, r) ** 2
  const top = 2 * n * n + 10 * n
  const N = 4000
  let bestR = 0
  for (let i = 1, best = -1; i <= N; i++) {
    const r = (i / N) * top
    const p = f(r)
    if (p > best) [best, bestR] = [p, r]
  }
  let lo = bestR - top / N
  let hi = bestR + top / N
  for (let it = 0; it < 60; it++) {
    const m1 = lo + (hi - lo) / 3
    const m2 = hi - (hi - lo) / 3
    if (f(m1) < f(m2)) lo = m1
    else hi = m2
  }
  return (lo + hi) / 2
}

// ---- Slater's rules: the nuclear charge an electron feels ----
// Slater's effective principal quantum numbers: past n = 3 the clouds do not grow as fast as n².
export const N_STAR = [0, 1, 2, 3, 3.7, 4.0, 4.2, 4.3]
const groupRank = s => s.n * 10 + (s.l === 's' || s.l === 'p' ? 0 : s.l === 'd' ? 1 : 2)

/** Z_eff of an electron in subshell `of` ({ n, l }) of an atom with these subshells (Slater, 1930):
 *  the others in its group (ns,np), (nd) or (nf) shield 0.35 each (0.30 in 1s); for an s or p electron
 *  the shell below shields 0.85 each and deeper ones 1; for a d or f electron everything below shields 1. */
export function slaterZeff(subs, Z, of) {
  const tg = groupRank(of)
  const sp = of.l === 's' || of.l === 'p'
  let S = 0
  for (const s of subs) {
    const g = groupRank(s)
    if (g === tg) S += (s.count - (s.n === of.n && s.l === of.l ? 1 : 0)) * (of.n === 1 ? 0.3 : 0.35)
    else if (g < tg) S += s.count * (sp && s.n === of.n - 1 ? 0.85 : 1)
  }
  return Z - S
}

// ---- the filling order ----
export const capacity = l => 2 * (2 * L_OF[l] + 1)
const ORDER = []
for (let sum = 1; sum <= 8; sum++) for (let n = 1; n <= sum; n++) {
  const l = sum - n
  if (l < n && l <= 3 && n <= 7) ORDER.push({ n, l: LETTERS[l] })
}
/** Every subshell up to 7p in Madelung's order (n + l, then n): 1s 2s 2p 3s 3p 4s 3d 4p ... */
export const MADELUNG = ORDER
const orderOf = s => ORDER.findIndex(o => o.n === s.n && o.l === s.l)

/** The configuration Madelung's rule gives for Z electrons, as subshells in filling order. */
export function madelung(Z) {
  const out = []
  let left = Z
  for (const o of ORDER) {
    if (left <= 0) break
    const count = Math.min(left, capacity(o.l))
    out.push({ ...o, count })
    left -= count
  }
  return out
}

/** Hund's boxes for a subshell: each orbital 0 (empty), 1 (one electron, spin up) or 2 (a pair); the
 *  electrons spread out one to an orbital before any pairs up. */
export function boxes(l, count) {
  const k = 2 * L_OF[l] + 1
  return Array.from({ length: k }, (_, i) => (count >= k + i + 1 ? 2 : count >= i + 1 ? 1 : 0))
}

const key = s => `${s.n}${s.l}`

/** Everything the room needs about an element's electrons. */
export function electronsOf(el) {
  const actual = subshells(el.config).filter(s => s.count > 0)
  const Z = el.z
  const { subs, top } = cloudsOf(Z, actual)
  // where the real atom departs from the rule (chromium, copper, gold, the lanthanides...)
  const rule = madelung(Z)
  const ruleOf = Object.fromEntries(rule.map(s => [key(s), s.count]))
  const realOf = Object.fromEntries(actual.map(s => [key(s), s.count]))
  const ids = [...new Set([...Object.keys(ruleOf), ...Object.keys(realOf)])]
  const differs = ids.filter(id => (ruleOf[id] ?? 0) !== (realOf[id] ?? 0))
  const byOrder = id => orderOf({ n: Number(id[0]), l: id[1] })
  const exception = differs.length
    ? {
        rule: differs.sort((a, b) => byOrder(a) - byOrder(b)).map(id => ({ id, count: ruleOf[id] ?? 0 })),
        real: differs.map(id => ({ id, count: realOf[id] ?? 0 })),
        // a set made exactly half full or full by the change: the extra steadiness chemists name
        halfOrFull: differs.some(id => {
          const c = realOf[id] ?? 0
          const cap = capacity(id[1])
          return id[1] !== 's' && (c === cap || c === cap / 2) && c !== (ruleOf[id] ?? 0)
        }),
      }
    : null
  return {
    z: Z,
    e: Z,
    subs,
    shells: top,
    unpaired: subs.reduce((a, s) => a + s.unpaired, 0),
    exception,
    predicted: !!el.configPredicted,
  }
}

/** An atom of element `el` holding `E` electrons: an ion when E is not its atomic number (the Atom Forge,
 *  where electrons are added one by one). Its configuration is the real atom's with the outermost
 *  electrons taken away first, the highest shell first and within it the highest l (iron loses its 4s
 *  before its 3d: Fe²⁺ is [Ar] 3d⁶, and an iron nucleus with 19 electrons holds its 19th in 3d, not 4s);
 *  extra electrons go into the next places in the filling order (Cl⁻ is [Ne] 3s² 3p⁶; none past 7p, so a
 *  superheavy anion keeps 118). This is the rule
 *  chemists use for ions; the sizes again from Slater's rules, now for the ion's own electrons. */
export function ionOf(el, E) {
  const Z = el.z
  if (E === Z) return electronsOf(el)
  const subs = subshells(el.config).filter(s => s.count > 0).map(s => ({ n: s.n, l: s.l, count: s.count }))
  if (E < Z) {
    let take = Z - E
    for (const s of [...subs].sort((a, b) => b.n - a.n || L_OF[b.l] - L_OF[a.l])) {
      const k = Math.min(take, s.count)
      s.count -= k
      take -= k
      if (!take) break
    }
  } else {
    let add = E - Z
    for (const o of ORDER) {
      if (!add) break
      let s = subs.find(x => x.n === o.n && x.l === o.l)
      if (!s) subs.push((s = { n: o.n, l: o.l, count: 0 }))
      const k = Math.min(add, capacity(o.l) - s.count)
      s.count += k
      add -= k
    }
  }
  const actual = subs.filter(s => s.count > 0)
  if (!actual.length) return { z: Z, e: 0, subs: [], shells: 0, unpaired: 0, exception: null, predicted: !!el.configPredicted }
  const { subs: clouds, top } = cloudsOf(Z, actual)
  return {
    z: Z,
    e: E,
    subs: clouds,
    shells: top,
    unpaired: clouds.reduce((a, s) => a + s.unpaired, 0),
    exception: null,
    predicted: !!el.configPredicted,
  }
}

/** The subshells as clouds: Slater's Z_eff, the hydrogen-like charge that puts the cloud's last peak
 *  where Slater's orbital has it, Hund's boxes, the orbitals. */
function cloudsOf(Z, actual) {
  const filling = [...actual].sort((a, b) => orderOf(a) - orderOf(b))
  const top = Math.max(...actual.map(s => s.n))
  const subs = filling.map(s => {
    const lq = L_OF[s.l]
    // (an anion with two or three extra electrons, as the forge allows, can be shielded past its charge:
    // Slater gives a negative Z_eff, an electron not held at all; a weak hold keeps its cloud a cloud)
    const zeff = Math.max(0.35, slaterZeff(actual, Z, s))
    const nstar = N_STAR[s.n]
    // the cloud's last peak where Slater's orbital (r^(n*−1) e^(−Z_eff r / n*)) has it: n*² / Z_eff;
    // hydrogen's shape keeps its nodes, scaled so that its last peak falls there
    const peak = (nstar * nstar) / zeff
    const zh = outerPeak(s.n, lq) / peak
    const bx = boxes(s.l, s.count)
    return {
      id: key(s),
      n: s.n,
      l: s.l,
      lq,
      count: s.count,
      full: s.count === capacity(s.l),
      zeff,
      zh,
      peak,
      boxes: bx,
      unpaired: bx.filter(b => b === 1).length,
      outer: s.n === top,
      orbitals: HARMONICS[lq].map((h, m) => ({ id: `${key(s)}${h.sub}`, n: s.n, l: s.l, lq, m, k: h.k, sub: h.sub, electrons: bx[m] })),
    }
  })
  return { subs, top }
}

// ---- an orbital's wave, density and skin ----

/** The wave ψ of one orbital ({ n, lq, k }) of charge zh at (x, y, z) in a0. */
export function psi(o, zh, x, y, z) {
  const r = Math.hypot(x, y, z)
  const h = HARMONICS[o.lq].find(c => c.k === o.k)
  if (r < 1e-12) return o.lq === 0 ? radial(o.n, 0, zh, 0) * h.f(0, 0, 1) : 0
  return radial(o.n, o.lq, zh, r) * h.f(x / r, y / r, z / r)
}

/** A seeded random generator (mulberry32): the same photos on every screen in a room. */
export function random(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const radialTables = new Map()
/** The distance at which a fraction of the chance is inside, and a table to draw distances from. */
function radialTable(n, lq, zh) {
  const id = `${n},${lq},${zh.toFixed(6)}`
  if (radialTables.has(id)) return radialTables.get(id)
  const top = (2 * n * n + 12 * n + 8) / zh
  const N = 4096
  const r = new Float64Array(N + 1)
  const cdf = new Float64Array(N + 1)
  let acc = 0
  let prev = 0
  for (let i = 0; i <= N; i++) {
    r[i] = (i / N) * top
    const p = r[i] * r[i] * radial(n, lq, zh, r[i]) ** 2
    if (i) acc += ((p + prev) / 2) * (top / N)
    cdf[i] = acc
    prev = p
  }
  for (let i = 0; i <= N; i++) cdf[i] /= acc
  const within = f => {
    let i = 0
    while (i < N && cdf[i] < f) i++
    return r[i]
  }
  const t = { r, cdf, N, within }
  radialTables.set(id, t)
  return t
}

/** The radius (a0) inside which a fraction of the electron's chance lies. */
export const radiusWithin = (o, zh, f) => radialTable(o.n, o.lq, zh).within(f)

const angularMax = new Map()
function maxY2(o) {
  if (angularMax.has(o.k)) return angularMax.get(o.k)
  const h = HARMONICS[o.lq].find(c => c.k === o.k)
  let m = 0
  const N = 20000
  for (let i = 0; i < N; i++) {
    // a Fibonacci sphere: even directions
    const z = 1 - (2 * (i + 0.5)) / N
    const s = Math.sqrt(1 - z * z)
    const a = i * 2.399963229728653
    m = Math.max(m, h.f(s * Math.cos(a), s * Math.sin(a), z) ** 2)
  }
  angularMax.set(o.k, m * 1.02)
  return m * 1.02
}

/** Draws places where the electron of orbital `o` (charge zh) is found, one per call: [x, y, z] in a0
 *  and the sign of its wave there. Exact: the distance from the radial chance, the direction by rejection
 *  from the angular one. */
export function finder(o, zh, rand) {
  const t = radialTable(o.n, o.lq, zh)
  const h = HARMONICS[o.lq].find(c => c.k === o.k)
  const top = maxY2(o)
  return () => {
    const u = rand()
    let lo = 0
    let hi = t.N
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (t.cdf[mid] < u) lo = mid
      else hi = mid
    }
    const f = (u - t.cdf[lo]) / Math.max(1e-12, t.cdf[hi] - t.cdf[lo])
    const r = t.r[lo] + (t.r[hi] - t.r[lo]) * f
    for (let tries = 0; tries < 2000; tries++) {
      const z = 2 * rand() - 1
      const a = rand() * Math.PI * 2
      const s = Math.sqrt(1 - z * z)
      const x = s * Math.cos(a)
      const y = s * Math.sin(a)
      const yv = h.f(x, y, z)
      if (rand() * top <= yv * yv) return [x * r, y * r, z * r, Math.sign(radial(o.n, o.lq, zh, r) * yv) || 1]
    }
    return [0, 0, r, 1]
  }
}

/** The density ψ² at an orbital's 90 % skin, the surface inside which the electron is found nine times in
 *  ten (the shapes in chemistry books), and how far out the skin reaches (a0): drawn from `N` places by
 *  Born's rule. The game reads them from SKINS (made by this, scripts/data/orbital_skins.mjs). */
export function skinSampled(o, zh, N = 24000, seed = 9 + o.n * 31 + o.k * 7) {
  const find = finder(o, zh, random(seed))
  const d = new Float64Array(N)
  const pts = new Float64Array(N)
  for (let i = 0; i < N; i++) {
    const [x, y, z] = find()
    const v = psi(o, zh, x, y, z)
    d[i] = v * v
    pts[i] = Math.hypot(x, y, z)
  }
  const level = Float64Array.from(d).sort()[Math.floor(N * 0.1)]
  let reach = 0
  for (let i = 0; i < N; i++) if (d[i] >= level) reach = Math.max(reach, pts[i])
  return { level, reach }
}

/** An orbital's 90 % skin for charge zh, from the table: hydrogen's waves scale exactly with the charge
 *  (the density on the skin as zh³, its reach as 1/zh). */
export function skinOf(o, zh) {
  const t = SKINS[`${o.n},${o.k}`]
  if (!t) return skinSampled(o, zh)
  return { level: t[0] * zh * zh * zh, reach: t[1] / zh }
}

// ---- the whole atom ----

/** The electron density of the whole atom against distance (each subshell averaged over directions, as
 *  a free atom is), and each subshell's share: for drawing every electron at once. `rs` in a0. */
export function densityProfile(info, rs) {
  return rs.map(r => {
    const parts = info.subs.map(s => (s.count * radial(s.n, s.lq, s.zh, r) ** 2) / (4 * Math.PI))
    return { r, total: parts.reduce((a, b) => a + b, 0), parts }
  })
}

/** How many nodes an orbital has: spheres (radial) and planes or cones (angular). */
export const nodesOf = (n, lq) => ({ radial: n - lq - 1, angular: lq })

/** A nucleus's radius in femtometres (1.2 A^(1/3)). */
export const nucleusFm = A => 1.2 * Math.cbrt(A)
