// Carbon's picture "A diamond and a pencil: twins?" as a room (docs/knowledge/picture-rooms.md). The
// gallery wing (/e/C/allotropes) shows the two structures side by side; this room tells where each comes
// from and what people make of it, in a workshop at night (stages/workshop.js) with the picture's two
// halves: the diamond on the left, the pencil on the right, the picture's navy starry night in the windows.
// Each step is chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps felt
// passive); the prompt names the next tap; E opens the station's panel, whose buttons and sliders do the same:
// - the diamond depths: a slice of the Earth 250 km deep standing as tall as the room, its top the
//   surface. A lift carries a lump of graphite down a rail (tap the slice where it should go, or the depth
//   slider). Below about 143 km, under an old continent, diamond is the stable form (the blue zone): the
//   lump turns into a diamond, a third smaller. Brought up slowly (the lift), it turns back to graphite.
//   A board beside it reads depth, heat and squeeze; at Scientist level a pressure-temperature diagram
//   with the graphite-diamond line, a cratonic geotherm and the carbon's dot;
// - the kimberlite pipe: tap it and magma races up from the bottom, takes the carbon from the lift and
//   throws it out of the crater into the case in front: a diamond if it was deep enough, graphite if not.
//   Fast is the point; in the case the diamond stays a diamond (metastable: tap the case);
// - the pencil workshop: tap the graphite and clay hoppers (or the mix slider) to fill the bowl (the grade
//   shown above it), the kiln to bake the lead (about 1000 °C), the paper to write: a grey line as dark as
//   the mix, under a lens the flakes of graphite it is made of.
// All three are shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<exhibit> does what a tap does, for the probes; parts.at.<thing>() gives a point to aim a real tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, lerp, damp, random, fill } from '../../../wings/noble/kit.js'
import { edgeGlass } from '../../../common/props.js'
import { workshopStage } from '../../stages/workshop.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { TWINS_WORDS } from './twins.words.js'

export const WORDS = TWINS_WORDS

const TAU = Math.PI * 2
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// ---- the deep Earth under an old continent (a craton), 0 to 250 km ----
const KM = 250
const MOHO = 40
// pressure from the rock above (GPa): crust about 2.85 g/cm3, mantle about 3.35 g/cm3
const pressureAt = d => (d <= MOHO ? d * 0.0279 : MOHO * 0.0279 + (d - MOHO) * 0.0328)
// a cool cratonic geotherm, roughly (°C); it crosses the graphite-diamond line at 143 km (4.5 GPa, 1000 °C)
const GEO = [[0, 10], [40, 430], [100, 800], [150, 1030], [200, 1190], [250, 1330]]
function tempAt(d) {
  for (let i = 1; i < GEO.length; i++) {
    if (d <= GEO[i][0] || i === GEO.length - 1) {
      const [d0, t0] = GEO[i - 1]
      const [d1, t1] = GEO[i]
      return lerp(t0, t1, clamp((d - d0) / (d1 - d0)))
    }
  }
  return GEO[GEO.length - 1][1]
}
// the graphite-diamond line, roughly (Kennedy and Kennedy 1976): about 4.5 GPa at 1000 °C
const lineP = T => 1.8 + 0.0027 * T
// where the geotherm crosses it: below this depth diamond is the stable form (143 km)
const LINE = (() => {
  let d = 0
  while (d < KM && pressureAt(d) < lineP(tempAt(d))) d += 0.5
  return d
})()
// below about 215 km the continent's root ends in hot, slowly flowing mantle
const FLOW = 215
// the squeeze in elephants (5 t) on a fingernail (1 cm2)
const elephantsAt = d => Math.round((pressureAt(d) * 1e5) / (9.81 * 5000))
// kimberlite magma rises at roughly 4 to 20 m/s; the room's clock takes 10 m/s
const hoursFrom = d => (d * 1000) / 10 / 3600

// ---- pencil grades: the graphite's share of graphite and clay (grades differ between makers; HB is
//      about two parts graphite to one of clay) ----
const GRADES = [['9H', 0.33], ['6H', 0.4], ['4H', 0.46], ['2H', 0.53], ['H', 0.58], ['F', 0.62], ['HB', 0.67], ['B', 0.71], ['2B', 0.75], ['4B', 0.8], ['6B', 0.86], ['8B', 0.92]]
const gradeOf = s => {
  if (s < 0.2) return null
  let best = GRADES[0]
  for (const g of GRADES) if (Math.abs(g[1] - s) < Math.abs(best[1] - s)) best = g
  return best[0]
}
// how dark a line the lead leaves (0 none, 1 as black as graphite gets)
const darkOf = s => Math.pow(clamp((s - 0.22) / 0.72), 0.8)
const MIX_MAX = 8 // scoops the bowl holds
const STROKES = 6 // lines on the paper

const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }

/** A soft round glow. */
function softTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.4, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A four-pointed sparkle, the picture's twinkle on its diamond. */
function starTex() {
  return canvasTex(128, 128, (g, w) => {
    const c = w / 2
    const grd = g.createRadialGradient(c, c, 0, c, c, c * 0.35)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
    g.fillStyle = 'rgba(255,255,255,0.95)'
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      g.beginPath()
      g.moveTo(c - dx * c, c - dy * c)
      g.lineTo(c + dy * 7, c + dx * 7)
      g.lineTo(c + dx * c, c + dy * c)
      g.lineTo(c - dy * 7, c - dx * 7)
      g.closePath()
      g.fill()
    }
  })
}

/** Flames on a glowing back wall, at strength uK (0 cold and dark). */
function fireMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uK: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uK;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float n = noise(vec2(p.x * 3.0, p.y * 2.2 - uTime * 1.4)) * 0.6 + noise(vec2(p.x * 7.0, p.y * 5.0 - uTime * 2.6)) * 0.4;
        float tongue = smoothstep(0.35, 0.85, n + 0.45 - (p.y + 1.0) * 0.32);
        vec3 c = mix(vec3(1.0, 0.28, 0.04), vec3(1.0, 0.72, 0.28) * 1.4, tongue);
        vec3 cold = vec3(0.025, 0.018, 0.015);
        gl_FragColor = vec4(mix(cold, c, uK), 1.0);
      }`,
  })
}

/** A little grey elephant facing right, about 44 px wide, its feet at y + 18. */
function elephant(g, x, y) {
  g.fillStyle = '#c9c3bd'
  g.beginPath()
  g.ellipse(x - 4, y - 2, 16, 12, 0, 0, TAU)
  g.fill()
  g.beginPath()
  g.arc(x + 13, y - 7, 8.5, 0, TAU)
  g.fill()
  for (const lx of [-15, -8, 2, 8]) g.fillRect(x + lx, y + 4, 5.5, 14)
  // the trunk, curling down
  g.strokeStyle = '#c9c3bd'
  g.lineWidth = 4.5
  g.lineCap = 'round'
  g.beginPath()
  g.moveTo(x + 19, y - 6)
  g.quadraticCurveTo(x + 25, y + 4, x + 21, y + 12)
  g.stroke()
  // the ear and the eye
  g.fillStyle = '#a69f98'
  g.beginPath()
  g.ellipse(x + 8, y - 5, 5, 7, 0.2, 0, TAU)
  g.fill()
  g.fillStyle = '#1a1a1a'
  g.beginPath()
  g.arc(x + 16, y - 9, 1.6, 0, TAU)
  g.fill()
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const H = 7.2
  const stage = workshopStage({
    light,
    x0: -8,
    x1: 8,
    z0: -9,
    z1: 8.0,
    h: H,
    lamps: [
      // over the board, beside the slice (not in front of its crater, seen from the station)
      { x: -5.8, z: -3.2, drop: 2.6, light: true, intensity: 5 },
      { x: 3.4, z: -4.6, drop: 2.7, light: true, intensity: 5.5 },
      { x: 0.2, z: 1.2, drop: 3.2, light: true, intensity: 3, optional: true },
      { x: 5.2, z: -0.4, drop: 2.9 },
      { x: -5.6, z: 0.8, drop: 3.0 },
    ],
    windows: [{ side: 'w', at: 0.0 }, { side: 'w', at: 4.0 }, { side: 'e', at: 3.0 }, { side: 'n', at: -0.9 }],
  })
  root.add(stage.group)
  const { firebrick, mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v)
  const soft = softTex()
  const star = starTex()
  textures.push(soft, star)
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const tmpV = new THREE.Vector3()
  const tmpC = new THREE.Color()
  // a station's focus whose size fits its width too: the station view backs off for the height only, so on
  // an upright phone a wide station would spill over the sides (read when the station is used)
  const focusOf = (x, y, z, high, wide) => ({
    x,
    y,
    z,
    get size() {
      return Math.max(high, wide / Math.max(0.3, ctx.camera?.aspect ?? 1.6))
    },
  })
  // things whose words follow the depth switch: [object, 'kid' | 'sci']
  const byLevel = []
  let shownLevel = null

  // shared looks for carbon: grey graphite, a pale blue diamond (the picture's)
  const graphiteMat = new THREE.MeshStandardMaterial({ color: '#4c4f57', roughness: 0.32, metalness: 0.6 })
  const diamondMat = new THREE.MeshStandardMaterial({ color: '#e6f7ff', emissive: '#4fa9dc', emissiveIntensity: 0.55, roughness: 0.06, metalness: 0.25, flatShading: true })
  const plateGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.028, 6)
  const gemGeo = new THREE.OctahedronGeometry(0.12)
  /** A lump of carbon: graphite plates or a diamond octahedron (setK: 0 graphite, 1 diamond). */
  function lump(scale = 1) {
    const group = new THREE.Group()
    const graphite = new THREE.Group()
    const rnd = random(7)
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(plateGeo, graphiteMat)
      p.position.set((rnd() - 0.5) * 0.04, -0.045 + i * 0.03, (rnd() - 0.5) * 0.04)
      p.rotation.y = rnd() * TAU
      p.scale.setScalar(1 - i * 0.12)
      graphite.add(p)
    }
    graphite.rotation.set(0.35, 0, 0.2)
    const diamond = new THREE.Mesh(gemGeo, diamondMat)
    diamond.scale.y = 1.08
    const sparkle = new THREE.Sprite(new THREE.SpriteMaterial({ map: star, color: new THREE.Color('#dff4ff').multiplyScalar(1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    sparkle.position.set(0.05, 0.07, 0.06)
    group.add(graphite, diamond, sparkle)
    group.scale.setScalar(scale)
    let k = 0
    const api = {
      group,
      get k() {
        return k
      },
      setK(v, t = 0) {
        k = clamp(v)
        // the same carbon as diamond takes a third less room: 0.86 of graphite's size across
        const g = 1 - span(0.2, 0.7, k)
        graphite.scale.setScalar(Math.max(0.001, g))
        graphite.visible = g > 0.01
        const dd = span(0.35, 0.9, k) * 0.86
        diamond.scale.set(Math.max(0.001, dd), Math.max(0.001, dd * 1.08), Math.max(0.001, dd))
        diamond.visible = dd > 0.01
        // a burst of sparkle as it changes, a twinkle once it is a diamond
        const change = Math.sin(Math.PI * clamp(k)) * (k > 0.02 && k < 0.98 ? 1 : 0)
        const twinkle = k > 0.98 ? 0.35 + 0.35 * Math.max(0, Math.sin(t * 2.3)) : 0
        sparkle.material.opacity = clamp(change * 1.2 + twinkle)
        sparkle.scale.setScalar(0.12 + 0.3 * change + 0.12 * twinkle)
        sparkle.material.rotation = t * 0.4
        sparkle.visible = sparkle.material.opacity > 0.01
      },
    }
    api.setK(0)
    return api
  }

  // ======== the slice of the Earth: 250 km of rock as tall as the room, its top the surface ========
  const SL = { x: -4.4, z: -6.0, rot: 0.32, w: 3.4, d: 1.0, base: 0.3, s: 6.0 / KM }
  const yOf = d => SL.base + (KM - d) * SL.s
  const kmOf = y => clamp(KM - (y - SL.base) / SL.s, 0, KM)
  const TOP = yOf(0)
  const FRONT = SL.d / 2
  const slab = new THREE.Group()
  slab.position.set(SL.x, 0, SL.z)
  slab.rotation.y = SL.rot
  root.add(slab)
  slab.updateMatrix()
  const fromSlab = (x, y, z, out = new THREE.Vector3()) => out.set(x, y, z).applyMatrix4(slab.matrix)
  const FW = 480
  const FH = 848
  /** The cut face: grass, crust, the mantle (olive peridotite, warmer deeper), the flowing mantle. With
   *  `glow`, the same darkened, with the deep heat glowing (the emissive map). */
  const drawFace = glow => (g, w, h) => {
    const py = d => (d / KM) * h
    const rnd = random(61)
    const band = (d0, d1, c0, c1) => {
      const grd = g.createLinearGradient(0, py(d0), 0, py(d1))
      grd.addColorStop(0, c0)
      grd.addColorStop(1, c1)
      g.fillStyle = grd
      g.fillRect(0, py(d0), w, py(d1) - py(d0) + 1)
    }
    band(0, 18, '#8f817a', '#7d7476')
    band(18, MOHO, '#6f6b74', '#5f5d68')
    band(MOHO, 120, '#56653f', '#5d5b39')
    band(120, FLOW, '#5e5636', '#6b4a2e')
    band(FLOW, KM, '#9a3f1c', '#d0602a')
    // specks: quartz and feldspar in the crust; olivine (green), pyroxene (black) and garnet (red, deeper
    // than about 80 km) in the mantle
    for (let i = 0; i < 2600; i++) {
      const x = rnd() * w
      const d = rnd() * KM
      const v = rnd()
      let c
      if (d < MOHO) c = v < 0.5 ? 'rgba(235,225,215,0.35)' : 'rgba(40,36,40,0.35)'
      else if (d < FLOW) c = v < 0.55 ? 'rgba(130,160,70,0.45)' : v < 0.85 || d < 80 ? 'rgba(25,24,20,0.4)' : 'rgba(150,30,35,0.6)'
      else c = v < 0.5 ? 'rgba(255,190,90,0.35)' : 'rgba(90,20,10,0.35)'
      g.fillStyle = c
      g.beginPath()
      g.arc(x, py(d), 0.8 + rnd() * 1.8, 0, TAU)
      g.fill()
    }
    // the flowing mantle's slow swirls
    g.strokeStyle = 'rgba(255,170,80,0.35)'
    g.lineWidth = 2
    for (let i = 0; i < 6; i++) {
      const y0 = py(FLOW + 6 + i * 5.5)
      g.beginPath()
      for (let x = 0; x <= w; x += 8) g.lineTo(x, y0 + Math.sin(x * 0.03 + i * 1.7) * 5)
      g.stroke()
    }
    // the base of the crust (the Moho), a thin dark line
    g.fillStyle = 'rgba(20,18,22,0.6)'
    g.fillRect(0, py(MOHO) - 1, w, 2)
    // soil and grass along the top
    g.fillStyle = '#5a4632'
    g.fillRect(0, 0, w, 9)
    g.fillStyle = '#3f6a34'
    g.fillRect(0, 0, w, 5)
    if (glow) {
      g.fillStyle = 'rgba(0,0,0,0.74)'
      g.fillRect(0, 0, w, h)
      g.globalCompositeOperation = 'lighter'
      const grd = g.createLinearGradient(0, py(100), 0, h)
      grd.addColorStop(0, 'rgba(0,0,0,0)')
      grd.addColorStop((FLOW - 100) / (KM - 100), 'rgba(150,45,10,0.45)')
      grd.addColorStop(1, 'rgba(255,120,40,0.95)')
      g.fillStyle = grd
      g.fillRect(0, py(100), w, h - py(100))
      g.globalCompositeOperation = 'source-over'
    }
  }
  const faceTex = canvasTex(FW, FH, drawFace(false))
  const faceGlow = canvasTex(FW, FH, drawFace(true))
  textures.push(faceTex, faceGlow)
  const rockSide = new THREE.MeshStandardMaterial({ color: '#4a4038', roughness: 0.95 })
  const grassMat = new THREE.MeshStandardMaterial({ color: '#3d6532', roughness: 1 })
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, emissive: '#ffffff', emissiveMap: faceGlow, emissiveIntensity: 1, roughness: 0.9 })
  const slabMesh = new THREE.Mesh(new THREE.BoxGeometry(SL.w, TOP - SL.base, SL.d), [rockSide, rockSide, grassMat, rockSide, faceMat, rockSide])
  slabMesh.position.y = (TOP + SL.base) / 2
  slab.add(slabMesh)
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(SL.w + 0.36, SL.base, SL.d + 0.36, 2, 0.04), mats.dark)
    plinth.position.y = SL.base / 2
    slab.add(plinth)
    // a little landscape on top: dark firs
    const fir = new THREE.ConeGeometry(0.07, 0.22, 6)
    const firMat = new THREE.MeshStandardMaterial({ color: '#2b4a2c', roughness: 0.9 })
    const rnd = random(12)
    for (let i = 0; i < 11; i++) {
      const x = -SL.w / 2 + 0.15 + rnd() * (SL.w - 0.3)
      if (Math.abs(x - 0.78) < 0.6) continue
      const t = new THREE.Mesh(fir, firMat)
      const s = 0.7 + rnd() * 0.6
      t.scale.setScalar(s)
      t.position.set(x, TOP + 0.11 * s, -0.3 + rnd() * 0.55)
      slab.add(t)
    }
  }
  // a glow from the hot depths onto the floor in front
  const deepLight = new THREE.PointLight('#ff7a30', light ? 2.5 : 3.5, 6, 2)
  slab.add(deepLight)
  deepLight.position.set(0, 0.7, FRONT + 0.9)
  solids.push(box(SL.x, SL.z, SL.w + 0.4, SL.d + 0.4, { rot: SL.rot }))

  // the depth scale on the left edge, every 50 km
  for (let d = 0; d <= KM; d += 50) {
    const label = makeText(`${d} km`, { size: 0.15, color: '#f6ecdc', anchorX: 'left', anchorY: d === 0 ? 'top' : d === KM ? 'bottom' : 'middle', outlineWidth: 0.012, outlineColor: '#1a1410' })
    label.position.set(-SL.w / 2 + 0.17, yOf(d) + (d === 0 ? -0.04 : d === KM ? 0.04 : 0), FRONT + 0.02)
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.018, 0.02), mats.brass)
    tick.position.set(-SL.w / 2 + 0.02, yOf(d), FRONT + 0.01)
    slab.add(label, tick)
  }
  // the layers' names, on the right of the face
  const tag = (text, d, size = 0.13) => {
    const t = makeText(text, { size, color: '#f6ecdc', anchorX: 'right', maxWidth: 0.8, outlineWidth: 0.012, outlineColor: '#1a1410' })
    t.position.set(SL.w / 2 - 0.07, yOf(d), FRONT + 0.02)
    slab.add(t)
    return t
  }
  tag(E.deep.layers.crust, 20)
  tag(E.deep.layers.mantle, 85)
  tag(E.deep.layers.flow, 233)
  // where diamond is the stable form: a blue zone below the line, twinkling, brighter with a diamond in it
  const zoneH = yOf(LINE) - SL.base
  const zoneMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uK: { value: 0.4 }, uSize: { value: new THREE.Vector2(SL.w - 0.04, zoneH) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uK; uniform vec2 uSize;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec2 m = vUv * uSize;
        vec2 p = m * 7.0;
        vec2 cell = floor(p);
        vec2 f = fract(p) - 0.5;
        float h = hash(cell);
        float tw = 0.5 + 0.5 * sin(uTime * (1.2 + h * 2.5) + h * 40.0);
        float sparkle = smoothstep(0.16, 0.0, length(f)) * step(0.8, h) * tw;
        float fromTop = (1.0 - vUv.y) * uSize.y;
        float dash = step(0.45, fract(m.x * 3.0));
        float line = smoothstep(0.035, 0.0, fromTop) * (0.55 + 0.45 * dash);
        float tint = (0.1 + 0.12 * uK) * (0.55 + 0.45 * smoothstep(1.6, 0.0, fromTop));
        vec3 blue = vec3(0.35, 0.72, 1.0);
        vec3 c = blue * (tint + sparkle * (0.7 + 1.1 * uK)) + vec3(0.6, 0.88, 1.0) * line * 1.8;
        float a = clamp(tint + sparkle + line, 0.0, 1.0);
        gl_FragColor = vec4(c, a);
      }`,
  })
  const zone = new THREE.Mesh(new THREE.PlaneGeometry(SL.w - 0.04, zoneH), zoneMat)
  zone.position.set(0, SL.base + zoneH / 2, FRONT + 0.008)
  zone.renderOrder = 2
  slab.add(zone)
  for (const k of ['kid', 'sci']) {
    const below = tag(E.deep.zone[k], LINE + 7, 0.14)
    below.color = '#bfe8ff'
    const above = tag(E.deep.above[k], LINE - 7, 0.12)
    byLevel.push([below, k], [above, k])
  }

  // ---- the lift: a rail down the face, a glass capsule on a cable with the carbon in it ----
  const RAIL_X = -0.82
  const CAP_X = -0.56
  const CAP_Z = FRONT + 0.34
  {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, TOP - SL.base + 0.5, 10), mats.brass)
    rail.position.set(RAIL_X, (TOP + SL.base + 0.5) / 2, FRONT + 0.12)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.3), mats.iron)
    arm.position.set((RAIL_X + CAP_X) / 2, TOP + 0.5, FRONT + 0.22)
    const pulley = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 8, 20), mats.brass)
    pulley.position.set(CAP_X, TOP + 0.44, CAP_Z)
    pulley.rotation.y = Math.PI / 2
    slab.add(rail, arm, pulley)
  }
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1, 5), mats.iron)
  slab.add(cable)
  const capsule = new THREE.Group()
  {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), edgeGlass({ color: '#cfeeff', edge: 0.85, base: 0.04 }))
    shell.renderOrder = 3
    capsule.add(shell)
    for (const y of [-0.17, 0.17]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.014, 6, 28), mats.brass)
      ring.rotation.x = Math.PI / 2
      ring.position.y = y
      capsule.add(ring)
    }
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 12), mats.brass)
    hook.position.y = 0.27
    capsule.add(hook)
  }
  slab.add(capsule)
  const rideLump = lump()
  capsule.add(rideLump.group)

  // ---- the kimberlite pipe: a narrow crack from the bottom, a carrot-shaped pipe near the top ----
  const PX = 0.78
  const NECK = yOf(28)
  const pipeMat = new THREE.ShaderMaterial({
    uniforms: { uFront: { value: SL.base - 1 }, uHeat: { value: 0 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vP;
      void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uFront; uniform float uHeat; uniform float uTime;
      varying vec3 vP;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        float n = hash(floor(vP.xy * 55.0));
        vec3 cold = vec3(0.06, 0.1, 0.15) * (0.8 + 0.45 * n);
        float below = smoothstep(uFront + 0.06, uFront - 0.06, vP.y);
        float flick = 0.82 + 0.18 * sin(uTime * 13.0 + vP.y * 9.0);
        vec3 hot = mix(vec3(1.0, 0.25, 0.03), vec3(1.0, 0.7, 0.25), smoothstep(uFront - 1.6, uFront, vP.y)) * 1.5 * flick;
        gl_FragColor = vec4(mix(cold, hot, below * uHeat), 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const pipe = new THREE.Group()
  {
    const c = 0.045
    const s = new THREE.Shape()
    s.moveTo(PX - c, SL.base + 0.02)
    s.lineTo(PX - c * 1.25, NECK)
    s.quadraticCurveTo(PX - c * 1.6, TOP - 0.12, PX - 0.5, TOP - 0.005)
    s.lineTo(PX + 0.5, TOP - 0.005)
    s.quadraticCurveTo(PX + c * 1.6, TOP - 0.12, PX + c * 1.25, NECK)
    s.lineTo(PX + c, SL.base + 0.02)
    s.closePath()
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(s, 24), pipeMat)
    mesh.position.z = FRONT + 0.012
    pipe.add(mesh)
    // the crater on top, a low ring of broken rock round a dark hollow
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.07, 8, 32), new THREE.MeshStandardMaterial({ color: '#6c645a', roughness: 1 }))
    rim.rotation.x = Math.PI / 2
    rim.scale.z = 0.6
    rim.position.set(PX, TOP + 0.01, 0.05)
    const hollow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 28), new THREE.MeshStandardMaterial({ color: '#232830', roughness: 1 }))
    hollow.rotation.x = -Math.PI / 2
    hollow.position.set(PX, TOP + 0.006, 0.05)
    pipe.add(rim, hollow)
    // easy to hit: the crack alone is a few centimetres wide
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.5, NECK - SL.base, 0.3), ghost)
    hit.position.set(PX, (NECK + SL.base) / 2, FRONT + 0.12)
    const hitTop = new THREE.Mesh(new THREE.BoxGeometry(1.0, TOP - NECK + 0.3, 0.3), ghost)
    hitTop.position.set(PX, (TOP + NECK + 0.3) / 2, FRONT + 0.12)
    pipe.add(hit, hitTop)
  }
  slab.add(pipe)
  const pipeLight = new THREE.PointLight('#ff8a3c', 0, 5, 2)
  slab.add(pipeLight)
  // ash thrown up from the crater
  const ASH = light ? 24 : 60
  const ashPos = new Float32Array(ASH * 3)
  const ashVel = Array.from({ length: ASH }, (_, i) => {
    const r = random(90 + i)
    return new THREE.Vector3((r() - 0.5) * 0.9, 0.9 + r() * 1.3, (r() - 0.5) * 0.5)
  })
  const ashGeo = new THREE.BufferGeometry()
  ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPos, 3))
  const ashMat = new THREE.PointsMaterial({ color: '#8d8780', size: 0.16, map: soft, transparent: true, opacity: 0, depthWrite: false })
  const ash = new THREE.Points(ashGeo, ashMat)
  ash.raycast = () => {}
  ash.frustumCulled = false
  slab.add(ash)

  // ---- the case in front: what came up ----
  const CASE = { x: 2.45, z: FRONT + 0.6, top: 1.0 }
  const caseGroup = new THREE.Group()
  caseGroup.position.set(CASE.x, 0, CASE.z)
  slab.add(caseGroup)
  {
    const ped = new THREE.Mesh(new RoundedBoxGeometry(0.56, CASE.top, 0.56, 2, 0.03), mats.wood)
    ped.position.y = CASE.top / 2
    const cushion = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.07, 0.42, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#1f2c66', roughness: 0.95 }))
    cushion.position.y = CASE.top + 0.035
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 12, 0, TAU, 0, Math.PI / 2), edgeGlass({ color: '#d6f0ff', edge: 0.8, base: 0.04 }))
    dome.position.y = CASE.top + 0.06
    dome.renderOrder = 3
    const sign = makeText(E.pipe.case, { size: 0.11, color: '#f0dcb8', maxWidth: 0.9, anchorY: 'bottom' })
    sign.position.set(0, CASE.top + 0.4, 0.05)
    caseGroup.add(ped, cushion, dome, sign)
  }
  const tally = makeText(' ', { size: 0.075, color: '#d9c39a', maxWidth: 0.9, anchorY: 'top' })
  tally.position.set(0, CASE.top - 0.06, 0.29)
  caseGroup.add(tally)
  const caseLump = lump(1)
  caseLump.group.position.y = CASE.top + 0.17
  caseLump.group.visible = false
  caseGroup.add(caseLump.group)
  solids.push(circle(...(() => {
    const p = fromSlab(CASE.x, 0, CASE.z)
    return [p.x, p.z, 0.4]
  })()))
  // the carbon riding the magma, then thrown to the case (in the room's own coordinates)
  const rider = lump(1)
  rider.group.visible = false
  root.add(rider.group)

  // ---- the board beside the slice: depth, heat and squeeze; at Scientist level the diagram ----
  const BW = 576
  const BH = 648
  const boardCanvas = document.createElement('canvas')
  boardCanvas.width = BW
  boardCanvas.height = BH
  const boardTex = new THREE.CanvasTexture(boardCanvas)
  boardTex.colorSpace = THREE.SRGBColorSpace
  boardTex.anisotropy = 4
  textures.push(boardTex)
  {
    const board = new THREE.Group()
    const frame = new THREE.Mesh(new RoundedBoxGeometry(1.56, 1.76, 0.06, 2, 0.02), mats.beam)
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.44, 1.62), new THREE.MeshBasicMaterial({ map: boardTex, color: '#d4d4d4', toneMapped: false }))
    screen.position.z = 0.035
    board.add(frame, screen)
    for (const x of [-0.5, 0.5]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.66, 8), mats.iron)
      post.position.set(x, -1.21, -0.04)
      board.add(post)
    }
    board.position.set(-SL.w / 2 - 1.05, 2.0, FRONT + 0.55)
    board.rotation.y = 0.4
    board.scale.setScalar(1.3)
    slab.add(board)
    const p = fromSlab(-SL.w / 2 - 1.05, 0, FRONT + 0.55)
    solids.push(circle(p.x, p.z, 0.6))
  }

  // ---- the state: where the lift is going (shared), where it is, what the carbon is ----
  let target = 0 // km, where the lift is sent
  let depth = 0 // km, where it is
  let kNow = 0 // 0 graphite, 1 diamond, as it changes
  let empty = false // the carbon went up the pipe: the lift comes back for a new piece
  let refill = 0 // a new piece of carbon fading in at the top
  let deepMine = false // the last move was this visitor's (only then the Atomling tells what happens)
  // the eruption: shared as a count, where the carbon was and what it was
  let pipeN = 0
  let found = [] // what came up, oldest first: 'diamond' | 'graphite'
  let erupt = null // { t, from, form, taken, landed, mine }
  let lastFrom = 0
  let lastForm = 'graphite'
  let looked = true
  const ERUPT = { rise: 2.6, arc: 1.5, end: 7.5 }
  const formAt = d => (d >= LINE ? 'diamond' : 'graphite')

  const tell = (key, lv = level()) => deepMine && say(at(E.deep.says[key], lv))
  const deepPanel = lv => ({
    title: E.deep.title,
    color,
    blocks: [
      {
        slider: {
          label: E.deep.slider,
          min: 0,
          max: KM,
          step: 1,
          value: target,
          onInput: v => slide(v),
          format: v => `${nf(v)} km`,
          live: () => target,
        },
      },
      { buttons: [['d150', 150], ['d200', 200], ['top', 0]].map(([k, d]) => ({ label: E.deep.buttons[k], onClick: () => goTo(d) })) },
      ...paras(E.deep.panel, lv),
    ],
  })
  /** Send the lift to a depth (km): a tap on the slice, a button, a probe. */
  function goTo(d, { quiet = false } = {}) {
    const lv = level()
    if (erupt || empty) return say(at(E.deep.says.wait, lv))
    const was = target
    target = clamp(Math.round(d), 0, KM)
    deepMine = true
    // what is said now; the change itself is told when it happens (update)
    if (!quiet) {
      if (target >= FLOW && was < FLOW) say(at(E.deep.says.flow, lv))
      else if (target >= LINE && depth >= LINE) say(at(E.deep.says.deeper, lv))
      else if (target >= LINE) say(at(E.deep.says.down, lv))
      else if (target < 1 && depth < LINE) say(at(E.deep.says.surface, lv))
      else if (target < depth && depth < LINE) say(at(E.deep.says.rise, lv))
      else if (target > depth) say(at(E.deep.says.down, lv))
    }
    play(target > was ? 'select' : 'tap')
    ex.discover('deep', deepPanel, 2.4)
    share('deep')
  }
  // the slider moves many times a second: shared a few times a second, its last value always
  let sliding = false
  function slide(v) {
    if (erupt || empty) return
    target = clamp(Math.round(v), 0, KM)
    deepMine = true
    ex.discover('deep', deepPanel, 2.4)
    if (sliding) return
    sliding = true
    later(0.25, () => {
      sliding = false
      share('deep')
    })
  }
  ex.add({
    id: 'deep',
    ...(() => {
      const p = fromSlab(-0.6, 0, 3.6)
      return { x: p.x, z: p.z }
    })(),
    radius: 1.9,
    manual: true,
    label: E.deep.label,
    verb: () => {
      const h = E.deep.hints
      if (erupt || empty) return h.wait
      if (formAt(target) === 'diamond' && kNow > 0.9) return h.up
      return h.down
    },
    focus: (() => {
      const p = fromSlab(-0.5, 0, 0)
      return focusOf(p.x, 3.3, p.z, 7.2, 6.0)
    })(),
    act: () => ctx.showPanel(deepPanel),
  })
  // worked by hand: a tap on the cut face sends the lift to that depth
  clickable(
    slabMesh,
    hit => {
      const local = slab.worldToLocal(hit.point.clone())
      goTo(local.y > TOP - 0.06 ? 0 : kmOf(local.y))
    },
    { reach: 8, accept: h => !!h.face && h.face.normal.z > 0.5 },
  )

  // ---- the pipe: tap it and the carbon rides the magma up, into the case ----
  const pipePanel = lv => ({
    title: E.pipe.title,
    color,
    blocks: [{ buttons: [['erupt', () => eruptStep()], ['look', () => lookStep()]].map(([k, f]) => ({ label: E.pipe.buttons[k], onClick: f })) }, ...paras(E.pipe.panel, lv)],
  })
  function startEruption(from, form, mine) {
    erupt = { t: 0, from, form, taken: false, landed: false, mine }
    lastFrom = from
    lastForm = form
    // the lift lets the carbon go; it comes back up empty for a new piece
    empty = true
    target = 0
    play('bang')
  }
  function eruptStep() {
    const lv = level()
    if (erupt || empty) return say(at(W.busy, lv))
    const from = Math.round(depth)
    const form = formAt(depth)
    pipeN++
    found = [...found, form].slice(-6)
    looked = false
    startEruption(from, form, true)
    say(at(E.pipe.says.erupt, lv))
    ex.discover('pipe', pipePanel, ERUPT.rise + ERUPT.arc + 1.6)
    share('pipe')
    share('deep')
  }
  function lookStep() {
    const lv = level()
    const last = found[found.length - 1]
    looked = true
    if (!last) return say(at(E.pipe.says.empty, lv))
    if (erupt && !erupt.landed) return say(at(W.busy, lv))
    play('tap')
    say(at(last === 'diamond' ? E.pipe.says.look : E.pipe.says.lookGraphite, lv))
  }
  ex.add({
    id: 'pipe',
    ...(() => {
      const p = fromSlab(1.9, 0, 4.4)
      return { x: p.x, z: p.z }
    })(),
    radius: 1.8,
    manual: true,
    label: E.pipe.label,
    verb: () => {
      const h = E.pipe.hints
      if (erupt && !erupt.landed) return h.watch
      if (found.length && !looked) return h.look
      return h.erupt
    },
    focus: (() => {
      const p = fromSlab(1.4, 0, 0.4)
      return focusOf(p.x, 3.0, p.z, 7.0, 4.6)
    })(),
    act: () => ctx.showPanel(pipePanel),
  })
  clickable(pipe, () => eruptStep(), { reach: 8 })
  clickable(caseGroup, () => lookStep(), { reach: 6 })

  // ---- the board's drawing ----
  let boardKey = ''
  function drawBoard(lv, d, form, rideD) {
    const g = boardCanvas.getContext('2d')
    const B = E.deep.board
    g.fillStyle = '#0e1630'
    g.fillRect(0, 0, BW, BH)
    g.strokeStyle = 'rgba(127,212,255,0.6)'
    g.lineWidth = 4
    g.strokeRect(8, 8, BW - 16, BH - 16)
    g.textBaseline = 'middle'
    // a line that shrinks until it fits the board (the four languages differ in length)
    const fit = (text, x, y, size, weight = 700, maxW = BW - 68) => {
      let s = size
      g.font = `${weight} ${s}px Outfit`
      while (s > 14 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px Outfit`
      g.fillText(text, x, y)
    }
    const sci = lv === 'scientist'
    const P = pressureAt(d)
    const T = tempAt(d)
    const row = (label, value, y, size = 34) => {
      g.font = `600 ${size - 6}px Outfit`
      g.fillStyle = '#9fb3d9'
      g.textAlign = 'left'
      g.fillText(label, 34, y)
      g.font = `700 ${size}px Outfit`
      g.fillStyle = '#f2f6ff'
      g.textAlign = 'right'
      g.fillText(value, BW - 34, y)
    }
    g.fillStyle = '#7fd4ff'
    g.textAlign = 'center'
    fit(B.title, BW / 2, 50, 38)
    if (!sci) {
      row(B.depth, `${nf(d)} km`, 122, 40)
      row(B.heat, `${nf(Math.round(T / 10) * 10)} °C`, 186, 40)
      g.fillStyle = '#9fb3d9'
      g.textAlign = 'left'
      fit(B.squeeze, 34, 248, 30, 600)
      g.fillStyle = '#f2f6ff'
      fit(B.elephants(elephantsAt(d)), 34, 292, 32)
      // elephants as dots, one per elephant
      const n = Math.min(20, elephantsAt(d))
      for (let i = 0; i < n; i++) elephant(g, 52 + (i % 10) * 50, 352 + Math.floor(i / 10) * 50)
      // what the carbon is: a big pill
      const dia = form === 'diamond'
      g.fillStyle = dia ? '#2a6f9a' : '#3b3e46'
      g.beginPath()
      g.roundRect(60, 470, BW - 120, 96, 48)
      g.fill()
      g.fillStyle = dia ? '#dff4ff' : '#d4d6dc'
      g.textAlign = 'center'
      fit(dia ? B.diamond : B.graphite, BW / 2, 518, 44, 800, BW - 160)
      if (rideD != null) {
        g.fillStyle = '#ffb36b'
        fit(fill(B.ride, { h: nf(hoursFrom(lastFrom - rideD), 1) }), BW / 2, 606, 28)
      }
      return
    }
    // Scientist: the numbers and the diagram
    g.textAlign = 'left'
    g.fillStyle = '#f2f6ff'
    fit(`${nf(d)} km  ·  ${nf(P, 1)} GPa  ·  ${nf(Math.round(T / 10) * 10)} °C`, 34, 104, 27, 600)
    const X0 = 92
    const X1 = BW - 36
    const Y0 = BH - 92
    const Y1 = 150
    const tx = t => X0 + (t / 1500) * (X1 - X0)
    const py = p => Y0 - (p / 8) * (Y0 - Y1)
    // the diamond field above the line, graphite below
    g.fillStyle = 'rgba(127,212,255,0.16)'
    g.beginPath()
    g.moveTo(tx(0), py(lineP(0)))
    g.lineTo(tx(1500), py(lineP(1500)))
    g.lineTo(tx(1500), py(8))
    g.lineTo(tx(0), py(8))
    g.fill()
    g.fillStyle = 'rgba(160,165,175,0.12)'
    g.beginPath()
    g.moveTo(tx(0), py(lineP(0)))
    g.lineTo(tx(1500), py(lineP(1500)))
    g.lineTo(tx(1500), py(0))
    g.lineTo(tx(0), py(0))
    g.fill()
    g.strokeStyle = '#7fd4ff'
    g.lineWidth = 4
    g.beginPath()
    g.moveTo(tx(0), py(lineP(0)))
    g.lineTo(tx(1500), py(lineP(1500)))
    g.stroke()
    g.font = '700 30px Outfit'
    g.fillStyle = '#bfe8ff'
    g.fillText(B.diamond, tx(60), py(7.2))
    g.fillStyle = '#c7cad2'
    g.fillText(B.graphite, tx(820), py(1.4))
    // the geotherm under an old continent
    g.strokeStyle = '#ffa060'
    g.lineWidth = 3
    g.setLineDash([10, 8])
    g.beginPath()
    for (let k = 0; k <= KM; k += 5) g.lineTo(tx(tempAt(k)), py(pressureAt(k)))
    g.stroke()
    g.setLineDash([])
    // its name beside it, in the graphite field below the line
    g.fillStyle = '#ffb380'
    g.textAlign = 'left'
    fit(B.geotherm, tx(tempAt(95)) + 16, py(pressureAt(95)) + 10, 22, 600, X1 - tx(tempAt(95)) - 20)
    // axes
    g.strokeStyle = '#9fb3d9'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(X0, Y1 - 6)
    g.lineTo(X0, Y0)
    g.lineTo(X1, Y0)
    g.stroke()
    g.fillStyle = '#9fb3d9'
    g.font = '600 20px Outfit'
    g.textAlign = 'center'
    for (const t of [0, 500, 1000, 1500]) g.fillText(nf(t), tx(t), Y0 + 20)
    g.textAlign = 'right'
    for (const p of [0, 2, 4, 6, 8]) g.fillText(nf(p), X0 - 10, py(p))
    g.textAlign = 'center'
    g.fillText(B.axisT, (X0 + X1) / 2, Y0 + 52)
    g.save()
    g.translate(30, (Y0 + Y1) / 2)
    g.rotate(-Math.PI / 2)
    g.fillText(B.axisP, 0, 0)
    g.restore()
    // a diamond that came up waits in the case: at the surface, in graphite's field (metastable)
    if (found[found.length - 1] === 'diamond' && !(erupt && !erupt.landed)) {
      const x = tx(20)
      const y = py(0) - 4
      g.fillStyle = '#dff4ff'
      g.beginPath()
      g.moveTo(x, y - 18)
      g.lineTo(x + 11, y - 4)
      g.lineTo(x, y + 4)
      g.lineTo(x - 11, y - 4)
      g.closePath()
      g.fill()
      g.font = '600 20px Outfit'
      g.textAlign = 'left'
      g.fillText(B.metastable, x + 18, y - 12)
    }
    // the carbon: on the lift, or riding the magma (it stays as hot as where it started until near the top)
    const dd = rideD ?? d
    const TT = rideD != null ? (rideD > 3 ? tempAt(lastFrom) : lerp(20, tempAt(lastFrom), rideD / 3)) : T
    g.fillStyle = form === 'diamond' ? '#7fd4ff' : '#e8e8ee'
    g.strokeStyle = '#0e1630'
    g.lineWidth = 3
    g.beginPath()
    g.arc(tx(TT), py(pressureAt(dd)), 11, 0, TAU)
    g.fill()
    g.stroke()
    if (rideD != null) {
      g.fillStyle = '#ffb36b'
      g.textAlign = 'left'
      fit(fill(B.ride, { h: nf(hoursFrom(lastFrom - rideD), 1) }), X0 + 16, Y1 + 8, 22, 700, X1 - X0 - 30)
    }
  }
  boardTex.needsUpdate = true

  // ---- the deep side, every frame ----
  const capWorld = new THREE.Vector3()
  const casePoint = new THREE.Vector3()
  let boardT = 0
  updates.push((dt, t) => {
    const lv = level()
    // the lift glides there: quickly over a long way, gently at the end
    const diff = target - depth
    if (Math.abs(diff) > 0.01) {
      const step = Math.max(Math.abs(diff) * (1 - Math.exp(-2.4 * dt)), Math.min(Math.abs(diff), 55 * dt))
      depth += Math.sign(diff) * Math.min(step, Math.abs(diff))
    } else depth = target
    // the carbon follows what is stable where it is: into diamond deep down, back to graphite when
    // brought up slowly; a new piece at the top after an eruption
    if (empty && depth < 0.5 && !erupt) {
      empty = false
      refill = 0
      kNow = 0
    }
    refill = Math.min(1, refill + dt * 1.2)
    const want = formAt(depth) === 'diamond' ? 1 : 0
    const was = kNow
    if (!empty) kNow = want > kNow ? Math.min(1, kNow + dt / 1.6) : Math.max(0, kNow - dt / 1.3)
    if (was < 1 && kNow >= 1) {
      play('discover')
      tell('turn', lv)
    }
    if (was > 0 && kNow <= 0 && !empty) tell('back', lv)
    rideLump.group.visible = !empty
    rideLump.setK(kNow, t)
    rideLump.group.scale.setScalar(1.25 * ease(refill))
    rideLump.group.rotation.y = t * 0.5
    zoneMat.uniforms.uTime.value = t
    zoneMat.uniforms.uK.value = damp(zoneMat.uniforms.uK.value, !empty && kNow > 0.5 ? 1 : 0.35, 3, dt)
    // the capsule on its cable
    const cy = yOf(depth)
    capsule.position.set(CAP_X, cy, CAP_Z)
    const top = TOP + 0.44
    cable.position.set(CAP_X, (top + cy + 0.27) / 2, CAP_Z)
    cable.scale.y = Math.max(0.01, top - cy - 0.27)

    // the eruption
    const e = erupt
    let rideD = null
    if (e) {
      e.t += dt
      const s = e.t
      // the front races up from the bottom (faster as it goes, as the gas expands)
      const f = clamp(s / ERUPT.rise)
      const frontY = lerp(SL.base, TOP + 0.05, f * f * (1.6 - 0.6 * f))
      pipeMat.uniforms.uFront.value = frontY
      pipeMat.uniforms.uHeat.value = s < ERUPT.rise + 1 ? 1 : 1 - clamp((s - ERUPT.rise - 1) / 3)
      pipeLight.position.set(PX, Math.min(frontY, TOP), FRONT + 0.5)
      pipeLight.intensity = pipeMat.uniforms.uHeat.value * 3.5
      const fromY = yOf(e.from)
      if (!e.taken && frontY >= fromY) {
        e.taken = true
        play('fizz', { order: 1.4 })
      }
      if (s < ERUPT.rise + 0.05) {
        // with the magma: across from the lift into the pipe, then up with the front
        if (e.taken) {
          const across = clamp((frontY - fromY) / 0.5)
          const y = Math.max(fromY, frontY - 0.12)
          fromSlab(lerp(CAP_X, PX, ease(across)), y, lerp(CAP_Z, FRONT + 0.1, ease(across)), rider.group.position)
          rider.group.visible = true
          rideD = kmOf(y)
        } else {
          fromSlab(CAP_X, fromY, CAP_Z, rider.group.position)
          rider.group.visible = true
          rideD = e.from
        }
      } else if (s < ERUPT.rise + ERUPT.arc) {
        // out of the crater and down into the case
        const k = clamp((s - ERUPT.rise) / ERUPT.arc)
        const a = fromSlab(PX, TOP + 0.1, 0.1)
        fromSlab(CASE.x, CASE.top + 0.17, CASE.z, casePoint)
        rider.group.position.lerpVectors(a, casePoint, ease(k))
        rider.group.position.y += Math.sin(Math.PI * k) * 1.1
        rider.group.visible = true
        rideD = 0
      } else if (!e.landed) {
        e.landed = true
        rider.group.visible = false
        showCase()
        play(e.form === 'diamond' ? 'celebrate' : 'tap')
        if (e.mine) say(at(E.pipe.says[e.form], lv))
      }
      rider.setK(e.form === 'diamond' ? 1 : 0, t)
      rider.group.rotation.y = t * 2.2
      // ash from the crater
      const as = s - ERUPT.rise + 0.1
      ashMat.opacity = as > 0 ? 0.85 * (1 - clamp((as - 1.2) / 2.6)) : 0
      for (let i = 0; i < ASH; i++) {
        const v = ashVel[i]
        const tt = Math.max(0, as - (i % 7) * 0.05)
        ashPos.set([PX + v.x * tt, TOP + 0.1 + v.y * tt - 0.08 * tt * tt, 0.05 + v.z * tt], i * 3)
      }
      ashGeo.attributes.position.needsUpdate = true
      if (s >= ERUPT.end) {
        erupt = null
        ashMat.opacity = 0
        pipeMat.uniforms.uHeat.value = 0
        pipeLight.intensity = 0
      }
    }
    pipeMat.uniforms.uTime.value = t
    caseLump.setK(caseLump.k, t)
    caseLump.group.rotation.y = t * 0.6
    // the board: redrawn when what it shows changes (at most ten times a second)
    boardT -= dt
    const form = empty && rideD == null ? 'graphite' : rideD != null ? e.form : kNow > 0.5 ? 'diamond' : 'graphite'
    const key = `${lv}|${Math.round(rideD ?? depth)}|${form}|${rideD != null}|${found.length}|${found[found.length - 1]}`
    if (key !== boardKey && boardT <= 0) {
      boardKey = key
      boardT = 0.1
      drawBoard(lv, Math.round(empty && rideD == null ? depth : rideD ?? depth), form, rideD)
      boardTex.needsUpdate = true
    }
    capsule.getWorldPosition(capWorld)
  })
  function showCase() {
    const last = found[found.length - 1]
    caseLump.group.visible = !!last
    caseLump.setK(last === 'diamond' ? 1 : 0)
    const nd = found.filter(f => f === 'diamond').length
    tally.text = found.length ? E.pipe.tally(nd, found.length - nd) : ' '
    tally.sync()
  }

  // ======== the pencil workshop ========
  const GRAPHITE_C = new THREE.Color('#34363c')
  const CLAY_C = new THREE.Color('#cdb89a')
  // along the back wall, left to right as seen from the station: the desk, the hoppers over the bowl, the kiln
  const HOP = { graphite: { x: 2.65, z: -7.75 }, clay: { x: 4.25, z: -7.75 }, y: 2.3 }
  const BOWL = { x: 3.45, z: -6.55, y: 1.0, r: 0.5 }
  const KILN = { x: 6.15, z: -8.25, w: 1.6, d: 1.3, h: 1.65, mouthY: 0.82, mouthR: 0.32 }
  const DESK = { x: 1.25, z: -6.85 }
  const powderMat = {
    graphite: new THREE.MeshStandardMaterial({ color: GRAPHITE_C, roughness: 0.55, metalness: 0.35 }),
    clay: new THREE.MeshStandardMaterial({ color: CLAY_C, roughness: 0.95 }),
  }
  // the hoppers: a wooden bin on legs, a funnel and a chute down to the bowl, its name above
  const hoppers = {}
  const chuteEnds = {}
  for (const id of ['graphite', 'clay']) {
    const hp = HOP[id]
    const g = new THREE.Group()
    g.position.set(hp.x, 0, hp.z)
    root.add(g)
    const bin = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.62, 0.7, 2, 0.03), mats.wood)
    bin.position.y = HOP.y + 0.3
    const heap = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, TAU, 0, Math.PI / 2), powderMat[id])
    heap.scale.set(0.4, 0.14, 0.3)
    heap.position.y = HOP.y + 0.6
    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.07, 0.5, 4, 1, true), new THREE.MeshStandardMaterial({ color: '#5c5f66', roughness: 0.45, metalness: 0.7, side: THREE.DoubleSide }))
    funnel.rotation.y = Math.PI / 4
    funnel.position.y = HOP.y - 0.25
    g.add(bin, heap, funnel)
    for (const [lx, lz] of [[-0.4, -0.3], [0.4, -0.3], [-0.4, 0.3], [0.4, 0.3]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, HOP.y, 0.06), mats.beam)
      leg.position.set(lx, HOP.y / 2, lz)
      g.add(leg)
    }
    // the chute from the spout to the bowl's rim
    const spout = new THREE.Vector3(hp.x, HOP.y - 0.5, hp.z + 0.02)
    const rim = new THREE.Vector3(BOWL.x + (id === 'graphite' ? -0.28 : 0.28), BOWL.y + 0.2, BOWL.z - 0.12)
    const len = spout.distanceTo(rim)
    const chute = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, len, 10, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#7a7d84', roughness: 0.4, metalness: 0.75, side: THREE.DoubleSide }))
    chute.position.copy(spout).add(rim).multiplyScalar(0.5)
    chute.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spout.clone().sub(rim).normalize())
    chute.rotateY(Math.PI / 2)
    root.add(chute)
    chuteEnds[id] = { spout, rim }
    const sign = makeText(E.pencil.bins[id], { size: 0.17, color: '#f0dcb8', maxWidth: 1.1 })
    sign.position.set(0, HOP.y + 0.92, 0.2)
    g.add(sign)
    // an easy thing to hit: the whole bin and funnel
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.8), ghost)
    hit.position.y = HOP.y + 0.05
    g.add(hit)
    hoppers[id] = g
    solids.push(box(hp.x, hp.z, 0.95, 0.75))
  }
  // powder pouring down a chute
  const POUR = light ? 18 : 36
  const pours = {}
  for (const id of ['graphite', 'clay']) {
    const pos = new Float32Array(POUR * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: id === 'graphite' ? '#55585f' : '#e2cfb2', size: 0.07, map: soft, transparent: true, depthWrite: false }))
    pts.raycast = () => {}
    pts.frustumCulled = false
    pts.visible = false
    root.add(pts)
    pours[id] = { pts, pos, geo, t: -1 }
  }
  // the bowl, on a stand, where the mix is stirred
  const bowl = new THREE.Group()
  bowl.position.set(BOWL.x, 0, BOWL.z)
  root.add(bowl)
  {
    const prof = [[0, 0], [0.3, 0.01], [0.44, 0.08], [0.5, 0.22], [0.52, 0.24], [0.47, 0.235], [0.42, 0.1], [0.3, 0.03], [0, 0.03]]
    const b = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 36), new THREE.MeshStandardMaterial({ color: '#8a8d94', roughness: 0.35, metalness: 0.8, side: THREE.DoubleSide }))
    b.position.y = BOWL.y - 0.02
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, BOWL.y - 0.02, 16), mats.iron)
    stand.position.y = (BOWL.y - 0.02) / 2
    bowl.add(b, stand)
    solids.push(circle(BOWL.x, BOWL.z, 0.55))
  }
  const mixTex = canvasTex(128, 128, (g, w) => {
    const r = random(23)
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 500; i++) {
      const v = 150 + r() * 105
      g.fillStyle = `rgba(${v},${v},${v},0.6)`
      g.fillRect(r() * w, r() * w, 2, 2)
    }
  })
  textures.push(mixTex)
  const mixMat = new THREE.MeshStandardMaterial({ map: mixTex, color: '#cdb89a', roughness: 0.8 })
  const mix = new THREE.Mesh(new THREE.CircleGeometry(1, 32), mixMat)
  mix.rotation.x = -Math.PI / 2
  mix.visible = false
  bowl.add(mix)
  // the grade above the bowl: a big name and a scale from hard to soft
  const gradeText = makeText(' ', { size: 0.34, color: '#e2d8c6', anchorY: 'bottom' })
  gradeText.position.set(BOWL.x, 2.32, BOWL.z + 0.3)
  root.add(gradeText)
  const mixText = makeText(' ', { size: 0.1, color: '#d9c39a', anchorY: 'top', maxWidth: 1.6 })
  mixText.position.set(BOWL.x, 2.28, BOWL.z + 0.3)
  root.add(mixText)
  const scaleCanvas = document.createElement('canvas')
  scaleCanvas.width = 1024
  scaleCanvas.height = 160
  const scaleTex = new THREE.CanvasTexture(scaleCanvas)
  scaleTex.colorSpace = THREE.SRGBColorSpace
  textures.push(scaleTex)
  {
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.266), new THREE.MeshBasicMaterial({ map: scaleTex, color: '#d0d0d0', toneMapped: false }))
    sc.position.set(BOWL.x, 1.72, BOWL.z + 0.3)
    const backing = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.34, 0.03), mats.beam)
    backing.position.set(BOWL.x, 1.72, BOWL.z + 0.28)
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.75, 0.03), mats.beam)
    post.position.set(BOWL.x, 1.2, BOWL.z + 0.27)
    root.add(backing, sc, post)
    for (const [k, x, ax] of [['hard', -0.85, 'left'], ['soft', 0.85, 'right']]) {
      const t = makeText(E.pencil[k], { size: 0.075, color: '#d9c39a', anchorX: ax, anchorY: 'top' })
      t.position.set(BOWL.x + x, 1.56, BOWL.z + 0.31)
      root.add(t)
    }
  }
  function drawScale(s) {
    const g = scaleCanvas.getContext('2d')
    const w = scaleCanvas.width
    g.fillStyle = '#1a140f'
    g.fillRect(0, 0, w, 160)
    const n = GRADES.length
    const cw = (w - 40) / n
    GRADES.forEach(([name, gs], i) => {
      const L = Math.round(lerp(232, 34, darkOf(gs)))
      g.fillStyle = `rgb(${L},${L},${L + 2})`
      g.fillRect(20 + i * cw + 3, 18, cw - 6, 70)
      g.font = '700 40px Outfit'
      g.fillStyle = '#f0dcb8'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText(name, 20 + i * cw + cw / 2, 122)
    })
    const gname = s == null ? null : gradeOf(s)
    const i = GRADES.findIndex(([name]) => name === gname)
    if (i >= 0) {
      g.strokeStyle = '#7fd4ff'
      g.lineWidth = 7
      g.strokeRect(20 + i * cw, 10, cw, 142)
    }
    scaleTex.needsUpdate = true
  }

  // the kiln against the wall: buff firebrick, its round mouth glowing while it bakes
  const kilnFire = fireMaterial()
  const kiln = new THREE.Group()
  kiln.position.set(KILN.x, 0, KILN.z)
  root.add(kiln)
  {
    const r = KILN.w / 2
    const shape = new THREE.Shape()
    shape.moveTo(-r, 0)
    shape.lineTo(r, 0)
    shape.lineTo(r, KILN.h - 0.5)
    shape.quadraticCurveTo(r, KILN.h, r - 0.5, KILN.h)
    shape.lineTo(-r + 0.5, KILN.h)
    shape.quadraticCurveTo(-r, KILN.h, -r, KILN.h - 0.5)
    shape.lineTo(-r, 0)
    const hole = new THREE.Path()
    hole.absarc(0, KILN.mouthY, KILN.mouthR, 0, TAU, true)
    shape.holes.push(hole)
    const geo = new THREE.ExtrudeGeometry(shape, { depth: KILN.d, bevelEnabled: false, curveSegments: 20 })
    geo.translate(0, 0, -KILN.d / 2)
    kiln.add(new THREE.Mesh(geo, firebrick))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(KILN.mouthR + 0.04, 0.05, 8, 32), mats.iron)
    ring.position.set(0, KILN.mouthY, KILN.d / 2 + 0.01)
    const glow = new THREE.Mesh(new THREE.CircleGeometry(KILN.mouthR + 0.01, 32), kilnFire)
    glow.position.set(0, KILN.mouthY, KILN.d / 2 - 0.35)
    const flue = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, H - KILN.h, 12), mats.iron)
    flue.position.set(0.3, KILN.h + (H - KILN.h) / 2, -0.2)
    kiln.add(ring, glow, flue)
    for (const k of ['kid', 'sci']) {
      const t = makeText(E.pencil.kiln[k], { size: 0.14, color: '#f0dcb8', maxWidth: 1.4, anchorY: 'bottom' })
      t.position.set(0, KILN.h + 0.12, 0.2)
      kiln.add(t)
      byLevel.push([t, k])
    }
    // an easy thing to hit: the kiln's front
    const hit = new THREE.Mesh(new THREE.BoxGeometry(KILN.w, KILN.h, 0.3), ghost)
    hit.position.set(0, KILN.h / 2, KILN.d / 2)
    kiln.add(hit)
    solids.push(box(KILN.x, KILN.z, KILN.w + 0.1, KILN.d + 0.1))
  }
  const kilnLight = new THREE.PointLight('#ff8a3c', 0, 5, 2)
  kilnLight.position.set(KILN.x, KILN.mouthY + 0.1, KILN.z + KILN.d / 2 + 0.5)
  root.add(kilnLight)

  // Borrowdale's graphite in a case on the back wall: a lump solid enough to saw into sticks
  {
    const g = new THREE.Group()
    g.position.set(7.42, 0, -8.55)
    root.add(g)
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.4), mats.wood)
    shelf.position.y = 1.3
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.32), edgeGlass({ color: '#d6f0ff', edge: 0.7, base: 0.03 }))
    glass.position.y = 1.535
    glass.renderOrder = 3
    const lumpMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.11, 0), graphiteMat)
    lumpMesh.scale.set(1.3, 0.8, 1)
    lumpMesh.position.set(-0.13, 1.41, 0)
    const stick = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.035), graphiteMat)
    stick.position.set(0.14, 1.345, 0.02)
    stick.rotation.y = 0.3
    g.add(shelf, glass, lumpMesh, stick)
    const label = makeText(E.pencil.borrowdale, { size: 0.085, color: '#d9c39a', maxWidth: 0.95, anchorY: 'top' })
    label.position.set(0, 1.24, 0.12)
    g.add(label)
  }

  // the writing desk against the right wall: a tilted board with paper, the pencil, a lens
  const desk = new THREE.Group()
  desk.position.set(DESK.x, 0, DESK.z)
  // turned toward the station, so the paper is seen nearly face on
  desk.rotation.y = 0.45
  root.add(desk)
  {
    const top = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.06, 0.9, 2, 0.02), mats.wood)
    top.position.y = 0.8
    desk.add(top)
    for (const lx of [-0.85, 0.85]) {
      for (const lz of [-0.36, 0.36]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.78, 0.06), mats.beam)
        leg.position.set(lx, 0.39, lz)
        desk.add(leg)
      }
    }
    solids.push(box(DESK.x, DESK.z, 1.95, 0.95, { rot: 0.45 }))
  }
  const PW = 1.38
  const PH = 0.928
  const PCW = 768
  const PCH = 516
  const board = new THREE.Group()
  board.position.set(0, 0.84, 0.05)
  board.rotation.x = -0.42
  desk.add(board)
  const paperCanvas = document.createElement('canvas')
  paperCanvas.width = PCW
  paperCanvas.height = PCH
  const paperTex = new THREE.CanvasTexture(paperCanvas)
  paperTex.colorSpace = THREE.SRGBColorSpace
  paperTex.anisotropy = 4
  textures.push(paperTex)
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshStandardMaterial({ map: paperTex, roughness: 0.95, emissive: '#ffffff', emissiveMap: paperTex, emissiveIntensity: 0.22 }))
  paper.position.set(0, PH / 2 + 0.06, 0.028)
  {
    const frame = new THREE.Mesh(new RoundedBoxGeometry(PW + 0.12, PH + 0.14, 0.05, 2, 0.02), mats.beam)
    frame.position.set(0, PH / 2 + 0.06, 0)
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.1, 0.04, 0.08), mats.wood)
    ledge.position.set(0, 0.0, 0.05)
    board.add(frame, ledge, paper)
  }
  const paperAt = (u, v, out = new THREE.Vector3()) => out.set((u - 0.5) * PW, PH + 0.06 - v * PH, 0.03)
  // the pencil: the picture's yellow one, a pink eraser, sharpened to a grey point
  const pencil = new THREE.Group()
  const leadMat = new THREE.MeshStandardMaterial({ color: '#3a3c42', roughness: 0.4, metalness: 0.4 })
  {
    const L = 0.62
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, L, 6), new THREE.MeshStandardMaterial({ color: '#f2b62a', roughness: 0.45 }))
    body.position.y = 0.11 + L / 2
    const wood = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.012, 0.09, 12), new THREE.MeshStandardMaterial({ color: '#e8c79a', roughness: 0.8 }))
    wood.position.y = 0.065
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.025, 12).rotateX(Math.PI), leadMat)
    tip.position.y = 0.0125
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.05, 12), new THREE.MeshStandardMaterial({ color: '#c9ccd2', roughness: 0.3, metalness: 0.9 }))
    ferrule.position.y = 0.11 + L + 0.025
    const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.055, 16), new THREE.MeshStandardMaterial({ color: '#f27c96', roughness: 0.7 }))
    eraser.position.y = 0.11 + L + 0.075
    pencil.add(body, wood, tip, ferrule, eraser)
  }
  board.add(pencil)
  // leaning toward the visitor and to the right, its point on the paper
  const PEN_DIR = new THREE.Vector3(0.32, 0.42, 0.85).normalize()
  pencil.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), PEN_DIR)
  const penRest = paperAt(0.93, 0.08)
  pencil.position.copy(penRest).addScaledVector(PEN_DIR, 0.05)
  // the lens beside the paper: the last line, seen very close
  const LENS_PX = 256
  const lensCanvas = document.createElement('canvas')
  lensCanvas.width = lensCanvas.height = LENS_PX
  const lensTex = new THREE.CanvasTexture(lensCanvas)
  lensTex.colorSpace = THREE.SRGBColorSpace
  textures.push(lensTex)
  const lens = new THREE.Group()
  {
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.25, 40), new THREE.MeshBasicMaterial({ map: lensTex, color: '#d8d8d8', toneMapped: false }))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.025, 8, 40), mats.brass)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), mats.brass)
    handle.position.set(0, -0.5, -0.03)
    lens.add(face, ring, handle)
    lens.position.set(PW / 2 + 0.38, PH * 0.62, 0.05)
    board.add(lens)
  }
  function drawLens(s) {
    const g = lensCanvas.getContext('2d')
    const w = LENS_PX
    const r = random(Math.round(s * 1000) + 3)
    g.fillStyle = '#efe8da'
    g.fillRect(0, 0, w, w)
    // the paper's fibres
    for (let i = 0; i < 46; i++) {
      g.strokeStyle = `rgba(${200 + r() * 40},${190 + r() * 40},${170 + r() * 40},0.9)`
      g.lineWidth = 3 + r() * 5
      g.beginPath()
      const x = r() * w
      const y = r() * w
      const a = r() * Math.PI
      g.moveTo(x - Math.cos(a) * 90, y - Math.sin(a) * 90)
      g.quadraticCurveTo(x + (r() - 0.5) * 40, y + (r() - 0.5) * 40, x + Math.cos(a) * 90, y + Math.sin(a) * 90)
      g.stroke()
    }
    // the flakes of graphite caught in them: grey, flat, their edges catching the light
    const n = Math.round(darkOf(s) * 90)
    for (let i = 0; i < n; i++) {
      const cx = r() * w
      const cy = w * 0.5 + (r() - 0.5) * w * 0.8
      const R = 6 + r() * 14
      const sides = 5 + Math.floor(r() * 3)
      const a0 = r() * TAU
      g.beginPath()
      for (let k = 0; k < sides; k++) {
        const a = a0 + (k / sides) * TAU
        const rr = R * (0.7 + r() * 0.5)
        g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.75)
      }
      g.closePath()
      const v = 50 + r() * 40
      g.fillStyle = `rgb(${v},${v + 2},${v + 8})`
      g.fill()
      g.strokeStyle = 'rgba(190,200,215,0.7)'
      g.lineWidth = 1.5
      g.stroke()
    }
    lensTex.needsUpdate = true
  }

  // ---- the pencil's state (shared): the mix, the lead, the lines on the paper ----
  const PS = { g: 0, c: 0, phase: 'mix', lead: null, strokes: [], n: 0 }
  let bake = null // { t }: the rods on their way through the kiln
  let write = null // { t }: the line being drawn
  let pencilMine = false
  let toldLens = false
  const BAKE_T = 6.2
  const WRITE_T = 1.8
  const shareOf = () => (PS.g + PS.c > 0 ? PS.g / (PS.g + PS.c) : 0)
  // the tray of rods that goes from the bowl through the kiln to the pencil
  const tray = new THREE.Group()
  const rodMat = new THREE.MeshStandardMaterial({ color: '#3a3c42', roughness: 0.5, metalness: 0.3, emissive: '#000000' })
  {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.2), mats.iron)
    tray.add(plate)
    for (let i = 0; i < 5; i++) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.36, 8), rodMat)
      rod.rotation.z = Math.PI / 2
      rod.position.set(0, 0.026, -0.07 + i * 0.035)
      tray.add(rod)
    }
  }
  tray.visible = false
  root.add(tray)
  const TRAY = {
    bowl: new THREE.Vector3(BOWL.x, BOWL.y + 0.32, BOWL.z + 0.2),
    mouth: new THREE.Vector3(KILN.x, KILN.mouthY - 0.1, KILN.z + KILN.d / 2 + 0.35),
    inside: new THREE.Vector3(KILN.x, KILN.mouthY - 0.1, KILN.z + 0.1),
  }
  const pencilWorld = () => {
    desk.updateMatrixWorld(true)
    return pencil.localToWorld(new THREE.Vector3(0, 0.4, 0))
  }

  // the paper: a line per lead, labelled with its grade; the newest drawn as far as `upTo` (0..1)
  const strokePoint = (row, k) => {
    const x0 = 120
    const x1 = PCW - 70
    const x = lerp(x0, x1, k)
    const y = 62 + row * 78 + Math.sin((x - x0) * 0.022 + row * 1.3) * 16 * Math.sin(Math.PI * k * 0.95 + 0.1)
    return [x, y]
  }
  function drawPaper(upTo = 1) {
    const g = paperCanvas.getContext('2d')
    g.fillStyle = '#f4efe4'
    g.fillRect(0, 0, PCW, PCH)
    // faint ruled lines
    g.strokeStyle = 'rgba(120,150,190,0.25)'
    g.lineWidth = 2
    for (let i = 0; i < STROKES; i++) {
      g.beginPath()
      g.moveTo(20, 62 + i * 78 + 30)
      g.lineTo(PCW - 20, 62 + i * 78 + 30)
      g.stroke()
    }
    PS.strokes.forEach((s, row) => {
      const last = row === PS.strokes.length - 1
      const k1 = last ? upTo : 1
      const dk = darkOf(s)
      const L = Math.round(lerp(222, 30, dk))
      const name = gradeOf(s)
      g.font = '700 30px Outfit'
      g.fillStyle = '#7a6a58'
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      g.fillText(name ?? '·', 22, 62 + row * 78)
      // a pencil line: many short strokes, grainy, gaps where a hard lead skips
      const r = random(row * 31 + Math.round(s * 100))
      const steps = 140
      for (let i = 0; i < steps * k1; i++) {
        const [xa, ya] = strokePoint(row, i / steps)
        const [xb, yb] = strokePoint(row, (i + 1) / steps)
        const skip = r() > 0.35 + 0.65 * dk
        if (skip && dk < 0.6) continue
        g.strokeStyle = `rgba(${L},${L},${L + 4},${0.55 + 0.45 * r()})`
        g.lineWidth = 1.5 + 10 * dk * (0.75 + 0.5 * r())
        g.lineCap = 'round'
        g.beginPath()
        g.moveTo(xa, ya)
        g.lineTo(xb, yb)
        g.stroke()
      }
    })
    paperTex.needsUpdate = true
  }

  const pencilPanel = lv => ({
    title: E.pencil.title,
    color,
    blocks: [
      {
        slider: {
          label: E.pencil.slider,
          min: 0,
          max: 100,
          step: 1,
          value: Math.round(shareOf() * 100),
          onInput: v => setShare(v / 100),
          format: v => `${nf(v)}%`,
          live: () => Math.round(shareOf() * 100),
        },
      },
      { buttons: ['graphite', 'clay', 'kiln', 'paper', 'fresh'].map(k => ({ label: E.pencil.buttons[k], onClick: () => pencilStep(k) })) },
      ...paras(E.pencil.panel, lv),
    ],
  })
  const pencilChanged = () => {
    pencilMine = true
    ex.discover('pencil', pencilPanel, 2.2)
    share('pencil')
  }
  const startPour = id => {
    pours[id].t = 0
    play('fizz', { order: 0.6 })
  }
  const startBake = () => {
    bake = { t: 0 }
    play('select')
  }
  const startWrite = () => {
    write = { t: 0 }
    play('tap')
  }
  function pencilStep(step) {
    const lv = level()
    const P = E.pencil.says
    if (step === 'graphite' || step === 'clay') {
      if (bake) return say(at(W.busy, lv))
      if (PS.phase === 'ready') Object.assign(PS, { g: 0, c: 0, phase: 'mix', lead: null })
      if (PS.g + PS.c >= MIX_MAX - 0.01) return say(at(P.full, lv))
      PS[step === 'graphite' ? 'g' : 'c'] = Math.min(MIX_MAX, PS[step === 'graphite' ? 'g' : 'c'] + 1)
      startPour(step)
      say(at(P[step], lv))
    } else if (step === 'kiln') {
      if (bake) return say(at(W.busy, lv))
      if (PS.phase === 'ready') return say(at(P.written, lv))
      if (PS.g + PS.c < 0.01) return say(at(P.nothing, lv))
      if (PS.c < 0.01) return say(at(P.noClay, lv))
      PS.phase = 'bake'
      startBake()
      say(at(P.bake, lv))
    } else if (step === 'paper') {
      if (write || bake) return say(at(W.busy, lv))
      if (PS.phase !== 'ready') return say(at(PS.g + PS.c > 0 ? P.bakeFirst : P.nothing, lv))
      PS.strokes = [...PS.strokes, PS.lead].slice(-STROKES)
      PS.n++
      startWrite()
      const dk = darkOf(PS.lead)
      say(at(PS.lead < 0.2 ? P.scratch : dk < 0.5 ? P.hard : dk < 0.75 ? P.mid : P.soft, lv))
    } else if (step === 'fresh') {
      if (bake) return say(at(W.busy, lv))
      Object.assign(PS, { g: 0, c: 0, phase: 'mix', lead: null })
      play('tap')
      say(at(P.fresh, lv))
    } else return
    pencilChanged()
  }
  // the mix slider: the same amount, another share (a new mix once a lead was baked)
  let mixSend = false
  function setShare(s) {
    if (bake) return
    if (PS.phase === 'ready') Object.assign(PS, { phase: 'mix', lead: null })
    const total = Math.max(PS.g + PS.c, 6)
    PS.g = Math.round(clamp(s) * total * 100) / 100
    PS.c = Math.round((total - PS.g) * 100) / 100
    pencilMine = true
    ex.discover('pencil', pencilPanel, 2.2)
    if (mixSend) return
    mixSend = true
    later(0.25, () => {
      mixSend = false
      share('pencil')
    })
  }
  ex.add({
    id: 'pencil',
    x: 3.45,
    z: -2.9,
    radius: 2.1,
    manual: true,
    label: E.pencil.label,
    verb: () => {
      const h = E.pencil.hints
      if (bake) return h.wait
      if (write) return h.write
      if (PS.phase === 'ready') return h.write
      if (PS.g + PS.c < 0.01) return h.add
      if (PS.c < 0.01) return h.clay
      if (PS.g < 0.01) return h.graphite
      return h.bake
    },
    focus: focusOf(3.6, 1.45, -7.2, 5.4, 5.4),
    act: () => ctx.showPanel(pencilPanel),
  })
  clickable(hoppers.graphite, () => pencilStep('graphite'), { reach: 7 })
  clickable(hoppers.clay, () => pencilStep('clay'), { reach: 7 })
  clickable(kiln, () => pencilStep('kiln'), { reach: 7 })
  clickable(board, () => pencilStep('paper'), { reach: 7 })

  let mixKey = ''
  let paperDrawn = -1
  let paperT = 0
  updates.push((dt, t) => {
    const lv = level()
    // the pours
    for (const id of ['graphite', 'clay']) {
      const p = pours[id]
      if (p.t < 0) continue
      p.t += dt
      const { spout, rim } = chuteEnds[id]
      p.pts.visible = p.t < 1.3
      for (let i = 0; i < POUR; i++) {
        const k = ((p.t * 1.6 + i / POUR) % 1) * (p.t < 1.0 ? 1 : 0)
        tmpV.lerpVectors(spout, rim, k)
        tmpV.y += 0.06 + Math.sin(i * 7.1) * 0.02
        tmpV.x += Math.sin(i * 3.7) * 0.03
        p.pos.set([tmpV.x, tmpV.y, tmpV.z], i * 3)
      }
      p.geo.attributes.position.needsUpdate = true
      if (p.t > 1.3) p.t = -1
    }
    // the mix in the bowl
    const total = PS.g + PS.c
    const s = shareOf()
    const shown = PS.phase === 'mix' || (bake && bake.t < 0.6)
    mix.visible = shown && total > 0.01
    mix.position.y = BOWL.y + 0.05 + 0.15 * (total / MIX_MAX)
    mix.scale.setScalar(0.32 + 0.14 * (total / MIX_MAX))
    tmpC.copy(CLAY_C).lerp(GRAPHITE_C, Math.pow(s, 0.6))
    mixMat.color.lerp(tmpC, 1 - Math.exp(-6 * dt))
    const showS = PS.phase === 'ready' ? PS.lead : total > 0.01 ? s : null
    const key = `${showS == null ? '-' : Math.round(showS * 100)}|${PS.phase}`
    if (key !== mixKey) {
      mixKey = key
      const gname = showS == null ? null : gradeOf(showS)
      gradeText.text = showS == null ? ' ' : gname ?? E.pencil.clayStick
      gradeText.sync()
      mixText.text = showS == null ? E.pencil.empty : fill(E.pencil.mix, { g: nf(Math.round(showS * 100)), c: nf(100 - Math.round(showS * 100)) })
      mixText.sync()
      drawScale(showS)
      leadMat.color.setScalar(lerp(0.75, 0.05, darkOf(PS.lead ?? 0.6)))
    }
    // the bake: the rods leave the bowl, go into the kiln, glow, come out, and go into the pencil
    let heat = 0
    if (bake) {
      bake.t += dt
      const b = bake.t
      tray.visible = b > 0.3 && b < 5.6
      if (b < 1.6) {
        const k = span(0.4, 1.6, b)
        tray.position.lerpVectors(TRAY.bowl, TRAY.mouth, k)
        tray.position.y += Math.sin(Math.PI * k) * 0.5
      } else if (b < 2.1) tray.position.lerpVectors(TRAY.mouth, TRAY.inside, span(1.6, 2.1, b))
      else if (b < 4.0) tray.position.copy(TRAY.inside)
      else if (b < 4.5) tray.position.lerpVectors(TRAY.inside, TRAY.mouth, span(4.0, 4.5, b))
      else {
        const k = span(4.5, 5.6, b)
        tray.position.lerpVectors(TRAY.mouth, pencilWorld(), k)
        tray.position.y += Math.sin(Math.PI * k) * 0.6
        tray.scale.setScalar(1 - 0.7 * k)
      }
      if (b < 4.5) tray.scale.setScalar(1)
      heat = b > 1.8 && b < 4.3 ? span(1.8, 2.4, b) * (1 - span(3.6, 4.3, b)) : 0
      if (b >= BAKE_T) {
        bake = null
        tray.visible = false
        PS.phase = 'ready'
        PS.lead = s
        mixKey = ''
        if (pencilMine) say(fill(at(PS.lead < 0.2 ? E.pencil.says.clayOnly : E.pencil.says.baked, lv), { grade: gradeOf(PS.lead) ?? '' }))
        play('discover')
      }
    }
    kilnFire.uniforms.uK.value = damp(kilnFire.uniforms.uK.value, Math.max(heat, 0.08), 4, dt)
    kilnFire.uniforms.uTime.value = t
    kilnLight.intensity = heat * 4
    rodMat.color.setScalar(lerp(0.75, 0.05, darkOf(s)))
    rodMat.emissive.setRGB(1, 0.35, 0.06).multiplyScalar(heat * 0.9)
    // the writing: the pencil follows the line as it is drawn
    let upTo = 1
    if (write) {
      write.t += dt
      upTo = clamp(write.t / (WRITE_T - 0.2))
      if (write.t >= WRITE_T) {
        write = null
        upTo = 1
        drawLens(PS.strokes[PS.strokes.length - 1] ?? 0)
        if (pencilMine && !toldLens) {
          toldLens = true
          later(1.6, () => say(at(E.pencil.says.lens, level())))
        }
      }
    }
    const row = PS.strokes.length - 1
    if (write && row >= 0) {
      const [px, py] = strokePoint(row, upTo)
      paperAt(px / PCW, py / PCH, pencil.position)
    } else pencil.position.copy(penRest).addScaledVector(PEN_DIR, 0.05)
    // the paper: redrawn while a line is drawn (about 30 times a second) and when the lines change
    paperT -= dt
    if ((write && paperT <= 0) || paperDrawn !== PS.n) {
      paperT = 1 / 30
      paperDrawn = PS.n
      drawPaper(upTo)
    }
    // words that follow the depth switch
    if (lv !== shownLevel) {
      shownLevel = lv
      for (const [o, k] of byLevel) o.visible = depthOf(lv) === k
    }
  })
  drawPaper(1)
  drawLens(0.67)
  drawScale(null)

  updates.push((dt, t) => stage.update(t))

  // a ray from the camera to a point, for the probes' real taps
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = obj => obj.getWorldPosition(new THREE.Vector3())

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.6 },
    cameraPitchMax: 0.45,
    spawn: { x: 0, z: 2.8, yaw: 0 },
    hostSpot: { x: -1.9, z: 1.9, yaw: Math.atan2(-1.9, -0.8) },
    back: { x: 0, z: 7.2, rot: Math.PI },
    // the easel on the right of the arrival: on the left it stood in the way of the slice's station view
    stand: { x: 2.5, z: 1.3, rot: Math.atan2(-2.5, 1.7) },
    parts: {
      deep: {
        go: d => goTo(d), // a tap on the slice at that depth (km)
        slide: d => slide(d), // the panel's slider
        get target() {
          return target
        },
        get depth() {
          return depth
        },
        get form() {
          return empty ? null : kNow > 0.5 ? 'diamond' : 'graphite'
        },
        LINE,
      },
      pipe: {
        tap: () => eruptStep(), // the pipe
        look: () => lookStep(), // the case
        get busy() {
          return !!erupt
        },
        get found() {
          return [...found]
        },
      },
      pencil: {
        tap: step => pencilStep(step), // 'graphite' | 'clay' (the hoppers), 'kiln', 'paper'; 'fresh' (the panel)
        share: s => setShare(s), // the panel's slider (0..1)
        get state() {
          return { ...PS, strokes: [...PS.strokes] }
        },
        get busy() {
          return !!(bake || write)
        },
      },
      // points to aim a real tap at (with rayTo): __ew.world.onTap(p.rayTo(p.at.pipe()))
      at: {
        slab: d => fromSlab(-0.1, yOf(d), FRONT),
        pipe: () => fromSlab(PX, yOf(120), FRONT + 0.05),
        case: () => world(caseGroup).add(new THREE.Vector3(0, CASE.top + 0.1, 0)),
        graphite: () => world(hoppers.graphite).add(new THREE.Vector3(0, HOP.y, 0)),
        clay: () => world(hoppers.clay).add(new THREE.Vector3(0, HOP.y, 0)),
        kiln: () => new THREE.Vector3(KILN.x, KILN.mouthY, KILN.z + KILN.d / 2),
        paper: () => paper.getWorldPosition(new THREE.Vector3()),
        capsule: () => capWorld.clone(),
      },
      rayTo,
    },
    panels: { deep: deepPanel, pipe: pipePanel, pencil: pencilPanel },
    shared: {
      deep: {
        get: () => ({ depth: Math.round(target) }),
        set: (s, liveSet) => {
          target = clamp(Math.round(Number(s?.depth) || 0), 0, KM)
          deepMine = false
          if (!liveSet) {
            depth = target
            if (!erupt) {
              empty = false
              kNow = formAt(depth) === 'diamond' ? 1 : 0
            }
          }
        },
      },
      pipe: {
        get: () => ({ n: pipeN, from: lastFrom, form: lastForm, found: [...found] }),
        set: (s, liveSet) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const list = (Array.isArray(s?.found) ? s.found : []).filter(f => f === 'diamond' || f === 'graphite').slice(-6)
          const from = clamp(Math.round(Number(s?.from) || 0), 0, KM)
          const form = s?.form === 'diamond' ? 'diamond' : 'graphite'
          if (liveSet && n === pipeN + 1 && !erupt) {
            pipeN = n
            found = list
            looked = true
            startEruption(from, form, false)
            // the case shows what was there until the new piece lands
            const before = list.slice(0, -1)
            const lastBefore = before[before.length - 1]
            caseLump.group.visible = !!lastBefore
            caseLump.setK(lastBefore === 'diamond' ? 1 : 0)
          } else {
            erupt = null
            rider.group.visible = false
            ashMat.opacity = 0
            pipeMat.uniforms.uHeat.value = 0
            pipeLight.intensity = 0
            pipeN = n
            found = list
            lastFrom = from
            lastForm = form
            looked = true
            if (empty && !liveSet) empty = false
            showCase()
          }
        },
      },
      pencil: {
        get: () => ({ g: PS.g, c: PS.c, phase: bake ? 'bake' : PS.phase, lead: PS.lead, strokes: [...PS.strokes], n: PS.n }),
        set: (s, liveSet) => {
          const num = (v, a, b) => clamp(Number(v) || 0, a, b)
          const n = {
            g: Math.round(num(s?.g, 0, MIX_MAX) * 100) / 100,
            c: Math.round(num(s?.c, 0, MIX_MAX) * 100) / 100,
            phase: ['mix', 'bake', 'ready'].includes(s?.phase) ? s.phase : 'mix',
            lead: s?.lead == null ? null : num(s.lead, 0, 1),
            strokes: (Array.isArray(s?.strokes) ? s.strokes : []).map(v => num(v, 0, 1)).slice(-STROKES),
            n: Math.max(0, Math.round(Number(s?.n) || 0)),
          }
          pencilMine = false
          if (liveSet) {
            if (n.g > PS.g + 0.5) startPour('graphite')
            if (n.c > PS.c + 0.5) startPour('clay')
            if (n.phase === 'bake' && !bake) startBake()
            if (n.n === PS.n + 1 && !write) startWrite()
          } else {
            bake = null
            write = null
            tray.visible = false
            // a lead found in the kiln comes out baked
            if (n.phase === 'bake') {
              n.phase = 'ready'
              n.lead = n.g + n.c > 0 ? n.g / (n.g + n.c) : 0
            }
          }
          if (n.phase === 'bake' && !bake) n.phase = 'mix'
          Object.assign(PS, n)
          if (bake) PS.phase = 'bake'
          mixKey = ''
          paperDrawn = -1
          if (!write && PS.strokes.length) drawLens(PS.strokes[PS.strokes.length - 1])
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
    },
  }
}
