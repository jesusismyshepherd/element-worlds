// A stage for picture rooms (docs/knowledge/picture-rooms.md): a room of a Georgian townhouse in London at
// night, turned into a gentleman's laboratory. Painted panelling from the skirting to the cornice, wide oak
// boards and a Turkey rug, tall sash windows with their shutters folded back onto moonlit roofs and chimney
// pots, a fireplace with a low coal fire, glazed bookcases full of books, a panelled door. Quiet and
// domestic: not a basement workshop (workshop.js) nor a laboratory by day (laboratory.js). The moon lays the
// windows' panes on the floor; `candle()` stands a candle anywhere (with the fire and the moon, the room's
// only light). Walking inside x0..x1, z0..z1. `mats` are shared plain materials for the scene's things;
// `onWall(side, at, y, d)` gives a point on a wall and the rotation that faces into the room.
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { box, roomWalls } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** A soft round glow (halos, the moon's light). */
export function softTexture() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A candle flame: a teardrop, white at its heart, orange at its edge. */
export function flameTexture() {
  return canvasTex(64, 128, (g, w, h) => {
    g.save()
    g.translate(w / 2, h * 0.7)
    g.scale(1, 2.3)
    const grd = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.45)
    grd.addColorStop(0, 'rgba(255,255,235,1)')
    grd.addColorStop(0.3, 'rgba(255,214,120,0.95)')
    grd.addColorStop(0.65, 'rgba(255,140,40,0.55)')
    grd.addColorStop(1, 'rgba(255,90,20,0)')
    g.fillStyle = grd
    g.beginPath()
    g.arc(0, 0, w * 0.45, 0, TAU)
    g.fill()
    g.restore()
  })
}

/** Wide oak floorboards (UVs in metres, 4 m to the tile): boards 0.25 m wide of varied lengths. */
function boardsTex(light) {
  const s = light ? 256 : 512
  const rnd = random(17)
  const per = s / 16 // a board's width in pixels (16 boards to 4 m)
  return canvasTex(s, s, g => {
    g.fillStyle = '#2a1c12'
    g.fillRect(0, 0, s, s)
    for (let c = 0; c < 16; c++) {
      let y = -rnd() * s
      while (y < s) {
        const len = s * (0.35 + rnd() * 0.5)
        const v = 0.78 + rnd() * 0.3
        const r = 128 * v
        const gg = 92 * v
        const b = 60 * v
        for (const dy of [0, s]) {
          g.fillStyle = `rgb(${r},${gg},${b})`
          g.fillRect(c * per + 1, y - dy + 1, per - 2, len - 2)
          // the grain: long faint streaks along the board
          for (let k = 0; k < 7; k++) {
            g.fillStyle = `rgba(${rnd() < 0.5 ? '60,38,22' : '170,130,90'},${0.08 + rnd() * 0.1})`
            g.fillRect(c * per + 2 + rnd() * (per - 5), y - dy + 2, 1 + rnd() * 2, len - 4)
          }
        }
        y += len
      }
    }
  }, { repeat: true })
}

/** A Turkey rug: a red field with a blue medallion and lozenges, a border of blue and gold. */
function rugTex(light) {
  const w = light ? 256 : 512
  const h = Math.round(w * 0.66)
  const rnd = random(29)
  return canvasTex(w, h, g => {
    g.fillStyle = '#7a2a22'
    g.fillRect(0, 0, w, h)
    const b = w * 0.07
    g.fillStyle = '#23305a'
    g.fillRect(0, 0, w, b)
    g.fillRect(0, h - b, w, b)
    g.fillRect(0, 0, b, h)
    g.fillRect(w - b, 0, b, h)
    g.strokeStyle = '#c99a46'
    g.lineWidth = w * 0.006
    g.strokeRect(b * 0.5, b * 0.5, w - b, h - b)
    g.strokeRect(b * 1.1, b * 1.1, w - b * 2.2, h - b * 2.2)
    // little stars along the border
    g.fillStyle = '#c99a46'
    for (let x = b * 1.5; x < w - b; x += b * 0.9) {
      for (const y of [b * 0.5, h - b * 0.5]) g.fillRect(x - 2, y - 2, 4, 4)
    }
    // the medallion and two lozenges
    const lozenge = (cx, cy, rx, ry, c) => {
      g.fillStyle = c
      g.beginPath()
      g.moveTo(cx - rx, cy)
      g.lineTo(cx, cy - ry)
      g.lineTo(cx + rx, cy)
      g.lineTo(cx, cy + ry)
      g.closePath()
      g.fill()
    }
    lozenge(w / 2, h / 2, w * 0.2, h * 0.3, '#23305a')
    lozenge(w / 2, h / 2, w * 0.13, h * 0.2, '#b5823a')
    lozenge(w / 2, h / 2, w * 0.06, h * 0.1, '#7a2a22')
    for (const sx of [-1, 1]) {
      lozenge(w / 2 + sx * w * 0.32, h / 2, w * 0.07, h * 0.16, '#23305a')
      lozenge(w / 2 + sx * w * 0.32, h / 2, w * 0.03, h * 0.07, '#c99a46')
    }
    // wear: a mottle of lighter and darker
    for (let i = 0; i < 500; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,230,200,0.04)'
      g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 2 + rnd() * 6)
    }
  })
}

/** Moonlit London across the street: houses of brick with a few lit windows, roofs, chimney stacks and
 *  pots, a steeple, the sky above them with stars (a band round the room, repeating three times). */
function townTex(light) {
  const w = light ? 1024 : 2048
  const h = light ? 256 : 512
  const rnd = random(1781)
  return canvasTex(w, h, g => {
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#05081a')
    sky.addColorStop(0.55, '#101a3c')
    sky.addColorStop(0.75, '#1e2a52')
    sky.addColorStop(1, '#141a30')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < (light ? 90 : 200); i++) {
      g.fillStyle = `rgba(255,255,240,${0.3 + rnd() * 0.6})`
      g.beginPath()
      g.arc(rnd() * w, rnd() * h * 0.5, 0.6 + rnd() * 1.1, 0, TAU)
      g.fill()
    }
    // the roofline: terraces of three or four storeys, their tops between 55% and 66% of the band's height
    let x = 0
    const ground = h
    while (x < w) {
      const hw = w * (0.03 + rnd() * 0.035)
      const top = h * (0.55 + rnd() * 0.11)
      const v = 22 + rnd() * 12
      g.fillStyle = `rgb(${v + 8},${v + 2},${v + 4})`
      g.fillRect(x, top, hw + 1, ground - top)
      // a parapet and a slate roof behind it
      g.fillStyle = '#141420'
      g.beginPath()
      g.moveTo(x, top)
      g.lineTo(x + hw * 0.15, top - h * 0.035)
      g.lineTo(x + hw * 0.85, top - h * 0.035)
      g.lineTo(x + hw, top)
      g.closePath()
      g.fill()
      // chimney stacks with pots
      if (rnd() < 0.8) {
        const cx = x + hw * (0.2 + rnd() * 0.6)
        const ch = h * (0.04 + rnd() * 0.04)
        g.fillStyle = '#1c1a22'
        g.fillRect(cx, top - h * 0.035 - ch, hw * 0.22, ch)
        for (let k = 0; k < 3; k++) g.fillRect(cx + hw * (0.02 + k * 0.07), top - h * 0.035 - ch - h * 0.015, hw * 0.04, h * 0.015)
      }
      // windows in rows, a few lit by candles
      for (let fy = top + h * 0.05; fy < ground - h * 0.06; fy += h * 0.075) {
        for (let fx = x + hw * 0.18; fx < x + hw - hw * 0.15; fx += hw * 0.3) {
          const lit = rnd() < 0.12
          g.fillStyle = lit ? `rgba(255,${180 + rnd() * 40},${90 + rnd() * 40},0.85)` : 'rgba(10,12,24,0.9)'
          g.fillRect(fx, fy, hw * 0.12, h * 0.04)
        }
      }
      x += hw
    }
    // a steeple far off
    const sx = w * 0.62
    g.fillStyle = '#14141e'
    g.fillRect(sx, h * 0.42, w * 0.012, h * 0.2)
    g.beginPath()
    g.moveTo(sx - w * 0.002, h * 0.42)
    g.lineTo(sx + w * 0.006, h * 0.24)
    g.lineTo(sx + w * 0.014, h * 0.42)
    g.closePath()
    g.fill()
  }, { repeat: true })
}

/** A painting over the mantel: ships on a moonlit sea, in the dark tones of old varnish. */
function paintingTex() {
  return canvasTex(256, 192, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#1a1c22')
    sky.addColorStop(0.6, '#4a4636')
    sky.addColorStop(1, '#262418')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#c8b88a'
    g.beginPath()
    g.arc(w * 0.7, h * 0.3, 10, 0, TAU)
    g.fill()
    g.fillStyle = '#1e2420'
    g.fillRect(0, h * 0.66, w, h * 0.34)
    g.fillStyle = 'rgba(200,184,138,0.35)'
    g.fillRect(w * 0.6, h * 0.67, w * 0.2, 3)
    g.fillStyle = '#100e0c'
    for (const [x, s] of [[0.28, 1], [0.48, 0.6]]) {
      g.beginPath()
      g.moveTo(w * x - 26 * s, h * 0.66)
      g.lineTo(w * x + 26 * s, h * 0.66)
      g.lineTo(w * x + 20 * s, h * 0.7)
      g.lineTo(w * x - 20 * s, h * 0.7)
      g.fill()
      g.fillRect(w * x - 1, h * 0.66 - 60 * s, 2, 60 * s)
      g.beginPath()
      g.moveTo(w * x + 2, h * 0.66 - 56 * s)
      g.lineTo(w * x + 24 * s, h * 0.66 - 14 * s)
      g.lineTo(w * x + 2, h * 0.66 - 12 * s)
      g.fill()
    }
  }, { mipmaps: false })
}

/** The moon's light on the floor through a sash window: soft-edged panes, 3 across and 4 up. */
function panesTex() {
  return canvasTex(96, 128, (g, w, h) => {
    g.fillStyle = '#000'
    g.fillRect(0, 0, w, h)
    g.filter = 'blur(2px)'
    g.fillStyle = '#fff'
    const bar = 4
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 4; r++) g.fillRect(6 + (c * (w - 12)) / 3 + bar / 2, 6 + (r * (h - 12)) / 4 + bar / 2, (w - 12) / 3 - bar, (h - 12) / 4 - bar)
    }
    g.filter = 'none'
  }, { mipmaps: false })
}

/**
 * The room. `windows`: [{ side, at, width, sill, height }] sash windows onto the night; `fireplace`: { side,
 * at } a chimney breast with a coal fire; `door`: { side, at } a closed panelled door; `bookcases`: [{ side,
 * at, width }]; `rug`: { x, z, w, d }; `paint`: the panelling's colour; `moon`: the direction toward the moon.
 */
export function townhouseStage({
  light = false, x0 = -6.4, x1 = 6.4, z0 = -6.4, z1 = 6.6, h = 4.3, windows = [], fireplace = null, door = null,
  bookcases = [], rug = null, paint = '#4a4864', moon = [-0.9, 0.38, -0.2],
} = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const tex = t => (textures.push(t), t)
  const geo = g => (geos.push(g), g)
  const toMoon = new THREE.Vector3(...moon).normalize()
  const soft = tex(softTexture())
  const flame = tex(flameTexture())

  const mats = {
    paint: new THREE.MeshStandardMaterial({ color: paint, roughness: 0.62 }),
    panel: new THREE.MeshStandardMaterial({ color: new THREE.Color(paint).multiplyScalar(1.12), roughness: 0.58 }),
    trim: new THREE.MeshStandardMaterial({ color: new THREE.Color(paint).multiplyScalar(1.3), roughness: 0.55 }),
    sash: new THREE.MeshStandardMaterial({ color: '#a8a294', roughness: 0.6 }),
    wood: new THREE.MeshStandardMaterial({ color: '#6a4028', roughness: 0.55 }), // mahogany
    oak: new THREE.MeshStandardMaterial({ color: '#7a5a3a', roughness: 0.7 }),
    dark: new THREE.MeshStandardMaterial({ color: '#1a1410', roughness: 0.9 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c49a4c', roughness: 0.3, metalness: 0.9 }),
    iron: new THREE.MeshStandardMaterial({ color: '#2e3034', roughness: 0.55, metalness: 0.7 }),
    stone: new THREE.MeshStandardMaterial({ color: '#8c877c', roughness: 0.5 }),
    plaster: new THREE.MeshStandardMaterial({ color: '#7c776c', roughness: 0.95 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe2ea', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide }),
  }

  // ---- the floor, the rug, the ceiling ----
  const fw = x1 - x0
  const fd = z1 - z0
  const boards = tex(boardsTex(light))
  boards.repeat.set(1 / 4, 1 / 4)
  const floorGeo = geo(new THREE.PlaneGeometry(fw, fd))
  {
    const uv = floorGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fw, uv.getY(i) * fd)
  }
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: boards, color: '#b49a80', roughness: 0.6 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(floor)
  if (rug) {
    const r = new THREE.Mesh(geo(new THREE.PlaneGeometry(rug.w, rug.d)), new THREE.MeshStandardMaterial({ map: tex(rugTex(light)), color: '#c8b8b0', roughness: 0.95 }))
    r.rotation.x = -Math.PI / 2
    r.position.set(rug.x, 0.006, rug.z)
    group.add(r)
  }
  const ceil = new THREE.Mesh(geo(new THREE.PlaneGeometry(fw, fd)), mats.plaster)
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  group.add(ceil)
  {
    // a plaster rose in the middle of the ceiling
    const rose = new THREE.Mesh(geo(new THREE.LatheGeometry([[0, 0], [0.42, 0], [0.4, -0.03], [0.3, -0.05], [0.18, -0.06], [0.06, -0.09], [0, -0.1]].map(([a, b]) => new THREE.Vector2(a, b)), 32)), mats.plaster)
    rose.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
    group.add(rose)
  }

  // ---- the walls: painted panelling round the openings ----
  const sides = {
    n: { a0: x0, a1: x1, place: m => (m.position.set(0, 0, z0), (m.rotation.y = 0)), map: at => at },
    s: { a0: -x1, a1: -x0, place: m => (m.position.set(0, 0, z1), (m.rotation.y = Math.PI)), map: at => -at },
    w: { a0: -z1, a1: -z0, place: m => (m.position.set(x0, 0, 0), (m.rotation.y = Math.PI / 2)), map: at => -at },
    e: { a0: z0, a1: z1, place: m => (m.position.set(x1, 0, 0), (m.rotation.y = -Math.PI / 2)), map: at => at },
  }
  const onWall = (side, at, y, d = 0) => {
    const s = sides[side]
    const m = new THREE.Object3D()
    s.place(m)
    m.updateMatrix()
    return { pos: new THREE.Vector3(s.map(at), y, d).applyMatrix4(m.matrix), rot: m.rotation.y }
  }
  const BREAST = 0.5 // how far the chimney breast stands into the room
  const openings = [
    ...windows.map(o => ({ kind: 'window', width: 1.25, sill: 0.7, height: 2.55, ...o })),
    ...(door ? [{ kind: 'door', width: 1.05, sill: 0, height: 2.35, ...door }] : []),
  ]
  // what interrupts the panelling: openings, the chimney breast, bookcases (with a little margin)
  const blocks = side => [
    ...openings.filter(o => o.side === side).map(o => [o.at - o.width / 2 - 0.16, o.at + o.width / 2 + 0.16, o]),
    ...(fireplace?.side === side ? [[fireplace.at - 1.1, fireplace.at + 1.1, null]] : []),
    ...bookcases.filter(b => b.side === side).map(b => [b.at - b.width / 2 - 0.02, b.at + b.width / 2 + 0.02, null]),
  ].map(([p, q, o]) => [sides[side].map(p), sides[side].map(q), o]).map(([p, q, o]) => [Math.min(p, q), Math.max(p, q), o])
  const panelRects = [] // [side, a, y, w, h]
  const railRuns = [] // [side, a0, a1]
  for (const [name, s] of Object.entries(sides)) {
    const holes = openings.filter(o => o.side === name).map(o => {
      const a = s.map(o.at)
      return { a0: a - o.width / 2, a1: a + o.width / 2, y0: o.sill, y1: o.sill + o.height }
    })
    const shape = new THREE.Shape()
    shape.moveTo(s.a0 - 0.01, 0)
    shape.lineTo(s.a1 + 0.01, 0)
    shape.lineTo(s.a1 + 0.01, h)
    shape.lineTo(s.a0 - 0.01, h)
    shape.closePath()
    for (const o of holes) {
      const p = new THREE.Path()
      const y0 = Math.max(o.y0, 0.001)
      p.moveTo(o.a0, y0)
      p.lineTo(o.a0, o.y1)
      p.lineTo(o.a1, o.y1)
      p.lineTo(o.a1, y0)
      p.closePath()
      shape.holes.push(p)
    }
    const wall = new THREE.Mesh(geo(new THREE.ShapeGeometry(shape)), mats.paint)
    s.place(wall)
    group.add(wall)
    // the free runs between what interrupts the wall
    const cuts = blocks(name).sort((p, q) => p[0] - q[0])
    let from = s.a0
    const runs = []
    for (const [c0, c1] of cuts) {
      if (c0 > from + 0.05) runs.push([from, c0])
      from = Math.max(from, c1)
    }
    if (from < s.a1 - 0.05) runs.push([from, s.a1])
    for (const [ra, rb] of runs) {
      railRuns.push([name, ra, rb])
      const len = rb - ra
      const n = Math.max(1, Math.round(len / 1.0))
      const pw = len / n
      for (let i = 0; i < n; i++) {
        const a = ra + (i + 0.5) * pw
        // a low panel under the dado rail and a tall one above it
        panelRects.push([name, a, 0.52, pw - 0.2, 0.56])
        panelRects.push([name, a, 0.95 + (h - 0.5 - 0.95) / 2, pw - 0.2, h - 0.5 - 0.95 - 0.24])
      }
    }
    // under a window, the panelling goes up to the sill; over a window or a door, a short panel
    for (const o of openings.filter(q => q.side === name)) {
      const a = s.map(o.at)
      if (o.kind === 'window' && o.sill > 0.4) panelRects.push([name, a, o.sill / 2, o.width - 0.16, o.sill - 0.26])
      const top = o.sill + o.height + 0.14
      if (h - 0.5 - top > 0.3) panelRects.push([name, a, (top + h - 0.5) / 2, o.width - 0.1, h - 0.5 - top - 0.14])
    }
    // the cornice all along
    const corn = new THREE.Mesh(new THREE.BoxGeometry(s.a1 - s.a0, 0.2, 0.16), mats.trim)
    const ca = new THREE.Group()
    s.place(ca)
    corn.position.set((s.a0 + s.a1) / 2, h - 0.1, 0.08)
    ca.add(corn)
    group.add(ca)
  }
  // fielded panels and the rails, instanced (one draw each)
  const place = (mesh, i, side, a, y, d, sx, sy, sz) => {
    const anchor = new THREE.Object3D()
    sides[side].place(anchor)
    anchor.updateMatrix()
    const m = new THREE.Matrix4().compose(new THREE.Vector3(a, y, d).applyMatrix4(anchor.matrix), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, anchor.rotation.y, 0)), new THREE.Vector3(sx, sy, sz))
    mesh.setMatrixAt(i, m)
  }
  {
    const unit = geo(new THREE.BoxGeometry(1, 1, 1))
    const panels = new THREE.InstancedMesh(unit, mats.panel, panelRects.length)
    panelRects.forEach(([side, a, y, w, hh], i) => place(panels, i, side, a, y, 0.02, w, hh, 0.04))
    const frames = new THREE.InstancedMesh(unit, mats.trim, panelRects.length * 4)
    panelRects.forEach(([side, a, y, w, hh], i) => {
      // a moulding round each panel
      place(frames, i * 4, side, a, y + hh / 2 + 0.025, 0.03, w + 0.1, 0.05, 0.05)
      place(frames, i * 4 + 1, side, a, y - hh / 2 - 0.025, 0.03, w + 0.1, 0.05, 0.05)
      place(frames, i * 4 + 2, side, a - w / 2 - 0.025, y, 0.03, 0.05, hh, 0.05)
      place(frames, i * 4 + 3, side, a + w / 2 + 0.025, y, 0.03, 0.05, hh, 0.05)
    })
    const rails = new THREE.InstancedMesh(unit, mats.trim, railRuns.length * 2)
    railRuns.forEach(([side, ra, rb], i) => {
      place(rails, i * 2, side, (ra + rb) / 2, 0.92, 0.04, rb - ra, 0.06, 0.08) // the dado rail
      place(rails, i * 2 + 1, side, (ra + rb) / 2, 0.09, 0.03, rb - ra, 0.18, 0.06) // the skirting
    })
    group.add(panels, frames, rails)
  }

  // ---- the windows: sash windows of small panes, folded shutters, the night outside ----
  const WALL_T = 0.36
  const sashFrame = (w, hh, cols, rows) => {
    const g = new THREE.Group()
    const bar = 0.03
    for (const [bw, bh, x, y] of [[w, 0.06, 0, hh / 2 - 0.03], [w, 0.06, 0, -hh / 2 + 0.03], [0.06, hh, -w / 2 + 0.03, 0], [0.06, hh, w / 2 - 0.03, 0]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.05), mats.sash)
      m.position.set(x, y, 0)
      g.add(m)
    }
    for (let c = 1; c < cols; c++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bar, hh, 0.035), mats.sash)
      m.position.x = -w / 2 + (c * w) / cols
      g.add(m)
    }
    for (let r = 1; r < rows; r++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, bar, 0.035), mats.sash)
      m.position.y = -hh / 2 + (r * hh) / rows
      g.add(m)
    }
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), mats.glass)
    glass.renderOrder = 3
    g.add(glass)
    return g
  }
  const panes = tex(panesTex())
  const moonPatch = new THREE.MeshBasicMaterial({ map: panes, color: new THREE.Color('#8fa6e0').multiplyScalar(0.32), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  for (const o of openings) {
    const s = sides[o.side]
    const a = s.map(o.at)
    const anchor = new THREE.Group()
    s.place(anchor)
    group.add(anchor)
    // the reveal: the wall's thickness round the hole
    const reveal = [[o.width + 0.02, 0.04, a, o.sill + o.height], [0.04, o.height, a - o.width / 2, o.sill + o.height / 2], [0.04, o.height, a + o.width / 2, o.sill + o.height / 2]]
    if (o.kind === 'window') reveal.push([o.width + 0.02, 0.04, a, o.sill])
    for (const [w, hh, x, y] of reveal) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, WALL_T), mats.trim)
      m.position.set(x, y, -WALL_T / 2)
      anchor.add(m)
    }
    // the architrave round it
    for (const [w, hh, x, y] of [[o.width + 0.3, 0.12, a, o.sill + o.height + 0.06], [0.12, o.height, a - o.width / 2 - 0.06, o.sill + o.height / 2], [0.12, o.height, a + o.width / 2 + 0.06, o.sill + o.height / 2]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.05), mats.trim)
      m.position.set(x, y, 0.025)
      anchor.add(m)
    }
    if (o.kind === 'window') {
      // two sashes, six panes each
      const sh = o.height / 2
      for (const k of [0, 1]) {
        const f = sashFrame(o.width - 0.04, sh, 3, 2)
        f.position.set(a, o.sill + sh / 2 + k * sh, -WALL_T * 0.6 - (k ? 0.05 : 0))
        anchor.add(f)
      }
      const sill = new THREE.Mesh(new THREE.BoxGeometry(o.width + 0.24, 0.05, 0.28), mats.trim)
      sill.position.set(a, o.sill - 0.02, 0.06)
      anchor.add(sill)
      // the shutters folded back into the reveals, two leaves a side
      for (const sgn of [-1, 1]) {
        for (const k of [0, 1]) {
          const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.03, o.height - 0.08, 0.15), mats.panel)
          leaf.position.set(a + sgn * (o.width / 2 + 0.02 + k * 0.035), o.sill + o.height / 2, -0.09 - k * 0.15)
          anchor.add(leaf)
        }
      }
      // the moon's panes on the floor: the window's corners carried along the moonlight to the floor
      const into = toMoon.clone().negate()
      if (into.y < -0.05) {
        const corner = (da, y) => {
          const p = onWall(o.side, o.at + da, y, -WALL_T * 0.6).pos
          const t = -p.y / into.y
          return p.addScaledVector(into, t)
        }
        const hw = (o.width - 0.08) / 2
        const pts = [corner(-hw, o.sill + o.height - 0.04), corner(hw, o.sill + o.height - 0.04), corner(hw, o.sill + 0.04), corner(-hw, o.sill + 0.04)]
        const g = geo(new THREE.BufferGeometry())
        g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flatMap(p => [p.x, 0.012, p.z]), 3))
        g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2))
        g.setIndex([0, 2, 1, 0, 3, 2])
        g.computeVertexNormals()
        const patch = new THREE.Mesh(g, moonPatch)
        patch.material.side = THREE.DoubleSide
        patch.renderOrder = 1
        group.add(patch)
      }
    } else {
      // a six-panel door, shut: his own way to the stairs
      const dw = o.width - 0.02
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(dw, o.height - 0.01, 0.05), mats.wood)
      leaf.position.set(a, o.height / 2, -0.06)
      anchor.add(leaf)
      for (const [px, py, pw, ph] of [[-1, 0.42, 0.34, 0.6], [1, 0.42, 0.34, 0.6], [-1, 1.2, 0.34, 0.72], [1, 1.2, 0.34, 0.72], [-1, 1.95, 0.34, 0.5], [1, 1.95, 0.34, 0.5]]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, 0.02), mats.wood)
        p.position.set(a + px * dw * 0.24, py, -0.025)
        anchor.add(p)
      }
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), mats.brass)
      knob.position.set(a + dw / 2 - 0.12, 1.0, 0)
      anchor.add(knob)
    }
  }
  // outside: the street's houses and the sky round the whole room, and the moon
  if (windows.length) {
    const town = tex(townTex(light))
    town.wrapS = THREE.RepeatWrapping
    town.repeat.set(3, 1)
    const ring = new THREE.Mesh(geo(new THREE.CylinderGeometry(15, 15, 16, 48, 1, true)), new THREE.MeshBasicMaterial({ map: town, side: THREE.BackSide, fog: false, color: '#b8bccc' }))
    ring.position.set(0, 5, 0)
    group.add(ring)
    const moonDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#fff6dc').multiplyScalar(2.2), transparent: true, fog: false, depthWrite: false }))
    moonDisc.scale.setScalar(0.9)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#9fb2e8').multiplyScalar(0.6), transparent: true, opacity: 0.5, fog: false, depthWrite: false, blending: THREE.AdditiveBlending }))
    halo.scale.setScalar(4.5)
    const at = toMoon.clone().multiplyScalar(14).add(new THREE.Vector3(0, 1.6, 0))
    moonDisc.position.copy(at)
    halo.position.copy(at)
    group.add(halo, moonDisc)
  }

  // ---- the fireplace: a chimney breast, a stone surround, an iron grate of glowing coals ----
  const solids = roomWalls(x0, x1, z0, z1)
  let fireLight = null
  let coals = null
  if (fireplace) {
    const anchor = new THREE.Group()
    const s = sides[fireplace.side]
    s.place(anchor)
    group.add(anchor)
    const a = s.map(fireplace.at)
    const bw = 2.1
    const front = BREAST
    const box3 = (w, hh, d, x, y, z, m) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), m)
      mesh.position.set(x, y, z)
      anchor.add(mesh)
      return mesh
    }
    // the breast, built round the fire's opening (0.9 wide, 0.85 high)
    box3((bw - 0.9) / 2, h, BREAST, a - (bw + 0.9) / 4, h / 2, BREAST / 2 - 0.01, mats.paint)
    box3((bw - 0.9) / 2, h, BREAST, a + (bw + 0.9) / 4, h / 2, BREAST / 2 - 0.01, mats.paint)
    box3(0.9, h - 0.85, BREAST, a, 0.85 + (h - 0.85) / 2, BREAST / 2 - 0.01, mats.paint)
    box3(bw + 0.1, 0.2, 0.16, a, h - 0.1, BREAST + 0.07, mats.trim)
    // the opening: a dark firebox
    box3(0.9, 0.85, 0.02, a, 0.43, front - 0.34, mats.dark)
    box3(0.02, 0.85, 0.34, a - 0.45, 0.43, front - 0.17, mats.dark)
    box3(0.02, 0.85, 0.34, a + 0.45, 0.43, front - 0.17, mats.dark)
    box3(0.92, 0.02, 0.34, a, 0.85, front - 0.17, mats.dark)
    // the surround: two jambs, a frieze, the mantel shelf, the hearth stone
    box3(0.3, 1.05, 0.08, a - 0.6, 0.525, front + 0.04, mats.stone)
    box3(0.3, 1.05, 0.08, a + 0.6, 0.525, front + 0.04, mats.stone)
    box3(1.5, 0.2, 0.08, a, 0.95, front + 0.04, mats.stone)
    box3(1.7, 0.06, 0.26, a, 1.08, front + 0.1, mats.stone)
    box3(1.6, 0.03, 0.5, a, 0.015, front + 0.25, mats.stone)
    // the grate: an iron basket on legs, heaped with coals
    const grate = new THREE.Group()
    for (let i = 0; i < 6; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.2, 0.015), mats.iron)
      bar.position.set(-0.27 + i * 0.108, 0.3, 0.14)
      grate.add(bar)
    }
    for (const y of [0.2, 0.4]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.02), mats.iron)
      rail.position.set(0, y, 0.14)
      grate.add(rail)
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.26), mats.iron)
    base.position.set(0, 0.2, 0.02)
    grate.add(base)
    const coalMat = new THREE.MeshStandardMaterial({ color: '#1c1410', emissive: '#ff5a18', emissiveIntensity: 0.9, roughness: 0.9 })
    const rnd = random(77)
    const n = light ? 16 : 28
    coals = new THREE.InstancedMesh(geo(new THREE.IcosahedronGeometry(0.045, 0)), coalMat, n)
    const d = new THREE.Object3D()
    for (let i = 0; i < n; i++) {
      d.position.set((rnd() - 0.5) * 0.5, 0.24 + rnd() * 0.12, (rnd() - 0.5) * 0.22)
      d.rotation.set(rnd() * TAU, rnd() * TAU, 0)
      d.scale.setScalar(0.7 + rnd() * 0.7)
      d.updateMatrix()
      coals.setMatrixAt(i, d.matrix)
    }
    grate.add(coals)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ff7a2a').multiplyScalar(0.7), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }))
    glow.position.set(0, 0.36, 0.05)
    glow.scale.set(0.9, 0.5, 1)
    grate.add(glow)
    grate.position.set(a, 0, front - 0.2)
    anchor.add(grate)
    // a painting over the mantel in a gilt frame
    const frame = box3(1.2, 0.92, 0.05, a, 1.95, front + 0.025, mats.brass)
    frame.material = new THREE.MeshStandardMaterial({ color: '#a8823c', roughness: 0.4, metalness: 0.8 })
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 0.76), new THREE.MeshStandardMaterial({ map: tex(paintingTex()), roughness: 0.6 }))
    pic.position.set(a, 1.95, front + 0.052)
    anchor.add(pic)
    // the fire's own flickering light
    fireLight = new THREE.PointLight('#ff8a3a', light ? 2.2 : 3, 7, 1.6)
    const fp = onWall(fireplace.side, fireplace.at, 0.6, front + 0.5).pos
    fireLight.position.copy(fp)
    group.add(fireLight)
    const c = onWall(fireplace.side, fireplace.at, 0, BREAST / 2).pos
    const along = fireplace.side === 'n' || fireplace.side === 's'
    solids.push(box(c.x, c.z, along ? bw : BREAST + 0.5, along ? BREAST + 0.5 : bw))
  }

  // ---- bookcases: glazed doors, shelves of leather-bound books ----
  {
    const spines = []
    for (const b of bookcases) {
      const s = sides[b.side]
      const anchor = new THREE.Group()
      s.place(anchor)
      group.add(anchor)
      const a = s.map(b.at)
      const bh = b.height ?? 2.55
      const dd = 0.38
      const carc = (w, hh, d, x, y, z) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), mats.wood)
        m.position.set(x, y, z)
        anchor.add(m)
      }
      carc(b.width, 0.06, dd, a, bh - 0.03, dd / 2)
      carc(b.width + 0.08, 0.08, dd + 0.06, a, bh + 0.04, dd / 2 + 0.02)
      carc(b.width, 0.5, dd, a, 0.25, dd / 2) // the cupboard below
      carc(0.04, bh, dd, a - b.width / 2 + 0.02, bh / 2, dd / 2)
      carc(0.04, bh, dd, a + b.width / 2 - 0.02, bh / 2, dd / 2)
      carc(b.width, bh, 0.02, a, bh / 2, 0.01)
      const shelves = 5
      const sy0 = 0.5
      const step = (bh - 0.08 - sy0) / shelves
      for (let k = 0; k <= shelves; k++) carc(b.width - 0.06, 0.025, dd - 0.04, a, sy0 + k * step, dd / 2)
      // the books
      const rnd = random(Math.round(b.at * 100) + 7)
      for (let k = 0; k < shelves; k++) {
        let x = a - b.width / 2 + 0.06
        while (x < a + b.width / 2 - 0.1) {
          const t = 0.025 + rnd() * 0.035
          const bkH = step * (0.62 + rnd() * 0.3)
          spines.push({ anchor, x: x + t / 2, y: sy0 + k * step + 0.0125 + bkH / 2, z: dd * 0.5, w: t, h: bkH, d: dd * (0.6 + rnd() * 0.25), c: rnd() })
          x += t + 0.003
          if (rnd() < 0.04) x += 0.06
        }
      }
      // the glazed doors: glazing bars over glass
      const gx = b.width / 2 - 0.04
      for (const sgn of [-1, 1]) {
        const door = new THREE.Group()
        const dw = gx
        for (const [w, hh, x, y] of [[dw, 0.05, 0, bh - 0.1], [dw, 0.05, 0, 0.53], [0.05, bh - 0.6, -dw / 2, bh / 2 + 0.2], [0.05, bh - 0.6, dw / 2, bh / 2 + 0.2]]) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.03), mats.wood)
          m.position.set(x, y, 0)
          door.add(m)
        }
        for (let r = 1; r < 4; r++) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(dw, 0.015, 0.02), mats.wood)
          m.position.set(0, 0.53 + (r * (bh - 0.63)) / 4, 0)
          door.add(m)
        }
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.015, bh - 0.63, 0.02), mats.wood)
        m.position.set(0, bh / 2 + 0.22, 0)
        door.add(m)
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(dw, bh - 0.63), mats.glass)
        glass.position.set(0, bh / 2 + 0.22, -0.005)
        glass.renderOrder = 3
        door.add(glass)
        door.position.set(a + sgn * dw / 2, 0, dd + 0.02)
        anchor.add(door)
      }
      const c = onWall(b.side, b.at, 0, dd / 2).pos
      const along = b.side === 'n' || b.side === 's'
      solids.push(box(c.x, c.z, along ? b.width : dd + 0.1, along ? dd + 0.1 : b.width))
    }
    if (spines.length) {
      const leather = ['#5a2a1e', '#6e3a22', '#3c2a1c', '#2a3a2a', '#7a5a32', '#4a1e1a', '#5e4a30', '#2c2a3a']
      const bookMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 })
      const books = new THREE.InstancedMesh(geo(new THREE.BoxGeometry(1, 1, 1)), bookMat, spines.length)
      const col = new THREE.Color()
      spines.forEach((sp, i) => {
        sp.anchor.updateMatrix()
        const m = new THREE.Matrix4().compose(new THREE.Vector3(sp.x, sp.y, sp.z).applyMatrix4(sp.anchor.matrix), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, sp.anchor.rotation.y, 0)), new THREE.Vector3(sp.w, sp.h, sp.d))
        books.setMatrixAt(i, m)
        books.setColorAt(i, col.set(leather[Math.floor(sp.c * leather.length)]))
      })
      group.add(books)
    }
  }

  // ---- candles: brass sticks, wax, a flickering flame; a few carry a real light ----
  const candles = []
  const flameMat = new THREE.SpriteMaterial({ map: flame, color: new THREE.Color('#ffd9a0').multiplyScalar(2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  const haloMat = new THREE.SpriteMaterial({ map: soft, color: new THREE.Color('#ffb060').multiplyScalar(0.9), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
  const waxMat = new THREE.MeshStandardMaterial({ color: '#efe6cf', roughness: 0.6, emissive: '#5a3a18', emissiveIntensity: 0.25 })
  const stickGeo = geo(new THREE.LatheGeometry([[0, 0], [0.055, 0], [0.058, 0.012], [0.02, 0.03], [0.014, 0.09], [0.04, 0.1], [0.042, 0.11], [0.016, 0.112]].map(([x, y]) => new THREE.Vector2(x, y)), 18))
  /** A candle on a brass stick standing at (x, y, z); `glow`: a real light of that strength. */
  function candle(x, y, z, { h: ch = 0.15, glow = 0, reach = 6 } = {}) {
    const g = new THREE.Group()
    const stick = new THREE.Mesh(stickGeo, mats.brass)
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.014, ch, 10), waxMat)
    wax.position.y = 0.11 + ch / 2
    const f = new THREE.Sprite(flameMat)
    const top = 0.11 + ch
    f.center.set(0.5, 0.1)
    f.position.y = top + 0.005
    const halo = new THREE.Sprite(haloMat)
    halo.position.y = top + 0.03
    halo.scale.setScalar(0.32)
    g.add(stick, wax, f, halo)
    g.position.set(x, y, z)
    group.add(g)
    let pl = null
    if (glow) {
      pl = new THREE.PointLight('#ffb36a', glow, reach, 1.6)
      pl.position.set(x, y + top + 0.08, z)
      group.add(pl)
    }
    const c = { group: g, f, pl, glow, seed: Math.random() * 100 }
    candles.push(c)
    return c
  }

  // dust drifting in the candlelight
  const dust = motes({ count: 200, radius: Math.min(fw, fd) / 2, y0: 0.3, y1: h - 0.5, color: '#ffe2b8', size: 0.022, opacity: 0.28, speed: 0.04, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  // a faint fill so nothing is pitch black, and the moon through the windows
  group.add(new THREE.HemisphereLight('#3e4466', '#2a1c14', light ? 1.0 : 0.75))
  const moonLight = new THREE.DirectionalLight('#9fb2ff', windows.length ? 0.45 : 0)
  moonLight.position.copy(toMoon).multiplyScalar(20)
  moonLight.target.position.set(0, 0, 0)
  group.add(moonLight, moonLight.target)

  return {
    group,
    mats,
    solids,
    onWall,
    candle,
    soft,
    flame,
    env: {
      background: new THREE.Color('#07060a'),
      fog: new THREE.Fog('#0a0810', 14, 40),
      exposure: 1.0,
      envIntensity: 0.12,
      bloom: { strength: 0.62, radius: 0.5, threshold: 0.84 },
      fov: 62,
    },
    cameraBounds: { minX: x0 + 0.4, maxX: x1 - 0.4, minY: 0.35, maxY: h - 0.4, minZ: z0 + 0.4, maxZ: z1 - 0.4 },
    update(t) {
      dust.update(t)
      for (const c of candles) {
        const k = 1 + Math.sin(t * 11 + c.seed) * 0.06 + Math.sin(t * 23.7 + c.seed * 2) * 0.05
        c.f.scale.set(0.028 * (2 - k), 0.07 * k, 1)
        if (c.pl) c.pl.intensity = c.glow * (0.92 + (k - 1) * 1.4)
      }
      if (fireLight) {
        const k = 0.85 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 13.1 + 1) * 0.05 + Math.sin(t * 2.1) * 0.04
        fireLight.intensity = (light ? 2.2 : 3) * k
        coals.material.emissiveIntensity = 0.75 + (k - 0.85) * 2.5
      }
    },
    dispose() {
      for (const t of textures) t.dispose()
      for (const g of geos) g.dispose()
    },
  }
}
