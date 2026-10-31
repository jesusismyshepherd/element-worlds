// The Periodic Videos room, the same for every element (docs/knowledge/periodic-videos.md): a corner of a
// chemistry department. South: the arch back to the hall. West: a lab bench under a fume cupboard. East: the
// professor's office corner (a desk, a side table, bookshelves). North: the screen on the wall and a door out
// to a brick courtyard with a red bench, where the experiments that splash and bang are done. An element's
// stations stand on the SPOTS below (its module decides what stands where).
import * as THREE from 'three'
import { canvasTex, random } from '../noble/kit.js'
import { roomWalls, box } from '../../../engine/collide.js'
import { archSurround } from '../../common/props.js'

export const LAB = { x0: -7, x1: 7, z0: -4, z1: 7.5, h: 3.4 }
export const YARD = { x0: -6, x1: 6, z0: -12.5, z1: -4, h: 4.2 }
export const DOORS = { south: 3.6, north: 2.4 }
/** The arch back to the hall, standing in the south doorway (`room.js`). */
export const ARCH = { width: 3.4, height: 3.1 }

/** Where things stand: a surface's top (y), and `face`, the turn that points a part's +x at the visitor
 *  (rotation.y takes +x to (cos, 0, -sin)). `at`: where the visitor stands to use it. */
export const SPOTS = {
  bench: { x: -6.55, z: 0.55, y: 0.92, face: 0, at: { x: -5.4, z: 0.75 } }, // inside the fume cupboard
  benchSide: { x: -6.55, z: 2.6, y: 0.92, face: 0, at: { x: -5.4, z: 2.6 } },
  screen: { x: -3.6, z: LAB.z0 + 0.06, y: 1.75, face: 0, at: { x: -3.6, z: -2.5 } }, // on the north wall
  deskA: { x: 6.25, z: -1.55, y: 0.76, face: Math.PI, at: { x: 5.0, z: -1.55 } }, // on the desk
  deskB: { x: 6.25, z: 0.35, y: 0.76, face: Math.PI, at: { x: 5.0, z: 0.35 } },
  side: { x: 6.3, z: 2.65, y: 0.7, face: Math.PI, at: { x: 5.1, z: 2.65 } },
  yard: { x: 0, z: -8.6, y: 0.85, face: -Math.PI / 2, at: { x: 0, z: -7.25 } }, // the red bench
  // the professor, standing in his corner by the bookshelves, turned toward the room (+z faces the visitor)
  prof: { x: 4.3, z: -2.85, y: 0, face: Math.atan2(-4.3, 3.6), at: { x: 3.45, z: -2.0 } },
}

function bricks(base = '#5a4a42', seed = 3) {
  const rnd = random(seed)
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#8d867c'
    g.fillRect(0, 0, w, h)
    const bw = 64
    const bh = 32
    for (let r = 0; r < h / bh; r++) {
      const off = r % 2 ? bw / 2 : 0
      for (let c = -1; c < w / bw + 1; c++) {
        const k = 0.75 + rnd() * 0.4
        const col = new THREE.Color(base).multiplyScalar(k)
        g.fillStyle = `#${col.getHexString()}`
        g.fillRect(c * bw + off + 2, r * bh + 2, bw - 4, bh - 4)
      }
    }
  }, { repeat: true })
}

function speckled(base, dots, seed = 5, n = 2600) {
  const rnd = random(seed)
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < n; i++) {
      g.fillStyle = dots[i % dots.length]
      g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5)
    }
  }, { repeat: true })
}

export function labRoom({ light = false } = {}) {
  const group = new THREE.Group()
  const solids = []
  const add = (geo, mat, x, y, z, ry = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.rotation.y = ry
    group.add(m)
    return m
  }
  const mats = {
    wall: new THREE.MeshStandardMaterial({ color: '#aeb8ae', roughness: 0.9 }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#c9c9c2', roughness: 0.95 }),
    paper: new THREE.MeshStandardMaterial({ color: '#cfccc2', roughness: 0.95 }),
    panel: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff6e8', emissiveIntensity: 0.85 }),
    cabinet: new THREE.MeshStandardMaterial({ color: '#b8bdc3', roughness: 0.6 }),
    top: new THREE.MeshStandardMaterial({ color: '#24262b', roughness: 0.45 }),
    wood: new THREE.MeshStandardMaterial({ color: '#8a6848', roughness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.6 }),
    red: new THREE.MeshStandardMaterial({ color: '#a14a3a', roughness: 0.75 }),
    sash: new THREE.MeshStandardMaterial({ color: '#dfe9f2', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false }),
  }

  // ---- the lab ----
  const { x0, x1, z0, z1, h } = LAB
  const floorTex = speckled('#7f8b92', ['#6c777e', '#97a2a8', '#5f696f'])
  floorTex.repeat.set(7, 6)
  const floor = add(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.75 }), 0, 0, (z0 + z1) / 2)
  floor.rotation.x = -Math.PI / 2
  const ceil = add(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mats.ceiling, 0, h, (z0 + z1) / 2)
  ceil.rotation.x = Math.PI / 2
  for (const [px, pz] of [[-3, 4], [3, 4], [-3, -0.5], [3, -0.5]]) add(new THREE.BoxGeometry(1.2, 0.04, 0.6), mats.panel, px, h - 0.03, pz)
  // walls: west and east whole; south with the arch's opening; north with the door to the courtyard
  const T = 0.2
  add(new THREE.BoxGeometry(T, h, z1 - z0), mats.wall, x0 - T / 2, h / 2, (z0 + z1) / 2)
  add(new THREE.BoxGeometry(T, h, z1 - z0), mats.wall, x1 + T / 2, h / 2, (z0 + z1) / 2)
  const wallWithDoor = (z, width, doorH, mat = mats.wall, a0 = x0, a1 = x1, depth = T) => {
    const side = (a1 - a0 - width) / 2
    add(new THREE.BoxGeometry(side, h, depth), mat, a0 + side / 2, h / 2, z)
    add(new THREE.BoxGeometry(side, h, depth), mat, a1 - side / 2, h / 2, z)
    add(new THREE.BoxGeometry(width, h - doorH, depth), mat, 0, doorH + (h - doorH) / 2, z)
  }
  wallWithDoor(z1 + T / 2, DOORS.south, 3.2)
  // the wall round the arch: the doorway is a little wider and taller than the arch standing in it
  const surround = add(archSurround(DOORS.south, 3.2, ARCH.width, ARCH.height), mats.wall, 0, 0, z1 - 0.002)
  surround.rotation.y = Math.PI
  wallWithDoor(z0 - T / 2, DOORS.north, 2.5)
  solids.push(...roomWalls(x0, x1, z0, z1, [{ side: 's', at: 0, width: DOORS.south }, { side: 'n', at: 0, width: DOORS.north }], 1))

  // the lab bench along the west wall, a fume cupboard over its middle
  const bz0 = -2.6
  const bz1 = 3.6
  add(new THREE.BoxGeometry(0.8, 0.86, bz1 - bz0), mats.cabinet, x0 + 0.4, 0.43, (bz0 + bz1) / 2)
  add(new THREE.BoxGeometry(0.86, 0.06, bz1 - bz0), mats.top, x0 + 0.43, 0.89, (bz0 + bz1) / 2)
  solids.push(box(x0 + 0.42, (bz0 + bz1) / 2, 0.86, bz1 - bz0))
  const fz = SPOTS.bench.z
  const fw = 1.7
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.84, 1.45, 0.06), mats.cabinet, x0 + 0.42, 0.92 + 0.725, fz + s * fw / 2)
  add(new THREE.BoxGeometry(0.06, 1.45, fw), mats.cabinet, x0 + 0.03, 0.92 + 0.725, fz)
  add(new THREE.BoxGeometry(0.84, 0.32, fw + 0.06), mats.cabinet, x0 + 0.42, 2.37 + 0.16, fz)
  add(new THREE.BoxGeometry(0.02, 0.62, fw - 0.06), mats.sash, x0 + 0.82, 1.98, fz)
  add(new THREE.BoxGeometry(0.04, 0.05, fw - 0.06), mats.dark, x0 + 0.83, 1.66, fz)
  add(new THREE.BoxGeometry(0.5, 0.02, 1.2), mats.panel, x0 + 0.42, 2.35, fz)
  add(new THREE.BoxGeometry(0.3, 1.0, 0.3), mats.cabinet, x0 + 0.42, 2.85 + 0.5 - 0.02, fz)

  // the professor's corner: a desk against the east wall, a side table, bookshelves
  add(new THREE.BoxGeometry(1.0, 0.05, 3.0), mats.wood, x1 - 0.55, 0.735, -0.7)
  add(new THREE.BoxGeometry(0.9, 0.7, 0.5), mats.wood, x1 - 0.55, 0.35, -2.0)
  add(new THREE.BoxGeometry(0.9, 0.7, 0.5), mats.wood, x1 - 0.55, 0.35, 0.6)
  solids.push(box(x1 - 0.55, -0.7, 1.0, 3.0))
  add(new THREE.BoxGeometry(0.6, 0.04, 0.6), mats.wood, SPOTS.side.x, 0.68, SPOTS.side.z)
  add(new THREE.BoxGeometry(0.08, 0.66, 0.08), mats.wood, SPOTS.side.x, 0.33, SPOTS.side.z)
  solids.push(box(SPOTS.side.x, SPOTS.side.z, 0.6, 0.6))
  const rnd = random(21)
  const shelves = [
    { x: x1 - 0.17, z: 5.3, len: 3.4, alongZ: true },
    { x: 4.6, z: z0 + 0.17, len: 4.0, alongZ: false },
  ]
  const BOOKS = []
  const PALETTE = ['#7a2e2e', '#2e4a7a', '#2f6b45', '#8c6d2a', '#5b3a6b', '#b7b2a4', '#9a4e1f', '#24444f', '#d1c7ad']
  for (const s of shelves) {
    const w = s.alongZ ? 0.34 : s.len
    const d = s.alongZ ? s.len : 0.34
    add(new THREE.BoxGeometry(w, 0.04, d), mats.wood, s.x, 0.02, s.z)
    for (let r = 0; r < 5; r++) {
      const y = 0.08 + r * 0.5
      add(new THREE.BoxGeometry(w, 0.03, d), mats.wood, s.x, y, s.z)
      // books along the shelf
      let p = -s.len / 2 + 0.04
      while (p < s.len / 2 - 0.08) {
        const bw = 0.03 + rnd() * 0.035
        const bh = 0.24 + rnd() * 0.16
        BOOKS.push({ x: s.alongZ ? s.x : s.x + p, z: s.alongZ ? s.z + p : s.z, y: y + 0.015 + bh / 2, bw, bh, alongZ: s.alongZ, c: PALETTE[Math.floor(rnd() * PALETTE.length)] })
        p += bw + 0.004
      }
    }
    solids.push(box(s.x, s.z, w, d))
  }
  const books = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.8 }), BOOKS.length)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  BOOKS.forEach((b, i) => {
    m4.compose(new THREE.Vector3(b.x, b.y, b.z), q, b.alongZ ? new THREE.Vector3(0.24, b.bh, b.bw) : new THREE.Vector3(b.bw, b.bh, 0.24))
    books.setMatrixAt(i, m4)
    books.setColorAt(i, new THREE.Color(b.c))
  })
  group.add(books)
  // papers on the desk
  for (let i = 0; i < 5; i++) add(new THREE.BoxGeometry(0.22, 0.006 + i * 0.004, 0.3), mats.paper, x1 - 0.4, 0.765, -0.65 + (i % 2) * 0.05, rnd() * 0.4)

  // ---- the courtyard ----
  const Y = YARD
  const pave = bricks('#6e625a', 8)
  pave.repeat.set((Y.x1 - Y.x0) / 1.2, (Y.z1 - Y.z0) / 1.2)
  const ground = add(new THREE.PlaneGeometry(Y.x1 - Y.x0, Y.z1 - Y.z0), new THREE.MeshStandardMaterial({ map: pave, roughness: 0.92 }), 0, 0, (Y.z0 + Y.z1) / 2)
  ground.rotation.x = -Math.PI / 2
  const brickTex = bricks('#4b3f3b', 3)
  const brickWall = (len, hgt) => {
    const t = brickTex.clone()
    t.needsUpdate = true
    t.repeat.set(len / 2, hgt / 1)
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 })
  }
  add(new THREE.BoxGeometry(T, Y.h, Y.z1 - Y.z0), brickWall(Y.z1 - Y.z0, Y.h), Y.x0 - T / 2, Y.h / 2, (Y.z0 + Y.z1) / 2)
  add(new THREE.BoxGeometry(T, Y.h, Y.z1 - Y.z0), brickWall(Y.z1 - Y.z0, Y.h), Y.x1 + T / 2, Y.h / 2, (Y.z0 + Y.z1) / 2)
  add(new THREE.BoxGeometry(Y.x1 - Y.x0 + 2 * T, Y.h, T), brickWall(Y.x1 - Y.x0, Y.h), 0, Y.h / 2, Y.z0 - T / 2)
  // the lab's wall seen from the courtyard is brick: a skin outside the painted one, and above it
  const skin = brickWall(Y.x1 - Y.x0, h)
  wallWithDoor(z0 - T - 0.03, DOORS.north, 2.5, skin, Y.x0, Y.x1, 0.06)
  add(new THREE.BoxGeometry(Y.x1 - Y.x0, Y.h - h, T), brickWall(Y.x1 - Y.x0, Y.h - h), 0, h + (Y.h - h) / 2, Y.z1 - T / 2)
  solids.push(...roomWalls(Y.x0, Y.x1, Y.z0, Y.z1, [{ side: 's', at: 0, width: DOORS.north }], 1))
  // the red bench
  const yb = SPOTS.yard
  add(new THREE.BoxGeometry(2.4, 0.06, 1.2), mats.red, yb.x, yb.y - 0.03, yb.z)
  for (const sx of [-1.1, 1.1]) for (const sz of [-0.5, 0.5]) add(new THREE.BoxGeometry(0.07, yb.y - 0.06, 0.07), mats.dark, yb.x + sx, (yb.y - 0.06) / 2, yb.z + sz)
  solids.push(box(yb.x, yb.z, 2.4, 1.2))

  // ---- light: an overcast day outside, ceiling panels inside ----
  const sky = new THREE.HemisphereLight('#e6ecf4', '#5a5148', light ? 1.1 : 0.7)
  const sun = new THREE.DirectionalLight('#fff3e2', light ? 1.0 : 1.3)
  sun.position.set(4, 10, -6)
  sun.target.position.set(0, 0, -8)
  group.add(sky, sun, sun.target)
  if (!light) {
    for (const [px, pz] of [[-3, 2], [3, 2], [0, -1.5]]) {
      const l = new THREE.PointLight('#fff4e6', 3.5, 10, 2)
      l.position.set(px, h - 0.3, pz)
      group.add(l)
    }
  }

  return { group, solids, mats }
}
