// A stage for picture rooms (docs/knowledge/picture-rooms.md): a breakfast table on a sunny morning, seen
// from the size of a mouse. Everything is twenty times its real size (K = 20: a real centimetre is 20 cm
// here, `cm(v)` turns one into metres), so the table top is a field of wooden planks, a bowl is a pond with
// a rim like a wall, a cereal box a tower block. The table stands against a wall of blue tiles (as the
// iron picture's), and a window in it, as big as the sky, lets the morning sun in. Beyond the table's
// other edges the kitchen floor lies far below, two chair backs rising over the edge like fences. Big
// surfaces are mid-toned (pale ones bloom to white); the sun casts shadows on a computer.
//
// The walker stays on the table (x0..x1, z0..z1; the wall is at z0). `props` makes the breakfast things at
// this scale, sharing the stage's materials: bowl, tumbler (a glass of juice), cup (with its saucer),
// plate, spoon, fork, box (a cereal box with printed faces). First used by iron's cereal room (2026-10-31).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { roomWalls } from '../../../engine/collide.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'

/** How many times bigger than real everything is. */
export const K = 20
/** A real size in centimetres, as metres in this world. */
export const cm = v => (v * K) / 100

const TAU = Math.PI * 2
// the table top's thickness (4.5 cm), its height over the kitchen floor (75 cm)
const SLAB = cm(4.5)
const DROP = cm(75)

export function tableStage({
  light = false,
  x0 = -11,
  x1 = 11,
  z0 = -9,
  z1 = 7.6,
  wood = '#8a5b3a',
  tile = '#4560a6',
  grout = '#27345e',
  // the window in the wall behind the table: centred at x = at, its sill above the table top
  window: win = { at: -4, width: 14, sill: 2.6, height: 14 },
  // toward the sun: from behind the window, high and to the left
  sunDir = [-0.42, 0.78, -0.46],
  // chair backs beyond the front edge: x of each
  chairs = [-6.5, 6.8],
  // places on the table kept free of crumbs: [x, z, r]
  clear = [],
} = {}) {
  const group = new THREE.Group()
  group.name = 'stage-table'
  const tex = []
  const keep = t => (tex.push(t), t)
  const disposers = []
  const rnd = random(31)
  const W = x1 - x0
  const D = z1 - z0
  const cx = (x0 + x1) / 2
  const cz = (z0 + z1) / 2

  // ---- the planks: boards 12 cm wide running along x, grain and joints, a knot here and there ----
  const PLANK = cm(12)
  const PX = 19.2 // one canvas covers 19.2 m along x and four boards across
  const planks = keep(
    canvasTex(1024, 512, (g, w, h) => {
      const base = new THREE.Color(wood)
      const rows = 4
      const ph = h / rows
      for (let r = 0; r < rows; r++) {
        // each board in two lengths, joined somewhere along it
        const cut = (0.3 + rnd() * 0.4) * w
        for (const [a, b] of [[0, cut], [cut, w]]) {
          const col = base.clone().multiplyScalar(0.86 + rnd() * 0.22)
          g.fillStyle = `#${col.getHexString()}`
          g.fillRect(a, r * ph, b - a, ph)
          // the grain: long waving lines
          for (let i = 0; i < 22; i++) {
            const y = r * ph + 4 + rnd() * (ph - 8)
            g.strokeStyle = rnd() < 0.5 ? 'rgba(52,26,12,0.20)' : 'rgba(255,214,170,0.07)'
            g.lineWidth = 1 + rnd() * 2.2
            g.beginPath()
            g.moveTo(a, y)
            const k = 3 + rnd() * 6
            g.bezierCurveTo(a + (b - a) / 3, y + k, a + (2 * (b - a)) / 3, y - k, b, y + (rnd() - 0.5) * 4)
            g.stroke()
          }
          // a knot, its rings swept round it
          if (rnd() < 0.55) {
            const kx = a + 40 + rnd() * Math.max(10, b - a - 80)
            const ky = r * ph + ph * (0.3 + rnd() * 0.4)
            for (let j = 5; j > 0; j--) {
              g.strokeStyle = `rgba(60,30,14,${0.1 + 0.05 * (5 - j)})`
              g.lineWidth = 2
              g.beginPath()
              g.ellipse(kx, ky, 6 + j * 7, 3 + j * 3, 0, 0, TAU)
              g.stroke()
            }
            g.fillStyle = 'rgba(48,22,10,0.55)'
            g.beginPath()
            g.ellipse(kx, ky, 6, 3.5, 0, 0, TAU)
            g.fill()
          }
          // the joint
          g.fillStyle = 'rgba(30,14,6,0.6)'
          g.fillRect(b - 2, r * ph, 3, ph)
        }
        // the gap between boards
        g.fillStyle = 'rgba(26,12,5,0.75)'
        g.fillRect(0, r * ph, w, 4)
        g.fillStyle = 'rgba(255,220,180,0.1)'
        g.fillRect(0, r * ph + 4, w, 2)
      }
    }, { repeat: true }),
  )
  const topGeo = new THREE.PlaneGeometry(W, D).rotateX(-Math.PI / 2)
  {
    // uv in metres over the canvas's size, so the boards are 12 cm (real) wide wherever the table goes
    const p = topGeo.attributes.position
    const uv = topGeo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + cx) / PX, (p.getZ(i) + cz) / (PLANK * 4))
  }
  const M = {
    top: new THREE.MeshStandardMaterial({ map: planks, roughness: 0.62, metalness: 0 }),
    edge: new THREE.MeshStandardMaterial({ color: new THREE.Color(wood).multiplyScalar(0.82), roughness: 0.6 }),
    leg: new THREE.MeshStandardMaterial({ color: new THREE.Color(wood).multiplyScalar(0.7), roughness: 0.7 }),
    plaster: new THREE.MeshStandardMaterial({ color: '#b9b2a4', roughness: 0.95 }),
    paint: new THREE.MeshStandardMaterial({ color: '#c3cdbf', roughness: 0.55 }),
    steel: new THREE.MeshStandardMaterial({ color: '#b9c0c8', roughness: 0.22, metalness: 0.9, side: THREE.DoubleSide }),
    china: new THREE.MeshStandardMaterial({ color: '#cfd2d8', roughness: 0.28 }),
    glass: new THREE.MeshStandardMaterial({ color: '#dfeef2', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
    chair: new THREE.MeshStandardMaterial({ color: '#6a4631', roughness: 0.65 }),
  }
  // metal needs something to reflect: a soft room with a bright window
  const shine = keep(
    canvasTex(256, 128, (g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, '#9fb3c8')
      grd.addColorStop(0.48, '#e6e2d6')
      grd.addColorStop(0.55, '#b0927a')
      grd.addColorStop(1, '#7a5e48')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      g.fillStyle = '#ffffff'
      g.fillRect(w * 0.18, h * 0.12, w * 0.16, h * 0.3)
    }, { mipmaps: false }),
  )
  shine.mapping = THREE.EquirectangularReflectionMapping
  M.steel.envMap = shine
  M.steel.envMapIntensity = 1.1

  const top = new THREE.Mesh(topGeo, M.top)
  top.position.set(cx, 0, cz)
  top.receiveShadow = true
  group.add(top)
  // the slab under it, its edge rounded like a real table's
  const slab = new THREE.Mesh(new RoundedBoxGeometry(W + 0.5, SLAB, D + 0.5, 3, 0.28), M.edge)
  slab.position.set(cx, -SLAB / 2 - 0.004, cz + 0.25)
  group.add(slab)
  // the legs and the apron, far below the edge
  {
    const legH = DROP - SLAB
    const legGeo = new THREE.BoxGeometry(cm(5), legH, cm(5))
    for (const [x, z] of [[x0 + 1.4, z1 - 1.2], [x1 - 1.4, z1 - 1.2], [x0 + 1.4, z0 + 1.2], [x1 - 1.4, z0 + 1.2]]) {
      const leg = new THREE.Mesh(legGeo, M.leg)
      leg.position.set(x, -SLAB - legH / 2, z)
      group.add(leg)
    }
    const apronH = cm(8)
    for (const [w, d, x, z] of [[W - 2.8, 0.4, cx, z1 - 1.2], [0.4, D - 2.4, x0 + 1.4, cz], [0.4, D - 2.4, x1 - 1.4, cz]]) {
      const a = new THREE.Mesh(new THREE.BoxGeometry(w, apronH, d), M.leg)
      a.position.set(x, -SLAB - apronH / 2, z)
      group.add(a)
    }
  }

  // ---- the kitchen far below: a tiled floor, its walls in the haze, two chairs at the table ----
  const floorTex = keep(
    canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#4a4038'
      g.fillRect(0, 0, w, h)
      const n = 4
      const s = w / n
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const col = new THREE.Color((r + c) % 2 ? '#9a6a4c' : '#b5a48a').multiplyScalar(0.9 + rnd() * 0.15)
          g.fillStyle = `#${col.getHexString()}`
          g.fillRect(c * s + 3, r * s + 3, s - 6, s - 6)
        }
      }
    }, { repeat: true }),
  )
  floorTex.repeat.set(220 / cm(60), 220 / cm(60))
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(220, 220).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 }))
  floor.position.set(0, -DROP, 40)
  group.add(floor)
  {
    const roomMat = new THREE.MeshStandardMaterial({ color: '#b3aa98', roughness: 0.95 })
    const H = cm(250)
    for (const [w, x, z, ry] of [[160, -70, 40, Math.PI / 2], [160, 70, 40, -Math.PI / 2], [140, 0, 120, Math.PI]]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, H), roomMat)
      m.position.set(x, -DROP + H / 2, z)
      m.rotation.y = ry
      group.add(m)
    }
    // a door and a dresser in the haze across the kitchen
    const door = new THREE.Mesh(new THREE.BoxGeometry(cm(80), cm(200), 1), new THREE.MeshStandardMaterial({ color: '#7a5a44', roughness: 0.8 }))
    door.position.set(-20, -DROP + cm(100), 119.4)
    const dresser = new THREE.Mesh(new THREE.BoxGeometry(cm(120), cm(190), cm(45)), new THREE.MeshStandardMaterial({ color: '#5a6f86', roughness: 0.7 }))
    dresser.position.set(30, -DROP + cm(95), 114)
    group.add(door, dresser)
  }
  for (const x of chairs) group.add(chairBack(x, z1 + cm(12), M.chair))

  // ---- the wall of blue tiles behind the table, with the window ----
  const TW = cm(15)
  const TH = cm(7.5)
  const tiles = keep(
    canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = grout
      g.fillRect(0, 0, w, h)
      // two tiles across, eight rows, every other row half a tile along
      const rows = 8
      const th = h / rows
      const tw = w / 2
      const base = new THREE.Color(tile)
      for (let r = 0; r < rows; r++) {
        for (let c = -1; c < 3; c++) {
          const x = c * tw + (r % 2) * (tw / 2)
          g.fillStyle = `#${base.clone().multiplyScalar(0.9 + rnd() * 0.18).getHexString()}`
          g.fillRect(x + 4, r * th + 4, tw - 8, th - 8)
          // the glaze's sheen along the top
          g.fillStyle = 'rgba(220,235,255,0.12)'
          g.fillRect(x + 8, r * th + 7, tw - 16, 5)
          g.fillStyle = 'rgba(10,20,50,0.18)'
          g.fillRect(x + 8, r * th + th - 12, tw - 16, 4)
        }
      }
    }, { repeat: true }),
  )
  const TILE_U = TW * 2
  const TILE_V = TH * 8
  const wallMat = new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.35, metalness: 0 })
  const WALL_Y0 = -DROP
  const WALL_Y1 = cm(250) - DROP
  const WALL_X0 = -70
  const WALL_X1 = 70
  const wx0 = win.at - win.width / 2
  const wx1 = win.at + win.width / 2
  const wy0 = win.sill
  const wy1 = win.sill + win.height
  /** A piece of the wall (a rectangle in x and y), its tiles lined up with the rest. */
  const wallPiece = (ax, bx, ay, by, z = z0, mat = wallMat, flip = false) => {
    const geo = new THREE.PlaneGeometry(bx - ax, by - ay)
    const p = geo.attributes.position
    const uv = geo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + (ax + bx) / 2) / TILE_U, (p.getY(i) + (ay + by) / 2) / TILE_V)
    const m = new THREE.Mesh(geo, mat)
    m.position.set((ax + bx) / 2, (ay + by) / 2, z)
    if (flip) m.rotation.y = Math.PI
    group.add(m)
    return m
  }
  wallPiece(WALL_X0, wx0, WALL_Y0, WALL_Y1)
  wallPiece(wx1, WALL_X1, WALL_Y0, WALL_Y1)
  wallPiece(wx0, wx1, WALL_Y0, wy0)
  wallPiece(wx0, wx1, wy1, WALL_Y1)
  // the window: a deep reveal, a painted frame with a cross, the morning outside
  const REVEAL = cm(12)
  const view = keep(canvasTex(1024, 1024, (g, w, h) => outside(g, w, h, random(7))))
  {
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(win.width, win.height), new THREE.MeshBasicMaterial({ map: view, color: new THREE.Color('#ffffff').multiplyScalar(0.92) }))
    glass.position.set(win.at, (wy0 + wy1) / 2, z0 - REVEAL)
    group.add(glass)
    // the reveal's four sides
    const side = (w, h, x, y, z, rx, ry) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M.plaster)
      m.position.set(x, y, z)
      m.rotation.set(rx, ry, 0)
      group.add(m)
    }
    side(REVEAL, win.height, wx0, (wy0 + wy1) / 2, z0 - REVEAL / 2, 0, Math.PI / 2)
    side(REVEAL, win.height, wx1, (wy0 + wy1) / 2, z0 - REVEAL / 2, 0, -Math.PI / 2)
    side(win.width, REVEAL, win.at, wy1, z0 - REVEAL / 2, Math.PI / 2, 0)
    // the sill: a painted board standing out of the wall
    const sill = new THREE.Mesh(new RoundedBoxGeometry(win.width + 1.2, cm(2.5), REVEAL + cm(5), 2, 0.12), M.paint)
    sill.position.set(win.at, wy0 - cm(1.25), z0 - REVEAL / 2 + cm(2.5))
    sill.castShadow = !light
    group.add(sill)
    // the frame and its cross (as the picture's)
    const bar = cm(3)
    const fz = z0 - REVEAL + cm(2)
    for (const [w, h, x, y] of [
      [win.width, bar, win.at, wy0 + bar / 2],
      [win.width, bar, win.at, wy1 - bar / 2],
      [bar, win.height, wx0 + bar / 2, (wy0 + wy1) / 2],
      [bar, win.height, wx1 - bar / 2, (wy0 + wy1) / 2],
      [bar * 0.8, win.height, win.at, (wy0 + wy1) / 2],
      [win.width, bar * 0.8, win.at, wy0 + win.height * 0.58],
    ]) {
      const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, cm(4), 2, 0.1), M.paint)
      m.position.set(x, y, fz)
      group.add(m)
    }
  }

  // ---- crumbs: a breakfast has been eaten here before ----
  {
    const N = light ? 40 : 90
    const crumbs = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#c99a5c', roughness: 0.9 }), N)
    const d = new THREE.Object3D()
    let n = 0
    for (let tries = 0; n < N && tries < N * 20; tries++) {
      const x = x0 + 0.6 + rnd() * (W - 1.2)
      const z = z0 + 0.8 + rnd() * (D - 1.4)
      if (clear.some(([a, b, r]) => Math.hypot(x - a, z - b) < r)) continue
      const s = 0.02 + rnd() * 0.04
      d.position.set(x, s * 0.5, z)
      d.rotation.set(rnd() * TAU, rnd() * TAU, rnd() * TAU)
      d.scale.set(s * (1 + rnd()), s * 0.7, s * (1 + rnd() * 0.6))
      d.updateMatrix()
      crumbs.setMatrixAt(n++, d.matrix)
    }
    crumbs.count = n
    crumbs.raycast = () => {}
    group.add(crumbs)
  }

  // ---- light: the sky all round, the sun through the window (shadows on a computer), the room's glow ----
  const sun = new THREE.Vector3(...sunDir).normalize()
  group.add(new THREE.HemisphereLight('#e2ecff', '#8a5e3e', light ? 1.5 : 1.15))
  const sunLight = new THREE.DirectionalLight('#fff0d4', light ? 1.7 : 2.3)
  sunLight.position.copy(sun).multiplyScalar(60).add(new THREE.Vector3(cx, 0, cz))
  sunLight.target.position.set(cx, 0, cz)
  if (!light) {
    sunLight.castShadow = true
    sunLight.shadow.mapSize.set(2048, 2048)
    const r = Math.max(W, D) / 2 + 3
    sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -r
    sunLight.shadow.camera.right = sunLight.shadow.camera.top = r
    sunLight.shadow.camera.near = 20
    sunLight.shadow.camera.far = 110
    sunLight.shadow.bias = -0.0004
    sunLight.shadow.normalBias = 0.03
  }
  const fill = new THREE.DirectionalLight('#ffe6c8', 0.55)
  fill.position.set(cx + 6, 12, z1 + 20)
  fill.target.position.set(cx, 0, cz)
  group.add(sunLight, sunLight.target, fill, fill.target)

  // dust drifting in the sunlight, big at this size
  const dust = motes({ count: 240, radius: 11, y0: 0.4, y1: 11, color: '#fff3d6', size: 0.06, opacity: 0.55, speed: 0.05, light })
  dust.group.position.set(win.at + 2, 0, z0 + 7)
  dust.group.raycast = () => {}
  group.add(dust.group)

  // ---- the breakfast things at this size (they share the stage's materials) ----
  const props = {
    /** A china bowl (r, h: its outer size): `innerR(y)` is its inside radius at a height. */
    bowl({ r = cm(8.5), h = cm(7), color = '#3a74d0', wall = cm(0.45) } = {}) {
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.22 })
      const ri = r - wall
      const floorY = cm(1)
      const pts = []
      const foot = r * 0.55
      pts.push([0, floorY * 0.6], [foot - 0.04, floorY * 0.6], [foot, 0], [foot + 0.08, 0], [foot + 0.1, floorY * 0.7])
      const a0 = Math.asin(Math.min(0.99, (foot + 0.14) / r))
      for (let i = 0; i <= 24; i++) {
        const a = a0 + ((Math.PI / 2 - a0) * i) / 24
        pts.push([r * Math.sin(a), h * (1 - Math.cos(a)) + floorY * 0.4 * (1 - i / 24)])
      }
      // the rim, rounded, then the inside down to its floor
      pts.push([r - wall * 0.15, h + wall * 0.4], [r - wall * 0.5, h + wall * 0.55], [ri + wall * 0.1, h + wall * 0.3], [ri, h])
      for (let i = 1; i <= 24; i++) {
        const a = Math.PI / 2 - (Math.PI / 2) * (i / 24)
        pts.push([Math.max(0.001, ri * Math.sin(a)), h - (h - floorY) * Math.cos(a)])
      }
      const geo = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 72)
      const m = new THREE.Mesh(geo, mat)
      m.castShadow = !light
      m.receiveShadow = !light
      const g = new THREE.Group()
      g.add(m)
      const innerR = y => (y <= floorY ? 0 : y >= h ? ri : ri * Math.sin(Math.acos(Math.min(1, (h - y) / (h - floorY)))))
      return { group: g, mesh: m, mat, innerR, rim: h, r, floorY }
    },
    /** A tall glass (r, h) with juice up to `fill`, and an orange slice on its rim. */
    tumbler({ r = cm(3.6), h = cm(14), fill = 0.78, juice = '#f2952a', slice = true } = {}) {
      const g = new THREE.Group()
      const wallGeo = new THREE.CylinderGeometry(r, r * 0.86, h, 40, 1, true)
      wallGeo.translate(0, h / 2, 0)
      const wallMesh = new THREE.Mesh(wallGeo, M.glass)
      wallMesh.renderOrder = 3
      const base = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.86, r * 0.86, cm(0.8), 40), M.glass)
      base.position.y = cm(0.4)
      const juiceMat = new THREE.MeshStandardMaterial({ color: juice, roughness: 0.3, emissive: juice, emissiveIntensity: 0.12, transparent: true, opacity: 0.9 })
      const jh = (h - cm(1)) * fill
      const juiceMesh = new THREE.Mesh(new THREE.CylinderGeometry(r * (0.86 + 0.14 * fill) - 0.03, r * 0.86 - 0.03, jh, 40), juiceMat)
      juiceMesh.position.y = cm(0.8) + jh / 2
      juiceMesh.castShadow = !light
      g.add(juiceMesh, base, wallMesh)
      if (slice) {
        const sliceTex = keep(canvasTex(256, 256, (c, w) => orangeSlice(c, w)))
        const s = new THREE.Mesh(new THREE.CircleGeometry(r * 0.75, 40), new THREE.MeshStandardMaterial({ map: sliceTex, roughness: 0.5, side: THREE.DoubleSide, transparent: true, alphaTest: 0.1 }))
        s.position.set(r * 0.55, h + r * 0.35, 0)
        s.rotation.set(0, Math.PI / 2 - 0.35, 0)
        g.add(s)
      }
      return { group: g, juice: juiceMesh, juiceMat, height: h, r }
    },
    /** A cup and its saucer (r, h: the cup's), with tea in it. */
    cup({ r = cm(4.2), h = cm(6.5), color = '#e9e2d4', tea = '#7a3f18' } = {}) {
      const g = new THREE.Group()
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 })
      const saucer = new THREE.Mesh(new THREE.LatheGeometry([[0, 0.02], [r * 0.9, 0.02], [r * 0.95, 0], [r * 1.05, 0], [r * 1.75, cm(1.2)], [r * 1.72, cm(1.4)], [r * 1.0, cm(0.5)], [0, cm(0.5)]].map(([x, y]) => new THREE.Vector2(x, y)), 48), mat)
      const sy = cm(0.6)
      const body = new THREE.Mesh(new THREE.LatheGeometry([[0, sy], [r * 0.6, sy], [r * 0.62, sy + 0.04], [r * 0.85, sy + h * 0.3], [r, sy + h], [r - 0.04, sy + h + 0.02], [r - 0.07, sy + h], [r * 0.8, sy + h * 0.3], [r * 0.56, sy + 0.1], [0, sy + 0.1]].map(([x, y]) => new THREE.Vector2(x, y)), 48), mat)
      const handle = new THREE.Mesh(new THREE.TorusGeometry(h * 0.27, cm(0.55), 10, 24, Math.PI * 1.3), mat)
      handle.position.set(r + h * 0.08, sy + h * 0.55, 0)
      handle.rotation.z = -Math.PI * 0.65
      const teaMat = new THREE.MeshStandardMaterial({ color: tea, roughness: 0.15 })
      const surface = new THREE.Mesh(new THREE.CircleGeometry(r * 0.93, 40).rotateX(-Math.PI / 2), teaMat)
      surface.position.y = sy + h * 0.82
      for (const m of [saucer, body, handle]) {
        m.castShadow = !light
        m.receiveShadow = !light
      }
      g.add(saucer, body, handle, surface)
      return { group: g, mat, top: sy + h, surface, teaMat, r }
    },
    /** A flat plate (r). */
    plate({ r = cm(9), color = '#cdd0d6' } = {}) {
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.28 })
      const ri = r * 0.68
      const geo = new THREE.LatheGeometry([[0, cm(0.5)], [ri, cm(0.5)], [ri * 1.02, cm(0.35)], [ri * 0.98, cm(0.15)], [ri * 0.96, 0], [ri * 1.05, 0], [ri * 1.1, cm(0.4)], [r * 0.98, cm(1.4)], [r, cm(1.6)], [r * 0.97, cm(1.75)], [ri * 1.02, cm(0.75)], [0, cm(0.75)]].map(([x, y]) => new THREE.Vector2(x, y)), 64)
      const m = new THREE.Mesh(geo, mat)
      m.castShadow = !light
      m.receiveShadow = !light
      const g = new THREE.Group()
      g.add(m)
      return { group: g, mesh: m, top: cm(0.75), r, ri }
    },
    /** A steel spoon lying bowl up along +x (its bowl's middle at x = 0, the handle along -x). */
    spoon({ length = cm(20) } = {}) {
      const g = new THREE.Group()
      const bl = length * 0.27
      const bw = length * 0.19
      const bowlGeo = new THREE.SphereGeometry(1, 32, 12, 0, TAU, Math.PI / 2, Math.PI / 2)
      bowlGeo.scale(bl / 2, length * 0.045, bw / 2)
      const bowlMesh = new THREE.Mesh(bowlGeo, M.steel)
      bowlMesh.position.y = length * 0.045
      const s = new THREE.Shape()
      const hl = length - bl
      s.moveTo(-bl * 0.35, -length * 0.02)
      s.bezierCurveTo(-bl * 0.6, -length * 0.02, -hl * 0.6, -length * 0.025, -hl * 0.85, -length * 0.04)
      s.quadraticCurveTo(-hl - bl * 0.3, -length * 0.045, -hl - bl * 0.3, 0)
      s.quadraticCurveTo(-hl - bl * 0.3, length * 0.045, -hl * 0.85, length * 0.04)
      s.bezierCurveTo(-hl * 0.6, length * 0.025, -bl * 0.6, length * 0.02, -bl * 0.35, length * 0.02)
      s.closePath()
      const handleGeo = new THREE.ExtrudeGeometry(s, { depth: length * 0.012, bevelEnabled: true, bevelThickness: length * 0.004, bevelSize: length * 0.004, bevelSegments: 2, curveSegments: 16 })
      handleGeo.rotateX(Math.PI / 2)
      const handle = new THREE.Mesh(handleGeo, M.steel)
      handle.position.y = length * 0.05
      // the handle rises a little from the bowl
      handle.rotation.z = -0.06
      for (const m of [bowlMesh, handle]) m.castShadow = !light
      g.add(bowlMesh, handle)
      return { group: g, length, bowlLength: bl }
    },
    /** A steel fork lying tines toward +x (its middle at x = 0). */
    fork({ length = cm(19) } = {}) {
      const g = new THREE.Group()
      const s = new THREE.Shape()
      const L = length
      const w = L * 0.11
      // tines and a head, then the handle
      s.moveTo(L * 0.5, -w * 0.5)
      for (let i = 0; i < 4; i++) {
        const y0 = -w * 0.5 + (i * w) / 4
        const y1 = y0 + w / 4
        s.lineTo(L * 0.5, y0 + w * 0.06)
        s.lineTo(L * 0.5, y1 - w * 0.06)
        if (i < 3) {
          s.lineTo(L * 0.3, y1 - w * 0.03)
          s.lineTo(L * 0.3, y1 + w * 0.03)
        }
      }
      s.lineTo(L * 0.5, w * 0.5)
      s.quadraticCurveTo(L * 0.2, w * 0.55, L * 0.1, w * 0.18)
      s.lineTo(-L * 0.38, w * 0.22)
      s.quadraticCurveTo(-L * 0.5, w * 0.24, -L * 0.5, 0)
      s.quadraticCurveTo(-L * 0.5, -w * 0.24, -L * 0.38, -w * 0.22)
      s.lineTo(L * 0.1, -w * 0.18)
      s.quadraticCurveTo(L * 0.2, -w * 0.55, L * 0.5, -w * 0.5)
      const geo = new THREE.ExtrudeGeometry(s, { depth: L * 0.012, bevelEnabled: true, bevelThickness: L * 0.004, bevelSize: L * 0.003, bevelSegments: 2, curveSegments: 10 })
      geo.rotateX(Math.PI / 2)
      const m = new THREE.Mesh(geo, M.steel)
      m.position.y = L * 0.018
      m.castShadow = !light
      g.add(m)
      return { group: g, mesh: m, length: L }
    },
    /** A cereal box (w along x, h, d), its faces printed by front(g, w, h) and side(g, w, h) on canvases. */
    box({ w = cm(20), h = cm(30), d = cm(7), front, side, color = '#e8b23c' } = {}) {
      const plain = new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
      const face = draw => {
        if (!draw) return plain
        const t = keep(canvasTex(512, Math.round((512 * h) / w), draw))
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.65 })
      }
      const sideFace = draw => {
        if (!draw) return plain
        const t = keep(canvasTex(256, Math.round((256 * h) / d), draw))
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.65 })
      }
      // +x, -x, +y, -y, +z (front), -z
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [sideFace(side), sideFace(side), plain, plain, face(front), plain])
      m.position.y = h / 2
      m.castShadow = !light
      m.receiveShadow = !light
      const g = new THREE.Group()
      g.add(m)
      return { group: g, mesh: m, w, h, d }
    },
  }

  return {
    group,
    solids: roomWalls(x0, x1, z0, z1, [], 1),
    mats: M,
    props,
    sunLight,
    sunDir: sun,
    env: {
      background: new THREE.Color('#c9c1b3'),
      fog: new THREE.Fog('#c2b9aa', 45, 170),
      exposure: 1.0,
      envIntensity: 0.45,
      bloom: { strength: 0.32, radius: 0.5, threshold: 0.9 },
      fov: 60,
      shadows: true,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: 14, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
    },
    dispose() {
      for (const t of tex) t.dispose()
      disposers.forEach(f => f())
    },
  }
}

/** A chair's back rising over the table's edge (its seat far below, pushed in under the table). */
function chairBack(x, z, mat) {
  const g = new THREE.Group()
  const seatY = cm(45) - DROP
  const topY = cm(92) - DROP
  const w = cm(42)
  // the seat, mostly under the table, and its back legs going down to the floor
  const seat = new THREE.Mesh(new RoundedBoxGeometry(w, cm(3.5), cm(40), 2, 0.3), mat)
  seat.position.set(0, seatY, -cm(14))
  g.add(seat)
  for (const s of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.5), cm(1.8), topY + DROP, 12), mat)
    post.position.set(s * (w / 2 - cm(2)), (topY - DROP) / 2, cm(4))
    post.rotation.x = -0.06
    g.add(post)
  }
  // the spindles and the curved top rail
  for (let i = 0; i < 5; i++) {
    const sx = (i - 2) * cm(6.5)
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(cm(0.7), cm(0.8), topY - seatY, 8), mat)
    sp.position.set(sx, (topY + seatY) / 2, cm(4) + Math.abs(i - 2) * 0.05)
    sp.rotation.x = -0.06
    g.add(sp)
  }
  const rail = new THREE.Mesh(new THREE.TorusGeometry(cm(40), cm(2.4), 10, 32, 0.9), mat)
  rail.scale.set(1, 1, 1.6)
  rail.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.45)
  rail.position.set(0, topY, cm(4) - cm(40) + 0.1)
  g.add(rail)
  g.position.set(x, 0, z + cm(4))
  return g
}

/** An orange slice: the peel, the pith and the segments round the middle. */
function orangeSlice(g, w) {
  const c = w / 2
  g.clearRect(0, 0, w, w)
  g.fillStyle = '#f08a14'
  g.beginPath()
  g.arc(c, c, c - 2, 0, TAU)
  g.fill()
  g.fillStyle = '#ffe2b0'
  g.beginPath()
  g.arc(c, c, c * 0.86, 0, TAU)
  g.fill()
  for (let i = 0; i < 10; i++) {
    const a0 = (i / 10) * TAU + 0.05
    const a1 = ((i + 1) / 10) * TAU - 0.05
    g.fillStyle = i % 2 ? '#ffa63a' : '#ff9a2a'
    g.beginPath()
    g.moveTo(c + Math.cos((a0 + a1) / 2) * 6, c + Math.sin((a0 + a1) / 2) * 6)
    g.arc(c, c, c * 0.8, a0, a1)
    g.closePath()
    g.fill()
  }
}

/** The morning outside the window: a soft blue sky with the sun's glow high on the left, clouds, a garden
 *  with a hedge, trees and a fence, a neighbour's red roof. */
function outside(g, w, h, rnd) {
  const sky = g.createLinearGradient(0, 0, 0, h * 0.72)
  sky.addColorStop(0, '#6a9fd6')
  sky.addColorStop(0.6, '#a9cbe8')
  sky.addColorStop(1, '#dfe6e2')
  g.fillStyle = sky
  g.fillRect(0, 0, w, h)
  const sun = g.createRadialGradient(w * 0.12, h * 0.1, 0, w * 0.12, h * 0.1, w * 0.45)
  sun.addColorStop(0, 'rgba(255,250,232,0.95)')
  sun.addColorStop(0.15, 'rgba(255,240,205,0.6)')
  sun.addColorStop(1, 'rgba(255,230,190,0)')
  g.fillStyle = sun
  g.fillRect(0, 0, w, h)
  for (const [cx, cy, k] of [[0.5, 0.18, 1], [0.8, 0.3, 0.8], [0.3, 0.38, 0.6], [0.9, 0.1, 0.6]]) {
    for (let i = 0; i < 8; i++) {
      g.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.3})`
      g.beginPath()
      g.ellipse(cx * w + (rnd() - 0.5) * 220 * k, cy * h + (rnd() - 0.5) * 40 * k, (50 + rnd() * 60) * k, (18 + rnd() * 18) * k, 0, 0, TAU)
      g.fill()
    }
  }
  // far trees and a roof
  const hz = h * 0.66
  g.fillStyle = '#b4523a'
  g.beginPath()
  g.moveTo(w * 0.58, hz - 10)
  g.lineTo(w * 0.7, hz - 90)
  g.lineTo(w * 0.86, hz - 10)
  g.fill()
  g.fillStyle = '#e0cfae'
  g.fillRect(w * 0.6, hz - 12, w * 0.24, 40)
  for (let i = 0; i < 18; i++) {
    const tx = rnd() * w
    const tr = 40 + rnd() * 60
    g.fillStyle = rnd() < 0.5 ? '#5b8a4a' : '#6e9a55'
    g.beginPath()
    g.arc(tx, hz + 10 - rnd() * 40, tr, 0, TAU)
    g.fill()
  }
  // the lawn, a hedge and a fence
  g.fillStyle = '#86b05c'
  g.fillRect(0, hz + 30, w, h)
  g.fillStyle = '#3f6e3a'
  g.fillRect(0, hz + 20, w, 60)
  for (let x = 0; x < w; x += 46) {
    g.fillStyle = '#d8cdb8'
    g.fillRect(x, hz + 90, 22, 120)
    g.beginPath()
    g.moveTo(x, hz + 90)
    g.lineTo(x + 11, hz + 74)
    g.lineTo(x + 22, hz + 90)
    g.fill()
  }
  g.fillRect(0, hz + 120, w, 12)
  g.fillRect(0, hz + 180, w, 12)
  // flowers in the grass
  for (let i = 0; i < 60; i++) {
    g.fillStyle = ['#f2d23a', '#ffffff', '#e86a8a'][i % 3]
    g.beginPath()
    g.arc(rnd() * w, hz + 230 + rnd() * (h - hz - 240), 4 + rnd() * 4, 0, TAU)
    g.fill()
  }
}
