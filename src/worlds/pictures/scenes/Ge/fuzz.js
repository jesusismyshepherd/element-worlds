// Germanium's picture "What makes a guitar go fuzzzz?" as a room (docs/knowledge/picture-rooms.md): a
// recording studio in Nashville in 1961 (stages/nashville.js), the picture's guitar, fuzz pedal and amplifier
// standing in the live room in magenta and violet light, the control room behind its window. Three things to
// do, each step chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt
// passive); the prompt names the next tap, E opens the station's panel, whose buttons (and sliders) do the same:
// - the broken channel: tap the guitar and a clean note sounds, the desk's needle swings and the scope on the
//   cart shows a smooth wave; tap the glowing part on the desk (it breaks) and the same note comes out
//   buzzy, its wave cut flat top and bottom, the needle pinned in the red; tap the part again to mend it;
// - inside the pedal: the fuzz pedal opened, its board as big as a table, its transistors as tall as you.
//   The gain is a slider (or the big knob, tapped): the wave on the screen grows until its tops are cut off
//   and the bars of the harmonics (1 to 9 times the note) grow with it, the sound follows. Tap a transistor
//   and its can lifts off: a lens shows the germanium crystal with a few atoms of other elements, and a card
//   shows where germanium starts to conduct (about 0.2 to 0.3 V) against silicon (about 0.6 to 0.7 V);
// - hot stage, cold stage: two pedals on a stool, a germanium one and a silicon one, under the stage
//   lights. The temperature is a slider (or tap the lights): the germanium pedal's leakage meter climbs and
//   its sound sags, the silicon one stays the same. Tap a pedal to hear it; tap the gold record for a story
//   (no music: the song is not ours to play).
// The sound is made in the browser: a plucked note (odd harmonics, decaying) through a waveshaper that clips it
// as the wave on the screen is clipped (the same function draws the screen and shapes the sound). The
// leakage meters and the changes of sound with temperature are a model, said so in the words. All three
// stations are shared in a room (src/net/shared.js); parts.<thing> does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, num, standingScreen, random } from '../../../wings/noble/kit.js'
import { nashvilleStage } from '../../stages/nashville.js'
import { play, isMuted } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { FUZZ_WORDS } from './fuzz.words.js'

export const WORDS = FUZZ_WORDS

const TAU = Math.PI * 2

// ---- where things stand (metres; the spawn looks along -z, the control room is far left) ----
const SPAWN = { x: 0, z: 4.6 }
const BACK = { x: 0, z: 7.5 }
const STAND = { x: 3.7, z: 5.3 }
const HOST = { x: -2.0, z: 3.1 }
const GUITAR = { x: -1.4, z: -8.1 }
const PEDAL0 = { x: 0.9, z: -7.0 }
const AMP = { x: 3.2, z: -8.7 }
const DESK = { x: -4.5, z: -6.7 }
const CART = { x: -3.75, z: -8.75 }
const BOARD = { x: -6.9, z: 0.3, w: 3.0, d: 2.0 }
const SCREEN2 = { x: -4.3, z: 0.6 }
const TABLE = { x: 7.0, z: -0.2 }
const SCREEN3 = { x: 7.6, z: -2.2 }
const THERMO = { x: 9.0, z: 0.2 }
const AT = { desk: { x: 0.6, z: -4.6 }, pedal: { x: -5.6, z: 3.2 }, stage: { x: 6.5, z: 2.3 } }
const TRANSISTORS = [-0.95, 0, 0.95].map(dx => ({ x: BOARD.x + dx, z: BOARD.z - 0.15 }))

// ---- the sound and the wave: one function for both ----
// A guitar's note is odd harmonics only (so a symmetric clip keeps it odd); the wave is clipped by a soft
// limiter between -1 and 1 (the supply's rails). G is the gain, b a bias that makes the clip lopsided.
const clipf = u => u / Math.pow(1 + Math.pow(Math.abs(u), 2.4), 1 / 2.4)
const SHAPE = th => (Math.sin(th) + 0.12 * Math.sin(3 * th + 0.6)) / 1.05
const UIN = G => G * 0.15
const wave = (th, G, b = 0) => clipf(UIN(G) * SHAPE(th) + b) - clipf(b)
const ideal = (th, G) => UIN(G) * SHAPE(th)
const gainAt = v => Math.pow(30, clamp(v, 0, 100) / 100)

const hCache = new Map()
/** The harmonics 1..9 of the clipped wave, and its rms, found by a discrete Fourier sum over one period. */
function analyse(G, b = 0) {
  const key = `${Math.round(G * 40)}|${Math.round(b * 100)}`
  let r = hCache.get(key)
  if (r) return r
  const N = 256
  const h = []
  let sq = 0
  const ys = []
  for (let i = 0; i < N; i++) {
    const y = wave((i / N) * TAU, G, b)
    ys.push(y)
    sq += y * y
  }
  for (let k = 1; k <= 9; k++) {
    let re = 0
    let im = 0
    for (let i = 0; i < N; i++) {
      const th = (i / N) * TAU
      re += ys[i] * Math.sin(k * th)
      im += ys[i] * Math.cos(k * th)
    }
    h.push((2 / N) * Math.hypot(re, im))
  }
  r = { h, rms: Math.sqrt(sq / N) }
  hCache.set(key, r)
  return r
}

// the audio context of this room alone (sound.js keeps its own, private): made on the first tap
let AC = null
let pluckBuf = null
function audio() {
  if (isMuted()) return null
  try {
    if (!AC) {
      const C = window.AudioContext || window.webkitAudioContext
      if (!C) return null
      AC = new C({ latencyHint: 'playback' })
    }
    if (AC.state === 'suspended') AC.resume().catch(() => {})
    return AC
  } catch {
    return null
  }
}
/** A plucked low note, A2 (110 Hz): odd harmonics, the higher ones dying faster, 1.3 s. */
function pluck(ac) {
  if (pluckBuf && pluckBuf.sampleRate === ac.sampleRate) return pluckBuf
  const sr = ac.sampleRate
  const n = Math.round(sr * 1.3)
  const buf = ac.createBuffer(1, n, sr)
  const d = buf.getChannelData(0)
  const f = 110
  for (let i = 0; i < n; i++) {
    const t = i / sr
    const th = TAU * f * t
    const env = (1 - Math.exp(-t * 400)) * Math.exp(-t * 2.4)
    const hi = Math.exp(-t * 3.5)
    d[i] = ((Math.sin(th) + 0.12 * hi * Math.sin(3 * th + 0.6) + 0.05 * hi * Math.sin(5 * th)) / 1.05) * env * (i > n - 4000 ? (n - i) / 4000 : 1)
  }
  pluckBuf = buf
  return buf
}
/** The note through a pedal model: gain G, bias b. Short and gentle (the family plays with sound on). */
function playNote(G, b = 0) {
  const ac = audio()
  if (!ac || ac.state !== 'running') return
  const src = ac.createBufferSource()
  src.buffer = pluck(ac)
  const shaper = ac.createWaveShaper()
  const curve = new Float32Array(2049)
  for (let i = 0; i < curve.length; i++) {
    const x = (i / 1024 - 1) * 1.05
    curve[i] = clipf(UIN(G) * x + b) - clipf(b)
  }
  shaper.curve = curve
  shaper.oversample = '4x'
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 45
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 3400
  lp.Q.value = 0.4
  const out = ac.createGain()
  out.gain.value = 0.2 / Math.max(0.35, clipf(UIN(G)))
  src.connect(shaper).connect(hp).connect(lp).connect(out).connect(ac.destination)
  src.start()
}

// ---- the screens' pictures ----
const css = (c, a = 1) => {
  const k = new THREE.Color(c)
  return `rgba(${Math.round(k.r * 255)},${Math.round(k.g * 255)},${Math.round(k.b * 255)},${a})`
}
const FONT = '700 {s}px Outfit, sans-serif'
const font = s => FONT.replace('{s}', s)

/** The wave over two periods in the box (x, y, w, h): grid, the rails dashed, the ideal (what a perfect
 *  amplifier would give) dotted and the real output bright. Full scale of the box is +-1.5. */
function drawScope(g, x, y, w, h, { G, b = 0, color = '#ff7be9', showIdeal = true, rails = true, amp = 1 }) {
  g.save()
  g.beginPath()
  g.rect(x, y, w, h)
  g.clip()
  g.fillStyle = '#04060f'
  g.fillRect(x, y, w, h)
  g.strokeStyle = 'rgba(120,150,255,0.18)'
  g.lineWidth = 1.5
  for (let i = 1; i < 8; i++) {
    g.beginPath()
    g.moveTo(x + (i * w) / 8, y)
    g.lineTo(x + (i * w) / 8, y + h)
    g.stroke()
  }
  for (let i = 1; i < 4; i++) {
    g.beginPath()
    g.moveTo(x, y + (i * h) / 4)
    g.lineTo(x + w, y + (i * h) / 4)
    g.stroke()
  }
  const Y = v => y + h / 2 - (clamp(v, -1.5, 1.5) / 1.5) * (h / 2) * 0.96
  if (rails) {
    g.strokeStyle = 'rgba(255,200,90,0.55)'
    g.setLineDash([10, 8])
    g.lineWidth = 2
    for (const r of [-1, 1]) {
      g.beginPath()
      g.moveTo(x, Y(r))
      g.lineTo(x + w, Y(r))
      g.stroke()
    }
    g.setLineDash([])
  }
  const steps = 160
  const trace = fn => {
    g.beginPath()
    for (let i = 0; i <= steps; i++) {
      const th = (i / steps) * TAU * 2
      const px = x + (i / steps) * w
      const py = Y(fn(th) * amp)
      if (i) g.lineTo(px, py)
      else g.moveTo(px, py)
    }
    g.stroke()
  }
  if (showIdeal) {
    g.strokeStyle = 'rgba(200,215,255,0.5)'
    g.lineWidth = 3
    g.setLineDash([3, 7])
    trace(th => ideal(th, G))
    g.setLineDash([])
  }
  g.shadowColor = color
  g.shadowBlur = 14
  g.strokeStyle = color
  g.lineWidth = 5
  g.lineJoin = 'round'
  trace(th => wave(th, G, b))
  g.restore()
}

/** Bars for the harmonics 1..9 (full height 1.3), the odd ones in the colour, the even ones faint; sci: a
 *  perfect square wave's bars dashed over them. */
function drawBars(g, x, y, w, h, { hs, color = '#ff7be9', sci, lang, squareOf }) {
  g.save()
  g.fillStyle = '#04060f'
  g.fillRect(x, y, w, h)
  const top = 8
  const base = y + h - 34
  const bh = base - y - top
  g.strokeStyle = 'rgba(120,150,255,0.25)'
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(x + 8, base)
  g.lineTo(x + w - 8, base)
  g.stroke()
  const slot = (w - 16) / 9
  g.textAlign = 'center'
  g.textBaseline = 'top'
  g.font = font(24)
  for (let k = 1; k <= 9; k++) {
    const cx = x + 8 + slot * (k - 0.5)
    const v = clamp(hs[k - 1] / 1.3)
    const bw = slot * 0.58
    g.fillStyle = k % 2 ? color : css('#8892c8', 0.55)
    g.shadowColor = k % 2 ? color : 'transparent'
    g.shadowBlur = k % 2 ? 10 : 0
    g.fillRect(cx - bw / 2, base - v * bh, bw, v * bh)
    g.shadowBlur = 0
    if (sci && k % 2) {
      const sv = clamp(squareOf / k / 1.3)
      g.strokeStyle = '#ffd166'
      g.lineWidth = 3
      g.setLineDash([6, 5])
      g.strokeRect(cx - bw / 2 - 3, base - sv * bh, bw + 6, sv * bh)
      g.setLineDash([])
    }
    g.fillStyle = k % 2 ? '#e8ecff' : '#8892c8'
    g.fillText(`${k}`, cx, base + 6)
  }
  g.restore()
}

function label(g, text, x, y, size, color = '#c9d4ff', align = 'left', baseline = 'alphabetic') {
  g.fillStyle = color
  g.font = font(size)
  g.textAlign = align
  g.textBaseline = baseline
  g.fillText(text, x, y)
}

/** A soft round glow. */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.3, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

const GE = '#6fa4a0'
const GE_HI = '#d8f2ee'

// ---- the room ----

export async function build({ ctx, root, E, ex, say, later, level, depth, color, light, lang, clickable }) {
  const stage = nashvilleStage({
    light,
    drums: { x: 2.2, z: -2.4, rot: 0.3 },
    gobos: [{ x: 1.4, z: -9.3, rot: 0.1 }, { x: 6.9, z: -6.0, rot: 1.2 }, { x: 5.9, z: -3.9, rot: 0.6 }],
    mics: [{ x: 0.4, z: -8.7, rot: 3.42, len: 1.0 }, { x: 4.3, z: -6.2, rot: 2.02, len: 1.2 }],
    rug: { x: 1.7, z: -6.9, w: 8.4, d: 4.4 },
  })
  root.add(stage.group)
  const solids = stage.solids
  const M = stage.mats
  const share = id => ctx.share?.(id)
  // a dark back for a standing screen (its glowing edge, seen from behind, was a big pink board)
  const backed = scr => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(scr.width + 0.12, scr.height + 0.12, 0.014), M.black)
    b.position.z = -0.036
    scr.panel.add(b)
    return scr
  }
  const updates = []
  const textures = []
  const soft = stage.soft
  const paras = list => list.map(p => ({ p }))
  const me = () => ctx.engine.player.pos
  const near = (spot, r) => Math.hypot(me().x - spot.x, me().z - spot.z) < r
  // a find counted; its panel opens a moment later, but only if the visitor is still at that station
  const discover = (find, panel, delay, spot) => {
    if (ex.discover(find) && panel) later(delay, () => near(spot, 7) && ctx.showPanel(panel))
  }
  // an invisible hit shape (the ray still hits it): w x h x d, centred at (x, y, z) of its parent
  const hit = (w, h, d, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }))
    m.position.set(x, y, z)
    return m
  }
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o })
  const glow = (c, k = 1.6) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false })
  const mat = {
    red: std('#c4232b', { roughness: 0.25, metalness: 0.15 }),
    cream: std('#e3d9bf', { roughness: 0.45 }),
    neck: std('#9a6a3c', { roughness: 0.5 }),
    fret: std('#3a2418', { roughness: 0.6 }),
    bronze: std('#a8742f', { roughness: 0.4, metalness: 0.55 }),
    silver: std('#8d98a6', { roughness: 0.38, metalness: 0.55 }),
    tolex: std('#1b191d', { roughness: 0.8 }),
    steel: std('#b9c1cb', { roughness: 0.34, metalness: 0.55 }),
    pcb: std('#ffffff', { roughness: 0.55 }),
    ge: std(GE, { roughness: 0.3, metalness: 0.25, emissive: '#2f5552', emissiveIntensity: 0.6 }),
    gold: std('#ffc93a', { roughness: 0.3, metalness: 0.6, emissive: '#6b4a00', emissiveIntensity: 0.4 }),
    blueAtom: std('#9fd0ff', { roughness: 0.3, metalness: 0.2, emissive: '#2a5a88', emissiveIntensity: 0.6 }),
  }

  // ======== the temperature and the stage lights (the picture's magenta and violet, warming up) ========
  const HEAT = { v: 0, shown: 0 }
  const heatTint = (base, k) => new THREE.Color(base).lerp(new THREE.Color('#ff9a45'), k * 0.85)
  const beamMat = []
  const spots = []
  /** A spotlight can on a bar, aimed at a point, with a faint cone of light and a real light. */
  function spotCan(pos, target, baseColor, { intensity = 22, angle = 0.34, reach = 6, real = true } = {}) {
    const g = new THREE.Group()
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.36, 18), M.black)
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.15, 18), glow(baseColor, 1.4))
    lens.rotation.x = Math.PI / 2
    lens.position.y = -0.185
    can.add(lens)
    g.add(can)
    const len = pos.distanceTo(target)
    const bm = new THREE.MeshBasicMaterial({ color: baseColor, transparent: true, opacity: light ? 0.04 : 0.055, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.14, Math.tan(angle) * len, len, 24, 1, true), bm)
    cone.position.y = -len / 2 - 0.2
    g.add(cone)
    g.position.copy(pos)
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), target.clone().sub(pos).normalize())
    root.add(g)
    // a real light on the lit thing only where it counts (every light adds to every material's shader)
    const pl = new THREE.PointLight(baseColor, real ? intensity : 0, reach * 2, 2)
    pl.position.copy(pos).lerp(target, 0.35)
    if (real) root.add(pl)
    beamMat.push(bm)
    const spot = { base: new THREE.Color(baseColor), lens: lens.material, beam: bm, pl, intensity, g }
    spots.push(spot)
    return spot
  }
  // the picture's two lights on the band
  spotCan(new THREE.Vector3(-0.3, 3.7, -5.6), new THREE.Vector3(-1.2, 0.8, -8.0), '#ff3ec8', { intensity: 16, angle: 0.3, reach: 6 })
  spotCan(new THREE.Vector3(3.8, 3.7, -5.6), new THREE.Vector3(3.2, 0.8, -8.5), '#7a4bff', { intensity: 16, angle: 0.3, reach: 6 })

  // ======== the guitar on its stand ========
  const guitar = new THREE.Group()
  const strings = new THREE.Group()
  {
    const pts = [[0, 0], [0.1, 0.012], [0.17, 0.07], [0.205, 0.15], [0.16, 0.235], [0.125, 0.3], [0.16, 0.37], [0.16, 0.43], [0.085, 0.46], [0.03, 0.455], [-0.04, 0.46], [-0.13, 0.44], [-0.17, 0.37], [-0.12, 0.3], [-0.17, 0.23], [-0.205, 0.15], [-0.17, 0.07], [-0.1, 0.012]]
    const curve = new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)))
    const shape = new THREE.Shape(curve.getPoints(70))
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 4 })
    geo.translate(0, 0, -0.02)
    const body = new THREE.Mesh(geo, mat.red)
    guitar.add(body)
    const pg = new THREE.Mesh(new THREE.CircleGeometry(1, 28), mat.cream)
    pg.scale.set(0.115, 0.18, 1)
    pg.position.set(0.01, 0.19, 0.0335)
    guitar.add(pg)
    for (const y of [0.15, 0.225]) {
      const pu = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.034, 0.014, 2, 0.006), M.black)
      pu.position.set(0.012, y, 0.04)
      guitar.add(pu)
    }
    const bridge = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.03, 0.02, 2, 0.006), M.chrome)
    bridge.position.set(0.012, 0.085, 0.043)
    guitar.add(bridge)
    for (const [x, y] of [[0.14, 0.11], [0.12, 0.07], [0.15, 0.17]]) {
      const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.02, 12).rotateX(Math.PI / 2), mat.cream)
      kn.position.set(x, y, 0.046)
      guitar.add(kn)
    }
    // neck, fingerboard, headstock, tuners
    const neck = new THREE.Mesh(new RoundedBoxGeometry(0.052, 0.68, 0.028, 2, 0.008), mat.neck)
    neck.position.set(0.012, 0.46 + 0.32, 0)
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.66, 0.008), mat.fret)
    board.position.set(0.012, 0.46 + 0.33, 0.016)
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.17, 0.024, 2, 0.01), M.darkWood)
    head.position.set(0.012, 1.215, 0)
    head.rotation.z = 0.04
    guitar.add(neck, board, head)
    for (let i = 0; i < 6; i++) {
      const tn = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.026, 8).rotateX(Math.PI / 2), M.chrome)
      tn.position.set(0.012 + (i < 3 ? -0.045 : 0.045), 1.165 + (i % 3) * 0.045, 0)
      guitar.add(tn)
    }
    for (let f = 1; f < 14; f++) {
      const fr = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.003, 0.003), M.chrome)
      fr.position.set(0.012, 0.46 + f * 0.043 + (f * f) * 0.0003, 0.021)
      guitar.add(fr)
    }
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.0013, 0.0013, 1.135 - 0.085, 4), M.chrome)
      s.position.set(0.012 + (i - 2.5) * 0.0075, 0.085 + (1.135 - 0.085) / 2, 0.025)
      strings.add(s)
    }
    guitar.add(strings)
    guitar.add(hit(0.5, 1.4, 0.2, 0, 0.62, 0))
    // it leans back on its stand and stands a little way off the floor
    guitar.position.set(GUITAR.x, 0.26, GUITAR.z)
    guitar.rotation.x = -0.2
    guitar.rotation.y = 0.35
    guitar.scale.setScalar(1.15)
    root.add(guitar)
    // the stand: a tripod with a post and a cradle
    const stand = new THREE.Group()
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 8), M.chrome)
    post.position.y = 0.21
    stand.add(post)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU + 0.3
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.46, 6), M.chrome)
      leg.position.set(Math.cos(a) * 0.12, 0.1, Math.sin(a) * 0.12)
      leg.rotation.set(Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55)
      stand.add(leg)
    }
    const cradle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 14, Math.PI), M.black)
    cradle.position.y = 0.43
    cradle.rotation.set(0, Math.PI / 2, 0)
    stand.add(cradle)
    stand.position.set(GUITAR.x + 0.02, 0, GUITAR.z + 0.25)
    root.add(stand)
    solids.push(circle(GUITAR.x, GUITAR.z + 0.1, 0.32))
  }

  // ======== pedals: a bronze wedge with two knobs and a foot switch (the picture's), at any scale ========
  /** A pedal of real size (0.11 m wide): body colour `metal`, knobs `knob`; scale it for a bigger one. */
  function makePedal(metal, knob = M.black, { led = '#ff2d4a' } = {}) {
    const g = new THREE.Group()
    const W = 0.11
    const D = 0.145
    const Hb = 0.058
    const Hf = 0.03
    const shape = new THREE.Shape()
    shape.moveTo(-D / 2, 0)
    shape.lineTo(D / 2, 0)
    shape.lineTo(D / 2, Hf)
    shape.lineTo(-D / 2, Hb)
    shape.closePath()
    const geo = new THREE.ExtrudeGeometry(shape, { depth: W, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 1 })
    geo.translate(0, 0, -W / 2)
    geo.rotateY(-Math.PI / 2)
    g.add(new THREE.Mesh(geo, metal))
    const slope = Math.atan2(Hb - Hf, D)
    const topAt = z => Hb + ((Hf - Hb) * (z + D / 2)) / D
    const pad = new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.006, 0.05, 2, 0.002), mat.cream)
    pad.position.set(0, topAt(0.035) + 0.002, 0.035)
    pad.rotation.x = slope
    g.add(pad)
    for (const x of [-0.026, 0.026]) {
      const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.014, 14), knob)
      kn.position.set(x, topAt(-0.035) + 0.006, -0.035)
      kn.rotation.x = slope
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.001, 0.009), mat.cream)
      tick.position.set(0, 0.0075, -0.003)
      kn.add(tick)
      g.add(kn)
    }
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.004, 8, 6), glow(led, 0.5))
    l.position.set(0.04, topAt(-0.005) + 0.003, -0.005)
    g.add(l)
    g.userData.led = l
    return g
  }

  // the picture's pedal on the stage floor (as drawn, a little bigger than real so it can be seen)
  const stagePedal = makePedal(mat.bronze, M.black)
  stagePedal.scale.setScalar(1.9)
  stagePedal.position.set(PEDAL0.x, 0, PEDAL0.z)
  stagePedal.rotation.y = 0.15
  root.add(stagePedal)
  // the amplifier: a black cabinet, a grille cloth, the speaker's glowing cone
  const amp = new THREE.Group()
  const cone = new THREE.Group()
  const coneMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff4fd8').multiplyScalar(0.55), toneMapped: false })
  {
    const cab = new THREE.Mesh(new RoundedBoxGeometry(0.86, 0.68, 0.36, 3, 0.03), mat.tolex)
    cab.position.y = 0.34 + 0.02
    amp.add(cab)
    const cloth = canvasTex(256, 200, (g, w, h) => {
      g.fillStyle = '#26212b'
      g.fillRect(0, 0, w, h)
      for (let y = 0; y < h; y += 5) {
        g.fillStyle = y % 10 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.25)'
        g.fillRect(0, y, w, 2)
      }
    })
    textures.push(cloth)
    const grille = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.48), new THREE.MeshStandardMaterial({ map: cloth, roughness: 0.95 }))
    grille.position.set(0, 0.32, 0.186)
    amp.add(grille)
    // the speaker seen through a round cut in the cloth: a rim and the cone
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.012, 6, 32), M.chrome)
    rim.position.set(0, 0.32, 0.19)
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.205, 32), coneMat)
    const dust = new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), std('#1a1420', { roughness: 0.6 }))
    ring.position.z = 0.005
    dust.position.z = 0.008
    cone.add(ring, dust)
    cone.position.set(0, 0.32, 0.192)
    amp.add(rim, cone)
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.07, 0.01), M.black)
    strip.position.set(0, 0.62, 0.186)
    amp.add(strip)
    for (let i = 0; i < 5; i++) {
      const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.019, 0.018, 12).rotateX(Math.PI / 2), mat.cream)
      kn.position.set(-0.28 + i * 0.14, 0.62, 0.198)
      amp.add(kn)
    }
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.01, 6, 12, Math.PI), M.black)
    handle.position.set(0, 0.7, 0)
    amp.add(handle)
    amp.scale.setScalar(1.15)
    amp.position.set(AMP.x, 0, AMP.z)
    amp.rotation.y = -0.2
    root.add(amp)
    solids.push(box(AMP.x, AMP.z, 1.0, 0.45, { rot: -0.2 }))
  }
  // cables lying on the floor: guitar to pedal to amp
  {
    const cable = pts => {
      const c = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)))
      const m = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.011, 6, false), M.black)
      root.add(m)
    }
    cable([[GUITAR.x + 0.18, 0.42, GUITAR.z + 0.12], [GUITAR.x + 0.3, 0.02, GUITAR.z + 0.4], [GUITAR.x + 0.8, 0.012, GUITAR.z + 1.0], [PEDAL0.x - 0.15, 0.012, PEDAL0.z + 0.05]])
    cable([[PEDAL0.x + 0.15, 0.012, PEDAL0.z - 0.05], [PEDAL0.x + 1.2, 0.012, PEDAL0.z + 0.6], [AMP.x - 0.6, 0.012, AMP.z + 0.5], [AMP.x - 0.45, 0.012, AMP.z + 0.1]])
  }

  // ======== the control room: the desk, the scope and meter on a cart, the tape machines ========
  const D = { faulty: false, heard: false }
  const NOTE = { t: 99, G: 5, b: 0, rms: 0.4 }
  const deskG = new THREE.Group()
  const part = new THREE.Group()
  const partGlowMat = new THREE.MeshBasicMaterial({ color: '#ffb347', toneMapped: false })
  const partHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: '#ffb347', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  {
    // local frame: operator edge toward +z (the window), strips along x (x -> world -z)
    const LEN = 2.7
    const DEP = 1.35
    const lowY = 0.74
    const hiY = 0.98
    const topAt = z => lowY + ((hiY - lowY) * (DEP / 2 - z)) / DEP // rises away from the operator
    const slope = Math.atan2(hiY - lowY, DEP)
    const profile = new THREE.Shape()
    profile.moveTo(-DEP / 2, 0)
    profile.lineTo(DEP / 2, 0)
    profile.lineTo(DEP / 2, lowY)
    profile.lineTo(-DEP / 2, hiY)
    profile.closePath()
    const geo = new THREE.ExtrudeGeometry(profile, { depth: LEN, bevelEnabled: false })
    geo.translate(0, 0, -LEN / 2)
    geo.rotateY(-Math.PI / 2)
    // the cabinet in dark wood with a grey metal top plate
    deskG.add(new THREE.Mesh(geo, M.darkWood))
    const plate = new THREE.Mesh(new THREE.BoxGeometry(LEN - 0.1, 0.012, Math.hypot(DEP, hiY - lowY) - 0.06), std('#4b5058', { roughness: 0.5, metalness: 0.3 }))
    plate.position.set(0, (lowY + hiY) / 2 + 0.01, 0)
    plate.rotation.x = slope
    deskG.add(plate)
    // eight channel strips: three knobs, a fader
    const knobGeo = new THREE.CylinderGeometry(0.02, 0.023, 0.026, 12)
    const colours = ['#c4232b', '#2f6fd0', '#e3d9bf', '#e3d9bf']
    const knobMats = colours.map(c => std(c, { roughness: 0.45 }))
    const slotMat = std('#0c0c10', { roughness: 0.8 })
    const FAULT = 1
    for (let i = 0; i < 8; i++) {
      const x = -LEN / 2 + 0.2 + i * 0.32
      const strip = new THREE.Group()
      strip.position.set(x, (lowY + hiY) / 2 + 0.02, 0)
      strip.rotation.x = slope
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.006, 1.12), std(i === FAULT ? '#5a5f68' : '#454a52', { roughness: 0.5, metalness: 0.3 }))
      strip.add(back)
      for (let k = 0; k < 4; k++) {
        const kn = new THREE.Mesh(knobGeo, knobMats[k])
        kn.position.set(0, 0.015, -0.4 + k * 0.17)
        strip.add(kn)
      }
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.004, 0.36), slotMat)
      slot.position.set(0, 0.005, 0.33)
      const cap = new THREE.Mesh(new RoundedBoxGeometry(0.07, 0.03, 0.045, 2, 0.008), mat.cream)
      cap.position.set(0, 0.018, 0.25 + ((i * 37) % 10) * 0.017)
      strip.add(slot, cap)
      deskG.add(strip)
      if (i === FAULT) {
        // the part that broke: a small metal can on the strip, glowing
        const can = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.13, 18), mat.steel)
        can.position.set(0, 0.07, -0.02)
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 18), partGlowMat)
        top.position.set(0, 0.14, -0.02)
        part.add(can, top, hit(0.28, 0.4, 0.4, 0, 0.12, 0))
        part.position.copy(strip.position).add(new THREE.Vector3(0, 0, 0))
        part.rotation.x = slope
        part.position.y += 0.0
        partHalo.scale.set(0.5, 0.5, 1)
        partHalo.position.set(x, topAt(-0.02) + 0.2, -0.02)
        deskG.add(part, partHalo)
      }
    }
    deskG.position.set(DESK.x, 0, DESK.z)
    deskG.rotation.y = Math.PI / 2
    root.add(deskG)
    solids.push(box(DESK.x, DESK.z, DEP + 0.1, LEN + 0.1))
  }
  const partWorld = () => part.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0))

  // the cart: a scope on top, a level meter below, facing the window
  const cart = new THREE.Group()
  const needle = new THREE.Group()
  const cartTex = canvasTex(768, 512, null)
  textures.push(cartTex)
  let cartScr
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.9, 1.25, 0.7, 3, 0.03), M.darkWood)
    body.position.y = 0.72
    cart.add(body)
    for (const [x, z] of [[-0.38, -0.28], [0.38, -0.28], [-0.38, 0.28], [0.38, 0.28]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 14).rotateZ(Math.PI / 2), M.black)
      w.position.set(x, 0.06, z)
      cart.add(w)
    }
    // the meter: a round dial in a square plate on the front
    const dial = canvasTex(256, 192, (g, w, h) => {
      g.fillStyle = '#efe4c4'
      g.fillRect(0, 0, w, h)
      const cx = w / 2
      const cy = 176
      const R = 130
      const A = 0.66 // the needle swings this far either side of upright
      for (let i = 0; i <= 20; i++) {
        const a = -A + (i / 20) * 2 * A
        const long = i % 5 === 0
        g.strokeStyle = i >= 14 ? '#c0272d' : '#1c1a18'
        g.lineWidth = long ? 6 : 3
        g.beginPath()
        g.moveTo(cx + Math.sin(a) * (R - (long ? 28 : 16)), cy - Math.cos(a) * (R - (long ? 28 : 16)))
        g.lineTo(cx + Math.sin(a) * R, cy - Math.cos(a) * R)
        g.stroke()
      }
      g.strokeStyle = '#c0272d'
      g.lineWidth = 8
      g.beginPath()
      g.arc(cx, cy, R + 8, -Math.PI / 2 - A + (14 / 20) * 2 * A, -Math.PI / 2 + A)
      g.stroke()
      g.fillStyle = '#1c1a18'
      g.font = '700 44px Outfit, sans-serif'
      g.textAlign = 'center'
      g.fillText('VU', cx, 96)
    })
    textures.push(dial)
    const plate = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.54, 0.06, 2, 0.02), M.black)
    plate.position.set(0, 1.0, 0.36)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.48), new THREE.MeshBasicMaterial({ map: dial }))
    face.position.set(0, 1.0, 0.392)
    cart.add(plate, face)
    needle.position.set(0, 1.0 + 0.24 - (176 / 192) * 0.48, 0.398)
    const nd = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.325, 0.002).translate(0, 0.1625, 0), std('#101010'))
    needle.add(nd)
    cart.add(needle)
    // the scope: a screen on a short stalk, facing the window
    cartScr = standingScreen({ width: 1.5, height: 1.1, color, title: E.desk.screen.title, line: '', titleSize: 0.1 }, { top: 2.3, tilt: 0.16, mat: M.black })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.93), new THREE.MeshBasicMaterial({ map: cartTex, toneMapped: false }))
    plane.position.y = -0.07
    cartScr.content.add(plane)
    backed(cartScr)
    cartScr.group.position.set(0, 0.1, 0)
    cart.add(cartScr.group)
    cart.position.set(CART.x, 0, CART.z)
    cart.rotation.y = Math.PI / 2
    root.add(cart)
    solids.push(box(CART.x, CART.z, 0.75, 0.95))
  }
  // tape machines against the far wall: two reels each
  const reels = []
  for (const z of [-8.9, -6.7]) {
    const tm = new THREE.Group()
    const cab = new THREE.Mesh(new RoundedBoxGeometry(0.62, 1.15, 0.8, 3, 0.03), std('#59606a', { roughness: 0.5, metalness: 0.35 }))
    cab.position.y = 0.6
    tm.add(cab)
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.62, 0.74), std('#a4abb4', { roughness: 0.4, metalness: 0.5 }))
    deck.position.set(0.32, 0.8, 0)
    tm.add(deck)
    for (const dz of [-0.2, 0.2]) {
      const reel = new THREE.Group()
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.012, 24).rotateZ(Math.PI / 2), M.chrome)
      const tape = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20).rotateZ(Math.PI / 2), std('#3a2c20', { roughness: 0.7 }))
      reel.add(disc, tape)
      for (let s = 0; s < 3; s++) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.025, 0.28), M.black)
        sp.rotation.x = (s / 3) * Math.PI
        sp.position.x = 0.01
        reel.add(sp)
      }
      reel.position.set(0.355, 0.99, dz)
      tm.add(reel)
      reels.push(reel)
    }
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.16), M.black)
    head.position.set(0.35, 0.68, 0)
    tm.add(head)
    tm.position.set(-9.45, 0, z)
    root.add(tm)
    solids.push(box(-9.45, z, 0.7, 0.9))
  }
  // a red lamp over the window that lights while a note is recorded
  const recMat = new THREE.MeshBasicMaterial({ color: '#3a0a0a', toneMapped: false })
  {
    const lamp = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.3, 0.12, 2, 0.04), recMat)
    lamp.position.set(-2.8, 3.35, -7.4)
    lamp.rotation.y = Math.PI / 2
    root.add(lamp)
    const t = makeText('REC', { size: 0.2, color: '#ffffff', anchorY: 'middle' })
    t.position.set(0, 0, 0.065)
    lamp.add(t)
  }

  // ---- the wave on the cart ----
  let cartKey = ''
  function drawCart() {
    const lv = level()
    const state = !D.heard ? 'idle' : D.faulty ? 'fuzzy' : 'clean'
    const key = `${state}|${lv}`
    if (key === cartKey) return
    cartKey = key
    const T = E.desk.screen
    cartTex.userData.redraw(g => {
      g.fillStyle = '#05060f'
      g.fillRect(0, 0, 768, 512)
      if (state === 'idle') {
        label(g, T.idle, 384, 270, 44, '#8f9bd0', 'center')
        return
      }
      drawScope(g, 24, 70, 720, 310, { G: D.faulty ? 30 : 5, color: D.faulty ? '#ff9a45' : '#58a8ff', showIdeal: lv === 'scientist', amp: 1 })
      label(g, T[state], 384, 450, 48, D.faulty ? '#ffb27a' : '#9fd0ff', 'center')
    })
  }

  // ---- the desk's station ----
  const deskPanel = lv => ({
    title: E.desk.title,
    color,
    blocks: [{ buttons: [{ label: E.desk.buttons.play, onClick: () => playGuitar() }, { label: E.desk.buttons.part, onClick: () => tapPart() }] }, ...paras(E.desk.panel[depth(lv)])],
  })
  const deskHint = () => E.desk.hints[!D.faulty ? (D.heard ? 'fault' : 'play') : D.heard ? 'mend' : 'again']
  function noteStart(G, b) {
    NOTE.t = 0
    NOTE.G = G
    NOTE.b = b
    NOTE.rms = analyse(G, b).rms
    rings.fire()
  }
  function playGuitar() {
    const G = D.faulty ? 30 : 5
    playNote(G, 0)
    noteStart(G, 0)
    D.heard = true
    say(at(E.desk.says[D.faulty ? 'fuzzy' : 'clean'], level()))
    if (D.faulty) discover('desk', deskPanel, 3.5, AT.desk)
    share('desk')
  }
  function tapPart() {
    D.faulty = !D.faulty
    D.heard = false
    play(D.faulty ? 'crack' : 'select')
    say(at(E.desk.says[D.faulty ? 'broke' : 'mended'], level()))
    share('desk')
  }
  ex.add({
    id: 'desk',
    x: AT.desk.x,
    z: AT.desk.z,
    radius: 2.1,
    manual: true,
    label: E.desk.label,
    verb: () => deskHint(),
    focus: { x: -4.4, y: 1.25, z: -6.9, size: 4.8, width: 5.4 },
    act: () => ctx.showPanel(deskPanel),
  })
  clickable(guitar, () => playGuitar(), { reach: 5.5 })
  clickable(part, () => tapPart(), { reach: 6.5 })

  // sound rings from the amplifier's speaker, and its cone pumping
  const rings = (() => {
    const list = []
    const g = new THREE.Group()
    g.position.set(AMP.x + Math.sin(-0.2) * 0.25, 0.32 * 1.15, AMP.z + 0.215 * 1.15)
    g.rotation.y = -0.2
    root.add(g)
    const geo = new THREE.TorusGeometry(0.24, 0.012, 6, 36)
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7be9'), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
      m.visible = false
      g.add(m)
      list.push({ m, age: 9 })
    }
    return {
      fire() {
        const r = list.reduce((a, b) => (a.age > b.age ? a : b))
        r.age = 0
        r.m.visible = true
      },
      update(dt) {
        for (const r of list) {
          if (r.age > 1) continue
          r.age += dt * 1.1
          const k = Math.min(1, r.age)
          r.m.scale.setScalar(0.6 + k * 2.6)
          r.m.position.z = k * 0.5
          r.m.material.opacity = 0.7 * (1 - k)
          if (k >= 1) r.m.visible = false
        }
      },
    }
  })()

  // ======== station two: the pedal opened, board as big as a table ========
  const P = { v: 22, open: -1 }
  const board = new THREE.Group()
  const cans = []
  let screen2Tex
  let screen2
  const bubble = new THREE.Group()
  const card = new THREE.Group()
  const beamLens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.2, 1, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: GE, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
  )
  beamLens.visible = false
  root.add(beamLens)
  const knobG = new THREE.Group()
  {
    // a bronze tray under the green board, a lip round it
    const tray = new THREE.Mesh(new RoundedBoxGeometry(BOARD.w + 0.4, 0.3, BOARD.d + 0.4, 3, 0.04), mat.bronze)
    tray.position.y = 0.15
    board.add(tray)
    // the printed board: dark green with gold tracks
    const rnd = random(5)
    const pcbTex = canvasTex(1024, 683, (g, w, h) => {
      g.fillStyle = '#1d6a3c'
      g.fillRect(0, 0, w, h)
      for (let i = 0; i < 2500; i++) {
        g.fillStyle = rnd() < 0.5 ? 'rgba(0,40,20,0.12)' : 'rgba(120,200,140,0.06)'
        g.fillRect(rnd() * w, rnd() * h, 2, 2)
      }
      g.strokeStyle = '#d8a93a'
      g.lineWidth = 9
      g.lineJoin = 'round'
      const px = x => x * w
      const py = y => y * h
      const tracks = [
        [[0.12, 0.2], [0.12, 0.5], [0.3, 0.62], [0.3, 0.9]],
        [[0.5, 0.2], [0.5, 0.6], [0.42, 0.72], [0.42, 0.95]],
        [[0.88, 0.2], [0.88, 0.5], [0.7, 0.62], [0.7, 0.9]],
        [[0.2, 0.2], [0.2, 0.42], [0.36, 0.42], [0.36, 0.2]],
        [[0.6, 0.2], [0.6, 0.42], [0.78, 0.42], [0.78, 0.2]],
        [[0.05, 0.12], [0.95, 0.12]],
        [[0.05, 0.95], [0.3, 0.95]],
        [[0.7, 0.95], [0.95, 0.95]],
      ]
      for (const t of tracks) {
        g.beginPath()
        t.forEach(([x, y], i) => (i ? g.lineTo(px(x), py(y)) : g.moveTo(px(x), py(y))))
        g.stroke()
      }
      g.fillStyle = '#f0cf6a'
      for (const t of tracks) for (const [x, y] of [t[0], t[t.length - 1]]) {
        g.beginPath()
        g.arc(px(x), py(y), 15, 0, TAU)
        g.fill()
      }
      g.fillStyle = '#1d6a3c'
      for (const t of tracks) for (const [x, y] of [t[0], t[t.length - 1]]) {
        g.beginPath()
        g.arc(px(x), py(y), 6, 0, TAU)
        g.fill()
      }
      g.fillStyle = 'rgba(245,245,235,0.85)'
      g.font = '700 30px Outfit, sans-serif'
      g.textAlign = 'center'
      g.fillText('Q1', px(0.2), py(0.17))
      g.fillText('Q2', px(0.5), py(0.17))
      g.fillText('Q3', px(0.8), py(0.17))
    })
    textures.push(pcbTex)
    const pcb = new THREE.Mesh(new RoundedBoxGeometry(BOARD.w, 0.06, BOARD.d, 2, 0.01), mat.pcb)
    pcb.position.y = 0.33
    mat.pcb.map = pcbTex
    board.add(pcb)
    // resistors and capacitors lying on it
    const bands = ['#7a3a12', '#111111', '#d02020', '#d8a93a']
    for (const [x, z, r] of [[-0.85, 0.62, 0], [-0.15, 0.66, 0.3], [0.45, 0.7, -0.2], [1.0, 0.65, 0.1], [-1.15, 0.1, 1.5], [1.2, 0.15, 1.6]]) {
      const res = new THREE.Group()
      const bodyR = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.3, 4, 10).rotateZ(Math.PI / 2), std('#d8c7a0', { roughness: 0.6 }))
      res.add(bodyR)
      for (let i = 0; i < 3; i++) {
        const bd = new THREE.Mesh(new THREE.CylinderGeometry(0.073, 0.073, 0.03, 12).rotateZ(Math.PI / 2), std(bands[i], { roughness: 0.6 }))
        bd.position.x = -0.1 + i * 0.1
        res.add(bd)
      }
      res.position.set(BOARD.x + x, 0.4, BOARD.z + z)
      res.rotation.y = r
      root.add(res)
    }
    for (const [x, z, c] of [[-0.5, 0.4, '#2a5fb0'], [0.7, 0.4, '#d89030']]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.34, 18), std(c, { roughness: 0.4 }))
      cap.position.set(BOARD.x + x, 0.53, BOARD.z + z)
      root.add(cap)
    }
    board.position.set(BOARD.x, 0, BOARD.z)
    root.add(board)
    solids.push(box(BOARD.x, BOARD.z, BOARD.w + 0.5, BOARD.d + 0.5))
    // the three germanium transistors: a can on three legs, tall as a person
    const canMat = std('#bcc4cf', { roughness: 0.3, metalness: 0.6, side: THREE.DoubleSide })
    const innerMat = std('#2a2f36', { roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide })
    TRANSISTORS.forEach((tp, i) => {
      const g = new THREE.Group()
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * TAU + Math.PI / 6
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.62, 6), M.chrome)
        leg.position.set(Math.cos(a) * 0.12, 0.31, Math.sin(a) * 0.12)
        g.add(leg)
      }
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.03, 28), canMat)
      flange.position.y = 0.64
      // the lower can (open at the top) and the cap that lifts off
      const lowerProfile = [[0, 0], [0.32, 0], [0.32, 0.34], [0.3, 0.34], [0.3, 0.02], [0, 0.02]].map(([r, y]) => new THREE.Vector2(r, y))
      const lower = new THREE.Mesh(new THREE.LatheGeometry(lowerProfile, 28), canMat)
      lower.position.y = 0.66
      const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.34, 24, 1, true), innerMat)
      inner.position.y = 0.83
      const capG = new THREE.Group()
      const capProfile = [[0, 0.62], [0.2, 0.62], [0.28, 0.57], [0.32, 0.5], [0.32, 0], [0.3, 0], [0.3, 0.49], [0.27, 0.55], [0.19, 0.6], [0, 0.6]].map(([r, y]) => new THREE.Vector2(r, y))
      const cap = new THREE.Mesh(new THREE.LatheGeometry(capProfile, 28), canMat)
      capG.add(cap)
      capG.position.y = 1.0
      const tab = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.1), canMat)
      tab.position.set(0.33, 0.67, 0)
      // the chip inside: a small slab of germanium on a post, thin wires to the legs
      const die = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.2), mat.ge)
      die.position.y = 0.86
      const postD = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.2, 10), M.chrome)
      postD.position.y = 0.76
      g.add(flange, lower, inner, capG, tab, die, postD)
      g.add(hit(0.8, 1.7, 0.8, 0, 1.0, 0))
      g.position.set(tp.x, 0.36, tp.z)
      root.add(g)
      solids.push(circle(tp.x, tp.z, 0.4))
      cans.push({ g, cap: capG, open: 0, die })
      clickable(g, () => openTransistor(i), { reach: 6 })
    })
    // the big gain knob on a post at the front corner
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.5, 14), M.black)
    post.position.y = 0.55
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.29, 0.22, 24), M.black)
    knob.position.y = 0.95
    const pointer = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.24), mat.cream)
    pointer.position.set(0, 0.075 + 0.045, -0.13)
    const ringK = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.015, 6, 28).rotateX(Math.PI / 2), M.chrome)
    ringK.position.y = 0.86
    knob.add(pointer)
    knobG.add(post, knob, ringK, hit(0.7, 0.9, 0.7, 0, 0.75, 0))
    knobG.position.set(BOARD.x + 1.25, 0.2, BOARD.z + 1.1)
    knobG.userData.knob = knob
    root.add(knobG)
    solids.push(circle(BOARD.x + 1.25, BOARD.z + 1.1, 0.34))
    clickable(knobG, () => knobStep(), { reach: 6 })
  }
  // the screen: the wave and the harmonics
  {
    screen2Tex = canvasTex(1024, 512, null)
    textures.push(screen2Tex)
    screen2 = standingScreen({ width: 2.3, height: 1.3, color, title: E.pedal.screen.title, line: '', titleSize: 0.11 }, { top: 2.15, tilt: 0.13, mat: M.black })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: screen2Tex, toneMapped: false }))
    plane.position.y = -0.09
    screen2.content.add(plane)
    backed(screen2)
    screen2.group.position.set(SCREEN2.x, 0, SCREEN2.z)
    screen2.group.rotation.y = Math.atan2(AT.pedal.x - SCREEN2.x, AT.pedal.z - SCREEN2.z)
    root.add(screen2.group)
    solids.push(box(SCREEN2.x, SCREEN2.z, 0.6, 0.45))
  }
  let screen2Key = ''
  function drawScreen2(force) {
    const lv = level()
    const G = gainAt(P.v)
    const key = `${Math.round(G * 20)}|${lv}|${lang}`
    if (!force && key === screen2Key) return
    screen2Key = key
    const T = E.pedal.screen
    const A = analyse(G, 0)
    screen2Tex.userData.redraw(g => {
      g.fillStyle = '#05060f'
      g.fillRect(0, 0, 1024, 512)
      label(g, T.waves, 28, 44, 32, '#ffd98a')
      label(g, T.bars, 600, 44, 32, '#ffd98a')
      drawScope(g, 24, 62, 540, 340, { G, color: '#ff7be9', showIdeal: true })
      drawBars(g, 590, 62, 410, 340, { hs: A.h, color: '#ff7be9', sci: lv === 'scientist', lang, squareOf: A.h[0] })
      // the legend of the two traces
      g.strokeStyle = 'rgba(200,215,255,0.7)'
      g.lineWidth = 3
      g.setLineDash([3, 7])
      g.beginPath()
      g.moveTo(40, 98)
      g.lineTo(100, 98)
      g.stroke()
      g.setLineDash([])
      label(g, T.input, 110, 106, 24, '#c9d4ff')
      g.strokeStyle = '#ff7be9'
      g.lineWidth = 5
      g.beginPath()
      g.moveTo(40, 130)
      g.lineTo(100, 130)
      g.stroke()
      label(g, T.output, 110, 138, 24, '#ff9aee')
      label(g, `${E.pedal.slider}: ${num(G, G < 10 ? 1 : 0, lang)}×`, 28, 456, 42, '#ff9aee')
      if (lv === 'scientist') label(g, `1 : 1/3 : 1/5 : 1/7 ${T.ideal}`, 600, 456, 26, '#ffd166')
    })
  }
  const gainClass = G => (G < 6 ? 'low' : G < 15 ? 'mid' : 'high')
  const pedalPanel = lv => ({
    title: E.pedal.title,
    color,
    blocks: [
      {
        slider: {
          label: E.pedal.slider,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(P.v),
          onInput: v => setGain(v),
          format: v => `${num(gainAt(v), gainAt(v) < 10 ? 1 : 0, lang)}×`,
          live: () => Math.round(P.v),
        },
      },
      { buttons: [{ label: E.pedal.buttons.knob, onClick: () => knobStep() }, { label: E.pedal.buttons.open, onClick: () => openTransistor(P.open < 0 ? 1 : (P.open + 1) % 3) }, { label: E.pedal.buttons.play, onClick: () => hearPedal() }] },
      ...paras(E.pedal.panel[depth(lv)]),
    ],
  })
  let lastClass = gainClass(gainAt(P.v))
  let heardPedal = false
  let sendGain = null
  function setGain(v, quiet) {
    P.v = clamp(Number(v) || 0, 0, 100)
    const c = gainClass(gainAt(P.v))
    if (!quiet && c !== lastClass) say(at(E.pedal.says[c], level()))
    lastClass = c
    ex.discover('pedal')
    if (!quiet) replayAt = clockT + 0.5
    if (!sendGain) {
      sendGain = setTimeout(() => {
        sendGain = null
        share('pedal')
      }, 250)
    }
  }
  let replayAt = -1
  function hearPedal() {
    heardPedal = true
    const G = gainAt(P.v)
    playNote(G, 0)
    noteStart(G, 0)
    discover('pedal', pedalPanel, 3.5, AT.pedal)
  }
  function knobStep() {
    const lv = [22, 62, 92]
    const next = lv.find(x => x > P.v + 3) ?? lv[0]
    setGain(next, true)
    play('tap')
    say(at(E.pedal.says[gainClass(gainAt(P.v))], level()))
    hearPedal()
    share('pedal')
  }
  function openTransistor(i) {
    P.open = P.open === i ? -1 : i
    play(P.open >= 0 ? 'select' : 'tap')
    if (P.open >= 0) say(at(E.pedal.says.open, level()))
    discover('pedal', pedalPanel, 3.5, AT.pedal)
    share('pedal')
  }
  ex.add({
    id: 'pedal',
    x: AT.pedal.x,
    z: AT.pedal.z,
    radius: 2.1,
    manual: true,
    label: E.pedal.label,
    verb: () => (P.open >= 0 ? E.pedal.hints.more : P.v < 40 && !heardPedal ? E.pedal.hints.gain : E.pedal.hints.look),
    screens: [screen2],
    focus: { x: -5.8, y: 1.4, z: 0.3, size: 4.7, width: 5.5 },
    act: () => ctx.showPanel(pedalPanel),
  })

  // the lens: a glass bubble over the open transistor, the germanium crystal turning inside it
  const lattice = new THREE.Group()
  {
    // diamond cubic, 2 x 2 x 2 cells: the fcc sites (doubled coordinates a, b, c with an even sum) and the same
    // shifted by a quarter along the cube's diagonal
    const pos = []
    for (let a = 0; a <= 4; a++) for (let b = 0; b <= 4; b++) for (let c = 0; c <= 4; c++) {
      if ((a + b + c) % 2) continue
      pos.push(new THREE.Vector3(a / 2, b / 2, c / 2))
      if (a <= 3 && b <= 3 && c <= 3) pos.push(new THREE.Vector3(a / 2 + 0.25, b / 2 + 0.25, c / 2 + 0.25))
    }
    const centre = new THREE.Vector3(1, 1, 1)
    const S = 0.27
    // three atoms near the middle are other elements
    const sorted = [...pos].sort((a, b) => a.distanceTo(centre) - b.distanceTo(centre))
    const odd = new Set([sorted[1], sorted[6], sorted[12]])
    const geAtoms = pos.filter(p => !odd.has(p))
    const atomGeo = new THREE.SphereGeometry(0.1, 14, 10)
    const geMesh = new THREE.InstancedMesh(atomGeo, mat.ge, geAtoms.length)
    const mtx = new THREE.Matrix4()
    geAtoms.forEach((p, i) => {
      mtx.compose(p.clone().sub(centre).multiplyScalar(S), new THREE.Quaternion(), new THREE.Vector3(S, S, S))
      geMesh.setMatrixAt(i, mtx)
    })
    lattice.add(geMesh)
    const oddList = [...odd]
    const oddMesh = new THREE.InstancedMesh(atomGeo, mat.gold, oddList.length)
    oddList.forEach((p, i) => {
      mtx.compose(p.clone().sub(centre).multiplyScalar(S), new THREE.Quaternion(), new THREE.Vector3(S * 1.25, S * 1.25, S * 1.25))
      oddMesh.setMatrixAt(i, mtx)
    })
    lattice.add(oddMesh)
    // bonds between nearest neighbours (distance sqrt(3)/4 of a cell)
    const bonds = []
    for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) if (Math.abs(pos[i].distanceTo(pos[j]) - Math.sqrt(3) / 4) < 0.01) bonds.push([pos[i], pos[j]])
    const bondGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 6)
    const bondMesh = new THREE.InstancedMesh(bondGeo, std(GE_HI, { roughness: 0.5, transparent: true, opacity: 0.55 }), bonds.length)
    bonds.forEach(([a, b], i) => {
      const d = b.clone().sub(a)
      const mid = a.clone().add(b).multiplyScalar(0.5).sub(centre).multiplyScalar(S)
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())
      mtx.compose(mid, q, new THREE.Vector3(1, d.length() * S, 1))
      bondMesh.setMatrixAt(i, mtx)
    })
    lattice.add(bondMesh)
    for (const m of [geMesh, oddMesh, bondMesh]) m.raycast = () => {}
    const glass = new THREE.Mesh(
      new THREE.SphereGeometry(0.64, 28, 20),
      new THREE.MeshBasicMaterial({ color: '#bfe8e4', transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide }),
    )
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.02, 8, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.2), toneMapped: false }))
    bubble.add(glass, rim, lattice)
    bubble.position.set(BOARD.x - 0.6, 2.85, BOARD.z - 0.1)
    bubble.scale.setScalar(0.001)
    bubble.visible = false
    root.add(bubble)
  }
  // the card: where germanium and silicon start to conduct
  const cardTex = canvasTex(640, 480, null)
  textures.push(cardTex)
  {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.088), new THREE.MeshBasicMaterial({ map: cardTex, toneMapped: false }))
    const edge = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.14, 0.04, 2, 0.02), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, roughness: 0.4 }))
    edge.position.z = -0.025
    card.add(edge, face)
    card.position.set(BOARD.x + 0.8, 2.75, BOARD.z + 0.1)
    card.rotation.y = Math.atan2(AT.pedal.x - (BOARD.x + 0.8), AT.pedal.z - BOARD.z)
    card.scale.setScalar(0.001)
    card.visible = false
    root.add(card)
  }
  let cardKey = ''
  function drawCard() {
    const lv = level()
    const key = `${lv}|${lang}`
    if (key === cardKey) return
    cardKey = key
    const T = E.pedal.lens
    cardTex.userData.redraw(g => {
      g.fillStyle = '#0a1030'
      g.fillRect(0, 0, 640, 480)
      label(g, T.knee, 320, 52, 36, '#ffd98a', 'center')
      const x0 = 70
      const y0 = 380
      const w = 520
      const h = 250
      g.strokeStyle = '#8892c8'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(x0, y0 - h - 10)
      g.lineTo(x0, y0)
      g.lineTo(x0 + w + 10, y0)
      g.stroke()
      const X = v => x0 + (v / 1.0) * w
      const curve = (knee, c) => {
        g.strokeStyle = c
        g.lineWidth = 6
        g.beginPath()
        for (let i = 0; i <= 120; i++) {
          const v = i / 120
          const cur = Math.min(1, Math.exp((v - knee) / 0.05) * 0.12)
          const px = X(v)
          const py = y0 - cur * h
          if (i) g.lineTo(px, py)
          else g.moveTo(px, py)
        }
        g.stroke()
      }
      curve(0.25, GE)
      curve(0.65, '#9aa7ff')
      g.setLineDash([6, 6])
      g.lineWidth = 2
      for (const [v, c] of [[0.25, GE], [0.65, '#9aa7ff']]) {
        g.strokeStyle = c
        g.beginPath()
        g.moveTo(X(v), y0)
        g.lineTo(X(v), y0 - h * 0.78)
        g.stroke()
      }
      g.setLineDash([])
      label(g, T.ge, X(0.25) - 14, y0 - h * 0.86, 30, GE, 'right')
      label(g, T.si, X(0.65) + 14, y0 - h * 0.86, 30, '#9aa7ff', 'left')
      if (lv === 'scientist') {
        label(g, T.geAt, X(0.25) - 14, y0 - h * 0.86 + 30, 24, '#c9f2ee', 'right')
        label(g, T.siAt, X(0.65) + 14, y0 - h * 0.86 + 30, 24, '#cfd6ff', 'left')
      }
      label(g, T.volts, 320, 440, 26, '#c9d4ff', 'center')
      label(g, T.current, 18, 70, 24, '#c9d4ff', 'left')
      // the legend: germanium and the other atoms
      g.fillStyle = GE
      g.beginPath()
      g.arc(70, 460, 9, 0, TAU)
      g.fill()
      label(g, T.atoms, 86, 468, 22, '#c9f2ee')
      g.fillStyle = '#ffc93a'
      g.beginPath()
      g.arc(340, 460, 9, 0, TAU)
      g.fill()
      label(g, T.dopant, 356, 468, 22, '#ffe6a0')
    })
  }

  // ======== station three: two pedals on a stool under the stage lights ========
  const S3 = { T: 20, changed: false, heard: false, recordTapped: false }
  const leakGe = T => Math.pow(2, (T - 20) / 10)
  const leakSi = T => 0.001 * Math.pow(2, (T - 20) / 10)
  const geModel = T => {
    const e = clamp((T - 15) / 30)
    return { G: 14 * (1 - 0.55 * e), b: 0.55 * e }
  }
  const SI_MODEL = { G: 14, b: 0 }
  const pedalGe = makePedal(mat.bronze, M.black)
  const pedalSi = makePedal(mat.silver, std('#d8dde6', { roughness: 0.4 }), { led: '#3dff9a' })
  const thermoCol = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 10), glow('#ff1e10', 0.9))
  let screen3Tex
  let screen3
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(2.7, 0.08, 1.3, 2, 0.02), M.wood)
    top.position.set(TABLE.x, 0.56, TABLE.z)
    root.add(top)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.52, 8), M.darkWood)
      leg.position.set(TABLE.x + sx * 1.2, 0.26, TABLE.z + sz * 0.55)
      root.add(leg)
    }
    solids.push(box(TABLE.x, TABLE.z, 2.8, 1.4))
    pedalGe.scale.setScalar(4.2)
    pedalSi.scale.setScalar(4.2)
    pedalGe.position.set(TABLE.x - 0.7, 0.6, TABLE.z)
    pedalSi.position.set(TABLE.x + 0.7, 0.6, TABLE.z)
    pedalGe.rotation.y = 0.12
    pedalSi.rotation.y = -0.12
    root.add(pedalGe, pedalSi)
    for (const [p, w] of [[pedalGe, 'ge'], [pedalSi, 'si']]) {
      p.add(hit(0.14, 0.09, 0.18, 0, 0.04, 0))
      clickable(p, () => hearStage(w), { reach: 6 })
    }
    for (const [p, w, x] of [[pedalGe, 'ge', -0.7], [pedalSi, 'si', 0.7]]) {
      const t = makeText(E.stage.screen[w].toUpperCase(), { size: 0.12, color: w === 'ge' ? '#9fe0d8' : '#cfd6ff', anchorY: 'middle', maxWidth: 1.3 })
      t.rotation.x = -Math.PI / 2
      t.position.set(TABLE.x + x, 0.61, TABLE.z + 0.55)
      root.add(t)
    }
    // the stage lights: a bar over the stool with three cans
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4.2, 8).rotateZ(Math.PI / 2), M.black)
    bar.position.set(TABLE.x, 3.6, TABLE.z - 1.0)
    root.add(bar)
    for (const sx of [-1.4, 0, 1.4]) {
      const base = ['#ff3ec8', '#7a4bff', '#ff3ec8'][sx / 1.4 + 1]
      const sp = spotCan(new THREE.Vector3(TABLE.x + sx, 3.5, TABLE.z - 1.0), new THREE.Vector3(TABLE.x + sx * 0.5, 0.6, TABLE.z), base, { intensity: 9, angle: 0.22, reach: 5, real: sx === 0 })
      sp.g.add(hit(0.5, 0.6, 0.5, 0, -0.2, 0))
      clickable(sp.g, () => stepTemp(), { reach: 8 })
    }
    // the thermometer: a glass tube on a stand with a red column and a scale
    const th = new THREE.Group()
    const baseT = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 18), M.black)
    baseT.position.y = 0.04
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 8), M.black)
    stem.position.y = 0.3
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.7, 14), new THREE.MeshBasicMaterial({ color: '#cfe4f0', transparent: true, opacity: 0.18, depthWrite: false }))
    tube.position.y = 1.3
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), glow('#ff1e10', 0.9))
    bulb.position.y = 0.46
    thermoCol.position.set(0, 0.46, 0)
    const scaleTex = canvasTex(160, 800, (g, w, h) => {
      g.fillStyle = '#0a1030'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#e8ecff'
      g.strokeStyle = '#e8ecff'
      g.font = '700 38px Outfit, sans-serif'
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      g.lineWidth = 3
      for (let t = 0; t <= 50; t += 10) {
        const y = h - 40 - ((t - 0) / 50) * (h - 80)
        g.beginPath()
        g.moveTo(8, y)
        g.lineTo(40, y)
        g.stroke()
        g.fillText(`${t}`, 52, y)
      }
    })
    textures.push(scaleTex)
    const scalePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 1.4), new THREE.MeshBasicMaterial({ map: scaleTex, toneMapped: false }))
    scalePlane.position.set(0.19, 1.31, -0.02)
    th.add(baseT, stem, tube, bulb, thermoCol, scalePlane)
    th.add(hit(0.6, 2.2, 0.6, 0, 1.1, 0))
    th.position.set(THERMO.x, 0, THERMO.z)
    th.rotation.y = Math.atan2(AT.stage.x - THERMO.x, AT.stage.z - THERMO.z)
    root.add(th)
    solids.push(circle(THERMO.x, THERMO.z, 0.34))
    clickable(th, () => stepTemp(), { reach: 7 })
    // the screen: both pedals' waves and their leakage meters
    screen3Tex = canvasTex(1024, 512, null)
    textures.push(screen3Tex)
    screen3 = standingScreen({ width: 2.5, height: 1.4, color, title: E.stage.screen.title, line: '', titleSize: 0.11 }, { top: 2.15, tilt: 0.13, mat: M.black })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: screen3Tex, toneMapped: false }))
    plane.position.y = -0.09
    screen3.content.add(plane)
    backed(screen3)
    screen3.group.position.set(SCREEN3.x, 0, SCREEN3.z)
    screen3.group.rotation.y = Math.atan2(AT.stage.x - SCREEN3.x, AT.stage.z - SCREEN3.z)
    root.add(screen3.group)
    solids.push(box(SCREEN3.x, SCREEN3.z, 0.6, 0.45))
  }
  // the gold record on the east wall
  const record = new THREE.Group()
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.95, 0.06, 2, 0.02), M.darkWood)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 40).rotateX(Math.PI / 2), mat.gold)
    disc.position.z = 0.045
    const groove = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.36, 40), new THREE.MeshStandardMaterial({ color: '#c79a20', roughness: 0.25, metalness: 0.8, emissive: '#5a3c00', emissiveIntensity: 0.3 }))
    groove.position.z = 0.058
    const labelD = new THREE.Mesh(new THREE.CircleGeometry(0.12, 28), std('#e8e0c8', { roughness: 0.6 }))
    labelD.position.z = 0.059
    record.add(frame, disc, groove, labelD)
    stage.onWall(record, 'e', -1.4, 1.9)
    record.add(hit(1.0, 1.0, 0.3, 0, 0, 0.1))
    clickable(record, () => tapRecord(), { reach: 7 })
  }
  let screen3Key = ''
  function drawScreen3() {
    const lv = level()
    const key = `${Math.round(S3.T)}|${lv}|${lang}`
    if (key === screen3Key) return
    screen3Key = key
    const T = E.stage.screen
    const mg = geModel(S3.T)
    screen3Tex.userData.redraw(g => {
      g.fillStyle = '#05060f'
      g.fillRect(0, 0, 1024, 512)
      const col = (x0, name, c, model, leak, cc) => {
        label(g, name, x0 + 230, 44, 38, c, 'center')
        drawScope(g, x0, 62, 460, 230, { G: model.G, b: model.b, color: c, showIdeal: false })
        label(g, T.leak, x0, 336, 26, '#c9d4ff')
        // the leakage meter: a bar from 0 to 8 microamps
        g.fillStyle = '#10163a'
        g.fillRect(x0, 352, 460, 40)
        g.fillStyle = cc
        g.fillRect(x0, 352, Math.max(2, Math.min(1, leak / 8) * 460), 40)
        g.strokeStyle = 'rgba(200,215,255,0.5)'
        g.lineWidth = 2
        for (let t = 0; t <= 8; t += 2) {
          g.beginPath()
          g.moveTo(x0 + (t / 8) * 460, 392)
          g.lineTo(x0 + (t / 8) * 460, 402)
          g.stroke()
        }
        g.font = font(22)
        g.textAlign = 'center'
        g.fillStyle = '#8892c8'
        for (let t = 0; t <= 8; t += 4) g.fillText(`${t}`, x0 + (t / 8) * 460, 428)
        label(g, `${num(leak, leak < 0.1 ? 3 : 1, lang)} ${T.unit}`, x0 + 460, 470, 36, '#ffffff', 'right')
      }
      col(24, T.ge, '#6fe0d4', mg, leakGe(S3.T), '#ff7a4a')
      col(540, T.si, '#9aa7ff', SI_MODEL, leakSi(S3.T), '#5a8aff')
    })
  }
  const tempClass = T => (T < 12 ? 'cold' : T < 32 ? 'mild' : 'hot')
  const stagePanel = lv => ({
    title: E.stage.title,
    color,
    blocks: [
      {
        slider: {
          label: E.stage.slider,
          min: 5,
          max: 45,
          step: 1,
          value: Math.round(S3.T),
          onInput: v => setTemp(v),
          format: v => `${Math.round(v)} °C`,
          live: () => Math.round(S3.T),
        },
      },
      { buttons: [{ label: E.stage.buttons.temp, onClick: () => stepTemp() }, { label: E.stage.buttons.ge, onClick: () => hearStage('ge') }, { label: E.stage.buttons.si, onClick: () => hearStage('si') }] },
      ...paras(E.stage.panel[depth(lv)]),
    ],
  })
  let lastTempClass = tempClass(S3.T)
  let sendTemp = null
  function setTemp(v, quiet) {
    S3.T = clamp(Number(v) || 20, 5, 45)
    S3.changed = true
    HEAT.v = clamp((S3.T - 5) / 40)
    const c = tempClass(S3.T)
    if (!quiet && c !== lastTempClass) say(at(E.stage.says[c], level()))
    lastTempClass = c
    ex.discover('stage')
    if (!sendTemp) {
      sendTemp = setTimeout(() => {
        sendTemp = null
        share('stage')
      }, 250)
    }
  }
  function stepTemp() {
    const list = [5, 22, 42]
    const next = list.find(x => x > S3.T + 2) ?? list[0]
    setTemp(next, true)
    play('tap')
    say(at(E.stage.says[tempClass(next)], level()))
    discover('stage', stagePanel, 4, AT.stage)
    share('stage')
  }
  function hearStage(which) {
    const m = which === 'ge' ? geModel(S3.T) : SI_MODEL
    playNote(m.G, m.b)
    noteStart(m.G, m.b)
    S3.heard = true
    const p = which === 'ge' ? pedalGe : pedalSi
    p.userData.led.material.color.multiplyScalar(2)
    say(at(E.stage.says[which], level()))
    discover('stage', stagePanel, 4, AT.stage)
    share('stage')
  }
  function tapRecord() {
    S3.recordTapped = true
    play('discover')
    say(at(E.stage.says.record, level()))
    discover('stage', stagePanel, 6, AT.stage)
  }
  ex.add({
    id: 'stage',
    x: AT.stage.x,
    z: AT.stage.z,
    radius: 2.1,
    manual: true,
    label: E.stage.label,
    verb: () => (!S3.changed ? E.stage.hints.heat : !S3.heard ? E.stage.hints.hear : !S3.recordTapped ? E.stage.hints.record : E.stage.hints.hear),
    screens: [screen3],
    focus: { x: 7.4, y: 1.3, z: -0.8, size: 4.5, width: 5.4 },
    act: () => ctx.showPanel(stagePanel),
  })

  // ======== every frame ========
  let clockT = 0
  let needleA = 0
  const tmpC = new THREE.Color()
  updates.push((dt, t) => {
    clockT += dt
    NOTE.t += dt
    stage.update(t)
    rings.update(dt)
    // the note: the needle swings with it, the REC lamp lights, the reels turn, the strings tremble
    const env = NOTE.t < 1.4 ? Math.exp(-NOTE.t * 1.8) * Math.min(1, NOTE.t / 0.03) : 0
    const loud = clamp(NOTE.rms * 1.05 * (0.25 + 0.75 * Math.sqrt(env)))
    const target = NOTE.t < 1.4 ? loud : 0
    needleA = damp(needleA, target, 14, dt)
    needle.rotation.z = 0.66 - needleA * 1.32
    recMat.color.set(NOTE.t < 1.6 ? '#ff2a2a' : '#3a0a0a')
    const spin = NOTE.t < 2.2 ? 5 : 0.4
    for (const r of reels) r.rotation.x += spin * dt
    strings.rotation.z = Math.sin(t * 90) * 0.012 * env
    guitar.rotation.z = Math.sin(t * 40) * 0.006 * env
    const pump = 1 + env * 0.08
    cone.scale.setScalar(pump)
    coneMat.color.set('#ff4fd8').multiplyScalar(0.55 + env * 1.1)
    // the faulty part glows: amber when it is the next tap, red when broken
    const hint = !D.faulty && D.heard
    partGlowMat.color.set(D.faulty ? '#ff3a2a' : '#ffb347').multiplyScalar(D.faulty ? 1.5 + Math.sin(t * 12) * 0.4 : hint ? 1.3 + Math.sin(t * 4) * 0.5 : 0.5)
    partHalo.material.opacity = D.faulty ? 0.8 : hint ? 0.6 + Math.sin(t * 4) * 0.3 : 0.12
    partHalo.material.color.set(D.faulty ? '#ff3a2a' : '#ffb347')
    // the pedal's replay after the slider settles, only for the one who moved it
    if (replayAt > 0 && clockT >= replayAt) {
      replayAt = -1
      if (near(AT.pedal, 6)) hearPedal()
    }
    // the transistors' cans lift off, the lens grows over the open one
    let any = 0
    cans.forEach((c, i) => {
      c.open = damp(c.open, P.open === i ? 1 : 0, 5, dt)
      if (Math.abs(c.open - (P.open === i ? 1 : 0)) < 0.003) c.open = P.open === i ? 1 : 0
      c.cap.position.y = 1.0 + c.open * 0.5
      c.cap.rotation.z = c.open * 0.9
      c.cap.position.x = c.open * 0.95
      if (c.open > any) any = c.open
    })
    const o = P.open >= 0 ? cans[P.open] : cans.reduce((a, b) => (a.open > b.open ? a : b))
    bubble.visible = card.visible = any > 0.01
    bubble.scale.setScalar(Math.max(0.001, any))
    card.scale.setScalar(Math.max(0.001, any))
    beamLens.visible = any > 0.01
    if (any > 0.01 && o) {
      const from = new THREE.Vector3(o.g.position.x, 1.5, o.g.position.z)
      const to = bubble.position
      const len = from.distanceTo(to)
      beamLens.position.copy(from).add(to).multiplyScalar(0.5)
      beamLens.scale.set(0.5 + 0.5 * any, len, 0.5 + 0.5 * any)
      beamLens.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize())
      beamLens.material.opacity = 0.16 * any
    }
    lattice.rotation.y += dt * 0.45
    lattice.rotation.x = 0.35
    bubble.position.x = o ? o.g.position.x : bubble.position.x
    card.position.x = (o ? o.g.position.x : BOARD.x) + 1.7
    // the big knob follows the gain
    knobG.userData.knob.rotation.y = -(P.v / 100) * Math.PI * 1.5 + Math.PI * 0.75
    // the stage lights: warmer and stronger with the temperature
    HEAT.shown = damp(HEAT.shown, HEAT.v, 3, dt)
    for (const s of spots) {
      tmpC.copy(heatTint(`#${s.base.getHexString()}`, HEAT.shown))
      s.pl.color.copy(tmpC)
      s.pl.intensity = s.pl.parent ? s.intensity * (1 + HEAT.shown * 0.6) : 0
      s.beam.color.copy(tmpC)
      s.beam.opacity = (light ? 0.04 : 0.055) * (1 + HEAT.shown * 0.8)
      s.lens.color.copy(tmpC).multiplyScalar(1.4 + HEAT.shown)
    }
    thermoCol.scale.y = 0.01 + HEAT.shown * 1.35
    thermoCol.position.y = 0.46 + (0.01 + HEAT.shown * 1.35) / 2
    for (const p of [pedalGe, pedalSi]) p.userData.led.material.color.lerp(new THREE.Color(p === pedalGe ? '#ff2d4a' : '#3dff9a').multiplyScalar(0.5), Math.min(1, dt * 3))
    // the screens, drawn again when what they show has changed enough to see
    drawCart()
    drawScreen2(false)
    drawScreen3()
    if (card.visible) drawCard()
  })

  // ---- shared with the room ----
  const deskState = () => ({ faulty: D.faulty })
  const pedalState = () => ({ v: Math.round(P.v), open: P.open })
  const stageState = () => ({ T: Math.round(S3.T * 10) / 10 })

  return {
    env: stage.env,
    solids,
    cameraBounds: stage.cameraBounds,
    // the camera stays on the room's side of the frame (behind it, it would look through the swirl)
    cameraClear(from, to) {
      const zf = BACK.z - 0.3
      if (to.z <= zf || from.z >= zf) return 1
      const k = (zf - from.z) / (to.z - from.z)
      const x = from.x + (to.x - from.x) * k
      const y = from.y + (to.y - from.y) * k
      return Math.abs(x - BACK.x) > 1.9 || y > 3.1 ? 1 : k
    },
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    // for the probes (shot.py cannot move the mouse): what a tap on each thing does, and where things are
    parts: {
      desk: {
        guitar: () => playGuitar(), // the guitar
        part: () => tapPart(), // the glowing part on the desk
        get state() { return { ...D } },
      },
      pedal: {
        gain: v => setGain(v), // the panel's slider, 0..100
        knob: () => knobStep(), // the big knob
        open: i => openTransistor(i), // a transistor, 0..2 (again to close)
        get state() { return { ...P, G: gainAt(P.v) } },
      },
      stage: {
        temp: v => setTemp(v), // the panel's slider, 5..45
        heat: () => stepTemp(), // the stage lights
        hear: which => hearStage(which), // 'ge' | 'si'
        record: () => tapRecord(),
        get state() { return { ...S3, ge: geModel(S3.T), leak: leakGe(S3.T) } },
      },
      at: {
        guitar: () => guitar.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.5, 0)),
        part: () => partWorld(),
        transistor: i => new THREE.Vector3(TRANSISTORS[i].x, 1.3, TRANSISTORS[i].z),
        knob: () => knobG.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 1.0, 0)),
        pedalGe: () => pedalGe.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0)),
        pedalSi: () => pedalSi.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0)),
        lights: () => new THREE.Vector3(TABLE.x, 3.5, TABLE.z - 1.0),
        thermometer: () => new THREE.Vector3(THERMO.x, 1.2, THERMO.z),
        record: () => record.getWorldPosition(new THREE.Vector3()),
      },
      analyse: (G, b) => analyse(G, b),
      // a ray from the camera to a point, as a tap there would cast
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { desk: deskPanel, pedal: pedalPanel, stage: stagePanel },
    shared: {
      desk: {
        get: deskState,
        set: s => {
          D.faulty = !!s?.faulty
          D.heard = false
        },
      },
      pedal: {
        get: pedalState,
        set: s => {
          P.v = clamp(Number(s?.v) || 0, 0, 100)
          lastClass = gainClass(gainAt(P.v))
          P.open = Number.isInteger(s?.open) && s.open >= 0 && s.open < 3 ? s.open : -1
        },
      },
      stage: {
        get: stageState,
        set: s => {
          S3.T = clamp(Number(s?.T) || 20, 5, 45)
          HEAT.v = clamp((S3.T - 5) / 40)
          lastTempClass = tempClass(S3.T)
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    detach() {
      replayAt = -1
      clearTimeout(sendGain)
      clearTimeout(sendTemp)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
