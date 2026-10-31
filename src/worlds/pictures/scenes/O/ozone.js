// Oxygen's picture "Earth's invisible sunscreen" as a room (docs/knowledge/picture-rooms.md): a research
// station on the Antarctic ice, on the Brunt Ice Shelf where Halley stands and where the ozone hole was found
// (stages/polar.js: flat snow to the horizon, a low spring sun, long blue shadows, route flags, a station of
// modules on legs far off). A story of a danger found and fixed by the whole world. Three things to do, each
// step chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the
// prompt names the next tap, E opens the station's panel, whose buttons and slider do the same:
// - the ozone factory: a model sun over four filters (UV-C, UV-B, UV-A, visible light), the ozone layer as a
//   glowing slab of O2 and O3 molecules, UV beads on a string over the snow. Tap a filter and one photon
//   falls: UV-C splits an O2 and each atom joins another O2 (two new O3), UV-B is caught by an O3, which
//   breaks and forms again (its energy left as warmth), or meets another O3 and both become O2; UV-A and
//   visible light come down, UV-A colouring the beads. Tap the sun for all four. A wavelength slider sends a
//   beam whose part below the layer is dimmed by ozone's real absorption (300 DU, sun overhead);
// - measuring the ozone: the Dobson hut. Tap the Dobson spectrophotometer and the violet column of ozone
//   standing over its table is squeezed into the slab it would make at the ground's pressure (10 times
//   bigger, beside a 1 euro coin at the same scale); a month slider (or a tap on the chart) and a logbook of
//   decades show Halley's monthly means (the spring dip, and at Scientist level how it deepened); tap the
//   balloon and an ozonesonde rises, drawing ozone against height (modelled, scaled to those means);
// - the fix: an old fridge and a spray can. Tap one: a CFC-12 molecule climbs for years to a window 20 km
//   up, where sunlight breaks it and its chlorine is locked away as HCl; tap the icy cloud (polar winter) and
//   the chlorine is set loose as Cl2; tap the spring sun and the chlorine atoms break ozone after ozone (the
//   ClO dimer cycle), then are caught again. Tap the treaty (Montreal, 1987) on the hut's wall; a year
//   slider moves a globe's hole and a chart of Halley's October ozone and NOAA's chlorine, to recovery.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes; parts.rayTo(point) aims a real tap.
//
// Facts (checked 2026-10-30, sources in ozone.words.js): Halley's provisional monthly means (BAS, J.
// Shanklin, legacy.bas.ac.uk/met/jds/ozone: ZOZ5699.DAT, 1956 to 2022 by Dobson; zmsatoz.dat, satellite,
// for the Octobers the Dobson missed: 2017, 2018, 2021 to 2025); NOAA's Ozone Depleting Gas Index, Antarctic
// EESC 1992 to 2024 (the 1980 level, about 2155 ppt, from its index; before 1980 a sketch); the expected
// October ozone after 2025 drawn as a straight line to Halley's 1980 October mean (226 DU) in 2066, the
// WMO/UNEP 2022 date for Antarctic recovery. Ozone's cross-sections are rounded literature values (about
// 273 K). The balloon profiles are a model: a peak near 18 km (NOAA's South Pole soundings), the spring loss
// taken between about 14 and 22 km.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, clamp, lerp, damp, random, hdr, num, screen } from '../../../wings/noble/kit.js'
import { polarStage } from '../../stages/polar.js'
import { glowTexture } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAND } from '../../../wings/oxygen/earthLand.js'
import { OZONE_WORDS } from './ozone.words.js'

export const WORDS = OZONE_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// ---- Halley's numbers ----

// mean total ozone (DU) by month, August to April, for each decade's seasons (BAS provisional monthly means)
const DECADES = {
  e60: [291, 282, 300, 350, 349, 313, 294, 296, 278],
  e70: [294, 258, 279, 341, 345, 313, 289, 278, 272],
  e80: [269, 213, 200, 264, 315, 295, 275, 263, 259],
  e90: [209, 163, 141, 195, 272, 275, 264, 259, 253],
}
const ERAS = ['e60', 'e70', 'e80', 'e90']
const OCTOBER = 2
// October means at Halley, 1956 to 2025 (Dobson; satellite for 2017, 2018 and 2021 to 2025)
const OCT0 = 1956
const OCT = [
  313, 322, 306, 303, 293, 309, 323, 301, 310, 274, 308, 315, 293, 275, 275, 291, 296, 271, 272, 303,
  283, 251, 284, 263, 226, 237, 218, 195, 194, 185, 233, 150, 216, 150, 173, 137, 147, 122, 126, 130,
  148, 141, 140, 143, 137, 138, 224, 158, 191, 155, 137, 159, 145, 165, 184, 140, 179, 177, 148, 139,
  155, 179, 137, 208, 150, 131, 138, 147, 147, 160,
]
const OCT_LAST = OCT0 + OCT.length - 1
const OCT_1980 = 226
const RECOVERED = 2066
// Antarctic EESC (ppt), NOAA ODGI, 1992 to 2024
const EESC0 = 1992
const EESC = [3544, 3666, 3784, 3888, 3974, 4041, 4088, 4119, 4140, 4151, 4151, 4137, 4117, 4094, 4069, 4043, 4017, 3990, 3963, 3933, 3902, 3872, 3843, 3815, 3786, 3759, 3735, 3711, 3686, 3660, 3635, 3609, 3583]
const EESC_LAST = EESC0 + EESC.length - 1
const E1980 = 2155
const YEAR0 = 1956
const YEAR1 = 2080

/** Chlorine and bromine high over Antarctica (EESC, ppt): a sketch before 1980, NOAA's from 1992, expected
 *  back at the 1980 level around 2070 (NOAA, from the WMO/UNEP 2022 scenarios). */
function eesc(y) {
  if (y <= 1980) return 1300 + (E1980 - 1300) * Math.pow(clamp((y - 1956) / 24), 1.8)
  if (y < EESC0) return lerp(E1980, EESC[0], (y - 1980) / (EESC0 - 1980))
  if (y <= EESC_LAST) {
    const i = Math.floor(y - EESC0)
    return lerp(EESC[i], EESC[Math.min(EESC.length - 1, i + 1)], y - EESC0 - i)
  }
  if (y <= 2070) return E1980 + (EESC[EESC.length - 1] - E1980) * Math.pow((2070 - y) / (2070 - EESC_LAST), 1.15)
  return E1980 - 18 * (y - 2070)
}
/** October's mean ozone at Halley: measured to 2025, then expected (a straight line from the last ten years'
 *  mean to the 1980 level in 2066). */
const RECENT = OCT.slice(-10).reduce((s, v) => s + v, 0) / 10
function octOzone(y) {
  if (y <= OCT_LAST) {
    const i = clamp(Math.floor(y - OCT0), 0, OCT.length - 1)
    return lerp(OCT[i], OCT[Math.min(OCT.length - 1, i + 1)], clamp(y - OCT0 - i))
  }
  return RECENT + ((OCT_1980 - RECENT) * (y - OCT_LAST)) / (RECOVERED - OCT_LAST)
}

// ---- light and ozone ----

// ozone's absorption cross-section (cm² per molecule, rounded, about 273 K): the Hartley band (peak near
// 255 nm), the Huggins bands' tail, the weak Chappuis band in the visible
const XS = [[200, 3.2e-19], [220, 2.0e-18], [240, 8.0e-18], [255, 1.13e-17], [270, 7.5e-18], [280, 3.9e-18], [290, 1.5e-18], [300, 3.9e-19], [305, 1.9e-19], [310, 1.0e-19], [315, 4.6e-20], [320, 2.6e-20], [330, 7e-21], [340, 1.5e-21], [350, 4e-22], [380, 3e-23], [410, 1e-23], [450, 3e-22], [500, 1.5e-21], [550, 3.3e-21], [600, 5.1e-21], [650, 2.6e-21], [700, 1e-21]]
const COLUMN = 300 * 2.687e16 // molecules per cm² in 300 DU
/** The share of light at `nm` that passes 300 DU of ozone with the sun overhead (O2 takes all below 242 nm). */
function through(nm) {
  let s = XS[XS.length - 1][1]
  for (let i = 0; i < XS.length - 1; i++) {
    const [a, sa] = XS[i]
    const [b, sb] = XS[i + 1]
    if (nm <= b) {
      const t = clamp((nm - a) / (b - a))
      s = Math.exp(lerp(Math.log(sa), Math.log(sb), t))
      break
    }
  }
  const o2 = clamp((nm - 236) / 8)
  return Math.exp(-s * COLUMN) * o2 * o2 * (3 - 2 * o2)
}
const bandOf = nm => (nm < 280 ? 'C' : nm < 315 ? 'B' : nm < 400 ? 'A' : 'V')
const reachOf = T => (T < 0.01 ? 'none' : T < 0.25 ? 'little' : T < 0.65 ? 'half' : T < 0.93 ? 'most' : 'all')
/** A colour for light of `nm`: the visible spectrum as the eye sees it, ultraviolet in the boards' violets. */
function nmColor(nm) {
  if (nm < 280) return new THREE.Color('#ff5ad8')
  if (nm < 315) return new THREE.Color('#a66bff')
  if (nm < 400) return new THREE.Color('#c9b6ff')
  const stops = [[400, '#7a3cff'], [440, '#3d5cff'], [480, '#18b4ff'], [510, '#2cff6a'], [560, '#d8ff2a'], [580, '#ffd21a'], [620, '#ff6a1a'], [700, '#ff2a2a']]
  for (let i = 0; i < stops.length - 1; i++) {
    if (nm <= stops[i + 1][0]) return new THREE.Color(stops[i][1]).lerp(new THREE.Color(stops[i + 1][1]), (nm - stops[i][0]) / (stops[i + 1][0] - stops[i][0]))
  }
  return new THREE.Color('#ff2a2a')
}
/** How strongly UV beads answer light of `nm` (their dyes switch under UV-A and UV-B, not visible light). */
const beadAnswer = nm => clamp((nm - 280) / 15) * (1 - clamp((nm - 385) / 15))

// ---- an ozone profile over Antarctica (a model): partial pressure in mPa against height in km ----
const tempAt = z => (z < 10 ? 240 - 4 * z : z < 20 ? 200 : 200 + 1.5 * (z - 20))
const TROP = z => 2.2 * Math.exp(-z / 12) * (1 - span(9, 16, z))
const STRAT = z => Math.exp(-(((z - 18) / (z < 18 ? 6.0 : 8.5)) ** 2))
const HOLE = z => Math.exp(-(((z - 18) / 4.3) ** 6))
/** Dobson units in a profile given in mPa (1 DU = 2.687e20 molecules per m²). */
function duOf(f) {
  let s = 0
  for (let z = 0; z <= 45; z += 0.25) s += ((f(z) * 1e-3) / (1.380649e-23 * tempAt(z))) * 250
  return s / 2.687e20
}
const DU_T = duOf(TROP)
const DU_S = duOf(STRAT)
const DU_H = duOf(z => STRAT(z) * HOLE(z))
/** The profile that holds `du` in a month whose ozone before the hole was `base`: below it, the loss is
 *  taken from about 14 to 22 km first (at most 97 % of it there), then from everywhere. */
function profileFor(du, base) {
  if (du >= base) {
    const P = Math.max(0, (du - DU_T) / DU_S)
    return z => TROP(z) + P * STRAT(z)
  }
  let P = Math.max(0, (base - DU_T) / DU_S)
  let b = (base - du) / Math.max(1e-6, P * DU_H)
  if (b > 0.97) {
    b = 0.97
    P = Math.max(0, (du - DU_T) / (DU_S - 0.97 * DU_H))
  }
  return z => TROP(z) + P * STRAT(z) * (1 - b * HOLE(z))
}

// ---- molecules: atoms that move between molecules, easing into each kind's shape ----

const EL = { O: { c: '#f2302b', r: 0.07 }, Cl: { c: '#3fcf55', r: 0.085 }, F: { c: '#c6ee72', r: 0.058 }, C: { c: '#4a505c', r: 0.07 }, H: { c: '#eef3f8', r: 0.045 } }
// each kind's atoms (in this order) and where they sit (m)
const KINDS = {
  O: [['O', 0, 0, 0]],
  O2: [['O', -0.068, 0, 0], ['O', 0.068, 0, 0]],
  O3: [['O', 0, 0.045, 0], ['O', -0.115, -0.03, 0], ['O', 0.115, -0.03, 0]],
  Cl: [['Cl', 0, 0, 0]],
  Cl2: [['Cl', -0.085, 0, 0], ['Cl', 0.085, 0, 0]],
  ClO: [['Cl', -0.075, 0, 0], ['O', 0.085, 0, 0]],
  Cl2O2: [['Cl', -0.13, 0, 0], ['Cl', 0.13, 0, 0], ['O', -0.055, 0.12, 0], ['O', 0.055, 0.12, 0]],
  HCl: [['Cl', -0.03, 0, 0], ['H', 0.1, 0, 0]],
  CFC: [['C', 0, 0, 0], ['Cl', 0, 0.15, 0], ['Cl', 0.141, -0.05, 0], ['F', -0.066, -0.047, 0.114], ['F', -0.066, -0.047, -0.114]],
  CF2: [['C', 0, 0, 0], ['F', -0.066, -0.047, 0.114], ['F', -0.066, -0.047, -0.114]],
}

/** A box of molecules (lo..hi in the parent's space) drifting about. make(kind, at), mol(kind, atoms, at),
 *  remove(m), drop(atom), nearest(kind, p), count(kind), clear(); m.seek = { target (a molecule or a point),
 *  speed, near, done } moves it there. `halos` ({ kind: colour, ... }, with a glow texture): a soft glow
 *  round every molecule of that kind, so an ozone reads apart from an O2 at a few metres. */
function chemBox(parent, { lo, hi, light, speed = 0.12, seed = 77, halos = null, glow = null }) {
  const geo = new THREE.SphereGeometry(1, light ? 12 : 18, light ? 8 : 12)
  const mats = {}
  for (const [k, v] of Object.entries(EL)) mats[k] = new THREE.MeshStandardMaterial({ color: v.c, roughness: 0.35, emissive: v.c, emissiveIntensity: 0.22 })
  const haloMats = halos && glow ? Object.fromEntries(Object.entries(halos).map(([k, c]) => [k, new THREE.SpriteMaterial({ map: glow, color: hdr(c, 1.2), transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })])) : {}
  const haloPool = []
  const rnd = random(seed)
  const mols = []
  const tmp = new THREE.Vector3()
  const q = new THREE.Quaternion()
  const inside = () => V3(lerp(lo.x, hi.x, rnd()), lerp(lo.y, hi.y, rnd()), lerp(lo.z, hi.z, rnd()))
  const drift = () => V3(rnd() - 0.5, (rnd() - 0.5) * 0.6, (rnd() - 0.5) * 0.5).normalize().multiplyScalar(speed * (0.5 + rnd()))
  const atom = (el, p) => {
    const mesh = new THREE.Mesh(geo, mats[el])
    mesh.scale.setScalar(EL[el].r)
    mesh.position.copy(p)
    mesh.castShadow = false
    parent.add(mesh)
    return { el, mesh, pos: mesh.position }
  }
  const sys = {
    mols,
    inside,
    atom,
    mol(kind, atoms, c = inside()) {
      const m = {
        kind,
        atoms,
        c: c.clone(),
        v: drift(),
        q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3)),
        axis: V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
        w: 0.3 + rnd() * 0.6,
        seek: null,
        held: false,
        pin: false,
      }
      mols.push(m)
      return m
    },
    make(kind, c = inside()) {
      return sys.mol(kind, KINDS[kind].map(([el]) => atom(el, c)), c)
    },
    has: m => mols.includes(m),
    remove(m) {
      const i = mols.indexOf(m)
      if (i >= 0) mols.splice(i, 1)
    },
    drop(a) {
      parent.remove(a.mesh)
    },
    kill(m) {
      sys.remove(m)
      m.atoms.forEach(sys.drop)
    },
    count: kind => mols.reduce((n, m) => n + (m.kind === kind ? 1 : 0), 0),
    nearest(kind, p, but = null) {
      let best = null
      let bd = Infinity
      for (const m of mols) {
        if (m.kind !== kind || m.held || m === but || m.seek) continue
        const d = m.c.distanceToSquared(p)
        if (d < bd) {
          bd = d
          best = m
        }
      }
      return best
    },
    clear() {
      for (const m of mols.slice()) sys.kill(m)
    },
    apart(a, b, k = 0.5) {
      tmp.set(rnd() - 0.5, (rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.4).normalize().multiplyScalar(k)
      a.v.copy(tmp)
      b.v.copy(tmp).multiplyScalar(-1)
    },
    update(dt) {
      for (const m of mols.slice()) {
        if (!mols.includes(m)) continue
        if (m.seek) {
          const goal = m.seek.target.c ?? m.seek.target
          tmp.copy(goal).sub(m.c)
          const d = tmp.length()
          if (d < (m.seek.near ?? 0.15)) {
            const done = m.seek.done
            m.seek = null
            done?.()
            if (!mols.includes(m)) continue
          } else m.c.addScaledVector(tmp.normalize(), Math.min(d, (m.seek.speed ?? 0.9) * dt))
        } else if (!m.pin) {
          // freshly parted atoms fly apart quickly and slow to a drift
          m.v.multiplyScalar(m.v.length() > speed * 1.6 ? Math.exp(-2.2 * dt) : 1)
          m.c.addScaledVector(m.v, dt)
          for (const ax of ['x', 'y', 'z']) {
            if (m.c[ax] < lo[ax]) {
              m.c[ax] = lo[ax]
              m.v[ax] = Math.abs(m.v[ax])
            } else if (m.c[ax] > hi[ax]) {
              m.c[ax] = hi[ax]
              m.v[ax] = -Math.abs(m.v[ax])
            }
          }
        }
        m.q.multiply(q.setFromAxisAngle(m.axis, m.w * dt))
        const lay = KINDS[m.kind]
        const k = 1 - Math.exp(-10 * dt)
        m.atoms.forEach((a, i) => {
          const s = lay[i] ?? lay[0]
          tmp.set(s[1], s[2], s[3]).applyQuaternion(m.q).add(m.c)
          a.pos.lerp(tmp, k)
        })
      }
      // the glows, one per molecule of a glowing kind, fading in as a molecule becomes one
      let n = 0
      for (const m of mols) {
        const mat = haloMats[m.kind]
        if (!mat) {
          m.glowK = 0
          continue
        }
        let s = haloPool[n]
        if (!s) {
          s = new THREE.Sprite(mat)
          s.raycast = () => {}
          parent.add(s)
          haloPool.push(s)
        }
        s.material = mat
        s.visible = true
        m.glowK = Math.min(1, (m.glowK ?? 0) + dt * 2.5)
        s.position.copy(m.c)
        s.scale.setScalar(0.5 * m.glowK)
        n++
      }
      for (let i = n; i < haloPool.length; i++) haloPool[i].visible = false
    },
    dispose() {
      geo.dispose()
      Object.values(mats).forEach(m => m.dispose())
      Object.values(haloMats).forEach(m => m.dispose())
    },
  }
  return sys
}

/** A wavy ribbon (a photon, as the boards draw light): `len` long downward from its head, facing +z. */
function ribbonGeo(len = 0.62, amp = 0.06, waves = 3.5, w = 0.038) {
  const N = 56
  const pos = []
  const idx = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const y = -t * len
    const x = Math.sin(t * waves * TAU) * amp * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.2)))
    const dx = Math.cos(t * waves * TAU) * amp * waves * TAU
    const nl = Math.hypot(len, dx)
    const half = (w / 2) * (1 - t * 0.6)
    pos.push(x - (len / nl) * half, y - (dx / nl) * half, 0, x + (len / nl) * half, y + (dx / nl) * half, 0)
    if (i < N) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  return g
}

/** Text on a canvas with the digit after a letter as a subscript (O3 -> O₃). */
function chemText(g, text, x, y, size, align = 'left', weight = 700) {
  const parts = [...String(text).matchAll(/([A-Za-z])(\d)|./gu)].flatMap(m => (m[2] ? [[m[1], 0], [m[2], 1]] : [[m[0], 0]]))
  const width = parts.reduce((s, [c, sub]) => {
    g.font = `${weight} ${sub ? size * 0.66 : size}px Outfit`
    return s + g.measureText(c).width
  }, 0)
  let px = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x
  g.textAlign = 'left'
  for (const [c, sub] of parts) {
    g.font = `${weight} ${sub ? size * 0.66 : size}px Outfit`
    g.fillText(c, px, y + (sub ? size * 0.22 : 0))
    px += g.measureText(c).width
  }
}

// ---- where things stand (metres; the spawn looks north, along -z, toward the Dobson hut) ----
const R = 14
const SPAWN = { x: 0, z: 7.6 }
const BACK = { x: 0, z: 10.7 }
const STAND = { x: -2.6, z: 6.9 }
const HOST = { x: 2.9, z: 6.3 }
const FAC = { x: -7.6, z: -1.8 } // the ozone factory
const FSPOT = { x: -4.0, z: 1.5 }
const HUT = { x: -0.6, z: -8.8 } // the Dobson hut
const MSPOT = { x: -0.6, z: -3.1 }
const FIX = { x: 7.0, z: -4.4 } // the store hut, its treaty and the fix
const XSPOT = { x: 4.7, z: 1.0 }
// the low spring sun, behind the visitor's right shoulder: long shadows run across the view
const SUN = [0.72, 0.3, 0.62]
const FAC_C = '#b49bff'
const MEAS_C = '#7fd0ff'
const FIX_C = '#7ee08a'
const KIND_C = { C: '#ff5ad8', B: '#a66bff', A: '#c9b6ff', V: '#ffe27a' }
const faceTo = (o, x, z) => (o.rotation.y = Math.atan2(x - o.position.x, z - o.position.z))

export async function build({ ctx, root, E, W, ex, say, later, light, lang, level, depth, clickable, color }) {
  const share = id => ctx.share?.(id)
  const refreshPanel = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const updates = []
  const textures = []
  const disposers = []
  const glow = glowTexture(128)
  textures.push(glow)
  const ps = (list, lv) => list[depth(lv)].map(p => ({ p }))
  const sci = () => level() === 'scientist'
  const syncText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  const now = () => performance.now() / 1000
  const shadows = obj => {
    if (light) return obj
    obj.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    return obj
  }
  /** A floating label: white with a dark edge, readable on the snow and on the sky. */
  const label = (text, size = 0.12, col = '#ffffff', opts = {}) =>
    makeText(text, { size, color: col, outlineWidth: size * 0.09, outlineColor: '#0d1233', ...opts })

  // =====================================================================================
  // The ice shelf on a spring day
  // =====================================================================================
  const stage = polarStage({
    radius: R,
    light,
    sun: SUN,
    wind: -0.45,
    // route flags: a line out to the far station, another off to the east, and a few round the camp
    flags: [[-5.2, -12.6], [-8.8, -20.8], [-12.4, -29], [-16, -37.2], [-19.6, -45.4], [-23.2, -53.6], [-26.8, -61.8], [12.4, -8.6], [18.6, -14.2], [24.8, -19.8], [-11.6, 6.8], [11.2, 7.4]],
    station: { x: -64, z: -150, rot: 0.32 },
  })
  root.add(stage.group)
  const solids = stage.solids
  updates.push((dt, t) => stage.update(t))
  // a few fuel drums and a sledge, as round any station
  {
    const drumGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.88, 18).translate(0, 0.44, 0)
    const cols = ['#c75b2a', '#2f5f9e', '#c75b2a', '#c9a23a']
    ;[[11.2, -5.0], [11.8, -4.4], [11.5, -5.7], [12.2, -5.2]].forEach(([x, z], i) => {
      const d = new THREE.Mesh(drumGeo, new THREE.MeshStandardMaterial({ color: cols[i], roughness: 0.55, metalness: 0.3 }))
      d.position.set(x, 0, z)
      root.add(shadows(d))
    })
    solids.push(circle(11.7, -5.1, 1.0))
    const sledge = new THREE.Group()
    const wood = new THREE.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.8 })
    for (const s of [-0.38, 0.38]) {
      const run = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 2.4), wood)
      run.position.set(s, 0.05, 0)
      sledge.add(run)
    }
    for (let i = 0; i < 6; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.12), wood)
      slat.position.set(0, 0.3, -1.0 + i * 0.4)
      sledge.add(slat)
    }
    const load = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.4, 1.2, 2, 0.05), new THREE.MeshStandardMaterial({ color: '#4d6b4a', roughness: 0.9 }))
    load.position.set(0, 0.52, 0)
    sledge.add(load)
    sledge.position.set(-4.6, 0, -9.8)
    sledge.rotation.y = 0.5
    root.add(shadows(sledge))
    solids.push(box(-4.6, -9.8, 1.2, 2.6, { rot: 0.5 }))
  }

  const M = {
    navy: new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.4, metalness: 0.2, emissive: '#10173f', emissiveIntensity: 0.6 }),
    steel: new THREE.MeshStandardMaterial({ color: '#8a93a6', roughness: 0.4, metalness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2a2f3e', roughness: 0.6, metalness: 0.3 }),
    white: new THREE.MeshStandardMaterial({ color: '#dfe4ec', roughness: 0.6 }),
    wood: new THREE.MeshStandardMaterial({ color: '#7a5636', roughness: 0.8 }),
  }
  const GOLD = new THREE.Color('#ffd166')
  /** A glowing frame in a station's colour that turns gold once the station is discovered. */
  const edgeOf = c => {
    const base = new THREE.Color(c)
    const mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.0, roughness: 0.4, metalness: 0.2 })
    return {
      mat,
      setRead: r => {
        mat.color.copy(r ? GOLD : base)
        mat.emissive.copy(r ? GOLD : base)
        mat.emissiveIntensity = r ? 0.45 : 1.0
      },
    }
  }
  /** A canvas board (w x h metres, px wide) in a glowing frame, facing +z. */
  const board = (w, h, px, c) => {
    const ph = Math.round((px * h) / w)
    const tex = canvasTex(px, ph, null)
    textures.push(tex)
    const group = new THREE.Group()
    const edge = edgeOf(c)
    const frame = new THREE.Mesh(new RoundedBoxGeometry(w + 0.12, h + 0.12, 0.06, 2, 0.025), edge.mat)
    frame.position.z = -0.035
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }))
    group.add(frame, face)
    return { group, edge, face, tex, W: px, H: ph, draw: fn => tex.userData.redraw(fn) }
  }
  // flashes: a soft burst of light that grows and fades
  const flashes = []
  const flashMat = c => new THREE.SpriteMaterial({ map: glow, color: hdr(c, 2.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  function flash(parent, p, c, size = 0.5, life = 0.6) {
    const s = new THREE.Sprite(flashMat(c))
    s.position.copy(p)
    parent.add(s)
    flashes.push({ s, parent, t: 0, life, size })
  }
  updates.push(dt => {
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i]
      f.t += dt
      const k = f.t / f.life
      if (k >= 1) {
        f.parent.remove(f.s)
        f.s.material.dispose()
        flashes.splice(i, 1)
        continue
      }
      f.s.scale.setScalar(f.size * (0.4 + 0.8 * Math.sqrt(k)))
      f.s.material.opacity = 1 - k
    }
  })
  const camLocal = (group, out) => group.worldToLocal(out.copy(ctx.camera.position))

  // =====================================================================================
  // 1. The ozone factory: a model sun, four filters, the layer, the beads
  // =====================================================================================
  const fac = new THREE.Group()
  fac.position.set(FAC.x, 0, FAC.z)
  faceTo(fac, FSPOT.x, FSPOT.z)
  root.add(fac)
  const LANE = { C: -0.9, B: -0.3, A: 0.3, V: 0.9 }
  const LENS_Y = 3.62
  // photons fly slowly enough to follow with the eye
  const PHOTON_V = 1.5
  const LAYER = { y0: 1.95, y1: 2.95, w: 2.5, d: 0.75 }
  const BEAD_Y = 1.05
  {
    const postGeo = new THREE.CylinderGeometry(0.07, 0.09, 4.05, 10).translate(0, 2.025, 0)
    for (const x of [-1.45, 1.45]) {
      const p = new THREE.Mesh(postGeo, M.steel)
      p.position.x = x
      fac.add(shadows(p))
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 16), M.dark)
      foot.position.set(x, 0.04, 0)
      fac.add(foot)
    }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.1, 0.12), M.steel)
    bar.position.y = 4.0
    fac.add(shadows(bar))
    for (const [lx, lz] of [[-1.45, 0], [1.45, 0]]) {
      const v = new THREE.Vector3(lx, 0, lz).applyAxisAngle(new THREE.Vector3(0, 1, 0), fac.rotation.y)
      solids.push(circle(FAC.x + v.x, FAC.z + v.z, 0.3))
    }
  }
  // the model sun on the bar, rays turning slowly
  const sunLamp = new THREE.Group()
  sunLamp.position.set(0, 4.42, 0)
  fac.add(sunLamp)
  const sunRays = new THREE.Group()
  {
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), new THREE.MeshBasicMaterial({ color: hdr('#ffd75a', 1.8) }))
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ffc94a', 1.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    halo.scale.setScalar(1.6)
    const rayMat = new THREE.MeshBasicMaterial({ color: hdr('#ffe08a', 1.4) })
    for (let i = 0; i < 12; i++) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.14, 0.035), rayMat)
      const a = (i / 12) * TAU
      r.position.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0)
      r.rotation.z = a - Math.PI / 2
      sunRays.add(r)
    }
    sunLamp.add(core, halo, sunRays)
  }
  updates.push(dt => (sunRays.rotation.z += dt * 0.15))
  // the four filters hanging under the bar, each its light's colour
  const lenses = {}
  for (const k of ['C', 'B', 'A', 'V']) {
    const g = new THREE.Group()
    g.position.set(LANE[k], LENS_Y, 0)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6), M.steel)
    rod.position.y = 0.2
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 10, 32).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: KIND_C[k], emissive: KIND_C[k], emissiveIntensity: 1.1, roughness: 0.4 }))
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 32), new THREE.MeshStandardMaterial({ color: KIND_C[k], emissive: KIND_C[k], emissiveIntensity: 0.5, roughness: 0.15, transparent: true, opacity: 0.75 }))
    // a bigger, invisible shape to tap
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
    const name = label(E.factory.signs[k], 0.12)
    name.position.y = -0.28
    g.add(rod, ring, disc, hit, name)
    g.userData.ring = ring
    fac.add(g)
    lenses[k] = g
  }
  // the ozone layer: a glowing slab with its molecules
  {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(LAYER.w, LAYER.y1 - LAYER.y0, LAYER.d),
      new THREE.MeshBasicMaterial({ color: '#9b8cff', transparent: true, opacity: 0.1, depthWrite: false }),
    )
    slab.position.y = (LAYER.y0 + LAYER.y1) / 2
    slab.raycast = () => {}
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(slab.geometry), new THREE.LineBasicMaterial({ color: hdr('#b9adff', 1.3), transparent: true, opacity: 0.6 }))
    edges.position.copy(slab.position)
    fac.add(slab, edges)
  }
  const layerSign = screen({ width: 0.92, height: 0.5, color: FAC_C, title: E.factory.signs.layer, line: '', titleSize: 0.085, lineSize: 0.085 })
  layerSign.group.position.set(-1.98, (LAYER.y0 + LAYER.y1) / 2, 0.05)
  fac.add(layerSign.group)
  const chemF = chemBox(fac, { lo: V3(-1.08, LAYER.y0 + 0.14, -0.22), hi: V3(1.08, LAYER.y1 - 0.14, 0.22), light, seed: 91, halos: { O3: '#b49bff' }, glow })
  disposers.push(() => chemF.dispose())
  // the warmth left in the layer, and a thermometer on the right post
  const warmth = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ff9a4a', 1.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  warmth.position.set(0, (LAYER.y0 + LAYER.y1) / 2, 0)
  warmth.scale.set(3.2, 1.4, 1)
  fac.add(warmth)
  const thermo = new THREE.Group()
  thermo.position.set(1.62, LAYER.y0 + 0.05, 0.1)
  fac.add(thermo)
  const thermoCol = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.8, 10).translate(0, 0.4, 0), new THREE.MeshStandardMaterial({ color: '#ff4a3a', emissive: '#ff2a1a', emissiveIntensity: 0.9 }))
  {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.86, 12).translate(0, 0.43, 0), new THREE.MeshStandardMaterial({ color: '#e8f2ff', transparent: true, opacity: 0.35, roughness: 0.1 }))
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), thermoCol.material)
    const word = label(E.factory.signs.heat, 0.085)
    word.position.set(0, 0.98, 0)
    thermo.add(tube, bulb, thermoCol, word)
  }
  // the UV beads on a string over the snow
  const BEADS = 15
  const beadPal = ['#9a3cf0', '#2f62f2', '#f2408f', '#7a2fe0', '#1f8cf2', '#d83ccf']
  const beads = new THREE.Group()
  fac.add(beads)
  const beadMats = []
  const beadX = []
  {
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 2.9, 6).rotateZ(Math.PI / 2), M.dark)
    string.position.set(0, BEAD_Y, 0.12)
    beads.add(string)
    const geo = new THREE.SphereGeometry(0.06, 16, 12)
    for (let i = 0; i < BEADS; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: '#f4f2ee', roughness: 0.35, emissive: '#000000' })
      const b = new THREE.Mesh(geo, mat)
      const x = -1.2 + (i / (BEADS - 1)) * 2.4
      b.position.set(x, BEAD_Y, 0.12)
      beads.add(b)
      beadMats.push({ mat, col: new THREE.Color(beadPal[i % beadPal.length]), dose: 0 })
      beadX.push(x)
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.3, 0.3), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.set(0, BEAD_Y, 0.12)
    beads.add(hit)
  }
  const beadSign = screen({ width: 0.56, height: 0.3, color: FAC_C, title: E.factory.signs.beads, line: '', titleSize: 0.075 })
  beadSign.group.position.set(-1.9, BEAD_Y, 0.05)
  fac.add(beadSign.group)
  // the wavelength screen on its post, turned a little toward the visitor
  const waveBoard = board(1.3, 0.86, 760, FAC_C)
  const waveStand = new THREE.Group()
  waveStand.position.set(2.55, 0, 0.35)
  waveStand.rotation.y = -0.4
  fac.add(waveStand)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.2, 8).translate(0, 0.6, 0), M.steel)
    waveStand.add(shadows(post))
    waveBoard.group.position.set(0, 1.55, 0)
    waveBoard.group.rotation.x = -0.12
    waveStand.add(waveBoard.group)
    const v = new THREE.Vector3(2.55, 0, 0.35).applyAxisAngle(new THREE.Vector3(0, 1, 0), fac.rotation.y)
    solids.push(circle(FAC.x + v.x, FAC.z + v.z, 0.25))
  }
  // the beam a wavelength slider sends: bright above the layer, dimmed by the ozone below it
  const beamMats = [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  const beamParts = [
    [4.15, LAYER.y1],
    [LAYER.y1, LAYER.y0],
    [LAYER.y0, 0.02],
  ].map(([a, b], i) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, a - b, 14, 1, true).translate(0, (a + b) / 2, 0), beamMats[i])
    m.raycast = () => {}
    m.visible = false
    fac.add(m)
    return m
  })
  const beamSpot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  beamSpot.position.set(0, 0.05, 0)
  beamSpot.scale.set(0.8, 0.8, 1)
  fac.add(beamSpot)

  // ---- the factory's steps ----
  // shared: the ozone in the layer (odd, 33 atoms in all: o2 = (33 - 3 * o3) / 2), how many of each photon
  // were sent (each new one plays where it was not sent), the beam's wavelength (0: off)
  const Fs = { o3: 5, n: { C: 0, B: 0, A: 0, V: 0, S: 0 }, lam: 0 }
  const o2Of = o3 => (33 - 3 * o3) / 2
  let genF = 0
  let heat = 0
  function buildLayer() {
    genF++
    chemF.clear()
    for (let i = 0; i < o2Of(Fs.o3); i++) chemF.make('O2')
    for (let i = 0; i < Fs.o3; i++) chemF.make('O3')
  }
  buildLayer()
  const photonGeo = ribbonGeo()
  disposers.push(() => photonGeo.dispose())
  const photonMat = Object.fromEntries(Object.entries(KIND_C).map(([k, c]) => [k, new THREE.MeshBasicMaterial({ color: hdr(c, 2.0), side: THREE.DoubleSide, transparent: true, depthWrite: false })]))
  const photons = []
  /** The outcome of a photon of `kind`, decided as it is sent (the same everywhere: it follows the shared
   *  counts), changing the ozone it will leave. */
  function decide(kind, counted = true) {
    if (kind === 'C') {
      if (Fs.o3 <= 9) {
        Fs.o3 += 2
        return 'split'
      }
      return 'full'
    }
    if (kind === 'B') {
      if (counted && Fs.n.B % 4 === 0) return 'pass'
      if (Fs.o3 >= 7) {
        Fs.o3 -= 2
        return 'break'
      }
      return 'reform'
    }
    return 'pass'
  }
  function sendPhoton(kind, mode, mine, delay = 0) {
    const g0 = genF
    later(delay, () => {
      if (g0 !== genF) return
      const mesh = new THREE.Mesh(photonGeo, photonMat[kind])
      const p = { kind, mode, mine, mesh, pos: V3(LANE[kind] + (Math.random() - 0.5) * 0.12, LENS_Y - 0.12, (Math.random() - 0.5) * 0.12), target: null, g: g0 }
      mesh.position.copy(p.pos)
      fac.add(mesh)
      // a photon that is caught heads for a molecule of the kind that catches it
      if (mode === 'split') p.target = chemF.nearest('O2', p.pos)
      else if (mode === 'full' || mode === 'reform' || mode === 'break') p.target = chemF.nearest('O3', p.pos)
      if (mode !== 'pass' && !p.target) p.mode = 'lost'
      if (p.target) p.target.held = true
      photons.push(p)
      lenses[kind].userData.ring.material.emissiveIntensity = 3
    })
  }
  const facSay = (key, mine) => mine && say(at(E.factory.says[key], level()), FAC_C)
  /** A molecule of O that has just been freed looks for an O2 to join (or, `breaking`, an O3 to meet). */
  function seekFor(o, breaking) {
    const g0 = genF
    let t = chemF.nearest(breaking ? 'O3' : 'O2', o.c)
    if (!t) t = chemF.nearest(breaking ? 'O2' : 'O3', o.c)
    if (!t) return
    const joining = t.kind === 'O2'
    t.held = true
    o.seek = {
      target: t,
      speed: 1.0,
      near: 0.14,
      done: () => {
        t.held = false
        if (g0 !== genF || !chemF.has(t) || !chemF.has(o)) return
        if (joining) {
          // O + O2 (+ M) -> O3
          t.kind = 'O3'
          t.atoms = [o.atoms[0], ...t.atoms]
          chemF.remove(o)
          flash(fac, t.c, '#ffb46a', 0.35, 0.45)
          play('join')
        } else {
          // O + O3 -> 2 O2
          const [c, e1, e2] = t.atoms
          t.kind = 'O2'
          t.atoms = [e1, e2]
          o.kind = 'O2'
          o.atoms = [o.atoms[0], c]
          chemF.apart(t, o, 0.45)
          flash(fac, t.c, '#c9b6ff', 0.4, 0.45)
          play('part')
        }
      },
    }
  }
  function hitPhoton(p) {
    const m = p.target
    m.held = false
    if (!chemF.has(m)) return
    flash(fac, m.c, KIND_C[p.kind], 0.7, 0.55)
    play('part')
    if (p.mode === 'split' && m.kind === 'O2') {
      // O2 + UV-C -> 2 O, each soon joining an O2
      const [a, b] = m.atoms
      m.kind = 'O'
      m.atoms = [a]
      const m2 = chemF.mol('O', [b], m.c)
      chemF.apart(m, m2, 0.55)
      later(0.55, () => {
        if (!chemF.has(m) || !chemF.has(m2)) return
        seekFor(m, false)
        seekFor(m2, false)
      })
      facSay('C', p.mine)
    } else if (m.kind === 'O3') {
      // O3 + UV -> O2 + O: the O joins an O2 again (the light left as warmth), or meets an O3
      const [c, e1, e2] = m.atoms
      m.kind = 'O2'
      m.atoms = [e1, e2]
      const o = chemF.mol('O', [c], m.c)
      chemF.apart(m, o, 0.5)
      heat = Math.min(1, heat + 0.35)
      const breaking = p.mode === 'break'
      later(0.55, () => chemF.has(o) && seekFor(o, breaking))
      facSay(p.mode === 'full' ? 'Cfull' : breaking ? 'Bbreak' : 'B', p.mine)
    }
  }
  function landPhoton(p) {
    if (p.kind === 'V') {
      flash(fac, V3(p.pos.x, 0.06, p.pos.z), '#fff3c4', 0.6, 0.7)
      facSay('V', p.mine)
      return
    }
    // UV-A (and the odd UV-B) colours the beads under it
    const k = p.kind === 'A' ? 0.9 : 0.6
    beadMats.forEach((b, i) => (b.dose = Math.min(1, b.dose + k * Math.exp(-(((beadX[i] - p.pos.x) / 0.5) ** 2)))))
    flash(fac, V3(p.pos.x, BEAD_Y, 0.12), KIND_C[p.kind], 0.5, 0.5)
    play('electron')
    facSay(p.kind === 'A' ? 'A' : 'Bthrough', p.mine)
  }
  const facBusy = () => photons.length > 0 || chemF.mols.some(m => m.kind === 'O' || m.seek)
  const facPanel = lv => {
    const T = Fs.lam ? through(Fs.lam) : 0
    return {
      title: E.factory.title,
      color: FAC_C,
      blocks: [
        { slider: { label: E.factory.wave, min: 200, max: 700, step: 1, value: Fs.lam || 320, format: v => `${Math.round(v)} nm`, live: () => Fs.lam || 320, onInput: v => setLam(v) } },
        { buttons: ['C', 'B', 'A', 'V'].map(k => ({ label: E.factory.verbs[k], onClick: () => facStep(k) })) },
        { buttons: [{ label: E.factory.verbs.sun, onClick: () => facStep('sun') }, ...(Fs.lam ? [{ label: E.factory.verbs.off, onClick: () => setLam(0, true) }] : [])] },
        ...(Fs.lam ? [{ rows: [[E.factory.screen.beam, `${Math.round(Fs.lam)} nm, ${E.factory.bands[bandOf(Fs.lam)]}`], [E.factory.screen.y, lv === 'scientist' ? pctText(T) : E.factory.reach[reachOf(T)]]] }] : []),
        { rows: [['O₂', String(o2Of(Fs.o3))], ['O₃', String(Fs.o3)]] },
        ...ps(E.factory.panel, lv),
      ],
    }
  }
  const pctText = T => {
    if (T < 0.01) return E.factory.pctNone
    const pct = T < 0.1 ? Math.round(T * 100) : T > 0.97 ? Math.round(T * 100) : Math.round(T * 20) * 5
    return fill(E.factory.pct, { pct })
  }
  function facStep(step) {
    const lv = level()
    if (step === 'beads') {
      say(at(E.factory.says.beads, lv), FAC_C)
      return
    }
    if (step === 'screen') {
      ctx.showPanel(facPanel)
      return
    }
    if (photons.length >= 6) return say(at(W.busy, lv))
    if (step === 'sun') {
      Fs.n.S++
      const bMode = decide('B', false)
      const cMode = decide('C')
      sendPhoton('V', 'pass', true, 0)
      sendPhoton('A', 'pass', false, 0.25)
      sendPhoton('B', bMode, false, 0.5)
      sendPhoton('C', cMode, false, 0.75)
      play('beam')
      say(at(E.factory.says.sun, lv), FAC_C)
    } else if (KIND_C[step]) {
      Fs.n[step]++
      sendPhoton(step, decide(step), true)
      play('tap')
    } else return
    share('factory')
    ex.discover('factory', facPanel, 4)
    refreshPanel(facPanel)
  }
  let lamSend = null
  function setLam(v, now = false) {
    const was = !!Fs.lam
    Fs.lam = v ? clamp(Math.round(Number(v) || 0), 200, 700) : 0
    if (was !== !!Fs.lam) refreshPanel(facPanel)
    ex.discover('factory', facPanel, 4)
    if (now) {
      share('factory')
      return
    }
    if (!lamSend) {
      lamSend = setTimeout(() => {
        lamSend = null
        share('factory')
      }, 250)
    }
  }
  disposers.push(() => clearTimeout(lamSend))
  ex.add({
    id: 'factory',
    manual: true,
    x: FSPOT.x,
    z: FSPOT.z,
    radius: 2.3,
    label: E.factory.label,
    verb: () => {
      const H = E.factory.hints
      if (!Fs.n.C) return H.C
      if (!Fs.n.B) return H.B
      if (!Fs.n.A || !Fs.n.V) return H.A
      if (!Fs.n.S) return H.sun
      return H.wave
    },
    screens: [waveBoard.edge, layerSign, beadSign],
    focus: (() => {
      const v = new THREE.Vector3(0.45, 0, 0.2).applyAxisAngle(new THREE.Vector3(0, 1, 0), fac.rotation.y)
      return { x: FAC.x + v.x, y: 2.35, z: FAC.z + v.z, size: 4.7, width: 4.6 }
    })(),
    act: () => ctx.showPanel(facPanel),
  })
  for (const k of ['C', 'B', 'A', 'V']) clickable(lenses[k], () => facStep(k), { reach: 7 })
  clickable(sunLamp, () => facStep('sun'), { reach: 7 })
  clickable(beads, () => facStep('beads'), { reach: 7 })
  clickable(waveBoard.group, () => facStep('screen'), { reach: 7 })

  // the wavelength screen: the spectrum, the share that reaches the snow, the lamp's wavelength
  let waveDrawn = null
  function drawWave() {
    const key = `${Fs.lam}|${level()}`
    if (key === waveDrawn) return
    waveDrawn = key
    const lv = level()
    waveBoard.draw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const x0 = 60
      const x1 = w - 30
      const yTop = 120
      const yBot = h - 110
      const X = nm => x0 + ((nm - 200) / 500) * (x1 - x0)
      const Y = T => yBot - T * (yBot - yTop)
      g.fillStyle = FAC_C
      g.font = '700 40px Outfit'
      g.textAlign = 'left'
      g.textBaseline = 'alphabetic'
      g.fillText(E.factory.screen.title, 30, 56)
      // the bands, coloured as the room draws them
      const bands = [['C', 200, 280], ['B', 280, 315], ['A', 315, 400]]
      for (const [k, a, b] of bands) {
        g.fillStyle = new THREE.Color(KIND_C[k]).getStyle()
        g.globalAlpha = 0.22
        g.fillRect(X(a), yTop, X(b) - X(a), yBot - yTop)
        g.globalAlpha = 1
        g.fillStyle = new THREE.Color(KIND_C[k]).getStyle()
        g.font = '700 24px Outfit'
        g.textAlign = 'center'
        g.fillText(E.factory.bands[k], (X(a) + X(b)) / 2, yTop - 10)
      }
      // the visible spectrum as a bar
      const grd = g.createLinearGradient(X(400), 0, X(700), 0)
      for (let nm = 400; nm <= 700; nm += 20) grd.addColorStop((nm - 400) / 300, nmColor(nm).getStyle())
      g.fillStyle = grd
      g.globalAlpha = 0.28
      g.fillRect(X(400), yTop, X(700) - X(400), yBot - yTop)
      g.globalAlpha = 1
      g.fillStyle = '#ffe9a8'
      g.font = '700 24px Outfit'
      g.fillText(E.factory.bands.V, (X(400) + X(700)) / 2, yTop - 10)
      // the share that gets through
      g.strokeStyle = '#ffffff'
      g.lineWidth = 5
      g.beginPath()
      for (let nm = 200; nm <= 700; nm += 2) {
        const p = [X(nm), Y(through(nm))]
        nm === 200 ? g.moveTo(...p) : g.lineTo(...p)
      }
      g.stroke()
      g.strokeStyle = 'rgba(190,205,255,0.6)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(x0, yTop)
      g.lineTo(x0, yBot)
      g.lineTo(x1, yBot)
      g.stroke()
      g.fillStyle = '#b8c4ff'
      g.font = '500 22px Outfit'
      g.textAlign = 'center'
      for (const nm of [200, 300, 400, 500, 600, 700]) g.fillText(String(nm), X(nm), yBot + 28)
      g.textAlign = 'right'
      g.fillText(E.factory.screen.x, x1, yBot + 56)
      g.save()
      g.translate(34, (yTop + yBot) / 2)
      g.rotate(-Math.PI / 2)
      g.textAlign = 'center'
      g.fillText(E.factory.screen.y, 0, 0)
      g.restore()
      // the lamp's wavelength
      if (Fs.lam) {
        const T = through(Fs.lam)
        g.strokeStyle = nmColor(Fs.lam).getStyle()
        g.lineWidth = 6
        g.beginPath()
        g.moveTo(X(Fs.lam), yTop)
        g.lineTo(X(Fs.lam), yBot)
        g.stroke()
        g.fillStyle = '#ffffff'
        g.beginPath()
        g.arc(X(Fs.lam), Y(T), 11, 0, TAU)
        g.fill()
        g.font = '700 30px Outfit'
        g.textAlign = 'left'
        g.fillStyle = '#ffffff'
        g.fillText(`${Math.round(Fs.lam)} nm  ${E.factory.bands[bandOf(Fs.lam)]}: ${lv === 'scientist' ? pctText(T) : E.factory.reach[reachOf(T)]}`, 30, h - 22)
      } else {
        g.font = '500 26px Outfit'
        g.textAlign = 'left'
        g.fillStyle = '#b8c4ff'
        g.fillText(E.factory.screen.hint, 30, h - 22)
      }
    })
  }
  const tmpV = new THREE.Vector3()
  updates.push((dt, t) => {
    chemF.update(dt)
    // photons fall, home in on a molecule, or come down to the beads and the snow
    camLocal(fac, tmpV)
    for (let i = photons.length - 1; i >= 0; i--) {
      const p = photons[i]
      const stale = p.g !== genF
      let done = stale
      if (!done && p.target && (p.mode !== 'pass' && p.mode !== 'lost')) {
        if (!chemF.has(p.target)) p.mode = 'lost'
        else {
          const d = p.target.c.clone().sub(p.pos)
          const L = d.length()
          if (L < 0.09) {
            hitPhoton(p)
            done = true
          } else p.pos.addScaledVector(d.normalize(), Math.min(L, PHOTON_V * dt))
        }
      }
      if (!done && (p.mode === 'pass' || p.mode === 'lost')) {
        const end = p.kind === 'V' ? 0.03 : BEAD_Y
        p.pos.y -= PHOTON_V * dt
        if (p.pos.z < 0.12) p.pos.z = Math.min(0.12, p.pos.z + dt * 0.2)
        if (p.pos.y <= end) {
          if (p.mode === 'pass') landPhoton(p)
          done = true
        }
      }
      if (done) {
        fac.remove(p.mesh)
        photons.splice(i, 1)
        continue
      }
      p.mesh.position.copy(p.pos)
      p.mesh.rotation.y = Math.atan2(tmpV.x - p.pos.x, tmpV.z - p.pos.z)
    }
    for (const k of ['C', 'B', 'A', 'V']) {
      const m = lenses[k].userData.ring.material
      m.emissiveIntensity = damp(m.emissiveIntensity, 1.1 + 0.25 * Math.sin(t * 2 + LANE[k] * 3), 3, dt)
    }
    // once nothing is moving, the layer holds exactly the ozone the shared count says
    if (!facBusy() && chemF.count('O3') !== Fs.o3) buildLayer()
    heat = Math.max(0, heat - dt * 0.035)
    warmth.material.opacity = heat * 0.5
    thermoCol.scale.y = 0.2 + 0.8 * heat
    layerSign.set({ line: `O2 ${chemF.count('O2')}   O3 ${chemF.count('O3')}` })
    // the beam
    const on = !!Fs.lam
    const T = on ? through(Fs.lam) : 0
    const c = on ? nmColor(Fs.lam) : new THREE.Color('#ffffff')
    beamParts.forEach((m, i) => {
      m.visible = on
      beamMats[i].color.copy(c).multiplyScalar(1.6)
    })
    beamMats[0].opacity = damp(beamMats[0].opacity, on ? 0.75 : 0, 6, dt)
    beamMats[1].opacity = damp(beamMats[1].opacity, on ? 0.75 * (0.35 + 0.65 * T) : 0, 6, dt)
    beamMats[2].opacity = damp(beamMats[2].opacity, on ? 0.75 * T : 0, 6, dt)
    beamSpot.material.color.copy(c).multiplyScalar(1.4)
    beamSpot.material.opacity = beamMats[2].opacity
    // the beads: white in the shade, coloured where UV reaches them, fading back
    const uv = on ? T * beadAnswer(Fs.lam) : 0
    beadMats.forEach((b, i) => {
      b.dose = Math.max(0, b.dose - dt / 16)
      const inBeam = uv * Math.exp(-((beadX[i] / 0.34) ** 2))
      const k = Math.max(b.dose, inBeam)
      b.shown = damp(b.shown ?? 0, k, 3, dt)
      b.mat.color.set('#f4f2ee').lerp(b.col, b.shown)
      b.mat.emissive.copy(b.col).multiplyScalar(0.45 * b.shown)
    })
    drawWave()
  })

  // =====================================================================================
  // 2. Measuring the ozone: the Dobson hut, the column squeezed, the months, the balloon
  // =====================================================================================
  const hut = new THREE.Group()
  hut.position.set(HUT.x, 0, HUT.z)
  faceTo(hut, MSPOT.x, MSPOT.z)
  root.add(hut)
  const HW = 5.6
  const HD = 3.0
  const HH = 2.7
  const FRONT = HD / 2
  {
    const planks = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#b5432c'
      g.fillRect(0, 0, w, h)
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'
        g.fillRect(0, (i / 8) * h, w, h / 8)
        g.fillStyle = 'rgba(40,10,5,0.35)'
        g.fillRect(0, (i / 8) * h, w, 2)
      }
    }, { repeat: true })
    textures.push(planks)
    planks.repeat.set(2, 1.4)
    const wallMat = new THREE.MeshStandardMaterial({ map: planks, roughness: 0.75 })
    const body = new THREE.Mesh(new THREE.BoxGeometry(HW, HH, HD), wallMat)
    body.position.y = HH / 2
    hut.add(shadows(body))
    const roof = new THREE.Mesh(new THREE.BoxGeometry(HW + 0.3, 0.16, HD + 0.3), M.white)
    roof.position.y = HH + 0.08
    hut.add(shadows(roof))
    // the roof hatch, open to the sky (a Dobson needs to see the Sun)
    const hatch = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.9), M.white)
    hatch.position.set(-1.2, HH + 0.55, -0.4)
    hatch.rotation.x = -1.1
    hut.add(shadows(hatch))
    const frameH = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 1.0), M.dark)
    frameH.position.set(-1.2, HH + 0.2, 0)
    hut.add(frameH)
    // an aerial and a white trim round the base
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.6, 6).translate(0, 1.3, 0), M.steel)
    mast.position.set(1.9, HH + 0.16, -0.9)
    hut.add(shadows(mast))
    const trim = new THREE.Mesh(new THREE.BoxGeometry(HW + 0.04, 0.22, HD + 0.04), M.white)
    trim.position.y = 0.11
    hut.add(trim)
    // a door on the east end, a window on the west
    const door = new THREE.Mesh(new RoundedBoxGeometry(0.1, 1.95, 0.9, 2, 0.03), M.dark)
    door.position.set(HW / 2 + 0.03, 1.0, 0.3)
    hut.add(door)
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.55), new THREE.MeshStandardMaterial({ color: '#2a3a52', emissive: '#ffcf8a', emissiveIntensity: 0.25, roughness: 0.2 }))
    win.position.set(-HW / 2 - 0.01, 1.6, 0)
    win.rotation.y = -Math.PI / 2
    hut.add(win)
  }
  const toWorld = (obj, p = V3(0, 0, 0)) => {
    obj.updateWorldMatrix(true, false)
    return obj.localToWorld(p.clone())
  }
  const solidOf = (group, lx, lz, w, d) => {
    const v = new THREE.Vector3(lx, 0, lz).applyAxisAngle(new THREE.Vector3(0, 1, 0), group.rotation.y)
    solids.push(box(group.position.x + v.x, group.position.z + v.z, w, d, { rot: group.rotation.y }))
  }
  solidOf(hut, 0, 0, HW + 0.3, HD + 0.3)
  // the two charts on the front wall
  // the charts sit high and to the right, so the observing table beside them hides none of them
  const monthBoard = board(2.2, 1.42, 1100, MEAS_C)
  monthBoard.group.position.set(-0.95, 1.74, FRONT + 0.06)
  hut.add(monthBoard.group)
  const profBoard = board(1.7, 1.42, 840, MEAS_C)
  profBoard.group.position.set(1.6, 1.74, FRONT + 0.06)
  hut.add(profBoard.group)
  // the observing table: the Dobson, the logbook; beside it the slab table, the column above it
  const TAB = { x: -2.45, z: FRONT + 1.45, y: 0.82 }
  // the slab's stand is tall, so the eye sees the slab from its edge: a thin sheet, not a block
  const SLAB = { x: 0.42, z: FRONT + 1.45, y: 1.12 }
  const table = (x, z, w, d, ty = TAB.y) => {
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    const top = new THREE.Mesh(new RoundedBoxGeometry(w, 0.06, d, 2, 0.02), M.wood)
    top.position.y = ty - 0.03
    g.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, ty - 0.06, 0.06), M.wood)
        leg.position.set(sx * (w / 2 - 0.08), (ty - 0.06) / 2, sz * (d / 2 - 0.08))
        g.add(leg)
      }
    }
    hut.add(shadows(g))
    solidOf(hut, x, z, w + 0.1, d + 0.1)
    return g
  }
  table(TAB.x, TAB.z, 1.35, 0.7)
  table(SLAB.x, SLAB.z, 1.12, 0.6, SLAB.y)
  // the Dobson spectrophotometer: a long box, a sun director on top turned to the Sun, a crank, a dial
  const dobson = new THREE.Group()
  dobson.position.set(TAB.x - 0.22, TAB.y, TAB.z)
  hut.add(dobson)
  {
    const paint = new THREE.MeshStandardMaterial({ color: '#8d9a86', roughness: 0.55, metalness: 0.25 })
    const black = new THREE.MeshStandardMaterial({ color: '#1f2228', roughness: 0.45, metalness: 0.4 })
    const brass = new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.35, metalness: 0.85 })
    const bodyD = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.34, 0.36, 2, 0.03), paint)
    bodyD.position.y = 0.17
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.04, 0.42), black)
    base.position.y = 0.02
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 24).rotateX(Math.PI / 2), brass)
    dial.position.set(0.16, 0.2, 0.19)
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.055, 24), new THREE.MeshStandardMaterial({ color: '#f2ead2', roughness: 0.6 }))
    face.position.set(0.16, 0.2, 0.202)
    const crank = new THREE.Group()
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.02), brass)
    arm.position.y = -0.05
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 8).rotateZ(Math.PI / 2), black)
    knob.position.set(0.03, -0.1, 0)
    crank.add(arm, knob)
    crank.position.set(0.34, 0.2, 0.05)
    // the sun director: a tube on a turntable, its prism head turned to the Sun
    const director = new THREE.Group()
    director.position.set(-0.18, 0.34, 0)
    const turn = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.04, 20), black)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 14).translate(0, 0.15, 0), black)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), black)
    head.position.y = 0.32
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), new THREE.MeshStandardMaterial({ color: '#7fb8ff', emissive: '#3a6aa8', emissiveIntensity: 0.6, roughness: 0.1 }))
    director.add(turn, tube, head)
    // the window looks along the head's own +z, which the director points at the Sun below
    glass.position.set(0, 0.32, 0.056)
    director.add(glass)
    dobson.add(bodyD, base, dial, face, crank, director)
    // point it at the Sun (in the hut's frame)
    const sunL = stage.sunDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -hut.rotation.y)
    director.rotation.y = Math.atan2(sunL.x, sunL.z)
    head.rotation.x = -Math.asin(sunL.y)
    glass.rotation.x = -Math.asin(sunL.y)
    dobson.userData.crank = crank
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.5), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.35
    dobson.add(hit)
  }
  // the names on the table's front edge (floating over the charts they hid them)
  const dobsonName = label(E.measure.signs.dobson, 0.06, '#ffffff', { maxWidth: 0.8 })
  dobsonName.position.set(TAB.x - 0.24, TAB.y - 0.13, TAB.z + 0.37)
  hut.add(dobsonName)
  // the logbook of decades
  const logbook = new THREE.Group()
  logbook.position.set(TAB.x + 0.42, TAB.y, TAB.z + 0.02)
  logbook.rotation.y = -0.25
  hut.add(logbook)
  const logCover = makeText('', { size: 0.055, color: '#ffe9a8', anchorY: 'middle' })
  {
    const cover = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.06, 0.38, 2, 0.012), new THREE.MeshStandardMaterial({ color: '#244a8a', roughness: 0.7 }))
    cover.position.y = 0.03
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.045, 0.36), new THREE.MeshStandardMaterial({ color: '#efe6cf', roughness: 0.9 }))
    pages.position.set(0.01, 0.03, 0)
    logCover.rotation.x = -Math.PI / 2
    logCover.position.set(0, 0.062, 0)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.25, 0.48), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.1
    logbook.add(cover, pages, logCover, hit)
  }
  const logName = label(E.measure.signs.log, 0.06)
  logName.position.set(TAB.x + 0.42, TAB.y - 0.13, TAB.z + 0.37)
  hut.add(logName)
  // the slab of all the ozone above, squeezed (10 times bigger), and a 1 euro coin at the same scale
  const slabMat = new THREE.MeshStandardMaterial({ color: '#9b8cff', emissive: '#6a5ad8', emissiveIntensity: 0.55, roughness: 0.3, transparent: true, opacity: 0.92 })
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1, 0.42).translate(0, 0.5, 0), slabMat)
  slab.position.set(SLAB.x - 0.17, SLAB.y, SLAB.z)
  slab.visible = false
  hut.add(slab)
  const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.72, 1, 0.42).translate(0, 0.5, 0)), new THREE.LineBasicMaterial({ color: '#d8d0ff', transparent: true, opacity: 0.8 }))
  ghost.position.copy(slab.position)
  ghost.visible = false
  hut.add(ghost)
  const slabText = label('', 0.09, '#ffffff')
  slabText.position.set(SLAB.x - 0.17, SLAB.y + 0.2, SLAB.z)
  hut.add(slabText)
  const coin = new THREE.Group()
  coin.position.set(SLAB.x + 0.36, SLAB.y, SLAB.z + 0.02)
  hut.add(coin)
  {
    // a 1 euro coin: 23.25 mm across, 2.33 mm thick; a white ring round a yellow middle (here 10 times bigger)
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.11625, 0.11625, 0.0233, 40).translate(0, 0.01165, 0), new THREE.MeshStandardMaterial({ color: '#c9ccd2', roughness: 0.3, metalness: 0.9 }))
    const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.0825, 0.0825, 0.0236, 40).translate(0, 0.0118, 0), new THREE.MeshStandardMaterial({ color: '#d8b04a', roughness: 0.3, metalness: 0.9 }))
    const one = makeText('1', { size: 0.09, color: '#7a5a1a' })
    one.rotation.x = -Math.PI / 2
    one.position.y = 0.0246
    coin.add(ring, mid, one)
  }
  const coinText = label(E.measure.signs.coin, 0.05, '#ffffff', { maxWidth: 0.62 })
  coinText.position.set(SLAB.x + 0.3, SLAB.y - 0.13, SLAB.z + 0.32)
  hut.add(coinText)
  const scaleText = label(E.measure.signs.scale, 0.05, '#d2dbff', { maxWidth: 0.55 })
  scaleText.position.set(SLAB.x - 0.25, SLAB.y - 0.13, SLAB.z + 0.32)
  hut.add(scaleText)
  // the column of ozone standing over the slab table, up into the sky (1 km to the metre, its glow
  // following the profile), squeezed down into the slab
  const COL_H = 36
  const colMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uCol: { value: new THREE.Color('#9b8cff') }, uK: { value: 1 } },
    vertexShader: /* glsl */ `
      varying float vKm;
      void main() { vKm = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uCol; uniform float uK;
      varying float vKm;
      void main() {
        float s = vKm < 18.0 ? (vKm - 18.0) / 6.0 : (vKm - 18.0) / 8.5;
        float a = 0.07 + 0.55 * exp(-s * s);
        gl_FragColor = vec4(uCol * (1.0 + 0.6 * exp(-s * s)), a * uK);
      }`,
  })
  const column = new THREE.Mesh(new THREE.BoxGeometry(0.72, COL_H, 0.42).translate(0, COL_H / 2, 0), colMat)
  column.position.copy(slab.position)
  column.raycast = () => {}
  column.renderOrder = 2
  hut.add(column)
  // the ozonesonde: a balloon on its stand to the right of the hut, a white box hanging under it
  const BAL = { x: 3.95, z: 0.7 }
  const balloon = new THREE.Group()
  balloon.position.set(BAL.x, 0, BAL.z)
  hut.add(balloon)
  const rig = new THREE.Group()
  balloon.add(rig)
  {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.65, 0.06, 24), M.dark)
    pad.position.y = 0.03
    balloon.add(pad)
    const skin = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 20).scale(1, 1.15, 1), new THREE.MeshStandardMaterial({ color: '#f3f5f9', roughness: 0.35, transparent: true, opacity: 0.93 }))
    skin.position.y = 3.0
    const neck = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 12).rotateX(Math.PI), skin.material)
    neck.position.y = 2.25
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.0, 4), M.dark)
    cord.position.y = 1.62
    const chute = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 6, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#ff7a2a', roughness: 0.6 }))
    chute.position.y = 1.45
    const sonde = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.24, 0.16, 2, 0.02), M.white)
    sonde.position.y = 1.0
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.202, 0.04, 0.162), new THREE.MeshStandardMaterial({ color: '#2f5f9e', roughness: 0.6 }))
    stripe.position.y = 1.02
    const tether = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.9, 4), M.dark)
    tether.position.set(0, 0.45, 0)
    rig.add(skin, neck, cord, chute, sonde, stripe)
    balloon.add(tether)
    balloon.userData.tether = tether
    rig.userData.skin = skin
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3.8, 10).translate(0, 2.0, 0), new THREE.MeshBasicMaterial({ visible: false }))
    balloon.add(hit)
    shadows(rig)
  }
  const balName = label(E.measure.signs.balloon, 0.09)
  balName.position.set(BAL.x, 4.25, BAL.z)
  hut.add(balName)
  solidOf(hut, BAL.x, BAL.z, 1.2, 1.2)

  // ---- the measuring's steps ----
  // shared: the month (0 August .. 8 April), the decade, whether the column is squeezed (and how many times),
  // the balloons sent and how long ago the last one left
  const FLIGHT_T = 9
  const Ms = { month: OCTOBER, era: 'e60', squeezed: false, sqN: 0, eraN: 0, flights: 0, start: -99 }
  let sq = 0
  let flown = false
  let measMine = false
  const flightAge = () => now() - Ms.start
  const flying = () => flightAge() < FLIGHT_T + 1.2
  const duNow = () => DECADES[Ms.era][Ms.month]
  const erasFor = lv => (lv === 'scientist' ? ERAS : ['e60', 'e90'])
  const mmText = du => `${num(du / 100, 1, lang)} mm`
  const measPanel = lv => ({
    title: E.measure.title,
    color: MEAS_C,
    blocks: [
      { slider: { label: E.measure.slider, min: 0, max: 8, step: 1, value: Ms.month, format: v => E.months[Math.round(v)], live: () => Ms.month, onInput: v => setMonth(v) } },
      {
        buttons: [
          { label: Ms.squeezed ? E.measure.verbs.back : E.measure.verbs.dobson, onClick: () => measStep('dobson') },
          { label: E.measure.verbs.log, onClick: () => measStep('log') },
          { label: E.measure.verbs.balloon, onClick: () => measStep('balloon') },
        ],
      },
      {
        rows: [
          [E.measure.rows.month, E.months[Ms.month]],
          [E.measure.rows.era, E.eras[Ms.era]],
          [E.measure.rows.ozone, `${duNow()} DU`],
          [E.measure.rows.thick, mmText(duNow())],
        ],
      },
      ...ps(E.measure.panel, lv),
    ],
  })
  const measFound = () => ex.discover('measure', measPanel, 4)
  function measStep(step) {
    const lv = level()
    measMine = true
    if (step === 'dobson') {
      Ms.squeezed = !Ms.squeezed
      if (Ms.squeezed) Ms.sqN++
      play(Ms.squeezed ? 'part' : 'join')
      say(fill(at(E.measure.says[Ms.squeezed ? 'squeeze' : 'back'], lv), { du: duNow(), mm: num(duNow() / 100, 1, lang) }), MEAS_C)
    } else if (step === 'log') {
      const list = erasFor(lv)
      const i = list.indexOf(Ms.era)
      Ms.era = list[(i + 1) % list.length]
      Ms.eraN++
      play('select')
      say(at(E.measure.says[Ms.era], lv), MEAS_C)
    } else if (step === 'chart') {
      setMonth((Ms.month + 1) % 9, true)
      play('tap')
      return
    } else if (step === 'balloon') {
      if (flying()) return say(at(W.busy, lv))
      Ms.flights++
      Ms.start = now()
      launched = false
      play('beam')
      say(at(E.measure.says.launch, lv), MEAS_C)
    } else return
    share('measure')
    measFound()
    refreshPanel(measPanel)
  }
  let monthSend = null
  let lastSaidMonth = -1
  function setMonth(v, nowShare = false) {
    Ms.month = clamp(Math.round(Number(v) || 0), 0, 8)
    measMine = true
    measFound()
    refreshPanel(measPanel)
    // the spring months tell their story once
    if ((Ms.month === 1 || Ms.month === 2) && lastSaidMonth !== Ms.month) {
      lastSaidMonth = Ms.month
      say(at(E.measure.says.spring, level()), MEAS_C)
    }
    if (nowShare) {
      share('measure')
      return
    }
    if (!monthSend) {
      monthSend = setTimeout(() => {
        monthSend = null
        share('measure')
      }, 250)
    }
  }
  disposers.push(() => clearTimeout(monthSend))
  ex.add({
    id: 'measure',
    manual: true,
    x: MSPOT.x,
    z: MSPOT.z,
    radius: 2.4,
    label: E.measure.label,
    verb: () => {
      const H = E.measure.hints
      if (!Ms.sqN) return H.dobson
      if (!Ms.flights) return H.balloon
      if (!Ms.eraN) return H.log
      return H.more
    },
    screens: [monthBoard.edge, profBoard.edge],
    focus: (() => {
      const p = toWorld(hut, V3(-0.2, 0, FRONT + 0.8))
      return { x: p.x, y: 1.6, z: p.z, size: 5.3, width: 7.2 }
    })(),
    act: () => ctx.showPanel(measPanel),
  })
  clickable(dobson, () => measStep('dobson'), { reach: 6 })
  clickable(logbook, () => measStep('log'), { reach: 6 })
  clickable(monthBoard.group, () => measStep('chart'), { reach: 7 })
  clickable(balloon, () => measStep('balloon'), { reach: 7 })
  clickable(coin, () => say(at(E.measure.says.coin, level()), MEAS_C), { reach: 6 })

  // the month chart: each decade's line, the chosen month
  let monthDrawn = null
  function drawMonths() {
    const lv = level()
    const key = `${Ms.month}|${Ms.era}|${lv}`
    if (key === monthDrawn) return
    monthDrawn = key
    const eras = lv === 'scientist' ? ERAS : ['e60', 'e90']
    const eraCol = { e60: '#e9edf7', e70: '#9fd8ff', e80: '#c9a0ff', e90: '#ff7ad1' }
    monthBoard.draw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const x0 = 150
      const x1 = w - 60
      const y0 = h - 110
      const y1 = 150
      const X = i => x0 + (i / 8) * (x1 - x0)
      const Y = du => y0 - ((du - 100) / 300) * (y0 - y1)
      g.fillStyle = MEAS_C
      g.font = '700 50px Outfit'
      g.textAlign = 'left'
      g.textBaseline = 'alphabetic'
      g.fillText(E.measure.chart.month, 40, 70)
      g.font = '500 28px Outfit'
      g.fillStyle = '#b8c4ff'
      g.fillText(E.measure.chart.night, 40, 112)
      g.strokeStyle = 'rgba(150,170,255,0.18)'
      g.lineWidth = 2
      g.textBaseline = 'middle'
      for (let du = 100; du <= 400; du += 50) {
        g.beginPath()
        g.moveTo(x0, Y(du))
        g.lineTo(x1, Y(du))
        g.stroke()
        if (lv === 'scientist' || du % 100 === 0) {
          g.fillStyle = '#b8c4ff'
          g.font = '600 28px Outfit'
          g.textAlign = 'right'
          g.fillText(String(du), x0 - 14, Y(du))
        }
      }
      g.save()
      g.translate(40, (y0 + y1) / 2 + 20)
      g.rotate(-Math.PI / 2)
      g.textAlign = 'center'
      g.fillStyle = '#b8c4ff'
      g.font = '600 26px Outfit'
      g.fillText(lv === 'scientist' ? E.measure.chart.du : E.measure.chart.ozone, 0, 0)
      g.restore()
      g.textBaseline = 'alphabetic'
      for (let i = 0; i < 9; i++) {
        g.fillStyle = i === Ms.month ? '#ffffff' : '#b8c4ff'
        g.font = `${i === Ms.month ? 700 : 500} 28px Outfit`
        g.textAlign = 'center'
        g.fillText(E.monthsShort[i], X(i), y0 + 44)
      }
      // the 3 mm line: 300 DU
      g.setLineDash([10, 10])
      g.strokeStyle = 'rgba(255,233,168,0.6)'
      g.beginPath()
      g.moveTo(x0, Y(300))
      g.lineTo(x1, Y(300))
      g.stroke()
      g.setLineDash([])
      // the chosen month
      g.fillStyle = 'rgba(127,208,255,0.16)'
      g.fillRect(X(Ms.month) - 30, y1 - 20, 60, y0 - y1 + 20)
      // each decade's year
      const order = [...eras.filter(e => e !== Ms.era), Ms.era]
      for (const e of order) {
        const vals = DECADES[e]
        const me = e === Ms.era
        g.strokeStyle = eraCol[e]
        g.globalAlpha = me ? 1 : 0.45
        g.lineWidth = me ? 8 : 4
        g.beginPath()
        vals.forEach((v, i) => (i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v))))
        g.stroke()
        g.fillStyle = eraCol[e]
        g.font = '700 28px Outfit'
        g.textAlign = 'left'
        g.fillText(E.eras[e], X(8) - 110, Y(vals[8]) - (e === 'e60' ? -36 : e === 'e70' ? -8 : e === 'e80' ? 20 : 48))
        g.globalAlpha = 1
      }
      const du = DECADES[Ms.era][Ms.month]
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.arc(X(Ms.month), Y(du), 13, 0, TAU)
      g.fill()
      g.font = '700 34px Outfit'
      g.textAlign = Ms.month > 5 ? 'right' : 'left'
      const tx = X(Ms.month) + (Ms.month > 5 ? -26 : 26)
      g.fillText(`${du} DU = ${mmText(du)}`, tx, Y(du) - 26)
    })
  }
  // the profile chart: ozone against height, drawn as the balloon rises
  let profDrawn = null
  let profKm = 0
  function drawProfile(km) {
    const lv = level()
    const key = `${Ms.month}|${Ms.era}|${lv}|${Math.round(km * 4)}|${flown}`
    if (key === profDrawn) return
    profDrawn = key
    const du = DECADES[Ms.era][Ms.month]
    const base = DECADES.e60[Ms.month]
    const f = profileFor(du, base)
    const f0 = profileFor(base, base)
    profBoard.draw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const x0 = 120
      const x1 = w - 40
      const y0 = h - 90
      const y1 = 130
      const X = mpa => x0 + (mpa / 25) * (x1 - x0)
      const Y = z => y0 - (z / 35) * (y0 - y1)
      g.fillStyle = MEAS_C
      g.font = '700 46px Outfit'
      g.textAlign = 'left'
      g.textBaseline = 'alphabetic'
      g.fillText(E.measure.chart.profile, 30, 64)
      g.font = '500 26px Outfit'
      g.fillStyle = '#b8c4ff'
      g.fillText(`${E.months[Ms.month]}, ${E.eras[Ms.era]}`, 30, 102)
      g.strokeStyle = 'rgba(150,170,255,0.18)'
      g.lineWidth = 2
      g.textBaseline = 'middle'
      for (let z = 0; z <= 35; z += 5) {
        g.beginPath()
        g.moveTo(x0, Y(z))
        g.lineTo(x1, Y(z))
        g.stroke()
        g.fillStyle = '#b8c4ff'
        g.font = '600 26px Outfit'
        g.textAlign = 'right'
        g.fillText(`${z}`, x0 - 12, Y(z))
      }
      g.textAlign = 'left'
      g.fillText(E.measure.chart.km, 18, Y(35) - 36)
      g.textBaseline = 'alphabetic'
      g.textAlign = 'center'
      if (lv === 'scientist') {
        for (const m of [0, 5, 10, 15, 20, 25]) g.fillText(String(m), X(m), y0 + 34)
        g.fillText(`${E.measure.chart.ozone} (mPa)`, (x0 + x1) / 2, y0 + 70)
      } else g.fillText(E.measure.chart.ozone, (x0 + x1) / 2, y0 + 44)
      // the ozone layer's band
      g.fillStyle = 'rgba(155,140,255,0.12)'
      g.fillRect(x0, Y(28), x1 - x0, Y(10) - Y(28))
      g.fillStyle = '#c9c0ff'
      g.font = '600 24px Outfit'
      g.textAlign = 'right'
      g.fillText(E.measure.chart.layer, x1 - 8, Y(28) + 30)
      if (!flown && km <= 0) {
        g.fillStyle = '#b8c4ff'
        g.font = '500 28px Outfit'
        g.textAlign = 'center'
        g.fillText(E.measure.chart.wait, (x0 + x1) / 2, (y0 + y1) / 2 + 60)
        return
      }
      // before the hole (dashed), then this month's, up to the balloon's height
      if (du < base - 4) {
        g.setLineDash([12, 10])
        g.strokeStyle = 'rgba(233,237,247,0.7)'
        g.lineWidth = 4
        g.beginPath()
        for (let z = 0; z <= km; z += 0.25) (z ? g.lineTo(X(f0(z)), Y(z)) : g.moveTo(X(f0(z)), Y(z)))
        g.stroke()
        g.setLineDash([])
        g.fillStyle = 'rgba(233,237,247,0.85)'
        g.font = '600 24px Outfit'
        g.textAlign = 'left'
        if (km > 22) g.fillText(E.measure.chart.before, X(f0(22)) + 14, Y(22))
      }
      g.strokeStyle = '#ff7ad1'
      g.lineWidth = 7
      g.beginPath()
      for (let z = 0; z <= km; z += 0.25) (z ? g.lineTo(X(f(z)), Y(z)) : g.moveTo(X(f(z)), Y(z)))
      g.stroke()
      // the balloon's height
      if (km < 35) {
        g.fillStyle = '#ffffff'
        g.beginPath()
        g.arc(X(f(km)), Y(km), 11, 0, TAU)
        g.fill()
        g.font = '700 28px Outfit'
        g.textAlign = 'left'
        g.fillText(`${Math.round(km)} km`, X(f(km)) + 18, Y(km) - 14)
      }
    })
  }
  let launched = false
  let refill = 1
  const sunCrank = dobson.userData.crank
  updates.push((dt, t) => {
    // the column squeezed into the slab, or standing up again
    sq = damp(sq, Ms.squeezed ? 1 : 0, 1.6, dt)
    if (Math.abs(sq - (Ms.squeezed ? 1 : 0)) < 0.002) sq = Ms.squeezed ? 1 : 0
    const du = duNow()
    // the slab and the coin are shown 10 times bigger: 300 DU = 3 mm real = 3 cm here
    const thick = du / 10000
    const k = ease(sq)
    column.scale.y = Math.max(thick / COL_H, 1 - k * (1 - thick / COL_H))
    column.visible = sq < 0.985
    colMat.uniforms.uK.value = 1 + k * 0.8
    slab.visible = sq > 0.9
    slab.scale.y = thick
    slabMat.opacity = 0.92 * clamp((sq - 0.9) * 10)
    const base = DECADES.e60[Ms.month] / 10000
    ghost.visible = slab.visible && Math.abs(base - thick) > 0.002
    ghost.scale.y = base
    slabText.visible = slab.visible
    slabText.position.y = SLAB.y + Math.max(thick, ghost.visible ? base : 0) + 0.1
    syncText(slabText, sci() ? `${du} DU = ${mmText(du)}` : mmText(du))
    syncText(logCover, E.eras[Ms.era])
    // the observer winds the crank while the column comes down
    if (sq > 0.01 && sq < 0.99) sunCrank.rotation.x += dt * 6
    // the balloon: rising, then a new one filling on the stand
    const a = flightAge()
    if (a < FLIGHT_T) {
      if (!launched) launched = true
      const y = 2.6 * a + 2.0 * a * a
      rig.position.y = y
      rig.visible = true
      balloon.userData.tether.visible = false
      profKm = (a / FLIGHT_T) * 35
      rig.userData.skin.scale.setScalar(1 + a * 0.06)
    } else {
      if (launched && a >= FLIGHT_T) {
        launched = false
        flown = true
        profKm = 35
        play('pop')
        if (measMine) {
          const hole = DECADES[Ms.era][Ms.month] < DECADES.e60[Ms.month] - 30
          say(at(E.measure.says[hole ? 'burstHole' : 'burst'], level()), MEAS_C)
        }
        refill = 0
      }
      refill = Math.min(1, refill + dt / 2.2)
      rig.position.y = 0
      rig.visible = refill > 0.05
      rig.scale.setScalar(Math.max(0.05, ease(refill)))
      rig.userData.skin.scale.setScalar(1)
      balloon.userData.tether.visible = refill > 0.9
      if (flown) profKm = 35
    }
    rig.rotation.y = Math.sin(t * 0.7) * 0.15
    drawMonths()
    drawProfile(a < FLIGHT_T ? profKm : flown ? 35 : 0)
  })

  // =====================================================================================
  // 3. The fix: CFCs, the polar winter and spring, the treaty, the years
  // =====================================================================================
  const fix = new THREE.Group()
  fix.position.set(FIX.x, 0, FIX.z)
  faceTo(fix, XSPOT.x, XSPOT.z)
  root.add(fix)
  const SW = 3.9
  const SD = 2.6
  const SH = 2.5
  const SF = SD / 2
  {
    const planks = canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#c4913a'
      g.fillRect(0, 0, w, h)
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'
        g.fillRect(0, (i / 8) * h, w, h / 8)
        g.fillStyle = 'rgba(60,30,5,0.35)'
        g.fillRect(0, (i / 8) * h, w, 2)
      }
    }, { repeat: true })
    textures.push(planks)
    planks.repeat.set(1.6, 1.3)
    const body = new THREE.Mesh(new THREE.BoxGeometry(SW, SH, SD), new THREE.MeshStandardMaterial({ map: planks, roughness: 0.75 }))
    body.position.y = SH / 2
    fix.add(shadows(body))
    const roof = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.3, 0.16, SD + 0.3), M.white)
    roof.position.y = SH + 0.08
    fix.add(shadows(roof))
    const trim = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.04, 0.22, SD + 0.04), M.white)
    trim.position.y = 0.11
    fix.add(trim)
  }
  solidOf(fix, 0, 0, SW + 0.3, SD + 0.3)
  // the treaty in a gold frame, and a brass plaque for the Nobel Prize under it
  const treaty = new THREE.Group()
  treaty.position.set(-1.12, 1.5, SF + 0.04)
  fix.add(treaty)
  const treatyGlow = new THREE.MeshStandardMaterial({ color: '#d8b04a', emissive: '#ffcf5a', emissiveIntensity: 0.25, roughness: 0.35, metalness: 0.7 })
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(0.92, 1.12, 0.06, 2, 0.02), treatyGlow)
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.0), new THREE.MeshStandardMaterial({ color: '#f1e6c8', roughness: 0.9 }))
    paper.position.z = 0.032
    treaty.add(frame, paper)
    const t1 = makeText(E.fix.signs.treaty, { size: 0.075, color: '#3a2a12', maxWidth: 0.72, anchorY: 'top' })
    t1.position.set(0, 0.44, 0.04)
    const t2 = makeText('1987', { size: 0.13, color: '#7a2a12', anchorY: 'middle' })
    t2.position.set(0, 0.08, 0.04)
    const t3 = makeText(E.fix.signs.treatyAll, { font: 'body', size: 0.05, color: '#3a2a12', maxWidth: 0.7, anchorY: 'top' })
    t3.position.set(0, -0.08, 0.04)
    treaty.add(t1, t2, t3)
    // rows of signatures
    const ink = new THREE.MeshBasicMaterial({ color: '#4a3a6a' })
    const rnd = random(1987)
    for (let i = 0; i < 18; i++) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.1 + rnd() * 0.08, 0.008), ink)
      s.position.set(-0.27 + (i % 3) * 0.27, -0.3 - Math.floor(i / 3) * 0.035, 0.035)
      s.rotation.z = (rnd() - 0.5) * 0.3
      treaty.add(s)
    }
  }
  const plaque = new THREE.Group()
  plaque.position.set(-1.12, 0.62, SF + 0.03)
  fix.add(plaque)
  {
    // a dark plaque with gold letters (dark letters on brass did not read from the station)
    const p = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.32, 0.03, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#2a1e14', roughness: 0.5, metalness: 0.3 }))
    const rim = new THREE.Mesh(new RoundedBoxGeometry(0.94, 0.36, 0.02, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#c9a24a', roughness: 0.3, metalness: 0.9 }))
    rim.position.z = -0.01
    plaque.add(rim)
    const a = makeText(E.fix.signs.nobel, { size: 0.05, color: '#ffd98a', maxWidth: 0.84 })
    a.position.set(0, 0.065, 0.02)
    const b = makeText('Crutzen · Molina · Rowland', { size: 0.05, color: '#ffd98a', maxWidth: 0.84 })
    b.position.set(0, -0.05, 0.02)
    plaque.add(p, a, b)
  }
  // the years chart beside the treaty
  const yearBoard = board(1.95, 1.3, 1000, FIX_C)
  yearBoard.group.position.set(0.82, 1.5, SF + 0.06)
  fix.add(yearBoard.group)
  // the old fridge and the spray can on a crate
  // at the hut's left end, clear of the treaty and the plaque
  const FR = { x: -2.6, z: SF + 0.7 }
  const fridge = new THREE.Group()
  fridge.position.set(FR.x, 0, FR.z)
  fix.add(fridge)
  {
    const cream = new THREE.MeshStandardMaterial({ color: '#d9cfae', roughness: 0.45 })
    const chrome = new THREE.MeshStandardMaterial({ color: '#d0d6de', roughness: 0.15, metalness: 0.95 })
    const bodyF = new THREE.Mesh(new RoundedBoxGeometry(0.72, 1.45, 0.64, 4, 0.08), cream)
    bodyF.position.y = 0.8
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.08, 0.58), M.dark)
    foot.position.y = 0.04
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.012, 0.01), M.dark)
    seam.position.set(0, 1.12, 0.322)
    const handle = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.3, 0.05, 2, 0.02), chrome)
    handle.position.set(0.26, 0.92, 0.35)
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.01), chrome)
    badge.position.set(0, 1.3, 0.326)
    fridge.add(bodyF, foot, seam, handle, badge)
    shadows(fridge)
  }
  solidOf(fix, FR.x, FR.z, 0.8, 0.75)
  const CAN = { x: -1.8, z: SF + 1.15 }
  const can = new THREE.Group()
  can.position.set(CAN.x, 0, CAN.z)
  fix.add(can)
  {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), M.wood)
    crate.position.y = 0.25
    const red = new THREE.MeshStandardMaterial({ color: '#c8322a', roughness: 0.35, metalness: 0.5 })
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.24, 20), red)
    body.position.y = 0.62
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.0705, 0.0705, 0.06, 20), M.white)
    band.position.y = 0.62
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 8, 0, TAU, 0, Math.PI / 2), M.steel)
    shoulder.position.y = 0.74
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), M.white)
    cap.position.y = 0.82
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.66
    can.add(crate, body, band, shoulder, cap, hit)
    shadows(can)
  }
  solidOf(fix, CAN.x, CAN.z, 0.6, 0.6)
  const canName = label(E.fix.signs.can, 0.07)
  canName.position.set(CAN.x, 1.0, CAN.z)
  const fridgeName = label(E.fix.signs.fridge, 0.07)
  fridgeName.position.set(FR.x, 1.68, FR.z)
  fix.add(canName, fridgeName)
  // after the treaty: a green "no CFC" on both
  const noCfc = [[FR.x, 1.05, FR.z + 0.34], [CAN.x, 0.35, CAN.z + 0.26]].map(([x, y, z]) => {
    const t = label(E.fix.signs.nocfc, 0.075, '#7ee08a')
    t.position.set(x, y, z)
    t.visible = false
    fix.add(t)
    return t
  })
  // the globe on its pedestal, the south pole turned to the visitor
  const GL = { x: 2.6, z: SF + 0.85, y: 1.55, r: 0.45 }
  const globe = new THREE.Group()
  globe.position.set(GL.x, GL.y, GL.z)
  fix.add(globe)
  const ozoneU = { uK: { value: 0 }, uCol: { value: new THREE.Color('#9b8cff') } }
  {
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.2, GL.y - GL.r - 0.05, 16).translate(0, (GL.y - GL.r - 0.05) / 2, 0), M.dark)
    ped.position.set(GL.x, 0, GL.z)
    fix.add(shadows(ped))
    solidOf(fix, GL.x, GL.z, 0.6, 0.6)
    const tilt = new THREE.Group()
    // the south pole turned to the visitor, a little up
    tilt.rotation.x = Math.atan2(-0.98, -0.18)
    globe.add(tilt)
    const spin = new THREE.Group()
    tilt.add(spin)
    globe.userData.spin = spin
    const earthTex = canvasTex(1024, 512, (g, w, h) => {
      const sea = g.createLinearGradient(0, 0, 0, h)
      sea.addColorStop(0, '#1d4f9a')
      sea.addColorStop(0.5, '#2a6fc4')
      sea.addColorStop(1, '#1d4f9a')
      g.fillStyle = sea
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#4f9a52'
      for (const ring of LAND) {
        g.beginPath()
        let lon = ring[0]
        let lat = ring[1]
        g.moveTo(((lon / 5 + 180) / 360) * w, ((90 - lat / 5) / 180) * h)
        for (let i = 2; i < ring.length; i += 2) {
          lon += ring[i]
          lat += ring[i + 1]
          g.lineTo(((lon / 5 + 180) / 360) * w, ((90 - lat / 5) / 180) * h)
        }
        g.closePath()
        g.fill('evenodd')
      }
      // the ice: Antarctica and the Arctic's land white
      const img = g.getImageData(0, 0, w, h)
      for (let y = 0; y < h; y++) {
        const lat = 90 - ((y + 0.5) / h) * 180
        if (lat > -60 && lat < 72) continue
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4
          if (img.data[i + 1] > img.data[i + 2]) {
            img.data[i] = 226
            img.data[i + 1] = 234
            img.data[i + 2] = 244
          }
        }
      }
      g.putImageData(img, 0, 0)
    })
    textures.push(earthTex)
    const earth = new THREE.Mesh(new THREE.SphereGeometry(GL.r, 48, 32), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.7 }))
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(GL.r * 1.08, 48, 32),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: ozoneU,
        vertexShader: /* glsl */ `
          varying vec2 vUv; varying vec3 vN; varying vec3 vV;
          void main() {
            vUv = uv;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uK; uniform vec3 uCol;
          varying vec2 vUv; varying vec3 vN; varying vec3 vV;
          void main() {
            float lat = (vUv.y - 0.5) * 180.0;
            float edge = -90.0 + 32.0 * sqrt(max(uK, 0.0));
            float inHole = smoothstep(edge + 3.0, edge - 7.0, lat) * uK;
            float collar = exp(-pow((lat - (edge + 7.0)) / 5.0, 2.0)) * uK;
            float facing = clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0);
            float rim = pow(clamp(1.0 - facing, 0.0, 1.0), 2.0);
            vec3 c = mix(uCol * (1.0 + 0.5 * collar), vec3(0.05, 0.03, 0.16), inHole);
            float a = mix(0.3 + 0.12 * collar, 0.5, inHole) + rim * 0.35;
            gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
          }`,
      }),
    )
    shell.raycast = () => {}
    spin.add(earth, shell)
  }
  // the window 20 km up over Antarctica: a sky that is dark in winter and bright in spring, an icy cloud,
  // ozone, a little Sun; posts hold it over the fridge and the can
  const DIO = { x: -0.6, y: 3.95, z: SF + 0.55, w: 2.9, h: 1.55 }
  const dio = new THREE.Group()
  fix.add(dio)
  const dioSky = new THREE.MeshStandardMaterial({ color: '#0d1233', emissive: '#1c2a6a', emissiveIntensity: 0.5, roughness: 0.6 })
  const dioEdge = edgeOf(FIX_C)
  {
    const back = new THREE.Mesh(new RoundedBoxGeometry(DIO.w, DIO.h, 0.06, 2, 0.04), dioSky)
    back.position.set(DIO.x, DIO.y, DIO.z - 0.35)
    const frame = new THREE.Mesh(new RoundedBoxGeometry(DIO.w + 0.12, DIO.h + 0.12, 0.04, 2, 0.04), dioEdge.mat)
    frame.position.set(DIO.x, DIO.y, DIO.z - 0.38)
    dio.add(back, frame)
    for (const sx of [-1, 1]) {
      // held up from the roof, so no post crosses the wall's chart
      const len = DIO.y - DIO.h / 2 + 0.1 - (SH + 0.16)
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, len, 8).translate(0, len / 2, 0), M.steel)
      post.position.set(DIO.x + sx * (DIO.w / 2 - 0.25), SH + 0.16, SF + 0.1)
      dio.add(shadows(post))
    }
    const title = label(E.fix.signs.diorama, 0.085)
    title.position.set(DIO.x, DIO.y + DIO.h / 2 + 0.16, DIO.z - 0.3)
    dio.add(title)
  }
  // the icy cloud: soft lenses of mother-of-pearl colour
  const cloud = new THREE.Group()
  cloud.position.set(DIO.x - 0.55, DIO.y - 0.25, DIO.z - 0.15)
  dio.add(cloud)
  const pearlTex = canvasTex(256, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    const grd = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,0.95)')
    grd.addColorStop(0.35, 'rgba(255,190,230,0.75)')
    grd.addColorStop(0.55, 'rgba(150,230,255,0.6)')
    grd.addColorStop(0.75, 'rgba(190,255,190,0.35)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  textures.push(pearlTex)
  const pearlMat = new THREE.SpriteMaterial({ map: pearlTex, transparent: true, opacity: 0.55, depthWrite: false })
  for (const [x, y, s] of [[-0.3, 0.02, 0.9], [0.2, 0.08, 0.8], [0.0, -0.08, 1.0], [0.45, -0.04, 0.6], [-0.55, -0.06, 0.6]]) {
    const sp = new THREE.Sprite(pearlMat)
    sp.position.set(x, y, 0)
    sp.scale.set(s, s * 0.45, 1)
    cloud.add(sp)
  }
  const cloudHit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.3), new THREE.MeshBasicMaterial({ visible: false }))
  cloud.add(cloudHit)
  const cloudName = label(E.fix.signs.cloud, 0.07)
  cloudName.position.set(0, -0.36, 0.05)
  cloud.add(cloudName)
  // ice crystals sparkling in winter
  const ice = new THREE.Points(
    (() => {
      const g = new THREE.BufferGeometry()
      const rnd = random(195)
      const p = []
      for (let i = 0; i < 70; i++) p.push((rnd() - 0.5) * 1.5, (rnd() - 0.5) * 0.45, (rnd() - 0.5) * 0.25)
      g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
      return g
    })(),
    new THREE.PointsMaterial({ color: '#eaf6ff', size: 0.035, map: glow, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  ice.raycast = () => {}
  cloud.add(ice)
  // the little Sun at the window's right end
  const dioSun = new THREE.Group()
  dioSun.position.set(DIO.x + DIO.w / 2 - 0.3, DIO.y + 0.35, DIO.z - 0.2)
  dio.add(dioSun)
  const dioSunMat = new THREE.MeshBasicMaterial({ color: hdr('#ffd75a', 0.5) })
  const dioSunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: hdr('#ffc94a', 1.2), transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending }))
  {
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), dioSunMat)
    dioSunGlow.scale.setScalar(0.9)
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
    dioSun.add(core, dioSunGlow, hit)
    const name = label(E.fix.signs.sun, 0.065)
    name.position.set(0, -0.3, 0.05)
    dioSun.add(name)
  }
  const countText = label('', 0.075, '#ffe9a8')
  countText.position.set(DIO.x + 0.75, DIO.y - DIO.h / 2 + 0.16, DIO.z - 0.2)
  dio.add(countText)
  const chemX = chemBox(fix, { lo: V3(DIO.x - 1.2, DIO.y - 0.5, DIO.z - 0.22), hi: V3(DIO.x + 0.95, DIO.y + 0.5, DIO.z + 0.12), light, speed: 0.08, seed: 23, halos: { O3: '#b49bff', Cl: '#7dff8a', ClO: '#7dff8a' }, glow })
  disposers.push(() => chemX.dispose())
  // the CFC's way up: faint dots from the fridge and the can into the window, "it takes years" beside
  const pathFrom = { fridge: V3(FR.x, 1.6, FR.z), can: V3(CAN.x, 0.9, CAN.z) }
  const pathOf = src => new THREE.CatmullRomCurve3([pathFrom[src], pathFrom[src].clone().add(V3(0.15, 0.7, -0.1)), V3(DIO.x - 0.2, DIO.y - 1.05, DIO.z + 0.05), V3(DIO.x - 0.4, DIO.y - 0.35, DIO.z - 0.05)])
  const pathDots = {}
  for (const src of ['fridge', 'can']) {
    const pts = pathOf(src).getSpacedPoints(26)
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    const dots = new THREE.Points(g, new THREE.PointsMaterial({ color: '#c6ee72', size: 0.05, map: glow, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending }))
    dots.raycast = () => {}
    fix.add(dots)
    pathDots[src] = dots
  }
  const yearsText = label(E.fix.signs.years, 0.065, '#c6ee72')
  yearsText.position.set(-0.55, 2.55, SF + 0.75)
  yearsText.visible = false
  fix.add(yearsText)

  // ---- the fix's steps ----
  // shared: the stage (0 clean, 1 a CFC rising, 2 its chlorine locked up, 3 winter: set loose as Cl2,
  // 4 spring: breaking ozone, 5 caught again), when it began, where the CFC came from, the treaty, the year
  const RISE_T = 6
  const Xs = { stage: 0, start: -99, src: 'can', treaty: false, year: 1975, yearMoved: false, rounds: 0 }
  let genX = 0
  let broken = 0
  let chainDone = false
  let fixMine = false
  let rising = null
  const stageAge = () => now() - Xs.start
  /** The stage as it stands now (a CFC still climbing after its time has arrived; a chain run its course). */
  const effStage = () => (Xs.stage === 1 && stageAge() >= RISE_T ? 2 : Xs.stage === 4 && chainDone ? 5 : Xs.stage)
  const fixSay = (key, mine = true, vars = {}) => mine && say(fill(at(E.fix.says[key], level()), vars), FIX_C)
  /** The window as it stands at a stage, at once (a newcomer, a saved state coming back). */
  function setDiorama(s) {
    genX++
    chemX.clear()
    rising = null
    broken = s >= 5 ? 10 : 0
    chainDone = s >= 5
    if (s <= 3) for (let i = 0; i < 10; i++) chemX.make('O3')
    else for (let i = 0; i < 15; i++) chemX.make('O2')
    if (s === 2) for (let i = 0; i < 2; i++) chemX.make('HCl')
    if (s === 3) chemX.make('Cl2')
    if (s >= 5) for (let i = 0; i < 2; i++) chemX.make('HCl')
  }
  setDiorama(0)
  function release(src, live = true, age = 0) {
    const g0 = genX
    const m = chemX.make('CFC', pathFrom[src].clone())
    m.pin = true
    rising = { m, curve: pathOf(src), src, t0: now() - age, g: g0 }
    if (live) play('fizz')
  }
  function arrive(mine) {
    const r = rising
    rising = null
    if (!r || !chemX.has(r.m)) return
    const m = r.m
    m.pin = false
    flash(fix, m.c, '#d8c6ff', 0.6, 0.6)
    play('part')
    // sunlight high up breaks the CFC: CF2 drifts off, the two Cl are caught as HCl
    const [c, cl1, cl2, f1, f2] = m.atoms
    m.kind = 'CF2'
    m.atoms = [c, f1, f2]
    m.v.set(0.25, 0.08, 0)
    const g0 = genX
    later(2.2, () => g0 === genX && chemX.has(m) && chemX.kill(m))
    for (const cl of [cl1, cl2]) {
      const h = chemX.atom('H', m.c)
      chemX.mol('HCl', [cl, h], m.c)
    }
    fixSay('arrive', mine)
  }
  function winter(live, mine) {
    const g0 = genX
    const hcl = chemX.mols.filter(m => m.kind === 'HCl')
    if (!live || hcl.length < 2) {
      setDiorama(3)
      return
    }
    const meet = cloud.getWorldPosition(new THREE.Vector3())
    fix.worldToLocal(meet)
    let arrived = 0
    for (const m of hcl.slice(0, 2)) {
      m.seek = {
        target: meet,
        speed: 0.5,
        near: 0.12,
        done: () => {
          if (g0 !== genX) return
          m.pin = true
          if (++arrived < 2) return
          // HCl + ClONO2 on the ice -> Cl2 (the H goes with the nitric acid): two Cl into Cl2
          const [a, b] = hcl
          chemX.drop(a.atoms[1])
          chemX.drop(b.atoms[1])
          chemX.remove(b)
          a.kind = 'Cl2'
          a.atoms = [a.atoms[0], b.atoms[0]]
          a.pin = false
          flash(fix, a.c, '#eaf6ff', 0.6, 0.6)
          play('join')
        },
      }
    }
    if (mine) fixSay('cloud')
  }
  function spring(live, mine) {
    const g0 = genX
    let cl2 = chemX.mols.find(m => m.kind === 'Cl2')
    if (!live || !cl2) {
      if (!live) setDiorama(5)
      else {
        setDiorama(3)
        cl2 = chemX.mols.find(m => m.kind === 'Cl2')
      }
      if (!live) return
    }
    broken = 0
    chainDone = false
    // Cl2 + light -> 2 Cl
    flash(fix, cl2.c, '#ffe08a', 0.8, 0.7)
    play('part')
    const [a, b] = cl2.atoms
    cl2.kind = 'Cl'
    cl2.atoms = [a]
    const other = chemX.mol('Cl', [b], cl2.c)
    chemX.apart(cl2, other, 0.4)
    const pair = [cl2, other]
    later(0.6, () => g0 === genX && cycle(pair, g0, mine))
    if (mine) fixSay('spring')
  }
  /** One turn of the ClO dimer cycle: each Cl takes an O from an O3 (leaving O2), the two ClO meet, light
   *  splits the pair back into two Cl and an O2. When the ozone runs out, the chlorine is caught. */
  function cycle(pair, g0, mine) {
    if (g0 !== genX) return
    const targets = []
    for (const cl of pair) {
      const t = chemX.nearest('O3', cl.c)
      if (t) {
        t.held = true
        targets.push(t)
      }
    }
    if (targets.length < 2) {
      targets.forEach(t => (t.held = false))
      return endChain(pair, g0, mine)
    }
    let made = 0
    pair.forEach((cl, i) => {
      const t = targets[i]
      cl.seek = {
        target: t,
        speed: 1.1,
        near: 0.16,
        done: () => {
          if (g0 !== genX) return
          t.held = false
          // Cl + O3 -> ClO + O2
          const [c, e1, e2] = t.atoms
          t.kind = 'O2'
          t.atoms = [e1, e2]
          cl.kind = 'ClO'
          cl.atoms = [cl.atoms[0], c]
          chemX.apart(cl, t, 0.35)
          broken++
          flash(fix, t.c, '#ff7a5a', 0.35, 0.4)
          play('crack')
          if (++made < 2) return
          // the two ClO meet: Cl2O2, then light splits it into 2 Cl + O2
          const [p, q] = pair
          later(0.35, () => {
            if (g0 !== genX) return
            p.seek = {
              target: q,
              speed: 1.0,
              near: 0.2,
              done: () => {
                if (g0 !== genX) return
                p.kind = 'Cl2O2'
                p.atoms = [p.atoms[0], q.atoms[0], p.atoms[1], q.atoms[1]]
                chemX.remove(q)
                p.pin = true
                later(0.45, () => {
                  if (g0 !== genX || !chemX.has(p)) return
                  flash(fix, p.c, '#ffe08a', 0.55, 0.5)
                  const [c1, c2, o1, o2] = p.atoms
                  p.kind = 'Cl'
                  p.atoms = [c1]
                  p.pin = false
                  const q2 = chemX.mol('Cl', [c2], p.c)
                  const o = chemX.mol('O2', [o1, o2], p.c)
                  chemX.apart(p, q2, 0.4)
                  o.v.set(0, 0.15, 0)
                  later(0.4, () => cycle([p, q2], g0, mine))
                })
              },
            }
          })
        },
      }
    })
  }
  let raceT = -1
  let pearls = 0
  function endChain(pair, g0, mine) {
    // the count races on toward 100,000 (the chain in the real stratosphere), then each Cl is caught as HCl
    raceT = 0
    later(2.8, () => {
      if (g0 !== genX) return
      for (const cl of pair) {
        if (!chemX.has(cl)) continue
        const h = chemX.atom('H', cl.c.clone().add(V3(0.3, 0.2, 0)))
        cl.kind = 'HCl'
        cl.atoms = [cl.atoms[0], h]
      }
      chainDone = true
      raceT = -1
      play('join')
      if (mine) {
        fixSay('caught')
        share('fix')
      }
      refreshPanel(fixPanel)
    })
  }
  const yearRows = lv => {
    const y = Math.round(Xs.year)
    const du = Math.round(octOzone(y))
    const rows = [
      [E.fix.rows.year, String(y)],
      [E.fix.rows.ozone, `${du} DU${y > OCT_LAST ? ` (${E.fix.chart.expected})` : ''}`],
    ]
    if (lv === 'scientist') rows.push([E.fix.rows.chlorine, `${num(eesc(y) / 1000, 2, lang)} ppb${y > EESC_LAST ? ` (${E.fix.chart.expected})` : ''}`])
    return rows
  }
  const fixPanel = lv => ({
    title: E.fix.title,
    color: FIX_C,
    blocks: [
      { slider: { label: E.fix.slider, min: YEAR0, max: YEAR1, step: 1, value: Math.round(Xs.year), format: v => String(Math.round(v)), live: () => Math.round(Xs.year), onInput: v => setYear(v) } },
      { buttons: ['can', 'fridge', 'cloud', 'sun'].map(k => ({ label: E.fix.verbs[k], onClick: () => fixStep(k) })) },
      { buttons: ['treaty', 'again'].map(k => ({ label: E.fix.verbs[k], onClick: () => fixStep(k) })) },
      { rows: yearRows(lv) },
      ...ps(E.fix.panel, lv),
    ],
  })
  const fixFound = () => ex.discover('fix', fixPanel, 5)
  function fixStep(step) {
    const lv = level()
    const s = effStage()
    fixMine = true
    if (step === 'can' || step === 'fridge') {
      if (Xs.treaty) return fixSay('canAfter')
      if (s >= 1 && s <= 4) return say(at(s === 1 ? W.busy : E.fix.says.oneAtATime, lv), FIX_C)
      Xs.rounds++
      // a new year: the ozone came back over the summer, but the chlorine is still up there
      if (s >= 5) {
        setDiorama(0)
        fixSay('again')
      }
      Xs.stage = 1
      Xs.start = now()
      Xs.src = step
      release(step, true, 0)
      if (s < 5) fixSay('cfc')
    } else if (step === 'cloud') {
      if (s < 2) return fixSay('nocfc')
      if (s !== 2) return fixSay(s === 3 ? 'cloudDone' : 'cloudLate')
      Xs.stage = 3
      Xs.start = now()
      winter(true, true)
    } else if (step === 'sun') {
      if (s < 3) return fixSay(s === 2 ? 'sunFirst' : 'nocfc')
      if (s >= 4) return say(at(s === 4 ? W.busy : E.fix.says.sunLate, lv), FIX_C)
      Xs.stage = 4
      Xs.start = now()
      spring(true, true)
    } else if (step === 'treaty') {
      const first = !Xs.treaty
      Xs.treaty = true
      play(first ? 'celebrate' : 'select')
      fixSay('treaty')
    } else if (step === 'again') {
      Xs.stage = 0
      Xs.start = now()
      setDiorama(0)
      play('select')
    } else if (step === 'globe') {
      return fixSay('globe')
    } else return
    share('fix')
    fixFound()
    refreshPanel(fixPanel)
  }
  let yearSend = null
  let saidFuture = false
  let saidEnd = false
  function setYear(v, nowShare = false) {
    const before = Xs.year
    Xs.year = clamp(Math.round(Number(v) || YEAR0), YEAR0, YEAR1)
    Xs.yearMoved = true
    fixMine = true
    fixFound()
    refreshPanel(fixPanel)
    if (Xs.year >= RECOVERED && before < RECOVERED && !saidFuture) {
      saidFuture = true
      fixSay('future')
      if (!saidEnd) {
        saidEnd = true
        later(9, () => fixSay('end'))
      }
    }
    if (nowShare) {
      share('fix')
      return
    }
    if (!yearSend) {
      yearSend = setTimeout(() => {
        yearSend = null
        share('fix')
      }, 250)
    }
  }
  disposers.push(() => clearTimeout(yearSend))
  ex.add({
    id: 'fix',
    manual: true,
    x: XSPOT.x,
    z: XSPOT.z,
    radius: 2.4,
    label: E.fix.label,
    verb: () => {
      const H = E.fix.hints
      const s = effStage()
      if (s === 0) return H.cfc
      if (s === 1) return H.wait
      if (s === 2) return H.cloud
      if (s === 3) return H.sun
      if (s === 4) return H.watch
      if (!Xs.treaty) return H.treaty
      if (!Xs.yearMoved) return H.years
      return H.end
    },
    screens: [yearBoard.edge, dioEdge],
    focus: (() => {
      const p = toWorld(fix, V3(-0.15, 0, SF + 0.7))
      return { x: p.x, y: 2.5, z: p.z, size: 5.4, width: 6.2 }
    })(),
    act: () => ctx.showPanel(fixPanel),
  })
  clickable(can, () => fixStep('can'), { reach: 6 })
  clickable(fridge, () => fixStep('fridge'), { reach: 6 })
  clickable(cloud, () => fixStep('cloud'), { reach: 7 })
  clickable(dioSun, () => fixStep('sun'), { reach: 7 })
  clickable(treaty, () => fixStep('treaty'), { reach: 7 })
  clickable(plaque, () => fixSay('nobel'), { reach: 7 })
  clickable(globe, () => fixStep('globe'), { reach: 6 })
  clickable(yearBoard.group, () => ctx.showPanel(fixPanel), { reach: 7 })

  // the years chart: Halley's October ozone and the chlorine up high, measured then expected
  let yearDrawn = null
  function drawYears() {
    const lv = level()
    const key = `${Math.round(Xs.year)}|${lv}`
    if (key === yearDrawn) return
    yearDrawn = key
    yearBoard.draw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const x0 = 110
      const x1 = w - (lv === 'scientist' ? 110 : 40)
      const y0 = h - 90
      const y1 = 130
      const X = y => x0 + ((y - YEAR0) / (YEAR1 - YEAR0)) * (x1 - x0)
      const Yo = du => y0 - ((du - 100) / 250) * (y0 - y1)
      const Yc = ppt => y0 - ((ppt - 1000) / 3500) * (y0 - y1)
      g.fillStyle = FIX_C
      g.font = '700 46px Outfit'
      g.textAlign = 'left'
      g.textBaseline = 'alphabetic'
      g.fillText(E.fix.chart.title, 30, 60)
      g.font = '600 26px Outfit'
      g.fillStyle = '#c9b6ff'
      g.fillText(E.fix.chart.ozone, 30, 100)
      g.fillStyle = '#7ee08a'
      g.textAlign = 'right'
      g.fillText(E.fix.chart.chlorine, w - 30, 100)
      g.strokeStyle = 'rgba(150,170,255,0.16)'
      g.lineWidth = 2
      g.font = '500 22px Outfit'
      for (let y = 1960; y <= 2080; y += 20) {
        g.beginPath()
        g.moveTo(X(y), y1)
        g.lineTo(X(y), y0)
        g.stroke()
        g.fillStyle = '#b8c4ff'
        g.textAlign = 'center'
        g.fillText(String(y), X(y), y0 + 30)
      }
      g.textBaseline = 'middle'
      for (let du = 100; du <= 350; du += 50) {
        g.fillStyle = '#c9b6ff'
        g.textAlign = 'right'
        if (lv === 'scientist' || du % 100 === 0) g.fillText(String(du), x0 - 10, Yo(du))
      }
      if (lv === 'scientist') {
        for (let c = 1000; c <= 4500; c += 1000) {
          g.fillStyle = '#7ee08a'
          g.textAlign = 'left'
          g.fillText(num(c / 1000, 0, lang), x1 + 10, Yc(c))
        }
        g.fillText('ppb', x1 + 10, Yc(4500) - 26)
        g.fillStyle = '#c9b6ff'
        g.textAlign = 'right'
        g.fillText('DU', x0 - 10, Yo(350) - 26)
      }
      g.textBaseline = 'alphabetic'
      // the events
      const mark = (y, text, row) => {
        g.strokeStyle = 'rgba(255,233,168,0.55)'
        g.setLineDash([6, 8])
        g.beginPath()
        g.moveTo(X(y), y1)
        g.lineTo(X(y), y0)
        g.stroke()
        g.setLineDash([])
        g.fillStyle = '#ffe9a8'
        g.font = '600 22px Outfit'
        g.textAlign = 'center'
        g.fillText(text, X(y), y1 - 8 - row * 26)
      }
      mark(1985, E.fix.chart.found, 1)
      mark(1987, E.fix.chart.treaty, 0)
      mark(RECOVERED, E.fix.chart.back, 0)
      // the 1980 level
      g.setLineDash([4, 8])
      g.strokeStyle = 'rgba(201,182,255,0.5)'
      g.beginPath()
      g.moveTo(x0, Yo(OCT_1980))
      g.lineTo(x1, Yo(OCT_1980))
      g.stroke()
      g.setLineDash([])
      const line = (fn, from, to, col, dash, width) => {
        g.strokeStyle = col
        g.lineWidth = width
        g.setLineDash(dash)
        g.beginPath()
        for (let y = from; y <= to; y += 0.5) (y === from ? g.moveTo(X(y), fn(y)) : g.lineTo(X(y), fn(y)))
        g.stroke()
        g.setLineDash([])
      }
      line(y => Yc(eesc(y)), YEAR0, EESC_LAST, '#7ee08a', [], 5)
      line(y => Yc(eesc(y)), EESC_LAST, YEAR1, '#7ee08a', [10, 9], 4)
      line(y => Yo(octOzone(y)), YEAR0, OCT_LAST, '#c9b6ff', [], 5)
      line(y => Yo(octOzone(y)), OCT_LAST, YEAR1, '#c9b6ff', [10, 9], 4)
      // the year on the slider
      const y = Math.round(Xs.year)
      g.strokeStyle = '#ffffff'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(X(y), y1)
      g.lineTo(X(y), y0)
      g.stroke()
      g.fillStyle = '#ffffff'
      for (const p of [Yo(octOzone(y)), Yc(eesc(y))]) {
        g.beginPath()
        g.arc(X(y), p, 9, 0, TAU)
        g.fill()
      }
      g.font = '700 30px Outfit'
      g.textAlign = y > 2040 ? 'right' : 'left'
      g.fillText(`${y}: ${Math.round(octOzone(y))} DU`, X(y) + (y > 2040 ? -16 : 16), Yo(octOzone(y)) + 40)
    })
  }
  updates.push((dt, t) => {
    chemX.update(dt)
    // the CFC on its way up
    if (rising) {
      if (rising.g !== genX || !chemX.has(rising.m)) rising = null
      else {
        const u = clamp((now() - rising.t0) / RISE_T)
        rising.m.c.copy(rising.curve.getPointAt(ease(u)))
        if (u >= 1) arrive(fixMine)
      }
    }
    const s = effStage()
    for (const src of ['fridge', 'can']) pathDots[src].material.opacity = damp(pathDots[src].material.opacity, rising && rising.src === src ? 0.85 : 0, 3, dt)
    yearsText.visible = !!rising
    // winter darkens the window and lights the cloud; spring brightens it and wakes the little Sun
    const win = s === 3 ? 1 : 0
    const spr = s >= 4 ? 1 : 0
    dioSky.emissive.lerp(new THREE.Color(spr ? '#4f7fd0' : win ? '#070b24' : '#1c2a6a'), 1 - Math.exp(-2 * dt))
    dioSky.emissiveIntensity = damp(dioSky.emissiveIntensity, spr ? 0.9 : 0.5, 2, dt)
    pearlMat.opacity = damp(pearlMat.opacity, win ? 0.95 : s >= 4 ? 0.25 : 0.5, 2, dt)
    ice.material.opacity = damp(ice.material.opacity, win ? 0.9 : 0, 2, dt)
    ice.rotation.y += dt * 0.2
    dioSunMat.color.copy(hdr('#ffd75a', spr ? 1.8 : 0.45))
    dioSunGlow.material.opacity = damp(dioSunGlow.material.opacity, spr ? 0.9 : 0.15, 2, dt)
    pearls = damp(pearls, win, 1.5, dt)
    stage.setNacreous(pearls)
    // the count of ozone broken, racing on at the end
    if (raceT >= 0) raceT += dt
    const shown = raceT >= 0 ? Math.round(lerp(broken, 100000, ease(clamp(raceT / 2.4)))) : s >= 5 ? 100000 : broken
    countText.visible = s >= 4
    syncText(countText, `${E.fix.signs.count}: ${shown >= 100000 ? (sci() ? `> ${E.fix.signs.max}` : `${E.fix.signs.max}!`) : shown}`)
    noCfc.forEach(n => (n.visible = Xs.treaty))
    treatyGlow.emissiveIntensity = damp(treatyGlow.emissiveIntensity, Xs.treaty ? 0.9 + 0.25 * Math.sin(t * 2) : 0.25, 3, dt)
    // the globe's hole follows the year
    const k = clamp((240 - octOzone(Xs.year)) / 110)
    ozoneU.uK.value = damp(ozoneU.uK.value, k, 4, dt)
    globe.userData.spin.rotation.y += dt * 0.12
    drawYears()
  })

  // =====================================================================================
  // The room's own bits: the frame back, the easel, the Atomling's place
  // =====================================================================================
  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.6 },
    cameraPitchMax: 0.45,
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
      factory: {
        tap: thing => facStep(thing), // 'C' | 'B' | 'A' | 'V' (the filters), 'sun', 'beads', 'screen'
        wave: v => setLam(v, true),
        at: thing => toWorld(thing === 'sun' ? sunLamp : thing === 'beads' ? beads : thing === 'screen' ? waveBoard.group : lenses[thing]),
        get state() {
          return { ...Fs, n: { ...Fs.n }, o2: chemF.count('O2'), o3now: chemF.count('O3'), photons: photons.length, heat }
        },
      },
      measure: {
        tap: thing => measStep(thing), // 'dobson', 'log', 'chart' (next month), 'balloon'
        month: v => setMonth(v, true),
        at: thing => toWorld({ dobson, log: logbook, chart: monthBoard.group, balloon: rig, coin }[thing] ?? dobson, thing === 'balloon' ? V3(0, 2.4, 0) : V3(0, 0.15, 0)),
        get state() {
          return { ...Ms, sq, flying: flying(), km: profKm }
        },
      },
      fix: {
        tap: thing => fixStep(thing), // 'can', 'fridge', 'cloud', 'sun', 'treaty', 'again', 'globe'
        year: v => setYear(v, true),
        at: thing => toWorld({ can, fridge, cloud, sun: dioSun, treaty, globe, chart: yearBoard.group }[thing] ?? can, thing === 'can' ? V3(0, 0.62, 0) : thing === 'fridge' ? V3(0, 0.9, 0.3) : V3(0, 0, 0)),
        get state() {
          return { ...Xs, eff: effStage(), broken, o3: chemX.count('O3'), rising: !!rising }
        },
      },
    },
    panels: { factory: facPanel, measure: measPanel, fix: fixPanel },
    shared: {
      factory: {
        get: () => ({ o3: Fs.o3, n: ['C', 'B', 'A', 'V', 'S'].map(k => Fs.n[k]), lam: Fs.lam }),
        set: (s, live) => {
          const n = Array.isArray(s?.n) ? s.n : []
          const want = Object.fromEntries(['C', 'B', 'A', 'V', 'S'].map((k, i) => [k, Math.max(0, Math.round(Number(n[i]) || 0))]))
          if (live) {
            // what someone just sent plays here too, decided the same way it was there
            for (const k of ['S', 'C', 'B', 'A', 'V']) {
              let extra = Math.min(3, want[k] - Fs.n[k])
              while (extra-- > 0) {
                Fs.n[k]++
                if (k === 'S') {
                  const bMode = decide('B', false)
                  const cMode = decide('C')
                  sendPhoton('V', 'pass', false, 0)
                  sendPhoton('A', 'pass', false, 0.25)
                  sendPhoton('B', bMode, false, 0.5)
                  sendPhoton('C', cMode, false, 0.75)
                } else sendPhoton(k, decide(k), false)
              }
            }
          }
          Fs.n = want
          const o3 = Math.round(Number(s?.o3))
          Fs.o3 = Number.isFinite(o3) && o3 >= 1 && o3 <= 11 && o3 % 2 === 1 ? o3 : 5
          const lam = Math.round(Number(s?.lam) || 0)
          Fs.lam = lam >= 200 && lam <= 700 ? lam : 0
          if (!live) {
            for (const p of photons) fac.remove(p.mesh)
            photons.length = 0
            buildLayer()
          }
          refreshPanel(facPanel)
        },
      },
      measure: {
        get: () => ({ month: Ms.month, era: Ms.era, squeezed: Ms.squeezed, sqN: Ms.sqN, eraN: Ms.eraN, flights: Ms.flights, age: Math.min(60, Math.round(flightAge() * 10) / 10) }),
        set: (s, live, ago = 0) => {
          Ms.month = clamp(Math.round(Number(s?.month) || 0), 0, 8)
          Ms.era = ERAS.includes(s?.era) ? s.era : 'e60'
          Ms.squeezed = !!s?.squeezed
          if (!live) sq = Ms.squeezed ? 1 : 0
          Ms.sqN = Math.max(0, Math.round(Number(s?.sqN) || 0))
          Ms.eraN = Math.max(0, Math.round(Number(s?.eraN) || 0))
          const flights = Math.max(0, Math.round(Number(s?.flights) || 0))
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          if (flights > Ms.flights || (!live && flights > 0)) {
            // a balloon under way runs on by the time since; one long gone has drawn its whole profile
            Ms.start = now() - age
            if (age >= FLIGHT_T) {
              flown = true
              launched = false
              refill = 1
            } else launched = false
          }
          if (flights === 0) {
            flown = false
            Ms.start = -99
          }
          Ms.flights = flights
          measMine = false
          refreshPanel(measPanel)
        },
      },
      fix: {
        // the stage as it was set (each screen works out the climb's end and the chain's end itself)
        get: () => ({ stage: Xs.stage, age: Math.min(60, Math.round(stageAge() * 10) / 10), src: Xs.src, treaty: Xs.treaty, year: Math.round(Xs.year), moved: Xs.yearMoved, rounds: Xs.rounds }),
        set: (s, live, ago = 0) => {
          const st = clamp(Math.round(Number(s?.stage) || 0), 0, 5)
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          const was = effStage()
          const wasSet = Xs.stage
          Xs.src = s?.src === 'fridge' ? 'fridge' : 'can'
          Xs.treaty = !!s?.treaty
          Xs.year = clamp(Math.round(Number(s?.year) || 1975), YEAR0, YEAR1)
          Xs.yearMoved = !!s?.moved
          Xs.rounds = Math.max(0, Math.round(Number(s?.rounds) || 0))
          fixMine = false
          // a step someone just took plays here; anything else that changed shows as it stands
          if (live && st === 1 && wasSet !== 1 && age < RISE_T) {
            Xs.stage = 1
            Xs.start = now() - age
            if (was >= 5) setDiorama(0)
            release(Xs.src, true, age)
          } else if (live && st === 3 && wasSet !== 3 && was === 2) {
            Xs.stage = 3
            Xs.start = now() - age
            winter(true, false)
          } else if (live && st === 4 && wasSet !== 4 && was === 3) {
            Xs.stage = 4
            Xs.start = now() - age
            spring(true, false)
          } else if (st !== wasSet || !live) {
            // anything else shows as it stands
            Xs.stage = st === 2 ? 2 : st === 5 ? 4 : st
            Xs.start = now() - Math.max(age, st === 2 ? RISE_T : 0)
            setDiorama(st === 1 && age >= RISE_T ? 2 : st === 4 ? 5 : st)
            if (st === 1 && age < RISE_T) release(Xs.src, false, age)
            if (st >= 4) chainDone = true
          }
          refreshPanel(fixPanel)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const f of disposers) f()
      for (const tx of textures) tx.dispose()
      for (const m of Object.values(photonMat)) m.dispose()
    },
  }
}
