// A stage for picture rooms (docs/knowledge/picture-rooms.md): a satellite clean room, a high bay where
// spacecraft are built and tested (Germanium's `space` room; first built for it). Soft mid-grey and pale
// blue everywhere, never white (a pale surface under the bloom washes the whole view out): an epoxy floor
// in tiles, panelled walls with a blue band, a ceiling of filter units and long light panels, an overhead
// crane's rail, yellow-and-black marking on the floor. On the west side a gowning lobby (a bench, bunny
// suits on hooks, a sticky mat, a shoe-cover dispenser); in the east wall a long window onto the control
// room (a desk, three screens drawing telemetry, a chair); on the back wall a big roll-up door and a
// sign. Walking inside x0..x1, z0..z1 (default 20 by 17 m, 7 m high). The scene adds what is being tested.
// Gives: `group`, `mats` (shared plain materials: floor, wall, steel, dark, foil, plastic, yellow, suit,
// rubber), `solids`, `env`, `cameraBounds`, `update(t)`, `dispose()`, `signs` (call `signs.set(words)` with
// { gown, control, class, flight } to letter the 3D signs), `h`, `x0..z1`.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { makeText } from '../../../engine/text.js'
import { motes } from '../kit.js'
import { box, roomWalls } from '../../../engine/collide.js'

/** Epoxy floor, 1.5 m tiles of a blue-grey, each a shade of its own, fine speckle. */
function floorTex(light) {
  const px = light ? 256 : 512
  const rnd = random(31)
  return canvasTex(px, px, (g, w) => {
    g.fillStyle = '#56626e'
    g.fillRect(0, 0, w, w)
    const n = 2
    const s = w / n
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const k = 0.94 + rnd() * 0.12
        g.fillStyle = `rgb(${Math.round(112 * k)},${Math.round(128 * k)},${Math.round(144 * k)})`
        g.fillRect(i * s + 2, j * s + 2, s - 4, s - 4)
        for (let d = 0; d < 260; d++) {
          g.fillStyle = rnd() < 0.5 ? 'rgba(60,72,84,0.16)' : 'rgba(190,206,220,0.14)'
          g.fillRect(i * s + rnd() * s, j * s + rnd() * s, 1 + rnd() * 2, 1 + rnd() * 2)
        }
      }
    }
  }, { repeat: true })
}

/** Wall panels: a pale blue-grey with vertical seams every metre and a faint streak. */
function wallTex() {
  const rnd = random(5)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#8496a8'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 300; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(60,76,92,0.05)' : 'rgba(200,214,228,0.05)'
      g.fillRect(rnd() * w, 0, 1 + rnd() * 3, w)
    }
    g.fillStyle = 'rgba(40,56,72,0.55)'
    g.fillRect(0, 0, 2, w)
    g.fillStyle = 'rgba(210,224,238,0.3)'
    g.fillRect(2, 0, 1, w)
  }, { repeat: true })
}

/** A sticky mat: a stack of sheets, blue, with a grid of tear lines. */
function matTex() {
  return canvasTex(128, 128, (g, w) => {
    g.fillStyle = '#35597e'
    g.fillRect(0, 0, w, w)
    g.strokeStyle = 'rgba(180,210,240,0.35)'
    g.lineWidth = 2
    for (let i = 0; i <= 4; i++) {
      g.beginPath()
      g.moveTo(0, (i * w) / 4)
      g.lineTo(w, (i * w) / 4)
      g.moveTo((i * w) / 4, 0)
      g.lineTo((i * w) / 4, w)
      g.stroke()
    }
  })
}

/** Gold foil: crinkled, so a satellite's body reads as foil and not as a plain yellow box. */
export function foilTexture() {
  const rnd = random(77)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#c9a448'
    g.fillRect(0, 0, w, w)
    // soft facets: big pale and dark patches, then fine creases
    for (let i = 0; i < 70; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(255,226,140,0.16)' : 'rgba(120,84,24,0.14)'
      g.beginPath()
      const x = rnd() * w
      const y = rnd() * w
      g.moveTo(x, y)
      g.lineTo(x + (rnd() - 0.5) * 90, y + (rnd() - 0.5) * 90)
      g.lineTo(x + (rnd() - 0.5) * 90, y + (rnd() - 0.5) * 90)
      g.closePath()
      g.fill()
    }
    for (let i = 0; i < 160; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const l = 8 + rnd() * 26
      const a = rnd() * Math.PI
      g.strokeStyle = rnd() < 0.5 ? 'rgba(255,236,170,0.22)' : 'rgba(100,70,20,0.16)'
      g.lineWidth = 1
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l)
      g.stroke()
    }
  }, { repeat: true })
}

/** A screen of the control room: green and cyan traces on near-black. */
function traceTex(seed, hue) {
  const rnd = random(seed)
  return canvasTex(128, 80, (g, w, h) => {
    g.fillStyle = '#071017'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(80,140,170,0.25)'
    g.lineWidth = 1
    for (let i = 1; i < 5; i++) {
      g.beginPath()
      g.moveTo(0, (i * h) / 5)
      g.lineTo(w, (i * h) / 5)
      g.stroke()
    }
    g.strokeStyle = hue
    g.lineWidth = 2
    g.beginPath()
    let y = h / 2
    for (let x = 0; x <= w; x += 4) {
      y = Math.max(8, Math.min(h - 8, y + (rnd() - 0.5) * 14))
      x ? g.lineTo(x, y) : g.moveTo(x, y)
    }
    g.stroke()
  })
}

/** A bunny suit: a hooded coverall of pale blue-grey on a hook, arms hanging. */
function suit(mat, k = 1) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.7, 6, 14), mat)
  body.scale.set(1, 1, 0.62)
  body.position.y = 1.0
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), mat)
  hood.position.y = 1.62
  hood.scale.set(1, 1.05, 0.9)
  g.add(body, hood)
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.56, 4, 10), mat)
    arm.position.set(s * 0.27, 1.12, 0)
    arm.rotation.z = s * 0.12
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.5, 4, 10), mat)
    leg.position.set(s * 0.1, 0.42, 0)
    g.add(arm, leg)
  }
  g.scale.setScalar(k)
  return g
}

export function cleanroomStage({ x0 = -10, x1 = 10, z0 = -9, z1 = 8, h = 7, light = false } = {}) {
  const group = new THREE.Group()
  const textures = []
  const keep = t => (textures.push(t), t)
  const fw = x1 - x0
  const fd = z1 - z0
  const uvMetres = (geo, su, sv) => {
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
    return geo
  }

  const floorMap = keep(floorTex(light))
  floorMap.repeat.set(1 / 3, 1 / 3)
  const wallMap = keep(wallTex())
  wallMap.repeat.set(1, 1)
  const foilMap = keep(foilTexture())
  const mats = {
    floor: new THREE.MeshStandardMaterial({ map: floorMap, roughness: 0.5, metalness: 0.05 }),
    wall: new THREE.MeshStandardMaterial({ map: wallMap, roughness: 0.85 }),
    band: new THREE.MeshStandardMaterial({ color: '#3f6f9a', roughness: 0.7 }),
    steel: new THREE.MeshStandardMaterial({ color: '#7d8996', roughness: 0.42, metalness: 0.55 }),
    dark: new THREE.MeshStandardMaterial({ color: '#232a31', roughness: 0.75 }),
    foil: new THREE.MeshStandardMaterial({ map: foilMap, roughness: 0.5, metalness: 0.35, color: '#e8d9ae' }),
    plastic: new THREE.MeshStandardMaterial({ color: '#8e9fb0', roughness: 0.6 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#c9a02c', roughness: 0.6 }),
    suit: new THREE.MeshStandardMaterial({ color: '#8fa3b8', roughness: 0.95 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#2b3036', roughness: 0.95 }),
  }

  // floor, ceiling
  const floor = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(fw, fd), fw, fd), mats.floor)
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ color: '#59646f', roughness: 0.9 }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)

  // ceiling: rows of filter units (a grid of dark-framed pale squares) and long light panels between them
  const filterMat = new THREE.MeshStandardMaterial({ color: '#6e7c8a', roughness: 0.9 })
  const frameMat = mats.dark
  const panelMat = new THREE.MeshBasicMaterial({ color: '#a9bfd3' })
  const panelGeo = new THREE.BoxGeometry(0.22, 0.06, 2.6)
  const filterGeo = new THREE.BoxGeometry(1.14, 0.07, 1.14)
  const frameGeo = new THREE.BoxGeometry(1.24, 0.05, 1.24)
  for (let x = x0 + 1.4; x < x1 - 0.6; x += 2.6) {
    for (let z = z0 + 1.2; z < z1 - 0.6; z += 2.4) {
      const f = new THREE.Mesh(frameGeo, frameMat)
      f.position.set(x, h - 0.03, z)
      const p = new THREE.Mesh(filterGeo, filterMat)
      p.position.set(x, h - 0.07, z)
      group.add(f, p)
    }
    const lp = new THREE.Mesh(panelGeo, panelMat)
    lp.position.set(x + 1.3, h - 0.04, (z0 + z1) / 2)
    const lp2 = lp.clone()
    lp2.position.z -= 2.8
    const lp3 = lp.clone()
    lp3.position.z += 2.8
    group.add(lp, lp2, lp3)
  }
  // the overhead crane's rail along the room, and its hook block
  const rail = new THREE.Mesh(new THREE.BoxGeometry(fw - 0.6, 0.3, 0.2), mats.yellow)
  rail.position.set((x0 + x1) / 2, h - 0.5, z0 + 3)
  group.add(rail)
  const trolley = new THREE.Group()
  const tbox = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.36, 0.5, 2, 0.04), mats.yellow)
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.4, 6), mats.dark)
  cable.position.y = -0.9
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI * 1.5), mats.steel)
  hook.position.y = -1.7
  trolley.add(tbox, cable, hook)
  trolley.position.set(x0 + 4.2, h - 0.85, z0 + 3)
  group.add(trolley)

  // walls: panels with a blue band and a dark cove at the foot; one piece per wall, `at` along its length
  const wall = (len, x, z, rotY) => {
    const g = new THREE.Group()
    const up = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(len, h), len, 1), mats.wall)
    up.position.set(0, h / 2, 0)
    const band = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.22), mats.band)
    band.position.set(0, 1.35, 0.012)
    const cove = new THREE.Mesh(new THREE.BoxGeometry(len, 0.2, 0.06), mats.dark)
    cove.position.set(0, 0.1, 0.03)
    const top = new THREE.Mesh(new THREE.BoxGeometry(len, 0.14, 0.1), mats.steel)
    top.position.set(0, h - 0.07, 0.05)
    g.add(up, band, cove, top)
    g.position.set(x, 0, z)
    g.rotation.y = rotY
    group.add(g)
    return g
  }
  const back = wall(fw, (x0 + x1) / 2, z0, 0)
  wall(fw, (x0 + x1) / 2, z1, Math.PI)
  const west = wall(fd, x0, (z0 + z1) / 2, Math.PI / 2)
  // the east wall is cut by the control room's window: two solid pieces and a long glazed strip. The wall's
  // own frame (rotated -90 degrees): local x runs along world z, local +z faces into the bay.
  const WIN = { z: -2.2, len: 8.4, y0: 1.05, y1: 3.5 }
  {
    const e = new THREE.Group()
    e.position.set(x1, 0, 0)
    e.rotation.y = -Math.PI / 2
    group.add(e)
    const piece = (a, b, y0, y1) => {
      const m = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(b - a, y1 - y0), b - a, y1 - y0), mats.wall)
      m.position.set((a + b) / 2, (y0 + y1) / 2, 0)
      e.add(m)
    }
    const zl = WIN.z - WIN.len / 2
    const zr = WIN.z + WIN.len / 2
    piece(z0, zl, 0, h)
    piece(zr, z1, 0, h)
    piece(zl, zr, 0, WIN.y0)
    piece(zl, zr, WIN.y1, h)
    const band = new THREE.Mesh(new THREE.PlaneGeometry(fd, 0.22), mats.band)
    band.position.set((z0 + z1) / 2, 1.35, 0.012)
    e.add(band)
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN.len, WIN.y1 - WIN.y0), new THREE.MeshStandardMaterial({ color: '#9ec2de', transparent: true, opacity: 0.1, roughness: 0.05, depthWrite: false }))
    glass.position.set(WIN.z, (WIN.y0 + WIN.y1) / 2, 0.02)
    e.add(glass)
    const fr = (w, hh, x, y) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.14), mats.steel)
      m.position.set(x, y, 0.02)
      e.add(m)
    }
    fr(WIN.len + 0.2, 0.1, WIN.z, WIN.y0)
    fr(WIN.len + 0.2, 0.1, WIN.z, WIN.y1)
    for (let i = 0; i <= 4; i++) fr(0.08, WIN.y1 - WIN.y0, zl + (i * WIN.len) / 4, (WIN.y0 + WIN.y1) / 2)
    // the control room, outside the wall (local z negative): floor, back wall, ceiling, a desk, screens, a chair
    const cd = 3.4
    const cw = WIN.len + 1
    const room = new THREE.Group()
    room.position.set(WIN.z, 0, -0.1)
    e.add(room)
    const cfloor = new THREE.Mesh(new THREE.PlaneGeometry(cw, cd), new THREE.MeshStandardMaterial({ color: '#3b4450', roughness: 0.8 }))
    cfloor.rotation.x = -Math.PI / 2
    cfloor.position.set(0, 0.02, -cd / 2)
    const cback = new THREE.Mesh(new THREE.PlaneGeometry(cw, 3.6), new THREE.MeshStandardMaterial({ color: '#46586a', roughness: 0.9 }))
    cback.position.set(0, 1.8, -cd)
    const cceil = new THREE.Mesh(new THREE.PlaneGeometry(cw, cd), new THREE.MeshStandardMaterial({ color: '#2a323c', roughness: 0.9 }))
    cceil.rotation.x = Math.PI / 2
    cceil.position.set(0, 3.6, -cd / 2)
    room.add(cfloor, cback, cceil)
    for (const s of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.PlaneGeometry(cd, 3.6), new THREE.MeshStandardMaterial({ color: '#2d3640', roughness: 0.9 }))
      side.rotation.y = -s * Math.PI / 2
      side.position.set(s * cw / 2, 1.8, -cd / 2)
      room.add(side)
    }
    // the desk against the back wall, its screens facing the window
    const desk = new THREE.Mesh(new RoundedBoxGeometry(WIN.len - 1.2, 0.06, 0.9, 2, 0.02), new THREE.MeshStandardMaterial({ color: '#4a5560', roughness: 0.6 }))
    desk.position.set(0, 0.78, -2.7)
    room.add(desk)
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.76, 0.8), mats.dark)
      leg.position.set(s * (WIN.len / 2 - 0.7), 0.38, -2.7)
      room.add(leg)
    }
    for (let i = 0; i < 4; i++) {
      const t = keep(traceTex(20 + i, ['#58f0b0', '#58c8ff', '#ffd24d', '#58f0b0'][i]))
      const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.5), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, color: '#b8c8d0' }))
      sc.position.set((i - 1.5) * 1.15, 1.55, -2.5)
      sc.rotation.x = -0.12
      room.add(sc)
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.05), mats.dark)
      stand.position.set(sc.position.x, 1.14, -2.55)
      room.add(stand)
    }
    const chair = new THREE.Group()
    const seat = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.08, 0.5, 2, 0.03), mats.rubber)
    seat.position.y = 0.5
    const backr = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.07, 2, 0.03), mats.rubber)
    backr.position.set(0, 0.8, 0.24)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.46, 8), mats.dark)
    pole.position.y = 0.25
    chair.add(seat, backr, pole)
    chair.position.set(-0.9, 0, -1.9)
    chair.rotation.y = 0.3
    room.add(chair)
    if (!light) {
      const lamp = new THREE.PointLight('#9cc4e8', 6, 7, 2)
      lamp.position.set(0, 2.4, -1.5)
      room.add(lamp)
    }
  }

  // west lobby: a gowning area (a bench, bunny suits on a rail of hooks, a sticky mat, a shoe-cover box)
  const lobby = new THREE.Group()
  lobby.position.set(x0 + 0.05, 0, z1 - 3.6)
  lobby.rotation.y = Math.PI / 2
  group.add(lobby)
  {
    const bench = new THREE.Mesh(new RoundedBoxGeometry(2.4, 0.07, 0.45, 2, 0.02), mats.plastic)
    bench.position.set(0, 0.46, 0.55)
    lobby.add(bench)
    for (const x of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.43, 0.38), mats.steel)
      leg.position.set(x, 0.22, 0.55)
      lobby.add(leg)
    }
    const railBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3, 8), mats.steel)
    railBar.rotation.z = Math.PI / 2
    railBar.position.set(0, 1.95, 0.12)
    lobby.add(railBar)
    for (let i = 0; i < 5; i++) {
      const s = suit(mats.suit, 0.95 + (i % 2) * 0.05)
      s.position.set(-1.2 + i * 0.6, 0.0, 0.12)
      s.rotation.y = (i - 2) * 0.05
      // hung from the rail: lifted so its hood meets the hook
      s.position.y = 0.32
      lobby.add(s)
    }
    const shoebox = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.36, 0.3, 2, 0.03), mats.band)
    shoebox.position.set(1.3, 1.05, 0.1)
    lobby.add(shoebox)
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshStandardMaterial({ map: keep(matTex()), roughness: 0.9 }))
    mat.rotation.x = -Math.PI / 2
    mat.position.set(0, 0.012, 1.6)
    lobby.add(mat)
  }

  // floor marking: a keep-out line round the middle of the bay, yellow with black dashes
  {
    const stripe = (len, x, z, rot) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.14), mats.yellow)
      m.rotation.x = -Math.PI / 2
      m.rotation.z = rot
      m.position.set(x, 0.014, z)
      group.add(m)
    }
    stripe(fw - 3.2, (x0 + x1) / 2, z0 + 1.0, 0)
    stripe(fw - 3.2, (x0 + x1) / 2, z1 - 1.8, 0)
  }

  // signs (lettered by the scene's words: `signs.set(...)`)
  const signs = {}
  const sign = (key, x, y, z, rotY, w, size, bg, fg) => {
    const g = new THREE.Group()
    const plate = new THREE.Mesh(new RoundedBoxGeometry(w, 0.5, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ color: bg, roughness: 0.7 }))
    g.add(plate)
    const t = makeText('', { size, color: fg, maxWidth: w - 0.2, anchorY: 'middle' })
    t.position.z = 0.032
    g.add(t)
    g.position.set(x, y, z)
    g.rotation.y = rotY
    group.add(g)
    signs[key] = t
  }
  sign('gown', x0 + 0.08, 2.5, z1 - 3.6, Math.PI / 2, 2.6, 0.2, '#2f5d86', '#d8e6f2')
  sign('control', x1 - 0.1, 3.9, WIN.z, -Math.PI / 2, 3.2, 0.2, '#2a323c', '#8fd0ff')
  sign('class', (x0 + x1) / 2 + 3, 4.6, z0 + 0.08, 0, 4.2, 0.19, '#2f5d86', '#d8e6f2')

  // a roll-up door in the back wall, for the satellites' crates
  {
    const door = new THREE.Group()
    const slats = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.4), new THREE.MeshStandardMaterial({ color: '#6c7886', roughness: 0.55, metalness: 0.4 }))
    slats.position.set(0, 2.2, 0.02)
    door.add(slats)
    for (let i = 1; i < 22; i++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.025, 0.03), mats.dark)
      l.position.set(0, i * 0.2, 0.04)
      door.add(l)
    }
    const fr = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.15, 0.12), mats.yellow)
    fr.position.set(0, 4.45, 0.05)
    door.add(fr)
    door.position.set(x0 + 4.4, 0, 0.0)
    back.add(door)
  }

  group.add(new THREE.HemisphereLight('#b9cde2', '#566270', light ? 1.5 : 1.25))
  const lamps = []
  for (const [lx, lz, k] of [[-5.5, -4, 1], [0.5, -4, 1], [6, -4, 1], [0, 3, 0.8]]) {
    if (light && lz > 0) continue
    const p = new THREE.PointLight('#d4e4f4', 26 * k, 17, 2)
    p.position.set(lx, h - 1.3, lz)
    group.add(p)
    lamps.push(p)
  }

  // dust turning in the filtered air (very little)
  const dust = motes({ count: 160, radius: Math.min(fw, fd) / 2, y0: 0.4, y1: h - 0.8, color: '#cfe0f0', size: 0.018, opacity: 0.2, speed: 0.03, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  const solids = roomWalls(x0, x1, z0, z1)
  solids.push(box(x0 + 0.7, z1 - 3.6, 0.6, 2.6, { y1: 1.0 })) // the lobby bench

  return {
    group,
    mats,
    signs: {
      set(w) {
        for (const [k, t] of Object.entries(signs)) {
          if (w[k] == null) continue
          t.text = w[k]
          t.sync()
        }
      },
    },
    solids,
    x0,
    x1,
    z0,
    z1,
    h,
    env: {
      background: new THREE.Color('#10151c'),
      fog: new THREE.Fog('#222b36', 22, 58),
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.35, radius: 0.5, threshold: 0.9 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.5, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
    },
    dispose() {
      textures.forEach(t => t.dispose())
    },
  }
}
