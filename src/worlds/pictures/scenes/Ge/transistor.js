// Germanium's picture "How was the first transistor made?" as a room (docs/knowledge/picture-rooms.md): the
// picture made into a laboratory at Bell Labs, Murray Hill, on a snowy evening in December 1947
// (stages/belllabs.js). The device of the picture stands on a long bench at the back, ten times bigger than
// life or more: a clear plastic triangle on its tip, gold foil down its two lower edges, slit at the tip,
// pressed by a spring onto a grey germanium slab on a brass base; a microphone on its left, headphones on its
// right, a magnifying lens above. Three things to do, each step chosen by tapping its thing (the user,
// 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap, E opens the
// station's panel, whose buttons (and a slider for the emitter current) do the same:
// - build it: tap the gold foil roll (it wraps round the triangle, down one side, over the tip, up the other),
//   the razor blade (it rises through the foil at the tip: two points, the lens shows their gap of about 50
//   micrometres beside a sheet of paper's edge), the spring (it presses the triangle onto the germanium; tap it
//   again to lift). Out of order: no foil, nothing to do; pressed before the slit, one point (no gain);
//   the razor cannot reach while the spring presses;
// - make it louder: tap the microphone and the voice draws a small wave on the scope's top trace; tap the
//   battery's switch and the collector circuit is complete, the bottom trace shows the same wave bigger and
//   the headphones' sound rings grow; a slider sets the current into the emitter (more holes cross in the
//   lens, a bigger output). No transistor, one point, or no battery: nothing louder, and the Atomling says why;
// - a tube or a crystal: a 1940s tube radio (cabinet and its chassis with five tubes) beside a pocket radio of
//   1954; tap the tube radio and its tubes heat up (the glow, the dial, a shimmer; about half a minute, sped
//   up) before it plays; the pocket radio plays at once; a board fills in size, power, warm-up and what is inside.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes. The voice is a synthetic wave, not a
// recording, and no gain figure is shown (sources differ).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, lerp, random } from '../../../wings/noble/kit.js'
import { bellLabsStage, BENCH_TOP } from '../../stages/belllabs.js'
import { ease, motes } from '../../kit.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { TRANSISTOR_WORDS } from './transistor.words.js'

export const WORDS = TRANSISTOR_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const TOP = BENCH_TOP
// resting: leaning on a small block, its face toward the visitor
const RAZOR_Q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.55)
// standing across the tip: long edge along z, flat face to the side, sharp edge up, turned a little to show its face
const RAZOR_Q1 = new THREE.Quaternion()
  .setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
  .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2 + 0.35))

// ---- where things stand (metres; the spawn at z = 2 looks along -z, into the picture) ----
const ROOM = { x0: -6.5, x1: 6.5, z0: -6, z1: 6.2, h: 3.5 }
const WALL = ROOM.z0
// the device, on the long bench along the back wall
const DEV = { x: 0, z: -5.2 }
const BASE = { w: 1.0, h: 0.24, d: 0.5 }
const GE = { w: 0.7, h: 0.07, d: 0.36 }
const TIP_Y = TOP + BASE.h + GE.h // where the triangle's tip rests when pressed
const TRI = { w: 0.86, h: 0.62, d: 0.12, flat: 0.06 }
const HOVER = 0.22 // the tip's height above the germanium before pressing
const POST = { x: DEV.x + 0.8, z: DEV.z - 0.04 }
const SPR = { up: 0.42, down: 0.26 } // the spring's length hanging, and pressed
const LENS = { x: -1.15, y: 2.5, z: WALL + 0.04, r: 0.75 }
const FOIL = { x: -1.12, z: -5.02 }
const RAZOR = { x: -0.76, z: -4.84 }
const MIC = { x: -1.62, z: -5.1 }
const SCOPE = { x: -2.55, z: -5.3 }
const BATT = { x: 1.42, z: -5.05 }
const PHONES = { x: 2.28, z: -5.2 }
const CALENDAR = { x: -3.9, y: 2.15 }
// station three, on the east wall
const TABLE3 = { x: 6.0, z: 0.1, w: 0.9, l: 3.4, top: 0.8 }
const TUBES = { x: 6.0, z: -0.62 } // the tube radio set's origin: cabinet to its left, the chassis to its right
const POCKET = { x: 5.95, z: 1.12 }

const GOLD = '#ffc93a'
const CRT = '#7dffb0'
const PINK = '#ff7ab8'
const BLUE = '#6fd0ff'
const COPPER = '#d9783c'

/** A box of rounded edges. */
const rbox = (w, h, d, r = 0.02) => new RoundedBoxGeometry(w, h, d, 2, r)

/** A helix hanging down from the origin: a spring of `len` metres. */
class Helix extends THREE.Curve {
  constructor(len, radius, turns) {
    super()
    this.len = len
    this.radius = radius
    this.turns = turns
  }
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * this.turns * TAU
    return target.set(Math.cos(a) * this.radius, -this.len * t, Math.sin(a) * this.radius)
  }
}

/** A wire as a thin tube through the points (a mesh is reused when given). */
function wireMesh(points, r, mat, old) {
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 44, r, 6, false)
  if (old) {
    old.geometry.dispose()
    old.geometry = geo
    return old
  }
  return new THREE.Mesh(geo, mat)
}

/** The voice: a synthetic "hello", an envelope of two bursts with a voiced carrier, in -1..1 along u in 0..1. */
const VOICE_PEAK = (() => {
  let m = 0
  for (let i = 0; i <= 600; i++) {
    const u = i / 600
    const env = Math.exp(-(((u - 0.26) / 0.1) ** 2)) * 0.95 + Math.exp(-(((u - 0.68) / 0.14) ** 2))
    const f = u < 0.45 ? 46 : 34
    m = Math.max(m, Math.abs(env * (Math.sin(TAU * f * u) * 0.8 + Math.sin(TAU * f * 2.03 * u + 1) * 0.35)))
  }
  return m
})()
function voice(u) {
  const env = Math.exp(-(((u - 0.26) / 0.1) ** 2)) * 0.95 + Math.exp(-(((u - 0.68) / 0.14) ** 2))
  const f = u < 0.45 ? 46 : 34
  return (env * (Math.sin(TAU * f * u) * 0.8 + Math.sin(TAU * f * 2.03 * u + 1) * 0.35)) / VOICE_PEAK
}
/** The strength of the voice at u (the envelope alone, 0..1): drives the sound rings. */
const voiceEnv = u => Math.min(1, Math.exp(-(((u - 0.26) / 0.12) ** 2)) + Math.exp(-(((u - 0.68) / 0.16) ** 2)))

/** A soft round glow. */
function softTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** Concentric arcs of sound spreading from a point in the plane of its group (xy), centred on the angle
 *  `dir`: set(t, amp) moves them (amp 0 hides them). */
function soundRings({ n = 3, r0 = 0.08, r1 = 0.5, arc = 0.85, dir = 0, color = BLUE, speed = 0.8 }) {
  const group = new THREE.Group()
  const geo = new THREE.RingGeometry(0.92, 1, 30, 1, -arc, arc * 2)
  const arcs = []
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
    )
    m.rotation.z = dir
    group.add(m)
    arcs.push(m)
  }
  // each ring turns about the group's origin, so a ring is a child of its own pivot
  return {
    group,
    set(t, amp) {
      group.visible = amp > 0.01
      if (!group.visible) return
      arcs.forEach((m, i) => {
        const p = (t * speed + i / n) % 1
        m.scale.setScalar(r0 + (r1 - r0) * p)
        m.material.opacity = amp * Math.min(1, p * 6) * (1 - p) * 0.95
      })
    },
    dispose() {
      geo.dispose()
      arcs.forEach(m => m.material.dispose())
    },
  }
}

/** The germanium's drawn matcap (germanium shines like a metal: a dark grey mirror in the picture). */
function germaniumMatcap() {
  return canvasTex(128, 128, (g, w) => {
    const base = g.createLinearGradient(0, 0, 0, w)
    for (const [o, col] of [[0, '#8a9097'], [0.35, '#5a6068'], [0.62, '#363a40'], [1, '#1a1c20']]) base.addColorStop(o, col)
    g.fillStyle = base
    g.fillRect(0, 0, w, w)
    for (const [x, y, r, a] of [[42, 35, 15, 0.8], [91, 48, 9, 0.7]]) {
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, `rgba(240,242,246,${a})`)
      grd.addColorStop(1, 'rgba(200,204,212,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
  })
}

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, light, level, color, clickable }) {
  const stage = bellLabsStage({
    light,
    ...ROOM,
    lamps: [
      { x: -2.6, z: -3.2, light: 4.2 },
      { x: 2.6, z: -3.2, light: 3.6 },
      { x: -2.6, z: 1.8 },
      { x: 2.8, z: 1.4, light: 3.2 },
      { x: 0, z: 4.2, light: 2.4 },
    ],
    windows: [
      { side: 'w', at: -3.4 },
      { side: 'w', at: 0.5 },
      { side: 'w', at: 4.2 },
      { side: 'e', at: -4.0 },
      { side: 'e', at: 4.0 },
      { side: 's', at: -3.8 },
      { side: 's', at: 3.8 },
    ],
    door: { side: 'w', at: -5.0 },
    clock: { side: 'n', at: 4.1, y: 2.75, hour: 5, minute: 20 },
  })
  root.add(stage.group)
  const { mats, shine } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const geos = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const soft = softTex()
  textures.push(soft)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const narrow = () => (ctx.camera?.aspect ?? 1.6) < 1
  const focusBy = (item, wide, tall) => Object.defineProperty(item, 'focus', { get: () => (narrow() ? tall() : wide), configurable: true })
  const tag = (text, x, y, z, size = 0.075, rotY = 0) => {
    const t = makeText(text, { size, color: '#f2ead6', anchorY: 'middle', outlineWidth: size * 0.08, outlineColor: '#141210', maxWidth: 1.4 })
    t.position.set(x, y, z)
    t.rotation.y = rotY
    root.add(t)
    return t
  }
  const hit = (r, x, y, z) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), ghost)
    m.position.set(x, y, z)
    return m
  }
  const hitBox = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ghost)
    m.position.set(x, y, z)
    return m
  }
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...extra })
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.28, emissive: '#6a4600', emissiveIntensity: 0.3, envMap: shine, envMapIntensity: 0.9 })
  const copperMat = new THREE.MeshStandardMaterial({ color: COPPER, metalness: 0.5, roughness: 0.4 })
  const wireBlack = new THREE.MeshStandardMaterial({ color: '#1c1a18', roughness: 0.6 })
  const plastic = new THREE.MeshStandardMaterial({ color: '#bfe0f0', transparent: true, opacity: 0.42, roughness: 0.08, depthWrite: false, side: THREE.DoubleSide, envMap: shine, envMapIntensity: 1.2 })
  const matcap = germaniumMatcap()
  textures.push(matcap)
  const geMat = new THREE.MeshMatcapMaterial({ matcap })
  // the voice, the scope and the lens read the same few numbers
  const S1 = { foil: 0, slit: 0, press: 0 }
  const S2 = { talks: 0, power: 0, cur: 0.5 }
  const S3 = { tube: 0, pocket: 0, tt: 0, pt: 0 }
  const built = () => !!(S1.foil && S1.slit && S1.press)
  const gain = () => (built() && S2.power ? 0.6 + 4.2 * S2.cur : 0)

  // ======== the room's furniture ========
  // the long bench along the back wall, racks of tube amplifiers at its ends
  const bench = stage.bench(0, -5.4, 6.6, 1.1)
  bench.position.z = -5.4
  for (const x of [-4.6, 4.6]) {
    const rack = stage.tubeRack({ tubes: 4 })
    rack.position.set(x, 0, -5.55)
    root.add(rack)
    solids.push(box(x, -5.55, 0.7, 0.5))
  }
  // props on the bench: a notebook, a soldering iron, a coil of wire
  {
    const book = new THREE.Group()
    const cover = new THREE.Mesh(rbox(0.3, 0.025, 0.22, 0.004), mats.wood)
    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.018, 0.2), mat('#cfc6a4'))
    pages.position.y = 0.012
    const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.17, 6), mat('#c9a14a'))
    pencil.rotation.z = Math.PI / 2
    pencil.rotation.y = 0.5
    pencil.position.set(0.05, 0.03, 0.02)
    book.add(cover, pages, pencil)
    book.position.set(0.55, TOP + 0.013, -4.8)
    book.rotation.y = 0.25
    root.add(book)
    const iron = new THREE.Group()
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.2), mats.steel)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), mats.wood)
    handle.rotation.x = Math.PI / 2
    handle.position.set(0, 0.06, 0.06)
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.12, 6), mats.steel)
    tip.rotation.x = Math.PI / 2
    tip.position.set(0, 0.06, -0.08)
    iron.add(stand, handle, tip)
    iron.position.set(-3.1, TOP + 0.015, -5.0)
    iron.rotation.y = -0.2
    root.add(iron)
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 8, 18), mat('#6a2a20'))
    coil.rotation.x = Math.PI / 2
    coil.position.set(3.1, TOP + 0.03, -4.95)
    root.add(coil)
  }
  // the calendar: December 1947 began on a Monday; the 23rd is ringed
  {
    const cal = new THREE.Group()
    const tex = canvasTex(256, 330, (g, w, h) => {
      g.fillStyle = '#e8e2cc'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#7a2a2a'
      g.fillRect(0, 0, w, 52)
      g.fillStyle = '#4a3a2e'
      g.fillRect(0, 52, w, 2)
      g.fillStyle = '#3a3a3a'
      g.font = '700 20px Outfit'
      g.textAlign = 'center'
      for (let d = 1; d <= 31; d++) {
        const idx = d - 1 + 1 // Monday is the second column of a Sunday-first week
        const col = idx % 7
        const row = Math.floor(idx / 7)
        const x = 24 + col * 34
        const y = 100 + row * 36
        if (d === 23) {
          g.strokeStyle = '#b02a2a'
          g.lineWidth = 3
          g.beginPath()
          g.arc(x, y - 7, 15, 0, TAU)
          g.stroke()
        }
        g.fillText(String(d), x, y)
      }
    })
    textures.push(tex)
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.59), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }))
    const month = makeText(E.calendar, { size: 0.045, color: '#f4eede', anchorY: 'middle', maxWidth: 0.42 })
    month.position.set(0, 0.245, 0.003)
    cal.add(sheet, month)
    stage.onWall(cal, 'n', CALENDAR.x, CALENDAR.y, 0.02)
  }

  // ======== the lens above the bench: the picture's close-up ========
  const lensTex = canvasTex(512, 512)
  textures.push(lensTex)
  const L = { mode: '', cur: 0.5, power: 0, holes: [], flash: 0, spawn: 0, dirty: true, clock: 0 }
  const lensGroup = new THREE.Group()
  lensGroup.position.set(LENS.x, LENS.y, LENS.z)
  {
    const backing = new THREE.Mesh(new THREE.CircleGeometry(LENS.r + 0.1, 40), new THREE.MeshStandardMaterial({ color: '#0d1233', roughness: 0.4 }))
    backing.position.z = -0.01
    const face = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 48), new THREE.MeshBasicMaterial({ map: lensTex, toneMapped: false }))
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(LENS.r + 0.05, 0.04, 8, 56),
      new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 1.0, roughness: 0.4 }),
    )
    lensGroup.add(backing, face, ring)
    root.add(lensGroup)
  }
  const lensCaption = makeText('', { size: 0.1, color: '#f2ead6', anchorY: 'bottom', outlineWidth: 0.008, outlineColor: '#141210', maxWidth: 1.5 })
  lensCaption.position.set(-2.95, 2.55, LENS.z + 0.03)
  root.add(lensCaption)
  const lensNote = makeText('', { size: 0.07, color: '#cfd8ee', anchorY: 'top', outlineWidth: 0.006, outlineColor: '#141210', maxWidth: 1.5 })
  lensNote.position.set(-2.95, 2.0, LENS.z + 0.03)
  root.add(lensNote)

  const gWedge = (g, cx, tipY, half, tipHalf, color) => {
    g.fillStyle = color
    g.beginPath()
    g.moveTo(cx - half, 0)
    g.lineTo(cx + half, 0)
    g.lineTo(cx + tipHalf, tipY)
    g.lineTo(cx - tipHalf, tipY)
    g.closePath()
    g.fill()
  }
  const goldWedge = (g, cx, tipY, lean) => {
    // a strip of foil down an edge: leaning, ending in a point
    const grd = g.createLinearGradient(cx - 40, 0, cx + 40, 0)
    grd.addColorStop(0, '#ffe08a')
    grd.addColorStop(0.5, '#ffc93a')
    grd.addColorStop(1, '#c4901c')
    g.fillStyle = grd
    g.beginPath()
    g.moveTo(cx - 36 + lean * 54, 0)
    g.lineTo(cx + 26 + lean * 54, 0)
    g.lineTo(cx + 4, tipY)
    g.lineTo(cx - 4, tipY)
    g.closePath()
    g.fill()
    g.strokeStyle = '#7a5200'
    g.lineWidth = 2
    g.stroke()
  }
  const arrow = (g, x0, y0, x1, y1, w, col) => {
    const a = Math.atan2(y1 - y0, x1 - x0)
    const head = Math.max(16, w * 1.9)
    g.strokeStyle = col
    g.fillStyle = col
    g.lineWidth = w
    g.lineCap = 'butt'
    g.beginPath()
    g.moveTo(x0, y0)
    g.lineTo(x1 - Math.cos(a) * head * 0.7, y1 - Math.sin(a) * head * 0.7)
    g.stroke()
    g.beginPath()
    g.moveTo(x1, y1)
    g.lineTo(x1 - Math.cos(a) * head + Math.cos(a + Math.PI / 2) * head * 0.62, y1 - Math.sin(a) * head + Math.sin(a + Math.PI / 2) * head * 0.62)
    g.lineTo(x1 - Math.cos(a) * head + Math.cos(a - Math.PI / 2) * head * 0.62, y1 - Math.sin(a) * head + Math.sin(a - Math.PI / 2) * head * 0.62)
    g.closePath()
    g.fill()
  }
  const lensLabel = (g, text, x, y, align = 'center', col = '#e8f2ff') => {
    g.font = '700 27px Outfit'
    g.textAlign = align
    g.textBaseline = 'middle'
    g.lineWidth = 6
    g.strokeStyle = 'rgba(8,12,34,0.9)'
    g.strokeText(text, x, y)
    g.fillStyle = col
    g.fillText(text, x, y)
  }
  const lensAtoms = g => {
    const rnd = random(5)
    const pts = []
    for (let r = 0; r < 6; r++) for (let c = -1; c < 11; c++) pts.push([c * 52 + (r % 2 ? 26 : 0), 262 + r * 44 + (rnd() - 0.5) * 2])
    g.strokeStyle = 'rgba(120,170,166,0.55)'
    g.lineWidth = 5
    for (const [x, y] of pts) for (const [x2, y2] of pts) {
      const d = Math.hypot(x - x2, y - y2)
      if (d > 20 && d < 56 && (x2 > x || (x2 === x && y2 > y))) {
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x2, y2)
        g.stroke()
      }
    }
    for (const [x, y] of pts) {
      const grd = g.createRadialGradient(x - 5, y - 5, 2, x, y, 18)
      grd.addColorStop(0, '#d8f2ee')
      grd.addColorStop(0.55, '#6fa4a0')
      grd.addColorStop(1, '#3f6e6a')
      g.fillStyle = grd
      g.beginPath()
      g.arc(x, y, 17, 0, TAU)
      g.fill()
    }
  }
  const drawLens = (g, w, h) => {
    const lv = level()
    const d = depthOf(lv)
    g.clearRect(0, 0, w, h)
    g.save()
    g.beginPath()
    g.arc(w / 2, h / 2, w / 2 - 2, 0, TAU)
    g.clip()
    const bg = g.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#0e1a44')
    bg.addColorStop(1, '#070c24')
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    const m = L.mode
    // the plastic triangle behind (a pale blue glass wedge), always
    const plasticPoly = (cx, bottom) => {
      g.fillStyle = 'rgba(150,205,235,0.28)'
      g.beginPath()
      g.moveTo(cx - 250, 0)
      g.lineTo(cx + 250, 0)
      g.lineTo(cx + 30, bottom)
      g.lineTo(cx - 30, bottom)
      g.closePath()
      g.fill()
      g.strokeStyle = 'rgba(190,230,250,0.7)'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(cx - 178, 0)
      g.lineTo(cx - 30, bottom)
      g.lineTo(cx + 30, bottom)
      g.lineTo(cx + 178, 0)
      g.stroke()
    }
    if (m === 'plastic') {
      plasticPoly(256, 214)
    } else if (m === 'foil' || m === 'one') {
      plasticPoly(256, 214)
      // one continuous strip of foil down both edges and across the tip
      goldWedge(g, 256 - 70, 214, -0.1)
      g.save()
      g.translate(512, 0)
      g.scale(-1, 1)
      goldWedge(g, 256 - 70, 214, -0.1)
      g.restore()
      g.fillStyle = '#ffc93a'
      g.fillRect(226, 196, 60, 20)
      if (m === 'one') lensAtoms(g)
    } else if (m === 'gap') {
      plasticPoly(256, 214)
      goldWedge(g, 200 - 4, 214, -0.1)
      g.save()
      g.translate(512, 0)
      g.scale(-1, 1)
      goldWedge(g, 200 - 4, 214, -0.1)
      g.restore()
      // the gap against a sheet of paper's edge, to the same scale (50 against 100 micrometres)
      g.strokeStyle = '#e8f2ff'
      g.fillStyle = '#e8f2ff'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(200, 240)
      g.lineTo(312, 240)
      g.moveTo(200, 230)
      g.lineTo(200, 250)
      g.moveTo(312, 230)
      g.lineTo(312, 250)
      g.stroke()
      lensLabel(g, at(E.lens.gap, lv), 256, 270)
      g.fillStyle = '#e6e2d2'
      g.fillRect(144, 322, 224, 30)
      g.strokeStyle = '#8a8470'
      g.lineWidth = 2
      g.strokeRect(144, 322, 224, 30)
      g.strokeStyle = '#e8f2ff'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(144, 372)
      g.lineTo(368, 372)
      g.moveTo(144, 362)
      g.lineTo(144, 382)
      g.moveTo(368, 362)
      g.lineTo(368, 382)
      g.stroke()
      lensLabel(g, at(E.lens.paper, lv), 256, 408)
    } else if (m === 'two') {
      lensAtoms(g)
      plasticPoly(256, 214)
      goldWedge(g, 200 - 4, 214, -0.1)
      g.save()
      g.translate(512, 0)
      g.scale(-1, 1)
      goldWedge(g, 200 - 4, 214, -0.1)
      g.restore()
      // the holes drifting from the emitter point to the collector point
      for (const o of L.holes) {
        const s = o.s
        const x = lerp(200, 312, s)
        const y = 240 + Math.sin(Math.PI * s) * 22 + o.j * 9
        const a = L.power ? 1 : clamp(1 - (s - 0.35) / 0.25)
        if (a <= 0.02) continue
        g.globalAlpha = a
        g.fillStyle = PINK
        g.strokeStyle = 'rgba(255,255,255,0.85)'
        g.lineWidth = 2
        g.beginPath()
        g.arc(x, y, 10, 0, TAU)
        g.fill()
        g.stroke()
        g.strokeStyle = '#ffffff'
        g.lineWidth = 3
        g.beginPath()
        g.moveTo(x - 5, y)
        g.lineTo(x + 5, y)
        g.moveTo(x, y - 5)
        g.lineTo(x, y + 5)
        g.stroke()
        g.globalAlpha = 1
      }
      // a thin arrow in at the emitter, a broad one out at the collector (as broad as the output is big)
      const out = L.power ? 0.18 + 0.82 * clamp((0.6 + 4.2 * L.cur) / 4.8) : 0.12
      if (L.cur > 0.02) arrow(g, 184, 140, 198, 196, 5, BLUE)
      arrow(g, 328, 196, 340, 120 - out * 24, 6 + out * 30, L.power ? BLUE : 'rgba(111,208,255,0.35)')
      if (L.flash > 0.05) {
        const fl = g.createRadialGradient(312, 242, 0, 312, 242, 46)
        fl.addColorStop(0, `rgba(255,255,255,${L.flash * 0.85})`)
        fl.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = fl
        g.fillRect(250, 190, 120, 100)
      }
      lensLabel(g, at(E.lens.emitter, lv), 104, 214, 'center')
      lensLabel(g, at(E.lens.collector, lv), 408, 214, 'center')
      lensLabel(g, at(E.lens.ge, lv), 256, 462)
      if (d === 'sci') lensLabel(g, at(E.lens.holes, lv), 256, 322, 'center', PINK)
    }
    g.restore()
    g.strokeStyle = 'rgba(150,200,255,0.5)'
    g.lineWidth = 4
    g.beginPath()
    g.arc(w / 2, h / 2, w / 2 - 3, 0, TAU)
    g.stroke()
  }
  const redrawLens = () => {
    lensTex.userData.redraw(drawLens)
    L.dirty = false
  }
  let lensLv = ''
  const setLensMode = (mode, force) => {
    const lv = level()
    if (mode !== L.mode || lv !== lensLv || force) {
      L.mode = mode
      lensLv = lv
      const key = { plastic: 'plastic', foil: 'foil', gap: 'gap', one: 'one', two: 'two' }[mode]
      lensCaption.text = at(E.lens.caption[key], lv)
      lensCaption.sync()
      lensNote.text = mode === 'gap' || mode === 'two' ? at(E.lens.note, lv) : ''
      lensNote.sync()
      L.dirty = true
    }
  }
  setLensMode('plastic')

  // ======== 1. build it ========
  const dev = new THREE.Group()
  root.add(dev)
  // the brass base, the germanium slab on it
  {
    const base = new THREE.Mesh(rbox(BASE.w, BASE.h, BASE.d, 0.015), mats.brass)
    base.position.set(DEV.x, TOP + BASE.h / 2, DEV.z)
    const ge = new THREE.Mesh(rbox(GE.w, GE.h, GE.d, 0.008), geMat)
    ge.position.set(DEV.x, TOP + BASE.h + GE.h / 2, DEV.z)
    // a screw head and a terminal on the base's front: the third contact
    const term = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), mats.steel)
    term.rotation.x = Math.PI / 2
    term.position.set(DEV.x - 0.36, TOP + 0.12, DEV.z + BASE.d / 2 + 0.01)
    dev.add(base, ge, term)
    solids.push(box(DEV.x, DEV.z, BASE.w, BASE.d))
    tag(E.tags.ge, DEV.x - 0.02, TOP - 0.1 + 0.02, DEV.z + 0.52, 0.07)
  }
  // the triangle (apex down, its tip a little flat), the foil on it, all hanging from the spring
  const tri = new THREE.Group()
  dev.add(tri)
  const triShape = new THREE.Shape()
  triShape.moveTo(-TRI.w / 2, TRI.h)
  triShape.lineTo(TRI.w / 2, TRI.h)
  triShape.lineTo(TRI.flat / 2, 0)
  triShape.lineTo(-TRI.flat / 2, 0)
  triShape.closePath()
  {
    const geo = new THREE.ExtrudeGeometry(triShape, { depth: TRI.d, bevelEnabled: false })
    geo.translate(0, 0, -TRI.d / 2)
    geos.push(geo)
    const body = new THREE.Mesh(geo, plastic)
    body.renderOrder = 2
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: '#a8d8ee' }))
    tri.add(body, edges)
  }
  // foil: two strips down the lower edges and a bridge across the tip, each a box scaled along its length
  const strip = (x0, y0, x1, y1) => {
    const len = Math.hypot(x1 - x0, y1 - y0)
    const m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.045, TRI.d + 0.014), goldMat)
    m.visible = false
    tri.add(m)
    return { m, x0, y0, x1, y1, len, ang: Math.atan2(y1 - y0, x1 - x0) }
  }
  const strips = {
    left: strip(-TRI.w / 2, TRI.h, -TRI.flat / 2, 0),
    bridge: strip(-TRI.flat / 2, 0, TRI.flat / 2, 0),
    right: strip(TRI.flat / 2, 0, TRI.w / 2, TRI.h),
  }
  const setStrip = (s, p) => {
    s.m.visible = p > 0.002
    if (!s.m.visible) return
    const l = s.len * p
    s.m.scale.x = l
    s.m.position.set(s.x0 + ((s.x1 - s.x0) * p) / 2, s.y0 + ((s.y1 - s.y0) * p) / 2, 0)
    s.m.rotation.z = s.ang
  }
  // the post and arm that carry the spring, the spring itself
  const post = new THREE.Group()
  dev.add(post)
  const arm = new THREE.Group()
  const springMat = new THREE.MeshStandardMaterial({ color: '#d0d4d8', metalness: 0.85, roughness: 0.28, envMap: shine, envMapIntensity: 0.9 })
  let spring = null
  {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 2.05, 14), mats.steel)
    pole.position.set(POST.x, TOP + 1.025, POST.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 20), mats.paint)
    foot.position.set(POST.x, TOP + 0.02, POST.z)
    post.add(pole, foot)
    solids.push(circle(POST.x, POST.z, 0.2))
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 14), mats.paint)
    collar.position.set(POST.x, 0, POST.z)
    const bar = new THREE.Mesh(rbox(POST.x - DEV.x, 0.045, 0.07, 0.012), mats.paint)
    bar.position.set((POST.x + DEV.x) / 2, 0, POST.z)
    const nib = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 10), mats.steel)
    nib.position.set(DEV.x, -0.04, POST.z)
    arm.add(collar, bar, nib)
    spring = new THREE.Mesh(new THREE.TubeGeometry(new Helix(SPR.up, 0.06, 7), 80, 0.011, 5, false), springMat)
    spring.position.set(DEV.x, -0.05, POST.z)
    arm.add(spring)
    dev.add(arm)
  }
  const springHit = new THREE.Group()
  springHit.add(hitBox(0.32, 0.6, 0.3, 0, 0, 0))
  dev.add(springHit)
  const rebuildSpring = len => {
    spring.geometry.dispose()
    spring.geometry = new THREE.TubeGeometry(new Helix(len, 0.06, 7), 80, 0.011, 5, false)
  }
  // the gold foil roll, on a spindle
  const foilGroup = new THREE.Group()
  {
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.22, 24), goldMat)
    roll.rotation.z = Math.PI / 2
    roll.position.y = 0.12
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.26, 12), mats.paint)
    core.rotation.z = Math.PI / 2
    core.position.y = 0.12
    const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.2), mats.paint)
    for (const s of [-1, 1]) {
      const c = cheek.clone()
      c.position.set(s * 0.14, 0.1, 0)
      foilGroup.add(c)
    }
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.004, 0.12), goldMat)
    tongue.position.set(0, 0.03, 0.14)
    foilGroup.add(roll, core, tongue, hit(0.22, 0, 0.12, 0.04))
    foilGroup.position.set(FOIL.x, TOP, FOIL.z)
    root.add(foilGroup)
    tag(E.tags.foil, FOIL.x, TOP + 0.4, FOIL.z + 0.02, 0.065)
  }
  // the razor blade: a thin steel blade with its slots and a dark cardboard sleeve, resting on the bench
  const razor = new THREE.Group()
  const razorRest = new THREE.Vector3(RAZOR.x, TOP + 0.075, RAZOR.z)
  {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 0.2), new THREE.MeshStandardMaterial({ color: '#e4e8ec', metalness: 0.6, roughness: 0.3, emissive: '#6a7078', emissiveIntensity: 0.5, envMap: shine, envMapIntensity: 0.8 }))
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.005, 0.012), new THREE.MeshStandardMaterial({ color: '#f4f6f8', metalness: 1, roughness: 0.15, envMap: shine, envMapIntensity: 1.3 }))
    edge.position.z = -0.1
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.006, 0.03), mats.bakelite)
    slot.position.set(0, 0, 0.02)
    const sleeve = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.008, 0.06), mat('#7a2a2a'))
    sleeve.position.set(0, 0.002, 0.1)
    razor.add(blade, edge, slot, sleeve, hit(0.2, 0, 0.05, 0))
    razor.position.copy(razorRest)
    root.add(razor)
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.06), mats.wood)
    block.position.set(RAZOR.x, TOP + 0.03, RAZOR.z + 0.1)
    root.add(block)
    tag(E.tags.razor, RAZOR.x + 0.5, TOP + 0.05, RAZOR.z + 0.3, 0.065)
  }
  // the wires: emitter from the microphone to the triangle's left corner, collector from its right corner to the
  // battery, on to the headphones; a thin black one from the base to each
  const wires = {
    emitter: wireMesh([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)], 0.011, copperMat),
    collector: wireMesh([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)], 0.011, copperMat),
  }
  root.add(wires.emitter, wires.collector)
  const micPort = new THREE.Vector3(MIC.x + 0.04, TOP + 0.74, MIC.z + 0.02)
  const battPort = new THREE.Vector3(BATT.x - 0.12, TOP + 0.33, BATT.z + 0.02)
  const corner = (sx, k) => new THREE.Vector3(DEV.x + sx * TRI.w / 2, TIP_Y + HOVER * (1 - k) + TRI.h, DEV.z)
  const bez = (a, c, b, n = 8) => new THREE.QuadraticBezierCurve3(a, c, b).getPoints(n)
  const rewire = k => {
    const l = corner(-1, k)
    const r = corner(1, k)
    wireMesh(bez(micPort, new THREE.Vector3((micPort.x + l.x) / 2, Math.min(micPort.y, l.y) - 0.25, DEV.z + 0.18), l), 0.011, copperMat, wires.emitter)
    wireMesh(bez(r, new THREE.Vector3((r.x + battPort.x) / 2 + 0.1, Math.min(r.y, battPort.y) - 0.35, DEV.z + 0.42), battPort), 0.011, copperMat, wires.collector)
  }
  {
    const baseL = new THREE.Vector3(DEV.x - 0.36, TOP + 0.12, DEV.z + BASE.d / 2 + 0.03)
    const w1 = wireMesh(bez(baseL, new THREE.Vector3(MIC.x + 0.2, TOP + 0.0, DEV.z + 0.62), new THREE.Vector3(MIC.x + 0.02, TOP + 0.05, MIC.z + 0.12)), 0.008, wireBlack)
    const w2 = wireMesh(bez(baseL, new THREE.Vector3(BATT.x - 0.1, TOP + 0.0, DEV.z + 0.66), new THREE.Vector3(BATT.x - 0.05, TOP + 0.3, BATT.z + 0.2), 10), 0.008, wireBlack)
    root.add(w1, w2)
  }
  rewire(0)
  // build-state animation values
  const A1 = { fp: 0, pk: 0, cut: 0 }
  const lensModeFor = () => {
    const slit = A1.cut > 0.62
    const press = A1.pk > 0.85
    const foil = A1.fp > 0.55
    if (press && slit) return 'two'
    if (press) return 'one'
    if (slit) return 'gap'
    return foil ? 'foil' : 'plastic'
  }

  const buildPanel = lv => ({
    title: E.build.title,
    color,
    blocks: [
      {
        buttons: [
          { label: E.build.buttons.foil, onClick: () => buildStep('foil') },
          { label: E.build.buttons.razor, onClick: () => buildStep('razor') },
          { label: S1.press ? E.build.buttons.lift : E.build.buttons.spring, onClick: () => buildStep('spring') },
          { label: E.build.buttons.again, onClick: () => buildStep('again') },
        ],
      },
      ...E.build.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const refreshPanel = (title, fn) => {
    if (ctx.store.get().panel?.title === title) ctx.showPanel(fn)
  }
  function buildStep(what) {
    const lv = level()
    const tell = k => say(at(E.build.says[k], lv))
    if (what === 'foil') {
      if (S1.foil) return tell('already')
      S1.foil = 1
      tell('foil')
    } else if (what === 'razor') {
      if (!S1.foil) return tell('needFoil')
      if (S1.slit) return tell('already')
      if (S1.press) return tell('needLift')
      S1.slit = 1
      tell('razor')
    } else if (what === 'spring') {
      if (!S1.foil) return tell('needFoil')
      if (S1.press) {
        S1.press = 0
        tell('lifted')
      } else {
        S1.press = 1
        tell(S1.slit ? 'spring' : 'one')
        if (S1.slit) ex.discover('build', buildPanel, 3.4)
      }
    } else if (what === 'again') {
      S1.foil = S1.slit = S1.press = 0
      A1.cut = 0
      tell('again')
    } else return
    refreshPanel(E.build.title, buildPanel)
    share('build')
  }
  clickable(foilGroup, () => buildStep('foil'))
  clickable(razor, () => buildStep('razor'))
  clickable(springHit, () => buildStep('spring'), { reach: 5.5 })
  const buildItem = ex.add({
    id: 'build',
    x: -1.3,
    z: -2.1,
    radius: 1.8,
    manual: true,
    label: E.build.label,
    verb: () => {
      if (!S1.foil) return E.build.hints.foil
      if (S1.press && !S1.slit) return E.build.hints.lift
      if (!S1.slit) return E.build.hints.razor
      if (!S1.press) return E.build.hints.spring
      return E.build.hints.done
    },
    focus: { x: DEV.x - 0.15, y: 1.55, z: DEV.z, size: 3.0 },
    act: () => ctx.showPanel(buildPanel),
  })
  focusBy(buildItem, buildItem.focus, () => ({ x: DEV.x - 0.15, y: 1.55, z: DEV.z, size: 2.6, width: 2.7 }))
  const buildSet = (s, liveSet) => {
    S1.foil = s?.foil ? 1 : 0
    S1.slit = s?.slit && S1.foil ? 1 : 0
    S1.press = s?.press && S1.foil ? 1 : 0
    if (!liveSet) {
      A1.fp = S1.foil
      A1.cut = S1.slit
      A1.pk = S1.press
    }
    refreshPanel(E.build.title, buildPanel)
  }
  updates.push((dt, t) => {
    // the foil wraps down one edge, over the tip and up the other
    A1.fp = S1.foil ? Math.min(1, A1.fp + dt / 1.3) : Math.max(0, A1.fp - dt * 3)
    setStrip(strips.left, span(0, 0.45, A1.fp))
    setStrip(strips.bridge, span(0.45, 0.55, A1.fp))
    setStrip(strips.right, span(0.55, 1, A1.fp))
    // the razor flies in, rises through the foil at the tip, and goes home
    if (S1.slit) A1.cut = Math.min(1, A1.cut + dt / 2.4)
    else A1.cut = 0
    const c = A1.cut
    const bridgeFall = clamp((c - 0.58) / 0.3)
    if (S1.slit && A1.fp >= 1) {
      strips.bridge.m.visible = bridgeFall < 1
      if (strips.bridge.m.visible) {
        strips.bridge.m.position.y = -bridgeFall * bridgeFall * 0.6
        strips.bridge.m.rotation.z = bridgeFall * 4
        strips.bridge.m.scale.y = 1 - bridgeFall
      }
    } else {
      strips.bridge.m.scale.y = 1
    }
    const k = A1.pk
    A1.pk = S1.press ? Math.min(1, A1.pk + dt / 0.75) : Math.max(0, A1.pk - dt / 0.6)
    const kk = ease(A1.pk)
    const hover = HOVER * (1 - kk)
    tri.position.set(DEV.x, TIP_Y + hover, DEV.z)
    const len = lerp(SPR.up, SPR.down, kk)
    arm.position.set(0, TIP_Y + hover + TRI.h + len + 0.05, 0)
    springHit.position.set(DEV.x, TIP_Y + hover + TRI.h + len / 2 + 0.05, POST.z)
    if (k !== A1.pk) {
      rebuildSpring(len)
      rewire(kk)
    }
    // the razor: rest, fly to under the tip, thrust up, fly home
    const bridgeY = TIP_Y + HOVER
    const under = new THREE.Vector3(DEV.x, bridgeY - 0.17, DEV.z)
    if (S1.slit && c > 0 && c < 1) {
      const fly = span(0, 0.3, c)
      const thrust = span(0.48, 0.6, c) - span(0.7, 0.78, c)
      const home = span(0.78, 1, c)
      const stand = fly * (1 - home)
      const p = razorRest.clone().lerp(under, stand)
      p.y += Math.sin(Math.PI * fly) * 0.25 * (1 - home) + thrust * 0.1
      razor.position.copy(p)
      // the blade turns from lying flat to standing in the plane across the tip, its edge up
      razor.quaternion.slerpQuaternions(RAZOR_Q0, RAZOR_Q1, stand)
    } else {
      razor.position.copy(razorRest)
      razor.quaternion.copy(RAZOR_Q0)
    }
    // the lens follows what is on the bench
    if (!(L.mode === 'two' && lensModeFor() === 'two')) setLensMode(lensModeFor())
    else setLensMode('two')
  })

  // ======== 2. make it louder ========
  // the microphone: a round grille on a stalk, sound arcs coming at it while someone speaks
  const micGroup = new THREE.Group()
  const micRings = soundRings({ n: 3, r0: 0.12, r1: 0.5, arc: 0.8, dir: Math.PI, speed: 0.9 })
  {
    const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.04, 22), mats.bakelite)
    baseDisc.position.y = 0.02
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.62, 10), mats.steel)
    stalk.position.y = 0.34
    const head = new THREE.Group()
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.022, 10, 28), mats.steel)
    const gTex = canvasTex(128, 128, (g, w) => {
      g.fillStyle = '#26282c'
      g.fillRect(0, 0, w, w)
      g.fillStyle = '#c9ced4'
      for (let y = 8; y < w; y += 12) g.fillRect(0, y, w, 4)
      g.strokeStyle = '#1a1b1e'
      g.lineWidth = 6
      g.beginPath()
      g.moveTo(w / 2, 0)
      g.lineTo(w / 2, w)
      g.stroke()
    })
    textures.push(gTex)
    const grille = new THREE.Mesh(new THREE.CircleGeometry(0.15, 28), new THREE.MeshStandardMaterial({ map: gTex, roughness: 0.4, metalness: 0.6, envMap: shine, envMapIntensity: 0.6 }))
    grille.position.z = 0.02
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.07, 28), mats.bakelite)
    body.rotation.x = Math.PI / 2
    body.position.z = -0.03
    const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.012, 8, 20, Math.PI), mats.steel)
    yoke.rotation.z = Math.PI
    head.add(ring, grille, body, yoke)
    head.position.y = 0.72
    micGroup.add(baseDisc, stalk, head, hit(0.26, 0, 0.72, 0.05), hit(0.12, 0, 0.1, 0))
    micRings.group.position.set(-0.12, 0.72, 0.1)
    micGroup.add(micRings.group)
    micGroup.position.set(MIC.x, TOP, MIC.z)
    root.add(micGroup)
    tag(E.tags.mic, MIC.x, TOP - 0.08, MIC.z + 0.42, 0.07)
  }
  // the scope: a heavy grey set with a round screen, two traces on it
  const scopeTex = canvasTex(256, 256)
  textures.push(scopeTex)
  const SC = { clock: 0, dirty: true, lv: '' }
  {
    const g = new THREE.Group()
    const body = new THREE.Mesh(rbox(0.78, 0.74, 0.5, 0.03), mat('#59645a', { roughness: 0.55, metalness: 0.2 }))
    body.position.y = 0.4
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.035, 10, 36), mats.bakelite)
    bezel.position.set(0, 0.5, 0.25)
    const screen = new THREE.Mesh(new THREE.CircleGeometry(0.265, 40), new THREE.MeshBasicMaterial({ map: scopeTex, toneMapped: false }))
    screen.position.set(0, 0.5, 0.252)
    g.add(body, bezel, screen)
    for (let i = 0; i < 5; i++) {
      const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.034, 0.04, 14), i % 2 ? mats.brass : mats.bakelite)
      kn.rotation.x = Math.PI / 2
      kn.position.set(-0.28 + i * 0.14, 0.14, 0.26)
      g.add(kn)
    }
    for (const sx of [-1, 1]) {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.4), mats.rubber)
      foot.position.set(sx * 0.3, 0.015, 0)
      g.add(foot)
    }
    g.position.set(SCOPE.x, TOP, SCOPE.z)
    root.add(g)
    tag(E.tags.scope, SCOPE.x, TOP - 0.08, SCOPE.z + 0.42, 0.07)
  }
  const drawScope = (g, w, h) => {
    const lv = level()
    g.fillStyle = '#04100a'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(60,150,90,0.25)'
    g.lineWidth = 1
    for (let i = 1; i < 8; i++) {
      g.beginPath()
      g.moveTo((i * w) / 8, 0)
      g.lineTo((i * w) / 8, h)
      g.moveTo(0, (i * h) / 8)
      g.lineTo(w, (i * h) / 8)
      g.stroke()
    }
    const bandY = [h * 0.3, h * 0.7]
    const half = h * 0.17
    g.strokeStyle = 'rgba(60,150,90,0.5)'
    for (const y of bandY) {
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(w, y)
      g.stroke()
    }
    g.font = '700 15px Outfit'
    g.textAlign = 'left'
    g.fillStyle = 'rgba(125,255,176,0.8)'
    g.fillText(at(E.amp.scope.in, lv), 30, bandY[0] - half - 3)
    g.fillText(at(E.amp.scope.out, lv), 30, bandY[1] - half - 3)
    const speaking = SC.u > 0 && SC.u < 1
    const upTo = S2.talks > 0 ? (speaking ? SC.u : 1) : 0
    if (upTo <= 0) return
    const gn = gain()
    const trace = (y, amp) => {
      g.strokeStyle = CRT
      g.lineWidth = 2.4
      g.shadowColor = CRT
      g.shadowBlur = 6
      g.beginPath()
      const x0 = 18
      const x1 = w - 18
      for (let x = x0; x <= x0 + (x1 - x0) * upTo; x += 1.5) {
        const u = (x - x0) / (x1 - x0)
        const v = Math.tanh(voice(u) * amp * 1.0) * half
        if (x === x0) g.moveTo(x, y - v)
        else g.lineTo(x, y - v)
      }
      g.stroke()
      g.shadowBlur = 0
      if (speaking) {
        g.fillStyle = '#d8ffe8'
        g.beginPath()
        g.arc(x0 + (x1 - x0) * upTo, y - Math.tanh(voice(upTo) * amp) * half, 3.2, 0, TAU)
        g.fill()
      }
    }
    trace(bandY[0], 0.5)
    // out: the same voice, bigger when the transistor and its battery are on (the gain), a flat line otherwise
    trace(bandY[1], gn > 0 ? 0.5 * gn : 0)
  }
  SC.u = 0
  // the battery box with its knife switch on the front
  const battGroup = new THREE.Group()
  let blade = null
  {
    const bx = new THREE.Mesh(rbox(0.5, 0.3, 0.3, 0.015), mats.wood)
    bx.position.y = 0.15
    const plate = new THREE.Mesh(rbox(0.3, 0.24, 0.02, 0.008), mats.bakelite)
    plate.position.set(0.04, 0.15, 0.16)
    battGroup.add(bx, plate)
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.04, 10), mats.brass)
      post.position.set(sx * 0.19, 0.32, 0)
      battGroup.add(post)
    }
    // the switch: a hinge at the left, a jaw at the right, a brass blade between
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.03, 10), mats.brass)
    hinge.rotation.x = Math.PI / 2
    hinge.position.set(-0.06, 0.15, 0.185)
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.025), mats.brass)
    jaw.position.set(0.15, 0.15, 0.185)
    blade = new THREE.Group()
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.022, 0.012), mats.brass)
    bar.position.x = 0.11
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.07, 0.04), mats.bakelite)
    handle.position.set(0.2, 0, 0.0)
    blade.add(bar, handle)
    blade.position.set(-0.06, 0.15, 0.195)
    battGroup.add(hinge, jaw, blade, hit(0.3, 0.02, 0.2, 0.1))
    battGroup.position.set(BATT.x, TOP, BATT.z)
    root.add(battGroup)
    tag(E.tags.battery, BATT.x, TOP - 0.08, BATT.z + 0.42, 0.07)
  }
  // headphones on a stand, with their sound arcs
  const phones = new THREE.Group()
  const phoneRings = [soundRings({ n: 4, r0: 0.18, r1: 0.72, arc: 0.75, dir: 0.0, speed: 0.75 }), soundRings({ n: 4, r0: 0.18, r1: 0.72, arc: 0.75, dir: Math.PI, speed: 0.75 })]
  {
    const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.04, 22), mats.bakelite)
    baseDisc.position.y = 0.02
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.62, 10), mats.steel)
    pole.position.y = 0.33
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 14, Math.PI * 1.2), mats.steel)
    hook.position.set(0, 0.67, 0)
    phones.add(baseDisc, pole, hook)
    const set = new THREE.Group()
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.022, 10, 36, Math.PI), mats.bakelite)
    set.add(band)
    for (const sx of [-1, 1]) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 26), mats.bakelite)
      cup.rotation.z = Math.PI / 2
      cup.position.set(sx * 0.27, 0, 0)
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.012, 8, 26), mats.steel)
      rim.rotation.y = Math.PI / 2
      rim.position.set(sx * 0.315, 0, 0)
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.012, 22), mat('#2a2a2c'))
      pad.rotation.z = Math.PI / 2
      pad.position.set(sx * 0.322, 0, 0)
      set.add(cup, rim, pad)
    }
    set.position.set(0, 0.5, 0)
    // the band hangs over the hook: its top touches the hook, the cups face each other
    set.position.y = 0.4
    phones.add(set, hit(0.4, 0, 0.45, 0.04))
    phoneRings[0].group.position.set(0.4, 0.4, 0.04)
    phoneRings[1].group.position.set(-0.4, 0.4, 0.04)
    phones.add(phoneRings[0].group, phoneRings[1].group)
    phones.position.set(PHONES.x, TOP, PHONES.z)
    root.add(phones)
    tag(E.tags.phones, PHONES.x, TOP - 0.08, PHONES.z + 0.42, 0.07)
  }
  const A2 = { talk: 0, sw: 0, said: 'low' }
  const levelOf = v => (v < 0.04 ? 'none' : v < 0.34 ? 'low' : v < 0.67 ? 'mid' : 'high')
  const sayNext = (keyForState, lv = level()) => say(at(E.amp.says[keyForState], lv))
  const ampPanel = lv => ({
    title: E.amp.title,
    color,
    blocks: [
      {
        slider: {
          label: E.amp.slider,
          min: 0,
          max: 1,
          step: 0.01,
          value: S2.cur,
          onInput: v => setCur(v),
          format: v => E.amp.levels[levelOf(v)],
          live: () => S2.cur,
        },
      },
      {
        buttons: [
          { label: E.amp.buttons.mic, onClick: () => ampStep('mic') },
          { label: S2.power ? E.amp.buttons.off : E.amp.buttons.on, onClick: () => ampStep('switch') },
        ],
      },
      ...E.amp.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  // why nothing gets louder yet (no transistor, one point), or what it does when it works
  const reasonNot = () => (!built() ? (S1.foil && S1.press && !S1.slit ? 'onePoint' : 'needBuild') : null)
  function ampStep(what) {
    const lv = level()
    if (what === 'mic') {
      S2.talks++
      A2.talk = 0.0001
      SC.u = 0.0001
      const why = reasonNot()
      if (why) sayNext(why, lv)
      else sayNext(S2.power ? 'micOn' : 'mic', lv)
    } else if (what === 'switch') {
      S2.power = S2.power ? 0 : 1
      const why = reasonNot()
      if (why) sayNext(why, lv)
      else sayNext(S2.power ? 'on' : 'off', lv)
    } else return
    if (built() && S2.power) ex.discover('amp', ampPanel, 3.4)
    SC.dirty = true
    refreshPanel(E.amp.title, ampPanel)
    share('amp')
  }
  let curSend = null
  function setCur(v) {
    const next = clamp(Number(v) || 0)
    if (next === S2.cur) return
    const was = levelOf(S2.cur)
    const up = next > S2.cur
    S2.cur = next
    SC.dirty = true
    const now = levelOf(next)
    if (now !== was && built() && S2.power) sayNext(now === 'none' ? 'none' : up ? 'louder' : 'quieter')
    if (!curSend) {
      curSend = setTimeout(() => {
        curSend = null
        share('amp')
      }, 250)
    }
  }
  clickable(micGroup, () => ampStep('mic'))
  clickable(battGroup, () => ampStep('switch'))
  const ampItem = ex.add({
    id: 'amp',
    x: 1.5,
    z: -2.1,
    radius: 1.8,
    manual: true,
    label: E.amp.label,
    verb: () => (!built() ? E.amp.hints.build : !S2.talks ? E.amp.hints.mic : !S2.power ? E.amp.hints.battery : E.amp.hints.play),
    focus: { x: 0.0, y: 1.5, z: DEV.z, size: 3.3, width: 5.4 },
    act: () => ctx.showPanel(ampPanel),
  })
  focusBy(ampItem, ampItem.focus, () => ({ x: 0.0, y: 1.5, z: DEV.z, size: 3.3, width: 5.4 }))
  const ampSet = (s, liveSet) => {
    const talks = Math.max(0, Number(s?.talks) || 0)
    const talked = talks > S2.talks
    S2.talks = talks
    S2.power = s?.power ? 1 : 0
    S2.cur = clamp(Number(s?.cur) || 0)
    if (liveSet && talked) {
      A2.talk = 0.0001
      SC.u = 0.0001
    } else if (!liveSet) SC.u = 0
    SC.dirty = true
    refreshPanel(E.amp.title, ampPanel)
  }
  updates.push((dt, t) => {
    // the knife switch closes: the blade swings down into its jaw
    A2.sw = damp(A2.sw, S2.power, 9, dt)
    blade.rotation.z = (1 - A2.sw) * 1.15
    // speech: the arcs come in, the scope's beam sweeps across and the headphones sound
    if (A2.talk > 0) {
      A2.talk += dt / 2.6
      if (A2.talk >= 1) A2.talk = 0
    }
    const sp = A2.talk
    SC.u = sp > 0 ? clamp(sp / 0.72) : 0
    if (sp > 0 && SC.u >= 1) SC.u = 0.9999
    if (sp === 0 && SC.u !== 0) SC.u = 0
    micRings.set(t, sp > 0 ? 0.8 : 0)
    const env = sp > 0 && sp < 0.8 ? voiceEnv(sp / 0.72) : 0
    const loud = built() && S2.power ? (0.3 + 0.7 * S2.cur) * env : 0.05 * env
    phoneRings[0].set(t, loud)
    phoneRings[1].set(t, loud)
    // the scope redraws while the beam sweeps or something changed
    SC.clock -= dt
    const lv = level()
    if (lv !== SC.lv) {
      SC.lv = lv
      SC.dirty = true
    }
    if ((sp > 0 || SC.dirty) && SC.clock <= 0) {
      SC.clock = light ? 0.08 : 0.04
      scopeTex.userData.redraw(drawScope)
      SC.dirty = false
    }
    // the lens: holes leave the emitter point and drift to the collector point
    L.cur = S2.cur
    L.power = built() && S2.power ? 1 : 0
    if (L.mode === 'two') {
      const rate = S2.cur * 4.5
      L.spawn += dt * rate
      while (L.spawn >= 1) {
        L.spawn -= 1
        if (L.holes.length < 14) L.holes.push({ s: 0, j: Math.random() * 2 - 1 })
      }
      for (const o of L.holes) o.s += dt * 0.7
      const before = L.holes.length
      L.holes = L.holes.filter(o => (L.power ? o.s < 1 : o.s < 0.62))
      if (L.power && L.holes.length < before) L.flash = 1
      L.flash = Math.max(0, L.flash - dt * 4)
      L.clock -= dt
      if (L.clock <= 0) {
        L.clock = light ? 0.12 : 0.066
        redrawLens()
      }
    } else {
      L.holes.length = 0
      if (L.dirty) redrawLens()
    }
  })

  // ======== 3. a tube or a crystal? ========
  // a long table on the east wall
  {
    const t = new THREE.Group()
    const top = new THREE.Mesh(new THREE.BoxGeometry(TABLE3.w, 0.05, TABLE3.l), mats.wood)
    top.position.y = TABLE3.top - 0.025
    t.add(top)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, TABLE3.top - 0.05, 10), mats.wood)
      leg.position.set(sx * (TABLE3.w / 2 - 0.08), (TABLE3.top - 0.05) / 2, sz * (TABLE3.l / 2 - 0.1))
      t.add(leg)
    }
    t.position.set(TABLE3.x, 0, TABLE3.z)
    root.add(t)
    solids.push(box(TABLE3.x, TABLE3.z, TABLE3.w, TABLE3.l))
  }
  const R = { warm: 0, tubeSay: false }
  const T3Y = TABLE3.top
  // the tube radio: a wooden cabinet with a grille and a dial, and beside it its chassis out of the cabinet
  const tubeSet = new THREE.Group()
  tubeSet.position.set(TUBES.x, T3Y, TUBES.z)
  tubeSet.rotation.y = -Math.PI / 2
  root.add(tubeSet)
  const dialMat = new THREE.MeshBasicMaterial({ color: '#403020', toneMapped: false })
  const tubeGlass = new THREE.MeshStandardMaterial({ color: '#d8e6e8', roughness: 0.08, transparent: true, opacity: 0.3, depthWrite: false, envMap: shine, envMapIntensity: 1.1 })
  const tubeHot = []
  let tubeLight = null
  const shimmer = { geo: null, pts: null }
  const tubeRingsE = soundRings({ n: 3, r0: 0.15, r1: 0.6, arc: 0.7, dir: 0.5, color: '#ffb070', speed: 0.7 })
  {
    const cab = new THREE.Mesh(rbox(0.74, 0.46, 0.34, 0.05), mat('#5a3a22', { roughness: 0.45, metalness: 0.05 }))
    cab.position.set(-0.45, 0.23, 0)
    tubeSet.add(cab)
    const front = canvasTex(512, 320, (g, w, h) => {
      g.fillStyle = '#4a2e1a'
      g.fillRect(0, 0, w, h)
      // the cloth grille on the left, with a gilt frame
      g.fillStyle = '#8a7a52'
      g.fillRect(34, 40, 244, 240)
      g.strokeStyle = 'rgba(40,30,16,0.45)'
      g.lineWidth = 1
      for (let i = 34; i < 278; i += 4) {
        g.beginPath()
        g.moveTo(i, 40)
        g.lineTo(i, 280)
        g.stroke()
      }
      for (let j = 40; j < 280; j += 4) {
        g.beginPath()
        g.moveTo(34, j)
        g.lineTo(278, j)
        g.stroke()
      }
      g.strokeStyle = '#c9a14a'
      g.lineWidth = 6
      g.strokeRect(34, 40, 244, 240)
      g.fillStyle = '#c9a14a'
      g.font = '700 22px Outfit'
      g.textAlign = 'center'
    })
    textures.push(front)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.45), new THREE.MeshStandardMaterial({ map: front, roughness: 0.5 }))
    face.position.set(-0.45, 0.23, 0.172)
    tubeSet.add(face)
    // the dial: a lit scale in a window
    const dial = canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#f0e0b0'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#2a1d10'
      g.font = '700 16px Outfit'
      g.textAlign = 'center'
      const marks = ['55', '70', '90', '110', '140', '160']
      marks.forEach((m, i) => g.fillText(m, 24 + i * 41.5, 98))
      for (let i = 0; i < 40; i++) g.fillRect(14 + i * 5.9, 24, i % 4 === 0 ? 3 : 1.5, i % 4 === 0 ? 34 : 20)
      g.fillStyle = '#b0261c'
      g.fillRect(120, 14, 3, 80)
    })
    textures.push(dial)
    dialMat.map = dial
    const dialPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.125), dialMat)
    dialPlane.position.set(-0.45 + 0.19, 0.23 + 0.08, 0.176)
    tubeSet.add(dialPlane)
    // two knobs, at the places painted on the front
    tubeSet.children.filter(c => c.geometry?.type === 'CylinderGeometry' && c.position.z === 0.19).forEach(c => tubeSet.remove(c))
    for (const kx of [-0.45 + 0.056, -0.45 + 0.205]) {
      const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.04, 0.045, 16), mats.bakelite)
      kn.rotation.x = Math.PI / 2
      kn.position.set(kx, 0.23 - 0.073, 0.19)
      tubeSet.add(kn)
    }
    // the chassis out of its cabinet: a steel pan, five tubes, a transformer, a big can
    const pan = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.035, 0.34), mats.steel)
    pan.position.set(0.3, 0.018, 0)
    tubeSet.add(pan)
    const hotMat = new THREE.MeshBasicMaterial({ color: '#2a1a10' })
    const spots = [[0.12, 0.08], [0.28, 0.1], [0.44, 0.08], [0.2, -0.08], [0.38, -0.08]]
    for (const [x, z] of spots) {
      const g = new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.15, 4, 12), tubeGlass)
      g.position.set(x, 0.035 + 0.11, z)
      g.renderOrder = 3
      const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.13, 8), hotMat)
      inner.position.set(x, 0.035 + 0.11, z)
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.036, 0.02, 12), mats.bakelite)
      cap.position.set(x, 0.045, z)
      tubeSet.add(g, inner, cap)
    }
    tubeHot.push(hotMat)
    const trans = new THREE.Mesh(rbox(0.12, 0.12, 0.12, 0.01), mat('#2a2a2e', { metalness: 0.4 }))
    trans.position.set(0.55, 0.1, -0.08)
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 14), mats.steel)
    can.position.set(0.52, 0.1, 0.1)
    tubeSet.add(trans, can)
    // the heat shimmer: faint warm motes rising from the tubes
    const n = light ? 10 : 22
    const pos = new Float32Array(n * 3)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffb070', size: 0.07, map: soft, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
    pts.frustumCulled = false
    tubeSet.add(pts)
    shimmer.geo = g
    shimmer.pts = pts
    shimmer.seed = Array.from({ length: n }, (_, i) => [Math.random(), Math.random() * 100, i])
    tubeLight = new THREE.PointLight('#ff9a50', 0, 1.6, 2)
    tubeLight.position.set(0.3, 0.6, 0.0)
    tubeSet.add(tubeLight)
    tubeRingsE.group.position.set(-0.45 - 0.2, 0.25, 0.2)
    tubeSet.add(tubeRingsE.group)
    tubeSet.add(hitBox(0.78, 0.5, 0.4, -0.45, 0.25, 0), hitBox(0.62, 0.4, 0.4, 0.3, 0.2, 0))
    tag(E.tags.tube, TABLE3.x - TABLE3.w / 2 + 0.1, T3Y + 0.04, TUBES.z - 0.45, 0.08, -Math.PI / 2)
  }
  // the pocket radio of 1954: a red plastic case, a round speaker grille, a dial wheel, leaning on a wedge
  const pocket = new THREE.Group()
  pocket.position.set(POCKET.x, T3Y, POCKET.z)
  pocket.rotation.y = -Math.PI / 2
  root.add(pocket)
  const pocketRings = soundRings({ n: 3, r0: 0.12, r1: 0.5, arc: 0.7, dir: 0.6, color: BLUE, speed: 0.9 })
  {
    const wedge = new THREE.Mesh(rbox(0.5, 0.06, 0.2, 0.01), mats.wood)
    wedge.position.set(0, 0.03, -0.02)
    pocket.add(wedge)
    const inner = new THREE.Group()
    inner.rotation.x = -0.22
    inner.position.set(0, 0.2, 0)
    const body = new THREE.Mesh(rbox(0.44, 0.26, 0.1, 0.03), mat('#c43a2a', { roughness: 0.35, metalness: 0.05 }))
    inner.add(body)
    const faceTex = canvasTex(512, 300, (g, w, h) => {
      g.fillStyle = '#c43a2a'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#f2ead6'
      g.beginPath()
      g.arc(150, 150, 118, 0, TAU)
      g.fill()
      g.fillStyle = '#8a8a82'
      for (let r = 20; r <= 100; r += 20) {
        const cnt = Math.round((TAU * r) / 17)
        for (let i = 0; i < cnt; i++) {
          g.beginPath()
          g.arc(150 + Math.cos((i / cnt) * TAU) * r, 150 + Math.sin((i / cnt) * TAU) * r, 4.2, 0, TAU)
          g.fill()
        }
      }
      g.beginPath()
      g.arc(150, 150, 4.5, 0, TAU)
      g.fill()
      // a window with a small scale, and a thumb wheel
      g.fillStyle = '#f2ead6'
      g.fillRect(310, 60, 160, 54)
      g.fillStyle = '#2a1d10'
      for (let i = 0; i < 18; i++) g.fillRect(318 + i * 8.4, 70, 1.6, i % 3 === 0 ? 24 : 14)
      g.fillStyle = '#b0261c'
      g.fillRect(380, 64, 3, 46)
      g.fillStyle = '#d8d2c0'
      g.beginPath()
      g.arc(390, 200, 52, 0, TAU)
      g.fill()
      g.strokeStyle = '#8a8472'
      g.lineWidth = 3
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU
        g.beginPath()
        g.moveTo(390 + Math.cos(a) * 40, 200 + Math.sin(a) * 40)
        g.lineTo(390 + Math.cos(a) * 52, 200 + Math.sin(a) * 52)
        g.stroke()
      }
    })
    textures.push(faceTex)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.234), new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.35 }))
    face.position.z = 0.052
    inner.add(face)
    pocketRings.group.position.set(-0.07, 0.01, 0.07)
    inner.add(pocketRings.group, hitBox(0.5, 0.34, 0.2, 0, 0, 0.02))
    pocket.add(inner)
    tag(E.tags.pocket, TABLE3.x - TABLE3.w / 2 + 0.1, T3Y + 0.04, POCKET.z, 0.08, -Math.PI / 2)
  }
  // the board above the table: size, power, warm-up, what is inside; each column fills in when its radio is tried
  const boardTex = canvasTex(1024, 460)
  textures.push(boardTex)
  const B = { dirty: true, clock: 0, lv: '', warmShown: -1 }
  {
    const bg = new THREE.Group()
    const edge = new THREE.Mesh(rbox(3.06, 1.34, 0.05, 0.03), new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 0.9, roughness: 0.4 }))
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2.96, 1.33 * 0.93), new THREE.MeshBasicMaterial({ map: boardTex, toneMapped: false }))
    face.position.z = 0.03
    bg.add(edge, face)
    stage.onWall(bg, 'e', TABLE3.z - 0.1, 2.15, 0.04)
  }
  const drawBoard = (g, w, h) => {
    const lv = level()
    const d = depthOf(lv)
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textBaseline = 'middle'
    g.textAlign = 'center'
    g.fillStyle = '#e8f2ff'
    g.font = '700 38px Outfit'
    g.fillText(at(E.radio.board.title, lv), w / 2, 36)
    const cols = [{ x: 560, key: 'tube', tag: E.tags.tube, c: '#ffb070' }, { x: 840, key: 'pocket', tag: E.tags.pocket, c: BLUE }]
    g.font = '700 30px Outfit'
    for (const c of cols) {
      g.fillStyle = c.c
      g.fillText(c.tag.toUpperCase(), c.x, 92)
    }
    const rows = E.radio.board.rows.filter(r => !r.sci || d === 'sci')
    const rh = Math.min(84, (h - 130) / rows.length)
    const tried = { tube: S3.tt, pocket: S3.pt }
    rows.forEach((r, i) => {
      const y = 140 + i * rh
      g.fillStyle = 'rgba(111,208,255,0.1)'
      if (i % 2 === 0) g.fillRect(24, y - rh / 2 + 3, w - 48, rh - 6)
      g.textAlign = 'left'
      g.fillStyle = '#cfd8ee'
      g.font = '700 28px Outfit'
      g.fillText(at(r.label, lv), 46, y)
      g.textAlign = 'center'
      for (const c of cols) {
        let text = tried[c.key] ? at(r[c.key], lv) : E.radio.board.unknown
        // the tube radio's warm-up counts while it heats
        if (c.key === 'tube' && r === E.radio.board.rows[2] && S3.tt) {
          const secs = Math.round(R.warm * 30)
          text = S3.tube && R.warm < 1 ? `${secs} s (${at(E.radio.board.sped, lv)})` : at(r.tube, lv)
        }
        g.fillStyle = tried[c.key] ? '#ffffff' : 'rgba(255,255,255,0.35)'
        const size = text.length > 26 ? 21 : text.length > 18 ? 24 : 27
        g.font = `700 ${size}px Outfit`
        g.fillText(text, c.x, y)
      }
    })
    g.strokeStyle = 'rgba(111,208,255,0.35)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(700, 70)
    g.lineTo(700, h - 20)
    g.stroke()
  }
  const radioPanel = lv => ({
    title: E.radio.title,
    color,
    blocks: [
      {
        buttons: [
          { label: S3.tube ? E.radio.buttons.tubeOff : E.radio.buttons.tube, onClick: () => radioStep('tube') },
          { label: S3.pocket ? E.radio.buttons.pocketOff : E.radio.buttons.pocket, onClick: () => radioStep('pocket') },
        ],
      },
      ...E.radio.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  let bothSaid = false
  function radioStep(what) {
    const lv = level()
    if (what === 'tube') {
      S3.tube = S3.tube ? 0 : 1
      S3.tt = 1
      R.tubeSay = !!S3.tube
      say(at(E.radio.says[S3.tube ? 'tube' : 'tubeOff'], lv))
    } else if (what === 'pocket') {
      S3.pocket = S3.pocket ? 0 : 1
      S3.pt = 1
      say(at(E.radio.says[S3.pocket ? 'pocket' : 'pocketOff'], lv))
    } else return
    if (S3.tt && S3.pt) {
      if (!bothSaid && (S3.tube || S3.pocket)) {
        bothSaid = true
        later(4.2, () => say(at(E.radio.says.both, level())))
      }
      ex.discover('radio', radioPanel, 5.5)
    }
    B.dirty = true
    refreshPanel(E.radio.title, radioPanel)
    share('radio')
  }
  clickable(tubeSet, () => radioStep('tube'), { reach: 5.5 })
  clickable(pocket, () => radioStep('pocket'), { reach: 5.5 })
  const radioItem = ex.add({
    id: 'radio',
    x: 3.0,
    z: 0.1,
    radius: 2.2,
    manual: true,
    label: E.radio.label,
    verb: () => (!S3.tt ? E.radio.hints.tube : !S3.pt ? E.radio.hints.pocket : E.radio.hints.done),
    focus: { x: TABLE3.x - 0.1, y: 1.45, z: TABLE3.z - 0.1, size: 3.1, width: 3.6 },
    act: () => ctx.showPanel(radioPanel),
  })
  focusBy(radioItem, radioItem.focus, () => ({ x: TABLE3.x - 0.1, y: 1.45, z: TABLE3.z - 0.1, size: 3.0, width: 3.2 }))
  const radioSet = (s, liveSet) => {
    const was = S3.tube
    S3.tube = s?.tube ? 1 : 0
    S3.pocket = s?.pocket ? 1 : 0
    S3.tt = s?.tt || S3.tube ? 1 : 0
    S3.pt = s?.pt || S3.pocket ? 1 : 0
    if (S3.tube && !was) R.warm = liveSet ? 0 : 1
    if (!S3.tube) R.warm = liveSet ? R.warm : 0
    B.dirty = true
    refreshPanel(E.radio.title, radioPanel)
  }
  updates.push((dt, t) => {
    // the heaters warm over about half a minute (shown four times faster): glow, dial, shimmer, light
    const was = R.warm
    R.warm = S3.tube ? Math.min(1, R.warm + dt / 7.5) : Math.max(0, R.warm - dt / 5)
    if (R.tubeSay && R.warm >= 1 && was < 1) {
      R.tubeSay = false
      say(at(E.radio.says.ready, level()))
    }
    const w = R.warm
    const hot = new THREE.Color().setRGB(0.16 + 0.84 * w, 0.08 + 0.26 * w + 0.03 * Math.sin(t * 9) * w, 0.05 + 0.02 * w)
    for (const m of tubeHot) m.color.copy(hot)
    dialMat.color.setRGB(0.28 + 0.62 * w, 0.24 + 0.4 * w, 0.2 + 0.1 * w)
    tubeLight.intensity = 0.8 * w
    shimmer.pts.material.opacity = 0.5 * w
    const pos = shimmer.geo.attributes.position
    for (const [a, b, i] of shimmer.seed) {
      const p = (t * 0.22 + b) % 1
      pos.setXYZ(i, 0.12 + a * 0.42 + Math.sin(t * 1.3 + b) * 0.03, 0.22 + p * 0.5, (((b * 7.7) % 1) - 0.5) * 0.2)
    }
    pos.needsUpdate = true
    // the sound arcs: the tube radio plays once its tubes are hot, the pocket radio at once
    tubeRingsE.set(t, S3.tube && w >= 1 ? 0.7 : 0)
    pocketRings.set(t, S3.pocket ? 0.8 : 0)
    // the board
    const lv = level()
    if (lv !== B.lv) {
      B.lv = lv
      B.dirty = true
    }
    const ws = S3.tube && w < 1 ? Math.round(w * 30) : -2
    if (ws !== B.warmShown) {
      B.warmShown = ws
      B.dirty = true
    }
    B.clock -= dt
    if (B.dirty && B.clock <= 0) {
      B.clock = 0.1
      boardTex.userData.redraw(drawBoard)
      B.dirty = false
    }
  })
  redrawLens()
  scopeTex.userData.redraw(drawScope)
  boardTex.userData.redraw(drawBoard)

  // a little dust in the lamplight
  const dust = motes({ count: 160, radius: 5.5, y0: 0.4, y1: 3.0, color: '#ffe2b0', size: 0.022, opacity: 0.22, speed: 0.04, light })
  dust.group.position.set(0, 0, 0)
  root.add(dust.group)
  updates.push((dt, t) => {
    stage.update(t)
    dust.update(t)
  })

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 4.7 },
    spawn: { x: 0, z: 2.0, yaw: 0 },
    hostSpot: { x: -1.7, z: 1.4, yaw: Math.atan2(-1.7, -1.2) },
    back: { x: 0, z: 5.5, rot: Math.PI },
    stand: { x: -3.6, z: 1.8, rot: Math.atan2(3.6, 0.9) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      build: {
        tap: what => buildStep(what), // 'foil', 'razor', 'spring', 'again'
        get state() { return { ...S1, ...A1 } },
        foilAt: () => new THREE.Vector3(FOIL.x, TOP + 0.12, FOIL.z),
        razorAt: () => razor.position.clone().setY(razor.position.y + 0.03),
        springAt: () => springHit.position.clone(),
        triAt: () => tri.position.clone().add(new THREE.Vector3(0, TRI.h / 2, 0)),
        lensAt: () => new THREE.Vector3(LENS.x, LENS.y, LENS.z),
      },
      amp: {
        tap: what => ampStep(what), // 'mic', 'switch'
        set: v => setCur(v),
        get state() { return { ...S2, built: built() } },
        micAt: () => new THREE.Vector3(MIC.x, TOP + 0.72, MIC.z),
        switchAt: () => new THREE.Vector3(BATT.x, TOP + 0.15, BATT.z + 0.2),
        phonesAt: () => new THREE.Vector3(PHONES.x, TOP + 0.4, PHONES.z),
        scopeAt: () => new THREE.Vector3(SCOPE.x, TOP + 0.5, SCOPE.z + 0.25),
      },
      radio: {
        tap: what => radioStep(what), // 'tube', 'pocket'
        get state() { return { ...S3, warm: R.warm } },
        tubeAt: () => new THREE.Vector3(TUBES.x, T3Y + 0.25, TUBES.z - 0.45),
        pocketAt: () => new THREE.Vector3(POCKET.x, T3Y + 0.2, POCKET.z),
        boardAt: () => new THREE.Vector3(ROOM.x1 - 0.05, 2.15, TABLE3.z - 0.1),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { build: buildPanel, amp: ampPanel, radio: radioPanel },
    shared: {
      build: { get: () => ({ foil: S1.foil, slit: S1.slit, press: S1.press }), set: buildSet },
      amp: { get: () => ({ talks: S2.talks, power: S2.power, cur: Math.round(S2.cur * 100) / 100 }), set: ampSet },
      radio: { get: () => ({ tube: S3.tube, pocket: S3.pocket, tt: S3.tt, pt: S3.pt }), set: radioSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (curSend) clearTimeout(curSend)
      for (const tx of textures) tx.dispose()
      for (const g of geos) g.dispose()
      micRings.dispose()
      phoneRings.forEach(r => r.dispose())
      tubeRingsE.dispose()
      pocketRings.dispose()
    },
  }
}
