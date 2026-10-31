// A stage for picture rooms (docs/knowledge/picture-rooms.md): a laboratory of the 1770s by day. A tall
// room with a herringbone parquet floor, plastered walls over a painted wooden dado, a cornice, tall windows
// of small panes and glazed doors standing open onto a stone terrace with a balustrade, in a garden, the
// roofs of a city beyond it under a summer sky. The sun comes from the terrace side (`sun`: the direction
// toward it) and lays the doors' shapes on the floor (shadows on computers). Big surfaces stay mid-toned,
// since pale ones bloom to white. Walking inside the room (x0..x1, z0..z1) and on the terrace
// (`terrace`: { x1, z0, z1 } east of the room, its door openings in `doors`). `mats` are shared plain
// materials for the scene's things.
import * as THREE from 'three'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { box } from '../../../engine/collide.js'

const TAU = Math.PI * 2

/** Plaster: a warm wash, faintly mottled (UVs in metres, 2 m to the tile). */
function plasterTex(light) {
  const s = light ? 128 : 256
  const rnd = random(11)
  return canvasTex(s, s, g => {
    g.fillStyle = '#d8ccb6'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 260; i++) {
      const x = rnd() * s
      const y = rnd() * s
      const r = 2 + rnd() * s * 0.05
      const v = rnd() < 0.5 ? 'rgba(150,130,100,0.035)' : 'rgba(255,248,232,0.04)'
      for (const dx of [-s, 0, s]) {
        for (const dy of [-s, 0, s]) {
          g.fillStyle = v
          g.beginPath()
          g.arc(x + dx, y + dy, r, 0, TAU)
          g.fill()
        }
      }
    }
    const img = g.getImageData(0, 0, s, s)
    for (let i = 0; i < s * s; i++) {
      const n = (rnd() - 0.5) * 7
      img.data[i * 4] += n
      img.data[i * 4 + 1] += n
      img.data[i * 4 + 2] += n
    }
    g.putImageData(img, 0, 0)
  }, { repeat: true })
}

/** Point de Hongrie (chevron) parquet in honey oak: columns 0.3 m wide whose strips run at 45 degrees,
 *  turning at each column, 1.2 m to the tile. */
function parquetTex(light) {
  const s = light ? 256 : 512
  const rnd = random(19)
  const C = s / 4
  const W = s / 9
  const tones = Array.from({ length: 4 * 9 }, () => 0.82 + rnd() * 0.3)
  const seeds = Array.from({ length: 4 * 9 }, () => rnd() * 50)
  return canvasTex(s, s, g => {
    const img = g.createImageData(s, s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const col = Math.floor(x / C)
        const lx = x - col * C
        const sy = y + (col % 2 ? C - lx : lx)
        const row = Math.floor(sy / W)
        const f = sy / W - row
        const k = col * 9 + (((row % 9) + 9) % 9)
        const joint = lx < 1.5 || f < 0.05
        // the grain runs along the strip
        const along = (lx + (col % 2 ? -y : y)) * 0.7
        const grain = 0.06 * Math.sin(f * 37 + seeds[k]) + 0.04 * Math.sin(f * 91 + along * 0.05 + seeds[k] * 2)
        const v = joint ? 0.35 : tones[k] * (1 + grain)
        const i = (y * s + x) * 4
        img.data[i] = 186 * v
        img.data[i + 1] = 130 * v
        img.data[i + 2] = 76 * v
        img.data[i + 3] = 255
      }
    }
    g.putImageData(img, 0, 0)
  }, { repeat: true })
}

/** Pale limestone flags in rows, 3 m to the tile. */
function flagsTex(light) {
  const s = light ? 256 : 512
  const rnd = random(29)
  return canvasTex(s, s, g => {
    g.fillStyle = '#6e665a'
    g.fillRect(0, 0, s, s)
    const rows = 5
    const rh = s / rows
    for (let r = 0; r < rows; r++) {
      let x = rnd() * s * 0.3
      const x0 = x
      while (x < x0 + s - 2) {
        const w = Math.min(x0 + s - x, s * (0.18 + rnd() * 0.14))
        const v = 168 + rnd() * 26
        for (const dx of [0, -s]) {
          g.fillStyle = `rgb(${v + 6},${v},${v - 14})`
          g.fillRect(x + dx + 2, r * rh + 2, w - 4, rh - 4)
          for (let k = 0; k < 10; k++) {
            g.fillStyle = `rgba(${v - 30},${v - 34},${v - 40},0.18)`
            g.beginPath()
            g.arc(x + dx + rnd() * w, r * rh + rnd() * rh, 1 + rnd() * 5, 0, TAU)
            g.fill()
          }
        }
        x += w
      }
    }
  }, { repeat: true })
}

/** Blue-grey slates, 1 m to the tile. */
function slateTex() {
  const rnd = random(37)
  return canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#3c4450'
    g.fillRect(0, 0, w, h)
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 6; c++) {
        const v = 82 + rnd() * 30
        g.fillStyle = `rgb(${v - 8},${v},${v + 14})`
        g.fillRect(c * 22 + (r % 2) * 11 - 11, r * 16 + 1, 20, 14)
      }
    }
  }, { repeat: true })
}

/** The roofs of a city all round: stone fronts, slate mansards, chimneys, a dome and spires (alpha above). */
function skylineTex(light) {
  const w = light ? 1024 : 2048
  const h = 256
  const rnd = random(43)
  return canvasTex(w, h, g => {
    g.clearRect(0, 0, w, h)
    // far trees and roofs, hazy
    g.fillStyle = '#9fb0b4'
    for (let x = 0; x < w; x += 6) {
      const y = h - 70 - Math.sin(x * 0.013) * 8 - rnd() * 10
      g.fillRect(x, y, 6, h - y)
    }
    // a dome and a few spires, far off
    for (const [cx, r] of [[w * 0.22, 26], [w * 0.71, 18]]) {
      g.fillStyle = '#8a9aa2'
      g.fillRect(cx - r * 0.8, h - 110, r * 1.6, 50)
      g.beginPath()
      g.arc(cx, h - 110, r, Math.PI, 0)
      g.fill()
      g.fillRect(cx - 2, h - 110 - r - 16, 4, 16)
    }
    for (const cx of [w * 0.4, w * 0.52, w * 0.9]) {
      g.fillStyle = '#8796a0'
      g.fillRect(cx - 8, h - 120, 16, 60)
      g.beginPath()
      g.moveTo(cx - 9, h - 120)
      g.lineTo(cx, h - 168)
      g.lineTo(cx + 9, h - 120)
      g.fill()
    }
    // near houses: stone fronts, slate mansard roofs, chimneys, rows of windows
    let x = -10
    while (x < w) {
      const bw = 50 + rnd() * 70
      const top = h - 52 - rnd() * 34
      const stone = 196 + rnd() * 24
      g.fillStyle = `rgb(${stone},${stone - 10},${stone - 30})`
      g.fillRect(x, top, bw, h - top)
      g.fillStyle = rnd() < 0.5 ? '#6f7c8c' : '#5f6a78'
      g.beginPath()
      g.moveTo(x - 2, top)
      g.lineTo(x + 6, top - 18)
      g.lineTo(x + bw - 6, top - 18)
      g.lineTo(x + bw + 2, top)
      g.fill()
      g.fillStyle = '#9a7a68'
      for (let k = 0; k < 2; k++) g.fillRect(x + 8 + rnd() * (bw - 20), top - 28, 6, 12)
      g.fillStyle = 'rgba(70,80,96,0.75)'
      for (let wy = top + 8; wy < h - 12; wy += 16) for (let wx = x + 6; wx < x + bw - 8; wx += 12) g.fillRect(wx, wy, 5, 9)
      x += bw + 2
    }
  })
}

/** A wall or a facade: a rectangle (a0..a1 along it, 0..h up) with rectangular holes, UVs in metres. */
function holedWall(a0, a1, h, holes) {
  const shape = new THREE.Shape()
  shape.moveTo(a0, 0)
  shape.lineTo(a1, 0)
  shape.lineTo(a1, h)
  shape.lineTo(a0, h)
  shape.closePath()
  for (const o of holes) {
    const p = new THREE.Path()
    // a hole down to the floor stops a hair above it, so the outline stays one ring
    const y0 = Math.max(o.y0, 0.001)
    p.moveTo(o.a0, y0)
    p.lineTo(o.a0, o.y1)
    p.lineTo(o.a1, o.y1)
    p.lineTo(o.a1, y0)
    p.closePath()
    shape.holes.push(p)
  }
  return new THREE.ShapeGeometry(shape)
}

/**
 * The laboratory. `windows`: [{ side: 'n' | 's' | 'w' | 'e', at, width, sill, height }]; `doors`: glazed
 * doors standing open, [{ side, at, width, height }] (on the terrace's side); `terrace`: { x1, z0, z1 }
 * (east of the room). Returns { group, mats, solids, env, cameraBounds, sunDir, update, dispose }.
 */
export function laboratoryStage({ light = false, x0 = -6.5, x1 = 6.5, z0 = -6.5, z1 = 6.5, h = 5.2, windows = [], doors = [], terrace = null, sun = [0.82, 0.52, -0.24] } = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const sunDir = new THREE.Vector3(...sun).normalize()
  const tex = t => (textures.push(t), t)

  const plaster = tex(plasterTex(light))
  plaster.repeat.set(0.5, 0.5)
  const parquet = tex(parquetTex(light))
  parquet.repeat.set(1 / 1.2, 1 / 1.2)
  const flags = tex(flagsTex(light))
  flags.repeat.set(1 / 3, 1 / 3)
  const slate = tex(slateTex())
  const mats = {
    wall: new THREE.MeshStandardMaterial({ map: plaster, color: '#c9bba2', roughness: 0.95 }),
    facade: new THREE.MeshStandardMaterial({ map: plaster, color: '#cfc2a8', roughness: 0.9 }),
    dado: new THREE.MeshStandardMaterial({ color: '#7f8d7c', roughness: 0.7 }),
    trim: new THREE.MeshStandardMaterial({ color: '#b5ad9c', roughness: 0.75 }),
    floor: new THREE.MeshStandardMaterial({ map: parquet, color: '#b8946c', roughness: 0.55, metalness: 0.05 }),
    stone: new THREE.MeshStandardMaterial({ map: flags, color: '#c4bba9', roughness: 0.9 }),
    balustrade: new THREE.MeshStandardMaterial({ color: '#c3b9a4', roughness: 0.85 }),
    frame: new THREE.MeshStandardMaterial({ color: '#d6d2c6', roughness: 0.6 }),
    glass: new THREE.MeshStandardMaterial({ color: '#cfe2ea', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }),
    wood: new THREE.MeshStandardMaterial({ color: '#7a5233', roughness: 0.6 }),
    darkWood: new THREE.MeshStandardMaterial({ color: '#4a3020', roughness: 0.7 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c49a4c', roughness: 0.3, metalness: 0.9 }),
    iron: new THREE.MeshStandardMaterial({ color: '#45474c', roughness: 0.5, metalness: 0.7 }),
    leaf: new THREE.MeshStandardMaterial({ color: '#4f7a3c', roughness: 0.9 }),
  }
  const ceilingMat = new THREE.MeshStandardMaterial({ color: '#b9b0a0', roughness: 0.95 })
  const roofMat = new THREE.MeshStandardMaterial({ map: slate, color: '#9aa4b2', roughness: 0.7 })

  // ---- the floor and the ceiling ----
  const fw = x1 - x0
  const fd = z1 - z0
  const floorGeo = new THREE.PlaneGeometry(fw, fd)
  {
    const uv = floorGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fw, uv.getY(i) * fd)
  }
  const floor = new THREE.Mesh(floorGeo, mats.floor)
  floor.rotation.x = -Math.PI / 2
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  floor.receiveShadow = true
  group.add(floor)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw + 0.8, fd + 0.8), ceilingMat)
  ceil.rotation.x = Math.PI / 2
  ceil.position.set((x0 + x1) / 2, h, (z0 + z1) / 2)
  ceil.castShadow = true
  group.add(ceil)
  // the roof over it, so the ceiling casts its shade and the terrace sees a slate mansard
  const roof = new THREE.Mesh(new THREE.BoxGeometry(fw + 1.2, 0.5, fd + 1.2), roofMat)
  roof.position.set((x0 + x1) / 2, h + 0.27, (z0 + z1) / 2)
  roof.castShadow = true
  group.add(roof)

  // ---- the walls, with their windows and doors ----
  const sides = {
    n: { a0: x0, a1: x1, place: (m, out = 0) => (m.position.set(0, 0, z0 - out), (m.rotation.y = 0)), map: at => at, inward: new THREE.Vector3(0, 0, 1) },
    s: { a0: -x1, a1: -x0, place: (m, out = 0) => (m.position.set(0, 0, z1 + out), (m.rotation.y = Math.PI)), map: at => -at, inward: new THREE.Vector3(0, 0, -1) },
    w: { a0: -z1, a1: -z0, place: (m, out = 0) => (m.position.set(x0 - out, 0, 0), (m.rotation.y = Math.PI / 2)), map: at => -at, inward: new THREE.Vector3(1, 0, 0) },
    e: { a0: z0, a1: z1, place: (m, out = 0) => (m.position.set(x1 + out, 0, 0), (m.rotation.y = -Math.PI / 2)), map: at => at, inward: new THREE.Vector3(-1, 0, 0) },
  }
  const WALL_T = 0.45
  const openings = [
    ...windows.map(w => ({ kind: 'window', width: 1.5, sill: 0.8, height: 3.0, ...w })),
    ...doors.map(d => ({ kind: 'door', width: 1.9, sill: 0, height: 3.4, ...d })),
  ]
  // a point on a wall: `a` along it, `y` up, `d` metres into the room (negative: outward)
  const onWall = (side, at, y, d = 0) => {
    const s = sides[side]
    const m = new THREE.Object3D()
    s.place(m)
    m.updateMatrix()
    const local = new THREE.Vector3(s.map(at), y, d)
    return { pos: local.applyMatrix4(m.matrix), rot: m.rotation.y }
  }
  for (const [name, s] of Object.entries(sides)) {
    const mine = openings.filter(o => o.side === name)
    const holes = mine.map(o => ({ a0: s.map(o.at) - o.width / 2, a1: s.map(o.at) + o.width / 2, y0: o.sill, y1: o.sill + o.height }))
    const geo = holedWall(s.a0 - 0.01, s.a1 + 0.01, h, holes)
    geos.push(geo)
    const wall = new THREE.Mesh(geo, mats.wall)
    s.place(wall)
    wall.castShadow = wall.receiveShadow = true
    group.add(wall)
    // the facade outside, on a wall with doors (seen from the terrace), the holes mirrored
    if (mine.some(o => o.kind === 'door')) {
      const fgeo = holedWall(-s.a1 - 1.2, -s.a0 + 1.2, h + 0.01, holes.map(o => ({ ...o, a0: -o.a1, a1: -o.a0 })))
      geos.push(fgeo)
      const facade = new THREE.Mesh(fgeo, mats.facade)
      s.place(facade, WALL_T)
      facade.rotation.y += Math.PI
      facade.castShadow = facade.receiveShadow = true
      group.add(facade)
      // a cornice along the top of the facade
      const cor = new THREE.Mesh(new THREE.BoxGeometry(s.a1 - s.a0 + 2.4, 0.3, 0.3), mats.trim)
      s.place(cor, WALL_T + 0.1)
      cor.position.y = h - 0.1
      cor.castShadow = true
      group.add(cor)
    }
    // the dado: painted panelling to 0.95 m, broken by the openings; a skirting and a rail
    const dadoH = 0.95
    const cuts = mine.map(o => [s.map(o.at) - o.width / 2 - 0.1, s.map(o.at) + o.width / 2 + 0.1, o.sill]).sort((p, q) => p[0] - q[0])
    const runs = []
    let from = s.a0
    for (const [c0, c1, sill] of cuts) {
      if (c0 > from) runs.push([from, c0, dadoH])
      // under a window the dado goes up to its sill
      if (sill > 0.2) runs.push([c0, c1, Math.min(dadoH, sill)])
      from = c1
    }
    if (from < s.a1) runs.push([from, s.a1, dadoH])
    for (const [ra, rb, top] of runs) {
      const len = rb - ra
      if (len < 0.05) continue
      const mid = (ra + rb) / 2
      const panel = new THREE.Mesh(new THREE.BoxGeometry(len, top, 0.04), mats.dado)
      const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.07), mats.trim)
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(len, 0.16, 0.06), mats.darkWood)
      for (const [m, y, d] of [[panel, top / 2, 0.02], [rail, top, 0.035], [skirt, 0.08, 0.03]]) {
        const anchor = new THREE.Group()
        s.place(anchor)
        m.position.set(mid, y, d)
        anchor.add(m)
        group.add(anchor)
      }
      // raised panels on the long runs
      const n = Math.floor(len / 0.9)
      if (n >= 1 && top > 0.6) {
        for (let i = 0; i < n; i++) {
          const pw = len / n - 0.18
          const p = new THREE.Mesh(new THREE.BoxGeometry(pw, top - 0.42, 0.02), mats.dado)
          const anchor = new THREE.Group()
          s.place(anchor)
          p.position.set(ra + (i + 0.5) * (len / n), top / 2 + 0.04, 0.05)
          anchor.add(p)
          group.add(anchor)
        }
      }
    }
    // the cornice under the ceiling
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(s.a1 - s.a0, 0.22, 0.18), mats.trim)
    const ca = new THREE.Group()
    s.place(ca)
    cornice.position.set((s.a0 + s.a1) / 2, h - 0.11, 0.09)
    ca.add(cornice)
    group.add(ca)
  }

  // window and door frames: the reveal through the wall's thickness, a frame of small panes, the glass
  const paneFrame = (w, hh, cols, rows, bar = 0.045) => {
    const g = new THREE.Group()
    const outer = [[w, bar * 1.6, 0, hh / 2 - bar * 0.8], [w, bar * 1.6, 0, -hh / 2 + bar * 0.8], [bar * 1.6, hh, -w / 2 + bar * 0.8, 0], [bar * 1.6, hh, w / 2 - bar * 0.8, 0]]
    for (const [bw, bh, x, y] of outer) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.06), mats.frame)
      m.position.set(x, y, 0)
      g.add(m)
    }
    for (let c = 1; c < cols; c++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bar, hh, 0.045), mats.frame)
      m.position.x = -w / 2 + (c * w) / cols
      g.add(m)
    }
    for (let r = 1; r < rows; r++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, bar, 0.045), mats.frame)
      m.position.y = -hh / 2 + (r * hh) / rows
      g.add(m)
    }
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), mats.glass)
    glass.renderOrder = 3
    g.add(glass)
    g.traverse(o => {
      if (o.isMesh && o.material !== mats.glass) o.castShadow = true
    })
    return g
  }
  for (const o of openings) {
    const s = sides[o.side]
    const a = s.map(o.at)
    const anchor = new THREE.Group()
    s.place(anchor)
    group.add(anchor)
    // the reveal: the wall's thickness round the hole
    const depth = WALL_T
    const reveal = [
      [o.width + 0.02, 0.04, a, o.sill + o.height],
      [0.04, o.height, a - o.width / 2, o.sill + o.height / 2],
      [0.04, o.height, a + o.width / 2, o.sill + o.height / 2],
    ]
    if (o.kind === 'window') reveal.push([o.width + 0.02, 0.04, a, o.sill])
    for (const [w, hh, x, y] of reveal) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, depth), mats.trim)
      m.position.set(x, y, -depth / 2)
      m.castShadow = m.receiveShadow = true
      anchor.add(m)
    }
    if (o.kind === 'window') {
      const f = paneFrame(o.width - 0.06, o.height - 0.06, 3, 6)
      f.position.set(a, o.sill + o.height / 2, -depth * 0.55)
      anchor.add(f)
      const sill = new THREE.Mesh(new THREE.BoxGeometry(o.width + 0.2, 0.05, 0.3), mats.trim)
      sill.position.set(a, o.sill - 0.025, 0.08)
      anchor.add(sill)
    } else {
      // two glazed leaves standing open, swung out onto the terrace
      const leafW = o.width / 2 - 0.02
      for (const sgn of [-1, 1]) {
        const hinge = new THREE.Group()
        hinge.position.set(a + sgn * (o.width / 2 - 0.02), 0, -depth - 0.02)
        // swung outward (local -z), each leaf flat against the facade beside its opening
        hinge.rotation.y = -sgn * 1.75
        const f = paneFrame(leafW, o.height - 0.04, 2, 6)
        f.position.set(-sgn * leafW / 2, o.height / 2, 0)
        hinge.add(f)
        anchor.add(hinge)
      }
      const step = new THREE.Mesh(new THREE.BoxGeometry(o.width + 0.1, 0.03, depth + 0.1), mats.trim)
      step.position.set(a, 0.015, -depth / 2)
      step.receiveShadow = true
      anchor.add(step)
    }
  }

  // ---- the terrace: stone flags, a balustrade round three sides, orange trees in tubs ----
  const solids = []
  // the room's walls, with gaps for the doors
  const gaps = doors.map(d => ({ side: d.side, at: d.at, width: (d.width ?? 1.9) - 0.1 }))
  const t = 1
  const wallRuns = (name, a0, a1, make) => {
    const gs = gaps.filter(g => g.side === name).map(g => [g.at - g.width / 2, g.at + g.width / 2]).sort((p, q) => p[0] - q[0])
    let from = a0
    for (const [g0, g1] of gs) {
      if (g0 > from) solids.push(make(from, g0))
      from = Math.max(from, g1)
    }
    if (from < a1) solids.push(make(from, a1))
  }
  wallRuns('n', x0 - t, x1 + t, (a, b) => box((a + b) / 2, z0 - t / 2, b - a, t))
  wallRuns('s', x0 - t, x1 + t, (a, b) => box((a + b) / 2, z1 + t / 2, b - a, t))
  wallRuns('w', z0, z1, (a, b) => box(x0 - t / 2, (a + b) / 2, t, b - a))
  wallRuns('e', z0, z1, (a, b) => box(x1 + WALL_T / 2, (a + b) / 2, WALL_T, b - a))
  if (terrace) {
    const tx0 = x1 + WALL_T
    const { x1: tx1, z0: tz0, z1: tz1 } = terrace
    const tw = tx1 - tx0
    const td = tz1 - tz0
    const tGeo = new THREE.PlaneGeometry(tw, td)
    const uv = tGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * tw, uv.getY(i) * td)
    const tf = new THREE.Mesh(tGeo, mats.stone)
    tf.rotation.x = -Math.PI / 2
    tf.position.set((tx0 + tx1) / 2, 0.002, (tz0 + tz1) / 2)
    tf.receiveShadow = true
    group.add(tf)
    // the balustrade: a plinth, balusters, a rail, and posts at the corners and along it
    const baluster = new THREE.LatheGeometry(
      [[0, 0], [0.06, 0], [0.06, 0.05], [0.04, 0.09], [0.075, 0.3], [0.04, 0.5], [0.032, 0.6], [0.05, 0.64], [0.05, 0.68], [0, 0.68]].map(([r, y]) => new THREE.Vector2(r, y)),
      10,
    )
    geos.push(baluster)
    const runs = [
      [tx0, tz0 + 0.15, tx1 - 0.15, tz0 + 0.15],
      [tx1 - 0.15, tz0 + 0.15, tx1 - 0.15, tz1 - 0.15],
      [tx1 - 0.15, tz1 - 0.15, tx0, tz1 - 0.15],
    ]
    const spots = []
    for (const [ax, az, bx, bz] of runs) {
      const len = Math.hypot(bx - ax, bz - az)
      const n = Math.floor(len / 0.24)
      for (let i = 1; i < n; i++) {
        const k = i / n
        // leave room for the posts
        const along = k * len
        if (along % 2.4 < 0.3 || along % 2.4 > 2.1) continue
        spots.push([ax + (bx - ax) * k, az + (bz - az) * k])
      }
      const rot = Math.atan2(-(bz - az), bx - ax)
      const mid = [(ax + bx) / 2, (az + bz) / 2]
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(len + 0.3, 0.16, 0.34), mats.balustrade)
      plinth.position.set(mid[0], 0.08, mid[1])
      plinth.rotation.y = rot
      const rail = new THREE.Mesh(new THREE.BoxGeometry(len + 0.34, 0.12, 0.36), mats.balustrade)
      rail.position.set(mid[0], 0.9, mid[1])
      rail.rotation.y = rot
      plinth.castShadow = rail.castShadow = true
      plinth.receiveShadow = rail.receiveShadow = true
      group.add(plinth, rail)
      solids.push(box(mid[0], mid[1], Math.abs(bx - ax) + 0.34, Math.abs(bz - az) + 0.34))
      for (let along = 0; along <= len + 0.01; along += 2.4) {
        const k = Math.min(1, along / len)
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), mats.balustrade)
        post.position.set(ax + (bx - ax) * k, 0.5, az + (bz - az) * k)
        post.castShadow = true
        group.add(post)
      }
    }
    const bal = new THREE.InstancedMesh(baluster, mats.balustrade, spots.length)
    const d = new THREE.Object3D()
    spots.forEach(([x, z], i) => {
      d.position.set(x, 0.16, z)
      d.updateMatrix()
      bal.setMatrixAt(i, d.matrix)
    })
    bal.castShadow = true
    group.add(bal)
    // orange trees in green tubs at the terrace's far corners
    const tubMat = new THREE.MeshStandardMaterial({ color: '#4f6e5a', roughness: 0.7 })
    const orangeMat = new THREE.MeshStandardMaterial({ color: '#f08a24', roughness: 0.5 })
    const crownGeo = new THREE.IcosahedronGeometry(0.55, 2)
    for (const [x, z] of [[tx1 - 0.9, tz0 + 0.9], [tx1 - 0.9, tz1 - 0.9]]) {
      const tub = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), tubMat)
      tub.position.set(x, 0.31, z)
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.9, 6), mats.darkWood)
      trunk.position.set(x, 1.0, z)
      const crown = new THREE.Mesh(crownGeo, mats.leaf)
      crown.position.set(x, 1.65, z)
      crown.scale.set(1, 0.9, 1)
      tub.castShadow = trunk.castShadow = crown.castShadow = true
      group.add(tub, trunk, crown)
      const rnd = random(Math.round(x * 10 + z))
      for (let k = 0; k < 9; k++) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), orangeMat)
        const a = rnd() * TAU
        const e = (rnd() - 0.3) * 1.2
        o.position.set(x + Math.cos(a) * Math.cos(e) * 0.52, 1.65 + Math.sin(e) * 0.46, z + Math.sin(a) * Math.cos(e) * 0.52)
        group.add(o)
      }
      solids.push(box(x, z, 0.66, 0.66))
    }
  }

  // ---- outside: a lawn, trees, the city's roofs, the sky with its sun ----
  const lawn = new THREE.Mesh(new THREE.CircleGeometry(70, 48), new THREE.MeshStandardMaterial({ color: '#6c8650', roughness: 1 }))
  lawn.rotation.x = -Math.PI / 2
  lawn.position.set(0, -0.04, 0)
  lawn.receiveShadow = true
  group.add(lawn)
  {
    // a gravel walk below the terrace
    const walk = new THREE.Mesh(new THREE.PlaneGeometry(4, 60), new THREE.MeshStandardMaterial({ color: '#b5a68c', roughness: 1 }))
    walk.rotation.x = -Math.PI / 2
    walk.position.set((terrace?.x1 ?? x1) + 3.2, -0.03, 0)
    group.add(walk)
    const rnd = random(61)
    const n = light ? 26 : 48
    const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), mats.leaf, n)
    const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.25, 1, 6), mats.darkWood, n)
    const d = new THREE.Object3D()
    let k = 0
    while (k < n) {
      const a = rnd() * TAU
      const r = 19 + rnd() * 25
      const x = Math.cos(a) * r + 2
      const z = Math.sin(a) * r
      // the view east from the terrace stays open to the city
      if (x > 12 && Math.abs(z) < 16) continue
      const s = 2 + rnd() * 2.2
      d.position.set(x, 2.2 + s * 0.8, z)
      d.rotation.set(0, rnd() * TAU, 0)
      d.scale.set(s, s * 1.15, s)
      d.updateMatrix()
      crowns.setMatrixAt(k, d.matrix)
      d.position.set(x, 1.4, z)
      d.scale.set(1, 2.8, 1)
      d.updateMatrix()
      trunks.setMatrixAt(k, d.matrix)
      k++
    }
    crowns.castShadow = false
    group.add(crowns, trunks)
  }
  const skyline = tex(skylineTex(light))
  skyline.wrapS = THREE.RepeatWrapping
  skyline.repeat.set(3, 1)
  const ring = new THREE.Mesh(
    new THREE.CylinderGeometry(52, 52, 14, 64, 1, true),
    new THREE.MeshBasicMaterial({ map: skyline, transparent: true, alphaTest: 0.4, side: THREE.BackSide, fog: true, color: '#e8ecee' }),
  )
  ring.position.set(2, 5.5, 0)
  group.add(ring)
  // the sky: a gradient to a hazy horizon and the sun's glow, drawn by a small shader
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uSun: { value: sunDir.clone() } },
    vertexShader: 'varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `varying vec3 vDir; uniform vec3 uSun;
      void main() {
        float y = max(vDir.y, 0.0);
        vec3 zen = vec3(0.30, 0.52, 0.86);
        vec3 hor = vec3(0.80, 0.87, 0.93);
        vec3 c = mix(hor, zen, pow(y, 0.55));
        float s = dot(normalize(vDir), uSun);
        float a = acos(clamp(s, -1.0, 1.0));
        c += vec3(1.0, 0.9, 0.7) * (pow(max(s, 0.0), 24.0) * 0.32 + pow(max(s, 0.0), 4.0) * 0.08);
        c = mix(c, vec3(2.6, 2.2, 1.6), 1.0 - smoothstep(0.03, 0.036, a));
        if (vDir.y < 0.0) c = mix(hor, vec3(0.55, 0.6, 0.55), min(1.0, -vDir.y * 6.0));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  })
  const sky = new THREE.Mesh(new THREE.SphereGeometry(95, 32, 16), skyMat)
  sky.position.set(2, 0, 0)
  sky.renderOrder = -1
  group.add(sky)

  // ---- light: the sky all round, the sun through the doors, a soft fill from the windows ----
  group.add(new THREE.HemisphereLight('#e8f0ff', '#8c7660', light ? 1.35 : 1.05))
  const sunLight = new THREE.DirectionalLight('#fff0d6', light ? 1.4 : 2.4)
  const centre = new THREE.Vector3(((x0 + (terrace?.x1 ?? x1)) / 2), 0, (z0 + z1) / 2)
  sunLight.position.copy(centre).addScaledVector(sunDir, 30)
  sunLight.target.position.copy(centre)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(2048, 2048)
  const reach = Math.max((terrace?.x1 ?? x1) - x0, z1 - z0) / 2 + 3
  Object.assign(sunLight.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach, near: 1, far: 70 })
  sunLight.shadow.bias = -0.0004
  sunLight.shadow.normalBias = 0.03
  group.add(sunLight, sunLight.target)
  // the windows' light on the far side of the room (no shadows)
  const fill = new THREE.DirectionalLight('#dfe8ff', 0.45)
  fill.position.set(x0 - 8, 6, 2)
  fill.target.position.set(0, 0, 0)
  group.add(fill, fill.target)

  // dust drifting in the sunlit air
  const dust = motes({ count: 220, radius: Math.min(fw, fd) / 2, y0: 0.3, y1: h - 0.6, color: '#fff2d6', size: 0.022, opacity: 0.35, speed: 0.05, light })
  dust.group.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
  group.add(dust.group)

  const mx = terrace ? terrace.x1 : x1
  return {
    group,
    mats,
    solids,
    sunDir,
    onWall,
    env: {
      background: new THREE.Color('#bcd2e6'),
      fog: new THREE.Fog('#d4dfe8', 40, 120),
      exposure: 1.0,
      envIntensity: 0.35,
      bloom: { strength: 0.32, radius: 0.5, threshold: 0.93 },
      fov: 62,
      shadows: true,
    },
    cameraBounds: { minX: x0 + 0.35, maxX: mx - 0.35, minY: 0.35, maxY: h - 0.35, minZ: z0 + 0.35, maxZ: z1 - 0.35 },
    update(time) {
      dust.update(time)
    },
    dispose() {
      for (const t2 of textures) t2.dispose()
      for (const g of geos) g.dispose()
    },
  }
}
