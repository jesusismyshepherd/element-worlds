// Hydrogen's picture "Why can an insect walk on water?" as a room (docs/knowledge/picture-rooms.md): a pond
// on a summer evening at a pond skater's size, everything about 200 times bigger than life (stages/pond.js).
// You stand on the water itself; reeds rise like trunks, a lily pad lies like a field, a dragonfly as big as a
// plane goes over. Four things to do, each step chosen by tapping its thing (the user, 2026-10-30: pressing E
// through fixed steps felt passive); the prompt names the next tap, E opens the station's panel, whose
// buttons and sliders do the same:
// - the skin: the picture's pond skater, standing in its six dimples. Tap a leg and a lens shows its dimple
//   cut through: the skin of the water stretched round the hairy foot, the air in its hairs. In front of it a
//   paper clip floats inside a loop of cotton thread; tap the funnel (or the sand slider) and sand trickles
//   onto the clip, its dimple deepens until the skin gives way and it sinks. Tap the soap dropper: a drop
//   inside the loop pulls the thread into a circle (the clean water outside pulls harder than the soapy
//   water inside) and the clip sinks at once. The skater, outside the loop, stands on. Tap the sunken clip
//   to fish it out (fresh water in the loop);
// - every molecule pulled: the picture's close-up as a model to walk round, water molecules about three
//   billion times bigger, their hydrogen bonds dashed. Tap one deep inside: its four bonds light, pulled
//   equally all round; tap one on top: neighbours only beside and below, so it is pulled in, and all the top
//   ones together are the skin. A temperature slider: warmer, the bonds break and re-form faster and the
//   skin weakens (72.0 mN/m at 25 °C, 58.9 at 100 °C, IAPWS). Tap the skater's foot: the top bends, the
//   bonds hold;
// - the tallest drink: a cut-away coast redwood on the lily pad, a thread of water from its roots to its
//   leaves. Tap the sun: the leaves breathe out water and the whole thread moves up one step. Tap the ruler
//   (or a height slider) to grow it: Hyperion, about 116 m, the tallest living tree; past about 122 to 130 m
//   (Koch and colleagues, Nature 2004) the leaves at the top go thirsty and the thread breaks;
// - what if: a lever switches the hydrogen bonds off. On the chart water's boiling point falls from 100 °C
//   to where the trend of H2S, H2Se and H2Te points (about −80 °C); a jar of pond water boils away and the
//   pond steams round you. Switch them back on.
// Not oxygen's bathhouse (the 104.5°, the charges, the bent stream, salt, ice's hexagons), not carbon's DNA
// zipper. All shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill, num, hdr } from '../../../wings/noble/kit.js'
import { pondStage } from '../../stages/pond.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { box, circle } from '../../../../engine/collide.js'
import { BOND_WORDS } from './bond.words.js'

export const WORDS = BOND_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const SKIN_C = '#3fe0d0'
const PULL_C = '#7fc8ff'
const DRINK_C = '#8fe07a'
const WHAT_C = '#ffb36b'
// the game's atom colours (CPK, as chem/ballAndStick.js): oxygen red, hydrogen white
const RED = '#f2302b'
const WHITE = '#f4f6fb'
const DASH = '#3fe0d0'
const AMBER = '#ffc35a'

// where things stand (the frame at +z, the room looking along -z)
const PAD = { x: 8.6, z: -2.4, r: 5.4 }
const STAND1 = { x: -4.6, z: 3.5 }
const LOOP = { x: -4.6, z: 0.3, r: 2.2 }
const SKATER = { x: -4.3, z: -6.7 }
// the skater is drawn 1.3 times bigger than its numbers below (its feet stay in their dimples)
const SK_K = 1.3
const ROD = { x: -8.7, z: 1.4 }
const STAND2 = { x: 2.4, z: -2.4 }
const SLAB = { x: 2.4, z: -6.7 }
const STAND3 = { x: 7.0, z: 1.3 }
const TREE = { x: 9.9, z: -1.2 }
const STAND4 = { x: 7.3, z: -4.3 }
const WHAT = { x: 9.5, z: -6.3 }
const facing = (from, to) => Math.atan2(to.x - from.x, to.z - from.z)

// the water's skin (surface tension, IAPWS 2014: σ = 235.8 mN/m · τ^1.256 · (1 − 0.625 τ), τ = 1 − T/647.096 K)
const sigma = c => {
  const tau = 1 - (c + 273.15) / 647.096
  return 235.8 * Math.pow(tau, 1.256) * (1 - 0.625 * tau)
}
// boiling points at 1 atm (°C): group 16 and group 14 hydrides
const BP16 = [
  { f: 'H2O', p: 2, t: 100 },
  { f: 'H2S', p: 3, t: -60.0 },
  { f: 'H2Se', p: 4, t: -41.3 },
  { f: 'H2Te', p: 5, t: -2.2 },
]
const BP14 = [
  { f: 'CH4', p: 2, t: -161.5 },
  { f: 'SiH4', p: 3, t: -111.9 },
  { f: 'GeH4', p: 4, t: -88.5 },
  { f: 'SnH4', p: 5, t: -52.0 },
]
// the trend of H2Se and H2S carried on to period 2: about −80 °C
const TREND_H2O = BP16[1].t - (BP16[2].t - BP16[1].t)

// the tree: its height on the model (m per real m), the ruler's marks
const TREE_K = 3.8 / 150
const H_MIN = 20
const H_MAX = 150
const H_THIRSTY = 122
const H_BREAK = 130

// ---- small pieces ----

/** Words drawn in 3D, with a dark edge so they read against water and dusk. */
const label = (text, size, color = '#ffffff', opts = {}) => makeText(text, { size, color, outlineWidth: size * 0.14, outlineColor: '#0b1a22', ...opts })
const glowMat = (c, k = 1.3, extra = {}) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: k, roughness: 0.4, ...extra })

/** A cylinder from a to b, radius r1 at a and r2 at b. */
function rod(a, b, r1, r2, mat, seg = 10) {
  const d = b.clone().sub(a)
  const len = d.length()
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, len, seg), mat)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize())
  return m
}

/** A chemical formula on a 2D canvas, digits as subscripts. */
function drawFormula(g, f, x, y, size, align = 'center') {
  const runs = [...f.matchAll(/([A-Za-z]+)|(\d+)/g)].map(m => (m[1] ? { t: m[1], sub: false } : { t: m[2], sub: true }))
  const fontOf = r => `700 ${Math.round(r.sub ? size * 0.66 : size)}px Outfit, sans-serif`
  let w = 0
  for (const r of runs) {
    g.font = fontOf(r)
    w += g.measureText(r.t).width
  }
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x
  const base = g.textAlign
  g.textAlign = 'left'
  for (const r of runs) {
    g.font = fontOf(r)
    g.fillText(r.t, cx, y + (r.sub ? size * 0.28 : 0))
    cx += g.measureText(r.t).width
  }
  g.textAlign = base
}

/** An arrow on a 2D canvas from (x1, y1) to (x2, y2). */
function arrow2d(g, x1, y1, x2, y2, head = 14) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  g.beginPath()
  g.moveTo(x1, y1)
  g.lineTo(x2 - Math.cos(a) * head * 0.6, y2 - Math.sin(a) * head * 0.6)
  g.stroke()
  g.beginPath()
  g.moveTo(x2, y2)
  g.lineTo(x2 - Math.cos(a - 0.45) * head, y2 - Math.sin(a - 0.45) * head)
  g.lineTo(x2 - Math.cos(a + 0.45) * head, y2 - Math.sin(a + 0.45) * head)
  g.closePath()
  g.fill()
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable, lang }) {
  const stage = pondStage({ radius: 13, light, pad: PAD })
  root.add(stage.group)
  const L = stage.level
  const PT = stage.pad.top
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const keep = (...xs) => xs.forEach(x => x && disposers.push(() => x.dispose()))
  // shared ages run on the wall clock (frame times summed drift: picture-rooms.md)
  const now = () => performance.now() / 1000
  const lv = () => level()
  const sci = () => lv() === 'scientist'
  const paras = list => list.map(p => ({ p }))
  const n1 = v => num(v, 1, lang)
  // a panel already open is written again when what it shows changed
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  /** A find: counted now; its panel opens after `delay` seconds the first time, if the visitor is still at
   *  that station. */
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && !ctx.store.get().panel && ctx.showPanel(panel))
  }
  const hitMat = new THREE.MeshBasicMaterial({ visible: false })
  keep(hitMat)

  const M = {
    steel: new THREE.MeshStandardMaterial({ color: '#c8d2dc', roughness: 0.22, metalness: 0.85, emissive: '#2a3946', emissiveIntensity: 0.35 }),
    glass: new THREE.MeshStandardMaterial({ color: '#e6f6fa', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide, emissive: '#5aa8b0', emissiveIntensity: 0.12 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.55, emissive: '#3a0c08', emissiveIntensity: 0.4 }),
    metal: new THREE.MeshStandardMaterial({ color: '#7d8a96', roughness: 0.35, metalness: 0.8, emissive: '#1a222a', emissiveIntensity: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: '#16343a', roughness: 0.6, emissive: '#0a1e22', emissiveIntensity: 0.5 }),
    sand: new THREE.MeshStandardMaterial({ color: '#e2c896', roughness: 0.95, emissive: '#3a2a10', emissiveIntensity: 0.2, flatShading: true }),
    O: new THREE.MeshStandardMaterial({ color: RED, roughness: 0.32, emissive: RED, emissiveIntensity: 0.22 }),
    H: new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.32, emissive: '#ffffff', emissiveIntensity: 0.12 }),
  }
  keep(...Object.values(M))

  // ======================================================================================================
  // ======== 1. the skin: the pond skater, its dimples, the paper clip in its loop of thread ========
  // ======================================================================================================
  const SK = new THREE.Group()
  SK.position.set(SKATER.x, 0, SKATER.z)
  SK.scale.setScalar(SK_K)
  root.add(SK)
  const skBody = new THREE.MeshStandardMaterial({ color: '#56463a', roughness: 0.42, metalness: 0.08, emissive: '#22180f', emissiveIntensity: 0.55 })
  const skLeg = new THREE.MeshStandardMaterial({ color: '#33291f', roughness: 0.5, emissive: '#1a120c', emissiveIntensity: 0.55 })
  const skStripe = new THREE.MeshStandardMaterial({ color: '#b8a888', roughness: 0.5, emissive: '#3a3020', emissiveIntensity: 0.4 })
  const skEye = new THREE.MeshStandardMaterial({ color: '#6a2e1c', roughness: 0.15, metalness: 0.3, emissive: '#2a0e06', emissiveIntensity: 0.5 })
  const skAir = new THREE.MeshStandardMaterial({ color: '#dff6f6', roughness: 0.15, metalness: 0.4, transparent: true, opacity: 0.14, emissive: '#4aa0a8', emissiveIntensity: 0.3, depthWrite: false })
  keep(skBody, skLeg, skStripe, skEye, skAir)
  {
    const ell = (mat, x, y, z, sx, sy, sz) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), mat)
      m.position.set(x, y, z)
      m.scale.set(sx, sy, sz)
      SK.add(m)
      keep(m.geometry)
      return m
    }
    // nose along +x: a long slender abdomen, the thorax, a small head with big eyes
    ell(skBody, -0.85, 0.8, 0, 1.25, 0.19, 0.25)
    ell(skBody, 0.5, 0.84, 0, 0.78, 0.23, 0.3)
    ell(skStripe, 0.1, 0.99, 0, 1.6, 0.05, 0.07)
    ell(skBody, 1.42, 0.9, 0, 0.22, 0.15, 0.16)
    ell(skEye, 1.5, 0.97, 0.15, 0.1, 0.1, 0.1)
    ell(skEye, 1.5, 0.97, -0.15, 0.1, 0.1, 0.1)
    // the beak tucked under the head, and the antennae
    SK.add(rod(V3(1.55, 0.82, 0), V3(1.25, 0.66, 0), 0.04, 0.015, skLeg))
    for (const s of [-1, 1]) {
      const curve = new THREE.CatmullRomCurve3([V3(1.6, 0.98, 0.06 * s), V3(1.9, 1.25, 0.18 * s), V3(2.2, 1.42, 0.34 * s)])
      const ant = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.022, 6), skLeg)
      SK.add(ant)
      keep(ant.geometry)
    }
  }
  // the legs: the middle ones longest (they row), the hind ones steer, the short front ones catch food
  const LEGS = {
    front: { coxa: [0.95, 0.66, 0.14], knee: [1.35, 1.0, 0.55], ankle: [1.7, 0, 0.9], toe: [2.0, 0, 1.02], r: [0.07, 0.055, 0.04], dim: [0.32, 0.09] },
    middle: { coxa: [0.45, 0.62, 0.2], knee: [0.95, 1.42, 1.55], ankle: [0.7, 0, 2.85], toe: [0.0, 0, 3.15], r: [0.085, 0.065, 0.045], dim: [0.5, 0.22] },
    hind: { coxa: [0.12, 0.62, 0.18], knee: [-0.75, 1.2, 1.15], ankle: [-1.85, 0, 1.85], toe: [-2.6, 0, 1.98], r: [0.08, 0.06, 0.044], dim: [0.46, 0.18] },
  }
  const KINDS = ['front', 'middle', 'hind']
  const legs = []
  for (const kind of KINDS) {
    for (const s of [1, -1]) {
      const d = LEGS[kind]
      const ly = (L - d.dim[1] + d.r[2] * 0.6 * SK_K) / SK_K
      const coxa = V3(d.coxa[0], d.coxa[1], d.coxa[2] * s)
      const pivot = new THREE.Group()
      pivot.position.copy(coxa)
      SK.add(pivot)
      const p = [V3(0, 0, 0), V3(d.knee[0], d.knee[1], d.knee[2] * s), V3(d.ankle[0], ly, d.ankle[2] * s), V3(d.toe[0], ly, d.toe[2] * s)].map((v, i) => (i ? v.sub(coxa) : v))
      const parts = new THREE.Group()
      pivot.add(parts)
      parts.add(rod(p[0], p[1], d.r[0], d.r[0] * 0.8, skLeg))
      parts.add(rod(p[1], p[2], d.r[1], d.r[1] * 0.75, skLeg))
      parts.add(rod(p[2], p[3], d.r[2], d.r[2] * 0.7, skLeg))
      for (const j of [p[1], p[2]]) {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(d.r[1] * 1.15, 10, 8), skLeg)
        ball.position.copy(j)
        parts.add(ball)
      }
      // the foot's hairs hold a silvery sleeve of air
      parts.add(rod(p[2], p[3], d.r[2] * 1.45, d.r[2] * 1.2, skAir, 12))
      // a fatter invisible hit shape along the whole leg, for fingers
      const hit = new THREE.Group()
      hit.add(rod(p[0], p[1], 0.24, 0.24, hitMat, 6), rod(p[1], p[2], 0.24, 0.24, hitMat, 6), rod(p[2], p[3], 0.3, 0.3, hitMat, 6))
      pivot.add(hit)
      parts.traverse(o => o.geometry && keep(o.geometry))
      hit.traverse(o => o.geometry && keep(o.geometry))
      legs.push({ kind, s, d, pivot, ankle: p[2], toe: p[3], hit, i: legs.length })
    }
  }
  // the body's soft shadow on the water
  {
    const sh = canvasTex(128, 64, (g, w, h) => {
      const grd = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2)
      grd.addColorStop(0, 'rgba(2,14,18,0.55)')
      grd.addColorStop(1, 'rgba(2,14,18,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
    })
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.3).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: sh, transparent: true, depthWrite: false }))
    shadow.position.set(-0.3, (L + 0.012) / SK_K, 0.25)
    shadow.renderOrder = 1
    SK.add(shadow)
    keep(sh, shadow.geometry, shadow.material)
  }
  solids.push(box(SKATER.x - 0.4, SKATER.z, 5.4, 1.2, { y0: 0.6, y1: 1.5 }))
  // the dimples under the six feet, following the feet as the skater shifts
  const footA = new THREE.Vector3()
  const footB = new THREE.Vector3()
  const legDimples = () => {
    for (const lg of legs) {
      lg.pivot.localToWorld(footA.copy(lg.ankle))
      lg.pivot.localToWorld(footB.copy(lg.toe))
      stage.dimple(lg.i, footA.x, footA.z, footB.x, footB.z, lg.d.dim[0], lg.d.dim[1])
    }
  }
  const footAt = lg => {
    const a = lg.pivot.localToWorld(lg.ankle.clone())
    const b = lg.pivot.localToWorld(lg.toe.clone())
    return a.add(b).multiplyScalar(0.5)
  }

  // a dashed ring round the foot the lens is about (as the picture rings one)
  const footRing = new THREE.Group()
  {
    const mat = glowMat(SKIN_C, 1.6)
    keep(mat)
    for (let i = 0; i < 18; i++) {
      const seg = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.025, 4, 6, (TAU / 18) * 0.55), mat)
      seg.rotation.x = -Math.PI / 2
      seg.rotation.z = (i / 18) * TAU
      footRing.add(seg)
      keep(seg.geometry)
    }
    footRing.visible = false
    root.add(footRing)
  }

  // ---- the lens: one foot's dimple cut through ----
  const lensTex = canvasTex(640, 640, null, { mipmaps: true })
  keep(lensTex)
  const drawLens = kind => {
    lensTex.userData.redraw((g, w, h) => {
      const Ls = E.skin.lens
      g.clearRect(0, 0, w, h)
      g.save()
      g.beginPath()
      g.arc(w / 2, h / 2, w / 2 - 2, 0, TAU)
      g.clip()
      // the air above, the water below a skin that dips round the foot
      const y0 = h * 0.4
      const c = w * 0.5
      const R = w * 0.15
      const hair = w * 0.06
      const dip = kind === 'middle' ? h * 0.2 : kind === 'hind' ? h * 0.17 : h * 0.11
      const legY = y0 + dip - R * 0.4
      const wrapR = R + hair
      const surf = x => {
        const u = (x - c) / (w * 0.22)
        const yWide = y0 + dip * Math.exp(-u * u) + (dip * 0.25) * Math.exp(-u * u * 4)
        // under the foot the skin follows the hairs' tips round the bottom
        const dx = x - c
        if (Math.abs(dx) < wrapR * 0.92) return Math.max(yWide, legY + Math.sqrt(wrapR * wrapR - dx * dx))
        return yWide
      }
      const air = g.createLinearGradient(0, 0, 0, h)
      air.addColorStop(0, '#0d1a36')
      air.addColorStop(0.5, '#173a56')
      g.fillStyle = air
      g.fillRect(0, 0, w, h)
      const water = g.createLinearGradient(0, y0, 0, h)
      water.addColorStop(0, '#2b8a90')
      water.addColorStop(1, '#0c3a42')
      g.fillStyle = water
      g.beginPath()
      g.moveTo(0, h)
      for (let x = 0; x <= w; x += 4) g.lineTo(x, surf(x))
      g.lineTo(w, h)
      g.closePath()
      g.fill()
      // the cushion of air held in the hairs, silvery
      g.fillStyle = 'rgba(214,246,246,0.55)'
      g.beginPath()
      g.arc(c, legY, wrapR, 0, TAU)
      g.fill()
      // the leg cut through, its hairs pointing out and back
      g.fillStyle = '#3a2c22'
      g.beginPath()
      g.arc(c, legY, R, 0, TAU)
      g.fill()
      g.strokeStyle = '#2a2018'
      g.lineWidth = 3
      for (let i = 0; i < 34; i++) {
        const a = (i / 34) * TAU
        g.beginPath()
        g.moveTo(c + Math.cos(a) * R * 0.95, legY + Math.sin(a) * R * 0.95)
        g.lineTo(c + Math.cos(a + 0.25) * (R + hair * 0.95), legY + Math.sin(a + 0.25) * (R + hair * 0.95))
        g.stroke()
      }
      g.fillStyle = 'rgba(255,255,255,0.18)'
      g.beginPath()
      g.arc(c - R * 0.35, legY - R * 0.35, R * 0.35, 0, TAU)
      g.fill()
      // the skin: a bright line, pulling up and out on both sides
      g.strokeStyle = '#d4fff6'
      g.lineWidth = 5
      g.beginPath()
      for (let x = 0; x <= w; x += 4) (x ? g.lineTo : g.moveTo).call(g, x, surf(x))
      g.stroke()
      g.strokeStyle = '#ffffff'
      g.fillStyle = '#ffffff'
      g.lineWidth = 5
      for (const s of [-1, 1]) {
        const x1 = c + s * (wrapR + w * 0.03)
        const x2 = c + s * (wrapR + w * 0.17)
        arrow2d(g, x1, surf(x1) - 4, x2, surf(x2) - 18, 20)
      }
      // the weight, pressing down
      g.strokeStyle = AMBER
      g.fillStyle = AMBER
      arrow2d(g, c, legY - R * 0.3, c, legY + R * 0.75, 18)
      // words
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      const word = (t, x, y, size, col = '#ffffff') => {
        g.font = `700 ${size}px Outfit, sans-serif`
        g.lineWidth = size * 0.22
        g.strokeStyle = 'rgba(6,18,26,0.9)'
        g.strokeText(t, x, y)
        g.fillStyle = col
        g.fillText(t, x, y)
      }
      word(Ls.air, c, h * 0.09, 40, '#cfe6ff')
      word(Ls.water, c, h * 0.88, 40, '#bff6ec')
      word(Ls.pull, c, h * 0.17, 34, '#ffffff')
      word(Ls.hairs, c + R * 1.75, legY + R * 1.75, 32, '#e8dcc8')
      word(Ls.weight, c - R * 1.85, legY + R * 1.3, 32, AMBER)
      g.restore()
    })
  }
  const lens = new THREE.Group()
  {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.0, 64), new THREE.MeshBasicMaterial({ map: lensTex, toneMapped: false, transparent: true }))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.03, 0.06, 10, 64), glowMat(SKIN_C, 1.5))
    const back = new THREE.Mesh(new THREE.CircleGeometry(1.0, 48), M.dark)
    back.rotation.y = Math.PI
    back.position.z = -0.01
    lens.add(disc, ring, back)
    keep(disc.geometry, disc.material, ring.geometry, ring.material, back.geometry)
    lens.visible = false
    root.add(lens)
  }
  const leaderMat = glowMat(SKIN_C, 1.2)
  keep(leaderMat)
  let leader = null

  // ---- the paper clip, floating inside a loop of cotton thread ----
  const CLIP_R = 0.045
  const clip = new THREE.Group()
  const clipPath = (() => {
    const pts = []
    const line = (x1, y1, x2, y2) => {
      const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 0.12))
      for (let i = 0; i < n; i++) pts.push([lerp(x1, x2, i / n), lerp(y1, y2, i / n)])
    }
    const arc = (cx, cy, r, a1, a2) => {
      const n = 10
      for (let i = 0; i < n; i++) {
        const a = lerp(a1, a2, i / n)
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
      }
    }
    // a Gem clip: two loops nested, the wire ending in the middle lanes
    line(0.75, 0.09, -1.0, 0.09)
    arc(-1.0, -0.09, 0.18, Math.PI / 2, (3 * Math.PI) / 2)
    line(-1.0, -0.27, 1.3, -0.27)
    arc(1.3, 0, 0.27, -Math.PI / 2, Math.PI / 2)
    line(1.3, 0.27, -0.75, 0.27)
    arc(-0.75, 0.09, 0.18, Math.PI / 2, (3 * Math.PI) / 2)
    line(-0.75, -0.09, 0.95, -0.09)
    pts.push([0.95, -0.09])
    return pts.map(([x, y]) => V3(x - 0.15, 0, y))
  })()
  {
    const curve = new THREE.CatmullRomCurve3(clipPath, false, 'catmullrom', 0.1)
    const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, 360, CLIP_R, 8), M.steel)
    clip.add(wire)
    keep(wire.geometry)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 0.9), hitMat)
    clip.add(hit)
    keep(hit.geometry)
  }
  clip.rotation.y = 0.18
  clip.position.set(LOOP.x, L, LOOP.z)
  root.add(clip)
  // grains of sand nest between the clip's lanes (they are a little wider than the gaps)
  const NEST = (() => {
    const r = random(23)
    const out = []
    const lanes = [[0.18, -0.9, 1.15], [0.0, -0.75, 0.6], [-0.18, -0.85, 1.15]]
    for (let i = 0; i < 44; i++) {
      const [z, x0, x1] = lanes[i % 3]
      out.push({ x: lerp(x0, x1, (Math.floor(i / 3) + 0.5 + (r() - 0.5) * 0.4) / 15) - 0.15, z: z + (r() - 0.5) * 0.03, s: 0.06 + r() * 0.025, rot: [r() * 3, r() * 3, r() * 3] })
    }
    // poured from the middle outwards
    return out.sort((a, b) => Math.abs(a.x - 0.15) - Math.abs(b.x - 0.15))
  })()
  const grainGeo = new THREE.IcosahedronGeometry(1, 1)
  keep(grainGeo)
  const grains = new THREE.InstancedMesh(grainGeo, M.sand, NEST.length)
  grains.frustumCulled = false
  grains.raycast = () => {}
  grains.count = 0
  clip.add(grains)
  {
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    NEST.forEach((n, i) => {
      o.position.set(n.x, CLIP_R + n.s * 0.55, n.z)
      o.rotation.set(...n.rot)
      o.scale.setScalar(n.s)
      o.updateMatrix()
      grains.setMatrixAt(i, o.matrix)
      grains.setColorAt(i, col.set('#ffffff').multiplyScalar(0.8 + ((i * 37) % 10) / 25))
    })
  }
  // falling grains from the funnel
  const FALL_N = 14
  const falling = new THREE.InstancedMesh(grainGeo, M.sand, FALL_N)
  falling.frustumCulled = false
  falling.raycast = () => {}
  falling.count = 0
  root.add(falling)

  // the thread: a floppy loop, pulled into a circle by the clean water outside once soap is inside
  const threadMat = new THREE.MeshStandardMaterial({ color: '#efe4cc', roughness: 0.9, emissive: '#3a3428', emissiveIntensity: 0.45 })
  keep(threadMat)
  const LOOP_N = 16
  const floppy = (() => {
    const r = random(31)
    return Array.from({ length: LOOP_N }, (_, i) => {
      const a = (i / LOOP_N) * TAU + (r() - 0.5) * 0.2
      return { a, k: 0.86 + r() * 0.24 }
    })
  })()
  let thread = null
  let film = null
  const filmTex = canvasTex(256, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h)
    ;['#5fb8d0', '#9a80c8', '#c8b878', '#70c8a0', '#6aa0d0'].forEach((c, i, a) => grd.addColorStop(i / (a.length - 1), c))
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  const filmMat = new THREE.MeshBasicMaterial({ map: filmTex, transparent: true, opacity: 0, depthWrite: false })
  keep(filmTex, filmMat)
  const loopPoints = k => floppy.map(({ a, k: kk }) => V3(LOOP.x + Math.cos(a) * LOOP.r * lerp(kk, 1, k), L + 0.03, LOOP.z + Math.sin(a) * LOOP.r * lerp(kk, 1, k)))
  let loopK = -1
  const setLoop = k => {
    if (Math.abs(k - loopK) < 0.002) return
    loopK = k
    const pts = loopPoints(k)
    const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
    if (thread) {
      root.remove(thread)
      thread.geometry.dispose()
    }
    thread = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.045, 6, true), threadMat)
    root.add(thread)
    const shape = new THREE.Shape(curve.getPoints(80).map(p => new THREE.Vector2(p.x - LOOP.x, -(p.z - LOOP.z))))
    if (film) {
      root.remove(film)
      film.geometry.dispose()
    }
    film = new THREE.Mesh(new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2), filmMat)
    film.position.set(LOOP.x, L + 0.015, LOOP.z)
    film.renderOrder = 1
    root.add(film)
  }
  disposers.push(() => {
    thread?.geometry.dispose()
    film?.geometry.dispose()
  })
  setLoop(0)

  // ---- the lab stand holding the funnel of sand and the soap dropper over the loop ----
  // hung high, so the skater behind shows under them from the stand
  const FUNNEL = V3(LOOP.x - 0.55, 2.75, LOOP.z - 0.05)
  const DROPPER = V3(LOOP.x + 1.35, 2.95, LOOP.z + 0.75)
  const funnel = new THREE.Group()
  const dropper = new THREE.Group()
  {
    const standMat = M.metal
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 10.6, 16).translate(0, 5.3 - 0.6, 0), standMat)
    base.position.set(ROD.x, 0, ROD.z)
    root.add(base)
    keep(base.geometry)
    // the water climbs the wet rod a little
    const prof = []
    for (let i = 0; i <= 8; i++) {
      const t = i / 8
      prof.push(new THREE.Vector2(0.36 + (1 - t) * (1 - t) * 0.4, L + t * t * 0.22 - 0.02))
    }
    const climb = new THREE.Mesh(new THREE.LatheGeometry(prof, 20), new THREE.MeshStandardMaterial({ color: '#3d8b90', roughness: 0.08, emissive: '#1a4e54', emissiveIntensity: 0.4, transparent: true, opacity: 0.8 }))
    climb.position.set(ROD.x, 0, ROD.z)
    root.add(climb)
    keep(climb.geometry, climb.material)
    solids.push(circle(ROD.x, ROD.z, 0.6))
    // the funnel: a glass cone with sand in it, its spout over the clip
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.08, 1.05, 28, 1, true), M.glass)
    cone.position.y = 1.05
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.55, 14, 1, true), M.glass)
    spout.position.y = 0.27
    const inside = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.07, 0.75, 24), M.sand)
    inside.position.y = 0.93
    funnel.add(cone, spout, inside)
    keep(cone.geometry, spout.geometry, inside.geometry)
    const fHit = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.3, 1.8, 10), hitMat)
    fHit.position.y = 0.85
    funnel.add(fHit)
    keep(fHit.geometry)
    funnel.position.copy(FUNNEL)
    root.add(funnel)
    // the dropper: a glass tube, its red bulb up high, a drop of soap at its tip
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.05, 4.2, 18, 1, true).translate(0, 2.1, 0), M.glass)
    const soapIn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.04, 1.6, 14).translate(0, 0.8, 0), new THREE.MeshStandardMaterial({ color: '#8fd8ff', roughness: 0.2, emissive: '#2a6a90', emissiveIntensity: 0.5, transparent: true, opacity: 0.8 }))
    const bulb = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.9, 6, 16), M.rubber)
    bulb.position.y = 4.75
    dropper.add(tube, soapIn, bulb)
    keep(tube.geometry, soapIn.geometry, soapIn.material, bulb.geometry)
    const dHit = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 5.6, 8).translate(0, 2.6, 0), hitMat)
    dropper.add(dHit)
    keep(dHit.geometry)
    dropper.position.copy(DROPPER)
    root.add(dropper)
    // the stand's arms out to them, with a clamp round each
    const yF = FUNNEL.y + 0.9
    const yD = DROPPER.y + 3.95
    const armF = rod(V3(ROD.x, yF, ROD.z), V3(FUNNEL.x, yF, FUNNEL.z), 0.08, 0.08, standMat)
    const armD = rod(V3(ROD.x, yD, ROD.z), V3(DROPPER.x, yD, DROPPER.z), 0.08, 0.08, standMat)
    const ringF = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 24).rotateX(Math.PI / 2), standMat)
    ringF.position.set(FUNNEL.x, yF, FUNNEL.z)
    const ringD = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 8, 18).rotateX(Math.PI / 2), standMat)
    ringD.position.set(DROPPER.x, yD, DROPPER.z)
    root.add(armF, armD, ringF, ringD)
    keep(armF.geometry, armD.geometry, ringF.geometry, ringD.geometry)
  }
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshStandardMaterial({ color: '#bfe8ff', roughness: 0.05, metalness: 0.2, emissive: '#4a9ac0', emissiveIntensity: 0.6, transparent: true, opacity: 0.85 }))
  keep(drop.geometry, drop.material)
  root.add(drop)

  // labels in the world, short: the clip, the soap, the sand
  const signs1 = []
  {
    const a = label(E.skin.signs.sand, 0.2, '#f2dcae')
    a.position.set(FUNNEL.x - 1.0, FUNNEL.y + 0.75, FUNNEL.z)
    const b = label(E.skin.signs.soap, 0.2, '#bfe8ff')
    b.position.set(DROPPER.x + 0.6, DROPPER.y + 0.9, DROPPER.z)
    const c = label(E.skin.signs.clip, 0.13, '#e4ecf4')
    c.position.set(LOOP.x + 1.2, L + 0.5, LOOP.z - 0.75)
    const d = label(E.skin.signs.thread, 0.12, '#efe4cc')
    d.position.set(LOOP.x - 2.2, L + 0.3, LOOP.z + 1.3)
    signs1.push(a, b, c, d)
    root.add(a, b, c, d)
  }

  // the gauge on the stand's rod: the clip's weight against what the skin can hold
  const gaugeTex = canvasTex(320, 420, null)
  keep(gaugeTex)
  const gauge = new THREE.Group()
  {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.18), new THREE.MeshBasicMaterial({ map: gaugeTex, toneMapped: false, transparent: true }))
    face.position.z = 0.04
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.98, 1.26, 0.06, 2, 0.03), glowMat(SKIN_C, 0.9))
    gauge.add(back, face)
    keep(face.geometry, face.material, back.geometry, back.material)
    gauge.position.set(ROD.x + 0.45, 2.0, ROD.z + 0.35)
    gauge.rotation.y = facing(gauge.position, STAND1) - 0.15
    root.add(gauge)
  }
  let gaugeDrawn = ''
  const drawGauge = (w, hold) => {
    const key = `${Math.round(w * 100)}:${Math.round(hold * 100)}:${lang}`
    if (key === gaugeDrawn) return
    gaugeDrawn = key
    gaugeTex.userData.redraw((g, W2, H2) => {
      g.clearRect(0, 0, W2, H2)
      g.fillStyle = '#0d1a2e'
      g.fillRect(0, 0, W2, H2)
      const x0 = 40
      const x1 = W2 - 40
      const yb = H2 - 40
      const top = 70
      const full = 1.3
      const yOf = v => yb - (Math.min(v, full) / full) * (yb - top)
      g.fillStyle = 'rgba(255,255,255,0.08)'
      g.fillRect(x0, top, x1 - x0, yb - top)
      // the weight: a bar
      const over = w > hold
      g.fillStyle = over ? '#ff7a5a' : AMBER
      g.fillRect(x0 + 40, yOf(w), x1 - x0 - 80, yb - yOf(w))
      // what the skin can hold: a line
      g.strokeStyle = SKIN_C
      g.lineWidth = 8
      g.beginPath()
      g.moveTo(x0, yOf(hold))
      g.lineTo(x1, yOf(hold))
      g.stroke()
      g.textAlign = 'center'
      g.font = '700 30px Outfit, sans-serif'
      g.fillStyle = '#ffffff'
      g.fillText(E.skin.signs.weight, W2 / 2, 42)
      g.font = '700 26px Outfit, sans-serif'
      g.fillStyle = SKIN_C
      g.fillText(E.skin.signs.hold, W2 / 2, Math.max(top + 30, yOf(hold) - 14))
    })
  }

  // -- its state, its steps --
  // sand 0..1 on the clip; soap in the loop; the clip sunk (and when); which leg's lens is open
  const S = { leg: -1, sand: 0, soap: false, sunk: false, n: 0, t0: -99, live: false, mine: false, said: true, soapT: -99, sinkT: -99, fishT: -99, pourT: -99, legT: -99 }
  const SAND_MAX = 1
  const weight = sand => 0.3 + 0.95 * sand
  const holdNow = () => (S.soap ? 0.25 : 1)
  const SINK_SAND = (1 - 0.3) / 0.95
  let shownSand = 0
  let shownHold = 1
  const skinHint = () => {
    const H = E.skin.hints
    if (now() - S.sinkT < 1.6 || now() - S.fishT < 1.2 || now() - S.soapT < 1.4) return H.watch
    if (S.sunk) return H.fish
    if (S.leg < 0) return H.leg
    if (S.sand < 0.01 && !S.soap) return H.pour
    return H.more
  }
  const skinPanel = l => {
    const s = l === 'scientist'
    const g25 = sigma(25)
    return {
      title: E.skin.title,
      color: SKIN_C,
      blocks: [
        {
          slider: {
            label: E.skin.sand,
            min: 0,
            max: 100,
            step: 1,
            value: Math.round(S.sand * 100),
            onInput: v => setSand(Number(v) / 100, false),
            format: v => `${Math.round(v)}%`,
            live: () => Math.round(S.sand * 100),
          },
        },
        { buttons: [{ label: E.skin.verbs.pour, onClick: () => skinTap('funnel') }, { label: E.skin.verbs.soap, onClick: () => skinTap('soap') }, { label: E.skin.verbs.fish, onClick: () => skinTap('clip') }] },
        { buttons: KINDS.map(k => ({ label: E.skin.verbs[k], onClick: () => skinTap(k) })) },
        ...(s
          ? [{ rows: [[E.skin.rows.clean, `${n1(g25)} mN/m`], [E.skin.rows.soapy, E.skin.rows.soapyValue], [E.skin.rows.load, `${Math.round((weight(S.sand) / holdNow()) * 100)}%`]] }]
          : []),
        ...paras(E.skin.panel[depth(l)]),
      ],
    }
  }
  let sandSend = null
  function setSand(v, nowShare) {
    const s = clamp(Number(v) || 0, 0, SAND_MAX)
    if (S.sunk || Math.abs(s - S.sand) < 0.001) return
    const wasLoaded = S.sand
    S.sand = s
    S.mine = true
    S.n++
    if (weight(s) > holdNow()) sinkNow()
    else if (s > wasLoaded) S.pourT = now() - 0.6
    findOnce('skin', skinPanel, 2.5)
    refresh(skinPanel)
    if (nowShare) return share('skin')
    if (!sandSend) {
      sandSend = setTimeout(() => {
        sandSend = null
        share('skin')
      }, 250)
    }
  }
  function sinkNow() {
    S.sunk = true
    S.sinkT = now()
    S.live = true
    S.said = false
  }
  const pours = []
  function skinTap(thing) {
    const l = lv()
    const t = now()
    if (KINDS.includes(thing) || thing?.leg != null) {
      // a leg: its own, or the near one of that kind
      const lg = thing?.leg != null ? legs[thing.leg] : legs.find(x => x.kind === thing && x.s === 1)
      S.leg = lg.i
      S.legT = t
      S.n++
      S.mine = true
      S.live = true
      play('select')
      say(at(E.skin.says[lg.kind], l), SKIN_C)
      share('skin')
      findOnce('skin', skinPanel, 3.5)
      refresh(skinPanel)
      return
    }
    if (thing === 'funnel') {
      if (S.sunk) return say(at(E.skin.says.sunkFirst, l), SKIN_C)
      if (t - S.pourT < 0.7) return
      const next = Math.min(SAND_MAX, S.sand + 0.125)
      S.n++
      S.mine = true
      S.live = true
      S.pourT = t
      play('tap')
      pours.push({ t, from: S.sand, to: next })
      S.sand = next
      if (weight(next) > holdNow()) {
        // the last grains land, then the skin gives way
        later(0.7, () => {
          if (!S.sunk && weight(S.sand) > holdNow()) {
            sinkNow()
            share('skin')
          }
        })
        say(at(E.skin.says.heavy, l), SKIN_C)
      } else say(at(next < 0.3 ? E.skin.says.pour : E.skin.says.deeper, l), SKIN_C)
      share('skin')
      findOnce('skin', skinPanel, 3)
      refresh(skinPanel)
      return
    }
    if (thing === 'soap') {
      if (S.sunk) return say(at(E.skin.says.sunkFirst, l), SKIN_C)
      if (S.soap) return say(at(E.skin.says.soapAgain, l), SKIN_C)
      S.soap = true
      S.soapT = t
      S.n++
      S.mine = true
      S.live = true
      S.said = false
      play('pop')
      share('skin')
      findOnce('skin', skinPanel, 4)
      refresh(skinPanel)
      return
    }
    if (thing === 'clip') {
      if (!S.sunk) return say(at(E.skin.says.floats, l), SKIN_C)
      if (t - S.sinkT < 1.6) return say(at(W.busy, l))
      S.sunk = false
      S.soap = false
      S.sand = 0
      S.fishT = t
      S.n++
      S.mine = true
      S.live = true
      play('join')
      say(at(E.skin.says.fish, l), SKIN_C)
      share('skin')
      refresh(skinPanel)
    }
  }
  ex.add({
    id: 'skin',
    x: STAND1.x,
    z: STAND1.z,
    radius: 2.2,
    label: E.skin.label,
    verb: skinHint,
    manual: true,
    focus: { x: -4.7, y: 1.2, z: -2.3, size: 5.0, width: 5.8 },
    act: () => ctx.showPanel(skinPanel),
  })
  for (const lg of legs) clickable(lg.hit, () => skinTap({ leg: lg.i }), { reach: 13 })
  clickable(funnel, () => skinTap('funnel'), { reach: 9 })
  clickable(dropper, () => skinTap('soap'), { reach: 9 })
  clickable(clip, () => skinTap('clip'), { reach: 9 })

  // the scene of the skin, every frame
  const clipBase = new THREE.Vector3(LOOP.x, 0, LOOP.z)
  const cA = new THREE.Vector3()
  const cB = new THREE.Vector3()
  let rowNext = 6
  let rowT = -9
  updates.push((dt, t) => {
    const tw = now()
    // the skater: a little bob, the antennae, now and then a stroke of the middle legs
    SK.position.y = Math.sin(t * 1.3) * 0.01
    if (t > rowNext) {
      rowT = t
      rowNext = t + 7 + Math.random() * 6
      for (const lg of legs) if (lg.kind === 'middle') {
        const f = footAt(lg)
        stage.ripple(f.x, f.z, 0.8)
      }
    }
    const row = t - rowT < 1.0 ? Math.sin(((t - rowT) / 1.0) * Math.PI) : 0
    for (const lg of legs) lg.pivot.rotation.y = lg.kind === 'middle' ? -lg.s * 0.07 * row : 0
    legDimples()
    // the soap: the drop falls, the film spreads, the thread pulls into a circle
    const sa = tw - S.soapT
    const soapLive = S.live && sa < 1.6
    let soapK = S.soap ? 1 : 0
    if (S.soap && soapLive) soapK = span(0.45, 1.05, sa)
    if (!S.soap && tw - S.fishT < 1.2 && S.live) soapK = 1 - span(0, 1.0, tw - S.fishT)
    setLoop(soapK)
    filmMat.opacity = 0.16 * soapK
    // the drop: hanging at the tip, falling when let go, growing again later
    const tip = V3(DROPPER.x, DROPPER.y - 0.12, DROPPER.z)
    if (S.soap && soapLive && sa < 0.45) {
      drop.visible = true
      drop.position.set(tip.x, lerp(tip.y, L + 0.05, (sa / 0.45) ** 2), tip.z)
    } else if (S.soap && soapLive && sa < 1.0) drop.visible = false
    else {
      drop.visible = !S.soap
      drop.position.copy(tip)
      drop.scale.setScalar(0.85 + Math.sin(t * 2.4) * 0.05)
    }
    if (S.soap && soapLive && sa >= 0.45 && sa - dt < 0.45) stage.ripple(tip.x, tip.z, 1.2)
    // the hold falls with the soap
    shownHold = damp(shownHold, holdNow(), soapLive ? 5 : 30, dt)
    // the sand: grains landing one by one while pouring
    let target = S.sand
    const pour = pours.length ? pours[pours.length - 1] : null
    if (pour && tw - pour.t < 0.65) target = lerp(pour.from, pour.to, span(0.15, 0.65, tw - pour.t))
    if (!S.live || S.sunk) target = S.sand
    shownSand = S.sunk ? shownSand : target > shownSand ? Math.min(target, shownSand + dt * 0.5) : target
    grains.count = Math.round((shownSand / SAND_MAX) * NEST.length)
    // the falling stream from the funnel
    const pouring = pour && tw - pour.t < 0.7 && !S.sunk
    falling.count = pouring ? FALL_N : 0
    if (pouring) {
      const o = new THREE.Object3D()
      for (let i = 0; i < FALL_N; i++) {
        const u = ((tw - pour.t) * 2.2 + i / FALL_N) % 1
        o.position.set(FUNNEL.x + Math.sin(i * 7.1) * 0.05, lerp(FUNNEL.y, L + 0.15, u * u), FUNNEL.z + Math.cos(i * 5.3) * 0.05)
        o.scale.setScalar(0.06 + (i % 3) * 0.012)
        o.rotation.set(i, i * 2, 0)
        o.updateMatrix()
        falling.setMatrixAt(i, o.matrix)
      }
      falling.instanceMatrix.needsUpdate = true
    }
    // the clip: floating in its dimple (deeper the heavier), or going down through the skin
    const w = weight(shownSand)
    const load = clamp(w / Math.max(0.05, shownHold), 0, 1.4)
    const sk = tw - S.sinkT
    const fk = tw - S.fishT
    let y = L - (0.05 + 0.2 * Math.min(1, load)) + CLIP_R
    let tilt = 0
    let dimD = 0.05 + 0.2 * Math.min(1, load)
    if (S.sunk) {
      const a = S.live ? sk : 9
      // the dimple deepens a moment, the skin gives way, the clip goes down and settles on a ledge of mud
      const down = span(0.25, 1.5, a)
      y = lerp(L - 0.28, L - 0.95, down)
      tilt = 0.35 * down
      dimD = a < 0.25 ? lerp(0.25, 0.34, a / 0.25) : 0
      if (S.live && a >= 0.25 && a - dt < 0.25) {
        stage.ripple(clipBase.x, clipBase.z, 1.6)
        play('crack')
        if (!S.said) {
          S.said = true
          if (S.mine || near(STAND1, 6)) say(at(S.soap ? E.skin.says.soap : E.skin.says.sink, lv()), SKIN_C)
        }
      }
    } else if (S.live && fk < 1.2) {
      // fished out: up from below, dripping, set down on the skin again
      const u = span(0, 1.0, fk)
      y = lerp(L - 0.95, y, u)
      tilt = 0.35 * (1 - u)
      dimD *= u
      if (fk >= 1.0 && fk - dt < 1.0) stage.ripple(clipBase.x, clipBase.z, 0.9)
    }
    clip.position.y = y
    clip.rotation.z = tilt
    if (dimD > 0.002) {
      clip.updateMatrixWorld()
      clip.localToWorld(cA.set(-1.15, 0, 0))
      clip.localToWorld(cB.set(1.4, 0, 0))
      stage.dimple(6, cA.x, cA.z, cB.x, cB.z, 0.55, dimD)
    } else stage.dimple(6, 0, 0, 0, 0, 0.1, 0)
    // a soap drop that sinks the clip: after the thread has pulled round
    if (S.soap && !S.sunk && sa > 1.0 && weight(S.sand) > holdNow()) {
      sinkNow()
      S.sinkT = S.soapT + 1.0
      if (S.mine) share('skin')
    }
    drawGauge(w, shownHold)
    // the lens over the tapped foot
    if (S.leg >= 0) {
      const lg = legs[S.leg]
      const f = footAt(lg)
      if (!lens.visible || lens.userData.leg !== S.leg) {
        lens.userData.leg = S.leg
        drawLens(lg.kind)
        const toward = V3(STAND1.x - f.x, 0, STAND1.z - f.z).normalize()
        lens.position.set(f.x + toward.x * 0.9, 2.15, f.z + toward.z * 0.9)
        lens.rotation.set(0, facing(lens.position, STAND1), 0)
        if (leader) {
          root.remove(leader)
          leader.geometry.dispose()
        }
        leader = rod(V3(f.x, L + 0.1, f.z), lens.position.clone().add(V3(0, -1.03, 0)), 0.02, 0.02, leaderMat)
        root.add(leader)
        footRing.position.set(f.x, L + 0.03, f.z)
        footRing.scale.setScalar(lg.kind === 'front' ? 0.6 : 1)
      }
      lens.visible = true
      footRing.visible = true
      const g = S.live ? span(0, 0.5, tw - S.legT) : 1
      lens.scale.setScalar(0.2 + 0.8 * g)
      footRing.rotation.y = t * 0.3
    }
  })
  disposers.push(() => leader?.geometry.dispose())
  const near = (p, r) => {
    const q = ctx.engine.player?.pos
    return q && Math.hypot(q.x - p.x, q.z - p.z) < r
  }

  // ======================================================================================================
  // ======== 2. every molecule pulled: the picture's close-up, a model to walk round ========
  // ======================================================================================================
  // A slice of the pond's top, its molecules on a jiggled tetrahedral network (each oxygen has four
  // neighbours, 0.8 m apart here: 2.8 Å in water, so about 3 billion times bigger). The top layer is the
  // surface. Each molecule's two hydrogens point at two of its four neighbours' oxygens: hydrogen bonds, dashed.
  const A = (4 * 0.8) / Math.sqrt(3)
  const Y0 = 0.85
  const mols = []
  {
    const fcc = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]
    const sites = []
    for (const b of [[0, 0, 0], [0.25, 0.25, 0.25]]) {
      for (const f of fcc) {
        for (let i = -1; i < 4; i++) {
          for (let j = -1; j < 3; j++) {
            for (let k = -1; k < 3; k++) {
              const x = (i + f[0] + b[0]) * A
              const y = (j + f[1] + b[1]) * A
              const z = (k + f[2] + b[2]) * A
              if (x < -1e-6 || x > 2.5 * A - 0.1 || z < -1e-6 || z > 2 * A - 0.1 || y < -1e-6 || y > A + 1e-6) continue
              // which of the two lattices: their four bond directions point opposite ways
              sites.push({ p: V3(x, y, z), sub: b[0] ? 1 : 0 })
            }
          }
        }
      }
    }
    const r = random(5)
    const cx = 1.25 * A
    const cz = 1.0 * A
    for (const s of sites) {
      const rest = V3(SLAB.x + s.p.x - cx + (r() - 0.5) * 0.12, Y0 + s.p.y + (r() - 0.5) * 0.08, SLAB.z + s.p.z - cz + (r() - 0.5) * 0.12)
      const sign = s.sub ? -1 : 1
      const dirs = [V3(1, 1, 1), V3(1, -1, -1), V3(-1, 1, -1), V3(-1, -1, 1)].map(v => v.multiplyScalar(sign).normalize())
      mols.push({ rest, pos: rest.clone(), dirs, layer: Math.round(s.p.y / (A / 4)), nb: [null, null, null, null], h: [0, 1], from: [null, null], swT: -9, sw: -1, ph: r() * 10 })
    }
  }
  const TOP = 4
  // neighbours: along each of the four directions, the molecule about 0.8 m away
  for (const m of mols) {
    m.dirs.forEach((d, k) => {
      let best = null
      for (const o of mols) {
        if (o === m) continue
        const v = o.rest.clone().sub(m.rest)
        if (v.length() < 1.05 && v.normalize().dot(d) > 0.8) best = o
      }
      m.nb[k] = best
    })
  }
  // the hydrogens: each molecule gives its two to neighbours not already bonded to it, at random; at the top
  // some point up into the air, bonded to nothing
  const bondTaken = (m, k) => {
    const o = m.nb[k]
    if (!o) return false
    const back = o.nb.indexOf(m)
    return back >= 0 && o.h.includes(back)
  }
  {
    const r = random(17)
    const order = mols.map((m, i) => i).sort(() => r() - 0.5)
    for (const i of order) {
      const m = mols[i]
      const free = [0, 1, 2, 3].filter(k => m.nb[k] && !bondTaken(m, k)).sort(() => r() - 0.5)
      const empty = [0, 1, 2, 3].filter(k => !m.nb[k])
      const pick = [...free, ...empty, 0, 1, 2, 3].filter((k, j, a) => a.indexOf(k) === j).slice(0, 2)
      m.h = pick
    }
  }
  const OH = 0.274
  const molO = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 18, 12), M.O, mols.length)
  const molH = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 14, 10), M.H, mols.length * 2)
  for (const m of [molO, molH]) {
    m.frustumCulled = false
    m.raycast = () => {}
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    root.add(m)
    keep(m.geometry)
  }
  // the bonds' dashes: four per possible bond (every neighbour pair, each way)
  const pairs = []
  for (const m of mols) m.nb.forEach((o, k) => o && pairs.push({ m, k, o }))
  const DPB = 4
  const dashMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false })
  keep(dashMat)
  const dashes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.024, 0.024, 0.075, 6), dashMat, pairs.length * DPB)
  dashes.frustumCulled = false
  dashes.raycast = () => {}
  dashes.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  root.add(dashes)
  keep(dashes.geometry)
  const dashCol = new THREE.Color(DASH).multiplyScalar(0.85)
  const dashLit = new THREE.Color('#bffff6').multiplyScalar(2.2)
  // every dash gets a colour now, so the shader is built with them from the first frame
  for (let i = 0; i < pairs.length * DPB; i++) dashes.setColorAt(i, dashCol)

  // the plinth it floats over, the frame round it, the words
  {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.95, 3.05, 0.55, 48), M.dark)
    plinth.position.set(SLAB.x, 0.12, SLAB.z)
    const edge = new THREE.Mesh(new THREE.TorusGeometry(2.97, 0.04, 6, 96).rotateX(Math.PI / 2), glowMat(PULL_C, 1.4))
    edge.position.set(SLAB.x, 0.4, SLAB.z)
    root.add(plinth, edge)
    keep(plinth.geometry, edge.geometry, edge.material)
    solids.push(circle(SLAB.x, SLAB.z, 3.0, { y0: 0, y1: 3 }))
    // glowing edges round the slice: faint below, the top (the surface) bright
    const W2 = 2.5 * A + 0.3
    const D2 = 2 * A + 0.3
    const H2 = A + 0.25
    const faint = glowMat(PULL_C, 0.5, { transparent: true, opacity: 0.5 })
    const bright = glowMat(SKIN_C, 1.6)
    keep(faint, bright)
    const yB = Y0 - 0.15
    const yT = Y0 + A + 0.1
    const corner = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    for (let i = 0; i < 4; i++) {
      const [ax, az] = corner[i]
      const [bx, bz] = corner[(i + 1) % 4]
      const a = V3(SLAB.x + (ax * W2) / 2, 0, SLAB.z + (az * D2) / 2)
      const b = V3(SLAB.x + (bx * W2) / 2, 0, SLAB.z + (bz * D2) / 2)
      const bottom = rod(a.clone().setY(yB), b.clone().setY(yB), 0.018, 0.018, faint, 5)
      const top = rod(a.clone().setY(yT), b.clone().setY(yT), 0.03, 0.03, bright, 6)
      const up = rod(a.clone().setY(yB), a.clone().setY(yT), 0.018, 0.018, faint, 5)
      root.add(bottom, top, up)
      keep(bottom.geometry, top.geometry, up.geometry)
    }
    void H2
    const air = label(E.pull.signs.air, 0.26, '#cfe6ff')
    air.position.set(SLAB.x - 1.9, yT + 0.55, SLAB.z + D2 / 2)
    const water = label(E.pull.signs.water, 0.26, '#bff6ec')
    water.position.set(SLAB.x - W2 / 2 - 0.5, Y0 + 0.5, SLAB.z + D2 / 2 - 0.2)
    water.rotation.y = 0.5
    const surface = label(E.pull.signs.surface, 0.2, SKIN_C)
    surface.position.set(SLAB.x + W2 / 2 + 0.15, yT + 0.12, SLAB.z + D2 / 2)
    surface.anchorX = 'left'
    surface.sync()
    const scale = label(E.pull.signs.scale, 0.15, '#d2dbff', { maxWidth: 3.6 })
    scale.position.set(SLAB.x, 0.55, SLAB.z + 3.07)
    scale.rotation.x = -0.35
    root.add(air, water, surface, scale)
  }
  // a hit shape round the slice (a tap picks the molecule along the ray), and the foot over it
  const slabHit = new THREE.Mesh(new THREE.BoxGeometry(2.5 * A + 0.4, A + 0.5, 2 * A + 0.4), hitMat)
  slabHit.position.set(SLAB.x, Y0 + A / 2, SLAB.z)
  root.add(slabHit)
  keep(slabHit.geometry)
  // the skater's foot from the picture's close-up: a hairy leg coming down from the upper left
  const FOOT_TIP = V3(SLAB.x + 0.25, Y0 + A + 0.42, SLAB.z + 0.1)
  const foot = new THREE.Group()
  // lighter than the skater's own legs, so it shows against the reeds
  const footMat = new THREE.MeshStandardMaterial({ color: '#7a5e48', roughness: 0.45, emissive: '#3a2618', emissiveIntensity: 0.6 })
  keep(footMat)
  {
    const from = V3(-3.6, 2.5, -0.8)
    const leg = rod(from, V3(0, 0, 0), 0.32, 0.2, footMat, 16)
    const capEnd = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), footMat)
    foot.add(leg, capEnd)
    keep(leg.geometry, capEnd.geometry)
    // its hairs, slanting back along the leg, thick on its lower side
    const hairGeo = new THREE.CylinderGeometry(0.008, 0.016, 0.28, 4).translate(0, 0.14, 0)
    const n = light ? 70 : 160
    const hairs = new THREE.InstancedMesh(hairGeo, footMat, n)
    const r = random(3)
    const axis = from.clone().normalize()
    const o = new THREE.Object3D()
    const side = V3(0, 0, 1).cross(axis).normalize()
    for (let i = 0; i < n; i++) {
      const u = r() * 0.85
      const base = from.clone().multiplyScalar(u)
      const rad = lerp(0.2, 0.32, u)
      const ang = (r() - 0.5) * Math.PI * 1.5 + Math.PI
      const outv = side.clone().applyAxisAngle(axis, ang)
      o.position.copy(base).addScaledVector(outv, rad * 0.95)
      o.quaternion.setFromUnitVectors(V3(0, 1, 0), outv.clone().addScaledVector(axis, 0.9).normalize())
      o.updateMatrix()
      hairs.setMatrixAt(i, o.matrix)
    }
    hairs.raycast = () => {}
    foot.add(hairs)
    keep(hairGeo)
    const hit = rod(from, V3(0, 0, 0), 0.6, 0.5, hitMat, 6)
    foot.add(hit)
    keep(hit.geometry)
    foot.position.copy(FOOT_TIP)
    root.add(foot)
    const fl = label(E.pull.signs.foot, 0.17, '#e8dcc8')
    fl.position.set(FOOT_TIP.x - 2.6, FOOT_TIP.y + 2.0, FOOT_TIP.z)
    root.add(fl)
  }
  // the skin: a sheet over the top layer, shown once a top molecule has been tapped
  const sheetGeo = new THREE.PlaneGeometry(2.5 * A + 0.2, 2 * A + 0.2, 24, 20).rotateX(-Math.PI / 2)
  const sheetMat = new THREE.MeshBasicMaterial({ color: SKIN_C, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
  const sheet = new THREE.Mesh(sheetGeo, sheetMat)
  sheet.position.set(SLAB.x, Y0 + A + 0.05, SLAB.z)
  sheet.raycast = () => {}
  root.add(sheet)
  keep(sheetGeo, sheetMat)
  const sheetBase = sheetGeo.attributes.position.array.slice()
  // the pick: a halo round it, arrows for its pulls, small arrows down on every top molecule
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 14), new THREE.MeshBasicMaterial({ color: '#fff3c0', transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }))
  halo.visible = false
  root.add(halo)
  keep(halo.geometry, halo.material)
  const arrowMat = new THREE.MeshBasicMaterial({ color: hdr(AMBER, 1.6), toneMapped: false })
  const netMat = new THREE.MeshBasicMaterial({ color: hdr('#ff8a5c', 1.8), toneMapped: false })
  keep(arrowMat, netMat)
  const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8).translate(0, 0.5, 0)
  const headGeo = new THREE.ConeGeometry(0.13, 0.28, 12).translate(0, 0.14, 0)
  keep(shaftGeo, headGeo)
  const makeArrow = (mat, k = 1) => {
    const g = new THREE.Group()
    const s = new THREE.Mesh(shaftGeo, mat)
    const h = new THREE.Mesh(headGeo, mat)
    s.scale.set(k, 1, k)
    h.scale.setScalar(k)
    g.add(s, h)
    g.visible = false
    g.userData = { s, h }
    root.add(g)
    return g
  }
  const arrows = [0, 1, 2, 3].map(() => makeArrow(arrowMat))
  const netArrow = makeArrow(netMat, 1.5)
  const setArrow = (a, from, dir, len) => {
    a.visible = true
    a.position.copy(from)
    a.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize())
    a.userData.s.scale.y = Math.max(0.01, len - 0.28)
    a.userData.h.position.y = Math.max(0.01, len - 0.28)
  }
  const topMols = mols.filter(m => m.layer === TOP)
  const topArrows = new THREE.InstancedMesh(headGeo, netMat, topMols.length)
  topArrows.frustumCulled = false
  topArrows.raycast = () => {}
  topArrows.visible = false
  root.add(topArrows)
  const signSkin = label('', 0.17, SKIN_C)
  signSkin.position.set(SLAB.x + 1.7, Y0 + A + 0.85, SLAB.z + 1.4)
  root.add(signSkin)

  // -- its state, its steps --
  const P = { pick: -1, press: false, temp: 25, n: 0, pickT: -99, pressT: -99, live: false, mine: false }
  const pullHint = () => {
    const H = E.pull.hints
    if (P.pick < 0) return H.inside
    const m = mols[P.pick]
    if (m.layer !== TOP) return H.surface
    if (!P.press) return H.foot
    return H.any
  }
  const gammaText = () => `${n1(sigma(P.temp))} mN/m`
  const pullPanel = l => ({
    title: E.pull.title,
    color: PULL_C,
    blocks: [
      {
        slider: {
          label: E.pull.temp,
          min: 0,
          max: 100,
          step: 1,
          value: P.temp,
          onInput: v => setTemp(v, false),
          format: v => `${Math.round(v)} °C`,
          live: () => P.temp,
        },
      },
      { rows: [[E.pull.rows.gamma, gammaText()], [E.pull.rows.bonds, at(E.pull.rows.speed[P.temp < 34 ? 'slow' : P.temp < 67 ? 'mid' : 'fast'], l)]] },
      { buttons: [{ label: E.pull.verbs.inside, onClick: () => pullTap('inside') }, { label: E.pull.verbs.surface, onClick: () => pullTap('surface') }, { label: P.press ? E.pull.verbs.lift : E.pull.verbs.press, onClick: () => pullTap('foot') }] },
      ...paras(E.pull.panel[depth(l)]),
    ],
  })
  let tempSend = null
  let tempSaid = 25
  function setTemp(v, nowShare) {
    const T = clamp(Math.round(Number(v) || 0), 0, 100)
    if (T === P.temp) return
    P.temp = T
    P.mine = true
    findOnce('pull', pullPanel, 2)
    if (Math.abs(T - tempSaid) >= 25 || T === 0 || T === 100) {
      tempSaid = T
      say(fill(at(T >= 60 ? E.pull.says.warm : T <= 10 ? E.pull.says.cold : E.pull.says.mild, lv()), { g: n1(sigma(T)), t: T }), PULL_C)
    }
    refresh(pullPanel)
    if (nowShare) return share('pull')
    if (!tempSend) {
      tempSend = setTimeout(() => {
        tempSend = null
        share('pull')
      }, 250)
    }
  }
  /** The molecule a tap meant: the one nearest the ray from the eye through the point tapped. */
  const pickAlong = point => {
    const o = ctx.camera.position
    const d = point.clone().sub(o).normalize()
    let best = -1
    let bestT = Infinity
    mols.forEach((m, i) => {
      const v = m.pos.clone().sub(o)
      const t = v.dot(d)
      if (t < 0) return
      const off = v.addScaledVector(d, -t).length()
      if (off < 0.33 && t < bestT) {
        bestT = t
        best = i
      }
    })
    if (best >= 0) return best
    // nothing on the ray: the nearest to the point
    let bd = Infinity
    mols.forEach((m, i) => {
      const dd = m.pos.distanceTo(point)
      if (dd < bd) {
        bd = dd
        best = i
      }
    })
    return best
  }
  // the molecules a button picks: one well inside (not at the slice's cut edges), one in the top's middle
  const centre = V3(SLAB.x, Y0 + A / 2, SLAB.z)
  const insideOne = mols.reduce((b, m, i) => (m.layer === 2 && m.nb.every(Boolean) && (b < 0 || m.rest.distanceTo(centre) < mols[b].rest.distanceTo(centre)) ? i : b), -1)
  const topOne = mols.reduce((b, m, i) => (m.layer === TOP && (b < 0 || Math.hypot(m.rest.x - SLAB.x - 0.6, m.rest.z - SLAB.z - 0.5) < Math.hypot(mols[b].rest.x - SLAB.x - 0.6, mols[b].rest.z - SLAB.z - 0.5)) ? i : b), -1)
  function pullTap(thing, hit) {
    const l = lv()
    if (thing === 'foot') {
      P.press = !P.press
      P.pressT = now()
      P.n++
      P.mine = true
      P.live = true
      play(P.press ? 'join' : 'part')
      say(at(P.press ? E.pull.says.press : E.pull.says.lift, l), PULL_C)
      share('pull')
      findOnce('pull', pullPanel, 3)
      refresh(pullPanel)
      return
    }
    const i = typeof thing === 'number' ? thing : thing === 'inside' ? insideOne : thing === 'surface' ? topOne : hit ? pickAlong(hit.point) : -1
    if (i < 0 || i >= mols.length) return
    P.pick = i
    P.pickT = now()
    P.n++
    P.mine = true
    P.live = true
    play('select')
    say(at(mols[i].layer === TOP ? E.pull.says.surface : E.pull.says.inside, l), PULL_C)
    share('pull')
    findOnce('pull', pullPanel, 3.5)
    refresh(pullPanel)
  }
  ex.add({
    id: 'pull',
    x: STAND2.x,
    z: STAND2.z,
    radius: 2.0,
    label: E.pull.label,
    verb: pullHint,
    manual: true,
    focus: { x: SLAB.x, y: 2.0, z: SLAB.z, size: 6.4, width: 6.0 },
    act: () => ctx.showPanel(pullPanel),
  })
  clickable(slabHit, hit => pullTap('mol', hit), { reach: 9 })
  clickable(foot, () => pullTap('foot'), { reach: 9 })

  // the molecules, every frame: jiggling with the warmth, now and then a hydrogen turning to another neighbour
  const mx = new THREE.Matrix4()
  const qI = new THREE.Quaternion()
  const sc = new THREE.Vector3()
  const hp = [new THREE.Vector3(), new THREE.Vector3()]
  const hDir = new THREE.Vector3()
  const tmp = new THREE.Vector3()
  const dummy = new THREE.Object3D()
  let pressK = 0
  let skinK = 0
  let lastSign = ''
  const dent = (x, z) => Math.exp(-((x - FOOT_TIP.x) ** 2 + (z - FOOT_TIP.z) ** 2) / 1.5)
  const hDirOf = (m, k) => {
    const o = m.nb[k]
    if (o) return tmp.copy(o.pos).sub(m.pos).normalize()
    return tmp.copy(m.dirs[k])
  }
  updates.push((dt, t) => {
    const T = P.temp
    const amp = 0.025 + 0.06 * (T / 100)
    const rate = 0.03 + 0.25 * (T / 100)
    const pa = now() - P.pressT
    const want = P.press ? 1 : 0
    pressK = P.live && pa < 1.2 ? (P.press ? span(0, 0.9, pa) : 1 - span(0, 0.7, pa)) : want
    // the molecules' places: rest, jiggled, the top bent down under the foot
    for (const m of mols) {
      const k = (m.layer / TOP) ** 2
      const d = dent(m.rest.x, m.rest.z) * pressK * 0.55 * (0.25 + 0.75 * k)
      m.pos.set(
        m.rest.x + Math.sin(t * 2.3 + m.ph) * amp,
        m.rest.y - d + Math.sin(t * 2.9 + m.ph * 1.7) * amp * 0.8,
        m.rest.z + Math.cos(t * 2.1 + m.ph * 1.3) * amp,
      )
      // a bond breaking and re-forming: one hydrogen turns to another neighbour
      if (Math.random() < rate * dt && t - m.swT > 0.6) {
        const slot = Math.random() < 0.5 ? 0 : 1
        const others = [0, 1, 2, 3].filter(k2 => !m.h.includes(k2) && !bondTaken(m, k2))
        const prefer = others.filter(k2 => m.nb[k2])
        const pool = Math.random() < 0.85 && prefer.length ? prefer : others
        if (pool.length) {
          m.from[slot] = hDirOf(m, m.h[slot]).clone()
          m.h[slot] = pool[Math.floor(Math.random() * pool.length)]
          m.sw = slot
          m.swT = t
        }
      }
    }
    // draw: oxygen, its two hydrogens (turning when a bond moves)
    mols.forEach((m, i) => {
      mx.compose(m.pos, qI, sc.setScalar(1))
      molO.setMatrixAt(i, mx)
      for (let s = 0; s < 2; s++) {
        hDir.copy(hDirOf(m, m.h[s]))
        if (m.sw === s && t - m.swT < 0.35 && m.from[s]) hDir.lerpVectors(m.from[s], hDir, ease((t - m.swT) / 0.35)).normalize()
        hp[s].copy(m.pos).addScaledVector(hDir, OH)
        mx.compose(hp[s], qI, sc.setScalar(1))
        molH.setMatrixAt(i * 2 + s, mx)
      }
      m.hp0 = m.hp0 ?? new THREE.Vector3()
      m.hp1 = m.hp1 ?? new THREE.Vector3()
      m.hp0.copy(hp[0])
      m.hp1.copy(hp[1])
    })
    molO.instanceMatrix.needsUpdate = true
    molH.instanceMatrix.needsUpdate = true
    // the dashes: from a hydrogen to the oxygen it points at; fading in after a turn
    const pick = P.pick >= 0 ? mols[P.pick] : null
    pairs.forEach((pr, j) => {
      const { m, k, o } = pr
      const s = m.h.indexOf(k)
      let show = s >= 0 ? 1 : 0
      if (s >= 0 && m.sw === s && t - m.swT < 0.6) show = span(0.3, 0.6, t - m.swT)
      const from = s === 0 ? m.hp0 : m.hp1
      const lit = pick && (pick === m || pick === o)
      for (let q = 0; q < DPB; q++) {
        const id = j * DPB + q
        if (show <= 0.01) {
          dummy.scale.setScalar(0)
          dummy.updateMatrix()
          dashes.setMatrixAt(id, dummy.matrix)
          continue
        }
        const u0 = 0.16 + (q / DPB) * 0.72
        dummy.position.lerpVectors(from, o.pos, u0 + 0.06)
        dummy.quaternion.setFromUnitVectors(V3(0, 1, 0), tmp.copy(o.pos).sub(from).normalize())
        dummy.scale.set(show, show, show)
        dummy.updateMatrix()
        dashes.setMatrixAt(id, dummy.matrix)
        dashes.setColorAt(id, lit ? dashLit : dashCol)
      }
    })
    dashes.instanceMatrix.needsUpdate = true
    if (dashes.instanceColor) dashes.instanceColor.needsUpdate = true
    // the pick: its halo and its pulls
    for (const a of arrows) a.visible = false
    netArrow.visible = false
    if (pick) {
      halo.visible = true
      halo.position.copy(pick.pos)
      halo.scale.setScalar(1 + Math.sin(t * 4) * 0.06)
      const grow = P.live ? span(0, 0.6, now() - P.pickT) : 1
      const top = pick.layer === TOP
      let k = 0
      pick.dirs.forEach((d, j) => {
        // a top molecule has no neighbours above it (two of its directions point into the air)
        if (top && d.y > 0) return
        setArrow(arrows[k++], pick.pos.clone().addScaledVector(d, 0.2), d, 0.72 * grow)
      })
      if (top) setArrow(netArrow, pick.pos.clone().add(V3(0, -0.22, 0)), V3(0, -1, 0), 0.95 * grow)
    } else halo.visible = false
    // the skin's sheet: shown after a top molecule, bending under the foot, fainter the warmer
    const showSkin = pick && pick.layer === TOP ? 1 : 0
    skinK = damp(skinK, showSkin, 3, dt)
    const g = sigma(T) / sigma(0)
    sheetMat.opacity = skinK * 0.2 * g
    sheet.visible = skinK > 0.01
    if (sheet.visible) {
      const pos = sheetGeo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = sheetBase[i * 3] + SLAB.x
        const z = sheetBase[i * 3 + 2] + SLAB.z
        pos.setY(i, -dent(x, z) * pressK * 0.55)
      }
      pos.needsUpdate = true
    }
    topArrows.visible = skinK > 0.05
    if (topArrows.visible) {
      topMols.forEach((m, i) => {
        dummy.position.copy(m.pos).add(V3(0, -0.12, 0))
        dummy.quaternion.setFromUnitVectors(V3(0, 1, 0), V3(0, -1, 0))
        dummy.scale.setScalar(0.75 * skinK * (0.6 + 0.4 * g))
        dummy.updateMatrix()
        topArrows.setMatrixAt(i, dummy.matrix)
      })
      topArrows.instanceMatrix.needsUpdate = true
    }
    // the foot, pressing
    foot.position.set(FOOT_TIP.x, FOOT_TIP.y - pressK * 0.6, FOOT_TIP.z)
    // the sign: the skin's strength at this warmth
    const sign = sci() ? fill(E.pull.signs.gammaSci, { g: n1(sigma(T)), t: T }) : fill(E.pull.signs.gammaKid, { g: n1(sigma(T)), t: T })
    if (sign !== lastSign) {
      lastSign = sign
      signSkin.text = sign
      signSkin.sync()
    }
  })

  // ======================================================================================================
  // ======== 3. the tallest drink: a coast redwood cut open, a thread of water from root to leaf ========
  // ======================================================================================================
  const tree = new THREE.Group()
  tree.position.set(TREE.x, PT, TREE.z)
  tree.rotation.y = facing(TREE, STAND3)
  root.add(tree)
  const SOIL_H = 0.5
  const soilTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#4a3326'
    g.fillRect(0, 0, w, h)
    const r = random(4)
    for (let i = 0; i < 300; i++) {
      g.fillStyle = `rgba(${r() < 0.5 ? '30,20,14' : '110,84,60'},${0.2 + r() * 0.3})`
      g.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 3)
    }
    // the roots, cut through: pale threads spreading down
    g.strokeStyle = '#c9a77e'
    g.lineCap = 'round'
    const root2 = (x, y, a, len, wd, d) => {
      const x2 = x + Math.cos(a) * len
      const y2 = y + Math.sin(a) * len
      g.lineWidth = wd
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x2, y2)
      g.stroke()
      if (d > 0) {
        root2(x2, y2, a - 0.45, len * 0.7, wd * 0.65, d - 1)
        root2(x2, y2, a + 0.4, len * 0.7, wd * 0.65, d - 1)
      }
    }
    root2(w / 2, 0, Math.PI / 2 - 0.5, 34, 9, 3)
    root2(w / 2, 0, Math.PI / 2 + 0.5, 34, 9, 3)
    root2(w / 2, 0, Math.PI / 2, 40, 10, 3)
  })
  const soilMat = new THREE.MeshStandardMaterial({ color: '#5a3e2c', roughness: 1 })
  const soilFront = new THREE.MeshStandardMaterial({ map: soilTex, roughness: 1, emissive: '#1a120c', emissiveIntensity: 0.4 })
  keep(soilTex, soilMat, soilFront)
  {
    const soil = new THREE.Mesh(new THREE.BoxGeometry(1.5, SOIL_H, 1.5), [soilMat, soilMat, soilMat, soilMat, soilFront, soilMat])
    soil.position.y = SOIL_H / 2
    tree.add(soil)
    keep(soil.geometry)
    const tag = label(E.drink.signs.model, 0.1, '#e8f3d8', { maxWidth: 1.4 })
    tag.position.set(0, 0.1, 0.77)
    tree.add(tag)
  }
  solids.push(circle(TREE.x, TREE.z, 0.95, { y0: 0, y1: 5 }))
  // the trunk: bark outside, pale wood inside, its front cut away; built 1 m tall and stretched
  const barkTex = canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = '#8a4a32'
    g.fillRect(0, 0, w, h)
    const r = random(8)
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(${r() < 0.5 ? '60,28,18' : '170,100,70'},${0.3 + r() * 0.3})`
      g.fillRect(r() * w, 0, 2 + r() * 5, h)
    }
  })
  barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping
  const barkMat = new THREE.MeshStandardMaterial({ map: barkTex, roughness: 0.9, emissive: '#2a140c', emissiveIntensity: 0.4 })
  const woodMat = new THREE.MeshStandardMaterial({ color: '#e0b98a', roughness: 0.8, side: THREE.BackSide, emissive: '#3a2614', emissiveIntensity: 0.4 })
  keep(barkTex, barkMat, woodMat)
  const CUT = 1.3
  const trunk = new THREE.Group()
  {
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.24, 1, 28, 1, true, CUT / 2, TAU - CUT).translate(0, 0.5, 0), barkMat)
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.225, 1, 28, 1, true, CUT / 2, TAU - CUT).translate(0, 0.5, 0), woodMat)
    trunk.add(outer, inner)
    keep(outer.geometry, inner.geometry)
    trunk.position.y = SOIL_H
    tree.add(trunk)
  }
  // the crown: a narrow spire of dark green tufts on the top part, built for a 1 m tree and stretched
  const leafMat = new THREE.MeshStandardMaterial({ color: '#3e7a3e', roughness: 0.85, emissive: '#10260f', emissiveIntensity: 0.45 })
  keep(leafMat)
  const crown = new THREE.Group()
  {
    const cone = new THREE.ConeGeometry(1, 1, 10)
    keep(cone)
    const r = random(6)
    for (let i = 0; i < 16; i++) {
      const u = 0.42 + (i / 16) * 0.55
      const a = i * 2.4
      const rad = (1 - u) * 0.55 + 0.05
      const c = new THREE.Mesh(cone, leafMat)
      // keep the front open, where the thread goes up
      const ang = a % TAU
      const off = Math.abs(((ang + Math.PI) % TAU) - Math.PI) < 0.7 ? 0.5 : 1
      c.position.set(Math.sin(a) * rad * 0.5 * off, u, Math.cos(a) * rad * 0.5 * off - (off < 1 ? 0.12 : 0))
      c.scale.set(rad * (0.6 + r() * 0.3), 0.16, rad * (0.6 + r() * 0.3))
      crown.add(c)
    }
    const topCone = new THREE.Mesh(cone, leafMat)
    topCone.position.y = 1.0
    topCone.scale.set(0.06, 0.14, 0.06)
    crown.add(topCone)
    crown.position.y = SOIL_H
    tree.add(crown)
  }
  // the sun on its stalk, beside the crown
  const sun = new THREE.Group()
  const sunMat = glowMat('#ffd27a', 2.2)
  keep(sunMat)
  {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), sunMat)
    const rays = new THREE.Group()
    for (let i = 0; i < 10; i++) {
      const ray = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 6), sunMat)
      const a = (i / 10) * TAU
      ray.position.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0)
      ray.rotation.z = a - Math.PI / 2
      rays.add(ray)
      keep(ray.geometry)
    }
    sun.add(ball, rays)
    sun.userData.rays = rays
    keep(ball.geometry)
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.62, 10, 8), hitMat)
    sun.add(hit)
    keep(hit.geometry)
    sun.position.set(-1.05, 3.55, -0.25)
    tree.add(sun)
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 3.3, 8).translate(0, 1.65, 0), M.metal)
    stalk.position.set(-0.68, SOIL_H - 0.02, -0.55)
    stalk.rotation.z = 0.08
    tree.add(stalk)
    keep(stalk.geometry)
    const tagSun = label(E.drink.signs.sun, 0.15, '#ffe2a0')
    tagSun.position.set(-1.05, 3.05, -0.2)
    tree.add(tagSun)
  }
  // the ruler: real metres, the marks that matter
  const ruler = new THREE.Group()
  ruler.position.set(0.95, SOIL_H, 0.15)
  tree.add(ruler)
  {
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.06, TREE_K * H_MAX + 0.1, 0.04).translate(0, (TREE_K * H_MAX + 0.1) / 2, 0), glowMat('#e8eef6', 0.5))
    ruler.add(pole)
    keep(pole.geometry, pole.material)
    const tickMat = glowMat('#e8eef6', 0.6)
    keep(tickMat)
    for (let m = 0; m <= H_MAX; m += 10) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(m % 50 ? 0.1 : 0.2, 0.012, 0.03), tickMat)
      tick.position.set(m % 50 ? 0.05 : 0.1, m * TREE_K, 0)
      ruler.add(tick)
      keep(tick.geometry)
      if (m % 50 === 0 && m > 0) {
        const t = label(fill(E.drink.signs.m, { n: m }), 0.11, '#e8eef6')
        t.position.set(0.32, m * TREE_K, 0.02)
        ruler.add(t)
      }
    }
    // the limit: a band from 122 to 130 m
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.14, (H_BREAK - H_THIRSTY) * TREE_K, 0.05), glowMat('#ff6a4a', 1.2))
    band.position.set(0, ((H_THIRSTY + H_BREAK) / 2) * TREE_K, 0.01)
    ruler.add(band)
    keep(band.geometry, band.material)
    const lim = label(E.drink.signs.limit, 0.1, '#ffb09a')
    lim.position.set(-0.08, ((H_THIRSTY + H_BREAK) / 2) * TREE_K + 0.13, 0.04)
    lim.anchorX = 'right'
    lim.sync()
    ruler.add(lim)
    const hyp = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.05), glowMat('#ffd166', 1.4))
    hyp.position.set(0, 116 * TREE_K, 0.02)
    ruler.add(hyp)
    keep(hyp.geometry, hyp.material)
    const hypT = label(E.drink.signs.hyperion, 0.1, '#ffd166')
    hypT.position.set(0.18, 116 * TREE_K - 0.1, 0.03)
    hypT.anchorX = 'left'
    hypT.sync()
    ruler.add(hypT)
    const pump = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.05), glowMat('#9fd0ff', 1.2))
    pump.position.set(0, 10 * TREE_K, 0.02)
    ruler.add(pump)
    keep(pump.geometry, pump.material)
    const pumpT = label(E.drink.signs.pump, 0.1, '#9fd0ff')
    pumpT.position.set(0.18, 10 * TREE_K, 0.03)
    pumpT.anchorX = 'left'
    pumpT.sync()
    ruler.add(pumpT)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.55, TREE_K * H_MAX + 0.3, 0.3).translate(0, (TREE_K * H_MAX) / 2, 0), hitMat)
    ruler.add(hit)
    keep(hit.geometry)
  }
  // the marker at the tree's height on the ruler
  const marker = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 20).rotateX(Math.PI / 2), glowMat(DRINK_C, 1.8))
  ruler.add(marker)
  keep(marker.geometry, marker.material)
  // the thread of water: little molecules in a line, a pale vessel round them
  const BEAD = 0.09
  const BEADS = 80
  const beadO = new THREE.InstancedMesh(new THREE.SphereGeometry(0.033, 12, 8), M.O, BEADS)
  const beadH = new THREE.InstancedMesh(new THREE.SphereGeometry(0.019, 8, 6), M.H, BEADS * 2)
  for (const m of [beadO, beadH]) {
    m.frustumCulled = false
    m.raycast = () => {}
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    tree.add(m)
    keep(m.geometry)
  }
  const vesselMat = new THREE.MeshStandardMaterial({ color: '#9fe8f0', roughness: 0.2, transparent: true, opacity: 0.3, depthWrite: false, emissive: '#3fe0d0', emissiveIntensity: 0.9 })
  keep(vesselMat)
  let vessel = null
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshStandardMaterial({ color: '#f2fbff', roughness: 0.05, metalness: 0.5, emissive: '#8ab0c0', emissiveIntensity: 0.6, transparent: true, opacity: 0.85 }))
  bubble.visible = false
  tree.add(bubble)
  keep(bubble.geometry, bubble.material)
  // vapour puffs from the leaves
  const puffTex = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(230,250,255,0.9)')
    grd.addColorStop(1, 'rgba(230,250,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  keep(puffTex)
  const puffs = []
  const puffMat = new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0.7 })
  keep(puffMat)
  for (let i = 0; i < 18; i++) {
    const s = new THREE.Sprite(puffMat.clone())
    s.visible = false
    s.raycast = () => {}
    tree.add(s)
    puffs.push({ s, t0: -99, from: V3(0, 0, 0), dir: V3(0, 1, 0) })
    keep(s.material)
  }
  let puffN = 0
  const puff = (p, d) => {
    const pf = puffs[puffN++ % puffs.length]
    pf.t0 = now()
    pf.from.copy(p)
    pf.dir.copy(d)
  }

  // -- its state, its steps --
  const D = { height: 116, drinks: 0, sun: 0, n: 0, sunT: -99, live: false, mine: false }
  let shownH = 116
  let pathPts = []
  let pathLen = 1
  let builtH = -1
  const treeH = h => h * TREE_K
  const buildPath = h => {
    const H = treeH(h)
    const pts = [V3(0.0, 0.08, 0.6), V3(0, SOIL_H - 0.02, 0.35), V3(0, SOIL_H + 0.08, 0.13)]
    pts.push(V3(0, SOIL_H + H * 0.5, 0.11), V3(0, SOIL_H + H * 0.8, 0.09), V3(0.05, SOIL_H + H * 0.9, 0.14), V3(0.18, SOIL_H + H * 0.93, 0.22))
    const curve = new THREE.CatmullRomCurve3(pts)
    pathLen = curve.getLength()
    pathPts = curve.getSpacedPoints(400)
    if (vessel) {
      tree.remove(vessel)
      vessel.geometry.dispose()
    }
    vessel = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.05, 10), vesselMat)
    vessel.raycast = () => {}
    tree.add(vessel)
  }
  disposers.push(() => vessel?.geometry.dispose())
  const pointAt = s => {
    const u = clamp(s / pathLen, 0, 1) * (pathPts.length - 1)
    const i = Math.floor(u)
    const j = Math.min(i + 1, pathPts.length - 1)
    return tmp.lerpVectors(pathPts[i], pathPts[j], u - i)
  }
  const drinkHint = () => {
    const H = E.drink.hints
    if (now() - D.sunT < 0.9 && D.live) return H.watch
    if (D.height > H_BREAK) return H.broken
    if (D.drinks === 0) return H.sun
    return H.any
  }
  const pullAtTop = h => (1000 * 9.81 * h) / 1e6
  const drinkPanel = l => ({
    title: E.drink.title,
    color: DRINK_C,
    blocks: [
      {
        slider: {
          label: E.drink.height,
          min: H_MIN,
          max: H_MAX,
          step: 1,
          value: D.height,
          onInput: v => setHeight(v, false),
          format: v => `${Math.round(v)} m`,
          live: () => D.height,
        },
      },
      { buttons: [{ label: E.drink.verbs.sun, onClick: () => drinkTap('sun') }, { label: E.drink.verbs.hyperion, onClick: () => setHeight(116, true) }] },
      ...(l === 'scientist'
        ? [{ rows: [[E.drink.rows.height, `${Math.round(D.height)} m`], [E.drink.rows.pull, `${num(pullAtTop(D.height), 2, lang)} MPa`], [E.drink.rows.atm, fill(E.drink.rows.atmValue, { n: Math.round(pullAtTop(D.height) / 0.101325) })]] }]
        : []),
      ...paras(E.drink.panel[depth(l)]),
    ],
  })
  let heightSend = null
  let heightSaid = 'ok'
  function setHeight(v, nowShare) {
    const h = clamp(Math.round(Number(v) || 0), H_MIN, H_MAX)
    if (h === D.height) return
    D.height = h
    D.mine = true
    D.n++
    const zone = h > H_BREAK ? 'broken' : h >= H_THIRSTY ? 'thirsty' : h >= 112 && h <= 120 ? 'hyperion' : 'ok'
    if (zone !== heightSaid) {
      heightSaid = zone
      if (zone !== 'ok') say(at(E.drink.says[zone], lv()), DRINK_C)
      else if (h < 112) say(at(E.drink.says.lower, lv()), DRINK_C)
    }
    findOnce('drink', drinkPanel, 2)
    refresh(drinkPanel)
    if (nowShare) return share('drink')
    if (!heightSend) {
      heightSend = setTimeout(() => {
        heightSend = null
        share('drink')
      }, 250)
    }
  }
  function drinkTap(thing, hit) {
    const l = lv()
    if (thing === 'ruler') {
      // the height where the ruler was tapped
      const y = hit ? ruler.worldToLocal(hit.point.clone()).y : null
      if (y == null) return
      setHeight(y / TREE_K, true)
      play('tap')
      return
    }
    if (thing === 'sun') {
      if (D.live && now() - D.sunT < 0.75) return
      D.sunT = now()
      D.sun++
      D.n++
      D.mine = true
      D.live = true
      const broken = D.height > H_BREAK
      if (!broken) D.drinks++
      play('fizz')
      say(at(broken ? E.drink.says.noDrink : D.drinks === 1 ? E.drink.says.drink : E.drink.says.step, l), DRINK_C)
      share('drink')
      if (!broken) findOnce('drink', drinkPanel, 2.5)
      refresh(drinkPanel)
    }
  }
  ex.add({
    id: 'drink',
    x: STAND3.x,
    z: STAND3.z,
    radius: 2.0,
    label: E.drink.label,
    verb: drinkHint,
    manual: true,
    focus: { x: TREE.x, y: PT + 2.2, z: TREE.z, size: 5.0, width: 3.8 },
    act: () => ctx.showPanel(drinkPanel),
  })
  clickable(sun, () => drinkTap('sun'), { reach: 8 })
  clickable(ruler, hit => drinkTap('ruler', hit), { reach: 8 })

  const leafOK = new THREE.Color('#3e7a3e')
  const leafThirsty = new THREE.Color('#8a8a3a')
  const leafDry = new THREE.Color('#7a4a2a')
  let stepK = 1
  updates.push((dt, t) => {
    shownH = damp(shownH, D.height, 6, dt)
    if (Math.abs(shownH - D.height) < 0.05) shownH = D.height
    const H = treeH(shownH)
    trunk.scale.set(lerp(0.55, 1, shownH / H_MAX), H, lerp(0.55, 1, shownH / H_MAX))
    crown.scale.set(lerp(0.5, 1, shownH / H_MAX), H, lerp(0.5, 1, shownH / H_MAX))
    marker.position.y = H
    if (Math.abs(builtH - shownH) > 0.4) {
      builtH = shownH
      buildPath(shownH)
    }
    // the leaves: green, thirsty past 122 m, dry past 130 m
    const thirst = span(H_THIRSTY - 2, H_BREAK, shownH)
    const dry = span(H_BREAK, H_BREAK + 4, shownH)
    leafMat.color.copy(leafOK).lerp(leafThirsty, thirst).lerp(leafDry, dry)
    // a sip: the thread moves up one molecule
    const sa = now() - D.sunT
    const broken = D.height > H_BREAK
    if (D.live && sa < 0.8) {
      sun.scale.setScalar(1 + 0.35 * Math.sin(Math.PI * clamp(sa / 0.8)))
      if (!broken) stepK = span(0.15, 0.75, sa)
      if (sa - dt < 0.2 && sa >= 0.2) {
        // the leaves breathe out water
        for (let i = 0; i < 6; i++) puff(V3(0.15 + Math.sin(i * 2) * 0.25, SOIL_H + H * (0.75 + i * 0.035), 0.2 + Math.cos(i * 3) * 0.2), V3(Math.sin(i * 2) * 0.5, 0.8, 0.4 + Math.cos(i) * 0.3))
      }
    } else {
      sun.scale.setScalar(1)
      stepK = 1
    }
    sun.userData.rays.rotation.z = t * 0.3
    // the beads along the path: offset by the step under way
    const off = (stepK - 1) * BEAD
    const gap0 = pathLen * 0.72
    const gap = broken ? 0.28 : 0
    let n = 0
    for (let i = 0; i < BEADS; i++) {
      const s = i * BEAD + BEAD + off
      if (s > pathLen - 0.02 || s < 0) continue
      if (gap && s > gap0 && s < gap0 + gap) continue
      const p = pointAt(s).clone()
      // above a break the water hangs a little lower: nothing pulls it from below
      if (gap && s > gap0) p.y -= 0.04
      mx.compose(p, qI, sc.setScalar(1))
      beadO.setMatrixAt(n, mx)
      const a = i * 1.7
      for (let k = 0; k < 2; k++) {
        const hpos = p.clone().add(V3(Math.cos(a + k * 1.8) * 0.04, 0.022, Math.sin(a + k * 1.8) * 0.04))
        mx.compose(hpos, qI, sc.setScalar(1))
        beadH.setMatrixAt(n * 2 + k, mx)
      }
      n++
    }
    beadO.count = n
    beadH.count = n * 2
    beadO.instanceMatrix.needsUpdate = true
    beadH.instanceMatrix.needsUpdate = true
    bubble.visible = broken
    if (broken) bubble.position.copy(pointAt(gap0 + gap / 2)).add(V3(0, 0, 0.02))
    // the puffs drifting off
    for (const pf of puffs) {
      const a = now() - pf.t0
      pf.s.visible = a < 2.4
      if (!pf.s.visible) continue
      pf.s.position.copy(pf.from).addScaledVector(pf.dir, a * 0.35)
      pf.s.scale.setScalar(0.12 + a * 0.12)
      pf.s.material.opacity = 0.7 * (1 - a / 2.4)
    }
  })

  // ======================================================================================================
  // ======== 4. what if: switch the hydrogen bonds off ========
  // ======================================================================================================
  const what = new THREE.Group()
  what.position.set(WHAT.x, PT, WHAT.z)
  what.rotation.y = facing(WHAT, STAND4)
  root.add(what)
  // the chart: boiling points of water and its cousins
  const chartTex = canvasTex(1024, 680, null)
  keep(chartTex)
  {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.4), new THREE.MeshBasicMaterial({ map: chartTex, toneMapped: false }))
    face.position.z = 0.035
    const frame = new THREE.Mesh(new RoundedBoxGeometry(2.2, 1.5, 0.06, 2, 0.03), glowMat(WHAT_C, 0.9))
    const board = new THREE.Group()
    board.add(frame, face)
    board.position.set(0.55, 1.55, -0.2)
    board.rotation.x = -0.12
    what.add(board)
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.08).translate(0, 0.42, 0), M.metal)
    post.position.set(0.55, 0, -0.25)
    what.add(post)
    keep(face.geometry, face.material, frame.geometry, frame.material, post.geometry)
  }
  let chartKey = ''
  const drawChart = (offK, l) => {
    const key = `${Math.round(offK * 60)}:${l}:${lang}`
    if (key === chartKey) return
    chartKey = key
    const s = l === 'scientist'
    chartTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      const x0 = 150
      const x1 = w - 60
      const y0 = 92
      const y1 = h - 80
      const lo = s ? -180 : -100
      const hi = 120
      const X = p => x0 + ((p - 2) / 3) * (x1 - x0 - 80) + 40
      const Y = t => y1 - ((t - lo) / (hi - lo)) * (y1 - y0)
      g.textAlign = 'center'
      g.textBaseline = 'alphabetic'
      g.font = '700 40px Outfit, sans-serif'
      g.fillStyle = WHAT_C
      g.fillText(E.whatif.signs.chart, w / 2, 56)
      // the grid: every 50 °C, zero brighter
      g.font = '500 26px Outfit, sans-serif'
      g.textAlign = 'right'
      for (let t = Math.ceil(lo / 50) * 50; t <= hi; t += 50) {
        g.strokeStyle = t === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)'
        g.lineWidth = t === 0 ? 3 : 2
        g.beginPath()
        g.moveTo(x0, Y(t))
        g.lineTo(x1, Y(t))
        g.stroke()
        g.fillStyle = '#c8d2f0'
        g.fillText(`${t < 0 ? '−' : ''}${Math.abs(t)} °C`, x0 - 12, Y(t) + 9)
      }
      // group 14 (Scientist): no hydrogen bonds, no jump
      if (s) {
        g.strokeStyle = 'rgba(180,190,210,0.6)'
        g.setLineDash([])
        g.lineWidth = 3
        g.beginPath()
        BP14.forEach((d, i) => (i ? g.lineTo(X(d.p), Y(d.t)) : g.moveTo(X(d.p), Y(d.t))))
        g.stroke()
        g.fillStyle = '#b4bed2'
        for (const d of BP14) {
          g.beginPath()
          g.arc(X(d.p), Y(d.t), 9, 0, TAU)
          g.fill()
          drawFormula(g, d.f, X(d.p) + 14, Y(d.t) + 34, 24, 'left')
        }
      }
      // the trend of H2Te, H2Se, H2S, carried on to water's place
      g.strokeStyle = 'rgba(127,200,255,0.85)'
      g.lineWidth = 4
      g.setLineDash([14, 10])
      g.beginPath()
      g.moveTo(X(5), Y(BP16[3].t))
      g.lineTo(X(4), Y(BP16[2].t))
      g.lineTo(X(3), Y(BP16[1].t))
      g.lineTo(X(2), Y(TREND_H2O))
      g.stroke()
      g.setLineDash([])
      // the cousins
      g.fillStyle = '#7fc8ff'
      for (const d of BP16.slice(1)) {
        g.beginPath()
        g.arc(X(d.p), Y(d.t), 12, 0, TAU)
        g.fill()
        g.fillStyle = '#ffffff'
        drawFormula(g, d.f, X(d.p), Y(d.t) - 24, 32)
        g.fillStyle = '#7fc8ff'
      }
      // where water's trend points
      g.font = '700 26px Outfit, sans-serif'
      g.textAlign = 'left'
      g.fillStyle = '#7fc8ff'
      g.fillText(s ? E.whatif.signs.about : E.whatif.signs.far, X(2) + 22, Y(TREND_H2O) + 40)
      // water: up at 100 °C, or down on the trend when its hydrogen bonds are off
      const tw = lerp(100, TREND_H2O, offK)
      g.fillStyle = offK > 0.5 ? '#ff8a5c' : SKIN_C
      g.beginPath()
      g.arc(X(2), Y(tw), 17, 0, TAU)
      g.fill()
      g.fillStyle = '#ffffff'
      drawFormula(g, 'H2O', X(2) + 26, Y(tw) - 22, 36, 'left')
      if (offK > 0.02 && offK < 0.98) {
        g.strokeStyle = 'rgba(255,138,92,0.7)'
        g.fillStyle = 'rgba(255,138,92,0.7)'
        g.lineWidth = 4
        arrow2d(g, X(2) - 40, Y(100), X(2) - 40, Y(tw), 16)
      }
      // the pond today, about 20 °C
      g.strokeStyle = 'rgba(143,224,122,0.8)'
      g.lineWidth = 3
      g.setLineDash([6, 8])
      g.beginPath()
      g.moveTo(x0, Y(20))
      g.lineTo(x1, Y(20))
      g.stroke()
      g.setLineDash([])
      g.fillStyle = '#8fe07a'
      g.textAlign = 'left'
      g.font = '700 24px Outfit, sans-serif'
      g.fillText(E.whatif.signs.pond, X(2) + 60, Y(20) - 10)
    })
  }
  // the lever
  const lever = new THREE.Group()
  const handle = new THREE.Group()
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.35, 0.6, 2, 0.05), M.dark)
    base.position.y = 0.17
    const edge = new THREE.Mesh(new RoundedBoxGeometry(0.54, 0.05, 0.64, 2, 0.02), glowMat(WHAT_C, 1.2))
    edge.position.y = 0.36
    lever.add(base, edge)
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.8, 10).translate(0, 0.4, 0), M.metal)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), glowMat('#ff6a4a', 1.0))
    knob.position.y = 0.82
    handle.add(stick, knob)
    handle.position.y = 0.36
    lever.add(handle)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.5, 0.8).translate(0, 0.7, 0), hitMat)
    lever.add(hit)
    keep(base.geometry, edge.geometry, edge.material, stick.geometry, knob.geometry, knob.material, hit.geometry)
    lever.position.set(-0.95, 0, 0.35)
    what.add(lever)
  }
  const leverSign = label('', 0.1, '#ffe0c0', { maxWidth: 1.2 })
  leverSign.position.set(-0.95, 1.35, 0.35)
  what.add(leverSign)
  // the jar of pond water
  const jar = new THREE.Group()
  const jarWater = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 1, 24).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: '#2f8a92', roughness: 0.1, emissive: '#145058', emissiveIntensity: 0.5, transparent: true, opacity: 0.85 }))
  {
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.62, 28, 1, true), M.glass)
    glass.position.y = 0.31
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 24), M.glass)
    jarWater.position.y = 0.02
    jar.add(glass, bottom, jarWater)
    keep(glass.geometry, bottom.geometry, jarWater.geometry, jarWater.material)
    jar.position.set(-0.25, 0, 0.75)
    what.add(jar)
    const tag = label(E.whatif.signs.jar, 0.1, '#bff6ec')
    tag.position.set(-0.25, 0.78, 0.75)
    what.add(tag)
  }
  const jarBubbles = []
  for (let i = 0; i < 10; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), M.H)
    b.visible = false
    jar.add(b)
    jarBubbles.push(b)
  }
  keep(jarBubbles[0].geometry)
  // steam over the pond
  const steamMat = new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0, color: '#cfe8ea' })
  keep(steamMat)
  const STEAM_N = light ? 26 : 60
  const steam = []
  {
    const r = random(51)
    for (let i = 0; i < STEAM_N; i++) {
      const s = new THREE.Sprite(steamMat.clone())
      s.raycast = () => {}
      s.visible = false
      const a = r() * TAU
      const d = 1.5 + Math.sqrt(r()) * 13
      steam.push({ s, x: Math.cos(a) * d, z: Math.sin(a) * d, ph: r() * 4 })
      root.add(s)
      keep(s.material)
    }
  }
  // the jar's own steam
  const jarSteam = []
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Sprite(steamMat.clone())
    s.raycast = () => {}
    s.visible = false
    what.add(s)
    jarSteam.push(s)
    keep(s.material)
  }

  const Wf = { off: false, n: 0, t0: -99, live: false, mine: false }
  let offK = 0
  let lastLeverSign = ''
  const whatHint = () => (Wf.off ? E.whatif.hints.on : E.whatif.hints.off)
  const whatPanel = l => ({
    title: E.whatif.title,
    color: WHAT_C,
    blocks: [
      { buttons: [{ label: Wf.off ? E.whatif.verbs.on : E.whatif.verbs.off, onClick: () => whatTap('lever') }] },
      ...(l === 'scientist'
        ? [{ rows: [...BP16.map(d => [d.f.replace(/(\d)/g, m => '₀₁₂₃₄₅₆₇₈₉'[m]), `${d.t < 0 ? '−' : ''}${n1(Math.abs(d.t))} °C`]), [E.whatif.rows.trend, E.whatif.rows.trendValue]] }]
        : []),
      ...paras(E.whatif.panel[depth(l)]),
    ],
  })
  function whatTap() {
    const l = lv()
    if (Wf.live && now() - Wf.t0 < 1.2) return say(at(W.busy, l))
    Wf.off = !Wf.off
    Wf.t0 = now()
    Wf.n++
    Wf.mine = true
    Wf.live = true
    play(Wf.off ? 'fizz' : 'join')
    say(at(Wf.off ? E.whatif.says.off : E.whatif.says.on, l), WHAT_C)
    share('whatif')
    findOnce('whatif', whatPanel, 3)
    refresh(whatPanel)
  }
  ex.add({
    id: 'whatif',
    x: STAND4.x,
    z: STAND4.z,
    radius: 1.9,
    label: E.whatif.label,
    verb: whatHint,
    manual: true,
    focus: { x: WHAT.x - 0.1, y: PT + 1.0, z: WHAT.z, size: 2.4, width: 3.6 },
    act: () => ctx.showPanel(whatPanel),
  })
  clickable(lever, () => whatTap('lever'), { reach: 7 })

  let jarFill = 1
  updates.push((dt, t) => {
    const a = now() - Wf.t0
    const want = Wf.off ? 1 : 0
    offK = Wf.live && a < 2 ? (Wf.off ? span(0, 1.6, a) : 1 - span(0, 1.4, a)) : want
    handle.rotation.x = lerp(-0.55, 0.55, offK)
    drawChart(offK, lv())
    const sign = Wf.off ? E.whatif.signs.off : E.whatif.signs.on
    if (sign !== lastLeverSign) {
      lastLeverSign = sign
      leverSign.text = sign
      leverSign.sync()
    }
    // the jar boils away, or fills again from the air
    jarFill = Wf.off ? Math.max(0, jarFill - dt * (Wf.live ? 0.35 : 9)) : Math.min(1, jarFill + dt * (Wf.live ? 0.5 : 9))
    jarWater.scale.y = Math.max(0.001, 0.5 * jarFill)
    jarWater.visible = jarFill > 0.01
    jarBubbles.forEach((b, i) => {
      b.visible = Wf.off && jarFill > 0.05
      if (!b.visible) return
      const u = (t * 0.9 + i / jarBubbles.length) % 1
      b.position.set(Math.sin(i * 2.3) * 0.18, 0.04 + u * 0.5 * jarFill, Math.cos(i * 1.7) * 0.18)
      b.scale.setScalar(0.6 + u)
    })
    jarSteam.forEach((s, i) => {
      s.visible = offK > 0.05
      if (!s.visible) return
      const u = (t * 0.35 + i / jarSteam.length) % 1
      s.position.set(-0.25 + Math.sin(i * 3 + t) * 0.15, 0.6 + u * 1.4, 0.75 + Math.cos(i * 2) * 0.15)
      s.scale.setScalar(0.25 + u * 0.6)
      s.material.opacity = 0.55 * offK * (1 - u)
    })
    // the whole pond steams and seethes
    stage.boil(offK)
    for (const st of steam) {
      st.s.visible = offK > 0.03
      if (!st.s.visible) continue
      const u = (t * 0.18 + st.ph) % 1
      st.s.position.set(st.x + Math.sin(t * 0.3 + st.ph) * 0.4, L + 0.2 + u * 4.5, st.z)
      st.s.scale.setScalar(0.8 + u * 2.2)
      st.s.material.opacity = 0.32 * offK * Math.sin(Math.PI * u)
    }
  })

  // ======== you on the water: in first person your own feet dent the skin, and ring it as you walk ========
  let stepT = 0
  updates.push((dt, t) => {
    const pl = ctx.engine.player
    if (pl?.mode === 'first' && pl.pos.y < PT - 0.05) {
      stage.dimple(15, pl.pos.x, pl.pos.z, pl.pos.x, pl.pos.z, 0.42, 0.11 + (Math.abs(pl.speed) > 0.2 ? Math.abs(Math.sin(t * 7)) * 0.04 : 0))
      if (Math.abs(pl.speed) > 0.3 && t - stepT > 0.55) {
        stepT = t
        stage.ripple(pl.pos.x, pl.pos.z, 0.55)
      }
    } else stage.dimple(15, 0, 0, 0, 0, 0.1, 0)
  })

  updates.push((dt, t) => stage.update(t, dt))

  // ---- shared states ----
  const ageOf = t0 => Math.min(30, Math.round((now() - t0) * 10) / 10)
  const skinState = () => ({ leg: S.leg, sand: Math.round(S.sand * 1000) / 1000, soap: S.soap, sunk: S.sunk, n: S.n, sinkAge: ageOf(S.sinkT), soapAge: ageOf(S.soapT), fishAge: ageOf(S.fishT) })
  const pullState = () => ({ pick: P.pick, press: P.press, temp: P.temp, n: P.n, age: ageOf(Math.max(P.pickT, P.pressT)) })
  const drinkState = () => ({ height: D.height, drinks: D.drinks, sun: D.sun, n: D.n, age: ageOf(D.sunT) })
  const whatState = () => ({ off: Wf.off, n: Wf.n, age: ageOf(Wf.t0) })
  const ageIn = (s, k, ago) => clamp((Number(s?.[k]) || 0) + (Number(ago) || 0), 0, 30)

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 10.2 },
    cameraPitchMax: 0.45,
    spawn: { x: 0, z: 8.0, yaw: 0 },
    hostSpot: { x: -2.3, z: 7.2, yaw: Math.atan2(2.3, 0.8) },
    back: { x: 0, z: 10.7, rot: Math.PI },
    stand: { x: 3.4, z: 8.5, rot: Math.atan2(-3.4, 1.0) },
    parts: {
      skin: {
        tap: thing => skinTap(typeof thing === 'number' ? { leg: thing } : thing), // 'front', 'middle', 'hind' (or a leg 0 to 5), 'funnel', 'soap', 'clip'
        sand: v => setSand(v, true), // the panel's slider, 0 to 1
        get state() { return { ...skinState(), hold: shownHold, shownSand } },
        at: thing => ({ funnel: () => FUNNEL.clone().add(V3(0, 0.9, 0)), soap: () => DROPPER.clone().add(V3(0, 1.5, 0)), clip: () => clip.position.clone(), middle: () => footAt(legs[2]), hind: () => footAt(legs[4]), front: () => footAt(legs[0]) })[thing](),
      },
      pull: {
        tap: thing => pullTap(thing), // 'inside', 'surface', 'foot', or a molecule's number
        temp: v => setTemp(v, true), // the panel's slider, 0 to 100 °C
        get state() { return { ...pullState(), layer: P.pick >= 0 ? mols[P.pick].layer : null, gamma: sigma(P.temp) } },
        at: thing => ({ inside: () => mols[insideOne].pos.clone(), surface: () => mols[topOne].pos.clone(), foot: () => foot.position.clone().add(V3(-1, 1, -0.2)) })[thing](),
      },
      drink: {
        tap: (thing, h) => (thing === 'ruler' ? setHeight(h ?? 100, true) : drinkTap(thing)), // 'sun', or 'ruler' with a height in m
        height: v => setHeight(v, true), // the panel's slider, 20 to 150 m
        get state() { return { ...drinkState(), broken: D.height > H_BREAK } },
        at: thing => ({ sun: () => sun.getWorldPosition(V3(0, 0, 0)), ruler: () => ruler.localToWorld(V3(0, 100 * TREE_K, 0)) })[thing](),
      },
      whatif: {
        tap: () => whatTap('lever'),
        get state() { return { ...whatState(), offK } },
        at: () => lever.localToWorld(V3(0, 0.8, 0)),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { skin: skinPanel, pull: pullPanel, drink: drinkPanel, whatif: whatPanel },
    shared: {
      skin: {
        get: skinState,
        set: (s, live, ago = 0) => {
          const leg = Math.round(Number(s?.leg))
          const legNow = Number.isFinite(leg) && leg >= -1 && leg < legs.length ? leg : -1
          if (legNow !== S.leg && legNow >= 0) S.legT = live ? now() : -99
          S.leg = legNow
          const sunk = !!s?.sunk
          const soap = !!s?.soap
          const sand = clamp(Number(s?.sand) || 0, 0, SAND_MAX)
          // a sinking, a soap drop or a fishing out someone just did plays here; otherwise as it stands
          S.live = !!live
          if (sunk !== S.sunk) S.said = !live
          S.sinkT = now() - ageIn(s, 'sinkAge', ago)
          S.soapT = now() - ageIn(s, 'soapAge', ago)
          S.fishT = now() - ageIn(s, 'fishAge', ago)
          if (live && sand > S.sand && !sunk) pours.push({ t: now(), from: S.sand, to: sand })
          S.sand = sand
          if (!live) shownSand = sand
          S.sunk = sunk
          S.soap = soap
          if (!live) shownHold = holdNow()
          S.n = Math.max(0, Math.round(Number(s?.n) || 0))
          S.mine = false
          refresh(skinPanel)
        },
      },
      pull: {
        get: pullState,
        set: (s, live, ago = 0) => {
          const pick = Math.round(Number(s?.pick))
          const pickNow = Number.isFinite(pick) && pick >= -1 && pick < mols.length ? pick : -1
          const press = !!s?.press
          if (live && pickNow !== P.pick) P.pickT = now()
          if (live && press !== P.press) P.pressT = now()
          if (!live) {
            P.pickT = now() - ageIn(s, 'age', ago)
            P.pressT = P.pickT
          }
          P.live = !!live
          P.pick = pickNow
          P.press = press
          const T = Math.round(Number(s?.temp))
          P.temp = Number.isFinite(T) ? clamp(T, 0, 100) : 25
          P.n = Math.max(0, Math.round(Number(s?.n) || 0))
          P.mine = false
          refresh(pullPanel)
        },
      },
      drink: {
        get: drinkState,
        set: (s, live, ago = 0) => {
          const h = Math.round(Number(s?.height))
          D.height = Number.isFinite(h) ? clamp(h, H_MIN, H_MAX) : 116
          if (!live) shownH = D.height
          const drinks = Math.max(0, Math.round(Number(s?.drinks) || 0))
          const sunN = Math.max(0, Math.round(Number(s?.sun) || 0))
          // a sip someone just took plays here; a height change does not replay the last one
          if (sunN !== D.sun || !live) D.sunT = now() - ageIn(s, 'age', ago)
          D.live = !!live
          D.drinks = drinks
          D.sun = sunN
          D.n = Math.max(0, Math.round(Number(s?.n) || 0))
          D.mine = false
          refresh(drinkPanel)
        },
      },
      whatif: {
        get: whatState,
        set: (s, live, ago = 0) => {
          const off = !!s?.off
          if (off !== Wf.off) Wf.live = !!live
          else if (!live) Wf.live = false
          Wf.off = off
          Wf.t0 = now() - ageIn(s, 'age', ago)
          if (!live) {
            offK = off ? 1 : 0
            jarFill = off ? 0 : 1
          }
          Wf.n = Math.max(0, Math.round(Number(s?.n) || 0))
          Wf.mine = false
          refresh(whatPanel)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (sandSend) clearTimeout(sandSend)
      if (tempSend) clearTimeout(tempSend)
      if (heightSend) clearTimeout(heightSend)
      stage.dispose()
      disposers.forEach(f => f())
    },
  }
}
