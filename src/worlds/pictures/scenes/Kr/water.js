// Krypton's picture "Water a million years old?" as a room (docs/knowledge/picture-rooms.md): an oasis in
// Egypt's Western Desert at dusk (stages/desert.js), where the Nubian Sandstone Aquifer's water is
// pumped up, and krypton-81 tells its age. Three things to do, each step chosen by tapping its thing (the
// user, 2026-10-30: pressing E through fixed steps felt passive); the prompt names the next tap, E opens the
// station's panel, whose buttons and sliders do the same:
// - the long window ("the picture's faded window, made a place"): a cut through the sand from the Uweinat
//   hills to the oasis. Tap the rain cloud (in a wet time) and rain soaks into the sandstone with krypton
//   from the air (most of it ordinary, a very few atoms drawn big and labelled: krypton-81); tap the time
//   line (or the slider) to let a million years go by: the desert comes and goes while the water creeps
//   north (1 m a year, a counter), and the big krypton-81 dots fade by half every 229 000 years;
// - the well: tap the pump (litres climb into the thousands), tap the valve on the degassing tank (the gas
//   goes into a bottle), tap the bottle (its gas is split on a board: nitrogen, argon, a few krypton);
// - the atom trap, in a tent: tap the krypton gas (atoms stream through six laser beams; ordinary krypton
//   flies straight on, the rare krypton-81 slows, is caught at the crossing and glows), tap the bottle of air
//   or of the well's water (the catches come at the sample's rate), tap a mark on the dial or use the slider
//   to choose how old the water is: the camera screen turns the count into the age.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes. Sources: the head of water.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, fill, num, clamp, smooth, damp, random, hdr, standingScreen } from '../../../wings/noble/kit.js'
import { desertStage } from '../../stages/desert.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { KR_WATER_WORDS } from './water.words.js'

export const WORDS = KR_WATER_WORDS

const TAU = Math.PI * 2
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const wall = () => Date.now() / 1000
// a number in 0..1 from a seed and an index, the same on every screen
const hash = (seed, j, k = 0) => {
  let h = (seed * 374761393 + j * 668265263 + k * 2246822519) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// ---- where things stand (metres; the spawn at z = 4.6 looks along -z) ----
const SRC = { x: 0.4, z: -8.3 }
const FACE = { w: 4.2, h: 1.3, y0: 0.82 }
const PLINTH = { h: 0.7, d: 0.5 }
const WELL = { x: -4.55, z: -3.2 }
const TANK = { x: -3.35, z: -3.55 }
const BOTTLE = { x: -2.5, z: -3.15 }
const BOARD = { x: -1.45, z: -3.35 }
const TENT = { x: 6.1, z: -3.7 }

// ---- the facts the room counts with ----
const HALF = 229000 // krypton-81's half-life, years
const CREEP = 1 // metres a year (the board says a metre or two)
const MILLION = 1e6
const NEED_L = 1500 // litres before the gas is worth collecting
const CAP_L = 8000
const PUMP_RATE = 600 // litres a second, sped up
// ratio of krypton to nitrogen in air-saturated water at 10 degrees C (46 nL against 14.5 mL a litre)
const KR_PER_MILLION_N = 3

// ---- the long window ----
const FW = 1344
const FH = 416
const S_Y = 0.4 * FH // the ground's surface
const A_Y = 0.46 * FH // the sandstone's top
const B_Y = 0.82 * FH // its floor
const WET = [[-0.06, 0.1], [0.22, 0.34], [0.47, 0.58], [0.72, 0.8]] // only for show
const wetAt = k => Math.max(...WET.map(([a, b]) => smooth(a - 0.025, a + 0.01, k) * (1 - smooth(b - 0.005, b + 0.03, k))))
const FRONT0 = 0.115
const FRONT_PER_K = 0.775
const WELL_X = 0.885
const TRACK = { x0: 330, x1: 1010 }
const mixc = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), clamp(t)).getStyle()

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const stage = desertStage({
    radius: 11,
    light,
    pool: { x: -7.4, z: -5.4, r: 1.5 },
    palms: [[-8.4, -3.9, 4.8], [-8.3, -6.3, 4.1], [-6.0, -7.4, 4.6], [-6.4, -2.4, 3.6], [-9.1, -5.2, 4.4]],
    fields: [{ x: -4.9, z: -8.6, w: 2.8, d: 1.5 }],
  })
  root.add(stage.group)
  const solids = stage.solids
  const groundAt = stage.groundAt
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const tag = lang === 'pt-pt' ? 'pt-PT' : lang
  const yearsText = n => Math.round(n).toLocaleString(tag)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const steel = new THREE.MeshStandardMaterial({ color: '#8d969e', roughness: 0.35, metalness: 0.7 })
  const darkMetal = new THREE.MeshStandardMaterial({ color: '#3c424b', roughness: 0.5, metalness: 0.6 })
  const concrete = new THREE.MeshStandardMaterial({ color: '#8a8070', roughness: 0.95 })
  const paint = new THREE.MeshStandardMaterial({ color: '#2f9d92', roughness: 0.5, metalness: 0.2 })
  const redPaint = new THREE.MeshStandardMaterial({ color: '#d2493a', roughness: 0.45, metalness: 0.2 })
  const rimMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, roughness: 0.4 })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#bfe8f2', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false })
  const label = (text, size, c = '#ffffff', extra = {}) => makeText(text, { size, color: c, ...extra })
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  const repanel = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const panelOf = (title, paras, extra) => lv => ({
    title,
    color,
    blocks: [...(extra ? extra(lv) : []), ...paras[depthOf(lv)].map(p => ({ p }))],
  })
  const faceTo = (obj, x, z) => (obj.rotation.y = Math.atan2(x - obj.position.x, z - obj.position.z))
  const hitBox = (w, h, d, x, y, z, parent = root) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ghost)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  let sliding = false
  const slid = id => {
    if (sliding) return
    sliding = true
    later(0.2, () => {
      sliding = false
      share(id)
    })
  }
  const soft = canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  disposers.push(() => soft.dispose())
  /** A cloud of points that is never a tap target (three's raycaster would catch it within a metre). */
  const cloud = (n, c, size, opacity = 1) => {
    const pos = new Float32Array(n * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: c, size, map: soft, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    pts.raycast = () => {}
    return { pts, pos, geo, mat }
  }

  // =====================================================================================================
  // ======== station 1: the long window: where the water came from ========
  // =====================================================================================================
  const faceTex = canvasTex(FW, FH, null, { mipmaps: false })
  const trackTex = canvasTex(FW, 64, null, { mipmaps: false })
  disposers.push(() => faceTex.dispose(), () => trackTex.dispose())
  const faceY = FACE.y0 + FACE.h / 2
  const frameBox = new THREE.Group()
  frameBox.position.set(SRC.x, 0, SRC.z)
  root.add(frameBox)
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(FACE.w + 0.2, PLINTH.h, PLINTH.d, 3, 0.04), concrete)
    plinth.position.set(0, PLINTH.h / 2, 0.1)
    frameBox.add(plinth)
    const t = 0.07
    for (const [w, h, x, y] of [
      [FACE.w + 2 * t, t, 0, FACE.y0 - t / 2],
      [FACE.w + 2 * t, t, 0, FACE.y0 + FACE.h + t / 2],
      [t, FACE.h, -(FACE.w + t) / 2, faceY],
      [t, FACE.h, (FACE.w + t) / 2, faceY],
    ]) {
      const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.14, 2, 0.02), rimMat)
      b.position.set(x, y, 0)
      frameBox.add(b)
    }
    const backer = new THREE.Mesh(new THREE.BoxGeometry(FACE.w, FACE.h, 0.1), new THREE.MeshStandardMaterial({ color: '#10142e', roughness: 0.6 }))
    backer.position.set(0, faceY, -0.06)
    frameBox.add(backer)
  }
  solids.push(box(SRC.x, SRC.z + 0.1, FACE.w + 0.3, PLINTH.d + 0.1))
  const face = new THREE.Mesh(new THREE.PlaneGeometry(FACE.w, FACE.h), new THREE.MeshBasicMaterial({ map: faceTex, toneMapped: false }))
  face.position.set(0, faceY, 0.02)
  frameBox.add(face)
  const trackMesh = new THREE.Mesh(new THREE.PlaneGeometry(FACE.w, FACE.w * (64 / FW)), new THREE.MeshBasicMaterial({ map: trackTex, toneMapped: false }))
  trackMesh.position.set(0, 0.4, 0.1 + PLINTH.d / 2 + 0.004)
  frameBox.add(trackMesh)

  // ---- the window's state (shared): the time, the rains, the last rain ----
  const S = { k: 0, bursts: [], rain: null }
  let kNow = 0
  let faceDrawn = -1
  let faceAt = 0
  const rained = () => S.bursts.length > 0
  const wetNow = () => wetAt(S.k) > 0.5
  const frontAt = k => clamp(FRONT0 + FRONT_PER_K * k, 0, WELL_X)
  const kmAt = k => k * (MILLION * CREEP) / 1000
  const distText = km => (km < 1 ? fill(E.source.dist.m, { n: Math.round(km * 1000) }) : fill(E.source.dist.km, { n: Math.round(km).toLocaleString(tag) }))

  // static things drawn on the window: sandstone grains, small krypton dots, the rain's drops
  const GRAINS = Array.from({ length: 700 }, (_, i) => ({ x: hash(1, i) * FW, y: A_Y + hash(1, i, 1) * (B_Y - A_Y), r: 1 + hash(1, i, 2) * 2.4, d: hash(1, i, 3) < 0.5 }))
  const SMALL = Array.from({ length: 84 }, (_, i) => ({ x: hash(2, i), y: A_Y + 14 + hash(2, i, 1) * (B_Y - A_Y - 28) }))
  const DROPS = Array.from({ length: 90 }, (_, i) => ({ x: 0.055 + hash(3, i) * 0.15, t0: hash(3, i, 1) * 1.8, kr: i % 7 === 0, big: i % 30 === 0 }))
  const ROCKS = Array.from({ length: 50 }, (_, i) => ({ x: hash(4, i) * FW, y: B_Y + 6 + hash(4, i, 1) * (FH - B_Y - 10), r: 2 + hash(4, i, 2) * 5 }))
  const bigDots = (burstK, bi) => Array.from({ length: 3 }, (_, j) => ({ k: burstK, off: 0.012 * j * 2.2 + 0.01, y: A_Y + 28 + hash(5, bi * 3 + j) * (B_Y - A_Y - 56) }))

  const cloudRect = { u0: 0.03, u1: 0.33, v0: 0.72, v1: 0.99 } // where a tap on the rain cloud counts

  function drawFace(t) {
    const w = wetAt(kNow)
    const years = MILLION * (1 - kNow)
    const rainAge = S.rain == null ? 99 : wall() - S.rain
    faceTex.userData.redraw(g => {
      g.clearRect(0, 0, FW, FH)
      const font = (size, weight = 700) => (g.font = `${weight} ${size}px Outfit, Nunito, sans-serif`)
      const txt = (s, x, y, size, c = '#ffffff', align = 'left', weight = 700) => {
        font(size, weight)
        g.textAlign = align
        g.textBaseline = 'middle'
        g.lineWidth = Math.max(3, size / 7)
        g.strokeStyle = 'rgba(8,12,34,0.85)'
        g.strokeText(s, x, y)
        g.fillStyle = c
        g.fillText(s, x, y)
      }
      // sky
      const sky = g.createLinearGradient(0, 0, 0, S_Y)
      sky.addColorStop(0, mixc('#e39a52', '#4f9ee0', w))
      sky.addColorStop(1, mixc('#fbdca4', '#cfeaf7', w))
      g.fillStyle = sky
      g.fillRect(0, 0, FW, S_Y + 2)
      if (w < 0.9) {
        g.globalAlpha = 1 - w
        const sg = g.createRadialGradient(FW * 0.72, 70, 4, FW * 0.72, 70, 60)
        sg.addColorStop(0, '#fffbe6')
        sg.addColorStop(0.4, '#ffe08a')
        sg.addColorStop(1, 'rgba(255,224,138,0)')
        g.fillStyle = sg
        g.fillRect(FW * 0.72 - 70, 0, 140, 140)
        g.globalAlpha = 1
      }
      // clouds
      const puff = (x, y, s, c, a) => {
        g.globalAlpha = a
        g.fillStyle = c
        for (const [dx, dy, r] of [[0, 0, 34], [30, -12, 30], [-30, -8, 26], [62, 6, 24], [-58, 6, 22], [14, 10, 30]]) {
          g.beginPath()
          g.arc(x + dx * s, y + dy * s, r * s, 0, TAU)
          g.fill()
        }
        g.globalAlpha = 1
      }
      puff(FW * 0.58, 62, 1, '#ffffff', w * 0.9)
      puff(FW * 0.84, 84, 0.8, '#ffffff', w * 0.85)
      const rainA = smooth(0.3, 0.7, w)
      puff(FW * 0.15, 60, 2.1, mixc('#8b95a8', '#6f7a90', 0.5), rainA)
      puff(FW * 0.21, 44, 1.5, '#9aa4b6', rainA)
      // far hills (the Uweinat uplift) and dunes
      g.fillStyle = '#6c5744'
      g.beginPath()
      g.moveTo(0, S_Y)
      for (const [x, y] of [[0, 0.1], [0.025, 0.04], [0.06, 0.09], [0.1, 0.03], [0.14, 0.1], [0.19, 0.14], [0.24, 0.2]]) g.lineTo(x * FW, S_Y - (1 - y) * 92 + 8)
      g.lineTo(0.28 * FW, S_Y)
      g.closePath()
      g.fill()
      g.fillStyle = 'rgba(40,28,24,0.28)'
      g.beginPath()
      g.moveTo(0.02 * FW, S_Y)
      g.lineTo(0.06 * FW, S_Y - 80)
      g.lineTo(0.11 * FW, S_Y)
      g.closePath()
      g.fill()
      if (w < 0.95) {
        g.globalAlpha = 1 - w
        for (const [c, off, amp] of [['#e8bd80', 0, 24], ['#d09a5a', 30, 16]]) {
          g.fillStyle = c
          g.beginPath()
          g.moveTo(0.18 * FW, S_Y)
          for (let x = 0.18 * FW; x <= FW; x += 12) g.lineTo(x, S_Y - 12 - amp * (0.5 + 0.5 * Math.sin(x * 0.011 + off)))
          g.lineTo(FW, S_Y)
          g.closePath()
          g.fill()
        }
        g.globalAlpha = 1
      }
      // ground
      const ground = g.createLinearGradient(0, S_Y - 4, 0, A_Y)
      ground.addColorStop(0, mixc('#d8b274', '#6aa845', w))
      ground.addColorStop(1, mixc('#bf8e55', '#4d8a39', w))
      g.fillStyle = ground
      g.fillRect(0, S_Y - 4, FW, A_Y - S_Y + 6)
      // a wet time: a lake, an acacia, giraffes, grass
      if (w > 0.3) {
        g.globalAlpha = smooth(0.3, 0.8, w)
        g.fillStyle = '#4aa6d8'
        g.beginPath()
        g.ellipse(FW * 0.38, S_Y + 8, 90, 11, 0, 0, TAU)
        g.fill()
        g.fillStyle = 'rgba(255,255,255,0.35)'
        g.fillRect(FW * 0.38 - 50, S_Y + 4, 60, 2)
        // acacia
        g.fillStyle = '#5b3f2a'
        g.beginPath()
        g.moveTo(FW * 0.585, S_Y + 4)
        g.lineTo(FW * 0.59, S_Y - 40)
        g.lineTo(FW * 0.598, S_Y - 40)
        g.lineTo(FW * 0.603, S_Y + 4)
        g.fill()
        g.fillStyle = '#3f7f34'
        g.beginPath()
        g.ellipse(FW * 0.594, S_Y - 52, 74, 16, 0, 0, TAU)
        g.fill()
        g.fillStyle = '#4f9640'
        g.beginPath()
        g.ellipse(FW * 0.594, S_Y - 58, 52, 11, 0, 0, TAU)
        g.fill()
        const giraffe = (x, s, flip) => {
          g.save()
          g.translate(x, S_Y + 6)
          g.scale(flip * s, s)
          g.strokeStyle = '#b07a30'
          g.lineWidth = 5
          for (const lx of [-20, -12, 14, 22]) {
            g.beginPath()
            g.moveTo(lx, -30)
            g.lineTo(lx + (lx > 0 ? 2 : -2), 0)
            g.stroke()
          }
          g.fillStyle = '#dca64d'
          g.beginPath()
          g.ellipse(0, -38, 34, 16, 0, 0, TAU)
          g.fill()
          g.beginPath()
          g.moveTo(20, -42)
          g.lineTo(40, -92)
          g.lineTo(49, -90)
          g.lineTo(34, -34)
          g.closePath()
          g.fill()
          g.beginPath()
          g.ellipse(50, -96, 10, 5.5, -0.25, 0, TAU)
          g.fill()
          g.strokeStyle = '#8a5a22'
          g.lineWidth = 2
          g.beginPath()
          g.moveTo(44, -100)
          g.lineTo(43, -108)
          g.moveTo(49, -101)
          g.lineTo(50, -109)
          g.stroke()
          g.fillStyle = '#8a5a22'
          for (const [dx, dy, r] of [[-14, -42, 5], [0, -34, 5.5], [12, -44, 4.5], [-24, -36, 4], [27, -62, 3.2], [34, -78, 3]]) {
            g.beginPath()
            g.arc(dx, dy, r, 0, TAU)
            g.fill()
          }
          g.restore()
        }
        giraffe(FW * 0.47, 0.8, 1)
        giraffe(FW * 0.7, 0.62, -1)
        g.strokeStyle = '#2f6a2a'
        g.lineWidth = 2
        for (let i = 0; i < 46; i++) {
          const x = hash(7, i) * FW
          g.beginPath()
          g.moveTo(x, S_Y + 5 + hash(7, i, 1) * 24)
          g.lineTo(x + 2, S_Y - 1 + hash(7, i, 1) * 24)
          g.stroke()
        }
        g.globalAlpha = 1
      }
      // today: the oasis, the pool and the well
      const oa = smooth(0.92, 0.99, kNow)
      if (oa > 0.01) {
        g.globalAlpha = oa
        g.fillStyle = '#2fb5b0'
        g.beginPath()
        g.ellipse(FW * 0.815, S_Y + 6, 70, 9, 0, 0, TAU)
        g.fill()
        g.strokeStyle = '#6b5236'
        g.lineWidth = 7
        for (const [px, h, lean] of [[0.775, 110, -10], [0.93, 130, 14], [0.955, 96, 8]]) {
          const x0 = FW * px
          g.beginPath()
          g.moveTo(x0, S_Y + 6)
          g.quadraticCurveTo(x0 + lean * 0.3, S_Y - h * 0.5, x0 + lean, S_Y - h)
          g.stroke()
          g.strokeStyle = '#3f7f3a'
          g.lineWidth = 5
          for (let f = 0; f < 7; f++) {
            const a = -Math.PI + (f / 6) * Math.PI
            g.beginPath()
            g.moveTo(x0 + lean, S_Y - h)
            g.quadraticCurveTo(x0 + lean + Math.cos(a) * 34, S_Y - h - 26 + Math.sin(a) * 6, x0 + lean + Math.cos(a) * 54, S_Y - h + 12 + Math.abs(Math.sin(a)) * 16)
            g.stroke()
          }
          g.strokeStyle = '#6b5236'
          g.lineWidth = 7
        }
        // the well: a block with a pump, its pipe down into the sandstone
        g.fillStyle = '#9aa2a8'
        g.fillRect(FW * WELL_X - 18, S_Y - 30, 36, 34)
        g.fillStyle = '#2f9d92'
        g.fillRect(FW * WELL_X - 24, S_Y - 38, 48, 12)
        g.fillStyle = '#8d969e'
        g.fillRect(FW * WELL_X - 4, S_Y + 4, 8, (A_Y + B_Y) / 2 - S_Y - 8)
        g.globalAlpha = 1
      }
      // sandstone: grains, then the water that has soaked in
      const band = g.createLinearGradient(0, A_Y, 0, B_Y)
      band.addColorStop(0, '#d6a06a')
      band.addColorStop(1, '#b8794a')
      g.fillStyle = band
      g.fillRect(0, A_Y, FW, B_Y - A_Y)
      for (const gr of GRAINS) {
        g.fillStyle = gr.d ? 'rgba(110,64,36,0.45)' : 'rgba(255,226,180,0.4)'
        g.beginPath()
        g.arc(gr.x, gr.y, gr.r, 0, TAU)
        g.fill()
      }
      const soakIn = rained() ? ease(clamp(rainAge / 3.2)) : 0
      const first = S.bursts[0] ?? 0
      const xf = rained() ? frontAt(Math.max(0, kNow - first)) * soakIn : 0
      if (xf > 0.003) {
        const sg = g.createLinearGradient(0, 0, xf * FW, 0)
        sg.addColorStop(0, 'rgba(110,200,240,0.72)')
        sg.addColorStop(1, 'rgba(34,82,200,0.78)')
        g.fillStyle = sg
        g.beginPath()
        g.moveTo(0, A_Y)
        g.lineTo(xf * FW, A_Y)
        g.quadraticCurveTo(xf * FW + 22, (A_Y + B_Y) / 2, xf * FW, B_Y)
        g.lineTo(0, B_Y)
        g.closePath()
        g.fill()
        g.fillStyle = 'rgba(255,255,255,0.18)'
        for (const gr of GRAINS) if (gr.x < xf * FW - 4 && gr.r > 2) g.fillRect(gr.x, gr.y, 3, 2)
        // the krypton that came with the water: small dots, and one of the rain's big ones for every burst
        g.fillStyle = 'rgba(70,230,205,0.85)'
        for (const d of SMALL) {
          if (d.x * FW < xf * FW - 10) {
            g.beginPath()
            g.arc(d.x * FW, d.y, 2.6, 0, TAU)
            g.fill()
          }
        }
        S.bursts.forEach((bk, bi) => {
          for (const d of bigDots(bk, bi)) {
            const born = bi === 0 ? soakIn : ease(clamp((wall() - (S.rain ?? 0)) / 3))
            const age = Math.max(0, kNow - d.k)
            const x = clamp(FRONT0 + FRONT_PER_K * age - d.off, 0.03, WELL_X - 0.01) * FW
            if (x > xf * FW && bi === 0) continue
            const a = Math.pow(0.5, (age * MILLION) / HALF) * (bi === S.bursts.length - 1 && bi > 0 ? born : 1)
            const alpha = 0.22 + 0.78 * a
            const rg = g.createRadialGradient(x, d.y, 1, x, d.y, 22)
            rg.addColorStop(0, `rgba(255,190,60,${alpha})`)
            rg.addColorStop(1, 'rgba(255,140,30,0)')
            g.fillStyle = rg
            g.fillRect(x - 22, d.y - 22, 44, 44)
            g.fillStyle = `rgba(255,170,30,${alpha})`
            g.beginPath()
            g.arc(x, d.y, 12, 0, TAU)
            g.fill()
            g.strokeStyle = `rgba(255,255,255,${alpha})`
            g.lineWidth = 3
            g.stroke()
          }
        })
        // the first drop
        const dx = xf * FW
        const dy = (A_Y + B_Y) / 2
        g.fillStyle = 'rgba(235,248,255,0.95)'
        g.beginPath()
        g.arc(dx, dy, 15 + Math.sin(t * 3) * 1.5, 0, TAU)
        g.fill()
        g.fillStyle = '#2b6fe0'
        g.beginPath()
        g.arc(dx, dy, 10, 0, TAU)
        g.fill()
      }
      // the rock below
      g.fillStyle = '#463a46'
      g.fillRect(0, B_Y, FW, FH - B_Y)
      g.fillStyle = '#2f2733'
      for (const r of ROCKS) {
        g.beginPath()
        g.arc(r.x, r.y, r.r, 0, TAU)
        g.fill()
      }
      // rain: a drizzle in a wet time, a burst when the cloud is tapped
      if (rainA > 0.1) {
        g.strokeStyle = `rgba(210,230,255,${0.45 * rainA})`
        g.lineWidth = 2
        for (let i = 0; i < 26; i++) {
          const x = FW * (0.04 + hash(8, i) * 0.22)
          const y = 112 + ((hash(8, i, 1) * 90 + t * 120) % (S_Y - 112))
          g.beginPath()
          g.moveTo(x, y)
          g.lineTo(x - 3, y + 14)
          g.stroke()
        }
      }
      if (rainAge < 5.2) {
        for (const d of DROPS) {
          const a = rainAge - d.t0
          if (a < 0) continue
          const fall = 0.95
          const y = a < fall ? 118 + (a / fall) * (S_Y - 118) : S_Y + ((a - fall) / 0.55) * (A_Y + 40 - S_Y)
          if (a > fall + 0.55) continue
          const x = d.x * FW
          if (d.kr) {
            g.fillStyle = d.big ? '#ffe9a8' : '#52e8d0'
            g.beginPath()
            g.arc(x, y, d.big ? 8 : 4, 0, TAU)
            g.fill()
          } else {
            g.strokeStyle = 'rgba(190,225,255,0.9)'
            g.lineWidth = 3
            g.beginPath()
            g.moveTo(x, y - 12)
            g.lineTo(x, y)
            g.stroke()
          }
        }
      }
      // words on the window
      txt(E.source.face.hills, FW * 0.02, S_Y - 30, 30, '#ffe9c8')
      if (oa > 0.5) txt(E.source.face.oasis, FW * 0.835, S_Y + 14, 26, '#e5fffa', 'center')
      txt(E.source.face.sandstone, FW * 0.5, (A_Y + B_Y) / 2 + 40, 34, '#ffffff', 'center')
      txt(E.source.face.rock, FW * 0.82, B_Y + 44, 30, '#d8cfe0', 'center')
      // the time and the first drop's journey, top right
      g.fillStyle = 'rgba(8,12,34,0.62)'
      g.beginPath()
      g.roundRect(FW - 440, 10, 428, 100, 20)
      g.fill()
      txt(kNow > 0.995 ? E.source.face.today : fill(E.source.face.ago, { n: yearsText(Math.round(years / 1000) * 1000) }), FW - 28, 38, 40, '#ffffff', 'right')
      if (rained()) {
        const km = kmAt(Math.max(0, kNow - first)) * soakIn
        txt(fill(E.source.face.journey, { d: distText(km) }), FW - 28, 70, 25, '#bfe8ff', 'right', 600)
        txt(E.source.face.creep, FW - 28, 94, 21, '#8fb8e0', 'right', 600)
      }
      // what the dots mean
      const lgY = FH - 20
      g.fillStyle = 'rgba(70,230,205,0.9)'
      g.beginPath()
      g.arc(26, lgY, 5, 0, TAU)
      g.fill()
      txt(E.source.face.kr, 42, lgY, 24, '#e8dff0', 'left', 600)
      g.fillStyle = '#ffaa1e'
      g.beginPath()
      g.arc(200, lgY, 9, 0, TAU)
      g.fill()
      g.strokeStyle = '#ffffff'
      g.lineWidth = 2
      g.stroke()
      txt(E.source.face.kr81, 218, lgY, 24, '#ffe9c8', 'left', 600)
      if (wetNow() && !(rainAge < 5.2)) {
        // the cloud says where to tap
        txt(E.source.face.cloud, FW * 0.15, 70, 28, '#ffffff', 'center', 600)
      }
    })
    faceDrawn = kNow
    faceAt = t
  }

  function drawTrack() {
    trackTex.userData.redraw(g => {
      g.clearRect(0, 0, FW, 64)
      g.fillStyle = '#0d1233'
      g.beginPath()
      g.roundRect(4, 4, FW - 8, 56, 18)
      g.fill()
      g.strokeStyle = color
      g.lineWidth = 3
      g.stroke()
      const x0 = TRACK.x0
      const x1 = TRACK.x1
      g.fillStyle = '#4a4660'
      g.beginPath()
      g.roundRect(x0, 26, x1 - x0, 12, 6)
      g.fill()
      g.fillStyle = '#4aa6e0'
      for (const [a, b] of WET) {
        const u0 = clamp(a + 0.03)
        const u1 = clamp(b + 0.015)
        g.fillRect(x0 + u0 * (x1 - x0), 26, (u1 - u0) * (x1 - x0), 12)
      }
      g.font = '700 26px Outfit, Nunito, sans-serif'
      g.textBaseline = 'middle'
      g.fillStyle = '#d6dcff'
      g.textAlign = 'right'
      g.fillText(E.source.track.start, x0 - 16, 33)
      g.textAlign = 'left'
      g.fillText(E.source.track.end, x1 + 16, 33)
      const hx = x0 + clamp(kNow) * (x1 - x0)
      g.fillStyle = '#ffd166'
      g.beginPath()
      g.arc(hx, 32, 15, 0, TAU)
      g.fill()
      g.fillStyle = '#10142e'
      g.beginPath()
      g.arc(hx, 32, 6, 0, TAU)
      g.fill()
    })
  }

  const phaseOf = () => (wetNow() ? 'wet' : 'dry')
  let saidPhase = 'wet'
  const said = { fade: false, today: false }
  const srcHint = () => {
    if (!rained()) return wetNow() ? E.source.hints.rain : E.source.hints.wait
    if (S.k > 0.98) return E.source.hints.again
    return E.source.hints.time
  }
  const srcPanel = panelOf(E.source.title, E.source.panel, () => [
    {
      slider: {
        label: E.source.slider,
        min: 0,
        max: 1,
        step: 0.005,
        value: S.k,
        onInput: v => srcStep('time', clamp(Number(v) || 0)),
        format: v => (v > 0.995 ? E.source.face.today : fill(E.source.face.ago, { n: yearsText(Math.round((MILLION * (1 - v)) / 1000) * 1000) })),
        live: () => S.k,
      },
    },
    {
      buttons: [
        { label: E.source.buttons.rain, onClick: () => srcStep('cloud') },
        { label: E.source.buttons.step, onClick: () => srcStep('step') },
        { label: E.source.buttons.back, onClick: () => srcStep('back') },
      ],
    },
  ])
  const burst = () => {
    if (S.bursts.length >= 6) S.bursts.splice(1, 1)
    S.bursts.push(S.bursts.length === 0 ? 0 : S.k)
    S.rain = wall()
  }
  /** A visitor's step: the rain cloud, the time line (a value 0..1), a step on, or back to the start. */
  function srcStep(what, v) {
    const lv = level()
    if (what === 'cloud') {
      if (!wetNow()) return say(at(E.source.hints.wait, lv))
      const firstRain = !rained()
      burst()
      play('select')
      say(at(firstRain ? E.source.says.rain : E.source.says.wet, lv))
      if (firstRain) later(4.5, () => say(at(E.source.says.soak, level())))
    } else if (what === 'time' || what === 'step') {
      const k = what === 'time' ? clamp(v) : Math.min(1, Math.round((S.k + 0.1) * 100) / 100)
      if (k === S.k) return
      const had = rained()
      S.k = k
      if (!had && k > 0.02) {
        // the first rain fell at the start of the slider: the water has been creeping since
        burst()
        say(at(E.source.says.rain, lv))
      }
      if (what === 'step') play('tap')
    } else if (what === 'back') {
      S.k = 0
      S.bursts = []
      S.rain = null
      said.fade = said.today = false
      saidPhase = 'wet'
      play('tap')
    } else return
    ex.discover('source', srcPanel, 4)
    repanel(srcPanel)
    what === 'time' ? slid('source') : share('source')
  }
  clickable(face, h => {
    const u = h.uv?.x ?? 0
    const v = h.uv?.y ?? 0
    if (u > cloudRect.u0 && u < cloudRect.u1 && v > cloudRect.v0) srcStep('cloud')
    else ctx.showPanel(srcPanel)
  }, { reach: 7 })
  clickable(trackMesh, h => srcStep('time', clamp(((h.uv?.x ?? 0) * FW - TRACK.x0) / (TRACK.x1 - TRACK.x0))), { reach: 7 })
  ex.add({
    id: 'source',
    x: SRC.x,
    z: SRC.z + 3.1,
    radius: 2.2,
    manual: true,
    label: E.source.label,
    verb: srcHint,
    focus: { x: SRC.x, y: 1.2, z: SRC.z, size: 3.0, width: 4.6 },
    act: () => ctx.showPanel(srcPanel),
  })
  updates.push((dt, t) => {
    kNow = damp(kNow, S.k, 5, dt)
    if (Math.abs(kNow - S.k) < 0.0004) kNow = S.k
    const raining = S.rain != null && wall() - S.rain < 5.4
    if (kNow !== faceDrawn || raining || (wetAt(kNow) > 0.4 && t - faceAt > 0.09) || t - faceAt > 1.5) {
      if (t - faceAt > 0.05) {
        drawFace(t)
        drawTrack()
      }
    }
    // a word when the weather turns, once the slider rests
    if (rained() && Math.abs(kNow - S.k) < 0.01) {
      const ph = phaseOf()
      if (ph !== saidPhase) {
        saidPhase = ph
        if (S.k > 0.02) say(at(ph === 'dry' ? E.source.says.dry : E.source.says.wet, level()))
      }
      if (!said.fade && S.k > 0.38) {
        said.fade = true
        say(at(E.source.says.fade, level()))
      }
      if (!said.today && S.k > 0.985) {
        said.today = true
        say(at(E.source.says.today, level()))
      }
    }
  })
  const srcSet = (s, live, ago = 0) => {
    S.k = clamp(Number(s?.k) || 0)
    S.bursts = (Array.isArray(s?.bursts) ? s.bursts : []).slice(0, 6).map(b => clamp(Number(b) || 0))
    S.rain = s?.rainAge != null ? wall() - Math.max(0, Number(s.rainAge) || 0) - (ago || 0) : null
    if (!live) {
      kNow = S.k
      saidPhase = phaseOf()
      said.fade = S.k > 0.38
      said.today = S.k > 0.985
    }
    repanel(srcPanel)
  }
  const srcState = () => ({ k: S.k, bursts: [...S.bursts], rainAge: S.rain == null ? null : Math.round((wall() - S.rain) * 100) / 100 })

  // =====================================================================================================
  // ======== station 2: the well: catching the gas ========
  // =====================================================================================================
  const wg = (x, z) => groundAt(x, z)
  // the well: a slab, a casing, a pump in teal paint, a pipe to the tank
  const slab = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.12, 1.1, 2, 0.03), concrete)
  slab.position.set(WELL.x + 0.3, wg(WELL.x, WELL.z) + 0.06, WELL.z)
  root.add(slab)
  const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.6, 20), steel)
  casing.position.set(WELL.x - 0.15, 0.42, WELL.z)
  const casingCap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 20), darkMetal)
  casingCap.position.set(WELL.x - 0.15, 0.75, WELL.z)
  root.add(casing, casingCap)
  const pumpG = new THREE.Group()
  pumpG.position.set(WELL.x + 0.6, 0.12, WELL.z)
  root.add(pumpG)
  const motor = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.62, 0.42, 3, 0.05), paint)
  motor.position.y = 0.31
  const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 18), darkMetal)
  fan.rotation.z = Math.PI / 2
  fan.position.set(0.3, 0.32, 0)
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 14), redPaint)
  button.rotation.x = Math.PI / 2
  button.position.set(-0.08, 0.5, 0.22)
  pumpG.add(motor, fan, button)
  const inPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.65, 10), steel)
  inPipe.rotation.z = Math.PI / 2
  inPipe.position.set(WELL.x + 0.2, 0.62, WELL.z)
  root.add(inPipe)
  solids.push(circle(WELL.x - 0.15, WELL.z, 0.3), box(WELL.x + 0.6, WELL.z, 0.55, 0.45))
  const pumpHit = hitBox(0.8, 0.8, 0.6, WELL.x + 0.5, 0.55, WELL.z)
  const pumpTag = label(E.well.labels.pump, 0.075, '#e8ffff')
  pumpTag.position.set(WELL.x + 0.6, 1.0, WELL.z + 0.28)
  root.add(pumpTag)
  // the litre counter on a post
  const meterG = new THREE.Group()
  meterG.position.set(WELL.x - 0.15, 0, WELL.z - 0.85)
  root.add(meterG)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 1.55, 10), darkMetal)
    post.position.y = 0.77
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.4, 0.06, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#0d1233', emissive: '#10173f', emissiveIntensity: 0.7, roughness: 0.4 }))
    plate.position.y = 1.7
    const edge = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.45, 0.04, 2, 0.02), rimMat)
    edge.position.set(0, 1.7, -0.02)
    meterG.add(post, edge, plate)
    solids.push(circle(WELL.x - 0.15, WELL.z - 0.85, 0.12))
  }
  const meterText = label('', 0.17, hdr('#6fe8e0', 1.2), { maxWidth: 0.9 })
  meterText.position.set(0, 1.7, 0.04)
  meterG.add(meterText)
  // the degassing tank: glass, water rising in it, bubbles, a valve on top
  const tankG = new THREE.Group()
  tankG.position.set(TANK.x, wg(TANK.x, TANK.z), TANK.z)
  root.add(tankG)
  const TR = 0.34
  const TH = 1.2
  {
    for (const a of [0.5, 2.6, 4.7]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), darkMetal)
      leg.position.set(Math.cos(a) * 0.27, 0.15, Math.sin(a) * 0.27)
      tankG.add(leg)
    }
    const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(TR + 0.03, TR + 0.03, 0.05, 24), steel)
    baseRing.position.y = 0.32
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(TR + 0.03, TR - 0.1, 0.16, 24), steel)
    topCap.position.y = 0.3 + TH + 0.08
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(TR, TR, TH, 28, 1, true), glassMat)
    glass.position.y = 0.3 + TH / 2
    tankG.add(baseRing, topCap, glass)
  }
  const tankWater = new THREE.Mesh(new THREE.CylinderGeometry(TR - 0.02, TR - 0.02, 1, 28).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: '#3aa8d8', roughness: 0.15, transparent: true, opacity: 0.72, emissive: '#0c3a58', emissiveIntensity: 0.5 }))
  tankWater.position.y = 0.33
  tankWater.scale.y = 0.001
  tankWater.raycast = () => {}
  tankG.add(tankWater)
  const bubbles = cloud(40, '#d8f6ff', 0.09, 0.9)
  bubbles.pts.position.y = 0.33
  tankG.add(bubbles.pts)
  const BUB = Array.from({ length: 40 }, (_, i) => ({ a: hash(9, i) * TAU, r: hash(9, i, 1) * (TR - 0.06), s: 0.25 + hash(9, i, 2) * 0.35, p: hash(9, i, 3) }))
  const valveY = 0.3 + TH + 0.16
  const valvePipe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.14, 10), steel)
  valvePipe.position.set(0, valveY + 0.07, 0)
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.017, 8, 20), redPaint)
  wheel.rotation.x = Math.PI / 2
  wheel.position.set(0, valveY + 0.17, 0)
  tankG.add(valvePipe, wheel)
  const valveHit = hitBox(0.34, 0.26, 0.34, TANK.x, groundAt(TANK.x, TANK.z) + valveY + 0.14, TANK.z)
  solids.push(circle(TANK.x, TANK.z, 0.42))
  const tankTag = label(E.well.labels.tank, 0.075, '#e8ffff', { maxWidth: 1.6 })
  tankTag.position.set(TANK.x, 0.2, TANK.z + 0.55)
  const valveTag = label(E.well.labels.valve, 0.075, '#ffd9d4', { maxWidth: 1.3 })
  valveTag.position.set(TANK.x, valveY + 0.5, TANK.z + 0.02)
  root.add(tankTag, valveTag)
  // the gas bottle on a stand
  const bottleG = new THREE.Group()
  bottleG.position.set(BOTTLE.x, wg(BOTTLE.x, BOTTLE.z), BOTTLE.z)
  root.add(bottleG)
  const bottleBand = new THREE.MeshStandardMaterial({ color: '#2a5c6a', emissive: '#35d3c0', emissiveIntensity: 0, roughness: 0.4 })
  {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.08, 18), darkMetal)
    stand.position.y = 0.04
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.62, 20), steel)
    body.position.y = 0.4
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 8, 0, TAU, 0, Math.PI / 2), steel)
    shoulder.position.y = 0.71
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 10), darkMetal)
    neck.position.y = 0.85
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.123, 0.123, 0.14, 20), bottleBand)
    band.position.y = 0.46
    bottleG.add(stand, body, shoulder, neck, band)
  }
  solids.push(circle(BOTTLE.x, BOTTLE.z, 0.22))
  const bottleHit = hitBox(0.36, 0.95, 0.36, BOTTLE.x, groundAt(BOTTLE.x, BOTTLE.z) + 0.48, BOTTLE.z)
  const bottleTag = label(E.well.labels.bottle, 0.075, '#e8ffff', { maxWidth: 1.2 })
  bottleTag.position.set(BOTTLE.x, 1.1, BOTTLE.z)
  root.add(bottleTag)
  // pipes: the water from the pump to the tank, the gas from the valve to the bottle
  const tube = (pts, r, mat) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, r, 8, false), mat)
  const waterPath = new THREE.CatmullRomCurve3([V(WELL.x + 0.85, 0.62, WELL.z), V(WELL.x + 1.4, 0.62, WELL.z - 0.1), V(TANK.x - 0.45, 0.62, TANK.z + 0.1), V(TANK.x - 0.34, 0.62, TANK.z)])
  const gasPath = new THREE.CatmullRomCurve3([V(TANK.x, groundAt(TANK.x, TANK.z) + valveY + 0.2, TANK.z), V(TANK.x + 0.5, groundAt(TANK.x, TANK.z) + valveY + 0.45, TANK.z + 0.1), V(BOTTLE.x - 0.4, 1.3, BOTTLE.z - 0.1), V(BOTTLE.x, groundAt(BOTTLE.x, BOTTLE.z) + 0.92, BOTTLE.z)])
  root.add(tube(waterPath.getPoints(12), 0.035, steel), tube(gasPath.getPoints(14), 0.016, darkMetal))
  const wStream = cloud(36, '#7cd0ff', 0.08, 0.95)
  root.add(wStream.pts)
  const gStream = cloud(18, '#72ffe6', 0.07, 0.95)
  root.add(gStream.pts)
  // the board: what is in the gas
  const boardMat = darkMetal
  const board = standingScreen({ width: 1.55, height: 1.0, color, title: E.well.board.title, line: '', titleSize: 0.085, lineSize: 0.05 }, { top: 1.4, tilt: 0.2, mat: boardMat })
  board.group.position.set(BOARD.x, groundAt(BOARD.x, BOARD.z), BOARD.z)
  faceTo(board.group, -3.1, -0.8)
  root.add(board.group)
  solids.push(circle(BOARD.x, BOARD.z, 0.3))
  const boardTex = canvasTex(1024, 640, null, { mipmaps: false })
  disposers.push(() => boardTex.dispose())
  const boardPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.9), new THREE.MeshBasicMaterial({ map: boardTex, transparent: true, toneMapped: false }))
  boardPlane.position.set(0, -0.06, 0.002)
  board.content.add(boardPlane)
  const DOTS = []
  {
    // 84 nitrogen, 9 argon, 1 krypton: the dots are not to scale, the words say so
    let id = 0
    for (let i = 0; i < 84; i++) DOTS.push({ kind: 0, id: id++ })
    for (let i = 0; i < 9; i++) DOTS.push({ kind: 1, id: id++ })
    DOTS.push({ kind: 2, id: id++ })
    for (const d of DOTS) {
      const col = [d.id < 84 ? 0 : 1, 0]
      void col
    }
  }
  const COLS = [0.2, 0.5, 0.8]
  const DOTC = ['#5aa0ff', '#7ddc7a', '#35e8cf']
  const colCount = [0, 0, 0]
  const home = DOTS.map(d => {
    const k = colCount[d.kind]++
    const perRow = d.kind === 0 ? 8 : d.kind === 1 ? 4 : 1
    return { x: COLS[d.kind] + ((k % perRow) - (perRow - 1) / 2) * 0.034, y: 0.78 - Math.floor(k / perRow) * 0.05 }
  })
  let boardDrawn = ''
  const drawBoard = (t, p, gasOn) => {
    const key = `${gasOn}|${p.toFixed(3)}|${gasOn && p < 1 ? Math.floor(t * 12) : 0}|${lang}`
    if (key === boardDrawn) return
    boardDrawn = key
    boardTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.fillStyle = 'rgba(8,12,34,0.0)'
      g.fillRect(0, 0, w, h)
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      if (gasOn) {
        DOTS.forEach((d, i) => {
          const hm = home[i]
          // a mix drifting in a jar, then each kind into its column
          const jx = 0.5 + (hash(21, i) - 0.5) * 0.7 + Math.sin(t * (0.8 + hash(21, i, 1)) + i) * 0.03
          const jy = 0.5 + (hash(21, i, 2) - 0.5) * 0.5 + Math.cos(t * (0.7 + hash(21, i, 3)) + i) * 0.03
          const e = ease(clamp(p * 1.15 - hash(21, i, 4) * 0.15))
          const x = (jx + (hm.x - jx) * e) * w
          const y = (jy + (hm.y - jy) * e) * h * 0.82
          g.fillStyle = DOTC[d.kind]
          g.beginPath()
          g.arc(x, y, d.kind === 2 ? 11 : d.kind === 1 ? 8 : 6, 0, TAU)
          g.fill()
          if (d.kind === 2 && p > 0.9) {
            g.strokeStyle = '#ffffff'
            g.lineWidth = 3
            g.beginPath()
            g.arc(x, y, 18 + Math.sin(t * 4) * 2, 0, TAU)
            g.stroke()
          }
        })
        if (p >= 1) {
          g.font = '700 38px Outfit, Nunito, sans-serif'
          for (let c = 0; c < 3; c++) {
            g.fillStyle = DOTC[c]
            g.fillText([E.well.board.nitrogen, E.well.board.argon, E.well.board.krypton][c], COLS[c] * w, h * 0.74)
          }
          g.font = '600 31px Outfit, Nunito, sans-serif'
          g.fillStyle = '#e8ecff'
          g.fillText(fill(E.well.board.ratio, { n: KR_PER_MILLION_N }), w / 2, h * 0.87)
          g.font = '600 26px Outfit, Nunito, sans-serif'
          g.fillStyle = '#9fb0e8'
          g.fillText(E.well.board.note, w / 2, h * 0.95)
        }
      }
    })
  }

  // ---- the well's state (shared): the pump, the litres, the gas collected, the gas split ----
  const Wl = { on: false, L0: 0, t0: 0, gas: 0, valveT: -99, sortT: -99 }
  const litres = () => (Wl.on ? Math.min(CAP_L, Wl.L0 + PUMP_RATE * (wall() - Wl.t0)) : Wl.L0)
  let wellSeen = false
  const wellHint = () => {
    if (Wl.gas >= 2) return E.well.hints.again
    if (Wl.gas === 1) return E.well.hints.bottle
    if (!Wl.on && litres() < NEED_L) return E.well.hints.pump
    if (litres() < NEED_L) return E.well.hints.more
    return E.well.hints.valve
  }
  const wellPanel = panelOf(E.well.title, E.well.panel, () => [
    {
      buttons: [
        { label: Wl.on ? E.well.buttons.stop : E.well.buttons.pump, onClick: () => wellStep('pump') },
        { label: E.well.buttons.valve, onClick: () => wellStep('valve') },
        { label: E.well.buttons.bottle, onClick: () => wellStep('bottle') },
        { label: E.well.buttons.fresh, onClick: () => wellStep('fresh') },
      ],
    },
  ])
  /** A visitor's step: a tap on the pump, the tank's valve or the bottle (or the panel's buttons). */
  function wellStep(what) {
    const lv = level()
    if (what === 'pump') {
      const L = litres()
      if (Wl.on) {
        Wl.L0 = L
        Wl.on = false
        say(at(E.well.says.off, lv))
      } else {
        Wl.L0 = L
        Wl.t0 = wall()
        Wl.on = true
        say(at(E.well.says.on, lv))
      }
      play('tap')
    } else if (what === 'valve') {
      if (litres() < NEED_L) return say(at(E.well.says.few, lv))
      if (Wl.gas < 1) Wl.gas = 1
      Wl.valveT = wall()
      play('select')
      say(at(E.well.says.valve, lv))
    } else if (what === 'bottle') {
      if (Wl.gas < 1) return say(at(E.well.says.empty, lv))
      Wl.gas = 2
      Wl.sortT = wall()
      play('select')
      say(at(E.well.says.bottle, lv))
    } else if (what === 'fresh') {
      Object.assign(Wl, { on: false, L0: 0, t0: 0, gas: 0, valveT: -99, sortT: -99 })
      play('tap')
    } else return
    wellSeen = true
    ex.discover('well', wellPanel, 3)
    repanel(wellPanel)
    share('well')
  }
  clickable(pumpHit, () => wellStep('pump'))
  clickable(valveHit, () => wellStep('valve'))
  clickable(bottleHit, () => wellStep('bottle'))
  clickable(board.group, () => ctx.showPanel(wellPanel))
  ex.add({
    id: 'well',
    x: -3.0,
    z: -1.1,
    radius: 2.6,
    manual: true,
    label: E.well.label,
    verb: wellHint,
    screens: [board],
    focus: { x: -3.0, y: 1.0, z: -3.3, size: 3.3, width: 5.2 },
    act: () => ctx.showPanel(wellPanel),
  })
  let levelNow = 0
  updates.push((dt, t) => {
    const L = litres()
    setText(meterText, fill(E.well.labels.litres, { n: Math.round(L).toLocaleString(tag) }))
    // the pump's fan, the water filling the tank, the bubbles, the streams
    const run = Wl.on && L < CAP_L ? 1 : 0
    fan.rotation.x += dt * 14 * run
    button.material.emissiveIntensity = 0
    levelNow = damp(levelNow, L > 0 ? 0.25 + 0.65 * clamp(L / 2500) : 0, 2.5, dt)
    tankWater.scale.y = Math.max(0.001, levelNow * TH)
    bubbles.mat.opacity = 0.9 * run
    for (let i = 0; i < BUB.length; i++) {
      const b = BUB[i]
      const y = ((b.p + t * b.s * 0.5) % 1) * Math.max(0.05, levelNow * TH)
      bubbles.pos[i * 3] = Math.cos(b.a + t * 0.4) * b.r
      bubbles.pos[i * 3 + 1] = y
      bubbles.pos[i * 3 + 2] = Math.sin(b.a + t * 0.4) * b.r
    }
    bubbles.geo.attributes.position.needsUpdate = true
    wStream.mat.opacity = run
    if (run) {
      for (let i = 0; i < 36; i++) {
        const u = (i / 36 + t * 0.9) % 1
        const p = waterPath.getPoint(u)
        wStream.pos.set([p.x, p.y + Math.sin(u * 9 + i) * 0.015, p.z], i * 3)
      }
      wStream.geo.attributes.position.needsUpdate = true
    }
    const gv = wall() - Wl.valveT
    gStream.mat.opacity = gv >= 0 && gv < 2.2 ? 1 : 0
    if (gStream.mat.opacity) {
      for (let i = 0; i < 18; i++) {
        const u = (i / 18 + gv * 0.7) % 1
        const p = gasPath.getPoint(u)
        gStream.pos.set([p.x, p.y, p.z], i * 3)
      }
      gStream.geo.attributes.position.needsUpdate = true
    }
    wheel.rotation.z = gv >= 0 && gv < 1.2 ? gv * 6 : wheel.rotation.z
    bottleBand.emissiveIntensity = Wl.gas >= 1 ? 0.6 + Math.sin(t * 2.5) * 0.15 : 0
    bottleBand.color.set(Wl.gas >= 1 ? '#35d3c0' : '#2a5c6a')
    const sp = Wl.sortT > 0 ? clamp((wall() - Wl.sortT) / 3.6) : 0
    drawBoard(t, sp, Wl.gas >= 2)
  })
  const wellSet = (s, live, ago = 0) => {
    const on = !!s?.on
    Wl.L0 = clamp(Number(s?.litres) || 0, 0, CAP_L)
    Wl.on = on
    Wl.t0 = wall() - Math.max(0, Number(s?.runAge) || 0) - (ago || 0)
    Wl.gas = clamp(Math.round(Number(s?.gas) || 0), 0, 2)
    Wl.valveT = s?.valveAge != null ? wall() - Number(s.valveAge) - (ago || 0) : -99
    Wl.sortT = Wl.gas >= 2 && s?.sortAge != null ? wall() - Number(s.sortAge) - (ago || 0) : -99
    if (!live) levelNow = Wl.L0 > 0 ? 0.25 + 0.65 * clamp(Wl.L0 / 2500) : 0
    repanel(wellPanel)
  }
  const wellState = () => ({
    on: Wl.on,
    litres: Math.round(Wl.L0),
    runAge: Wl.on ? Math.round((wall() - Wl.t0) * 100) / 100 : 0,
    gas: Wl.gas,
    valveAge: Wl.valveT > 0 ? Math.round((wall() - Wl.valveT) * 100) / 100 : null,
    sortAge: Wl.sortT > 0 ? Math.round((wall() - Wl.sortT) * 100) / 100 : null,
  })

  // =====================================================================================================
  // ======== station 3: the atom trap, in a tent ========
  // =====================================================================================================
  const tg = new THREE.Group()
  tg.position.set(TENT.x, groundAt(TENT.x, TENT.z), TENT.z)
  tg.rotation.y = Math.atan2(5.7 - TENT.x, -1.6 - TENT.z)
  root.add(tg)
  const CY = 1.22 // the chamber's height
  const cloth = new THREE.MeshStandardMaterial({ color: '#cdb98f', roughness: 0.95, side: THREE.DoubleSide, emissive: '#3a2c18', emissiveIntensity: 0.25 })
  {
    // an open tent: four poles, a gabled roof over the back half, the table under it
    for (const [x, z] of [[-2.15, -1.0], [2.15, -1.0], [-2.15, 0.95], [2.15, 0.95]]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 2.35, 8), darkMetal)
      pole.position.set(x, 1.17, z)
      tg.add(pole)
    }
    const roofGeo = (z0, z1) => {
      const geo = new THREE.BufferGeometry()
      const p = [-2.3, 2.3, z0, 2.3, 2.3, z0, 2.3, 2.62, (z0 + z1) / 2, -2.3, 2.62, (z0 + z1) / 2, -2.3, 2.3, z1, 2.3, 2.3, z1]
      geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
      geo.setIndex([0, 1, 2, 0, 2, 3, 3, 2, 5, 3, 5, 4])
      geo.computeVertexNormals()
      return geo
    }
    tg.add(new THREE.Mesh(roofGeo(-1.1, 1.05), cloth))
    const back = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.3), cloth)
    back.position.set(0, 1.15, -1.1)
    tg.add(back)
    const table = new THREE.Mesh(new RoundedBoxGeometry(3.3, 0.07, 1.0, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#7a5a3c', roughness: 0.8 }))
    table.position.set(0, 0.82, 0)
    tg.add(table)
    for (const [x, z] of [[-1.55, -0.4], [1.55, -0.4], [-1.55, 0.4], [1.55, 0.4]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), darkMetal)
      leg.position.set(x, 0.4, z)
      tg.add(leg)
    }
    if (!light) {
      const lamp = new THREE.PointLight('#ffd9a0', 1.0, 5.5, 1.6)
      lamp.position.set(0, 2.15, 0.3)
      tg.add(lamp)
    }
  }
  solids.push(box(TENT.x, TENT.z - 0.1, 3.4, 1.1, { rot: tg.rotation.y }))
  // the chamber: a glass sphere on a stand, a beam line through it
  const chamber = new THREE.Group()
  chamber.position.set(0, CY, 0)
  tg.add(chamber)
  {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 20), new THREE.MeshStandardMaterial({ color: '#cfeaf5', roughness: 0.03, metalness: 0.1, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }))
    chamber.add(sphere)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.014, 8, 40), darkMetal)
    ring.rotation.x = Math.PI / 2
    chamber.add(ring)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, CY - 0.85 - 0.22, 12), darkMetal)
    stem.position.set(0, -(CY - 0.85) / 2 - 0.1, 0)
    chamber.add(stem)
    const line = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.0, 12), steel)
    line.rotation.z = Math.PI / 2
    chamber.add(line)
    const pumpBox = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.24, 0.3, 2, 0.03), darkMetal)
    pumpBox.position.set(0.95, -0.1, 0)
    chamber.add(pumpBox)
  }
  // six laser beams, three pairs crossing at the chamber's centre; each ends in a small optic on a rod
  const beamDirs = [V(0.82, 0.5, 0.28).normalize(), V(-0.38, 0.88, 0.3).normalize(), V(0.18, 0.28, 0.94).normalize()]
  const beamMat = new THREE.MeshBasicMaterial({ color: hdr('#ff4d6e', 1.4), transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false })
  for (const d of beamDirs) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1.5, 6), beamMat)
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d)
    m.raycast = () => {}
    chamber.add(m)
    for (const s of [-1, 1]) {
      const e = d.clone().multiplyScalar(0.75 * s)
      const optic = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.09, 12), darkMetal)
      optic.position.copy(e)
      optic.quaternion.setFromUnitVectors(V(0, 1, 0), d)
      chamber.add(optic)
      // a thin rod from the table up to the optic
      const bottom = 0.86 - CY
      const len = e.y - bottom - 0.05
      if (len > 0.04) {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 6), darkMetal)
        rod.position.set(e.x, bottom + len / 2, e.z)
        chamber.add(rod)
      }
    }
  }
  const centreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: hdr('#ff7090', 1.2), transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending }))
  centreGlow.scale.setScalar(0.22)
  chamber.add(centreGlow)
  // the atoms: ordinary krypton streams straight through; the rare ones are caught
  const ATOMS = 70
  const stream = cloud(ATOMS, '#9fe0f0', 0.075, 0.9)
  chamber.add(stream.pts)
  const SP = Array.from({ length: 4 }, () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 10), new THREE.MeshStandardMaterial({ color: '#ffb347', emissive: '#ff8c1a', emissiveIntensity: 1.6, roughness: 0.3 }))
    m.visible = false
    m.raycast = () => {}
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: hdr('#ffd27a', 1.4), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
    halo.scale.setScalar(0.3)
    m.add(halo)
    chamber.add(m)
    return { m, halo, t0: -99, live: false }
  })
  // the krypton gas: a bottle at the beam line's start
  const kb = new THREE.Group()
  kb.position.set(-1.0, 0.855, -0.02)
  tg.add(kb)
  {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 18), steel)
    body.position.y = 0.25
    const sh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 8, 0, TAU, 0, Math.PI / 2), steel)
    sh.position.y = 0.5
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.103, 0.103, 0.12, 18), new THREE.MeshStandardMaterial({ color: '#35d3c0', emissive: '#35d3c0', emissiveIntensity: 0.6, roughness: 0.4 }))
    band.position.y = 0.3
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.52, 8), darkMetal)
    pipe.rotation.z = Math.PI / 2
    pipe.position.set(0.3, CY - 0.855, 0.02)
    kb.add(body, sh, band, pipe)
  }
  const cylHit = hitBox(0.3, 0.7, 0.3, 0, 0.35, 0, kb)
  const cylTag = label(E.trap.labels.cylinder, 0.09, '#e8ffff', { maxWidth: 1.1 })
  cylTag.position.set(-1.0, 1.9, 0.1)
  const lasTag = label(E.trap.labels.lasers, 0.09, '#ffc4d0')
  lasTag.position.set(0.0, CY + 0.95, 0.0)
  tg.add(cylTag, lasTag)
  // two sample bottles on the table's front edge
  const mkSample = (x, c, name) => {
    const g = new THREE.Group()
    g.position.set(x, 0.855, 0.32)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16), new THREE.MeshStandardMaterial({ color: c, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 }))
    body.position.y = 0.1
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 10), darkMetal)
    cap.position.y = 0.23
    g.add(body, cap)
    tg.add(g)
    const hit = hitBox(0.22, 0.34, 0.22, 0, 0.17, 0, g)
    const t = label(name, 0.07, '#ffffff', { maxWidth: 0.75 })
    t.position.set(x, 0.76, 0.53)
    tg.add(t)
    return { g, hit, body }
  }
  const airB = mkSample(-0.55, '#bfe4ff', E.trap.labels.air)
  const watB = mkSample(0.3, '#3aa8d8', E.trap.labels.water)
  // the camera on a tripod, aimed at the chamber
  {
    const cam = new THREE.Group()
    cam.position.set(0.78, 1.0, 0.4)
    const tri = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.15, 6), darkMetal)
    tri.position.set(0.78, 0.93, 0.4)
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.12, 0.2, 2, 0.02), darkMetal)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.08, 12), steel)
    lens.rotation.x = Math.PI / 2
    lens.position.z = -0.13
    cam.add(body, lens)
    // aimed at the chamber (its -z faces the target)
    cam.rotation.set(0.28, Math.atan2(0.78, 0.4), 0, 'YXZ')
    tg.add(tri, cam)
  }
  // the camera screen: what the trap sees and what it makes of it
  const trapScreen = standingScreen({ width: 1.5, height: 0.95, color, title: E.trap.screen.title, line: '', titleSize: 0.085, lineSize: 0.05 }, { top: 1.32, tilt: 0.2, mat: darkMetal })
  trapScreen.group.position.set(1.62, 0, 0.5)
  tg.add(trapScreen.group)
  trapScreen.group.rotation.y = -0.5
  const scrTex = canvasTex(1024, 640, null, { mipmaps: false })
  disposers.push(() => scrTex.dispose())
  const scrPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.85), new THREE.MeshBasicMaterial({ map: scrTex, transparent: true, toneMapped: false }))
  scrPlane.position.set(0, -0.06, 0.002)
  trapScreen.content.add(scrPlane)
  // the dial: five marks, krypton-81 left (the half-life ladder), each a thing to tap
  const dial = standingScreen({ width: 1.3, height: 0.9, color: '#ffd166', title: E.trap.labels.dial, line: '', titleSize: 0.085, lineSize: 0.05 }, { top: 1.3, tilt: 0.2, mat: darkMetal })
  dial.group.position.set(-1.62, 0, 0.5)
  tg.add(dial.group)
  dial.group.rotation.y = 0.5
  const dialTex = canvasTex(832, 576, null, { mipmaps: false })
  disposers.push(() => dialTex.dispose())
  const dialPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.78), new THREE.MeshBasicMaterial({ map: dialTex, transparent: true, toneMapped: false }))
  dialPlane.position.set(0, -0.05, 0.002)
  dial.content.add(dialPlane)
  const markHits = [0, 1, 2, 3, 4].map(i => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 0.04), ghost)
    h.position.set(-0.5 + i * 0.25, -0.12, 0.03)
    dial.content.add(h)
    return h
  })
  const DIAL_X = i => (-0.5 + i * 0.25) / 1.24 + 0.5 // 0..1 across the dial's plane

  // ---- the trap's state (shared): gas on, which sample, how old the well's water is ----
  const T = { on: false, sample: 'air', age: 458000, since: 0, seen: { air: false, water: false } }
  const frac = () => (T.sample === 'air' ? 1 : Math.pow(0.5, T.age / HALF))
  const P_AIR = 0.22 // chance of a catch in each half second, from air
  const evAt = b => hash(31, b) < P_AIR * frac()
  const cnt = { since: -1, b: 0, n: 0, vis: 0, sample: '', age: -1 }
  const percentText = f => {
    const v = f * 100
    return num(v, v >= 10 ? 0 : v >= 1 ? 1 : 2, lang)
  }
  const trapHint = () => {
    if (!T.on) return E.trap.hints.gas
    if (!T.seen.air && T.sample === 'air') return E.trap.hints.water
    if (!T.seen.water) return E.trap.hints.water
    return E.trap.hints.mark
  }
  const trapPanel = panelOf(E.trap.title, E.trap.panel, () => [
    {
      slider: {
        label: E.trap.slider,
        min: 0,
        max: MILLION,
        step: 1000,
        value: T.age,
        onInput: v => trapStep('age', Math.round(Number(v) || 0)),
        format: v => `${yearsText(v)}`,
        live: () => T.age,
      },
    },
    {
      buttons: [
        { label: T.on ? E.trap.buttons.stop : E.trap.buttons.gas, onClick: () => trapStep('gas') },
        { label: E.trap.buttons.air, onClick: () => trapStep('air') },
        { label: E.trap.buttons.water, onClick: () => trapStep('water') },
        { label: E.trap.buttons.mark, onClick: () => trapStep('mark', 2) },
      ],
    },
  ])
  const restart = () => {
    T.since = wall()
    cnt.since = -1
  }
  /** A visitor's step: the gas, a sample bottle, a mark on the dial (0 = air, 1 to 4 = halvings) or the slider. */
  function trapStep(what, v) {
    const lv = level()
    if (what === 'gas') {
      T.on = !T.on
      if (T.on) restart()
      play('select')
      say(at(T.on ? E.trap.says.gas : E.trap.says.stop, lv))
    } else if (what === 'air' || what === 'water') {
      if (!T.on) {
        T.on = true
      }
      T.sample = what
      T.seen[what] = true
      restart()
      play('tap')
      say(at(E.trap.says[what], lv))
    } else if (what === 'mark') {
      const i = clamp(Math.round(v), 0, 4)
      if (!T.on) T.on = true
      if (i === 0) T.sample = 'air'
      else {
        T.sample = 'water'
        T.age = i * HALF
        T.seen.water = true
      }
      restart()
      play('tap')
      say(at(E.trap.says.mark, lv))
    } else if (what === 'age') {
      T.age = clamp(Math.round(v), 0, MILLION)
      if (T.sample !== 'water' || !T.on) {
        T.sample = 'water'
        T.on = true
      }
      T.seen.water = true
      restart()
    } else return
    ex.discover('trap', trapPanel, 3)
    repanel(trapPanel)
    what === 'age' ? slid('trap') : share('trap')
  }
  clickable(cylHit, () => trapStep('gas'))
  clickable(airB.hit, () => trapStep('air'))
  clickable(watB.hit, () => trapStep('water'))
  markHits.forEach((h, i) => clickable(h, () => trapStep('mark', i)))
  clickable(trapScreen.group, () => ctx.showPanel(trapPanel))
  const spotT = V(TENT.x - 0.4, 0, TENT.z + 2.1)
  ex.add({
    id: 'trap',
    x: spotT.x,
    z: spotT.z,
    radius: 1.9,
    manual: true,
    label: E.trap.label,
    verb: trapHint,
    screens: [trapScreen],
    focus: { x: TENT.x, y: 1.15, z: TENT.z, size: 2.7, width: 5.4 },
    act: () => ctx.showPanel(trapPanel),
  })

  let scrDrawn = ''
  const drawScreen = (t, flash, n) => {
    const f = frac()
    const key = `${T.on}|${T.sample}|${n}|${flash ? Math.floor(t * 6) % 2 : 0}|${Math.round(T.age / 1000)}|${level()}|${lang}`
    if (key === scrDrawn) return
    scrDrawn = key
    scrTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.textBaseline = 'middle'
      // the camera's picture: a dark disc, a dot when an atom sits at the crossing
      g.fillStyle = '#04060f'
      g.beginPath()
      g.arc(w * 0.78, h * 0.5, h * 0.34, 0, TAU)
      g.fill()
      g.strokeStyle = '#2e3a78'
      g.lineWidth = 4
      g.stroke()
      if (flash) {
        const rg = g.createRadialGradient(w * 0.78, h * 0.5, 2, w * 0.78, h * 0.5, 70)
        rg.addColorStop(0, 'rgba(255,240,200,1)')
        rg.addColorStop(0.3, 'rgba(255,170,60,0.9)')
        rg.addColorStop(1, 'rgba(255,120,30,0)')
        g.fillStyle = rg
        g.fillRect(w * 0.78 - 70, h * 0.5 - 70, 140, 140)
      }
      g.textAlign = 'left'
      if (!T.on) {
        g.font = '600 40px Outfit, Nunito, sans-serif'
        g.fillStyle = '#9fb0e8'
        g.fillText(at(E.trap.screen.idle, level()), 40, h * 0.45, w * 0.5)
        return
      }
      g.font = '700 34px Outfit, Nunito, sans-serif'
      g.fillStyle = hdr(color, 1).getStyle()
      g.fillText(E.trap.screen[T.sample], 40, h * 0.12, w * 0.5)
      g.font = '800 120px Outfit, Nunito, sans-serif'
      g.fillStyle = '#ffffff'
      g.fillText(String(n), 40, h * 0.36)
      g.font = '600 28px Outfit, Nunito, sans-serif'
      g.fillStyle = '#d2dbff'
      g.fillText(fill(E.trap.screen.caught, { n: '' }).replace(/\s*$/, ''), 40, h * 0.54, w * 0.5)
      g.font = '700 34px Outfit, Nunito, sans-serif'
      g.fillStyle = '#ffe9a8'
      g.fillText(fill(E.trap.screen.left, { n: percentText(f) }), 40, h * 0.68, w * 0.52)
      g.font = '700 38px Outfit, Nunito, sans-serif'
      g.fillStyle = '#6fe8e0'
      g.fillText(T.sample === 'air' ? E.trap.screen.fresh : fill(E.trap.screen.age, { n: yearsText(Math.round(T.age / 1000) * 1000) }), 40, h * 0.84, w * 0.52)
    })
  }
  let dialDrawn = ''
  const drawDial = () => {
    const key = `${T.sample}|${Math.round(T.age / 1000)}|${T.on}|${lang}`
    if (key === dialDrawn) return
    dialDrawn = key
    dialTex.userData.redraw((g, w, h) => {
      g.clearRect(0, 0, w, h)
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      const labels = ['100 %', '50 %', '25 %', '12 %', '6 %']
      const ages = [0, 1, 2, 3, 4].map(i => (i === 0 ? E.trap.labels.air : yearsText(i * HALF)))
      for (let i = 0; i < 5; i++) {
        const x = DIAL_X(i) * w
        const fr = Math.pow(0.5, i)
        const bh = 190
        g.fillStyle = '#10163a'
        g.beginPath()
        g.roundRect(x - 52, 110, 104, bh + 30, 12)
        g.fill()
        g.fillStyle = i === 0 ? '#bfe4ff' : '#3aa8d8'
        g.fillRect(x - 44, 110 + 10 + (1 - fr) * bh, 88, fr * bh)
        g.strokeStyle = '#ffd166'
        g.lineWidth = 3
        g.strokeRect(x - 44, 120, 88, bh)
        g.fillStyle = '#ffffff'
        g.font = '700 34px Outfit, Nunito, sans-serif'
        g.fillText(labels[i], x, 360)
        g.font = '600 24px Outfit, Nunito, sans-serif'
        g.fillStyle = '#d2dbff'
        g.fillText(ages[i], x, 400, 120)
      }
      // the sample in the trap: a needle on the ladder
      if (T.on) {
        const f = frac()
        const pos = clamp(Math.log2(1 / f), 0, 4)
        const x = DIAL_X(0) * w + pos * (DIAL_X(1) - DIAL_X(0)) * w
        g.fillStyle = '#ff6b6b'
        g.beginPath()
        g.moveTo(x, 94)
        g.lineTo(x - 18, 62)
        g.lineTo(x + 18, 62)
        g.closePath()
        g.fill()
      }
    })
  }

  const stRnd = random(77)
  const sx = Array.from({ length: ATOMS }, () => ({ x: -0.95 + stRnd() * 1.9, v: 0.8 + stRnd() * 0.5, y: (stRnd() - 0.5) * 0.04, z: (stRnd() - 0.5) * 0.04 }))
  let flashUntil = 0
  updates.push((dt, t) => {
    const now = wall()
    // ordinary krypton streaming through; the beams brighten when it flows
    stream.mat.opacity = T.on ? 0.85 : 0
    beamMat.opacity = damp(beamMat.opacity, T.on ? 0.95 : 0.5, 4, dt)
    centreGlow.material.opacity = T.on ? 0.22 : 0.1
    if (T.on) {
      for (let i = 0; i < ATOMS; i++) {
        const a = sx[i]
        a.x += a.v * dt
        if (a.x > 1.0) a.x = -1.0
        stream.pos.set([a.x, a.y, a.z], i * 3)
      }
      stream.geo.attributes.position.needsUpdate = true
    }
    // the rare ones: events from the wall clock, so every screen in a room sees the same catches
    if (T.on) {
      if (cnt.since !== T.since || cnt.sample !== T.sample || cnt.age !== T.age) {
        cnt.since = T.since
        cnt.sample = T.sample
        cnt.age = T.age
        cnt.b = Math.floor(T.since * 2)
        cnt.n = 0
        cnt.vis = Math.max(Math.floor(now * 2), cnt.b)
        for (const s of SP) s.live = false
      }
      const upto = Math.floor((now - 1.2) * 2)
      for (let guard = 0; cnt.b < upto && guard < 4000; guard++) {
        cnt.b++
        if (evAt(cnt.b)) cnt.n++
      }
      const visTo = Math.floor(now * 2)
      while (cnt.vis < visTo) {
        cnt.vis++
        if (evAt(cnt.vis)) {
          const s = SP.find(q => !q.live)
          if (s) {
            s.live = true
            s.t0 = cnt.vis / 2
          }
        }
      }
    }
    let caught = false
    for (const s of SP) {
      if (!s.live) {
        s.m.visible = false
        continue
      }
      const a = now - s.t0
      if (a > 3.3 || !T.on) {
        s.live = false
        s.m.visible = false
        continue
      }
      s.m.visible = true
      if (a < 1.2) {
        const u = ease(a / 1.2)
        s.m.position.set(-0.9 + 0.9 * (1 - Math.pow(1 - u, 2)), 0, 0)
        s.m.scale.setScalar(0.7 + 0.3 * u)
        s.halo.material.opacity = 0.35 + 0.4 * u
      } else if (a < 2.8) {
        s.m.position.set(0, 0, 0)
        const pulse = 1 + Math.sin((a - 1.2) * 12) * 0.12
        s.m.scale.setScalar(1.05 * pulse)
        s.halo.material.opacity = 0.95
        caught = true
      } else {
        const u = (a - 2.8) / 0.5
        s.m.position.set(u * 0.2, 0, 0)
        s.m.scale.setScalar(Math.max(0.01, 1 - u))
        s.halo.material.opacity = 0.9 * (1 - u)
      }
    }
    drawScreen(t, caught, T.on ? cnt.n : 0)
    drawDial()
  })
  const trapSet = (s, live, ago = 0) => {
    T.on = !!s?.on
    T.sample = s?.sample === 'water' ? 'water' : 'air'
    T.age = clamp(Math.round(Number(s?.age) || 0), 0, MILLION)
    T.since = s?.sinceAge != null ? wall() - Math.max(0, Number(s.sinceAge) || 0) - (ago || 0) : wall()
    T.seen = { air: !!s?.seen?.air, water: !!s?.seen?.water }
    cnt.since = -1
    repanel(trapPanel)
  }
  const trapState = () => ({ on: T.on, sample: T.sample, age: T.age, sinceAge: Math.round((wall() - T.since) * 100) / 100, seen: { ...T.seen } })

  updates.push((dt, t) => stage.update(t))

  const faceCentre = (u, v) => frameBox.localToWorld(V((u - 0.5) * FACE.w, FACE.y0 + v * FACE.h, 0.02))
  return {
    env: stage.env,
    solids,
    floor: groundAt,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.2 },
    spawn: { x: 0, z: 4.6, yaw: 0 },
    hostSpot: { x: -1.3, z: 3.2, yaw: Math.atan2(1.3, -1.2) },
    back: { x: 0, z: 6.8, rot: Math.PI },
    stand: { x: 2.1, z: 3.4, rot: Math.atan2(-2.1, 1.2) },
    // for the probes: tap(...) does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      source: {
        tap: (what, v) => srcStep(what, v), // 'cloud', 'time' (v = 0..1), 'step', 'back'
        set: k => {
          srcStep('time', clamp(k))
        },
        get state() { return srcState() },
        cloudAt: () => faceCentre(0.17, 0.86),
        trackAt: k => frameBox.localToWorld(V((clamp(k) * (TRACK.x1 - TRACK.x0) + TRACK.x0) / FW * FACE.w - FACE.w / 2, 0.4, 0.1 + PLINTH.d / 2)),
        faceAt: (u, v) => faceCentre(u, v),
      },
      well: {
        tap: what => wellStep(what), // 'pump', 'valve', 'bottle', 'fresh'
        get state() { return { ...wellState(), litresNow: Math.round(litres()) } },
        pumpAt: () => V(WELL.x + 0.5, 0.55, WELL.z),
        valveAt: () => V(TANK.x, groundAt(TANK.x, TANK.z) + valveY + 0.14, TANK.z),
        bottleAt: () => V(BOTTLE.x, groundAt(BOTTLE.x, BOTTLE.z) + 0.48, BOTTLE.z),
        boardAt: () => board.group.getWorldPosition(V()),
      },
      trap: {
        tap: (what, v) => trapStep(what, v), // 'gas', 'air', 'water', 'mark' (v = 0..4), 'age' (v = years)
        get state() { return trapState() },
        get caught() { return cnt.n },
        cylinderAt: () => cylHit.getWorldPosition(V()),
        airAt: () => airB.hit.getWorldPosition(V()),
        waterAt: () => watB.hit.getWorldPosition(V()),
        markAt: i => markHits[i].getWorldPosition(V()),
        chamberAt: () => chamber.getWorldPosition(V()),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { source: srcPanel, well: wellPanel, trap: trapPanel },
    shared: {
      source: { get: srcState, set: srcSet },
      well: { get: wellState, set: wellSet },
      trap: { get: trapState, set: trapSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const f of disposers) f()
    },
  }
}
