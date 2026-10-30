// A stage for picture rooms (docs/knowledge/picture-rooms.md): a cosy kitchen at night, at a real
// kitchen's size. Tiled walls, a wooden worktop on cabinets round the room, a wall oven (hot: its window
// glows), a fridge with the freezer on top, a window on the night sky over the sink, warm lamps hanging
// from the ceiling. Every big surface is mid-toned (pale ones bloom to white). A scene sets its things on
// the worktop with `place(wall, at, out)` (TOP high), and opens the oven and the freezer (`oven.open(k)`,
// `fridge.open(k)`); `inside` and `front` say where a thing goes in and where it waits in front.
//
// Walls: 'n' (z = z0, the far wall), 's' (z = z1, behind the spawn), 'w' (x = x0), 'e' (x = x1); `at` is
// the place along the wall (x for n and s, z for w and e); `out` the distance from the wall into the room.
//
// Another kitchen from the same stage (sodium's baking kitchen, 2026-10-30): `time: 'morning'` (daylight
// through the window, a sunbeam on the floor, the lamps off), `tiles: 'square'` (square tiles with a flower
// in each, as azulejos), `floorStyle: 'tiles'` (a chequerboard of `floorTiles`), `ceilingColor`, `shade`
// (the lamps' shades), `ovenLabel` (its display; `oven.label(text)` changes it). The defaults are
// silicon's kitchen at night, exactly as it was.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { box, roomWalls } from '../../../engine/collide.js'
import { makeText } from '../../../engine/text.js'
import { canvasTex, random } from '../../wings/noble/kit.js'

/** The worktop's surface, metres above the floor. */
export const TOP = 0.92
const DEPTH = 0.64 // the counters, from the wall
const PLINTH = 0.1

const TAU = Math.PI * 2

export function kitchenStage({
  light = false,
  x0 = -5.2,
  x1 = 5.2,
  z0 = -5.4,
  z1 = 6.8,
  height = 3.6,
  tile = '#8a6497',
  grout = '#694a78',
  floorWood = '#7a5139',
  wood = '#a06d45',
  cabinet = '#566488',
  fridgeColor = '#6ea596',
  // counters along the walls: [wall, from, to]; uppers: wall cupboards [wall, from, to]
  runs = [
    ['n', -4.48, 5.2],
    ['w', -4.52, -2.72],
    ['w', -1.82, 6.8],
    ['e', -4.76, 6.8],
    ['s', -4.56, -1.9],
    ['s', 1.9, 4.56],
  ],
  uppers = [
    ['n', -1.2, 5.1],
    ['w', -1.3, 2.4],
    ['e', 0.6, 4.4],
  ],
  oven = { wall: 'w', at: -2.27 },
  fridge = { wall: 'w', at: -4.95 },
  window: win = { wall: 'n', at: -2.6, width: 2.0 },
  time = 'night',
  tiles: tileStyle = 'long',
  floorStyle = 'planks',
  floorTiles = ['#9b5a3c', '#7a4a34'],
  ceilingColor = '#6b5866',
  shade = '#b14a73',
  ovenLabel = '220 °C',
} = {}) {
  const morning = time === 'morning'
  const group = new THREE.Group()
  const disposers = []
  const solids = roomWalls(x0, x1, z0, z1, [], 1)
  const rnd = random(11)

  // ---- where things go ----
  const WALLS = {
    n: { rot: 0, pos: (a, o) => [a, z0 + o] },
    s: { rot: Math.PI, pos: (a, o) => [a, z1 - o] },
    w: { rot: Math.PI / 2, pos: (a, o) => [x0 + o, a] },
    e: { rot: -Math.PI / 2, pos: (a, o) => [x1 - o, a] },
  }
  /** A spot `out` metres from the wall, at `at` along it: { x, z, rot } (rot turns local +z into the room). */
  const place = (wall, at, out = 0) => {
    const w = WALLS[wall]
    const [x, z] = w.pos(at, out)
    return { x, z, rot: w.rot }
  }
  const mount = (obj, wall, at, out = 0, y = 0) => {
    const p = place(wall, at, out)
    obj.position.set(p.x, y, p.z)
    obj.rotation.y = p.rot
    group.add(obj)
    return obj
  }
  /** A solid footprint along a wall (len along it, depth out from it), up to y1. */
  const footprint = (wall, at, len, depth, y1 = 50) => {
    const p = place(wall, at, depth / 2)
    const along = wall === 'n' || wall === 's'
    solids.push(box(p.x, p.z, along ? len : depth, along ? depth : len, { y1 }))
  }

  // ---- materials ----
  const tex = []
  const keep = t => (tex.push(t), t)
  // wall tiles: rows of long tiles, each a little different, in mauve with darker grout (or square ones,
  // each with a flower, as azulejos)
  const tiles = keep(
    canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = grout
      g.fillRect(0, 0, w, h)
      if (tileStyle === 'square') {
        squareTiles(g, w, h, tile, rnd)
        return
      }
      const rows = 8
      const th = h / rows
      const tw = w / 2
      const base = new THREE.Color(tile)
      for (let r = 0; r < rows; r++) {
        for (let c = -1; c < 3; c++) {
          const x = c * tw + (r % 2) * (tw / 2)
          const k = 0.93 + rnd() * 0.12
          const col = base.clone().multiplyScalar(k)
          g.fillStyle = `#${col.getHexString()}`
          g.fillRect(x + 3, r * th + 3, tw - 6, th - 6)
          // a soft sheen along each tile's top edge
          g.fillStyle = 'rgba(255,235,255,0.10)'
          g.fillRect(x + 6, r * th + 5, tw - 12, 5)
        }
      }
    }),
  )
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping
  const TILE_M = 0.64 // one canvas of tiles covers 0.64 m square (tiles 0.32 by 0.08 m)
  // the floor: warm planks (or a chequerboard of tiles)
  const planks = keep(
    canvasTex(512, 512, (g, w, h) => {
      if (floorStyle === 'tiles') {
        checkerTiles(g, w, h, floorTiles, rnd)
        return
      }
      const base = new THREE.Color(floorWood)
      const rows = 6
      const ph = h / rows
      for (let r = 0; r < rows; r++) {
        for (let c = -1; c < 3; c++) {
          const x = c * (w / 2) + (r % 3) * (w / 6)
          const col = base.clone().multiplyScalar(0.88 + rnd() * 0.2)
          g.fillStyle = `#${col.getHexString()}`
          g.fillRect(x, r * ph, w / 2, ph)
          // grain
          g.strokeStyle = 'rgba(40,20,10,0.16)'
          g.lineWidth = 1.5
          for (let i = 0; i < 5; i++) {
            const y = r * ph + 6 + rnd() * (ph - 12)
            g.beginPath()
            g.moveTo(x, y)
            g.bezierCurveTo(x + w / 6, y + rnd() * 6 - 3, x + w / 3, y + rnd() * 6 - 3, x + w / 2, y)
            g.stroke()
          }
          g.fillStyle = 'rgba(30,15,8,0.55)'
          g.fillRect(x, r * ph, 2, ph)
        }
        g.fillStyle = 'rgba(30,15,8,0.6)'
        g.fillRect(0, r * ph, w, 2)
      }
    }),
  )
  planks.wrapS = planks.wrapT = THREE.RepeatWrapping
  // the worktop: wood grain running along it
  const grain = keep(
    canvasTex(512, 64, (g, w, h) => {
      g.fillStyle = wood
      g.fillRect(0, 0, w, h)
      g.strokeStyle = 'rgba(60,30,12,0.22)'
      for (let i = 0; i < 14; i++) {
        g.lineWidth = 1 + rnd() * 1.5
        const y = rnd() * h
        g.beginPath()
        g.moveTo(0, y)
        g.bezierCurveTo(w / 3, y + rnd() * 8 - 4, (2 * w) / 3, y + rnd() * 8 - 4, w, y)
        g.stroke()
      }
    }),
  )
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping

  const M = {
    wall: new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.45, metalness: 0 }),
    floor: new THREE.MeshStandardMaterial({ map: planks, roughness: 0.75 }),
    ceiling: new THREE.MeshStandardMaterial({ color: ceilingColor, roughness: 0.95 }),
    beam: new THREE.MeshStandardMaterial({ color: '#5a3b28', roughness: 0.85 }),
    top: new THREE.MeshStandardMaterial({ map: grain, roughness: 0.6 }),
    cab: new THREE.MeshStandardMaterial({ color: cabinet, roughness: 0.6 }),
    door: new THREE.MeshStandardMaterial({ color: new THREE.Color(cabinet).multiplyScalar(1.12), roughness: 0.55 }),
    plinth: new THREE.MeshStandardMaterial({ color: '#2a2633', roughness: 0.8 }),
    steel: new THREE.MeshStandardMaterial({ color: '#9aa1ac', roughness: 0.3, metalness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: '#232029', roughness: 0.35, metalness: 0.3 }),
    fridge: new THREE.MeshStandardMaterial({ color: fridgeColor, roughness: 0.4 }),
    frame: new THREE.MeshStandardMaterial({ color: '#7b5537', roughness: 0.7 }),
  }

  // ---- the room: floor, tiled walls, ceiling and beams ----
  const W = x1 - x0
  const D = z1 - z0
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), M.floor)
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  planks.repeat.set(W / 1.6, D / 1.6)
  group.add(floor)
  const wallPlane = (len, wall) => {
    const t = tiles.clone()
    t.repeat.set(len / TILE_M, height / TILE_M)
    t.needsUpdate = true
    tex.push(t)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, height), M.wall.clone())
    m.material.map = t
    disposers.push(() => m.material.dispose())
    m.position.y = height / 2
    const mid = wall === 'n' || wall === 's' ? (x0 + x1) / 2 : (z0 + z1) / 2
    mount(m, wall, mid, 0, height / 2)
    return m
  }
  wallPlane(W, 'n')
  wallPlane(W, 's')
  wallPlane(D, 'w')
  wallPlane(D, 'e')
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), M.ceiling)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set((x0 + x1) / 2, height, (z0 + z1) / 2)
  group.add(ceiling)
  for (const z of [z0 + D * 0.22, z0 + D * 0.5, z0 + D * 0.78]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(W, 0.16, 0.2), M.beam)
    b.position.set((x0 + x1) / 2, height - 0.08, z)
    group.add(b)
  }

  // ---- counters: cabinets, doors and handles, a wooden worktop ----
  const doorGeo = new RoundedBoxGeometry(1, 1, 0.024, 2, 0.008)
  const handleGeo = new RoundedBoxGeometry(0.15, 0.018, 0.026, 2, 0.006)
  const fronts = (g, len, y0, h, z, n) => {
    const doors = new THREE.InstancedMesh(doorGeo, M.door, n)
    const handles = new THREE.InstancedMesh(handleGeo, M.steel, n)
    const o = new THREE.Object3D()
    const w = len / n
    for (let i = 0; i < n; i++) {
      const x = -len / 2 + w * (i + 0.5)
      o.position.set(x, y0 + h / 2, z)
      o.scale.set(w - 0.03, h - 0.03, 1)
      o.updateMatrix()
      doors.setMatrixAt(i, o.matrix)
      o.position.set(x, y0 + (y0 > 1 ? 0.07 : h - 0.07), z + 0.02)
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      handles.setMatrixAt(i, o.matrix)
    }
    g.add(doors, handles)
  }
  for (const [wall, a, b] of runs) {
    const len = Math.abs(b - a)
    const g = mount(new THREE.Group(), wall, (a + b) / 2)
    const body = new THREE.Mesh(new THREE.BoxGeometry(len, TOP - 0.05 - PLINTH, DEPTH - 0.04), M.cab)
    body.position.set(0, PLINTH + (TOP - 0.05 - PLINTH) / 2, (DEPTH - 0.04) / 2)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(len, PLINTH, DEPTH - 0.1), M.plinth)
    plinth.position.set(0, PLINTH / 2, (DEPTH - 0.1) / 2)
    const top = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, DEPTH + 0.02), M.top)
    top.position.set(0, TOP - 0.025, (DEPTH + 0.02) / 2)
    g.add(body, plinth, top)
    fronts(g, len, PLINTH + 0.02, TOP - 0.07 - PLINTH - 0.02, DEPTH - 0.04 + 0.012, Math.max(1, Math.round(len / 0.55)))
    footprint(wall, (a + b) / 2, len, DEPTH + 0.02, TOP)
  }
  for (const [wall, a, b] of uppers) {
    const len = Math.abs(b - a)
    const g = mount(new THREE.Group(), wall, (a + b) / 2)
    const body = new THREE.Mesh(new THREE.BoxGeometry(len, 0.66, 0.34), M.cab)
    body.position.set(0, 1.7 + 0.33, 0.17)
    g.add(body)
    fronts(g, len, 1.7, 0.66, 0.34 + 0.012, Math.max(1, Math.round(len / 0.5)))
  }
  // grain runs along every worktop
  grain.repeat.set(3, 1)

  // ---- the window over the sink: the night sky, as in the picture (or a sunny morning) ----
  const sky = keep(
    canvasTex(1024, 640, (g, w, h) => {
      if (morning) {
        morningSky(g, w, h, rnd)
        return
      }
      const grd = g.createLinearGradient(0, 0, 0, h)
      grd.addColorStop(0, '#1a1340')
      grd.addColorStop(0.75, '#43285e')
      grd.addColorStop(1, '#5c3470')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      for (let i = 0; i < 170; i++) {
        g.fillStyle = `rgba(255,248,235,${0.35 + rnd() * 0.6})`
        g.beginPath()
        g.arc(rnd() * w, rnd() * h * 0.78, 0.8 + rnd() * 1.8, 0, TAU)
        g.fill()
      }
      // a few four-pointed sparkles, as the picture has
      g.fillStyle = 'rgba(255,250,240,0.9)'
      for (const [sx, sy, s] of [[180, 120, 14], [640, 90, 10], [860, 260, 12], [380, 300, 8]]) {
        g.beginPath()
        g.moveTo(sx, sy - s)
        g.quadraticCurveTo(sx, sy, sx + s, sy)
        g.quadraticCurveTo(sx, sy, sx, sy + s)
        g.quadraticCurveTo(sx, sy, sx - s, sy)
        g.quadraticCurveTo(sx, sy, sx, sy - s)
        g.fill()
      }
      // a crescent moon
      g.fillStyle = '#fff1c4'
      g.beginPath()
      g.arc(820, 130, 54, 0, TAU)
      g.fill()
      g.globalCompositeOperation = 'destination-out'
      g.beginPath()
      g.arc(842, 112, 50, 0, TAU)
      g.fill()
      g.globalCompositeOperation = 'source-over'
      // roofs and lit windows across the street
      g.fillStyle = '#170f2a'
      g.beginPath()
      g.moveTo(0, h)
      let x = 0
      while (x < w) {
        const bw = 90 + rnd() * 120
        const bh = 70 + rnd() * 110
        g.lineTo(x, h - bh)
        g.lineTo(x + bw * 0.5, h - bh - 30 - rnd() * 30)
        g.lineTo(x + bw, h - bh)
        x += bw
      }
      g.lineTo(w, h)
      g.fill()
      for (let i = 0; i < 26; i++) {
        g.fillStyle = rnd() < 0.7 ? 'rgba(255,205,110,0.9)' : 'rgba(255,170,90,0.7)'
        g.fillRect(rnd() * w, h - 20 - rnd() * 80, 10, 13)
      }
    }),
  )
  {
    const ww = win.width
    const wh = 1.25
    const wy = 1.2
    const g = mount(new THREE.Group(), win.wall, win.at, 0.01)
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ map: sky }))
    glass.position.set(0, wy + wh / 2, 0)
    disposers.push(() => glass.material.dispose())
    g.add(glass)
    const bar = (w, h, x, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.07), M.frame)
      m.position.set(x, y, 0.035)
      g.add(m)
    }
    bar(ww + 0.16, 0.08, 0, wy + wh + 0.04)
    bar(ww + 0.16, 0.08, 0, wy - 0.04)
    bar(0.08, wh, -ww / 2 - 0.04, wy + wh / 2)
    bar(0.08, wh, ww / 2 + 0.04, wy + wh / 2)
    bar(0.05, wh, 0, wy + wh / 2)
    bar(ww, 0.05, 0, wy + wh * 0.62)
    const sill = new THREE.Mesh(new THREE.BoxGeometry(ww + 0.3, 0.04, 0.16), M.frame)
    sill.position.set(0, wy - 0.06, 0.08)
    g.add(sill)
  }

  // ---- the sink under the window ----
  {
    const g = mount(new THREE.Group(), win.wall, win.at, 0)
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.014, 0.5), M.steel)
    rim.position.set(0, TOP + 0.007, 0.34)
    const basin = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.016, 0.38), M.dark)
    basin.position.set(0, TOP + 0.009, 0.35)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, TOP, 0.08),
      new THREE.Vector3(0, TOP + 0.32, 0.08),
      new THREE.Vector3(0, TOP + 0.4, 0.2),
      new THREE.Vector3(0, TOP + 0.3, 0.32),
    ])
    const tap = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.018, 10), M.steel)
    g.add(rim, basin, tap)
  }

  // ---- the oven: a tall housing, the oven at chest height, hot; its door hinges at the bottom ----
  const ovenParts = (() => {
    const OW = 0.92
    const OD = DEPTH + 0.02
    const OH = 2.18
    const g = mount(new THREE.Group(), oven.wall, oven.at)
    const side = new THREE.BoxGeometry(0.04, OH, OD)
    for (const s of [-1, 1]) {
      const m = new THREE.Mesh(side, M.cab)
      m.position.set(s * (OW / 2 - 0.02), OH / 2, OD / 2)
      g.add(m)
    }
    const lower = new THREE.Mesh(new THREE.BoxGeometry(OW - 0.08, 0.86, OD - 0.02), M.cab)
    lower.position.set(0, 0.43, (OD - 0.02) / 2)
    const upper = new THREE.Mesh(new THREE.BoxGeometry(OW - 0.08, OH - 1.68, OD - 0.02), M.cab)
    upper.position.set(0, (1.68 + OH) / 2, (OD - 0.02) / 2)
    g.add(lower, upper)
    fronts(g, OW - 0.08, PLINTH, 0.86 - PLINTH - 0.02, OD - 0.02 + 0.012, 1)
    fronts(g, OW - 0.08, 1.7, OH - 1.72, OD - 0.02 + 0.012, 1)
    // the cavity: enamel inside, glowing with the heat
    const IW = OW - 0.16
    const IH = 0.6
    const ID = OD - 0.14
    const Y0 = 0.92
    const enamel = new THREE.MeshStandardMaterial({ color: '#4a2a22', roughness: 0.5, emissive: '#ff5a14', emissiveIntensity: 0.25, side: THREE.BackSide })
    const cavity = new THREE.Mesh(new THREE.BoxGeometry(IW, IH, ID), enamel)
    cavity.position.set(0, Y0 + IH / 2, 0.04 + ID / 2)
    g.add(cavity)
    // the heating element across the top, and a rack
    const glowMat = new THREE.MeshStandardMaterial({ color: '#ff6a2a', emissive: '#ff4a10', emissiveIntensity: 1.6, roughness: 0.5 })
    const pts = []
    for (let i = 0; i <= 8; i++) pts.push(new THREE.Vector3(-IW / 2 + 0.06 + ((IW - 0.12) * i) / 8, Y0 + IH - 0.05, 0.1 + (i % 2) * (ID - 0.16)))
    const element = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.008, 6), glowMat)
    g.add(element)
    for (let i = 0; i < 6; i++) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, IW - 0.02, 5), M.steel)
      rod.rotation.z = Math.PI / 2
      rod.position.set(0, Y0 + 0.05, 0.08 + (i * (ID - 0.1)) / 5)
      g.add(rod)
    }
    // the black front round the opening, the control strip with its display and knobs
    const bezel = (w, h, x, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.03), M.dark)
      m.position.set(x, y, OD - 0.015)
      g.add(m)
    }
    bezel(OW - 0.08, 0.04, 0, Y0 - 0.02)
    bezel(0.04, IH + 0.08, -IW / 2 - 0.02, Y0 + IH / 2)
    bezel(0.04, IH + 0.08, IW / 2 + 0.02, Y0 + IH / 2)
    bezel(OW - 0.08, 0.1, 0, Y0 + IH + 0.05 + 0.02)
    const display = makeText(ovenLabel, { size: 0.045, color: '#ffae5c', anchorX: 'center', anchorY: 'middle' })
    display.position.set(-0.16, Y0 + IH + 0.07, OD + 0.002)
    g.add(display)
    for (const x of [0.14, 0.28]) {
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.025, 16), M.steel)
      knob.rotation.x = Math.PI / 2
      knob.position.set(x, Y0 + IH + 0.07, OD + 0.012)
      g.add(knob)
    }
    // the door, hinged along its bottom edge, a window onto the glow
    const hinge = new THREE.Group()
    hinge.position.set(0, Y0 - 0.005, OD)
    g.add(hinge)
    // a black frame round a window of dark glass: the glow, and whatever bakes, shows through it
    const DH = IH + 0.03
    const DW = IW + 0.07
    const GW = IW * 0.74
    const GH = DH * 0.56
    const GY = DH * 0.44
    const rail = (w, h, x, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.035), M.dark)
      m.position.set(x, y, 0.018)
      hinge.add(m)
    }
    rail(DW, GY - GH / 2, 0, (GY - GH / 2) / 2)
    rail(DW, DH - GY - GH / 2, 0, (DH + GY + GH / 2) / 2)
    rail((DW - GW) / 2, GH, -(DW + GW) / 4, GY)
    rail((DW - GW) / 2, GH, (DW + GW) / 4, GY)
    const winMat = new THREE.MeshStandardMaterial({ color: '#3a1a0e', roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.45, depthWrite: false })
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(GW, GH), winMat)
    pane.position.set(0, GY, 0.02)
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, IW * 0.8, 10), M.steel)
    bar.rotation.z = Math.PI / 2
    bar.position.set(0, DH - 0.05, 0.08)
    hinge.add(pane, bar)
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.05, 6), M.steel)
      post.rotation.x = Math.PI / 2
      post.position.set(s * IW * 0.36, DH - 0.05, 0.058)
      hinge.add(post)
    }
    footprint(oven.wall, oven.at, OW, OD + 0.02)
    const local = (x, y, z) => g.localToWorld(new THREE.Vector3(x, y, z))
    g.updateMatrixWorld(true)
    let openK = 0
    let heat = 0
    const apply = () => {
      hinge.rotation.x = openK * 1.42
      enamel.emissiveIntensity = 0.35 + heat * 0.6 + openK * 0.25
    }
    apply()
    return {
      group: g,
      inside: local(0, Y0 + 0.055, 0.04 + ID / 2),
      front: local(0, Y0 + 0.3, OD + 0.55),
      open(k) {
        openK = k
        apply()
      },
      heat(k) {
        heat = k
        apply()
      },
      flicker(t) {
        glowMat.emissiveIntensity = 1.5 + Math.sin(t * 7) * 0.12 + Math.sin(t * 13.3) * 0.08
      },
      /** What the display says. */
      label(text) {
        if (display.text === text) return
        display.text = text
        display.sync()
      },
      // the door's window, for a scene that wants to see better what bakes
      glass: winMat,
      // where the door's window is, seen from the room (a scene's light inside, a probe's aim)
      pane: local(0, Y0 + GY, OD + 0.03),
    }
  })()

  // ---- the fridge, the freezer on top (its door hinges on the corner's side) ----
  const fridgeParts = (() => {
    const FW = 0.86
    const FD = 0.7
    const FH = 2.02
    const F0 = 1.3
    const g = mount(new THREE.Group(), fridge.wall, fridge.at)
    const lower = new THREE.Mesh(new RoundedBoxGeometry(FW, F0, FD, 2, 0.03), M.fridge)
    lower.position.set(0, F0 / 2, FD / 2)
    const fdoor = new THREE.Mesh(new RoundedBoxGeometry(FW - 0.02, F0 - 0.06, 0.05, 2, 0.02), M.fridge)
    fdoor.position.set(0, F0 / 2 + 0.01, FD + 0.025)
    const fhandle = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.42, 0.04, 2, 0.01), M.steel)
    fhandle.position.set(-FW / 2 + 0.07, F0 - 0.32, FD + 0.07)
    g.add(lower, fdoor, fhandle)
    const shell = (w, h, d, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.fridge)
      m.position.set(x, y, z)
      g.add(m)
    }
    const SH = FH - F0
    shell(0.05, SH, FD, -FW / 2 + 0.025, F0 + SH / 2, FD / 2)
    shell(0.05, SH, FD, FW / 2 - 0.025, F0 + SH / 2, FD / 2)
    shell(FW, 0.05, FD, 0, FH - 0.025, FD / 2)
    shell(FW, 0.05, FD, 0, F0 + 0.025, FD / 2)
    shell(FW, SH, 0.05, 0, F0 + SH / 2, 0.025)
    // inside: frosty, lit cold
    const frost = keep(
      canvasTex(256, 256, (gg, w, h) => {
        gg.fillStyle = '#86b4c8'
        gg.fillRect(0, 0, w, h)
        for (let i = 0; i < 420; i++) {
          gg.fillStyle = `rgba(235,248,255,${0.15 + rnd() * 0.45})`
          gg.beginPath()
          gg.arc(rnd() * w, rnd() * h, 0.6 + rnd() * 2.2, 0, TAU)
          gg.fill()
        }
      }),
    )
    const liner = new THREE.MeshStandardMaterial({ map: frost, roughness: 0.55, emissive: '#5b9fcf', emissiveIntensity: 0.18, side: THREE.BackSide })
    const IW = FW - 0.1
    const IH = SH - 0.1
    const ID = FD - 0.08
    const cave = new THREE.Mesh(new THREE.BoxGeometry(IW, IH, ID), liner)
    cave.position.set(0, F0 + 0.05 + IH / 2, 0.05 + ID / 2)
    g.add(cave)
    // the freezer door: hinged on the +x edge (the corner side), opening outwards
    const hinge = new THREE.Group()
    hinge.position.set(FW / 2, F0 + 0.02, FD)
    g.add(hinge)
    const DH = SH - 0.04
    const door = new THREE.Mesh(new RoundedBoxGeometry(FW - 0.02, DH, 0.05, 2, 0.02), M.fridge)
    door.position.set(-(FW - 0.02) / 2, DH / 2, 0.025)
    const handle = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.3, 0.04, 2, 0.01), M.steel)
    handle.position.set(-FW + 0.08, 0.22, 0.07)
    const screen = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.08, 0.012, 2, 0.006), M.dark)
    screen.position.set(-FW / 2, DH - 0.12, 0.056)
    const temp = makeText('−18 °C', { size: 0.045, color: '#8fd4ff', anchorX: 'center', anchorY: 'middle' })
    temp.position.set(-FW / 2, DH - 0.12, 0.064)
    hinge.add(door, handle, screen, temp)
    footprint(fridge.wall, fridge.at, FW, FD + 0.05)
    g.updateMatrixWorld(true)
    const local = (x, y, z) => g.localToWorld(new THREE.Vector3(x, y, z))
    return {
      group: g,
      inside: local(0, F0 + 0.055, 0.05 + ID / 2 + 0.02),
      front: local(-0.1, F0 + 0.25, FD + 0.6),
      open(k) {
        hinge.rotation.y = k * 1.95
        liner.emissiveIntensity = 0.18 + k * 0.3
      },
    }
  })()

  // ---- lamps: warm bulbs in pink shades, hanging from the beams (off in the morning) ----
  const shadeMat = new THREE.MeshStandardMaterial({ color: shade, roughness: 0.6, side: THREE.DoubleSide, emissive: '#5a1830', emissiveIntensity: morning ? 0 : 0.4 })
  const bulbMat = new THREE.MeshStandardMaterial({ color: '#fff0d0', emissive: '#ffd08a', emissiveIntensity: morning ? 0.05 : 1.7 })
  const shadeGeo = new THREE.CylinderGeometry(0.09, 0.3, 0.26, 28, 1, true)
  const lamp = (x, z, drop, withLight) => {
    const y = height - drop
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, drop, 5), M.dark)
    cord.position.set(x, height - drop / 2, z)
    const shade = new THREE.Mesh(shadeGeo, shadeMat)
    shade.position.set(x, y - 0.13, z)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), bulbMat)
    bulb.position.set(x, y - 0.16, z)
    group.add(cord, shade, bulb)
    if (withLight) {
      const l = new THREE.PointLight('#ffc88e', 7, 10, 2)
      l.position.set(x, y - 0.3, z)
      group.add(l)
    }
  }
  const lamps = [
    [-3.2, -3.4, 1.05],
    [3.2, -1.6, 1.05],
    [-2.7, 0.6, 1.0],
  ]
  lamps.forEach(([x, z, drop], i) => lamp(x, z, drop, !morning && (!light || i === 2)))

  if (morning) {
    // daylight: the sky's light all round, the sun coming in through the window, a warm fill in the room
    group.add(new THREE.HemisphereLight('#e6f0ff', '#8a6a52', light ? 1.55 : 1.25))
    const fill = new THREE.DirectionalLight('#fff0dc', 0.55)
    fill.position.set(2, 8, 4)
    fill.target.position.set(0, 0, -1)
    group.add(fill, fill.target)
    const beam = sunbeam({ place, win, group })
    disposers.push(beam.dispose)
  } else {
    // the warm room light and a cool touch from the window
    group.add(new THREE.HemisphereLight('#ffe2c6', '#3a2a40', light ? 1.35 : 0.9))
    const sun = new THREE.DirectionalLight('#ffe4c0', light ? 1.0 : 0.8)
    sun.position.set(2, 8, 4)
    sun.target.position.set(0, 0, -1)
    group.add(sun, sun.target)
    const moon = new THREE.DirectionalLight('#9aa8ff', 0.25)
    moon.position.set(win.at, 3, z0 + 6)
    moon.target.position.set(win.at, 0, z0 + 1)
    group.add(moon, moon.target)
  }

  return {
    group,
    solids,
    place,
    oven: ovenParts,
    fridge: fridgeParts,
    env: {
      background: new THREE.Color(morning ? '#9fc4e0' : '#1a1420'),
      exposure: 1.0,
      envIntensity: morning ? 0.5 : 0.4,
      bloom: morning ? { strength: 0.3, radius: 0.5, threshold: 0.94 } : { strength: 0.42, radius: 0.5, threshold: 0.92 },
      fov: 60,
    },
    cameraBounds: { minX: x0 + 0.3, maxX: x1 - 0.3, minY: 0.35, maxY: height - 0.3, minZ: z0 + 0.3, maxZ: z1 - 0.3 },
    update(t) {
      ovenParts.flicker(t)
    },
    dispose() {
      for (const t of tex) t.dispose()
      disposers.forEach(f => f())
    },
  }
}

// ---- another kitchen's pieces: square tiles, a tiled floor, a morning sky, the sun through the window ----

// the window's sill height and its height (as the window above draws it)
const WIN_Y = 1.2
const WIN_H = 1.25

/** Square tiles, four by four, each with a flower and quarter rings that join into circles at the corners. */
function squareTiles(g, w, h, tile, rnd) {
  const n = 4
  const s = w / n
  const base = new THREE.Color(tile)
  const light = base.clone().lerp(new THREE.Color('#e9f0f4'), 0.32)
  const dark = base.clone().multiplyScalar(0.72)
  const hex = c => `#${c.getHexString()}`
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const x = c * s
      const y = r * s
      g.save()
      g.beginPath()
      g.rect(x + 3, y + 3, s - 6, s - 6)
      g.clip()
      g.fillStyle = hex(base.clone().multiplyScalar(0.94 + rnd() * 0.12))
      g.fillRect(x, y, s, s)
      // a quarter ring in each corner: four tiles meet in a circle
      g.strokeStyle = hex(dark)
      g.lineWidth = 7
      for (const [cx, cy] of [[x, y], [x + s, y], [x, y + s], [x + s, y + s]]) {
        g.beginPath()
        g.arc(cx, cy, s * 0.3, 0, TAU)
        g.stroke()
      }
      // the flower: four petals and a dark heart
      const mx = x + s / 2
      const my = y + s / 2
      g.fillStyle = hex(light)
      for (let k = 0; k < 4; k++) {
        const a = (k * Math.PI) / 2 + Math.PI / 4
        g.beginPath()
        g.ellipse(mx + Math.cos(a) * s * 0.14, my + Math.sin(a) * s * 0.14, s * 0.13, s * 0.065, a, 0, TAU)
        g.fill()
      }
      g.fillStyle = hex(dark)
      g.beginPath()
      g.arc(mx, my, s * 0.06, 0, TAU)
      g.fill()
      // a soft sheen across the glaze
      g.fillStyle = 'rgba(255,255,255,0.07)'
      g.fillRect(x + 6, y + 6, s - 12, 6)
      g.restore()
    }
  }
}

/** A chequerboard of floor tiles in two colours, each a little different, with dark joints. */
function checkerTiles(g, w, h, [a, b], rnd) {
  const n = 4
  const s = w / n
  g.fillStyle = '#3a2a22'
  g.fillRect(0, 0, w, h)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const col = new THREE.Color((r + c) % 2 ? b : a).multiplyScalar(0.92 + rnd() * 0.14)
      g.fillStyle = `#${col.getHexString()}`
      g.fillRect(c * s + 2, r * s + 2, s - 4, s - 4)
      // worn spots and speckles
      for (let i = 0; i < 18; i++) {
        g.fillStyle = `rgba(${rnd() < 0.5 ? '255,240,220' : '40,20,10'},${0.04 + rnd() * 0.06})`
        g.beginPath()
        g.arc(c * s + rnd() * s, r * s + rnd() * s, 2 + rnd() * 9, 0, TAU)
        g.fill()
      }
    }
  }
}

/** A sunny morning seen through the window: a soft blue sky, a low sun, clouds, red roofs and trees. */
function morningSky(g, w, h, rnd) {
  const grd = g.createLinearGradient(0, 0, 0, h)
  grd.addColorStop(0, '#5d98cf')
  grd.addColorStop(0.5, '#93c0e3')
  grd.addColorStop(0.8, '#e9d6b4')
  grd.addColorStop(1, '#efc792')
  g.fillStyle = grd
  g.fillRect(0, 0, w, h)
  // the sun, low on the left, and its glow
  const sun = g.createRadialGradient(170, 250, 0, 170, 250, 260)
  sun.addColorStop(0, 'rgba(255,248,225,0.95)')
  sun.addColorStop(0.12, 'rgba(255,236,190,0.75)')
  sun.addColorStop(1, 'rgba(255,220,160,0)')
  g.fillStyle = sun
  g.fillRect(0, 0, w, h)
  // soft clouds
  for (const [cx, cy, k] of [[420, 110, 1], [800, 170, 0.8], [640, 70, 0.6], [930, 60, 0.5]]) {
    for (let i = 0; i < 7; i++) {
      g.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.25})`
      g.beginPath()
      g.ellipse(cx + (rnd() - 0.5) * 150 * k, cy + (rnd() - 0.5) * 30 * k, (40 + rnd() * 45) * k, (16 + rnd() * 14) * k, 0, 0, TAU)
      g.fill()
    }
  }
  // two birds
  g.strokeStyle = 'rgba(40,50,70,0.7)'
  g.lineWidth = 3
  for (const [bx, by] of [[560, 200], [600, 225]]) {
    g.beginPath()
    g.moveTo(bx - 12, by - 5)
    g.quadraticCurveTo(bx - 5, by - 9, bx, by)
    g.quadraticCurveTo(bx + 5, by - 9, bx + 12, by - 5)
    g.stroke()
  }
  // trees behind the houses
  for (let i = 0; i < 14; i++) {
    const tx = rnd() * w
    const tr = 40 + rnd() * 40
    g.fillStyle = rnd() < 0.5 ? '#4f7f45' : '#5f9150'
    g.beginPath()
    g.arc(tx, h - 150 - rnd() * 40, tr, 0, TAU)
    g.fill()
  }
  // houses across the street: light walls, red roofs, windows and shutters
  let x = -20
  while (x < w) {
    const bw = 110 + rnd() * 110
    const bh = 90 + rnd() * 80
    const top = h - bh
    g.fillStyle = rnd() < 0.5 ? '#e2cfae' : '#d9b994'
    g.fillRect(x, top, bw, bh)
    g.fillStyle = rnd() < 0.5 ? '#b5523a' : '#a8482f'
    g.beginPath()
    g.moveTo(x - 8, top)
    g.lineTo(x + bw / 2, top - 40 - rnd() * 20)
    g.lineTo(x + bw + 8, top)
    g.fill()
    for (let k = 0; k < Math.floor(bw / 55); k++) {
      const wx = x + 18 + k * 55
      const wy = top + 22 + rnd() * 10
      g.fillStyle = '#4a6a86'
      g.fillRect(wx, wy, 22, 30)
      g.fillStyle = rnd() < 0.5 ? '#3f7a5a' : '#2f6a8a'
      g.fillRect(wx - 8, wy, 7, 30)
      g.fillRect(wx + 23, wy, 7, 30)
    }
    x += bw + 6
  }
}

/** The morning sun coming in through the window: the light itself, a faint shaft of it in the air and the
 *  window's bright shape on the floor, its bars crossing it. */
function sunbeam({ place, win, group }) {
  const p = place(win.wall, win.at, 0)
  const nIn = new THREE.Vector3(Math.sin(p.rot), 0, Math.cos(p.rot))
  const along = new THREE.Vector3(Math.cos(p.rot), 0, -Math.sin(p.rot))
  const d = nIn.clone().addScaledVector(along, 0.3).add(new THREE.Vector3(0, -0.92, 0)).normalize()
  const mid = new THREE.Vector3(p.x, WIN_Y + WIN_H / 2, p.z)
  const sun = new THREE.DirectionalLight('#ffe6c2', 1.45)
  sun.position.copy(mid).addScaledVector(d, -8)
  sun.target.position.copy(mid).addScaledVector(d, 3)
  group.add(sun, sun.target)
  const ww = win.width
  const corner = (u, v) => new THREE.Vector3(p.x, WIN_Y + v * WIN_H, p.z).addScaledVector(along, (u - 0.5) * ww).addScaledVector(nIn, 0.02)
  const onFloor = c => c.clone().addScaledVector(d, (c.y - 0.006) / -d.y)
  const top = [corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)]
  const bottom = top.map(onFloor)
  // the shaft: four sides of light from the window to the floor, fading as it goes
  const pos = []
  const col = []
  const warm = new THREE.Color('#ffd9a0')
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    for (const [v, k] of [[top[i], 1], [top[j], 1], [bottom[j], 0.15], [top[i], 1], [bottom[j], 0.15], [bottom[i], 0.15]]) {
      pos.push(v.x, v.y, v.z)
      col.push(warm.r * k, warm.g * k, warm.b * k)
    }
  }
  const shaftGeo = new THREE.BufferGeometry()
  shaftGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  shaftGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  const shaftMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const shaft = new THREE.Mesh(shaftGeo, shaftMat)
  shaft.renderOrder = 5
  // the window's shape on the floor: four panes of light, soft at the edges
  const patchTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#000000'
    g.fillRect(0, 0, w, h)
    g.filter = 'blur(5px)'
    g.fillStyle = '#ffffff'
    const bar = 8
    const vy = h * (1 - 0.62)
    for (const [ax, ay, bx, by] of [[10, 10, w / 2 - bar, vy - bar], [w / 2 + bar, 10, w - 10, vy - bar], [10, vy + bar, w / 2 - bar, h - 10], [w / 2 + bar, vy + bar, w - 10, h - 10]]) {
      g.fillRect(ax, ay, bx - ax, by - ay)
    }
    g.filter = 'none'
  })
  const patchGeo = new THREE.BufferGeometry()
  const pp = []
  const uv = []
  // the bottom of the window lands nearest the wall; uv v = 1 is the canvas's top (the window's top)
  for (const [i, u, v] of [[0, 0, 0], [1, 1, 0], [2, 1, 1], [0, 0, 0], [2, 1, 1], [3, 0, 1]]) {
    pp.push(bottom[i].x, bottom[i].y, bottom[i].z)
    uv.push(u, v)
  }
  patchGeo.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3))
  patchGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  const patchMat = new THREE.MeshBasicMaterial({ map: patchTex, color: '#ffcf8a', transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  const patch = new THREE.Mesh(patchGeo, patchMat)
  patch.renderOrder = 4
  group.add(shaft, patch)
  return {
    dispose() {
      shaftGeo.dispose()
      shaftMat.dispose()
      patchGeo.dispose()
      patchMat.dispose()
      patchTex.dispose()
    },
  }
}
