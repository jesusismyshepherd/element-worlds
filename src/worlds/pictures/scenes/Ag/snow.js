// Silver's picture "Can people make it snow?" as a room (docs/knowledge/picture-rooms.md): the summit of
// Mount Greylock on a cold November morning (stages/greylock.js: frosted grass, bare trees, the memorial tower
// with its lamp, a cloud deck lying above). Three things to do, each chosen by tapping its thing (the user's
// rule, docs/knowledge/adding-a-wing.md "Look and feel"); E opens the station's panel, whose slider and buttons
// do the same. All of it is shared in a room (src/net/shared.js).
// - Schaefer's cold box (the hut, on the right), a freezer cut open at the front: tap the breathing tube and a
//   cloud of droplets fills it; a lens shows they are still liquid below 0 C. Tap a jar to drop its dust in:
//   talc, salt, ash and soot do nothing; dry ice freezes the cloud at once; silver iodide does too, but only
//   below about -4 C. A slider sets the box's temperature (0 to -40 C: near -38 C the droplets freeze by
//   themselves). Tap the lid to clear the box.
// - Two crystals (the bench, on the left): a layer of ice (rings of water molecules) on a stand beside a
//   layer of silver iodide (silver and iodine in rings of six) and a crystal of salt. Tap silver iodide: the
//   ice slides onto it, hexagon on hexagon (0.452 against 0.459 nm, 1.5% apart). Tap the salt: it does not fit.
// - Seed the cloud (the sky): tap the plane and it scatters dry ice along its track for seven seconds; the
//   cloud turns to ice there and curtains of snow hang under it and fade before the ground, as on 13 November
//   1946. Tap the burner on the slope: silver iodide smoke rises into the cloud and a little snow follows, but
//   only when the cloud (a slider) is colder than about -4 C. A signpost says how much more snow: a little.
// Everything the plane and the burner do is a function of the wall clock (the plane's place, the curtains), so
// every screen in a room sees the same, and a newcomer sees what is going on. `parts.<station>` does what a tap
// does, for the probes; `parts.at.<thing>()` gives a point to aim a real tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, fill, random } from '../../../wings/noble/kit.js'
import { greylockStage, cloudDeck } from '../../stages/greylock.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { SNOW_WORDS } from './snow.words.js'

export const WORDS = SNOW_WORDS

const TAU = Math.PI * 2
const V = (x, y, z) => new THREE.Vector3(x, y, z)
const wall = () => Date.now() / 1000

// where things stand
const HUT = { x: 6.2, z: -4.0, rot: -0.5 }
const BENCH = { x: -5.4, z: -2.6, rot: 0.55 }
const BURNER = { x: 0.8, z: -7.4 }
const SIGN = { x: 2.9, z: -7.0 }
// the plane's racetrack over the cloud deck, and what it does when tapped
const LOOP = { cx: 0.5, cz: -14, rx: 8.5, rz: 5, y: 8.2, w: 0.4 }
const DISP = 7 // seconds of dry ice
const planeAt = (t, out = V(0, 0, 0)) => out.set(LOOP.cx + LOOP.rx * Math.cos(LOOP.w * t), LOOP.y, LOOP.cz + LOOP.rz * Math.sin(LOOP.w * t))
const planeYaw = t => Math.atan2(-LOOP.rz * Math.cos(LOOP.w * t) * LOOP.w, -LOOP.rx * Math.sin(LOOP.w * t) * LOOP.w)
const DECK_Y = 6.5
// the box
const T_MIN = -40
const T_SELF = -38
const T_AGI = -4
const BOX_T0 = -15
const SNOW_T = 9
// the model's cold-box temperature scale, drawn on the thermometer
const fmtT = (t, lang) => `${(Math.round(t * 10) / 10).toFixed(Math.abs(t % 1) < 0.05 ? 0 : 1).replace('.', lang === 'pt-pt' || lang === 'pl' || lang === 'de' ? ',' : '.')}`.replace('-', '−')

// ---- small shaders: falling flakes, rising smoke, twinkling crystals ----

const FLAKE_VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uT; uniform float uK; uniform float uPx; uniform float uSize; uniform float uSpeed; uniform float uH;
  uniform float uSway; uniform float uSlant; uniform float uFade; uniform float uRise; uniform float uGrow; uniform float uTw;
  varying float vA;
  void main() {
    float f = fract(aSeed + uT * uSpeed / uH);
    vec3 p = position;
    p.y = position.y + (uRise > 0.5 ? f * uH : -f * uH);
    p.x += sin(uT * 0.9 + aSeed * 37.0) * uSway + f * uH * uSlant;
    p.z += cos(uT * 0.7 + aSeed * 21.0) * uSway;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = uTw > 0.5 ? pow(0.5 + 0.5 * sin(uT * (3.0 + aSeed * 7.0) + aSeed * 60.0), 2.0) : 1.0;
    float near = smoothstep(0.6, 2.2, -mv.z);
    gl_PointSize = uSize * (uTw > 0.5 ? 0.35 + 1.1 * tw : 1.0) * (uGrow > 0.5 ? 0.5 + 1.4 * f : 1.0) * uPx / max(-mv.z, 0.1);
    vA = uK * near * smoothstep(0.0, 0.1, f) * (1.0 - smoothstep(1.0 - uFade, 1.0, f)) * (uTw > 0.5 ? 0.25 + tw : 1.0);
  }`
const FLAKE_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uGlow;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float a = (1.0 - smoothstep(0.15, 1.0, r)) * vA;
    gl_FragColor = vec4(uColor * uGlow, a);
  }`

/** A field of points in a box (x and z of width w and depth d from the middle, y from 0 up or down by h) that
 *  fall (or rise) and wrap round; `k` (0 to 1) is how many show. `tw` makes them twinkle in place. */
function flakeField({ count, w, d, h, y = 0, speed = 0.8, size = 0.08, color = '#e4edf9', glow = 1, sway = 0.25, slant = 0, fade = 0.4, rise = false, grow = false, tw = false, additive = false, seed = 1, shape = null }) {
  const rnd = random(seed)
  const pos = new Float32Array(count * 3)
  const sd = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    if (shape) pos.set(shape(rnd), i * 3)
    else pos.set([(rnd() - 0.5) * w, y, (rnd() - 0.5) * d], i * 3)
    sd[i] = rnd()
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(sd, 1))
  const u = {
    uT: { value: 0 }, uK: { value: 0 }, uPx: { value: 500 }, uSize: { value: size }, uSpeed: { value: speed }, uH: { value: h }, uSway: { value: sway },
    uSlant: { value: slant }, uFade: { value: fade }, uRise: { value: rise ? 1 : 0 }, uGrow: { value: grow ? 1 : 0 }, uTw: { value: tw ? 1 : 0 },
    uColor: { value: new THREE.Color(color) }, uGlow: { value: glow },
  }
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: FLAKE_VERT, fragmentShader: FLAKE_FRAG, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  points.raycast = () => {}
  return { points, u, dispose: () => (geo.dispose(), mat.dispose()) }
}

// ---- the wood, the velvet and the enamel ----

function woodTexture(seed, planks = 8, vertical = true) {
  return canvasTex(256, 256, (g, w) => {
    const rnd = random(seed)
    g.fillStyle = '#8c6c4a'
    g.fillRect(0, 0, w, w)
    const pw = w / planks
    for (let i = 0; i < planks; i++) {
      const sh = 0.82 + rnd() * 0.3
      g.fillStyle = `rgba(${Math.round(150 * sh)},${Math.round(112 * sh)},${Math.round(74 * sh)},1)`
      if (vertical) g.fillRect(i * pw, 0, pw, w)
      else g.fillRect(0, i * pw, w, pw)
      g.strokeStyle = 'rgba(60,40,24,0.5)'
      g.lineWidth = 3
      g.beginPath()
      if (vertical) (g.moveTo(i * pw, 0), g.lineTo(i * pw, w))
      else (g.moveTo(0, i * pw), g.lineTo(w, i * pw))
      g.stroke()
      g.strokeStyle = 'rgba(70,48,30,0.22)'
      g.lineWidth = 1
      for (let k = 0; k < 5; k++) {
        const o = i * pw + rnd() * pw
        g.beginPath()
        if (vertical) (g.moveTo(o, 0), g.bezierCurveTo(o + 3, w * 0.3, o - 3, w * 0.6, o, w))
        else (g.moveTo(0, o), g.bezierCurveTo(w * 0.3, o + 3, w * 0.6, o - 3, w, o))
        g.stroke()
      }
    }
    // a little frost along the seams
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(214,228,240,${0.15 + rnd() * 0.3})`
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  })
}

/** A soft round glow texture. */
function glowTexture() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.4, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** The curtain of falling snow's streaks: strong under the cloud, gone before the ground. */
function streakTexture() {
  return canvasTex(128, 256, (g, w, h) => {
    const rnd = random(12)
    g.clearRect(0, 0, w, h)
    for (let i = 0; i < 26; i++) {
      const x = rnd() * w
      const len = h * (0.35 + rnd() * 0.5)
      const grd = g.createLinearGradient(0, 0, 0, len)
      grd.addColorStop(0, `rgba(235,242,252,${0.25 + rnd() * 0.3})`)
      grd.addColorStop(1, 'rgba(235,242,252,0)')
      g.fillStyle = grd
      g.fillRect(x, 0, 2 + rnd() * 5, len)
    }
    // soft at the sides
    g.globalCompositeOperation = 'destination-in'
    const side = g.createLinearGradient(0, 0, w, 0)
    side.addColorStop(0, 'rgba(0,0,0,0)')
    side.addColorStop(0.25, 'rgba(0,0,0,1)')
    side.addColorStop(0.75, 'rgba(0,0,0,1)')
    side.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = side
    g.fillRect(0, 0, w, h)
    g.globalCompositeOperation = 'source-over'
  })
}

// ---- crystal models ----

const A1 = [1, 0]
const A2 = [0.5, Math.sqrt(3) / 2]
/** The points of a honeycomb layer of lattice constant `a`, nx by ny cells, centred: { A: [[x, y]], B: [[x, y]],
 *  bonds: [[a, b]] } (A at the lattice points, B a third of the way along both axes). */
function honeycomb(a, nx, ny) {
  const A = []
  const B = []
  const bonds = []
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const px = (i * A1[0] + j * A2[0]) * a
      const py = (i * A1[1] + j * A2[1]) * a
      const bx = px + ((A1[0] + A2[0]) / 3) * a
      const by = py + ((A1[1] + A2[1]) / 3) * a
      A.push([px, py])
      B.push([bx, by])
      const k = A.length - 1
      bonds.push([`A${k}`, `B${k}`, 0])
      // B's other two neighbours: the A one cell back along each axis
      if (i > 0) bonds.push([`A${k - 1}`, `B${k}`, 1])
      if (j > 0) bonds.push([`A${k - nx}`, `B${k}`, 2])
    }
  }
  const all = [...A, ...B]
  const cx = (Math.min(...all.map(p => p[0])) + Math.max(...all.map(p => p[0]))) / 2
  const cy = (Math.min(...all.map(p => p[1])) + Math.max(...all.map(p => p[1]))) / 2
  const mv = ps => ps.map(([x, y]) => [x - cx, y - cy])
  return { A: mv(A), B: mv(B), bonds }
}

const sphereGeo = new THREE.SphereGeometry(1, 20, 14)
const stickGeo = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true)

/** A ball-and-stick bond from p to q (a Mesh with the shared stick geometry). */
function stick(p, q, r, mat) {
  const d = q.clone().sub(p)
  const m = new THREE.Mesh(stickGeo, mat)
  m.position.copy(p).addScaledVector(d, 0.5)
  m.scale.set(r, d.length(), r)
  m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize())
  return m
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable }) {
  const stage = greylockStage({ radius: 12, light, tower: { x: -9.5, z: -9 } })
  root.add(stage.group)
  const solids = stage.solids
  // a clear cold morning: the haze starts far off, so the plane and the cloud's far end can be seen
  stage.env.fog.near = 45
  stage.env.fog.far = 140
  const deck = cloudDeck({ light, y: DECK_Y, z0: -27, z1: -7, count: 96 })
  root.add(deck.group)
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const textures = []
  const lang = ctx.lang?.() ?? 'en'
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  const tex = t => (textures.push(t), t)
  const lv = () => level()
  const nm = v => (lang === 'en' ? v : v.replace('.', ','))

  // materials shared by the hut and the bench
  const wood = new THREE.MeshStandardMaterial({ map: tex(woodTexture(3, 9)), roughness: 0.9 })
  const woodH = new THREE.MeshStandardMaterial({ map: tex(woodTexture(6, 6, false)), roughness: 0.9 })
  const metal = new THREE.MeshStandardMaterial({ color: '#7d8590', roughness: 0.55, metalness: 0.4 })
  const enamel = new THREE.MeshStandardMaterial({ color: '#b9c0cb', roughness: 0.45, metalness: 0.15 })
  const velvet = new THREE.MeshStandardMaterial({ color: '#08080d', roughness: 1 })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#cfe6ff', transparent: true, opacity: 0.05, roughness: 0.4, envMapIntensity: 0, depthWrite: false, side: THREE.DoubleSide })
  const navy = new THREE.MeshStandardMaterial({ color: '#1b2347', roughness: 0.5, metalness: 0.2, emissive: '#0d1233', emissiveIntensity: 0.6 })
  const rim = new THREE.MeshStandardMaterial({ color: '#5fd3ff', emissive: '#5fd3ff', emissiveIntensity: 0.9, roughness: 0.4 })
  disposers.push(() => [wood, woodH, metal, enamel, velvet, glassMat, navy, rim].forEach(m => m.dispose()))
  const bx = (w, h, d, mat, x, y, z, parent) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.set(x, y, z)
    m.castShadow = true
    m.receiveShadow = true
    parent.add(m)
    return m
  }
  const glow = tex(glowTexture())

  // =================================================================================================
  // Station 1: Schaefer's cold box, in the hut
  // =================================================================================================
  const hut = new THREE.Group()
  hut.position.set(HUT.x, 0, HUT.z)
  hut.rotation.y = HUT.rot
  root.add(hut)
  const HW = 5.6
  const HD = 3.2
  const WH = 2.7
  bx(HW + 0.3, 0.14, HD + 0.3, woodH, 0, 0.07, 0, hut)
  bx(HW, WH, 0.14, wood, 0, WH / 2 + 0.14, -HD / 2, hut)
  bx(0.14, WH, HD, wood, -HW / 2, WH / 2 + 0.14, 0, hut)
  bx(0.14, WH, HD, wood, HW / 2, WH / 2 + 0.14, 0, hut)
  for (const s of [-1, 1]) bx(0.18, WH, 0.18, wood, (s * HW) / 2, WH / 2 + 0.14, HD / 2, hut)
  bx(HW + 0.2, 0.22, 0.16, wood, 0, WH + 0.04, HD / 2, hut)
  const roofMat = new THREE.MeshStandardMaterial({ color: '#6a717c', roughness: 0.7, metalness: 0.2 })
  disposers.push(() => roofMat.dispose())
  const roof = bx(HW + 0.7, 0.12, HD + 0.9, roofMat, 0, WH + 0.3, 0.1, hut)
  roof.rotation.x = 0.1
  // frost on the roof
  const frost = bx(HW + 0.5, 0.03, HD + 0.6, new THREE.MeshStandardMaterial({ color: '#b8c6d8', roughness: 1 }), 0, WH + 0.37, 0.1, hut)
  frost.rotation.x = 0.1
  disposers.push(() => frost.material.dispose())
  solids.push(box(HUT.x, HUT.z, HW + 0.4, HD + 0.4, { rot: HUT.rot }))
  const hutPoint = new THREE.PointLight('#ffe3b8', 5, 7, 1.6)
  hutPoint.position.set(0.5, 2.3, 0.3)
  hut.add(hutPoint)

  // the freezer, cut open at the front behind a glass pane
  const FZ = { x: 0.75, z: -0.85, w: 1.9, d: 1.0, y0: 0.3, y1: 1.24 }
  const fz = new THREE.Group()
  fz.position.set(FZ.x, 0, FZ.z)
  hut.add(fz)
  for (const s of [-1, 1]) bx(0.1, FZ.y1 - FZ.y0, FZ.d, enamel, (s * (FZ.w - 0.1)) / 2, (FZ.y0 + FZ.y1) / 2, 0, fz)
  bx(FZ.w, FZ.y1 - FZ.y0, 0.1, enamel, 0, (FZ.y0 + FZ.y1) / 2, -(FZ.d - 0.1) / 2, fz)
  bx(FZ.w, 0.1, FZ.d, enamel, 0, FZ.y0 + 0.05, 0, fz)
  for (const [x, z] of [[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]]) bx(0.09, FZ.y0, 0.09, metal, x, FZ.y0 / 2, z, fz)
  // the black velvet lining
  const IN = { w: FZ.w - 0.22, d: FZ.d - 0.2, y0: FZ.y0 + 0.1, y1: FZ.y1 }
  for (const s of [-1, 1]) bx(0.02, IN.y1 - IN.y0, IN.d, velvet, (s * (IN.w - 0.02)) / 2, (IN.y0 + IN.y1) / 2, 0.0, fz)
  bx(IN.w, IN.y1 - IN.y0, 0.02, velvet, 0, (IN.y0 + IN.y1) / 2, -(IN.d - 0.02) / 2, fz)
  bx(IN.w, 0.02, IN.d, velvet, 0, IN.y0 + 0.01, 0, fz)
  // the glass pane in front, in a thin frame
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(FZ.w, IN.y1 - IN.y0 + 0.12), glassMat)
  pane.position.set(0, (IN.y0 + IN.y1) / 2 + 0.04, FZ.d / 2 - 0.02)
  fz.add(pane)
  bx(FZ.w, 0.06, 0.06, metal, 0, IN.y1 + 0.03, FZ.d / 2 - 0.02, fz)
  bx(FZ.w, 0.06, 0.06, metal, 0, IN.y0 - 0.03, FZ.d / 2 - 0.02, fz)
  // the lid, open on its back hinge, leaning past upright as the picture has it
  const lidPivot = new THREE.Group()
  lidPivot.position.set(0, FZ.y1, -FZ.d / 2)
  lidPivot.rotation.x = -1.92
  fz.add(lidPivot)
  bx(FZ.w + 0.06, 0.1, FZ.d + 0.04, enamel, 0, 0.05, FZ.d / 2, lidPivot)

  // the cloud of droplets, the crystals in the lamp's beam, the snow falling and lying
  const cloudMats = []
  const cloudSprites = []
  const cr = random(41)
  for (let i = 0; i < 9; i++) {
    const m = new THREE.SpriteMaterial({ map: glow, color: '#c9d6e6', transparent: true, opacity: 0, depthWrite: false })
    const s = new THREE.Sprite(m)
    s.position.set((cr() - 0.5) * (IN.w - 0.3), IN.y0 + 0.2 + cr() * (IN.y1 - IN.y0 - 0.35), (cr() - 0.5) * (IN.d - 0.2))
    const sc = 0.55 + cr() * 0.45
    s.scale.set(sc * 1.3, sc, 1)
    fz.add(s)
    cloudMats.push(m)
    cloudSprites.push({ s, y: s.position.y, ph: cr() * 6 })
  }
  // the lamp: a stand, an arm and a cone shade, its beam falling across the box
  const lampG = new THREE.Group()
  lampG.position.set(-0.45, 0, 0.05)
  hut.add(lampG)
  bx(0.06, 1.75, 0.06, metal, 0, 0.9, 0, lampG)
  bx(0.34, 0.05, 0.34, metal, 0, 0.03, 0, lampG)
  const lampArm = bx(0.9, 0.04, 0.04, metal, 0.4, 1.78, 0, lampG)
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#8d867a', roughness: 0.5, side: THREE.DoubleSide }))
  shade.position.set(0.85, 1.7, 0)
  shade.rotation.z = -0.55
  lampG.add(shade)
  disposers.push(() => shade.material.dispose())
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshStandardMaterial({ color: '#fff4d0', emissive: '#ffe6a0', emissiveIntensity: 2.2 }))
  bulb.position.set(0.88, 1.64, 0)
  lampG.add(bulb)
  disposers.push(() => bulb.material.dispose())
  void lampArm
  // the beam: from the shade to the middle of the box's floor
  const beamStart = V(0.45, 1.62, 0.05)
  const beamEnd = V(FZ.x - 0.1, IN.y0 + 0.05, FZ.z + 0.05)
  const beamDir = beamEnd.clone().sub(beamStart)
  const beamLen = beamDir.length()
  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uK: { value: 0.1 } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `uniform float uK; varying vec2 vUv; void main() { float a = uK * (1.0 - vUv.y * 0.55) * smoothstep(0.0, 0.1, vUv.y); gl_FragColor = vec4(1.0, 0.93, 0.74, a * 0.2); }`,
  })
  disposers.push(() => beamMat.dispose())
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.3, beamLen, 24, 1, true), beamMat)
  beam.position.copy(beamStart).addScaledVector(beamDir, 0.5)
  beam.quaternion.setFromUnitVectors(V(0, 1, 0), beamDir.clone().normalize().negate())
  hut.add(beam)
  // crystals twinkling along the beam, the snow falling inside, the floor's snow
  const along = rnd => {
    const s = 0.5 + rnd() * 0.5
    const p = beamStart.clone().addScaledVector(beamDir, s)
    const r = 0.03 + s * 0.3
    const a = rnd() * TAU
    const rr = Math.sqrt(rnd()) * r
    return [p.x - FZ.x + Math.cos(a) * rr * 0.3, p.y + Math.sin(a) * rr, p.z - FZ.z + Math.sin(a) * rr * 0.5]
  }
  const glitter = flakeField({ count: light ? 200 : 520, w: 0, d: 0, h: 0.0001, speed: 0, size: 0.032, color: '#ffffff', glow: 1.9, sway: 0.03, fade: 0.001, tw: true, additive: true, seed: 5, shape: along })
  fz.add(glitter.points)
  const snowIn = flakeField({ count: light ? 90 : 220, w: IN.w - 0.2, d: IN.d - 0.15, h: IN.y1 - IN.y0 - 0.1, y: IN.y1 - 0.05, speed: 0.22, size: 0.034, color: '#f2f6ff', glow: 1.3, sway: 0.05, fade: 0.2, additive: true, seed: 8 })
  fz.add(snowIn.points)
  const floorSnow = new THREE.Mesh(new THREE.PlaneGeometry(IN.w - 0.05, IN.d - 0.05), new THREE.MeshBasicMaterial({ color: '#cdd8ea', transparent: true, opacity: 0, depthWrite: false }))
  floorSnow.rotation.x = -Math.PI / 2
  floorSnow.position.y = IN.y0 + 0.03
  fz.add(floorSnow)
  disposers.push(() => floorSnow.material.dispose())

  // the breathing tube: a rubber hose from the box's corner, curling out to a mouthpiece
  const tubeCurve = new THREE.CatmullRomCurve3([V(FZ.x - 0.7, FZ.y1 - 0.1, FZ.z + 0.45), V(FZ.x - 0.8, FZ.y1 + 0.18, FZ.z + 0.9), V(FZ.x - 0.55, 0.95, FZ.z + 1.5), V(FZ.x - 0.2, 0.9, FZ.z + 2.0)])
  const hoseMat = new THREE.MeshStandardMaterial({ color: '#c0472f', roughness: 0.6 })
  const hose = new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 24, 0.032, 8), hoseMat)
  hut.add(hose)
  const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.04, 0.14, 14, 1, true), new THREE.MeshStandardMaterial({ color: '#e0553a', roughness: 0.5, side: THREE.DoubleSide, emissive: '#7a1d0e', emissiveIntensity: 0.4 }))
  const tEnd = tubeCurve.getPoint(1)
  mouth.position.copy(tEnd).add(V(0.0, -0.03, 0.05))
  mouth.rotation.x = 1.2
  hut.add(mouth)
  const tubeHit = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), ghost)
  tubeHit.position.copy(tubeCurve.getPoint(0.8))
  hut.add(tubeHit)
  const tubeSign = makeText(E.box.signs.tube, { size: 0.09, color: '#ffd9cc', maxWidth: 1.3 })
  tubeSign.position.copy(tEnd).add(V(0, -0.34, 0.2))
  hut.add(tubeSign)
  disposers.push(() => (hoseMat.dispose(), hose.geometry.dispose(), mouth.material.dispose()))

  // the thermometer and the lens, on one post at the right of the box
  const POST = { x: 2.25, z: -0.35 }
  bx(0.08, 2.0, 0.08, metal, POST.x, 1.05, POST.z - 0.1, hut)
  const thermoTex = tex(canvasTex(128, 320, null))
  const drawThermo = T => {
    thermoTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0f1536'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = '#5fd3ff'
      g.lineWidth = 5
      g.strokeRect(3, 3, w - 6, h - 6)
      const top = 70
      const bot = h - 40
      const y = t => lerp(bot, top, (t - T_MIN) / (0 - T_MIN))
      g.fillStyle = '#26305e'
      g.fillRect(w * 0.28, top - 6, 22, bot - top + 24)
      g.fillStyle = '#ff4d4d'
      g.fillRect(w * 0.28 + 4, y(T), 14, bot + 14 - y(T))
      g.beginPath()
      g.arc(w * 0.28 + 11, bot + 20, 14, 0, TAU)
      g.fill()
      g.fillStyle = '#dfe8ff'
      g.font = '700 21px Outfit, sans-serif'
      g.textAlign = 'left'
      for (let t = -40; t <= 0; t += 10) {
        g.fillRect(w * 0.28 + 24, y(t) - 1, 14, 2)
        g.fillText(String(t).replace('-', '−'), w * 0.28 + 44, y(t) + 7)
      }
      g.textAlign = 'center'
      g.fillStyle = '#ffffff'
      g.font = '800 32px Outfit, sans-serif'
      g.fillText(`${fmtT(T, lang)} °C`, w / 2, 40)
    })
  }
  const thermoBoard = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 1.05), new THREE.MeshBasicMaterial({ map: thermoTex, toneMapped: false }))
  thermoBoard.position.set(POST.x, 0.72, POST.z + 0.1)
  thermoBoard.rotation.x = 0
  hut.add(thermoBoard)
  disposers.push(() => thermoBoard.material.dispose())
  const lensTex = tex(canvasTex(256, 256, null))
  let lensState = 'none'
  let lensLv = ''
  const drawLens = () => {
    const l = lv()
    lensLv = `${lensState}|${l}|${Math.round(boxT * 2)}`
    lensTex.userData.redraw((g, w) => {
      g.clearRect(0, 0, w, w)
      g.save()
      g.beginPath()
      g.arc(w / 2, w / 2, w / 2 - 14, 0, TAU)
      g.clip()
      g.fillStyle = '#0a0f2e'
      g.fillRect(0, 0, w, w)
      const rnd = random(9)
      if (lensState === 'liquid') {
        for (let i = 0; i < 9; i++) {
          const x = 50 + rnd() * 156
          const y = 50 + rnd() * 110
          const r = 15 + rnd() * 12
          const grd = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r)
          grd.addColorStop(0, '#d9f1ff')
          grd.addColorStop(1, '#3f8fd8')
          g.fillStyle = grd
          g.beginPath()
          g.arc(x, y, r, 0, TAU)
          g.fill()
        }
      } else if (lensState === 'ice') {
        g.strokeStyle = '#e8f6ff'
        g.lineWidth = 4
        g.lineCap = 'round'
        for (let i = 0; i < 4; i++) {
          const x = 56 + rnd() * 144
          const y = 60 + rnd() * 100
          const r = 22 + rnd() * 14
          const o = rnd() * 1.04
          for (let k = 0; k < 6; k++) {
            const a = o + (k * TAU) / 6
            g.beginPath()
            g.moveTo(x, y)
            g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
            g.moveTo(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55)
            g.lineTo(x + Math.cos(a + 0.5) * r * 0.8, y + Math.sin(a + 0.5) * r * 0.8)
            g.moveTo(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55)
            g.lineTo(x + Math.cos(a - 0.5) * r * 0.8, y + Math.sin(a - 0.5) * r * 0.8)
            g.stroke()
          }
        }
      }
      g.restore()
      g.fillStyle = '#ffffff'
      g.textAlign = 'center'
      const txt = fill(at(E.box.lens[lensState], l), { t: fmtT(boxT, lang) })
      let px = 26
      g.font = `800 ${px}px Outfit, sans-serif`
      while (g.measureText(txt).width > 150 && px > 12) g.font = `800 ${--px}px Outfit, sans-serif`
      g.fillText(txt, w / 2, w - 58)
      g.strokeStyle = '#5fd3ff'
      g.lineWidth = 12
      g.beginPath()
      g.arc(w / 2, w / 2, w / 2 - 9, 0, TAU)
      g.stroke()
    })
  }
  const lensDisc = new THREE.Mesh(new THREE.CircleGeometry(0.36, 40), new THREE.MeshBasicMaterial({ map: lensTex, transparent: true, toneMapped: false }))
  lensDisc.position.set(POST.x, 1.86, POST.z + 0.02)
  lensDisc.rotation.x = -0.12
  hut.add(lensDisc)
  disposers.push(() => lensDisc.material.dispose())

  // the jars on their shelves
  const JARS = [
    ['talc', '#f1f1ec', -2.0, 1.0], ['salt', '#e7ece8', -1.5, 1.0], ['ash', '#7e7f84', -1.0, 1.0],
    ['soot', '#18181c', -2.0, 1.55], ['dry', '#e6f1f6', -1.5, 1.55], ['agi', '#e8d44a', -1.0, 1.55],
  ]
  for (const y of [0.88, 1.43]) bx(1.7, 0.05, 0.42, wood, -1.5, y, -HD / 2 + 0.3, hut)
  for (const x of [-2.25, -0.75]) for (const y of [0.45, 1.0]) bx(0.05, 0.9, 0.4, wood, x, y + 0.35, -HD / 2 + 0.3, hut)
  const jarObjs = {}
  const glassJar = new THREE.MeshStandardMaterial({ color: '#d7e8f2', transparent: true, opacity: 0.32, roughness: 0.1, depthWrite: false })
  disposers.push(() => glassJar.dispose())
  for (const [id, col, x, y] of JARS) {
    const g = new THREE.Group()
    g.position.set(x, y + 0.01, -HD / 2 + 0.3)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.38, 20), glassJar)
    body.position.y = 0.19 + 0.06
    const fillM = new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, emissive: col, emissiveIntensity: 0.12 })
    const fillC = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, id === 'dry' ? 0.12 : 0.24, 18), fillM)
    fillC.position.y = id === 'dry' ? 0.12 : 0.18
    const lidC = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.05, 20), metal)
    lidC.position.y = 0.44
    g.add(body, fillC, lidC)
    if (id === 'dry') {
      // a pile of dry ice lumps and a little white smoke
      for (const [px, py, pz] of [[-0.05, 0.24, 0.02], [0.05, 0.22, -0.03], [0.0, 0.3, 0.04]]) {
        const lump = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.09), new THREE.MeshStandardMaterial({ color: '#f4f9fc', roughness: 0.5, emissive: '#cfe6f0', emissiveIntensity: 0.3 }))
        lump.position.set(px, py, pz)
        lump.rotation.set(px * 4, py * 3, pz * 5)
        g.add(lump)
        disposers.push(() => lump.material.dispose())
      }
    }
    const label = makeText(E.box.jars[id], { size: 0.075, color: '#ffffff', maxWidth: 0.48, anchorY: 'top', outlineWidth: 0.008, outlineColor: '#10142e' })
    label.position.set(0, -0.03, 0.34)
    g.add(label)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.62, 10), ghost)
    hit.position.y = 0.3
    g.add(hit)
    hut.add(g)
    jarObjs[id] = { g, hit, label, fillM }
    disposers.push(() => (body.geometry.dispose(), fillM.dispose()))
  }
  void JARS
  // a puff of dust thrown from a jar into the box
  const dustMat = new THREE.PointsMaterial({ size: 0.06, transparent: true, depthWrite: false, vertexColors: true })
  const dustN = 48
  const dustPos = new Float32Array(dustN * 3)
  const dustCol = new Float32Array(dustN * 3)
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3))
  const dustPts = new THREE.Points(dustGeo, dustMat)
  dustPts.frustumCulled = false
  dustPts.raycast = () => {}
  hut.add(dustPts)
  disposers.push(() => (dustGeo.dispose(), dustMat.dispose()))
  const dustLife = new Float32Array(dustN).fill(-1)
  const dustVel = new Float32Array(dustN * 3)
  const dustBase = new Float32Array(dustN * 3)
  let dustAt = 0
  const throwDust = (id, mine) => {
    const j = jarObjs[id]
    const colr = new THREE.Color(JARS.find(x => x[0] === id)[1])
    const from = j.g.position
    for (let i = 0; i < 16; i++) {
      const k = dustAt++ % dustN
      dustLife[k] = 0
      dustPos.set([from.x + 0.1, from.y + 0.46, from.z + 0.2], k * 3)
      // an arc from the jar to the box
      const tx = FZ.x - 0.1 + (Math.random() - 0.5) * 0.7
      const tz = FZ.z + (Math.random() - 0.5) * 0.4
      const T = 0.95
      dustVel.set([(tx - from.x - 0.1) / T, 2.4 + Math.random() * 0.5, (tz - from.z - 0.2) / T], k * 3)
      dustBase.set([colr.r, colr.g, colr.b], k * 3)
    }
    void mine
  }
  updates.push(dt => {
    for (let k = 0; k < dustN; k++) {
      if (dustLife[k] < 0) {
        dustCol.set([0, 0, 0], k * 3)
        continue
      }
      dustLife[k] += dt
      const t = dustLife[k]
      dustVel[k * 3 + 1] -= 6.5 * dt
      dustPos[k * 3] += dustVel[k * 3] * dt
      dustPos[k * 3 + 1] += dustVel[k * 3 + 1] * dt
      dustPos[k * 3 + 2] += dustVel[k * 3 + 2] * dt
      if (dustPos[k * 3 + 1] < IN.y0 + 0.05 && dustPos[k * 3] > FZ.x - 1.0) dustLife[k] = Math.max(dustLife[k], 1.4)
      if (t > 1.6 || dustPos[k * 3 + 1] < 0.1) {
        dustLife[k] = -1
        continue
      }
      const f = clamp(1.6 - t) * 1.2
      dustCol.set([dustBase[k * 3] * f, dustBase[k * 3 + 1] * f, dustBase[k * 3 + 2] * f], k * 3)
    }
    dustGeo.attributes.position.needsUpdate = true
    dustGeo.attributes.color.needsUpdate = true
  })

  // ---- the box's state ----
  let boxT = BOX_T0 // temperature of the box
  let phase = 'empty' // empty | cloud | snow
  let phaseAge = 0
  let cloudK = 0
  let snowFloor = 0
  let selfFroze = false
  let failed = false
  let boxCount = 0
  let lastAct = ''
  let lastActAt = wall()
  let boxMine = false
  const jarWorks = id => (id === 'dry' ? true : id === 'agi' ? boxT <= T_AGI : false)
  /** Do an action of the box ('breath', 'lid' or a jar's id). `age`: how long ago it happened (a newcomer). */
  const boxAct = (a, { mine = false, age = 0 } = {}) => {
    boxMine = mine
    lastAct = a
    lastActAt = wall() - age
    const l = lv()
    const vars = { t: fmtT(boxT, lang) }
    const speak = key => mine && say(fill(at(E.box.says[key], l), { ...vars, jar: E.box.jars[a] }))
    if (a === 'breath') {
      if (phase !== 'cloud') {
        phase = 'cloud'
        phaseAge = age
        selfFroze = false
        if (age <= 0) cloudK = Math.max(0, cloudK - 0.2)
      }
      failed = false
      speak('breath')
    } else if (a === 'lid') {
      phase = 'empty'
      phaseAge = age
      failed = false
      cloudK = Math.min(cloudK, 0.6)
      snowFloor = 0
      speak('lid')
    } else {
      throwDust(a, mine)
      if (phase !== 'cloud') speak('noCloud')
      else if (jarWorks(a)) {
        phase = 'snow'
        phaseAge = age
        failed = false
        speak(a)
      } else {
        failed = true
        speak(a === 'agi' ? 'agiWarm' : 'nothing')
      }
    }
    if (mine) play(a === 'breath' ? 'fizz' : a === 'lid' ? 'tap' : jarWorks(a) && phase === 'snow' ? 'beam' : 'select')
  }
  updates.push((dt, t) => {
    phaseAge += dt
    if (phase === 'cloud' && boxT <= T_SELF && phaseAge > 1.4) {
      phase = 'snow'
      phaseAge = 0
      selfFroze = true
      if (boxMine) say(at(E.box.says.self, lv()))
    }
    if (phase === 'snow' && phaseAge > SNOW_T) {
      phase = 'empty'
      phaseAge = 0
    }
    const tgt = phase === 'cloud' ? 1 : phase === 'snow' ? clamp(1 - phaseAge / 3.2) : 0
    cloudK = damp(cloudK, tgt, phase === 'cloud' ? 1.1 : 1.6, dt)
    for (const m of cloudMats) m.opacity = cloudK * 0.42
    for (const c of cloudSprites) c.s.position.y = c.y + Math.sin(t * 0.5 + c.ph) * 0.03
    const sparkle = phase === 'snow' ? clamp(phaseAge / 0.5) * clamp((SNOW_T - phaseAge) / 3) : 0
    glitter.u.uK.value = damp(glitter.u.uK.value, sparkle, 6, dt)
    snowIn.u.uK.value = damp(snowIn.u.uK.value, phase === 'snow' ? clamp(phaseAge / 0.6) * clamp((SNOW_T - phaseAge) / 2.5) : 0, 5, dt)
    snowFloor = phase === 'snow' ? Math.min(1, snowFloor + dt * 0.18) : Math.max(0, snowFloor - dt * 0.05)
    floorSnow.material.opacity = snowFloor * 0.55
    beamMat.uniforms.uK.value = 0.12 + 0.6 * Math.max(cloudK, sparkle)
    const want = phase === 'snow' ? 'ice' : phase === 'cloud' ? 'liquid' : 'none'
    const key = `${want}|${lv()}|${Math.round(boxT * 2)}`
    if (want !== lensState || key !== lensLv) {
      lensState = want
      drawLens()
    }
    void selfFroze
  })
  const slidBox = (() => {
    let sending = false
    return () => {
      if (sending) return
      sending = true
      later(0.15, () => {
        sending = false
        share('box')
      })
    }
  })()
  const setBoxT = v => {
    boxT = clamp(Math.round(v * 2) / 2, T_MIN, 0)
    drawThermo(boxT)
    lensLv = ''
  }
  drawThermo(boxT)
  drawLens()
  const boxPanel = lv_ => ({
    title: E.box.title,
    color: '#5fd3ff',
    blocks: [
      ...E.box.panel[depth(lv_)].map(p => ({ p })),
      { slider: { label: E.box.slider, min: T_MIN, max: 0, step: 0.5, value: boxT, onInput: v => (setBoxT(v), slidBox()), format: v => `${fmtT(v, lang)} °C`, live: () => boxT } },
      {
        buttons: [
          { label: E.box.buttons.breath, onClick: () => boxStep('breath') },
          ...JARS.map(([id]) => ({ label: E.box.jars[id], onClick: () => boxStep(id) })),
          { label: E.box.buttons.lid, onClick: () => boxStep('lid') },
        ],
      },
    ],
  })
  function boxStep(a) {
    boxCount++
    boxAct(a, { mine: true })
    ex.discover('box', boxPanel, 7)
    share('box')
  }
  ex.add({
    id: 'box',
    x: 4.5,
    z: -0.6,
    radius: 2.4,
    manual: true,
    label: E.box.label,
    verb: () => (phase === 'empty' ? E.box.hints.breath : phase === 'snow' ? E.box.hints.watch : failed ? E.box.hints.lid : E.box.hints.jar),
    focus: focusOf(6.3, 1.2, -4.1, 4.2, 6.2),
    act: () => ctx.showPanel(boxPanel),
  })
  clickable(tubeHit, () => boxStep('breath'), { reach: 6 })
  for (const [id] of JARS) clickable(jarObjs[id].hit, () => boxStep(id), { reach: 6 })
  const lidHit = new THREE.Mesh(new THREE.BoxGeometry(FZ.w, 0.2, 1.1), ghost)
  lidHit.position.set(0, 0.5, FZ.d / 2)
  lidPivot.add(lidHit)
  clickable(lidHit, () => boxStep('lid'), { reach: 6 })

  // =================================================================================================
  // Station 2: two crystals, on the bench
  // =================================================================================================
  const bench = new THREE.Group()
  bench.position.set(BENCH.x, 0, BENCH.z)
  bench.rotation.y = BENCH.rot
  root.add(bench)
  bx(6.4, 0.16, 3.0, woodH, 0, 0.08, 0, bench)
  solids.push(box(BENCH.x, BENCH.z, 6.4, 3.0, { rot: BENCH.rot, y1: 0.4 }))
  const TILT = 0.95
  const normal = V(0, Math.sin(TILT), Math.cos(TILT))
  const LIFT = 0.55
  const STAND_Y = 1.18
  const standPos = { ice: V(-2.1, STAND_Y, 0.0), agi: V(0, STAND_Y, -0.1), salt: V(2.1, STAND_Y, 0.0) }
  const PW = 1.75
  const PH = 1.4
  const agM = new THREE.MeshStandardMaterial({ color: '#b4bcc8', roughness: 0.3, metalness: 0.55, emissive: '#2a2f3a', emissiveIntensity: 0.3 })
  const iM = new THREE.MeshStandardMaterial({ color: '#a830b0', roughness: 0.4, emissive: '#4a1050', emissiveIntensity: 0.35 })
  const oM = new THREE.MeshStandardMaterial({ color: '#e63a3a', roughness: 0.4, emissive: '#4a0c0c', emissiveIntensity: 0.4 })
  const hM = new THREE.MeshStandardMaterial({ color: '#f4f6fa', roughness: 0.4, emissive: '#7f8a9c', emissiveIntensity: 0.3 })
  const naM = new THREE.MeshStandardMaterial({ color: '#5b8def', roughness: 0.4, emissive: '#1a2f66', emissiveIntensity: 0.35 })
  const clM = new THREE.MeshStandardMaterial({ color: '#47c26a', roughness: 0.4, emissive: '#10401f', emissiveIntensity: 0.35 })
  const bondM = new THREE.MeshStandardMaterial({ color: '#cfd5e0', roughness: 0.5, emissive: '#586072', emissiveIntensity: 0.25 })
  const hbondM = new THREE.MeshStandardMaterial({ color: '#9fd8ff', roughness: 0.5, emissive: '#3b6f94', emissiveIntensity: 0.3, transparent: true, opacity: 0.8 })
  const plateIce = new THREE.MeshStandardMaterial({ color: '#8fd2ff', transparent: true, opacity: 0.2, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide })
  disposers.push(() => [agM, iM, oM, hM, naM, clM, bondM, hbondM, plateIce].forEach(m => m.dispose()))
  const ball = (r, mat, p, parent) => {
    const m = new THREE.Mesh(sphereGeo, mat)
    m.position.copy(p)
    m.scale.setScalar(r)
    m.castShadow = true
    parent.add(m)
    return m
  }
  // a stand: a post and a tilted board facing the visitor and up
  const stand = (kind, signText) => {
    const g = new THREE.Group()
    g.position.copy(standPos[kind])
    bx(0.12, STAND_Y - 0.06, 0.12, metal, 0, -STAND_Y + 0.16 + (STAND_Y - 0.06) / 2, -0.25, g)
    bx(0.55, 0.08, 0.5, metal, 0, -STAND_Y + 0.2, -0.2, g)
    const board = new THREE.Group()
    board.rotation.x = -TILT
    g.add(board)
    const label = makeText(signText, { size: 0.15, color: '#ffffff', maxWidth: 1.9, anchorY: 'top', outlineWidth: 0.01, outlineColor: '#10142e' })
    label.position.set(0, -0.85, 0.4)
    label.rotation.x = 0
    g.add(label)
    bench.add(g)
    return { g, board }
  }
  const agiStand = stand('agi', E.crystals.signs.agi)
  const iceStand = stand('ice', E.crystals.signs.ice)
  const saltStand = stand('salt', E.crystals.signs.salt)
  // silver iodide: silver and iodine in rings of six, on a dark plate
  {
    const a = 0.4
    const hc = honeycomb(a, 3, 3)
    const plate = new THREE.Mesh(new RoundedBoxGeometry(PW, PH, 0.08, 2, 0.03), navy)
    plate.position.z = -0.1
    agiStand.board.add(plate)
    const edge = new THREE.Mesh(new RoundedBoxGeometry(PW + 0.06, PH + 0.06, 0.05, 2, 0.02), rim)
    edge.position.z = -0.15
    agiStand.board.add(edge)
    const pts = { }
    hc.A.forEach((p, i) => (pts[`A${i}`] = V(p[0], p[1], 0)))
    hc.B.forEach((p, i) => (pts[`B${i}`] = V(p[0], p[1], 0)))
    for (const p of hc.A) ball(0.078, agM, V(p[0], p[1], 0), agiStand.board)
    for (const p of hc.B) ball(0.108, iM, V(p[0], p[1], 0), agiStand.board)
    for (const [p, q] of hc.bonds) agiStand.board.add(stick(pts[p], pts[q], 0.016, bondM))
  }
  // ice: rings of water molecules, a pale layer over nothing, 1.5% smaller
  const iceTile = new THREE.Group()
  iceTile.position.copy(standPos.ice)
  bench.add(iceTile)
  const iceBoard = new THREE.Group()
  iceBoard.rotation.x = -TILT
  iceTile.add(iceBoard)
  {
    const a = 0.4 * (4.52 / 4.59)
    const hc = honeycomb(a, 3, 3)
    const sheet = new THREE.Mesh(new RoundedBoxGeometry(PW, PH, 0.03, 2, 0.015), plateIce)
    sheet.position.z = -0.03
    iceBoard.add(sheet)
    const pts = {}
    hc.A.forEach((p, i) => (pts[`A${i}`] = V(p[0], p[1], 0)))
    hc.B.forEach((p, i) => (pts[`B${i}`] = V(p[0], p[1], 0)))
    for (const p of [...hc.A, ...hc.B]) ball(0.085, oM, V(p[0], p[1], 0), iceBoard)
    // each water molecule's hydrogens along its bonds: A gives two, B one, and a spare up out of the layer
    for (const [p, q, dir] of hc.bonds) {
      const donor = dir === 2 ? q : p
      const other = dir === 2 ? p : q
      const d = pts[other].clone().sub(pts[donor])
      iceBoard.add(stick(pts[donor], pts[other], 0.011, hbondM))
      ball(0.044, hM, pts[donor].clone().addScaledVector(d, 0.3), iceBoard)
    }
    for (const p of hc.B) ball(0.044, hM, V(p[0], p[1], 0.1), iceBoard)
  }
  // salt: a cube of sodium and chlorine on a square grid
  {
    const plate = new THREE.Mesh(new RoundedBoxGeometry(PW, PH, 0.08, 2, 0.03), navy)
    plate.position.z = -0.1
    saltStand.board.add(plate)
    const edge = new THREE.Mesh(new RoundedBoxGeometry(PW + 0.06, PH + 0.06, 0.05, 2, 0.02), rim)
    edge.position.z = -0.15
    saltStand.board.add(edge)
    const s = 0.3
    const n = 4
    const at3 = (i, j, k) => V((i - (n - 1) / 2) * s, (j - (n - 1) / 2) * s, -k * s)
    for (let k = 0; k < 2; k++) {
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const na = (i + j + k) % 2 === 0
          ball(na ? 0.075 : 0.115, na ? naM : clM, at3(i, j, k), saltStand.board)
          if (i < n - 1) saltStand.board.add(stick(at3(i, j, k), at3(i + 1, j, k), 0.015, bondM))
          if (j < n - 1) saltStand.board.add(stick(at3(i, j, k), at3(i, j + 1, k), 0.015, bondM))
          if (k < 1) saltStand.board.add(stick(at3(i, j, k), at3(i, j, k + 1), 0.015, bondM))
        }
      }
    }
  }
  // the board that says what is going on
  const infoTex = tex(canvasTex(512, 160, null))
  let infoKey = ''
  let tileState = 'home'
  let tileK = 0 // 0 home, 1 on its target
  let tileFrom = 'home'
  let tileTo = 'home'
  let tileAge = 0
  const drawInfo = () => {
    const l = lv()
    const key = `${tileState}|${l}`
    if (key === infoKey) return
    infoKey = key
    infoTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0f1536'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = tileState === 'agi' ? '#6df0a6' : tileState === 'salt' ? '#ff8a7a' : '#5fd3ff'
      g.lineWidth = 8
      g.strokeRect(4, 4, w - 8, h - 8)
      g.fillStyle = '#ffffff'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      const entry = E.crystals.board[tileState === 'agi' ? 'fit' : tileState === 'salt' ? 'nofit' : 'idle']
      const txt = at(entry, l)
      // wrap onto two lines
      g.font = '800 38px Outfit, sans-serif'
      const words = txt.split(' ')
      const lines = ['']
      for (const wd of words) {
        const cand = `${lines[lines.length - 1]} ${wd}`.trim()
        if (g.measureText(cand).width > w - 50 && lines[lines.length - 1]) lines.push(wd)
        else lines[lines.length - 1] = cand
      }
      lines.slice(0, 3).forEach((ln, i, a) => g.fillText(ln, w / 2, h / 2 + (i - (a.length - 1) / 2) * 46))
    })
  }
  const infoBoard = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.62), new THREE.MeshBasicMaterial({ map: infoTex, toneMapped: false }))
  infoBoard.position.set(0, 0.5, 1.45)
  infoBoard.rotation.x = -0.75
  bench.add(infoBoard)
  disposers.push(() => infoBoard.material.dispose())
    // the ice layer's flight
  const tileHome = standPos.ice
  const tileOn = k => standPos[k].clone().addScaledVector(normal, LIFT)
  const tilePos = (state, t) => {
    if (state === 'home') return tileHome.clone()
    const p = tileOn(state)
    if (state === 'salt') p.addScaledVector(normal, 0.25 + Math.sin(t * 7) * 0.012)
    return p
  }
  const setTile = (to, { instant = false } = {}) => {
    tileFrom = tileState === 'home' ? 'home' : tileState
    tileTo = to
    tileState = to
    tileAge = instant ? 9 : 0
    infoKey = ''
  }
  updates.push((dt, t) => {
    tileAge += dt
    const k = ease(tileAge / 1.5)
    const a = tilePos(tileFrom, t)
    const b = tilePos(tileTo, t)
    iceTile.position.lerpVectors(a, b, k)
    iceTile.position.y += 0.5 * Math.sin(Math.PI * k)
    iceTile.position.z += 0.2 * Math.sin(Math.PI * k)
    // on the salt it tries and fails: it rocks and turns a little
    const rock = tileTo === 'salt' && k >= 1
    iceBoard.rotation.z = rock ? Math.sin(t * 5) * 0.09 : damp(iceBoard.rotation.z, 0, 8, dt)
    iceTile.rotation.y = rock ? Math.sin(t * 3.1) * 0.05 : 0
    drawInfo()
  })
  const crystalsPanel = lv_ => ({
    title: E.crystals.title,
    color: '#6df0a6',
    blocks: [
      ...E.crystals.panel[depth(lv_)].map(p => ({ p })),
      ...(lv_ === 'scientist'
        ? [{ rows: [[E.crystals.rows.ice, nm('4.52 Å')], [E.crystals.rows.agi, nm('4.59 Å')], [E.crystals.rows.gap, nm('1.5 %')], [E.crystals.rows.salt, nm('5.64 Å')]] }]
        : []),
      {
        buttons: [
          { label: E.crystals.buttons.agi, onClick: () => crystalStep('agi') },
          { label: E.crystals.buttons.salt, onClick: () => crystalStep('salt') },
          { label: E.crystals.buttons.back, onClick: () => crystalStep('home') },
        ],
      },
    ],
  })
  function crystalStep(to) {
    if (tileState === to) return
    setTile(to)
    play(to === 'agi' ? 'select' : to === 'salt' ? 'wrong' : 'tap')
    say(at(E.crystals.says[to === 'home' ? 'back' : to], lv()))
    ex.discover('crystals', crystalsPanel, to === 'home' ? 4 : 5)
    share('crystals')
  }
  ex.add({
    id: 'crystals',
    x: -3.55,
    z: 0.4,
    radius: 2.6,
    manual: true,
    label: E.crystals.label,
    verb: () => (tileState === 'home' ? E.crystals.hints.agi : tileState === 'agi' ? E.crystals.hints.salt : E.crystals.hints.back),
    focus: focusOf(-5.4, 1.3, -2.6, 3.8, 6.8),
    act: () => ctx.showPanel(crystalsPanel),
  })
  for (const [st, key] of [[agiStand, 'agi'], [saltStand, 'salt']]) {
    const hit = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, 0.5), ghost)
    st.board.add(hit)
    clickable(hit, () => crystalStep(key), { reach: 7 })
  }
  {
    const hit = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, 0.5), ghost)
    iceBoard.add(hit)
    clickable(iceBoard, () => crystalStep(tileState === 'home' ? 'agi' : 'home'), { reach: 7 })
  }

  // =================================================================================================
  // Station 3: seed the cloud
  // =================================================================================================
  let cloudT = -18.5
  // the plane
  const plane = new THREE.Group()
  const planeBank = new THREE.Group()
  plane.add(planeBank)
  root.add(plane)
  {
    const body = new THREE.MeshStandardMaterial({ color: '#eae3d0', roughness: 0.5, emissive: '#3a362b', emissiveIntensity: 0.35 })
    const stripe = new THREE.MeshStandardMaterial({ color: '#c8402f', roughness: 0.5, emissive: '#4a1710', emissiveIntensity: 0.4 })
    const dark = new THREE.MeshStandardMaterial({ color: '#2b2f3a', roughness: 0.6 })
    disposers.push(() => [body, stripe, dark].forEach(m => m.dispose()))
    const s = 1.8
    const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.2 * s, 1.9 * s, 6, 14), body)
    fus.rotation.z = Math.PI / 2
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.205 * s, 0.205 * s, 0.22 * s, 14), stripe)
    band.rotation.z = Math.PI / 2
    band.position.x = -0.15
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.75 * s, 0.07 * s, 4.1 * s), body)
    wing.position.set(0.1, 0.5 * s, 0)
    const wingStripe = new THREE.Mesh(new THREE.BoxGeometry(0.2 * s, 0.075 * s, 4.12 * s), stripe)
    wingStripe.position.set(-0.17, 0.5 * s, 0)
    const strut = geoStrut(s)
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.5 * s, 0.7 * s, 0.05 * s), stripe)
    fin.position.set(-1.2 * s, 0.4 * s, 0)
    const stab = new THREE.Mesh(new THREE.BoxGeometry(0.4 * s, 0.05 * s, 1.3 * s), body)
    stab.position.set(-1.2 * s, 0.1 * s, 0)
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.5 * s, 0.14 * s, 0.42 * s), new THREE.MeshStandardMaterial({ color: '#8fc8e8', emissive: '#274a60', emissiveIntensity: 0.5, roughness: 0.2 }))
    win.position.set(0.2 * s, 0.1 * s, 0)
    const prop = new THREE.Group()
    prop.position.set(1.12 * s, 0, 0)
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.9 * s, 0.1), dark)
    prop.add(blade)
    const blur = new THREE.Mesh(new THREE.CircleGeometry(0.45 * s, 20), new THREE.MeshBasicMaterial({ color: '#cfd6e6', transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }))
    blur.rotation.y = Math.PI / 2
    prop.add(blur)
    const wheels = [-1, 1].map(z => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.14 * s, 0.14 * s, 0.07, 12), dark)
      w.rotation.x = Math.PI / 2
      w.position.set(0.45 * s, -0.4 * s, z * 0.4 * s)
      return w
    })
    planeBank.add(fus, band, wing, wingStripe, ...strut, fin, stab, win, prop, ...wheels)
    planeBank.traverse(o => o.isMesh && (o.castShadow = false))
    plane.userData.prop = prop
    const hit = new THREE.Mesh(new THREE.SphereGeometry(2.3, 10, 8), ghost)
    planeBank.add(hit)
    plane.userData.hit = hit
    disposers.push(() => blur.material.dispose())
  }
  function geoStrut(s) {
    const m = new THREE.MeshStandardMaterial({ color: '#2b2f3a', roughness: 0.6 })
    disposers.push(() => m.dispose())
    const out = []
    for (const z of [-1, 1]) {
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55 * s, 0.04), m)
      g.position.set(0.25 * s, 0.25 * s, z * 0.75 * s)
      g.rotation.x = z * 0.55
      out.push(g)
    }
    return out
  }
  // dry ice shed behind the plane
  const DRY_N = 150
  const dryPos = new Float32Array(DRY_N * 3)
  const dryCol = new Float32Array(DRY_N * 3)
  const dryLife = new Float32Array(DRY_N).fill(-1)
  const dryGeo = new THREE.BufferGeometry()
  dryGeo.setAttribute('position', new THREE.BufferAttribute(dryPos, 3))
  dryGeo.setAttribute('color', new THREE.BufferAttribute(dryCol, 3))
  const dryMat = new THREE.PointsMaterial({ size: 0.22, map: glow, transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending })
  const dryPts = new THREE.Points(dryGeo, dryMat)
  dryPts.frustumCulled = false
  dryPts.raycast = () => {}
  root.add(dryPts)
  disposers.push(() => (dryGeo.dispose(), dryMat.dispose()))
  let dryAt = 0
  let dryCarry = 0
  // the curtains of snow: a pool, each tied to a place and a time (a function of the wall clock)
  const streakTex = tex(streakTexture())
  const streakMat = new THREE.MeshBasicMaterial({ map: streakTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0, toneMapped: false })
  disposers.push(() => streakMat.dispose())
  const CUR_H = 4.6
  const makeCurtain = seed => {
    const g = new THREE.Group()
    const geo = new THREE.PlaneGeometry(2.8, CUR_H, 1, 8)
    geo.translate(0, -CUR_H / 2, 0)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + (-p.getY(i) / CUR_H) * 0.9)
    const m = new THREE.Mesh(geo, streakMat.clone())
    m.material.opacity = 0
    m.raycast = () => {}
    const field = flakeField({ count: light ? 36 : 90, w: 2.6, d: 1.4, h: CUR_H - 0.4, y: -0.1, speed: 0.75, size: 0.1, color: '#e2ebf8', glow: 1, sway: 0.2, slant: 0.2, fade: 0.55, seed })
    g.add(m, field.points)
    root.add(g)
    g.visible = false
    disposers.push(() => (geo.dispose(), m.material.dispose(), field.dispose()))
    return { g, m, field, x: 0, z: 0, ta: 0, hold: 14, fade: 6, max: 1, on: false, k: 0 }
  }
  const PASS_N = 9
  const BURN_N = 3
  const passCur = Array.from({ length: PASS_N }, (_, i) => makeCurtain(100 + i))
  const burnCur = Array.from({ length: BURN_N }, (_, i) => makeCurtain(200 + i))
  // the burner and its smoke
  const burner = new THREE.Group()
  burner.position.set(BURNER.x, 0, BURNER.z)
  root.add(burner)
  const stoneM = new THREE.MeshStandardMaterial({ color: '#7b7c80', roughness: 1 })
  disposers.push(() => stoneM.dispose())
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.3, 14), stoneM)
  base.position.y = 0.15
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.8, 16), metal)
  drum.position.y = 0.7
  const chim = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.9, 12), metal)
  chim.position.y = 1.5
  const flameMat = new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 12), flameMat)
  flame.position.y = 2.2
  const burnLabel = makeText(E.seed.signs.burner, { size: 0.15, color: '#ffffff', maxWidth: 1.8, anchorY: 'top', outlineWidth: 0.01, outlineColor: '#10142e' })
  burnLabel.position.set(0, 0.6, 0.95)
  burner.add(base, drum, chim, flame, burnLabel)
  const burnHit = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.4, 10), ghost)
  burnHit.position.y = 1.2
  burner.add(burnHit)
  disposers.push(() => flameMat.dispose())
  solids.push(circle(BURNER.x, BURNER.z, 0.9))
  const smoke = flakeField({ count: light ? 40 : 90, w: 0.3, d: 0.3, h: DECK_Y - 2.3, y: 2.3, speed: 0.9, size: 0.7, color: '#cfd5df', glow: 0.9, sway: 0.25, slant: 0.18, fade: 0.5, rise: true, grow: true, seed: 17 })
  smoke.points.position.set(BURNER.x, 0, BURNER.z)
  root.add(smoke.points)
  // the signpost: how much more snow? a little
  const signTex = tex(canvasTex(512, 256, null))
  let signLv = ''
  const drawSign = () => {
    const l = lv()
    if (signLv === l) return
    signLv = l
    signTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#d8c9a8'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = '#5b4a2e'
      g.lineWidth = 10
      g.strokeRect(5, 5, w - 10, h - 10)
      g.fillStyle = '#3a2a14'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.font = '800 44px Outfit, sans-serif'
      g.fillText(E.seed.sign.title, w / 2, 62)
      g.font = '700 34px Nunito, sans-serif'
      const txt = at(E.seed.sign.text, l)
      const words = txt.split(' ')
      const lines = ['']
      for (const wd of words) {
        const cand = `${lines[lines.length - 1]} ${wd}`.trim()
        if (g.measureText(cand).width > w - 50 && lines[lines.length - 1]) lines.push(wd)
        else lines[lines.length - 1] = cand
      }
      lines.forEach((ln, i) => g.fillText(ln, w / 2, 130 + i * 42))
    })
  }
  const signG = new THREE.Group()
  signG.position.set(SIGN.x, 0, SIGN.z)
  signG.rotation.y = -0.3
  root.add(signG)
  bx(0.1, 1.5, 0.1, wood, 0, 0.75, 0, signG)
  const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map: signTex, toneMapped: false }))
  signBoard.position.set(0, 1.45, 0.07)
  signG.add(signBoard)
  disposers.push(() => signBoard.material.dispose())
  solids.push(circle(SIGN.x, SIGN.z, 0.2))

  // the seeding's state
  let passT0 = 0 // when the plane began shedding dry ice (wall clock), 0 for never
  let burnT1 = 0 // when the burner was lit
  let burnEff = 0 // whether its smoke was active (the cloud colder than about -4 C when lit)
  let seedMine = false
  const BURN_LIFE = 26
  const curtainK = c => {
    const s = wall() - c.ta
    if (s < 0) return 0
    return clamp(s / 3.5) * (1 - clamp((s - c.hold) / c.fade)) * c.max
  }
  const arrangePass = () => {
    passCur.forEach((c, i) => {
      const ti = passT0 + ((i + 0.5) / PASS_N) * DISP
      const p = planeAt(ti)
      c.x = p.x
      c.z = p.z
      c.ta = ti + 0.8
      c.hold = 15
      c.fade = 6
      c.max = 1
    })
  }
  const arrangeBurn = () => {
    burnCur.forEach((c, i) => {
      c.x = BURNER.x + 1.0 + i * 1.9
      c.z = BURNER.z - 6.5 - i * 1.6
      c.ta = burnT1 + 6 + i * 1.5
      c.hold = 12
      c.fade = 6
      c.max = burnEff ? 0.6 : 0
    })
  }
  const planeStep = () => {
    const now = wall()
    if (passT0 && now - passT0 < DISP + 1) return (say(at(W.busy, lv())), false)
    passT0 = now
    arrangePass()
    seedMine = true
    play('beam')
    say(at(E.seed.says.plane, lv()))
    ex.discover('seed', seedPanel, 7)
    share('seed')
    return true
  }
  const burnerStep = () => {
    const now = wall()
    if (burnT1 && now - burnT1 < 10) return false
    burnT1 = now
    burnEff = cloudT <= T_AGI ? 1 : 0
    arrangeBurn()
    seedMine = true
    play('fizz')
    say(fill(at(E.seed.says[burnEff ? 'burner' : 'burnerWarm'], lv()), { t: fmtT(cloudT, lang) }))
    ex.discover('seed', seedPanel, 7)
    share('seed')
    return true
  }
  let slidSeed = false
  const slidCloud = () => {
    if (slidSeed) return
    slidSeed = true
    later(0.15, () => {
      slidSeed = false
      share('seed')
    })
  }
  const seedPanel = lv_ => ({
    title: E.seed.title,
    color: '#cfe6ff',
    blocks: [
      ...E.seed.panel[depth(lv_)].map(p => ({ p })),
      { slider: { label: E.seed.slider, min: -25, max: -1, step: 0.5, value: cloudT, onInput: v => ((cloudT = v), slidCloud()), format: v => `${fmtT(v, lang)} °C`, live: () => cloudT } },
      { buttons: [{ label: E.seed.buttons.plane, onClick: () => planeStep() }, { label: E.seed.buttons.burner, onClick: () => burnerStep() }] },
    ],
  })
  ex.add({
    id: 'seed',
    x: -0.8,
    z: -1.2,
    radius: 3.4,
    manual: true,
    label: E.seed.label,
    verb: () => (passT0 && wall() - passT0 < 22 ? E.seed.hints.watch : E.seed.hints.both),
    focus: focusOf(0.3, 3.8, -9.5, 11.0, 14),
    act: () => ctx.showPanel(seedPanel),
  })
  clickable(plane.userData.hit, () => planeStep(), { reach: 70 })
  clickable(burnHit, () => burnerStep(), { reach: 12 })

  const tmpA = V(0, 0, 0)
  updates.push((dt, t) => {
    const now = wall()
    // the plane on its racetrack
    planeAt(now, plane.position)
    const yaw = planeYaw(now)
    plane.rotation.y = yaw
    planeBank.rotation.x = -0.18 + 0.04 * Math.sin(now * 0.8)
    plane.userData.prop.rotation.x = t * 40
    plane.position.y += Math.sin(now * 0.9) * 0.1
    // dry ice from the plane while it is shedding
    const dispensing = passT0 > 0 && now >= passT0 && now < passT0 + DISP
    if (dispensing) {
      dryCarry += dt * 22
      while (dryCarry > 1) {
        dryCarry--
        const k = dryAt++ % DRY_N
        dryLife[k] = 0
        dryPos.set([plane.position.x - Math.cos(yaw) * 0.8 + (Math.random() - 0.5) * 0.5, plane.position.y - 0.2, plane.position.z + Math.sin(yaw) * 0.8 + (Math.random() - 0.5) * 0.5], k * 3)
      }
    }
    for (let k = 0; k < DRY_N; k++) {
      if (dryLife[k] < 0) {
        dryCol.set([0, 0, 0], k * 3)
        continue
      }
      dryLife[k] += dt
      dryPos[k * 3 + 1] -= dt * (0.5 + dryLife[k] * 0.25)
      dryPos[k * 3] += Math.sin(dryLife[k] * 3 + k) * dt * 0.2
      if (dryLife[k] > 3.2) {
        dryLife[k] = -1
        continue
      }
      const f = clamp(1 - dryLife[k] / 3.2) * (0.6 + 0.4 * Math.sin(dryLife[k] * 20 + k))
      dryCol.set([f * 1.3, f * 1.4, f * 1.5], k * 3)
    }
    dryGeo.attributes.position.needsUpdate = true
    dryGeo.attributes.color.needsUpdate = true
    // the curtains and the cloud turned to ice
    const cam = ctx.camera
    const px = ctx.renderer.getDrawingBufferSize(tmpA).y / (2 * Math.tan((cam.fov * Math.PI) / 360))
    glitter.u.uPx.value = snowIn.u.uPx.value = smoke.u.uPx.value = px
    for (const c of [...passCur, ...burnCur]) {
      const k = (passT0 || burnT1) ? curtainK(c) : 0
      c.k = k
      c.g.visible = k > 0.01
      if (!c.g.visible) continue
      c.g.position.set(c.x, deck.y - 0.1, c.z)
      c.g.rotation.y = Math.atan2(cam.position.x - c.x, cam.position.z - c.z)
      c.m.material.opacity = k * 0.62
      c.field.u.uT.value = t
      c.field.u.uK.value = k
      c.field.u.uPx.value = px
    }
    deck.set((x, z) => {
      let s = 0
      for (const c of passCur) if (c.k > 0.01) s = Math.max(s, c.k * Math.exp(-((x - c.x) ** 2 + (z - c.z) ** 2) / (2 * 3.4 * 3.4)))
      for (const c of burnCur) if (c.k > 0.01) s = Math.max(s, c.k * Math.exp(-((x - c.x) ** 2 + (z - c.z) ** 2) / (2 * 3.0 * 3.0)))
      return s
    })
    deck.update(t)
    // the burner and its smoke
    const burning = burnT1 > 0 && now - burnT1 < BURN_LIFE
    flameMat.opacity = damp(flameMat.opacity, burning ? 0.85 : 0, 6, dt)
    flame.scale.set(1 + Math.sin(t * 14) * 0.1, 1 + Math.sin(t * 11 + 1) * 0.18, 1)
    smoke.u.uK.value = damp(smoke.u.uK.value, burning ? 0.55 : 0, 2, dt)
    // time for every field
    glitter.u.uT.value = snowIn.u.uT.value = smoke.u.uT.value = t
    drawSign()
    void seedMine
  })
  // the moving sun's light on the cloud is the stage's; nothing else to do each frame

  // ---- the Atomling, the way in and out ----
  const shared = {
    box: {
      get: () => ({ T: boxT, n: boxCount, a: lastAct, age: lastAct ? Math.round((wall() - lastActAt) * 10) / 10 : 0 }),
      set: (s, live, ago) => {
        const T = clamp(Number(s?.T) || 0, T_MIN, 0)
        const changed = Math.abs(T - boxT) > 0.01
        setBoxT(T)
        const n = Math.max(0, Math.round(Number(s?.n) || 0))
        const a = typeof s?.a === 'string' ? s.a : ''
        const known = a === 'breath' || a === 'lid' || JARS.some(j => j[0] === a)
        if (live && known && n === boxCount + 1) {
          boxCount = n
          boxAct(a, { mine: false })
        } else if (n !== boxCount || (!live && known)) {
          boxCount = n
          if (known) {
            // as it stands: the last action, run on by how long ago it was
            phase = 'empty'
            cloudK = 0
            boxAct(a, { mine: false, age: Math.max(0, Number(s?.age) || 0) + Math.max(0, Number(ago) || 0) })
          }
        }
        void changed
      },
    },
    crystals: {
      get: () => ({ s: tileState }),
      set: (s, live) => {
        const to = s?.s === 'agi' || s?.s === 'salt' ? s.s : 'home'
        if (to === tileState) return
        setTile(to, { instant: !live })
        if (live) play(to === 'agi' ? 'select' : 'tap')
      },
    },
    seed: {
      get: () => ({ T: cloudT, p: passT0 ? Math.round(passT0 * 1000) / 1000 : 0, b: burnT1 ? Math.round(burnT1 * 1000) / 1000 : 0, e: burnEff }),
      set: (s, live) => {
        cloudT = clamp(Number(s?.T) || -18.5, -25, -1)
        const p = Number(s?.p) || 0
        const b = Number(s?.b) || 0
        if (p !== passT0) {
          passT0 = p
          if (p) arrangePass()
          if (live && p) play('beam')
        }
        if (b !== burnT1) {
          burnT1 = b
          burnEff = s?.e ? 1 : 0
          if (b) arrangeBurn()
          if (live && b) play('fizz')
        }
      },
    },
  }

  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const jarAt = id => jarObjs[id].g.localToWorld(V(0, 0.3, 0))

  return {
    env: { ...stage.env, bloom: { strength: 0.45, radius: 0.5, threshold: 0.88 } },
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.9 },
    cameraPitchMax: 0.6,
    spawn: { x: 0, z: 5.2, yaw: 0 },
    hostSpot: { x: 1.8, z: 4.4, yaw: Math.atan2(1.8, -0.8) },
    back: { x: 0, z: 9.5, rot: Math.PI },
    stand: { x: -3.4, z: 4.0, rot: Math.atan2(3.4, 1.2) },
    parts: {
      rayTo,
      box: {
        get phase() { return phase },
        get T() { return boxT },
        get cloud() { return cloudK },
        step: a => boxStep(a),
      },
      crystals: { get state() { return tileState }, step: to => crystalStep(to) },
      seed: {
        get T() { return cloudT },
        get passing() { return !!(passT0 && wall() - passT0 < DISP) },
        get burning() { return !!(burnT1 && wall() - burnT1 < BURN_LIFE) },
        get curtains() { return [...passCur, ...burnCur].filter(c => c.k > 0.05).length },
        plane: () => planeStep(),
        burner: () => burnerStep(),
      },
      at: {
        tube: () => hut.localToWorld(tubeCurve.getPoint(0.8)),
        lid: () => lidHit.getWorldPosition(V(0, 0, 0)),
        jar: id => jarAt(id),
        agi: () => agiStand.board.localToWorld(V(0.2, 0.2, 0.1)),
        salt: () => saltStand.board.localToWorld(V(0, 0, 0.1)),
        ice: () => iceBoard.localToWorld(V(0, 0, 0.05)),
        plane: () => plane.position.clone(),
        burner: () => burner.localToWorld(V(0, 1.2, 0)),
      },
    },
    panels: { box: boxPanel, crystals: crystalsPanel, seed: seedPanel },
    shared,
    update(dt, t) {
      for (const u of updates) u(dt, t)
      stage.update(t)
    },
    dispose() {
      stage.dispose()
      deck.dispose()
      for (const f of [glitter, snowIn, smoke]) f.dispose()
      for (const d of disposers) d()
      for (const tx of textures) tx.dispose()
      stoneM.dispose()
    },
  }
}
