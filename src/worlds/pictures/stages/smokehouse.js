// A stage for picture rooms (docs/knowledge/picture-rooms.md): a fire brigade's training house at night.
// A two-storey concrete house with scorched walls stands across a concrete yard (the house's front is the
// yard's far edge, z = -6); its ground floor is a furnished living room, cut open to the yard by one wide
// opening (a doll's house: the room is seen, not walked into) and filling with harmless training smoke on
// request. In the yard: a fire engine with blue beacons turning slowly, two floodlights, a hydrant, cones.
// At the right-hand edge of the yard a wood begins, ferns and spruces, with a clearing for a fox.
// Walking: the yard x0..x1, z0..z1. For the scene: `ROOM` (the room's measures and where its furniture
// stands, so a heat screen can draw the same room), `YARD`, `HOUSE`, `WOOD` (where the fox sits), `mats`,
// `smoke.set(k)` (0 clear to 1 thick), `solids`, `env`, `cameraBounds`, `update(t)`, `onGround`.
// Everything big stays mid-toned: pale concrete under the floodlights blooms white (traps in
// picture-rooms.md).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, random } from '../../wings/noble/kit.js'
import { nightSky } from '../../common/sky.js'
import { box, roomWalls } from '../../../engine/collide.js'

const TAU = Math.PI * 2

export const HOUSE = { x0: -5, x1: 5, zf: -6, zb: -13, h: 6.4 }
export const YARD = { x0: -11.8, x1: 8.7, z0: -5.1, z1: 9.7 }
/** The living room on the ground floor: inside x0..x1, z from the front (zf) to the back wall (zb). The
 *  furniture's places (x is along the front, y up) are what a heat screen draws too. */
export const ROOM = {
  x0: -2.8, x1: 2.8, zf: -6, zb: -10, h: 2.7,
  window: { x: 1.3, w: 1.3, y0: 0.95, y1: 2.05 },
  radiator: { x: 1.3, w: 1.0, y0: 0.28, y1: 0.8 },
  bookcase: { x: -2.4, w: 0.8, y0: 0, y1: 1.75 },
  sofa: { x: -0.9, w: 2.0, z: -9.05, d: 0.9, seat: 0.45, top: 0.9 },
  table: { x: -0.3, w: 1.7, z: -8.0, d: 0.9, top: 0.75 },
  lamp: { x: 0, y: 2.5, z: -8 },
  basket: { x: 2.0, z: -7.2, r: 0.34, h: 0.18 },
  rug: { x0: -1.7, x1: 1.3, z0: -9.1, z1: -7.0 },
}
/** Where the wood begins and where the fox sits at its edge. */
export const WOOD = { x: 9.2, fox: { x: 8.55, z: -3.3 } }

/** A box whose UVs are in metres of the world, so a surface continues from one box to the next. */
function uvBox(w, h, d, x = 0, y = 0, z = 0, s = 1) {
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

/** Poured concrete, panel seams every 2 m, stained: 2 by 2 m to the tile. */
function concreteTex(light, { base = [108, 110, 112], seam = 0.5, stain = 0.1 } = {}) {
  const px = light ? 256 : 512
  const rnd = random(11)
  return canvasTex(px, px, (g, w, h) => {
    g.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 90; i++) {
      const x = rnd() * w
      const y = rnd() * h
      const r = 20 + rnd() * 80
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      const dark = rnd() < 0.55
      grd.addColorStop(0, dark ? `rgba(30,32,34,${stain})` : `rgba(190,192,194,${stain * 0.8})`)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grd
      g.fillRect(x - r, y - r, 2 * r, 2 * r)
    }
    for (let i = 0; i < px * 9; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(40,42,44,0.2)' : 'rgba(180,182,184,0.16)'
      g.fillRect(rnd() * w, rnd() * h, 1.4, 1.4)
    }
    g.strokeStyle = `rgba(28,30,32,${seam})`
    g.lineWidth = px / 170
    g.strokeRect(1, 1, w - 2, h - 2)
  }, { repeat: true })
}

/** Soot above an opening or a window: a black stain fading upward (a decal on the wall). */
function sootTex() {
  const rnd = random(5)
  return canvasTex(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    for (let i = 0; i < 26; i++) {
      const x = w * (0.1 + 0.8 * rnd())
      const base = h * (0.95 - 0.1 * rnd())
      const top = h * (0.12 + 0.55 * rnd())
      const grd = g.createLinearGradient(0, base, 0, top)
      grd.addColorStop(0, 'rgba(8,8,10,0.55)')
      grd.addColorStop(1, 'rgba(8,8,10,0)')
      g.fillStyle = grd
      g.beginPath()
      g.ellipse(x, (base + top) / 2, 10 + rnd() * 26, (base - top) / 2, 0, 0, TAU)
      g.fill()
    }
  })
}

/** Boards of a worn wooden floor. */
function boardsTex(light) {
  const px = light ? 256 : 512
  const rnd = random(23)
  return canvasTex(px, px, (g, w, h) => {
    const n = 5
    for (let i = 0; i < n; i++) {
      const k = 0.88 + rnd() * 0.2
      g.fillStyle = `rgb(${Math.round(120 * k)},${Math.round(88 * k)},${Math.round(58 * k)})`
      g.fillRect((i * w) / n, 0, w / n, h)
      for (let s = 0; s < 40; s++) {
        g.fillStyle = `rgba(60,38,20,${0.1 + rnd() * 0.14})`
        g.fillRect((i * w) / n + rnd() * (w / n), rnd() * h, 1 + rnd() * 2, 6 + rnd() * 30)
      }
      g.fillStyle = 'rgba(30,18,10,0.6)'
      g.fillRect((i * w) / n, 0, 2, h)
    }
  }, { repeat: true })
}

/** A soft grey puff of smoke. */
function puffTex() {
  const rnd = random(77)
  return canvasTex(128, 128, (g, w) => {
    g.clearRect(0, 0, w, w)
    for (let i = 0; i < 9; i++) {
      const x = w * (0.28 + 0.44 * rnd())
      const y = w * (0.28 + 0.44 * rnd())
      const r = w * (0.2 + 0.14 * rnd())
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, 'rgba(255,255,255,0.5)')
      grd.addColorStop(0.6, 'rgba(255,255,255,0.18)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, w)
    }
  })
}

/** A soft round glow. */
function glowTex() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.3, 'rgba(255,255,255,0.4)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

export function smokehouseStage({ light = false } = {}) {
  const group = new THREE.Group()
  const textures = []
  const geos = []
  const mats = []
  const keep = (m, list) => (list.push(m), m)
  const mat = (opts, cls = THREE.MeshStandardMaterial) => keep(new cls(opts), mats)
  const geo = g => keep(g, geos)
  const tex = t => keep(t, textures)
  const solids = []
  const updates = []
  const add = (o, parent = group) => (parent.add(o), o)

  const M = {
    steel: mat({ color: '#8d949c', roughness: 0.4, metalness: 0.6 }),
    dark: mat({ color: '#1f2226', roughness: 0.6, metalness: 0.2 }),
    black: mat({ color: '#121316', roughness: 0.5, metalness: 0.1 }),
    rubber: mat({ color: '#1a1a1c', roughness: 0.9 }),
    red: mat({ color: '#a4262a', roughness: 0.4, metalness: 0.3 }),
    white: mat({ color: '#b8bcc2', roughness: 0.5 }),
    yellow: mat({ color: '#c9a21c', roughness: 0.5 }),
    wood: mat({ color: '#6b4a32', roughness: 0.8 }),
    cloth: mat({ color: '#4a5d6e', roughness: 0.95 }),
    cloth2: mat({ color: '#7a4d4a', roughness: 0.95 }),
    plaster: mat({ color: '#9a8c78', roughness: 0.9 }),
  }

  // ---- the ground: dark country behind, the concrete yard ----
  const wide = mat({ color: '#2b3036', roughness: 1 })
  const country = add(new THREE.Mesh(geo(new THREE.CircleGeometry(300, 40)), wide))
  country.rotation.x = -Math.PI / 2
  country.position.y = -0.02
  const yardTex = tex(concreteTex(light, { base: [92, 95, 99], seam: 0.62, stain: 0.09 }))
  yardTex.repeat.set(1 / 2, 1 / 2)
  const yw = YARD.x1 - YARD.x0 + 2
  const yd = YARD.z1 - YARD.z0 + 4
  const yardGeo = geo(new THREE.PlaneGeometry(yw, yd))
  const yuv = yardGeo.attributes.uv
  for (let i = 0; i < yuv.count; i++) yuv.setXY(i, yuv.getX(i) * yw, yuv.getY(i) * yd)
  const yardMat = mat({ map: yardTex, roughness: 0.92, color: '#b9bcc2' })
  const yard = add(new THREE.Mesh(yardGeo, yardMat))
  yard.rotation.x = -Math.PI / 2
  yard.position.set((YARD.x0 + YARD.x1) / 2, 0, (YARD.z0 + YARD.z1) / 2 - 1)
  // a painted parking line for the engine, a stripe to the training house
  const paint = mat({ color: '#b9b25a', roughness: 0.9 })
  for (const [px, pz, w, d] of [[-11.5, 1.0, 0.12, 8], [-8.9, 1.0, 0.12, 8], [-10.2, -3.1, 3, 0.12]]) {
    const l = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(w, d)), paint))
    l.rotation.x = -Math.PI / 2
    l.position.set(px, 0.012, pz)
  }

  // ---- the house: concrete, scorched ----
  const wallTex = tex(concreteTex(light, { base: [116, 116, 116], seam: 0.55, stain: 0.13 }))
  wallTex.repeat.set(1 / 2, 1 / 2)
  const wall = mat({ map: wallTex, roughness: 0.95, color: '#c4c6c8' })
  const H = HOUSE
  const R = ROOM
  const block = (x0, x1, y0, y1, z0, z1) => {
    const m = new THREE.Mesh(geo(uvBox(x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, 2)), wall)
    group.add(m)
    return m
  }
  block(H.x0, R.x0, 0, H.h, H.zb, H.zf) // left of the opening
  block(R.x1, H.x1, 0, H.h, H.zb, H.zf) // right of it
  block(R.x0, R.x1, 0, H.h, H.zb, R.zb) // behind the room
  block(R.x0, R.x1, R.h, H.h, R.zb, H.zf) // the first floor over the room
  block(H.x0 - 0.15, H.x1 + 0.15, H.h, H.h + 0.25, H.zb - 0.15, H.zf + 0.15) // the parapet's slab
  // a steel lintel over the opening, and the sills of the upstairs windows
  const lintel = add(new THREE.Mesh(geo(new THREE.BoxGeometry(R.x1 - R.x0 + 0.5, 0.22, 0.34)), M.steel))
  lintel.position.set(0, R.h + 0.11, H.zf + 0.1)
  solids.push(box(-3.9, (H.zf + H.zb) / 2, 2.2, 7.1), box(3.9, (H.zf + H.zb) / 2, 2.2, 7.1))
  // a wall across the opening's sill, so nobody walks into the room (a low step the eye barely sees)
  solids.push(box(0, H.zf + 0.25, R.x1 - R.x0 + 0.4, 0.5))
  // upstairs: three dark windows, the middle one scorched, shutters at the sides
  const sooty = tex(sootTex())
  const sootMat = mat({ map: sooty, transparent: true, depthWrite: false, roughness: 1, color: '#ffffff' })
  const winDark = mat({ color: '#07090f', roughness: 0.2, metalness: 0.4 })
  for (const x of [-3.7, 0, 3.7]) {
    const frame = add(new THREE.Mesh(geo(new THREE.BoxGeometry(1.5, 1.55, 0.14)), M.steel))
    frame.position.set(x, 4.45, H.zf + 0.05)
    const pane = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(1.3, 1.35)), winDark))
    pane.position.set(x, 4.45, H.zf + 0.13)
    const soot = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(2.2, 2.6)), sootMat))
    soot.position.set(x, 5.4, H.zf + 0.02)
  }
  const sootBig = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(6.4, 2.4)), sootMat))
  sootBig.position.set(0, R.h + 1.2, H.zf + 0.025)
  // a steel hook and ring for ropes, and a yellow standpipe, as on a training ground
  const standpipe = add(new THREE.Mesh(geo(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 10)), M.yellow))
  standpipe.position.set(-3.1, 1.3, H.zf + 0.2)

  // ---- the room inside: floor, walls, ceiling, furniture, a lamp ----
  const room = new THREE.Group()
  group.add(room)
  const boards = tex(boardsTex(light))
  boards.repeat.set(1 / 1.2, 1 / 1.2)
  const rw = R.x1 - R.x0
  const rd = R.zf - R.zb
  const floorGeo = geo(new THREE.PlaneGeometry(rw, rd))
  const fuv = floorGeo.attributes.uv
  for (let i = 0; i < fuv.count; i++) fuv.setXY(i, fuv.getX(i) * rw, fuv.getY(i) * rd)
  const floorM = add(new THREE.Mesh(floorGeo, mat({ map: boards, roughness: 0.7, color: '#d2c0a8' })), room)
  floorM.rotation.x = -Math.PI / 2
  floorM.position.set(0, 0.02, (R.zf + R.zb) / 2)
  const wp = mat({ color: '#a89a82', roughness: 0.9 })
  const back = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(rw, R.h)), wp), room)
  back.position.set(0, R.h / 2, R.zb + 0.01)
  for (const s of [-1, 1]) {
    const side = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(rd, R.h)), wp), room)
    side.position.set(s > 0 ? R.x1 - 0.01 : R.x0 + 0.01, R.h / 2, (R.zf + R.zb) / 2)
    side.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
  }
  const ceil = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(rw, rd)), mat({ color: '#8c8478', roughness: 1 })), room)
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, R.h - 0.01, (R.zf + R.zb) / 2)
  // skirting
  const skirt = add(new THREE.Mesh(geo(new THREE.BoxGeometry(rw, 0.1, 0.03)), M.wood), room)
  skirt.position.set(0, 0.07, R.zb + 0.02)

  // the window in the back wall: a frame, cold night glass, a sill
  const W = R.window
  const winGlass = mat({ color: '#101a30', roughness: 0.15, metalness: 0.3, emissive: '#16264a', emissiveIntensity: 0.5 })
  const wg = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(W.w, W.y1 - W.y0)), winGlass), room)
  wg.position.set(W.x, (W.y0 + W.y1) / 2, R.zb + 0.02)
  for (const [w, h, x, y] of [[W.w + 0.12, 0.06, 0, (W.y1 - W.y0) / 2], [W.w + 0.12, 0.06, 0, -(W.y1 - W.y0) / 2], [0.06, W.y1 - W.y0, -W.w / 2, 0], [0.06, W.y1 - W.y0, W.w / 2, 0], [0.04, W.y1 - W.y0, 0, 0], [W.w, 0.04, 0, 0]]) {
    const b = add(new THREE.Mesh(geo(new THREE.BoxGeometry(w, h, 0.05)), M.white), room)
    b.position.set(W.x + x, (W.y0 + W.y1) / 2 + y, R.zb + 0.035)
  }
  const sill = add(new THREE.Mesh(geo(new THREE.BoxGeometry(W.w + 0.3, 0.05, 0.2)), M.white), room)
  sill.position.set(W.x, W.y0 - 0.03, R.zb + 0.1)
  // the radiator under it: a panel with fins
  const Rd = R.radiator
  const rad = add(new THREE.Group(), room)
  const radMat = mat({ color: '#b9bcc0', roughness: 0.5, metalness: 0.3 })
  const nFins = 10
  for (let i = 0; i < nFins; i++) {
    const f = new THREE.Mesh(geo(new THREE.BoxGeometry(Rd.w / nFins - 0.012, Rd.y1 - Rd.y0, 0.09)), radMat)
    f.position.set(-Rd.w / 2 + (i + 0.5) * (Rd.w / nFins), (Rd.y0 + Rd.y1) / 2, 0)
    rad.add(f)
  }
  rad.position.set(Rd.x, 0, R.zb + 0.12)
  // a bookcase on the back wall, left
  const Bc = R.bookcase
  const bookcase = add(new THREE.Group(), room)
  {
    const body = new THREE.Mesh(geo(new THREE.BoxGeometry(Bc.w, Bc.y1, 0.34)), M.wood)
    body.position.y = Bc.y1 / 2
    bookcase.add(body)
    const bookCols = ['#7a2b2b', '#2b4a7a', '#3a6a3a', '#a8842a', '#5a3a6a', '#6a6a6a']
    const rnd = random(4)
    for (let row = 0; row < 4; row++) {
      let x = -Bc.w / 2 + 0.05
      while (x < Bc.w / 2 - 0.06) {
        const bw = 0.04 + rnd() * 0.04
        const bh = 0.24 + rnd() * 0.1
        const bk = new THREE.Mesh(geo(new THREE.BoxGeometry(bw, bh, 0.22)), mat({ color: bookCols[(rnd() * bookCols.length) | 0], roughness: 0.8 }))
        bk.position.set(x + bw / 2, 0.2 + row * 0.42 + bh / 2, 0.1)
        bookcase.add(bk)
        x += bw + 0.004
      }
    }
    bookcase.position.set(Bc.x, 0, R.zb + 0.2)
  }
  // the sofa against the back wall, right
  const Sf = R.sofa
  const sofa = add(new THREE.Group(), room)
  {
    const seat = new THREE.Mesh(geo(new RoundedBoxGeometry(Sf.w, Sf.seat, Sf.d, 3, 0.08)), M.cloth)
    seat.position.y = Sf.seat / 2
    const backrest = new THREE.Mesh(geo(new RoundedBoxGeometry(Sf.w, Sf.top - 0.2, 0.25, 3, 0.08)), M.cloth)
    backrest.position.set(0, 0.2 + (Sf.top - 0.2) / 2, -Sf.d / 2 + 0.125)
    sofa.add(seat, backrest)
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(geo(new RoundedBoxGeometry(0.22, 0.62, Sf.d, 3, 0.07)), M.cloth)
      arm.position.set(s * (Sf.w / 2 - 0.11), 0.31, 0)
      sofa.add(arm)
    }
    for (const x of [-0.45, 0.45]) {
      const cushion = new THREE.Mesh(geo(new RoundedBoxGeometry(0.8, 0.14, 0.62, 3, 0.05)), mat({ color: '#6a7d8c', roughness: 1 }))
      cushion.position.set(x, Sf.seat + 0.05, 0.1)
      sofa.add(cushion)
    }
    sofa.position.set(Sf.x, 0, Sf.z)
  }
  // a rug, and the dining table with two chairs
  const Rg = R.rug
  const rug = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(Rg.x1 - Rg.x0, Rg.z1 - Rg.z0)), mat({ color: '#6a3b36', roughness: 1 })), room)
  rug.rotation.x = -Math.PI / 2
  rug.position.set((Rg.x0 + Rg.x1) / 2, 0.03, (Rg.z0 + Rg.z1) / 2)
  const Tb = R.table
  const table = add(new THREE.Group(), room)
  {
    const top = new THREE.Mesh(geo(new RoundedBoxGeometry(Tb.w, 0.06, Tb.d, 2, 0.02)), M.wood)
    top.position.y = Tb.top - 0.03
    table.add(top)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(geo(new THREE.BoxGeometry(0.07, Tb.top - 0.06, 0.07)), M.wood)
        leg.position.set(sx * (Tb.w / 2 - 0.08), (Tb.top - 0.06) / 2, sz * (Tb.d / 2 - 0.08))
        table.add(leg)
      }
    }
    table.position.set(Tb.x, 0, Tb.z)
  }
  for (const [cx, cz, ry] of [[Tb.x - 1.3, Tb.z + 0.2, 0.3], [Tb.x + 1.2, Tb.z - 0.15, -2.8]]) {
    const chair = add(new THREE.Group(), room)
    const seat = new THREE.Mesh(geo(new THREE.BoxGeometry(0.42, 0.05, 0.42)), M.wood)
    seat.position.y = 0.45
    const bk = new THREE.Mesh(geo(new THREE.BoxGeometry(0.42, 0.45, 0.04)), M.wood)
    bk.position.set(0, 0.7, -0.19)
    chair.add(seat, bk)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.Mesh(geo(new THREE.BoxGeometry(0.04, 0.45, 0.04)), M.wood)
        leg.position.set(sx * 0.18, 0.225, sz * 0.18)
        chair.add(leg)
      }
    }
    chair.position.set(cx, 0, cz)
    chair.rotation.y = ry
  }
  // the ceiling lamp: a plain bulb in a paper shade, warm light
  const Lp = R.lamp
  const bulb = add(new THREE.Mesh(geo(new THREE.SphereGeometry(0.07, 14, 10)), mat({ color: '#ffe2b0', emissive: '#ffd596', emissiveIntensity: 2.2 }, THREE.MeshStandardMaterial)), room)
  bulb.position.set(Lp.x, Lp.y, Lp.z)
  const shade = add(new THREE.Mesh(geo(new THREE.ConeGeometry(0.26, 0.2, 18, 1, true)), mat({ color: '#d8c8a0', roughness: 0.9, side: THREE.DoubleSide, emissive: '#4a3a20', emissiveIntensity: 0.6 })), room)
  shade.position.set(Lp.x, Lp.y + 0.12, Lp.z)
  const lamp = new THREE.PointLight('#ffcf94', light ? 7 : 9, 8, 1.7)
  lamp.position.set(Lp.x, Lp.y - 0.35, Lp.z)
  room.add(lamp)
  room.add(new THREE.PointLight('#8aa0d0', 1.2, 6, 1.6).translateX(0).translateY(1.6).translateZ(R.zf + 0.4))

  // ---- the smoke: soft puffs filling the room from the floor up, seeping out under the lintel ----
  const puffMap = tex(puffTex())
  const smokeMat = new THREE.SpriteMaterial({ map: puffMap, color: '#b4ada3', transparent: true, depthWrite: false, opacity: 0 })
  mats.push(smokeMat)
  const puffs = []
  {
    const rnd = random(31)
    const n = light ? 34 : 62
    for (let i = 0; i < n; i++) {
      const s = new THREE.Sprite(smokeMat)
      const sc = 1.7 + rnd() * 1.6
      s.scale.set(sc, sc * (0.8 + rnd() * 0.3), 1)
      const p = {
        s,
        x: R.x0 + 0.3 + rnd() * (rw - 0.6),
        y: 0.3 + rnd() * (R.h - 0.5),
        z: R.zb + 0.5 + rnd() * (rd - 0.7),
        a: rnd() * TAU,
        sp: 0.12 + rnd() * 0.2,
        rank: i / n, // puff i shows once the smoke is thicker than this
      }
      s.position.set(p.x, p.y, p.z)
      s.material = smokeMat
      room.add(s)
      puffs.push(p)
    }
  }
  const smoke = {
    k: 0,
    set(k) {
      smoke.k = Math.max(0, Math.min(1, k))
      smokeMat.opacity = Math.min(1, smoke.k * 1.6) * 0.34
      for (const p of puffs) p.s.visible = smoke.k > 0.01 && p.rank < smoke.k * 1.05 + 0.04
    },
  }
  updates.push(t => {
    if (smoke.k <= 0.01) return
    for (const p of puffs) {
      if (!p.s.visible) continue
      p.s.position.set(p.x + Math.sin(t * p.sp + p.a) * 0.25, p.y + Math.sin(t * p.sp * 0.7 + p.a * 2) * 0.12, p.z + Math.cos(t * p.sp + p.a) * 0.2)
    }
  })

  // ---- the yard: two floodlights, a hydrant, cones, a low fence ----
  const lights = []
  function floodlight(x, z, h, aim) {
    const pole = add(new THREE.Mesh(geo(new THREE.CylinderGeometry(0.07, 0.1, h, 10)), M.steel))
    pole.position.set(x, h / 2, z)
    const head = add(new THREE.Mesh(geo(new THREE.BoxGeometry(0.7, 0.18, 0.3)), M.dark))
    head.position.set(x, h + 0.05, z + 0.1)
    head.rotation.x = 0.35
    const lens = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(0.62, 0.12)), mat({ color: '#fff4d8', emissive: '#fff0cc', emissiveIntensity: 2 })))
    lens.position.set(x, h - 0.02, z + 0.26)
    lens.rotation.x = 0.35
    const l = new THREE.PointLight('#ffeacc', light ? 14 : 22, 17, 1.5)
    l.position.set(x + aim.x, h - 0.6, z + aim.z)
    add(l)
    lights.push(l)
    solids.push(box(x, z, 0.3, 0.3))
  }
  floodlight(3.4, -5.0, 5.2, { x: 0.4, z: 0.8 })
  floodlight(-6.2, 6.4, 5.2, { x: 0.6, z: -0.4 })
  floodlight(-1.2, 8.7, 5.2, { x: 0.3, z: -0.8 })
  {
    const hyd = add(new THREE.Group())
    const body = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.1, 0.12, 0.6, 12)), mat({ color: '#a8281f', roughness: 0.5, metalness: 0.2 }))
    body.position.y = 0.3
    const cap = new THREE.Mesh(geo(new THREE.SphereGeometry(0.11, 12, 8, 0, TAU, 0, Math.PI / 2)), body.material)
    cap.position.y = 0.6
    const nozzle = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8).rotateZ(Math.PI / 2)), body.material)
    nozzle.position.y = 0.38
    hyd.add(body, cap, nozzle)
    hyd.position.set(-7.6, 0, -4.6)
    solids.push(box(-7.6, -4.6, 0.4, 0.4))
  }
  {
    const cones = new THREE.InstancedMesh(geo(new THREE.ConeGeometry(0.17, 0.55, 12).translate(0, 0.275, 0)), mat({ color: '#d4561c', roughness: 0.6 }), 7)
    const o = new THREE.Object3D()
    ;[[-3.2, -3.6], [-3.2, -2.2], [2.9, -4.2], [3.0, -1.6], [-1.6, -4.6], [1.9, -4.7], [-9.6, -4.2]].forEach(([x, z], i) => {
      o.position.set(x, 0, z)
      o.updateMatrix()
      cones.setMatrixAt(i, o.matrix)
    })
    add(cones)
  }
  // a low chain fence along the yard's left and back edge (nothing to climb: a boundary the eye reads)
  {
    const posts = []
    for (let z = YARD.z0 + 0.5; z <= YARD.z1; z += 2.2) posts.push([YARD.x0 - 0.2, z])
    for (let x = YARD.x0; x <= YARD.x1; x += 2.2) posts.push([x, YARD.z1 + 0.3])
    const pm = new THREE.InstancedMesh(geo(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 6).translate(0, 0.55, 0)), M.steel, posts.length)
    const o = new THREE.Object3D()
    posts.forEach(([x, z], i) => {
      o.position.set(x, 0, z)
      o.updateMatrix()
      pm.setMatrixAt(i, o.matrix)
    })
    add(pm)
    for (const [x, z, w, d] of [[YARD.x0 - 0.2, (YARD.z0 + YARD.z1) / 2, 0.02, YARD.z1 - YARD.z0], [(YARD.x0 + YARD.x1) / 2, YARD.z1 + 0.3, YARD.x1 - YARD.x0, 0.02]]) {
      for (const y of [0.45, 1.0]) {
        const rail = add(new THREE.Mesh(geo(new THREE.BoxGeometry(w, 0.03, d)), M.steel))
        rail.position.set(x, y, z)
      }
    }
  }

  // ---- the fire engine: red, a white stripe, a ladder, blue beacons turning slowly ----
  const ENG = { x: -10.2, z: 0.9 }
  const engine = add(new THREE.Group())
  const beacons = []
  {
    const redShiny = mat({ color: '#a82227', roughness: 0.35, metalness: 0.4 })
    const stripe = mat({ color: '#d0d4a0', roughness: 0.5, emissive: '#3a3c20', emissiveIntensity: 0.5 })
    const shutter = mat({ color: '#6d7078', roughness: 0.5, metalness: 0.5 })
    // body behind the cab, along z; the cab at the +z end faces the visitor
    const bodyBox = new THREE.Mesh(geo(new RoundedBoxGeometry(2.5, 2.1, 5.0, 3, 0.08)), redShiny)
    bodyBox.position.set(0, 1.65, -1.2)
    const cab = new THREE.Mesh(geo(new RoundedBoxGeometry(2.5, 1.9, 2.0, 3, 0.1)), redShiny)
    cab.position.set(0, 1.55, 2.3)
    const chassis = new THREE.Mesh(geo(new THREE.BoxGeometry(2.3, 0.5, 7.4)), M.dark)
    chassis.position.set(0, 0.7, 0)
    engine.add(bodyBox, cab, chassis)
    const wind = new THREE.Mesh(geo(new THREE.PlaneGeometry(2.1, 0.8)), mat({ color: '#0e131c', roughness: 0.1, metalness: 0.5 }))
    wind.position.set(0, 2.0, 3.31)
    engine.add(wind)
    for (const s of [-1, 1]) {
      const band = new THREE.Mesh(geo(new THREE.BoxGeometry(0.02, 0.22, 7)), stripe)
      band.position.set(s * 1.26, 1.25, 0)
      engine.add(band)
      for (let i = 0; i < 3; i++) {
        const sh = new THREE.Mesh(geo(new THREE.PlaneGeometry(1.3, 0.9)), shutter)
        sh.position.set(s * 1.256, 1.9, -2.6 + i * 1.4)
        sh.rotation.y = s * Math.PI / 2
        engine.add(sh)
      }
      for (const [wz, wr] of [[2.3, 0.55], [-2.2, 0.55], [-0.6, 0.55]]) {
        const wheel = new THREE.Mesh(geo(new THREE.CylinderGeometry(wr, wr, 0.34, 20).rotateZ(Math.PI / 2)), M.rubber)
        wheel.position.set(s * 1.1, wr, wz)
        const hub = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.28, 0.28, 0.36, 12).rotateZ(Math.PI / 2)), M.steel)
        hub.position.copy(wheel.position)
        engine.add(wheel, hub)
      }
    }
    // the ladder along the roof
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(geo(new THREE.BoxGeometry(0.06, 0.1, 5.4)), M.steel)
      rail.position.set(s * 0.35, 2.8, -1.4)
      engine.add(rail)
    }
    for (let i = 0; i < 14; i++) {
      const rung = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6).rotateZ(Math.PI / 2)), M.steel)
      rung.position.set(0, 2.8, -4 + i * 0.38)
      engine.add(rung)
    }
    // the light bar on the cab roof, two beacons that turn
    const bar = new THREE.Mesh(geo(new THREE.BoxGeometry(1.5, 0.1, 0.3)), M.dark)
    bar.position.set(0, 2.55, 2.6)
    engine.add(bar)
    const halo = glowTex()
    textures.push(halo)
    for (const s of [-1, 1]) {
      const bm = mat({ color: '#2a60ff', emissive: '#2a60ff', emissiveIntensity: 1.4 })
      const dome = new THREE.Mesh(geo(new THREE.SphereGeometry(0.15, 12, 8, 0, TAU, 0, Math.PI / 2)), bm)
      dome.position.set(s * 0.5, 2.6, 2.6)
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, color: '#3a6cff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.0 }))
      sp.scale.set(1.8, 1.8, 1)
      sp.position.set(s * 0.5, 2.75, 2.6)
      mats.push(sp.material)
      engine.add(dome, sp)
      beacons.push({ bm, sp, phase: s > 0 ? 0 : Math.PI })
    }
    engine.position.set(ENG.x, 0, ENG.z)
    engine.rotation.y = Math.PI * 0.04
    solids.push(box(ENG.x, ENG.z + 0.3, 2.9, 7.8, { rot: Math.PI * 0.04 }))
  }
  // the beacons' blue sweeps the engine and the ground beside it
  const blue = new THREE.PointLight('#3a66ff', 0, 12, 1.6)
  blue.position.set(ENG.x + 0.9, 3.1, ENG.z + 2.4)
  if (!light) group.add(blue)
  updates.push(t => {
    for (const b of beacons) {
      // a slow sweep: bright for a third of every two seconds, not a strobe (the family plays at night)
      const ph = ((t * 0.5 + b.phase / TAU) % 1 + 1) % 1
      const v = Math.max(0, Math.sin(ph * Math.PI * 1.5)) ** 2
      b.sp.material.opacity = 0.12 + 0.7 * v
      b.bm.emissiveIntensity = 0.5 + 2.2 * v
    }
    const v0 = Math.max(0, Math.sin((((t * 0.5) % 1) + 1) % 1 * Math.PI * 1.5)) ** 2
    blue.intensity = 2.2 + 8 * v0
  })

  // ---- the wood at the right-hand edge: spruces and ferns, a clearing for the fox ----
  const sprucesMat = mat({ color: '#10241c', roughness: 1, flatShading: true })
  const trunkMat = mat({ color: '#2b1f17', roughness: 1 })
  {
    const rnd = random(9)
    const n = light ? 46 : 90
    const trees = new THREE.InstancedMesh(geo(new THREE.ConeGeometry(1, 1, 7).translate(0, 0.5, 0)), sprucesMat, n * 3)
    const trunks = new THREE.InstancedMesh(geo(new THREE.CylinderGeometry(0.12, 0.2, 1, 6).translate(0, 0.5, 0)), trunkMat, n)
    const o = new THREE.Object3D()
    for (let i = 0; i < n; i++) {
      const x = WOOD.x + 0.8 + rnd() * 24
      const z = -16 + rnd() * 32
      // keep a clearing round the fox
      if (Math.hypot(x - WOOD.fox.x, z - WOOD.fox.z) < 3.0) {
        o.scale.setScalar(0.0001)
        o.position.set(0, -50, 0)
        o.updateMatrix()
        for (let k = 0; k < 3; k++) trees.setMatrixAt(i * 3 + k, o.matrix)
        trunks.setMatrixAt(i, o.matrix)
        continue
      }
      const h = 5 + rnd() * 5
      o.rotation.set(0, rnd() * TAU, 0)
      o.position.set(x, 0, z)
      o.scale.set(0.2, h * 0.3, 0.2)
      o.updateMatrix()
      trunks.setMatrixAt(i, o.matrix)
      for (let k = 0; k < 3; k++) {
        const rr = (1.8 - k * 0.55) * (0.8 + rnd() * 0.3) * (h / 8)
        o.position.set(x, h * (0.22 + k * 0.26), z)
        o.scale.set(rr, h * 0.4, rr)
        o.updateMatrix()
        trees.setMatrixAt(i * 3 + k, o.matrix)
      }
    }
    add(trees)
    add(trunks)
    // the wood's floor: dark needles
    const floor = add(new THREE.Mesh(geo(new THREE.PlaneGeometry(30, 36)), mat({ color: '#1a2218', roughness: 1 })))
    floor.rotation.x = -Math.PI / 2
    floor.position.set(WOOD.x + 14, 0.005, 0)
    // ferns: arching blades in clumps, thickest round the fox
    const nf = light ? 40 : 90
    const blade = geo(new THREE.PlaneGeometry(0.08, 0.7, 1, 3).translate(0, 0.35, 0))
    const bp = blade.attributes.position
    for (let i = 0; i < bp.count; i++) bp.setZ(i, bp.getY(i) * bp.getY(i) * 0.45) // arch outward
    blade.computeVertexNormals()
    const fernMat = mat({ color: '#1d3a22', roughness: 1, side: THREE.DoubleSide })
    const ferns = new THREE.InstancedMesh(blade, fernMat, nf * 9)
    for (let i = 0; i < nf; i++) {
      const near = i < nf * 0.55
      const cx = near ? WOOD.fox.x + (rnd() - 0.5) * 3.8 : WOOD.x - 0.6 + rnd() * 7
      const cz = near ? WOOD.fox.z + (rnd() - 0.5) * 3.8 : -12 + rnd() * 24
      for (let k = 0; k < 9; k++) {
        const a = (k / 9) * TAU + rnd() * 0.5
        o.position.set(cx, 0, cz)
        o.rotation.set(0, a, 0.35 + rnd() * 0.5)
        const s = 0.75 + rnd() * 0.7
        o.scale.set(s, s, s)
        o.updateMatrix()
        ferns.setMatrixAt(i * 9 + k, o.matrix)
      }
    }
    ferns.frustumCulled = false
    add(ferns)
    // a fallen log by the clearing
    const log = add(new THREE.Mesh(geo(new THREE.CylinderGeometry(0.17, 0.2, 3.2, 8).rotateZ(Math.PI / 2 - 0.15)), trunkMat))
    log.position.set(WOOD.fox.x + 0.9, 0.2, WOOD.fox.z - 1.6)
    log.rotation.y = 0.5
  }
  // the wood is not for walking in: a low wall of its edge
  solids.push(box(YARD.x1 + 0.6, 0, 1.2, 40))

  // ---- sky, moon, light ----
  const sky = nightSky({ radius: 900, stars: light ? 900 : 2200, top: '#03060f', mid: '#091330', horizon: '#161f3a' })
  group.add(sky)
  const moonMat = new THREE.SpriteMaterial({ color: '#dbe6ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, map: tex(glowTex()), opacity: 0.55, fog: false })
  mats.push(moonMat)
  const moon = new THREE.Sprite(moonMat)
  moon.scale.set(60, 60, 1)
  moon.position.set(260, 380, -520)
  group.add(moon)
  const moonDisc = new THREE.Mesh(
    geo(new THREE.RingGeometry(0, 1, 32)),
    mat({ color: '#e8efff', fog: false, side: THREE.DoubleSide }, THREE.MeshBasicMaterial),
  )
  moonDisc.scale.set(11, 11, 1)
  moonDisc.position.set(262, 382, -518)
  moonDisc.lookAt(0, 0, 0)
  group.add(moonDisc)
  // the moon is thin: a dark disc in front eats most of it
  const bite = new THREE.Mesh(geo(new THREE.CircleGeometry(1, 32)), mat({ color: '#0a1230', fog: false }, THREE.MeshBasicMaterial))
  bite.scale.set(10.2, 10.2, 1)
  bite.position.set(268, 386, -514)
  bite.lookAt(0, 0, 0)
  group.add(bite)
  group.add(new THREE.HemisphereLight('#4a5a90', '#14181e', light ? 1.0 : 0.8))
  const moonLight = new THREE.DirectionalLight('#9fb0e8', 0.4)
  moonLight.position.set(10, 20, -14)
  group.add(moonLight, moonLight.target)

  const walls = roomWalls(YARD.x0, YARD.x1, YARD.z0, YARD.z1)
  solids.push(...walls)

  return {
    group,
    mats: M,
    solids,
    smoke,
    room,
    ENGINE: ENG,
    env: {
      background: new THREE.Color('#070b16'),
      fog: new THREE.Fog('#0a1022', 28, 120),
      exposure: 1.0,
      envIntensity: 0.12,
      bloom: { strength: 0.6, radius: 0.5, threshold: 0.86 },
      fov: 62,
    },
    cameraBounds: { minX: YARD.x0 - 0.3, maxX: YARD.x1 + 0.1, minY: 0.35, maxY: 7, minZ: HOUSE.zf + 0.4, maxZ: 7.9 }, // the frame back to the hall stands at z = 8.4: never behind it
    update(t) {
      for (const u of updates) u(t)
      sky.userData.update?.(t)
    },
    dispose() {
      for (const g of geos) g.dispose()
      for (const m of mats) m.dispose()
      for (const t of textures) t.dispose()
    },
  }
}
