// A stage for picture rooms (docs/knowledge/picture-rooms.md): a recording studio in Nashville in 1961, the
// live room warm and a little worn: asphalt-tile floor in two browns, wood panelling to the chest and
// above it acoustic panels of olive hessian between wood battens, an acoustic-tile ceiling with a few
// angled wooden baffles hung under it, warm ceiling lamps. In the far left corner stands the control room,
// raised on nothing (same floor), behind a wall with a big window (glass at the window's plane) and a
// doorway, so its desk is seen from the live room. In the live room: a drum kit, microphones on booms,
// freestanding baffles (gobos) and a rug where the band plays.
// Every big surface mid-toned (a pale one blooms to white). Walking inside x0..x1, z0..z1. The scene adds
// what it is about (the desk, the guitar, the pedals); `mats` are shared plain materials for it,
// `drumKit()`, `micStand()`, `gobo()` make the dressing, `control` says where the control room is.
// Nothing carries a brand name or a logo.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { roomWalls, box, circle } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** Asphalt tiles, 0.3 m a tile, brown and tan in a check, each a shade of its own. */
function floorTex(light) {
  const px = light ? 192 : 384
  const rnd = random(31)
  return canvasTex(px, px, (g, w) => {
    const n = 4
    const s = w / n
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const dark = (i + j) % 2 === 0
        const k = 0.92 + rnd() * 0.16
        const [r, gr, b] = dark ? [94, 70, 52] : [120, 100, 76]
        g.fillStyle = `rgb(${Math.round(r * k)},${Math.round(gr * k)},${Math.round(b * k)})`
        g.fillRect(i * s, j * s, s, s)
        for (let d = 0; d < 40; d++) {
          g.fillStyle = rnd() < 0.5 ? 'rgba(40,28,20,0.18)' : 'rgba(210,190,150,0.16)'
          g.fillRect(i * s + rnd() * s, j * s + rnd() * s, 1 + rnd() * 3, 1 + rnd() * 2)
        }
        g.strokeStyle = 'rgba(30,20,14,0.5)'
        g.lineWidth = 1.5
        g.strokeRect(i * s + 0.5, j * s + 0.5, s - 1, s - 1)
      }
    }
  }, { repeat: true })
}

/** Wood panelling: vertical boards in two or three warm shades, a dark groove between. */
function panelTex() {
  const rnd = random(7)
  return canvasTex(256, 256, (g, w) => {
    const n = 8
    const s = w / n
    for (let i = 0; i < n; i++) {
      const k = 0.88 + rnd() * 0.24
      g.fillStyle = `rgb(${Math.round(128 * k)},${Math.round(86 * k)},${Math.round(52 * k)})`
      g.fillRect(i * s, 0, s, w)
      for (let y = 0; y < w; y += 3) {
        g.fillStyle = `rgba(60,34,16,${0.05 + rnd() * 0.08})`
        g.fillRect(i * s + rnd() * s, y, 1 + rnd() * 4, 2)
      }
      g.fillStyle = 'rgba(30,16,8,0.7)'
      g.fillRect(i * s, 0, 2, w)
    }
  }, { repeat: true })
}

/** Acoustic panels: olive hessian squares 1 m across, framed by wood battens. */
function hessianTex() {
  const rnd = random(19)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#6f6a40'
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 5200; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(40,36,18,0.16)' : 'rgba(190,176,120,0.14)'
      g.fillRect(rnd() * w, rnd() * w, rnd() < 0.5 ? 3 : 1, rnd() < 0.5 ? 1 : 3)
    }
    g.strokeStyle = '#54381f'
    g.lineWidth = 12
    g.strokeRect(0, 0, w, w)
  }, { repeat: true })
}

/** Ceiling tile: pale grey-beige with rows of pin holes, a groove round each 0.6 m tile. */
function tileTex() {
  const rnd = random(3)
  return canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#7d7664'
    g.fillRect(0, 0, w, w)
    g.fillStyle = 'rgba(40,36,28,0.55)'
    for (let y = 18; y < w; y += 14) for (let x = 14 + ((y / 14) % 2) * 7; x < w; x += 14) g.fillRect(x + rnd() * 2, y + rnd() * 2, 2, 2)
    g.strokeStyle = 'rgba(25,22,16,0.8)'
    g.lineWidth = 4
    g.strokeRect(0, 0, w, w)
  }, { repeat: true })
}

/** A soft round glow. */
function softTex() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.45)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

export function nashvilleStage({
  x0 = -10,
  x1 = 10,
  z0 = -10,
  z1 = 8,
  h = 4.4,
  light = false,
  // the control room: the corner x0..cx, z0..cz, its window in the east wall and its door in the south wall
  control = { x: -3, z: -3.2, win: [-9.6, -5.2], sill: 0.75, top: 3.0, door: { at: -6.4, width: 2.2 } },
  drums = { x: 0.2, z: -2.9, rot: 0.3 },
  gobos = [{ x: -1.6, z: -9.0, rot: 0.15 }, { x: 8.9, z: -4.6, rot: -Math.PI / 2 - 0.2 }, { x: 0.4, z: -5.0, rot: 1.35 }],
  mics = [{ x: 0.6, z: -5.7, rot: 0.5, len: 1.3 }, { x: 4.9, z: -5.6, rot: -0.4, len: 1.1 }],
  rug = { x: 4.3, z: -6.9, w: 8.4, d: 4.4 },
} = {}) {
  const group = new THREE.Group()
  const textures = []
  const keep = t => (textures.push(t), t)
  const fw = x1 - x0
  const fd = z1 - z0
  const solids = roomWalls(x0, x1, z0, z1)
  const uvMetres = (geo, su, sv) => {
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
    return geo
  }

  // ---- materials ----
  const floorMap = keep(floorTex(light))
  floorMap.repeat.set(1 / 1.2, 1 / 1.2)
  const panelMap = keep(panelTex())
  const hessMap = keep(hessianTex())
  const tileMap = keep(tileTex())
  const soft = keep(softTex())
  const mats = {
    floor: new THREE.MeshStandardMaterial({ map: floorMap, roughness: 0.6 }),
    panel: new THREE.MeshStandardMaterial({ map: panelMap, roughness: 0.7 }),
    hess: new THREE.MeshStandardMaterial({ map: hessMap, roughness: 0.98 }),
    tile: new THREE.MeshStandardMaterial({ map: tileMap, roughness: 0.95 }),
    wood: new THREE.MeshStandardMaterial({ color: '#6a4528', roughness: 0.6 }),
    darkWood: new THREE.MeshStandardMaterial({ color: '#3a2415', roughness: 0.65 }),
    black: new THREE.MeshStandardMaterial({ color: '#17151a', roughness: 0.55, metalness: 0.2 }),
    steel: new THREE.MeshStandardMaterial({ color: '#8d949e', roughness: 0.32, metalness: 0.75 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#b4bac4', roughness: 0.25, metalness: 0.8 }),
    brass: new THREE.MeshStandardMaterial({ color: '#b8904a', roughness: 0.35, metalness: 0.7 }),
    cream: new THREE.MeshStandardMaterial({ color: '#d8cfb8', roughness: 0.5 }),
    rug: new THREE.MeshStandardMaterial({ color: '#4a2a2c', roughness: 1 }),
    glass: new THREE.MeshStandardMaterial({ color: '#9db4c6', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.1, depthWrite: false }),
  }

  // ---- floor, ceiling ----
  const floor = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(fw, fd), fw, fd), mats.floor)
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)
  tileMap.repeat.set(1 / 0.6, 1 / 0.6)
  const ceil = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(fw, fd), fw, fd), mats.tile)
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  // a rug under the band
  if (rug) {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(rug.w, rug.d).rotateX(-Math.PI / 2), mats.rug)
    r.position.set(rug.x, 0.012, rug.z)
    group.add(r)
  }

  // ---- walls: panelling to the chest, a rail, then hessian panels between battens ----
  const RAIL = 1.15
  panelMap.repeat.set(1, 1)
  hessMap.repeat.set(1, 1)
  const wall = (len, x, z, rotY) => {
    const g = new THREE.Group()
    const low = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(len, RAIL), len / 1.1, 1), mats.panel)
    low.position.set(0, RAIL / 2, 0)
    const up = new THREE.Mesh(uvMetres(new THREE.PlaneGeometry(len, h - RAIL), len, h - RAIL), mats.hess)
    up.position.set(0, RAIL + (h - RAIL) / 2, 0.005)
    const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.08, 0.1), mats.darkWood)
    rail.position.set(0, RAIL, 0.05)
    const top = new THREE.Mesh(new THREE.BoxGeometry(len, 0.1, 0.1), mats.darkWood)
    top.position.set(0, h - 0.05, 0.05)
    g.add(low, up, rail, top)
    g.position.set(x, 0, z)
    g.rotation.y = rotY
    group.add(g)
    return g
  }
  wall(fw, (x0 + x1) / 2, z0, 0)
  wall(fw, (x0 + x1) / 2, z1, Math.PI)
  wall(fd, x0, (z0 + z1) / 2, Math.PI / 2)
  wall(fd, x1, (z0 + z1) / 2, -Math.PI / 2)

  // ---- the control room ----
  const C = control
  const wt = 0.22
  const slab = (w, hh, d, x, y, z, mat = mats.panel) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mat)
    m.position.set(x, y, z)
    group.add(m)
    return m
  }
  // the east wall (x = C.x): a low wall, a header, solid wall at the ends, the window between
  {
    const [w0, w1] = C.win
    const full = C.z - z0
    slab(wt, C.sill, full, C.x, C.sill / 2, (z0 + C.z) / 2)
    slab(wt, h - C.top, full, C.x, (C.top + h) / 2, (z0 + C.z) / 2, mats.hess)
    slab(wt, C.top - C.sill, w0 - z0, C.x, (C.sill + C.top) / 2, (z0 + w0) / 2, mats.hess)
    slab(wt, C.top - C.sill, C.z - w1, C.x, (C.sill + C.top) / 2, (w1 + C.z) / 2, mats.hess)
    // window frame (one big pane, no mullion)
    const mid = (w0 + w1) / 2
    for (const zz of [w0, w1]) slab(wt + 0.06, C.top - C.sill, 0.1, C.x, (C.sill + C.top) / 2, zz, mats.darkWood)
    slab(wt + 0.06, 0.1, w1 - w0, C.x, C.sill, mid, mats.darkWood)
    slab(wt + 0.06, 0.1, w1 - w0, C.x, C.top, mid, mats.darkWood)
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(w1 - w0, C.top - C.sill), mats.glass)
    pane.rotation.y = Math.PI / 2
    pane.position.set(C.x, (C.sill + C.top) / 2, mid)
    group.add(pane)
    solids.push(box(C.x, (z0 + C.z) / 2, wt + 0.1, full + 0.1))
  }
  // the south wall (z = C.z) with the door
  {
    const d = C.door
    const a0 = d.at - d.width / 2
    const a1 = d.at + d.width / 2
    const len0 = a0 - x0
    const len1 = C.x - a1
    slab(len0, h, wt, (x0 + a0) / 2, h / 2, C.z, mats.panel)
    slab(len1, h, wt, (a1 + C.x) / 2, h / 2, C.z, mats.panel)
    slab(d.width, h - 2.5, wt, d.at, (2.5 + h) / 2, C.z, mats.panel)
    for (const x of [a0, a1]) slab(0.14, 2.5, wt + 0.08, x, 1.25, C.z, mats.darkWood)
    slab(d.width, 0.12, wt + 0.08, d.at, 2.5, C.z, mats.darkWood)
    solids.push(box((x0 + a0) / 2, C.z, len0, wt + 0.1), box((a1 + C.x) / 2, C.z, len1, wt + 0.1))
  }
  // a carpet inside, so it sounds and looks different
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(C.x - x0, C.z - z0).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#3b3a44', roughness: 1 }))
  carpet.position.set((x0 + C.x) / 2, 0.01, (z0 + C.z) / 2)
  group.add(carpet)

  // ---- hanging baffles: angled wooden boards under the ceiling, over the band ----
  for (const [x, z, r] of [[3.2, -6.4, 0.2], [6.4, -6.6, -0.3], [1.0, -1.4, 0.5], [-0.6, -6.9, 0.1]]) {
    const b = new THREE.Group()
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.05, 1.1), mats.wood)
    board.rotation.z = 0.35
    b.add(board)
    for (const s of [-0.7, 0.7]) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 5), mats.black)
      rod.position.set(s, 0.45, 0)
      b.add(rod)
    }
    b.position.set(x, h - 1.0, z)
    b.rotation.y = r
    group.add(b)
  }

  // ---- lamps in the ceiling: warm, round, flush ----
  const lampMat = new THREE.MeshStandardMaterial({ color: '#fff0cf', emissive: '#ffd08a', emissiveIntensity: 1.5 })
  const lampSpots = [[-1.2, -0.2], [5.4, 1.8], [-6.0, 2.8], [2.2, 5.0], [-6.2, -6.6, true]]
  for (const [x, z, inControl] of lampSpots) {
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.1, 20), mats.black)
    can.position.set(x, h - 0.05, z)
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.24, 20).rotateX(Math.PI / 2), lampMat)
    lens.position.set(x, h - 0.105, z)
    group.add(can, lens)
    if (!(light && !inControl && Math.abs(x) > 5)) {
      const p = new THREE.PointLight('#ffd7a0', inControl ? 5 : 7, 11, 2)
      p.position.set(x, h - 0.7, z)
      group.add(p)
    }
  }
  group.add(new THREE.HemisphereLight('#9a8a98', '#46301f', light ? 1.0 : 0.85))

  // ---- dressing ----
  /** A microphone on a floor stand with a boom: a ribbon mic's silver grille at the end. */
  const micStand = ({ x, z, rot = 0, len = 1.2, y = 1.55 }) => {
    const g = new THREE.Group()
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 14), mats.black)
    base.position.y = 0.02
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, y, 8), mats.chrome)
    pole.position.y = y / 2
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 8).rotateZ(Math.PI / 2), mats.chrome)
    boom.position.set(len / 2 - 0.12, y, 0)
    boom.rotation.z = -0.18
    const counter = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 10), mats.black)
    counter.position.set(-0.2, y + 0.04, 0)
    const mic = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.2, 0.06, 2, 0.03), mats.steel)
    mic.position.set(len - 0.1, y - 0.26, 0)
    const grille = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.18, 0.07, 2, 0.03), mats.black)
    grille.position.copy(mic.position)
    grille.scale.set(0.8, 0.9, 0.8)
    g.add(base, pole, boom, counter, mic, grille)
    g.position.set(x, 0, z)
    g.rotation.y = rot
    group.add(g)
    solids.push(circle(x, z, 0.2))
    return g
  }
  for (const m of mics) micStand(m)

  /** A freestanding baffle (a gobo): a wooden screen with hessian on both faces on little feet. */
  const gobo = ({ x, z, rot = 0, w = 1.4, hh = 1.9 }) => {
    const g = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.07), mats.darkWood)
    frame.position.y = 0.2 + hh / 2
    const face = new THREE.Mesh(new THREE.BoxGeometry(w - 0.14, hh - 0.14, 0.09), mats.hess)
    face.position.y = 0.2 + hh / 2
    g.add(frame, face)
    for (const s of [-1, 1]) {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.5), mats.darkWood)
      foot.position.set(s * (w / 2 - 0.1), 0.1, 0)
      g.add(foot)
    }
    g.position.set(x, 0, z)
    g.rotation.y = rot
    group.add(g)
    solids.push(box(x, z, w, 0.3, { rot }))
    return g
  }
  for (const gb of gobos) gobo(gb)

  /** A drum kit as seen from the front: kick drum, snare, hi-hat, two toms, a floor tom, two cymbals. */
  const drumKit = ({ x, z, rot = 0 }) => {
    const g = new THREE.Group()
    const shellMat = new THREE.MeshStandardMaterial({ color: '#8d1f26', roughness: 0.3, metalness: 0.25 })
    const skin = new THREE.MeshStandardMaterial({ color: '#d9d2c0', roughness: 0.6 })
    const drum = (r, d, px, py, pz, tilt = 0) => {
      const dr = new THREE.Group()
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d, 28), shellMat)
      const top = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.96, r * 0.96, 0.01, 28), skin)
      top.position.y = d / 2 + 0.003
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 6, 28).rotateX(Math.PI / 2), mats.chrome)
      hoop.position.y = d / 2
      dr.add(shell, top, hoop)
      dr.position.set(px, py, pz)
      dr.rotation.x = tilt
      g.add(dr)
      return dr
    }
    const kick = drum(0.36, 0.45, 0, 0.38, 0, Math.PI / 2)
    kick.children[1].position.set(0, 0.2, 0)
    drum(0.17, 0.15, 0.1, 0.85, 0.5, 0.1) // snare
    drum(0.13, 0.14, -0.2, 1.05, -0.35, 0.3)
    drum(0.15, 0.16, 0.15, 1.05, -0.35, 0.3)
    drum(0.2, 0.3, 0.6, 0.55, 0.0, 0)
    for (const [cx, cy, cz, cr] of [[-0.6, 1.5, -0.2, 0.18], [0.72, 1.45, -0.28, 0.2], [-0.55, 0.95, 0.35, 0.14]]) {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, cy, 6), mats.chrome)
      stand.position.set(cx, cy / 2, cz)
      const cym = new THREE.Mesh(new THREE.CylinderGeometry(cr, cr * 0.98, 0.006, 28), mats.brass)
      cym.position.set(cx, cy, cz)
      cym.rotation.z = 0.1
      g.add(stand, cym)
    }
    // a stool
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.06, 16), mats.black)
    stool.position.set(0.1, 0.5, 0.95)
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), mats.chrome)
    leg.position.set(0.1, 0.25, 0.95)
    g.add(stool, leg)
    g.position.set(x, 0, z)
    g.rotation.y = rot
    group.add(g)
    solids.push(circle(x, z, 0.95))
    return g
  }
  if (drums) drumKit(drums)

  // dust turning in the lamps' light
  const dust = motes({ count: 220, radius: Math.min(fw, fd) / 2, y0: 0.4, y1: h - 0.5, color: '#ffe2b8', size: 0.02, opacity: 0.22, speed: 0.04, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  /** Stands a thing on a wall facing into the room (`side`: 'n' far, 's' near, 'w', 'e'). */
  const onWall = (obj, side, at, y, out = 0.03) => {
    if (side === 'w') obj.position.set(x0 + out, y, at), (obj.rotation.y = Math.PI / 2)
    else if (side === 'e') obj.position.set(x1 - out, y, at), (obj.rotation.y = -Math.PI / 2)
    else if (side === 's') obj.position.set(at, y, z1 - out), (obj.rotation.y = Math.PI)
    else obj.position.set(at, y, z0 + out)
    group.add(obj)
    return obj
  }

  return {
    group,
    mats,
    soft,
    solids,
    control,
    micStand,
    gobo,
    drumKit,
    onWall,
    env: {
      background: new THREE.Color('#0d0b0c'),
      fog: new THREE.Fog('#171214', 17, 46),
      exposure: 1.0,
      envIntensity: 0.22,
      bloom: { strength: 0.55, radius: 0.5, threshold: 0.88 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.4, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
    },
    dispose: () => textures.forEach(t => t.dispose()),
  }
}
