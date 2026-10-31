// Hydrogen's picture "How can a gas lift a ship?" as a room (docs/knowledge/picture-rooms.md): the picture
// made into the Tuileries garden in Paris on 1 December 1783, a winter afternoon (stages/garden.js): the
// gravel square roped off, a huge crowd behind the ropes, the palace at the end of the walk. In the middle
// stands Charles and Robert's red and yellow balloon, still slack, hung between two masts, the barrels that
// make its hydrogen beside it. Three things to do, each step chosen by tapping its thing (the user,
// 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap, E opens the
// station's panel, whose buttons (and sliders) do the same:
// - La Charlière: tap the barrels (acid on iron filings: the gas bubbles through the water tub and up the
//   hose), the balloon swells a fifth at a time (a slider too); a spring balance on a post shows how hard
//   it pulls at its ropes; tap a sandbag to drop it, tap the ropes to let go: too heavy and it stays, light
//   enough and it climbs (faster the lighter) and the wind takes it north over the trees, toward
//   Nesles-la-Vallée; a fresh balloon is laid out for the next flight;
// - the gas race: four balloons of one cubic metre on spring scales, air, helium, hydrogen and a hot-air
//   one (a temperature slider): tap each to fill it, the scale reads its lift per cubic metre from the real
//   densities at 20 °C. The picture's lens on the hydrogen balloon's skin shows its molecules beside the
//   air's: tap it to weigh them. The picture draws fewer molecules inside than outside; the room shows the
//   truth, the same number on each side (Avogadro), each hydrogen molecule 14 times lighter and about four
//   times faster, and the air's push round the balloon, harder from below;
// - why helium now: a cut-away model of the Hindenburg (LZ 129, 1:100) in a glass case (tap it: its 16 gas
//   cells, then its passenger decks), and the science-show test: tap a balloon and the candle on its long
//   stick swings to it: hydrogen goes up in a ball of flame, helium only pops.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<exhibit>.tap(...) does what a tap does, for the probes.
// Sources: Charles's flight (Wikipedia "Jacques Charles"; the V&A's "Flying high"; Béving in Arc-en-ciel 136:
// 26 French feet across); densities at 20 °C and 1 atm (air 1.204, helium 0.166, hydrogen 0.084 kg/m3);
// the Hindenburg (Wikipedia "LZ 129 Hindenburg": 245 m, 41 m across, 16 gas cells, 200,000 m3, decks A and B
// in the hull, 36 passengers and 61 crew, 35 of them and one man on the ground died).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, fill, num, random } from '../../../wings/noble/kit.js'
import { gardenStage } from '../../stages/garden.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { AIRSHIP_WORDS } from './airship.words.js'

export const WORDS = AIRSHIP_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const lerp = (a, b, k) => a + (b - a) * k
// wall-clock seconds: shared ages are timed by it (frame times drift, picture-rooms.md)
const clock = () => performance.now() / 1000

// ---- the science ----
// kilograms per cubic metre at 20 °C and 1 atm
const RHO = { air: 1.204, he: 0.166, h2: 0.084 }
const T0 = 293.15
const hotLift = c => Math.max(0, RHO.air * (1 - T0 / (c + 273.15)))

// ---- where things stand (metres; the spawn at z = 10 looks along -z, toward the palace; +x is south) ----
const SPAWN = { x: 0, z: 8.4 }
const BACK = { x: 0, z: 11.0 }
const STAND = { x: -3.2, z: 6.8 }
const HOST = { x: 2.8, z: 7.0 }
const CAR = { x: 0, z: -5.4 }
// the balloon: 26 French feet across (about 8.5 m), hung from the masts by its crown while it fills
const ENV = { R: 4.25, NECK_R: 0.42, TOP: 11.7, GORES: 24 }
const YC = ENV.TOP - ENV.R
const TH_N = Math.PI - Math.asin(ENV.NECK_R / ENV.R)
const NECK_FULL = YC + ENV.R * Math.cos(TH_N)
const MAST_X = 5.9
const MAST_H = 12.6
const VAT = { x: 3.4, z: CAR.z + 1.05, r: 0.72, h: 0.8 }
const BARRELS = [210, 240, 270, 300, 330, 0].map(a => ({ x: VAT.x + Math.cos((a * Math.PI) / 180) * 1.5, z: VAT.z + Math.sin((a * Math.PI) / 180) * 1.5 }))
const DIAL = { x: -1.55, z: CAR.z + 2.05 }
const STAKES = [
  { x: 2.5, z: CAR.z + 1.9 },
  { x: 2.5, z: CAR.z - 1.9 },
  { x: -2.5, z: CAR.z - 1.9 },
]
// the car's corners the ropes are tied to (car coordinates); the first three go to the stakes, the last to
// the spring balance
const CORNERS = [
  [1.0, 0.95, 0.42],
  [1.0, 0.95, -0.42],
  [-1.0, 0.95, -0.42],
  [-1.0, 0.95, 0.42],
]
const BAGS = [
  [-0.7, 0.62],
  [-0.23, 0.62],
  [0.23, 0.62],
  [0.7, 0.62],
  [-1.24, 0],
  [1.24, 0],
]
// lift and load in units of the full balloon's lift: the balloon, net, car, Charles and Robert, and the sand
const LOAD = 0.75
const BAG = 0.035
const FLIGHT = 46
// the wind toward Nesles-la-Vallée, north-north-west (north is -x here, west +z)
const WIND = new THREE.Vector3(-0.93, 0, 0.36).normalize()
const WIND_SPEED = 3.2
const S1 = { x: 1.5, z: CAR.z + 5.0 }

// the gas race: four balloons of one cubic metre on spring scales, in a row across the view
const RACE_X = -8.2
const RACE = [
  { id: 'hot', z: 2.2 },
  { id: 'air', z: 0.9 },
  { id: 'he', z: -0.4 },
  { id: 'h2', z: -1.7 },
]
const BALL_R = Math.cbrt(3 / (4 * Math.PI))
const POST_H = 1.35
const STRING = 0.85
const LENS = { x: -9.0, y: 4.35, z: -1.05, r: 0.85 }
const S2 = { x: -5.5, z: 0.35 }

// why helium: the model in its case, the two balloons, the candle on its stick
const CASE = { x: 9.3, z: -1.65, len: 2.95, w: 0.8, top: 0.86, h: 0.78 }
const HULL = { len: 2.45, r: 0.205 }
const POLES = { h2: { x: 8.85, z: 0.95 }, he: { x: 8.85, z: 2.15 } }
const POLE_H = 1.55
const CANDLE = { x: 7.75, z: 1.55, pivot: 0.95, len: 1.25 }
const S3 = { x: 6.2, z: -0.35 }

/** A soft round glow. */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A candle flame: a teardrop, white at its heart, orange at its edge. */
function flameTex() {
  return canvasTex(64, 128, (g, w, h) => {
    g.save()
    g.translate(w / 2, h * 0.7)
    g.scale(1, 2.3)
    const grd = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.45)
    grd.addColorStop(0, 'rgba(255,255,235,1)')
    grd.addColorStop(0.3, 'rgba(255,214,120,0.95)')
    grd.addColorStop(0.65, 'rgba(255,140,40,0.55)')
    grd.addColorStop(1, 'rgba(255,90,20,0)')
    g.fillStyle = grd
    g.beginPath()
    g.arc(0, 0, w * 0.45, 0, TAU)
    g.fill()
    g.restore()
  })
}

/** A ball of fire: billows of yellow and orange round a pale heart. */
function fireTex() {
  return canvasTex(256, 256, (g, w) => {
    const rnd = random(4)
    g.clearRect(0, 0, w, w)
    for (let i = 0; i < 28; i++) {
      const a = rnd() * TAU
      const d = rnd() * w * 0.22
      const x = w / 2 + Math.cos(a) * d
      const y = w / 2 + Math.sin(a) * d
      const r = w * (0.12 + rnd() * 0.16)
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, 'rgba(255,240,200,0.9)')
      grd.addColorStop(0.45, 'rgba(255,170,60,0.55)')
      grd.addColorStop(1, 'rgba(230,80,20,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, r * 2, r * 2)
    }
  })
}

/** The balloon's skin: gores of red and yellow silk, the seams, the net's rings over the top and the hoop
 *  at the equator (u round, v from the neck at 0 to the crown at 1). */
function envelopeTex(light) {
  const w = light ? 512 : 1024
  const h = light ? 256 : 512
  return canvasTex(w, h, g => {
    const gw = w / ENV.GORES
    for (let i = 0; i < ENV.GORES; i++) {
      g.fillStyle = i % 2 ? '#e2ad2c' : '#c93140'
      g.fillRect(i * gw, 0, gw + 1, h)
    }
    // the varnish's sheen down each gore
    for (let i = 0; i < ENV.GORES; i++) {
      const grd = g.createLinearGradient(i * gw, 0, (i + 1) * gw, 0)
      grd.addColorStop(0, 'rgba(0,0,0,0.08)')
      grd.addColorStop(0.5, 'rgba(255,255,255,0.06)')
      grd.addColorStop(1, 'rgba(0,0,0,0.08)')
      g.fillStyle = grd
      g.fillRect(i * gw, 0, gw, h)
    }
    g.strokeStyle = 'rgba(70,40,20,0.85)'
    g.lineWidth = light ? 1.5 : 2.5
    for (let i = 0; i <= ENV.GORES; i++) {
      g.beginPath()
      g.moveTo(i * gw, 0)
      g.lineTo(i * gw, h)
      g.stroke()
    }
    // the net's rings over the upper half
    g.lineWidth = light ? 1.5 : 2
    for (const v of [0.62, 0.74, 0.86]) {
      g.beginPath()
      g.moveTo(0, h * (1 - v))
      g.lineTo(w, h * (1 - v))
      g.stroke()
    }
    // the hoop at the equator
    g.fillStyle = '#6b4424'
    g.fillRect(0, h * 0.5 - h * 0.012, w, h * 0.024)
    g.fillStyle = '#c99a4a'
    g.fillRect(0, h * 0.5 - h * 0.004, w, h * 0.008)
  })
}

/** The car's sides: Rococo blue with gold borders and scrolls (u along the car, v up). */
function carTex() {
  return canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#2b4b93'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = '#d9a73c'
    g.lineWidth = 7
    g.strokeRect(w * 0.12, h * 0.22, w * 0.76, h * 0.42)
    g.lineWidth = 4
    for (const s of [-1, 1]) {
      for (let k = 0; k < 3; k++) {
        g.beginPath()
        const cx = w / 2 + s * (w * 0.1 + k * w * 0.1)
        g.arc(cx, h * 0.43, h * 0.09, s > 0 ? Math.PI : 0, s > 0 ? Math.PI * 2.4 : Math.PI * 1.4)
        g.stroke()
      }
    }
    // a gold medallion in the middle
    g.fillStyle = '#d9a73c'
    g.beginPath()
    g.ellipse(w / 2, h * 0.43, h * 0.11, h * 0.14, 0, 0, TAU)
    g.fill()
    g.fillStyle = '#2b4b93'
    g.beginPath()
    g.ellipse(w / 2, h * 0.43, h * 0.07, h * 0.1, 0, 0, TAU)
    g.fill()
    // the gold rim along the top
    g.fillStyle = '#d9a73c'
    g.fillRect(0, h * 0.08, w, h * 0.06)
  })
}

/** A spring balance's face: a cream dial, ticks round three quarters of a turn, `marks` numbered. */
function dialTex({ marks = 10, labels = null, color = '#c93140' } = {}) {
  return canvasTex(256, 256, (g, w) => {
    const c = w / 2
    g.fillStyle = '#6b5a3a'
    g.beginPath()
    g.arc(c, c, c, 0, TAU)
    g.fill()
    g.fillStyle = '#d8cdb0'
    g.beginPath()
    g.arc(c, c, c * 0.88, 0, TAU)
    g.fill()
    g.strokeStyle = '#2c2418'
    for (let i = 0; i <= marks * 2; i++) {
      const a = (-225 + (270 * i) / (marks * 2)) * (Math.PI / 180)
      const big = i % 2 === 0
      g.lineWidth = big ? 5 : 3
      g.beginPath()
      g.moveTo(c + Math.cos(a) * c * (big ? 0.6 : 0.68), c + Math.sin(a) * c * (big ? 0.6 : 0.68))
      g.lineTo(c + Math.cos(a) * c * 0.8, c + Math.sin(a) * c * 0.8)
      g.stroke()
    }
    // the zone of a pull
    g.strokeStyle = color
    g.lineWidth = 8
    g.beginPath()
    g.arc(c, c, c * 0.84, (-225 * Math.PI) / 180, (45 * Math.PI) / 180)
    g.stroke()
    if (labels) {
      g.fillStyle = '#2c2418'
      g.font = '700 30px Outfit, sans-serif'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      labels.forEach((t, i) => {
        const a = (-225 + (270 * i) / (labels.length - 1)) * (Math.PI / 180)
        g.fillText(t, c + Math.cos(a) * c * 0.44, c + Math.sin(a) * c * 0.44)
      })
    }
  })
}

/** A line of geometry between two points (a cylinder of height 1), for ropes and strings that move. */
function stretch(mesh, a, b) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.scale.set(1, Math.max(0.001, a.distanceTo(b)), 1)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
}

/** The cap of a sphere (radius R) holding a share f of its volume: the angle from the top to its rim. */
function capAngle(f) {
  if (f <= 0) return 0
  if (f >= 1) return TH_N
  const R = ENV.R
  let lo = 0
  let hi = 2 * R
  for (let i = 0; i < 32; i++) {
    const h = (lo + hi) / 2
    if ((h * h * (3 * R - h)) / (4 * R * R * R) < f) lo = h
    else hi = h
  }
  return Math.min(TH_N, Math.acos(clamp(1 - (lo + hi) / 2 / R, -1, 1)))
}

// ---- the room ----

export async function build({ ctx, root, lang, E, W, ex, say, later, light, level, color, clickable }) {
  const stage = gardenStage({ light, x0: -11, x1: 11, z0: -13, z1: 12 })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const soft = softTex()
  const flame = flameTex()
  const fire = fireTex()
  textures.push(soft, flame, fire)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const unit = new THREE.CylinderGeometry(1, 1, 1, 6)
  const ropeMat = mats.rope
  const lineMat = new THREE.MeshStandardMaterial({ color: '#5c4026', roughness: 0.9 })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#d6e6ee', roughness: 0.05, metalness: 0.1, transparent: true, opacity: light ? 0.12 : 0.18, depthWrite: false })
  const flameMat = new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd9a0').multiplyScalar(2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  const plaqueMat = new THREE.MeshStandardMaterial({ color: '#1b2238', roughness: 0.5, metalness: 0.2 })
  const tmp = new THREE.Vector3()
  const dummy = new THREE.Object3D()
  const rope = (r = 0.02, mat = ropeMat) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 5), mat)

  /** A small dark plaque with gold words (a sign that reads from a few metres), facing +z. */
  function plaque(text, { size = 0.11, width = 0.9, maxWidth = 3 } = {}) {
    const g = new THREE.Group()
    const t = makeText(text, { size, color: '#f2cf7a', maxWidth, anchorY: 'middle' })
    t.position.z = 0.016
    const back = new THREE.Mesh(new RoundedBoxGeometry(width, size * 2.1, 0.03, 2, 0.01), plaqueMat)
    g.add(back, t)
    return { group: g, text: t, back }
  }
  const setText = (t, s) => {
    if (t.text === s) return
    t.text = s
    t.sync()
  }

  // ======== La Charlière: the balloon, its car, the masts, the barrels and the hose ========
  // what the visitor's taps have made of it (shared): the hydrogen in it, the bags dropped, the flight
  const C = { fill: 0, shown: 0, gone: BAGS.map(() => 0), fly: null, heavyT: -9, told: false }
  const balloon = new THREE.Group()
  balloon.position.set(CAR.x, 0, CAR.z)
  root.add(balloon)
  const envTex = envelopeTex(light)
  textures.push(envTex)
  const NS = light ? 30 : 44
  const NP = light ? 36 : 48
  const envGeo = new THREE.BufferGeometry()
  const envPos = new Float32Array((NS + 1) * (NP + 1) * 3)
  {
    const uv = new Float32Array((NS + 1) * (NP + 1) * 2)
    const idx = []
    for (let i = 0; i <= NS; i++) {
      for (let j = 0; j <= NP; j++) {
        const k = i * (NP + 1) + j
        uv[k * 2] = j / NP
        uv[k * 2 + 1] = 1 - i / NS
        if (i < NS && j < NP) {
          const a = k
          const b = k + NP + 1
          idx.push(a, b, a + 1, b, b + 1, a + 1)
        }
      }
    }
    envGeo.setAttribute('position', new THREE.BufferAttribute(envPos, 3))
    envGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    envGeo.setIndex(idx)
  }
  const envMat = new THREE.MeshStandardMaterial({ map: envTex, roughness: 0.5, metalness: 0.02, side: THREE.DoubleSide })
  const envelope = new THREE.Mesh(envGeo, envMat)
  envelope.castShadow = true
  balloon.add(envelope)
  let neckY = 1.75
  // the envelope's shape for a share f of hydrogen: the gas gathers in a dome under the crown, the rest of
  // the silk hangs below it in folds down to the neck; full, a sphere
  function shapeEnvelope(f) {
    const R = ENV.R
    const thb = capAngle(f)
    const rb = R * Math.sin(thb)
    const yb = YC + R * Math.cos(thb)
    const yn = lerp(1.75, NECK_FULL, ease(f))
    neckY = yn
    const L = R * (TH_N - thb)
    const D = Math.hypot(rb - ENV.NECK_R, yb - yn)
    const slack = clamp(1 - D / Math.max(L, 1e-3))
    for (let i = 0; i <= NS; i++) {
      const th = (i / NS) * TH_N
      let r
      let y
      let fold
      if (th <= thb + 1e-6) {
        r = R * Math.sin(th)
        y = YC + R * Math.cos(th)
        fold = 0.015 * (1 - f) * Math.pow(th / Math.max(thb, 1e-3), 4)
      } else {
        const t = (th - thb) / Math.max(TH_N - thb, 1e-3)
        r = lerp(rb, ENV.NECK_R, Math.pow(t, 0.85))
        const limp = (1 - f) * (1 - f) * 0.85 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.6)
        r = Math.max(r, limp)
        y = lerp(yb, yn, t)
        fold = (0.1 + 0.55 * slack) * Math.pow(Math.sin(Math.PI * t), 0.5) * (1 - 0.6 * f)
      }
      for (let j = 0; j <= NP; j++) {
        const phi = (j / NP) * TAU
        const rr = Math.max(0.02, r * (1 + fold * Math.sin(phi * (ENV.GORES / 2) + i * 0.15)))
        const k = (i * (NP + 1) + j) * 3
        envPos[k] = Math.cos(phi) * rr
        envPos[k + 1] = y
        envPos[k + 2] = Math.sin(phi) * rr
      }
    }
    envGeo.attributes.position.needsUpdate = true
    envGeo.computeVertexNormals()
    envGeo.computeBoundingSphere()
  }
  shapeEnvelope(0)
  // where the net's cords leave the envelope (its widest ring when full), in balloon coordinates
  const ringAt = (j, out) => {
    const k = ((NS >> 1) * (NP + 1) + Math.round((j * NP) / 12)) * 3
    return out.set(envPos[k], envPos[k + 1], envPos[k + 2])
  }

  // the car: a little boat of Rococo blue and gold, Charles and Robert in it
  const car = new THREE.Group()
  balloon.add(car)
  const carParts = { arms: [] }
  {
    const s = new THREE.Shape()
    s.moveTo(-1.18, 1.28)
    s.quadraticCurveTo(-1.26, 0.35, -0.75, 0.13)
    s.lineTo(0.75, 0.13)
    s.quadraticCurveTo(1.26, 0.35, 1.18, 1.28)
    s.quadraticCurveTo(1.06, 1.08, 0.95, 0.98)
    s.lineTo(-0.95, 0.98)
    s.quadraticCurveTo(-1.06, 1.08, -1.18, 1.28)
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.94, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2, curveSegments: 10 })
    g.translate(0, 0, -0.47)
    const ct = carTex()
    textures.push(ct)
    ct.repeat.set(1 / 2.5, 1 / 1.35)
    ct.offset.set(0.5, 0)
    ct.wrapS = ct.wrapT = THREE.ClampToEdgeWrapping
    const hull = new THREE.Mesh(g, [new THREE.MeshStandardMaterial({ map: ct, roughness: 0.55 }), new THREE.MeshStandardMaterial({ color: '#2b4b93', roughness: 0.6 })])
    hull.castShadow = true
    car.add(hull)
    // a gold rail along both sides
    for (const z of [-0.5, 0.5]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.95, 8), mats.gold)
      rail.rotation.z = Math.PI / 2
      rail.position.set(0, 1.0, z)
      car.add(rail)
    }
    // the skids it rests on
    for (const z of [-0.3, 0.3]) {
      const skid = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.08), mats.darkWood)
      skid.position.set(0, 0.06, z)
      car.add(skid)
    }
    // Charles and Robert: coats, tricorn hats, arms to wave
    const people = [
      { x: -0.42, coat: '#3a3550', vest: '#c9b98e' },
      { x: 0.42, coat: '#5a3a2a', vest: '#d8cfb8' },
    ]
    const skin = new THREE.MeshStandardMaterial({ color: '#e0b896', roughness: 0.8 })
    const hat = new THREE.MeshStandardMaterial({ color: '#1e1c1c', roughness: 0.8 })
    for (const p of people) {
      const coat = new THREE.MeshStandardMaterial({ color: p.coat, roughness: 0.85 })
      const body = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.2, 0], [0.19, 0.45], [0.2, 0.62], [0.12, 0.74], [0, 0.76]].map(([r, y]) => new THREE.Vector2(r, y)), 10), coat)
      body.position.set(p.x, 0.8, 0)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), skin)
      head.position.set(p.x, 1.68, 0)
      const tri = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.07, 3), hat)
      tri.position.set(p.x, 1.8, 0)
      tri.rotation.y = Math.PI / 2
      car.add(body, head, tri)
      for (const side of [-1, 1]) {
        const arm = new THREE.Group()
        arm.position.set(p.x + side * 0.19, 1.48, 0)
        const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.5, 6), coat)
        sleeve.position.y = -0.25
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), skin)
        hand.position.y = -0.52
        arm.add(sleeve, hand)
        arm.rotation.z = side * 0.25
        car.add(arm)
        carParts.arms.push({ arm, side, seed: p.x * 7 + side })
      }
    }
  }
  // the sandbags along its side, each on a short cord from the rail
  const bagGeo = new THREE.IcosahedronGeometry(1, 1)
  bagGeo.scale(0.15, 0.2, 0.13)
  const bagMat = new THREE.MeshStandardMaterial({ color: '#a8916a', roughness: 0.95 })
  const bags = BAGS.map(([x, z], i) => {
    const g = new THREE.Group()
    const sack = new THREE.Mesh(bagGeo, bagMat)
    sack.castShadow = true
    const tie = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 4), lineMat)
    tie.position.y = 0.26
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), ghost)
    g.add(sack, tie, hit)
    const home = new THREE.Vector3(x, 0.74, z * 1.0)
    g.position.copy(home)
    car.add(g)
    return { group: g, home, i, fall: null }
  })
  // the bags that fell: they lie where they landed until a new balloon comes
  const fallen = new THREE.Group()
  root.add(fallen)
  const sandPuff = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#cbb88e', transparent: true, opacity: 0, depthWrite: false }))
  root.add(sandPuff)
  let puffT = 9

  // the net's twelve cords from the envelope's hoop down to the car's rail
  const cords = Array.from({ length: 12 }, () => {
    const m = rope(0.012, lineMat)
    balloon.add(m)
    return m
  })
  const railAt = (j, out) => {
    const a = (j / 12) * TAU
    return out.set(Math.cos(a) * 1.0, 1.0 + car.position.y, Math.sin(a) * 0.48)
  }

  // the masts the balloon hangs from while it fills, and the rope over its crown
  const crownRopes = []
  for (const s of [-1, 1]) {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.17, MAST_H, 10), mats.wood)
    mast.position.set(CAR.x + s * MAST_X, MAST_H / 2, CAR.z)
    mast.castShadow = true
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), mats.brass)
    cap.position.set(CAR.x + s * MAST_X, MAST_H + 0.08, CAR.z)
    root.add(mast, cap)
    solids.push(circle(CAR.x + s * MAST_X, CAR.z, 0.3))
    const r = rope(0.025)
    root.add(r)
    crownRopes.push({ r, from: new THREE.Vector3(CAR.x + s * MAST_X, MAST_H - 0.1, CAR.z) })
    // a guy rope from the mast's top to the ground outside
    const guy = rope(0.016)
    stretch(guy, new THREE.Vector3(CAR.x + s * MAST_X, MAST_H - 0.3, CAR.z), new THREE.Vector3(CAR.x + s * (MAST_X + 3.2), 0, CAR.z))
    root.add(guy)
  }
  solids.push(box(CAR.x, CAR.z, 2.5, 1.2))

  // the tethers: three to stakes, the fourth through the spring balance on its post
  const tethers = CORNERS.map((c, i) => {
    const r = rope(0.022)
    const hit = new THREE.Mesh(unit, ghost)
    hit.scale.set(0.2, 1, 0.2)
    root.add(r)
    const anchor = i < 3 ? new THREE.Vector3(STAKES[i].x, 0.25, STAKES[i].z) : new THREE.Vector3(DIAL.x, 1.0, DIAL.z)
    if (i < 3) {
      const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.45, 6), mats.darkWood)
      stake.position.set(STAKES[i].x, 0.2, STAKES[i].z)
      stake.rotation.z = 0.2
      root.add(stake)
    }
    return { r, hit, anchor, corner: new THREE.Vector3(...c) }
  })
  const ropeHits = new THREE.Group()
  for (const t of tethers) ropeHits.add(t.hit)
  root.add(ropeHits)

  // the spring balance on its post: how hard the balloon pulls up
  const dial = new THREE.Group()
  const dialNeedle = new THREE.Group()
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.15, 8), mats.darkWood)
    post.position.y = 0.575
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.34, 40), new THREE.MeshStandardMaterial({ map: (() => {
      const t = dialTex({ marks: 6 })
      textures.push(t)
      return t
    })(), roughness: 0.6 }))
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.025, 8, 40), mats.brass)
    const head = new THREE.Group()
    head.position.y = 1.42
    head.rotation.x = -0.25
    face.position.z = 0.01
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.26, 0.01), new THREE.MeshStandardMaterial({ color: '#7a1218', roughness: 0.5 }))
    needle.position.y = 0.11
    dialNeedle.add(needle)
    dialNeedle.position.z = 0.025
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 10), mats.brass)
    hub.rotation.x = Math.PI / 2
    hub.position.z = 0.03
    const backing = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 32), mats.brass)
    backing.rotation.x = Math.PI / 2
    backing.position.z = -0.03
    head.add(backing, face, rim, dialNeedle, hub)
    const word = makeText(E.charliere.dial, { size: 0.1, color: '#2c2418', anchorY: 'middle', maxWidth: 0.5 })
    word.position.set(0, -0.16, 0.02)
    head.add(word)
    dial.add(post, head)
    dial.position.set(DIAL.x, 0, DIAL.z)
    dial.rotation.y = Math.atan2(S1.x - DIAL.x, S1.z - DIAL.z)
    root.add(dial)
    solids.push(circle(DIAL.x, DIAL.z, 0.2))
  }
  const setDial = pull => (dialNeedle.rotation.z = -((-135 + 270 * clamp(pull / 0.3)) * Math.PI) / 180)

  // the barrels, the water tub and the hose up to the balloon's neck
  const barrelGeo = new THREE.LatheGeometry([[0, 0], [0.31, 0], [0.36, 0.25], [0.38, 0.47], [0.36, 0.7], [0.31, 0.95], [0, 0.95]].map(([r, y]) => new THREE.Vector2(r, y)), 18)
  const hoopGeo = new THREE.TorusGeometry(1, 0.018, 6, 24)
  const barrelMat = new THREE.MeshStandardMaterial({ color: '#8a6440', roughness: 0.8 })
  const fumeMat = new THREE.SpriteMaterial({ map: soft, color: '#e8e4da', transparent: true, opacity: 0, depthWrite: false })
  const barrels = BARRELS.map((b, i) => {
    const g = new THREE.Group()
    const body = new THREE.Mesh(barrelGeo, barrelMat)
    body.castShadow = true
    g.add(body)
    for (const [y, r] of [[0.12, 0.33], [0.47, 0.385], [0.82, 0.335]]) {
      const hoop = new THREE.Mesh(hoopGeo, mats.iron)
      hoop.rotation.x = Math.PI / 2
      hoop.position.y = y
      hoop.scale.setScalar(r)
      g.add(hoop)
    }
    const lid = new THREE.Mesh(new THREE.CircleGeometry(0.3, 18), mats.darkWood)
    lid.rotation.x = -Math.PI / 2
    lid.position.y = 0.952
    const fume = new THREE.Sprite(fumeMat.clone())
    fume.position.y = 1.2
    fume.scale.setScalar(0.5)
    g.add(lid, fume)
    g.position.set(b.x, 0, b.z)
    root.add(g)
    solids.push(circle(b.x, b.z, 0.4))
    // a lead pipe from its lid to the tub
    const a = new THREE.Vector3(b.x, 0.95, b.z)
    const v = new THREE.Vector3(VAT.x, VAT.h + 0.05, VAT.z)
    const mid = a.clone().lerp(v, 0.5)
    mid.y += 0.35
    const pipe = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, v.clone().lerp(a, 0.35)), 12, 0.03, 6, false), mats.iron)
    root.add(pipe)
    return { group: g, fume, i, t: 9 }
  })
  const vat = new THREE.Group()
  const bubblesN = light ? 24 : 60
  const bubblePos = new Float32Array(bubblesN * 3)
  const bubbleGeo = new THREE.BufferGeometry()
  bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePos, 3))
  const bubbleSeed = Array.from({ length: bubblesN }, () => [Math.random(), Math.random(), Math.random()])
  {
    const tub = new THREE.Mesh(new THREE.LatheGeometry([[0, 0.02], [VAT.r - 0.04, 0.02], [VAT.r, 0.05], [VAT.r + 0.02, VAT.h], [VAT.r - 0.03, VAT.h], [VAT.r - 0.07, 0.08], [0, 0.08]].map(([r, y]) => new THREE.Vector2(r, y)), 28), barrelMat)
    tub.castShadow = true
    const water = new THREE.Mesh(new THREE.CircleGeometry(VAT.r - 0.04, 28), new THREE.MeshStandardMaterial({ color: '#41566a', roughness: 0.1, metalness: 0.4 }))
    water.rotation.x = -Math.PI / 2
    water.position.y = VAT.h - 0.12
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.18, 14), mats.iron)
    lid.position.y = VAT.h + 0.04
    const bubbles = new THREE.Points(bubbleGeo, new THREE.PointsMaterial({ color: '#e8f2f8', size: 0.06, map: soft, transparent: true, depthWrite: false }))
    bubbles.frustumCulled = false
    bubbles.raycast = () => {}
    vat.add(tub, water, lid, bubbles)
    vat.position.set(VAT.x, 0, VAT.z)
    root.add(vat)
    solids.push(circle(VAT.x, VAT.z, VAT.r + 0.1))
  }
  const hoseMat = new THREE.MeshStandardMaterial({ color: '#5a4630', roughness: 0.75 })
  const hose = new THREE.Mesh(new THREE.BufferGeometry(), hoseMat)
  root.add(hose)
  let hoseKey = ''
  function shapeHose(flying) {
    const key = flying ? 'down' : neckY.toFixed(2)
    if (key === hoseKey) return
    hoseKey = key
    const from = new THREE.Vector3(VAT.x, VAT.h + 0.12, VAT.z)
    const pts = flying
      ? [from, new THREE.Vector3(2.4, 0.3, CAR.z + 0.5), new THREE.Vector3(1.2, 0.05, CAR.z + 0.4), new THREE.Vector3(0.4, 0.04, CAR.z + 0.8)]
      : [from, new THREE.Vector3(2.6, 1.0, CAR.z + 0.7), new THREE.Vector3(1.1, neckY - 0.9, CAR.z + 0.25), new THREE.Vector3(CAR.x, neckY + 0.05, CAR.z)]
    hose.geometry.dispose()
    hose.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.05, 8, false)
  }

  // a finger post at the edge of the square, toward where the wind will take them
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 2.4, 8), mats.darkWood)
    post.position.set(-9.6, 1.2, -7.4)
    const arm = new THREE.Group()
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.34, 0.05), new THREE.MeshStandardMaterial({ color: '#e0d6bd', roughness: 0.85 }))
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.24, 0.3, 3), board.material)
    tip.rotation.z = Math.PI / 2
    tip.position.x = -1.14
    const word = makeText('Nesles-la-Vallée  36 km', { size: 0.15, color: '#2c2418', maxWidth: 1.9 })
    word.position.z = 0.03
    const back = makeText('Nesles-la-Vallée  36 km', { size: 0.15, color: '#2c2418', maxWidth: 1.9 })
    back.position.z = -0.03
    back.rotation.y = Math.PI
    arm.add(board, tip, word, back)
    // the arm points along the wind (toward -x, a little +z)
    arm.position.set(-9.6 + WIND.x * 0.95, 2.05, -7.4 + WIND.z * 0.95)
    arm.rotation.y = Math.atan2(WIND.z, -WIND.x)
    root.add(post, arm)
    solids.push(circle(-9.6, -7.4, 0.2))
  }

  // ---- the balloon's state: lift, load and flight ----
  const bagsOn = () => C.gone.reduce((n, g) => n + (g ? 0 : 1), 0)
  const net = () => C.fill - (LOAD + BAG * bagsOn())
  const climbRate = n => clamp(1.5 + n * 12, 1.5, 4.5)
  const flyAge = () => (C.fly ? clock() - C.fly.start : 0)
  // where the flight is after `age` seconds: each stretch at its own climbing rate (a bag dropped starts a
  // faster one), easing off the ground at first; the wind takes it once it is above the treetops
  const flightAt = age => {
    const out = { h: 0, d: 0 }
    if (!C.fly) return out
    const segs = C.fly.segs
    const step = 0.05
    for (let t = 0; t < age; t += step) {
      let rate = segs[0][1]
      for (const [t0, r] of segs) if (t >= t0) rate = r
      const dt = Math.min(step, age - t)
      out.d += WIND_SPEED * span(5, 18, out.h) * dt
      out.h += rate * dt * ease(clamp(t / 1.6))
    }
    return out
  }
  const flying = () => !!C.fly && flyAge() < FLIGHT
  const pct = f => Math.round(f * 100)

  const charlierePanel = lv => ({
    title: E.charliere.title,
    color,
    blocks: [
      { slider: { label: E.charliere.slider, min: 0, max: 100, step: 5, value: pct(C.fill), onInput: v => setFill(v / 100), format: v => fill(E.charliere.percent, { n: Math.round(v) }), live: () => pct(C.fill) } },
      {
        buttons: [
          { label: E.charliere.buttons.fill, onClick: () => charliereStep('barrel') },
          { label: E.charliere.buttons.bag, onClick: () => charliereStep('bag') },
          { label: E.charliere.buttons.ropes, onClick: () => charliereStep('ropes') },
        ],
      },
      ...E.charliere.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  // a fresh balloon, slack between the masts (after a flight)
  function freshBalloon() {
    C.fill = 0
    C.shown = 0
    C.gone = BAGS.map(() => 0)
    C.fly = null
    for (const b of bags) {
      b.fall = null
      if (b.group.parent !== car) car.add(b.group)
      b.group.position.copy(b.home)
      b.group.visible = true
    }
    fallen.clear()
    shapeEnvelope(0)
    shownFill = 0
  }
  // a visitor's step: a tap on a barrel (acid on the iron: a fifth more gas), a sandbag (dropped), the ropes
  // (let go), or the panel's buttons
  function charliereStep(what, i = -1) {
    const lv = level()
    const s = E.charliere.says
    if (flying()) {
      if (what === 'bag' || what === 'bagAt') return dropBag(i)
      return say(at(s.flying, lv))
    }
    if (C.fly) freshBalloon()
    if (what === 'barrel') {
      if (C.fill >= 0.999) return say(at(s.already, lv))
      const b = barrels[i >= 0 ? i : Math.floor(Math.random() * barrels.length)]
      b.t = 0
      C.fill = Math.min(1, Math.round((C.fill + 0.2) * 100) / 100)
      play('fizz', { order: 2 })
      say(fill(at(C.fill >= 0.999 ? s.full : s.fill, lv), { n: pct(C.fill) }))
      share('charliere')
      return
    }
    if (what === 'bag' || what === 'bagAt') return dropBag(i)
    if (what === 'ropes') {
      if (net() <= 0) {
        C.heavyT = clock()
        play('tap')
        say(at(C.fill < 0.6 ? s.empty : s.heavy, lv))
        return
      }
      C.fly = { start: clock(), segs: [[0, climbRate(net())]] }
      play('enter')
      setTimeout(() => play('celebrate'), 500)
      say(at(s.rise, lv))
      ex.discover('charliere', charlierePanel, 6)
      share('charliere')
    }
  }
  function dropBag(i) {
    const lv = level()
    const s = E.charliere.says
    if (!(i >= 0 && !C.gone[i])) i = C.gone.findIndex(g => !g)
    if (i < 0) return say(at(s.noBags, lv))
    C.gone[i] = 1
    startFall(i)
    play('tap')
    if (C.fly) {
      const age = flyAge()
      C.fly.segs.push([Math.round(age * 10) / 10, climbRate(net())])
      say(at(s.bagUp, lv))
    } else say(fill(at(net() > 0 ? s.light : s.bag, lv), { n: bagsOn() }))
    share('charliere')
  }
  function startFall(i) {
    const b = bags[i]
    b.group.updateMatrixWorld()
    const p = b.group.getWorldPosition(new THREE.Vector3())
    car.remove(b.group)
    fallen.add(b.group)
    b.group.position.copy(p)
    b.fall = { v: 0, done: false }
  }
  // the slider: the balloon filled to a share (on the ground only)
  let fillSend = null
  function setFill(f) {
    if (flying()) return
    if (C.fly) freshBalloon()
    const v = clamp(Math.round(Number(f) * 20) / 20, 0, 1)
    if (v === C.fill) return
    C.fill = v
    if (!fillSend) {
      fillSend = setTimeout(() => {
        fillSend = null
        share('charliere')
      }, 250)
    }
  }
  barrels.forEach((b, i) => clickable(b.group, () => charliereStep('barrel', i), { when: () => !flying() }))
  clickable(vat, () => charliereStep('barrel'), { when: () => !flying() })
  bags.forEach((b, i) => clickable(b.group, () => charliereStep('bagAt', i), { when: () => !C.gone[i], reach: 400 }))
  clickable(ropeHits, () => charliereStep('ropes'), { when: () => !C.fly })
  clickable(car, () => charliereStep('ropes'), { when: () => !C.fly })
  clickable(envelope, () => charliereStep(C.fill >= 0.999 || net() > 0 ? 'ropes' : 'barrel'), { when: () => !C.fly, reach: 8 })
  ex.add({
    id: 'charliere',
    x: S1.x,
    z: S1.z,
    radius: 2.6,
    manual: true,
    label: E.charliere.label,
    // the next step, as a hint: the visitor does it by tapping its thing (E opens the panel)
    verb: () => {
      const h = E.charliere.hints
      if (C.fly) return flyAge() < FLIGHT - 8 ? (bagsOn() ? h.flying : h.watch) : h.gone
      if (net() > 0) return h.ropes
      if (C.fill >= 0.75) return h.heavy
      return C.fill > 0 ? fill(h.more, { n: pct(C.fill) }) : h.fill
    },
    focus: { x: 1.3, y: 3.2, z: CAR.z + 0.7, size: 7.4, width: 6.4 },
    act: () => ctx.showPanel(charlierePanel),
  })
  let shownFill = 0
  let carLift = 0
  const cTmpA = new THREE.Vector3()
  const cTmpB = new THREE.Vector3()
  updates.push((dt, t) => {
    const age = flyAge()
    // a flight over: the next balloon is laid out
    if (C.fly && age >= FLIGHT) freshBalloon()
    const fly = !!C.fly
    // the silk swells toward the gas in it
    const target = C.fill
    if (Math.abs(shownFill - target) > 0.002) {
      shownFill = damp(shownFill, target, 1.6, dt)
      if (Math.abs(shownFill - target) < 0.003) shownFill = target
      shapeEnvelope(shownFill)
    }
    // tugging at its ropes when it is light enough; a little hop when it was let go too heavy
    const pulling = !fly && net() > 0
    carLift = damp(carLift, pulling ? 0.22 : 0, 3, dt)
    const hop = Math.max(0, 1 - (clock() - C.heavyT) / 1.2) * Math.abs(Math.sin((clock() - C.heavyT) * 9)) * 0.12
    car.position.y = carLift + hop
    // the flight: up at its rate, carried off by the wind
    const { h, d } = flightAt(age)
    balloon.position.set(CAR.x + WIND.x * d, h + Math.sin(t * 0.7) * 0.03 * (pulling ? 1 : 0), CAR.z + WIND.z * d)
    balloon.rotation.z = fly ? Math.sin(t * 0.5) * 0.03 : 0
    balloon.visible = !fly || age < FLIGHT - 1
    setDial(pulling ? net() : 0)
    // the net's cords
    for (let j = 0; j < 12; j++) stretch(cords[j], ringAt(j, cTmpA), railAt(j, cTmpB))
    // the rope over the crown, from both masts, while it hangs there
    const crown = new THREE.Vector3(CAR.x, ENV.TOP + 0.08 + carLift, CAR.z)
    for (const c of crownRopes) {
      c.r.visible = !fly
      if (!fly) stretch(c.r, c.from, crown)
    }
    // the tethers: taut to their stakes on the ground, dangling from the car in flight
    balloon.updateMatrixWorld()
    for (const tt of tethers) {
      const a = car.localToWorld(cTmpA.copy(tt.corner))
      const b = fly ? cTmpB.copy(a).add(new THREE.Vector3(0.1, -1.6, 0.05)) : tt.anchor
      stretch(tt.r, a, b)
      stretch(tt.hit, a, b)
      tt.hit.scale.x = tt.hit.scale.z = 0.2
    }
    shapeHose(fly)
    // waving their hats, and the crowd cheering
    const wave = fly ? 1 : pulling ? 0.35 : 0
    for (const a of carParts.arms) a.arm.rotation.z = a.side * lerp(0.25, 2.6 + Math.sin(t * 6 + a.seed) * 0.35, wave)
    stage.crowd.cheer(fly ? Math.max(0.15, 1 - age / 25) : 0)
    stage.crowd.look(balloon.position.x, balloon.position.z)
    // the barrels fuming, the tub bubbling while gas comes
    let fizzing = 0
    for (const b of barrels) {
      b.t += dt
      const k = b.t < 2.2 ? Math.sin(Math.PI * clamp(b.t / 2.2)) : 0
      fizzing = Math.max(fizzing, k)
      b.fume.material.opacity = k * 0.6
      b.fume.scale.setScalar(0.4 + b.t * 0.3)
      b.fume.position.y = 1.1 + b.t * 0.25
    }
    fizzing = Math.max(fizzing, Math.abs(shownFill - C.fill) > 0.01 ? 0.6 : 0)
    for (let i = 0; i < bubblesN; i++) {
      const [a, b, c] = bubbleSeed[i]
      const u = (t * (0.6 + b) + c) % 1
      const r = (VAT.r - 0.12) * Math.sqrt(a)
      bubblePos[i * 3] = Math.cos(c * TAU) * r
      bubblePos[i * 3 + 1] = fizzing > 0.05 && i < bubblesN * fizzing ? VAT.h - 0.12 + u * 0.02 + Math.sin(u * 20) * 0.01 : -5
      bubblePos[i * 3 + 2] = Math.sin(c * TAU) * r
    }
    bubbleGeo.attributes.position.needsUpdate = true
    // the bags falling, and a puff of sand where one lands
    for (const b of bags) {
      if (!b.fall || b.fall.done) continue
      b.fall.v += 9.8 * dt
      b.group.position.y -= b.fall.v * dt
      if (b.group.position.y <= 0.16) {
        b.group.position.y = 0.16
        b.fall.done = true
        if (b.fall.v > 2) {
          sandPuff.position.set(b.group.position.x, 0.4, b.group.position.z)
          puffT = 0
        }
      }
    }
    puffT += dt
    sandPuff.material.opacity = puffT < 1.2 ? (1 - puffT / 1.2) * 0.7 : 0
    sandPuff.scale.setScalar(0.4 + puffT * 1.2)
  })
  const charliereState = () => ({
    fill: C.fill,
    gone: [...C.gone],
    fly: C.fly ? { age: Math.round(flyAge() * 10) / 10, segs: C.fly.segs.map(s => [s[0], Math.round(s[1] * 100) / 100]) } : null,
  })
  const charliereSet = (s, liveSet, ago = 0) => {
    const g = Array.isArray(s?.gone) ? BAGS.map((_, i) => (s.gone[i] ? 1 : 0)) : BAGS.map(() => 0)
    const fly = s?.fly && Number.isFinite(Number(s.fly.age)) ? s.fly : null
    const age = fly ? clamp(Number(fly.age) + (Number(ago) || 0), 0, 600) : 0
    if (fly && age >= FLIGHT) {
      freshBalloon()
      return
    }
    // a fresh balloon if the last one has flown and this state is a new one
    if (!fly && C.fly) freshBalloon()
    C.fill = clamp(Math.round((Number(s?.fill) || 0) * 100) / 100, 0, 1)
    const segs = fly && Array.isArray(fly.segs) && fly.segs.length ? fly.segs.filter(x => Array.isArray(x)).map(x => [clamp(Number(x[0]) || 0, 0, FLIGHT), clamp(Number(x[1]) || 1.5, 1.5, 4.5)]) : [[0, 1.5]]
    C.fly = fly ? { start: clock() - age, segs } : null
    g.forEach((v, i) => {
      if (v && !C.gone[i]) {
        C.gone[i] = 1
        if (liveSet) startFall(i)
        else {
          // already lying on the ground (or carried off with the balloon long ago)
          startFall(i)
          bags[i].group.position.y = 0.16
          bags[i].fall.done = true
        }
      } else if (!v && C.gone[i]) {
        C.gone[i] = 0
        const b = bags[i]
        b.fall = null
        if (b.group.parent !== car) car.add(b.group)
        b.group.position.copy(b.home)
      }
    })
    if (!liveSet) {
      shownFill = C.fill
      shapeEnvelope(shownFill)
    }
    if (liveSet && fly && age < 2) {
      play('enter')
    }
  }

  // ======== the gas race: four balloons of one cubic metre, each on a spring scale ========
  const G = { on: { hot: 0, air: 0, he: 0, h2: 0 }, temp: 100, lens: 0 }
  let lensSeen = false
  const liftOf = id => (id === 'hot' ? hotLift(G.temp) : id === 'air' ? 0 : RHO.air - RHO[id])
  const ballLook = {
    air: new THREE.MeshStandardMaterial({ color: '#cfd5da', roughness: 0.45 }),
    he: new THREE.MeshStandardMaterial({ color: '#86b3dd', roughness: 0.35, metalness: 0.1 }),
    h2: new THREE.MeshStandardMaterial({ map: envTex, roughness: 0.45 }),
    hot: new THREE.MeshStandardMaterial({ color: '#2c4c96', roughness: 0.6, side: THREE.DoubleSide }),
  }
  const raceDialTex = dialTex({ marks: 6, labels: ['0', '0.2', '0.4', '0.6', '0.8', '1.0', '1.2'].map(s => s.replace('.', num(0.5, 1, lang).charAt(1))) })
  textures.push(raceDialTex)
  const raceDialMat = new THREE.MeshStandardMaterial({ map: raceDialTex, roughness: 0.6 })
  const burnerGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ff9a40').multiplyScalar(1.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }))
  burnerGlow.raycast = () => {}
  const balls = RACE.map(r => {
    const post = new THREE.Group()
    post.position.set(RACE_X, 0, r.z)
    const wood = new THREE.Mesh(new THREE.BoxGeometry(0.12, POST_H, 0.12), mats.darkWood)
    wood.position.y = POST_H / 2
    wood.castShadow = true
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.06, 16), mats.darkWood)
    foot.position.y = 0.03
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 6, 14), mats.brass)
    hook.position.y = POST_H + 0.04
    post.add(wood, foot, hook)
    // the spring scale's face, toward the visitors (+x)
    const face = new THREE.Group()
    const backing = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 28), mats.brass)
    backing.rotation.x = Math.PI / 2
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), raceDialMat)
    disc.position.z = 0.027
    const needleG = new THREE.Group()
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.13, 0.006), new THREE.MeshStandardMaterial({ color: '#7a1218' }))
    needle.position.y = 0.055
    needleG.add(needle)
    needleG.position.z = 0.032
    needleG.rotation.z = (135 * Math.PI) / 180
    face.add(backing, disc, needleG)
    face.position.set(0.07, 1.08, 0)
    face.rotation.y = Math.PI / 2
    post.add(face)
    // the reading and the gas's name on dark plaques
    const reading = plaque('0 kg', { size: 0.085, width: 0.42 })
    reading.group.position.set(0.075, 0.82, 0)
    reading.group.rotation.y = Math.PI / 2
    const name = plaque(E.race.names[r.id], { size: 0.085, width: Math.max(0.62, E.race.names[r.id].length * 0.05 + 0.14) })
    name.group.position.set(0.075, 0.6, 0)
    name.group.rotation.y = Math.PI / 2
    post.add(reading.group, name.group)
    root.add(post)
    solids.push(circle(RACE_X, r.z, 0.25))
    // the balloon (an envelope pear-shaped and open below for the hot air; round for the others)
    const ball = new THREE.Group()
    let skin
    if (r.id === 'hot') {
      const R = BALL_R
      // from the open neck up to the crown
      const pts = [new THREE.Vector2(0.17, -R * 1.25)]
      for (let i = 16; i >= 0; i--) {
        const a = (i / 16) * Math.PI * 0.82
        pts.push(new THREE.Vector2(Math.max(0.001, Math.sin(a) * R * (1.05 - 0.25 * (i / 16) ** 2)), Math.cos(a) * R * 1.08))
      }
      skin = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), ballLook.hot)
      const band = new THREE.Mesh(new THREE.TorusGeometry(R * 1.03, 0.025, 6, 32), mats.gold)
      band.rotation.x = Math.PI / 2
      const band2 = new THREE.Mesh(new THREE.TorusGeometry(R * 0.72, 0.02, 6, 32), mats.gold)
      band2.rotation.x = Math.PI / 2
      band2.position.y = R * 0.68
      // the little burner under its open neck
      const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.1, 10), mats.iron)
      basket.position.y = -R * 1.25 - 0.18
      const glow = burnerGlow
      glow.position.y = -R * 1.25 - 0.1
      glow.scale.setScalar(0.35)
      ball.add(skin, band, band2, basket, glow)
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * TAU
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2, 4), mats.iron)
        wire.position.set(Math.cos(a) * 0.12, -R * 1.25 - 0.08, Math.sin(a) * 0.12)
        ball.add(wire)
      }
    } else {
      skin = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 32, 20), ballLook[r.id])
      const knot = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 8), ballLook[r.id])
      knot.position.y = -BALL_R - 0.02
      knot.rotation.x = Math.PI
      ball.add(skin, knot)
    }
    skin.castShadow = true
    root.add(ball)
    const string = rope(0.006, lineMat)
    root.add(string)
    // what fills it, at the post's foot: a bottle of the gas, a hand bellows for air
    const source = new THREE.Group()
    if (r.id === 'he' || r.id === 'h2') {
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.62, 16), new THREE.MeshStandardMaterial({ color: r.id === 'h2' ? '#8a2c2c' : '#6c6f74', roughness: 0.45, metalness: 0.4 }))
      bottle.position.y = 0.31
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 8, 0, TAU, 0, Math.PI / 2), bottle.material)
      top.position.y = 0.62
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.09, 8), mats.brass)
      valve.position.y = 0.76
      const label = formulaText(r.id === 'h2' ? 'H2' : 'He', { size: 0.1, color: '#ffffff' })
      label.position.set(0, 0.36, 0.115)
      source.add(bottle, top, valve, label)
    } else if (r.id === 'air') {
      const bellows = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.17, 0.4, 4), new THREE.MeshStandardMaterial({ color: '#6a4a30', roughness: 0.8 }))
      bellows.rotation.z = Math.PI / 2
      bellows.rotation.y = Math.PI / 4
      bellows.position.y = 0.12
      bellows.scale.set(1, 1, 0.35)
      source.add(bellows)
    } else {
      const stove = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.3, 12), mats.iron)
      stove.position.y = 0.15
      source.add(stove)
    }
    source.position.set(RACE_X - 0.05, 0, r.z - 0.5)
    source.rotation.y = Math.PI / 2
    root.add(source)
    const hit = new THREE.Mesh(new THREE.SphereGeometry(BALL_R * 1.1, 10, 8), ghost)
    ball.add(hit)
    const it = { ...r, post, ball, skin, string, needleG, reading, name, source, inf: 0, up: 0, shownKg: -1 }
    return it
  })
  // the picture's lens on the hydrogen balloon's skin: its molecules beside the air's
  const lens = new THREE.Group()
  const lensMol = { n: 12, list: [] }
  const SKIN_C = new THREE.Vector2(-1.25, 1.0)
  const SKIN_R = 1.5
  const molMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.35, emissive: '#ffffff', emissiveIntensity: 0.15 }), lensMol.n * 4)
  molMesh.frustumCulled = false
  const lensTexts = {}
  const lensRim = new THREE.MeshStandardMaterial({ color: '#6fb6ff', emissive: '#6fb6ff', emissiveIntensity: 1.1, roughness: 0.4 })
  {
    const R = LENS.r
    const back = new THREE.Mesh(new THREE.CircleGeometry(R, 48), new THREE.MeshBasicMaterial({ color: '#0e1a3c' }))
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.045, 10, 48), lensRim)
    // the skin across the lens: an arc of a big circle, red with a gold edge
    const pts = []
    for (let k = 0; k <= 40; k++) {
      const a = -0.6 + (k / 40) * 1.9
      const p = new THREE.Vector2(SKIN_C.x + Math.cos(-a) * SKIN_R, SKIN_C.y + Math.sin(-a) * SKIN_R)
      if (p.length() < R - 0.02) pts.push(new THREE.Vector3(p.x, p.y, 0.012))
    }
    const skinCurve = new THREE.CatmullRomCurve3(pts)
    const skinBand = new THREE.Mesh(new THREE.TubeGeometry(skinCurve, 40, 0.028, 6, false), new THREE.MeshStandardMaterial({ color: '#c93140', emissive: '#5a0c14', emissiveIntensity: 0.6 }))
    const skinEdge = new THREE.Mesh(new THREE.TubeGeometry(skinCurve, 40, 0.011, 4, false), new THREE.MeshStandardMaterial({ color: '#f2c14e', emissive: '#7a5a10', emissiveIntensity: 0.6 }))
    skinEdge.position.set(0.03, -0.03, 0.02)
    lens.add(back, rim, skinBand, skinEdge, molMesh)
    // the molecules: 12 of hydrogen inside the skin, 12 of air outside (9 nitrogen, 3 oxygen)
    const rnd = random(12)
    const inside = p => p.distanceTo(SKIN_C) < SKIN_R - 0.07 && p.length() < R - 0.08
    const outside = p => p.distanceTo(SKIN_C) > SKIN_R + 0.07 && p.length() < R - 0.08
    const place = test => {
      for (let k = 0; k < 400; k++) {
        const p = new THREE.Vector2((rnd() * 2 - 1) * R, (rnd() * 2 - 1) * R)
        if (test(p)) return p
      }
      return new THREE.Vector2()
    }
    for (let k = 0; k < lensMol.n * 2; k++) {
      const h2 = k < lensMol.n
      const kind = h2 ? 'h2' : k < lensMol.n + 9 ? 'n2' : 'o2'
      const a = rnd() * TAU
      // the same warmth: hydrogen's light molecules move about four times faster (sqrt(29 / 2))
      const speed = h2 ? 0.34 : 0.09
      lensMol.list.push({ kind, p: place(h2 ? inside : outside), v: new THREE.Vector2(Math.cos(a), Math.sin(a)).multiplyScalar(speed), rot: rnd() * TAU, spin: (rnd() - 0.5) * (h2 ? 6 : 2), test: h2 ? inside : outside })
    }
    const col = new THREE.Color()
    lensMol.list.forEach((m, k) => {
      const c = m.kind === 'h2' ? '#f2f4f8' : m.kind === 'n2' ? '#3e6fe0' : '#e0353a'
      molMesh.setColorAt(k * 2, col.set(c))
      molMesh.setColorAt(k * 2 + 1, col.set(c))
    })
    // the counts and weights, shown when the lens is tapped
    for (const side of ['inside', 'outside']) {
      const t = makeText('', { size: 0.085, color: '#ffffff', maxWidth: 0.85, anchorY: 'middle', outlineWidth: 0.01, outlineColor: '#0e1a3c' })
      t.position.set(side === 'inside' ? -0.28 : 0.26, side === 'inside' ? 0.5 : -0.5, 0.06)
      t.visible = false
      lens.add(t)
      lensTexts[side] = t
    }
    lens.position.set(LENS.x, LENS.y, LENS.z)
    lens.rotation.y = Math.PI / 2
    root.add(lens)
  }
  // the zoom lines from a dashed ring on the hydrogen balloon to the lens, as the picture draws them
  const zoom = new THREE.Group()
  const zoomRing = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.008, 4, 28), new THREE.MeshBasicMaterial({ color: '#9fd4ff' }))
  const zoomLines = [rope(0.006, new THREE.MeshBasicMaterial({ color: '#9fd4ff', transparent: true, opacity: 0.7 })), rope(0.006, new THREE.MeshBasicMaterial({ color: '#9fd4ff', transparent: true, opacity: 0.7 }))]
  zoom.add(zoomRing, ...zoomLines)
  root.add(zoom)
  // the air's push round the hydrogen balloon: harder from below than from above
  const pushes = new THREE.Group()
  const pushMat = new THREE.MeshStandardMaterial({ color: '#9fd4ff', emissive: '#4a8ad0', emissiveIntensity: 0.8, roughness: 0.4 })
  const pushArrows = Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * TAU
    const g = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 6), pushMat)
    shaft.position.y = 0.5
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 8), pushMat)
    head.rotation.x = Math.PI
    head.position.y = -0.03
    g.add(shaft, head)
    pushes.add(g)
    return { g, shaft, a }
  })
  root.add(pushes)
  const posFor = (it, out) => {
    const rest = new THREE.Vector3(RACE_X - 0.8, BALL_R * 0.97, it.z)
    const empty = new THREE.Vector3(RACE_X - 0.7, 0.06, it.z)
    const up = new THREE.Vector3(RACE_X, POST_H + 0.05 + STRING + BALL_R * (it.id === 'hot' ? 1.45 : 1.05), it.z)
    out.copy(empty).lerp(rest, it.inf)
    return out.lerp(up, it.up)
  }
  const racePanel = lv => ({
    title: E.race.title,
    color,
    blocks: [
      { slider: { label: E.race.slider, min: 20, max: 120, step: 5, value: G.temp, onInput: v => setTemp(v), format: v => fill(E.race.degrees, { t: Math.round(v) }), live: () => G.temp } },
      {
        buttons: [
          { label: E.race.buttons.all, onClick: () => raceStep('all') },
          { label: E.race.buttons.none, onClick: () => raceStep('none') },
          { label: E.race.buttons.lens, onClick: () => raceStep('lens') },
        ],
      },
      ...E.race.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const kg = v => `${num(v, 2, lang)} kg`
  // a visitor's step: a tap on a balloon (or its bottle) fills it or lets it out, a tap on the lens weighs
  // the molecules, the panel's buttons fill or empty them all
  function raceStep(what) {
    const lv = level()
    const s = E.race.says
    if (what === 'lens') {
      G.lens = G.lens ? 0 : 1
      lensSeen = true
      play('select')
      say(at(G.lens ? s.lens : s.lensOff, lv))
      ex.discover('race', racePanel, 4)
      share('race')
      return
    }
    if (what === 'all' || what === 'none') {
      for (const r of RACE) G.on[r.id] = what === 'all' ? 1 : 0
      if (what === 'all' && G.temp < 40) G.temp = 100
      play(what === 'all' ? 'select' : 'tap')
      say(at(what === 'all' ? s.all : s.empty, lv))
      if (what === 'all') ex.discover('race', racePanel, 4)
      share('race')
      return
    }
    if (!(what in G.on)) return
    G.on[what] = G.on[what] ? 0 : 1
    if (what === 'hot' && G.on.hot && G.temp < 40) G.temp = 100
    play(G.on[what] ? 'select' : 'tap')
    if (!G.on[what]) say(at(s.empty, lv))
    else if (what === 'hot') say(fill(at(s.hot, lv), { t: G.temp, kg: num(hotLift(G.temp), 2, lang), rho: num(RHO.air - hotLift(G.temp), 2, lang) }))
    else say(at(s[what], lv))
    if (G.on[what]) ex.discover('race', racePanel, 4)
    share('race')
  }
  let tempSend = null
  let tempSaid = 0
  function setTemp(v) {
    const c = clamp(Math.round(Number(v) / 5) * 5, 20, 120)
    if (c === G.temp) return
    G.temp = c
    G.on.hot = 1
    if (clock() - tempSaid > 1.2) {
      tempSaid = clock()
      later(0.6, () => say(fill(at(G.temp <= 20 ? E.race.says.cold : E.race.says.hot, level()), { t: G.temp, kg: num(hotLift(G.temp), 2, lang), rho: num(RHO.air - hotLift(G.temp), 2, lang) })))
    }
    if (!tempSend) {
      tempSend = setTimeout(() => {
        tempSend = null
        share('race')
      }, 250)
    }
  }
  balls.forEach(b => {
    clickable(b.ball, () => raceStep(b.id))
    clickable(b.source, () => raceStep(b.id))
  })
  clickable(lens, () => raceStep('lens'), { reach: 6 })
  ex.add({
    id: 'race',
    x: S2.x,
    z: S2.z,
    radius: 2.5,
    manual: true,
    label: E.race.label,
    verb: () => {
      const h = E.race.hints
      const n = RACE.filter(r => G.on[r.id]).length
      if (!n) return h.first
      if (n < RACE.length) return h.more
      if (!lensSeen) return h.lens
      return h.hot
    },
    focus: { x: -8.3, y: 2.5, z: 0.25, size: 5.3, width: 5.4 },
    act: () => ctx.showPanel(racePanel),
  })
  let lensLevel = null
  updates.push((dt, t) => {
    for (const b of balls) {
      const on = G.on[b.id]
      const lift = on ? liftOf(b.id) : 0
      const rising = on && lift > 0.02
      b.inf = damp(b.inf, on ? 1 : 0, 3.2, dt)
      b.up = damp(b.up, rising ? 1 : 0, rising ? 1.8 : 3, dt)
      posFor(b, b.ball.position)
      // swaying a little on its string
      if (b.up > 0.5) {
        b.ball.position.x += Math.sin(t * 0.9 + b.z) * 0.05 * b.up
        b.ball.position.z += Math.sin(t * 0.7 + b.z * 2) * 0.04 * b.up
      }
      const sc = lerp(0.42, 1, b.inf)
      b.ball.scale.set(sc, lerp(0.12, 1, Math.min(1, b.inf * 1.5)) * (b.up < 0.5 ? lerp(1, 0.94, b.inf) : 1), sc)
      // the string from the hook to the balloon's neck
      const hookP = cTmpA.set(RACE_X, POST_H + 0.04, b.z)
      const neck = cTmpB.copy(b.ball.position).add(new THREE.Vector3(0, -BALL_R * (b.id === 'hot' ? 1.25 : 1.05) * b.ball.scale.y, 0))
      stretch(b.string, hookP, neck)
      b.string.scale.x = b.string.scale.z = 1
      // the scale reads the pull: the lift per cubic metre once it is up
      const reading = b.up > 0.6 ? lift : 0
      const want = (135 - 270 * clamp(reading / 1.2)) * (Math.PI / 180)
      b.needleG.rotation.z = damp(b.needleG.rotation.z, want, 4, dt)
      const shown = Math.round(reading * 100)
      if (shown !== b.shownKg) {
        b.shownKg = shown
        setText(b.reading.text, kg(shown / 100))
      }
    }
    // the hot-air balloon's fire, brighter the hotter
    burnerGlow.material.opacity = G.on.hot ? clamp((G.temp - 20) / 100) * (0.75 + Math.sin(t * 13) * 0.1) : 0
    burnerGlow.scale.setScalar(0.25 + 0.3 * clamp((G.temp - 20) / 100))
    // the lens: the molecules bounce about, each kind in its own side of the skin
    for (const m of lensMol.list) {
      const nx = m.p.x + m.v.x * dt
      const ny = m.p.y + m.v.y * dt
      const np = new THREE.Vector2(nx, ny)
      if (m.test(np)) m.p.copy(np)
      else {
        // bounce: back the way it came, turned a little
        m.v.negate().rotateAround(new THREE.Vector2(), (Math.random() - 0.5) * 1.2)
      }
      m.rot += m.spin * dt
    }
    lensMol.list.forEach((m, k) => {
      const h2 = m.kind === 'h2'
      const r = h2 ? 0.032 : 0.045
      const half = h2 ? 0.026 : 0.04
      for (const s of [-1, 1]) {
        dummy.position.set(m.p.x + Math.cos(m.rot) * half * s, m.p.y + Math.sin(m.rot) * half * s, 0.03)
        dummy.scale.setScalar(r)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        molMesh.setMatrixAt(k * 2 + (s > 0 ? 1 : 0), dummy.matrix)
      }
    })
    molMesh.instanceMatrix.needsUpdate = true
    // the counts and weights in the lens
    const lv = level()
    if (lensLevel !== lv) {
      lensLevel = lv
      setText(lensTexts.inside, at(E.race.lensWords.inside, lv))
      setText(lensTexts.outside, at(E.race.lensWords.outside, lv))
    }
    lensTexts.inside.visible = lensTexts.outside.visible = !!G.lens
    // the zoom lines from the hydrogen balloon's skin, and the air's push round it
    const h2 = balls.find(b => b.id === 'h2')
    const showZoom = h2.inf > 0.6
    zoom.visible = showZoom
    if (showZoom) {
      const c = h2.ball.position
      const spot = cTmpA.set(c.x + 0.32 * h2.ball.scale.x, c.y + 0.42 * h2.ball.scale.y, c.z - 0.3 * h2.ball.scale.z)
      zoomRing.position.copy(spot)
      zoomRing.lookAt(spot.x + 1, spot.y, spot.z)
      stretch(zoomLines[0], spot, new THREE.Vector3(LENS.x, LENS.y + LENS.r, LENS.z))
      stretch(zoomLines[1], spot, new THREE.Vector3(LENS.x, LENS.y - LENS.r * 0.2, LENS.z + LENS.r * 0.95))
      zoomLines.forEach(l => (l.scale.x = l.scale.z = 1))
    }
    const showPush = !!G.lens && h2.up > 0.8
    pushes.visible = showPush
    if (showPush) {
      const c = h2.ball.position
      for (const p of pushArrows) {
        // round the balloon in the plane facing the visitors; 0 at the top
        const dir = new THREE.Vector3(0, Math.cos(p.a), Math.sin(p.a))
        const len = 0.18 + 0.32 * (1 - Math.cos(p.a)) / 2
        const tip = c.clone().addScaledVector(dir, BALL_R + 0.05)
        p.g.position.copy(tip)
        p.g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
        p.shaft.scale.y = len
        p.shaft.position.y = 0.05 + len / 2
      }
    }
  })
  const raceSet = (s, liveSet) => {
    for (const r of RACE) G.on[r.id] = s?.on?.[r.id] ? 1 : 0
    G.temp = clamp(Math.round((Number(s?.temp) || 100) / 5) * 5, 20, 120)
    G.lens = s?.lens ? 1 : 0
    if (!liveSet) {
      for (const b of balls) {
        b.inf = G.on[b.id] ? 1 : 0
        b.up = G.on[b.id] && liftOf(b.id) > 0.02 ? 1 : 0
      }
    }
  }

  // ======== why helium now: the Hindenburg at 1:100, and the candle test ========
  const H = { model: 0, h: 0, he: 0, hAt: -99, heAt: -99, cellsT: -99, decksT: -99, seenModel: false }
  const model = new THREE.Group()
  const cells = []
  const deckLights = []
  let nearSkin = null
  {
    // the table and the glass case
    const table = new THREE.Mesh(new THREE.BoxGeometry(CASE.w + 0.1, 0.06, CASE.len + 0.1), mats.darkWood)
    table.position.set(CASE.x, CASE.top - 0.03, CASE.z)
    root.add(table)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, CASE.top - 0.06, 0.07), mats.darkWood)
        leg.position.set(CASE.x + sx * (CASE.w / 2 - 0.04), (CASE.top - 0.06) / 2, CASE.z + sz * (CASE.len / 2 - 0.04))
        root.add(leg)
      }
    }
    solids.push(box(CASE.x, CASE.z, CASE.w + 0.2, CASE.len + 0.2))
    const glass = new THREE.Mesh(new THREE.BoxGeometry(CASE.w, CASE.h, CASE.len), glassMat)
    glass.position.set(CASE.x, CASE.top + CASE.h / 2, CASE.z)
    glass.renderOrder = 3
    root.add(glass)
    // its brass edges
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(CASE.w, CASE.h, CASE.len)), new THREE.LineBasicMaterial({ color: '#c49a48' }))
    edges.position.copy(glass.position)
    root.add(edges)
    // a plaque on the table's front, toward the visitors
    const p = plaque('LZ 129 Hindenburg   1:100', { size: 0.075, width: 1.5 })
    p.group.position.set(CASE.x - CASE.w / 2 - 0.06, CASE.top - 0.1, CASE.z)
    p.group.rotation.y = -Math.PI / 2
    root.add(p.group)

    // the hull: a lathe along its length (nose at -z), the half toward the visitors see-through when lit
    const prof = []
    const N = 40
    for (let i = 0; i <= N; i++) {
      const u = i / N
      let f
      if (u < 0.14) f = Math.sqrt(1 - ((0.14 - u) / 0.14) ** 2)
      else if (u < 0.5) f = 1
      else f = 1 - Math.pow((u - 0.5) / 0.5, 1.9) * 0.96
      prof.push(new THREE.Vector2(Math.max(0.002, f * HULL.r), u * HULL.len))
    }
    const silver = new THREE.MeshStandardMaterial({ color: '#b9bec6', roughness: 0.38, metalness: 0.55 })
    const far = new THREE.Mesh(new THREE.LatheGeometry(prof, 32, 0, Math.PI), silver)
    nearSkin = new THREE.Mesh(new THREE.LatheGeometry(prof, 32, Math.PI, Math.PI), new THREE.MeshStandardMaterial({ color: '#b9bec6', roughness: 0.38, metalness: 0.55, transparent: true, opacity: 1, side: THREE.DoubleSide }))
    const inner = new THREE.Mesh(new THREE.LatheGeometry(prof.map(v => new THREE.Vector2(v.x * 0.985, v.y)), 32, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#4a4f58', roughness: 0.8, side: THREE.BackSide }))
    const hull = new THREE.Group()
    hull.add(far, nearSkin, inner)
    // the rings of the frame and the gas cells between them
    const rAt = u => (u < 0.14 ? Math.sqrt(Math.max(0, 1 - ((0.14 - u) / 0.14) ** 2)) : u < 0.5 ? 1 : 1 - Math.pow((u - 0.5) / 0.5, 1.9) * 0.96) * HULL.r
    const ringMat = new THREE.MeshStandardMaterial({ color: '#d0c8b4', roughness: 0.5, metalness: 0.4 })
    const bays = 16
    const u0 = 0.05
    const u1 = 0.95
    for (let k = 0; k <= bays; k++) {
      const u = u0 + ((u1 - u0) * k) / bays
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rAt(u) * 0.97, 0.004, 4, 28), ringMat)
      ring.position.y = u * HULL.len
      ring.rotation.x = Math.PI / 2
      hull.add(ring)
    }
    const cellMat = () => new THREE.MeshStandardMaterial({ color: '#b9d2e6', emissive: '#7fb8f0', emissiveIntensity: 0, roughness: 0.7 })
    for (let k = 0; k < bays; k++) {
      const ua = u0 + ((u1 - u0) * k) / bays
      const ub = u0 + ((u1 - u0) * (k + 1)) / bays
      const r = Math.min(rAt(ua), rAt(ub)) * 0.9
      const h = (ub - ua) * HULL.len * 0.94
      const cell = new THREE.Mesh(new THREE.LatheGeometry([[0, -h / 2], [r * 0.8, -h / 2], [r, -h * 0.25], [r, h * 0.25], [r * 0.8, h / 2], [0, h / 2]].map(([x, y]) => new THREE.Vector2(x, y)), 20), cellMat())
      cell.position.y = ((ua + ub) / 2) * HULL.len
      cell.visible = false
      hull.add(cell)
      cells.push(cell)
    }
    // the passenger decks inside the hull's belly, about a quarter of the way back, with their windows
    const deckMat = new THREE.MeshStandardMaterial({ color: '#c8a878', emissive: '#ffb050', emissiveIntensity: 0, roughness: 0.7 })
    for (const [dy, w] of [[-0.11, 0.2], [-0.145, 0.16]]) {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(w, 0.004, 0.3), deckMat)
      // in lathe coordinates: y along the hull, the deck's height is -z after the turn below
      deck.rotation.x = Math.PI / 2
      deck.position.set(0, 0.29 * HULL.len, -dy)
      hull.add(deck)
      deckLights.push(deck)
      for (const s of [-1, 1]) {
        const row = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.012, 0.26), new THREE.MeshStandardMaterial({ color: '#ffd9a0', emissive: '#ffb050', emissiveIntensity: 0 }))
        row.rotation.x = Math.PI / 2
        row.position.set(s * w * 0.55, 0.29 * HULL.len, -dy + 0.012)
        hull.add(row)
        deckLights.push(row)
      }
    }
    // the control car under the nose, four engine cars, four tail fins
    const gondola = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.08, 4, 8), silver)
    gondola.position.set(0, 0.14 * HULL.len, HULL.r + 0.01)
    hull.add(gondola)
    for (const [u, s] of [[0.55, 1], [0.55, -1], [0.68, 1], [0.68, -1]]) {
      const eng = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.05, 4, 8), silver)
      eng.position.set(s * (rAt(u) + 0.035), u * HULL.len, rAt(u) * 0.55)
      hull.add(eng)
    }
    for (let k = 0; k < 4; k++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.32, 0.13), silver)
      const a = (k / 4) * TAU + Math.PI / 4
      fin.position.set(Math.cos(a) * 0.15, 0.87 * HULL.len, Math.sin(a) * 0.15)
      fin.rotation.y = Math.PI / 2 - a
      hull.add(fin)
    }
    // the lathe's axis (y) along the case (-z to +z); its far half away from the visitors (+x)
    hull.rotation.x = Math.PI / 2
    hull.position.set(0, 0, -HULL.len / 2)
    model.add(hull)
    model.position.set(CASE.x, CASE.top + 0.36, CASE.z)
    // the visitors look at it from -x: turn its open side to them
    model.rotation.z = 0
    root.add(model)
    // two little stands under it
    for (const z of [-0.6, 0.6]) {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.03, 0.15, 8), mats.brass)
      st.position.set(CASE.x, CASE.top + 0.075, CASE.z + z)
      root.add(st)
    }
  }
  // the two balloons on their poles and the candle on its long stick
  const demo = {}
  const fireMat = new THREE.SpriteMaterial({ map: fire, color: new THREE.Color('#ffd28a').multiplyScalar(1.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 })
  const fireball = new THREE.Sprite(fireMat)
  fireball.raycast = () => {}
  root.add(fireball)
  const flash = new THREE.PointLight('#ffb060', 0, 7, 1.6)
  root.add(flash)
  const shreds = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.06, 0.04), new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide, roughness: 0.6 }), 24)
  shreds.frustumCulled = false
  shreds.raycast = () => {}
  root.add(shreds)
  let shredRun = null
  for (const [id, colorHex] of [['h2', '#c8323d'], ['he', '#a9c8e6']]) {
    const p = POLES[id]
    const g = new THREE.Group()
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, POLE_H, 8), mats.darkWood)
    pole.position.y = POLE_H / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.05, 16), mats.iron)
    foot.position.y = 0.025
    g.add(pole, foot)
    const ballMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: id === 'he' ? 0.25 : 0.05 })
    const b = new THREE.Group()
    const skin = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 16), ballMat)
    skin.scale.set(1, 1.15, 1)
    const knot = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.05, 8), ballMat)
    knot.position.y = -0.25
    knot.rotation.x = Math.PI
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), ghost)
    b.add(skin, knot, hit)
    b.position.y = POLE_H + 0.3
    g.add(b)
    const sign = new THREE.Group()
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.18, 0.02, 2, 0.01), plaqueMat)
    const txt = formulaText(id === 'h2' ? 'H2' : 'He', { size: 0.1, color: '#f2cf7a' })
    txt.position.set(-0.07, 0, 0.012)
    sign.add(back, txt)
    sign.position.set(-0.03, 1.05, 0)
    sign.rotation.y = -Math.PI / 2
    g.add(sign)
    g.position.set(p.x, 0, p.z)
    root.add(g)
    solids.push(circle(p.x, p.z, 0.22))
    demo[id] = { g, b, skin, ballMat, grow: 1 }
  }
  const stick = new THREE.Group()
  const stickFlame = new THREE.Sprite(flameMat)
  {
    const stand = new THREE.Group()
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.07, 18), mats.iron)
    foot.position.y = 0.035
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, CANDLE.pivot, 8), mats.iron)
    post.position.y = CANDLE.pivot / 2
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), mats.brass)
    pin.position.y = CANDLE.pivot
    stand.add(foot, post, pin)
    stand.position.set(CANDLE.x, 0, CANDLE.z)
    root.add(stand)
    solids.push(circle(CANDLE.x, CANDLE.z, 0.22))
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, CANDLE.len, 8), mats.wood)
    rod.position.y = CANDLE.len / 2
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.04, 10), mats.brass)
    holder.position.y = CANDLE.len
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.013, 0.08, 10), new THREE.MeshStandardMaterial({ color: '#efe6cf', roughness: 0.6 }))
    wax.position.y = CANDLE.len + 0.06
    stickFlame.center.set(0.5, 0.1)
    stickFlame.position.y = CANDLE.len + 0.105
    stickFlame.scale.set(0.035, 0.085, 1)
    stick.add(rod, holder, wax, stickFlame)
    stick.position.set(CANDLE.x, CANDLE.pivot, CANDLE.z)
    root.add(stick)
  }
  const STICK_REST = new THREE.Vector3(0.2, 1, 0).normalize()
  const stickTo = id => {
    const p = POLES[id]
    const ballC = new THREE.Vector3(p.x - 0.22, POLE_H + 0.3, p.z)
    return ballC.sub(new THREE.Vector3(CANDLE.x, CANDLE.pivot, CANDLE.z)).normalize()
  }
  let swing = null // { id, t }
  const heliumPanel = lv => ({
    title: E.helium.title,
    color,
    blocks: [
      {
        buttons: [
          { label: E.helium.buttons.model, onClick: () => heliumStep('model') },
          { label: E.helium.buttons.h2, onClick: () => heliumStep('h2') },
          { label: E.helium.buttons.he, onClick: () => heliumStep('he') },
        ],
      },
      ...E.helium.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const REGROW = 3.6
  const ready = id => clock() - (id === 'h2' ? H.hAt : H.heAt) > REGROW + 0.8
  // a visitor's step: a tap on the model (its cells, then its decks, then dark again) or on a balloon (the
  // candle swings to it), or the panel's buttons
  function heliumStep(what) {
    const lv = level()
    const s = E.helium.says
    if (what === 'model') {
      H.model = (H.model + 1) % 3
      H.seenModel = true
      if (H.model === 1) H.cellsT = clock()
      if (H.model === 2) H.decksT = clock()
      play(H.model ? 'select' : 'tap')
      say(at(H.model === 1 ? s.cells : H.model === 2 ? s.decks : s.dark, lv))
      ex.discover('helium', heliumPanel, 3)
      share('helium')
      return
    }
    if (what !== 'h2' && what !== 'he') return
    if (swing || !ready(what)) return say(at(W.busy, lv))
    burst(what, true)
    ex.discover('helium', heliumPanel, 3.5)
    share('helium')
  }
  // the candle swings over, the balloon goes up in flame (hydrogen) or pops (helium), a new one later
  function burst(id, mine) {
    swing = { id, t: 0, mine, done: false }
    if (id === 'h2') {
      H.h++
      H.hAt = clock() + 0.6
    } else {
      H.he++
      H.heAt = clock() + 0.6
    }
  }
  function bang(id, mine) {
    const d = demo[id]
    const c = d.b.getWorldPosition(new THREE.Vector3())
    if (id === 'h2') {
      play('bang')
      fireball.position.copy(c)
      flash.position.copy(c).add(new THREE.Vector3(-1.0, 0.3, 0))
    } else play('pop')
    shredRun = { id, t: 0, c, color: d.ballMat.color.clone(), seed: Math.random() * 10 }
    if (mine) say(at(id === 'h2' ? E.helium.says.whoomp : E.helium.says.pop, level()))
  }
  clickable(model, () => heliumStep('model'))
  clickable(demo.h2.b, () => heliumStep('h2'), { when: () => ready('h2') })
  clickable(demo.he.b, () => heliumStep('he'), { when: () => ready('he') })
  ex.add({
    id: 'helium',
    x: S3.x,
    z: S3.z,
    radius: 2.5,
    manual: true,
    label: E.helium.label,
    verb: () => {
      const h = E.helium.hints
      if (!H.seenModel && H.model === 0) return h.model
      if (H.model === 1) return h.decks
      if (!H.h) return h.h2
      if (!H.he) return h.he
      return h.again
    },
    focus: { x: 8.6, y: 1.35, z: -0.25, size: 4.0, width: 5.4 },
    act: () => ctx.showPanel(heliumPanel),
  })
  updates.push((dt, t) => {
    const now = clock()
    // the model: its cells light one by one from the nose, then its decks glow
    const open = H.model > 0 ? 1 : 0
    nearSkin.material.opacity = damp(nearSkin.material.opacity, open ? 0.14 : 1, 4, dt)
    nearSkin.material.depthWrite = nearSkin.material.opacity > 0.9
    cells.forEach((c, k) => {
      const on = H.model > 0 && now - H.cellsT > k * 0.07
      c.visible = H.model > 0 || nearSkin.material.opacity < 0.95
      c.material.emissiveIntensity = damp(c.material.emissiveIntensity, on ? 0.32 : 0, 6, dt)
    })
    for (const d of deckLights) d.material.emissiveIntensity = damp(d.material.emissiveIntensity, H.model === 2 ? 1.4 : 0, 4, dt)
    // the stick swinging to a balloon and back
    let dir = STICK_REST
    if (swing) {
      swing.t += dt
      const to = stickTo(swing.id)
      const k = span(0, 0.7, swing.t) * (1 - span(1.4, 2.1, swing.t))
      dir = STICK_REST.clone().lerp(to, k).normalize()
      if (swing.t > 0.7 && !swing.done) {
        swing.done = true
        bang(swing.id, swing.mine)
      }
      if (swing.t > 2.2) swing = null
    }
    stick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    const k = 1 + Math.sin(t * 11) * 0.06 + Math.sin(t * 23.7) * 0.05
    stickFlame.scale.set(0.035 * (2 - k), 0.085 * k, 1)
    // the balloons: gone after their burst, a new one growing back
    for (const id of ['h2', 'he']) {
      const since = now - (id === 'h2' ? H.hAt : H.heAt)
      const d = demo[id]
      const grow = since < 0 ? 1 : since < REGROW ? 0 : ease(clamp((since - REGROW) / 0.7))
      d.b.visible = grow > 0.01
      d.b.scale.setScalar(Math.max(0.01, grow))
      d.b.position.x = Math.sin(t * 0.8 + (id === 'h2' ? 0 : 2)) * 0.015
    }
    // the fireball and the shreds
    if (shredRun) {
      shredRun.t += dt
      const r = shredRun
      if (r.id === 'h2' && r.t < 1.4) {
        const f = r.t / 1.4
        fireMat.opacity = Math.sin(Math.PI * Math.min(1, f * 1.3)) * 0.95
        fireball.scale.setScalar(0.4 + 1.5 * ease(Math.min(1, f * 2.2)))
        fireball.position.y = r.c.y + f * 0.6
        flash.intensity = Math.max(0, 1 - f * 1.6) * 3
      } else {
        fireMat.opacity = 0
        flash.intensity = 0
      }
      const col = new THREE.Color()
      for (let i = 0; i < 24; i++) {
        const a = i * 2.4 + r.seed
        const sp = 0.6 + (i % 5) * 0.25
        const tt = r.t
        dummy.position.set(r.c.x + Math.cos(a) * sp * tt * 0.8, Math.max(0.02, r.c.y + Math.sin(i) * 0.4 * tt - 2.2 * tt * tt), r.c.z + Math.sin(a) * sp * tt * 0.8)
        dummy.rotation.set(tt * 6 + i, tt * 4, i)
        dummy.scale.setScalar(r.t < 4 ? 1 : 0.001)
        dummy.updateMatrix()
        shreds.setMatrixAt(i, dummy.matrix)
        shreds.setColorAt(i, col.copy(r.color))
      }
      shreds.instanceMatrix.needsUpdate = true
      if (shreds.instanceColor) shreds.instanceColor.needsUpdate = true
      if (r.t > 4) shredRun = null
    } else {
      fireMat.opacity = 0
      flash.intensity = 0
      dummy.scale.setScalar(0.001)
      dummy.updateMatrix()
      for (let i = 0; i < 24; i++) shreds.setMatrixAt(i, dummy.matrix)
      shreds.instanceMatrix.needsUpdate = true
    }
  })
  const heliumState = () => ({
    model: H.model,
    h: H.h,
    he: H.he,
    hAge: Math.round(clamp(clock() - H.hAt, 0, 30) * 10) / 10,
    heAge: Math.round(clamp(clock() - H.heAt, 0, 30) * 10) / 10,
  })
  const heliumSet = (s, liveSet, ago = 0) => {
    const model = clamp(Math.round(Number(s?.model) || 0), 0, 2)
    if (model !== H.model) {
      if (model === 1) H.cellsT = liveSet ? clock() : -99
      if (model === 2) H.decksT = clock()
      H.model = model
    }
    for (const id of ['h2', 'he']) {
      const key = id === 'h2' ? 'h' : 'he'
      const n = Math.max(0, Math.round(Number(s?.[key]) || 0))
      // (an age of 0 is a burst just now: not the "long ago" of a missing one)
      const given = Number(s?.[id === 'h2' ? 'hAge' : 'heAge'])
      const age = clamp((Number.isFinite(given) ? given : 30) + (Number(ago) || 0), 0, 30)
      const was = id === 'h2' ? H.h : H.he
      if (liveSet && n > was && age < 2) {
        if (id === 'h2') H.h = n - 1
        else H.he = n - 1
        burst(id, false)
      } else {
        if (id === 'h2') {
          H.h = n
          H.hAt = n ? clock() - age : -99
        } else {
          H.he = n
          H.heAt = n ? clock() - age : -99
        }
      }
    }
  }

  // ---- the picture's silver airship, far off in the sky ----
  const farShip = new THREE.Group()
  {
    const prof = []
    for (let i = 0; i <= 24; i++) {
      const u = i / 24
      const f = u < 0.14 ? Math.sqrt(1 - ((0.14 - u) / 0.14) ** 2) : u < 0.5 ? 1 : 1 - Math.pow((u - 0.5) / 0.5, 1.9) * 0.96
      prof.push(new THREE.Vector2(Math.max(0.01, f * 4.1), u * 49))
    }
    const hull = new THREE.Mesh(new THREE.LatheGeometry(prof, 20), new THREE.MeshStandardMaterial({ color: '#c3c8d0', roughness: 0.4, metalness: 0.4, fog: true }))
    hull.rotation.z = -Math.PI / 2
    farShip.add(hull)
    farShip.position.set(-60, 120, -300)
    root.add(farShip)
  }
  updates.push((dt, t) => {
    farShip.position.x = -260 + ((t * 1.6) % 520)
    stage.update(t)
  })

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.6 },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      charliere: {
        // 'barrel' (a barrel, i 0 to 5), 'bag' (a sandbag, i 0 to 5, or the next), 'ropes'
        tap: (what, i = -1) => charliereStep(what === 'bag' && i >= 0 ? 'bagAt' : what, i),
        set: f => setFill(f),
        get state() {
          return charliereState()
        },
        get net() {
          return net()
        },
        at: what => (what === 'barrel' ? barrels[0].group.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.5, 0)) : what === 'bag' ? bags.find((b, i) => !C.gone[i])?.group.getWorldPosition(new THREE.Vector3()) : car.getWorldPosition(new THREE.Vector3())),
      },
      race: {
        // 'hot', 'air', 'he', 'h2' (a balloon), 'lens', 'all', 'none'
        tap: what => raceStep(what),
        temp: c => setTemp(c),
        get state() {
          return { ...G, on: { ...G.on } }
        },
        at: id => (id === 'lens' ? lens.getWorldPosition(new THREE.Vector3()) : balls.find(b => b.id === id)?.ball.getWorldPosition(new THREE.Vector3())),
      },
      helium: {
        // 'model', 'h2' or 'he' (a balloon)
        tap: what => heliumStep(what),
        get state() {
          return heliumState()
        },
        at: id => (id === 'model' ? model.getWorldPosition(new THREE.Vector3()) : demo[id]?.b.getWorldPosition(new THREE.Vector3())),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { charliere: charlierePanel, race: racePanel, helium: heliumPanel },
    shared: {
      charliere: { get: charliereState, set: charliereSet },
      race: { get: () => ({ on: { ...G.on }, temp: G.temp, lens: G.lens }), set: raceSet },
      helium: { get: heliumState, set: heliumSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      if (fillSend) clearTimeout(fillSend)
      if (tempSend) clearTimeout(tempSend)
      for (const tx of textures) tx.dispose()
    },
  }
}
