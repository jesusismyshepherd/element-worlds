// A stage for picture rooms (docs/knowledge/picture-rooms.md): a limestone show cave on a winter night, inside
// the rock, lamplit and dripping. One big chamber under a rough dome (a superellipse `a` x `b` m, `H` m high),
// stalactites and stalagmites, two columns, a still pool where drops fall, a path of low lamps; at the back
// left a tunnel down to the lower entrance (snow, spruces, the night sky and the moon beyond it), at the back
// right a stair climbing the wall to a landing and a passage rising to an opening high on the slope. Both
// openings have a door in a masonry wall, as show caves fit them: `doors.bottom` (two leaves) and `doors.top`
// (one), each with `set(k)` (0 shut, 1 open). The openings are made by pushing the dome's own surface out into
// a tunnel and dropping its far end, so the rock runs on without a seam. Outside follows `setSeason(k)` (0
// winter: snow on the ground and the spruces, snow falling; 1 summer: grass, fireflies); `setDrift(k)` lets
// snow and ice close the top opening (the scene: Postojna's radon rose below about -6 C, the paper supposes
// because snow covered the cave's small breathing holes). Gives `ceilingAt(x, z)`, `rho(x, z)` (0 at the
// middle, 1 at the wall's foot), `wallAt(x, z, y)` (the wall's point toward (x, z) at height y, with its
// inward normal), `cracks` (soil cracks in the ceiling), `mouths` (the openings' inner and outer points),
// `pool` and `drip()`. Walking stays inside rho < `walk`.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random, clamp, lerp, smooth } from '../../wings/noble/kit.js'
import { box, circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2

// smooth value noise in 3D (0..1)
const h3 = (i, j, k) => {
  const s = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453
  return s - Math.floor(s)
}
function vnoise(x, y, z) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const k = Math.floor(z)
  const fx = x - i
  const fy = y - j
  const fz = z - k
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const w = fz * fz * (3 - 2 * fz)
  const l = (a, b, t) => a + (b - a) * t
  const x00 = l(h3(i, j, k), h3(i + 1, j, k), u)
  const x10 = l(h3(i, j + 1, k), h3(i + 1, j + 1, k), u)
  const x01 = l(h3(i, j, k + 1), h3(i + 1, j, k + 1), u)
  const x11 = l(h3(i, j + 1, k + 1), h3(i + 1, j + 1, k + 1), u)
  return l(l(x00, x10, v), l(x01, x11, v), w)
}
const fbm3 = (x, y, z) => vnoise(x, y, z) * 0.55 + vnoise(x * 2.07 + 5, y * 2.07 + 1, z * 2.07 + 3) * 0.3 + vnoise(x * 4.1 + 2, y * 4.1 + 7, z * 4.1 + 4) * 0.15
const angleDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b))

/** Distance from (x, z) to the polyline `pts` ([[x, z], ...]). */
function toPath(x, z, pts) {
  let best = Infinity
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const dx = bx - ax
    const dz = bz - az
    const t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1))
    best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t))
  }
  return best
}

/** Masonry: rows of rough limestone blocks with mortar (UVs in metres, 2 m to the tile). */
function masonryTex(light) {
  const s = light ? 256 : 512
  const rnd = random(17)
  return canvasTex(s, s, g => {
    g.fillStyle = '#4a4238'
    g.fillRect(0, 0, s, s)
    const rows = 8
    const rh = s / rows
    for (let r = 0; r < rows; r++) {
      let x = -rnd() * rh
      while (x < s) {
        const w = rh * (1.1 + rnd() * 1.1)
        const v = 0.82 + rnd() * 0.22
        g.fillStyle = `rgb(${Math.round(128 * v)},${Math.round(122 * v)},${Math.round(110 * v)})`
        g.fillRect(x + 2, r * rh + 2, w - 4, rh - 4)
        x += w
      }
    }
  }, { repeat: true })
}

/** Planks with iron bands, for the doors (one texture across a leaf). */
function plankTex() {
  const rnd = random(23)
  return canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#3a2416'
    g.fillRect(0, 0, w, h)
    const n = 5
    for (let i = 0; i < n; i++) {
      const v = 0.8 + rnd() * 0.3
      g.fillStyle = `rgb(${Math.round(104 * v)},${Math.round(70 * v)},${Math.round(44 * v)})`
      g.fillRect((i * w) / n + 2, 0, w / n - 4, h)
      g.strokeStyle = 'rgba(30,18,10,0.35)'
      for (let k = 0; k < 6; k++) {
        g.beginPath()
        const x = (i * w) / n + 6 + rnd() * (w / n - 12)
        g.moveTo(x, rnd() * h)
        g.lineTo(x + (rnd() - 0.5) * 6, rnd() * h)
        g.stroke()
      }
    }
    g.fillStyle = '#2a2a2e'
    for (const y of [0.14, 0.86]) g.fillRect(0, h * y - 10, w, 20)
    g.fillStyle = '#5a5a60'
    for (const y of [0.14, 0.86]) for (let x = 14; x < w; x += 46) g.fillRect(x, h * y - 3, 6, 6)
  })
}

/** A stalactite (tip at y = 0, hanging down from y = len) or, turned over, a stalagmite: a lathe with a
 *  little irregularity. */
function dripstoneGeometry(seed, { len = 1, r = 0.16, segs = 9, rings = 7 } = {}) {
  const rnd = random(seed)
  const pts = []
  for (let i = 0; i <= rings; i++) {
    const t = i / rings
    const rr = r * Math.pow(t, 0.75) * (0.85 + rnd() * 0.3) + (i === 0 ? 0.004 : 0)
    pts.push(new THREE.Vector2(Math.max(0.004, rr), t * len))
  }
  const geo = new THREE.LatheGeometry(pts, segs)
  geo.computeVertexNormals()
  return geo
}

export function showcaveStage({
  light = false,
  a = 11.5,
  b = 8.5,
  n = 2.6,
  H = 8.5,
  walk = 0.9,
  entrance = { x: -9.2, z: -5.4, half: 2.1, top: 3.7, depth: 10 },
  upper = { x: 7.4, z: -7.0, half: 1.25, y0: 3.3, y1: 6.0, depth: 5.5, rise: 2.4 },
  path = [[-9.6, -6.0], [-6.4, -3.4], [-3.2, -1.2], [0, -0.2], [2.4, 2.4], [1.2, 4.6], [0, 6.2]],
  pool = { x: 4.4, z: 0.6, rx: 2.4, rz: 1.5 },
  columns = [[7.6, 3.6], [-8.4, 3.2]],
  stairDir = -1,
  clear = [],
  lamps = [],
} = {}) {
  const group = new THREE.Group()
  const solids = []
  const textures = []
  const geos = []
  const mats = []
  const tex = t => (textures.push(t), t)
  const geo = g => (geos.push(g), g)
  const mat = m => (mats.push(m), m)
  const updates = []
  const rnd = random(2005)

  // ---- the chamber's shape ----
  const R = th => {
    const c = Math.abs(Math.cos(th))
    const s = Math.abs(Math.sin(th))
    return 1 / Math.pow(Math.pow(c / a, n) + Math.pow(s / b, n), 1 / n)
  }
  const KP = 0.55 // how steep the walls stand: the radius falls as cos(phi)^KP
  const rho = (x, z) => Math.hypot(x, z) / R(Math.atan2(z, x))
  /** The ceiling's height over (x, z) (smooth, without the rock's roughness). */
  const ceilingAt = (x, z) => {
    const r = rho(x, z)
    if (r >= 1) return 0
    const cphi = Math.pow(r, 1 / KP)
    return H * Math.sqrt(1 - cphi * cphi)
  }
  /** The (smooth) wall toward (x, z) at height y: its point and its inward normal. */
  function wallAt(x, z, y) {
    const th = Math.atan2(z, x)
    const phi = Math.asin(clamp(y / H, 0, 0.999))
    const c = Math.pow(Math.cos(phi), KP)
    const r = R(th) * c
    const e = 0.002
    const p = th0 => [R(th0) * c * Math.cos(th0), R(th0) * c * Math.sin(th0)]
    const [x0, z0] = p(th - e)
    const [x1, z1] = p(th + e)
    const tx = x1 - x0
    const tz = z1 - z0
    const tl = Math.hypot(tx, tz)
    // the inward normal: the tangent turned toward the middle
    let nx = -tz / tl
    let nz = tx / tl
    if (nx * Math.cos(th) + nz * Math.sin(th) > 0) {
      nx = -nx
      nz = -nz
    }
    return { x: r * Math.cos(th), z: r * Math.sin(th), nx, nz, tx: tx / tl, tz: tz / tl, theta: th }
  }

  // the openings: where the dome is pushed out into a tunnel
  const ent = wallAt(entrance.x, entrance.z, 0)
  const upp = wallAt(upper.x, upper.z, upper.y0)
  const openings = [
    { theta: ent.theta, half: entrance.half, y0: -2, y1: entrance.top, depth: entrance.depth, rise: 0, out: [-ent.nx, -ent.nz], floor: true },
    { theta: upp.theta, half: upper.half, y0: upper.y0, y1: upper.y1, depth: upper.depth, rise: upper.rise, out: [-upp.nx, -upp.nz], floor: false },
  ]
  function openWeight(o, th, y, c) {
    const s = angleDiff(th, o.theta) * R(o.theta) * Math.max(0.3, c)
    const ex = s / o.half
    const ey = (y - o.y0) / (o.y1 - o.y0)
    const roof = 0.6 + 0.4 * Math.sqrt(Math.max(0, 1 - ex * ex))
    let d = Math.min(1 - Math.abs(ex), roof - ey)
    if (!o.floor) d = Math.min(d, ey * 2.2)
    return smooth(-0.04, 0.32, d)
  }

  // ---- the dome: a grid round and up, rough rock in vertex colours ----
  const NU = light ? 120 : 176
  const NV = light ? 40 : 58
  const pos = new Float32Array((NU + 1) * (NV + 1) * 3)
  const col = new Float32Array((NU + 1) * (NV + 1) * 3)
  const wOpen = new Float32Array((NU + 1) * (NV + 1) * 2)
  const cRock = new THREE.Color('#857b6c')
  const cDark = new THREE.Color('#4f463c')
  const cFlow = new THREE.Color('#b0a387')
  const cWet = new THREE.Color('#3e3a35')
  const cIron = new THREE.Color('#8a5a3a')
  const cc = new THREE.Color()
  for (let j = 0; j <= NV; j++) {
    const v = j / NV
    const phi = v * (Math.PI / 2)
    const y = j === 0 ? -0.2 : H * Math.sin(phi)
    const c = Math.pow(Math.cos(phi), KP)
    for (let i = 0; i <= NU; i++) {
      const th = (i / NU) * TAU
      const rr = R(th) * c
      let x = rr * Math.cos(th)
      let z = rr * Math.sin(th)
      // roughness: knobs, ledges, and vertical flowstone folds near the walls
      const nn = fbm3(x * 0.32, y * 0.32, z * 0.32)
      const folds = vnoise(th * 26, y * 0.35, 3.1)
      const out = (nn - 0.5) * 0.9 + (folds - 0.5) * 0.35 * (1 - v)
      const k = c > 0.05 ? 1 : c / 0.05
      x += Math.cos(th) * out * k
      z += Math.sin(th) * out * k
      let yy = y + (v > 0.55 ? (nn - 0.5) * 0.7 : 0)
      // the openings: pushed out (and up) into tunnels
      const idx = j * (NU + 1) + i
      openings.forEach((o, q) => {
        const w = openWeight(o, th, y, c)
        wOpen[idx * 2 + q] = w
        if (w > 0) {
          x += o.out[0] * o.depth * w
          z += o.out[1] * o.depth * w
          yy += o.rise * w * w
        }
      })
      pos.set([x, yy, z], idx * 3)
      // colour: limestone, darker bands, pale flowstone streaks, wet and dark near the floor
      const band = Math.sin(y * 2.2 + nn * 4.0) * 0.5 + 0.5
      cc.copy(cRock).lerp(cDark, band * 0.45 + (nn - 0.5) * 0.4)
      cc.lerp(cFlow, clamp((folds - 0.62) * 2.6) * (1 - v * 0.6))
      cc.lerp(cWet, clamp(1 - y / 0.9) * 0.55)
      // iron stains here and there, and the vault fading into the dark
      cc.lerp(cIron, clamp((vnoise(x * 0.5 + 9, y * 0.9, z * 0.5) - 0.68) * 3) * 0.6)
      cc.multiplyScalar(lerp(1, 0.6, v))
      col.set([cc.r, cc.g, cc.b], idx * 3)
    }
  }
  const index = []
  const far = (i, q) => wOpen[i * 2 + q] > 0.985
  for (let j = 0; j < NV; j++) {
    for (let i = 0; i < NU; i++) {
      const p00 = j * (NU + 1) + i
      const p10 = p00 + 1
      const p01 = p00 + NU + 1
      const p11 = p01 + 1
      let skip = false
      for (let q = 0; q < openings.length; q++) if (far(p00, q) && far(p10, q) && far(p01, q) && far(p11, q)) skip = true
      if (skip) continue
      index.push(p00, p01, p10, p10, p01, p11)
    }
  }
  const domeGeo = geo(new THREE.BufferGeometry())
  domeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  domeGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  domeGeo.setIndex(index)
  domeGeo.computeVertexNormals()
  const rockMat = mat(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.93, metalness: 0, side: THREE.DoubleSide }))
  const dome = new THREE.Mesh(domeGeo, rockMat)
  group.add(dome)

  // ---- the floor: clay and flowstone, the path paved; the tunnel's floor too ----
  const FW = 2 * a + 4
  const FD = 2 * b + 4
  const floorGeo = geo(new THREE.PlaneGeometry(FW, FD, light ? 70 : 110, light ? 52 : 82))
  floorGeo.rotateX(-Math.PI / 2)
  {
    const p = floorGeo.attributes.position
    const fc = new Float32Array(p.count * 3)
    const cClay = new THREE.Color('#5a4a3a')
    const cStone = new THREE.Color('#766b5a')
    const cPath = new THREE.Color('#a49a88')
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const z = p.getZ(i)
      const nn = fbm3(x * 0.45, 0.5, z * 0.45)
      cc.copy(cClay).lerp(cStone, clamp(nn * 1.3 - 0.2))
      const dp = toPath(x, z, path)
      cc.lerp(cPath, smooth(0.95, 0.6, dp) * 0.85)
      if (dp > 0.7 && dp < 0.95) cc.multiplyScalar(0.8) // the path's kerb
      fc.set([cc.r, cc.g, cc.b], i * 3)
    }
    floorGeo.setAttribute('color', new THREE.BufferAttribute(fc, 3))
  }
  const floorMat = mat(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, metalness: 0.02 }))
  const floor = new THREE.Mesh(floorGeo, floorMat)
  group.add(floor)
  // the lower tunnel's floor, out to the snow
  const tunLen = entrance.depth + 1
  const tunGeo = geo(new THREE.PlaneGeometry(entrance.half * 2 + 1.2, tunLen, 6, 24))
  tunGeo.rotateX(-Math.PI / 2)
  {
    const p = tunGeo.attributes.position
    const fc = new Float32Array(p.count * 3)
    for (let i = 0; i < p.count; i++) {
      const t = (p.getZ(i) + tunLen / 2) / tunLen // 0 at the chamber's end, 1 outside
      const nn = fbm3(p.getX(i) * 0.6, 2, p.getZ(i) * 0.6)
      cc.set('#6a5a48').lerp(new THREE.Color('#8a7f6c'), nn)
      cc.lerp(new THREE.Color('#9a8f7c'), Math.abs(p.getX(i)) < 0.8 ? 0.6 : 0)
      fc.set([cc.r, cc.g, cc.b], i * 3)
      p.setY(i, -0.004 - t * 0.01)
    }
    tunGeo.setAttribute('color', new THREE.BufferAttribute(fc, 3))
  }
  const tunFloor = new THREE.Mesh(tunGeo, floorMat)
  tunFloor.rotation.y = Math.atan2(openings[0].out[0], openings[0].out[1])
  tunFloor.position.set(ent.x + openings[0].out[0] * (tunLen / 2 - 0.6), 0, ent.z + openings[0].out[1] * (tunLen / 2 - 0.6))
  group.add(tunFloor)

  // ---- the doors: a masonry wall across each opening, with its door ----
  const masonry = tex(masonryTex(light))
  const stoneMat = mat(new THREE.MeshStandardMaterial({ map: masonry, roughness: 0.9, color: '#c4bcac' }))
  const stepMat = mat(new THREE.MeshStandardMaterial({ color: '#6f675b', roughness: 0.92 }))
  const treadMat = mat(new THREE.MeshStandardMaterial({ color: '#8d8474', roughness: 0.85 }))
  const woodMat = mat(new THREE.MeshStandardMaterial({ map: tex(plankTex()), roughness: 0.75 }))
  const ironMat = mat(new THREE.MeshStandardMaterial({ color: '#2b2b30', roughness: 0.5, metalness: 0.6 }))
  /** A box with UVs in metres (for the masonry). */
  const blockGeo = (w, h, d) => {
    const g = new THREE.BoxGeometry(w, h, d)
    const uv = g.attributes.uv
    const p = g.attributes.position
    const nrm = g.attributes.normal
    for (let i = 0; i < uv.count; i++) {
      const ax = Math.abs(nrm.getX(i)) > 0.5 ? 'x' : Math.abs(nrm.getY(i)) > 0.5 ? 'y' : 'z'
      const u = ax === 'x' ? p.getZ(i) : p.getX(i)
      const v = ax === 'y' ? p.getZ(i) : p.getY(i)
      uv.setXY(i, u / 2, v / 2)
    }
    return geo(g)
  }
  /** A wall across an opening at `at` (its centre on the ground line), facing the chamber along `inward`, a
   *  doorway `dw` x `dh` from `y0`, the wall `ww` wide from `wy0` to `wy1`; leaves: 1 or 2. */
  function doorway({ at, inward, ww, wy0, wy1, dw, dh, y0, leaves, thick = 0.5 }) {
    const g = new THREE.Group()
    g.position.set(at.x, 0, at.z)
    g.rotation.y = Math.atan2(inward[0], inward[1])
    const side = (ww - dw) / 2
    const lw = new THREE.Mesh(blockGeo(side, wy1 - wy0, thick), stoneMat)
    lw.position.set(-(dw + side) / 2, (wy0 + wy1) / 2, 0)
    const rw = lw.clone()
    rw.position.x = (dw + side) / 2
    const top = new THREE.Mesh(blockGeo(dw, wy1 - (y0 + dh), thick), stoneMat)
    top.position.set(0, (y0 + dh + wy1) / 2, 0)
    g.add(lw, rw, top)
    if (y0 > wy0 + 0.01) {
      const sill = new THREE.Mesh(blockGeo(dw, y0 - wy0, thick), stoneMat)
      sill.position.set(0, (wy0 + y0) / 2, 0)
      g.add(sill)
    }
    // a frame of dark timber round the doorway
    for (const [w, h, x, y] of [[0.12, dh, -dw / 2 - 0.06, y0 + dh / 2], [0.12, dh, dw / 2 + 0.06, y0 + dh / 2], [dw + 0.24, 0.14, 0, y0 + dh + 0.07]]) {
      const f = new THREE.Mesh(geo(new THREE.BoxGeometry(w, h, thick + 0.06)), ironMat)
      f.position.set(x, y, 0)
      g.add(f)
    }
    const hinges = []
    const lw0 = dw / leaves
    for (let k = 0; k < leaves; k++) {
      const s = leaves === 1 ? -1 : k === 0 ? -1 : 1 // the hinge's side
      const hinge = new THREE.Group()
      hinge.position.set((s * dw) / 2, y0, thick / 2 - 0.04)
      const leaf = new THREE.Mesh(geo(new THREE.BoxGeometry(lw0 - 0.02, dh - 0.02, 0.07)), woodMat)
      leaf.position.set((-s * lw0) / 2, dh / 2, 0)
      hinge.add(leaf)
      // a ring handle
      const handle = new THREE.Mesh(geo(new THREE.TorusGeometry(0.06, 0.012, 6, 14)), ironMat)
      handle.position.set(-s * (lw0 - 0.16), dh * 0.48, 0.05)
      hinge.add(handle)
      hinge.userData.side = s
      g.add(hinge)
      hinges.push(hinge)
    }
    group.add(g)
    let k = 1
    return {
      group: g,
      leaves: hinges,
      /** 0 shut, 1 open (the leaves swing into the chamber). */
      set(v) {
        k = clamp(v)
        for (const h of hinges) h.rotation.y = h.userData.side * -k * 1.75
      },
      get k() {
        return k
      },
    }
  }
  const botAt = { x: ent.x - ent.nx * 1.3, z: ent.z - ent.nz * 1.3 }
  const bottomDoor = doorway({
    at: botAt,
    inward: [ent.nx, ent.nz],
    ww: entrance.half * 2 + 2.4,
    wy0: -0.1,
    wy1: entrance.top + 1.6,
    dw: 2.6,
    dh: 2.75,
    y0: 0,
    leaves: 2,
  })
  const topAt = { x: upp.x - upp.nx * 0.55, z: upp.z - upp.nz * 0.55 }
  const topDoor = doorway({
    at: topAt,
    inward: [upp.nx, upp.nz],
    ww: upper.half * 2 + 1.8,
    wy0: upper.y0 - 0.9,
    wy1: upper.y1 + 1.2,
    dw: 1.05,
    dh: 2.05,
    y0: upper.y0 + 0.12,
    leaves: 1,
  })
  bottomDoor.set(1)
  topDoor.set(1)
  solids.push(box(botAt.x, botAt.z, entrance.half * 2 + 2.4, 0.6, { rot: Math.atan2(ent.nz, -ent.nx) + Math.PI / 2 }))

  // ---- the stair up the wall to the top door's landing ----
  const stairs = new THREE.Group()
  group.add(stairs)
  const STEPS = 13
  const landY = upper.y0 + 0.12
  const thTop = Math.atan2(topAt.z + upp.nz * 1.0, topAt.x + upp.nx * 1.0)
  // the stair runs down the wall toward the middle of the back (`stairDir`: -1 toward lower angles)
  const stepAt = k => {
    // k = 0 the landing, STEPS the floor
    const th = thTop + stairDir * (k === 0 ? 0 : 0.055 + k * 0.031)
    const y = landY * (1 - k / STEPS)
    const w = wallAt(Math.cos(th), Math.sin(th), Math.max(0.3, y))
    return { x: w.x + w.nx * 0.95, z: w.z + w.nz * 0.95, y, rot: Math.atan2(-w.tz, w.tx) }
  }
  const railPts = []
  for (let k = 0; k <= STEPS; k++) {
    const s = stepAt(k)
    const h = Math.max(0.12, s.y)
    const depth = k === 0 ? 1.15 : 0.34
    // a concrete step on a rough plinth (the stair is built up against the rock), its tread lighter
    const st = new THREE.Mesh(geo(new THREE.BoxGeometry(depth, h, 1.25)), stepMat)
    st.position.set(s.x, h / 2, s.z)
    st.rotation.y = s.rot
    const tr = new THREE.Mesh(geo(new THREE.BoxGeometry(depth + 0.04, 0.05, 1.29)), treadMat)
    tr.position.set(s.x, h + 0.02, s.z)
    tr.rotation.y = s.rot
    stairs.add(st, tr)
    solids.push(box(s.x, s.z, depth, 1.3, { rot: s.rot, y1: h + 50 }))
    const w = wallAt(s.x, s.z, 1)
    railPts.push(new THREE.Vector3(s.x + w.nx * 0.6, h + 0.95, s.z + w.nz * 0.6))
    if (k % 2 === 0) {
      const post = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 6)), ironMat)
      post.position.set(s.x + w.nx * 0.6, h + 0.475, s.z + w.nz * 0.6)
      stairs.add(post)
    }
  }
  const rail = new THREE.Mesh(geo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts), 64, 0.03, 6, false)), ironMat)
  stairs.add(rail)

  // ---- dripstones ----
  const keepOut = [
    ...clear,
    ...Array.from({ length: STEPS + 1 }, (_, k) => stepAt(k)).map(s => [s.x, s.z, 1.1]),
    ...path.map(([x, z]) => [x, z, 1.2]),
    [pool.x, pool.z, Math.max(pool.rx, pool.rz) + 0.4],
    [botAt.x, botAt.z, 3.2],
  ]
  const free = (x, z, r = 0) => keepOut.every(([cx, cz, cr]) => Math.hypot(x - cx, z - cz) > cr + r) && toPath(x, z, path) > 1.3 + r
  const stoneCol = new THREE.Color('#c2b392')
  const dripMat = mat(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55, metalness: 0.02 }))
  const tites = []
  const mites = []
  for (let tries = 0; tites.length < (light ? 70 : 130) && tries < 3000; tries++) {
    const x = (rnd() * 2 - 1) * a * 0.95
    const z = (rnd() * 2 - 1) * b * 0.95
    const r = rho(x, z)
    if (r > 0.9 || r < 0.12) continue
    const cy = ceilingAt(x, z)
    if (cy < 3.4) continue
    // short ones over the stations and paths, longer elsewhere
    const len = free(x, z) ? 0.5 + rnd() * 1.9 : 0.2 + rnd() * 0.45
    if (cy - len < 2.6) continue
    tites.push({ x, z, y: cy + 0.25, len, r: 0.09 + len * 0.07 + rnd() * 0.05, s: rnd() })
  }
  for (let tries = 0; mites.length < (light ? 26 : 46) && tries < 3000; tries++) {
    const x = (rnd() * 2 - 1) * a
    const z = (rnd() * 2 - 1) * b
    const r = rho(x, z)
    if (r > 0.97 || (r < 0.86 && rnd() < 0.75)) continue
    if (!free(x, z, 0.4)) continue
    const len = 0.3 + rnd() * (r > 0.9 ? 1.3 : 0.9)
    mites.push({ x, z, len, r: 0.14 + len * 0.1 + rnd() * 0.06 })
    if (r < 0.9) solids.push(circle(x, z, 0.2 + len * 0.1))
  }
  // around the pool, a ring of little ones
  for (let k = 0; k < (light ? 6 : 10); k++) {
    const t = (k / 10) * TAU + 0.3
    const x = pool.x + Math.cos(t) * (pool.rx + 0.35 + rnd() * 0.3)
    const z = pool.z + Math.sin(t) * (pool.rz + 0.35 + rnd() * 0.3)
    if (toPath(x, z, path) < 1.1) continue
    mites.push({ x, z, len: 0.2 + rnd() * 0.6, r: 0.1 + rnd() * 0.08 })
  }
  const titeGeo = geo(dripstoneGeometry(3, { len: 1, r: 1 }))
  const titeMesh = new THREE.InstancedMesh(titeGeo, dripMat, tites.length)
  const mite = geo(dripstoneGeometry(9, { len: 1, r: 1, segs: 10 }))
  mite.rotateX(Math.PI)
  mite.translate(0, 1, 0)
  const miteMesh = new THREE.InstancedMesh(mite, dripMat, mites.length)
  const o = new THREE.Object3D()
  tites.forEach((t, i) => {
    // hanging: the lathe's tip (y = 0) at the bottom, so it is placed with its top at the ceiling
    o.position.set(t.x, t.y - t.len, t.z)
    o.rotation.set((rnd() - 0.5) * 0.06, rnd() * TAU, (rnd() - 0.5) * 0.06)
    o.scale.set(t.r, t.len, t.r)
    o.updateMatrix()
    titeMesh.setMatrixAt(i, o.matrix)
    titeMesh.setColorAt(i, cc.copy(stoneCol).multiplyScalar(0.78 + t.s * 0.3))
  })
  mites.forEach((m, i) => {
    o.position.set(m.x, -0.05, m.z)
    o.rotation.set(0, rnd() * TAU, 0)
    o.scale.set(m.r, m.len, m.r)
    o.updateMatrix()
    miteMesh.setMatrixAt(i, o.matrix)
    miteMesh.setColorAt(i, cc.copy(stoneCol).multiplyScalar(0.7 + rnd() * 0.3))
  })
  group.add(titeMesh, miteMesh)
  // two columns, where a stalactite met its stalagmite
  for (const [x, z] of columns) {
    const top = ceilingAt(x, z) + 0.3
    const pts = []
    const cr = random(Math.round(x * 13 + z * 7))
    for (let i = 0; i <= 16; i++) {
      const t = i / 16
      const waist = 0.32 + 0.55 * Math.pow(Math.abs(t - 0.55) * 1.7, 1.6)
      pts.push(new THREE.Vector2(waist * (0.9 + cr() * 0.2), t * top))
    }
    const colGeo = geo(new THREE.LatheGeometry(pts, 14))
    const colm = new THREE.Mesh(colGeo, mat(new THREE.MeshStandardMaterial({ color: '#b3a383', roughness: 0.6 })))
    colm.position.set(x, -0.05, z)
    group.add(colm)
    solids.push(circle(x, z, 0.95))
  }

  // ---- the pool: still, dark water in a rim of flowstone; drops fall into it ----
  const poolShape = new THREE.Shape()
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * TAU
    const wob = 1 + 0.08 * Math.sin(t * 3 + 1) + 0.05 * Math.sin(t * 5)
    const x = Math.cos(t) * pool.rx * wob
    const y = Math.sin(t) * pool.rz * wob
    if (i === 0) poolShape.moveTo(x, y)
    else poolShape.lineTo(x, y)
  }
  const waterMat = mat(new THREE.MeshStandardMaterial({ color: '#0f3240', roughness: 0.06, metalness: 0.65, emissive: '#06222c', emissiveIntensity: 0.6 }))
  const water = new THREE.Mesh(geo(new THREE.ShapeGeometry(poolShape, 24)), waterMat)
  water.rotation.x = -Math.PI / 2
  water.position.set(pool.x, 0.03, pool.z)
  group.add(water)
  const rim = new THREE.Mesh(
    geo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(poolShape.getPoints(40).map(p => new THREE.Vector3(p.x * 1.03, 0.0, -p.y * 1.03)), true), 80, 0.12, 6, true)),
    mat(new THREE.MeshStandardMaterial({ color: '#a29374', roughness: 0.7 })),
  )
  rim.position.set(pool.x, 0.02, pool.z)
  rim.scale.y = 0.55
  group.add(rim)
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * TAU
    solids.push(circle(pool.x + Math.cos(t) * pool.rx * 0.62, pool.z + Math.sin(t) * pool.rz * 0.62, Math.min(pool.rx, pool.rz) * 0.6))
  }
  // drops and their rings
  const dropMat = mat(new THREE.MeshBasicMaterial({ color: '#d8f2ff', transparent: true, opacity: 0.9 }))
  const ringMat = new THREE.MeshBasicMaterial({ color: '#cfefff', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
  mats.push(ringMat)
  const dripFrom = [
    { x: pool.x - 0.7, z: pool.z + 0.2 },
    { x: pool.x + 0.9, z: pool.z - 0.3 },
  ].map(d => {
    const y = ceilingAt(d.x, d.z)
    // a stalactite of its own over each dripping spot
    const sg = new THREE.Mesh(titeGeo, dripMat)
    sg.position.set(d.x, y - 1.3, d.z)
    sg.scale.set(0.16, 1.55, 0.16)
    group.add(sg)
    const drop = new THREE.Mesh(geo(new THREE.SphereGeometry(0.025, 8, 6)), dropMat)
    drop.visible = false
    group.add(drop)
    const ring = new THREE.Mesh(geo(new THREE.RingGeometry(0.9, 1, 32)), ringMat.clone())
    mats.push(ring.material)
    ring.rotation.x = -Math.PI / 2
    ring.position.set(d.x, 0.045, d.z)
    group.add(ring)
    return { ...d, from: y - 1.3, drop, ring, t: rnd() * 4, fall: -1, rt: -1 }
  })
  updates.push((dt) => {
    for (const d of dripFrom) {
      d.t -= dt
      if (d.t <= 0 && d.fall < 0) {
        d.fall = 0
        d.t = 2.2 + Math.random() * 3.5
      }
      if (d.fall >= 0) {
        d.fall += dt
        const y = d.from - 4.9 * d.fall * d.fall
        if (y <= 0.04) {
          d.fall = -1
          d.drop.visible = false
          d.rt = 0
        } else {
          d.drop.visible = true
          d.drop.position.set(d.x, y, d.z)
        }
      }
      if (d.rt >= 0) {
        d.rt += dt
        const s = 0.04 + d.rt * 0.35
        d.ring.scale.set(s, s, s)
        d.ring.material.opacity = Math.max(0, 0.55 * (1 - d.rt / 1.6))
        if (d.rt > 1.6) d.rt = -1
      }
    }
  })

  // ---- low lamps along the path, a few real lights ----
  const lampMat = mat(new THREE.MeshStandardMaterial({ color: '#ffe2a8', emissive: '#ffcf80', emissiveIntensity: 2.2, roughness: 0.4 }))
  const postMat = mat(new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.6, metalness: 0.4 }))
  const lampGeo = geo(new THREE.SphereGeometry(0.07, 12, 8))
  const postGeo = geo(new THREE.CylinderGeometry(0.03, 0.04, 0.5, 6))
  const pathLamps = []
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, az] = path[i]
    const [bx, bz] = path[i + 1]
    const len = Math.hypot(bx - ax, bz - az)
    const nx = -(bz - az) / len
    const nz = (bx - ax) / len
    for (let s = 0; s < len; s += 3.1) {
      const t = s / len
      const side = (pathLamps.length % 2 ? 1 : -1) * 0.95
      const x = ax + (bx - ax) * t + nx * side
      const z = az + (bz - az) * t + nz * side
      if (rho(x, z) > 0.97 && i > 0) continue
      pathLamps.push([x, z])
    }
  }
  for (const [x, z] of pathLamps) {
    const post = new THREE.Mesh(postGeo, postMat)
    post.position.set(x, 0.25, z)
    const bulb = new THREE.Mesh(lampGeo, lampMat)
    bulb.position.set(x, 0.53, z)
    group.add(post, bulb)
  }
  const lightSpots = lamps.length
    ? lamps
    : [
        { x: -6.2, y: 1.0, z: -3.0, i: 9, d: 11, c: '#ffcf8a' },
        { x: 3.6, y: 1.2, z: 2.6, i: 8, d: 10, c: '#ffd59a' },
        { x: -1.0, y: 3.0, z: -4.6, i: 10, d: 11, c: '#ffe0b0' },
        { x: 5.4, y: 3.4, z: -4.8, i: 8, d: 10, c: '#ffd59a' },
        { x: -5.6, y: 2.6, z: 2.4, i: 7, d: 9, c: '#ffdcae' },
        { x: 0.5, y: 0.6, z: 1.0, i: 9, d: 14, c: '#e9d8bc' },
      ]
  for (const L of light ? lightSpots.slice(0, 4) : lightSpots) {
    const pl = new THREE.PointLight(L.c, L.i * (light ? 1.25 : 1), L.d, 1.4)
    pl.position.set(L.x, L.y, L.z)
    group.add(pl)
  }
  group.add(new THREE.HemisphereLight('#5d6680', '#3a2c20', light ? 0.6 : 0.45))

  // ---- soil cracks in the ceiling: where soil air seeps in when the cave breathes the summer way ----
  const crackMat = mat(new THREE.MeshBasicMaterial({ color: '#120e0a' }))
  const cracks = []
  for (const [x, z, len, rot] of [[-1.5, -3.2, 2.2, 0.6], [2.6, -2.0, 1.8, -0.4], [0.4, 1.8, 2.0, 1.2], [-3.6, 0.4, 1.6, -0.9]]) {
    const y = ceilingAt(x, z) - 0.32
    const g = geo(new THREE.PlaneGeometry(len, 0.09, 8, 1))
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + Math.sin(p.getX(i) * 5 + x) * 0.08)
    const m = new THREE.Mesh(g, crackMat)
    m.rotation.set(Math.PI / 2, 0, rot)
    m.position.set(x, y, z)
    group.add(m)
    cracks.push({ x, y: y - 0.05, z, len, rot })
  }

  // ---- outside: snow (or grass), spruces, far hills, the sky, the moon ----
  const outDir = new THREE.Vector2(openings[0].out[0], openings[0].out[1])
  const mouthOut = { x: ent.x + outDir.x * (entrance.depth + 0.4), z: ent.z + outDir.y * (entrance.depth + 0.4) }
  const groundGeo = geo(new THREE.PlaneGeometry(260, 260, light ? 80 : 130, light ? 80 : 130))
  groundGeo.rotateX(-Math.PI / 2)
  const gp = groundGeo.attributes.position
  const snowCol = new Float32Array(gp.count * 3)
  const grassCol = new Float32Array(gp.count * 3)
  const gCol = new Float32Array(gp.count * 3)
  const groundY = (x, z) => {
    const dx = x - mouthOut.x
    const dz = z - mouthOut.z
    const along = dx * outDir.x + dz * outDir.y
    if (along < 0 && rho(x, z) < 1.4) return -0.03
    const d = Math.max(0, along)
    return -0.03 - d * 0.05 + (fbm3(x * 0.04, 1, z * 0.04) - 0.5) * Math.min(1, d / 15) * 6 - Math.min(d, 60) * 0.04
  }
  for (let i = 0; i < gp.count; i++) {
    const x = gp.getX(i)
    const z = gp.getZ(i)
    gp.setY(i, groundY(x, z))
    const nn = fbm3(x * 0.15, 3, z * 0.15)
    cc.set('#7d8aa6').lerp(new THREE.Color('#94a3c0'), nn)
    snowCol.set([cc.r, cc.g, cc.b], i * 3)
    cc.set('#1f3322').lerp(new THREE.Color('#33482c'), nn)
    grassCol.set([cc.r, cc.g, cc.b], i * 3)
  }
  gCol.set(snowCol)
  groundGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3))
  groundGeo.computeVertexNormals()
  const groundMat = mat(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, emissive: '#5a6a8c', emissiveIntensity: 0.28 }))
  const ground = new THREE.Mesh(groundGeo, groundMat)
  group.add(ground)

  // spruces in the outward half, thick a little way off
  const SPR = light ? 70 : 160
  const firParts = []
  const capParts = []
  for (let k = 0; k < 4; k++) {
    const r0 = 1.25 - k * 0.27
    const y0 = 0.6 + k * 1.15
    firParts.push(new THREE.ConeGeometry(r0, 1.9, 8, 1).translate(0, y0 + 0.95, 0))
    capParts.push(new THREE.ConeGeometry(r0 * 0.86, 0.7, 8, 1).translate(0, y0 + 1.55, 0))
  }
  firParts.push(new THREE.CylinderGeometry(0.1, 0.14, 0.9, 6).translate(0, 0.45, 0))
  const firGeo = geo(mergeGeometries(firParts))
  const capGeo = geo(mergeGeometries(capParts))
  firParts.concat(capParts).forEach(g => g.dispose())
  const firMat = mat(new THREE.MeshStandardMaterial({ color: '#1b3226', roughness: 0.95, emissive: '#0c1a14', emissiveIntensity: 0.5 }))
  const capMat = mat(new THREE.MeshStandardMaterial({ color: '#c6d3ea', roughness: 0.95, emissive: '#56637f', emissiveIntensity: 0.35 }))
  const firs = new THREE.InstancedMesh(firGeo, firMat, SPR)
  const caps = new THREE.InstancedMesh(capGeo, capMat, SPR)
  const capBase = []
  let nf = 0
  for (let tries = 0; nf < SPR && tries < SPR * 20; tries++) {
    const ang = (rnd() - 0.5) * 2.2
    const d = 7 + Math.pow(rnd(), 1.5) * 90
    const ca = Math.cos(ang)
    const sa = Math.sin(ang)
    const dx = outDir.x * ca - outDir.y * sa
    const dz = outDir.x * sa + outDir.y * ca
    const x = mouthOut.x + dx * d
    const z = mouthOut.z + dz * d
    if (rho(x, z) < 1.5) continue
    // a clearing in front of the mouth, so the snow and the sky show
    if (d < 22 && Math.abs(ang) < 0.32) continue
    const s = 0.8 + rnd() * 1.0
    o.position.set(x, groundY(x, z) - 0.1, z)
    o.rotation.set(0, rnd() * 6, 0)
    o.scale.set(s, s * (0.9 + rnd() * 0.5), s)
    o.updateMatrix()
    firs.setMatrixAt(nf, o.matrix)
    caps.setMatrixAt(nf, o.matrix)
    capBase.push(o.matrix.clone())
    nf++
  }
  firs.count = caps.count = nf
  group.add(firs, caps)
  // far hills, snowy
  const hillMat = mat(new THREE.MeshStandardMaterial({ color: '#6f7d99', roughness: 1, emissive: '#3c4864', emissiveIntensity: 0.45, flatShading: true }))
  for (let k = 0; k < 7; k++) {
    const ang = (k / 6 - 0.5) * 2.4 + (rnd() - 0.5) * 0.2
    const ca = Math.cos(ang)
    const sa = Math.sin(ang)
    const d = 150 + rnd() * 50
    const x = mouthOut.x + (outDir.x * ca - outDir.y * sa) * d
    const z = mouthOut.z + (outDir.x * sa + outDir.y * ca) * d
    const hill = new THREE.Mesh(geo(new THREE.SphereGeometry(1, 10, 6, 0, TAU, 0, Math.PI / 2)), hillMat)
    hill.scale.set(40 + rnd() * 30, 22 + rnd() * 20, 30 + rnd() * 20)
    hill.position.set(x, -8, z)
    group.add(hill)
  }
  const sky = nightSky({ radius: 400, stars: light ? 900 : 1800, top: '#03050d', mid: '#0a1030', horizon: '#1b2350' })
  group.add(sky)
  // the moon, low over the trees in front of the mouth
  const moonTex = tex(canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,252,240,1)')
    grd.addColorStop(0.22, 'rgba(240,244,255,1)')
    grd.addColorStop(0.27, 'rgba(180,200,255,0.35)')
    grd.addColorStop(1, 'rgba(120,150,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }))
  const moon = new THREE.Sprite(mat(new THREE.SpriteMaterial({ map: moonTex, transparent: true, depthWrite: false, fog: false, toneMapped: false })))
  moon.scale.set(40, 40, 1)
  moon.position.set(mouthOut.x + outDir.x * 300 - outDir.y * 60, 70, mouthOut.z + outDir.y * 300 + outDir.x * 60)
  group.add(moon)

  // the upper passage's far end: a drift of snow can close it
  const upOut = {
    x: upp.x + openings[1].out[0] * upper.depth * 0.9,
    y: upper.y0 + upper.rise * 0.82,
    z: upp.z + openings[1].out[1] * upper.depth * 0.9,
  }
  const driftMat = mat(new THREE.MeshStandardMaterial({ color: '#c3cfe6', roughness: 0.95, emissive: '#56637f', emissiveIntensity: 0.4 }))
  const drift = new THREE.Mesh(geo(new THREE.SphereGeometry(1, 16, 10)), driftMat)
  drift.position.set(upOut.x, upOut.y, upOut.z)
  drift.visible = false
  group.add(drift)
  // snow falling outside, beyond the lower mouth (fireflies in summer)
  const dotTex = tex(canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.45, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }))
  const FL = light ? 220 : 520
  const flPos = new Float32Array(FL * 3)
  const flSeed = new Float32Array(FL)
  const box0 = { x: mouthOut.x + outDir.x * 7, z: mouthOut.z + outDir.y * 7, w: 22, h: 9 }
  for (let i = 0; i < FL; i++) {
    flPos.set([box0.x + (rnd() - 0.5) * box0.w, rnd() * box0.h - 1, box0.z + (rnd() - 0.5) * box0.w], i * 3)
    flSeed[i] = rnd() * 100
  }
  const flGeo = geo(new THREE.BufferGeometry())
  flGeo.setAttribute('position', new THREE.BufferAttribute(flPos, 3))
  const flMat = mat(new THREE.PointsMaterial({ color: '#e6eeff', size: 0.07, map: dotTex, transparent: true, opacity: 0.85, depthWrite: false }))
  const flakes = new THREE.Points(flGeo, flMat)
  flakes.frustumCulled = false
  flakes.raycast = () => {}
  group.add(flakes)
  const FF = light ? 14 : 30
  const ffPos = new Float32Array(FF * 3)
  const ffBase = []
  for (let i = 0; i < FF; i++) {
    const p = [box0.x + (rnd() - 0.5) * box0.w * 0.9, 0.4 + rnd() * 1.8, box0.z + (rnd() - 0.5) * box0.w * 0.9]
    ffBase.push(p)
    ffPos.set(p, i * 3)
  }
  const ffGeo = geo(new THREE.BufferGeometry())
  ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3))
  const ffMat = mat(new THREE.PointsMaterial({ color: '#d8ff7a', size: 0.12, map: dotTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
  const flies = new THREE.Points(ffGeo, ffMat)
  flies.frustumCulled = false
  flies.raycast = () => {}
  group.add(flies)

  let season = 0
  /** 0 winter, 1 summer: the ground, the spruces' snow, snowflakes or fireflies. */
  function setSeason(k) {
    k = clamp(k)
    if (Math.abs(k - season) < 0.002) return
    season = k
    for (let i = 0; i < gCol.length; i++) gCol[i] = lerp(snowCol[i], grassCol[i], k)
    groundGeo.attributes.color.needsUpdate = true
    groundMat.emissiveIntensity = lerp(0.28, 0.08, k)
    const cs = 1 - k
    for (let i = 0; i < nf; i++) {
      o.matrix.copy(capBase[i])
      o.matrix.decompose(o.position, o.quaternion, o.scale)
      o.scale.multiplyScalar(Math.max(0.001, cs))
      o.updateMatrix()
      caps.setMatrixAt(i, o.matrix)
    }
    caps.instanceMatrix.needsUpdate = true
    caps.visible = cs > 0.01
    hillMat.color.set('#6f7d99').lerp(new THREE.Color('#2a3a34'), k)
    hillMat.emissive.set('#3c4864').lerp(new THREE.Color('#141c1c'), k)
  }
  /** Snow and ice closing the top opening (0 none, 1 closed). */
  function setDrift(k) {
    k = clamp(k)
    drift.visible = k > 0.01
    drift.scale.set(0.4 + k * 1.4, 0.2 + k * 1.3, 0.4 + k * 1.4)
  }

  updates.push((dt, t) => {
    sky.userData.update?.(t)
    // snow drifting down, round and round; fireflies blinking in summer
    flMat.opacity = 0.85 * (1 - season)
    flakes.visible = season < 0.98
    if (flakes.visible) {
      for (let i = 0; i < FL; i++) {
        let y = flPos[i * 3 + 1] - dt * 0.7
        if (y < -1) y += box0.h
        flPos[i * 3 + 1] = y
        flPos[i * 3] += Math.sin(t * 0.7 + flSeed[i]) * dt * 0.25
      }
      flGeo.attributes.position.needsUpdate = true
    }
    ffMat.opacity = season > 0.5 ? (season - 0.5) * 2 : 0
    flies.visible = season > 0.52
    if (flies.visible) {
      for (let i = 0; i < FF; i++) {
        const b0 = ffBase[i]
        ffPos[i * 3] = b0[0] + Math.sin(t * 0.4 + i) * 0.8
        ffPos[i * 3 + 1] = b0[1] + Math.sin(t * 0.7 + i * 2.1) * 0.3
        ffPos[i * 3 + 2] = b0[2] + Math.cos(t * 0.33 + i * 1.3) * 0.8
      }
      ffGeo.attributes.position.needsUpdate = true
      ffMat.size = 0.08 + 0.06 * (0.5 + 0.5 * Math.sin(t * 3.1))
    }
  })

  // walking: a ring round the chamber at `walk`, open toward nothing (the doors' walls are solids)
  const NW = 72
  for (let i = 0; i < NW; i++) {
    const th = (i / NW) * TAU
    const rr = R(th) * walk + 0.35
    const seg = ((TAU * R(th) * walk) / NW) * 1.25
    solids.push(box(Math.cos(th) * rr, Math.sin(th) * rr, seg, 0.7, { rot: -th + Math.PI / 2 }))
  }

  return {
    group,
    solids,
    rho,
    ceilingAt,
    wallAt,
    cracks,
    doors: { bottom: bottomDoor, top: topDoor },
    mouths: {
      bottom: { inner: { x: botAt.x, z: botAt.z }, outer: mouthOut, out: [outDir.x, outDir.y], wall: ent },
      top: { inner: { x: topAt.x, y: landY, z: topAt.z }, outer: upOut, out: openings[1].out, wall: upp, landing: stepAt(0) },
    },
    stepAt,
    pool,
    setSeason,
    setDrift,
    rockMat,
    stoneMat,
    ironMat,
    woodMat,
    env: {
      background: new THREE.Color('#04050a'),
      fog: new THREE.Fog('#06070c', 26, 120),
      exposure: 1.05,
      envIntensity: 0.1,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.82 },
      fov: 62,
    },
    cameraBounds: { minX: -a * 0.86, maxX: a * 0.86, minY: 0.35, maxY: H * 0.62, minZ: -b * 0.86, maxZ: b * 0.86 },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      for (const t of textures) t.dispose()
      for (const g of geos) g.dispose()
      for (const m of mats) m.dispose()
    },
  }
}
