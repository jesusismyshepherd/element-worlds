// A stage for picture rooms (docs/knowledge/picture-rooms.md): a mountaintop observatory's summit at night,
// high and dry like Cerro Paranal in Chile's Atacama Desert. A flattened summit of dark red-brown gravel (a
// circle of `radius`, a steel rail round it with `gaps` where the scene wants a clear view, a fence straight
// across it, `chord`, to close off its back; concrete `paths` and pads, `clearings`, where the scene walks),
// the mountain falling away `drop` metres to a stony desert, bare ranges far off on every side (higher in
// the east, the Andes' side), and in the west a sea of clouds far below (the Pacific's, which stays under the
// summit and keeps it dry). Above: a clear, dark, crowded sky with the Milky Way across it and a faint
// airglow low down (`airglow`: its colour, `glow`: how strong). No moon and no white light: observatories
// light their paths with dim red lamps (`lamps`: [[x, z], ...]), which spoil eyes used to the dark least.
// The environment's light is kept low; the sky and a faint starlight do the lighting. `groundAt(x, z)`
// gives the ground's height anywhere, for the scene.
import * as THREE from 'three'
import { nightSky } from '../../common/sky.js'
import { smooth, random, canvasTex } from '../../wings/noble/kit.js'
import { box, circle } from '../../../engine/collide.js'
import { ringWall } from '../kit.js'

const TAU = Math.PI * 2

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
const fbm = (x, z) => noise(x, z) * 0.55 + noise(x * 2.1 + 7, z * 2.1 + 3) * 0.3 + noise(x * 4.3 + 1, z * 4.3 + 9) * 0.15

/** Distance from (x, z) to the segment a-b, in the ground plane. */
function toSegment(x, z, [ax, az], [bx, bz]) {
  const dx = bx - ax
  const dz = bz - az
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)))
  return Math.hypot(x - ax - dx * t, z - az - dz * t)
}

/** A direction from an azimuth (radians east of north, -z) and an elevation. */
const dirOf = (az, el) => new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el))

/**
 * radius: the summit's walkable circle; drop: how far below it the desert lies; paths: polylines [[x, z], ...]
 * of concrete (1.3 m wide); clearings: [[x, z, r]] round concrete pads; chord: z of a fence straight across
 * the summit, closing off the part beyond it (+z); gaps: [[a0, a1]] angles (atan2(z, x)) where the rail
 * round the edge has no bars, only low posts; lamps: [[x, z]] red path lamps; airglow, glow: the colour and
 * strength of the glow low over the horizon; milky: the Milky Way's middle, { az, el } (radians), and its
 * band's tilt (`tilt`).
 */
export function summitStage({
  radius = 13, drop = 26, light = false, pixelRatio = 1, paths = [], clearings = [], chord = null, gaps = [], lamps = [],
  airglow = '#ff9a3c', glow = 1, milky = { az: 2.5, el: 0.75, tilt: 0.55 },
} = {}) {
  const group = new THREE.Group()
  const disposers = []
  const EDGE = radius + 0.6
  const FOOT = EDGE + 30
  const HILLS = 300

  /** The ground's height: the flat summit, its steep stony slopes, the desert's roll, the far ranges, and
   *  in the west the land going down under the clouds toward the sea. */
  function groundAt(x, z) {
    const r = Math.hypot(x, z)
    if (r <= EDGE) return 0
    const a = Math.atan2(z, x)
    const s = smooth(EDGE, FOOT, r)
    let h = -drop * Math.pow(s, 0.8) + (fbm(x * 0.06, z * 0.06) - 0.5) * 5 * s
    // ridges running down from the summit
    h += Math.sin(a * 5 + 0.4) * 1.6 * s * (1 - s) * 4
    // the desert floor: low rolling hills
    h += (fbm(x * 0.012 + 3, z * 0.012 + 5) - 0.45) * 22 * smooth(FOOT, FOOT + 80, r)
    // the far ranges: the Andes' side (east, +x) higher
    const east = 0.5 + 0.5 * Math.cos(a)
    const rise = smooth(HILLS, HILLS + 260, r)
    if (rise > 0) {
      const ridge = 34 + 46 * east * east
      h += rise * ridge * (0.55 + 0.6 * fbm(Math.cos(a) * 3 + 11, Math.sin(a) * 3 + 4) + 0.18 * Math.sin(a * 9 + 1.3))
    }
    // the west: down under the clouds
    const west = Math.max(0, -Math.cos(a) - 0.35) / 0.65
    h -= west * 70 * smooth(FOOT + 40, HILLS + 200, r)
    return h
  }

  // ---- the sky: deep and dark, crowded with stars ----
  const sky = nightSky({ radius: 900, stars: light ? 1500 : 3400, top: '#020309', mid: '#05081a', horizon: '#0d1530', pixelRatio })
  group.add(sky)
  // the Milky Way (a band of light round a great circle, brightest and widest at its middle, a dark lane of
  // dust along it) and the airglow low down, in one shader on a sphere just inside the stars
  const core = dirOf(milky.az, milky.el)
  const across = new THREE.Vector3(0, 1, 0).cross(core).normalize()
  const bandNormal = new THREE.Vector3().crossVectors(core, across).normalize().applyAxisAngle(core, milky.tilt)
  const skyGlow = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: {
      uN: { value: bandNormal },
      uCore: { value: core },
      uK: { value: light ? 0.75 : 1 },
      uGlow: { value: new THREE.Color(airglow) },
      uGlowK: { value: glow },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uN; uniform vec3 uCore; uniform float uK; uniform vec3 uGlow; uniform float uGlowK;
      varying vec3 vDir;
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
        float w = 0.13 + 0.12 * pow(mid, 3.0);
        float band = exp(-b * b / (w * w));
        float clouds = fbm(d * 7.0);
        float lane = exp(-pow((b - 0.015 + 0.02 * sin(dot(d, vec3(9.0, 4.0, 7.0)))) / 0.03, 2.0)) * smoothstep(0.1, 0.8, mid + fbm(d * 11.0) * 0.5);
        float k = band * (0.25 + 1.1 * clouds * clouds) * (1.0 - 0.8 * lane) * (0.35 + 1.2 * pow(mid, 5.0));
        float up = smoothstep(0.0, 0.3, d.y);
        vec3 col = mix(vec3(0.52, 0.58, 0.85), vec3(1.0, 0.86, 0.66), pow(mid, 4.0));
        vec3 c = col * k * 0.3 * uK * up;
        // the airglow: a faint band a few degrees over the horizon
        float g = exp(-pow((d.y - 0.07) / 0.07, 2.0)) * (0.8 + 0.4 * fbm(d * 5.0));
        c += uGlow * g * 0.07 * uGlowK;
        gl_FragColor = vec4(c, 1.0);
      }`,
  })
  const glowDome = new THREE.Mesh(new THREE.SphereGeometry(860, 64, 32), skyGlow)
  glowDome.renderOrder = -9.5
  glowDome.frustumCulled = false
  group.add(glowDome)

  // ---- the land: rings round the summit, close together where the slope bends ----
  const rings = []
  for (let r = 0; r < radius; r += 1.5) rings.push(r)
  for (let r = radius; r < FOOT + 2; r += 0.6) rings.push(r)
  for (let r = FOOT + 2; r < HILLS; r += 4) rings.push(r)
  for (let r = HILLS; r <= HILLS + 560; r += 8) rings.push(r)
  const SEG = light ? 120 : 200
  const pos = []
  const col = []
  const idx = []
  const cTop = new THREE.Color('#3c3029')
  const cSlope = new THREE.Color('#33262a')
  const cFloor = new THREE.Color('#251d26')
  const cRange = new THREE.Color('#231f36')
  const c = new THREE.Color()
  for (let i = 0; i < rings.length; i++) {
    for (let j = 0; j <= SEG; j++) {
      const a = (j / SEG) * TAU
      const x = Math.cos(a) * rings[i]
      const z = Math.sin(a) * rings[i]
      const y = groundAt(x, z)
      pos.push(x, y, z)
      c.copy(cTop).lerp(cSlope, smooth(EDGE, EDGE + 6, rings[i])).lerp(cFloor, smooth(FOOT - 10, FOOT + 40, rings[i])).lerp(cRange, smooth(HILLS, HILLS + 200, rings[i]))
      c.multiplyScalar(0.8 + noise(x * 0.25, z * 0.25) * 0.4)
      col.push(c.r, c.g, c.b)
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
  landGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  landGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  landGeo.setIndex(idx)
  landGeo.computeVertexNormals()
  group.add(new THREE.Mesh(landGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 })))

  // ---- the sea of clouds in the west, far below, faintly lit by the stars ----
  const cloudTex = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#000000'
    g.fillRect(0, 0, w, w)
    const rnd = random(1529)
    for (let i = 0; i < 900; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const r = 8 + rnd() * 34
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      const v = 0.05 + rnd() * 0.09
      grd.addColorStop(0, `rgba(255,255,255,${v})`)
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, r * 2, r * 2)
    }
  }, { repeat: true })
  cloudTex.repeat.set(5, 5)
  disposers.push(() => cloudTex.dispose())
  const cloudMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: { uMap: { value: cloudTex }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vW;
      void main() { vUv = uv * 5.0; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap; uniform float uTime;
      varying vec2 vUv; varying vec3 vW;
      void main() {
        float k = texture2D(uMap, vUv + vec2(uTime * 0.002, 0.0)).r + texture2D(uMap, vUv * 0.37 + vec2(0.3, uTime * 0.001)).r;
        float r = length(vW.xz);
        float west = 1.0 - smoothstep(-0.6, -0.2, vW.x / max(r, 1.0));
        float fade = smoothstep(${(FOOT + 60).toFixed(1)}, ${(FOOT + 180).toFixed(1)}, r) * (1.0 - smoothstep(1100.0, 1500.0, r));
        gl_FragColor = vec4(vec3(0.42, 0.46, 0.62), (0.28 + k * 0.9) * west * fade);
      }`,
  })
  const cloudDeck = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), cloudMat)
  cloudDeck.rotation.x = -Math.PI / 2
  cloudDeck.position.y = -drop - 34
  group.add(cloudDeck)

  // ---- the summit: gravel, and concrete where the scene walks ----
  const PX = 1024
  const span = EDGE * 2
  const toPx = v => ((v + EDGE) / span) * PX
  const cv = document.createElement('canvas')
  cv.width = cv.height = PX
  const g = cv.getContext('2d')
  g.fillStyle = '#4b3a32'
  g.fillRect(0, 0, PX, PX)
  const rnd = random(2635)
  for (let i = 0; i < 16000; i++) {
    const v = rnd()
    g.fillStyle = v < 0.45 ? `rgba(40,28,24,${0.3 + rnd() * 0.4})` : v < 0.85 ? `rgba(104,78,62,${0.25 + rnd() * 0.35})` : `rgba(130,118,112,${0.3 + rnd() * 0.3})`
    const s = 1 + rnd() * 3.2
    g.fillRect(rnd() * PX, rnd() * PX, s, s * (0.6 + rnd() * 0.8))
  }
  g.lineCap = 'round'
  g.lineJoin = 'round'
  const k = PX / span
  for (const [w, colr] of [[1.55, 'rgba(70,70,78,0.7)'], [1.3, '#5e5d66']]) {
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
      g.arc(toPx(x), toPx(z), (r + (w - 1.3) / 2) * k, 0, TAU)
      g.fill()
    }
  }
  // the concrete's seams and specks
  const onConcrete = (x, z) =>
    paths.some(p => p.some((q, i) => i > 0 && toSegment(x, z, p[i - 1], q) < 0.62)) || clearings.some(([cx, cz, r]) => Math.hypot(x - cx, z - cz) < r)
  for (let i = 0; i < 9000; i++) {
    const x = rnd() * span - EDGE
    const z = rnd() * span - EDGE
    if (!onConcrete(x, z)) continue
    const v = 70 + rnd() * 40
    g.fillStyle = `rgba(${v},${v},${v + 8},${0.2 + rnd() * 0.3})`
    g.fillRect(toPx(x), toPx(z), 1.5, 1.5)
  }
  const summitTex = new THREE.CanvasTexture(cv)
  summitTex.colorSpace = THREE.SRGBColorSpace
  summitTex.anisotropy = 4
  disposers.push(() => summitTex.dispose())
  const summit = new THREE.Mesh(new THREE.CircleGeometry(EDGE, 96), new THREE.MeshStandardMaterial({ map: summitTex, roughness: 1 }))
  summit.rotation.x = -Math.PI / 2
  summit.position.y = 0.01
  group.add(summit)

  // stones on the gravel, off the concrete
  const STONES = light ? 160 : 520
  const stoneGeo = new THREE.DodecahedronGeometry(0.08, 0)
  const stones = new THREE.InstancedMesh(stoneGeo, new THREE.MeshStandardMaterial({ color: '#5a463c', roughness: 1, flatShading: true }), STONES)
  const o = new THREE.Object3D()
  let n = 0
  for (let tries = 0; n < STONES && tries < STONES * 6; tries++) {
    const a = rnd() * TAU
    const r = Math.sqrt(rnd()) * (radius + 0.3)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (onConcrete(x, z)) continue
    o.position.set(x, 0.02, z)
    o.rotation.set(rnd() * 3, rnd() * 6, rnd() * 3)
    o.scale.set(0.5 + rnd() * 1.4, 0.35 + rnd() * 0.6, 0.5 + rnd() * 1.4)
    o.updateMatrix()
    stones.setMatrixAt(n++, o.matrix)
  }
  stones.count = n
  group.add(stones)

  // ---- a steel rail round the summit's edge ----
  const steel = new THREE.MeshStandardMaterial({ color: '#69707e', roughness: 0.5, metalness: 0.6 })
  const FR = radius + 0.45
  const POSTS = Math.round((TAU * FR) / 2.0)
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a))
  const inGap = a => gaps.some(([a0, a1]) => wrap(a - a0) >= 0 && wrap(a - a0) <= wrap(a1 - a0))
  const postGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.05, 8).translate(0, 0.525, 0)
  const posts = new THREE.InstancedMesh(postGeo, steel, POSTS)
  for (let i = 0; i < POSTS; i++) {
    const a = (i / POSTS) * TAU
    o.position.set(Math.cos(a) * FR, 0, Math.sin(a) * FR)
    o.rotation.set(0, -a, 0)
    o.scale.set(1, inGap(a) ? 0.35 : 1, 1)
    o.updateMatrix()
    posts.setMatrixAt(i, o.matrix)
  }
  group.add(posts)
  const opens = gaps.map(([a0, a1]) => [wrap(a0), wrap(a0) + wrap(a1 - a0)]).sort((p, q) => p[0] - q[0])
  const arcs = []
  if (!opens.length) arcs.push([0, TAU])
  else opens.forEach(([, end], i) => arcs.push([end, (i + 1 < opens.length ? opens[i + 1][0] : opens[0][0] + TAU) - end]))
  for (const y of [0.55, 1.02]) {
    for (const [start, arc] of arcs) {
      const holder = new THREE.Group()
      const rail = new THREE.Mesh(new THREE.TorusGeometry(FR, 0.024, 6, Math.max(8, Math.round(arc * 26)), arc), steel)
      rail.rotation.x = Math.PI / 2
      holder.add(rail)
      holder.rotation.y = -start
      holder.position.y = y
      group.add(holder)
    }
  }
  const solids = ringWall(radius)
  if (chord != null) {
    const half = Math.sqrt(Math.max(0, FR * FR - chord * chord))
    const m = Math.max(2, Math.round((half * 2) / 2.0))
    const across = new THREE.InstancedMesh(postGeo, steel, m + 1)
    for (let i = 0; i <= m; i++) {
      o.position.set(-half + (i / m) * half * 2, 0, chord)
      o.rotation.set(0, 0, 0)
      o.scale.setScalar(1)
      o.updateMatrix()
      across.setMatrixAt(i, o.matrix)
    }
    group.add(across)
    for (const y of [0.55, 1.02]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, half * 2, 6), steel)
      rail.rotation.z = Math.PI / 2
      rail.position.set(0, y, chord)
      group.add(rail)
    }
    solids.push(box(0, chord + 0.3, half * 2 + 1, 0.6))
  }

  // ---- red lamps low along the paths ----
  if (lamps.length) {
    const red = new THREE.MeshStandardMaterial({ color: '#ff3b2a', emissive: '#ff2a1a', emissiveIntensity: 2.2, roughness: 0.5 })
    const body = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 10).translate(0, 0.25, 0), steel, lamps.length)
    const head = new THREE.InstancedMesh(new THREE.BoxGeometry(0.13, 0.07, 0.13).translate(0, 0.5, 0), red, lamps.length)
    lamps.forEach(([x, z], i) => {
      o.position.set(x, 0, z)
      o.rotation.set(0, 0, 0)
      o.scale.setScalar(1)
      o.updateMatrix()
      body.setMatrixAt(i, o.matrix)
      head.setMatrixAt(i, o.matrix)
      solids.push(circle(x, z, 0.1))
    })
    group.add(body, head)
    // their glow on the ground (two lights stand for them all)
    for (const [x, z] of lamps.slice(0, 2)) {
      const l = new THREE.PointLight('#ff3a24', 0.8, 6, 2)
      l.position.set(x, 0.6, z)
      group.add(l)
    }
  }

  // starlight: a bluish sky above, the dark ground below, a faint light from the Milky Way's side
  group.add(new THREE.HemisphereLight('#6b78b8', '#1c1416', 1.05))
  const starlight = new THREE.DirectionalLight('#aab6ff', 0.45)
  starlight.position.copy(core).multiplyScalar(30)
  group.add(starlight, starlight.target)

  return {
    group,
    groundAt,
    solids,
    env: {
      background: new THREE.Color('#03040b'),
      fog: new THREE.Fog('#0b0f22', 200, 1500),
      exposure: 1.0,
      envIntensity: 0.1,
      bloom: { strength: 0.75, radius: 0.5, threshold: 0.72 },
      fov: 60,
      far: 3200,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 16, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      sky.userData.update?.(t)
      cloudMat.uniforms.uTime.value = t
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
