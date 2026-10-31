// Iron's picture "A dagger from outer space?" as a room (docs/knowledge/picture-rooms.md): the farm Hoba
// West near Grootfontein, Namibia, at golden hour (stages/dig.js: the low sun behind the arrival, the sky
// ahead deepening to navy with the first stars; now and then a shooting star). Hoba, the biggest meteorite,
// lies in its hollow ringed by a stone step and paving; flat-topped acacias and termite mounds round the
// field. Four things to do, each step chosen by tapping its thing (the user, 2026-10-30), E opening the
// station's panel, whose buttons (and sliders) do the same:
// - Hoba: tap the X-ray meter (or the block): it hops onto the block and reads the metal, the picture's lens
//   above it filling with its atoms (about 83% iron, 16% nickel, a little cobalt); tap the magnet on its
//   tripod: it swings to the block and clings (again: pulled off); tap the big scale behind the block: an
//   elephant lands on its pan (models at 1:19, as the Hoba model on the other pan), ten balance (a slider too);
// - Tutankhamun's dagger, a copy in a case at the hollow's rim: tap its blade, the meter reads 10.8% nickel
//   and 0.58% cobalt (Comelli and colleagues, 2016); tap the smelted iron knife beside it: hardly any;
// - the etching bench in a tent: three pieces (Gibeon, Hoba, smelted iron); tap one to work on it, then the
//   saw, the polishing wheel, the acid dropper: only Gibeon grows the Widmanstätten pattern; the lens on its
//   rail shows each finished piece's atoms (kamacite and taenite in Gibeon); the crate gives new pieces;
// - a little planet under a glass dome, cut open: tap it, it melts and its metal sinks into a core; the lens
//   beside it grows the core's plates, wider the slower it cools (tap the lens, or a slider from 25 to 6400
//   °C per million years); tap it again: a rock smashes it, iron and stony pieces fly, one falls on a little
//   Earth; tap the pieces for a new one.
// Not the Star Forge (iron made in stars) nor silicon's earth (the Earth's core). All four are shared in a
// room (src/net/shared.js). parts.<exhibit>.tap(...) does what a tap does (probes).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { canvasTex, at, clamp, lerp, random, num, hdr, fill } from '../../../wings/noble/kit.js'
import { digStage, soilTexture } from '../../stages/dig.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { makeText } from '../../../../engine/text.js'
import { box, circle } from '../../../../engine/collide.js'
import { METEORITE_WORDS } from './meteorite.words.js'

export const WORDS = METEORITE_WORDS

const TAU = Math.PI * 2
const V3 = (x, y, z) => new THREE.Vector3(x, y, z)
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))
const r1 = v => Math.round(v * 10) / 10
const int = (v, a, b) => clamp(Math.round(Number(v) || 0), a, b)

const VIOLET = '#9a8cff' // the picture's lens
const HOBA_C = '#f0a860'
const DAGGER_C = '#ffd166'
const ETCH_C = '#8fd0ff'
const ROCK_C = '#ff9a5c'
const ATOM = { Fe: '#c4562a', Ni: '#4fd04f', Co: '#f08aa0', none: '#5d6270' }

// ---- the ground plan ----
const H = { x: 0, z: -3.4 } // Hoba's hollow
const FLOOR_R = 2.9
const STEP_R = 3.5
const SQ = 3.9 // half the paved square round the hollow (a pit cut in the stage's field)
const FLOOR_Y = -0.44
const STEP_Y = -0.22
const BLK = { w: 2.7, h: 0.9 } // Hoba: about 2.7 x 2.7 x 0.9 m
const TOP = FLOOR_Y + BLK.h
const TRI = { x: 2.15, y: 1.35, z: -3.4, len: 1.2 } // the magnet's tripod: its apex and the string
const MAG_S = 2 // the horseshoe magnet's size (1: 12 cm across)
const BAL = { x: 0, z: -7.3, y: 1.75, arm: 1.3, hang: 0.85, pan: 0.55 } // the big scale, behind the block
const CASE = { x: 3.25, z: -0.45, top: 0.93 }
const TENT = { x0: -9.2, x1: -5.6, z0: -3.7, z1: -0.9, eave: 2.1, ridge: 2.75 }
const BENCH = { z: -3.3, d: 0.8, top: 0.9, x0: -9.0, x1: -5.8, pz: -3.42 }
const PIECE_X = [-8.1, -7.4, -6.7]
const TBL = { x: 7.2, z: -2.6, top: 0.85, r: 0.7 }
const DOME_R = 0.86
const SCALE = 19 // the scale's models: Hoba and the elephants at 1:19
const ELEPHANT_T = 6 // an African bush elephant bull, about 6 t
const HOBA_T = 60
const MAX_EL = 12
const SLOW = 40
const FAST = 3000
const RATE_MIN = 25
const RATE_MAX = 6400
const SPOTS = { hoba: { x: 0, z: 0.9 }, dagger: { x: 3.25, z: 0.85 }, etch: { x: -7.4, z: -1.9 }, asteroid: { x: 7.0, z: -0.7 } }

// how long each thing takes (s)
const XRF_T = 3.2
const DG_T = 2.4
const MELT_T = 9.5
const SMASH_T = 4.4
const GATHER_T = 1.6
const TOOL_T = { pick: 0.5, saw: 2.8, polish: 2.6, acid: 3.6, fresh: 1.0 }

// ---- small pieces ----

/** A smooth noise over directions, about -1..1 (sums of plane waves). */
function noise3(seed) {
  const r = random(seed)
  const waves = Array.from({ length: 7 }, (_, i) => ({
    d: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
    f: 1.4 + i * 0.9 + r() * 1.2,
    p: r() * TAU,
    a: 1 / (1 + i * 0.7),
  }))
  const norm = waves.reduce((s, w) => s + w.a, 0) * 0.6
  return (x, y, z) => waves.reduce((s, w) => s + w.a * Math.sin((w.d.x * x + w.d.y * y + w.d.z * z) * w.f + w.p), 0) / norm
}

/** A rough rock (unit size), smooth-shaded. */
function lumpGeometry(seed, amp = 0.18, detail = 2) {
  const g0 = new THREE.IcosahedronGeometry(1, detail)
  g0.deleteAttribute('normal')
  g0.deleteAttribute('uv')
  const g = mergeVertices(g0)
  const n = noise3(seed)
  const p = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize()
    v.multiplyScalar(1 + amp * clamp(n(v.x * 1.3, v.y * 1.3, v.z * 1.3), -1, 1))
    p.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

/** A rough lump (unit size) cut in two along z = 0: the back half, the front cap the saw takes off, and the
 *  flat face between them. Both halves share the surface's bumps, so they meet along the cut. */
function cutLump(seed, amp = 0.14) {
  const n = noise3(seed)
  const bump = (x, y, z) => 1 + amp * clamp(n(x * 1.4, y * 1.4, z * 1.4), -1, 1)
  const half = thetaStart => {
    const g = new THREE.SphereGeometry(1, 36, 12, 0, TAU, thetaStart, Math.PI / 2)
    g.rotateX(Math.PI / 2)
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize()
      v.multiplyScalar(bump(v.x, v.y, v.z))
      p.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    return g
  }
  const N = 48
  const pts = [0, 0, 0]
  const uv = [0.5, 0.5]
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * TAU
    const c = Math.cos(a)
    const s = Math.sin(a)
    const k = bump(c, s, 0)
    pts.push(c * k, s * k, 0)
    uv.push(0.5 + c * k * 0.43, 0.5 + s * k * 0.43)
  }
  const idx = []
  for (let i = 1; i <= N; i++) idx.push(0, i, i + 1)
  const face = new THREE.BufferGeometry()
  face.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  face.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  face.setIndex(idx)
  face.computeVertexNormals()
  return { back: half(Math.PI / 2), cap: half(0), face }
}

/** A meteorite's weathered skin: rust and dark blotches, thumbprint pits, grit. */
function crustTexture(seed, { base = '#5b3e2c', rust = ['#8f512a', '#a8662f'], dark = '#2e2018', pits = 40, size = 512 } = {}) {
  const rnd = random(seed)
  return canvasTex(size, size, (g, w) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, w)
    for (let i = 0; i < 260; i++) {
      const r = 6 + rnd() * 40
      g.globalAlpha = 0.12 + rnd() * 0.25
      g.fillStyle = rnd() < 0.55 ? rust[Math.floor(rnd() * rust.length)] : dark
      g.beginPath()
      g.ellipse(rnd() * w, rnd() * w, r, r * (0.5 + rnd() * 0.5), rnd() * 3, 0, TAU)
      g.fill()
    }
    g.globalAlpha = 1
    // thumbprint pits (regmaglypts) the hot flight scooped out
    for (let i = 0; i < pits; i++) {
      const x = rnd() * w
      const y = rnd() * w
      const r = 5 + rnd() * 16
      const grd = g.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r)
      grd.addColorStop(0, 'rgba(25,15,10,0.5)')
      grd.addColorStop(0.8, 'rgba(40,25,16,0.22)')
      grd.addColorStop(1, 'rgba(190,120,70,0.22)')
      g.fillStyle = grd
      g.beginPath()
      g.arc(x, y, r, 0, TAU)
      g.fill()
    }
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(20,12,8,0.35)' : 'rgba(210,140,80,0.22)'
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** Flagstones in mortar, mid-toned (a pale floor blooms white in the low sun). Tiles: one per 1.6 m. */
function flagTexture(seed) {
  const rnd = random(seed)
  return canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#4a4036'
    g.fillRect(0, 0, w, w)
    const n = 4
    const cell = w / n
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cx = (i + 0.5) * cell + (rnd() - 0.5) * cell * 0.15
        const cy = (j + 0.5) * cell + (rnd() - 0.5) * cell * 0.15
        const pts = []
        for (let a = 0; a < 7; a++) {
          const ang = (a / 7) * TAU + rnd() * 0.4
          const rr = cell * (0.42 + rnd() * 0.1)
          pts.push([Math.cos(ang) * rr, Math.sin(ang) * rr])
        }
        const v = 112 + rnd() * 34
        const fillC = `rgb(${v + 22},${v + 6},${v - 12})`
        // drawn again across the edges, so the tiles repeat without seams
        for (const ox of [-w, 0, w]) {
          for (const oy of [-w, 0, w]) {
            g.fillStyle = fillC
            g.beginPath()
            pts.forEach(([x, y], q) => (q ? g.lineTo(cx + ox + x, cy + oy + y) : g.moveTo(cx + ox + x, cy + oy + y)))
            g.closePath()
            g.fill()
          }
        }
      }
    }
    for (let i = 0; i < 4200; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(40,30,22,0.22)' : 'rgba(220,200,170,0.14)'
      g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 2, 1 + rnd() * 2)
    }
  }, { repeat: true })
}

/** A dry-stone wall: flat stones laid in rows, dark gaps (u around, v up; 1 tile = 1.4 x 0.22 m). */
function drystoneTexture(seed) {
  const rnd = random(seed)
  return canvasTex(512, 96, (g, w, h) => {
    g.fillStyle = '#2f2820'
    g.fillRect(0, 0, w, h)
    const rows = 3
    for (let r = 0; r < rows; r++) {
      const y0 = (r / rows) * h
      const rh = h / rows
      let x = -rnd() * 40
      while (x < w) {
        const sw = 34 + rnd() * 60
        const v = 108 + rnd() * 40
        g.fillStyle = `rgb(${v + 20},${v + 4},${v - 14})`
        g.beginPath()
        g.roundRect(x + 2, y0 + 2, sw - 4, rh - 4, 6)
        g.fill()
        g.fillStyle = 'rgba(255,240,210,0.12)'
        g.fillRect(x + 4, y0 + 3, sw - 8, 3)
        x += sw
      }
    }
  }, { repeat: true })
}

/** The Widmanstätten pattern on a canvas: plates of kamacite in three directions (the octahedral planes cut
 *  by a slice), edged with bright taenite, dark plessite between. `band`: the plates' width in pixels;
 *  `grow` (0..1): how far they have grown. The same seed draws the same slice. */
function drawWidman(g, w, h, { band = 14, grow = 1, seed = 5 } = {}) {
  const rnd = random(seed)
  g.fillStyle = '#4b4f56'
  g.fillRect(0, 0, w, h)
  for (let i = 0; i < (w * h) / 60; i++) {
    g.fillStyle = rnd() < 0.5 ? 'rgba(25,27,31,0.35)' : 'rgba(160,164,170,0.16)'
    g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5)
  }
  const dirs = [0.26, 0.26 + Math.PI / 3, 0.26 + (2 * Math.PI) / 3]
  const shades = ['#b9bdc3', '#9da2a9', '#cbcfd4']
  const count = Math.round(((w * h) / (band * 52)) * 0.95)
  for (let i = 0; i < count; i++) {
    const p = { x: rnd() * w, y: rnd() * h, d: Math.floor(rnd() * 3), len: band * (4 + rnd() * 9), wid: band * (0.7 + rnd() * 0.6), t0: rnd() * 0.55 }
    const k = clamp((grow - p.t0) / (1 - p.t0))
    if (k <= 0) continue
    const L = p.len * k
    const W = Math.max(1, p.wid * (0.35 + 0.65 * k))
    g.save()
    g.translate(p.x, p.y)
    g.rotate(dirs[p.d])
    g.fillStyle = shades[p.d]
    g.fillRect(-L / 2, -W / 2, L, W)
    g.strokeStyle = '#f2f4f7'
    g.lineWidth = Math.max(1, band * 0.13)
    g.strokeRect(-L / 2, -W / 2, L, W)
    g.restore()
  }
}

/** A soft round dot (glows, sparks). */
function softDot() {
  return canvasTex(64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** A shiny bead's light (a matcap): every atom in the room shares it, coloured per instance. */
function beadMatcap() {
  return canvasTex(128, 128, (g, w) => {
    const grd = g.createRadialGradient(w * 0.36, w * 0.3, w * 0.03, w * 0.5, w * 0.5, w * 0.52)
    grd.addColorStop(0, '#ffffff')
    grd.addColorStop(0.22, '#dcdcdc')
    grd.addColorStop(0.7, '#8c8c8c')
    grd.addColorStop(1, '#3c3c3c')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** The picture's lens: a dark disc in a glowing ring, close-packed atoms in it (a layer seen face on).
 *  setMix(kinds, lit) colours them ('Fe', 'Ni', 'Co'; unlit ones grey), open (0..1) scales it in. */
function atomLens({ r, spacing, ring = VIOLET, matcap }) {
  const group = new THREE.Group()
  const face = new THREE.Group()
  group.add(face)
  const backing = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ color: '#141a3c' }))
  const ringMat = new THREE.MeshStandardMaterial({ color: ring, emissive: ring, emissiveIntensity: 0.9, roughness: 0.4 })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r, Math.max(0.012, r * 0.06), 10, 64), ringMat)
  rim.position.z = 0.01
  const gloss = new THREE.Mesh(new THREE.TorusGeometry(r * 0.8, r * 0.02, 6, 32, 1.1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.28 }))
  gloss.rotation.z = 1.9
  gloss.position.z = spacing * 1.1
  face.add(backing, rim, gloss)
  const pts = []
  const rows = Math.ceil(r / (spacing * 0.866)) + 1
  for (let j = -rows; j <= rows; j++) {
    const y = j * spacing * 0.866
    const off = (j & 1) * spacing * 0.5
    for (let i = -rows - 1; i <= rows + 1; i++) {
      const x = i * spacing + off
      if (Math.hypot(x, y) < r - spacing * 0.55) pts.push([x, y])
    }
  }
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(spacing * 0.47, 16, 12), new THREE.MeshMatcapMaterial({ matcap }), pts.length)
  const o = new THREE.Object3D()
  const grey = new THREE.Color(ATOM.none)
  pts.forEach(([x, y], i) => {
    o.position.set(x, y, spacing * 0.5)
    o.updateMatrix()
    atoms.setMatrixAt(i, o.matrix)
    atoms.setColorAt(i, grey)
  })
  atoms.instanceColor.needsUpdate = true
  face.add(atoms)
  const col = new THREE.Color()
  const cols = Object.fromEntries(Object.entries(ATOM).map(([k, c]) => [k, new THREE.Color(c)]))
  let lastKinds = null
  let lastLit = -1
  return {
    group,
    face,
    pts,
    ringMat,
    /** kinds[i] for each atom; `lit` (0..1) lights them in order of `rank` (a sweep). */
    setMix(kinds, lit = 1, rank = null) {
      const q = Math.round(lit * 60)
      if (kinds === lastKinds && q === lastLit) return
      lastKinds = kinds
      lastLit = q
      kinds.forEach((k, i) => {
        const on = lit >= 1 || (rank ? rank[i] : i / kinds.length) < lit
        col.copy(on ? cols[k] ?? grey : grey)
        atoms.setColorAt(i, col)
      })
      atoms.instanceColor.needsUpdate = true
    },
    setOpen(k) {
      face.scale.setScalar(Math.max(0.001, k))
      group.visible = k > 0.002
    },
  }
}

/** Which atom is which: a share `ni` of nickel and `co` of cobalt (at least one when asked for), the rest
 *  iron, scattered by a seed; `region(x, y)` can give each atom its own shares (Gibeon's two alloys). */
function mixAtoms(pts, { ni = 0, co = 0, seed = 1, region = null }) {
  const rnd = random(seed)
  const groups = {}
  pts.forEach(([x, y], i) => {
    const g = region ? region(x, y) : { ni, co, id: 0 }
    ;(groups[g.id] ??= { ...g, ids: [] }).ids.push(i)
  })
  const out = new Array(pts.length).fill('Fe')
  for (const g of Object.values(groups)) {
    const order = g.ids.map(i => [rnd(), i]).sort((a, b) => a[0] - b[0]).map(p => p[1])
    const nNi = Math.round(g.ni * order.length)
    const nCo = g.co > 0 ? Math.max(1, Math.round(g.co * order.length)) : 0
    order.forEach((i, k) => (out[i] = k < nNi ? 'Ni' : k < nNi + nCo ? 'Co' : 'Fe'))
  }
  return out
}

/** An elephant figurine (facing +z, standing on y = 0, about 0.86 long), one geometry with its colours. */
function elephantGeometry() {
  const parts = []
  const grey = new THREE.Color('#8f8a84')
  const dark = new THREE.Color('#6c6762')
  const ivory = new THREE.Color('#efe6cf')
  const add = (geo, color, pos, rot = [0, 0, 0], scl = [1, 1, 1]) => {
    const g = geo.index ? geo.toNonIndexed() : geo
    g.deleteAttribute('uv')
    g.applyMatrix4(new THREE.Matrix4().compose(V3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), V3(...scl)))
    const n = g.attributes.position.count
    const c = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) c.set([color.r, color.g, color.b], i * 3)
    g.setAttribute('color', new THREE.BufferAttribute(c, 3))
    parts.push(g)
  }
  add(new THREE.SphereGeometry(0.5, 14, 10), grey, [0, 0.4, -0.04], [0, 0, 0], [0.42, 0.36, 0.64])
  add(new THREE.SphereGeometry(0.5, 12, 10), grey, [0, 0.5, 0.3], [0, 0, 0], [0.3, 0.3, 0.28])
  for (const s of [-1, 1]) {
    add(new THREE.SphereGeometry(0.5, 10, 8), dark, [s * 0.16, 0.5, 0.24], [0, s * 0.5, 0], [0.05, 0.28, 0.24])
    add(new THREE.ConeGeometry(0.018, 0.14, 6), ivory, [s * 0.06, 0.37, 0.44], [1.9, 0, 0])
    for (const z of [-0.18, 0.16]) add(new THREE.CylinderGeometry(0.065, 0.06, 0.3, 8), grey, [s * 0.11, 0.15, z])
  }
  add(new THREE.CylinderGeometry(0.03, 0.055, 0.36, 8), grey, [0, 0.3, 0.45], [0.22, 0, 0])
  add(new THREE.CylinderGeometry(0.008, 0.012, 0.18, 4), dark, [0, 0.38, -0.38], [-0.5, 0, 0])
  return mergeGeometries(parts)
}

/** A handheld X-ray fluorescence meter: its nose along +z, the grip down, a little screen on top. */
function meterModel(M) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.08, 0.2, 2, 0.02), M.yellow)
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.05, 14).rotateX(Math.PI / 2), M.black)
  nose.position.z = 0.12
  const tip = new THREE.Mesh(new THREE.CircleGeometry(0.019, 14), M.steel)
  tip.position.z = 0.1455
  const grip = new THREE.Mesh(new RoundedBoxGeometry(0.045, 0.12, 0.055, 2, 0.015), M.black)
  grip.position.set(0, -0.085, -0.045)
  grip.rotation.x = 0.3
  const screenMat = new THREE.MeshBasicMaterial({ color: hdr('#5fe0c8', 0.5) })
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.055, 0.045), screenMat)
  scr.position.set(0, 0.0415, -0.04)
  scr.rotation.x = -Math.PI / 2
  g.add(body, nose, tip, grip, scr)
  return { group: g, screenMat }
}

/** Tutankhamun's dagger (the copy): the blade along +x from the guard, lying flat; a gold hilt in bands
 *  with a rock-crystal knob. About 0.34 m long. */
function daggerModel(M) {
  const g = new THREE.Group()
  const s = new THREE.Shape()
  s.moveTo(0, -0.016)
  s.quadraticCurveTo(0.1, -0.019, 0.195, -0.004)
  s.lineTo(0.21, 0)
  s.lineTo(0.195, 0.004)
  s.quadraticCurveTo(0.1, 0.019, 0, 0.016)
  s.closePath()
  const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.002, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 1, curveSegments: 10 }), M.blade)
  blade.rotation.x = -Math.PI / 2
  blade.position.y = 0.004
  const rib = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.003, 0.004), M.bladeDark)
  rib.position.set(0.09, 0.0075, 0)
  const guard = new THREE.Mesh(new RoundedBoxGeometry(0.014, 0.014, 0.05, 2, 0.004), M.gold)
  guard.position.set(-0.006, 0.006, 0)
  g.add(blade, rib, guard)
  const bands = [M.gold, M.inlayRed, M.gold, M.inlayBlue, M.gold, M.inlayGreen, M.gold, M.inlayRed, M.gold]
  bands.forEach((m, i) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, 0.0115, 14).rotateZ(Math.PI / 2), m)
    c.position.set(-0.019 - i * 0.0115, 0.012, 0)
    g.add(c)
  })
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.019, 16, 12), M.crystal)
  knob.position.set(-0.13, 0.014, 0)
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.013, 0.008, 14).rotateZ(Math.PI / 2), M.gold)
  cap.position.set(-0.117, 0.012, 0)
  g.add(knob, cap)
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.07), M.hit)
  hit.position.set(0.04, 0.02, 0)
  g.add(hit)
  return g
}

/** A plain smelted-iron knife: a dark blade along +x, a wooden handle. */
function knifeModel(M) {
  const g = new THREE.Group()
  const s = new THREE.Shape()
  s.moveTo(0, -0.012)
  s.lineTo(0.13, -0.01)
  s.quadraticCurveTo(0.16, -0.004, 0.17, 0.006)
  s.lineTo(0, 0.012)
  s.closePath()
  const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.002, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0015, bevelSegments: 1, curveSegments: 6 }), M.iron)
  blade.rotation.x = -Math.PI / 2
  blade.position.y = 0.003
  const handle = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.018, 0.026, 2, 0.007), M.wood)
  handle.position.set(-0.05, 0.009, 0)
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.06), M.hit)
  hit.position.set(0.035, 0.02, 0)
  g.add(blade, handle, hit)
  return g
}

/** A frame saw: the blade along x at y = 0, the frame above it (deep enough for a whole piece). */
function sawModel(M) {
  const g = new THREE.Group()
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.02, 0.0016), M.steel)
  g.add(blade)
  for (const s of [-1, 1]) {
    const up = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.38, 0.014), M.sawFrame)
    up.position.set(s * 0.235, 0.18, 0)
    g.add(up)
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.484, 0.016, 0.016), M.sawFrame)
  top.position.y = 0.37
  const handle = new THREE.Mesh(new RoundedBoxGeometry(0.035, 0.11, 0.035, 2, 0.01), M.handle)
  handle.position.set(0.27, 0.07, 0)
  handle.rotation.z = -0.25
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.4, 0.08), M.hit)
  hit.position.y = 0.18
  g.add(top, handle, hit)
  return g
}

/** A handheld polisher: a felt disc facing -z at the origin, the motor behind it along +z. */
function polisherModel(M) {
  const g = new THREE.Group()
  const disc = new THREE.Group()
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.014, 28).rotateX(Math.PI / 2), M.felt)
  pad.position.z = 0.007
  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.008, 0.002), M.handle)
  mark.position.z = -0.001
  disc.add(pad, mark)
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.04, 0.16, 18).rotateX(Math.PI / 2), M.black)
  body.position.z = 0.1
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.041, 0.041, 0.03, 18).rotateX(Math.PI / 2), M.orange)
  band.position.z = 0.06
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.17, 0.22), M.hit)
  hit.position.z = 0.09
  g.add(disc, body, band, hit)
  return { group: g, disc }
}

/** A flat-topped acacia (umbrella thorn): a forked trunk under a wide, flat crown. */
function acacia(M, seed) {
  const g = new THREE.Group()
  const rnd = random(seed)
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.2, 2.4, 8), M.bark)
  trunk.position.y = 1.2
  trunk.rotation.z = (rnd() - 0.5) * 0.15
  g.add(trunk)
  const top = V3(trunk.rotation.z * -1.2, 2.35, 0)
  const crown = []
  for (const s of [-1, 1]) {
    const end = V3(s * (0.9 + rnd() * 0.4), 3.25 + rnd() * 0.2, (rnd() - 0.5) * 0.6)
    const d = end.clone().sub(top)
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, d.length(), 6), M.bark)
    br.position.copy(top).addScaledVector(d, 0.5)
    br.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize())
    g.add(br)
    crown.push(end)
  }
  for (const [x, z, sx] of [[-0.8, 0, 1.6], [0.8, 0.1, 1.7], [0, -0.4, 1.4], [0.1, 0.6, 1.3]]) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), M.crownTop)
    c.scale.set(sx, 0.3, sx * 0.85)
    c.position.set(x, 3.45 + rnd() * 0.15, z)
    c.castShadow = true
    g.add(c)
    const under = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 6, 0, TAU, Math.PI / 2, Math.PI / 2), M.crownUnder)
    under.scale.set(sx * 0.98, 0.18, sx * 0.83)
    under.position.copy(c.position).add(V3(0, -0.02, 0))
    g.add(under)
  }
  return g
}

/** A termite mound: a lumpy, tall cone of red earth with a turret or two. */
function termiteMound(mat, seed) {
  const g = new THREE.Group()
  const rnd = random(seed)
  const make = (r, h) => {
    const geo = new THREE.ConeGeometry(r, h, 14, 8)
    geo.deleteAttribute('normal')
    geo.deleteAttribute('uv')
    const m = mergeVertices(geo)
    const n = noise3(seed + Math.round(h * 10))
    const p = m.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = p.getZ(i)
      const k = 1 + 0.18 * n(x * 2, y * 1.5, z * 2)
      p.setXYZ(i, x * k, y, z * k)
    }
    m.computeVertexNormals()
    const mesh = new THREE.Mesh(m, mat)
    mesh.position.y = h / 2
    mesh.castShadow = true
    return mesh
  }
  g.add(make(0.62, 2.1))
  const t1 = make(0.28, 1.1 + rnd() * 0.4)
  t1.position.set(0.32, t1.position.y, 0.12)
  g.add(t1)
  const t2 = make(0.22, 0.7)
  t2.position.set(-0.3, t2.position.y, -0.15)
  g.add(t2)
  return g
}

/** A card with a word (facing +z), its edge in a colour, sized to the word. */
function card(word, color, cardMat, { size = 0.12, maxWidth = 1.4, textColor = '#3a2412' } = {}) {
  const g = new THREE.Group()
  const edge = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.012), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }))
  const board = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.02), cardMat)
  board.position.z = 0.005
  const text = makeText(word, { size, color: textColor, maxWidth, lineHeight: 1.05 })
  text.position.z = 0.018
  g.add(edge, board, text)
  const fit = (w, h) => {
    board.scale.set(w + size * 1.2, h + size * 0.9, 1)
    edge.scale.set(w + size * 1.2 + 0.03, h + size * 0.9 + 0.03, 1)
  }
  fit(Math.min(maxWidth, word.length * size * 0.56), size)
  text.addEventListener('synccomplete', () => {
    const b = text.textRenderInfo?.blockBounds
    if (b) fit(b[2] - b[0], b[3] - b[1])
  })
  return g
}

/** A quad from four corners, counter-clockwise seen from its front; UVs from `uv` (four pairs). */
function quad(a, b, c, d, uv) {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex([0, 1, 2, 0, 2, 3])
  geo.computeVertexNormals()
  return geo
}

/** A thin rod from a to b (set again whenever they move). */
function rod(mat, r = 0.005, seg = 6) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, seg), mat)
  const d = V3(0, 0, 0)
  const up = V3(0, 1, 0)
  m.userData.set = (a, b) => {
    d.copy(b).sub(a)
    const L = d.length()
    m.position.copy(a).addScaledVector(d, 0.5)
    m.scale.set(1, Math.max(1e-4, L), 1)
    if (L > 1e-6) m.quaternion.setFromUnitVectors(up, d.normalize())
  }
  return m
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, depth, lang, clickable }) {
  const ACACIAS = [[-10.4, -7.6, 1.0, 3], [9.4, -8.8, 1.15, 5], [-11.0, 6.6, 0.9, 7], [10.8, 5.4, 1.05, 9]]
  const MOUNDS = [[-4.6, -10.9, 1.0, 11], [11.4, -1.2, 0.8, 13], [-11.4, 1.8, 1.15, 17]]
  const stage = digStage({
    light,
    radius: 13,
    sun: [-0.5, 0.2, 0.84],
    pits: [{ x0: H.x - SQ, x1: H.x + SQ, z0: H.z - SQ, z1: H.z + SQ }],
    bare: [
      [(TENT.x0 + TENT.x1) / 2, (TENT.z0 + TENT.z1) / 2 + 0.4, 4.4, 4.2],
      [TBL.x, TBL.z + 0.7, 3.2, 3.6],
      [0, 2.7, 1.8, 4.4],
    ],
    clear: [...ACACIAS.map(([x, z]) => [x, z, 1.0]), ...MOUNDS.map(([x, z]) => [x, z, 1.0]), [CASE.x, CASE.z, 0.8]],
  })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  let clock = 0
  const paras = list => list.map(p => ({ p }))
  const refresh = make => {
    if (ctx.store.get().panel?.make === make) ctx.showPanel(make)
  }
  /** A find: counted now; its panel opens after `delay` seconds the first time, if the visitor is still at
   *  that station. */
  const findOnce = (id, panel, delay) => {
    if (ex.discover(id)) later(delay, () => ctx.engine.player?.near?.id === id && ctx.showPanel(panel))
  }
  /** A station's view: `size` metres high and `wide` across (an upright phone fits the width too). */
  const view = (x, y, z, size, wide) => ({ x, y, z, size, width: wide })
  const busy = () => say(at(W.busy, level()))
  const sayLater = (s, entry, c) => later(s, () => say(at(entry, level()), c))
  const cam = () => ctx.camera
  const tmpQ = new THREE.Quaternion()

  const matcap = beadMatcap()
  const dotTex = softDot()
  textures.push(matcap, dotTex)
  const M = {
    card: new THREE.MeshStandardMaterial({ color: '#d6bf98', roughness: 0.85 }),
    wood: new THREE.MeshStandardMaterial({ color: '#7a5233', roughness: 0.8 }),
    darkWood: new THREE.MeshStandardMaterial({ color: '#4e3420', roughness: 0.85 }),
    brass: new THREE.MeshStandardMaterial({ color: '#c49a4a', roughness: 0.38, metalness: 0.55 }),
    steel: new THREE.MeshStandardMaterial({ color: '#b3bac2', roughness: 0.3, metalness: 0.8 }),
    iron: new THREE.MeshStandardMaterial({ color: '#5a5f66', roughness: 0.45, metalness: 0.6 }),
    blade: new THREE.MeshStandardMaterial({ color: '#a9b0b9', roughness: 0.32, metalness: 0.7 }),
    bladeDark: new THREE.MeshStandardMaterial({ color: '#737a84', roughness: 0.4, metalness: 0.6 }),
    gold: new THREE.MeshStandardMaterial({ color: '#e0b448', roughness: 0.3, metalness: 0.75, emissive: '#5a3c08', emissiveIntensity: 0.25 }),
    inlayRed: new THREE.MeshStandardMaterial({ color: '#b8322a', roughness: 0.4 }),
    inlayBlue: new THREE.MeshStandardMaterial({ color: '#2a55b0', roughness: 0.4 }),
    inlayGreen: new THREE.MeshStandardMaterial({ color: '#2f9a6a', roughness: 0.4 }),
    crystal: new THREE.MeshStandardMaterial({ color: '#ece8f4', roughness: 0.12, metalness: 0.1, emissive: '#3a3448', emissiveIntensity: 0.3 }),
    velvet: new THREE.MeshStandardMaterial({ color: '#5a1626', roughness: 1 }),
    black: new THREE.MeshStandardMaterial({ color: '#1f2026', roughness: 0.55 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#e2b13c', roughness: 0.45 }),
    orange: new THREE.MeshStandardMaterial({ color: '#e0762c', roughness: 0.5 }),
    felt: new THREE.MeshStandardMaterial({ color: '#e6dfd0', roughness: 0.95 }),
    handle: new THREE.MeshStandardMaterial({ color: '#8a2a22', roughness: 0.6 }),
    sawFrame: new THREE.MeshStandardMaterial({ color: '#3a5f8a', roughness: 0.5, metalness: 0.3 }),
    canvas: new THREE.MeshStandardMaterial({ color: '#c4b696', roughness: 0.95, side: THREE.DoubleSide }),
    pole: new THREE.MeshStandardMaterial({ color: '#8a7a64', roughness: 0.6, metalness: 0.3 }),
    rope: new THREE.MeshStandardMaterial({ color: '#d8d0bc', roughness: 0.9 }),
    magnet: new THREE.MeshStandardMaterial({ color: '#c0352c', roughness: 0.45, metalness: 0.3 }),
    bark: new THREE.MeshStandardMaterial({ color: '#4a3a2c', roughness: 0.95 }),
    crownTop: new THREE.MeshStandardMaterial({ color: '#5d6b32', roughness: 0.9, flatShading: true }),
    crownUnder: new THREE.MeshStandardMaterial({ color: '#2f3a1c', roughness: 1, side: THREE.DoubleSide }),
    mound: new THREE.MeshStandardMaterial({ color: '#9b6444', roughness: 1 }),
    amber: new THREE.MeshStandardMaterial({ color: '#7a3e10', roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 }),
    glassTube: new THREE.MeshStandardMaterial({ color: '#e6f4ff', roughness: 0.05, transparent: true, opacity: 0.45 }),
    glass: new THREE.MeshStandardMaterial({ color: '#e6f4ff', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }),
    hit: new THREE.MeshBasicMaterial({ visible: false }),
  }
  const glowSprite = (color, scale, opacity = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity }))
    s.scale.setScalar(scale)
    s.raycast = () => {}
    return s
  }
  const label3d = (text, size, color = '#ffffff', extra = {}) => makeText(text, { size, color, outlineWidth: size * 0.1, outlineColor: '#0a0f2a', anchorY: 'top', ...extra })
  const setText = (t, s) => {
    if (t.text !== s) {
      t.text = s
      t.sync()
    }
  }
  const facing = (fx, fz, tx, tz) => Math.atan2(tx - fx, tz - fz)

  // ======== the hollow: paving round it, a stone step down, the floor where Hoba lies ========
  const flagTex = flagTexture(4)
  const wallTex = drystoneTexture(6)
  const wallTex2 = wallTex.clone()
  const gravelTex = soilTexture({ seed: 21, base: '#8a7660' })
  textures.push(flagTex, wallTex, wallTex2, gravelTex)
  wallTex.repeat.set((TAU * STEP_R) / 1.4, 1)
  wallTex2.repeat.set((TAU * FLOOR_R) / 1.4, 1)
  wallTex2.needsUpdate = true
  const flagMat = new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.95 })
  const remap = (geo, per) => {
    const p = geo.attributes.position
    const uv = geo.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / per, p.getY(i) / per)
  }
  {
    const sq = new THREE.Shape()
    const e = SQ + 0.03
    sq.moveTo(-e, -e)
    sq.lineTo(e, -e)
    sq.lineTo(e, e)
    sq.lineTo(-e, e)
    sq.closePath()
    const hole = new THREE.Path()
    hole.absarc(0, 0, STEP_R, 0, TAU, true)
    sq.holes.push(hole)
    const pave = new THREE.ShapeGeometry(sq, 64)
    remap(pave, 1.6)
    pave.rotateX(-Math.PI / 2)
    const m = new THREE.Mesh(pave, flagMat)
    m.position.set(H.x, 0.004, H.z)
    m.receiveShadow = true
    root.add(m)
    const tread = new THREE.RingGeometry(FLOOR_R, STEP_R, 72, 1)
    remap(tread, 1.6)
    tread.rotateX(-Math.PI / 2)
    const t = new THREE.Mesh(tread, flagMat)
    t.position.set(H.x, STEP_Y, H.z)
    t.receiveShadow = true
    root.add(t)
    const floorGeo = new THREE.CircleGeometry(FLOOR_R, 72)
    remap(floorGeo, 1.2)
    floorGeo.rotateX(-Math.PI / 2)
    const fl = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: gravelTex, roughness: 1, color: '#c9bba6' }))
    fl.position.set(H.x, FLOOR_Y, H.z)
    fl.receiveShadow = true
    root.add(fl)
    // the risers: dry-stone walls facing in
    for (const [r, y, tex] of [[STEP_R, STEP_Y / 2, wallTex], [FLOOR_R, (STEP_Y + FLOOR_Y) / 2, wallTex2]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.22, 96, 1, true), new THREE.MeshStandardMaterial({ map: tex, roughness: 1, side: THREE.BackSide }))
      w.position.set(H.x, y, H.z)
      w.receiveShadow = true
      root.add(w)
    }
  }
  // the hollow's floor for walking: the step and the bottom
  const floorAt = (x, z) => {
    const r = Math.hypot(x - H.x, z - H.z)
    return r < FLOOR_R ? FLOOR_Y : r < STEP_R ? STEP_Y : 0
  }

  // ======== 1. Hoba itself ========
  const crust = crustTexture(11)
  textures.push(crust)
  const crustMat = new THREE.MeshStandardMaterial({ map: crust, roughness: 0.82, metalness: 0.18 })
  const block = new THREE.Mesh(
    (() => {
      // a natural block, not a box: the sides bulge and sag a little, the top waves
      const geo = new RoundedBoxGeometry(BLK.w, BLK.h, BLK.w, 6, 0.16)
      const n = noise3(13)
      const p = geo.attributes.position
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i)
        const y = p.getY(i)
        const z = p.getZ(i)
        const k = n(x * 0.7, y * 0.7, z * 0.7)
        p.setXYZ(i, x * (1 + 0.025 * k), y + (y > 0 ? 0.03 * n(x * 1.6, 3, z * 1.6) : 0), z * (1 + 0.025 * n(z, x, y)))
      }
      geo.computeVertexNormals()
      return geo
    })(),
    crustMat,
  )
  block.position.set(H.x, FLOOR_Y + BLK.h / 2, H.z)
  block.castShadow = true
  block.receiveShadow = true
  root.add(block)
  solids.push(box(H.x, H.z, BLK.w, BLK.w, { y0: FLOOR_Y - 1, y1: TOP }))

  // the X-ray meter: in its case on the floor, then nose-down on the block
  const meter = meterModel(M)
  meter.group.scale.setScalar(1.4)
  root.add(meter.group)
  const meterCase = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.13, 0.34, 2, 0.03), M.black)
  meterCase.position.set(-1.55, FLOOR_Y + 0.065, -1.25)
  meterCase.rotation.y = 0.5
  root.add(meterCase)
  solids.push(circle(meterCase.position.x, meterCase.position.z, 0.25, { y1: FLOOR_Y + 0.13 }))
  const XRF_AT = V3(-0.7, TOP, -2.5)
  const meterHome = { p: V3(-1.55, FLOOR_Y + 0.19, -1.25), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.5 + Math.PI / 2, Math.PI / 2, 'YXZ')) }
  const meterWork = { p: XRF_AT.clone().add(V3(0, 0.205, 0)), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)) }
  const xrfGlow = glowSprite(hdr('#c9b8ff', 1.6), 0.4, 0)
  xrfGlow.position.copy(XRF_AT).add(V3(0, 0.02, 0))
  root.add(xrfGlow)
  const meterHit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.42), M.hit)
  meter.group.add(meterHit)

  // the picture's lens above the block, and a faint beam from the meter's nose up to it
  const hobaLens = atomLens({ r: 0.45, spacing: 0.08, matcap })
  hobaLens.group.position.set(-1.35, 1.9, -2.7)
  hobaLens.group.rotation.y = facing(-1.35, -2.7, SPOTS.hoba.x, SPOTS.hoba.z)
  root.add(hobaLens.group)
  const hobaMix = mixAtoms(hobaLens.pts, { ni: 0.164, co: 0.008, seed: 23 })
  const hobaRank = (() => {
    const rnd = random(29)
    return hobaLens.pts.map(([x, y]) => clamp((y + 0.45) / 0.9 * 0.8 + rnd() * 0.2))
  })()
  const hobaLegend = label3d(E.hoba.legend, 0.085, '#ffffff')
  hobaLegend.position.set(0, -0.5, 0.02)
  hobaLens.face.add(hobaLegend)
  const beamMat = new THREE.MeshBasicMaterial({ color: hdr(VIOLET, 0.8), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.02, 1, 32, 1, true), beamMat)
  beam.raycast = () => {}
  root.add(beam)
  {
    // the beam's ends: the meter's contact up to the lens
    const d = hobaLens.group.position.clone().sub(XRF_AT)
    const L = d.length()
    beam.position.copy(XRF_AT).addScaledVector(d, 0.5)
    beam.scale.set(1, L, 1)
    beam.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize())
  }

  // the magnet on its tripod, beside the block's right side
  const apex = V3(TRI.x, TRI.y, TRI.z)
  const feet = [V3(1.62, FLOOR_Y, TRI.z - 0.5), V3(1.62, FLOOR_Y, TRI.z + 0.5), V3(2.78, FLOOR_Y, TRI.z)]
  const tripod = new THREE.Group()
  root.add(tripod)
  for (const f of feet) {
    const leg = rod(M.pole, 0.018)
    leg.userData.set(f, apex)
    tripod.add(leg)
  }
  {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), M.pole)
    knob.position.copy(apex)
    tripod.add(knob)
  }
  const string = rod(M.rope, 0.005)
  root.add(string)
  const magnet = new THREE.Group()
  {
    // a horseshoe hung by its bend (the group's origin): poles down at rest
    const bend = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.022, 10, 24, Math.PI), M.magnet)
    bend.position.y = -0.082
    const hit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.12), M.hit)
    hit.position.y = -0.12
    magnet.add(bend, hit)
    for (const s of [-1, 1]) {
      const legM = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.06, 10), M.magnet)
      legM.position.set(s * 0.06, -0.112, 0)
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.023, 0.026, 10), M.steel)
      tip.position.set(s * 0.06, -0.155, 0)
      magnet.add(legM, tip)
    }
  }
  magnet.scale.setScalar(MAG_S)
  root.add(magnet)
  const FACE_X = H.x + BLK.w / 2
  const PHI_C = Math.asin((TRI.x - (FACE_X + 0.168 * MAG_S)) / TRI.len)

  // the big scale behind the block: Hoba's model on the left pan, elephants on the right
  const bal = new THREE.Group()
  bal.position.set(BAL.x, 0, BAL.z)
  root.add(bal)
  const beamG = new THREE.Group()
  beamG.position.y = BAL.y
  bal.add(beamG)
  const pans = []
  let hobaSign = null
  let countSign = null
  let elephants = null
  {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 0.1, 28), M.darkWood)
    foot.position.y = 0.05
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, BAL.y - 0.1, 14), M.brass)
    post.position.y = 0.1 + (BAL.y - 0.1) / 2
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), M.brass)
    cap.position.y = BAL.y
    foot.castShadow = post.castShadow = true
    bal.add(foot, post, cap)
    // a little arc scale under the pivot, the pointer swinging over it
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.008, 6, 32, 0.9), M.brass)
    arc.rotation.z = -Math.PI / 2 - 0.45
    arc.position.set(0, BAL.y, 0.07)
    bal.add(arc)
    const bar = new THREE.Mesh(new RoundedBoxGeometry(BAL.arm * 2 + 0.14, 0.07, 0.07, 2, 0.02), M.brass)
    bar.castShadow = true
    const pointer = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.34, 0.018), M.brass)
    pointer.position.set(0, -0.19, 0.07)
    beamG.add(bar, pointer)
    for (const s of [-1, 1]) {
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), M.brass)
      knob.position.x = s * BAL.arm
      beamG.add(knob)
      const pan = new THREE.Group()
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(BAL.pan, BAL.pan - 0.06, 0.045, 36), M.brass)
      dish.castShadow = true
      dish.receiveShadow = true
      pan.add(dish)
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * TAU + 0.5
        const r = rod(M.brass, 0.007)
        r.userData.set(V3(Math.cos(a) * (BAL.pan - 0.03), 0.02, Math.sin(a) * (BAL.pan - 0.03)), V3(0, BAL.hang, 0))
        pan.add(r)
      }
      // an invisible drum over the pan, so a tap anywhere on the pan or its load counts
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(BAL.pan, BAL.pan, 0.5, 16), M.hit)
      hit.position.y = 0.2
      pan.add(hit)
      bal.add(pan)
      pans.push(pan)
    }
    // Hoba at 1:19: a small rusty block
    const model = new THREE.Mesh(new RoundedBoxGeometry(BLK.w / SCALE, BLK.h / SCALE, BLK.w / SCALE, 2, 0.01), crustMat)
    model.position.y = 0.022 + BLK.h / SCALE / 2
    model.castShadow = true
    pans[0].add(model)
    // the elephants at 1:19 (about 0.32 m long), facing the visitor, two rows
    elephants = new THREE.InstancedMesh(elephantGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 }), MAX_EL)
    elephants.frustumCulled = false
    elephants.castShadow = true
    elephants.count = 0
    pans[1].add(elephants)
    // the plates on the pans' front rims
    hobaSign = label3d(E.hoba.scale.hoba, 0.12, '#ffe2b0', { anchorX: 'center' })
    hobaSign.position.set(0, -0.06, BAL.pan + 0.02)
    pans[0].add(hobaSign)
    countSign = label3d('', 0.13, '#ffe2b0', { anchorX: 'center' })
    countSign.position.set(0, -0.06, BAL.pan + 0.02)
    pans[1].add(countSign)
    const models = label3d(E.hoba.scale.models, 0.1, '#d6c9ff', { anchorX: 'center' })
    models.position.set(0, 0.42, 0.12)
    bal.add(models)
  }
  solids.push(circle(BAL.x, BAL.z, 0.45))
  const SLOTS = []
  for (const z of [0.16, -0.17]) for (const x of [-0.07, 0.07, -0.21, 0.21, -0.35, 0.35]) SLOTS.push([x, z])
  const slotYaw = SLOTS.map((_, i) => Math.sin(i * 2.7) * 0.18)

  // ---- Hoba's state: readings, the magnet, the elephants ----
  // x: readings so far; xa: when the last began (clock); m: the magnet clinging; ma: when it last changed;
  // mu: the magnet tried; e: elephants on the scale; eAt: when the last one landed
  const HB = { x: 0, xa: -99, m: 0, ma: -99, mu: 0, e: 0, eAt: -99, clunked: true, swung: false }
  let rho = 0.2
  let rhoV = 0
  const hobaPanel = lv => ({
    title: E.hoba.title,
    color: HOBA_C,
    blocks: [
      {
        buttons: [
          { label: E.hoba.buttons.meter, onClick: () => hobaStep('meter') },
          { label: HB.m ? E.hoba.buttons.off : E.hoba.buttons.magnet, onClick: () => hobaStep('magnet') },
          { label: HB.e >= MAX_EL ? E.hoba.buttons.empty : E.hoba.buttons.add, onClick: () => hobaStep('scale') },
        ],
      },
      { slider: { label: E.hoba.slider, min: 0, max: MAX_EL, step: 1, value: HB.e, onInput: v => setEleph(v, false), format: v => countText(Math.round(v)), live: () => HB.e } },
      ...paras(E.hoba.panel[depth(lv)]),
    ],
  })
  const countText = n => fill(E.hoba.scale.count, { n, t: n * ELEPHANT_T })
  function hobaStep(what) {
    if (what === 'meter') {
      if (HB.x && clock - HB.xa < XRF_T) return busy()
      HB.x++
      HB.xa = clock
      later(0.9, () => play('beep'))
      later(2.0, () => play('beep'))
      sayLater(XRF_T - 0.2, E.hoba.says.meter, HOBA_C)
      share('hoba')
      findOnce('hoba', hobaPanel, XRF_T + 1.6)
    } else if (what === 'magnet') {
      if (clock - HB.ma < 0.5) return
      HB.m = HB.m ? 0 : 1
      HB.mu = 1
      HB.ma = clock
      HB.clunked = false
      HB.swung = true
      play('tap')
      sayLater(HB.m ? 0.6 : 0.3, HB.m ? E.hoba.says.magnet : E.hoba.says.off, HOBA_C)
      share('hoba')
      findOnce('hoba', hobaPanel, 3)
    } else if (what === 'scale') {
      setEleph(HB.e >= MAX_EL ? 0 : HB.e + 1, true)
    }
    refresh(hobaPanel)
  }
  let elSend = null
  function setEleph(v, now) {
    const n = int(v, 0, MAX_EL)
    if (n === HB.e) return
    const was = HB.e
    HB.e = n
    if (n > was) HB.eAt = clock
    const says = E.hoba.says
    if (n === 10 && was !== 10) sayLater(0.9, says.balanced, HOBA_C)
    else if (now && n === 0) say(at(says.empty, level()), HOBA_C)
    else if (now && n === 1) sayLater(0.4, says.one, HOBA_C)
    else if (now && n === 11 && was === 10) sayLater(0.5, says.heavier, HOBA_C)
    if (now) play('tap')
    findOnce('hoba', hobaPanel, n === 10 ? 4 : 2.5)
    if (now) share('hoba')
    else if (!elSend) {
      elSend = setTimeout(() => {
        elSend = null
        share('hoba')
      }, 250)
    }
    if (now) refresh(hobaPanel)
  }
  ex.add({
    id: 'hoba',
    x: SPOTS.hoba.x,
    z: SPOTS.hoba.z,
    radius: 1.9,
    label: E.hoba.label,
    verb: () => {
      const T = E.hoba.hints
      if (HB.x && clock - HB.xa < XRF_T) return T.reading
      if (!HB.x) return T.meter
      if (!HB.mu) return T.magnet
      if (HB.e < 10) return HB.e ? T.more : T.scale
      return HB.m ? T.off : T.done
    },
    manual: true,
    focus: view(0.1, 1.1, -4.6, 3.0, 5.2),
    act: () => ctx.showPanel(hobaPanel),
  })
  // (the block's right edge belongs to the magnet that clings there)
  clickable(block, () => hobaStep('meter'), { reach: 7, accept: h => h.point.x < FACE_X - 0.45 })
  clickable(meter.group, () => hobaStep('meter'), { reach: 7 })
  clickable(magnet, () => hobaStep('magnet'), { reach: 8 })
  clickable(bal, () => hobaStep('scale'), { reach: 11 })

  function poseHoba(dt) {
    // the meter: home, flying up onto the block (or hopping on it), measuring
    const t = clock - HB.xa
    if (!HB.x) {
      meter.group.position.copy(meterHome.p)
      meter.group.quaternion.copy(meterHome.q)
    } else {
      const k = span(0, 0.9, t)
      if (HB.x === 1 && t < 0.9) {
        meter.group.position.lerpVectors(meterHome.p, meterWork.p, k)
        meter.group.position.y += Math.sin(Math.PI * k) * 0.7
        meter.group.quaternion.slerpQuaternions(meterHome.q, meterWork.q, k)
      } else {
        meter.group.position.copy(meterWork.p)
        meter.group.position.y += t < 0.9 ? Math.sin(Math.PI * k) * 0.22 : 0
        meter.group.quaternion.copy(meterWork.q)
      }
    }
    const measuring = HB.x && t > 0.9 && t < XRF_T
    meter.screenMat.color.copy(hdr('#5fe0c8', measuring ? 1.2 + Math.sin(t * 20) * 0.5 : 0.5))
    xrfGlow.material.opacity = measuring ? 0.55 + 0.35 * Math.sin(t * 16) : 0
    beamMat.opacity = HB.x ? (measuring ? 0.16 : 0.07) * span(0.9, 1.4, t) : 0
    // the lens opens and its atoms light up as the reading builds
    const open = HB.x ? (HB.x === 1 ? span(0.9, 1.5, t) : 1) : 0
    hobaLens.setOpen(open)
    hobaLens.setMix(hobaMix, HB.x ? span(1.3, XRF_T - 0.3, t) : 0, hobaRank)
    hobaLegend.fillOpacity = hobaLegend.outlineOpacity = HB.x ? span(XRF_T - 0.5, XRF_T, t) : 0

    // the magnet: swung to the block and clinging, or pulled off and swinging
    const m = clock - HB.ma
    let phi = 0
    let psi = 0
    if (HB.m) {
      const k = clamp(m / 0.45)
      phi = PHI_C * k * k
      psi = (-Math.PI / 2) * ease(clamp(m / 0.35))
      if (m > 0.45) psi += 0.06 * Math.sin((m - 0.45) * 40) * Math.exp(-(m - 0.45) * 9)
      if (!HB.clunked && m >= 0.45) {
        HB.clunked = true
        play('tap')
      }
    } else if (HB.swung) {
      phi = PHI_C * Math.cos(m * 3.1) * Math.exp(-m / 1.4)
      psi = (-Math.PI / 2) * (1 - ease(clamp(m / 0.5)))
    }
    const hang = V3(TRI.x - Math.sin(phi) * TRI.len, TRI.y - Math.cos(phi) * TRI.len, TRI.z)
    magnet.position.copy(hang)
    magnet.rotation.set(0, 0, psi)
    string.userData.set(apex, hang)

    // the scale: the beam swings to its balance (a damped spring), the pans hang straight down
    const want = clamp((HOBA_T - HB.e * ELEPHANT_T) / HOBA_T, -1, 1) * 0.2
    rhoV += (-(rho - want) * 14 - rhoV * 3.2) * dt
    rho += rhoV * dt
    beamG.rotation.z = rho
    pans.forEach((pan, i) => {
      const s = i ? 1 : -1
      pan.position.set(s * BAL.arm * Math.cos(rho), BAL.y + s * BAL.arm * Math.sin(rho) - BAL.hang, 0)
    })
    // the elephants on the pan, the newest dropping in
    if (elephants.count !== HB.e) elephants.count = HB.e
    const o = dummy
    for (let i = 0; i < HB.e; i++) {
      const [x, z] = SLOTS[i]
      const drop = i === HB.e - 1 ? clock - HB.eAt : 9
      const y = drop < 0.35 ? 0.35 * (1 - drop / 0.35) ** 2 : drop < 0.5 ? 0.02 * Math.sin(((drop - 0.35) / 0.15) * Math.PI) : 0
      o.position.set(x, 0.023 + y, z)
      o.rotation.set(0, slotYaw[i], 0)
      o.scale.setScalar(0.37)
      o.updateMatrix()
      elephants.setMatrixAt(i, o.matrix)
    }
    elephants.instanceMatrix.needsUpdate = true
    setText(countSign, countText(HB.e))
  }
  const dummy = new THREE.Object3D()

  // ======== 2. Tutankhamun's dagger, a copy in a case at the hollow's rim ========
  const dg = new THREE.Group()
  dg.position.set(CASE.x, 0, CASE.z)
  dg.rotation.y = facing(CASE.x, CASE.z, SPOTS.dagger.x, SPOTS.dagger.z + 1)
  root.add(dg)
  const DG = { w: -1, n: 0, a: -99, seen: [0, 0], from: null }
  const dagger = daggerModel(M)
  const knife = knifeModel(M)
  const meterD = meterModel(M)
  let lensD = null
  let legendD = null
  const BLADE = [V3(-0.19, CASE.top + 0.01, -0.03), V3(0.15, CASE.top + 0.01, -0.03)] // the blades' middles (case frame)
  const meterDHome = { p: V3(0.36, CASE.top + 0.045, -0.15), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.4 - Math.PI / 2, Math.PI / 2, 'YXZ')) }
  const meterDWork = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2 - 0.55, 0, 0)) // nose down, toward the blade in front
  {
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(0.98, 0.84, 0.58, 2, 0.03), M.darkWood)
    plinth.position.y = 0.42
    plinth.castShadow = true
    plinth.receiveShadow = true
    const tray = new THREE.Mesh(new RoundedBoxGeometry(0.94, 0.09, 0.54, 2, 0.02), M.wood)
    tray.position.y = 0.84 + 0.045
    const velvet = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.01, 0.46), M.velvet)
    velvet.position.y = CASE.top - 0.002
    dg.add(plinth, tray, velvet)
    // the glass lid, propped open at the back
    const lid = new THREE.Group()
    lid.position.set(0, CASE.top + 0.005, -0.27)
    lid.rotation.x = -1.9 // leaning back past upright
    const pane = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.006, 0.5), light ? M.hit : M.glass)
    pane.position.z = 0.25
    lid.add(pane)
    for (const [w, d, x, z] of [[0.92, 0.02, 0, 0.0], [0.92, 0.02, 0, 0.5], [0.02, 0.5, -0.45, 0.25], [0.02, 0.5, 0.45, 0.25]]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.02, d), M.brass)
      bar.position.set(x, 0, z)
      lid.add(bar)
    }
    dg.add(lid)
    dagger.position.set(-0.3, CASE.top, -0.03)
    dagger.rotation.y = 0.04
    knife.position.set(0.06, CASE.top, -0.03)
    knife.rotation.y = -0.03
    dg.add(dagger, knife)
    meterD.group.scale.setScalar(0.85)
    dg.add(meterD.group)
    // the labels on the velvet
    const c1 = card(E.dagger.cards.dagger, DAGGER_C, M.card, { size: 0.024, maxWidth: 0.3 })
    c1.position.set(-0.22, CASE.top + 0.012, 0.15)
    c1.rotation.x = -1.25
    const c2 = card(E.dagger.cards.knife, '#9aa3ad', M.card, { size: 0.024, maxWidth: 0.3 })
    c2.position.set(0.15, CASE.top + 0.012, 0.15)
    c2.rotation.x = -1.25
    dg.add(c1, c2)
    lensD = atomLens({ r: 0.22, spacing: 0.042, matcap })
    lensD.group.position.set(0, 1.55, -0.2)
    dg.add(lensD.group)
    legendD = label3d('', 0.05, '#ffffff', { anchorX: 'center' })
    legendD.position.set(0, -0.25, 0.02)
    lensD.face.add(legendD)
  }
  solids.push(circle(CASE.x, CASE.z, 0.5))
  const daggerMix = mixAtoms(lensD.pts, { ni: 0.108, co: 0.0058, seed: 41 })
  const knifeMix = mixAtoms(lensD.pts, { ni: 0, seed: 43 })
  const daggerPanel = lv => ({
    title: E.dagger.title,
    color: DAGGER_C,
    blocks: [
      { buttons: [{ label: E.dagger.buttons.dagger, onClick: () => daggerStep('dagger') }, { label: E.dagger.buttons.knife, onClick: () => daggerStep('knife') }] },
      ...paras(E.dagger.panel[depth(lv)]),
    ],
  })
  function daggerStep(which) {
    if (DG.w >= 0 && clock - DG.a < DG_T) return busy()
    const w = which === 'knife' ? 1 : 0
    DG.from = meterD.group.position.clone()
    DG.w = w
    DG.n++
    DG.a = clock
    DG.seen[w] = 1
    later(0.7, () => play('beep'))
    sayLater(DG_T, w ? E.dagger.says.knife : E.dagger.says.dagger, DAGGER_C)
    share('dagger')
    findOnce('dagger', daggerPanel, DG_T + 1.4)
    refresh(daggerPanel)
  }
  ex.add({
    id: 'dagger',
    x: SPOTS.dagger.x,
    z: SPOTS.dagger.z,
    radius: 1.15,
    label: E.dagger.label,
    verb: () => {
      const T = E.dagger.hints
      if (DG.w >= 0 && clock - DG.a < DG_T) return T.reading
      if (!DG.seen[0]) return T.dagger
      if (!DG.seen[1]) return T.knife
      return T.again
    },
    manual: true,
    focus: view(CASE.x, 1.2, CASE.z - 0.1, 1.05, 1.3),
    act: () => ctx.showPanel(daggerPanel),
  })
  clickable(dagger, () => daggerStep('dagger'))
  clickable(knife, () => daggerStep('knife'))
  clickable(meterD.group, () => daggerStep(DG.seen[0] && !DG.seen[1] ? 'knife' : 'dagger'))
  function poseDagger() {
    const t = clock - DG.a
    if (DG.w < 0) {
      meterD.group.position.copy(meterDHome.p)
      meterD.group.quaternion.copy(meterDHome.q)
      lensD.setOpen(0)
      return
    }
    const target = BLADE[DG.w].clone().add(V3(0, 0.13, -0.11))
    const k = span(0, 0.6, t)
    const from = DG.from ?? meterDHome.p
    meterD.group.position.lerpVectors(from, target, k)
    meterD.group.position.y += Math.sin(Math.PI * k) * 0.12
    // scanning along the blade
    if (t > 0.6 && t < DG_T - 0.3) meterD.group.position.x += Math.sin((t - 0.6) * 5) * 0.04
    if (from.distanceTo(meterDHome.p) < 0.01 && k < 1) meterD.group.quaternion.slerpQuaternions(meterDHome.q, meterDWork, k)
    else meterD.group.quaternion.copy(meterDWork)
    const measuring = t > 0.6 && t < DG_T
    meterD.screenMat.color.copy(hdr('#5fe0c8', measuring ? 1.2 + Math.sin(t * 20) * 0.5 : 0.5))
    lensD.setOpen(span(0.6, 1.1, t))
    lensD.setMix(DG.w ? knifeMix : daggerMix, span(0.9, DG_T - 0.2, t))
    setText(legendD, DG.w ? E.dagger.legend.knife : E.dagger.legend.dagger)
    legendD.fillOpacity = legendD.outlineOpacity = span(DG_T - 0.4, DG_T, t)
  }

  // ======== 3. the etching bench, in a tent open toward the field ========
  const tent = new THREE.Group()
  root.add(tent)
  const TX = (TENT.x0 + TENT.x1) / 2
  const TZ = (TENT.z0 + TENT.z1) / 2
  {
    const { x0, x1, z0, z1, eave, ridge } = TENT
    const o = 0.15
    const add = (geo, mat = M.canvas) => {
      const m = new THREE.Mesh(geo, mat)
      m.receiveShadow = true
      tent.add(m)
      return m
    }
    const U = [0, 0, 1, 0, 1, 1, 0, 1]
    add(quad([x0 - o, eave - 0.05, z1 + o], [x0 - o, eave - 0.05, z0 - o], [TX, ridge, z0 - o], [TX, ridge, z1 + o], U))
    add(quad([x1 + o, eave - 0.05, z0 - o], [x1 + o, eave - 0.05, z1 + o], [TX, ridge, z1 + o], [TX, ridge, z0 - o], U))
    add(quad([x0, 0, z0], [x0, 0, z1], [x0, eave, z1], [x0, eave, z0], U))
    add(quad([x1, 0, z1], [x1, 0, z0], [x1, eave, z0], [x1, eave, z1], U))
    add(quad([x0, 0, z0], [x1, 0, z0], [x1, eave, z0], [x0, eave, z0], U))
    const gable = z => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute([x0, eave, z, x1, eave, z, TX, ridge, z], 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2))
      geo.computeVertexNormals()
      return geo
    }
    add(gable(z0))
    add(gable(z1))
    for (const [x, z] of [[x0, z0], [x0, z1], [x1, z0], [x1, z1]]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, eave, 8), M.pole)
      p.position.set(x, eave / 2, z)
      tent.add(p)
      const a = V3(x, eave, z)
      const b = V3(x + (x < TX ? -1.0 : 1.0), 0, z + (z < TZ ? -0.5 : 0.5))
      const rope = rod(M.rope, 0.006, 4)
      rope.userData.set(a, b)
      tent.add(rope)
    }
    const beamT = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, z1 - z0 + 0.3, 8).rotateX(Math.PI / 2), M.pole)
    beamT.position.set(TX, ridge - 0.03, TZ)
    tent.add(beamT)
    solids.push(box(x0, TZ, 0.12, z1 - z0 + 0.1), box(x1, TZ, 0.12, z1 - z0 + 0.1), box(TX, z0, x1 - x0 + 0.1, 0.12))
    solids.push(circle(x0, z1, 0.1), circle(x1, z1, 0.1))
    const sign = card(E.etch.sign, ETCH_C, M.card, { size: 0.17, maxWidth: 2.4 })
    sign.position.set(TX, eave + 0.24, z1 + 0.02)
    tent.add(sign)
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), new THREE.MeshBasicMaterial({ color: hdr('#ffd08a', 2.2) }))
    lantern.position.set(TX, ridge - 0.45, TZ + 0.5)
    tent.add(lantern)
    const lampLight = new THREE.PointLight('#ffc27a', light ? 1.5 : 2.2, 5.5, 2)
    lampLight.position.copy(lantern.position)
    tent.add(lampLight)
    // the bench along the back wall
    const top = new THREE.Mesh(new RoundedBoxGeometry(BENCH.x1 - BENCH.x0, 0.05, BENCH.d, 2, 0.015), M.wood)
    top.position.set(TX, BENCH.top - 0.025, BENCH.z)
    top.castShadow = !light
    top.receiveShadow = true
    tent.add(top)
    for (const x of [BENCH.x0 + 0.15, BENCH.x1 - 0.15]) {
      for (const z of [BENCH.z - BENCH.d / 2 + 0.08, BENCH.z + BENCH.d / 2 - 0.08]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, BENCH.top - 0.05, 0.06), M.darkWood)
        leg.position.set(x, (BENCH.top - 0.05) / 2, z)
        tent.add(leg)
      }
    }
    solids.push(box(TX, BENCH.z, BENCH.x1 - BENCH.x0, BENCH.d + 0.04, { y1: BENCH.top + 0.05 }))
  }

  // the three pieces, each on a small wooden holder, its face toward the visitor and tilted up
  const sawnTex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#6c7177'
    g.fillRect(0, 0, w, w)
    const rnd = random(51)
    for (let i = 0; i < 160; i++) {
      g.strokeStyle = rnd() < 0.5 ? 'rgba(40,44,50,0.35)' : 'rgba(190,196,204,0.25)'
      g.lineWidth = 1
      const y = rnd() * w
      g.beginPath()
      g.moveTo(0, y)
      g.quadraticCurveTo(w / 2, y + (rnd() - 0.5) * 20, w, y + (rnd() - 0.5) * 8)
      g.stroke()
    }
  })
  const polishTex = canvasTex(256, 256, (g, w) => {
    const grd = g.createLinearGradient(0, 0, w, w)
    grd.addColorStop(0, '#c9d0d8')
    grd.addColorStop(0.35, '#6c737c')
    grd.addColorStop(0.55, '#d8dee5')
    grd.addColorStop(0.75, '#5b626b')
    grd.addColorStop(1, '#9aa1aa')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
  const etchTex = {
    gibeon: canvasTex(512, 512, (g, w, h) => drawWidman(g, w, h, { band: 17, grow: 1, seed: 61 })),
    hoba: canvasTex(256, 256, (g, w) => {
      g.fillStyle = '#868b92'
      g.fillRect(0, 0, w, w)
      const rnd = random(63)
      for (let i = 0; i < 5000; i++) {
        g.fillStyle = rnd() < 0.5 ? 'rgba(60,64,70,0.25)' : 'rgba(200,204,210,0.2)'
        g.fillRect(rnd() * w, rnd() * w, 1, 1)
      }
    }),
    bar: canvasTex(256, 256, (g, w) => {
      g.fillStyle = '#7b8086'
      g.fillRect(0, 0, w, w)
      const rnd = random(67)
      g.strokeStyle = 'rgba(40,40,44,0.6)'
      for (let i = 0; i < 9; i++) {
        const y = rnd() * w
        const x = rnd() * w
        g.lineWidth = 1 + rnd() * 2
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x + 20 + rnd() * 60, y + (rnd() - 0.5) * 3)
        g.stroke()
      }
    }),
  }
  textures.push(sawnTex, polishTex, ...Object.values(etchTex))
  const PIECES = [
    { id: 'gibeon', kind: 'lump', seed: 31, size: [0.16, 0.12, 0.08], crust: { base: '#3d342e', rust: ['#6b4a33', '#7a5638'], dark: '#1f1a17' } },
    { id: 'hoba', kind: 'lump', seed: 37, size: [0.15, 0.115, 0.08], crust: { base: '#5e4130', rust: ['#8f512a', '#a8662f'], dark: '#2e2018' } },
    { id: 'bar', kind: 'bar', size: [0.28, 0.12, 0.1], crust: { base: '#2c2b2a', rust: ['#4a3a2e'], dark: '#141414', pits: 0 } },
  ]
  const pieces = PIECES.map((def, i) => {
    const group = new THREE.Group()
    const crustT = crustTexture(71 + i, { ...def.crust, size: 256 })
    textures.push(crustT)
    const capMat = new THREE.MeshStandardMaterial({ map: crustT, roughness: 0.85, metalness: 0.15, transparent: true, opacity: 1 })
    const backMat = new THREE.MeshStandardMaterial({ map: crustT, roughness: 0.85, metalness: 0.15 })
    const sawnMat = new THREE.MeshStandardMaterial({ map: sawnTex, color: '#b8bcc2', roughness: 0.8, metalness: 0.2, polygonOffset: true, polygonOffsetFactor: -1 })
    const polMat = new THREE.MeshStandardMaterial({ map: polishTex, color: '#8d939b', roughness: 0.22, metalness: 0.6, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: -2 })
    const etchMat = new THREE.MeshStandardMaterial({ map: etchTex[def.id], color: '#a4a9b0', roughness: 0.55, metalness: 0.25, transparent: true, opacity: 0, polygonOffset: true, polygonOffsetFactor: -3 })
    let back
    let cap
    let faceGeo
    if (def.kind === 'lump') {
      const L = cutLump(def.seed)
      back = new THREE.Mesh(L.back, backMat)
      cap = new THREE.Mesh(L.cap, capMat)
      faceGeo = L.face
    } else {
      back = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1).translate(0, 0, -0.5), backMat)
      cap = new THREE.Mesh(new THREE.BoxGeometry(2.02, 2.02, 0.25).translate(0, 0, 0.125), capMat)
      faceGeo = new THREE.PlaneGeometry(2, 2)
    }
    const faces = [sawnMat, polMat, etchMat].map(m => new THREE.Mesh(faceGeo, m))
    const body = new THREE.Group()
    body.scale.set(...def.size)
    body.add(back, ...faces)
    back.castShadow = true
    // the cap sits in its own pivot (the cut's bottom edge), so it can tip forward and fall
    const pivot = new THREE.Group()
    pivot.position.set(0, -1, 0)
    cap.position.y = 1
    pivot.add(cap)
    body.add(pivot)
    group.add(body)
    const holder = new THREE.Mesh(new RoundedBoxGeometry(def.size[0] * 1.6, 0.04, 0.2, 2, 0.01), M.darkWood)
    holder.position.set(PIECE_X[i], BENCH.top + 0.02, BENCH.pz)
    tent.add(holder)
    group.position.set(PIECE_X[i], BENCH.top + 0.04 + def.size[1] * 1.12, BENCH.pz)
    group.rotation.x = -0.32
    tent.add(group)
    const hit = new THREE.Mesh(new THREE.BoxGeometry(def.size[0] * 2.5, def.size[1] * 2.6, 0.3), M.hit)
    group.add(hit)
    const name = card(E.etch.pieces[def.id], ETCH_C, M.card, { size: 0.045, maxWidth: 0.6 })
    name.position.set(PIECE_X[i], BENCH.top + 0.012, BENCH.pz + 0.27)
    name.rotation.x = -1.2
    tent.add(name)
    return { ...def, group, body, cap, pivot, capMat, polMat, etchMat }
  })
  // the tools: a frame saw (left), the acid dropper (front), the polisher (right), the crate of new pieces
  const saw = sawModel(M)
  tent.add(saw)
  const sawRest = { p: V3(-8.74, BENCH.top + 0.012, BENCH.z + 0.12), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0.25, 0, 'YXZ')) }
  const pol = polisherModel(M)
  tent.add(pol.group)
  const polRest = { p: V3(-6.08, BENCH.top + 0.076, BENCH.z + 0.18), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2 + 0.35, 0)) }
  const bottle = new THREE.Group()
  const pipette = new THREE.Group()
  const DROP_HOME = V3(-7.76, BENCH.top, BENCH.z + 0.22)
  {
    const glassB = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.038, 0.09, 18), M.amber)
    glassB.position.y = 0.045
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.025, 14), M.amber)
    neck.position.y = 0.1
    const lab = new THREE.Mesh(new THREE.CylinderGeometry(0.0365, 0.0365, 0.035, 18, 1, true), M.felt)
    lab.position.y = 0.045
    const hitB = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.12), M.hit)
    hitB.position.y = 0.12
    bottle.add(glassB, neck, lab, hitB)
    bottle.position.copy(DROP_HOME)
    tent.add(bottle)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0025, 0.11, 8), M.glassTube)
    tube.position.y = -0.055
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 10), M.black)
    bulb.scale.y = 1.5
    bulb.position.y = 0.012
    pipette.add(tube, bulb)
    tent.add(pipette)
  }
  const pipHome = DROP_HOME.clone().add(V3(0, 0.2, 0))
  const drops = Array.from({ length: 3 }, () => {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), new THREE.MeshStandardMaterial({ color: '#f2e6a0', roughness: 0.1, emissive: '#5a4a10', emissiveIntensity: 0.4 }))
    d.visible = false
    tent.add(d)
    return d
  })
  const fizz = glowSprite(hdr('#fff2c0', 1.2), 0.18, 0)
  tent.add(fizz)
  const sparks = glowSprite(hdr('#ffd8a0', 1.5), 0.12, 0)
  tent.add(sparks)
  const crate = new THREE.Group()
  {
    const w = 0.5
    const d = 0.38
    const h = 0.3
    for (const [sx, sz, px, pz] of [[w, 0.02, 0, -d / 2], [w, 0.02, 0, d / 2], [0.02, d, -w / 2, 0], [0.02, d, w / 2, 0]]) {
      for (const y of [0.06, 0.16, 0.26]) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.07, sz), M.wood)
        slat.position.set(px, y, pz)
        crate.add(slat)
      }
    }
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, 0.02, d), M.darkWood)
    bottom.position.y = 0.01
    crate.add(bottom)
    const lumpG = lumpGeometry(91, 0.3, 1)
    const lumpM = new THREE.MeshStandardMaterial({ color: '#4a3a2e', roughness: 0.9, flatShading: true })
    for (const [x, z, s] of [[-0.12, -0.06, 0.09], [0.1, 0.05, 0.08], [0.0, 0.1, 0.07], [0.13, -0.09, 0.06]]) {
      const l = new THREE.Mesh(lumpG, lumpM)
      l.position.set(x, h - 0.05, z)
      l.scale.setScalar(s)
      crate.add(l)
    }
    const hitC = new THREE.Mesh(new THREE.BoxGeometry(w, h + 0.1, d), M.hit)
    hitC.position.y = h / 2
    crate.add(hitC)
    crate.position.set(TENT.x0 + 0.45, 0, -2.25)
    crate.rotation.y = 0.2
    tent.add(crate)
    solids.push(circle(crate.position.x, crate.position.z, 0.3, { y1: h }))
  }
  // the lens on a rail over the bench: it slides to the piece being worked on, and shows its atoms
  const lensE = atomLens({ r: 0.2, spacing: 0.036, matcap, ring: '#c9a24a' })
  const lensRail = new THREE.Group()
  tent.add(lensRail)
  const LENS_Y = 1.6
  const LENS_Z = BENCH.pz + 0.12
  {
    for (const x of [BENCH.x0 + 0.06, BENCH.x1 - 0.06]) {
      const post = rod(M.pole, 0.015)
      post.userData.set(V3(x, BENCH.top, BENCH.z - BENCH.d / 2 + 0.05), V3(x, 2.05, BENCH.z - BENCH.d / 2 + 0.05))
      lensRail.add(post)
    }
    const rail = rod(M.pole, 0.015)
    rail.userData.set(V3(BENCH.x0 + 0.06, 2.05, BENCH.z - BENCH.d / 2 + 0.05), V3(BENCH.x1 - 0.06, 2.05, BENCH.z - BENCH.d / 2 + 0.05))
    lensRail.add(rail)
  }
  const lensArm = rod(M.pole, 0.012)
  tent.add(lensArm)
  const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(0.2, 40), new THREE.MeshStandardMaterial({ color: '#7f93ad', roughness: 0.05, transparent: true, opacity: 0.12, depthWrite: false }))
  const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.014, 10, 48), new THREE.MeshStandardMaterial({ color: '#d9b866', emissive: '#c99a3a', emissiveIntensity: 0.35, roughness: 0.4 }))
  const lensHit = new THREE.Mesh(new THREE.CircleGeometry(0.24, 16), M.hit)
  const lensHolder = new THREE.Group()
  lensHolder.add(lensGlass, lensRing, lensHit, lensE.group)
  lensHolder.rotation.x = 0.12
  tent.add(lensHolder)
  const lensLegend = label3d('', 0.045, '#ffffff', { anchorX: 'center' })
  lensLegend.position.set(0, -0.23, 0.02)
  lensE.face.add(lensLegend)
  const kamaciteLine = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.36), new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 1.2) }))
  kamaciteLine.position.set(0.05, 0, 0.04)
  lensE.face.add(kamaciteLine)
  const lensMixes = {
    gibeon: mixAtoms(lensE.pts, { seed: 81, region: x => (x > 0.05 ? { id: 1, ni: 0.36 } : { id: 0, ni: 0.06 }) }),
    hoba: mixAtoms(lensE.pts, { ni: 0.16, co: 0.01, seed: 83 }),
    bar: mixAtoms(lensE.pts, { ni: 0, seed: 85 }),
  }
  const marker = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: dotTex, color: hdr(ETCH_C, 0.9), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.6 }))
  marker.raycast = () => {}
  marker.position.set(PIECE_X[0], BENCH.top + 0.003, BENCH.pz)
  tent.add(marker)
  let lensX = PIECE_X[0]
  let lensOpen = 0

  // ---- the bench's state ----
  // cur: the piece being worked on; st: each piece's stage (0 rough, 1 sawn, 2 polished, 3 etched); lk: each
  // finished piece seen in the lens; lens: the piece the lens shows (-1 none); act: the step under way
  const ET = { cur: 0, st: [0, 0, 0], lk: [0, 0, 0], lens: -1, act: null, n: 0 }
  const etchBusy = () => ET.act && ET.act.tool !== 'pick' && clock - ET.act.start < TOOL_T[ET.act.tool]
  const etchPanel = lv => ({
    title: E.etch.title,
    color: ETCH_C,
    blocks: [
      {
        buttons: [
          { label: E.etch.buttons.next, onClick: () => etchStep('pick', (ET.cur + 1) % 3) },
          { label: E.etch.buttons.saw, onClick: () => etchStep('saw') },
          { label: E.etch.buttons.polish, onClick: () => etchStep('polish') },
          { label: E.etch.buttons.acid, onClick: () => etchStep('acid') },
          { label: E.etch.buttons.lens, onClick: () => etchStep('lens') },
          { label: E.etch.buttons.fresh, onClick: () => etchStep('fresh') },
        ],
      },
      ...paras(E.etch.panel[depth(lv)]),
    ],
  })
  function etchStep(what, i = 0) {
    if (etchBusy()) return busy()
    const S = E.etch.says
    const p = ET.cur
    const s = ET.st[p]
    const id = PIECES[p].id
    if (what === 'pick') {
      ET.cur = int(i, 0, 2)
      ET.act = { tool: 'pick', p: ET.cur, start: clock }
      play('select')
      say(at(S.pick[PIECES[ET.cur].id], level()), ETCH_C)
    } else if (what === 'fresh') {
      ET.st = [0, 0, 0]
      ET.lk = [0, 0, 0]
      ET.lens = -1
      ET.cur = 0
      ET.n++
      ET.act = { tool: 'fresh', p: 0, start: clock }
      play('pop')
      say(at(S.fresh, level()), ETCH_C)
    } else if (what === 'lens') {
      if (s < 3) return say(at(S.needEtch, level()), ETCH_C)
      ET.lens = ET.lens === p ? -1 : p
      ET.lk[p] = 1
      play('select')
      if (ET.lens === p) sayLater(0.8, S.lens[id], ETCH_C)
    } else {
      if (what === 'saw') {
        if (s >= 1) return say(at(S.done, level()), ETCH_C)
        ET.st[p] = 1
        sayLater(TOOL_T.saw - 0.3, S.saw, ETCH_C)
      } else if (what === 'polish') {
        if (s < 1) return say(at(S.needCut, level()), ETCH_C)
        if (s >= 2) return say(at(S.done, level()), ETCH_C)
        ET.st[p] = 2
        play('beam')
        sayLater(TOOL_T.polish - 0.3, S.polish, ETCH_C)
      } else if (what === 'acid') {
        if (s < 1) return say(at(S.needCut, level()), ETCH_C)
        if (s < 2) return say(at(S.needPolish, level()), ETCH_C)
        if (s >= 3) return say(at(S.done, level()), ETCH_C)
        ET.st[p] = 3
        later(1.3, () => play('fizz'))
        sayLater(TOOL_T.acid - 0.2, S.acid[id], ETCH_C)
      } else return
      ET.act = { tool: what, p, start: clock }
      play('select')
    }
    share('etch')
    findOnce('etch', etchPanel, what === 'pick' ? 2.5 : (TOOL_T[what] ?? 1) + 1.5)
    refresh(etchPanel)
  }
  ex.add({
    id: 'etch',
    x: SPOTS.etch.x,
    z: SPOTS.etch.z,
    radius: 1.5,
    label: E.etch.label,
    verb: () => {
      const T = E.etch.hints
      if (etchBusy()) return T.working
      const s = ET.st[ET.cur]
      if (s === 0) return T.saw
      if (s === 1) return T.polish
      if (s === 2) return T.acid
      if (!ET.lk[ET.cur]) return T.lens
      if (ET.st.some(v => v < 3)) return T.next
      return T.fresh
    },
    manual: true,
    focus: view(-7.4, 1.2, -3.35, 1.2, 2.6),
    act: () => ctx.showPanel(etchPanel),
  })
  pieces.forEach((pc, i) => clickable(pc.group, () => etchStep('pick', i)))
  clickable(saw, () => etchStep('saw'))
  clickable(pol.group, () => etchStep('polish'))
  clickable(bottle, () => etchStep('acid'))
  clickable(pipette, () => etchStep('acid'))
  clickable(lensHolder, () => etchStep('lens'))
  clickable(crate, () => etchStep('fresh'))

  const wq = new THREE.Quaternion()
  function poseEtch(dt, t) {
    const a = ET.act
    const age = a ? clock - a.start : 99
    pieces.forEach((pc, i) => {
      const s = ET.st[i]
      const mine = a && a.p === i
      // the cap: on, tipping off after the saw, or back (new pieces)
      let off = s >= 1 ? 1 : 0
      if (mine && a.tool === 'saw') off = span(2.0, 2.8, age)
      let back = 1
      if (a?.tool === 'fresh') back = span(0, 0.8, age)
      pc.cap.visible = off < 1
      pc.pivot.rotation.x = off * 1.5
      pc.pivot.position.z = off * 0.6
      pc.capMat.opacity = (1 - span(0.6, 1, off)) * back
      pc.capMat.depthWrite = pc.capMat.opacity > 0.98
      let polK = s >= 2 ? 1 : 0
      if (mine && a.tool === 'polish') polK = span(0.7, 2.0, age)
      let etK = s >= 3 ? 1 : 0
      if (mine && a.tool === 'acid') etK = span(1.6, 3.3, age)
      pc.polMat.opacity = polK
      pc.polMat.visible = polK > 0.001
      pc.etchMat.opacity = etK
      pc.etchMat.visible = etK > 0.001
    })
    // the saw: to the piece, cutting down through it in the cut's plane, then back
    const pc = a ? pieces[a.p] : null
    if (a?.tool === 'saw' && age < TOOL_T.saw) {
      const k = span(0, 0.5, age) * (1 - span(2.1, 2.7, age))
      const y = lerp(1.3, -1.25, span(0.5, 2.0, age))
      const x = age > 0.5 && age < 2.0 ? Math.sin(age * 18) * 0.4 : 0
      const wp = pc.body.localToWorld(V3(x, y, 0.02))
      pc.body.getWorldQuaternion(wq)
      saw.position.lerpVectors(sawRest.p, tent.worldToLocal(wp), k)
      saw.quaternion.slerpQuaternions(sawRest.q, wq, k)
      sparks.material.opacity = age > 0.5 && age < 2.0 ? 0.4 + 0.4 * Math.sin(age * 40) : 0
      sparks.position.copy(tent.worldToLocal(pc.body.localToWorld(V3(x * 0.3, y, 0.3))))
    } else {
      saw.position.copy(sawRest.p)
      saw.quaternion.copy(sawRest.q)
      sparks.material.opacity = 0
    }
    // the polisher: its disc against the face, circling and spinning
    if (a?.tool === 'polish' && age < TOOL_T.polish) {
      const k = span(0, 0.5, age) * (1 - span(2.05, 2.55, age))
      const on = age > 0.5 && age < 2.05
      const wp = pc.body.localToWorld(V3(on ? Math.cos(age * 6) * 0.35 : 0, on ? Math.sin(age * 6) * 0.3 : 0, 0.18))
      pc.body.getWorldQuaternion(wq)
      pol.group.position.lerpVectors(polRest.p, tent.worldToLocal(wp), k)
      pol.group.quaternion.slerpQuaternions(polRest.q, wq, k)
      if (on) pol.disc.rotation.z += dt * 40
    } else {
      pol.group.position.copy(polRest.p)
      pol.group.quaternion.copy(polRest.q)
    }
    // the dropper: out of the bottle, over the face, three drops, back
    if (a?.tool === 'acid' && age < TOOL_T.acid) {
      const over = tent.worldToLocal(pc.body.localToWorld(V3(0, 1.25, 1.6)))
      const up = pipHome.clone().add(V3(0, 0.15, 0))
      if (age < 0.35) pipette.position.lerpVectors(pipHome, up, span(0, 0.35, age))
      else if (age < 2.6) pipette.position.lerpVectors(up, over, span(0.35, 0.9, age))
      else pipette.position.lerpVectors(over, pipHome, span(2.6, 3.4, age))
      drops.forEach((d, i) => {
        const t0 = 1.0 + i * 0.28
        const k = (age - t0) / 0.28
        d.visible = k > 0 && k < 1
        if (d.visible) {
          const land = tent.worldToLocal(pc.body.localToWorld(V3((i - 1) * 0.35, 0.5 - i * 0.3, 0.05)))
          d.position.lerpVectors(pipette.position.clone().add(V3(0, -0.11, 0)), land, k * k)
        }
      })
      fizz.material.opacity = age > 1.5 && age < 3.3 ? 0.5 * Math.sin(((age - 1.5) / 1.8) * Math.PI) * (0.7 + 0.3 * Math.sin(age * 30)) : 0
      fizz.position.copy(tent.worldToLocal(pc.body.localToWorld(V3(0, 0, 0.5))))
    } else {
      pipette.position.copy(pipHome)
      drops.forEach(d => (d.visible = false))
      fizz.material.opacity = 0
    }
    // the lens and the marker follow the piece being worked on
    const want = PIECE_X[ET.cur]
    lensX += (want - lensX) * Math.min(1, dt * 5)
    lensHolder.position.set(lensX, LENS_Y, LENS_Z)
    lensArm.userData.set(V3(lensX, 2.05, BENCH.z - BENCH.d / 2 + 0.05), V3(lensX, LENS_Y + 0.21, LENS_Z))
    marker.position.x = lensX
    marker.material.opacity = 0.45 + 0.15 * Math.sin(t * 3)
    const show = ET.lens >= 0 && ET.lens === ET.cur
    lensOpen += ((show ? 1 : 0) - lensOpen) * Math.min(1, dt * 6)
    lensE.setOpen(lensOpen)
    lensGlass.visible = lensOpen < 0.95
    if (ET.lens >= 0) {
      const id = PIECES[ET.lens].id
      lensE.setMix(lensMixes[id], 1)
      setText(lensLegend, E.etch.legend[id])
      kamaciteLine.visible = id === 'gibeon'
    }
  }

  // ======== 4. the little planet under a glass dome ========
  const A = V3(TBL.x, TBL.top + 0.47, TBL.z) // the planet's centre
  const EARTH = V3(TBL.x + 0.5, TBL.top + 0.22, TBL.z - 0.3)
  const AST_R = 0.24
  const astG = new THREE.Group()
  astG.position.copy(A)
  astG.rotation.order = 'YXZ'
  astG.rotation.set(-0.38, facing(A.x, A.z, SPOTS.asteroid.x, SPOTS.asteroid.z), 0)
  root.add(astG)
  const rockTex = crustTexture(97, { base: '#6e5e4e', rust: ['#7d6a52', '#5a4c3e'], dark: '#3a3028', pits: 30, size: 256 })
  textures.push(rockTex)
  const rockMat = new THREE.MeshStandardMaterial({ map: rockTex, roughness: 0.9, emissive: '#ff5a18', emissiveIntensity: 0, side: THREE.DoubleSide })
  const shell = new THREE.Mesh(
    (() => {
      const g = new THREE.SphereGeometry(1, 40, 24, 0.75 * Math.PI, 1.5 * Math.PI)
      const n = noise3(99)
      const p = g.attributes.position
      const v = new THREE.Vector3()
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).normalize()
        v.multiplyScalar(1.04 + 0.05 * clamp(n(v.x * 1.5, v.y * 1.5, v.z * 1.5), -1, 1))
        p.setXYZ(i, v.x, v.y, v.z)
      }
      g.computeVertexNormals()
      return g
    })(),
    rockMat,
  )
  shell.scale.setScalar(AST_R)
  shell.castShadow = true
  astG.add(shell)
  // the cut faces: the inside drawn on a canvas (metal grains in rock, then a core)
  const SECTION = 256
  const sectionTex = canvasTex(SECTION, SECTION, null)
  textures.push(sectionTex)
  const sectionMat = new THREE.MeshStandardMaterial({ map: sectionTex, emissiveMap: sectionTex, emissive: '#ffffff', emissiveIntensity: 0.15, roughness: 0.7, side: THREE.DoubleSide })
  for (const phi of [0.25 * Math.PI, 0.75 * Math.PI]) {
    const f = new THREE.Mesh(new THREE.CircleGeometry(1.02, 40, -Math.PI / 2, Math.PI), sectionMat)
    f.rotation.y = phi + Math.PI
    f.scale.setScalar(AST_R)
    astG.add(f)
  }
  const astHit = new THREE.Mesh(new THREE.SphereGeometry(AST_R * 1.4, 12, 8), M.hit)
  astG.add(astHit)
  const FLECKS = (() => {
    const rnd = random(101)
    return Array.from({ length: 90 }, () => ({ r0: Math.sqrt(rnd()) * 0.93, a: rnd() * TAU, rc: Math.sqrt(rnd()) * 0.4, s: 0.012 + rnd() * 0.02, chond: rnd() < 0.35 }))
  })()
  let sectionKey = ''
  function drawSection(k, heat) {
    const key = `${Math.round(k * 80)}:${Math.round(heat * 60)}`
    if (key === sectionKey) return
    sectionKey = key
    sectionTex.userData.redraw((g, w) => {
      const c = w / 2
      const R = w / 2 - 2
      const rock = new THREE.Color('#7a6650').lerp(new THREE.Color('#e0601e'), heat * 0.85)
      const metal = new THREE.Color('#8f959e').lerp(new THREE.Color('#ffd890'), heat)
      g.fillStyle = '#000000'
      g.fillRect(0, 0, w, w)
      g.fillStyle = `#${rock.getHexString()}`
      g.beginPath()
      g.arc(c, c, R, 0, TAU)
      g.fill()
      const rnd = random(103)
      // chondrules and grit in the unmelted rock, fading as it melts
      g.globalAlpha = 1 - span(0, 0.4, k)
      for (let i = 0; i < 260; i++) {
        const a = rnd() * TAU
        const r = Math.sqrt(rnd()) * R * 0.97
        g.fillStyle = rnd() < 0.5 ? 'rgba(200,180,150,0.55)' : 'rgba(40,30,22,0.45)'
        g.beginPath()
        g.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, 1.5 + rnd() * 3.5, 0, TAU)
        g.fill()
      }
      g.globalAlpha = 1
      // the core grows as the metal gathers
      const core = R * 0.46 * span(0.35, 1, k)
      if (core > 1) {
        const grd = g.createRadialGradient(c - core * 0.3, c - core * 0.3, core * 0.1, c, c, core)
        grd.addColorStop(0, `#${metal.clone().lerp(new THREE.Color('#ffffff'), 0.35).getHexString()}`)
        grd.addColorStop(1, `#${metal.getHexString()}`)
        g.fillStyle = grd
        g.beginPath()
        g.arc(c, c, core, 0, TAU)
        g.fill()
      }
      // the metal grains sinking toward the middle and merging
      g.globalAlpha = 1 - span(0.8, 1, k)
      g.fillStyle = `#${metal.getHexString()}`
      for (const f of FLECKS) {
        const r = lerp(f.r0, f.rc, ease(k)) * R
        const size = f.s * R * (1 + k * 0.8)
        g.beginPath()
        g.arc(c + Math.cos(f.a) * r, c + Math.sin(f.a) * r, size, 0, TAU)
        g.fill()
      }
      g.globalAlpha = 1
    })
  }
  drawSection(0, 0)
  // the table, its dome, the little Earth
  {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(TBL.r, TBL.r, 0.05, 40), M.wood)
    top.position.set(TBL.x, TBL.top - 0.025, TBL.z)
    top.castShadow = top.receiveShadow = true
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, TBL.top - 0.08, 12), M.darkWood)
    stem.position.set(TBL.x, (TBL.top - 0.08) / 2 + 0.03, TBL.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.05, 28), M.darkWood)
    foot.position.set(TBL.x, 0.025, TBL.z)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(DOME_R, 0.022, 8, 64).rotateX(Math.PI / 2), M.brass)
    ring.position.set(TBL.x, TBL.top + 0.012, TBL.z)
    root.add(top, stem, foot, ring)
    if (!light) {
      // (a rougher glass than the case's lid: a sharp one streaked the low sun down its inside)
      const dome = new THREE.Mesh(new THREE.SphereGeometry(DOME_R, 40, 16, 0, TAU, 0, Math.PI / 2), M.glass.clone())
      dome.material.roughness = 0.3
      dome.material.envMapIntensity = 0.4
      dome.position.set(TBL.x, TBL.top, TBL.z)
      dome.raycast = () => {}
      root.add(dome)
    }
    solids.push(circle(TBL.x, TBL.z, TBL.r + 0.05))
  }
  const earthTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#2a64b0'
    g.fillRect(0, 0, w, h)
    const rnd = random(107)
    for (let i = 0; i < 14; i++) {
      g.fillStyle = rnd() < 0.5 ? '#4f8a3a' : '#9a8550'
      g.beginPath()
      g.ellipse(rnd() * w, h * (0.2 + rnd() * 0.6), 10 + rnd() * 26, 6 + rnd() * 14, rnd() * 3, 0, TAU)
      g.fill()
    }
    g.fillStyle = 'rgba(255,255,255,0.7)'
    for (let i = 0; i < 18; i++) g.fillRect(rnd() * w, rnd() * h, 14 + rnd() * 30, 2 + rnd() * 3)
    g.fillStyle = '#eef4ff'
    g.fillRect(0, 0, w, 8)
    g.fillRect(0, h - 8, w, 8)
  })
  textures.push(earthTex)
  const earth = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 16), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.7, emissive: '#1a3a7a', emissiveIntensity: 0.35 }))
  earth.position.copy(EARTH)
  root.add(earth)
  const earthFlash = glowSprite(hdr('#ffe0a0', 2), 0.3, 0)
  earthFlash.position.copy(EARTH)
  root.add(earthFlash)
  const impactFlash = glowSprite(hdr('#ffd6a0', 2), 0.7, 0)
  impactFlash.position.copy(A)
  root.add(impactFlash)
  const impactor = new THREE.Mesh(lumpGeometry(111, 0.3, 1), new THREE.MeshStandardMaterial({ color: '#5e5246', roughness: 0.9, flatShading: true }))
  impactor.scale.setScalar(0.065)
  impactor.visible = false
  root.add(impactor)
  const IMP_FROM = A.clone().add(V3(-0.55, 0.12, 0.15)) // inside the dome
  const metalMat = new THREE.MeshStandardMaterial({ color: '#b6bcc5', roughness: 0.32, metalness: 0.7, emissive: '#303640', emissiveIntensity: 0.4 })
  const fragRock = new THREE.MeshStandardMaterial({ color: '#7a6650', roughness: 0.9, flatShading: true })
  const FRAGS = (() => {
    const rnd = random(113)
    return Array.from({ length: 18 }, (_, i) => {
      const metal = i < 7
      const a = rnd() * TAU
      const y = metal ? -0.15 + rnd() * 0.4 : -0.25 + rnd() * 0.6
      const dir = V3(Math.cos(a), y, Math.sin(a)).normalize()
      const geo = lumpGeometry(120 + i, 0.32, 1)
      const m = new THREE.Mesh(geo, metal ? metalMat : fragRock)
      const s = metal ? 0.03 + rnd() * 0.025 : 0.028 + rnd() * 0.035
      m.scale.setScalar(s)
      m.visible = false
      m.castShadow = true
      root.add(m)
      return { m, s, dir, dist: (metal ? 0.22 : 0.3) + rnd() * 0.14, spin: V3(rnd(), rnd(), rnd()).normalize(), sp: 0.4 + rnd() * 1.2, metal }
    })
  })()
  // fragment 0 is the one that falls to the little Earth
  const trail = Array.from({ length: 8 }, (_, i) => {
    const s = glowSprite(hdr('#ffc890', 1.6), 0.07 - i * 0.006, 0)
    root.add(s)
    return s
  })
  const fragHit = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 8), M.hit)
  fragHit.position.copy(A)
  root.add(fragHit)
  // the lens on its stand: the core's plates
  const LENS_A = V3(TBL.x - 0.98, 1.3, TBL.z + 0.05)
  const lensA = new THREE.Group()
  lensA.position.copy(LENS_A)
  lensA.rotation.y = facing(LENS_A.x, LENS_A.z, SPOTS.asteroid.x, SPOTS.asteroid.z)
  root.add(lensA)
  const plateTex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#141a3c'
    g.fillRect(0, 0, w, w)
  })
  textures.push(plateTex)
  {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.3, 48), new THREE.MeshBasicMaterial({ map: plateTex, toneMapped: false, color: '#d8dce4' }))
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.018, 10, 64), new THREE.MeshStandardMaterial({ color: VIOLET, emissive: VIOLET, emissiveIntensity: 0.9, roughness: 0.4 }))
    rim.position.z = 0.01
    const hitL = new THREE.Mesh(new THREE.CircleGeometry(0.34, 16), M.hit)
    hitL.position.z = 0.02
    lensA.add(disc, rim, hitL)
    const post = rod(M.brass, 0.018)
    post.userData.set(V3(0, -LENS_A.y, -0.04), V3(0, -0.3, -0.04))
    lensA.add(post)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.04, 20), M.darkWood)
    foot.position.set(0, -LENS_A.y + 0.02, -0.04)
    lensA.add(foot)
    solids.push(circle(LENS_A.x, LENS_A.z, 0.2))
  }
  const lensALabel = label3d('', 0.055, '#ffffff', { anchorX: 'center', maxWidth: 0.9 })
  lensALabel.position.set(0, -0.36, 0.03)
  lensA.add(lensALabel)

  // ---- the planet's state ----
  // ph: 0 whole (cold, mixed), 1 melted (heats, sinks, cools), 2 smashed; a: when it began; rate: the core's
  // cooling (°C per million years); ln: lens taps since it melted; n: steps so far
  const AS = { ph: 0, a: -99, rate: 300, ln: 0, n: 0, lensAt: -99 }
  const astBusy = () => {
    const t = clock - AS.a
    return (AS.ph === 1 && t < MELT_T) || (AS.ph === 2 && t < SMASH_T) || (AS.ph === 0 && AS.n > 0 && t < GATHER_T)
  }
  const rateOf = v => RATE_MIN * Math.pow(RATE_MAX / RATE_MIN, clamp(v))
  const vOf = r => Math.log(r / RATE_MIN) / Math.log(RATE_MAX / RATE_MIN)
  const roundRate = r => (r < 100 ? Math.round(r / 5) * 5 : r < 1000 ? Math.round(r / 10) * 10 : Math.round(r / 100) * 100)
  const rateText = (r, lv) => {
    const t = 250 / r
    return fill(at(E.asteroid.rate, lv), { r: roundRate(r), t: num(t, t >= 10 ? 0 : t >= 1 ? 1 : 2, lang) })
  }
  const asteroidPanel = lv => ({
    title: E.asteroid.title,
    color: ROCK_C,
    blocks: [
      {
        buttons: [
          { label: AS.ph === 0 ? E.asteroid.buttons.heat : AS.ph === 1 ? E.asteroid.buttons.smash : E.asteroid.buttons.again, onClick: () => asteroidStep('planet') },
          { label: E.asteroid.buttons.slow, onClick: () => setRate(SLOW, true) },
          { label: E.asteroid.buttons.fast, onClick: () => setRate(FAST, true) },
        ],
      },
      { slider: { label: E.asteroid.slider, min: 0, max: 1, step: 0.01, value: vOf(AS.rate), onInput: v => setRate(rateOf(v), false), format: v => rateText(rateOf(v), lv), live: () => vOf(AS.rate) } },
      ...paras(E.asteroid.panel[depth(lv)]),
    ],
  })
  function asteroidStep(what = 'planet') {
    const S = E.asteroid.says
    if (what === 'lens') {
      if (AS.ph === 0 || (AS.ph === 1 && clock - AS.a < 6.5)) return say(at(AS.ph === 0 ? S.first : W.busy, level()), ROCK_C)
      setRate(AS.rate < 400 ? FAST : SLOW, true)
      return
    }
    if (astBusy()) return busy()
    AS.ph = (AS.ph + 1) % 3
    AS.a = clock
    AS.n++
    if (AS.ph === 1) {
      AS.ln = 0
      play('beam')
      sayLater(0.8, S.heat, ROCK_C)
      sayLater(4.6, S.core, ROCK_C)
      sayLater(8.4, S.cooled, ROCK_C)
    } else if (AS.ph === 2) {
      later(1.0, () => play('bang'))
      later(3.6, () => play('pop'))
      sayLater(1.4, S.smash, ROCK_C)
      sayLater(3.9, S.earth, ROCK_C)
    } else {
      play('join')
      sayLater(0.6, S.again, ROCK_C)
    }
    share('asteroid')
    findOnce('asteroid', asteroidPanel, AS.ph === 1 ? MELT_T + 0.8 : 3)
    refresh(asteroidPanel)
  }
  let rateSend = null
  function setRate(r, now) {
    const v = clamp(Math.round(Number(r) || 0), RATE_MIN, RATE_MAX)
    if (v === AS.rate) return
    const slower = v < AS.rate
    AS.rate = v
    AS.lensAt = clock
    if (now) {
      AS.ln++
      play('select')
      say(at(slower ? E.asteroid.says.slower : E.asteroid.says.faster, level()), ROCK_C)
      share('asteroid')
      refresh(asteroidPanel)
    } else if (!rateSend) {
      rateSend = setTimeout(() => {
        rateSend = null
        share('asteroid')
      }, 250)
    }
    findOnce('asteroid', asteroidPanel, 2.5)
  }
  ex.add({
    id: 'asteroid',
    x: SPOTS.asteroid.x,
    z: SPOTS.asteroid.z,
    radius: 1.4,
    label: E.asteroid.label,
    verb: () => {
      const T = E.asteroid.hints
      const t = clock - AS.a
      if (AS.ph === 1) return t < MELT_T ? T.sinking : AS.ln ? T.smash : AS.rate < 400 ? T.faster : T.slower
      if (AS.ph === 2) return t < SMASH_T ? T.flying : T.again
      return T.heat
    },
    manual: true,
    focus: view(6.85, 1.28, -2.55, 1.15, 2.3),
    act: () => ctx.showPanel(asteroidPanel),
  })
  clickable(astG, () => asteroidStep('planet'), { when: () => AS.ph !== 2 || clock - AS.a < 1.0 })
  clickable(fragHit, () => asteroidStep('planet'), { when: () => AS.ph === 2 && clock - AS.a >= 1.0 })
  clickable(lensA, () => asteroidStep('lens'))
  let plateKey = ''
  function poseAsteroid(dt, t) {
    const age = clock - AS.a
    let k = 0
    let heat = 0
    let whole = 1
    if (AS.ph === 1) {
      heat = span(0, 2, age) * (1 - span(6.2, 9.4, age))
      k = span(1.6, 6.2, age)
    } else if (AS.ph === 2) {
      k = 1
      whole = age < 1.0 ? 1 : 0
    } else if (AS.n > 0 && age < GATHER_T) whole = span(0.8, GATHER_T, age)
    drawSection(k, heat)
    rockMat.emissiveIntensity = heat * 1.1
    sectionMat.emissiveIntensity = 0.15 + heat * 0.9
    astG.visible = whole > 0.01
    astG.scale.setScalar(0.6 + 0.4 * whole)
    astG.position.y = A.y + Math.sin(t * 0.8) * 0.012
    // the impactor, the flash
    impactor.visible = AS.ph === 2 && age < 1.0
    if (impactor.visible) {
      impactor.position.lerpVectors(IMP_FROM, A, span(0, 1, age) ** 1.5)
      impactor.rotation.x += dt * 3
    }
    impactFlash.material.opacity = AS.ph === 2 ? Math.max(0, 1 - Math.abs(age - 1.1) / 0.35) : 0
    impactFlash.scale.setScalar(0.4 + 0.6 * span(1.0, 1.4, age))
    // the fragments: flying out and drifting (smashed), or gathering into a new planet
    const gather = AS.ph === 0 && AS.n > 0 && age < GATHER_T
    FRAGS.forEach((f, i) => {
      let p = null
      let vis = 1
      if (AS.ph === 2 && age >= 1.0) {
        const d = f.dist * (1 - Math.exp(-(age - 1.0) * 2.4))
        p = A.clone().addScaledVector(f.dir, d)
        p.y += Math.sin(t * 0.9 + i) * 0.006
        if (i === 0) {
          const k0 = span(1.3, 3.6, age)
          p = p.lerp(EARTH, k0)
          vis = age < 3.65 ? 1 : 0
        }
      } else if (gather) {
        const g = span(0, 1.2, age)
        p = A.clone().addScaledVector(f.dir, f.dist * (1 - g))
        vis = 1 - g
        if (i === 0) vis = 0
      }
      f.m.visible = !!p && vis > 0.02
      if (f.m.visible) {
        f.m.position.copy(p)
        f.m.rotateOnAxis(f.spin, dt * f.sp)
        f.m.scale.setScalar(f.s * (0.55 + 0.45 * vis))
      }
    })
    // the trail behind the one bound for Earth
    const flying = AS.ph === 2 && age > 1.3 && age < 3.65
    trail.forEach((s, i) => {
      const kk = span(1.3, 3.6, age - i * 0.05)
      s.material.opacity = flying ? 0.5 * (1 - i / trail.length) : 0
      if (flying) s.position.copy(A.clone().addScaledVector(FRAGS[0].dir, FRAGS[0].dist * 0.6).lerp(EARTH, kk))
    })
    earthFlash.material.opacity = AS.ph === 2 ? Math.max(0, 1 - Math.abs(age - 3.7) / 0.3) : 0
    earth.rotation.y += dt * 0.3
    // the lens: no core yet, or the plates growing (wider the slower)
    const grown = AS.ph === 1 ? span(6.5, 10.5, age) : AS.ph === 2 ? 1 : 0
    const g = grown > 0 ? Math.min(grown, 0.15 + 0.85 * span(AS.lensAt, AS.lensAt + 2.2, clock)) : 0
    const band = lerp(26, 5, vOf(AS.rate))
    const key = `${Math.round(g * 40)}:${Math.round(band * 2)}`
    if (key !== plateKey) {
      plateKey = key
      plateTex.userData.redraw((c, w, h) => {
        if (g <= 0) {
          c.fillStyle = '#141a3c'
          c.fillRect(0, 0, w, h)
          c.fillStyle = 'rgba(154,140,255,0.18)'
          c.beginPath()
          c.arc(w / 2, h / 2, w * 0.22, 0, TAU)
          c.fill()
        } else drawWidman(c, w, h, { band, grow: g, seed: 131 })
      })
    }
    const lv = level()
    const L = E.asteroid.lensLabel
    const label = grown <= 0 ? L.none : lv === 'scientist' ? fill(L.sci, { r: roundRate(AS.rate) }) : AS.rate < 150 ? L.slow : AS.rate > 1500 ? L.fast : L.mid
    setText(lensALabel, label)
  }

  // ======== the farm round about: acacias, termite mounds, shooting stars ========
  for (const [x, z, s, seed] of ACACIAS) {
    const a = acacia(M, seed)
    a.position.set(x, 0, z)
    a.scale.setScalar(s)
    a.rotation.y = seed
    root.add(a)
    solids.push(circle(x, z, 0.3 * s))
  }
  for (const [x, z, s, seed] of MOUNDS) {
    const m = termiteMound(M.mound, seed)
    m.position.set(x, 0, z)
    m.scale.setScalar(s)
    root.add(m)
    solids.push(circle(x, z, 0.6 * s))
  }
  const streakTex = canvasTex(256, 32, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, 0)
    grd.addColorStop(0, 'rgba(255,220,170,0)')
    grd.addColorStop(0.8, 'rgba(255,236,200,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,1)')
    g.fillStyle = grd
    g.beginPath()
    g.moveTo(0, h / 2)
    g.lineTo(w - 8, h / 2 - 4)
    g.arc(w - 8, h / 2, 4, -Math.PI / 2, Math.PI / 2)
    g.closePath()
    g.fill()
  })
  textures.push(streakTex)
  const meteor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: streakTex, color: hdr('#fff3d6', 1.8), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }))
  meteor.frustumCulled = false
  meteor.visible = false
  meteor.renderOrder = -4
  meteor.raycast = () => {}
  root.add(meteor)
  const MS = { next: 3 + Math.random() * 4, life: -1, dur: 1, p0: V3(0, 0, 0), d: V3(0, 0, 0), len: 9 }
  const basis = new THREE.Matrix4()
  const bx = V3(0, 0, 0)
  const by = V3(0, 0, 0)
  const bz = V3(0, 0, 0)
  function poseMeteor(dt) {
    if (MS.life < 0) {
      MS.next -= dt
      if (MS.next > 0) return
      // a new one, somewhere in the dark sky ahead
      const az = -Math.PI / 2 + (Math.random() - 0.5) * 1.6
      const el = 0.45 + Math.random() * 0.45
      MS.p0.set(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)).multiplyScalar(80)
      const side = V3(-Math.sin(az), 0, Math.cos(az)).multiplyScalar(Math.random() < 0.5 ? -1 : 1)
      MS.d.copy(side).add(V3(0, -0.55 - Math.random() * 0.4, 0)).normalize()
      MS.dur = 0.6 + Math.random() * 0.5
      MS.len = 7 + Math.random() * 6
      MS.life = 0
    }
    MS.life += dt
    const k = MS.life / MS.dur
    if (k >= 1) {
      MS.life = -1
      MS.next = 5 + Math.random() * 9
      meteor.visible = false
      return
    }
    const head = MS.p0.clone().addScaledVector(MS.d, k * 16)
    const L = MS.len * Math.min(1, k * 3)
    meteor.visible = true
    meteor.position.copy(head).addScaledVector(MS.d, -L / 2)
    bx.copy(MS.d)
    bz.copy(cam().position).sub(meteor.position).normalize()
    by.crossVectors(bz, bx).normalize()
    bz.crossVectors(bx, by)
    basis.makeBasis(bx, by, bz)
    meteor.quaternion.setFromRotationMatrix(basis)
    meteor.scale.set(L, 0.35, 1)
    meteor.material.opacity = Math.sin(Math.PI * k)
  }

  updates.push((dt, t) => {
    stage.update(t)
    poseHoba(dt)
    poseDagger()
    poseEtch(dt, t)
    poseAsteroid(dt, t)
    poseMeteor(dt)
  })

  // ---- shared with the room: each exhibit's state, its time running on by its age ----
  const hobaState = () => ({
    x: HB.x,
    xa: HB.x ? Math.min(30, r1(clock - HB.xa)) : 0,
    m: HB.m,
    mu: HB.mu,
    ma: Math.min(30, r1(clock - HB.ma)),
    e: HB.e,
  })
  const daggerState = () => ({ w: DG.w, n: DG.n, a: DG.w >= 0 ? Math.min(30, r1(clock - DG.a)) : 0, seen: [...DG.seen] })
  const etchState = () => ({
    cur: ET.cur,
    st: [...ET.st],
    lk: [...ET.lk],
    lens: ET.lens,
    act: ET.act && clock - ET.act.start < (TOOL_T[ET.act.tool] ?? 1) ? { tool: ET.act.tool, p: ET.act.p, age: Math.min(30, r1(clock - ET.act.start)) } : null,
    n: ET.n,
  })
  const asteroidState = () => ({ ph: AS.ph, a: Math.min(30, r1(clock - AS.a)), rate: AS.rate, ln: AS.ln, n: AS.n })

  return {
    env: stage.env,
    solids,
    floor: floorAt,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, minY: -0.1, maxZ: 9.4 },
    cameraPitchMax: 0.5,
    spawn: { x: 0, z: 6.4, yaw: 0 },
    hostSpot: { x: 1.9, z: 5.0, yaw: Math.atan2(1.9, -1.3) },
    back: { x: 0, z: 10.0, rot: Math.PI },
    stand: { x: -3.1, z: 5.3, rot: Math.atan2(3.1, 1.1) },
    parts: {
      hoba: {
        tap: what => hobaStep(what), // 'meter' | 'magnet' | 'scale'
        eleph: n => setEleph(n, true),
        get state() {
          return hobaState()
        },
        at: what => (what === 'magnet' ? magnet.localToWorld(V3(0, -0.05, 0)) : what === 'scale' ? pans[1].localToWorld(V3(0, 0.1, 0)) : what === 'block' ? V3(H.x, TOP, H.z) : meter.group.localToWorld(V3(0, 0, 0))),
      },
      dagger: {
        tap: which => daggerStep(which), // 'dagger' | 'knife'
        get state() {
          return daggerState()
        },
        at: which => (which === 'knife' ? knife : dagger).localToWorld(V3(0.06, 0.01, 0)),
      },
      etch: {
        tap: (what, i) => etchStep(what, i), // 'pick' (with the piece 0..2), 'saw', 'polish', 'acid', 'lens', 'fresh'
        get state() {
          return etchState()
        },
        at: (what, i = 0) => {
          if (what === 'pick') return pieces[i].group.localToWorld(V3(0, 0, 0))
          const o = { saw: saw, polish: pol.group, acid: bottle, lens: lensHolder, fresh: crate }[what]
          return o.localToWorld(V3(0, what === 'acid' ? 0.05 : what === 'fresh' ? 0.2 : 0, 0))
        },
      },
      asteroid: {
        tap: what => asteroidStep(what), // 'planet' | 'lens'
        rate: r => setRate(r, true),
        get state() {
          return asteroidState()
        },
        at: what => (what === 'lens' ? lensA.localToWorld(V3(0, 0, 0)) : A.clone()),
      },
      rayTo: q => new THREE.Ray(ctx.camera.position.clone(), q.clone().sub(ctx.camera.position).normalize()),
    },
    panels: { hoba: hobaPanel, dagger: daggerPanel, etch: etchPanel, asteroid: asteroidPanel },
    shared: {
      hoba: {
        get: hobaState,
        set: (s, live, ago = 0) => {
          const a0 = Math.max(0, Number(ago) || 0)
          const x = int(s?.x, 0, 1e6)
          if (x !== HB.x || !live) HB.xa = clock - clamp((Number(s?.xa) || 0) + a0, 0, 99)
          if (x > HB.x && live) later(0.9, () => play('beep'))
          HB.x = x
          const m = s?.m ? 1 : 0
          if (m !== HB.m || !live) {
            HB.ma = clock - clamp((Number(s?.ma) || 0) + a0, 0, 99)
            HB.clunked = !live || !m
            HB.swung = HB.swung || !!s?.mu
          }
          HB.m = m
          HB.mu = s?.mu ? 1 : 0
          const e = int(s?.e, 0, MAX_EL)
          if (e > HB.e && live) HB.eAt = clock
          HB.e = e
          refresh(hobaPanel)
        },
      },
      dagger: {
        get: daggerState,
        set: (s, live, ago = 0) => {
          const w = int(s?.w, -1, 1)
          const n = int(s?.n, 0, 1e6)
          if (n !== DG.n && live) {
            DG.from = meterD.group.position.clone()
            later(0.7, () => play('beep'))
          }
          if (!live) DG.from = null
          DG.w = w
          DG.n = n
          DG.a = clock - clamp((Number(s?.a) || 0) + Math.max(0, Number(ago) || 0), 0, 99)
          DG.seen = [0, 1].map(i => (Array.isArray(s?.seen) && s.seen[i] ? 1 : 0))
          refresh(daggerPanel)
        },
      },
      etch: {
        get: etchState,
        set: (s, live, ago = 0) => {
          const a0 = Math.max(0, Number(ago) || 0)
          ET.cur = int(s?.cur, 0, 2)
          ET.st = [0, 1, 2].map(i => int(Array.isArray(s?.st) ? s.st[i] : 0, 0, 3))
          ET.lk = [0, 1, 2].map(i => (Array.isArray(s?.lk) && s.lk[i] ? 1 : 0))
          ET.lens = int(s?.lens, -1, 2)
          const n = int(s?.n, 0, 1e6)
          const act = s?.act
          const tool = ['pick', 'saw', 'polish', 'acid', 'fresh'].includes(act?.tool) ? act.tool : null
          if (tool) {
            const age = clamp((Number(act.age) || 0) + a0, 0, 99)
            ET.act = { tool, p: int(act.p, 0, 2), start: clock - age }
            if (live && age < 0.5) {
              if (tool === 'acid') later(1.3, () => play('fizz'))
              else if (tool === 'fresh') play('pop')
              else play('select')
            }
          } else ET.act = null
          ET.n = n
          refresh(etchPanel)
        },
      },
      asteroid: {
        get: asteroidState,
        set: (s, live, ago = 0) => {
          const ph = int(s?.ph, 0, 2)
          const n = int(s?.n, 0, 1e6)
          const age = clamp((Number(s?.a) || 0) + Math.max(0, Number(ago) || 0), 0, 99)
          if (live && n !== AS.n) {
            if (ph === 1) play('beam')
            else if (ph === 2) later(Math.max(0, 1.0 - age), () => play('bang'))
            else play('join')
          }
          AS.ph = ph
          AS.n = n
          AS.a = clock - age
          const rate = clamp(Math.round(Number(s?.rate) || 300), RATE_MIN, RATE_MAX)
          if (rate !== AS.rate) AS.lensAt = live ? clock : clock - 99
          AS.rate = rate
          AS.ln = int(s?.ln, 0, 1e6)
          refresh(asteroidPanel)
        },
      },
    },
    update(dt, t) {
      clock += dt
      for (const u of updates) u(dt, t)
    },
    dispose() {
      if (elSend) clearTimeout(elSend)
      if (rateSend) clearTimeout(rateSend)
      stage.dispose()
      for (const tx of textures) tx.dispose()
      disposers.forEach(f => f())
    },
  }
}
