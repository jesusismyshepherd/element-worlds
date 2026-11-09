// What the cloud shows, built from an element's electrons (src/chem/orbitals.js): the whole atom (every
// subshell as a glowing shell at the distances its electrons keep, coloured by its block), one subshell
// (its orbitals together, each in its own tint, the empty ones faint) or one orbital (its wave's two signs
// in two colours). And the photos: where an electron is found, drawn by Born's rule from the same waves.
import * as THREE from 'three'
import { radialNorm, skinOf, radiusWithin, finder, random, LETTERS } from '../../chem/orbitals.js'

// the blocks of the periodic table, by the shape of the last cloud filled
export const BLOCK = { s: '#ff6f91', p: '#ffc24d', d: '#5cc4ff', f: '#7fe58e' }

// one subshell's skin reaches this far from the nucleus (m); the whole atom's outer shell peaks here. The
// visitor arrives outside the clouds and sees their shapes whole, then walks into them
const REACH = 5.4
const OUTER = 4.0
// the atom is turned this far about the room's up, so its x and y axes are both seen at a slant
export const YAW = 0.61
export const ROOM_R = 26 // the cloud is drawn inside this sphere (m)

/** The tints of a subshell's orbitals: round the colour wheel from its block's colour. */
export function tintsOf(l, count) {
  const base = new THREE.Color(BLOCK[l])
  const hsl = {}
  base.getHSL(hsl)
  return Array.from({ length: count }, (_, i) =>
    new THREE.Color().setHSL((hsl.h + (count > 1 ? (i / count) * 0.82 - 0.06 : 0) + 1) % 1, 0.85, 0.6).multiplyScalar(1.05),
  )
}

/** One subshell (`m` null: all its orbitals) or one orbital of it, its skin reaching `reach` metres; or, with
 *  `scale` (metres per a0), at that size (the Atom Forge shows a new electron's cloud at its true size in the
 *  atom). */
export function orbitalView(sub, m = null, { reach: want = REACH, scale: fixed = null } = {}) {
  const orbs = m == null ? sub.orbitals : [sub.orbitals[m]]
  const skins = orbs.map(o => skinOf(o, sub.zh))
  const reach = Math.max(...skins.map(s => s.reach))
  const scale = fixed ?? want / reach
  const tints = tintsOf(sub.l, sub.orbitals.length)
  return {
    mode: 1,
    key: m == null ? sub.id : `${sub.id}:${m}`,
    sub,
    m,
    n: sub.n,
    lq: sub.lq,
    zh: sub.zh,
    norm: radialNorm(sub.n, sub.lq, sub.zh),
    scale,
    // more clouds overlapping add up: a subshell's seven f clouds are each dimmer than one alone
    gain: m == null ? 1 / Math.sqrt(0.6 + 0.4 * orbs.length) : 1,
    cut: Math.min(ROOM_R, radiusWithin(sub.orbitals[0], sub.zh, 0.9995) * scale * 1.05),
    phase: m != null,
    orbitals: orbs.map((o, i) => ({
      k: o.k,
      tint: m == null ? tints[i] : tints[m],
      // an orbital with no electron in it shows faintly: a place still free
      fill: m != null || o.electrons ? 1 : 0.2,
      level: skins[i].level,
    })),
  }
}

const tables = new WeakMap()
/** The whole atom's table against distance (log r): each subshell a thin shell where its electrons are most
 *  often found (its radial chance's last peak), weighted by how full it is, in its block's colour; the outer
 *  shell a little brighter. Half floats, which every phone filters smoothly. */
function atomTable(info) {
  if (tables.has(info)) return tables.get(info)
  const N = 1024
  const inner = Math.min(...info.subs.map(s => s.peak))
  const outer = Math.max(...info.subs.map(s => radiusWithin(s.orbitals[0], s.zh, 0.9995)))
  const logMin = Math.log(inner * 0.02)
  const logMax = Math.log(outer * 1.15)
  const cols = info.subs.map(s => new THREE.Color(BLOCK[s.l]))
  const data = new Uint16Array(N * 4)
  const c = new THREE.Color()
  for (let i = 0; i < N; i++) {
    const r = Math.exp(logMin + ((i + 0.5) / N) * (logMax - logMin))
    let b = 0
    c.setRGB(0, 0, 0)
    info.subs.forEach((s, k) => {
      // a bright shell where its electrons are most often found: nested bubbles, an onion, that the zoom
      // dives through. (A haze of each band's whole spread filled the zoomed atom with fog: the outer
      // shells' spreads and the s clouds' inner lobes reach far in. The motes and photos show the spread.)
      const shell = Math.exp(-(((r - s.peak) / (0.12 * s.peak)) ** 2))
      const w = shell * (0.55 + 0.45 * Math.sqrt(s.count / (2 * (2 * s.lq + 1)))) * (s.outer ? 1.25 : 1)
      b += w
      c.r += cols[k].r * w
      c.g += cols[k].g * w
      c.b += cols[k].b * w
    })
    // (a weight that underflows would blow the colour past what a half float holds: the filter then mixes
    // that into its neighbours and the bloom spreads it over the whole screen)
    if (b > 1e-6) c.multiplyScalar(1 / b)
    else c.setRGB(0, 0, 0)
    data[i * 4] = THREE.DataUtils.toHalfFloat(c.r)
    data[i * 4 + 1] = THREE.DataUtils.toHalfFloat(c.g)
    data[i * 4 + 2] = THREE.DataUtils.toHalfFloat(c.b)
    data[i * 4 + 3] = THREE.DataUtils.toHalfFloat(Math.min(b, 4))
  }
  const tex = new THREE.DataTexture(data, N, 1, THREE.RGBAFormat, THREE.HalfFloatType)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  const t = { tex, logMin, logMax, outer }
  tables.set(info, t)
  return t
}

/** The deepest zoom that still makes sense: the 1s shell where the outer shell was. */
export const maxZoomOf = info => Math.max(1, Math.max(...info.subs.map(s => s.peak)) / Math.min(...info.subs.map(s => s.peak)))

/** Every electron at once, the outer shell's peak `outer` metres out; `zoom` (1 or more) brings the inner
 *  shells out to where the outer one was. */
export function atomView(info, zoom = 1, { outer = OUTER } = {}) {
  const t = atomTable(info)
  const outerPeak = Math.max(...info.subs.map(s => s.peak))
  const scale = (outer / outerPeak) * zoom
  return {
    mode: 0,
    key: 'all',
    zoom,
    table: t.tex,
    logMin: t.logMin,
    logMax: t.logMax,
    scale,
    gain: 0.075,
    cut: Math.min(ROOM_R, t.outer * scale),
  }
}

/** Where each subshell's bubble goes in `ringedAtomView`: on its principal shell's ring (`radii`, metres,
 *  n = 1 first), a d subshell part way out toward the next ring and an f subshell a little further (iron's
 *  3d lies outside its 3s and 3p and inside its 4s; gadolinium's 4f inside its 5s and 5p). */
export function ringRadius(sub, radii) {
  const r = radii[sub.n - 1] ?? radii[radii.length - 1]
  const gap = radii.length > 1 ? radii[1] - radii[0] : r * 0.5
  return r + (sub.l === 'd' ? 0.45 : sub.l === 'f' ? 0.4 : 0) * gap
}

/** The whole atom as seen from outside (the Atom Forge): each subshell a thin bubble in its block's colour,
 *  the bubbles spread out evenly on the forge's rings (`radii`) instead of at their true sizes. At true sizes
 *  the inner shells crowd so close to the nucleus that the forge's big nucleus hides them, and the outer
 *  shell's glow hides the rest; the room inside the atom shows the true sizes. The table is in metres:
 *  `scale` is 1. */
export function ringedAtomView(info, radii) {
  const gap = radii.length > 1 ? radii[1] - radii[0] : radii[0] * 0.5
  const top = radii[radii.length - 1] + gap * 0.9
  const N = 1024
  const logMin = Math.log(radii[0] * 0.4)
  const logMax = Math.log(top)
  const shells = info.subs.map(s => ({
    at: ringRadius(s, radii),
    col: new THREE.Color(BLOCK[s.l]),
    // fuller subshells glow more; a small bubble is crossed along a shorter path than a big one: lifted
    w: (0.5 + 0.5 * Math.sqrt(s.count / (2 * (2 * s.lq + 1)))) * Math.min(3, (top / ringRadius(s, radii)) ** 0.6),
  }))
  const data = new Uint16Array(N * 4)
  const c = new THREE.Color()
  for (let i = 0; i < N; i++) {
    const r = Math.exp(logMin + ((i + 0.5) / N) * (logMax - logMin))
    let b = 0
    c.setRGB(0, 0, 0)
    for (const s of shells) {
      const w = s.w * Math.exp(-(((r - s.at) / (0.1 * gap)) ** 2))
      b += w
      c.r += s.col.r * w
      c.g += s.col.g * w
      c.b += s.col.b * w
    }
    // (a weight that underflows would blow the colour past what a half float holds: the filter then mixes
    // that into its neighbours and the bloom spreads it over the whole screen)
    if (b > 1e-6) c.multiplyScalar(1 / b)
    else c.setRGB(0, 0, 0)
    data[i * 4] = THREE.DataUtils.toHalfFloat(c.r)
    data[i * 4 + 1] = THREE.DataUtils.toHalfFloat(c.g)
    data[i * 4 + 2] = THREE.DataUtils.toHalfFloat(c.b)
    data[i * 4 + 3] = THREE.DataUtils.toHalfFloat(Math.min(b, 4))
  }
  const tex = new THREE.DataTexture(data, N, 1, THREE.RGBAFormat, THREE.HalfFloatType)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  // (fewer shells add up to less light: a small atom's are each made brighter)
  return { mode: 0, key: 'all', zoom: 1, table: tex, logMin, logMax, scale: 1, gain: 0.07 * Math.sqrt(7 / radii.length), cut: top, ringed: true }
}

/** A point given in a0 on the atom's axes (z up), on the room's axes (y up), times `scale`. */
export const toRoom = (x, y, z, scale = 1, out = new THREE.Vector3()) => out.set(x * scale, z * scale, -y * scale)

/** Where the camera finds an electron for photo number `i` of a series `seed` (the same on every screen in
 *  a room): the place (a0 from the nucleus on the room's axes: the cloud's dots take the view's scale) and
 *  its colour. Among several orbitals or subshells, each is picked as
 *  often as it holds electrons. */
export function photoOf(view, info, seed, i) {
  const rand = random((seed * 7919 + i * 104729) >>> 0)
  const weighted = (items, w) => {
    const total = items.reduce((a, it) => a + w(it), 0)
    if (total <= 0) return items[Math.floor(rand() * items.length)]
    let u = rand() * total
    for (const it of items) if ((u -= w(it)) <= 0) return it
    return items[items.length - 1]
  }
  if (view.mode === 0) {
    const sub = weighted(info.subs, s => s.count)
    const o = weighted(sub.orbitals, x => x.electrons)
    const [x, y, z] = finder(o, sub.zh, rand)()
    return { p: toRoom(x, y, z), color: new THREE.Color(BLOCK[sub.l]).multiplyScalar(1.4) }
  }
  const sub = view.sub
  const orbs = view.m == null ? sub.orbitals : [sub.orbitals[view.m]]
  const pick = weighted(orbs, o => o.electrons)
  const idx = orbs.indexOf(pick)
  const [x, y, z, sign] = finder(pick, sub.zh, rand)()
  const color = view.phase ? new THREE.Color(sign > 0 ? '#ffb44d' : '#4d97ff') : view.orbitals[idx].tint.clone()
  return { p: toRoom(x, y, z), color: color.multiplyScalar(1.5) }
}

/** An orbital's name as chemists write it: 2p with z below (`sub` the subscript). */
export const orbitalName = (sub, m) => (m == null ? sub.id : { main: sub.id, low: sub.orbitals[m].sub })

export { LETTERS }
