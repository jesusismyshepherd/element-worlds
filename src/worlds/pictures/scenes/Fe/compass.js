// Iron's picture "Why does a compass point north?" as a room (docs/knowledge/picture-rooms.md). The picture
// shows the Earth with its field lines looping pole to pole, a lens of swirling liquid iron, and a brass
// compass on a sea chart. Here it is the aft deck of a research ship at night on the Mid-Atlantic Ridge,
// south-west of the Azores (stages/ship.js), heading west across the ridge with a magnetometer towed far
// behind. Each step is chosen by tapping its thing (the user, 2026-10-30: pressing E through fixed steps
// felt passive); the prompt names the next tap; E opens the station's panel, whose buttons and slider do
// the same:
// - Gilbert's terrella on the chart table (forward, port): a lodestone ball on a brass stand with a little
//   dip needle on a carriage that rides its meridian ring. Tap any spot on the ball (or a latitude slider):
//   the carriage goes there and the needle lies along the field, level at the equator, tilted between,
//   on end at the poles (De Magnete, 1600). Tap the ship's binnacle compass beside it: the card is nudged
//   and swings back to magnetic north (9° west of true north here), and the carriage shows how a free
//   needle would dip at this latitude (51°); its two iron balls correct for the ship's steel;
// - the dynamo globe (the middle of the deck): liquid iron round a solid inner core in a glass globe. Tap
//   the globe to spin it (the Earth's rotation) and the heat dial (or the heat slider): only with both does
//   the flow roll into columns and the field lines grow out of the globe; stop either and the field fades
//   over a few seconds (the real one would take tens of thousands of years). The flip lever turns the
//   field over: it weakens and its axis swings across. A compass in a glass ball follows the field, and
//   with the globe off shows the real Earth's field here (north, dipping 51°);
// - the sea floor recorder (starboard): a cut-away model of the ridge, the towed magnetometer's trace on a
//   screen. Tap the ridge: half a million years of lava wells up and spreads both ways, each strip
//   freezing the field it cooled in (the globe's, normal, reversed or none); a time slider runs it on or
//   back; tap the screen for the real record of the last 5 million years (GTS2020), the same on both sides
//   (Vine and Matthews, 1963);
// - the wandering pole (on the deckhouse wall): a polar chart of NOAA's modelled north dip pole, 1590 to
//   2025; tap it to play the years (or a year slider), Ross's 1831 visit marked, the speed shown.
// Sources: the field here from WMM2025 for 2026-10-31 (BGS web service, 36.8° N 33.1° W): 42 934 nT, dip
// 51.3°, declination 9.4° W. Pole track: NOAA NCEI NP.xy (the pole positions behind "Wandering of the
// Geomagnetic Poles"), every 5 years to 1990 and each year since. Reversals: GTS2020 chron boundaries
// (Wikipedia, "Geomagnetic polarity time scale"). Words and their sources: compass.words.js.
// All of it is shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<exhibit> does what a tap does, for the probes; parts.at.<thing>() gives a point to aim a real tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, clamp, damp, random, fill, canvasTex } from '../../../wings/noble/kit.js'
import { edgeGlass } from '../../../common/props.js'
import { shipStage } from '../../stages/ship.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAND } from '../../../wings/oxygen/earthLand.js'
import { COMPASS_WORDS } from './compass.words.js'

export const WORDS = COMPASS_WORDS

const TAU = Math.PI * 2
const DEG = Math.PI / 180
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }

// ---- the field here, and Gilbert's rule ----
// the ship: 36.8° N, 33.1° W, heading west (−z), so north is to starboard (+x)
const HERE = { dip: 51.3, dec: -9.4, nT: 42934 }
// an axial dipole: the dip I at magnetic latitude λ, tan I = 2 tan λ
const dipOf = lat => Math.atan(2 * Math.tan(lat))
const latOfDip = dip => Math.atan(Math.tan(dip) / 2)
const SHIP_LAT = latOfDip(HERE.dip * DEG) // about 32°: where Gilbert's needle dips as one would here
// magnetic north on the deck (horizontal), and the real field's direction here
const MAG_N = new THREE.Vector3(Math.cos(HERE.dec * DEG), 0, Math.sin(HERE.dec * DEG))
const EARTH_B = MAG_N.clone().multiplyScalar(Math.cos(HERE.dip * DEG)).add(new THREE.Vector3(0, -Math.sin(HERE.dip * DEG), 0)).normalize()

// ---- the sea floor ----
const HALF_RATE = 12.5 // km per million years to each side (about 2.5 cm a year in all)
const T_MAX = 5 // million years in the model
const CELL = 0.02 // million years a recorded strip stands for
const NCELL = Math.round(T_MAX / CELL)
const STEP = 0.5 // million years a tap on the ridge lets out
const RUN_T = 2.4 // seconds the spreading takes
const SPAN_KM = T_MAX * HALF_RATE // 62.5 km to each side
// the normal-polarity chrons of the last 5.3 million years, [young, old] in Ma (GTS2020)
const NORMAL = [[0, 0.773], [1.008, 1.076], [1.189, 1.221], [1.775, 1.934], [2.12, 2.155], [2.61, 3.032], [3.116, 3.207], [3.33, 3.596], [4.187, 4.3], [4.493, 4.631], [4.799, 4.896], [4.997, 5.235]]
const polarityAt = age => (NORMAL.some(([a, b]) => age >= a && age < b) ? 'n' : 'r')
// the real record as the model's strips: strip i formed i × CELL million years after the start, 5 Ma
const REAL = Array.from({ length: NCELL }, (_, i) => polarityAt(T_MAX - (i + 0.5) * CELL)).join('')
const CHRONS = [['Brunhes', 0, 0.773], ['Matuyama', 0.773, 2.61], ['Gauss', 2.61, 3.596], ['Gilbert', 3.596, 5]]
const SUBCHRONS = [['Jaramillo', 1.008, 1.076], ['Olduvai', 1.775, 1.934]]
const POL_COLOR = { n: '#2bb8a6', r: '#9573dc', 0: '#80858c' }
const BARE = '#3b4149'

// ---- the wandering pole: NOAA NCEI's modelled north dip pole, [year, longitude E, latitude N] ----
const POLE = [
  [1590, -111.83, 73.92], [1595, -111.81, 74.60], [1600, -111.62, 75.21], [1605, -111.32, 75.75], [1610, -111.01, 76.23],
  [1615, -110.79, 76.63], [1620, -110.71, 76.90], [1625, -110.70, 77.04], [1630, -110.66, 77.08], [1635, -110.59, 77.08],
  [1640, -110.50, 77.02], [1645, -110.43, 76.90], [1650, -110.44, 76.71], [1655, -110.54, 76.49], [1660, -110.70, 76.28],
  [1665, -110.89, 76.07], [1670, -111.08, 75.83], [1675, -111.26, 75.59], [1680, -111.46, 75.38], [1685, -111.76, 75.20],
  [1690, -112.18, 75.01], [1695, -112.72, 74.80], [1700, -113.35, 74.58], [1705, -114.00, 74.37], [1710, -114.48, 74.13],
  [1715, -114.65, 73.83], [1720, -114.59, 73.50], [1725, -114.51, 73.24], [1730, -114.56, 73.15], [1735, -114.63, 73.22],
  [1740, -114.63, 73.41], [1745, -114.50, 73.63], [1750, -114.20, 73.84], [1755, -113.65, 74.06], [1760, -112.59, 74.15],
  [1765, -111.10, 74.07], [1770, -109.34, 73.83], [1775, -107.65, 73.50], [1780, -106.28, 73.12], [1785, -105.01, 72.65],
  [1790, -103.75, 72.13], [1795, -102.74, 71.77], [1800, -101.82, 71.53], [1805, -100.89, 71.33], [1810, -100.02, 71.08],
  [1815, -99.28, 70.86], [1820, -98.73, 70.72], [1825, -98.30, 70.60], [1830, -98.13, 70.46], [1835, -97.65, 70.11],
  [1840, -96.86, 69.68], [1845, -96.70, 69.42], [1850, -96.79, 69.27], [1855, -96.79, 69.22], [1860, -96.76, 69.18],
  [1865, -96.92, 69.34], [1870, -96.96, 69.54], [1875, -97.06, 69.76], [1880, -97.31, 70.01], [1885, -97.41, 70.28],
  [1890, -97.43, 70.55], [1895, -96.66, 70.53], [1900, -96.19, 70.46], [1905, -96.48, 70.66], [1910, -96.72, 70.78],
  [1915, -97.03, 71.03], [1920, -97.38, 71.34], [1925, -97.99, 71.79], [1930, -98.68, 72.27], [1935, -99.33, 72.80],
  [1940, -99.87, 73.30], [1945, -100.24, 73.93], [1950, -100.86, 74.64], [1955, -101.42, 75.18], [1960, -101.03, 75.30],
  [1965, -101.34, 75.63], [1970, -100.97, 75.88], [1975, -100.64, 76.15], [1980, -101.68, 76.91], [1985, -102.61, 77.40],
  [1990, -103.69, 78.09], [1991, -103.99, 78.29], [1992, -104.30, 78.48], [1993, -104.62, 78.67], [1994, -104.95, 78.85],
  [1995, -105.29, 79.04], [1996, -106.00, 79.42], [1997, -106.79, 79.80], [1998, -107.65, 80.19], [1999, -108.60, 80.58],
  [2000, -109.64, 80.97], [2001, -111.01, 81.43], [2002, -112.53, 81.88], [2003, -114.23, 82.33], [2004, -116.12, 82.76],
  [2005, -118.22, 83.19], [2006, -120.59, 83.60], [2007, -123.22, 84.00], [2008, -126.10, 84.36], [2009, -129.25, 84.70],
  [2010, -132.83, 85.02], [2011, -137.40, 85.37], [2012, -142.48, 85.68], [2013, -148.02, 85.93], [2014, -153.94, 86.14],
  [2015, -160.34, 86.31], [2016, -167.79, 86.47], [2017, -175.48, 86.56], [2018, 176.90, 86.60], [2019, 169.62, 86.57],
  [2020, 162.87, 86.49], [2021, 156.79, 86.40], [2022, 151.27, 86.28], [2023, 146.33, 86.13], [2024, 141.94, 85.96],
  [2025, 138.06, 85.78],
]
const Y0 = POLE[0][0]
const Y1 = POLE[POLE.length - 1][0]
const ROSS = { year: 1831, lon: -96.78, lat: 70.08 } // James Clark Ross, 1 June 1831, Boothia Peninsula
const PLAY_RATE = 48 // years a second
/** Kilometres between two places on the Earth (lon, lat in degrees). */
function kmBetween(a, b) {
  const [l1, p1] = [a[0] * DEG, a[1] * DEG]
  const [l2, p2] = [b[0] * DEG, b[1] * DEG]
  const c = Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(l1 - l2)
  return 6371 * Math.acos(clamp(c, -1, 1))
}

/** The land's rings as [[lon, lat], ...] (earthLand.js keeps them in fifths of a degree, as steps). */
let landCache = null
function landRings() {
  if (landCache) return landCache
  landCache = LAND.map(ring => {
    const out = []
    let lon = ring[0]
    let lat = ring[1]
    out.push([lon / 5, lat / 5])
    for (let i = 2; i < ring.length; i += 2) {
      lon += ring[i]
      lat += ring[i + 1]
      out.push([lon / 5, lat / 5])
    }
    return out
  })
  return landCache
}

// ---- materials and shapes ----

/** Glowing field lines: dashes running along each tube the way the field points (toward the tube's start,
 *  u = 0); `uGrow` shows them growing out from both ends, `uK` their strength. Additive. */
function fieldLineMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uK: { value: 1 }, uGrow: { value: 1 }, uColor: { value: new THREE.Color(color) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uK; uniform float uGrow; uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float u = vUv.x;
        float e = min(u, 1.0 - u);
        float reach = uGrow * 0.5 + 0.002;
        if (e > reach) discard;
        float tip = smoothstep(reach, reach - 0.04, e);
        float dash = pow(0.5 + 0.5 * sin((u * 22.0 + uTime * 1.3) * 6.2831853), 6.0);
        float a = (0.5 + 1.1 * dash) * uK * tip;
        gl_FragColor = vec4(uColor * a, 1.0);
        #include <colorspace_fragment>
      }`,
  })
}

/** An axial dipole's field lines round a ball of radius R: r = L R sin²θ, one per azimuth and shell L,
 *  from the north end (u = 0, top) to the south end. Returns their tubes and where each crosses the
 *  equator (where the field points straight up, north, for the Earth's polarity). */
function dipoleLines({ R, Ls, azimuths, radius, seg = 64 }) {
  const out = []
  for (const az of azimuths) {
    for (const L of Ls) {
      const th0 = Math.asin(Math.sqrt(1 / L))
      const pts = []
      for (let i = 0; i <= seg; i++) {
        const th = th0 + ((Math.PI - 2 * th0) * i) / seg
        const r = L * R * Math.sin(th) ** 2
        pts.push(new THREE.Vector3(r * Math.sin(th) * Math.cos(az), r * Math.cos(th), r * Math.sin(th) * Math.sin(az)))
      }
      out.push({ geo: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, radius, 5, false), eq: new THREE.Vector3(L * R * Math.cos(az), 0, L * R * Math.sin(az)) })
    }
  }
  return out
}

/** The liquid outer core seen through the glass: flowing orange, rolled into columns round the axis when
 *  `uOrder` is 1, brighter with `uHeat`. Drawn in the globe's own frame, so it turns with it. */
function liquidMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uHeat: { value: 0 }, uOrder: { value: 0 } },
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
      uniform float uTime; uniform float uHeat; uniform float uOrder;
      varying vec3 vPos; varying vec3 vN; varying vec3 vV;
      float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float noise(vec3 p) {
        vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
        float a = mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y);
        float b = mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y);
        return mix(a, b, f.z);
      }
      void main() {
        vec3 p = vPos * 3.2;
        float t = uTime * (0.15 + 0.5 * uHeat);
        // tumbling blobs
        float blobs = noise(p + vec3(0.0, t, 0.0)) * 0.6 + noise(p * 2.1 - vec3(t * 0.7, 0.0, t)) * 0.4;
        // columns: bands round the axis, long along it
        float phi = atan(vPos.z, vPos.x);
        float cols = 0.5 + 0.5 * cos(8.0 * phi + 1.2 * noise(vec3(vPos.y * 2.5, t * 0.6, phi)));
        float streak = noise(vec3(phi * 4.0, vPos.y * 0.8 - t * 0.8, 1.7));
        float n = mix(blobs, cols * 0.75 + streak * 0.35, uOrder);
        float face = abs(dot(normalize(vN), normalize(vV)));
        vec3 dark = vec3(0.3, 0.04, 0.01);
        vec3 hot = vec3(1.0, 0.4, 0.07);
        vec3 c = mix(dark, hot, smoothstep(0.2, 0.9, n)) * (0.5 + 0.55 * uHeat);
        float a = 0.42 + 0.36 * (1.0 - face) + 0.12 * n;
        gl_FragColor = vec4(c, a);
        #include <colorspace_fragment>
      }`,
  })
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const DECK = { x0: -6.4, x1: 6.4, z0: -7.6, z1: 7.6 }
  const stage = shipStage({ light, deck: DECK, tow: { x: 2.7, far: 160 }, portholes: [[-5.75, 1.9, false], [-4.75, 1.9, false], [2.2, 1.9, true], [3.2, 1.9, false]] })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v).replace('-', '−')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  // a station's focus: how high and how wide it is (the station view fits both, so an upright phone sees
  // the whole width too)
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  // things whose words follow the depth switch: [object, 'kid' | 'sci']
  const byLevel = []
  let shownLevel = null
  const sign = (text, size, { color: c = '#e8f1fb', maxWidth = 3, anchorX = 'center', anchorY = 'middle' } = {}) =>
    makeText(text, { size, color: c, maxWidth, anchorX, anchorY, outlineWidth: size * 0.08, outlineColor: '#0b1020' })
  /** A sign whose words follow the depth: { kid, sci }. */
  const levelSign = (entry, size, opts) => {
    const g = new THREE.Group()
    for (const k of ['kid', 'sci']) {
      const s = sign(entry[k], size, opts)
      byLevel.push([s, k])
      g.add(s)
    }
    return g
  }
  /** A canvas screen in a dark frame, facing +z: draw on `g`, then `tex.needsUpdate = true`. */
  function canvasScreen(w, h, px = 1024, frameMat = mats.dark) {
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
  const tealMat = new THREE.MeshStandardMaterial({ color: '#3fd6c6', emissive: '#3fd6c6', emissiveIntensity: 0.9, roughness: 0.4 })
  const ironMat = new THREE.MeshStandardMaterial({ color: '#4a4d52', roughness: 0.42, metalness: 0.75 })
  const needleMats = {
    n: new THREE.MeshStandardMaterial({ color: '#e0342c', emissive: '#e0342c', emissiveIntensity: 0.35, roughness: 0.4, metalness: 0.3 }),
    s: new THREE.MeshStandardMaterial({ color: '#e8eaee', emissive: '#c8ccd4', emissiveIntensity: 0.2, roughness: 0.4, metalness: 0.3 }),
  }
  /** A compass needle along +x (its red north end at +x), `len` long, flat diamond halves. */
  function needle(len, w = len * 0.11) {
    const g = new THREE.Group()
    const half = new THREE.ConeGeometry(w, len / 2, 4)
    half.rotateZ(-Math.PI / 2)
    half.translate(len / 4, 0, 0)
    half.scale(1, 1, 0.35)
    const nm = new THREE.Mesh(half, needleMats.n)
    const sm = new THREE.Mesh(half.clone().rotateZ(Math.PI), needleMats.s)
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.5, w * 0.5, w * 1.3, 10).rotateX(Math.PI / 2), mats.brass)
    g.add(nm, sm, pin)
    return g
  }
  const glass = edgeGlass({ color: '#dceeff', edge: 0.7, base: 0.03 })

  // ======================================================================================================
  // Gilbert's terrella on the chart table, the ship's compass beside it
  // ======================================================================================================
  const CT = { x: -2.75, z: -6.75, w: 1.9, d: 0.95, y: 0.92 }
  const TER = { x: CT.x - 0.42, y: CT.y + 0.52, z: CT.z + 0.04, r: 0.3, ring: 0.395 }
  const BIN = { x: -1.3, z: -6.45, y: 0.95 }
  {
    const table = new THREE.Group()
    table.position.set(CT.x, 0, CT.z)
    root.add(table)
    const top = new THREE.Mesh(new RoundedBoxGeometry(CT.w, 0.08, CT.d, 2, 0.02), mats.wood)
    top.position.y = CT.y - 0.04
    top.castShadow = !light
    top.receiveShadow = true
    const body = new THREE.Mesh(new RoundedBoxGeometry(CT.w - 0.12, CT.y - 0.1, CT.d - 0.14, 2, 0.03), mats.wood)
    body.position.y = (CT.y - 0.08) / 2
    table.add(top, body)
    // drawer fronts with brass pulls
    for (const dx of [-0.45, 0.45]) {
      const drawer = new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.22, 0.03, 2, 0.01), new THREE.MeshStandardMaterial({ color: '#5d3d25', roughness: 0.7 }))
      drawer.position.set(dx, CT.y - 0.24, CT.d / 2 - 0.06)
      const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8).rotateZ(Math.PI / 2), mats.brass)
      pull.position.set(dx, CT.y - 0.24, CT.d / 2 - 0.035)
      table.add(drawer, pull)
    }
    // the sea chart of the North Atlantic: the ridge, the ship
    const chartTex = canvasTex(1024, 540, (g, w, h) => {
      const L0 = -85
      const L1 = -5
      const P0 = 22
      const P1 = 64
      const X = lon => ((lon - L0) / (L1 - L0)) * w
      const Y = lat => ((P1 - lat) / (P1 - P0)) * h
      g.fillStyle = '#b9b29b'
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#a9bcc0'
      g.fillRect(8, 8, w - 16, h - 16)
      const land = new Path2D()
      for (const ring of landRings()) {
        if (!ring.some(([lo, la]) => lo > L0 - 20 && lo < L1 + 20 && la > P0 - 10 && la < P1 + 10)) continue
        ring.forEach(([lo, la], i) => (i ? land.lineTo(X(lo), Y(la)) : land.moveTo(X(lo), Y(la))))
        land.closePath()
      }
      g.save()
      g.beginPath()
      g.rect(8, 8, w - 16, h - 16)
      g.clip()
      g.fillStyle = '#cbbf98'
      g.fill(land, 'evenodd')
      g.strokeStyle = 'rgba(90,80,60,0.6)'
      g.lineWidth = 1.5
      g.stroke(land)
      // the graticule
      g.strokeStyle = 'rgba(60,80,90,0.35)'
      g.lineWidth = 1
      for (let lon = -80; lon <= -10; lon += 10) {
        g.beginPath()
        g.moveTo(X(lon), 0)
        g.lineTo(X(lon), h)
        g.stroke()
      }
      for (let lat = 30; lat <= 60; lat += 10) {
        g.beginPath()
        g.moveTo(0, Y(lat))
        g.lineTo(w, Y(lat))
        g.stroke()
      }
      // the ridge's axis, roughly
      const ridge = [[-23, 63.3], [-27, 61], [-31, 58.5], [-34.5, 55.5], [-35, 53], [-31.5, 52.4], [-29.5, 50], [-28, 47], [-28.5, 44], [-29.5, 41], [-31.5, 38.5], [-33.2, 36.5], [-36, 34.5], [-38, 33], [-40, 31], [-42.3, 29], [-44.5, 26], [-45, 24], [-46.5, 20]]
      g.strokeStyle = '#a3473a'
      g.lineWidth = 4
      g.setLineDash([12, 8])
      g.beginPath()
      ridge.forEach(([lo, la], i) => (i ? g.lineTo(X(lo), Y(la)) : g.moveTo(X(lo), Y(la))))
      g.stroke()
      // the ship's track and the ship
      g.strokeStyle = '#2c3a48'
      g.lineWidth = 2.5
      g.setLineDash([6, 6])
      g.beginPath()
      g.moveTo(X(-25), Y(36.8))
      g.lineTo(X(-33.1), Y(36.8))
      g.stroke()
      g.setLineDash([])
      g.fillStyle = '#c0392b'
      g.beginPath()
      g.moveTo(X(-33.1) - 16, Y(36.8))
      g.lineTo(X(-33.1) + 8, Y(36.8) - 9)
      g.lineTo(X(-33.1) + 8, Y(36.8) + 9)
      g.closePath()
      g.fill()
      g.restore()
      // a compass rose
      const rx = w - 120
      const ry = h - 120
      g.strokeStyle = 'rgba(50,60,70,0.7)'
      g.lineWidth = 2
      g.beginPath()
      g.arc(rx, ry, 70, 0, TAU)
      g.stroke()
      g.fillStyle = 'rgba(50,60,70,0.8)'
      for (let k = 0; k < 4; k++) {
        const a = (k * Math.PI) / 2
        g.beginPath()
        g.moveTo(rx + Math.sin(a) * 80, ry - Math.cos(a) * 80)
        g.lineTo(rx + Math.sin(a + 0.35) * 18, ry - Math.cos(a + 0.35) * 18)
        g.lineTo(rx + Math.sin(a - 0.35) * 18, ry - Math.cos(a - 0.35) * 18)
        g.closePath()
        g.fill()
      }
      g.font = '700 30px Outfit'
      g.textAlign = 'center'
      g.fillText('N', rx, ry - 88)
    })
    textures.push(chartTex)
    const chart = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.555), new THREE.MeshStandardMaterial({ map: chartTex, color: '#bdbdbd', roughness: 0.95 }))
    chart.rotation.set(-Math.PI / 2, 0, 0.04)
    chart.position.set(0.36, CT.y + 0.003, 0.08)
    table.add(chart)
    // a pair of dividers on the chart
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.2, 6), mats.brass)
      leg.rotation.set(Math.PI / 2, 0, s * 0.18)
      leg.position.set(0.55 + s * 0.018, CT.y + 0.01, 0.12)
      table.add(leg)
    }
    // a brass lamp with a warm light
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.03, 16), mats.brass)
    lampBase.position.set(0.82, CT.y + 0.015, -0.3)
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), mats.brass)
    arm.position.set(0.82, CT.y + 0.22, -0.3)
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.1, 0.1, 20, 1, true), new THREE.MeshStandardMaterial({ color: '#1f5e3a', roughness: 0.5, side: THREE.DoubleSide }))
    shade.position.set(0.82, CT.y + 0.44, -0.3)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe0a8').multiplyScalar(2) }))
    bulb.position.set(0.82, CT.y + 0.41, -0.3)
    table.add(lampBase, arm, shade, bulb)
    const lampLight = new THREE.PointLight('#ffd9a0', light ? 0.4 : 0.5, 3.2, 1.6)
    lampLight.position.set(CT.x + 0.82, CT.y + 0.4, CT.z - 0.3)
    root.add(lampLight)
    solids.push(box(CT.x, CT.z, CT.w + 0.1, CT.d + 0.1))
    // the plaque on the table's front
    const plaque = levelSign(E.gilbert.signs.plaque, 0.065, { maxWidth: 1.7 })
    plaque.position.set(CT.x, CT.y - 0.09, CT.z + CT.d / 2 + 0.012)
    root.add(plaque)
  }

  // ---- the terrella: a lodestone ball on a brass stand, a meridian ring, the carriage and its needle ----
  const terrella = new THREE.Group()
  terrella.position.set(TER.x, TER.y, TER.z)
  root.add(terrella)
  const stoneTex = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#2a2b2e'
    g.fillRect(0, 0, w, h)
    const r = random(1600)
    for (let i = 0; i < 4200; i++) {
      const v = r()
      g.fillStyle = v < 0.45 ? `rgba(120,118,112,${0.1 + r() * 0.2})` : v < 0.75 ? `rgba(110,62,38,${0.08 + r() * 0.18})` : `rgba(10,10,12,${0.2 + r() * 0.3})`
      g.fillRect(r() * w, r() * h, 1 + r() * 4, 1 + r() * 3)
    }
    // Gilbert drew his terrella with meridians and an equator
    g.strokeStyle = 'rgba(214,170,90,0.55)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(0, h / 2)
    g.lineTo(w, h / 2)
    g.stroke()
    for (let k = 0; k < 8; k++) {
      g.beginPath()
      g.moveTo((k * w) / 8, 0)
      g.lineTo((k * w) / 8, h)
      g.stroke()
    }
  })
  textures.push(stoneTex)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(TER.r, 48, 32), new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.5, metalness: 0.45 }))
  ball.castShadow = !light
  terrella.add(ball)
  {
    // the stand: a cup on a short column, on the table
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, TER.y - TER.r - CT.y + 0.04, 16), mats.brass)
    col.position.y = -(TER.r + (TER.y - TER.r - CT.y) / 2) + 0.02
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 24), mats.brass)
    foot.position.y = CT.y - TER.y + 0.015
    const cup = new THREE.Mesh(new THREE.SphereGeometry(TER.r * 0.55, 24, 8, 0, TAU, Math.PI * 0.62, Math.PI * 0.38), mats.brass)
    cup.position.y = -TER.r * 0.55
    terrella.add(col, foot, cup)
    // the meridian ring the carriage rides, in the plane facing the visitor (x, y)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(TER.ring, 0.011, 8, 96), mats.brass)
    terrella.add(ring)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, TER.y - TER.ring - CT.y, 8), mats.brass)
    post.position.set(0, -TER.ring - (TER.y - TER.ring - CT.y) / 2, 0)
    terrella.add(post)
    // N and S at the poles
    const n = sign('N', 0.07, { color: '#ffd166' })
    n.position.set(0, TER.ring + 0.07, 0.02)
    const s = sign('S', 0.055, { color: '#c9d4e8' })
    s.position.set(0.075, -TER.ring - 0.02, 0.03)
    terrella.add(n, s)
  }
  // its field, faint, in the ring's plane: two sides, three shells
  const terLineMat = fieldLineMaterial('#3fd6c6')
  terLineMat.uniforms.uK.value = 0.32
  for (const l of dipoleLines({ R: TER.r, Ls: [1.45, 2.1, 3.0], azimuths: [0, Math.PI], radius: 0.0045 })) {
    terrella.add(new THREE.Mesh(l.geo, terLineMat))
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.035, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#3fd6c6').multiplyScalar(0.8), toneMapped: false }))
    cone.position.copy(l.eq)
    terrella.add(cone)
  }
  // the carriage: a little brass shoe on the ring, the dip needle on its pivot just in front
  const carriage = new THREE.Group()
  terrella.add(carriage)
  const shoe = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.035, 0.06, 2, 0.01), mats.brass)
  carriage.add(shoe)
  const dipNeedle = needle(0.21)
  dipNeedle.position.z = 0.045
  carriage.add(dipNeedle)
  // the latitude and dip, on a small plate beside the ball
  const terPlate = sign('', 0.042, { color: '#ffe3a0', maxWidth: 0.9, anchorX: 'center' })
  terPlate.position.set(TER.x + 0.62, CT.y + 0.06, TER.z + 0.36)
  terPlate.rotation.x = -0.9
  root.add(terPlate)

  // ---- the binnacle: the ship's compass, its card under glass, Kelvin's iron balls, a Flinders bar ----
  const binnacle = new THREE.Group()
  binnacle.position.set(BIN.x, 0, BIN.z)
  root.add(binnacle)
  const cardTex = canvasTex(512, 512, (g, w) => {
    const c = w / 2
    g.fillStyle = '#e9e2cf'
    g.beginPath()
    g.arc(c, c, c - 2, 0, TAU)
    g.fill()
    g.strokeStyle = '#2a2f38'
    g.lineWidth = 3
    for (let d = 0; d < 360; d += 5) {
      const a = d * DEG
      const r0 = d % 30 ? c - 26 : c - 44
      g.beginPath()
      g.moveTo(c + Math.sin(a) * r0, c - Math.cos(a) * r0)
      g.lineTo(c + Math.sin(a) * (c - 8), c - Math.cos(a) * (c - 8))
      g.stroke()
    }
    // the rose: north red
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4
      const long = k % 2 === 0
      g.fillStyle = k === 0 ? '#c8322a' : long ? '#2a3a5a' : '#6a7a96'
      g.beginPath()
      g.moveTo(c + Math.sin(a) * (long ? c - 60 : c - 120), c - Math.cos(a) * (long ? c - 60 : c - 120))
      g.lineTo(c + Math.sin(a + 0.5) * 34, c - Math.cos(a + 0.5) * 34)
      g.lineTo(c + Math.sin(a - 0.5) * 34, c - Math.cos(a - 0.5) * 34)
      g.closePath()
      g.fill()
    }
    g.fillStyle = '#c8322a'
    g.font = '700 54px Outfit'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('N', c, 92)
    g.fillStyle = '#2a3a5a'
    g.fillText('S', c, w - 92)
    g.fillText('E', w - 92, c)
    g.fillText('W', 92, c)
  })
  textures.push(cardTex)
  const card = new THREE.Mesh(new THREE.CircleGeometry(0.19, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: cardTex, color: '#cfcfcf', roughness: 0.6, emissive: '#ffffff', emissiveMap: cardTex, emissiveIntensity: 0.06 }))
  card.position.y = BIN.y + 0.05
  binnacle.add(card)
  {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.24, BIN.y - 0.08, 20), mats.wood)
    pillar.position.y = (BIN.y - 0.08) / 2
    pillar.castShadow = !light
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.06, 24), mats.wood)
    foot.position.y = 0.03
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.19, 0.12, 32, 1, true), mats.brass)
    bowl.position.y = BIN.y
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.014, 8, 40).rotateX(Math.PI / 2), mats.brass)
    rim.position.y = BIN.y + 0.06
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.232, 32, 12, 0, TAU, 0, Math.PI / 2), glass)
    dome.position.y = BIN.y + 0.06
    dome.scale.y = 0.45
    dome.renderOrder = 3
    // the lubber line: the mark for the ship's head (forward, −z)
    const lubber = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.03), needleMats.n)
    lubber.position.set(0, BIN.y + 0.06, -0.2)
    binnacle.add(pillar, foot, bowl, rim, dome, lubber)
    // Kelvin's soft iron spheres on brackets either side, and the Flinders bar in its brass case in front
    for (const s of [-1, 1]) {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), ironMat)
      sphere.position.set(s * 0.43, BIN.y - 0.02, 0)
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.06), mats.brass)
      bracket.position.set(s * 0.27, BIN.y - 0.1, 0)
      binnacle.add(sphere, bracket)
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.5, 14), mats.brass)
    bar.position.set(0, BIN.y - 0.42, 0.24)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8, 0, TAU, 0, Math.PI / 2), mats.brass)
    cap.position.set(0, BIN.y - 0.17, 0.24)
    binnacle.add(bar, cap)
    solids.push(circle(BIN.x, BIN.z, 0.5))
  }
  const binHit = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.4, BIN.y + 0.25, 12), ghost)
  binHit.position.set(BIN.x, (BIN.y + 0.25) / 2, BIN.z)
  root.add(binHit)
  // the card: magnetic north on the deck, as a turn of the card (its N drawn toward −z before turning)
  const CARD_N = Math.atan2(-MAG_N.x, -MAG_N.z)

  // ---- Gilbert's state (shared): where the carriage is, the compass's nudges ----
  let terLat = 0 // the carriage's latitude, radians
  let terSide = 1 // 1 on the right of the ring as seen from the deck, −1 on the left
  let carPsi = 0 // the carriage's angle on the ring, now
  let needleAng = Math.PI / 2 // the dip needle's angle in the ring's plane, now
  let needleVel = 0
  let binN = 0
  let cardAng = CARD_N + 0.6
  let cardVel = 0
  let gilMine = false
  let compassSays = 0
  const psiOf = (lat, side) => (side > 0 ? lat : Math.PI - lat)
  /** The field's direction at angle psi on the ring (x, y): an Earth-like dipole, its field into the top. */
  const fieldAngle = psi => Math.atan2(1 - 3 * Math.sin(psi) ** 2, -3 * Math.sin(psi) * Math.cos(psi))
  const gilbertPanel = lv => ({
    title: E.gilbert.title,
    color,
    blocks: [
      {
        slider: {
          label: E.gilbert.slider,
          min: -90,
          max: 90,
          step: 1,
          value: Math.round(terLat / DEG),
          onInput: v => slideLat(v),
          format: v => `${nf(Math.abs(v))}°${v > 0 ? ' N' : v < 0 ? ' S' : ''}`,
          live: () => Math.round(terLat / DEG),
        },
      },
      { buttons: [['equator', () => gilbertStep('ball', 0)], ['mid', () => gilbertStep('ball', 45)], ['pole', () => gilbertStep('ball', 90)], ['compass', () => gilbertStep('compass')]].map(([k, f]) => ({ label: E.gilbert.buttons[k], onClick: f })) },
      ...paras(E.gilbert.panel, lv),
    ],
  })
  const gilbertChanged = (delay = 2.6) => {
    gilMine = true
    ex.discover('gilbert', gilbertPanel, delay)
    share('gilbert')
  }
  function sayLat(lat) {
    const S = E.gilbert.says
    const lv = level()
    const d = Math.round(Math.abs(dipOf(lat)) / DEG)
    const l = Math.round(Math.abs(lat) / DEG)
    const key = l < 8 ? 'equator' : l >= 80 ? (lat > 0 ? 'poleN' : 'poleS') : lat > 0 ? 'midN' : 'midS'
    say(fill(at(S[key], lv), { d: nf(d), l: nf(l) }))
  }
  function gilbertStep(what, latDeg = null, side = null) {
    if (what === 'ball') {
      terLat = clamp(latDeg ?? 0, -90, 90) * DEG
      if (side) terSide = side
      play('tap')
      sayLat(terLat)
      gilbertChanged()
    } else if (what === 'compass') {
      binN++
      kickCard(true)
      play('select')
      const S = E.gilbert.says.compass
      say(fill(at(S[compassSays % S.length], level()), { dec: nf(Math.abs(HERE.dec), 1), dip: nf(Math.round(HERE.dip)) }))
      compassSays++
      // the carriage goes to where a free needle would dip as it does here
      terLat = SHIP_LAT
      terSide = 1
      gilbertChanged(4)
    }
  }
  function kickCard(mine) {
    cardVel += (binN % 2 ? 1 : -1) * 5.5
    if (!mine) play('tap')
  }
  let gilSending = false
  function slideLat(v) {
    terLat = clamp(Math.round(v), -90, 90) * DEG
    gilMine = true
    ex.discover('gilbert', gilbertPanel, 2.6)
    if (gilSending) return
    gilSending = true
    later(0.25, () => {
      gilSending = false
      share('gilbert')
    })
  }
  ex.add({
    id: 'gilbert',
    x: -2.2,
    z: -5.05,
    radius: 1.9,
    manual: true,
    label: E.gilbert.label,
    verb: () => {
      const h = E.gilbert.hints
      if (binN === 0 && Math.abs(terLat) > 0.01) return h.compass
      if (binN === 0) return h.ball
      return h.again
    },
    focus: focusOf(-2.42, 1.15, -6.6, 2.5, 3.4),
    act: () => ctx.showPanel(gilbertPanel),
  })
  // a tap on the ball: the carriage goes to that latitude, on that side of the ring
  clickable(ball, hit => {
    const q = terrella.worldToLocal(hit.point.clone())
    const lat = Math.asin(clamp(q.y / Math.max(1e-6, q.length()), -1, 1))
    gilbertStep('ball', Math.round(lat / DEG), q.x >= 0 ? 1 : -1)
  }, { reach: 4.5 })
  clickable(binHit, () => gilbertStep('compass'), { reach: 4.5 })

  updates.push((dt, t) => {
    // the carriage slides along the ring to its place; the needle swings to the field and settles
    const target = psiOf(terLat, terSide)
    let d = Math.atan2(Math.sin(target - carPsi), Math.cos(target - carPsi))
    carPsi += clamp(d, -2.2 * dt, 2.2 * dt)
    if (Math.abs(d) < 0.002) carPsi = target
    carriage.position.set(Math.cos(carPsi) * TER.ring, Math.sin(carPsi) * TER.ring, 0)
    carriage.rotation.z = carPsi
    const want = fieldAngle(carPsi)
    d = Math.atan2(Math.sin(want - needleAng), Math.cos(want - needleAng))
    needleVel += (d * 26 - needleVel * 3.2) * dt
    needleAng += needleVel * dt
    dipNeedle.rotation.z = needleAng - carPsi
    // the compass card swings back to magnetic north (a damped swing)
    const dc = Math.atan2(Math.sin(CARD_N - cardAng), Math.cos(CARD_N - cardAng))
    cardVel += (dc * 7 - cardVel * 1.25) * dt
    cardAng += cardVel * dt
    card.rotation.y = cardAng
    // the plate: latitude and dip
    const lv = level()
    const l = Math.round(terLat / DEG)
    const txt = fill(at(E.gilbert.board, lv), { l: nf(Math.abs(l)), ns: l > 0 ? 'N' : l < 0 ? 'S' : '', d: nf(Math.round(Math.abs(dipOf(terLat)) / DEG)) })
    if (terPlate.text !== txt) {
      terPlate.text = txt
      terPlate.sync()
    }
  })

  // ======================================================================================================
  // the dynamo globe: liquid iron round a solid inner core, spun and heated
  // ======================================================================================================
  const GL = { x: 0.9, z: -2.6, y: 1.62, r: 0.8 }
  const CORE_R = GL.r * 0.35 // the inner core is about 0.35 of the core's radius (1220 of 3480 km)
  const globe = new THREE.Group()
  globe.position.set(GL.x, 0, GL.z)
  root.add(globe)
  // what turns with the globe
  const spinner = new THREE.Group()
  spinner.position.y = GL.y
  globe.add(spinner)
  const liqMat = liquidMaterial()
  const liquid = new THREE.Mesh(new THREE.SphereGeometry(GL.r * 0.97, 64, 40), liqMat)
  liquid.renderOrder = 2
  spinner.add(liquid)
  const coreMat = new THREE.MeshStandardMaterial({ color: '#ffd28a', emissive: '#ffb04a', emissiveIntensity: 0.5, roughness: 0.35, metalness: 0.4 })
  const innerCore = new THREE.Mesh(new THREE.SphereGeometry(CORE_R, 40, 28), coreMat)
  spinner.add(innerCore)
  const coreLight = new THREE.PointLight('#ff9a4a', 0, 5, 1.8)
  coreLight.position.y = GL.y
  globe.add(coreLight)
  // the glass, with four faint meridians on it so its turning shows
  const glassBall = new THREE.Mesh(new THREE.SphereGeometry(GL.r, 48, 32), edgeGlass({ color: '#dfe8f2', edge: 0.35, base: 0.015 }))
  glassBall.renderOrder = 3
  spinner.add(glassBall)
  const meridianMat = new THREE.MeshBasicMaterial({ color: '#ffcf9a', transparent: true, opacity: 0.32, depthWrite: false })
  for (let k = 0; k < 4; k++) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(GL.r * 1.003, 0.004, 4, 96), meridianMat)
    m.rotation.y = (k * Math.PI) / 4
    spinner.add(m)
  }
  {
    const eq = new THREE.Mesh(new THREE.TorusGeometry(GL.r * 1.003, 0.005, 4, 96).rotateX(Math.PI / 2), meridianMat)
    spinner.add(eq)
  }
  // iron atoms in the flow (the picture's tumbling balls)
  const NATOM = light ? 80 : 160
  const atomMat = new THREE.MeshStandardMaterial({ color: '#c65a28', emissive: '#7a2a10', emissiveIntensity: 0.7, roughness: 0.35, metalness: 0.3 })
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(0.024, 10, 8), atomMat, NATOM)
  atoms.frustumCulled = false
  spinner.add(atoms)
  const atomSeed = Array.from({ length: NATOM }, (_, i) => {
    const r = random(900 + i * 7)
    return {
      // a convection cell: its centre's direction, the loop's size and phase
      th: Math.acos(1 - 2 * r()),
      ph: r() * TAU,
      loop: 0.1 + r() * 0.08,
      a: r() * TAU,
      // a column: which, how far round it, how far along
      col: i % 8,
      rho: 0.035 + r() * 0.1,
      sw: r() * TAU,
      b: r() * TAU,
      sp: 0.7 + r() * 0.6,
    }
  })
  const tmpM = new THREE.Matrix4()
  const convP = new THREE.Vector3()
  const colP = new THREE.Vector3()
  // the stand: a base, a column, the brass meridian ring holding the globe's axis
  {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.66, 0.18, 32), mats.dark)
    base.position.y = 0.09
    base.castShadow = !light
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, GL.y - GL.r - 0.2, 20), mats.brass)
    col.position.y = 0.18 + (GL.y - GL.r - 0.2) / 2
    const ring = new THREE.Mesh(new THREE.TorusGeometry(GL.r + 0.075, 0.022, 10, 96), mats.brass)
    ring.position.y = GL.y
    const pinT = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 10), mats.brass)
    pinT.position.y = GL.y + GL.r + 0.04
    const pinB = pinT.clone()
    pinB.position.y = GL.y - GL.r - 0.04
    globe.add(base, col, ring, pinT, pinB)
    solids.push(circle(GL.x, GL.z, 0.75))
    const plaque = levelSign(E.dynamo.signs.plaque, 0.07, { maxWidth: 1.4 })
    plaque.position.set(0, 0.24, 0.67)
    plaque.rotation.x = -0.35
    globe.add(plaque)
  }
  // the field: lines in eight directions round the axis, three shells; arrows where they cross the equator
  const lineMat = fieldLineMaterial('#3fd6c6')
  lineMat.uniforms.uGrow.value = 0
  lineMat.uniforms.uK.value = 0
  const lineGroup = new THREE.Group()
  lineGroup.position.y = GL.y
  globe.add(lineGroup)
  const arrowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#5ff0de').multiplyScalar(1.3), toneMapped: false, transparent: true, opacity: 0 })
  const arrowGeo = new THREE.ConeGeometry(0.036, 0.1, 10)
  for (const l of dipoleLines({ R: GL.r, Ls: [1.35, 1.8, 2.6], azimuths: Array.from({ length: 8 }, (_, k) => (k * Math.PI) / 4 + Math.PI / 8), radius: 0.0075 })) {
    const m = new THREE.Mesh(l.geo, lineMat)
    m.renderOrder = 4
    lineGroup.add(m)
    const a = new THREE.Mesh(arrowGeo, arrowMat)
    a.position.copy(l.eq)
    a.renderOrder = 4
    lineGroup.add(a)
  }
  // the heat dial on its pillar (left), the flip lever on its pillar (right)
  const DIAL = { x: GL.x - 1.3, z: GL.z + 0.75 }
  const LEVER = { x: GL.x + 1.3, z: GL.z + 0.75 }
  const dialGlowMat = new THREE.MeshStandardMaterial({ color: '#ff8a3a', emissive: '#ff6a1a', emissiveIntensity: 0.2, roughness: 0.4 })
  const dialPointer = new THREE.Group()
  {
    const pillar = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.95, 0.3, 2, 0.04), mats.dark)
    pillar.position.set(DIAL.x, 0.475, DIAL.z)
    pillar.castShadow = !light
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.035, 32).rotateX(Math.PI / 2), mats.steel)
    face.position.set(DIAL.x, 0.78, DIAL.z + 0.165)
    const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.016, 8, 40), dialGlowMat)
    glowRing.position.set(DIAL.x, 0.78, DIAL.z + 0.17)
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.06, 16).rotateX(Math.PI / 2), mats.dark)
    knob.position.set(0, 0, 0.02)
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.1, 0.012), dialGlowMat)
    tick.position.set(0, 0.06, 0.05)
    dialPointer.add(knob, tick)
    dialPointer.position.set(DIAL.x, 0.78, DIAL.z + 0.18)
    root.add(pillar, face, glowRing, dialPointer)
    const label = sign(E.dynamo.signs.heat, 0.085, { color: '#ffb27a' })
    label.position.set(DIAL.x, 1.08, DIAL.z + 0.05)
    root.add(label)
    solids.push(box(DIAL.x, DIAL.z, 0.4, 0.36))
  }
  const lever = new THREE.Group()
  {
    const pillar = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.8, 0.3, 2, 0.04), mats.dark)
    pillar.position.set(LEVER.x, 0.4, LEVER.z)
    pillar.castShadow = !light
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.26), mats.steel)
    slot.position.set(LEVER.x, 0.81, LEVER.z)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.42, 10), mats.steel)
    rod.position.y = 0.21
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 12), tealMat)
    knob.position.y = 0.44
    lever.add(rod, knob)
    lever.position.set(LEVER.x, 0.81, LEVER.z)
    root.add(pillar, slot, lever)
    const label = sign(E.dynamo.signs.flip, 0.085, { color: '#7ff0e0' })
    label.position.set(LEVER.x, 1.42, LEVER.z)
    root.add(label)
    solids.push(box(LEVER.x, LEVER.z, 0.4, 0.36))
  }
  // a compass in a glass ball on a post: its needle free to turn every way, following the field
  const POST = { x: GL.x - 1.85, z: GL.z - 0.25 }
  const postNeedle = needle(0.22)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, GL.y - 0.15, 10), mats.brass)
    post.position.set(POST.x, (GL.y - 0.15) / 2, POST.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 20), mats.brass)
    foot.position.set(POST.x, 0.02, POST.z)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 20), glass)
    bulb.position.set(POST.x, GL.y, POST.z)
    bulb.renderOrder = 3
    postNeedle.position.set(POST.x, GL.y, POST.z)
    root.add(post, foot, bulb, postNeedle)
    solids.push(circle(POST.x, POST.z, 0.2))
  }
  const postDir = EARTH_B.clone()
  const tmpQ = new THREE.Quaternion()
  const X_AXIS = new THREE.Vector3(1, 0, 0)

  // ---- the dynamo's state (shared): spinning, the heat, the field's way round, the flips ----
  let spinOn = false
  let heat = 0 // 0..1, as set
  let heatSet = 0.75 // what the dial goes back to
  let tilt = 0 // 0: as today (normal), π: reversed (the target, once a flip is over)
  let flipN = 0
  let flip = null // { t, from, mine }
  let spinAmt = 0
  let heatAmt = 0
  let field = 0
  let order = 0
  let globeRot = 0
  let tiltNow = 0
  let fieldEff = 0
  let dynMine = false
  let toldGrow = false
  const FLIP_T = 3.6
  const fieldTarget = () => (spinAmt > 0.85 && heatAmt >= 0.3 ? 0.55 + (0.45 * (heatAmt - 0.3)) / 0.7 : 0)
  const dynamoPanel = lv => ({
    title: E.dynamo.title,
    color,
    blocks: [
      {
        slider: {
          label: E.dynamo.slider,
          min: 0,
          max: 100,
          step: 5,
          value: Math.round(heat * 100),
          onInput: v => slideHeat(v),
          format: v => `${nf(v)} %`,
          live: () => Math.round(heat * 100),
        },
      },
      { buttons: [['spin', () => dynamoStep('globe')], ['heat', () => dynamoStep('heat')], ['flip', () => dynamoStep('flip')]].map(([k, f]) => ({ label: E.dynamo.buttons[k], onClick: f })) },
      ...paras(E.dynamo.panel, lv),
    ],
  })
  const dynamoChanged = (delay = 3) => {
    dynMine = true
    ex.discover('dynamo', dynamoPanel, delay)
    share('dynamo')
  }
  function dynamoStep(what) {
    const S = E.dynamo.says
    const lv = level()
    if (what === 'globe') {
      spinOn = !spinOn
      play(spinOn ? 'select' : 'tap')
      if (spinOn) say(at(heat >= 0.3 ? S.spinHot : S.spin, lv))
      else say(at(field > 0.3 ? S.spinOff : S.stopped, lv))
      toldGrow = false
    } else if (what === 'heat') {
      if (heat > 0.01) {
        heatSet = heat
        heat = 0
        play('tap')
        say(at(field > 0.3 ? S.heatOff : S.cold, lv))
      } else {
        heat = heatSet >= 0.3 ? heatSet : 0.75
        play('select')
        say(at(spinOn ? S.heatSpin : S.heat, lv))
      }
      toldGrow = false
    } else if (what === 'flip') {
      if (flip) return say(at(W.busy, lv))
      if (fieldEff < 0.4) return say(at(S.flipNo, lv))
      flipN++
      startFlip(true)
      say(at(S.flip, lv))
    } else return
    dynamoChanged()
  }
  function startFlip(mine) {
    flip = { t: 0, from: tiltNow, mine }
    tilt = tilt > 1 ? 0 : Math.PI
    play('beam')
  }
  let dynSending = false
  function slideHeat(v) {
    heat = clamp(Math.round(v) / 100)
    if (heat >= 0.3) heatSet = heat
    dynMine = true
    toldGrow = false
    ex.discover('dynamo', dynamoPanel, 3)
    if (dynSending) return
    dynSending = true
    later(0.25, () => {
      dynSending = false
      share('dynamo')
    })
  }
  ex.add({
    id: 'dynamo',
    x: GL.x,
    z: GL.z + 2.35,
    radius: 2.1,
    manual: true,
    label: E.dynamo.label,
    verb: () => {
      const h = E.dynamo.hints
      if (flip) return h.flipping
      if (!spinOn && heat < 0.3) return h.spin
      if (!spinOn) return h.spinToo
      if (heat < 0.01) return h.heat
      if (heat < 0.3) return h.weak
      if (field < 0.5) return h.grow
      return h.flip
    },
    focus: focusOf(GL.x, 1.6, GL.z, 2.9, 4.4),
    act: () => ctx.showPanel(dynamoPanel),
  })
  const globeHit = new THREE.Mesh(new THREE.SphereGeometry(GL.r + 0.1, 16, 12), ghost)
  globeHit.position.set(GL.x, GL.y, GL.z)
  root.add(globeHit)
  clickable(globeHit, () => dynamoStep('globe'), { reach: 4.5 })
  const dialHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), ghost)
  dialHit.position.set(DIAL.x, 0.85, DIAL.z + 0.05)
  root.add(dialHit)
  clickable(dialHit, () => dynamoStep('heat'), { reach: 4.5 })
  const leverHit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.6), ghost)
  leverHit.position.set(LEVER.x, 1.05, LEVER.z)
  root.add(leverHit)
  // the lever is in reach from the sea floor recorder too
  clickable(leverHit, () => dynamoStep('flip'), { reach: 7.5 })

  updates.push((dt, t) => {
    const lv = level()
    const S = E.dynamo.says
    spinAmt = damp(spinAmt, spinOn ? 1 : 0, spinOn ? 1.4 : 0.9, dt)
    heatAmt = damp(heatAmt, heat, 2.2, dt)
    globeRot += spinAmt * 1.5 * dt
    spinner.rotation.y = globeRot
    // the field grows while the dynamo runs and fades when it stops (sped up: the real one would take
    // tens of thousands of years to die away)
    const target = fieldTarget()
    const was = field
    field = target > field ? Math.min(target, field + 0.3 * dt) : Math.max(target, field - 0.26 * dt)
    order = damp(order, target > 0 ? 1 : 0, 1.1, dt)
    if (dynMine && was < 0.5 && field >= 0.5 && !toldGrow) {
      toldGrow = true
      say(at(S.grow, lv))
    }
    if (dynMine && was > 0.12 && field <= 0.12 && target === 0) say(at(S.faded, lv))
    // a flip: the field weakens while its axis swings over
    let dip = 1
    if (flip) {
      flip.t += dt
      const k = clamp(flip.t / FLIP_T)
      tiltNow = flip.from + Math.PI * ease(k) + Math.sin(k * Math.PI * 3) * 0.12 * Math.sin(k * Math.PI)
      dip = 1 - 0.78 * Math.sin(Math.PI * k)
      if (k >= 1) {
        tiltNow = tilt
        if (flip.mine) say(at(tilt > 1 ? S.flippedR : S.flippedN, lv))
        flip = null
        play('discover')
      }
    } else tiltNow = tilt
    fieldEff = field * dip
    lineGroup.rotation.x = tiltNow
    lineMat.uniforms.uTime.value = t
    lineMat.uniforms.uGrow.value = clamp(field / 0.8) * (flip ? 0.6 + 0.4 * dip : 1)
    lineMat.uniforms.uK.value = clamp(fieldEff * 1.05 + (flip ? 0.25 * field : 0))
    arrowMat.opacity = clamp((fieldEff - 0.55) / 0.25)
    // the liquid and the core
    liqMat.uniforms.uTime.value = t
    liqMat.uniforms.uHeat.value = heatAmt
    liqMat.uniforms.uOrder.value = order
    coreMat.emissiveIntensity = 0.35 + 0.95 * heatAmt
    coreLight.intensity = (light ? 2.2 : 3) * (0.25 + heatAmt)
    // the iron atoms: tumbling in convection cells, or swirling in columns along the axis
    const conv = heatAmt * (1 - order)
    for (let i = 0; i < NATOM; i++) {
      const s = atomSeed[i]
      s.a += dt * conv * s.sp * 1.4
      // a loop in the cell's meridian plane: out along the radius and round along the meridian
      const ra = 0.52 + Math.cos(s.a) * s.loop
      const ta = Math.sin(s.a) * s.loop
      const st = Math.sin(s.th)
      const ct = Math.cos(s.th)
      convP.set((st * ra + ct * ta) * Math.cos(s.ph), ct * ra - st * ta, (st * ra + ct * ta) * Math.sin(s.ph))
      const dir = s.col % 2 ? 1 : -1
      s.sw += dt * order * dir * 2.4 * s.sp
      s.b += dt * order * 0.5 * s.sp
      const sAx = 0.5
      const phiC = (s.col * Math.PI) / 4 + t * 0.05 * order
      const yMax = Math.sqrt(Math.max(0, 0.72 ** 2 - sAx ** 2))
      colP.set(sAx * Math.cos(phiC) + s.rho * Math.cos(s.sw), yMax * Math.sin(s.b), sAx * Math.sin(phiC) + s.rho * Math.sin(s.sw))
      convP.lerp(colP, order)
      tmpM.makeTranslation(convP.x * GL.r * 1.05, convP.y * GL.r * 1.05, convP.z * GL.r * 1.05)
      atoms.setMatrixAt(i, tmpM)
    }
    atoms.instanceMatrix.needsUpdate = true
    // the dial and the lever
    dialPointer.rotation.z = 2.3 - heatAmt * 4.6
    dialGlowMat.emissiveIntensity = 0.15 + 2.2 * heatAmt
    lever.rotation.x = damp(lever.rotation.x, tilt > 1 ? -0.6 : 0.6, 6, dt)
    // the compass in the glass ball: the globe's field near it, or the Earth's own here
    const m = new THREE.Vector3(0, -Math.cos(tiltNow), -Math.sin(tiltNow))
    const rv = new THREE.Vector3(POST.x - GL.x, 0, POST.z - GL.z).normalize()
    const bG = rv.clone().multiplyScalar(3 * m.dot(rv)).sub(m).normalize()
    const want = bG.multiplyScalar(fieldEff * 5).add(EARTH_B).normalize()
    postDir.lerp(want, 1 - Math.exp(-dt * 3.5)).normalize()
    tmpQ.setFromUnitVectors(X_AXIS, postDir)
    postNeedle.quaternion.slerp(tmpQ, 1 - Math.exp(-dt * 8))
  })

  // ======================================================================================================
  // the sea floor recorder: a cut-away model of the ridge, the towed magnetometer's trace
  // ======================================================================================================
  // a display model: its top tilted toward the visitor (20°) so the strips read from eye height
  const RG = { x: 4.4, z: 2.0, len: 3.4, dep: 0.9, base: 0.5, top: 1.02, tilt: Math.tan(20 * DEG) }
  const FACE_X = RG.x - RG.dep / 2
  const BACK_X = RG.x + RG.dep / 2
  const RISE = RG.dep * RG.tilt // how much higher the top is at the back
  const hTop = d => {
    const a = Math.abs(d)
    // the ridge stands high where the floor is young and sinks as it ages and cools; a rift valley at the axis
    return RG.top - 0.075 * Math.sqrt(a) - 0.03 * Math.exp(-((d / 0.028) ** 2)) + 0.012 * Math.exp(-(((a - 0.06) / 0.03) ** 2))
  }
  // the record: one character per strip of floor, oldest first ('n' normal, 'r' reversed, '0' no field)
  let rec = ''
  let shownT = 0 // the model's time now, million years (animated toward rec.length × CELL)
  let runN = 0
  let run = null // { t, from, mine }
  let ridgeMine = false
  let fullTold = false
  const recT = () => rec.length * CELL
  const isReal = () => rec.length > 0 && REAL.startsWith(rec)
  /** The floor's strip at distance d (km, either side) when the model's time is T: its character, its age. */
  const stripAt = (km, T) => {
    const age = Math.abs(km) / HALF_RATE
    if (age > T) return null
    const i = Math.floor((T - age) / CELL)
    return { c: rec[Math.min(i, rec.length - 1)] ?? null, age }
  }
  const model = new THREE.Group()
  root.add(model)
  // the plinth
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(RG.dep + 0.16, RG.base, RG.len + 0.16, 2, 0.03), mats.dark)
    plinth.position.set(RG.x, RG.base / 2, RG.z)
    plinth.castShadow = !light
    plinth.receiveShadow = true
    model.add(plinth)
    solids.push(box(RG.x, RG.z, RG.dep + 0.2, RG.len + 0.2))
  }
  // the top: the sea floor seen from above, its strips and their frozen needles
  const topTex = canvasTex(128, 1024, null, { mipmaps: false })
  textures.push(topTex)
  const topGeo = new THREE.PlaneGeometry(RG.dep, RG.len, 1, 200).rotateX(-Math.PI / 2)
  {
    const p = topGeo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const d = p.getZ(i) / (RG.len / 2)
      p.setY(i, hTop(d) + (p.getX(i) + RG.dep / 2) * RG.tilt)
    }
    topGeo.translate(RG.x, 0, RG.z)
    topGeo.computeVertexNormals()
  }
  const topMat = new THREE.MeshStandardMaterial({ map: topTex, emissive: '#ffffff', emissiveMap: topTex, emissiveIntensity: 0.32, roughness: 0.75 })
  const top = new THREE.Mesh(topGeo, topMat)
  top.receiveShadow = true
  model.add(top)
  // the cut face toward the deck: the layers under the floor, the magma below the ridge
  const faceTex = canvasTex(1024, 256, null, { mipmaps: false })
  textures.push(faceTex)
  const faceGeo = new THREE.PlaneGeometry(RG.len, 1, 200, 1).rotateY(-Math.PI / 2)
  {
    const p = faceGeo.attributes.position
    for (let i = 0; i < p.count; i++) {
      const d = p.getZ(i) / (RG.len / 2)
      p.setY(i, p.getY(i) > 0 ? hTop(d) : RG.base)
    }
    faceGeo.translate(FACE_X, 0, RG.z)
    faceGeo.computeVertexNormals()
  }
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, emissive: '#ffffff', emissiveMap: faceTex, emissiveIntensity: 0.3, roughness: 0.8 })
  const face = new THREE.Mesh(faceGeo, faceMat)
  model.add(face)
  // the back and the ends, plain
  {
    const sideMat = new THREE.MeshStandardMaterial({ color: '#2f3238', roughness: 0.8 })
    sideMat.side = THREE.DoubleSide
    const backGeo = new THREE.PlaneGeometry(RG.len, 1, 60, 1).rotateY(Math.PI / 2)
    const bp = backGeo.attributes.position
    for (let i = 0; i < bp.count; i++) bp.setY(i, bp.getY(i) > 0 ? hTop(bp.getZ(i) / (RG.len / 2)) + RISE : RG.base)
    backGeo.translate(BACK_X, 0, RG.z)
    backGeo.computeVertexNormals()
    model.add(new THREE.Mesh(backGeo, sideMat))
    // the ends: from the base up to the sloping top
    for (const s of [-1, 1]) {
      const z = RG.z + (s * RG.len) / 2
      const yTop = hTop(s)
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute([FACE_X, RG.base, z, BACK_X, RG.base, z, BACK_X, yTop + RISE, z, FACE_X, RG.base, z, BACK_X, yTop + RISE, z, FACE_X, yTop, z], 3))
      g.computeVertexNormals()
      model.add(new THREE.Mesh(g, sideMat))
    }
  }
  const ridgePlaque = levelSign(E.ridge.signs.plaque, 0.075, { maxWidth: 2.4 })
  ridgePlaque.position.set(FACE_X - 0.09, 0.27, RG.z)
  ridgePlaque.rotation.y = -Math.PI / 2
  model.add(ridgePlaque)
  // west and east at the model's ends
  for (const [k, s] of [['west', -1], ['east', 1]]) {
    const t = sign(E.ridge.signs[k], 0.07, { color: '#c9d4e8' })
    t.position.set(FACE_X - 0.09, RG.base - 0.1, RG.z + s * (RG.len / 2 - 0.32))
    t.rotation.y = -Math.PI / 2
    model.add(t)
  }
  // the screen behind: the towed magnetometer's trace
  const scr = canvasScreen(2.5, 1.25, 1024)
  scr.group.position.set(RG.x + 1.12, 2.17, RG.z)
  scr.group.rotation.y = -Math.PI / 2
  model.add(scr.group)
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.55, 8), mats.steel)
    leg.position.set(RG.x + 1.16, 0.775, RG.z + s * 1.0)
    model.add(leg)
  }
  solids.push(box(RG.x + 1.16, RG.z, 0.3, 2.3))

  const colorOf = c => (c == null ? BARE : POL_COLOR[c])
  function drawTop(T, glowK) {
    topTex.userData.redraw((g, w, h) => {
      g.fillStyle = BARE
      g.fillRect(0, 0, w, h)
      // rows run along the ridge's length, west (top) to east (bottom); the axis in the middle
      const kmOf = row => ((row + 0.5) / h - 0.5) * 2 * SPAN_KM
      let prev = null
      let from = 0
      const flush = (to, c) => {
        if (c == null) return
        g.fillStyle = c === 'hot' ? '#ff9a3c' : colorOf(c)
        g.fillRect(0, from, w, to - from)
      }
      for (let row = 0; row <= h; row++) {
        const s = row < h ? stripAt(kmOf(row), T) : null
        const c = s ? (s.age < 0.06 && glowK > 0 ? 'hot' : s.c) : null
        if (row === h || c !== prev) {
          flush(row, prev)
          prev = c
          from = row
        }
      }
      // the floor's texture: speckle and the faults along the ridge
      const r = random(55)
      for (let i = 0; i < 2600; i++) {
        g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.07)'
        g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 2)
      }
      // the frozen needles: on each recorded strip wide enough, pointing north (right) or south (left)
      const half = h / 2
      for (const side of [-1, 1]) {
        for (let k = 1; k < 26; k++) {
          const row = half + side * (k * half) / 26
          const s = stripAt(kmOf(row), T)
          if (!s || !s.c || s.c === '0' || s.age < 0.06) continue
          const north = s.c === 'n'
          for (const x of [w * 0.3, w * 0.72]) {
            const L = 22
            const dir = north ? 1 : -1
            g.fillStyle = '#e0342c'
            g.beginPath()
            g.moveTo(x + dir * L, row)
            g.lineTo(x, row - 5)
            g.lineTo(x, row + 5)
            g.closePath()
            g.fill()
            g.fillStyle = '#f2f2f2'
            g.beginPath()
            g.moveTo(x - dir * L, row)
            g.lineTo(x, row - 5)
            g.lineTo(x, row + 5)
            g.closePath()
            g.fill()
          }
        }
      }
      // the rift at the axis
      g.fillStyle = glowK > 0 ? `rgba(255,170,60,${0.5 + 0.5 * glowK})` : 'rgba(20,16,14,0.55)'
      g.fillRect(0, half - 3, w, 6)
    })
  }
  function drawFace(T, glowK, flowT) {
    faceTex.userData.redraw((g, w, h) => {
      // columns run west (left) to east (right); the canvas's top is the floor, its bottom the model's base
      g.fillStyle = '#4a3f33'
      g.fillRect(0, 0, w, h)
      const colW = 4
      for (let x = 0; x < w; x += colW) {
        const d = ((x + colW / 2) / w - 0.5) * 2
        const km = d * SPAN_KM
        const depth = hTop(d) - RG.base // metres from the floor to the base here
        const px = m => (m / depth) * h
        const s = stripAt(km, T)
        const age = Math.abs(km) / HALF_RATE
        // mud settles on older floor
        const sed = 0.016 * Math.sqrt(Math.min(1, age / T_MAX))
        let y = 0
        g.fillStyle = '#8f7d5a'
        g.fillRect(x, y, colW, px(sed))
        y += px(sed)
        // the lava layer that carries the stripes
        g.fillStyle = s ? (s.age < 0.05 && glowK > 0 ? '#ffa040' : colorOf(s.c)) : BARE
        g.fillRect(x, y, colW, px(0.07))
        y += px(0.07)
        // dykes and gabbro below it
        g.fillStyle = '#3d4a44'
        g.fillRect(x, y, colW, px(0.13))
      }
      // the magma under the ridge: a lens and a rising plume, brighter while lava wells up
      const cx = w / 2
      const k = 0.45 + 0.55 * glowK
      const grd = g.createRadialGradient(cx, h * 0.62, 4, cx, h * 0.62, h * 0.5)
      grd.addColorStop(0, `rgba(255,190,90,${0.9 * k})`)
      grd.addColorStop(0.35, `rgba(240,110,40,${0.6 * k})`)
      grd.addColorStop(1, 'rgba(160,40,20,0)')
      g.fillStyle = grd
      g.fillRect(cx - h * 0.5, h * 0.25, h, h * 0.75)
      g.fillStyle = `rgba(255,170,70,${0.85 * k})`
      g.beginPath()
      g.ellipse(cx, h * 0.5, 34, 10, 0, 0, TAU)
      g.fill()
      g.fillRect(cx - 4, h * 0.2, 8, h * 0.3)
      // the mantle flowing out from under the ridge: chevrons, moving while it spreads
      g.strokeStyle = 'rgba(255,220,180,0.55)'
      g.lineWidth = 3
      for (const side of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
          const x = cx + side * (90 + (((i * 110 + flowT * 60) % 440)))
          const y = h * 0.82
          g.beginPath()
          g.moveTo(x - side * 14, y - 12)
          g.lineTo(x, y)
          g.lineTo(x - side * 14, y + 12)
          g.stroke()
        }
      }
    })
  }
  function drawScreen(T, lv) {
    const S = E.ridge.screen
    const { g, w, h } = scr
    g.fillStyle = '#0b1530'
    g.fillRect(0, 0, w, h)
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    g.fillStyle = '#9fe9de'
    fit(g, S.title, 30, 40, 36, 700, w * 0.6)
    const X = km => w / 2 + (km / SPAN_KM) * (w / 2 - 40)
    const traceY = h * 0.38
    const barY = h * 0.62
    const barH = 70
    // the axis and the sides
    g.strokeStyle = 'rgba(160,190,230,0.35)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(40, traceY)
    g.lineTo(w - 40, traceY)
    g.stroke()
    g.setLineDash([8, 8])
    g.beginPath()
    g.moveTo(w / 2, 70)
    g.lineTo(w / 2, barY + barH + 6)
    g.stroke()
    g.setLineDash([])
    g.textAlign = 'center'
    g.fillStyle = '#ffb27a'
    fit(g, S.ridge, w / 2, barY + barH + 30, 26, 700, 260)
    g.fillStyle = '#c9d4e8'
    g.textAlign = 'left'
    fit(g, S.west, 40, barY + barH + 30, 24, 700, 200)
    g.textAlign = 'right'
    fit(g, S.east, w - 40, barY + barH + 30, 24, 700, 200)
    if (rec.length === 0 || T <= 0) {
      g.textAlign = 'center'
      g.fillStyle = '#d2dbff'
      fit(g, at(S.empty, lv), w / 2, h * 0.5, 30, 600, w - 120)
      scr.tex.needsUpdate = true
      return
    }
    // the barcode: each strip's colour, both sides of the ridge
    for (let x = 40; x < w - 40; x += 2) {
      const km = ((x + 1 - w / 2) / (w / 2 - 40)) * SPAN_KM
      const s = stripAt(km, T)
      g.fillStyle = s ? colorOf(s.c) : '#1a2342'
      g.fillRect(x, barY, 2, barH)
    }
    // the trace: what the magnetometer reads, stronger over normal strips, weaker over reversed ones
    // (smoothed, as the field from strips 3 km down reaches the surface)
    g.strokeStyle = '#ffe28a'
    g.lineWidth = 3
    g.beginPath()
    let first = true
    for (let x = 40; x <= w - 40; x += 3) {
      const km0 = ((x - w / 2) / (w / 2 - 40)) * SPAN_KM
      let v = 0
      let n = 0
      for (let k = -4; k <= 4; k++) {
        const s = stripAt(km0 + k * 0.6, T)
        v += s ? (s.c === 'n' ? 1 : s.c === 'r' ? -1 : 0) : 0
        n++
      }
      const y = traceY - (v / n) * 70
      if (first) g.moveTo(x, y)
      else g.lineTo(x, y)
      first = false
    }
    g.stroke()
    // the key
    g.textAlign = 'left'
    let kx = w * 0.62
    for (const c of ['n', 'r', '0']) {
      g.fillStyle = POL_COLOR[c]
      g.fillRect(kx, 30, 26, 22)
      g.fillStyle = '#d2dbff'
      const label = S[c === 'n' ? 'normal' : c === 'r' ? 'reversed' : 'none']
      fit(g, label, kx + 34, 42, 22, 600, 100)
      kx += 34 + Math.min(100, g.measureText(label).width) + 22
    }
    // the real record's names, and at Scientist level the ages and distances
    if (isReal()) {
      g.textAlign = 'center'
      g.fillStyle = '#ffffff'
      const named = lv === 'scientist' ? [...CHRONS, ...SUBCHRONS] : CHRONS
      for (const [name, young, old] of named) {
        // the strips of this chron formed from (5 − old) to (5 − young) million years after the start
        const a = Math.max(0, T - (T_MAX - young))
        const b = Math.max(0, T - (T_MAX - old))
        if (b <= a) continue
        const sub = SUBCHRONS.some(sc => sc[0] === name)
        for (const side of name === 'Brunhes' ? [0] : [-1, 1]) {
          const mid = side === 0 ? 0 : (side * (a + b) * HALF_RATE) / 2
          const y = sub ? barY - 16 : barY + barH / 2
          g.font = sub ? '600 17px Outfit' : '700 21px Outfit'
          g.fillStyle = sub ? '#ffe28a' : '#ffffff'
          g.fillText(name, X(mid), y)
        }
      }
    }
    if (lv === 'scientist') {
      g.fillStyle = '#8fa3d0'
      g.font = '600 18px Outfit'
      g.textAlign = 'center'
      for (const km of [-60, -40, -20, 20, 40, 60]) g.fillText(`${nf(Math.abs(km))} km`, X(km), barY + barH + 58)
      g.textAlign = 'left'
      fit(g, fill(S.time, { t: nf(T, 1) }), 40, h - 24, 22, 600, w * 0.5)
    } else {
      g.fillStyle = '#8fa3d0'
      g.textAlign = 'left'
      fit(g, fill(S.timeKid, { t: nf(T, 1) }), 40, h - 24, 24, 600, w * 0.6)
    }
    scr.tex.needsUpdate = true
  }
  const ridgePanel = lv => ({
    title: E.ridge.title,
    color,
    blocks: [
      {
        slider: {
          label: E.ridge.slider,
          min: 0,
          max: T_MAX,
          step: 0.1,
          value: Math.round(recT() * 10) / 10,
          onInput: v => slideTime(v),
          format: v => fill(E.ridge.sliderUnit, { t: nf(v, 1) }),
          live: () => Math.round(recT() * 10) / 10,
        },
      },
      { buttons: [['erupt', () => ridgeStep('ridge')], ['flip', () => dynamoStep('flip')], ['real', () => ridgeStep('screen')], ['clear', () => ridgeStep('clear')]].map(([k, f]) => ({ label: E.ridge.buttons[k], onClick: f })) },
      ...paras(E.ridge.panel, lv),
    ],
  })
  const ridgeChanged = (delay = RUN_T + 1.2) => {
    ridgeMine = true
    ex.discover('ridge', ridgePanel, delay)
    share('ridge')
  }
  /** The field the lava cools in now: the globe's, if it is strong enough to leave a mark. */
  const polNow = () => (fieldEff > 0.45 ? (Math.cos(tiltNow) > 0 ? 'n' : 'r') : '0')
  function ridgeStep(what) {
    const S = E.ridge.says
    const lv = level()
    if (what === 'ridge') {
      if (run) return say(at(W.busy, lv))
      if (rec.length >= NCELL) {
        if (!fullTold) {
          fullTold = true
          return say(at(S.full, lv))
        }
        return ridgeStep('clear')
      }
      const p = polNow()
      const add = Math.min(NCELL - rec.length, Math.round(STEP / CELL))
      rec += p.repeat(add)
      runN++
      run = { t: 0, from: shownT, mine: true }
      play('fizz', { order: 0.7 })
      const key = p === 'n' ? 'normal' : p === 'r' ? 'reversed' : spinOn && heat >= 0.3 ? 'weak' : 'none'
      say(fill(at(S[key], lv), { km: nf(STEP * HALF_RATE, 2) }))
    } else if (what === 'screen') {
      if (run) return say(at(W.busy, lv))
      rec = REAL
      runN++
      run = null
      shownT = recT()
      fullTold = false
      play('discover')
      say(at(S.real, lv))
    } else if (what === 'clear') {
      if (run) return say(at(W.busy, lv))
      rec = ''
      runN++
      run = null
      shownT = 0
      fullTold = false
      play('tap')
      say(at(S.clear, lv))
    } else return
    ridgeChanged(what === 'ridge' ? RUN_T + 1.2 : 2.5)
  }
  let ridgeSending = false
  function slideTime(v) {
    const n = clamp(Math.round(Number(v) / CELL), 0, NCELL)
    if (n < rec.length) rec = rec.slice(0, n)
    else if (n > rec.length) rec += polNow().repeat(n - rec.length)
    run = null
    shownT = recT()
    fullTold = false
    ridgeMine = true
    ex.discover('ridge', ridgePanel, 2.5)
    if (ridgeSending) return
    ridgeSending = true
    later(0.25, () => {
      ridgeSending = false
      share('ridge')
    })
  }
  ex.add({
    id: 'ridge',
    x: RG.x - 1.85,
    z: RG.z,
    radius: 1.9,
    manual: true,
    label: E.ridge.label,
    verb: () => {
      const h = E.ridge.hints
      if (run) return h.watch
      if (rec.length >= NCELL) return isReal() ? h.again : h.full
      if (rec.length === 0) return fieldEff > 0.45 ? h.erupt : h.dynamo
      if (rec.length >= 3 * Math.round(STEP / CELL) && !isReal()) return h.real
      return h.more
    },
    focus: focusOf(RG.x + 0.25, 1.5, RG.z, 2.4, 3.6),
    act: () => ctx.showPanel(ridgePanel),
  })
  // taps: the model (top or face) lets lava out; the screen lays down the real record
  const modelHit = new THREE.Mesh(new THREE.BoxGeometry(RG.dep + 0.1, RG.top + RISE - RG.base + 0.08, RG.len), ghost)
  modelHit.position.set(RG.x, (RG.top + RISE + RG.base) / 2 + 0.02, RG.z)
  root.add(modelHit)
  clickable(modelHit, () => ridgeStep('ridge'), { reach: 4.5 })
  clickable(scr.face, () => ridgeStep('screen'), { reach: 5.5 })

  let lastDraw = ''
  let flowT = 0
  updates.push((dt, t) => {
    const lv = level()
    let glowK = 0
    if (run) {
      run.t += dt
      const k = clamp(run.t / RUN_T)
      shownT = run.from + (recT() - run.from) * ease(k)
      glowK = Math.sin(Math.PI * Math.min(1, k * 1.05))
      flowT += dt
      if (k >= 1) {
        shownT = recT()
        run = null
      }
    } else shownT = recT()
    const key = `${rec.length}|${rec.slice(-1)}|${isReal()}|${lv}|${Math.round(shownT * 200)}|${Math.round(glowK * 20)}`
    if (key !== lastDraw) {
      lastDraw = key
      drawTop(shownT, glowK)
      drawFace(shownT, glowK, flowT)
      drawScreen(shownT, lv)
    }
  })

  // ======================================================================================================
  // the wandering pole: a polar chart on the deckhouse wall
  // ======================================================================================================
  const PC = { x: 4.85, y: 1.82, r: 0.72 }
  const chartScr = (() => {
    const px = 1024
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = px
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures.push(tex)
    const group = new THREE.Group()
    const back = new THREE.Mesh(new THREE.CylinderGeometry(PC.r + 0.08, PC.r + 0.08, 0.06, 64).rotateX(Math.PI / 2), mats.dark)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(PC.r + 0.04, 0.03, 10, 80), mats.brass)
    rim.position.z = 0.04
    const face = new THREE.Mesh(new THREE.CircleGeometry(PC.r, 72), new THREE.MeshBasicMaterial({ map: tex, color: '#d8d8d8', toneMapped: false }))
    face.position.z = 0.035
    group.add(back, rim, face)
    return { group, g: canvas.getContext('2d'), w: px, tex, face }
  })()
  stage.onWall(chartScr.group, PC.x, PC.y)
  chartScr.group.position.z += 0.03
  const poleTitle = levelSign(E.pole.signs.title, 0.09, { maxWidth: 1.55, color: '#9fe9de' })
  poleTitle.position.set(PC.x, PC.y + PC.r + 0.24, stage.wall.z + 0.06)
  root.add(poleTitle)
  // the projection: the North Pole in the middle, 100° W straight down, out to 58° N at the rim
  const LAT_RIM = 62
  const LON_DOWN = -10
  const proj = (lon, lat) => {
    const rho = ((90 - lat) / (90 - LAT_RIM)) * (chartScr.w / 2 - 24)
    const th = (lon - LON_DOWN) * DEG
    return [chartScr.w / 2 + rho * Math.sin(th), chartScr.w / 2 + rho * Math.cos(th)]
  }
  // the chart without the track, drawn once
  const chartBase = document.createElement('canvas')
  chartBase.width = chartBase.height = chartScr.w
  {
    const g = chartBase.getContext('2d')
    const w = chartScr.w
    const c = w / 2
    g.fillStyle = '#0d1d3a'
    g.fillRect(0, 0, w, w)
    g.save()
    g.beginPath()
    g.arc(c, c, c - 6, 0, TAU)
    g.clip()
    g.fillStyle = '#12305a'
    g.fillRect(0, 0, w, w)
    const land = new Path2D()
    for (const ring of landRings()) {
      if (!ring.some(([, la]) => la > 45)) continue
      ring.forEach(([lo, la], i) => {
        const [x, y] = proj(lo, Math.max(la, -10))
        if (i) land.lineTo(x, y)
        else land.moveTo(x, y)
      })
      land.closePath()
    }
    g.fillStyle = '#3e5f58'
    g.fill(land, 'evenodd')
    // the graticule: 60°, 70°, 80° N and every 30° of longitude
    g.strokeStyle = 'rgba(170,200,240,0.28)'
    g.lineWidth = 2
    for (const lat of [60, 70, 80]) {
      const [, y] = proj(LON_DOWN, lat)
      g.beginPath()
      g.arc(c, c, y - c, 0, TAU)
      g.stroke()
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const [x, y] = proj(lon, LAT_RIM)
      g.beginPath()
      g.moveTo(c, c)
      g.lineTo(x, y)
      g.stroke()
    }
    // the places
    const S = E.pole.chart
    g.fillStyle = 'rgba(220,235,255,0.6)'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (const [k, lon, lat] of [['canada', -105, 66], ['greenland', -40, 73], ['siberia', 105, 70], ['alaska', -152, 67]]) {
      const [x, y] = proj(lon, lat)
      g.font = '700 34px Outfit'
      g.fillText(S[k], x, y)
    }
    g.restore()
    // the geographic North Pole: a star
    g.fillStyle = '#ffffff'
    g.beginPath()
    for (let k = 0; k < 10; k++) {
      const a = (k * Math.PI) / 5 - Math.PI / 2
      const r = k % 2 ? 7 : 18
      g.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r)
    }
    g.closePath()
    g.fill()
    g.font = '600 24px Outfit'
    g.fillStyle = 'rgba(255,255,255,0.85)'
    g.textAlign = 'center'
    g.fillText(S.geo, c, c + 42)
    g.strokeStyle = '#b9893a'
    g.lineWidth = 10
    g.beginPath()
    g.arc(c, c, c - 6, 0, TAU)
    g.stroke()
  }
  const poleAt = year => {
    const y = clamp(year, Y0, Y1)
    let i = 0
    while (i < POLE.length - 2 && POLE[i + 1][0] <= y) i++
    const [ya, loa, laa] = POLE[i]
    const [yb, lob, lab] = POLE[i + 1]
    const k = clamp((y - ya) / (yb - ya))
    // in the chart's plane, so crossing the date line stays a short step
    const [xa, za] = proj(loa, laa)
    const [xb, zb] = proj(lob, lab)
    return [xa + (xb - xa) * k, za + (zb - za) * k]
  }
  /** The pole's speed in a year (km a year), from the table around it. */
  const speedAt = year => {
    const y = clamp(Math.round(year), Y0 + 1, Y1)
    let i = 1
    while (i < POLE.length - 1 && POLE[i][0] < y) i++
    const a = POLE[i - 1]
    const b = POLE[i]
    return kmBetween([a[1], a[2]], [b[1], b[2]]) / (b[0] - a[0])
  }
  function drawPole(year, lv) {
    const { g, w } = chartScr
    const c = w / 2
    g.drawImage(chartBase, 0, 0)
    // the track so far, from faint (1590) to bright (now)
    g.lineCap = 'round'
    g.lineJoin = 'round'
    let prev = poleAt(Y0)
    for (let y = Y0 + 2; y <= year + 0.01; y += 2) {
      const p = poleAt(Math.min(y, year))
      const k = (y - Y0) / (Y1 - Y0)
      g.strokeStyle = `rgba(${Math.round(80 + 100 * k)},${Math.round(150 + 90 * k)},${Math.round(170 + 60 * k)},${0.45 + 0.55 * k})`
      g.lineWidth = 5 + 3 * k
      g.beginPath()
      g.moveTo(prev[0], prev[1])
      g.lineTo(p[0], p[1])
      g.stroke()
      prev = p
    }
    // the centuries along it
    g.font = '600 24px Outfit'
    g.textAlign = 'left'
    g.textAlign = 'center'
    for (const cy of [1600, 1700, 1800, 1900, 2000]) {
      if (cy > year) break
      const [x, y] = poleAt(cy)
      g.fillStyle = '#d2f6ef'
      g.beginPath()
      g.arc(x, y, 7, 0, TAU)
      g.fill()
      // labelled where they do not crowd: 1700 and 1900 lie close to 1600 and to Ross's 1831
      if (cy === 1700 || cy === 1900) continue
      g.fillStyle = 'rgba(210,246,239,0.9)'
      g.fillText(String(cy), x + (cy === 1800 ? -6 : 0), y - 22)
    }
    // where Ross found it
    if (year >= ROSS.year) {
      const [x, y] = proj(ROSS.lon, ROSS.lat)
      g.fillStyle = '#ffd166'
      g.fillRect(x - 2, y - 34, 4, 34)
      g.beginPath()
      g.moveTo(x + 2, y - 34)
      g.lineTo(x + 26, y - 26)
      g.lineTo(x + 2, y - 18)
      g.closePath()
      g.fill()
      g.font = '700 24px Outfit'
      g.textAlign = 'center'
      g.fillText(E.pole.chart.ross, x + 6, y + 30)
    }
    // the pole now
    const [px, py] = poleAt(year)
    g.fillStyle = 'rgba(255,80,60,0.35)'
    g.beginPath()
    g.arc(px, py, 22, 0, TAU)
    g.fill()
    g.fillStyle = '#ff4a3a'
    g.beginPath()
    g.arc(px, py, 11, 0, TAU)
    g.fill()
    // the year and the speed, at the bottom
    g.textAlign = 'center'
    g.fillStyle = 'rgba(13,29,58,0.82)'
    g.fillRect(c - 250, w - 190, 500, 120)
    g.fillStyle = '#ffffff'
    g.font = '700 64px Outfit'
    g.fillText(String(Math.round(year)), c, w - 148)
    g.fillStyle = '#9fe9de'
    fit(g, fill(at(E.pole.chart.speed, lv), { v: nf(Math.round(speedAt(year))) }), c, w - 96, 30, 600, 470)
    chartScr.tex.needsUpdate = true
  }

  // ---- the pole's state (shared): the year shown, or a playing run (its start and age) ----
  let poleYear = Y0
  let poleRun = null // { y0, age, mine }
  let poleMine = false
  let rossTold = false
  let fastTold = false
  const polePanel = lv => ({
    title: E.pole.title,
    color,
    blocks: [
      {
        slider: {
          label: E.pole.slider,
          min: Y0,
          max: Y1,
          step: 1,
          value: Math.round(poleYear),
          onInput: v => slideYear(v),
          format: v => String(Math.round(v)),
          live: () => Math.round(poleYear),
        },
      },
      { buttons: [['play', () => poleStep('chart')], ['ross', () => slideYear(ROSS.year)], ['fast', () => slideYear(2003)], ['now', () => slideYear(Y1)]].map(([k, f]) => ({ label: E.pole.buttons[k], onClick: f })) },
      ...paras(E.pole.panel, lv),
    ],
  })
  function poleStep(what) {
    const S = E.pole.says
    const lv = level()
    if (what !== 'chart') return
    if (poleRun) {
      poleYear = poleRun.y0 + poleRun.age * PLAY_RATE
      poleRun = null
      play('tap')
      say(at(S.pause, lv))
    } else {
      const from = poleYear >= Y1 - 1 ? Y0 : poleYear
      poleRun = { y0: from, age: 0, mine: true }
      rossTold = from > ROSS.year
      fastTold = from > 2003
      play('select')
      say(at(S.play, lv))
    }
    poleMine = true
    ex.discover('pole', polePanel, 9.5)
    share('pole')
  }
  let poleSending = false
  function slideYear(v) {
    poleYear = clamp(Math.round(Number(v)), Y0, Y1)
    poleRun = null
    poleMine = true
    ex.discover('pole', polePanel, 2)
    if (poleSending) return
    poleSending = true
    later(0.25, () => {
      poleSending = false
      share('pole')
    })
  }
  ex.add({
    id: 'pole',
    x: PC.x,
    z: stage.wall.z + 2.2,
    radius: 1.8,
    manual: true,
    label: E.pole.label,
    verb: () => (poleRun ? E.pole.hints.pause : E.pole.hints.play),
    focus: focusOf(PC.x, PC.y, stage.wall.z, 1.75, 1.75),
    act: () => ctx.showPanel(polePanel),
  })
  clickable(chartScr.face, () => poleStep('chart'), { reach: 4.5 })
  let poleKey = ''
  updates.push(dt => {
    const lv = level()
    const S = E.pole.says
    if (poleRun) {
      poleRun.age += dt
      poleYear = Math.min(Y1, poleRun.y0 + poleRun.age * PLAY_RATE)
      if (poleRun.mine && !rossTold && poleYear >= ROSS.year) {
        rossTold = true
        say(at(S.ross, lv))
      }
      if (poleRun.mine && !fastTold && poleYear >= 2003) {
        fastTold = true
        say(fill(at(S.fast, lv), { v: nf(Math.round(speedAt(2003))) }))
      }
      if (poleYear >= Y1) {
        if (poleRun.mine) say(fill(at(S.now, lv), { v: nf(Math.round(speedAt(Y1))) }))
        poleRun = null
      }
    }
    const key = `${Math.round(poleYear * 2)}|${lv}`
    if (key !== poleKey) {
      poleKey = key
      drawPole(poleYear, lv)
    }
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
    terLineMat.uniforms.uTime.value = t
    stage.update(t)
  })
  drawTop(0, 0)
  drawFace(0, 0, 0)
  drawScreen(0, level())
  drawPole(Y0, level())

  // a ray from the camera to a point, for the probes' real taps
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = obj => obj.getWorldPosition(new THREE.Vector3())

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.4 },
    cameraPitchMax: 0.42,
    spawn: { x: 0, z: 4.2, yaw: 0 },
    hostSpot: { x: -1.6, z: 2.9, yaw: Math.atan2(-1.6, -1.3) },
    back: { x: 0, z: 7.0, rot: Math.PI },
    // the easel on the left of the arrival, off the stations' lines of sight
    stand: { x: -3.5, z: 3.9, rot: Math.atan2(3.5, 0.6) },
    parts: {
      gilbert: {
        tap: (what, lat, side) => gilbertStep(what, lat, side), // 'ball' (with a latitude in degrees, a side ±1) | 'compass'
        slide: v => slideLat(v), // the panel's slider (degrees)
        get state() {
          return { lat: Math.round(terLat / DEG), side: terSide, n: binN, needle: Math.round(((needleAng - carPsi) / DEG) % 360) }
        },
      },
      dynamo: {
        tap: what => dynamoStep(what), // 'globe' | 'heat' | 'flip'
        heat: v => slideHeat(v), // the panel's slider (%)
        get state() {
          return { spin: spinOn, heat: Math.round(heat * 100), field: Math.round(field * 100) / 100, tilt: tilt > 1 ? 'reversed' : 'normal', flipping: !!flip }
        },
      },
      ridge: {
        tap: what => ridgeStep(what), // 'ridge' | 'screen' | 'clear'
        time: v => slideTime(v), // the panel's slider (million years)
        get state() {
          return { rec, t: recT(), real: isReal(), busy: !!run }
        },
      },
      pole: {
        tap: () => poleStep('chart'),
        year: v => slideYear(v), // the panel's slider
        get state() {
          return { year: Math.round(poleYear), playing: !!poleRun }
        },
      },
      // points to aim a real tap at (with rayTo): __ew.world.onTap(p.rayTo(p.at.globe()))
      at: {
        ball: (latDeg = 30, side = 1) => {
          const psi = psiOf(latDeg * DEG, side)
          return terrella.localToWorld(new THREE.Vector3(Math.cos(psi) * TER.r * 0.9, Math.sin(psi) * TER.r * 0.9, TER.r * 0.4))
        },
        compass: () => new THREE.Vector3(BIN.x, BIN.y, BIN.z),
        globe: () => new THREE.Vector3(GL.x, GL.y, GL.z),
        dial: () => world(dialHit),
        lever: () => world(leverHit),
        ridge: () => new THREE.Vector3(RG.x, RG.top + RISE / 2, RG.z + 0.3),
        screen: () => world(scr.face),
        chart: () => world(chartScr.face),
      },
      rayTo,
    },
    panels: { gilbert: gilbertPanel, dynamo: dynamoPanel, ridge: ridgePanel, pole: polePanel },
    shared: {
      gilbert: {
        get: () => ({ lat: Math.round(terLat / DEG), side: terSide, n: binN }),
        set: (s, liveSet) => {
          terLat = clamp(Math.round(Number(s?.lat) || 0), -90, 90) * DEG
          terSide = Number(s?.side) < 0 ? -1 : 1
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          gilMine = false
          if (liveSet && n === binN + 1) {
            binN = n
            kickCard(false)
          } else binN = n
          if (!liveSet) {
            carPsi = psiOf(terLat, terSide)
            needleAng = fieldAngle(carPsi)
            needleVel = 0
          }
        },
      },
      dynamo: {
        get: () => ({ spin: spinOn ? 1 : 0, heat: Math.round(heat * 100), rev: tilt > 1 ? 1 : 0, n: flipN }),
        set: (s, liveSet) => {
          spinOn = !!s?.spin
          heat = clamp((Number(s?.heat) || 0) / 100)
          if (heat >= 0.3) heatSet = heat
          const rev = !!s?.rev
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          dynMine = false
          toldGrow = true
          if (liveSet && n === flipN + 1 && !flip) {
            flipN = n
            startFlip(false)
            tilt = rev ? Math.PI : 0
          } else {
            flipN = n
            tilt = rev ? Math.PI : 0
            if (!liveSet) {
              flip = null
              tiltNow = tilt
              spinAmt = spinOn ? 1 : 0
              heatAmt = heat
              field = fieldTarget()
              order = field > 0 ? 1 : 0
            }
          }
        },
      },
      ridge: {
        get: () => ({ rec, n: runN }),
        set: (s, liveSet) => {
          const r = typeof s?.rec === 'string' ? s.rec.replace(/[^nr0]/g, '').slice(0, NCELL) : ''
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          ridgeMine = false
          const grew = r.length > rec.length && r.startsWith(rec)
          if (liveSet && n === runN + 1 && grew && r.length - rec.length <= Math.round(STEP / CELL)) {
            run = { t: 0, from: shownT, mine: false }
            play('fizz', { order: 0.5 })
          } else run = null
          rec = r
          runN = n
          if (!run) shownT = recT()
          fullTold = false
        },
      },
      pole: {
        // a run playing shares its start and age, not the moving year (the age stops at the run's end)
        get: () => (poleRun ? { y: Math.round(poleRun.y0), play: 1, age: Math.round(Math.min(poleRun.age, (Y1 - poleRun.y0) / PLAY_RATE) * 10) / 10 } : { y: Math.round(poleYear), play: 0, age: 0 }),
        set: (s, liveSet, ago = 0) => {
          const y = clamp(Math.round(Number(s?.y) || Y0), Y0, Y1)
          poleMine = false
          if (s?.play) {
            const age = Math.max(0, Number(s?.age) || 0) + (Number(ago) || 0)
            poleRun = { y0: y, age, mine: false }
            poleYear = Math.min(Y1, y + age * PLAY_RATE)
            if (poleYear >= Y1) poleRun = null
          } else {
            poleRun = null
            poleYear = y
          }
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
      for (const tx of textures) tx.dispose()
      for (const d of disposers) d()
    },
  }
}
