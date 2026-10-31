// Hydrogen's picture "How would you write to aliens?" as a room (docs/knowledge/picture-rooms.md): the
// Dwingeloo radio telescope on a heath in Drenthe at night (stages/heath.js), the Milky Way overhead. The
// dish is the real one's size (25 m, on its "beak" of steel, the control house in its base, always behind
// the reflector, the whole turning on a rail). Three things to do, each step chosen by tapping its thing (the
// user, 2026-10-30), the prompt naming the next tap, E opening the station's panel, whose buttons and
// slider do the same:
// - map the Milky Way, at the receiver and the map board in front of the telescope. Tap the dish and it
//   listens along the next stretch of the Milky Way (six stretches, galactic longitude 10° to 250°). The
//   sky turns first (the Earth turning) until that stretch is well up, the dish follows it, the screen draws
//   the 21 cm line it hears, split into bumps by the Doppler shift (each cloud moving at its own speed), and
//   the map gains the clouds those speeds place along that direction. Toward the Galaxy's centre and away
//   from it the clouds move across our line of sight, so speeds give no distances: the two blank wedges, as
//   on the maps of the 1950s. The part from about 255° to 350° never rises over the Netherlands: the charts
//   from Sydney fill it (Australian astronomers mapped the southern half). A slider points the dish anywhere
//   from 10° to 250°. The galaxy is a model: four trailing arms (pitch 12°) and the Local arm, a flat
//   rotation of 230 km/s, the Sun 8.2 kpc from the centre; the profiles are computed from it, and the map
//   shows its clouds where their speeds would place them;
// - the spin flip: a giant hydrogen atom, proton and electron each with its spin arrow. Tap the electron:
//   a counter runs through the years it waits (drawn from the real exponential wait, mean 11 million
//   years, the same draw for everyone in a room), the electron's arrow flips and a wave leaves, true size:
//   21.1 cm on a ruler, as wide as a sheet of A4 paper, into a 1950s radio. Tap it again and a passing atom
//   bumps it back. A slider for how many atoms (one, a cloud, the Milky Way's 10^67): the radio's magic eye
//   and the sparks of flips grow from nothing to bright;
// - write to aliens: a big copy of the Pioneer plaque, gold. Tap the hydrogen symbol (one unit lights:
//   21 cm and 0.7 ns), the woman (eight units stack beside her: 168 cm), the star of lines (14 pulsars and
//   the line to the Galaxy's centre light up, blinking), the planets (the probe's path from the third planet
//   past Jupiter). A measuring post in hydrogen units, true size: a slider for your height, a tap to measure
//   it in units and in binary, as the plaque writes the woman's.
// All three are shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<station>.tap(thing) does what a tap does, for the probes; parts.rayTo(p) aims a real tap.
//
// Facts (checked 2026-10-31): 1420.405751768 MHz, 21.106 cm (Wikipedia "Hydrogen line"); mean lifetime of
// the upper level about 11 million years (A = 2.876e-15 /s). Van de Hulst predicted it in 1944; Ewen and
// Purcell detected it at Harvard on 25 March 1951, Muller and Oort (Kootwijk) and Christiansen and Hindman
// (Australia) confirmed it, the papers out together in September 1951. Dwingeloo: 25 m dish, 3.25 m deep,
// hung from a "beak-shaped" steel truss 15 m high on a square base 11.70 m a side that holds the turning
// control house (always behind the reflector), the whole on four wheels on a circular rail, at most 30 m
// high, 120 t; opened by Queen Juliana on 17 April 1956, then the largest radio telescope in the world (the
// Rijksmonument register, no. 530829; Wikipedia: overtaken by Jodrell Bank's 76 m in 1957). The first maps
// of the spiral arms: Oort, Kerr and Westerhout, 1958, from the Leiden and Sydney surveys, with blank wedges
// toward the centre and the anticentre and nearly circular arms (later work: arms of larger pitch). The
// Galactic plane from 52.8° N: longitudes from about 255° to 350° never rise (computed here). Pioneer plaque
// (Wikipedia "Pioneer plaque"): Carl Sagan and Frank Drake, drawn by Linda Salzman Sagan; gold-anodised
// aluminium, about 229 by 152 mm; the hyperfine symbol's stroke is binary 1, the unit of length 21 cm and
// of time 0.7 ns; the woman beside binary 1000 (8 units, about 168 cm); 15 lines, 14 to pulsars with their
// periods in binary and one to the Galactic centre; the Sun and planets with binary distances (tenths of
// Mercury's), the path from the third planet past Jupiter; Pioneer 10 launched 2 March 1972, Pioneer 11 on
// 5 April 1973 (local time; 3 March and 6 April in UTC). The plaque here is drawn after the real one,
// simplified: its pulsar lines and binary numbers are not the real values.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill } from '../../../wings/noble/kit.js'
import { heathStage, galToEq } from '../../stages/heath.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { RADIO_WORDS } from './radio.words.js'

export const WORDS = RADIO_WORDS

const TAU = Math.PI * 2
const DEG = Math.PI / 180
const UP = new THREE.Vector3(0, 1, 0)
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }
const clock = () => performance.now() / 1000
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const wrapPi = a => Math.atan2(Math.sin(a), Math.cos(a))

// ---- the hydrogen line ----
const F0 = 1420.405751768 // MHz
const LAMBDA = 0.21106 // m
const A10 = 2.876e-15 // per second: one atom's chance to flip (the mean wait, 1/A, is 11 million years)
const YEAR = 3.156e7
const LIFE_YR = 1 / A10 / YEAR // about 1.1e7
const C_KMS = 299792.458
const LAT = 52.81 // Dwingeloo

// ---- the galaxy model (kpc, km/s) ----
const R0 = 8.2
const V0 = 230
const PITCH = 12 * DEG
const TANP = Math.tan(PITCH)
const A0 = 7.1 // where the Sagittarius-Carina arm crosses the line from the centre through the Sun
const PER = (TAU * TANP) / 4 // four arms, in the logarithmic phase
const hash2 = (i, j) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise2(x, y) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const a = hash2(i, j) + (hash2(i + 1, j) - hash2(i, j)) * u
  const b = hash2(i, j + 1) + (hash2(i + 1, j + 1) - hash2(i, j + 1)) * u
  return a + (b - a) * v
}
const smoothK = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
/** Atomic hydrogen at (X, Y): the map's frame, the centre at 0, the Sun at (0, -R0), seen from the north
 *  (the Galaxy turning clockwise). Trailing arms, the Local arm just outside the Sun, a hole in the middle. */
function density(X, Y) {
  const R = Math.hypot(X, Y)
  if (R < 0.3) return 0
  const beta = -(Math.atan2(Y, X) + Math.PI / 2) // round the centre from the Sun, in the direction of rotation
  const ph = Math.log(R / A0) + beta * TANP
  const d = ph - PER * Math.round(ph / PER)
  const w = 0.26 + 0.02 * R
  const arms = Math.exp(-((R * d * Math.cos(PITCH)) ** 2) / (2 * w * w))
  const bw = wrapPi(beta)
  const RL = 8.55 * Math.exp(-bw * TANP)
  const local = Math.exp(-((R - RL) ** 2) / (2 * 0.22 * 0.22)) * Math.exp(-((bw - 0.08) ** 2) / (2 * 0.22 * 0.22))
  const env = smoothK(2.8, 4.3, R) * (1 - smoothK(14, 20, R))
  return env * (0.07 + arms + 0.7 * local)
}
/** A cloud's speed toward (-) or away from (+) us, km/s, for a flat rotation. */
const speedAt = (s, l) => {
  const X = -s * Math.sin(l)
  const Y = -R0 + s * Math.cos(l)
  const R = Math.hypot(X, Y)
  return R < 0.3 ? 0 : V0 * (R0 / R - 1) * Math.sin(l)
}

// the line profiles (brightness against speed) for every 2° of longitude, and the clouds each puts on the map
const VMIN = -200
const VMAX = 200
const DV = 2.5
const NB = Math.round((VMAX - VMIN) / DV) + 1
const SIG = 7
const LSTEP = 2
const NL = 360 / LSTEP
const WEDGE = 12 * DEG // speeds give no distances within this of the centre and the anticentre
const PROFILES = []
const DOTS = []
{
  let max = 0
  for (let k = 0; k < NL; k++) {
    const l = k * LSTEP * DEG
    const sl = Math.sin(l)
    const cl = Math.cos(l)
    const T = new Float32Array(NB)
    for (let s = 0.02; s < 26; s += 0.05) {
      const X = -s * sl
      const Y = -R0 + s * cl
      const n = density(X, Y)
      if (n < 0.01) continue
      const v = speedAt(s, l)
      const i0 = Math.max(0, Math.floor((v - 3 * SIG - VMIN) / DV))
      const i1 = Math.min(NB - 1, Math.ceil((v + 3 * SIG - VMIN) / DV))
      for (let i = i0; i <= i1; i++) {
        const dv = VMIN + i * DV - v
        T[i] += n * 0.05 * Math.exp(-(dv * dv) / (2 * SIG * SIG))
      }
    }
    for (const t of T) max = Math.max(max, t)
    PROFILES.push(T)
    // the clouds: where the gas is, along this line, unless speeds cannot place it
    const dots = []
    if (Math.abs(sl) >= Math.sin(WEDGE)) {
      const rnd = random(k * 97 + 5)
      for (let s = 0.45; s < 24; s += 0.15) {
        const X = -s * sl + (rnd() - 0.5) * 0.12
        const Y = -R0 + s * cl + (rnd() - 0.5) * 0.12
        const n = density(X, Y)
        if (n < 0.25) continue
        const clump = 0.45 + 0.75 * noise2(X * 1.7 + 30, Y * 1.7 + 30)
        dots.push(X, Y, Math.min(1, n) * clump, 0.11 + s * 0.012)
      }
    }
    DOTS.push(new Float32Array(dots))
  }
  for (const T of PROFILES) for (let i = 0; i < NB; i++) T[i] /= max
}
const profileAt = lDeg => PROFILES[((Math.round(lDeg / LSTEP) % NL) + NL) % NL]

// the six stretches Dwingeloo listens along, and the part that never rises there
const STRETCHES = [[10, 50], [50, 90], [90, 130], [130, 170], [170, 210], [210, 250]]
const SOUTH = [252, 348]
const DUTCH = [10, 250]
// a galactic point's altitude at Dwingeloo for a sidereal time (radians)
const PHI = LAT * DEG
function altOf(lDeg, lst) {
  const p = galToEq(lDeg * DEG, 0)
  const ra = Math.atan2(p[1], p[0])
  const dec = Math.asin(p[2])
  return Math.asin(Math.sin(PHI) * Math.sin(dec) + Math.cos(PHI) * Math.cos(dec) * Math.cos(lst - ra))
}
// each stretch's sidereal time: when it is all well up (its lowest point highest), not too near the zenith
const LSTS = STRETCHES.map(([a, b]) => {
  let best = null
  for (let L = 0; L < 360; L += 2) {
    const lst = L * DEG
    let mn = 9
    let mx = -9
    for (let l = a; l <= b; l += 4) {
      const h = altOf(l, lst)
      mn = Math.min(mn, h)
      mx = Math.max(mx, h)
    }
    const score = mn - (mx > 78 * DEG ? (mx - 78 * DEG) * 2 : 0)
    if (!best || score > best.score) best = { score, lst }
  }
  return best.lst
})
const stretchOf = l => clamp(Math.floor((l - DUTCH[0]) / 40), 0, STRETCHES.length - 1)
const SWEEP = { turn: 1.8, scan: 6.0 }
const SWEEP_T = SWEEP.turn + SWEEP.scan
const SOUTH_T = 3.2

// ---- the flip ----
const WAVES = 6 // the wave train's length, in wavelengths
const sup = n => String(n).replace(/[0-9-]/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] ?? '⁻')
/** The wait for this flip (years): an exponential draw with the mean lifetime, the same in every copy. */
const waitFor = n => -Math.log(1 - random(n * 7919 + 13)() * 0.9999) * LIFE_YR
const waitShown = yr => clamp(0.9 + (2.2 * yr) / LIFE_YR, 0.9, 5.2) // seconds the counter runs
const FLIP_T = 0.6
const WAVE_T = 4.4
const BUMP_T = 1.4

// ---- the plaque ----
const PL = { w: 3.0, h: 2.0 }
const CW = 1536
const CH = 1024
const THINGS = ['h', 'woman', 'pulsars', 'planets']
const UNIT_PX = 60 // the woman's height on the plaque is 8 of these
const HUMAN = { manX: 1040, womanX: 1235, feet: 905, manH: 510, womanH: 8 * UNIT_PX }
// 14 pulsar lines (angle in degrees, length in px) and their binary ticks: drawn after the plaque, not its values
const PULSARS = [[18, 250], [40, 190], [62, 300], [95, 170], [118, 260], [140, 215], [158, 330], [176, 150], [200, 280], [222, 200], [245, 310], [268, 165], [300, 240], [330, 205]]
const SUNP = { x: 450, y: 560 }
const PLANETS = [[150, 30], [262, 7], [322, 10], [384, 10], [444, 8], [590, 22], [742, 19], [870, 14], [975, 14], [1062, 6]]

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const SPAWN = { x: 0, z: 6.6 }
  const BACK = { x: 0, z: 10.0 }
  const STAND = { x: -3.4, z: 3.0 }
  const HOST = { x: 3.6, z: 5.0 }
  const TEL = { x: 0, z: -36 }
  const MAPS = { x: 0, z: -8.2 }
  const ATOM = { x: 7.2, z: -2.4, rot: Math.atan2(-7.2, 5.4) }
  const PLAQ = { x: -7.2, z: -2.4, rot: Math.atan2(7.2, 5.4) }
  const stage = heathStage({
    radius: 13,
    light,
    pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1,
    lat: LAT,
    lst: LSTS[0],
    paths: [
      [[0, 10.6], [0, -6.8]],
      [[0, 2.2], [3.6, 0.1], [6.0, -0.9]],
      [[0, 2.2], [-3.6, 0.1], [-6.0, -0.9]],
    ],
    clearings: [[0, -7.6, 2.6], [ATOM.x - 0.6, ATOM.z + 0.9, 2.3], [PLAQ.x + 0.6, PLAQ.z + 0.9, 2.4], [0, 6.6, 1.5]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const tmpV = new THREE.Vector3()
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  /** A point of a station's own frame (x to the right, z toward the visitor) in the world. */
  const local = (S, x, y, z) => new THREE.Vector3(x, y, z).applyAxisAngle(UP, S.rot).add(new THREE.Vector3(S.x, 0, S.z))

  // ---- materials (few kinds, so the first visit compiles little) ----
  const steel = new THREE.MeshStandardMaterial({ color: '#8d99a6', roughness: 0.55, metalness: 0.45 })
  const darkSteel = new THREE.MeshStandardMaterial({ color: '#3d434c', roughness: 0.6, metalness: 0.5 })
  const concrete = new THREE.MeshStandardMaterial({ color: '#4d4f55', roughness: 0.95 })
  const panelMat = new THREE.MeshStandardMaterial({ color: '#8e9398', roughness: 0.85 })
  const warm = new THREE.MeshStandardMaterial({ color: '#ffd59a', emissive: '#ffb45a', emissiveIntensity: 1.25, roughness: 0.6 })
  const wood = new THREE.MeshStandardMaterial({ color: '#6b4c35', roughness: 0.8 })
  const edgeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, roughness: 0.4, metalness: 0.2 })
  const violet = new THREE.Color(color)
  const softDot = canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  textures.push(softDot)

  /** Thin straight beams between points [ax, ay, az, bx, by, bz], one instanced box each (r: half thickness). */
  function beams(segs, r, mat) {
    const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
    const m = new THREE.InstancedMesh(geo, mat, segs.length)
    const o = new THREE.Object3D()
    const a = new THREE.Vector3()
    const d = new THREE.Vector3()
    segs.forEach((s, i) => {
      a.set(s[0], s[1], s[2])
      d.set(s[3] - s[0], s[4] - s[1], s[5] - s[2])
      const len = d.length() || 0.001
      o.position.copy(a)
      o.quaternion.setFromUnitVectors(UP, d.normalize())
      o.scale.set(r * 2, len, r * 2)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
    })
    return m
  }
  /** A framed screen with a canvas face (w by h metres), facing +z. */
  function canvasScreen(w, h, pw, ph) {
    const canvas = document.createElement('canvas')
    canvas.width = pw
    canvas.height = ph
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures.push(tex)
    const group = new THREE.Group()
    const frame = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.06, 2, 0.025), edgeMat)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#d8d8d8', toneMapped: false }))
    face.position.z = 0.035
    group.add(frame, face)
    return { group, face, g: canvas.getContext('2d'), tex, canvas }
  }

  // ======== the telescope: Dwingeloo's 25 m dish at true size ========
  const tel = new THREE.Group()
  tel.position.set(TEL.x, 0, TEL.z)
  root.add(tel)
  {
    const ring = new THREE.Mesh(new THREE.RingGeometry(7.6, 9.3, 72), concrete)
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.03
    const rail = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.1, 6, 96), darkSteel)
    rail.rotation.x = Math.PI / 2
    rail.position.y = 0.12
    tel.add(ring, rail)
  }
  const yaw = new THREE.Group() // turns on the rail; the reflector faces -z when yaw is 0 (south)
  tel.add(yaw)
  const elev = new THREE.Group() // tips the dish up; its boresight is -z
  const AXIS_Y = 16.5
  elev.position.set(0, AXIS_Y, 0.4)
  yaw.add(elev)
  {
    // the base: a square steel frame, 11.70 m a side, on four wheeled bogies on the rail
    const B = 5.85
    const by = 1.1
    const base = [
      [-B, by, -B, B, by, -B], [B, by, -B, B, by, B], [B, by, B, -B, by, B], [-B, by, B, -B, by, -B],
      [-B, by, -B, B, by, B], [B, by, -B, -B, by, B],
    ]
    yaw.add(beams(base, 0.22, darkSteel))
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const bogie = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 0.9), darkSteel)
      bogie.position.set(sx * 6.0, 0.55, sz * 6.0)
      bogie.rotation.y = Math.atan2(sx, sz) + Math.PI / 2
      yaw.add(bogie)
    }
    // the control house in the base, behind the reflector: steel frame, fibre-concrete panels, a flat roof
    const house = new THREE.Mesh(new THREE.BoxGeometry(7.6, 3.0, 4.4), panelMat)
    house.position.set(0, by + 1.6, 3.4)
    yaw.add(house)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(7.9, 0.18, 4.7), darkSteel)
    roof.position.set(0, by + 3.15, 3.4)
    yaw.add(roof)
    // lit windows on its sides and back (the observers at work)
    const win = new THREE.PlaneGeometry(1.0, 0.75)
    const addWin = (x, y, z, ry) => {
      const m = new THREE.Mesh(win, warm)
      m.position.set(x, y, z)
      m.rotation.y = ry
      yaw.add(m)
    }
    for (const x of [-2.7, -0.9, 0.9, 2.7]) addWin(x, by + 1.9, 5.62, 0)
    for (const z of [2.3, 4.5]) {
      addWin(3.82, by + 1.9, z, Math.PI / 2)
      addWin(-3.82, by + 1.9, z, -Math.PI / 2)
    }
    // its stair from the heath
    const stair = []
    for (let i = 0; i < 6; i++) stair.push([-3.2 + i * 0.0, 0.18 * i + 0.1, 6.7 - i * 0.24, -1.8, 0.18 * i + 0.1, 6.7 - i * 0.24])
    yaw.add(beams(stair, 0.09, darkSteel))
    // the beak: a tapering truss from the base up to the elevation bearings
    const bottom = [[-5.2, by, -2.6], [5.2, by, -2.6], [5.2, by, 5.4], [-5.2, by, 5.4]]
    const top = [[-2.5, AXIS_Y - 0.3, -0.4], [2.5, AXIS_Y - 0.3, -0.4], [2.5, AXIS_Y - 0.3, 1.4], [-2.5, AXIS_Y - 0.3, 1.4]]
    const P = (i, f) => bottom[i].map((v, k) => lerp(v, top[i][k], f))
    const legs = []
    const braces = []
    for (let i = 0; i < 4; i++) legs.push([...bottom[i], ...top[i]])
    const LEVELS = [0.22, 0.45, 0.66, 0.85, 1]
    let prev = 0
    for (const f of LEVELS) {
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4
        braces.push([...P(i, f), ...P(j, f)])
        braces.push([...P(i, prev), ...P(j, f)])
      }
      prev = f
    }
    yaw.add(beams(legs, 0.24, steel), beams(braces, 0.09, steel))
    for (const s of [-1, 1]) {
      const bearing = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 1.3), darkSteel)
      bearing.position.set(s * 2.5, AXIS_Y, 0.4)
      yaw.add(bearing)
    }
  }
  // the dish: a paraboloid 25 m across and 3.25 m deep (focal length 12 m), its tinned steel mesh on ribs
  const RD = 12.5
  const FOC = (RD * RD) / (4 * 3.25)
  const VZ = -0.7 // the dish's vertex, in front of the elevation axis
  const zOf = r => VZ - (r * r) / (4 * FOC)
  {
    const prof = []
    for (let i = 0; i <= 16; i++) {
      const r = (RD * i) / 16
      prof.push(new THREE.Vector2(Math.max(0.001, r), (r * r) / (4 * FOC)))
    }
    const dishGeo = new THREE.LatheGeometry(prof, light ? 40 : 64)
    dishGeo.rotateX(-Math.PI / 2)
    dishGeo.translate(0, 0, VZ)
    const meshTex = canvasTex(256, 256, (g, w) => {
      g.fillStyle = '#b9c1c9'
      g.fillRect(0, 0, w, w)
      g.strokeStyle = 'rgba(70,78,88,0.55)'
      g.lineWidth = 3
      for (let i = 0; i <= 8; i++) {
        g.beginPath()
        g.moveTo((i * w) / 8, 0)
        g.lineTo((i * w) / 8, w)
        g.stroke()
        g.beginPath()
        g.moveTo(0, (i * w) / 8)
        g.lineTo(w, (i * w) / 8)
        g.stroke()
      }
    }, { repeat: true })
    meshTex.repeat.set(12, 4)
    textures.push(meshTex)
    const dishMat = new THREE.MeshStandardMaterial({ map: meshTex, color: '#c4ccd4', roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide })
    const dish = new THREE.Mesh(dishGeo, dishMat)
    elev.add(dish)
    // ribs behind the mesh (a truss deeper near the middle), hoops, the hub, the focus box on four legs
    const ribs = []
    const RIBS = light ? 16 : 24
    for (let k = 0; k < RIBS; k++) {
      const a = (k / RIBS) * TAU
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      const pts = []
      for (let i = 0; i <= 6; i++) {
        const r = 1.2 + ((RD - 1.2) * i) / 6
        const depth = lerp(1.3, 0.25, i / 6)
        pts.push([ca * r, sa * r, zOf(r) + 0.05, ca * r, sa * r, zOf(r) + depth])
      }
      for (let i = 0; i < pts.length; i++) {
        const [x, y, z, , , zb] = pts[i]
        ribs.push([x, y, z, x, y, zb])
        if (i) {
          const q = pts[i - 1]
          ribs.push([q[0], q[1], q[5], x, y, zb])
          ribs.push([q[0], q[1], q[2], x, y, zb])
        }
      }
    }
    for (const r of [4.5, 8.5, RD]) {
      const n = 48
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * TAU
        const a1 = ((i + 1) / n) * TAU
        ribs.push([Math.cos(a0) * r, Math.sin(a0) * r, zOf(r) + 0.15, Math.cos(a1) * r, Math.sin(a1) * r, zOf(r) + 0.15])
      }
    }
    elev.add(beams(ribs, 0.05, steel))
    const hub = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 1.8), darkSteel)
    hub.position.set(0, 0, 0.6)
    elev.add(hub)
    const legsF = []
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 4 + (k * Math.PI) / 2
      const r = RD - 0.6
      legsF.push([Math.cos(a) * r, Math.sin(a) * r, zOf(r), 0, 0, VZ - FOC + 0.5])
    }
    elev.add(beams(legsF, 0.1, steel))
    const focusBox = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 1.1), darkSteel)
    focusBox.position.set(0, 0, VZ - FOC + 0.2)
    elev.add(focusBox)
    // counterweights on two arms behind the hub
    const arms = [[-1.9, 0, 0.6, -1.9, -3.4, 2.4], [1.9, 0, 0.6, 1.9, -3.4, 2.4]]
    elev.add(beams(arms, 0.16, darkSteel))
    for (const s of [-1, 1]) {
      const wgt = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.5, 1.3), concrete)
      wgt.position.set(s * 1.9, -3.6, 2.5)
      elev.add(wgt)
    }
  }
  // a faint glow where the focus box listens (the picture's violet spark)
  const focusGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot, color: hdr2(color, 1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.0 }))
  focusGlow.scale.setScalar(3.2)
  focusGlow.position.set(0, 0, VZ - FOC + 0.2)
  elev.add(focusGlow)
  function hdr2(c, k) {
    return new THREE.Color(c).multiplyScalar(k)
  }

  // ---- where the dish points: azimuth (east of north) and altitude, eased toward the sky's point ----
  let azNow = Math.PI
  let altNow = 0.6
  const pointAt = (az, alt) => {
    // the reflector's -z faces south at yaw 0; azimuth A needs yaw = pi - A
    yaw.rotation.y = Math.PI - az
    elev.rotation.x = alt
  }
  pointAt(azNow, altNow)

  // ======== station 1: the receiver and the map ========
  const M = { n: 0, mask: 0, south: 0, cur: -1, l: 30, start: -99, sn: 0, sstart: -99 }
  let lstFrom = LSTS[0]
  let lstTo = LSTS[0]
  let lstNow = LSTS[0]
  let mapMine = false
  let mapSaid = { sweep: -1, south: -1 }
  const sweepAge = () => clock() - M.start
  const southAge = () => clock() - M.sstart
  const sweeping = () => M.cur >= 0 && sweepAge() < SWEEP_T
  const southing = () => M.south && southAge() < SOUTH_T
  const dutchDone = () => M.mask === (1 << STRETCHES.length) - 1
  // the sky's hour while the dish rests: the last sweep's, or the slider's stretch
  const homeLst = () => (M.cur >= 0 && M.l === STRETCHES[M.cur][1] ? LSTS[M.cur] : LSTS[stretchOf(M.l)])
  /** The longitude the dish is on now (degrees). */
  const lNow = () => {
    if (!sweeping()) return M.l
    const [a, b] = STRETCHES[M.cur]
    return lerp(a, b, clamp((sweepAge() - SWEEP.turn) / SWEEP.scan))
  }

  // the receiver: the 21 cm line it hears, a navy screen on a steel rack
  const RX = canvasScreen(2.3, 1.3, 1024, 580)
  RX.group.position.set(MAPS.x - 1.3, 1.82, MAPS.z)
  root.add(RX.group)
  {
    const rack = new THREE.Mesh(new RoundedBoxGeometry(2.4, 1.05, 0.62, 2, 0.04), darkSteel)
    rack.position.set(MAPS.x - 1.3, 0.53, MAPS.z - 0.1)
    root.add(rack)
    const knobGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 14).rotateX(Math.PI / 2)
    for (let i = 0; i < 6; i++) {
      const k = new THREE.Mesh(knobGeo, i % 2 ? steel : wood)
      k.position.set(MAPS.x - 2.15 + i * 0.32, 0.82, MAPS.z + 0.23)
      root.add(k)
    }
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), warm)
    lamp.position.set(MAPS.x - 0.3, 0.82, MAPS.z + 0.22)
    root.add(lamp)
    solids.push(box(MAPS.x - 1.3, MAPS.z - 0.1, 2.5, 0.8))
  }
  // the map board: the Milky Way seen from above its north pole, round, on a stand leaning back
  const MAP_PX = light ? 768 : 1024
  const MAP_KPC = 17.5
  const mapCanvas = document.createElement('canvas')
  mapCanvas.width = mapCanvas.height = MAP_PX
  const mapTex = new THREE.CanvasTexture(mapCanvas)
  mapTex.colorSpace = THREE.SRGBColorSpace
  mapTex.anisotropy = 4
  textures.push(mapTex)
  const MAPR = 0.98
  const mapBoard = new THREE.Group()
  mapBoard.position.set(MAPS.x + 1.35, 1.4, MAPS.z + 0.05)
  mapBoard.rotation.x = -0.42
  root.add(mapBoard)
  const mapFace = new THREE.Mesh(new THREE.CircleGeometry(MAPR, 72), new THREE.MeshBasicMaterial({ map: mapTex, color: '#dcdcdc', toneMapped: false }))
  mapFace.position.z = 0.03
  mapBoard.add(mapFace)
  {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(MAPR + 0.03, 0.035, 8, 72), edgeMat)
    rim.position.z = 0.03
    const back = new THREE.Mesh(new THREE.CylinderGeometry(MAPR + 0.04, MAPR + 0.04, 0.05, 72).rotateX(Math.PI / 2), darkSteel)
    mapBoard.add(rim, back)
    const leg = beams([[MAPS.x + 1.35, 0, MAPS.z - 0.45, MAPS.x + 1.35, 1.2, MAPS.z - 0.25], [MAPS.x + 0.85, 0, MAPS.z + 0.15, MAPS.x + 1.1, 0.95, MAPS.z + 0.25], [MAPS.x + 1.85, 0, MAPS.z + 0.15, MAPS.x + 1.6, 0.95, MAPS.z + 0.25]], 0.035, darkSteel)
    root.add(leg)
    solids.push(circle(MAPS.x + 1.35, MAPS.z, 0.85))
  }
  // the charts from Sydney: a roll on a little stand, its label above
  const sydney = new THREE.Group()
  sydney.position.set(MAPS.x + 3.0, 0, MAPS.z + 0.7)
  sydney.rotation.y = -0.5
  root.add(sydney)
  const SYD = { y: 0.95 }
  const chartRoll = new THREE.Group()
  chartRoll.position.y = SYD.y
  sydney.add(chartRoll)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, SYD.y - 0.05, 8).translate(0, (SYD.y - 0.05) / 2, 0), wood)
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.22), wood)
    cradle.position.y = SYD.y - 0.06
    sydney.add(post, cradle)
    const paper = new THREE.MeshStandardMaterial({ color: '#c9c0a8', roughness: 0.9 })
    for (const [x, r] of [[0, 0.075], [0.03, 0.06]]) {
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.6, 16).rotateZ(Math.PI / 2), paper)
      roll.position.set(x * 0.2, 0.04 + r * 0.5, x)
      chartRoll.add(roll)
    }
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16).rotateZ(Math.PI / 2), edgeMat)
    band.position.y = 0.075
    chartRoll.add(band)
    const tag = makeText(E.map.sydney, { size: 0.12, color: hdr2(color, 1.05), anchorY: 'bottom', outlineWidth: 0.008, outlineColor: '#0b0a18' })
    tag.position.set(0, 0.24, 0)
    chartRoll.add(tag)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.5), ghost)
    hit.position.y = 0.15
    chartRoll.add(hit)
    solids.push(circle(MAPS.x + 3.0, MAPS.z + 0.7, 0.3))
  }

  // ---- the map's drawing: a base (the disc, the Sun, the centre), the clouds, the dish's line ----
  const mk = MAP_PX / 2 / MAP_KPC
  const toMap = (X, Y) => [MAP_PX / 2 + X * mk, MAP_PX / 2 - Y * mk]
  const SUNXY = toMap(0, -R0)
  const baseCanvas = document.createElement('canvas')
  baseCanvas.width = baseCanvas.height = MAP_PX
  const dotsCanvas = document.createElement('canvas')
  dotsCanvas.width = dotsCanvas.height = MAP_PX
  const dotSprite = document.createElement('canvas')
  dotSprite.width = dotSprite.height = 32
  {
    const g = dotSprite.getContext('2d')
    const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16)
    grd.addColorStop(0, 'rgba(236,170,255,1)')
    grd.addColorStop(0.45, 'rgba(196,124,255,0.55)')
    grd.addColorStop(1, 'rgba(160,90,240,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 32, 32)
  }
  let baseLevel = null
  function drawBase(lv) {
    baseLevel = lv
    const g = baseCanvas.getContext('2d')
    const c = MAP_PX / 2
    g.clearRect(0, 0, MAP_PX, MAP_PX)
    const grd = g.createRadialGradient(c, c, 0, c, c, c)
    grd.addColorStop(0, '#1a1d48')
    grd.addColorStop(1, '#0b0e26')
    g.fillStyle = grd
    g.fillRect(0, 0, MAP_PX, MAP_PX)
    const s = MAP_PX / 1024
    if (lv === 'scientist') {
      // rings every 5 kpc round the centre
      g.strokeStyle = 'rgba(127,170,255,0.22)'
      g.lineWidth = 2 * s
      g.font = `600 ${22 * s}px Outfit`
      g.fillStyle = 'rgba(160,190,255,0.55)'
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      for (const r of [5, 10, 15]) {
        g.beginPath()
        g.arc(c, c, r * mk, 0, TAU)
        g.stroke()
        g.fillText(`${r} kpc`, c + r * mk * 0.71 + 6 * s, c - r * mk * 0.71)
      }
      // longitudes from the Sun
      // longitudes round the Sun, short ticks and their numbers a little way off
      g.font = `700 ${21 * s}px Outfit`
      g.fillStyle = 'rgba(255,215,140,0.7)'
      g.strokeStyle = 'rgba(255,215,140,0.45)'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      for (const L of [0, 90, 180, 270]) {
        const l = L * DEG
        const at2 = d => toMap(-d * Math.sin(l), -R0 + d * Math.cos(l))
        const [ax, ay] = at2(0.9)
        const [bx, by] = at2(1.6)
        g.beginPath()
        g.moveTo(ax, ay)
        g.lineTo(bx, by)
        g.stroke()
        const [x, y] = at2(2.5)
        g.fillText(`${L}°`, x, y)
      }
    }
    // the centre
    g.strokeStyle = 'rgba(255,230,190,0.85)'
    g.lineWidth = 3 * s
    g.beginPath()
    g.moveTo(c - 14 * s, c)
    g.lineTo(c + 14 * s, c)
    g.moveTo(c, c - 14 * s)
    g.lineTo(c, c + 14 * s)
    g.stroke()
    g.font = `700 ${26 * s}px Outfit`
    g.fillStyle = 'rgba(255,236,205,0.9)'
    g.textAlign = 'center'
    g.textBaseline = 'top'
    g.fillText(E.map.centre, c, c + 18 * s)
  }
  function drawSightline(g, k) {
    const d = DOTS[k]
    for (let i = 0; i < d.length; i += 4) {
      const [x, y] = toMap(d[i], d[i + 1])
      const r = d[i + 3] * mk * 1.6
      g.globalAlpha = clamp(d[i + 2] * 0.42)
      g.drawImage(dotSprite, x - r, y - r, r * 2, r * 2)
    }
    g.globalAlpha = 1
  }
  // which sightlines are on the map: whole stretches done, the sweep so far, the south as it unrolls
  const kOf = L => ((Math.round(L / LSTEP) % NL) + NL) % NL
  function shownSet() {
    const on = new Set()
    STRETCHES.forEach(([a, b], i) => {
      if (!(M.mask & (1 << i))) return
      let top = b
      if (i === M.cur && sweeping()) top = lNow()
      if (i === M.cur && sweeping() && sweepAge() < SWEEP.turn) return
      for (let L = a; L <= top + 1e-6 && L < b + (i === STRETCHES.length - 1 ? 1 : 0); L += LSTEP) on.add(kOf(L))
    })
    if (M.south) {
      const k = southing() ? clamp(southAge() / (SOUTH_T - 0.4)) : 1
      for (let L = SOUTH[0]; L <= lerp(SOUTH[0], SOUTH[1], k) + 1e-6; L += LSTEP) on.add(kOf(L))
    }
    return on
  }
  let drawn = new Set()
  function syncDots() {
    const want = shownSet()
    const g = dotsCanvas.getContext('2d')
    let changed = false
    for (const k of drawn) {
      if (!want.has(k)) {
        // something was taken off (cleared): draw it all again
        g.clearRect(0, 0, MAP_PX, MAP_PX)
        drawn = new Set()
        changed = true
        break
      }
    }
    g.globalCompositeOperation = 'lighter'
    for (const k of want) {
      if (drawn.has(k)) continue
      drawSightline(g, k)
      drawn.add(k)
      changed = true
    }
    g.globalCompositeOperation = 'source-over'
    return changed
  }
  let mapKey = ''
  function drawMap(lv, force = false) {
    if (lv !== baseLevel) drawBase(lv)
    const dotsChanged = syncDots()
    const L = lNow()
    const key = `${Math.round(L * 2)}|${M.south}|${lv}|${sweeping() ? 1 : 0}`
    if (!force && !dotsChanged && key === mapKey) return
    mapKey = key
    const g = mapCanvas.getContext('2d')
    const s = MAP_PX / 1024
    g.drawImage(baseCanvas, 0, 0)
    // the part that never rises over the Netherlands, shaded until Sydney's charts are in
    if (!M.south) {
      g.save()
      g.beginPath()
      g.moveTo(SUNXY[0], SUNXY[1])
      for (let L = SOUTH[0] - 2; L <= SOUTH[1] + 2; L += 4) {
        const l = L * DEG
        const [x, y] = toMap(-30 * Math.sin(l), -R0 + 30 * Math.cos(l))
        g.lineTo(x, y)
      }
      g.closePath()
      g.fillStyle = 'rgba(0,0,0,0.35)'
      g.fill()
      g.restore()
      g.save()
      const l = 300 * DEG
      const [tx, ty] = toMap(-7.5 * Math.sin(l), -R0 + 7.5 * Math.cos(l))
      g.translate(tx, ty)
      g.rotate(-0.55)
      g.font = `700 ${25 * s}px Outfit`
      g.fillStyle = 'rgba(200,190,255,0.6)'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      const words = E.map.never.split(' ')
      const half = Math.ceil(words.length / 2)
      g.fillText(words.slice(0, half).join(' '), 0, -15 * s)
      g.fillText(words.slice(half).join(' '), 0, 15 * s)
      g.restore()
    }
    g.drawImage(dotsCanvas, 0, 0)
    // the dish's line of sight, from the Sun
    const l = L * DEG
    const [ex2, ey2] = toMap(-26 * Math.sin(l), -R0 + 26 * Math.cos(l))
    const lg = g.createLinearGradient(SUNXY[0], SUNXY[1], ex2, ey2)
    lg.addColorStop(0, sweeping() ? 'rgba(255,214,120,0.95)' : 'rgba(255,214,120,0.6)')
    lg.addColorStop(1, 'rgba(255,214,120,0)')
    g.strokeStyle = lg
    g.lineWidth = 5 * s
    g.beginPath()
    g.moveTo(SUNXY[0], SUNXY[1])
    g.lineTo(ex2, ey2)
    g.stroke()
    // the Sun: a gold ring
    g.strokeStyle = '#ffd166'
    g.lineWidth = 6 * s
    g.beginPath()
    g.arc(SUNXY[0], SUNXY[1], 13 * s, 0, TAU)
    g.stroke()
    g.font = `800 ${28 * s}px Outfit`
    g.fillStyle = '#ffe2a0'
    g.textAlign = 'left'
    g.textBaseline = 'middle'
    g.fillText(at(E.map.sun, lv), SUNXY[0] + 22 * s, SUNXY[1] + 4 * s)
    mapTex.needsUpdate = true
  }

  // ---- the receiver's screen ----
  let rxKey = ''
  function drawReceiver(lv) {
    const L = lNow()
    const key = `${Math.round(L * 2)}|${lv}|${M.mask}|${M.south}|${sweeping() ? 1 : 0}`
    if (key === rxKey) return
    rxKey = key
    const g = RX.g
    const w = RX.canvas.width
    const h = RX.canvas.height
    const S = E.map.screen
    const sci = lv === 'scientist'
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#c9a8ff'
    g.font = '700 40px Outfit'
    g.textAlign = 'left'
    g.textBaseline = 'top'
    g.fillText(at(S.title, lv), 34, 22)
    g.font = '600 28px Outfit'
    g.fillStyle = '#ffd98a'
    g.textAlign = 'right'
    const part = sweeping() || (M.cur >= 0 && M.l === STRETCHES[M.cur][1]) ? M.cur : stretchOf(L)
    g.fillText(sci ? `l = ${nf(Math.round(L))}°   b = 0°` : fill(S.part, { n: nf(part + 1), of: nf(STRETCHES.length) }), w - 34, 30)
    // the plot
    const x0 = 70
    const x1 = w - 40
    const y0 = 110
    const y1 = sci ? 440 : 430
    const xOf = v => x0 + ((v - VMIN) / (VMAX - VMIN)) * (x1 - x0)
    g.strokeStyle = 'rgba(120,150,230,0.35)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(x0, y1)
    g.lineTo(x1, y1)
    g.moveTo(xOf(0), y0 - 4)
    g.lineTo(xOf(0), y1 + 8)
    g.stroke()
    // the receiver's gain follows the signal (as an observer turns it up for faint directions), within limits
    const T = profileAt(L)
    let peak = 0
    for (const v of T) peak = Math.max(peak, v)
    const gain = 0.9 / Math.max(0.22, peak)
    const kH = (y1 - y0) * 0.92
    g.beginPath()
    g.moveTo(x0, y1)
    for (let i = 0; i < NB; i++) g.lineTo(xOf(VMIN + i * DV), y1 - Math.min(1, T[i] * gain) * kH)
    g.lineTo(x1, y1)
    g.closePath()
    const fillG = g.createLinearGradient(0, y0, 0, y1)
    fillG.addColorStop(0, 'rgba(214,150,255,0.75)')
    fillG.addColorStop(1, 'rgba(120,70,220,0.15)')
    g.fillStyle = fillG
    g.fill()
    g.strokeStyle = '#efd6ff'
    g.lineWidth = 4
    g.beginPath()
    for (let i = 0; i < NB; i++) {
      const x = xOf(VMIN + i * DV)
      const y = y1 - Math.min(1, T[i] * gain) * kH
      if (i) g.lineTo(x, y)
      else g.moveTo(x, y)
    }
    g.stroke()
    // axes
    g.font = '600 26px Outfit'
    g.fillStyle = '#b8c6ff'
    g.textBaseline = 'top'
    if (sci) {
      g.textAlign = 'center'
      for (const v of [-200, -100, 0, 100, 200]) g.fillText(nf(v), xOf(v), y1 + 10)
      g.fillText(S.kms, xOf(150), y1 + 44)
      // the frequency above: the line's own 1420.406 MHz at rest
      g.fillStyle = 'rgba(255,214,138,0.8)'
      g.textBaseline = 'bottom'
      for (const f of [1420.5, 1420.0, 1419.5]) {
        const v = (1 - f / F0) * C_KMS
        g.fillText(nf(f, 1), xOf(v), y0 - 2)
      }
      g.textAlign = 'left'
      g.fillText('MHz', x0, y0 - 2)
      g.fillStyle = '#b8c6ff'
      g.textAlign = 'left'
      g.textBaseline = 'top'
      g.fillText(S.toward, x0, y1 + 44)
    } else {
      g.textAlign = 'left'
      g.fillText(S.toward, x0, y1 + 12)
      g.textAlign = 'right'
      g.fillText(S.away, x1, y1 + 12)
      g.textAlign = 'center'
      g.fillText(S.still, xOf(0), y1 + 50)
    }
    // the progress: which stretches are in
    g.textAlign = 'left'
    g.textBaseline = 'bottom'
    g.font = '600 26px Outfit'
    g.fillStyle = '#cfd8ff'
    const done = STRETCHES.filter((_, i) => M.mask & (1 << i)).length
    g.fillText(fill(S.done, { n: nf(done), of: nf(STRETCHES.length) }) + (M.south ? `  ·  ${S.south}` : ''), 34, h - 18)
    RX.tex.needsUpdate = true
  }

  const mapPanel = lv => ({
    title: E.map.title,
    color,
    blocks: [
      {
        slider: {
          label: E.map.slider,
          min: DUTCH[0],
          max: DUTCH[1],
          step: 1,
          value: Math.round(M.l),
          onInput: v => setL(v),
          format: v => `${nf(v)}°`,
          live: () => Math.round(lNow()),
        },
      },
      { buttons: [['sweep', 'dish'], ['south', 'sydney'], ['clear', 'clear']].map(([k, t]) => ({ label: E.map.buttons[k], onClick: () => mapStep(t) })) },
      ...paras(E.map.panel, lv),
    ],
  })
  const tellMap = key => mapMine && say(at(E.map.says[key], level()))
  function startSweep(k, age = 0) {
    lstFrom = lstNow
    lstTo = LSTS[k]
    // the Earth turns one way: forward to the stretch's time
    const d = ((lstTo - lstFrom) % TAU + TAU) % TAU
    lstTo = lstFrom + d
    M.cur = k
    M.start = clock() - age
    M.l = STRETCHES[k][1]
  }
  /** A tap on the dish, the charts or the panel's buttons: 'dish' | 'sydney' | 'clear'. */
  function mapStep(thing) {
    const lv = level()
    if (sweeping() || southing()) return say(at(W.busy, lv))
    if (thing === 'dish') {
      const next = STRETCHES.findIndex((_, i) => !(M.mask & (1 << i)))
      if (next < 0) return say(at(M.south ? E.map.says.complete : E.map.says.allDutch, lv))
      M.mask |= 1 << next
      M.n++
      mapMine = true
      startSweep(next)
      play('beam')
      say(at(next === 0 ? E.map.says.first : E.map.says.sweep, lv))
      ex.discover('map', mapPanel, SWEEP_T + 1.2)
      share('map')
    } else if (thing === 'sydney') {
      if (M.south) return say(at(E.map.says.southDone, lv))
      M.south = 1
      M.sn++
      M.sstart = clock()
      mapMine = true
      play('select')
      say(at(E.map.says.south, lv))
      ex.discover('map', mapPanel, SOUTH_T + 1.2)
      share('map')
    } else if (thing === 'clear') {
      M.mask = 0
      M.south = 0
      M.cur = -1
      mapMine = true
      play('tap')
      say(at(E.map.says.clear, lv))
      share('map')
    }
  }
  // the slider: point the dish anywhere along the Dutch half (the sky turns to that stretch's hour)
  let lSend = false
  function setL(v) {
    if (sweeping()) return
    M.l = clamp(Math.round(v), DUTCH[0], DUTCH[1])
    mapMine = true
    ex.discover('map', mapPanel, 2)
    if (lSend) return
    lSend = true
    later(0.25, () => {
      lSend = false
      share('map')
    })
  }
  ex.add({
    id: 'map',
    x: MAPS.x,
    z: MAPS.z + 2.9,
    radius: 2.2,
    manual: true,
    label: E.map.label,
    verb: () => {
      const h = E.map.hints
      if (sweeping() || southing()) return h.busy
      if (!dutchDone()) return h.sweep
      if (!M.south) return h.south
      return h.done
    },
    focus: focusOf(MAPS.x - 0.35, 1.45, MAPS.z, 2.9, 5.0),
    act: () => ctx.showPanel(mapPanel),
  })
  clickable(tel, () => mapStep('dish'), { reach: 80 })
  clickable(chartRoll, () => mapStep('sydney'), { reach: 6 })
  clickable(RX.group, () => say(at(E.map.says.screen, level())), { reach: 6 })
  clickable(mapBoard, () => say(at(M.mask || M.south ? E.map.says.map : E.map.says.mapEmpty, level())), { reach: 6 })

  // the sky and the dish, every frame
  const dirNow = new THREE.Vector3()
  updates.push((dt, t) => {
    const lv = level()
    // the sidereal time: turning to the stretch during a sweep, else easing to the slider's stretch
    if (sweeping()) {
      const a = sweepAge()
      lstNow = lerp(lstFrom, lstTo, span(0, SWEEP.turn, a))
    } else {
      lstNow += wrapPi(homeLst() - lstNow) * (1 - Math.exp(-2.2 * dt))
    }
    stage.sky.setLst(lstNow)
    // the dish follows its point on the Milky Way
    const L = lNow()
    stage.sky.galDir(L * DEG, 0, dirNow)
    const { alt, az } = stage.sky.altAz(dirNow)
    const k = 1 - Math.exp(-(sweeping() ? 5 : 2.5) * dt)
    azNow += wrapPi(az - azNow) * k
    altNow += (clamp(alt, 0.05, 1.5) - altNow) * k
    pointAt(azNow, altNow)
    focusGlow.material.opacity = sweeping() ? 0.55 + 0.25 * Math.sin(t * 9) : 0.18
    // the end of a sweep, told once by whoever made it
    if (M.cur >= 0 && !sweeping() && mapSaid.sweep !== M.n) {
      mapSaid.sweep = M.n
      if (mapMine && sweepAge() < SWEEP_T + 1) {
        const k2 = STRETCHES.filter((_, i) => M.mask & (1 << i)).length
        const [a, b] = STRETCHES[M.cur]
        const wedge = a <= 180 && b >= 180
        tellMap(dutchDone() ? (M.south ? 'complete' : 'allDutch') : wedge ? 'wedge' : k2 === 1 ? 'firstDone' : 'more')
        play('discover')
      }
    }
    if (M.south && !southing() && mapSaid.south !== M.sn) {
      mapSaid.south = M.sn
      if (mapMine && southAge() < SOUTH_T + 1) {
        tellMap(dutchDone() ? 'complete' : 'southIn')
        play('discover')
      }
    }
    // the chart roll bobs while it has something to give
    chartRoll.position.y = SYD.y + (M.south ? 0 : 0.03 + 0.03 * Math.sin(t * 2.4))
    chartRoll.rotation.x = southing() ? southAge() * 6 : 0
    drawMap(lv)
    drawReceiver(lv)
  })

  // ======== station 2: the spin flip ========
  const atomSt = new THREE.Group()
  atomSt.position.set(ATOM.x, 0, ATOM.z)
  atomSt.rotation.y = ATOM.rot
  root.add(atomSt)
  const AT = { x: -1.05, y: 1.75, z: -0.6 } // the atom's middle, in the station's frame
  const atom = new THREE.Group()
  atom.position.set(AT.x, AT.y, AT.z)
  atomSt.add(atom)
  // a soft glow round it, as in the picture's lens
  const atomGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot, color: hdr2('#7fb8ff', 0.5), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }))
  atomGlow.scale.setScalar(2.6)
  atom.add(atomGlow)
  /** A spin arrow (a shaft and a head), pointing up its local +y. */
  const arrowMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.7, roughness: 0.4 })
  function arrow(len, r) {
    const g = new THREE.Group()
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len * 0.7, 10), arrowMat)
    shaft.position.y = -len * 0.15
    const head = new THREE.Mesh(new THREE.ConeGeometry(r * 2.4, len * 0.3, 14), arrowMat)
    head.position.y = len * 0.35
    g.add(shaft, head)
    return g
  }
  const stripeTex = canvasTex(128, 64, (g, w, h) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, h)
    g.fillStyle = 'rgba(0,0,0,0.22)'
    for (let i = 0; i < 4; i++) g.fillRect((i * w) / 4, 0, w / 8, h)
  })
  textures.push(stripeTex)
  const protonMat = new THREE.MeshStandardMaterial({ color: '#e5484d', map: stripeTex, emissive: '#7a1416', emissiveIntensity: 0.5, roughness: 0.35 })
  const electronMat = new THREE.MeshStandardMaterial({ color: '#4fb6ff', map: stripeTex, emissive: '#1c6fb8', emissiveIntensity: 0.9, roughness: 0.3 })
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 20), protonMat)
  atom.add(proton)
  const pArrow = arrow(0.95, 0.03)
  atom.add(pArrow)
  const ORB = 0.85
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(ORB, 0.008, 6, 96), new THREE.MeshBasicMaterial({ color: '#9fd4ff', transparent: true, opacity: 0.55 }))
  orbit.rotation.x = Math.PI / 2 - 0.35
  atom.add(orbit)
  const eHolder = new THREE.Group() // goes round the orbit
  atom.add(eHolder)
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 18), electronMat)
  eHolder.add(electron)
  const eArrow = arrow(0.55, 0.02)
  eHolder.add(eArrow)
  const eGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot, color: hdr2('#7fd0ff', 1.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }))
  eGlow.scale.setScalar(0.7)
  eHolder.add(eGlow)
  const eHit = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 8), ghost)
  eHolder.add(eHit)
  const atomHit = new THREE.Mesh(new THREE.SphereGeometry(1.0, 14, 10), ghost)
  atom.add(atomHit)
  // a passing atom that bumps it back (only seen when it comes)
  const bumper = new THREE.Group()
  {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), protonMat)
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), electronMat)
    c.position.set(0.22, 0.05, 0)
    bumper.add(b, c)
  }
  bumper.visible = false
  atom.add(bumper)
  // labels: proton and electron (Scientist: their spins)
  const pLabel = makeText(E.flip.proton, { size: 0.1, color: '#ffc9c9', anchorX: 'center', anchorY: 'top', outlineWidth: 0.008, outlineColor: '#160a14' })
  pLabel.position.set(0, -0.6, 0.0)
  atom.add(pLabel)
  const eLabel = makeText(E.flip.electron, { size: 0.09, color: '#cfeaff', anchorX: 'left', anchorY: 'middle', outlineWidth: 0.008, outlineColor: '#0a1220' })
  eLabel.position.set(0.2, -0.05, 0)
  eHolder.add(eLabel)

  // the bench: the wave runs along it into the radio; a ruler and a sheet of A4 paper at true size
  const BENCH = { x0: -0.35, x1: 1.75, y: 0.86, z: 0.15 }
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(BENCH.x1 - BENCH.x0 + 0.1, 0.05, 0.62, 2, 0.015), wood)
    top.position.set((BENCH.x0 + BENCH.x1) / 2, BENCH.y - 0.025, BENCH.z)
    atomSt.add(top)
    for (const x of [BENCH.x0 + 0.08, BENCH.x1 - 0.06]) {
      for (const z of [BENCH.z - 0.24, BENCH.z + 0.24]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, BENCH.y - 0.05, 0.05), wood)
        leg.position.set(x, (BENCH.y - 0.05) / 2, z)
        atomSt.add(leg)
      }
    }
    const p = local(ATOM, (BENCH.x0 + BENCH.x1) / 2, 0, BENCH.z)
    solids.push(box(p.x, p.z, BENCH.x1 - BENCH.x0 + 0.3, 0.8, { rot: ATOM.rot }))
    const pa = local(ATOM, AT.x, 0, AT.z)
    solids.push(circle(pa.x, pa.z, 0.5))
  }
  // the ruler stands upright on the bench, its scale toward the visitor, just under the wave; behind the wave
  // a sheet of A4 paper stands on its short side (21.0 cm), framing one wavelength
  const RULER = { x: 0.5, z: BENCH.z + 0.1 }
  const WAVE_Y = BENCH.y + 0.19
  const ruler = new THREE.Group()
  ruler.position.set(RULER.x, WAVE_Y - 0.1, RULER.z)
  atomSt.add(ruler)
  const rulerTex = canvasTex(512, 96, (g, w, h) => {
    g.fillStyle = '#e8b84a'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#5a3a10'
    // centimetres along its 21.1 cm
    for (let i = 0; i <= 21; i++) {
      const x = 8 + (i / 21.106) * (w - 16)
      const long = i % 5 === 0
      g.fillRect(x - 1.5, 0, 3, long ? 44 : 26)
      if (long) {
        g.font = '700 30px Outfit'
        g.textAlign = 'center'
        g.textBaseline = 'top'
        g.fillText(String(i), x, 50)
      }
    }
  })
  textures.push(rulerTex)
  const rulerMat = new THREE.MeshStandardMaterial({ map: rulerTex, emissive: '#ffffff', emissiveMap: rulerTex, emissiveIntensity: 0.28, roughness: 0.45, metalness: 0.3 })
  {
    // the scale on its front face (+z is index 4)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(LAMBDA + 0.004, 0.04, 0.006), [0, 1, 2, 3, 4, 5].map(i => (i === 4 ? rulerMat : darkSteel)))
    bar.position.x = LAMBDA / 2
    ruler.add(bar)
    // two little feet hold it upright
    for (const x of [0.02, LAMBDA - 0.02]) {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.012, WAVE_Y - 0.1 - BENCH.y, 0.012), darkSteel)
      foot.position.set(x, -(WAVE_Y - 0.1 - BENCH.y) / 2, -0.004)
      ruler.add(foot)
    }
  }
  const rulerLabel = makeText(E.flip.ruler, { size: 0.045, color: '#ffe3a3', anchorX: 'left', anchorY: 'middle', outlineWidth: 0.004, outlineColor: '#1a1206' })
  rulerLabel.position.set(LAMBDA + 0.02, 0, 0.005)
  ruler.add(rulerLabel)
  const a4Tex = canvasTex(210, 297, (g, w, h) => {
    g.fillStyle = '#c9ccd3'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(120,140,170,0.35)'
    g.lineWidth = 2
    for (let y = 40; y < h - 10; y += 18) {
      g.beginPath()
      g.moveTo(14, y)
      g.lineTo(w - 14, y)
      g.stroke()
    }
    g.fillStyle = '#4a5468'
    g.font = '800 34px Outfit'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('A4', w / 2, h - 40)
  })
  textures.push(a4Tex)
  const a4 = new THREE.Group()
  a4.position.set(RULER.x + 0.105, BENCH.y + 0.1485 + 0.004, RULER.z - 0.12)
  a4.rotation.x = -0.1
  atomSt.add(a4)
  {
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.297), new THREE.MeshStandardMaterial({ map: a4Tex, roughness: 0.9 }))
    sheet.position.z = 0.006
    const backing = new THREE.Mesh(new THREE.BoxGeometry(0.226, 0.31, 0.01), wood)
    a4.add(sheet, backing)
  }
  const a4Label = makeText(E.flip.a4, { size: 0.042, color: '#e4e8f2', anchorX: 'center', anchorY: 'bottom', outlineWidth: 0.004, outlineColor: '#141826' })
  a4Label.position.set(0, 0.168, 0.01)
  a4.add(a4Label)
  const rulerHit = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.4, 0.3), ghost)
  rulerHit.position.set(RULER.x + 0.11, BENCH.y + 0.18, RULER.z - 0.05)
  atomSt.add(rulerHit)

  // the wave: a glowing line six wavelengths long, true size, running along the bench
  const WAVE_N = 220
  const wavePos = new Float32Array(WAVE_N * 3)
  const waveGeo = new THREE.BufferGeometry()
  waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePos, 3))
  const waveMat = new THREE.LineBasicMaterial({ color: hdr2(color, 2.2), transparent: true, opacity: 0 })
  const wave = new THREE.Line(waveGeo, waveMat)
  wave.frustumCulled = false
  wave.raycast = () => {}
  atomSt.add(wave)
  // a fat copy, so it reads from a few metres
  const waveTube = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: hdr2(color, 1.6), transparent: true, opacity: 0, depthWrite: false }))
  waveTube.raycast = () => {}
  atomSt.add(waveTube)
  const WAVE_AMP = 0.045
  const waveFrom = AT.x + 0.35
  const waveTo = BENCH.x1 - 0.32
  const waveRest = RULER.x // the ruler's start: at rest a crest stands here and the next on its end
  const REST_AHEAD = 3.2 // at rest the wave's head is this many wavelengths past the ruler's start
  /** The wave's head at x (station frame), drawn back from it; k: its brightness. */
  let waveShown = true
  function setWave(head, k) {
    if (k < 0.01) {
      if (waveShown) wave.visible = waveTube.visible = waveShown = false
      return
    }
    waveShown = true
    const len = WAVES * LAMBDA
    const pts = []
    for (let i = 0; i < WAVE_N; i++) {
      const u = i / (WAVE_N - 1)
      const x = head - len * (1 - u)
      // the train fades at its two ends; its crests travel with it, and at rest two of them stand on the
      // ruler's two ends (one wavelength apart)
      const env = Math.sin(Math.PI * u) ** 0.35
      const y = WAVE_Y + Math.cos(((x - head) / LAMBDA + REST_AHEAD) * TAU) * WAVE_AMP * env
      wavePos.set([x, y, RULER.z - 0.02], i * 3)
      pts.push(new THREE.Vector3(x, y, RULER.z - 0.02))
    }
    waveGeo.attributes.position.needsUpdate = true
    waveTube.geometry.dispose()
    waveTube.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.006, 5, false)
    waveMat.opacity = k
    waveTube.material.opacity = k * 0.9
    wave.visible = waveTube.visible = k > 0.01
  }
  setWave(waveFrom, 0)
  disposers.push(() => waveTube.geometry.dispose())

  // the radio: a 1950s wooden set with a magic eye that opens with the signal
  const radio = new THREE.Group()
  radio.position.set(BENCH.x1 - 0.2, BENCH.y, BENCH.z - 0.02)
  atomSt.add(radio)
  const eyeCanvas = document.createElement('canvas')
  eyeCanvas.width = eyeCanvas.height = 128
  const eyeTex = new THREE.CanvasTexture(eyeCanvas)
  eyeTex.colorSpace = THREE.SRGBColorSpace
  textures.push(eyeTex)
  const eyeMat = new THREE.MeshBasicMaterial({ map: eyeTex, toneMapped: false, color: '#ffffff' })
  {
    const cab = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.34, 0.26, 3, 0.03), wood)
    cab.position.y = 0.17
    radio.add(cab)
    const cloth = canvasTex(128, 64, (g, w, h) => {
      g.fillStyle = '#c9b48a'
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(80,60,30,0.35)'
      for (let i = 0; i < w; i += 4) {
        g.beginPath()
        g.moveTo(i, 0)
        g.lineTo(i, h)
        g.stroke()
      }
    })
    textures.push(cloth)
    const grille = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), new THREE.MeshStandardMaterial({ map: cloth, roughness: 1 }))
    grille.position.set(-0.05, 0.21, 0.131)
    radio.add(grille)
    const dial = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.05), new THREE.MeshStandardMaterial({ color: '#ffd59a', emissive: '#ffb45a', emissiveIntensity: 0.4, roughness: 0.6 }))
    dial.position.set(0, 0.07, 0.131)
    radio.add(dial)
    const eye = new THREE.Mesh(new THREE.CircleGeometry(0.045, 24), eyeMat)
    eye.position.set(0.17, 0.24, 0.132)
    radio.add(eye)
    for (const x of [-0.17, 0.17]) {
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12).rotateX(Math.PI / 2), darkSteel)
      knob.position.set(x, 0.07, 0.14)
      radio.add(knob)
    }
  }
  let eyeK = -1
  function drawEye(k) {
    if (Math.abs(k - eyeK) < 0.01) return
    eyeK = k
    const g = eyeCanvas.getContext('2d')
    g.fillStyle = '#081208'
    g.fillRect(0, 0, 128, 128)
    const grd = g.createRadialGradient(64, 64, 6, 64, 64, 62)
    grd.addColorStop(0, '#0c2a10')
    grd.addColorStop(0.3, `rgba(80,255,120,${0.35 + 0.65 * k})`)
    grd.addColorStop(1, `rgba(30,170,60,${0.3 + 0.5 * k})`)
    g.fillStyle = grd
    g.beginPath()
    g.arc(64, 64, 62, 0, TAU)
    g.fill()
    // the shadow wedge closes as the signal grows
    const open = lerp(1.6, 0.05, k)
    g.fillStyle = '#061006'
    g.beginPath()
    g.moveTo(64, 64)
    g.arc(64, 64, 63, -Math.PI / 2 - open / 2, -Math.PI / 2 + open / 2)
    g.closePath()
    g.fill()
    g.fillStyle = '#020502'
    g.beginPath()
    g.arc(64, 64, 12, 0, TAU)
    g.fill()
    eyeTex.needsUpdate = true
  }
  const radioLight = new THREE.PointLight('#7dff9a', 0, 3, 2)
  radioLight.position.set(0, 0.5, 0.9)
  radio.add(radioLight)
  const radioHit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.4), ghost)
  radioHit.position.y = 0.2
  radio.add(radioHit)

  // the sparks of many atoms flipping: nothing for one atom, a shimmer for a cloud, a blaze for a galaxy
  const SPARKS = light ? 160 : 420
  const sparkPos = new Float32Array(SPARKS * 3)
  const sparkSeed = new Float32Array(SPARKS)
  {
    const r = random(21)
    for (let i = 0; i < SPARKS; i++) {
      const a = r() * TAU
      const rr = 0.9 + Math.sqrt(r()) * 1.8
      sparkPos.set([AT.x + 0.6 + Math.cos(a) * rr * 1.1, 0.6 + r() * 2.8, AT.z - 1.0 - Math.abs(Math.sin(a)) * rr * 1.2], i * 3)
      sparkSeed[i] = r() * 100
    }
  }
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
  sparkGeo.setAttribute('aSeed', new THREE.BufferAttribute(sparkSeed, 1))
  const sparkMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uK: { value: 0 }, uMap: { value: softDot }, uColor: { value: hdr2(color, 1.4) }, uScale: { value: ctx.renderer?.getPixelRatio?.() ?? 1 } },
    vertexShader: /* glsl */ `
      attribute float aSeed; uniform float uTime; uniform float uK; uniform float uScale;
      varying float vA;
      void main() {
        // each spark blinks at its own moments; more of them blink, and faster, the more atoms there are
        float rate = mix(0.15, 3.0, uK);
        float ph = fract(uTime * rate * (0.6 + fract(aSeed) * 0.8) + aSeed);
        float on = step(fract(aSeed * 7.13), uK * 1.05);
        vA = on * smoothstep(0.0, 0.08, ph) * (1.0 - smoothstep(0.08, 0.5, ph));
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uScale * (9.0 + 9.0 * uK) / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform vec3 uColor; varying float vA;
      void main() { gl_FragColor = vec4(uColor, texture2D(uMap, gl_PointCoord).a * vA); }`,
  })
  const sparks = new THREE.Points(sparkGeo, sparkMat)
  sparks.frustumCulled = false
  sparks.raycast = () => {}
  atomSt.add(sparks)

  // the board behind: the wait, the spins, how many atoms and their flips
  const FB = canvasScreen(1.55, 0.86, 1024, 568)
  FB.group.position.set(1.15, 2.05, -0.95)
  FB.group.rotation.y = -0.22
  atomSt.add(FB.group)
  {
    const post = beams([[1.15, 0, -1.0, 1.15, 1.65, -1.0]], 0.035, darkSteel)
    atomSt.add(post)
    const p = local(ATOM, 1.15, 0, -1.0)
    solids.push(circle(p.x, p.z, 0.2))
  }

  const F = { n: 0, b: 0, up: 1, atoms: 0, kind: null, start: -99 }
  let flipMine = false
  let flipSaid = -1
  const fAge = () => clock() - F.start
  const flipDur = () => (F.kind === 'wait' ? waitShown(waitFor(F.n)) + FLIP_T + WAVE_T : F.kind === 'bump' ? BUMP_T : 0)
  const flipBusy = () => !!F.kind && fAge() < flipDur()
  /** A stretch of time (years) in words: millions or thousands of years, years, then days, hours, minutes,
   *  seconds (the words' own plurals). */
  const fmtYears = yr => {
    const T = E.flip.time
    if (yr >= 1e6) return T(yr / 1e6, nf(yr / 1e6, yr < 1e7 ? 1 : 0), 'Myr')
    if (yr >= 1e4) return T(Math.round(yr / 1e3), nf(Math.round(yr / 1e3)), 'kyr')
    if (yr >= 2) return T(Math.round(yr), nf(Math.round(yr)), 'yr')
    const sec = yr * YEAR
    for (const [unit, size] of [['d', 86400], ['h', 3600], ['min', 60]]) {
      if (sec >= 2 * size) return T(Math.round(sec / size), nf(Math.round(sec / size)), unit)
    }
    const v = Math.max(1, Math.round(sec))
    return T(v, nf(v), 's')
  }
  const flipPanel = lv => ({
    title: E.flip.title,
    color,
    blocks: [
      {
        slider: {
          label: E.flip.slider,
          min: 0,
          max: 67,
          step: 1,
          value: F.atoms,
          onInput: v => setAtoms(v),
          format: v => (v < 0.5 ? E.flip.oneAtom : `10${sup(Math.round(v))}`),
          live: () => F.atoms,
        },
      },
      { buttons: [['flip', 'electron'], ['one', 'one'], ['cloud', 'cloud'], ['galaxy', 'galaxy']].map(([k, t]) => ({ label: E.flip.buttons[k], onClick: () => (t === 'electron' ? flipStep() : setAtoms(t === 'one' ? 0 : t === 'cloud' ? 60 : 67, true)) })) },
      ...paras(E.flip.panel, lv),
    ],
  })
  function startFlip(kind, age = 0) {
    F.kind = kind
    F.start = clock() - age
  }
  /** A tap on the electron (or the atom): wait for the flip, or a bump back once it has flipped. */
  function flipStep() {
    const lv = level()
    if (flipBusy()) return say(at(W.busy, lv))
    flipMine = true
    if (F.up) {
      F.n++
      F.up = 0
      startFlip('wait')
      play('select')
      say(at(E.flip.says.wait, lv))
    } else {
      F.b++
      F.up = 1
      startFlip('bump')
      play('part')
      say(at(E.flip.says.bump, lv))
    }
    ex.discover('flip', flipPanel, F.kind === 'wait' ? flipDur() + 0.6 : BUMP_T + 0.8)
    share('flip')
  }
  let atomSend = false
  function setAtoms(v, now = false) {
    F.atoms = Math.round(clamp(v, 0, 67))
    flipMine = true
    ex.discover('flip', flipPanel, 2)
    if (now) {
      say(at(F.atoms >= 64 ? E.flip.says.galaxy : F.atoms >= 55 ? E.flip.says.cloud : E.flip.says.one, level()))
      share('flip')
      return
    }
    if (atomSend) return
    atomSend = true
    later(0.25, () => {
      atomSend = false
      share('flip')
    })
  }
  ex.add({
    id: 'flip',
    ...(() => {
      const p = local(ATOM, 0.25, 0, 2.2)
      return { x: p.x, z: p.z }
    })(),
    radius: 2.1,
    manual: true,
    label: E.flip.label,
    verb: () => {
      const h = E.flip.hints
      if (flipBusy()) return F.kind === 'wait' && fAge() < waitShown(waitFor(F.n)) ? h.waiting : h.watch
      return F.up ? h.flip : h.bump
    },
    focus: (() => {
      const p = local(ATOM, 0.25, 0, -0.45)
      return focusOf(p.x, 1.4, p.z, 3.1, 4.7)
    })(),
    act: () => ctx.showPanel(flipPanel),
  })
  clickable(eHolder, () => flipStep(), { reach: 6 })
  clickable(atom, () => flipStep(), { reach: 6 })
  clickable(rulerHit, () => say(at(E.flip.says.ruler, level())), { reach: 5 })
  clickable(radio, () => say(at(F.atoms >= 30 ? E.flip.says.radioLoud : E.flip.says.radioQuiet, level())), { reach: 5 })

  // the board's drawing
  let fbKey = ''
  function drawFlipBoard(lv, counter) {
    const key = `${lv}|${F.up}|${F.atoms}|${counter == null ? '-' : Math.floor(clock() * 15)}|${F.n}`
    if (key === fbKey) return
    fbKey = key
    const g = FB.g
    const w = FB.canvas.width
    const h = FB.canvas.height
    const B = E.flip.board
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'left'
    g.textBaseline = 'top'
    g.font = '700 40px Outfit'
    g.fillStyle = '#c9a8ff'
    g.fillText(at(F.up ? B.same : B.opposite, lv), 36, 28)
    // the wait: running, or the last one, or the mean
    g.font = '600 30px Outfit'
    g.fillStyle = '#b8c6ff'
    const last = F.n > 0 ? waitFor(F.n) : null
    const label = counter != null ? B.waiting : last != null ? B.waited : B.mean
    g.fillText(label, 36, 108)
    g.font = '800 64px Outfit'
    g.fillStyle = '#ffe2a0'
    g.fillText(fmtYears(counter != null ? Math.max(2, counter) : last != null ? last : LIFE_YR), 36, 150)
    // how many atoms and how often they flip
    g.font = '600 30px Outfit'
    g.fillStyle = '#b8c6ff'
    g.fillText(B.atoms, 36, 262)
    const big = (mant, exp, x, y, size, col) => {
      g.font = `800 ${size}px Outfit`
      g.fillStyle = col
      let s = mant
      g.fillText(s, x, y)
      let xx = x + g.measureText(s).width
      if (exp != null) {
        g.font = `800 ${size * 0.6}px Outfit`
        g.fillText(String(exp), xx + 2, y - size * 0.18)
        xx += g.measureText(String(exp)).width + 6
      }
      return xx
    }
    const N = F.atoms
    let xx = N === 0 ? big(B.one, null, 36, 300, 52, '#efd6ff') : big('10', N, 36, 300, 52, '#efd6ff')
    const name = N >= 64 ? B.galaxy : N >= 55 ? B.cloud : null
    if (name) {
      g.font = '600 30px Outfit'
      g.fillStyle = '#d6c6ff'
      g.fillText(`  ${name}`, xx, 316)
    }
    // flips: for one atom, one about every 11 million years; for many, three quarters ready at any time
    g.font = '600 30px Outfit'
    g.fillStyle = '#b8c6ff'
    g.fillText(B.flips, 36, 392)
    const rate = N === 0 ? A10 : 0.75 * A10 * 10 ** N
    if (rate < 0.5) {
      const every = 1 / rate / YEAR
      g.font = '800 46px Outfit'
      g.fillStyle = '#9fe6b0'
      g.fillText(fill(B.every, { t: fmtYears(every) }), 36, 432)
    } else {
      const e = Math.floor(Math.log10(rate))
      const m = rate / 10 ** e
      const s = e < 4 ? nf(Math.max(1, Math.round(rate))) : `${nf(m, 1)} × 10`
      xx = big(s, e < 4 ? null : e, 36, 432, 50, '#9fe6b0')
      g.font = '600 30px Outfit'
      g.fillStyle = '#9fe6b0'
      g.fillText(`  ${B.perSecond}`, xx, 446)
    }
    FB.tex.needsUpdate = true
  }

  let flipT = 0
  updates.push((dt, t) => {
    const lv = level()
    // the electron goes round; the proton turns about its own arrow, like a top
    flipT += dt
    const a = flipT * 0.55
    eHolder.position.set(Math.cos(a) * ORB, Math.sin(a) * ORB * Math.sin(0.35), Math.sin(a) * ORB * Math.cos(0.35))
    proton.rotation.y += dt * 2.2
    electron.rotation.y += dt * 3.0
    // the spins: the proton's always up; the electron's up (the same way) or down (opposite)
    let eFlip = F.up ? 0 : 1 // 0 arrow up, 1 down
    let counter = null
    let waveHead = waveFrom
    let waveK = 0
    bumper.visible = false
    if (F.kind && fAge() < flipDur() + 0.01) {
      const age = fAge()
      if (F.kind === 'wait') {
        const yr = waitFor(F.n)
        const tw = waitShown(yr)
        if (age < tw) {
          counter = yr * (age / tw) ** 1.4
          eFlip = 0
          electronMat.emissiveIntensity = 0.9 + 0.3 * Math.sin(age * 12)
        } else {
          const f = span(tw, tw + FLIP_T, age)
          eFlip = f
          electronMat.emissiveIntensity = 0.9 + 1.6 * Math.sin(Math.PI * f)
          // the wave: out of the atom, along the bench, a pause over the ruler, on into the radio
          const w0 = tw + FLIP_T * 0.6
          const u = age - w0
          if (u > 0) {
            const run1 = 1.3
            const hold = 1.6
            const run2 = WAVE_T - run1 - hold
            const rest = waveRest + LAMBDA * REST_AHEAD
            if (u < run1) waveHead = lerp(waveFrom, rest, ease(u / run1))
            else if (u < run1 + hold) waveHead = rest
            else waveHead = lerp(rest, waveTo + WAVES * LAMBDA, clamp((u - run1 - hold) / Math.max(0.5, run2)))
            waveK = Math.min(span(0, 0.25, u), 1 - span(WAVE_T - 0.6, WAVE_T - 0.1, u))
            // the ruler lights while the wave rests over it
            rulerMat.emissiveIntensity = 0.28 + 0.9 * (u > run1 - 0.2 && u < run1 + hold + 0.2 ? 1 : 0)
          }
          if (Math.abs(age - tw) < dt * 1.5 + 0.02 && flipSaid !== F.n * 2) {
            flipSaid = F.n * 2
            play('electron')
          }
        }
      } else if (F.kind === 'bump') {
        const k = clamp(age / BUMP_T)
        bumper.visible = k < 0.95
        // in from the side, a knock, away again
        const e = eHolder.position
        const from = new THREE.Vector3(e.x + 1.6, e.y + 0.6, e.z + 0.8)
        const away = new THREE.Vector3(e.x - 1.2, e.y + 1.4, e.z + 1.6)
        if (k < 0.45) bumper.position.lerpVectors(from, e, ease(k / 0.45))
        else bumper.position.lerpVectors(e, away, ease((k - 0.45) / 0.55))
        bumper.position.addScaledVector(new THREE.Vector3(0.18, 0.05, 0), 1)
        eFlip = 1 - span(0.42, 0.72, k)
      }
    } else {
      electronMat.emissiveIntensity = 0.9
      rulerMat.emissiveIntensity = 0.28
    }
    // the end of a flip, told once by whoever made it
    if (F.kind === 'wait' && fAge() >= flipDur() && flipSaid !== F.n * 2 + 1) {
      flipSaid = F.n * 2 + 1
      if (flipMine && fAge() < flipDur() + 1) say(fill(at(E.flip.says.flipped, lv), { t: fmtYears(waitFor(F.n)) }))
    }
    eArrow.rotation.z = Math.PI * eFlip
    setWave(waveHead, waveK)
    // the many atoms: the magic eye and the sparks
    const k = smoothK(22, 68, F.atoms)
    sparkMat.uniforms.uK.value = damp(sparkMat.uniforms.uK.value, k, 4, dt)
    sparkMat.uniforms.uTime.value = t
    const flash = waveK > 0 && waveHead > waveTo ? 0.5 : 0
    drawEye(clamp(sparkMat.uniforms.uK.value + flash))
    radioLight.intensity = (sparkMat.uniforms.uK.value + flash) * 1.4
    drawFlipBoard(lv, counter)
  })

  // ======== station 3: the Pioneer plaque, and a measuring post in hydrogen units ========
  const plaqSt = new THREE.Group()
  plaqSt.position.set(PLAQ.x, 0, PLAQ.z)
  plaqSt.rotation.y = PLAQ.rot
  root.add(plaqSt)
  const PQ = { x: -0.35, y: 1.65, z: -0.4, tilt: 0.1 }
  const plaqueTex = canvasTex(CW, CH, (g, w, h) => drawPlaque(g, w, h))
  textures.push(plaqueTex)
  const GW = light ? 768 : 1024
  const GH = Math.round((GW * CH) / CW)
  const glowCanvas = document.createElement('canvas')
  glowCanvas.width = GW
  glowCanvas.height = GH
  const glowTex = new THREE.CanvasTexture(glowCanvas)
  glowTex.colorSpace = THREE.SRGBColorSpace
  textures.push(glowTex)
  const plaque = new THREE.Group()
  plaque.position.set(PQ.x, PQ.y, PQ.z)
  plaque.rotation.x = -PQ.tilt
  plaqSt.add(plaque)
  const plaqueFace = new THREE.Mesh(
    new THREE.PlaneGeometry(PL.w, PL.h),
    new THREE.MeshStandardMaterial({ map: plaqueTex, emissive: '#ffffff', emissiveMap: plaqueTex, emissiveIntensity: 0.3, roughness: 0.7, metalness: 0.1 }),
  )
  plaqueFace.position.z = 0.032
  plaque.add(plaqueFace)
  const glowFace = new THREE.Mesh(new THREE.PlaneGeometry(PL.w, PL.h), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
  glowFace.position.z = 0.036
  glowFace.raycast = () => {}
  plaque.add(glowFace)
  {
    const back = new THREE.Mesh(new RoundedBoxGeometry(PL.w + 0.08, PL.h + 0.08, 0.06, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#b98b38', roughness: 0.45, metalness: 0.5, emissive: '#5a3c10', emissiveIntensity: 0.3 }))
    plaque.add(back)
    // the bolt holes in its corners, as on the real one
    for (const [x, y] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
      const hole = new THREE.Mesh(new THREE.CircleGeometry(0.03, 12), darkSteel)
      hole.position.set(x * (PL.w / 2 - 0.07), y * (PL.h / 2 - 0.07), 0.034)
      plaque.add(hole)
    }
    // two posts
    const posts = beams([[PQ.x - 1.1, 0, PQ.z - 0.12, PQ.x - 1.1, PQ.y - 0.4, PQ.z - 0.12], [PQ.x + 1.1, 0, PQ.z - 0.12, PQ.x + 1.1, PQ.y - 0.4, PQ.z - 0.12]], 0.05, darkSteel)
    plaqSt.add(posts)
    const p = local(PLAQ, PQ.x, 0, PQ.z)
    solids.push(box(p.x, p.z, PL.w + 0.3, 0.5, { rot: PLAQ.rot }))
    // a lamp on a pole lights it softly from the front (a metre and more away)
    // (on the plaque's left, out of the way of the post and of the station's view)
    const lampPole = beams([[PQ.x - 1.85, 0, 0.5, PQ.x - 1.85, 3.1, 0.5], [PQ.x - 1.85, 3.1, 0.5, PQ.x - 1.2, 3.25, 0.75]], 0.03, darkSteel)
    plaqSt.add(lampPole)
    const lampHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), warm)
    lampHead.position.set(PQ.x - 1.2, 3.2, 0.75)
    plaqSt.add(lampHead)
    const lamp = new THREE.PointLight('#ffd8a0', light ? 2.5 : 3.2, 7, 2)
    lamp.position.set(PQ.x + 0.6, 3.0, 1.4)
    plaqSt.add(lamp)
    const lp = local(PLAQ, PQ.x - 1.85, 0, 0.5)
    solids.push(circle(lp.x, lp.z, 0.12))
  }
  // the plaque's title under it
  const pTitle = makeText(E.plaque.caption, { size: 0.1, color: '#cdb27a', anchorX: 'center', anchorY: 'top', outlineWidth: 0.008, outlineColor: '#1a1206', maxWidth: PL.w })
  pTitle.position.set(PQ.x, PQ.y - PL.h / 2 - 0.1, PQ.z + 0.05)
  plaqSt.add(pTitle)

  /** The plaque's engraving, after the real one (simplified). */
  function drawPlaque(g, w, h) {
    const grd = g.createLinearGradient(0, 0, w, h)
    grd.addColorStop(0, '#c99437')
    grd.addColorStop(0.45, '#eac06a')
    grd.addColorStop(0.7, '#d8a64c')
    grd.addColorStop(1, '#b8822a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    // brushed metal
    const r = random(1972)
    for (let i = 0; i < 900; i++) {
      g.strokeStyle = `rgba(${r() < 0.5 ? '255,240,200' : '120,80,20'},${0.04 + r() * 0.05})`
      g.lineWidth = 1
      const y = r() * h
      g.beginPath()
      g.moveTo(r() * w, y)
      g.lineTo(r() * w, y + (r() - 0.5) * 6)
      g.stroke()
    }
    engrave(g, '#4a2e0a', 4)
  }
  /** Every line of the plaque's drawing, in one colour and width (the engraving, or a glow over a part). */
  function engrave(g, ink, lw, only = null, k = 1) {
    const sx = g.canvas.width / CW
    const sy = g.canvas.height / CH
    g.save()
    g.scale(sx, sy)
    g.strokeStyle = ink
    g.fillStyle = ink
    g.lineWidth = lw
    g.lineCap = 'round'
    g.lineJoin = 'round'
    const L = (pts, close = false) => {
      g.beginPath()
      pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
      if (close) g.closePath()
      g.stroke()
    }
    const C = (x, y, rr, fillIt = false) => {
      g.beginPath()
      g.arc(x, y, rr, 0, TAU)
      if (fillIt) g.fill()
      else g.stroke()
    }
    const want = id => !only || only === id
    // the hyperfine transition: two hydrogen atoms, spins parallel and antiparallel, and the binary 1
    if (want('h')) {
      for (const [x, up] of [[110, true], [270, false]]) {
        C(x, 128, 34)
        C(x, 128, 6, true)
        L([[x + 22, 128 - (up ? 20 : -20)], [x + 22, 128 + (up ? 20 : -20)]])
        L([[x + 22, 128 - (up ? 20 : -20)], [x + 16, 128 - (up ? 10 : -10)]])
        L([[x - 22, 108], [x - 22, 148]])
        L([[x - 22, 108], [x - 28, 118]])
      }
      L([[146, 128], [234, 128]])
      L([[190, 172], [190, 232]])
    }
    // the pulsar map: 14 lines to pulsars with binary ticks, and the long one to the Galaxy's centre
    if (want('pulsars')) {
      const n = only === 'pulsars' ? Math.round(PULSARS.length * k) : PULSARS.length
      PULSARS.slice(0, n).forEach(([a, len], i) => {
        const ang = -a * DEG
        const dx = Math.cos(ang)
        const dy = Math.sin(ang)
        L([[SUNP.x, SUNP.y], [SUNP.x + dx * len, SUNP.y + dy * len]])
        // ticks near its end: | for 1, a short dash for 0
        const bits = (i * 2654435761 >>> 0).toString(2).slice(0, 7 + (i % 4))
        for (let b = 0; b < bits.length; b++) {
          const d = len - 14 - b * 11
          const px = SUNP.x + dx * d
          const py = SUNP.y + dy * d
          if (bits[b] === '1') L([[px - dy * 9, py + dx * 9], [px + dy * 9, py - dx * 9]])
          else L([[px - dx * 3, py - dy * 3], [px + dx * 3, py + dy * 3]])
        }
      })
      if (only !== 'pulsars' || k > 0.98) L([[SUNP.x, SUNP.y], [1520, SUNP.y]])
    }
    // the spacecraft's outline behind the people (its dish seen from the front), at the same scale
    if (want('woman') && !only) {
      C(1135, 520, 380)
      L([[1135 - 380, 520], [1135 - 470, 560], [1135 - 470, 600]])
      L([[1135 + 380, 520], [1135 + 395, 535]])
      C(1135, 520, 70)
    }
    // the man (his right hand raised) and the woman
    if (want('woman')) {
      person(g, L, C, HUMAN.manX, HUMAN.feet, HUMAN.manH, true)
      person(g, L, C, HUMAN.womanX, HUMAN.feet, HUMAN.womanH, false)
      // the bracket beside her, and binary 8: | - - -
      const bx = HUMAN.womanX + 110
      const top = HUMAN.feet - HUMAN.womanH
      L([[bx - 14, top], [bx, top], [bx, HUMAN.feet], [bx - 14, HUMAN.feet]])
      const my = (top + HUMAN.feet) / 2
      L([[bx + 22, my - 52], [bx + 22, my - 30]])
      for (let i = 0; i < 3; i++) L([[bx + 16, my - 10 + i * 24], [bx + 28, my - 10 + i * 24]])
    }
    // the Sun and planets, binary distances above, the probe's path from the third planet past Jupiter
    if (want('planets')) {
      const py = 975
      PLANETS.forEach(([x, rr], i) => {
        C(x, py, rr, i === 0 || i === 3)
        if (i === 6) L([[x - rr * 1.9, py + 4], [x + rr * 1.9, py - 4]])
        if (i) {
          const bits = Math.max(1, Math.round(i * 2.3)).toString(2)
          for (let b = 0; b < bits.length; b++) {
            const tx = x - (bits.length - 1) * 5 + b * 10
            if (bits[b] === '1') L([[tx, py - rr - 22], [tx, py - rr - 10]])
            else L([[tx - 3, py - rr - 16], [tx + 3, py - rr - 16]])
          }
        }
      })
      const pathPts = []
      for (let i = 0; i <= 40; i++) {
        const u = i / 40
        const x = lerp(PLANETS[3][0], 1250, u)
        const y = py - 18 - Math.sin(Math.PI * Math.min(1, u * 1.8)) * 40 - u * u * 70 + (u > 0.25 && u < 0.4 ? Math.sin(((u - 0.25) / 0.15) * Math.PI) * 18 : 0)
        pathPts.push([x, y])
      }
      const upto = only === 'planets' ? Math.max(2, Math.round(pathPts.length * k)) : pathPts.length
      L(pathPts.slice(0, upto))
      const [hx, hy] = pathPts[upto - 1]
      // the probe, its antenna turned back toward the third planet
      C(hx, hy, 9)
      L([[hx - 9, hy], [hx - 22, hy + 6]])
    }
    g.restore()
  }
  /** A person as a simple outline, standing; `wave` raises the right hand (the viewer's left). */
  function person(g, L, C, x, feet, H, wave) {
    const u = H / 8
    const head = feet - H + u * 0.5
    C(x, head, u * 0.42)
    const sh = feet - H + u * 1.25
    const hip = feet - H + u * 4.0
    const sw = u * 0.95
    const hw = u * 0.62
    L([[x - u * 0.13, head + u * 0.42], [x - u * 0.15, sh - u * 0.15], [x - sw, sh], [x - sw * 0.92, hip - u * 0.4], [x - hw, hip], [x - hw * 0.9, feet - u * 0.1], [x - u * 0.12, feet], [x - u * 0.06, hip + u * 0.6], [x + u * 0.06, hip + u * 0.6], [x + u * 0.12, feet], [x + hw * 0.9, feet - u * 0.1], [x + hw, hip], [x + sw * 0.92, hip - u * 0.4], [x + sw, sh], [x + u * 0.15, sh - u * 0.15], [x + u * 0.13, head + u * 0.42]])
    // arms
    if (wave) L([[x - sw, sh + u * 0.1], [x - sw - u * 0.55, sh - u * 0.55], [x - sw - u * 0.45, sh - u * 1.25]])
    else L([[x - sw, sh + u * 0.1], [x - sw - u * 0.2, hip - u * 0.2], [x - sw - u * 0.1, hip + u * 0.45]])
    L([[x + sw, sh + u * 0.1], [x + sw + u * 0.2, hip - u * 0.2], [x + sw + u * 0.1, hip + u * 0.45]])
  }

  // the measuring post, true size: 21.1 cm marks with their binary numbers, your height, bars stacked
  const POST = { x: 1.95, z: -0.25 }
  const post = new THREE.Group()
  post.position.set(POST.x, 0, POST.z)
  plaqSt.add(post)
  {
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.35, 0.1), wood)
    pole.position.y = 2.35 / 2
    post.add(pole)
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 10 * LAMBDA, 0.012), new THREE.MeshStandardMaterial({ color: '#e8b84a', emissive: '#8a5a12', emissiveIntensity: 0.6, roughness: 0.4, metalness: 0.4 }))
    strip.position.set(0, (10 * LAMBDA) / 2, 0.056)
    post.add(strip)
    for (let i = 1; i <= 10; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.016), darkSteel)
      tick.position.set(-0.02, i * LAMBDA, 0.06)
      post.add(tick)
      const t = makeText(i.toString(2), { size: 0.055, color: '#d6bf8a', anchorX: 'right', anchorY: 'middle', outlineWidth: 0.005, outlineColor: '#1a1206' })
      t.position.set(-0.1, i * LAMBDA, 0.06)
      post.add(t)
    }
    const p = local(PLAQ, POST.x, 0, POST.z)
    solids.push(circle(p.x, p.z, 0.2))
  }
  const postHit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.4, 0.5), ghost)
  postHit.position.set(0.1, 1.2, 0.1)
  post.add(postHit)
  // the bars: one per 21.1 cm, stacked beside the post up to the height
  const barGeo = new THREE.BoxGeometry(0.1, LAMBDA - 0.012, 0.05)
  const barMat = new THREE.MeshBasicMaterial({ color: hdr2(color, 1.5), transparent: true, opacity: 0.85, toneMapped: false })
  const bars = []
  for (let i = 0; i < 10; i++) {
    const b = new THREE.Mesh(barGeo, barMat)
    b.position.set(0.16, i * LAMBDA + LAMBDA / 2, 0.02)
    b.visible = false
    post.add(b)
    bars.push(b)
  }
  const marker = new THREE.Group()
  {
    const tri = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 3).rotateZ(Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffd166', toneMapped: false }))
    tri.position.x = 0.32
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.008, 0.008), new THREE.MeshBasicMaterial({ color: '#ffd166', toneMapped: false }))
    line.position.x = 0.1
    marker.add(tri, line)
  }
  post.add(marker)
  // the reading and the post's name on its top, where they stay in view
  const heightText = makeText(' ', { size: 0.055, color: '#e8d6ab', anchorX: 'center', anchorY: 'bottom', outlineWidth: 0.005, outlineColor: '#1a1206', maxWidth: 0.9 })
  heightText.position.set(0, 2.42, 0.06)
  post.add(heightText)
  const postTitle = makeText(E.plaque.postTitle, { size: 0.06, color: '#cdb27a', anchorX: 'center', anchorY: 'bottom', outlineWidth: 0.005, outlineColor: '#1a1206', maxWidth: 0.9 })
  postTitle.position.set(0, 2.56, 0.06)
  post.add(postTitle)

  const P = { lit: 0, last: -1, n: 0, start: -99, cm: 140, m: 0, mstart: -99 }
  let plaqueMine = false
  const pAge = () => clock() - P.start
  const mAge = () => clock() - P.mstart
  const ANIM = { h: 1.2, woman: 3.4, pulsars: 3.6, planets: 3.0 }
  const pBusy = () => P.last >= 0 && pAge() < ANIM[THINGS[P.last]]
  const unitsOf = cm => cm / (LAMBDA * 100)
  const plaquePanel = lv => ({
    title: E.plaque.title,
    color,
    blocks: [
      {
        slider: {
          label: E.plaque.slider,
          min: 90,
          max: 200,
          step: 1,
          value: P.cm,
          onInput: v => setHeight(v),
          format: v => `${nf(v)} cm`,
          live: () => P.cm,
        },
      },
      { buttons: ['h', 'woman', 'pulsars', 'planets', 'post'].map(k => ({ label: E.plaque.buttons[k], onClick: () => plaqueStep(k) })) },
      ...paras(E.plaque.panel, lv),
    ],
  })
  const bin = cm => Math.max(1, Math.round(unitsOf(cm))).toString(2)
  /** A tap on a part of the plaque ('h' | 'woman' | 'pulsars' | 'planets') or on the post ('post'). */
  function plaqueStep(thing) {
    const lv = level()
    plaqueMine = true
    if (thing === 'post') {
      P.m++
      P.mstart = clock()
      play('select')
      say(fill(at(E.plaque.says.post, lv), { cm: nf(P.cm), u: nf(unitsOf(P.cm), 1), n: nf(Math.round(unitsOf(P.cm))), bin: bin(P.cm) }))
      ex.discover('plaque', plaquePanel, 2.4)
      share('plaque')
      return
    }
    const i = THINGS.indexOf(thing)
    if (i < 0) return
    if (pBusy()) return say(at(W.busy, lv))
    P.lit |= 1 << i
    P.last = i
    P.n++
    P.start = clock()
    play(thing === 'pulsars' ? 'beep' : 'select')
    say(at(E.plaque.says[thing], lv))
    ex.discover('plaque', plaquePanel, ANIM[thing] + 0.8)
    share('plaque')
  }
  let hSend = false
  function setHeight(v) {
    P.cm = Math.round(clamp(v, 90, 200))
    plaqueMine = true
    ex.discover('plaque', plaquePanel, 2)
    if (hSend) return
    hSend = true
    later(0.25, () => {
      hSend = false
      share('plaque')
    })
  }
  const nextThing = () => THINGS.findIndex((_, i) => !(P.lit & (1 << i)))
  ex.add({
    id: 'plaque',
    ...(() => {
      const p = local(PLAQ, 0.35, 0, 2.3)
      return { x: p.x, z: p.z }
    })(),
    radius: 2.2,
    manual: true,
    label: E.plaque.label,
    verb: () => {
      const h = E.plaque.hints
      if (pBusy()) return h.watch
      const i = nextThing()
      if (i >= 0) return h[THINGS[i]]
      return P.m ? h.again : h.post
    },
    focus: (() => {
      const p = local(PLAQ, 0.1, 0, -0.3)
      return focusOf(p.x, 1.45, p.z, 3.3, 5.0)
    })(),
    act: () => ctx.showPanel(plaquePanel),
  })
  // which part of the plaque a tap is on (u right, v up)
  const partAt = uv => {
    if (!uv) return null
    const x = uv.x * CW
    const y = (1 - uv.y) * CH
    if (x < 330 && y < 260) return 'h'
    if (y > 900 && x < 1300) return 'planets'
    if (x > 860) return 'woman'
    if (Math.hypot(x - SUNP.x, (y - SUNP.y) * 1.1) < 400) return 'pulsars'
    return null
  }
  clickable(plaqueFace, hit => {
    const part = partAt(hit.uv)
    if (part) plaqueStep(part)
    else say(at(E.plaque.says.where, level()))
  }, { reach: 7 })
  clickable(post, () => plaqueStep('post'), { reach: 6 })

  // the glow over the plaque's lit parts, and the post's bars
  let glowKey = ''
  updates.push((dt, t) => {
    const lv = level()
    const age = pAge()
    const animating = P.last >= 0 && age < ANIM[THINGS[P.last]] + 0.2
    const pulse = (P.lit & 4) && !light ? Math.floor(t * 3) : 0
    const key = `${P.lit}|${P.last}|${animating ? Math.floor(age * 20) : 'x'}|${pulse}`
    if (key !== glowKey) {
      glowKey = key
      const g = glowCanvas.getContext('2d')
      g.clearRect(0, 0, GW, GH)
      g.shadowColor = '#d9a2ff'
      g.shadowBlur = 18 * (GW / CW)
      THINGS.forEach((id, i) => {
        if (!(P.lit & (1 << i))) return
        const k = i === P.last && animating ? clamp(age / (ANIM[id] - 0.4)) : 1
        if (id === 'pulsars') {
          // the pulsars blink, each to its own beat
          engrave(g, `rgba(226,170,255,${0.55 + (i === P.last && animating ? 0.3 : 0.25 * Math.sin(t * 5))})`, 6, 'pulsars', k)
        } else if (id !== 'woman') engrave(g, 'rgba(226,170,255,0.9)', 6, id, k)
        else engrave(g, 'rgba(226,170,255,0.75)', 5, 'woman', 1)
        const sx = GW / CW
        const sy = GH / CH
        g.save()
        g.scale(sx, sy)
        g.font = '800 34px Outfit'
        g.fillStyle = '#f4e2ff'
        g.textBaseline = 'middle'
        if (id === 'h') {
          // one unit: 21 cm (and 0.7 ns)
          const len = UNIT_PX * 2.2
          g.fillStyle = `rgba(240,200,255,${k})`
          g.fillRect(130, 262, len * k, 14)
          g.fillText(at(E.plaque.unit, lv), 130 + len + 16, 270)
        }
        if (id === 'woman') {
          // eight units stack up beside her
          const bx = HUMAN.womanX + 150
          const n = i === P.last && animating ? Math.min(8, Math.floor(k * 8.99)) : 8
          for (let b = 0; b < n; b++) {
            g.fillStyle = 'rgba(236,190,255,0.9)'
            g.fillRect(bx, HUMAN.feet - (b + 1) * UNIT_PX + 4, 22, UNIT_PX - 8)
          }
          if (n >= 8) {
            g.textAlign = 'right'
            g.fillText(E.plaque.eight, CW - 24, HUMAN.feet - HUMAN.womanH - 34)
            g.textAlign = 'left'
          }
        }
        g.restore()
      })
      g.shadowBlur = 0
      glowTex.needsUpdate = true
    }
    // the post: the marker at the height, and bars stacking after a tap
    const hgt = P.cm / 100
    marker.position.y = damp(marker.position.y, hgt, 6, dt)
    const u = unitsOf(P.cm)
    const shown = P.m ? Math.min(u, mAge() / 0.3) : 0
    bars.forEach((b, i) => {
      const k = clamp(shown - i)
      b.visible = k > 0.01
      b.scale.y = Math.max(0.01, k)
      b.position.y = i * LAMBDA + (LAMBDA * k) / 2
    })
    const txt = fill(at(E.plaque.reading, lv), { cm: nf(P.cm), u: nf(u, 1), bin: bin(P.cm) })
    if (heightText.text !== txt) {
      heightText.text = txt
      heightText.sync()
    }
  })

  updates.push((dt, t) => stage.update(t))

  // ---- the probes' helpers ----
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = obj => obj.getWorldPosition(new THREE.Vector3())
  const plaquePoint = part => {
    const uv = { h: [190 / CW, 1 - 130 / CH], woman: [HUMAN.womanX / CW, 1 - 600 / CH], pulsars: [(SUNP.x + 120) / CW, 1 - (SUNP.y - 60) / CH], planets: [PLANETS[5][0] / CW, 1 - 975 / CH] }[part]
    plaque.updateMatrixWorld(true)
    return plaqueFace.localToWorld(new THREE.Vector3((uv[0] - 0.5) * PL.w, (uv[1] - 0.5) * PL.h, 0))
  }

  return {
    env: { ...stage.env },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.5 },
    cameraPitchMax: 0.75,
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z + 3) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - STAND.z) },
    parts: {
      map: {
        tap: (thing = 'dish') => mapStep(thing), // 'dish' | 'sydney' | 'clear'
        point: l => setL(l), // the panel's slider (degrees)
        get state() {
          return { n: M.n, mask: M.mask, south: M.south, cur: M.cur, l: Math.round(lNow()), sweeping: sweeping(), lst: Math.round((lstNow / DEG) % 360) }
        },
        // degrees between the dish's axis and its point on the Milky Way, and that point's altitude
        get aim() {
          const axis = new THREE.Vector3(0, 0, -1).applyQuaternion(elev.getWorldQuaternion(new THREE.Quaternion()))
          const want = stage.sky.galDir(lNow() * DEG, 0, new THREE.Vector3())
          return { off: Math.round((axis.angleTo(want) / DEG) * 10) / 10, alt: Math.round((Math.asin(want.y) / DEG) * 10) / 10 }
        },
        at: { dish: () => world(elev).add(new THREE.Vector3(0, 0, 0)), sydney: () => world(chartRoll), screen: () => world(RX.group), map: () => world(mapBoard) },
      },
      flip: {
        tap: () => flipStep(), // the electron
        atoms: v => setAtoms(v), // the panel's slider (log10 of the number of atoms)
        get state() {
          return { n: F.n, b: F.b, up: F.up, atoms: F.atoms, busy: flipBusy(), wait: F.n ? Math.round(waitFor(F.n)) : 0 }
        },
        at: { electron: () => world(electron), radio: () => world(radio).add(new THREE.Vector3(0, 0.2, 0)), ruler: () => world(ruler) },
      },
      plaque: {
        tap: thing => plaqueStep(thing), // 'h' | 'woman' | 'pulsars' | 'planets' | 'post'
        height: cm => setHeight(cm), // the panel's slider
        get state() {
          return { lit: P.lit, last: P.last, n: P.n, cm: P.cm, m: P.m, busy: pBusy() }
        },
        at: { h: () => plaquePoint('h'), woman: () => plaquePoint('woman'), pulsars: () => plaquePoint('pulsars'), planets: () => plaquePoint('planets'), post: () => world(post).add(new THREE.Vector3(0, 1.2, 0)) },
      },
      rayTo,
    },
    panels: { map: mapPanel, flip: flipPanel, plaque: plaquePanel },
    shared: {
      map: {
        get: () => ({ n: M.n, mask: M.mask, south: M.south, sn: M.sn, cur: M.cur, l: Math.round(M.l), age: Math.min(30, Math.round(Math.max(0, sweepAge()) * 10) / 10), sage: Math.min(30, Math.round(Math.max(0, southAge()) * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const sn = Math.max(0, Math.round(Number(s?.sn) || 0))
          const mask = Math.round(clamp(Number(s?.mask) || 0, 0, (1 << STRETCHES.length) - 1))
          const cur = Math.round(clamp(Number(s?.cur ?? -1), -1, STRETCHES.length - 1))
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          const sage = clamp((Number(s?.sage) || 0) + (Number(ago) || 0), 0, 60)
          mapMine = false
          M.mask = mask
          M.south = s?.south ? 1 : 0
          M.l = clamp(Math.round(Number(s?.l) || 30), DUTCH[0], DUTCH[1])
          if (cur >= 0 && (n !== M.n || !live) && age < SWEEP_T) {
            M.n = n
            startSweep(cur, age)
            if (!live) {
              lstFrom = lstNow = LSTS[cur]
              lstTo = lstNow
            }
            if (live) play('beam')
          } else {
            M.n = n
            M.cur = cur
            M.start = clock() - age
            if (!live) {
              lstNow = homeLst()
              stage.sky.setLst(lstNow)
            }
          }
          mapSaid.sweep = M.n
          if (sn !== M.sn || !live) {
            M.sn = sn
            M.sstart = clock() - (M.south ? sage : 99)
          }
          mapSaid.south = M.sn
          mapKey = ''
          rxKey = ''
        },
      },
      flip: {
        get: () => ({ n: F.n, b: F.b, up: F.up, atoms: F.atoms, kind: F.kind ?? '', age: Math.min(30, Math.round(Math.max(0, fAge()) * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const b = Math.max(0, Math.round(Number(s?.b) || 0))
          const kind = s?.kind === 'wait' || s?.kind === 'bump' ? s.kind : null
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          flipMine = false
          const changed = n !== F.n || b !== F.b
          F.n = n
          F.b = b
          F.up = s?.up ? 1 : 0
          F.atoms = Math.round(clamp(Number(s?.atoms) || 0, 0, 67))
          if (kind && (changed || !live)) startFlip(kind, age)
          else if (!kind) F.kind = null
          flipSaid = F.n * 2 + (kind === 'wait' && age < waitShown(waitFor(F.n)) ? 0 : 1)
          fbKey = ''
          if (live && changed) play(kind === 'bump' ? 'part' : 'select')
        },
      },
      plaque: {
        get: () => ({ lit: P.lit, last: P.last, n: P.n, cm: P.cm, m: P.m, age: Math.min(30, Math.round(Math.max(0, pAge()) * 10) / 10), mage: Math.min(30, Math.round(Math.max(0, mAge()) * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const m = Math.max(0, Math.round(Number(s?.m) || 0))
          plaqueMine = false
          P.lit = Math.round(clamp(Number(s?.lit) || 0, 0, 15))
          P.last = Math.round(clamp(Number(s?.last ?? -1), -1, 3))
          P.cm = Math.round(clamp(Number(s?.cm) || 140, 90, 200))
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          const mage = clamp((Number(s?.mage) || 0) + (Number(ago) || 0), 0, 60)
          if (n !== P.n || !live) {
            P.n = n
            P.start = clock() - age
            if (live && P.last >= 0) play('select')
          }
          if (m !== P.m || !live) {
            P.m = m
            P.mstart = clock() - mage
          }
          glowKey = ''
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const f of disposers) f()
    },
  }
}
