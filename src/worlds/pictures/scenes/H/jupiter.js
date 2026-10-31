// Hydrogen's picture "What is inside Jupiter?" as a room (docs/knowledge/picture-rooms.md): the picture made
// into an observation gondola hanging under a huge parachute, sinking into Jupiter's clouds where the
// Galileo probe fell on 7 December 1995 (stages/gasgiant.js: cloud decks with a clear hole, as the probe's
// dry "hot spot", the sky darkening with depth, lightning in the water clouds). Silicon's `earth` room cuts
// a planet open on a deck in space; here you are inside the planet's air. Three things to do, each step
// chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt passive); the
// prompt names the next tap, E opens the station's panel, whose buttons and slider do the same:
// - the descent (the desk, north): tap the red handle to sink to the next level (0.4 bar above the clouds,
//   ammonia ice at 0.7, ammonium hydrosulfide at 2, water at 5, 10, 22 bar where the probe went quiet,
//   100 bar imagined), or slide the depth; the board draws the way down, the probe's track and the gondola,
//   with depth, pressure and temperature from the probe's measured profile (Seiff et al. 1998: 166.1 K at
//   1 bar, 429 K at 22 bar, a dry adiabat between; 22 bar lies 133 km below the 1-bar level). Tap the
//   helium counter (the mix it measured), the lightning detector (distant crackles, flashes in the water
//   deck) or the probe falling beside us outside the rail (what it found at that level);
// - squeezing hydrogen (the workbench, west): a model of Livermore's two-stage gas gun (1996). A slider
//   for how hard it squeezes (0.5 to 1.8 million bar); tap the gun to fire, the lens shows the sample
//   (molecules crowding, then electrons roaming free from 1.4 Mbar), the bulb lights, each shot a point
//   on the chart beside the Livermore data; each shot destroys the cell: tap the frosty flask for a new one;
// - Jupiter's magnet (east): a model of Jupiter cut open as in the picture, turning once in 20 s. Tap it:
//   its dipole's field lines (tilted 10°, the other way round from Earth's), the compass swings; tap a pole:
//   the auroral ovals; tap Io: its plasma torus, the flux tube and Io's footprint following it round;
//   tap the little Earth beside it, to scale, and its own small field.
// The planet's spin and Io's orbit run on the wall clock, so everyone in a room sees them alike; the
// descent, the gun and the magnet are shared (src/net/shared.js); words, panels and discoveries stay each
// one's. parts.<station>.tap(...) does what a tap does, for the probes; parts.at.<thing>() gives a point to
// aim a real tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, clamp, damp, lerp, fill, canvasTex } from '../../../wings/noble/kit.js'
import { edgeGlass } from '../../../common/props.js'
import { gasGiantStage } from '../../stages/gasgiant.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { JUPITER_WORDS } from './jupiter.words.js'

export const WORDS = JUPITER_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const round1 = v => Math.round(v * 10) / 10
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }
// a number in 0..1 from a seed and an index, the same on every screen
const hash = (seed, j, k = 0) => {
  let h = (seed * 374761393 + j * 668265263 + k * 2246822519) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// ---- Jupiter's air on the way down (the probe's profile) ----
const T1 = 166.1 // K at 1 bar
const KAD = Math.log(429 / T1) / Math.log(22) // the profile's exponent: 429 K at 22 bar
const H1 = 26 // km: the scale height at 1 bar (R T / mu g, mu 2.3 g/mol, g 23 m/s²)
// above 0.6 bar the probe found it about 3 K warmer than the adiabat
const tempAt = P => T1 * P ** KAD + 3 * (1 - span(0.6, 1, P))
const altAt = P => (-H1 * (P ** KAD - 1)) / KAD // km above the 1-bar level
const presAt = z => Math.max(0.01, 1 - (z * KAD) / H1) ** (1 / KAD)
const TOP_P = 0.4
const Z_TOP = altAt(TOP_P)
const fallenAt = P => Z_TOP - altAt(P)
const presFallen = d => presAt(Z_TOP - d)
const STOPS = [0.4, 0.7, 2, 5, 10, 22, 100]
const STOP_D = STOPS.map(fallenAt)
const LOST = 5 // the stop where the probe went quiet
const LOST_D = STOP_D[LOST]
const MAX_D = STOP_D[STOP_D.length - 1]
const SCALE = 2.5 // metres of scene per km of height
const CLOUDS = [
  { id: 'ammonia', P: 0.7, thick: 4, color: '#857a68', lit: '#d6ccb2', cover: 0.4, hole: 36 },
  { id: 'nh4sh', P: 2, thick: 5, color: '#7a4e30', lit: '#b88456', cover: 0.42, hole: 34 },
  { id: 'water', P: 5, thick: 6, color: '#4d5864', lit: '#909cab', cover: 0.4, hole: 32, lightning: true },
].map(c => ({ ...c, z: altAt(c.P) }))

// ---- the gun: what the squeeze does to the sample ----
const P_MIN = 0.5
const P_MAX = 1.8
const P_ON = 0.93 // where it starts to conduct (Weir, Mitchell and Nellis 1996)
const P_METAL = 1.4
// how well it conducts, as a share of the metal's (log scale: 0 none, 1 metal)
const condOf = p => (p < P_ON ? 0 : p >= P_METAL ? 1 : 0.12 + 0.88 * ((p - P_ON) / (P_METAL - P_ON)) ** 1.3)
// how many times denser than the liquid (an illustration: nine times at 1.4 Mbar)
const densOf = p => 1 + (8 * (1 - Math.exp(-p / 0.55))) / (1 - Math.exp(-P_METAL / 0.55))
const SHOT = { travel: 0.6, squeeze: 1.2, hold: 3.6, end: 4.6 }

// ---- where things stand (metres; the spawn at z = 4.4 looks along -z) ----
const R = 8.5
const DESK = { x: 0, z: -6.0, w: 3.2, d: 0.85, top: 0.92 }
const BOARD = { x: 0, y: 2.3, z: -7.05, w: 3.4, h: 1.9 }
const PROBE = { x: -3.9, y: 2.5, z: -10.0 }
const BENCH = { x: -6.3, z: -0.5, w: 1.0, d: 4.2, top: 0.9 }
const GUN_Y = BENCH.top + 0.2
const CHAMBER = { x: BENCH.x, z: -1.48, s: 0.42 }
const LENS = { x: BENCH.x + 0.05, y: 1.98, z: -1.48, r: 0.42 }
const FLASK = { x: BENCH.x, z: -2.25 }
const BULB = { x: BENCH.x + 0.42, y: BENCH.top + 0.32, z: -0.62 }
const CHART = { x: -7.25, y: 1.9, z: 0.35, w: 2.0, h: 1.25 }
const GLOBE = { x: 5.5, y: 1.62, z: -0.6, r: 0.72 }
const IO = { r: 1.95, size: 0.075 }
const TABLE = { x: 4.15, z: -2.65, top: 0.92 }
const TILT = (10 * Math.PI) / 180 // the dipole against the spin axis
const SPIN_S = 20 // seconds for the model's 9 h 56 min
const IO_S = SPIN_S * (42.46 / 9.925) // Io's 42.5 h
const AURORA_C = (14 * Math.PI) / 180 // the main ovals' colatitude
const FOOT_C = Math.asin(Math.sqrt(1 / 5.9)) // Io's footprint, from its real distance (5.9 Jupiter radii)

/** A soft round glow. */
function glowTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.4, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A dipole field line through magnetic longitude `phi`, out to `L` radii of a planet of radius `r`:
 *  points from the northern foot to the southern one (the dipole's axis is +y). */
function fieldLine(r, L, phi, n = 48) {
  const lam = Math.acos(Math.sqrt(1 / L))
  const pts = []
  for (let i = 0; i <= n; i++) {
    const l = lam - (2 * lam * i) / n
    const rr = L * r * Math.cos(l) ** 2
    pts.push(new THREE.Vector3(rr * Math.cos(l) * Math.cos(phi), rr * Math.sin(l), rr * Math.cos(l) * Math.sin(phi)))
  }
  return pts
}

/** Field lines drawn as glowing dashes running along them (u: 0 at the first point), growing out from the
 *  planet as `uGrow` goes from 0 to 1. */
function fieldMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uGrow: { value: 0 }, uColor: { value: new THREE.Color(color).multiplyScalar(1.6) }, uDash: { value: 9 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uGrow; uniform vec3 uColor; uniform float uDash;
      varying vec2 vUv;
      void main() {
        float u = vUv.x;
        float grown = step(min(u, 1.0 - u) * 2.0, uGrow);
        float dash = 0.35 + 0.65 * smoothstep(0.35, 0.5, fract(u * uDash - uTime * 0.6)) * (1.0 - smoothstep(0.85, 1.0, fract(u * uDash - uTime * 0.6)));
        float a = grown * dash * uGrow;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uColor * a, a);
      }`,
  })
}

// ======================================================================================================
// the room
// ======================================================================================================

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const stage = gasGiantStage({
    light,
    camera: ctx.camera,
    radius: R,
    scale: SCALE,
    layers: CLOUDS.map(c => ({ z: c.z, thick: c.thick, color: c.color, lit: c.lit, cover: c.cover, hole: c.hole, lightning: !!c.lightning })),
    canopy: color,
    // thunderheads rise from the water clouds up through the ammonia, their anvils a little above us
    // (Jupiter's lightning storms)
    towers: { from: CLOUDS[2].z, to: CLOUDS[0].z + 15, count: 7 },
  })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const geos = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v).replace('-', '−')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const glow = glowTex()
  textures.push(glow)
  const world = obj => obj.getWorldPosition(new THREE.Vector3())
  const sprite = (c, k = 1.6, opacity = 1) => new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color(c).multiplyScalar(k), transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }))
  const sign = (text, size, { color: c = '#f2e6cf', maxWidth = 3, anchorX = 'center', anchorY = 'middle' } = {}) =>
    makeText(text, { size, color: c, maxWidth, anchorX, anchorY, outlineWidth: size * 0.08, outlineColor: '#0b1020' })
  /** A canvas screen in a dark frame, facing +z: draw on `g`, then `tex.needsUpdate = true`. */
  function screen(w, h, px = 512) {
    const canvas = document.createElement('canvas')
    canvas.width = px
    canvas.height = Math.round((px * h) / w)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures.push(tex)
    const group = new THREE.Group()
    const frame = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.06, 2, 0.02), mats.dark)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#d8d8d8', toneMapped: false }))
    face.position.z = 0.035
    group.add(frame, face)
    return { group, g: canvas.getContext('2d'), w: canvas.width, h: canvas.height, tex, face }
  }
  /** Text that shrinks until it fits (the four languages differ in length). */
  const fit = (g, text, x, y, size, weight = 700, maxW = 400) => {
    let s = size
    g.font = `${weight} ${s}px Outfit`
    while (s > 11 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px Outfit`
    g.fillText(text, x, y)
  }
  // things whose words follow the depth switch: [object, 'kid' | 'sci']
  const byLevel = []
  let shownLevel = null
  const steel = new THREE.MeshStandardMaterial({ color: '#8b93a3', roughness: 0.35, metalness: 0.85 })
  const redMat = new THREE.MeshStandardMaterial({ color: '#e0453a', emissive: '#7a1a12', emissiveIntensity: 0.5, roughness: 0.35 })
  const panelMat = new THREE.MeshStandardMaterial({ color: '#232a3e', roughness: 0.5, metalness: 0.3 })

  // ======================================================================================================
  // 1. the descent: the desk, its board, its instruments, and the probe outside
  // ======================================================================================================
  const D = { target: 0, he: 0, lt: 0, pr: 0 }
  let depth = 0
  let descentMine = false
  let pendingStop = null
  const used = { sink: false, helium: false, lightning: false, probe: false }

  // the desk: a console with a sloping top
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(DESK.w, DESK.top - 0.06, DESK.d, 2, 0.04), panelMat)
    body.position.set(DESK.x, (DESK.top - 0.06) / 2, DESK.z)
    const topPlate = new THREE.Mesh(new RoundedBoxGeometry(DESK.w + 0.06, 0.06, DESK.d + 0.1, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#4a3a28', roughness: 0.75, metalness: 0.15 }))
    topPlate.position.set(DESK.x, DESK.top - 0.03, DESK.z)
    root.add(body, topPlate)
    solids.push(box(DESK.x, DESK.z, DESK.w + 0.1, DESK.d + 0.1))
  }
  // the board: Galileo's way down, on two posts behind the desk
  const board = screen(BOARD.w, BOARD.h, 1024)
  board.group.position.set(BOARD.x, BOARD.y, BOARD.z)
  root.add(board.group)
  for (const sx of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, BOARD.y - BOARD.h / 2, 10), mats.brass)
    post.position.set(BOARD.x + sx * (BOARD.w / 2 - 0.25), (BOARD.y - BOARD.h / 2) / 2, BOARD.z - 0.05)
    root.add(post)
  }
  solids.push(box(BOARD.x, BOARD.z, BOARD.w, 0.3))

  // the red handle (left of the desk)
  const handle = new THREE.Group()
  const handleArm = new THREE.Group()
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.12, 0.3, 2, 0.03), mats.dark)
    base.position.y = 0.06
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.24), new THREE.MeshStandardMaterial({ color: '#0a0c14' }))
    slot.position.y = 0.125
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 10), steel)
    rod.position.y = 0.21
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), redMat)
    knob.position.y = 0.43
    handleArm.add(rod, knob)
    handleArm.position.y = 0.12
    handleArm.rotation.x = 0.45
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.62, 0.42), ghost)
    hit.position.y = 0.3
    handle.add(base, slot, handleArm, hit)
    handle.position.set(DESK.x - 1.15, DESK.top, DESK.z + 0.05)
    root.add(handle)
    const lbl = sign(E.descent.labels.handle, 0.075, { color: '#ffd9c8' })
    lbl.position.set(DESK.x - 1.15, DESK.top + 0.02, DESK.z + DESK.d / 2 + 0.07)
    lbl.rotation.x = -0.5
    root.add(lbl)
  }
  let handleT = 9

  // the helium counter (middle of the desk): a sampling tube and a little screen
  const helium = new THREE.Group()
  const heScreen = screen(0.56, 0.34, 320)
  {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.36, 18), steel)
    tube.position.set(-0.36, 0.18, 0)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 18), mats.brass)
    cap.position.set(-0.36, 0.37, 0)
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), mats.brass)
    pipe.rotation.z = Math.PI / 2
    pipe.position.set(-0.22, 0.08, 0)
    heScreen.group.position.set(0.08, 0.26, 0)
    heScreen.group.rotation.x = -0.35
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.22), mats.dark)
    stand.position.set(0.08, 0.05, -0.02)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.4), ghost)
    hit.position.set(-0.1, 0.28, 0)
    helium.add(tube, cap, pipe, stand, heScreen.group, hit)
    helium.position.set(DESK.x + 0.05, DESK.top, DESK.z - 0.05)
    root.add(helium)
  }
  let heT = -1 // seconds since the counter began measuring (-1: idle)
  // the lightning detector (right of the desk): a loop aerial and a little screen
  const detector = new THREE.Group()
  const ltScreen = screen(0.56, 0.34, 320)
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.016, 8, 36), mats.brass)
  {
    loop.position.set(0.36, 0.42, 0)
    loop.rotation.y = 0.6
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.26, 8), mats.brass)
    mast.position.set(0.36, 0.13, 0)
    ltScreen.group.position.set(-0.08, 0.26, 0)
    ltScreen.group.rotation.x = -0.35
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.22), mats.dark)
    stand.position.set(-0.08, 0.05, -0.02)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.4), ghost)
    hit.position.set(0.1, 0.32, 0)
    detector.add(loop, mast, stand, ltScreen.group, hit)
    detector.position.set(DESK.x + 1.15, DESK.top, DESK.z - 0.05)
    root.add(detector)
  }
  let ltT = -1 // seconds since it began listening
  const ltTrace = new Float32Array(64)
  let ltNext = 0
  for (const [txt, x] of [[E.descent.labels.helium, DESK.x + 0.05], [E.descent.labels.lightning, DESK.x + 1.15]]) {
    const t = sign(txt, 0.06, { color: '#d8e6ff', maxWidth: 1.0 })
    t.position.set(x, DESK.top + 0.02, DESK.z + DESK.d / 2 + 0.07)
    t.rotation.x = -0.5
    root.add(t)
  }
  const lamp = new THREE.PointLight('#ffe2b8', light ? 1.4 : 1.8, 5, 1.5)
  lamp.position.set(DESK.x, DESK.top + 1.8, DESK.z + 1.4)
  root.add(lamp)

  // the Galileo probe, falling beside the gondola under its own parachute (the picture's top left)
  const probe = new THREE.Group()
  const probeBody = new THREE.Group()
  const beacon = sprite('#9effc0', 2.2)
  const pulses = []
  {
    const foil = new THREE.MeshStandardMaterial({ color: '#c8963a', roughness: 0.35, metalness: 0.7, emissive: '#3a2408', emissiveIntensity: 0.4 })
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 0.5, 24), foil)
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 10, 0, TAU, 0, Math.PI / 2), foil)
    top.scale.y = 0.45
    top.position.y = 0.25
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 6), mats.brass)
    ant.position.y = 0.55
    beacon.position.y = 0.76
    beacon.scale.setScalar(0.3)
    probeBody.add(body, top, ant, beacon)
    const chute = new THREE.Mesh(new THREE.SphereGeometry(1.25, 24, 8, 0, TAU, 0, 1.1), new THREE.MeshStandardMaterial({ color: '#e8e2d8', roughness: 0.8, side: THREE.DoubleSide, emissive: '#3a3630', emissiveIntensity: 0.4 }))
    chute.scale.y = 0.55
    chute.position.y = 2.6
    probeBody.add(chute)
    const lineGeos = []
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU
      const p0 = new THREE.Vector3(0, 0.62, 0)
      const p1 = new THREE.Vector3(Math.cos(a) * 1.1, 2.6 + 1.25 * Math.cos(1.1) * 0.55 - 0.05, Math.sin(a) * 1.1)
      const g = new THREE.CylinderGeometry(0.008, 0.008, p0.distanceTo(p1), 4, 1, true)
      g.applyMatrix4(new THREE.Matrix4().compose(p0.clone().add(p1).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize()), new THREE.Vector3(1, 1, 1)))
      lineGeos.push(g)
    }
    for (const g of lineGeos) probeBody.add(new THREE.Mesh(g, mats.cable))
    const hit = new THREE.Mesh(new THREE.SphereGeometry(1.3, 10, 8), ghost)
    hit.position.y = 1.2
    probeBody.add(hit)
    probe.add(probeBody)
    probe.position.set(PROBE.x, PROBE.y, PROBE.z)
    root.add(probe)
    // radio pulses rising to the orbiter overhead
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.03, 6, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color('#9effc0').multiplyScalar(1.8), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
      ring.rotation.x = Math.PI / 2
      ring.visible = false
      root.add(ring)
      pulses.push({ ring, t: -1 })
    }
  }
  // the probe's state: with us (falling alongside), falling away (lost), or gone
  let probeState = 'with'
  let probeFall = 0
  let probeFade = 1
  let prT = -1

  // ---- the board ----
  let boardDirty = true
  let boardAt = 0
  const where = () => {
    const B = E.descent.board.where
    if (depth > LOST_D + 0.5) return B.imagined
    const z = Z_TOP - depth
    const inside = CLOUDS.find(c => Math.abs(c.z - z) < (c.thick / 2) * 1.3)
    if (inside) return B[inside.id]
    if (z > CLOUDS[0].z) return B.above
    if (z > CLOUDS[2].z) return B.between
    return B.below
  }
  const fmtP = (P, lv) => {
    const digits = P < 1 ? 1 : P < 10 ? 1 : 0
    return lv === 'scientist' ? `${nf(P, digits)} bar` : fill(E.descent.board.kidP, { n: nf(P, digits) })
  }
  // to the nearest 5 °C (never "−0")
  const fmtT = P => `${nf(Math.round((tempAt(P) - 273.15) / 5) * 5 + 0)} °C`
  function drawBoard() {
    const { g, w, h, tex } = board
    const lv = level()
    const B = E.descent.board
    const P = presFallen(depth)
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    // the column: pressure on a log scale from 0.3 to 130 bar
    const cx0 = 60
    const cx1 = 290
    const cy0 = 70
    const cy1 = h - 40
    const yP = p => cy0 + (Math.log(p / 0.3) / Math.log(130 / 0.3)) * (cy1 - cy0)
    const grd = g.createLinearGradient(0, cy0, 0, cy1)
    for (const [p, c] of [[0.3, '#c9ac80'], [0.7, '#bdb39e'], [2, '#8c5834'], [5, '#43525f'], [10, '#3a2618'], [22, '#2c180e'], [130, '#1e0906']]) grd.addColorStop(clamp((yP(p) - cy0) / (cy1 - cy0)), c)
    g.fillStyle = grd
    g.fillRect(cx0, cy0, cx1 - cx0, cy1 - cy0)
    // below 22 bar: imagined, hatched
    g.save()
    g.beginPath()
    g.rect(cx0, yP(22), cx1 - cx0, cy1 - yP(22))
    g.clip()
    g.strokeStyle = 'rgba(255,200,170,0.18)'
    g.lineWidth = 3
    for (let k = -30; k < 40; k++) {
      g.beginPath()
      g.moveTo(cx0 + k * 22, yP(22))
      g.lineTo(cx0 + k * 22 + 200, yP(22) + 200)
      g.stroke()
    }
    g.restore()
    // the cloud decks
    const names = B.clouds[depthOf(lv)]
    CLOUDS.forEach((c, i) => {
      const ya = yP(presAt(c.z + c.thick / 2))
      const yb = yP(presAt(c.z - c.thick / 2))
      g.fillStyle = ['rgba(240,236,222,0.75)', 'rgba(200,140,90,0.75)', 'rgba(170,190,215,0.75)'][i]
      for (let x = cx0; x < cx1; x += 18) {
        g.beginPath()
        g.ellipse(x + 9, (ya + yb) / 2, 13, (yb - ya) / 2 + 3, 0, 0, TAU)
        g.fill()
      }
      g.fillStyle = '#e9eefc'
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      fit(g, names[i], cx1 + 14, (ya + yb) / 2, 26, 600, 200)
      if (lv === 'scientist') {
        g.fillStyle = '#a9b6dd'
        fit(g, `${nf(c.P, c.P < 1 ? 1 : 0)} bar`, cx1 + 14, (ya + yb) / 2 + 26, 20, 500, 200)
      }
    })
    // the probe's track and where it went quiet
    g.strokeStyle = '#9effc0'
    g.lineWidth = 3
    g.setLineDash([8, 7])
    g.beginPath()
    g.moveTo(cx1 - 26, cy0)
    g.lineTo(cx1 - 26, yP(22))
    g.stroke()
    g.setLineDash([])
    const yl = yP(22)
    g.beginPath()
    g.moveTo(cx1 - 36, yl - 10)
    g.lineTo(cx1 - 16, yl + 10)
    g.moveTo(cx1 - 16, yl - 10)
    g.lineTo(cx1 - 36, yl + 10)
    g.stroke()
    g.fillStyle = '#9effc0'
    g.textAlign = 'left'
    fit(g, B.lost, cx1 + 14, yl, 22, 600, 200)
    // the legend: the probe's track
    g.setLineDash([8, 7])
    g.beginPath()
    g.moveTo(cx0, 38)
    g.lineTo(cx0 + 46, 38)
    g.stroke()
    g.setLineDash([])
    fit(g, B.probe, cx0 + 58, 38, 22, 600, 420)
    g.fillStyle = 'rgba(255,200,170,0.75)'
    fit(g, B.imagined, cx1 + 14, (yl + cy1) / 2 + 30, 22, 600, 200)
    // the gondola
    const yg = yP(clamp(P, 0.3, 130))
    g.fillStyle = '#ffd166'
    g.strokeStyle = '#ffd166'
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(cx0 - 6, yg)
    g.lineTo(cx0 - 30, yg - 13)
    g.lineTo(cx0 - 30, yg + 13)
    g.closePath()
    g.fill()
    g.beginPath()
    g.moveTo(cx0, yg)
    g.lineTo(cx1, yg)
    g.stroke()
    g.strokeStyle = 'rgba(255,255,255,0.25)'
    g.lineWidth = 2
    g.strokeRect(cx0, cy0, cx1 - cx0, cy1 - cy0)
    // the readouts
    const rx = 590
    g.textAlign = 'left'
    g.textBaseline = 'alphabetic'
    g.fillStyle = '#ffb3a8'
    fit(g, B.title, rx, 78, 46, 700, w - rx - 30)
    const rows = [
      [B.depth, `${nf(Math.round(depth))} km`],
      [B.pressure, fmtP(P, lv)],
      [B.temp, fmtT(P)],
    ]
    rows.forEach(([k, v], i) => {
      const y = 160 + i * 112
      g.fillStyle = '#a9b6dd'
      fit(g, k, rx, y, 28, 500, w - rx - 30)
      g.fillStyle = '#ffffff'
      fit(g, v, rx, y + 58, 56, 700, w - rx - 30)
    })
    g.fillStyle = depth > LOST_D + 0.5 ? '#ffc0a8' : '#ffd166'
    fit(g, where(), rx, h - 42, 30, 600, w - rx - 30)
    tex.needsUpdate = true
  }

  // ---- the helium counter's and the detector's screens ----
  function drawHelium() {
    const { g, w, h, tex } = heScreen
    const L = E.descent.labels
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    const k = heT < 0 ? 0 : span(0, 2.2, heT)
    if (heT >= 0 && heT < 2.2) {
      g.fillStyle = '#a9b6dd'
      fit(g, `${L.measuring}${'.'.repeat(1 + (Math.floor(heT * 3) % 3))}`, 20, 40, 30, 600, w - 40)
      g.fillStyle = '#2a3463'
      g.fillRect(20, 90, w - 40, 26)
      g.fillStyle = '#7fd4ff'
      g.fillRect(20, 90, (w - 40) * k, 26)
    } else if (heT >= 2.2) {
      // by mass: about 76 % hydrogen, 24 % helium (Galileo's helium mass fraction 0.234)
      const bars = [[L.hydrogen, 0.76, '#e9eefc'], [L.heliumBar, 0.24, '#ffd166']]
      bars.forEach(([name, v, c], i) => {
        const y = 40 + i * 70
        g.fillStyle = c
        fit(g, `${name} ${nf(Math.round(v * 100))} %`, 20, y, 28, 700, w - 40)
        g.fillRect(20, y + 24, (w - 40) * v, 16)
      })
    } else {
      g.fillStyle = '#5a6699'
      fit(g, 'He', w / 2 - 20, h / 2, 54, 700, 100)
    }
    tex.needsUpdate = true
  }
  function drawDetector() {
    const { g, w, h, tex } = ltScreen
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = '#2a3463'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(0, h * 0.6)
    g.lineTo(w, h * 0.6)
    g.stroke()
    g.strokeStyle = '#bfe0ff'
    g.lineWidth = 3
    g.beginPath()
    for (let i = 0; i < ltTrace.length; i++) {
      const x = (i / (ltTrace.length - 1)) * w
      const y = h * 0.6 - ltTrace[(ltNext + i) % ltTrace.length] * h * 0.5
      if (i === 0) g.moveTo(x, y)
      else g.lineTo(x, y)
    }
    g.stroke()
    if (ltT >= 0) {
      g.fillStyle = '#a9b6dd'
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      fit(g, `${E.descent.labels.listening}${'.'.repeat(1 + (Math.floor(ltT * 3) % 3))}`, 16, 28, 26, 600, w - 32)
    }
    tex.needsUpdate = true
  }

  // ---- the descent's steps ----
  const stopIndex = () => {
    let i = 0
    while (i < STOP_D.length - 1 && depth >= STOP_D[i + 1] - 0.5) i++
    return i
  }
  const descentPanel = lv => ({
    title: E.descent.title,
    color,
    blocks: [
      {
        slider: {
          label: E.descent.slider,
          min: 0,
          max: Math.round(MAX_D),
          step: 1,
          value: Math.round(D.target),
          onInput: v => setDepth(v),
          format: v => `${nf(Math.round(v))} km · ${nf(presFallen(v), presFallen(v) < 10 ? 1 : 0)} bar`,
          live: () => Math.round(D.target),
        },
      },
      { buttons: ['sink', 'helium', 'lightning', 'probe'].map(k => ({ label: E.descent.buttons[k], onClick: () => descentStep(k) })) },
      ...paras(E.descent.panel, lv),
    ],
  })
  function startHelium() {
    heT = 0
    play('select')
  }
  function startListening(n) {
    ltT = 0
    // two flashes in the water clouds while it listens, the same for everyone (from the count)
    for (const [k, at0] of [[0, 1.0], [1, 2.6]]) {
      later(at0, () => {
        const a = hash(n, k) * TAU
        const r = 80 + hash(n, k, 1) * 220
        stage.flash([Math.cos(a) * r, Math.sin(a) * r], 1.2)
      })
    }
  }
  function startPulse() {
    prT = 0
    play('beep')
    pulses.forEach((p, i) => (p.t = -i * 0.35))
  }
  function descentStep(what) {
    const lv = level()
    const S = E.descent.says
    if (what === 'sink' || what === 'handle') {
      used.sink = true
      const i = STOP_D.findIndex(d => d > D.target + 0.5)
      if (i < 0) {
        D.target = 0
        pendingStop = null
        say(at(S.up, lv))
      } else {
        D.target = STOP_D[i]
        pendingStop = i
      }
      handleT = 0
      descentMine = true
      play('select')
    } else if (what === 'helium') {
      if (heT >= 0 && heT < 2.2) return say(at(W.busy, lv))
      used.helium = true
      D.he++
      startHelium()
      later(2.3, () => say(at(S.helium, level())))
    } else if (what === 'lightning') {
      if (ltT >= 0) return say(at(W.busy, lv))
      used.lightning = true
      D.lt++
      startListening(D.lt)
      later(1.4, () => say(at(S.lightning, level())))
    } else if (what === 'probe') {
      if (probeState !== 'with') return say(at(S.probeGone, lv))
      used.probe = true
      D.pr++
      startPulse()
      say(at(E.descent.probe[Math.min(stopIndex(), E.descent.probe.length - 1)], lv))
    } else return
    ex.discover('descent', descentPanel, 2.8)
    share('descent')
  }
  let depthSending = false
  function setDepth(v) {
    D.target = clamp(Math.round(Number(v) || 0), 0, MAX_D)
    pendingStop = null
    descentMine = true
    ex.discover('descent', descentPanel, 2.8)
    if (depthSending) return
    depthSending = true
    later(0.25, () => {
      depthSending = false
      share('descent')
    })
  }
  clickable(handle, () => descentStep('sink'), { reach: 4.5 })
  clickable(helium, () => descentStep('helium'), { reach: 4.5 })
  clickable(detector, () => descentStep('lightning'), { reach: 4.5 })
  clickable(probeBody, () => descentStep('probe'), { reach: 12, when: () => probeState === 'with' })
  ex.add({
    id: 'descent',
    x: 0,
    z: -4.1,
    radius: 1.9,
    manual: true,
    label: E.descent.label,
    verb: () => {
      const h = E.descent.hints
      if (Math.abs(depth - D.target) > 0.5) return h.moving
      if (!used.sink) return h.sink
      if (!used.helium) return h.helium
      if (!used.lightning) return h.lightning
      if (!used.probe && probeState === 'with') return h.probe
      return D.target >= MAX_D - 0.5 ? h.top : h.deeper
    },
    focus: { x: 0, y: 1.75, z: -6.4, size: 2.6, width: 4.2 },
    act: () => ctx.showPanel(descentPanel),
  })
  function probeLost(mine) {
    probeState = 'falling'
    probeFall = 0
    if (mine && pendingStop !== LOST) say(at(E.descent.says.lost, level()))
  }
  updates.push((dt, t) => {
    // the gondola sinks (or rises) toward its target, sped up
    const was = depth
    if (depth !== D.target) {
      const gap = D.target - depth
      const v = Math.max(6, Math.min(45, Math.abs(gap) * 2.4))
      depth += Math.sign(gap) * Math.min(Math.abs(gap), v * dt)
      if (Math.abs(D.target - depth) < 1e-3) depth = D.target
    }
    if (depth !== was) {
      stage.setAltitude(Z_TOP - depth)
      boardDirty = true
      if (was < LOST_D - 0.01 && depth >= LOST_D - 0.01 && probeState === 'with') probeLost(descentMine)
      if (depth < LOST_D - 0.5 && probeState !== 'with') {
        probeState = 'with'
        probeFade = 0
      }
      if (depth === D.target && pendingStop != null) {
        if (descentMine) say(at(E.descent.stops[pendingStop], level()))
        pendingStop = null
      }
    }
    // the handle swings forward and back
    handleT += dt
    handleArm.rotation.x = 0.45 - 1.0 * Math.sin(Math.PI * clamp(handleT / 0.6))
    // the board, now and then while it moves
    boardAt -= dt
    if (boardDirty && boardAt <= 0) {
      boardDirty = false
      boardAt = 0.12
      drawBoard()
    }
    // the probe: sways under its parachute; once lost, falls away into the dark
    if (probeState === 'with') {
      probeFade = Math.min(1, probeFade + dt / 0.8)
      probe.visible = true
      probe.position.set(PROBE.x + Math.sin(t * 0.4) * 0.3, PROBE.y + Math.sin(t * 0.7) * 0.15, PROBE.z)
      probeBody.rotation.z = Math.sin(t * 0.9) * 0.06
      probeBody.scale.setScalar(Math.max(0.01, probeFade))
      beacon.material.opacity = Math.sin(t * 5) > 0.6 ? 1 : 0.15
    } else if (probeState === 'falling') {
      probeFall += dt
      probe.position.y = PROBE.y - probeFall * probeFall * 6
      beacon.material.opacity = 0
      if (probeFall > 3) {
        probeState = 'gone'
        probe.visible = false
      }
    } else probe.visible = false
    // its radio pulses rising to the orbiter
    for (const p of pulses) {
      if (p.t > 2.4 || prT < 0) {
        p.ring.visible = false
        continue
      }
      p.t += dt
      if (p.t < 0) continue
      p.ring.visible = probe.visible
      p.ring.position.set(probe.position.x, probe.position.y + 0.8 + p.t * 4, probe.position.z)
      p.ring.scale.setScalar(0.6 + p.t * 1.4)
      p.ring.material.opacity = Math.max(0, 1 - p.t / 2.4)
    }
    if (prT >= 0 && (prT += dt) > 3.5) prT = -1
    // the helium counter
    if (heT >= 0) {
      heT += dt
      if (heT - dt < 2.4) drawHelium()
      if (heT > 30) {
        heT = -1
        drawHelium()
      }
    }
    // the detector: a trace scrolling, crackles while it listens
    ltNext = (ltNext + 1) % ltTrace.length
    const idx = (ltNext + ltTrace.length - 1) % ltTrace.length
    let spike = (Math.random() - 0.5) * 0.06
    if (ltT >= 0) {
      ltT += dt
      if (Math.random() < dt * 4.5) {
        spike = 0.4 + Math.random() * 0.55
        play('crack')
      }
      if (ltT > 4.5) ltT = -1
    }
    ltTrace[idx] = spike
    loop.rotation.y = 0.6 + (ltT >= 0 ? Math.sin(t * 2) * 0.4 : 0)
    drawDetector()
  })
  // a far flash crackles on the detector too
  stage.onFlash = () => {
    ltTrace[(ltNext + ltTrace.length - 1) % ltTrace.length] = 0.5 + Math.random() * 0.4
  }
  const descentState = () => ({ d: round1(D.target), he: D.he, lt: D.lt, pr: D.pr })
  const descentSet = (s, liveSet) => {
    const d = clamp(Number(s?.d) || 0, 0, MAX_D)
    const n = k => Math.max(0, Math.round(Number(s?.[k]) || 0))
    D.target = d
    descentMine = false
    pendingStop = null
    if (!liveSet) {
      depth = d
      stage.setAltitude(Z_TOP - d)
      probeState = d < LOST_D - 0.5 ? 'with' : 'gone'
      probeFade = 1
      boardDirty = true
    }
    if (liveSet && n('he') === D.he + 1) startHelium()
    if (liveSet && n('lt') === D.lt + 1) startListening(n('lt'))
    if (liveSet && n('pr') === D.pr + 1 && probeState === 'with') startPulse()
    D.he = n('he')
    D.lt = n('lt')
    D.pr = n('pr')
  }

  // ======================================================================================================
  // 2. squeezing hydrogen: the gas gun, the lens, the bulb, the chart
  // ======================================================================================================
  const Q = { p: 1.0, n: 0, shots: [], loaded: 1 }
  let shot = null // { t, p, mine, told }
  let loadT = 9
  // the bench
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(BENCH.w, 0.06, BENCH.d, 2, 0.015), mats.metal)
    top.position.set(BENCH.x, BENCH.top - 0.03, BENCH.z)
    root.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, BENCH.top - 0.06, 0.07), mats.dark)
        leg.position.set(BENCH.x + sx * (BENCH.w / 2 - 0.08), (BENCH.top - 0.06) / 2, BENCH.z + sz * (BENCH.d / 2 - 0.08))
        root.add(leg)
      }
    }
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(BENCH.w - 0.1, 0.04, BENCH.d - 0.2), mats.dark)
    shelf.position.set(BENCH.x, 0.25, BENCH.z)
    root.add(shelf)
    solids.push(box(BENCH.x, BENCH.z, BENCH.w + 0.1, BENCH.d + 0.1))
  }
  // the gun, lying along the bench: the powder breech, the pump tube, the launch tube, the target chamber
  const gun = new THREE.Group()
  const along = (r0, r1, z0, z1, mat, seg = 20) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, Math.abs(z1 - z0), seg), mat)
    m.rotation.x = Math.PI / 2
    m.position.set(0, 0, (z0 + z1) / 2)
    gun.add(m)
    return m
  }
  {
    const breech = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.3, 0.24, 2, 0.04), mats.dark)
    breech.position.z = 1.55
    gun.add(breech)
    along(0.11, 0.11, 1.42, 0.35, steel)
    along(0.11, 0.05, 0.35, 0.2, steel)
    along(0.036, 0.036, 0.2, CHAMBER.z + CHAMBER.s / 2, steel, 14)
    for (const z of [1.42, 0.8, 0.35]) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.018, 6, 24), mats.brass)
      band.position.z = z
      gun.add(band)
    }
    for (const z of [1.1, 0.5, -0.5]) {
      const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.2, GUN_Y - BENCH.top - 0.05, 0.08), mats.dark)
      saddle.position.set(0, -(GUN_Y - BENCH.top) / 2 - 0.02, z)
      gun.add(saddle)
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 1.9), ghost)
    hit.position.z = 0.75
    gun.add(hit)
    gun.position.set(BENCH.x, GUN_Y, 0)
    root.add(gun)
  }
  const gunLabel = sign(E.squeeze.labels.gun, 0.07, { color: '#d8e6ff', maxWidth: 1.6 })
  gunLabel.position.set(BENCH.x + 0.52, BENCH.top + 0.02, 0.75)
  gunLabel.rotation.set(-Math.PI / 2 + 0.4, Math.PI / 2, 0, 'YXZ')
  root.add(gunLabel)
  // the target chamber with a small window, and the sample's lens above it
  const chamber = new THREE.Mesh(new RoundedBoxGeometry(CHAMBER.s, CHAMBER.s, CHAMBER.s, 2, 0.04), steel)
  chamber.position.set(CHAMBER.x, GUN_Y, CHAMBER.z)
  root.add(chamber)
  const port = new THREE.Mesh(new THREE.CircleGeometry(0.08, 24), new THREE.MeshStandardMaterial({ color: '#1a2240', emissive: '#7f93b8', emissiveIntensity: 0, roughness: 0.15, metalness: 0.6 }))
  port.position.set(CHAMBER.x + CHAMBER.s / 2 + 0.003, GUN_Y, CHAMBER.z)
  port.rotation.y = Math.PI / 2
  root.add(port)
  const flashBreech = sprite('#ffc070', 2.4, 0)
  flashBreech.position.set(BENCH.x, GUN_Y + 0.15, 1.75)
  const flashImpact = sprite('#e8f0ff', 2.6, 0)
  flashImpact.position.set(CHAMBER.x + 0.2, GUN_Y, CHAMBER.z)
  const bolt = sprite('#ffe2b0', 2.2, 0)
  bolt.scale.setScalar(0.22)
  root.add(flashBreech, flashImpact, bolt)

  // the lens: what is inside the sample, magnified (the picture's grey molecules and cyan electrons)
  const lens = new THREE.Group()
  const lensBack = new THREE.MeshBasicMaterial({ color: '#141a3c' })
  const MOL = light ? 90 : 124
  const molPos = [] // base place (lens radii), angle, phase
  for (let i = 0; i < MOL; i++) {
    const a = hash(3, i) * TAU
    const r = Math.sqrt(hash(3, i, 1)) * 1.95
    molPos.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, ang: hash(3, i, 2) * TAU, ph: hash(3, i, 3) * 100, e: hash(3, i, 4) })
  }
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshStandardMaterial({ color: '#dfe4ee', roughness: 0.35, emissive: '#3a4260', emissiveIntensity: 0.5 }), MOL * 2)
  const elecs = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#8fe4ff').multiplyScalar(1.5) }), MOL)
  atoms.frustumCulled = elecs.frustumCulled = false
  atoms.raycast = elecs.raycast = () => {}
  const sheen = new THREE.Mesh(new THREE.CircleGeometry(LENS.r * 0.98, 48), new THREE.MeshBasicMaterial({ color: '#b8c8e8', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  const shards = new THREE.Group()
  {
    const backing = new THREE.Mesh(new THREE.CircleGeometry(LENS.r, 48), lensBack)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LENS.r, 0.03, 10, 64), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 }))
    ring.position.z = 0.02
    sheen.position.z = 0.012
    atoms.position.z = 0.03
    elecs.position.z = 0.05
    // the smashed cell: dark cracks across the window
    const crackMat = new THREE.MeshBasicMaterial({ color: '#6a7698' })
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU + hash(8, i) * 0.6
      const len = LENS.r * (0.5 + 0.45 * hash(8, i, 1))
      const c = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.008), crackMat)
      c.position.set((Math.cos(a) * len) / 2, (Math.sin(a) * len) / 2, 0.02)
      c.rotation.z = a
      shards.add(c)
    }
    shards.visible = false
    const gloss = new THREE.Mesh(new THREE.TorusGeometry(LENS.r * 0.82, 0.01, 6, 32, 1.1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 }))
    gloss.rotation.z = 1.9
    gloss.position.z = 0.1
    lens.add(backing, sheen, atoms, elecs, shards, ring, gloss)
    // a post from the chamber
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, LENS.y - LENS.r - GUN_Y - CHAMBER.s / 2 + 0.04, 8), mats.brass)
    post.position.set(LENS.x - 0.05, (LENS.y - LENS.r + GUN_Y + CHAMBER.s / 2) / 2, LENS.z)
    root.add(post)
    lens.position.set(LENS.x, LENS.y, LENS.z)
    lens.rotation.y = Math.PI / 2
    root.add(lens)
  }
  const lensHit = new THREE.Mesh(new THREE.CircleGeometry(LENS.r + 0.04, 24), ghost)
  lensHit.position.z = 0.12
  lens.add(lensHit)
  // the bulb in the sample's circuit, on a post at the bench's edge
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#f4efe0', emissive: '#ffd27a', emissiveIntensity: 0, roughness: 0.2, transparent: true, opacity: 0.85 })
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 12), bulbMat)
  const bulbGlow = sprite('#ffd27a', 2.0, 0)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, BULB.y - BENCH.top - 0.07, 8), mats.brass)
    post.position.set(BULB.x, (BULB.y + BENCH.top - 0.07) / 2, BULB.z)
    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12), mats.brass)
    sock.position.set(BULB.x, BULB.y - 0.06, BULB.z)
    bulb.position.set(BULB.x, BULB.y, BULB.z)
    bulbGlow.position.copy(bulb.position)
    bulbGlow.scale.setScalar(0.5)
    root.add(post, sock, bulb, bulbGlow)
    // the wires from the chamber
    const wire = new THREE.CatmullRomCurve3([
      new THREE.Vector3(CHAMBER.x + 0.15, GUN_Y - 0.12, CHAMBER.z + CHAMBER.s / 2),
      new THREE.Vector3(BULB.x - 0.05, BENCH.top + 0.02, -0.95),
      new THREE.Vector3(BULB.x, BULB.y - 0.08, BULB.z - 0.02),
    ])
    const wg = new THREE.TubeGeometry(wire, 24, 0.008, 5, false)
    geos.push(wg)
    root.add(new THREE.Mesh(wg, new THREE.MeshStandardMaterial({ color: '#c8733c', roughness: 0.4, metalness: 0.8 })))
  }
  // the frosty flask of liquid hydrogen (fresh cells)
  const flask = new THREE.Group()
  const mist = []
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.13, 0.44, 24), new THREE.MeshStandardMaterial({ color: '#dfe8f2', roughness: 0.45, metalness: 0.6, emissive: '#5a6a80', emissiveIntensity: 0.25 }))
    body.position.y = 0.22
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.1, 16), steel)
    neck.position.y = 0.49
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.4), ghost)
    hit.position.y = 0.32
    flask.add(body, neck, hit)
    for (let i = 0; i < 4; i++) {
      const s = sprite('#e8f4ff', 1.0, 0)
      s.material.blending = THREE.NormalBlending
      flask.add(s)
      mist.push({ s, ph: i / 4 })
    }
    flask.position.set(FLASK.x, BENCH.top, FLASK.z)
    root.add(flask)
    const lbl = sign(E.squeeze.labels.flask, 0.06, { color: '#d8e6ff', maxWidth: 0.8 })
    lbl.position.set(FLASK.x + 0.2, BENCH.top + 0.75, FLASK.z)
    lbl.rotation.y = Math.PI / 2
    root.add(lbl)
  }
  // the chart: the visitor's shots, conductivity against pressure
  const chart = screen(CHART.w, CHART.h, 768)
  chart.group.position.set(CHART.x, CHART.y, CHART.z)
  chart.group.rotation.y = Math.PI / 2
  root.add(chart.group)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, CHART.y - CHART.h / 2, 8), mats.brass)
    post.position.set(CHART.x - 0.04, (CHART.y - CHART.h / 2) / 2, CHART.z)
    root.add(post)
    solids.push(circle(CHART.x, CHART.z, 0.2))
  }
  function drawChart() {
    const { g, w, h, tex } = chart
    const lv = level()
    const L = E.squeeze.labels
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    const x0 = 100
    const x1 = w - 30
    const y0 = 80
    const y1 = h - 80
    const xP = p => x0 + ((p - P_MIN) / (P_MAX - P_MIN)) * (x1 - x0)
    const yC = c => y1 - c * (y1 - y0)
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    g.fillStyle = '#ffb3a8'
    fit(g, L.chart, 24, 38, 36, 700, w - 48)
    // the metal's level, and Jupiter's deep pressures
    g.fillStyle = 'rgba(255,209,102,0.12)'
    g.fillRect(xP(P_METAL), y0, x1 - xP(P_METAL), y1 - y0)
    g.fillStyle = '#ffd166'
    fit(g, L.jupiter, xP(P_METAL) + 8, y1 - 20, 20, 600, x1 - xP(P_METAL) - 12)
    g.strokeStyle = 'rgba(255,255,255,0.3)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(x0, y0)
    g.lineTo(x0, y1)
    g.lineTo(x1, y1)
    g.stroke()
    g.fillStyle = '#a9b6dd'
    for (const p of [0.5, 1, 1.5]) {
      g.textAlign = 'center'
      fit(g, nf(p, 1), xP(p), y1 + 22, 20, 500, 80)
    }
    fit(g, L.x, (x0 + x1) / 2, h - 24, 22, 600, x1 - x0)
    g.save()
    g.translate(30, (y0 + y1) / 2)
    g.rotate(-Math.PI / 2)
    fit(g, lv === 'scientist' ? L.ySci : L.yKid, 0, 0, 20, 600, y1 - y0)
    g.restore()
    g.textAlign = 'left'
    fit(g, L.metal, x0 + 8, yC(1) - 14, 18, 600, 200)
    fit(g, L.none, x0 + 8, yC(0) - 14, 18, 600, 260)
    // the Livermore measurements, once the visitor has three shots (or at once for a scientist)
    if (Q.shots.length >= 3 || lv === 'scientist') {
      g.strokeStyle = 'rgba(158,255,192,0.8)'
      g.lineWidth = 3
      g.setLineDash([10, 8])
      g.beginPath()
      for (let p = P_ON; p <= P_MAX + 1e-6; p += 0.01) {
        const x = xP(p)
        const y = yC(condOf(p))
        if (p === P_ON) g.moveTo(x, y)
        else g.lineTo(x, y)
      }
      g.stroke()
      g.setLineDash([])
      g.fillStyle = '#9effc0'
      fit(g, L.nellis, xP(P_METAL) + 8, yC(1) + 26, 20, 600, x1 - xP(P_METAL) - 12)
    }
    // the visitor's shots (the newest only once it has been measured)
    const shown = shot && shot.t < SHOT.squeeze ? Q.shots.slice(0, -1) : Q.shots
    shown.forEach((p, i) => {
      const c = condOf(p)
      g.fillStyle = i === shown.length - 1 ? '#ffd166' : '#ff9e6a'
      g.beginPath()
      g.arc(xP(p), yC(c), i === shown.length - 1 ? 11 : 8, 0, TAU)
      g.fill()
    })
    tex.needsUpdate = true
  }
  let chartDirty = true

  const squeezePanel = lv => ({
    title: E.squeeze.title,
    color,
    blocks: [
      {
        slider: {
          label: E.squeeze.slider,
          min: P_MIN,
          max: P_MAX,
          step: 0.05,
          value: Q.p,
          onInput: v => setPress(v),
          format: v => fill(E.squeeze.format, { p: nf(v, 2) }),
          live: () => Q.p,
        },
      },
      { buttons: [{ label: E.squeeze.buttons.fire, onClick: () => squeezeStep('gun') }, { label: E.squeeze.buttons.load, onClick: () => squeezeStep('flask') }] },
      ...paras(E.squeeze.panel, lv),
    ],
  })
  function startShot(p, mine) {
    shot = { t: 0, p, mine, told: false }
    play('bang')
  }
  function squeezeStep(what) {
    const lv = level()
    const S = E.squeeze.says
    if (what === 'gun') {
      if (shot) return say(at(W.busy, lv))
      if (!Q.loaded) return say(at(S.noCell, lv))
      Q.loaded = 0
      Q.n++
      Q.shots = [...Q.shots, Q.p].slice(-12)
      startShot(Q.p, true)
      say(at(S.fire, lv))
      chartDirty = true
    } else if (what === 'flask' || what === 'load') {
      if (shot) return say(at(W.busy, lv))
      if (Q.loaded) return say(at(S.loaded, lv))
      Q.loaded = 1
      loadT = 0
      play('fizz', { order: 0.6 })
      say(at(S.load, lv))
    } else return
    ex.discover('squeeze', squeezePanel, 5.2)
    share('squeeze')
  }
  let pressSending = false
  function setPress(v) {
    Q.p = clamp(Math.round((Number(v) || 1) * 20) / 20, P_MIN, P_MAX)
    ex.discover('squeeze', squeezePanel, 2.4)
    if (pressSending) return
    pressSending = true
    later(0.25, () => {
      pressSending = false
      share('squeeze')
    })
  }
  clickable(gun, () => squeezeStep('gun'), { reach: 4.5 })
  clickable(chamber, () => squeezeStep('gun'), { reach: 4.5 })
  clickable(flask, () => squeezeStep('flask'), { reach: 4.5 })
  ex.add({
    id: 'squeeze',
    x: -4.3,
    z: -0.5,
    radius: 1.9,
    manual: true,
    label: E.squeeze.label,
    verb: () => {
      const h = E.squeeze.hints
      if (shot) return h.watch
      return Q.loaded ? h.fire : h.load
    },
    focus: { x: -6.4, y: 1.4, z: -0.55, size: 2.1, width: 4.3 },
    act: () => ctx.showPanel(squeezePanel),
  })
  // the lens's sample: crowding with the squeeze, electrons roaming once it conducts
  let lensP = 0 // the pressure the sample is at now (0 at rest)
  let lensGone = 0 // 1 once the cell is smashed
  const dummy = new THREE.Object3D()
  const bond = 0.36 // half the bond, in atom radii
  updates.push((dt, t) => {
    loadT += dt
    let squeezeK = 0
    let breechK = 0
    let impactK = 0
    if (shot) {
      shot.t += dt
      const s = shot.t
      breechK = Math.max(0, 1 - s / 0.25)
      // the projectile along the launch tube, then the impact
      bolt.material.opacity = s < SHOT.travel ? 1 : 0
      bolt.position.set(BENCH.x, GUN_Y, lerp(0.3, CHAMBER.z + CHAMBER.s / 2, span(0.1, SHOT.travel, s)))
      if (s >= SHOT.travel && s - dt < SHOT.travel) {
        play('crack')
        chamber.position.x = CHAMBER.x + 0.03
      }
      impactK = s > SHOT.travel ? Math.max(0, 1 - (s - SHOT.travel) / 0.35) : 0
      squeezeK = span(SHOT.travel, SHOT.squeeze, s) * (1 - span(SHOT.hold, SHOT.end, s))
      // measured: a point on the chart, the visitor told what it did
      if (s >= SHOT.squeeze && !shot.told) {
        shot.told = true
        chartDirty = true
        if (shot.mine) {
          const S = E.squeeze.says
          const line = shot.p >= P_METAL ? S.metal : shot.p >= P_ON ? S.semi : S.insulator
          say(fill(at(line, level()), { p: nf(shot.p, 2) }))
        }
      }
      if (s > SHOT.end) shot = null
    } else bolt.material.opacity = 0
    chamber.position.x = damp(chamber.position.x, CHAMBER.x, 12, dt)
    flashBreech.material.opacity = breechK
    flashBreech.scale.setScalar(0.3 + breechK * 0.5)
    flashImpact.material.opacity = impactK
    flashImpact.scale.setScalar(0.4 + impactK * 0.9)
    const p = shot ? shot.p * squeezeK : 0
    lensP = p
    // a fresh cell comes in; a shot smashes it as the squeeze lets go
    const smashed = !Q.loaded && !(shot && shot.t < SHOT.hold)
    lensGone = damp(lensGone, smashed ? 1 : 0, 6, dt)
    shards.visible = lensGone > 0.5
    const cond = condOf(p) * (p > 0.05 ? 1 : 0)
    // the bulb: faint while it only half conducts, bright once it is a metal
    const glowK = cond * cond
    bulbMat.emissiveIntensity = glowK * 2.4
    bulbGlow.material.opacity = glowK * 0.9
    bulbGlow.scale.setScalar(0.3 + glowK * 0.45)
    port.material.emissiveIntensity = cond * 0.8
    sheen.material.opacity = 0.45 * cond * cond
    lensBack.color.set('#141a3c').lerp(new THREE.Color('#40507a'), cond)
    // the molecules: closer with the density, shaking harder as the shock heats them
    const lin = Math.cbrt(densOf(p))
    const shake = 0.012 + 0.05 * clamp(p / P_METAL)
    const show = 1 - lensGone
    const rA = LENS.r * 0.07
    let na = 0
    let ne = 0
    const free = cond
    for (let i = 0; i < MOL; i++) {
      const m = molPos[i]
      const x = (m.x / lin) * LENS.r * 0.92 + Math.sin(t * 7 + m.ph) * shake * LENS.r
      const y = (m.y / lin) * LENS.r * 0.92 + Math.cos(t * 6.3 + m.ph * 1.7) * shake * LENS.r
      if (Math.hypot(x, y) > LENS.r * 0.9 || show < 0.05) continue
      const ang = m.ang + t * (0.4 + 3 * clamp(p / P_METAL)) * (i % 2 ? 1 : -1)
      for (const s of [-1, 1]) {
        dummy.position.set(x + Math.cos(ang) * bond * rA * 2 * s, y + Math.sin(ang) * bond * rA * 2 * s, 0)
        dummy.scale.setScalar(rA * show)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        atoms.setMatrixAt(na++, dummy.matrix)
      }
      // its electron pair, round the molecule, or roaming free through the sample
      if (m.e < free) {
        const u = t * (0.25 + 0.2 * m.e) + m.ph
        dummy.position.set(Math.sin(u * 1.3 + m.ph) * LENS.r * 0.8, Math.cos(u * 0.9 + m.ph * 2) * LENS.r * 0.8, 0.02)
      } else {
        const u = t * 3 + m.ph
        dummy.position.set(x + Math.cos(u) * rA * 2.6, y + Math.sin(u) * rA * 2.6, 0.02)
      }
      if (Math.hypot(dummy.position.x, dummy.position.y) > LENS.r * 0.9) continue
      dummy.scale.setScalar(rA * 0.42 * show)
      dummy.updateMatrix()
      elecs.setMatrixAt(ne++, dummy.matrix)
    }
    atoms.count = na
    elecs.count = ne
    atoms.instanceMatrix.needsUpdate = true
    elecs.instanceMatrix.needsUpdate = true
    // the flask breathes mist; more as a fresh cell is taken
    mist.forEach(m => {
      const u = (t * 0.3 + m.ph) % 1
      m.s.position.set(Math.sin(u * 6 + m.ph * 9) * 0.04, 0.58 + u * 0.4, Math.cos(u * 5) * 0.04)
      m.s.scale.setScalar(0.08 + u * 0.22)
      m.s.material.opacity = (0.18 + 0.4 * Math.max(0, 1 - loadT / 1.5)) * Math.sin(Math.PI * u)
    })
    if (chartDirty) {
      chartDirty = false
      drawChart()
    }
  })
  const squeezeState = () => ({ p: Q.p, n: Q.n, shots: [...Q.shots], loaded: Q.loaded, age: shot ? round1(shot.t) : null })
  const squeezeSet = (s, liveSet, ago = 0) => {
    Q.p = clamp(Math.round((Number(s?.p) || 1) * 20) / 20, P_MIN, P_MAX)
    const n = Math.max(0, Math.round(Number(s?.n) || 0))
    Q.shots = (Array.isArray(s?.shots) ? s.shots : []).map(v => clamp(Number(v) || P_MIN, P_MIN, P_MAX)).slice(-12)
    Q.loaded = s?.loaded ? 1 : 0
    const last = Q.shots[Q.shots.length - 1] ?? Q.p
    if (liveSet && n === Q.n + 1 && !shot) startShot(last, false)
    else {
      const age = s?.age == null ? null : Number(s.age) + (Number(ago) || 0)
      shot = age != null && age < SHOT.end ? { t: age, p: last, mine: false, told: age >= SHOT.squeeze } : null
    }
    Q.n = n
    if (!liveSet) lensGone = !Q.loaded && !(shot && shot.t < SHOT.hold) ? 1 : 0
    chartDirty = true
  }

  // ======================================================================================================
  // 3. Jupiter's magnet: the model, its field, the auroras, Io, the Earth and the compass
  // ======================================================================================================
  const M = { f: 0, a: 0, i: 0, e: 0 }
  const mk = { f: 0, a: 0, i: 0, e: 0 } // how far each has come up (0..1)
  const spin = new THREE.Group() // turns with the planet
  const dipole = new THREE.Group() // the magnet's frame: tilted in the spin group
  dipole.rotation.z = TILT
  spin.add(dipole)
  const jupiter = new THREE.Group()
  jupiter.position.set(GLOBE.x, GLOBE.y, GLOBE.z)
  jupiter.add(spin)
  root.add(jupiter)
  const CUT = (80 * Math.PI) / 180
  {
    // the face: the picture's bands, the Great Red Spot, dimmed a touch
    const faceTex = canvasTex(1024, 512, (g, w, h) => {
      const bands = [[-1.0, '#c2ac8c'], [-0.82, '#a87a58'], [-0.66, '#c8b494'], [-0.5, '#9a6444'], [-0.34, '#cab896'], [-0.16, '#b48c6c'], [0.02, '#ccb896'], [0.16, '#985f40'], [0.34, '#c4ae8c'], [0.5, '#a06c4c'], [0.66, '#c6b292'], [0.82, '#9a6c4e'], [1.0, '#b49e7e']]
      const yOf = v => (0.5 + Math.asin(clamp(v, -1, 1)) / Math.PI) * h
      for (let i = 0; i < bands.length - 1; i++) {
        const [v0, c0] = bands[i]
        const [v1] = bands[i + 1]
        g.fillStyle = c0
        g.beginPath()
        for (let x = 0; x <= w; x += 8) g.lineTo(x, yOf(v0) + Math.sin(x / 40 + v0 * 9) * 4)
        for (let x = w; x >= 0; x -= 8) g.lineTo(x, yOf(v1) + Math.sin(x / 36 + v1 * 7) * 4)
        g.fill()
      }
      // wisps along the band edges
      g.globalAlpha = 0.25
      for (let k = 0; k < 140; k++) {
        const x = hash(5, k) * w
        const y = hash(5, k, 1) * h
        g.fillStyle = hash(5, k, 2) < 0.5 ? '#e8dcc0' : '#7a4a30'
        g.beginPath()
        g.ellipse(x, y, 20 + hash(5, k, 3) * 40, 2 + hash(5, k, 4) * 3, 0, 0, TAU)
        g.fill()
      }
      g.globalAlpha = 1
      const gx = w * 0.3
      const gy = yOf(0.36)
      g.fillStyle = '#d8c0a0'
      g.beginPath()
      g.ellipse(gx, gy, 52, 24, 0, 0, TAU)
      g.fill()
      g.fillStyle = '#c0482a'
      g.beginPath()
      g.ellipse(gx, gy, 40, 17, 0, 0, TAU)
      g.fill()
      g.fillStyle = 'rgba(58,42,64,0.12)'
      g.fillRect(0, 0, w, h)
    })
    textures.push(faceTex)
    const face = new THREE.Mesh(new THREE.SphereGeometry(GLOBE.r, 64, 40, CUT / 2, TAU - CUT), new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.75, emissive: '#ffffff', emissiveMap: faceTex, emissiveIntensity: 0.18 }))
    spin.add(face)
    // the cut faces: the layers as the picture shows them
    const capTex = canvasTex(512, 512, (g, w) => {
      const c = w / 2
      const ring = (r0, r1, stops) => {
        const grd = g.createRadialGradient(c, c, r0 * c, c, c, r1 * c)
        stops.forEach(([k, col]) => grd.addColorStop(k, col))
        g.fillStyle = grd
        g.beginPath()
        g.arc(c, c, r1 * c, 0, TAU)
        g.arc(c, c, r0 * c, 0, TAU, true)
        g.fill()
      }
      ring(0.96, 1.0, [[0, '#e8c8a0'], [1, '#d8b088']])
      ring(0.8, 0.96, [[0, '#1e4a8a'], [1, '#5a8ad0']])
      ring(0.0, 0.8, [[0, '#a8704a'], [0.42, '#8a5a44'], [0.52, '#6a7aa8'], [0.75, '#9aa8d0'], [1, '#5a6aa0']])
      // hydrogen molecules in the fluid, protons and electrons in the metal
      for (let k = 0; k < 70; k++) {
        const a = hash(6, k) * TAU
        const r = (0.82 + 0.12 * hash(6, k, 1)) * c
        const x = c + Math.cos(a) * r
        const y = c + Math.sin(a) * r
        g.fillStyle = '#cfd6e0'
        g.beginPath()
        g.arc(x - 3, y, 4, 0, TAU)
        g.arc(x + 3, y, 4, 0, TAU)
        g.fill()
      }
      for (let k = 0; k < 120; k++) {
        const a = hash(7, k) * TAU
        const r = (0.45 + 0.33 * hash(7, k, 1)) * c
        g.fillStyle = k % 2 ? '#ff5a55' : '#8fe4ff'
        g.beginPath()
        g.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, k % 2 ? 4 : 2.6, 0, TAU)
        g.fill()
      }
    })
    textures.push(capTex)
    const capMat = new THREE.MeshStandardMaterial({ map: capTex, roughness: 0.6, side: THREE.DoubleSide, emissive: '#ffffff', emissiveMap: capTex, emissiveIntensity: 0.35 })
    for (const phi of [CUT / 2, TAU - CUT / 2]) {
      const cap = new THREE.Mesh(new THREE.CircleGeometry(GLOBE.r, 48, -Math.PI / 2, Math.PI), capMat)
      cap.rotation.y = phi + Math.PI
      spin.add(cap)
    }
    // the metal's glow: currents brightening when the magnet shows
    const metalMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#9fc0ff').multiplyScalar(1.4), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
    for (const phi of [CUT / 2, TAU - CUT / 2]) {
      const m = new THREE.Mesh(new THREE.RingGeometry(GLOBE.r * 0.42, GLOBE.r * 0.8, 40, 1, -Math.PI / 2, Math.PI), metalMat)
      m.rotation.y = phi + Math.PI
      m.position.set(-Math.sin(phi + Math.PI) * 0.004, 0, -Math.cos(phi + Math.PI) * 0.004)
      spin.add(m)
    }
    jupiter.userData.metalMat = metalMat
    const halo = sprite('#ffb08a', 0.5, 0.35)
    halo.scale.setScalar(GLOBE.r * 3.1)
    jupiter.add(halo)
    // the stand under it
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, GLOBE.y - GLOBE.r - 0.05, 10), mats.brass)
    stem.position.set(GLOBE.x, (GLOBE.y - GLOBE.r - 0.05) / 2, GLOBE.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.08, 32), mats.dark)
    foot.position.set(GLOBE.x, 0.04, GLOBE.z)
    const cradle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 32), mats.brass)
    cradle.rotation.x = Math.PI / 2
    cradle.position.set(GLOBE.x, GLOBE.y - GLOBE.r - 0.04, GLOBE.z)
    root.add(stem, foot, cradle)
    solids.push(circle(GLOBE.x, GLOBE.z, 0.6))
  }
  const globeHit = new THREE.Mesh(new THREE.SphereGeometry(GLOBE.r * 1.04, 20, 14), ghost)
  jupiter.add(globeHit)
  const labelsJ = [[E.magnet.labels.north, 1], [E.magnet.labels.south, -1]].map(([txt, s]) => {
    const t = sign(txt, 0.09, { color: '#ffe2c8' })
    // the south one below and a little toward the visitor, clear of the stand
    t.position.set(GLOBE.x - (s < 0 ? 0.5 : 0), GLOBE.y + s * (GLOBE.r + (s < 0 ? 0.12 : 0.16)), GLOBE.z + (s < 0 ? 0.25 : 0))
    root.add(t)
    return t
  })
  // the field lines, in the dipole's frame
  const fieldMat = fieldMaterial('#c49cff')
  const fieldLines = new THREE.Group()
  for (const L of [1.5, 2.1, 3.0]) {
    for (let k = 0; k < 6; k++) {
      const pts = fieldLine(GLOBE.r * 1.01, L, (k / 6) * TAU + L)
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.007, 5, false)
      geos.push(g)
      fieldLines.add(new THREE.Mesh(g, fieldMat))
    }
  }
  fieldLines.visible = false
  dipole.add(fieldLines)
  // the auroral ovals round both magnetic poles
  const auroraMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7ad8').multiplyScalar(1.8), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const ovals = [1, -1].map(s => {
    const o = new THREE.Mesh(new THREE.TorusGeometry(GLOBE.r * Math.sin(AURORA_C), 0.016, 8, 48), auroraMat)
    o.rotation.x = Math.PI / 2
    o.position.y = s * GLOBE.r * Math.cos(AURORA_C) * 1.012
    const haze = sprite('#ff7ad8', 1.2, 0)
    haze.position.y = o.position.y + s * 0.02
    haze.scale.setScalar(GLOBE.r * 0.7)
    dipole.add(o, haze)
    return { o, haze }
  })
  // Io, its torus of plasma, its flux tube and its footprints
  const io = new THREE.Group()
  const ioTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#e2c95e'
    g.fillRect(0, 0, w, h)
    for (let k = 0; k < 40; k++) {
      g.fillStyle = ['#c87a2a', '#a85a2a', '#f4e8a0', '#3a2a1a'][k % 4]
      g.beginPath()
      g.arc(hash(9, k) * w, hash(9, k, 1) * h, 2 + hash(9, k, 2) * 7, 0, TAU)
      g.fill()
    }
  })
  textures.push(ioTex)
  const ioBall = new THREE.Mesh(new THREE.SphereGeometry(IO.size, 20, 14), new THREE.MeshStandardMaterial({ map: ioTex, roughness: 0.8, emissive: '#ffffff', emissiveMap: ioTex, emissiveIntensity: 0.25 }))
  const ioHit = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), ghost)
  const plumes = Array.from({ length: 3 }, (_, k) => {
    const s = sprite(['#bfe0ff', '#ffe08a', '#bfe0ff'][k], 1.3, 0)
    io.add(s)
    return s
  })
  io.add(ioBall, ioHit)
  root.add(io)
  const ioLabel = sign(E.magnet.labels.io, 0.08, { color: '#ffe9a0' })
  root.add(ioLabel)
  const torus = new THREE.Mesh(new THREE.TorusGeometry(IO.r, 0.05, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff8a7a').multiplyScalar(1.2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  torus.rotation.x = Math.PI / 2
  torus.position.set(GLOBE.x, GLOBE.y, GLOBE.z)
  root.add(torus)
  const BEADS = 26
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb0ec').multiplyScalar(1.6), transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }), BEADS)
  beads.frustumCulled = false
  beads.raycast = () => {}
  beads.visible = false
  root.add(beads)
  const feet = [1, -1].map(() => {
    const s = sprite('#ffd0f4', 2.2, 0)
    s.scale.setScalar(0.12)
    dipole.add(s)
    return s
  })
  // the side table: the compass and the little Earth
  const compassNeedle = new THREE.Group()
  const earth = new THREE.Group()
  const earthLines = new THREE.Group()
  const earthFieldMat = fieldMaterial('#8fd0ff')
  earthFieldMat.uniforms.uDash.value = 4
  const COMPASS = new THREE.Vector3(TABLE.x - 0.18, TABLE.top + 0.16, TABLE.z - 0.1)
  const EARTH_R = GLOBE.r / 11.2
  const EARTH_AT = new THREE.Vector3(TABLE.x + 0.2, TABLE.top + 0.26, TABLE.z + 0.12)
  {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.04, 28), mats.metal)
    top.position.set(TABLE.x, TABLE.top - 0.02, TABLE.z)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, TABLE.top - 0.04, 10), mats.dark)
    stem.position.set(TABLE.x, (TABLE.top - 0.04) / 2, TABLE.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.04, 20), mats.dark)
    foot.position.set(TABLE.x, 0.02, TABLE.z)
    root.add(top, stem, foot)
    solids.push(circle(TABLE.x, TABLE.z, 0.4))
    // the compass: a needle free to turn every way, in a glass ball on a brass ring
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), edgeGlass({ color: '#dceeff', edge: 0.7, base: 0.04 }))
    ball.position.copy(COMPASS)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 24), mats.brass)
    ring.rotation.x = Math.PI / 2
    ring.position.copy(COMPASS).setY(TABLE.top + 0.05)
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.03, 0.06, 8), mats.brass)
    ped.position.copy(COMPASS).setY(TABLE.top + 0.03)
    const north = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.09, 10), new THREE.MeshStandardMaterial({ color: '#e0453a', emissive: '#a02018', emissiveIntensity: 0.6, roughness: 0.4 }))
    north.position.y = 0.045
    const south = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.09, 10), new THREE.MeshStandardMaterial({ color: '#e8ecf4', roughness: 0.4 }))
    south.position.y = -0.045
    south.rotation.z = Math.PI
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), mats.brass)
    compassNeedle.add(north, south, pin)
    compassNeedle.position.copy(COMPASS)
    compassNeedle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0))
    root.add(ball, ring, ped, compassNeedle)
    const lbl = sign(E.magnet.labels.compass, 0.05, { color: '#d8e6ff' })
    lbl.position.copy(COMPASS).add(new THREE.Vector3(0, -0.11, 0.17))
    lbl.rotation.x = -0.6
    root.add(lbl)
    // the Earth, to scale, on a thin rod
    const earthTex = canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#2a64c8'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#4aa064'
      for (const [x, y, rx, ry] of [[0.2, 0.35, 0.08, 0.12], [0.28, 0.65, 0.05, 0.14], [0.52, 0.3, 0.1, 0.1], [0.55, 0.6, 0.06, 0.12], [0.75, 0.35, 0.12, 0.1], [0.85, 0.7, 0.05, 0.05]]) {
        g.beginPath()
        g.ellipse(x * w, y * h, rx * w, ry * h, 0, 0, TAU)
        g.fill()
      }
      g.fillStyle = '#f0f4ff'
      g.fillRect(0, 0, w, h * 0.06)
      g.fillRect(0, h * 0.94, w, h * 0.06)
    })
    textures.push(earthTex)
    const ball2 = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 24, 16), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.6, emissive: '#ffffff', emissiveMap: earthTex, emissiveIntensity: 0.3 }))
    const halo = sprite('#7fc0ff', 1.0, 0.45)
    halo.scale.setScalar(EARTH_R * 3.2)
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), ghost)
    earth.add(ball2, halo, hit)
    // Earth's field lines: its moment points south, so they run from south to north
    const tiltE = new THREE.Group()
    tiltE.rotation.z = Math.PI + (11 * Math.PI) / 180
    for (const L of [1.8, 2.6]) {
      for (let k = 0; k < 5; k++) {
        const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fieldLine(EARTH_R * 1.02, L, (k / 5) * TAU)), 32, 0.0025, 4, false)
        geos.push(g)
        tiltE.add(new THREE.Mesh(g, earthFieldMat))
      }
    }
    earthLines.add(tiltE)
    earthLines.visible = false
    earth.add(earthLines)
    earth.position.copy(EARTH_AT)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, EARTH_AT.y - TABLE.top - EARTH_R, 6), mats.brass)
    rod.position.set(EARTH_AT.x, (EARTH_AT.y - EARTH_R + TABLE.top) / 2, EARTH_AT.z)
    root.add(earth, rod)
  }
  const earthLabel = sign(E.magnet.labels.earth, 0.06, { color: '#bfe0ff' })
  earthLabel.position.copy(EARTH_AT).add(new THREE.Vector3(0, 0.14, 0))
  root.add(earthLabel)

  const magnetPanel = lv => ({
    title: E.magnet.title,
    color,
    blocks: [
      { buttons: [['field', 'jupiter'], ['aurora', 'pole'], ['io', 'io'], ['earth', 'earth']].map(([k, step]) => ({ label: E.magnet.buttons[k], onClick: () => magnetStep(step) })) },
      ...paras(E.magnet.panel, lv),
    ],
  })
  function magnetStep(what) {
    const lv = level()
    const S = E.magnet.says
    const key = { jupiter: 'f', pole: 'a', io: 'i', earth: 'e' }[what]
    if (!key) return
    M[key] = M[key] ? 0 : 1
    const line = { f: ['fieldOn', 'fieldOff'], a: ['auroraOn', 'auroraOff'], i: ['ioOn', 'ioOff'], e: ['earthOn', 'earthOff'] }[key][M[key] ? 0 : 1]
    say(at(S[line], lv))
    play(M[key] ? 'select' : 'tap')
    ex.discover('magnet', magnetPanel, 4.5)
    share('magnet')
  }
  // a tap on the globe: near a pole (above 50° of latitude), the auroras; elsewhere, the magnet
  clickable(jupiter, hit => {
    const y = (hit.point.y - GLOBE.y) / GLOBE.r
    magnetStep(Math.abs(y) > 0.77 ? 'pole' : 'jupiter')
  }, { reach: 4.5, accept: h => h.object === globeHit })
  clickable(io, () => magnetStep('io'), { reach: 5 })
  clickable(earth, () => magnetStep('earth'), { reach: 4.5 })
  ex.add({
    id: 'magnet',
    x: 2.75,
    z: -0.3,
    radius: 1.9,
    manual: true,
    label: E.magnet.label,
    verb: () => {
      const h = E.magnet.hints
      if (!M.f) return h.field
      if (!M.a) return h.pole
      if (!M.i) return h.io
      if (!M.e) return h.earth
      return h.again
    },
    focus: { x: GLOBE.x - 0.4, y: 1.4, z: GLOBE.z - 0.7, size: 2.3, width: 4.6 },
    act: () => ctx.showPanel(magnetPanel),
  })
  const tmpV = new THREE.Vector3()
  const tmpQ = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const mWorld = new THREE.Vector3()
  const ioLocal = new THREE.Vector3()
  const curve = (s, footL, ioL) => {
    // from the footprint (s = 0) to Io (s = 1), bulging like a field line
    const lamF = Math.PI / 2 - FOOT_C
    const rIo = ioL.length()
    const lamIo = Math.asin(clamp(ioL.y / rIo, -1, 1))
    const phi = Math.atan2(ioL.z, ioL.x)
    const sgn = Math.sign(footL.y) || 1
    const lam = lerp(sgn * lamF, lamIo, s)
    const c2 = Math.cos(lam) ** 2
    const cF = Math.cos(lamF) ** 2
    const cI = Math.cos(lamIo) ** 2
    const rr = lerp(GLOBE.r * 1.01, rIo, clamp((c2 - cF) / Math.max(1e-3, cI - cF)))
    return tmpV.set(rr * Math.cos(lam) * Math.cos(phi), rr * Math.sin(lam), rr * Math.cos(lam) * Math.sin(phi))
  }
  updates.push((dt, t) => {
    const now = Date.now() / 1000
    spin.rotation.y = ((now / SPIN_S) % 1) * TAU
    for (const k of ['f', 'a', 'i', 'e']) mk[k] = damp(mk[k], M[k], 2.2, dt)
    // the field lines grow out, the dashes run north to south
    fieldMat.uniforms.uGrow.value = mk.f
    fieldMat.uniforms.uTime.value = t
    fieldLines.visible = mk.f > 0.01
    jupiter.userData.metalMat.opacity = mk.f * (0.25 + 0.12 * Math.sin(t * 3.1) + 0.08 * Math.sin(t * 7.3))
    // the auroras
    auroraMat.opacity = mk.a * (0.75 + 0.2 * Math.sin(t * 2.3))
    for (const o of ovals) {
      o.o.visible = mk.a > 0.01
      o.haze.material.opacity = mk.a * 0.55
    }
    // Io, round in the equator's plane
    const ia = ((now / IO_S) % 1) * TAU
    io.position.set(GLOBE.x + Math.cos(ia) * IO.r, GLOBE.y, GLOBE.z - Math.sin(ia) * IO.r)
    ioBall.rotation.y = -ia
    plumes.forEach((p, k) => {
      const u = (t * 0.7 + k / 3) % 1
      const a = k * 2.1
      p.position.set(Math.cos(a) * IO.size, IO.size * (0.5 + 0.6 * u) * (k === 1 ? -1 : 1) * 0.6 + 0.02, Math.sin(a) * IO.size)
      p.scale.setScalar(0.04 + u * 0.08)
      p.material.opacity = mk.i * Math.sin(Math.PI * u) * 0.9
    })
    ioLabel.position.copy(io.position).add(new THREE.Vector3(0, 0.17, 0))
    ioLabel.quaternion.copy(ctx.camera.quaternion)
    torus.material.opacity = mk.i * 0.05
    torus.visible = mk.i > 0.01
    // the flux tube and the footprints, in the dipole's frame
    beads.visible = feet[0].visible = feet[1].visible = mk.i > 0.01
    if (mk.i > 0.01) {
      jupiter.updateMatrixWorld(true)
      ioLocal.copy(io.position)
      dipole.worldToLocal(ioLocal)
      const phi = Math.atan2(ioLocal.z, ioLocal.x)
      feet.forEach((f, k) => {
        const s = k ? -1 : 1
        f.position.set(GLOBE.r * 1.02 * Math.sin(FOOT_C) * Math.cos(phi), s * GLOBE.r * 1.02 * Math.cos(FOOT_C), GLOBE.r * 1.02 * Math.sin(FOOT_C) * Math.sin(phi))
        f.material.opacity = mk.i * (0.8 + 0.2 * Math.sin(t * 6 + k))
      })
      const half = BEADS / 2
      for (let b = 0; b < BEADS; b++) {
        const k = b < half ? 0 : 1
        const s = ((b % half) + 0.5) / half
        const p = curve(s, feet[k].position, ioLocal)
        dipole.localToWorld(p)
        dummy.position.copy(p)
        dummy.rotation.set(0, 0, 0)
        const flow = 0.5 + 0.5 * Math.sin(s * 12 - t * 5)
        dummy.scale.setScalar(0.012 + 0.01 * flow * mk.i)
        dummy.updateMatrix()
        beads.setMatrixAt(b, dummy.matrix)
      }
      beads.instanceMatrix.needsUpdate = true
      beads.material.opacity = mk.i * 0.9
    }
    // the compass: along the model's field where it stands (a compass's red end points along the field),
    // resting level when the magnet is hidden
    dipole.getWorldQuaternion(tmpQ)
    mWorld.copy(up).applyQuaternion(tmpQ)
    const r = tmpV.copy(COMPASS).sub(jupiter.position).normalize()
    const B = r.multiplyScalar(3 * mWorld.dot(r)).sub(mWorld).normalize()
    const rest = new THREE.Vector3(Math.cos(t * 0.3) * 0.2 + 1, 0, Math.sin(t * 0.3) * 0.2).normalize()
    const want = rest.lerp(B, mk.f).normalize()
    tmpQ.setFromUnitVectors(up, want)
    compassNeedle.quaternion.slerp(tmpQ, 1 - Math.exp(-3 * dt))
    // the Earth and its small field
    earth.rotation.y = t * 0.4
    earthLines.visible = mk.e > 0.01
    earthFieldMat.uniforms.uGrow.value = mk.e
    earthFieldMat.uniforms.uTime.value = t
    for (const l of [...labelsJ, earthLabel]) l.quaternion.copy(ctx.camera.quaternion)
  })
  const magnetState = () => ({ f: M.f, a: M.a, i: M.i, e: M.e })
  const magnetSet = (s, liveSet) => {
    for (const k of ['f', 'a', 'i', 'e']) {
      M[k] = s?.[k] ? 1 : 0
      if (!liveSet) mk[k] = M[k]
    }
  }

  // ======================================================================================================
  // words that follow the depth switch, the stage
  // ======================================================================================================
  updates.push((dt, t) => {
    const lv = level()
    if (lv !== shownLevel) {
      shownLevel = lv
      for (const [o, k] of byLevel) o.visible = depthOf(lv) === k
      boardDirty = true
      chartDirty = true
    }
    stage.update(dt, t)
  })
  drawBoard()
  drawHelium()
  drawDetector()
  drawChart()

  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.6 },
    // high enough to look up the cables at the parachute
    cameraPitchMax: 0.75,
    spawn: { x: 0, z: 4.4, yaw: 0 },
    hostSpot: { x: 2.3, z: 3.2, yaw: Math.atan2(2.3, -1.2) },
    back: { x: 0, z: 7.3, rot: Math.PI },
    // the easel on the left of the arrival, clear of the stations' lines of sight
    stand: { x: -2.7, z: 4.3, rot: Math.atan2(2.7, 0.6) },
    parts: {
      descent: {
        tap: what => descentStep(what), // 'sink' (the red handle), 'helium', 'lightning', 'probe'
        set: v => setDepth(v), // the panel's slider (km)
        get depth() {
          return depth
        },
        get target() {
          return D.target
        },
        get probe() {
          return probeState
        },
        stops: STOP_D,
      },
      squeeze: {
        tap: what => squeezeStep(what), // 'gun' (the gun or its chamber), 'flask'
        set: v => setPress(v), // the panel's slider (million bar)
        get state() {
          return squeezeState()
        },
        get busy() {
          return !!shot
        },
      },
      magnet: {
        tap: what => magnetStep(what), // 'jupiter', 'pole', 'io', 'earth'
        get state() {
          return magnetState()
        },
      },
      // points to aim a real tap at (with rayTo): __ew.world.onTap(p.rayTo(p.at.handle()))
      at: {
        handle: () => world(handle).add(new THREE.Vector3(0, 0.35, 0)),
        helium: () => world(helium).add(new THREE.Vector3(0, 0.25, 0)),
        lightning: () => world(detector).add(new THREE.Vector3(0.3, 0.4, 0)),
        probe: () => world(probe).add(new THREE.Vector3(0, 0.3, 0)),
        gun: () => new THREE.Vector3(BENCH.x, GUN_Y, 0.8),
        flask: () => world(flask).add(new THREE.Vector3(0, 0.25, 0)),
        jupiter: () => new THREE.Vector3(GLOBE.x - GLOBE.r * 0.9, GLOBE.y, GLOBE.z + 0.2),
        pole: () => new THREE.Vector3(GLOBE.x - 0.1, GLOBE.y + GLOBE.r * 0.95, GLOBE.z + 0.1),
        io: () => io.position.clone(),
        earth: () => EARTH_AT.clone(),
      },
      rayTo,
    },
    panels: { descent: descentPanel, squeeze: squeezePanel, magnet: magnetPanel },
    shared: {
      descent: { get: descentState, set: descentSet },
      squeeze: { get: squeezeState, set: squeezeSet },
      magnet: { get: magnetState, set: magnetSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const g of geos) g.dispose()
    },
  }
}
