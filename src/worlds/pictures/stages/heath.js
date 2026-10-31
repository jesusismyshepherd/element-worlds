// A stage for picture rooms (docs/knowledge/picture-rooms.md): a heath at night, flat as the heaths of
// Drenthe in the Netherlands: low clumps of heather, sandy paths, a few Scots pines and junipers, the edge of
// a pine forest round three sides and the heath open to the south, far and flat to a low horizon. A clear,
// dark sky whose stars and Milky Way turn: they sit in the celestial sphere for latitude `lat`, and
// `sky.setLst(rad)` turns them to a local sidereal time (the Earth turning), so a scene can wait for part of
// the sky to rise or set. `sky.galDir(l, b)` and `sky.eqDir(ra, dec)` give the world direction of a point in
// the sky (galactic or equatorial, radians), `sky.altAz(dir)` its altitude and azimuth. The room's compass:
// north is +z, south -z, east -x, west +x (so a visitor facing -z faces south, east on their left). Faint
// light domes of far towns low on the horizon, `glows`: [[azimuth, strength]] (azimuth east of north).
// The walkable part is a circle of `radius` with a low wooden rail round it (`gaps` leave it open), sandy
// `paths` and `clearings` where the scene walks. The environment's light is kept low; the sky lights the land.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { nightSky } from '../../common/sky.js'
import { smooth, random } from '../../wings/noble/kit.js'
import { box } from '../../../engine/collide.js'
import { ringWall } from '../kit.js'

const TAU = Math.PI * 2
const DEG = Math.PI / 180

// smooth value noise (0..1)
const hash = (i, j) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function noise(x, z) {
  const i = Math.floor(x)
  const j = Math.floor(z)
  const fx = x - i
  const fz = z - j
  const u = fx * fx * (3 - 2 * fx)
  const v = fz * fz * (3 - 2 * fz)
  const a = hash(i, j) + (hash(i + 1, j) - hash(i, j)) * u
  const b = hash(i, j + 1) + (hash(i + 1, j + 1) - hash(i, j + 1)) * u
  return a + (b - a) * v
}

/** Distance from (x, z) to the segment a-b, in the ground plane. */
function toSegment(x, z, [ax, az], [bx, bz]) {
  const dx = bx - ax
  const dz = bz - az
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)))
  return Math.hypot(x - ax - dx * t, z - az - dz * t)
}

// equatorial (J2000) to galactic: r_gal = G r_eq (the IAU rotation); its transpose goes back
const G = [
  [-0.0548755604, -0.8734370902, -0.4838350155],
  [0.4941094279, -0.444829630, 0.7469822445],
  [-0.867666149, -0.1980763734, 0.4559837762],
]
/** A point of the galaxy (l, b in radians) as an equatorial unit vector [x, y, z] (x to RA 0, z to the pole). */
export function galToEq(l, b) {
  const g = [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)]
  return [0, 1, 2].map(i => G[0][i] * g[0] + G[1][i] * g[1] + G[2][i] * g[2])
}
/** An equatorial point (ra, dec in radians) as a unit vector. */
export const eqVec = (ra, dec) => [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)]

/** Scots pines: an instanced trunk and crown for each [x, z, height]; one draw call each. */
function pines(spots, { light, trunkMat, crownMat, seed = 5 }) {
  const rnd = random(seed)
  // a crown of three squashed lumps, flat-topped as an old Scots pine's
  const lumps = []
  for (const [x, y, z, s] of [[0, 0.1, 0, 1], [0.5, -0.45, 0.25, 0.72], [-0.45, -0.3, -0.3, 0.78], [0.1, -0.85, -0.1, 0.6]]) {
    const g = new THREE.IcosahedronGeometry(1, light ? 0 : 1)
    g.scale(s * 1.05, s * 0.72, s * 0.95)
    g.translate(x, y, z)
    lumps.push(g)
  }
  const crownGeo = mergeGeometries(lumps)
  lumps.forEach(g => g.dispose())
  const trunkGeo = new THREE.CylinderGeometry(0.11, 0.17, 1, 6).translate(0, 0.5, 0)
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, spots.length)
  const crowns = new THREE.InstancedMesh(crownGeo, crownMat, spots.length)
  const o = new THREE.Object3D()
  spots.forEach(([x, z, h, y0 = 0], i) => {
    const lean = (rnd() - 0.5) * 0.12
    o.position.set(x, y0, z)
    o.rotation.set(lean, rnd() * TAU, (rnd() - 0.5) * 0.12)
    o.scale.set(h / 9, h, h / 9)
    o.updateMatrix()
    trunks.setMatrixAt(i, o.matrix)
    o.position.set(x, y0 + h * 0.9, z + Math.sin(lean) * h * 0.1)
    o.rotation.set(0, rnd() * TAU, 0)
    const w = h * (0.15 + rnd() * 0.07)
    o.scale.set(w, w * (0.9 + rnd() * 0.5), w)
    o.updateMatrix()
    crowns.setMatrixAt(i, o.matrix)
  })
  return [trunks, crowns]
}

/**
 * radius: the walkable circle; lat: the latitude (degrees) the sky is set for; lst: the sidereal time to start
 * at (radians); paths: polylines [[x, z], ...] of sand (1.2 m wide); clearings: [[x, z, r]] patches of sand;
 * gaps: [[a0, a1]] angles (atan2(z, x)) where the rail round the edge is left out; forest: how far the
 * forest's edge begins (m), and openSouth, the half-width (radians) of the open heath to the south;
 * glows: [[azimuth, strength]] light domes of far towns.
 */
export function heathStage({
  radius = 13, light = false, pixelRatio = 1, lat = 52.8, lst = 0, paths = [], clearings = [], gaps = [],
  forest = { near: 150, openSouth: 1.1 }, glows = [[2.3, 0.6], [0.6, 0.45]],
} = {}) {
  const group = new THREE.Group()
  const disposers = []
  const EDGE = radius + 0.6
  const FAR = 900

  /** The ground's height: flat where people walk, then the heath's gentle swells, a little higher far off. */
  function groundAt(x, z) {
    const r = Math.hypot(x, z)
    if (r <= EDGE) return 0
    const s = smooth(EDGE, EDGE + 25, r)
    let h = (noise(x * 0.03, z * 0.03) - 0.45) * 1.6 * s
    h += (noise(x * 0.006 + 3, z * 0.006 + 7) - 0.5) * 7 * smooth(80, 400, r)
    return h
  }

  // ---- the sky: a dark dome (it does not turn), the stars and the Milky Way (they turn) ----
  const dome = nightSky({ radius: 900, stars: 0, top: '#020309', mid: '#060a1e', horizon: '#131a38', pixelRatio })
  group.add(dome)
  const phi = lat * DEG
  const P = new THREE.Vector3(0, Math.sin(phi), Math.cos(phi)) // the celestial pole, north (+z)
  const Q = new THREE.Vector3(0, Math.cos(phi), -Math.sin(phi)) // the equator on the meridian, south
  const E = new THREE.Vector3(-1, 0, 0) // east
  const celestial = new THREE.Group() // its own axes are the equatorial ones: x to RA 0, z to the pole
  group.add(celestial)
  const basis = new THREE.Matrix4()
  const u = new THREE.Vector3()
  const v = new THREE.Vector3()
  let lstNow = lst
  function setLst(a) {
    lstNow = a
    u.copy(Q).multiplyScalar(Math.cos(a)).addScaledVector(E, -Math.sin(a))
    v.copy(Q).multiplyScalar(Math.sin(a)).addScaledVector(E, Math.cos(a))
    basis.makeBasis(u, v, P)
    celestial.quaternion.setFromRotationMatrix(basis)
    celestial.updateMatrixWorld(true)
  }
  setLst(lst)

  // stars: some all over the sky, more crowded along the Milky Way
  const NS = light ? 1700 : 3800
  const pos = new Float32Array(NS * 3)
  const col = new Float32Array(NS * 3)
  const size = new Float32Array(NS)
  const phase = new Float32Array(NS)
  const tint = [new THREE.Color('#cfe0ff'), new THREE.Color('#fff4e0'), new THREE.Color('#ffd2b0'), new THREE.Color('#bcd2ff')]
  const rs = random(1956)
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rs() * 0.999)) * Math.cos(TAU * rs())
  for (let i = 0; i < NS; i++) {
    let p
    if (rs() < 0.45) {
      // in the Milky Way: near the galactic plane, a few more toward its centre
      const l = rs() < 0.3 ? gauss() * 0.9 : rs() * TAU
      p = galToEq(l, gauss() * 0.12)
    } else {
      const z = rs() * 2 - 1
      const a = rs() * TAU
      const r = Math.sqrt(1 - z * z)
      p = [Math.cos(a) * r, Math.sin(a) * r, z]
    }
    pos.set(p.map(c => c * 880), i * 3)
    const c = tint[(rs() * tint.length) | 0]
    col.set([c.r, c.g, c.b], i * 3)
    size[i] = rs() < 0.05 ? 2.6 + rs() * 1.6 : 0.7 + rs() * 1.3
    phase[i] = rs() * 100
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  starGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: { uTime: { value: 0 }, uScale: { value: pixelRatio } },
    vertexShader: /* glsl */ `
      attribute float aSize; attribute float aPhase; attribute vec3 color;
      uniform float uTime; uniform float uScale;
      varying vec3 vColor; varying float vTw;
      void main() {
        vColor = color;
        // low stars fade into the haze; below the horizon the land hides them
        vec3 w = normalize(mat3(modelMatrix) * position);
        float low = smoothstep(-0.02, 0.16, w.y);
        vTw = (0.65 + 0.35 * sin(uTime * (0.6 + fract(aPhase) * 1.7) + aPhase)) * (0.25 + 0.75 * low);
        gl_PointSize = aSize * uScale * (0.85 + 0.3 * vTw);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor; varying float vTw;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor * vTw * 1.4, a);
      }`,
  })
  const stars = new THREE.Points(starGeo, starMat)
  stars.frustumCulled = false
  stars.renderOrder = -9
  stars.raycast = () => {}
  celestial.add(stars)

  // the Milky Way: a band of light round the galactic plane, brightest toward its centre, a dark lane of dust
  // along it (one shader on a sphere just inside the stars, in the celestial sphere's own axes)
  const core = new THREE.Vector3(...galToEq(0, 0))
  const gpole = new THREE.Vector3(...galToEq(0, Math.PI / 2))
  const band = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: { uN: { value: gpole }, uCore: { value: core }, uK: { value: light ? 0.8 : 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vDir; varying vec3 vWorld;
      void main() {
        vDir = normalize(position);
        vWorld = normalize(mat3(modelMatrix) * position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uN; uniform vec3 uCore; uniform float uK;
      varying vec3 vDir; varying vec3 vWorld;
      float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float noise(vec3 x) {
        vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.07; a *= 0.5; } return v; }
      void main() {
        vec3 d = normalize(vDir);
        float b = dot(d, uN);
        float mid = max(dot(d, uCore), 0.0);
        float w = 0.12 + 0.1 * pow(mid, 3.0);
        float bandK = exp(-b * b / (w * w));
        float clouds = fbm(d * 7.0);
        float lane = exp(-pow((b - 0.012 + 0.02 * sin(dot(d, vec3(9.0, 4.0, 7.0)))) / 0.028, 2.0)) * smoothstep(0.05, 0.8, mid + fbm(d * 11.0) * 0.5);
        float k = bandK * (0.3 + 1.1 * clouds * clouds) * (1.0 - 0.75 * lane) * (0.45 + 1.1 * pow(mid, 5.0));
        float up = smoothstep(0.0, 0.25, vWorld.y);
        vec3 c = mix(vec3(0.55, 0.6, 0.86), vec3(1.0, 0.88, 0.7), pow(mid, 4.0));
        gl_FragColor = vec4(c * k * 0.3 * uK * up, 1.0);
      }`,
  })
  const bandDome = new THREE.Mesh(new THREE.SphereGeometry(860, 64, 32), band)
  bandDome.renderOrder = -9.5
  bandDome.frustumCulled = false
  bandDome.raycast = () => {}
  celestial.add(bandDome)

  // far towns' light, low on the horizon (it does not turn)
  if (glows.length) {
    const towns = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      // each glow as (its horizontal direction in (east, north) = (-x, z), its strength)
      uniforms: { uG: { value: glows.map(([az, k]) => new THREE.Vector3(Math.sin(az), Math.cos(az), k)).concat(Array(4).fill(new THREE.Vector3())).slice(0, 4) } },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uG[4];
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec2 h = normalize(vec2(-d.x, d.z) + 1e-5);
          float k = 0.0;
          for (int i = 0; i < 4; i++) {
            float a = dot(h, uG[i].xy);
            k += uG[i].z * pow(clamp(a, 0.0, 1.0), 18.0);
          }
          float low = exp(-pow(max(d.y, 0.0) / 0.07, 1.4)) * smoothstep(-0.02, 0.01, d.y);
          gl_FragColor = vec4(vec3(1.0, 0.62, 0.32) * k * low * 0.16, 1.0);
        }`,
    })
    const townDome = new THREE.Mesh(new THREE.SphereGeometry(850, 48, 16), towns)
    townDome.renderOrder = -9.4
    townDome.frustumCulled = false
    townDome.raycast = () => {}
    group.add(townDome)
  }

  // ---- the land: rings round the middle, out to the far horizon ----
  const rings = []
  for (let r = 0; r < radius; r += 2) rings.push(r)
  for (let r = radius; r < 60; r += 1.5) rings.push(r)
  for (let r = 60; r < 300; r += 8) rings.push(r)
  for (let r = 300; r <= FAR; r += 25) rings.push(r)
  const SEG = light ? 96 : 160
  const lp = []
  const lc = []
  const idx = []
  const cHeath = new THREE.Color('#2c2433')
  const cGrass = new THREE.Color('#25302c')
  const cSand = new THREE.Color('#3f3936')
  const cFar = new THREE.Color('#1a1828')
  const c = new THREE.Color()
  for (let i = 0; i < rings.length; i++) {
    for (let j = 0; j <= SEG; j++) {
      const a = (j / SEG) * TAU
      const x = Math.cos(a) * rings[i]
      const z = Math.sin(a) * rings[i]
      lp.push(x, groundAt(x, z), z)
      const n = noise(x * 0.12, z * 0.12)
      c.copy(cHeath).lerp(cGrass, smooth(0.55, 0.8, n)).lerp(cSand, smooth(0.86, 0.95, noise(x * 0.05 + 4, z * 0.05)) * 0.7)
      c.lerp(cFar, smooth(120, 600, rings[i]))
      c.multiplyScalar(0.85 + noise(x * 0.4, z * 0.4) * 0.3)
      lc.push(c.r, c.g, c.b)
    }
  }
  const W = SEG + 1
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < SEG; j++) {
      const a = i * W + j
      const b = (i + 1) * W + j
      // wound so the faces look up (counter-clockwise seen from above)
      idx.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  const landGeo = new THREE.BufferGeometry()
  landGeo.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3))
  landGeo.setAttribute('color', new THREE.Float32BufferAttribute(lc, 3))
  landGeo.setIndex(idx)
  landGeo.computeVertexNormals()
  const land = new THREE.Mesh(landGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }))
  group.add(land)

  // ---- where people walk: heather, and sand where the scene walks ----
  const PX = 1024
  const span = EDGE * 2
  const toPx = q => ((q + EDGE) / span) * PX
  const cv = document.createElement('canvas')
  cv.width = cv.height = PX
  const g = cv.getContext('2d')
  g.fillStyle = '#2e2634'
  g.fillRect(0, 0, PX, PX)
  const rnd = random(1420)
  for (let i = 0; i < 12000; i++) {
    const t = rnd()
    g.fillStyle = t < 0.4 ? `rgba(70,44,72,${0.3 + rnd() * 0.4})` : t < 0.7 ? `rgba(34,46,40,${0.3 + rnd() * 0.4})` : `rgba(20,16,22,${0.3 + rnd() * 0.4})`
    const s = 1.5 + rnd() * 3
    g.fillRect(rnd() * PX, rnd() * PX, s, s * (0.6 + rnd() * 0.8))
  }
  g.lineCap = 'round'
  g.lineJoin = 'round'
  const k = PX / span
  for (const [w, colr] of [[1.45, 'rgba(70,62,58,0.6)'], [1.2, '#5a5149']]) {
    g.strokeStyle = colr
    g.fillStyle = colr
    g.lineWidth = w * k
    for (const p of paths) {
      g.beginPath()
      p.forEach(([x, z], i) => (i ? g.lineTo(toPx(x), toPx(z)) : g.moveTo(toPx(x), toPx(z))))
      g.stroke()
    }
    for (const [x, z, r] of clearings) {
      g.beginPath()
      g.arc(toPx(x), toPx(z), (r + (w - 1.2) / 2) * k, 0, TAU)
      g.fill()
    }
  }
  // grains and pebbles in the sand
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * PX
    const y = rnd() * PX
    const q = 95 + rnd() * 50
    g.fillStyle = `rgba(${q},${q - 8},${q - 14},${0.12 + rnd() * 0.2})`
    g.fillRect(x, y, 1.5, 1.5)
  }
  const groundTex = new THREE.CanvasTexture(cv)
  groundTex.colorSpace = THREE.SRGBColorSpace
  groundTex.anisotropy = 4
  disposers.push(() => groundTex.dispose())
  const heath = new THREE.Mesh(new THREE.CircleGeometry(EDGE + 0.4, 96), new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1 }))
  heath.rotation.x = -Math.PI / 2
  heath.position.y = 0.01
  group.add(heath)

  // ---- heather: low round clumps, off the sand, thinning out far away ----
  const onSand = (x, z) =>
    paths.some(p => p.some((q, i) => i > 0 && toSegment(x, z, p[i - 1], q) < 0.9)) || clearings.some(([cx, cz, r]) => Math.hypot(x - cx, z - cz) < r + 0.3)
  const CLUMPS = light ? 900 : 2600
  const clumpGeo = new THREE.IcosahedronGeometry(1, light ? 0 : 1)
  clumpGeo.scale(1, 0.45, 1)
  clumpGeo.translate(0, 0.15, 0)
  const clumps = new THREE.InstancedMesh(clumpGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true }), CLUMPS)
  const o = new THREE.Object3D()
  const purple = [new THREE.Color('#3a2a3c'), new THREE.Color('#302533'), new THREE.Color('#2a2f29'), new THREE.Color('#43304a')]
  let n = 0
  for (let tries = 0; n < CLUMPS && tries < CLUMPS * 6; tries++) {
    const a = rnd() * TAU
    const r = n < CLUMPS * 0.55 ? Math.sqrt(rnd()) * (radius + 0.2) : radius + 1 + Math.pow(rnd(), 1.6) * 45
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (r < EDGE && onSand(x, z)) continue
    const s = 0.1 + rnd() * 0.18
    o.position.set(x, groundAt(x, z) - 0.04, z)
    o.rotation.set(0, rnd() * TAU, 0)
    o.scale.set(s * (0.8 + rnd() * 0.6), s * (0.7 + rnd() * 0.7), s * (0.8 + rnd() * 0.6))
    o.updateMatrix()
    clumps.setMatrixAt(n, o.matrix)
    clumps.setColorAt(n, purple[(rnd() * purple.length) | 0])
    n++
  }
  clumps.count = n
  clumps.raycast = () => {}
  group.add(clumps)

  // ---- trees: a few pines and junipers on the heath, the forest's edge round three sides ----
  const trunkMat = new THREE.MeshStandardMaterial({ color: '#4a3530', roughness: 0.95 })
  const crownMat = new THREE.MeshStandardMaterial({ color: '#1d2b26', roughness: 1, flatShading: true })
  const spots = []
  const southOf = a => Math.abs(Math.atan2(Math.sin(a + Math.PI / 2), Math.cos(a + Math.PI / 2))) // 0 due south (-z)
  // solitary pines out on the heath
  for (let i = 0; i < 26; i++) {
    const a = rnd() * TAU
    const r = radius + 6 + rnd() * 70
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (southOf(a) < 0.5 && r < 60) continue
    spots.push([x, z, 7 + rnd() * 9, groundAt(x, z)])
  }
  // the forest's edge, open to the south
  const FOREST = light ? 420 : 1100
  for (let i = 0; i < FOREST; i++) {
    const a = rnd() * TAU
    if (southOf(a) < forest.openSouth + rnd() * 0.3) continue
    const r = forest.near + Math.pow(rnd(), 0.7) * 220
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    spots.push([x, z, 12 + rnd() * 10, groundAt(x, z)])
  }
  const [trunks, crowns] = pines(spots, { light, trunkMat, crownMat })
  trunks.raycast = () => {}
  crowns.raycast = () => {}
  group.add(trunks, crowns)
  // junipers: dark narrow cones, standing about like people
  const JUN = light ? 18 : 40
  const junipers = new THREE.InstancedMesh(new THREE.ConeGeometry(0.5, 1, 7).translate(0, 0.5, 0), crownMat, JUN)
  let jn = 0
  for (let tries = 0; jn < JUN && tries < 400; tries++) {
    const a = rnd() * TAU
    const r = radius + 2.5 + rnd() * 40
    if (southOf(a) < 0.35 && r < 45) continue
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const h = 1.4 + rnd() * 2.6
    o.position.set(x, groundAt(x, z) - 0.05, z)
    o.rotation.set(0, rnd() * TAU, 0)
    o.scale.set(h * 0.28, h, h * 0.28)
    o.updateMatrix()
    junipers.setMatrixAt(jn++, o.matrix)
  }
  junipers.count = jn
  junipers.raycast = () => {}
  group.add(junipers)

  // ---- a low rail of rough posts round the walkable circle, as on a nature reserve's paths ----
  const wood = new THREE.MeshStandardMaterial({ color: '#4d4038', roughness: 0.95 })
  const FR = radius + 0.45
  const POSTS = Math.round((TAU * FR) / 2.2)
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a))
  const inGap = a => gaps.some(([a0, a1]) => wrap(a - a0) >= 0 && wrap(a - a0) <= wrap(a1 - a0))
  const posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.07, 0.7, 6).translate(0, 0.35, 0), wood, POSTS)
  let pn = 0
  for (let i = 0; i < POSTS; i++) {
    const a = (i / POSTS) * TAU
    if (inGap(a)) continue
    o.position.set(Math.cos(a) * FR, 0, Math.sin(a) * FR)
    o.rotation.set((rnd() - 0.5) * 0.08, rnd() * TAU, (rnd() - 0.5) * 0.08)
    o.scale.set(1, 0.85 + rnd() * 0.3, 1)
    o.updateMatrix()
    posts.setMatrixAt(pn++, o.matrix)
  }
  posts.count = pn
  group.add(posts)
  const opens = gaps.map(([a0, a1]) => [wrap(a0), wrap(a0) + wrap(a1 - a0)]).sort((p, q) => p[0] - q[0])
  const arcs = []
  if (!opens.length) arcs.push([0, TAU])
  else opens.forEach(([, end], i) => arcs.push([end, (i + 1 < opens.length ? opens[i + 1][0] : opens[0][0] + TAU) - end]))
  for (const [start, arc] of arcs) {
    const holder = new THREE.Group()
    const rail = new THREE.Mesh(new THREE.TorusGeometry(FR, 0.03, 5, Math.max(8, Math.round(arc * 24)), arc), wood)
    rail.rotation.x = Math.PI / 2
    holder.add(rail)
    holder.rotation.y = -start
    holder.position.y = 0.6
    group.add(holder)
  }
  const solids = ringWall(radius)

  // starlight: a bluish sky above, the dark heath below, a faint light from high in the south
  group.add(new THREE.HemisphereLight('#5d68a8', '#18131b', 1.05))
  const starlight = new THREE.DirectionalLight('#a9b4ff', 0.4)
  starlight.position.set(-8, 30, -14)
  group.add(starlight, starlight.target)

  const dirOut = new THREE.Vector3()
  return {
    group,
    groundAt,
    solids,
    env: {
      background: new THREE.Color('#03040b'),
      fog: new THREE.Fog('#0b0e20', 120, 1100),
      exposure: 1.0,
      envIntensity: 0.1,
      bloom: { strength: 0.75, radius: 0.5, threshold: 0.72 },
      fov: 60,
      far: 2400,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 14, minZ: -radius - 1, maxZ: radius + 1 },
    sky: {
      setLst,
      get lst() {
        return lstNow
      },
      /** The world direction of an equatorial unit vector [x, y, z] at the current (or the given) sidereal time. */
      eqVecDir(p, out = new THREE.Vector3(), at = null) {
        if (at != null && at !== lstNow) {
          const keep = lstNow
          setLst(at)
          out.set(p[0], p[1], p[2]).applyQuaternion(celestial.quaternion)
          setLst(keep)
          return out
        }
        return out.set(p[0], p[1], p[2]).applyQuaternion(celestial.quaternion)
      },
      eqDir(ra, dec, out, at) {
        return this.eqVecDir(eqVec(ra, dec), out, at)
      },
      galDir(l, b = 0, out, at) {
        return this.eqVecDir(galToEq(l, b), out, at)
      },
      /** Altitude and azimuth (radians, azimuth east of north) of a world direction. */
      altAz(d) {
        dirOut.copy(d).normalize()
        return { alt: Math.asin(Math.max(-1, Math.min(1, dirOut.y))), az: Math.atan2(-dirOut.x, dirOut.z) }
      },
    },
    update(t) {
      starMat.uniforms.uTime.value = t
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
