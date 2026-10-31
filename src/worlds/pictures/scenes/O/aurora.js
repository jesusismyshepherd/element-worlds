// Oxygen's picture "Who paints the sky green?" as a room (docs/knowledge/picture-rooms.md): a winter camp in
// Finnish Lapland at night (stages/arctic.js), snow, birches, a red hut with warm windows and a tent lit from
// inside, a frozen lake and fells to the north, and over them the aurora: green curtains swaying, red higher
// up, a purple fringe under them in a storm. Its light is what shows the snow and the camp. Three things to do,
// each step chosen by tapping its thing (the user, 2026-10-30), the prompt naming the next tap, E opening the
// station's panel, whose buttons (and a slider each) do the same:
// - the Sun's gust, on an ice table: the Sun and the Earth with its magnetic field lines (pressed in on the
//   Sun's side, stretched into a tail on the night side). Tap the Sun and it throws out a cloud of charged
//   particles (a coronal mass ejection): most are turned aside round the field, some reach the tail and pour
//   down the field lines into the two auroral ovals round the geomagnetic poles, which light up green; as they
//   arrive, the real sky over the camp brightens and dances. The storm's strength (the Kp index) is a slider:
//   the stronger, the farther the ovals spread from the poles (NOAA's G scale), until at Kp 9 the glow reaches
//   Portugal, as on 10 May 2024. The model is not to scale, and its time runs fast;
// - oxygen's two colours: a ladder in the sky through the main curtain (90 to 300 km, 0.6 m a kilometre)
//   and, in the camp, the picture's lens onto one oxygen atom, a cone of light joining it to the chosen height.
//   Tap the curtain at a height (or the gauge by the lens, or slide it) and an electron strikes the atom
//   there: lifted to its upper level, it gives green (557.7 nm) in under a second and drops to its middle
//   level, where it waits to give red (630.0 nm, about 110 s on average: here the clock runs 20 times faster
//   while it waits). Low down a passing molecule bumps it first and takes the energy (quenching); high up the
//   air is thin enough for the red. Below 100 km the electron strikes nitrogen instead: its blue-violet glow,
//   the storm's purple fringe. The crowd of molecules in the lens follows the real density, on a squeezed
//   scale, and its mix (more single oxygen atoms higher up);
// - seeing it: a camera on a tripod in the snow. Tap it and it takes a long exposure: it draws the camp from
//   its tripod several times across the exposure and adds them up, so the moving curtains blur as they would.
//   A screen beside it shows the photo next to what the eye sees at night (rods: little colour, nearly blind
//   to red). The exposure is a slider. A white fox sits by a birch: tap it and it runs over the snow, its tail
//   flinging sparks into the sky, revontulet, "fox fires", as a Finnish folk tale tells it.
// All four are shared in a room (src/net/shared.js); the words, panels, discoveries and the photo's pixels
// stay each one's. parts.<thing>.tap(...) does what a tap does, for the probes; parts.rayTo(p) aims a real one.
//
// Facts (checked 2026-10-31): green 557.7 nm, O(1S -> 1D), about 0.7 s, mostly 100 to 150 km; red 630.0 nm,
// O(1D -> 3P), about 110 s (sources give 107 to 110 s, "nearly two minutes"), only above about 150 to 200 km,
// lower down collisions quench it (Wikipedia "Aurora"; atoptics.co.uk); the sharp lower edge from atomic
// oxygen thinning out below about 100 km; nitrogen's blue and purple at the lower edge in strong auroras; the
// auroral zone centred on about 67° magnetic latitude; mostly electrons, accelerated to a few keV. NOAA's G
// scale: G1 Kp 5, G2 Kp 6 (aurora seen as low as about 55° geomagnetic latitude), G3 Kp 7 (50°), G4 Kp 8
// (45°), G5 Kp 9 (40°); the values below Kp 6 here are drawn between those and the quiet oval (not NOAA's).
// 10 to 11 May 2024: G5, Kp 9, CMEs from AR 13664 launched on 8 May, arriving on 10 May; seen in Portugal
// (Observador: Bragança, Viseu, Guarda, Coimbra, Santarém, Portalegre; Miguel Claro at Alqueva, about 38° N,
// some bands faintly with the naked eye), Spain, the Canary Islands, Mexico (Wikipedia "May 2024 solar
// storms"). Revontulet: "the fox's fires"; in a Lapland tale the fire fox's tail flings sparks into the sky
// as it runs (Wikipedia "Firefox (mythology)", citing Ojanen and Linnea 2019); another telling has its tail
// sweeping up snow crystals into sparks (Athropolis). Air density, US Standard Atmosphere 1976.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, at, clamp, lerp, damp, random, hdr, fill, num, standingScreen } from '../../../wings/noble/kit.js'
import { arcticStage } from '../../stages/arctic.js'
import { glowTexture } from '../../stages/space.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAND } from '../../../wings/oxygen/earthLand.js'
import { AURORA_WORDS } from './aurora.words.js'

export const WORDS = AURORA_WORDS

const TAU = Math.PI * 2
const UP = new THREE.Vector3(0, 1, 0)
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const deg = THREE.MathUtils.degToRad

// colours: the picture's green, oxygen's red line, nitrogen's violet, the Sun's gold, the camera's blue;
// atoms as the hall's pictures draw them (oxygen red, nitrogen blue)
const GREEN = '#6ef0a0'
const RED = '#ff4d6d'
const VIOLET = '#9a6bff'
const GUST_C = '#ffc857'
const CAM_C = '#8fd0ff'
const O_COL = '#ff4d4d'
const N_COL = '#4d7dff'

// metres of sky for each kilometre of height (the ladder and the curtains): 0.36 in the aurora's own frame,
// which the stage scales up 3.5 times round the camp, so the curtains stand behind the fells
const AURORA_SCALE = 3.5
const KM = 0.36 * AURORA_SCALE
const LS = AURORA_SCALE // the ladder's size, as far off as the curtain it stands in
const R = 13 // the camp's walkable circle

// ---- where things stand (metres; the spawn looks north, along -z, over the lake) ----
const SPAWN = { x: 0, z: 6.4 }
const BACK = { x: 0, z: 10.1 }
// the easel on the spawn's right: on the left it stood on the line along which the gust station's view backs
// off on an upright phone, and filled it
const STAND = { x: 3.0, z: 4.7 }
const HOST = { x: -2.0, z: 4.6 }
const HUT = { x: -10.9, z: -0.4, rot: 1.47 }
const TENT = { x: 10.0, z: 3.2 }
// the Sun and the Earth on the ice table, west of the camp's middle; the Sun on the far left
const MODEL = V3(-5.6, 0, -1.6)
const MODEL_YAW = -0.34
const GUST_SPOT = { x: -4.2, z: 1.3 }
const Y0 = 1.5 // the model's height
const RE = 0.42 // the Earth's radius in the model
const SUN = V3(-1.55, Y0, 0) // in the model's own frame (x: from the Sun toward the Earth)
const EARTH = V3(0.35, Y0, 0)
// the lens onto one oxygen atom, north of the middle, and its gauge; the ladder in the sky beyond
const LENS = V3(1.4, 1.95, -6.9)
const LR = 1.0
const COL_SPOT = { x: 1.1, z: -3.7 }
const LADDER = { x: -122, z: -905 }
// the camera on its tripod (east), its screen, the fox by its birch
const TRIPOD = { x: 5.7, z: -3.3 }
const SCREEN_AT = { x: 7.1, z: -1.1 }
const CAM_SPOT = { x: 4.4, z: 0.4 }
const FOX = { x: 9.7, z: -6.3 }

// ---- the gust: the storm's moments (s after the launch; a real CME takes 15 hours to several days) ----
const ARRIVE = 3.1 // the first particles reach the ovals
const HOLD = 40 // the storm at its height
const FADE = 95 // calm again
const QUIET_KP = 2
const NP = 170 // particles in the cloud
/** Where aurora has been seen at each Kp, geomagnetic latitude (°): NOAA's G scale from Kp 6 (55°) to 9 (40°),
 *  drawn up to the quiet oval below that. */
const VIEW = [62, 61, 60, 59, 58, 57, 55, 50, 45, 40]
const viewLat = kp => {
  const k = clamp(kp, 0, 9)
  const i = Math.min(8, Math.floor(k))
  return lerp(VIEW[i], VIEW[i + 1], k - i)
}
const envelope = a => (a < ARRIVE ? 0 : a < ARRIVE + 3 ? ease((a - ARRIVE) / 3) : a < HOLD ? 1 : a < FADE ? 1 - ease((a - HOLD) / (FADE - HOLD)) : 0)

// ---- oxygen's two colours ----
const KM0 = 90
const KM1 = 300
const T_E = 0.7 // the electron's flight into the lens
const SPEED = 20 // the clock while the atom waits for red
const A_RED = 1 / 110 // O(1D): about 110 s
const SHOW = 2.8 // the result shown before the next try
// air density (kg/m³), US Standard Atmosphere 1976
const RHO = [[90, 3.416e-6], [100, 5.604e-7], [120, 2.222e-8], [150, 2.076e-9], [200, 2.541e-10], [250, 6.073e-11], [300, 1.916e-11]]
const rhoAt = h => {
  for (let i = 1; i < RHO.length; i++) {
    if (h <= RHO[i][0]) {
      const [h0, r0] = RHO[i - 1]
      const [h1, r1] = RHO[i]
      return Math.exp(lerp(Math.log(r0), Math.log(r1), (h - h0) / (h1 - h0)))
    }
  }
  return RHO.at(-1)[1]
}
/** How many molecules the lens shows at height h (the real density, squeezed). */
const crowd = h => Math.round(2 + 36 * Math.pow(rhoAt(h) / RHO[0][1], 0.22))
/** The share of single oxygen atoms among the air's particles at height h (most above about 200 km). */
const shareO = h => clamp(1 / (1 + Math.exp(-(h - 195) / 30)), 0.04, 0.95)
/** A try's outcome from its number and height (the same for everyone in a room): nitrogen below 100 km;
 *  above, the green after tg seconds, then the wait on the red level, ended by the red line or a bump. */
function tryOf(n, h) {
  const rnd = random(n * 7919 + Math.round(h * 10) + 13)
  rnd()
  if (h < 100) return { kind: 'n2', end: T_E + SHOW }
  const tg = clamp(-0.7 * Math.log(1 - rnd() * 0.98), 0.3, 1.8)
  const q = A_RED * Math.exp(-(h - 250) / 28) // collisions that take the 1D level's energy
  const tReal = -Math.log(1 - rnd() * 0.999) / (A_RED + q)
  const red = rnd() < A_RED / (A_RED + q)
  const tw = clamp(tReal / SPEED, red ? 1.6 : 0.9, 7)
  return { kind: 'o', tg, tw, tReal, red, end: T_E + tg + tw + SHOW }
}

// ---- seeing it ----
const EXP_MIN = 1 / 30
const EXP_SPAN = 900 // to 30 s
const expOf = x => EXP_MIN * Math.pow(EXP_SPAN, clamp(x))
const xOfExp = e => Math.log(e / EXP_MIN) / Math.log(EXP_SPAN)
const GAIN = 0.75 // the photo's brightness for each second of exposure
const FOX_RUN = 9 // s
const FOX_SIZE = 1.35 // a little bigger than a real arctic fox, to be seen across the camp
const FOX_BACK = 15 // s, the fox back on its seat

/** A direction on the globe from latitude and longitude (°), as SphereGeometry's map lies. */
const globeDir = (lat, lon) => {
  const f = deg(lon + 180)
  const p = deg(lat)
  return V3(-Math.cos(f) * Math.cos(p), Math.sin(p), Math.sin(f) * Math.cos(p))
}

/** The night Earth's map (equirectangular), from Natural Earth's land. */
function earthMap() {
  return canvasTex(1024, 512, (g, w, h) => {
    const X = lon => ((lon + 180) / 360) * w
    const Y = lat => ((90 - lat) / 180) * h
    g.fillStyle = '#123a6e'
    g.fillRect(0, 0, w, h)
    const land = new Path2D()
    for (const ring of LAND) {
      let lon = ring[0]
      let lat = ring[1]
      land.moveTo(X(lon / 5), Y(lat / 5))
      for (let i = 2; i < ring.length; i += 2) {
        lon += ring[i]
        lat += ring[i + 1]
        land.lineTo(X(lon / 5), Y(lat / 5))
      }
      land.closePath()
    }
    g.fillStyle = '#3f7a52'
    g.fill(land, 'evenodd')
    g.save()
    g.clip(land, 'evenodd')
    g.filter = 'blur(4px)'
    g.fillStyle = '#e6edf4'
    g.fillRect(0, Y(90), w, Y(66) - Y(90))
    g.fillRect(0, Y(-62), w, Y(-90) - Y(-62))
    g.restore()
    g.fillStyle = 'rgba(230,240,248,0.85)'
    g.fillRect(0, Y(90), w, Y(80) - Y(90))
  })
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, clickable }) {
  const stage = arcticStage({
    radius: R,
    km: KM / AURORA_SCALE,
    auroraScale: AURORA_SCALE,
    light,
    pixelRatio: ctx.renderer?.getPixelRatio?.() ?? 1,
    hut: HUT,
    tent: TENT,
    birches: [[-11.0, -5.6, 1.05], [-9.3, 5.6, 0.85], [11.4, -2.2, 0.95], [11.6, -7.6, 1.1], [-3.5, -11.9, 0.9], [6.6, -11.4, 0.8]],
    paths: [
      [[SPAWN.x, SPAWN.z + 2], [SPAWN.x, SPAWN.z], [0.6, 2.4], [COL_SPOT.x, COL_SPOT.z]],
      [[0.6, 2.4], [GUST_SPOT.x, GUST_SPOT.z]],
      [[0.6, 2.4], [CAM_SPOT.x, CAM_SPOT.z]],
      [[GUST_SPOT.x, GUST_SPOT.z], [HUT.x + 2.4, HUT.z + 0.4]],
      [[SPAWN.x, SPAWN.z], [TENT.x - 2.2, TENT.z + 0.4]],
    ],
    clearings: [[SPAWN.x, SPAWN.z, 1.4], [COL_SPOT.x, COL_SPOT.z, 1.3], [GUST_SPOT.x, GUST_SPOT.z, 1.2], [CAM_SPOT.x, CAM_SPOT.z, 1.2]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const lang = ctx.lang()
  const paras = (list, lv) => list[depth(lv)].map(p => ({ p }))
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  const near = (spot, r) => Math.hypot(ctx.engine.player.pos.x - spot.x, ctx.engine.player.pos.z - spot.z) < r
  const label = (text, size, c = '#eef2ff', opts = {}) => makeText(text, { size, color: c, anchorX: 'center', anchorY: 'middle', ...opts })
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  const glow = glowTexture(128)
  textures.push(glow)
  const glowSprite = (c, size, opacity = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: c, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(size)
    s.raycast = () => {}
    return s
  }
  const wood = new THREE.MeshStandardMaterial({ color: '#5a3f2e', roughness: 0.8 })
  const metal = new THREE.MeshStandardMaterial({ color: '#3b4150', roughness: 0.5, metalness: 0.4 })
  const GOLD = new THREE.Color('#ffd166')
  // the room's clock is wall time, so everyone in a room sees the same moments
  const born = performance.now()
  const clock = () => (performance.now() - born) / 1000
  // words that follow the reader's depth (3D signs): set again when the level changes
  const relabels = []
  let shownLevel = null
  // things the camera's photo must not show (they are not in the real camp)
  const notInPhoto = []
  // labels that face the eye
  const facing = []

  // ================= the Sun's gust =================
  const model = new THREE.Group()
  model.position.copy(MODEL)
  model.rotation.y = MODEL_YAW
  root.add(model)
  model.updateMatrixWorld()
  const toWorld = p => model.localToWorld(p.clone())
  // the ice table
  {
    const iceMat = new THREE.MeshStandardMaterial({ color: '#5d8aa8', emissive: '#0f2c40', emissiveIntensity: 0.35, roughness: 0.25, metalness: 0.05, transparent: true, opacity: 0.9 })
    const top = new THREE.Mesh(new RoundedBoxGeometry(3.5, 0.78, 1.1, 3, 0.12), iceMat)
    top.position.y = 0.39
    model.add(top)
    solids.push(box(MODEL.x, MODEL.z, 3.6, 1.2, { rot: MODEL_YAW }))
  }
  // the Sun, lighting the Earth's day side
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 20), new THREE.MeshBasicMaterial({ color: hdr('#ffb03a', 1.15) }))
  sun.position.copy(SUN)
  const sunGlow = glowSprite('#ff9a2a', 1.4, 0.6)
  sun.add(sunGlow)
  const sunLight = new THREE.PointLight('#ffd9a0', 2.6, 3.4, 1.2)
  sunLight.position.copy(SUN)
  model.add(sun, sunLight)
  const sunHit = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 8), new THREE.MeshBasicMaterial({ visible: false }))
  sun.add(sunHit)
  // the Earth, turned so that Europe faces the visitor on the night side, its north pole tipped toward them
  const earthTex = earthMap()
  textures.push(earthTex)
  const globe = new THREE.Mesh(new THREE.SphereGeometry(RE, 48, 32), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.75, emissive: '#0a1830', emissiveIntensity: 0.6 }))
  globe.position.copy(EARTH)
  model.add(globe)
  const visitorDir = (() => {
    const e = toWorld(EARTH)
    return V3(GUST_SPOT.x - e.x, 0, GUST_SPOT.z - e.z).normalize().applyAxisAngle(UP, -MODEL_YAW)
  })()
  const ANTI = V3(1, 0, 0) // away from the Sun, in the model's frame
  {
    const axis = UP.clone().addScaledVector(visitorDir, 0.5).normalize()
    const q1 = new THREE.Quaternion().setFromUnitVectors(UP, axis)
    const europe = globeDir(52, 12).applyQuaternion(q1)
    const want = visitorDir.clone().multiplyScalar(0.75).addScaledVector(ANTI, 0.6)
    const flat = v => v.clone().addScaledVector(axis, -v.dot(axis)).normalize()
    const a = flat(europe)
    const b = flat(want)
    const ang = Math.atan2(a.clone().cross(b).dot(axis), a.dot(b))
    globe.quaternion.copy(new THREE.Quaternion().setFromAxisAngle(axis, ang).multiply(q1))
  }
  const onGlobe = (lat, lon) => globeDir(lat, lon).applyQuaternion(globe.quaternion)
  // the geomagnetic north pole (IGRF, 2025: about 80.8° N, 72.7° W)
  const M = onGlobe(80.8, -72.7)
  const magLat = d => THREE.MathUtils.radToDeg(Math.asin(clamp(d.dot(M), -1, 1)))
  // the field lines: closed loops pressed in on the Sun's side and stretched behind; open ones into the tail
  {
    const curves = []
    const u0 = ANTI.clone().addScaledVector(M, -ANTI.dot(M)).normalize()
    const v0 = M.clone().cross(u0)
    for (let k = 0; k < 8; k++) {
      const psi = (k / 8) * TAU + 0.2
      const u = u0.clone().multiplyScalar(Math.cos(psi)).addScaledVector(v0, Math.sin(psi))
      for (const L of [1.6, 2.15, 2.75]) {
        const lim = Math.acos(Math.sqrt(1 / L))
        const pts = []
        for (let i = 0; i <= 36; i++) {
          const lam = -lim + (2 * lim * i) / 36
          const r = L * RE * Math.cos(lam) ** 2
          const p = u.clone().multiplyScalar(r * Math.cos(lam)).addScaledVector(M, r * Math.sin(lam))
          const w = clamp((r - RE) / (0.6 * RE))
          p.x *= 1 + ((p.x < 0 ? 0.72 : 1.5) - 1) * w
          pts.push(p.add(EARTH))
        }
        curves.push(new THREE.CatmullRomCurve3(pts))
      }
    }
    for (const s of [1, -1]) {
      for (const side of [-0.28, -0.1, 0.1, 0.28]) {
        const lat = s * 78
        const dir = M.clone().multiplyScalar(s * Math.sin(deg(78))).addScaledVector(u0, Math.cos(deg(78))).addScaledVector(v0, side).normalize()
        void lat
        const p0 = EARTH.clone().addScaledVector(dir, RE)
        const c1 = EARTH.clone().addScaledVector(M, s * 0.85).addScaledVector(ANTI, 0.25).addScaledVector(v0, side * 0.6)
        const c2 = EARTH.clone().addScaledVector(ANTI, 1.25).addScaledVector(M, s * 0.5).addScaledVector(v0, side * 0.9)
        const p3 = EARTH.clone().addScaledVector(ANTI, 2.25).addScaledVector(M, s * 0.34).addScaledVector(v0, side * 1.1)
        curves.push(new THREE.CubicBezierCurve3(p0, c1, c2, p3))
      }
    }
    const geo = mergeGeometries(curves.map(cv => new THREE.TubeGeometry(cv, 40, 0.0065, 4, false)))
    const lines = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: hdr('#9fd2ff', 0.95), transparent: true, opacity: 0.5, depthWrite: false }))
    lines.raycast = () => {}
    model.add(lines)
  }
  // the auroral ovals round both geomagnetic poles: bands drawn on the globe, their size from the Kp index
  const OV_SEG = 96
  const OV_ROWS = 4
  const ovalMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: hdr(GREEN, 1.0) }, uBright: { value: 0.4 } },
    vertexShader: /* glsl */ `
      attribute float aA; varying float vA;
      void main() { vA = aA; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uBright; varying float vA;
      void main() {
        gl_FragColor = vec4(uColor * vA * uBright, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const ovalBasis = s => {
    const m = M.clone().multiplyScalar(s)
    const a = ANTI.clone().addScaledVector(m, -ANTI.dot(m)).normalize()
    return { m, a, b: m.clone().cross(a) }
  }
  const makeOval = s => {
    const pos = new Float32Array((OV_SEG + 1) * OV_ROWS * 3)
    const alpha = new Float32Array((OV_SEG + 1) * OV_ROWS)
    const idx = []
    for (let i = 0; i < OV_SEG; i++) {
      for (let j = 0; j < OV_ROWS - 1; j++) {
        const a = i * OV_ROWS + j
        const b = a + OV_ROWS
        idx.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aA', new THREE.BufferAttribute(alpha, 1))
    geo.setIndex(idx)
    const mesh = new THREE.Mesh(geo, ovalMat)
    mesh.frustumCulled = false
    mesh.raycast = () => {}
    model.add(mesh)
    return { s, geo, pos, alpha, basis: ovalBasis(s) }
  }
  const ovals = [makeOval(1), makeOval(-1)]
  /** The oval's band for a Kp: [colatitude (°) of its poleward edge, middle, equatorward edge, the farthest it
   *  is seen] on the night side, and its middle on the day side. */
  const ovalAt = kp => {
    const v = viewLat(kp)
    const e = v + 5
    const w = 2.5 + 0.45 * kp
    return { night: [90 - e - 2 * w, 90 - e - w, 90 - e, 90 - v], day: 90 - (78 - 0.9 * kp), w }
  }
  const pointOn = (basis, colat, psi, r = RE * 1.012) => {
    const t = deg(colat)
    return basis.m.clone().multiplyScalar(Math.cos(t)).addScaledVector(basis.a, Math.sin(t) * Math.cos(psi)).addScaledVector(basis.b, Math.sin(t) * Math.sin(psi)).multiplyScalar(r).add(EARTH)
  }
  let ovalKp = -1
  const drawOvals = kp => {
    if (Math.abs(kp - ovalKp) < 0.01) return
    ovalKp = kp
    const o = ovalAt(kp)
    const ALPHA = [0, 1, 0.45, 0]
    for (const ov of ovals) {
      for (let i = 0; i <= OV_SEG; i++) {
        const psi = (i / OV_SEG) * TAU
        const night = (1 + Math.cos(psi)) / 2
        const mid = lerp(o.day, o.night[1], night)
        const w = o.w * lerp(0.7, 1, night)
        const rows = [mid - w, mid, mid + w, mid + w + (o.night[3] - o.night[2]) * night]
        for (let j = 0; j < OV_ROWS; j++) {
          const p = pointOn(ov.basis, rows[j], psi)
          ov.pos.set([p.x, p.y, p.z], (i * OV_ROWS + j) * 3)
          ov.alpha[i * OV_ROWS + j] = ALPHA[j] * (j === 3 ? 0 : 1) * (j === 2 ? lerp(0.6, 1, night) : 1)
        }
      }
      ov.geo.attributes.position.needsUpdate = true
      ov.geo.attributes.aA.needsUpdate = true
      ov.geo.computeBoundingSphere()
    }
  }
  // the next gust's oval, dotted, while the slider is not where the sky is
  const PREV = 72
  const prevPos = new Float32Array(PREV * 3)
  const prevGeo = new THREE.BufferGeometry()
  prevGeo.setAttribute('position', new THREE.BufferAttribute(prevPos, 3))
  const preview = new THREE.Points(prevGeo, new THREE.PointsMaterial({ color: hdr('#d8ffe8', 1.2), size: 0.035, map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  preview.frustumCulled = false
  preview.raycast = () => {}
  model.add(preview)
  let previewKp = -1
  const drawPreview = kp => {
    if (Math.abs(kp - previewKp) < 0.01) return
    previewKp = kp
    const o = ovalAt(kp)
    const basis = ovals[0].basis
    for (let i = 0; i < PREV; i++) {
      const psi = (i / PREV) * TAU
      const night = (1 + Math.cos(psi)) / 2
      const p = pointOn(basis, lerp(o.day, o.night[1], night) + o.w * night, psi, RE * 1.02)
      prevPos.set([p.x, p.y, p.z], i * 3)
    }
    prevGeo.attributes.position.needsUpdate = true
  }
  // our camp (Finnish Lapland, about 69° N) and Portugal, marked on the globe
  const markMat = c => new THREE.MeshBasicMaterial({ color: hdr(c, 1.4), toneMapped: false })
  const campDir = onGlobe(69.0, 21.0)
  const ptDir = onGlobe(39.6, -8.0)
  const ptLat = magLat(ptDir)
  const campDot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), markMat('#ffd08a'))
  campDot.position.copy(EARTH).addScaledVector(campDir, RE * 1.01)
  const ptMat = markMat('#ffe0a0')
  const ptDot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), ptMat)
  ptDot.position.copy(EARTH).addScaledVector(ptDir, RE * 1.01)
  const ptGlow = glowSprite('#ff7ab0', 0.16, 0)
  ptGlow.position.copy(ptDot.position)
  model.add(campDot, ptDot, ptGlow)
  // the words: what each is, the camp and Portugal (leaning out from the globe), not to scale
  const sunTag = label('', 0.085, '#ffe2a8', { outlineWidth: 0.008, outlineColor: '#1a1206' })
  const earthTag = label('', 0.085, '#dff0ff', { outlineWidth: 0.008, outlineColor: '#06101e' })
  const campTag = label('', 0.065, '#ffe2b0', { outlineWidth: 0.007, outlineColor: '#06101e', anchorX: 'left' })
  const ptTag = label('', 0.065, '#ffe2b0', { outlineWidth: 0.007, outlineColor: '#06101e', anchorX: 'right' })
  const scaleTag = label('', 0.06, '#cfe6ff', { maxWidth: 2.6 })
  root.add(sunTag, earthTag, campTag, ptTag, scaleTag)
  sunTag.position.copy(toWorld(SUN.clone().add(V3(0, 0.45, 0))))
  earthTag.position.copy(toWorld(EARTH.clone().add(V3(0, RE + 0.3, 0))))
  campTag.position.copy(toWorld(EARTH.clone().addScaledVector(campDir, RE * 1.35).add(V3(0.04, 0, 0))))
  ptTag.position.copy(toWorld(EARTH.clone().addScaledVector(ptDir, RE * 1.3).add(V3(-0.04, -0.03, 0))))
  scaleTag.position.copy(toWorld(V3(0, 0.3, 0.57)))
  scaleTag.rotation.y = MODEL_YAW
  facing.push(sunTag, earthTag, campTag, ptTag)
  relabels.push(lv => {
    setText(sunTag, E.gust.signs.sun)
    setText(earthTag, E.gust.signs.earth)
    setText(campTag, E.gust.signs.camp)
    setText(scaleTag, at(E.gust.signs.model, lv))
  })
  // the station's words on the ice table's own face (a sign beside it stood between the eye and the model):
  // its name, the storm's strength now; a glowing edge along the top that turns gold once found
  const gustTitle = label(E.gust.label, 0.11, hdr(GUST_C, 1.05), { outlineWidth: 0.008, outlineColor: '#1a1206' })
  gustTitle.position.set(0, 0.6, 0.56)
  const gustLine = label('', 0.075, '#fff1d6', { outlineWidth: 0.006, outlineColor: '#1a1206' })
  gustLine.position.set(0, 0.45, 0.56)
  model.add(gustTitle, gustLine)
  const edgeMat = new THREE.MeshStandardMaterial({ color: GUST_C, emissive: GUST_C, emissiveIntensity: 0.8, roughness: 0.4 })
  const edge = new THREE.Mesh(new RoundedBoxGeometry(3.3, 0.03, 0.03, 1, 0.01), edgeMat)
  edge.position.set(0, 0.78, 0.53)
  model.add(edge)
  const gustSign = {
    setRead(r) {
      edgeMat.color.set(r ? GOLD : GUST_C)
      edgeMat.emissive.set(r ? GOLD : GUST_C)
      edgeMat.emissiveIntensity = r ? 0.45 : 0.8
    },
  }
  // the cloud of particles
  const NPx = light ? 100 : NP
  const partPos = new Float32Array(NPx * 3)
  const partCol = new Float32Array(NPx * 3)
  const partGeo = new THREE.BufferGeometry()
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3))
  partGeo.setAttribute('color', new THREE.BufferAttribute(partCol, 3))
  const parts = new THREE.Points(partGeo, new THREE.PointsMaterial({ size: 0.1, map: glow, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  parts.frustumCulled = false
  parts.raycast = () => {}
  parts.visible = false
  model.add(parts)
  let paths = []
  /** The n-th gust's particles: each one's path and moments (the same for everyone in a room). */
  const buildPaths = (n, kp) => {
    const rnd = random(n * 31 + 7)
    const o = ovalAt(kp)
    paths = Array.from({ length: NPx }, (_, i) => {
      const dir = V3(1 + rnd() * 0.5, (rnd() - 0.5) * 1.6, (rnd() - 0.5) * 1.6).normalize()
      const s = SUN.clone().addScaledVector(dir, 0.31)
      const ang = rnd() * TAU
      const rr = 0.12 + Math.sqrt(rnd()) * 0.5
      const rad = V3(0, Math.cos(ang), Math.sin(ang))
      const a = EARTH.clone().add(V3(-0.95, 0, 0)).addScaledVector(rad, rr)
      const inside = i % 3 === 0
      const delay = rnd() * 0.55
      if (!inside) {
        const b = EARTH.clone().add(V3(-0.1, 0, 0)).addScaledVector(rad, 0.95 + rnd() * 0.25)
        const c = EARTH.clone().add(V3(2.1, 0, 0)).addScaledVector(rad, 1.25 + rnd() * 0.3)
        return { curve: new THREE.CatmullRomCurve3([s, a, b, c]), delay, dur: 2.7, inside }
      }
      const north = i % 2 === 0 ? 1 : -1
      const ov = ovals[north > 0 ? 0 : 1]
      const psi = (rnd() - 0.5) * 2.2
      const night = (1 + Math.cos(psi)) / 2
      const land = pointOn(ov.basis, lerp(o.day, o.night[1], night) + (rnd() - 0.5) * o.w, psi, RE * 1.01)
      const b = EARTH.clone().add(V3(0.25, 0, 0)).addScaledVector(rad, 0.92)
      const t = EARTH.clone().add(V3(1.6, 0, 0)).addScaledVector(rad, 0.16)
      const v = EARTH.clone().addScaledVector(ANTI, 0.7).addScaledVector(M, north * 0.55)
      return { curve: new THREE.CatmullRomCurve3([s, a, b, t, v, land]), delay, dur: ARRIVE - 0.2 + rnd() * 0.5, inside }
    })
  }
  const G = { n: 0, kp: 7, sent: 7, start: -99, mine: false, said: 2 }
  const gAge = () => clock() - G.start
  const gBusy = () => G.n > 0 && gAge() < ARRIVE + 0.6
  const stormNow = () => (G.n > 0 ? envelope(gAge()) : 0)
  let kpShown = QUIET_KP
  const kpName = (kp, lv) => fill(E.gust.kp, { k: Math.round(kp), name: E.gust.scale[depth(lv)][clamp(Math.round(kp), 0, 9)] })
  const gustPanel = lv => ({
    title: E.gust.title,
    color: GUST_C,
    blocks: [
      {
        slider: {
          label: E.gust.slider,
          min: 0,
          max: 9,
          step: 1,
          value: G.kp,
          onInput: v => {
            setKp(v)
            slid('gust')
          },
          format: v => kpName(v, lv),
          live: () => G.kp,
        },
      },
      { buttons: [{ label: E.gust.verbs.send, onClick: () => gustStep() }] },
      ...paras(E.gust.panel, lv),
      ...(lv === 'scientist' ? [{ rows: E.gust.rows }] : []),
    ],
  })
  /** The slider: the next gust's strength, and the storm's under way. */
  function setKp(v) {
    G.kp = Math.round(clamp(Number(v) || 0, 0, 9))
    if (stormNow() > 0.02) G.sent = G.kp
  }
  const startGust = (n, kp, a) => {
    G.n = n
    G.sent = kp
    G.start = clock() - a
    buildPaths(n, kp)
  }
  /** A tap on the Sun: a gust. */
  function gustStep() {
    const lv = level()
    if (gBusy()) {
      say(at(W.busy, lv))
      return false
    }
    G.mine = true
    G.said = 0
    startGust(G.n + 1, G.kp, 0)
    play('beam')
    say(at(E.gust.says.send, lv), GUST_C)
    share('gust')
    refresh(gustPanel)
    return true
  }
  ex.add({
    id: 'gust',
    x: GUST_SPOT.x,
    z: GUST_SPOT.z,
    radius: 1.9,
    label: E.gust.label,
    verb: () => {
      const H = E.gust.hints
      if (gBusy()) return H.watch
      if (!G.n) return H.send
      return stormNow() > 0.3 && G.sent < 9 ? H.stronger : H.again
    },
    manual: true,
    screens: [gustSign],
    focus: (() => {
      // between the Sun and the Earth
      const p = toWorld(V3(-0.55, Y0 - 0.05, 0))
      return { x: p.x, y: p.y, z: p.z, size: 1.9, width: 3.1 }
    })(),
    act: () => ctx.showPanel(gustPanel),
  })
  clickable(sunHit, () => gustStep(), { reach: 5.5 })
  const ptColor = new THREE.Color()
  let gustSound = 0
  updates.push((dt, t) => {
    const a = gAge()
    const st = stormNow()
    // the oval: quiet, or as strong as the storm under way
    const target = QUIET_KP + (G.sent - QUIET_KP) * st
    kpShown = damp(kpShown, target, 3, dt)
    drawOvals(kpShown)
    ovalMat.uniforms.uBright.value = 0.45 + 0.9 * st + Math.sin(t * 2.3) * 0.05
    preview.visible = Math.abs(G.kp - kpShown) > 0.4 && !gBusy()
    if (preview.visible) drawPreview(G.kp)
    preview.material.opacity = 0.55 + Math.sin(t * 4) * 0.25
    // Portugal lit when the glow reaches it
    const reached = viewLat(kpShown) <= ptLat + 0.5
    ptGlow.material.opacity = reached ? 0.8 + Math.sin(t * 3) * 0.2 : 0
    ptMat.color.copy(reached ? hdr('#ff8ac0', 1.6) : hdr('#ffe0a0', 1.2))
    setText(ptTag, reached ? E.gust.signs.seen : E.gust.signs.portugal)
    // the particles
    const flying = G.n > 0 && a < ARRIVE + 1.4
    parts.visible = flying
    if (flying) {
      for (let i = 0; i < paths.length; i++) {
        const p = paths[i]
        const u = (a - p.delay) / p.dur
        let k = 0
        if (u > 0 && u < 1.15) {
          const c = Math.min(1, u)
          const q = p.curve.getPoint(p.inside ? c : ease(c) * 0.5 + c * 0.5)
          partPos.set([q.x, q.y, q.z], i * 3)
          k = Math.min(1, u * 5) * (p.inside ? (u < 1 ? 1 : 1 - (u - 1) / 0.15) : 1 - span(0.75, 1, u))
        }
        ptColor.set(p.inside && u > 0.65 ? '#c8ffd8' : '#ffe9b0').multiplyScalar(k * 1.3)
        partCol.set([ptColor.r, ptColor.g, ptColor.b], i * 3)
      }
      partGeo.attributes.position.needsUpdate = true
      partGeo.attributes.color.needsUpdate = true
    }
    // the sky over the camp
    const s = st * (0.25 + 0.75 * (G.sent / 9))
    stage.aurora.set({ level: 0.55 + 0.45 * s, storm: s })
    sun.scale.setScalar(1 + (G.n > 0 && a < 0.6 ? Math.sin((a / 0.6) * Math.PI) * 0.12 : 0))
    sunGlow.material.opacity = 0.75 + Math.sin(t * 1.7) * 0.1
    // the moments: the arrival for whoever sent it
    if (G.n > 0 && a >= ARRIVE && gustSound < G.n) {
      gustSound = G.n
      play('enter')
      if (G.mine && G.said < 1) {
        G.said = 1
        const lv = level()
        say(at(G.sent >= 8.5 ? E.gust.says.far : G.sent <= 3 ? E.gust.says.calm : E.gust.says.arrive, lv), GUST_C)
        ex.discover('gust', gustPanel, 3.0)
        refresh(gustPanel)
      }
    }
    setText(gustLine, kpName(kpShown, level()))
  })

  // ================= oxygen's two colours: the ladder in the sky and the lens =================
  // the ladder, standing in the main curtain over the lake's far shore, turned to the camp
  const ladder = new THREE.Group()
  ladder.position.set(LADDER.x, 0, LADDER.z)
  ladder.rotation.y = Math.atan2(-LADDER.x, -LADDER.z)
  root.add(ladder)
  notInPhoto.push(ladder)
  const ladMat = new THREE.MeshBasicMaterial({ color: hdr('#d6ecff', 0.8), transparent: true, opacity: 0.6, depthWrite: false, fog: false })
  {
    const y0 = KM0 * KM
    const y1 = KM1 * KM
    const parts2 = []
    for (const x of [-3.2 * LS, 3.2 * LS]) parts2.push(new THREE.BoxGeometry(0.5 * LS, y1 - y0, 0.5 * LS).translate(x, (y0 + y1) / 2, 0))
    for (let k = KM0 + 10; k < KM1; k += 10) parts2.push(new THREE.BoxGeometry(6.4 * LS, (k % 50 ? 0.25 : 0.55) * LS, 0.3 * LS).translate(0, k * KM, 0))
    // dots down to the ground: the ladder starts 90 km up
    for (let y = 2 * LS; y < y0 - 2 * LS; y += 4 * LS) parts2.push(new THREE.BoxGeometry(0.5 * LS, 1.6 * LS, 0.5 * LS).translate(0, y, 0))
    const geo = mergeGeometries(parts2)
    const m = new THREE.Mesh(geo, ladMat)
    m.raycast = () => {}
    ladder.add(m)
  }
  const ladTags = []
  for (let k = 100; k <= KM1; k += 50) {
    const t = label(`${k} km`, 5.2 * LS, '#e8f4ff', { anchorX: 'left', outlineWidth: 0.3 * LS, outlineColor: '#04101c' })
    t.position.set(5.2 * LS, k * KM, 0)
    ladder.add(t)
    ladTags.push(t)
  }
  const ladTitle = label('', 6.0 * LS, hdr(GREEN, 1.1), { outlineWidth: 0.35 * LS, outlineColor: '#04101c', maxWidth: 120 * LS })
  ladTitle.position.set(0, KM1 * KM + 9 * LS, 0)
  ladder.add(ladTitle)
  // the chosen height on the ladder: a ring that flashes with the colour given
  const ringMat = new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 1.4), transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false, fog: false })
  const skyRing = new THREE.Mesh(new THREE.TorusGeometry(5.5 * LS, 0.45 * LS, 8, 48), ringMat)
  skyRing.raycast = () => {}
  ladder.add(skyRing)
  const skyFlash = glowSprite('#ffffff', 40 * LS, 0)
  skyFlash.material.fog = false
  ladder.add(skyFlash)
  // a tap on the curtain picks a height: an invisible wall through it
  const skyHit = new THREE.Mesh(new THREE.PlaneGeometry(800 * LS, (KM1 - KM0) * KM + 16 * LS), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }))
  skyHit.position.set(0, ((KM0 + KM1) / 2) * KM, -4 * LS)
  ladder.add(skyHit)

  // the lens: the picture's oxygen atom with its rings, on a stand, turned to the visitor
  const lens = new THREE.Group()
  lens.position.copy(LENS)
  lens.lookAt(COL_SPOT.x - 0.2, 1.75, COL_SPOT.z)
  root.add(lens)
  notInPhoto.push(lens)
  const faceU = { uTime: { value: 0 }, uTint: { value: new THREE.Color(GREEN) } }
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(LR, 72),
    new THREE.ShaderMaterial({
      uniforms: faceU,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform vec3 uTint; varying vec2 vUv;
        float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n2(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          // the night sky up there, a veil of the curtain's colour drifting through it
          float v = n2(vec2(p.x * 3.0 + uTime * 0.05, p.y * 0.8)) * 0.6 + n2(p * 6.0 - uTime * 0.08) * 0.4;
          vec3 c = mix(vec3(0.01, 0.02, 0.05), vec3(0.02, 0.05, 0.12), 1.0 - r) + uTint * v * 0.05;
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  lens.add(face)
  const rimMat = new THREE.MeshStandardMaterial({ color: '#b8e8cc', emissive: '#8fe0b0', emissiveIntensity: 0.45, roughness: 0.4 })
  const outerMat = new THREE.MeshStandardMaterial({ color: GREEN, emissive: GREEN, emissiveIntensity: 0.75, roughness: 0.4 })
  lens.add(new THREE.Mesh(new THREE.TorusGeometry(LR, 0.05, 10, 96), rimMat))
  lens.add(new THREE.Mesh(new THREE.TorusGeometry(LR + 0.12, 0.025, 8, 96), outerMat))
  const lensSign = {
    setRead(r) {
      outerMat.color.set(r ? GOLD : GREEN)
      outerMat.emissive.set(r ? GOLD : GREEN)
      outerMat.emissiveIntensity = r ? 0.45 : 0.75
    },
  }
  {
    const postH = LENS.y - LR - 0.05
    const post = new THREE.Mesh(new RoundedBoxGeometry(0.14, postH, 0.14, 2, 0.04), metal)
    post.position.set(LENS.x, postH / 2, LENS.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.08, 28), metal)
    foot.position.set(LENS.x, 0.04, LENS.z)
    root.add(post, foot)
    notInPhoto.push(post, foot)
    solids.push(circle(LENS.x, LENS.z, 0.55))
  }
  // a soft light in front of the glass, a metre off, so the atoms show their shape
  // (in the room, not the lens: hiding a light for the camera's photo would change every material's program)
  const lensLight = new THREE.PointLight('#eaf4ff', 1.6, 4, 1.4)
  lens.updateMatrixWorld()
  lensLight.position.copy(lens.localToWorld(V3(0, 0.3, 1.2)))
  root.add(lensLight)
  // the gauge beside the lens: the same ladder, small, coloured as the curtain is at each height
  const GX = LR + 0.42
  const GH = 2.3
  const yOfKm = k => -GH / 2 + ((k - KM0) / (KM1 - KM0)) * GH
  const kmOfY = y => clamp(KM0 + ((y + GH / 2) / GH) * (KM1 - KM0), KM0, KM1)
  const gaugeTex = canvasTex(32, 256, (g, w, h) => {
    const Y = k => h - ((k - KM0) / (KM1 - KM0)) * h
    const grd = g.createLinearGradient(0, h, 0, 0)
    const stop = (k, c) => grd.addColorStop((k - KM0) / (KM1 - KM0), c)
    stop(90, '#3a2a6a')
    stop(95, '#9a6bff')
    stop(99, '#9a6bff')
    stop(101, '#7dffb0')
    stop(140, '#4fe08f')
    stop(185, '#3a8a70')
    stop(215, '#c0405a')
    stop(260, '#a8304a')
    stop(300, '#3a1424')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = 'rgba(255,255,255,0.7)'
    for (let k = 100; k <= 300; k += 50) g.fillRect(0, Y(k) - 1, w, 2)
  })
  textures.push(gaugeTex)
  const gauge = new THREE.Mesh(new RoundedBoxGeometry(0.12, GH, 0.06, 2, 0.02), new THREE.MeshBasicMaterial({ map: gaugeTex, toneMapped: false }))
  gauge.position.set(GX, 0, 0)
  lens.add(gauge)
  const gaugeHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, GH + 0.2, 0.3), new THREE.MeshBasicMaterial({ visible: false }))
  gaugeHit.position.set(GX, 0, 0.05)
  lens.add(gaugeHit)
  const gaugeTags = []
  for (let k = 100; k <= 300; k += 50) {
    const t = label(`${k} km`, 0.075, '#dbe8ff', { anchorX: 'left', outlineWidth: 0.008, outlineColor: '#06101e' })
    t.position.set(GX + 0.12, yOfKm(k), 0.03)
    lens.add(t)
    gaugeTags.push(t)
  }
  const marker = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.13, 3), new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 1.3), toneMapped: false }))
  marker.rotation.z = -Math.PI / 2
  lens.add(marker)
  // the atoms in the lens: oxygen red, nitrogen blue, each kind one draw call
  const NMAX = 90
  const ball = new THREE.SphereGeometry(1, 16, 12)
  const oMesh = new THREE.InstancedMesh(ball, new THREE.MeshStandardMaterial({ color: O_COL, emissive: '#5a1010', emissiveIntensity: 0.9, roughness: 0.4 }), NMAX)
  const nMesh = new THREE.InstancedMesh(ball, new THREE.MeshStandardMaterial({ color: N_COL, emissive: '#142a6a', emissiveIntensity: 0.9, roughness: 0.4 }), NMAX)
  for (const m of [oMesh, nMesh]) {
    m.frustumCulled = false
    m.count = 0
    m.raycast = () => {}
    lens.add(m)
  }
  // the struck atom in the middle, its two levels as rings (green above, red below), as the picture draws it
  const ATOM = V3(0, -0.05, 0.12)
  const ringOf = (r, c) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.016, 8, 64), new THREE.MeshBasicMaterial({ color: hdr(c, 1.4), transparent: true, opacity: 0.18, depthWrite: false, toneMapped: false }))
    m.position.copy(ATOM)
    m.raycast = () => {}
    lens.add(m)
    return m
  }
  const greenRing = ringOf(0.42, '#bfffd6')
  const redRing = ringOf(0.29, '#ffb0b8')
  const RING_G = hdr('#bfffd6', 1.4)
  const RING_R = hdr('#ffb0b8', 1.4)
  const FLASH_G = hdr(GREEN, 2.2)
  const FLASH_R = hdr(RED, 2.2)
  const atomGlow = glowSprite('#ffffff', 0.9, 0)
  atomGlow.position.copy(ATOM)
  lens.add(atomGlow)
  // the electron and its dotted trail, the photon given off, the molecule that bumps
  const electron = glowSprite('#fff4c0', 0.22, 0)
  lens.add(electron)
  const TRAIL = 7
  const trail = Array.from({ length: TRAIL }, () => {
    const s = glowSprite('#fff4c0', 0.07, 0)
    lens.add(s)
    return s
  })
  const waveGeo = (() => {
    const pts = []
    for (let i = 0; i <= 48; i++) {
      const k = i / 48
      pts.push(V3(k * 0.6, Math.sin(k * 7 * Math.PI) * 0.05, 0))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, 0.013, 5, false)
  })()
  const photonMat = new THREE.MeshBasicMaterial({ color: hdr(GREEN, 1.6), transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
  const photon = new THREE.Mesh(waveGeo, photonMat)
  photon.raycast = () => {}
  lens.add(photon)
  const photonTag = label('', 0.1, '#ffffff', { outlineWidth: 0.01, outlineColor: '#06101e' })
  lens.add(photonTag)
  // the words on the lens: the height (above), the state (below the atom), the Scientist's clock, the tally
  const heightTag = label('', 0.15, hdr(GREEN, 1.1), { outlineWidth: 0.012, outlineColor: '#04101c' })
  heightTag.position.set(0, LR + 0.25, 0.03)
  const status = label('', 0.1, '#ffffff', { outlineWidth: 0.01, outlineColor: '#04101c', maxWidth: 1.8 })
  status.position.set(0, -0.62, 0.15)
  const clockTag = label('', 0.075, '#dbe8ff', { outlineWidth: 0.008, outlineColor: '#04101c' })
  clockTag.position.set(0, -0.8, 0.15)
  const tally = label('', 0.085, '#e8fff0', { outlineWidth: 0.008, outlineColor: '#04101c' })
  tally.position.set(0, -LR - 0.2, 0.16)
  lens.add(heightTag, status, clockTag, tally)
  // the cone of light from the chosen height in the sky to the lens
  const CONE = 40
  const conePos = new Float32Array((CONE + 1) * 3)
  const coneGeo = new THREE.BufferGeometry()
  coneGeo.setAttribute('position', new THREE.BufferAttribute(conePos, 3))
  const coneIdx = []
  for (let i = 0; i < CONE; i++) coneIdx.push(0, 1 + i, 1 + ((i + 1) % CONE))
  coneGeo.setIndex(coneIdx)
  const coneMat = new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
  const cone = new THREE.Mesh(coneGeo, coneMat)
  cone.frustumCulled = false
  cone.raycast = () => {}
  root.add(cone)
  notInPhoto.push(cone)
  lens.updateMatrixWorld()
  {
    for (let i = 0; i < CONE; i++) {
      const a = (i / CONE) * TAU
      conePos.set(V3(Math.cos(a) * LR, Math.sin(a) * LR, 0).applyMatrix4(lens.matrixWorld).toArray(), 3 + i * 3)
    }
  }
  /** The colour the curtain has at height k (km). */
  const zoneColor = k => (k < 100 ? VIOLET : k < 165 ? GREEN : k < 205 ? '#d9b07a' : RED)
  /** Seconds written for the Scientist: thousandths for a bump down low, tenths below 10 s, whole above. */
  const secs = s => (s < 0.1 ? num(s, 3, lang) : s < 10 ? num(s, 1, lang) : String(Math.round(s)))

  // the colours' state: the height chosen, the tries, the tally
  const B = { n: 0, h: 120, start: -99, mine: false, said: true, resolved: true, g: 0, r: 0, b: 0, nit: 0, sound: 0 }
  let tryNow = tryOf(0, 120)
  const bAge = () => clock() - B.start
  // when the try's outcome is in (the light given, or the bump); a new try may start a moment after it
  const bDone = () => (tryNow.kind === 'n2' ? T_E + 0.3 : T_E + tryNow.tg + tryNow.tw)
  const bBusy = () => B.n > 0 && bAge() < bDone() + 1.0
  const bPhase = () => {
    if (!B.n || bAge() >= tryNow.end) return 'ready'
    const a = bAge()
    const T = tryNow
    if (a < T_E) return 'electron'
    if (T.kind === 'n2') return 'nitrogen'
    if (a < T_E + T.tg) return 'lifted'
    if (a < T_E + T.tg + T.tw) return 'waiting'
    return T.red ? 'red' : 'bumped'
  }
  // the molecules: their kinds and places at this height (the same for everyone), drifting about
  const MOL = 40
  const mol = Array.from({ length: MOL }, () => ({ kind: 0, x: 0, y: 0, vx: 0, vy: 0, a: 0, w: 0 }))
  let molH = -1
  const placeMolecules = h => {
    if (Math.round(h) === molH) return
    molH = Math.round(h)
    const rnd = random(molH * 101 + 5)
    const count = Math.min(MOL, crowd(h))
    const fo = shareO(h)
    mol.forEach((m, i) => {
      if (i >= count) {
        m.kind = 0
        return
      }
      const v = rnd()
      m.kind = v < fo ? 3 : v < fo + (1 - fo) * 0.22 ? 2 : 1
      let x
      let y
      do {
        x = (rnd() * 2 - 1) * (LR - 0.15)
        y = (rnd() * 2 - 1) * (LR - 0.15)
      } while (Math.hypot(x, y) > LR - 0.15 || Math.hypot(x - ATOM.x, y - ATOM.y) < 0.5)
      m.x = x
      m.y = y
      const sp = 0.05 + rnd() * 0.08
      const d = rnd() * TAU
      m.vx = Math.cos(d) * sp
      m.vy = Math.sin(d) * sp
      m.a = rnd() * TAU
      m.w = (rnd() - 0.5) * 1.2
    })
  }
  const RA = 0.055 // an atom's size in the lens
  const tmpM = new THREE.Object3D()
  let on = 0
  let nn = 0
  const putAtom = (x, y, z, isO, s = 1) => {
    const mesh = isO ? oMesh : nMesh
    const i = isO ? on++ : nn++
    if (i >= NMAX) return
    tmpM.position.set(x, y, z)
    tmpM.scale.setScalar(RA * s)
    tmpM.updateMatrix()
    mesh.setMatrixAt(i, tmpM.matrix)
  }
  const putMolecule = (kind, x, y, a, s = 1) => {
    if (kind === 3) return putAtom(x, y, 0.1, true, s)
    const dx = Math.cos(a) * RA * 0.95 * s
    const dy = Math.sin(a) * RA * 0.95 * s
    putAtom(x - dx, y - dy, 0.1, kind === 2, s)
    putAtom(x + dx, y + dy, 0.1, kind === 2, s)
  }
  const setHeight = (h, own) => {
    B.h = Math.round(clamp(h, KM0, KM1))
    if (own) B.mine = true
    placeMolecules(B.h)
  }
  let sliding = { gust: false, colours: false, camera: false }
  const slid = id => {
    if (sliding[id]) return
    sliding[id] = true
    later(0.25, () => {
      sliding[id] = false
      share(id)
    })
  }
  const coloursPanel = lv => ({
    title: E.colours.title,
    color: GREEN,
    blocks: [
      {
        slider: {
          label: E.colours.slider,
          min: KM0,
          max: KM1,
          step: 1,
          value: B.h,
          onInput: v => {
            setHeight(v, true)
            slid('colours')
          },
          format: v => fill(E.colours.height, { h: Math.round(v) }),
          live: () => B.h,
        },
      },
      { buttons: [{ label: E.colours.verbs.send, onClick: () => colourStep('lens') }] },
      ...paras(E.colours.panel, lv),
      { rows: [[E.colours.tally.green, String(B.g)], [E.colours.tally.red, String(B.r)], [E.colours.tally.bumped, String(B.b)], [E.colours.tally.nitrogen, String(B.nit)]] },
      ...(lv === 'scientist' ? [{ rows: E.colours.rows }] : []),
    ],
  })
  const startTry = (n, h, a) => {
    B.n = n
    B.h = Math.round(clamp(h, KM0, KM1))
    placeMolecules(B.h)
    tryNow = tryOf(n, B.h)
    B.start = clock() - a
    B.resolved = a >= bDone()
    B.said = a > 0.2
    B.sound = a > 0.2 ? 9 : 0
  }
  /** A tap: 'sky' or 'gauge' (with a height in km) picks the height and sends an electron there; 'lens' sends
   *  one at the height chosen. */
  function colourStep(thing, h) {
    const lv = level()
    if (bBusy()) {
      say(at(W.busy, lv))
      return false
    }
    B.mine = true
    startTry(B.n + 1, thing === 'lens' || h == null ? B.h : h, 0)
    play('electron')
    share('colours')
    refresh(coloursPanel)
    return true
  }
  ex.add({
    id: 'colours',
    x: COL_SPOT.x,
    z: COL_SPOT.z,
    radius: 1.9,
    label: E.colours.label,
    verb: () => {
      const H = E.colours.hints
      if (bBusy()) return H.watch
      if (!B.n) return H.sky
      if (!B.r) return H.high
      if (!B.nit) return H.low
      return H.again
    },
    manual: true,
    screens: [lensSign],
    focus: { x: LENS.x + 0.3, y: LENS.y, z: LENS.z, size: 2.6, width: 3.4 },
    act: () => ctx.showPanel(coloursPanel),
  })
  const nearLens = () => near(COL_SPOT, 8)
  clickable(skyHit, hit => colourStep('sky', hit.point.y / KM), { when: nearLens, reach: 1400, accept: h => h.point.y > KM0 * KM - 2 * LS && h.point.y < KM1 * KM + 2 * LS })
  clickable(gaugeHit, hit => colourStep('gauge', kmOfY(lens.worldToLocal(hit.point.clone()).y)), { reach: 5.5 })
  const lensHit = new THREE.Mesh(new THREE.CircleGeometry(LR, 32), new THREE.MeshBasicMaterial({ visible: false }))
  lensHit.position.z = 0.25
  lens.add(lensHit)
  clickable(lensHit, () => colourStep('lens'), { reach: 6 })
  const bumper = { x: 0, y: 0 }
  const N2_GLOW = V3(-0.42, 0.28, 0.1)
  updates.push((dt, t) => {
    faceU.uTime.value = t
    const lv = level()
    const sci = lv === 'scientist'
    const ph = bPhase()
    const a = bAge()
    const T = tryNow
    const zc = zoneColor(B.h)
    faceU.uTint.value.set(zc)
    coneMat.color.set(zc)
    // the chosen height: on the gauge, on the ladder, the cone's tip
    marker.position.set(GX - 0.15, yOfKm(B.h), 0.05)
    skyRing.position.set(0, B.h * KM, LS)
    skyFlash.position.set(0, B.h * KM, 2 * LS)
    ladder.updateMatrixWorld()
    const tip = skyRing.getWorldPosition(new THREE.Vector3())
    conePos.set(tip.toArray(), 0)
    coneGeo.attributes.position.needsUpdate = true
    // the molecules drift (kept out of the middle, where the struck atom is)
    on = 0
    nn = 0
    for (const m of mol) {
      if (!m.kind) continue
      m.x += m.vx * dt
      m.y += m.vy * dt
      m.a += m.w * dt
      const r = Math.hypot(m.x, m.y)
      if (r > LR - 0.13) {
        m.vx -= (2 * (m.vx * m.x + m.vy * m.y) * m.x) / (r * r)
        m.vy -= (2 * (m.vx * m.x + m.vy * m.y) * m.y) / (r * r)
        m.x *= (LR - 0.14) / r
        m.y *= (LR - 0.14) / r
      }
      const dx = m.x - ATOM.x
      const dy = m.y - ATOM.y
      const d = Math.hypot(dx, dy)
      if (d < 0.5) {
        m.x = ATOM.x + (dx / d) * 0.5
        m.y = ATOM.y + (dy / d) * 0.5
        m.vx = Math.abs(m.vx) * Math.sign(dx)
        m.vy = Math.abs(m.vy) * Math.sign(dy)
      }
      putMolecule(m.kind, m.x, m.y, m.a)
    }
    // the struck oxygen atom
    putAtom(ATOM.x, ATOM.y, ATOM.z, true, 2.1)
    // the step's look: the electron's flight, the levels lit, the light given off, the bump
    let gOn = 0.18
    let rOn = 0.18
    let gFlash = 0
    let rFlash = 0
    let glowC = null
    let glowK = 0
    let say1 = ''
    let clock1 = ''
    photonMat.opacity = 0
    photonTag.visible = false
    skyFlash.material.opacity = Math.max(0, skyFlash.material.opacity - dt * 1.2)
    electron.material.opacity = 0
    trail.forEach(s => (s.material.opacity = 0))
    const to = T.kind === 'n2' ? N2_GLOW : ATOM
    if (ph === 'electron') {
      const k = a / T_E
      const from = V3(0.95, 0.95, 0.15)
      const p = from.clone().lerp(to, ease(k))
      electron.position.copy(p).setZ(0.16)
      electron.material.opacity = 1
      trail.forEach((s, i) => {
        s.position.copy(from.clone().lerp(to, ease(Math.max(0, k - (i + 1) * 0.06)))).setZ(0.15)
        s.material.opacity = 0.7 * (1 - i / TRAIL) * (k > (i + 1) * 0.06 ? 1 : 0)
      })
    }
    const emit = (c, u, text) => {
      // the photon flies out toward the lower left, staying inside the lens; its colour's name above the atom
      const k = Math.min(1.2, u)
      photonMat.color.copy(hdr(c, 1.6))
      photonMat.opacity = 1 - span(0.9, 1.7, u)
      photon.position.copy(to).add(V3(-0.1 - k * 0.42, -0.05 - k * 0.22, 0.08))
      photon.rotation.z = Math.PI + 0.45
      photonTag.visible = u < 2.8
      photonTag.position.set(0, 0.62, 0.16)
      photonTag.color = hdr(c, 1.15)
      setText(photonTag, text)
      // fill and outline fade together (an outline left alone reads as black text)
      photonTag.fillOpacity = photonTag.outlineOpacity = 1 - span(1.8, 2.8, u)
    }
    if (B.n > 0 && T.kind === 'n2' && a >= T_E) {
      const u = a - T_E
      glowC = VIOLET
      glowK = 1 - span(0.6, 2.2, u)
      emit(VIOLET, u, E.colours.signs.violetLine)
      if (u < 2.6) say1 = at(E.colours.signs.nitrogen, lv)
    } else if (B.n > 0 && T.kind === 'o' && a >= T_E) {
      const tG = T_E + T.tg
      const tR = tG + T.tw
      if (a < tG) {
        gOn = 1
        glowC = '#ffffff'
        glowK = 0.5 + Math.sin(t * 20) * 0.15
        say1 = at(E.colours.signs.lifted, lv)
      } else if (a < tR) {
        const u = a - tG
        rOn = 0.65 + Math.sin(t * 5) * 0.25
        gOn = 0.18 + 0.82 * (1 - span(0.4, 1.4, u))
        gFlash = 1 - span(0.4, 1.4, u)
        glowC = GREEN
        glowK = 1 - span(0.3, 1.6, u)
        if (u < 2.8) emit(GREEN, u, E.colours.signs.greenLine)
        say1 = at(E.colours.signs.wait, lv)
        const real = (u / T.tw) * T.tReal
        clock1 = sci ? fill(E.colours.signs.clock, { t: secs(real) }) : E.colours.signs.fast
        // the molecule on its way to bump it
        if (!T.red) {
          const k = span(Math.max(0, T.tw - 0.8), T.tw, u)
          bumper.x = lerp(-0.95, ATOM.x - 0.17, k)
          bumper.y = lerp(-0.55, ATOM.y - 0.08, k)
          if (k > 0) putMolecule(1, bumper.x, bumper.y, 0.6 + t)
        }
      } else {
        const u = a - tR
        const real = T.tReal
        clock1 = sci ? fill(T.red ? E.colours.signs.after : E.colours.signs.bumpedAfter, { t: secs(real) }) : ''
        if (T.red) {
          glowC = RED
          glowK = 1 - span(0.6, 2.4, u)
          rOn = 1 - 0.8 * span(0.6, 2.0, u)
          rFlash = 1 - span(0.6, 2.0, u)
          emit(RED, u, E.colours.signs.redLine)
          say1 = at(E.colours.signs.red, lv)
        } else {
          // bumped: the molecule leaves faster, carrying the energy off
          putMolecule(1, ATOM.x - 0.17 - u * 0.9, ATOM.y - 0.08 + u * 0.55, 0.6 + t * 4)
          say1 = at(E.colours.signs.bumped, lv)
          glowC = '#ffffff'
          glowK = 0.35 * (1 - span(0, 0.4, u))
        }
      }
    }
    // the levels as rings: lit while the atom is on them, flashing their colour as it gives its light
    greenRing.material.opacity = gOn
    redRing.material.opacity = rOn
    greenRing.material.color.copy(RING_G).lerp(FLASH_G, gFlash)
    redRing.material.color.copy(RING_R).lerp(FLASH_R, rFlash)
    atomGlow.material.opacity = glowK
    if (glowC) atomGlow.material.color.set(glowC)
    atomGlow.scale.setScalar(0.5 + glowK * 0.9)
    if (T.kind === 'n2' && B.n > 0 && a >= T_E && a < T.end) {
      // the nitrogen molecule glowing
      putMolecule(1, N2_GLOW.x, N2_GLOW.y, 0.4, 1.4)
      atomGlow.position.copy(N2_GLOW)
    } else atomGlow.position.copy(ATOM)
    oMesh.count = Math.min(NMAX, on)
    nMesh.count = Math.min(NMAX, nn)
    oMesh.instanceMatrix.needsUpdate = true
    nMesh.instanceMatrix.needsUpdate = true
    // the sky ring flashes with the colour the atom gives
    ringMat.color.copy(hdr(zc, 1.3))
    ringMat.opacity = 0.55 + Math.sin(t * 3) * 0.2
    if (glowC && glowC !== '#ffffff' && glowK > 0.6) {
      skyFlash.material.color.set(glowC)
      skyFlash.material.opacity = Math.max(skyFlash.material.opacity, glowK * 0.9)
    }
    status.visible = !!say1
    if (say1) setText(status, say1)
    clockTag.visible = !!clock1
    if (clock1) setText(clockTag, clock1)
    setText(heightTag, fill(at(E.colours.signs.height, lv), { h: B.h }))
    setText(tally, fill(E.colours.signs.tally, { g: B.g, r: B.r, b: B.b }))
    // the try's end: counted, told
    if (B.n > 0) {
      if (B.sound < 1 && a >= T_E) {
        B.sound = 1
        play(T.kind === 'n2' ? 'pop' : 'join', { order: 2 })
      }
      if (T.kind === 'o' && B.sound < 2 && a >= T_E + T.tg) {
        B.sound = 2
        play('select')
      }
      const done = T.kind === 'n2' ? T_E + 0.3 : T_E + T.tg + T.tw
      if (!B.resolved && a >= done) {
        B.resolved = true
        if (T.kind === 'n2') B.nit++
        else {
          B.g++
          if (T.red) B.r++
          else B.b++
        }
        if (T.kind === 'o') play(T.red ? 'discover' : 'part')
        if (B.mine && !B.said) {
          B.said = true
          const S = E.colours.says
          say(fill(at(T.kind === 'n2' ? S.nitrogen : T.red ? S.red : B.h < 165 ? S.low : S.middle, lv), { h: B.h, t: secs(T.tReal ?? 0) }), zc)
          ex.discover('colours', coloursPanel, 2.5)
        }
        refresh(coloursPanel)
      }
    }
  })
  relabels.push(lv => setText(ladTitle, at(E.colours.signs.ladder, lv)))

  // ================= seeing it: the camera, its photo, the fox =================
  const camAim = V3(100, 400, -900)
  const tripod = new THREE.Group()
  tripod.position.set(TRIPOD.x, 0, TRIPOD.z)
  root.add(tripod)
  const HEAD = 1.42
  {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU + 0.4
      const foot = V3(Math.cos(a) * 0.42, 0, Math.sin(a) * 0.42)
      const top = V3(0, HEAD - 0.08, 0)
      const len = foot.distanceTo(top)
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.02, len, 6), metal)
      leg.position.copy(foot).add(top).multiplyScalar(0.5)
      leg.quaternion.setFromUnitVectors(UP, top.clone().sub(foot).normalize())
      tripod.add(leg)
    }
    solids.push(circle(TRIPOD.x, TRIPOD.z, 0.4))
  }
  const camBody = new THREE.Group()
  camBody.position.set(0, HEAD, 0)
  tripod.add(camBody)
  camBody.lookAt(camAim)
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.14, 0.11, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#202630', roughness: 0.5, metalness: 0.3 }))
    const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 20).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#141820', roughness: 0.4, metalness: 0.5 }))
    lensBarrel.position.z = 0.11
    camBody.add(body, lensBarrel)
  }
  // the light that shows the shutter is open
  const shutterLed = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: hdr('#ff3a3a', 2), toneMapped: false }))
  shutterLed.position.set(0.07, 0.05, -0.057)
  camBody.add(shutterLed)
  const camHit = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  camHit.position.set(TRIPOD.x, HEAD - 0.1, TRIPOD.z)
  root.add(camHit)
  const camBack = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.1), null)
  camBack.position.set(0, 0.005, -0.058)
  camBack.rotation.y = Math.PI
  camBody.add(camBack)
  notInPhoto.push(camBody)
  // the photo: the camp drawn from the tripod several times across the exposure, added up (HDR)
  const PW = light ? 384 : 576
  const PH = Math.round(PW / 1.5)
  const rtSub = new THREE.WebGLRenderTarget(PW, PH, { type: THREE.HalfFloatType })
  const rtSum = new THREE.WebGLRenderTarget(PW, PH, { type: THREE.HalfFloatType, depthBuffer: false })
  const rtEye = new THREE.WebGLRenderTarget(PW, PH, { type: THREE.HalfFloatType, depthBuffer: false })
  disposers.push(() => [rtSub, rtSum, rtEye].forEach(r => r.dispose()))
  const photoCam = new THREE.PerspectiveCamera(64, 1.5, 0.1, 3600)
  camBody.updateMatrixWorld()
  camBody.getWorldPosition(photoCam.position)
  photoCam.position.y += 0.02
  photoCam.lookAt(camAim)
  photoCam.updateMatrixWorld()
  const quadMat = new THREE.ShaderMaterial({
    uniforms: { uTex: { value: null }, uW: { value: 1 } },
    depthTest: false,
    depthWrite: false,
    vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */ `uniform sampler2D uTex; uniform float uW; varying vec2 vUv; void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb * uW, 1.0); }`,
  })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), quadMat)
  quad.frustumCulled = false
  const quadScene = new THREE.Scene()
  quadScene.add(quad)
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  disposers.push(() => {
    quad.geometry.dispose()
    quadMat.dispose()
  })
  // the screen: the eye's view and the camera's, side by side
  const camSign = standingScreen({ width: 2.0, height: 0.98, color: CAM_C, title: E.camera.label, line: '', titleSize: 0.1 }, { top: 1.42, tilt: 0.12, mat: metal })
  camSign.group.position.set(SCREEN_AT.x, 0, SCREEN_AT.z)
  camSign.group.rotation.y = Math.atan2(CAM_SPOT.x - SCREEN_AT.x, CAM_SPOT.z - SCREEN_AT.z)
  root.add(camSign.group)
  solids.push(circle(SCREEN_AT.x, SCREEN_AT.z, 0.35))
  const photoShader = eye =>
    new THREE.ShaderMaterial({
      uniforms: { uTex: { value: rtSum.texture }, uGain: { value: 0 }, uEye: { value: eye ? 1 : 0 }, uDev: { value: 0 } },
      toneMapped: false,
      vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex; uniform float uGain; uniform float uEye; uniform float uDev; varying vec2 vUv;
        void main() {
          vec3 c = max(texture2D(uTex, vUv).rgb, 0.0);
          vec3 o;
          if (uEye > 0.5) {
            // the eye at night: the rods' light (blue-green, hardly any red), colour only where it is bright
            float s = dot(c, vec3(0.015, 0.62, 0.36));
            float l = 1.0 - exp(-uGain * s);
            vec3 hue = c / max(max(c.r, max(c.g, c.b)), 1e-4);
            float sat = smoothstep(0.3, 0.75, l) * 0.5;
            o = mix(vec3(l) * vec3(0.84, 0.92, 1.0), hue * l, sat);
          } else {
            o = 1.0 - exp(-uGain * c);
            float y = dot(o, vec3(0.2126, 0.7152, 0.0722));
            o = max(mix(vec3(y), o, 1.15), 0.0);
          }
          gl_FragColor = vec4(o * 0.82 * uDev, 1.0);
          #include <colorspace_fragment>
        }`,
    })
  const eyeMat = photoShader(true)
  eyeMat.uniforms.uTex.value = rtEye.texture
  const camMat = photoShader(false)
  const IW = 0.9
  const IH = IW / 1.5
  const eyePic = new THREE.Mesh(new THREE.PlaneGeometry(IW, IH), eyeMat)
  const camPic = new THREE.Mesh(new THREE.PlaneGeometry(IW, IH), camMat)
  eyePic.position.set(-0.48, -0.06, 0.003)
  camPic.position.set(0.48, -0.06, 0.003)
  camSign.content.add(eyePic, camPic)
  camBack.material = camMat
  notInPhoto.push(camSign.group)
  const eyeTag = label('', 0.06, '#dbe8ff')
  const camTag = label('', 0.06, '#dbe8ff')
  eyeTag.position.set(-0.48, -0.06 - IH / 2 - 0.05, 0.004)
  camTag.position.set(0.48, -0.06 - IH / 2 - 0.05, 0.004)
  camSign.content.add(eyeTag, camTag)
  const expText = e => (e < 0.9 ? `1/${Math.round(1 / e)} s` : e < 3 ? `${num(e, 1, lang)} s` : `${Math.round(e)} s`)
  // the camera's state: the photos taken, the exposure; and the fox's runs
  const P = { n: 0, x: xOfExp(4), exp: 4, start: -99, mine: false, said: true, k: 0, N: light ? 4 : 7, t0: 0, dev: 0, shot: 0 }
  const F = { n: 0, start: -99, mine: false }
  const pAge = () => clock() - P.start
  const capturing = () => P.n > 0 && (P.shot !== P.n || P.k < P.N)
  const camPanel = lv => ({
    title: E.camera.title,
    color: CAM_C,
    blocks: [
      {
        slider: {
          label: E.camera.slider,
          min: 0,
          max: 1,
          step: 0.01,
          value: P.x,
          onInput: v => {
            setExposure(v, true)
            slid('camera')
          },
          format: v => expText(expOf(v)),
          live: () => P.x,
        },
      },
      { buttons: [{ label: E.camera.verbs.shoot, onClick: () => photoStep() }, { label: E.camera.verbs.fox, onClick: () => foxStep() }] },
      ...paras(E.camera.panel, lv),
      ...(lv === 'scientist' ? [{ rows: E.camera.rows }] : []),
    ],
  })
  let reshoot = null
  function setExposure(x, own) {
    P.x = clamp(Number(x) || 0)
    P.exp = expOf(P.x)
    if (own) {
      P.mine = true
      // a new exposure: the camera takes a new photo once the slider rests
      if (reshoot) reshoot.cancel = true
      const r = { cancel: false }
      reshoot = r
      later(0.45, () => !r.cancel && !capturing() && photoStep(true))
    }
  }
  /** A tap on the camera: a long exposure. */
  function photoStep(quiet = false) {
    if (capturing()) {
      if (!quiet) say(at(W.busy, level()))
      return false
    }
    P.mine = true
    P.said = false
    P.n++
    P.start = clock()
    if (!quiet) play('tap')
    share('camera')
    return true
  }
  /** Draw the next part of the photo: one moment of the exposure, added to the sum. */
  const renderPart = () => {
    const r = ctx.renderer
    if (!r) return
    if (P.shot !== P.n) {
      P.shot = P.n
      P.k = 0
      P.t0 = stage.aurora.time.value
      P.dev = 0
    }
    const old = r.getRenderTarget()
    const oldAuto = r.autoClear
    const oldColor = r.getClearColor(new THREE.Color())
    const oldAlpha = r.getClearAlpha()
    const hidden = notInPhoto.filter(o => o.visible)
    hidden.forEach(o => (o.visible = false))
    const tNow = stage.aurora.time.value
    try {
      stage.aurora.time.value = P.t0 + ((P.k + 0.5) / P.N - 0.5) * P.exp
      r.autoClear = true
      r.setRenderTarget(rtSub)
      r.render(ctx.scene, photoCam)
      r.setClearColor(0x000000, 1)
      r.autoClear = false
      if (P.k === 0) {
        r.setRenderTarget(rtSum)
        r.clear()
      }
      quadMat.uniforms.uTex.value = rtSub.texture
      quadMat.blending = THREE.AdditiveBlending
      quadMat.transparent = true
      quadMat.uniforms.uW.value = 1 / P.N
      r.setRenderTarget(rtSum)
      r.render(quadScene, quadCam)
      if (P.k === Math.floor(P.N / 2)) {
        quadMat.blending = THREE.NoBlending
        quadMat.transparent = false
        quadMat.uniforms.uW.value = 1
        r.setRenderTarget(rtEye)
        r.render(quadScene, quadCam)
      }
    } finally {
      stage.aurora.time.value = tNow
      hidden.forEach(o => (o.visible = true))
      r.setRenderTarget(old)
      r.autoClear = oldAuto
      r.setClearColor(oldColor, oldAlpha)
    }
    P.k++
  }
  ex.add({
    id: 'camera',
    x: CAM_SPOT.x,
    z: CAM_SPOT.z,
    radius: 1.9,
    label: E.camera.label,
    verb: () => {
      const H = E.camera.hints
      if (capturing()) return H.open
      if (!P.n) return H.shoot
      if (!F.n) return H.fox
      return H.again
    },
    manual: true,
    screens: [camSign],
    focus: (() => {
      // the screen, where the photo is (the tripod beside it)
      return { x: SCREEN_AT.x, y: 1.42, z: SCREEN_AT.z, size: 1.3, width: 2.4 }
    })(),
    act: () => ctx.showPanel(camPanel),
  })
  clickable(camHit, () => photoStep(), { reach: 5 })
  updates.push((dt, t) => {
    const lv = level()
    // one moment of the exposure a frame, so the photo builds up as the shutter stays open
    if (P.n > 0 && capturing()) {
      if (P.shot !== P.n || P.k < P.N) renderPart()
      if (P.k >= P.N && !P.said) {
        P.said = true
        if (P.mine) {
          play('select')
          say(at(P.exp >= 15 ? E.camera.says.long : P.exp <= 0.26 ? E.camera.says.short : E.camera.says.photo, lv), CAM_C)
          ex.discover('camera', camPanel, 3.0)
        }
        refresh(camPanel)
      }
    }
    P.dev = damp(P.dev, P.n > 0 && P.k >= P.N ? 1 : P.n > 0 ? 0.35 : 0, 4, dt)
    camMat.uniforms.uGain.value = GAIN * P.exp
    eyeMat.uniforms.uGain.value = GAIN * 1.6
    camMat.uniforms.uDev.value = P.dev
    eyeMat.uniforms.uDev.value = P.dev
    shutterLed.visible = capturing() && Math.sin(t * 12) > -0.2
    setText(camTag, fill(at(E.camera.signs.cam, lv), { t: expText(P.exp) }))
  })
  relabels.push(lv => {
    setText(eyeTag, at(E.camera.signs.eye, lv))
    camSign.set({ line: '' })
  })

  // the white fox by its birch: tap it and it runs over the snow, its tail flinging sparks into the sky
  const fox = new THREE.Group()
  root.add(fox)
  const furMat = new THREE.MeshStandardMaterial({ color: '#eef2f7', roughness: 0.85 })
  const darkFur = new THREE.MeshStandardMaterial({ color: '#1a1a22', roughness: 0.6 })
  const foxBody = new THREE.Group()
  fox.add(foxBody)
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), furMat)
  body.scale.set(0.15, 0.13, 0.27)
  body.position.set(0, 0.32, 0)
  const head = new THREE.Group()
  head.position.set(0, 0.45, 0.27)
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), furMat)
  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.13, 10).rotateX(Math.PI / 2), furMat)
  snout.position.set(0, -0.02, 0.1)
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 5), darkFur)
  nose.position.set(0, -0.02, 0.17)
  head.add(skull, snout, nose)
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 6), furMat)
    ear.position.set(s * 0.055, 0.1, -0.01)
    ear.rotation.z = -s * 0.25
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 5), darkFur)
    eye.position.set(s * 0.04, 0.02, 0.085)
    head.add(ear, eye)
  }
  const legs = [[-0.07, 0.17], [0.07, 0.17], [-0.07, -0.17], [0.07, -0.17]].map(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.24, 6).translate(0, -0.12, 0), furMat)
    leg.position.set(x, 0.26, z)
    foxBody.add(leg)
    return leg
  })
  // the bushy tail: puffs growing then thinning toward its tip
  const tail = new THREE.Group()
  tail.position.set(0, 0.36, -0.25)
  const TAILN = 6
  for (let i = 0; i < TAILN; i++) {
    const k = i / (TAILN - 1)
    const puff = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), furMat)
    puff.scale.setScalar(0.05 + 0.05 * Math.sin(Math.PI * (0.2 + 0.7 * k)))
    puff.position.set(0, -k * 0.08, -k * 0.34)
    tail.add(puff)
  }
  const tailTip = new THREE.Object3D()
  tailTip.position.set(0, -0.08, -0.4)
  tail.add(tailTip)
  foxBody.add(body, head, tail)
  const foxHit = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), new THREE.MeshBasicMaterial({ visible: false }))
  foxHit.position.set(0, 0.35, 0)
  fox.add(foxHit)
  const foxSeat = { x: FOX.x, z: FOX.z, yaw: Math.atan2(CAM_SPOT.x - FOX.x, CAM_SPOT.z - FOX.z) }
  const foxPath = new THREE.CatmullRomCurve3([V3(FOX.x, 0, FOX.z), V3(11.5, 0, -11), V3(12, 0, -19), V3(6, 0, -30), V3(-8, 0, -42), V3(-30, 0, -50), V3(-55, 0, -52)])
  const foxSign = label('', 0.13, hdr('#bfffd6', 1.1), { outlineWidth: 0.012, outlineColor: '#04101c' })
  foxSign.position.set(FOX.x, 1.25, FOX.z)
  root.add(foxSign)
  facing.push(foxSign)
  relabels.push(lv => setText(foxSign, at(E.camera.signs.fox, lv)))
  // the sparks
  const SPK = light ? 140 : 320
  const spkPos = new Float32Array(SPK * 3)
  const spkCol = new Float32Array(SPK * 3)
  const spk = Array.from({ length: SPK }, () => ({ life: 0, x: 0, y: -99, z: 0, vx: 0, vy: 0, vz: 0, c: 0 }))
  const spkGeo = new THREE.BufferGeometry()
  spkGeo.setAttribute('position', new THREE.BufferAttribute(spkPos, 3))
  spkGeo.setAttribute('color', new THREE.BufferAttribute(spkCol, 3))
  const sparks = new THREE.Points(spkGeo, new THREE.PointsMaterial({ size: 0.5, map: glow, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  sparks.frustumCulled = false
  sparks.raycast = () => {}
  root.add(sparks)
  let spkNext = 0
  const spkRnd = random(911)
  const SPARK_C = [new THREE.Color('#9dffc8'), new THREE.Color('#e8fff2'), new THREE.Color('#ff8aa8')]
  const fAge = () => clock() - F.start
  const foxRunning = () => F.n > 0 && fAge() < FOX_BACK
  /** A tap on the fox: it runs, and the Atomling tells its tale. */
  function foxStep() {
    const lv = level()
    if (foxRunning()) {
      say(at(W.busy, lv))
      return false
    }
    F.n++
    F.start = clock()
    F.mine = true
    play('celebrate')
    say(at(E.camera.says.fox, lv), GREEN)
    share('fox')
    return true
  }
  clickable(foxHit, () => foxStep(), { when: () => !foxRunning(), reach: 10 })
  updates.push((dt, t) => {
    const a = fAge()
    const run = F.n > 0 && a < FOX_RUN
    let k = 0
    if (run) {
      const u = a / FOX_RUN
      const p = foxPath.getPointAt(ease(u) * 0.35 + u * 0.65)
      const tan = foxPath.getTangentAt(Math.min(0.999, ease(u) * 0.35 + u * 0.65))
      const bound = Math.abs(Math.sin(a * 9))
      fox.position.set(p.x, stage.groundAt(p.x, p.z) + bound * 0.12, p.z)
      fox.rotation.y = Math.atan2(tan.x, tan.z)
      foxBody.rotation.x = 0
      head.rotation.x = 0.1
      legs.forEach((l, i) => (l.rotation.x = Math.sin(a * 18 + (i < 2 ? 0 : Math.PI)) * 0.8))
      tail.rotation.y = Math.sin(a * 7) * 0.7
      tail.rotation.x = -0.15
      k = 1 - span(0.85, 1, u)
      fox.visible = k > 0.02
      fox.scale.setScalar(FOX_SIZE * Math.max(0.01, k))
      // sparks from the tip of the tail
      tailTip.updateWorldMatrix(true, false)
      const tip = tailTip.getWorldPosition(new THREE.Vector3())
      const per = light ? 2 : 4
      for (let j = 0; j < per && k > 0.2; j++) {
        const s = spk[spkNext]
        spkNext = (spkNext + 1) % SPK
        s.life = 1
        s.x = tip.x + (spkRnd() - 0.5) * 0.3
        s.y = tip.y
        s.z = tip.z + (spkRnd() - 0.5) * 0.3
        s.vx = (spkRnd() - 0.5) * 1.2
        s.vy = 2.5 + spkRnd() * 4.5
        s.vz = (spkRnd() - 0.5) * 1.2
        s.c = spkRnd() < 0.7 ? 0 : spkRnd() < 0.7 ? 1 : 2
      }
    } else {
      // on its seat, or coming back to it
      const back = F.n > 0 && a < FOX_BACK ? span(FOX_BACK - 1.5, FOX_BACK, a) : 1
      fox.visible = back > 0.02
      fox.scale.setScalar(FOX_SIZE * Math.max(0.01, back))
      fox.position.set(foxSeat.x, 0, foxSeat.z)
      fox.rotation.y = foxSeat.yaw
      // sitting: the body raised in front, the tail curled round
      foxBody.rotation.x = -0.45
      foxBody.position.y = 0.08
      head.rotation.x = 0.35 + Math.sin(t * 0.7) * 0.06
      head.rotation.y = Math.sin(t * 0.4) * 0.35
      legs.forEach((l, i) => (l.rotation.x = i < 2 ? 0.45 : -1.1))
      tail.rotation.y = 0.9 + Math.sin(t * 1.3) * 0.12
      tail.rotation.x = 0.25
    }
    if (run) foxBody.position.y = 0
    foxSign.visible = !foxRunning() && near(FOX, 11)
    // the sparks rise, drift and fade into the sky
    let live = false
    for (let i = 0; i < SPK; i++) {
      const s = spk[i]
      if (s.life > 0) {
        live = true
        s.life -= dt / 4.5
        s.vy += dt * 1.5
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.z += s.vz * dt
        const c = SPARK_C[s.c]
        const f = Math.max(0, s.life) * 1.4
        spkPos.set([s.x, s.y, s.z], i * 3)
        spkCol.set([c.r * f, c.g * f, c.b * f], i * 3)
      } else spkCol.set([0, 0, 0], i * 3)
    }
    sparks.visible = live
    if (live) {
      spkGeo.attributes.position.needsUpdate = true
      spkGeo.attributes.color.needsUpdate = true
    }
  })

  updates.push((dt, t) => {
    stage.update(t)
    const lv = level()
    if (lv !== shownLevel) {
      for (const f of relabels) f(lv)
      shownLevel = lv
    }
    const q = ctx.camera.quaternion
    for (const f of facing) f.quaternion.copy(q)
  })
  placeMolecules(B.h)
  drawOvals(QUIET_KP)

  const coneTip = () => skyRing.getWorldPosition(new THREE.Vector3())
  return {
    env: { ...stage.env },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: BACK.z - 0.5 },
    cameraPitchMax: 0.75,
    spawn: { x: SPAWN.x, z: SPAWN.z, yaw: 0 },
    hostSpot: { x: HOST.x, z: HOST.z, yaw: Math.atan2(HOST.x - SPAWN.x, HOST.z - SPAWN.z + 3) },
    back: { x: BACK.x, z: BACK.z, rot: Math.PI },
    stand: { x: STAND.x, z: STAND.z, rot: Math.atan2(SPAWN.x - STAND.x, SPAWN.z - 1 - STAND.z) },
    parts: {
      gust: {
        tap: () => gustStep(),
        kp: v => {
          setKp(v)
          share('gust')
        },
        get state() {
          return { n: G.n, kp: G.kp, sent: G.sent, busy: gBusy(), storm: Math.round(stormNow() * 100) / 100, shown: Math.round(kpShown * 10) / 10 }
        },
        at: () => toWorld(SUN),
      },
      colours: {
        tap: (thing = 'lens', h) => colourStep(thing, h), // 'sky' or 'gauge' with a height (km), or 'lens'
        height: v => {
          setHeight(v, true)
          share('colours')
        },
        get state() {
          return { n: B.n, h: B.h, phase: bPhase(), green: B.g, red: B.r, bumped: B.b, nitrogen: B.nit, crowd: crowd(B.h), try: { ...tryNow } }
        },
        at: thing => (thing === 'sky' ? coneTip() : thing === 'gauge' ? gaugeHit.getWorldPosition(new THREE.Vector3()) : LENS.clone()),
      },
      camera: {
        tap: () => photoStep(),
        exposure: s => {
          setExposure(xOfExp(s), true)
          share('camera')
        },
        get state() {
          return { n: P.n, exp: Math.round(P.exp * 1000) / 1000, capturing: capturing(), parts: P.k }
        },
        at: () => camHit.position.clone(),
      },
      fox: {
        tap: () => foxStep(),
        get state() {
          return { n: F.n, running: foxRunning() }
        },
        at: () => fox.position.clone().setY(0.4),
      },
      rayTo: p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { gust: gustPanel, colours: coloursPanel, camera: camPanel },
    shared: {
      gust: {
        get: () => ({ n: G.n, kp: G.kp, sent: G.sent, age: Math.min(120, Math.round(Math.max(0, gAge()) * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          G.kp = Math.round(clamp(Number(s?.kp) || 0, 0, 9))
          const sent = Math.round(clamp(Number(s?.sent) || 0, 0, 9))
          G.mine = false
          G.said = 2
          if (n > 0) {
            const a = clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 600)
            if (n !== G.n || !live) startGust(n, sent, a)
            else G.sent = sent
            if (!live) gustSound = n
          } else {
            G.n = 0
            G.sent = G.kp
            G.start = clock() - 999
          }
        },
      },
      colours: {
        get: () => ({ n: B.n, h: B.h, age: Math.min(30, Math.round(Math.max(0, bAge()) * 10) / 10), done: B.resolved, g: B.g, r: B.r, b: B.b, nit: B.nit }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          const h = Math.round(clamp(Number(s?.h) || 120, KM0, KM1))
          B.g = Math.max(0, Math.round(Number(s?.g) || 0))
          B.r = Math.max(0, Math.round(Number(s?.r) || 0))
          B.b = Math.max(0, Math.round(Number(s?.b) || 0))
          B.nit = Math.max(0, Math.round(Number(s?.nit) || 0))
          B.mine = false
          if (n > 0 && n !== B.n) {
            startTry(n, h, clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60))
            // counted once: here when the result comes, if it was not yet counted there
            B.resolved = !!s?.done
            if (!live) B.sound = 9
          } else {
            B.n = n
            setHeight(h, false)
            if (n === 0) {
              B.resolved = true
              B.start = clock() - 99
            }
          }
        },
      },
      camera: {
        get: () => ({ n: P.n, x: Math.round(P.x * 100) / 100 }),
        set: s => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          setExposure(Number(s?.x), false)
          P.mine = false
          if (n !== P.n) {
            P.n = n
            P.said = true
            P.start = clock()
          }
        },
      },
      fox: {
        get: () => ({ n: F.n, age: Math.min(20, Math.round(Math.max(0, fAge()) * 10) / 10) }),
        set: (s, live, ago = 0) => {
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          F.mine = false
          if (n !== F.n) {
            F.n = n
            F.start = clock() - clamp((Number(s?.age) || 0) + (Number(ago) || 0), 0, 60)
            if (live && n > 0) play('celebrate')
          }
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
