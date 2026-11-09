// Radon's picture "Can a gas warn of earthquakes?" as a room (docs/knowledge/picture-rooms.md): a hillside village
// in Japan at dusk beside a fault (stages/dig.js: the low sun behind the arrival, the first stars ahead), a trench
// cut across the fault whose walls show the layers offset, tiled roofs on the slope below, dark mountains behind,
// a monitoring well with a white hut and an antenna. Said as research throughout: what scientists test, never a
// way to predict. Three stations, each worked by tapping its things:
// - "The fault model" (the picture's slice): two blocks of layered rock on a sloping fault. Tap the red arrows (or
//   drag the push): the layers bend near the stuck fault, small cracks glint, more teal radon leaks up the fault;
//   at the limit the blocks slip with a jolt (the room shakes), the layers snap straight and offset, the cracks
//   close and the leak falls back (elastic rebound; the precursor idea as a hypothesis).
// - "The well's record" (the picture's screen): tap the hut and the screen draws the Nishinomiya well's radon from
//   late October 1994 (Igarashi et al. 1995): about four times by the end of December, more than ten times on
//   8 January, falling, the earthquake on 17 January. A time slider; three folders with other records (rain, an
//   earthquake with no change, air pressure), examples and said so.
// - "Finding the fault": a soil-gas probe on a line of marked spots across the field; each tap drives it in and
//   reads the radon (a teal bar), the fault zone reads high; after five spots the map joins the high to the fault
//   in the trench and flags mark its hidden line across the field. The field's readings are an example.
// All three are shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, num, clamp, lerp, damp, random, hdr } from '../../../wings/noble/kit.js'
import { digStage, soilTexture } from '../../stages/dig.js'
import { ease } from '../../kit.js'
import { makeText } from '../../../../engine/text.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { QUAKE_WORDS } from './quake.words.js'

export const WORDS = QUAKE_WORDS

const TAU = Math.PI * 2
const RN = '#3cc3d6' // radon's teal, every radon room's motes
const RN_HALO = '#6ff0ff'
const RED = '#ff6a5a'
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }

// ---- the layout (metres; the arrival at the south looks north, -z) ----
const RADIUS = 14
const TR = { x0: -2.6, x1: 5.4, z0: -8.8, z1: -6.4 } // the trench: 8 m along, 2.4 m wide
const TR_D = 1.3
// the fault's trace across the field: x = FAULT.x + FAULT.k * (z - FAULT.z), dipping west under the ground
const FAULT = { x: 1.6, z: -7.6, k: 0.135 }
const faultX = z => FAULT.x + FAULT.k * (z - FAULT.z)
const MODEL = { x: -5.6, z: -3.2, rot: 0.3 }
const SCREEN = { x: 6.0, z: -2.9, rot: 0.05 }
const HUT = { x: 8.7, z: -4.3, rot: -0.35 }
const WELL = { x: 10.0, z: -2.9 }
const RACK = { x: 6.0, z: -1.95, rot: 0.05 }
const LINE_Z = 2.2
const POS_STEP = 0.35 // positions along the probe line; every second one is a marked spot
const NPOS = 13
const POS0 = faultX(LINE_Z) - 8 * POS_STEP // the line's first position: the fault lies under the fifth marked spot
const MAP = { x: 2.2, z: 0.55 }
const SPAWN = { x: -1.0, z: 8.8 }
const BACK = { x: -1.0, z: 12.0 }

// ---- the fault model (its own coordinates: the plinth's middle on the ground, facing +z) ----
const MW = 2.6
const MH = 1.5
const MD = 1.1
const MB = 0.47 // the model's base, on the plinth
const FB = -0.38 // the fault at the model's bottom and top
const FT = 0.26
const mxf = y => FB + ((FT - FB) * y) / MH
const PERIOD = 1.5 // the layers repeat every 1.5 m
const BEND = 0.09 // each block's elastic shift at the limit, and its slip (m)
const fBend = d => 1 - Math.exp(-d / 0.32)
const PUSH_STEP = 0.2

// ---- the well's record: the Kobe trace (days from 25 October 1994, times the first level) ----
const D0 = Date.UTC(1994, 9, 25)
const KOBE_DAYS = 113 // to 15 February 1995
const PEAK_DAY = 75 // 8 January 1995
const QUAKE_DAY = 84 // 17 January 1995
// about fourfold by the end of December (day 67), more than ten times on 8 January, falling to the earthquake,
// low afterwards (Igarashi et al. 1995); between these, the wiggles are drawn
const KOBE = [
  [0, 1.0], [7, 1.2], [14, 1.5], [21, 1.8], [30, 2.2], [37, 2.5], [44, 2.9], [51, 3.2], [60, 3.6], [67, 4.0],
  [70, 5.0], [73, 8.0], [75, 10.6], [77, 7.4], [79, 5.6], [81, 4.6], [83, 3.8], [84, 3.5], [86, 2.2], [90, 1.4],
  [99, 1.1], [113, 1.0],
]
const EX_DAYS = 56 // the examples: eight weeks
const RECS = ['kobe', 'rain', 'quiet', 'air']
const EXAMPLES = ['rain', 'quiet', 'air']
const REC_COLOR = { kobe: RN, rain: '#6f9cff', quiet: '#b09cff', air: '#ffb347' }
const SPEED = { kobe: 1 / 12, rain: 1 / 5, quiet: 1 / 5, air: 1 / 5 } // of the record a second, playing

/** A number from 0 to 1 for these keys (the same on every device). */
function hash(...k) {
  let h = 2166136261
  for (const v of k) {
    h ^= Math.floor(v * 1000 + 7)
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 13
  h = Math.imul(h, 0x5bd1e995)
  h ^= h >>> 15
  return (h >>> 0) / 4294967296
}
/** A smooth wiggle, about -1 to 1. */
const wiggle = (d, seed) => Math.sin(d * 0.9 + seed * 3.1) * 0.5 + Math.sin(d * 2.3 + seed * 1.7) * 0.3 + Math.sin(d * 5.1 + seed) * 0.2

/** The radon on a record at day d (times the first level), and what else the record shows. */
function recordAt(rec, d) {
  if (rec === 'kobe') {
    let i = 0
    while (i < KOBE.length - 2 && KOBE[i + 1][0] <= d) i++
    const [d0, v0] = KOBE[i]
    const [d1, v1] = KOBE[i + 1]
    const u = clamp((d - d0) / (d1 - d0))
    const v = lerp(v0, v1, u * u * (3 - 2 * u))
    // the drawn wiggles, none at the paper's own points (end of December, the peak)
    const keep = Math.min(Math.abs(d - 67), Math.abs(d - PEAK_DAY)) / 3
    return v * (1 + 0.06 * wiggle(d, 1) * Math.min(1, keep))
  }
  if (rec === 'rain') {
    const k = d > 16 ? Math.pow((d - 16) / 6, 2) * Math.exp(2 * (1 - (d - 16) / 6)) : 0
    return 1 + 1.55 * k + 0.06 * wiggle(d, 2)
  }
  if (rec === 'quiet') return 1 + 0.07 * wiggle(d, 3)
  return 1.15 - 0.42 * pressureAt(d) + 0.04 * wiggle(d, 4)
}
const pressureAt = d => Math.sin((TAU * d) / 6.3 + 0.5) * 0.8 + Math.sin((TAU * d) / 14 + 1.3) * 0.4
const rainAt = d => (d >= 14 && d <= 20 ? [0.3, 0.7, 1, 0.9, 0.8, 0.5, 0.2][d - 14] : 0)
const EX_QUAKE = 37 // the quiet well's earthquake, an example

/** The soil gas at position j of the line (kBq/m3): a background, and a narrow high over the fault. An example. */
function readingAt(j) {
  const x = POS0 + j * POS_STEP
  const d = x - faultX(LINE_Z)
  return Math.round(8 + 4 * hash(j, 5) + 34 * Math.exp(-((d / 0.5) ** 2)))
}
const HIGH = 25

// ---- textures ----

/** The trench wall across the fault: layers one under another, the west block's raised, more for the older,
 *  deeper ones (each earthquake offset what lay below its ground of the time); the fault a dark seam dipping west.
 *  `xf`: where the fault meets the surface, metres from the wall's west end. v = 1 at the surface. */
function faultWallTexture({ width, height, xf, seed, px = 128 }) {
  const rnd = random(seed)
  // the beds from the top (their bottoms, metres below the surface), and the earthquakes since each was laid:
  // group 1 has been offset by one, group 2 by two; two pale ash beds make the offsets easy to see
  const LAY = [
    { to: 0.16, c: '#4b3824', g: 0 },
    { to: 0.3, c: '#8a6a4a', g: 1 },
    { to: 0.38, c: '#a89878', g: 1 },
    { to: 0.55, c: '#6e5040', g: 1 },
    { to: 0.72, c: '#9a7a54', g: 2 },
    { to: 0.8, c: '#a89878', g: 2 },
    { to: 1.0, c: '#4e4248', g: 2 },
    { to: 1.18, c: '#7c6450', g: 2 },
    { to: 9, c: '#5a4a44', g: 2 },
  ]
  const OFF = [0, 0.14, 0.32] // the west block raised: by one earthquake's slip, then by two
  const phase = LAY.map(() => rnd() * 9)
  const wave = (i, x) => 0.012 * Math.sin((x / px) * 1.7 + phase[i]) + 0.006 * Math.sin((x / px) * 5.3 + phase[i] * 2)
  const dip = 0.35 // the fault moves 0.35 m west for every metre down
  return canvasTex(Math.round(width * px), Math.round(height * px), (g, w, h) => {
    const paint = west => {
      // the older beds were worn down to the ground of the first earthquake's time before the younger ones
      // were laid over them: in the raised block they start below the younger group's bottom
      const lastYoung = LAY.filter(l => l.g === 1).pop().to
      const horizon = west ? lastYoung - OFF[1] : 0
      for (let i = 1; i < LAY.length; i++) {
        const off = west ? OFF[LAY[i].g] : 0
        const top = LAY[i - 1].to - off
        g.fillStyle = LAY[i].c
        g.beginPath()
        g.moveTo(0, h)
        for (let x = 0; x <= w + 8; x += 8) {
          const y = top + wave(i, x)
          g.lineTo(x, (LAY[i].g === 2 ? Math.max(y, horizon + wave(3, x)) : y) * px)
        }
        g.lineTo(w + 8, h)
        g.closePath()
        g.fill()
      }
    }
    paint(false)
    g.save()
    g.beginPath()
    g.moveTo(0, 0)
    g.lineTo(xf * px, 0)
    g.lineTo((xf - dip * height) * px, h)
    g.lineTo(0, h)
    g.closePath()
    g.clip()
    paint(true)
    g.restore()
    // the topsoil over both blocks, laid down since the last earthquake
    g.fillStyle = LAY[0].c
    g.beginPath()
    g.moveTo(0, 0)
    for (let x = 0; x <= w + 8; x += 8) g.lineTo(x, (LAY[0].to + wave(0, x)) * px)
    g.lineTo(w + 8, 0)
    g.closePath()
    g.fill()
    // grit and stones
    for (let i = 0; i < w * h * 0.02; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(30,20,12,0.3)' : 'rgba(205,185,150,0.2)'
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2)
    }
    for (let i = 0; i < w * h * 0.00022; i++) {
      const r = 1.5 + rnd() * 2.5
      g.fillStyle = `rgba(${105 + rnd() * 40},${95 + rnd() * 35},${85 + rnd() * 30},0.8)`
      g.beginPath()
      g.ellipse(rnd() * w, LAY[0].to * px + rnd() * (h - LAY[0].to * px), r, r * 0.6, rnd() * 3, 0, TAU)
      g.fill()
    }
    // the fault: a seam of crushed clay from below the topsoil down
    const top = LAY[0].to * 0.85
    g.strokeStyle = '#2a2024'
    g.lineWidth = 6
    g.beginPath()
    g.moveTo((xf - dip * top) * px, top * px)
    g.lineTo((xf - dip * height) * px, h)
    g.stroke()
    g.strokeStyle = 'rgba(190,170,140,0.35)'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo((xf - dip * top) * px + 4, top * px)
    g.lineTo((xf - dip * height) * px + 4, h)
    g.stroke()
    // roots in the topsoil
    g.strokeStyle = 'rgba(200,170,120,0.4)'
    g.lineWidth = 1
    for (let i = 0; i < w / 12; i++) {
      let x = rnd() * w
      let y = 0.03 * px
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 5; k++) g.lineTo((x += (rnd() - 0.5) * 7), (y += 3 + rnd() * 5))
      g.stroke()
    }
  })
}

/** The fault model's layers: the picture's colours, repeating every PERIOD up and across (a seamless tile). */
function modelStrataTexture() {
  const COLS = ['#8a6a4a', '#6e5040', '#9a7a54', '#5a4a44', '#7c6450', '#4e4248', '#6a5a4a']
  const TH = [0.24, 0.2, 0.25, 0.18, 0.23, 0.2, 0.2] // metres, 1.5 in all
  const rnd = random(77)
  const t = canvasTex(512, 512, (g, w, h) => {
    const per = h / PERIOD
    // above the first layer's waving top: the last layer of the tile above (the tile wraps)
    g.fillStyle = COLS[COLS.length - 1]
    g.fillRect(0, 0, w, h)
    let y = 0
    const bounds = TH.map(th => (y += th))
    // each layer from its top down (canvas y down from the tile's top), the deeper ones painted over the lower
    // part; boundaries wave with whole cycles
    for (let i = 0; i < TH.length; i++) {
      const y0 = i === 0 ? 0 : bounds[i - 1]
      g.fillStyle = COLS[i]
      g.beginPath()
      g.moveTo(0, h)
      for (let x = 0; x <= w; x += 8) g.lineTo(x, (y0 + 0.014 * Math.sin((x / w) * TAU * 2 + i) + 0.007 * Math.sin((x / w) * TAU * 5 + i * 2)) * per)
      g.lineTo(w, h)
      g.closePath()
      g.fill()
    }
    for (let i = 0; i < 5200; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(25,16,10,0.25)' : 'rgba(220,200,160,0.16)'
      g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

/** A hipped roof: base W x D at y = 0, its ridge along x at height H. */
function hipRoof(W, D, H) {
  const a = W / 2
  const b = D / 2
  const r = Math.max(0.05, (W - D) / 2)
  const p0 = [-a, 0, -b]
  const p1 = [a, 0, -b]
  const p2 = [a, 0, b]
  const p3 = [-a, 0, b]
  const r0 = [-r, H, 0]
  const r1 = [r, H, 0]
  const tris = [p3, p2, r1, p3, r1, r0, p1, p0, r0, p1, r0, r1, p2, p1, r1, p0, p3, r0, p0, p1, p2, p0, p2, p3]
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3))
  geo.computeVertexNormals()
  return geo
}

/** A flat ribbon along a polyline in the xy plane (for cracks). */
function ribbon(points, w) {
  const pos = []
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1]
    const dx = x1 - x0
    const dy = y1 - y0
    const l = Math.hypot(dx, dy) || 1
    const nx = (-dy / l) * w * 0.5
    const ny = (dx / l) * w * 0.5
    pos.push(x0 - nx, y0 - ny, 0, x1 - nx, y1 - ny, 0, x1 + nx, y1 + ny, 0, x0 - nx, y0 - ny, 0, x1 + nx, y1 + ny, 0, x0 + nx, y0 + ny, 0)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  return geo
}

export async function build({ ctx, root, lang, E, ex, say, later, light, color, level, depth, clickable }) {
  const stage = digStage({
    light,
    radius: RADIUS,
    sun: [0.5, 0.1, 0.86],
    pits: [TR],
    bare: [
      [(TR.x0 + TR.x1) / 2, (TR.z0 + TR.z1) / 2, 9.4, 4.2],
      [(TR.x0 + TR.x1) / 2, TR.z0 - 2.0, 6.5, 2.8],
      [MODEL.x, MODEL.z, 4.6, 3.2, MODEL.rot],
      [HUT.x - 0.6, HUT.z + 0.6, 5.2, 4.4],
      [POS0 + 2.1, LINE_Z, 6.0, 1.6],
    ],
    clear: [[SCREEN.x, SCREEN.z, 1.4], [RACK.x, RACK.z, 0.7], [MAP.x, MAP.z, 0.9]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const own = []
  const keep = o => (own.push(o), o)
  const paras = list => list.map(p => ({ p }))
  const mk = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    return m
  }
  const std = (c, o = {}) => keep(new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o }))
  const text = (s, o) => makeText(s, o)
  const hitMat = keep(new THREE.MeshBasicMaterial({ visible: false }))
  const hitBox = (w, h, d, x, y, z) => mk(keep(new THREE.BoxGeometry(w, h, d)), hitMat, x, y, z)
  const wall = () => performance.now() / 1000
  /** A world point from an object's own coordinates (for the probes' real taps). */
  const worldOf = (obj, x = 0, y = 0, z = 0) => {
    obj.updateWorldMatrix(true, false)
    return new THREE.Vector3(x, y, z).applyMatrix4(obj.matrixWorld)
  }
  const soft = keep(
    canvasTex(64, 64, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.45, 'rgba(255,255,255,0.4)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }),
  )
  const M = {
    wood: std('#6b4a32'),
    dark: std('#3a2c22', { roughness: 0.9 }),
    steel: std('#a9b1ba', { roughness: 0.35, metalness: 0.8 }),
    metal: std('#3c424c', { roughness: 0.5, metalness: 0.5 }),
    concrete: std('#8c8a84', { roughness: 0.95 }),
    white: std('#d8d4ca', { roughness: 0.7 }),
    rope: std('#e6e0d0', { roughness: 0.9 }),
    tape: std('#ff8a3a', { roughness: 0.6, emissive: '#5a2a08', emissiveIntensity: 0.5 }),
    navy: std('#0d1233', { roughness: 0.35, metalness: 0.2, emissive: '#10173f', emissiveIntensity: 0.65 }),
  }
  const rnTeal = keep(new THREE.MeshBasicMaterial({ color: hdr(RN, 1.25), toneMapped: false }))
  /** A cloud of soft halos (additive; the colour per point fades it), never in the way of a tap. */
  const halos = (n, size) => {
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    const geo = keep(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const pts = new THREE.Points(geo, keep(new THREE.PointsMaterial({ size, map: soft, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })))
    pts.frustumCulled = false
    pts.raycast = () => {}
    const halo = new THREE.Color(RN_HALO)
    return {
      pts,
      set(i, x, y, z, a) {
        pos[i * 3] = x
        pos[i * 3 + 1] = y
        pos[i * 3 + 2] = z
        col[i * 3] = halo.r * a
        col[i * 3 + 1] = halo.g * a
        col[i * 3 + 2] = halo.b * a
      },
      done() {
        geo.attributes.position.needsUpdate = true
        geo.attributes.color.needsUpdate = true
      },
    }
  }
  const atomGeo = keep(new THREE.SphereGeometry(1, 14, 10))
  /** Radon atoms: teal balls with a soft halo (the seven radon rooms' look), n of them. */
  const radonAtoms = (n, r, haloSize) => {
    const balls = new THREE.InstancedMesh(atomGeo, rnTeal, n)
    balls.frustumCulled = false
    balls.raycast = () => {}
    const h = halos(n, haloSize)
    const o = new THREE.Object3D()
    const group = new THREE.Group()
    group.add(balls, h.pts)
    return {
      group,
      set(i, x, y, z, a) {
        o.position.set(x, y, z)
        o.scale.setScalar(Math.max(0.0001, r * (0.4 + 0.6 * a) * (a > 0.01 ? 1 : 0)))
        o.updateMatrix()
        balls.setMatrixAt(i, o.matrix)
        h.set(i, x, y, z, a * 0.75)
      },
      done() {
        balls.instanceMatrix.needsUpdate = true
        h.done()
      },
    }
  }

  // ================= the place: mountains, the village, the trench =================
  {
    // the mountains behind (north), dark teal as in the picture, two ridges
    const ridge = (radius, a0, a1, base, peak, seed, top, bottom) => {
      const n = 90
      const pos = []
      const col = []
      const ct = new THREE.Color(top)
      const cb = new THREE.Color(bottom)
      for (let i = 0; i <= n; i++) {
        const a = a0 + ((a1 - a0) * i) / n
        const u = i / n
        const taper = Math.min(1, u * 5, (1 - u) * 5)
        const hgt = base + peak * taper * (0.55 + 0.25 * Math.sin(a * 5 + seed) + 0.15 * Math.sin(a * 13 + seed * 2) + 0.05 * Math.sin(a * 31 + seed * 3))
        const x = Math.cos(a) * radius
        const z = Math.sin(a) * radius
        pos.push(x, -10, z, x, hgt, z)
        col.push(cb.r, cb.g, cb.b, ct.r, ct.g, ct.b)
      }
      const idx = []
      for (let i = 0; i < n; i++) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3)
      const geo = keep(new THREE.BufferGeometry())
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
      geo.setIndex(idx)
      const m = new THREE.Mesh(geo, keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide })))
      m.renderOrder = -4
      return m
    }
    root.add(ridge(76, -2.9, -0.25, 6, 22, 1.3, '#3d5868', '#2a3c4c'))
    root.add(ridge(60, -2.7, -0.45, 2, 14, 4.1, '#2c4a56', '#1a2c3a'))

    // the village on the slope below the field, west, tiled roofs and lit windows
    const plaster = std('#a89e8c', { roughness: 0.9 })
    const timber = std('#3e2c20', { roughness: 0.9 })
    const roofMat = std('#4e5868', { roughness: 0.6, flatShading: true, side: THREE.DoubleSide })
    const ridgeMat = std('#8a94a8', { roughness: 0.5 })
    const shoji = keep(
      canvasTex(64, 64, (g, w) => {
        g.fillStyle = '#ffd88a'
        g.fillRect(0, 0, w, w)
        g.fillStyle = '#5a3a22'
        for (let i = 0; i <= 4; i++) {
          g.fillRect((i * w) / 4 - 1.5, 0, 3, w)
          g.fillRect(0, (i * w) / 4 - 1.5, w, 3)
        }
      }),
    )
    const windowMat = keep(new THREE.MeshBasicMaterial({ map: shoji, color: hdr('#ffffff', 1.05) }))
    const crown = std('#2f4a34', { roughness: 1 })
    const trunk = std('#3a2a1e', { roughness: 1 })
    const house = ({ w, d, two }) => {
      const g = new THREE.Group()
      const h = 2.7
      g.add(mk(keep(new THREE.BoxGeometry(w, h, d)), plaster, 0, h / 2, 0))
      g.add(mk(keep(new THREE.BoxGeometry(w + 0.08, 0.5, d + 0.08)), timber, 0, 0.25, 0))
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) g.add(mk(keep(new THREE.BoxGeometry(0.16, h, 0.16)), timber, (sx * w) / 2, h / 2, (sz * d) / 2))
      const win = (x, z, ry) => {
        const m = mk(keep(new THREE.PlaneGeometry(1.0, 0.8)), windowMat, x, 1.45, z)
        m.rotation.y = ry
        g.add(m)
      }
      win(-w * 0.22, d / 2 + 0.01, 0)
      win(w * 0.25, d / 2 + 0.01, 0)
      win(w / 2 + 0.01, 0, Math.PI / 2)
      win(-w / 2 - 0.01, d * 0.1, -Math.PI / 2)
      const door = mk(keep(new THREE.PlaneGeometry(0.9, 1.9)), timber, 0.05 * w, 0.95, d / 2 + 0.012)
      g.add(door)
      const roof = mk(keep(hipRoof(w + 1.1, d + 1.1, 1.55)), roofMat, 0, h, 0)
      g.add(roof)
      g.add(mk(keep(new THREE.BoxGeometry(Math.max(0.3, w - d) + 0.3, 0.2, 0.26)), ridgeMat, 0, h + 1.6, 0))
      if (two) {
        const w2 = w * 0.72
        const d2 = d * 0.72
        g.add(mk(keep(new THREE.BoxGeometry(w2, 2.3, d2)), plaster, 0, h + 1.15, 0))
        const m = mk(keep(new THREE.PlaneGeometry(1.0, 0.7)), windowMat, 0, h + 1.2, d2 / 2 + 0.01)
        g.add(m)
        g.add(mk(keep(hipRoof(w2 + 1.0, d2 + 1.0, 1.35)), roofMat, 0, h + 2.3, 0))
        g.add(mk(keep(new THREE.BoxGeometry(Math.max(0.3, w2 - d2) + 0.3, 0.18, 0.24)), ridgeMat, 0, h + 3.7, 0))
      }
      return g
    }
    const ground = (x, z) => stage.groundAt(x, z)
    const houses = [
      [-17.5, -2.5, 6.4, 4.6, 0.25, true],
      [-18.8, 5.5, 5.6, 4.2, -0.15, false],
      [-16.6, -10.5, 6.0, 4.4, 0.6, false],
      [-24.5, -6.0, 6.8, 5.0, 0.35, true],
      [-23.5, 9.5, 6.0, 4.4, -0.4, false],
      [-28.5, 1.5, 6.6, 4.8, 0.1, true],
      [-11.5, -17.5, 5.8, 4.2, 0.95, false],
      [-20.5, -15.0, 6.2, 4.6, 0.75, true],
    ].slice(0, light ? 5 : 8)
    for (const [x, z, w, d, rot, two] of houses) {
      const hs = house({ w, d, two })
      hs.position.set(x, ground(x, z) - 0.2, z)
      // each house faces the field
      hs.rotation.y = Math.atan2(-x, -z) + rot * 0.3
      root.add(hs)
    }
    const rndT = random(23)
    const trees = [
      [-15.5, 1.6], [-20.5, 1.0], [-15.2, -6.5], [-21.0, -9.5], [-19.0, 12.5], [-25.0, 4.2], [-14.0, -14.0], [-26.5, -11.0],
      [16.5, -6.0], [17.5, 2.5], [15.5, -11.5], [19.0, -1.0], [15.0, 8.0], [9.0, -15.5], [-3.0, -16.5], [4.0, -17.0],
    ]
    for (const [x, z] of trees.slice(0, light ? 10 : trees.length)) {
      const s = 0.9 + rndT() * 0.6
      const y = ground(x, z)
      root.add(mk(keep(new THREE.CylinderGeometry(0.14 * s, 0.2 * s, 1.6 * s, 6)), trunk, x, y + 0.8 * s, z))
      const c = mk(keep(new THREE.SphereGeometry(1.5 * s, 10, 8)), crown, x, y + 2.3 * s, z)
      c.scale.set(1, 1.15, 1)
      root.add(c)
    }
    // wooden poles and wires along the village lane
    const poles = [[-15.0, -13.0], [-14.6, -5.0], [-15.2, 3.0], [-16.4, 11.0]].map(([x, z]) => [x, ground(x, z), z])
    const pole = std('#5a4636', { roughness: 0.9 })
    for (const [x, y, z] of poles) {
      root.add(mk(keep(new THREE.CylinderGeometry(0.11, 0.14, 8, 7)), pole, x, y + 4, z))
      const bar = mk(keep(new THREE.BoxGeometry(0.12, 0.1, 1.6)), pole, x, y + 7.4, z)
      root.add(bar)
    }
    const wireMat = keep(new THREE.LineBasicMaterial({ color: '#15161c' }))
    for (let i = 0; i < poles.length - 1; i++) {
      for (const off of [-0.7, 0.7]) {
        const [x0, y0, z0] = poles[i]
        const [x1, y1, z1] = poles[i + 1]
        const pts = []
        for (let k = 0; k <= 16; k++) {
          const u = k / 16
          pts.push(new THREE.Vector3(lerp(x0, x1, u), lerp(y0, y1, u) + 7.42 - 0.55 * Math.sin(u * Math.PI), lerp(z0, z1, u) + off))
        }
        const line = new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(pts)), wireMat)
        line.raycast = () => {}
        root.add(line)
      }
    }
  }

  // the trench across the fault: offset layers in its walls, a string grid, the fault flagged with tags
  const trench = new THREE.Group()
  root.add(trench)
  const motesTrench = radonAtoms(light ? 4 : 7, 0.03, 0.16)
  root.add(motesTrench.group)
  {
    const len = TR.x1 - TR.x0
    const H = 1.4 // the wall textures' depth
    const north = keep(faultWallTexture({ width: len, height: H, xf: faultX(TR.z0) - TR.x0, seed: 4 }))
    const south = keep(faultWallTexture({ width: len, height: H, xf: faultX(TR.z1) - TR.x0, seed: 9 }))
    const soil = keep(soilTexture({ seed: 13, base: '#6a5038' }))
    soil.repeat.set(0.8, 0.8)
    const quad = (a, b, c, d, uv, mat) => {
      const geo = keep(new THREE.BufferGeometry())
      geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
      geo.setIndex([0, 1, 2, 0, 2, 3])
      geo.computeVertexNormals()
      const m = new THREE.Mesh(geo, mat)
      m.receiveShadow = true
      trench.add(m)
    }
    const v = y => 1 + y / H
    const u = x => (x - TR.x0) / len
    const d = -TR_D
    const nMat = keep(new THREE.MeshStandardMaterial({ map: north, roughness: 1 }))
    const sMat = keep(new THREE.MeshStandardMaterial({ map: south, roughness: 1 }))
    quad([TR.x0, d, TR.z0], [TR.x1, d, TR.z0], [TR.x1, 0, TR.z0], [TR.x0, 0, TR.z0], [0, v(d), 1, v(d), 1, 1, 0, 1], nMat)
    quad([TR.x1, d, TR.z1], [TR.x0, d, TR.z1], [TR.x0, 0, TR.z1], [TR.x1, 0, TR.z1], [1, v(d), 0, v(d), 0, 1, 1, 1], sMat)
    const wd = (TR.z1 - TR.z0) / len
    quad([TR.x0, d, TR.z1], [TR.x0, d, TR.z0], [TR.x0, 0, TR.z0], [TR.x0, 0, TR.z1], [0, v(d), wd, v(d), wd, 1, 0, 1], nMat)
    quad([TR.x1, d, TR.z0], [TR.x1, d, TR.z1], [TR.x1, 0, TR.z1], [TR.x1, 0, TR.z0], [1 - wd, v(d), 1, v(d), 1, 1, 1 - wd, 1], nMat)
    const floorMat = keep(new THREE.MeshStandardMaterial({ map: soil, color: '#9a8064', roughness: 1 }))
    quad([TR.x0, d, TR.z1], [TR.x1, d, TR.z1], [TR.x1, d, TR.z0], [TR.x0, d, TR.z0], [TR.x0, TR.z1, TR.x1, TR.z1, TR.x1, TR.z0, TR.x0, TR.z0].map(q => q * 0.8), floorMat)
    void u
    // the string grid on the north wall: 1 m by 0.5 m, as trench loggers hang it
    const string = keep(new THREE.CylinderGeometry(0.005, 0.005, 1, 4))
    for (let x = TR.x0 + 1; x < TR.x1 - 0.5; x += 1) {
      const s = mk(string, M.rope, x, -TR_D / 2, TR.z0 + 0.025)
      s.scale.y = TR_D - 0.1
      trench.add(s)
    }
    for (const y of [-0.35, -0.85]) {
      const s = mk(string, M.rope, (TR.x0 + TR.x1) / 2, y, TR.z0 + 0.025)
      s.scale.y = len - 0.4
      s.rotation.z = Math.PI / 2
      trench.add(s)
    }
    // red tags along the fault seam in the north wall
    const tag = keep(new THREE.PlaneGeometry(0.07, 0.045))
    const tagMat = std('#e8453a', { side: THREE.DoubleSide, emissive: '#5a0a06', emissiveIntensity: 0.5 })
    for (const y of [-0.3, -0.62, -0.95]) {
      const t = mk(tag, tagMat, faultX(TR.z0) + 0.35 * y, y, TR.z0 + 0.03)
      t.rotation.z = 0.3
      trench.add(t)
    }
    // a ladder at the east end, the spoil heap behind, a ranging pole, buckets
    const ladder = new THREE.Group()
    for (const s of [-0.22, 0.22]) ladder.add(mk(keep(new THREE.BoxGeometry(0.05, 1.9, 0.05)), M.wood, s, 0.95, 0))
    for (let i = 0; i < 6; i++) ladder.add(mk(keep(new THREE.BoxGeometry(0.44, 0.035, 0.035)), M.wood, 0, 0.2 + i * 0.3, 0))
    ladder.position.set(TR.x1 - 0.32, -TR_D, (TR.z0 + TR.z1) / 2 + 0.3)
    ladder.rotation.set(0, Math.PI / 2, -0.3)
    trench.add(ladder)
    const heapGeo = keep(new THREE.SphereGeometry(1, 20, 10, 0, TAU, 0, Math.PI / 2))
    const heapMat = keep(new THREE.MeshStandardMaterial({ map: soil, color: '#8a7058', roughness: 1 }))
    for (const [dx, dz, sx, sy, sz] of [[0.6, 0, 2.6, 0.85, 1.0], [-1.7, 0.15, 1.3, 0.6, 0.8], [2.7, -0.1, 1.2, 0.55, 0.75]]) {
      const heap = mk(heapGeo, heapMat, (TR.x0 + TR.x1) / 2 + dx, 0, TR.z0 - 2.1 + dz)
      heap.scale.set(sx, sy, sz)
      heap.receiveShadow = heap.castShadow = !light
      trench.add(heap)
    }
    solids.push(box((TR.x0 + TR.x1) / 2 + 0.6, TR.z0 - 2.1, 6.2, 2.0, { y1: 0.8 }))
    const bucket = keep(new THREE.CylinderGeometry(0.15, 0.12, 0.3, 14))
    trench.add(mk(bucket, std('#3a6ea8', { roughness: 0.6 }), TR.x0 - 0.5, 0.15, TR.z1 + 0.5))
    trench.add(mk(bucket, std('#3a6ea8', { roughness: 0.6 }), TR.x0 - 0.15, 0.15, TR.z1 + 0.75))
    // pegs and string round it
    const m = 0.3
    const corners = [[TR.x0 - m, TR.z0 - m], [TR.x1 + m, TR.z0 - m], [TR.x1 + m, TR.z1 + m], [TR.x0 - m, TR.z1 + m]]
    for (const [x, z] of corners) trench.add(mk(keep(new THREE.BoxGeometry(0.05, 0.42, 0.05)), M.wood, x, 0.21, z))
    corners.forEach((a, i) => {
      const b = corners[(i + 1) % 4]
      const s = mk(string, M.rope, (a[0] + b[0]) / 2, 0.36, (a[1] + b[1]) / 2)
      s.scale.y = Math.hypot(b[0] - a[0], b[1] - a[1])
      s.rotation.set(0, -Math.atan2(b[1] - a[1], b[0] - a[0]), Math.PI / 2)
      trench.add(s)
    })
    solids.push(box((TR.x0 + TR.x1) / 2, (TR.z0 + TR.z1) / 2, len + 0.7, TR.z1 - TR.z0 + 0.7, { y0: -2, y1: 0.6 }))
    // the sign by the trench, at the fault
    const sign = new THREE.Group()
    sign.add(mk(keep(new THREE.BoxGeometry(0.05, 0.75, 0.05)), M.wood, 0, 0.375, -0.05))
    sign.add(mk(keep(new RoundedBoxGeometry(1.25, 0.34, 0.04, 2, 0.01)), M.navy, 0, 0.82, 0))
    const st1 = text(E.signs.fault, { size: 0.13, color: '#ffd6a8', anchorY: 'middle', maxWidth: 1.15 })
    st1.position.set(0, 0.86, 0.025)
    const st2 = text(E.signs.trench, { font: 'body', size: 0.055, color: '#cfd8ff', anchorY: 'middle', maxWidth: 1.15 })
    st2.position.set(0, 0.74, 0.025)
    sign.add(st1, st2)
    // on the far lip, just above where the fault shows in the wall below it
    sign.position.set(faultX(TR.z0 - 0.5) + 0.1, 0, TR.z0 - 0.5)
    sign.rotation.y = 0.05
    root.add(sign)
    solids.push(circle(sign.position.x, sign.position.z, 0.15))
  }
  // a few radon atoms seeping up the seam in the north wall
  const trenchMotes = Array.from({ length: light ? 4 : 7 }, (_, i) => ({ ph: i / (light ? 4 : 7), sp: 0.05 + hash(i, 1) * 0.03, j: hash(i, 2) }))
  updates.push((dt, t) => {
    trenchMotes.forEach((m, i) => {
      const u = (t * m.sp + m.ph) % 1
      const y = -TR_D + u * (TR_D + 0.7)
      const yy = Math.min(y, 0)
      const x = faultX(TR.z0) + 0.35 * yy + (m.j - 0.5) * 0.08 + (y > 0 ? (m.j - 0.5) * y * 0.6 : 0)
      const a = y < -TR_D + 0.15 ? (y + TR_D) / 0.15 : y > 0.25 ? clamp(1 - (y - 0.25) / 0.45) : 1
      motesTrench.set(i, x, y, TR.z0 + 0.06, a)
    })
    motesTrench.done()
  })

  // radon breathing out of the whole field a little, the same everywhere (no hint of where the fault runs)
  const FIELD_N = light ? 12 : 28
  const fieldMotes = radonAtoms(FIELD_N, 0.024, 0.13)
  root.add(fieldMotes.group)
  const fieldSeeds = Array.from({ length: FIELD_N }, (_, i) => {
    const a = hash(i, 11) * TAU
    const r = 2 + Math.sqrt(hash(i, 12)) * 10.5
    return { x: Math.cos(a) * r, z: Math.sin(a) * r, ph: hash(i, 13), sp: 0.07 + hash(i, 14) * 0.05 }
  })
  updates.push((dt, t) => {
    fieldSeeds.forEach((m, i) => {
      const u = (t * m.sp + m.ph) % 1
      const y = 0.05 + u * 2.4
      const a = Math.min(1, u * 6) * clamp((1 - u) * 3) * 0.8
      fieldMotes.set(i, m.x + Math.sin(t * 0.5 + i) * 0.15 * u, y, m.z + Math.cos(t * 0.4 + i) * 0.15 * u, a)
    })
    fieldMotes.done()
  })

  // ================= station 1: the fault model =================
  const model = new THREE.Group()
  model.position.set(MODEL.x, 0, MODEL.z)
  model.rotation.y = MODEL.rot
  root.add(model)
  const plinthMat = std('#3e3024', { roughness: 0.8 })
  model.add(mk(keep(new RoundedBoxGeometry(3.3, 0.46, 1.7, 2, 0.03)), plinthMat, 0, 0.23, 0))
  solids.push(box(MODEL.x, MODEL.z, 3.4, 1.8, { rot: MODEL.rot }))
  const strata = keep(modelStrataTexture())
  const blockMat = keep(new THREE.MeshStandardMaterial({ map: strata, vertexColors: true, roughness: 0.95, side: THREE.DoubleSide }))
  /** One block: its front, back and outer end as fine grids, the layers' place recomputed as the rock bends. */
  const makeBlock = side => {
    const pos = []
    const col = []
    const idx = []
    const info = [] // per vertex: [height, distance to the fault, u]
    const grid = (fn, ni, nj) => {
      const base = pos.length / 3
      for (let j = 0; j <= nj; j++) {
        for (let i = 0; i <= ni; i++) {
          const p = fn(i / ni, j / nj)
          pos.push(p.x, p.y, p.z)
          info.push([p.y, p.d, p.u])
          const k = 0.5 + 0.5 * (p.y / MH)
          col.push(k, k, k)
        }
      }
      for (let j = 0; j < nj; j++) {
        for (let i = 0; i < ni; i++) {
          const a = base + j * (ni + 1) + i
          idx.push(a, a + 1, a + ni + 2, a, a + ni + 2, a + ni + 1)
        }
      }
    }
    const outer = (side * MW) / 2
    // across from the outer edge to the fault, finer near the fault
    const face = z => (s, tt) => {
      const y = tt * MH
      const xf = mxf(y)
      const k = 1 - Math.pow(1 - s, 1.8)
      const x = lerp(outer, xf, k)
      return { x, y, z, d: Math.abs(x - xf), u: x / PERIOD }
    }
    grid(face(MD / 2), 26, 16)
    grid(face(-MD / 2), 26, 16)
    grid((s, tt) => {
      const y = tt * MH
      const z = lerp(-MD / 2, MD / 2, s)
      return { x: outer, y, z, d: Math.abs(outer - mxf(y)), u: z / PERIOD }
    }, 4, 16)
    const geo = keep(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((pos.length / 3) * 2), 2))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const mesh = mk(geo, blockMat, 0, MB, 0)
    mesh.castShadow = mesh.receiveShadow = !light
    model.add(mesh)
    // the turf on top
    const x0 = side < 0 ? -MW / 2 : FT
    const x1 = side < 0 ? FT : MW / 2
    model.add(mk(keep(new THREE.BoxGeometry(x1 - x0, 0.05, MD)), std('#4a7a44', { roughness: 1 }), (x0 + x1) / 2, MB + MH + 0.025, 0))
    model.add(mk(keep(new THREE.BoxGeometry(x1 - x0, 0.03, MD)), std('#4b3824', { roughness: 1 }), (x0 + x1) / 2, MB + MH - 0.012, 0))
    // up for the west block, down for the east one: the texture is read lower to move the layers up
    const sgn = side < 0 ? 1 : -1
    let last = ''
    return {
      set(acc, bend) {
        const key = `${acc.toFixed(4)}|${bend.toFixed(4)}`
        if (key === last) return
        last = key
        const uv = geo.attributes.uv
        for (let n = 0; n < info.length; n++) {
          const [y, d, u] = info[n]
          uv.setXY(n, u, (y - sgn * (acc + bend * fBend(d))) / PERIOD)
        }
        uv.needsUpdate = true
      },
    }
  }
  const blocks = [makeBlock(-1), makeBlock(1)]
  // the fault: a dark seam on the front, the back and the turf
  {
    const len = Math.hypot(FT - FB, MH)
    const ang = Math.atan2(FT - FB, MH)
    const seamMat = std('#1a1418', { roughness: 1 })
    for (const z of [MD / 2 + 0.004, -MD / 2 - 0.004]) {
      const s = mk(keep(new THREE.PlaneGeometry(0.035, len)), seamMat, (FB + FT) / 2, MB + MH / 2, z)
      s.rotation.z = -ang
      if (z < 0) s.rotation.y = Math.PI
      model.add(s)
    }
    model.add(mk(keep(new THREE.BoxGeometry(0.04, 0.012, MD + 0.01)), seamMat, FT, MB + MH + 0.052, 0))
  }
  // the red arrows: the west block pushed up along the fault, the east one down
  const fdir = new THREE.Vector2(FT - FB, MH).normalize()
  const arrowShape = new THREE.Shape()
  {
    const L = 0.78
    const sw = 0.05
    const hw = 0.13
    const hl = 0.22
    arrowShape.moveTo(-sw, -L / 2)
    arrowShape.lineTo(sw, -L / 2)
    arrowShape.lineTo(sw, L / 2 - hl)
    arrowShape.lineTo(hw, L / 2 - hl)
    arrowShape.lineTo(0, L / 2)
    arrowShape.lineTo(-hw, L / 2 - hl)
    arrowShape.lineTo(-sw, L / 2 - hl)
    arrowShape.closePath()
  }
  const arrowGeo = keep(new THREE.ExtrudeGeometry(arrowShape, { depth: 0.04, bevelEnabled: false }))
  const arrowMat = keep(new THREE.MeshStandardMaterial({ color: RED, emissive: '#ff3a2a', emissiveIntensity: 0.55, roughness: 0.5 }))
  const arrows = [
    { x: -0.5, y: 0.82, up: 1 },
    { x: 0.4, y: 0.6, up: -1 },
  ].map(a => {
    const m = mk(arrowGeo, arrowMat, a.x, MB + a.y, MD / 2 + 0.05)
    const theta = Math.atan2(-fdir.x, fdir.y) + (a.up < 0 ? Math.PI : 0)
    m.rotation.z = theta
    model.add(m)
    return { ...a, m }
  })
  // the gauges on the plinth's front: how hard it pushes (to the limit), how much radon gets out
  const gauge = (y, c, label) => {
    const g = new THREE.Group()
    g.position.set(0, y, 0.852)
    g.add(mk(keep(new THREE.PlaneGeometry(2.0, 0.085)), keep(new THREE.MeshBasicMaterial({ color: '#141a30' })), 0.35, 0, 0))
    const fillMat = keep(new THREE.MeshBasicMaterial({ color: hdr(c, 1.1), toneMapped: false }))
    const bar = mk(keep(new THREE.PlaneGeometry(1, 0.065).translate(0.5, 0, 0)), fillMat, -0.65, 0, 0.002)
    bar.scale.x = 0.001
    g.add(bar)
    const t = text(label, { font: 'body', size: 0.07, color: '#e6ecff', anchorX: 'left', anchorY: 'middle', maxWidth: 0.9 })
    t.position.set(-1.58, 0, 0.003)
    g.add(t)
    model.add(g)
    return { g, bar, fillMat }
  }
  const pushGauge = gauge(0.32, '#ff8a5a', E.fault.gauge.push)
  const radonGauge = gauge(0.13, RN, E.fault.gauge.radon)
  pushGauge.g.add(mk(keep(new THREE.PlaneGeometry(0.02, 0.13)), keep(new THREE.MeshBasicMaterial({ color: '#ffffff' })), 1.35, 0, 0.004))
  {
    const t = text(E.fault.gauge.limit, { font: 'body', size: 0.06, color: '#ffffff', anchorX: 'left', anchorY: 'middle', maxWidth: 0.35 })
    t.position.set(1.38, 0.0, 0.004)
    pushGauge.g.add(t)
  }
  // small cracks near the fault, opening as the stress grows
  const cracks = [
    [0.36, -0.13], [0.5, 0.15], [0.6, -0.22], [0.72, 0.1], [0.84, -0.12], [0.92, 0.23], [1.02, -0.18], [1.12, 0.13], [0.55, 0.3], [0.44, -0.3],
  ].map(([y, dx], i) => {
    const r = random(31 + i)
    const pts = [[mxf(y) + dx, y]]
    for (let k = 0; k < 4; k++) {
      const [px, py] = pts[pts.length - 1]
      pts.push([px + (r() - 0.5) * 0.06 + fdir.x * 0.03, py + 0.035 + r() * 0.03])
    }
    const mat = keep(new THREE.MeshBasicMaterial({ color: hdr('#ffd08a', 1.7), transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }))
    const m = mk(keep(ribbon(pts, 0.016)), mat, 0, MB, MD / 2 + 0.008)
    m.visible = false
    model.add(m)
    return { m, mat, at: 0.28 + i * 0.065, k: 0, ph: r() * 9 }
  })
  // radon leaking up the fault zone and out at the top
  const LEAK_N = light ? 18 : 32
  const leak = radonAtoms(LEAK_N, 0.03, 0.15)
  model.add(leak.group)
  const leakers = Array.from({ length: LEAK_N }, () => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, out: 0, j: 0 }))
  model.add(hitBox(MW + 0.1, MH + 0.2, MD + 0.3, 0, MB + MH / 2, 0.05))

  let stress = 0
  let slips = 0
  let acc = 0 // the accumulated slip as shown
  let bendShown = 0
  let leakRate = 0.15
  let shakeT = 0
  let joltAge = 9
  let crackSaid = false
  let mineFault = false
  let spawnAcc = 0
  const faultPanel = lv => ({
    title: E.fault.title,
    color: RED,
    blocks: [
      ...paras(E.fault.panel[depth(lv)]),
      { p: E.fault.tip },
      {
        slider: {
          label: E.fault.push,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(stress * 100),
          onInput: v => setStress(v / 100),
          format: v => `${Math.round(v)} %`,
          live: () => Math.round(stress * 100),
        },
      },
      { buttons: [{ label: E.fault.buttons.push, onClick: () => push() }, { label: E.fault.buttons.limit, onClick: () => setStress(1) }] },
    ],
  })
  let faultSending = false
  const faultSoon = () => {
    if (faultSending) return
    faultSending = true
    later(0.2, () => {
      faultSending = false
      share('fault')
    })
  }
  /** The blocks slip: the stored bend becomes offset at once, the room jolts (live: someone has just done it). */
  function jolt(mine) {
    slips++
    stress = 0
    shakeT = 0.9
    joltAge = 0
    crackSaid = false
    play('bang')
    if (mine) {
      say(at(slips === 1 ? E.fault.says.slip : E.fault.says.again, level()))
      ex.discover('fault', faultPanel, 2.4)
    }
  }
  /** A visitor sets how hard the blocks press (the slider, the arrows, the buttons). */
  function setStress(v) {
    const before = stress
    stress = clamp(v)
    mineFault = true
    if (stress > before + 0.001 && before < 0.01 && slips === 0) say(at(E.fault.says.push, level()))
    if (stress >= 1) {
      jolt(true)
      share('fault')
      return
    }
    faultSoon()
  }
  function push() {
    play('tap')
    setStress(stress + PUSH_STEP + 1e-6)
  }
  clickable(model, () => push(), { reach: 6.5 })
  ex.add({
    id: 'fault',
    x: -4.6,
    z: 0.6,
    radius: 2.6,
    manual: true,
    label: E.fault.label,
    verb: () => (slips === 0 && stress < 0.01 ? E.fault.verbs.first : stress > 0.01 ? E.fault.verbs.more : E.fault.verbs.again),
    focus: { x: MODEL.x, y: 1.15, z: MODEL.z, size: 2.3, width: 3.7 },
    act: () => ctx.showPanel(faultPanel),
  })
  updates.push((dt, t) => {
    joltAge += dt
    // the layers: the bend follows the push, the slip snaps in with a little ringing
    acc = damp(acc, slips * BEND, 22, dt)
    bendShown = damp(bendShown, stress * BEND, joltAge < 0.4 ? 22 : 6, dt)
    const ring = joltAge < 0.8 ? 0.012 * Math.sin(joltAge * 42) * Math.exp(-joltAge * 6) : 0
    blocks.forEach(b => b.set(acc + ring, bendShown))
    // the arrows glow and lean in with the push
    arrowMat.emissiveIntensity = 0.45 + stress * 0.9 + (stress > 0.7 ? 0.25 * Math.sin(t * 9) : 0)
    for (const a of arrows) {
      const k = stress * 0.035 * a.up
      a.m.position.set(a.x + fdir.x * k, MB + a.y + fdir.y * k, MD / 2 + 0.05)
    }
    // the cracks
    for (const c of cracks) {
      c.k = damp(c.k, stress > c.at ? 1 : 0, stress > c.at ? 5 : 9, dt)
      c.m.visible = c.k > 0.02
      c.mat.opacity = c.k * (0.75 + 0.25 * Math.sin(t * 7 + c.ph))
    }
    if (mineFault && !crackSaid && stress > 0.55) {
      crackSaid = true
      if (slips === 0) say(at(E.fault.says.cracks, level()))
    }
    // the leak: more radon the harder it presses, back to its background after a slip
    leakRate = damp(leakRate, 0.15 + 0.85 * stress, 1.5, dt)
    spawnAcc += dt * (0.6 + 5.5 * leakRate)
    while (spawnAcc > 1) {
      spawnAcc -= 1
      const p = leakers.find(l => !l.on)
      if (!p) break
      const lit = cracks.filter(c => c.k > 0.5)
      p.on = true
      p.life = 0
      p.out = 0
      p.j = Math.random()
      if (lit.length && Math.random() < 0.5) {
        const c = lit[Math.floor(Math.random() * lit.length)]
        const pos = c.m.geometry.attributes.position
        p.x = pos.getX(0)
        p.y = pos.getY(0)
      } else {
        p.y = 0.05 + Math.random() * 0.45
        p.x = mxf(p.y) + (Math.random() - 0.5) * (0.06 + 0.25 * stress)
      }
      p.vy = 0.16 + 0.14 * leakRate + Math.random() * 0.05
    }
    let n = 0
    for (const p of leakers) {
      if (!p.on) {
        leak.set(n++, 0, -9, 0, 0)
        continue
      }
      p.life += dt
      if (p.y < MH) {
        // up the fault zone, drawn to the fault line
        p.y += p.vy * dt
        const goal = mxf(p.y) + (p.j - 0.5) * 0.05
        p.x = damp(p.x, goal, 1.6, dt) + ((FT - FB) / MH) * p.vy * dt
      } else {
        // out of the ground and up into the air, fading
        p.out += dt
        p.y += 0.22 * dt
        p.x += (p.j - 0.5) * 0.12 * dt
      }
      const a = Math.min(1, p.life * 4) * clamp(1 - p.out / 1.6)
      if (p.out > 1.6) p.on = false
      leak.set(n++, p.x, MB + p.y, MD / 2 + 0.05, a)
    }
    leak.done()
    // the gauges
    pushGauge.bar.scale.x = Math.max(0.001, stress * 2.0)
    pushGauge.fillMat.color.set(stress > 0.8 ? '#ff5a4a' : '#ff8a5a').multiplyScalar(1.1)
    radonGauge.bar.scale.x = Math.max(0.001, leakRate * 2.0)
    // the jolt: the whole place shakes for a moment
    if (shakeT > 0) {
      shakeT = Math.max(0, shakeT - dt)
      const a = 0.05 * (shakeT / 0.9)
      root.position.set(Math.sin(t * 53) * a, Math.sin(t * 71) * a * 0.4, Math.cos(t * 61) * a)
    } else if (root.position.lengthSq() > 0) root.position.set(0, 0, 0)
  })
  const faultState = () => ({ s: Math.round(stress * 100) / 100, n: slips })
  const faultSet = (s, liveSet) => {
    const n = Math.max(0, Math.floor(Number(s?.n) || 0))
    const v = clamp(Number(s?.s) || 0)
    mineFault = false
    if (liveSet && n === slips + 1) {
      jolt(false)
    } else if (n !== slips) {
      slips = n
      acc = n * BEND
    }
    slips = n
    stress = v
    if (!liveSet) bendShown = v * BEND
    crackSaid = stress > 0.55
  }

  // ================= station 2: the well's record =================
  let recOn = false
  let rec = 'kobe'
  let tRec = 0
  let running = false
  let seen = []
  let mineRec = false
  let saidPeak = false
  let saidQuake = false
  let allSaid = false
  const PEAK_T = PEAK_DAY / KOBE_DAYS
  const QUAKE_T = QUAKE_DAY / KOBE_DAYS
  const daysOf = r => (r === 'kobe' ? KOBE_DAYS : EX_DAYS)
  const dateFmt = new Intl.DateTimeFormat(LOCALE[lang] ?? 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  const monthFmt = new Intl.DateTimeFormat(LOCALE[lang] ?? 'en-GB', { month: 'short', timeZone: 'UTC' })
  const dateOf = day => dateFmt.format(new Date(D0 + Math.round(day) * 864e5))
  const timeLabel = (r, t) => (r === 'kobe' ? dateOf(t * KOBE_DAYS) : fill(E.record.week, { n: Math.min(8, 1 + Math.floor((t * EX_DAYS) / 7)) }))

  // the hut with its antenna, the well head, the cable
  const hut = new THREE.Group()
  hut.position.set(HUT.x, 0, HUT.z)
  hut.rotation.y = HUT.rot
  root.add(hut)
  {
    const wallsMat = std('#b8b2a6', { roughness: 0.8 })
    hut.add(mk(keep(new THREE.BoxGeometry(2.0, 2.1, 1.7)), wallsMat, 0, 1.05, 0))
    const roofShape = new THREE.Shape()
    roofShape.moveTo(-1.25, 0)
    roofShape.lineTo(1.25, 0)
    roofShape.lineTo(0, 0.62)
    roofShape.closePath()
    const roof = mk(keep(new THREE.ExtrudeGeometry(roofShape, { depth: 2.0, bevelEnabled: false })), std('#4a5a6a', { roughness: 0.6, flatShading: true }), 0, 2.1, -1.0)
    hut.add(roof)
    hut.add(mk(keep(new THREE.PlaneGeometry(0.7, 1.55)), std('#5a4a3a'), -0.3, 0.78, 0.852))
    const winMat = keep(new THREE.MeshBasicMaterial({ color: hdr('#ffe2a0', 1.0) }))
    hut.add(mk(keep(new THREE.PlaneGeometry(0.45, 0.35)), winMat, 0.55, 1.35, 0.852))
    // a lamp over the door
    hut.add(mk(keep(new THREE.SphereGeometry(0.07, 10, 8)), keep(new THREE.MeshBasicMaterial({ color: hdr('#ffd9a0', 1.6), toneMapped: false })), -0.3, 1.78, 0.9))
    const lamp = new THREE.PointLight('#ffcf8a', light ? 1.2 : 1.8, 7, 1.6)
    lamp.position.set(-0.3, 2.0, 2.6)
    hut.add(lamp)
    // the antenna mast at the back corner, its red light, radio waves toward the screen
    hut.add(mk(keep(new THREE.CylinderGeometry(0.035, 0.045, 3.4, 8)), M.steel, 0.82, 2.1 + 1.7, -0.6))
    hut.add(mk(keep(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 6)), M.steel, 0.82, 5.5, -0.6))
  }
  const beacon = new THREE.MeshBasicMaterial({ color: hdr('#ff5a4a', 2.2), toneMapped: false })
  keep(beacon)
  const beaconBall = mk(keep(new THREE.SphereGeometry(0.07, 10, 8)), beacon, 0.82, 5.92, -0.6)
  hut.add(beaconBall)
  const beaconGlow = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: soft, color: '#ff6a5a', transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending })))
  beaconGlow.scale.setScalar(0.6)
  beaconGlow.position.set(0.82, 5.92, -0.6)
  beaconGlow.raycast = () => {}
  hut.add(beaconGlow)
  const waveMat = keep(new THREE.MeshBasicMaterial({ color: hdr(color, 1.4), transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }))
  const waves = [0.28, 0.5, 0.72].map(r => {
    const w = mk(keep(new THREE.TorusGeometry(r, 0.022, 6, 24, 1.5)), waveMat.clone(), 0.82, 5.6, -0.6)
    keep(w.material)
    // facing the screen (to the hut's left), the arc's middle on its axis
    w.rotation.set(0, Math.PI / 2 + 0.5, 0.75 * Math.PI)
    w.raycast = () => {}
    hut.add(w)
    return w
  })
  solids.push(box(HUT.x, HUT.z, 2.2, 1.9, { rot: HUT.rot }))
  const well = new THREE.Group()
  well.position.set(WELL.x, 0, WELL.z)
  well.add(mk(keep(new THREE.CylinderGeometry(0.42, 0.46, 0.08, 20)), M.concrete, 0, 0.04, 0))
  well.add(mk(keep(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 14)), M.steel, 0, 0.43, 0))
  well.add(mk(keep(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 14)), M.metal, 0, 0.8, 0))
  well.add(mk(keep(new RoundedBoxGeometry(0.14, 0.1, 0.1, 2, 0.02)), M.metal, 0.12, 0.88, 0))
  well.add(hitBox(0.7, 1.1, 0.7, 0, 0.55, 0))
  root.add(well)
  solids.push(circle(WELL.x, WELL.z, 0.42))
  {
    const hp = worldOf(hut, 1.0, 0.1, 0.35)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(WELL.x + 0.15, 0.86, WELL.z),
      new THREE.Vector3(WELL.x + 0.35, 0.3, WELL.z + 0.05),
      new THREE.Vector3(WELL.x + 0.55, 0.03, WELL.z - 0.1),
      new THREE.Vector3((WELL.x + hp.x) / 2 + 0.2, 0.03, (WELL.z + hp.z) / 2),
      new THREE.Vector3(hp.x, 0.1, hp.z),
    ])
    root.add(mk(keep(new THREE.TubeGeometry(curve, 30, 0.018, 6)), M.metal))
  }

  // the screen on two posts: the record drawn on a canvas
  const scr = new THREE.Group()
  scr.position.set(SCREEN.x, 0, SCREEN.z)
  scr.rotation.y = SCREEN.rot
  root.add(scr)
  const SW = 2.04
  const SH = 1.2
  const SY = 1.62
  const scrEdge = keep(new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.0, roughness: 0.4 }))
  scr.add(mk(keep(new RoundedBoxGeometry(SW + 0.12, SH + 0.12, 0.06, 2, 0.03)), scrEdge, 0, SY, 0))
  scr.add(mk(keep(new RoundedBoxGeometry(SW + 0.02, SH + 0.02, 0.08, 2, 0.02)), M.navy, 0, SY, 0.005))
  for (const sx of [-1, 1]) scr.add(mk(keep(new THREE.BoxGeometry(0.08, SY + SH / 2, 0.08)), M.metal, sx * (SW / 2 + 0.02), (SY + SH / 2) / 2, -0.07))
  const CW = 1020
  const CH = 600
  const chartTex = keep(canvasTex(CW, CH, null, { mipmaps: false }))
  scr.add(mk(keep(new THREE.PlaneGeometry(SW, SH)), keep(new THREE.MeshBasicMaterial({ map: chartTex, toneMapped: false })), 0, SY, 0.047))
  solids.push(circle(SCREEN.x - SW / 2, SCREEN.z, 0.15), circle(SCREEN.x + SW / 2, SCREEN.z, 0.15))
  const font = (w, s) => `${w} ${s}px Outfit, Nunito, sans-serif`
  let drawnKey = ''
  const drawChart = () => {
    const key = `${recOn}|${rec}|${tRec.toFixed(3)}|${lang}`
    if (key === drawnKey) return
    drawnKey = key
    chartTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0a1024'
      g.fillRect(0, 0, w, h)
      if (!recOn) {
        g.fillStyle = 'rgba(120,200,220,0.5)'
        g.font = font(600, 40)
        g.textAlign = 'center'
        g.fillText(E.record.screen.off, w / 2, h / 2 + 12)
        return
      }
      const kobe = rec === 'kobe'
      const days = daysOf(rec)
      const words = E.record.screen[rec]
      const c = REC_COLOR[rec]
      g.textAlign = 'left'
      g.fillStyle = '#ffffff'
      g.font = font(700, 40)
      g.fillText(words.title, 36, 56)
      g.fillStyle = '#b9c6f0'
      g.font = font(500, 27)
      g.fillText(words.line, 36, 96)
      if (!kobe) {
        g.textAlign = 'right'
        g.fillStyle = '#ffc46a'
        g.font = font(700, 26)
        g.fillText(E.record.screen.example, w - 30, 56)
      }
      const X0 = 104
      const X1 = w - 36
      const YT = 150
      const YB = h - 92
      const yMax = kobe ? 12 : 3
      const xOf = d => X0 + ((X1 - X0) * d) / days
      const yOf = v => YB - ((YB - YT) * v) / yMax
      // the grid and its marks: times the first level
      g.strokeStyle = 'rgba(140,170,255,0.18)'
      g.lineWidth = 2
      g.fillStyle = '#9fb0e8'
      g.font = font(600, 24)
      g.textAlign = 'right'
      for (const v of kobe ? [1, 4, 10] : [1, 2]) {
        g.beginPath()
        g.moveTo(X0, yOf(v))
        g.lineTo(X1, yOf(v))
        g.stroke()
        g.fillText(`×${v}`, X0 - 12, yOf(v) + 8)
      }
      g.strokeStyle = 'rgba(200,215,255,0.5)'
      g.beginPath()
      g.moveTo(X0, YT - 10)
      g.lineTo(X0, YB)
      g.lineTo(X1, YB)
      g.stroke()
      g.textAlign = 'left'
      g.font = font(500, 21)
      g.fillStyle = '#8ea0d8'
      g.fillText(E.record.screen.times, X0 + 8, YT - 16)
      // the time axis
      g.font = font(600, 22)
      g.fillStyle = '#9fb0e8'
      g.textAlign = 'center'
      if (kobe) {
        for (const [d, year] of [[7, '1994'], [37, null], [68, '1995'], [99, null]]) {
          g.fillRect(xOf(d) - 1, YB, 2, 10)
          g.fillText(monthFmt.format(new Date(D0 + d * 864e5)), xOf(d) + 34, YB + 32)
          if (year) g.fillText(year, xOf(d) + 34, YB + 60)
        }
      } else {
        for (let k = 0; k <= 8; k++) g.fillRect(xOf(k * 7) - 1, YB, 2, 10)
        for (let k = 0; k < 8; k++) g.fillText(String(k + 1), xOf(k * 7 + 3.5), YB + 32)
        g.fillText(E.record.screen.week, (X0 + X1) / 2, YB + 60)
      }
      const dNow = tRec * days
      // what else the record shows: rain, air pressure, an earthquake
      if (rec === 'rain') {
        g.fillStyle = 'rgba(120,160,255,0.75)'
        for (let d = 0; d <= Math.min(days, dNow); d++) {
          const r = rainAt(d)
          if (r) g.fillRect(xOf(d) - 6, YB - r * 70, 12, r * 70)
        }
        if (dNow > 15) {
          g.fillStyle = '#9fbaff'
          g.font = font(600, 22)
          g.fillText(E.record.screen.rainWord, xOf(17), YB - 82)
        }
      }
      if (rec === 'air') {
        g.strokeStyle = 'rgba(190,200,230,0.75)'
        g.setLineDash([10, 8])
        g.lineWidth = 3
        g.beginPath()
        for (let d = 0; d <= Math.min(days, dNow); d += 0.5) {
          const y = yOf(2.55 + 0.3 * pressureAt(d))
          if (d === 0) g.moveTo(xOf(d), y)
          else g.lineTo(xOf(d), y)
        }
        g.stroke()
        g.setLineDash([])
        g.textAlign = 'right'
        g.fillStyle = '#c8d0ea'
        g.font = font(600, 22)
        g.fillText(E.record.screen.pressure, X1 - 6, yOf(2.98))
        g.textAlign = 'left'
        g.fillStyle = c
        g.fillText(E.record.screen.radon, X0 + 10, yOf(0.35))
        g.textAlign = 'center'
      }
      const quakeDay = kobe ? QUAKE_DAY : rec === 'quiet' ? EX_QUAKE : -1
      if (quakeDay >= 0 && dNow >= quakeDay) {
        const x = xOf(quakeDay)
        g.strokeStyle = 'rgba(255,106,90,0.9)'
        g.setLineDash([9, 8])
        g.lineWidth = 3
        g.beginPath()
        g.moveTo(x, YT - 6)
        g.lineTo(x, YB)
        g.stroke()
        g.setLineDash([])
        // a seismograph's trace along the bottom
        g.strokeStyle = RED
        g.lineWidth = 2.5
        g.beginPath()
        for (let k = 0; k <= 30; k++) {
          const xx = x - 2 + k * 3
          const amp = 30 * Math.exp(-k / 10) * (k % 2 ? 1 : -1)
          if (k === 0) g.moveTo(xx, YB - 34)
          else g.lineTo(xx, YB - 34 + amp)
        }
        g.stroke()
        // its words beside the line, on two lines (the date, then what happened)
        g.fillStyle = '#ffb0a6'
        g.font = font(700, 21)
        g.textAlign = 'left'
        const qw = (kobe ? E.record.screen.quake : E.record.screen.quakeShort).split(": ")
        qw.forEach((s, i) => g.fillText(s, x + 10, YT + 70 + i * 26))
      }
      // the radon trace, glowing, to now
      const pts = []
      for (let d = 0; d <= dNow + 1e-6; d += 0.5) pts.push([xOf(d), yOf(recordAt(rec, d))])
      if (pts.length) {
        const path = () => {
          g.beginPath()
          pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
        }
        g.lineJoin = 'round'
        g.lineCap = 'round'
        g.strokeStyle = c
        g.globalAlpha = 0.28
        g.lineWidth = 14
        path()
        g.stroke()
        g.globalAlpha = 1
        g.strokeStyle = '#d8fbff'
        g.lineWidth = 4.5
        path()
        g.stroke()
        const [hx, hy] = pts[pts.length - 1]
        g.fillStyle = '#ffffff'
        g.beginPath()
        g.arc(hx, hy, 7, 0, TAU)
        g.fill()
      }
      if (kobe && dNow >= PEAK_DAY) {
        const x = xOf(PEAK_DAY)
        const y = yOf(recordAt('kobe', PEAK_DAY))
        g.fillStyle = RN_HALO
        g.beginPath()
        g.arc(x, y, 10, 0, TAU)
        g.fill()
        g.font = font(700, 24)
        g.textAlign = 'right'
        g.fillText(E.record.screen.peak, x - 16, y + 8)
      }
      // where the record has got to
      g.textAlign = 'right'
      g.fillStyle = '#ffffff'
      g.font = font(700, 26)
      g.fillText(timeLabel(rec, tRec), X1, 96)
    })
  }
  drawChart()

  // the folders: four records on a low desk in front of the screen, below its lower edge as the visitor sees it
  const rack = new THREE.Group()
  rack.position.set(RACK.x, 0, RACK.z)
  rack.rotation.y = RACK.rot
  root.add(rack)
  for (const sx of [-0.78, 0.78]) rack.add(mk(keep(new THREE.BoxGeometry(0.06, 0.78, 0.3)), M.metal, sx, 0.39, -0.02))
  const desk = new THREE.Group()
  desk.position.set(0, 0.84, 0)
  desk.rotation.x = -0.55
  rack.add(desk)
  desk.add(mk(keep(new RoundedBoxGeometry(1.74, 0.42, 0.04, 2, 0.015)), M.wood, 0, 0, 0))
  solids.push(box(RACK.x, RACK.z, 1.8, 0.5, { rot: RACK.rot }))
  const folders = {}
  RECS.forEach((id, i) => {
    const g = new THREE.Group()
    g.position.set(-0.615 + i * 0.41, -0.01, 0.03)
    const mat = keep(new THREE.MeshStandardMaterial({ color: REC_COLOR[id], roughness: 0.6, emissive: REC_COLOR[id], emissiveIntensity: 0.06 }))
    g.add(mk(keep(new RoundedBoxGeometry(0.38, 0.3, 0.02, 2, 0.01)), mat, 0, 0, 0))
    g.add(mk(keep(new THREE.BoxGeometry(0.13, 0.045, 0.02)), mat, -0.1, 0.165, 0))
    const t = text(E.record.folders[id], { size: 0.048, color: '#10142c', maxWidth: 0.34, anchorY: 'middle', lineHeight: 1.05 })
    t.position.set(0, 0, 0.012)
    g.add(t)
    desk.add(g)
    folders[id] = { g, mat, k: 0 }
    clickable(g, () => tapFolder(id), { reach: 7 })
  })

  const recPanel = lv => ({
    title: E.record.title,
    color: RN,
    blocks: [
      ...paras(E.record.panel[depth(lv)]),
      { p: E.record.tip },
      {
        slider: {
          label: E.record.time,
          min: 0,
          max: 1000,
          step: 1,
          value: Math.round(tRec * 1000),
          onInput: v => slideRec(v / 1000),
          format: v => timeLabel(rec, v / 1000),
          live: () => Math.round(tRec * 1000),
        },
      },
      {
        buttons: [
          { label: E.record.buttons.play, onClick: () => tapHut() },
          ...EXAMPLES.map(id => ({ label: E.record.folders[id], onClick: () => tapFolder(id) })),
        ],
      },
    ],
  })
  let recSending = false
  const recSoon = () => {
    if (recSending) return
    recSending = true
    later(0.25, () => {
      recSending = false
      share('record')
    })
  }
  /** Start a record from its beginning (the hut and the screen play Kobe again; a folder its own record). */
  function startRecord(id) {
    recOn = true
    rec = id
    tRec = 0
    running = true
    mineRec = true
    saidPeak = false
    saidQuake = false
  }
  /** The hut and the well play the Kobe record from its start; the screen plays again what it shows. */
  function tapHut(id = 'kobe') {
    play('select')
    startRecord(id)
    say(at(id === 'kobe' ? E.record.says.on : E.record.says[id], level()))
    share('record')
  }
  function tapFolder(id) {
    play('select')
    startRecord(id)
    if (id === 'kobe') say(at(E.record.says.on, level()))
    else {
      say(at(E.record.says[id], level()))
      const fresh = !seen.includes(id)
      if (fresh) seen = [...seen, id].sort()
      if (fresh && seen.length === EXAMPLES.length && !allSaid) {
        allSaid = true
        later(6, () => say(at(E.record.says.all, level())))
      }
      ex.discover('record', recPanel, 3.5)
    }
    share('record')
  }
  function slideRec(v) {
    if (!recOn) startRecord('kobe')
    tRec = clamp(v)
    running = false
    mineRec = true
    recSoon()
  }
  clickable(hut, () => tapHut(), { reach: 8 })
  clickable(well, () => tapHut(), { reach: 7 })
  clickable(scr, () => tapHut(recOn ? rec : 'kobe'), { reach: 8 })
  ex.add({
    id: 'record',
    x: 6.2,
    z: 1.0,
    radius: 2.6,
    manual: true,
    label: E.record.label,
    verb: () => (!recOn ? E.record.verbs.hut : E.record.verbs.folder),
    focus: { x: 6.4, y: 1.35, z: -2.9, size: 3.2, width: 4.6 },
    act: () => ctx.showPanel(recPanel),
  })
  updates.push((dt, t) => {
    if (running) {
      const before = tRec
      tRec = Math.min(1, tRec + dt * SPEED[rec])
      if (tRec >= 1) running = false
      if (mineRec && rec === 'kobe') {
        if (!saidPeak && before < PEAK_T && tRec >= PEAK_T) {
          saidPeak = true
          say(at(E.record.says.peak, level()))
        }
        if (!saidQuake && before < QUAKE_T && tRec >= QUAKE_T) {
          saidQuake = true
          say(at(E.record.says.quake, level()))
          ex.discover('record', recPanel, 3.0)
        }
      }
    } else if (mineRec && rec === 'kobe' && recOn) {
      // dragged past them by hand
      if (!saidPeak && tRec >= PEAK_T && tRec < QUAKE_T) {
        saidPeak = true
        say(at(E.record.says.peak, level()))
      }
      if (!saidQuake && tRec >= QUAKE_T) {
        saidQuake = true
        say(at(E.record.says.quake, level()))
        ex.discover('record', recPanel, 3.0)
      }
    }
    drawChart()
    // the radio waves pulse while the record plays; the beacon blinks
    waves.forEach((w, i) => {
      const u = (t * 0.9 - i * 0.22) % 1
      w.material.opacity = running ? 0.85 * Math.sin(Math.max(0, u) * Math.PI) : 0
    })
    const blink = 0.5 + 0.5 * Math.sin(t * 2.4)
    beacon.color.set('#ff5a4a').multiplyScalar(0.8 + 1.6 * blink)
    beaconGlow.material.opacity = 0.25 + 0.45 * blink
    // the folder of the record on show stands out
    for (const id of RECS) {
      const f = folders[id]
      f.k = damp(f.k, recOn && rec === id ? 1 : 0, 8, dt)
      f.g.position.z = 0.03 + f.k * 0.07
      f.mat.emissiveIntensity = 0.06 + f.k * 0.08
    }
    scrEdge.emissiveIntensity = recOn ? 1.0 : 0.6 + 0.3 * Math.sin(t * 2.2)
  })
  const recState = () => ({ on: recOn ? 1 : 0, rec, t: Math.round(tRec * 1000) / 1000, run: running ? 1 : 0, seen: [...seen] })
  const recSet = (s, liveSet, ago = 0) => {
    recOn = !!s?.on
    rec = RECS.includes(s?.rec) ? s.rec : 'kobe'
    seen = (Array.isArray(s?.seen) ? s.seen : []).filter(id => EXAMPLES.includes(id)).sort()
    let v = clamp(Number(s?.t) || 0)
    if (s?.run) v = Math.min(1, v + Math.max(0, Number(ago) || 0) * SPEED[rec])
    tRec = v
    running = !!s?.run && v < 1
    mineRec = false
    if (seen.length === EXAMPLES.length) allSaid = true
  }

  // ================= station 3: finding the fault =================
  const xOfPos = j => POS0 + j * POS_STEP
  const line = new THREE.Group()
  root.add(line)
  {
    // the tape along the line, the marked spots (every second position)
    const tapeMat = keep(new THREE.MeshStandardMaterial({ color: '#e8c23a', roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -3 }))
    const tape = mk(keep(new THREE.PlaneGeometry(xOfPos(NPOS - 1) - xOfPos(0) + 0.8, 0.03)), tapeMat, (xOfPos(0) + xOfPos(NPOS - 1)) / 2, 0.012, LINE_Z + 0.16)
    tape.rotation.x = -Math.PI / 2
    line.add(tape)
    for (let i = 0; i < 7; i++) {
      const x = xOfPos(i * 2)
      const peg = new THREE.Group()
      peg.position.set(x, 0, LINE_Z)
      peg.add(mk(keep(new THREE.BoxGeometry(0.035, 0.42, 0.035)), M.white, 0, 0.21, 0))
      peg.add(mk(keep(new THREE.BoxGeometry(0.05, 0.06, 0.05)), M.tape, 0, 0.38, 0))
      const plate = mk(keep(new RoundedBoxGeometry(0.15, 0.11, 0.02, 2, 0.01)), M.navy, 0, 0.26, 0.03)
      peg.add(plate)
      const n = text(String(i + 1), { size: 0.075, color: '#ffd166', anchorY: 'middle' })
      n.position.set(0, 0.26, 0.045)
      peg.add(n)
      line.add(peg)
    }
    line.add(hitBox(xOfPos(NPOS - 1) - xOfPos(0) + 0.9, 0.6, 1.0, (xOfPos(0) + xOfPos(NPOS - 1)) / 2, 0.3, LINE_Z))
  }
  // the probe: a steel spike with a T-handle, a hose to the meter on its little tripod
  const rig = new THREE.Group()
  root.add(rig)
  const rod = new THREE.Group()
  rig.add(rod)
  rod.add(mk(keep(new THREE.CylinderGeometry(0.014, 0.01, 1.2, 8)), M.steel, 0, 0.6, 0))
  {
    const tbar = mk(keep(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 8)), M.metal, 0, 1.2, 0)
    tbar.rotation.z = Math.PI / 2
    rod.add(tbar)
    rod.add(mk(keep(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 10)), M.tape, 0, 0.98, 0))
  }
  const meter = new THREE.Group()
  meter.position.set(0.12, 0, 0.36)
  rig.add(meter)
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * TAU
    const leg = mk(keep(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 5)), M.metal, Math.cos(a) * 0.09, 0.25, Math.sin(a) * 0.09)
    leg.rotation.set(Math.sin(a) * 0.32, 0, -Math.cos(a) * 0.32)
    meter.add(leg)
  }
  meter.add(mk(keep(new RoundedBoxGeometry(0.28, 0.17, 0.1, 2, 0.02)), std('#e8b13a', { roughness: 0.5 }), 0, 0.58, 0))
  meter.add(mk(keep(new THREE.PlaneGeometry(0.22, 0.09)), keep(new THREE.MeshBasicMaterial({ color: '#0b1a12' })), 0, 0.6, 0.052))
  const meterText = text('', { size: 0.042, color: '#8dffb4', anchorY: 'middle', maxWidth: 0.22 })
  meterText.position.set(0, 0.6, 0.056)
  meter.add(meterText)
  const hose = mk(keep(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.95, 0), new THREE.Vector3(0.05, 0.75, 0.15), new THREE.Vector3(0.1, 0.62, 0.3)]), 12, 0.009, 5)), M.metal)
  rig.add(hose)
  // the readings: a teal bar over every spot measured, its number on top
  const barGeo = keep(new THREE.CylinderGeometry(0.045, 0.045, 1, 12).translate(0, 0.5, 0))
  const bars = Array.from({ length: NPOS }, (_, j) => {
    const v = readingAt(j)
    const mat = keep(new THREE.MeshBasicMaterial({ color: hdr(RN, v >= HIGH ? 1.5 : 0.8), toneMapped: false }))
    const m = mk(barGeo, mat, xOfPos(j), 0, LINE_Z - 0.3)
    m.visible = false
    m.raycast = () => {}
    root.add(m)
    const label = text(String(v), { size: 0.085, color: v >= HIGH ? '#bff8ff' : '#9fd6e0', anchorY: 'bottom', outlineWidth: 0.008, outlineColor: '#0a1024' })
    label.visible = false
    root.add(label)
    return { m, label, v, h: 0.08 + (1.15 * (v - 5)) / 40, k: 0 }
  })
  // the map: the field from above, the trench, the line, and the fault once found
  const mapG = new THREE.Group()
  mapG.position.set(MAP.x, 0, MAP.z)
  root.add(mapG)
  mapG.add(mk(keep(new THREE.BoxGeometry(0.07, 0.72, 0.07)), M.metal, 0, 0.36, -0.06))
  const mapBoard = new THREE.Group()
  mapBoard.position.set(0, 0.86, 0)
  mapBoard.rotation.x = -0.5
  mapG.add(mapBoard)
  const mapEdge = keep(new THREE.MeshStandardMaterial({ color: RN, emissive: RN, emissiveIntensity: 0.9, roughness: 0.4 }))
  mapBoard.add(mk(keep(new RoundedBoxGeometry(1.48, 0.97, 0.05, 2, 0.02)), mapEdge, 0, 0, 0))
  const MPW = 816
  const MPH = 528
  const mapTex = keep(canvasTex(MPW, MPH, null, { mipmaps: false }))
  mapBoard.add(mk(keep(new THREE.PlaneGeometry(1.4, 0.906)), keep(new THREE.MeshBasicMaterial({ map: mapTex, toneMapped: false })), 0, 0, 0.027))
  solids.push(circle(MAP.x, MAP.z, 0.3))
  // flags along the fault's hidden line, once it is found
  const flagMat = std('#e8453a', { side: THREE.DoubleSide, emissive: '#5a0a06', emissiveIntensity: 0.6 })
  const flagZs = [-5.4, -3.6, -1.8, 6.4, 8.2, 10.0, 11.6] // none between the probe line and its visitor
  const flags = flagZs.map((z, i) => {
    const g = new THREE.Group()
    g.position.set(faultX(z), 0, z)
    g.add(mk(keep(new THREE.CylinderGeometry(0.006, 0.006, 0.7, 4)), M.steel, 0, 0.35, 0))
    const f = mk(keep(new THREE.PlaneGeometry(0.17, 0.11).translate(0.085, 0, 0)), flagMat, 0, 0.63, 0)
    f.rotation.y = 0.4
    g.add(f)
    g.visible = false
    g.scale.setScalar(0.001)
    root.add(g)
    return { g, f, k: 0, at: i * 0.18 }
  })

  let measured = new Set()
  let cur = -1
  let shown = new Set() // bars already shown (the probe has been there)
  const queue = []
  let mineProbe = false
  let saidLow = false
  let revealK = 0
  let revealT = 0
  const PARK = POS0 - 0.6
  const rigS = { x: PARK, depth: 0, phase: 'idle', t: 0, from: PARK, to: PARK, j: -1, fast: false }
  const found = () => measured.size >= 5 && [...measured].some(j => readingAt(j) >= HIGH)
  const allShown = () => [...measured].every(j => shown.has(j))
  let mapKey = ''
  const drawMap = () => {
    const vis = [...shown].sort((a, b) => a - b)
    const key = `${vis.join(',')}|${revealK > 0.5}|${lang}`
    if (key === mapKey) return
    mapKey = key
    mapTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0a1024'
      g.fillRect(0, 0, w, h)
      g.textAlign = 'left'
      g.fillStyle = '#ffffff'
      g.font = font(700, 34)
      g.fillText(E.probe.map.title, 26, 46)
      g.fillStyle = '#b9c6f0'
      g.font = font(500, 24)
      g.fillText(fill(E.probe.map.count, { n: Math.min(5, measured.size) }), 26, 80)
      // the field seen from above, north up: x -8..10, z -11..7
      const mx = x => 40 + ((x + 7) / 17) * (w - 80)
      const mz = z => 104 + ((z + 10.5) / 16.5) * (h - 130)
      g.strokeStyle = 'rgba(160,190,255,0.25)'
      g.lineWidth = 2
      g.strokeRect(mx(-7), mz(-10.5), mx(10) - mx(-7), mz(6) - mz(-10.5))
      // the trench, the fault seen in it
      g.fillStyle = 'rgba(150,110,70,0.75)'
      g.fillRect(mx(TR.x0), mz(TR.z0), mx(TR.x1) - mx(TR.x0), mz(TR.z1) - mz(TR.z0))
      g.strokeStyle = '#ff8a6a'
      g.lineWidth = 5
      g.beginPath()
      g.moveTo(mx(faultX(TR.z0)), mz(TR.z0))
      g.lineTo(mx(faultX(TR.z1)), mz(TR.z1))
      g.stroke()
      g.fillStyle = '#d8c0a0'
      g.font = font(600, 20)
      g.fillText(E.probe.map.trench, mx(TR.x1) + 8, mz((TR.z0 + TR.z1) / 2) + 7)
      // the probe line and its readings
      g.strokeStyle = '#e8c23a'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(mx(xOfPos(0)), mz(LINE_Z))
      g.lineTo(mx(xOfPos(NPOS - 1)), mz(LINE_Z))
      g.stroke()
      g.fillStyle = '#e8c23a'
      g.fillText(E.probe.map.line, mx(xOfPos(NPOS - 1)) + 10, mz(LINE_Z) + 7)
      for (let i = 0; i < 7; i++) {
        g.fillStyle = 'rgba(232,194,58,0.7)'
        g.beginPath()
        g.arc(mx(xOfPos(i * 2)), mz(LINE_Z), 4, 0, TAU)
        g.fill()
      }
      for (const j of vis) {
        const v = readingAt(j)
        const r = 5 + (v / 45) * 15
        g.fillStyle = v >= HIGH ? RN_HALO : 'rgba(60,195,214,0.7)'
        g.beginPath()
        g.arc(mx(xOfPos(j)), mz(LINE_Z) - r - 4, r, 0, TAU)
        g.fill()
      }
      if (revealK > 0.5) {
        g.strokeStyle = '#ff8a6a'
        g.setLineDash([12, 9])
        g.lineWidth = 4
        g.beginPath()
        g.moveTo(mx(faultX(-10.5)), mz(-10.5))
        g.lineTo(mx(faultX(6)), mz(6))
        g.stroke()
        g.setLineDash([])
        g.fillStyle = '#ffb4a0'
        g.font = font(700, 24)
        g.fillText(E.probe.map.found, mx(faultX(-1.5)) + 14, mz(-1.5))
      }
    })
  }
  drawMap()
  const probePanel = lv => ({
    title: E.probe.title,
    color: RN,
    blocks: [
      ...paras(E.probe.panel[depth(lv)]),
      { p: E.probe.tip },
      {
        slider: {
          label: E.probe.pos,
          min: 0,
          max: (NPOS - 1) * POS_STEP,
          step: POS_STEP,
          value: Math.max(0, cur) * POS_STEP,
          onInput: v => tapPos(Math.round(v / POS_STEP)),
          format: v => `${num(v, 1, lang)} m`,
          live: () => Math.max(0, cur) * POS_STEP,
        },
      },
      { buttons: [{ label: E.probe.buttons.all, onClick: () => measureAll() }, { label: E.probe.buttons.clear, onClick: () => clearSurvey() }] },
    ],
  })
  /** A visitor measures at position j (a tap on the line, the slider). The state changes now, the probe follows. */
  function tapPos(j) {
    j = Math.max(0, Math.min(NPOS - 1, Math.round(j)))
    if (j === cur && (rigS.phase !== 'idle' || queue.length)) return
    mineProbe = true
    measured.add(j)
    cur = j
    if (!queue.includes(j) && rigS.j !== j) queue.push(j)
    else if (rigS.phase === 'idle') queue.push(j)
    play('tap')
    share('probe')
  }
  function measureAll() {
    mineProbe = true
    const todo = [0, 2, 4, 6, 8, 10, 12].filter(j => !measured.has(j) || !shown.has(j))
    for (const j of todo) {
      measured.add(j)
      if (!queue.includes(j)) queue.push(j)
    }
    queue.sort((a, b) => a - b)
    cur = 12
    play('select')
    share('probe')
  }
  function clearSurvey() {
    measured = new Set()
    shown = new Set()
    queue.length = 0
    cur = -1
    saidLow = false
    revealT = 0
    rigS.phase = 'up'
    rigS.t = 0
    rigS.j = -1
    rigS.to = PARK
    mineProbe = true
    play('tap')
    share('probe')
  }
  clickable(line, hit => tapPos((hit.point.x - POS0) / POS_STEP), { reach: 7 })
  ex.add({
    id: 'probe',
    x: 2.2,
    z: 5.0,
    radius: 2.4,
    manual: true,
    label: E.probe.label,
    verb: () => (measured.size === 0 ? E.probe.verbs.first : found() ? E.probe.verbs.done : E.probe.verbs.more),
    focus: { x: POS0 + 2.1, y: 0.55, z: LINE_Z - 0.2, size: 2.0, width: 4.8 },
    act: () => ctx.showPanel(probePanel),
  })
  /** The probe has read position j: its bar rises, the Atomling tells (only the visitor who asked). */
  const readDone = j => {
    shown.add(j)
    const v = readingAt(j)
    meterText.text = `${v} ${E.probe.unit}`
    meterText.sync()
    play('beep')
    if (!mineProbe) return
    const first = shown.size === 1
    if (allShown() && found() && revealT === 0) return // the reveal speaks
    if (v >= HIGH) say(at(E.probe.says.high, level()))
    else if (first) say(at(E.probe.says.first, level()))
    else if (!saidLow) {
      saidLow = true
      say(at(E.probe.says.low, level()))
    }
    if (measured.size >= 5 && !found() && allShown() && !queue.length) say(at(E.probe.says.hint, level()))
    ex.discover('probe', probePanel, 3.5)
  }
  const PH = { up: [0.3, 0.15], move: [0.6, 0.32], park: [0.6, 0.32], down: [0.45, 0.22], pump: [0.9, 0.35] }
  updates.push((dt, t) => {
    // the probe's little routine: out of the ground, across, in, pump, read
    const dur = p => PH[p][rigS.fast ? 1 : 0]
    if (rigS.phase === 'idle' && queue.length) {
      rigS.j = queue.shift()
      rigS.fast = queue.length > 0
      rigS.from = rigS.x
      rigS.to = xOfPos(rigS.j)
      rigS.phase = rigS.depth > 0.01 ? 'up' : 'move'
      rigS.t = 0
      meterText.text = ''
      meterText.sync()
    }
    if (rigS.phase !== 'idle') {
      rigS.t += dt
      const u = clamp(rigS.t / dur(rigS.phase))
      if (rigS.phase === 'up') {
        rigS.depth = 1 - ease(u)
        if (u >= 1) {
          rigS.phase = rigS.j < 0 ? 'park' : 'move'
          rigS.from = rigS.x
          rigS.t = 0
        }
      } else if (rigS.phase === 'move' || rigS.phase === 'park') {
        rigS.x = lerp(rigS.from, rigS.to, ease(u))
        if (u >= 1) {
          rigS.phase = rigS.phase === 'park' ? 'idle' : 'down'
          rigS.t = 0
        }
      } else if (rigS.phase === 'down') {
        rigS.depth = ease(u)
        if (u >= 1) {
          rigS.phase = 'pump'
          rigS.t = 0
          meterText.text = '...'
          meterText.sync()
        }
      } else if (rigS.phase === 'pump') {
        if (u >= 1) {
          rigS.phase = 'idle'
          readDone(rigS.j)
        }
      }
    }
    const hop = rigS.phase === 'move' || rigS.phase === 'park' ? Math.sin(clamp(rigS.t / dur(rigS.phase)) * Math.PI) * 0.18 : 0
    rig.position.set(rigS.x, 0, LINE_Z)
    rod.position.y = hop - rigS.depth * 0.75
    meter.position.y = hop * 0.5
    // the bars grow
    bars.forEach((b, j) => {
      const on = shown.has(j)
      b.k = damp(b.k, on ? 1 : 0, on ? 4 : 12, dt)
      b.m.visible = b.k > 0.01
      b.m.scale.y = Math.max(0.001, b.h * b.k)
      b.label.visible = b.k > 0.9
      b.label.position.set(xOfPos(j), b.h + 0.04, LINE_Z - 0.3)
      if (b.label.visible) b.label.quaternion.copy(ctx.camera.quaternion)
    })
    // the reveal, once five spots are read and one is high
    const reveal = found() && allShown()
    if (reveal && revealT === 0) {
      revealT = t
      if (mineProbe) {
        say(at(E.probe.says.found, level()))
        play('discover')
        ex.discover('probe', probePanel, 3.5)
      }
    }
    if (!reveal) revealT = 0
    revealK = damp(revealK, reveal ? 1 : 0, 3, dt)
    flags.forEach((f, i) => {
      const goal = reveal && t - revealT > 0.6 + f.at ? 1 : 0
      f.k = damp(f.k, goal, goal ? 6 : 12, dt)
      f.g.visible = f.k > 0.01
      f.g.scale.setScalar(Math.max(0.001, f.k))
      f.f.rotation.y = 0.4 + Math.sin(t * 2.2 + i) * 0.2
    })
    drawMap()
  })
  const probeState = () => ({ m: [...measured].sort((a, b) => a - b), at: cur })
  const probeSet = (s, liveSet) => {
    const m = (Array.isArray(s?.m) ? s.m : []).map(Number).filter(j => Number.isInteger(j) && j >= 0 && j < NPOS)
    const fresh = m.filter(j => !measured.has(j)).sort((a, b) => a - b)
    measured = new Set(m)
    const a = Number(s?.at)
    cur = Number.isInteger(a) && a >= -1 && a < NPOS ? a : -1
    mineProbe = false
    if (!m.length) {
      shown = new Set()
      queue.length = 0
      saidLow = false
      if (liveSet) {
        rigS.phase = 'up'
        rigS.t = 0
        rigS.j = -1
        rigS.to = PARK
      } else Object.assign(rigS, { x: PARK, depth: 0, phase: 'idle', j: -1 })
      return
    }
    for (const j of [...shown]) if (!measured.has(j)) shown.delete(j)
    if (liveSet) {
      const todo = fresh.length ? fresh : cur >= 0 ? [cur] : []
      for (const j of todo) if (!queue.includes(j)) queue.push(j)
    } else {
      shown = new Set(m)
      queue.length = 0
      Object.assign(rigS, { x: cur >= 0 ? xOfPos(cur) : PARK, depth: cur >= 0 ? 1 : 0, phase: 'idle', j: cur })
      if (cur >= 0) {
        meterText.text = `${readingAt(cur)} ${E.probe.unit}`
        meterText.sync()
      }
    }
  }

  updates.push((dt, t) => stage.update(t))

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.6 },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: 0.9, z: 7.4, yaw: Math.atan2(0.9 - SPAWN.x, 7.4 - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: -3.9, z: 7.4, rot: Math.atan2(SPAWN.x + 3.9, SPAWN.z + 0.6 - 7.4) },
    parts: {
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
      fault: {
        push: () => push(),
        limit: () => setStress(1),
        setStress: v => setStress(v),
        arrowAt: () => worldOf(arrows[0].m, 0, 0, 0.04),
        get stress() { return stress },
        get slips() { return slips },
        get leak() { return leakRate },
      },
      record: {
        hut: () => tapHut(),
        folder: id => tapFolder(id),
        setT: v => slideRec(v),
        hutAt: () => worldOf(hut, 0, 1.2, 0.9),
        folderAt: id => worldOf(folders[id].g, 0, 0, 0.02),
        get on() { return recOn },
        get rec() { return rec },
        get t() { return tRec },
        get running() { return running },
        get seen() { return [...seen] },
      },
      probe: {
        tap: j => tapPos(j),
        all: () => measureAll(),
        clear: () => clearSurvey(),
        spotAt: i => new THREE.Vector3(xOfPos(i * 2), 0.3, LINE_Z),
        get measured() { return [...measured].sort((a, b) => a - b) },
        get found() { return found() },
        get busy() { return rigS.phase !== 'idle' || queue.length > 0 },
        get readings() { return Array.from({ length: NPOS }, (_, j) => readingAt(j)) },
      },
    },
    panels: { fault: faultPanel, record: recPanel, probe: probePanel },
    shared: {
      fault: { get: faultState, set: faultSet },
      record: { get: recState, set: recSet },
      probe: { get: probeState, set: probeSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    detach() {
      root.position.set(0, 0, 0)
    },
    dispose() {
      stage.dispose()
      for (const o of own) o.dispose?.()
    },
  }
}
