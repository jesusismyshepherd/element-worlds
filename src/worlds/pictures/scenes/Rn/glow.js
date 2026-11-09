// Radon's picture "Can a frozen gas glow by itself?" as a room (docs/knowledge/picture-rooms.md): the
// picture's close-up made into a place. The visitor is shrunk into Gray and Ramsay's capillary of 1909
// (stages/capillary.js, made for this room): a glass tunnel, the mercury thread's silver face behind, the
// tube's drawn end ahead inside a cold jacket, where the radon is, at first a haze of teal motes (the radon
// atoms of all seven radon rooms). Three things to do, each step chosen by tapping its thing; the prompt
// names the next tap, E opens the station's panel, whose buttons and slider do the same:
// - the cold bath, at the tip: tap the thermometer at a temperature (or the slider, +20 to −190 °C), or the
//   liquid air tap. The gas condenses at −62 °C into a drop clear as water that makes the glass glow;
//   at −71 °C it freezes and shines by itself, steel-blue, yellow colder, orange-red in liquid air;
//   warming runs back, the red going out sharply at −118 °C (Gray and Ramsay 1909; the phases from their
//   vapour pressure table, so squeezing changes them too);
// - three kinds of glass, on the right: tap silica, lead-potash or soda glass and the tube is made of it,
//   the liquid's glow on it blue, bluish green or lilac; the wheel pushes the mercury (a pressure slider):
//   squeezed to 20 atm the gas turns liquid even warm (as they made it), squeezed hard in soda glass the
//   glow is "at once blue and pink";
// - the microbalance of 1910, on the left: tap one of five sealed tubes of radon (their samples I to V) or
//   a tube of air to hang it on the quartz beam; let air out of the case (the slider) until the beam is
//   level, or tap the beam; the board fills with the masses, 1909's guess of 176, 1910's 216 to 227, 222.
// Leaving, the Atomling points at the neon sign workshop (why radon never goes into a sign).
// All three are shared in a room (src/net/shared.js). parts.<station>.tap(...) does what a tap does.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, random, fill, num, screen } from '../../../wings/noble/kit.js'
import { capillaryStage, CAPILLARY } from '../../stages/capillary.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { GLOW_WORDS } from './glow.words.js'

export const WORDS = GLOW_WORDS

const TAU = Math.PI * 2
const { R, axisY: AY, backZ: BACK, tipZ: TIP, coneLen: CONE, tipR: TIPR } = CAPILLARY
const S_PLUG = 4.25 // how far into the cone the condensed radon reaches (m)
const MEN_Z = TIP - S_PLUG // its surface
const TEAL = '#3cc3d6'
const TEAL_HALO = '#6ff0ff'
const PINK = '#ff6fc4'
const MELT = -71
const RED_OUT = -118
// Gray and Ramsay's vapour pressures (1909): kelvin, mm of mercury; "below 500 mm the emanation is solid"
const VP = [[202.6, 500], [212.4, 800], [217.2, 1000], [234.5, 2000], [255.3, 4000], [262.8, 5000], [290.3, 10000], [307.6, 15000], [321.7, 20000], [334.5, 25000], [346.0, 30000], [356.0, 35000], [364.4, 40000], [372.9, 45000], [377.5, 47450]]
const ATM = 760
/** The vapour pressure (mm of mercury) at t °C, log-interpolated in their table. */
export function vapour(t) {
  const K = t + 273.15
  const i = Math.max(0, Math.min(VP.length - 2, VP.findIndex(p => p[0] > K) - 1))
  const [k0, p0] = VP[i < 0 ? 0 : i]
  const [k1, p1] = VP[(i < 0 ? 0 : i) + 1]
  const u = (K - k0) / (k1 - k0)
  return Math.exp(Math.log(p0) + u * (Math.log(p1) - Math.log(p0)))
}
/** Gas, liquid or solid at t °C under p atm. */
export const phaseOf = (t, p) => (t < MELT ? 'solid' : p * ATM >= vapour(t) ? 'liquid' : 'gas')
// the three glasses: the colour the liquid makes each glow, and a faint tint of the glass itself
const GLASSES = ['silica', 'lead', 'soda']
const GLASS = {
  silica: { glow: '#4d8cff', tint: '#e2f0ff' },
  lead: { glow: '#2fd6b4', tint: '#eaf0dc' },
  soda: { glow: '#b48aff', tint: '#dcf2e4' },
}
// the solid's own glow: steel-blue near its melting point, yellow colder, orange-red in liquid air
const C_BLUE = new THREE.Color('#7ea4ff')
const C_YELLOW = new THREE.Color('#ffd23a')
const C_ORANGE = new THREE.Color('#ff8a24')
const C_RED = new THREE.Color('#ff4416')
const smoothK = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
function solidColour(t, out) {
  if (t >= -84) return out.copy(C_BLUE)
  if (t >= -110) return out.copy(C_BLUE).lerp(C_YELLOW, smoothK(-84, -110, t))
  if (t >= RED_OUT) return out.copy(C_YELLOW).lerp(C_ORANGE, smoothK(RED_OUT + 1.5, RED_OUT - 0.5, t))
  return out.copy(C_ORANGE).lerp(C_RED, smoothK(RED_OUT, -185, t))
}
const bandOf = t => (t >= -97 ? 'blue' : t >= RED_OUT ? 'yellow' : 'red')
// the cold bath's thermometer (outside the tube, in the jacket beside the cone)
const THERMO = { x: -3.2, z: -14.6, y0: 0.75, y1: 4.25, t0: -200, t1: 30 }
const yOfT = t => THERMO.y0 + ((t - THERMO.t0) / (THERMO.t1 - THERMO.t0)) * (THERMO.y1 - THERMO.y0)
const tOfY = y => THERMO.t0 + ((y - THERMO.y0) / (THERMO.y1 - THERMO.y0)) * (THERMO.t1 - THERMO.t0)
const FLASK = { x: -6.95, y: -0.2, z: -16.9 } // the liquid air flask outside the jacket
const VALVE = { x: -6.3, y: -0.95, z: -16.9 }
// station 2: the glasses and the wheel on the right
const PLAQUE_Z = -10.05
const PLAQUE_Y = 1.32
const plaqueX = i => 1.0 + i * 0.8
const WHEEL = { x: 2.7, y: 1.15, z: -8.7, turn: 0.75 }
const DIAL = { y: 2.2, r: 0.4 }
const P_MAX = 60
// station 3: the microbalance of 1910 on the left
const BAL = { x: -2.2, z: -1.8, top: 0.95 }
const PIVOT = new THREE.Vector3(BAL.x, 2.1, BAL.z)
const ARM = 1.2
const RACK = { x: -1.15, z: -3.15, y: 1.02 }
const SAMPLES = [
  { id: 'I', v: 72.8, m: 722 },
  { id: 'II', v: 58.5, m: 564 },
  { id: 'III', v: 58.5, m: 577 },
  { id: 'IV', v: 67.7, m: 658 },
  { id: 'V', v: 73.0, m: 706 },
  { id: 'air', v: 72.8, m: 94 }, // the same volume as I, of air: 0.0728 mm3 x 1.293 mg/cm3
]
const READ_MAX = 900
const minus = n => `${n < -0.5 ? '−' : ''}${Math.abs(Math.round(n))}`

export async function build({ ctx, root, lang, E, ex, say, light, level, color, clickable }) {
  const stage = capillaryStage({ light })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const glowTex = stage.glowTexture
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o })
  const glassMat = (c = '#d8eef4', op = 0.2) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.06, metalness: 0.1, transparent: true, opacity: op, depthWrite: false, envMap: stage.shine, envMapIntensity: 1.2 })
  const sprite = (c, size, op = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(size)
    return s
  }
  const mk = (geo, mat, x, y, z, parent = root) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  const hit = (w, h, d, x, y, z, parent = root) => mk(new THREE.BoxGeometry(w, h, d), ghost, x, y, z, parent)
  const narrow = () => (ctx.camera?.aspect ?? 1.6) < 1
  const focusBy = (item, wide, tall) => Object.defineProperty(item, 'focus', { get: () => (narrow() ? tall : wide), configurable: true })
  const tag = (text, x, y, z, rotY, size = 0.1, c = '#e8ecf6', o = {}) => {
    const t = makeText(text, { size, color: c, anchorY: 'middle', outlineWidth: size * 0.08, outlineColor: '#141826', ...o })
    t.position.set(x, y, z)
    t.rotation.y = rotY
    root.add(t)
    return t
  }
  const setText = (t, s) => {
    if (t.text === s) return
    t.text = s
    t.sync()
  }
  const refresh = (title, panel) => ctx.store.get().panel?.title === title && ctx.showPanel(panel)
  // the Atomling's lines on what happens by itself: each stays a while before the next one replaces it
  let toldAt = -99
  let pending = null
  let clock = 0
  const tell = text => {
    if (!text) return
    if (clock - toldAt < 3.2) pending = text
    else {
      say(text)
      toldAt = clock
      pending = null
    }
  }

  // ================= the radon: motes, the condensed plug, sparks of its decays =================
  const S1 = { T: 20 }
  const S2 = { glass: 'soda', P: 1 }
  const live = { Tnow: 20, Pnow: 1, phase: 'gas', band: 'blue', G: 0, liquidK: 0, solidK: 0, hardK: 0, mine: 0, pour: 0, fill: 0, air: 0, glassK: 1, glassCol: new THREE.Color(GLASS.soda.glow), solidCol: new THREE.Color(C_BLUE) }

  // the plug: the condensed radon filling the drawn end, from the tip to a concave surface
  const plug = new THREE.Group()
  root.add(plug)
  const profile = []
  const rr = TIPR - 0.1
  for (let i = 0; i <= 8; i++) {
    const th = (i / 8) * (Math.PI / 2)
    profile.push(new THREE.Vector2(Math.max(0.001, rr * Math.sin(th)), CONE + rr * Math.cos(th)))
  }
  for (let i = 1; i <= 8; i++) {
    const s = CONE + (S_PLUG - CONE) * (i / 8)
    profile.push(new THREE.Vector2(stage.radiusAt(TIP - s) - 0.1, s))
  }
  const rM = stage.radiusAt(MEN_Z) - 0.1
  const DEPTH = 0.55
  const menPts = []
  for (let i = 0; i <= 10; i++) {
    const u = i / 10
    menPts.push(new THREE.Vector2(Math.max(0.001, rM * (1 - u)), S_PLUG + DEPTH * (1 - (1 - u) * (1 - u))))
  }
  profile.push(...menPts.slice(1))
  const toWorld = g => g.rotateX(-Math.PI / 2).translate(0, AY, TIP)
  const plugGeo = toWorld(new THREE.LatheGeometry(profile, light ? 40 : 72))
  const plugMat = new THREE.MeshStandardMaterial({ color: '#dff0ff', transparent: true, opacity: 0, roughness: 0.05, metalness: 0.1, envMap: stage.shine, envMapIntensity: 1.3, depthWrite: false, side: THREE.DoubleSide, emissive: '#000000' })
  const plugMesh = new THREE.Mesh(plugGeo, plugMat)
  plugMesh.renderOrder = 2
  plug.add(plugMesh)
  // the liquid's surface catches the light: a shining skin and a bright rim where it meets the glass
  const menGeo = toWorld(new THREE.LatheGeometry(menPts, light ? 40 : 72))
  const menMat = new THREE.MeshStandardMaterial({ color: '#eaf6ff', transparent: true, opacity: 0, roughness: 0.02, metalness: 0.5, envMap: stage.shine, envMapIntensity: 1.6, depthWrite: false, side: THREE.DoubleSide })
  const men = new THREE.Mesh(menGeo, menMat)
  men.renderOrder = 3
  plug.add(men)
  const rimMat = new THREE.MeshBasicMaterial({ color: '#e8f6ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const rimRing = mk(new THREE.TorusGeometry(rM, 0.035, 8, 96), rimMat, 0, AY, MEN_Z, plug)
  rimRing.renderOrder = 3
  // the solid: crystal shards packed in the same space, each with its own brightness, brighter at the heart
  const NS = light ? 110 : 220
  const shardMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.8, roughness: 0.25, metalness: 0.05, flatShading: true })
  const shards = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), shardMat, NS)
  shards.frustumCulled = false
  plug.add(shards)
  const shardPose = []
  {
    const rnd = random(1909)
    const o = new THREE.Object3D()
    const c = new THREE.Color()
    for (let i = 0; i < NS; i++) {
      // more of them near the face the visitor sees
      const s = S_PLUG + 0.15 + Math.pow(rnd(), 1.6) * (CONE + TIPR * 0.5 - S_PLUG)
      const rMax = Math.max(0.15, stage.radiusAt(TIP - s) - 0.2)
      const r = Math.sqrt(rnd()) * rMax
      const a = rnd() * TAU
      o.position.set(Math.cos(a) * r, AY + Math.sin(a) * r, TIP - s)
      o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
      const k = 0.1 + rnd() * 0.22
      o.scale.set(k * (0.6 + rnd() * 0.5), k * (1 + rnd() * 0.9), k * (0.6 + rnd() * 0.5))
      o.updateMatrix()
      shardPose.push(o.matrix.clone())
      shards.setMatrixAt(i, o.matrix)
      const heart = 1 - clamp(r / rMax) * 0.5 - clamp((s - S_PLUG) / 4) * 0.2
      shards.setColorAt(i, c.setScalar(0.55 + heart * 0.7 + rnd() * 0.15))
    }
    shards.instanceColor.needsUpdate = true
  }
  const shardScale = new THREE.Object3D()
  let lastShardK = -1
  const heartGlow = sprite('#ffffff', 4.2, 0)
  heartGlow.position.set(0, AY, MEN_Z - 0.9)
  heartGlow.renderOrder = 4
  plug.add(heartGlow)
  const plugLight = new THREE.PointLight('#b48aff', 0.4, 18, 1.4)
  plugLight.position.set(0, AY, MEN_Z - 0.8)
  root.add(plugLight)
  const plugHit = mk(new THREE.SphereGeometry(1.8, 16, 10), ghost, 0, AY, MEN_Z - 1.0)

  // the motes: radon atoms as teal balls with a soft halo, drifting through the tube while it is a gas
  const NM = light ? 36 : 70
  const moteGeo = new THREE.SphereGeometry(0.075, 12, 8)
  const moteMat = new THREE.MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 1.1, roughness: 0.35 })
  const motes = new THREE.InstancedMesh(moteGeo, moteMat, NM)
  motes.frustumCulled = false
  motes.raycast = () => {}
  root.add(motes)
  const haloPos = new Float32Array(NM * 3)
  const haloGeo = new THREE.BufferGeometry()
  haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3))
  const halos = new THREE.Points(haloGeo, new THREE.PointsMaterial({ color: TEAL_HALO, size: 0.6, map: glowTex, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }))
  halos.frustumCulled = false
  halos.raycast = () => {}
  halos.renderOrder = 5
  root.add(halos)
  const moteSeed = []
  {
    const rnd = random(222)
    for (let i = 0; i < NM; i++) {
      // most in the front half, near the tip; a few all the way back
      const z = TIP - 1.2 + Math.pow(rnd(), 2.2) * (BACK - 3 - (TIP - 1.2))
      const rMax = stage.radiusAt(z) - 0.9
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * rMax
      const y = Math.max(0.45, AY + Math.sin(a) * r)
      const ta = rnd() * TAU
      const tr = Math.sqrt(rnd()) * 1.3
      moteSeed.push({
        home: new THREE.Vector3(Math.cos(a) * r, y, z),
        to: new THREE.Vector3(Math.cos(ta) * tr, AY + Math.sin(ta) * tr, MEN_Z - 0.4 - rnd() * 1.0),
        ph: rnd() * 10,
        sp: 0.25 + rnd() * 0.35,
        lag: rnd() * 0.55,
      })
    }
  }
  const mDummy = new THREE.Object3D()
  const mPos = new THREE.Vector3()
  const mTmp = new THREE.Vector3()

  // the sparks of its decays: little flashes that shoot out and fade (calm, a few a second)
  const NSPARK = 24
  const sparks = []
  for (let i = 0; i < NSPARK; i++) {
    const s = sprite('#fff0d0', 0.16, 0)
    s.renderOrder = 6
    root.add(s)
    sparks.push({ s, age: 9, from: new THREE.Vector3(), dir: new THREE.Vector3() })
  }
  let sparkClock = 0
  const fireSpark = (p, len = 0.55) => {
    const sp = sparks.find(x => x.age > 0.35)
    if (!sp) return
    sp.age = 0
    sp.from.copy(p)
    sp.dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(len)
  }

  // ================= station 1: the cold bath =================
  // the thermometer: a pentane column on a dark board, the temperatures that matter marked
  const thermo = new THREE.Group()
  thermo.position.set(THERMO.x, 0, THERMO.z)
  root.add(thermo)
  mk(new RoundedBoxGeometry(0.05, THERMO.y1 - THERMO.y0 + 0.75, 1.15, 2, 0.02), mats.navy, -0.16, (THERMO.y0 + THERMO.y1) / 2 + 0.05, 0, thermo)
  mk(new THREE.CylinderGeometry(0.07, 0.07, THERMO.y1 - THERMO.y0 + 0.2, 16), glassMat('#e8f4ff', 0.3), 0, (THERMO.y0 + THERMO.y1) / 2 + 0.1, 0, thermo)
  const pentane = M('#e8463a', { emissive: '#e8463a', emissiveIntensity: 0.6 })
  mk(new THREE.SphereGeometry(0.15, 16, 12), pentane, 0, THERMO.y0 - 0.12, 0, thermo)
  const column = mk(new THREE.CylinderGeometry(0.04, 0.04, 1, 10), pentane, 0, 0, 0, thermo)
  const setColumn = t => {
    const top = yOfT(t)
    column.scale.y = Math.max(0.01, top - (THERMO.y0 - 0.1))
    column.position.y = (top + THERMO.y0 - 0.1) / 2
  }
  // ticks every 10 °C, longer every 50
  for (let t = -200; t <= 30; t += 10) {
    const long = t % 50 === 0
    mk(new THREE.BoxGeometry(0.01, 0.012, long ? 0.2 : 0.11), M('#c8d2ec', { emissive: '#c8d2ec', emissiveIntensity: 0.3 }), -0.12, yOfT(t), long ? 0.17 : 0.12, thermo)
  }
  const MARKS = [
    { t: 20, key: 'room', side: 1 },
    { t: -62, key: 'boil', side: 1 },
    { t: -71, key: 'freeze', side: -1 },
    { t: -118, key: 'red', side: 1, col: '#ff8a6a' },
    { t: -190, key: 'air', side: 1, col: '#9fd0ff' },
  ]
  const markLights = []
  for (const mkr of MARKS) {
    const y = yOfT(mkr.t)
    const lit = M('#6a7290', { emissive: mkr.col ?? '#ffd27a', emissiveIntensity: 0.15 })
    mk(new THREE.BoxGeometry(0.02, 0.025, 0.36), lit, -0.1, y, 0, thermo)
    // labels read from inside the tube (+x): text runs toward -z
    const label = `${minus(mkr.t)} °C ${E.cold.tags[mkr.key]}`
    const tx = makeText(label, { size: 0.13, color: mkr.col ?? '#e8ecf6', anchorX: mkr.side > 0 ? 'left' : 'right', anchorY: 'middle', outlineWidth: 0.008, outlineColor: '#141826' })
    tx.position.set(-0.08, y, mkr.side > 0 ? -0.24 : 0.24)
    tx.rotation.y = Math.PI / 2
    thermo.add(tx)
    markLights.push({ ...mkr, lit })
  }
  const readout = makeText('20 °C', { size: 0.26, color: '#ffffff', anchorY: 'middle', outlineWidth: 0.014, outlineColor: '#141826' })
  readout.position.set(-0.05, THERMO.y1 + 0.45, 0)
  readout.rotation.y = Math.PI / 2
  thermo.add(readout)
  const thermoHit = hit(0.4, THERMO.y1 - THERMO.y0 + 0.3, 1.3, THERMO.x, (THERMO.y0 + THERMO.y1) / 2, THERMO.z)
  // the liquid air: a silvered flask outside the jacket, a brass tap, a pipe into the bath
  const flask = new THREE.Group()
  flask.position.set(FLASK.x, FLASK.y, FLASK.z)
  root.add(flask)
  {
    const silver = M('#c9d0dc', { metalness: 0.9, roughness: 0.18, envMap: stage.shine, envMapIntensity: 1.3 })
    mk(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32), silver, 0, 0, 0, flask)
    mk(new THREE.SphereGeometry(0.5, 32, 12, 0, TAU, Math.PI / 2, Math.PI / 2), silver, 0, -0.75, 0, flask)
    mk(new THREE.CylinderGeometry(0.22, 0.3, 0.2, 24), mats.rubber, 0, 0.85, 0, flask)
    mk(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 10), mats.steel, 0, -1.9, 0, flask)
    const mistTop = sprite('#e8f2ff', 0.9, 0.18)
    mistTop.position.set(0, 1.05, 0)
    flask.add(mistTop)
    // the pipe from the flask's foot to the tap and on into the jacket
    const pipe = (a, b) => {
      const m = mk(new THREE.CylinderGeometry(0.05, 0.05, 1, 10), mats.brass, 0, 0, 0)
      m.position.copy(a).add(b).multiplyScalar(0.5)
      m.scale.y = a.distanceTo(b)
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
    }
    pipe(new THREE.Vector3(FLASK.x + 0.3, FLASK.y - 0.6, FLASK.z), new THREE.Vector3(VALVE.x, VALVE.y, VALVE.z))
    pipe(new THREE.Vector3(VALVE.x, VALVE.y, VALVE.z), new THREE.Vector3(-4.6, VALVE.y, VALVE.z))
  }
  const valve = new THREE.Group()
  valve.position.set(VALVE.x, VALVE.y, VALVE.z)
  root.add(valve)
  mk(new THREE.CylinderGeometry(0.12, 0.12, 0.26, 16), mats.brass, 0, 0, 0, valve).rotation.z = Math.PI / 2
  const valveWheel = new THREE.Group()
  valveWheel.position.set(0, 0.32, 0)
  valve.add(valveWheel)
  mk(new THREE.TorusGeometry(0.2, 0.03, 8, 24), M('#2f6fd0', { roughness: 0.45 }), 0, 0, 0, valveWheel).rotation.x = Math.PI / 2
  for (let i = 0; i < 3; i++) mk(new THREE.BoxGeometry(0.4, 0.025, 0.025), M('#2f6fd0', { roughness: 0.45 }), 0, 0, 0, valveWheel).rotation.y = (i * Math.PI) / 3
  mk(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8), mats.brass, 0, 0.16, 0, valve)
  const valveHit = hit(1.6, 3.2, 1.3, (FLASK.x + VALVE.x) / 2, FLASK.y - 0.4, FLASK.z)
  // the stream of liquid air falling into the jacket while it pours
  const streamMat = new THREE.MeshBasicMaterial({ color: '#bfe2ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const stream = mk(new THREE.CylinderGeometry(0.05, 0.08, 2.8, 10, 1, true), streamMat, -4.55, VALVE.y - 1.4, VALVE.z)

  const tHint = () => {
    const h = E.cold.hints
    const t = live.Tnow
    if (Math.abs(t - S1.T) > 3) return h.cooling
    if (live.phase === 'gas') return h.start
    if (live.phase === 'liquid') return h.liquid
    if (t > -180) return h.solid
    return h.coldest
  }
  function coldStep(what, arg) {
    const lv = level()
    const says = E.cold.says
    live.mine = 16
    if (what === 'temp' || what === 'thermo') {
      S1.T = clamp(Math.round(Number(arg)), -190, 20)
      if (what === 'thermo') play('tap')
    } else if (what === 'tap') {
      // the liquid air tap: pour it in, or let the bath go and warm up
      if (S1.T > -180) {
        S1.T = -190
        live.pour = 2.8
        play('fizz')
        tell(at(says.pour, lv))
      } else {
        S1.T = 20
        play('tap')
        tell(at(says.warm, lv))
      }
    } else if (what === 'liquid') S1.T = -66
    else if (what === 'freeze') S1.T = -84
    else if (what === 'air') {
      S1.T = -190
      live.pour = 2.8
      play('fizz')
    } else if (what === 'warm') S1.T = 20
    else if (what === 'radon') {
      play('tap')
      tell(at(says.look[live.phase], lv))
    } else return
    refresh(E.cold.title, coldPanel)
    ex.discover('cold', coldPanel, 4.2)
    if (what !== 'radon') share('cold')
  }
  const coldPanel = lv => ({
    title: E.cold.title,
    color,
    blocks: [
      { slider: { label: E.cold.slider, min: -190, max: 20, step: 1, value: S1.T, onInput: v => coldStep('temp', v), format: v => `${minus(v)} °C`, live: () => S1.T } },
      {
        buttons: [
          { label: E.cold.buttons.liquid, onClick: () => coldStep('liquid') },
          { label: E.cold.buttons.freeze, onClick: () => coldStep('freeze') },
          { label: E.cold.buttons.air, onClick: () => coldStep('air') },
          { label: E.cold.buttons.warm, onClick: () => coldStep('warm') },
        ],
      },
      { rows: [[E.cold.rows.state, E.cold.states[live.phase]], [E.cold.rows.pressure, `${Math.round(S2.P)} atm`]] },
      ...E.cold.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(thermoHit, h => coldStep('thermo', tOfY(h.point.y)), { reach: 8 })
  clickable(valveHit, () => coldStep('tap'), { reach: 10.5 })
  clickable(plugHit, () => coldStep('radon'), { reach: 9 })
  const coldItem = ex.add({
    id: 'cold',
    x: -0.6,
    z: -9.3,
    radius: 1.9,
    manual: true,
    label: E.cold.label,
    verb: tHint,
    focus: { x: -1.2, y: 2.0, z: -15.2, size: 4.4, width: 5.4 },
    act: () => ctx.showPanel(coldPanel),
  })
  focusBy(coldItem, coldItem.focus, { x: -0.6, y: 2.1, z: -15.4, size: 4.4, width: 6.3 })

  // ================= station 2: three kinds of glass, the wheel that squeezes =================
  // the three glasses stand in a row across the end of the walkway, facing the visitor, so the station's view
  // holds them and the glowing tip behind them
  const plaques = GLASSES.map((id, i) => {
    const x = plaqueX(i)
    const g = new THREE.Group()
    g.position.set(x, 0, PLAQUE_Z)
    root.add(g)
    mk(new THREE.CylinderGeometry(0.03, 0.035, PLAQUE_Y - 0.3, 10), mats.steel, 0, (PLAQUE_Y - 0.3) / 2, -0.04, g)
    mk(new THREE.CylinderGeometry(0.17, 0.2, 0.05, 20), mats.dark, 0, 0.025, -0.04, g)
    const disc = mk(new THREE.CylinderGeometry(0.33, 0.33, 0.06, 40), glassMat(GLASS[id].tint, 0.35), 0, PLAQUE_Y, 0, g)
    disc.rotation.x = Math.PI / 2
    disc.renderOrder = 1
    const rimM = new THREE.MeshStandardMaterial({ color: GLASS[id].glow, emissive: GLASS[id].glow, emissiveIntensity: 0.35, roughness: 0.4 })
    mk(new THREE.TorusGeometry(0.34, 0.03, 10, 48), rimM, 0, PLAQUE_Y, 0, g)
    const halo = sprite(GLASS[id].glow, 1.1, 0)
    halo.position.set(0, PLAQUE_Y, 0.08)
    g.add(halo)
    const label = tag(E.glass.tags[id], x, PLAQUE_Y - 0.5, PLAQUE_Z + 0.02, 0, 0.085, GLASS[id].glow)
    const h = hit(0.74, 1.0, 0.3, x, PLAQUE_Y - 0.1, PLAQUE_Z)
    clickable(h, () => glassStep(id), { reach: 5.8 })
    solids.push(circle(x, PLAQUE_Z, 0.22))
    return { id, g, rimM, halo, label, k: id === S2.glass ? 1 : 0 }
  })
  // the wheel: it turns the screw that pushes the mercury along the tube; the dial shows the pressure.
  // It stands against the right wall, turned toward the station.
  const wheelG = new THREE.Group()
  wheelG.position.set(WHEEL.x, 0, WHEEL.z)
  wheelG.rotation.y = WHEEL.turn
  root.add(wheelG)
  mk(new THREE.CylinderGeometry(0.09, 0.12, WHEEL.y, 12), mats.dark, 0.12, WHEEL.y / 2, 0, wheelG)
  mk(new THREE.CylinderGeometry(0.28, 0.32, 0.06, 20), mats.dark, 0.12, 0.03, 0, wheelG)
  const handwheel = new THREE.Group()
  handwheel.position.set(-0.05, WHEEL.y, 0)
  wheelG.add(handwheel)
  {
    const t = mk(new THREE.TorusGeometry(0.36, 0.04, 10, 36), mats.brass, 0, 0, 0, handwheel)
    t.rotation.y = Math.PI / 2
    for (let i = 0; i < 6; i++) {
      const sp = mk(new THREE.BoxGeometry(0.03, 0.72, 0.03), mats.brass, 0, 0, 0, handwheel)
      sp.rotation.x = (i * Math.PI) / 6
    }
    mk(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 16), mats.brass, 0, 0, 0, handwheel).rotation.z = Math.PI / 2
    mk(new THREE.SphereGeometry(0.05, 10, 8), mats.dark, -0.02, 0.36, 0, handwheel)
  }
  // the dial
  const dialFace = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#0d1233'
    g.beginPath()
    g.arc(w / 2, w / 2, w / 2 - 4, 0, TAU)
    g.fill()
    g.strokeStyle = '#c99a48'
    g.lineWidth = 14
    g.stroke()
    const a0 = Math.PI * 0.75
    const a1 = Math.PI * 2.25
    for (let p = 0; p <= P_MAX; p += 5) {
      const a = a0 + (a1 - a0) * (p / P_MAX)
      const long = p % 10 === 0
      g.strokeStyle = '#d8e0ff'
      g.lineWidth = long ? 7 : 3
      g.beginPath()
      g.moveTo(w / 2 + Math.cos(a) * (w * 0.42), w / 2 + Math.sin(a) * (w * 0.42))
      g.lineTo(w / 2 + Math.cos(a) * (w * (long ? 0.33 : 0.37)), w / 2 + Math.sin(a) * (w * (long ? 0.33 : 0.37)))
      g.stroke()
      if (long) {
        g.fillStyle = '#ffffff'
        g.font = '700 46px Outfit, sans-serif'
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillText(String(p), w / 2 + Math.cos(a) * (w * 0.25), w / 2 + Math.sin(a) * (w * 0.25))
      }
    }
    g.fillStyle = '#9fb0e0'
    g.font = '700 40px Outfit, sans-serif'
    g.fillText('atm', w / 2, w * 0.72)
  })
  disposers.push(dialFace)
  const dial = new THREE.Group()
  dial.position.set(0.05, DIAL.y, 0)
  dial.rotation.y = -Math.PI / 2
  wheelG.add(dial)
  mk(new THREE.CylinderGeometry(DIAL.r + 0.05, DIAL.r + 0.05, 0.1, 40), mats.brass, 0, 0, -0.05, dial).rotation.x = Math.PI / 2
  mk(new THREE.CircleGeometry(DIAL.r, 40), new THREE.MeshBasicMaterial({ map: dialFace }), 0, 0, 0.005, dial)
  mk(new THREE.CylinderGeometry(0.03, 0.03, DIAL.y - WHEEL.y - 0.4, 8), mats.dark, 0, -(DIAL.y - WHEEL.y) / 2 - 0.2, -0.1, dial)
  const needle = (c, len, w) => {
    const g = new THREE.Group()
    g.position.z = 0.02
    dial.add(g)
    mk(new THREE.BoxGeometry(w, len, 0.012), new THREE.MeshBasicMaterial({ color: c }), 0, len / 2 - 0.05, 0, g)
    return g
  }
  const needleP = needle('#ffffff', DIAL.r * 0.85, 0.028)
  const needleV = needle('#ff4a3a', DIAL.r * 0.75, 0.02)
  mk(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), mats.brass, 0, 0, 0.03, dial).rotation.x = Math.PI / 2
  const angleOf = p => {
    // the canvas runs clockwise from lower left (0) to lower right (60); the needle points up at angle 0
    const a = Math.PI * 0.75 + Math.PI * 1.5 * clamp(p / P_MAX)
    return -(a + Math.PI / 2)
  }
  const pTx = makeText('1 atm', { size: 0.12, color: '#ffffff', anchorY: 'middle', outlineWidth: 0.01, outlineColor: '#141826' })
  pTx.position.set(0, -DIAL.r - 0.13, 0.03)
  dial.add(pTx)
  const wheelTag = makeText(E.glass.tags.wheel, { size: 0.1, color: '#ffd27a', anchorY: 'middle', outlineWidth: 0.008, outlineColor: '#141826' })
  wheelTag.position.set(-0.12, 0.62, 0)
  wheelTag.rotation.y = -Math.PI / 2
  wheelG.add(wheelTag)
  const wheelHit = hit(0.5, 2.6, 1.0, 0, 1.45, 0, wheelG)
  solids.push(circle(WHEEL.x + 0.05, WHEEL.z, 0.35))
  // the screw's pipe along the floor, back to the mercury
  {
    const len = BACK - 1 - WHEEL.z
    mk(new THREE.CylinderGeometry(0.04, 0.04, len, 8), mats.brass, 2.95, 0.08, WHEEL.z + len / 2).rotation.x = Math.PI / 2
  }
  const gHint = () => {
    const h = E.glass.hints
    if (live.phase === 'solid') return h.solid
    if (live.phase === 'gas') return h.squeeze
    if (S2.glass === 'soda' && S2.P < 35) return h.hard
    if (!live.triedGlass) return h.glass
    return h.again
  }
  function glassStep(what, arg) {
    const lv = level()
    const says = E.glass.says
    live.mine = 16
    if (GLASSES.includes(what)) {
      const changed = S2.glass !== what
      S2.glass = what
      live.triedGlass = true
      if (changed) {
        stage.glass.sweep()
        play('select')
      } else play('tap')
      const ph = phaseOf(live.Tnow, S2.P)
      if (ph === 'liquid') tell(at(what === 'soda' && S2.P >= 35 ? says.pinkBlue : says[what], lv))
      else tell(at(ph === 'solid' ? says.frozen : says.noLiquid, lv))
    } else if (what === 'wheel') {
      // squeeze, squeeze hard, let go
      const next = S2.P < 15 ? 20 : S2.P < 35 ? 45 : 1
      return glassStep(next === 1 ? 'release' : next === 20 ? 'squeeze' : 'hard')
    } else if (what === 'squeeze' || what === 'hard' || what === 'release' || what === 'pressure') {
      const was = S2.P
      S2.P = what === 'squeeze' ? 20 : what === 'hard' ? 45 : what === 'release' ? 1 : clamp(Math.round(Number(arg)), 1, P_MAX)
      if (what !== 'pressure') play(S2.P > was ? 'join' : 'part')
      const ph = phaseOf(live.Tnow, S2.P)
      if (what === 'hard') tell(at(ph !== 'liquid' ? (ph === 'solid' ? says.frozen : says.noLiquid) : S2.glass === 'soda' ? says.pinkBlue : says.hardOther, lv))
      else if (what === 'squeeze') tell(at(ph === 'liquid' ? says.squeezed : ph === 'solid' ? says.frozen : says.noLiquid, lv))
      // letting go: the liquid's boiling away says it (phase change below), if it boils at all
    } else return
    refresh(E.glass.title, glassPanel)
    ex.discover('glass', glassPanel, 4.2)
    share('glass')
  }
  const glassPanel = lv => ({
    title: E.glass.title,
    color,
    blocks: [
      { slider: { label: E.glass.slider, min: 1, max: P_MAX, step: 1, value: S2.P, onInput: v => glassStep('pressure', v), format: v => `${Math.round(v)} atm`, live: () => S2.P } },
      { buttons: GLASSES.map(id => ({ label: `${S2.glass === id ? '✓ ' : ''}${E.glass.names[id]}`, onClick: () => glassStep(id) })) },
      { buttons: [{ label: E.glass.buttons.squeeze, onClick: () => glassStep('squeeze') }, { label: E.glass.buttons.hard, onClick: () => glassStep('hard') }, { label: E.glass.buttons.release, onClick: () => glassStep('release') }] },
      {
        rows: [
          [E.glass.rows.glass, E.glass.names[S2.glass]],
          [E.glass.rows.pressure, `${Math.round(S2.P)} atm`],
          ...(lv === 'scientist' ? [[E.glass.rows.vapour, live.Tnow < MELT ? `< ${num(500 / ATM, 2, lang)} atm` : `${num(vapour(live.Tnow) / ATM, vapour(live.Tnow) < ATM * 10 ? 2 : 1, lang)} atm`]] : []),
        ],
      },
      ...E.glass.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(wheelHit, () => glassStep('wheel'), { reach: 6.4 })
  const glassItem = ex.add({
    id: 'glass',
    x: 0.35,
    z: -6.2,
    radius: 1.9,
    manual: true,
    label: E.glass.label,
    verb: gHint,
    focus: { x: 1.3, y: 1.5, z: -10.6, size: 3.4, width: 4.6 },
    act: () => ctx.showPanel(glassPanel),
  })
  focusBy(glassItem, glassItem.focus, { x: 1.0, y: 1.7, z: -10.6, size: 3.4, width: 4.4 })

  // ================= station 3: the microbalance of 1910 =================
  // a granite pier, a glass case, the quartz beam on its knife edge
  const pierMat = M('#6d6a68', { roughness: 0.85 })
  mk(new THREE.BoxGeometry(1.2, BAL.top, 3.2), pierMat, BAL.x, BAL.top / 2, BAL.z)
  mk(new THREE.BoxGeometry(1.3, 0.05, 3.3), M('#55524f', { roughness: 0.7 }), BAL.x, BAL.top + 0.025, BAL.z)
  solids.push(box(BAL.x, BAL.z, 1.3, 3.3))
  const CASE = { w: 1.25, h: 1.8, d: 3.05 }
  const caseY = BAL.top + 0.05 + CASE.h / 2
  const caseGlass = mk(new THREE.BoxGeometry(CASE.w, CASE.h, CASE.d), glassMat('#e6f0f4', 0.1), BAL.x, caseY, BAL.z)
  caseGlass.renderOrder = 1
  {
    const wood = mats.wood
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(new THREE.BoxGeometry(0.05, CASE.h, 0.05), wood, BAL.x + (sx * CASE.w) / 2, caseY, BAL.z + (sz * CASE.d) / 2)
    for (const sy of [-1, 1]) {
      for (const sx of [-1, 1]) mk(new THREE.BoxGeometry(0.05, 0.05, CASE.d), wood, BAL.x + (sx * CASE.w) / 2, caseY + (sy * CASE.h) / 2, BAL.z)
      for (const sz of [-1, 1]) mk(new THREE.BoxGeometry(CASE.w, 0.05, 0.05), wood, BAL.x, caseY + (sy * CASE.h) / 2, BAL.z + (sz * CASE.d) / 2)
    }
  }
  // the knife edge on its column
  mk(new THREE.CylinderGeometry(0.05, 0.07, PIVOT.y - BAL.top - 0.12, 12), mats.brass, PIVOT.x, (PIVOT.y + BAL.top) / 2 - 0.04, PIVOT.z)
  mk(new THREE.ConeGeometry(0.07, 0.12, 3), mats.steel, PIVOT.x, PIVOT.y - 0.05, PIVOT.z).rotation.z = Math.PI
  const quartz = new THREE.MeshStandardMaterial({ color: '#eef4ff', roughness: 0.15, metalness: 0.1, emissive: '#7f9cc8', emissiveIntensity: 0.25 })
  const beam = new THREE.Group()
  beam.position.copy(PIVOT)
  root.add(beam)
  mk(new THREE.CylinderGeometry(0.025, 0.025, ARM * 2 + 0.1, 10), quartz, 0, 0, 0, beam).rotation.x = Math.PI / 2
  // a truss of thin quartz rods, as the real beam is a little frame
  for (const s of [-1, 1]) {
    const rod = mk(new THREE.CylinderGeometry(0.012, 0.012, ARM * 1.02, 8), quartz, 0, 0.11, s * ARM * 0.5, beam)
    rod.rotation.x = Math.PI / 2 + s * 0.18
  }
  mk(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8), quartz, 0, 0.1, 0, beam)
  // the sample end (-z): a fine wire and a cradle; the other end: the hollow quartz bulb and a counterweight
  mk(new THREE.CylinderGeometry(0.006, 0.006, 0.36, 6), quartz, 0, -0.18, -ARM, beam)
  const cradle = new THREE.Group()
  cradle.position.set(0, -0.38, -ARM)
  beam.add(cradle)
  mk(new THREE.BoxGeometry(0.14, 0.015, 0.46), quartz, 0, 0, 0, cradle)
  for (const s of [-1, 1]) mk(new THREE.BoxGeometry(0.015, 0.06, 0.46), quartz, s * 0.07, 0.03, 0, cradle)
  mk(new THREE.CylinderGeometry(0.006, 0.006, 0.26, 6), quartz, 0, -0.13, ARM, beam)
  const bulb = mk(new THREE.SphereGeometry(0.2, 24, 16), glassMat('#eef6ff', 0.3), 0, -0.45, ARM, beam)
  bulb.renderOrder = 2
  mk(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), mats.brass, 0, 0.04, ARM * 0.82, beam)
  // the pointer at the bulb's end and the scale it reads against (watched with a small microscope)
  mk(new THREE.CylinderGeometry(0.006, 0.003, 0.22, 6), quartz, 0, 0, ARM + 0.13, beam).rotation.x = Math.PI / 2
  const scale = new THREE.Group()
  scale.position.set(PIVOT.x, PIVOT.y, PIVOT.z + ARM + 0.3)
  root.add(scale)
  mk(new THREE.BoxGeometry(0.2, 0.42, 0.02), mats.navy, 0, 0, 0, scale)
  for (let i = -4; i <= 4; i++) mk(new THREE.BoxGeometry(i === 0 ? 0.16 : 0.08, 0.008, 0.01), M(i === 0 ? '#7dff9a' : '#c8d2ec', { emissive: i === 0 ? '#7dff9a' : '#c8d2ec', emissiveIntensity: i === 0 ? 0.9 : 0.25 }), 0.08 - (i === 0 ? 0.08 : 0.04) + 0.0, i * 0.045, -0.015, scale)
  const scope = mk(new THREE.CylinderGeometry(0.05, 0.06, 0.5, 14), mats.brass, PIVOT.x + 0.45, PIVOT.y + 0.12, PIVOT.z + ARM + 0.3)
  scope.rotation.z = Math.PI / 2 - 0.25
  const levelLamp = mk(new THREE.SphereGeometry(0.045, 12, 8), M('#2a3a2c', { emissive: '#7dff9a', emissiveIntensity: 0 }), 0, 0.27, 0, scale)
  tag(E.weigh.tags.year, BAL.x + 0.66, BAL.top - 0.2, BAL.z, Math.PI / 2, 0.16, '#ffd27a')
  const beamHit = hit(CASE.w, CASE.h, CASE.d, BAL.x, caseY, BAL.z)

  // the rack of tubes: five sealed capillaries of radon (faintly glowing) and one of air
  const rackG = new THREE.Group()
  rackG.position.set(RACK.x, 0, RACK.z)
  root.add(rackG)
  mk(new THREE.BoxGeometry(0.3, 0.12, 1.45), mats.wood, 0, RACK.y - 0.06, 0, rackG)
  mk(new THREE.CylinderGeometry(0.04, 0.05, RACK.y - 0.12, 10), mats.dark, 0, (RACK.y - 0.12) / 2, 0, rackG)
  mk(new THREE.CylinderGeometry(0.25, 0.3, 0.05, 16), mats.dark, 0, 0.025, 0, rackG)
  solids.push(circle(RACK.x, RACK.z, 0.3))
  const slotZ = i => RACK.z + 0.6 - i * 0.24
  const tubeGeo = new THREE.CapsuleGeometry(0.05, 0.34, 6, 14)
  const tubes = SAMPLES.map((smp, i) => {
    const g = new THREE.Group()
    root.add(g)
    const radon = smp.id !== 'air'
    const glassT = mk(tubeGeo, glassMat(radon ? '#e8e0ff' : '#eaf4ff', 0.4), 0, 0, 0, g)
    glassT.renderOrder = 2
    if (radon) {
      const core = mk(new THREE.CylinderGeometry(0.022, 0.022, 0.3, 8), new THREE.MeshBasicMaterial({ color: '#b9a4ff', transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }), 0, 0, 0, g)
      core.renderOrder = 3
      const s = sprite('#9a8cff', 0.35, 0.35)
      g.add(s)
    }
    // the air tube is the last: its word runs on past the rack's end, so a long one (powietrze) crowds nothing
    const label = radon
      ? tag(smp.id, RACK.x + 0.17, RACK.y - 0.06, slotZ(i), Math.PI / 2, 0.085, '#e8e0ff')
      : tag(E.weigh.tags.air, RACK.x + 0.17, RACK.y - 0.06, slotZ(i) + 0.09, Math.PI / 2, 0.075, '#cfe6ff', { anchorX: 'left' })
    const h = hit(0.22, 0.6, 0.2, RACK.x, RACK.y + 0.22, slotZ(i))
    clickable(h, () => weighStep(i), { reach: 5.2 })
    return { g, smp, k: 0, h, label }
  })
  // the board above the case: the masses, the reading, and what the weighing settled
  const boardScreen = screen({ width: 2.7, height: 1.25, color, title: '', line: '' })
  boardScreen.group.position.set(BAL.x - 0.15, 3.78, BAL.z)
  boardScreen.group.rotation.y = Math.PI / 2
  root.add(boardScreen.group)
  const boardTex = canvasTex(1024, 472, null)
  disposers.push(boardTex)
  const boardFace = new THREE.Mesh(new THREE.PlaneGeometry(2.62, 1.2), new THREE.MeshBasicMaterial({ map: boardTex, transparent: true, toneMapped: false }))
  boardScreen.content.add(boardFace)
  let boardKey = ''

  const S3 = { on: -1, read: 0, got: [0, 0, 0, 0, 0, 0] }
  const live3 = { readNow: 0, tilt: 0, mine: false, allSaid: false, saidLevel: -1 }
  const balanced = () => S3.on >= 0 && Math.abs(SAMPLES[S3.on].m - live3.readNow) <= Math.max(5, SAMPLES[S3.on].m * 0.012)
  const wHint = () => {
    const h = E.weigh.hints
    if (S3.on < 0) return S3.got.slice(0, 5).every(Boolean) ? (S3.got[5] ? h.done : h.air) : h.pick
    if (!S3.got[S3.on]) return h.level
    if (S3.got.slice(0, 5).every(Boolean) && !S3.got[5]) return h.air
    return S3.got.every(Boolean) ? h.done : h.next
  }
  function weighStep(what, arg) {
    const lv = level()
    const says = E.weigh.says
    live3.mine = true
    if (Number.isInteger(what) && what >= 0 && what < SAMPLES.length) {
      if (S3.on === what) {
        S3.on = -1
        play('part')
        tell(at(says.off, lv))
      } else {
        S3.on = what
        live3.saidLevel = -1
        play('select')
        const smp = SAMPLES[what]
        tell(fill(at(smp.id === 'air' ? says.hangAir : says.hang, lv), { id: smp.id }))
      }
    } else if (what === 'beam') {
      if (S3.on < 0) {
        tell(at(says.pickFirst, lv))
        return
      }
      S3.read = SAMPLES[S3.on].m
      live3.auto = true
      play('tap')
    } else if (what === 'off') {
      if (S3.on >= 0) play('part')
      S3.on = -1
    } else if (what === 'read') {
      S3.read = clamp(Math.round(Number(arg)), 0, READ_MAX)
      live3.auto = false
    } else return
    refresh(E.weigh.title, weighPanel)
    if (S3.on >= 0 || what === 'read') ex.discover('weigh', weighPanel, 4.2)
    share('weigh')
  }
  // the unit in the language's plural form for n (Polish: 722 few, 577 many)
  const plural = new Intl.PluralRules(lang)
  const unitFor = (n, lv) => {
    const forms = E.weigh.unit[depthOf(lv)]
    return forms[plural.select(Math.round(n))] ?? forms.other
  }
  const weighPanel = lv => ({
    title: E.weigh.title,
    color,
    blocks: [
      { slider: { label: E.weigh.slider, min: 0, max: READ_MAX, step: 1, value: S3.read, onInput: v => weighStep('read', v), format: v => `${Math.round(v)} ${unitFor(v, lv)}`, live: () => Math.round(live3.readNow) } },
      { buttons: SAMPLES.map((s, i) => ({ label: `${S3.on === i ? '✓ ' : ''}${s.id === 'air' ? E.weigh.tags.air : s.id}`, onClick: () => weighStep(i) })) },
      { buttons: [{ label: E.weigh.buttons.auto, onClick: () => weighStep('beam') }, { label: E.weigh.buttons.off, onClick: () => weighStep('off') }] },
      { rows: SAMPLES.map((s, i) => [s.id === 'air' ? E.weigh.tags.air : s.id, S3.got[i] ? `${s.m} ${unitFor(s.m, lv)}` : '?']) },
      ...E.weigh.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(beamHit, () => weighStep('beam'), { reach: 5.2 })
  const weighItem = ex.add({
    id: 'weigh',
    x: 0.95,
    z: -1.9,
    radius: 2.0,
    manual: true,
    label: E.weigh.label,
    verb: wHint,
    focus: { x: -2.0, y: 2.55, z: -2.1, size: 4.4, width: 4.0 },
    act: () => ctx.showPanel(weighPanel),
  })
  focusBy(weighItem, weighItem.focus, { x: -2.0, y: 2.5, z: -2.0, size: 4.2, width: 3.6 })

  function drawBoard(lv) {
    const B = E.weigh.board
    const on = S3.on
    const key = [lv, on, Math.round(live3.readNow), S3.got.join('')].join('|')
    if (key === boardKey) return
    boardKey = key
    boardTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.fillStyle = '#ffd27a'
      g.font = '700 50px Outfit, sans-serif'
      g.textAlign = 'left'
      g.fillText(B.title, 40, 46)
      // the tubes: a column each, the mass under it once weighed
      const x0 = 50
      const cw = (w - 100) / SAMPLES.length
      SAMPLES.forEach((s, i) => {
        const cx = x0 + cw * (i + 0.5)
        const sel = i === on
        g.fillStyle = sel ? 'rgba(255,210,122,0.18)' : 'rgba(120,140,220,0.1)'
        g.fillRect(cx - cw / 2 + 6, 86, cw - 12, 150)
        g.textAlign = 'center'
        g.fillStyle = s.id === 'air' ? '#cfe6ff' : '#e0d6ff'
        g.font = '700 40px Outfit, sans-serif'
        g.fillText(s.id === 'air' ? E.weigh.tags.air : s.id, cx, 124)
        g.fillStyle = S3.got[i] ? '#ffffff' : '#6c78a8'
        g.font = '700 50px Outfit, sans-serif'
        g.fillText(S3.got[i] ? String(s.m) : '?', cx, 190)
      })
      g.textAlign = 'left'
      g.fillStyle = '#aab6e0'
      g.font = '700 30px Nunito, sans-serif'
      g.fillText(B.mass, 50, 262)
      // the reading now
      g.textAlign = 'right'
      g.fillStyle = balanced() ? '#7dff9a' : '#ffffff'
      g.font = '700 34px Outfit, sans-serif'
      g.fillText(`${B.reading}: ${Math.round(live3.readNow)}`, w - 50, 262)
      // what the weighing settled
      g.textAlign = 'left'
      g.font = '700 36px Outfit, sans-serif'
      const anyRadon = S3.got.slice(0, 5).some(Boolean)
      g.fillStyle = '#9aa6c8'
      g.fillText(B.guess, 50, 330)
      g.fillStyle = anyRadon ? '#ffffff' : '#4c5680'
      g.fillText(B.found, 50, 380)
      g.fillStyle = anyRadon ? '#7dff9a' : '#4c5680'
      g.fillText(B.today, 50, 430)
      if (S3.got[5] && S3.got[0]) {
        g.textAlign = 'right'
        g.fillStyle = '#cfe6ff'
        g.font = '700 32px Outfit, sans-serif'
        g.fillText(fill(B.times, { n: num(SAMPLES[0].m / SAMPLES[5].m, 1, lang) }), w - 50, 430)
      }
    })
  }

  // ================= the frame back, the easel, the leaving line =================
  let leaveSaid = false
  let roomTime = 0

  // ================= every frame =================
  const tmpC = new THREE.Color()
  const tmpC2 = new THREE.Color()
  const tmpV = new THREE.Vector3()
  const homeV = new THREE.Vector3()
  let lastRead = ''
  const tmpM = new THREE.Matrix4()
  updates.push((dt, t) => {
    clock += dt
    roomTime += dt
    if (pending && clock - toldAt >= 3.2) {
      say(pending)
      toldAt = clock
      pending = null
    }
    live.mine = Math.max(0, live.mine - dt)
    // the bath's temperature follows the target, no faster than a cold bath would
    const dT = S1.T - live.Tnow
    live.Tnow += clamp(dT * 1.2 * dt, -16 * dt, 16 * dt)
    if (Math.abs(S1.T - live.Tnow) < 0.05) live.Tnow = S1.T
    live.Pnow = damp(live.Pnow, S2.P, 2.4, dt)
    const T = live.Tnow
    const ph = phaseOf(T, live.Pnow)
    const lv = level()
    const sayIf = entry => live.mine > 0 && tell(at(entry, lv))
    if (ph !== live.phase) {
      const was = live.phase
      live.phase = ph
      if (ph === 'liquid' && was === 'gas') {
        // squeezed into a liquid: the squeeze's own line has said it
        if (T <= -60) sayIf(E.cold.says.condense)
        play('join')
      } else if (ph === 'solid') {
        sayIf(E.cold.says.freeze)
        play('crack')
        live.band = 'blue'
      } else if (ph === 'liquid' && was === 'solid') sayIf(E.cold.says.melt)
      else if (ph === 'gas') {
        sayIf(live.Pnow > 1.5 && was === 'liquid' && T > -62 ? E.glass.says.release : E.cold.says.boil)
        play('part')
      }
      refresh(E.cold.title, coldPanel)
      refresh(E.glass.title, glassPanel)
    }
    if (ph === 'solid') {
      const band = bandOf(T)
      if (band !== live.band) {
        const was = live.band
        live.band = band
        if (band === 'yellow' && was === 'blue') sayIf(E.cold.says.yellow)
        else if (band === 'red') sayIf(E.cold.says.red)
        else if (band === 'yellow' && was === 'red') sayIf(E.cold.says.redGone)
        else if (band === 'blue') sayIf(E.cold.says.blue)
      }
    }
    // the radon gathers into the tip as it condenses, and comes back out as it evaporates
    const condensed = ph !== 'gas' ? 1 : 0
    live.G = clamp(live.G + (condensed ? dt * 0.55 : -dt * 0.45))
    live.liquidK = damp(live.liquidK, ph === 'liquid' ? clamp(live.G * 1.6) : 0, 3, dt)
    live.solidK = damp(live.solidK, ph === 'solid' ? clamp(live.G * 1.6) : 0, 2.6, dt)
    live.hardK = damp(live.hardK, ph === 'liquid' && S2.glass === 'soda' && live.Pnow >= 35 ? 1 : 0, 2, dt)
    // the glass's colour, the solid's colour
    live.glassCol.lerp(tmpC.set(GLASS[S2.glass].glow), Math.min(1, dt * 3))
    solidColour(T, live.solidCol)
    const sk = live.solidK
    const lk = live.liquidK
    const G = live.G
    const glow = tmpC.copy(live.glassCol).lerp(live.solidCol, sk * 0.65)
    const hard = live.hardK
    stage.glass.setGlow({
      a: glow,
      b: tmpC2.set(PINK),
      mix: hard,
      k: 0.1 * (1 - G) + lk * (1.25 + hard * 0.35 + Math.min(0.2, (live.Pnow - 1) / 200)) + sk * 0.35 + (1 - lk - sk) * G * 0.12,
      z: BACK + 6 - (BACK + 6 - (MEN_Z + 0.2)) * ease(G),
      fall: 0.015 + 0.3 * ease(G),
    })
    // the plug: clear liquid, or an opaque glowing solid
    plugMat.opacity = lk * 0.07 + sk * 0.8
    plugMat.emissive.copy(live.solidCol).multiplyScalar(sk * 0.45).add(tmpC2.copy(live.glassCol).multiplyScalar(lk * 0.18))
    plugMat.color.set('#dff0ff').lerp(tmpC2.copy(live.solidCol).multiplyScalar(0.6), sk)
    menMat.opacity = lk * 0.4
    rimMat.opacity = lk * 0.9
    rimMat.color.copy(live.glassCol).lerp(tmpC2.set('#ffffff'), 0.5)
    plug.visible = lk + sk > 0.01
    const shK = ease(sk)
    if (Math.abs(shK - lastShardK) > 0.002) {
      lastShardK = shK
      for (let i = 0; i < NS; i++) {
        shardScale.matrix.copy(shardPose[i])
        if (shK < 0.999) shardScale.matrix.multiply(tmpM.makeScale(shK, shK, shK))
        shards.setMatrixAt(i, shardScale.matrix)
      }
      shards.instanceMatrix.needsUpdate = true
      shards.visible = shK > 0.01
    }
    shardMat.color.copy(live.solidCol)
    shardMat.emissive.copy(live.solidCol)
    shardMat.emissiveIntensity = 0.75 + 0.12 * Math.sin(t * 2.1)
    heartGlow.material.color.copy(live.solidCol)
    heartGlow.material.opacity = sk * (0.5 + 0.06 * Math.sin(t * 3.1)) + lk * 0.12
    if (lk > sk) heartGlow.material.color.copy(live.glassCol)
    plugLight.color.copy(sk > lk ? live.solidCol : live.glassCol)
    plugLight.intensity = 0.5 + lk * 2.0 + sk * 6
    // the motes
    for (let i = 0; i < NM; i++) {
      const m = moteSeed[i]
      const gk = ease(clamp((G - m.lag) / 0.45))
      homeV.copy(m.home)
      homeV.x += Math.sin(t * m.sp + m.ph) * 0.45
      homeV.y += Math.sin(t * m.sp * 0.8 + m.ph * 1.3) * 0.3
      homeV.z += Math.cos(t * m.sp * 0.7 + m.ph) * 0.5
      mPos.lerpVectors(homeV, m.to, gk)
      const sc = gk > 0.82 ? 1 - ((gk - 0.82) / 0.18) * (0.35 + 0.65 * live.solidK) : 1
      if (gk > 0.95) mPos.x += Math.sin(t * 7 + m.ph * 3) * 0.03 * (1 - live.solidK)
      mDummy.position.copy(mPos)
      mDummy.scale.setScalar(Math.max(0.0001, sc))
      mDummy.updateMatrix()
      motes.setMatrixAt(i, mDummy.matrix)
      haloPos[i * 3] = mPos.x
      haloPos[i * 3 + 1] = sc < 0.05 ? -99 : mPos.y
      haloPos[i * 3 + 2] = mPos.z
    }
    motes.instanceMatrix.needsUpdate = true
    haloGeo.attributes.position.needsUpdate = true
    // sparks: from the gas's atoms, from the glass round the liquid, from the solid's face
    sparkClock -= dt
    if (sparkClock <= 0) {
      sparkClock = 0.18 + Math.random() * 0.3
      if (G < 0.5) {
        const m = moteSeed[(Math.random() * NM) | 0]
        mTmp.copy(m.home)
        fireSpark(mTmp, 0.5)
      } else {
        const a = Math.random() * TAU
        const s = S_PLUG + Math.random() * 1.8
        const r = (stage.radiusAt(TIP - s) - (lk > sk ? 0.05 : 0.8)) * (lk > sk ? 1 : Math.sqrt(Math.random()))
        tmpV.set(Math.cos(a) * r, AY + Math.sin(a) * r, TIP - s)
        if (lk <= sk) tmpV.z = MEN_Z + 0.05
        fireSpark(tmpV, 0.45)
      }
    }
    for (const sp of sparks) {
      sp.age += dt
      const k = sp.age / 0.3
      if (k >= 1) {
        sp.s.material.opacity = 0
        continue
      }
      sp.s.position.copy(sp.from).addScaledVector(sp.dir, ease(k))
      sp.s.material.opacity = (1 - k) * 0.9
      sp.s.scale.setScalar(0.12 + 0.1 * (1 - k))
    }
    // the bath: filled for any cold, liquid air at the coldest, boiling, frost above it
    live.fill = damp(live.fill, S1.T < 12 ? 1 : 0, live.pour > 0 ? 1.4 : 0.8, dt)
    live.air = damp(live.air, S1.T <= -170 ? 1 : 0, 1.2, dt)
    live.pour = Math.max(0, live.pour - dt)
    stage.bath.set({ fill: live.fill, air: live.air, boil: live.air * smoothK(-150, -185, T), frost: live.fill * smoothK(0, -120, T) })
    streamMat.opacity = live.pour > 0 ? Math.min(1, live.pour) * 0.6 : 0
    stream.scale.x = stream.scale.z = 0.8 + Math.sin(t * 30) * 0.2
    valveWheel.rotation.y = damp(valveWheel.rotation.y, S1.T <= -170 ? Math.PI * 1.5 : 0, 4, dt)
    // the thermometer
    setColumn(T)
    const rd = `${minus(T)} °C`
    if (rd !== lastRead) {
      lastRead = rd
      setText(readout, rd)
    }
    for (const mkr of markLights) {
      const passed = (mkr.t === -62 || mkr.t === -71 || mkr.t === -118) ? T <= mkr.t + 0.5 : mkr.t === -190 ? T <= -185 : T >= 15
      mkr.lit.emissiveIntensity = damp(mkr.lit.emissiveIntensity, passed ? 1.4 : 0.15, 5, dt)
    }
    // the mercury presses forward as the pressure rises; the wheel turns; the dial reads
    stage.mercury.setPush(clamp((live.Pnow - 1) / P_MAX) * 0.45)
    handwheel.rotation.x = live.Pnow * 0.12
    needleP.rotation.z = angleOf(live.Pnow)
    const vp = T < MELT ? 0.5 : vapour(T) / ATM
    needleV.rotation.z = angleOf(Math.min(P_MAX + 1, vp))
    needleV.visible = lv === 'scientist' && T >= MELT
    const pt = `${Math.round(live.Pnow)} atm`
    if (pTx.text !== pt) setText(pTx, pt)
    for (const p of plaques) {
      p.k = damp(p.k, p.id === S2.glass ? 1 : 0, 5, dt)
      const lit = p.k * (0.35 + 0.65 * Math.max(lk, 0.25))
      p.rimM.emissiveIntensity = 0.3 + lit * 1.5
      if (p.id === 'soda') {
        p.rimM.emissive.set(GLASS.soda.glow).lerp(tmpC2.set(Math.sin(t * 2.4) > 0 ? '#5a7cff' : PINK), live.hardK * 0.85)
        p.halo.material.color.copy(p.rimM.emissive)
      }
      p.halo.material.opacity = lit * 0.45
    }
    // the balance: the reading follows the slider (slowly when levelled by a tap), the beam tips
    live3.readNow = damp(live3.readNow, S3.read, live3.auto ? 2.2 : 9, dt)
    if (Math.abs(live3.readNow - S3.read) < 0.4) live3.readNow = S3.read
    const mass = S3.on >= 0 ? SAMPLES[S3.on].m : 0
    const want = -clamp((mass - live3.readNow) / 180, -1, 1) * 0.16
    live3.tilt = damp(live3.tilt, want, 3.2, dt)
    beam.rotation.x = live3.tilt + Math.sin(t * 1.7) * 0.004 * Math.abs(want) * 6
    levelLamp.material.emissiveIntensity = damp(levelLamp.material.emissiveIntensity, balanced() ? 1.6 : 0, 6, dt)
    if (balanced() && live3.saidLevel !== S3.on && Math.abs(live3.tilt) < 0.02) {
      live3.saidLevel = S3.on
      const smp = SAMPLES[S3.on]
      const first = !S3.got[S3.on]
      S3.got[S3.on] = 1
      if (live3.mine) {
        play('discover')
        tell(fill(at(smp.id === 'air' ? E.weigh.says.levelAir : E.weigh.says.level, lv), { m: smp.m, u: unitFor(smp.m, lv), v: num(smp.v, 1, lang), n: num(SAMPLES[0].m / SAMPLES[5].m, 1, lang) }))
        if (first) share('weigh')
        if (S3.got.slice(0, 5).every(Boolean) && !live3.allSaid && smp.id !== 'air') {
          live3.allSaid = true
          tell(at(E.weigh.says.all, lv))
        }
      }
      refresh(E.weigh.title, weighPanel)
    }
    // the tubes: from the rack to the cradle and back
    const cradleW = cradle.getWorldPosition(tmpV)
    tubes.forEach((tb, i) => {
      tb.k = clamp(tb.k + (S3.on === i ? dt : -dt) / 0.9)
      const k = ease(tb.k)
      const rx = RACK.x
      const ry = RACK.y + 0.25
      const rz = slotZ(i)
      tb.g.position.set(rx + (cradleW.x - rx) * k, ry + (cradleW.y + 0.07 - ry) * k + Math.sin(Math.PI * k) * 0.5, rz + (cradleW.z - rz) * k)
      tb.g.rotation.set((Math.PI / 2) * k + beam.rotation.x * k, 0, 0)
    })
    drawBoard(lv)
    // the Atomling's last word, once, when the visitor heads back to the frame after doing something
    const p = ctx.engine.player
    if (!leaveSaid && p?.pos && roomTime > 20 && p.pos.z > 2.2 && Math.cos(p.yaw - Math.PI) > 0.6 && (coldItem.found || glassItem.found || weighItem.found)) {
      leaveSaid = true
      tell(at(E.leave, lv))
    }
    stage.update(t, dt)
  })

  /** A state as it stands, without replaying it (a newcomer, a saved state coming back). */
  const snap = () => {
    live.Tnow = S1.T
    live.Pnow = S2.P
    live.phase = phaseOf(live.Tnow, live.Pnow)
    live.band = bandOf(live.Tnow)
    live.G = live.phase !== 'gas' ? 1 : 0
    live.liquidK = live.phase === 'liquid' ? 1 : 0
    live.solidK = live.phase === 'solid' ? 1 : 0
    live.fill = S1.T < 12 ? 1 : 0
    live.air = S1.T <= -170 ? 1 : 0
    live.glassCol.set(GLASS[S2.glass].glow)
    lastShardK = -1
  }

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.2 },
    cameraClear: stage.cameraClear,
    spawn: { x: 0, z: 2.0, yaw: 0 },
    hostSpot: { x: -1.2, z: 0.6, yaw: Math.atan2(-1.2, -1.4) },
    back: { x: 0, z: 6.1, rot: Math.PI },
    stand: { x: 2.1, z: 0.5, rot: Math.atan2(-2.1, 1.5) },
    parts: {
      cold: {
        tap: (what, arg) => coldStep(what, arg), // 'thermo' (°C), 'tap', 'radon', 'temp' (°C), 'liquid', 'freeze', 'air', 'warm'
        get state() {
          return { T: S1.T, Tnow: live.Tnow, phase: live.phase, band: live.band }
        },
        at: (what, arg) => ({ thermo: new THREE.Vector3(THERMO.x, yOfT(arg ?? -66), THERMO.z), tap: new THREE.Vector3(FLASK.x, FLASK.y, FLASK.z), radon: new THREE.Vector3(0, AY, MEN_Z - 0.3) })[what],
      },
      glass: {
        tap: (what, arg) => glassStep(what, arg), // 'silica', 'lead', 'soda', 'wheel', 'squeeze', 'hard', 'release', 'pressure' (atm)
        get state() {
          return { glass: S2.glass, P: S2.P, Pnow: live.Pnow, phase: live.phase }
        },
        at: what => (GLASSES.includes(what) ? new THREE.Vector3(plaqueX(GLASSES.indexOf(what)), PLAQUE_Y, PLAQUE_Z) : new THREE.Vector3(WHEEL.x, WHEEL.y, WHEEL.z)),
      },
      weigh: {
        tap: (what, arg) => weighStep(typeof what === 'string' && SAMPLES.some(s => s.id === what) ? SAMPLES.findIndex(s => s.id === what) : what, arg), // 0..5 or 'I'..'V', 'air'; 'beam', 'off', 'read' (value)
        get state() {
          return { ...S3, got: [...S3.got], readNow: live3.readNow, tilt: live3.tilt }
        },
        at: what => (what === 'beam' ? new THREE.Vector3(BAL.x, caseY, BAL.z) : new THREE.Vector3(RACK.x, RACK.y + 0.22, slotZ(typeof what === 'number' ? what : SAMPLES.findIndex(s => s.id === what)))),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { cold: coldPanel, glass: glassPanel, weigh: weighPanel },
    shared: {
      cold: {
        get: () => ({ T: S1.T }),
        set: (s, liveSet) => {
          S1.T = clamp(Math.round(Number(s?.T ?? 20)), -190, 20)
          if (liveSet) live.mine = 0
          else snap()
        },
      },
      glass: {
        get: () => ({ g: GLASSES.indexOf(S2.glass), P: S2.P }),
        set: (s, liveSet) => {
          const g = GLASSES[Number(s?.g)] ?? 'soda'
          if (liveSet && g !== S2.glass) stage.glass.sweep()
          S2.glass = g
          S2.P = clamp(Math.round(Number(s?.P ?? 1)), 1, P_MAX)
          if (liveSet) live.mine = 0
          else snap()
        },
      },
      weigh: {
        get: () => ({ on: S3.on, read: Math.round(S3.read), got: [...S3.got] }),
        set: (s, liveSet) => {
          const on = Number(s?.on)
          S3.on = Number.isInteger(on) && on >= 0 && on < SAMPLES.length ? on : -1
          S3.read = clamp(Math.round(Number(s?.read) || 0), 0, READ_MAX)
          S3.got = SAMPLES.map((_, i) => (s?.got?.[i] ? 1 : 0))
          live3.mine = false
          live3.auto = false
          live3.saidLevel = liveSet ? -1 : S3.on
          if (!liveSet) {
            live3.readNow = S3.read
            const mass = S3.on >= 0 ? SAMPLES[S3.on].m : 0
            live3.tilt = -clamp((mass - S3.read) / 180, -1, 1) * 0.16
            tubes.forEach((tb, i) => (tb.k = S3.on === i ? 1 : 0))
          }
          live3.allSaid = S3.got.slice(0, 5).every(Boolean)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of disposers.splice(0)) tx.dispose()
    },
  }
}
