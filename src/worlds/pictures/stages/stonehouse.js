// A stage for picture rooms (docs/knowledge/picture-rooms.md): a granite house in the Beira (central Portugal)
// on a frosty winter night, cut open like a doll's house. Its front (z = 0) is cut away, and so is the ground in
// front of it: a trench shows the house in section from the roof to the rock under it. Upstairs, the living room
// with wide chestnut boards, a lamp over the table, a sideboard, a wood stove under the chimney, a cooker with an
// extractor hood, a window with green shutters in the east wall and a trapdoor down to the cellar; below the
// floor, the cellar on its concrete slab (barrels, a shelf of jars, the stairs up to the trapdoor); below the
// slab, the soil, then pink-grey granite with its grains. The visitor stands in a walled yard across the trench
// and crosses a plank bridge into the room. Outside: a crescent moon, frost, dark hills with granite tors.
//
// Walking: the yard (y = 0, z > trench.z1), the bridge, the living room (a floor solid at y = 0); the cellar and
// the trench are seen, not walked. The stage gives `dims` (every measure the scene places things by), `mats`,
// `floor(x, z)`, `solids`, `window.setOpen(k)` and `trapdoor.setOpen(k)` (0 shut .. 1 open), `stove.setLit(k)`,
// `hood.setOn(k)`, `setFrost(k)`, the lamps, and `strataTexture` (soil over granite, metres: u = x / 8,
// v = (y - trench.y) / -trench.y) for anything cut in the ground.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { nightSky } from '../../common/sky.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { lumpGeometry } from './gallery.js'
import { box } from '../../../engine/collide.js'

const TAU = Math.PI * 2

// smooth value noise (0..1), for the hills
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

/** A box whose UVs are in metres of the world (faces continue from one box to the next): w, h, d at x, y, z. */
export function uvBox(w, h, d, x = 0, y = 0, z = 0, s = 1) {
  const g = new THREE.BoxGeometry(w, h, d)
  const p = g.attributes.position
  const n = g.attributes.normal
  const uv = g.attributes.uv
  for (let i = 0; i < p.count; i++) {
    const px = p.getX(i) + x
    const py = p.getY(i) + y
    const pz = p.getZ(i) + z
    if (Math.abs(n.getX(i)) > 0.5) uv.setXY(i, pz / s, py / s)
    else if (Math.abs(n.getY(i)) > 0.5) uv.setXY(i, px / s, pz / s)
    else uv.setXY(i, px / s, py / s)
  }
  g.translate(x, y, z)
  return g
}

/** Draw a round-ish blob (a grain, a pebble) at x, y; wrapped across the edges of a tiling canvas. */
function wrapDraw(g, w, h, x, y, r, draw) {
  for (const dx of [-w, 0, w]) {
    for (const dy of [-h, 0, h]) {
      if (x + dx < -r || x + dx > w + r || y + dy < -r || y + dy > h + r) continue
      draw(x + dx, y + dy)
    }
  }
}
function blob(g, x, y, r, rnd, squash = 1, rot = 0) {
  const n = 6 + Math.floor(rnd() * 3)
  g.beginPath()
  for (let i = 0; i <= n; i++) {
    const a = rot + (i / n) * TAU
    const rr = r * (0.72 + rnd() * 0.4)
    const px = x + Math.cos(a) * rr
    const py = y + Math.sin(a) * rr * squash
    if (i === 0) g.moveTo(px, py)
    else g.lineTo(px, py)
  }
  g.closePath()
  g.fill()
}

const GRAIN = {
  base: '#857a82',
  feld: ['#c08589', '#b3747b', '#cf9894', '#a96a72'],
  quartz: ['#a3a9b6', '#8f95a3', '#b4b8c2'],
  mica: ['#24242b', '#33323a', '#1c1c22'],
}

/** Granite's grains on a canvas region: pink feldspar, grey quartz, black mica flakes (drawn larger than life so
 *  they read at a few metres; real ones are a few millimetres). px: pixels a metre. */
function graniteGrains(g, x0, y0, w, h, px, rnd, { wrap = false, W = 0, H = 0 } = {}) {
  g.fillStyle = GRAIN.base
  g.fillRect(x0, y0, w, h)
  const area = (w / px) * (h / px)
  const layers = [
    ['feld', 210, 0.022, 0.05],
    ['quartz', 190, 0.016, 0.034],
    ['mica', 170, 0.007, 0.016],
  ]
  for (const [kind, per, r0, r1] of layers) {
    const n = Math.round(area * per)
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * w
      const y = y0 + rnd() * h
      const r = (r0 + rnd() * (r1 - r0)) * px
      g.fillStyle = GRAIN[kind][Math.floor(rnd() * GRAIN[kind].length)]
      const rot = rnd() * TAU
      const sq = kind === 'mica' ? 0.45 : 0.7 + rnd() * 0.3
      const draw = (xx, yy) => blob(g, xx, yy, r, rnd, sq, rot)
      if (wrap) wrapDraw(g, W, H, x, y, r, draw)
      else draw(x, y)
    }
  }
  // a few glints of mica
  for (let i = 0; i < area * 30; i++) {
    g.fillStyle = `rgba(230,236,255,${0.25 + rnd() * 0.35})`
    g.fillRect(x0 + rnd() * w, y0 + rnd() * h, 1.5, 1.5)
  }
}

/** Soil over granite, for every face cut in the ground: 8 m across (tiles across), from the trench's floor (v 0)
 *  to the ground (v 1); the rock's top waves about `rock` (a depth below the ground, m). */
export function strataTexture({ depth = 4.4, rock = 3.0, light = false } = {}) {
  const W = light ? 512 : 1024
  const px = W / 8
  const H = Math.round(depth * px)
  const rnd = random(5309)
  return canvasTex(W, H, g => {
    // the boundary of the rock: a gentle wave that tiles across
    const rockY = x => (rock + Math.sin((x / W) * TAU * 2 + 0.7) * 0.16 + Math.sin((x / W) * TAU * 5 + 2.1) * 0.06) * px
    // granite below
    graniteGrains(g, 0, 0, W, H, px, rnd, { wrap: true, W, H: H * 10 })
    // the weathered top of the rock: cracks and loose blocks (the soil is made of it)
    g.strokeStyle = 'rgba(30,24,26,0.55)'
    g.lineWidth = 2.2
    for (let i = 0; i < 26; i++) {
      const x = rnd() * W
      const y = rockY(x) + rnd() * 0.7 * px
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 4; k++) g.lineTo(x + (rnd() - 0.5) * 0.4 * px, y + (k + 1) * 0.12 * px)
      g.stroke()
    }
    // soil above: brown, darker with depth, pebbles of granite and quartz, roots near the top
    g.save()
    g.beginPath()
    g.moveTo(0, 0)
    for (let x = 0; x <= W; x += 8) g.lineTo(x, rockY(x))
    g.lineTo(W, 0)
    g.closePath()
    g.clip()
    const grd = g.createLinearGradient(0, 0, 0, rock * px)
    grd.addColorStop(0, '#5a4231')
    grd.addColorStop(0.15, '#523b2c')
    grd.addColorStop(1, '#3d2c22')
    g.fillStyle = grd
    g.fillRect(0, 0, W, rock * px + 0.3 * px)
    for (let i = 0; i < W * 1.4; i++) {
      const x = rnd() * W
      const y = rnd() * (rock + 0.2) * px
      g.fillStyle = `rgba(${rnd() < 0.5 ? '30,20,14' : '110,84,62'},${0.12 + rnd() * 0.18})`
      g.fillRect(x, y, 2 + rnd() * 3, 2 + rnd() * 3)
    }
    for (let i = 0; i < 220; i++) {
      const x = rnd() * W
      const y = (0.15 + rnd() * (rock - 0.1)) * px
      const r = (0.015 + rnd() * 0.04) * px
      const c = rnd()
      g.fillStyle = c < 0.5 ? '#6e6268' : c < 0.8 ? '#86695c' : '#8f939c'
      wrapDraw(g, W, H * 10, x, y, r, (xx, yy) => blob(g, xx, yy, r, rnd, 0.75, rnd() * 3))
    }
    g.strokeStyle = 'rgba(28,18,12,0.6)'
    g.lineWidth = 1.6
    for (let i = 0; i < 40; i++) {
      let x = rnd() * W
      let y = 0
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 6; k++) {
        x += (rnd() - 0.5) * 0.12 * px
        y += (0.04 + rnd() * 0.08) * px
        g.lineTo(x, y)
      }
      g.stroke()
    }
    g.restore()
    // the trench's floor fades toward the night, as the picture's rock does
    const deep = g.createLinearGradient(0, rock * px, 0, H)
    deep.addColorStop(0, 'rgba(12,16,40,0)')
    deep.addColorStop(1, 'rgba(12,16,40,0.55)')
    g.fillStyle = deep
    g.fillRect(0, rock * px, W, H - rock * px)
    // the grass's edge at the top
    g.fillStyle = '#2f4a2c'
    for (let x = 0; x < W; x += 3) g.fillRect(x, 0, 3, 4 + rnd() * 6)
  }, { repeat: true })
}

/** Bare granite, its grains (2 m to the tile): the trench's floor. */
function graniteTexture(light) {
  const S = light ? 256 : 512
  const rnd = random(77)
  return canvasTex(S, S, g => {
    graniteGrains(g, 0, 0, S, S, S / 2, rnd, { wrap: true, W: S, H: S })
    g.fillStyle = 'rgba(12,16,40,0.35)'
    g.fillRect(0, 0, S, S)
  }, { repeat: true })
}

/** Granite blocks laid in courses with dark mortar (2 m to the tile). */
function masonryTexture(light, seed = 11, tone = 1) {
  const S = light ? 256 : 512
  const px = S / 2
  const rnd = random(seed)
  return canvasTex(S, S, g => {
    g.fillStyle = '#34363e'
    g.fillRect(0, 0, S, S)
    let y = 0
    let row = 0
    const heights = []
    while (y < S - 0.12 * px) {
      const h = (0.22 + rnd() * 0.1) * px
      heights.push([y, h])
      y += h
    }
    // stretch the last course to the tile's edge so the rows tile
    const scale = S / y
    for (const [y0, h0] of heights) {
      const yy = y0 * scale
      const hh = h0 * scale
      let x = -rnd() * 0.4 * px
      while (x < S) {
        const w = (0.32 + rnd() * 0.3) * px
        const base = [108, 113, 124]
        const mixk = rnd()
        const alt = rnd() < 0.3 ? [154, 142, 142] : rnd() < 0.5 ? [138, 143, 154] : [90, 94, 104]
        const c = base.map((v, k) => Math.round((v + (alt[k] - v) * mixk * 0.6) * tone))
        g.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`
        const draw = xx => {
          g.beginPath()
          g.roundRect(xx + 2, yy + 2, w - 4, hh - 4, 5)
          g.fill()
        }
        draw(x)
        if (x + w > S) draw(x - S)
        // the stone's own grains
        for (let k = 0; k < (w * hh) / 90; k++) {
          const gx = x + 4 + rnd() * (w - 8)
          const gy = yy + 4 + rnd() * (hh - 8)
          g.fillStyle = rnd() < 0.4 ? 'rgba(200,140,140,0.35)' : rnd() < 0.5 ? 'rgba(30,30,36,0.5)' : 'rgba(200,205,215,0.35)'
          const gxx = gx >= S ? gx - S : gx
          g.fillRect(gxx, gy, 2 + rnd() * 3, 2 + rnd() * 2)
        }
        x += w
      }
      row++
    }
  }, { repeat: true })
}

/** Wide floorboards (2 m to the tile), boards `bw` m wide running along v. */
function boardsTexture(light, { base = [122, 82, 56], bw = 0.2, seed = 3 } = {}) {
  const S = light ? 256 : 512
  const px = S / 2
  const rnd = random(seed)
  const per = bw * px
  const cols = Math.round(S / per)
  return canvasTex(S, S, g => {
    g.fillStyle = '#20150e'
    g.fillRect(0, 0, S, S)
    for (let c = 0; c < cols; c++) {
      let y = -rnd() * S
      while (y < S) {
        const len = S * (0.4 + rnd() * 0.6)
        const v = 0.8 + rnd() * 0.28
        for (const dy of [0, S]) {
          g.fillStyle = `rgb(${base[0] * v},${base[1] * v},${base[2] * v})`
          g.fillRect(c * per + 1, y - dy + 1, per - 2, len - 2)
          for (let k = 0; k < 6; k++) {
            g.fillStyle = `rgba(${rnd() < 0.5 ? '50,32,20' : '170,128,90'},${0.08 + rnd() * 0.1})`
            g.fillRect(c * per + 2 + rnd() * (per - 5), y - dy + 2, 1 + rnd() * 2, len - 4)
          }
        }
        y += len
      }
    }
  }, { repeat: true })
}

/** Lime plaster, warm and a little uneven (2 m to the tile). */
function plasterTexture(light) {
  const S = light ? 128 : 256
  const rnd = random(21)
  return canvasTex(S, S, g => {
    g.fillStyle = '#c9b99a'
    g.fillRect(0, 0, S, S)
    for (let i = 0; i < 1400; i++) {
      const v = rnd()
      g.fillStyle = v < 0.5 ? `rgba(150,128,96,${0.025 + rnd() * 0.04})` : `rgba(240,230,210,${0.03 + rnd() * 0.05})`
      const r = 2 + rnd() * 7
      g.beginPath()
      g.arc(rnd() * S, rnd() * S, r, 0, TAU)
      g.fill()
    }
  }, { repeat: true })
}

/** Terracotta roof tiles in rows down the slope (1 m to the tile). */
function tilesTexture(light) {
  const S = light ? 128 : 256
  const rnd = random(31)
  return canvasTex(S, S, g => {
    g.fillStyle = '#6e2c20'
    g.fillRect(0, 0, S, S)
    const rows = 5
    const cols = 6
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + (r % 2 ? 0.5 : 0)) * (S / cols)
        const y = r * (S / rows)
        const v = 0.85 + rnd() * 0.25
        const grd = g.createLinearGradient(x, 0, x + S / cols, 0)
        grd.addColorStop(0, `rgb(${120 * v},${48 * v},${34 * v})`)
        grd.addColorStop(0.5, `rgb(${196 * v},${98 * v},${72 * v})`)
        grd.addColorStop(1, `rgb(${120 * v},${48 * v},${34 * v})`)
        g.fillStyle = grd
        for (const dx of [0, -S]) {
          g.beginPath()
          g.roundRect(x + dx + 1, y + 1, S / cols - 2, S / rows + 3, 6)
          g.fill()
        }
      }
    }
  }, { repeat: true })
}

/** Concrete: grey with specks (2 m to the tile). */
function concreteTexture(light) {
  const S = light ? 128 : 256
  const rnd = random(41)
  return canvasTex(S, S, g => {
    g.fillStyle = '#76726f'
    g.fillRect(0, 0, S, S)
    for (let i = 0; i < 2500; i++) {
      g.fillStyle = rnd() < 0.5 ? `rgba(40,38,38,${0.1 + rnd() * 0.2})` : `rgba(190,186,180,${0.1 + rnd() * 0.2})`
      g.fillRect(rnd() * S, rnd() * S, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** Winter grass, dark and tufted (4 m to the tile), and frost to lay over it. */
function grassTexture(light) {
  const S = light ? 256 : 512
  const rnd = random(51)
  return canvasTex(S, S, g => {
    g.fillStyle = '#34482f'
    g.fillRect(0, 0, S, S)
    for (let i = 0; i < S * 14; i++) {
      const v = rnd()
      g.fillStyle = v < 0.4 ? `rgba(26,38,22,${0.3 + rnd() * 0.3})` : v < 0.8 ? `rgba(76,100,62,${0.25 + rnd() * 0.3})` : `rgba(110,104,70,${0.2 + rnd() * 0.2})`
      g.fillRect(rnd() * S, rnd() * S, 1 + rnd() * 2, 2 + rnd() * 5)
    }
  }, { repeat: true })
}
function frostTexture(light) {
  const S = light ? 256 : 512
  const rnd = random(61)
  return canvasTex(S, S, g => {
    g.clearRect(0, 0, S, S)
    // a fine white rime on the blades, thicker in some tufts than others
    for (let i = 0; i < S * 26; i++) {
      const x = rnd() * S
      const y = rnd() * S
      const k = 0.5 + 0.5 * Math.sin(x * 0.05 + Math.sin(y * 0.031) * 3) * Math.sin(y * 0.043 + 1.3)
      g.fillStyle = `rgba(196,210,228,${(0.12 + rnd() * 0.3) * (0.4 + 0.6 * k)})`
      g.fillRect(x, y, 1, 1 + rnd() * 3)
    }
  }, { repeat: true })
}

/** The crescent moon and its halo, as a sprite texture. */
function moonTexture() {
  return canvasTex(256, 256, g => {
    const grd = g.createRadialGradient(128, 128, 20, 128, 128, 128)
    grd.addColorStop(0, 'rgba(255,240,200,0.35)')
    grd.addColorStop(0.4, 'rgba(255,240,200,0.12)')
    grd.addColorStop(1, 'rgba(255,240,200,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 256, 256)
    g.save()
    g.beginPath()
    g.arc(128, 128, 42, 0, TAU)
    g.clip()
    g.fillStyle = '#f4e4b4'
    g.fillRect(0, 0, 256, 256)
    // the dark part of the disc, faintly lit by the Earth
    g.fillStyle = '#2a2f52'
    g.beginPath()
    g.arc(146, 116, 40, 0, TAU)
    g.fill()
    g.restore()
  })
}

/**
 * The house and its yard. All measures in metres; the house's front (z = 0) is the cut. Options: light (phones),
 * frost (0..1 at the start).
 */
export function stonehouseStage({ light = false, frost = 1 } = {}) {
  const group = new THREE.Group()
  const own = []
  const keep = o => (own.push(o), o)
  const solids = []
  const rnd = random(1987)

  // ---- measures ----
  const D = {
    IX: 3.6, // the room's inner half width
    T: 0.55, // the walls' thickness
    OX: 4.15, // outer half width
    ZB: -4.8, // the inner face of the back wall
    ZBO: -5.35, // its outer face
    H: 2.6, // the room's ceiling
    CEIL: 2.72, // the attic's floor
    EAVE: 2.85, // the walls' top
    RIDGE: 4.75,
    OVER: 0.4, // the roof's overhang
    FLOOR_B: -0.22, // the underside of the room's floor
    SLAB: -2.0, // the cellar's floor (the slab's top): a low cellar, as old Beira houses have
    SLAB_B: -2.14,
    FOOT: -2.35, // the walls' footings
    ROCK: -2.65, // the top of the granite
    TRENCH: { x0: -6.6, x1: 6.6, z1: 3.4, y: -3.7 },
    WIN: { z0: -1.4, z1: -0.5, y0: 1.0, y1: 2.05 },
    HOLE: { x0: -3.55, x1: -2.75, z0: -4.75, z1: -3.35 },
    BRIDGE: { x0: 2.4, x1: 3.5 },
    YARD: { x0: -9.3, x1: 9.3, z1: 13.0 },
    STOVE: { x: 1.65, z: -4.3 },
    COOKER: { x: 3.12, z: -4.47 },
    SIDEBOARD: { x0: -3.6, x1: -3.1, z0: -2.75, z1: -1.15, h: 0.88 },
    TABLE: { x: 0, z: -2.55, w: 1.7, d: 1.0, h: 0.78 },
    LAMP: { x: 0, y: 1.92, z: -2.55 },
  }
  const { IX, OX, ZB, ZBO, H, CEIL, EAVE, RIDGE, OVER, FLOOR_B, SLAB, SLAB_B, FOOT, ROCK, TRENCH, WIN, HOLE, BRIDGE, YARD } = D
  const ROOF_K = (RIDGE - EAVE) / OX // the roof's slope (its underside passes over the walls' top)
  D.roofAt = x => RIDGE - Math.abs(x) * ROOF_K // the underside of the roof above x

  // ---- materials (few kinds, so the room compiles few shaders) ----
  const tex = t => keep(t)
  const T = {
    strata: tex(strataTexture({ depth: -TRENCH.y, rock: -ROCK, light })),
    granite: tex(graniteTexture(light)),
    masonry: tex(masonryTexture(light)),
    masonryDark: tex(masonryTexture(light, 17, 0.8)),
    boards: tex(boardsTexture(light)),
    ceiling: tex(boardsTexture(light, { base: [92, 62, 42], bw: 0.16, seed: 9 })),
    plaster: tex(plasterTexture(light)),
    tiles: tex(tilesTexture(light)),
    concrete: tex(concreteTexture(light)),
    grass: tex(grassTexture(light)),
    frost: tex(frostTexture(light)),
  }
  T.strata.wrapT = THREE.ClampToEdgeWrapping
  const std = (o = {}) => keep(new THREE.MeshStandardMaterial({ roughness: 0.85, ...o }))
  const mats = {
    strata: std({ map: T.strata, emissiveMap: T.strata, emissive: '#ffffff', emissiveIntensity: 0.16, roughness: 0.95 }),
    granite: std({ map: T.granite, emissiveMap: T.granite, emissive: '#ffffff', emissiveIntensity: 0.12, roughness: 0.95 }),
    masonry: std({ map: T.masonry, roughness: 0.9, emissiveMap: T.masonry, emissive: '#ffffff', emissiveIntensity: 0.05 }),
    cellarWall: std({ map: T.masonryDark, roughness: 0.95, emissiveMap: T.masonryDark, emissive: '#ffffff', emissiveIntensity: 0.06 }),
    plaster: std({ map: T.plaster, roughness: 0.95 }),
    boards: std({ map: T.boards, roughness: 0.7 }),
    ceiling: std({ map: T.ceiling, roughness: 0.85 }),
    tiles: std({ map: T.tiles, roughness: 0.8, emissiveMap: T.tiles, emissive: '#ffffff', emissiveIntensity: 0.06 }),
    concrete: std({ map: T.concrete, roughness: 0.9, emissiveMap: T.concrete, emissive: '#ffffff', emissiveIntensity: 0.05 }),
    grass: std({ map: T.grass, roughness: 1 }),
    wood: std({ color: '#7a5238', roughness: 0.7 }),
    woodDark: std({ color: '#4e3424', roughness: 0.75 }),
    beam: std({ color: '#3e291c', roughness: 0.8 }),
    iron: std({ color: '#26262b', roughness: 0.5, metalness: 0.6 }),
    enamel: std({ color: '#e9e4d8', roughness: 0.35 }),
    steel: std({ color: '#aab2bc', roughness: 0.35, metalness: 0.7 }),
    green: std({ color: '#4a7a5a', roughness: 0.6 }),
    frame: std({ color: '#ece7dc', roughness: 0.5 }),
    stone: std({ color: '#7b7f8a', roughness: 0.9 }),
    glass: keep(new THREE.MeshStandardMaterial({ color: '#bcd6ef', transparent: true, opacity: light ? 0.3 : 0.22, roughness: 0.05, metalness: 0.1, depthWrite: false, side: THREE.DoubleSide })),
  }
  // static geometry gathered by material and merged (few draw calls)
  const bins = new Map()
  const put = (mat, geo) => {
    if (!bins.has(mat)) bins.set(mat, [])
    bins.get(mat).push(geo)
  }
  const flush = () => {
    for (const [mat, geos] of bins) {
      const merged = mergeGeometries(geos.map(g => (g.index ? g.toNonIndexed() : g)))
      geos.forEach(g => g.dispose())
      group.add(new THREE.Mesh(keep(merged), mat))
    }
    bins.clear()
  }
  const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(keep(geo), mat)
    m.position.set(x, y, z)
    return m
  }

  // ---- the sky: stars, a crescent moon over the hills, its cold light ----
  const sky = nightSky({ radius: 420, stars: light ? 900 : 2200, top: '#03050f', mid: '#0a1030', horizon: '#1d2550' })
  group.add(sky)
  own.push({ dispose: () => sky.traverse(o => { o.geometry?.dispose(); o.material?.dispose() }) })
  const moonDir = new THREE.Vector3(0.5, 0.25, -0.83).normalize()
  const moon = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: tex(moonTexture()), transparent: true, depthWrite: false, fog: false, toneMapped: false })))
  moon.position.copy(moonDir).multiplyScalar(300)
  moon.scale.setScalar(60)
  moon.renderOrder = -9
  moon.raycast = () => {}
  group.add(moon)
  const moonLight = new THREE.DirectionalLight('#aebcf2', light ? 0.5 : 0.55)
  moonLight.position.copy(moonDir).multiplyScalar(40)
  group.add(moonLight)
  const fill = new THREE.HemisphereLight('#4a5a96', '#1c140e', light ? 0.75 : 0.62)
  group.add(fill)

  // ---- the land: the yard and the fields round the house, the hills beyond ----
  // the near ground is flat (the yard, the fields round the house); the hills rise beyond 70 m
  const groundY = () => 0
  {
    // the near ground: a big sheet with a hole for the house and the trench
    const shape = new THREE.Shape()
    shape.moveTo(-60, 60)
    shape.lineTo(60, 60)
    shape.lineTo(60, -60)
    shape.lineTo(-60, -60)
    shape.lineTo(-60, 60)
    const hole = new THREE.Path()
    // in the shape's own (x, -z): wound against the outline
    const pts = [[TRENCH.x0, TRENCH.z1], [TRENCH.x0, 0], [-OX, 0], [-OX, ZBO], [OX, ZBO], [OX, 0], [TRENCH.x1, 0], [TRENCH.x1, TRENCH.z1]]
    hole.moveTo(pts[0][0], -pts[0][1])
    for (const [x, z] of pts.slice(1)) hole.lineTo(x, -z)
    hole.lineTo(pts[0][0], -pts[0][1])
    shape.holes.push(hole)
    const geo = new THREE.ShapeGeometry(shape, 1)
    geo.rotateX(-Math.PI / 2)
    // more vertices far out so the ground can roll: a plain sheet is flat; the rolling ring goes beyond
    const uv = geo.attributes.uv
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 4, p.getZ(i) / 4)
    const g = new THREE.Mesh(keep(geo), mats.grass)
    group.add(g)
    // frost over it, fading as the night warms
    const frostMat = keep(new THREE.MeshStandardMaterial({ map: T.frost, transparent: true, opacity: frost, depthWrite: false, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -1 }))
    const f = new THREE.Mesh(geo, frostMat)
    f.position.y = 0.005
    group.add(f)
    D.frostMat = frostMat
  }
  {
    // a rolling ring of fields from 60 m out, then the hills (dark blue, as in the picture)
    const rings = []
    for (let r = 55; r < 340; r += r < 120 ? 6 : 16) rings.push(r)
    const SEG = light ? 72 : 120
    const pos = []
    const col = []
    const idx = []
    const cNear = new THREE.Color('#1f2c22')
    const cHill = new THREE.Color('#1c2550')
    const cTop = new THREE.Color('#2a3566')
    const c = new THREE.Color()
    for (let i = 0; i < rings.length; i++) {
      for (let j = 0; j <= SEG; j++) {
        const a = (j / SEG) * TAU
        const x = Math.cos(a) * rings[i]
        const z = Math.sin(a) * rings[i]
        const rise = Math.min(1, Math.max(0, (rings[i] - 70) / 160))
        const n = noise(Math.cos(a) * 3 + 5, Math.sin(a) * 3 + 2) * 0.6 + noise(Math.cos(a) * 9, Math.sin(a) * 9) * 0.4
        // higher behind the house (-z) than in front
        const back = 0.55 + 0.45 * Math.max(0, -Math.sin(a))
        const y = (rings[i] < 70 ? 0 : (rings[i] - 70) * 0.02) + rise * rise * (18 + 34 * n) * back - 0.4
        pos.push(x, y, z)
        c.copy(cNear).lerp(cHill, Math.min(1, rise * 2.2)).lerp(cTop, Math.max(0, (y - 20) / 30))
        col.push(c.r, c.g, c.b)
      }
    }
    const Wn = SEG + 1
    for (let i = 0; i < rings.length - 1; i++) {
      for (let j = 0; j < SEG; j++) {
        const a = i * Wn + j
        const b = (i + 1) * Wn + j
        idx.push(a, a + 1, b, b, a + 1, b + 1)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const hills = new THREE.Mesh(keep(geo), std({ vertexColors: true, roughness: 1 }))
    hills.raycast = () => {}
    group.add(hills)
    // the gap between the near sheet's edge (60 m) and the ring (55 m) is covered by the sheet: the ring starts
    // under it and rises beyond
  }
  // granite tors and boulders: some in the fields, a few in the yard's corners
  {
    const lump = keep(lumpGeometry(7, { detail: light ? 1 : 2, bump: 0.3, squash: 0.7 }))
    const boulderMat = std({ color: '#7d7a84', roughness: 0.95, flatShading: true, emissive: '#1a1820', emissiveIntensity: 0.4 })
    const spots = [
      [-8.1, 4.4, 0.75], [8.2, 13.2, 0.6], [-8.4, 13.0, 0.5], [7.9, 4.3, 0.55],
      [-14, -4, 1.4], [15, -8, 1.8], [-18, 14, 1.2], [20, 18, 1.5], [-11, -16, 2.2], [12, -20, 2.6],
      [-30, -34, 4], [34, -40, 5], [-46, -20, 3.5], [44, 8, 3], [-40, 30, 3], [26, 40, 2.5],
    ]
    const im = new THREE.InstancedMesh(lump, boulderMat, spots.length * 2)
    const o = new THREE.Object3D()
    let n = 0
    for (const [x, z, s] of spots) {
      for (let k = 0; k < 2; k++) {
        o.position.set(x + (k ? s * 0.9 : 0), groundY(x, z) + s * (k ? 0.2 : 0.35), z + (k ? s * 0.4 : 0))
        o.rotation.set(rnd() * 0.4, rnd() * TAU, rnd() * 0.3)
        o.scale.set(s * (k ? 0.6 : 1), s * (k ? 0.5 : 0.75), s * (k ? 0.55 : 0.85))
        o.updateMatrix()
        im.setMatrixAt(n++, o.matrix)
      }
    }
    im.raycast = () => {}
    group.add(im)
    for (const [x, z, s] of spots.slice(0, 4)) solids.push(box(x, z, s * 2.4, s * 2.2))
  }

  // ---- the trench: soil over granite on every face cut in the ground ----
  const TD = -TRENCH.y
  /** A vertical face cut in the ground, at a constant z (facing +z or -z) or x; a..b along it, from y0 to y1. */
  const faceZ = (a, b, z, y0, y1, facing = 1) => {
    const g = new THREE.PlaneGeometry(b - a, y1 - y0)
    if (facing < 0) g.rotateY(Math.PI)
    g.translate((a + b) / 2, (y0 + y1) / 2, z)
    const p = g.attributes.position
    const uv = g.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 8, (p.getY(i) + TD) / TD)
    put(mats.strata, g)
  }
  const faceX = (a, b, x, y0, y1, facing = 1) => {
    const g = new THREE.PlaneGeometry(b - a, y1 - y0)
    g.rotateY(facing > 0 ? Math.PI / 2 : -Math.PI / 2)
    g.translate(x, (y0 + y1) / 2, (a + b) / 2)
    const p = g.attributes.position
    const uv = g.attributes.uv
    // continuing the back face's pattern round the corner (the rock's top meets there)
    for (let i = 0; i < p.count; i++) uv.setXY(i, (x + Math.sign(x) * p.getZ(i)) / 8, (p.getY(i) + TD) / TD)
    put(mats.strata, g)
  }
  // the back face, the house's section: under everything, then beside the house, then under the slab
  faceZ(TRENCH.x0, TRENCH.x1, 0, TRENCH.y, FOOT)
  faceZ(TRENCH.x0, -OX, 0, FOOT, 0)
  faceZ(OX, TRENCH.x1, 0, FOOT, 0)
  faceZ(-IX, IX, 0, FOOT, SLAB_B)
  // the front face (under the yard's edge) and the two ends
  faceZ(TRENCH.x0, TRENCH.x1, TRENCH.z1, TRENCH.y, 0, -1)
  faceX(0, TRENCH.z1, TRENCH.x0, TRENCH.y, 0, 1)
  faceX(0, TRENCH.z1, TRENCH.x1, TRENCH.y, 0, -1)
  {
    // the trench's floor: broken granite
    const g = new THREE.PlaneGeometry(TRENCH.x1 - TRENCH.x0, TRENCH.z1)
    g.rotateX(-Math.PI / 2)
    g.translate(0, TRENCH.y, TRENCH.z1 / 2)
    const p = g.attributes.position
    const uv = g.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 2, p.getZ(i) / 2)
    put(mats.granite, g)
  }
  // the hidden soil under the house (seen only through gaps): the ground at the walls' footing
  {
    const g = new THREE.PlaneGeometry(2 * OX, -ZBO)
    g.rotateX(-Math.PI / 2)
    g.translate(0, SLAB_B - 0.01, ZBO / 2)
    put(mats.strata, g)
  }

  // ---- the house: granite walls cut at z = 0 ----
  // left wall, back wall (and its gable), right wall with the window
  put(mats.masonry, uvBox(OX - IX, EAVE - FOOT, -ZBO, -(OX + IX) / 2, (EAVE + FOOT) / 2, ZBO / 2))
  put(mats.masonry, uvBox(2 * OX, EAVE - FOOT, ZB - ZBO, 0, (EAVE + FOOT) / 2, (ZB + ZBO) / 2))
  {
    const x = (OX + IX) / 2
    const w = OX - IX
    put(mats.masonry, uvBox(w, WIN.y0 - FOOT, -ZBO, x, (WIN.y0 + FOOT) / 2, ZBO / 2))
    put(mats.masonry, uvBox(w, EAVE - WIN.y1, -ZBO, x, (EAVE + WIN.y1) / 2, ZBO / 2))
    put(mats.masonry, uvBox(w, WIN.y1 - WIN.y0, -WIN.z1, x, (WIN.y0 + WIN.y1) / 2, WIN.z1 / 2))
    put(mats.masonry, uvBox(w, WIN.y1 - WIN.y0, WIN.z0 - ZBO, x, (WIN.y0 + WIN.y1) / 2, (WIN.z0 + ZBO) / 2))
    // the sill
    put(mats.stone, uvBox(w + 0.12, 0.06, WIN.z1 - WIN.z0 + 0.1, x + 0.03, WIN.y0 + 0.03, (WIN.z0 + WIN.z1) / 2))
  }
  {
    // the gable at the back, up to the ridge
    const s = new THREE.Shape()
    s.moveTo(-OX, EAVE)
    s.lineTo(OX, EAVE)
    s.lineTo(0, D.roofAt(0))
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: ZB - ZBO, bevelEnabled: false })
    g.translate(0, 0, ZBO)
    const p = g.attributes.position
    const uv = g.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 2, p.getY(i) / 2)
    put(mats.masonry, g)
  }
  solids.push(box(-(OX + IX) / 2, ZBO / 2, OX - IX, -ZBO), box((OX + IX) / 2, ZBO / 2, OX - IX, -ZBO), box(0, (ZB + ZBO) / 2, 2 * OX, ZB - ZBO))
  // the room's inner faces, plastered and lime-washed; the cellar's stay bare stone
  {
    const pl = (w, h, x, y, z, ry) => {
      const g = new THREE.PlaneGeometry(w, h)
      g.rotateY(ry)
      g.translate(x, y, z)
      const p = g.attributes.position
      const uv = g.attributes.uv
      for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + p.getZ(i)) / 2, p.getY(i) / 2)
      put(mats.plaster, g)
    }
    pl(2 * IX, H, 0, H / 2, ZB + 0.01, 0)
    pl(-ZB, H, -IX + 0.01, H / 2, ZB / 2, Math.PI / 2)
    // the right wall round the window
    pl(-WIN.z1, H, IX - 0.01, H / 2, WIN.z1 / 2, -Math.PI / 2)
    pl(WIN.z0 - ZB, H, IX - 0.01, H / 2, (WIN.z0 + ZB) / 2, -Math.PI / 2)
    pl(WIN.z1 - WIN.z0, WIN.y0, IX - 0.01, WIN.y0 / 2, (WIN.z0 + WIN.z1) / 2, -Math.PI / 2)
    pl(WIN.z1 - WIN.z0, H - WIN.y1, IX - 0.01, (H + WIN.y1) / 2, (WIN.z0 + WIN.z1) / 2, -Math.PI / 2)
  }
  // the inner faces of the window's reveal are the masonry's own; a skirting board along the room
  put(mats.woodDark, uvBox(2 * IX, 0.12, 0.03, 0, 0.06, ZB + 0.025))
  put(mats.woodDark, uvBox(0.03, 0.12, -ZB, -IX + 0.025, 0.06, ZB / 2))

  // the room's floor: chestnut boards on joists (its cut edge shows them), a hole for the trapdoor
  {
    const th = -FLOOR_B
    const yc = FLOOR_B / 2
    const part = (x0, x1, z0, z1) => {
      put(mats.boards, uvBox(x1 - x0, th, z1 - z0, (x0 + x1) / 2, yc, (z0 + z1) / 2))
      solids.push(box((x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0, { y0: FLOOR_B, y1: 0 }))
    }
    part(HOLE.x1, IX, ZB, 0)
    part(-IX, HOLE.x1, HOLE.z1, 0)
    part(-IX, HOLE.x0, HOLE.z0, HOLE.z1)
    part(-IX, HOLE.x1, ZB, HOLE.z0)
    // the joists under it, seen in the cut
    for (let x = -IX + 0.3; x < IX; x += 0.6) put(mats.beam, uvBox(0.1, 0.16, -ZB, x, FLOOR_B - 0.08, ZB / 2))
  }
  // the ceiling: boards on beams, the attic above
  put(mats.ceiling, uvBox(2 * IX, CEIL - H, -ZB, 0, (H + CEIL) / 2, ZB / 2))
  solids.push(box(0, ZB / 2, 2 * IX, -ZB, { y0: H, y1: CEIL }))
  for (let z = -0.35; z > ZB; z -= 1.1) put(mats.beam, uvBox(2 * IX, 0.16, 0.14, 0, H - 0.08, z))
  // the roof: two slopes of terracotta tiles on boards, cut at z = 0, overhanging the walls and the gable
  {
    const len = Math.hypot(OX + OVER, (OX + OVER) * ROOF_K)
    const ang = Math.atan(ROOF_K)
    const th = 0.2
    const zLen = -ZBO + 0.45
    for (const side of [-1, 1]) {
      // its underside runs from the eave to the ridge
      const x0 = side * (OX + OVER)
      const y0 = D.roofAt(x0)
      const cx = x0 / 2
      const cy = (y0 + RIDGE) / 2
      // the slope's upward normal
      const nx = side * Math.sin(ang)
      const ny = Math.cos(ang)
      const g = new THREE.BoxGeometry(len + 0.05, th, zLen)
      // UVs in metres along the slope (tiles) and z
      const p = g.attributes.position
      const n = g.attributes.normal
      const uv = g.attributes.uv
      for (let i = 0; i < p.count; i++) {
        if (Math.abs(n.getY(i)) > 0.5) uv.setXY(i, p.getZ(i), p.getX(i))
        else uv.setXY(i, p.getX(i) * 0.1, p.getY(i) * 0.1 + 0.05)
      }
      g.rotateZ(side * -ang)
      g.translate(cx + nx * th / 2, cy + ny * th / 2, -zLen / 2)
      put(mats.tiles, g)
      // the boards under the tiles, as a darker skin
      const under = new THREE.PlaneGeometry(len, zLen)
      under.rotateX(Math.PI / 2)
      under.rotateZ(side * -ang)
      under.translate(cx - nx * 0.005, cy - ny * 0.005, -zLen / 2)
      put(mats.ceiling, under)
    }
    // the ridge's tiles: a half round along the top
    const ridge = new THREE.CylinderGeometry(0.13, 0.13, zLen, 12, 1, false, Math.PI / 2, Math.PI)
    ridge.rotateX(Math.PI / 2)
    ridge.translate(0, RIDGE + 0.18, -zLen / 2)
    put(mats.tiles, ridge)
    // purlins and a ridge beam under the roof, and rafters going back
    for (const x of [-2.2, 0, 2.2]) put(mats.beam, uvBox(0.16, 0.16, -ZBO, x, D.roofAt(x) - 0.08, ZBO / 2))
    for (let z = -0.2; z > ZB; z -= 0.9) {
      for (const side of [-1, 1]) {
        const g = new THREE.BoxGeometry(OX, 0.1, 0.07)
        g.rotateZ(side * -Math.atan(ROOF_K))
        g.translate(side * OX / 2, (EAVE + RIDGE) / 2 - 0.06, z)
        put(mats.beam, g)
      }
    }
  }
  // the chimney over the stove, through the attic and the roof
  {
    const { x, z } = D.STOVE
    const top = RIDGE + 1.0
    put(mats.masonry, uvBox(0.6, top - CEIL, 0.6, x, (CEIL + top) / 2, z - 0.05))
    put(mats.stone, uvBox(0.72, 0.08, 0.72, x, top + 0.04, z - 0.05))
    D.chimneyTop = new THREE.Vector3(x, top + 0.1, z - 0.05)
  }

  // the cellar: its slab (the scene cuts the cracks), stone walls (the masonry's darker face inside)
  put(mats.concrete, uvBox(2 * IX, SLAB - SLAB_B, -ZB, 0, (SLAB + SLAB_B) / 2, ZB / 2))
  {
    const inner = (w, h, x, y, z, ry) => {
      const g = new THREE.PlaneGeometry(w, h)
      g.rotateY(ry)
      g.translate(x, y, z)
      const p = g.attributes.position
      const uv = g.attributes.uv
      for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + p.getZ(i)) / 2, p.getY(i) / 2)
      put(mats.cellarWall, g)
    }
    const ch = FLOOR_B - SLAB
    inner(2 * IX, ch, 0, (SLAB + FLOOR_B) / 2, ZB + 0.01, 0)
    inner(-ZB, ch, -IX + 0.01, (SLAB + FLOOR_B) / 2, ZB / 2, Math.PI / 2)
    inner(-ZB, ch, IX - 0.01, (SLAB + FLOOR_B) / 2, ZB / 2, -Math.PI / 2)
  }
  // the cellar's stairs, along the left wall up to the trapdoor
  {
    const steps = 10
    const rise = (0 - SLAB) / steps
    const z0 = -2.0
    const run = (HOLE.z0 + 0.05 - z0) / steps
    const w = HOLE.x1 - HOLE.x0
    const cx = (HOLE.x0 + HOLE.x1) / 2
    for (let i = 0; i < steps; i++) {
      const y = SLAB + rise * (i + 1)
      const z = z0 + run * (i + 0.5)
      put(mats.wood, uvBox(w, 0.05, -run + 0.04, cx, y - 0.025, z))
    }
    // the open side's stringer
    const len = Math.hypot(0 - SLAB, HOLE.z0 - z0)
    const g = new THREE.BoxGeometry(0.06, 0.22, len)
    g.rotateX(Math.atan2(0 - SLAB, -(HOLE.z0 - z0)))
    g.translate(HOLE.x1 + 0.03, (SLAB + 0) / 2 - 0.06, (z0 + HOLE.z0) / 2)
    put(mats.woodDark, g)
  }
  // barrels, a shelf of jars, a crate
  {
    const barrelGeo = keep(new THREE.CylinderGeometry(0.29, 0.29, 0.78, 20))
    {
      const p = barrelGeo.attributes.position
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i) / 0.39
        const k = 1 + 0.12 * (1 - y * y)
        p.setX(i, p.getX(i) * k)
        p.setZ(i, p.getZ(i) * k)
      }
      barrelGeo.computeVertexNormals()
    }
    const hoop = keep(new THREE.TorusGeometry(0.315, 0.012, 6, 24))
    for (const [x, z] of [[1.9, -4.2], [2.72, -4.05]]) {
      group.add(mesh(barrelGeo, mats.wood, x, SLAB + 0.39, z))
      for (const y of [0.16, 0.62]) {
        const h = mesh(hoop, mats.iron, x, SLAB + y, z)
        h.rotation.x = Math.PI / 2
        group.add(h)
      }
    }
    // (low on the back wall, where the cut lets it be seen from the yard)
    const SH = [SLAB + 0.5, SLAB + 0.92]
    for (const y of SH) put(mats.woodDark, uvBox(1.7, 0.04, 0.3, -0.2, y, ZB + 0.16))
    for (const x of [-1.0, 0.6]) put(mats.woodDark, uvBox(0.04, 0.6, 0.3, x, SLAB + 0.3 + 0.25, ZB + 0.16))
    const jarGeo = keep(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 12))
    const jarMats = ['#c87a3a', '#8ab04a', '#c84a3a', '#c8a43a', '#a85a8a'].map(c => std({ color: c, roughness: 0.3, transparent: true, opacity: 0.85, emissive: c, emissiveIntensity: 0.15 }))
    for (let i = 0; i < 6; i++) {
      group.add(mesh(jarGeo, jarMats[i % jarMats.length], -0.85 + i * 0.25, SH[0] + 0.12, ZB + 0.16))
      if (i % 2 === 0) group.add(mesh(jarGeo, jarMats[(i + 2) % jarMats.length], -0.75 + i * 0.25, SH[1] + 0.12, ZB + 0.16))
    }
    put(mats.woodDark, uvBox(0.6, 0.35, 0.45, -1.6, SLAB + 0.175, -4.3))
  }
  // the cellar's bare bulb
  const cellarLamp = new THREE.PointLight('#ffd49a', light ? 1.6 : 2.0, 6.5, 1.5)
  cellarLamp.position.set(0.4, FLOOR_B - 0.35, -2.2)
  group.add(cellarLamp)
  {
    const bulb = mesh(new THREE.SphereGeometry(0.045, 12, 8), keep(new THREE.MeshBasicMaterial({ color: '#fff0c8', toneMapped: false })), 0.4, FLOOR_B - 0.3, -2.2)
    group.add(bulb)
    put(mats.iron, uvBox(0.01, 0.2, 0.01, 0.4, FLOOR_B - 0.15, -2.2))
  }

  // ---- the living room's things ----
  // the table and two benches
  {
    const { x, z, w, d, h } = D.TABLE
    put(mats.wood, uvBox(w, 0.06, d, x, h - 0.03, z))
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(mats.woodDark, uvBox(0.07, h - 0.06, 0.07, x + sx * (w / 2 - 0.1), (h - 0.06) / 2, z + sz * (d / 2 - 0.1)))
    for (const sz of [-1, 1]) {
      put(mats.wood, uvBox(w - 0.2, 0.05, 0.3, x, 0.45, z + sz * (d / 2 + 0.32)))
      for (const sx of [-1, 1]) put(mats.woodDark, uvBox(0.06, 0.42, 0.24, x + sx * (w / 2 - 0.25), 0.21, z + sz * (d / 2 + 0.32)))
    }
    solids.push(box(x, z, w + 0.1, d + 1.25))
    // a rug under it
    const rug = mesh(new THREE.PlaneGeometry(2.6, 2.0), std({ color: '#7a3a2e', roughness: 1 }), x, 0.012, z)
    rug.rotation.x = -Math.PI / 2
    group.add(rug)
  }
  // the lamp over the table: a cord, a yellow shade, the bulb
  const lamp = new THREE.PointLight('#ffcf8a', light ? 5.5 : 6.5, 10, 1.4)
  lamp.position.set(D.LAMP.x, D.LAMP.y - 0.1, D.LAMP.z)
  group.add(lamp)
  {
    const { x, y, z } = D.LAMP
    put(mats.iron, uvBox(0.012, H - y - 0.15, 0.012, x, (H + y + 0.15) / 2, z))
    const shade = mesh(new THREE.CylinderGeometry(0.06, 0.26, 0.24, 24, 1, true), std({ color: '#e8b85a', side: THREE.DoubleSide, emissive: '#ffb84d', emissiveIntensity: 0.55, roughness: 0.6 }), x, y, z)
    group.add(shade)
    group.add(mesh(new THREE.SphereGeometry(0.06, 12, 8), keep(new THREE.MeshBasicMaterial({ color: '#fff3d0', toneMapped: false })), x, y - 0.08, z))
  }
  // the sideboard against the left wall (the scene sets things on it)
  {
    const { x0, x1, z0, z1, h } = D.SIDEBOARD
    put(mats.woodDark, uvBox(x1 - x0, h - 0.04, z1 - z0, (x0 + x1) / 2, (h - 0.04) / 2, (z0 + z1) / 2))
    put(mats.wood, uvBox(x1 - x0 + 0.04, 0.04, z1 - z0 + 0.06, (x0 + x1) / 2 + 0.02, h - 0.02, (z0 + z1) / 2))
    // its two doors and knobs
    for (const k of [-1, 1]) {
      put(mats.wood, uvBox(0.02, h - 0.2, (z1 - z0) / 2 - 0.08, x1 + 0.01, h / 2, (z0 + z1) / 2 + k * (z1 - z0) / 4))
      put(mats.steel, uvBox(0.03, 0.03, 0.03, x1 + 0.03, h * 0.6, (z0 + z1) / 2 + k * 0.08))
    }
    solids.push(box((x0 + x1) / 2, (z0 + z1) / 2, x1 - x0 + 0.1, z1 - z0 + 0.1))
  }
  // a framed landscape on the back wall
  {
    const pic = canvasTex(256, 192, g => {
      const sky = g.createLinearGradient(0, 0, 0, 120)
      sky.addColorStop(0, '#4a6a98')
      sky.addColorStop(1, '#a8c0d8')
      g.fillStyle = sky
      g.fillRect(0, 0, 256, 192)
      g.fillStyle = '#3e6a4a'
      g.beginPath()
      g.moveTo(0, 192)
      g.lineTo(0, 120)
      g.lineTo(70, 80)
      g.lineTo(120, 110)
      g.lineTo(190, 60)
      g.lineTo(256, 100)
      g.lineTo(256, 192)
      g.fill()
      g.fillStyle = '#2e5238'
      g.fillRect(0, 150, 256, 42)
    })
    keep(pic)
    put(mats.woodDark, uvBox(0.78, 0.6, 0.04, -1.25, 1.65, ZB + 0.03))
    group.add(mesh(new THREE.PlaneGeometry(0.64, 0.46), std({ map: pic, roughness: 0.6 }), -1.25, 1.65, ZB + 0.055))
  }
  // the wood stove (a cast-iron salamandra) under the chimney, its flue up through the ceiling
  const stove = (() => {
    const { x, z } = D.STOVE
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    g.add(mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.66, 20), mats.iron, 0, 0.47, 0))
    g.add(mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.05, 20), mats.iron, 0, 0.82, 0))
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU + 0.5
      g.add(mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.14, 6), mats.iron, Math.cos(a) * 0.18, 0.07, Math.sin(a) * 0.18))
    }
    const fireMat = keep(new THREE.MeshStandardMaterial({ color: '#2a1408', emissive: '#ff7a2a', emissiveIntensity: 1.6, roughness: 0.6 }))
    const door = mesh(new THREE.CircleGeometry(0.11, 18), fireMat, 0, 0.45, 0.245)
    g.add(door)
    g.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, H - 0.85, 12), mats.iron, 0, (H + 0.85) / 2, -0.05))
    // a basket of logs beside it
    const basket = new THREE.Group()
    basket.add(mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.32, 14, 1, true), std({ color: '#8a6a3a', side: THREE.DoubleSide, roughness: 1 }), 0, 0.16, 0))
    for (let k = 0; k < 5; k++) {
      const log = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.44, 8), std({ color: '#6b4a30', roughness: 1 }), -0.1 + k * 0.05, 0.3 + (k % 2) * 0.05, 0)
      log.rotation.z = Math.PI / 2 + (k - 2) * 0.12
      basket.add(log)
    }
    basket.position.set(-0.62, 0, 0.1)
    g.add(basket)
    group.add(g)
    const glow = new THREE.PointLight('#ff8a3a', 0, 3.2, 1.6)
    glow.position.set(x, 0.55, z + 0.5)
    group.add(glow)
    solids.push(box(x - 0.25, z, 1.2, 0.7))
    let lit = 1
    return {
      group: g,
      door,
      setLit(k) {
        lit = k
        fireMat.emissiveIntensity = 0.05 + 1.7 * k
        glow.intensity = (light ? 1.2 : 1.6) * k
      },
      flicker(t) {
        if (lit > 0.05) {
          const f = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7.3 + 1)
          fireMat.emissiveIntensity = (0.05 + 1.7 * lit) * f
          glow.intensity = (light ? 1.2 : 1.6) * lit * f
        }
      },
    }
  })()
  stove.setLit(1)
  // the cooker in the back corner, its extractor hood and the hood's duct out through the east wall
  const hood = (() => {
    const { x, z } = D.COOKER
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    g.add(mesh(new RoundedBoxGeometry(0.8, 0.86, 0.62, 2, 0.03), mats.enamel, 0, 0.43, 0))
    const ring = new THREE.RingGeometry(0.05, 0.085, 18)
    for (const [dx, dz] of [[-0.18, -0.12], [0.18, -0.12], [-0.18, 0.13], [0.18, 0.13]]) {
      const r = mesh(ring.clone(), mats.iron, dx, 0.865, dz)
      r.rotation.x = -Math.PI / 2
      g.add(r)
    }
    ring.dispose()
    g.add(mesh(new THREE.BoxGeometry(0.6, 0.3, 0.02), mats.iron, 0, 0.42, 0.315))
    // the hood: a sloping box over the cooker
    const hg = new THREE.CylinderGeometry(0.22, 0.5, 0.36, 4, 1)
    hg.rotateY(Math.PI / 4)
    hg.scale(1.1, 1, 0.8)
    const hoodMesh = mesh(hg, mats.steel, 0, 1.78, 0.02)
    g.add(hoodMesh)
    g.add(mesh(new THREE.BoxGeometry(0.28, 0.5, 0.24), mats.steel, 0, 2.2, -0.05))
    // the duct into the east wall
    const duct = mesh(new THREE.CylinderGeometry(0.075, 0.075, IX - x + 0.6, 12), mats.steel, (IX - x + 0.6) / 2, 2.3, -0.05)
    duct.rotation.z = Math.PI / 2
    g.add(duct)
    // its fan, seen through a round grille on the hood's front
    const fanG = new THREE.Group()
    fanG.position.set(0, 1.8, 0.27)
    fanG.rotation.x = -0.7
    fanG.add(mesh(new THREE.CircleGeometry(0.1, 20), mats.iron, 0, 0, 0))
    const blades = new THREE.Group()
    for (let k = 0; k < 4; k++) {
      const b = mesh(new THREE.BoxGeometry(0.085, 0.03, 0.005), mats.steel, 0, 0, 0.004)
      b.position.set(Math.cos((k / 4) * TAU) * 0.045, Math.sin((k / 4) * TAU) * 0.045, 0.004)
      b.rotation.z = (k / 4) * TAU
      blades.add(b)
    }
    fanG.add(blades)
    g.add(fanG)
    // the vent outside on the east wall, a flap that lifts when the fan runs
    const flap = mesh(new THREE.BoxGeometry(0.02, 0.2, 0.2), mats.steel, OX - x + 0.02, 2.3, -0.05)
    g.add(flap)
    group.add(g)
    solids.push(box(x, z, 0.85, 0.7))
    let on = 0
    return {
      group: g,
      hoodMesh,
      setOn(k) {
        on = k
      },
      update(dt) {
        blades.rotation.z -= dt * 22 * on
        flap.rotation.z = -0.6 * on
      },
    }
  })()

  // the window in the east wall: two casements opening inward, green shutters folded back outside
  const windowParts = (() => {
    const g = new THREE.Group()
    const w = WIN.z1 - WIN.z0
    const h = WIN.y1 - WIN.y0
    const leaf = (hingeZ, dir) => {
      const pivot = new THREE.Group()
      pivot.position.set(IX - 0.02, WIN.y0 + h / 2, hingeZ)
      const lw = w / 2
      const f = 0.05
      const frame = new THREE.Group()
      frame.add(mesh(new THREE.BoxGeometry(0.05, h, f), mats.frame, 0, 0, dir * f / 2))
      frame.add(mesh(new THREE.BoxGeometry(0.05, h, f), mats.frame, 0, 0, dir * (lw - f / 2)))
      frame.add(mesh(new THREE.BoxGeometry(0.05, f, lw), mats.frame, 0, h / 2 - f / 2, dir * lw / 2))
      frame.add(mesh(new THREE.BoxGeometry(0.05, f, lw), mats.frame, 0, -h / 2 + f / 2, dir * lw / 2))
      frame.add(mesh(new THREE.BoxGeometry(0.04, 0.03, lw), mats.frame, 0, 0, dir * lw / 2))
      const pane = mesh(new THREE.PlaneGeometry(lw - f, h - f), mats.glass, 0, 0, dir * lw / 2)
      pane.rotation.y = Math.PI / 2
      frame.add(pane)
      pivot.add(frame)
      g.add(pivot)
      return pivot
    }
    const a = leaf(WIN.z0, 1)
    const b = leaf(WIN.z1, -1)
    // the shutters: green boards outside, folded back against the wall
    for (const [hz, dir] of [[WIN.z0, -1], [WIN.z1, 1]]) {
      const s = new THREE.Group()
      s.position.set(OX + 0.02, WIN.y0 + h / 2, hz)
      const board = mesh(new THREE.BoxGeometry(0.03, h + 0.05, w / 2), mats.green, 0.015, 0, dir * w / 4)
      s.add(board)
      for (const y of [-h / 3, h / 3]) s.add(mesh(new THREE.BoxGeometry(0.035, 0.04, w / 2 - 0.04), keep(new THREE.MeshStandardMaterial({ color: '#2f5040', roughness: 0.6 })), 0.03, y, dir * w / 4))
      s.rotation.y = dir * 0.08
      g.add(s)
    }
    // a hit shape filling the opening (tap the window)
    const hit = mesh(new THREE.BoxGeometry(OX - IX + 0.1, h, w), keep(new THREE.MeshBasicMaterial({ visible: false })), (OX + IX) / 2, WIN.y0 + h / 2, (WIN.z0 + WIN.z1) / 2)
    g.add(hit)
    group.add(g)
    let k = 0
    return {
      group: g,
      setOpen(v) {
        k = v
        a.rotation.y = -1.35 * v
        b.rotation.y = 1.35 * v
      },
      get open() {
        return k
      },
    }
  })()

  // the trapdoor down to the cellar, at the back-left corner, with a rail round its open sides
  const trapdoor = (() => {
    const g = new THREE.Group()
    const w = HOLE.x1 - HOLE.x0
    const d = HOLE.z1 - HOLE.z0
    const pivot = new THREE.Group()
    pivot.position.set((HOLE.x0 + HOLE.x1) / 2, 0.0, HOLE.z0)
    const lid = mesh(uvBox(w, 0.05, d, 0, 0.025, d / 2), mats.boards)
    pivot.add(lid)
    for (const z of [0.25, d - 0.25]) pivot.add(mesh(new THREE.BoxGeometry(w - 0.1, 0.03, 0.08), mats.woodDark, 0, 0.065, z))
    const ringH = mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 14), mats.iron, 0, 0.06, d - 0.12)
    ringH.rotation.x = Math.PI / 2
    pivot.add(ringH)
    g.add(pivot)
    // the rail: posts and a top bar along the hole's room-side edges
    const rail = (x0, z0, x1, z1) => {
      const len = Math.hypot(x1 - x0, z1 - z0)
      const bar = mesh(new THREE.BoxGeometry(0.05, 0.05, len), mats.woodDark, (x0 + x1) / 2, 0.92, (z0 + z1) / 2)
      bar.rotation.y = Math.atan2(x1 - x0, z1 - z0)
      g.add(bar)
      const n = Math.max(2, Math.round(len / 0.45))
      for (let i = 0; i <= n; i++) g.add(mesh(new THREE.BoxGeometry(0.04, 0.92, 0.04), mats.woodDark, x0 + ((x1 - x0) * i) / n, 0.46, z0 + ((z1 - z0) * i) / n))
    }
    rail(HOLE.x1 + 0.04, HOLE.z0, HOLE.x1 + 0.04, HOLE.z1 + 0.04)
    rail(-IX, HOLE.z1 + 0.04, HOLE.x1 + 0.04, HOLE.z1 + 0.04)
    solids.push(box((HOLE.x0 + HOLE.x1) / 2, (HOLE.z0 + HOLE.z1) / 2, w + 0.2, d + 0.2, { y0: -0.5, y1: 1.0 }))
    const hit = mesh(new THREE.BoxGeometry(w, 0.3, d), keep(new THREE.MeshBasicMaterial({ visible: false })), (HOLE.x0 + HOLE.x1) / 2, 0.15, (HOLE.z0 + HOLE.z1) / 2)
    g.add(hit)
    group.add(g)
    let k = 0
    return {
      group: g,
      lid: pivot,
      setOpen(v) {
        k = v
        pivot.rotation.x = -1.68 * v
      },
      get open() {
        return k
      },
    }
  })()

  // the bridge from the yard into the room, over the trench, and the rails along every edge
  {
    const { x0, x1 } = BRIDGE
    const cx = (x0 + x1) / 2
    const w = x1 - x0
    for (let z = 0.08; z < TRENCH.z1; z += 0.2) put(mats.wood, uvBox(w, 0.06, 0.18, cx, 0.02, z + 0.09))
    for (const x of [x0 + 0.08, x1 - 0.08]) put(mats.woodDark, uvBox(0.1, 0.18, TRENCH.z1 + 0.1, x, -0.1, TRENCH.z1 / 2))
    solids.push(box(cx, TRENCH.z1 / 2, w, TRENCH.z1 + 0.1, { y0: -0.3, y1: 0.05 }))
  }
  /** A low kerb of granite from (x0, z0) to (x1, z1), low enough to look over into the cut; an invisible wall
   *  on it keeps the walker from falling in. */
  const kerb = (x0, z0, x1, z1, { h = 0.32, w = 0.3, mat = mats.stone } = {}) => {
    const len = Math.hypot(x1 - x0, z1 - z0)
    const ang = Math.atan2(x1 - x0, z1 - z0)
    const g = uvBox(w, h, len, 0, h / 2, 0)
    g.rotateY(ang)
    g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2)
    put(mat, g)
    solids.push(box((x0 + x1) / 2, (z0 + z1) / 2, 0.24, len, { rot: ang, y0: -0.5, y1: 1.0 }))
  }
  /** A wooden rail from (x0, z0) to (x1, z1) at the given ground height, posts every ~1.4 m; a solid too. */
  const fence = (x0, z0, x1, z1, y = 0) => {
    const len = Math.hypot(x1 - x0, z1 - z0)
    const ang = Math.atan2(x1 - x0, z1 - z0)
    const bar = new THREE.BoxGeometry(0.06, 0.07, len)
    bar.rotateY(ang)
    bar.translate((x0 + x1) / 2, y + 0.95, (z0 + z1) / 2)
    put(mats.woodDark, bar)
    const n = Math.max(1, Math.round(len / 1.4))
    for (let i = 0; i <= n; i++) {
      const px = x0 + ((x1 - x0) * i) / n
      const pz = z0 + ((z1 - z0) * i) / n
      put(mats.woodDark, uvBox(0.08, 0.98, 0.08, px, y + 0.49, pz))
    }
    solids.push(box((x0 + x1) / 2, (z0 + z1) / 2, 0.2, len, { rot: ang, y0: y - 0.5, y1: y + 1.0 }))
  }
  kerb(TRENCH.x0, TRENCH.z1 + 0.15, BRIDGE.x0 - 0.02, TRENCH.z1 + 0.15, { h: 0.12 })
  kerb(BRIDGE.x1 + 0.02, TRENCH.z1 + 0.15, TRENCH.x1, TRENCH.z1 + 0.15, { h: 0.12 })
  fence(BRIDGE.x0, 0.05, BRIDGE.x0, TRENCH.z1)
  fence(BRIDGE.x1, 0.05, BRIDGE.x1, TRENCH.z1)
  // the room's open edge: a low oak sill
  kerb(-IX, -0.1, BRIDGE.x0, -0.1, { h: 0.16, w: 0.16, mat: mats.woodDark })

  // ---- the yard: drystone walls of granite round it, a woodpile, a bare chestnut tree, a path ----
  {
    const wall = (x0, z0, x1, z1) => {
      const len = Math.hypot(x1 - x0, z1 - z0)
      const g = uvBox(len, 0.85, 0.5, 0, 0.425, 0)
      g.rotateY(Math.atan2(-(z1 - z0), x1 - x0))
      g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2)
      put(mats.masonry, g)
      put(mats.stone, (() => {
        const c = uvBox(len, 0.08, 0.6, 0, 0.89, 0)
        c.rotateY(Math.atan2(-(z1 - z0), x1 - x0))
        c.translate((x0 + x1) / 2, 0, (z0 + z1) / 2)
        return c
      })())
      solids.push(box((x0 + x1) / 2, (z0 + z1) / 2, len, 0.6, { rot: Math.atan2(-(z1 - z0), x1 - x0) }))
    }
    wall(YARD.x0, TRENCH.z1, TRENCH.x0, TRENCH.z1)
    wall(TRENCH.x1, TRENCH.z1, YARD.x1, TRENCH.z1)
    wall(YARD.x0, TRENCH.z1, YARD.x0, YARD.z1)
    wall(YARD.x1, TRENCH.z1, YARD.x1, YARD.z1)
    wall(YARD.x0, YARD.z1, YARD.x1, YARD.z1)
    // the woodpile against the left wall, under a little roof of tiles
    const logGeo = keep(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8))
    const logMat = std({ color: '#7a5a3a', roughness: 1 })
    const logs = new THREE.InstancedMesh(logGeo, logMat, 60)
    const o = new THREE.Object3D()
    let n = 0
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 10; c++) {
        o.position.set(YARD.x0 + 0.55, 0.08 + r * 0.14, 6.0 + c * 0.15 + (r % 2) * 0.07)
        o.rotation.set(0, 0, Math.PI / 2)
        o.updateMatrix()
        logs.setMatrixAt(n++, o.matrix)
      }
    }
    logs.raycast = () => {}
    group.add(logs)
    solids.push(box(YARD.x0 + 0.55, 6.8, 0.7, 1.8))
    // the chestnut tree, bare in winter, in the yard's far corner
    // (its trunk and branches merged into one mesh)
    const bark = std({ color: '#3a2e26', roughness: 1 })
    const TX = -7.4
    const TZ = 11.6
    put(bark, new THREE.CylinderGeometry(0.22, 0.34, 2.6, 10).translate(TX, 1.3, TZ))
    const tr = random(77)
    const e = new THREE.Euler()
    const mtx = new THREE.Matrix4()
    const branch = (x, y, z, len, r, ay, az, depth) => {
      const geo = new THREE.CylinderGeometry(r * 0.6, r, len, 6)
      geo.translate(0, len / 2, 0)
      e.set(0, ay, az)
      mtx.makeRotationFromEuler(e).setPosition(x, y, z)
      geo.applyMatrix4(mtx)
      put(bark, geo)
      if (depth <= 0) return
      const tip = new THREE.Vector3(0, len, 0).applyEuler(e).add(new THREE.Vector3(x, y, z))
      for (let k = 0; k < 2 + (depth > 1 ? 1 : 0); k++) branch(tip.x, tip.y, tip.z, len * 0.7, r * 0.6, ay + (tr() - 0.5) * 2.4, az + (tr() - 0.5) * 0.9, depth - 1)
    }
    for (let k = 0; k < 4; k++) branch(TX, 2.4, TZ, 1.6, 0.14, (k / 4) * TAU + tr(), 0.55 + tr() * 0.3, light ? 1 : 2)
    solids.push(box(TX, TZ, 0.8, 0.8))
    // the path of granite slabs from the yard's back to the bridge
    const slabMat = std({ color: '#8a8690', roughness: 0.95 })
    const slabGeo = keep(new RoundedBoxGeometry(0.62, 0.05, 0.5, 1, 0.02))
    const path = new THREE.InstancedMesh(slabGeo, slabMat, 18)
    let m = 0
    for (let i = 0; i < 18; i++) {
      const t = i / 17
      o.position.set(2.95 * (1 - t) + 0.4 * t + (rnd() - 0.5) * 0.12, 0.02, TRENCH.z1 + 0.45 + t * 8.4)
      o.rotation.set(0, (rnd() - 0.5) * 0.4, 0)
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      path.setMatrixAt(m++, o.matrix)
    }
    path.raycast = () => {}
    group.add(path)
  }

  flush()

  // chimney smoke, while the stove burns
  const smokeTex = tex(canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,0.8)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  }))
  const smoke = Array.from({ length: light ? 5 : 9 }, (_, i) => {
    const s = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: smokeTex, color: '#8a90a8', transparent: true, opacity: 0, depthWrite: false })))
    s.userData.ph = i / (light ? 5 : 9)
    s.raycast = () => {}
    group.add(s)
    return s
  })
  let smokeK = 1

  /** The ground's height: the yard and the fields 0, the trench's floor, the cellar's floor inside the house
   *  (the room's floor is a solid over it). */
  const floor = (x, z) => {
    if (x > TRENCH.x0 && x < TRENCH.x1 && z > 0 && z < TRENCH.z1) return TRENCH.y
    if (x > -IX && x < IX && z > ZB && z <= 0) return SLAB
    return groundY(x, z)
  }

  return {
    group,
    dims: D,
    mats,
    solids,
    floor,
    moonDir,
    lamp,
    cellarLamp,
    stove,
    hood,
    window: windowParts,
    trapdoor,
    strataTexture: T.strata,
    env: {
      background: new THREE.Color('#05071a'),
      fog: new THREE.Fog('#0b1030', 40, 260),
      exposure: 1.0,
      envIntensity: 0.08,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.84 },
    },
    cameraBounds: { minX: YARD.x0 + 0.5, maxX: YARD.x1 - 0.5, minY: -3.6, maxY: 9, minZ: ZB + 0.35, maxZ: YARD.z1 - 1.9 },
    setFrost(k) {
      D.frostMat.opacity = k
    },
    setSmoke(k) {
      smokeK = k
    },
    update(dt, t) {
      stove.flicker(t)
      hood.update(dt)
      const top = D.chimneyTop
      smoke.forEach(s => {
        const u = (t * 0.12 + s.userData.ph) % 1
        s.position.set(top.x - u * 1.6, top.y + u * 2.4, top.z + Math.sin(u * 5 + s.userData.ph * 9) * 0.2)
        s.scale.setScalar(0.35 + u * 1.3)
        s.material.opacity = 0.32 * Math.sin(u * Math.PI) * smokeK
      })
    },
    dispose() {
      for (const o of own) o.dispose?.()
    },
  }
}
