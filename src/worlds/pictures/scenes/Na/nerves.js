// Sodium's picture "How does your brain send a message?" as a room (docs/knowledge/picture-rooms.md): you
// are tiny, in the warm fluid between cells (stages/body.js), beside a giant nerve fibre that runs across the
// room like a glowing tube, as in the picture: the pink cell body with its branches on the left, a bare
// stretch where every signal starts, then the pale myelin sleeves with the gaps between them, and the
// endings on the right. Sodium ions (violet) float outside it, potassium (a deeper violet) inside, a few
// chloride (green) about. Three things to do, each step chosen by tapping its thing (the user, 2026-10-30:
// pressing E through fixed steps felt passive); the prompt names the next tap, E opens the station's panel,
// whose buttons (and a slider for how hard the push is) do the same:
// - the nerve cell: tap it to send a message. In the bare stretch the blue sodium gates open, Na+ rushes in
//   and the voltmeter over the fibre traces the action potential (−70 mV to about +30 mV in about a
//   millisecond, slowed down); then the teal potassium gates let K+ out and it resets, and the signal jumps
//   along the myelinated fibre to the endings. Too gentle a push (the slider) gives a little bump and
//   nothing more: all or nothing. Each message leaves sodium inside; after three the nerve is "tired";
// - the golden pump in the same stretch: each tap is one cycle, 3 Na+ from inside out and 2 K+ in for one
//   ATP; its sign counts them and shows how many messages are ready. Each ion here stands for very many,
//   and the gradient runs down far sooner than in a real axon (the words say so);
// - the race: tap Go (or a fibre). A bare thin fibre and a myelinated one get the same signal; the clocks
//   show real time for a metre of nerve, about 8 ms against about 1 s, the race shown in slow motion and
//   then sped up so the bare one can finish.
// All three are shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<exhibit>.tap() does what a tap does, for the probes.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random } from '../../../wings/noble/kit.js'
import { bodyStage, ionCloud, ionTexture, softGlow } from '../../stages/body.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { NERVES_WORDS } from './nerves.words.js'

export const WORDS = NERVES_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const ELECTRIC = '#fff4a0'

// ---- where things are (metres; the spawn at z = 5.8 looks along -z, into the picture) ----
const AX = { y: 1.9, z: -3.6 } // the fibre's axis, along x
const RA = 0.95 // the bare membrane's radius
const RM = 1.32 // a myelin sleeve's
const SOMA = { x: -8.1, y: 2.25, z: -4.0, r: 1.85 }
const AIS = { x0: -6.0, x1: -1.7 } // the bare first stretch (the initial segment), where every signal starts
const SLEEVES = [[-1.7, 1.2], [1.65, 4.5], [4.95, 7.1]]
const NODES = [1.425, 4.725]
const END = { x0: 7.1, x1: 7.9, r1: 0.42 } // the fibre narrows into its endings
// the gates in the bare stretch: [x, angle round the axis from the front, upward positive]
const NA_GATES = [[-5.45, 0.3], [-4.55, -0.2], [-3.65, 0.34]]
const K_GATES = [[-5.0, -0.42], [-4.1, 0.55]]
const PUMP = { x: -2.45 }
const METER = { x: -4.45, y: 3.8, z: -3.35, w: 2.4, h: 1.35 }
const SIGN = { x: -2.3, y: 3.72, z: -3.2, w: 1.6, h: 1.0 }
// the race, on the right, running toward the front (left to right for a visitor facing +x): the bare lane
// farther and higher, the wrapped one nearer and lower; the board behind them
const RACE = { z0: -1.1, z1: 4.3, bare: { y: 1.22, x: 6.85, r: 0.055 }, my: { y: 0.78, x: 6.05, r: 0.085, rs: 0.2 }, nodes: 8 }
const GO = { x: 4.85, z: -1.15 }
const BOARD = { x: 8.15, y: 2.4, z: 1.6, w: 3.1, h: 1.25 }
const RACE_SPOT = { x: 3.4, z: 1.5 }

// the action potential (real milliseconds after the stimulus reaches the cell; the screen shows 0 to 4 ms)
const TH = 15 // threshold above rest: −70 to −55 mV
const MS = 0.8 // seconds of the room per millisecond on the screen
const LEAD = 0.5 // from the tap to the stretch where it starts
const crossMs = s => (0.3 * TH) / Math.max(TH, s)
function volt(ms, stim, result) {
  if (!result || ms <= 0) return -70
  if (result === 'weak') return ms <= 0.3 ? -70 + (stim * ms) / 0.3 : -70 + stim * Math.exp(-(ms - 0.3) / 0.6)
  const c = crossMs(stim)
  if (ms <= c) return -70 + (stim * ms) / 0.3
  const peak = result === 'tired' ? -44 : 30
  const u = ms - c
  if (u <= 0.45) return -55 + ((peak + 55) * (1 - Math.cos((Math.PI * u) / 0.45))) / 2
  if (result === 'tired') return -70 + (peak + 70) * Math.exp(-(u - 0.45) / 0.45)
  if (u <= 1.5) return 30 - (110 * (1 - Math.cos((Math.PI * (u - 0.45)) / 1.05))) / 2
  return -70 - 10 * Math.exp(-(u - 1.5) / 0.7)
}
// the gradient: each message leaves 3 Na+ inside and 2 K+ outside (each ball standing for very many ions;
// more flash in and out and are gone); each turn of the pump puts back 3 and 2. Past 6 extra inside, a
// message fails: three messages, then the pump.
const MAXX = 9
const PER_FIRE = 3
const K_PER_FIRE = 2
const K_MAX = 6
const FIRE_T = 3.4
const PUMP_T = 2.6
// the race: a metre of nerve at 120 m/s and at 1 m/s
const T_MY = 1000 / 120
const T_BARE = 1000
const S1 = 1.25 // seconds of the room for the wrapped fibre's 8 ms (150 times slowed)
const HOLD = S1 + 0.9
const FAST = 6.5
const RACE_T = HOLD + FAST + 0.6

function raceMs(a) {
  if (a <= 0) return 0
  const r1 = T_MY / S1
  if (a <= HOLD) return a * r1
  const t1 = HOLD * r1
  const u = clamp((a - HOLD) / FAST)
  return t1 + (T_BARE - t1) * (0.12 * u + 0.88 * u * u)
}

const axisPt = (x, a, r, out = new THREE.Vector3()) => out.set(x, AX.y + Math.sin(a) * r, AX.z + Math.cos(a) * r)
const normalAt = a => new THREE.Vector3(0, Math.sin(a), Math.cos(a))
function bez(a, b, c, d, u, out) {
  const v = 1 - u
  const k0 = v * v * v
  const k1 = 3 * v * v * u
  const k2 = 3 * v * u * u
  const k3 = u * u * u
  return out.set(k0 * a.x + k1 * b.x + k2 * c.x + k3 * d.x, k0 * a.y + k1 * b.y + k2 * c.y + k3 * d.y, k0 * a.z + k1 * b.z + k2 * c.z + k3 * d.z)
}

/** A tube along a curve, thinner toward its end (TubeGeometry's rings scaled). */
function taperTube(curve, r0, r1, seg = 16, rad = 10) {
  const geo = new THREE.TubeGeometry(curve, seg, 1, rad, false)
  const pos = geo.attributes.position
  const c = new THREE.Vector3()
  const v = new THREE.Vector3()
  for (let i = 0; i <= seg; i++) {
    curve.getPointAt(i / seg, c)
    const r = lerp(r0, r1, i / seg)
    for (let j = 0; j <= rad; j++) {
      const k = i * (rad + 1) + j
      v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c)
      pos.setXYZ(k, v.x, v.y, v.z)
    }
  }
  return geo
}

/** A lathe along +x from x0 to x1 (profile: [x, radius] pairs), placed on the fibre's axis. */
function axisLathe(profile, segs = 48) {
  const geo = new THREE.LatheGeometry(profile.map(([x, r]) => new THREE.Vector2(r, x)), segs)
  geo.rotateZ(-Math.PI / 2)
  return geo
}

/** A myelin sleeve's profile from x0 to x1: the bare radius at its ends, swelling to `r` with round shoulders. */
function sleeveProfile(x0, x1, r0, r, shoulder = 0.32) {
  const pts = []
  for (let i = 0; i <= 8; i++) {
    const k = i / 8
    pts.push([x0 + shoulder * (1 - Math.cos((k * Math.PI) / 2)), r0 + (r - r0) * Math.sin((k * Math.PI) / 2)])
  }
  for (let i = 8; i >= 0; i--) {
    const k = i / 8
    pts.push([x1 - shoulder * (1 - Math.cos((k * Math.PI) / 2)), r0 + (r - r0) * Math.sin((k * Math.PI) / 2)])
  }
  return pts
}

/** The bare membrane: translucent pink dotted with lipid heads outside, the dark plum inside seen through
 *  it; `uK` lights it as the voltage rises. */
function membraneMat(rep) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uK: { value: 0 },
      uRep: { value: new THREE.Vector2(...rep) },
      uPink: { value: new THREE.Color('#d9488f') },
      uHead: { value: new THREE.Color('#ffc2dc') },
      uInside: { value: new THREE.Color('#3a1238') },
      uGlow: { value: new THREE.Color(ELECTRIC) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uK; uniform vec2 uRep; uniform vec3 uPink; uniform vec3 uHead; uniform vec3 uInside; uniform vec3 uGlow;
      varying vec3 vN; varying vec3 vV; varying vec2 vUv;
      void main() {
        vec2 g = fract(vUv * uRep) - 0.5;
        float dots = smoothstep(0.36, 0.24, length(g));
        if (gl_FrontFacing) {
          float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
          vec3 c = mix(uPink, uHead, dots * 0.55) + uGlow * uK * 0.6;
          float a = 0.14 + 0.55 * pow(f, 1.8) + 0.1 * dots + 0.18 * uK;
          gl_FragColor = vec4(c, clamp(a, 0.0, 0.95));
        } else {
          gl_FragColor = vec4(uInside + uGlow * uK * 0.3, 0.86);
        }
        #include <colorspace_fragment>
      }`,
  })
}

/** A race lane's core: lit where the signal is, fading behind it (uFront from 0 to 1 along z0..z1). */
function laneMat(base, tail) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uFront: { value: -1 },
      uOn: { value: 0 },
      uTail: { value: tail },
      uZ0: { value: RACE.z0 },
      uZ1: { value: RACE.z1 },
      uBase: { value: new THREE.Color(base) },
      uGlow: { value: new THREE.Color(ELECTRIC) },
    },
    vertexShader: /* glsl */ `
      uniform float uZ0; uniform float uZ1;
      varying float vU; varying vec3 vN;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vU = (w.z - uZ0) / (uZ1 - uZ0);
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uFront; uniform float uOn; uniform float uTail; uniform vec3 uBase; uniform vec3 uGlow;
      varying float vU; varying vec3 vN;
      void main() {
        float d = uFront - vU;
        float k = d >= 0.0 ? exp(-d / uTail) : exp(d / 0.006);
        float lit = 0.5 + 0.5 * max(dot(normalize(vN), normalize(vec3(0.3, 1.0, 0.7))), 0.0);
        gl_FragColor = vec4(uBase * lit + uGlow * k * uOn * 1.4, 1.0);
        #include <colorspace_fragment>
      }`,
  })
}

/** A screen to draw on: a canvas on a dark board with a glowing edge, facing +z. */
function screenBoard(w, h, px, color) {
  const group = new THREE.Group()
  const tex = canvasTex(px, Math.round((px * h) / w), null, { mipmaps: false })
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#e2e2e2' }))
  face.position.z = 0.035
  const back = new THREE.Mesh(new RoundedBoxGeometry(w + 0.12, h + 0.12, 0.06, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#141a3e', roughness: 0.6, emissive: color, emissiveIntensity: 0.0 }))
  const edge = new THREE.Mesh(new RoundedBoxGeometry(w + 0.18, h + 0.18, 0.04, 2, 0.04), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 }))
  edge.position.z = -0.02
  group.add(edge, back, face)
  return { group, tex, draw: fn => tex.userData.redraw(fn) }
}

/** A little capsule with a label, for ATP and ADP. */
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
    g.font = '800 64px Outfit, Nunito, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(label, w / 2, h / 2 + 3)
  }, { mipmaps: false })
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, lang, clickable }) {
  const stage = bodyStage({ radius: 10, light })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const textures = []
  const depth = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = list => list.map(p => ({ p }))
  // a find counted; the first time, its panel opens once the step has played, unless the visitor has
  // meanwhile gone to another station and opened that one's panel
  const found = (id, panel, delay) => {
    if (!ex.discover(id)) return
    later(delay, () => {
      if (ctx.engine.player?.near?.id === id || !ctx.store.get().panel) ctx.showPanel(panel)
    })
  }
  const glowMap = softGlow()
  const rnd = random(23)
  let clock = 0
  const comma = lang !== 'en'
  const dec = (v, d) => (comma ? v.toFixed(d).replace('.', ',') : v.toFixed(d))
  const mv = v => `${v < -0.5 ? '−' : v > 0.5 ? '+' : ''}${Math.abs(Math.round(v))} mV`

  const M = {
    soma: new THREE.MeshStandardMaterial({ color: '#d8478a', roughness: 0.5, emissive: '#5a0f34', emissiveIntensity: 0.5 }),
    nucleus: new THREE.MeshStandardMaterial({ color: '#8a3fc8', roughness: 0.45, emissive: '#3a1260', emissiveIntensity: 0.6 }),
    naGate: new THREE.MeshStandardMaterial({ color: '#4aa8ff', roughness: 0.35, emissive: '#1f5fb0', emissiveIntensity: 0.45 }),
    kGate: new THREE.MeshStandardMaterial({ color: '#3fd6c6', roughness: 0.35, emissive: '#0f6a62', emissiveIntensity: 0.45 }),
    pump: new THREE.MeshStandardMaterial({ color: '#ffb84d', roughness: 0.4, emissive: '#a8620c', emissiveIntensity: 0.35 }),
    pumpDark: new THREE.MeshStandardMaterial({ color: '#c97a1c', roughness: 0.5, emissive: '#5a3008', emissiveIntensity: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: '#d8ecff', roughness: 0.1, transparent: true, opacity: 0.6, emissive: '#6a8ab0', emissiveIntensity: 0.4 }),
    wire: new THREE.MeshStandardMaterial({ color: '#c8ccd8', roughness: 0.3, metalness: 0.7 }),
    post: new THREE.MeshStandardMaterial({ color: '#6a3a6e', roughness: 0.6 }),
    axon: new THREE.MeshStandardMaterial({ color: '#c43477', roughness: 0.5, emissive: '#4a0c28', emissiveIntensity: 0.5 }),
  }
  const sleeveTex = canvasTex(64, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, h)
    // the layers of membrane wrapped round, like tape round a cable
    for (let i = 0; i < 16; i++) {
      g.fillStyle = i % 2 ? 'rgba(160,90,130,0.16)' : 'rgba(255,255,255,0.0)'
      g.fillRect(0, (i * h) / 16, w, h / 32)
    }
  }, { repeat: true })
  textures.push(sleeveTex)
  const myelinMat = () => new THREE.MeshStandardMaterial({ color: '#dba8c1', map: sleeveTex, roughness: 0.5, emissive: '#e8b040', emissiveIntensity: 0 })

  // ======== the nerve cell: a pink body with a violet nucleus, its branches reaching out ========
  const cell = new THREE.Group()
  root.add(cell)
  {
    // (an indexed sphere, so its normals stay smooth after the bumps)
    const geo = new THREE.SphereGeometry(1, 56, 36)
    const p = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const k = 1 + 0.08 * Math.sin(v.x * 3.1 + 1) * Math.sin(v.y * 2.7) + 0.06 * Math.sin(v.z * 4.3 + v.x * 2)
      v.multiplyScalar(k)
      p.setXYZ(i, v.x * SOMA.r * 1.05, v.y * SOMA.r * 0.92, v.z * SOMA.r)
    }
    geo.computeVertexNormals()
    const soma = new THREE.Mesh(geo, M.soma)
    soma.position.set(SOMA.x, SOMA.y, SOMA.z)
    cell.add(soma)
    // the nucleus shows as a violet dome on the front, as in the picture
    const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 18), M.nucleus)
    nuc.position.set(SOMA.x + 0.25, SOMA.y + 0.2, SOMA.z + SOMA.r - 0.42)
    cell.add(nuc)
    solids.push(circle(SOMA.x, SOMA.z, SOMA.r + 0.1))
  }
  // the branches (dendrites), splitting twice; their tips are where messages from other cells arrive
  const tips = []
  {
    const branch = (from, dir, len, r, d) => {
      const bend = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(len * 0.45)
      const end = from.clone().addScaledVector(dir, len)
      end.y = Math.max(0.35, end.y)
      const mid = from.clone().lerp(end, 0.5).add(bend)
      const curve = new THREE.QuadraticBezierCurve3(from, mid, end)
      cell.add(new THREE.Mesh(taperTube(curve, r, r * 0.6, 12, 8), M.soma))
      if (d > 0) {
        for (const s of [-1, 1]) {
          const axis = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(dir).normalize()
          const nd = dir.clone().applyAxisAngle(axis, s * (0.4 + rnd() * 0.3)).normalize()
          branch(end, nd, len * (0.62 + rnd() * 0.12), r * 0.6, d - 1)
        }
      } else {
        const tip = new THREE.Mesh(new THREE.SphereGeometry(r * 0.75, 10, 8), M.soma)
        tip.position.copy(end)
        cell.add(tip)
        tips.push(end.clone())
      }
    }
    const c = new THREE.Vector3(SOMA.x, SOMA.y, SOMA.z)
    for (const [dx, dy, dz, len] of [[-0.5, 0.85, 0.15, 1.7], [0.15, 1, -0.25, 1.6], [-0.9, 0.3, 0.3, 1.5], [-0.6, 0.4, -0.7, 1.6], [-0.7, -0.45, 0.45, 1.3], [0.35, 0.75, 0.55, 1.4], [-0.2, 0.2, -1, 1.5], [0.2, -0.4, 0.9, 1.1]]) {
      const dir = new THREE.Vector3(dx, dy, dz).normalize()
      branch(c.clone().addScaledVector(dir, SOMA.r * 0.9), dir, len, 0.26, 2)
    }
  }
  // the cone from the cell into the fibre
  {
    const hill = new THREE.Mesh(axisLathe([[-7.0, 1.25], [-6.6, 1.15], [-6.25, 1.02], [-6.0, RA]], 40), M.soma)
    hill.position.set(0, AX.y, AX.z)
    cell.add(hill)
  }

  // ======== the fibre: the bare stretch, myelin sleeves, nodes, the endings ========
  const aisMat = membraneMat([40, 29])
  const ais = new THREE.Mesh(new THREE.CylinderGeometry(RA, RA, AIS.x1 - AIS.x0 + 0.02, 56, 1, true).rotateZ(Math.PI / 2), aisMat)
  ais.position.set((AIS.x0 + AIS.x1) / 2, AX.y, AX.z)
  ais.renderOrder = 1
  root.add(ais)
  const sleeves = SLEEVES.map(([x0, x1]) => {
    const mat = myelinMat()
    const m = new THREE.Mesh(axisLathe(sleeveProfile(x0, x1, RA * 0.98, RM, 0.62), 56), mat)
    m.position.set(0, AX.y, AX.z)
    root.add(m)
    return { m, mat, x0, x1 }
  })
  const nodeMats = NODES.map(x => {
    const mat = membraneMat([40, 3])
    const m = new THREE.Mesh(new THREE.CylinderGeometry(RA, RA, 0.48, 48, 1, true).rotateZ(Math.PI / 2), mat)
    m.position.set(x, AX.y, AX.z)
    m.renderOrder = 1
    root.add(m)
    return mat
  })
  // the endings: the fibre narrows and splits into four branches with round buttons, passing the message on
  const buttons = []
  const endMat = M.axon
  {
    const neck = new THREE.Mesh(axisLathe([[END.x0 - 0.05, RA * 0.98], [END.x0 + 0.3, RA * 0.8], [END.x1, END.r1]], 40), endMat)
    neck.position.set(0, AX.y, AX.z)
    root.add(neck)
    const from = new THREE.Vector3(END.x1 - 0.05, AX.y, AX.z)
    for (const [dx, dy, dz] of [[1.2, 1.0, 0.3], [1.5, 0.15, 0.55], [1.3, -0.75, 0.25], [1.1, 0.4, -0.8]]) {
      const end = from.clone().add(new THREE.Vector3(dx, dy, dz))
      const mid = from.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.2, 0))
      root.add(new THREE.Mesh(taperTube(new THREE.QuadraticBezierCurve3(from, mid, end), END.r1 * 0.7, 0.15, 12, 8), endMat))
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), M.soma)
      b.position.copy(end)
      root.add(b)
      buttons.push(end)
    }
  }
  solids.push(box((AIS.x0 + END.x1) / 2 + 0.2, AX.z, END.x1 - AIS.x0 + 1.4, 2 * RM + 0.15))
  // a soft light over the bare stretch, for the gates and the pump
  const workLight = new THREE.PointLight('#ffe2f0', 7, 9, 1.6)
  workLight.position.set(-4.0, 3.0, -1.0)
  root.add(workLight)

  // the gates: blue sodium channels (two halves that part), teal potassium channels (four round a pore)
  const gates = []
  const makeGate = (kind, x, a, live) => {
    const g = new THREE.Group()
    const n = normalAt(a)
    g.position.copy(axisPt(x, a, RA))
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n)
    const parts = []
    // (short and stout: proteins through the membrane, standing out a little on each side)
    if (kind === 'Na') {
      for (const s of [-1, 1]) {
        const half = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.16, 6, 12).rotateX(Math.PI / 2).scale(1, 1.35, 1), M.naGate)
        half.position.x = s * 0.15
        g.add(half)
        parts.push({ m: half, s })
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const q = (i / 4) * TAU + Math.PI / 4
        const sub = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.14, 6, 10).rotateX(Math.PI / 2), M.kGate)
        sub.position.set(Math.cos(q) * 0.13, Math.sin(q) * 0.13, 0)
        g.add(sub)
        parts.push({ m: sub, q })
      }
    }
    root.add(g)
    const gate = { kind, x, a, n, group: g, parts, live, open: 0, mouth: axisPt(x, a, RA) }
    gates.push(gate)
    return gate
  }
  const naGates = NA_GATES.map(([x, a]) => makeGate('Na', x, a, true))
  const kGates = K_GATES.map(([x, a]) => makeGate('K', x, a, true))
  // more of them all round the stretch (only these open and close, without ions of their own)
  for (const [kind, x, a] of [['Na', -5.5, 1.2], ['K', -4.6, 1.35], ['Na', -3.6, 1.15], ['Na', -4.9, -0.95], ['K', -3.2, -0.85]]) makeGate(kind, x, a, false)
  // a few sodium gates at each node of the myelinated fibre, where they crowd together
  const nodeGates = NODES.map(x => [0.15, 1.0, -0.7].map(a => makeGate('Na', x, a, false)))
  const poseGate = (g, k) => {
    g.open = k
    for (const p of g.parts) {
      if (g.kind === 'Na') p.m.position.x = p.s * (0.15 + 0.1 * k)
      else {
        const r = 0.13 + 0.07 * k
        p.m.position.set(Math.cos(p.q) * r, Math.sin(p.q) * r, 0)
      }
    }
  }

  // ======== the ions: sodium outside, potassium inside, a little chloride ========
  const clouds = { Na: ionCloud('Na', 64), K: ionCloud('K', 40), Cl: ionCloud('Cl', 16) }
  for (const c of Object.values(clouds)) {
    root.add(c.mesh)
    disposers.push(() => c.dispose())
  }
  // outside, the sodium keeps close round the fibre, in front of it and over its shoulder, below the
  // voltmeter (so the gates and the screens stay in view); inside, anywhere
  const outHome = (x0 = AIS.x0 + 0.25, x1 = AIS.x1 - 0.1, r = rnd) => {
    const a = lerp(-0.55, 0.8, r())
    return axisPt(lerp(x0, x1, r()), a, RA + 0.26 + r() * 0.36)
  }
  // chloride low down in front, to the left of the pump
  const clHome = () => axisPt(lerp(AIS.x0 + 0.2, PUMP.x - 0.9, rnd()), lerp(-1.1, -0.7, rnd()), RA + 0.25 + rnd() * 0.25)
  const inHome = (x0 = AIS.x0 + 0.2, x1 = AIS.x1 - 0.2, r = rnd) => axisPt(lerp(x0, x1, r()), r() * TAU, Math.sqrt(r()) * (RA - 0.2))
  const ions = []
  const addIon = (kind, side, home) => {
    const o = { kind, side, home, p: home.clone(), legs: null, hold: false, ph: rnd() * TAU }
    ions.push(o)
    return o
  }
  // about ten times more sodium outside than inside, potassium the other way round (fewer balls than the
  // real ratios ask for, so the view stays clear)
  const NA_N = 22
  const K_N = 18
  const NA_IN0 = 2
  const K_OUT0 = 2
  for (let i = 0; i < NA_N; i++) addIon('Na', i < NA_IN0 ? 'in' : 'out', i < NA_IN0 ? inHome() : outHome())
  for (let i = 0; i < K_N; i++) addIon('K', i < K_OUT0 ? 'out' : 'in', i < K_OUT0 ? outHome() : inHome())
  for (let i = 0; i < 3; i++) addIon('Cl', 'out', clHome())
  addIon('Cl', 'in', inHome())
  const wob = new THREE.Vector3()
  const stepIon = (o, t, dt) => {
    if (o.legs) {
      const L = o.legs[0]
      if (clock >= L.t0) {
        if (!L.from) {
          L.from = o.p.clone()
          if (!L.c1) L.c1 = L.from.clone().lerp(L.c2, 0.4)
        }
        const u = clamp((clock - L.t0) / L.dur)
        bez(L.from, L.c1, L.c2, L.to, ease(u), o.p)
        if (u >= 1) {
          o.legs.shift()
          o.hold = true
          if (!o.legs.length) {
            o.legs = null
            o.hold = false
            o.home.copy(o.p)
          }
        }
        return
      }
      if (o.hold) return
    }
    wob.set(Math.sin(t * 0.5 + o.ph) * 0.07, Math.cos(t * 0.43 + o.ph * 1.3) * 0.07, Math.sin(t * 0.37 + o.ph * 0.7) * 0.07).add(o.home)
    o.p.x = damp(o.p.x, wob.x, 1.5, dt)
    o.p.y = damp(o.p.y, wob.y, 1.5, dt)
    o.p.z = damp(o.p.z, wob.z, 1.5, dt)
  }
  /** The free ions of a kind on a side, nearest to a point first. */
  const nearest = (kind, side, to, n, skip = new Set()) =>
    ions
      .filter(o => o.kind === kind && o.side === side && !o.legs && !skip.has(o))
      .sort((a, b) => a.p.distanceToSquared(to) - b.p.distanceToSquared(to))
      .slice(0, n)
  // flashes of sodium rushing in (at the gates of the bare stretch, at the nodes as the signal passes):
  // drawn with the sodium, gone once inside
  const bursts = []
  const burst = (x, t0) => {
    for (let i = 0; i < 5; i++) {
      const a = -0.6 + i * 0.55 + rnd() * 0.2
      bursts.push({ from: axisPt(x + (rnd() - 0.5) * 0.4, a, RA + 0.9 + rnd() * 0.4), to: axisPt(x, a, RA - 0.1), t0: t0 + i * 0.03, dur: 0.35 })
    }
  }
  const rush = (g, t0) => {
    for (let i = 0; i < 4; i++) {
      const from = g.mouth.clone().addScaledVector(g.n, 0.75 + rnd() * 0.35).add(new THREE.Vector3((rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.3, 0))
      bursts.push({ from, to: g.mouth.clone().addScaledVector(g.n, -0.35), t0: t0 + i * 0.07, dur: 0.4 })
    }
  }

  // the gradient: how much extra sodium sits inside (and potassium outside) from the messages sent
  let extra = 0
  let kOut = 0
  const canFire = () => extra <= MAXX - PER_FIRE
  const ready = () => Math.max(0, Math.floor((MAXX - extra) / PER_FIRE))
  const anyLegs = () => ions.some(o => o.legs)
  // ions leak through the membrane, slowly, until the inside and outside hold what the state says (after a
  // pump turn with nothing extra, and whenever a state came from someone else)
  let leakAt = 0
  const leak = () => {
    if (clock < leakAt || anyLegs() || fireBusy() || pumpBusy()) return
    leakAt = clock + 0.6
    const fix = (kind, inside, want) => {
      const have = ions.filter(o => o.kind === kind && o.side === 'in').length
      if (have === want) return false
      const from = have < want ? 'out' : 'in'
      const o = ions.filter(q => q.kind === kind && q.side === from).sort((a, b) => Math.abs(a.p.z - AX.z - RA) - Math.abs(b.p.z - AX.z - RA))[0]
      if (!o) return false
      const a = Math.atan2(o.p.y - AX.y, o.p.z - AX.z)
      const x = clamp(o.p.x, AIS.x0 + 0.3, AIS.x1 - 0.3)
      const n = normalAt(a)
      const P = axisPt(x, a, RA)
      const s = from === 'out' ? -1 : 1
      o.side = from === 'out' ? 'in' : 'out'
      o.legs = [{ t0: clock, dur: 2.2, c1: P.clone().addScaledVector(n, -s * 0.25), c2: P.clone().addScaledVector(n, s * 0.25), to: from === 'out' ? inHome(x - 0.4, x + 0.4) : outHome(x - 0.4, x + 0.4) }]
      return true
    }
    fix('Na', true, NA_IN0 + extra) || fix('K', true, K_N - K_OUT0 - kOut)
  }
  /** Ions put where the state says at once (someone came in late, a state from elsewhere). */
  const snapIons = () => {
    for (const [kind, want] of [['Na', NA_IN0 + extra], ['K', K_N - K_OUT0 - kOut]]) {
      const list = ions.filter(o => o.kind === kind)
      let have = list.filter(o => o.side === 'in').length
      for (const o of list) {
        o.legs = null
        o.hold = false
        if (have < want && o.side === 'out') {
          o.side = 'in'
          o.home = inHome()
          o.p.copy(o.home)
          have++
        } else if (have > want && o.side === 'in') {
          o.side = 'out'
          o.home = outHome()
          o.p.copy(o.home)
          have--
        }
      }
    }
  }

  // ======== the sparks: the signal's flashes, messages arriving at the branches, leaving at the endings ========
  const SP = light ? 70 : 140
  const spPos = new Float32Array(SP * 3)
  const spCol = new Float32Array(SP * 3)
  const spGeo = new THREE.BufferGeometry()
  spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3))
  spGeo.setAttribute('color', new THREE.BufferAttribute(spCol, 3))
  const spMat = new THREE.PointsMaterial({ size: 0.14, map: glowMap, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const sparks = new THREE.Points(spGeo, spMat)
  sparks.frustumCulled = false
  root.add(sparks)
  const spList = []
  const spBase = new THREE.Color(ELECTRIC).multiplyScalar(1.3)
  const emit = (p, v, life) => {
    if (spList.length < SP) spList.push({ p: p.clone(), v: v.clone(), life, age: 0 })
  }
  updates.push(dt => {
    for (let i = spList.length - 1; i >= 0; i--) {
      const s = spList[i]
      s.age += dt
      if (s.age >= s.life) spList.splice(i, 1)
      else s.p.addScaledVector(s.v, dt)
    }
    spList.forEach((s, i) => {
      spPos.set([s.p.x, s.p.y, s.p.z], i * 3)
      const k = 1 - s.age / s.life
      spCol.set([spBase.r * k, spBase.g * k, spBase.b * k], i * 3)
    })
    spGeo.setDrawRange(0, spList.length)
    spGeo.attributes.position.needsUpdate = true
    spGeo.attributes.color.needsUpdate = true
  })
  // the pulse itself: a bright glow where the signal is
  const pulseMat = new THREE.SpriteMaterial({ map: glowMap, color: new THREE.Color(ELECTRIC).multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })
  const pulse = new THREE.Sprite(pulseMat)
  pulse.scale.setScalar(2.4)
  root.add(pulse)

  // ======== the voltmeter: one wire inside the fibre, one in the fluid outside, the trace on its screen ========
  const meter = screenBoard(METER.w, METER.h, 1024, color)
  meter.group.position.set(METER.x, METER.y, METER.z)
  meter.group.rotation.x = 0.22
  root.add(meter.group)
  textures.push(meter.tex)
  {
    // two glass electrodes from the screen's foot: one through the membrane, one ending in the fluid
    const foot = new THREE.Vector3(METER.x - 0.55, METER.y - METER.h / 2 - 0.08, METER.z + 0.05)
    const pipe = (from, to, r0) => {
      const curve = new THREE.QuadraticBezierCurve3(from, from.clone().lerp(to, 0.5).add(new THREE.Vector3(0, 0.25, 0.15)), to)
      root.add(new THREE.Mesh(taperTube(curve, r0, 0.012, 16, 8), M.glass))
    }
    pipe(foot, axisPt(-5.25, 0.95, RA - 0.35), 0.032)
    pipe(foot.clone().add(new THREE.Vector3(0.9, 0, 0)), axisPt(-3.95, 1.0, RA + 0.55), 0.032)
    const clip = new THREE.Mesh(new RoundedBoxGeometry(1.15, 0.09, 0.09, 2, 0.03), M.post)
    clip.position.copy(foot).add(new THREE.Vector3(0.45, 0.02, 0))
    root.add(clip)
  }
  const plot = { x0: 170, x1: 990, top: 130, bottom: 520 }
  const vy = v => plot.bottom - ((v + 90) / 135) * (plot.bottom - plot.top)
  const tx = ms => plot.x0 + (ms / 4) * (plot.x1 - plot.x0)
  let meterDrawn = null
  function drawMeter(a) {
    const shown = FIRE.result ? clamp((a - LEAD) / MS, 0, 4) : 0
    const key = `${FIRE.n}:${FIRE.result}:${Math.round(shown * 100)}`
    if (key === meterDrawn) return
    meterDrawn = key
    const Vnow = volt(shown, FIRE.stim, FIRE.result)
    meter.draw((g, w, h) => {
      g.fillStyle = '#0d1030'
      g.fillRect(0, 0, w, h)
      g.font = '700 46px Outfit, Nunito, sans-serif'
      g.textBaseline = 'middle'
      g.textAlign = 'left'
      g.fillStyle = '#f2e6f8'
      g.fillText(E.fire.meter, 40, 62)
      g.textAlign = 'right'
      g.font = '800 64px Outfit, Nunito, sans-serif'
      g.fillStyle = Vnow > -50 ? '#fff4a0' : '#ffb3d4'
      g.fillText(mv(Vnow), w - 36, 62)
      // the grid: +30, 0, the threshold (dashed), rest
      g.font = '600 30px Outfit, Nunito, sans-serif'
      g.textAlign = 'right'
      for (const [v, label, dash, ink] of [[30, '+30 mV', false, '#8a8fc8'], [0, '0 mV', false, '#8a8fc8'], [-55, E.fire.threshold, true, '#ff7aa8'], [-70, `−70 mV`, false, '#8a8fc8']]) {
        g.strokeStyle = dash ? 'rgba(255,122,168,0.75)' : 'rgba(138,143,200,0.35)'
        g.lineWidth = dash ? 3 : 2
        g.setLineDash(dash ? [14, 10] : [])
        g.beginPath()
        g.moveTo(plot.x0, vy(v))
        g.lineTo(plot.x1, vy(v))
        g.stroke()
        g.fillStyle = ink
        g.fillText(label, plot.x0 - 14, vy(v))
      }
      g.setLineDash([])
      g.textAlign = 'left'
      g.fillStyle = '#8a8fc8'
      g.fillText(E.fire.rest, plot.x1 - 70, vy(-70) + 26)
      // a scale bar: one millisecond
      g.strokeStyle = '#c9cdf0'
      g.lineWidth = 5
      g.beginPath()
      g.moveTo(tx(3), plot.bottom + 26)
      g.lineTo(tx(4), plot.bottom + 26)
      g.stroke()
      g.textAlign = 'center'
      g.fillStyle = '#c9cdf0'
      g.fillText('1 ms', (tx(3) + tx(4)) / 2, plot.bottom + 52)
      // the trace: flat at rest until a message comes
      g.save()
      g.shadowColor = '#fff4a0'
      g.shadowBlur = 16
      g.strokeStyle = '#fff4a0'
      g.lineWidth = 6
      g.lineJoin = 'round'
      g.beginPath()
      const N = 220
      const end = FIRE.result ? shown : 4
      for (let i = 0; i <= N; i++) {
        const ms = (i / N) * end
        const v = volt(ms, FIRE.stim, FIRE.result)
        if (i === 0) g.moveTo(tx(ms), vy(v))
        else g.lineTo(tx(ms), vy(v))
      }
      g.stroke()
      g.restore()
      if (FIRE.result && shown < 4) {
        g.fillStyle = '#ffffff'
        g.beginPath()
        g.arc(tx(shown), vy(Vnow), 9, 0, TAU)
        g.fill()
      }
    })
  }

  // ======== the pump: two golden halves rocking open to one side, then the other ========
  const pump = new THREE.Group()
  pump.position.copy(axisPt(PUMP.x, 0, RA))
  root.add(pump)
  const halves = [-1, 1].map(s => {
    const pivot = new THREE.Group()
    const m = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.9, 0.82, 4, 0.16), M.pump)
    m.position.x = s * 0.29
    const band = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.1, 0.84, 2, 0.045), M.pumpDark)
    band.position.set(s * 0.29, 0.2, 0)
    pivot.add(m, band)
    pump.add(pivot)
    return { pivot, s }
  })
  // an invisible shape to tap: the whole pump, both sides of the membrane
  const pumpHit = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.2, 1.3), new THREE.MeshBasicMaterial({ visible: false }))
  pump.add(pumpHit)
  const pocketNa = [-0.25, 0, 0.25].map(y => new THREE.Vector3(0, y, 0))
  const pocketK = [-0.17, 0.17].map(y => new THREE.Vector3(0, y, 0))
  const P_IN = new THREE.Vector3(0, 0, -0.6)
  const P_OUT = new THREE.Vector3(0, 0, 0.65)
  const pw = v => pump.localToWorld(v.clone())
  pump.updateMatrixWorld(true)
  const atpTex = capsuleTex('ATP', '#ffd84d', '#6a4a00')
  const adpTex = capsuleTex('ADP', '#c8a85a', '#4a3a10')
  textures.push(atpTex, adpTex)
  const atp = new THREE.Sprite(new THREE.SpriteMaterial({ map: atpTex, transparent: true }))
  atp.scale.set(0.46, 0.23, 1)
  atp.visible = false
  root.add(atp)
  const atpFlash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: '#ffe680', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
  atpFlash.scale.setScalar(1.3)
  root.add(atpFlash)
  const rockAt = a => {
    // 0 closed, -1 open inward, +1 open outward
    if (a < 0 || a > PUMP_T) return 0
    if (a < 0.35) return -span(0, 0.35, a)
    if (a < 1.1) return -1
    if (a < 1.45) return lerp(-1, 1, span(1.1, 1.45, a))
    if (a < 1.95) return 1
    if (a < 2.25) return lerp(1, -1, span(1.95, 2.25, a))
    return -1 + span(2.25, PUMP_T, a)
  }
  // the pump's sign: what it has moved, and how many messages the nerve has ready
  const sign = screenBoard(SIGN.w, SIGN.h, 768, '#ffb84d')
  sign.group.position.set(SIGN.x, SIGN.y, SIGN.z)
  sign.group.rotation.set(0.2, -0.12, 0)
  root.add(sign.group)
  textures.push(sign.tex)
  let signDrawn = null
  function drawSign() {
    const done = PUMP_S.n - (pumpBusy() && pumpAge() < 1.5 ? 1 : 0)
    const r = ready()
    const key = `${done}:${r}`
    if (key === signDrawn) return
    signDrawn = key
    sign.draw((g, w, h) => {
      g.fillStyle = '#1a1230'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.textAlign = 'center'
      g.fillStyle = '#ffd27e'
      g.font = '800 44px Outfit, Nunito, sans-serif'
      g.fillText(E.pump.sign.title, w / 2, 48)
      const rows = [[ionTexture('Na').image, E.pump.sign.naOut, 3 * done], [ionTexture('K').image, E.pump.sign.kIn, 2 * done], [atpTex.image, E.pump.sign.atp, done]]
      rows.forEach(([img, label, n], i) => {
        const y = 118 + i * 70
        if (img === atpTex.image) g.drawImage(img, 36, y - 22, 88, 44)
        else g.drawImage(img, 52, y - 28, 56, 56)
        g.textAlign = 'left'
        g.fillStyle = '#f2e6f8'
        g.font = '700 38px Outfit, Nunito, sans-serif'
        g.fillText(label, 140, y)
        g.textAlign = 'right'
        g.font = '800 46px Outfit, Nunito, sans-serif'
        g.fillStyle = '#ffffff'
        g.fillText(String(n), w - 40, y)
      })
      g.strokeStyle = 'rgba(255,210,126,0.35)'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(30, 318)
      g.lineTo(w - 30, 318)
      g.stroke()
      g.textAlign = 'left'
      g.fillStyle = '#f2e6f8'
      g.font = '700 36px Outfit, Nunito, sans-serif'
      g.fillText(E.pump.sign.ready, 40, 372)
      // a lightning bolt for each message ready
      for (let i = 0; i < 3; i++) {
        const cx = w - 190 + i * 66
        const cy = 372
        g.fillStyle = i < r ? '#fff4a0' : 'rgba(255,255,255,0.14)'
        g.beginPath()
        g.moveTo(cx + 6, cy - 30)
        g.lineTo(cx - 14, cy + 4)
        g.lineTo(cx, cy + 4)
        g.lineTo(cx - 6, cy + 30)
        g.lineTo(cx + 14, cy - 6)
        g.lineTo(cx, cy - 6)
        g.closePath()
        g.fill()
      }
    })
  }

  // ======== firing the nerve ========
  const FIRE = { n: 0, stim: 25, result: null, start: -99, mine: false, sound: false, cue: 0 }
  let stimNext = 25
  const fireAge = () => clock - FIRE.start
  const fireBusy = () => fireAge() < FIRE_T
  const fireTimes = () => {
    const c = crossMs(FIRE.stim)
    const aCross = LEAD + MS * c
    return { aCross, aPeak: aCross + MS * 0.45 }
  }
  const fireCues = () => {
    const { aCross, aPeak } = fireTimes()
    if (FIRE.result === 'fire') return [[0, 'tap'], [aCross, 'beam'], [aPeak + 1.05, 'select']]
    return [[0, 'tap'], [LEAD + 0.25, 'part']]
  }
  const startFire = (age, sound) => {
    FIRE.start = clock - age
    FIRE.sound = sound
    const cues = fireCues()
    FIRE.cue = cues.findIndex(([s]) => s >= age)
    if (FIRE.cue < 0) FIRE.cue = cues.length
    meterDrawn = null
  }
  /** The ions of a message: a rush of Na+ in through each sodium gate (one stays inside), then K+ out
   *  through each potassium gate. */
  const fireIons = () => {
    const { aCross, aPeak } = fireTimes()
    const t0 = FIRE.start
    const used = new Set()
    naGates.forEach((g, gi) => {
      rush(g, t0 + aCross + gi * 0.05)
      nearest('Na', 'out', g.mouth.clone().addScaledVector(g.n, 0.6), 1, used).forEach((o, i) => {
        used.add(o)
        o.side = 'in'
        o.hold = false
        o.legs = [{ t0: t0 + aCross + gi * 0.05 + i * 0.12, dur: 0.5, c1: g.mouth.clone().addScaledVector(g.n, 0.4), c2: g.mouth.clone().addScaledVector(g.n, -0.35), to: inHome(g.x - 0.45, g.x + 0.45) }]
      })
    })
    kGates.forEach((g, gi) => {
      nearest('K', 'in', g.mouth.clone().addScaledVector(g.n, -0.5), 1, used).forEach((o, i) => {
        used.add(o)
        o.side = 'out'
        o.hold = false
        o.legs = [{ t0: t0 + aPeak + 0.05 + gi * 0.06 + i * 0.14, dur: 0.6, c1: g.mouth.clone().addScaledVector(g.n, -0.4), c2: g.mouth.clone().addScaledVector(g.n, 0.4), to: outHome(g.x - 0.5, g.x + 0.5) }]
      })
    })
  }
  const firePanel = lv => ({
    title: E.fire.title,
    color,
    blocks: [
      { slider: { label: at(E.fire.slider, lv), min: 0, max: 30, step: 1, value: stimNext, onInput: v => (stimNext = clamp(Math.round(Number(v) || 0), 0, 30)), format: v => `+${Math.round(v)} mV`, live: () => stimNext } },
      { buttons: [{ label: E.fire.buttons.fire, onClick: () => fireTap() }] },
      ...paras(E.fire.panel[depth(lv)]),
    ],
  })
  function fireDo() {
    if (fireBusy()) return false
    const result = stimNext < TH ? 'weak' : canFire() ? 'fire' : 'tired'
    FIRE.n++
    FIRE.stim = stimNext
    FIRE.result = result
    FIRE.mine = true
    startFire(0, true)
    if (result === 'fire') {
      extra += PER_FIRE
      kOut = Math.min(K_MAX, kOut + K_PER_FIRE)
      fireIons()
    }
    share('nerve')
    found('fire', firePanel, FIRE_T + 0.4)
    return at(E.fire.says[result], level())
  }
  const fireTap = () => say(fireDo() || at(W.busy, level()))
  ex.add({
    id: 'fire',
    x: -5.0,
    z: -0.1,
    radius: 2.2,
    label: E.fire.label,
    verb: () => (canFire() ? E.fire.hints.fire : E.fire.hints.tired),
    manual: true,
    focus: { x: -4.7, y: 2.8, z: -3.3, size: 4.3 },
    act: () => ctx.showPanel(firePanel),
  })
  clickable(cell, () => fireTap(), { when: () => !fireBusy(), reach: 6 })
  clickable(ais, () => fireTap(), { when: () => !fireBusy(), reach: 5 })
  const tmpV = new THREE.Vector3()
  updates.push((dt, t) => {
    const a = fireAge()
    const R = FIRE.result
    if (FIRE.sound) {
      const cues = fireCues()
      while (FIRE.cue < cues.length && a >= cues[FIRE.cue][0]) play(cues[FIRE.cue++][1])
    }
    const ms = (a - LEAD) / MS
    const V = R && a < FIRE_T + 1 ? volt(ms, FIRE.stim, R) : -70
    aisMat.uniforms.uK.value = clamp((V + 70) / 100)
    // messages from other cells arrive at the branches: sparks run to the cell body, which brightens
    if (R && a < 0.45 && rnd() < dt * 60) {
      const tip = tips[Math.floor(rnd() * tips.length)]
      tmpV.set(SOMA.x, SOMA.y, SOMA.z).sub(tip).multiplyScalar(1 / 0.45)
      emit(tip, tmpV, 0.45)
    }
    M.soma.emissiveIntensity = 0.5 + (R ? 1.1 * span(0.2, 0.45, a) * (1 - span(0.55, 1.1, a)) : 0)
    // the gates: sodium's open from the threshold to the peak, potassium's from the peak through the fall
    const { aCross, aPeak } = fireTimes()
    let naK = 0
    let kK = 0
    if (R === 'fire' || R === 'tired') {
      naK = span(aCross - 0.06, aCross + 0.04, a) * (1 - span(aPeak, aPeak + 0.12, a))
      kK = R === 'fire' ? span(aPeak - 0.04, aPeak + 0.08, a) * (1 - span(aPeak + MS * 1.3, aPeak + MS * 1.3 + 0.2, a)) : 0
    }
    for (const g of gates) {
      if (g.kind === 'Na' && g.x < AIS.x1) poseGate(g, naK)
      else if (g.kind === 'K') poseGate(g, kK)
    }
    // the signal along the myelinated fibre: each sleeve turns gold as it passes, each node flashes
    let pulseAt = null
    let pulseK = 0
    if (R === 'fire') {
      if (a > aCross && a < aPeak + 0.3) {
        pulseAt = tmpV.set(lerp(AIS.x0 + 0.4, AIS.x1, span(aCross, aPeak + 0.15, a)), AX.y, AX.z)
        pulseK = span(aCross, aCross + 0.15, a)
      }
      sleeves.forEach((s, i) => {
        const tp = aPeak + 0.12 + i * 0.3
        s.mat.emissiveIntensity = a >= tp ? 0.75 * span(tp, tp + 0.08, a) * Math.exp(-Math.max(0, a - tp - 0.08) / 0.9) : 0
      })
      NODES.forEach((x, j) => {
        const tn = aPeak + 0.27 + j * 0.3
        const k = a >= tn ? Math.exp(-(a - tn) / 0.35) : 0
        nodeMats[j].uniforms.uK.value = k
        for (const g of nodeGates[j]) poseGate(g, k > 0.2 ? 1 : 0)
        if (a >= tn && a < tn + 0.3) {
          pulseAt = tmpV.set(x, AX.y, AX.z)
          pulseK = 1
        }
        if (FIRE.sound && a >= tn && a - dt < tn) burst(x, clock)
      })
      const tT = aPeak + 0.27 + NODES.length * 0.3 + 0.1
      if (a >= tT - 0.12 && a < tT + 0.35) {
        pulseAt = tmpV.set(END.x1, AX.y, AX.z)
        pulseK = 1 - span(tT + 0.1, tT + 0.35, a)
      }
      // the endings pass the message on: sparks leave the buttons
      if (a >= tT && a < tT + 0.9 && rnd() < dt * 50) {
        const b = buttons[Math.floor(rnd() * buttons.length)]
        const v = b.clone().sub(new THREE.Vector3(END.x1, AX.y, AX.z)).normalize().multiplyScalar(0.8 + rnd() * 0.6)
        v.y += (rnd() - 0.5) * 0.6
        emit(b, v, 0.9)
      }
    } else {
      for (const s of sleeves) s.mat.emissiveIntensity = 0
      for (const m of nodeMats) m.uniforms.uK.value = 0
    }
    pulse.visible = !!pulseAt
    if (pulseAt) {
      pulse.position.copy(pulseAt)
      pulseMat.opacity = pulseK
      pulse.scale.setScalar(2.2 + Math.sin(t * 30) * 0.15)
    }
    drawMeter(a)
  })

  // ======== running the pump ========
  const PUMP_S = { n: 0, start: -99, mine: false, sound: false, cue: 0 }
  const pumpAge = () => clock - PUMP_S.start
  const pumpBusy = () => pumpAge() < PUMP_T
  const PUMP_CUES = [[0, 'tap'], [0.95, 'pop'], [1.5, 'part'], [2.1, 'join']]
  const startPump = (age, sound) => {
    PUMP_S.start = clock - age
    PUMP_S.sound = sound
    PUMP_S.cue = PUMP_CUES.findIndex(([s]) => s >= age)
    if (PUMP_S.cue < 0) PUMP_S.cue = PUMP_CUES.length
  }
  /** One turn's ions: 3 Na+ from inside into the pocket and out, 2 K+ from outside into the pocket and in. */
  const pumpIons = () => {
    const t0 = PUMP_S.start
    pump.updateMatrixWorld(true)
    const inner = pw(P_IN)
    const outer = pw(P_OUT)
    nearest('Na', 'in', inner, 3).forEach((o, i) => {
      const site = pw(pocketNa[i])
      o.side = 'out'
      o.hold = false
      o.legs = [
        { t0: t0 + 0.1 + i * 0.07, dur: 0.6, c1: null, c2: inner.clone().addScaledVector(new THREE.Vector3(0, 0, -1), 0.2), to: site },
        { t0: t0 + 1.45 + i * 0.06, dur: 0.6, c1: site.clone().add(new THREE.Vector3(0, 0, 0.5)), c2: outer.clone().add(new THREE.Vector3((i - 1) * 0.5, 0.3, 0.3)), to: outHome(PUMP.x - 1.2, PUMP.x + 0.6) },
      ]
    })
    nearest('K', 'out', outer, 2).forEach((o, i) => {
      const site = pw(pocketK[i])
      o.side = 'in'
      o.hold = false
      o.legs = [
        { t0: t0 + 1.5 + i * 0.08, dur: 0.45, c1: null, c2: outer.clone().add(new THREE.Vector3(0, 0, 0.25)), to: site },
        { t0: t0 + 2.05 + i * 0.06, dur: 0.5, c1: site.clone().add(new THREE.Vector3(0, 0, -0.45)), c2: inner.clone().add(new THREE.Vector3(0, 0, -0.3)), to: inHome(PUMP.x - 1.4, PUMP.x + 0.6) },
      ]
    })
  }
  const pumpPanel = lv => ({
    title: E.pump.title,
    color: '#ffb84d',
    blocks: [{ buttons: [{ label: E.pump.buttons.pump, onClick: () => pumpTap() }] }, ...paras(E.pump.panel[depth(lv)])],
  })
  function pumpDo() {
    if (pumpBusy()) return false
    const was = extra
    PUMP_S.n++
    PUMP_S.mine = true
    startPump(0, true)
    pumpIons()
    extra = Math.max(0, extra - 3)
    kOut = Math.max(0, kOut - 2)
    share('nerve')
    found('pump', pumpPanel, PUMP_T + 0.4)
    if (was > 0 && extra === 0) {
      const n = PUMP_S.n
      later(PUMP_T + 0.2, () => {
        if (PUMP_S.n === n && PUMP_S.mine) say(at(E.pump.says.done, level()))
      })
    }
    return at(was > 0 ? E.pump.says.pump : E.pump.says.idle, level())
  }
  const pumpTap = () => say(pumpDo() || at(W.busy, level()))
  ex.add({
    id: 'pump',
    x: -2.4,
    z: 0.1,
    radius: 1.8,
    label: E.pump.label,
    verb: () => (extra > 0 ? E.pump.hints.pump : E.pump.hints.rest),
    manual: true,
    focus: { x: -2.2, y: 2.6, z: -2.9, size: 2.8 },
    act: () => ctx.showPanel(pumpPanel),
  })
  clickable(pump, () => pumpTap(), { when: () => !pumpBusy() })
  const atpFrom = new THREE.Vector3(0.15, -0.15, -1.1)
  const atpTo = new THREE.Vector3(0, -0.2, -0.6)
  const adpTo = new THREE.Vector3(-0.35, -0.45, -1.2)
  updates.push(() => {
    const a = pumpAge()
    if (PUMP_S.sound) while (PUMP_S.cue < PUMP_CUES.length && a >= PUMP_CUES[PUMP_S.cue][0]) play(PUMP_CUES[PUMP_S.cue++][1])
    const r = rockAt(a)
    halves[0].pivot.rotation.y = -r * 0.3
    halves[1].pivot.rotation.y = r * 0.3
    // ATP comes to the inner side, gives its energy (a flash) and leaves as ADP
    atp.visible = a > 0.5 && a < 1.7
    if (atp.visible) {
      const toPump = span(0.5, 0.9, a)
      const away = span(1.05, 1.6, a)
      const p = atpFrom.clone().lerp(atpTo, toPump).lerp(adpTo, away)
      atp.position.copy(pw(p))
      atp.material.map = a < 1.0 ? atpTex : adpTex
      atp.material.opacity = 1 - span(1.35, 1.7, a)
    }
    const fl = a > 0.9 && a < 1.3 ? Math.sin((Math.PI * (a - 0.9)) / 0.4) : 0
    atpFlash.position.copy(pw(atpTo))
    atpFlash.material.opacity = fl
    M.pump.emissiveIntensity = 0.35 + 0.8 * fl
    drawSign()
  })

  // ======== the race: a bare thin fibre and a myelinated one, side by side ========
  const race = new THREE.Group()
  root.add(race)
  const L = RACE.z1 - RACE.z0
  const zMid = (RACE.z0 + RACE.z1) / 2
  const bareMat = laneMat('#c43477', 0.25)
  const myMat = laneMat('#c43477', 0.02)
  const laneGeo = r => new THREE.CylinderGeometry(r, r, L, 12, 1, true).rotateX(Math.PI / 2)
  const bareLane = new THREE.Mesh(laneGeo(RACE.bare.r), bareMat)
  bareLane.position.set(RACE.bare.x, RACE.bare.y, zMid)
  const myLane = new THREE.Mesh(laneGeo(RACE.my.r), myMat)
  myLane.position.set(RACE.my.x, RACE.my.y, zMid)
  race.add(bareLane, myLane)
  const nodeZ = Array.from({ length: RACE.nodes + 1 }, (_, k) => RACE.z0 + (L * k) / RACE.nodes)
  const raceSleeves = []
  for (let k = 0; k < RACE.nodes; k++) {
    const mat = myelinMat()
    // a sleeve along z: the fibre's lathe turned from x to z
    const geo = axisLathe(sleeveProfile(nodeZ[k] + 0.07, nodeZ[k + 1] - 0.07, RACE.my.r, RACE.my.rs, 0.1), 24).rotateY(-Math.PI / 2)
    const m = new THREE.Mesh(geo, mat)
    m.position.set(RACE.my.x, RACE.my.y, 0)
    race.add(m)
    raceSleeves.push(mat)
  }
  // caps at both ends, posts underneath, the start line and the finish bar
  for (const [x, y, r] of [[RACE.bare.x, RACE.bare.y, RACE.bare.r], [RACE.my.x, RACE.my.y, RACE.my.r]]) {
    for (const z of [RACE.z0, RACE.z1]) {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 1.6, 12, 10), M.axon)
      cap.position.set(x, y, z)
      race.add(cap)
    }
    for (let i = 0; i <= 4; i++) {
      const z = lerp(RACE.z0 + 0.3, RACE.z1 - 0.3, i / 4)
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, y, 8), M.post)
      post.position.set(x, y / 2, z)
      race.add(post)
    }
  }
  const xA = RACE.my.x - 0.4
  const xB = RACE.bare.x + 0.4
  {
    const chk = canvasTex(256, 32, (g, w, h) => {
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 2; j++) {
          g.fillStyle = (i + j) % 2 ? '#2a1a3a' : '#f4ecf6'
          g.fillRect((i * w) / 16, (j * h) / 2, w / 16, h / 2)
        }
      }
    }, { mipmaps: false })
    textures.push(chk)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(xB - xA, 0.17, 0.08), new THREE.MeshStandardMaterial({ map: chk, roughness: 0.6, emissive: '#ffffff', emissiveMap: chk, emissiveIntensity: 0.15 }))
    bar.position.set((xA + xB) / 2, 1.72, RACE.z1 + 0.25)
    race.add(bar)
    for (const x of [xA, xB]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.8, 8), M.post)
      p.position.set(x, 0.9, RACE.z1 + 0.25)
      race.add(p)
    }
    const line = new THREE.Mesh(new THREE.PlaneGeometry(xB - xA, 0.1), new THREE.MeshStandardMaterial({ color: '#f4ecf6', roughness: 0.7, emissive: '#ffffff', emissiveIntensity: 0.12 }))
    line.rotation.x = -Math.PI / 2
    line.position.set((xA + xB) / 2, 0.012, RACE.z0 - 0.15)
    race.add(line)
    // the lanes' names over their start, facing the visitor (who faces +x, the start on the left)
    for (const [txt, x, y] of [[E.race.bare, RACE.bare.x, RACE.bare.y + 0.32], [E.race.wrapped, RACE.my.x, RACE.my.y + 0.4]]) {
      const label = makeText(txt, { size: 0.17, color: '#ffe6f2', anchorX: 'left', outlineWidth: 0.012, outlineColor: '#2a0e2a' })
      label.rotation.y = -Math.PI / 2
      label.position.set(x - 0.05, y, RACE.z0 - 0.05)
      race.add(label)
    }
  }
  solids.push(box((xA + xB) / 2, zMid + 0.1, xB - xA + 0.2, L + 0.8))
  // the Go button on its post at the start, leaning toward the visitor
  const goGroup = new THREE.Group()
  goGroup.position.set(GO.x, 0, GO.z)
  goGroup.rotation.y = Math.atan2(RACE_SPOT.x - GO.x, RACE_SPOT.z - GO.z)
  race.add(goGroup)
  const goCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.09, 28), new THREE.MeshStandardMaterial({ color: '#ff5a8a', roughness: 0.35, emissive: '#ff3a78', emissiveIntensity: 0.5 }))
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.95, 10), M.post)
    post.position.y = 0.475
    const head = new THREE.Group()
    head.position.y = 1.0
    head.rotation.x = 0.5
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.08, 28), M.post)
    goCap.position.y = 0.07
    const word = makeText(E.race.go, { size: 0.15, color: '#ffffff', anchorX: 'center', anchorY: 'middle' })
    word.rotation.x = -Math.PI / 2
    word.position.y = 0.118
    head.add(base, goCap, word)
    goGroup.add(post, head)
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1.3, 10), new THREE.MeshBasicMaterial({ visible: false }))
    hit.position.y = 0.65
    goGroup.add(hit)
    solids.push(circle(GO.x, GO.z, 0.3))
  }
  // the board behind the lanes: clocks for a metre of nerve
  const board = screenBoard(BOARD.w, BOARD.h, 1024, color)
  board.group.position.set(BOARD.x, BOARD.y, BOARD.z)
  board.group.rotation.set(0, -Math.PI / 2, 0)
  race.add(board.group)
  textures.push(board.tex)
  {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, BOARD.y - BOARD.h / 2, 8), M.post)
    for (const s of [-1, 1]) {
      const l = leg.clone()
      l.position.set(BOARD.x + 0.1, (BOARD.y - BOARD.h / 2) / 2, BOARD.z + s * (BOARD.w / 2 - 0.25))
      race.add(l)
    }
    solids.push(box(BOARD.x, BOARD.z, 0.5, BOARD.w + 0.2))
  }
  const heads = ['bare', 'my'].map(() => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: new THREE.Color(ELECTRIC).multiplyScalar(1.5), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
    s.scale.setScalar(0.6)
    race.add(s)
    return s
  })
  const RACE_S = { n: 0, start: -99, mine: false, sound: false, cue: 0, said: 0 }
  const raceAge = () => clock - RACE_S.start
  const raceBusy = () => raceAge() < RACE_T
  const RACE_CUES = [[0, 'select'], [S1, 'join'], [HOLD + FAST, 'join']]
  const startRace = (age, sound) => {
    RACE_S.start = clock - age
    RACE_S.sound = sound
    RACE_S.cue = RACE_CUES.findIndex(([s]) => s >= age)
    if (RACE_S.cue < 0) RACE_S.cue = RACE_CUES.length
    RACE_S.said = age > S1 + 0.2 ? (age > HOLD + FAST ? 2 : 1) : 0
    boardDrawn = null
  }
  const racePanel = lv => ({
    title: E.race.title,
    color,
    blocks: [{ buttons: [{ label: E.race.buttons.go, onClick: () => raceTap() }] }, ...paras(E.race.panel[depth(lv)])],
  })
  function raceDo() {
    if (raceBusy()) return false
    RACE_S.n++
    RACE_S.mine = true
    startRace(0, true)
    share('race')
    found('race', racePanel, RACE_T + 0.4)
    return at(E.race.says.go, level())
  }
  const raceTap = () => say(raceDo() || at(W.busy, level()))
  ex.add({
    id: 'race',
    x: RACE_SPOT.x,
    z: RACE_SPOT.z,
    radius: 2.0,
    label: E.race.label,
    verb: () => (RACE_S.n ? E.race.hints.again : E.race.hints.go),
    manual: true,
    focus: { x: 6.5, y: 1.2, z: 1.6, size: 6.0 },
    act: () => ctx.showPanel(racePanel),
  })
  clickable(goGroup, () => raceTap(), { when: () => !raceBusy(), reach: 5 })
  clickable(bareLane, () => raceTap(), { when: () => !raceBusy(), reach: 5 })
  clickable(myLane, () => raceTap(), { when: () => !raceBusy(), reach: 5 })
  let boardDrawn = null
  const fmtS = ms => `${dec(ms / 1000, 3)} s`
  function drawBoard(a) {
    const run = RACE_S.n > 0
    const ms = run ? raceMs(Math.min(a, RACE_T)) : 0
    const fast = run && a > HOLD && a < HOLD + FAST
    const key = `${RACE_S.n}:${Math.round(ms * 10)}:${fast}`
    if (key === boardDrawn) return
    boardDrawn = key
    const tMy = Math.min(ms, T_MY)
    const tBare = Math.min(ms, T_BARE)
    board.draw((g, w, h) => {
      g.fillStyle = '#0d1030'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.textAlign = 'left'
      g.fillStyle = '#f2e6f8'
      g.font = '800 54px Outfit, Nunito, sans-serif'
      g.fillText(E.race.board, 40, 60)
      if (fast) {
        // fast forward: time runs faster now
        g.fillStyle = '#fff4a0'
        for (const dx of [0, 34]) {
          g.beginPath()
          g.moveTo(w - 110 + dx, 32)
          g.lineTo(w - 76 + dx, 52)
          g.lineTo(w - 110 + dx, 72)
          g.closePath()
          g.fill()
        }
      }
      const rows = [[E.race.wrapped, tMy, T_MY, E.race.speed.wrapped], [E.race.bare, tBare, T_BARE, E.race.speed.bare]]
      rows.forEach(([name, t, total, speed], i) => {
        const y = 180 + i * 140
        const doneLane = run && t >= total
        g.font = '700 48px Outfit, Nunito, sans-serif'
        g.fillStyle = '#ffd6ea'
        g.textAlign = 'left'
        g.fillText(name, 36, y - 26)
        g.font = '600 38px Outfit, Nunito, sans-serif'
        g.fillStyle = doneLane ? '#fff4a0' : 'rgba(255,255,255,0.4)'
        g.fillText(doneLane ? speed : ' ', 36, y + 26)
        g.textAlign = 'right'
        g.font = '800 86px Outfit, Nunito, sans-serif'
        g.fillStyle = doneLane ? '#fff4a0' : '#ffffff'
        g.fillText(fmtS(t), w - 36, y)
      })
    })
  }
  updates.push((dt, t) => {
    const a = raceAge()
    const run = RACE_S.n > 0 && a < RACE_T + 30
    if (RACE_S.sound) while (RACE_S.cue < RACE_CUES.length && a >= RACE_CUES[RACE_S.cue][0]) play(RACE_CUES[RACE_S.cue++][1])
    if (RACE_S.mine && RACE_S.said === 0 && a > S1 + 0.2 && a < RACE_T) {
      RACE_S.said = 1
      say(at(E.race.says.won, level()))
    }
    if (RACE_S.mine && RACE_S.said === 1 && a > HOLD + FAST + 0.1 && a < RACE_T + 1) {
      RACE_S.said = 2
      say(at(E.race.says.done, level()))
    }
    const ms = run ? raceMs(Math.min(a, RACE_T)) : 0
    const uMy = clamp(ms / T_MY)
    const uBare = clamp(ms / T_BARE)
    const live = run && a < RACE_T
    // the bare one creeps smoothly; the wrapped one jumps from node to node
    const idx = Math.min(RACE.nodes, Math.floor(uMy * RACE.nodes + 1e-6))
    bareMat.uniforms.uFront.value = live ? uBare : -1
    bareMat.uniforms.uOn.value = live ? 1 : 0
    myMat.uniforms.uFront.value = live ? idx / RACE.nodes : -1
    myMat.uniforms.uOn.value = live ? 1 : 0
    raceSleeves.forEach((m, k) => {
      const aPass = (S1 * (k + 1)) / RACE.nodes
      m.emissiveIntensity = live && a >= aPass ? 0.7 * Math.exp(-(a - aPass) / 0.8) : 0
    })
    heads[0].visible = live && uBare < 1
    heads[0].position.set(RACE.bare.x, RACE.bare.y, RACE.z0 + L * uBare)
    heads[0].material.opacity = 1
    heads[0].scale.setScalar(0.55 + Math.sin(t * 20) * 0.05)
    const sinceNode = a - (S1 * idx) / RACE.nodes
    heads[1].visible = live && (uMy < 1 || sinceNode < 0.5)
    heads[1].position.set(RACE.my.x, RACE.my.y, nodeZ[idx])
    heads[1].material.opacity = uMy < 1 ? 1 : 1 - clamp(sinceNode / 0.5)
    heads[1].scale.setScalar(0.5 + 0.5 * Math.exp(-sinceNode / 0.1))
    goCap.position.y = 0.07 - (RACE_S.n && a < 0.3 ? 0.04 * Math.sin((Math.PI * a) / 0.3) : 0)
    drawBoard(a)
  })

  // ======== every frame: the ions ========
  const counts = { Na: 0, K: 0, Cl: 0 }
  const bp = new THREE.Vector3()
  updates.push((dt, t) => {
    counts.Na = counts.K = counts.Cl = 0
    for (const o of ions) {
      stepIon(o, t, dt)
      clouds[o.kind].set(counts[o.kind]++, o.p)
    }
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i]
      const u = (clock - b.t0) / b.dur
      if (u >= 1) {
        bursts.splice(i, 1)
        continue
      }
      if (u < 0 || counts.Na >= 64) continue
      bp.lerpVectors(b.from, b.to, ease(u))
      clouds.Na.set(counts.Na++, bp, 1 - u * u * u)
    }
    for (const k of Object.keys(clouds)) clouds[k].count = counts[k]
    leak()
  })
  updates.push((dt, t) => stage.update(t))

  // the state each one shares: the nerve (messages, pump turns, the gradient) and the race
  const round1 = v => Math.round(v * 10) / 10
  const nerveState = () => ({
    fires: FIRE.n,
    stim: FIRE.stim,
    result: FIRE.result,
    fireAge: round1(Math.min(30, fireAge())),
    pumps: PUMP_S.n,
    pumpAge: round1(Math.min(30, pumpAge())),
    extra,
    kOut,
  })
  const nerveSet = (s, liveSet, ago = 0) => {
    const fires = Math.max(0, Math.round(Number(s?.fires) || 0))
    const pumps = Math.max(0, Math.round(Number(s?.pumps) || 0))
    const result = ['fire', 'weak', 'tired'].includes(s?.result) ? s.result : null
    const stim = clamp(Math.round(Number(s?.stim) || 25), 0, 30)
    const fAge = clamp((Number(s?.fireAge) || 0) + (Number(ago) || 0), 0, 30)
    const pAge = clamp((Number(s?.pumpAge) || 0) + (Number(ago) || 0), 0, 30)
    const newFire = liveSet && fires === FIRE.n + 1
    const newPump = liveSet && pumps === PUMP_S.n + 1
    FIRE.mine = false
    PUMP_S.mine = false
    if (fires !== FIRE.n || result !== FIRE.result) {
      FIRE.n = fires
      FIRE.stim = stim
      FIRE.result = fires ? result : null
      if (fires) startFire(newFire ? Math.min(fAge, 1) : fAge, newFire)
      else FIRE.start = clock - 30
      if (newFire && result === 'fire') fireIons()
    }
    if (pumps !== PUMP_S.n) {
      PUMP_S.n = pumps
      if (pumps) startPump(newPump ? Math.min(pAge, 1) : pAge, newPump)
      else PUMP_S.start = clock - 30
      if (newPump) pumpIons()
    }
    extra = clamp(Math.round(Number(s?.extra) || 0), 0, MAXX)
    kOut = clamp(Math.round(Number(s?.kOut) || 0), 0, K_MAX)
    if (!newFire && !newPump) snapIons()
    signDrawn = null
    meterDrawn = null
  }

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 8.8 },
    spawn: { x: 0, z: 5.8, yaw: 0 },
    hostSpot: { x: 1.7, z: 5.0, yaw: Math.atan2(1.7, -0.8) },
    back: { x: 0, z: 9.4, rot: Math.PI },
    stand: { x: -2.5, z: 3.4, rot: Math.atan2(2.5, 2.4) },
    // for the probes: tap() does what a tap on that thing does (shot.py cannot move the mouse)
    parts: {
      fire: {
        tap: () => fireTap(), // the nerve cell
        stim: v => (stimNext = clamp(Math.round(Number(v) || 0), 0, 30)), // the panel's slider
        get state() { return nerveState() },
        get busy() { return fireBusy() },
        cellAt: () => new THREE.Vector3(SOMA.x + 0.6, SOMA.y, SOMA.z + SOMA.r - 0.2),
      },
      pump: {
        tap: () => pumpTap(), // the golden pump
        get busy() { return pumpBusy() },
        at: () => pump.position.clone(),
      },
      race: {
        tap: () => raceTap(), // Go, or either fibre
        get state() { return raceState() },
        get busy() { return raceBusy() },
        goAt: () => goGroup.localToWorld(new THREE.Vector3(0, 1.05, 0)),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
      get ions() {
        return { naIn: ions.filter(o => o.kind === 'Na' && o.side === 'in').length, kOut: ions.filter(o => o.kind === 'K' && o.side === 'out').length, extra, kExtra: kOut }
      },
    },
    panels: { fire: firePanel, pump: pumpPanel, race: racePanel },
    shared: {
      nerve: { get: nerveState, set: nerveSet },
      race: {
        get: () => raceState(),
        set: (s, liveSet, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const age = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
          const fresh = liveSet && n === RACE_S.n + 1
          RACE_S.mine = false
          RACE_S.n = n
          if (n) startRace(fresh ? Math.min(age, 1) : age, fresh)
          else RACE_S.start = clock - 60
        },
      },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
      spGeo.dispose()
    },
  }

  function raceState() {
    return { n: RACE_S.n, age: round1(Math.min(60, raceAge())) }
  }
}
