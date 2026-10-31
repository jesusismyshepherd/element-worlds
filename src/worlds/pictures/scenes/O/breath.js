// Oxygen's picture "Why do you breathe?" as a room (docs/knowledge/picture-rooms.md), and the studio's idea
// "Ride with a red blood cell": you are shrunk to the size of cells, in the warm fluid of the body
// (stages/body.js), and follow the oxygen you have just breathed in. The picture's three parts stand round you
// as glowing glass: an air sac of the lung on the left, the heart behind (its left side bright, its right side
// darker, drawn far smaller than it would be at this size), a muscle fibre on the right; the vessels join them
// in one circuit, bright red where the blood is full of oxygen and dark red where it comes back (never blue).
// The air wing's breathing exhibit (wings/oxygen/airBreath.js) ends at the breath; this room begins there.
// Each step is chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt
// passive); the prompt names the next tap; E opens the station's panel, whose buttons and sliders do the same:
// - the air sac: tap the airway (or the sac) to breathe in. Fresh air floods it (a red pair is O2, a blue
//   one N2, about four to one), the O2 slips through the thin wall into the red cells squeezing past in the
//   capillary round it, and they turn from dark to bright red. The sac's oxygen runs down (sped up) as the
//   blood takes it, faster the harder the muscle works, until you breathe again;
// - inside a red cell: tap a red cell in the capillary and the lens beside it shows its haemoglobin, four
//   seats each with an iron, filling as the cell passes the sac; the board beside it draws the saturation
//   curve (Severinghaus 1979), a slider (or a tap on the curve) for the oxygen around;
// - the ride: tap the big red cell in the vein and ride it (the camera rides along; the Atomling sits on it)
//   to the heart's left atrium, through the mitral valve into the left ventricle, out through the aortic
//   valve, over the aortic arch and down an artery to the muscle, a map of the body in the corner; you are
//   put down by the muscle as the oxygen hops off;
// - the working muscle: tap the fibre (or the effort slider) for rest, walking, running, sprinting: its
//   stripes pull faster, the board shows the oxygen used, heartbeats, breaths, blood pumped and how full the
//   blood leaves, the cells in its capillary leave darker, the heart beats faster, the air sac empties faster;
// - the power station: a mitochondrion in a lens. Tap it and the screen beside it shows oxygen's job slowly:
//   electrons from food along the chain, H+ pumped, O2 + 4 e− + 4 H+ → 2 H2O, the turbine making ATP. Tap
//   the sugar: it splits the quick way (2 ATP), then with oxygen the halves go into the mitochondrion (about
//   28 more); sprinting, there is not enough oxygen and they become lactate.
// All five are shared in a room (src/net/shared.js); words, panels, discoveries and the ride's view stay
// each one's. parts.<exhibit> does what a tap does, for the probes; parts.at.<thing>() gives a point to aim
// a real tap at (with parts.rayTo).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill } from '../../../wings/noble/kit.js'
import { bodyStage, softGlow } from '../../stages/body.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { tagOf } from '../../../../i18n/langs.js'
import { BREATH_WORDS } from './breath.words.js'

export const WORDS = BREATH_WORDS

const TAU = Math.PI * 2
const UP = new THREE.Vector3(0, 1, 0)
const V = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const FONT = 'Outfit, Nunito, sans-serif'

// ---- the science ----

/** Haemoglobin's saturation (0..1) at an oxygen partial pressure (mmHg): Severinghaus's fit (1979) of the
 *  standard curve (pH 7.4, 37 °C): about 98% at 100 mmHg, 75% at 40, 32% at 20, half at about 27. */
const satAt = p => (p <= 0 ? 0 : 1 / (23400 / (p * p * p + 150 * p) + 1))
function po2At(s) {
  let a = 0
  let b = 200
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2
    if (satAt(m) < s) a = m
    else b = m
  }
  return (a + b) / 2
}
const PO2 = { lung: 100, rest: 40, work: 20 }
const P50 = po2At(0.5)
const ART = 0.98 // how full the blood leaving the lungs is
// effort from rest (0) through walking and running to a sprint (1): whole-body numbers for a fit adult, kept
// in step by the Fick principle: O2 used = blood pumped × (0.98 − leaving) × about 200 mL of O2 per litre
const EFF = {
  o2: [0.25, 1.0, 2.5, 3.5], // L of O2 a minute
  hr: [70, 100, 150, 185], // heartbeats a minute
  br: [12, 20, 35, 50], // breaths a minute
  co: [5, 10, 20, 24], // L of blood a minute
  sv: [0.75, 0.5, 0.35, 0.25], // how full the blood leaving the muscle is
}
const LEVELS = ['rest', 'walk', 'run', 'sprint']
const effAt = (k, e) => {
  const t = clamp(e) * 3
  const i = Math.min(2, Math.floor(t))
  return lerp(EFF[k][i], EFF[k][i + 1], t - i)
}
const levelOf = e => LEVELS[Math.round(clamp(e) * 3)]
const QUICK = 0.85 // above this effort the oxygen falls short of the energy the muscle wants

// ---- where things are (metres; the spawn at z = 6.6 looks along -z, into the picture) ----
const SAC = { x: -6.6, y: 2.7, z: -2.4, r: 2.5 }
const NEIGHBOURS = [[-9.0, 4.5, -3.1, 1.25], [-4.35, 4.95, -3.55, 1.1], [-6.5, 5.6, -5.2, 1.3]]
const CAP_R = 0.24 // a capillary's radius
const CELL_D = 0.42 // a red cell in a capillary
const LENS1 = { x: -3.75, y: 2.3, z: -0.45, r: 0.82 }
const CURVE = { x: -2.15, y: 1.6, z: -0.95, w: 1.75, h: 1.2 }
const CAR_D = 1.2 // the red cell you ride
const START = V(-1.5, 1.32, -4.3)
const PARK = V(3.6, 1.3, -3.2)
const MAP = { x: 1.0, y: 1.45, z: -3.0, w: 0.95, h: 1.25 }
const HEART = { x: 0.8, y: 4.3, z: -8.0, s: 1.3, tilt: 0.32 }
const FIBRE = { x0: 4.4, x1: 14.5, y: 1.75, z: -5.9, r: 1.7, w0: 7.6, w1: 11.2, up: 1.1, down: -0.25 }
const LENS2 = { x: 4.9, y: 2.2, z: -2.35, r: 0.82 }
const CHAIN = { x: 7.05, y: 2.35, z: -2.6, w: 2.4, h: 1.4 }
// the muscle's board stands on top of the fibre, over its window, tilted toward the visitor
const BOARD = { x: 9.7, y: 4.4, z: -4.95, w: 2.3, h: 1.35, tilt: 0.3 }
const SUGAR = V(4.2, 1.25, -1.55)
const SPOT = { sac: [-5.6, 2.7], blood: [-2.9, 1.9], ride: [0.0, -0.6], mito: [6.0, 0.6], muscle: [10.0, 0.9] }
const ARRIVE = { x: 4.2, z: 0.3 }
// where the view watches the cell go through the heart: in front of it, a little to the side
const HEART_CAM = V(1.9, 4.0, -1.6)

// the ride: how long it parks at the muscle, giving its oxygen, before it fades
const PARK_T = 4.5
// the chain's screen: seconds a turn when featured (tapped)
const FEATURE_T = 9
// the sugar: its steps (seconds)
const SUGAR_T = 5.4

// ---- materials and pieces ----

/** Glowing glass for membranes, vessels and the heart: see-through in the middle, bright at the edges;
 *  bands of light can run along a tube (uv.x) to show the flow. */
function glassMat({ color, inside = null, alpha = 0.14, rim = 0.62, flow = 0, rep = 1 }) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: true,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uColor: { value: new THREE.Color(color) },
        uInside: { value: new THREE.Color(inside ?? color) },
        uAlpha: { value: alpha },
        uRim: { value: rim },
        uGlow: { value: 0 },
        uTime: { value: 0 },
        uFlow: { value: flow },
        uRep: { value: rep },
      },
    ]),
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform vec3 uInside; uniform float uAlpha; uniform float uRim; uniform float uGlow;
      uniform float uTime; uniform float uFlow; uniform float uRep;
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      #include <fog_pars_fragment>
      void main() {
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
        float band = uFlow > 0.0 ? pow(0.5 + 0.5 * sin((vUv.x * uRep - uTime * uFlow) * 6.2832), 8.0) : 0.0;
        vec3 c = gl_FrontFacing ? uColor : uInside;
        c *= 0.85 + 0.35 * band + 0.6 * uGlow;
        // from inside (a vessel ridden through) the far wall is fainter, so the way ahead shows
        float a = (gl_FrontFacing ? uAlpha + uRim * pow(f, 2.2) : 0.7 * uAlpha + 0.5 * uRim * pow(f, 3.0)) + 0.1 * band + 0.12 * uGlow;
        gl_FragColor = vec4(c, clamp(a, 0.0, 0.9));
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  })
}

/** A tube along a curve whose radius may change along it (r: metres, or a function of 0..1). */
function tubeAlong(curve, r, seg = 64, rad = 16) {
  const geo = new THREE.TubeGeometry(curve, seg, 1, rad, false)
  const pos = geo.attributes.position
  const c = new THREE.Vector3()
  const v = new THREE.Vector3()
  for (let i = 0; i <= seg; i++) {
    const u = i / seg
    curve.getPointAt(u, c)
    const k = typeof r === 'function' ? r(u) : r
    for (let j = 0; j <= rad; j++) {
      const idx = i * (rad + 1) + j
      v.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(k).add(c)
      pos.setXYZ(idx, v.x, v.y, v.z)
    }
  }
  return geo
}

/** A red blood cell: the biconcave disc (Evans and Fung, 1972), `d` across, its flat faces along y. */
function rbcGeometry(d, segs = 28) {
  const k = d / 7.82
  const half = x => 0.5 * Math.sqrt(Math.max(0, 1 - x * x)) * (0.81 + 7.83 * x * x - 4.39 * x ** 4) * k
  const pts = []
  const n = 14
  for (let i = 0; i <= n; i++) {
    const x = Math.sin(((i / n) * Math.PI) / 2)
    pts.push(new THREE.Vector2(Math.max(0.0001, (x * d) / 2), -half(x)))
  }
  for (let i = n - 1; i >= 0; i--) {
    const x = Math.sin(((i / n) * Math.PI) / 2)
    pts.push(new THREE.Vector2(Math.max(0.0001, (x * d) / 2), half(x)))
  }
  return new THREE.LatheGeometry(pts, segs)
}

/** A screen to draw on: a canvas on a dark board with a glowing edge, facing +z. */
function screenBoard(w, h, px, color) {
  const group = new THREE.Group()
  const tex = canvasTex(px, Math.round((px * h) / w), null, { mipmaps: false })
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#e6e6e6' }))
  face.position.z = 0.035
  const navy = new THREE.MeshStandardMaterial({ color: '#141a3e', roughness: 0.6 })
  const back = new THREE.Mesh(new RoundedBoxGeometry(w + 0.12, h + 0.12, 0.06, 2, 0.03), navy)
  const edge = new THREE.Mesh(new RoundedBoxGeometry(w + 0.18, h + 0.18, 0.04, 2, 0.04), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 }))
  edge.position.z = -0.01
  // a dark back, so the glowing frame shows only as a rim from behind
  const rear = new THREE.Mesh(new RoundedBoxGeometry(w + 0.16, h + 0.16, 0.03, 2, 0.03), navy)
  rear.position.z = -0.035
  group.add(edge, back, rear, face)
  return { group, face, tex, draw: fn => tex.userData.redraw(fn) }
}

/** A little capsule with a label (ATP). */
function capsuleTex(label, fill, ink) {
  return canvasTex(256, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    const r = h / 2 - 6
    g.fillStyle = fill
    g.strokeStyle = ink
    g.lineWidth = 6
    g.beginPath()
    g.moveTo(6 + r, 6)
    g.lineTo(w - 6 - r, 6)
    g.arc(w - 6 - r, h / 2, r, -Math.PI / 2, Math.PI / 2)
    g.lineTo(6 + r, h - 6)
    g.arc(6 + r, h / 2, r, Math.PI / 2, -Math.PI / 2)
    g.closePath()
    g.fill()
    g.stroke()
    g.fillStyle = ink
    g.font = `800 64px ${FONT}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(label, w / 2, h / 2 + 3)
  }, { mipmaps: false })
}

/** Chemistry on a canvas with real subscripts and charges: "2 H2O", "O2 + 4 e− + 4 H+". Returns the width. */
function chem(g, text, x, y, size, align = 'left', measureOnly = false) {
  const runs = []
  const s = String(text)
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    const prev = s[i - 1] ?? ' '
    const next = s[i + 1] ?? ' '
    const afterSymbol = /[A-Za-z)]/.test(prev) || (runs.length && runs[runs.length - 1].k === 'sub' && /\d/.test(prev))
    let k = 'main'
    if (/\d/.test(ch) && /[A-Za-z)]/.test(prev) && prev !== 'e') k = 'sub'
    else if (/\d/.test(ch) && runs.length && runs[runs.length - 1].k === 'sub') k = 'sub'
    else if ((ch === '+' || ch === '−') && afterSymbol && (next === ' ' || next === ',' || i === s.length - 1)) k = 'sup'
    const last = runs[runs.length - 1]
    if (last && last.k === k) last.t += ch
    else runs.push({ t: ch, k })
  }
  const font = k => `${k === 'main' ? 700 : 800} ${Math.round(k === 'main' ? size : size * 0.62)}px ${FONT}`
  let w = 0
  for (const r of runs) {
    g.font = font(r.k)
    r.w = g.measureText(r.t).width
    w += r.w
  }
  if (measureOnly) return w
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x
  g.textAlign = 'left'
  g.textBaseline = 'middle'
  for (const r of runs) {
    g.font = font(r.k)
    g.fillText(r.t, cx, y + (r.k === 'sub' ? size * 0.28 : r.k === 'sup' ? -size * 0.32 : 0))
    cx += r.w
  }
  return w
}

/** A line of text that shrinks until it fits `maxW`. */
function fitText(g, text, x, y, size, maxW, weight = 700, align = 'left') {
  let s = size
  g.font = `${weight} ${s}px ${FONT}`
  while (s > 12 && g.measureText(text).width > maxW) {
    s -= 1
    g.font = `${weight} ${s}px ${FONT}`
  }
  g.textAlign = align
  g.textBaseline = 'middle'
  g.fillText(text, x, y)
}

/** Wrapped text, shrinking until it fits `maxH` (returns nothing). */
function wrapText(g, text, x, y, size, maxW, maxH, weight = 700, align = 'left') {
  let s = size
  let lines
  for (;;) {
    g.font = `${weight} ${s}px ${FONT}`
    lines = []
    let line = ''
    for (const word of String(text).split(' ')) {
      const tryLine = line ? `${line} ${word}` : word
      if (g.measureText(tryLine).width > maxW && line) {
        lines.push(line)
        line = word
      } else line = tryLine
    }
    if (line) lines.push(line)
    if (lines.length * s * 1.18 <= maxH || s <= 14) break
    s -= 2
  }
  g.textAlign = align
  g.textBaseline = 'middle'
  const top = y - ((lines.length - 1) * s * 1.18) / 2
  lines.forEach((l, i) => g.fillText(l, x, top + i * s * 1.18))
}

// ---- the body map (the ride's corner map and the board by the big red cell) ----

// a person seen from the front in a 100 x 160 box (their left is on your right): the route of the ride
// from the left lung through the heart's left side, the aorta and an artery to the thigh of their left leg
const ROUTE = {
  vein: [[37, 50], [46, 52], [52, 47]],
  atrium: [[52, 47], [54, 48]],
  valve: [[54, 48], [55, 51]],
  ventricle: [[55, 51], [58, 57], [55, 54], [52, 46]],
  aorta: [[52, 46], [52, 38], [57, 36], [59, 44], [59, 64]],
  artery: [[59, 64], [60, 80], [62, 96], [63, 108]],
  muscle: [[63, 108], [63.5, 113]],
}
const LEGS = ['vein', 'atrium', 'valve', 'ventricle', 'aorta', 'artery', 'muscle']
const routeLen = pts => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)
function routeAt(leg, k) {
  const pts = ROUTE[leg]
  let left = routeLen(pts) * clamp(k)
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    if (left <= d || i === pts.length - 1) {
      const u = d > 0 ? clamp(left / d) : 0
      return [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)]
    }
    left -= d
  }
  return pts[pts.length - 1]
}

/** The map: a body, its lungs, heart and the thigh muscle, the route and the dot (`leg`, `k` along it). */
function drawBodyMap(g, w, h, { title, place, leg, k, color }) {
  g.clearRect(0, 0, w, h)
  g.fillStyle = 'rgba(13,16,48,0.92)'
  g.fillRect(0, 0, w, h)
  const top = h * 0.12
  const bottom = h * 0.13
  const sc = Math.min(w / 100, (h - top - bottom) / 160)
  const ox = (w - 100 * sc) / 2
  const oy = top
  const P = (x, y) => [ox + x * sc, oy + y * sc]
  g.save()
  // the body
  g.fillStyle = 'rgba(255,214,234,0.13)'
  g.strokeStyle = 'rgba(255,214,234,0.45)'
  g.lineWidth = Math.max(1.5, sc * 0.8)
  g.beginPath()
  g.arc(...P(50, 13), 9 * sc, 0, TAU)
  g.fill()
  g.stroke()
  const body = [[44, 22], [56, 22], [57, 26], [69, 29], [73, 34], [77, 72], [72, 73], [67, 40], [66, 80], [64, 156], [55, 156], [52, 92], [48, 92], [45, 156], [36, 156], [34, 80], [33, 40], [28, 73], [23, 72], [27, 34], [31, 29], [43, 26]]
  g.beginPath()
  body.forEach(([x, y], i) => (i ? g.lineTo(...P(x, y)) : g.moveTo(...P(x, y))))
  g.closePath()
  g.fill()
  g.stroke()
  // the lungs, the thigh muscle
  g.fillStyle = 'rgba(255,127,150,0.55)'
  for (const cx of [41, 59]) {
    g.beginPath()
    g.ellipse(...P(cx, 48), 6.5 * sc, 12 * sc, 0, 0, TAU)
    g.fill()
  }
  g.fillStyle = 'rgba(214,72,96,0.6)'
  g.beginPath()
  g.ellipse(...P(60.5, 112), 4.4 * sc, 14 * sc, 0.06, 0, TAU)
  g.fill()
  // the heart, a little to the person's left
  g.fillStyle = '#d6304a'
  g.beginPath()
  g.ellipse(...P(55, 52), 6 * sc, 7.5 * sc, -0.5, 0, TAU)
  g.fill()
  // the route, dashed, then lit up to the dot
  const all = LEGS.flatMap(l => ROUTE[l])
  g.setLineDash([3 * sc, 2.5 * sc])
  g.strokeStyle = 'rgba(255,240,200,0.55)'
  g.lineWidth = Math.max(2, sc * 1.1)
  g.beginPath()
  all.forEach(([x, y], i) => (i ? g.lineTo(...P(x, y)) : g.moveTo(...P(x, y))))
  g.stroke()
  g.setLineDash([])
  // the way so far, lit: every leg before this one, and this one up to the dot
  let dot = ROUTE.vein[0]
  if (leg) {
    const li = LEGS.indexOf(leg)
    const done = LEGS.slice(0, li).flatMap(l => ROUTE[l])
    const pts = ROUTE[leg]
    dot = routeAt(leg, k)
    let left = routeLen(pts) * clamp(k)
    const part = [pts[0]]
    for (let j = 1; j < pts.length; j++) {
      const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1])
      if (left < d) break
      left -= d
      part.push(pts[j])
    }
    const lit = [...done, ...part, dot]
    g.strokeStyle = '#ffd166'
    g.lineWidth = Math.max(2.5, sc * 1.5)
    g.beginPath()
    lit.forEach(([x, y], n) => (n ? g.lineTo(...P(x, y)) : g.moveTo(...P(x, y))))
    g.stroke()
  }
  // the dot: a red cell
  const [dx, dy] = P(...dot)
  const glow = g.createRadialGradient(dx, dy, 0, dx, dy, 7 * sc)
  glow.addColorStop(0, 'rgba(255,240,200,0.9)')
  glow.addColorStop(1, 'rgba(255,240,200,0)')
  g.fillStyle = glow
  g.beginPath()
  g.arc(dx, dy, 7 * sc, 0, TAU)
  g.fill()
  g.fillStyle = '#ff3448'
  g.strokeStyle = '#ffffff'
  g.lineWidth = Math.max(1.5, sc * 0.7)
  g.beginPath()
  g.arc(dx, dy, 3.2 * sc, 0, TAU)
  g.fill()
  g.stroke()
  g.restore()
  // the words
  g.fillStyle = '#f2e6f8'
  fitText(g, title, w / 2, top * 0.55, Math.round(h * 0.06), w - 16, 800, 'center')
  g.fillStyle = color
  fitText(g, place, w / 2, h - bottom * 0.5, Math.round(h * 0.065), w - 16, 800, 'center')
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, lang, clickable }) {
  const stage = bodyStage({ radius: 12, light, ions: false, top: '#26123a', mid: '#5a1b45', low: '#1c0a1c', fog: '#44183c', floor: '#8c4866', seam: '#62284a', cells: '#9e5480' })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, d = 0) => new Intl.NumberFormat(tagOf(lang), { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'min2' }).format(v)
  const glowMap = softGlow()
  const rnd = random(31)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const tmpV = new THREE.Vector3()
  const tmpQ = new THREE.Quaternion()
  const tmpM = new THREE.Matrix4()
  const tmpS = new THREE.Vector3()
  const tmpC = new THREE.Color()
  let clock = 0
  // a find counted; the first time its panel opens once the step has played, unless the visitor has
  // meanwhile gone to another station and opened that one's panel
  const found = (id, panel, delay) => {
    if (!ex.discover(id)) return
    later(delay, () => {
      if (ctx.engine.player?.near?.id === id || !ctx.store.get().panel) ctx.showPanel(panel)
    })
  }
  // a station's focus: how high and how wide it is (the station view fits both, so an upright phone sees
  // the whole width too)
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  const near = id => ctx.engine.player?.near?.id === id
  const faceTo = (obj, x, z) => (obj.rotation.y = Math.atan2(x - obj.position.x, z - obj.position.z))
  const post = new THREE.MeshStandardMaterial({ color: '#6a3a6e', roughness: 0.6 })
  const rimGold = new THREE.MeshStandardMaterial({ color: '#ffd9a0', emissive: '#ffb86a', emissiveIntensity: 0.8, roughness: 0.35, metalness: 0.3 })

  // the cells' colours: dark red without oxygen, bright red full of it (never blue)
  const DARK = new THREE.Color('#5a0b1e')
  const BRIGHT = new THREE.Color('#e8263d')
  const cellColor = (s, out) => out.copy(DARK).lerp(BRIGHT, Math.pow(clamp((s - 0.15) / 0.83), 0.85))

  // shared state, set by the exhibits below
  const MUS = { effort: 0, n: 0, mine: false }
  const effort = () => MUS.effort

  // =============================== the air sac ===============================
  const sacGroup = new THREE.Group()
  root.add(sacGroup)
  const sacMat = glassMat({ color: '#ff9ab4', inside: '#7a2a4a', alpha: 0.1, rim: 0.7 })
  const sac = new THREE.Mesh(new THREE.SphereGeometry(SAC.r, 48, 32), sacMat)
  sac.position.set(SAC.x, SAC.y, SAC.z)
  sac.renderOrder = 2
  sacGroup.add(sac)
  const nbMat = glassMat({ color: '#ff8fae', inside: '#6a2242', alpha: 0.12, rim: 0.6 })
  const neighbours = NEIGHBOURS.map(([x, y, z, r]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), nbMat)
    m.position.set(x, y, z)
    m.renderOrder = 1
    sacGroup.add(m)
    return m
  })
  // the air inside, softly lit; brighter with a fresh breath
  const airGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: '#ffd6e6', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.25 }))
  airGlow.position.set(SAC.x, SAC.y, SAC.z)
  airGlow.scale.setScalar(SAC.r * 2.6)
  sacGroup.add(airGlow)
  const sacLight = new THREE.PointLight('#ffd0e0', 4, 9, 1.6)
  sacLight.position.set(SAC.x + 0.4, SAC.y + 0.3, SAC.z + 1.2)
  sacGroup.add(sacLight)
  // the airway: a ringed tube from above into the sacs, branching to each
  const ringTex = canvasTex(32, 128, (g, w, h) => {
    g.fillStyle = '#ffc7d2'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 8; i++) {
      g.fillStyle = 'rgba(255,255,255,0.75)'
      g.fillRect(0, (i * h) / 8, w, h / 20)
      g.fillStyle = 'rgba(200,80,110,0.35)'
      g.fillRect(0, (i * h) / 8 + h / 20, w, h / 40)
    }
  }, { repeat: true })
  textures.push(ringTex)
  const airwayMat = new THREE.MeshStandardMaterial({ color: '#ffd0da', map: ringTex, roughness: 0.55, emissive: '#7a2a40', emissiveIntensity: 0.35 })
  const JUNCTION = V(-6.6, 6.4, -3.7)
  const airwayCurve = new THREE.CatmullRomCurve3([V(-9.6, 13.5, -7.6), V(-8.6, 10.2, -5.8), V(-7.3, 7.8, -4.4), JUNCTION, V(-6.6, SAC.y + SAC.r - 0.15, SAC.z - 0.3)])
  ringTex.repeat.set(1, airwayCurve.getLength() / 0.5)
  const airway = new THREE.Mesh(tubeAlong(airwayCurve, u => lerp(0.62, 0.42, u), 48, 16), airwayMat)
  sacGroup.add(airway)
  for (const [x, y, z, r] of NEIGHBOURS) {
    const c = new THREE.CatmullRomCurve3([JUNCTION, JUNCTION.clone().lerp(V(x, y, z), 0.5).add(V(0, 0.25, 0)), V(x, y, z).add(JUNCTION.clone().sub(V(x, y, z)).normalize().multiplyScalar(r - 0.2))])
    sacGroup.add(new THREE.Mesh(tubeAlong(c, 0.24, 12, 10), airwayMat))
  }
  // a net of capillaries wrapped round the sacs
  const netMat = new THREE.MeshStandardMaterial({ color: '#b02848', roughness: 0.5, emissive: '#5a0c22', emissiveIntensity: 0.5 })
  {
    const nrnd = random(9)
    const addNet = (cx, cy, cz, r, n, skipFront) => {
      for (let i = 0; i < n; i++) {
        const axis = V(nrnd() - 0.5, nrnd() - 0.5, nrnd() - 0.5).normalize()
        const start = V(nrnd() - 0.5, nrnd() - 0.5, nrnd() - 0.5).normalize()
        const pts = []
        for (let j = 0; j <= 10; j++) {
          const p = start.clone().applyAxisAngle(axis, (j / 10) * 2.4)
          pts.push(p)
        }
        // keep the front, where the big capillary runs and the visitor looks, clear
        if (skipFront && pts.some(p => p.z > 0.25 && p.y < 0.2)) continue
        const curve = new THREE.CatmullRomCurve3(pts.map(p => p.multiplyScalar(r + 0.04).add(V(cx, cy, cz))))
        sacGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.055, 6, false), netMat))
      }
    }
    addNet(SAC.x, SAC.y, SAC.z, SAC.r, light ? 8 : 16, true)
    for (const [x, y, z, r] of NEIGHBOURS) addNet(x, y, z, r, light ? 3 : 6, false)
  }
  solids.push(circle(SAC.x, SAC.z, SAC.r + 0.35))

  // the capillary round the sac's front, from the back-left (dark blood from the right heart) to the
  // back-right (bright blood off to the heart's left side)
  const sacCapPts = []
  for (let i = 0; i <= 16; i++) {
    const th = lerp(-2.2, 2.1, i / 16)
    const y = 1.45 + 0.2 * Math.sin(i * 0.85)
    const rr = Math.sqrt(SAC.r ** 2 - (y - SAC.y) ** 2) + CAP_R + 0.03
    sacCapPts.push(V(SAC.x + Math.sin(th) * rr, y, SAC.z + Math.cos(th) * rr))
  }
  const sacCap = new THREE.CatmullRomCurve3(sacCapPts)
  const capMat = glassMat({ color: '#ff7f98', inside: '#5a1630', alpha: 0.12, rim: 0.55 })
  const sacCapMesh = new THREE.Mesh(tubeAlong(sacCap, CAP_R, 120, 14), capMat)
  sacCapMesh.renderOrder = 3
  sacGroup.add(sacCapMesh)

  // ---- molecules: O2 (two red atoms), N2 (two blue), drawn as one instanced mesh of atoms ----
  const ATOMS = 300
  const atomMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 12, 8), new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05, emissive: '#3a0a10', emissiveIntensity: 0.4 }), ATOMS)
  atomMesh.frustumCulled = false
  atomMesh.raycast = () => {}
  for (let i = 0; i < ATOMS; i++) atomMesh.setColorAt(i, tmpC.set('#ffffff'))
  root.add(atomMesh)
  const O_COL = new THREE.Color('#f2302b')
  const N_COL = new THREE.Color('#4d7dff')
  let atomN = 0
  const axisTmp = new THREE.Vector3()
  /** One molecule this frame: two atoms about `p`, turned by `spin`, scaled by `s`. */
  const molecule = (p, kind, spin, s = 1) => {
    if (atomN + 2 > ATOMS || s <= 0.01) return
    axisTmp.set(Math.cos(spin), Math.sin(spin * 0.7) * 0.6, Math.sin(spin)).normalize().multiplyScalar(0.068 * s)
    const col = kind === 'N' ? N_COL : O_COL
    for (const sgn of [-1, 1]) {
      tmpV.copy(p).addScaledVector(axisTmp, sgn)
      tmpM.compose(tmpV, tmpQ.identity(), tmpS.setScalar(s * (kind === 'N' ? 0.9 : 1)))
      atomMesh.setMatrixAt(atomN, tmpM)
      atomMesh.setColorAt(atomN, col)
      atomN++
    }
  }
  // the air in the sac: nitrogen and oxygen, about four to one; the oxygen shown runs down as the blood takes it
  const N_IN = light ? 18 : 30
  const O_IN = 8
  const inside = []
  for (let i = 0; i < N_IN + O_IN; i++) {
    const d = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(Math.cbrt(rnd()) * SAC.r * 0.78)
    inside.push({ kind: i < O_IN ? 'O' : 'N', home: d, ph: rnd() * TAU, sp: 0.3 + rnd() * 0.4 })
  }

  // ---- the breath: shared { n, air } ----
  const SACS = { n: 0, start: -99, air: 0.8, mine: false, sound: false, told: -99 }
  const breathAge = () => clock - SACS.start
  const BREATH_T = 3.6
  const breathBusy = () => breathAge() < 1.5
  const drain = () => 0.034 + 0.08 * effort() // of a full sac a second (sped up)
  const sacPanel = lv => ({
    title: E.sac.title,
    color,
    blocks: [{ buttons: [{ label: E.sac.buttons.breathe, onClick: () => breatheTap() }] }, ...paras(E.sac.panel, lv)],
  })
  const flood = []
  function startBreath(age, sound) {
    SACS.start = clock - age
    SACS.sound = sound
    flood.length = 0
    if (age > 1.4) return
    const n = light ? 14 : 24
    for (let i = 0; i < n; i++) flood.push({ t0: SACS.start + (i / n) * 1.1, kind: i % 4 === 1 ? 'O' : 'N', off: V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.5), end: V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(rnd() * SAC.r * 0.7), ph: rnd() * TAU })
    if (sound) play('fizz', { order: 2 })
  }
  function breatheDo() {
    if (breathBusy()) return false
    SACS.n++
    SACS.mine = true
    SACS.air = 1
    SACS.told = clock
    startBreath(0, true)
    share('sac')
    found('sac', sacPanel, BREATH_T + 0.6)
    return at(E.sac.says.breathe, level())
  }
  const breatheTap = () => say(breatheDo() || at(W.busy, level()))
  ex.add({
    id: 'sac',
    x: SPOT.sac[0],
    z: SPOT.sac[1],
    radius: 1.9,
    label: E.sac.label,
    verb: () => (SACS.air < 0.2 ? E.sac.hints.low : E.sac.hints.breathe),
    manual: true,
    focus: focusOf(SAC.x + 0.3, 2.6, SAC.z + 0.6, 5.2, 5.4),
    act: () => ctx.showPanel(sacPanel),
  })
  clickable(airway, () => breatheTap(), { reach: 9 })
  clickable(sac, () => breatheTap(), { reach: 6 })
  for (const m of neighbours) clickable(m, () => breatheTap(), { reach: 8 })
  const breathShape = a => (a < 0 || a > BREATH_T ? 0 : a < 1.5 ? span(0.15, 1.5, a) : 1 - span(1.9, BREATH_T, a))
  const fp = new THREE.Vector3()
  updates.push((dt, t) => {
    // the sac's oxygen runs down as the blood takes it
    SACS.air = Math.max(0, SACS.air - drain() * dt)
    const a = breathAge()
    const b = breathShape(a)
    const sc = 1 + 0.07 * b
    sac.scale.setScalar(sc)
    for (const m of neighbours) m.scale.setScalar(1 + 0.06 * b)
    sacMat.uniforms.uGlow.value = 0.6 * b
    airGlow.material.opacity = 0.14 + 0.22 * SACS.air + 0.2 * b
    sacLight.intensity = (light ? 2 : 3) + 3 * b
    // the molecules inside: the oxygen shown follows the sac's level
    const oShown = Math.round(SACS.air * O_IN)
    let o = 0
    for (const m of inside) {
      if (m.kind === 'O' && o++ >= oShown) continue
      fp.set(Math.sin(t * m.sp + m.ph) * 0.18, Math.cos(t * m.sp * 0.8 + m.ph * 1.3) * 0.18, Math.sin(t * m.sp * 0.6 + m.ph * 0.7) * 0.18).add(m.home).multiplyScalar(sc).add(sac.position)
      molecule(fp, m.kind, t * m.sp + m.ph)
    }
    // a fresh breath streaming down the airway into the sac
    for (const f of flood) {
      const u = (clock - f.t0) / 1.0
      if (u < 0 || u > 1.6) continue
      if (u < 1) airwayCurve.getPointAt(0.35 + 0.65 * u, fp).add(f.off)
      else fp.copy(airwayCurve.getPointAt(1, tmpV)).lerp(f.end.clone().add(sac.position), ease(u - 1) * 1.6).add(f.off)
      molecule(fp, f.kind, t * 2 + f.ph, u > 1.3 ? 1 - (u - 1.3) / 0.3 : 1)
    }
    if (SACS.sound && a > 1.9 && a - dt <= 1.9) play('part')
    // running low: the Atomling says so to whoever stands here
    if (SACS.air < 0.18 && (near('sac') || near('blood')) && clock - SACS.told > 25) {
      SACS.told = clock
      say(at(E.sac.says.low, level()))
    }
  })

  // =============================== red cells in the capillaries ===============================
  const cellGeo = rbcGeometry(CELL_D, 24)
  const cellMat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.05, emissive: '#30040e', emissiveIntensity: 0.5 })
  const N_SAC = light ? 13 : 17
  const N_MUS = light ? 11 : 15
  const cells = new THREE.InstancedMesh(cellGeo, cellMat, N_SAC + N_MUS)
  cells.frustumCulled = false
  for (let i = 0; i < N_SAC + N_MUS; i++) cells.setColorAt(i, DARK)
  root.add(cells)
  // bigger invisible shapes to tap the sac's cells by (they are small on a phone)
  const cellHits = new THREE.InstancedMesh(new THREE.SphereGeometry(CELL_D * 0.75, 8, 6), ghost, N_SAC)
  cellHits.frustumCulled = false
  root.add(cellHits)
  /** A capillary's cells: arc lengths along it, how full each is, moved each frame. */
  function flowOf(curve, n) {
    const L = curve.getLength()
    return { curve, L, n, phase: 0, s: new Float32Array(n), sat: new Float32Array(n), pos: Array.from({ length: n }, () => new THREE.Vector3()) }
  }
  const sacFlow = flowOf(sacCap, N_SAC)
  // the muscle's capillary (built with the muscle below) is filled in later
  let musFlow = null
  const tan = new THREE.Vector3()
  const wob = new THREE.Quaternion()
  function placeFlow(F, base, t, satOf, hits) {
    const gap = F.L / F.n
    for (let i = 0; i < F.n; i++) {
      const s = (F.phase + i * gap) % F.L
      F.s[i] = s
      const u = s / F.L
      F.curve.getPointAt(u, F.pos[i])
      F.curve.getTangentAt(u, tan)
      // flat face to the flow, tumbling a little, shrinking in and out at the ends
      tmpQ.setFromUnitVectors(UP, tan)
      wob.setFromAxisAngle(UP, Math.sin(t * 0.7 + i) * 0.5)
      tmpQ.multiply(wob)
      const end = Math.min(s, F.L - s)
      const sc = clamp(end / 0.5)
      tmpM.compose(F.pos[i], tmpQ, tmpS.set(1, 1.15, 1).multiplyScalar(sc))
      cells.setMatrixAt(base + i, tmpM)
      F.sat[i] = satOf(s / F.L)
      cells.setColorAt(base + i, cellColor(F.sat[i], tmpC))
      if (hits) {
        tmpM.compose(F.pos[i], tmpQ, tmpS.setScalar(sc))
        hits.setMatrixAt(i, tmpM)
      }
    }
  }
  // O2 hopping from the sac into the passing cells, and from the muscle's cells into the fibre
  const hops = []
  const hop = (from, to, dur, kind = 'O') => hops.length < 60 && hops.push({ from: from.clone(), to, t0: clock, dur, kind, ph: rnd() * TAU })
  let sacHopAcc = 0
  updates.push((dt, t) => {
    const e = effort()
    const v = 0.3 + 0.55 * e
    sacFlow.phase = (sacFlow.phase + v * dt) % sacFlow.L
    const sIn = effAt('sv', e)
    const target = SACS.air > 0.12 ? ART : lerp(sIn, ART, SACS.air / 0.12)
    placeFlow(sacFlow, 0, t, u => target - (target - sIn) * Math.exp(-9 * u), cellHits)
    cellHits.instanceMatrix.needsUpdate = true
    // O2 crossing the wall, as many as the cells take (shown fewer)
    sacHopAcc += dt * (v / (sacFlow.L / N_SAC)) * Math.max(0, target - sIn) * 4 * (light ? 0.35 : 0.6)
    while (sacHopAcc >= 1) {
      sacHopAcc -= 1
      const cands = []
      for (let i = 0; i < N_SAC; i++) if (sacFlow.s[i] / sacFlow.L > 0.04 && sacFlow.s[i] / sacFlow.L < 0.4) cands.push(i)
      if (!cands.length) break
      const i = cands[Math.floor(rnd() * cands.length)]
      const p = sacFlow.pos[i]
      const from = p.clone().sub(sac.position).normalize().multiplyScalar(SAC.r * 0.62).add(sac.position)
      hop(from, () => sacFlow.pos[i], 0.9)
    }
  })

  // =============================== the lens: inside a red cell ===============================
  const lens1 = new THREE.Group()
  lens1.position.set(LENS1.x, LENS1.y, LENS1.z)
  faceTo(lens1, SPOT.blood[0], SPOT.blood[1] + 0.6)
  root.add(lens1)
  const lensBackTex = canvasTex(256, 256, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, '#2a1640')
    grd.addColorStop(0.75, '#160c2c')
    grd.addColorStop(1, '#0c0820')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }, { mipmaps: false })
  textures.push(lensBackTex)
  /** A lens on a stand: a gold ring round a dark disc, its name below; `content` sits in front of the disc. */
  function lensStand(r, plate, y) {
    const group = new THREE.Group()
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.065, 12, 64), rimGold)
    const backing = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ map: lensBackTex }))
    backing.position.z = -0.05
    const content = new THREE.Group()
    content.position.z = 0.3
    group.add(ring, backing, content)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, y - r, 10), post)
    stem.position.y = -(y - r) / 2 - r
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.06, 24), post)
    foot.position.y = -y + 0.03
    group.add(stem, foot)
    const label = makeText(plate, { size: 0.14, color: '#ffe6c8', anchorY: 'top', outlineWidth: 0.01, outlineColor: '#2a0e2a' })
    label.position.set(0, -r - 0.12, 0.08)
    group.add(label)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.6, 24).rotateX(Math.PI / 2), ghost)
    group.add(hit)
    return { group, content, ring, hit }
  }
  const L1 = lensStand(LENS1.r, E.blood.plate, LENS1.y)
  lens1.add(L1.group)
  // haemoglobin: four globins (two α lighter, two β deeper) round a middle, a haem with its iron on each, an
  // O2 on the iron when its seat is full
  const hb = new THREE.Group()
  hb.scale.setScalar(1.05)
  L1.content.add(hb)
  const globGeo = (() => {
    const g = new THREE.SphereGeometry(0.24, 32, 20)
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const k = 1 + 0.12 * Math.sin(v.x * 18 + 1) * Math.sin(v.y * 15) + 0.08 * Math.sin(v.z * 22 + v.x * 9)
      v.multiplyScalar(k)
      p.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    return g
  })()
  const subunits = []
  const SUBS = [['a', -0.17, 0.17, 0.09], ['b', 0.17, 0.17, -0.09], ['a', 0.17, -0.17, 0.09], ['b', -0.17, -0.17, -0.09]]
  const HB_DARK = { a: new THREE.Color('#6a1830'), b: new THREE.Color('#4a0e26') }
  const HB_BRIGHT = { a: new THREE.Color('#ff5a6e'), b: new THREE.Color('#d92a48') }
  const haemMat = new THREE.MeshStandardMaterial({ color: '#7a0f1e', roughness: 0.4, emissive: '#3a0610', emissiveIntensity: 0.5 })
  const ironMat = new THREE.MeshStandardMaterial({ color: '#ffb066', emissive: '#ff7a1a', emissiveIntensity: 1.2, roughness: 0.3, metalness: 0.5 })
  const seatO = new THREE.MeshStandardMaterial({ color: '#f2302b', roughness: 0.3, emissive: '#7a0a08', emissiveIntensity: 0.6 })
  for (const [kind, x, y, z] of SUBS) {
    const mat = new THREE.MeshStandardMaterial({ color: HB_DARK[kind].clone(), roughness: 0.55, emissive: '#2a0612', emissiveIntensity: 0.4 })
    const m = new THREE.Mesh(globGeo, mat)
    m.position.set(x, y, z)
    m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
    hb.add(m)
    // the haem on its outer face, toward the viewer and out from the middle
    const out = V(x, y, 0.35).normalize()
    const seat = new THREE.Group()
    seat.position.copy(V(x, y, z).addScaledVector(out, 0.22))
    seat.quaternion.setFromUnitVectors(UP, out)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.025, 6), haemMat)
    const iron = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 8), ironMat)
    iron.position.y = 0.02
    const o2 = new THREE.Group()
    for (const s of [-1, 1]) {
      const a = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 10), seatO)
      a.position.set(s * 0.045, 0.085 + (s > 0 ? 0.04 : 0), 0)
      o2.add(a)
    }
    seat.add(disc, iron, o2)
    hb.add(seat)
    subunits.push({ kind, mat, seat, o2, k: 0, out })
  }
  // the board with the curve
  const curveBoard = screenBoard(CURVE.w, CURVE.h, 1024, '#ff7b7b')
  curveBoard.group.position.set(CURVE.x, CURVE.y, CURVE.z)
  curveBoard.group.rotation.order = 'YXZ'
  faceTo(curveBoard.group, SPOT.blood[0] - 0.2, SPOT.blood[1] + 0.6)
  curveBoard.group.rotation.x = -0.08
  root.add(curveBoard.group)
  textures.push(curveBoard.tex)
  {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, CURVE.y - CURVE.h / 2, 8), post)
    leg.position.set(CURVE.x, (CURVE.y - CURVE.h / 2) / 2, CURVE.z - 0.05)
    root.add(leg)
    solids.push(circle(CURVE.x, CURVE.z, 0.3), circle(LENS1.x, LENS1.z, 0.35))
  }
  // the blood station: shared { po2, follow, n }
  const BL = { po2: 40, follow: false, n: 0, cell: -1, seen: 0, shown: 0, said: false, mine: false, start: -99 }
  const PLOT = { x0: 150, x1: 990, y0: 150, y1: 560 }
  let curveDrawn = ''
  const lensSat = () => {
    if (BL.follow && BL.cell >= 0) return sacFlow.sat[BL.cell]
    return satAt(BL.po2)
  }
  function drawCurve() {
    const lv = level()
    const s = lensSat()
    const p = BL.follow ? po2At(s) : BL.po2
    const key = `${lv}:${Math.round(p)}:${BL.follow}`
    if (key === curveDrawn) return
    curveDrawn = key
    const C = E.blood.curve
    const sci = lv === 'scientist'
    curveBoard.draw((g, w, h) => {
      g.fillStyle = '#0d1030'
      g.fillRect(0, 0, w, h)
      const px = v => PLOT.x0 + (v / 120) * (PLOT.x1 - PLOT.x0)
      const py = v => PLOT.y1 - v * (PLOT.y1 - PLOT.y0)
      g.fillStyle = '#ffd6e2'
      fitText(g, at(C.title, lv), 40, 52, 46, w - 360, 800)
      // the reading, top right
      g.fillStyle = '#fff4a0'
      const seatsFull = Math.round(s * 4)
      if (sci) {
        g.textAlign = 'right'
        const pw = chem(g, `PO2 ${nf(p)} mmHg`, 0, 0, 38, 'left', true)
        chem(g, `PO2 ${nf(p)} mmHg`, w - 40 - pw, 40, 38)
        g.font = `800 40px ${FONT}`
        g.textAlign = 'right'
        g.fillText(`${nf(s * 100)}%`, w - 40, 92)
      } else fitText(g, fill(C.seats, { n: seatsFull }), w - 40, 60, 40, 330, 800, 'right')
      // the grid
      g.strokeStyle = 'rgba(138,143,200,0.35)'
      g.lineWidth = 2
      for (const v of [0, 0.25, 0.5, 0.75, 1]) {
        g.beginPath()
        g.moveTo(PLOT.x0, py(v))
        g.lineTo(PLOT.x1, py(v))
        g.stroke()
      }
      g.fillStyle = '#9aa0d8'
      g.font = `600 28px ${FONT}`
      g.textAlign = 'right'
      g.textBaseline = 'middle'
      for (const v of [0, 0.25, 0.5, 0.75, 1]) g.fillText(sci ? `${v * 100}%` : `${v * 4}`, PLOT.x0 - 14, py(v))
      if (sci) {
        g.textAlign = 'center'
        for (const v of [0, 20, 40, 60, 80, 100, 120]) g.fillText(String(v), px(v), PLOT.y1 + 26)
      }
      g.save()
      g.translate(34, (PLOT.y0 + PLOT.y1) / 2)
      g.rotate(-Math.PI / 2)
      g.fillStyle = '#c9cdf0'
      fitText(g, at(C.y, lv), 0, 0, 30, PLOT.y1 - PLOT.y0, 700, 'center')
      g.restore()
      g.fillStyle = '#c9cdf0'
      if (sci) {
        const xw = chem(g, at(C.x, lv), 0, 0, 30, 'left', true)
        chem(g, at(C.x, lv), (PLOT.x0 + PLOT.x1) / 2 - xw / 2, PLOT.y1 + 62, 30)
      } else {
        fitText(g, `${at(C.x, lv)}  →`, (PLOT.x0 + PLOT.x1) / 2, PLOT.y1 + 40, 32, PLOT.x1 - PLOT.x0, 700, 'center')
      }
      // P50
      if (sci) {
        g.setLineDash([10, 8])
        g.strokeStyle = 'rgba(255,214,226,0.55)'
        g.beginPath()
        g.moveTo(PLOT.x0, py(0.5))
        g.lineTo(px(P50), py(0.5))
        g.lineTo(px(P50), PLOT.y1)
        g.stroke()
        g.setLineDash([])
        g.fillStyle = '#ffd6e2'
        const lw = chem(g, `P50 ≈ ${nf(P50)} mmHg`, 0, 0, 26, 'left', true)
        chem(g, `P50 ≈ ${nf(P50)} mmHg`, px(P50) + 12, py(0.5) + 26, 26)
        void lw
      }
      // the places
      for (const [key, v, ink] of [['work', PO2.work, '#ff9a5a'], ['rest', PO2.rest, '#ffd166'], ['lung', PO2.lung, '#7fe0ff']]) {
        g.setLineDash([6, 8])
        g.strokeStyle = ink
        g.globalAlpha = 0.55
        g.beginPath()
        g.moveTo(px(v), py(satAt(v)))
        g.lineTo(px(v), PLOT.y1)
        g.stroke()
        g.setLineDash([])
        g.globalAlpha = 1
        g.fillStyle = ink
        g.beginPath()
        g.arc(px(v), py(satAt(v)), 8, 0, TAU)
        g.fill()
        const ly = key === 'lung' ? py(satAt(v)) - 34 : py(satAt(v)) + (key === 'work' ? 36 : 34)
        fitText(g, C[key], px(v) + (key === 'lung' ? -6 : 16), ly, 28, key === 'lung' ? 220 : 260, 700, key === 'lung' ? 'right' : 'left')
      }
      // the curve
      g.save()
      g.shadowColor = '#ff6a7e'
      g.shadowBlur = 14
      g.strokeStyle = '#ff6a7e'
      g.lineWidth = 7
      g.beginPath()
      for (let i = 0; i <= 120; i++) {
        const v = i
        if (i === 0) g.moveTo(px(v), py(satAt(v)))
        else g.lineTo(px(v), py(satAt(v)))
      }
      g.stroke()
      g.restore()
      // the dot: where this haemoglobin is
      const dx = px(clamp(p, 0, 120))
      const dy = py(s)
      const glow = g.createRadialGradient(dx, dy, 0, dx, dy, 34)
      glow.addColorStop(0, 'rgba(255,255,255,0.9)')
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = glow
      g.beginPath()
      g.arc(dx, dy, 34, 0, TAU)
      g.fill()
      g.fillStyle = cellColor(s, tmpC).getStyle()
      g.strokeStyle = '#ffffff'
      g.lineWidth = 4
      g.beginPath()
      g.arc(dx, dy, 14, 0, TAU)
      g.fill()
      g.stroke()
    })
  }
  const setPo2 = (v, { quiet = false } = {}) => {
    BL.po2 = clamp(Math.round(Number(v) || 0), 0, 120)
    BL.follow = false
    BL.cell = -1
    BL.mine = true
    if (!quiet) found('blood', bloodPanel, 2.2)
  }
  let sliding = false
  const slidePo2 = v => {
    setPo2(v)
    if (sliding) return
    sliding = true
    later(0.25, () => {
      sliding = false
      share('blood')
    })
  }
  const bloodPanel = lv => ({
    title: E.blood.title,
    color: '#ff7b7b',
    blocks: [
      { slider: { label: at(E.blood.slider, lv), min: 0, max: 120, step: 1, value: Math.round(BL.follow ? po2At(lensSat()) : BL.po2), onInput: v => slidePo2(v), format: v => (lv === 'scientist' ? `${Math.round(v)} mmHg` : fill(E.blood.curve.seats, { n: Math.round(satAt(v) * 4) })), live: () => Math.round(BL.follow ? po2At(lensSat()) : BL.po2) } },
      { buttons: [['lung', PO2.lung], ['rest', PO2.rest], ['work', PO2.work]].map(([k, v]) => ({ label: E.blood.presets[k], onClick: () => { setPo2(v); share('blood') } })) },
      { buttons: [{ label: E.blood.buttons.look, onClick: () => lookTap() }] },
      ...paras(E.blood.panel, lv),
    ],
  })
  /** Follow a red cell (the one tapped, or the next to reach the sac) in the lens. */
  function follow(i) {
    if (!(i >= 0)) {
      // the cell nearest the capillary's start that has not yet passed the sac
      let best = -1
      for (let j = 0; j < N_SAC; j++) {
        const u = sacFlow.s[j] / sacFlow.L
        if (u > 0.03 && u < 0.3 && (best < 0 || sacFlow.s[j] < sacFlow.s[best])) best = j
      }
      i = best >= 0 ? best : 0
    }
    BL.follow = true
    BL.cell = i
    BL.said = false
    BL.start = clock
  }
  function lookDo(i) {
    BL.n++
    BL.mine = true
    follow(i)
    play('select')
    share('blood')
    found('blood', bloodPanel, 4.5)
    return at(E.blood.says.look, level())
  }
  const lookTap = i => say(lookDo(i))
  ex.add({
    id: 'blood',
    x: SPOT.blood[0],
    z: SPOT.blood[1],
    radius: 1.8,
    label: E.blood.label,
    verb: () => (BL.n ? E.blood.hints.again : E.blood.hints.look),
    manual: true,
    focus: focusOf((LENS1.x + CURVE.x) / 2, 1.95, (LENS1.z + CURVE.z) / 2, 2.3, 3.6),
    act: () => ctx.showPanel(bloodPanel),
  })
  clickable(cellHits, hit => lookTap(hit.instanceId), { reach: 7 })
  clickable(L1.hit, () => lookTap(), { reach: 6 })
  clickable(curveBoard.face, hit => {
    const u = hit.uv?.x ?? 0.5
    const cw = 1024
    const v = ((u * cw - PLOT.x0) / (PLOT.x1 - PLOT.x0)) * 120
    setPo2(v)
    share('blood')
    play('tap')
    say(at(E.blood.says.curve, level()))
  }, { reach: 6 })
  // the lens: seats filling one by one toward how full the cell is, each new one quicker (they help each other)
  const seatT = [0.9, 0.55, 0.4, 0.32]
  let seatClock = 0
  const marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: '#fff2b0', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
  marker.scale.setScalar(0.9)
  root.add(marker)
  updates.push((dt, t) => {
    const s = lensSat()
    const want = clamp(Math.round(s * 4), 0, 4)
    const have = subunits.filter(u => u.k > 0.5).length
    seatClock += dt
    if (want !== have && seatClock > seatT[Math.min(3, have)] * (want > have ? 1 : 0.6)) {
      seatClock = 0
      if (want > have) {
        const u = subunits.find(q => q.k <= 0.5)
        if (u) u.k = 1
        play('join', { order: Math.min(3, have + 1) })
        if (want === 4 && have === 3 && BL.follow && BL.mine && !BL.said) {
          BL.said = true
          say(at(E.blood.says.full, level()))
        }
      } else {
        const u = [...subunits].reverse().find(q => q.k > 0.5)
        if (u) u.k = 0
      }
    }
    for (const u of subunits) {
      u.show = damp(u.show ?? 0, u.k, 6, dt)
      u.o2.visible = u.show > 0.02
      u.o2.position.y = (1 - u.show) * 0.5
      u.o2.scale.setScalar(Math.max(0.01, u.show))
      u.mat.color.copy(HB_DARK[u.kind]).lerp(HB_BRIGHT[u.kind], clamp(s * 1.05))
    }
    hb.rotation.y = Math.sin(t * 0.35) * 0.55
    hb.rotation.x = Math.sin(t * 0.27) * 0.25
    // the followed cell, ringed
    const on = BL.follow && BL.cell >= 0
    marker.material.opacity = damp(marker.material.opacity, on ? 0.75 : 0, 5, dt)
    if (on) {
      marker.position.copy(sacFlow.pos[BL.cell])
      // past the sac's end it leaves for the heart: the lens keeps what it had
      if (sacFlow.s[BL.cell] / sacFlow.L > 0.93) {
        BL.po2 = Math.round(po2At(sacFlow.sat[BL.cell]))
        BL.follow = false
        BL.cell = -1
      }
    }
    drawCurve()
  })

  // =============================== the heart and the vessels ===============================
  const heart = new THREE.Group()
  heart.position.set(HEART.x, HEART.y, HEART.z)
  heart.rotation.z = HEART.tilt
  heart.scale.setScalar(HEART.s)
  root.add(heart)
  heart.updateMatrixWorld(true)
  const hw = (x, y, z) => heart.localToWorld(V(x, y, z))
  const beat = new THREE.Group()
  heart.add(beat)
  {
    const g = new THREE.SphereGeometry(1, 48, 32)
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const k = v.y < 0 ? 1 + 0.48 * v.y : 1 - 0.1 * v.y * v.y
      let y = v.y
      if (y < -0.5) y -= (-0.5 - y) * 0.25
      p.setXYZ(i, v.x * k * 2.0 - 0.05, y * 2.4 + 0.05, v.z * k * 1.65)
    }
    g.computeVertexNormals()
    const shellMat = glassMat({ color: '#ff6f86', inside: '#5a1430', alpha: 0.07, rim: 0.78 })
    const shell = new THREE.Mesh(g, shellMat)
    shell.renderOrder = 4
    beat.add(shell)
    disposers.push(() => g.dispose())
    // the heart's own arteries on its surface (the coronaries), so it reads as a heart
    const shellAt = d => {
      const v = d.clone().normalize()
      const k = v.y < 0 ? 1 + 0.48 * v.y : 1 - 0.1 * v.y * v.y
      let y = v.y
      if (y < -0.5) y -= (-0.5 - y) * 0.25
      return V(v.x * k * 2.0 - 0.05, y * 2.4 + 0.05, v.z * k * 1.65).multiplyScalar(1.02)
    }
    const coronaryMat = new THREE.MeshStandardMaterial({ color: '#ff3a4e', emissive: '#c8102a', emissiveIntensity: 0.7, roughness: 0.4 })
    const along = (dirs, r) => {
      const pts = []
      for (let i = 0; i < dirs.length - 1; i++) {
        for (let j = 0; j < 6; j++) pts.push(shellAt(V(...dirs[i]).lerp(V(...dirs[i + 1]), j / 6)))
      }
      pts.push(shellAt(V(...dirs[dirs.length - 1])))
      beat.add(new THREE.Mesh(tubeAlong(new THREE.CatmullRomCurve3(pts), u => r * (1 - 0.6 * u), 48, 6), coronaryMat))
    }
    // down the front groove to the tip, round the left side, round the right side, and a few branches
    along([[0.05, 0.75, 0.66], [0.15, 0.2, 0.98], [0.3, -0.5, 0.8], [0.32, -0.95, 0.2]], 0.05)
    along([[0.12, 0.62, 0.78], [0.6, 0.55, 0.58], [0.95, 0.25, -0.1], [0.6, 0.1, -0.8]], 0.045)
    along([[-0.15, 0.65, 0.74], [-0.7, 0.45, 0.55], [-0.95, 0.0, 0.25], [-0.7, -0.5, -0.5]], 0.045)
    along([[0.15, 0.2, 0.98], [0.55, -0.15, 0.82], [0.75, -0.55, 0.38]], 0.03)
    along([[0.25, -0.2, 0.95], [-0.15, -0.55, 0.82], [-0.25, -0.85, 0.45]], 0.028)
    along([[0.6, 0.55, 0.58], [0.85, -0.1, 0.52], [0.7, -0.6, 0.3]], 0.028)
  }
  // the four chambers: the left side bright (blood full of oxygen), the right side dark red
  const CH = {
    la: { c: [0.6, 1.1, -0.6], r: [0.8, 0.58, 0.62], color: '#ff4a5e', inside: '#a01a30', alpha: 0.2 },
    lv: { c: [0.45, -0.5, -0.05], r: [0.95, 1.4, 0.88], color: '#ff3a52', inside: '#a01a30', alpha: 0.2 },
    ra: { c: [-1.15, 0.9, -0.05], r: [0.7, 0.68, 0.62], color: '#8a2048', inside: '#3a0c22', alpha: 0.26 },
    rv: { c: [-0.75, -0.35, 0.42], r: [0.78, 1.1, 0.6], color: '#8a2048', inside: '#3a0c22', alpha: 0.26 },
  }
  const chamberMats = {}
  for (const [id, c] of Object.entries(CH)) {
    const mat = glassMat({ color: c.color, inside: c.inside, alpha: c.alpha, rim: 0.7 })
    chamberMats[id] = mat
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), mat)
    m.position.set(...c.c)
    m.scale.set(...c.r)
    m.renderOrder = 5
    beat.add(m)
  }
  const heartLight = new THREE.PointLight('#ff6a7a', light ? 0 : 5, 9, 1.6)
  heartLight.position.set(HEART.x, HEART.y - 0.5, HEART.z + 2.6)
  // phones and weak computers (light mode) go without the extra lights: each one costs every pixel
  if (!light) root.add(heartLight)
  // the valves: the mitral's two leaflets with their strings, the aortic valve's three cusps
  const flapMat = new THREE.MeshStandardMaterial({ color: '#ffe0e6', roughness: 0.45, emissive: '#ff9ab0', emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.92 })
  function valveGroup(at3, to3, r) {
    const g = new THREE.Group()
    g.position.set(...at3)
    g.quaternion.setFromUnitVectors(UP, V(...to3).sub(V(...at3)).normalize())
    beat.add(g)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.035, 8, 40).rotateX(Math.PI / 2), flapMat)
    g.add(ring)
    return g
  }
  const MITRAL = { at: [0.55, 0.62, -0.38], r: 0.5 }
  const AORTIC = { at: [0.0, 0.72, 0.2], r: 0.48 }
  const mitral = valveGroup(MITRAL.at, CH.lv.c, MITRAL.r)
  const leaflets = [1, -1].map(sg => {
    const geo = new THREE.CircleGeometry(MITRAL.r * 0.98, 16, 0, Math.PI).rotateX((sg * Math.PI) / 2).translate(0, 0, -sg * MITRAL.r)
    const pivot = new THREE.Group()
    pivot.position.z = sg * MITRAL.r
    pivot.add(new THREE.Mesh(geo, flapMat))
    mitral.add(pivot)
    return { pivot, sg }
  })
  // strings (chordae tendineae) from the leaflets' free edges to two muscle bumps in the ventricle
  const papMat = new THREE.MeshStandardMaterial({ color: '#c8304a', roughness: 0.6, emissive: '#5a0c1a', emissiveIntensity: 0.4 })
  const PAPS = [[0.85, -0.85, -0.2], [0.15, -0.8, 0.2]]
  for (const pp of PAPS) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), papMat)
    m.position.set(...pp)
    m.scale.set(1, 1.6, 1)
    beat.add(m)
  }
  const cordGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 5).translate(0, 0.5, 0)
  const cords = []
  for (const lf of leaflets) {
    for (const [dx, pi] of [[-0.25, 0], [0.25, 1]]) {
      const m = new THREE.Mesh(cordGeo, flapMat)
      beat.add(m)
      cords.push({ m, lf, dx, pi })
    }
  }
  const aortic = valveGroup(AORTIC.at, [-0.05, 1.6, 0.25], AORTIC.r)
  const cusps = [0, 1, 2].map(i => {
    const th = (i / 3) * TAU + Math.PI / 6
    const geo = new THREE.CircleGeometry(AORTIC.r * 0.97, 10, th - Math.PI / 3, (TAU / 3) * 0.96).rotateX(Math.PI / 2)
    // rotateX(+90°) takes y to z: the sector's middle lands at (cos, 0, sin), its hinge
    const mid = V(Math.cos(th), 0, Math.sin(th)).multiplyScalar(AORTIC.r)
    geo.translate(-mid.x, 0, -mid.z)
    const pivot = new THREE.Group()
    pivot.position.copy(mid)
    pivot.add(new THREE.Mesh(geo, flapMat))
    aortic.add(pivot)
    return { pivot, axis: V(-mid.z, 0, mid.x).normalize() }
  })

  // the vessels: bright where they carry blood full of oxygen, dark where it comes back
  const BRIGHT_V = '#ff4a62'
  const DARK_V = '#8a2a4c'
  const vessels = []
  const vessel = (pts, r, col, inside, rep) => {
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    const mat = glassMat({ color: col, inside, alpha: 0.07, rim: 0.52, flow: 0.6, rep: rep ?? Math.max(2, Math.round(curve.getLength() / 2.2)) })
    const m = new THREE.Mesh(tubeAlong(curve, r, Math.max(40, Math.round(curve.getLength() * 6)), 18), mat)
    m.renderOrder = 3
    root.add(m)
    vessels.push({ m, mat, curve })
    return { m, mat, curve }
  }
  const capEnd = sacCap.getPointAt(1)
  const capStart = sacCap.getPointAt(0)
  // from the sac to the heart's left atrium, round the heart's left side to its back
  const veinPts = [capEnd, V(-3.2, 1.38, -4.05), START, V(-1.95, 1.6, -5.6), V(-3.0, 2.6, -7.4), V(-2.6, 4.2, -9.7), V(-0.6, 5.5, -10.5), hw(0.75, 1.3, -1.25), hw(...CH.la.c)]
  const vein = vessel(veinPts, u => lerp(CAP_R, 0.78, span(0, 0.1, u)), BRIGHT_V, '#7a1428')
  // from the left ventricle up the aorta, over the arch, down and along an artery to the muscle
  const aortaPts = [hw(...AORTIC.at), hw(-0.05, 1.6, 0.25), hw(-0.12, 2.5, 0.3), V(0.6, 8.7, -7.4), V(3.0, 8.9, -7.9), V(4.8, 7.6, -8.6), V(5.4, 5.0, -8.9), V(5.0, 2.8, -8.5), V(3.2, 1.6, -7.6), V(2.0, 1.35, -6.0), V(1.95, 1.3, -4.5), V(2.6, 1.3, -3.4), PARK]
  const aorta = vessel(aortaPts, u => lerp(0.86, 0.72, span(0.3, 1, u)), BRIGHT_V, '#7a1428')
  // the dark side: from the right ventricle to the sac, and from the muscle back to the right atrium
  vessel([hw(-0.45, 0.85, 0.55), hw(-0.6, 1.6, 0.7), V(-1.2, 6.4, -6.9), V(-3.6, 4.6, -6.6), V(-6.6, 3.0, -5.7), V(-8.8, 2.0, -4.7), capStart], u => lerp(0.62, CAP_R, span(0.75, 1, u)), DARK_V, '#2a0818')
  // the muscle's capillary (and the cells in it)
  const musCap = new THREE.CatmullRomCurve3([PARK.clone().add(V(0.45, -0.2, -0.45)), V(4.8, 0.98, -4.12), V(6.2, 1.0, -4.12), V(8.4, 0.96, -4.12), V(10.4, 1.02, -4.12), V(11.9, 1.0, -4.12), V(12.9, 1.3, -5.0)])
  const musCapMesh = new THREE.Mesh(tubeAlong(musCap, CAP_R, 90, 14), capMat)
  musCapMesh.renderOrder = 3
  root.add(musCapMesh)
  musFlow = flowOf(musCap, N_MUS)
  vessel([V(12.9, 1.3, -5.0), V(11.6, 2.6, -8.4), V(7.0, 3.4, -10.2), V(2.4, 2.6, -10.9), V(0.2, 2.8, -10.2), V(-1.0, 3.4, -9.2), hw(-1.2, 0.3, -0.2), hw(...CH.ra.c)], u => lerp(CAP_R, 0.62, span(0, 0.12, u)), DARK_V, '#2a0818')
  // keep the walker out of the low vessels
  for (const v of [vein, aorta]) {
    const L = v.curve.getLength()
    for (let s = 0; s <= L; s += 0.6) {
      const p = v.curve.getPointAt(s / L)
      if (p.y < 2.3) solids.push(circle(p.x, p.z, 0.82))
    }
  }
  solids.push(circle(HEART.x + 0.6, HEART.z, 2.6))

  // the heart beats at the effort's rate; the valves open and close with it
  const HB = { phase: 0 }
  const systole = ph => (ph < 0.35 ? Math.sin((Math.PI * ph) / 0.35) : 0)
  updates.push((dt, t) => {
    HB.phase = (HB.phase + (dt * effAt('hr', effort())) / 60) % 1
    const sys = systole(HB.phase)
    const atr = HB.phase > 0.82 ? Math.sin((Math.PI * (HB.phase - 0.82)) / 0.18) : 0
    beat.scale.setScalar(1 - 0.04 * sys + 0.012 * atr)
    chamberMats.lv.uniforms.uGlow.value = 0.6 * sys
    chamberMats.rv.uniforms.uGlow.value = 0.5 * sys
    chamberMats.la.uniforms.uGlow.value = 0.4 * atr
    chamberMats.ra.uniforms.uGlow.value = 0.4 * atr
    heartLight.intensity = light ? 0 : 4 + 3 * sys
    for (const v of vessels) {
      v.mat.uniforms.uTime.value = t * (0.6 + effort())
      v.mat.uniforms.uGlow.value = 0.25 * sys
    }
    sacMat.uniforms.uTime.value = t
  })

  // =============================== the ride ===============================
  // the whole way, from just behind the waiting cell to the muscle: the vein, the heart, the aorta and artery
  const ridePts = [V(-3.2, 1.38, -4.05), START, ...veinPts.slice(3, -1), hw(...CH.la.c), hw(...MITRAL.at), hw(0.66, 0.1, -0.2), hw(0.78, -0.75, -0.05), hw(0.5, -1.5, 0.05), hw(0.12, -1.05, 0.12), hw(0.02, -0.2, 0.16), ...aortaPts]
  const ride = new THREE.CatmullRomCurve3(ridePts, false, 'centripetal')
  const RL = ride.getLength()
  const RN = 2000
  const rideLens = ride.getLengths(RN)
  const sOfIndex = i => rideLens[Math.round((i / (ridePts.length - 1)) * RN)]
  // the indices of the way's landmarks in ridePts
  const LA_I = veinPts.length - 2
  const IDX = { start: 1, la: LA_I, mitral: LA_I + 1, lvTop: LA_I + 2, apex: LA_I + 4, aortic: LA_I + 7, aortaTop: LA_I + 9, down: LA_I + 14 }
  const S = Object.fromEntries(Object.entries(IDX).map(([k, i]) => [k, sOfIndex(i)]))
  const S0 = S.start
  // how fast the cell goes along the way (m/s): slow through the valve, waiting low in the ventricle, then
  // thrown out with the squeeze, slowing as the artery narrows
  function vAt(s) {
    let v = 2.4
    if (Math.abs(s - S.mitral) < 1.4) v = 1.1
    if (s > S.lvTop && s < S.apex + 0.6) v = 0.95
    if (s >= S.apex + 0.6 && s < S.aortaTop) v = 4.2
    if (s >= S.aortaTop && s < S.down) v = 3.2
    v = Math.min(v, 0.4 + (s - S0) * 1.2)
    v = Math.min(v, 0.15 + (RL - s) * 0.9)
    return Math.max(0.15, v)
  }
  // the timetable: where the cell is at each moment of the ride (the same on every screen)
  const table = [S0]
  {
    let s = S0
    const step = 1 / 30
    while (s < RL - 0.01 && table.length < 4000) {
      s = Math.min(RL, s + vAt(s) * step)
      table.push(s)
    }
  }
  const RIDE_T = (table.length - 1) / 30
  const sAt = a => {
    if (a <= 0) return S0
    const f = a * 30
    const i = Math.floor(f)
    if (i >= table.length - 1) return RL
    return lerp(table[i], table[i + 1], f - i)
  }
  const legOf = s => (s < S.la - 0.6 ? 'vein' : s < S.mitral - 0.7 ? 'atrium' : s < S.mitral + 0.6 ? 'valve' : s < S.aortic + 0.3 ? 'ventricle' : s < S.down ? 'aorta' : s < RL - 1.2 ? 'artery' : 'muscle')
  const LEG_S = { vein: [S0, S.la - 0.6], atrium: [S.la - 0.6, S.mitral - 0.7], valve: [S.mitral - 0.7, S.mitral + 0.6], ventricle: [S.mitral + 0.6, S.aortic + 0.3], aorta: [S.aortic + 0.3, S.down], artery: [S.down, RL - 1.2], muscle: [RL - 1.2, RL] }
  const legK = (leg, s) => clamp((s - LEG_S[leg][0]) / Math.max(0.01, LEG_S[leg][1] - LEG_S[leg][0]))

  // the cells you ride: one waiting in the vein, one under way (then parked at the muscle)
  const carGeo = rbcGeometry(CAR_D, 48)
  const makeCar = () => {
    const mat = new THREE.MeshStandardMaterial({ color: BRIGHT.clone(), roughness: 0.32, metalness: 0.05, emissive: '#5a0814', emissiveIntensity: 0.45 })
    const g = new THREE.Group()
    const m = new THREE.Mesh(carGeo, mat)
    g.add(m)
    // a soft shine on its rim, and a few O2 riding on top
    const o2s = new THREE.Group()
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU + 0.4
      const pair = new THREE.Group()
      for (const s of [-1, 1]) {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), seatO)
        ball.position.x = s * 0.055
        pair.add(ball)
      }
      pair.position.set(Math.cos(a) * 0.4, 0.2, Math.sin(a) * 0.4)
      pair.rotation.y = a
      o2s.add(pair)
    }
    g.add(o2s)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(CAR_D * 0.62, CAR_D * 0.62, 0.7, 16), ghost)
    g.add(hit)
    root.add(g)
    return { g, mat, o2s, hit }
  }
  const waiting = makeCar()
  const rider = makeCar()
  rider.g.visible = false
  const carLight = new THREE.PointLight('#ff8a9a', light ? 0 : 3, 5, 1.6)
  if (!light) root.add(carLight)
  const RIDE = { n: 0, start: -99, mine: false, sound: false, said: '' }
  const rideAge = () => clock - RIDE.start
  const rideBusy = () => RIDE.n > 0 && rideAge() < RIDE_T + PARK_T
  const carFwd = new THREE.Vector3()
  /** Put a car at arc length s, flat, facing along the way. */
  function placeCar(car, s) {
    ride.getPointAt(clamp(s / RL), car.g.position)
    ride.getTangentAt(clamp(s / RL), carFwd)
    const h = Math.hypot(carFwd.x, carFwd.z)
    if (h > 0.2) car.yaw = Math.atan2(carFwd.x, carFwd.z)
    car.g.rotation.set(0, car.yaw ?? 0, 0)
    car.g.rotateX(clamp(-Math.atan2(carFwd.y, Math.max(0.2, h)) * 0.4, -0.35, 0.35))
  }
  placeCar(waiting, S0)
  solids.push(circle(PARK.x, PARK.z, 0.8))

  // the map board by the waiting cell
  const mapBoard = screenBoard(MAP.w, MAP.h, 512, color)
  mapBoard.group.position.set(MAP.x, MAP.y, MAP.z)
  faceTo(mapBoard.group, SPOT.ride[0], SPOT.ride[1] + 0.8)
  root.add(mapBoard.group)
  textures.push(mapBoard.tex)
  {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, MAP.y - MAP.h / 2, 8), post)
    leg.position.set(MAP.x, (MAP.y - MAP.h / 2) / 2, MAP.z - 0.05)
    root.add(leg)
    solids.push(circle(MAP.x, MAP.z, 0.3))
  }
  let mapDrawn = ''
  let mapAt = -1
  const mapState = () => {
    const a = rideAge()
    if (!RIDE.n || a > RIDE_T + PARK_T) return { leg: null, k: 0 }
    const s = sAt(a)
    const leg = legOf(s)
    return { leg, k: legK(leg, s) }
  }
  function drawMapBoard() {
    const { leg, k } = mapState()
    const key = `${leg}:${Math.round(k * 40)}`
    if (key === mapDrawn) return
    mapDrawn = key
    mapBoard.draw((g, w, h) => drawBodyMap(g, w, h, { title: E.ride.map.title, place: E.ride.map.places[leg ?? 'vein'], leg, k, color: '#ffd166' }))
  }
  // the corner map while you ride: a small canvas at the right edge, under the top bar on a computer; on an
  // upright phone the Atomling's bubble spans the top, so it stands above the prompt by the right thumb
  let mini = null
  function miniMap(on) {
    if (on && !mini && typeof document !== 'undefined') {
      const wide = window.innerWidth > 700
      mini = document.createElement('canvas')
      mini.width = wide ? 300 : 220
      mini.height = wide ? 400 : 300
      Object.assign(mini.style, {
        position: 'fixed',
        ...(wide ? { top: 'calc(var(--bar, 56px) + 8px)' } : { bottom: '104px' }),
        right: '8px',
        width: wide ? '150px' : '110px',
        height: wide ? '200px' : '150px',
        pointerEvents: 'none',
        zIndex: 15,
        borderRadius: '12px',
        border: `2px solid ${color}`,
        boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
      })
      mini.dataset.breathMap = '1'
      document.body.appendChild(mini)
    } else if (!on && mini) {
      mini.remove()
      mini = null
    }
  }
  const rideView = { on: false, k: 0, from: null, cam: new THREE.Vector3(), look: new THREE.Vector3(), q: new THREE.Quaternion(), off: false }
  const ridePanel = lv => ({
    title: E.ride.title,
    color,
    blocks: [{ buttons: [{ label: E.ride.buttons.go, onClick: () => rideTap() }] }, ...paras(E.ride.panel, lv)],
  })
  function startRide(age, sound, mine) {
    RIDE.start = clock - age
    RIDE.sound = sound
    RIDE.mine = mine
    RIDE.said = age > 0.5 ? legOf(sAt(age)) : ''
    mapDrawn = ''
    if (mine) {
      const p = ctx.engine.player
      rideView.on = true
      rideView.off = false
      rideView.from = p.pos.clone()
      rideView.cam.copy(ctx.camera.position)
      rideView.look.copy(START)
      rideView.k = Math.max(rideView.k, 0.001)
      if (p.station) p.station = null
      ctx.store.set({ panel: null })
      miniMap(true)
    }
  }
  function rideDo() {
    if (rideBusy()) return false
    RIDE.n++
    startRide(0, true, true)
    play('select')
    share('ride')
    found('ride', ridePanel, RIDE_T + 2.4)
    return at(E.ride.says.go, level())
  }
  const rideTap = () => say(rideDo() || at(rideBusy() && RIDE.mine && rideAge() < RIDE_T ? E.ride.says.go : W.busy, level()))
  ex.add({
    id: 'ride',
    x: SPOT.ride[0],
    z: SPOT.ride[1],
    radius: 1.9,
    label: E.ride.label,
    verb: () => (rideBusy() ? (RIDE.mine && rideAge() < RIDE_T ? E.ride.hints.riding : E.ride.hints.wait) : E.ride.hints.go),
    manual: true,
    focus: focusOf((START.x + MAP.x) / 2 - 0.05, 1.45, (START.z + MAP.z) / 2, 2.4, 3.4),
    act: () => ctx.showPanel(ridePanel),
  })
  clickable(waiting.g, () => rideTap(), { when: () => !rideBusy(), reach: 7 })
  clickable(mapBoard.face, () => rideTap(), { when: () => !rideBusy(), reach: 5 })
  const look = new THREE.Vector3()
  const camAt = new THREE.Vector3()
  const lookM = new THREE.Matrix4()
  const parkHops = { n: 0 }
  updates.push((dt, t) => {
    const a = rideAge()
    const moving = RIDE.n > 0 && a < RIDE_T + PARK_T
    rider.g.visible = moving
    let s = S0
    if (moving) {
      s = sAt(a)
      placeCar(rider, s)
      const parked = a >= RIDE_T
      // at the muscle it gives its oxygen and darkens, then fades away (back to the lungs on its own)
      const give = parked ? span(0.2, 3.0, a - RIDE_T) : 0
      cellColor(lerp(ART, effAt('sv', effort()), give), rider.mat.color)
      rider.o2s.visible = give < 0.6
      const fade = parked ? 1 - span(PARK_T - 1.1, PARK_T, a) : 1
      rider.g.scale.setScalar(Math.max(0.01, fade))
      rider.g.position.y += Math.sin(t * 2.2) * 0.03
      carLight.position.copy(rider.g.position).add(V(0, 0.9, 0))
      carLight.intensity = light ? 0 : 3 * fade
      if (parked && a - RIDE_T < 2.6) {
        const want = Math.floor(span(0.1, 2.6, a - RIDE_T) * 9)
        while (parkHops.n < want) {
          parkHops.n++
          const target = V(lerp(FIBRE.w0, FIBRE.w0 + 2.4, rnd()), FIBRE.y + (rnd() - 0.3) * 1.0, FIBRE.z + 0.6)
          hop(rider.g.position.clone().add(V(0, 0.25, 0)), () => target, 1.4)
        }
      } else if (!parked) parkHops.n = 0
      // the valves open as the cell passes
      if (RIDE.sound) {
        const leg = legOf(s)
        if (leg !== RIDE.said) {
          RIDE.said = leg
          if (leg === 'valve' || leg === 'aorta') play('part')
          if (leg === 'ventricle') later(0.9, () => play('pop'))
          if (RIDE.mine && E.ride.says[leg === 'muscle' ? 'arrive' : leg]) say(at(E.ride.says[leg === 'muscle' ? 'arrive' : leg], level()))
        }
      }
    } else carLight.intensity = 0
    // a new cell comes along to the start once the last one is on its way
    const show = !RIDE.n ? 1 : span(RIDE_T + PARK_T - 2, RIDE_T + PARK_T, a)
    waiting.g.visible = show > 0.01
    waiting.g.scale.setScalar(Math.max(0.01, show))
    placeCar(waiting, S0)
    waiting.g.position.y += Math.sin(t * 1.7) * 0.04
    // the valves: open as the cell comes through, else with the heartbeat
    const passing = (sv, d) => moving && Math.abs(s - sv) < d
    const mitralOpen = passing(S.mitral, 1.6) || (HB.phase > 0.45 && HB.phase < 0.95) ? 1 : 0
    const aorticOpen = passing(S.aortic, 1.6) || (HB.phase > 0.04 && HB.phase < 0.33) ? 1 : 0
    for (const lf of leaflets) {
      lf.k = damp(lf.k ?? 0, mitralOpen, 9, dt)
      lf.pivot.rotation.x = lf.sg * (0.06 + 1.2 * lf.k)
    }
    for (const c of cusps) {
      c.k = damp(c.k ?? 0, aorticOpen, 9, dt)
      c.pivot.quaternion.setFromAxisAngle(c.axis, -(0.05 + 1.15 * c.k))
    }
    // the strings follow the leaflets' edges
    beat.updateMatrixWorld(true)
    for (const c of cords) {
      const edge = V(c.dx, 0, -c.lf.sg * MITRAL.r * 0.95)
      const local = c.lf.pivot.localToWorld(edge)
      beat.worldToLocal(local)
      const pap = V(...PAPS[c.pi])
      const d = local.clone().sub(pap)
      c.m.position.copy(pap)
      c.m.quaternion.setFromUnitVectors(UP, d.clone().normalize())
      c.m.scale.set(1, d.length(), 1)
    }
    drawMapBoard()

    // ---- riding: the view follows the cell from behind, the Atomling sitting on it ----
    const v = rideView
    if (v.on) {
      const p = ctx.engine.player
      // walking away gets you off: the view comes back to where you stand
      if (!v.off && p.pos.distanceTo(v.from) > 0.45) v.off = true
      if (v.off || !RIDE.mine || RIDE.n === 0) v.on = false
      else if (a >= RIDE_T + 0.4) {
        // arrived: put the walker down by the muscle, facing the power station
        v.on = false
        ctx.engine.teleport?.(ARRIVE.x, ARRIVE.z, Math.atan2(-(LENS2.x - ARRIVE.x), -(LENS2.z - ARRIVE.z)), -0.05)
      }
    }
    v.k = damp(v.k, v.on ? 1 : 0, v.on ? 2.6 : 3.2, dt)
    if (!v.on && v.k < 0.01) {
      v.k = 0
      if (mini) miniMap(false)
      if (v.scaled) {
        v.scaled.root.scale.setScalar(1)
        v.scaled = null
      }
    }
    if (v.k > 0.001) {
      // behind the cell and a little above it, inside the vessel, looking down the way ahead; through the
      // heart the view stands in front of it and watches the cell go through the chambers
      const sNow = sAt(Math.min(a, RIDE_T))
      ride.getPointAt(clamp(Math.max(S0 - 1.6, sNow - 2.3) / RL), camAt)
      camAt.y += 0.5
      ride.getPointAt(clamp((sNow + 2.6) / RL), look)
      look.y += 0.12
      const inHeart = span(S.la - 3.2, S.la - 1.0, sNow) * (1 - span(S.aortaTop - 0.6, S.aortaTop + 1.6, sNow))
      if (inHeart > 0) {
        camAt.lerp(HEART_CAM, inHeart)
        look.lerp(rider.g.position, inHeart)
      }
      v.cam.lerp(camAt, 1 - Math.exp(-(inHeart > 0.05 && inHeart < 0.95 ? 3 : 8) * dt))
      v.look.lerp(look, 1 - Math.exp(-8 * dt))
      const cam = ctx.camera
      lookM.lookAt(v.cam, v.look, UP)
      v.q.setFromRotationMatrix(lookM)
      const k = ease(v.k)
      cam.position.lerp(v.cam, k)
      cam.quaternion.slerp(v.q, k)
      // the Atomling rides on the cell, made small enough to fit in the vessels with it
      const av = ctx.engine.player.avatar
      if (av && moving && !v.off) {
        av.root.visible = true
        av.root.position.copy(rider.g.position).add(V(0, 0.1, 0))
        av.root.rotation.y = rider.yaw ?? 0
        av.root.scale.setScalar(lerp(1, 0.55, k))
        v.scaled = av
      }
      // the corner map
      if (mini && (clock - mapAt > 1 / 12 || mapAt < 0)) {
        mapAt = clock
        const { leg, k: lk } = mapState()
        drawBodyMap(mini.getContext('2d'), mini.width, mini.height, { title: E.ride.map.title, place: E.ride.map.places[leg ?? 'muscle'], leg: leg ?? 'muscle', k: leg ? lk : 1, color: '#ffd166' })
      }
    }
  })

  // =============================== the muscle ===============================
  const stripeTex = canvasTex(32, 128, (g, w, h) => {
    // one sarcomere: a thin dark Z line, the pale I band, the dark A band with its lighter middle
    g.fillStyle = '#d86a86'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#9a2a4a'
    g.fillRect(0, h * 0.22, w, h * 0.56)
    g.fillStyle = '#b8406a'
    g.fillRect(0, h * 0.44, w, h * 0.12)
    g.fillStyle = '#5a1430'
    g.fillRect(0, 0, w, h * 0.03)
  }, { repeat: true })
  textures.push(stripeTex)
  const fibreTex = stripeTex.clone()
  fibreTex.needsUpdate = true
  fibreTex.repeat.set(5, (FIBRE.x1 - FIBRE.x0) / 0.34)
  textures.push(fibreTex)
  const fibreMat = new THREE.MeshStandardMaterial({ color: '#ffffff', map: fibreTex, roughness: 0.55, emissive: '#5a1028', emissiveIntensity: 0.35, side: THREE.DoubleSide })
  const fibre = new THREE.Group()
  root.add(fibre)
  const fibrePart = (x0, x1, t0, tl) => {
    const geo = new THREE.CylinderGeometry(FIBRE.r, FIBRE.r, x1 - x0, 64, 1, true, t0, tl).rotateZ(-Math.PI / 2)
    // the stripes keep their spacing on each piece
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setY(i, (x0 - FIBRE.x0 + uv.getY(i) * (x1 - x0)) / (FIBRE.x1 - FIBRE.x0))
    const m = new THREE.Mesh(geo, fibreMat)
    m.position.set((x0 + x1) / 2, FIBRE.y, FIBRE.z)
    fibre.add(m)
    return m
  }
  // the window: cut out of the front, from a little below the middle to well above it
  const wT0 = -FIBRE.up
  const wT1 = -FIBRE.down
  const fibreParts = [fibrePart(FIBRE.x0, FIBRE.w0, 0, TAU), fibrePart(FIBRE.w0, FIBRE.w1, wT1, TAU - (wT1 - wT0)), fibrePart(FIBRE.w1, FIBRE.x1, 0, TAU)]
  {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(FIBRE.r, 32, 20), new THREE.MeshStandardMaterial({ color: '#c8507a', roughness: 0.55, emissive: '#5a1028', emissiveIntensity: 0.35 }))
    cap.scale.set(0.42, 1, 1)
    cap.position.set(FIBRE.x0, FIBRE.y, FIBRE.z)
    fibre.add(cap)
    // the window's glowing edge
    const edge = []
    const onFibre = (x, th) => V(x, FIBRE.y - FIBRE.r * Math.sin(th), FIBRE.z + FIBRE.r * Math.cos(th))
    for (let i = 0; i <= 8; i++) edge.push(onFibre(FIBRE.w0, lerp(wT0, wT1, i / 8)))
    for (let i = 1; i <= 12; i++) edge.push(onFibre(lerp(FIBRE.w0, FIBRE.w1, i / 12), wT1))
    for (let i = 1; i <= 8; i++) edge.push(onFibre(FIBRE.w1, lerp(wT1, wT0, i / 8)))
    for (let i = 1; i < 12; i++) edge.push(onFibre(lerp(FIBRE.w1, FIBRE.w0, i / 12), wT0))
    const loop = new THREE.CatmullRomCurve3(edge, true)
    fibre.add(new THREE.Mesh(new THREE.TubeGeometry(loop, 120, 0.05, 6, true), new THREE.MeshStandardMaterial({ color: '#ffc0d0', emissive: '#ff7aa0', emissiveIntensity: 0.9, roughness: 0.4 })))
  }
  // inside: the pulling threads (myofibrils), striped, and the small orange power stations between them
  const myoTex = stripeTex.clone()
  myoTex.needsUpdate = true
  myoTex.repeat.set(2, (FIBRE.w1 - FIBRE.w0 + 0.6) / 0.34)
  textures.push(myoTex)
  const myoMat = new THREE.MeshStandardMaterial({ color: '#ffffff', map: myoTex, roughness: 0.5, emissive: '#4a0c22', emissiveIntensity: 0.35 })
  const myos = new THREE.Group()
  myos.position.set((FIBRE.w0 + FIBRE.w1) / 2, FIBRE.y, FIBRE.z)
  fibre.add(myos)
  const myoGeo = new THREE.CylinderGeometry(0.17, 0.17, FIBRE.w1 - FIBRE.w0 + 0.6, 14).rotateZ(-Math.PI / 2)
  for (let ring = 0; ring < 3; ring++) {
    const rr = [0.35, 0.82, 1.27][ring]
    const n = [4, 9, 13][ring]
    for (let i = 0; i < n; i++) {
      const th = (i / n) * TAU + ring * 0.4
      const m = new THREE.Mesh(myoGeo, myoMat)
      m.position.set(0, rr * Math.sin(th), rr * Math.cos(th))
      myos.add(m)
    }
  }
  const beanMat = new THREE.MeshStandardMaterial({ color: '#ffa23c', emissive: '#d46a14', emissiveIntensity: 0.5, roughness: 0.45 })
  const NB = light ? 26 : 44
  const beans = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.075, 0.2, 4, 10).rotateZ(Math.PI / 2), beanMat, NB)
  beans.frustumCulled = false
  {
    const brnd = random(17)
    for (let i = 0; i < NB; i++) {
      // between the threads, mostly toward the window
      const th = lerp(-1.0, 1.4, brnd())
      const rr = lerp(0.55, 1.5, brnd())
      tmpM.compose(V(lerp(-1.7, 1.7, brnd()), rr * Math.sin(th), rr * Math.cos(th)), tmpQ.setFromAxisAngle(V(1, 0, 0), brnd() * 3), tmpS.setScalar(0.8 + brnd() * 0.5))
      beans.setMatrixAt(i, tmpM)
    }
  }
  myos.add(beans)
  solids.push(box((3.0 + FIBRE.x1) / 2, FIBRE.z + 0.15, FIBRE.x1 - 3.0, FIBRE.r * 2 + 0.6))
  // the muscle's board
  const board = screenBoard(BOARD.w, BOARD.h, 768, '#ff9a5a')
  board.group.rotation.order = 'YXZ'
  board.group.position.set(BOARD.x, BOARD.y, BOARD.z)
  faceTo(board.group, SPOT.muscle[0], SPOT.muscle[1] + 2)
  board.group.rotation.x = -BOARD.tilt
  root.add(board.group)
  textures.push(board.tex)
  {
    // two short posts down to the top of the fibre
    const top = FIBRE.y + FIBRE.r - 0.1
    const foot = BOARD.y - (BOARD.h / 2) * Math.cos(BOARD.tilt)
    for (const sg of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, foot - top + 0.1, 8), post)
      leg.position.set(BOARD.x + sg * (BOARD.w / 2 - 0.3), (foot + top) / 2, BOARD.z - 0.1)
      root.add(leg)
    }
  }
  let boardDrawn = ''
  function drawBoard() {
    const lv = level()
    const e = effort()
    const key = `${lv}:${Math.round(e * 100)}`
    if (key === boardDrawn) return
    boardDrawn = key
    const B = E.muscle.board
    const sci = lv === 'scientist'
    board.draw((g, w, h) => {
      g.fillStyle = '#0d1030'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#ffb27e'
      fitText(g, E.muscle.levels[levelOf(e)], 34, 52, 54, w * 0.5, 800)
      // the effort bar: rest, walk, run, sprint
      const bx0 = w * 0.56
      const bx1 = w - 40
      g.strokeStyle = 'rgba(255,178,126,0.4)'
      g.lineWidth = 10
      g.lineCap = 'round'
      g.beginPath()
      g.moveTo(bx0, 52)
      g.lineTo(bx1, 52)
      g.stroke()
      g.strokeStyle = '#ffb27e'
      g.beginPath()
      g.moveTo(bx0, 52)
      g.lineTo(lerp(bx0, bx1, e), 52)
      g.stroke()
      for (let i = 0; i < 4; i++) {
        g.fillStyle = i / 3 <= e + 0.01 ? '#ffb27e' : '#3a2a4a'
        g.beginPath()
        g.arc(lerp(bx0, bx1, i / 3), 52, 9, 0, TAU)
        g.fill()
      }
      const rows = [
        [B.o2, `${nf(effAt('o2', e), 2)} L${B.perMin}`],
        [B.heart, `${nf(effAt('hr', e))}${B.perMin}`],
        [B.breaths, `${nf(effAt('br', e))}${B.perMin}`],
        ...(sci ? [[B.pumped, `${nf(effAt('co', e))} L${B.perMin}`]] : []),
        [B.left, fill(B.full, { n: nf(effAt('sv', e) * 100) })],
      ]
      const y0 = sci ? 112 : 128
      const dy = sci ? 54 : 72
      rows.forEach(([label, value], i) => {
        const y = y0 + i * dy
        g.fillStyle = '#e6dcf6'
        fitText(g, label, 36, y, 38, w * 0.55, 700)
        g.fillStyle = '#ffffff'
        fitText(g, value, w - 36, y, 44, w * 0.38, 800, 'right')
      })
      // the blood leaving, as a colour
      const sv = effAt('sv', e)
      const ly = y0 + (rows.length - 1) * dy
      g.fillStyle = cellColor(sv, tmpC).getStyle()
      g.beginPath()
      g.ellipse(w * 0.6, ly, 26, 16, 0, 0, TAU)
      g.fill()
      if (e >= QUICK) {
        g.fillStyle = '#ffd166'
        wrapText(g, B.quick, w / 2, h - 36, 30, w - 50, 58, 800, 'center')
      }
    })
  }
  // effort: shared { effort, n }
  const musclePanel = lv => ({
    title: E.muscle.title,
    color: '#ff9a5a',
    blocks: [
      { slider: { label: at(E.muscle.slider, lv), min: 0, max: 100, step: 1, value: Math.round(MUS.effort * 100), onInput: v => slideEffort(Number(v) / 100), format: v => E.muscle.levels[levelOf(Number(v) / 100)], live: () => Math.round(MUS.effort * 100) } },
      { buttons: LEVELS.map((k, i) => ({ label: E.muscle.levels[k], onClick: () => setEffort(i / 3, true) })) },
      ...paras(E.muscle.panel, lv),
    ],
  })
  function setEffort(e, tell) {
    const was = levelOf(MUS.effort)
    MUS.effort = clamp(e)
    MUS.n++
    MUS.mine = true
    share('muscle')
    found('muscle', musclePanel, 3.2)
    const now = levelOf(MUS.effort)
    if (tell || now !== was) say(at(E.muscle.says[now], level()))
  }
  let slidingE = false
  function slideEffort(e) {
    const was = levelOf(MUS.effort)
    MUS.effort = clamp(e)
    MUS.mine = true
    found('muscle', musclePanel, 3.2)
    const now = levelOf(MUS.effort)
    if (now !== was) say(at(E.muscle.says[now], level()))
    if (slidingE) return
    slidingE = true
    later(0.25, () => {
      slidingE = false
      MUS.n++
      share('muscle')
    })
  }
  /** A tap on the fibre: the next effort up (rest after a sprint). */
  const muscleTap = () => {
    const i = Math.round(MUS.effort * 3)
    play(i >= 3 ? 'part' : 'join', { order: Math.min(3, i + 1) })
    setEffort(i >= 3 ? 0 : (i + 1) / 3, true)
  }
  ex.add({
    id: 'muscle',
    x: SPOT.muscle[0],
    z: SPOT.muscle[1],
    radius: 1.9,
    label: E.muscle.label,
    verb: () => (MUS.effort > 0.95 ? E.muscle.hints.rest : E.muscle.hints.work),
    manual: true,
    focus: focusOf(BOARD.x, 2.75, -4.0, 4.3, 4.2),
    act: () => ctx.showPanel(musclePanel),
  })
  for (const m of fibreParts) clickable(m, () => muscleTap(), { reach: 8 })
  clickable(myos, () => muscleTap(), { reach: 8 })
  clickable(board.face, () => muscleTap(), { reach: 6 })
  let musHopAcc = 0
  let pull = 0
  updates.push((dt, t) => {
    const e = effort()
    // the muscle's capillary: bright in, darker out, the harder the darker
    const v = 0.3 + 0.6 * e
    musFlow.phase = (musFlow.phase + v * dt) % musFlow.L
    const sOut = effAt('sv', e)
    placeFlow(musFlow, N_SAC, t, u => lerp(ART, sOut, span(0.05, 0.85, u)))
    musHopAcc += dt * (v / (musFlow.L / N_MUS)) * (ART - sOut) * 4 * (light ? 0.3 : 0.5)
    while (musHopAcc >= 1) {
      musHopAcc -= 1
      const cands = []
      for (let i = 0; i < N_MUS; i++) {
        const u = musFlow.s[i] / musFlow.L
        if (u > 0.35 && u < 0.8) cands.push(i)
      }
      if (!cands.length) break
      const i = cands[Math.floor(rnd() * cands.length)]
      const tgt = V(clamp(musFlow.pos[i].x + (rnd() - 0.5) * 0.8, FIBRE.w0 + 0.2, FIBRE.w1 - 0.2), FIBRE.y + rnd() * 0.9, FIBRE.z + 0.5 + rnd() * 0.5)
      hop(musFlow.pos[i], () => tgt, 1.1)
    }
    // pulling: the threads shorten in time with the steps
    const f = [0, 0.9, 1.4, 2.2]
    const hz = lerp(f[Math.min(2, Math.floor(e * 3))], f[Math.min(3, Math.floor(e * 3) + 1)], e * 3 - Math.min(2, Math.floor(e * 3)))
    pull = e > 0.03 ? Math.pow(Math.max(0, Math.sin(t * TAU * hz * 0.5)), 2) * clamp(e * 3) : damp(pull, 0, 4, dt)
    myos.scale.x = 1 - 0.07 * pull
    for (const m of fibreParts) m.scale.set(1, 1 + 0.02 * pull, 1 + 0.02 * pull)
    beanMat.emissiveIntensity = 0.45 + 1.1 * e + 0.4 * pull
    fibreTex.offset.y = -0.002 * pull
    drawBoard()
  })

  // =============================== the power station ===============================
  const lens2 = new THREE.Group()
  lens2.position.set(LENS2.x, LENS2.y, LENS2.z)
  faceTo(lens2, SPOT.mito[0] - 0.6, SPOT.mito[1] + 0.8)
  root.add(lens2)
  const L2 = lensStand(LENS2.r, E.mito.plate, LENS2.y)
  lens2.add(L2.group)
  solids.push(circle(LENS2.x, LENS2.z, 0.35))
  // the mitochondrion as the picture draws it: an orange bean, cut open, its folds inside
  const mito = new THREE.Group()
  L2.content.add(mito)
  const mitoOuter = new THREE.MeshStandardMaterial({ color: '#ff9a3c', roughness: 0.45, emissive: '#d46a14', emissiveIntensity: 0.35 })
  const mitoInner = new THREE.MeshStandardMaterial({ color: '#ffd89a', roughness: 0.5, emissive: '#c88a3a', emissiveIntensity: 0.25 })
  const mitoFold = new THREE.MeshStandardMaterial({ color: '#ffbe66', roughness: 0.45, emissive: '#d27020', emissiveIntensity: 0.35 })
  {
    const shell = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.62, 8, 24).rotateZ(Math.PI / 2), mitoOuter)
    shell.scale.set(1, 1, 0.55)
    mito.add(shell)
    const shape = new THREE.Shape()
    const L = 0.36
    const R = 0.25
    shape.moveTo(-L, -R)
    shape.lineTo(L, -R)
    shape.absarc(L, 0, R, -Math.PI / 2, Math.PI / 2, false)
    shape.lineTo(-L, R)
    shape.absarc(-L, 0, R, Math.PI / 2, (3 * Math.PI) / 2, false)
    const face = new THREE.Mesh(new THREE.ShapeGeometry(shape, 16), mitoInner)
    face.position.z = 0.17
    mito.add(face)
    for (let i = 0; i < 7; i++) {
      const x = -0.42 + i * 0.14
      const fromTop = i % 2 === 0
      const fold = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.3, 0.04, 2, 0.02), mitoFold)
      fold.position.set(x, fromTop ? 0.09 : -0.09, 0.185)
      mito.add(fold)
    }
    mito.rotation.z = -0.22
  }
  const mitoLight = new THREE.PointLight('#ffb86a', light ? 0 : 2.5, 4, 1.8)
  mitoLight.position.set(LENS2.x, LENS2.y, LENS2.z + 1.2)
  if (!light) root.add(mitoLight)
  // the chain's screen
  const chain = screenBoard(CHAIN.w, CHAIN.h, 1024, '#ffb84d')
  chain.group.position.set(CHAIN.x, CHAIN.y, CHAIN.z)
  faceTo(chain.group, SPOT.mito[0] + 0.3, SPOT.mito[1] + 0.8)
  root.add(chain.group)
  textures.push(chain.tex)
  {
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, CHAIN.y - CHAIN.h / 2, 8), post)
      const off = V(s * (CHAIN.w / 2 - 0.2), 0, 0).applyAxisAngle(UP, chain.group.rotation.y)
      leg.position.set(CHAIN.x + off.x, (CHAIN.y - CHAIN.h / 2) / 2, CHAIN.z + off.z - 0.05)
      root.add(leg)
      solids.push(circle(CHAIN.x + off.x, CHAIN.z + off.z, 0.2))
    }
  }
  // the sugar: a glucose ring of five carbons and an oxygen
  const sugar = new THREE.Group()
  sugar.position.copy(SUGAR)
  root.add(sugar)
  const sugarHalves = [new THREE.Group(), new THREE.Group()]
  {
    const cMat = new THREE.MeshStandardMaterial({ color: '#3a3f4b', roughness: 0.4, emissive: '#1a1c22', emissiveIntensity: 0.3 })
    const stick = new THREE.MeshStandardMaterial({ color: '#d8d8e0', roughness: 0.4 })
    const ring = []
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU
      ring.push(V(Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0))
    }
    ring.forEach((p, i) => {
      const half = sugarHalves[i < 3 ? 0 : 1]
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), i === 0 ? seatO : cMat)
      ball.position.copy(p)
      half.add(ball)
      const q = ring[(i + 1) % 6]
      const d = q.clone().sub(p)
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, d.length(), 6), stick)
      st.position.copy(p).addScaledVector(d, 0.5)
      st.quaternion.setFromUnitVectors(UP, d.normalize())
      if (i !== 2 && i !== 5) half.add(st)
    })
    sugar.add(...sugarHalves)
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), ghost)
    sugar.add(hit)
  }
  const sugarHome = SUGAR.clone()
  const SPLIT = V(4.65, 1.75, -2.25)
  const lensCentre = new THREE.Vector3()
  // ATP: little capsules popping out (the quick way's two from the split, about 28 from the mitochondrion)
  const atpTex = capsuleTex('ATP', '#ffd84d', '#6a4a00')
  textures.push(atpTex)
  const ATP_N = 34
  const atps = Array.from({ length: ATP_N }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: atpTex, transparent: true, depthWrite: false }))
    s.scale.set(0.3, 0.15, 1)
    s.visible = false
    root.add(s)
    return { s, t0: 0, life: 1, from: new THREE.Vector3(), vel: new THREE.Vector3() }
  })
  let atpNext = 0
  const popAtp = (from, delay = 0) => {
    const a = atps[atpNext++ % ATP_N]
    a.t0 = clock + delay
    a.life = 1.5
    a.from.copy(from)
    a.vel.set((rnd() - 0.5) * 1.2, 0.7 + rnd() * 0.6, 0.5 + rnd() * 0.6)
  }
  // shared { n, age } (the featured turn) and the sugar { sn, sAge, quick }
  const MITO = { n: 0, start: -99, sn: 0, sStart: -99, quick: false, mine: false, smine: false, sound: false, ssound: false, popped: 0 }
  const featAge = () => clock - MITO.start
  const sugarAge = () => clock - MITO.sStart
  const featBusy = () => featAge() < FEATURE_T
  const sugarBusy = () => sugarAge() < SUGAR_T
  const mitoPanel = lv => ({
    title: E.mito.title,
    color: '#ffb84d',
    blocks: [{ buttons: [{ label: E.mito.buttons.watch, onClick: () => watchTap() }, { label: E.mito.buttons.sugar, onClick: () => sugarTap() }] }, ...paras(E.mito.panel, lv)],
  })
  function watchDo() {
    if (featBusy()) return false
    MITO.n++
    MITO.start = clock
    MITO.mine = true
    MITO.sound = true
    chainPhase = 0
    play('select')
    share('mito')
    found('mito', mitoPanel, FEATURE_T + 0.5)
    return at(E.mito.says.watch, level())
  }
  const watchTap = () => say(watchDo() || at(W.busy, level()))
  function startSugar(age, sound, quick) {
    MITO.sStart = clock - age
    MITO.quick = quick
    MITO.ssound = sound
    MITO.popped = age > 1.4 ? (quick ? 2 : age > 4.6 ? 30 : 2) : 0
  }
  function sugarDo() {
    if (sugarBusy()) return false
    MITO.sn++
    MITO.smine = true
    startSugar(0, true, effort() >= QUICK)
    play('tap')
    share('mito')
    found('mito', mitoPanel, SUGAR_T + 0.5)
    return at(MITO.quick ? E.mito.says.quick : E.mito.says.sugar, level())
  }
  const sugarTap = () => say(sugarDo() || at(W.busy, level()))
  ex.add({
    id: 'mito',
    x: SPOT.mito[0],
    z: SPOT.mito[1],
    radius: 1.9,
    label: E.mito.label,
    verb: () => (MITO.n && !MITO.sn ? E.mito.hints.sugar : E.mito.hints.watch),
    manual: true,
    focus: focusOf((LENS2.x + CHAIN.x) / 2 + 0.1, 2.2, (LENS2.z + CHAIN.z) / 2, 2.4, 4.9),
    act: () => ctx.showPanel(mitoPanel),
  })
  clickable(L2.hit, () => watchTap(), { reach: 6 })
  clickable(chain.face, () => watchTap(), { reach: 6 })
  clickable(sugar, () => sugarTap(), { when: () => !sugarBusy(), reach: 6 })

  // the chain's picture: the inner wall across the middle, the matrix below, H+ above
  let chainPhase = 0
  let chainAt = -1
  const hRnd = random(5)
  const POOL = Array.from({ length: 16 }, () => [60 + hRnd() * 900, 80 + hRnd() * 120, hRnd() * TAU])
  function drawChain(lv) {
    const sci = lv === 'scientist'
    const C = E.mito.chain
    const featured = featBusy()
    const ph = chainPhase % 1
    const sAgeNow = sugarAge()
    chain.draw((g, w, h) => {
      g.fillStyle = '#120c2a'
      g.fillRect(0, 0, w, h)
      // the space between the two membranes, H+ crowding in it
      g.fillStyle = '#1c1446'
      g.fillRect(0, 60, w, 172)
      // the matrix
      g.fillStyle = '#3a1a14'
      g.fillRect(0, 300, w, 222)
      g.fillStyle = '#ffd6a0'
      fitText(g, at(C.title, lv), 30, 32, 46, w - 60, 800)
      // the membrane: two rows of heads
      g.fillStyle = '#c9765a'
      g.fillRect(0, 242, w, 46)
      g.fillStyle = '#ffb48a'
      for (let x = 8; x < w; x += 22) {
        g.beginPath()
        g.arc(x, 240, 9, 0, TAU)
        g.arc(x, 290, 9, 0, TAU)
        g.fill()
      }
      // the complexes
      const blob = (x0, y0, x1, y1, col, label) => {
        g.fillStyle = col
        g.beginPath()
        g.roundRect(x0, y0, x1 - x0, y1 - y0, 22)
        g.fill()
        if (sci && label) {
          g.fillStyle = '#0d1030'
          g.font = `800 34px ${FONT}`
          g.textAlign = 'center'
          g.textBaseline = 'middle'
          g.fillText(label, (x0 + x1) / 2, (y0 + y1) / 2)
        }
      }
      blob(120, 206, 238, 304, '#8a6cff', 'I')
      blob(146, 296, 214, 404, '#8a6cff', '')
      blob(392, 202, 482, 318, '#4aa8ff', 'III')
      blob(588, 200, 690, 326, '#3fd6a6', 'IV')
      // the turbine: a ring in the wall, a stalk, a head turning in the matrix
      const turn = chainPhase * TAU * 3
      blob(826, 222, 904, 308, '#ffb84d', '')
      g.fillStyle = '#e09030'
      g.fillRect(858, 306, 14, 54)
      g.save()
      g.translate(865, 412)
      g.rotate(turn)
      for (let i = 0; i < 6; i++) {
        g.fillStyle = i % 2 ? '#ffcf70' : '#ffa23c'
        g.beginPath()
        g.moveTo(0, 0)
        g.arc(0, 0, 50, (i / 6) * TAU, ((i + 1) / 6) * TAU)
        g.fill()
      }
      g.restore()
      g.fillStyle = '#ffe6b0'
      fitText(g, at(C.turbine, lv), 865, 492, 32, 230, 800, 'center')
      // electrons from food
      g.fillStyle = '#ffd84d'
      g.beginPath()
      g.roundRect(30, 430, 120, 50, 25)
      g.fill()
      g.fillStyle = '#4a3200'
      if (sci) chem(g, at(C.food, lv), 90, 455, 30, 'center')
      else fitText(g, at(C.food, lv), 90, 455, 24, 112, 800, 'center')
      // H+ waiting above (the gradient)
      const hplus = (x, y, a = 1) => {
        g.globalAlpha = a
        g.fillStyle = '#9fd8ff'
        g.beginPath()
        g.arc(x, y, 13, 0, TAU)
        g.fill()
        g.fillStyle = '#0d2040'
        chem(g, 'H+', x - 1, y + 1, 18, 'center')
        g.globalAlpha = 1
      }
      for (const [x, y, p] of POOL) hplus(x + Math.sin(chainPhase * 6 + p) * 6, y + Math.cos(chainPhase * 5 + p) * 5, 0.75)
      // four electrons a turn, each pumping H+ at I, III and IV, then waiting for the oxygen
      const path = [[90, 430], [180, 380], [180, 262], [436, 262], [452, 214], [618, 214], [640, 262], [640, 352]]
      const along = u => {
        const segs = path.length - 1
        const f = clamp(u) * segs
        const i = Math.min(segs - 1, Math.floor(f))
        return [lerp(path[i][0], path[i + 1][0], f - i), lerp(path[i][1], path[i + 1][1], f - i)]
      }
      const eStart = [0, 0.1, 0.2, 0.3]
      const eDur = 0.48
      let waiting = 0
      for (let k = 0; k < 4; k++) {
        const u = (ph - eStart[k]) / eDur
        if (u < 0) continue
        if (u >= 1) {
          if (ph < 0.86) waiting++
          continue
        }
        const [x, y] = along(u)
        const gl = g.createRadialGradient(x, y, 0, x, y, 22)
        gl.addColorStop(0, 'rgba(255,250,200,1)')
        gl.addColorStop(1, 'rgba(255,230,80,0)')
        g.fillStyle = gl
        g.beginPath()
        g.arc(x, y, 22, 0, TAU)
        g.fill()
        // pumping: an H+ rising through each complex as the electron passes it
        for (const [cx, u0] of [[180, 2 / 7], [436, 3.6 / 7], [640, 6 / 7]]) {
          const q = (u - u0) / 0.16
          if (q > 0 && q < 1) hplus(cx + 26, lerp(360, 150, q))
        }
      }
      // waiting electrons at the oxygen's place
      for (let k = 0; k < waiting; k++) {
        g.fillStyle = '#fff4a0'
        g.beginPath()
        g.arc(612 + k * 18, 352, 8, 0, TAU)
        g.fill()
      }
      // the oxygen comes in from the blood, catches the four with four H+, and is water
      const oxy = (x, y, a = 1) => {
        g.globalAlpha = a
        for (const dx of [-13, 13]) {
          g.fillStyle = '#f2302b'
          g.beginPath()
          g.arc(x + dx, y, 16, 0, TAU)
          g.fill()
        }
        g.globalAlpha = 1
      }
      const water = (x, y, a) => {
        g.globalAlpha = a
        g.fillStyle = '#f2302b'
        g.beginPath()
        g.arc(x, y, 15, 0, TAU)
        g.fill()
        g.fillStyle = '#eef1f8'
        for (const dx of [-17, 17]) {
          g.beginPath()
          g.arc(x + dx, y + 11, 9, 0, TAU)
          g.fill()
        }
        g.globalAlpha = 1
      }
      if (ph > 0.42 && ph < 0.86) {
        const u = span(0.42, 0.7, ph)
        oxy(lerp(780, 650, u), lerp(500, 400, u))
        g.fillStyle = '#ffc0c0'
        if (u < 0.6) fitText(g, at(C.oxygen, lv), lerp(780, 650, u), lerp(500, 400, u) + 36, 30, 200, 800, 'center')
        // the four H+ from the matrix gathering in
        if (ph > 0.74) for (let k = 0; k < 4; k++) hplus(lerp(560 + k * 50, 646, span(0.74, 0.86, ph)), lerp(470, 404, span(0.74, 0.86, ph)))
      }
      if (ph >= 0.86) {
        const u = span(0.86, 1, ph)
        water(lerp(630, 520, u), lerp(400, 470, u), 1 - u * 0.6)
        water(lerp(660, 720, u), lerp(400, 480, u), 1 - u * 0.6)
        g.fillStyle = '#d8f0ff'
        if (sci) chem(g, at(C.water, lv), 640, 360, 30, 'center')
        else fitText(g, at(C.water, lv), 640, 356, 40, 220, 800, 'center')
      }
      // H+ falling back through the turbine, ATP coming out
      for (let k = 0; k < 6; k++) {
        const q = (ph * 6 + k / 6) % 1
        if (q < 0.5) hplus(866, lerp(180, 300, q / 0.5), 1 - q)
      }
      for (let k = 0; k < 3; k++) {
        const q = (ph + k / 3) % 1
        g.globalAlpha = 1 - q
        g.drawImage(atpTex.image, lerp(905, 960, q), lerp(400, 330, q), 90, 45)
        g.globalAlpha = 1
      }
      // the strip at the bottom: the step while featured, the sugar's count, or the sum
      g.fillStyle = '#0d1030'
      g.fillRect(0, 522, w, h - 522)
      g.fillStyle = '#ffe6b0'
      const midY = 522 + (h - 522) / 2
      if (featured) {
        const step = ph < 0.32 ? 0 : ph < 0.62 ? 1 : ph < 0.88 ? 2 : 3
        g.fillStyle = '#fff4a0'
        g.font = `800 40px ${FONT}`
        g.textAlign = 'left'
        g.fillText(`${step + 1}.`, 26, midY)
        g.fillStyle = '#ffe6b0'
        const text = C.steps[depthOf(lv)][step]
        if (sci && /[A-Z]\d|H\+|e−/.test(text)) {
          const tw = chem(g, text, 0, 0, 38, 'left', true)
          const s = Math.min(38, (38 * (w - 110)) / Math.max(1, tw))
          chem(g, text, 76, midY, s)
        } else wrapText(g, text, 76, midY, 40, w - 100, h - 528, 700, 'left')
      } else if (MITO.sn && sAgeNow < SUGAR_T + 8) {
        const S = C.sugar
        const quick = MITO.quick
        const two = sAgeNow > 1.2 ? 2 : 0
        const more = quick ? 0 : Math.round(28 * span(2.6, 4.8, sAgeNow))
        g.textAlign = 'left'
        g.fillStyle = '#ffd6a0'
        let x = 26
        // the pieces, shrunk together if the language's words run long
        const pieces = [[`${S.title}:`, '#ffd6a0', 38, 800], [`${two} ATP`, '#ffd84d', 38, 800], [`(${S.quick})`, '#c9b0a0', 30, 700]]
        if (quick) pieces.push([`· ${S.lactate}`, '#ffb0a0', 34, 800])
        else {
          pieces.push([`+ ${more}`, '#ffd84d', 38, 800], [`(${S.oxygen})`, '#c9b0a0', 30, 700])
          if (sAgeNow > 4.6) pieces.push([`= ${S.total}`, '#fff4a0', 38, 800])
        }
        let total = 0
        for (const [text, , size, weight] of pieces) {
          g.font = `${weight} ${size}px ${FONT}`
          total += g.measureText(text).width + 14
        }
        const k = Math.min(1, (w - 40) / total)
        for (const [text, col, size, weight] of pieces) {
          g.fillStyle = col
          g.font = `${weight} ${Math.round(size * k)}px ${FONT}`
          g.textAlign = 'left'
          g.fillText(text, x, midY)
          x += g.measureText(text).width + 14 * k
        }
      } else {
        g.fillStyle = '#ffe6b0'
        const text = at(C.sum, lv)
        if (sci) chem(g, text, w / 2, midY, 42, 'center')
        else fitText(g, text, w / 2, midY, 42, w - 60, 800, 'center')
      }
    })
  }
  const sp = new THREE.Vector3()
  updates.push((dt, t) => {
    const fa = featAge()
    const featured = fa < FEATURE_T
    const period = featured ? FEATURE_T : lerp(5.5, 2.4, effort())
    chainPhase += dt / period
    if (featured && MITO.sound && fa > FEATURE_T * 0.86 && fa - dt <= FEATURE_T * 0.86) play('join', { order: 2 })
    // the mitochondrion glows while it works, more when tapped
    const work = 0.35 + 0.5 * effort() + (featured ? 0.5 + 0.3 * Math.sin(fa * 6) : 0)
    mitoOuter.emissiveIntensity = work
    mitoFold.emissiveIntensity = work
    mitoLight.intensity = light ? 0 : 1.5 + 2 * work
    mito.rotation.y = Math.sin(t * 0.4) * 0.35
    // redraw the screen when someone is near enough to read it
    const camD = ctx.camera.position.distanceTo(chain.group.position)
    const hz = light ? 10 : 20
    if ((camD < 13 || featured) && clock - chainAt > 1 / hz) {
      chainAt = clock
      drawChain(level())
    } else if (chainAt < 0) {
      chainAt = clock
      drawChain(level())
    }
    // the sugar
    const sa = sugarAge()
    lens2.getWorldPosition(lensCentre)
    lensCentre.add(V(0, 0, 0.3).applyAxisAngle(UP, lens2.rotation.y))
    if (MITO.sn && sa < SUGAR_T) {
      if (sa < 1.0) {
        sugar.position.copy(sugarHome).lerp(SPLIT, ease(sa / 1.0))
        sugarHalves.forEach(hf => hf.position.set(0, 0, 0))
      } else {
        sugar.position.copy(SPLIT)
        const u = span(1.0, 1.4, sa)
        sugarHalves[0].position.set(-0.18 * u, 0.1 * u, 0)
        sugarHalves[1].position.set(0.18 * u, -0.1 * u, 0)
        if (MITO.popped < 2 && sa > 1.15) {
          MITO.popped = 2
          popAtp(SPLIT)
          popAtp(SPLIT, 0.12)
          if (MITO.ssound) play('pop')
        }
        if (sa > 1.6) {
          const q = span(1.6, 2.6, sa)
          for (const [i, hf] of sugarHalves.entries()) {
            if (MITO.quick) {
              // lactate: pale, drifting off into the blood
              hf.position.y = (i ? -0.1 : 0.1) - 0.6 * q
              hf.position.x = (i ? 0.18 : -0.18) + 0.3 * q
            } else {
              sp.copy(lensCentre).sub(SPLIT)
              hf.position.copy(sp).multiplyScalar(ease(q)).add(V(i ? 0.18 : -0.18, i ? -0.1 : 0.1, 0).multiplyScalar(1 - q))
            }
            hf.scale.setScalar(Math.max(0.01, 1 - span(0.6, 1, q)))
          }
        }
        if (!MITO.quick && sa > 2.6 && MITO.popped < 30) {
          const want = 2 + Math.floor(span(2.6, 4.6, sa) * 28)
          while (MITO.popped < want) {
            MITO.popped++
            popAtp(lensCentre)
            if (MITO.ssound && MITO.popped % 4 === 0) play('join', { order: 1 })
          }
        }
      }
      sugar.visible = true
    } else {
      // a new sugar floats by its place
      const back = MITO.sn ? span(SUGAR_T, SUGAR_T + 0.8, sa) : 1
      sugar.position.copy(sugarHome)
      sugar.position.y += Math.sin(t * 1.3) * 0.05
      sugarHalves.forEach(hf => {
        hf.position.set(0, 0, 0)
        hf.scale.setScalar(Math.max(0.01, back))
      })
      sugar.visible = back > 0.02
    }
    sugar.rotation.y = t * 0.6
    sugar.rotation.x = 0.4
    for (const a of atps) {
      const age = clock - a.t0
      a.s.visible = age >= 0 && age < a.life
      if (!a.s.visible) continue
      a.s.position.copy(a.from).addScaledVector(a.vel, age)
      a.s.position.y -= 0.25 * age * age
      a.s.material.opacity = 1 - span(a.life * 0.6, a.life, age)
    }
  })

  // =============================== every frame: the hops, the molecules ===============================
  const hp = new THREE.Vector3()
  updates.push((dt, t) => {
    for (let i = hops.length - 1; i >= 0; i--) {
      const hh = hops[i]
      const u = (clock - hh.t0) / hh.dur
      if (u >= 1) {
        hops.splice(i, 1)
        continue
      }
      const to = hh.to()
      hp.copy(hh.from).lerp(to, ease(u))
      hp.y += Math.sin(Math.PI * u) * 0.2
      molecule(hp, hh.kind, t * 3 + hh.ph, u > 0.85 ? (1 - u) / 0.15 : 1)
    }
    atomMesh.count = atomN
    atomMesh.instanceMatrix.needsUpdate = true
    if (atomMesh.instanceColor) atomMesh.instanceColor.needsUpdate = true
    atomN = 0
    cells.instanceMatrix.needsUpdate = true
    if (cells.instanceColor) cells.instanceColor.needsUpdate = true
  })
  updates.push((dt, t) => stage.update(t))

  // ---- shared with the room ----
  const round1 = v => Math.round(v * 10) / 10
  // a number from another device, kept in range (a missing one takes `d`; a 0 stays 0)
  const num = (v, a, b, d = 0) => {
    const x = Number(v)
    return clamp(v != null && Number.isFinite(x) ? x : d, a, b)
  }

  // a ray from the camera to a point, for the probes' real taps
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = obj => obj.getWorldPosition(new THREE.Vector3())

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 9.4 },
    cameraPitchMax: 0.4,
    spawn: { x: 0, z: 6.6, yaw: 0 },
    hostSpot: { x: -1.6, z: 5.6, yaw: Math.atan2(-1.6, -1.0) },
    back: { x: 0, z: 10.0, rot: Math.PI },
    stand: { x: 2.7, z: 4.3, rot: Math.atan2(-2.7, 2.1) },
    parts: {
      sac: {
        tap: () => breatheTap(), // the airway or the sac
        get air() {
          return SACS.air
        },
        get busy() {
          return breathBusy()
        },
      },
      blood: {
        tap: i => lookTap(i), // a red cell (its index), or the lens
        po2: v => {
          setPo2(v)
          share('blood')
        }, // the panel's slider (mmHg)
        get seats() {
          return subunits.filter(u => u.k > 0.5).length
        },
        get state() {
          return { po2: BL.po2, follow: BL.follow, cell: BL.cell, sat: lensSat() }
        },
      },
      ride: {
        tap: () => rideTap(), // the big red cell
        get busy() {
          return rideBusy()
        },
        get state() {
          return { n: RIDE.n, age: round1(rideAge()), T: RIDE_T, view: rideView.k, leg: RIDE.n ? legOf(sAt(rideAge())) : null }
        },
        // jump the ride to a moment (seconds), for screenshots
        at: a => {
          RIDE.start = clock - a
        },
      },
      muscle: {
        tap: () => muscleTap(), // the fibre
        set: v => setEffort(v, true), // the panel's slider (0..1)
        get effort() {
          return MUS.effort
        },
      },
      mito: {
        tap: () => watchTap(), // the power station
        sugar: () => sugarTap(), // the sugar
        get state() {
          return { n: MITO.n, sn: MITO.sn, quick: MITO.quick, popped: MITO.popped }
        },
      },
      at: {
        airway: () => airwayCurve.getPointAt(0.82),
        sac: () => sac.position.clone().add(V(0.6, 0.8, SAC.r - 0.2)),
        cell: () => {
          let best = 0
          for (let i = 0; i < N_SAC; i++) if (Math.abs(sacFlow.s[i] / sacFlow.L - 0.5) < Math.abs(sacFlow.s[best] / sacFlow.L - 0.5)) best = i
          return sacFlow.pos[best].clone()
        },
        lens1: () => world(L1.group),
        curve: () => world(curveBoard.face),
        car: () => world(waiting.g),
        fibre: () => V((FIBRE.w0 + FIBRE.w1) / 2, FIBRE.y + 0.4, FIBRE.z + 0.8),
        lens2: () => world(L2.group),
        sugar: () => world(sugar),
        chain: () => world(chain.face),
      },
      rayTo,
    },
    panels: { sac: sacPanel, blood: bloodPanel, ride: ridePanel, muscle: musclePanel, mito: mitoPanel },
    shared: {
      sac: {
        get: () => ({ n: SACS.n, air: round1(SACS.air), age: round1(Math.min(30, breathAge())) }),
        set: (s, liveSet, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const age = num(s?.age, 0, 30) + (Number(ago) || 0)
          const fresh = liveSet && n === SACS.n + 1
          SACS.mine = false
          if (n !== SACS.n) {
            SACS.n = n
            if (n) startBreath(fresh ? Math.min(age, 1) : age, fresh)
            else SACS.start = clock - 30
          }
          SACS.air = clamp(num(s?.air, 0, 1, 0.8) - drain() * (Number(ago) || 0))
        },
      },
      blood: {
        get: () => ({ po2: BL.po2, follow: BL.follow, n: BL.n }),
        set: (s, liveSet) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          BL.mine = false
          BL.po2 = clamp(Math.round(Number(s?.po2) || 0), 0, 120)
          // a cell followed: each screen follows its own next cell to the sac (the cells are each one's)
          if (s?.follow) {
            if (n !== BL.n || !BL.follow) follow(-1)
          } else {
            BL.follow = false
            BL.cell = -1
          }
          BL.n = n
        },
      },
      ride: {
        get: () => ({ n: RIDE.n, age: round1(Math.min(60, rideAge())) }),
        set: (s, liveSet, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const age = num(s?.age, 0, 60) + (Number(ago) || 0)
          const fresh = liveSet && n === RIDE.n + 1
          if (n !== RIDE.n || !liveSet) {
            RIDE.n = n
            if (n) startRide(fresh ? Math.min(age, 1) : age, fresh, false)
            else RIDE.start = clock - 60
          }
        },
      },
      muscle: {
        get: () => ({ effort: Math.round(MUS.effort * 100) / 100, n: MUS.n }),
        set: s => {
          MUS.mine = false
          MUS.effort = clamp(Number(s?.effort) || 0)
          MUS.n = Math.max(0, Math.round(Number(s?.n) || 0))
        },
      },
      mito: {
        get: () => ({ n: MITO.n, age: round1(Math.min(30, featAge())), sn: MITO.sn, sAge: round1(Math.min(30, sugarAge())), quick: MITO.quick }),
        set: (s, liveSet, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const sn = Math.max(0, Math.round(Number(s?.sn) || 0))
          const age = num(s?.age, 0, 30) + (Number(ago) || 0)
          const sAge = num(s?.sAge, 0, 30) + (Number(ago) || 0)
          MITO.mine = false
          MITO.smine = false
          if (n !== MITO.n) {
            const freshN = liveSet && n === MITO.n + 1
            MITO.n = n
            MITO.start = clock - (n ? (freshN ? Math.min(age, 1) : age) : 30)
            MITO.sound = false
            chainPhase = Math.max(0, clock - MITO.start) / FEATURE_T
          }
          if (sn !== MITO.sn) {
            const fresh = liveSet && sn === MITO.sn + 1
            MITO.sn = sn
            if (sn) startSugar(fresh ? Math.min(sAge, 1) : sAge, fresh, !!s?.quick)
            else MITO.sStart = clock - 30
          }
        },
      },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    detach() {
      miniMap(false)
      rideView.on = false
      rideView.k = 0
      if (rideView.scaled) rideView.scaled.root.scale.setScalar(1)
      rideView.scaled = null
    },
    dispose() {
      miniMap(false)
      stage.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
    },
  }
}
