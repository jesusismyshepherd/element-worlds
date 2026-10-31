// A stage for picture rooms (docs/knowledge/picture-rooms.md): the Eiffel Tower's second floor, 115 m above
// Paris, on a summer's day. An iron deck between the two north legs of the tower, a riveted parapet along
// its edge, the legs' lattice rising on either side and meeting far overhead, the central lift shaft
// behind; below, the tower's lower legs and first floor, and Paris all round: the Seine with the Pont
// d'Iéna and the Trocadéro across it, the Champ de Mars and the École Militaire behind, roofs to the haze,
// a few landmarks far off (the Invalides dome, the Montparnasse tower, La Défense, Montmartre).
//
// North is -z (the spawn looks north, at the Trocadéro), east is +x. The scene sets the clock:
// setTime(hour) puts the sun where it stands over Paris on 21 June at that hour of summer time (sunAt), and
// the sky, the haze, the light, the lattice's shadows on the deck and, after sunset, the tower's golden
// lights and the city's follow. Walking inside x -10.2..10.2, z -9.4..8.2; the deck's floor is y = 0.
//
// Exports for scenes: towerParts (the tower's iron as lattice panels and solid pieces, in metres from its
// axis at the ground, for models of any size: the room's models of the tower are built from it),
// latticeTexture, halfWidth (the tower's profile), sunAt, rivetHeads.
import * as THREE from 'three'
import { canvasTex, clamp, smooth, random } from '../../wings/noble/kit.js'
import { motes } from '../kit.js'
import { box } from '../../../engine/collide.js'

const D2R = Math.PI / 180
const C = c => new THREE.Color(c)

// ---- the tower's shape (metres): its outer half-width against its height above the ground (a 125 m
//      square base, the first floor at 57 m, the second at 115 m, the top platform at 276 m, 300 m to the
//      roof of the top; the antennas to 330 m). Each leg's own width, until the four meet in one shaft ----
const PROFILE = [[0, 62.5], [20, 50], [57, 34], [90, 24], [115, 19], [160, 12], [210, 8], [276, 5], [300, 3]]
const LEGW = [[0, 26], [57, 16], [115, 8], [160, 6], [210, 5.2], [276, 5], [300, 3]]
const lerpTable = (table, h) => {
  for (let i = 1; i < table.length; i++) {
    if (h <= table[i][0] || i === table.length - 1) {
      const [h0, w0] = table[i - 1]
      const [h1, w1] = table[i]
      return w0 + (w1 - w0) * clamp((h - h0) / (h1 - h0))
    }
  }
  return table[table.length - 1][1]
}
/** The tower's outer half-width (m) at a height above the ground (m). */
export const halfWidth = h => lerpTable(PROFILE, h)
/** The width (m) of each of the four legs at a height (the whole shaft's once they have met). */
export const legWidth = h => Math.min(lerpTable(LEGW, h), halfWidth(h))
// the sections the legs are built of (the floors at 57, 115 and 276 m fall on joints)
const SECTIONS = [0, 14, 28, 42, 57, 76, 95, 115, 137, 160, 185, 210, 230, 252, 276, 300]
export const FLOORS = { first: 57, second: 115, top: 276 }
export const SECOND = 115

// ---- the sun over Paris on 21 June (latitude 48.86° N, longitude 2.29° E), the clock in summer time ----
const LAT = 48.858 * D2R
const DECL = 23.44 * D2R
/** A unit vector toward the sun (x east, y up, z south) at a clock hour (CEST, UTC+2) on 21 June. */
export function sunAt(hour, out = new THREE.Vector3()) {
  // summer time is UTC+2; Paris lies 2.29° east (+9 min); the equation of time is about −2 min that day
  const solar = hour - 2 + 2.29 / 15 - 1.7 / 60
  const H = (solar - 12) * 15 * D2R
  const sinE = Math.sin(LAT) * Math.sin(DECL) + Math.cos(LAT) * Math.cos(DECL) * Math.cos(H)
  const e = Math.asin(clamp(sinE, -1, 1))
  // azimuth from the north, clockwise
  const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(LAT) - Math.tan(DECL) * Math.cos(LAT)) + Math.PI
  return out.set(Math.cos(e) * Math.sin(az), sinE, -Math.cos(e) * Math.cos(az))
}

// ---- the iron lattice: one tile of a lattice girder's face (two chords, a cross bar, the diagonals),
//      white on clear, tinted by its material; alpha-tested, so its shadows are lattices too ----
let latticeTex = null
/** The lattice tile every girder face shares (kept between rooms). */
export function latticeTexture() {
  if (latticeTex) return latticeTex
  latticeTex = canvasTex(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#ffffff'
    g.strokeStyle = '#ffffff'
    // the chords at both edges and the bar across
    g.fillRect(0, 0, 18, h)
    g.fillRect(w - 18, 0, 18, h)
    g.fillRect(0, h - 11, w, 11)
    g.fillRect(0, 0, w, 4)
    // the diagonals, both ways
    g.lineWidth = 11
    g.lineCap = 'square'
    g.beginPath()
    g.moveTo(0, 0)
    g.lineTo(w, h)
    g.moveTo(w, 0)
    g.lineTo(0, h)
    g.stroke()
    // a finer lacing inside each triangle
    g.lineWidth = 4
    g.beginPath()
    g.moveTo(w / 2, 0)
    g.lineTo(w / 2, h)
    g.stroke()
    // the chords' plates darker at their rivet lines
    g.fillStyle = 'rgba(0,0,0,0.25)'
    for (let y = 6; y < h; y += 12) {
      g.fillRect(7, y, 4, 4)
      g.fillRect(w - 11, y, 4, 4)
    }
  }, { repeat: true })
  latticeTex.userData.shared = true
  return latticeTex
}

/**
 * The tower's iron, in metres from its axis at the ground (x east, z south): the four legs and then the
 * one shaft as lattice panels (quads with UVs in lattice tiles), and the solid pieces (the floors' edges,
 * the arches between the legs, the top's lantern, the antenna) as plain geometry.
 * `from`/`to` keep the parts between those heights; `skip(panel)` leaves panels out.
 * Returns { panels: [{ p: [4 Vector3], n: Vector3, dir: 'n'|'s'|'e'|'w', h0, h1, uv: [4 [u, v]] }],
 *           solids: [{ geo, h }] } (h: the height the piece stands at, for banding).
 */
export function towerParts({ from = 0, to = 330, across = 2 } = {}) {
  const panels = []
  const V = (x, y, z) => new THREE.Vector3(x, y, z)
  const e1 = new THREE.Vector3()
  const e2 = new THREE.Vector3()
  const face = (p, n, dir, h0, h1, width) => {
    // wound counter-clockwise seen from outside (a double-sided material lights the side it faces)
    e1.subVectors(p[1], p[0])
    e2.subVectors(p[3], p[0])
    if (e1.cross(e2).dot(n) < 0) p = [p[1], p[0], p[3], p[2]]
    // whole tiles up the face, so every joint between sections falls on a cross bar
    const cell = Math.max(0.1, width / across)
    const rows = Math.max(1, Math.round((h1 - h0) / cell))
    panels.push({ p, n, dir, h0, h1, uv: [[0, 0], [across, 0], [across, rows], [0, rows]] })
  }
  const dirOf = (nx, nz) => (Math.abs(nx) > Math.abs(nz) ? (nx > 0 ? 'e' : 'w') : nz > 0 ? 's' : 'n')
  for (let i = 1; i < SECTIONS.length; i++) {
    const h0 = SECTIONS[i - 1]
    const h1 = SECTIONS[i]
    if (h1 <= from || h0 >= to) continue
    const o0 = halfWidth(h0)
    const o1 = halfWidth(h1)
    const i0 = o0 - legWidth(h0)
    const i1 = o1 - legWidth(h1)
    if (i0 < 0.6 && i1 < 0.6) {
      // one shaft: four faces
      for (const [nx, nz] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const tx = -nz
        const tz = nx
        const c = (o, h, s) => V(nx * o + tx * o * s, h, nz * o + tz * o * s)
        face([c(o0, h0, -1), c(o0, h0, 1), c(o1, h1, 1), c(o1, h1, -1)], V(nx, 0, nz), dirOf(nx, nz), h0, h1, 2 * (o0 + o1) / 2)
      }
      continue
    }
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        // the leg's footprint: from inner to outer in x and in z
        const X = (h, k) => sx * (k ? halfWidth(h) : halfWidth(h) - legWidth(h))
        const Z = (h, k) => sz * (k ? halfWidth(h) : halfWidth(h) - legWidth(h))
        const w0 = legWidth(h0)
        const w1 = legWidth(h1)
        // four faces: outer x, inner x, outer z, inner z (corners seen from outside, counter-clockwise)
        for (const [axis, k] of [['x', 1], ['x', 0], ['z', 1], ['z', 0]]) {
          const out = k ? 1 : -1
          if (axis === 'x') {
            const nx = sx * out
            const pts = [V(X(h0, k), h0, Z(h0, 0)), V(X(h0, k), h0, Z(h0, 1)), V(X(h1, k), h1, Z(h1, 1)), V(X(h1, k), h1, Z(h1, 0))]
            face(pts, V(nx, 0, 0), dirOf(nx, 0), h0, h1, (w0 + w1) / 2)
          } else {
            const nz = sz * out
            const pts = [V(X(h0, 0), h0, Z(h0, k)), V(X(h0, 1), h0, Z(h0, k)), V(X(h1, 1), h1, Z(h1, k)), V(X(h1, 0), h1, Z(h1, k))]
            face(pts, V(0, 0, nz), dirOf(0, nz), h0, h1, (w0 + w1) / 2)
          }
        }
      }
    }
  }

  const solids = []
  const keep = h => h >= from - 1 && h <= to + 1
  // the floors: a deep girder all round each, and the deck
  for (const [h, depth, deck] of [[FLOORS.first, 6, 1.0], [FLOORS.second, 3.2, 0.6], [FLOORS.top, 2.2, 0.5]]) {
    if (!keep(h)) continue
    const o = halfWidth(h) + 0.6
    const ring = new THREE.Shape()
    ring.moveTo(-o, -o)
    ring.lineTo(o, -o)
    ring.lineTo(o, o)
    ring.lineTo(-o, o)
    ring.closePath()
    const hole = new THREE.Path()
    const ih = o - 1.2
    hole.moveTo(-ih, -ih)
    hole.lineTo(-ih, ih)
    hole.lineTo(ih, ih)
    hole.lineTo(ih, -ih)
    hole.closePath()
    ring.holes.push(hole)
    const band = new THREE.ExtrudeGeometry(ring, { depth, bevelEnabled: false })
    band.rotateX(-Math.PI / 2)
    band.translate(0, h - depth + deck * 0.5, 0)
    solids.push({ geo: band, h })
    // the deck (the second floor's is the room's own floor, built by the stage)
    if (h !== FLOORS.second) {
      const slab = new THREE.BoxGeometry(2 * o - 0.4, deck, 2 * o - 0.4)
      slab.translate(0, h, 0)
      solids.push({ geo: slab, h })
    }
  }
  // the four great arches between the legs under the first floor (springing at about 14 m, about 39 m at the crown)
  if (keep(30)) {
    for (const [nx, nz] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const pts = []
      for (let k = 0; k <= 24; k++) {
        const a = Math.PI * (k / 24)
        const s = -Math.cos(a)
        const y = 12 + Math.sin(a) * 27
        const o = halfWidth(y) - legWidth(y) * 0.35
        const span = o
        pts.push(V(nx * o - nz * span * s, y, nz * o + nx * span * s))
      }
      const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.8, 6, false)
      solids.push({ geo: tube, h: 30 })
    }
  }
  // the top: the lantern over the top platform, and the antenna
  if (keep(290)) {
    const lantern = new THREE.CylinderGeometry(2.4, 3.6, 18, 8)
    lantern.translate(0, 288, 0)
    solids.push({ geo: lantern, h: 288 })
  }
  if (keep(315)) {
    const mast = new THREE.CylinderGeometry(0.5, 1.0, 30, 6)
    mast.translate(0, 315, 0)
    solids.push({ geo: mast, h: 315 })
  }
  return { panels, solids }
}

/** Lattice panels as one geometry (only those `keep` accepts), scaled by `s`. */
export function panelGeometry(panels, keep = () => true, s = 1) {
  const pos = []
  const nor = []
  const uv = []
  for (const p of panels) {
    if (!keep(p)) continue
    for (const k of [0, 1, 2, 0, 2, 3]) {
      pos.push(p.p[k].x * s, p.p[k].y * s, p.p[k].z * s)
      nor.push(p.n.x, p.n.y, p.n.z)
      uv.push(p.uv[k][0], p.uv[k][1])
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  return geo
}

/** Round rivet heads (an InstancedMesh) at [{ p: Vector3, n: Vector3 (the way the head faces) }]. */
export function rivetHeads(spots, mat, r = 0.028) {
  const geo = new THREE.SphereGeometry(r, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2)
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, spots.length))
  const o = new THREE.Object3D()
  const up = new THREE.Vector3(0, 1, 0)
  spots.forEach((s, i) => {
    o.position.copy(s.p)
    o.quaternion.setFromUnitVectors(up, s.n)
    o.updateMatrix()
    mesh.setMatrixAt(i, o.matrix)
  })
  mesh.count = spots.length
  mesh.castShadow = false
  return mesh
}

// ---- Paris (metres from the tower's axis at the ground; x east, z south) ----
// the Seine flows south-west past the tower's north-west side, then bends east towards the city's middle
const SEINE = [[-2700, 1950], [-1750, 1180], [-900, 520], [-150, -150], [560, -790], [1200, -1150], [1900, -1250], [2700, -1150], [3700, -930]]
const RIVER_W = 130
const SE = new THREE.Vector2(Math.SQRT1_2, Math.SQRT1_2)
// the Champ de Mars runs south-east from the tower's feet to the École Militaire
const CHAMP = { c: [345, 345], len: 760, wid: 230 }
const MILITAIRE = { c: [670, 670], len: 390, wid: 120 }
const TROCA = { c: [-420, -420] }
function distToRiver(x, z) {
  let best = Infinity
  for (let i = 1; i < SEINE.length; i++) {
    const [ax, az] = SEINE[i - 1]
    const [bx, bz] = SEINE[i]
    const dx = bx - ax
    const dz = bz - az
    const t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz))
    best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t))
  }
  return best
}
// along and across the Champ de Mars' axis (south-east)
const alongSE = (x, z) => x * SE.x + z * SE.y
const acrossSE = (x, z) => -x * SE.y + z * SE.x
const inRect = (x, z, r, pad = 0) => {
  const a = alongSE(x - r.c[0], z - r.c[1])
  const b = acrossSE(x - r.c[0], z - r.c[1])
  return Math.abs(a) < r.len / 2 + pad && Math.abs(b) < r.wid / 2 + pad
}
const inTroca = (x, z) => Math.hypot(x - TROCA.c[0], z - TROCA.c[1]) < 330 && alongSE(x, z) < -250

const MAP = 2400 // the map's half-size (m); the outskirts beyond are a plainer ring

function mapTextures(light) {
  const px = light ? 1024 : 2048
  const k = px / (2 * MAP)
  const X = x => (x + MAP) * k
  const rnd = random(19)
  const lights = []
  const day = canvasTex(px, px, g => {
    g.fillStyle = '#857d71'
    g.fillRect(0, 0, px, px)
    // blocks: lighter courtyards and roofs between the streets (the 3D houses stand on them)
    for (let i = 0; i < (light ? 2600 : 9000); i++) {
      const x = rnd() * px
      const y = rnd() * px
      const s = (8 + rnd() * 18) * k * 2
      g.fillStyle = rnd() < 0.5 ? 'rgba(170,160,142,0.55)' : 'rgba(110,104,96,0.5)'
      g.fillRect(x, y, s, s * (0.6 + rnd() * 0.8))
    }
    // the avenues: lines of trees
    g.strokeStyle = 'rgba(70,96,58,0.55)'
    g.lineWidth = 6 * k * 2
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI
      const cx = (rnd() - 0.5) * 2 * MAP
      const cz = (rnd() - 0.5) * 2 * MAP
      g.beginPath()
      g.moveTo(X(cx - Math.cos(a) * 1800), X(cz - Math.sin(a) * 1800))
      g.lineTo(X(cx + Math.cos(a) * 1800), X(cz + Math.sin(a) * 1800))
      g.stroke()
      for (let s = -1800; s < 1800; s += 60) lights.push([cx + Math.cos(a) * s, cz + Math.sin(a) * s])
    }
    // the parks
    const rect = (r, fill) => {
      g.save()
      g.translate(X(r.c[0]), X(r.c[1]))
      g.rotate(Math.PI / 4)
      g.fillStyle = fill
      g.fillRect((-r.len / 2) * k, (-r.wid / 2) * k, r.len * k, r.wid * k)
      g.restore()
    }
    rect(CHAMP, '#5c7a44')
    // the Champ de Mars' gravel walks and its rows of trees
    g.save()
    g.translate(X(CHAMP.c[0]), X(CHAMP.c[1]))
    g.rotate(Math.PI / 4)
    g.fillStyle = '#b4a888'
    g.fillRect((-CHAMP.len / 2) * k, -4 * k, CHAMP.len * k, 8 * k)
    for (const s of [-1, 1]) {
      g.fillRect((-CHAMP.len / 2) * k, s * 70 * k - 6 * k, CHAMP.len * k, 12 * k)
      g.fillStyle = '#3f5a30'
      for (let a = -CHAMP.len / 2; a < CHAMP.len / 2; a += 9) {
        g.beginPath()
        g.arc(a * k, s * 100 * k, 4.5 * k, 0, Math.PI * 2)
        g.fill()
      }
      g.fillStyle = '#b4a888'
    }
    g.restore()
    rect({ c: [0, 0], len: 300, wid: 300 }, '#6f7f56')
    rect(MILITAIRE, '#b9ad94')
    // the Trocadéro's gardens and their long pool
    g.fillStyle = '#5a7a46'
    g.beginPath()
    g.arc(X(TROCA.c[0]), X(TROCA.c[1]), 240 * k, 0, Math.PI * 2)
    g.fill()
    g.save()
    g.translate(X(TROCA.c[0]), X(TROCA.c[1]))
    g.rotate(Math.PI / 4)
    g.fillStyle = '#4f7183'
    g.fillRect(-150 * k, -14 * k, 230 * k, 28 * k)
    g.restore()
    // the Seine, its stone quays and the bridges
    const river = (w, style) => {
      g.strokeStyle = style
      g.lineWidth = w * k
      g.lineJoin = 'round'
      g.beginPath()
      SEINE.forEach(([x, z], i) => (i ? g.lineTo(X(x), X(z)) : g.moveTo(X(x), X(z))))
      g.stroke()
    }
    river(RIVER_W + 36, '#a49a86')
    river(RIVER_W, '#3e5c66')
    g.fillStyle = '#b8ad96'
    for (const t of [0.22, 0.33, 0.47, 0.58, 0.7, 0.82]) {
      const i = Math.floor(t * (SEINE.length - 1))
      const f = t * (SEINE.length - 1) - i
      const [ax, az] = SEINE[i]
      const [bx, bz] = SEINE[i + 1]
      const x = ax + (bx - ax) * f
      const z = az + (bz - az) * f
      const a = Math.atan2(bz - az, bx - ax)
      g.save()
      g.translate(X(x), X(z))
      g.rotate(a + Math.PI / 2)
      g.fillRect((-RIVER_W / 2 - 25) * k, -12 * k, (RIVER_W + 50) * k, 24 * k)
      g.restore()
      lights.push([x, z])
    }
  }, { mipmaps: true })
  // the city's lights at night: street lamps and windows, warm dots (an emissive map)
  const glow = canvasTex(px, px, g => {
    g.fillStyle = '#000000'
    g.fillRect(0, 0, px, px)
    const r2 = random(23)
    for (let i = 0; i < (light ? 5000 : 16000); i++) {
      const x = r2() * px
      const y = r2() * px
      g.fillStyle = r2() < 0.7 ? 'rgba(255,190,110,0.8)' : 'rgba(255,236,200,0.6)'
      g.fillRect(x, y, 1.6, 1.6)
    }
    g.fillStyle = 'rgba(255,200,120,1)'
    for (const [x, z] of lights) {
      g.beginPath()
      g.arc(X(x), X(z), 2.2, 0, Math.PI * 2)
      g.fill()
    }
  })
  return { day, glow }
}

/** A house front: rows of tall windows with balconies, cream stone (and its windows lit at night). */
function facadeTextures() {
  const rnd = random(5)
  const lit = []
  for (let i = 0; i < 6 * 8; i++) lit.push(rnd() < 0.35)
  const draw = (night, g, w, h) => {
    g.fillStyle = night ? '#000000' : '#d9ccb0'
    g.fillRect(0, 0, w, h)
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 8; c++) {
        const x = 6 + c * (w / 8)
        const y = 8 + r * (h / 6)
        if (night) {
          if (lit[r * 8 + c]) {
            g.fillStyle = 'rgba(255,196,120,1)'
            g.fillRect(x, y, w / 8 - 14, h / 6 - 16)
          }
        } else {
          g.fillStyle = '#5b6170'
          g.fillRect(x, y, w / 8 - 14, h / 6 - 16)
          if (r === 1 || r === 4) {
            g.fillStyle = '#2f3138'
            g.fillRect(0, y + h / 6 - 12, w, 3)
          }
        }
      }
    }
  }
  return {
    day: canvasTex(128, 128, (g, w, h) => draw(false, g, w, h)),
    night: canvasTex(128, 128, (g, w, h) => draw(true, g, w, h)),
  }
}

/** The deck's iron plates: seams and rows of rivets, a warm grey (UVs in metres, a tile 2 m square). */
function deckTexture(light) {
  const s = light ? 256 : 512
  return canvasTex(s, s, (g, w) => {
    g.fillStyle = '#7b7266'
    g.fillRect(0, 0, w, w)
    const rnd = random(8)
    for (let i = 0; i < 900; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(40,34,28,0.08)' : 'rgba(255,240,220,0.06)'
      g.fillRect(rnd() * w, rnd() * w, 2 + rnd() * 14, 1 + rnd() * 4)
    }
    g.strokeStyle = 'rgba(30,26,22,0.6)'
    g.lineWidth = 3
    for (const p of [0, w / 2]) {
      g.beginPath()
      g.moveTo(p, 0)
      g.lineTo(p, w)
      g.moveTo(0, p)
      g.lineTo(w, p)
      g.stroke()
    }
    g.fillStyle = 'rgba(40,34,28,0.55)'
    for (const p of [0, w / 2]) {
      for (let t = 6; t < w; t += w / 24) {
        for (const d of [-7, 7]) {
          g.beginPath()
          g.arc(p + d, t, 2.2, 0, Math.PI * 2)
          g.arc(t, p + d, 2.2, 0, Math.PI * 2)
          g.fill()
        }
      }
    }
  }, { repeat: true })
}

/**
 * The stage. `axis`: where the tower's axis stands in the room ({ x, z }); the deck is the second floor.
 * Returns { group, solids, env, cameraBounds, mats, sun (the DirectionalLight), sunDir, look,
 * setTime(hour), floorY, deckSize, update(t), dispose }.
 */
export function towerStage({ light = false, hour = 19.5, axis = { x: 0, z: 9 } } = {}) {
  const group = new THREE.Group()
  const disposers = []
  const tex = t => (disposers.push(() => t.dispose()), t)
  const G = -SECOND // the ground's height in the room

  // ---- materials ----
  const lattice = latticeTexture()
  const mats = {
    // the tower's iron, in its yellow-brown paint (the colour since the 20th campaign, 2019 to 2024)
    iron: new THREE.MeshStandardMaterial({ map: lattice, color: '#a07a44', roughness: 0.62, metalness: 0.35, alphaTest: 0.5, side: THREE.DoubleSide, emissive: '#ffad42', emissiveIntensity: 0 }),
    ironSolid: new THREE.MeshStandardMaterial({ color: '#8f6c3c', roughness: 0.6, metalness: 0.35, emissive: '#ffad42', emissiveIntensity: 0 }),
    girder: new THREE.MeshStandardMaterial({ color: '#8a683b', roughness: 0.55, metalness: 0.4 }),
    rivet: new THREE.MeshStandardMaterial({ color: '#7c5c32', roughness: 0.45, metalness: 0.45 }),
    deck: new THREE.MeshStandardMaterial({ map: tex(deckTexture(light)), color: '#ffffff', roughness: 0.8, metalness: 0.15 }),
    rail: new THREE.MeshStandardMaterial({ color: '#6f5532', roughness: 0.5, metalness: 0.45 }),
  }
  mats.deck.map.repeat.set(0.5, 0.5)
  disposers.push(() => Object.values(mats).forEach(m => m.dispose()))

  // ---- the tower itself: the axis at (axis.x, ground, axis.z) ----
  const tower = new THREE.Group()
  tower.position.set(axis.x, G, axis.z)
  group.add(tower)
  const parts = towerParts({})
  // the lattice, in three pieces: below the deck, the deck's height (the legs beside the visitor), above
  const latticeGeo = panelGeometry(parts.panels)
  disposers.push(() => latticeGeo.dispose())
  const latticeMesh = new THREE.Mesh(latticeGeo, mats.iron)
  latticeMesh.castShadow = true
  latticeMesh.receiveShadow = true
  tower.add(latticeMesh)
  for (const s of parts.solids) {
    disposers.push(() => s.geo.dispose())
    // the second floor's own girder band is drawn by the stage (the parapet and the deck's edge)
    if (Math.abs(s.h - SECOND) < 1) continue
    const m = new THREE.Mesh(s.geo, mats.ironSolid)
    m.castShadow = s.h > SECOND
    tower.add(m)
  }

  // ---- the deck: the second floor between the legs ----
  const o2 = halfWidth(SECOND)
  const deckGeo = new THREE.BoxGeometry(2 * o2 + 1.2, 0.6, 2 * o2 + 1.2)
  // UVs in metres on the top face
  {
    const p = deckGeo.attributes.position
    const uv = deckGeo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getZ(i))
  }
  const deck = new THREE.Mesh(deckGeo, mats.deck)
  deck.position.set(axis.x, -0.3, axis.z)
  deck.receiveShadow = true
  group.add(deck)
  // the deck's edge: a deep girder all round, under the parapet
  {
    const o = o2 + 0.6
    for (const [x, z, w, d] of [[0, -o, 2 * o + 0.3, 0.3], [0, o, 2 * o + 0.3, 0.3], [-o, 0, 0.3, 2 * o], [o, 0, 0.3, 2 * o]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 3.2, d), mats.ironSolid)
      b.position.set(axis.x + x, -1.6, axis.z + z)
      group.add(b)
    }
  }

  // ---- what is near enough to touch: the legs' corner chords and the parapet, riveted ----
  const rivets = []
  const north = axis.z - o2 // the north edge of the deck
  const legIn = o2 - legWidth(SECOND) // the legs' inner faces, from the axis
  // the two north legs' inner corners: built-up chords of plates and angles, rising past the deck
  const chordGeo = new THREE.BoxGeometry(0.62, 18, 0.62)
  disposers.push(() => chordGeo.dispose())
  for (const sx of [-1, 1]) {
    for (const cz of [north + 0.31, axis.z - legIn - 0.31]) {
      const cx = axis.x + sx * (legIn + 0.31)
      const chord = new THREE.Mesh(chordGeo, mats.girder)
      chord.position.set(cx, 6, cz)
      chord.castShadow = true
      chord.receiveShadow = true
      group.add(chord)
      // two rows of rivets on its two faces toward the deck
      for (let y = -1.5; y < 15; y += 0.16) {
        for (const d of [-0.18, 0.18]) {
          rivets.push({ p: new THREE.Vector3(cx - sx * 0.315, y, cz + d), n: new THREE.Vector3(-sx, 0, 0) })
          const zface = cz > north + 1 ? 0.315 : -0.315
          if (cz > north + 1) rivets.push({ p: new THREE.Vector3(cx + d, y, cz + zface), n: new THREE.Vector3(0, 0, 1) })
        }
      }
    }
  }
  // a cross girder overhead between the two north legs, about 7 m up
  {
    const span = 2 * legIn
    const beam = new THREE.Mesh(new THREE.BoxGeometry(span, 0.9, 0.5), mats.girder)
    beam.position.set(axis.x, 7.4, north + 0.4)
    beam.castShadow = true
    group.add(beam)
    for (let x = -span / 2 + 0.2; x < span / 2; x += 0.2) for (const y of [7.05, 7.75]) rivets.push({ p: new THREE.Vector3(axis.x + x, y, north + 0.66), n: new THREE.Vector3(0, 0, 1) })
  }
  // the parapet along the north edge: a riveted lattice girder with a handrail
  const PAR = { z: north + 0.35, x0: axis.x - legIn, x1: axis.x + legIn, h: 1.15 }
  {
    const len = PAR.x1 - PAR.x0
    const cx = (PAR.x0 + PAR.x1) / 2
    for (const y of [0.08, PAR.h - 0.06]) {
      const chordB = new THREE.Mesh(new THREE.BoxGeometry(len, 0.14, 0.2), mats.girder)
      chordB.position.set(cx, y, PAR.z)
      chordB.castShadow = true
      group.add(chordB)
      for (let x = PAR.x0 + 0.1; x < PAR.x1; x += 0.15) rivets.push({ p: new THREE.Vector3(x, y, PAR.z + 0.1), n: new THREE.Vector3(0, 0, 1) })
    }
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 10), mats.rail)
    rail.rotation.z = Math.PI / 2
    rail.position.set(cx, PAR.h + 0.06, PAR.z)
    group.add(rail)
    // posts and the lacing between them (one instanced mesh each)
    const n = Math.round(len / 1.1)
    const step = len / n
    const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, PAR.h - 0.1, 0.12), mats.girder, n + 1)
    const lace = new THREE.InstancedMesh(new THREE.BoxGeometry(0.04, 1, 0.016), mats.girder, 2 * n)
    const o = new THREE.Object3D()
    const diag = Math.hypot(step, PAR.h - 0.2)
    const tilt = Math.atan2(step, PAR.h - 0.2)
    for (let i = 0; i <= n; i++) {
      o.position.set(PAR.x0 + i * step, PAR.h / 2, PAR.z)
      o.rotation.set(0, 0, 0)
      o.scale.set(1, 1, 1)
      o.updateMatrix()
      posts.setMatrixAt(i, o.matrix)
      if (i === n) continue
      for (const s of [-1, 1]) {
        o.position.set(PAR.x0 + (i + 0.5) * step, PAR.h / 2, PAR.z + 0.06)
        o.rotation.set(0, 0, s * tilt)
        o.scale.set(1, diag, 1)
        o.updateMatrix()
        lace.setMatrixAt(2 * i + (s > 0 ? 1 : 0), o.matrix)
      }
    }
    posts.castShadow = lace.castShadow = true
    group.add(posts, lace)
    disposers.push(() => {
      posts.geometry.dispose()
      lace.geometry.dispose()
    })
  }
  // the side railings (east and west, from the legs back past the frame) and the back one
  const SIDE = { x: legIn - 0.2, z0: axis.z - legIn, z1: axis.z - 0.2 }
  {
    const len = SIDE.z1 - SIDE.z0
    for (const sx of [-1, 1]) {
      for (const y of [0.55, 1.1]) {
        const r = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, len), mats.rail)
        r.position.set(axis.x + sx * SIDE.x, y, (SIDE.z0 + SIDE.z1) / 2)
        group.add(r)
      }
      for (let z = SIDE.z0; z <= SIDE.z1 + 0.01; z += 1.2) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.15, 0.08), mats.rail)
        p.position.set(axis.x + sx * SIDE.x, 0.575, z)
        group.add(p)
      }
    }
  }
  // the central lift shaft rising from behind the frame to the top
  {
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(3.4, 162, 3.4), mats.iron)
    // a lattice tube: UVs scaled so the tiles are about 1.7 m
    const uv = shaft.geometry.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2, uv.getY(i) * 95)
    shaft.position.set(axis.x, 81, axis.z + 3.4)
    shaft.castShadow = true
    group.add(shaft)
    disposers.push(() => shaft.geometry.dispose())
  }
  const rivetMesh = rivetHeads(rivets, mats.rivet)
  group.add(rivetMesh)
  disposers.push(() => rivetMesh.geometry.dispose())

  // ---- Paris below ----
  const city = new THREE.Group()
  city.position.set(axis.x, G, axis.z)
  group.add(city)
  const maps = mapTextures(light)
  tex(maps.day)
  tex(maps.glow)
  const groundMat = new THREE.MeshStandardMaterial({ map: maps.day, emissiveMap: maps.glow, emissive: '#ffffff', emissiveIntensity: 0, roughness: 1 })
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2 * MAP, 2 * MAP), groundMat)
  ground.rotation.x = -Math.PI / 2
  city.add(ground)
  // the outskirts to the haze
  const outskirts = new THREE.Mesh(new THREE.RingGeometry(MAP * 0.98, 9000, 64, 1, 0, Math.PI * 2), new THREE.MeshStandardMaterial({ color: '#7d786c', roughness: 1 }))
  outskirts.rotation.x = -Math.PI / 2
  outskirts.position.y = -1
  city.add(outskirts)
  // the river's surface, to catch the sun
  {
    const pos = []
    for (let i = 1; i < SEINE.length; i++) {
      const [ax, az] = SEINE[i - 1]
      const [bx, bz] = SEINE[i]
      const l = Math.hypot(bx - ax, bz - az)
      const nx = (-(bz - az) / l) * (RIVER_W / 2)
      const nz = ((bx - ax) / l) * (RIVER_W / 2)
      pos.push(ax + nx, 0, az + nz, bx + nx, 0, bz + nz, bx - nx, 0, bz - nz, ax + nx, 0, az + nz, bx - nx, 0, bz - nz, ax - nx, 0, az - nz)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.computeVertexNormals()
    const water = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#36525c', roughness: 0.18, metalness: 0.5, side: THREE.DoubleSide }))
    water.position.y = 0.6
    city.add(water)
  }
  // the houses: stone fronts and grey zinc roofs, one instanced mesh each
  const facade = facadeTextures()
  tex(facade.day)
  tex(facade.night)
  const houseMat = new THREE.MeshStandardMaterial({ map: facade.day, emissiveMap: facade.night, emissive: '#ffffff', emissiveIntensity: 0, roughness: 0.9 })
  const roofMat = new THREE.MeshStandardMaterial({ color: '#7f8994', roughness: 0.65, metalness: 0.25 })
  const spots = []
  {
    const rnd = random(77)
    const R = light ? 1150 : 1750
    const step = 46
    for (let x = -R; x <= R; x += step) {
      for (let z = -R; z <= R; z += step) {
        const px = x + (rnd() - 0.5) * 16
        const pz = z + (rnd() - 0.5) * 16
        const r = Math.hypot(px, pz)
        if (r > R || rnd() < 0.08) continue
        if (Math.max(Math.abs(px), Math.abs(pz)) < 175) continue
        if (distToRiver(px, pz) < RIVER_W / 2 + 40) continue
        if (inRect(px, pz, CHAMP, 30) || inRect(px, pz, MILITAIRE, 20) || inTroca(px, pz)) continue
        // the streets turn slowly across the city, as Paris's blocks do
        const a = Math.sin(px * 0.0011) * 0.6 + Math.cos(pz * 0.0013) * 0.5
        spots.push({ x: px, z: pz, a, w: 24 + rnd() * 16, d: 20 + rnd() * 14, h: 17 + rnd() * 8 })
      }
    }
  }
  const houses = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), houseMat, spots.length)
  const roofs = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), roofMat, spots.length)
  {
    const o = new THREE.Object3D()
    const col = new THREE.Color()
    const rnd = random(4)
    spots.forEach((s, i) => {
      o.position.set(s.x, s.h / 2, s.z)
      o.rotation.set(0, s.a, 0)
      o.scale.set(s.w, s.h, s.d)
      o.updateMatrix()
      houses.setMatrixAt(i, o.matrix)
      houses.setColorAt(i, col.setHSL(0.1, 0.25, 0.72 + rnd() * 0.16))
      o.position.set(s.x, s.h + 2.2, s.z)
      o.scale.set(s.w - 3, 4.4, s.d - 3)
      o.updateMatrix()
      roofs.setMatrixAt(i, o.matrix)
    })
  }
  city.add(houses, roofs)
  disposers.push(() => {
    houses.geometry.dispose()
    roofs.geometry.dispose()
  })
  // trees along the Champ de Mars and the quays
  {
    const trees = []
    for (const s of [-1, 1]) {
      for (let a = -CHAMP.len / 2; a < CHAMP.len / 2; a += 12) {
        const across = s * 100
        trees.push([CHAMP.c[0] + a * SE.x - across * SE.y, CHAMP.c[1] + a * SE.y + across * SE.x])
      }
    }
    for (let i = 1; i < SEINE.length; i++) {
      const [ax, az] = SEINE[i - 1]
      const [bx, bz] = SEINE[i]
      const l = Math.hypot(bx - ax, bz - az)
      for (let t = 0; t < l; t += 16) {
        for (const s of [-1, 1]) {
          const nx = (-(bz - az) / l) * (RIVER_W / 2 + 22) * s
          const nz = ((bx - ax) / l) * (RIVER_W / 2 + 22) * s
          trees.push([ax + ((bx - ax) * t) / l + nx, az + ((bz - az) * t) / l + nz])
        }
      }
    }
    const n = light ? Math.min(trees.length, 500) : trees.length
    const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#4f6b3a', roughness: 1 }), n)
    const o = new THREE.Object3D()
    for (let i = 0; i < n; i++) {
      const [x, z] = trees[Math.floor((i * trees.length) / n)]
      o.position.set(x, 9, z)
      o.scale.set(6, 7, 6)
      o.updateMatrix()
      crowns.setMatrixAt(i, o.matrix)
    }
    city.add(crowns)
    disposers.push(() => {
      crowns.geometry.dispose()
      crowns.material.dispose()
    })
  }
  // landmarks: the École Militaire, the Palais de Chaillot, the Invalides dome, the Montparnasse tower,
  // La Défense's towers, Montmartre and the Sacré-Cœur
  const stone = new THREE.MeshStandardMaterial({ color: '#d2c6aa', roughness: 0.85 })
  const dark = new THREE.MeshStandardMaterial({ color: '#4c5160', roughness: 0.5, metalness: 0.3 })
  const gold = new THREE.MeshStandardMaterial({ color: '#d7a63a', roughness: 0.3, metalness: 0.8, emissive: '#5a3a00', emissiveIntensity: 0.3 })
  disposers.push(() => [stone, dark, gold, roofMat, houseMat, groundMat, outskirts.material].forEach(m => m.dispose()))
  const add = (geo, mat, x, y, z, ry = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.rotation.y = ry
    city.add(m)
    disposers.push(() => geo.dispose())
    return m
  }
  add(new THREE.BoxGeometry(MILITAIRE.wid, 26, MILITAIRE.len), stone, MILITAIRE.c[0], 13, MILITAIRE.c[1], Math.PI / 4)
  // the Palais de Chaillot: two curved wings round the Trocadéro, across the river
  for (const s of [-1, 1]) {
    for (let k = 0; k < 6; k++) {
      const a = -Math.PI * 0.75 + s * (0.18 + k * 0.1)
      const r = 640
      add(new THREE.BoxGeometry(70, 24, 34), stone, Math.cos(a) * r * 0.95, 12, Math.sin(a) * r * 0.95, -a)
    }
  }
  {
    const ix = 1350
    const iz = 380
    add(new THREE.BoxGeometry(80, 30, 80), stone, ix, 15, iz)
    add(new THREE.CylinderGeometry(22, 24, 30, 24), stone, ix, 45, iz)
    add(new THREE.SphereGeometry(22, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), gold, ix, 60, iz)
    add(new THREE.CylinderGeometry(1.5, 3, 30, 8), gold, ix, 92, iz)
  }
  add(new THREE.BoxGeometry(50, 210, 32), dark, 2050, 105, 1450, 0.3)
  {
    const r = random(12)
    for (let i = 0; i < 14; i++) {
      const h = 90 + r() * 140
      add(new THREE.BoxGeometry(40 + r() * 30, h, 30 + r() * 30), r() < 0.5 ? dark : stone, -4300 + (r() - 0.5) * 900, h / 2, -3300 + (r() - 0.5) * 700, r())
    }
  }
  add(new THREE.SphereGeometry(900, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#7d7a6c', roughness: 1 }), 2900, -780, -3900).scale.set(1, 1.0, 1)
  {
    const sx = 2900
    const sz = -3900
    add(new THREE.BoxGeometry(70, 40, 50), stone, sx, 140, sz)
    add(new THREE.SphereGeometry(20, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), stone, sx, 160, sz)
  }

  // ---- the sky ----
  const ZENITH = { night: C('#060a1d'), dusk: C('#232a63'), day: C('#3166b0') }
  const HORIZON = { night: C('#131737'), dusk: C('#b77d6e'), day: C('#a9bed4') }
  const GLOW = { dusk: C('#ff8a3a'), day: C('#ffd9a0') }
  const skyU = {
    uSunDir: { value: new THREE.Vector3(0, 0.3, -1).normalize() },
    uZenith: { value: ZENITH.day.clone() },
    uHorizon: { value: HORIZON.day.clone() },
    uGlow: { value: GLOW.day.clone() },
    uNight: { value: 0 },
  }
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(8500, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSunDir; uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uGlow; uniform float uNight;
        varying vec3 vDir;
        float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 c = h > 0.0 ? mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.55)) : uHorizon;
          float s = clamp(dot(d, uSunDir), -1.0, 1.0);
          float up = clamp(uSunDir.y * 5.0 + 0.5, 0.0, 1.0);
          c += uGlow * up * (pow(max(s, 0.0), 8.0) * 0.38 + pow(max(s, 0.0), 160.0) * 0.6);
          c += uGlow * up * 0.32 * pow(max(s, 0.0), 2.5) * (1.0 - clamp(abs(h) * 3.0, 0.0, 1.0));
          // the disc and its short rays (the boards' sun)
          float a = acos(s);
          float disc = 1.0 - smoothstep(0.03, 0.036, a);
          vec3 t1 = normalize(cross(uSunDir, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
          vec3 t2 = cross(t1, uSunDir);
          float ang = atan(dot(d, t2), dot(d, t1));
          float ray = pow(abs(cos(ang * 6.0)), 40.0) * smoothstep(0.045, 0.052, a) * (1.0 - smoothstep(0.075, 0.09, a));
          vec3 sunC = vec3(2.4, 1.8, 1.0);
          float vis = smoothstep(-0.03, 0.01, uSunDir.y) * step(0.0, h + 0.01);
          c = mix(c, sunC, disc * vis);
          c += sunC * 0.4 * ray * vis;
          if (uNight > 0.01 && h > 0.0) {
            vec3 q = floor(d * 170.0);
            float n = hash(q);
            float star = step(0.9968, n) * (0.5 + 0.5 * hash(q + 7.0));
            c += vec3(star) * uNight * smoothstep(0.02, 0.3, h) * 1.3;
          }
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  )
  sky.renderOrder = -10
  sky.frustumCulled = false
  group.add(sky)
  disposers.push(() => {
    sky.geometry.dispose()
    sky.material.dispose()
  })

  // dust in the evening air
  // (few and faint: at dusk white motes read as snow)
  const specks = motes({ count: 70, radius: 12, y0: 0.3, y1: 7, color: '#fff1c8', size: 0.028, opacity: 0.28, speed: 0.06, light })
  specks.group.position.set(axis.x, 0, axis.z - 9)
  group.add(specks.group)

  // ---- light ----
  const hemi = new THREE.HemisphereLight('#c4d4ec', '#6a5a46', 1)
  const sun = new THREE.DirectionalLight('#fff1d8', 2)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  const S = 15
  sun.shadow.camera.left = sun.shadow.camera.bottom = -S
  sun.shadow.camera.right = sun.shadow.camera.top = S
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 700
  sun.shadow.bias = -0.0005
  sun.shadow.normalBias = 0.04
  sun.target.position.set(axis.x, 0, axis.z - 9)
  group.add(hemi, sun, sun.target)

  const background = HORIZON.day.clone()
  const fog = new THREE.Fog(HORIZON.day.clone(), 500, 7600)
  const sunDir = new THREE.Vector3()
  const lightDir = new THREE.Vector3()
  const look = { day: 1, dusk: 0, night: 0, hour }
  const tmp = new THREE.Color()

  /** The clock (hours, summer time, 21 June): the sun, the sky, the haze, the light, the lights after dark. */
  function setTime(h) {
    look.hour = h
    sunAt(h, sunDir)
    const e = sunDir.y
    const day = smooth(0.02, 0.55, e)
    const night = 1 - smooth(-0.17, 0.02, e)
    const dusk = (1 - smooth(0.05, 0.42, e)) * smooth(-0.2, 0.02, e)
    look.day = day
    look.dusk = dusk
    look.night = night
    skyU.uSunDir.value.copy(sunDir)
    skyU.uZenith.value.copy(ZENITH.night).lerp(ZENITH.dusk, 1 - night).lerp(ZENITH.day, day)
    const hz = skyU.uHorizon.value.copy(HORIZON.night).lerp(HORIZON.dusk, 1 - night).lerp(HORIZON.day, day)
    skyU.uGlow.value.copy(GLOW.day).lerp(GLOW.dusk, clamp(dusk * 1.6)).multiplyScalar(1 - night)
    skyU.uNight.value = clamp(night * 1.2 + dusk * 0.2)
    background.copy(hz)
    fog.color.copy(hz).lerp(skyU.uZenith.value, 0.12)
    const up = smooth(-0.01, 0.12, e)
    sun.intensity = 2.6 * up * (0.6 + 0.4 * day)
    sun.color.set('#ffb070').lerp(tmp.set('#fff2dc'), smooth(0.06, 0.45, e))
    // the light comes from far along the sun's direction (so the lattice high above throws its shadow)
    lightDir.copy(sunDir)
    if (lightDir.y < 0.02) lightDir.setY(0.02).normalize()
    sun.position.copy(sun.target.position).addScaledVector(lightDir, 320)
    hemi.intensity = 0.25 + 0.75 * day + 0.3 * dusk + 0.35 * night
    hemi.color.copy(hz).lerp(skyU.uZenith.value, 0.3).lerp(tmp.set('#ffffff'), 0.3 * day)
    // after dark the tower's golden lights (sodium lamps in its lattice since 1985) light the deck warm
    hemi.groundColor.set('#6a5a46').lerp(tmp.set('#c9862f'), night * 0.8)
    const lit = smooth(0.25, 0.85, night + dusk * 0.4)
    mats.iron.emissiveIntensity = 0.36 * lit
    mats.ironSolid.emissiveIntensity = 0.28 * lit
    groundMat.emissiveIntensity = 1.4 * lit
    houseMat.emissiveIntensity = 0.9 * lit
    groundMat.color.setScalar(0.35 + 0.65 * (1 - night))
    houseMat.color.setScalar(0.3 + 0.7 * (1 - night))
  }
  setTime(hour)

  // ---- where the visitor can walk ----
  const walk = { x0: axis.x - legIn + 0.25, x1: axis.x + legIn - 0.25, z0: north + 0.6, z1: axis.z - 0.8 }
  const solids = [
    box(axis.x, north + 0.2, 2 * legIn + 2, 0.8),
    box(axis.x, walk.z1 + 0.4, 2 * legIn + 2, 0.5),
    ...[-1, 1].map(s => box(axis.x + s * (legIn + 0.2), (north + walk.z1) / 2, 0.5, walk.z1 - north + 1)),
  ]

  return {
    group,
    solids,
    mats,
    sun,
    sunDir,
    look,
    setTime,
    walk,
    parapet: PAR,
    axis,
    env: {
      background,
      fog,
      exposure: 1.0,
      envIntensity: 0.3,
      bloom: { strength: 0.42, radius: 0.5, threshold: 0.88 },
      fov: 62,
      near: 0.1,
      far: 9500,
      shadows: true,
    },
    cameraBounds: { minX: walk.x0 - 0.2, maxX: walk.x1 + 0.2, minY: 0.35, maxY: 12, minZ: walk.z0 - 0.3, maxZ: walk.z1 },
    update(t) {
      specks.update(t)
    },
    dispose: () => disposers.forEach(f => f()),
  }
}
