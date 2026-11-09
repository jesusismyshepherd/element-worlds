// Silver's picture "Why is a dollar called a dollar?" as a room (docs/knowledge/picture-rooms.md). The
// picture shows a treasure galleon's deck at night under a full moon: an open chest of silver coins, one coin
// cut into eight pieces with a chisel beside it, a second galleon under sail, a far shore, and a lens on the
// silver atoms with a few copper atoms among them. Here it is that deck (stages/galleon.js: wood, rope,
// canvas and lantern light), a galleon at anchor off the American coast. Each step is chosen by tapping its
// thing (the user's rule, 2026-10-30); the prompt names the next tap; E opens the station's panel, whose
// buttons and slider do the same:
// - pieces of eight (the waist, on the left): a coin a metre across on a cutting block. Tap the chisel: it
//   cuts the coin in halves (4 reales), quarters (2 reales, "two bits") and eighths (1 real, "one bit"), and a
//   piece goes on the scale (27.47 g, 13.73, 6.87, 3.43). On the little table: a rough hand-struck "cob" and a
//   round milled coin. Tap either to clip a sliver off its edge: on the cob it hardly shows, on the milled
//   coin the pattern of the edge breaks and everyone sees it. Tap the cut coin for a fresh one;
// - the silver roads (the great cabin, on the left under the castle): a world map in relief on a sloping table.
//   Five pins: Joachimsthal (the word "dollar" fans out as tags: tolar, talar, Taler, daler, dollar), Potosi,
//   Mexico (Zacatecas, Guanajuato), Seville and Manila. A year slider (1500 to 1857) lights the roads as
//   their silver began to flow, a caption on the bulkhead tells what happened that year;
// - the purser's corner (under the castle, on the right): six coins that look alike, three true and three
//   false (lead, copper, tin under a silver skin), all of one size (2.65 cm3). Tap a coin: it drops on the
//   slab, silver rings, a fake thuds (a rough test). Tap the can: the coin goes in and the water it
//   displaces runs up a 10 mL tube. Tap the scale: its mass. A board reads the density on a ladder (tin
//   7.29, copper 8.96, silver coin 10.38, lead 11.34 g/cm3).
// Sources and the facts, in dollar.words.js. All of it is shared in a room (src/net/shared.js); words, panels
// and discoveries stay each one's. parts.<station> does what a tap does, for the probes; parts.at.<thing>()
// gives a point to aim a real tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, clamp, damp, fill, canvasTex, random } from '../../../wings/noble/kit.js'
import { galleonStage } from '../../stages/galleon.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { LAND } from '../../../wings/oxygen/earthLand.js'
import { DOLLAR_WORDS } from './dollar.words.js'

export const WORDS = DOLLAR_WORDS

const TAU = Math.PI * 2
const DEG = Math.PI / 180
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }

// ---- the coin: 27.47 g of 93% silver and 7% copper ----
const MASS = [27.47, 13.73, 6.87, 3.43] // the whole coin, a half, a quarter, an eighth (g)
const RHO = { ag: 1 / (0.93 / 10.501 + 0.07 / 8.96), pb: 11.342, cu: 8.96, sn: 7.287 } // g/cm3, elements.json
const VOL = 27.47 / RHO.ag // 2.65 cm3, the size of every coin on the slab
const SETS = ['ag', 'pb', 'ag', 'cu', 'sn', 'ag'] // the six coins: three true, three false
const PIN_YEAR = { joachim: 1520, potosi: 1545, mexico: 1537, seville: 1545, manila: 1565 }

// ---- the silver roads: lon, lat ----
const WIN = { lon0: -135, lon1: 150, lat0: -42, lat1: 66 } // the map's window
const MAPW = 2.5
const S = MAPW / (WIN.lon1 - WIN.lon0) // metres a degree
const MAPH = (WIN.lat1 - WIN.lat0) * S
const PLACE = {
  joachim: [12.9, 50.4],
  potosi: [-65.75, -19.6],
  mexico: [-102.6, 22.8],
  seville: [-5.99, 37.39],
  manila: [121.0, 14.6],
}
const ROUTES = [
  // Potosi by llama and mule to the coast, by sea to Panama, across the isthmus, Havana, the fleet to Seville
  { id: 'A', from: 1545, pts: [[-65.75, -19.6], [-70.3, -18.5], [-77.1, -12.0], [-79.5, 9.0], [-82.4, 23.1], [-45, 33], [-5.99, 37.39]] },
  // Mexico by mule to Veracruz, Havana, the fleet to Seville
  { id: 'B', from: 1537, pts: [[-102.6, 22.8], [-96.1, 19.2], [-82.4, 23.1], [-50, 36], [-5.99, 37.39]] },
  // Mexico City to Acapulco, then the Manila galleon off the left edge of the map
  { id: 'C', from: 1565, to: 1815, pts: [[-99.1, 19.4], [-99.9, 16.85], [-118, 15.5], [-135, 15.8]] },
  // ...and in again at the right edge, to Manila
  { id: 'D', from: 1565, to: 1815, pts: [[150, 15.4], [135, 15.6], [121.0, 14.6]] },
]
const TAGS = ['dollar', 'daler', 'Taler', 'tolar', 'talar']

// ---- the silver look: a drawn matcap (a lit metal face only mirrors the room it stands in) ----
let capTex = null
function silverMatcap() {
  if (capTex) return capTex
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const base = g.createLinearGradient(0, 0, 0, 256)
  for (const [o, col] of [[0, '#a3a9b3'], [0.38, '#737a86'], [0.62, '#3c414b'], [0.82, '#24272e'], [1, '#3a3e47']]) base.addColorStop(o, col)
  g.fillStyle = base
  g.fillRect(0, 0, 256, 256)
  const rim = g.createRadialGradient(128, 128, 92, 128, 128, 128)
  rim.addColorStop(0, 'rgba(206,212,222,0)')
  rim.addColorStop(1, 'rgba(206,212,222,0.5)')
  g.fillStyle = rim
  g.fillRect(0, 0, 256, 256)
  for (const [x, y, r, a] of [[86, 72, 30, 0.9], [176, 92, 18, 0.8], [140, 44, 11, 0.7], [62, 150, 10, 0.5], [196, 170, 8, 0.45]]) {
    const w = g.createRadialGradient(x, y, 0, x, y, r)
    w.addColorStop(0, `rgba(244,246,250,${a})`)
    w.addColorStop(0.5, `rgba(214,220,230,${a * 0.6})`)
    w.addColorStop(1, 'rgba(214,220,230,0)')
    g.fillStyle = w
    g.fillRect(x - r, y - r, 2 * r, 2 * r)
  }
  capTex = new THREE.CanvasTexture(c)
  capTex.colorSpace = THREE.SRGBColorSpace
  capTex.userData.shared = true
  return capTex
}

/** A piece of eight's face as relief in grey: beads round the rim, two crowned pillars either side of two
 *  globes over the waves (the milled "pillar dollar"). */
function coinArt() {
  return canvasTex(256, 256, (g, s) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, s, s)
    g.strokeStyle = '#8e939c'
    g.fillStyle = '#8e939c'
    g.lineWidth = s * 0.02
    g.beginPath()
    g.arc(s / 2, s / 2, s * 0.43, 0, TAU)
    g.stroke()
    for (let k = 0; k < 40; k++) {
      const a = (k / 40) * TAU
      g.beginPath()
      g.arc(s / 2 + Math.cos(a) * s * 0.465, s / 2 + Math.sin(a) * s * 0.465, s * 0.011, 0, TAU)
      g.fill()
    }
    for (const x of [0.27, 0.73]) {
      g.fillRect(s * x - s * 0.025, s * 0.3, s * 0.05, s * 0.4)
      g.fillRect(s * x - s * 0.045, s * 0.28, s * 0.09, s * 0.03)
      g.fillRect(s * x - s * 0.045, s * 0.69, s * 0.09, s * 0.03)
      g.beginPath()
      g.arc(s * x, s * 0.24, s * 0.035, Math.PI, 0)
      g.fill()
    }
    for (const x of [0.43, 0.57]) {
      g.beginPath()
      g.arc(s * x, s * 0.47, s * 0.09, 0, TAU)
      g.stroke()
    }
    g.lineWidth = s * 0.014
    for (const y of [0.64, 0.69]) {
      g.beginPath()
      for (let i = 0; i <= 24; i++) {
        const x = 0.36 + (i / 24) * 0.28
        const yy = y + Math.sin(i * 1.4) * 0.012
        if (i) g.lineTo(s * x, s * yy)
        else g.moveTo(s * x, s * yy)
      }
      g.stroke()
    }
  })
}

/** A pie slice of a unit disc from angle a0 to a1 (shape plane x right, y up), `depth` thick, centred on z. */
function sectorGeo(a0, a1, depth) {
  const sh = new THREE.Shape()
  sh.moveTo(0, 0)
  sh.lineTo(Math.cos(a0), Math.sin(a0))
  sh.absarc(0, 0, 1, a0, a1, false)
  sh.lineTo(0, 0)
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false, curveSegments: 10 })
  g.translate(0, 0, -depth / 2)
  return g
}
/** The centre of a slice's area, as a share of the radius. */
function sliceCentre(a0, a1) {
  const d = a1 - a0
  const r = (2 * Math.sin(d / 2)) / (3 * (d / 2))
  return [r * Math.cos((a0 + a1) / 2), r * Math.sin((a0 + a1) / 2)]
}
/** A coin's disc from its outline (radius as a function of the angle, about 1), with a small bevel. */
function discGeo(radiusAt, depth) {
  const n = 96
  const sh = new THREE.Shape()
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU
    const r = radiusAt(a)
    if (i) sh.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    else sh.moveTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  sh.closePath()
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: depth * 0.16, bevelSize: 0.012, bevelSegments: 2, curveSegments: 1 })
  g.translate(0, 0, -depth / 2)
  return g
}
/** A straight clip across the rim at angle `at`: the radius cannot pass the chord at `d` of the radius. */
const clipped = (base, at, d) => a => {
  const delta = Math.atan2(Math.sin(a - at), Math.cos(a - at))
  const c = Math.cos(delta)
  return c > 0.2 ? Math.min(base(a), d / c) : base(a)
}
const COB = a => 1 + 0.045 * Math.sin(3 * a + 1.3) + 0.035 * Math.sin(5 * a + 0.2) + 0.02 * Math.sin(9 * a + 2.1) - 0.03 * Math.cos(2 * a)
const ROUND = () => 1

/** Subject to a rectangle (Sutherland-Hodgman): the land's rings cut to the map's window. */
function clipRing(pts, [x0, x1, y0, y1]) {
  const edges = [
    [p => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [p => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [p => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
    [p => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]],
  ]
  let out = pts
  for (const [inside, cross] of edges) {
    const inp = out
    out = []
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i]
      const b = inp[(i + 1) % inp.length]
      if (inside(a)) {
        out.push(a)
        if (!inside(b)) out.push(cross(a, b))
      } else if (inside(b)) out.push(cross(a, b))
    }
    if (!out.length) break
  }
  return out
}
/** The land's rings as [[lon, lat], ...] (earthLand.js keeps them in fifths of a degree, as steps). */
function landRings() {
  return LAND.map(ring => {
    const out = []
    let lon = ring[0]
    let lat = ring[1]
    out.push([lon / 5, lat / 5])
    for (let i = 2; i < ring.length; i += 2) {
      lon += ring[i]
      lat += ring[i + 1]
      out.push([lon / 5, lat / 5])
    }
    return out
  })
}

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const stage = galleonStage({ light })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const tweens = []
  const tween = (dur, fn, done) => tweens.push({ t: 0, dur, fn, done })
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v).replace('-', '−')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const hitSphere = r => new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), ghost)
  const hitBox = (w, h, d) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ghost)
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  const V = (x, y, z) => new THREE.Vector3(x, y, z)
  const sign = (text, size, { color: c = '#f3e6c8', maxWidth = 3, anchorX = 'center', anchorY = 'middle' } = {}) =>
    makeText(text, { size, color: c, maxWidth, anchorX, anchorY, outlineWidth: size * 0.08, outlineColor: '#120c06' })
  /** A canvas screen in a dark frame, facing +z: draw on `g`, then `tex.needsUpdate = true`. */
  function canvasScreen(w, h, px = 1024, frameMat = mats.dark) {
    const cw = px
    const ch = Math.round((px * h) / w)
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures.push(tex)
    const group = new THREE.Group()
    const frame = new THREE.Mesh(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.06, 2, 0.02), frameMat)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#dcdcdc', toneMapped: false }))
    face.position.z = 0.035
    group.add(frame, face)
    return { group, g: canvas.getContext('2d'), w: cw, h: ch, tex, face }
  }
  /** A line that shrinks until it fits (the four languages differ in length). */
  const fit = (g, text, x, y, size, weight = 700, maxW = 400, family = 'Outfit') => {
    let s = size
    g.font = `${weight} ${s}px ${family}`
    while (s > 11 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px ${family}`
    g.fillText(text, x, y)
  }
  /** Words wrapped to `maxW` pixels, at most `maxLines` lines (shrinks the size until they fit). */
  const wrap = (g, text, x, y, maxW, size, maxLines, weight = 600, family = 'Nunito') => {
    let s = size
    let lines = []
    for (;;) {
      g.font = `${weight} ${s}px ${family}`
      lines = []
      let line = ''
      for (const word of String(text).split(' ')) {
        const test = line ? `${line} ${word}` : word
        if (g.measureText(test).width > maxW && line) {
          lines.push(line)
          line = word
        } else line = test
      }
      lines.push(line)
      if (lines.length <= maxLines || s <= 14) break
      s -= 2
    }
    lines.forEach((l, i) => g.fillText(l, x, y + i * s * 1.2))
    return lines.length
  }

  // ---- shared materials ----
  const cap = silverMatcap()
  const artUp = coinArt() // for the unit-disc shapes (their uv is x and y)
  artUp.repeat.set(0.5, 0.5)
  artUp.offset.set(0.5, 0.5)
  const artCob = artUp.clone()
  artCob.repeat.set(0.42, 0.42)
  artCob.offset.set(0.66, 0.46) // a hand strike: the die only half on the blank
  artCob.needsUpdate = true
  textures.push(artUp, artCob)
  const faceMat = new THREE.MeshMatcapMaterial({ matcap: cap, map: artUp, color: '#eceef2' })
  const cobMat = new THREE.MeshMatcapMaterial({ matcap: cap, map: artCob, color: '#d9dce2' })
  const edgeMat = new THREE.MeshMatcapMaterial({ matcap: cap, color: '#b7bcc6' })
  const darkSilver = new THREE.MeshMatcapMaterial({ matcap: cap, color: '#60646c' })
  const tealMat = new THREE.MeshStandardMaterial({ color: '#36c9b5', emissive: '#36c9b5', emissiveIntensity: 0.9, roughness: 0.4 })
  const brassGlow = new THREE.MeshStandardMaterial({ color: '#d9ab4a', emissive: '#7a5410', emissiveIntensity: 0.4, roughness: 0.35, metalness: 0.7 })
  const glassMat = new THREE.MeshStandardMaterial({ color: '#cfe8f2', transparent: true, opacity: 0.16, roughness: 0.1, depthWrite: false })
  const waterMat = new THREE.MeshStandardMaterial({ color: '#4aa8c8', transparent: true, opacity: 0.6, roughness: 0.2, depthWrite: false })
  const steel = new THREE.MeshStandardMaterial({ color: '#b4bcc8', roughness: 0.3, metalness: 0.7, emissive: '#2a3040', emissiveIntensity: 0.5 })
  const bronze = new THREE.MeshStandardMaterial({ color: '#6e5a3a', roughness: 0.5, metalness: 0.6 })
  const stoneMat = new THREE.MeshStandardMaterial({ color: '#7d7a72', roughness: 0.9 })
  // a flash where metal meets metal
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: '#ffe9b0', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  flash.scale.setScalar(0.5)
  root.add(flash)
  let flashT = 9
  const sparkAt = p => {
    flash.position.copy(p)
    flashT = 0
  }
  updates.push(dt => {
    flashT += dt
    flash.material.opacity = Math.max(0, 1 - flashT * 5)
  })

  // ======================================================================================================
  // Pieces of eight: a giant coin on a block, the chisel, the scale; the cob and the milled coin
  // ======================================================================================================
  const BL = { x: -2.5, z: 0.2 }
  const CN = { y: 1.1, R: 0.5, T: 0.07, tilt: 0.14 }
  const TB = { x: -0.5, z: 2.5, top: 0.78 }
  const SC = { x: -1.2, z: 0.4 }
  const RESTP = V(-2.0, 0.02, 1.05)
  const pc = { cuts: 0, cob: false, mil: false, n: 0 }
  const pcShown = { cuts: 0 } // what is drawn: the cuts show when the chisel's blow has landed
  let panCuts = 0
  let pcBusy = false
  let pcMine = false
  let cutAnim = null
  const sep = [0, 0, 0]
  const bigG = new THREE.Group()
  bigG.position.set(BL.x, CN.y, BL.z)
  bigG.rotation.x = -CN.tilt
  root.add(bigG)
  {
    // the block: a stump with a worn top, two chocks
    const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.5, 0.64, 16), mats.wood)
    stump.position.set(BL.x, 0.32, BL.z + 0.02)
    stump.castShadow = !light
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 16), mats.rail)
    top.position.set(BL.x, 0.64, BL.z + 0.02)
    root.add(stump, top)
    for (const s of [-1, 1]) {
      const chock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.2), mats.rail)
      chock.position.set(BL.x + s * 0.2, 0.75, BL.z + 0.02)
      chock.rotation.z = -s * 0.5
      root.add(chock)
    }
    solids.push(circle(BL.x, BL.z, 0.55))
  }
  const sectors = []
  for (let s = 0; s < 8; s++) {
    const a0 = -Math.PI / 2 + (s * Math.PI) / 4
    const mesh = new THREE.Mesh(sectorGeo(a0, a0 + Math.PI / 4, CN.T / CN.R), [faceMat, edgeMat])
    mesh.scale.setScalar(CN.R)
    mesh.castShadow = !light
    bigG.add(mesh)
    sectors.push({ mesh, mid: a0 + Math.PI / 8, half: s < 4 ? 0 : 1, quarter: s >> 1 })
  }
  const midOf = [[0, Math.PI], [-Math.PI / 4, Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4]]
  const bigHit = new THREE.Mesh(new THREE.CylinderGeometry(CN.R * 1.12, CN.R * 1.12, 0.2, 16).rotateX(Math.PI / 2), ghost)
  bigG.add(bigHit)
  const GAP = 0.05
  const placeSectors = () => {
    for (const s of sectors) {
      const dirs = [[midOf[0][s.half], sep[0]], [midOf[1][s.quarter], sep[1]], [s.mid, sep[2]]]
      let x = 0
      let y = 0
      for (const [a, k] of dirs) {
        x += Math.cos(a) * GAP * k
        y += Math.sin(a) * GAP * k
      }
      s.mesh.position.set(x, y, 0)
    }
  }
  placeSectors()
  // the chisel and the mallet (one tool: the mallet rides above the chisel's head)
  const tool = new THREE.Group()
  const mallet = new THREE.Group()
  {
    const blade = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.46, 0.02, 1, 0.006), steel)
    blade.position.y = 0.23
    const bevel = new THREE.Mesh(new THREE.ConeGeometry(0.056, 0.1, 4).rotateY(Math.PI / 4).scale(1, 1, 0.22), steel)
    bevel.rotation.x = Math.PI
    bevel.position.y = 0.04
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.05, 10), mats.brass)
    collar.position.y = 0.47
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.4, 10), mats.rail)
    handle.position.y = 0.7
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.3, 14).rotateZ(Math.PI / 2), mats.wood)
    head.position.set(0.04, 0.1, 0)
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 8), mats.rail)
    grip.rotation.z = -1.1
    grip.position.set(0.24, 0.0, 0)
    mallet.add(head, grip)
    mallet.position.y = 1.0
    tool.add(blade, bevel, collar, handle, mallet)
    const hit = hitBox(0.5, 1.5, 0.5)
    hit.position.y = 0.7
    tool.add(hit)
    tool.position.copy(RESTP)
    tool.castShadow = !light
    root.add(tool)
    // a little rack for it: a post with a slot
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.16, 10), mats.rail)
    post.position.set(RESTP.x, 0.08, RESTP.z)
    root.add(post)
  }
  tool.userData.rest = { p: RESTP.clone(), q: new THREE.Quaternion() }
  // the scale: a post and a tilted brass plate that dips under a load, a board behind it
  const plate = new THREE.Group()
  const piecePan = new THREE.Mesh(sectorGeo(-Math.PI / 2, Math.PI / 2, 0.1), [faceMat, edgeMat])
  const panGeos = [sectorGeo(-Math.PI / 2, Math.PI / 2, 0.1), sectorGeo(-Math.PI / 2, 0, 0.1), sectorGeo(-Math.PI / 2, -Math.PI / 4, 0.1)]
  const panCentre = [sliceCentre(-Math.PI / 2, Math.PI / 2), sliceCentre(-Math.PI / 2, 0), sliceCentre(-Math.PI / 2, -Math.PI / 4)]
  const PAN_S = 0.4
  let plateY = 0.66
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.62, 12), mats.wood)
    post.position.set(SC.x, 0.31, SC.z)
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.06, 16), mats.rail)
    foot.position.set(SC.x, 0.03, SC.z)
    root.add(post, foot)
    plate.position.set(SC.x, plateY, SC.z)
    plate.rotation.x = -0.6435
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.035, 28).rotateX(Math.PI / 2), bronze)
    const rimT = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.025, 6, 28), mats.brass)
    disc.position.z = 0
    plate.add(disc, rimT)
    piecePan.scale.setScalar(PAN_S)
    piecePan.position.z = 0.04
    piecePan.visible = false
    plate.add(piecePan)
    root.add(plate)
    solids.push(circle(SC.x, SC.z, 0.4))
  }
  const board = canvasScreen(1.4, 0.62, 1024)
  board.group.position.set(SC.x, 1.55, SC.z - 0.2)
  board.group.rotation.x = -0.22
  root.add(board.group)
  const posts = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.0, 0.05), mats.rail)
  posts.position.set(SC.x, 1.06, SC.z - 0.32)
  root.add(posts)
  // the little table with the cob and the milled coin
  const small = {}
  const tableG = new THREE.Group()
  tableG.position.set(TB.x, 0, TB.z)
  root.add(tableG)
  {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, TB.top - 0.04, 12), mats.wood)
    leg.position.y = (TB.top - 0.04) / 2
    const topM = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.05, 20), mats.rail)
    topM.position.y = TB.top - 0.025
    tableG.add(leg, topM)
    solids.push(circle(TB.x, TB.z, 0.5))
  }
  const RS = 0.17
  const TS = 0.028
  function smallCoin(kind, x) {
    const g = new THREE.Group()
    g.position.set(x, TB.top + 0.03 + RS * 0.98, 0.06)
    g.rotation.x = -0.28
    const holder = new THREE.Mesh(new THREE.BoxGeometry(RS * 1.2, 0.045, 0.1), mats.rail)
    holder.position.set(x, TB.top + 0.02, 0.1)
    tableG.add(holder)
    const base = kind === 'cob' ? COB : ROUND
    const mesh = new THREE.Mesh(discGeo(base, TS / RS), [kind === 'cob' ? cobMat : faceMat, edgeMat])
    mesh.scale.setScalar(RS)
    g.add(mesh)
    const out = { g, mesh, base, kind, clip: false, reeds: null, arc: null, sliver: null }
    if (kind === 'milled') {
      // the milled edge: 72 little ridges round the rim (the clip hides those it cuts through)
      const n = 72
      const reeds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.0085, 0.0085, TS * 0.92), darkSilver, n)
      reeds.frustumCulled = false
      const d = new THREE.Object3D()
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU
        d.position.set(Math.cos(a) * RS * 1.012, Math.sin(a) * RS * 1.012, 0)
        d.rotation.set(0, 0, a)
        d.scale.setScalar(1)
        d.updateMatrix()
        reeds.setMatrixAt(i, d.matrix)
      }
      g.add(reeds)
      out.reeds = reeds
      out.n = n
      // a red-gold arc where the pattern breaks
      const arc = new THREE.Mesh(new THREE.TorusGeometry(RS * 1.1, 0.006, 6, 20, 0.7), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff9a4a').multiplyScalar(1.6), toneMapped: false }))
      arc.rotation.z = 0.35 * 0 - 0.35 + 0.0
      arc.visible = false
      g.add(arc)
      out.arc = arc
    }
    const hit = hitSphere(RS * 1.25)
    g.add(hit)
    const sliver = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.01, 0.022, 1, 0.004), edgeMat)
    sliver.rotation.y = kind === 'cob' ? 0.4 : -0.3
    sliver.position.set(x + (kind === 'cob' ? 0.05 : -0.05), TB.top + 0.012, 0.26)
    sliver.scale.setScalar(0.001)
    tableG.add(sliver)
    out.sliver = sliver
    tableG.add(g)
    // its label floats over it
    const label = sign(E.pieces.signs[kind], 0.04, { maxWidth: 0.36 })
    label.position.set(x, TB.top + RS * 2 + 0.14, 0.1)
    tableG.add(label)
    return out
  }
  small.cob = smallCoin('cob', -0.19)
  small.milled = smallCoin('milled', 0.19)
  // where a clip is: the right-hand side of the coin (angle 0) for the cob, the top-right for the milled coin
  const CLIP_AT = { cob: 0.5, milled: 0.9 }
  function setClip(c, on) {
    c.clip = on
    const geo = discGeo(on ? clipped(c.base, CLIP_AT[c.kind], c.kind === 'cob' ? 0.92 : 0.8) : c.base, TS / RS)
    c.mesh.geometry.dispose()
    c.mesh.geometry = geo
    if (c.reeds) {
      const d = new THREE.Object3D()
      for (let i = 0; i < c.n; i++) {
        const a = (i / c.n) * TAU
        const delta = Math.atan2(Math.sin(a - CLIP_AT.milled), Math.cos(a - CLIP_AT.milled))
        const cut = on && Math.abs(delta) < 0.46
        d.position.set(Math.cos(a) * RS * 1.012, Math.sin(a) * RS * 1.012, 0)
        d.rotation.set(0, 0, a)
        d.scale.setScalar(cut ? 0.0001 : 1)
        d.updateMatrix()
        c.reeds.setMatrixAt(i, d.matrix)
      }
      c.reeds.instanceMatrix.needsUpdate = true
      c.arc.visible = on
      c.arc.rotation.z = CLIP_AT.milled - 0.35
    }
    c.sliver.scale.setScalar(on ? 1 : 0.001)
  }
  // the board and the scale's words
  const pcLevelMass = () => MASS[pcShown.cuts]
  let boardKey = ''
  function drawBoard(lv) {
    const { g, w, h } = board
    g.fillStyle = '#10163a'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = '#36c9b5'
    g.lineWidth = 6
    g.strokeRect(10, 10, w - 20, h - 20)
    g.textAlign = 'center'
    g.fillStyle = '#9fe9de'
    fit(g, at(E.pieces.board.name[pcShown.cuts], lv), w / 2, 92, 54, 700, w - 90)
    g.fillStyle = '#ffffff'
    g.font = '700 190px Outfit'
    g.fillText(`${nf(pcLevelMass(), 2)} g`, w / 2, 290)
    g.fillStyle = '#d2dbff'
    g.font = '600 38px Nunito'
    g.fillText(E.pieces.board.weigh, w / 2, 366)
    board.tex.needsUpdate = true
  }
  function pcHint() {
    const H = E.pieces.hints
    if (pc.cuts < 3) return H.chisel
    if (!pc.cob) return H.cob
    if (!pc.mil) return H.milled
    return H.fresh
  }
  const piecesPanel = lv => ({
    title: E.pieces.title,
    color,
    blocks: [
      {
        buttons: [
          { label: E.pieces.buttons.cut, onClick: () => piecesStep('chisel') },
          { label: E.pieces.buttons.cob, onClick: () => piecesStep('cob') },
          { label: E.pieces.buttons.milled, onClick: () => piecesStep('milled') },
          { label: E.pieces.buttons.fresh, onClick: () => piecesStep('fresh') },
        ],
      },
      ...paras(E.pieces.panel, lv),
    ],
  })
  // the cut's rim points (angles in the coin's plane, from the +x axis): the vertical, the horizontal, the two diagonals
  const CUT_AT = [[90 * DEG], [180 * DEG], [45 * DEG, 135 * DEG]]
  const TRAVEL = 0.55
  const STRIKE = 0.42
  const MOVE = 0.35
  const RET = 0.65
  function startCut(level, mine) {
    bigG.updateMatrixWorld(true)
    const stops = CUT_AT[level - 1].map(phi => {
      const p = bigG.localToWorld(V(Math.cos(phi) * (CN.R + 0.03), Math.sin(phi) * (CN.R + 0.03), 0.05))
      const q = bigG.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), phi - Math.PI / 2))
      return { p, q, dir: V(Math.cos(phi), Math.sin(phi), 0).transformDirection(bigG.matrixWorld) }
    })
    const total = TRAVEL + stops.length * STRIKE + (stops.length - 1) * MOVE + RET
    cutAnim = { t: 0, level, stops, total, mine, hits: 0, lastHit: -1 }
    pcBusy = true
  }
  const toolPose = (a, b, k) => {
    tool.position.copy(a.p).lerp(b.p, ease(k))
    tool.quaternion.copy(a.q).slerp(b.q, ease(k))
  }
  function updateCut(dt) {
    const a = cutAnim
    if (!a) return
    a.t += dt
    const rest = tool.userData.rest
    const restPose = { p: rest.p, q: rest.q }
    const n = a.stops.length
    let t = a.t
    let bob = 0
    if (t < TRAVEL) toolPose(restPose, a.stops[0], t / TRAVEL)
    else {
      t -= TRAVEL
      let done = true
      for (let i = 0; i < n; i++) {
        if (t < STRIKE) {
          // at the rim: the mallet comes down twice, the second blow lands
          const k = t / STRIKE
          const push = k > 0.55 ? 0.05 : Math.max(0, Math.sin(k * Math.PI * 2.4)) * 0.01
          tool.position.copy(a.stops[i].p).addScaledVector(a.stops[i].dir, -push)
          tool.quaternion.copy(a.stops[i].q)
          bob = Math.abs(Math.sin(k * Math.PI * 2)) * 0.2
          if (k > 0.6 && a.lastHit < i) {
            a.lastHit = i
            sparkAt(a.stops[i].p.clone().addScaledVector(a.stops[i].dir, -0.05))
            play('crack')
            if (i === n - 1) {
              pcShown.cuts = a.level
              pcMine = a.mine
            }
          }
          done = false
          break
        }
        t -= STRIKE
        if (i < n - 1) {
          if (t < MOVE) {
            toolPose(a.stops[i], a.stops[i + 1], t / MOVE)
            done = false
            break
          }
          t -= MOVE
        }
      }
      if (done) {
        if (t < RET) toolPose(a.stops[n - 1], restPose, t / RET)
        else {
          toolPose(restPose, restPose, 1)
          cutAnim = null
          pcBusy = false
          mallet.position.y = 1.0
          return
        }
      }
    }
    mallet.position.y = 1.0 + bob
  }
  function piecesStep(what) {
    const S = E.pieces.says
    const lv = level()
    if (what === 'chisel') {
      if (pcBusy || pc.cuts >= 3) return false
      const lvl = pc.cuts + 1
      pcMine = true
      pc.cuts = lvl
      startCut(lvl, true)
      // the words come when the blow has landed
      later(TRAVEL + 0.5 + (lvl === 3 ? STRIKE + MOVE : 0), () => say(fill(at(S[`cut${lvl}`], level()), { g: nf(MASS[lvl], 2) })))
      pc.n++
      ex.discover('pieces', piecesPanel, 9)
      share('pieces')
    } else if (what === 'cob' || what === 'milled') {
      const key = what === 'cob' ? 'cob' : 'mil'
      if (pc[key]) return false
      pc[key] = true
      pc.n++
      setClip(small[what], true)
      play('crack')
      sparkAt(small[what].g.localToWorld(V(RS * 0.9, RS * 0.3, 0)))
      say(at(S[what], lv))
      ex.discover('pieces', piecesPanel, 3)
      share('pieces')
    } else if (what === 'fresh') {
      if (pcBusy || (pc.cuts === 0 && !pc.cob && !pc.mil)) return false
      pc.cuts = 0
      pcShown.cuts = 0
      pc.cob = false
      pc.mil = false
      pc.n++
      setClip(small.cob, false)
      setClip(small.milled, false)
      play('select')
      say(at(S.fresh, lv))
      share('pieces')
    }
    return true
  }
  ex.add({
    id: 'pieces',
    x: -1.5,
    z: 3.15,
    radius: 1.9,
    manual: true,
    label: E.pieces.label,
    verb: () => pcHint(),
    focus: focusOf(-1.4, 1.0, 0.8, 3.0, 3.4),
    act: () => ctx.showPanel(piecesPanel),
  })
  clickable(tool, () => piecesStep('chisel'), { when: () => pc.cuts < 3 && !pcBusy, reach: 5.5 })
  clickable(bigG, () => piecesStep('fresh'), { when: () => pc.cuts > 0 && !pcBusy, reach: 5.5, accept: h => h.object === bigHit || h.object.parent === bigG })
  clickable(small.cob.g, () => piecesStep('cob'), { when: () => !pc.cob, reach: 5.5 })
  clickable(small.milled.g, () => piecesStep('milled'), { when: () => !pc.mil, reach: 5.5 })
  updates.push((dt, t) => {
    updateCut(dt)
    for (let i = 0; i < 3; i++) sep[i] = damp(sep[i], pcShown.cuts > i ? 1 : 0, 7, dt)
    placeSectors()
    // what is on the pan follows the cuts (a piece once cut; the scale shows the whole coin's weight before)
    if (panCuts !== pcShown.cuts) {
      panCuts = pcShown.cuts
      if (panCuts > 0) {
        piecePan.geometry = panGeos[panCuts - 1]
        const c = panCentre[panCuts - 1]
        piecePan.position.set(-c[0] * PAN_S, -c[1] * PAN_S, 0.05)
        piecePan.visible = true
      } else piecePan.visible = false
      boardKey = ''
    }
    const load = pcShown.cuts > 0 ? MASS[pcShown.cuts] / 27.47 : 0
    plateY = damp(plateY, 0.66 - 0.07 * load, 7, dt)
    plate.position.y = plateY
    const key = `${pcShown.cuts}|${level()}`
    if (key !== boardKey) {
      boardKey = key
      drawBoard(level())
    }
    for (const c of [small.cob, small.milled]) {
      const k = c.clip ? 1 : 0
      c.sliver.scale.setScalar(damp(c.sliver.scale.x, k ? 1 : 0.001, 8, dt))
    }
    if (small.milled.arc?.visible) small.milled.arc.material.opacity = 0.7 + 0.3 * Math.sin(t * 5)
  })
  drawBoard(level())
  // snap the little coins to the state (a latecomer, a refresh)
  const applyPieces = live => {
    if (live && pc.cuts === pcShown.cuts + 1 && !cutAnim && !pcBusy) startCut(pc.cuts, false)
    else if (!live || !cutAnim) {
      pcShown.cuts = pc.cuts
      sep[0] = pc.cuts > 0 ? 1 : 0
      sep[1] = pc.cuts > 1 ? 1 : 0
      sep[2] = pc.cuts > 2 ? 1 : 0
      cutAnim = null
      pcBusy = false
      tool.position.copy(tool.userData.rest.p)
      tool.quaternion.copy(tool.userData.rest.q)
    }
    if (small.cob.clip !== pc.cob) setClip(small.cob, pc.cob)
    if (small.milled.clip !== pc.mil) setClip(small.milled, pc.mil)
  }

  // ======================================================================================================
  // The silver roads: a map table in the great cabin, a caption strip on the bulkhead
  // ======================================================================================================
  const MT = { x: -2.2, y: 0.98, z: -9.3, tilt: 0.62 }
  const mp = { year: 1500, pin: '', tags: false, n: 0 }
  const mapG = new THREE.Group()
  mapG.position.set(MT.x, MT.y, MT.z)
  mapG.rotation.x = MT.tilt
  root.add(mapG)
  const mx = lon => (lon - (WIN.lon0 + WIN.lon1) / 2) * S
  const mz = lat => -(lat - (WIN.lat0 + WIN.lat1) / 2) * S
  const pinTop = {}
  {
    // the table: a sloping top on four legs, a frame of wood round the map
    const FW = 0.1
    const frameBox = (w, d, x, z) => {
      const m = new THREE.Mesh(new RoundedBoxGeometry(w, 0.07, d, 1, 0.02), mats.rail)
      m.position.set(x, 0.0, z)
      mapG.add(m)
    }
    frameBox(MAPW + 2 * FW, FW, 0, -MAPH / 2 - FW / 2)
    frameBox(MAPW + 2 * FW, FW, 0, MAPH / 2 + FW / 2)
    frameBox(FW, MAPH, -MAPW / 2 - FW / 2, 0)
    frameBox(FW, MAPH, MAPW / 2 + FW / 2, 0)
    const sea = canvasTex(2048, Math.round((2048 * MAPH) / MAPW), (g, w, h) => {
      g.fillStyle = '#1b3a52'
      g.fillRect(0, 0, w, h)
      const grd = g.createRadialGradient(w * 0.42, h * 0.5, h * 0.1, w * 0.42, h * 0.5, w * 0.7)
      grd.addColorStop(0, 'rgba(60,110,140,0.35)')
      grd.addColorStop(1, 'rgba(10,25,40,0.4)')
      g.fillStyle = grd
      g.fillRect(0, 0, w, h)
      const px = lon => ((lon - WIN.lon0) / (WIN.lon1 - WIN.lon0)) * w
      const py = lat => ((WIN.lat1 - lat) / (WIN.lat1 - WIN.lat0)) * h
      g.strokeStyle = 'rgba(190,220,235,0.2)'
      g.lineWidth = 2
      for (let lon = -120; lon <= 150; lon += 30) {
        g.beginPath()
        g.moveTo(px(lon), 0)
        g.lineTo(px(lon), h)
        g.stroke()
      }
      for (let lat = -30; lat <= 60; lat += 30) {
        g.beginPath()
        g.moveTo(0, py(lat))
        g.lineTo(w, py(lat))
        g.stroke()
      }
      g.fillStyle = 'rgba(200,225,240,0.5)'
      g.font = 'italic 600 46px Nunito'
      g.textAlign = 'center'
      g.fillText(E.map.geo.atlantic, px(-47), py(13))
      g.fillText(E.map.geo.pacific, px(-112), py(-6))
      // a compass rose in the south-west corner
      const cx = px(-118)
      const cy = py(-33)
      g.strokeStyle = 'rgba(230,215,170,0.6)'
      g.fillStyle = 'rgba(230,215,170,0.5)'
      g.lineWidth = 3
      g.beginPath()
      g.arc(cx, cy, 44, 0, TAU)
      g.stroke()
      g.beginPath()
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 - Math.PI / 2
        const r = k % 2 ? 14 : 62
        g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      }
      g.closePath()
      g.fill()
    }, { mipmaps: true })
    textures.push(sea)
    const plateMesh = new THREE.Mesh(new THREE.BoxGeometry(MAPW, 0.03, MAPH), [mats.dark, mats.dark, new THREE.MeshStandardMaterial({ map: sea, roughness: 0.7 }), mats.dark, mats.dark, mats.dark])
    plateMesh.position.y = -0.016
    mapG.add(plateMesh)
    // the land in relief: the continents cut to the window and raised
    const landMat = new THREE.MeshStandardMaterial({ color: '#a38c63', roughness: 0.9, metalness: 0 })
    const geos = []
    for (const ring of landRings()) {
      let jump = false
      for (let i = 1; i < ring.length; i++) if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) jump = true
      if (jump) continue
      const lons = ring.map(p => p[0])
      const lats = ring.map(p => p[1])
      if (Math.max(...lons) < WIN.lon0 || Math.min(...lons) > WIN.lon1 || Math.max(...lats) < WIN.lat0 || Math.min(...lats) > WIN.lat1) continue
      const cut = clipRing(ring, [WIN.lon0, WIN.lon1, WIN.lat0, WIN.lat1])
      if (cut.length < 3) continue
      const sh = new THREE.Shape(cut.map(([lon, lat]) => new THREE.Vector2(mx(lon), -mz(lat))))
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.014, bevelEnabled: false, curveSegments: 1 })
      g.rotateX(-Math.PI / 2)
      geos.push(g)
    }
    const land = new THREE.Mesh(geos.length ? mergeAll(geos) : new THREE.BufferGeometry(), landMat)
    land.position.y = 0
    land.receiveShadow = true
    mapG.add(land)
    // legs
    for (const [x, z] of [[-1.15, 0.45], [1.15, 0.45], [-1.15, -0.45], [1.15, -0.45]]) {
      const world = mapG.localToWorld(V(x, 0, z))
      const h = world.y - 0.02
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, h, 8), mats.rail)
      leg.position.set(world.x, h / 2, world.z)
      root.add(leg)
    }
    solids.push(box(MT.x, MT.z + 0.25, MAPW + 0.4, 1.6))
    // the roads
    // pins and labels
  }
  /** Merge a list of geometries into one (same attributes). */
  function mergeAll(list) {
    let nv = 0
    let ni = 0
    for (const g of list) {
      const ig = g.index ? g : g.toNonIndexed()
      nv += ig.attributes.position.count
      ni += ig.index ? ig.index.count : ig.attributes.position.count
    }
    const pos = new Float32Array(nv * 3)
    const nor = new Float32Array(nv * 3)
    const idx = new Uint32Array(ni)
    let vo = 0
    let io = 0
    for (const g of list) {
      const p = g.attributes.position
      pos.set(p.array, vo * 3)
      nor.set(g.attributes.normal.array, vo * 3)
      if (g.index) for (let i = 0; i < g.index.count; i++) idx[io + i] = g.index.array[i] + vo
      else for (let i = 0; i < p.count; i++) idx[io + i] = vo + i
      vo += p.count
      io += g.index ? g.index.count : p.count
      g.dispose()
    }
    const out = new THREE.BufferGeometry()
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
    out.setIndex(new THREE.BufferAttribute(idx, 1))
    return out
  }
  // roads: a glowing tube along each, drawn as far as the year has let it, with bright beads running along it
  const roadMat = id => new THREE.MeshBasicMaterial({ color: new THREE.Color(id === 'A' ? '#ffd166' : id === 'B' ? '#ffb454' : '#6ee7d6').multiplyScalar(1.5), toneMapped: false, transparent: true, opacity: 0.95 })
  const roads = ROUTES.map(r => {
    const pts = r.pts.map(([lon, lat]) => V(mx(lon), 0.03, mz(lat)))
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    const seg = 90
    const geo = new THREE.TubeGeometry(curve, seg, 0.0075, 5, false)
    const mesh = new THREE.Mesh(geo, roadMat(r.id))
    mesh.frustumCulled = false
    mapG.add(mesh)
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(2), toneMapped: false }))
    mapG.add(bead)
    return { r, curve, mesh, bead, k: 0, count: geo.index.count }
  })
  const pinG = {}
  for (const id of Object.keys(PLACE)) {
    const [lon, lat] = PLACE[id]
    const g = new THREE.Group()
    g.position.set(mx(lon), 0.0, mz(lat))
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.12, 6), mats.brass)
    needle.position.y = 0.06
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), tealMat)
    bulb.position.y = 0.13
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: '#4af0d8', transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }))
    halo.scale.setScalar(0.2)
    halo.position.y = 0.13
    const hit = hitSphere(0.085)
    hit.position.y = 0.1
    g.add(needle, bulb, halo, hit)
    const text = id === 'mexico' ? E.map.geo.mexico : E.map.buttons[id]
    const label = sign(text, 0.042, { maxWidth: 0.6 })
    label.rotation.x = -Math.PI / 2
    label.position.set(0.0, 0.03, 0.08)
    g.add(label)
    mapG.add(g)
    pinG[id] = { g, halo, bulb }
    pinTop[id] = () => g.localToWorld(V(0, 0.13, 0))
  }
  // where the Manila galleon's road leaves the map and comes back in
  for (const [text, lon, lat] of [[E.map.geo.toManila, -121, 20], [E.map.geo.fromAcapulco, 136, 20]]) {
    const t = sign(text, 0.034, { maxWidth: 0.5, color: '#9fe9de' })
    t.rotation.x = -Math.PI / 2
    t.position.set(mx(lon), 0.03, mz(lat))
    mapG.add(t)
  }
  // the "dollar" tags fanning out from Joachimsthal
  const tagObjs = TAGS.map((w, i) => {
    const t = sign(w, 0.06, { color: '#ffe9a8', maxWidth: 0.6 })
    t.visible = false
    root.add(t)
    return t
  })
  let tagK = 0
  // the caption strip on the great cabin's bulkhead
  const cap2 = canvasScreen(2.9, 0.56, 1800)
  stage.onBulkhead(cap2.group, MT.x + 0.35, 2.47)
  cap2.group.position.z += 0.02
  let capKey = ''
  const eventAt = year => {
    let ev = null
    for (const e of E.map.years) if (e.y <= year) ev = e
    return ev
  }
  function drawCaption(lv) {
    const { g, w, h } = cap2
    g.fillStyle = '#10163a'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = '#36c9b5'
    g.lineWidth = 7
    g.strokeRect(9, 9, w - 18, h - 18)
    g.textAlign = 'center'
    g.fillStyle = '#ffffff'
    g.font = '700 160px Outfit'
    g.fillText(String(Math.round(mp.year)), w - 290, h * 0.68)
    g.textAlign = 'left'
    g.fillStyle = '#e8eeff'
    const ev = eventAt(mp.year)
    const text = ev ? at(ev, lv) : at(E.map.start, lv)
    wrap(g, text, 70, h * 0.3, w - 620, 76, 3)
    cap2.tex.needsUpdate = true
  }
  const mapPanel = lv => ({
    title: E.map.title,
    color,
    blocks: [
      {
        slider: { label: E.map.slider, min: 1500, max: 1857, step: 1, value: Math.round(mp.year), onInput: v => mapYear(v), format: v => String(Math.round(v)), live: () => Math.round(mp.year) },
      },
      { buttons: ['joachim', 'potosi', 'mexico', 'seville', 'manila'].map(k => ({ label: E.map.buttons[k], onClick: () => mapPin(k) })) },
      ...paras(E.map.panel, lv),
    ],
  })
  const told = new Set()
  function mapHint() {
    const H = E.map.hints
    for (const k of ['joachim', 'potosi', 'mexico', 'manila', 'seville']) if (!told.has(k)) return H[k]
    return H.done
  }
  function mapPin(id, silent = false) {
    mp.pin = id
    mp.year = Math.max(mp.year, PIN_YEAR[id])
    mp.n++
    if (id === 'joachim' && !mp.tags) mp.tags = true
    told.add(id)
    play('select')
    if (!silent) say(at(E.map.says[id], level()))
    ex.discover('map', mapPanel, 10)
    share('map')
  }
  let mapSending = false
  function mapYear(v) {
    mp.year = clamp(Math.round(Number(v)), 1500, 1857)
    mp.pin = ''
    ex.discover('map', mapPanel, 3)
    if (mapSending) return
    mapSending = true
    later(0.25, () => {
      mapSending = false
      share('map')
    })
  }
  ex.add({
    id: 'map',
    x: -2.2,
    z: -6.85,
    radius: 1.9,
    manual: true,
    label: E.map.label,
    verb: () => mapHint(),
    focus: focusOf(-2.2, 1.2, -9.3, 2.0, 3.2),
    act: () => ctx.showPanel(mapPanel),
  })
  for (const id of Object.keys(PLACE)) clickable(pinG[id].g, () => mapPin(id), { reach: 6.5 })
  updates.push((dt, t) => {
    const lv = level()
    for (const rd of roads) {
      const on = mp.year >= rd.r.from && !(rd.r.to && mp.year > rd.r.to)
      rd.k = damp(rd.k, on ? 1 : 0, 3, dt)
      rd.mesh.visible = rd.k > 0.01
      rd.mesh.geometry.setDrawRange(0, Math.floor(rd.count * clamp(rd.k)))
      rd.bead.visible = rd.k > 0.5
      if (rd.bead.visible) rd.bead.position.copy(rd.curve.getPoint(((t * 0.12 + (rd.r.id.charCodeAt(0) % 4) * 0.23) % 1)))
    }
    // the tags: from the pin up into a fan, one after another
    tagK = damp(tagK, mp.tags ? 1 : 0, 1.6, dt)
    const p0 = pinTop.joachim()
    TAGS.forEach((w, i) => {
      const t = tagObjs[i]
      const k = clamp(tagK * 1.6 - i * 0.18)
      t.visible = k > 0.02
      const spread = (i - 2) * 0.24
      t.position.set(p0.x + spread * ease(k), p0.y + (0.08 + (2 - Math.abs(i - 2)) * 0.05) * ease(k) + 0.03, p0.z + 0.05)
      t.fillOpacity = ease(k)
    })
    for (const id of Object.keys(pinG)) pinG[id].halo.material.opacity = 0.45 + 0.25 * Math.sin(t * 3 + id.length) + (mp.pin === id ? 0.3 : 0)
    const key = `${Math.round(mp.year)}|${lv}`
    if (key !== capKey) {
      capKey = key
      drawCaption(lv)
    }
  })
  drawCaption(level())

  // ======================================================================================================
  // The purser's corner: a rack of six coins, the slab, the can and its tube, the scale, the board
  // ======================================================================================================
  const BN = { y: 0.92, z: -9.55 }
  const RK = { x: 0.98 }
  const SL = { x: 1.98 }
  const CAN = { x: 2.62, y: 1.35 }
  const TUBE = { x: 3.15, h: 0.55 }
  const SCL = { x: 3.78 }
  const pu = { cur: -1, stage: 'none', done: 0, n: 0 } // stage: none | slab | dip | weighed; done: a bit mask of coins weighed
  const puShown = { cur: -2, stage: '', vol: 0 }
  let puMine = false
  const R3 = 0.085
  const T3 = 0.016
  {
    // the bench along the back wall, on casks
    const bench = new THREE.Mesh(new RoundedBoxGeometry(3.9, 0.08, 0.8, 2, 0.02), mats.rail)
    bench.position.set(2.45, BN.y - 0.04, BN.z)
    const under = new THREE.Mesh(new THREE.BoxGeometry(3.7, BN.y - 0.1, 0.7), mats.wood)
    under.position.set(2.45, (BN.y - 0.1) / 2, BN.z)
    root.add(bench, under)
    solids.push(box(2.45, BN.z, 4.0, 0.9))
    // the open hatch to the hold, a ladder going down into the dark, a coaming round it
    const HT = { x: 3.7, z: -8.2 }
    const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#050403' }))
    hole.position.set(HT.x, 0.012, HT.z)
    root.add(hole)
    for (const [w, d, x, z] of [[1.1, 0.1, 0, -0.5], [1.1, 0.1, 0, 0.5], [0.1, 0.9, -0.5, 0], [0.1, 0.9, 0.5, 0]]) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), mats.rail)
      c.position.set(HT.x + x, 0.1, HT.z + z)
      root.add(c)
    }
    for (const x of [-0.28, 0.28]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), mats.rail)
      rail.position.set(HT.x + x, 0.2, HT.z + 0.1)
      rail.rotation.x = 0.2
      root.add(rail)
    }
    for (let i = 0; i < 4; i++) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 6).rotateZ(Math.PI / 2), mats.rail)
      rung.position.set(HT.x, 0.12 + i * 0.22 - 0.5 * 0, HT.z + 0.1 + i * 0.045)
      root.add(rung)
    }
    solids.push(box(HT.x, HT.z, 1.2, 1.2))
  }
  // the rack: six slots, six coins, standing and facing +z
  const rack = new THREE.Group()
  rack.position.set(RK.x, BN.y, BN.z + 0.1)
  root.add(rack)
  const coin3 = []
  {
    const blockM = new THREE.Mesh(new RoundedBoxGeometry(1.14, 0.07, 0.18, 1, 0.01), mats.rail)
    blockM.position.y = 0.035
    rack.add(blockM)
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Group()
      g.position.set((i - 2.5) * 0.18, 0.07 + R3 * 0.95, 0)
      g.rotation.x = -0.18
      const mesh = new THREE.Mesh(discGeo(ROUND, T3 / R3), [faceMat, edgeMat])
      mesh.scale.setScalar(R3)
      g.add(mesh)
      const hit = hitSphere(R3 * 1.3)
      g.add(hit)
      rack.add(g)
      coin3.push({ g, home: g.position.clone(), mesh })
    }
    solids.push(box(RK.x, BN.z, 1.3, 0.9))
  }
  // the slab: a flagstone with a hollow for the coin
  const slab = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.07, 0.4, 2, 0.02), stoneMat)
  slab.position.set(SL.x, BN.y + 0.035, BN.z + 0.05)
  root.add(slab)
  const slabTop = BN.y + 0.07
  const rings3 = []
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color('#bfeaff').multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: 0, depthWrite: false }))
    r.position.set(SL.x, slabTop + 0.004, BN.z + 0.05)
    r.visible = false
    root.add(r)
    rings3.push({ r, t: 9 })
  }
  const puff = new THREE.Sprite(new THREE.SpriteMaterial({ map: stage.glow, color: '#8a7a64', transparent: true, opacity: 0, depthWrite: false }))
  puff.position.set(SL.x, slabTop + 0.05, BN.z + 0.05)
  puff.scale.setScalar(0.3)
  root.add(puff)
  let puffT = 9
  // the can: a brass overflow can on a stool, its spout over the tube
  const canG = new THREE.Group()
  const canHit = hitBox(0.55, 0.5, 0.5)
  {
    const stool = new THREE.Mesh(new THREE.BoxGeometry(0.44, CAN.y - 0.3 - BN.y, 0.34), mats.wood)
    stool.position.set(CAN.x, BN.y + (CAN.y - 0.3 - BN.y) / 2, BN.z)
    root.add(stool)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.3, 18), brassGlow)
    const rimC = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.016, 6, 18).rotateX(Math.PI / 2), mats.brass)
    rimC.position.y = 0.15
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.155, 18).rotateX(-Math.PI / 2), waterMat)
    water.position.y = 0.13
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.26, 8), brassGlow)
    spout.rotation.z = -1.1
    spout.position.set(0.22, 0.08, 0)
    canG.add(body, rimC, water, spout)
    canG.position.set(CAN.x, CAN.y - 0.15, BN.z)
    canG.add(canHit)
    root.add(canG)
  }
  // the tube: 10 mL in 0.5 m, graduated, the water inside
  const tubeG = new THREE.Group()
  tubeG.position.set(TUBE.x, BN.y, BN.z)
  root.add(tubeG)
  const tubeWater = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.043, 1, 16), waterMat)
  tubeWater.scale.y = 0.001
  {
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, TUBE.h + 0.04, 16, 1, true), glassMat)
    glass.position.y = (TUBE.h + 0.04) / 2 + 0.02
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.03, 16), mats.dark)
    foot.position.y = 0.015
    tubeWater.position.y = 0.03
    tubeG.add(glass, foot, tubeWater)
    // the scale: ticks every mL, numbers every 2
    const gradTex = canvasTex(128, 512, (g, w, h) => {
      g.fillStyle = 'rgba(0,0,0,0)'
      g.clearRect(0, 0, w, h)
      g.strokeStyle = '#f3e6c8'
      g.fillStyle = '#f3e6c8'
      g.lineWidth = 3
      g.font = '700 30px Outfit'
      g.textAlign = 'right'
      for (let i = 0; i <= 10; i++) {
        const y = h - 16 - (i / 10) * (h - 40)
        g.beginPath()
        g.moveTo(w - 4, y)
        g.lineTo(w - (i % 2 ? 40 : 62), y)
        g.stroke()
        if (i % 2 === 0) g.fillText(String(i), w - 70, y + 10)
      }
    })
    textures.push(gradTex)
    // the plate's ticks run from 16 px above its foot to 24 px under its top: tick 10 stands at TUBE.h
    const Hp = (TUBE.h * 512) / 472
    const plateG = new THREE.Mesh(new THREE.PlaneGeometry(0.17, Hp), new THREE.MeshBasicMaterial({ map: gradTex, transparent: true, toneMapped: false, depthWrite: false }))
    plateG.position.set(-0.12, 0.03 - (16 / 512) * Hp + Hp / 2, 0.055)
    tubeG.add(plateG)
    const tubeHit = hitBox(0.3, 0.6, 0.3)
    tubeHit.position.set(0, 0.3, 0)
    tubeG.add(tubeHit)
  }
  // a drip from the spout while the water displaced runs
  const drip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 5), waterMat)
  drip.visible = false
  root.add(drip)
  // the scale: a pan on a post, a small plate showing the grams
  const panG = new THREE.Group()
  const scaleHit = hitBox(0.6, 0.6, 0.5)
  let panY = 0
  const scaleTexts = canvasScreen(0.44, 0.2, 256)
  {
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.4), mats.wood)
    stand.position.set(SCL.x, BN.y + 0.1, BN.z + 0.05)
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 8), mats.brass)
    post.position.set(SCL.x, BN.y + 0.37, BN.z + 0.05)
    root.add(stand, post)
    const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.025, 20), brassGlow)
    const rimP = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 20).rotateX(Math.PI / 2), mats.brass)
    rimP.position.y = 0.012
    panG.add(pan, rimP)
    panG.position.set(SCL.x, BN.y + 0.56, BN.z + 0.05)
    panG.add(scaleHit)
    root.add(panG)
    scaleTexts.group.position.set(SCL.x, BN.y + 0.12, BN.z + 0.27)
    scaleTexts.group.rotation.x = -0.35
    root.add(scaleTexts.group)
    solids.push(box(SCL.x, BN.z, 0.5, 0.9))
  }
  // the coin that is out (on the slab, in the air, on the pan) is the rack's coin `cur`, moved by hand
  const sparkCoin = new THREE.Mesh(discGeo(ROUND, T3 / R3), [faceMat, edgeMat])
  sparkCoin.scale.setScalar(R3)
  sparkCoin.visible = false
  root.add(sparkCoin)
  const world3 = i => coin3[i].g.getWorldPosition(new THREE.Vector3())
  // signs on the bench
  for (const [k, x] of [['slab', SL.x], ['can', TUBE.x - 0.25]]) {
    const t = sign(E.purser.signs[k], 0.05, { maxWidth: 0.8 })
    t.position.set(x, BN.y + 0.2, BN.z + 0.42)
    if (k === 'can') t.position.set(TUBE.x + 0.02, BN.y + 0.66, BN.z + 0.3)
    root.add(t)
  }
  // the board above: the density ladder
  const dboard = canvasScreen(3.3, 0.84, 2048)
  stage.onBulkhead(dboard.group, 2.35, 2.1)
  dboard.group.position.z += 0.02
  const dens = { vol: null, mass: null, d: null }
  let dKey = ''
  const BANDS = [
    ['sn', RHO.sn, '#b9c6d2'],
    ['cu', RHO.cu, '#e08c4a'],
    ['ag', RHO.ag, '#f0f3f8'],
    ['pb', RHO.pb, '#8793a2'],
  ]
  function drawDensity(lv) {
    const { g, w, h } = dboard
    g.fillStyle = '#10163a'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = '#36c9b5'
    g.lineWidth = 7
    g.strokeRect(9, 9, w - 18, h - 18)
    g.textAlign = 'left'
    g.fillStyle = '#9fe9de'
    const cn = pu.cur >= 0 ? pu.cur + 1 : 0
    fit(g, cn ? fill(E.purser.board.coin, { n: cn }) : E.purser.title, 60, 96, 62, 700, 640)
    g.fillStyle = '#ffffff'
    const v = dens.vol
    const m = dens.mass
    const d = dens.d
    g.font = '600 50px Nunito'
    g.fillStyle = '#d2dbff'
    g.fillText(`V  ${v == null ? '-' : nf(v, 2)} mL`, 60, 200)
    g.fillText(`m  ${m == null ? '-' : nf(m, 2)} g`, 60, 270)
    g.fillStyle = '#ffffff'
    g.font = '700 74px Outfit'
    g.fillText(`d  ${d == null ? '-' : nf(d, 2)}`, 60, 370)
    g.font = '600 32px Nunito'
    g.fillStyle = '#9fb0e8'
    g.fillText(E.purser.board.title, 60, 420)
    // the ladder from 6 to 12 g/cm3
    const x0 = 800
    const x1 = w - 120
    const px = r => x0 + ((r - 6) / 6) * (x1 - x0)
    const y = 300
    g.strokeStyle = '#6f7db8'
    g.lineWidth = 6
    g.beginPath()
    g.moveTo(x0, y)
    g.lineTo(x1, y)
    g.stroke()
    g.fillStyle = '#9fb0e8'
    g.font = '600 34px Nunito'
    g.textAlign = 'center'
    for (let r = 6; r <= 12; r++) {
      g.beginPath()
      g.moveTo(px(r), y - 12)
      g.lineTo(px(r), y + 12)
      g.stroke()
      g.fillText(String(r), px(r), y + 52)
    }
    const near = d == null ? null : BANDS.reduce((a, b) => (Math.abs(b[1] - d) < Math.abs(a[1] - d) ? b : a))[0]
    for (const [id, r, col] of BANDS) {
      const x = px(r)
      g.fillStyle = col
      g.globalAlpha = near === id ? 1 : 0.75
      g.fillRect(x - 24, y - 70, 48, 58)
      g.globalAlpha = 1
      if (near === id) {
        g.strokeStyle = '#ffd166'
        g.lineWidth = 6
        g.strokeRect(x - 28, y - 74, 56, 66)
      }
      g.fillStyle = '#ffffff'
      g.font = '700 44px Outfit'
      const name = id === 'ag' ? E.purser.board.alloy : E.purser.mats[id]
      g.fillText(name, x, y - 100)
      g.font = '600 32px Nunito'
      g.fillStyle = '#d2dbff'
      g.fillText(nf(r, 2), x, y - 160 + 28 * 0)
    }
    // the measured density as a gold marker under the line
    if (d != null) {
      const x = px(clamp(d, 6, 12))
      g.fillStyle = '#ffd166'
      g.beginPath()
      g.moveTo(x, y + 8)
      g.lineTo(x - 22, y + 62)
      g.lineTo(x + 22, y + 62)
      g.closePath()
      g.fill()
    } else {
      g.fillStyle = '#6f7db8'
      g.font = '600 38px Nunito'
      g.textAlign = 'center'
      g.fillText(E.purser.board.unknown, (x0 + x1) / 2, y + 120)
    }
    dboard.tex.needsUpdate = true
  }
  const drawScale = () => {
    const { g, w, h } = scaleTexts
    g.fillStyle = '#0b1020'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#9fe9de'
    g.textAlign = 'center'
    g.font = '700 70px Outfit'
    g.fillText(`${dens.mass == null ? '0.00' : nf(dens.mass, 2)} g`, w / 2, h * 0.66)
    scaleTexts.tex.needsUpdate = true
  }
  const puHint = () => {
    const H = E.purser.hints
    if (pu.stage === 'slab') return H.can
    if (pu.stage === 'dip') return H.pan
    if (pu.stage === 'weighed') return H.next
    return H.coin
  }
  const puPanel = lv => ({
    title: E.purser.title,
    color,
    blocks: [
      {
        buttons: [
          { label: E.purser.buttons.coin, onClick: () => purserStep('coin') },
          { label: E.purser.buttons.can, onClick: () => purserStep('can') },
          { label: E.purser.buttons.pan, onClick: () => purserStep('pan') },
        ],
      },
      ...paras(E.purser.panel, lv),
    ],
  })
  const matOf = i => SETS[i]
  const volNow = () => VOL
  function ringFor(m) {
    play(m === 'ag' ? 'select' : m === 'pb' ? 'pop' : m === 'cu' ? 'wrong' : 'part')
    if (m === 'ag') for (const r of rings3) r.t = -rings3.indexOf(r) * 0.18
    else puffT = 0
  }
  function purserStep(what, coinIndex) {
    const S = E.purser.says
    const lv = level()
    if (what === 'coin') {
      // a coin from the rack (the given one, or the next not yet weighed)
      let i = coinIndex
      if (i == null) {
        for (let k = 1; k <= 6; k++) {
          const j = (pu.cur + k + 6) % 6
          if (!(pu.done & (1 << j))) {
            i = j
            break
          }
        }
        if (i == null) i = (pu.cur + 1 + 6) % 6
      }
      pu.cur = i
      pu.stage = 'slab'
      pu.n++
      puMine = true
      dens.vol = null
      dens.mass = null
      dens.d = null
      ringFor(matOf(i))
      say(at(S.ring[matOf(i)], lv))
      ex.discover('purser', puPanel, 14)
    } else if (what === 'can') {
      if (pu.stage !== 'slab') return false
      pu.stage = 'dip'
      pu.n++
      puMine = true
      dens.vol = volNow()
      play('fizz', { order: 0.4 })
      later(0.9, () => puMine && say(fill(at(S.dip, level()), { v: nf(volNow(), 2) })))
    } else if (what === 'pan') {
      if (pu.stage !== 'dip') return false
      pu.stage = 'weighed'
      pu.done |= 1 << pu.cur
      pu.n++
      puMine = true
      const m = RHO[matOf(pu.cur)] * volNow()
      dens.mass = m
      dens.d = m / volNow()
      play('tap')
      const mm = matOf(pu.cur)
      later(0.9, () => {
        if (!puMine) return
        const l2 = level()
        say(fill(at(S.weigh, l2), { m: nf(m, 2), v: nf(volNow(), 2), d: nf(m / volNow(), 2) }))
        later(3.2, () => puMine && say(fill(at(S.verdict[mm], level()), { d: nf(m / volNow(), 2) })))
        if (pu.done === 63) later(7, () => puMine && say(at(S.all, level())))
      })
    }
    share('purser')
    return true
  }
  ex.add({
    id: 'purser',
    x: 2.35,
    z: -7.0,
    radius: 1.9,
    manual: true,
    label: E.purser.label,
    verb: () => puHint(),
    focus: focusOf(2.0, 1.2, -9.5, 1.7, 3.8),
    act: () => ctx.showPanel(puPanel),
  })
  coin3.forEach((c, i) => clickable(c.g, () => purserStep('coin', i), { when: () => pu.cur !== i || pu.stage === 'weighed', reach: 6.5 }))
  clickable(canG, () => purserStep('can'), { when: () => pu.stage === 'slab', reach: 6.5 })
  clickable(panG, () => purserStep('pan'), { when: () => pu.stage === 'dip', reach: 6.5 })
  let waterLevel = 0
  updates.push((dt, t) => {
    const lv = level()
    // the coin that is out
    const has = pu.cur >= 0
    for (let i = 0; i < 6; i++) coin3[i].g.visible = !(has && i === pu.cur)
    sparkCoin.visible = has && (pu.stage === 'slab' || pu.stage === 'weighed')
    if (puShown.cur !== pu.cur || puShown.stage !== pu.stage) {
      const u = sparkCoin.userData
      u.from = pu.stage === 'slab' && (puShown.cur !== pu.cur || puShown.stage === 'none' || puShown.stage === 'weighed') && puShown.stage !== 'dip' ? (has ? world3(pu.cur) : sparkCoin.position.clone()) : pu.stage === 'weighed' ? V(CAN.x, CAN.y, BN.z) : sparkCoin.position.clone()
      u.k = 0
    }
    if (sparkCoin.visible) {
      const target = pu.stage === 'slab' ? V(SL.x, slabTop + R3 * 0.62, BN.z + 0.06) : V(SCL.x, BN.y + 0.56 + 0.03 + R3 * 0.62, BN.z + 0.05)
      const u = sparkCoin.userData
      u.k = Math.min(1, (u.k ?? 1) + dt / 0.55)
      const e = ease(u.k)
      sparkCoin.position.lerpVectors(u.from ?? target, target, e)
      sparkCoin.position.y += Math.sin(e * Math.PI) * 0.22
      sparkCoin.rotation.x = -0.75 + 0.5 * (1 - e)
    }
    puShown.cur = pu.cur
    puShown.stage = pu.stage
    // the water in the tube
    const want = pu.stage === 'dip' || pu.stage === 'weighed' ? (volNow() / 10) * TUBE.h : 0
    waterLevel = damp(waterLevel, want, 2.4, dt)
    tubeWater.scale.y = Math.max(0.001, waterLevel)
    tubeWater.position.y = 0.03 + waterLevel / 2
    drip.visible = Math.abs(want - waterLevel) > 0.004 && want > 0
    if (drip.visible) {
      drip.position.set(TUBE.x - 0.0, BN.y + TUBE.h - ((t * 1.8) % 1) * (TUBE.h - 0.02), BN.z)
      drip.position.y = Math.max(BN.y + 0.03 + waterLevel, BN.y + 0.62 - ((t * 2.2) % 1) * 0.6)
      drip.position.x = TUBE.x - 0.0
    }
    panY = damp(panY, pu.stage === 'weighed' ? -0.03 : 0, 7, dt)
    panG.position.y = BN.y + 0.56 + panY
    // the ring and the puff on the slab
    for (const r of rings3) {
      r.t += dt
      const k = clamp(r.t / 1.1)
      r.r.visible = r.t > 0 && k < 1
      r.r.scale.setScalar(0.04 + k * 0.45)
      r.r.material.opacity = (1 - k) * 0.8
    }
    puffT += dt
    puff.material.opacity = Math.max(0, 0.7 - puffT * 1.4) * (puffT < 0.5 ? 1 : 0.6)
    puff.scale.setScalar(0.2 + puffT * 0.5)
    const key = `${pu.cur}|${pu.stage}|${pu.done}|${lv}|${dens.d}`
    if (key !== dKey) {
      dKey = key
      drawDensity(lv)
      drawScale()
    }
  })
  drawDensity(level())
  drawScale()

  // ======================================================================================================
  // the stage, and the shared states
  // ======================================================================================================
  updates.push((dt, t) => {
    stage.update(t)
    for (let i = tweens.length - 1; i >= 0; i--) {
      const w = tweens[i]
      w.t += dt
      const k = clamp(w.t / w.dur)
      w.fn(k)
      if (k >= 1) {
        tweens.splice(i, 1)
        w.done?.()
      }
    }
  })
  applyPieces(false)

  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const w3 = o => o.getWorldPosition(new THREE.Vector3())

  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.4 },
    cameraPitchMax: 0.42,
    spawn: { x: 0, z: 4.2, yaw: 0 },
    hostSpot: { x: -1.7, z: 4.1, yaw: Math.atan2(-0.3, -1.0) },
    back: { x: 0, z: 7.0, rot: Math.PI },
    // the easel on the right of the arrival, off the stations' lines of sight
    stand: { x: 3.2, z: 3.1, rot: -0.75 },
    parts: {
      pieces: {
        tap: what => piecesStep(what), // 'chisel' | 'cob' | 'milled' | 'fresh'
        get state() {
          return { cuts: pc.cuts, cob: pc.cob, milled: pc.mil, busy: pcBusy, mass: MASS[pc.cuts] }
        },
      },
      map: {
        tap: id => mapPin(id), // 'joachim' | 'potosi' | 'mexico' | 'seville' | 'manila'
        year: v => mapYear(v),
        get state() {
          return { year: Math.round(mp.year), pin: mp.pin, tags: mp.tags, roads: roads.filter(r => r.k > 0.5).map(r => r.r.id).join('') }
        },
      },
      purser: {
        tap: (what, i) => purserStep(what, i), // 'coin' (with a number 0 to 5) | 'can' | 'pan'
        get state() {
          return { cur: pu.cur, stage: pu.stage, done: pu.done, d: dens.d == null ? null : Math.round(dens.d * 100) / 100, mat: pu.cur >= 0 ? matOf(pu.cur) : null }
        },
      },
      at: {
        chisel: () => w3(tool).add(V(0, 0.7, 0)),
        cob: () => small.cob.g.getWorldPosition(new THREE.Vector3()),
        milled: () => small.milled.g.getWorldPosition(new THREE.Vector3()),
        coin: () => bigG.getWorldPosition(new THREE.Vector3()),
        pin: id => pinTop[id](),
        rack: i => world3(i),
        can: () => w3(canG),
        pan: () => w3(panG),
      },
      rayTo,
    },
    panels: { pieces: piecesPanel, map: mapPanel, purser: puPanel },
    shared: {
      pieces: {
        get: () => ({ cuts: pc.cuts, cob: pc.cob ? 1 : 0, mil: pc.mil ? 1 : 0, n: pc.n }),
        set: (s, liveSet) => {
          const cuts = clamp(Math.round(Number(s?.cuts) || 0), 0, 3)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          pcMine = false
          pc.cob = !!s?.cob
          pc.mil = !!s?.mil
          pc.n = n
          pc.cuts = cuts
          applyPieces(!!liveSet)
        },
      },
      map: {
        get: () => ({ y: Math.round(mp.year), p: mp.pin, t: mp.tags ? 1 : 0, n: mp.n }),
        set: s => {
          mp.year = clamp(Math.round(Number(s?.y) || 1500), 1500, 1857)
          mp.pin = Object.keys(PLACE).includes(s?.p) ? s.p : ''
          mp.tags = !!s?.t
          mp.n = Math.max(0, Math.round(Number(s?.n) || 0))
          if (mp.pin) told.add(mp.pin)
        },
      },
      purser: {
        get: () => ({ cur: pu.cur, st: ['none', 'slab', 'dip', 'weighed'].indexOf(pu.stage), done: pu.done, n: pu.n }),
        set: (s, liveSet) => {
          const cur = clamp(Math.round(Number(s?.cur ?? -1)), -1, 5)
          const st = ['none', 'slab', 'dip', 'weighed'][clamp(Math.round(Number(s?.st) || 0), 0, 3)]
          const done = clamp(Math.round(Number(s?.done) || 0), 0, 63)
          const n = Math.max(0, Math.round(Number(s?.n) || 0))
          puMine = false
          const fresh = liveSet && cur === pu.cur && n === pu.n + 1
          const newCoin = liveSet && cur >= 0 && cur !== pu.cur && st === 'slab'
          pu.cur = cur
          pu.stage = cur < 0 ? 'none' : st
          pu.done = done
          pu.n = n
          if (pu.stage === 'slab' && (fresh || newCoin)) ringFor(matOf(cur))
          if (pu.stage === 'dip' || pu.stage === 'weighed') dens.vol = volNow()
          else dens.vol = null
          if (pu.stage === 'weighed') {
            dens.mass = RHO[matOf(cur)] * volNow()
            dens.d = dens.mass / volNow()
          } else {
            dens.mass = null
            dens.d = null
          }
        },
      },
    },
    attach() {},
    detach() {},
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const d of disposers) d()
    },
  }
}
