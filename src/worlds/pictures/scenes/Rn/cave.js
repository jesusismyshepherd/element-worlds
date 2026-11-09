// Radon's picture "Do caves breathe in and out?" as a room (docs/knowledge/picture-rooms.md): a limestone show
// cave on a winter night (stages/showcave.js), its lower entrance and its high opening each with a door. Radon
// atoms are the pictures' teal motes; how many float in the chamber follows the monitor's number. Three
// stations, each worked by tapping its things:
// - "The cave's breath" (by the radon monitor): tap the season sign at the entrance (winter -5 C, summer
//   25 C) or drag the outside temperature (-10 to 30 C; the cave stays near 10 C). Colder outside: the warmer
//   cave air rises out of the top, cold air comes in at the bottom (fog where it meets the cave's damp air),
//   steam over the top opening, the reading falls toward about 200 Bq/m3. Warmer outside: the cave's cold air
//   slides out of the bottom, it sucks a little soil air in through the cracks of its ceiling, the reading
//   climbs toward about 3000. Near 10 C the air stands still. Below about -6 C snow closes the openings and the
//   reading climbs again (Postojna's own finding). Tap the smoke puffer: its smoke bends with the draught.
// - "The doors" (a control board with a drawing of the cave, three buttons; the real doors can be tapped too):
//   shut the bottom door or the top door and see the number follow; "auto" runs them by the rule cave scientists
//   proposed for Jenolan's Chifley Cave: open when it is colder outside than in the cave, shut when warmer.
// - "The guide's year": the guide and her planning board: tap her for her radon badge; an hours-a-week slider
//   makes her year's dose, month by month from the cave's radon (with the doors as they are now), against the
//   EU worker limit of 20 mSv; tap the months to give her more of her cave hours in winter; tap the visitor's
//   ticket for an hour and a half's visit, a sliver.
// The monitor follows a small model of this made-up cave (below), tuned to Postojna's numbers. Facts and their
// sources: the head of cave.words.js. All three stations are shared in a room (src/net/shared.js).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, num, clamp, lerp, damp, random } from '../../../wings/noble/kit.js'
import { showcaveStage } from '../../stages/showcave.js'
import { makeText } from '../../../../engine/text.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { CAVE_WORDS } from './cave.words.js'

export const WORDS = CAVE_WORDS

const TAU = Math.PI * 2
const TEAL = '#3cc3d6'
const HALO = '#6ff0ff'

// ---- the cave's air: a small model of a made-up cave with two openings, tuned to Postojna's numbers ----
// Postojna (Gregoric et al., NHESS 11, 1523, 2011): the cave stays at 9 to 10 C; about 200 Bq/m3 in winter,
// about 3000 in summer; most when the outside is near the cave's temperature or warmer, when the air hardly
// moves; below about -6 C the radon rose again, supposedly because snow and ice covered the small breathing
// holes. The draught grows with the temperature difference (the chimney effect) and needs a way in and a way
// out: two openings in series. In summer the draught runs top to bottom and, as in Chifley Cave (Waring et
// al., J. Cave Karst Stud. 83, 1, 2021), draws soil air with its radon in through cracks. The numbers are this
// model's, not a measurement.
export const T_CAVE = 10
const T_MIN = -10
const T_MAX = 30
const WINTER = -5
const SUMMER = 25
const A = 1400 // Bq/m3 from the rock alone in still air
const KW = 0.4 // flushing per kelvin when colder outside
const KS = 0.016 // and when warmer (weak: the cave's cold air only slides out)
const BS = 910 // soil air's radon, per unit of air drawn through the cracks
const SAT = 8
const DOOR = 0.75 // the top door's share of the way out at the top; the cracks have the rest
const CRACK = 0.25
const LEAK = 0.04 // what a shut door still lets by
const snowOf = T => (T >= -6 ? 1 : Math.max(0.12, 1 - ((-6 - T) / 4) * 0.88))
/** The cave's air for an outside temperature T and the doors (1 open, 0 shut): the steady radon (Bq/m3),
 *  the draught (0..1, signed: + up and out of the top, - down and out of the bottom), the shares through the
 *  top door and the cracks, the soil air drawn in. */
export function caveAir(T, top, bot) {
  const d = T - T_CAVE
  const s = snowOf(T)
  const gt = (DOOR * top + CRACK) * s
  const gb = (1 - LEAK) * bot + LEAK
  const g = 2 / (1 / gt + 1 / gb)
  const topShare = (DOOR * top * s) / gt
  if (d <= 0) {
    const F = -d * g
    return { C: A / (1 + KW * F), flow: clamp(F / 15), topShare, soil: 0, snow: 1 - s }
  }
  const F = d * g
  let cr = F * (1 - topShare)
  const soil = cr
  cr = cr / (1 + cr / SAT)
  return { C: (A + BS * cr) / (1 + KS * F), flow: -clamp(F / 15), topShare, soil: clamp(soil / 6), snow: 1 - s }
}

// a year like central Europe's (monthly means, C), for the guide's plan
const MONTH_T = [-1, 0.5, 4.5, 9, 13.5, 17, 19, 18.5, 14.5, 10, 5, 0.5]
const SUMMER_MONTHS = [4, 5, 6, 7, 8]
const PLAN_SUMMER = 0.4 // her share of cave hours in May to September with the plan
const PLAN_WINTER = (12 - SUMMER_MONTHS.length * PLAN_SUMMER) / (12 - SUMMER_MONTHS.length)
const WEEKS = 46 // weeks worked in a year
// ICRP 137 (2017): 6 mSv per mJ h m-3 for tourist caves, 1.3e-5 mSv per Bq h m-3 with F = 0.4
const DCC = 1.3e-5
const LIMIT = 20 // mSv a year, Directive 2013/59/Euratom
const H_MAX = 35
const H_START = 15
const VISIT_H = 1.5

const minus = s => s.replace(/^-/, '−')

export async function build({ ctx, root, lang, E, ex, say, later, light, color, level, depth, clickable }) {
  const stage = showcaveStage({
    light,
    stairDir: 1,
    clear: [
      [-3.0, -5.6, 3.6],
      [2.9, -5.4, 3.6],
      [-7.0, 0.2, 3.0],
      [-6.6, -4.2, 2.0],
      [0, 4.6, 2.6],
      [3.4, 4.4, 1.6],
    ],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const own = []
  const keep = o => (own.push(o), o)
  const paras = list => list.map(p => ({ p }))
  const mk = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    return m
  }
  const std = (c, o = {}) => keep(new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, ...o }))
  const hitBox = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(keep(new THREE.BoxGeometry(w, h, d)), keep(new THREE.MeshBasicMaterial({ visible: false })))
    m.position.set(x, y, z)
    return m
  }
  const soft = keep(
    canvasTex(64, 64, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(0.45, 'rgba(255,255,255,0.4)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }),
  )
  const darkMat = std('#1b1d24', { metalness: 0.4 })
  const edgeOf = c => std(c, { emissive: c, emissiveIntensity: 1.0, roughness: 0.4 })
  /** A board in the atrium's look: a canvas picture in a glowing frame, on two posts, facing +z. */
  function board({ w, h, cw, ch, edge, y, legs = true }) {
    const g = new THREE.Group()
    const t = keep(canvasTex(cw, ch, null, { mipmaps: false }))
    const frame = mk(keep(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.06, 2, 0.025)), edgeOf(edge), 0, y, -0.02)
    const face = mk(keep(new THREE.PlaneGeometry(w, h)), keep(new THREE.MeshBasicMaterial({ map: t, toneMapped: false })), 0, y, 0.015)
    g.add(frame, face)
    if (legs) {
      for (const s of [-1, 1]) g.add(mk(keep(new THREE.CylinderGeometry(0.035, 0.04, y, 8)), darkMat, s * (w / 2 - 0.25), y / 2, -0.06))
    }
    return { group: g, tex: t, face, draw: fn => t.userData.redraw(fn) }
  }
  const font = (wt, px, f = 'Outfit') => `${wt} ${px}px ${f}, sans-serif`
  const fmtT = v => `${minus(num(v, 1, lang))} °C`
  const fmtC = v => `${Math.round(v)}`
  /** A frame of reference on the back wall: the wall's point toward (x, z) at height y. */
  const onWall = (x, z, y, off) => {
    const w = stage.wallAt(x, z, y)
    return { x: w.x + w.nx * off, z: w.z + w.nz * off, rot: Math.atan2(w.nx, w.nz), nx: w.nx, nz: w.nz, tx: w.tx, tz: w.tz }
  }
  const lv = () => depth(level())

  // =====================================================================================================
  // the cave's state, shared by the three stations
  // =====================================================================================================
  let T = WINTER // outside, C
  let puffs = 0
  let doors = { top: 1, bot: 1, auto: 0 }
  const effTop = () => (doors.auto ? (T <= T_CAVE ? 1 : 0) : doors.top)
  const effBot = () => (doors.auto ? (T <= T_CAVE ? 1 : 0) : doors.bot)
  const air = () => caveAir(T, effTop(), effBot())
  let C = air().C // the monitor's reading, easing toward the steady value (sped up: days in a real cave)
  let flowK = air().flow
  let season = T > T_CAVE ? 1 : 0
  const trace = new Float32Array(160).fill(C)
  let traceT = 0
  const bottomDoor = stage.doors.bottom
  const topDoor = stage.doors.top
  let botK = 1
  let topK = 1

  // the draught's path, from outside the lower entrance up and out of the top opening
  const M = stage.mouths
  const P = [
    new THREE.Vector3(M.bottom.outer.x, 0.8, M.bottom.outer.z),
    new THREE.Vector3(M.bottom.inner.x, 0.9, M.bottom.inner.z),
    new THREE.Vector3(-4.6, 1.3, -4.0),
    new THREE.Vector3(0.0, 1.8, -4.6),
    new THREE.Vector3(M.top.landing.x + M.top.wall.nx * 1.8, 2.6, M.top.landing.z + M.top.wall.nz * 1.8),
    new THREE.Vector3(M.top.landing.x, M.top.inner.y + 1.0, M.top.landing.z),
    new THREE.Vector3(M.top.inner.x, M.top.inner.y + 1.0, M.top.inner.z),
    new THREE.Vector3(M.top.outer.x, M.top.outer.y + 0.8, M.top.outer.z),
  ]
  const segLen = P.slice(1).map((p, i) => p.distanceTo(P[i]))
  const tmpA = new THREE.Vector3()
  const tmpB = new THREE.Vector3()
  /** The nearest point of the draught's path to p: { i (segment), t, d, tan }. */
  function nearestOnPath(p) {
    let best = null
    for (let i = 0; i < P.length - 1; i++) {
      tmpA.subVectors(P[i + 1], P[i])
      const t = clamp(tmpB.subVectors(p, P[i]).dot(tmpA) / (segLen[i] * segLen[i]))
      const q = tmpB.copy(P[i]).addScaledVector(tmpA, t)
      const d = q.distanceTo(p)
      if (!best || d < best.d) best = { i, t, d, q: q.clone(), tan: tmpA.clone().divideScalar(segLen[i]) }
    }
    return best
  }
  /** How strongly the draught runs along each part of the path (the bottom tunnel, the chamber, the passage). */
  const segFlow = i => {
    const a = air()
    if (i <= 1) return Math.abs(a.flow) * (effBot() ? 1 : 0.04)
    if (i >= 4) return Math.abs(a.flow) * a.topShare
    return Math.abs(a.flow)
  }
  const out = new THREE.Vector3()
  /** The air's velocity at p (m/s): along the path, and drawn toward it from round about. */
  function flowAt(p, v = out) {
    const n = nearestOnPath(p)
    const a = air()
    const s = Math.sign(a.flow)
    const f = segFlow(n.i)
    const along = 1.1 * f * Math.exp(-(n.d * n.d) / (2 * 1.8 * 1.8))
    v.copy(n.tan).multiplyScalar(s * along)
    const pull = 0.3 * Math.abs(a.flow) * Math.exp(-(n.d * n.d) / (2 * 4.5 * 4.5))
    v.x += (n.q.x - p.x) * pull
    v.y += (n.q.y - p.y) * pull
    v.z += (n.q.z - p.z) * pull
    return v
  }

  // =====================================================================================================
  // station 1: the cave's breath
  // =====================================================================================================
  const B1 = onWall(-3.0, -8.0, 1.8, 0.85)
  const airBoard = board({ w: 2.5, h: 1.55, cw: 1024, ch: 636, edge: TEAL, y: 2.05 })
  airBoard.group.position.set(B1.x, 0, B1.z)
  airBoard.group.rotation.y = B1.rot
  root.add(airBoard.group)
  solids.push(box(B1.x, B1.z, 2.6, 0.5, { rot: B1.rot }))
  // the radon monitor itself: a small box with a screen and a green light, on the board's left post
  const monitor = new THREE.Group()
  monitor.add(mk(keep(new RoundedBoxGeometry(0.26, 0.34, 0.1, 2, 0.02)), std('#c8ccd6', { roughness: 0.4 }), 0, 0, 0))
  monitor.add(mk(keep(new THREE.PlaneGeometry(0.18, 0.09)), keep(new THREE.MeshBasicMaterial({ color: '#123a52' })), 0, 0.07, 0.052))
  const ledMat = keep(new THREE.MeshBasicMaterial({ color: '#7dffb0', toneMapped: false }))
  monitor.add(mk(keep(new THREE.SphereGeometry(0.018, 10, 8)), ledMat, 0, -0.07, 0.05))
  monitor.position.set(-1.0, 1.05, 0.06)
  airBoard.group.add(monitor)
  const ledLight = new THREE.PointLight('#5ee08f', light ? 0.25 : 0.4, 1.4, 2)
  ledLight.position.set(-1.0, 0.95, 0.4)
  airBoard.group.add(ledLight)

  // the season sign at the entrance: a round sign on a post, a snowflake or a sun
  // (beside the board, on the entrance's side)
  const signAt = { x: B1.x - B1.tx * 2.75 + B1.nx * 0.35, z: B1.z - B1.tz * 2.75 + B1.nz * 0.35 }
  const sign = new THREE.Group()
  const signTex = keep(canvasTex(512, 512, null, { mipmaps: false }))
  const signFace = mk(keep(new THREE.CircleGeometry(0.42, 40)), keep(new THREE.MeshBasicMaterial({ map: signTex, toneMapped: false })), 0, 1.6, 0.03)
  sign.add(mk(keep(new THREE.CylinderGeometry(0.035, 0.045, 1.6, 8)), darkMat, 0, 0.8, -0.03))
  sign.add(mk(keep(new THREE.TorusGeometry(0.43, 0.03, 8, 40)), edgeOf('#9fd8ff'), 0, 1.6, 0.02))
  sign.add(signFace)
  sign.add(hitBox(0.95, 1.0, 0.25, 0, 1.55, 0))
  sign.position.set(signAt.x, 0, signAt.z)
  sign.rotation.y = B1.rot + 0.25
  root.add(sign)
  solids.push(circle(signAt.x, signAt.z, 0.3))
  let signSeason = -1
  function drawSign() {
    const sum = T > T_CAVE
    signSeason = sum ? 1 : 0
    signTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      const grd = g.createRadialGradient(w / 2, h * 0.45, 10, w / 2, h / 2, w / 2)
      grd.addColorStop(0, sum ? '#3a3420' : '#16304a')
      grd.addColorStop(1, sum ? '#1c1a12' : '#0b1a2c')
      g.fillStyle = grd
      g.beginPath()
      g.arc(w / 2, h / 2, w / 2, 0, TAU)
      g.fill()
      g.save()
      g.translate(w / 2, h * 0.4)
      if (sum) {
        g.fillStyle = '#ffd36a'
        g.beginPath()
        g.arc(0, 0, 62, 0, TAU)
        g.fill()
        g.strokeStyle = '#ffd36a'
        g.lineWidth = 14
        g.lineCap = 'round'
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * TAU
          g.beginPath()
          g.moveTo(Math.cos(a) * 88, Math.sin(a) * 88)
          g.lineTo(Math.cos(a) * 122, Math.sin(a) * 122)
          g.stroke()
        }
      } else {
        g.strokeStyle = '#bfe4ff'
        g.lineWidth = 13
        g.lineCap = 'round'
        for (let k = 0; k < 6; k++) {
          g.save()
          g.rotate((k / 6) * TAU)
          g.beginPath()
          g.moveTo(0, 0)
          g.lineTo(0, -120)
          g.moveTo(0, -70)
          g.lineTo(-30, -98)
          g.moveTo(0, -70)
          g.lineTo(30, -98)
          g.stroke()
          g.restore()
        }
      }
      g.restore()
      g.fillStyle = sum ? '#ffe2a0' : '#d6ecff'
      g.textAlign = 'center'
      g.font = font(700, 58)
      g.fillText(sum ? E.breath.sign.summer : E.breath.sign.winter, w / 2, h * 0.8)
    })
  }
  drawSign()

  // the smoke puffer: a rubber bulb with a nozzle in a clamp on a stand
  const puffer = new THREE.Group()
  // (between the sign and the board, so its smoke crosses the view either way)
  const PU = { x: B1.x - B1.tx * 1.8 + B1.nx * 0.5, z: B1.z - B1.tz * 1.8 + B1.nz * 0.5 }
  puffer.add(mk(keep(new THREE.CylinderGeometry(0.03, 0.04, 1.05, 8)), darkMat, 0, 0.525, 0))
  puffer.add(mk(keep(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 20)), darkMat, 0, 0.02, 0))
  const bulb = mk(keep(new THREE.SphereGeometry(0.11, 18, 12)), std('#e05a3a', { roughness: 0.6 }), 0, 1.13, 0)
  bulb.scale.set(1, 1.25, 1)
  const nozzle = mk(keep(new THREE.CylinderGeometry(0.018, 0.03, 0.2, 10)), std('#e8e6df'), 0, 1.33, 0)
  puffer.add(bulb, nozzle)
  puffer.add(mk(keep(new THREE.TorusGeometry(0.1, 0.012, 6, 18)), darkMat, 0, 1.08, 0))
  puffer.children[puffer.children.length - 1].rotation.x = Math.PI / 2
  puffer.add(hitBox(0.45, 0.65, 0.45, 0, 1.15, 0))
  puffer.position.set(PU.x, 0, PU.z)
  root.add(puffer)
  solids.push(circle(PU.x, PU.z, 0.25))
  const nozzleTip = new THREE.Vector3(PU.x, 1.45, PU.z)

  // ---- what the air does: radon motes, fog at the bottom, steam at the top, smoke ----
  const NM = light ? 120 : 230
  const mPos = new Float32Array(NM * 3)
  const mCol = new Float32Array(NM * 3)
  const mHalo = new Float32Array(NM * 3)
  const motes = Array.from({ length: NM }, () => ({ live: false, fade: 0, dying: false, v: new THREE.Vector3(), p: new THREE.Vector3(), seed: Math.random() * 100 }))
  const mGeo = keep(new THREE.BufferGeometry())
  mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3))
  mGeo.setAttribute('color', new THREE.BufferAttribute(mCol, 3))
  const hGeo = keep(new THREE.BufferGeometry())
  hGeo.setAttribute('position', mGeo.attributes.position)
  hGeo.setAttribute('color', new THREE.BufferAttribute(mHalo, 3))
  const coreMat = keep(new THREE.PointsMaterial({ size: 0.075, map: soft, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
  const haloMat = keep(new THREE.PointsMaterial({ size: 0.3, map: soft, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
  const corePts = new THREE.Points(mGeo, coreMat)
  const haloPts = new THREE.Points(hGeo, haloMat)
  for (const p of [corePts, haloPts]) {
    p.frustumCulled = false
    p.raycast = () => {}
    root.add(p)
  }
  const cTeal = new THREE.Color(TEAL)
  const cHalo = new THREE.Color(HALO)
  const rndM = random(222)
  function spawnMote(m) {
    const a = air()
    m.live = true
    m.dying = false
    m.fade = 0
    if (a.soil > 0.02 && rndM() < 0.25 + a.soil * 0.6) {
      // soil air seeping in at a crack of the ceiling
      const c = stage.cracks[Math.floor(rndM() * stage.cracks.length)]
      const u = (rndM() - 0.5) * c.len
      m.p.set(c.x + Math.cos(c.rot) * u, c.y - 0.1, c.z - Math.sin(c.rot) * u)
      m.v.set(0, -0.25, 0)
    } else {
      // breathed out by the rock: anywhere in the chamber, near the walls and the floor
      for (let k = 0; k < 8; k++) {
        const th = rndM() * TAU
        const r = 0.35 + rndM() * 0.55
        const x = Math.cos(th) * 11.5 * r
        const z = Math.sin(th) * 8.5 * r
        if (stage.rho(x, z) > 0.88) continue
        m.p.set(x, 0.3 + rndM() * Math.min(3.5, stage.ceilingAt(x, z) - 0.5), z)
        break
      }
      m.v.set(0, 0, 0)
    }
  }
  const wander = new THREE.Vector3()
  function stepMotes(dt, t) {
    const a = air()
    const target = Math.round(NM * Math.pow(clamp(C / 3600), 0.85)) + 3
    let alive = 0
    for (const m of motes) if (m.live && !m.dying) alive++
    let spawns = 0
    for (const m of motes) {
      if (alive >= target || spawns > 3) break
      if (!m.live) {
        spawnMote(m)
        alive++
        spawns++
      }
    }
    if (alive > target + 2) {
      for (const m of motes) {
        if (m.live && !m.dying) {
          m.dying = true
          if (--alive <= target + 2) break
        }
      }
    }
    const cam = ctx.camera?.position
    motes.forEach((m, i) => {
      if (!m.live) {
        mCol.set([0, 0, 0], i * 3)
        mHalo.set([0, 0, 0], i * 3)
        return
      }
      flowAt(m.p, out)
      wander.set(Math.sin(t * 0.7 + m.seed), Math.sin(t * 0.5 + m.seed * 1.7) * 0.6, Math.cos(t * 0.6 + m.seed * 0.9)).multiplyScalar(0.08)
      m.v.lerp(out.add(wander), 1 - Math.exp(-dt * 1.5))
      // in winter the cracks breathe out too: motes near one are drawn up into it
      if (a.flow > 0.02) {
        for (const c of stage.cracks) {
          const dx = c.x - m.p.x
          const dz = c.z - m.p.z
          const dy = c.y - m.p.y
          const d = Math.hypot(dx, dy, dz)
          if (d < 2.6) {
            const k = (a.flow * (1 - a.topShare) * 1.2 * dt) / Math.max(0.3, d)
            m.v.x += dx * k
            m.v.y += dy * k
            m.v.z += dz * k
            if (d < 0.35) m.dying = true
          }
        }
      }
      m.p.addScaledVector(m.v, dt)
      // the chamber's floor and walls hold them (the tunnels let them by)
      if (m.p.y < 0.15) m.p.y = 0.15
      const ceil = stage.ceilingAt(m.p.x, m.p.z)
      const n = nearestOnPath(m.p)
      const inStream = n.d < 1.4 && (n.i <= 1 || n.i >= 4)
      if (!inStream) {
        if (ceil > 0.4 && m.p.y > ceil - 0.25) m.p.y = ceil - 0.25
        if (stage.rho(m.p.x, m.p.z) > 0.93) m.p.multiplyScalar(0.995)
      }
      // out of the cave: through the bottom tunnel's far end, or the top opening
      if ((n.i === 0 && n.t < 0.15) || (n.i === P.length - 2 && n.t > 0.85)) m.dying = true
      // a shut door: nothing goes by it
      if (n.i === 0 && !effBot()) m.dying = true
      if (n.i === 6 && !effTop()) m.dying = true
      m.fade = m.dying ? m.fade - dt * 1.4 : Math.min(1, m.fade + dt * 1.2)
      if (m.dying && m.fade <= 0) {
        m.live = false
        m.fade = 0
      }
      mPos.set([m.p.x, m.p.y, m.p.z], i * 3)
      // not in the visitor's face: one near the eye fades
      const near = cam ? clamp((m.p.distanceTo(cam) - 0.7) / 1.3) : 1
      const k = Math.max(0, m.fade) * near
      const tw = 0.8 + 0.2 * Math.sin(t * 2.3 + m.seed)
      mCol.set([cTeal.r * k * 1.6 * tw, cTeal.g * k * 1.6 * tw, cTeal.b * k * 1.6 * tw], i * 3)
      mHalo.set([cHalo.r * k * 0.28, cHalo.g * k * 0.28, cHalo.b * k * 0.28], i * 3)
    })
    mGeo.attributes.position.needsUpdate = true
    mGeo.attributes.color.needsUpdate = true
    hGeo.attributes.color.needsUpdate = true
  }

  /** A pool of soft sprites (fog, steam, smoke). */
  function sprites(n, colorHex, blending = THREE.NormalBlending) {
    return Array.from({ length: n }, () => {
      const s = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: soft, color: colorHex, transparent: true, opacity: 0, depthWrite: false, blending })))
      s.raycast = () => {}
      s.visible = false
      root.add(s)
      return { s, u: Math.random(), life: -1, v: new THREE.Vector3(), seed: Math.random() * 10 }
    })
  }
  const fog = sprites(light ? 12 : 22, '#c9d4e6')
  const steam = sprites(light ? 8 : 14, '#dfe7f4')
  const smoke = sprites(light ? 24 : 40, '#eeeeea')
  // the fog's way: along the floor from outside the bottom tunnel into the chamber
  const fogPath = [new THREE.Vector3(P[0].x, 0.3, P[0].z), new THREE.Vector3(P[1].x, 0.3, P[1].z), new THREE.Vector3(-5.5, 0.25, -3.4)]
  const fogAt = (u, v) => {
    const k = u * 2
    const i = Math.min(1, Math.floor(k))
    return v.lerpVectors(fogPath[i], fogPath[i + 1], k - i)
  }
  fog.forEach((f, i) => (f.u = i / fog.length))
  function stepFog(dt, t) {
    const a = air()
    const f = Math.abs(a.flow) * (effBot() ? 1 : 0)
    const dir = Math.sign(a.flow) || 1
    for (const p of fog) {
      p.u += dir * dt * (0.02 + f * 0.09)
      if (p.u > 1) p.u -= 1
      if (p.u < 0) p.u += 1
      fogAt(p.u, p.s.position)
      p.s.position.x += Math.sin(t * 0.3 + p.seed) * 0.4
      p.s.position.z += Math.cos(t * 0.27 + p.seed) * 0.4
      const edge = Math.sin(Math.PI * p.u)
      p.s.material.opacity = 0.075 * Math.min(1, f * 2.5) * edge
      p.s.visible = p.s.material.opacity > 0.003
      const sc = 1.6 + p.u * 1.8
      p.s.scale.set(sc * 1.5, sc * 0.45, 1)
    }
    // steam over the top opening in the frost: the cave's warm, damp air leaving
    const st = a.flow > 0 ? a.flow * a.topShare : 0
    steam.forEach(p => {
      if (p.life < 0 && st > 0.03 && Math.random() < dt * 2.5) {
        p.life = 0
        // where the passage meets the frost: from a little way past the door out to the opening
        p.s.position.lerpVectors(P[6], P[7], 0.35 + Math.random() * 0.5)
        p.s.position.x += (Math.random() - 0.5) * 0.5
        p.s.position.z += (Math.random() - 0.5) * 0.5
        p.v.set(M.top.out[0] * 0.25 + (Math.random() - 0.5) * 0.15, 0.55 + Math.random() * 0.3, M.top.out[1] * 0.25 + (Math.random() - 0.5) * 0.15)
      }
      if (p.life >= 0) {
        p.life += dt
        p.s.position.addScaledVector(p.v, dt)
        const k = p.life / 4
        p.s.material.opacity = 0.32 * Math.sin(Math.PI * Math.min(1, k)) * Math.max(0.3, st * 1.5)
        const sc = 0.6 + k * 2.2
        p.s.scale.set(sc, sc, 1)
        p.s.visible = true
        if (k >= 1) {
          p.life = -1
          p.s.visible = false
        }
      }
    })
  }
  let puffT = -1
  function stepSmoke(dt) {
    for (const p of smoke) {
      if (p.wait > 0) {
        // waiting its turn at the nozzle: the puff comes out as a ribbon
        p.wait -= dt
        if (p.wait > 0) continue
        p.life = 0
        p.s.visible = true
        p.s.position.copy(nozzleTip)
      }
      if (p.life < 0) continue
      p.life += dt
      // the smoke goes the draught's way along the wall (not drawn into the stream as the motes are)
      const n = nearestOnPath(p.s.position)
      out.copy(n.tan).multiplyScalar(Math.sign(air().flow) * 0.5 * segFlow(n.i))
      p.v.lerp(out, 1 - Math.exp(-dt * 1.5))
      p.s.position.addScaledVector(p.v, dt)
      p.s.position.y += dt * 0.05
      p.s.position.x += Math.sin(p.life * 1.3 + p.seed) * dt * 0.04
      const k = p.life / 8
      p.s.material.opacity = 0.34 * (1 - k) * Math.min(1, p.life * 3)
      const sc = 0.1 + k * 0.85
      p.s.scale.set(sc, sc, 1)
      if (k >= 1) {
        p.life = -1
        p.s.visible = false
      }
    }
    if (puffT >= 0) {
      puffT += dt
      bulb.scale.set(1 + 0.25 * Math.sin(Math.min(1, puffT * 3) * Math.PI), 1.25 * (1 - 0.35 * Math.sin(Math.min(1, puffT * 3) * Math.PI)), 1)
      if (puffT > 0.4) puffT = -1
    }
  }
  /** Release a puff of smoke at the nozzle (played here when anyone puffs). */
  function puffNow() {
    puffT = 0
    play('tap')
    smoke.forEach((p, i) => {
      p.life = -1
      p.wait = 0.0001 + i * 0.03
      p.s.visible = false
      p.s.material.opacity = 0
      p.s.position.copy(nozzleTip)
      p.v.set((Math.random() - 0.5) * 0.1, 0.1 + Math.random() * 0.08, (Math.random() - 0.5) * 0.1)
    })
  }

  // ---- the monitor's board ----
  function drawAir() {
    const lvl = lv()
    const W = E.breath.board
    airBoard.draw((g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, '#111a40')
      grd.addColorStop(1, '#0a1030')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'alphabetic'
      g.fillStyle = '#7fe9f7'
      g.font = font(700, 46)
      g.textAlign = 'left'
      g.fillText(W.title, 40, 66)
      g.font = font(600, 30, 'Nunito')
      g.fillStyle = '#c9d4f2'
      g.textAlign = 'right'
      g.fillText(`${W.outside}: ${fmtT(T)}`, w - 40, 54)
      g.fillText(`${W.cave}: ${fmtT(T_CAVE)}`, w - 40, 92)
      // the number
      g.textAlign = 'left'
      g.fillStyle = '#dff8ff'
      g.font = font(700, 128)
      const s = fmtC(C)
      g.fillText(s, 40, 230)
      const sw = g.measureText(s).width
      g.font = font(600, 44, 'Nunito')
      g.fillStyle = '#9fdcea'
      g.fillText('Bq/m³', 60 + sw, 226)
      g.font = font(600, 28, 'Nunito')
      g.fillStyle = '#9fb0d8'
      g.fillText(W.what[lvl], 40, 276)
      // the scale: 0 to 4000, Postojna's winter and summer, and (Scientist) the EU's reference level
      const x0 = 50
      const x1 = w - 50
      const y = 352
      const xOf = v => x0 + (clamp(v, 0, 4000) / 4000) * (x1 - x0)
      const bar = g.createLinearGradient(x0, 0, x1, 0)
      bar.addColorStop(0, '#1d6f7d')
      bar.addColorStop(1, '#3cc3d6')
      g.fillStyle = 'rgba(255,255,255,0.08)'
      g.fillRect(x0, y - 14, x1 - x0, 28)
      g.fillStyle = bar
      g.fillRect(x0, y - 14, xOf(C) - x0, 28)
      const mark = (v, label, c, up) => {
        g.fillStyle = c
        g.fillRect(xOf(v) - 2, y - 26, 4, 52)
        g.font = font(600, 24, 'Nunito')
        g.textAlign = xOf(v) < 140 ? 'left' : xOf(v) > w - 160 ? 'right' : 'center'
        g.fillText(label, xOf(v), up ? y - 36 : y + 54)
      }
      mark(200, W.winter, '#bfe4ff', false)
      mark(3000, W.summer, '#ffd36a', false)
      if (lvl === 'sci') mark(300, W.eu, '#c9b8ff', true)
      // the needle
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.moveTo(xOf(C), y - 18)
      g.lineTo(xOf(C) - 12, y - 40)
      g.lineTo(xOf(C) + 12, y - 40)
      g.closePath()
      g.fill()
      // the trace of the last minute
      const t0 = 440
      const t1 = h - 40
      g.strokeStyle = 'rgba(160,190,255,0.25)'
      g.lineWidth = 2
      g.strokeRect(x0, t0, x1 - x0, t1 - t0)
      g.font = font(600, 22, 'Nunito')
      g.fillStyle = '#8fa2cf'
      g.textAlign = 'left'
      g.fillText(W.trace, x0 + 10, t0 + 28)
      g.strokeStyle = '#6ff0ff'
      g.lineWidth = 4
      g.beginPath()
      for (let i = 0; i < trace.length; i++) {
        const x = x0 + (i / (trace.length - 1)) * (x1 - x0)
        const yy = t1 - 6 - (clamp(trace[i], 0, 4000) / 4000) * (t1 - t0 - 12)
        if (i) g.lineTo(x, yy)
        else g.moveTo(x, yy)
      }
      g.stroke()
    })
  }

  let seasonTapped = false
  let puffed = false
  let lastSlide = -9
  let mineT = false // the outside temperature was last set by this visitor
  let spokenZone = null
  const zoneOf = () => (T < -6 ? 'snow' : T < T_CAVE - 2 ? 'winter' : T <= T_CAVE + 2 ? 'still' : 'summer')
  spokenZone = zoneOf()
  const breathPanel = l => ({
    title: E.breath.title,
    color: TEAL,
    blocks: [
      ...paras(E.breath.panel[depth(l)]),
      { p: E.breath.tip },
      {
        slider: {
          label: E.breath.slider,
          min: T_MIN,
          max: T_MAX,
          step: 0.5,
          value: T,
          onInput: v => {
            T = v
            mineT = true
            lastSlide = performance.now() / 1000
            seasonTapped = true
            slid('breath')
          },
          format: v => fmtT(v),
          live: () => T,
        },
      },
      {
        buttons: [
          { label: E.breath.buttons.winter, onClick: () => setSeason(WINTER) },
          { label: E.breath.buttons.summer, onClick: () => setSeason(SUMMER) },
          { label: E.breath.buttons.puff, onClick: () => tapPuffer() },
        ],
      },
    ],
  })
  const sliding = {}
  const slid = id => {
    if (sliding[id]) return
    sliding[id] = true
    later(0.2, () => {
      sliding[id] = false
      share(id)
    })
  }
  function setSeason(v) {
    T = v
    mineT = true
    seasonTapped = true
    play('select')
    spokenZone = zoneOf()
    say(at(v > T_CAVE ? E.breath.says.summer : E.breath.says.winter, level()))
    ex.discover('breath', breathPanel, 3.5)
    share('breath')
  }
  const tapSign = () => setSeason(T > T_CAVE ? WINTER : SUMMER)
  function tapPuffer() {
    puffed = true
    puffs++
    puffNow()
    const a = air()
    const still = Math.abs(a.flow) < 0.06
    say(at(still ? E.breath.says.puffStill : a.flow > 0 ? E.breath.says.puffWinter : E.breath.says.puffSummer, level()))
    ex.discover('breath', breathPanel, 4)
    share('breath')
  }
  clickable(sign, tapSign, { reach: 9 })
  clickable(puffer, tapPuffer, { reach: 7 })
  const S1 = { x: B1.x + B1.nx * 3.4 - B1.tx * 0.8, z: B1.z + B1.nz * 3.4 - B1.tz * 0.8 }
  ex.add({
    id: 'breath',
    x: S1.x,
    z: S1.z,
    radius: 2.4,
    manual: true,
    label: E.breath.label,
    verb: () => (!seasonTapped ? E.breath.verbSign : !puffed ? E.breath.verbPuff : E.breath.verbSlide),
    focus: { x: B1.x - B1.tx * 0.8, y: 1.65, z: B1.z - B1.tz * 0.8, size: 2.8, width: 5.3 },
    act: () => ctx.showPanel(breathPanel),
  })
  const breathState = () => ({ T: Math.round(T * 2) / 2, puffs, st: seasonTapped ? 1 : 0 })
  const breathSet = (s, liveSet) => {
    const v = Number(s?.T)
    if (Number.isFinite(v) && v !== T) {
      T = clamp(v, T_MIN, T_MAX)
      mineT = false
    }
    const n = Number(s?.puffs) || 0
    if (n > puffs && liveSet) puffNow()
    puffs = n
    if (s?.st) seasonTapped = true
    spokenZone = zoneOf()
  }

  // =====================================================================================================
  // station 2: the doors
  // =====================================================================================================
  const B2 = onWall(2.9, -8.0, 1.8, 0.9)
  const doorBoard = board({ w: 1.9, h: 1.2, cw: 1024, ch: 646, edge: '#9fd8ff', y: 2.0 })
  doorBoard.group.position.set(B2.x, 0, B2.z)
  doorBoard.group.rotation.y = B2.rot
  root.add(doorBoard.group)
  solids.push(box(B2.x, B2.z, 2.1, 0.9, { rot: B2.rot }))
  // a console under it: three big buttons
  const consoleG = new THREE.Group()
  consoleG.position.set(0, 1.02, 0.32)
  consoleG.rotation.x = 0.45 // its front edge lower, toward the visitor
  consoleG.add(mk(keep(new RoundedBoxGeometry(1.9, 0.08, 0.42, 2, 0.02)), std('#262a36', { metalness: 0.3 }), 0, 0, 0))
  doorBoard.group.add(consoleG)
  doorBoard.group.add(mk(keep(new THREE.BoxGeometry(1.7, 1.0, 0.25)), std('#20232d', { metalness: 0.3 }), 0, 0.5, 0.22))
  const buttons = ['bottom', 'top', 'auto'].map((id, k) => {
    const g = new THREE.Group()
    g.position.set((k - 1) * 0.6, 0.04, 0)
    const capMat = std('#58e0a0', { emissive: '#58e0a0', emissiveIntensity: 0.6, roughness: 0.35 })
    const cap = mk(keep(new THREE.CylinderGeometry(0.11, 0.12, 0.07, 24)), capMat, 0, 0.04, -0.02)
    g.add(mk(keep(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 24)), darkMat, 0, 0.015, -0.02), cap)
    const label = makeText(E.doors.buttons[id], { font: 'body', size: 0.085, color: '#d6def5', maxWidth: 0.58, anchorY: 'top' })
    label.rotation.x = -Math.PI / 2
    label.position.set(0, 0.045, 0.13)
    g.add(label)
    g.add(hitBox(0.4, 0.2, 0.42, 0, 0.05, 0.04))
    consoleG.add(g)
    return { id, g, cap, capMat, label, press: 0 }
  })

  let tappedBot = false
  let tappedTop = false
  let autoSaid = null
  function drawDoors(t) {
    const a = air()
    const W = E.doors.board
    const winter = T <= T_CAVE
    doorBoard.draw((g, w, h) => {
      g.fillStyle = '#0c1336'
      g.fillRect(0, 0, w, h)
      // the mountain, cut open as in the picture
      const sx = x => 40 + x * 0.78
      const sy = y => 40 + y * 0.74
      const mtn = [[-30, 610], [60, 540], [180, 470], [300, 380], [420, 300], [560, 200], [680, 140], [780, 170], [900, 230], [1020, 290], [1120, 380], [1230, 470], [1230, 820], [-30, 820]]
      g.save()
      g.beginPath()
      g.rect(20, 20, w - 40, h - 40)
      g.clip()
      g.fillStyle = '#3a3646'
      g.beginPath()
      mtn.forEach(([x, y], i) => (i ? g.lineTo(sx(x), sy(y)) : g.moveTo(sx(x), sy(y))))
      g.closePath()
      g.fill()
      g.strokeStyle = winter ? '#c8d6ee' : '#5f8f4a'
      g.lineWidth = 12
      g.beginPath()
      mtn.slice(3, 11).forEach(([x, y], i) => (i ? g.lineTo(sx(x), sy(y)) : g.moveTo(sx(x), sy(y))))
      g.stroke()
      // the chamber, the bottom tunnel, the passage up
      g.fillStyle = '#12101c'
      g.beginPath()
      g.ellipse(sx(520), sy(505), 0.78 * 360, 0.74 * 95, 0, 0, TAU)
      g.fill()
      g.strokeStyle = '#12101c'
      g.lineCap = 'round'
      g.lineWidth = 44
      g.beginPath()
      g.moveTo(sx(60), sy(565))
      g.lineTo(sx(240), sy(555))
      g.stroke()
      g.beginPath()
      g.moveTo(sx(780), sy(450))
      g.quadraticCurveTo(sx(880), sy(352), sx(1030), sy(292))
      g.stroke()
      // the soil cracks over the chamber
      g.strokeStyle = 'rgba(20,16,12,0.9)'
      g.lineWidth = 4
      for (const cx of [430, 540, 650]) {
        g.beginPath()
        g.moveTo(sx(cx), sy(290 + (cx - 540) * 0.2))
        g.lineTo(sx(cx + 12), sy(350))
        g.lineTo(sx(cx - 6), sy(415))
        g.stroke()
      }
      g.restore()
      // the draught: dashes moving along the way, blue at the bottom, orange up the passage
      const flowB = segFlow(0)
      const flowT = segFlow(5)
      const dir = Math.sign(a.flow) || 1
      const dash = (pts, c, k) => {
        if (k < 0.02) return
        g.save()
        g.globalAlpha = Math.min(1, 0.25 + k * 1.4)
        g.strokeStyle = c
        g.lineWidth = 9
        g.setLineDash([26, 22])
        g.lineDashOffset = -dir * t * 60 * (0.4 + k)
        g.beginPath()
        pts.forEach(([x, y], i) => (i ? g.lineTo(sx(x), sy(y)) : g.moveTo(sx(x), sy(y))))
        g.stroke()
        g.restore()
      }
      dash([[0, 562], [140, 562], [300, 548], [470, 505], [640, 470], [780, 440]], '#a8d4ff', flowB)
      dash([[780, 440], [880, 360], [960, 318], [1030, 292], [1110, 230]], '#ffb070', flowT)
      // soil air seeping in at the cracks (summer)
      if (a.soil > 0.02) {
        g.fillStyle = TEAL
        for (let k = 0; k < 9; k++) {
          const cx = [430, 540, 650][k % 3]
          const u = (t * 0.35 + k / 9) % 1
          g.globalAlpha = Math.min(1, a.soil * 2) * Math.sin(Math.PI * u)
          g.beginPath()
          g.arc(sx(cx + 4), sy(300 + u * 130), 7, 0, TAU)
          g.fill()
        }
        g.globalAlpha = 1
      }
      // the doors: a gap when open, a bar when shut
      const doorMark = (x, y, open, vertical) => {
        g.save()
        g.translate(sx(x), sy(y))
        g.fillStyle = open ? 'rgba(88,224,160,0.25)' : '#ffb347'
        g.strokeStyle = open ? '#58e0a0' : '#ffd08a'
        g.lineWidth = 5
        if (vertical) {
          g.fillRect(-9, -40, 18, 80)
          g.strokeRect(-9, -40, 18, 80)
        } else {
          g.rotate(-0.6)
          g.fillRect(-40, -9, 80, 18)
          g.strokeRect(-40, -9, 80, 18)
        }
        g.restore()
      }
      doorMark(200, 556, botK > 0.5, true)
      doorMark(1000, 302, topK > 0.5, false)
      // the words
      g.font = font(700, 34)
      g.textAlign = 'left'
      g.fillStyle = '#d6ecff'
      g.fillText(`${W.outside}: ${fmtT(T)}`, 40, 70)
      g.textAlign = 'center'
      g.fillStyle = '#dff8ff'
      g.font = font(700, 54)
      g.fillText(`${fmtC(C)} Bq/m³`, sx(520), sy(660))
      g.font = font(600, 26, 'Nunito')
      g.fillStyle = '#b9c6e6'
      g.fillText(`${W.cave}: ${fmtT(T_CAVE)}`, sx(520), sy(705))
      g.textAlign = 'left'
      g.font = font(700, 26)
      g.fillStyle = botK > 0.5 ? '#9ff0c8' : '#ffd08a'
      g.fillText(botK > 0.5 ? W.open : W.shut, sx(150), sy(640))
      g.fillStyle = topK > 0.5 ? '#9ff0c8' : '#ffd08a'
      g.textAlign = 'right'
      g.fillText(topK > 0.5 ? W.open : W.shut, sx(1180), sy(250))
      g.textAlign = 'right'
      g.font = font(700, 30)
      g.fillStyle = doors.auto ? '#58e0a0' : '#6d7898'
      g.fillText(`${W.auto}: ${doors.auto ? W.on : W.off}`, w - 40, 70)
      if (doors.auto) {
        g.font = font(600, 24, 'Nunito')
        g.fillStyle = '#a6f0cc'
        g.fillText(W.rule, w - 40, 104)
      }
    })
  }

  const doorsPanel = l => ({
    title: E.doors.title,
    color: '#9fd8ff',
    blocks: [
      ...paras(E.doors.panel[depth(l)]),
      { p: E.doors.tip },
      {
        buttons: [
          { label: E.doors.buttons.panelBottom, onClick: () => tapDoor('bot') },
          { label: E.doors.buttons.panelTop, onClick: () => tapDoor('top') },
          { label: E.doors.buttons.panelAuto, onClick: () => tapAuto() },
        ],
      },
    ],
  })
  function tapDoor(which) {
    if (doors.auto) {
      // a hand on a door takes it off automatic
      doors = { top: effTop(), bot: effBot(), auto: 0 }
    }
    doors = { ...doors, [which]: doors[which] ? 0 : 1 }
    if (which === 'bot') tappedBot = true
    else tappedTop = true
    play(doors[which] ? 'select' : 'tap')
    const winter = T <= T_CAVE
    const open = doors[which]
    const key = which === 'bot' ? (open ? 'botOpen' : winter ? 'botShutWinter' : 'botShutSummer') : open ? 'topOpen' : winter ? 'topShutWinter' : 'topShutSummer'
    say(at(E.doors.says[key], level()))
    ex.discover('doors', doorsPanel, 3.5)
    share('doors')
  }
  function tapAuto() {
    doors = doors.auto ? { top: effTop(), bot: effBot(), auto: 0 } : { ...doors, auto: 1 }
    autoSaid = T <= T_CAVE
    play('select')
    say(at(doors.auto ? E.doors.says.autoOn : E.doors.says.autoOff, level()))
    ex.discover('doors', doorsPanel, 3.5)
    share('doors')
  }
  for (const b of buttons) clickable(b.g, () => (b.press = 1, b.id === 'auto' ? tapAuto() : tapDoor(b.id === 'bottom' ? 'bot' : 'top')), { reach: 6 })
  clickable(bottomDoor.group, () => tapDoor('bot'), { reach: 12 })
  clickable(topDoor.group, () => tapDoor('top'), { reach: 11 })
  const S2 = { x: B2.x + B2.nx * 3.3 + B2.tx * 0.3, z: B2.z + B2.nz * 3.3 + B2.tz * 0.3 }
  ex.add({
    id: 'doors',
    x: S2.x,
    z: S2.z,
    radius: 2.4,
    manual: true,
    label: E.doors.label,
    verb: () => (!tappedBot ? E.doors.verbBottom : !tappedTop ? E.doors.verbTop : E.doors.verbAuto),
    focus: { x: B2.x + B2.tx * 0.15, y: 1.62, z: B2.z + B2.tz * 0.15, size: 2.3, width: 3.0 },
    act: () => ctx.showPanel(doorsPanel),
  })
  const doorsState = () => ({ top: doors.top, bot: doors.bot, auto: doors.auto, tb: tappedBot ? 1 : 0, tt: tappedTop ? 1 : 0 })
  const doorsSet = s => {
    doors = { top: s?.top ? 1 : 0, bot: s?.bot ? 1 : 0, auto: s?.auto ? 1 : 0 }
    if (s?.top == null) doors.top = 1
    if (s?.bot == null) doors.bot = 1
    if (s?.tb) tappedBot = true
    if (s?.tt) tappedTop = true
    autoSaid = T <= T_CAVE
  }

  // =====================================================================================================
  // station 3: the guide's year
  // =====================================================================================================
  let hours = H_START
  let plan = false
  let ticket = false
  let badges = 0
  let badgeOn = false
  let badgeK = 0
  // her planning board, facing the room; she stands at its right, as the visitor sees it
  const BG = { x: -8.25, z: 0.0 }
  const BGrot = Math.atan2(-4.2 - BG.x, 3.4 - BG.z)
  const GX = BG.x + Math.cos(BGrot) * 1.75 + Math.sin(BGrot) * 0.75
  const GZ = BG.z - Math.sin(BGrot) * 1.75 + Math.cos(BGrot) * 0.75
  const guide = new THREE.Group()
  const jacket = std('#d86a3a', { roughness: 0.7 })
  const trousers = std('#2a2834', { roughness: 0.8 })
  const skin = std('#e2b892', { roughness: 0.7 })
  const helmetMat = std('#f2c040', { roughness: 0.4 })
  for (const s of [-1, 1]) {
    guide.add(mk(keep(new THREE.CapsuleGeometry(0.075, 0.62, 4, 10)), trousers, s * 0.1, 0.43, 0))
    guide.add(mk(keep(new RoundedBoxGeometry(0.14, 0.08, 0.26, 2, 0.03)), darkMat, s * 0.1, 0.04, 0.04))
  }
  guide.add(mk(keep(new THREE.CapsuleGeometry(0.2, 0.4, 6, 14)), jacket, 0, 1.13, 0))
  guide.add(mk(keep(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 10)), skin, 0, 1.47, 0))
  const head = mk(keep(new THREE.SphereGeometry(0.13, 18, 14)), skin, 0, 1.62, 0)
  for (const s of [-1, 1]) head.add(mk(keep(new THREE.SphereGeometry(0.016, 8, 6)), darkMat, s * 0.045, 0.01, 0.122))
  head.add(mk(keep(new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI)), std('#7a3a2a'), 0, -0.045, 0.118))
  head.children[2].rotation.z = Math.PI
  guide.add(head)
  guide.add(mk(keep(new THREE.SphereGeometry(0.07, 10, 8)), std('#5a3a22', { roughness: 0.9 }), 0, 1.6, -0.14))
  const helmet = mk(keep(new THREE.SphereGeometry(0.155, 18, 10, 0, TAU, 0, Math.PI / 2)), helmetMat, 0, 1.66, 0)
  guide.add(helmet)
  const brim = mk(keep(new THREE.CylinderGeometry(0.19, 0.19, 0.015, 20)), helmetMat, 0, 1.665, 0.02)
  guide.add(brim)
  const lampMat = keep(new THREE.MeshBasicMaterial({ color: '#fff2c0', toneMapped: false }))
  const lamp = mk(keep(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 12)), lampMat, 0, 1.73, 0.15)
  lamp.rotation.x = Math.PI / 2
  guide.add(lamp)
  const beam = mk(keep(new THREE.ConeGeometry(0.42, 2.0, 20, 1, true)), keep(new THREE.MeshBasicMaterial({ color: '#fff0c0', transparent: true, opacity: 0.03, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })), 0, 0, 0)
  beam.raycast = () => {}
  const beamPivot = new THREE.Group()
  beamPivot.position.set(0, 1.73, 0.15)
  beamPivot.rotation.x = 1.15 // forward and up
  beam.position.y = 1.0
  beam.rotation.x = Math.PI
  beamPivot.add(beam)
  guide.add(beamPivot)
  const arms = [-1, 1].map(s => {
    const pivot = new THREE.Group()
    pivot.position.set(s * 0.26, 1.38, 0)
    pivot.add(mk(keep(new THREE.CapsuleGeometry(0.06, 0.44, 4, 10)), jacket, 0, -0.27, 0))
    pivot.add(mk(keep(new THREE.SphereGeometry(0.055, 10, 8)), skin, 0, -0.55, 0))
    pivot.rotation.z = s * 0.12
    guide.add(pivot)
    return pivot
  })
  // the radon badge on her chest
  const badge = new THREE.Group()
  badge.add(mk(keep(new RoundedBoxGeometry(0.075, 0.1, 0.02, 2, 0.006)), std('#f2f2ee', { roughness: 0.4 }), 0, 0, 0))
  const badgeDot = mk(keep(new THREE.CircleGeometry(0.018, 14)), keep(new THREE.MeshBasicMaterial({ color: TEAL, toneMapped: false })), 0, 0.01, 0.011)
  badge.add(badgeDot)
  badge.position.set(0.1, 1.27, 0.2)
  guide.add(badge)
  guide.add(hitBox(0.7, 1.85, 0.6, 0, 0.92, 0))
  guide.position.set(GX, 0, GZ)
  guide.rotation.y = Math.atan2(-4.5 - GX, 2.9 - GZ)
  root.add(guide)
  solids.push(circle(GX, GZ, 0.4))
  // the badge, shown big beside her
  const badgeLens = new THREE.Group()
  const lensTex = keep(canvasTex(512, 512, null, { mipmaps: false }))
  badgeLens.add(mk(keep(new THREE.CircleGeometry(0.42, 40)), keep(new THREE.MeshBasicMaterial({ map: lensTex, toneMapped: false })), 0, 0, 0))
  badgeLens.add(mk(keep(new THREE.TorusGeometry(0.42, 0.025, 8, 48)), edgeOf(TEAL), 0, 0, 0))
  badgeLens.visible = false
  root.add(badgeLens)
  function drawBadge() {
    lensTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0d1640'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#b9bcb6'
      g.beginPath()
      g.roundRect(w * 0.31, h * 0.16, w * 0.38, h * 0.48, 26)
      g.fill()
      g.fillStyle = '#8f928c'
      g.fillRect(w * 0.44, h * 0.1, w * 0.12, h * 0.1)
      g.fillStyle = '#123a52'
      g.beginPath()
      g.arc(w / 2, h * 0.36, 52, 0, TAU)
      g.fill()
      g.fillStyle = TEAL
      g.font = font(700, 54)
      g.textAlign = 'center'
      g.fillText('Rn', w / 2, h * 0.36 + 19)
      g.fillStyle = '#d6ecff'
      g.font = font(700, 34)
      const words = String(at(E.guide.badgeCap, level())).split(' ')
      const lines = []
      let line = ''
      for (const wd of words) {
        const tryL = line ? `${line} ${wd}` : wd
        if (g.measureText(tryL).width > w * 0.8 && line) {
          lines.push(line)
          line = wd
        } else line = tryL
      }
      lines.push(line)
      lines.slice(0, 3).forEach((l, i) => g.fillText(l, w / 2, h * 0.74 + i * 40))
    })
  }
  drawBadge()

  // her planning board
  const guideBoard = board({ w: 2.3, h: 1.5, cw: 1024, ch: 668, edge: '#ffb070', y: 1.95 })
  guideBoard.group.position.set(BG.x, 0, BG.z)
  guideBoard.group.rotation.y = BGrot
  root.add(guideBoard.group)
  solids.push(box(BG.x, BG.z, 2.4, 0.5, { rot: guideBoard.group.rotation.y }))
  // the visitor's ticket, pinned beside the board
  const ticketG = new THREE.Group()
  const ticketTex = keep(canvasTex(512, 256, null, { mipmaps: false }))
  const ticketFace = mk(keep(new THREE.PlaneGeometry(0.62, 0.31)), keep(new THREE.MeshBasicMaterial({ map: ticketTex, toneMapped: false, side: THREE.DoubleSide })), 0, 0, 0)
  ticketG.add(ticketFace)
  ticketG.add(hitBox(0.7, 0.4, 0.1, 0, 0, 0))
  ticketG.position.set(-1.5, 1.42, 0.04)
  ticketG.rotation.z = 0.12
  guideBoard.group.add(ticketG)
  ticketTex.userData.redraw((g, w, h) => {
    g.fillStyle = '#f3e3b6'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = '#b8964a'
    g.setLineDash([10, 8])
    g.lineWidth = 4
    g.strokeRect(12, 12, w - 24, h - 24)
    g.setLineDash([])
    g.fillStyle = '#5a3a14'
    g.textAlign = 'center'
    g.font = font(700, 52)
    g.fillText(E.guide.ticket.title, w / 2, 96)
    g.font = font(600, 36, 'Nunito')
    g.fillText(E.guide.ticket.line, w / 2, 160)
    g.font = font(700, 40)
    g.fillText('1½ h', w / 2, 214)
  })
  const MONTH_ZONE = { u0: 0.04, u1: 0.62, v0: 0.36, v1: 0.86 } // where the months are on the board (uv)

  const monthC = () => MONTH_T.map(tm => (doors.auto ? caveAir(tm, tm <= T_CAVE ? 1 : 0, tm <= T_CAVE ? 1 : 0) : caveAir(tm, doors.top, doors.bot)).C)
  const monthHours = () => MONTH_T.map((_, m) => ((hours * WEEKS) / 12) * (plan ? (SUMMER_MONTHS.includes(m) ? PLAN_SUMMER : PLAN_WINTER) : 1))
  const yearDose = () => {
    const cs = monthC()
    return monthHours().reduce((s, h, m) => s + h * cs[m] * DCC, 0)
  }
  const visitDose = () => VISIT_H * monthC()[6] * DCC
  function drawGuide() {
    const W = E.guide.board
    const lvl = lv()
    const cs = monthC()
    const hs = monthHours()
    const dose = yearDose()
    guideBoard.draw((g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, '#16163a')
      grd.addColorStop(1, '#0d0f2c')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#ffc48a'
      g.font = font(700, 44)
      g.textAlign = 'left'
      g.fillText(W.title, 36, 62)
      g.font = font(600, 28, 'Nunito')
      g.fillStyle = '#c9d4f2'
      g.textAlign = 'right'
      g.fillText(fill(W.hours, { h: Math.round(hours) }), w - 36, 56)
      g.fillStyle = plan ? '#9ff0c8' : '#7d86a6'
      g.fillText(plan ? W.planOn : W.planOff, w - 36, 92)
      // the months: the cave's radon each month (bars), her hours (dots)
      const mx0 = 50
      const mx1 = w * 0.6
      const my0 = 140
      const my1 = 520
      g.font = font(600, 22, 'Nunito')
      g.fillStyle = '#9fb0d8'
      g.textAlign = 'left'
      g.fillText(W.months[lvl], mx0, my0 - 14)
      const cw = (mx1 - mx0) / 12
      cs.forEach((c, m) => {
        const x = mx0 + m * cw
        const bh = (clamp(c, 0, 4000) / 4000) * (my1 - my0 - 60)
        g.fillStyle = SUMMER_MONTHS.includes(m) ? 'rgba(60,195,214,0.85)' : 'rgba(60,195,214,0.5)'
        g.fillRect(x + 6, my1 - 34 - bh, cw - 12, bh)
        g.fillStyle = '#c9d4f2'
        g.textAlign = 'center'
        g.font = font(700, 24)
        g.fillText(E.guide.monthLetters[m], x + cw / 2, my1 - 6)
        // her hours that month: an orange dot, higher for more hours
        const hy = my1 - 34 - (hs[m] / ((H_MAX * WEEKS) / 12) / 1.5) * (my1 - my0 - 60)
        g.fillStyle = '#ffb070'
        g.beginPath()
        g.arc(x + cw / 2, hy, 8, 0, TAU)
        g.fill()
      })
      g.font = font(600, 21, 'Nunito')
      g.textAlign = 'left'
      g.fillStyle = 'rgba(60,195,214,0.95)'
      g.fillText(`■ ${W.radonKey}`, mx0, my1 + 30)
      g.fillStyle = '#ffb070'
      g.fillText(`● ${W.hoursKey}`, mx0 + 230, my1 + 30)
      g.fillStyle = '#8fa2cf'
      g.fillText(W.tapMonths, mx0, my1 + 60)
      // her year: one bar against the limit
      const bx0 = w * 0.66
      const bx1 = w - 60
      const by0 = 150
      const by1 = 560
      const yOf = v => by1 - (clamp(v, 0, 25) / 25) * (by1 - by0)
      g.fillStyle = 'rgba(255,255,255,0.07)'
      g.fillRect(bx0, by0, bx1 - bx0, by1 - by0)
      const over = dose > LIMIT
      g.fillStyle = over ? '#ffb347' : '#3cc3d6'
      g.fillRect(bx0 + 30, yOf(dose), (bx1 - bx0) * 0.42, by1 - yOf(dose))
      if (ticket) {
        g.fillStyle = '#f3e3b6'
        const vy = yOf(visitDose())
        g.fillRect(bx0 + (bx1 - bx0) * 0.62, Math.min(vy, by1 - 3), (bx1 - bx0) * 0.24, Math.max(3, by1 - vy))
        g.font = font(600, 20, 'Nunito')
        g.textAlign = 'center'
        g.fillStyle = '#f3e3b6'
        g.fillText(W.visit, bx0 + (bx1 - bx0) * 0.74, by1 - 16)
        g.fillText(`${num(visitDose(), 2, lang)} mSv`, bx0 + (bx1 - bx0) * 0.74, by1 - 40)
      }
      // the limit
      g.strokeStyle = '#ffd08a'
      g.lineWidth = 4
      g.setLineDash([14, 10])
      g.beginPath()
      g.moveTo(bx0 - 6, yOf(LIMIT))
      g.lineTo(bx1 + 6, yOf(LIMIT))
      g.stroke()
      g.setLineDash([])
      g.font = font(700, 24)
      g.fillStyle = '#ffd08a'
      g.textAlign = 'right'
      g.fillText(W.limit[lvl], bx1, yOf(LIMIT) - 10)
      g.textAlign = 'center'
      g.font = font(700, 40)
      g.fillStyle = over ? '#ffc070' : '#dff8ff'
      g.fillText(`${num(dose, 1, lang)} mSv`, bx0 + 30 + (bx1 - bx0) * 0.21, Math.max(by0 + 40, yOf(dose) - 14))
      g.font = font(600, 24, 'Nunito')
      g.fillStyle = '#c9d4f2'
      g.fillText(W.year, bx0 + 30 + (bx1 - bx0) * 0.21, by1 + 34)
      if (lvl === 'sci') {
        g.font = font(600, 20, 'Nunito')
        g.fillStyle = '#8fa2cf'
        g.textAlign = 'right'
        g.fillText(W.icrp, w - 36, h - 22)
      }
    })
  }

  let tappedGuide = false
  let tappedTicket = false
  let overSaid = false
  const guidePanel = l => ({
    title: E.guide.title,
    color: '#ffb070',
    blocks: [
      ...paras(E.guide.panel[depth(l)]),
      { p: E.guide.tip },
      {
        slider: {
          label: E.guide.slider,
          min: 0,
          max: H_MAX,
          step: 1,
          value: hours,
          onInput: v => {
            hours = v
            lastHours = performance.now() / 1000
            slid('guide')
          },
          format: v => fill(E.guide.board.hours, { h: Math.round(v) }),
          live: () => hours,
        },
      },
      {
        buttons: [
          { label: E.guide.buttons.badge, onClick: () => tapGuide() },
          { label: E.guide.buttons.ticket, onClick: () => tapTicket() },
          { label: E.guide.buttons.plan, onClick: () => tapMonths() },
        ],
      },
    ],
  })
  let lastHours = -9
  function tapGuide() {
    tappedGuide = true
    badges++
    badgeOn = true
    badgeShownAt = 0
    play('select')
    say(at(E.guide.says.badge, level()))
    ex.discover('guide', guidePanel, 3.5)
    share('guide')
  }
  function tapTicket() {
    tappedTicket = true
    ticket = !ticket
    play(ticket ? 'select' : 'tap')
    if (ticket) say(fill(at(E.guide.says.ticket, level()), { v: num(visitDose(), 2, lang) }))
    ex.discover('guide', guidePanel, 3.5)
    share('guide')
  }
  function tapMonths() {
    plan = !plan
    play('select')
    say(fill(at(plan ? E.guide.says.planOn : E.guide.says.planOff, level()), { d: num(yearDose(), 1, lang) }))
    ex.discover('guide', guidePanel, 3.5)
    share('guide')
  }
  clickable(guide, tapGuide, { reach: 6 })
  clickable(ticketG, tapTicket, { reach: 7 })
  clickable(guideBoard.face, tapMonths, {
    reach: 7,
    accept: h => !!h.uv && h.uv.x > MONTH_ZONE.u0 && h.uv.x < MONTH_ZONE.u1 && h.uv.y > MONTH_ZONE.v0 && h.uv.y < MONTH_ZONE.v1,
  })
  const S3 = { x: -4.5, z: 2.9 }
  ex.add({
    id: 'guide',
    x: S3.x,
    z: S3.z,
    radius: 2.3,
    manual: true,
    label: E.guide.label,
    verb: () => (!tappedGuide ? E.guide.verbGuide : !tappedTicket ? E.guide.verbTicket : E.guide.verbMonths),
    focus: { x: BG.x + Math.cos(BGrot) * 0.2, y: 1.45, z: BG.z - Math.sin(BGrot) * 0.2, size: 2.4, width: 4.5 },
    act: () => ctx.showPanel(guidePanel),
  })
  const guideState = () => ({ h: Math.round(hours), plan: plan ? 1 : 0, ticket: ticket ? 1 : 0, badges, tg: tappedGuide ? 1 : 0, tt: tappedTicket ? 1 : 0 })
  const guideSet = (s, liveSet) => {
    const v = Number(s?.h)
    if (Number.isFinite(v)) hours = clamp(Math.round(v), 0, H_MAX)
    plan = !!s?.plan
    ticket = !!s?.ticket
    const b = Number(s?.badges) || 0
    if (b > badges) badgeOn = true
    if (b > badges && liveSet) play('select')
    badges = b
    if (s?.tg) tappedGuide = true
    if (s?.tt) tappedTicket = true
    overSaid = yearDose() > LIMIT
  }

  // =====================================================================================================
  // every frame
  // =====================================================================================================
  let lastLevel = level()
  let drawT = 0
  let guideKey = ''
  let badgeShownAt = 0
  updates.push((dt, t) => {
    const a = air()
    // the reading eases toward the cave's steady radon (sped up: in a real cave it takes days)
    C = damp(C, a.C, 0.75, dt)
    flowK = damp(flowK, a.flow, 2, dt)
    traceT += dt
    if (traceT > 0.25) {
      traceT = 0
      trace.copyWithin(0, 1)
      trace[trace.length - 1] = C
    }
    // the doors follow their state
    botK = damp(botK, effBot(), 3, dt)
    topK = damp(topK, effTop(), 3, dt)
    bottomDoor.set(botK)
    topDoor.set(topK)
    // automatic: the doors move by themselves when the season turns; the Atomling says so once, to the
    // visitor who turned it (a change from someone else in the room is theirs to hear about)
    if (doors.auto && autoSaid !== null && autoSaid !== T <= T_CAVE && performance.now() / 1000 - lastSlide > 0.7) {
      autoSaid = T <= T_CAVE
      if (mineT) say(at(autoSaid ? E.doors.says.autoOpens : E.doors.says.autoShuts, level()))
    }
    // the outside: the season, snow on the top opening when it is very cold
    season = damp(season, T > T_CAVE ? 1 : 0, 1.5, dt)
    stage.setSeason(season)
    stage.setDrift(a.snow)
    if ((T > T_CAVE ? 1 : 0) !== signSeason) drawSign()
    // the Atomling remarks on where the slider came to rest
    const now = performance.now() / 1000
    if (now - lastSlide > 0.8 && lastSlide > 0) {
      const z = zoneOf()
      if (z !== spokenZone) {
        spokenZone = z
        say(at(E.breath.says[z], level()))
      }
    }
    const hd = yearDose()
    if (now - lastHours > 0.8 && lastHours > 0) {
      if (hd > LIMIT && !overSaid) {
        overSaid = true
        say(at(E.guide.says.over, level()))
      } else if (hd <= LIMIT && overSaid) overSaid = false
    }
    ledMat.color.set(Math.sin(t * 3) > 0.6 ? '#b8ffd6' : '#4fd98a')
    // the boards, a few times a second
    drawT += dt
    const lvNow = level()
    if (drawT > 0.12 || lvNow !== lastLevel) {
      drawT = 0
      drawAir()
      drawDoors(t)
      if (lvNow !== lastLevel) drawBadge()
      lastLevel = lvNow
    }
    const gk = `${hours}|${plan}|${ticket}|${doors.top}${doors.bot}${doors.auto}|${lvNow}`
    if (gk !== guideKey) {
      guideKey = gk
      drawGuide()
    }
    for (const b of buttons) {
      const on = b.id === 'auto' ? doors.auto : b.id === 'bottom' ? effBot() : effTop()
      b.capMat.color.set(b.id === 'auto' ? (on ? '#58e0a0' : '#556078') : on ? '#58e0a0' : '#ffb347')
      b.capMat.emissive.copy(b.capMat.color)
      b.press = Math.max(0, b.press - dt * 5)
      b.cap.position.y = 0.04 - b.press * 0.025
    }
    // the guide: breathing, her badge held up when tapped
    badgeK = damp(badgeK, badgeOn ? 1 : 0, 4, dt)
    arms[1].rotation.x = -badgeK * 0.9
    arms[1].rotation.z = 0.12 + badgeK * 0.5
    guide.children[2].scale.y = 1 + Math.sin(t * 1.4) * 0.01
    head.rotation.y = Math.sin(t * 0.35) * 0.25
    badgeLens.visible = badgeK > 0.03
    if (badgeLens.visible) {
      const s = Math.max(0.01, badgeK)
      badgeLens.scale.setScalar(s)
      const fx = Math.sin(guide.rotation.y)
      const fz = Math.cos(guide.rotation.y)
      badgeLens.position.set(GX + fx * 0.55 + fz * 0.75, 1.7 + Math.sin(t * 1.3) * 0.03, GZ + fz * 0.55 - fx * 0.75)
      badgeLens.rotation.y = guide.rotation.y
    }
    badgeDot.material.color.set(Math.sin(t * 2) > 0 ? TEAL : '#1d6f7d')
    stepMotes(dt, t)
    stepFog(dt, t)
    stepSmoke(dt)
  })
  // the badge goes down a while after it was shown
  updates.push(() => {
    if (badgeOn && !badgeShownAt) badgeShownAt = performance.now()
    if (badgeOn && performance.now() - badgeShownAt > 7000) {
      badgeOn = false
      badgeShownAt = 0
    }
  })

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.6 },
    cameraPitchMax: 0.45,
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: -1.9, z: 3.9, yaw: 0.5 },
    back: { x: 0, z: 7.2, rot: Math.PI },
    stand: { x: 3.4, z: 4.4, rot: -0.75 },
    parts: {
      stage,
      air: () => ({ ...air(), reading: C, T }),
      breath: {
        tap: what => (what === 'sign' ? tapSign() : tapPuffer()),
        setT: v => {
          T = clamp(v, T_MIN, T_MAX)
          mineT = true
          seasonTapped = true
          lastSlide = performance.now() / 1000
        },
        get T() {
          return T
        },
        get C() {
          return C
        },
        settle: () => (C = air().C),
      },
      doors: {
        tap: what => (what === 'auto' ? tapAuto() : tapDoor(what === 'top' ? 'top' : 'bot')),
        get state() {
          return { ...doors, top: effTop(), bot: effBot() }
        },
      },
      guide: {
        tap: what => (what === 'guide' ? tapGuide() : what === 'ticket' ? tapTicket() : tapMonths()),
        setH: v => {
          hours = clamp(Math.round(v), 0, H_MAX)
          lastHours = performance.now() / 1000
        },
        get dose() {
          return yearDose()
        },
        get visit() {
          return visitDose()
        },
      },
    },
    panels: { breath: breathPanel, doors: doorsPanel, guide: guidePanel },
    shared: {
      breath: { get: breathState, set: breathSet },
      doors: { get: doorsState, set: doorsSet },
      guide: { get: guideState, set: guideSet },
    },
    update(dt, t) {
      stage.update(dt, t)
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const o of own) o.dispose?.()
    },
  }
}
