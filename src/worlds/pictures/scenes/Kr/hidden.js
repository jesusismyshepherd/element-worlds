// Krypton's picture "What was hiding in the air?" as a room (docs/knowledge/picture-rooms.md): the picture
// made into a teaching laboratory at University College London, a night at the end of May 1898, by gaslight
// (stages/gaslab.js: glazed brick, teak benches, gas mantles, sash windows onto Gower Street). One long bench
// along the back wall holds the picture's three steps, each worked by tapping its thing (the user, 2026-10-30:
// pressing E through fixed steps felt passive); the prompt names the next tap, E opens the station's panel,
// whose buttons (and sliders) do the same:
// - the last drops (left): Hampson's silvered flask of liquid air with a clear strip showing the level (750
//   cm3 at the start); tap the flask (or use the slider) and it boils away, nitrogen leaving first (blue pairs),
//   then more and more oxygen (red pairs) and argon, the liquid warming a little; at 10 cm3 tap the brass
//   stopcock and the last drops' gas goes along a pipe into a gas holder over mercury. A jar of a million
//   molecules of air: tap it and all but the one krypton fade; its twin, a flask of the last 10 cm3, is
//   far richer (about seventy krypton);
// - the clean-up (middle): the gas holder, a tube of copper turnings over one burner, a tube of magnesium over
//   another, a measuring tube over mercury. Tap the burners to heat, then the holder's tap: hot copper takes
//   the oxygen and blackens, hot magnesium takes the nitrogen and gets a yellowish crust; cold, they let it
//   through. What is left (about 26 cm3) fills the measuring tube; a lens shows its atoms. Tap the tube to
//   start again with fresh copper and magnesium;
// - seal it and light it (right): a Plucker tube on a stand, a mercury pump, an induction coil. Pump the tube
//   empty (a slider, or tap the pump's reservoir), tap the measuring tube's tap to let the gas in, tap the
//   blowpipe flame to seal the neck, tap the coil: white-lilac light, and a notebook opens on two coloured
//   strokes, yellow and green (no words). Gas that was not cleaned glows pink with the air's nitrogen.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
import * as THREE from 'three'
import { canvasTex, at, clamp, damp, random, fill } from '../../../wings/noble/kit.js'
import { Particles } from '../../../wings/oxygen/kit.js'
import { gaslabStage, GAS } from '../../stages/gaslab.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { HIDDEN_WORDS } from './hidden.words.js'

export const WORDS = HIDDEN_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// ---- where things stand (metres; the spawn at z = 3 looks along -z, into the picture) ----
const ROOM = { x0: -6.6, x1: 6.6, z0: -6.5, z1: 6.6, h: 4.4 }
const BT = 0.92 // bench top
const ZL = -5.3 // the line the apparatus stands on
const BENCH = { x: 0, z: -5.25, w: 12.4, d: 1.3 }
const FL = { x: -4.8 } // the flask
const YP = BT + 0.63 // the pipe from the flask to the holder
const HOLDER = { x: -1.7, y0: BT + 0.1, y1: BT + 0.5, r: 0.085 }
const CU = { x0: -1.15, x1: 0.05, y: 1.2, burner: -0.55 }
const MG = { x0: 0.55, x1: 1.75, y: 1.2, burner: 1.15 }
const EUD = { x: 2.4, y0: BT + 0.1, y1: BT + 0.7, r: 0.04 }
const TUBE = { x: 4.1, y0: 1.12, y1: 1.62 }
const NECK_Y = 1.72
const PUMP = { x: 5.0, rx: 5.32 }
const GAUGE = { x: 4.65 }
const RUN_T = 10.5 // seconds a clean-up run takes
const TRAVEL = 4.5
const LEFT0 = 750
const BOIL_STAGES = [0, 250, 500, 700, 740]
const SP = { N: 0, O: 1, AR: 2, KR: 3, XE: 4 }
const SPCOL = [[0.35, 0.55, 1.0], [1.0, 0.36, 0.3], [0.6, 0.92, 0.88], [0.78, 1.0, 0.35], [0.72, 0.55, 1.0]]

/** A flame: a teardrop, white at its heart, `mid` between, `edge` at its rim. */
function flameTex(core, mid, edge) {
  return canvasTex(64, 128, (g, w, h) => {
    g.save()
    g.translate(w / 2, h * 0.7)
    g.scale(1, 2.3)
    const grd = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.45)
    grd.addColorStop(0, core)
    grd.addColorStop(0.35, mid)
    grd.addColorStop(1, edge)
    g.fillStyle = grd
    g.beginPath()
    g.arc(0, 0, w * 0.45, 0, TAU)
    g.fill()
    g.restore()
  })
}

/** A line of geometry between two points (a unit cylinder, stretched). */
const UP = new THREE.Vector3(0, 1, 0)
function stretch(mesh, a, b) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.scale.set(mesh.userData.r ?? 1, Math.max(0.001, a.distanceTo(b)), mesh.userData.r ?? 1)
  mesh.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize())
}

/** The spectrum drawn in Travers' notebook: a dark band, a yellow line and a green line, and rough ink. */
function pageTex() {
  const rnd = random(5)
  return canvasTex(192, 256, (g, w, h) => {
    g.fillStyle = '#d8ccaa'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 300; i++) {
      g.fillStyle = `rgba(110,90,60,${0.04 + rnd() * 0.08})`
      g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 3, 1)
    }
    // ruled faint lines
    g.strokeStyle = 'rgba(120,150,170,0.35)'
    g.lineWidth = 1
    for (let y = 112; y < h; y += 16) {
      g.beginPath()
      g.moveTo(14, y)
      g.lineTo(w - 14, y)
      g.stroke()
    }
    // the dark band of the spectrum with its two bright lines
    g.fillStyle = '#16161c'
    g.fillRect(16, 20, w - 32, 70)
    g.shadowColor = '#ffe14a'
    g.shadowBlur = 8
    g.fillStyle = '#ffe14a'
    g.fillRect(w * 0.64, 20, 6, 70)
    g.shadowColor = '#7dff5a'
    g.fillStyle = '#7dff5a'
    g.fillRect(w * 0.31, 20, 6, 70)
    g.shadowBlur = 0
    // hand-drawn strokes beneath, in pencil
    g.strokeStyle = '#4a4030'
    g.lineWidth = 1.6
    g.beginPath()
    g.moveTo(16, 104)
    g.lineTo(w * 0.31 + 3, 104)
    g.moveTo(w * 0.64 + 3, 104)
    g.lineTo(w - 16, 104)
    g.stroke()
  })
}

/** What lies in the lens: argon atoms, a few krypton atoms, and the air's pairs when not clean. */
function drawLens(g, w, h, { o, n, ready }) {
  const bg = g.createRadialGradient(w * 0.35, h * 0.3, 10, w / 2, h / 2, w * 0.7)
  bg.addColorStop(0, '#34445c')
  bg.addColorStop(1, '#141a26')
  g.fillStyle = bg
  g.fillRect(0, 0, w, h)
  if (!ready) return
  const rnd = random(31)
  const atom = (x, y, r, c) => {
    const grd = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r)
    grd.addColorStop(0, '#ffffff')
    grd.addColorStop(0.25, c)
    grd.addColorStop(1, 'rgba(0,0,0,0.45)')
    g.fillStyle = grd
    g.beginPath()
    g.arc(x, y, r, 0, TAU)
    g.fill()
  }
  const place = (count, r, c) => {
    for (let i = 0; i < count; i++) atom(40 + rnd() * (w - 80), 40 + rnd() * (h - 80), r, c)
  }
  place(14, 16, '#7fd9cf')
  place(3, 18, '#b6ff5a')
  if (o) for (let i = 0; i < 4; i++) {
    const x = 40 + rnd() * (w - 80)
    const y = 40 + rnd() * (h - 80)
    atom(x - 9, y, 11, '#ff6a58')
    atom(x + 9, y, 11, '#ff6a58')
  }
  if (n) for (let i = 0; i < 3; i++) {
    const x = 40 + rnd() * (w - 80)
    const y = 40 + rnd() * (h - 80)
    atom(x - 9, y, 11, '#5f8fff')
    atom(x + 9, y, 11, '#5f8fff')
  }
}

// the shader of a jar of a million molecules: positions and kinds come from each dot's number, so a million
// dots cost one small buffer. A cube (the jar) or a ball (the flask).
const CLOUD_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPx;
  uniform float uFade;
  uniform float uBall;
  uniform float uSide;
  uniform vec2 uCut;
  varying vec3 vC;
  varying float vA;
  uint pcg(uint v) {
    uint state = v * 747796405u + 2891336453u;
    uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
  }
  float rnd(uint s) { return float(pcg(s)) / 4294967295.0; }
  void main() {
    uint id = uint(position.x);
    vec3 p;
    if (uBall > 0.5) {
      float z = rnd(id * 4u) * 2.0 - 1.0;
      float ph = rnd(id * 4u + 1u) * 6.2831853;
      float r = pow(rnd(id * 4u + 2u), 0.3333333) * uSide;
      float s = sqrt(max(0.0, 1.0 - z * z));
      p = r * vec3(s * cos(ph), z, s * sin(ph));
    } else {
      p = (vec3(rnd(id * 4u), rnd(id * 4u + 1u), rnd(id * 4u + 2u)) - 0.5) * 2.0 * uSide;
    }
    float f = float(id);
    p += 0.004 * vec3(sin(uTime * 2.0 + f), cos(uTime * 1.7 + f * 1.3), sin(uTime * 2.3 + f * 0.7));
    float k = rnd(id * 4u + 3u);
    vC = k < uCut.x ? vec3(0.35, 0.55, 1.0) : (k < uCut.y ? vec3(1.0, 0.36, 0.3) : vec3(0.6, 0.92, 0.88));
    vA = 1.0 - uFade;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uPx;
    gl_Position = projectionMatrix * mv;
  }`
const CLOUD_FRAG = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vC;
  varying float vA;
  void main() {
    if (vA < 0.01) discard;
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vC, uAlpha * vA);
  }`

export async function build({ ctx, root, E, ex, say, light, level, color, clickable }) {
  const stage = gaslabStage({
    light,
    ...ROOM,
    mantles: [
      { side: 'n', at: -3.4, y: 2.2 },
      { side: 'n', at: 3.4, y: 2.2 },
      { side: 'n', at: 0, y: 2.4 },
      { side: 'e', at: -2.2, y: 2.6 },
      { side: 'w', at: -2.2, y: 2.6 },
    ],
    // over the three stations, in front of the apparatus so it is lit from the visitor's side
    pendants: [{ x: -3.9, z: -3.7, light: 9 }, { x: 0.3, z: -3.7, light: 9 }, { x: 4.3, z: -3.7, light: 9 }],
    windows: [{ side: 'w', at: 1.4 }, { side: 'e', at: 1.4 }, { side: 'e', at: 4.2 }],
    door: { side: 'w', at: 4.6 },
    shelves: { x0: -5.8, x1: 5.8, ys: [2.7, 3.25, 3.8] },
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k)
  const tmpV = new THREE.Vector3()
  const pr = ctx.renderer
  const silver = new THREE.MeshStandardMaterial({ color: '#d4d8de', roughness: 0.18, metalness: 1, envMap: stage.shine, envMapIntensity: 1.2, side: THREE.DoubleSide })
  const copper = new THREE.MeshStandardMaterial({ color: '#c8733c', roughness: 0.4, metalness: 0.8, envMap: stage.shine, emissive: '#ff3b10', emissiveIntensity: 0 })
  const magnesium = new THREE.MeshStandardMaterial({ color: '#c4c8cc', roughness: 0.35, metalness: 0.85, envMap: stage.shine, emissive: '#ffd0a0', emissiveIntensity: 0 })
  const flameBlue = flameTex('rgba(235,245,255,1)', 'rgba(110,170,255,0.8)', 'rgba(60,110,255,0)')
  textures.push(flameBlue)
  const flameBlueMat = new THREE.SpriteMaterial({ map: flameBlue, color: hdr('#ffffff', 1.5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })

  // ---------------- small makers ----------------
  const rod = (a, b, r, mat, seg = 10) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, seg), mat)
    m.userData.r = r
    stretch(m, a, b)
    return m
  }
  /** A pipe through points: cylinders and a joint ball at each corner. */
  const pipe = (pts, r, mat) => {
    const g = new THREE.Group()
    pts.slice(1).forEach((p, i) => g.add(rod(pts[i], p, r, mat)))
    pts.slice(1, -1).forEach(p => {
      const j = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat)
      j.position.copy(p)
      g.add(j)
    })
    return g
  }
  const V = (x, y, z = ZL) => new THREE.Vector3(x, y, z)
  const label = (text, x, y, z, size = 0.06, rotY = 0, colorStr = '#ffe2b8') => {
    const t = makeText(text, { size, color: colorStr, anchorY: 'middle', maxWidth: 1.2 })
    t.position.set(x, y, z)
    t.rotation.y = rotY
    root.add(t)
    return t
  }
  /** A small dark plaque with two lines of gold letters on a short stand; returns its text objects. */
  const plaque = (x, y, z, w, h, lines) => {
    const g = new THREE.Group()
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), mats.darkTeak)
    const edge = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.012), mats.brass)
    edge.position.z = -0.008
    g.add(edge, slab)
    const texts = lines.map(([text, size, y1, col]) => {
      const t = makeText(text, { size, color: col ?? '#ffe2b8', anchorY: 'middle', maxWidth: w * 0.94 })
      t.position.set(0, y1, 0.014)
      g.add(t)
      return t
    })
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.02, y - BT, 0.02), mats.darkTeak)
    leg.position.set(0, -(y - BT) / 2 - h / 2, -0.02)
    g.add(leg)
    g.position.set(x, y, z)
    root.add(g)
    return texts
  }
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }

  // ---------------- the bench ----------------
  {
    const top = new THREE.Mesh(new THREE.BoxGeometry(BENCH.w, 0.07, BENCH.d), mats.teak)
    top.position.set(BENCH.x, BT - 0.035, BENCH.z)
    const body = new THREE.Mesh(new THREE.BoxGeometry(BENCH.w - 0.2, BT - 0.1, BENCH.d - 0.2), mats.darkTeak)
    body.position.set(BENCH.x, (BT - 0.07) / 2, BENCH.z)
    root.add(top, body)
    // cupboard doors and brass handles along the front
    for (let i = 0; i < 12; i++) {
      const x = -5.5 + i * 1
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.62, 0.02), mats.teak)
      door.position.set(x, 0.45, BENCH.z + BENCH.d / 2 - 0.09)
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), mats.brass)
      knob.position.set(x + (i % 2 ? -0.35 : 0.35), 0.62, BENCH.z + BENCH.d / 2 - 0.07)
      root.add(door, knob)
    }
    // the gas taps along the back, brass, with a rubber tube hanging
    for (const x of [-5.6, -3.4, -1.0, 1.4, 3.6, 5.6]) {
      const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 8), mats.brass)
      tap.position.set(x, BT + 0.05, BENCH.z - 0.55)
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), mats.brass)
      hand.position.set(x, BT + 0.1, BENCH.z - 0.55)
      root.add(tap, hand)
    }
    solids.push(box(BENCH.x, BENCH.z, BENCH.w, BENCH.d))
  }
  // a blackboard on the east wall, chalk sketches and no words: the flask, a falling level, a tube
  {
    const rnd = random(9)
    const tex = canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#243428'
      g.fillRect(0, 0, w, h)
      for (let i = 0; i < 160; i++) {
        g.fillStyle = `rgba(200,210,200,${0.02 + rnd() * 0.05})`
        g.fillRect(rnd() * w, rnd() * h, 14 + rnd() * 50, 2)
      }
      g.strokeStyle = 'rgba(235,240,225,0.85)'
      g.lineWidth = 2.4
      g.lineCap = 'round'
      // a flask with bubbles and three rising arrows
      g.beginPath()
      g.moveTo(80, 70); g.lineTo(80, 110); g.lineTo(50, 170); g.lineTo(110, 170); g.lineTo(80, 110)
      g.stroke()
      g.beginPath()
      g.arc(70, 52, 5, 0, TAU); g.arc(90, 40, 4, 0, TAU); g.arc(78, 26, 3, 0, TAU)
      g.stroke()
      // a level that drops: three marks and arrows
      for (const [x, y] of [[170, 70], [220, 100], [270, 140]]) {
        g.beginPath()
        g.moveTo(x, y); g.lineTo(x + 36, y)
        g.stroke()
      }
      g.beginPath()
      g.moveTo(180, 80); g.lineTo(235, 112); g.lineTo(285, 150)
      g.stroke()
      g.beginPath()
      g.moveTo(272, 140); g.lineTo(285, 150); g.lineTo(268, 156)
      g.stroke()
      // a tube with a glow, rays
      g.beginPath()
      g.moveTo(390, 70); g.lineTo(450, 70); g.lineTo(450, 110); g.lineTo(390, 110); g.closePath()
      g.stroke()
      for (let i = 0; i < 5; i++) {
        g.beginPath()
        g.moveTo(420, 120); g.lineTo(380 + i * 22, 160 + (i % 2) * 14)
        g.stroke()
      }
      // a dotted ring for "one in a million"
      g.setLineDash([2, 8])
      g.beginPath()
      g.arc(340, 200, 36, 0, TAU)
      g.stroke()
      g.setLineDash([])
      g.beginPath()
      g.arc(340, 200, 4, 0, TAU)
      g.stroke()
    })
    textures.push(tex)
    const board = new THREE.Group()
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.5), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }))
    slab.position.z = 0.02
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.14, 1.64, 0.05), mats.darkTeak)
    frame.position.z = 0.0
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.04, 0.1), mats.darkTeak)
    ledge.position.set(0, -0.8, 0.07)
    board.add(frame, slab, ledge)
    stage.onWall(board, 'w', -3.0, 1.95, 0.03)
  }

  // =====================================================================================
  // STATION 1: the last drops
  // =====================================================================================
  const S = {
    boiled: 0, // cm3 boiled away, 0..740
    caught: 0, // the last drops' gas is in the holder
    caughtAt: -99, // wall-clock seconds
    jar: 0, // 1: only the krypton shows
    twin: 0,
    cu: 0,
    mg: 0,
    run: null, // { cu, mg, t0 } (t0 wall-clock seconds), the clean-up under way or done
    spent: { cu: 0, mg: 0 }, // how much the copper has blackened, the magnesium crusted, 0..1
    pump: 0, // 0..1
    gas: 0, // 0 none, 1 clean, 2 mixed with air's gases
    sealed: 0,
    sealAt: -99,
    lit: 0,
    book: 0, // the notebook opened by a clean glow
  }
  const wall = () => Date.now() / 1000

  const flask = new THREE.Group()
  flask.position.set(FL.x, BT, ZL)
  root.add(flask)
  const GAP = 0.34
  {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 24), mats.darkTeak)
    foot.position.y = 0.02
    flask.add(foot)
    const prof = [[0.0, 0.04], [0.17, 0.04], [0.178, 0.06], [0.178, 0.46], [0.12, 0.52], [0.05, 0.57], [0.05, 0.63]].map(([x, y]) => new THREE.Vector2(x, y))
    const shell = new THREE.Mesh(new THREE.LatheGeometry(prof, 44, GAP, TAU - 2 * GAP), silver)
    flask.add(shell)
    // the inner glass and the liquid, seen through the clear strip
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.42, 28, 1, true), mats.glass)
    inner.position.y = 0.26
    flask.add(inner)
    const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.04, 0.05, 14), new THREE.MeshStandardMaterial({ color: '#8a6a3a', roughness: 0.9 }))
    stopper.position.y = 0.625
    flask.add(stopper)
    const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), mats.glass)
    vent.position.y = 0.72
    flask.add(vent)
  }
  const liquidMat = new THREE.MeshStandardMaterial({ color: '#a8d6ff', roughness: 0.15, transparent: true, opacity: 0.78, emissive: '#2f6aa0', emissiveIntensity: 0.45 })
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.146, 0.146, 1, 28), liquidMat)
  liquid.position.set(0, 0.05, 0)
  flask.add(liquid)
  // the stopcock and the pipe to the gas holder
  const stop = new THREE.Group()
  stop.position.set(FL.x + 0.6, YP, ZL)
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.12, 12), mats.brass)
    body.rotation.x = Math.PI / 2
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.07, 12), mats.brass)
    const key = new THREE.Group()
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.022, 0.022), mats.brass)
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), mats.brass)
    tip.position.x = 0.075
    key.add(handle, tip)
    key.position.y = 0.05
    stop.add(body, barrel, key)
    stop.userData.key = key
  }
  root.add(stop)
  const pipeA = pipe([V(FL.x, YP + 0.0), V(FL.x + 0.5, YP), V(FL.x + 0.7, YP), V(HOLDER.x, YP), V(HOLDER.x, HOLDER.y1 + 0.08)], 0.011, mats.glass)
  root.add(pipeA)
  // the plaque: the level and the temperature
  const [plLeft, plUnit, plTemp] = plaque(FL.x - 0.5, BT + 0.55, ZL + 0.2, 0.46, 0.42, [
    ['750', 0.13, 0.1, '#ffe2b8'],
    [E.flask.plaque.unit, 0.034, -0.02, '#d6d2c0'],
    ['', 0.04, -0.12, '#a8d6ff'],
  ])
  // the vapour from the vent: nitrogen pairs, oxygen pairs, argon singles
  const dotMap = stage.soft
  const plume = new Particles(150, { map: dotMap, additive: false })
  root.add(plume.points)
  const pcol = (sp, k = 1) => ({ r: SPCOL[sp][0] * k, g: SPCOL[sp][1] * k, b: SPCOL[sp][2] * k })
  const rnd = random(77)
  function emitMolecule(sp, x, y, z, vx, vy, vz, life, sz = 1) {
    const pair = sp === SP.N || sp === SP.O
    const a = rnd() * TAU
    const o = pair ? 0.016 : 0
    for (const s of pair ? [-1, 1] : [0]) {
      plume.spawn({ x: x + Math.cos(a) * o * s, y: y + Math.sin(a) * o * s * 0.6, z: z + Math.sin(a) * o * s * 0.6, vx, vy, vz, life, size: (sp >= 3 ? 0.04 : 0.032) * sz, alpha: 0, k: rnd() * 10, ...pcol(sp, 1.1) })
    }
  }
  const mixAt = g => {
    const wN = 0.9 * Math.pow(1 - g, 1.6) + 0.02
    const wO = 0.08 + 0.8 * Math.pow(g, 1.5)
    const wA = 0.03 + 0.1 * g
    const r = rnd() * (wN + wO + wA)
    return r < wN ? SP.N : r < wN + wO ? SP.O : SP.AR
  }
  let emitAcc = 0
  let dispBoiled = 0
  const left = () => LEFT0 - dispBoiled
  const gProg = () => clamp(dispBoiled / 740)

  // the jar of a million molecules and its twin, the flask of the last 10 cm3
  const JAR = { x: -3.7, y: BT + 0.04, side: 0.17 }
  const TWIN = { x: -2.75, y: BT + 0.04, r: 0.125 }
  const KR_COLOR = hdr('#c9ff5a', 2.2)
  const makeCloud = ({ ball, side, cut, alpha }) => {
    const n = 1_000_000
    const ids = new Float32Array(n)
    for (let i = 0; i < n; i++) ids[i] = i
    const geo = new THREE.BufferGeometry()
    // the dot's number is its only attribute (as `position.x`): the shader makes the rest. A one-component
    // position still counts n dots, which is what three draws
    geo.setAttribute('position', new THREE.BufferAttribute(ids, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), side * 2)
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAlpha: { value: alpha }, uPx: { value: light ? 1.6 : 2 }, uFade: { value: 0 }, uBall: { value: ball ? 1 : 0 }, uSide: { value: side }, uCut: { value: new THREE.Vector2(cut[0], cut[1]) } },
      vertexShader: CLOUD_VERT,
      fragmentShader: CLOUD_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    pts.raycast = () => {}
    return { pts, mat }
  }
  const jarCloud = makeCloud({ ball: false, side: JAR.side - 0.015, cut: [0.7808, 0.9903], alpha: 0.0035 })
  const twinCloud = makeCloud({ ball: true, side: TWIN.r - 0.012, cut: [0.03, 0.97], alpha: 0.0011 })
  const jarG = new THREE.Group()
  jarG.position.set(JAR.x, JAR.y + JAR.side + 0.02, ZL + 0.12)
  jarG.add(jarCloud.pts)
  const jarBox = new THREE.Mesh(new THREE.BoxGeometry(JAR.side * 2, JAR.side * 2, JAR.side * 2), mats.glass)
  const jarLid = new THREE.Mesh(new THREE.BoxGeometry(JAR.side * 2 + 0.02, 0.02, JAR.side * 2 + 0.02), mats.brass)
  jarLid.position.y = JAR.side + 0.01
  const jarFoot = new THREE.Mesh(new THREE.BoxGeometry(JAR.side * 2 + 0.04, 0.04, JAR.side * 2 + 0.04), mats.darkTeak)
  jarFoot.position.y = -JAR.side - 0.02
  jarG.add(jarBox, jarLid, jarFoot)
  root.add(jarG)
  const twinG = new THREE.Group()
  twinG.position.set(TWIN.x, TWIN.y + TWIN.r + 0.06, ZL + 0.12)
  twinG.add(twinCloud.pts)
  {
    const prof = []
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 0.92 - Math.PI / 2 // round bottom up to the shoulder
      prof.push(new THREE.Vector2(Math.cos(a) * TWIN.r, Math.sin(a) * TWIN.r))
    }
    prof.push(new THREE.Vector2(0.03, TWIN.r + 0.05), new THREE.Vector2(0.03, TWIN.r + 0.16))
    const fl = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), mats.glass)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 8, 20), mats.darkTeak)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -TWIN.r - 0.05
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.04, 20), mats.darkTeak)
    foot.position.y = -TWIN.r - 0.1
    twinG.add(fl, ring, foot)
  }
  root.add(twinG)
  // the krypton dots (the one in the jar, about seventy in the flask), made visible by the tap
  const krDots = (n, where) => {
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const p = where(i)
      pos.set([p.x, p.y, p.z], i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: KR_COLOR, size: 0.002, map: dotMap, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    pts.raycast = () => {}
    return { pts, mat }
  }
  const jarKr = krDots(1, () => new THREE.Vector3(0.06, -0.03, 0.05))
  jarG.add(jarKr.pts)
  const rk = random(12)
  const twinKr = krDots(70, () => {
    const z = rk() * 2 - 1
    const ph = rk() * TAU
    const r = Math.cbrt(rk()) * (TWIN.r - 0.02)
    const s = Math.sqrt(1 - z * z)
    return new THREE.Vector3(r * s * Math.cos(ph), r * z, r * s * Math.sin(ph))
  })
  twinG.add(twinKr.pts)
  // a ring that finds the lone krypton in the jar
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.0035, 8, 28), new THREE.MeshBasicMaterial({ color: hdr('#c9ff5a', 1.6), transparent: true, opacity: 0 }))
  ring.position.set(0.06, -0.03, 0.05)
  ring.rotation.x = 0.35
  jarG.add(ring)
  const [jarLabel] = plaque(JAR.x, JAR.y + 0.0 + 0.09, ZL + 0.52, 0.5, 0.11, [[E.flask.plaque.air, 0.028, 0, '#ffe2b8']])
  const [twinLabel] = plaque(TWIN.x, JAR.y + 0.09, ZL + 0.52, 0.4, 0.11, [[E.flask.plaque.last, 0.03, 0, '#ffe2b8']])

  // hit shapes for the flask, the stopcock, the jar, its twin
  const flaskHit = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.62, 12), ghost)
  flaskHit.position.set(FL.x, BT + 0.33, ZL)
  const stopHit = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.2), ghost)
  stopHit.position.copy(stop.position)
  const jarHit = new THREE.Mesh(new THREE.BoxGeometry(JAR.side * 2, JAR.side * 2, JAR.side * 2), ghost)
  jarHit.position.copy(jarG.position)
  const twinHit = new THREE.Mesh(new THREE.SphereGeometry(TWIN.r + 0.02, 12, 10), ghost)
  twinHit.position.copy(twinG.position)
  root.add(flaskHit, stopHit, jarHit, twinHit)

  const lv = () => level()
  const sayFlask = (key, vars) => say(fill(at(E.flask.says[key], lv()), vars))
  const leftNow = () => Math.round(LEFT0 - S.boiled)
  const tempNow = g => Math.round(-194.3 + 11.3 * g * g * (3 - 2 * g))

  function flaskPanel(l) {
    return {
      title: E.flask.title,
      color,
      blocks: [
        { slider: { label: E.flask.slider, min: 0, max: 740, step: 10, value: S.boiled, onInput: v => setBoiled(v), format: v => fill(E.flask.sliderFmt, { gone: Math.round(v), left: LEFT0 - Math.round(v) }), live: () => S.boiled } },
        {
          buttons: [
            { label: E.flask.buttons.boil, onClick: () => flaskStep('boil') },
            { label: E.flask.buttons.catch, onClick: () => flaskStep('catch') },
            { label: E.flask.buttons.jar, onClick: () => flaskStep('jar') },
            { label: E.flask.buttons.last, onClick: () => flaskStep('last') },
            { label: E.flask.buttons.fresh, onClick: () => flaskStep('fresh') },
          ],
        },
        ...E.flask.panel[depthOf(l)].map(p => ({ p })),
      ],
    }
  }
  function setBoiled(v, now = false) {
    const b = clamp(Math.round(Number(v) || 0), 0, 740)
    if (b === S.boiled) return
    const was = S.boiled
    S.boiled = b
    if (now) play('tap')
    if (b >= 735 && was < 735) sayFlask('last')
    else if (now) sayFlask('boil', { left: leftNow() })
    if (now) share('flask')
    else queueShare('flask')
  }
  const pending = {}
  function queueShare(id) {
    if (pending[id]) return
    pending[id] = setTimeout(() => {
      pending[id] = null
      share(id)
    }, 250)
  }
  function flaskStep(what) {
    if (what === 'boil') {
      if (S.boiled >= 740) return flaskStep('fresh')
      const next = BOIL_STAGES.find(v => v > S.boiled)
      return setBoiled(next, true)
    }
    if (what === 'fresh') {
      S.boiled = 0
      play('tap')
      sayFlask('fresh')
    } else if (what === 'catch') {
      if (S.boiled < 735) return sayFlask('early', { left: leftNow() })
      if (S.caught && !S.run) return sayFlask('again')
      if (S.run) return sayFlask('again')
      S.caught = 1
      S.caughtAt = wall()
      play('select')
      sayFlask('caught')
      ex.discover('flask', flaskPanel, 3.6)
    } else if (what === 'jar') {
      S.jar ^= 1
      play(S.jar ? 'select' : 'tap')
      sayFlask(S.jar ? 'jar' : 'jarBack')
      } else if (what === 'last') {
      S.twin ^= 1
      play(S.twin ? 'select' : 'tap')
      sayFlask(S.twin ? 'twin' : 'twinBack')
      } else return
    share('flask')
  }
  clickable(flaskHit, () => flaskStep('boil'))
  clickable(stopHit, () => flaskStep('catch'))
  clickable(jarHit, () => flaskStep('jar'))
  clickable(twinHit, () => flaskStep('last'))
  ex.add({
    id: 'flask',
    x: -3.9,
    z: -3.75,
    radius: 2.3,
    manual: true,
    label: E.flask.label,
    verb: () => {
      const H = E.flask.hints
      if (S.boiled < 735) return H.boil
      if (!S.caught) return H.catch
      return H.done
    },
    focus: { x: -3.9, y: 1.25, z: ZL, size: 1.35, width: 3.6 },
    act: () => ctx.showPanel(flaskPanel),
  })
  const flaskState = () => ({ boiled: S.boiled, caught: S.caught, caughtAge: S.caught ? Math.min(4, Math.max(0, wall() - S.caughtAt)) : 0, jar: S.jar, twin: S.twin })
  const flaskSet = (s, liveSet, ago = 0) => {
    const b = clamp(Math.round(Number(s?.boiled) || 0), 0, 740)
    const c = s?.caught ? 1 : 0
    const j = s?.jar ? 1 : 0
    const t = s?.twin ? 1 : 0
    if (liveSet) {
      if (c && !S.caught) sayFlask('caught')
      else if (b !== S.boiled) play('tap')
    }
    S.boiled = b
    // a catch seen now started `caughtAge + ago` seconds ago (a late-comer finds the pipe already run)
    if (c && !S.caught) S.caughtAt = wall() - (Math.max(0, Number(s?.caughtAge) || 0) + ago)
    if (!c) S.caughtAt = -99
    S.caught = c
    S.jar = j
    S.twin = t
  }

  // ---- the flask's animation each frame ----
  const liqMin = 0.006
  updates.push((dt, t) => {
    dispBoiled = damp(dispBoiled, S.boiled, 2.2, dt)
    if (Math.abs(dispBoiled - S.boiled) < 0.2) dispBoiled = S.boiled
    const g = gProg()
    const h = Math.max(liqMin, 0.37 * (left() / LEFT0))
    liquid.scale.y = h
    liquid.position.y = 0.05 + h / 2
    liquidMat.emissiveIntensity = 0.42 + Math.sin(t * 9) * 0.04 * (left() > 12 ? 1 : 0.3)
    // the plaque
    setText(plLeft, String(Math.max(10, Math.round(left() / 10) * 10 === 750 ? 750 : Math.round(left()))))
    setText(plTemp, fill(E.flask.plaque.temp, { t: String(tempNow(g)).replace('-', '−') }))
    // the vapour: a gentle stream while there is liquid, fewer at the end; the open vent only until it is caught
    const age = wall() - S.caughtAt
    const boiling = left() > 12
    if (!S.caught || age > 2.4) {
      emitAcc += dt * (boiling ? 5 + 11 * (left() / LEFT0) + 3 * Math.abs(S.boiled - dispBoiled) / 40 : 0.7)
      while (emitAcc > 1) {
        emitAcc -= 1
        const sp = mixAt(g)
        emitMolecule(sp, FL.x + (rnd() - 0.5) * 0.015, BT + 0.8, ZL + (rnd() - 0.5) * 0.015, (rnd() - 0.5) * 0.08, 0.2 + rnd() * 0.12, (rnd() - 0.5) * 0.06, 3.2 + rnd())
      }
    }
    // the catch: the last drops' gas runs along the pipe into the holder
    if (S.caught && age < 3.2 && age >= 0) {
      emitAcc += dt * 7
      while (emitAcc > 1) {
        emitAcc -= 1
        const r = rnd()
        emitMolecule(r < 0.55 ? SP.O : r < 0.72 ? SP.N : r < 0.95 ? SP.AR : SP.KR, FL.x + 0.02, YP, ZL + (rnd() - 0.5) * 0.01, 1.35, 0, 0, 2.4, 1.9)
      }
    }
    plume.step(dt, (p, dd, k) => {
      p.alpha = Math.sin(Math.PI * k) ** 0.7 * 0.85
      if (p.vx < 1) p.vx += Math.sin(t * 1.7 + p.k) * 0.02 * dd * 6
      if (p.vx > 1 && p.x > HOLDER.x - 0.02) p.on = false
    }, ctx.camera, pr)
    // the stopcock turns when it is used
    stop.userData.key.rotation.z = -Math.PI / 2 * span(0, 0.5, S.caught ? age : 0)
    // the jar and its twin: everything but the krypton fades
    const fj = damp(jarCloud.mat.uniforms.uFade.value, S.jar, 3.5, dt)
    jarCloud.mat.uniforms.uFade.value = fj
    jarCloud.mat.uniforms.uTime.value = t
    jarKr.mat.size = 0.0015 + 0.03 * fj
    jarKr.mat.opacity = 0.2 + 0.8 * fj
    ring.material.opacity = Math.max(0, fj - 0.3) * 0.9
    ring.scale.setScalar(1 + 0.12 * Math.sin(t * 4))
    const ft = damp(twinCloud.mat.uniforms.uFade.value, S.twin, 3.5, dt)
    twinCloud.mat.uniforms.uFade.value = ft
    twinCloud.mat.uniforms.uTime.value = t + 5
    twinKr.mat.size = 0.0015 + 0.017 * ft
    twinKr.mat.opacity = 0.2 + 0.8 * ft
  })

  // =====================================================================================
  // STATION 2: the clean-up
  // =====================================================================================
  const holderGroup = new THREE.Group()
  holderGroup.position.set(HOLDER.x, 0, ZL)
  root.add(holderGroup)
  const holderH = HOLDER.y1 - HOLDER.y0
  const mercuryLow = new THREE.MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.1, metalness: 1, envMap: stage.shine, envMapIntensity: 1.3 })
  const gasHolderMat = new THREE.MeshStandardMaterial({ color: '#d8c8ff', roughness: 0.3, transparent: true, opacity: 0.4, emissive: '#6a50c0', emissiveIntensity: 0.5, depthWrite: false })
  const holderGas = new THREE.Mesh(new THREE.CylinderGeometry(HOLDER.r - 0.006, HOLDER.r - 0.006, 1, 20), gasHolderMat)
  const holderHg = new THREE.Mesh(new THREE.CylinderGeometry(HOLDER.r - 0.006, HOLDER.r - 0.006, 1, 20), mercuryLow)
  {
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.09, 24), mats.glass)
    dish.position.y = BT + 0.045
    const hg = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.04, 24), mercuryLow)
    hg.position.y = BT + 0.045
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(HOLDER.r, HOLDER.r, holderH, 20, 1, true), mats.glass)
    bell.position.y = (HOLDER.y0 + HOLDER.y1) / 2
    const cap = new THREE.Mesh(new THREE.SphereGeometry(HOLDER.r, 16, 8, 0, TAU, 0, Math.PI / 2), mats.glass)
    cap.position.y = HOLDER.y1
    holderGroup.add(dish, hg, bell, cap, holderGas, holderHg)
  }
  const holderTap = new THREE.Group()
  holderTap.position.set(HOLDER.x, HOLDER.y1 + 0.075, ZL)
  {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.06, 12), mats.brass)
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.02), mats.brass)
    key.position.y = 0.04
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), mats.brass)
    tip.position.set(0.07, 0.04, 0)
    holderTap.add(barrel, key, tip)
    holderTap.userData.key = key
    holderTap.userData.tip = tip
  }
  root.add(holderTap)
  label(E.train.labels.holder, HOLDER.x, BT + 0.06, ZL + 0.3, 0.045, 0)

  // the glass train: pipe from the holder to the copper, to the magnesium, to the measuring tube
  const YF = CU.y
  const flowPts = [
    V(HOLDER.x, HOLDER.y1 + 0.02), V(HOLDER.x, YP), V(HOLDER.x + 0.4, YP), V(HOLDER.x + 0.4, YF), V(CU.x0, YF),
    V(CU.x1, YF), V(MG.x0, YF), V(MG.x1, YF), V(EUD.x - 0.3, YF), V(EUD.x - 0.3, BT + 0.05), V(EUD.x, BT + 0.05), V(EUD.x, EUD.y0 + 0.03),
  ]
  root.add(pipe(flowPts.slice(0, 5), 0.011, mats.glass))
  root.add(pipe([flowPts[5], flowPts[6]], 0.011, mats.glass))
  root.add(pipe(flowPts.slice(7), 0.011, mats.glass))
  // distances along the flow, for the particles
  const flowLen = [0]
  flowPts.slice(1).forEach((p, i) => flowLen.push(flowLen[i] + p.distanceTo(flowPts[i])))
  const FT = flowLen[flowLen.length - 1]
  const uOf = x => {
    // the u of the point on the straight run at x (for the tubes' ends)
    const i = flowPts.findIndex((p, k) => k > 0 && p.x >= x - 1e-6 && flowPts[k - 1].x <= x + 1e-6 && Math.abs(p.y - flowPts[k - 1].y) < 1e-6)
    return (flowLen[i - 1] + (x - flowPts[i - 1].x)) / FT
  }
  const U = { cu0: uOf(CU.x0), cu1: uOf(CU.x1), mg0: uOf(MG.x0), mg1: uOf(MG.x1) }
  const pathAt = (u, out) => {
    const d = clamp(u) * FT
    let i = 1
    while (i < flowLen.length - 1 && flowLen[i] < d) i++
    const k = (d - flowLen[i - 1]) / Math.max(1e-6, flowLen[i] - flowLen[i - 1])
    return out.lerpVectors(flowPts[i - 1], flowPts[i], clamp(k))
  }

  // a hard glass tube on two stands, with its charge, over its burner
  const furnace = (x0, x1, y, burnerX, charge, name) => {
    const len = x1 - x0
    const g = new THREE.Group()
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, len, 16, 1, true), mats.glass)
    tube.rotation.z = Math.PI / 2
    tube.position.set((x0 + x1) / 2, y, ZL)
    g.add(tube)
    const fillMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, len * 0.58, 14), charge)
    fillMesh.rotation.z = Math.PI / 2
    fillMesh.position.set((x0 + x1) / 2, y, ZL)
    g.add(fillMesh)
    for (const sx of [x0 + 0.08, x1 - 0.08]) {
      g.add(rod(V(sx, BT, ZL - 0.05), V(sx, y - 0.04, ZL - 0.05), 0.011, stage.mats.iron))
      g.add(rod(V(sx, y - 0.04, ZL - 0.05), V(sx, y - 0.032, ZL), 0.014, stage.mats.iron))
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 14), stage.mats.iron)
      foot.position.set(sx, BT + 0.01, ZL - 0.05)
      g.add(foot)
    }
    // a Bunsen burner under the middle, a flame that rises when it is lit
    const bz = ZL
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.025, 16), mats.brass)
    base.position.set(burnerX, BT + 0.012, bz)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, y - BT - 0.14, 10), mats.brass)
    stem.position.set(burnerX, BT + 0.025 + (y - BT - 0.14) / 2, bz)
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.03, 10), mats.iron)
    collar.position.set(burnerX, BT + 0.1, bz)
    g.add(base, stem, collar)
    const flame = new THREE.Sprite(flameBlueMat)
    flame.center.set(0.5, 0.05)
    flame.position.set(burnerX, y - 0.1, bz)
    flame.scale.set(0.001, 0.001, 1)
    flame.renderOrder = 6
    g.add(flame)
    root.add(g)
    // hit shape: the burner (and the flame above it)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.2, y - BT + 0.04, 0.2), ghost)
    hit.position.set(burnerX, BT + (y - BT + 0.04) / 2, bz)
    root.add(hit)
    label(name, (x0 + x1) / 2, y + 0.16, ZL + 0.05, 0.05, 0)
    return { fillMesh, flame, hit, heat: 0 }
  }
  const cu = furnace(CU.x0, CU.x1, CU.y, CU.burner, copper, E.train.labels.copper)
  const mg = furnace(MG.x0, MG.x1, MG.y, MG.burner, magnesium, E.train.labels.magnesium)

  // the measuring tube over mercury, graduated downward from its closed top
  const eudH = EUD.y1 - EUD.y0
  const eudGroup = new THREE.Group()
  root.add(eudGroup)
  const eudGasMat = new THREE.MeshStandardMaterial({ color: '#d8c8ff', roughness: 0.3, transparent: true, opacity: 0.62, emissive: '#6a50c0', emissiveIntensity: 0.8, depthWrite: false })
  const eudGas = new THREE.Mesh(new THREE.CylinderGeometry(EUD.r - 0.004, EUD.r - 0.004, 1, 16), eudGasMat)
  const eudHg = new THREE.Mesh(new THREE.CylinderGeometry(EUD.r - 0.004, EUD.r - 0.004, 1, 16), mercuryLow)
  {
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.07, 22), mats.glass)
    dish.position.set(EUD.x, BT + 0.035, ZL)
    const hg = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.04, 22), mercuryLow)
    hg.position.set(EUD.x, BT + 0.035, ZL)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(EUD.r, EUD.r, eudH, 16, 1, true), mats.glass)
    tube.position.set(EUD.x, (EUD.y0 + EUD.y1) / 2, ZL)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(EUD.r, 14, 8, 0, TAU, 0, Math.PI / 2), mats.glass)
    cap.position.set(EUD.x, EUD.y1, ZL)
    eudGroup.add(dish, hg, tube, cap, eudGas, eudHg)
    // graduations: a line every 5 cm3 of a 40 cm3 tube, numbered each 10
    for (let i = 0; i <= 8; i++) {
      const y = EUD.y1 - (i / 8) * eudH
      const tick = new THREE.Mesh(new THREE.BoxGeometry(i % 2 ? 0.02 : 0.034, 0.003, 0.003), mats.brass)
      tick.position.set(EUD.x + EUD.r + 0.012, y, ZL + 0.005)
      eudGroup.add(tick)
    }
  }
  // the tap at its top that feeds the next station
  const feedTap = new THREE.Group()
  feedTap.position.set(EUD.x, EUD.y1 + 0.075, ZL)
  {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.06, 12), mats.brass)
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.02), mats.brass)
    key.position.y = 0.04
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), mats.brass)
    tip.position.set(0.07, 0.04, 0)
    feedTap.add(barrel, key, tip)
    feedTap.userData.key = key
  }
  root.add(feedTap)
  const [eudPlaque] = plaque(EUD.x + 0.22, BT + 0.25, ZL + 0.2, 0.34, 0.2, [['', 0.04, 0.0, '#e8dcff']])
  label(E.train.labels.tube, EUD.x - 0.05, BT + 0.06, ZL + 0.35, 0.045, 0)

  // the lens beside the tube: what is in it, atom by atom
  const lensCanvas = { o: 0, n: 0, ready: false }
  const lensTex = canvasTex(256, 256, (g, w, h) => drawLens(g, w, h, lensCanvas))
  textures.push(lensTex)
  const lens = new THREE.Group()
  {
    const ringM = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.013, 10, 32), mats.brass)
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.145, 32), new THREE.MeshBasicMaterial({ map: lensTex }))
    disc.position.z = 0.002
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 8), mats.darkTeak)
    handle.position.set(0, -0.28, -0.0)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 14), mats.darkTeak)
    foot.position.set(0, -0.43, 0)
    lens.add(ringM, disc, handle, foot)
    lens.position.set(EUD.x + 0.62, BT + 0.55, ZL + 0.4)
    lens.rotation.y = -0.25
    root.add(lens)
  }
  // the measuring tube's own hit shape (tap it to start again)
  const eudHit = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, eudH + 0.06, 10), ghost)
  eudHit.position.set(EUD.x, (EUD.y0 + EUD.y1) / 2, ZL)
  const holderHit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.22), ghost)
  holderHit.position.copy(holderTap.position)
  const feedHit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.2), ghost)
  feedHit.position.copy(feedTap.position)
  root.add(eudHit, holderHit, feedHit)

  // the flow of molecules through the train
  const MIX = [[SP.O, 48], [SP.N, 17], [SP.AR, 27], [SP.KR, 3], [SP.XE, 1]]
  const mols = []
  {
    let i = 0
    const rr = random(41)
    const order = MIX.flatMap(([sp, n]) => Array.from({ length: n }, () => sp)).sort(() => rr() - 0.5)
    for (const sp of order) {
      mols.push({ sp, delay: (i / order.length) * 5.5 + rr() * 0.15, jy: (rr() - 0.5) * 0.025, jz: (rr() - 0.5) * 0.025, a: rr() * TAU })
      i++
    }
  }
  const flow = new Particles(mols.reduce((n, m) => n + (m.sp <= 1 ? 2 : 1), 0), { map: dotMap, additive: false })
  root.add(flow.points)
  flow.items.forEach(p => Object.assign(p, { on: true, life: 1e9, age: 0, alpha: 0, size: 0.03 }))
  const pv = new THREE.Vector3()

  const eudValue = () => {
    const r = S.run
    if (!r) return { k: 0, o: 0, n: 0 }
    const age = wall() - r.t0
    const k = span(TRAVEL, RUN_T - 1.2, age)
    return { k, o: r.cu ? 0 : 1, n: r.mg ? 0 : 1 }
  }
  const finished = () => !!S.run && wall() - S.run.t0 >= RUN_T
  const cleanNow = () => finished() && S.run.cu && S.run.mg

  function trainPanel(l) {
    return {
      title: E.train.title,
      color,
      blocks: [
        {
          buttons: [
            { label: E.train.buttons.copper, onClick: () => trainStep('copper') },
            { label: E.train.buttons.magnesium, onClick: () => trainStep('magnesium') },
            { label: E.train.buttons.tap, onClick: () => trainStep('holder') },
            { label: E.train.buttons.empty, onClick: () => trainStep('empty') },
          ],
        },
        ...E.train.panel[depthOf(l)].map(p => ({ p })),
      ],
    }
  }
  const sayTrain = (key, vars) => say(fill(at(E.train.says[key], lv()), vars))
  const hotCu = () => cu.heat > 0.8
  const hotMg = () => mg.heat > 0.8
  function trainStep(what) {
    if (what === 'copper') {
      S.cu ^= 1
      play(S.cu ? 'select' : 'tap')
      sayTrain(S.cu ? 'copperOn' : 'copperOff')
    } else if (what === 'magnesium') {
      S.mg ^= 1
      play(S.mg ? 'select' : 'tap')
      sayTrain(S.mg ? 'mgOn' : 'mgOff')
    } else if (what === 'holder') {
      if (S.run) return sayTrain(S.run && !finished() ? 'busy' : 'used')
      if (!S.caught) {
        // the holder is empty: the flask's last drops are caught first, as if the stopcock had been turned
        if (S.boiled < 735) return sayTrain('noGas')
        S.caught = 1
        S.caughtAt = wall() - 3.5
        share('flask')
      }
      S.run = { cu: hotCu(), mg: hotMg(), t0: wall(), mine: true }
      play('select')
      sayTrain(S.run.cu && S.run.mg ? 'go' : 'goCold')
    } else if (what === 'empty') {
      if (!S.run) return sayTrain('nothing')
      if (!finished()) return sayTrain('busy')
      S.run = null
      S.spent.cu = 0
      S.spent.mg = 0
      S.cu = 0
      S.mg = 0
      play('tap')
      sayTrain('reset')
    } else return
    share('train')
  }
  clickable(cu.hit, () => trainStep('copper'))
  clickable(mg.hit, () => trainStep('magnesium'))
  clickable(holderHit, () => trainStep('holder'))
  clickable(eudHit, () => trainStep('empty'), { when: () => !!S.run && finished() })
  ex.add({
    id: 'train',
    x: 0.35,
    z: -3.75,
    radius: 2.7,
    manual: true,
    label: E.train.label,
    verb: () => {
      const H = E.train.hints
      if (S.run) return finished() ? H.again : H.watch
      if (S.boiled < 735 && !S.caught) return H.catch
      if (!S.cu) return H.copper
      if (!S.mg) return H.magnesium
      return hotCu() && hotMg() ? H.tap : H.heat
    },
    focus: { x: 0.35, y: 1.28, z: ZL, size: 1.25, width: 4.9 },
    act: () => ctx.showPanel(trainPanel),
  })
  const trainState = () => ({ cu: S.cu, mg: S.mg, run: S.run ? { cu: S.run.cu ? 1 : 0, mg: S.run.mg ? 1 : 0, age: Math.min(12, Math.max(0, wall() - S.run.t0)) } : null, spentCu: S.spent.cu, spentMg: S.spent.mg })
  const trainSet = (s, liveSet, ago = 0) => {
    S.cu = s?.cu ? 1 : 0
    S.mg = s?.mg ? 1 : 0
    if (s?.run) {
      if (!S.run) {
        if (liveSet) sayTrain('go')
        S.run = { cu: !!s.run.cu, mg: !!s.run.mg, t0: wall() - clamp(Number(s.run.age) || 0, 0, 12) - ago, mine: false }
      }
    } else S.run = null
    S.spent.cu = clamp(Number(s?.spentCu) || 0)
    S.spent.mg = clamp(Number(s?.spentMg) || 0)
    if (!S.run && !liveSet) {
      S.spent.cu = 0
      S.spent.mg = 0
    }
    if (!liveSet) doneSaid = finished()
  }

  const COPPER_FRESH = new THREE.Color('#c8733c')
  const COPPER_SPENT = new THREE.Color('#2a211c')
  const MG_FRESH = new THREE.Color('#c4c8cc')
  const MG_SPENT = new THREE.Color('#a39a50')
  let lensKey = ''
  let doneSaid = false
  updates.push((dt, t) => {
    // a run that has just finished says how it went (and counts the find when the gas came out clean)
    const dn = finished()
    if (!S.run) doneSaid = false
    else if (dn && !doneSaid) {
      doneSaid = true
      // only the visitor who ran it hears how it went and counts the find (the others see the same tube)
      if (S.run.mine) {
        const o = !S.run.cu
        const n = !S.run.mg
        sayTrain(o && n ? 'doneBoth' : o ? 'doneO' : n ? 'doneN' : 'doneClean')
        if (!o && !n) ex.discover('train', trainPanel, 3.2)
      }
    }
    // the burners and the heat of the tubes
    for (const [f, on, mat, glow] of [[cu, S.cu, copper, 0.95], [mg, S.mg, magnesium, 0.6]]) {
      f.heat = damp(f.heat, on, 0.8, dt)
      const lit = f.heat > 0.02 || on
      const fk = on ? Math.min(1, f.heat * 3 + 0.2) : Math.max(0, f.heat * 3 - 0.1)
      const fl = 1 + Math.sin(t * 17 + f.fillMesh.id) * 0.06
      f.flame.scale.set(0.12 * fk * fl, 0.2 * fk * fl, 1)
      f.flame.visible = lit && fk > 0.02
      mat.emissiveIntensity = glow * clamp((f.heat - 0.3) / 0.6) * (1 - 0.65 * (mat === copper ? S.spent.cu : S.spent.mg))
    }
    const r = S.run
    const age = r ? wall() - r.t0 : 0
    // the charges change as the gas passes: the copper blackens, the magnesium gets its crust
    if (r) {
      const through = span(TRAVEL * 0.6, RUN_T - 1.5, age)
      if (r.cu) S.spent.cu = Math.max(S.spent.cu, through)
      if (r.mg) S.spent.mg = Math.max(S.spent.mg, through)
    }
    copper.color.copy(COPPER_FRESH).lerp(COPPER_SPENT, S.spent.cu)
    magnesium.color.copy(MG_FRESH).lerp(MG_SPENT, S.spent.mg)
    // the holder: gas that was caught, leaving as the run starts; the mercury below
    const cat = span(0, 3.2, wall() - S.caughtAt)
    const hk = S.caught ? cat * (1 - span(0, 5.5, age)) * (r ? 1 : 1) : 0
    holderGas.visible = hk > 0.01
    holderGas.scale.y = Math.max(0.001, holderH * hk)
    holderGas.position.y = HOLDER.y1 - holderH * hk / 2
    holderHg.scale.y = Math.max(0.001, holderH * (1 - hk))
    holderHg.position.y = HOLDER.y0 + holderH * (1 - hk) / 2
    gasHolderMat.emissiveIntensity = 0.4 + 0.1 * Math.sin(t * 3)
    holderTap.userData.key.rotation.y = 0
    holderTap.userData.key.rotation.z = -Math.PI / 2 * span(0, 0.4, r ? age : 0)
    holderTap.userData.tip.visible = !r || age < 0.4
    // the molecules through the train
    let pi = 0
    for (const m of mols) {
      const u = r ? clamp((age - m.delay) / TRAVEL) : 0
      let a = r && age > m.delay && u < 1 ? 0.9 : 0
      if (r && m.sp === SP.O && r.cu) a *= 1 - clamp((u - (U.cu0 + 0.4 * (U.cu1 - U.cu0))) / 0.03)
      if (r && m.sp === SP.N && r.mg) a *= 1 - clamp((u - (U.mg0 + 0.4 * (U.mg1 - U.mg0))) / 0.03)
      pathAt(u, pv)
      const pair = m.sp <= 1
      for (const s of pair ? [-1, 1] : [0]) {
        const p = flow.items[pi++]
        p.x = pv.x + (pair ? Math.cos(m.a + t * 3) * 0.016 * s : 0)
        p.y = pv.y + m.jy + (pair ? Math.sin(m.a + t * 3) * 0.016 * s : 0)
        p.z = pv.z + m.jz
        p.alpha = a
        p.size = m.sp >= 3 ? 0.04 : 0.03
        const c = SPCOL[m.sp]
        p.r = c[0]
        p.g = c[1]
        p.b = c[2]
      }
    }
    flow.step(0, null, ctx.camera, pr)
    // the measuring tube fills from the closed top; mercury below
    const ev = eudValue()
    const vol = ev.k * (0.65 + 0.22 * ev.o + 0.1 * ev.n)
    eudGas.visible = vol > 0.005
    eudGas.scale.y = Math.max(0.001, eudH * vol)
    eudGas.position.y = EUD.y1 - eudH * vol / 2
    eudHg.scale.y = Math.max(0.001, eudH * (1 - vol))
    eudHg.position.y = EUD.y0 + eudH * (1 - vol) / 2
    eudGasMat.color.set(ev.o || ev.n ? '#e8c0ff' : '#d8c8ff')
    const eudText = ev.k < 0.97 ? '' : cleanNow() ? E.train.plaque.clean : E.train.plaque.dirty
    setText(eudPlaque, eudText)
    const lk = `${ev.k > 0.97 ? 1 : 0}${ev.o}${ev.n}`
    if (lk !== lensKey) {
      lensKey = lk
      lensCanvas.ready = ev.k > 0.97
      lensCanvas.o = ev.o
      lensCanvas.n = ev.n
      lensTex.userData.redraw((g, w, h) => drawLens(g, w, h, lensCanvas))
    }
    feedTap.userData.key.rotation.z = -Math.PI / 2 * span(0, 0.4, wall() - feedAt)
  })

  // =====================================================================================
  // STATION 3: seal it and light it
  // =====================================================================================
  const tubeG = new THREE.Group()
  tubeG.position.set(TUBE.x, TUBE.y0, ZL)
  root.add(tubeG)
  const tubeProfile = [[0.02, 0.0], [0.045, 0.045], [0.055, 0.07], [0.055, 0.15], [0.04, 0.2], [0.008, 0.24], [0.008, 0.26], [0.04, 0.3], [0.055, 0.35], [0.055, 0.43], [0.045, 0.46], [0.02, 0.5]].map(([x, y]) => new THREE.Vector2(x, y))
  const tubeGlass = new THREE.Mesh(new THREE.LatheGeometry(tubeProfile, 24), mats.glass)
  tubeG.add(tubeGlass)
  const glowMat = new THREE.MeshBasicMaterial({ color: hdr('#d8c8ff', 1.6), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const tubeGlow = new THREE.Mesh(new THREE.LatheGeometry(tubeProfile.map(v => new THREE.Vector2(v.x * 0.86, v.y)), 20), glowMat)
  tubeG.add(tubeGlow)
  const capGlowMat = new THREE.SpriteMaterial({ map: dotMap, color: hdr('#d8c8ff', 1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  const halos = [0.1, 0.25, 0.4].map((y, i) => {
    const s = new THREE.Sprite(capGlowMat)
    s.position.set(0, y, 0.02)
    s.scale.setScalar(i === 1 ? 0.13 : 0.24)
    tubeG.add(s)
    return s
  })
  const tubeLight = new THREE.PointLight('#d8c8ff', 0, 5, 1.6)
  tubeLight.position.set(TUBE.x, TUBE.y0 + 0.25, ZL + 0.35)
  root.add(tubeLight)
  // electrodes and wires to the coil
  for (const [y, name] of [[0.08, 'a'], [0.42, 'b']]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.05, 10), mats.brass)
    cap.rotation.z = Math.PI / 2
    cap.position.set(0.075, y, 0)
    tubeG.add(cap)
  }
  // the necks: feed above, pump below; sealing removes both
  const necks = new THREE.Group()
  root.add(necks)
  necks.add(rod(V(TUBE.x, TUBE.y1 - 0.02), V(TUBE.x, NECK_Y), 0.011, mats.glass))
  necks.add(rod(V(TUBE.x - 0.25, NECK_Y), V(TUBE.x, NECK_Y), 0.011, mats.glass))
  const sealTip = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), mats.glass)
  sealTip.position.set(TUBE.x, TUBE.y1 + 0.0, ZL)
  sealTip.visible = false
  root.add(sealTip)
  // the long pipe from the measuring tube's tap, and the pump's
  root.add(pipe([V(EUD.x, EUD.y1 + 0.03), V(EUD.x, NECK_Y), V(TUBE.x - 0.25, NECK_Y)], 0.011, mats.glass))
  root.add(pipe([V(TUBE.x, TUBE.y0 + 0.02), V(TUBE.x, 1.0), V(PUMP.x, 1.0)], 0.011, mats.glass))
  // the stand that holds the tube, with the blowpipe jet
  {
    const rodX = TUBE.x + 0.38
    const post = rod(V(rodX, BT, ZL - 0.05), V(rodX, 1.8, ZL - 0.05), 0.012, mats.iron)
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.22), mats.iron)
    foot.position.set(rodX - 0.08, BT + 0.012, ZL - 0.05)
    const arm = rod(V(rodX, 1.38, ZL - 0.05), V(TUBE.x + 0.06, 1.38, ZL - 0.02), 0.009, mats.iron)
    const jetArm = rod(V(rodX, NECK_Y + 0.04, ZL - 0.05), V(TUBE.x + 0.2, NECK_Y + 0.02, ZL), 0.011, mats.brass)
    root.add(post, foot, arm, jetArm)
  }
  const jet = new THREE.Group()
  jet.position.set(TUBE.x + 0.19, NECK_Y + 0.02, ZL)
  const jetMat = new THREE.MeshBasicMaterial({ color: hdr('#9ad0ff', 1.8), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
  const jetCone = new THREE.Mesh(new THREE.ConeGeometry(0.014, 1, 10), jetMat)
  jetCone.rotation.z = Math.PI / 2 // points to -x
  jet.add(jetCone)
  root.add(jet)
  const neckGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotMap, color: hdr('#ff9a40', 1.5), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }))
  neckGlow.position.set(TUBE.x, NECK_Y, ZL)
  neckGlow.scale.setScalar(0.14)
  root.add(neckGlow)
  const jetHit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.14), ghost)
  jetHit.position.set(TUBE.x + 0.14, NECK_Y, ZL)
  root.add(jetHit)
  label(E.tube.labels.tube, TUBE.x, BT + 0.06, ZL + 0.3, 0.045, 0)

  // the mercury pump: a column with a bulb, a reservoir that is lifted and lowered for each stroke
  const pumpG = new THREE.Group()
  root.add(pumpG)
  const hgCol = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 1, 10), mercuryLow)
  const reservoir = new THREE.Group()
  {
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.9, 10, 1, true), mats.glass)
    column.position.set(PUMP.x, BT + 0.1 + 0.45, ZL)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 12), mats.glass)
    bulb.position.set(PUMP.x, 1.36, ZL)
    const stem = rod(V(PUMP.x, 1.0), V(PUMP.x, 1.36), 0.011, mats.glass)
    const bottle = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 12), mats.glass)
    const hgIn = new THREE.Mesh(new THREE.SphereGeometry(0.098, 14, 12, 0, TAU, Math.PI * 0.45, Math.PI * 0.55), mercuryLow)
    reservoir.add(bottle, hgIn)
    reservoir.position.set(PUMP.rx, BT + 0.2, ZL)
    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 1, 8), new THREE.MeshStandardMaterial({ color: '#3a2a22', roughness: 0.8 }))
    hose.userData.r = 1
    pumpG.add(column, bulb, stem, hgCol, reservoir, hose)
    pumpG.userData.hose = hose
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.02, 0.16), mats.darkTeak)
    base.position.set(PUMP.x, BT + 0.01, ZL)
    pumpG.add(base)
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.2, 14), mats.darkTeak)
    stand.position.set(PUMP.rx, BT + 0.1, ZL)
    pumpG.add(stand)
  }
  const pumpHit = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 12), ghost)
  pumpHit.position.set(PUMP.rx, BT + 0.25, ZL)
  root.add(pumpHit)
  // the gauge: a column of mercury whose height is the pressure in mm
  const gaugeTop = BT + 0.42
  {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 10, 1, true), mats.glass)
    col.position.set(GAUGE.x, BT + 0.21, ZL + 0.15)
    pumpG.add(col)
    for (let i = 0; i <= 4; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.003, 0.003), mats.brass)
      tick.position.set(GAUGE.x + 0.025, BT + 0.02 + (i / 4) * 0.38, ZL + 0.15)
      pumpG.add(tick)
    }
  }
  const gaugeHg = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1, 10), mercuryLow)
  gaugeHg.position.set(GAUGE.x, BT + 0.02, ZL + 0.15)
  pumpG.add(gaugeHg)
  const [gaugeText] = plaque(GAUGE.x - 0.02, BT + 0.55, ZL + 0.28, 0.3, 0.14, [['760', 0.06, 0.02, '#ffe2b8'], [E.tube.labels.gauge, 0.026, -0.04, '#d6d2c0']])

  // the induction coil on its box, with its battery, and the wires to the tube
  const coil = new THREE.Group()
  coil.position.set(3.32, BT, ZL + 0.2)
  const sparkMat = new THREE.SpriteMaterial({ map: dotMap, color: hdr('#b8c8ff', 1.3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  {
    const boxM = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.17, 0.2), mats.teak)
    boxM.position.y = 0.085
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 18), new THREE.MeshStandardMaterial({ color: '#2a2018', roughness: 0.6 }))
    drum.rotation.z = Math.PI / 2
    drum.position.y = 0.25
    const bands = [-0.16, 0.16].map(x => {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.02, 18), mats.brass)
      b.rotation.z = Math.PI / 2
      b.position.set(x, 0.25, 0)
      return b
    })
    const plates = [-0.19, 0.19].map(x => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4 }))
      p.position.set(x * 1.0, 0.25, 0)
      return p
    })
    const term = [-0.14, 0.14].map(x => {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), mats.brass)
      p.position.set(x, 0.38, 0)
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 6), mats.brass)
      post.position.set(x, 0.33, 0)
      return [p, post]
    })
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.03), mats.brass)
    key.position.set(0.1, 0.18, 0.12)
    const spark = new THREE.Sprite(sparkMat)
    spark.position.set(0, 0.38, 0)
    spark.scale.setScalar(0.06)
    coil.add(boxM, drum, ...bands, ...plates, ...term.flat(), key, spark)
    coil.userData.spark = spark
    root.add(coil)
    // two battery jars beside it
    for (const x of [2.9, 3.0]) {
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 12), mats.glass)
      jar.position.set(x - 0.35, BT + 0.08, ZL + 0.2)
      const zn = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.17, 8), mats.iron)
      zn.position.copy(jar.position)
      root.add(jar, zn)
    }
    // wires: from the terminals to the tube's two caps
    const w1 = pipe([V(3.18, BT + 0.38, ZL + 0.2), V(3.18, 1.4, ZL + 0.2), V(TUBE.x + 0.1, 1.4, ZL + 0.12), V(TUBE.x + 0.1, TUBE.y0 + 0.42, ZL + 0.04), V(TUBE.x + 0.075, TUBE.y0 + 0.42, ZL)], 0.004, mats.iron)
    const w2 = pipe([V(3.46, BT + 0.38, ZL + 0.2), V(3.46, 1.1, ZL + 0.25), V(TUBE.x + 0.12, 1.1, ZL + 0.22), V(TUBE.x + 0.12, TUBE.y0 + 0.08, ZL + 0.06), V(TUBE.x + 0.075, TUBE.y0 + 0.08, ZL)], 0.004, mats.iron)
    root.add(w1, w2)
  }
  const coilHit = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.5, 0.26), ghost)
  coilHit.position.set(3.32, BT + 0.25, ZL + 0.2)
  root.add(coilHit)
  const standHit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.26), ghost)
  standHit.position.set(TUBE.x + 0.3, BT + 0.06, ZL - 0.05)
  root.add(standHit)

  // Travers' notebook, closed, opened by a clean glow
  const book = new THREE.Group()
  book.position.set(4.12, BT, ZL + 0.58)
  book.rotation.y = 0.12
  book.scale.setScalar(1.7)
  const pageT = pageTex()
  textures.push(pageT)
  const lid = new THREE.Group()
  {
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.24), new THREE.MeshStandardMaterial({ color: '#3a2a22', roughness: 0.8 }))
    back.position.set(0, 0.0075, 0)
    book.add(back)
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.22), new THREE.MeshStandardMaterial({ color: '#d8ccaa', roughness: 0.9 }))
    right.position.set(0.085, 0.021, 0)
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.22), new THREE.MeshStandardMaterial({ color: '#d8ccaa', roughness: 0.9 }))
    left.position.set(-0.085, 0.021, 0)
    const spreadImg = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.2), new THREE.MeshBasicMaterial({ map: pageT, color: '#a8a290' }))
    spreadImg.rotation.x = -Math.PI / 2
    spreadImg.position.set(0.085, 0.0275, 0)
    spreadImg.userData.page = true
    book.add(right, left, spreadImg)
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.012, 0.23), new THREE.MeshStandardMaterial({ color: '#3a2a22', roughness: 0.8 }))
    cover.position.set(0.085, 0.006, 0)
    lid.add(cover)
    lid.position.set(0, 0.04, 0) // the spine
    book.add(lid)
  }
  root.add(book)
  const bookHit = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.4), ghost)
  bookHit.position.copy(book.position).setY(BT + 0.05)
  root.add(bookHit)
  let feedAt = -99

  const sayTube = (key, vars) => say(fill(at(E.tube.says[key], lv()), vars))
  const gaugeNow = () => Math.round(760 * (1 - S.pump) ** 2)
  function tubePanel(l) {
    return {
      title: E.tube.title,
      color,
      blocks: [
        { slider: { label: E.tube.slider, min: 0, max: 100, step: 5, value: Math.round(S.pump * 100), onInput: v => setPump(v / 100), format: v => fill(E.tube.sliderFmt, { p: Math.round(760 * (1 - v / 100) ** 2) }), live: () => Math.round(S.pump * 100) } },
        {
          buttons: [
            { label: E.tube.buttons.pump, onClick: () => tubeStep('pump') },
            { label: E.tube.buttons.gas, onClick: () => tubeStep('gas') },
            { label: E.tube.buttons.seal, onClick: () => tubeStep('seal') },
            { label: E.tube.buttons.coil, onClick: () => tubeStep('coil') },
            { label: E.tube.buttons.fresh, onClick: () => tubeStep('fresh') },
          ],
        },
        ...E.tube.panel[depthOf(l)].map(p => ({ p })),
      ],
    }
  }
  let pumpAnim = -99
  function setPump(v, now = false) {
    const p = clamp(Number(v) || 0)
    if (p === S.pump) return
    if (S.gas) {
      // with gas in the tube, the pump is shut off: the setting does nothing more
      return sayTube('gasIn')
    }
    S.pump = p
    if (now) {
      play('tap')
      sayTube(p >= 0.95 ? 'pumped' : 'pump')
    }
    if (now) share('tube')
    else queueShare('tube')
  }
  function tubeStep(what) {
    if (what === 'pump') {
      if (S.gas) return sayTube('gasIn')
      if (S.pump >= 1) return sayTube('pumped')
      S.pump = Math.min(1, S.pump + 0.25)
      pumpAnim = wall()
      play('tap')
      sayTube(S.pump >= 0.95 ? 'pumped' : 'pump')
    } else if (what === 'gas') {
      if (S.gas) return sayTube('gasIn')
      if (!S.run || !finished()) return sayTube('needGas')
      if (S.pump < 0.95) return sayTube('noPump')
      S.gas = cleanNow() ? 1 : 2
      feedAt = wall()
      play('select')
      sayTube('gas')
    } else if (what === 'seal') {
      if (!S.gas) return sayTube('noGas')
      if (S.sealed) return sayTube('sealed')
      S.sealed = 1
      S.sealAt = wall()
      play('crack')
      sayTube('seal')
    } else if (what === 'coil') {
      if (!S.sealed) return sayTube(S.gas ? 'noSeal' : 'noGas')
      S.lit ^= 1
      play(S.lit ? 'beam' : 'tap')
      if (S.lit) {
        sayTube(S.gas === 1 ? 'litClean' : 'litMixed')
        if (S.gas === 1) {
          S.book = 1
          ex.discover('tube', tubePanel, 3.4)
        }
      } else sayTube('off')
    } else if (what === 'fresh') {
      S.pump = 0
      S.gas = 0
      S.sealed = 0
      S.lit = 0
      S.sealAt = -99
      play('tap')
      sayTube('fresh')
    } else if (what === 'book') {
      sayTube(S.book ? 'book' : 'bookClosed')
      return
    } else return
    share('tube')
  }
  clickable(pumpHit, () => tubeStep('pump'))
  clickable(feedHit, () => tubeStep('gas'))
  clickable(jetHit, () => tubeStep('seal'))
  clickable(coilHit, () => tubeStep('coil'))
  clickable(standHit, () => tubeStep('fresh'), { when: () => !!S.sealed })
  clickable(bookHit, () => tubeStep('book'))
  ex.add({
    id: 'tube',
    x: 4.3,
    z: -3.75,
    radius: 2.3,
    manual: true,
    label: E.tube.label,
    verb: () => {
      const H = E.tube.hints
      if (S.lit) return H.done
      if (S.sealed) return H.coil
      if (S.gas) return H.seal
      if (!S.run || !finished()) return H.clean
      if (S.pump < 0.95) return H.pump
      return H.gas
    },
    focus: { x: 4.35, y: 1.3, z: ZL, size: 1.3, width: 3.4 },
    act: () => ctx.showPanel(tubePanel),
  })
  const tubeState = () => ({ pump: S.pump, gas: S.gas, sealed: S.sealed, sealAge: S.sealed ? Math.min(3, Math.max(0, wall() - S.sealAt)) : 0, lit: S.lit, book: S.book })
  const tubeSet = (s, liveSet, ago = 0) => {
    const sealed = s?.sealed ? 1 : 0
    const lit = s?.lit ? 1 : 0
    if (liveSet) {
      if (sealed && !S.sealed) sayTube('seal')
      else if (lit && !S.lit) sayTube(Number(s?.gas) === 1 ? 'litClean' : 'litMixed')
    }
    S.pump = clamp(Number(s?.pump) || 0)
    S.gas = [0, 1, 2].includes(Number(s?.gas)) ? Number(s.gas) : 0
    if (!sealed) S.sealAt = -99
    else if (!S.sealed) S.sealAt = wall() - (Math.max(0, Number(s?.sealAge) || 0) + ago)
    S.sealed = sealed
    S.lit = lit
    S.book = s?.book ? 1 : 0
  }

  const GLOW_CLEAN = new THREE.Color('#d8c8ff')
  const GLOW_MIXED = new THREE.Color('#ff7ad9')
  const gcol = new THREE.Color()
  let litK = 0
  let bookK = 0
  let pumpShown = -1
  const hosePts = [new THREE.Vector3(), new THREE.Vector3()]
  updates.push((dt, t) => {
    // the pump's stroke: the reservoir is lifted and lowered, the mercury follows it up the column and down
    const pa = wall() - pumpAnim
    const stroke = pa >= 0 && pa < 1.5 ? Math.sin(Math.PI * pa / 1.5) : 0
    reservoir.position.y = BT + 0.2 + 0.28 * stroke
    const hgH = 0.9 * (0.12 + 0.1 * stroke) * (1 - 0.2 * S.pump)
    hgCol.scale.set(1, hgH, 1)
    hgCol.position.set(PUMP.x, BT + 0.1 + hgH / 2, ZL)
    hosePts[0].set(PUMP.x, BT + 0.1, ZL)
    hosePts[1].set(PUMP.rx, reservoir.position.y - 0.05, ZL)
    stretch(pumpG.userData.hose, hosePts[0], hosePts[1])
    // the gauge
    const gp = gaugeNow()
    if (gp !== pumpShown) {
      pumpShown = gp
      setText(gaugeText, String(gp))
    }
    const gh = 0.38 * (1 - S.pump) ** 2
    gaugeHg.scale.set(1, Math.max(0.002, gh), 1)
    gaugeHg.position.y = BT + 0.02 + Math.max(0.002, gh) / 2
    // the blowpipe flame: a small pilot, long and hot at the neck while sealing
    const sa = wall() - S.sealAt
    const sealing = S.sealed && sa >= 0 && sa < 2.2
    const jl = sealing ? 0.22 : 0.07 + Math.sin(t * 20) * 0.005
    jetCone.scale.set(1, jl, 1)
    jetCone.position.x = -jl / 2
    jetMat.opacity = S.sealed && !sealing ? 0.15 : 0.9
    neckGlow.material.opacity = sealing ? Math.sin(Math.PI * clamp(sa / 2.2)) : 0
    necks.visible = !(S.sealed && sa > 1.4)
    sealTip.visible = !!S.sealed && sa > 1.4
    // the glow of the tube
    litK = damp(litK, S.lit ? 1 : 0, 5, dt)
    gcol.copy(S.gas === 2 ? GLOW_MIXED : GLOW_CLEAN)
    const fl = 1 + Math.sin(t * 40) * 0.04 + Math.sin(t * 13) * 0.03
    glowMat.color.copy(gcol).multiplyScalar(0.62 * fl)
    glowMat.opacity = litK * 0.6
    capGlowMat.color.copy(gcol).multiplyScalar(0.7)
    capGlowMat.opacity = litK * 0.3 * fl
    tubeLight.color.copy(gcol)
    tubeLight.intensity = litK * 1.3 * fl
    sparkMat.opacity = S.lit ? (Math.sin(t * 90) > -0.3 ? 0.85 : 0.1) : 0
    // the notebook opens when a clean glow was seen
    bookK = damp(bookK, S.book, 3.2, dt)
    lid.rotation.z = Math.PI * span(0, 1, bookK)
    lid.position.y = 0.04 + 0.0 * bookK
  })

  // the stage's own update (dust, the flickering gas)
  updates.push((dt, t) => stage.update(t))

  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())

  return {
    env: { ...stage.env, background: new THREE.Color('#090705'), fog: new THREE.Fog('#0b0907', 12, 34) },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.2 },
    spawn: { x: 0, z: 3.0, yaw: 0 },
    hostSpot: { x: 1.9, z: 2.1, yaw: Math.atan2(1.9, -0.8) },
    back: { x: 0, z: 5.9, rot: Math.PI },
    stand: { x: -2.9, z: 1.7, rot: Math.atan2(2.9, 1.3) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      flask: {
        tap: what => flaskStep(what), // 'boil', 'catch' (the stopcock), 'jar', 'last' (the twin), 'fresh'
        set: v => setBoiled(v, true), // the panel's slider
        get state() { return flaskState() },
        get left() { return leftNow() },
        flaskAt: () => new THREE.Vector3(FL.x, BT + 0.3, ZL + 0.18),
        stopAt: () => stop.position.clone(),
        jarAt: () => jarG.position.clone(),
        twinAt: () => twinG.position.clone(),
      },
      train: {
        tap: what => trainStep(what), // 'copper', 'magnesium', 'holder', 'empty'
        get state() { return trainState() },
        get heat() { return [cu.heat, mg.heat] },
        get finished() { return finished() },
        get clean() { return cleanNow() },
        burnerAt: n => new THREE.Vector3(n === 'copper' ? CU.burner : MG.burner, BT + 0.12, ZL + 0.06),
        holderAt: () => holderTap.position.clone(),
        tubeAt: () => new THREE.Vector3(EUD.x, (EUD.y0 + EUD.y1) / 2, ZL + 0.05),
      },
      tube: {
        tap: what => tubeStep(what), // 'pump', 'gas' (the measuring tube's tap), 'seal', 'coil', 'fresh', 'book'
        set: v => setPump(v / 100, true), // the panel's slider, 0..100
        get state() { return tubeState() },
        get glow() { return litK },
        pumpAt: () => new THREE.Vector3(PUMP.rx, BT + 0.3, ZL + 0.08),
        gasAt: () => feedTap.position.clone(),
        sealAt: () => new THREE.Vector3(TUBE.x + 0.12, NECK_Y, ZL + 0.05),
        coilAt: () => new THREE.Vector3(3.32, BT + 0.2, ZL + 0.32),
        bookAt: () => book.position.clone().setY(BT + 0.05),
      },
      rayTo,
    },
    panels: { flask: flaskPanel, train: trainPanel, tube: tubePanel },
    shared: {
      flask: { get: flaskState, set: flaskSet },
      train: { get: trainState, set: trainSet },
      tube: { get: tubeState, set: tubeSet },
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
