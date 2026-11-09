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

/** One subshell (`m` null: all its orbitals) or one orbital of it. */
export function orbitalView(sub, m = null) {
  const orbs = m == null ? sub.orbitals : [sub.orbitals[m]]
  const skins = orbs.map(o => skinOf(o, sub.zh))
  const reach = Math.max(...skins.map(s => s.reach))
  const scale = REACH / reach
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
    if (b > 0) c.multiplyScalar(1 / b)
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

/** Every electron at once; `zoom` (1 or more) brings the inner shells out to where the outer one was. */
export function atomView(info, zoom = 1) {
  const t = atomTable(info)
  const outerPeak = Math.max(...info.subs.map(s => s.peak))
  const scale = (OUTER / outerPeak) * zoom
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
