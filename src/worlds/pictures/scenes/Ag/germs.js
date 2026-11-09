// Silver's picture "Can a metal fight germs?" as a room (docs/knowledge/picture-rooms.md): the picture made
// into a place, inside the Russian part of the International Space Station (stages/spacestation.js, made for
// this room): a white cylinder of racks and handrails, a porthole with the Earth turning below, velcro
// shoes on the floor and water drops floating about. Three stations and an old bottle, each step chosen by
// tapping its thing; the prompt names the next tap, E opens the station's panel, whose buttons and
// slider do the same:
// - the water machine, on the right (the picture's space station): tap the astronaut's breath (damp air
//   flows over cold plates, drops gather, the tank fills), the filters (the water runs through charcoal,
//   resin and a catalyst and turns clear), the silver cell (a dose of silver ions: tap again for the next
//   dose, or the slider, 0 to 0.2 mg/L), the heater (85 °C), the drinking bag (a ball of water floats out,
//   only when it was filtered, silvered and heated). A lens on the tank runs a week of germs in 16 seconds:
//   at 0.05 mg/L and above they stop (the lower end of the real dose, used as the room's model line);
// - the germ dish, in a glovebox on the left (the picture's Petri dish, 1.9 m across): four things to lay
//   on the jelly (a silver coin, a copper coin, a plastic button, a plaster with a silver pad), a lawn of
//   germs that grows with the hours (tap the dish, or the slider), clear rings round the metals and none
//   round the button; tap a ring or a thing and a lens shows the ions spreading and fewer with distance, the
//   ring ending where they are too few to stop the germs;
// - one germ at 1.5 million times its size, in a floating ball of water at the end (the picture's close-up):
//   a rod 2.8 m long with yellow sulfur in its skin, a protein machine turning beside each and a tail.
//   Tap a silver ion: it drifts in and grabs a sulfur, that machine jams; at four the germ stops dividing
//   (a counter), at three the skin leaks. At Scientist level a slider of silver in the water, 0 to 300 ug/L,
//   with the line at 50 where all machines jam;
// - Credé's old bottle on the shelf, between the window and the dish: tap it and the panel tells 1880.
// All four are shared in a room (src/net/shared.js). parts.<station>.tap(...) does what a tap does.
import * as THREE from 'three'
import { canvasTex, at, clamp, damp, random, num, standingScreen } from '../../../wings/noble/kit.js'
import { stationStage, STATION } from '../../stages/spacestation.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { GERMS_WORDS } from './germs.words.js'

export const WORDS = GERMS_WORDS

const TAU = Math.PI * 2
const smoothK = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const ease = v => smoothK(0, 1, v)
const GREEN = '#5fe08a'
const SULFUR = '#ffd23a'

// ---- station 1: the water machine, a cabinet in the right wall ----
const ZC = -3.0 // the machine's middle along the module
const MX = STATION.bank // its front plane (the racks' front)
const DOSES = [0.1, 0.2, 0.05, 0]
const SILVER_STOPS = 0.05 // mg/L: where germs stop in the model
const DAY_S = 2 // seconds a model day takes
// local x along the cabinet (world z = ZC + x, so the flow reads left to right for a visitor facing the wall), where each part stands
const LX = { duct: -2.1, cond: -1.2, tank: -0.4, filt: 0.65, ion: 1.55, heat: 2.2 }
// ---- station 2: the dish in its glovebox, on the left ----
const DISH = { x: -1.85, y: 1.85, z: -8.1, r: 0.95 }
const LEDGE = { x: -1.05, y: 0.82 }
const ITEMS = ['silver', 'copper', 'button', 'plaster']
const ITEM = {
  silver: { u: -0.36, v: 0.24, r: 0.2, half: 0, rMax: 0.28, slot: -1.05 },
  copper: { u: 0.4, v: 0.26, r: 0.2, half: 0, rMax: 0.24, slot: -0.35 },
  button: { u: 0.5, v: -0.5, r: 0.14, half: 0, rMax: 0, slot: 0.3 },
  plaster: { u: -0.2, v: -0.58, r: 0.11, half: 0.28, rMax: 0.14, slot: 0.95 },
}
const HOURS_MAX = 24
const growth = h => smoothK(0, 15, h)
const ringFor = (id, h) => ITEM[id].rMax * Math.sqrt(clamp(h / 16)) * smoothK(0.5, 3, h)
// ---- station 3: one germ in a ball of water ----
const BALL = { x: 0, y: 1.9, z: -14.6, r: 1.7 }
const MACH = [
  [-0.8, 0.2], [-0.5, -0.6], [-0.25, 0.5], [0.0, -0.2], [0.3, 0.7], [0.55, -0.5], [0.8, 0.1],
] // along the rod (-1..1), angle round it (rad, 0 = toward the visitor)
const ROD = { half: 0.95, r: 0.55 }
const LINE_UG = 50
const bindFromS = s => (s >= LINE_UG ? 7 : Math.floor((3.99 * s) / LINE_UG))
// ---- the old bottle ----
const BOTTLE = { x: 1.78, y: 1.35, z: -7.0 }

export async function build({ ctx, root, lang, E, ex, say, light, level, color, clickable }) {
  const stage = stationStage({ light, gaps: { left: [[-3.5, -1.1], [-9.9, -6.3]], right: [[-5.9, -0.1]] } })
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
  const glassMat = (c = '#d8eef4', op = 0.2) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.06, metalness: 0.1, transparent: true, opacity: op, depthWrite: false })
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
  const tag = (text, x, y, z, rotY, size = 0.1, c = '#e8ecf6', o = {}, parent = root) => {
    const t = makeText(text, { size, color: c, anchorY: 'middle', outlineWidth: size * 0.08, outlineColor: '#141826', ...o })
    t.position.set(x, y, z)
    t.rotation.y = rotY
    parent.add(t)
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
  const TAGC = '#e8ecf6'
  // an Ag+ ball as the pictures draw it: a grey shaded ball with a white plus on it
  const ionTex = canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w * 0.38, w * 0.32, w * 0.04, w / 2, w / 2, w * 0.46)
    grd.addColorStop(0, '#f4f6fa')
    grd.addColorStop(0.5, '#b4bcc8')
    grd.addColorStop(1, '#6a7280')
    g.fillStyle = grd
    g.beginPath()
    g.arc(w / 2, w / 2, w * 0.46, 0, TAU)
    g.fill()
    g.strokeStyle = '#ffffff'
    g.lineWidth = w * 0.09
    g.lineCap = 'round'
    g.beginPath()
    g.moveTo(w / 2, w * 0.28)
    g.lineTo(w / 2, w * 0.72)
    g.moveTo(w * 0.28, w / 2)
    g.lineTo(w * 0.72, w / 2)
    g.stroke()
  })
  disposers.push(ionTex)
  const ionSprite = (size, op = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: ionTex, transparent: true, opacity: op, depthWrite: false }))
    s.scale.setScalar(size)
    return s
  }
  const dotPoints = (n, c, size, op = 0.8) => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(n * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const p = new THREE.Points(geo, new THREE.PointsMaterial({ color: c, size, map: glowTex, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending }))
    p.frustumCulled = false
    p.raycast = () => {}
    return { points: p, pos, geo }
  }

  // ================= station 1: the water machine =================
  const S1 = { tank: 0, clean: 0, silver: 0, hot: 0, bag: 0 }
  const live1 = { level: 0, cleanK: 0, hotK: 0, bagK: 0, puff: 0, airK: 0, filtK: 0, heatK: 0, silverK: 0, flowK: 0, temp: 20, day: 0, dayT: 0, mine: 0 }
  const mach = new THREE.Group()
  mach.position.set(MX + 0.0, 0, ZC)
  mach.rotation.y = -Math.PI / 2
  root.add(mach)
  const ml = (geo, mat, x, y, z) => mk(geo, mat, x, y, z, mach)
  // the cabinet, open at the front: a navy back, white top, bottom and ends
  ml(new THREE.BoxGeometry(5.6, 2.2, 0.05), mats.navy, 0, 1.1, -0.68)
  ml(new THREE.BoxGeometry(5.6, 0.06, 0.78), mats.white, 0, 2.2, -0.31)
  ml(new THREE.BoxGeometry(5.6, 0.08, 0.78), mats.white, 0, 0.04, -0.31)
  for (const s of [-1, 1]) ml(new THREE.BoxGeometry(0.06, 2.2, 0.78), mats.white, s * 2.8, 1.1, -0.31)
  ml(new THREE.BoxGeometry(5.6, 0.12, 0.05), mats.yellow, 0, 2.12, 0.07)
  // the panel taken off, leaning against the rack beyond the end
  {
    const panel = ml(new THREE.BoxGeometry(0.7, 1.9, 0.05), mats.white, -3.05, 1.0, 0.25)
    panel.rotation.y = -1.15
    ml(new THREE.BoxGeometry(0.5, 0.3, 0.02), mats.dark, -3.05, 1.2, 0.29).rotation.y = -1.15
  }
  solids.push(box(MX + 0.3, ZC, 0.9, 5.7))
  // pipes: a loop along the top and the bottom of the cabinet, with a few steel fittings
  const loop = [new THREE.Vector3(LX.tank, 2.0, -0.52), new THREE.Vector3(2.35, 2.0, -0.52), new THREE.Vector3(2.35, 0.42, -0.52), new THREE.Vector3(LX.tank, 0.42, -0.52)]
  const pipe = (a, b, r = 0.045, mat = mats.steel) => {
    const m = ml(new THREE.CylinderGeometry(r, r, 1, 10), mat, 0, 0, 0)
    m.position.copy(a).add(b).multiplyScalar(0.5)
    m.scale.y = a.distanceTo(b)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
    return m
  }
  for (let i = 0; i < 3; i++) pipe(loop[i], loop[i + 1])
  pipe(loop[3], new THREE.Vector3(LX.tank, 0.42, -0.2))
  for (const x of [LX.filt, LX.ion, LX.heat, LX.tank]) pipe(new THREE.Vector3(x, 2.0, -0.52), new THREE.Vector3(x, 1.85, -0.45))
  for (const x of [0.2, 1.1, 1.9]) ml(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 12), mats.brass, x, 2.0, -0.52).rotation.x = Math.PI / 2
  // -- the duct and the astronaut's breath --
  ml(new THREE.CircleGeometry(0.32, 28), mats.dark, LX.duct, 1.55, -0.64)
  ml(new THREE.TorusGeometry(0.32, 0.04, 8, 28), mats.grey, LX.duct, 1.55, -0.63)
  for (let i = -2; i <= 2; i++) ml(new THREE.BoxGeometry(0.56, 0.025, 0.03), mats.steel, LX.duct, 1.55 + i * 0.1, -0.6)
  const ductCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(LX.duct, 1.9, -0.5), new THREE.Vector3(LX.duct + 0.1, 2.0, -0.4), new THREE.Vector3(-1.75, 2.05, -0.32), new THREE.Vector3(LX.cond - 0.3, 2.0, -0.32), new THREE.Vector3(LX.cond, 1.9, -0.4)])
  ml(new THREE.TubeGeometry(ductCurve, 24, 0.065, 10), mats.grey, 0, 0, 0)
  ml(new THREE.CylinderGeometry(0.065, 0.065, 0.35, 10), mats.grey, LX.duct, 1.72, -0.55)
  const breathG = new THREE.Group()
  breathG.position.set(LX.duct + 0.35, 1.5, 0.45)
  mach.add(breathG)
  const puffs = []
  for (let i = 0; i < 7; i++) {
    const s = sprite(i % 2 ? '#cfe6ff' : '#ffffff', 0.5 + (i % 3) * 0.14, 0.5)
    s.position.set((i - 3) * 0.09, Math.sin(i * 1.7) * 0.12, Math.cos(i) * 0.1)
    breathG.add(s)
    puffs.push({ s, home: s.position.clone(), ph: i * 0.9 })
  }
  tag(E.water.tags.breath, LX.duct + 0.35, 0.95, 0.45, 0, 0.12, '#cfe6ff', {}, mach)
  const breathHit = hit(0.9, 0.9, 0.9, LX.duct + 0.35, 1.5, 0.45, mach)
  // the moist air in the duct and the condenser
  const air = dotPoints(40, '#d6ecff', 0.1, 0.8)
  mach.add(air.points)
  // -- the cold plates --
  ml(new THREE.BoxGeometry(0.95, 1.4, 0.44), glassMat('#7aa6d6', 0.12), LX.cond, 1.2, -0.4)
  const plateMat = M('#9fd4ff', { emissive: '#4a8fd0', emissiveIntensity: 0.4, metalness: 0.4, roughness: 0.3 })
  for (let i = 0; i < 6; i++) ml(new THREE.BoxGeometry(0.82, 0.035, 0.34), plateMat, LX.cond, 0.65 + i * 0.19, -0.4)
  const frost = sprite('#8fd0ff', 1.6, 0.0)
  frost.position.set(LX.cond, 1.2, -0.15)
  mach.add(frost)
  const NDROP = 24
  const dropGeo = new THREE.SphereGeometry(1, 8, 6)
  const drops = new THREE.InstancedMesh(dropGeo, M('#d8f0ff', { transparent: true, opacity: 0.75, roughness: 0.05 }), NDROP)
  drops.frustumCulled = false
  drops.raycast = () => {}
  mach.add(drops)
  const dropSeed = Array.from({ length: NDROP }, (_, i) => ({ y: 0.7 + (i % 6) * 0.19, x: LX.cond + ((i * 0.37) % 1 - 0.5) * 0.7, z: -0.4 + (((i * 0.61) % 1) - 0.5) * 0.28, ph: (i * 0.173) % 1 }))
  pipe(new THREE.Vector3(LX.cond, 0.5, -0.4), new THREE.Vector3(LX.tank - 0.1, 0.5, -0.4), 0.04)
  tag(E.water.tags.condenser, LX.cond, 0.2, -0.4, 0, 0.1, TAGC, {}, mach)
  // -- the tank --
  const TANK = { r: 0.36, y0: 0.55, h: 1.3 }
  ml(new THREE.CylinderGeometry(TANK.r + 0.04, TANK.r + 0.06, 0.07, 28), mats.steel, LX.tank, TANK.y0 - 0.03, -0.35)
  ml(new THREE.CylinderGeometry(TANK.r + 0.04, TANK.r + 0.04, 0.07, 28), mats.steel, LX.tank, TANK.y0 + TANK.h + 0.03, -0.35)
  const tankGlass = ml(new THREE.CylinderGeometry(TANK.r, TANK.r, TANK.h, 28, 1, true), glassMat('#e4f2ff', 0.16), LX.tank, TANK.y0 + TANK.h / 2, -0.35)
  tankGlass.renderOrder = 3
  const waterMat = new THREE.MeshStandardMaterial({ color: '#8c7b52', roughness: 0.2, transparent: true, opacity: 0.8, emissive: '#000000', depthWrite: false })
  const water = ml(new THREE.CylinderGeometry(TANK.r - 0.02, TANK.r - 0.02, 1, 28), waterMat, LX.tank, TANK.y0, -0.35)
  water.renderOrder = 2
  const specks = dotPoints(34, '#3a2e18', 0.06, 0.9)
  specks.points.material.blending = THREE.NormalBlending
  mach.add(specks.points)
  const speckSeed = Array.from({ length: 34 }, (_, i) => ({ a: i * 2.4, r: 0.1 + ((i * 0.37) % 1) * 0.2, y: ((i * 0.618) % 1), sp: 0.2 + (i % 5) * 0.08 }))
  const ags = dotPoints(30, '#ffffff', 0.05, 0.9)
  mach.add(ags.points)
  const agSeed = Array.from({ length: 30 }, (_, i) => ({ a: i * 1.9, r: 0.05 + ((i * 0.41) % 1) * 0.25, y: ((i * 0.713) % 1), sp: 0.3 + (i % 4) * 0.1 }))
  const tankGlow = sprite('#ffb060', 1.3, 0)
  tankGlow.position.set(LX.tank, TANK.y0 + 0.65, -0.1)
  mach.add(tankGlow)
  tag(E.water.tags.tank, LX.tank, 0.2, -0.3, 0, 0.1, TAGC, {}, mach)
  const tankHit = hit(0.9, 1.5, 0.9, LX.tank, 1.2, -0.2, mach)
  // -- the lens on the tank: a week of germs --
  const lensG = new THREE.Group()
  lensG.position.set(LX.tank, 2.55, 0.5)
  mach.add(lensG)
  const lensRim = mk(new THREE.TorusGeometry(0.46, 0.04, 10, 40), M(GREEN, { emissive: GREEN, emissiveIntensity: 0.9 }), 0, 0, 0, lensG)
  void lensRim
  const lensTex = canvasTex(512, 512, null)
  disposers.push(lensTex)
  mk(new THREE.CircleGeometry(0.45, 40), new THREE.MeshBasicMaterial({ map: lensTex, toneMapped: false }), 0, 0, 0.005, lensG)
  mk(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8), mats.steel, 0, -0.62, -0.2, lensG)
  tag(E.water.tags.lens, 0, 0.62, 0.02, 0, 0.09, GREEN, {}, lensG)
  const lensHit = hit(1.0, 1.0, 0.3, 0, 0, 0.1, lensG)
  let lensKey = ''
  const rods = Array.from({ length: 60 }, (_, i) => ({ x: (random(5 + i)() - 0.5) * 0.8, y: (random(91 + i * 3)() - 0.5) * 0.7, a: random(17 + i)() * Math.PI }))
  function drawLens(lv) {
    const growing = live1.level > 0.25 && S1.silver < SILVER_STOPS
    const stopped = live1.level > 0.25 && S1.silver >= SILVER_STOPS
    const d = Math.min(7, Math.floor(live1.day))
    const key = [lv, growing ? 1 : stopped ? 2 : 0, d, Math.round(S1.silver * 100), live1.level > 0.25 ? 1 : 0].join('|')
    if (key === lensKey) return
    lensKey = key
    const L = E.water.lens
    lensTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.fillStyle = '#0b2418'
      g.beginPath()
      g.arc(w / 2, h / 2, w / 2, 0, TAU)
      g.fill()
      g.save()
      g.beginPath()
      g.arc(w / 2, h / 2, w / 2 - 4, 0, TAU)
      g.clip()
      if (growing || stopped) {
        const n = stopped ? 3 : Math.min(60, 3 * 2 ** d)
        for (let i = 0; i < n; i++) {
          const r = rods[i]
          g.save()
          g.translate(w / 2 + r.x * w * 0.9, h / 2 + r.y * h * 0.8 - 12)
          g.rotate(r.a)
          g.fillStyle = '#5fe08a'
          g.beginPath()
          g.roundRect(-15, -7, 30, 14, 7)
          g.fill()
          g.fillStyle = SULFUR
          g.beginPath()
          g.arc(-9, -7, 3.2, 0, TAU)
          g.arc(10, 6, 3.2, 0, TAU)
          g.fill()
          g.restore()
        }
        if (S1.silver > 0) {
          for (let i = 0; i < 14; i++) {
            const r = rods[(i * 4) % 60]
            const px = w / 2 + r.y * w * 0.9
            const py = h / 2 + r.x * h * 0.8 - 12
            g.fillStyle = '#c4ccd8'
            g.beginPath()
            g.arc(px, py, 7, 0, TAU)
            g.fill()
            g.strokeStyle = '#fff'
            g.lineWidth = 2
            g.beginPath()
            g.moveTo(px - 4, py)
            g.lineTo(px + 4, py)
            g.moveTo(px, py - 4)
            g.lineTo(px, py + 4)
            g.stroke()
          }
        }
        g.fillStyle = 'rgba(0,0,0,0.45)'
        g.fillRect(0, h - 190, w, 190)
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillStyle = '#ffffff'
        g.font = '700 52px Outfit, sans-serif'
        g.fillText(`${L.day} ${d}   x${2 ** (stopped ? 0 : d)}`, w / 2, h - 150)
        g.fillStyle = stopped ? '#7dff9a' : '#ffa070'
        g.font = '700 44px Outfit, sans-serif'
        g.fillText(stopped ? L.stopped : L.growing, w / 2, h - 96)
      } else {
        g.fillStyle = '#4c7a5e'
        g.font = '700 120px Outfit, sans-serif'
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillText('?', w / 2, h / 2)
      }
      g.restore()
    })
  }
  // -- the filters --
  const FILT = [
    { x: LX.filt - 0.3, c: '#26272c' },
    { x: LX.filt, c: '#e7c06a' },
    { x: LX.filt + 0.3, c: '#7a5a3a' },
  ]
  for (const f of FILT) {
    ml(new THREE.CylinderGeometry(0.13, 0.13, 1.1, 18, 1, true), glassMat('#e6f0f8', 0.2), f.x, 1.15, -0.4).renderOrder = 3
    ml(new THREE.CylinderGeometry(0.115, 0.115, 0.85, 18), M(f.c, { roughness: 0.9 }), f.x, 1.1, -0.4)
    for (const y of [0.6, 1.7]) ml(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 18), mats.steel, f.x, y, -0.4)
  }
  const fl = dotPoints(9, '#bfe4ff', 0.09, 0.9)
  mach.add(fl.points)
  tag(E.water.tags.filters, LX.filt, 0.2, -0.4, 0, 0.1, TAGC, {}, mach)
  const filtHit = hit(1.1, 1.3, 0.6, LX.filt, 1.15, -0.2, mach)
  // -- the silver cell --
  ml(new THREE.BoxGeometry(0.66, 0.78, 0.4), glassMat('#d4e8f8', 0.2), LX.ion, 1.25, -0.38).renderOrder = 3
  for (const dx of [-0.2, 0.2]) ml(new THREE.BoxGeometry(0.035, 0.6, 0.26), mats.silver, LX.ion + dx, 1.25, -0.38)
  ml(new THREE.BoxGeometry(0.76, 0.06, 0.46), mats.steel, LX.ion, 0.84, -0.38)
  ml(new THREE.BoxGeometry(0.76, 0.06, 0.46), mats.steel, LX.ion, 1.66, -0.38)
  const led = ml(new THREE.SphereGeometry(0.04, 12, 8), M('#2a3a2c', { emissive: '#7dff9a', emissiveIntensity: 0 }), LX.ion + 0.3, 1.78, -0.1)
  const cellIons = Array.from({ length: 6 }, (_, i) => {
    const s = ionSprite(0.13, 0)
    s.position.set(LX.ion, 1.25, -0.38)
    mach.add(s)
    return { s, ph: i / 6 }
  })
  const readout = makeText('0.00 mg/L', { size: 0.13, color: '#ffffff', anchorY: 'middle', outlineWidth: 0.012, outlineColor: '#141826' })
  readout.position.set(LX.ion, 0.66, 0.0)
  mach.add(readout)
  tag(E.water.tags.ionizer, LX.ion, 0.2, -0.4, 0, 0.1, TAGC, {}, mach)
  const ionHit = hit(0.9, 1.1, 0.6, LX.ion, 1.3, -0.2, mach)
  // -- the heater and the drinking bag --
  ml(new THREE.CylinderGeometry(0.27, 0.27, 0.95, 24), mats.steel, LX.heat, 1.4, -0.38)
  ml(new THREE.CylinderGeometry(0.29, 0.29, 0.06, 24), mats.dark, LX.heat, 0.9, -0.38)
  ml(new THREE.CylinderGeometry(0.29, 0.29, 0.06, 24), mats.dark, LX.heat, 1.9, -0.38)
  const coilMat = M('#ff6a2a', { emissive: '#ff5a1a', emissiveIntensity: 0, roughness: 0.4 })
  for (let i = 0; i < 5; i++) ml(new THREE.TorusGeometry(0.275, 0.022, 8, 28), coilMat, LX.heat, 1.1 + i * 0.16, -0.38).rotation.x = Math.PI / 2
  const heatGlow = sprite('#ff8a3a', 1.2, 0)
  heatGlow.position.set(LX.heat, 1.4, -0.05)
  mach.add(heatGlow)
  const tempTx = makeText('20 °C', { size: 0.16, color: '#ffd8b0', anchorY: 'middle', outlineWidth: 0.014, outlineColor: '#141826' })
  tempTx.position.set(LX.heat, 1.42, -0.04)
  mach.add(tempTx)
    const heatHit = hit(0.7, 1.3, 0.6, LX.heat, 1.4, -0.2, mach)
  const bagG = new THREE.Group()
  bagG.position.set(LX.heat + 0.05, 0.55, -0.15)
  mach.add(bagG)
  const bagBody = mk(new THREE.SphereGeometry(1, 20, 14), M('#f0f4fa', { transparent: true, opacity: 0.6, roughness: 0.2 }), 0, 0, 0, bagG)
  bagBody.scale.set(0.3, 0.26, 0.16)
  const bagWater = mk(new THREE.SphereGeometry(1, 16, 12), M('#9fd8ff', { transparent: true, opacity: 0.8 }), 0, -0.04, 0, bagG)
  bagWater.scale.set(0.24, 0.19, 0.11)
  mk(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 10), mats.brass, 0, 0.3, 0, bagG)
  tag(E.water.tags.bag, LX.heat, 0.2, -0.3, 0, 0.1, TAGC, {}, mach)
  const bagHit = hit(0.8, 0.7, 0.5, LX.heat, 0.58, 0.0, mach)
  // the ball of water that floats out of the bag: it drifts on into the module
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 18), M('#bfe6ff', { transparent: true, opacity: 0.55, roughness: 0.04, depthWrite: false }))
  ball.visible = false
  mach.add(ball)
  // the flow along the pipes, one glint at a time round the loop
  const flow = dotPoints(26, '#bfe4ff', 0.1, 0.9)
  mach.add(flow.points)
  const loopLen = [loop[0].distanceTo(loop[1]), loop[1].distanceTo(loop[2]), loop[2].distanceTo(loop[3])]
  const loopTotal = loopLen[0] + loopLen[1] + loopLen[2]
  const onLoop = (s, out) => {
    let d = (s % 1) * loopTotal
    for (let i = 0; i < 3; i++) {
      if (d <= loopLen[i]) return out.lerpVectors(loop[i], loop[i + 1], d / loopLen[i])
      d -= loopLen[i]
    }
    return out.copy(loop[3])
  }

  const levelOf = () => live1.level
  const ready = () => S1.clean && S1.silver >= SILVER_STOPS - 1e-6 && S1.hot
  const wHint = () => {
    const h = E.water.hints
    if (!S1.tank) return h.breath
    if (S1.bag) return h.done
    if (levelOf() < 0.97) return h.fill
    if (!S1.clean) return h.filter
    if (S1.silver < SILVER_STOPS - 1e-6) return h.silver
    if (!S1.hot) return h.heat
    return h.bag
  }
  const silverLine = lv => {
    const s = E.water.says
    const v = S1.silver
    return at(v < 0.005 ? s.silver0 : v < SILVER_STOPS - 1e-6 ? s.silverLow : v >= 0.195 ? s.silverMax : s.silverOk, lv)
  }
  function waterStep(what, arg) {
    const lv = level()
    const says = E.water.says
    live1.mine = 8
    if (what === 'breath') {
      live1.puff = 1
      play('select')
      if (!S1.tank) {
        S1.tank = 1
        tell(at(says.breath, lv))
      } else tell(levelOf() < 0.97 ? at(says.breath, lv) : at(says.filled, lv))
    } else if (what === 'tank' || what === 'look') {
      play('tap')
      if (levelOf() < 0.25) tell(at(says.lookEmpty, lv))
      else tell(at(S1.silver >= SILVER_STOPS - 1e-6 ? says.lookStopped : says.lookGrowing, lv))
    } else if (['filter', 'silver', 'dose', 'heat', 'bag'].includes(what) && !S1.tank) {
      play('wrong')
      tell(at(says.noWater, lv))
      return
    } else if (what === 'filter') {
      if (!S1.clean) live1.filtK = 3.6
      S1.clean = 1
      play('fizz')
      tell(at(says.filter, lv))
    } else if (what === 'silver' || what === 'dose') {
      if (what === 'dose') S1.silver = clamp(Math.round(Number(arg) * 100) / 100, 0, 0.2)
      else {
        const i = DOSES.findIndex(d => Math.abs(d - S1.silver) < 0.006)
        S1.silver = DOSES[(i + 1) % DOSES.length]
      }
      play('join')
      tell(silverLine(lv))
    } else if (what === 'heat') {
      if (!S1.hot) live1.heatK = 3.2
      S1.hot = 1
      play('fizz')
      tell(at(says.heat, lv))
    } else if (what === 'bag') {
      if (!ready()) {
        play('wrong')
        tell(at(says.notYet, lv))
        return
      }
      if (!S1.bag) live1.bagK = 0.001
      S1.bag = 1
      play('discover')
      tell(at(says.bag, lv))
    } else if (what === 'reset') {
      Object.assign(S1, { tank: 0, clean: 0, silver: 0, hot: 0, bag: 0 })
      Object.assign(live1, { level: 0, cleanK: 0, hotK: 0, bagK: 0, temp: 20, silverK: 0 })
      play('part')
      tell(at(says.reset, lv))
    } else return
    refresh(E.water.title, waterPanel)
    if (what !== 'tank' && what !== 'look') ex.discover('water', waterPanel, 4.2)
    share('water')
  }
  const waterPanel = lv => {
    const V = E.water.vals
    return {
      title: E.water.title,
      color,
      blocks: [
        { slider: { label: E.water.slider, min: 0, max: 0.2, step: 0.01, value: S1.silver, onInput: v => waterStep('dose', v), format: v => `${num(v, 2, lang)} mg/L`, live: () => S1.silver } },
        {
          buttons: [
            { label: E.water.buttons.breath, onClick: () => waterStep('breath') },
            { label: E.water.buttons.filter, onClick: () => waterStep('filter') },
            { label: E.water.buttons.silver, onClick: () => waterStep('silver') },
            { label: E.water.buttons.heat, onClick: () => waterStep('heat') },
            { label: E.water.buttons.bag, onClick: () => waterStep('bag') },
            { label: E.water.buttons.reset, onClick: () => waterStep('reset') },
          ],
        },
        {
          rows: [
            [E.water.rows.tank, S1.tank ? (levelOf() > 0.97 ? V.full : `${Math.round(levelOf() * 100)} %`) : V.empty],
            [E.water.rows.clean, S1.clean ? V.yes : V.no],
            [E.water.rows.silver, `${num(S1.silver, 2, lang)} mg/L`],
            [E.water.rows.hot, S1.hot ? V.yes : V.no],
          ],
        },
        ...E.water.panel[depthOf(lv)].map(p => ({ p })),
      ],
    }
  }
  clickable(breathHit, () => waterStep('breath'), { reach: 6 })
  clickable(filtHit, () => waterStep('filter'), { reach: 6 })
  clickable(ionHit, () => waterStep('silver'), { reach: 6 })
  clickable(heatHit, () => waterStep('heat'), { reach: 6 })
  clickable(bagHit, () => waterStep('bag'), { reach: 6 })
  clickable(tankHit, () => waterStep('tank'), { reach: 6 })
  clickable(lensHit, () => waterStep('look'), { reach: 6.5 })
  const waterItem = ex.add({
    id: 'water',
    x: -0.4,
    z: ZC,
    radius: 2.3,
    manual: true,
    label: E.water.label,
    verb: wHint,
    focus: { x: MX + 0.3, y: 1.45, z: ZC, size: 3.6, width: 6.2 },
    act: () => ctx.showPanel(waterPanel),
  })
  focusBy(waterItem, waterItem.focus, { x: MX + 0.3, y: 1.5, z: ZC, size: 3.3, width: 5.6 })

  // ================= station 2: the germ dish in its glovebox =================
  const S2 = { hours: 0, items: { silver: 0, copper: 0, button: 0, plaster: 0 } }
  const live2 = { h: 0, k: { silver: 0, copper: 0, button: 0, plaster: 0 }, lens: null, lensK: 0, lensSeen: false, said: false, mine: 0 }
  // the counter, the hood, the shelf of things
  mk(new THREE.BoxGeometry(1.0, 0.8, 3.6), mats.white, -1.55, 0.4, DISH.z)
  mk(new THREE.BoxGeometry(0.5, 0.05, 3.6), mats.steel, -0.8, 0.775, DISH.z)
  solids.push(box(-1.3, DISH.z, 1.5, 3.6))
  mk(new THREE.BoxGeometry(0.06, 2.1, 3.5), mats.navy, -2.0, 1.85, DISH.z)
  for (const s of [-1, 1]) {
    mk(new THREE.BoxGeometry(0.75, 2.1, 0.07), mats.white, -1.65, 1.85, DISH.z + s * 1.75)
  }
  mk(new THREE.BoxGeometry(0.75, 0.08, 3.6), mats.white, -1.65, 2.93, DISH.z)
  mk(new THREE.BoxGeometry(0.05, 0.1, 3.5), mats.yellow, -1.3, 2.9, DISH.z)
  const dishG = new THREE.Group()
  dishG.position.set(DISH.x, DISH.y, DISH.z)
  dishG.rotation.y = Math.PI / 2
  root.add(dishG)
  // the dish: a glass wall, the golden jelly, a ring of rim
  const R = DISH.r
  mk(new THREE.CylinderGeometry(R + 0.07, R + 0.07, 0.2, 64, 1, true), glassMat('#bfe8e0', 0.28), 0, 0, 0, dishG).rotation.x = Math.PI / 2
  mk(new THREE.TorusGeometry(R + 0.07, 0.03, 10, 64), M('#a8d8d0', { transparent: true, opacity: 0.8 }), 0, 0, 0.1, dishG)
  mk(new THREE.CircleGeometry(R + 0.07, 64), glassMat('#bfe8e0', 0.5), 0, 0, -0.1, dishG).rotation.y = Math.PI
  const jellyMat = M('#c79a38', { roughness: 0.35, emissive: '#6b4a10', emissiveIntensity: 0.3 })
  const jelly = mk(new THREE.CylinderGeometry(R, R, 0.16, 64), jellyMat, 0, 0, 0.0, dishG)
  jelly.rotation.x = Math.PI / 2
  const jellyHit = mk(new THREE.CircleGeometry(R, 40), ghost, 0, 0, 0.11, dishG)
  // the lawn of colonies
  const NCOL = light ? 1300 : 2700
  const colGeo = new THREE.SphereGeometry(1, 10, 7)
  const colMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55, emissive: '#6b5a20', emissiveIntensity: 0.12 })
  const colonies = new THREE.InstancedMesh(colGeo, colMat, NCOL)
  colonies.frustumCulled = false
  colonies.raycast = () => {}
  dishG.add(colonies)
  const col = []
  {
    const rnd = random(1880)
    const c = new THREE.Color()
    const tints = ['#e9d48c', '#d6ae52', '#efe0a4', '#c99a3e']
    for (let i = 0; i < NCOL; i++) {
      const a = rnd() * TAU
      const r = Math.sqrt(rnd()) * (R - 0.05)
      col.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, s: 0.015 + rnd() * 0.022, ph: rnd() })
      colonies.setColorAt(i, c.set(tints[Math.floor(rnd() * 4)]))
    }
    colonies.instanceColor.needsUpdate = true
  }
  const colDummy = new THREE.Object3D()
  let colKey = ''
  // each thing on the jelly stands in a slot on the shelf and goes there when tapped
  const slotZ = id => DISH.z - ITEM[id].slot // the visitor's right is -z
  const matCopper = M('#d8843a', { metalness: 0.85, roughness: 0.3, emissive: '#5a2a0a', emissiveIntensity: 0.25 })
  // a coin's face: a rim and a shield, as on the picture's coin
  const coinTex = (base, ink) => {
    const t = canvasTex(256, 256, (g, w) => {
      g.fillStyle = base
      g.fillRect(0, 0, w, w)
      g.strokeStyle = ink
      g.lineWidth = 9
      g.beginPath()
      g.arc(w / 2, w / 2, w * 0.43, 0, TAU)
      g.stroke()
      g.lineWidth = 6
      g.beginPath()
      g.moveTo(w * 0.34, w * 0.3)
      g.lineTo(w * 0.66, w * 0.3)
      g.lineTo(w * 0.66, w * 0.55)
      g.quadraticCurveTo(w * 0.66, w * 0.72, w / 2, w * 0.78)
      g.quadraticCurveTo(w * 0.34, w * 0.72, w * 0.34, w * 0.55)
      g.closePath()
      g.stroke()
    })
    disposers.push(t)
    return t
  }
  const silverFace = new THREE.MeshMatcapMaterial({ matcap: mats.silver.matcap, map: coinTex('#ffffff', '#8c94a4'), color: '#f2f3f6' })
  const copperFace = new THREE.MeshStandardMaterial({ map: coinTex('#e9a064', '#8a4a1c'), metalness: 0.55, roughness: 0.4, emissive: '#5a2a0a', emissiveIntensity: 0.2 })
  const itemMesh = {}
  const mkItem = id => {
    const g = new THREE.Group()
    const it = ITEM[id]
    if (id === 'silver' || id === 'copper') {
      const face = id === 'silver' ? silverFace : copperFace
      mk(new THREE.CylinderGeometry(it.r, it.r, 0.04, 40), [id === 'silver' ? mats.silver : matCopper, face, face], 0, 0, 0, g)
    } else if (id === 'button') {
      mk(new THREE.CylinderGeometry(it.r, it.r, 0.04, 36), M('#2f6fd0', { roughness: 0.35 }), 0, 0, 0, g)
      for (const [x, z] of [[-0.04, -0.04], [0.04, -0.04], [-0.04, 0.04], [0.04, 0.04]]) mk(new THREE.CylinderGeometry(0.014, 0.014, 0.05, 10), M('#10204a'), x, 0, z, g)
    } else {
      const s = new THREE.Shape()
      const hx = it.half + it.r
      const hy = it.r
      s.moveTo(-hx + hy, -hy)
      s.lineTo(hx - hy, -hy)
      s.absarc(hx - hy, 0, hy, -Math.PI / 2, Math.PI / 2, false)
      s.lineTo(-hx + hy, hy)
      s.absarc(-hx + hy, 0, hy, Math.PI / 2, (3 * Math.PI) / 2, false)
      const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false }), M('#e6b49a', { roughness: 0.7 }))
      body.rotation.x = Math.PI / 2
      body.position.y = 0.015
      g.add(body)
      const pad = mk(new THREE.BoxGeometry(it.half * 1.3, 0.036, it.r * 1.05), mats.silver, 0, 0, 0, g)
      void pad
      for (let i = -3; i <= 3; i++) for (const dz of [-0.07, 0.07]) if (Math.abs(i * 0.08) > it.half * 0.75) mk(new THREE.CylinderGeometry(0.01, 0.01, 0.035, 6), M('#b8826a'), i * 0.08, 0, dz, g)
    }
    root.add(g)
    return g
  }
  const slotLabel = {}
  for (const id of ITEMS) {
    itemMesh[id] = mkItem(id)
    const z = slotZ(id)
    // a ring on the shelf where it belongs
    mk(new THREE.TorusGeometry(ITEM[id].r + ITEM[id].half + 0.04, 0.01, 6, 36), M('#8d95a3'), LEDGE.x, LEDGE.y + 0.01, z).rotation.x = Math.PI / 2
    slotLabel[id] = tag(E.dish.tags[id], LEDGE.x + 0.22, 1.08, z, Math.PI / 2, 0.075, TAGC)
    const h = hit(0.6, 0.5, ITEM[id].r * 2 + ITEM[id].half * 2 + 0.2, LEDGE.x, LEDGE.y + 0.2, z)
    clickable(h, () => dishStep(id), { reach: 5.5, when: () => !S2.items[id] })
  }
  // the thing's own ring-hit, for taps once it is on the jelly: the ion lens
  const ringHits = {}
  const dashN = 40
  const rings = {}
  const dashGeo = new THREE.BoxGeometry(0.06, 0.016, 0.016)
  const dashMat = new THREE.MeshBasicMaterial({ color: '#7dffa0', toneMapped: false })
  for (const id of ['silver', 'copper', 'plaster']) {
    const im = new THREE.InstancedMesh(dashGeo, dashMat, dashN)
    im.frustumCulled = false
    im.raycast = () => {}
    im.visible = false
    dishG.add(im)
    rings[id] = { im, key: -1 }
  }
  for (const id of ITEMS) {
    const it = ITEM[id]
    const rr = id === 'button' ? it.r + 0.05 : it.rMax + it.r + it.half
    const m = mk(new THREE.CircleGeometry(rr, 36), ghost, it.u, it.v, 0.13, dishG)
    ringHits[id] = m
    clickable(m, () => dishStep('ring', id), { reach: 6.5, when: () => S2.items[id] && live2.k[id] > 0.9 })
  }
  clickable(jellyHit, () => dishStep('time'), { reach: 6.5 })
  const hoursTx = makeText('0 h', { size: 0.26, color: '#ffffff', anchorY: 'middle', outlineWidth: 0.016, outlineColor: '#141826' })
  hoursTx.position.set(-1.15, 0.82, 0.1)
  dishG.add(hoursTx)
  // the lens: ions spreading from the thing, and where the ring ends
  const lensD = new THREE.Group()
  lensD.position.set(-1.5, 1.9, DISH.z + 2.45)
  lensD.rotation.y = Math.PI / 2
  lensD.scale.setScalar(0.001)
  root.add(lensD)
  mk(new THREE.TorusGeometry(0.78, 0.05, 10, 48), M(GREEN, { emissive: GREEN, emissiveIntensity: 0.9 }), 0, 0, 0, lensD)
  const dLensTex = canvasTex(512, 512, null)
  disposers.push(dLensTex)
  mk(new THREE.CircleGeometry(0.76, 48), new THREE.MeshBasicMaterial({ map: dLensTex, toneMapped: false }), 0, 0, 0.006, lensD)
  const dLensHit = hit(1.6, 1.6, 0.3, 0, 0, 0.1, lensD)
  void dLensHit
  let dLensKey = ''
  const ionDots = Array.from({ length: 700 }, (_, i) => ({ x: random(31 + i)(), y: random(777 + i * 5)(), u: random(1313 + i * 11)() }))
  const germDots = Array.from({ length: 220 }, (_, i) => ({ x: random(2001 + i)(), y: random(3001 + i * 3)(), r: 6 + random(4001 + i)() * 8 }))
  function drawDishLens(lv) {
    const id = live2.lens
    if (!id) return
    const h = live2.h
    const rc = ringFor(id, h)
    const key = [lv, id, Math.round(h * 2), live2.lensSeen ? 1 : 0].join('|')
    if (key === dLensKey) return
    dLensKey = key
    const L = E.dish.lens
    const it = ITEM[id]
    const isMetal = id !== 'button'
    const iconColor = id === 'copper' ? '#e89a5a' : '#dfe4ee'
    const ringFrac = isMetal && it.rMax > 0 ? rc / it.rMax : 0
    dLensTex.userData.redraw((g, w, hh) => {
      g.clearRect(0, 0, w, hh)
      g.fillStyle = '#0b2418'
      g.beginPath()
      g.arc(w / 2, hh / 2, w / 2, 0, TAU)
      g.fill()
      g.save()
      g.beginPath()
      g.arc(w / 2, hh / 2, w / 2 - 4, 0, TAU)
      g.clip()
      // the jelly
      g.fillStyle = '#6f5420'
      g.fillRect(0, 0, w, hh)
      const x0 = 92
      const xRing = x0 + 40 + ringFrac * 250
      // germs: a lawn beyond the ring (or touching the thing, for a button)
      const grow = growth(h)
      const nG = Math.round(220 * (0.1 + 0.9 * grow))
      for (let i = 0; i < nG; i++) {
        const p = germDots[i]
        const gx = p.x * w
        if (isMetal && gx < xRing) continue
        if (!isMetal && Math.hypot(gx - x0, p.y * hh - hh / 2) < 52) continue
        g.fillStyle = i % 3 ? '#f0dc8a' : '#e0b955'
        g.beginPath()
        g.arc(gx, p.y * hh, p.r * 0.7, 0, TAU)
        g.fill()
      }
      // the ions: fewer the farther from the thing
      if (isMetal) {
        const lam = 62
        for (let i = 0; i < ionDots.length; i++) {
          const p = ionDots[i]
          const dx = Math.max(0, p.x * w - x0)
          const dens = Math.min(0.7, 0.22 * Math.exp(-(dx - (xRing - x0)) / lam)) * (ringFrac > 0.02 ? 1 : 0.3)
          if (p.u > dens) continue
          g.fillStyle = iconColor
          g.beginPath()
          g.arc(p.x * w, p.y * hh, 7, 0, TAU)
          g.fill()
          g.strokeStyle = '#1a2230'
          g.lineWidth = 1.8
          g.beginPath()
          g.moveTo(p.x * w - 3.4, p.y * hh)
          g.lineTo(p.x * w + 3.4, p.y * hh)
          g.moveTo(p.x * w, p.y * hh - 3.4)
          g.lineTo(p.x * w, p.y * hh + 3.4)
          g.stroke()
        }
      }
      // the thing, edge on, at the left
      if (id === 'plaster') {
        g.fillStyle = '#e6b49a'
        g.fillRect(x0 - 44, hh / 2 - 74, 44, 148)
        g.fillStyle = '#d0d6e0'
        g.fillRect(x0 - 30, hh / 2 - 50, 30, 100)
      } else {
        g.fillStyle = id === 'copper' ? '#d8843a' : id === 'button' ? '#2f6fd0' : '#d0d6e0'
        g.fillRect(x0 - 44, hh / 2 - 74, 44, 148)
      }
      if (isMetal && ringFrac > 0.02) {
        g.strokeStyle = '#7dffa0'
        g.lineWidth = 4
        g.setLineDash([14, 10])
        g.beginPath()
        g.moveTo(xRing, 40)
        g.lineTo(xRing, hh - 110)
        g.stroke()
        g.setLineDash([])
        g.textAlign = 'center'
        g.fillStyle = '#7dffa0'
        g.font = '700 25px Outfit, sans-serif'
        g.fillText(L.enough, w / 2, 122)
        g.fillStyle = '#ffffff'
        g.fillText(L.zone, (x0 + xRing) / 2, hh - 130)
      }
      g.fillStyle = 'rgba(0,0,0,0.5)'
      g.fillRect(0, hh - 96, w, 96)
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillStyle = '#ffffff'
      g.font = '700 42px Outfit, sans-serif'
      g.fillText(L[id], w / 2, hh - 52)
      g.restore()
    })
  }
  // where a colony stands against the thing on the jelly (a coin or button: a point; a plaster: a segment)
  const distTo = (id, x, y) => {
    const it = ITEM[id]
    if (!it.half) return Math.hypot(x - it.u, y - it.v)
    const px = clamp(x, it.u - it.half, it.u + it.half)
    return Math.hypot(x - px, y - it.v)
  }
  function updateColonies() {
    const key = [Math.round(live2.h * 20), ...ITEMS.map(i => Math.round(live2.k[i] * 10))].join(',')
    if (key === colKey) return
    colKey = key
    const g = growth(live2.h)
    const base = 0.12 + 0.88 * g
    const ids = ITEMS.filter(i => live2.k[i] > 0.02)
    for (let i = 0; i < NCOL; i++) {
      const c = col[i]
      let s = base * (0.8 + 0.4 * c.ph)
      for (const id of ids) {
        const rc = ringFor(id, live2.h) * live2.k[id]
        const d = distTo(id, c.x, c.y)
        const own = ITEM[id].r
        const clear = id === 'button' ? (d < own + 0.03 ? 1 : 0) : d < own + 0.02 ? 1 : 1 - smoothK(own + rc - 0.06, own + rc + 0.02, d)
        s *= 1 - clear
      }
      colDummy.position.set(c.x, c.y, 0.1)
      colDummy.scale.set(c.s * s, c.s * s, c.s * s * 0.7)
      colDummy.updateMatrix()
      colonies.setMatrixAt(i, colDummy.matrix)
    }
    colonies.instanceMatrix.needsUpdate = true
  }
  // a dashed outline at distance rc from the thing (a circle, or a plaster's rounded oblong)
  const dashDummy = new THREE.Object3D()
  function placeDashes(id) {
    const it = ITEM[id]
    const rc = (it.r + ringFor(id, live2.h)) * live2.k[id]
    const ring = rings[id]
    const show = rc > it.r + 0.05 && growth(live2.h) > 0.2
    ring.im.visible = show
    if (!show) return
    const key = Math.round(rc * 100) + (live2.k[id] > 0.9 ? 1000 : 0)
    if (key === ring.key) return
    ring.key = key
    const h = it.half
    const perim = 4 * h + TAU * rc
    for (let i = 0; i < dashN; i++) {
      let s = (i / dashN) * perim
      let x
      let y
      let ang
      if (s < 2 * h) {
        x = it.u - h + s
        y = it.v + rc
        ang = 0
      } else if ((s -= 2 * h) < Math.PI * rc) {
        const a = Math.PI / 2 - s / rc
        x = it.u + h + Math.cos(a) * rc
        y = it.v + Math.sin(a) * rc
        ang = a - Math.PI / 2
      } else if ((s -= Math.PI * rc) < 2 * h) {
        x = it.u + h - s
        y = it.v - rc
        ang = Math.PI
      } else {
        s -= 2 * h
        const a = -Math.PI / 2 - s / rc
        x = it.u - h + Math.cos(a) * rc
        y = it.v + Math.sin(a) * rc
        ang = a - Math.PI / 2
      }
      dashDummy.position.set(x, y, 0.13)
      dashDummy.rotation.set(0, 0, ang)
      dashDummy.scale.setScalar(rc > 0 ? 1 : 0)
      dashDummy.updateMatrix()
      ring.im.setMatrixAt(i, dashDummy.matrix)
    }
    ring.im.instanceMatrix.needsUpdate = true
  }
  const placed = () => ITEMS.filter(i => S2.items[i])
  const dHint = () => {
    const h = E.dish.hints
    const p = placed()
    if (!p.length) return h.place
    if (live2.h < 12) return h.grow
    if (!live2.lensSeen && p.some(i => i !== 'button')) return h.ring
    if (p.length < 4) return h.more
    return h.done
  }
  function dishStep(what, arg) {
    const lv = level()
    const says = E.dish.says
    live2.mine = 8
    if (ITEMS.includes(what)) {
      if (S2.items[what]) {
        S2.items[what] = 0
        play('part')
        tell(at(says.take, lv))
      } else {
        S2.items[what] = 1
        play('join')
        tell(at(says[what], lv))
        if (placed().length === 1 && live2.h < 3) later1(5, () => live2.mine > 0 && placed().length && live2.h < 3 && tell(at(says.firstWait, lv)))
      }
    } else if (what === 'time') {
      if (!placed().length) {
        play('wrong')
        tell(at(says.needItem, lv))
        return
      }
      S2.hours = S2.hours >= HOURS_MAX - 0.5 ? 0 : Math.min(HOURS_MAX, Math.round(S2.hours / 6) * 6 + 6)
      play('tap')
    } else if (what === 'hours') {
      S2.hours = clamp(Math.round(Number(arg)), 0, HOURS_MAX)
    } else if (what === 'clear') {
      for (const i of ITEMS) S2.items[i] = 0
      live2.lens = null
      play('part')
    } else if (what === 'ring') {
      live2.lens = arg
      live2.lensSeen = true
      live2.mine = 8
      dLensKey = ''
      play('select')
      tell(at(arg === 'button' ? says.ringButton : arg === 'plaster' ? says.ringPlaster : arg === 'copper' ? says.ringCopper : says.ringSilver, lv))
    } else return
    refresh(E.dish.title, dishPanel)
    if (what !== 'clear') ex.discover('dish', dishPanel, 4.2)
    share('dish')
  }
  // a later call for things that wait a moment (the room's `later` is not given to scenes: ex.discover has its own)
  const waits = []
  const later1 = (s, fn) => waits.push({ at: s, fn })
  const dishPanel = lv => ({
    title: E.dish.title,
    color,
    blocks: [
      { slider: { label: E.dish.slider, min: 0, max: HOURS_MAX, step: 1, value: S2.hours, onInput: v => dishStep('hours', v), format: v => `${Math.round(v)} ${E.dish.hours}`, live: () => S2.hours } },
      { buttons: ITEMS.map(id => ({ label: `${S2.items[id] ? '✓ ' : ''}${E.dish.tags[id]}`, onClick: () => dishStep(id) })) },
      { buttons: [{ label: E.dish.buttons.day, onClick: () => dishStep('time') }, { label: E.dish.buttons.clear, onClick: () => dishStep('clear') }] },
      { rows: [[E.dish.rows.hours, `${Math.round(S2.hours)} ${E.dish.hours}`], [E.dish.rows.placed, placed().map(i => E.dish.tags[i]).join(', ') || E.dish.none]] },
      ...E.dish.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const dishItem = ex.add({
    id: 'dish',
    x: -0.2,
    z: DISH.z,
    radius: 2.3,
    manual: true,
    label: E.dish.label,
    verb: dHint,
    focus: { x: DISH.x, y: 1.65, z: DISH.z + 0.9, size: 3.0, width: 5.2 },
    act: () => ctx.showPanel(dishPanel),
  })
  focusBy(dishItem, dishItem.focus, { x: DISH.x, y: 1.8, z: DISH.z + 0.8, size: 3.0, width: 5.2 })

  // ================= station 3: one germ in a ball of water =================
  const S3 = { taps: 0, S: 0 }
  const live3 = { bound: 0, divs: 0, divT: 0, pulse: 0, leak: 0, mine: false, saidAt: 0 }
  const ballG = new THREE.Group()
  ballG.position.set(BALL.x, BALL.y, BALL.z)
  root.add(ballG)
  solids.push(circle(BALL.x, BALL.z, BALL.r + 0.1))
  // the ball of water: clear in the middle, bright at the edge
  const ballMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uCol: { value: new THREE.Color('#9fdcff') } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }',
    fragmentShader: 'uniform vec3 uCol; varying vec3 vN; varying vec3 vV; void main() { float d = clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0); float e = pow(1.0 - d, 3.0); gl_FragColor = vec4(uCol * (0.6 + 0.8 * e), 0.05 + e * 0.5); }',
  })
  const ballMesh = mk(new THREE.SphereGeometry(BALL.r, 48, 32), ballMat, 0, 0, 0, ballG)
  ballMesh.renderOrder = 10
  const ballLight = new THREE.PointLight('#bfe8ff', 2.2, 7, 1.6)
  ballLight.position.set(0, 0.5, 1.2)
  ballG.add(ballLight)
  // the germ: a rod in a see-through skin, seen from the front and a little from the side
  const rod = new THREE.Group()
  rod.rotation.set(0, -0.3, 0.1)
  ballG.add(rod)
  const skinMat = new THREE.MeshStandardMaterial({ color: '#3fbf74', emissive: '#1f8a4a', emissiveIntensity: 0.55, roughness: 0.4, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide })
  const skin = mk(new THREE.CapsuleGeometry(ROD.r, ROD.half * 2, 10, 28), skinMat, 0, 0, 0, rod)
  skin.rotation.z = Math.PI / 2
  skin.renderOrder = 4
  const inner = mk(new THREE.CapsuleGeometry(ROD.r - 0.07, ROD.half * 2, 8, 20), new THREE.MeshStandardMaterial({ color: '#2f8f57', roughness: 0.6, transparent: true, opacity: 0.45, depthWrite: false }), 0, 0, 0, rod)
  inner.rotation.z = Math.PI / 2
  inner.renderOrder = 3
  // its DNA, a loose tangle in the middle
  const dna = mk(new THREE.TorusKnotGeometry(0.2, 0.03, 120, 8, 2, 5), M('#d8ffe4', { emissive: '#7dffa0', emissiveIntensity: 0.5, roughness: 0.4 }), 0.0, 0, -0.1, rod)
  dna.scale.set(1.9, 0.9, 0.9)
  // the protein machines, each beside a sulfur
  const machines = MACH.map(([t, a], i) => {
    const g = new THREE.Group()
    const rr = ROD.r - 0.1
    g.position.set(t * ROD.half, Math.sin(a) * rr, Math.cos(a) * rr)
    g.lookAt(g.position.x, g.position.y * 3, g.position.z * 3 + 0.0001)
    rod.add(g)
    const mat = new THREE.MeshStandardMaterial({ color: '#ffcf4a', emissive: '#a86a10', emissiveIntensity: 0.6, roughness: 0.4, metalness: 0.2 })
    const wheel = new THREE.Group()
    g.add(wheel)
    mk(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 12), mat, 0, 0, 0, wheel).rotation.x = Math.PI / 2
    for (let b = 0; b < 6; b++) {
      const blade = mk(new THREE.BoxGeometry(0.3, 0.05, 0.07), mat, 0, 0, 0, wheel)
      blade.rotation.z = (b * Math.PI) / 3
    }
    mk(new THREE.TorusGeometry(0.17, 0.016, 6, 24), mat, 0, 0, 0, g)
    // the sulfur, on the skin beside it
    const sg = new THREE.Group()
    sg.position.set(t * ROD.half + 0.2, Math.sin(a) * (ROD.r + 0.005), Math.cos(a) * (ROD.r + 0.005))
    rod.add(sg)
    mk(new THREE.SphereGeometry(0.1, 14, 10), M(SULFUR, { emissive: '#a07a10', emissiveIntensity: 0.6, roughness: 0.4 }), 0, 0, 0, sg)
    return { g, wheel, mat, sg, k: 1, ang: i }
  })
  // a few more sulfurs, far side, only for the look
  for (const [t, a] of [[-0.6, 2.4], [0.1, 2.9], [0.6, -2.6], [-0.1, -2.2]]) {
    const m = mk(new THREE.SphereGeometry(0.08, 12, 8), M(SULFUR, { emissive: '#a07a10', emissiveIntensity: 0.5 }), t * ROD.half, Math.sin(a) * ROD.r, Math.cos(a) * ROD.r, rod)
    void m
  }
  // the tail: a chain of beads that waves
  const NT = 22
  const tailGeo = new THREE.SphereGeometry(1, 8, 6)
  const tail = new THREE.InstancedMesh(tailGeo, M('#6fd69a', { roughness: 0.5, emissive: '#2a8a55', emissiveIntensity: 0.4 }), NT)
  tail.frustumCulled = false
  tail.raycast = () => {}
  rod.add(tail)
  const tailDummy = new THREE.Object3D()
  // what leaks out of the skin
  const leakN = 40
  const leak = dotPoints(leakN, '#bfe8ff', 0.1, 0.9)
  rod.add(leak.points)
  const leakSeed = Array.from({ length: leakN }, (_, i) => ({ t: (random(8 + i)() - 0.5) * 1.8, a: random(80 + i)() * TAU, ph: random(800 + i)() }))
  // the silver ions drifting round, to tap
  const ions = Array.from({ length: 8 }, (_, i) => {
    const s = ionSprite(0.46, 1)
    ballG.add(s)
    const a = (i / 8) * TAU + 0.4
    const home = new THREE.Vector3(Math.cos(a) * 1.15, 0.55 + Math.sin(i * 1.9) * 0.55, 0.85 + Math.sin(a) * 0.35)
    const h = hit(0.5, 0.5, 0.5, 0, 0, 0, ballG)
    h.visible = true
    return { s, home, h, state: 'float', j: -1, p: 0, from: new THREE.Vector3(), ph: i * 1.3 }
  })
  const tapIon = i => germStep('ion', i)
  ions.forEach((io, i) => clickable(io.h, () => tapIon(i), { reach: 9, when: () => io.state === 'float' }))
  // the board: divisions and what is going on
  const board = standingScreen({ width: 1.3, height: 0.54, color, title: '', line: '' }, { top: 1.0, tilt: 0.45, mat: mats.dark })
  board.group.position.set(-1.25, 0, -13.2)
  board.group.rotation.y = 0.45
  root.add(board.group)
  solids.push(circle(-1.25, -13.2, 0.35))
  // a dark backdrop behind the ball, so the germ stands out from the white end wall
  mk(new THREE.CircleGeometry(2.9, 48), mats.navy, 0, BALL.y, STATION.z0 + 0.06, root)
  const boardTex = canvasTex(1024, 432, null)
  disposers.push(boardTex)
  board.content.add(new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.51), new THREE.MeshBasicMaterial({ map: boardTex, transparent: true, toneMapped: false })))
  let boardKey = ''
  const bound = () => Math.min(7, Math.max(S3.taps, bindFromS(S3.S)))
  const divRate = b => clamp((4 - b) / 4)
  function drawBoard(lv) {
    const b = live3.bound
    const key = [lv, b, live3.divs, S3.S].join('|')
    if (key === boardKey) return
    boardKey = key
    const B = E.germ.board
    boardTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.textAlign = 'left'
      g.fillStyle = '#ffd27a'
      g.font = '700 54px Outfit, sans-serif'
      g.fillText(`${B.count}: ${live3.divs}`, 40, 60)
      g.fillStyle = b >= 4 ? '#ff8a7a' : b > 0 ? '#ffd27a' : '#7dff9a'
      g.font = '700 50px Outfit, sans-serif'
      g.fillText(b >= 4 ? B.stopped : b > 0 ? B.slowing : B.dividing, 40, 138)
      // seven machines: a round light each, gold while it turns
      g.fillStyle = '#aab6e0'
      g.font = '700 32px Nunito, sans-serif'
      g.fillText(B.machines, 40, 214)
      for (let i = 0; i < 7; i++) {
        g.fillStyle = i < b ? '#4a4f5c' : '#ffcf4a'
        g.beginPath()
        g.arc(70 + i * 90, 290, 30, 0, TAU)
        g.fill()
      }
      if (lv === 'scientist') {
        g.textAlign = 'right'
        g.fillStyle = '#ffffff'
        g.font = '700 38px Outfit, sans-serif'
        g.fillText(`${Math.round(S3.S)} µg/L`, w - 40, 60)
        g.fillStyle = '#9fb0e0'
        g.font = '700 28px Nunito, sans-serif'
        g.fillText(E.germ.line, w - 40, 110)
      }
      g.fillStyle = '#9aa6c8'
      g.textAlign = 'right'
      g.font = '700 34px Outfit, sans-serif'
      g.fillText(`${7 - b} / 7`, w - 40, 290)
    })
  }
  // where a sulfur is (its ion's resting place)
  const sulfurAt = (j, out) => {
    machines[j].sg.getWorldPosition(out)
    return ballG.worldToLocal(out)
  }
  const tmpV = new THREE.Vector3()
  const gHint = () => {
    const h = E.germ.hints
    const b = live3.bound
    if (b >= 7) return h.done
    if (b >= 4) return h.cannot
    return b === 0 ? h.first : h.more
  }
  function germStep(what, arg) {
    const lv = level()
    const says = E.germ.says
    live3.mine = true
    const before = bound()
    if (what === 'ion') {
      if (S3.taps >= 7 || before >= 7) {
        tell(at(says.none, lv))
        return
      }
      S3.taps = Math.max(S3.taps, before) + 1
      live3.pick = arg
      play('join')
    } else if (what === 'slider') {
      S3.S = clamp(Math.round(Number(arg) / 5) * 5, 0, 300)
      tell(at(S3.S >= LINE_UG ? says.line : says.under, lv))
    } else if (what === 'wash') {
      S3.taps = 0
      S3.S = 0
      play('part')
      tell(at(says.wash, lv))
    } else return
    const now = bound()
    if (what === 'ion') tell(at(now === 1 ? says.first : now === 2 ? says.second : now === 3 ? says.third : now === 4 ? says.fourth : now >= 7 ? says.all : says.more, lv))
    refresh(E.germ.title, germPanel)
    ex.discover('germ', germPanel, 4.2)
    share('germ')
  }
  const germPanel = lv => ({
    title: E.germ.title,
    color,
    blocks: [
      ...(lv === 'scientist' ? [{ slider: { label: E.germ.slider, min: 0, max: 300, step: 5, value: S3.S, onInput: v => germStep('slider', v), format: v => `${Math.round(v)} µg/L`, live: () => S3.S } }] : []),
      { buttons: [{ label: E.germ.buttons.wash, onClick: () => germStep('wash') }] },
      { rows: [[E.germ.board.machines, `${7 - live3.bound} / 7`], [E.germ.board.count, String(live3.divs)]] },
      ...E.germ.panel[depthOf(lv)].map(p => ({ p })),
    ],
  })
  const germItem = ex.add({
    id: 'germ',
    x: 0.0,
    z: -11.6,
    radius: 2.2,
    manual: true,
    label: E.germ.label,
    verb: gHint,
    focus: { x: BALL.x - 0.15, y: BALL.y - 0.2, z: BALL.z, size: 4.8, width: 5.2 },
    act: () => ctx.showPanel(germPanel),
  })
  focusBy(germItem, germItem.focus, { x: BALL.x, y: BALL.y - 0.2, z: BALL.z, size: 4.2, width: 4.6 })
  // the next ion to go in is the tapped one, or the first still floating
  function sendIons(from, to, picked) {
    for (let j = from; j < to; j++) {
      let io = j === from && picked != null && ions[picked]?.state === 'float' ? ions[picked] : ions.find(x => x.state === 'float')
      if (!io) io = ions.find(x => x.state !== 'bound')
      if (!io) continue
      io.state = 'fly'
      io.j = j
      io.p = 0
      io.from.copy(io.s.position)
    }
  }
  function freeIons(from) {
    for (const io of ions) if ((io.state === 'bound' || io.state === 'fly') && io.j >= from) {
      io.state = 'float'
      io.j = -1
    }
  }

  // ================= the old bottle =================
  const crede = { seen: 0 }
  const shelf = mk(new THREE.BoxGeometry(0.36, 0.035, 0.8), mats.brass, BOTTLE.x + 0.12, BOTTLE.y - 0.02, BOTTLE.z)
  void shelf
  mk(new THREE.BoxGeometry(0.34, 0.2, 0.03), mats.dark, BOTTLE.x + 0.12, BOTTLE.y - 0.13, BOTTLE.z - 0.36)
  mk(new THREE.BoxGeometry(0.34, 0.2, 0.03), mats.dark, BOTTLE.x + 0.12, BOTTLE.y - 0.13, BOTTLE.z + 0.36)
  const amber = M('#8a4e1c', { roughness: 0.12, metalness: 0.0, transparent: true, opacity: 0.88, emissive: '#3a1c06', emissiveIntensity: 0.35 })
  const bottle = new THREE.Group()
  bottle.position.set(BOTTLE.x + 0.12, BOTTLE.y, BOTTLE.z)
  bottle.scale.setScalar(1.5)
  root.add(bottle)
  mk(new THREE.CylinderGeometry(0.1, 0.11, 0.3, 20), amber, 0, 0.16, 0, bottle)
  mk(new THREE.CylinderGeometry(0.045, 0.1, 0.1, 20), amber, 0, 0.36, 0, bottle)
  mk(new THREE.CylinderGeometry(0.04, 0.045, 0.1, 16), amber, 0, 0.45, 0, bottle)
  mk(new THREE.SphereGeometry(0.055, 14, 10), mats.rubber, 0, 0.55, 0, bottle).scale.y = 1.35
  const label = mk(new THREE.PlaneGeometry(0.14, 0.14), M('#f3ecd8', { roughness: 0.9 }), -0.103, 0.17, 0, bottle)
  label.rotation.y = -Math.PI / 2
  tag(E.crede.tag, BOTTLE.x + 0.12 - 0.162, BOTTLE.y + 0.255, BOTTLE.z, -Math.PI / 2, 0.078, '#3a2a14', { outlineWidth: 0 })
  const bottleGlow = sprite('#ffb060', 0.9, 0.35)
  bottleGlow.position.set(0.0, 0.25, 0.0)
  bottle.add(bottleGlow)
  const bottleHit = hit(0.5, 1.0, 0.5, BOTTLE.x + 0.12, BOTTLE.y + 0.45, BOTTLE.z)
  function credeStep() {
    const lv = level()
    play('discover')
    tell(at(crede.seen ? E.crede.says.again : E.crede.says.first, lv))
    crede.seen = 1
    ex.discover('crede', credePanel, 0.4)
    ctx.showPanel(credePanel)
    share('crede')
  }
  const credePanel = lv => ({
    title: E.crede.title,
    color,
    blocks: [...E.crede.panel[depthOf(lv)].map(p => ({ p }))],
  })
  clickable(bottleHit, credeStep, { reach: 6 })
  const credeItem = ex.add({
    id: 'crede',
    x: BOTTLE.x - 0.9,
    z: BOTTLE.z,
    radius: 1.3,
    manual: true,
    label: E.crede.label,
    verb: E.crede.hint,
    focus: { x: BOTTLE.x + 0.12, y: BOTTLE.y + 0.45, z: BOTTLE.z, size: 1.4 },
    act: () => credeStep(),
  })
  void credeItem
  // the window's alcove: a bench, a folded table
  mk(new THREE.BoxGeometry(0.75, 0.8, 2.2), mats.white, -2.42, 0.4, -2.2)
  mk(new THREE.BoxGeometry(0.78, 0.05, 2.25), mats.dark, -2.42, 0.82, -2.2)
  solids.push(box(-2.42, -2.2, 0.8, 2.25))

  // ================= every frame =================
  let roomTime = 0
  let leaveSaid = false
  const tmpC = new THREE.Color()
  const cleanCol = new THREE.Color('#78bfee')
  const dirtyCol = new THREE.Color('#8c7b52')
  const hotCol = new THREE.Color('#ffc890')
  const pTmp = new THREE.Vector3()
  const tNow = { t: 0 }
  updates.push((dt, t) => {
    clock += dt
    roomTime += dt
    tNow.t = t
    if (pending && clock - toldAt >= 3.2) {
      say(pending)
      toldAt = clock
      pending = null
    }
    for (let i = waits.length - 1; i >= 0; i--) {
      waits[i].at -= dt
      if (waits[i].at <= 0) {
        const f = waits[i].fn
        waits.splice(i, 1)
        f()
      }
    }
    live1.mine = Math.max(0, live1.mine - dt)
    live2.mine = Math.max(0, live2.mine - dt)
    const lv = level()

    // ---- the water machine ----
    const wasFull = live1.level >= 1
    live1.level = clamp(live1.level + ((S1.tank ? 1 : 0) - live1.level > 0 ? dt / 6 : -dt * 2))
    if (S1.tank && live1.level >= 1 && !wasFull) {
      if (live1.mine > 0) tell(at(E.water.says.filled, lv))
      refresh(E.water.title, waterPanel)
    }
    live1.puff = Math.max(0, live1.puff - dt * 0.4)
    live1.airK = damp(live1.airK, live1.puff > 0 || (S1.tank && live1.level < 0.99) ? 1 : 0, 3, dt)
    live1.filtK = Math.max(0, live1.filtK - dt)
    live1.heatK = Math.max(0, live1.heatK - dt)
    live1.cleanK = clamp(live1.cleanK + (S1.clean ? dt / 3.4 : -dt * 2))
    live1.hotK = clamp(live1.hotK + (S1.hot ? dt / 2.8 : -dt * 2))
    live1.silverK = damp(live1.silverK, S1.silver > 0 ? 1 : 0, 3, dt)
    live1.temp = damp(live1.temp, S1.hot ? 85 : 20, 1.2, dt)
    if (S1.bag && live1.bagK > 0 && live1.bagK < 1) live1.bagK = Math.min(1, live1.bagK + dt / 3)
    live1.flowK = damp(live1.flowK, live1.filtK > 0 || live1.heatK > 0 || (S1.tank && live1.silverK > 0.2 && Math.sin(t * 0.7) > -2) ? (live1.filtK > 0 || live1.heatK > 0 ? 1 : 0.35) : 0, 3, dt)
    // the water in the tank
    water.scale.y = Math.max(0.001, live1.level * TANK.h * 0.96)
    water.position.y = TANK.y0 + (live1.level * TANK.h * 0.96) / 2 + 0.03
    water.visible = live1.level > 0.002
    waterMat.color.copy(dirtyCol).lerp(cleanCol, ease(live1.cleanK)).lerp(hotCol, ease(live1.hotK) * 0.35)
    waterMat.emissive.copy(tmpC.set('#ff8a3a')).multiplyScalar(ease(live1.hotK) * 0.18 + (live1.heatK > 0 ? 0.12 : 0))
    waterMat.opacity = 0.62 + 0.2 * (1 - ease(live1.cleanK))
    tankGlow.material.opacity = ease(live1.hotK) * 0.28 * live1.level
    // the dirt: specks that settle and swirl while it is dirty, gone once it is clean
    for (let i = 0; i < speckSeed.length; i++) {
      const s = speckSeed[i]
      const a = s.a + t * s.sp
      const y = TANK.y0 + 0.05 + s.y * live1.level * TANK.h * 0.9
      specks.pos[i * 3] = LX.tank + Math.cos(a) * s.r
      specks.pos[i * 3 + 1] = live1.level > 0.05 ? y : -9
      specks.pos[i * 3 + 2] = -0.35 + Math.sin(a) * s.r
    }
    specks.geo.attributes.position.needsUpdate = true
    specks.points.material.opacity = 0.9 * (1 - ease(live1.cleanK))
    specks.points.visible = live1.cleanK < 0.99
    // the silver in the tank: a sparkle of white points
    for (let i = 0; i < agSeed.length; i++) {
      const s = agSeed[i]
      const a = s.a - t * s.sp
      const on = i / agSeed.length < clamp(S1.silver / 0.2 + 0.05) && live1.level > 0.05
      ags.pos[i * 3] = LX.tank + Math.cos(a) * s.r
      ags.pos[i * 3 + 1] = on ? TANK.y0 + 0.05 + s.y * live1.level * TANK.h * 0.9 : -9
      ags.pos[i * 3 + 2] = -0.35 + Math.sin(a) * s.r
    }
    ags.geo.attributes.position.needsUpdate = true
    ags.points.material.opacity = 0.9 * live1.silverK
    // the breath
    for (const p of puffs) {
      const k = 1 + live1.puff * 0.6 + Math.sin(t * 1.4 + p.ph) * 0.08
      p.s.position.set(p.home.x * k, p.home.y + Math.sin(t * 0.9 + p.ph) * 0.05, p.home.z)
      p.s.material.opacity = 0.32 + 0.2 * Math.sin(t * 1.4 + p.ph) + live1.puff * 0.3
    }
        // moist air along the duct and through the cold plates
    for (let i = 0; i < 40; i++) {
      const u = (i / 40 + t * 0.22) % 1
      if (u < 0.55) {
        ductCurve.getPoint(u / 0.55, pTmp)
        air.pos[i * 3] = pTmp.x + (Math.sin(i * 7.3) * 0.02)
        air.pos[i * 3 + 1] = pTmp.y
        air.pos[i * 3 + 2] = pTmp.z
      } else {
        const v = (u - 0.55) / 0.45
        air.pos[i * 3] = LX.cond + Math.sin(i * 3.1 + t * 0.6) * 0.36
        air.pos[i * 3 + 1] = 1.9 - v * 1.2
        air.pos[i * 3 + 2] = -0.4 + Math.cos(i * 1.7) * 0.14
      }
    }
    air.geo.attributes.position.needsUpdate = true
    air.points.material.opacity = 0.75 * live1.airK
    air.points.visible = live1.airK > 0.02
    // drops on the plates, rolling down and falling to the tank
    for (let i = 0; i < NDROP; i++) {
      const d = dropSeed[i]
      const grow = clamp(live1.airK * 1.2) * (0.5 + 0.5 * Math.sin(t * 0.6 + d.ph * 6))
      const fall = (t * 0.5 + d.ph) % 1
      colDummy.position.set(d.x, d.y - fall * 0.14 * live1.airK, d.z)
      colDummy.scale.setScalar(0.02 + 0.022 * grow)
      colDummy.updateMatrix()
      drops.setMatrixAt(i, colDummy.matrix)
    }
    drops.instanceMatrix.needsUpdate = true
    frost.material.opacity = 0.2 * live1.airK
    // the flow round the loop
    for (let i = 0; i < 26; i++) {
      const s = (i / 26 + t * 0.25) % 1
      onLoop(s, pTmp)
      flow.pos[i * 3] = pTmp.x
      flow.pos[i * 3 + 1] = pTmp.y
      flow.pos[i * 3 + 2] = pTmp.z
    }
    flow.geo.attributes.position.needsUpdate = true
    flow.points.material.opacity = 0.9 * live1.flowK
    flow.points.material.color.set(live1.heatK > 0 ? '#ffb070' : live1.filtK > 0 ? '#bfe4ff' : '#e6eef8')
    flow.points.visible = live1.flowK > 0.02
    // the filters: glints running down the three columns
    for (let i = 0; i < 9; i++) {
      const c = FILT[i % 3]
      const u = (((Math.floor(i / 3) / 3) + t * 0.55) % 1)
      fl.pos[i * 3] = c.x
      fl.pos[i * 3 + 1] = 1.55 - u * 0.9
      fl.pos[i * 3 + 2] = -0.4
    }
    fl.geo.attributes.position.needsUpdate = true
    fl.points.material.opacity = live1.filtK > 0 ? Math.min(1, live1.filtK) * 0.9 : 0
    fl.points.visible = live1.filtK > 0
    // the silver cell: ions between the plates, the light
    live1.cellOn = live1.silverK
    cellIons.forEach((c, i) => {
      const u = (c.ph + t * (0.25 + S1.silver)) % 1
      c.s.position.set(LX.ion - 0.2 + 0.4 * u, 1.25 + Math.sin(u * TAU * 2 + i) * 0.18, -0.38)
      c.s.material.opacity = live1.silverK * 0.95 * Math.sin(Math.PI * u)
    })
    led.material.emissiveIntensity = damp(led.material.emissiveIntensity, S1.silver > 0 ? 1.6 : 0, 6, dt)
    const rd = `${num(S1.silver, 2, lang)} mg/L`
    setText(readout, rd)
    // the heater
    const hk = ease(live1.hotK)
    coilMat.emissiveIntensity = (live1.heatK > 0 ? 1.4 : 0.15) + hk * 0.5
    heatGlow.material.opacity = (live1.heatK > 0 ? 0.35 : 0) + hk * 0.12
    setText(tempTx, `${Math.round(live1.temp)} °C`)
    // the drinking bag and its floating ball
    bagBody.scale.y = 0.2 + 0.08 * (1 - clamp(live1.bagK * 3)) + 0.06
    if (S1.bag && live1.bagK > 0) {
      const k = ease(clamp(live1.bagK))
      ball.visible = true
      ball.position.set(LX.heat + 0.05 - 0.7 * k, 0.9 + 0.5 * k + Math.sin(t * 1.3) * 0.05, -0.15 + 1.3 * k)
      ball.scale.set(1 + Math.sin(t * 5) * 0.04 * (1 - k), 1 - Math.sin(t * 5) * 0.05 * (1 - k), 1)
      bagWater.scale.set(0.24, 0.19 * (1 - k * 0.75), 0.11)
    } else {
      ball.visible = false
      bagWater.scale.set(0.24, 0.19, 0.11)
    }
    // the germ lens: a model week every 16 seconds, then a pause
    if (live1.level > 0.25) {
      live1.dayT = (live1.dayT + dt) % (DAY_S * 8 + 3)
      live1.day = Math.min(7, live1.dayT / DAY_S)
    } else live1.dayT = 0
    drawLens(lv)

    // ---- the dish ----
    live2.h = damp(live2.h, S2.hours, live2.mine > 0 ? 4 : 2, dt)
    if (Math.abs(live2.h - S2.hours) < 0.02) live2.h = S2.hours
    for (const id of ITEMS) {
      const was = live2.k[id]
      live2.k[id] = clamp(was + (S2.items[id] ? dt : -dt) / 0.9)
      const k = ease(live2.k[id])
      const it = ITEM[id]
      const mesh = itemMesh[id]
      // from its shelf (flat) to the jelly (standing, facing the visitor), up on a short arc
      const from = pTmp.set(LEDGE.x, LEDGE.y + 0.025 + (it.r > 0.15 ? 0 : 0), slotZ(id))
      const fx = from.x
      const fy = from.y
      const fz = from.z
      dishG.updateWorldMatrix(true, false)
      const to = dishG.localToWorld(new THREE.Vector3(it.u, it.v, 0.14))
      mesh.position.set(fx + (to.x - fx) * k, fy + (to.y - fy) * k + Math.sin(Math.PI * k) * 0.4, fz + (to.z - fz) * k)
      mesh.rotation.set(it.half ? 0.0 : 0, 0, (Math.PI / 2) * k)
      if (id === 'plaster') mesh.rotation.set(0, 0, (Math.PI / 2) * k)
      slotLabel[id].visible = k < 0.3
      if (was < 0.9 && live2.k[id] >= 0.9 && !live2.said) live2.said = true
    }
    // a said line, once, when the lawn has grown with something on it
    if (live2.h >= 14 && !live2.grownSaid && placed().length && live2.mine > 0) {
      live2.grownSaid = true
      tell(at(E.dish.says.grown, lv))
    }
    if (live2.h < 4) live2.grownSaid = false
    updateColonies()
    for (const id of ['silver', 'copper', 'plaster']) placeDashes(id)
    setText(hoursTx, `${Math.round(live2.h)} ${E.dish.hours}`)
    // the lens fades in once asked for
    live2.lensK = damp(live2.lensK, live2.lens ? 1 : 0, 6, dt)
    lensD.scale.setScalar(Math.max(0.001, ease(live2.lensK) * 0.8))
    lensD.visible = live2.lensK > 0.02
    if (live2.lens) drawDishLens(lv)

    // ---- the germ ----
    const target = bound()
    if (target !== live3.bound) {
      if (target > live3.bound) {
        sendIons(live3.bound, target, live3.mine ? live3.pick : null)
        live3.pick = null
      } else freeIons(target)
      live3.bound = target
      boardKey = ''
      refresh(E.germ.title, germPanel)
    }
    live3.mine = false
    const b = live3.bound
    live3.leak = damp(live3.leak, clamp((b - 2) / 3), 2, dt)
    const rate = divRate(b)
    if (rate > 0) {
      live3.divT += dt * rate
      if (live3.divT >= 4.5) {
        live3.divT = 0
        live3.divs++
        live3.pulse = 1
        boardKey = ''
      }
    }
    live3.pulse = Math.max(0, live3.pulse - dt * 1.4)
    const pulse = Math.sin(live3.pulse * Math.PI)
    rod.scale.set(1 + 0.07 * pulse, 1 - 0.03 * pulse, 1 - 0.03 * pulse)
    rod.position.y = Math.sin(t * 0.5) * 0.04
    rod.rotation.y = -0.3 + Math.sin(t * 0.25) * 0.08
    machines.forEach((m, j) => {
      const run = j >= b ? 1 : 0
      m.k = damp(m.k, run, 5, dt)
      m.ang += dt * 3.2 * m.k
      m.wheel.rotation.z = m.ang
      m.mat.color.set('#6a6f7c').lerp(tmpC.set('#ffcf4a'), m.k)
      m.mat.emissive.set('#101216').lerp(tmpC.set('#a86a10'), m.k)
      m.mat.emissiveIntensity = 0.25 + 0.35 * m.k
    })
    // the tail waves with the machines still running
    const amp = 0.05 + 0.1 * (1 - b / 7)
    for (let i = 0; i < NT; i++) {
      const u = i / (NT - 1)
      tailDummy.position.set(-ROD.half - ROD.r + 0.05 - u * 1.1, Math.sin(u * 6 - t * 5 * (1 - b / 9)) * amp * u * 3, Math.cos(u * 5 - t * 4 * (1 - b / 9)) * amp * u * 2)
      tailDummy.scale.setScalar(0.05 - u * 0.03)
      tailDummy.updateMatrix()
      tail.setMatrixAt(i, tailDummy.matrix)
    }
    tail.instanceMatrix.needsUpdate = true
    // what leaks
    for (let i = 0; i < leakN; i++) {
      const p = leakSeed[i]
      const u = (t * 0.6 + p.ph) % 1
      const on = i / leakN < live3.leak
      const rr = ROD.r + u * 0.55
      leak.pos[i * 3] = p.t * ROD.half
      leak.pos[i * 3 + 1] = on ? Math.sin(p.a) * rr : -99
      leak.pos[i * 3 + 2] = Math.cos(p.a) * rr
    }
    leak.geo.attributes.position.needsUpdate = true
    // the ions: drifting, flying in, stuck on their sulfur
    for (const io of ions) {
      if (io.state === 'float') {
        io.s.position.set(io.home.x + Math.sin(t * 0.5 + io.ph) * 0.12, io.home.y + Math.sin(t * 0.7 + io.ph * 1.3) * 0.1, io.home.z + Math.cos(t * 0.45 + io.ph) * 0.1)
        io.s.visible = true
      } else if (io.state === 'fly') {
        io.p = Math.min(1, io.p + dt / 1.3)
        const k = ease(io.p)
        sulfurAt(io.j, tmpV)
        io.s.position.lerpVectors(io.from, tmpV, k)
        io.s.position.y += Math.sin(Math.PI * k) * 0.25
        if (io.p >= 1) io.state = 'bound'
      } else {
        sulfurAt(io.j, tmpV)
        io.s.position.copy(tmpV)
      }
      io.s.scale.setScalar(io.state === 'bound' ? 0.3 : 0.46)
      io.h.position.copy(io.s.position)
    }
    drawBoard(lv)
    // the Atomling's last word, once, when the visitor heads back to the frame after doing something
    const p = ctx.engine.player
    if (!leaveSaid && p?.pos && roomTime > 20 && p.pos.z > 3.0 && Math.cos(p.yaw - Math.PI) > 0.6 && (waterItem.found || dishItem.found || germItem.found)) {
      leaveSaid = true
      tell(at(E.leave, lv))
    }
    stage.update(t, dt)
  })

  /** A state as it stands, without replaying it (a newcomer, a saved state coming back). */
  const snap1 = () => {
    live1.level = S1.tank ? 1 : 0
    live1.cleanK = S1.clean
    live1.hotK = S1.hot
    live1.temp = S1.hot ? 85 : 20
    live1.silverK = S1.silver > 0 ? 1 : 0
    live1.bagK = S1.bag ? 1 : 0
    live1.filtK = live1.heatK = 0
  }
  const snap2 = () => {
    live2.h = S2.hours
    for (const id of ITEMS) live2.k[id] = S2.items[id] ? 1 : 0
    colKey = ''
    for (const id of ['silver', 'copper', 'plaster']) rings[id].key = -1
    dLensKey = ''
  }
  const snap3 = () => {
    live3.bound = bound()
    for (const io of ions) {
      io.state = 'float'
      io.j = -1
    }
    for (let j = 0; j < live3.bound; j++) {
      const io = ions[j]
      io.state = 'bound'
      io.j = j
    }
    boardKey = ''
  }
  snap3()
  // a later snap for things that need the scene in place
  const mask = () => ITEMS.reduce((m, id, i) => m | (S2.items[id] ? 1 << i : 0), 0)

  return {
    env: stage.env,
    solids,
    cameraBounds: stage.cameraBounds,
    cameraClear: stage.cameraClear,
    spawn: { x: 0, z: 3.2, yaw: 0 },
    hostSpot: { x: 1.2, z: 1.5, yaw: Math.atan2(1.2, -1.7) },
    back: { x: 0, z: 6.1, rot: Math.PI },
    stand: { x: -1.3, z: 1.2, rot: Math.atan2(1.3, 2.0) },
    parts: {
      water: {
        tap: (what, arg) => waterStep(what, arg), // 'breath', 'filter', 'silver', 'dose' (mg/L), 'heat', 'bag', 'tank', 'look', 'reset'
        get state() {
          return { ...S1, level: live1.level, cleanK: live1.cleanK, hotK: live1.hotK }
        },
        at: what => ({ breath: new THREE.Vector3(MX - 0.45, 1.5, ZC + LX.duct + 0.35), filter: new THREE.Vector3(MX - 0.2, 1.15, ZC + LX.filt), silver: new THREE.Vector3(MX - 0.2, 1.3, ZC + LX.ion), heat: new THREE.Vector3(MX - 0.2, 1.4, ZC + LX.heat), bag: new THREE.Vector3(MX - 0.0, 0.58, ZC + LX.heat), tank: new THREE.Vector3(MX - 0.2, 1.2, ZC + LX.tank), look: new THREE.Vector3(MX - 0.5, 2.55, ZC + LX.tank) })[what],
      },
      dish: {
        tap: (what, arg) => dishStep(what, arg), // 'silver', 'copper', 'button', 'plaster', 'time', 'hours' (0..24), 'clear', 'ring' (id)
        get state() {
          return { hours: S2.hours, h: live2.h, items: { ...S2.items }, lens: live2.lens }
        },
        at: what => (ITEMS.includes(what) ? new THREE.Vector3(LEDGE.x, LEDGE.y + 0.2, slotZ(what)) : new THREE.Vector3(DISH.x + 0.15, DISH.y, DISH.z)),
      },
      germ: {
        tap: (what, arg) => germStep(what, arg), // 'ion' (index 0..7), 'slider' (ug/L), 'wash'
        get state() {
          return { taps: S3.taps, S: S3.S, bound: live3.bound, divs: live3.divs }
        },
        at: i => ballG.localToWorld(ions[i ?? 0].s.position.clone()),
      },
      crede: { tap: () => credeStep(), at: () => new THREE.Vector3(BOTTLE.x + 0.12, BOTTLE.y + 0.3, BOTTLE.z) },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { water: waterPanel, dish: dishPanel, germ: germPanel, crede: credePanel },
    shared: {
      water: {
        get: () => ({ tank: S1.tank, clean: S1.clean, silver: Math.round(S1.silver * 100), hot: S1.hot, bag: S1.bag }),
        set: (s, liveSet) => {
          const was = { ...S1 }
          S1.tank = s?.tank ? 1 : 0
          S1.clean = s?.clean ? 1 : 0
          S1.silver = clamp(Math.round(Number(s?.silver) || 0), 0, 20) / 100
          S1.hot = s?.hot ? 1 : 0
          S1.bag = s?.bag ? 1 : 0
          if (liveSet) {
            live1.mine = 0
            if (S1.tank && !was.tank) live1.puff = 1
            if (S1.clean && !was.clean) live1.filtK = 3.6
            if (S1.hot && !was.hot) live1.heatK = 3.2
            if (S1.bag && !was.bag) live1.bagK = 0.001
            if (!S1.tank && was.tank) snap1()
          } else snap1()
        },
      },
      dish: {
        get: () => ({ h: Math.round(S2.hours), items: mask() }),
        set: (s, liveSet) => {
          const m = Number(s?.items) || 0
          ITEMS.forEach((id, i) => (S2.items[id] = m & (1 << i) ? 1 : 0))
          S2.hours = clamp(Math.round(Number(s?.h) || 0), 0, HOURS_MAX)
          if (liveSet) live2.mine = 0
          else snap2()
        },
      },
      germ: {
        get: () => ({ taps: S3.taps, S: Math.round(S3.S) }),
        set: (s, liveSet) => {
          S3.taps = clamp(Math.round(Number(s?.taps) || 0), 0, 7)
          S3.S = clamp(Math.round(Number(s?.S) || 0), 0, 300)
          if (!liveSet) snap3()
        },
      },
      crede: {
        get: () => ({ seen: crede.seen }),
        set: s => {
          crede.seen = s?.seen ? 1 : 0
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
