// A stage for picture rooms (docs/knowledge/picture-rooms.md): the King's Mine at Kongsberg in Norway, from its
// hillside at dusk into a long gallery. Outside (z from 1 to 17): a clearing in the spruces at the foot of a
// dark rock face with the mine's portal in it, a low sun's afterglow, a valley dropping away to the east
// (+x) with a river, and a town that grows with `town.setYear(year)` (houses, shaft houses, waterwheels; the
// windows glow). Inside (z from 1 down to `Z_END`): a gallery in grey banded gneiss with smooth, rounded walls and
// a sooty roof, as fire-setting leaves them; rails with sleepers and an ore cart, hanging miners' lamps,
// timber frames, a timbered ladder shaft on the left wall, a wooden smoke loft over the far end, a wide
// chamber on the right (the mine's forge) around `CHAMBER`. The end face (`endFace`) can be moved forward
// (`setAdvance(m)`) as the miners cut on. Light follows where the visitor is: `setInside(k)` (0 outside, 1
// deep inside) turns the dusk's fill down and the lamps up. Gives `wallX(side, z, y)` (the gallery wall's x at
// a height), `ceilingAt(z)`, `lampLights` and `solids`. Every big surface is mid-toned (a pale one blooms).
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random, clamp, lerp, smooth } from '../../wings/noble/kit.js'
import { box, circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2

export const Z_PORTAL = 1
export const Z_END = -19
export const HALF = 2.6 // the gallery's half width
export const CHAMBER = { z: -10.4, len: 5.4, extra: 2.4 } // the forge's chamber: the right wall steps out
export const WALL_H = 1.3 // where the walls stop being straight and the roof's arch begins
export const VALLEY_X = 8.2 // the clearing's east edge

// smooth value noise (0..1)
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
  return l(
    l(l(h3(i, j, k), h3(i + 1, j, k), u), l(h3(i, j + 1, k), h3(i + 1, j + 1, k), u), v),
    l(l(h3(i, j, k + 1), h3(i + 1, j, k + 1), u), l(h3(i, j + 1, k + 1), h3(i + 1, j + 1, k + 1), u), v),
    w,
  )
}
const fbm = (x, y, z) => vnoise(x, y, z) * 0.6 + vnoise(x * 2.1 + 5, y * 2.1 + 1, z * 2.1 + 3) * 0.3 + vnoise(x * 4.3 + 2, y * 4.3 + 7, z * 4.3 + 4) * 0.1

const bump = z => Math.exp(-Math.pow((z - CHAMBER.z) / (CHAMBER.len * 0.5), 4))
/** The right wall's distance from the middle line at z (the chamber widens it). */
export const rightAt = z => HALF + CHAMBER.extra * bump(z)
export const leftAt = () => HALF
/** The roof's height at z (a little higher over the chamber). */
export const ceilingAt = z => 4.2 + 0.5 * bump(z)

/** The gallery's cross-section at z as points [x, y] from the floor on the right up over the roof to the floor on
 *  the left: straight walls to WALL_H, then half an ellipse. */
export function profile(z, arch = 34, noise = 0.1) {
  const R = rightAt(z)
  const L = leftAt()
  const H = ceilingAt(z)
  const a = (R + L) / 2
  const cx = (R - L) / 2
  const b = H - WALL_H
  const pts = []
  const push = (x, y, nx, ny) => {
    // rounded and uneven, by hand and by fire: the surface moves along its inward normal
    const n = (fbm(x * 0.6, y * 0.6, z * 0.6) - 0.5) * 2 * noise
    pts.push([x - nx * n, y - ny * n])
  }
  for (let k = 0; k < 3; k++) push(R, (k / 3) * WALL_H, -1, 0)
  for (let k = 0; k <= arch; k++) {
    const phi = (k / arch) * Math.PI
    const c = Math.cos(phi)
    const s = Math.sin(phi)
    push(cx + a * c, WALL_H + b * s, -c * (b / a), -s) // outward normal of the ellipse
  }
  for (let k = 0; k < 3; k++) push(-L, WALL_H - (k / 3) * WALL_H, 1, 0)
  push(-L, 0, 1, 0)
  return pts
}

/** The gallery wall's x at height y and z (side 'r' or 'l'), without the unevenness. */
export function wallX(side, z, y) {
  const R = rightAt(z)
  const L = leftAt()
  const a = (R + L) / 2
  const cx = (R - L) / 2
  const b = ceilingAt(z) - WALL_H
  const x = y <= WALL_H ? a : a * Math.sqrt(Math.max(0, 1 - Math.pow((y - WALL_H) / b, 2)))
  return side === 'r' ? cx + x : cx - x
}

/** Banded grey gneiss: wavy light and dark bands, flecks (UVs in metres, 3 m to the tile). */
function gneissTex(light) {
  const s = light ? 256 : 512
  const rnd = random(61)
  return canvasTex(
    s,
    s,
    g => {
      g.fillStyle = '#6a6867'
      g.fillRect(0, 0, s, s)
      for (let i = 0; i < 46; i++) {
        const y0 = rnd() * s
        const amp = 4 + rnd() * 16
        const f = 1 + Math.floor(rnd() * 2)
        const ph = rnd() * TAU
        const w = 2 + rnd() * 14
        const v = 74 + rnd() * 54
        g.strokeStyle = `rgba(${v + 6},${v + 4},${v},${0.18 + rnd() * 0.3})`
        g.lineWidth = w
        g.beginPath()
        for (let x = 0; x <= s; x += 8) {
          const y = y0 + Math.sin((x / s) * TAU * f + ph) * amp
          if (x) g.lineTo(x, y)
          else g.moveTo(x, y)
        }
        g.stroke()
      }
      for (let i = 0; i < 700; i++) {
        const v = 50 + rnd() * 120
        g.fillStyle = `rgba(${v},${v - 4},${v - 8},0.4)`
        g.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 2.4, 1 + rnd() * 2)
      }
    },
    { repeat: true },
  )
}

/** Gravel and trodden earth for the gallery's floor. */
function gravelTex(light) {
  const s = light ? 256 : 512
  const rnd = random(77)
  return canvasTex(
    s,
    s,
    g => {
      g.fillStyle = '#4a4540'
      g.fillRect(0, 0, s, s)
      for (let i = 0; i < 2600; i++) {
        const v = 52 + rnd() * 70
        g.fillStyle = `rgba(${v + 6},${v + 2},${v - 6},0.7)`
        g.beginPath()
        g.arc(rnd() * s, rnd() * s, 0.8 + rnd() * 3, 0, TAU)
        g.fill()
      }
    },
    { repeat: true },
  )
}

/** The dusk hillside: moss and dry grass, darker in patches (UVs in metres, 4 m to the tile). */
function grassTex(light) {
  const s = light ? 256 : 512
  const rnd = random(88)
  return canvasTex(
    s,
    s,
    g => {
      g.fillStyle = '#4b5237'
      g.fillRect(0, 0, s, s)
      for (let i = 0; i < 160; i++) {
        const v = rnd()
        g.fillStyle = v < 0.5 ? `rgba(36,52,34,${0.12 + rnd() * 0.2})` : `rgba(110,98,60,${0.1 + rnd() * 0.18})`
        g.beginPath()
        g.ellipse(rnd() * s, rnd() * s, 8 + rnd() * 34, 4 + rnd() * 16, rnd() * Math.PI, 0, TAU)
        g.fill()
      }
      for (let i = 0; i < 1800; i++) {
        const v = 70 + rnd() * 60
        g.strokeStyle = `rgba(${v + 20},${v + 28},${v - 20},0.35)`
        g.lineWidth = 1
        const x = rnd() * s
        const y = rnd() * s
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x + (rnd() - 0.5) * 4, y - 3 - rnd() * 6)
        g.stroke()
      }
    },
    { repeat: true },
  )
}

/** Planks: dark old wood grain, boards running along the texture's x. */
function plankTex() {
  const rnd = random(23)
  return canvasTex(
    256,
    256,
    (g, w, h) => {
      g.fillStyle = '#3c2a1c'
      g.fillRect(0, 0, w, h)
      const n = 6
      for (let i = 0; i < n; i++) {
        const v = 0.8 + rnd() * 0.3
        g.fillStyle = `rgb(${Math.round(100 * v)},${Math.round(70 * v)},${Math.round(46 * v)})`
        g.fillRect(0, (i * h) / n + 2, w, h / n - 4)
        g.strokeStyle = 'rgba(30,18,10,0.35)'
        for (let k = 0; k < 7; k++) {
          const y = (i * h) / n + 4 + rnd() * (h / n - 8)
          g.beginPath()
          g.moveTo(rnd() * w, y)
          g.lineTo(rnd() * w, y + (rnd() - 0.5) * 3)
          g.stroke()
        }
      }
    },
    { repeat: true },
  )
}

/** A heightfield-free ground sheet: a plane with UVs in metres. */
function groundSheet(x0, x1, z0, z1, uvScale, segs = 1) {
  const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0, segs, segs)
  geo.rotateX(-Math.PI / 2)
  geo.translate((x0 + x1) / 2, 0, (z0 + z1) / 2)
  const p = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / uvScale, p.getZ(i) / uvScale)
  return geo
}

export function mineStage({ light = false } = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const mats = []
  const solids = []
  const updates = []
  const keepT = t => (textures.push(t), t)
  const keepG = g => (geos.push(g), g)
  const keepM = m => (mats.push(m), m)
  const mk = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    return m
  }
  const rnd = random(5)

  // ---- materials (a few kinds, shared by everything) ----
  const gneissMap = keepT(gneissTex(light))
  gneissMap.repeat.set(1 / 3, 1 / 3)
  const rockMat = keepM(new THREE.MeshStandardMaterial({ map: gneissMap, vertexColors: true, roughness: 0.92, side: THREE.DoubleSide }))
  const faceMat = keepM(new THREE.MeshStandardMaterial({ map: gneissMap, color: '#d0d0d8', roughness: 0.95, side: THREE.DoubleSide }))
  const gravelMap = keepT(gravelTex(light))
  gravelMap.repeat.set(1 / 2, 1 / 2)
  const floorMat = keepM(new THREE.MeshStandardMaterial({ map: gravelMap, roughness: 0.95, color: '#b0aaa2' }))
  const grassMap = keepT(grassTex(light))
  grassMap.repeat.set(1 / 4, 1 / 4)
  const grassMat = keepM(new THREE.MeshStandardMaterial({ map: grassMap, roughness: 1, color: '#e2e4cc' }))
  const plankMap = keepT(plankTex())
  plankMap.repeat.set(1, 1)
  const woodMat = keepM(new THREE.MeshStandardMaterial({ map: plankMap, roughness: 0.85, color: '#c9b8a4' }))
  const darkWood = keepM(new THREE.MeshStandardMaterial({ color: '#3a2a1e', roughness: 0.9 }))
  const ironMat = keepM(new THREE.MeshStandardMaterial({ color: '#3b3d42', roughness: 0.55, metalness: 0.7 }))
  const sootMat = keepM(new THREE.MeshStandardMaterial({ color: '#15130f', roughness: 1 }))

  // =======================================================================================================
  // the gallery: a tube along -z with the cross-section above, UVs in metres, the roof sooty
  // =======================================================================================================
  const NZ = 46
  const zFrom = Z_PORTAL + 0.5
  const zTo = Z_END - 7.4
  const rows = []
  for (let i = 0; i <= NZ; i++) {
    const z = lerp(zFrom, zTo, i / NZ)
    rows.push({ z, pts: profile(z) })
  }
  const NJ = rows[0].pts.length
  const tPos = new Float32Array((NZ + 1) * NJ * 3)
  const tUv = new Float32Array((NZ + 1) * NJ * 2)
  const tCol = new Float32Array((NZ + 1) * NJ * 3)
  for (let i = 0; i <= NZ; i++) {
    let arc = 0
    for (let j = 0; j < NJ; j++) {
      const [x, y] = rows[i].pts[j]
      if (j) arc += Math.hypot(x - rows[i].pts[j - 1][0], y - rows[i].pts[j - 1][1])
      const o = i * NJ + j
      tPos.set([x, y, rows[i].z], o * 3)
      tUv.set([arc, rows[i].z], o * 2)
      // soot: the roof darkest, and darker deeper in where the fires burned
      const up = smooth(1.4, 3.9, y)
      const deep = smooth(-6, -17, rows[i].z)
      const k = lerp(1, 0.34, up) * lerp(1, 0.75, deep) * (0.88 + 0.24 * fbm(x * 1.7, y * 1.7, rows[i].z * 1.7))
      tCol.set([k, k * 0.98, k * 0.96], o * 3)
    }
  }
  const tIdx = []
  for (let i = 0; i < NZ; i++) {
    for (let j = 0; j < NJ - 1; j++) {
      const a = i * NJ + j
      const b = a + 1
      const c = a + NJ
      const d = c + 1
      tIdx.push(a, b, c, b, d, c)
    }
  }
  const tubeGeo = keepG(new THREE.BufferGeometry())
  tubeGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3))
  tubeGeo.setAttribute('uv', new THREE.BufferAttribute(tUv, 2))
  tubeGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 3))
  tubeGeo.setIndex(tIdx)
  tubeGeo.computeVertexNormals()
  const tube = new THREE.Mesh(tubeGeo, rockMat)
  tube.frustumCulled = false
  group.add(tube)

  // the floor
  const floorGeo = keepG(groundSheet(-HALF - 0.4, HALF + CHAMBER.extra + 0.4, Z_END - 7.4, Z_PORTAL + 0.5, 2))
  group.add(mk(floorGeo, floorMat, 0, 0.002, 0))

  // the end face: a cap with the gallery's own outline, which can move forward (setAdvance)
  const capShape = new THREE.Shape(profile(Z_END, 34, 0.1).map(([x, y]) => new THREE.Vector2(x, y)))
  const capGeo = keepG(new THREE.ShapeGeometry(capShape, 1))
  {
    const p = capGeo.attributes.position
    const uv = capGeo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getY(i))
  }
  const endFace = mk(capGeo, faceMat, 0, 0, Z_END)
  group.add(endFace)

  // =======================================================================================================
  // the portal and the rock face (a big cut in the hillside, spruces along its top)
  // =======================================================================================================
  const outline = profile(Z_PORTAL, 34, 0)
  const faceShape = new THREE.Shape([new THREE.Vector2(-60, 0), new THREE.Vector2(VALLEY_X + 9, 0), new THREE.Vector2(VALLEY_X + 9, 9.5), new THREE.Vector2(-60, 9.5)])
  faceShape.holes.push(new THREE.Path(outline.map(([x, y]) => new THREE.Vector2(x, y)).reverse()))
  const faceGeo = keepG(new THREE.ShapeGeometry(faceShape, 1))
  {
    const p = faceGeo.attributes.position
    const uv = faceGeo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getY(i))
  }
  group.add(mk(faceGeo, faceMat, 0, 0, Z_PORTAL))
  // the hill on top of the face: a flat shelf running back, then rising ridges
  group.add(mk(keepG(groundSheet(-60, VALLEY_X + 9, Z_PORTAL - 70, Z_PORTAL, 4)), grassMat, 0, 9.5, 0))
  // a stone surround: blocks round the opening
  const blockMat = keepM(new THREE.MeshStandardMaterial({ map: gneissMap, color: '#8a8a90', roughness: 0.95 }))
  for (let k = 0; k < outline.length - 1; k += 2) {
    const [x, y] = outline[k]
    const [x2, y2] = outline[Math.min(outline.length - 1, k + 1)]
    const len = Math.hypot(x2 - x, y2 - y) + 0.16
    const blk = mk(keepG(new RoundedBoxGeometry(len, 0.34, 0.5, 2, 0.05)), blockMat, (x + x2) / 2, (y + y2) / 2, Z_PORTAL + 0.18)
    blk.rotation.z = Math.atan2(y2 - y, x2 - x)
    group.add(blk)
  }

  // =======================================================================================================
  // outside: the clearing, the valley, trees, rocks, the sky
  // =======================================================================================================
  group.add(mk(keepG(groundSheet(-24, VALLEY_X + 0.01, Z_PORTAL, 40, 4, 4)), grassMat))
  // the valley: the ground falls away east of the clearing to a river, then rises again to the town's hill
  const VX0 = VALLEY_X
  const VX1 = VALLEY_X + 80
  const vz0 = -30
  const vz1 = 90
  const valleyY = x => {
    const t = x - VX0
    if (t < 7) return -t * t * 0.1 // down from the clearing's edge
    if (t < 22) return lerp(-4.9, -5.4, (t - 7) / 15) // the river's flat
    return -5.4 + Math.pow((t - 22) / 30, 1.3) * 8 // the far bank rises, the town up its slope
  }
  const valleyGeo = keepG(new THREE.PlaneGeometry(VX1 - VX0, vz1 - vz0, 64, 24))
  valleyGeo.rotateX(-Math.PI / 2)
  valleyGeo.translate((VX0 + VX1) / 2, 0, (vz0 + vz1) / 2)
  {
    const p = valleyGeo.attributes.position
    const uv = valleyGeo.attributes.uv
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const z = p.getZ(i)
      p.setY(i, valleyY(x) + (fbm(x * 0.12, 0, z * 0.12) - 0.5) * 1.6)
      uv.setXY(i, x / 4, z / 4)
    }
    valleyGeo.computeVertexNormals()
  }
  group.add(mk(valleyGeo, grassMat))
  // the river
  const riverMat = keepM(new THREE.MeshStandardMaterial({ color: '#232c3e', roughness: 0.18, metalness: 0.6, emissive: '#1b2438', emissiveIntensity: 0.5 }))
  const river = mk(keepG(new THREE.PlaneGeometry(9, 160)), riverMat, VALLEY_X + 14.5, -5.0, 30)
  river.rotation.x = -Math.PI / 2
  group.add(river)
  // a stone wall along the clearing's east edge: the way is closed to walkers, not to the eye
  const wallMat = keepM(new THREE.MeshStandardMaterial({ map: gneissMap, color: '#85858a', roughness: 0.95 }))
  for (let z = 2.5; z < 17; z += 0.9) {
    const s = 0.5 + rnd() * 0.25
    group.add(mk(keepG(new RoundedBoxGeometry(0.7, 0.4 + rnd() * 0.2, s, 2, 0.08)), wallMat, VALLEY_X - 0.2 + (rnd() - 0.5) * 0.2, 0.25, z))
  }
  solids.push(box(VALLEY_X + 0.4, 9.5, 1, 16))

  // spruces: one merged geometry, instanced; dark green, a little different each
  const tree = (() => {
    const parts = []
    for (let k = 0; k < 4; k++) {
      const c = new THREE.ConeGeometry(1.25 - k * 0.22, 2.1, 8, 1)
      c.translate(0, 1.4 + k * 1.1, 0)
      parts.push(c)
    }
    const t = new THREE.CylinderGeometry(0.1, 0.16, 1.2, 6)
    t.translate(0, 0.6, 0)
    parts.push(t)
    const g = mergeGeometries(parts.map(p => p.toNonIndexed()))
    parts.forEach(p => p.dispose())
    return keepG(g)
  })()
  const treeMat = keepM(new THREE.MeshStandardMaterial({ color: '#2a4a3a', roughness: 0.95, flatShading: true }))
  const spots = []
  const spot = (x, y, z, s) => spots.push([x, y, z, s])
  // along the cliff's top, round the clearing, on the far hills
  for (let i = 0; i < 70; i++) spot(-50 + rnd() * 66, 9.5, -1 - rnd() * 22, 1.1 + rnd() * 1.4)
  for (let i = 0; i < 26; i++) spot(-20 + rnd() * 10, 0, 3 + rnd() * 34, 1.2 + rnd() * 1.3)
  for (let i = 0; i < 22; i++) spot(-9.6 + rnd() * 3.8, 0, 12 + rnd() * 24, 1.4 + rnd() * 1.3)
  for (let i = 0; i < 40; i++) {
    const x = VALLEY_X + 66 + rnd() * 16
    spot(x, valleyY(x) - 0.4, -20 + rnd() * 100, 1.8 + rnd() * 1.8)
  }
  for (let i = 0; i < 14; i++) spot(-6 + rnd() * 8, 0, 17.6 + rnd() * 6, 1.4 + rnd() * 1.1)
  // a few at the clearing's edge you can walk past
  for (const [x, z, s] of [[-7.6, 4.2, 1.3], [-8.4, 9, 1.6], [-7.2, 13.6, 1.2], [5.2, 15.8, 1.1], [-3.2, 16.8, 1.3]]) spot(x, 0, z, s)
  const trees = new THREE.InstancedMesh(tree, treeMat, spots.length)
  const m4 = new THREE.Matrix4()
  const tc = new THREE.Color()
  spots.forEach(([x, y, z, s], i) => {
    m4.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * TAU), new THREE.Vector3(s, s * (0.9 + rnd() * 0.5), s))
    trees.setMatrixAt(i, m4)
    tc.set('#2a4a3a').offsetHSL((rnd() - 0.5) * 0.05, 0, (rnd() - 0.5) * 0.04)
    trees.setColorAt(i, tc)
  })
  trees.frustumCulled = false
  trees.raycast = () => {}
  group.add(trees)
  // trees you cannot walk through (the ones inside the clearing's edge)
  for (const [x, z, s] of [[-7.6, 4.2, 1.3], [-8.4, 9, 1.6], [-7.2, 13.6, 1.2], [5.2, 15.8, 1.1], [-3.2, 16.8, 1.3]]) solids.push(circle(x, z, 0.35 * s))
  // the dark ridges behind the cliff
  const ridgeMat = keepM(new THREE.MeshStandardMaterial({ color: '#232638', roughness: 1, flatShading: true }))
  for (const [x, z, r, h] of [[-30, -26, 22, 20], [4, -38, 26, 24], [40, -26, 20, 16], [-46, 6, 20, 14]]) {
    const g = keepG(new THREE.SphereGeometry(r, 18, 10, 0, TAU, 0, Math.PI / 2))
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) * (h / r) * (0.85 + 0.3 * fbm(p.getX(i) * 0.1, 0, p.getZ(i) * 0.1)))
    g.computeVertexNormals()
    group.add(mk(g, ridgeMat, x, 9.2, z))
  }

  // the sky: dusk, a few early stars, the afterglow low in the north-east where the town lies
  const sky = nightSky({ stars: light ? 500 : 1100, top: '#171c3c', mid: '#3e3258', horizon: '#c9764e' })
  group.add(sky)
  // =======================================================================================================
  // the town in the valley: houses, shaft houses and waterwheels appearing with the years
  // =======================================================================================================
  const houseGeo = (() => {
    const body = new THREE.BoxGeometry(5, 3.4, 4).toNonIndexed()
    body.translate(0, 1.7, 0)
    const roof = new THREE.ConeGeometry(3.7, 2.1, 4).toNonIndexed()
    roof.rotateY(Math.PI / 4)
    roof.scale(1, 1, 0.82)
    roof.translate(0, 4.4, 0)
    const g = mergeGeometries([body, roof])
    body.dispose()
    roof.dispose()
    return keepG(g)
  })()
  const houseMat = keepM(new THREE.MeshStandardMaterial({ color: '#b09a84', roughness: 0.95, flatShading: true }))
  const nHouses = 52
  const nShaft = 3
  const houses = new THREE.InstancedMesh(houseGeo, houseMat, nHouses + nShaft)
  houses.frustumCulled = false
  houses.raycast = () => {}
  const winGeo = keepG(new THREE.PlaneGeometry(1.0, 1.3))
  const winMat = keepM(new THREE.MeshBasicMaterial({ color: '#ffc46a', toneMapped: false, side: THREE.DoubleSide }))
  const wins = new THREE.InstancedMesh(winGeo, winMat, (nHouses + nShaft) * 2)
  wins.frustumCulled = false
  wins.raycast = () => {}
  const dwell = []
  const townX0 = VALLEY_X + 24
  for (let i = 0; i < nHouses; i++) {
    // streets: rows of houses up the far bank, thinning toward the edges
    const row = i % 5
    const x = townX0 + row * 7.5 + (rnd() - 0.5) * 3.6
    const z = -14 + Math.floor(i / 5) * 8.6 + (rnd() - 0.5) * 3.4 + row * 1.7
    dwell.push({ x, z, y: valleyY(x) + (fbm(x * 0.12, 0, z * 0.12) - 0.5) * 1.6 - 0.3, born: 1624 + Math.pow(i / nHouses, 1.1) * 320, s: 0.85 + rnd() * 0.45, rot: (rnd() - 0.5) * 0.5, big: false, c: tc.clone().set('#7e6f60').offsetHSL((rnd() - 0.5) * 0.06, 0, (rnd() - 0.5) * 0.06).clone() })
  }
  // shaft houses: taller, up the hill on the far side, where the mines were
  for (const [k, [x, z, born]] of [[VALLEY_X + 50, -4, 1624], [VALLEY_X + 56, 30, 1700], [VALLEY_X + 46, 52, 1760]].entries()) {
    dwell.push({ x, z, y: valleyY(x) - 0.3, born, s: 1.5, rot: 0.2 * k, big: true, c: new THREE.Color('#5f5348') })
  }
  const setDwell = year => {
    dwell.forEach((d, i) => {
      const on = year >= d.born ? 1 : 0
      const sx = d.s * (d.big ? 1.5 : 1)
      const sy = d.s * (d.big ? 1.9 : 1)
      m4.compose(new THREE.Vector3(d.x, d.y, d.z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), d.rot), new THREE.Vector3(sx * on, sy * on, sx * on))
      houses.setMatrixAt(i, m4)
      houses.setColorAt(i, d.c)
      for (const k of [0, 1]) {
        const w = new THREE.Matrix4().compose(
          new THREE.Vector3(d.x + Math.cos(d.rot) * (k ? 1.1 : -1.1) * sx + Math.sin(d.rot) * 2.05 * sx, d.y + 1.7 * sy, d.z - Math.sin(d.rot) * (k ? 1.1 : -1.1) * sx + Math.cos(d.rot) * 2.05 * sx),
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), d.rot),
          new THREE.Vector3(on * sx, on * sx, on),
        )
        wins.setMatrixAt(i * 2 + k, w)
      }
    })
    houses.instanceMatrix.needsUpdate = true
    if (houses.instanceColor) houses.instanceColor.needsUpdate = true
    wins.instanceMatrix.needsUpdate = true
  }
  group.add(houses, wins)
  // waterwheels on the river: a rim, spokes and paddles that turn once there is one
  const wheels = []
  const wheelRim = keepG(new THREE.TorusGeometry(3.4, 0.22, 6, 20))
  const wheelSpoke = keepG(new THREE.BoxGeometry(0.18, 6.6, 0.18))
  const wheelPaddle = keepG(new THREE.BoxGeometry(0.9, 0.7, 1.2))
  for (const [z, born] of [[10, 1650], [34, 1740]]) {
    const w = new THREE.Group()
    w.add(mk(wheelRim, darkWood))
    for (let k = 0; k < 4; k++) {
      const sp = mk(wheelSpoke, darkWood)
      sp.rotation.z = (k / 4) * Math.PI
      w.add(sp)
    }
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * TAU
      const pd = mk(wheelPaddle, darkWood, Math.cos(a) * 3.4, Math.sin(a) * 3.4, 0)
      pd.rotation.z = a
      w.add(pd)
    }
    w.position.set(VALLEY_X + 9.6, -2.6, z)
    w.rotation.y = Math.PI / 2
    group.add(w)
    wheels.push({ g: w, born, spin: 0 })
    // the house the wheel works
    const hut = mk(houseGeo, houseMat, VALLEY_X + 6.4, valleyY(VALLEY_X + 6.4), z)
    hut.scale.set(1.1, 1.1, 1.1)
    hut.visible = false
    group.add(hut)
    wheels[wheels.length - 1].hut = hut
  }
  const town = {
    year: 1623,
    setYear(year) {
      town.year = year
      setDwell(year)
      for (const w of wheels) {
        w.g.visible = year >= w.born
        w.hut.visible = year >= w.born
      }
    },
  }
  town.setYear(1623)
  updates.push(dt => {
    for (const w of wheels) if (w.g.visible) w.g.rotation.x += dt * 0.5
  })

  // the shaft house on the cliff's top over the mine, as in the picture
  const topHouse = new THREE.Group()
  topHouse.add(mk(keepG(new THREE.BoxGeometry(4.2, 3.2, 3.4)), darkWood, 0, 1.6, 0))
  const topRoof = mk(keepG(new THREE.ConeGeometry(3.4, 2.2, 4)), darkWood, 0, 4.3, 0)
  topRoof.rotation.y = Math.PI / 4
  topRoof.scale.z = 0.85
  topHouse.add(topRoof)
  topHouse.position.set(-6.5, 9.5, -3.5)
  group.add(topHouse)

  // =======================================================================================================
  // inside: rails, sleepers, an ore cart, timbers, lamps, the shaft, the smoke loft
  // =======================================================================================================
  const railLen = Z_PORTAL - Z_END + 10
  for (const x of [-0.42, 0.42]) group.add(mk(keepG(new THREE.BoxGeometry(0.06, 0.07, railLen)), ironMat, x, 0.1, (Z_PORTAL + Z_END) / 2 - 1))
  const sleeper = keepG(new THREE.BoxGeometry(1.2, 0.07, 0.14))
  const sleepers = new THREE.InstancedMesh(sleeper, darkWood, Math.floor(railLen / 0.8))
  for (let i = 0; i < sleepers.count; i++) {
    m4.makeTranslation(0, 0.035, Z_PORTAL + 1 - i * 0.8)
    sleepers.setMatrixAt(i, m4)
  }
  sleepers.frustumCulled = false
  group.add(sleepers)

  // timber frames: two posts and a cap, as supports in soft stretches
  const frame = z => {
    const L = leftAt()
    const R = rightAt(z)
    for (const [x, h] of [[-L + 0.25, WALL_H + 1.4], [R - 0.25, WALL_H + 1.4]]) group.add(mk(keepG(new THREE.BoxGeometry(0.34, h, 0.34)), woodMat, x, h / 2, z))
    group.add(mk(keepG(new THREE.BoxGeometry(R + L - 0.2, 0.36, 0.38)), woodMat, (R - L) / 2, WALL_H + 1.4 + 0.1, z))
    solids.push(circle(-L + 0.25, z, 0.2), circle(R - 0.25, z, 0.2))
  }
  frame(-0.6)
  frame(-5.0)

  // the ore cart on the rails, with black ore and a silver gleam
  const cart = new THREE.Group()
  cart.add(mk(keepG(new RoundedBoxGeometry(1.1, 0.7, 1.6, 2, 0.06)), ironMat, 0, 0.58, 0))
  for (const [x, z] of [[-0.48, -0.55], [0.48, -0.55], [-0.48, 0.55], [0.48, 0.55]]) {
    const w = mk(keepG(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 14)), ironMat, x, 0.17, z)
    w.rotation.z = Math.PI / 2
    cart.add(w)
  }
  const oreMat = keepM(new THREE.MeshStandardMaterial({ color: '#24242a', roughness: 0.8, flatShading: true }))
  const oreGeo = keepG(new THREE.IcosahedronGeometry(0.17, 0))
  for (let i = 0; i < 16; i++) {
    const o = mk(oreGeo, oreMat, (rnd() - 0.5) * 0.8, 0.98 + rnd() * 0.12, (rnd() - 0.5) * 1.3)
    o.scale.setScalar(0.7 + rnd() * 0.9)
    o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
    cart.add(o)
  }
  cart.position.set(0, 0, -3.3)
  group.add(cart)
  solids.push(box(0, -3.3, 1.2, 1.7))

  // the ladder shaft on the left wall: a timber collar, its ladder going up into the dark
  {
    const z = -7.2
    const x = -HALF + 0.55
    const g = new THREE.Group()
    for (const dz of [-0.7, 0.7]) g.add(mk(keepG(new THREE.BoxGeometry(0.2, 3.4, 0.2)), woodMat, 0, 1.7, dz))
    g.add(mk(keepG(new THREE.BoxGeometry(0.1, 3.5, 1.5)), sootMat, -0.36, 1.75, 0))
    for (const dz of [-0.28, 0.28]) g.add(mk(keepG(new THREE.BoxGeometry(0.07, 3.3, 0.07)), ironMat, 0.05, 1.65, dz))
    for (let k = 0; k < 11; k++) g.add(mk(keepG(new THREE.BoxGeometry(0.07, 0.05, 0.6)), ironMat, 0.05, 0.3 + k * 0.3, 0))
    g.position.set(x, 0, z)
    group.add(g)
    solids.push(box(x - 0.2, z, 0.5, 1.7))
  }

  // the smoke loft: planks over the far end, gaps where the smoke goes up into it
  const loftY = 3.25
  const loftZ0 = -12.2
  const loftZ1 = Z_END - 7
  {
    const planks = new THREE.InstancedMesh(keepG(new THREE.BoxGeometry(1, 0.08, 0.26)), woodMat, Math.floor((loftZ0 - loftZ1) / 0.36))
    const wAt = wallX('r', 0, loftY) - 0.15
    for (let i = 0; i < planks.count; i++) {
      const z = loftZ0 - i * 0.36
      const gap = i % 5 === 2
      m4.compose(new THREE.Vector3(0, loftY, z), new THREE.Quaternion(), new THREE.Vector3(gap ? 0.001 : 2 * wAt - 0.1, 1, 1))
      planks.setMatrixAt(i, m4)
    }
    planks.frustumCulled = false
    group.add(planks)
    for (const z of [-13, -15, -17, -20, -23]) group.add(mk(keepG(new THREE.BoxGeometry(2 * wAt, 0.28, 0.3)), darkWood, 0, loftY - 0.2, z))
  }

  // lamps: iron lanterns on the walls, each with a little warm light (a few lights only)
  const lampMat = keepM(new THREE.MeshStandardMaterial({ color: '#fff0c8', emissive: '#ffb860', emissiveIntensity: 2.4, roughness: 0.5 }))
  const lampLights = []
  const lamp = (side, z, y, lit = true) => {
    const x = wallX(side, z, y) + (side === 'r' ? -0.14 : 0.14)
    const g = new THREE.Group()
    g.add(mk(keepG(new THREE.BoxGeometry(0.16, 0.2, 0.16)), ironMat, 0, 0, 0))
    g.add(mk(keepG(new THREE.SphereGeometry(0.06, 10, 8)), lampMat, 0, 0, 0))
    g.add(mk(keepG(new THREE.ConeGeometry(0.14, 0.12, 8)), ironMat, 0, 0.16, 0))
    g.position.set(x, y, z)
    group.add(g)
    if (lit) {
      const p = new THREE.PointLight('#ffb064', 5, 10, 2)
      p.position.set(x + (side === 'r' ? -0.5 : 0.5), y, z)
      group.add(p)
      lampLights.push(p)
    }
  }
  lamp('l', -2.6, 2.2)
  lamp('l', -8.8, 2.4)
  lamp('l', -15.2, 2.0, !light)
  lamp('r', -1.8, 2.2, false)
  lamp('r', -5.8, 2.2, false)
  lamp('r', -15.6, 2.2, false)

  // dust in the gallery's air, fading
  const dust = (() => {
    const n = light ? 90 : 220
    const pos = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pos.set([(rnd() - 0.5) * 4.6, 0.3 + rnd() * 3.2, Z_PORTAL - 1 - rnd() * 17], i * 3)
      seed[i] = rnd() * 100
    }
    const geo = keepG(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const dotMap = keepT(canvasTex(32, 32, (g, w) => {
      const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }))
    const m = keepM(new THREE.PointsMaterial({ color: '#ffd7a0', map: dotMap, size: 0.035, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending }))
    const pts = new THREE.Points(geo, m)
    pts.frustumCulled = false
    pts.raycast = () => {}
    const base = pos.slice()
    group.add(pts)
    return t => {
      for (let i = 0; i < n; i++) {
        pos[i * 3] = base[i * 3] + Math.sin(t * 0.1 + seed[i]) * 0.3
        pos[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.07 + seed[i] * 1.3) * 0.2
      }
      geo.attributes.position.needsUpdate = true
    }
  })()

  // =======================================================================================================
  // walls to walk inside
  // =======================================================================================================
  const wallT = 1
  for (let z = Z_PORTAL - 0.5; z > Z_END - 8; z -= 1) {
    const z1 = z - 1
    const zc = (z + z1) / 2
    solids.push(box(rightAt(zc) + wallT / 2, zc, wallT, 1.15))
    solids.push(box(-leftAt() - wallT / 2, zc, wallT, 1.15))
  }
  const endSolid = box(0, Z_END - 0.5, 2 * (HALF + CHAMBER.extra + 1), 1)
  solids.push(endSolid)
  // the clearing: the cliff's foot either side of the portal, the west edge, the back
  solids.push(box(-HALF - 8, Z_PORTAL - 0.5, 16, 1))
  solids.push(box((HALF + VALLEY_X) / 2 + 0.5, Z_PORTAL - 0.5, VALLEY_X - HALF + 1, 1))
  solids.push(box(-9.4, 9.5, 1, 17))
  solids.push(box(-0.6, 17.4, 20, 1))

  // =======================================================================================================
  // light that follows the visitor: the dusk's fill outside, the lamps' and fires' glow inside
  // =======================================================================================================
  const hemi = new THREE.HemisphereLight('#9a98c8', '#6a644e', light ? 1.7 : 1.5)
  group.add(hemi)
  const dusk = new THREE.DirectionalLight('#ffb27a', 1.8)
  dusk.position.set(40, 10, -20)
  group.add(dusk)
  let inside = 0
  const setInside = k => {
    inside = clamp(k)
    hemi.intensity = lerp(light ? 1.7 : 1.5, light ? 0.55 : 0.4, inside)
    dusk.intensity = lerp(1.8, 0.0, inside)
    for (const p of lampLights) p.intensity = lerp(2, 5, inside)
  }
  setInside(0)

  let advance = 0
  const setAdvance = m => {
    advance = m
    endFace.position.z = Z_END - m
    endSolid.z = Z_END - 0.5 - m
  }

  return {
    group,
    solids,
    mats: { wood: woodMat, darkWood, iron: ironMat, soot: sootMat, rock: faceMat, ore: oreMat, block: blockMat },
    sky,
    town,
    wheels,
    endFace,
    setAdvance,
    get advance() {
      return advance
    },
    setInside,
    lampLights,
    loftY,
    wallX,
    ceilingAt,
    rightAt,
    env: {
      background: new THREE.Color('#3a3050'),
      fog: new THREE.Fog('#4a3a52', 26, 150),
      exposure: 1.0,
      envIntensity: 0.1,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.86 },
      fov: 62,
    },
    cameraBounds: { minX: -9.0, maxX: VALLEY_X - 0.6, minY: 0.35, maxY: 6.5, minZ: Z_END + 0.6, maxZ: 17.0 },
    update(dt, t) {
      sky.userData.update?.(t)
      dust(t)
      for (const u of updates) u(dt, t)
    },
    dispose() {
      for (const t of textures) t.dispose()
      for (const g of geos) g.dispose()
      for (const m of mats) m.dispose()
    },
  }
}
