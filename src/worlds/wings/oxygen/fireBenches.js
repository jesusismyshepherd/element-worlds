// The fire chamber's four benches, each on a stone table with a screen beside it:
// - the candle under a jar (an oxygen gauge falls from 20.9%; the flame shrinks and dies near 16%),
// - the glowing splint test (a splint only glowing bursts into flame in a tube of pure oxygen),
// - methane burning atom by atom (CH4 + 2 O2 -> CO2 + 2 H2O: the atoms regroup, none lost, light and
//   heat given out), over a gas ring's blue flame,
// - rust, a slow burning: three nails in three tubes (air + water, dry air, water without air); in a
//   time-lapse only the one with both air and water rusts.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeText } from '../../../engine/text.js'
import { MOLECULES } from '../../../chem/molecules.js'
import { standingScreen, glowMat, hdr, label, glass, Particles, softDot, damp, smooth, ease, clamp, random, equation, canvasTex, NOISE_GLSL } from './kit.js'
import { flameCard, flicker, FIRE, CANDLE, GAS } from './flame.js'
import { CANDLE_O2 } from './oxygenData.js'

const AMBER = '#ff9a4d'

/** A stone table with a glowing seam, its top at `h`, and (desktop) a soft lamp from above. */
export function stoneTable({ w = 1.5, d = 0.85, h = 0.95, stoneMat, color = AMBER, lamp = true }) {
  const g = new THREE.Group()
  const top = new THREE.Mesh(new RoundedBoxGeometry(w, 0.1, d, 3, 0.03), stoneMat)
  top.position.y = h - 0.05
  const base = new THREE.Mesh(new RoundedBoxGeometry(w * 0.72, h - 0.1, d * 0.62, 3, 0.05), stoneMat)
  base.position.y = (h - 0.1) / 2
  const seam = new THREE.Mesh(new RoundedBoxGeometry(w + 0.02, 0.022, d + 0.02, 2, 0.01), glowMat(color, 1.5))
  seam.position.y = h - 0.1
  g.add(top, base, seam)
  g.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true))
  if (lamp) {
    const spot = new THREE.SpotLight('#ffd6a8', 9, 5, 0.55, 0.7, 2)
    spot.position.set(0, h + 2.6, 0.9)
    spot.target.position.set(0, h + 0.2, 0)
    g.add(spot, spot.target)
  }
  return g
}

const brass = () => new THREE.MeshStandardMaterial({ color: '#c9a25a', roughness: 0.3, metalness: 1 })

// ---------------------------------------------------------------------------------------------------
/** The candle and the jar. Faces +z. */
export function candleJar({ stoneMat, words, level, light, decimal = '.' }) {
  const group = new THREE.Group()
  group.add(stoneTable({ w: 1.6, stoneMat, lamp: !light }))
  const H = 0.95
  // the candle
  const waxMat = new THREE.MeshStandardMaterial({ color: '#f1e6cf', roughness: 0.55, emissive: '#ffb060', emissiveIntensity: 0 })
  const candle = new THREE.Mesh(
    new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(0.065, 0), new THREE.Vector2(0.065, 0.26), new THREE.Vector2(0.058, 0.272), new THREE.Vector2(0.03, 0.268), new THREE.Vector2(0, 0.265)], 32),
    waxMat,
  )
  candle.position.set(-0.15, H, 0)
  candle.castShadow = true
  const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.025, 32), brass())
  holder.position.set(-0.15, H + 0.012, 0)
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.03, 6), new THREE.MeshStandardMaterial({ color: '#1a1410' }))
  wick.position.set(-0.15, H + 0.28, 0)
  group.add(holder, candle, wick)
  const flame = flameCard({ w: 0.085, h: 0.2, colors: CANDLE, seed: 2.2, turb: 0.35, gain: 1.6 })
  flame.mesh.position.set(-0.15, H + 0.285, 0)
  group.add(flame.mesh)
  const candleLight = new THREE.PointLight('#ffb35c', 0, 3.2, 2)
  candleLight.position.set(-0.15, H + 0.42, 0)
  group.add(candleLight)
  const smoke = new Particles(24, { map: softDot(64), additive: false, renderOrder: 7 })
  group.add(smoke.points)

  // the jar, hanging from a brass arm
  const jarTop = H + 0.47 // its inside top when down
  const jarGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0.17, 0), new THREE.Vector2(0.17, 0.36), new THREE.Vector2(0.155, 0.42), new THREE.Vector2(0.11, 0.465),
    new THREE.Vector2(0.04, 0.48), new THREE.Vector2(0.035, 0.52), new THREE.Vector2(0.045, 0.535), new THREE.Vector2(0, 0.54),
  ], 40)
  const jar = new THREE.Group()
  const jarBack = new THREE.Mesh(jarGeo, glass({ opacity: 0.04, edge: 0.4, side: THREE.BackSide }))
  const jarFront = new THREE.Mesh(jarGeo, glass({ opacity: 0.05, edge: 0.75 }))
  jarBack.renderOrder = 6
  jarFront.renderOrder = 9
  jar.add(jarBack, jarFront)
  jar.position.set(-0.15, H + 0.005, 0)
  group.add(jar)
  const arm = new THREE.Group()
  const b = brass()
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.1, 12), b)
  mast.position.set(-0.62, H + 0.55, 0)
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.49, 12), b)
  boom.rotation.z = Math.PI / 2
  boom.position.set(-0.385, H + 1.08, 0)
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1, 8), b)
  rod.position.x = -0.15
  arm.add(mast, boom, rod)
  group.add(arm)
  // the gauge: a brass dial, 0 to 25% oxygen, red below 16%
  const dial = new THREE.Group()
  dial.position.set(0.45, H + 0.42, 0.05)
  dial.rotation.x = -0.15
  group.add(dial)
  const face = canvasTex(256, (g, s) => {
    g.fillStyle = '#f4efe2'
    g.beginPath()
    g.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2)
    g.fill()
    const ang = v => Math.PI * 0.75 + (v / 25) * Math.PI * 1.5
    g.strokeStyle = '#c0392b'
    g.lineWidth = 14
    g.beginPath()
    g.arc(s / 2, s / 2, s / 2 - 26, ang(0), ang(16))
    g.stroke()
    g.strokeStyle = '#2a2a2a'
    g.fillStyle = '#2a2a2a'
    g.font = '700 22px Outfit, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let v = 0; v <= 25; v++) {
      const a = ang(v)
      const r0 = s / 2 - (v % 5 ? 30 : 40)
      g.lineWidth = v % 5 ? 2 : 4
      g.beginPath()
      g.moveTo(s / 2 + Math.cos(a) * r0, s / 2 + Math.sin(a) * r0)
      g.lineTo(s / 2 + Math.cos(a) * (s / 2 - 18), s / 2 + Math.sin(a) * (s / 2 - 18))
      g.stroke()
      if (v % 5 === 0) g.fillText(String(v), s / 2 + Math.cos(a) * (s / 2 - 62), s / 2 + Math.sin(a) * (s / 2 - 62))
    }
    g.font = '700 26px Outfit, sans-serif'
    g.fillText('O₂ %', s / 2, s / 2 + 52)
  })
  const dialFace = new THREE.Mesh(new THREE.CircleGeometry(0.15, 48), new THREE.MeshStandardMaterial({ map: face, roughness: 0.5 }))
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.014, 10, 48), brass())
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.12, 0.004), new THREE.MeshStandardMaterial({ color: '#b71c1c', roughness: 0.4 }))
  needle.geometry.translate(0, 0.05, 0)
  needle.position.z = 0.006
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 12), brass())
  hub.rotation.x = Math.PI / 2
  hub.position.z = 0.008
  dial.add(dialFace, bezel, needle, hub)
  const dialPost = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.28, 8), brass())
  dialPost.position.set(0.45, H + 0.14, 0.03)
  group.add(dialPost)
  const needleAt = v => {
    // canvas angles run clockwise from +x with y down; on the mesh the same face is seen from the front
    const a = Math.PI * 0.75 + (v / 25) * Math.PI * 1.5
    needle.rotation.z = -a - Math.PI / 2
  }

  // the screen
  const scr = standingScreen(
    { width: 1.7, height: 1.1, color: AMBER, title: words.title, big: '20,9%', small: '', bigSize: 0.3, bigY: 0.08, smallY: -0.2, glow: 0.6 },
    { top: 1.55, tilt: 0.2, look: 'stone', standMat: stoneMat },
  )
  scr.group.position.set(1.45, 0, 0.35)
  scr.group.rotation.y = -0.5
  group.add(scr.group)
  const pct = v => `${v.toFixed(1).replace('.', decimal)}%`
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine(), big: pct(20.9) })

  // state
  let down = false
  let jarK = 0 // 0 up, 1 down
  let o2 = 20.9
  let co2 = 0.04
  let burning = 1 // the flame's size
  let lit = true
  let relight = -1
  let outSaid = false
  const api = {
    group,
    screen: scr,
    get down() {
      return down
    },
    onOut: null,
    toggle() {
      down = !down
      if (down) outSaid = false
      else relight = 1.1
      return down ? 'cover' : 'lift'
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t, camera, renderer) {
      jarK = damp(jarK, down ? 1 : 0, 3.2, dt)
      const lift = (1 - jarK) * 0.5
      jar.position.y = H + 0.005 + lift
      // the rod from the boom down to the jar's knob
      const knob = jar.position.y + 0.54
      rod.scale.y = Math.max(0.01, H + 1.08 - knob)
      rod.position.y = knob + rod.scale.y / 2
      // the air in the jar: the flame uses oxygen while it is sealed
      if (jarK > 0.97 && lit) {
        o2 = Math.max(CANDLE_O2.out - 0.3, o2 - dt * 0.62 * Math.max(0.15, burning))
        co2 = 0.04 + (20.9 - o2) * 0.66
        if (o2 <= CANDLE_O2.out) {
          lit = false
          for (let i = 0; i < 14; i++) smoke.spawn({ x: -0.15 + (Math.random() - 0.5) * 0.02, y: H + 0.3, z: (Math.random() - 0.5) * 0.02, vx: (Math.random() - 0.5) * 0.04, vy: 0.05 + Math.random() * 0.05, vz: (Math.random() - 0.5) * 0.04, life: 3 + Math.random() * 2, size: 0.03, alpha: 0, r: 0.55, g: 0.55, b: 0.55 })
          if (!outSaid) {
            outSaid = true
            api.onOut?.()
          }
        }
      } else if (jarK < 0.6) {
        o2 = damp(o2, CANDLE_O2.start, 2.5, dt)
        co2 = damp(co2, 0.04, 2.5, dt)
      }
      if (relight >= 0) {
        relight -= dt
        if (relight < 0 && !down) lit = true
      }
      const want = lit ? clamp((o2 - 15.6) / (18.6 - 15.6), 0, 1) * 0.75 + 0.25 : 0
      burning = damp(burning, want, lit ? 3 : 12, dt)
      const f = flicker(t, 2)
      flame.update(t)
      flame.set(burning * (0.9 + f * 0.15))
      flame.mesh.scale.set(0.085 * (0.6 + 0.4 * burning), 0.2 * (0.3 + 0.7 * burning), 1)
      candleLight.intensity = burning * (1.4 + f * 0.4)
      waxMat.emissiveIntensity = burning * 0.12
      needleAt(o2)
      scr.set({ big: pct(o2) })
      smoke.step(dt, (p, d, k) => {
        p.size = 0.03 + k * 0.12
        p.alpha = Math.sin(k * Math.PI) * 0.4
        if (jarK > 0.5 && p.y > H + 0.45) p.vy = 0
      }, camera, renderer)
    },
    get o2() {
      return o2
    },
    get co2() {
      return co2
    },
  }
  return api
}

// ---------------------------------------------------------------------------------------------------
/** The glowing splint and the test tube of oxygen. Faces +z. */
export function splintTest({ stoneMat, words, level, light }) {
  const group = new THREE.Group()
  group.add(stoneTable({ w: 1.5, stoneMat, lamp: !light }))
  const H = 0.95
  // the rack and the tube
  const wood = new THREE.MeshStandardMaterial({ color: '#8a5a32', roughness: 0.75 })
  const rack = new THREE.Group()
  const shelf = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.03, 0.14, 2, 0.01), wood)
  shelf.position.y = 0.2
  const foot = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.03, 0.18, 2, 0.01), wood)
  foot.position.y = 0.015
  rack.add(shelf, foot)
  for (const x of [-0.27, 0.27]) {
    const side = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.22, 0.14, 2, 0.01), wood)
    side.position.set(x, 0.11, 0)
    rack.add(side)
  }
  rack.position.set(0, H, 0)
  rack.traverse(o => o.isMesh && (o.castShadow = true))
  group.add(rack)
  const tubeX = 0
  const tubeR = 0.05
  const tubeH = 0.42
  const tubeGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0, -tubeH), new THREE.Vector2(tubeR * 0.6, -tubeH + 0.01), new THREE.Vector2(tubeR, -tubeH + 0.04),
    new THREE.Vector2(tubeR, -0.01), new THREE.Vector2(tubeR + 0.008, 0), new THREE.Vector2(tubeR + 0.004, 0.006),
  ], 32)
  const tube = new THREE.Group()
  const tb = new THREE.Mesh(tubeGeo, glass({ opacity: 0.05, edge: 0.5, side: THREE.BackSide }))
  const tf = new THREE.Mesh(tubeGeo, glass({ opacity: 0.06, edge: 0.8 }))
  tb.renderOrder = 6
  tf.renderOrder = 9
  // the oxygen inside: the faintest blue, and a label
  const gas = new THREE.Mesh(new THREE.CylinderGeometry(tubeR * 0.92, tubeR * 0.92, tubeH - 0.05, 24), new THREE.MeshBasicMaterial({ color: '#5aa9ff', transparent: true, opacity: 0.08, depthWrite: false }))
  gas.position.y = -tubeH / 2 - 0.01
  tube.add(gas, tb, tf)
  tube.position.set(tubeX, H + tubeH + 0.03, 0)
  group.add(tube)
  const tag = label(words.tube, { size: 0.05, color: '#bfe2ff' })
  tag.position.set(tubeX, H + 0.12, 0.1)
  const tagF = equation(['O2'], { size: 0.075, color: '#bfe2ff' })
  tagF.position.set(tubeX, H + 0.29, 0.1)
  group.add(tag, tagF)
  const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.046, 0.05, 20), new THREE.MeshStandardMaterial({ color: '#7a1f1a', roughness: 0.6 }))
  const stopperHome = new THREE.Vector3(tubeX, H + tubeH + 0.06, 0)
  stopper.position.copy(stopperHome)
  stopper.castShadow = true
  group.add(stopper)

  // the splint on a clamp
  const splint = new THREE.Group()
  group.add(splint)
  const stick = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.5, 0.014), new THREE.MeshStandardMaterial({ color: '#d9b77e', roughness: 0.8 }))
  stick.position.y = 0.25
  const tipMat = new THREE.MeshStandardMaterial({ color: '#2a1408', emissive: '#ff5a10', emissiveIntensity: 2, roughness: 0.7 })
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.03, 0.016), tipMat)
  tip.position.y = 0.012
  const tipGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(64), color: new THREE.Color('#ff7a2a').multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  tipGlow.scale.setScalar(0.09)
  const clamp1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.05), brass())
  clamp1.position.y = 0.42
  splint.add(stick, tip, tipGlow, clamp1)
  // its flame stays upright whatever the splint's angle (a flame rises)
  const flame = flameCard({ w: 0.07, h: 0.16, colors: FIRE, seed: 4.4, turb: 0.8, gain: 1.7 })
  group.add(flame.mesh)
  const splintLight = new THREE.PointLight('#ffb070', 0, 3, 2)
  group.add(splintLight)
  const smoke = new Particles(20, { map: softDot(64), additive: false, renderOrder: 7 })
  group.add(smoke.points)
  // rest: above and to the right of the tube, tip down at an angle; in: straight down in the tube
  const rest = { p: new THREE.Vector3(0.38, H + 0.62, 0.05), r: 0.5 }
  const over = { p: new THREE.Vector3(tubeX, H + tubeH + 0.18, 0), r: 0 }
  const inside = { p: new THREE.Vector3(tubeX, H + tubeH - 0.12, 0), r: 0 }
  const lerpPose = (a, b, k) => ({ p: a.p.clone().lerp(b.p, k), r: a.r + (b.r - a.r) * k })

  const scr = standingScreen(
    { width: 1.7, height: 1.1, color: AMBER, title: words.title, big: '100%', small: '', bigSize: 0.3, bigY: 0.08, smallY: -0.2, glow: 0.6 },
    { top: 1.55, tilt: 0.2, look: 'stone', standMat: stoneMat },
  )
  scr.group.position.set(1.4, 0, 0.35)
  scr.group.rotation.y = -0.5
  group.add(scr.group)
  const bigF = equation([{ text: '100%' }, 0.02, 'O2'], { size: 0.3, boost: 1.0 })
  bigF.position.y = 0.08
  scr.texts.big.visible = false
  scr.content.add(bigF)
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine() })

  let run = -1
  let burn = 0
  const tipWorld = new THREE.Vector3()
  return {
    group,
    screen: scr,
    get busy() {
      return run >= 0
    },
    start() {
      if (run >= 0) return false
      run = 0
      return true
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t, camera, renderer) {
      let pose = rest
      let flameTo = 0
      if (run >= 0) {
        run += dt
        const k = run
        // the stopper comes off and back
        // the stopper is lifted off and laid on the table beside the rack, then put back
        const off = smooth(0, 0.45, k) * (1 - smooth(6.2, 6.8, k))
        const arc = Math.sin(Math.PI * off) * 0.1
        stopper.position.set(stopperHome.x - 0.42 * off, stopperHome.y + (H + 0.025 - stopperHome.y) * off + arc, stopperHome.z + 0.12 * off)
        if (k < 0.5) pose = rest
        else if (k < 1.1) pose = lerpPose(rest, over, ease((k - 0.5) / 0.6))
        else if (k < 1.6) pose = lerpPose(over, inside, ease((k - 1.1) / 0.5))
        else if (k < 3.4) pose = inside
        else if (k < 4.0) pose = lerpPose(inside, over, ease((k - 3.4) / 0.6))
        else if (k < 4.8) pose = lerpPose(over, rest, ease((k - 4.0) / 0.8))
        flameTo = k > 1.55 ? 1 - smooth(4.6, 7.4, k) * 0.999 : 0
        if (k > 7.6) run = -1
      } else stopper.position.copy(stopperHome)
      splint.position.copy(pose.p)
      splint.rotation.z = pose.r
      burn = damp(burn, flameTo, flameTo > burn ? 9 : 1.5, dt)
      tip.getWorldPosition(tipWorld)
      group.worldToLocal(tipWorld)
      flame.mesh.position.copy(tipWorld).add(new THREE.Vector3(0, -0.01, 0))
      flame.update(t)
      const f = flicker(t, 4)
      flame.set(burn * (0.85 + f * 0.2))
      flame.mesh.scale.set(0.08 * (0.7 + burn * 0.9), 0.17 * (0.5 + burn * 1.3), 1)
      splintLight.position.copy(tipWorld).add(new THREE.Vector3(0, 0.1, 0))
      splintLight.intensity = burn * (2.2 + f * 0.6)
      const glowing = 1 - burn * 0.5
      tipMat.emissiveIntensity = (1.4 + Math.sin(t * 3.3) * 0.4 + f * 0.3) * glowing + burn * 2
      tipGlow.position.copy(tip.position)
      tipGlow.material.opacity = 0.6 + 0.25 * Math.sin(t * 3.3)
      // a wisp of smoke from the glowing tip
      if (Math.random() < dt * (burn > 0.3 ? 2 : 4)) smoke.spawn({ x: tipWorld.x, y: tipWorld.y + 0.02, z: tipWorld.z, vx: (Math.random() - 0.5) * 0.03, vy: 0.08, vz: (Math.random() - 0.5) * 0.03, life: 2.5, size: 0.02, alpha: 0, r: 0.6, g: 0.6, b: 0.6 })
      smoke.step(dt, (p, d, k) => {
        p.size = 0.02 + k * 0.1
        p.alpha = Math.sin(k * Math.PI) * 0.3
        p.vx += Math.sin(t * 2 + p.y * 9) * d * 0.05
      }, camera, renderer)
    },
  }
}

// ---------------------------------------------------------------------------------------------------
/** Methane burning: the atoms of CH4 + 2 O2 regroup into CO2 + 2 H2O over a gas ring. Faces +z. */
export function methaneStage({ stoneMat, words, level, light }) {
  const group = new THREE.Group()
  group.add(stoneTable({ w: 1.7, stoneMat, lamp: !light }))
  const H = 0.95
  // the gas ring and its blue flame
  const ringMat = new THREE.MeshStandardMaterial({ color: '#2c2c2e', roughness: 0.4, metalness: 0.8 })
  const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.05, 32), ringMat)
  burner.position.set(0, H + 0.025, 0.1)
  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 8, 32), ringMat)
  crown.rotation.x = Math.PI / 2
  crown.position.set(0, H + 0.06, 0.1)
  group.add(burner, crown)
  const gasFlames = []
  const nGas = light ? 8 : 12
  for (let i = 0; i < nGas; i++) {
    const a = (i / nGas) * Math.PI * 2
    const f = flameCard({ w: 0.045, h: 0.09, colors: GAS, seed: i * 0.71, turb: 0.25, gain: 1.5 })
    f.mesh.position.set(Math.cos(a) * 0.11, H + 0.065, 0.1 + Math.sin(a) * 0.11)
    group.add(f.mesh)
    gasFlames.push(f)
  }
  const gasLight = new THREE.PointLight('#5f8cff', 1.4, 2.5, 2)
  gasLight.position.set(0, H + 0.25, 0.1)
  group.add(gasLight)

  // the molecules: every atom its own ball, every bond its own stick, so they can regroup
  const S = 0.3 // metres per angstrom
  const C0 = new THREE.Vector3(0, 1.95, 0)
  const COL = { C: '#3a3e46', H: '#f4f6fb', O: '#f2302b' }
  const RAD = { C: 0.4, H: 0.28, O: 0.37 }
  const atomMats = {}
  for (const el of ['C', 'H', 'O']) {
    atomMats[el] = light
      ? new THREE.MeshStandardMaterial({ color: COL[el], roughness: 0.3, emissive: COL[el], emissiveIntensity: 0.05 })
      : new THREE.MeshPhysicalMaterial({ color: COL[el], roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15, emissive: COL[el], emissiveIntensity: 0.05 })
  }
  const place = (mol, at, rot = 0) => mol.atoms.map(a => new THREE.Vector3(...a.p).multiplyScalar(S).applyAxisAngle(new THREE.Vector3(0, 0, 1), rot).add(at))
  // reactants: CH4 on the left, the two O2 to its right
  const ch4 = place(MOLECULES.CH4, new THREE.Vector3(-0.62, 0, 0), 0.4)
  const o2a = place(MOLECULES.O2, new THREE.Vector3(0.42, 0.3, 0))
  const o2b = place(MOLECULES.O2, new THREE.Vector3(0.42, -0.3, 0))
  // products: CO2 on top, the two H2O below
  const co2 = place(MOLECULES.CO2, new THREE.Vector3(0, 0.32, 0))
  const w1 = place(MOLECULES.H2O, new THREE.Vector3(-0.55, -0.16, 0))
  const w2 = place(MOLECULES.H2O, new THREE.Vector3(0.55, -0.16, 0))
  // atoms: [element, start, end]; C to the CO2's middle, one O2 to the CO2, the other O2's atoms to
  // the waters, two H to each water
  const atoms = [
    ['C', ch4[0], co2[0]],
    ['H', ch4[1], w2[1]], ['H', ch4[2], w2[2]], ['H', ch4[3], w1[1]], ['H', ch4[4], w1[2]],
    ['O', o2a[0], co2[1]], ['O', o2a[1], co2[2]],
    ['O', o2b[0], w1[0]], ['O', o2b[1], w2[0]],
  ].map(([el, a, b]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(RAD[el] * S, 24, 16), atomMats[el])
    m.castShadow = true
    return { el, a, b, m }
  })
  const stage = new THREE.Group()
  stage.position.copy(C0)
  group.add(stage)
  for (const at of atoms) stage.add(at.m)
  const stickMat = new THREE.MeshStandardMaterial({ color: '#e6ebf5', roughness: 0.35, transparent: true })
  const bond = (i, j, order, phase) => {
    const sticks = []
    for (let k = 0; k < order; k++) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 10), stickMat.clone())
      stage.add(m)
      sticks.push(m)
    }
    return { i, j, order, phase, sticks }
  }
  // before: C-H x4, O=O x2; after: C=O x2, O-H x4
  const bonds = [
    bond(0, 1, 1, 'a'), bond(0, 2, 1, 'a'), bond(0, 3, 1, 'a'), bond(0, 4, 1, 'a'), bond(5, 6, 2, 'a'), bond(7, 8, 2, 'a'),
    bond(0, 5, 2, 'b'), bond(0, 6, 2, 'b'), bond(7, 3, 1, 'b'), bond(7, 4, 1, 'b'), bond(8, 1, 1, 'b'), bond(8, 2, 1, 'b'),
  ]
  // the burst of energy
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128), color: new THREE.Color('#ffd28a').multiplyScalar(2), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  flash.scale.setScalar(1.6)
  stage.add(flash)
  const flashLight = new THREE.PointLight('#ffcf8a', 0, 6, 2)
  stage.add(flashLight)
  const heat = new Particles(light ? 30 : 60, { map: softDot(32, 0, true), renderOrder: 9 })
  stage.add(heat.points)

  // the screen: the equation, and the count of atoms on each side
  const scr = standingScreen(
    { width: 2.0, height: 1.2, color: AMBER, title: words.title, big: '', small: '', smallY: -0.36, glow: 0.6 },
    { top: 1.5, tilt: 0.2, look: 'stone', standMat: stoneMat },
  )
  scr.group.position.set(1.6, 0, 0.45)
  scr.group.rotation.y = -0.5
  group.add(scr.group)
  const eq = equation(['CH4', '+', '2 O2', 'arrow', 'CO2', '+', '2 H2O'], { size: 0.13, gap: 0.05, boost: 1.0 })
  eq.position.y = 0.2
  scr.content.add(eq)
  const tally = makeText('C 1 = 1    H 4 = 4    O 4 = 4', { size: 0.085, color: hdr('#ffd166', 1.0) })
  tally.position.y = -0.08
  scr.content.add(tally)
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine() })

  const UP = new THREE.Vector3(0, 1, 0)
  const tmp = new THREE.Vector3()
  const side = new THREE.Vector3()
  const Z = new THREE.Vector3(0, 0, 1)
  let state = 'before' // before, burning, after, resetting
  let tt = 0
  const placeAtoms = k => {
    // k: 0 reactants, 1 products; in between the atoms fly on arcs, pushed apart in the middle
    for (const a of atoms) {
      const e = ease(clamp(k))
      a.m.position.lerpVectors(a.a, a.b, e)
      const spread = Math.sin(Math.PI * clamp(k)) * 0.25
      a.m.position.add(tmp.copy(a.m.position).normalize().multiplyScalar(spread))
    }
  }
  const drawBonds = (aShow, bShow) => {
    for (const b of bonds) {
      const show = b.phase === 'a' ? aShow : bShow
      const p = atoms[b.i].m.position
      const q = atoms[b.j].m.position
      tmp.subVectors(q, p)
      const len = tmp.length()
      const dir = tmp.normalize()
      side.crossVectors(dir, Z)
      if (side.lengthSq() < 1e-6) side.crossVectors(dir, UP)
      side.normalize()
      const offs = b.order === 1 ? [0] : [-0.026, 0.026]
      b.sticks.forEach((m, k) => {
        m.visible = show > 0.02
        m.material.opacity = show
        m.position.copy(p).add(q).multiplyScalar(0.5).addScaledVector(side, offs[k])
        m.quaternion.setFromUnitVectors(UP, dir)
        m.scale.set(1, Math.max(0.01, len - 0.12), 1)
      })
    }
  }
  placeAtoms(0)
  drawBonds(1, 0)
  return {
    group,
    screen: scr,
    get state() {
      return state
    },
    get busy() {
      return state === 'burning' || state === 'resetting'
    },
    act() {
      if (state === 'before') {
        state = 'burning'
        tt = 0
        return 'burn'
      }
      if (state === 'after') {
        state = 'resetting'
        tt = 0
        return 'again'
      }
      return false
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt, t, camera, renderer) {
      const f = flicker(t, 7)
      for (const g of gasFlames) {
        g.update(t)
        g.set(0.85 + f * 0.1)
      }
      gasLight.intensity = 1.2 + f * 0.3
      stage.rotation.y = Math.sin(t * 0.3) * 0.25
      let k = state === 'after' ? 1 : 0
      let aShow = state === 'before' ? 1 : 0
      let bShow = state === 'after' ? 1 : 0
      if (state === 'burning') {
        tt += dt
        // the old bonds shake and break, the atoms fly, the new bonds form, energy comes out
        const shake = smooth(0, 0.8, tt) * (1 - smooth(1.0, 1.3, tt))
        aShow = 1 - smooth(0.8, 1.2, tt)
        k = smooth(1.1, 2.6, tt)
        bShow = smooth(2.3, 2.9, tt)
        placeAtoms(k)
        for (const a of atoms) a.m.position.add(tmp.set(Math.sin(t * 40 + a.a.x * 9), Math.cos(t * 37 + a.a.y * 7), 0).multiplyScalar(0.02 * shake))
        const burst = smooth(2.0, 2.4, tt) * (1 - smooth(2.6, 3.6, tt))
        flash.material.opacity = burst
        flash.scale.setScalar(1.2 + burst * 1.4)
        flashLight.intensity = burst * 6
        if (tt > 2.1 && tt < 2.8) {
          for (let i = 0; i < 3; i++) {
            const d = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize()
            heat.spawn({ x: d.x * 0.1, y: d.y * 0.1, z: d.z * 0.1, vx: d.x * 1.4, vy: d.y * 1.4 + 0.4, vz: d.z * 1.4, life: 0.9, size: 0.035, r: 1.8, g: 1.2, b: 0.5 })
          }
        }
        if (tt > 3.6) state = 'after'
      } else if (state === 'resetting') {
        tt += dt
        // the products fade, the reactants come back
        const out = smooth(0, 0.6, tt)
        bShow = 1 - out
        for (const a of atoms) a.m.scale.setScalar(Math.max(0.001, out < 1 ? 1 - out : smooth(0.6, 1.2, tt)))
        if (tt > 0.6) {
          placeAtoms(0)
          aShow = smooth(0.8, 1.3, tt)
        } else placeAtoms(1)
        if (tt > 1.3) {
          state = 'before'
          for (const a of atoms) a.m.scale.setScalar(1)
        }
      } else placeAtoms(k)
      drawBonds(aShow, bShow)
      heat.step(dt, (p, d, kk) => {
        p.alpha = 1 - kk
        p.vy += d * 0.5
      }, camera, renderer)
    },
  }
}

// ---------------------------------------------------------------------------------------------------
const RUST_GLSL = /* glsl */ `
  ${NOISE_GLSL}
  uniform float uRust;
  uniform float uWaterY;
  varying vec3 vObj;
`

/** Iron that rusts as uRust goes from 0 to 1, most of all near the waterline (uWaterY, object space). */
function ironMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: '#8d939b', roughness: 0.32, metalness: 0.9 })
  const u = { uRust: { value: 0 }, uWaterY: { value: -9 } }
  m.userData.u = u
  m.onBeforeCompile = s => {
    Object.assign(s.uniforms, u)
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObj;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj = position;')
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>\n${RUST_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float rn = fbm3(vObj * 38.0, 4) * 0.5 + 0.5;
        float rn2 = snoise(vObj * 90.0) * 0.5 + 0.5;
        float wet = exp(-abs(vObj.y - uWaterY) * 22.0) * 0.35;
        float rustK = smoothstep(1.05 - uRust * 1.25, 1.12 - uRust * 1.25, rn + wet);
        vec3 rustCol = mix(vec3(0.33, 0.1, 0.03), vec3(0.62, 0.27, 0.08), rn2);
        diffuseColor.rgb = mix(diffuseColor.rgb, rustCol, rustK);`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.95, rustK);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.05, rustK);')
  }
  return m
}

/** A big iron nail, point down, `len` long. */
function nail(mat, len = 0.3) {
  const g = new THREE.Group()
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, len - 0.04, 14), mat)
  shaft.position.y = len / 2 + 0.02
  const point = new THREE.Mesh(new THREE.ConeGeometry(0.017, 0.045, 14), mat)
  point.rotation.x = Math.PI
  point.position.y = 0.02
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.01, 20), mat)
  head.position.y = len + 0.002
  g.add(shaft, point, head)
  g.traverse(o => o.isMesh && (o.castShadow = true))
  return g
}

/** The three tubes, three nails. Faces +z. */
export function rustTubes({ stoneMat, words, level, light }) {
  const group = new THREE.Group()
  group.add(stoneTable({ w: 1.6, stoneMat, lamp: !light }))
  const H = 0.95
  const wood = new THREE.MeshStandardMaterial({ color: '#8a5a32', roughness: 0.75 })
  const rack = new THREE.Group()
  const shelf = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.03, 0.18, 2, 0.01), wood)
  shelf.position.y = 0.3
  const base = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.03, 0.2, 2, 0.01), wood)
  base.position.y = 0.015
  rack.add(shelf, base)
  for (const x of [-0.48, 0.48]) {
    const s = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.32, 0.18, 2, 0.01), wood)
    s.position.set(x, 0.16, 0)
    rack.add(s)
  }
  rack.position.set(0, H, 0)
  rack.traverse(o => o.isMesh && (o.castShadow = true))
  group.add(rack)
  const tR = 0.065
  const tH = 0.56
  const tubeGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0, 0), new THREE.Vector2(tR * 0.6, 0.008), new THREE.Vector2(tR, 0.04), new THREE.Vector2(tR, tH - 0.01),
    new THREE.Vector2(tR + 0.008, tH), new THREE.Vector2(tR + 0.004, tH + 0.006),
  ], 32)
  const water = new THREE.MeshPhysicalMaterial({ color: '#9cc9e8', roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false })
  const rustyWater = new THREE.MeshPhysicalMaterial({ color: '#9cc9e8', roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false })
  const stopperMat = new THREE.MeshStandardMaterial({ color: '#7a1f1a', roughness: 0.6 })
  const stopperGeo = new THREE.CylinderGeometry(0.066, 0.056, 0.05, 20)
  const nails = []
  const kinds = [['wet', -0.3], ['dry', 0], ['airless', 0.3]]
  for (const [kind, x] of kinds) {
    const tube = new THREE.Group()
    tube.position.set(x, H + 0.035, 0)
    group.add(tube)
    const tb = new THREE.Mesh(tubeGeo, glass({ opacity: 0.05, edge: 0.45, side: THREE.BackSide }))
    const tf = new THREE.Mesh(tubeGeo, glass({ opacity: 0.06, edge: 0.75 }))
    tb.renderOrder = 6
    tf.renderOrder = 9
    tube.add(tb, tf)
    const iron = ironMaterial()
    const n = nail(iron, 0.34)
    n.position.y = kind === 'dry' ? 0.13 : 0.04
    n.rotation.z = kind === 'wet' ? 0.08 : kind === 'dry' ? -0.05 : 0.04
    tube.add(n)
    if (kind === 'wet') {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(tR * 0.93, tR * 0.93, 0.2, 24), rustyWater)
      w.position.y = 0.11
      w.renderOrder = 7
      tube.add(w)
      // the waterline (tube y 0.21) in the shaft's own frame: nail at 0.04, shaft centre 0.19 above it
      iron.userData.u.uWaterY.value = 0.21 - 0.04 - 0.19
    } else if (kind === 'dry') {
      // drying granules and a plug of cotton wool, and a stopper
      const gr = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.012, 0), new THREE.MeshStandardMaterial({ color: '#f2f2ee', roughness: 0.8 }), 40)
      const m4 = new THREE.Matrix4()
      const r = random(11)
      for (let i = 0; i < 40; i++) {
        const a = r() * Math.PI * 2
        const rr = Math.sqrt(r()) * (tR - 0.015)
        gr.setMatrixAt(i, m4.makeTranslation(Math.cos(a) * rr, 0.015 + r() * 0.06, Math.sin(a) * rr))
      }
      const wool = new THREE.Mesh(new THREE.SphereGeometry(tR * 0.9, 16, 10), new THREE.MeshStandardMaterial({ color: '#f7f4ee', roughness: 1 }))
      wool.scale.y = 0.45
      wool.position.y = 0.1
      const st = new THREE.Mesh(stopperGeo, stopperMat)
      st.position.y = tH + 0.01
      tube.add(gr, wool, st)
    } else {
      // boiled water to above the nail, a layer of oil on top, and a stopper
      const w = new THREE.Mesh(new THREE.CylinderGeometry(tR * 0.93, tR * 0.93, 0.42, 24), water)
      w.position.y = 0.22
      w.renderOrder = 7
      const oil = new THREE.Mesh(new THREE.CylinderGeometry(tR * 0.93, tR * 0.93, 0.035, 24), new THREE.MeshPhysicalMaterial({ color: '#e8b33a', roughness: 0.1, transparent: true, opacity: 0.75 }))
      oil.position.y = 0.45
      oil.renderOrder = 8
      const st = new THREE.Mesh(stopperGeo, stopperMat)
      st.position.y = tH + 0.01
      tube.add(w, oil, st)
    }
    const tag = label(words.tubes[kind], { size: 0.052, color: '#ffe2c4', maxWidth: 0.3 })
    tag.position.set(x, H + 0.16, 0.13)
    group.add(tag)
    nails.push({ kind, iron })
  }

  const scr = standingScreen(
    { width: 1.7, height: 1.1, color: AMBER, title: words.title, big: words.day(0), small: '', bigSize: 0.24, bigY: 0.1, smallY: -0.16, glow: 0.6 },
    { top: 1.55, tilt: 0.2, look: 'stone', standMat: stoneMat },
  )
  scr.group.position.set(1.45, 0, 0.35)
  scr.group.rotation.y = -0.5
  group.add(scr.group)
  const smallLine = () => (level() === 'scientist' ? words.screen.sci : words.screen.kid)
  scr.set({ small: smallLine() })

  let rust = 0
  let run = -1
  let target = 0
  const waterClear = new THREE.Color('#9cc9e8')
  const waterRust = new THREE.Color('#c27a3c')
  return {
    group,
    screen: scr,
    get rusted() {
      return target > 0
    },
    get busy() {
      return run >= 0
    },
    act() {
      if (run >= 0) return false
      if (target === 0) {
        target = 1
        run = 0
        return 'run'
      }
      target = 0
      rust = 0
      scr.set({ big: words.day(0) })
      return 'reset'
    },
    refresh() {
      scr.set({ small: smallLine() })
    },
    update(dt) {
      if (run >= 0) {
        run += dt
        rust = clamp(run / 8)
        const day = Math.min(7, Math.floor(run / (8 / 7)))
        scr.set({ big: words.day(day) })
        if (run >= 8.2) run = -1
      }
      for (const n of nails) {
        const r = n.kind === 'wet' ? rust : rust * 0.015
        n.iron.userData.u.uRust.value = r
      }
      rustyWater.color.copy(waterClear).lerp(waterRust, rust * 0.75)
      rustyWater.opacity = 0.35 + rust * 0.25
    },
  }
}
