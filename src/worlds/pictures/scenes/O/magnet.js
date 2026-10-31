// Oxygen's picture "Oxygen that sticks to a magnet" as a room (docs/knowledge/picture-rooms.md). The
// picture tells two things: liquid oxygen sticks to a magnet, and rockets carry tanks of it. Here it is a
// cold laboratory (stages/coldlab.js), frost on the pipes and mist from the open flasks, whose big doors
// stand open onto a rocket engine test stand at dusk, the picture's rocket on its far pad. Oxygen's air wing
// (/e/O/air) already pours LOX and LN2 between a horseshoe magnet's poles and shows O2's Lewis picture;
// this room goes on from there. Each step is chosen by tapping its thing (the user, 2026-10-30: pressing E
// through fixed steps felt passive); the prompt names the next tap; E opens the station's panel, whose
// buttons and slider do the same:
// - the liquid air machine (west): tap the machine to run it (a temperature slider too): water freezes out
//   as frost, carbon dioxide as dry ice snow, then the air drips out as a pale blue liquid near −191 °C; the
//   thermometer board marks each gas's own point. Tap the column: the nitrogen boils off first and liquid
//   oxygen collects in its flask (tap the flask);
// - who was first (the table by the south wall): Cailletet and Pictet's mist (1877), Wróblewski and
//   Olszewski's liquid in Kraków (1883), Linde's machine by the litre (1895); tap each tube;
// - the big electromagnet (east): a field slider; tap the liquid oxygen (it jumps to the poles and
//   bridges them, unless the field is too weak), the liquid nitrogen (it falls through) or the water (a
//   dish between the poles, the dip the field presses into it shown magnified, true to |χ|B²/2μ0ρg); the
//   board shows the field, and at Scientist level the susceptibilities and O2's outer orbitals;
// - the floating frog: a model of the Nijmegen Bitter magnet (16 T), cut open; tap it and the frog floats;
// - the rocket engine (outside): a mix slider (oxygen per kilogram of kerosene), tap the LOX or the
//   kerosene tank to change it, tap the engine to fire: sooty and weak with too little oxygen, bright with
//   shock diamonds near 2.3 to 2.6, the nozzle glowing with too much; Goddard's 1926 rocket beside it.
// All of it is shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<exhibit> does what a tap does, for the probes; parts.at.<thing>() gives a point to aim a real tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, clamp, lerp, damp, random, fill } from '../../../wings/noble/kit.js'
import { edgeGlass } from '../../../common/props.js'
import { coldLabStage } from '../../stages/coldlab.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText, formulaText } from '../../../../engine/text.js'
import { MAGNET_WORDS } from './magnet.words.js'

export const WORDS = MAGNET_WORDS

const TAU = Math.PI * 2
// 0 at a, 1 at b, eased (a may be above b)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }

// ---- the physics the exhibits follow ----
const MU0 = 4e-7 * Math.PI
const G0 = 9.81
// volume susceptibilities (SI): liquid oxygen at 90 K (from +7699e-6 cm3/mol, CGS, and 1.141 g/cm3), water
const CHI_LOX = 3.45e-3
const CHI_WATER = -9.05e-6
// how tall a column of LOX the field's pull equals (m), and the dip it presses into water (m)
const loxHold = b => (CHI_LOX * b * b) / (2 * MU0 * 1141 * G0)
const waterDip = b => (Math.abs(CHI_WATER) * b * b) / (2 * MU0 * 998 * G0)
const B_MAX = 1.5 // the lab electromagnet, tesla
const B_HOLD = 0.2 // below this the LOX runs through the gap
// the air on its way down (°C): water's frost, carbon dioxide's frost in air (an estimate: it needs far
// colder than pure dry ice's −78.5 °C), air's dew point and its boiling point at 1 atm
const T_ROOM = 20
const T_MIN = -200
const T_DEW = -191
const T_BUBBLE = -194.4
const liquidAt = T => span(T_DEW, T_BUBBLE - 0.6, T)
// the rocket: oxygen per kilogram of kerosene
const MIX = { min: 0.6, max: 4.0, start: 1.2, step: 0.3 }
// how strongly it pushes (1 at the best mix, near 2.5): a rough shape of specific impulse against the mix,
// drawn as a bar with no numbers (it is the room's model, not measured data)
const pushOf = r => (r <= 2.5 ? 1 - 0.55 * Math.pow((2.5 - r) / 2, 1.6) : 1 - 0.12 * Math.pow((r - 2.5) / 1.5, 1.5))
const sootOf = r => span(2.1, 0.9, r)
const oxOf = r => span(3.1, 3.9, r)
const verdictOf = r => (r < 1.75 ? 'lean' : r < 2.25 ? 'ok' : r <= 2.75 ? 'good' : r < 3.15 ? 'ok' : 'rich')
const BURN = { light: 0.35, steady: 6.2, end: 7.4 }
const FROG_B = 16
const FROG_LIFT = 14.6

/** A soft round glow (sparks, the frog's field). */
function glowTex() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.4, 'rgba(255,255,255,0.45)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** The rocket's flame along +x, from the nozzle (x = 0) to `len`: drawn by a shader, additive. */
function plumeMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uK: { value: 0 }, uSoot: { value: 0 }, uOx: { value: 0 }, uLen: { value: 9 }, uReach: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vPos; varying vec3 vN; varying vec3 vV;
      void main() {
        vPos = position;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uK; uniform float uSoot; uniform float uOx; uniform float uLen; uniform float uReach;
      varying vec3 vPos; varying vec3 vN; varying vec3 vV;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      void main() {
        float u = clamp(vPos.y / uLen, 0.0, 1.0);
        float face = abs(dot(normalize(vN), normalize(vV)));
        float core = pow(face, 1.6);
        float ang = atan(vPos.z, vPos.x);
        float n = noise(vec2(u * 10.0 - uTime * 16.0, ang * 2.0)) * 0.6 + noise(vec2(u * 23.0 - uTime * 29.0, ang * 4.0 + 3.0)) * 0.4;
        // how far it reaches: shorter when sooty, ragged at its end
        float reach = uReach * (0.86 + 0.14 * n);
        float fade = 1.0 - smoothstep(reach * 0.45, reach, u);
        // shock diamonds: bright knots in the first part of a good flame
        float d = pow(0.5 + 0.5 * cos(u * uLen * 5.6 - 0.9), 10.0) * smoothstep(0.02, 0.06, u) * (1.0 - smoothstep(0.16, 0.5, u));
        vec3 hot = vec3(1.0, 0.82, 0.5);
        vec3 orange = vec3(1.0, 0.42, 0.1);
        vec3 sooty = vec3(0.8, 0.2, 0.04);
        vec3 ox = vec3(0.55, 0.62, 1.0);
        vec3 c = mix(hot, orange, smoothstep(0.04, 0.5, u));
        c = mix(c, sooty, uSoot);
        c = mix(c, ox, uOx * 0.75);
        float body = (0.25 + 0.75 * core) * fade * (0.55 + 0.9 * n);
        body *= (1.0 - 0.6 * uSoot) * (1.0 - 0.55 * uOx);
        float knots = d * core * (1.0 - uSoot) * (1.0 - 0.6 * uOx) * 1.6;
        gl_FragColor = vec4(c * (body * 0.42 + knots) * uK, 1.0);
      }`,
  })
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const H = 6
  const Z0 = -5
  const DOOR = { at: 0, width: 6, height: 4.6 }
  const YARD = { x0: -12, x1: 16, depth: 30 }
  const stage = coldLabStage({ light, x0: -8, x1: 8, z0: Z0, z1: 7, h: H, door: DOOR, yard: YARD, glow: [-0.55, -1] })
  root.add(stage.group)
  const { mats, frost } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v).replace('-', '−')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const glow = glowTex()
  textures.push(glow)
  const tmpV = new THREE.Vector3()
  // a station's focus: how high and how wide it is (the station view fits both, so an upright phone sees
  // the whole width too)
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  // things whose words follow the depth switch: [object, 'kid' | 'sci']
  const byLevel = []
  let shownLevel = null
  const sign = (text, size, { color: c = '#e8f1fb', maxWidth = 3, anchorX = 'center', anchorY = 'middle' } = {}) =>
    makeText(text, { size, color: c, maxWidth, anchorX, anchorY, outlineWidth: size * 0.08, outlineColor: '#0b1020' })
  /** A canvas screen in a dark frame, facing +z: draw on `g`, then `tex.needsUpdate = true`. */
  function screen(w, h, px = 512, frameMat = mats.dark) {
    const cw = px
    const ch = Math.round((px * h) / w)
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures.push(tex)
    const group = new THREE.Group()
    const frame = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.06, 2, 0.02), frameMat)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#d8d8d8', toneMapped: false }))
    face.position.z = 0.035
    group.add(frame, face)
    return { group, g: canvas.getContext('2d'), w: cw, h: ch, tex, face }
  }
  /** A line that shrinks until it fits (the four languages differ in length). */
  const fit = (g, text, x, y, size, weight = 700, maxW = 400) => {
    let s = size
    g.font = `${weight} ${s}px Outfit`
    while (s > 11 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px Outfit`
    g.fillText(text, x, y)
  }

  // the liquids
  const LOX_C = new THREE.Color('#8fd0ff')
  const AIR_C = new THREE.Color('#d4e8ff')
  const loxMat = new THREE.MeshStandardMaterial({ color: LOX_C, emissive: '#3f8fe0', emissiveIntensity: 0.55, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.9 })
  const ln2Mat = new THREE.MeshStandardMaterial({ color: '#eef4fb', emissive: '#7d8ea3', emissiveIntensity: 0.3, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.75 })
  const waterMat = new THREE.MeshStandardMaterial({ color: '#5aa2dc', emissive: '#1d4f7a', emissiveIntensity: 0.3, roughness: 0.06, metalness: 0.05, transparent: true, opacity: 0.8 })
  const innerMat = new THREE.MeshStandardMaterial({ color: '#15191f', roughness: 0.6, metalness: 0.5, side: THREE.BackSide })
  const glass = edgeGlass({ color: '#dceeff', edge: 0.75, base: 0.035 })
  const machineMat = new THREE.MeshStandardMaterial({ color: '#3d6c66', roughness: 0.5, metalness: 0.35 })

  /** A Dewar flask: a silver cylinder open at the top, its liquid's surface at a level (0..1). */
  function dewar({ r = 0.16, h = 0.6, mat = loxMat }) {
    const group = new THREE.Group()
    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.96, h, 28, 1, true), mats.steel)
    body.position.y = h / 2
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.88, r * 0.88, h * 0.96, 24, 1, true), innerMat)
    inner.position.y = h / 2 + h * 0.02
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(r * 0.96, 28), mats.steel)
    bottom.rotation.x = -Math.PI / 2
    bottom.position.y = 0.005
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 0.94, r * 0.07, 8, 32), mats.steel)
    rim.rotation.x = Math.PI / 2
    rim.position.y = h
    const liquid = new THREE.Mesh(new THREE.CircleGeometry(r * 0.87, 28), mat)
    liquid.rotation.x = -Math.PI / 2
    group.add(body, inner, bottom, rim, liquid)
    let level = 0
    const api = {
      group,
      liquid,
      h,
      r,
      get level() {
        return level
      },
      setLevel(k) {
        level = clamp(k)
        liquid.visible = level > 0.01
        liquid.position.y = 0.04 + level * (h * 0.82)
      },
    }
    api.setLevel(0)
    return api
  }

  // ======================================================================================================
  // the liquid air machine, along the west wall
  // ======================================================================================================
  const AIR = { x: -7.1, comp: 4.4, box: 1.05, col: -1.6, dew: { x: -6.35, z: 0.55 }, lox: { x: -6.35, z: -2.6 } }
  // ---- the compressor: a flywheel turned by a motor, a cylinder that squeezes the air ----
  const flywheel = new THREE.Group()
  const piston = new THREE.Group()
  const compressor = new THREE.Group()
  compressor.position.set(AIR.x, 0, AIR.comp)
  root.add(compressor)
  {
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.4, 0.4, 1.7, 2, 0.04), mats.dark)
    base.position.set(0.1, 0.2, 0)
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.7, 20), machineMat)
    motor.rotation.z = Math.PI / 2
    motor.position.set(-0.1, 0.72, 0.5)
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.85, 20), machineMat)
    cyl.position.set(0, 1.0, -0.35)
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.12, 20), mats.steel)
    head.position.set(0, 1.48, -0.35)
    compressor.add(base, motor, cyl, head)
    // the flywheel, facing the room: a rim, six spokes, a hub
    flywheel.position.set(0.62, 0.95, 0.15)
    flywheel.rotation.z = Math.PI / 2
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 10, 40), mats.dark)
    rim.rotation.x = Math.PI / 2
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 12), mats.steel)
    flywheel.add(rim, hub)
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.9), mats.dark)
      s.rotation.y = (i / 6) * Math.PI
      flywheel.add(s)
    }
    // a red stripe on the rim, so the turning shows
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.14), mats.paint)
    mark.position.set(0.5, 0, 0)
    flywheel.add(mark)
    compressor.add(flywheel)
    // the piston rod and crank, going up and down
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), mats.steel)
    rod.position.y = 0.25
    piston.add(rod)
    piston.position.set(0.3, 0.55, -0.35)
    compressor.add(piston)
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.7), mats.rubber)
    belt.position.set(0.62, 0.75, 0.42)
    belt.rotation.x = 0.55
    compressor.add(belt)
    solids.push(box(AIR.x + 0.1, AIR.comp, 1.5, 1.8))
    const t = sign(E.air.signs.machine, 0.17, { maxWidth: 1.8 })
    t.position.set(0.95, 2.1, 0)
    t.rotation.y = Math.PI / 2
    compressor.add(t)
  }
  // warm compressed air to the cold box (copper, not frosted)
  stage.pipeRun([[AIR.x, 1.55, AIR.comp - 0.35], [AIR.x, 4.25, AIR.comp - 0.35], [AIR.x - 0.2, 4.25, AIR.box + 0.4], [AIR.x - 0.2, 3.05, AIR.box + 0.4]], { r: 0.045, mat: mats.copper })

  // ---- the cold box: a tall cabinet with a glass front, the coil inside frosting over ----
  const BOX = { x: -7.3, z: AIR.box, w: 1.5, d: 0.95, h: 3.0 }
  const coldBox = new THREE.Group()
  coldBox.position.set(BOX.x, 0, BOX.z)
  root.add(coldBox)
  const coilMat = new THREE.MeshStandardMaterial({ color: '#b8703f', roughness: 0.35, metalness: 0.9, emissive: '#7d97b3', emissiveIntensity: 0 })
  const COPPER = new THREE.Color('#b8703f')
  const FROSTED = new THREE.Color('#dfe8f1')
  {
    const inside = new THREE.MeshStandardMaterial({ color: '#2b3540', roughness: 0.8, metalness: 0.2 })
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.06, BOX.h, BOX.w), mats.bench)
    back.position.set(-BOX.d / 2, BOX.h / 2, 0)
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(BOX.w, BOX.h - 0.2), inside)
    panel.rotation.y = Math.PI / 2
    panel.position.set(-BOX.d / 2 + 0.035, BOX.h / 2, 0)
    coldBox.add(back, panel)
    for (const s of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.BoxGeometry(BOX.d, BOX.h, 0.06), mats.bench)
      side.position.set(0, BOX.h / 2, (s * BOX.w) / 2)
      coldBox.add(side)
    }
    for (const y of [0.03, BOX.h - 0.03]) {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(BOX.d + 0.04, 0.08, BOX.w + 0.06), mats.bench)
      cap.position.set(0, y, 0)
      coldBox.add(cap)
    }
    const front = new THREE.Mesh(new THREE.PlaneGeometry(BOX.w - 0.06, BOX.h - 0.12), glass)
    front.rotation.y = Math.PI / 2
    front.position.set(BOX.d / 2, BOX.h / 2, 0)
    front.renderOrder = 3
    coldBox.add(front)
    // the coil: a long helix of copper tube
    const pts = []
    const turns = 9
    for (let i = 0; i <= turns * 40; i++) {
      const a = (i / 40) * TAU
      pts.push(new THREE.Vector3(Math.cos(a) * 0.3, 0.75 + (i / (turns * 40)) * 1.8, Math.sin(a) * 0.42))
    }
    const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 40, 0.028, 8, false), coilMat)
    coldBox.add(coil)
    // the expansion valve at the bottom, its handwheel at the front
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 14), mats.steel)
    valve.position.set(0.1, 0.95, -0.42)
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 24), mats.paint)
    wheel.rotation.y = Math.PI / 2
    wheel.position.set(BOX.d / 2 + 0.1, 0.95, -0.42)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6), mats.steel)
    stem.rotation.z = Math.PI / 2
    stem.position.set(BOX.d / 2 - 0.08, 0.95, -0.42)
    coldBox.add(valve, wheel, stem)
    solids.push(box(BOX.x, BOX.z, BOX.d + 0.1, BOX.w + 0.1))
  }
  // the spout from the valve to the flask below it
  stage.pipeRun([[BOX.x + BOX.d / 2 - 0.1, 0.95, BOX.z - 0.42], [AIR.dew.x, 0.95, BOX.z - 0.42], [AIR.dew.x, 0.95, AIR.dew.z], [AIR.dew.x, 0.8, AIR.dew.z]], { r: 0.03, bend: 0.1 })
  const SPOUT = new THREE.Vector3(AIR.dew.x, 0.77, AIR.dew.z)
  // the flask of liquid air under the spout
  const airFlask = dewar({ r: 0.17, h: 0.62, mat: new THREE.MeshStandardMaterial({ color: AIR_C, emissive: '#5c86ba', emissiveIntensity: 0.45, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.88 }) })
  airFlask.group.position.set(AIR.dew.x, 0, AIR.dew.z - 0.04)
  root.add(airFlask.group)
  solids.push(circle(AIR.dew.x, AIR.dew.z, 0.22))
  const airMist = stage.mist({ x: AIR.dew.x, y: 0.62, z: AIR.dew.z, rate: 0, seed: 3, spread: 0.7 })
  // drips from the spout
  const drips = Array.from({ length: 3 }, () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), loxMat)
    m.visible = false
    root.add(m)
    return m
  })
  // dry ice snow inside the cold box
  const SNOW = light ? 40 : 90
  const snow = stage.puffs(SNOW)
  root.add(snow.mesh)
  const snowSeed = Array.from({ length: SNOW }, (_, i) => {
    const r = random(400 + i)
    return [r() - 0.5, r(), r() - 0.5, 0.25 + r() * 0.5]
  })

  // ---- the separating column: tall glass, trays, the liquid at its foot, nitrogen out of the top ----
  const COL = { x: AIR.x, z: AIR.col, r: 0.3, y0: 0.38, y1: 3.95 }
  const column = new THREE.Group()
  column.position.set(COL.x, 0, COL.z)
  root.add(column)
  const colLiquidMat = new THREE.MeshStandardMaterial({ color: AIR_C.clone(), emissive: '#4f7fb8', emissiveIntensity: 0.45, roughness: 0.05, transparent: true, opacity: 0.82 })
  const colLiquid = new THREE.Mesh(new THREE.CylinderGeometry(COL.r - 0.03, COL.r - 0.03, 1, 24), colLiquidMat)
  colLiquid.visible = false
  column.add(colLiquid)
  {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(COL.r + 0.16, COL.r + 0.2, COL.y0, 24), mats.bench)
    plinth.position.y = COL.y0 / 2
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(COL.r, COL.r, COL.y1 - COL.y0, 28, 1, true), glass)
    tube.position.y = (COL.y0 + COL.y1) / 2
    tube.renderOrder = 3
    const top = new THREE.Mesh(new THREE.CylinderGeometry(COL.r + 0.05, COL.r + 0.05, 0.16, 24), frost)
    top.position.y = COL.y1 + 0.08
    column.add(plinth, tube, top)
    // the trays the vapour bubbles up through
    const trayMat = new THREE.MeshStandardMaterial({ color: '#9aa3ad', roughness: 0.35, metalness: 0.8, transparent: true, opacity: 0.55 })
    for (let y = COL.y0 + 0.75; y < COL.y1 - 0.2; y += 0.42) {
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(COL.r - 0.01, COL.r - 0.01, 0.02, 24), trayMat)
      tray.position.y = y
      column.add(tray)
    }
    // frost bands where the glass meets the steel
    const band = new THREE.Mesh(new THREE.CylinderGeometry(COL.r + 0.04, COL.r + 0.04, 0.1, 24), frost)
    band.position.y = COL.y0 + 0.05
    column.add(band)
    solids.push(circle(COL.x, COL.z, COL.r + 0.25))
    const t = sign(E.air.signs.column, 0.15, { maxWidth: 1.6 })
    t.position.set(0.5, COL.y1 + 0.45, 0)
    t.rotation.y = Math.PI / 2
    column.add(t)
  }
  // the vent at the top: nitrogen out
  const VENT = new THREE.Vector3(COL.x + 0.55, COL.y1 + 0.35, COL.z)
  stage.pipeRun([[COL.x, COL.y1 + 0.15, COL.z], [COL.x, COL.y1 + 0.35, COL.z], [VENT.x, VENT.y, VENT.z]], { r: 0.05, bend: 0.12 })
  const n2Tag = formulaText('N2', { size: 0.22, color: '#e8f1fb' })
  n2Tag.position.set(VENT.x + 0.05, VENT.y + 0.32, VENT.z)
  n2Tag.rotation.y = Math.PI / 2
  root.add(n2Tag)
  const o2Tag = formulaText('O2', { size: 0.22, color: '#9fd6ff' })
  o2Tag.position.set(AIR.lox.x + 0.05, 1.05, AIR.lox.z)
  o2Tag.rotation.y = Math.PI / 2
  root.add(o2Tag)
  // the liquid air from its flask to the column's foot; the oxygen from the foot to its own flask
  stage.pipeRun([[AIR.dew.x - 0.12, 0.25, AIR.dew.z - 0.1], [AIR.dew.x - 0.12, 0.25, COL.z + 0.2], [COL.x + 0.3, 0.25, COL.z + 0.2]], { r: 0.035, bend: 0.15 })
  stage.pipeRun([[COL.x + 0.2, 0.22, COL.z - 0.25], [COL.x + 0.2, 0.22, AIR.lox.z], [AIR.lox.x - 0.12, 0.22, AIR.lox.z], [AIR.lox.x - 0.12, 0.66, AIR.lox.z]], { r: 0.03, bend: 0.12 })
  const loxFlask = dewar({ r: 0.17, h: 0.62, mat: loxMat })
  loxFlask.group.position.set(AIR.lox.x, 0, AIR.lox.z)
  root.add(loxFlask.group)
  solids.push(circle(AIR.lox.x, AIR.lox.z, 0.22))
  const loxMist = stage.mist({ x: AIR.lox.x, y: 0.62, z: AIR.lox.z, rate: 0, seed: 5, spread: 0.7 })
  {
    const t = sign(E.air.signs.lox, 0.1, { maxWidth: 0.9, color: '#bfe4ff' })
    t.position.set(AIR.lox.x + 0.24, 0.8, AIR.lox.z)
    t.rotation.y = Math.PI / 2
    root.add(t)
  }
  // nitrogen vapour from the vent, bubbles in the column
  const VAP = light ? 20 : 40
  const vapour = stage.puffs(VAP)
  root.add(vapour.mesh)
  const BUB = light ? 24 : 50
  const bubbles = stage.puffs(BUB)
  root.add(bubbles.mesh)

  // ---- the thermometer board, on the wall between the compressor and the cold box ----
  const thermo = screen(1.4, 2.6, 384)
  thermo.group.position.set(-7.93, 2.75, 2.75)
  thermo.group.rotation.y = Math.PI / 2
  root.add(thermo.group)
  let thermoKey = ''
  function drawThermo(T, lv, share02) {
    const { g, w, h } = thermo
    const B = E.air.board
    const sci = lv === 'scientist'
    g.fillStyle = '#0d1430'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(143,208,255,0.6)'
    g.lineWidth = 4
    g.strokeRect(6, 6, w - 12, h - 12)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#8fd0ff'
    fit(g, B.title, w / 2, 40, 30, 700, w - 40)
    g.fillStyle = '#f2f6ff'
    fit(g, `${nf(Math.round(T))} °C`, w / 2, 96, 58, 800, w - 40)
    if (sci) {
      g.fillStyle = '#9fb3d9'
      fit(g, `${nf(Math.round(T + 273.15))} K`, w / 2, 140, 26, 600, w - 40)
    }
    // the scale: 20 °C at the top, −200 °C at the bottom; the last 30 degrees, where the air turns
    // liquid, drawn larger (a break in the scale marks where it changes)
    const Y0 = 180
    const Y1 = h - 70
    const YB = Y0 + (Y1 - Y0) * 0.42
    const yOf = t => (t >= -170 ? Y0 + ((T_ROOM - t) / (T_ROOM + 170)) * (YB - Y0) : YB + ((-170 - t) / 30) * (Y1 - YB))
    const X = 70
    g.fillStyle = '#1d2747'
    g.beginPath()
    g.roundRect(X - 14, Y0 - 12, 28, Y1 - Y0 + 24, 14)
    g.fill()
    const grd = g.createLinearGradient(0, Y1, 0, Y0)
    grd.addColorStop(0, '#8fd0ff')
    grd.addColorStop(1, '#e85a4a')
    g.fillStyle = grd
    g.beginPath()
    g.roundRect(X - 8, yOf(T), 16, Y1 + 6 - yOf(T), 8)
    g.fill()
    g.beginPath()
    g.arc(X, Y1 + 22, 22, 0, TAU)
    g.fillStyle = '#8fd0ff'
    g.fill()
    // the break in the scale
    g.strokeStyle = '#0d1430'
    g.lineWidth = 6
    g.beginPath()
    g.moveTo(X - 20, YB - 4)
    g.lineTo(X - 7, YB + 4)
    g.lineTo(X + 7, YB - 4)
    g.lineTo(X + 20, YB + 4)
    g.stroke()
    // the marks: each gas's own point
    const marks = [
      [0, B.water, '#cfe3ff'],
      [-78.5, B.co2, '#d9dde6'],
      [-183, B.o2, '#8fd0ff'],
      ...(sci ? [[-185.8, B.ar, '#c7b8ff']] : []),
      [-194.4, B.air, '#d4e8ff'],
      [-195.8, B.n2, '#f2f6ff'],
    ]
    g.textAlign = 'left'
    // the cold marks crowd at the foot of the scale: their labels are stacked upward from the bottom,
    // each joined to its mark by a thin line
    const GAPY = 50
    const ys = marks.map(([t]) => yOf(t))
    const ly = ys.slice()
    for (let i = ly.length - 1; i >= 0; i--) ly[i] = Math.min(ys[i], i < ly.length - 1 ? ly[i + 1] - GAPY : Y1 + 8)
    marks.forEach(([t, label, c], i) => {
      const passed = T <= t + 0.01
      g.strokeStyle = passed ? c : 'rgba(160,175,205,0.5)'
      g.lineWidth = 3
      g.beginPath()
      g.moveTo(X + 16, ys[i])
      g.lineTo(X + 30, ys[i])
      g.lineTo(X + 44, ly[i])
      g.lineTo(X + 52, ly[i])
      g.stroke()
      g.fillStyle = passed ? c : 'rgba(170,185,215,0.75)'
      fit(g, `${nf(t, t % 1 ? 1 : 0)} °C`, X + 58, ly[i] - 11, 22, 700, w - X - 70)
      fit(g, label, X + 58, ly[i] + 13, 20, 600, w - X - 70)
    })
    if (share02 != null) {
      g.textAlign = 'center'
      g.fillStyle = '#8fd0ff'
      fit(g, fill(B.share, { p: nf(share02) }), w / 2, h - 26, 22, 700, w - 30)
    }
    thermo.tex.needsUpdate = true
  }

  // ---- the machine's state (shared): the target temperature, the separations, the flask of oxygen ----
  let target = T_ROOM // where the machine is set (°C)
  let temp = T_ROOM // where it is
  let sepN = 0
  let sep = null // { t, mine }: the column at work
  let loxIn = false // the flask holds liquid oxygen
  let colPure = false // the column's foot holds the oxygen it separated (until it is empty)
  let airMine = false
  const told = { frost: false, dryIce: false, notYet: false, drops: false }
  const SEP_T = 7
  const airPanel = lv => ({
    title: E.air.title,
    color,
    blocks: [
      {
        slider: {
          label: E.air.slider,
          min: T_MIN,
          max: T_ROOM,
          step: 1,
          value: Math.round(target),
          onInput: v => slideAir(v),
          format: v => `${nf(v)} °C`,
          live: () => Math.round(target),
        },
      },
      { buttons: [['run', () => airStep('run')], ['off', () => airStep('off')], ['column', () => airStep('column')], ['lox', () => airStep('lox')]].map(([k, f]) => ({ label: E.air.buttons[k], onClick: f })) },
      ...paras(E.air.panel, lv),
    ],
  })
  const airChanged = () => {
    airMine = true
    ex.discover('air', airPanel, 2.4)
    share('air')
  }
  function resetTold() {
    for (const k of Object.keys(told)) told[k] = false
  }
  function airStep(step) {
    const lv = level()
    const S = E.air.says
    if (step === 'run' || step === 'machine') {
      // a tap on the machine runs it down to the bottom, or switches it off once it is there
      if (step === 'machine' && target <= -195) return airStep('off')
      if (target <= T_MIN + 4) return say(at(S.start, lv))
      target = -196
      resetTold()
      play('select')
      say(at(S.start, lv))
    } else if (step === 'off') {
      if (target >= T_ROOM) return say(at(S.warm, lv))
      target = T_ROOM
      play('tap')
      say(at(S.warm, lv))
    } else if (step === 'column') {
      if (sep) return say(at(W.busy, lv))
      if (liquidAt(temp) < 0.6) return say(at(S.noLiquid, lv))
      sepN++
      sep = { t: 0, mine: true }
      play('fizz', { order: 0.8 })
      say(at(S.sep, lv))
    } else if (step === 'lox') {
      play('tap')
      return say(at(loxIn ? S.lox : S.loxEmpty, lv))
    } else return
    airChanged()
  }
  let airSending = false
  function slideAir(v) {
    target = clamp(Math.round(v), T_MIN, T_ROOM)
    airMine = true
    ex.discover('air', airPanel, 2.4)
    if (airSending) return
    airSending = true
    later(0.25, () => {
      airSending = false
      share('air')
    })
  }
  ex.add({
    id: 'air',
    x: -4.75,
    z: 0.4,
    radius: 2.1,
    manual: true,
    label: E.air.label,
    verb: () => {
      const h = E.air.hints
      if (sep) return h.wait
      if (loxIn && !sep && liquidAt(temp) > 0.6) return h.lox
      if (liquidAt(temp) > 0.6) return h.column
      if (target < -150) return h.cooling
      return h.run
    },
    focus: focusOf(-7.1, 2.1, 0.4, 4.8, 5.8),
    act: () => ctx.showPanel(airPanel),
  })
  const machineHit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 1.9), ghost)
  machineHit.position.set(AIR.x + 0.2, 1.0, AIR.comp)
  root.add(machineHit)
  const boxHit = new THREE.Mesh(new THREE.BoxGeometry(BOX.d + 0.3, BOX.h, BOX.w), ghost)
  boxHit.position.set(BOX.x + 0.1, BOX.h / 2, BOX.z)
  root.add(boxHit)
  clickable(machineHit, () => airStep('machine'), { reach: 6 })
  clickable(boxHit, () => airStep('machine'), { reach: 6 })
  const colHit = new THREE.Mesh(new THREE.BoxGeometry(0.8, COL.y1 + 0.5, 0.8), ghost)
  colHit.position.set(COL.x + 0.1, (COL.y1 + 0.5) / 2, COL.z)
  root.add(colHit)
  clickable(colHit, () => airStep('column'), { reach: 6 })
  const loxHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.5), ghost)
  loxHit.position.set(AIR.lox.x, 0.45, AIR.lox.z)
  root.add(loxHit)
  clickable(loxHit, () => airStep('lox'), { reach: 6 })

  let thermoT = 0
  let dripT = 0
  updates.push((dt, t) => {
    const lv = level()
    const S = E.air.says
    // the machine cools round by round (about 20 °C a second here, sped up), warms faster when off
    const was = temp
    if (Math.abs(target - temp) > 0.05) temp += clamp(target - temp, -20 * dt, 30 * dt)
    else temp = target
    const running = target < T_ROOM - 1
    // what happens on the way, told once each way down (only to whoever ran it)
    if (airMine && temp < was) {
      if (!told.frost && temp < -2) (told.frost = true), say(at(S.frost, lv))
      else if (!told.dryIce && temp < -135) (told.dryIce = true), say(at(S.dryIce, lv))
      else if (!told.notYet && temp < -184 && temp > T_DEW + 1) (told.notYet = true), say(at(S.notYet, lv))
      else if (!told.drops && temp <= T_DEW - 0.5) (told.drops = true), say(at(S.drops, lv)), play('discover')
    }
    if (airMine && was <= T_DEW - 1 && temp > T_DEW - 1) say(at(S.boiled, lv))
    if (temp > -30) resetTold()
    // the compressor
    if (running) flywheel.rotation.x += dt * 9
    piston.position.y = 0.55 + (running ? Math.sin(flywheel.rotation.x) * 0.08 : 0)
    // frost, dry ice, liquid
    const frostK = span(0, -40, temp)
    coilMat.color.copy(COPPER).lerp(FROSTED, frostK)
    coilMat.metalness = lerp(0.9, 0.1, frostK)
    coilMat.roughness = lerp(0.35, 0.95, frostK)
    coilMat.emissiveIntensity = 0.2 * frostK
    const iceK = span(-128, -150, temp)
    let k = 0
    if (iceK > 0.01) {
      for (const [sx, sy, sz, sp] of snowSeed) {
        const y = 0.2 + (((sy - t * sp * 0.12) % 1) + 1) % 1 * 2.6
        snow.set(k++, BOX.x + sx * (BOX.d - 0.15), y, BOX.z + sz * (BOX.w - 0.15), 0.035, 0.95, 0.97, 1, 0.85 * iceK)
      }
    }
    snow.count = k
    const liq = liquidAt(temp)
    airFlask.setLevel(liq * 0.85)
    airMist.rate = liq
    // drips while the machine is making liquid
    dripT += dt
    const dripping = running && temp <= T_DEW + 0.5
    drips.forEach((d, i) => {
      const s = ((dripT * 1.6 + i / drips.length) % 1)
      d.visible = dripping
      const bottom = 0.04 + airFlask.level * airFlask.h * 0.82
      d.position.set(SPOUT.x, lerp(SPOUT.y, bottom, s * s), SPOUT.z - 0.04)
    })
    // the column: its foot holds the liquid air; separating, nitrogen boils off and the rest turns oxygen
    let o2share = null
    if (sep) {
      sep.t += dt
      if (sep.t >= SEP_T) {
        sep = null
        loxIn = true
        colPure = true
        if (airMine) say(at(S.sepDone, lv))
        play('discover')
      }
    }
    const sk = sep ? clamp(sep.t / SEP_T) : 0
    colLiquid.visible = liq > 0.02
    const lh = Math.max(0.01, liq * 0.55 * (1 - 0.35 * (colPure ? 1 : sk)))
    colLiquid.scale.y = lh
    colLiquid.position.y = COL.y0 + lh / 2
    if (liq < 0.05) colPure = false
    colLiquidMat.color.copy(AIR_C).lerp(LOX_C, colPure ? 1 : ease(sk))
    if (sep) o2share = Math.round(lerp(21, 99.5, ease(sk)) * 2) / 2
    // the oxygen's flask fills as the separation ends; it keeps its oxygen (a Dewar holds it for hours)
    const fillK = sep ? span(0.45, 1, sk) : loxIn ? 1 : 0
    loxFlask.setLevel(fillK * 0.8)
    loxMist.rate = fillK
    // the vapour from the vent, the bubbles in the column
    k = 0
    if (sep) {
      const strength = Math.sin(Math.PI * clamp(sk * 1.1))
      for (let i = 0; i < VAP; i++) {
        const s = ((t * 0.45 + i / VAP) % 1)
        const r = random(i + 11)
        vapour.set(k++, VENT.x + 0.1 + s * (0.9 + r() * 0.6), VENT.y + s * (0.5 + r() * 0.5), VENT.z + (r() - 0.5) * s * 0.9, 0.18 + s * 0.6, 0.88, 0.92, 0.97, Math.sin(Math.PI * s) * 0.5 * strength)
      }
    }
    vapour.count = k
    k = 0
    if (sep) {
      const top = COL.y1 - 0.2
      for (let i = 0; i < BUB; i++) {
        const s = ((t * 0.35 + i / BUB) % 1)
        const r = random(i + 71)
        bubbles.set(k++, COL.x + (r() - 0.5) * 0.36, lerp(COL.y0 + lh * 0.5, top, s), COL.z + (r() - 0.5) * 0.36, 0.05 + r() * 0.05, 0.92, 0.96, 1, 0.55 * Math.sin(Math.PI * s))
      }
    }
    bubbles.count = k
    // the tags glow while they matter
    n2Tag.visible = true
    o2Tag.visible = true
    // the board: redrawn when what it shows changes
    thermoT -= dt
    const key = `${lv}|${Math.round(temp)}|${o2share}`
    if (key !== thermoKey && thermoT <= 0) {
      thermoKey = key
      thermoT = 0.08
      drawThermo(temp, lv, o2share)
    }
  })

  // ======================================================================================================
  // who was first: three glass pieces on a table by the south wall
  // ======================================================================================================
  const FIRST = { x: -5.0, z: 6.45, y: 0.9 }
  const firsts = []
  const firstN = [0, 0, 0]
  {
    const table = new THREE.Group()
    table.position.set(FIRST.x, 0, FIRST.z)
    root.add(table)
    const top = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.06, 0.75, 2, 0.02), mats.bench)
    top.position.y = FIRST.y - 0.03
    table.add(top)
    for (const x of [-1.5, 1.5]) {
      for (const z of [-0.3, 0.3]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, FIRST.y - 0.06, 0.05), mats.dark)
        leg.position.set(x, (FIRST.y - 0.06) / 2, z)
        table.add(leg)
      }
    }
    solids.push(box(FIRST.x, FIRST.z, 3.3, 0.85))
    const names = ['Cailletet · Pictet', 'Wróblewski · Olszewski', 'Linde']
    const years = ['1877', '1883', '1895']
    for (let i = 0; i < 3; i++) {
      // left to right as the visitor sees them (facing +z, +x is on the left): 1877, 1883, 1895
      const g = new THREE.Group()
      g.position.set(1.1 - i * 1.1, FIRST.y, 0.05)
      g.scale.setScalar(1.25)
      table.add(g)
      // a small lectern plate facing the visitor, its top leaning back
      const plateG = new THREE.Group()
      plateG.position.set(0, 0.09, -0.26)
      plateG.rotation.y = Math.PI
      g.add(plateG)
      const tilt = new THREE.Group()
      tilt.rotation.x = -0.5
      plateG.add(tilt)
      const plate = new THREE.Mesh(new RoundedBoxGeometry(0.64, 0.22, 0.03, 2, 0.01), mats.dark)
      const yr = sign(years[i], 0.075, { color: '#ffd166' })
      yr.position.set(0, 0.045, 0.02)
      const nm = sign(names[i], 0.04, { maxWidth: 0.6 })
      nm.position.set(0, -0.055, 0.02)
      tilt.add(plate, yr, nm)
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), ghost)
      hit.position.y = 0.35
      g.add(hit)
      firsts.push({ group: g, k: 0, t: -1 })
    }
    // 1877: a thick glass tube in a steel press, a gauge; a fog inside when tapped
    {
      const g = firsts[0].group
      const block = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.16, 0.2, 2, 0.02), mats.steel)
      block.position.y = 0.08
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.42, 16, 1, true), glass)
      tube.position.y = 0.37
      tube.renderOrder = 3
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8, 0, TAU, 0, Math.PI / 2), glass)
      cap.position.y = 0.58
      const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 20), mats.steel)
      gauge.rotation.x = Math.PI / 2
      gauge.position.set(0.17, 0.2, -0.02)
      const dial = new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), new THREE.MeshStandardMaterial({ color: '#f1ead8', roughness: 0.6 }))
      dial.position.set(0.17, 0.2, -0.04)
      dial.rotation.y = Math.PI
      const fog = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 12), new THREE.MeshBasicMaterial({ color: '#eef4ff', transparent: true, opacity: 0, depthWrite: false }))
      fog.position.y = 0.37
      g.add(block, tube, cap, gauge, dial, fog)
      firsts[0].fog = fog
    }
    // 1883: a thin tube inside a glass jacket, a little pale blue liquid at its foot
    {
      const g = firsts[1].group
      // on a stand tall enough that the liquid shows above the plate in front
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.16, 20), mats.dark)
      stand.position.y = 0.08
      const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.46, 20, 1, true), glass)
      jacket.position.y = 0.39
      jacket.renderOrder = 3
      const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 12, 1, true), glass)
      inner.position.y = 0.47
      inner.renderOrder = 3
      // its own material: the tap makes it shine without lighting every other LOX in the room
      const krakow = loxMat.clone()
      krakow.emissiveIntensity = 0.9
      const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.023, 0.09, 12), krakow)
      drop.position.y = 0.23
      const meniscus = new THREE.Mesh(new THREE.SphereGeometry(0.023, 12, 6, 0, TAU, Math.PI / 2, Math.PI / 2), krakow)
      meniscus.position.y = 0.275
      meniscus.scale.y = 0.4
      const ethylene = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 20), new THREE.MeshStandardMaterial({ color: '#e9f2ff', transparent: true, opacity: 0.18, roughness: 0.1 }))
      ethylene.position.y = 0.24
      g.add(stand, jacket, inner, drop, meniscus, ethylene)
      firsts[1].drop = drop
    }
    // 1895: a small copper counterflow coil and a flask of liquid air
    {
      const g = firsts[2].group
      const pts = []
      for (let i = 0; i <= 200; i++) {
        const a = (i / 25) * TAU
        pts.push(new THREE.Vector3(-0.1 + Math.cos(a) * 0.08, 0.12 + (i / 200) * 0.36, Math.sin(a) * 0.08))
      }
      const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.012, 6, false), mats.copper)
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), mats.steel)
      post.position.set(-0.1, 0.25, 0)
      const f = dewar({ r: 0.07, h: 0.2, mat: new THREE.MeshStandardMaterial({ color: AIR_C, emissive: '#5c86ba', emissiveIntensity: 0.45, roughness: 0.05, transparent: true, opacity: 0.88 }) })
      f.group.position.set(0.14, 0, 0)
      f.setLevel(0.5)
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 6), mats.copper)
      spout.rotation.z = Math.PI / 2
      spout.position.set(0.02, 0.24, 0)
      const dropM = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), loxMat)
      dropM.visible = false
      g.add(coil, post, f.group, spout, dropM)
      firsts[2].flask = f
      firsts[2].dropM = dropM
    }
  }
  const firstsPanel = lv => ({
    title: E.firsts.title,
    color,
    blocks: [{ buttons: ['a', 'b', 'c'].map((k, i) => ({ label: E.firsts.buttons[k], onClick: () => firstStep(i) })) }, ...paras(E.firsts.panel, lv)],
  })
  function startFirst(i) {
    firsts[i].t = 0
    play(i === 0 ? 'fizz' : 'tap', { order: 0.5 })
  }
  function firstStep(i) {
    firstN[i]++
    startFirst(i)
    say(at(E.firsts.says['abc'[i]], level()))
    ex.discover('firsts', firstsPanel, 6)
    share('firsts')
  }
  ex.add({
    id: 'firsts',
    x: FIRST.x,
    z: 5.0,
    radius: 1.6,
    manual: true,
    label: E.firsts.label,
    verb: E.firsts.hints.tap,
    focus: focusOf(FIRST.x, 1.2, FIRST.z, 1.3, 2.8),
    act: () => ctx.showPanel(firstsPanel),
  })
  firsts.forEach((f, i) => clickable(f.group, () => firstStep(i), { reach: 4 }))
  updates.push(dt => {
    for (const [i, f] of firsts.entries()) {
      if (f.t < 0) continue
      f.t += dt
      const s = f.t
      if (i === 0) f.fog.material.opacity = 0.85 * Math.sin(Math.PI * clamp(s / 2.4)) * (s < 0.3 ? s / 0.3 : 1)
      if (i === 1) f.drop.material.emissiveIntensity = 0.9 + 1.1 * Math.sin(Math.PI * clamp(s / 1.6))
      if (i === 2) {
        const k = clamp(s / 0.9)
        f.dropM.visible = s < 0.9
        f.dropM.position.set(0.14, lerp(0.24, 0.08, k * k), 0)
      }
      if (s > 2.6) {
        f.t = -1
        if (i === 1) f.drop.material.emissiveIntensity = 0.9
      }
    }
  })

  // ---- the lab's own things: a trolley of open flasks breathing mist, gas cylinders by the wall ----
  {
    const trolley = new THREE.Group()
    trolley.position.set(-2.9, 0, -2.6)
    trolley.rotation.y = 0.35
    root.add(trolley)
    const deck = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.05, 0.7, 2, 0.02), mats.steel)
    deck.position.y = 0.55
    const shelf = deck.clone()
    shelf.position.y = 0.15
    trolley.add(deck, shelf)
    for (const [x, z] of [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 6), mats.steel)
      leg.position.set(x, 0.3, z)
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), mats.rubber)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(x, 0.045, z)
      trolley.add(leg, wheel)
    }
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.015, 6, 16, Math.PI), mats.steel)
    handle.position.set(-0.68, 0.8, 0)
    handle.rotation.y = Math.PI / 2
    trolley.add(handle)
    trolley.updateMatrixWorld(true)
    ;[[-0.35, 0.05, 0.13, 0.42], [0.1, -0.12, 0.1, 0.32], [0.42, 0.12, 0.12, 0.38]].forEach(([x, z, r, h], i) => {
      const f = dewar({ r, h, mat: i === 1 ? ln2Mat : loxMat })
      f.setLevel(0.8)
      f.group.position.set(x, 0.575, z)
      trolley.add(f.group)
      const p = trolley.localToWorld(new THREE.Vector3(x, 0.575 + h, z))
      stage.mist({ x: p.x, y: p.y, z: p.z, rate: 0.75, count: 14, size: 0.16, spread: 0.9, floor: 0, seed: 40 + i })
    })
    solids.push(circle(-2.9, -2.6, 0.75))
    // cylinders of gas against the south wall: grey bodies, their shoulders coloured by what they hold
    // (Europe's EN 1089-3: oxygen white, nitrogen black, argon dark green)
    const body = new THREE.MeshStandardMaterial({ color: '#7d848c', roughness: 0.45, metalness: 0.5 })
    const shoulders = ['#e8ecef', '#e8ecef', '#1b1d20', '#2f5a3a'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, metalness: 0.3 }))
    shoulders.forEach((m, i) => {
      const x = 3.6 + i * 0.42
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.3, 20), body)
      cyl.position.set(x, 0.65, 6.6)
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 10, 0, TAU, 0, Math.PI / 2), m)
      top.position.set(x, 1.3, 6.6)
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.14, 8), mats.copper)
      valve.position.set(x, 1.49, 6.6)
      root.add(cyl, top, valve)
    })
    const chain = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.03), mats.dark)
    chain.position.set(4.23, 1.0, 6.42)
    root.add(chain)
    solids.push(box(4.23, 6.6, 1.8, 0.4))
  }

  // ======================================================================================================
  // the big electromagnet, on its bench along the east wall
  // ======================================================================================================
  const GAP = new THREE.Vector3(6.75, 1.45, 0.65)
  const POLE_R = 0.08
  const BENCH = { x: 6.75, z: 0.6, w: 1.9, d: 3.6, y: 0.85 }
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(BENCH.w, 0.06, BENCH.d, 2, 0.02), mats.bench)
    top.position.set(BENCH.x, BENCH.y - 0.03, BENCH.z)
    root.add(top)
    for (const x of [-1, 1]) {
      for (const z of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, BENCH.y - 0.06, 0.06), mats.dark)
        leg.position.set(BENCH.x + (x * (BENCH.w - 0.2)) / 2, (BENCH.y - 0.06) / 2, BENCH.z + (z * (BENCH.d - 0.2)) / 2)
        root.add(leg)
      }
    }
    solids.push(box(BENCH.x, BENCH.z, BENCH.w + 0.1, BENCH.d + 0.1))
  }
  const magnetGroup = new THREE.Group()
  root.add(magnetGroup)
  const coilGlow = new THREE.MeshStandardMaterial({ color: '#b8703f', roughness: 0.4, metalness: 0.85, emissive: '#ff8a3c', emissiveIntensity: 0 })
  {
    // the yoke, painted the picture's red: two cheeks and a base
    for (const s of [-1, 1]) {
      const cheek = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.95, 0.22, 2, 0.03), mats.paint)
      cheek.position.set(GAP.x, 1.38, GAP.z + s * 0.82)
      magnetGroup.add(cheek)
      // the coil, the iron core through it, the tapered pole piece
      const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.34, 32), coilGlow)
      coil.rotation.x = Math.PI / 2
      coil.position.set(GAP.x, GAP.y, GAP.z + s * 0.42)
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 24), mats.steel)
      core.rotation.x = Math.PI / 2
      core.position.set(GAP.x, GAP.y, GAP.z + s * 0.66)
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(POLE_R, 0.19, 0.2, 28), mats.steel)
      pole.rotation.x = s < 0 ? Math.PI / 2 : -Math.PI / 2
      pole.position.set(GAP.x, GAP.y, GAP.z + s * 0.16)
      // the windings' edges, darker rings
      for (const e of [-0.17, 0.17]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.012, 6, 32), mats.dark)
        ring.position.set(GAP.x, GAP.y, GAP.z + s * 0.42 + e)
        magnetGroup.add(ring)
      }
      magnetGroup.add(coil, core, pole)
    }
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.22, 1.86, 2, 0.03), mats.paint)
    base.position.set(GAP.x, BENCH.y + 0.11, GAP.z)
    magnetGroup.add(base)
    // N and S on the pole pieces' sides
    for (const [s, l] of [[-1, 'N'], [1, 'S']]) {
      const t = sign(l, 0.09, { color: '#ffffff' })
      t.position.set(GAP.x - 0.26, GAP.y + 0.3, GAP.z + s * 0.42)
      t.rotation.y = -Math.PI / 2
      magnetGroup.add(t)
    }
    // the catch basin under the gap, on a little stand
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.05, 28, 1, true), mats.steel)
    basin.position.set(GAP.x - 0.05, BENCH.y + 0.26, GAP.z)
    const basinFloor = new THREE.Mesh(new THREE.CircleGeometry(0.13, 28), mats.dark)
    basinFloor.rotation.x = -Math.PI / 2
    basinFloor.position.set(GAP.x - 0.05, BENCH.y + 0.236, GAP.z)
    const basinStand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.235, 12), mats.dark)
    basinStand.position.set(GAP.x - 0.05, BENCH.y + 0.1175, GAP.z)
    magnetGroup.add(basin, basinFloor, basinStand)
    // the power supply on the floor, its cables up to the coils
    const psu = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.7, 0.8, 2, 0.03), mats.bench)
    psu.position.set(7.55, 0.35, -1.95)
    magnetGroup.add(psu)
    solids.push(box(7.55, -1.95, 0.6, 0.9))
    stage.pipeRun([[7.4, 0.62, -1.7], [7.4, 0.62, -1.1], [7.25, 1.1, -0.4], [GAP.x + 0.1, 1.2, GAP.z - 0.42]], { r: 0.022, mat: mats.rubber, bend: 0.2 })
  }
  const BASIN_Y = BENCH.y + 0.25
  const basinLiquid = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), ln2Mat)
  basinLiquid.rotation.x = -Math.PI / 2
  basinLiquid.position.set(GAP.x - 0.05, BASIN_Y, GAP.z)
  basinLiquid.visible = false
  root.add(basinLiquid)
  // the LOX bridge between the poles
  const bridge = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.06, 8, 20), loxMat)
  bridge.rotation.x = Math.PI / 2
  bridge.position.copy(GAP).add(new THREE.Vector3(0, -0.015, 0))
  bridge.visible = false
  root.add(bridge)
  const bridgeMist = stage.mist({ x: GAP.x, y: GAP.y - 0.05, z: GAP.z, rate: 0, count: 18, size: 0.18, spread: 0.35, floor: BENCH.y + 0.26, seed: 9 })
  const basinMist = stage.mist({ x: GAP.x - 0.05, y: BASIN_Y + 0.02, z: GAP.z, rate: 0, count: 22, size: 0.25, spread: 0.6, floor: BENCH.y, seed: 13 })
  // the falling blob when the bridge lets go
  const blob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), loxMat)
  blob.visible = false
  root.add(blob)
  // the stream from a flask
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.009, 1, 8).translate(0, -0.5, 0), loxMat)
  stream.visible = false
  root.add(stream)

  // ---- the three things: two flasks and the water dish ----
  const things = {}
  const THING_AT = { lox: new THREE.Vector3(6.05, BENCH.y, -0.85), ln2: new THREE.Vector3(6.05, BENCH.y, -0.42), water: new THREE.Vector3(6.1, BENCH.y, 1.95) }
  for (const id of ['lox', 'ln2']) {
    const f = dewar({ r: 0.07, h: 0.24, mat: id === 'lox' ? loxMat : ln2Mat })
    f.setLevel(0.85)
    f.group.position.copy(THING_AT[id])
    root.add(f.group)
    const m = stage.mist({ x: THING_AT[id].x, y: BENCH.y + 0.25, z: THING_AT[id].z, rate: 0.55, count: 12, size: 0.08, spread: 0.25, floor: BENCH.y, seed: id === 'lox' ? 21 : 23 })
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), ghost)
    hit.position.y = 0.2
    f.group.add(hit)
    const tag = formulaText(id === 'lox' ? 'O2' : 'N2', { size: 0.075, color: id === 'lox' ? '#9fd6ff' : '#f2f6ff' })
    tag.position.set(0, 0.42, 0)
    tag.rotation.y = -Math.PI / 2
    const word = sign(E.magnet.tags[id], 0.04, { maxWidth: 0.34 })
    word.position.set(0, 0.34, 0)
    word.rotation.y = -Math.PI / 2
    f.group.add(tag, word)
    things[id] = { flask: f, mist: m }
  }
  // the water: a small glass dish on a lab jack, between the poles when in
  const waterDish = new THREE.Group()
  {
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.05, 0.035, 24, 1, true), glass)
    dish.position.y = 0.0175
    dish.renderOrder = 3
    const floorD = new THREE.Mesh(new THREE.CircleGeometry(0.05, 24), new THREE.MeshStandardMaterial({ color: '#c9dcea', roughness: 0.2, transparent: true, opacity: 0.4 }))
    floorD.rotation.x = -Math.PI / 2
    floorD.position.y = 0.002
    const surf = new THREE.Mesh(new THREE.CircleGeometry(0.049, 24), waterMat)
    surf.rotation.x = -Math.PI / 2
    surf.position.y = 0.026
    waterDish.add(dish, floorD, surf)
  }
  root.add(waterDish)
  // the dish's stand: a glass rod on a small foot (on the bench, or in the basin under the poles)
  const jack = new THREE.Group()
  {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.012, 16), mats.steel)
    foot.position.y = 0.006
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 1, 8), mats.steel)
    rod.name = 'scissor'
    jack.add(foot, rod)
  }
  root.add(jack)
  {
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.3), ghost)
    hit.position.y = 0.1
    waterDish.add(hit)
    const tag = formulaText('H2O', { size: 0.075, color: '#9fd6ff' })
    tag.position.set(THING_AT.water.x, BENCH.y + 0.34, THING_AT.water.z)
    tag.rotation.y = -Math.PI / 2
    const word = sign(E.magnet.tags.water, 0.04, { maxWidth: 0.34 })
    word.position.set(THING_AT.water.x, BENCH.y + 0.27, THING_AT.water.z)
    word.rotation.y = -Math.PI / 2
    root.add(tag, word)
  }
  things.water = { dish: waterDish }
  // the dish's two places: on the bench, and in the gap (its water surface just below the poles' middle)
  const DISH_REST = THING_AT.water.clone().add(new THREE.Vector3(0, 0.12, 0))
  const DISH_IN = GAP.clone().add(new THREE.Vector3(0, -0.045, 0))

  // ---- the field board on the wall, and the magnifier screen for the water ----
  const fieldBoard = screen(1.7, 1.3, 640)
  fieldBoard.group.position.set(7.93, 2.75, GAP.z)
  fieldBoard.group.rotation.y = -Math.PI / 2
  root.add(fieldBoard.group)
  const lens = screen(0.78, 0.55, 384)
  lens.group.position.set(7.15, 1.55, 2.05)
  lens.group.rotation.y = -Math.PI / 2 + 0.5
  root.add(lens.group)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.36, 8), mats.dark)
    post.position.set(7.15, BENCH.y + 0.2, 2.05)
    root.add(post)
  }
  let fieldKey = ''
  function drawField(b, lv) {
    const { g, w, h } = fieldBoard
    const B = E.magnet.board
    const sci = lv === 'scientist'
    g.fillStyle = '#0d1430'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(255,120,100,0.6)'
    g.lineWidth = 4
    g.strokeRect(6, 6, w - 12, h - 12)
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    const L = sci ? w * 0.56 : w
    g.fillStyle = '#ff9a8a'
    fit(g, B.title, 30, 44, 32, 700, L - 60)
    g.fillStyle = '#f2f6ff'
    fit(g, b < 0.01 ? B.off : `${nf(b, 2)} T`, 30, 104, 62, 800, L - 60)
    // the field as a bar
    g.fillStyle = '#1d2747'
    g.fillRect(30, 146, L - 60, 16)
    g.fillStyle = '#ff7a64'
    g.fillRect(30, 146, (L - 60) * (b / B_MAX), 16)
    // who is pulled, who is pushed
    const rows = [
      [B.lox, '#8fd0ff', sci ? `χ = +3,5 × 10⁻³ · ${B.para}` : B.pulled, sci ? fill(B.hold, { h: nf(loxHold(b) * 100, 1) }) : null],
      [B.ln2, '#e9f2fb', sci ? B.dia : B.pushed, null],
      [B.water, '#5aa2dc', sci ? `χ = −9,05 × 10⁻⁶ · ${B.dia}` : B.pushed, sci ? fill(B.dip, { d: nf(waterDip(b) * 1000, 2) }) : null],
    ]
    let y = 214
    for (const [name, c, what, extra] of rows) {
      g.fillStyle = c
      g.beginPath()
      g.arc(46, y, 12, 0, TAU)
      g.fill()
      g.fillStyle = '#f2f6ff'
      fit(g, name, 70, y - 13, 28, 700, L - 100)
      g.fillStyle = '#9fb3d9'
      const text = lang === 'en' ? what.replace(/,(\d)/g, '.$1') : what
      fit(g, text, 70, y + 17, 22, 600, L - 100)
      if (extra) {
        g.fillStyle = '#c7d5ef'
        fit(g, extra, 70, y + 44, 20, 600, L - 100)
      }
      y += extra ? 108 : 80
    }
    if (!sci) {
      fieldBoard.tex.needsUpdate = true
      return
    }
    // O2's outer molecular orbitals: σ2p, π2p, π*2p, σ*2p; two electrons alone in π*, spins parallel
    const X0 = w * 0.6
    g.strokeStyle = 'rgba(160,175,205,0.4)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(X0 - 10, 30)
    g.lineTo(X0 - 10, h - 30)
    g.stroke()
    g.fillStyle = '#ff9a8a'
    g.textAlign = 'center'
    fit(g, B.mo, (X0 + w) / 2 - 6, 44, 26, 700, w - X0 - 30)
    const box2 = (cx, cy, e) => {
      g.strokeStyle = '#c7d5ef'
      g.lineWidth = 2
      g.strokeRect(cx - 22, cy - 22, 44, 44)
      g.strokeStyle = e.hot ? '#ffd166' : '#8fd0ff'
      g.lineWidth = 3
      const arrow = (x, up) => {
        g.beginPath()
        g.moveTo(x, cy + (up ? 14 : -14))
        g.lineTo(x, cy + (up ? -14 : 14))
        g.moveTo(x - 6, cy + (up ? -7 : 7))
        g.lineTo(x, cy + (up ? -14 : 14))
        g.lineTo(x + 6, cy + (up ? -7 : 7))
        g.stroke()
      }
      if (e.n === 2) arrow(cx - 8, true), arrow(cx + 8, false)
      else if (e.n === 1) arrow(cx, true)
    }
    const MX = (X0 + w) / 2 + 10
    const levels = [
      ['σ*2p', 150, [{ n: 0 }]],
      ['π*2p', 240, [{ n: 1, hot: true }, { n: 1, hot: true }]],
      ['π2p', 340, [{ n: 2 }, { n: 2 }]],
      ['σ2p', 430, [{ n: 2 }]],
    ]
    for (const [name, y0, boxes] of levels) {
      g.fillStyle = '#9fb3d9'
      g.textAlign = 'right'
      fit(g, name, X0 + 70, y0, 24, 700, 80)
      boxes.forEach((e, i) => box2(MX + (i - (boxes.length - 1) / 2) * 56, y0, e))
    }
    g.fillStyle = '#ffd166'
    g.textAlign = 'center'
    fit(g, B.unpaired, (X0 + w) / 2, 196, 20, 700, w - X0 - 30)
    g.fillStyle = '#9fb3d9'
    fit(g, 'S = 1', (X0 + w) / 2, h - 40, 22, 600, w - X0 - 30)
    fieldBoard.tex.needsUpdate = true
  }
  let lensKey = ''
  function drawLens(b, inGap) {
    const { g, w, h } = lens
    const Lw = E.magnet.lens
    g.fillStyle = '#0d1430'
    g.fillRect(0, 0, w, h)
    g.textBaseline = 'middle'
    g.textAlign = 'center'
    g.fillStyle = '#8fd0ff'
    fit(g, Lw.title, w / 2, 26, 24, 700, w - 30)
    if (!inGap) {
      g.fillStyle = '#9fb3d9'
      fit(g, Lw.empty, w / 2, h / 2 + 10, 26, 600, w - 40)
      lens.tex.needsUpdate = true
      return
    }
    // the water's surface seen from the side: flat, with the dip under the poles (60 px to the millimetre)
    const dip = waterDip(b) * 1000
    const PX = 60
    const y0 = 110
    g.fillStyle = '#5aa2dc'
    g.beginPath()
    g.moveTo(20, h - 30)
    for (let x = 20; x <= w - 20; x += 4) {
      const u = (x - w / 2) / (w * 0.16)
      g.lineTo(x, y0 + dip * PX * Math.exp(-u * u))
    }
    g.lineTo(w - 20, h - 30)
    g.closePath()
    g.fill()
    g.strokeStyle = '#cfe8ff'
    g.lineWidth = 3
    g.beginPath()
    for (let x = 20; x <= w - 20; x += 4) {
      const u = (x - w / 2) / (w * 0.16)
      g.lineTo(x, y0 + dip * PX * Math.exp(-u * u))
    }
    g.stroke()
    // the poles' faces above, left and right of the middle
    g.fillStyle = '#9aa3ad'
    g.fillRect(w / 2 - 120, 52, 70, 34)
    g.fillRect(w / 2 + 50, 52, 70, 34)
    // a 1 mm scale bar
    g.strokeStyle = '#ffd166'
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(w - 40, y0)
    g.lineTo(w - 40, y0 + PX)
    g.stroke()
    g.fillStyle = '#ffd166'
    g.textAlign = 'right'
    fit(g, Lw.scale, w - 48, y0 + PX / 2, 18, 700, 80)
    g.textAlign = 'center'
    g.fillStyle = '#ffffff'
    fit(g, fill(Lw.dip, { d: nf(dip, 2) }), w / 2, h - 16, 24, 800, w - 40)
    lens.tex.needsUpdate = true
  }

  // ---- the magnet's state (shared): the field, the last thing brought, how long ago; the water in ----
  let field = 1.0
  let magN = 0
  let what = null // 'lox' | 'ln2' | 'water'
  let magAge = 99
  let waterIn = false
  let pour = null // { id, t, mine }
  let dish = { from: 0, to: 0, t: 1 } // the dish's way: 0 on the bench, 1 in the gap
  let bridgeAmt = 0
  let fallT = -1 // the bridge falling
  let puddle = 0
  let magMine = false
  const POUR_T = 3.4
  const magPanel = lv => ({
    title: E.magnet.title,
    color,
    blocks: [
      {
        slider: {
          label: E.magnet.slider,
          min: 0,
          max: B_MAX,
          step: 0.05,
          value: field,
          onInput: v => slideField(v),
          format: v => `${nf(v, 2)} T`,
          live: () => field,
        },
      },
      { buttons: ['lox', 'ln2', 'water'].map(k => ({ label: E.magnet.buttons[k], onClick: () => magStep(k) })) },
      ...paras(E.magnet.panel, lv),
    ],
  })
  const holdOf = b => clamp((b - B_HOLD) / 0.3)
  function startPour(id, mine) {
    pour = { id, t: 0, mine }
    if (waterIn) moveDish(false)
    play('tap')
  }
  function moveDish(inGap) {
    waterIn = inGap
    dish = { from: dish.to * ease(clamp(dish.t)) + dish.from * (1 - ease(clamp(dish.t))), to: inGap ? 1 : 0, t: 0 }
  }
  function magStep(id) {
    const lv = level()
    const S = E.magnet.says
    if (pour) return say(at(W.busy, lv))
    if (id === 'water') {
      moveDish(!waterIn)
      play(waterIn ? 'select' : 'tap')
      if (waterIn) later(1.3, () => magMine && say(fill(at(S.water, level()), { d: nf(waterDip(field) * 1000, 2), b: nf(field, 2) })))
      else say(at(S.waterBack, lv))
    } else {
      startPour(id, true)
    }
    magN++
    what = id
    magAge = 0
    magMine = true
    ex.discover('magnet', magPanel, 4.2)
    share('magnet')
  }
  let fieldSending = false
  function slideField(v) {
    const was = field
    field = clamp(Math.round(v * 20) / 20, 0, B_MAX)
    magMine = true
    if (bridgeAmt > 0.05 && field < B_HOLD && was >= B_HOLD) dropBridge(true)
    ex.discover('magnet', magPanel, 4.2)
    if (fieldSending) return
    fieldSending = true
    later(0.25, () => {
      fieldSending = false
      share('magnet')
    })
  }
  function dropBridge(mine) {
    fallT = 0
    blob.scale.setScalar(Math.max(0.4, bridgeAmt))
    bridgeAmt = 0
    if (mine) say(at(E.magnet.says.loxFall, level()))
    play('fizz', { order: 0.6 })
  }
  ex.add({
    id: 'magnet',
    x: 4.55,
    z: 0.6,
    radius: 2.0,
    manual: true,
    label: E.magnet.label,
    verb: () => {
      const h = E.magnet.hints
      if (pour) return h.watch
      if (waterIn) return h.water
      return h.pick
    },
    focus: focusOf(6.6, 1.5, 0.55, 2.4, 4.2),
    act: () => ctx.showPanel(magPanel),
  })
  clickable(things.lox.flask.group, () => magStep('lox'), { reach: 4.5 })
  clickable(things.ln2.flask.group, () => magStep('ln2'), { reach: 4.5 })
  clickable(waterDish, () => magStep('water'), { reach: 4.5 })

  const lipLocal = new THREE.Vector3(0, 0.24, 0.07)
  const tilted = new THREE.Euler()
  const q = new THREE.Quaternion()
  updates.push((dt, t) => {
    const lv = level()
    const S = E.magnet.says
    magAge += dt
    // the coils warm a little with the current
    coilGlow.emissiveIntensity = 0.06 * (field / B_MAX)
    // a pour: up over the gap, tilt, pour, back
    for (const id of ['lox', 'ln2']) {
      const f = things[id].flask
      const p = pour && pour.id === id ? pour : null
      if (!p) {
        f.group.position.copy(THING_AT[id])
        f.group.rotation.set(0, 0, 0)
        things[id].mist.move(THING_AT[id].x, BENCH.y + 0.25, THING_AT[id].z)
        continue
      }
      const s = p.t
      const up = span(0, 0.7, s) - span(2.7, 3.4, s)
      const tilt = 1.95 * (span(0.6, 1.0, s) - span(2.4, 2.75, s)) + 0.25 * up
      tilted.set(tilt, 0, 0)
      q.setFromEuler(tilted)
      const lip = lipLocal.clone().applyQuaternion(q)
      // where the flask's foot goes so its lip is over the gap's middle
      const over = new THREE.Vector3(GAP.x, GAP.y + 0.3, GAP.z).sub(lip)
      f.group.position.lerpVectors(THING_AT[id], over, up)
      f.group.quaternion.copy(q)
      things[id].mist.move(f.group.position.x, f.group.position.y + 0.2, f.group.position.z)
    }
    let streamTo = null
    if (pour) {
      pour.t += dt
      const s = pour.t
      const pouring = s > 1.0 && s < 2.45
      const lox = pour.id === 'lox'
      const holds = lox && field >= B_HOLD
      if (pouring) {
        streamTo = holds ? GAP.y - 0.02 : BASIN_Y
        stream.material = lox ? loxMat : ln2Mat
        if (holds) bridgeAmt = Math.min(holdOf(field), bridgeAmt + dt / 1.1)
        else puddle = Math.min(1, puddle + dt / 1.2)
      }
      if (s > 1.05 && s - dt <= 1.05) play('fizz', { order: lox ? 0.6 : 1 })
      if (s >= 2.5 && s - dt < 2.5 && pour.mine) {
        if (lox) say(holds ? fill(at(S.lox, lv), { b: nf(field, 2), h: nf(loxHold(field) * 100, 1) }) : at(S.loxWeak, lv))
        else say(at(S.ln2, lv))
      }
      if (s >= POUR_T) pour = null
    }
    if (streamTo != null) {
      const f = things[pour.id].flask
      const top = lipLocal.clone().applyQuaternion(f.group.quaternion).add(f.group.position)
      stream.visible = true
      stream.position.copy(top)
      stream.scale.set(1, Math.max(0.01, top.y - streamTo), 1)
    } else stream.visible = false
    // the bridge boils away slowly, and falls if the field drops below what holds it
    if (bridgeAmt > 0 && !(pour && pour.id === 'lox' && pour.t < 2.5)) {
      const was = bridgeAmt
      bridgeAmt = Math.max(0, bridgeAmt - dt / 40)
      if (field < B_HOLD && bridgeAmt > 0.05) dropBridge(false)
      else if (was > 0.02 && bridgeAmt <= 0.02) {
        bridgeAmt = 0
        if (magMine) say(at(S.boiled, lv))
      }
    }
    bridge.visible = bridgeAmt > 0.02
    const bs = Math.max(0.3, Math.sqrt(bridgeAmt))
    bridge.scale.set(bs, 1, bs * 0.9)
    bridge.position.y = GAP.y - 0.02 - (1 - bs) * 0.03
    bridgeMist.rate = bridgeAmt
    if (fallT >= 0) {
      fallT += dt
      const k = clamp(fallT / 0.45)
      blob.visible = k < 1
      blob.position.set(GAP.x, lerp(GAP.y - 0.02, BASIN_Y, k * k), GAP.z)
      if (k >= 1) {
        fallT = -1
        puddle = Math.min(1, puddle + 0.6)
      }
    }
    // the puddle in the basin boils off fast (77 K and 90 K liquids on a warm metal dish)
    puddle = Math.max(0, puddle - dt / 9)
    basinLiquid.visible = puddle > 0.02
    basinLiquid.scale.setScalar(0.5 + 0.5 * puddle)
    basinLiquid.material = what === 'lox' ? loxMat : ln2Mat
    basinMist.rate = Math.min(1, puddle * 1.5)
    // the dish on its jack
    dish.t = Math.min(1, dish.t + dt / 1.2)
    const dk = lerp(dish.from, dish.to, ease(dish.t))
    const lift = Math.sin(Math.PI * dk) * 0.08
    waterDish.position.lerpVectors(DISH_REST, DISH_IN, dk)
    waterDish.position.y += lift * (dish.t < 1 ? 1 : 0)
    const footY = lerp(BENCH.y, BENCH.y + 0.24, dk)
    jack.position.set(waterDish.position.x, footY, waterDish.position.z)
    const sc = jack.getObjectByName('scissor')
    const jh = Math.max(0.02, waterDish.position.y - footY - 0.012)
    sc.scale.y = jh
    sc.position.y = 0.015 + jh / 2
    // the boards
    const fk = `${lv}|${field.toFixed(2)}`
    if (fk !== fieldKey) {
      fieldKey = fk
      drawField(field, lv)
    }
    const settled = waterIn && dish.t >= 1
    const lk = `${settled}|${field.toFixed(2)}`
    if (lk !== lensKey) {
      lensKey = lk
      drawLens(field, settled)
    }
  })

  // ======================================================================================================
  // the floating frog: a model of the Nijmegen Bitter magnet, cut open
  // ======================================================================================================
  const FROG = { x: 6.85, z: 4.7, y0: 0.5, h: 1.3, r: 0.6, bore: 0.16 }
  const frogModel = new THREE.Group()
  frogModel.position.set(FROG.x, 0, FROG.z)
  root.add(frogModel)
  const frog = new THREE.Group()
  let frogDisplay
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(1.4, FROG.y0, 1.4, 2, 0.04), mats.dark)
    plinth.position.y = FROG.y0 / 2
    frogModel.add(plinth)
    solids.push(circle(FROG.x, FROG.z, 0.85))
    // the outer shell, open on the side facing the room (−x)
    const shellMat = new THREE.MeshStandardMaterial({ color: '#3d5a80', roughness: 0.45, metalness: 0.5, side: THREE.DoubleSide })
    const open = Math.PI / 2
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(FROG.r, FROG.r, FROG.h, 40, 1, true, -Math.PI / 4, TAU - open), shellMat)
    shell.position.y = FROG.y0 + FROG.h / 2
    frogModel.add(shell)
    for (const y of [FROG.y0 + 0.02, FROG.y0 + FROG.h - 0.02]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(FROG.r, 0.03, 8, 40), mats.steel)
      ring.rotation.x = Math.PI / 2
      ring.position.y = y
      frogModel.add(ring)
    }
    // the Bitter plates, a stack of copper discs with a hole, seen in the cut
    // in the shape's own plane the cut is the quarter round −y; the plates are the other three quarters
    const plate = new THREE.Shape()
    plate.absarc(0, 0, FROG.r - 0.02, -Math.PI * 0.25, Math.PI * 1.25, false)
    plate.absarc(0, 0, FROG.bore + 0.03, Math.PI * 1.25, -Math.PI * 0.25, true)
    const plateGeo = new THREE.ExtrudeGeometry(plate, { depth: 0.022, bevelEnabled: false, curveSegments: 16 })
    plateGeo.rotateX(Math.PI / 2)
    disposers.push(() => plateGeo.dispose())
    const N = 26
    const plates = new THREE.InstancedMesh(plateGeo, mats.copper, N)
    const m = new THREE.Matrix4()
    for (let i = 0; i < N; i++) plates.setMatrixAt(i, m.makeTranslation(0, FROG.y0 + 0.06 + (i * (FROG.h - 0.1)) / N + 0.022, 0))
    // turned so the cut faces −x: the shape's arc runs from −135° to −45° in its own plane
    plates.rotation.y = Math.PI / 2
    frogModel.add(plates)
    // the bore: a glass tube, a soft cushion at its foot
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(FROG.bore, FROG.bore, FROG.h + 0.2, 28, 1, true), glass)
    bore.position.y = FROG.y0 + FROG.h / 2 + 0.1
    bore.renderOrder = 3
    const cushion = new THREE.Mesh(new THREE.CylinderGeometry(FROG.bore - 0.01, FROG.bore - 0.01, 0.06, 20), new THREE.MeshStandardMaterial({ color: '#c94a6a', roughness: 0.9 }))
    cushion.position.y = FROG.y0 + 0.08
    frogModel.add(bore, cushion)
    // cooling water pipes behind
    stage.pipeRun([[FROG.x + 0.5, 0.4, FROG.z - 0.25], [FROG.x + 0.5, FROG.y0 + FROG.h - 0.2, FROG.z - 0.25], [FROG.x + 0.95, FROG.y0 + FROG.h - 0.2, FROG.z - 0.25], [FROG.x + 0.95, 3.6, FROG.z - 0.25]], { r: 0.04, mat: mats.steel, bend: 0.15 })
    stage.pipeRun([[FROG.x + 0.5, 0.4, FROG.z + 0.25], [FROG.x + 0.5, FROG.y0 + 0.3, FROG.z + 0.25], [FROG.x + 0.95, FROG.y0 + 0.3, FROG.z + 0.25], [FROG.x + 0.95, 3.6, FROG.z + 0.25]], { r: 0.04, mat: mats.steel, bend: 0.15 })
    // the frog: green, its legs folded under it, big eyes
    const skin = new THREE.MeshStandardMaterial({ color: '#5f9a3c', roughness: 0.55 })
    const belly = new THREE.MeshStandardMaterial({ color: '#c9d98a', roughness: 0.6 })
    const eyeMat = new THREE.MeshStandardMaterial({ color: '#e8d24a', roughness: 0.3 })
    const pupil = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.3 })
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 12), skin)
    body.scale.set(1, 0.62, 1.25)
    const under = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 10), belly)
    under.scale.set(0.95, 0.5, 1.15)
    under.position.y = -0.012
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 10), skin)
    head.scale.set(1.1, 0.7, 0.9)
    head.position.set(0, 0.012, 0.085)
    frog.add(body, under, head)
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), eyeMat)
      eye.position.set(s * 0.032, 0.042, 0.095)
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 6), pupil)
      p.position.set(s * 0.036, 0.048, 0.11)
      const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), skin)
      thigh.scale.set(0.8, 0.55, 1.6)
      thigh.position.set(s * 0.07, -0.01, -0.05)
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 6), skin)
      foot.scale.set(1.2, 0.35, 1.6)
      foot.position.set(s * 0.085, -0.03, 0.02)
      const arm = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 6), skin)
      arm.scale.set(1, 0.6, 2.2)
      arm.position.set(s * 0.05, -0.03, 0.07)
      frog.add(eye, p, thigh, foot, arm)
    }
    frog.scale.setScalar(1.35)
    frogModel.add(frog)
    // the display on the plinth's front and the note above
    frogDisplay = screen(0.62, 0.3, 320)
    frogDisplay.group.position.set(-0.71, 0.3, 0)
    frogDisplay.group.rotation.y = -Math.PI / 2
    frogModel.add(frogDisplay.group)
    const where = sign('Nijmegen · 1997 · 16 T', 0.09, { color: '#ffd166', maxWidth: 1.6 })
    where.position.set(-0.2, FROG.y0 + FROG.h + 0.42, 0)
    where.rotation.y = -Math.PI / 2
    const note = sign(E.frog.note, 0.055, { maxWidth: 1.3 })
    note.position.set(-0.2, FROG.y0 + FROG.h + 0.26, 0)
    note.rotation.y = -Math.PI / 2
    frogModel.add(where, note)
  }
  const FROG_REST = FROG.y0 + 0.16
  const FROG_FLOAT = FROG.y0 + FROG.h * 0.66
  let frogOn = false
  let frogAge = 99
  let frogB = 0
  let frogY = FROG_REST
  let frogMine = false
  let floating = false
  let frogKey = ''
  const frogPanel = lv => ({
    title: E.frog.title,
    color,
    blocks: [{ buttons: [['on', true], ['off', false]].map(([k, v]) => ({ label: E.frog.buttons[k], onClick: () => frogStep(v) })) }, ...paras(E.frog.panel, lv)],
  })
  function frogStep(on = !frogOn) {
    const lv = level()
    if (on === frogOn) return say(at(on ? E.frog.says.float : E.frog.says.landed, lv))
    frogOn = on
    frogAge = 0
    frogMine = true
    play(on ? 'beam' : 'tap')
    say(at(on ? E.frog.says.on : E.frog.says.off, lv))
    ex.discover('frog', frogPanel, 6.5)
    share('frog')
  }
  ex.add({
    id: 'frog',
    x: 4.8,
    z: FROG.z,
    radius: 1.7,
    manual: true,
    label: E.frog.label,
    verb: () => (frogOn ? (floating ? E.frog.hints.off : E.frog.hints.wait) : E.frog.hints.on),
    focus: focusOf(FROG.x, 1.3, FROG.z, 2.3, 2.4),
    act: () => ctx.showPanel(frogPanel),
  })
  {
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(FROG.r + 0.1, FROG.r + 0.1, FROG.h + FROG.y0 + 0.3, 16), ghost)
    hit.position.y = (FROG.h + FROG.y0 + 0.3) / 2
    frogModel.add(hit)
  }
  clickable(frogModel, () => frogStep(), { reach: 4.5 })
  updates.push((dt, t) => {
    const lv = level()
    frogAge += dt
    // the field ramps over about 5 s (sped up: real ones take minutes)
    const want = frogOn ? FROG_B : 0
    frogB = frogB + clamp(want - frogB, -4 * dt, 3.4 * dt)
    const lifts = frogB >= FROG_LIFT
    const goal = lifts ? FROG_FLOAT + Math.sin(t * 1.3) * 0.025 : FROG_REST
    const wasFloating = floating
    frogY = damp(frogY, goal, lifts ? 1.4 : 2.2, dt)
    floating = lifts && frogY > FROG_FLOAT - 0.08
    if (floating && !wasFloating) {
      play('discover')
      if (frogMine) say(at(E.frog.says.float, lv))
    }
    if (!frogOn && wasFloating !== floating && frogMine) later(1.2, () => say(at(E.frog.says.landed, level())))
    frog.position.set(0, frogY, 0)
    frog.rotation.y = -Math.PI / 2 + (lifts ? Math.sin(t * 0.4) * 0.9 : 0)
    frog.rotation.z = lifts ? Math.sin(t * 0.9) * 0.08 : 0
    const key = `${frogB.toFixed(1)}`
    if (key !== frogKey) {
      frogKey = key
      const { g, w, h } = frogDisplay
      g.fillStyle = '#0d1430'
      g.fillRect(0, 0, w, h)
      g.textBaseline = 'middle'
      g.textAlign = 'center'
      g.fillStyle = '#9fb3d9'
      fit(g, E.frog.display, w / 2, 26, 22, 600, w - 20)
      g.fillStyle = frogB >= FROG_LIFT ? '#ffd166' : '#f2f6ff'
      fit(g, `${nf(frogB, 1)} T`, w / 2, 76, 46, 800, w - 20)
      g.fillStyle = '#1d2747'
      g.fillRect(20, h - 30, w - 40, 12)
      g.fillStyle = '#ffd166'
      g.fillRect(20, h - 30, (w - 40) * (frogB / FROG_B), 12)
      frogDisplay.tex.needsUpdate = true
    }
  })

  // ======================================================================================================
  // outside: the rocket engine on its test stand, Goddard's rocket, the picture's rocket on its far pad
  // ======================================================================================================
  const ENG = { x: 0.5, y: 1.9, z: -25.5 } // the nozzle's exit; the flame goes +x from here
  const TANK = { z: -28.8, fuel: -4.5, lox: -1.9, r: 0.85, y0: 2.5, h: 4.6 }
  const stand = new THREE.Group()
  root.add(stand)
  const concrete = new THREE.MeshStandardMaterial({ color: '#7b7d82', roughness: 0.95 })
  const nozzleMat = new THREE.MeshStandardMaterial({ color: '#5d4e44', roughness: 0.4, metalness: 0.75, emissive: '#ff4a1a', emissiveIntensity: 0 })
  const engine = new THREE.Group()
  engine.position.set(ENG.x, ENG.y, ENG.z)
  stand.add(engine)
  {
    // the thrust block the engine pushes against
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.2, 3.0), concrete)
    block.position.set(-2.7, 1.6, ENG.z)
    stand.add(block)
    solids.push(box(-2.7, ENG.z, 1.9, 3.1))
    // the engine: chamber, throat, bell, along +x
    const prof = [[0.12, 0], [0.16, 0.08], [0.24, 0.3], [0.36, 0.7], [0.47, 1.1], [0.55, 1.4]]
    const bell = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 32), nozzleMat)
    bell.rotation.z = -Math.PI / 2
    bell.position.x = -1.4
    const chamber = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.7, 24), mats.steel)
    chamber.rotation.z = Math.PI / 2
    chamber.position.x = -1.75
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 10, 0, TAU, 0, Math.PI / 2), mats.steel)
    dome.rotation.z = Math.PI / 2
    dome.position.x = -2.1
    const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 16), mats.dark)
    pump.position.set(-1.8, 0.4, 0)
    engine.add(bell, chamber, dome, pump)
    // the frame holding it to the block
    for (const s of [-1, 1]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), mats.dark)
      strut.position.set(-2.1, s * 0.3, s * 0.3)
      strut.rotation.y = s * 0.3
      engine.add(strut)
    }
    const hit = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.4), ghost)
    hit.position.x = -1.2
    engine.add(hit)
    // the flame pit: a dark scorched strip of concrete where the flame runs
    const scorch = new THREE.Mesh(new THREE.PlaneGeometry(11, 3.4), new THREE.MeshStandardMaterial({ color: '#3a3836', roughness: 1 }))
    scorch.rotation.x = -Math.PI / 2
    scorch.position.set(6, 0.006, ENG.z)
    stand.add(scorch)
    // a low blast wall between the visitors and the stand
    const wall = new THREE.Mesh(new RoundedBoxGeometry(11, 0.7, 0.45, 2, 0.06), concrete)
    wall.position.set(3.5, 0.35, -23.0)
    stand.add(wall)
    solids.push(box(3.5, -23.0, 11, 0.45))
  }
  // the tanks on legs behind the engine: kerosene and liquid oxygen (frosted, venting)
  const tanks = {}
  for (const id of ['fuel', 'lox']) {
    const x = TANK[id]
    const g = new THREE.Group()
    g.position.set(x, 0, TANK.z)
    stand.add(g)
    const mat = id === 'lox' ? frost : new THREE.MeshStandardMaterial({ color: '#d4d7dc', roughness: 0.5, metalness: 0.3 })
    const body = new THREE.Mesh(new THREE.CylinderGeometry(TANK.r, TANK.r, TANK.h, 32), mat)
    body.position.y = TANK.y0 + TANK.h / 2
    const capT = new THREE.Mesh(new THREE.SphereGeometry(TANK.r, 32, 12, 0, TAU, 0, Math.PI / 2), mat)
    capT.position.y = TANK.y0 + TANK.h
    capT.scale.y = 0.5
    const capB = capT.clone()
    capB.rotation.x = Math.PI
    capB.position.y = TANK.y0
    g.add(body, capT, capB)
    for (const a of [0.8, 2.4, 3.9, 5.5]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, TANK.y0 + 0.2, 0.12), mats.dark)
      leg.position.set(Math.cos(a) * (TANK.r - 0.1), (TANK.y0 + 0.2) / 2 - 0.1, Math.sin(a) * (TANK.r - 0.1))
      g.add(leg)
    }
    const label = sign(E.rocket.tanks[id], 0.3, { color: id === 'lox' ? '#2a6fb0' : '#7a1f1f', maxWidth: 1.6 })
    label.outlineWidth = 0
    label.position.set(0, TANK.y0 + TANK.h * 0.55, TANK.r + 0.01)
    g.add(label)
    // a feed line down to the engine
    stage.pipeRun([[x, TANK.y0 - 0.1, TANK.z + 0.3], [x, 0.9, TANK.z + 0.3], [x, 0.9, ENG.z - 0.2], [-1.3, 0.9, ENG.z - 0.2], [-1.3, ENG.y - 0.15, ENG.z - 0.2]], { r: 0.07, mat: id === 'lox' ? frost : mats.steel, bend: 0.3 })
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(TANK.r + 0.1, TANK.r + 0.1, TANK.h + 1.2, 12), ghost)
    hit.position.y = TANK.y0 + TANK.h / 2
    g.add(hit)
    tanks[id] = g
    solids.push(circle(x, TANK.z, TANK.r + 0.2))
  }
  const ventMist = stage.mist({ x: TANK.lox + 0.3, y: TANK.y0 + TANK.h + 0.5, z: TANK.z, rate: 0.8, count: 22, size: 0.6, spread: 1.6, floor: 0, seed: 31 })
  // the tower beside the stand: four posts and braces, a red light on top
  {
    const g = new THREE.Group()
    g.position.set(-6.6, 0, -27.6)
    stand.add(g)
    const T = 12
    const s = 0.7
    for (const [x, z] of [[-s, -s], [s, -s], [-s, s], [s, s]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, T, 0.12), mats.dark)
      post.position.set(x, T / 2, z)
      g.add(post)
    }
    const braceGeo = new THREE.BoxGeometry(0.05, Math.hypot(2 * s, 1.5), 0.05)
    const braces = new THREE.InstancedMesh(braceGeo, mats.dark, 8 * 4)
    const m = new THREE.Matrix4()
    const qq = new THREE.Quaternion()
    let n = 0
    for (let i = 0; i < 8; i++) {
      for (const [ax, az, ry] of [[0, -s, 0], [0, s, 0], [-s, 0, Math.PI / 2], [s, 0, Math.PI / 2]]) {
        qq.setFromEuler(new THREE.Euler(0, ry, (i % 2 ? 1 : -1) * Math.atan2(2 * s, 1.5)))
        m.compose(new THREE.Vector3(ax, 0.75 + i * 1.5, az), qq, new THREE.Vector3(1, 1, 1))
        braces.setMatrixAt(n++, m)
      }
    }
    g.add(braces)
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshStandardMaterial({ color: '#ff3b30', emissive: '#ff2a1a', emissiveIntensity: 3 }))
    lamp.position.y = T + 0.15
    lamp.name = 'beacon'
    g.add(lamp)
    solids.push(box(-6.6, -27.6, 1.6, 1.6))
  }
  const beacon = stand.getObjectByName('beacon')
  // floodlights on poles, aimed at the engine
  const floods = []
  for (const [x, z] of [[-5.6, -21.2], [10.4, -21.8]]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 6, 8), mats.dark)
    pole.position.set(x, 3, z)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.3), new THREE.MeshStandardMaterial({ color: '#f6f1e6', emissive: '#fff4dc', emissiveIntensity: 2.2 }))
    head.position.set(x, 6.1, z)
    head.lookAt(ENG.x - 1, ENG.y, ENG.z)
    stand.add(pole, head)
    solids.push(circle(x, z, 0.2))
    const spot = new THREE.SpotLight('#fff1d8', light ? 70 : 90, 26, 0.45, 0.6, 1.4)
    spot.position.set(x, 6, z)
    spot.target.position.set(ENG.x - 0.5, ENG.y - 0.5, ENG.z)
    stand.add(spot, spot.target)
    floods.push(spot)
  }
  // the flame, its light, its smoke
  const plumeMat = plumeMaterial()
  const PLUME_LEN = 9
  const plumeGeo = new THREE.CylinderGeometry(1.15, 0.5, PLUME_LEN, 28, 24, true).translate(0, PLUME_LEN / 2, 0)
  const plume = new THREE.Mesh(plumeGeo, plumeMat)
  plume.rotation.z = -Math.PI / 2
  plume.position.set(ENG.x - 0.05, ENG.y, ENG.z)
  plume.visible = false
  plume.raycast = () => {}
  plume.renderOrder = 5
  stand.add(plume)
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color('#ffd9a0').multiplyScalar(2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  flash.position.set(ENG.x + 0.4, ENG.y, ENG.z)
  flash.visible = false
  stand.add(flash)
  const fireLight = new THREE.PointLight('#ffa860', 0, 30, 1.5)
  const OX_LIGHT = new THREE.Color('#c8d0ff')
  fireLight.position.set(ENG.x + 2.5, ENG.y + 0.5, ENG.z + 2)
  stand.add(fireLight)
  const SMOKE = light ? 36 : 80
  const smoke = stage.puffs(SMOKE)
  stand.add(smoke.mesh)
  const smokeSeed = Array.from({ length: SMOKE }, (_, i) => {
    const r = random(900 + i)
    return [r(), r(), r(), r()]
  })

  // ---- the mix board ----
  const mixBoard = screen(1.7, 1.15, 640)
  mixBoard.group.position.set(-2.4, 2.0, -19.4)
  mixBoard.group.rotation.y = Math.atan2(1.6 - -2.4, -17.4 - -19.4)
  stand.add(mixBoard.group)
  for (const s of [-0.6, 0.6]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.4, 8), mats.dark)
    post.position.set(-2.4 + s * Math.cos(mixBoard.group.rotation.y), 0.7, -19.4 - s * Math.sin(mixBoard.group.rotation.y))
    stand.add(post)
  }
  solids.push(circle(-2.4, -19.4, 0.7))
  let mixKey = ''
  function drawMix(mix, lv, burning) {
    const { g, w, h } = mixBoard
    const B = E.rocket.board
    const sci = lv === 'scientist'
    g.fillStyle = '#0d1430'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(255,190,110,0.6)'
    g.lineWidth = 4
    g.strokeRect(6, 6, w - 12, h - 12)
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    g.fillStyle = '#ffbe6e'
    fit(g, B.title, 30, 44, 32, 700, w - 60)
    g.fillStyle = '#f2f6ff'
    g.textAlign = 'left'
    fit(g, `${nf(mix, 1)}`, 30, 112, 72, 800, 200)
    g.fillStyle = '#9fb3d9'
    fit(g, B.per, 150, 116, 26, 600, w - 180)
    // the scale from 0.6 to 4.0 with its zones
    const X0 = 40
    const X1 = w - 40
    const xOf = r => X0 + ((r - MIX.min) / (MIX.max - MIX.min)) * (X1 - X0)
    const Y = 200
    const zones = [[MIX.min, 1.75, '#7a4a2a'], [1.75, 2.25, '#6b7a3a'], [2.25, 2.75, '#3f9a5a'], [2.75, 3.15, '#6b7a3a'], [3.15, MIX.max, '#8a3a5a']]
    for (const [a, b, c] of zones) {
      g.fillStyle = c
      g.fillRect(xOf(a), Y - 18, xOf(b) - xOf(a), 36)
    }
    g.textAlign = 'center'
    g.fillStyle = '#f2f6ff'
    fit(g, B.lean, (xOf(MIX.min) + xOf(1.75)) / 2, Y + 42, 21, 600, xOf(1.75) - xOf(MIX.min))
    fit(g, B.good, xOf(2.5), Y + 42, 21, 700, 150)
    fit(g, B.rich, (xOf(3.15) + xOf(MIX.max)) / 2, Y + 42, 21, 600, xOf(MIX.max) - xOf(3.15))
    if (sci) {
      for (const [r, label] of [[3.4, `${B.stoich}: ${nf(3.4, 1)}`], [2.27, `${B.f1}: ${nf(2.27, 2)}`]]) {
        g.strokeStyle = '#ffd166'
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(xOf(r), Y - 26)
        g.lineTo(xOf(r), Y + 18)
        g.stroke()
        g.fillStyle = '#ffd166'
        fit(g, label, xOf(r), Y - 40, 18, 600, 200)
      }
    }
    // the marker
    g.fillStyle = '#ffffff'
    g.beginPath()
    g.moveTo(xOf(mix), Y + 20)
    g.lineTo(xOf(mix) - 12, Y + 2)
    g.lineTo(xOf(mix) + 12, Y + 2)
    g.closePath()
    g.fill()
    g.fillRect(xOf(mix) - 2, Y - 22, 4, 26)
    // the push
    const P = pushOf(mix)
    g.textAlign = 'left'
    g.fillStyle = '#9fb3d9'
    fit(g, B.push, 30, h - 110, 26, 700, 200)
    g.fillStyle = '#1d2747'
    g.fillRect(30, h - 88, w - 60, 30)
    g.fillStyle = burning ? '#ffbe6e' : '#7a6a5a'
    g.fillRect(30, h - 88, (w - 60) * P, 30)
    mixBoard.tex.needsUpdate = true
  }

  // ---- Goddard's rocket of 1926, beside the visitors: the motor on top, the tanks below ----
  const goddard = new THREE.Group()
  goddard.position.set(-4.5, 0, -16.4)
  stand.add(goddard)
  const goddardFlame = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: new THREE.Color('#ffb070').multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  goddardFlame.visible = false
  {
    const pipe = (a, b, r = 0.012, mat = mats.steel) => {
      const len = a.distanceTo(b)
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), mat)
      m.position.copy(a).add(b).multiplyScalar(0.5)
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
      goddard.add(m)
    }
    const V = (x, y, z) => new THREE.Vector3(x, y, z)
    // the launch frame: an A of pipes
    for (const s of [-1, 1]) {
      pipe(V(s * 0.6, 0, -0.4), V(s * 0.12, 3.0, 0), 0.02, mats.dark)
      pipe(V(s * 0.6, 0, 0.4), V(s * 0.12, 3.0, 0), 0.02, mats.dark)
    }
    pipe(V(-0.12, 3.0, 0), V(0.12, 3.0, 0), 0.02, mats.dark)
    // the motor at the top, nozzle down
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 12), mats.copper)
    motor.position.y = 2.5
    const noz = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 12, 1, true), mats.copper)
    noz.position.y = 2.36
    goddard.add(motor, noz)
    goddardFlame.position.y = 2.2
    goddardFlame.scale.setScalar(0.5)
    goddard.add(goddardFlame)
    // two feed pipes down to the tanks, and the cone shielding the tanks
    for (const s of [-1, 1]) pipe(V(s * 0.05, 2.45, 0), V(s * 0.08, 1.0, 0))
    for (const s of [-1, 1]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.36, 12), s < 0 ? mats.steel : frost)
      t.position.set(s * 0.08, 0.78, 0)
      goddard.add(t)
    }
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.14, 16), mats.steel)
    cone.position.y = 1.04
    goddard.add(cone)
    const plate = sign('Goddard · 1926', 0.12, { color: '#ffd166' })
    plate.position.set(0, 0.35, 0.5)
    plate.rotation.y = Math.atan2(1.6 - -4.5, -17.4 - -16.4)
    goddard.add(plate)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.2, 1.0), ghost)
    hit.position.y = 1.6
    goddard.add(hit)
    solids.push(circle(-4.5, -16.4, 0.7))
  }

  // ---- the picture's rocket on its far pad, searchlights on it ----
  {
    const g = new THREE.Group()
    g.position.set(42, 0, -165)
    stand.add(g)
    const white = new THREE.MeshStandardMaterial({ color: '#dfe3ea', roughness: 0.5, emissive: '#3a4256', emissiveIntensity: 0.6 })
    const red = new THREE.MeshStandardMaterial({ color: '#e04848', roughness: 0.5, emissive: '#5a1a1a', emissiveIntensity: 0.6 })
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 30, 24), white)
    body.position.y = 17
    const nose = new THREE.Mesh(new THREE.ConeGeometry(2, 7, 24), white)
    nose.position.y = 35.5
    const band = new THREE.Mesh(new THREE.CylinderGeometry(2.02, 2.02, 2, 24), red)
    band.position.y = 30.5
    const dark = new THREE.Mesh(new THREE.CylinderGeometry(2.03, 2.03, 1.2, 24), mats.dark)
    dark.position.y = 26
    g.add(body, nose, band, dark)
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 3), red)
      const a = (i / 4) * TAU + Math.PI / 4
      fin.position.set(Math.cos(a) * 2.8, 4.5, Math.sin(a) * 2.8)
      fin.rotation.y = -a
      g.add(fin)
    }
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2, 40, 2), new THREE.MeshStandardMaterial({ color: '#46506e', roughness: 0.8, emissive: '#1d2338' }))
    tower.position.set(-6.5, 20, 0)
    const light1 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), new THREE.MeshStandardMaterial({ color: '#ff3b30', emissive: '#ff2a1a', emissiveIntensity: 3 }))
    light1.position.set(-6.5, 40.8, 0)
    const pad = new THREE.Mesh(new THREE.BoxGeometry(20, 1.2, 14), new THREE.MeshStandardMaterial({ color: '#30343e', roughness: 1 }))
    pad.position.y = 0.6
    g.add(tower, light1, pad)
    // searchlight beams, faint cones from the ground
    const beamMat = new THREE.MeshBasicMaterial({ color: '#9fb4d6', transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false })
    for (const [x, tilt] of [[-14, 0.22], [14, -0.24], [0, 0.05]]) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(5, 60, 16, 1, true).translate(0, -30, 0), beamMat)
      cone.rotation.z = Math.PI + tilt
      cone.position.set(x, 0, 8)
      g.add(cone)
    }
  }

  // ---- the engine's state (shared): the mix, the firings ----
  let mix = MIX.start
  let fireN = 0
  let burn = null // { t, mix, mine }
  let lastVerdict = null // after a firing: 'lean' | 'ok' | 'good' | 'rich'
  let rocketMine = false
  let goddardT = -1
  const rocketPanel = lv => ({
    title: E.rocket.title,
    color,
    blocks: [
      {
        slider: {
          label: E.rocket.slider,
          min: MIX.min,
          max: MIX.max,
          step: 0.1,
          value: mix,
          onInput: v => slideMix(v),
          format: v => `${nf(v, 1)} kg`,
          live: () => mix,
        },
      },
      { buttons: [['fire', () => rocketStep('engine')], ['more', () => rocketStep('lox')], ['less', () => rocketStep('fuel')]].map(([k, f]) => ({ label: E.rocket.buttons[k], onClick: f })) },
      ...paras(E.rocket.panel, lv),
    ],
  })
  function startBurn(m, mine) {
    burn = { t: 0, mix: m, mine }
    play('bang')
  }
  function rocketStep(step) {
    const lv = level()
    const S = E.rocket.says
    if (step === 'engine') {
      if (burn) return say(at(W.busy, lv))
      fireN++
      startBurn(mix, true)
    } else if (step === 'lox' || step === 'fuel') {
      if (burn) return say(at(W.busy, lv))
      const was = mix
      mix = clamp(Math.round((mix + (step === 'lox' ? MIX.step : -MIX.step)) * 10) / 10, MIX.min, MIX.max)
      if (mix === was) return say(fill(at(step === 'lox' ? S.more : S.less, lv), { m: nf(mix, 1) }))
      play(step === 'lox' ? 'select' : 'tap')
      lastVerdict = null
      say(fill(at(step === 'lox' ? S.more : S.less, lv), { m: nf(mix, 1) }))
    } else if (step === 'goddard') {
      goddardT = 0
      play('pop')
      say(at(S.goddard, lv))
      ex.discover('rocket', rocketPanel, 9)
      return
    } else return
    rocketMine = true
    ex.discover('rocket', rocketPanel, step === 'engine' ? BURN.end + 1 : 2.4)
    share('rocket')
  }
  let mixSending = false
  function slideMix(v) {
    if (burn) return
    mix = clamp(Math.round(v * 10) / 10, MIX.min, MIX.max)
    lastVerdict = null
    rocketMine = true
    ex.discover('rocket', rocketPanel, 2.4)
    if (mixSending) return
    mixSending = true
    later(0.25, () => {
      mixSending = false
      share('rocket')
    })
  }
  ex.add({
    id: 'rocket',
    x: 1.6,
    z: -17.4,
    radius: 2.6,
    manual: true,
    label: E.rocket.label,
    verb: () => {
      const h = E.rocket.hints
      if (burn) return h.burning
      if (lastVerdict === 'lean' || (lastVerdict === 'ok' && mix < 2.5)) return h.more
      if (lastVerdict === 'rich' || (lastVerdict === 'ok' && mix > 2.5)) return h.less
      return h.fire
    },
    focus: focusOf(3.4, 2.1, -25.6, 5.6, 9.4),
    act: () => ctx.showPanel(rocketPanel),
  })
  clickable(engine, () => rocketStep('engine'), { reach: 14 })
  clickable(tanks.lox, () => rocketStep('lox'), { reach: 15 })
  clickable(tanks.fuel, () => rocketStep('fuel'), { reach: 15 })
  clickable(goddard, () => rocketStep('goddard'), { reach: 8 })

  updates.push((dt, t) => {
    const lv = level()
    const S = E.rocket.says
    beacon.material.emissiveIntensity = Math.sin(t * 2.4) > 0.2 ? 3 : 0.3
    // the burn: a flash, then the flame at its mix, then shutdown
    let k = 0
    let soot = 0
    let ox = 0
    if (burn) {
      burn.t += dt
      const s = burn.t
      soot = sootOf(burn.mix)
      ox = oxOf(burn.mix)
      k = span(0, BURN.light, s) * (1 - span(BURN.steady, BURN.steady + 0.6, s))
      if (s > 0.5 && Math.floor((s - dt) / 0.55) !== Math.floor(s / 0.55) && s < BURN.steady) play(soot > 0.5 ? 'crack' : 'fizz', { order: 3.2 * (1 - 0.5 * soot) })
      if (s >= 2.2 && s - dt < 2.2 && burn.mine) {
        const v = verdictOf(burn.mix)
        say(fill(at(S[v], lv), { m: nf(burn.mix, 1) }))
      }
      if (s >= BURN.end) {
        lastVerdict = verdictOf(burn.mix)
        burn = null
      }
    }
    plume.visible = k > 0.01
    plumeMat.uniforms.uK.value = k * (0.75 + 0.25 * Math.sin(t * 37))
    plumeMat.uniforms.uTime.value = t
    plumeMat.uniforms.uSoot.value = soot
    plumeMat.uniforms.uOx.value = ox
    const P = burn ? pushOf(burn.mix) : 0
    plumeMat.uniforms.uReach.value = clamp(0.22 + 0.78 * Math.pow(P, 5) - 0.12 * ox)
    plume.scale.set(1 - 0.25 * ox, 1, 1 - 0.25 * ox)
    flash.visible = burn != null && burn.t < 0.6
    if (flash.visible) {
      const f = burn.t / 0.6
      flash.material.opacity = 1 - f
      flash.scale.setScalar(1.5 + 5 * f)
    }
    fireLight.intensity = k * (light ? 32 : 45) * (1 - 0.6 * soot) * (1 - 0.4 * ox) * (0.85 + 0.15 * Math.sin(t * 29))
    fireLight.color.setRGB(1, lerp(0.66, 0.42, soot), lerp(0.38, 0.2, soot)).lerp(OX_LIGHT, ox * 0.4)
    // the nozzle glows when the mix is too rich in oxygen
    nozzleMat.emissiveIntensity = damp(nozzleMat.emissiveIntensity, burn ? ox * 1.6 * k + 0.08 * k : 0, burn ? 1.2 : 0.4, dt)
    // smoke and steam drifting along the flame and up
    let n = 0
    const sm = burn ? clamp(burn.t / 1.2) : 0
    const fade = burn ? 1 - span(BURN.steady, BURN.end, burn.t) : 0
    if (sm > 0.01 && fade > 0.01) {
      const reach = PLUME_LEN * plumeMat.uniforms.uReach.value
      const shade = lerp(0.7, 0.05, soot)
      for (let i = 0; i < SMOKE; i++) {
        const [a, b, c, d] = smokeSeed[i]
        const s = ((t * (0.18 + 0.1 * d) + a) % 1)
        const x = ENG.x + reach * 0.55 + s * (6 + 4 * b)
        const y = ENG.y + s * s * (2.5 + 2 * c) + (b - 0.5) * 0.6
        const z = ENG.z + (c - 0.5) * (0.6 + s * 4)
        const alpha = Math.sin(Math.PI * s) * (0.12 + 0.6 * soot) * sm * fade
        smoke.set(n++, x, y, z, 0.9 + s * 3.2, shade, shade * 0.97, shade * 0.95, alpha)
      }
    }
    smoke.count = n
    // Goddard's motor glows a moment when tapped
    if (goddardT >= 0) {
      goddardT += dt
      goddardFlame.visible = goddardT < 1.4
      goddardFlame.material.opacity = Math.sin(Math.PI * clamp(goddardT / 1.4))
      goddardFlame.scale.set(0.35, 0.6 + 0.2 * Math.sin(t * 40), 1)
      if (goddardT > 1.4) goddardT = -1
    }
    // the board
    const key = `${lv}|${mix.toFixed(1)}|${!!burn}`
    if (key !== mixKey) {
      mixKey = key
      drawMix(burn ? burn.mix : mix, lv, !!burn)
    }
    ventMist.rate = 0.8
  })

  // ======================================================================================================
  // words that follow the depth switch, the stage
  // ======================================================================================================
  updates.push((dt, t) => {
    const lv = level()
    if (lv !== shownLevel) {
      shownLevel = lv
      for (const [o, k] of byLevel) o.visible = depthOf(lv) === k
    }
    stage.update(t)
  })
  drawThermo(T_ROOM, level(), null)

  // a ray from the camera to a point, for the probes' real taps
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = obj => obj.getWorldPosition(new THREE.Vector3())

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 5.8 },
    cameraPitchMax: 0.45,
    spawn: { x: 0, z: 3.4, yaw: 0 },
    hostSpot: { x: -1.8, z: 2.2, yaw: Math.atan2(-1.8, -1.2) },
    back: { x: 0, z: 6.4, rot: Math.PI },
    // the easel on the right of the arrival, off the stations' lines of sight
    // (between the lines the stations' views back off along on an upright phone: z 0.5 and z 4.7)
    stand: { x: 2.0, z: 2.9, rot: Math.atan2(-2.3, 1.7) },
    parts: {
      air: {
        tap: step => airStep(step), // 'machine' (the machine or the cold box), 'column', 'lox' (the flask); 'run', 'off' (the panel)
        slide: v => slideAir(v), // the panel's slider (°C)
        get temp() {
          return temp
        },
        get target() {
          return target
        },
        get lox() {
          return loxIn
        },
        get busy() {
          return !!sep
        },
      },
      firsts: { tap: i => firstStep(i) }, // 0 1877, 1 1883, 2 1895
      magnet: {
        tap: id => magStep(id), // 'lox' | 'ln2' | 'water'
        field: b => slideField(b), // the panel's slider (T)
        get bridge() {
          return bridgeAmt
        },
        get busy() {
          return !!pour
        },
        get water() {
          return waterIn
        },
      },
      frog: {
        tap: () => frogStep(),
        get floating() {
          return floating
        },
      },
      rocket: {
        tap: step => rocketStep(step), // 'engine' | 'lox' | 'fuel' (the tanks) | 'goddard'
        mix: v => slideMix(v), // the panel's slider (kg of oxygen per kg of kerosene)
        get busy() {
          return !!burn
        },
        get state() {
          return { mix, fireN, lastVerdict }
        },
      },
      // points to aim a real tap at (with rayTo): __ew.world.onTap(p.rayTo(p.at.column()))
      at: {
        machine: () => world(machineHit),
        column: () => new THREE.Vector3(COL.x, 2, COL.z),
        lox: () => world(loxHit),
        first: i => world(firsts[i].group).add(new THREE.Vector3(0, 0.3, 0)),
        loxFlask: () => world(things.lox.flask.group).add(new THREE.Vector3(0, 0.15, 0)),
        ln2Flask: () => world(things.ln2.flask.group).add(new THREE.Vector3(0, 0.15, 0)),
        water: () => world(waterDish),
        frog: () => new THREE.Vector3(FROG.x, 1.2, FROG.z),
        engine: () => new THREE.Vector3(ENG.x - 1, ENG.y, ENG.z),
        loxTank: () => new THREE.Vector3(TANK.lox, TANK.y0 + TANK.h * 0.6, TANK.z + TANK.r),
        fuelTank: () => new THREE.Vector3(TANK.fuel, TANK.y0 + TANK.h * 0.6, TANK.z + TANK.r),
        goddard: () => world(goddard).add(new THREE.Vector3(0, 1.5, 0)),
      },
      rayTo,
    },
    panels: { air: airPanel, firsts: firstsPanel, magnet: magPanel, frog: frogPanel, rocket: rocketPanel },
    shared: {
      air: {
        get: () => ({ t: Math.round(target), sep: sepN, lox: loxIn || !!sep }),
        set: (s, liveSet) => {
          target = clamp(Math.round(Number(s?.t) || T_ROOM), T_MIN, T_ROOM)
          const n = Math.max(0, Math.round(Number(s?.sep) || 0))
          const lox = !!s?.lox
          airMine = false
          if (liveSet && n === sepN + 1 && !sep) {
            sepN = n
            sep = { t: 0, mine: false }
          } else {
            if (!liveSet) temp = target
            sepN = n
            if (!liveSet) sep = null
            loxIn = lox && !sep
            if (!liveSet) colPure = lox && liquidAt(temp) > 0.05
          }
          if (!liveSet) resetTold()
        },
      },
      firsts: {
        get: () => ({ n: [...firstN] }),
        set: (s, liveSet) => {
          const n = Array.isArray(s?.n) ? s.n.slice(0, 3).map(v => Math.max(0, Math.round(Number(v) || 0))) : [0, 0, 0]
          for (let i = 0; i < 3; i++) {
            if (liveSet && n[i] === firstN[i] + 1) startFirst(i)
            firstN[i] = n[i] ?? 0
          }
        },
      },
      magnet: {
        // the age stops at 50 s: by then nothing it started is still going (the bridge boils off in 40 s)
        get: () => ({ b: field, n: magN, what, age: Math.min(50, Math.round(magAge * 10) / 10), water: waterIn }),
        set: (s, liveSet, ago = 0) => {
          const b = clamp(Number(s?.b) || 0, 0, B_MAX)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const w = ['lox', 'ln2', 'water'].includes(s?.what) ? s.what : null
          const water = !!s?.water
          const age = Math.max(0, Number(s?.age) || 0) + (Number(ago) || 0)
          magMine = false
          const wasField = field
          field = Math.round(b * 20) / 20
          if (liveSet && bridgeAmt > 0.05 && field < B_HOLD && wasField >= B_HOLD) dropBridge(false)
          if (liveSet && n === magN + 1 && !pour) {
            magN = n
            what = w
            magAge = age
            if (w === 'water') moveDish(water)
            else if (w) startPour(w, false)
          } else {
            magN = n
            what = w
            magAge = age
            pour = null
            waterIn = water
            dish = { from: water ? 1 : 0, to: water ? 1 : 0, t: 1 }
            // what a pour of oxygen left between the poles, as it stands now
            bridgeAmt = w === 'lox' && field >= B_HOLD ? holdOf(field) * clamp(1 - Math.max(0, age - 2.4) / 40) : 0
            if (bridgeAmt < 0.03) bridgeAmt = 0
            puddle = 0
            fallT = -1
          }
        },
      },
      frog: {
        get: () => ({ on: frogOn }),
        set: (s, liveSet) => {
          const on = !!s?.on
          frogMine = false
          if (on !== frogOn) {
            frogOn = on
            frogAge = 0
            if (liveSet) play(on ? 'beam' : 'tap')
          }
          if (!liveSet) {
            frogB = on ? FROG_B : 0
            frogY = on ? FROG_FLOAT : FROG_REST
            floating = on
          }
        },
      },
      rocket: {
        get: () => ({ mix, n: fireN, age: burn ? Math.round(burn.t * 10) / 10 : null }),
        set: (s, liveSet, ago = 0) => {
          const m = clamp(Math.round((Number(s?.mix) || MIX.start) * 10) / 10, MIX.min, MIX.max)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          rocketMine = false
          mix = m
          if (liveSet && n === fireN + 1 && !burn) {
            fireN = n
            startBurn(m, false)
          } else {
            fireN = n
            // a firing under way when someone walks in burns on from where it is
            const age = s?.age == null ? null : Number(s.age) + (Number(ago) || 0)
            burn = age != null && age < BURN.end ? { t: age, mix: m, mine: false } : null
          }
          lastVerdict = null
        },
      },
    },
    attach() {},
    detach() {},
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const c of [snow, vapour, bubbles, smoke]) c.dispose()
      for (const tx of textures) tx.dispose()
      for (const d of disposers) d()
      plumeGeo.dispose()
    },
  }
}
