// Radon's picture "Why did a door spoil the experiment?" as a room (docs/knowledge/picture-rooms.md): the
// picture made into Rutherford's laboratory at McGill University, Montreal, on a winter night around 1900
// (stages/mcgill.js: electric pendant lamps with green shades, oak panelling, round-headed windows onto snowy
// roofs and a spire, a tall door to a cold corridor whose window stands open to the snow). One long bench
// along the back wall holds three stations, each worked by tapping its things (the user, 2026-10-30: pressing
// E through fixed steps felt passive); the prompt names the next tap, E opens the station's panel, whose
// buttons and slider do the same:
// - Owens's plates (left, the picture itself): two brass plates on ebonite posts, a dish of white thorium
//   oxide on the lower one, a wire to a quadrant electrometer whose light spot moves along a scale. The teal
//   emanation hangs between the plates. Tap the door at the end of the room: it swings open, a cold draught
//   with snowflakes swirls along the bench, the gas is blown out sideways and the spot drops and wobbles with
//   the gusts. The window's casement (a tap, or the slider) gives a gentler draught. Tap the glass case and it
//   comes down over the plates on its cord: now the door changes nothing (Rutherford's closed vessel);
// - Rutherford's tube (middle, 1900): bellows, a long brass tube with thorium oxide in paper inside, a
//   cotton-wool plug in a glass sleeve, the insulated cylinder C with its electrode D, a second electrometer,
//   a stopwatch, a chalkboard. Tap the bellows: air carries the emanation through the cotton wool into C
//   (tap the cotton wool to take it out: the reading is the same, so it is a gas, not dust); tap the
//   stopwatch: the air stops, the clock runs (10 times faster, a slider sets it), the spot falls and a chalk
//   point goes on the board every 30 s: half in about a minute (Scientist: Rutherford's own Table III in
//   yellow beside it);
// - the cold trap (right, 1903): a thorium box and a radium tube, each with a rubber bulb, a glass U-tube over
//   a flask of liquid air on a lab jack, and a glass vessel with a zinc sulphide screen and a lump of
//   willemite. Tap the flask to raise it, tap a source: the gas freezes in the U-tube (its glass glows) and
//   nothing comes through; tap the flask again: after a moment the gas rushes into the vessel and the screen
//   lights. Thorium's fades in seconds here (a minute's half-life, sped up); radium's stays, and a days slider
//   halves it every 3.8 days: the radon of this hall.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes. Facts and sources: draught.words.js.
import * as THREE from 'three'
import { canvasTex, at, clamp, damp, fill, smooth } from '../../../wings/noble/kit.js'
import { Particles } from '../../../wings/oxygen/kit.js'
import { mcgillStage } from '../../stages/mcgill.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box } from '../../../../engine/collide.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { DRAUGHT_WORDS } from './draught.words.js'

export const WORDS = DRAUGHT_WORDS

const TAU = Math.PI * 2
const ROOM = { x0: -6.8, x1: 6.8, z0: -6.6, z1: 6.6, h: 4.8 }
const BT = 0.92 // the bench top
const ZL = -5.35 // the line the apparatus stands on
const BENCH = { x0: -4.75, x1: 6.35, z: -5.35, d: 1.2 }
const DOOR = { x: -5.85, w: 1.2, h: 2.5 }
const SPEED = 10 // the emanation's time in this room runs 10 times faster (the panels say so)
const TH_HALF = 55.6 // s, thoron (Rn-220)
const RA_HALF = 3.8215 // days, radon (Rn-222), src/data/elements.json
const LAM = Math.LN2 / TH_HALF
// Owens's plates
const PX = -3.55
const PL = BT + 0.17 // the lower plate
const PU = PL + 0.3 // the upper plate
const CASE = { w: 1.02, h: 0.62, d: 0.66, lift: 0.78 }
const EL1 = { x: -2.6, sx: -1.98 }
const WIN1 = -2.3 // the window behind the plates (its casement opens on its left half)
// Rutherford's tube
const TY = BT + 0.25 // the tube's axis
const T2 = { bellows: -0.62, b0: -0.05, b1: 1.5, s0: 1.56, s1: 1.76, c0: 1.82, c1: 2.42, el: 2.8, sx: 3.28, watch: 0.72 }
const CR = 0.11 // cylinder C's radius
// the cold trap
const T3 = { th: 3.96, ra: 4.34, u0: 4.8, u1: 4.92, v: 5.62, pipe: BT + 0.8, ub: BT + 0.4, cock: 5.28 }
const FLASK = { r: 0.1, h: 0.3, lift: 0.27 }
const VES = { r: 0.085, y0: BT + 0.08, y1: BT + 0.66 }
// Rutherford's Table III (Phil. Mag. 49, 1900): seconds after the air stopped, current as a fraction
const TABLE3 = [[0, 1], [28, 0.69], [62, 0.51], [118, 0.23], [155, 0.14], [210, 0.067], [272, 0.041], [360, 0.018]]

/** The gusts of a draught: never quite steady. */
const gust = t => 0.62 + 0.22 * Math.sin(t * 1.7) + 0.12 * Math.sin(t * 4.3 + 1.1) + 0.06 * Math.sin(t * 9.7 + 2.3)

/** A teal radon mote: a bright core and a soft halo (the seven radon rooms' look: #3cc3d6, halo #6ff0ff). */
function moteTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(235,255,255,1)')
    grd.addColorStop(0.16, 'rgba(120,230,245,1)')
    grd.addColorStop(0.3, 'rgba(60,195,214,0.9)')
    grd.addColorStop(0.5, 'rgba(111,240,255,0.28)')
    grd.addColorStop(1, 'rgba(111,240,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A snowflake: a small soft white dot with a brighter middle. */
function flakeTex() {
  return canvasTex(32, 32, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(235,242,255,0.8)')
    grd.addColorStop(1, 'rgba(220,232,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** The electrometer's scale: a translucent strip lit from behind, divisions 0 to 10. */
function scaleTex() {
  return canvasTex(512, 96, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#d8cdb0')
    bg.addColorStop(1, '#c4b894')
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    g.strokeStyle = '#2a2016'
    g.fillStyle = '#2a2016'
    g.font = '700 26px Outfit, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'top'
    const x0 = 28
    const x1 = w - 28
    for (let i = 0; i <= 50; i++) {
      const x = x0 + ((x1 - x0) * i) / 50
      const big = i % 5 === 0
      g.lineWidth = big ? 3 : 1.5
      g.beginPath()
      g.moveTo(x, h - 4)
      g.lineTo(x, h - (big ? 34 : 18))
      g.stroke()
      if (big) g.fillText(String(i / 5), x, 8)
    }
  }, { mipmaps: false })
}

/** A stopwatch's face: sixty seconds round, a small dial of ten minutes. */
function watchTex() {
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#ece4d0'
    g.beginPath()
    g.arc(w / 2, w / 2, w / 2, 0, TAU)
    g.fill()
    g.strokeStyle = '#1e1810'
    g.fillStyle = '#1e1810'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * TAU - Math.PI / 2
      const r0 = i % 5 ? w * 0.43 : w * 0.39
      g.lineWidth = i % 5 ? 1.5 : 3.5
      g.beginPath()
      g.moveTo(w / 2 + Math.cos(a) * r0, w / 2 + Math.sin(a) * r0)
      g.lineTo(w / 2 + Math.cos(a) * w * 0.47, w / 2 + Math.sin(a) * w * 0.47)
      g.stroke()
    }
    g.font = '700 22px Outfit, sans-serif'
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU - Math.PI / 2
      g.fillText(String(i * 5 || 60), w / 2 + Math.cos(a) * w * 0.31, w / 2 + Math.sin(a) * w * 0.31)
    }
    // the minutes' small dial
    g.lineWidth = 2
    g.beginPath()
    g.arc(w / 2, w * 0.68, w * 0.1, 0, TAU)
    g.stroke()
    g.font = '700 13px Outfit, sans-serif'
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2
      g.fillText(String(i), w / 2 + Math.cos(a) * w * 0.075, w * 0.68 + Math.sin(a) * w * 0.075)
    }
  })
}

const RIBBON_VERT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vW;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.y += sin(uv.x * 7.0 + uTime * 1.3) * 0.035;
    vec4 w = modelMatrix * vec4(p, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`
const RIBBON_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uK;
  uniform float uLid;
  uniform float uHoleX;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vW;
  void main() {
    float d = fract(vUv.x * 13.0 - uTime * 1.5);
    float dash = smoothstep(0.0, 0.08, d) * (1.0 - smoothstep(0.5, 0.6, d));
    float ends = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.75, 1.0, vUv.x));
    float hole = mix(1.0, smoothstep(0.44, 0.56, abs(vW.x - uHoleX)), uLid);
    float a = dash * ends * hole * uK;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor, a);
  }`

/** A line of geometry between two points (a unit cylinder, stretched). */
const UP = new THREE.Vector3(0, 1, 0)
function stretch(mesh, a, b) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.scale.set(mesh.userData.r ?? 1, Math.max(0.001, a.distanceTo(b)), mesh.userData.r ?? 1)
  mesh.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize())
}

export async function build({ ctx, root, E, ex, say, light, level, color, clickable, lang }) {
  const stage = mcgillStage({
    light,
    ...ROOM,
    lamps: [
      { x: -3.3, z: -3.3, y: 2.95, light: 7 },
      { x: 1.3, z: -3.3, y: 3.1, light: 7 },
      { x: 5.0, z: -3.3, y: 2.95, light: 7 },
      { x: 0, z: 1.0, y: 3.2, light: 0 },
    ],
    windows: [
      { side: 'n', at: WIN1, width: 1.3, sill: 1.32, spring: 1.75, pane: true, spire: true },
      { side: 'n', at: 4.95, width: 1.3, sill: 1.32, spring: 1.75, spire: false },
      { side: 'e', at: -2.6, width: 1.4, sill: 0.95, spring: 2.0, spire: true },
      { side: 'e', at: 1.6, width: 1.4, sill: 0.95, spring: 2.0, spire: false },
    ],
    door: { side: 'n', at: DOOR.x, width: DOOR.w, height: DOOR.h },
    cabinets: [{ side: 'w', at: -2.3, width: 1.8, seed: 3 }, { side: 'w', at: 1.3, width: 1.8, seed: 9 }],
    radiators: [{ side: 'e', at: -2.6 }, { side: 'e', at: 1.6 }],
    clock: { side: 'n', at: -0.82, y: 2.55 },
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  solids.push(box(ROOM.x0 + 0.36, -2.3, 0.72, 1.85), box(ROOM.x0 + 0.36, 1.3, 0.72, 1.85))
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const lv = () => level()
  const depthOf = l => (l === 'scientist' ? 'sci' : 'kid')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k)
  const wall = () => Date.now() / 1000
  const mote = moteTex()
  const flake = flakeTex()
  textures.push(mote, flake)
  const copper = new THREE.MeshStandardMaterial({ color: '#c0703a', roughness: 0.4, metalness: 0.8, envMap: stage.shine })
  const paper = new THREE.MeshStandardMaterial({ color: '#d8ccb0', roughness: 0.9 })
  const porcelain = new THREE.MeshStandardMaterial({ color: '#e4e0d8', roughness: 0.25, envMap: stage.shine, envMapIntensity: 0.4 })
  const powder = new THREE.MeshStandardMaterial({ color: '#d6d2c8', roughness: 1 })
  const silver = new THREE.MeshStandardMaterial({ color: '#d4d8de', roughness: 0.2, metalness: 1, envMap: stage.shine, envMapIntensity: 1.2 })
  const tubeGlass = new THREE.MeshStandardMaterial({ color: '#d8eef2', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.42, depthWrite: false, envMap: stage.shine, envMapIntensity: 1.2 })
  // the window cut in a brass tube: clearer, so the gas inside shows
  const windowGlass = new THREE.MeshStandardMaterial({ color: '#d8eef2', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.12, depthWrite: false, envMap: stage.shine, envMapIntensity: 0.6 })

  // ---------------- small makers ----------------
  const rod = (a, b, r, mat, seg = 10) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, seg), mat)
    m.userData.r = r
    stretch(m, a, b)
    return m
  }
  const V = (x, y, z = ZL) => new THREE.Vector3(x, y, z)
  const wire = (pts, r = 0.006, mat = copper) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, r, 6, false), mat)
  /** A small dark plaque with gold letters (dark letters on brass do not read from a few metres). */
  const plaque = (text, x, y, z, w, size = 0.036, tilt = -0.5) => {
    const g = new THREE.Group()
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, size * 2.1, 0.012), mats.darkOak)
    const edge = new THREE.Mesh(new THREE.BoxGeometry(w + 0.016, size * 2.1 + 0.016, 0.006), mats.brass)
    edge.position.z = -0.006
    const t = makeText(text, { size, color: '#ffe2a8', anchorY: 'middle', maxWidth: w * 0.94 })
    t.position.z = 0.008
    g.add(edge, slab, t)
    g.position.set(x, y, z)
    g.rotation.x = tilt
    root.add(g)
    return t
  }
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }

  /** A Thomson quadrant electrometer under its glass bell (as the picture's), with a lamp and a translucent
   *  scale beside it; set(v) turns the needle and moves the light spot (0..1 of the scale). */
  function electrometer(x, sx, sz = ZL - 0.12) {
    const g = new THREE.Group()
    g.position.set(x, BT, ZL)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.035, 28), mats.brass)
    base.position.y = 0.035
    g.add(base)
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU + 0.5
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.02, 8), mats.brass)
      foot.position.set(Math.cos(a) * 0.09, 0.01, Math.sin(a) * 0.09)
      g.add(foot)
    }
    // the bell: a glass cylinder and its dome, a brass ring at its foot
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.22, 28, 1, true), mats.glass)
    bell.position.y = 0.165
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.08, 28, 12, 0, TAU, 0, Math.PI / 2), mats.glass)
    dome.position.y = 0.275
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.081, 0.006, 6, 28), mats.brass)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.056
    g.add(bell, dome, ring)
    // the four quadrants: a squat silver drum cut in four
    for (let k = 0; k < 4; k++) {
      const q = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.034, 10, 1, false, (k * Math.PI) / 2 + 0.07, Math.PI / 2 - 0.14), silver)
      q.position.y = 0.11
      g.add(q)
    }
    const qpost = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.05, 6), mats.ebonite)
    qpost.position.set(0.06, 0.08, 0)
    g.add(qpost)
    // the needle on its fibre, with a little mirror above
    const needle = new THREE.Group()
    needle.position.y = 0.112
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.004, 0.018), silver)
    needle.add(bar)
    const mirror = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), new THREE.MeshStandardMaterial({ color: '#e8f0f8', roughness: 0.05, metalness: 1, envMap: stage.shine, envMapIntensity: 1.6, side: THREE.DoubleSide }))
    mirror.position.y = 0.07
    needle.add(mirror)
    const fibre = new THREE.Mesh(new THREE.CylinderGeometry(0.0009, 0.0009, 0.24, 4), silver)
    fibre.position.y = 0.12
    needle.add(fibre)
    g.add(needle)
    // the terminal on top, where the wire comes in
    const term = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.06, 6), mats.brass)
    term.position.y = 0.37
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), mats.brass)
    knob.position.y = 0.405
    g.add(term, knob)
    // the lamp behind, a slit of warm light facing the mirror
    const lamp = new THREE.Group()
    lamp.position.set(-0.13, 0, -0.26)
    const lpost = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), mats.iron)
    lpost.position.y = 0.1
    const lbox = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.11, 0.07), mats.ebonite)
    lbox.position.y = 0.24
    const slit = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.05), new THREE.MeshBasicMaterial({ color: hdr('#ffd8a0', 2.2) }))
    slit.position.set(0, 0.24, 0.036)
    lamp.add(lpost, lbox, slit)
    g.add(lamp)
    root.add(g)
    // the scale on its own stand, facing the visitor
    const sc = new THREE.Group()
    sc.position.set(sx, BT, sz)
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.56, 0.03), mats.darkOak)
    stand.position.y = 0.28
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.16), mats.darkOak)
    foot.position.y = 0.01
    const st = scaleTex()
    textures.push(st)
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.16), new THREE.MeshBasicMaterial({ map: st, color: '#b0a68e' }))
    strip.position.set(0, 0.62, 0.012)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.91, 0.2, 0.02), mats.darkOak)
    frame.position.set(0, 0.62, 0)
    const spot = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.soft, color: hdr('#ffe2a0', 3.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
    spot.scale.set(0.09, 0.17, 1)
    spot.position.set(0, 0.62, 0.03)
    const hair = new THREE.Mesh(new THREE.PlaneGeometry(0.005, 0.15), new THREE.MeshBasicMaterial({ color: '#1a1208' }))
    hair.position.set(0, 0.62, 0.016)
    sc.add(stand, foot, frame, strip, spot, hair)
    root.add(sc)
    // a faint ray from the mirror to the spot, through the dusty air
    const ray = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 6, 1, true), new THREE.MeshBasicMaterial({ color: hdr('#ffe0a8', 0.9), transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }))
    ray.userData.r = 0.004
    ray.raycast = () => {}
    root.add(ray)
    const mw = new THREE.Vector3()
    const sw = new THREE.Vector3()
    let shown = -1
    return {
      group: g,
      scale: sc,
      terminal: V(x, BT + 0.405),
      set(v) {
        v = clamp(v)
        if (Math.abs(v - shown) < 0.0005) return
        shown = v
        needle.rotation.y = (v - 0.5) * 0.9
        spot.position.x = (v - 0.5) * 0.78
        hair.position.x = spot.position.x
        mirror.getWorldPosition(mw)
        spot.getWorldPosition(sw)
        stretch(ray, mw, sw)
      },
    }
  }

  // ---------------- the bench ----------------
  {
    const w = BENCH.x1 - BENCH.x0
    const cx = (BENCH.x0 + BENCH.x1) / 2
    const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, BENCH.d), mats.oak)
    top.position.set(cx, BT - 0.035, BENCH.z)
    const body = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, BT - 0.1, BENCH.d - 0.2), mats.darkOak)
    body.position.set(cx, (BT - 0.07) / 2, BENCH.z)
    root.add(top, body)
    const n = Math.round((w - 0.4) / 0.95)
    for (let i = 0; i < n; i++) {
      const x = BENCH.x0 + 0.2 + (i + 0.5) * ((w - 0.4) / n)
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.6, 0.02), mats.oak)
      door.position.set(x, 0.45, BENCH.z + BENCH.d / 2 - 0.09)
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), mats.brass)
      knob.position.set(x + (i % 2 ? -0.33 : 0.33), 0.62, BENCH.z + BENCH.d / 2 - 0.07)
      root.add(door, knob)
    }
    solids.push(box(cx, BENCH.z, w, BENCH.d))
  }

  // =====================================================================================
  // STATION 1: Owens's plates
  // =====================================================================================
  const S1 = { door: 0, win: 0, lid: 0 }
  let doorK = 0
  let winK = 0
  let lidK = 0
  let read1 = 1
  let tried1 = 0 // the door opened with the case down, seen by this visitor
  {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.04, 0.6), mats.darkOak)
    base.position.set(PX, BT + 0.02, ZL)
    root.add(base)
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, PU - BT + 0.04, 12), mats.ebonite)
      post.position.set(PX + s * 0.38, (BT + PU + 0.04) / 2 + 0.02, ZL)
      root.add(post)
      for (const y of [PL, PU]) {
        const clampM = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.05), mats.brass)
        clampM.position.set(PX + s * 0.38, y, ZL)
        root.add(clampM)
      }
    }
    for (const y of [PL, PU]) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.014, 0.48), mats.brass)
      plate.position.set(PX, y, ZL)
      root.add(plate)
    }
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.026, 28), porcelain)
    dish.position.set(PX, PL + 0.019, ZL)
    const heap = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 8, 0, TAU, 0, Math.PI / 2), powder)
    heap.scale.y = 0.18
    heap.position.set(PX, PL + 0.026, ZL)
    root.add(dish, heap)
    // the formula on a plaque at the front of the base (real subscripts)
    const pl = new THREE.Group()
    const slab = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.012), mats.darkOak)
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.216, 0.086, 0.006), mats.brass)
    edge.position.z = -0.006
    const f = formulaText('ThO2', { size: 0.04, color: '#ffe2a8' })
    f.position.z = 0.008
    pl.add(edge, slab, f)
    pl.position.set(PX, BT + 0.07, ZL + 0.33)
    pl.rotation.x = -0.6
    root.add(pl)
    // the battery of three cells, wired to the lower plate
    for (let k = 0; k < 3; k++) {
      const x = -4.48 + k * 0.13
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 16), new THREE.MeshStandardMaterial({ color: '#3a5a8a', roughness: 0.2, transparent: true, opacity: 0.85, envMap: stage.shine }))
      jar.position.set(x, BT + 0.08, ZL - 0.1)
      const zinc = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), mats.brass)
      zinc.position.set(x, BT + 0.19, ZL - 0.1)
      root.add(jar, zinc)
    }
    root.add(wire([V(-4.22, BT + 0.22, ZL - 0.1), V(-4.0, BT + 0.3, ZL - 0.05), V(PX - 0.39, PL, ZL)]))
  }
  const el1 = electrometer(EL1.x, EL1.sx)
  root.add(wire([V(PX + 0.38, PU + 0.02, ZL), V(PX + 0.7, PU + 0.22, ZL - 0.02), V(EL1.x - 0.25, BT + 0.62, ZL), el1.terminal]))
  // the glass case on its cord from a gallows behind the plates
  const lidG = new THREE.Group()
  {
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.86, 8), mats.iron)
    up.position.set(PX, BT + 0.93, ZL - 0.5)
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.52, 8), mats.iron)
    arm.rotation.x = Math.PI / 2
    arm.position.set(PX, BT + 1.84, ZL - 0.25)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.03, 16), mats.iron)
    foot.position.set(PX, BT + 0.015, ZL - 0.5)
    const pulley = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 6, 16), mats.brass)
    pulley.rotation.y = Math.PI / 2
    pulley.position.set(PX, BT + 1.8, ZL)
    root.add(up, arm, foot, pulley)
    const { w, h, d } = CASE
    const caseGlass = mats.glass.clone()
    caseGlass.opacity = 0.11
    caseGlass.envMapIntensity = 0.7
    const panes = [
      [w, h, 0, h / 2, d / 2, 0],
      [w, h, 0, h / 2, -d / 2, 0],
      [d, h, -w / 2, h / 2, 0, Math.PI / 2],
      [d, h, w / 2, h / 2, 0, Math.PI / 2],
    ]
    for (const [pw, ph, x, y, z, ry] of panes) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), caseGlass)
      m.position.set(x, y, z)
      m.rotation.y = ry
      lidG.add(m)
    }
    const topM = new THREE.Mesh(new THREE.PlaneGeometry(w, d), caseGlass)
    topM.rotation.x = -Math.PI / 2
    topM.position.y = h
    lidG.add(topM)
    // the brass edges
    const e = 0.014
    for (const y of [0.007, h]) for (const z of [-d / 2, d / 2]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, e, e), mats.brass)
      m.position.set(0, y, z)
      lidG.add(m)
    }
    for (const y of [0.007, h]) for (const x of [-w / 2, w / 2]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(e, e, d), mats.brass)
      m.position.set(x, y, 0)
      lidG.add(m)
    }
    for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(e, h, e), mats.brass)
      m.position.set(x, h / 2, z)
      lidG.add(m)
    }
    const ringM = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 6, 12), mats.brass)
    ringM.position.y = h + 0.02
    lidG.add(ringM)
    lidG.position.set(PX, BT + 0.045 + CASE.lift, ZL)
    root.add(lidG)
  }
  const cord = rod(V(PX, BT + 1.77), V(PX, BT + 1.0), 0.003, new THREE.MeshStandardMaterial({ color: '#a89878', roughness: 0.9 }), 4)
  root.add(cord)
  const cordTop = V(PX, BT + 1.77)
  const cordBot = new THREE.Vector3()

  // the draught's streaks, as the picture draws them: dashed pale ribbons from the door along the bench
  const ribbonMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uK: { value: 0 }, uLid: { value: 0 }, uHoleX: { value: PX }, uColor: { value: hdr('#9cc4ff', 1.0) } },
    vertexShader: RIBBON_VERT,
    fragmentShader: RIBBON_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  for (const pts of [
    [[-5.75, 2.05, -6.4], [-5.0, 1.95, -5.85], [-4.0, 1.7, -5.45], [-3.0, 1.62, -5.3], [-1.6, 1.7, -5.15]],
    [[-5.95, 1.45, -6.4], [-5.1, 1.32, -5.8], [-4.1, 1.26, -5.38], [-3.1, 1.25, -5.32], [-1.9, 1.2, -5.1]],
    [[-5.8, 0.85, -6.4], [-5.0, 0.95, -5.6], [-4.0, 1.08, -4.95], [-3.0, 1.06, -4.85], [-2.0, 1.0, -4.75]],
  ]) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)))
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.009, 5, false), ribbonMat)
    m.raycast = () => {}
    m.frustumCulled = false
    root.add(m)
  }

  // the emanation between the plates and the snow in the draught
  const motes1 = new Particles(light ? 60 : 120, { map: mote })
  root.add(motes1.points)
  // a soft teal haze where the gas gathers between the plates, as strong as the reading
  const haze = []
  for (let k = 0; k < 3; k++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.soft, color: hdr('#3cc3d6', 0.9), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
    sp.scale.set(0.62, 0.3, 1)
    sp.position.set(PX - 0.2 + k * 0.2, (PL + PU) / 2, ZL + 0.02)
    sp.raycast = () => {}
    root.add(sp)
    haze.push(sp)
  }
  const snow = new Particles(light ? 70 : 170, { map: flake, additive: false })
  root.add(snow.points)
  motes1.points.raycast = () => {}
  snow.points.raycast = () => {}
  const tau1 = TH_HALF / Math.LN2 / SPEED
  const expLife = tau => Math.min(tau * 4, -Math.log(1 - Math.random() * 0.999) * tau)
  /** The air's motion at a point: the door's draught entering and turning along the bench, the window's
   *  falling in and down, a slow swirl; out = [x, y, z] in m/s. */
  const fl = [0, 0, 0]
  function flow(x, y, z, t) {
    const g = gust(t)
    let fx = 0
    let fy = 0
    let fz = 0
    if (doorK > 0.01) {
      const s = smooth(-6.0, -4.5, x)
      const k = doorK * g * (1 - smooth(-1.2, 0.6, x)) * (1 - smooth(-4.2, -3.6, z))
      fx += k * (0.4 + 1.5 * s)
      fz += k * (1.2 * (1 - s) + 0.18 * Math.sin(x * 1.9 + t * 1.4) * s)
      fy += k * (0.14 * Math.sin(x * 2.3 + t * 1.8) - 0.04)
    }
    if (winK > 0.01) {
      const dz = z - ROOM.z0
      const dx = x - (WIN1 - 0.32)
      const near = Math.exp(-(dz * dz) / 2.2 - (dx * dx) / 0.9)
      const k = winK * g * near
      fx -= k * 0.35
      fy -= k * 0.3
      fz += k * 1.1
    }
    fl[0] = fx
    fl[1] = fy
    fl[2] = fz
    return fl
  }
  let spawn1 = 0
  let spawnSnow = 0
  const inCase = p => Math.abs(p.x - PX) < CASE.w / 2 - 0.03 && Math.abs(p.z - ZL) < CASE.d / 2 - 0.03 && p.y < BT + CASE.h
  updates.push((dt, t) => {
    // the emanation rises from the powder, wanders, is carried off by moving air, and decays
    spawn1 += dt * (light ? 4 : 7)
    while (spawn1 >= 1) {
      spawn1 -= 1
      motes1.spawn({
        x: PX + (Math.random() - 0.5) * 0.2,
        y: PL + 0.03,
        z: ZL + (Math.random() - 0.5) * 0.16,
        vx: (Math.random() - 0.5) * 0.12,
        vy: 0.1 + Math.random() * 0.12,
        vz: (Math.random() - 0.5) * 0.12,
        life: expLife(tau1),
        size: 0.05,
      })
    }
    const closed = lidK > 0.97
    const D = doorK + winK * 0.4
    motes1.step(dt, (p, dtt) => {
      p.vx += (Math.random() - 0.5) * 0.5 * dtt
      p.vy += (Math.random() - 0.5) * 0.5 * dtt
      p.vz += (Math.random() - 0.5) * 0.5 * dtt
      const dmp = Math.exp(-2.2 * dtt)
      p.vx *= dmp
      p.vy *= dmp
      p.vz *= dmp
      if (closed) {
        // inside the closed case: nothing carries it away; it bounces off the glass
        const hw = CASE.w / 2 - 0.04
        const hd = CASE.d / 2 - 0.04
        if (Math.abs(p.x - PX) > hw) (p.x = PX + Math.sign(p.x - PX) * hw), (p.vx *= -0.5)
        if (Math.abs(p.z - ZL) > hd) (p.z = ZL + Math.sign(p.z - ZL) * hd), (p.vz *= -0.5)
        if (p.y > BT + CASE.h - 0.03) (p.y = BT + CASE.h - 0.03), (p.vy *= -0.5)
        if (p.y < BT + 0.06) (p.y = BT + 0.06), (p.vy *= -0.5)
      } else {
        // still air keeps the little cloud between the plates; moving air carries it off
        const hold = Math.max(0, 1 - D * 2.5)
        if (p.y > PU - 0.02) p.vy -= 0.9 * hold * dtt
        if (p.y < PL + 0.02) p.vy += 0.9 * dtt
        if (Math.abs(p.x - PX) > 0.32) p.vx -= Math.sign(p.x - PX) * 0.5 * hold * dtt
        if (Math.abs(p.z - ZL) > 0.2) p.vz -= Math.sign(p.z - ZL) * 0.5 * hold * dtt
        const f = flow(p.x, p.y, p.z, t)
        const shelter = lidK > 0.02 && inCase(p) ? 1 - lidK : 1
        p.x += f[0] * dtt * shelter
        p.y += f[1] * dtt * shelter
        p.z += f[2] * dtt * shelter
      }
      // fade in, then a little flash as it decays
      const left = p.life - p.age
      p.alpha = Math.min(1, p.age / 0.4) * (left < 0.25 ? 1.6 : 1)
      p.size = left < 0.25 ? 0.085 : 0.05
    }, ctx.camera, ctx.renderer)
    // snow blowing in at the door and the window, melting as it crosses the warm room
    spawnSnow += dt * (doorK * (light ? 14 : 30) + winK * (light ? 8 : 16))
    while (spawnSnow >= 1) {
      spawnSnow -= 1
      const fromDoor = Math.random() * (doorK * 30 + winK * 16) < doorK * 30
      const p = fromDoor
        ? { x: DOOR.x + (Math.random() - 0.5) * 0.9, y: 0.3 + Math.random() * 2.0, z: ROOM.z0 + 0.12 }
        : { x: WIN1 - 0.6 + Math.random() * 0.55, y: 1.4 + Math.random() * 0.75, z: ROOM.z0 + 0.14 }
      snow.spawn({ ...p, vx: 0, vy: -0.15, vz: 0.3, life: 2.6 + Math.random() * 2.2, size: 0.02 + Math.random() * 0.018, r: 0.95, g: 0.97, b: 1 })
    }
    snow.step(dt, (p, dtt, k) => {
      const f = flow(p.x, p.y, p.z, t)
      p.x += f[0] * 1.15 * dtt
      p.y += f[1] * dtt
      p.z += f[2] * 1.1 * dtt
      p.x += Math.sin(t * 3 + p.life * 7) * 0.12 * dtt
      if (p.y < 0.02 || (Math.abs(p.x - PX) < CASE.w / 2 && Math.abs(p.z - ZL) < CASE.d / 2 && p.y < BT + CASE.h && lidK > 0.9)) p.age = p.life
      p.alpha = Math.min(1, p.age / 0.3) * (1 - smooth(0.6, 1, k)) * 0.95
    }, ctx.camera, ctx.renderer)
  })

  const hit1 = {
    door: new THREE.Mesh(new THREE.BoxGeometry(DOOR.w + 0.2, DOOR.h, 0.5), ghost),
    win: new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.95, 0.3), ghost),
    lid: new THREE.Mesh(new THREE.BoxGeometry(CASE.w + 0.04, CASE.h + 0.04, CASE.d + 0.04), ghost),
  }
  hit1.door.position.set(DOOR.x, DOOR.h / 2, ROOM.z0 + 0.25)
  hit1.win.position.set(WIN1 - 0.33, 1.32 + 0.45, ROOM.z0 + 0.15)
  hit1.lid.position.set(PX, 0, ZL)
  root.add(hit1.door, hit1.win)
  lidG.add(hit1.lid)
  hit1.lid.position.set(0, CASE.h / 2, 0)

  const say1 = key => say(at(E.owens.says[key], lv()))
  function owensPanel(l) {
    return {
      title: E.owens.title,
      color,
      blocks: [
        { slider: { label: E.owens.slider, min: 0, max: 100, step: 5, value: Math.round(S1.win * 100), onInput: v => setWin(v / 100), format: v => fill(E.owens.sliderFmt, { p: Math.round(v) }), live: () => Math.round(S1.win * 100) } },
        {
          buttons: [
            { label: E.owens.buttons.door, onClick: () => owensStep('door') },
            { label: E.owens.buttons.win, onClick: () => owensStep('window') },
            { label: E.owens.buttons.lid, onClick: () => owensStep('lid') },
          ],
        },
        ...E.owens.panel[depthOf(l)].map(p => ({ p })),
      ],
    }
  }
  const pending = {}
  function queueShare(id) {
    if (pending[id]) return
    pending[id] = setTimeout(() => {
      pending[id] = null
      share(id)
    }, 250)
  }
  function setWin(v, now = false) {
    const w = clamp(Math.round(Number(v) * 20) / 20)
    if (w === S1.win) return
    const was = S1.win
    S1.win = w
    if (now) play('tap')
    if (was === 0 && w > 0) say1(S1.lid ? 'windowCase' : 'window')
    else if (w === 0 && was > 0) say1('windowShut')
    if (now) share('owens')
    else queueShare('owens')
  }
  function owensStep(what) {
    if (what === 'door') {
      S1.door ^= 1
      play('tap')
      if (S1.door) {
        if (S1.lid) {
          tried1 = 1
          say1('openCase')
        } else say1('open')
        ex.discover('owens', owensPanel, 4.2)
      } else say1('close')
    } else if (what === 'window') {
      return setWin(S1.win > 0 ? 0 : 0.6, true)
    } else if (what === 'lid') {
      S1.lid ^= 1
      play('select')
      say1(S1.lid ? 'caseDown' : 'caseUp')
    } else return
    share('owens')
  }
  clickable(hit1.door, () => owensStep('door'), { reach: 6.5 })
  clickable(hit1.win, () => owensStep('window'), { reach: 5 })
  clickable(hit1.lid, () => owensStep('lid'))
  ex.add({
    id: 'owens',
    x: -3.45,
    z: -3.55,
    radius: 2.2,
    manual: true,
    label: E.owens.label,
    verb: () => {
      const H = E.owens.hints
      if (!S1.door && !S1.lid && !tried1) return ex.list.find(i => i.id === 'owens')?.found ? H.lid : H.door
      if (S1.door && !S1.lid) return H.close
      if (S1.lid && !S1.door && !tried1) return H.test
      return H.done
    },
    focus: { x: -3.5, y: 1.4, z: ZL, size: 1.6, width: 4.4 },
    act: () => ctx.showPanel(owensPanel),
  })
  const owensState = () => ({ door: S1.door, win: S1.win, lid: S1.lid })
  const owensSet = (s, liveSet) => {
    const d = s?.door ? 1 : 0
    const w = clamp(Number(s?.win) || 0)
    const l = s?.lid ? 1 : 0
    if (liveSet && (d !== S1.door || l !== S1.lid || w !== S1.win)) play('tap')
    S1.door = d
    S1.win = w
    S1.lid = l
    if (!liveSet) {
      doorK = d
      winK = w
      lidK = l
    }
  }
  updates.push((dt, t) => {
    doorK = damp(doorK, S1.door, 2.4, dt)
    winK = damp(winK, S1.win, 3, dt)
    lidK = damp(lidK, S1.lid, 2.2, dt)
    if (Math.abs(lidK - S1.lid) < 0.002) lidK = S1.lid
    stage.door?.setOpen(ease(doorK))
    stage.windows[0]?.pane?.setOpen(winK)
    stage.door && (stage.door.cold.intensity = (light ? 3.2 : 2.6) * (0.25 + 0.75 * doorK))
    lidG.position.y = BT + 0.045 + CASE.lift * (1 - ease(lidK))
    cordBot.set(PX, lidG.position.y + CASE.h + 0.035, ZL)
    stretch(cord, cordTop, cordBot)
    ribbonMat.uniforms.uTime.value = t
    ribbonMat.uniforms.uK.value = doorK * 0.42
    ribbonMat.uniforms.uLid.value = lidK
    // the reading: the emanation between the plates, swept away by moving air unless the case is down
    const D = doorK + winK * 0.4
    const blown = (1 - lidK) * D * gust(t)
    const target = 1 / (1 + 8 * blown)
    read1 = damp(read1, target, target < read1 ? 2.6 : 0.16, dt)
    el1.set(0.07 + read1 * 0.8 + Math.sin(t * 13) * 0.003)
    haze.forEach((h, k) => {
      h.material.opacity = 0.32 * read1 * (0.85 + 0.15 * Math.sin(t * 1.3 + k * 2))
      h.position.x = PX - 0.2 + k * 0.2 + (1 - lidK) * D * gust(t) * 0.25 * (1 - read1)
    })
  })

  // =====================================================================================
  // STATION 2: Rutherford's tube
  // =====================================================================================
  const S2 = { blow: 0, plug: 1, speed: 10, base: -1, at: 0, r0: 1, woolTried: 0 }
  let read2 = 0
  let mine2 = false
  let said2 = 0 // the fractions already announced in this run (1 half, 2 quarter, 3 eighth, 4 done)
  const tExp = () => (S2.base < 0 ? -1 : Math.min(360, S2.base + (wall() - S2.at) * S2.speed))
  // the bellows
  const bellows = new THREE.Group()
  bellows.position.set(T2.bellows, BT, ZL + 0.05)
  root.add(bellows)
  const leather = new THREE.MeshStandardMaterial({ color: '#7a4228', roughness: 0.7, side: THREE.DoubleSide })
  const bTop = new THREE.Group()
  const pleats = []
  {
    // a round cushion bellows: two wooden discs and a pleated leather side between them
    const bBase = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.03, 28), mats.oak)
    bBase.position.y = 0.015
    bellows.add(bBase)
    const prof = []
    for (let k = 0; k <= 8; k++) prof.push(new THREE.Vector2(k % 2 ? 0.118 : 0.158, k / 8))
    const side = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), leather)
    side.position.y = 0.03
    bellows.add(side)
    pleats.push(side)
    const board = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 28), mats.oak)
    const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16), mats.iron)
    weight.position.y = 0.04
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 14, Math.PI), mats.brass)
    handle.position.set(0, 0.075, 0)
    bTop.add(board, weight, handle)
    bellows.add(bTop)
    // the nozzle, up to the tube
    root.add(rod(V(T2.bellows + 0.17, BT + 0.08, ZL + 0.05), V(T2.bellows + 0.3, BT + 0.08, ZL + 0.05), 0.014, mats.brass))
    root.add(rod(V(T2.bellows + 0.3, BT + 0.08, ZL + 0.05), V(T2.bellows + 0.3, TY, ZL + 0.05), 0.014, mats.brass))
    root.add(rod(V(T2.bellows + 0.3, TY, ZL + 0.05), V(T2.b0, TY, ZL), 0.014, mats.brass))
  }
  // tube B, open at the front behind glass, thorium oxide in its paper vessel inside
  /** A brass cylinder along x from x0 to x1 (radius r), its front cut away and glazed. */
  const glazedTube = (x0, x1, r, y = TY) => {
    const g = new THREE.Group()
    const len = x1 - x0
    const open = 1.0
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 32, 1, true, open, TAU - open * 2), new THREE.MeshStandardMaterial({ color: '#c9a04a', roughness: 0.32, metalness: 0.9, envMap: stage.shine, envMapIntensity: 1.1, side: THREE.DoubleSide }))
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 16, 1, true, -open, open * 2), windowGlass)
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.98, r * 0.98, len, 24, 1, true, open, TAU - open * 2), new THREE.MeshStandardMaterial({ color: '#4a3a24', roughness: 0.6, side: THREE.BackSide }))
    for (const m of [shell, glass, inner]) {
      m.rotation.z = Math.PI / 2
      g.add(m)
    }
    for (const s of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.008, r + 0.008, 0.02, 32), mats.brass)
      cap.rotation.z = Math.PI / 2
      cap.position.x = (s * len) / 2
      g.add(cap)
    }
    g.position.set((x0 + x1) / 2, y, ZL)
    root.add(g)
    return g
  }
  glazedTube(T2.b0, T2.b1, 0.07)
  for (const x of [T2.b0 + 0.2, T2.b1 - 0.2]) {
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.05, TY - BT - 0.06, 0.14), mats.darkOak)
    cradle.position.set(x, BT + (TY - BT - 0.06) / 2, ZL)
    root.add(cradle)
  }
  {
    const pv = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.09), paper)
    pv.position.set(0.55, TY - 0.035, ZL)
    root.add(pv)
  }
  // the cotton wool in its glass sleeve (taken out, it sits on a little dish in front)
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, T2.s1 - T2.s0, 20, 1, true), tubeGlass)
  sleeve.rotation.z = Math.PI / 2
  sleeve.position.set((T2.s0 + T2.s1) / 2, TY, ZL)
  root.add(sleeve)
  for (const x of [T2.s0, T2.s1]) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.025, 20), mats.brass)
    collar.rotation.z = Math.PI / 2
    collar.position.set(x, TY, ZL)
    root.add(collar)
  }
  const wool = new THREE.Group()
  {
    const geo = new THREE.IcosahedronGeometry(1, 2)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const k = 1 + (Math.sin(pos.getX(i) * 9.1) * Math.cos(pos.getY(i) * 7.3 + pos.getZ(i) * 5.7)) * 0.16
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k, pos.getZ(i) * k)
    }
    geo.computeVertexNormals()
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#f2efe8', roughness: 1, emissive: '#3a3a40', emissiveIntensity: 0.4 }))
    m.scale.set(0.085, 0.044, 0.044)
    wool.add(m)
    root.add(wool)
  }
  const woolIn = V((T2.s0 + T2.s1) / 2, TY)
  const woolOut = V((T2.s0 + T2.s1) / 2, BT + 0.07, ZL + 0.36)
  {
    const dishW = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.02, 20), porcelain)
    dishW.position.set(woolOut.x, BT + 0.01, woolOut.z)
    root.add(dishW)
  }
  // cylinder C on ebonite feet, the electrode D along its axis, an outlet on top
  glazedTube(T2.c0, T2.c1, CR)
  for (const x of [T2.c0 + 0.12, T2.c1 - 0.12]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, TY - CR - BT, 10), mats.ebonite)
    foot.position.set(x, BT + (TY - CR - BT) / 2, ZL)
    root.add(foot)
  }
  root.add(rod(V(T2.c0 + 0.12, TY), V(T2.c1 + 0.06, TY), 0.007, mats.brass))
  {
    const bush = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 12), mats.ebonite)
    bush.rotation.z = Math.PI / 2
    bush.position.set(T2.c1 + 0.03, TY, ZL)
    root.add(bush)
    root.add(rod(V(T2.c1 - 0.1, TY + CR), V(T2.c1 - 0.1, TY + CR + 0.12), 0.012, mats.brass))
    root.add(rod(V(T2.c1 - 0.1, TY + CR + 0.12), V(T2.c1 + 0.05, TY + CR + 0.2), 0.012, mats.brass))
  }
  const el2 = electrometer(T2.el, T2.sx, ZL - 0.2)
  root.add(wire([V(T2.c1 + 0.06, TY), V(T2.c1 + 0.2, TY + 0.18, ZL), V(T2.el - 0.12, BT + 0.55, ZL), el2.terminal]))
  // the battery of cells for the 100 volts, wired to C
  {
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.26), mats.darkOak)
    tray.position.set(2.05, BT + 0.025, ZL - 0.4)
    root.add(tray)
    const cellGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.09, 10)
    const cellMat = new THREE.MeshStandardMaterial({ color: '#3a5a8a', roughness: 0.25, envMap: stage.shine })
    const im = new THREE.InstancedMesh(cellGeo, cellMat, 24)
    const dmy = new THREE.Object3D()
    for (let i = 0; i < 24; i++) {
      dmy.position.set(1.8 + (i % 8) * 0.07, BT + 0.095, ZL - 0.48 + Math.floor(i / 8) * 0.08)
      dmy.updateMatrix()
      im.setMatrixAt(i, dmy.matrix)
    }
    root.add(im)
    root.add(wire([V(2.35, BT + 0.15, ZL - 0.4), V(2.3, TY - 0.02, ZL - 0.2), V(2.2, TY - CR + 0.02, ZL - 0.05)]))
  }
  // the stopwatch at the front of the bench, its face tilted up to the visitor
  const watch = new THREE.Group()
  watch.position.set(T2.watch, BT, ZL + 0.42)
  const secHand = new THREE.Group()
  const minHand = new THREE.Group()
  {
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.14), mats.darkOak)
    stand.position.y = 0.03
    watch.add(stand)
    const face = new THREE.Group()
    face.position.set(0, 0.14, 0)
    face.rotation.x = -0.75
    const caseM = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.035, 36), mats.brass)
    caseM.rotation.x = Math.PI / 2
    const wt = watchTex()
    textures.push(wt)
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.098, 40), new THREE.MeshStandardMaterial({ map: wt, roughness: 0.5, emissive: '#3a3020', emissiveIntensity: 0.25 }))
    dial.position.z = 0.0185
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.03, 10), mats.brass)
    crown.position.y = 0.125
    const ringT = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 6, 14), mats.brass)
    ringT.position.y = 0.15
    const handMat = new THREE.MeshStandardMaterial({ color: '#1a120a', roughness: 0.4 })
    const sh = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.09, 0.003), new THREE.MeshStandardMaterial({ color: '#8a1a10', roughness: 0.4 }))
    sh.position.y = 0.035
    secHand.add(sh)
    secHand.position.z = 0.022
    const mh = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.022, 0.003), handMat)
    mh.position.y = 0.011
    minHand.add(mh)
    minHand.position.set(0, -0.0353, 0.021)
    face.add(caseM, dial, crown, ringT, secHand, minHand)
    watch.add(face)
    // legs propping the tilted face
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.02), mats.brass)
    prop.position.set(0, 0.09, -0.06)
    prop.rotation.x = 0.4
    watch.add(prop)
  }
  root.add(watch)
  // the chalkboard over the station: the reading against the minutes since the air stopped
  const BOARD = { x: 1.3, y: 2.38, w: 2.7, h: 1.36 }
  const boardTex = canvasTex(1024, 516, null, { mipmaps: true })
  textures.push(boardTex)
  {
    const g = new THREE.Group()
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(BOARD.w, BOARD.h), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.9, emissive: '#ffffff', emissiveMap: boardTex, emissiveIntensity: 0.12 }))
    slab.position.z = 0.03
    const frame = new THREE.Mesh(new THREE.BoxGeometry(BOARD.w + 0.14, BOARD.h + 0.14, 0.05), mats.darkOak)
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(BOARD.w, 0.04, 0.1), mats.darkOak)
    ledge.position.set(0, -BOARD.h / 2 - 0.06, 0.07)
    const chalk = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.016, 0.016), new THREE.MeshStandardMaterial({ color: '#e8e4da', roughness: 1 }))
    chalk.position.set(0.9, -BOARD.h / 2 - 0.032, 0.08)
    g.add(frame, slab, ledge, chalk)
    stage.onWall(g, 'n', BOARD.x, BOARD.y, 0.02)
  }
  let boardKey = ''
  function drawBoard(points, sci) {
    const L = E.tube.board
    boardTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#25332c'
      g.fillRect(0, 0, w, h)
      // old smudges of chalk
      for (let i = 0; i < 70; i++) {
        const x = (i * 137.5) % w
        const y = (i * 71.3) % h
        g.fillStyle = `rgba(220,230,220,${0.02 + (i % 5) * 0.008})`
        g.fillRect(x, y, 40 + (i % 7) * 18, 6)
      }
      const ox = 120
      const oy = h - 78
      const ax = w - 70
      const ay = 52
      const X = s => ox + ((ax - ox) * s) / 360
      const Y = f => oy - (oy - ay) * f
      g.strokeStyle = 'rgba(240,244,236,0.9)'
      g.lineWidth = 4
      g.lineCap = 'round'
      g.beginPath()
      g.moveTo(ox, ay - 10)
      g.lineTo(ox, oy)
      g.lineTo(ax + 16, oy)
      g.stroke()
      g.fillStyle = 'rgba(240,244,236,0.92)'
      g.font = '700 30px Outfit, sans-serif'
      g.textAlign = 'center'
      g.textBaseline = 'top'
      for (let m = 0; m <= 6; m++) {
        g.beginPath()
        g.moveTo(X(m * 60), oy)
        g.lineTo(X(m * 60), oy + 12)
        g.stroke()
        g.fillText(String(m), X(m * 60), oy + 16)
      }
      g.font = '600 26px Nunito, sans-serif'
      g.fillText(L.axisX, (ox + ax) / 2, oy + 48)
      // halves: 1, 1/2, 1/4, 1/8, dashed across
      g.textAlign = 'right'
      g.textBaseline = 'middle'
      g.font = '700 30px Outfit, sans-serif'
      for (const [f, s] of [[1, '1'], [0.5, '1/2'], [0.25, '1/4'], [0.125, '1/8']]) {
        g.setLineDash([10, 12])
        g.lineWidth = 2
        g.strokeStyle = 'rgba(240,244,236,0.35)'
        g.beginPath()
        g.moveTo(ox, Y(f))
        g.lineTo(ax, Y(f))
        g.stroke()
        g.setLineDash([])
        g.fillText(s, ox - 14, Y(f))
      }
      g.save()
      g.translate(34, (oy + ay) / 2)
      g.rotate(-Math.PI / 2)
      g.textAlign = 'center'
      g.font = '600 26px Nunito, sans-serif'
      g.fillText(L.axisY, 0, 0)
      g.restore()
      // Rutherford's own points (Scientist), yellow circles
      if (sci) {
        g.strokeStyle = '#ffd860'
        g.lineWidth = 3.5
        for (const [s, f] of TABLE3) {
          g.beginPath()
          g.arc(X(s), Y(f), 11, 0, TAU)
          g.stroke()
        }
      }
      // the visitor's points, white crosses
      g.strokeStyle = '#f6f8f2'
      g.lineWidth = 4.5
      for (const [s, f] of points) {
        const x = X(s)
        const y = Y(f)
        g.beginPath()
        g.moveTo(x - 10, y - 10)
        g.lineTo(x + 10, y + 10)
        g.moveTo(x + 10, y - 10)
        g.lineTo(x - 10, y + 10)
        g.stroke()
      }
      // the legend
      g.textAlign = 'left'
      g.font = '700 26px Nunito, sans-serif'
      g.fillStyle = '#f6f8f2'
      const lx = w - 360
      g.beginPath()
      g.moveTo(lx - 12, 48)
      g.lineTo(lx + 8, 68)
      g.moveTo(lx + 8, 48)
      g.lineTo(lx - 12, 68)
      g.stroke()
      g.fillText(L.mine, lx + 24, 58)
      if (sci) {
        g.strokeStyle = '#ffd860'
        g.beginPath()
        g.arc(lx - 2, 100, 10, 0, TAU)
        g.stroke()
        g.fillStyle = '#ffd860'
        g.fillText(L.theirs, lx + 24, 100)
      }
    })
  }
  /** The points the visitor's run has reached: one every 30 s of the emanation's time. */
  const runPoints = () => {
    const t = tExp()
    const out = []
    if (t < 0) return out
    for (let s = 0; s <= t + 1e-6; s += 30) out.push([s, S2.r0 * Math.exp(-LAM * s)])
    return out
  }
  // the emanation in the tube: carried along by the air, lingering in C, decaying
  const motes2 = new Particles(light ? 50 : 90, { map: mote })
  motes2.points.raycast = () => {}
  root.add(motes2.points)
  let spawn2 = 0
  let pump = 0
  updates.push((dt, t) => {
    const run = tExp()
    const blowing = !!S2.blow
    if (blowing) pump += dt
    const k = blowing ? 0.5 + 0.5 * Math.cos(pump * 2 * TAU) : 1
    const hgt = 0.1 + 0.11 * k
    bTop.position.y = 0.03 + hgt
    pleats[0].scale.y = hgt
    if (blowing) {
      spawn2 += dt * (light ? 3.5 : 6)
      while (spawn2 >= 1) {
        spawn2 -= 1
        motes2.spawn({ x: 0.3 + Math.random() * 0.5, y: TY - 0.01 + (Math.random() - 0.5) * 0.04, z: ZL + (Math.random() - 0.5) * 0.06, life: 999, k: expLife(TH_HALF / Math.LN2), size: 0.032 })
      }
    }
    const sp = blowing ? SPEED : S2.speed
    motes2.step(dt, (p, dtt) => {
      p.k -= dtt * sp
      if (p.k <= 0) {
        p.age = p.life
        return
      }
      p.vx += (Math.random() - 0.5) * 0.4 * dtt
      p.vy += (Math.random() - 0.5) * 0.4 * dtt
      p.vz += (Math.random() - 0.5) * 0.4 * dtt
      const dmp = Math.exp(-3 * dtt)
      p.vx *= dmp
      p.vy *= dmp
      p.vz *= dmp
      if (blowing) p.x += (p.x < T2.c0 ? 0.42 : 0.1) * dtt
      // inside the tube, the sleeve and the cylinder: keep within their walls
      const r = p.x < T2.s0 ? 0.055 : p.x < T2.c0 ? 0.04 : CR - 0.02
      const dy = p.y - TY
      const dz = p.z - ZL
      const d = Math.hypot(dy, dz)
      if (d > r) {
        p.y = TY + (dy / d) * r
        p.z = ZL + (dz / d) * r
        p.vy *= -0.4
        p.vz *= -0.4
      }
      if (!blowing && p.x > T2.c1 - 0.03) (p.x = T2.c1 - 0.03), (p.vx = -Math.abs(p.vx))
      if (p.x > T2.c1 + 0.02) p.age = p.life
      p.alpha = Math.min(1, p.age / 0.3) * (p.k < 0.6 ? 1.6 : 1)
      p.size = p.k < 0.6 ? 0.05 : 0.032
    }, ctx.camera, ctx.renderer)
    // the reading in C
    if (blowing) read2 = damp(read2, 1, 0.45, dt)
    else if (run >= 0) read2 = S2.r0 * Math.exp(-LAM * run)
    else read2 = damp(read2, 0, 0.3, dt)
    el2.set(0.04 + read2 * 0.86 + (blowing ? Math.sin(t * 9) * 0.004 : 0))
    // the stopwatch's hands follow the run
    const shown = run < 0 ? 0 : run
    secHand.rotation.z = -((shown % 60) / 60) * TAU
    minHand.rotation.z = -((shown / 60) / 10) * TAU
    // the board: redrawn when a point is added or the level changes
    const pts = runPoints()
    const sci = lv() === 'scientist'
    const key = `${pts.length}|${sci}|${S2.r0.toFixed(3)}`
    if (key !== boardKey) {
      boardKey = key
      drawBoard(pts, sci)
    }
    // the fractions announced as they are passed, for the one who started the run
    if (mine2 && run >= 0) {
      const at_ = [TH_HALF, TH_HALF * 2, TH_HALF * 3, 360]
      const keys = ['half', 'quarter', 'eighth', 'done']
      while (said2 < 4 && run >= at_[said2]) {
        say2(keys[said2])
        if (said2 === 1) ex.discover('tube', tubePanel, 1.2)
        said2++
      }
    }
    // the cotton wool moves between the sleeve and its dish
    woolK = damp(woolK, S2.plug, 4, dt)
    const e = ease(woolK)
    wool.position.lerpVectors(woolOut, woolIn, e)
    wool.position.y += Math.sin(Math.PI * e) * 0.18
  })
  let woolK = 1

  const hit2 = {
    bellows: new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.34, 0.36), ghost),
    wool: new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.16), ghost),
    woolDish: new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.2), ghost),
    watch: new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.24), ghost),
  }
  hit2.bellows.position.set(T2.bellows, BT + 0.17, ZL + 0.05)
  hit2.wool.position.copy(woolIn)
  hit2.woolDish.position.set(woolOut.x, BT + 0.07, woolOut.z)
  hit2.watch.position.set(T2.watch, BT + 0.14, ZL + 0.42)
  root.add(hit2.bellows, hit2.wool, hit2.woolDish, hit2.watch)
  const say2 = (key, vars) => say(fill(at(E.tube.says[key], lv()), vars))
  const speedFmt = v => (Math.round(v) <= 1 ? E.tube.realTime : fill(E.tube.sliderFmt, { k: Math.round(v) }))
  function tubePanel(l) {
    return {
      title: E.tube.title,
      color,
      blocks: [
        { slider: { label: E.tube.slider, min: 1, max: 20, step: 1, value: S2.speed, onInput: v => setSpeed(v), format: speedFmt, live: () => S2.speed } },
        {
          buttons: [
            { label: E.tube.buttons.blow, onClick: () => tubeStep('bellows') },
            { label: E.tube.buttons.wool, onClick: () => tubeStep('wool') },
            { label: E.tube.buttons.stop, onClick: () => tubeStep('watch') },
          ],
        },
        ...E.tube.panel[depthOf(l)].map(p => ({ p })),
      ],
    }
  }
  function setSpeed(v, now = false) {
    const s = clamp(Math.round(Number(v) || 10), 1, 20)
    if (s === S2.speed) return
    // the run goes on from where it is, at the new pace
    if (S2.base >= 0) {
      S2.base = tExp()
      S2.at = wall()
    }
    S2.speed = s
    if (now) play('tap')
    if (now) share('tube')
    else queueShare('tube')
  }
  function tubeStep(what) {
    if (what === 'bellows') {
      if (S2.blow) return tubeStep('watch')
      S2.blow = 1
      S2.base = -1
      said2 = 0
      mine2 = true
      play('fizz')
      say2('blow')
    } else if (what === 'wool') {
      S2.plug ^= 1
      S2.woolTried = 1
      play('tap')
      say2(S2.plug ? 'woolIn' : 'woolOut')
    } else if (what === 'watch') {
      if (S2.blow) {
        S2.blow = 0
        S2.base = 0
        S2.at = wall()
        S2.r0 = Math.max(0.05, Math.round(read2 * 1000) / 1000)
        said2 = 0
        mine2 = true
        play('select')
        say2('stop')
      } else if (S2.base >= 0 && tExp() < 360) {
        return say2('running')
      } else if (S2.base >= 0) {
        // a finished run: the clock back to nought, the board wiped
        S2.base = -1
        play('tap')
        say2('wipe')
      } else return say2('empty')
    } else return
    share('tube')
  }
  clickable(hit2.bellows, () => tubeStep('bellows'))
  clickable(hit2.wool, () => tubeStep('wool'), { when: () => !!S2.plug })
  clickable(hit2.woolDish, () => tubeStep('wool'), { when: () => !S2.plug })
  clickable(hit2.watch, () => tubeStep('watch'))
  ex.add({
    id: 'tube',
    x: 1.3,
    z: -3.55,
    radius: 2.1,
    manual: true,
    label: E.tube.label,
    verb: () => {
      const H = E.tube.hints
      const run = tExp()
      if (S2.blow) {
        if (read2 < 0.6) return H.fill
        if (!S2.woolTried) return S2.plug ? H.wool : H.woolBack
        if (!S2.plug) return H.woolBack
        return H.stop
      }
      if (run >= 0 && run < 360) return H.run
      if (run >= 360) return H.again
      return H.blow
    },
    focus: { x: 1.35, y: 1.75, z: ZL, size: 2.1, width: 4.3 },
    act: () => ctx.showPanel(tubePanel),
  })
  const tubeState = () => {
    const run = tExp()
    // the run's age is clamped to its end, so a finished run's state stays still
    const age = S2.base < 0 ? 0 : Math.min(wall() - S2.at, Math.max(0, (360 - S2.base) / S2.speed))
    return { blow: S2.blow, plug: S2.plug, speed: S2.speed, base: S2.base < 0 ? -1 : Math.round(S2.base * 10) / 10, age: Math.round(age * 10) / 10, r0: S2.r0, done: run >= 360 ? 1 : 0 }
  }
  const tubeSet = (s, liveSet, ago = 0) => {
    const blow = s?.blow ? 1 : 0
    const plug = s?.plug === 0 ? 0 : 1
    const speed = clamp(Math.round(Number(s?.speed) || 10), 1, 20)
    const base = Number(s?.base)
    const r0 = clamp(Number(s?.r0) || 1, 0.05, 1)
    if (liveSet) {
      if (blow && !S2.blow) play('fizz')
      else if (plug !== S2.plug) play('tap')
      else if (!blow && S2.blow) play('select')
    }
    if (blow !== S2.blow || (base >= 0) !== (S2.base >= 0)) {
      mine2 = false
      said2 = 0
    }
    S2.blow = blow
    S2.plug = plug
    S2.speed = speed
    S2.r0 = r0
    if (Number.isFinite(base) && base >= 0) {
      S2.base = base
      // a run under way goes on by the time since it was taken, unless it had already ended
      const age = Math.max(0, Number(s?.age) || 0) + (s?.done ? 0 : Math.max(0, ago))
      S2.at = wall() - age
    } else S2.base = -1
    if (!liveSet) {
      woolK = plug
      read2 = blow ? 1 : read2
    }
  }

  // =====================================================================================
  // STATION 3: the cold trap
  // =====================================================================================
  const S3 = { flask: 0, kind: '', phase: 0, t0: 0, born: 0, days: 0 }
  // phases: 0 nothing, 1 travelling, 2 frozen in the trap, 3 warming, 4 in the vessel
  const PH = { travel: 2.4, through: 3.8, warm: 3.2, rush: 4.2 }
  let mine3 = false
  let flaskK = 0
  const Y3 = T3.pipe
  // the sources: a thorium box and a radium tube in its lead pot, each with a red rubber bulb
  const rubber = new THREE.MeshStandardMaterial({ color: '#8a2a1e', roughness: 0.55 })
  const bulbs = {}
  {
    const thBox = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.1, 0.13), mats.oak)
    thBox.position.set(T3.th, BT + 0.05, ZL)
    const lidB = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.14), mats.darkOak)
    lidB.position.set(T3.th, BT + 0.105, ZL)
    root.add(thBox, lidB)
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.11, 20), new THREE.MeshStandardMaterial({ color: '#4a4c52', roughness: 0.6, metalness: 0.5, envMap: stage.shine }))
    pot.position.set(T3.ra, BT + 0.055, ZL)
    const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.08, 10), tubeGlass)
    vial.position.set(T3.ra, BT + 0.13, ZL)
    // radium salts glow faintly by themselves
    const salt = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), new THREE.MeshBasicMaterial({ color: hdr('#9fd8ff', 1.1) }))
    salt.position.set(T3.ra, BT + 0.1, ZL)
    root.add(pot, vial, salt)
    for (const [id, x] of [['th', T3.th], ['ra', T3.ra]]) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), rubber)
      b.scale.set(1, 0.85, 1.25)
      b.position.set(x, BT + 0.045, ZL + 0.26)
      root.add(b)
      root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(x, BT + 0.05, ZL + 0.2), V(x, BT + 0.06, ZL + 0.12), V(x, BT + 0.08, ZL + 0.06)]), 12, 0.008, 6), rubber))
      bulbs[id] = b
      // the riser up to the line
      root.add(rod(V(x, id === 'th' ? BT + 0.11 : BT + 0.17), V(x, Y3), 0.01, tubeGlass))
    }
    const sign = (text, x) => {
      const t = makeText(text, { size: 0.06, color: '#ffe2a8', anchorY: 'middle' })
      const g = new THREE.Group()
      const slab = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.012), mats.darkOak)
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.122, 0.102, 0.006), mats.brass)
      edge.position.z = -0.006
      t.position.z = 0.008
      g.add(edge, slab, t)
      g.position.set(x, BT + 0.06, ZL + 0.42)
      g.rotation.x = -0.6
      root.add(g)
    }
    sign('Th', T3.th)
    sign('Ra', T3.ra)
  }
  // the glass line: along to the U-tube, down into the cold and up, through a stopcock into the vessel
  const uPath = new THREE.CurvePath()
  uPath.add(new THREE.LineCurve3(V(T3.u0, Y3), V(T3.u0, T3.ub + 0.06)))
  uPath.add(new THREE.QuadraticBezierCurve3(V(T3.u0, T3.ub + 0.06), V((T3.u0 + T3.u1) / 2, T3.ub - 0.06), V(T3.u1, T3.ub + 0.06)))
  uPath.add(new THREE.LineCurve3(V(T3.u1, T3.ub + 0.06), V(T3.u1, Y3)))
  root.add(new THREE.Mesh(new THREE.TubeGeometry(uPath, 48, 0.014, 8, false), tubeGlass))
  root.add(rod(V(T3.th, Y3), V(T3.u0, Y3), 0.01, tubeGlass))
  root.add(rod(V(T3.u1, Y3), V(T3.v, Y3), 0.01, tubeGlass))
  root.add(rod(V(T3.v, Y3), V(T3.v, VES.y1 + 0.02), 0.01, tubeGlass))
  for (const p of [V(T3.th, Y3), V(T3.ra, Y3), V(T3.u0, Y3), V(T3.u1, Y3), V(T3.v, Y3)]) {
    const j = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), mats.brass)
    j.position.copy(p)
    root.add(j)
  }
  {
    const cock = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 12), mats.brass)
    cock.position.set(T3.cock, Y3, ZL)
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.09), mats.brass)
    handle.position.set(T3.cock, Y3 + 0.035, ZL)
    root.add(cock, handle)
    // a stand holding the line up: an iron rod and clamps
    root.add(rod(V(4.62, BT), V(4.62, Y3 + 0.12, ZL - 0.12), 0.01, mats.iron))
    root.add(rod(V(4.62, Y3, ZL - 0.12), V(4.62, Y3, ZL), 0.006, mats.iron))
    root.add(rod(V(5.42, BT), V(5.42, Y3 + 0.12, ZL - 0.12), 0.01, mats.iron))
    root.add(rod(V(5.42, Y3, ZL - 0.12), V(5.42, Y3, ZL), 0.006, mats.iron))
    for (const x of [4.62, 5.42]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 14), mats.iron)
      foot.position.set(x, BT + 0.01, ZL - 0.12)
      root.add(foot)
    }
  }
  // the flask of liquid air (silvered, a clear strip down its front) on a lab jack
  const flaskG = new THREE.Group()
  const jackTop = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.015, 0.22), mats.brass)
  const jackBars = [0, 1, 2, 3].map(() => new THREE.Mesh(new THREE.BoxGeometry(0.012, 1, 0.012), mats.iron))
  const airFill = new THREE.Mesh(new THREE.CylinderGeometry(FLASK.r - 0.012, FLASK.r - 0.012, FLASK.h * 0.8, 20), new THREE.MeshStandardMaterial({ color: '#a8ccff', emissive: '#3a62a8', emissiveIntensity: 0.3, roughness: 0.1, transparent: true, opacity: 0.32, depthWrite: false }))
  const mist3 = []
  {
    const jackBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.015, 0.22), mats.brass)
    jackBase.position.set((T3.u0 + T3.u1) / 2, BT + 0.008, ZL)
    root.add(jackBase, jackTop, ...jackBars)
    const open = 0.75
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(FLASK.r, FLASK.r, FLASK.h, 28, 1, true, open, TAU - open * 2), new THREE.MeshStandardMaterial({ color: '#d4d8de', roughness: 0.15, metalness: 1, envMap: stage.shine, envMapIntensity: 1.2, side: THREE.DoubleSide }))
    const strip = new THREE.Mesh(new THREE.CylinderGeometry(FLASK.r, FLASK.r, FLASK.h, 8, 1, true, -open, open * 2), tubeGlass)
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(FLASK.r, FLASK.r * 0.9, 0.02, 24), silver)
    bottom.position.y = -FLASK.h / 2
    const rim = new THREE.Mesh(new THREE.TorusGeometry(FLASK.r, 0.008, 6, 28), silver)
    rim.rotation.x = Math.PI / 2
    rim.position.y = FLASK.h / 2
    airFill.position.y = -FLASK.h * 0.08
    flaskG.add(outer, strip, bottom, rim, airFill)
    flaskG.position.set((T3.u0 + T3.u1) / 2, 0, ZL)
    root.add(flaskG)
    // a little cold mist curling over its rim
    for (let k = 0; k < (light ? 3 : 6); k++) {
      const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.soft, color: '#cfe0ff', transparent: true, opacity: 0, depthWrite: false }))
      m.scale.setScalar(0.12)
      flaskG.add(m)
      mist3.push({ m, seed: k * 1.7 })
    }
  }
  // the glass vessel with its zinc sulphide screen and its lump of willemite
  const vesselGlow = { screen: null, rock: null, light: null, bend: null }
  {
    const glassV = new THREE.Mesh(new THREE.CylinderGeometry(VES.r, VES.r, VES.y1 - VES.y0, 28, 1, true), tubeGlass)
    glassV.position.set(T3.v, (VES.y0 + VES.y1) / 2, ZL)
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(VES.r, VES.r, 0.012, 28), tubeGlass)
    bottom.position.set(T3.v, VES.y0, ZL)
    const stopper = new THREE.Mesh(new THREE.CylinderGeometry(VES.r + 0.008, VES.r - 0.004, 0.04, 24), new THREE.MeshStandardMaterial({ color: '#3a2a20', roughness: 0.8 }))
    stopper.position.set(T3.v, VES.y1 + 0.01, ZL)
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(VES.r + 0.04, VES.r + 0.05, 0.08, 24), mats.darkOak)
    stand.position.set(T3.v, BT + 0.04, ZL)
    root.add(glassV, bottom, stopper, stand)
    // the screen: a plate coated with zinc sulphide, near the top, facing the visitor
    const screenMat = new THREE.MeshStandardMaterial({ color: '#9a9e8a', roughness: 0.9, emissive: '#3cff86', emissiveIntensity: 0 })
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.008), screenMat)
    screen.position.set(T3.v, VES.y1 - 0.12, ZL - 0.01)
    screen.rotation.x = -0.25
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.07, 4), mats.brass)
    holder.position.set(T3.v, VES.y1 - 0.03, ZL - 0.02)
    // willemite: a greenish lump at the bottom
    const rockGeo = new THREE.IcosahedronGeometry(0.038, 0)
    const rockMat = new THREE.MeshStandardMaterial({ color: '#8a9a7a', roughness: 0.7, emissive: '#3cff5a', emissiveIntensity: 0, flatShading: true })
    const rock = new THREE.Mesh(rockGeo, rockMat)
    rock.scale.set(1.2, 0.8, 1)
    rock.position.set(T3.v, VES.y0 + 0.04, ZL)
    root.add(screen, holder, rock)
    const pl = new THREE.PointLight('#8affb4', 0, 1.2, 1.8)
    pl.position.set(T3.v, (VES.y0 + VES.y1) / 2, ZL)
    root.add(pl)
    // the glow of the glass where the gas is frozen
    const bend = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.soft, color: hdr('#9ff0ff', 1.3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
    bend.position.set((T3.u0 + T3.u1) / 2, T3.ub, ZL + 0.02)
    bend.scale.setScalar(0.2)
    bend.renderOrder = 7
    root.add(bend)
    vesselGlow.screen = screenMat
    vesselGlow.rock = rockMat
    vesselGlow.light = pl
    vesselGlow.bend = bend
    // the label on the screen's plaque
    const zl = new THREE.Group()
    const slab = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, 0.012), mats.darkOak)
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.166, 0.086, 0.006), mats.brass)
    edge.position.z = -0.006
    const f = formulaText('ZnS', { size: 0.04, color: '#ffe2a8' })
    f.position.z = 0.008
    zl.add(edge, slab, f)
    zl.position.set(T3.v, BT + 0.07, ZL + 0.32)
    zl.rotation.x = -0.6
    root.add(zl)
  }
  plaque(E.cold.labels.air, (T3.u0 + T3.u1) / 2, BT + 0.06, ZL + 0.34, 0.3, 0.03)
  plaque(E.tube.labels.paper, 0.4, BT + 0.06, ZL + 0.36, 0.56, 0.026)
  plaque(E.tube.labels.wool, (T2.s0 + T2.s1) / 2 + 0.27, BT + 0.06, ZL + 0.4, 0.3, 0.028)
  // the calendar card by the vessel: how many days later
  const cardText = (() => {
    const g = new THREE.Group()
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.13, 0.01), new THREE.MeshStandardMaterial({ color: '#e8dcc0', roughness: 0.8, emissive: '#3a3020', emissiveIntensity: 0.3 }))
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.012), new THREE.MeshStandardMaterial({ color: '#8a2a1e', roughness: 0.6 }))
    top.position.y = 0.075
    const t = makeText('', { size: 0.034, color: '#2a1d12', anchorY: 'middle', maxWidth: 0.19 })
    t.position.z = 0.007
    g.add(card, top, t)
    g.position.set(T3.v + 0.24, BT + 0.1, ZL + 0.12)
    g.rotation.set(-0.3, -0.25, 0)
    const legM = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.1, 0.06), mats.darkOak)
    legM.position.set(0, -0.06, -0.03)
    g.add(legM)
    root.add(g)
    return t
  })()
  const daysWord = n => (n === 1 ? E.cold.days.one : E.cold.days.other)
  // the puff of emanation: motes along the line (thorium's or radium's path), then in the vessel
  const paths = {}
  for (const [id, x] of [['Th', T3.th], ['Ra', T3.ra]]) {
    const p = new THREE.CurvePath()
    p.add(new THREE.LineCurve3(V(x, BT + 0.12), V(x, Y3)))
    p.add(new THREE.LineCurve3(V(x, Y3), V(T3.u0, Y3)))
    uPath.curves.forEach(c => p.add(c))
    p.add(new THREE.LineCurve3(V(T3.u1, Y3), V(T3.v, Y3)))
    p.add(new THREE.LineCurve3(V(T3.v, Y3), V(T3.v, VES.y1 - 0.02)))
    const lens = p.getCurveLengths()
    const total = lens[lens.length - 1]
    // where along the path the bottom of the U lies (the middle of its bend)
    const bendAt = (lens[2] + (lens[3] - lens[2]) / 2) / total
    paths[id] = { p, bendAt }
  }
  const NP = light ? 14 : 26
  const puff = Array.from({ length: NP }, (_, i) => ({ lag: (i / NP) * 0.09, j: new THREE.Vector3((Math.random() - 0.5) * 0.016, (Math.random() - 0.5) * 0.016, (Math.random() - 0.5) * 0.016), v: new THREE.Vector3(T3.v + (Math.random() - 0.5) * 0.1, VES.y0 + 0.06 + Math.random() * (VES.y1 - VES.y0 - 0.12), ZL + (Math.random() - 0.5) * 0.1), seed: Math.random() * 100, rank: Math.random() }))
  const motes3 = new Particles(NP, { map: mote, renderOrder: 8 })
  motes3.points.raycast = () => {}
  root.add(motes3.points)
  for (let i = 0; i < NP; i++) motes3.spawn({ x: 0, y: -99, z: 0, life: 1e9, size: 0.03, alpha: 0 })
  const amount3 = () => {
    if (!S3.kind) return 0
    if (S3.kind === 'Th') return S3.days > 0 ? 0 : Math.pow(0.5, ((wall() - S3.born) * SPEED) / TH_HALF)
    return Math.pow(0.5, S3.days / RA_HALF)
  }
  const tp = new THREE.Vector3()
  let glowK = 0
  let bendK = 0
  updates.push((dt, t) => {
    flaskK = damp(flaskK, S3.flask, 2.6, dt)
    const lift = FLASK.lift * ease(flaskK)
    const fy0 = BT + 0.03 + lift
    flaskG.position.y = fy0 + FLASK.h / 2
    jackTop.position.set((T3.u0 + T3.u1) / 2, fy0 - 0.008, ZL)
    // the jack's crossed bars
    const jh = Math.max(0.02, fy0 - BT - 0.02)
    const half = 0.1
    const len = Math.hypot(jh, half * 2)
    const ang = Math.atan2(half * 2, jh)
    jackBars.forEach((b, i) => {
      const s = i % 2 ? 1 : -1
      const zz = i < 2 ? -0.09 : 0.09
      b.scale.y = len
      b.position.set((T3.u0 + T3.u1) / 2, BT + 0.015 + jh / 2, ZL + zz)
      b.rotation.set(0, 0, s * ang)
    })
    for (const { m, seed } of mist3) {
      const c = (t * 0.35 + seed * 0.37) % 1
      m.position.set(Math.sin(seed * 3 + t) * 0.06, FLASK.h / 2 + c * 0.12, Math.cos(seed * 2 + t * 0.7) * 0.05)
      m.material.opacity = 0.22 * Math.sin(Math.PI * c) * (0.4 + 0.6 * flaskK)
      m.scale.setScalar(0.08 + c * 0.1)
    }
    // the phases run on by the clock
    const age = wall() - S3.t0
    if (S3.phase === 1) {
      if (age >= PH.travel && flaskK > 0.7) setPhase(2)
      else if (age >= PH.through) setPhase(4)
    } else if (S3.phase === 3 && age >= PH.rush) setPhase(4)
    // where the puff is: its head's place along the path (0..1)
    const amt = amount3()
    const P = paths[S3.kind || 'Ra']
    let head = 0
    let stop = 1
    if (S3.phase === 1) head = age < PH.travel ? (age / PH.travel) * P.bendAt : P.bendAt + ((age - PH.travel) / (PH.through - PH.travel)) * (1 - P.bendAt)
    else if (S3.phase === 2) (head = P.bendAt + 0.08), (stop = P.bendAt)
    else if (S3.phase === 3) {
      stop = age < PH.warm ? P.bendAt : 1
      head = age < PH.warm ? P.bendAt + 0.08 : P.bendAt + ((age - PH.warm) / (PH.rush - PH.warm)) * (1.1 - P.bendAt)
    } else if (S3.phase === 4) head = 2
    motes3.step(dt, (p, dtt) => {
      const i = motes3.items.indexOf(p)
      const q = puff[i]
      if (!S3.phase || q.rank > amt) {
        p.alpha = damp(p.alpha, 0, 6, dtt)
        if (p.alpha < 0.02) p.y = -99
        return
      }
      const s = head - q.lag
      if (S3.phase === 4 || s >= 1) {
        // in the vessel, wandering
        tp.copy(q.v)
        tp.x += Math.sin(t * 0.7 + q.seed) * 0.02
        tp.y += Math.sin(t * 0.5 + q.seed * 2) * 0.03
        tp.z += Math.cos(t * 0.6 + q.seed) * 0.02
        p.x = damp(p.x, tp.x, 3, dtt)
        p.y = damp(p.y, tp.y, 3, dtt)
        p.z = damp(p.z, tp.z, 3, dtt)
      } else if (s <= 0) {
        p.alpha = 0
        return
      } else {
        const u = Math.min(s, stop - (stop < 1 ? q.lag * 0.4 : 0))
        P.p.getPointAt(clamp(u, 0, 1), tp)
        p.x = tp.x + q.j.x
        p.y = tp.y + q.j.y
        p.z = tp.z + q.j.z
      }
      p.alpha = damp(p.alpha, 1, 6, dtt)
      p.size = 0.03
    }, ctx.camera, ctx.renderer)
    // the glows: the U-tube's glass where the gas is frozen, the screen and the willemite in the vessel
    const frozen = S3.phase === 2 || (S3.phase === 3 && age < PH.warm)
    bendK = damp(bendK, frozen ? amt * (S3.kind === 'Ra' ? 1 : 0.55) : 0, 3, dt)
    glowK = damp(glowK, S3.phase === 4 ? amt : 0, S3.phase === 4 ? 5 : 3, dt)
    vesselGlow.bend.material.opacity = bendK * 0.9
    vesselGlow.bend.scale.setScalar(0.16 + bendK * 0.08)
    vesselGlow.screen.emissiveIntensity = glowK * 0.85
    vesselGlow.rock.emissiveIntensity = glowK * 1.1
    vesselGlow.light.intensity = glowK * (light ? 0.5 : 0.7)
    // the card
    setText(cardText, fill(E.cold.card[S3.days === 1 ? 'one' : 'other'], { n: S3.days }))
    // thorium's last glow, said once for the one who sent it
    if (mine3 && S3.kind === 'Th' && S3.phase === 4 && amt < 0.04 && !thSaid) {
      thSaid = true
      say3('thGone')
    }
  })
  let thSaid = false
  function setPhase(n) {
    const was = S3.phase
    S3.phase = n
    S3.t0 = wall()
    if (!mine3) return
    if (n === 2) say3(S3.kind === 'Th' ? 'trappedTh' : 'trapped')
    else if (n === 4 && was === 1) say3('passed')
    else if (n === 4 && was === 3) {
      if (amount3() < 0.08) say3('gone')
      else {
        say3('rush')
        ex.discover('cold', coldPanel, 2.8)
      }
    }
  }
  const hit3 = {
    flask: new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.42, 0.26), ghost),
    th: new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.4), ghost),
    ra: new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.4), ghost),
  }
  hit3.th.position.set(T3.th, BT + 0.09, ZL + 0.12)
  hit3.ra.position.set(T3.ra, BT + 0.11, ZL + 0.12)
  root.add(hit3.th, hit3.ra)
  flaskG.add(hit3.flask)
  const say3 = (key, vars) => say(fill(at(E.cold.says[key], lv()), vars))
  function coldPanel(l) {
    return {
      title: E.cold.title,
      color,
      blocks: [
        { slider: { label: E.cold.slider, min: 0, max: 20, step: 1, value: S3.days, onInput: v => setDays(v), format: v => fill(E.cold.sliderFmt, { n: Math.round(v), days: daysWord(Math.round(v)), p: Math.round(100 * Math.pow(0.5, Math.round(v) / RA_HALF)) }), live: () => S3.days } },
        {
          buttons: [
            { label: E.cold.buttons.flask, onClick: () => coldStep('flask') },
            { label: E.cold.buttons.ra, onClick: () => coldStep('ra') },
            { label: E.cold.buttons.th, onClick: () => coldStep('th') },
          ],
        },
        ...E.cold.panel[depthOf(l)].map(p => ({ p })),
      ],
    }
  }
  function setDays(v, now = false) {
    const d = clamp(Math.round(Number(v) || 0), 0, 20)
    if (d === S3.days) return
    S3.days = d
    if (now) play('tap')
    const n = d
    if (S3.kind === 'Th' && d > 0) say3('daysTh')
    else if (S3.kind === 'Ra' && S3.phase === 4) say3('days', { n, days: daysWord(n), p: Math.round(100 * Math.pow(0.5, d / RA_HALF)) })
    else if (!S3.kind) say3('empty')
    if (now) share('cold')
    else queueShare('cold')
  }
  function coldStep(what) {
    if (what === 'flask') {
      S3.flask ^= 1
      play('tap')
      say3(S3.flask ? 'up' : 'down')
      mine3 = true
      if (!S3.flask && S3.phase === 2) setPhase(3)
      if (!S3.flask && S3.phase === 3) say3('warming')
    } else if (what === 'ra' || what === 'th') {
      S3.kind = what === 'ra' ? 'Ra' : 'Th'
      S3.born = wall()
      S3.days = 0
      thSaid = false
      mine3 = true
      bulbs[what].scale.set(1.25, 0.55, 1.4)
      setTimeout(() => bulbs[what]?.scale.set(1, 0.85, 1.25), 260)
      play('pop')
      say3(what === 'ra' ? 'sendRa' : 'sendTh')
      setPhase(1)
    } else return
    share('cold')
  }
  clickable(hit3.flask, () => coldStep('flask'))
  clickable(hit3.th, () => coldStep('th'))
  clickable(hit3.ra, () => coldStep('ra'))
  ex.add({
    id: 'cold',
    x: 5.0,
    z: -3.55,
    radius: 2.0,
    manual: true,
    label: E.cold.label,
    verb: () => {
      const H = E.cold.hints
      if (S3.phase === 1) return H.watch
      if (S3.phase === 2) return H.warm
      if (S3.phase === 3) return H.wait
      if (S3.phase === 4) return S3.kind === 'Ra' && S3.days === 0 ? H.days : H.again
      return S3.flask ? H.send : H.flask
    },
    focus: { x: 4.85, y: 1.38, z: ZL, size: 1.35, width: 2.9 },
    act: () => ctx.showPanel(coldPanel),
  })
  const coldState = () => {
    const limit = [0, PH.through, 0, PH.rush, 0][S3.phase] || 0
    const age = limit ? Math.min(limit, wall() - S3.t0) : 0
    const born = S3.kind ? Math.min(60, wall() - S3.born) : 0
    return { flask: S3.flask, kind: S3.kind, phase: S3.phase, age: Math.round(age * 10) / 10, born: Math.round(born * 10) / 10, days: S3.days }
  }
  const coldSet = (s, liveSet, ago = 0) => {
    const flask = s?.flask ? 1 : 0
    const kind = s?.kind === 'Th' || s?.kind === 'Ra' ? s.kind : ''
    const phase = clamp(Math.round(Number(s?.phase) || 0), 0, 4)
    const days = clamp(Math.round(Number(s?.days) || 0), 0, 20)
    if (liveSet) {
      if (phase === 1 && (S3.phase !== 1 || kind !== S3.kind)) play('pop')
      else if (flask !== S3.flask) play('tap')
    }
    if (phase !== S3.phase || kind !== S3.kind) mine3 = false
    S3.flask = flask
    S3.kind = kind
    S3.days = days
    S3.phase = phase
    S3.t0 = wall() - Math.max(0, Number(s?.age) || 0) - (phase === 1 || phase === 3 ? Math.max(0, ago) : 0)
    S3.born = wall() - Math.max(0, Number(s?.born) || 0) - Math.max(0, ago)
    if (!liveSet) flaskK = flask
  }

  // the stage's own update (dust, snow past the windows, the clock)
  updates.push((dt, t) => stage.update(t, dt))

  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())

  return {
    env: { ...stage.env },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.2 },
    spawn: { x: 0, z: 3.0, yaw: 0 },
    hostSpot: { x: -1.9, z: 2.1, yaw: Math.atan2(-1.9, -0.8) },
    back: { x: 0, z: 5.9, rot: Math.PI },
    // the easel to the right, off the line the first station's view backs off along on a phone
    stand: { x: 2.7, z: 1.6, rot: Math.atan2(-2.7, 1.4) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      owens: {
        tap: what => owensStep(what), // 'door', 'window', 'lid'
        set: v => setWin(v / 100, true), // the panel's slider, 0..100
        get state() { return owensState() },
        get reading() { return read1 },
        doorAt: () => V(DOOR.x, 1.3, ROOM.z0 + 0.2),
        winAt: () => V(WIN1 - 0.33, 1.75, ROOM.z0 + 0.15),
        lidAt: () => lidG.position.clone().setY(lidG.position.y + CASE.h / 2),
      },
      tube: {
        tap: what => tubeStep(what), // 'bellows', 'wool', 'watch'
        set: v => setSpeed(v, true), // the panel's slider, 1..20
        get state() { return tubeState() },
        get reading() { return read2 },
        get t() { return tExp() },
        bellowsAt: () => V(T2.bellows, BT + 0.17, ZL + 0.05),
        woolAt: () => wool.position.clone(),
        watchAt: () => V(T2.watch, BT + 0.14, ZL + 0.42),
      },
      cold: {
        tap: what => coldStep(what), // 'flask', 'ra', 'th'
        set: v => setDays(v, true), // the panel's slider, 0..20
        get state() { return coldState() },
        get glow() { return glowK },
        get frozen() { return bendK },
        flaskAt: () => flaskG.position.clone(),
        raAt: () => V(T3.ra, BT + 0.1, ZL + 0.1),
        thAt: () => V(T3.th, BT + 0.08, ZL + 0.1),
      },
      rayTo,
    },
    panels: { owens: owensPanel, tube: tubePanel, cold: coldPanel },
    shared: {
      owens: { get: owensState, set: owensSet },
      tube: { get: tubeState, set: tubeSet },
      cold: { get: coldState, set: coldSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const k of Object.keys(pending)) if (pending[k]) clearTimeout(pending[k])
      for (const tx of textures) tx.dispose()
    },
  }
}
