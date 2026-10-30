// A stage for picture rooms (docs/knowledge/picture-rooms.md): open air at night on a round hilltop. A
// starry sky shading down to a purple glow at the horizon, a dark grassy summit to walk on (inside a
// circle of `radius`, a low fence round it, paths of trodden earth where the scene asks for them; a
// straight fence across it, `chord`, can close off its back), the
// ground falling away `drop` metres to a valley floor all round, and a ridge of hills far off. The
// valley floor is the scene's to fill: `groundAt(x, z)` gives the ground's height anywhere. Fireflies
// drift over the grass. The studio light the engine lends every world washes a night scene out, so the
// environment's share is kept low and the moon and the sky do the lighting.
import * as THREE from 'three'
import { nightSky } from '../../common/sky.js'
import { smooth, random } from '../../wings/noble/kit.js'
import { box } from '../../../engine/collide.js'
import { motes, ringWall } from '../kit.js'

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

/**
 * radius: the summit's walkable circle; drop: how far below it the valley floor lies; hills: where the far
 * ridge starts rising; ridge: its height above the valley floor (about; it varies round the ring);
 * paths: polylines [[x, z], ...] of trodden earth on the summit (width 1.2 m); clearings: [[x, z, r]]
 * round patches of it; chord: z of a fence straight across the summit, closing off the part beyond it
 * (+z), so a scene can stand its frame at the back of a smaller space; gaps: [[a0, a1]] angles
 * (atan2(z, x)) where the fence round the edge has no rails, only low stubs, so a lookout's view is
 * not cut by them; sky: colours for nightSky.
 */
export function nightStage({ radius = 11, drop = 7, hills = 88, ridge = 11, light = false, pixelRatio = 1, paths = [], clearings = [], chord = null, gaps = [], sky = {} } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const EDGE = radius + 0.6
  const FOOT = EDGE + 9

  /** The ground's height: the flat summit, the hillside, the valley floor's gentle roll, the far ridge. */
  function groundAt(x, z) {
    const r = Math.hypot(x, z)
    if (r <= EDGE) return 0
    const a = Math.atan2(z, x)
    const s = smooth(EDGE, FOOT, r)
    let h = -drop * s + Math.sin(a * 6 + 0.5) * 0.35 * s * (1 - s) * 4
    h += (noise(x * 0.045, z * 0.045) - 0.5) * 0.7 * s
    const rise = smooth(hills, hills + 28, r)
    if (rise > 0) h += rise * ridge * (1 + 0.45 * Math.sin(a * 3 + 0.7) + 0.27 * Math.sin(a * 7 + 2.1) + 0.55 * (noise(Math.cos(a) * 4 + 9, Math.sin(a) * 4 + 9) - 0.5) * 2)
    return h
  }

  // the sky: deep overhead, a purple glow low down, stars
  const stars = nightSky({ radius: 700, stars: light ? 1000 : 2200, top: '#05061a', mid: '#17134a', horizon: '#4b3a80', pixelRatio, ...sky })
  group.add(stars)

  // the land: rings round the summit, close together where the hillside bends
  const rings = []
  for (let r = 0; r < radius; r += 1.5) rings.push(r)
  for (let r = radius; r < FOOT + 2; r += 0.5) rings.push(r)
  for (let r = FOOT + 2; r < hills; r += 2.5) rings.push(r)
  for (let r = hills; r <= hills + 80; r += 3) rings.push(r)
  const SEG = light ? 96 : 160
  const pos = []
  const col = []
  const idx = []
  const cGrass = new THREE.Color('#1d3536')
  const cFloor = new THREE.Color('#161c3e')
  const cHill = new THREE.Color('#2b2662')
  const c = new THREE.Color()
  for (let i = 0; i < rings.length; i++) {
    for (let j = 0; j <= SEG; j++) {
      const a = (j / SEG) * Math.PI * 2
      const x = Math.cos(a) * rings[i]
      const z = Math.sin(a) * rings[i]
      const y = groundAt(x, z)
      pos.push(x, y, z)
      const s = smooth(EDGE, FOOT, rings[i])
      c.copy(cGrass).lerp(cFloor, s).lerp(cHill, smooth(hills, hills + 20, rings[i]))
      c.multiplyScalar(0.85 + noise(x * 0.3, z * 0.3) * 0.3)
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
  const land = new THREE.Mesh(landGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }))
  group.add(land)

  // the summit: grass, and paths of trodden earth where the scene walks
  const PX = 1024
  const span = EDGE * 2
  const toPx = v => ((v + EDGE) / span) * PX
  const cv = document.createElement('canvas')
  cv.width = cv.height = PX
  const g = cv.getContext('2d')
  g.fillStyle = '#1f3a39'
  g.fillRect(0, 0, PX, PX)
  const rnd = random(11)
  for (let i = 0; i < 9000; i++) {
    const v = rnd()
    g.fillStyle = v < 0.5 ? `rgba(18,44,40,${0.4 + rnd() * 0.4})` : `rgba(52,86,74,${0.25 + rnd() * 0.35})`
    const x = rnd() * PX
    const y = rnd() * PX
    g.fillRect(x, y, 1.5 + rnd() * 2, 4 + rnd() * 7)
  }
  g.lineCap = 'round'
  g.lineJoin = 'round'
  const k = PX / span
  for (const [w, colr] of [[1.35, 'rgba(58,56,74,0.6)'], [1.1, '#4a4659']]) {
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
      g.arc(toPx(x), toPx(z), (r + (w - 1.1) / 2) * k, 0, Math.PI * 2)
      g.fill()
    }
  }
  // pebbles on the paths
  for (let i = 0; i < 1400; i++) {
    const x = rnd() * PX
    const y = rnd() * PX
    const v = 90 + rnd() * 60
    g.fillStyle = `rgba(${v},${v - 4},${v + 14},${0.15 + rnd() * 0.25})`
    g.beginPath()
    g.arc(x, y, 1 + rnd() * 2, 0, Math.PI * 2)
    g.fill()
  }
  const summitTex = new THREE.CanvasTexture(cv)
  summitTex.colorSpace = THREE.SRGBColorSpace
  summitTex.anisotropy = 4
  disposers.push(() => summitTex.dispose())
  const summit = new THREE.Mesh(new THREE.CircleGeometry(EDGE, 96), new THREE.MeshStandardMaterial({ map: summitTex, roughness: 1 }))
  summit.rotation.x = -Math.PI / 2
  summit.position.y = 0.01
  group.add(summit)

  // tufts of grass, off the paths
  const onPath = (x, z) =>
    paths.some(p => p.some((q, i) => i > 0 && toSegment(x, z, p[i - 1], q) < 1.0)) || clearings.some(([cx, cz, r]) => Math.hypot(x - cx, z - cz) < r + 0.4)
  const TUFTS = light ? 200 : 700
  const tuftGeo = new THREE.ConeGeometry(0.045, 0.16, 4)
  tuftGeo.translate(0, 0.08, 0)
  const tufts = new THREE.InstancedMesh(tuftGeo, new THREE.MeshStandardMaterial({ color: '#2a4d40', roughness: 1 }), TUFTS)
  const o = new THREE.Object3D()
  let n = 0
  for (let tries = 0; n < TUFTS && tries < TUFTS * 6; tries++) {
    const a = rnd() * Math.PI * 2
    const r = Math.sqrt(rnd()) * (radius + 0.3)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (onPath(x, z)) continue
    o.position.set(x, 0, z)
    o.rotation.set((rnd() - 0.5) * 0.5, rnd() * 6, (rnd() - 0.5) * 0.5)
    o.scale.set(0.7 + rnd() * 0.8, 0.5 + rnd() * 1.0, 0.7 + rnd() * 0.8)
    o.updateMatrix()
    tufts.setMatrixAt(n++, o.matrix)
  }
  tufts.count = n
  group.add(tufts)

  // a low fence round the summit's edge
  const wood = new THREE.MeshStandardMaterial({ color: '#4a3c33', roughness: 0.9 })
  const FR = radius + 0.45
  const POSTS = Math.round((Math.PI * 2 * FR) / 1.8)
  const wrap = a => Math.atan2(Math.sin(a), Math.cos(a))
  const inGap = a => gaps.some(([a0, a1]) => wrap(a - a0) >= 0 && wrap(a - a0) <= wrap(a1 - a0))
  const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.95, 0.09).translate(0, 0.475, 0), wood, POSTS)
  for (let i = 0; i < POSTS; i++) {
    const a = (i / POSTS) * Math.PI * 2
    o.position.set(Math.cos(a) * FR, 0, Math.sin(a) * FR)
    o.rotation.set(0, -a, 0)
    o.scale.set(1, inGap(a) ? 0.3 : 1, 1)
    o.updateMatrix()
    posts.setMatrixAt(i, o.matrix)
  }
  group.add(posts)
  // the rails, in arcs between the gaps (a torus arc starts at angle 0 of its own plane)
  const opens = gaps.map(([a0, a1]) => [wrap(a0), wrap(a0) + wrap(a1 - a0)]).sort((p, q) => p[0] - q[0])
  const arcs = []
  if (!opens.length) arcs.push([0, Math.PI * 2])
  else opens.forEach(([, end], i) => arcs.push([end, (i + 1 < opens.length ? opens[i + 1][0] : opens[0][0] + Math.PI * 2) - end]))
  for (const y of [0.5, 0.88]) {
    for (const [start, arc] of arcs) {
      const holder = new THREE.Group()
      const rail = new THREE.Mesh(new THREE.TorusGeometry(FR, 0.028, 6, Math.max(8, Math.round(arc * 26)), arc), wood)
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
    const n = Math.max(2, Math.round((half * 2) / 1.8))
    const across = new THREE.InstancedMesh(posts.geometry, wood, n + 1)
    for (let i = 0; i <= n; i++) {
      o.position.set(-half + (i / n) * half * 2, 0, chord)
      o.rotation.set(0, 0, 0)
      o.scale.setScalar(1)
      o.updateMatrix()
      across.setMatrixAt(i, o.matrix)
    }
    group.add(across)
    for (const y of [0.5, 0.88]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(half * 2, 0.05, 0.05), wood)
      rail.position.set(0, y, chord)
      group.add(rail)
    }
    solids.push(box(0, chord + 0.3, half * 2 + 1, 0.6))
  }

  // fireflies over the grass
  const flies = motes({ count: 110, radius: radius + 2, y0: 0.3, y1: 2.6, color: '#eaff8a', size: 0.07, opacity: 0.9, speed: 0.22, light })
  group.add(flies.group)

  // moonlight from behind the visitor's shoulder, the sky's purple from above, the land's dark below
  group.add(new THREE.HemisphereLight('#7a6cc8', '#141a30', 1.0))
  const moon = new THREE.DirectionalLight('#b9c4ff', 0.75)
  moon.position.set(10, 18, 14)
  group.add(moon, moon.target)

  const fogColor = '#2a2460'
  return {
    group,
    groundAt,
    solids,
    env: {
      background: new THREE.Color('#0a0a24'),
      fog: new THREE.Fog(fogColor, 40, 300),
      exposure: 1.0,
      envIntensity: 0.12,
      bloom: { strength: 0.7, radius: 0.55, threshold: 0.74 },
      fov: 60,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 10, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      stars.userData.update?.(t)
      flies.update(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
