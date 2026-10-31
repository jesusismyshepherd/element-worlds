// A stage for picture rooms (docs/knowledge/picture-rooms.md): an Iron Age village in a clearing at dusk.
// A clearing of trodden earth and grass inside a wattle fence, round houses with daub walls, thatched
// cones and a warm doorway, a stream beyond the fence, a wood of dark pines all round, low hills behind,
// smoke drifting, the sky's last pink glow low down and the first stars overhead. The scene fills the
// clearing; `smoke(...)` gives it columns of smoke (a furnace's, a hearth's) that the stage moves.
// Few kinds of material, mid-toned, so the firelight the scene adds does the rest (a pale floor under the
// bloom washes a night scene out).
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { nightSky } from '../../common/sky.js'
import { smooth, random, canvasTex } from '../../wings/noble/kit.js'
import { circle } from '../../../engine/collide.js'
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

/** Distance from (x, z) to the segment a-b, in the ground plane. */
function toSegment(x, z, [ax, az], [bx, bz]) {
  const dx = bx - ax
  const dz = bz - az
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)))
  return Math.hypot(x - ax - dx * t, z - az - dz * t)
}

/** A soft round puff, white (tinted by the sprite's colour). */
function puffTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,0.9)')
    grd.addColorStop(0.45, 'rgba(255,255,255,0.4)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }, { mipmaps: false })
}

/**
 * radius: the clearing's walkable circle; houses: [{ x, z, r, rot }] round houses (rot turns the doorway,
 * which faces +z at rot 0; give it toward the clearing); fence: { r, gaps: [[a0, a1]] } a wattle fence
 * round the clearing with gaps at angles atan2(z, x); paths: polylines [[x, z], ...] of trodden earth,
 * clearings: [[x, z, r]] round patches of it; stream: a polyline beyond the fence; sky: colours for
 * nightSky. Returns { group, groundAt, solids, mats, smoke(opts), env, cameraBounds, update(t), dispose }.
 */
export function villageStage({ radius = 12, light = false, pixelRatio = 1, houses = [], fence = null, paths = [], clearings = [], stream = null, sky = {} } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const EDGE = radius + 1.2
  const rnd = random(907)
  const o = new THREE.Object3D()

  const nearStream = (x, z) => (stream ? Math.min(...stream.slice(1).map((q, i) => toSegment(x, z, stream[i], q))) : 99)

  /** The ground's height: the flat clearing, a gentle roll beyond it, the stream's bed, low hills far off. */
  function groundAt(x, z) {
    const r = Math.hypot(x, z)
    if (r <= EDGE) return 0
    const out = smooth(EDGE, EDGE + 14, r)
    let h = (noise(x * 0.06 + 3, z * 0.06 + 7) - 0.5) * 1.6 * out
    const d = nearStream(x, z)
    if (d < 4) h = h * smooth(0.6, 4, d) - 0.35 * (1 - smooth(0.6, 2.2, d))
    const a = Math.atan2(z, x)
    const rise = smooth(70, 150, r)
    if (rise > 0) h += rise * (14 + 9 * Math.sin(a * 3 + 0.4) + 6 * Math.sin(a * 7 + 1.7) + 8 * (noise(Math.cos(a) * 3 + 5, Math.sin(a) * 3 + 5) - 0.5))
    return h
  }

  // ---- the sky: the day's last pink low in the west, violet above, the first stars ----
  const stars = nightSky({ radius: 700, stars: light ? 500 : 1100, top: '#101236', mid: '#36296c', horizon: '#a8507e', pixelRatio, ...sky })
  group.add(stars)

  // ---- the land: rings round the clearing, close together near it ----
  const rings = []
  for (let r = 0; r < radius; r += 1.5) rings.push(r)
  for (let r = radius; r < EDGE + 16; r += 0.8) rings.push(r)
  for (let r = EDGE + 16; r < 70; r += 3) rings.push(r)
  for (let r = 70; r <= 260; r += 8) rings.push(r)
  const SEG = light ? 110 : 180
  const pos = []
  const col = []
  const idx = []
  const cGrass = new THREE.Color('#33402c')
  const cWild = new THREE.Color('#283426')
  const cHill = new THREE.Color('#1f2232')
  const cMud = new THREE.Color('#3a3026')
  const c = new THREE.Color()
  for (let i = 0; i < rings.length; i++) {
    for (let j = 0; j <= SEG; j++) {
      const a = (j / SEG) * TAU
      const x = Math.cos(a) * rings[i]
      const z = Math.sin(a) * rings[i]
      pos.push(x, groundAt(x, z), z)
      c.copy(cGrass).lerp(cWild, smooth(EDGE, EDGE + 10, rings[i])).lerp(cHill, smooth(60, 130, rings[i]))
      if (nearStream(x, z) < 2.4) c.lerp(cMud, 0.7)
      c.multiplyScalar(0.85 + noise(x * 0.25, z * 0.25) * 0.3)
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

  // ---- the clearing: trodden earth where people work and walk, grass round the edge ----
  const PX = 1024
  const spanM = EDGE * 2
  const toPx = v => ((v + EDGE) / spanM) * PX
  const k = PX / spanM
  const floorTex = canvasTex(PX, PX, g => {
    g.fillStyle = '#3a4630'
    g.fillRect(0, 0, PX, PX)
    for (let i = 0; i < 9000; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(40,54,34,${0.4 + rnd() * 0.4})` : `rgba(84,98,62,${0.25 + rnd() * 0.3})`
      g.fillRect(rnd() * PX, rnd() * PX, 1.5 + rnd() * 2, 4 + rnd() * 7)
    }
    g.lineCap = 'round'
    g.lineJoin = 'round'
    for (const [w, colr] of [[1.5, 'rgba(84,66,50,0.55)'], [1.15, '#5a4838']]) {
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
        g.arc(toPx(x), toPx(z), (r + (w - 1.15)) * k, 0, TAU)
        g.fill()
      }
    }
    // the earth's grain: pebbles, dark stains of soot and charcoal dust
    for (let i = 0; i < 2600; i++) {
      const x = rnd() * PX
      const y = rnd() * PX
      const v = 70 + rnd() * 50
      g.fillStyle = rnd() < 0.25 ? `rgba(24,20,18,${0.15 + rnd() * 0.2})` : `rgba(${v + 10},${v},${v - 12},${0.15 + rnd() * 0.25})`
      g.beginPath()
      g.arc(x, y, 1 + rnd() * 2.4, 0, TAU)
      g.fill()
    }
  })
  disposers.push(() => floorTex.dispose())
  const floor = new THREE.Mesh(new THREE.CircleGeometry(EDGE, 96), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 1 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0.01
  group.add(floor)
  // tufts of grass, off the trodden earth
  const onEarth = (x, z) =>
    paths.some(p => p.some((q, i) => i > 0 && toSegment(x, z, p[i - 1], q) < 1.0)) || clearings.some(([cx, cz, r]) => Math.hypot(x - cx, z - cz) < r + 0.5)
  const TUFTS = light ? 220 : 650
  const tuftGeo = new THREE.ConeGeometry(0.05, 0.22, 4).translate(0, 0.11, 0)
  const tufts = new THREE.InstancedMesh(tuftGeo, new THREE.MeshStandardMaterial({ color: '#46583a', roughness: 1 }), TUFTS)
  let n = 0
  for (let tries = 0; n < TUFTS && tries < TUFTS * 6; tries++) {
    const a = rnd() * TAU
    const r = Math.sqrt(rnd()) * (EDGE + 6)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (onEarth(x, z) || nearStream(x, z) < 1.2) continue
    o.position.set(x, groundAt(x, z), z)
    o.rotation.set((rnd() - 0.5) * 0.5, rnd() * 6, (rnd() - 0.5) * 0.5)
    o.scale.set(0.7 + rnd() * 0.8, 0.5 + rnd() * 1.1, 0.7 + rnd() * 0.8)
    o.updateMatrix()
    tufts.setMatrixAt(n++, o.matrix)
  }
  tufts.count = n
  group.add(tufts)

  // ---- materials the scene may use too ----
  const wood = new THREE.MeshStandardMaterial({ color: '#5a4434', roughness: 0.9 })
  const daubTex = canvasTex(256, 256, g => {
    g.fillStyle = '#8a6c50'
    g.fillRect(0, 0, 256, 256)
    const r2 = random(31)
    for (let i = 0; i < 700; i++) {
      const v = r2()
      g.fillStyle = v < 0.5 ? `rgba(70,52,38,${0.12 + r2() * 0.2})` : `rgba(168,138,104,${0.1 + r2() * 0.2})`
      g.beginPath()
      g.ellipse(r2() * 256, r2() * 256, 3 + r2() * 14, 2 + r2() * 6, r2() * 3, 0, TAU)
      g.fill()
    }
  }, { repeat: true })
  daubTex.repeat.set(4, 1)
  disposers.push(() => daubTex.dispose())
  const daub = new THREE.MeshStandardMaterial({ map: daubTex, roughness: 0.95 })
  const thatchTex = canvasTex(256, 256, g => {
    g.fillStyle = '#6a5034'
    g.fillRect(0, 0, 256, 256)
    const r2 = random(77)
    for (let i = 0; i < 900; i++) {
      const v = r2()
      g.strokeStyle = v < 0.5 ? `rgba(48,34,22,${0.3 + r2() * 0.3})` : `rgba(150,118,74,${0.2 + r2() * 0.3})`
      g.lineWidth = 1 + r2() * 1.5
      const x = r2() * 256
      const y = r2() * 256
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (r2() - 0.5) * 4, y + 20 + r2() * 40)
      g.stroke()
    }
    // the courses of thatch, as the picture's lines across the roof
    for (let y = 0; y < 256; y += 64) {
      g.fillStyle = 'rgba(30,20,12,0.35)'
      g.fillRect(0, y, 256, 5)
    }
  }, { repeat: true })
  thatchTex.repeat.set(6, 2)
  disposers.push(() => thatchTex.dispose())
  const thatch = new THREE.MeshStandardMaterial({ map: thatchTex, roughness: 1, side: THREE.DoubleSide })
  // a doorway's warm inside: dark above, a hearth's glow low down
  const doorTex = canvasTex(64, 128, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h * 0.92, 0, w / 2, h * 0.92, h * 0.8)
    grd.addColorStop(0, '#ffd08a')
    grd.addColorStop(0.35, '#d0702a')
    grd.addColorStop(1, '#2a1006')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
  disposers.push(() => doorTex.dispose())
  const glow = new THREE.MeshBasicMaterial({ map: doorTex, color: new THREE.Color('#ffffff').multiplyScalar(0.85) })

  const solids = ringWall(radius)

  // ---- round houses: daub walls, a thatched cone, a warm doorway ----
  const WALL_H = 1.55
  for (const { x, z, r = 2.6, rot = 0 } of houses) {
    const h = new THREE.Group()
    const door = 1.0 / r // the doorway's angle
    // the wall, open at the doorway (a cylinder's angle 0 lies along +z)
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.02, WALL_H, 40, 1, true, door / 2, TAU - door), daub)
    wall.position.y = WALL_H / 2
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.12, r - 0.1, WALL_H, 40, 1, true, door / 2, TAU - door), new THREE.MeshStandardMaterial({ color: '#2a1a12', roughness: 1, side: THREE.BackSide }))
    inner.position.y = WALL_H / 2
    const roofH = r * 1.15
    const roof = new THREE.Mesh(new THREE.ConeGeometry(r + 0.6, roofH, 32, 3, true), thatch)
    roof.position.y = WALL_H - 0.1 + roofH / 2
    // the warm inside, seen through the doorway: a hearth's light on the far wall
    const lit = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.3), glow)
    lit.position.set(0, 0.68, r - 0.55)
    const back = new THREE.Mesh(new THREE.CircleGeometry(r - 0.12, 24), new THREE.MeshStandardMaterial({ color: '#1a120c', roughness: 1 }))
    back.rotation.x = Math.PI / 2
    back.position.y = WALL_H - 0.02
    // the doorposts and the lintel
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.55, 0.14), wood)
      post.position.set(Math.sin((s * door) / 2) * r, 0.78, Math.cos((s * door) / 2) * r)
      h.add(post)
    }
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.16), wood)
    lintel.position.set(0, 1.5, r * Math.cos(door / 2))
    h.add(wall, inner, roof, lit, back, lintel)
    h.position.set(x, groundAt(x, z), z)
    h.rotation.y = rot
    group.add(h)
    solids.push(circle(x, z, r + 0.25))
  }

  // ---- the wattle fence: hurdles of woven hazel round the clearing ----
  if (fence) {
    const FR = fence.r ?? radius + 0.5
    const wrap = a => Math.atan2(Math.sin(a), Math.cos(a))
    const inGap = a => (fence.gaps ?? []).some(([a0, a1]) => wrap(a - a0) >= 0 && wrap(a - a0) <= wrap(a1 - a0))
    const wattleTex = canvasTex(256, 128, g => {
      g.fillStyle = '#2c2218'
      g.fillRect(0, 0, 256, 128)
      // stakes, and withies woven over and under them
      for (let x = 12; x < 256; x += 32) {
        g.fillStyle = '#5a4634'
        g.fillRect(x - 3, 0, 6, 128)
      }
      for (let y = 6, row = 0; y < 128; y += 9, row++) {
        for (let x = -16, s = 0; x < 256; x += 32, s++) {
          const over = (s + row) % 2 === 0
          const grd = g.createLinearGradient(0, y - 4, 0, y + 4)
          grd.addColorStop(0, over ? '#8a6e4e' : '#6a5238')
          grd.addColorStop(1, over ? '#4a3828' : '#3a2c20')
          g.fillStyle = grd
          g.beginPath()
          g.ellipse(x + 16, y + (over ? -1 : 1), 17, 4, 0, 0, TAU)
          g.fill()
        }
      }
    }, { repeat: true })
    disposers.push(() => wattleTex.dispose())
    const LEN = 1.9
    const steps = Math.round((TAU * FR) / LEN)
    const hurdleGeo = new THREE.BoxGeometry(LEN * 1.02, 0.9, 0.07).translate(0, 0.45 + 0.05, 0)
    const hurdles = new THREE.InstancedMesh(hurdleGeo, new THREE.MeshStandardMaterial({ map: wattleTex, roughness: 1 }), steps)
    const stakes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.045, 1.2, 6).translate(0, 0.6, 0), wood, steps)
    let m = 0
    for (let i = 0; i < steps; i++) {
      const a = ((i + 0.5) / steps) * TAU
      if (inGap(a)) continue
      o.position.set(Math.cos(a) * FR, 0, Math.sin(a) * FR)
      o.rotation.set(0, -a + Math.PI / 2, 0)
      o.scale.set(1, 0.9 + rnd() * 0.15, 1)
      o.updateMatrix()
      hurdles.setMatrixAt(m, o.matrix)
      const sa = (i / steps) * TAU
      o.position.set(Math.cos(sa) * FR, 0, Math.sin(sa) * FR)
      o.scale.setScalar(1)
      o.updateMatrix()
      stakes.setMatrixAt(m, o.matrix)
      m++
    }
    hurdles.count = stakes.count = m
    group.add(hurdles, stakes)
  }

  // ---- the stream beyond the fence: dark water holding the sky's glow ----
  let streamTex = null
  if (stream && stream.length > 1) {
    const curve = new THREE.CatmullRomCurve3(stream.map(([x, z]) => new THREE.Vector3(x, 0, z)))
    const N = 120
    const vp = []
    const uv = []
    const id = []
    const len = curve.getLength()
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const p = curve.getPointAt(u)
      const tng = curve.getTangentAt(u)
      const side = new THREE.Vector3(-tng.z, 0, tng.x).normalize()
      const w = 0.75 + 0.25 * Math.sin(u * 17)
      for (const s of [-1, 1]) {
        const x = p.x + side.x * w * s
        const z = p.z + side.z * w * s
        vp.push(x, Math.max(-0.28, Math.min(groundAt(x, z), -0.12)) + 0.02, z)
        uv.push((u * len) / 3, s < 0 ? 0 : 1)
      }
      if (i < N) {
        const a = i * 2
        // wound so the water faces up whichever way the stream runs
        id.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vp, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    geo.setIndex(id)
    geo.computeVertexNormals()
    streamTex = canvasTex(256, 64, g => {
      const grd = g.createLinearGradient(0, 0, 0, 64)
      grd.addColorStop(0, '#2a2650')
      grd.addColorStop(0.5, '#4a3a6a')
      grd.addColorStop(1, '#2a2650')
      g.fillStyle = grd
      g.fillRect(0, 0, 256, 64)
      const r2 = random(5)
      for (let i = 0; i < 60; i++) {
        g.fillStyle = `rgba(220,170,190,${0.1 + r2() * 0.3})`
        g.fillRect(r2() * 256, r2() * 64, 10 + r2() * 40, 1 + r2() * 1.5)
      }
    }, { repeat: true })
    disposers.push(() => streamTex.dispose())
    const water = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: streamTex, side: THREE.DoubleSide }))
    group.add(water)
    // stones along its banks
    const STONES = light ? 30 : 70
    const stones = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.18, 0), new THREE.MeshStandardMaterial({ color: '#4a4a52', roughness: 0.9 }), STONES)
    for (let i = 0; i < STONES; i++) {
      const u = rnd()
      const p = curve.getPointAt(u)
      const tng = curve.getTangentAt(u)
      const s = (rnd() < 0.5 ? -1 : 1) * (0.8 + rnd() * 0.5)
      const x = p.x - tng.z * s
      const z = p.z + tng.x * s
      o.position.set(x, groundAt(x, z) + 0.02, z)
      o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
      o.scale.set(0.6 + rnd(), 0.4 + rnd() * 0.5, 0.6 + rnd())
      o.updateMatrix()
      stones.setMatrixAt(i, o.matrix)
    }
    group.add(stones)
  }

  // ---- the wood: dark pines all round, a wall of them behind the houses ----
  const PINES = light ? 140 : 320
  const parts = []
  for (let i = 0; i < 4; i++) parts.push(new THREE.ConeGeometry(1.5 - i * 0.3, 2.6, 7, 1).translate(0, 1.6 + i * 1.5, 0))
  parts.push(new THREE.CylinderGeometry(0.12, 0.18, 1.4, 6).translate(0, 0.7, 0))
  const pineGeo = mergeGeometries(parts)
  const pines = new THREE.InstancedMesh(pineGeo, new THREE.MeshStandardMaterial({ color: '#1c2a26', roughness: 0.95 }), PINES)
  n = 0
  for (let tries = 0; n < PINES && tries < PINES * 10; tries++) {
    const a = rnd() * TAU
    const r = EDGE + 5 + Math.pow(rnd(), 1.7) * 110
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (nearStream(x, z) < 3) continue
    const s = 0.9 + rnd() * 0.9
    o.position.set(x, groundAt(x, z) - 0.1, z)
    o.rotation.set(0, rnd() * 6, 0)
    o.scale.set(s, s * (1 + rnd() * 0.5), s)
    o.updateMatrix()
    pines.setMatrixAt(n++, o.matrix)
  }
  pines.count = n
  group.add(pines)

  // ---- smoke: columns of soft puffs the scene asks for (a furnace, a hearth, a roof) ----
  const puff = puffTex()
  disposers.push(() => puff.dispose())
  const columns = []
  /** A column of smoke from (x, y, z): rate puffs a second (0 stops it), rise m/s, size of a grown puff. */
  function smoke({ x, y, z, rate = 2, rise = 0.7, size = 1.4, spread = 0.25, color = '#8a7e90', opacity = 0.32, life = 5, max = 16 }) {
    const count = light ? Math.ceil(max / 2) : max
    const sprites = Array.from({ length: count }, () => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, color, transparent: true, opacity: 0, depthWrite: false, fog: true }))
      s.visible = false
      group.add(s)
      return { s, age: -1, dx: 0, dz: 0 }
    })
    const col = { at: new THREE.Vector3(x, y, z), rate, rise, size, spread, opacity, life, sprites, clock: 0, wind: new THREE.Vector3(0.18, 0, -0.08) }
    columns.push(col)
    return {
      setRate: r => (col.rate = r),
      setOpacity: v => (col.opacity = v),
      moveTo: (px, py, pz) => col.at.set(px, py, pz),
    }
  }
  for (const { x, z, r = 2.6 } of houses) smoke({ x, y: WALL_H + r * 1.15 - 0.3, z, rate: 0.7, size: 2.2, opacity: 0.18, life: 8, max: 8 })

  // ---- light: the dusk sky from above, the dark land below, the west's last glow from one side ----
  group.add(new THREE.HemisphereLight('#7a6cb4', '#2a1e1a', 0.95))
  const dusk = new THREE.DirectionalLight('#e0a0b8', 0.45)
  dusk.position.set(-30, 12, -20)
  group.add(dusk, dusk.target)

  let last = null
  return {
    group,
    groundAt,
    solids,
    mats: { wood, daub, thatch, glow },
    smoke,
    env: {
      background: new THREE.Color('#141230'),
      fog: new THREE.Fog('#3a2c5c', 34, 190),
      exposure: 1.0,
      envIntensity: 0.1,
      bloom: { strength: 0.75, radius: 0.5, threshold: 0.78 },
      fov: 60,
    },
    cameraBounds: { minX: -radius - 1, maxX: radius + 1, minY: 0.35, maxY: 10, minZ: -radius - 1, maxZ: radius + 1 },
    update(t) {
      const dt = last == null ? 0 : Math.min(0.1, t - last)
      last = t
      stars.userData.update?.(t)
      if (streamTex) streamTex.offset.x = -t * 0.08
      for (const col of columns) {
        col.clock += dt * col.rate
        for (const p of col.sprites) {
          if (p.age < 0 && col.clock >= 1) {
            col.clock -= 1
            p.age = 0
            p.dx = (Math.random() - 0.5) * col.spread
            p.dz = (Math.random() - 0.5) * col.spread
            p.s.visible = true
          }
          if (p.age < 0) continue
          p.age += dt
          const u = p.age / col.life
          if (u >= 1) {
            p.age = -1
            p.s.visible = false
            continue
          }
          p.s.position.set(col.at.x + p.dx + col.wind.x * p.age * p.age * 0.4, col.at.y + col.rise * p.age, col.at.z + p.dz + col.wind.z * p.age * p.age * 0.4)
          p.s.scale.setScalar(col.size * (0.25 + 0.75 * Math.sqrt(u)))
          p.s.material.opacity = col.opacity * Math.min(1, u * 6) * (1 - u)
        }
        if (col.clock > 1) col.clock = 1
      }
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
