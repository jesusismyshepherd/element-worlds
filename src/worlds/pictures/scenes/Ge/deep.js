// Germanium's picture "Why hide a crystal under a mountain?" as a room (docs/knowledge/picture-rooms.md): the
// picture's hall made into a place. Hall A of the Laboratori Nazionali del Gran Sasso (stages/gransasso.js, made
// for this room): a clean, bright, concrete cavern under 1400 m of rock, the water tank of GERDA and
// LEGEND-200 at the far end. Three things to do, each step chosen by tapping its thing; the prompt names the
// next tap, E opens the station's panel, whose buttons and sliders do the same:
// - the rain from space (left): a cut-open model of the mountain, its depth scale true (0 to 1400 m of rock).
//   Streaks of cosmic rays fall and stop in the rock; tap the mountain (or the slider) to put the muon counter
//   at a depth and hear it slow from a rattle (600 000 muons per m2 per hour at the surface) to almost
//   nothing (about 1 per m2 per hour in the hall: LNGS, Borexino); tap the sky for a shower of 24 and see
//   which depths its particles reach;
// - the purest crystal (right): a germanium bar in a zone-refining furnace (Pfann, Bell Labs, 1951). Tap the
//   heater ring and a molten zone travels along the bar, carrying the impurity specks to the end; the gauge
//   counts atoms per cm3 pass by pass towards the 10^10 of a detector crystal. Tap the cobalt-60 source and
//   both its gamma rays are counted by a germanium detector and a sodium iodide one; a zoom slider shows
//   how sharp the germanium's lines are;
// - the long wait (middle): 25 crystals in a glass model of the liquid argon cryostat (40 kg of germanium-76),
//   tank and clean room behind. Tap the green button (or the years slider) and ordinary double-beta decays
//   build the broad hump on the big screen, about 320 a day; the line at 2039 keV, where the decay without
//   neutrinos would sit, stays empty. Tap a crystal for one decay in the lens; tap the lens for the decay
//   everyone hopes for (shown dashed, never seen).
// Sources and the numbers are in deep.words.js. parts.<station>.tap(...) does what a tap does.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, random, fill, num } from '../../../wings/noble/kit.js'
import { hallStage } from '../../stages/gransasso.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { DEEP_WORDS } from './deep.words.js'

export const WORDS = DEEP_WORDS

const TAU = Math.PI * 2
const TEAL = '#6fa4a0'
const TEAL_HI = '#d8f2ee'
const BLUE = '#58a8ff'
const GOLD = '#ffc93a'
const ACCENT = '#8a8cff'

// ---------- station 1: the mountain ----------
const S1 = { x: -5.4, z: -5.4 }
const D_MAX = 1400 // metres of rock over the hall
const SURF_Y = 4.1 // the model's surface above the hall (m)
const HALL_Y = 1.05 // the hall's roof in the model: 1400 m below the surface
const K1 = (SURF_Y - HALL_Y) / D_MAX // model metres per metre of rock
const X_H = 0.9 // the shaft above the hall
const R0 = 600000 // muons through a flat square metre, per hour, at the surface (about 1 per cm2 per minute)
const LOG_END = 5.7 // the hall: 10^-5.7 of that, about 1.2 per m2 per hour
const fSurv = d => Math.pow(10, -LOG_END * Math.pow(clamp(d / D_MAX), 0.9))
const rateAt = d => R0 * fSurv(d)
/** The depth (m) at which a fraction u of the cosmic muons is still going. */
const depthFor = u => D_MAX * Math.pow(-Math.log10(Math.max(1e-12, u)) / LOG_END, 1 / 0.9)
const PROFILE = [[-2.3, 0.35], [-1.95, 1.2], [-1.55, 2.2], [-1.25, 3.2], [-1.0, 4.2], [-0.8, 4.85], [-0.45, 4.5], [-0.05, 4.25], [0.45, 4.18], [X_H, SURF_Y], [1.4, 3.6], [1.8, 2.6], [2.15, 1.5], [2.3, 0.35]]
const surfaceAt = x => {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [x0, y0] = PROFILE[i]
    const [x1, y1] = PROFILE[i + 1]
    if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
  }
  return 0.35
}

// ---------- station 2: the furnace ----------
const S2 = { x: 5.4, z: -5.4 }
const BENCH = 0.95
const BAR = { x0: -1.85, x1: 0.35, y: 1.27, r: 0.1 }
const N_SPECK = 140
const N_PASS = 12
const KEEP = 0.25 // an example: a pass leaves a quarter of the impurity behind
const C0 = 4e16 // per cm3 of metal that is 99.9999 % germanium (4.4 x 10^22 atoms per cm3)
const C_HPGE = 1e10
const PASS_SECONDS = 5.5
const GE_FWHM = e => 0.00142 * e // keV, 1.9 at 1332 (0.14 %)
const NAI_FWHM = e => 0.049 * e * Math.sqrt(1332 / e) // 7 % at 662 keV scaled as 1/sqrt(E): about 4.9 % at 1332
const LINES = [[1173.2, 1], [1332.5, 1]]

// ---------- station 3: the long wait ----------
const S3 = { x: 0, z: -7.4 }
const MODEL = { x: -1.7, r: 0.8, base: 0.55, h: 3.0 }
const Q_BB = 2039 // keV, the energy of the decay with no neutrinos (GERDA: 2039.061)
const BIN = 40
const N_BIN = 53
const KG = 40 // kg of germanium-76 in the model's array
const T_HALF = 1.9e21 // years, the 2-neutrino decay
const PER_YEAR = ((KG * 1000) / 75.92) * 6.022e23 * Math.LN2 / T_HALF // about 117 000
const MAX_YEARS = 5

/** The shape of the ordinary double-beta spectrum (the sum of both electrons' energy): K (T0-K)^5 times a
 *  polynomial, K and T0 in electron masses (Doi, Kotani, Takasugi 1985). Normalised to 1 over the bins. */
const SHAPE = (() => {
  const T0 = Q_BB / 511
  const p = []
  let sum = 0
  for (let i = 0; i < N_BIN; i++) {
    const K = ((i + 0.5) * BIN) / 511
    const v = K < T0 ? K * Math.pow(T0 - K, 5) * (1 + 2 * K + (4 / 3) * K * K + (K * K * K) / 3 + (K * K * K * K) / 30) : 0
    p.push(v)
    sum += v
  }
  return p.map(v => v / sum)
})()
const cumShape = (() => {
  let c = 0
  return SHAPE.map(v => (c += v))
})()
const drawEnergy = u => {
  const i = cumShape.findIndex(c => c >= u)
  return (Math.max(0, i) + 0.5) * BIN
}

/** Two significant figures. */
const round2 = v => {
  const m = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1))
  return Math.round(v / m) * m
}
const fmtInt = (n, lang) => Math.round(n).toLocaleString(lang === 'pt-pt' ? 'pt-PT' : lang, { useGrouping: true })
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const sup = n => String(n).replace(/-/g, '⁻').replace(/\d/g, d => SUP[d])
/** 4.0 x 10^16 with real superscripts (HUD only). */
const sciText = (v, lang) => {
  if (v <= 0) return '0'
  const e = Math.floor(Math.log10(v) + 1e-9)
  const m = v / Math.pow(10, e)
  return `${num(m, 1, lang)} × 10${sup(e)}`
}
/** 4.0e16, the 3D fonts having no superscripts. */
const plainSci = (v, lang) => {
  const e = Math.floor(Math.log10(v) + 1e-9)
  return `${num(v / Math.pow(10, e), 1, lang)}e${e}`
}

export async function build({ ctx, root, lang, E, ex, say, light, level, color, clickable }) {
  const stage = hallStage({ light })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o })
  const glassMat = (c = '#d8eef4', op = 0.12) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.06, metalness: 0.1, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide, envMap: stage.shine, envMapIntensity: 1.1 })
  const sprite = (c, size, op = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: c, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending }))
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
  const tex = (w, h, draw, o) => {
    const t = canvasTex(w, h, draw, o)
    disposers.push(t)
    return t
  }
  const refresh = (title, panel) => ctx.store.get().panel?.title === title && ctx.showPanel(panel)
  /** A lit screen: a dark frame round a canvas face (faces +z). */
  const screenFace = (w, h, map, parent, x, y, z) => {
    const g = new THREE.Group()
    g.position.set(x, y, z)
    parent.add(g)
    mk(new RoundedBoxGeometry(w + 0.12, h + 0.12, 0.08, 2, 0.025), mats.dark, 0, 0, 0, g)
    mk(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, toneMapped: false }), 0, 0, 0.045, g)
    return g
  }
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
  const live = { mine: 0 }

  // yellow safety rectangles round the three stations
  stage.onFloor(S1.x + 0.3, S1.z + 0.4, 6.2, 2.6)
  stage.onFloor(S2.x + 0.4, S2.z + 0.3, 5.8, 2.2)
  stage.onFloor(S3.x, S3.z + 0.2, 6.0, 2.9)

  // the tank's name on its face, above the model
  tag('LEGEND-200', stage.tank.x - 0.3, 5.35, stage.tank.z + stage.tank.r + 0.04, 0, 0.42, '#f4f6fa', {}, root)
  tag(E.wait.tags.tank, stage.tank.x + 1.1, 4.85, stage.tank.z + stage.tank.r + 0.04, 0, 0.15, '#c9d2e0', {}, root)

  // ======================================================================================================
  // station 1: the rain from space
  // ======================================================================================================
  const A = { D: 0, tried: false, deepest: 0, showers: 0 }
  const a = { Dnow: 0, click: 0, clickT: 0, lit: 0, bestShower: 0 }
  const g1 = new THREE.Group()
  g1.position.set(S1.x, 0, S1.z)
  root.add(g1)
  // the mountain: its cut face is strata of rock, the hall and the road tunnel lit inside
  const faceTex = tex(1024, 1024, (g, w, h) => {
    const X = x => ((x + 2.3) / 4.6) * w
    const Y = y => h - ((y - 0.35) / 4.55) * h
    const rnd = random(88)
    g.fillStyle = '#3a3046'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 26; i++) {
      const y0 = i * (h / 22) - 30
      const cols = ['#4e4258', '#42384e', '#5a4e66', '#3a3046', '#4a4054']
      g.fillStyle = cols[i % cols.length]
      g.beginPath()
      g.moveTo(0, y0)
      for (let x = 0; x <= w; x += 32) g.lineTo(x, y0 + Math.sin(x * 0.01 + i * 1.7) * 14 + Math.sin(x * 0.031 + i) * 6)
      g.lineTo(w, y0 + h / 22 + 8)
      g.lineTo(0, y0 + h / 22 + 8)
      g.closePath()
      g.fill()
      g.strokeStyle = 'rgba(120,108,140,0.28)'
      g.lineWidth = 2
      g.stroke()
    }
    for (let i = 0; i < 4200; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(20,14,28,0.35)' : 'rgba(160,148,180,0.25)'
      g.fillRect(rnd() * w, rnd() * h, 1.5 + rnd() * 2, 1.5 + rnd() * 2)
    }
    // snow on the top
    const snow = g.createLinearGradient(0, Y(4.9), 0, Y(4.0))
    snow.addColorStop(0, 'rgba(200,206,238,0.95)')
    snow.addColorStop(0.6, 'rgba(168,176,216,0.6)')
    snow.addColorStop(1, 'rgba(168,176,216,0)')
    g.fillStyle = snow
    g.fillRect(0, Y(4.9), w, Y(4.0) - Y(4.9))
    // the road tunnel from the right edge to the hall, lit orange
    g.fillStyle = '#0e0e18'
    g.fillRect(X(1.35), Y(0.86), X(2.35) - X(1.35), Y(0.64) - Y(0.86))
    for (let x = 1.5; x < 2.3; x += 0.2) {
      g.fillStyle = 'rgba(255,200,110,0.9)'
      g.fillRect(X(x), Y(0.84), 8, 7)
    }
    // the hall: a vault, bright inside, a tank and its clean room
    g.fillStyle = '#d8dcf0'
    g.beginPath()
    g.moveTo(X(0.42), Y(0.4))
    g.lineTo(X(0.42), Y(0.78))
    g.quadraticCurveTo(X(0.9), Y(1.28), X(1.38), Y(0.78))
    g.lineTo(X(1.38), Y(0.4))
    g.closePath()
    g.fill()
    g.fillStyle = '#1a2040'
    g.beginPath()
    g.moveTo(X(0.46), Y(0.4))
    g.lineTo(X(0.46), Y(0.77))
    g.quadraticCurveTo(X(0.9), Y(1.2), X(1.34), Y(0.77))
    g.lineTo(X(1.34), Y(0.4))
    g.closePath()
    g.fill()
    g.fillStyle = '#9aa2b8'
    g.fillRect(X(0.78), Y(0.9), X(1.02) - X(0.78), Y(0.4) - Y(0.9))
    g.fillStyle = '#5ab0ff'
    g.fillRect(X(0.8), Y(0.84), X(1.0) - X(0.8), Y(0.44) - Y(0.84))
    g.fillStyle = '#e8eaf6'
    g.fillRect(X(0.8), Y(1.02), X(1.0) - X(0.8), Y(0.92) - Y(1.02))
  })
  const shape = new THREE.Shape(PROFILE.map(([x, y]) => new THREE.Vector2(x, y)))
  const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: false })
  slabGeo.translate(0, 0, -0.55)
  {
    const uv = slabGeo.attributes.uv
    const pos = slabGeo.attributes.position
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 2.3) / 4.6, (pos.getY(i) - 0.35) / 4.55)
  }
  const rockSide = M('#3a3046', { roughness: 0.95 })
  const slab = new THREE.Mesh(slabGeo, [new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.85, metalness: 0.05 }), rockSide])
  g1.add(slab)
  mk(new RoundedBoxGeometry(5.2, 0.35, 0.9, 2, 0.04), mats.dark, 0, 0.175, -0.2, g1)
  solids.push(box(S1.x, S1.z - 0.2, 5.2, 0.9))
  // stars behind the summit
  const starTex = tex(512, 256, (g, w, h) => {
    const rnd = random(11)
    const grd = g.createLinearGradient(0, h, 0, 0)
    grd.addColorStop(0, 'rgba(20,24,60,0)')
    grd.addColorStop(0.5, 'rgba(24,30,78,0.75)')
    grd.addColorStop(1, 'rgba(14,18,48,0.95)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 90; i++) {
      g.fillStyle = `rgba(230,234,255,${0.35 + rnd() * 0.6})`
      const s = rnd() < 0.2 ? 3 : 2
      g.fillRect(rnd() * w, rnd() * h * 0.9, s, s)
    }
  })
  mk(new THREE.PlaneGeometry(5.0, 2.8), new THREE.MeshBasicMaterial({ map: starTex, transparent: true, depthWrite: false }), 0, 5.0, -0.6, g1)
  // the depth scale: a post with a tick every 200 m (the mountain is drawn so that this scale is true)
  const ruler = new THREE.Group()
  ruler.position.set(-2.62, 0, 0.05)
  g1.add(ruler)
  mk(new THREE.BoxGeometry(0.05, SURF_Y - HALL_Y + 0.5, 0.05), mats.steel, 0, (SURF_Y + HALL_Y) / 2, 0, ruler)
  for (let d = 0; d <= D_MAX; d += 200) {
    const y = SURF_Y - d * K1
    mk(new THREE.BoxGeometry(0.18, 0.02, 0.03), mats.yellow, 0.05, y, 0, ruler)
    const t = tag(String(d), -0.05, y, 0.02, 0, 0.12, '#ffe9a8', { anchorX: 'right' }, ruler)
    t.userData.d = d
  }
  tag(E.rain.tags.ruler, -2.62, SURF_Y + 0.3, 0.05, 0, 0.11, '#ffd27a', { anchorX: 'center' }, g1)
  // the shaft down to the hall, dotted, and the counter's marker on it
  for (let d = 30; d < D_MAX; d += 60) mk(new THREE.BoxGeometry(0.03, 0.03, 0.02), M('#ffd27a', { emissive: '#ffd27a', emissiveIntensity: 0.6 }), X_H, SURF_Y - d * K1, 0.01, g1)
  const marker = new THREE.Group()
  g1.add(marker)
  mk(new THREE.SphereGeometry(0.075, 14, 10), M('#ffc93a', { emissive: '#ffc93a', emissiveIntensity: 1.2 }), 0, 0, 0, marker)
  const markerHalo = sprite('#ffc93a', 0.6, 0.7)
  marker.add(markerHalo)
  const band = mk(new THREE.BoxGeometry(4.0, 0.012, 0.01), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.3 }), 0, 0, 0.015, g1)
  tag(E.rain.tags.hall, X_H, 0.28, 0.02, 0, 0.1, '#cfe6ff', {}, g1)
  tag(E.rain.tags.road, 1.85, 0.5, 0.02, 0, 0.09, '#ffc88a', {}, g1)
  tag(E.rain.tags.sky, 0, 6.22, 0.03, 0, 0.14, '#c9ceff', {}, g1)

  // cosmic ray streaks: thin additive rods falling, each with its own stopping depth from the real law
  const NS = light ? 28 : 44
  const streakMat = new THREE.MeshBasicMaterial({ color: '#d8dcff', transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })
  const streaks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.035, 1, 0.035), streakMat, NS)
  streaks.frustumCulled = false
  streaks.raycast = () => {}
  streaks.renderOrder = 5
  g1.add(streaks)
  const sk = Array.from({ length: NS }, () => ({ on: false, x: 0, y: 6.4, vy: 5, lean: 0, stopY: 0, len: 0, fade: 0, depth: 0 }))
  const sparks = Array.from({ length: 20 }, () => {
    const s = sprite('#ffe8a0', 0.3, 0)
    s.renderOrder = 6
    g1.add(s)
    return { s, age: 9 }
  })
  const dum = new THREE.Object3D()
  const Y_TOP = 6.3
  let spawnClock = 0
  const startStreak = (st, depthM, x) => {
    const lean = (Math.random() - 0.5) * 0.3
    st.on = true
    st.x = x
    st.lean = lean
    st.y = Y_TOP
    st.vy = 4.2 + Math.random() * 1.6
    st.depth = depthM
    st.stopY = Math.max(0.45, surfaceAt(x) - depthM * K1)
    st.fade = 0
    st.len = 0.55
    st.x0 = x
    return st
  }
  const spawnRandom = () => {
    const st = sk.find(s => !s.on)
    if (!st) return null
    const x = -1.5 + Math.random() * 3.2
    return startStreak(st, depthFor(Math.max(1e-9, Math.random())), x)
  }
  const spark = (x, y) => {
    const sp = sparks.find(s => s.age > 0.7)
    if (!sp) return
    sp.age = 0
    sp.s.position.set(x, y, 0.06)
  }
  const stepStreaks = dt => {
    spawnClock -= dt
    if (spawnClock <= 0) {
      spawnClock = 0.16 + Math.random() * 0.14
      spawnRandom()
    }
    for (let i = 0; i < NS; i++) {
      const st = sk[i]
      if (!st.on) {
        dum.position.set(0, -50, 0)
        dum.scale.set(0.001, 0.001, 0.001)
        dum.updateMatrix()
        streaks.setMatrixAt(i, dum.matrix)
        continue
      }
      if (st.fade === 0) {
        st.y -= st.vy * dt
        st.x = st.x0 + (Y_TOP - st.y) * Math.tan(st.lean)
        if (st.y <= st.stopY) {
          st.y = st.stopY
          st.fade = 0.0001
          if (st.stopY > 0.5) spark(st.x, st.y)
          st.fadeStart = true
        }
      } else {
        st.fade += dt
        if (st.fade > 0.9) {
          st.on = false
          continue
        }
      }
      const tail = st.fade === 0 ? st.len : Math.max(0.02, st.len * (1 - st.fade / 0.8))
      dum.position.set(st.x + Math.sin(st.lean) * tail * 0.5, st.y + Math.cos(st.lean) * tail * 0.5, 0.04)
      dum.rotation.set(0, 0, -st.lean)
      dum.scale.set(1, tail, 1)
      dum.updateMatrix()
      streaks.setMatrixAt(i, dum.matrix)
    }
    streaks.instanceMatrix.needsUpdate = true
    for (const sp of sparks) {
      sp.age += dt
      const k = sp.age / 0.7
      sp.s.material.opacity = k >= 1 ? 0 : (1 - k) * 0.95
      sp.s.scale.setScalar(0.18 + 0.25 * k)
    }
  }
  // the counter: a Geiger tube in a case, a display and a lamp that blinks at every click
  const counter = new THREE.Group()
  counter.position.set(1.85, 0, 0.85)
  g1.add(counter)
  mk(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 12), mats.dark, 0, 0.45, 0, counter)
  mk(new THREE.CylinderGeometry(0.3, 0.34, 0.06, 20), mats.dark, 0, 0.03, 0, counter)
  const caseG = new THREE.Group()
  caseG.position.set(0, 1.05, 0)
  counter.add(caseG)
  mk(new RoundedBoxGeometry(1.5, 1.0, 0.3, 3, 0.05), mats.yellow, 0, 0, 0, caseG)
  const counterTex = tex(512, 320, () => {})
  const counterFace = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 0.72), new THREE.MeshBasicMaterial({ map: counterTex, toneMapped: false }))
  counterFace.position.set(0, 0.06, 0.155)
  caseG.add(counterFace)
  const lamp = mk(new THREE.SphereGeometry(0.06, 12, 8), M('#401414', { emissive: '#ff3a2a', emissiveIntensity: 0 }), 0.6, -0.4, 0.17, caseG)
  mk(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 8), mats.brass, -0.4, -0.45, 0.2, caseG).rotation.z = Math.PI / 2
  const counterHit = hit(1.6, 1.1, 0.4, 0, 1.05, 0.02, counter)
  solids.push(circle(S1.x + 1.85, S1.z + 0.85, 0.42))
  let counterKey = ''
  const drawCounter = () => {
    const lv = level()
    const d = Math.round(a.Dnow / 10) * 10
    const r = rateAt(a.Dnow)
    const key = `${lv}|${d}|${Math.round(r)}`
    if (key === counterKey) return
    counterKey = key
    counterTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1230'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.textAlign = 'left'
      g.fillStyle = '#ffd27a'
      g.font = '700 28px Outfit, sans-serif'
      g.fillText(E.rain.tags.counter, 24, 36)
      g.textAlign = 'right'
      g.fillStyle = '#aab6e0'
      g.font = '700 30px Outfit, sans-serif'
      g.fillText(`${fmtInt(d, lang)} m`, w - 24, 36)
      g.textAlign = 'center'
      g.fillStyle = '#ffffff'
      const txt = r >= 100 ? fmtInt(r, lang) : num(r, 1, lang)
      g.font = `700 ${txt.length > 6 ? 96 : 118}px Outfit, sans-serif`
      g.fillText(txt, w / 2, 158)
      g.fillStyle = '#9fb0e0'
      g.font = '700 32px Nunito, sans-serif'
      g.fillText(E.rain.tags.unit, w / 2, 244)
      if (lv === 'scientist') {
        g.fillStyle = '#7dd8ff'
        g.font = '700 28px Nunito, sans-serif'
        g.fillText(`${r >= 1 ? '×' : ''} ${sciText(r / R0, lang)}`, w / 2, 288)
      }
    })
  }
  // taps: the mountain's face puts the counter at that depth, the sky sends a shower, the counter reads out
  const faceHit = hit(4.6, 4.6, 0.6, 0, 2.65, -0.3, g1)
  const skyHit = hit(5.0, 1.5, 0.3, 0, 5.65, 0.1, g1)
  const rHint = () => {
    const h = E.rain.hints
    if (A.D < 100) return h.dig
    if (!A.tried) return h.sky
    if (A.D < D_MAX - 100) return h.deeper
    return h.counter
  }
  const shower = () => {
    // 24 particles at once, each drawn from the real law: how deep does each one get?
    let deepest = 0
    let made = 0
    for (let i = 0; i < 24; i++) {
      const st = sk.find(s => !s.on)
      if (!st) break
      const depth = depthFor(Math.max(1e-9, Math.random()))
      deepest = Math.max(deepest, Math.min(depth, 2000))
      startStreak(st, depth, -1.4 + (i / 23) * 3.1 + (Math.random() - 0.5) * 0.1)
      made++
    }
    return { made, deepest }
  }
  function rainStep(what, arg) {
    const lv = level()
    const says = E.rain.says
    live.mine = 16
    if (what === 'depth' || what === 'mountain') {
      A.D = clamp(Math.round(Number(arg) / 10) * 10, 0, D_MAX)
      if (what === 'mountain') play('tap')
    } else if (what === 'top' || what === 'half' || what === 'hall') {
      A.D = what === 'top' ? 0 : what === 'half' ? 700 : D_MAX
      play('select')
      tell(at(says[what], lv))
    } else if (what === 'sky') {
      const { made, deepest } = shower()
      A.tried = true
      A.showers++
      A.deepest = deepest
      play('discover')
      tell(fill(at(deepest >= D_MAX ? says.reached : says.shower, lv), { n: made, d: fmtInt(Math.min(deepest, D_MAX), lang), c: fmtInt(Math.max(5, Math.round(deepest / 10) * 10), lang) }))
    } else if (what === 'counter') {
      const r = rateAt(a.Dnow)
      play('beep')
      tell(fill(at(says.count, lv), { d: fmtInt(a.Dnow, lang), r: r >= 100 ? fmtInt(r, lang) : num(r, 1, lang) }))
    } else return
    refresh(E.rain.title, rainPanel)
    ex.discover('rain', rainPanel, 4.2)
    if (what !== 'sky' && what !== 'counter') share('rain')
  }
  const rainPanel = lv => {
    const r = rateAt(A.D)
    const rt = r >= 100 ? fmtInt(r, lang) : num(r, 1, lang)
    return {
      title: E.rain.title,
      color,
      blocks: [
        { slider: { label: E.rain.slider, min: 0, max: D_MAX, step: 10, value: A.D, onInput: v => rainStep('depth', v), format: v => `${fmtInt(v, lang)} m`, live: () => A.D } },
        { buttons: [{ label: E.rain.buttons.top, onClick: () => rainStep('top') }, { label: E.rain.buttons.half, onClick: () => rainStep('half') }, { label: E.rain.buttons.hall, onClick: () => rainStep('hall') }] },
        { buttons: [{ label: E.rain.buttons.sky, onClick: () => rainStep('sky') }, { label: E.rain.buttons.counter, onClick: () => rainStep('counter') }] },
        {
          rows: [
            [E.rain.rows.depth, `${fmtInt(A.D, lang)} m`],
            [E.rain.rows.rate, `${rt} ${E.rain.units.rate}`],
            [E.rain.rows.less, r >= R0 * 0.99 ? '1' : `1 : ${fmtInt(round2(R0 / r), lang)}`],
            ...(lv === 'scientist' ? [[E.rain.rows.rock, `${fmtInt((A.D * 2.7) / 1, lang)} ${E.rain.units.mwe}`]] : []),
          ],
        },
        ...E.rain.panel[depthOf(lv)].map(p => ({ p })),
      ],
    }
  }
  clickable(faceHit, h => rainStep('mountain', (SURF_Y - (h.point.y - 0)) / K1), { reach: 8 })
  clickable(skyHit, () => rainStep('sky'), { reach: 8 })
  clickable(counterHit, () => rainStep('counter'), { reach: 7 })
  const rainItem = ex.add({
    id: 'rain',
    x: S1.x + 0.4,
    z: S1.z + 3.6,
    radius: 2.2,
    manual: true,
    label: E.rain.label,
    verb: rHint,
    focus: { x: S1.x + 0.2, y: 2.7, z: S1.z, size: 6.4, width: 5.8 },
    act: () => ctx.showPanel(rainPanel),
  })
  focusBy(rainItem, rainItem.focus, { x: S1.x - 0.2, y: 2.7, z: S1.z, size: 6.4, width: 5.8 })

  // ======================================================================================================
  // station 2: the purest crystal
  // ======================================================================================================
  const B = { N: 0, shots: 0, zoom: 0.5 }
  const b = { zone: null, shotsNow: 0, pulse: 0, lastDraw: '', mine: false }
  const g2 = new THREE.Group()
  g2.position.set(S2.x, 0, S2.z)
  root.add(g2)
  // the bench
  const benchX = -0.65
  mk(new RoundedBoxGeometry(3.0, 0.07, 0.95, 2, 0.02), mats.panel, benchX, BENCH, 0, g2)
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(new THREE.BoxGeometry(0.07, BENCH, 0.07), mats.steel, benchX + sx * 1.4, BENCH / 2, sz * 0.4, g2)
  mk(new THREE.BoxGeometry(2.9, 0.05, 0.85), mats.dark, benchX, 0.22, 0, g2)
  solids.push(box(S2.x + benchX, S2.z, 3.1, 1.05))
  // the detectors' table, to the right
  const tabX = 2.2
  mk(new RoundedBoxGeometry(1.9, 0.07, 0.95, 2, 0.02), mats.panel, tabX, BENCH, 0, g2)
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(new THREE.BoxGeometry(0.07, BENCH, 0.07), mats.steel, tabX + sx * 0.85, BENCH / 2, sz * 0.4, g2)
  mk(new THREE.BoxGeometry(1.8, 0.05, 0.85), mats.dark, tabX, 0.22, 0, g2)
  solids.push(box(S2.x + tabX, S2.z, 2.0, 1.05))
  // the quartz tube and the bar of germanium in it
  mk(new THREE.CylinderGeometry(0.2, 0.2, 2.55, 28, 1, true), glassMat('#dfeef2', 0.12), BAR.x0 + 1.1 + 0.1, BAR.y, 0, g2).rotation.z = Math.PI / 2
  for (const sx of [-1, 1]) {
    mk(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 24), mats.copper, BAR.x0 + 1.1 + 0.1 + sx * 1.3, BAR.y, 0, g2).rotation.z = Math.PI / 2
  }
  for (const sx of [-1, 1]) mk(new THREE.BoxGeometry(0.1, BAR.y - BENCH - 0.2, 0.16), mats.dark, BAR.x0 + 1.1 + 0.1 + sx * 1.0, (BENCH + BAR.y - 0.2) / 2 + 0.02, 0, g2)
  const geMat = new THREE.MeshStandardMaterial({ color: '#59636b', roughness: 0.3, metalness: 0.88, envMap: stage.shine, envMapIntensity: 1.1 })
  const BL = BAR.x1 - BAR.x0
  mk(new THREE.CylinderGeometry(BAR.r, BAR.r, BL, 28), geMat, (BAR.x0 + BAR.x1) / 2, BAR.y, 0, g2).rotation.z = Math.PI / 2
  // the impurity specks, riding on the bar's top
  const specks = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }), N_SPECK)
  specks.frustumCulled = false
  specks.raycast = () => {}
  g2.add(specks)
  const speckData = []
  {
    const rnd = random(1951)
    const cols = ['#ff5a4a', '#ffd24a', '#d070ff', '#ff9a3a']
    const c = new THREE.Color()
    for (let i = 0; i < N_SPECK; i++) {
      const r = Math.max(1e-6, rnd())
      speckData.push({ s: 0.02 + rnd() * 0.88, n: Math.floor(Math.log(r) / Math.log(KEEP)) + 1, e: 0.9 + rnd() * 0.09, zOff: 0.01 + rnd() * 0.08 })
      specks.setColorAt(i, c.set(cols[i % cols.length]))
    }
    specks.instanceColor.needsUpdate = true
  }
  const speckPos = (i, N, anim, z) => {
    const d = speckData[i]
    const done = anim ? N - 1 : N
    if (d.n <= done) return d.e
    if (anim && d.n === done + 1) return z <= d.s ? d.s : Math.min(d.e, Math.max(d.s, z))
    return d.s
  }
  // the molten zone and the heater: a copper coil on a carriage, the zone glowing under it
  const molten = mk(new THREE.CylinderGeometry(BAR.r + 0.008, BAR.r + 0.008, 0.26, 24), new THREE.MeshBasicMaterial({ color: '#ff9a3a', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }), 0, BAR.y, 0, g2)
  molten.rotation.z = Math.PI / 2
  molten.raycast = () => {}
  const zoneGlow = sprite('#ff8a2a', 0.9, 0)
  zoneGlow.position.set(0, BAR.y + 0.05, 0.1)
  g2.add(zoneGlow)
  const zoneLight = new THREE.PointLight('#ff8a3a', 0, 3.2, 1.6)
  zoneLight.position.set(0, BAR.y + 0.6, 0.3)
  g2.add(zoneLight)
  const ringG = new THREE.Group()
  g2.add(ringG)
  for (let i = -1; i <= 1; i++) mk(new THREE.TorusGeometry(0.26, 0.04, 8, 32), mats.copper, i * 0.075, 0, 0, ringG).rotation.y = Math.PI / 2
  mk(new THREE.BoxGeometry(0.28, 0.06, 0.06), mats.copper, 0, 0.26, 0, ringG)
  mk(new THREE.BoxGeometry(0.06, BAR.y - BENCH - 0.1, 0.06), mats.dark, 0, -(BAR.y - BENCH - 0.1) / 2 - 0.2, 0.0, ringG)
  const carriage = mk(new THREE.BoxGeometry(0.3, 0.08, 0.3), mats.dark, 0, -(BAR.y - BENCH) + 0.01 - 0.01, 0, ringG)
  carriage.position.y = BENCH + 0.06 - BAR.y
  // the rail the carriage runs on, along the front edge of the bench
  mk(new THREE.BoxGeometry(2.5, 0.03, 0.05), mats.steel, BAR.x0 + 1.2, BENCH + 0.045, 0, g2)
  const ringHit = hit(0.5, 0.75, 0.7, 0, 0, 0, ringG)
  tag(E.pure.tags.ring, 0, 0.65, 0.2, 0, 0.1, '#ffc88a', {}, ringG)
  tag(E.pure.tags.ingot, BAR.x0 + 0.65, BAR.y + 0.33, 0.12, 0, 0.1, TEAL_HI, {}, g2)
  const ringX = z => BAR.x0 + z * BL
  // the purity gauge on a post, behind the bench
  const gaugeTex = tex(1024, 512, () => {})
  screenFace(2.2, 1.1, gaugeTex, g2, benchX - 0.1, 2.5, -0.6)
  mk(new THREE.CylinderGeometry(0.045, 0.05, 1.5, 10), mats.dark, benchX - 0.1, BENCH + 0.75 + 0.05, -0.7, g2)
  // the cobalt source, between the two detectors
  const srcX = tabX
  const srcG = new THREE.Group()
  srcG.position.set(srcX, BENCH + 0.035, 0.0)
  g2.add(srcG)
  mk(new THREE.CylinderGeometry(0.16, 0.18, 0.3, 20), M('#4a4e56', { metalness: 0.85, roughness: 0.4, envMap: stage.shine, envMapIntensity: 0.9 }), 0, 0.15, 0, srcG)
  mk(new THREE.BoxGeometry(0.34, 0.1, 0.06), mats.black, 0, 0.17, 0.0, srcG)
  mk(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 3), M('#e8c020', { emissive: '#7a6000', emissiveIntensity: 0.5 }), 0, 0.3, 0.0, srcG).position.y = 0.31
  const srcTagWorld = tag(E.pure.tags.source, srcX, BENCH + 0.58, 0.2, 0, 0.1, '#ffe08a', {}, g2)
  const srcHit = hit(0.5, 0.5, 0.5, srcX, BENCH + 0.3, 0.0, g2)
  // the germanium detector: a dewar of liquid nitrogen and a cryostat arm ending in a copper cap
  const geD = new THREE.Group()
  geD.position.set(tabX - 0.75, BENCH + 0.035, 0)
  g2.add(geD)
  mk(new THREE.CylinderGeometry(0.2, 0.2, 0.62, 24), mats.steel, -0.2, 0.31, 0, geD)
  mk(new THREE.SphereGeometry(0.2, 24, 8, 0, TAU, 0, Math.PI / 2), mats.steel, -0.2, 0.62, 0, geD)
  mk(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 14), mats.steel, 0.1, 0.52, 0, geD).rotation.z = Math.PI / 2
  mk(new THREE.CylinderGeometry(0.11, 0.11, 0.26, 20), mats.copper, 0.45, 0.52, 0, geD).rotation.z = Math.PI / 2
  const frost = sprite('#e8f4ff', 0.7, 0.28)
  frost.position.set(-0.2, 0.75, 0.1)
  geD.add(frost)
  tag(E.pure.tags.ge, 0.28, 0.82, 0.18, 0, 0.1, TEAL_HI, {}, geD)
  const geHit = hit(0.9, 0.8, 0.45, 0.1, 0.4, 0, geD)
  // the sodium iodide detector: an aluminium can and its photomultiplier
  const naD = new THREE.Group()
  naD.position.set(tabX + 0.75, BENCH + 0.035, 0)
  g2.add(naD)
  mk(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 24), mats.steel, -0.15, 0.2, 0, naD).rotation.z = Math.PI / 2
  mk(new THREE.CylinderGeometry(0.12, 0.12, 0.38, 20), mats.black, 0.17, 0.2, 0, naD).rotation.z = Math.PI / 2
  mk(new THREE.BoxGeometry(0.1, 0.12, 0.2), mats.dark, 0.4, 0.2, 0, naD)
  tag(E.pure.tags.nai, 0.1, 0.55, 0.18, 0, 0.1, '#ffd2a0', {}, naD)
  const naHit = hit(0.8, 0.45, 0.4, 0.1, 0.22, 0, naD)
  // gamma pulses between the source and the detectors
  const pulses = Array.from({ length: 14 }, () => {
    const s = sprite('#fff2c0', 0.17, 0)
    s.renderOrder = 6
    g2.add(s)
    return { s, t: 9, dir: 1, kind: 0 }
  })
  const firePulse = (dir, kind) => {
    const p = pulses.find(x => x.t > 0.55)
    if (!p) return
    p.t = 0
    p.dir = dir
    p.kind = kind
  }
  // the spectrum screen: germanium above, sodium iodide below
  const specTex = tex(1024, 640, () => {})
  screenFace(2.3, 1.44, specTex, g2, tabX + 0.2, 2.85, -0.6)
  mk(new THREE.CylinderGeometry(0.045, 0.05, 1.8, 10), mats.dark, tabX + 0.2, BENCH + 0.9 + 0.05, -0.7, g2)
  // the gauge and the spectra are drawn when something changes
  const purity = N => C0 * Math.pow(KEEP, N)
  let gaugeKey = ''
  const drawGauge = () => {
    const lv = level()
    const Nv = b.zone ? B.N - 1 + clamp(b.zone.t) : B.N
    const key = `${lv}|${B.N}|${b.zone ? Math.round(b.zone.t * 30) : -1}`
    if (key === gaugeKey) return
    gaugeKey = key
    const P = E.pure.board
    const c = purity(Nv)
    gaugeTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1230'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.textAlign = 'left'
      g.fillStyle = '#ffd27a'
      g.font = '700 52px Outfit, sans-serif'
      g.fillText(P.title, 40, 56)
      g.fillStyle = '#aab6e0'
      g.font = '700 34px Nunito, sans-serif'
      g.fillText(P.unit, 40, 108)
      g.textAlign = 'right'
      g.fillStyle = '#ffffff'
      g.font = '700 84px Outfit, sans-serif'
      g.fillText(plainSci(c, lang), w - 40, 92)
      // the scale: 10^17 at the left, 10^9 at the right
      const x0 = 70
      const x1 = w - 70
      const lg = v => (17 - Math.log10(v)) / 8
      g.fillStyle = '#1b2658'
      g.fillRect(x0, 200, x1 - x0, 70)
      const grd = g.createLinearGradient(x0, 0, x1, 0)
      grd.addColorStop(0, '#ff5a4a')
      grd.addColorStop(0.5, '#ffd24a')
      grd.addColorStop(1, TEAL)
      g.fillStyle = grd
      g.fillRect(x0, 200, (x1 - x0) * clamp(lg(c)), 70)
      g.font = '700 32px Outfit, sans-serif'
      g.textAlign = 'center'
      for (let e = 17; e >= 9; e -= 2) {
        const x = x0 + (x1 - x0) * ((17 - e) / 8)
        g.fillStyle = '#c8d2ec'
        g.fillRect(x - 1.5, 270, 3, 18)
        g.fillText(`1e${e}`, x, 316)
      }
      // the detector-crystal level
      const xh = x0 + (x1 - x0) * lg(C_HPGE)
      g.fillStyle = GOLD
      g.fillRect(xh - 3, 180, 6, 110)
      g.textAlign = 'center'
      g.font = '700 34px Outfit, sans-serif'
      g.fillText(P.hpge, xh, 160)
      // the passes
      g.textAlign = 'left'
      g.fillStyle = '#e8ecf6'
      g.font = '700 46px Outfit, sans-serif'
      g.fillText(`${P.passes}: ${B.N} / ${N_PASS}`, 40, 396)
      g.textAlign = 'right'
      g.fillStyle = c <= C_HPGE ? '#7dff9a' : '#9aa6c8'
      g.fillText(c <= C_HPGE ? P.enough : P.more, w - 40, 396)
      if (lv === 'scientist') {
        g.textAlign = 'left'
        g.fillStyle = '#7dd8ff'
        g.font = '700 30px Nunito, sans-serif'
        g.fillText(P.sci, 40, 462)
      }
    })
  }
  /** Counts per bin of one detector's spectrum after `shots` minutes (smooth, with seeded noise). */
  const spectrum = (kind, lo, hi, n, shots) => {
    const out = new Float32Array(n)
    if (shots <= 0) return out
    const fwhm = kind === 'ge' ? GE_FWHM : NAI_FWHM
    const area = kind === 'ge' ? 400000 : 2000000
    const rnd = random(kind === 'ge' ? 7 : 9)
    for (let i = 0; i < n; i++) {
      const e = lo + ((i + 0.5) / n) * (hi - lo)
      const wBin = (hi - lo) / n
      let v = 0
      for (const [E0, wt] of LINES) {
        const sg = fwhm(E0) / 2.355
        v += area * wt * wBin * Math.exp(-0.5 * ((e - E0) / sg) ** 2) / (sg * Math.sqrt(TAU))
        // the Compton shelf below each line's edge
        const edge = E0 * (2 * E0 / (2 * E0 + 511))
        v += area * 0.55 * wt * wBin * (e < edge ? 1 / E0 * (0.5 + 0.5 * (e / edge)) : 0) * (e > 0 ? 1 : 0)
      }
      // a low background, falling with energy
      v += area * 0.02 * wBin * Math.exp(-e / 700) / 700 * 10
      const mean = v * shots
      out[i] = Math.max(0, mean + Math.sqrt(mean) * (rnd() + rnd() + rnd() - 1.5) * 1.1)
    }
    return out
  }
  let specKey = ''
  const window2 = () => {
    const z = B.zoom
    const w = 1500 * Math.pow(0.02, z)
    const c = z < 0.5 ? 750 + (1253 - 750) * (z / 0.5) : 1253 + (1333 - 1253) * ((z - 0.5) / 0.5)
    const lo = Math.max(0, c - w / 2)
    return [lo, lo + w]
  }
  const drawSpectra = () => {
    const lv = level()
    const shots = b.shotsNow
    const key = `${lv}|${Math.round(shots * 20)}|${Math.round(B.zoom * 100)}`
    if (key === specKey) return
    specKey = key
    const P = E.pure.board
    const [lo, hi] = window2()
    const n = 140
    specTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1230'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      const panel = (y0, hh, kind, colour, label, fw) => {
        const data = spectrum(kind, lo, hi, n, shots)
        let max = 1
        for (const v of data) max = Math.max(max, v)
        const px0 = 70
        const px1 = w - 30
        const py1 = y0 + hh - 44
        const py0 = y0 + 52
        g.strokeStyle = '#3a4580'
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(px0, py0)
        g.lineTo(px0, py1)
        g.lineTo(px1, py1)
        g.stroke()
        g.fillStyle = colour
        g.textAlign = 'left'
        g.font = '700 40px Outfit, sans-serif'
        g.fillText(label, px0, y0 + 26)
        g.textAlign = 'right'
        g.fillStyle = '#9fb0e0'
        g.font = '700 28px Nunito, sans-serif'
        g.fillText(lv === 'scientist' ? fw : '', px1, y0 + 26)
        // the bars
        g.fillStyle = colour
        const bw = (px1 - px0) / n
        for (let i = 0; i < n; i++) {
          const hgt = ((py1 - py0 - 6) * data[i]) / max
          if (hgt > 0.5) g.fillRect(px0 + i * bw, py1 - hgt, Math.max(1, bw - 0.6), hgt)
        }
        // the energy axis
        g.fillStyle = '#c8d2ec'
        g.font = '700 26px Nunito, sans-serif'
        g.textAlign = 'center'
        const span = hi - lo
        const step = span > 900 ? 250 : span > 350 ? 100 : span > 150 ? 50 : span > 60 ? 20 : span > 25 ? 10 : 5
        for (let e = Math.ceil(lo / step) * step; e <= hi; e += step) {
          const x = px0 + ((e - lo) / span) * (px1 - px0)
          g.fillRect(x - 1, py1, 2, 8)
          g.fillText(String(e), x, py1 + 24)
        }
        // the lines' energies
        for (const [E0] of LINES) {
          if (kind !== 'ge' || E0 < lo || E0 > hi || shots <= 0) continue
          const x = px0 + ((E0 - lo) / span) * (px1 - px0)
          g.fillStyle = '#ffe08a'
          g.font = '700 28px Outfit, sans-serif'
          g.textAlign = 'left'
          g.fillText(String(E0), x + 10, py0 + 22)
        }
        if (shots <= 0) {
          g.fillStyle = '#6c78a8'
          g.font = '700 34px Outfit, sans-serif'
          g.textAlign = 'center'
          g.fillText(P.empty, (px0 + px1) / 2, (py0 + py1) / 2)
        }
      }
      panel(0, h / 2, 'ge', TEAL_HI, P.ge, P.geFw)
      panel(h / 2, h / 2, 'nai', '#ffb070', P.nai, P.naiFw)
      g.fillStyle = '#6c78a8'
      g.font = '700 24px Nunito, sans-serif'
      g.textAlign = 'right'
      g.fillText(P.keV, w - 30, h - 12)
    })
  }
  const pHint = () => {
    const h = E.pure.hints
    if (B.N === 0) return h.ring
    if (B.N < 3) return h.again
    if (B.shots === 0) return h.source
    if (B.zoom < 0.9) return h.zoom
    return h.done
  }
  function pureStep(what, arg) {
    const lv = level()
    const says = E.pure.says
    live.mine = 16
    if (what === 'ring' || what === 'pass') {
      if (b.zone) return false
      if (B.N >= N_PASS) {
        tell(at(says.max, lv))
        return false
      }
      B.N++
      b.zone = { t: 0 }
      b.mine = true
      play('select')
      if (B.N === 1) tell(at(says.first, lv))
      else if (B.N === 3) tell(at(says.three, lv))
    } else if (what === 'passes') {
      B.N = clamp(Math.round(Number(arg)), 0, N_PASS)
      b.zone = null
      play('tap')
    } else if (what === 'new') {
      B.N = 0
      b.zone = null
      play('part')
    } else if (what === 'source') {
      B.shots++
      b.pulse = 2.4
      b.mine = true
      play('join')
      tell(at(B.shots === 1 ? says.source : says.again, lv))
    } else if (what === 'zoom') {
      B.zoom = clamp(Number(arg))
    } else if (what === 'clear') {
      B.shots = 0
      b.shotsNow = 0
      play('part')
    } else if (what === 'ge') {
      play('tap')
      tell(at(says.ge, lv))
    } else if (what === 'nai') {
      play('tap')
      tell(at(says.nai, lv))
    } else return
    refresh(E.pure.title, purePanel)
    ex.discover('pure', purePanel, 4.2)
    if (what !== 'ge' && what !== 'nai') share('pure')
  }
  const purePanel = lv => {
    const c = purity(B.N)
    return {
      title: E.pure.title,
      color,
      blocks: [
        { slider: { label: E.pure.slider, min: 0, max: N_PASS, step: 1, value: B.N, onInput: v => pureStep('passes', v), format: v => String(Math.round(v)), live: () => B.N } },
        { slider: { label: E.pure.zoom, min: 0, max: 1, step: 0.01, value: B.zoom, onInput: v => pureStep('zoom', v), format: v => { const w = 1500 * Math.pow(0.02, v); return `${w >= 100 ? fmtInt(w, lang) : num(w, w >= 10 ? 0 : 1, lang)} keV` }, live: () => B.zoom } },
        { buttons: [{ label: E.pure.buttons.pass, onClick: () => pureStep('pass') }, { label: E.pure.buttons.fresh, onClick: () => pureStep('new') }] },
        { buttons: [{ label: E.pure.buttons.source, onClick: () => pureStep('source') }, { label: E.pure.buttons.clear, onClick: () => pureStep('clear') }] },
        {
          rows: [
            [E.pure.rows.passes, `${B.N} / ${N_PASS}`],
            [E.pure.rows.atoms, `${sciText(c, lang)} ${E.pure.units.cm3}`],
            [E.pure.rows.shots, String(B.shots)],
            ...(lv === 'scientist' ? [[E.pure.rows.share, sciText(c / 4.4e22, lang)]] : []),
          ],
        },
        ...E.pure.panel[depthOf(lv)].map(p => ({ p })),
      ],
    }
  }
  clickable(ringHit, () => pureStep('ring'), { reach: 7 })
  clickable(srcHit, () => pureStep('source'), { reach: 7 })
  clickable(geHit, () => pureStep('ge'), { reach: 7 })
  clickable(naHit, () => pureStep('nai'), { reach: 7 })
  const pureItem = ex.add({
    id: 'pure',
    x: S2.x + 0.4,
    z: S2.z + 3.3,
    radius: 2.2,
    manual: true,
    label: E.pure.label,
    verb: pHint,
    focus: { x: S2.x + 0.5, y: 2.0, z: S2.z - 0.2, size: 5.4, width: 5.8 },
    act: () => ctx.showPanel(purePanel),
  })
  focusBy(pureItem, pureItem.focus, { x: S2.x + 0.7, y: 2.0, z: S2.z - 0.2, size: 5.4, width: 5.8 })

  // ======================================================================================================
  // station 3: the long wait
  // ======================================================================================================
  const C = { years: 0, mode: 0, dec: 0 }
  const c = { yearsNow: 0, run: null, lensT: 9, lensMode: 0, lensAt: -1, evtE: 0, evtT: -9, flash: [], lensKey: '', specKey: '' }
  const g3 = new THREE.Group()
  g3.position.set(S3.x, 0, S3.z)
  root.add(g3)
  // the cryostat model: a glass jar of liquid argon on a plinth, 25 crystals hanging in five strings
  const mx = MODEL.x
  mk(new THREE.CylinderGeometry(MODEL.r + 0.12, MODEL.r + 0.2, MODEL.base, 32), mats.dark, mx, MODEL.base / 2, 0, g3)
  mk(new THREE.CylinderGeometry(MODEL.r + 0.05, MODEL.r + 0.05, 0.06, 32), mats.steel, mx, MODEL.base + 0.03, 0, g3)
  solids.push(circle(S3.x + mx, S3.z, MODEL.r + 0.3))
  const yTop = MODEL.base + MODEL.h
  const jar = mk(new THREE.CylinderGeometry(MODEL.r, MODEL.r, MODEL.h, 40, 1, true), glassMat('#cfe4ff', 0.1), mx, MODEL.base + MODEL.h / 2, 0, g3)
  jar.renderOrder = 3
  const argonMat = new THREE.MeshBasicMaterial({ color: '#2f6fe0', transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending })
  const argon = mk(new THREE.CylinderGeometry(MODEL.r - 0.02, MODEL.r - 0.02, MODEL.h - 0.35, 40), argonMat, mx, MODEL.base + (MODEL.h - 0.35) / 2 + 0.06, 0, g3)
  argon.renderOrder = 2
  argon.raycast = () => {}
  const argonLight = new THREE.PointLight('#5ab0ff', light ? 2.2 : 3.4, 4.5, 1.6)
  argonLight.position.set(mx, MODEL.base + MODEL.h * 0.55, 0)
  g3.add(argonLight)
  mk(new THREE.CylinderGeometry(MODEL.r + 0.04, MODEL.r + 0.04, 0.14, 40), mats.copper, mx, yTop + 0.07, 0, g3)
  mk(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 20), mats.steel, mx, yTop + 0.4, 0, g3)
  // the crystals and their strings
  const NC = 25
  const crystalGeo = new THREE.CylinderGeometry(0.115, 0.115, 0.17, 20)
  const crystalMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3, metalness: 0.9, envMap: stage.shine, envMapIntensity: 1.2 })
  const crystals = new THREE.InstancedMesh(crystalGeo, crystalMat, NC)
  g3.add(crystals)
  const cPos = []
  {
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    const stringsXZ = [[0, 0], [0.42, 0], [-0.42, 0], [0, 0.42], [0, -0.42]]
    let k = 0
    stringsXZ.forEach(([sx, sz], si) => {
      mk(new THREE.CylinderGeometry(0.008, 0.008, 2.55, 6), mats.copper, mx + sx, yTop - 1.27, sz, g3)
      for (let j = 0; j < 5; j++) {
        const y = yTop - 0.5 - j * 0.46
        o.position.set(mx + sx, y, sz)
        o.rotation.set(0, 0, 0)
        o.scale.set(1, 1, 1)
        o.updateMatrix()
        crystals.setMatrixAt(k, o.matrix)
        crystals.setColorAt(k, col.setRGB(0.32, 0.36, 0.4))
        cPos.push(new THREE.Vector3(S3.x + mx + sx, y, S3.z + sz))
        k++
      }
    })
    crystals.instanceColor.needsUpdate = true
  }
  const baseCol = new THREE.Color(0.32, 0.36, 0.4)
  const flashes = Array.from({ length: 6 }, () => {
    const s = sprite('#bfe0ff', 0.55, 0)
    s.renderOrder = 7
    g3.add(s)
    return { s, age: 9, i: 0 }
  })
  tag(E.wait.tags.argon, mx, MODEL.base + 0.3, MODEL.r + 0.06, 0, 0.1, '#bfe0ff', {}, g3)
  tag(E.wait.tags.model, mx - 0.4, yTop + 0.9, MODEL.r * 0.5, 0, 0.11, TEAL_HI, {}, g3)
  const crystalsHit = crystals // taps on a crystal give its index
  // the console: a big green button
  const con = new THREE.Group()
  con.position.set(mx, 0, MODEL.r + 0.95)
  g3.add(con)
  mk(new THREE.CylinderGeometry(0.07, 0.09, 0.8, 12), mats.dark, 0, 0.4, 0, con)
  mk(new RoundedBoxGeometry(0.8, 0.14, 0.5, 2, 0.04), mats.yellow, 0, 0.87, 0, con).rotation.x = -0.35
  const btnMat = M('#2fbf5a', { emissive: '#2fbf5a', emissiveIntensity: 0.5, roughness: 0.3 })
  const btn = mk(new THREE.CylinderGeometry(0.14, 0.15, 0.1, 24), btnMat, 0, 0.98, 0.04, con)
  btn.rotation.x = -0.35
  tag(E.wait.tags.run, 0, 1.3, 0.1, 0, 0.12, '#9dffb4', {}, con)
  const btnHit = hit(0.7, 0.4, 0.6, 0, 0.95, 0.05, con)
  solids.push(circle(S3.x + mx, S3.z + MODEL.r + 0.95, 0.25))
  // the lens: a round screen with one decay in it
  const lensX = -0.3
  const lensTex = tex(384, 384, () => {})
  const lensG = new THREE.Group()
  lensG.position.set(lensX, 1.9, 0.4)
  g3.add(lensG)
  mk(new THREE.TorusGeometry(0.62, 0.05, 10, 48), mats.brass, 0, 0, 0, lensG)
  const lensFace = mk(new THREE.CircleGeometry(0.6, 48), new THREE.MeshBasicMaterial({ map: lensTex, toneMapped: false }), 0, 0, 0.01, lensG)
  mk(new THREE.CylinderGeometry(0.05, 0.06, 1.35, 10), mats.dark, 0, -1.25, -0.02, lensG)
  mk(new THREE.CylinderGeometry(0.28, 0.32, 0.05, 20), mats.dark, 0, -1.9, -0.02, lensG)
  tag(E.wait.tags.lens, 0, 0.82, 0.05, 0, 0.12, TEAL_HI, {}, lensG)
  const lensHit = hit(1.3, 1.3, 0.2, 0, 0, 0.02, lensG)
  // the big screen
  const waitTex = tex(1152, 648, () => {})
  const SCR = { x: 1.95, y: 2.2, z: 0.1, w: 2.4, h: 1.35 }
  screenFace(SCR.w, SCR.h, waitTex, g3, SCR.x, SCR.y, SCR.z)
  mk(new THREE.CylinderGeometry(0.05, 0.055, SCR.y - SCR.h / 2, 10), mats.dark, SCR.x, (SCR.y - SCR.h / 2) / 2, SCR.z - 0.08, g3)
  mk(new THREE.CylinderGeometry(0.3, 0.34, 0.05, 20), mats.dark, SCR.x, 0.025, SCR.z - 0.08, g3)
  // decays: how many so far, and the counts in each bin (smooth plus seeded noise, as the other screens)
  const events = y => PER_YEAR * y
  const counts = y => {
    const out = new Float32Array(N_BIN)
    const rnd = random(76)
    for (let i = 0; i < N_BIN; i++) {
      const mean = events(y) * SHAPE[i]
      const noise = (rnd() + rnd() + rnd() - 1.5) * 2
      out[i] = Math.max(0, Math.round(mean + Math.sqrt(mean) * noise * 0.6))
    }
    return out
  }
  const drawWait = () => {
    const lv = level()
    const y = c.yearsNow
    const mark = c.evtT > 0 && clock - c.evtT < 4.2 ? Math.round(c.evtE) : -1
    const key = `${lv}|${Math.round(y * 40)}|${C.mode}|${mark}|${C.dec}`
    if (key === c.specKey) return
    c.specKey = key
    const P = E.wait.board
    const data = counts(y)
    let max = 10
    for (const v of data) max = Math.max(max, v)
    max *= 1.12
    waitTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#0b1230'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.textAlign = 'left'
      g.fillStyle = '#ffd27a'
      g.font = '700 44px Outfit, sans-serif'
      g.fillText(P.title, 40, 44)
      g.textAlign = 'right'
      g.fillStyle = '#ffffff'
      g.font = '700 44px Outfit, sans-serif'
      g.fillText(`${num(y, 1, lang)} ${P.years}`, w - 40, 44)
      const px0 = 100
      const px1 = w - 50
      const py0 = 100
      const py1 = h - 120
      g.strokeStyle = '#3a4580'
      g.lineWidth = 2.5
      g.beginPath()
      g.moveTo(px0, py0)
      g.lineTo(px0, py1)
      g.lineTo(px1, py1)
      g.stroke()
      const bw = (px1 - px0) / (N_BIN - 1) // the axis runs 0 to 2120 keV
      g.fillStyle = TEAL_HI
      for (let i = 0; i < N_BIN; i++) {
        const hgt = ((py1 - py0 - 8) * data[i]) / max
        if (hgt > 0.6) g.fillRect(px0 + i * bw, py1 - hgt, bw - 1, hgt)
      }
      const X = e => px0 + (e / (BIN * (N_BIN - 1))) * (px1 - px0)
      // the energy axis
      g.fillStyle = '#c8d2ec'
      g.font = '700 28px Nunito, sans-serif'
      g.textAlign = 'center'
      for (let e = 0; e <= 2000; e += 500) {
        g.fillRect(X(e) - 1.5, py1, 3, 10)
        g.fillText(String(e), X(e), py1 + 30)
      }
      g.textAlign = 'right'
      g.fillStyle = '#6c78a8'
      g.fillText(P.keV, px1, py1 + 62)
      // the line where the decay with no neutrinos would be
      const xq = X(Q_BB)
      g.strokeStyle = GOLD
      g.lineWidth = 3
      g.setLineDash([10, 8])
      g.beginPath()
      g.moveTo(xq, py0 + 30)
      g.lineTo(xq, py1)
      g.stroke()
      g.setLineDash([])
      g.fillStyle = GOLD
      g.textAlign = 'right'
      g.font = '700 34px Outfit, sans-serif'
      g.fillText(`Q = ${Q_BB} keV`, xq - 14, py0 + 18)
      g.textAlign = 'center'
      g.font = '700 30px Nunito, sans-serif'
      g.fillStyle = y > 0 ? '#9dffb4' : '#9aa6c8'
      g.fillText(`${P.line}: 0`, xq - 90, py0 + 100)
      if (C.mode === 1) {
        // what the hoped-for decay would draw: one thin spike, never seen
        g.strokeStyle = '#ff9aff'
        g.lineWidth = 9
        g.setLineDash([])
        g.beginPath()
        g.moveTo(xq + 9, py1)
        g.lineTo(xq + 9, py0 + 150)
        g.stroke()
        g.setLineDash([])
        g.fillStyle = '#ff9aff'
        g.font = '700 28px Nunito, sans-serif'
        g.textAlign = 'right'
        g.fillText(P.ifSeen, xq - 12, py0 + 156)
      }
      if (mark >= 0) {
        const xm = X(mark)
        g.fillStyle = GOLD
        g.beginPath()
        g.arc(xm, py1 - 10, 12, 0, TAU)
        g.fill()
        g.font = '700 30px Outfit, sans-serif'
        g.textAlign = 'center'
        g.fillText(`${P.thisOne} ${fmtInt(mark, lang)} keV`, clamp(xm, px0 + 150, px1 - 150), py1 - 48)
      }
      // the totals
      g.textAlign = 'left'
      g.fillStyle = '#e8ecf6'
      g.font = '700 36px Outfit, sans-serif'
      g.fillText(`${P.events}: ${fmtInt(events(y), lang)}`, 40, lv === 'scientist' ? h - 66 : h - 30)
      if (lv === 'scientist') {
        g.fillStyle = '#7dd8ff'
        g.font = '700 26px Nunito, sans-serif'
        g.fillText(P.sci, 40, h - 26)
      }
    })
  }
  // the lens: a germanium-76 nucleus, drawn in 2D, two neutrons turning into protons at once
  const NUC = (() => {
    const rnd = random(76)
    const balls = []
    const total = 18
    for (let i = 0; i < total; i++) {
      const rr = 22 + Math.sqrt(i / total) * 52
      const an = i * 2.399 + rnd() * 0.3
      balls.push({ x: 160 + Math.cos(an) * rr * 0.9, y: 196 + Math.sin(an) * rr * 0.9, p: i % 2 === 0 })
    }
    // the two that decay: neutrons near the middle, on opposite sides
    balls[1].p = false
    balls[7].p = false
    return { balls, a: 1, b: 7 }
  })()
  /** Centred text on lines of at most maxW pixels. */
  const wrap = (g, text, x, y, maxW, lh, size) => {
    g.font = `700 ${size}px Nunito, sans-serif`
    g.textAlign = 'center'
    const words = String(text).split(' ')
    let line = ''
    const lines = []
    for (const wd of words) {
      const test = line ? `${line} ${wd}` : wd
      if (g.measureText(test).width > maxW && line) {
        lines.push(line)
        line = wd
      } else line = test
    }
    lines.push(line)
    lines.forEach((l, i) => g.fillText(l, x, y + i * lh))
  }
  const drawLens = t => {
    const mode = c.lensMode
    const lv = level()
    const P = E.wait.board
    lensTex.userData.redraw((g, w, h) => {
      g.fillStyle = '#10163a'
      g.fillRect(0, 0, w, h)
      const grd = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2)
      grd.addColorStop(0, '#2a3170')
      grd.addColorStop(1, '#0b1030')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillStyle = '#e8ecf6'
      g.font = '700 30px Outfit, sans-serif'
      g.fillText(t >= 0.34 ? P.se : P.ge76, w / 2, 40)
      g.fillStyle = '#9fb0e0'
      wrap(g, mode ? P.nuModeOff : P.nuModeOn, w / 2, 66, 250, 21, 19)
      // the nucleus
      const pulse = t > 0.05 && t < 0.34 ? Math.sin(((t - 0.05) / 0.29) * Math.PI * 6) * 0.5 + 0.5 : 0
      NUC.balls.forEach((ball, i) => {
        const dec = i === NUC.a || i === NUC.b
        const flipped = dec && t >= 0.34
        const isP = ball.p || flipped
        let rr = 17
        if (dec && t > 0.05 && t < 0.34) rr += pulse * 3
        const gr = g.createRadialGradient(ball.x - 5, ball.y - 5, 1, ball.x, ball.y, rr)
        if (isP) {
          gr.addColorStop(0, '#ffd0c8')
          gr.addColorStop(0.35, '#ff5a4a')
          gr.addColorStop(1, '#8a1a1a')
        } else {
          gr.addColorStop(0, '#e8ecf4')
          gr.addColorStop(0.35, '#a8b0c4')
          gr.addColorStop(1, '#4a5060')
        }
        g.fillStyle = gr
        g.beginPath()
        g.arc(ball.x, ball.y, rr, 0, TAU)
        g.fill()
        if (dec && t > 0.05 && t < 0.4) {
          g.strokeStyle = `rgba(255,201,58,${0.4 + 0.6 * pulse})`
          g.lineWidth = 3
          g.beginPath()
          g.arc(ball.x, ball.y, rr + 5, 0, TAU)
          g.stroke()
        }
      })
      // the two electrons fly out, and (in the usual decay) two antineutrinos
      if (t >= 0.34) {
        const k = (t - 0.34) / 0.66
        const e1 = NUC.balls[NUC.a]
        const e2 = NUC.balls[NUC.b]
        const fly = (from, dx, dy, colour, r, trail) => {
          const x = from.x + dx * k * 190
          const y = from.y + dy * k * 190
          if (trail) {
            g.strokeStyle = colour
            g.globalAlpha = 0.35 * (1 - k)
            g.lineWidth = r
            g.beginPath()
            g.moveTo(from.x, from.y)
            g.lineTo(x, y)
            g.stroke()
            g.globalAlpha = 1
          }
          g.fillStyle = colour
          g.globalAlpha = 1 - k * 0.45
          g.beginPath()
          g.arc(x, y, r, 0, TAU)
          g.fill()
          g.globalAlpha = 1
        }
        fly(e1, 0.9, -0.55, BLUE, 11, true)
        fly(e2, 0.75, 0.75, BLUE, 11, true)
        if (!mode) {
          fly(e1, -0.8, -0.6, '#d8dcff', 7, false)
          fly(e2, -0.9, 0.5, '#d8dcff', 7, false)
        }
        if (k > 0.25) {
          g.fillStyle = '#c9d2f0'
          wrap(g, mode ? P.noNu : P.twoNu, w / 2, 304, 270, 20, 18)
          g.font = '700 18px Nunito, sans-serif'
          g.fillStyle = BLUE
          g.fillText(P.electrons, w * 0.74, 128)
          if (!mode) {
            g.fillStyle = '#d8dcff'
            g.fillText(P.nus, w * 0.26, 128)
          }
        }
      } else if (t < 0.34) {
        g.fillStyle = '#9fb0e0'
        wrap(g, t < 0.01 ? P.waiting : P.twoAtOnce, w / 2, 304, 270, 20, 18)
      }
      if (lv === 'scientist') {
        g.fillStyle = '#7dd8ff'
        wrap(g, P.nucSci, w / 2, 350, 200, 16, 15)
      }
    })
  }
  const lensDur = 3.4
  const startDecay = (i, fromTap) => {
    c.lensT = 0
    c.lensAt = i
    c.lensKey = ''
    c.evtE = C.mode === 1 ? Q_BB : drawEnergy(Math.random())
    c.evtT = -9 // set when the electrons leave
    c.flash.push(i)
    play('beep')
    if (fromTap) {
      C.dec++
      share('wait')
    }
  }
  const wHint = () => {
    const h = E.wait.hints
    if (C.years === 0) return h.run
    if (C.dec === 0) return h.crystal
    if (C.mode === 0) return h.lens
    if (C.years < MAX_YEARS) return h.more
    return h.done
  }
  function waitStep(what, arg) {
    const lv = level()
    const says = E.wait.says
    live.mine = 16
    if (what === 'run' || what === 'year') {
      if (C.years >= MAX_YEARS - 1e-6) {
        tell(at(says.enough, lv))
        return false
      }
      const to = Math.min(MAX_YEARS, Math.floor(C.years + 1e-6) + 1)
      c.run = { from: C.years, to, t: 0 }
      C.years = to
      play('select')
      btnMat.emissiveIntensity = 1.6
      if (to === 1) tell(at(says.first, lv))
      else if (to === MAX_YEARS) tell(at(says.last, lv))
    } else if (what === 'years') {
      const y = clamp(Math.round(Number(arg) * 20) / 20, 0, MAX_YEARS)
      C.years = y
      c.run = null
    } else if (what === 'reset') {
      C.years = 0
      c.run = null
      c.yearsNow = 0
      play('part')
    } else if (what === 'crystal') {
      const i = Number.isInteger(arg) ? arg : (Math.random() * NC) | 0
      startDecay(i, true)
      tell(at(C.mode ? says.hoped : says.decay, lv))
      refresh(E.wait.title, waitPanel)
      ex.discover('wait', waitPanel, 4.2)
      return
    } else if (what === 'lens' || what === 'mode') {
      C.mode = arg != null ? (arg ? 1 : 0) : 1 - C.mode
      c.lensMode = C.mode
      c.lensT = 9
      c.lensKey = ''
      play('select')
      tell(at(C.mode ? says.modeOn : says.modeOff, lv))
    } else return
    refresh(E.wait.title, waitPanel)
    ex.discover('wait', waitPanel, 4.2)
    share('wait')
  }
  const waitPanel = lv => {
    const y = C.years
    const rate = PER_YEAR / 365
    return {
      title: E.wait.title,
      color,
      blocks: [
        { slider: { label: E.wait.slider, min: 0, max: MAX_YEARS, step: 0.05, value: C.years, onInput: v => waitStep('years', v), format: v => `${num(v, 1, lang)} ${E.wait.units.years}`, live: () => C.years } },
        { buttons: [{ label: E.wait.buttons.year, onClick: () => waitStep('year') }, { label: E.wait.buttons.reset, onClick: () => waitStep('reset') }] },
        { buttons: [{ label: C.mode ? E.wait.buttons.usual : E.wait.buttons.hoped, onClick: () => waitStep('mode') }, { label: E.wait.buttons.decay, onClick: () => waitStep('crystal') }] },
        {
          rows: [
            [E.wait.rows.years, num(y, 1, lang)],
            [E.wait.rows.events, fmtInt(events(y), lang)],
            [E.wait.rows.perDay, `${fmtInt(rate, lang)}`],
            [E.wait.rows.window, '0'],
            ...(lv === 'scientist' ? [[E.wait.rows.expect, num((((KG * 1000) / 75.92) * 6.022e23 * Math.LN2 / 1.8e26), 1, lang)]] : []),
          ],
        },
        ...E.wait.panel[depthOf(lv)].map(p => ({ p })),
      ],
    }
  }
  clickable(btnHit, () => waitStep('run'), { reach: 7 })
  clickable(lensHit, () => waitStep('lens'), { reach: 7 })
  clickable(crystalsHit, h => waitStep('crystal', h.instanceId ?? 0), { reach: 8 })
  const waitItem = ex.add({
    id: 'wait',
    x: S3.x + 0.1,
    z: S3.z + 3.7,
    radius: 2.2,
    manual: true,
    label: E.wait.label,
    verb: wHint,
    focus: { x: S3.x - 0.2, y: 2.2, z: S3.z, size: 5.6, width: 6.0 },
    act: () => ctx.showPanel(waitPanel),
  })
  focusBy(waitItem, waitItem.focus, { x: S3.x + 0.3, y: 2.2, z: S3.z, size: 5.6, width: 6.0 })

  // ======================================================================================================
  // every frame
  // ======================================================================================================
  let leaveSaid = false
  let roomTime = 0
  let lastClickSound = 0
  const tmpV = new THREE.Vector3()
  const tmpC = new THREE.Color()
  let flashClock = 0
  updates.push((dt, t) => {
    clock += dt
    roomTime += dt
    live.mine = Math.max(0, live.mine - dt)
    if (pending && clock - toldAt >= 3.2) {
      say(pending)
      toldAt = clock
      pending = null
    }
    const lv = level()
    const p = ctx.engine.player

    // ----- the mountain -----
    a.Dnow = damp(a.Dnow, A.D, 4, dt)
    if (Math.abs(a.Dnow - A.D) < 0.5) a.Dnow = A.D
    marker.position.set(X_H, SURF_Y - a.Dnow * K1, 0.1)
    band.position.y = SURF_Y - a.Dnow * K1
    markerHalo.material.opacity = 0.55 + 0.2 * Math.sin(t * 4)
    stepStreaks(dt)
    // clicks: the counter's rate slowed to be heard (the order of the depths is true, the speed is not)
    const r = rateAt(a.Dnow)
    const perSec = 0.12 * Math.pow(10, ((Math.log10(Math.max(1, r)) - 0.08) / 5.7) * 2.07)
    a.clickT -= dt
    if (a.clickT <= 0) {
      a.clickT = -Math.log(1 - Math.random()) / perSec
      a.lit = 1
      const near = p?.pos && Math.hypot(p.pos.x - (S1.x + 1.85), p.pos.z - (S1.z + 0.85)) < 9
      if (near && clock - lastClickSound > 0.22) {
        lastClickSound = clock
        play('beep')
      }
    }
    a.lit = Math.max(0, a.lit - dt * 7)
    lamp.material.emissiveIntensity = a.lit * 2.2
    drawCounter()

    // ----- the furnace -----
    if (b.zone) {
      b.zone.t += dt / PASS_SECONDS
      if (b.zone.t >= 1) {
        b.zone = null
        if (b.mine) {
          const done = B.N
          if (done === 5 || done === N_PASS) tell(at(done === N_PASS ? E.pure.says.last : E.pure.says.five, lv))
          const c1 = purity(done)
          if (c1 <= C_HPGE && purity(done - 1) > C_HPGE) tell(at(E.pure.says.hpge, lv))
          b.mine = false
        }
        refresh(E.pure.title, purePanel)
      }
    }
    const zt = b.zone ? -0.06 + 1.12 * b.zone.t : -1
    const zone = b.zone ? clamp(zt, 0, 1) : 0
    const active = !!b.zone
    ringG.position.set(active ? ringX(zt) : BAR.x0 - 0.18, BAR.y, 0)
    molten.position.x = ringG.position.x
    zoneGlow.position.x = ringG.position.x
    zoneLight.position.x = ringG.position.x
    const hot = active && zt > -0.02 && zt < 1.02 ? 1 : 0
    molten.material.opacity = damp(molten.material.opacity, hot * 0.85, 8, dt)
    zoneGlow.material.opacity = molten.material.opacity * 0.55
    zoneLight.intensity = molten.material.opacity * 2.6
    {
      const o = dum
      o.rotation.set(0, 0, 0)
      for (let i = 0; i < N_SPECK; i++) {
        const sx = speckPos(i, B.N, active, zone)
        const z = speckData[i].zOff
        const x = BAR.x0 + sx * BL
        o.position.set(x, BAR.y + Math.sqrt(Math.max(0, BAR.r * BAR.r - z * z)) + 0.015, z)
        o.scale.setScalar(1)
        o.updateMatrix()
        specks.setMatrixAt(i, o.matrix)
      }
      specks.instanceMatrix.needsUpdate = true
    }
    drawGauge()
    // counting the source's gamma rays: the screens grow for a couple of seconds after each tap
    b.shotsNow = damp(b.shotsNow, B.shots, 1.4, dt)
    if (Math.abs(b.shotsNow - B.shots) < 0.02) b.shotsNow = B.shots
    if (b.pulse > 0) {
      b.pulse -= dt
      if (Math.floor(b.pulse * 6) !== Math.floor((b.pulse + dt) * 6)) {
        firePulse(-1, 0)
        firePulse(1, 1)
      }
    }
    for (const pu of pulses) {
      pu.t += dt
      const k = pu.t / 0.5
      if (k >= 1) {
        pu.s.material.opacity = 0
        continue
      }
      const x0 = srcX + pu.dir * 0.12
      const x1 = srcX + pu.dir * 0.55
      pu.s.position.set(x0 + (x1 - x0) * k, BENCH + 0.5 + (pu.kind ? -0.04 : 0.02), 0.0)
      pu.s.material.opacity = Math.sin(k * Math.PI) * 0.95
    }
    drawSpectra()

    // ----- the long wait -----
    if (c.run) {
      c.run.t += dt / 6
      c.yearsNow = c.run.from + (c.run.to - c.run.from) * ease(clamp(c.run.t))
      flashClock -= dt
      if (flashClock <= 0) {
        flashClock = 0.09 + Math.random() * 0.15
        c.flash.push((Math.random() * NC) | 0)
      }
      if (c.run.t >= 1) c.run = null
    } else {
      c.yearsNow = damp(c.yearsNow, C.years, 3, dt)
      if (Math.abs(c.yearsNow - C.years) < 0.01) c.yearsNow = C.years
    }
    btnMat.emissiveIntensity = damp(btnMat.emissiveIntensity, c.run ? 1.6 : 0.5, 4, dt)
    while (c.flash.length) {
      const i = c.flash.shift()
      const f = flashes.find(x => x.age > 0.5)
      if (!f) break
      f.age = 0
      f.i = i
      f.s.position.set(cPos[i].x - S3.x, cPos[i].y, cPos[i].z - S3.z)
    }
    for (const f of flashes) {
      f.age += dt
      const k = f.age / 0.5
      f.s.material.opacity = k >= 1 ? 0 : (1 - k) * 0.95
      f.s.scale.setScalar(0.35 + 0.5 * k)
    }
    // the lens
    if (c.lensT < lensDur + 0.5) {
      c.lensT += dt
      const k = clamp(c.lensT / lensDur)
      if (c.evtT === -9 && k >= 0.34) c.evtT = clock
      const kk = Math.round(k * 60)
      if (`${kk}|${C.mode}` !== c.lensKey) {
        c.lensKey = `${kk}|${C.mode}`
        drawLens(k)
      }
    } else if (c.lensKey !== 'idle' + C.mode + lv) {
      c.lensKey = 'idle' + C.mode + lv
      drawLens(0)
    }
    drawWait()

    // the Atomling's last word, once, when the visitor heads back to the frame after doing something
    if (!leaveSaid && p?.pos && roomTime > 20 && p.pos.z > 3.4 && Math.cos(p.yaw - Math.PI) > 0.6 && (rainItem.found || pureItem.found || waitItem.found)) {
      leaveSaid = true
      tell(at(E.leave, lv))
    }
    stage.update(t, dt)
  })

  const snap = () => {
    a.Dnow = A.D
    b.zone = null
    b.shotsNow = B.shots
    c.run = null
    c.yearsNow = C.years
    c.lensMode = C.mode
    gaugeKey = ''
    specKey = ''
    c.specKey = ''
    c.lensKey = ''
    counterKey = ''
  }
  snap()

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.4 },
    spawn: { x: 0, z: 2.6, yaw: 0 },
    hostSpot: { x: -2.6, z: 2.4, yaw: Math.atan2(-2.6, -0.2) },
    back: { x: 0, z: 6.9, rot: Math.PI },
    stand: { x: 3.4, z: 2.5, rot: Math.atan2(-3.4, 0.1) },
    parts: {
      rain: {
        tap: (what, arg) => rainStep(what, arg), // 'mountain' (m of rock), 'depth' (m), 'top', 'half', 'hall', 'sky', 'counter'
        get state() {
          return { D: A.D, Dnow: a.Dnow, tried: A.tried, rate: rateAt(A.D) }
        },
        at: (what, arg) => ({
          mountain: new THREE.Vector3(S1.x + X_H, SURF_Y - (arg ?? 700) * K1, S1.z + 0.05),
          sky: new THREE.Vector3(S1.x, 5.65, S1.z + 0.1),
          counter: new THREE.Vector3(S1.x + 1.85, 1.1, S1.z + 0.9),
        })[what],
      },
      pure: {
        tap: (what, arg) => pureStep(what, arg), // 'ring', 'pass', 'passes' (n), 'new', 'source', 'zoom' (0..1), 'clear', 'ge', 'nai'
        get state() {
          return { N: B.N, shots: B.shots, zoom: B.zoom, busy: !!b.zone, atoms: purity(B.N) }
        },
        at: what => ({
          ring: new THREE.Vector3(S2.x + ringG.position.x, BAR.y, S2.z),
          source: new THREE.Vector3(S2.x + srcX, BENCH + 0.3, S2.z),
          ge: new THREE.Vector3(S2.x + tabX - 0.65, BENCH + 0.5, S2.z),
          nai: new THREE.Vector3(S2.x + tabX + 0.85, BENCH + 0.25, S2.z),
        })[what],
      },
      wait: {
        tap: (what, arg) => waitStep(what, arg), // 'run', 'year', 'years' (y), 'reset', 'crystal' (0..24), 'lens', 'mode'
        get state() {
          return { years: C.years, yearsNow: c.yearsNow, mode: C.mode, decays: C.dec }
        },
        at: (what, arg) => ({
          run: new THREE.Vector3(S3.x + mx, 1.0, S3.z + MODEL.r + 1.0),
          crystal: cPos[arg ?? 12].clone(),
          lens: new THREE.Vector3(S3.x + lensX, 1.9, S3.z + 0.4),
        })[what],
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { rain: rainPanel, pure: purePanel, wait: waitPanel },
    shared: {
      rain: {
        get: () => ({ D: A.D }),
        set: (s, liveSet) => {
          A.D = clamp(Math.round(Number(s?.D ?? 0)), 0, D_MAX)
          if (liveSet) live.mine = 0
          else snap()
        },
      },
      pure: {
        get: () => ({ N: B.N, shots: B.shots, zoom: Math.round(B.zoom * 100) / 100 }),
        set: (s, liveSet) => {
          const N = clamp(Math.round(Number(s?.N ?? 0)), 0, N_PASS)
          const grew = N === B.N + 1 && liveSet
          B.N = N
          const shots = clamp(Math.round(Number(s?.shots ?? 0)), 0, 99)
          const more = shots > B.shots && liveSet
          B.shots = shots
          B.zoom = clamp(Number(s?.zoom ?? 0.5))
          b.mine = false
          if (liveSet) {
            if (grew) b.zone = { t: 0 }
            if (more) b.pulse = 2.4
          } else snap()
        },
      },
      wait: {
        get: () => ({ years: C.years, mode: C.mode, dec: C.dec }),
        set: (s, liveSet) => {
          const y = clamp(Math.round(Number(s?.years ?? 0) * 20) / 20, 0, MAX_YEARS)
          const grew = liveSet && y > C.years && Number.isInteger(y)
          const from = C.years
          C.years = y
          C.mode = s?.mode ? 1 : 0
          const dec = Math.round(Number(s?.dec ?? 0))
          if (liveSet && dec > C.dec) startDecay((Math.random() * NC) | 0, false)
          C.dec = dec
          if (liveSet) {
            live.mine = 0
            if (grew) c.run = { from, to: y, t: 0 }
            c.lensMode = C.mode
          } else snap()
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
