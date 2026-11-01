// Krypton's picture "What pushes a satellite along?" as a room (docs/knowledge/picture-rooms.md): the picture
// made into a docking platform 550 km above the real Earth (stages/orbit.js: the planet under your feet, a
// sunrise every 95 minutes sped up, satellites crossing the sky as moving stars). Three stations, each step
// chosen by tapping its thing (the user, 2026-10-30), the prompt naming the next tap; E opens the station's
// panel, whose buttons (and sliders) do the same:
// - the engine: a Hall thruster cut in half, its ring 3 m across. Tap the gas valve (krypton atoms drift up
//   the channel), tap the magnets (field lines across the channel; electrons caught, whirling round it),
//   raise the voltage in the panel (atoms that meet the electrons lose one and become ions, which race out;
//   the plume brightens; a readout gives the ion speed, the push and the satellite's charge), tap the
//   cathode to switch it off (charge builds, the ions are pulled back, the plume stalls) and on again;
// - the satellite, at true size (a flat body about 3 m, one wing about 8 m): tap its thruster (a push as
//   light as a coin on a scale), tap the space junk (it fires and steps aside), tap the red button (it
//   lowers itself and burns up like a shooting star; a new one takes its place); a slider of days since
//   launch lifts its orbit on a small globe (heights exaggerated);
// - the propellants: three bottles (xenon, krypton, argon) on a rack, tap one and the engine's gas changes
//   (colour, speed, push) and a board compares them (air, price, atomic mass, ionisation, ion speed, push).
// The engine, the satellite's moves and the gas are shared in a room (src/net/shared.js). parts.<station>.tap
// does what a tap does, for the probes. The numbers and where they come from: thruster.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, fill, num } from '../../../wings/noble/kit.js'
import { orbitStage } from '../../stages/orbit.js'
import { glowTexture } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { element, nameOf } from '../../../../data/elements.js'
import { THRUSTER_WORDS } from './thruster.words.js'

export const WORDS = THRUSTER_WORDS

const TAU = Math.PI * 2
const smooth = (a, b, v) => ease(clamp((v - a) / (b - a)))

// ---- the three gases: masses, ionisation energies and prices from the data, shares of air from the words ----
const GAS = {}
for (const [sym, ppm, tint, plume] of [['Xe', 0.087, '#98a6ff', '#5f9bff'], ['Kr', 1.14, '#7fc6ff', '#7a6dff'], ['Ar', 9340, '#d7a6ff', '#c07dff']]) {
  const el = element(sym)
  GAS[sym] = { sym, el, m: el.mass, ie: el.ie[0], price: el.pricePerKg, ppm, tint, plume }
}
const ORDER = ['Xe', 'Kr', 'Ar']
/** The ideal speed of a singly charged ion that has fallen through `volts` (km/s): sqrt(2 e V / m). */
const ionSpeed = (volts, gas) => Math.sqrt((2 * 1.602176634e-19 * volts) / (GAS[gas].m * 1.66053907e-27)) / 1000
/** Thrust for the same electric power, krypton = 1 (F = 2 eta P / v, the same efficiency). */
const pushRel = gas => ionSpeed(300, 'Kr') / ionSpeed(300, gas)
const KR_PUSH = 70 // mN: the Starlink krypton thruster, worked out from SpaceX's 2023 figures (words)
const SAT_KG = 260
const COIN_G = (mN) => (mN / 1000 / 9.80665) * 1000 // the push as the weight of this many grams
const LOW = 300
const HIGH = 550
const DAYS = 90
const heightAt = d => LOW + ((HIGH - LOW) * d) / DAYS
const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')

// ---- small helpers ----
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1, ...o })
const hitShape = (geo, parent, x, y, z) => {
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }))
  m.position.set(x, y, z)
  parent.add(m)
  return m
}
const label = (text, size = 0.14, extra = {}) => makeText(text, { size, color: '#ffffff', outlineWidth: size * 0.07, outlineColor: '#050816', ...extra })
const placed = (m, x, y, z) => {
  m.position.set(x, y, z)
  return m
}
const _q = new THREE.Quaternion()
/** Turn a sign (inside a turned group) to face the camera. */
function faceCamera(obj, camera) {
  obj.quaternion.copy(camera.quaternion)
  if (obj.parent) obj.quaternion.premultiply(obj.parent.getWorldQuaternion(_q).invert())
}
function setText(t, text) {
  if (t.text === text) return
  t.text = text
  t.sync()
}
/** A cone or tube of soft light (additive), `uK` its strength, brightest at its start (v = 0). */
function plumeMesh({ r0, r1, len, color, power = 1.5 }) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uK: { value: 0 }, uColor: { value: new THREE.Color(color) }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; varying vec3 vNm; varying vec3 vVw;
      void main() {
        vUv = uv;
        vNm = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vVw = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uK; uniform vec3 uColor; uniform float uTime; varying vec2 vUv; varying vec3 vNm; varying vec3 vVw;
      void main() {
        float t = vUv.y;
        float fade = pow(clamp(1.0 - t, 0.0, 1.0), ${power.toFixed(2)}) * smoothstep(0.0, 0.04, t);
        float ripple = 0.8 + 0.2 * sin(vUv.x * 40.0 + uTime * 6.0 - t * 18.0);
        float soft = pow(clamp(abs(dot(normalize(vNm), normalize(vVw))), 0.0, 1.0), 1.4);
        gl_FragColor = vec4(uColor, uK * fade * ripple * soft * 0.5);
      }`,
  })
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, len, 40, 1, true), mat)
  mesh.userData.mat = mat
  return mesh
}
const dotTexture = (kind) =>
  canvasTex(64, 64, (g, w) => {
    const c = w / 2
    if (kind === 'ion') {
      const grd = g.createRadialGradient(c * 0.8, c * 0.8, 2, c, c, c * 0.95)
      grd.addColorStop(0, '#ffffff')
      grd.addColorStop(0.35, '#7fd4ff')
      grd.addColorStop(1, '#2a7bff')
      g.fillStyle = grd
      g.beginPath()
      g.arc(c, c, c * 0.92, 0, TAU)
      g.fill()
      g.strokeStyle = '#06235a'
      g.lineWidth = 6
      g.lineCap = 'round'
      g.beginPath()
      g.moveTo(c - 14, c)
      g.lineTo(c + 14, c)
      g.moveTo(c, c - 14)
      g.lineTo(c, c + 14)
      g.stroke()
    } else if (kind === 'electron') {
      const grd = g.createRadialGradient(c, c, 0, c, c, c)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.3, 'rgba(120,255,240,0.95)')
      grd.addColorStop(1, 'rgba(60,220,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    } else {
      const grd = g.createRadialGradient(c * 0.75, c * 0.75, 2, c, c, c * 0.95)
      grd.addColorStop(0, '#ffffff')
      grd.addColorStop(0.5, '#cfd6e6')
      grd.addColorStop(1, '#7c86a0')
      g.fillStyle = grd
      g.beginPath()
      g.arc(c, c, c * 0.92, 0, TAU)
      g.fill()
    }
  })

export async function build({ ctx, root, E, ex, say, later, light, level, clickable, lang }) {
  const stage = orbitStage({ radius: 9.5, light, pixelRatio: Math.min(2, window.devicePixelRatio || 1) })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const sent = {}
  const throttled = id => {
    if (sent[id]) return
    sent[id] = setTimeout(() => {
      sent[id] = null
      share(id)
    }, 250)
  }
  const fmt = (v, d = 1) => num(v, d, lang)

  // ==== where things stand (metres; the spawn at z = 6.2 looks along -z, into the picture) ====
  const T = { x: -3.9, z: -1.8, base: 0.3 } // the engine
  const RACK = { x: 3.1, z: 0.8 }
  const SAT0 = new THREE.Vector3(1.2, 2.6, -5.4)
  const GLOBE = { x: 3.5, z: -3.5 }
  const SCALE = { x: -0.1, z: -3.4 }
  const BUTTON = { x: 2.3, z: -2.6 }

  // =========================================================================================================
  // 1. THE ENGINE: a Hall thruster cut in half
  // =========================================================================================================
  const S = { valve: 0, magnet: 0, cathode: 1, volts: 0, gas: 'Kr' }
  let plasmaK = 0 // ionisation, eased (0..1)
  let flowK = 0 // what really leaves, eased (0..1)
  let chargeK = 0 // the satellite's charge (0..1)
  let speedShown = 0
  let pushShown = 0
  const rate = () => (S.valve && S.magnet ? smooth(0, 300, S.volts) : 0)

  const eng = new THREE.Group()
  eng.position.set(T.x, 0, T.z)
  eng.rotation.y = Math.atan2(-T.x, 5.0 - T.z) // its cut face turned to the spawn
  root.add(eng)
  // pedestal
  const pedMat = std('#2c3454', { metalness: 0.4, roughness: 0.5 })
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 2.05, T.base, 64), pedMat)
  ped.position.y = T.base / 2
  eng.add(ped)
  const pedRingMat = new THREE.MeshStandardMaterial({ color: '#7fdcff', emissive: '#7fdcff', emissiveIntensity: 1.2, roughness: 0.4 })
  const pedRing = new THREE.Mesh(new THREE.TorusGeometry(1.97, 0.035, 8, 96), pedRingMat)
  pedRing.rotation.x = Math.PI / 2
  pedRing.position.y = T.base
  eng.add(pedRing)
  solids.push(circle(T.x, T.z, 2.1))

  const th = new THREE.Group() // the thruster itself, axis up (leaning back a little), origin on the pedestal
  th.position.y = T.base
  th.rotation.x = -0.22
  eng.add(th)
  const ceramic = std('#e8e3d6', { roughness: 0.55, side: THREE.DoubleSide })
  const ceramicIn = std('#d3cdbd', { roughness: 0.6, side: THREE.DoubleSide })
  const chanWall = std('#9fb2d8', { roughness: 0.5, side: THREE.DoubleSide, emissive: '#3b4dff', emissiveIntensity: 0 })
  const ironMat = std('#8f98ad', { metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide })
  const copper = std('#d9803a', { metalness: 0.7, roughness: 0.35, side: THREE.DoubleSide })
  const anodeMat = std('#d9b24a', { metalness: 0.6, roughness: 0.35, emissive: '#ffb020', emissiveIntensity: 0, side: THREE.DoubleSide })
  // cut faces are hatched like an engineer's section: lines across the ceramic, windings in the copper
  const hatch = (base, line, dir) => {
    const tx = canvasTex(64, 64, (g, w) => {
      g.fillStyle = base
      g.fillRect(0, 0, w, w)
      g.strokeStyle = line
      g.lineWidth = 3
      for (let i = -w; i < 2 * w; i += 12) {
        g.beginPath()
        if (dir === 'd') {
          g.moveTo(i, 0)
          g.lineTo(i + w, w)
        } else {
          g.moveTo(0, i % w)
          g.lineTo(w, i % w)
        }
        g.stroke()
      }
    }, { repeat: true })
    tx.repeat.set(7, 7)
    textures.push(tx)
    return tx
  }
  const cutCeramic = std('#ffffff', { map: hatch('#f3efe2', '#b8b1a0', 'd'), roughness: 0.7, emissive: '#2c3350', emissiveIntensity: 0.45, side: THREE.DoubleSide })
  const cutCopper = std('#ffffff', { map: hatch('#e8985a', '#8a4a1c', 'h'), roughness: 0.6, emissive: '#5a2d10', emissiveIntensity: 0.55, side: THREE.DoubleSide })
  const cutIron = std('#ffffff', { map: hatch('#b5bdd0', '#6c7690', 'd'), roughness: 0.6, emissive: '#252c44', emissiveIntensity: 0.45, side: THREE.DoubleSide })
  const half = (pts, mat) => {
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 72, Math.PI / 2, Math.PI)
    const m = new THREE.Mesh(g, mat)
    th.add(m)
    return m
  }
  const R_IN = 0.95
  const R_OUT = 1.25
  const R_WALL = 1.5
  const Y0 = 0.14
  const Y1 = 0.95
  half([[0, 0], [R_WALL, 0], [R_WALL, Y0], [R_OUT, Y0]], ceramicIn)
  half([[R_WALL, Y0], [R_WALL, Y1], [R_OUT, Y1]], ceramic)
  half([[R_OUT, Y1], [R_OUT, Y0 + 0.005]], chanWall)
  half([[0, Y1], [R_IN, Y1]], ceramic)
  half([[R_IN, Y1], [R_IN, Y0 + 0.005]], chanWall)
  half([[R_IN, Y0 + 0.01], [R_OUT, Y0 + 0.01]], anodeMat)
  half([[0, Y1], [0.28, Y1], [0.28, 1.14], [0, 1.14]], ironMat)
  // the cut faces: flat shapes in the plane z = 0, facing the visitor
  const cutRect = (x0, y0, x1, y1, mat, dz = 0) => {
    const sh = new THREE.Shape([new THREE.Vector2(x0, y0), new THREE.Vector2(x1, y0), new THREE.Vector2(x1, y1), new THREE.Vector2(x0, y1)])
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat)
    m.position.z = dz
    th.add(m)
  }
  cutRect(-R_WALL, 0, R_WALL, Y0, cutCeramic)
  cutRect(R_OUT, Y0, R_WALL, Y1, cutCeramic)
  cutRect(-R_WALL, Y0, -R_OUT, Y1, cutCeramic)
  cutRect(-R_IN, Y0, R_IN, Y1, cutCeramic)
  for (const s of [-1, 1]) cutRect(s * 0.42, 0.26, s * 0.88, 0.84, cutCopper, 0.003)
  cutRect(-0.28, Y0, 0.28, 1.14, cutIron, 0.004)
  // the magnets: coils outside the ring (half rings), their cut ends shown
  const coilHits = new THREE.Group()
  th.add(coilHits)
  const coils = new THREE.Group()
  th.add(coils)
  for (const y of [0.32, 0.48, 0.64, 0.8]) {
    const c = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.07, 12, 64, Math.PI), copper)
    c.rotation.x = -Math.PI / 2
    c.position.y = y
    coils.add(c)
    for (const s of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), cutCopper)
      cap.position.set(s * 1.62, y, 0.002)
      coils.add(cap)
    }
  }
  // the bundles of wire seen in the cut, outside the ring, and the inner coil's section
  for (const s of [-1, 1]) {
    const bundle = new THREE.Shape([new THREE.Vector2(0, 0.26), new THREE.Vector2(0.26, 0.26), new THREE.Vector2(0.26, 0.86), new THREE.Vector2(0, 0.86)])
    const bm = new THREE.Mesh(new THREE.ShapeGeometry(bundle), cutCopper)
    bm.position.set(s > 0 ? 1.52 : -1.78, 0, 0.003)
    coils.add(bm)
    hitShape(new THREE.BoxGeometry(0.8, 1.0, 0.9), coilHits, s * 1.64, 0.56, 0.1)
    hitShape(new THREE.BoxGeometry(0.7, 0.8, 0.6), coilHits, s * 0.65, 0.55, 0.1)
  }
  // field lines across the channel: radial lines on the far half and at the cut
  const fieldPts = []
  for (const y of [0.4, 0.55, 0.7, 0.85]) {
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI / 2 + (i / 8) * Math.PI
      fieldPts.push(Math.sin(a) * (R_IN + 0.01), y, Math.cos(a) * (R_IN + 0.01), Math.sin(a) * (R_OUT - 0.01), y, Math.cos(a) * (R_OUT - 0.01))
    }
  }
  const fieldGeo = new THREE.BufferGeometry()
  fieldGeo.setAttribute('position', new THREE.Float32BufferAttribute(fieldPts, 3))
  const fieldMat = new THREE.LineBasicMaterial({ color: '#7fffd4', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  const fieldLines = new THREE.LineSegments(fieldGeo, fieldMat)
  th.add(fieldLines)
  // the plume above the exit
  const plume = plumeMesh({ r0: 1.12, r1: 2.3, len: 6, color: GAS.Kr.plume })
  plume.position.y = Y1 + 3
  th.add(plume)
  const plumeCore = plumeMesh({ r0: 0.95, r1: 1.2, len: 3.2, color: '#ffffff', power: 2.2 })
  plumeCore.position.y = Y1 + 1.6
  th.add(plumeCore)
  const glowLight = new THREE.PointLight(GAS.Kr.plume, 0, 9, 1.6)
  glowLight.position.set(0, Y1 + 1.4, 0.2)
  th.add(glowLight)

  // the gas: a bottle, a pipe and a red valve on the right
  const tank = new THREE.Group()
  tank.position.set(3.15, 0, 0.2)
  th.add(tank)
  const tankMat = std(GAS.Kr.tint, { metalness: 0.45, roughness: 0.35, emissive: GAS.Kr.tint, emissiveIntensity: 0.12 })
  const tankBody = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.1, 32), tankMat)
  tankBody.position.y = 0.55
  const tankTop = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 16, 0, TAU, 0, Math.PI / 2), tankMat)
  tankTop.position.y = 1.1
  const tankNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.22, 12), ironMat)
  tankNeck.position.y = 1.5
  tank.add(tankBody, tankTop, tankNeck)
  const tankSym = label('Kr', 0.34, { font: 'display', color: '#06102c', outlineWidth: 0 })
  tankSym.position.set(0, 0.62, 0.37)
  tank.add(tankSym)
  const pipeMat = std('#5b6688', { metalness: 0.6, roughness: 0.4 })
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 12), pipeMat)
  pipe.rotation.z = Math.PI / 2
  pipe.position.set(2.2, 0.3, 0.2)
  th.add(pipe)
  const pipeIn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 12), pipeMat)
  pipeIn.rotation.z = Math.PI / 2
  pipeIn.position.set(1.62, 0.3, 0)
  th.add(pipeIn)
  const valve = new THREE.Group()
  valve.position.set(2.2, 0.3, 0.2)
  th.add(valve)
  const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), pipeMat)
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), ironMat)
  stem.rotation.x = Math.PI / 2
  stem.position.z = 0.28
  const wheelMat = std('#ff4d4d', { emissive: '#ff2020', emissiveIntensity: 0.25, roughness: 0.4 })
  const wheel = new THREE.Group()
  wheel.position.z = 0.46
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.028, 8, 28), wheelMat))
  for (let i = 0; i < 4; i++) {
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.34, 6), wheelMat)
    sp.rotation.z = (i / 4) * Math.PI
    wheel.add(sp)
  }
  valve.add(valveBody, stem, wheel)
  const valveHits = new THREE.Group()
  th.add(valveHits)
  hitShape(new THREE.SphereGeometry(0.4, 12, 8), valveHits, 2.2, 0.4, 0.5)
  hitShape(new THREE.CylinderGeometry(0.5, 0.5, 1.6, 12), valveHits, 3.15, 0.8, 0.2)
  // gas running along the pipe
  const NP = 9
  const pipePos = new Float32Array(NP * 3)
  const pipeGeo = new THREE.BufferGeometry()
  pipeGeo.setAttribute('position', new THREE.BufferAttribute(pipePos, 3))
  const neutralTex = dotTexture('neutral')
  const ionTex = dotTexture('ion')
  const electronTex = dotTexture('electron')
  textures.push(neutralTex, ionTex, electronTex)
  const neutralMat = new THREE.PointsMaterial({ map: neutralTex, size: 0.13, transparent: true, depthWrite: false, color: GAS.Kr.tint, alphaTest: 0.05 })
  const pipePts = new THREE.Points(pipeGeo, new THREE.PointsMaterial({ map: neutralTex, size: 0.09, transparent: true, depthWrite: false, color: GAS.Kr.tint, alphaTest: 0.05 }))
  pipePts.frustumCulled = false
  pipePts.raycast = () => {}
  th.add(pipePts)

  // the cathode on the left: a post and an arm, its tip glowing when on
  const cath = new THREE.Group()
  cath.position.set(-2.55, 0, 0.1)
  th.add(cath)
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.0, 12), pipeMat)
  post.position.y = 0.5
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 12), std('#d6dae6', { metalness: 0.6, roughness: 0.35 }))
  arm.position.set(0.28, 1.35, 0)
  arm.rotation.z = -0.95
  const tipMat = std('#ff9a3a', { emissive: '#ff8a20', emissiveIntensity: 0.1, roughness: 0.4 })
  const CATH_TIP = new THREE.Vector3(-1.78, 1.7, 0.1)
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), tipMat)
  tip.position.set(CATH_TIP.x + 2.55, CATH_TIP.y, 0)
  cath.add(post, arm, tip)
  const cathHits = new THREE.Group()
  th.add(cathHits)
  hitShape(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 12), cathHits, -2.4, 1.1, 0.1)
  // labels
  const sign = (txt, x, y, z, size = 0.14) => {
    const t = label(txt, size)
    t.position.set(x, y, z)
    th.add(t)
    return t
  }
  const signs = {
    valve: sign(E.engine.signs.valve, 2.2, 0.82, 0.2),
    magnets: sign(E.engine.signs.magnets, 1.95, 1.12, 0.6),
    cathode: sign(E.engine.signs.cathode, -1.55, 2.15, 0.1),
    anode: sign(E.engine.signs.anode, -1.1, 0.0, 0.5, 0.13),
  }

  // ---- the particles: gas atoms, ions, electrons (Points: one draw call each) ----
  const NN = light ? 36 : 64
  const NI = light ? 70 : 130
  const NE = light ? 20 : 34
  const NC = light ? 10 : 16
  const mk = (n, material) => {
    const pos = new Float32Array(n * 3).fill(-90)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pts = new THREE.Points(geo, material)
    pts.frustumCulled = false
    pts.raycast = () => {}
    th.add(pts)
    return { pos, geo, pts }
  }
  const neutrals = mk(NN, neutralMat)
  const ions = mk(NI, new THREE.PointsMaterial({ map: ionTex, size: 0.2, transparent: true, depthWrite: false, alphaTest: 0.05 }))
  const whirl = mk(NE, new THREE.PointsMaterial({ map: electronTex, size: 0.14, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  const stream = mk(NC, new THREE.PointsMaterial({ map: electronTex, size: 0.12, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  const neutralList = Array.from({ length: NN }, () => ({ on: false, a: 0, r: 1, y: 0, vy: 0 }))
  const ionList = Array.from({ length: NI }, () => ({ on: false, a: 0, r: 1, y: 0, vy: 0, k: 1 }))
  let spawnClock = 0
  const polar = (a, r) => [Math.sin(a) * r, Math.cos(a) * r] // x, z for the far half: a in [pi/2, 3pi/2]
  const farAngle = () => Math.PI / 2 + Math.random() * Math.PI
  const ionPull = () => smooth(0.25, 0.9, chargeK)
  const maxIon = () => ionSpeed(S.volts, S.gas) * 0.17 // m/s on screen

  function stepParticles(dt, t) {
    const r = rate()
    // gas atoms drift up the channel
    spawnClock += dt
    while (S.valve && spawnClock > 0.075) {
      spawnClock -= 0.075
      const n = neutralList.find(q => !q.on)
      if (!n) break
      Object.assign(n, { on: true, a: farAngle(), r: R_IN + 0.06 + Math.random() * (R_OUT - R_IN - 0.12), y: Y0 + 0.03, vy: 0.26 + Math.random() * 0.12 })
    }
    if (!S.valve) spawnClock = 0
    for (let i = 0; i < NN; i++) {
      const n = neutralList[i]
      if (!n.on) {
        neutrals.pos[i * 3 + 1] = -90
        continue
      }
      n.y += n.vy * dt
      // atoms that meet the whirling electrons lose one: they become ions
      if (S.magnet && n.y > 0.4 && n.y < Y1 + 0.15 && S.volts > 8 && Math.random() < dt * 9 * r) {
        const q = ionList.find(z => !z.on)
        if (q) Object.assign(q, { on: true, a: n.a, r: n.r, y: n.y, vy: 0.4, k: 0.6 + Math.random() * 0.8, out: false })
        n.on = false
        continue
      }
      if (n.y > 2.4) n.on = false
      const [x, z] = polar(n.a, n.r + (n.y > Y1 ? (n.y - Y1) * 0.1 : 0))
      neutrals.pos.set([x, n.y, z], i * 3)
    }
    neutrals.geo.attributes.position.needsUpdate = true
    // ions: accelerated out, flung back when the satellite has charged up
    const vmax = maxIon()
    const pull = ionPull()
    for (let i = 0; i < NI; i++) {
      const q = ionList[i]
      if (!q.on) {
        ions.pos[i * 3 + 1] = -90
        continue
      }
      if (q.y < Y1) q.vy = Math.min(q.vy + (3 + 7 * (S.volts / 300)) * dt, Math.max(vmax * 0.55, 0.6))
      else {
        q.vy = damp(q.vy, vmax * q.k * (1 - pull), 2.5, dt) - pull * 7 * dt
        if (!q.out) {
          q.out = true
          if (Math.random() < 0.5) q.a += Math.PI // some come out on the near side
        }
      }
      q.y += q.vy * dt
      if (q.y < Y1 - 0.05 && q.vy < 0) q.on = false
      if (q.y > 7.2) q.on = false
      if (!q.on) {
        q.out = false
        continue
      }
      const open = Math.max(0, q.y - Y1)
      const [x, z] = polar(q.a, q.r * (1 + open * 0.09 * q.k))
      ions.pos.set([x, q.y, z], i * 3)
    }
    ions.geo.attributes.position.needsUpdate = true
    // electrons held by the field, whirling round the channel (far half only: the near half is cut away)
    for (let i = 0; i < NE; i++) {
      if (!S.magnet) {
        whirl.pos[i * 3 + 1] = -90
        continue
      }
      const s = (i / NE + t * 0.22 + Math.sin(i * 7.1) * 0.02) % 1
      const a = Math.PI / 2 + s * Math.PI
      const rr = 1.1 + Math.sin(i * 3.7) * 0.07
      const [x, z] = polar(a, rr)
      whirl.pos.set([x, 0.56 + Math.sin(i * 5.3 + t * 3) * 0.1, z], i * 3)
    }
    whirl.geo.attributes.position.needsUpdate = true
    // the cathode's electrons running out to meet the ions
    const flowing = S.cathode && flowK > 0.04
    for (let i = 0; i < NC; i++) {
      if (!flowing) {
        stream.pos[i * 3 + 1] = -90
        continue
      }
      const u = (i / NC + t * 0.6) % 1
      const tx = 0.3
      const ty = Y1 + 1.2
      stream.pos.set([
        THREE.MathUtils.lerp(CATH_TIP.x, tx, u),
        THREE.MathUtils.lerp(CATH_TIP.y, ty, u) + Math.sin(u * 9 + i) * 0.08,
        THREE.MathUtils.lerp(0.1, 0.2, u) + Math.cos(u * 7 + i) * 0.06,
      ], i * 3)
    }
    stream.geo.attributes.position.needsUpdate = true
    // gas along the pipe
    for (let i = 0; i < NP; i++) {
      if (!S.valve) {
        pipePos[i * 3 + 1] = -90
        continue
      }
      const u = (i / NP + t * 0.3) % 1
      pipePos.set([THREE.MathUtils.lerp(2.95, 1.45, u), 0.3, THREE.MathUtils.lerp(0.2, 0, u)], i * 3)
    }
    pipeGeo.attributes.position.needsUpdate = true
  }

  // ---- the readout board: ion speed, push, charge ----
  const rdTex = canvasTex(640, 400, null)
  textures.push(rdTex)
  const readout = new THREE.Group()
  readout.position.set(-3.1, 2.15, -1.2)
  readout.rotation.set(-0.12, 0.25, 0)
  eng.add(readout) // standing on the floor behind the engine's left, the plume between it and the visitor
  const rdFrame = new THREE.Mesh(new RoundedBoxGeometry(1.8, 1.14, 0.06, 2, 0.03), std('#7fdcff', { emissive: '#7fdcff', emissiveIntensity: 0.9 }))
  const rdFace = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.06), new THREE.MeshBasicMaterial({ map: rdTex, toneMapped: false }))
  rdFace.position.z = 0.035
  readout.add(rdFrame, rdFace)
  const rdLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 2.9, 8), pipeMat)
  rdLeg.position.set(0, -1.45, -0.06)
  readout.add(rdLeg)
  let rdKey = ''
  function drawReadout(lv, force) {
    const sci = lv === 'scientist'
    const R = E.engine.readout
    const speed = speedShown
    const push = pushShown
    const key = [lv, Math.round(speed * 2), Math.round(push), Math.round(chargeK * 40)].join()
    if (!force && key === rdKey) return
    rdKey = key
    rdTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1230'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#16204a'
      g.fillRect(0, 0, w, 6)
      const row = (y, name, value, frac, color, note) => {
        g.textAlign = 'left'
        g.fillStyle = '#9fb2e8'
        g.font = '600 30px Nunito'
        g.fillText(name, 28, y)
        g.fillStyle = '#ffffff'
        g.font = '700 54px Outfit'
        g.fillText(value, 28, y + 56)
        if (note) {
          g.textAlign = 'right'
          g.fillStyle = color
          g.font = '700 30px Nunito'
          g.fillText(note, w - 28, y + 54)
          g.textAlign = 'left'
        }
        g.fillStyle = '#1b2650'
        g.fillRect(28, y + 70, w - 56, 14)
        g.fillStyle = color
        g.fillRect(28, y + 70, (w - 56) * clamp(frac), 14)
      }
      row(42, R.speed, fill(R.km, { n: fmt(speed, 1) }), speed / 40, '#59d9ff', speed < 0.2 ? R.none : '')
      row(158, R.push, fill(R.mn, { n: fmt(push, sci ? 0 : 0) }), push / 100, '#8fb0ff', push > 1 ? fill(R.coin, { g: fmt(COIN_G(push), 1) }) : '')
      row(274, R.charge, '', chargeK, chargeK > 0.55 ? '#ff5d5d' : '#ffd166', chargeK > 0.55 ? R.high : chargeK > 0.08 ? '' : R.ok)
    })
  }
  drawReadout('explorer', true)

  // ---- steps ----
  const hasPlasma = () => rate() > 0.04
  function sayEngine(key) {
    say(at(E.engine.says[key], level()))
  }
  let wheelTurn = 0
  const gasName = () => nameOf(GAS[S.gas].el, lang)
  function applyGas(g, live) {
    S.gas = g
    const G = GAS[g]
    tankMat.color.set(G.tint)
    tankMat.emissive.set(G.tint)
    neutralMat.color.set(G.tint)
    pipePts.material.color.set(G.tint)
    plume.userData.mat.uniforms.uColor.value.set(G.plume)
    glowLight.color.set(G.plume)
    setText(tankSym, g)
    if (live) play('select')
  }
  function engineStep(what) {
    if (what === 'valve') {
      S.valve = S.valve ? 0 : 1
      wheelTurn += Math.PI
      play('tap')
      sayEngine(S.valve ? 'valveOn' : 'valveOff')
    } else if (what === 'magnet') {
      S.magnet = S.magnet ? 0 : 1
      play(S.magnet ? 'select' : 'tap')
      if (S.magnet && !S.valve) sayEngine('magnetOn')
      else if (S.magnet && S.valve && S.volts > 20) sayEngine('flow')
      else sayEngine(S.magnet ? 'magnetOn' : 'magnetOff')
    } else if (what === 'cathode') {
      S.cathode = S.cathode ? 0 : 1
      play(S.cathode ? 'select' : 'tap')
      sayEngine(S.cathode ? 'cathodeOn' : 'cathodeOff')
    } else return
    ex.discover('engine', enginePanel, 2.6)
    share('engine')
  }
  function setVolts(v, now = false) {
    const n = clamp(Math.round(Number(v) || 0), 0, 300)
    if (n === S.volts) return
    const was = S.volts
    S.volts = n
    if (now) {
      play('tap')
      share('engine')
    } else throttled('engine')
    ex.discover('engine', enginePanel, 2.6)
    // the Atomling tells what the volts did, once it starts (and when it is not yet possible)
    if (was < 40 && n >= 40) {
      if (!S.valve) sayEngine('needGas')
      else if (!S.magnet) sayEngine('needMagnet')
      else sayEngine('flow')
    }
  }
  const enginePanel = lv => ({
    title: E.engine.title,
    color: GAS.Kr.plume,
    blocks: [
      { slider: { label: E.engine.slider, min: 0, max: 300, step: 5, value: S.volts, onInput: v => setVolts(v), format: v => fill(E.engine.volts, { v: Math.round(v) }), live: () => S.volts } },
      {
        buttons: [
          { label: E.engine.buttons.valve, onClick: () => engineStep('valve') },
          { label: E.engine.buttons.magnet, onClick: () => engineStep('magnet') },
          { label: E.engine.buttons.cathode, onClick: () => engineStep('cathode') },
        ],
      },
      ...E.engine.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(valveHits, () => engineStep('valve'))
  clickable(coilHits, () => engineStep('magnet'))
  clickable(coils, () => engineStep('magnet'))
  clickable(cathHits, () => engineStep('cathode'))
  clickable(cath, () => engineStep('cathode'))
  ex.add({
    id: 'engine',
    x: -2.6,
    z: 1.1,
    radius: 2.7,
    manual: true,
    label: E.engine.label,
    verb: () => {
      const H = E.engine.hints
      if (!S.valve) return H.valve
      if (!S.magnet) return H.magnet
      if (S.volts < 40) return H.volts
      return S.cathode ? H.off : H.on
    },
    focus: { x: T.x, y: 1.3, z: T.z, size: 5.2, width: 6.4 },
    act: () => ctx.showPanel(enginePanel),
  })

  updates.push((dt, t) => {
    const lv = level()
    const r = rate()
    plasmaK = damp(plasmaK, r, 4, dt)
    // the satellite charges while ions leave without electrons after them
    if (!S.cathode) chargeK = clamp(chargeK + dt * 0.2 * r)
    else chargeK = clamp(chargeK - dt * 0.9)
    const pull = ionPull()
    flowK = damp(flowK, r * (1 - pull), 5, dt)
    const gasF = pushRel(S.gas)
    speedShown = damp(speedShown, flowK > 0.03 ? ionSpeed(S.volts, S.gas) * (1 - pull * 0.6) : 0, 4, dt)
    pushShown = damp(pushShown, KR_PUSH * gasF * Math.sqrt(S.volts / 300) * flowK, 4, dt)
    stepParticles(dt, t)
    // glows
    plume.userData.mat.uniforms.uK.value = flowK * 1.1
    plume.userData.mat.uniforms.uTime.value = t
    plumeCore.userData.mat.uniforms.uK.value = flowK * 0.9
    plumeCore.userData.mat.uniforms.uTime.value = t
    glowLight.intensity = flowK * 3.2
    chanWall.emissiveIntensity = plasmaK * 1.1
    chanWall.emissive.set(GAS[S.gas].plume)
    anodeMat.emissiveIntensity = S.valve ? 0.35 + 0.1 * Math.sin(t * 4) : 0
    fieldMat.opacity = damp(fieldMat.opacity, S.magnet ? 0.9 : 0, 5, dt)
    tipMat.emissiveIntensity = S.cathode ? 1.4 + 0.3 * Math.sin(t * 6) : 0.1
    tipMat.color.set(S.cathode ? '#ffb347' : '#6a5a4a')
    pedRingMat.emissive.set(GAS[S.gas].plume)
    pedRingMat.color.set(GAS[S.gas].plume)
    wheel.rotation.z = damp(wheel.rotation.z, wheelTurn, 6, dt)
    for (const k of ['valve', 'magnets', 'cathode', 'anode']) faceCamera(signs[k], ctx.camera)
    drawReadout(lv, lv !== lastLevelReadout)
    lastLevelReadout = lv
  })
  let lastLevelReadout = null

  // =========================================================================================================
  // 2. THE SATELLITE: a flat body, one wing, a thruster at one end, true size
  // =========================================================================================================
  const solarTex = canvasTex(1024, 270, (g, w, h) => {
    g.fillStyle = '#0e1a46'
    g.fillRect(0, 0, w, h)
    const cols = 38
    const rows = 10
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = 18 + ((i * 7 + j * 13) % 9)
        g.fillStyle = `rgb(${k},${k + 26},${k + 90})`
        g.fillRect((i * w) / cols + 2, (j * h) / rows + 2, w / cols - 4, h / rows - 4)
      }
    }
    g.strokeStyle = 'rgba(190,205,240,0.55)'
    g.lineWidth = 1
    for (let i = 0; i <= cols; i++) {
      g.beginPath()
      g.moveTo((i * w) / cols, 0)
      g.lineTo((i * w) / cols, h)
      g.stroke()
    }
  })
  solarTex.wrapS = solarTex.wrapT = THREE.ClampToEdgeWrapping
  textures.push(solarTex)
  const satBodyMat = std('#dfe3ee', { metalness: 0.5, roughness: 0.35 })
  const faceTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#4a5686'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#6f7db8'
    for (let j = 0; j < 26; j++) for (let i = 0; i < 52; i++) g.fillRect(6 + i * 9.6 + (j % 2) * 4, 6 + j * 9.6, 4, 4)
    g.strokeStyle = '#c9d2f0'
    g.lineWidth = 3
    g.strokeRect(2, 2, w - 4, h - 4)
    g.beginPath()
    g.moveTo(w / 2, 0)
    g.lineTo(w / 2, h)
    g.stroke()
  })
  textures.push(faceTex)
  const satFaceMat = std('#ffffff', { map: faceTex, roughness: 0.4, metalness: 0.3 })
  const satWingMat = std('#ffffff', { map: solarTex, roughness: 0.3, metalness: 0.4, side: THREE.DoubleSide })
  const satMetal = std('#9aa3b8', { metalness: 0.7, roughness: 0.4 })
  const nozMat = std('#3a4260', { metalness: 0.6, roughness: 0.4, emissive: '#7a6dff', emissiveIntensity: 0 })
  const sat = new THREE.Group()
  const satBody = new THREE.Group()
  sat.add(satBody)
  const bodyBox = new THREE.Mesh(new RoundedBoxGeometry(2.9, 1.4, 0.16, 3, 0.04), satBodyMat)
  const face = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.15), satFaceMat)
  face.position.z = 0.085
  const boom = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.06), satMetal)
  boom.position.set(1.7, 0, 0)
  const wing = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 2.0), satWingMat)
  wing.position.set(1.97 + 3.8, 0, 0)
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.26, 0.34, 20), nozMat)
  nozzle.rotation.z = Math.PI / 2
  nozzle.position.set(-1.62, 0, 0)
  satBody.add(bodyBox, face, boom, nozzle)
  const wingGroup = new THREE.Group()
  wingGroup.add(wing)
  sat.add(wingGroup)
  const satPlume = plumeMesh({ r0: 0.14, r1: 0.55, len: 2.6, color: GAS.Kr.plume, power: 1.2 })
  satPlume.rotation.z = Math.PI / 2
  satPlume.position.set(-1.8 - 1.3, 0, 0)
  sat.add(satPlume)
  sat.position.copy(SAT0)
  root.add(sat)
  const satHit = hitShape(new THREE.SphereGeometry(0.6, 12, 8), sat, -1.7, 0, 0)

  // the scale beside it: a pan with a coin on it that the push presses down
  const scale = new THREE.Group()
  scale.position.set(SCALE.x, 0, SCALE.z)
  root.add(scale)
  scale.add(placed(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.7, 24), pedMat), 0, 0.35, 0))
  const pan = new THREE.Group()
  pan.position.y = 0.78
  const panDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 28), std('#c9d0e4', { metalness: 0.7, roughness: 0.3 }))
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.025, 24), std('#ffd166', { metalness: 0.8, roughness: 0.3, emissive: '#c08a10', emissiveIntensity: 0.1 }))
  coin.position.y = 0.035
  pan.add(panDisc, coin)
  scale.add(pan)
  solids.push(circle(SCALE.x, SCALE.z, 0.55))
  const scaleText = label('', 0.15)
  scaleText.position.set(0, 1.5, 0)
  scale.add(scaleText)
  const scaleSign = label(E.sat.signs.scale, 0.11)
  scaleSign.position.set(0, 1.18, 0)
  scale.add(scaleSign)
  // the red button for the end
  const btn = new THREE.Group()
  btn.position.set(BUTTON.x, 0, BUTTON.z)
  root.add(btn)
  btn.add(placed(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.95, 24), pedMat), 0, 0.475, 0))
  const btnMat = std('#ff3b3b', { emissive: '#ff2020', emissiveIntensity: 0.6, roughness: 0.35 })
  const btnTop = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 24), btnMat)
  btnTop.position.y = 1.0
  btn.add(btnTop)
  hitShape(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 12), btn, 0, 0.7, 0)
  const btnSign = label(E.sat.signs.end, 0.13)
  btnSign.position.set(0, 1.45, 0)
  btn.add(btnSign)
  solids.push(circle(BUTTON.x, BUTTON.z, 0.4))
  // a thruster sign and the junk's sign
  const thrSign = label(E.sat.signs.thruster, 0.14)
  root.add(thrSign)
  // the orbit globe
  const globe = new THREE.Group()
  globe.position.set(GLOBE.x, 0, GLOBE.z)
  root.add(globe)
  globe.add(placed(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.38, 0.5, 20), pedMat), 0, 0.25, 0))
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.8, 64, 32), stage.earthMaterial())
  ball.position.y = 1.3
  ball.rotation.set(0.4, 0, 0.35)
  globe.add(ball)
  const orbitTilt = new THREE.Group()
  orbitTilt.position.y = 1.3
  orbitTilt.rotation.set(0.9, 0, 0.3)
  globe.add(orbitTilt)
  const ringMat = new THREE.MeshBasicMaterial({ color: '#7fdcff', transparent: true, opacity: 0.9 })
  const ringNow = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 8, 160), ringMat)
  const ringGoal = new THREE.Mesh(new THREE.TorusGeometry(1, 0.006, 6, 160), new THREE.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0.55 }))
  const satDot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }))
  orbitTilt.add(ringNow, ringGoal, satDot)
  const exag = h => 0.8 * (1 + (6 * h) / 6371)
  ringGoal.scale.setScalar(exag(HIGH))
  const globeText = label('', 0.13)
  globeText.position.set(0, 2.5, 0)
  globe.add(globeText)
  const globeSign = label(E.sat.signs.globe, 0.095)
  globeSign.position.set(0, 2.3, 0)
  globe.add(globeSign)
  solids.push(circle(GLOBE.x, GLOBE.z, 0.45))
  hitShape(new THREE.SphereGeometry(1.15, 12, 8), globe, 0, 1.3, 0)

  // the space junk: a bent panel and a tube, tumbling
  const junk = new THREE.Group()
  const junkMat = std('#8b8f9c', { metalness: 0.5, roughness: 0.6 })
  const jp = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.04), junkMat)
  jp.rotation.set(0.3, 0.2, 0.5)
  const jt = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 10), std('#b08a5a', { metalness: 0.4, roughness: 0.6 }))
  jt.rotation.z = 1.1
  jt.position.set(0.2, 0.1, 0.05)
  const warnMat = new THREE.MeshBasicMaterial({ color: '#ff5050', transparent: true, opacity: 0.8 })
  const warn = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.02, 8, 40), warnMat)
  junk.add(jp, jt, warn)
  const JUNK0 = new THREE.Vector3(3.6, 5.0, -9.0)
  junk.position.copy(JUNK0)
  root.add(junk)
  const junkHit = hitShape(new THREE.SphereGeometry(1.3, 10, 8), junk, 0, 0, 0)
  const junkSign = label(E.sat.signs.junk, 0.14)
  root.add(junkSign)
  const warnLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineDashedMaterial({ color: '#ff6060', dashSize: 0.3, gapSize: 0.2, transparent: true, opacity: 0.8 }))
  warnLine.frustumCulled = false
  warnLine.visible = false
  root.add(warnLine)
  // re-entry: a glow and a trail
  const glowTex = glowTexture(128)
  textures.push(glowTex)
  const burn = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: '#ff8a3a', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  burn.scale.setScalar(2)
  root.add(burn)
  const TRAIL = 60
  const trailPos = new Float32Array(TRAIL * 3).fill(-90)
  const trailGeo = new THREE.BufferGeometry()
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
  const trail = new THREE.Points(trailGeo, new THREE.PointsMaterial({ color: '#ffb066', size: 0.5, map: electronTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  trail.frustumCulled = false
  trail.raycast = () => {}
  root.add(trail)

  // state of the satellite room: counts of what happened (the shared state), days, and what is playing
  const A = { push: 0, junk: 0, end: 0, days: 0 }
  let pushT = -1 // seconds since the thruster was fired (-1: not firing)
  let junkT = -1
  let endT = -1
  let newT = 2 // seconds since the new satellite appeared (>= 1.4: grown)
  let junkIn = 2 // seconds since the junk came back from far off
  const PUSH_LEN = 7.5
  const JUNK_LEN = 9
  const END_LEN = 7.2
  const busyNow = () => junkT >= 0 || endT >= 0
  const days = () => A.days
  const nudge = (t) => (t < 0 ? 0 : t < 1.2 ? ease(t / 1.2) * 0.5 : t < 4 ? 0.5 : 0.5 * (1 - ease((t - 4) / 3)))
  const firing = (t) => (t >= 0 && t < 4.3 ? Math.min(1, t / 0.4) * (t > 3.6 ? 1 - (t - 3.6) / 0.7 : 1) : 0)
  function satStep(what) {
    const lv = level()
    if (endT >= 0 && what !== 'end') return say(at(E.sat.says.endWait, lv))
    if (what === 'push') {
      if (junkT >= 0) return say(at(E.sat.says.junkWait, lv))
      pushT = 0
      A.push++
      play('beam')
      say(at(E.sat.says.push, lv))
    } else if (what === 'junk') {
      if (junkT >= 0) return say(at(E.sat.says.junkWait, lv))
      junkT = 0
      A.junk++
      play('beam')
      say(at(E.sat.says.junk, lv))
    } else if (what === 'end') {
      if (endT >= 0) return say(at(E.sat.says.endWait, lv))
      if (junkT >= 0) return say(at(E.sat.says.junkWait, lv))
      endT = 0
      A.end++
      play('beam')
      say(at(E.sat.says.end, lv))
    } else return
    ex.discover('sat', satPanel, 2.6)
    share('sat')
  }
  let daysSay = false
  function setDays(d, now = false) {
    const n = clamp(Math.round(Number(d) || 0), 0, DAYS)
    if (n === A.days) return
    A.days = n
    if (now) share('sat')
    else throttled('sat')
    ex.discover('sat', satPanel, 2.6)
    if (!daysSay) {
      daysSay = true
      say(at(E.sat.says.days, level()))
    }
  }
  const satPanel = lv => ({
    title: E.sat.title,
    color: GAS.Kr.plume,
    blocks: [
      { slider: { label: E.sat.slider, min: 0, max: DAYS, step: 1, value: A.days, onInput: v => setDays(v), format: v => fill(E.sat.days, { n: Math.round(v), h: Math.round(heightAt(v)) }), live: () => A.days } },
      {
        buttons: [
          { label: E.sat.buttons.push, onClick: () => satStep('push') },
          { label: E.sat.buttons.junk, onClick: () => satStep('junk') },
          { label: E.sat.buttons.end, onClick: () => satStep('end') },
        ],
      },
      ...E.sat.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  clickable(satHit, () => satStep('push'), { reach: 8, when: () => endT < 0 })
  clickable(nozzle, () => satStep('push'), { reach: 8, when: () => endT < 0 })
  clickable(bodyBox, () => satStep('push'), { reach: 8, when: () => endT < 0 })
  clickable(junkHit, () => satStep('junk'), { reach: 12, when: () => junkT < 0 && endT < 0 })
  clickable(btn, () => satStep('end'), { reach: 6 })
  clickable(globe, () => ctx.showPanel(satPanel), { reach: 6 })
  ex.add({
    id: 'sat',
    x: 1.0,
    z: -1.6,
    radius: 2.9,
    manual: true,
    label: E.sat.label,
    verb: () => {
      const H = E.sat.hints
      if (!A.push) return H.push
      if (!A.junk) return H.junk
      if (!A.end) return H.end
      return H.more
    },
    focus: { x: 1.0, y: 2.0, z: -5.0, size: 5.2, width: 6.5 },
    act: () => ctx.showPanel(satPanel),
  })

  const satTmp = new THREE.Vector3()
  const JT = SAT0.clone() // where the junk is aimed
  const JD = JT.clone().sub(JUNK0).normalize()
  updates.push((dt, t) => {
    if (pushT >= 0 && (pushT += dt) > PUSH_LEN) pushT = -1
    if (junkT >= 0 && (junkT += dt) > JUNK_LEN) {
      junkT = -1
      junkIn = 0
    }
    if (endT >= 0 && (endT += dt) > END_LEN) {
      endT = -1
      newT = 0
    }
    if (newT < 1.4) newT += dt
    if (junkIn < 1.6) junkIn += dt
    // the satellite: bobbing a little, nudged by a push, stepping aside from the junk, falling at the end
    let sx = 0
    let sy = 0
    let fire = 0
    if (pushT >= 0) {
      sx += nudge(pushT)
      fire = Math.max(fire, firing(pushT))
    }
    if (junkT >= 0) {
      const k = junkT < 1.6 ? 0 : junkT < 3.2 ? ease((junkT - 1.6) / 1.6) : junkT < 6 ? 1 : 1 - ease((junkT - 6) / 3)
      sx += 2.6 * k
      fire = Math.max(fire, junkT > 1.4 && junkT < 3.6 ? Math.min(1, (junkT - 1.4) / 0.3) * (junkT > 3.2 ? 1 - (junkT - 3.2) / 0.4 : 1) : 0)
    }
    sat.position.set(SAT0.x + sx, SAT0.y + sy + Math.sin(t * 0.7) * 0.06, SAT0.z)
    sat.rotation.set(0, 0, 0)
    sat.scale.setScalar(1)
    sat.visible = true
    wingGroup.position.set(0, 0, 0)
    wingGroup.rotation.set(0, 0, 0)
    satBodyMatHeat(0)
    if (endT >= 0) {
      // first it lowers itself gently, tilting and firing, then it falls away toward the Earth and burns
      const p1 = ease(clamp(endT / 2.4))
      const u = clamp((endT - 2.4) / 4.2)
      fire = Math.max(fire, endT < 2.2 ? Math.min(1, endT / 0.4) * (endT > 1.8 ? 1 - (endT - 1.8) / 0.4 : 1) : 0)
      sat.position.set(SAT0.x + 0.6 * p1 + 2 * u * u, SAT0.y - 1.2 * p1 - 34 * u * u, SAT0.z - 3 * p1 - 40 * u * u)
      sat.rotation.set(0.5 * p1 + u * 4, u * 3, -0.4 * p1 + u * 6)
      const heat = smooth(2.2, 4.8, endT)
      satBodyMatHeat(heat)
      // the wing tears off and tumbles on its own
      if (u > 0.3) {
        const k = u - 0.3
        wingGroup.position.set(k * 6, -k * 8, k * 5)
        wingGroup.rotation.set(k * 9, k * 6, k * 8)
      }
      sat.visible = u < 0.94
      burn.position.copy(sat.position)
      burn.material.opacity = u < 0.94 ? heat * (u > 0.85 ? 1 - (u - 0.85) / 0.09 : 1) : 0
      burn.scale.setScalar(1.5 + heat * 4)
      // the trail
      for (let i = TRAIL - 1; i > 0; i--) trailPos.copyWithin(i * 3, (i - 1) * 3, (i - 1) * 3 + 3)
      if (u < 0.94 && heat > 0.02) trailPos.set([sat.position.x + (Math.random() - 0.5) * 0.4, sat.position.y + (Math.random() - 0.5) * 0.4, sat.position.z + (Math.random() - 0.5) * 0.4], 0)
      else trailPos.set([0, -90, 0], 0)
      trailGeo.attributes.position.needsUpdate = true
    } else {
      burn.material.opacity = 0
      for (let i = 0; i < TRAIL; i++) trailPos[i * 3 + 1] = -90
      trailGeo.attributes.position.needsUpdate = true
    }
    if (newT < 1.4) {
      sat.scale.setScalar(Math.max(0.001, ease(newT / 1.4)))
    }
    nozMat.emissiveIntensity = fire * 1.6
    satPlume.userData.mat.uniforms.uK.value = fire * 1.2
    satPlume.userData.mat.uniforms.uTime.value = t
    thrSign.position.set(sat.position.x - 1.9, sat.position.y + 0.95, sat.position.z + 0.3)
    thrSign.visible = endT < 0
    faceCamera(thrSign, ctx.camera)
    // the junk: tumbling in the sky until tapped, then flying at the satellite, passing it and fading away
    junk.visible = true
    let jfade = 1
    if (junkT >= 0) {
      const dtJ = junkT - 1.0
      const speed = 2.7
      junk.position.copy(JUNK0).addScaledVector(JD, Math.max(0, dtJ) * speed * 1.1)
      if (junkT < 1) junk.position.copy(JUNK0)
      jfade = junkT > 7.6 ? 1 - (junkT - 7.6) / 1.4 : 1
      warnLine.visible = junkT < 3.4
      satTmp.copy(JT)
      warnLine.geometry.setFromPoints([junk.position, satTmp])
      warnLine.computeLineDistances()
    } else {
      junk.position.copy(JUNK0).add(new THREE.Vector3(Math.sin(t * 0.3) * 0.25, Math.sin(t * 0.5) * 0.2, 0))
      warnLine.visible = false
      // after a pass, it comes back from far off
    }
    junk.scale.setScalar(Math.max(0.01, jfade * (junkT < 0 ? ease(junkIn / 1.6) : 1)))
    junk.rotation.x = t * 0.7
    junk.rotation.y = t * 0.5
    warn.rotation.x = -t * 0.7
    warn.rotation.y = -t * 0.5
    warnMat.opacity = junkT < 0 ? 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 4)) : 0
    junkSign.position.set(junk.position.x, junk.position.y + 1.3, junk.position.z)
    junkSign.visible = junkT < 0
    faceCamera(junkSign, ctx.camera)
    // the scale: the push presses the pan down
    const pushNow = fire > 0.02 && endT < 0 && pushT >= 0 ? KR_PUSH * fire : 0
    pan.position.y = 0.78 - pushNow * 0.0006
    coin.material.emissiveIntensity = 0.1 + (pushNow > 1 ? 0.6 : 0)
    setText(scaleText, pushNow > 1 ? `${fill(E.sat.scale.push, { n: fmt(pushNow, 0) })}   ${fill(E.sat.scale.coin, { g: fmt(COIN_G(pushNow), 1) })}` : fill(E.sat.scale.push, { n: 0 }))
    faceCamera(scaleText, ctx.camera)
    faceCamera(scaleSign, ctx.camera)
    // the button's pulse
    btnMat.emissiveIntensity = endT < 0 ? 0.5 + 0.3 * Math.sin(t * 3) : 1.4
    btnTop.position.y = endT >= 0 && endT < 0.4 ? 0.96 : 1.0
    faceCamera(btnSign, ctx.camera)
    // the orbit globe: the ring rises with the days, the satellite goes round
    const hh = heightAt(A.days)
    ringNow.scale.setScalar(exag(hh))
    satDot.position.set(Math.cos(t * 1.3) * exag(hh), Math.sin(t * 1.3) * exag(hh), 0)
    ball.rotation.y = t * 0.1
    setText(globeText, fill(E.sat.days, { n: A.days, h: Math.round(hh) }))
    faceCamera(globeText, ctx.camera)
    faceCamera(globeSign, ctx.camera)
  })
  function satBodyMatHeat(k) {
    satBodyMat.emissive.set('#ff6a1a')
    satBodyMat.emissiveIntensity = k * 1.8
    satWingMat.emissive.set('#ff5a10')
    satWingMat.emissiveIntensity = k * 1.2
    satFaceMat.emissive.set('#ff5a10')
    satFaceMat.emissiveIntensity = k * 1.4
  }

  // =========================================================================================================
  // 3. THE PROPELLANTS: three bottles on a rack and a board comparing them
  // =========================================================================================================
  const rack = new THREE.Group()
  rack.position.set(RACK.x, 0, RACK.z)
  rack.rotation.y = Math.atan2(-RACK.x, 5.0 - RACK.z)
  root.add(rack)
  const shelf = new THREE.Mesh(new RoundedBoxGeometry(3.0, 0.36, 0.9, 3, 0.05), pedMat)
  shelf.position.y = 0.18
  rack.add(shelf)
  solids.push(circle(RACK.x, RACK.z, 1.5))
  const bottles = {}
  ORDER.forEach((g, i) => {
    const b = new THREE.Group()
    b.position.set((i - 1) * 0.95, 0.36, 0.1)
    const G = GAS[g]
    const bm = std(G.tint, { metalness: 0.45, roughness: 0.35, emissive: G.tint, emissiveIntensity: 0.12 })
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.55, 28), bm)
    body.position.y = 0.275
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.27, 28, 14, 0, TAU, 0, Math.PI / 2), bm)
    cap.position.y = 0.55
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.16, 10), ironMat)
    neck.position.y = 0.87
    const sym = label(g, 0.3, { color: '#06102c', outlineWidth: 0 })
    sym.position.set(0, 0.3, 0.28)
    const lamp = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.025, 8, 36), new THREE.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0 }))
    lamp.rotation.x = Math.PI / 2
    lamp.position.y = 0.02
    b.add(body, cap, neck, sym, lamp)
    hitShape(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 12), b, 0, 0.5, 0)
    rack.add(b)
    bottles[g] = { b, lamp, y: 0.36 }
    clickable(b, () => fuelStep(g), { reach: 6 })
  })
  const boardTex = canvasTex(1280, 800, null)
  textures.push(boardTex)
  const board = new THREE.Group()
  board.position.set(0, 2.55, -0.9)
  board.rotation.x = -0.2
  rack.add(board)
  board.add(new THREE.Mesh(new RoundedBoxGeometry(3.4, 2.16, 0.08, 2, 0.04), std('#7fdcff', { emissive: '#7fdcff', emissiveIntensity: 0.8 })))
  const boardFace = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 2.06), new THREE.MeshBasicMaterial({ map: boardTex, toneMapped: false }))
  boardFace.position.z = 0.045
  board.add(boardFace)
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.7, 8), pipeMat)
    leg.position.set(s * 1.4, -1.45, -0.1)
    board.add(leg)
  }
  const nf = new Intl.NumberFormat(lang === 'pt-pt' ? 'pt-PT' : lang)
  function drawBoard(lv) {
    const sci = lv === 'scientist'
    const B = E.fuel.board
    const names = ORDER.map(g => nameOf(GAS[g].el, lang))
    const rows = sci ? ['air', 'price', 'mass', 'ion', 'speed', 'push'] : ['air', 'price', 'mass', 'push']
    const val = (row, g) => {
      const G = GAS[g]
      if (row === 'air') return sci ? (G.ppm < 1 ? fmt(G.ppm, 3) : G.ppm < 10 ? fmt(G.ppm, 2) : nf.format(G.ppm)) : nf.format(Number((1e6 / G.ppm).toPrecision(3)))
      if (row === 'price') return G.price < 10 ? fmt(G.price, 2) : nf.format(G.price)
      if (row === 'mass') return fmt(G.m, sci ? 2 : 0)
      if (row === 'ion') return fmt(G.ie, 2)
      if (row === 'speed') return fmt(ionSpeed(300, g), 1)
      return fmt(pushRel(g), 2)
    }
    boardTex.userData.redraw((gx, w, h) => {
      gx.fillStyle = '#0b1230'
      gx.fillRect(0, 0, w, h)
      gx.fillStyle = '#16204a'
      gx.fillRect(0, 0, w, 8)
      gx.textAlign = 'left'
      gx.fillStyle = '#ffffff'
      gx.font = '700 48px Outfit'
      gx.fillText(at(B.head, lv), 40, 66)
      const x0 = 560
      const colW = (w - x0 - 30) / 3
      // the columns' heads: a swatch of the plume's colour, the name
      ORDER.forEach((g, i) => {
        const cx = x0 + colW * i
        const on = g === S.gas
        if (on) {
          gx.fillStyle = 'rgba(255,209,102,0.16)'
          gx.fillRect(cx, 92, colW - 8, h - 112)
          gx.strokeStyle = '#ffd166'
          gx.lineWidth = 4
          gx.strokeRect(cx, 92, colW - 8, h - 112)
        }
        const grd = gx.createRadialGradient(cx + colW / 2, 150, 4, cx + colW / 2, 150, 40)
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(0.35, GAS[g].plume)
        grd.addColorStop(1, 'rgba(0,0,0,0)')
        gx.fillStyle = grd
        gx.fillRect(cx, 100, colW, 100)
        gx.textAlign = 'center'
        gx.fillStyle = '#ffffff'
        gx.font = '700 40px Outfit'
        gx.fillText(names[i], cx + colW / 2 - 4, 232)
        gx.font = '600 28px Nunito'
        gx.fillStyle = '#9fb2e8'
        gx.fillText(g, cx + colW / 2 - 4, 266)
      })
      const top = 296
      const rh = (h - top - 24) / rows.length
      rows.forEach((row, ri) => {
        const y = top + ri * rh
        gx.strokeStyle = 'rgba(159,178,232,0.25)'
        gx.lineWidth = 2
        gx.beginPath()
        gx.moveTo(40, y)
        gx.lineTo(w - 30, y)
        gx.stroke()
        gx.textAlign = 'left'
        gx.fillStyle = '#c4d1f5'
        gx.font = '600 29px Nunito'
        const txt = at(B.rows[row], lv)
        // wrap long labels onto two lines
        const words = txt.split(' ')
        let line = ''
        const lines = []
        for (const wd of words) {
          if (gx.measureText(line + ' ' + wd).width > x0 - 70 && line) {
            lines.push(line)
            line = wd
          } else line = line ? line + ' ' + wd : wd
        }
        lines.push(line)
        lines.forEach((l, li) => gx.fillText(l, 40, y + rh / 2 + 10 + (li - (lines.length - 1) / 2) * 34))
        ORDER.forEach((g, i) => {
          const cx = x0 + colW * i + colW / 2 - 4
          gx.textAlign = 'center'
          gx.fillStyle = g === S.gas ? '#ffe9a6' : '#ffffff'
          gx.font = `700 ${g === S.gas ? 46 : 42}px Outfit`
          gx.fillText(val(row, g), cx, y + rh / 2 + 16)
        })
      })
    })
  }
  let boardKey = ''
  let bottlesTried = false
  function fuelStep(g) {
    if (!GAS[g]) return
    bottlesTried = true
    if (g === S.gas) return say(at(E.fuel.says[g], level()))
    applyGas(g, true)
    say(at(E.fuel.says[g], level()))
    ex.discover('fuel', fuelPanel, 2.6)
    share('fuel')
  }
  const fuelPanel = lv => ({
    title: E.fuel.title,
    color: GAS.Kr.plume,
    blocks: [
      { buttons: ORDER.map(g => ({ label: nameOf(GAS[g].el, lang), onClick: () => fuelStep(g) })) },
      ...E.fuel.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  ex.add({
    id: 'fuel',
    x: RACK.x - 0.4,
    z: RACK.z + 2.7,
    radius: 2.5,
    manual: true,
    label: E.fuel.label,
    verb: () => (bottlesTried ? E.fuel.hints.other : E.fuel.hints.pick),
    focus: { x: RACK.x, y: 1.7, z: RACK.z - 0.4, size: 4.0 },
    act: () => ctx.showPanel(fuelPanel),
  })
  updates.push((dt, t) => {
    for (const g of ORDER) {
      const q = bottles[g]
      q.y = damp(q.y, g === S.gas ? 0.56 : 0.36, 6, dt)
      q.b.position.y = q.y
      q.lamp.material.opacity = g === S.gas ? 0.8 + 0.2 * Math.sin(t * 4) : 0
    }
    const key = `${level()}|${S.gas}`
    if (key !== boardKey) {
      boardKey = key
      drawBoard(level())
    }
  })
  applyGas('Kr', false)
  drawBoard('explorer')

  // the sun's turn and the sky
  updates.push((dt, t) => stage.update(t, dt))

  return {
    env: { ...stage.env },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 7.9 },
    cameraPitchMax: 0.7,
    spawn: { x: 0, z: 5.0, yaw: 0 },
    hostSpot: { x: -2.2, z: 3.6, yaw: Math.atan2(-2.2, -1.4) },
    back: { x: 0, z: 8.6, rot: Math.PI },
    stand: { x: -4.6, z: 2.6, rot: Math.atan2(4.6, 2.4) },
    parts: {
      engine: {
        tap: what => engineStep(what), // 'valve', 'magnet', 'cathode'
        set: v => setVolts(v, true), // the panel's slider
        get state() { return { ...S } },
        get charge() { return chargeK },
        get flow() { return flowK },
        get speed() { return speedShown },
        get push() { return pushShown },
        get ions() { return ionList.filter(q => q.on).length },
        get atoms() { return neutralList.filter(q => q.on).length },
        valveAt: () => th.localToWorld(new THREE.Vector3(2.2, 0.55, 0.65)),
        coilAt: () => th.localToWorld(new THREE.Vector3(0, 0.56, 1.62)),
        cathodeAt: () => th.localToWorld(new THREE.Vector3(-2.4, 1.1, 0.1)),
      },
      sat: {
        tap: what => satStep(what), // 'push', 'junk', 'end'
        setDays: d => setDays(d, true),
        get state() { return { ...A } },
        get busy() { return busyNow() },
        get playing() { return { push: pushT >= 0, junk: junkT >= 0, end: endT >= 0 } },
        // jump into the middle of an animation (for looking at it)
        seek: (what, secs) => { if (what === 'end') endT = secs; else if (what === 'junk') junkT = secs; else pushT = secs },
        nozzleAt: () => nozzle.getWorldPosition(new THREE.Vector3()),
        junkAt: () => junk.getWorldPosition(new THREE.Vector3()),
        buttonAt: () => btn.localToWorld(new THREE.Vector3(0, 1.0, 0)),
        globeAt: () => globe.localToWorld(new THREE.Vector3(0, 1.3, 0)),
      },
      fuel: {
        tap: g => fuelStep(g), // 'Xe', 'Kr', 'Ar'
        get gas() { return S.gas },
        bottleAt: g => bottles[g].b.localToWorld(new THREE.Vector3(0, 0.4, 0.3)),
      },
      sky: { set: p => { stage.auto = false; stage.setSun(p) }, auto: () => { stage.auto = true } },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { engine: enginePanel, sat: satPanel, fuel: fuelPanel },
    shared: {
      engine: {
        get: () => ({ valve: S.valve, magnet: S.magnet, cathode: S.cathode, volts: S.volts }),
        set: (s, liveSet) => {
          const was = { ...S }
          S.valve = s?.valve ? 1 : 0
          S.magnet = s?.magnet ? 1 : 0
          S.cathode = s?.cathode === 0 ? 0 : 1
          S.volts = clamp(Math.round(Number(s?.volts) || 0), 0, 300)
          if (S.valve !== was.valve) wheelTurn += Math.PI
          if (liveSet && (S.valve !== was.valve || S.magnet !== was.magnet || S.cathode !== was.cathode)) play('tap')
          if (!liveSet && (S.valve !== was.valve || S.magnet !== was.magnet)) spawnClock = 0
        },
      },
      sat: {
        // n: the moves made in all (the probe compares a count exactly)
        get: () => ({ ...A, n: A.push + A.junk + A.end }),
        set: (s, liveSet) => {
          const next = { push: Math.max(0, Math.round(Number(s?.push) || 0)), junk: Math.max(0, Math.round(Number(s?.junk) || 0)), end: Math.max(0, Math.round(Number(s?.end) || 0)), days: clamp(Math.round(Number(s?.days) || 0), 0, DAYS) }
          if (liveSet) {
            if (next.push > A.push && pushT < 0 && !busyNow()) { pushT = 0; play('beam') }
            if (next.junk > A.junk && junkT < 0 && endT < 0) { junkT = 0; play('beam') }
            if (next.end > A.end && endT < 0 && junkT < 0) { endT = 0; play('beam') }
          }
          Object.assign(A, next)
        },
      },
      fuel: {
        get: () => ({ gas: S.gas }),
        set: (s, liveSet) => {
          const g = GAS[s?.gas] ? s.gas : 'Kr'
          if (g !== S.gas) applyGas(g, !!liveSet)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const id of Object.keys(sent)) clearTimeout(sent[id])
      for (const tx of textures) tx.dispose()
    },
  }
}
