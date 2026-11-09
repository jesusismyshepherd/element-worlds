// Silver's picture "Is a gold medal made of gold?" as a room (docs/knowledge/picture-rooms.md): the Panathenaic
// Stadium in Athens at dusk (stages/stadium.js), where the first modern Games were run in 1896 and whose
// medals the Monnaie de Paris struck. Three stations in a row of the picture's things; each step is chosen by
// tapping its thing (the user, 2026-10-30), the prompt names the next tap, E opens the station's panel,
// whose buttons and sliders do the same:
// - what is under the gold (west): a 1.8 m gold medal on a stand; tap it and its gold skin peels back at a corner
//   like the picture, a lens on the cut showing a few layers of gold atoms over silver atoms (with about one
//   copper atom in eight, sterling's 925 parts in 1000 by mass); tap the balance and the real medal (529 g)
//   goes on one pan, a solid gold copy of the same size (worked out: about 950 g) on the other; tap the iron
//   hexagon for where it came from (the Eiffel Tower: iron's hall);
// - gild it (east, under the medal-maker's tent): a silver blank, a tank of gold plating bath and a power
//   supply. Tap the blank to hang it in the bath, the switch to run the current, the clips to swap the
//   polarity (a slider for the current): at the cathode gold lands on it at Faraday's rate (gold(I): 1 A for 1 h
//   lays 7.35 g), time sped up 450 times; the other way round the medal is the anode and loses silver;
// - who got what (the podium, far end): a Games slider (1896, 1900, 1904, 1912, 1920, 2024) changes what lies
//   on the three steps; tap a step and a board draws the medal cut through.
// All of it is shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<station> does what a tap does, for the probes; parts.at.<thing>() gives a point to aim a real tap at.
// Numbers: Paris 2024 medals 85 mm by 9.2 mm, gold 529 g (about 505 g silver, 6 g gold, 18 g iron), silver 525 g,
// bronze 455 g; silver 10.501 and gold 19.282 g/cm3, iron 7.874 (src/data/elements.json); Au 196.97, Ag 107.87
// g/mol, F = 96 485 C/mol. The solid copy: (505/10.501 + 6/19.282) cm3 = 48.4 cm3 of metal, as gold 933 g, plus
// the 18 g hexagon: about 950 g. The skin: 6 g over about 138 cm2 (two faces and the edge) = 22 um.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, clamp, lerp, damp, random, canvasTex, fill } from '../../../wings/noble/kit.js'
import { stadiumStage, metals } from '../../stages/stadium.js'
import { atriumPath } from '../../../registry.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { circle, box } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { MEDAL_WORDS } from './medal.words.js'

export const WORDS = MEDAL_WORDS

const TAU = Math.PI * 2
const GOLD = '#ffcf4d'
const SPEED = 450 // the plating bath runs 450 times faster than life
const GMAX = 12 // grams of gold: the supply stops here
const AU_RATE = 196.97 / 96485 // g of gold per ampere-second, gold(I)
const AG_RATE = 107.87 / 96485 // g of silver per ampere-second
const SKIN_UM = 3.76 // micrometres of gold per gram over a medal's 138 cm2
const AMPS = { min: 0.2, max: 2.0, start: 0.8, step: 0.1 }
const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }
const PARIS = { gold: 529, silver: 525, bronze: 455 }
const withinGroup = (obj, group) => {
  for (let o = obj; o; o = o.parent) if (o === group) return true
  return false
}

// ---- the medal: a disc facing +z, its gold skin a separate face (peels back at a corner), an iron hexagon ----

function raysTexture() {
  return canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, w, w)
    const c = w / 2
    g.strokeStyle = 'rgba(176,118,24,0.55)'
    g.lineWidth = 2
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * TAU
      const r0 = c * (0.34 + 0.2 * ((i * 7) % 5) / 5)
      const r1 = c * (0.84 + 0.12 * ((i * 3) % 4) / 4)
      g.beginPath()
      g.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0)
      g.lineTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1)
      g.stroke()
    }
    g.lineWidth = 6
    g.strokeStyle = 'rgba(176,118,24,0.6)'
    g.beginPath()
    g.arc(c, c, c * 0.94, 0, TAU)
    g.stroke()
  })
}

/** The look of a medal: body 'silver' | 'gold' | 'copper' | 'bronze', `skin` gold over it, `hex` the iron hexagon,
 *  `flap` a corner of the skin that can peel (setPeel(0..1)). Radius R in metres, its thickness the real
 *  medal's ratio (9.2 mm in 85 mm). */
function makeMedal(M, { R = 0.5, body = 'silver', skin = false, hex = true, flap = false } = {}) {
  const T = R * 2 * 0.108
  const group = new THREE.Group()
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(R, R, T, 72), M.silver)
  cyl.rotation.x = Math.PI / 2
  group.add(cyl)
  // the skin: the front face, with a segment at the lower right that can turn back on its chord
  const a1 = -0.12
  const a2 = -1.32
  const arcPts = (from, to, n) => Array.from({ length: n + 1 }, (_, i) => [Math.cos(from + ((to - from) * i) / n) * R * 0.992, Math.sin(from + ((to - from) * i) / n) * R * 0.992])
  const uvOf = geo => {
    const p = geo.attributes.position
    const uv = new Float32Array(p.count * 2)
    for (let i = 0; i < p.count; i++) uv.set([p.getX(i) / (2 * R) + 0.5, p.getY(i) / (2 * R) + 0.5], i * 2)
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    return geo
  }
  const mainShape = new THREE.Shape(flap ? arcPts(a1, a2 + TAU, 72).map(([x, y]) => new THREE.Vector2(x, y)) : arcPts(0, TAU, 72).map(([x, y]) => new THREE.Vector2(x, y)))
  const front = new THREE.Mesh(uvOf(new THREE.ShapeGeometry(mainShape, 4)), M.goldFace)
  front.position.z = T / 2 + 0.004 * R
  front.visible = false
  group.add(front)
  // a plain medal's relief: a raised rim and a boss in the middle
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R * 0.86, R * 0.03, 8, 64), M.silver)
  rim.position.z = T / 2
  const boss = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.3, R * 0.3, T * 0.2, 32).rotateX(Math.PI / 2), M.silver)
  boss.position.z = T / 2
  group.add(rim, boss)
  const back = new THREE.Mesh(new THREE.CircleGeometry(R * 0.992, 72), M.gold)
  back.rotation.y = Math.PI
  back.position.z = -T / 2 - 0.004 * R
  back.visible = false
  group.add(back)
  let pivot = null
  let sgn = 1
  let flapMesh = null
  if (flap) {
    const [p1, p2] = [arcPts(a1, a1, 1)[0], arcPts(a2, a2, 1)[0]]
    const mid = new THREE.Vector2((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2)
    const u = new THREE.Vector3(p1[0] - p2[0], p1[1] - p2[1], 0).normalize()
    const w = new THREE.Vector3(mid.x, mid.y, 0).normalize()
    sgn = Math.sign(u.x * w.y - u.y * w.x) || 1
    const seg = new THREE.Shape(arcPts(a2, a1, 24).map(([x, y]) => new THREE.Vector2(x, y)))
    const geo = uvOf(new THREE.ShapeGeometry(seg, 4))
    flapMesh = new THREE.Mesh(geo.clone().translate(-mid.x, -mid.y, 0), M.goldFace)
    pivot = new THREE.Group()
    pivot.position.set(mid.x, mid.y, T / 2 + 0.004 * R)
    pivot.userData.axis = u
    pivot.add(flapMesh)
    pivot.visible = false
    group.add(pivot)
  }
  // the iron hexagon, with six studs
  const hexG = new THREE.Group()
  {
    const hr = R * 0.3
    const sh = new THREE.Shape(Array.from({ length: 6 }, (_, i) => new THREE.Vector2(Math.cos((i / 6) * TAU + Math.PI / 6) * hr, Math.sin((i / 6) * TAU + Math.PI / 6) * hr)))
    const geo = new THREE.ExtrudeGeometry(sh, { depth: T * 0.5, bevelEnabled: true, bevelThickness: T * 0.06, bevelSize: hr * 0.04, bevelSegments: 2 })
    const iron = new THREE.Mesh(geo, M.iron)
    iron.position.z = T / 2 - T * 0.05
    hexG.add(iron)
    for (let i = 0; i < 6; i++) {
      const stud = new THREE.Mesh(new THREE.SphereGeometry(hr * 0.1, 10, 8), M.gold)
      stud.position.set(Math.cos((i / 6) * TAU + Math.PI / 6) * hr * 0.88, Math.sin((i / 6) * TAU + Math.PI / 6) * hr * 0.88, T / 2 + T * 0.5 + T * 0.02)
      hexG.add(stud)
    }
  }
  group.add(hexG)
  let peel = 0
  const api = {
    group,
    R,
    T,
    hex: hexG,
    flap: pivot,
    setLook({ body: b = body, skin: s = skin, hex: h = hex } = {}) {
      const base = M[b]
      cyl.material = [s ? M.gold : base, base, s ? M.gold : base]
      const gilt = s || b === 'gold'
      front.visible = gilt
      rim.visible = !gilt
      boss.visible = !gilt && !h
      rim.material = boss.material = base
      back.visible = gilt && b !== 'gold'
      if (pivot) pivot.visible = gilt
      hexG.visible = h
    },
    setPeel(k) {
      peel = k
      if (pivot) pivot.quaternion.setFromAxisAngle(pivot.userData.axis, sgn * k * 2.6)
    },
    get peel() {
      return peel
    },
    /** where the lifted corner is, in the medal's own space */
    cornerAt: () => new THREE.Vector3(Math.cos((a1 + a2) / 2) * R * 0.9, Math.sin((a1 + a2) / 2) * R * 0.9, T / 2),
  }
  api.setLook({ body, skin, hex })
  return api
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, clickable, lang, depth }) {
  const stage = stadiumStage({ light })
  root.add(stage.group)
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const disposers = []
  const textures = []
  const nf = (v, d = 0) => v.toLocaleString(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: d, maximumFractionDigits: d })
  const paras = (o, lv) => o[depth(lv)].map(p => ({ p }))
  const sign = (text, size, { color = '#eef2fb', maxWidth = 3, anchorY = 'middle', outline = true } = {}) =>
    makeText(text, { size, color, maxWidth, anchorY, outlineWidth: outline ? size * 0.09 : 0, outlineColor: '#0b1020' })
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const hit = (w, h, d, x, y, z, parent = root) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ghost)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  const world = obj => obj.getWorldPosition(new THREE.Vector3())
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())

  // materials: polished metals as matcaps (the hall's showpiece draws silver the same way)
  const rays = raysTexture()
  textures.push(rays)
  const mm = (key, color = '#ffffff', extra = {}) => new THREE.MeshMatcapMaterial({ matcap: metals[key](), color, ...extra })
  const M = {
    silver: mm('silver', '#f0f2f6'),
    gold: mm('gold', '#f4e4b8'),
    copper: mm('copper', '#f4e0d4'),
    bronze: mm('bronze', '#f4e6d0'),
    iron: mm('iron', '#e0dcd4'),
    goldFace: mm('gold', '#f4e4b8', { map: rays, side: THREE.DoubleSide }),
  }
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra })
  const navy = std('#1f2a66', { roughness: 0.55, emissive: '#0c1236', emissiveIntensity: 0.5 })
  const wood = std('#5a4636')
  const steel = std('#434a5c', { roughness: 0.5, metalness: 0.4 })
  const edgeGold = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.55, roughness: 0.4 })

  /** A canvas board in a dark frame facing +z: draw on `g` (w x h px), then `tex.needsUpdate = true`. */
  function board(width, height, px, edge = GOLD) {
    const group = new THREE.Group()
    const canvas = document.createElement('canvas')
    canvas.width = px
    canvas.height = Math.round((px * height) / width)
    const g = canvas.getContext('2d')
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures.push(tex)
    const frame = new THREE.Mesh(new RoundedBoxGeometry(width + 0.1, height + 0.1, 0.05, 2, 0.02), new THREE.MeshStandardMaterial({ color: edge, emissive: edge, emissiveIntensity: 0.7, roughness: 0.4 }))
    const face = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
    face.position.z = 0.03
    group.add(frame, face)
    return { group, g, w: canvas.width, h: canvas.height, tex, face }
  }
  const font = (size, weight = 700) => `${weight} ${size}px Outfit, Nunito, sans-serif`
  /** text fitted to a width (shrunk, never wrapped) */
  function line(g, text, x, y, size, { color = '#ffffff', align = 'center', maxW = 9999, weight = 700 } = {}) {
    let s = size
    g.font = font(s, weight)
    const m = g.measureText(text).width
    if (m > maxW) {
      s = Math.max(10, (size * maxW) / m)
      g.font = font(s, weight)
    }
    g.textAlign = align
    g.fillStyle = color
    g.fillText(text, x, y)
  }
  /** wrapped text that shrinks until it fits maxH; returns the next y */
  function wrap(g, text, x, y, maxW, size, lineH, { color = '#d2dbff', align = 'left', weight = 600, maxH = 9999 } = {}) {
    const count = s => {
      g.font = font(s, weight)
      let n = 1
      let cur = ''
      for (const w of String(text).split(/\s+/)) {
        const t = cur ? `${cur} ${w}` : w
        if (g.measureText(t).width > maxW && cur) {
          n++
          cur = w
        } else cur = t
      }
      return n
    }
    while (size > 14 && count(size) * lineH > maxH) {
      lineH *= 0.94
      size *= 0.94
    }
    g.font = font(size, weight)
    g.textAlign = align
    g.fillStyle = color
    const words = String(text).split(/\s+/)
    let cur = ''
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w
      if (g.measureText(t).width > maxW && cur) {
        g.fillText(cur, x, y)
        y += lineH
        cur = w
      } else cur = t
    }
    if (cur) g.fillText(cur, x, y)
    return y + lineH
  }
  const panelBg = (b, accent = GOLD) => {
    const { g, w, h } = b
    const grd = g.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#141a45')
    grd.addColorStop(1, '#0a0e2a')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
    g.fillStyle = accent
    g.fillRect(0, 0, w, 8)
  }
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })

  // the picture's shine on things that stand on the track: a cloth-roofed stage, a podium, a bench

  // ======================================================================================================
  // STATION 1: what is under the gold? (west)
  // ======================================================================================================
  const U = { x: -10.0, z: -2.0, bx: -6.9 }
  const under = E.under
  const mainMedal = makeMedal(M, { R: 0.9, body: 'silver', skin: true, hex: true, flap: true })
  mainMedal.group.position.set(U.x, 1.4, U.z)
  mainMedal.group.rotation.y = 0.22
  root.add(mainMedal.group)
  {
    // a stand: a plinth, and a strut behind it holding the medal upright on its edge
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.34, 0.9, 2, 0.04), navy)
    plinth.position.set(U.x, 0.17, U.z)
    root.add(plinth)
    const rim = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.035, 0.92), edgeGold)
    rim.position.set(U.x, 0.34, U.z)
    root.add(rim)
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.34), steel)
    cradle.position.set(U.x, 0.4, U.z)
    root.add(cradle)
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.5, 8), steel)
    strut.position.set(U.x - 0.1, 1.05, U.z - 0.45)
    strut.rotation.x = -0.45
    strut.rotation.z = -0.1
    root.add(strut)
    solids.push(box(U.x, U.z, 1.6, 1.0))
  }
  // ribbon above the medal
  {
    const rib = new THREE.MeshStandardMaterial({ color: '#2a46a0', roughness: 0.8, side: THREE.DoubleSide })
    for (const s of [-1, 1]) {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 1.2), rib)
      r.position.set(U.x + s * 0.2, 2.75, U.z - 0.1)
      r.rotation.z = -s * 0.28
      mainMedal.group.parent.add(r)
    }
  }
  // the iron hexagon's sign (shown when the hexagon is tapped)
  const hexSign = board(2.0, 0.95, 1024, '#a8aab4')
  hexSign.group.position.set(U.x, 2.85, U.z)
  hexSign.group.visible = false
  root.add(hexSign.group)
  const drawHexSign = lv => {
    const { g, w, h } = hexSign
    panelBg(hexSign, '#a8aab4')
    line(g, under.hex.title, w / 2, 100, 70, { color: '#e3e6ee', maxW: w - 50 })
    wrap(g, at(under.hex.line, lv), 50, 190, w - 100, 46, 58, { align: 'left', color: '#d2dbff', maxH: h - 300 })
    g.fillStyle = '#ffd166'
    line(g, under.hex.go, w / 2, h - 34, 44, { color: '#ffd166', maxW: w - 50 })
    hexSign.tex.needsUpdate = true
  }
  // the lens on the cut: gold atoms over silver atoms, a few of them copper
  const lens = new THREE.Group()
  lens.position.set(-8.45, 2.45, U.z + 0.1)
  lens.scale.setScalar(0.001)
  lens.visible = false
  root.add(lens)
  {
    const R = 0.52
    const disc = new THREE.Mesh(new THREE.CircleGeometry(R, 48), new THREE.MeshBasicMaterial({ color: '#0e1438' }))
    disc.position.z = -0.03
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.03, 0.035, 10, 64), edgeGold)
    lens.add(disc, ring)
    const r = 0.052
    const dx = r * 2.08
    const dy = dx * 0.866
    const rnd = random(47)
    const atoms = []
    const rows = Math.floor((R * 2) / dy)
    for (let j = 0; j < rows; j++) {
      const y = R - dy * (j + 0.6)
      for (let i = -6; i <= 6; i++) {
        const x = i * dx + (j % 2) * dx * 0.5
        if (Math.hypot(x, y) > R - r * 1.1) continue
        const layer = j < 3 ? 'gold' : rnd() < 0.125 ? 'copper' : 'silver'
        atoms.push({ x, y, layer })
      }
    }
    const inst = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 18, 12), new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.25, emissive: '#222222', emissiveIntensity: 0.3 }), atoms.length)
    const col = { gold: '#ffc93a', silver: '#b4bcc8', copper: '#d8843a' }
    const o = new THREE.Object3D()
    const c = new THREE.Color()
    atoms.forEach((a, i) => {
      o.position.set(a.x, a.y, 0.02)
      o.updateMatrix()
      inst.setMatrixAt(i, o.matrix)
      inst.setColorAt(i, c.set(col[a.layer]))
    })
    lens.add(inst)
    // the legend, at the lens's rim: Au, Ag, Cu
    ;[['Au', '#ffc93a', 0.2], ['Ag', '#c9d0dc', -0.1], ['Cu', '#e8985a', -0.4]].forEach(([s, c2, y]) => {
      const t = sign(s, 0.1, { color: c2, maxWidth: 0.5 })
      t.position.set(R + 0.2, y, 0.02)
      lens.add(t)
    })
    lens.userData.atoms = atoms
  }
  // the balance
  const bal = new THREE.Group()
  bal.position.set(U.bx, 0, U.z)
  root.add(bal)
  const BEAM = { y: 1.7, half: 1.0 }
  const beam = new THREE.Group()
  beam.position.y = BEAM.y
  const realCopy = { real: makeMedal(M, { R: 0.34, body: 'silver', skin: true, hex: true }), copy: makeMedal(M, { R: 0.34, body: 'gold', skin: false, hex: true }) }
  const pans = []
  {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, BEAM.y, 12), steel)
    col.position.y = BEAM.y / 2
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.56, 0.12, 24), navy)
    foot.position.y = 0.06
    const footRim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 6, 32), edgeGold)
    footRim.rotation.x = Math.PI / 2
    footRim.position.y = 0.12
    bal.add(col, foot, footRim)
    const bar = new THREE.Mesh(new THREE.BoxGeometry(BEAM.half * 2 + 0.2, 0.07, 0.07), M.bronze)
    beam.add(bar)
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), M.gold)
    knob.position.y = 0.06
    beam.add(knob)
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.02), M.silver)
    needle.position.y = -0.15
    beam.add(needle)
    bal.add(beam)
    for (const s of [-1, 1]) {
      const pan = new THREE.Group()
      pan.position.x = s * BEAM.half
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.78, 5), steel)
      cord.position.y = -0.4
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 0.07, 28), M.bronze)
      dish.position.y = -0.82
      pan.add(cord, dish)
      for (const a of [0, 1, 2]) {
        const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.9, 4), steel)
        ch.position.set(Math.cos((a / 3) * TAU) * 0.24, -0.4, Math.sin((a / 3) * TAU) * 0.24)
        ch.rotation.set(Math.sin((a / 3) * TAU) * 0.27, 0, -Math.cos((a / 3) * TAU) * 0.27)
        pan.add(ch)
      }
      beam.add(pan)
      pans.push(pan)
    }
    // the medals lie on the pans (flat, faces up)
    for (const [k, p] of [[realCopy.real, pans[0]], [realCopy.copy, pans[1]]]) {
      // leaning back in the pan toward the visitor, so its face shows
      k.group.rotation.x = -0.6
      k.group.position.set(0, -0.785 + 0.34 * Math.cos(0.6) + k.T * 0.5, -0.12)
      k.group.visible = false
      p.add(k.group)
    }
    solids.push(circle(U.bx, U.z, 0.55))
  }
  // weights and price, on small signs standing under the pans
  const weights = board(2.9, 0.82, 1100, '#7d8aa8')
  weights.group.position.set(U.bx - 0.35, 0.42, U.z + 1.35)
  weights.group.rotation.x = -0.35
  weights.group.visible = false
  root.add(weights.group)
  const drawWeights = lv => {
    const { g, w, h } = weights
    panelBg(weights, '#7d8aa8')
    const L = under.scale
    const half = w / 4
    line(g, at(L.real, lv), half, 66, 46, { color: '#e3e6ee', maxW: half * 1.85 })
    line(g, '529 g', half, 150, 84, { color: GOLD, maxW: half * 1.85 })
    line(g, at(L.copy, lv), half * 3, 66, 46, { color: '#e3e6ee', maxW: half * 1.85 })
    line(g, at(L.copyG, lv), half * 3, 150, 84, { color: '#ffd166', maxW: half * 1.85 })
    g.fillStyle = 'rgba(255,255,255,0.18)'
    g.fillRect(w / 2 - 1, 24, 2, h - 40)
    line(g, at(L.price, lv), half * 3, h - 30, 38, { color: '#ffb36b', maxW: half * 1.9, weight: 600 })
    line(g, at(L.same, lv), half, h - 30, 38, { color: '#bcd4ff', maxW: half * 1.9, weight: 600 })
    weights.tex.needsUpdate = true
  }

  // the station's state
  let peeled = false
  let weighed = false
  let hexShown = false
  let peelK = 0
  let weighK = 0
  let hexK = 0
  let underMine = false
  const underPanel = lv => ({
    title: under.title,
    color: GOLD,
    blocks: [
      { buttons: [['peel', () => underStep('corner')], ['weigh', () => underStep('balance')], ['hex', () => underStep('hex')]].map(([k, f]) => ({ label: under.buttons[k], onClick: f })) },
      ...paras(under.panel, lv),
      { link: { to: atriumPath('Fe'), label: under.ironLink } },
    ],
  })
  const underChanged = () => {
    underMine = true
    ex.discover('under', underPanel, 3)
    share('under')
  }
  function underStep(step) {
    const lv = level()
    const S = under.says
    if (step === 'corner') {
      peeled = !peeled
      play(peeled ? 'crack' : 'tap')
      say(at(peeled ? S.peel : S.unpeel, lv))
    } else if (step === 'balance') {
      weighed = !weighed
      play(weighed ? 'select' : 'tap')
      say(at(weighed ? S.weigh : S.unweigh, lv))
    } else if (step === 'hex') {
      hexShown = !hexShown
      play(hexShown ? 'discover' : 'tap')
      say(at(hexShown ? S.hex : S.unhex, lv))
    } else return
    underChanged()
  }
  ex.add({
    id: 'under',
    x: -8.4,
    z: 2.0,
    radius: 2.6,
    manual: true,
    label: under.label,
    verb: () => (!peeled ? under.hints.peel : !weighed ? under.hints.weigh : !hexShown ? under.hints.hex : under.hints.again),
    focus: focusOf(-8.3, 1.4, U.z, 3.4, 6.2),
    act: () => ctx.showPanel(underPanel),
  })
  clickable(mainMedal.group, () => underStep('corner'), { reach: 7, accept: h => !withinGroup(h.object, mainMedal.hex) })
  clickable(mainMedal.hex, () => underStep('hex'), { reach: 7 })
  const balHit = hit(2.6, 1.7, 1.2, U.bx, 1.1, U.z)
  clickable(balHit, () => underStep('balance'), { reach: 7 })
  clickable(lens, () => underStep('corner'), { reach: 7, when: () => peelK > 0.5 })
  updates.push((dt, t) => {
    peelK = damp(peelK, peeled ? 1 : 0, 3.2, dt)
    mainMedal.setPeel(ease(peelK))
    lens.visible = peelK > 0.02
    lens.scale.setScalar(Math.max(0.001, ease(clamp((peelK - 0.25) / 0.75))))
    lens.position.y = 2.45 + Math.sin(t * 1.3) * 0.03
    weighK = damp(weighK, weighed ? 1 : 0, 2.4, dt)
    const k = ease(weighK)
    realCopy.real.group.visible = realCopy.copy.group.visible = weighK > 0.03
    const s = Math.max(0.01, ease(clamp(weighK * 1.6)))
    realCopy.real.group.scale.setScalar(s)
    realCopy.copy.group.scale.setScalar(s)
    // the copy is the heavier: the beam goes down on its side (about 950 g against 529 g)
    const tilt = -0.2 * k + Math.sin(t * 2.2) * 0.012 * (1 - Math.abs(k - 0.5) * 2) * (k < 0.98 ? 1 : 0)
    beam.rotation.z = tilt
    for (const p of pans) p.rotation.z = -tilt
    weights.group.visible = weighK > 0.6
    hexK = damp(hexK, hexShown ? 1 : 0, 3.5, dt)
    mainMedal.hex.position.z = 0.28 * ease(hexK)
    mainMedal.hex.position.y = 0.0
    hexSign.group.visible = hexK > 0.5
    hexSign.group.scale.setScalar(ease(clamp((hexK - 0.4) / 0.6)) + 0.001)
    mainMedal.hex.children.forEach(m => m.material !== M.gold && m.material.matcap && (m.material.color.setScalar(1 + 0.25 * hexK)))
  })
  // words follow the depth switch
  let shownLevel = null
  updates.push(() => {
    const lv = level()
    if (lv !== shownLevel) {
      shownLevel = lv
      drawHexSign(lv)
      drawWeights(lv)
    }
  })

  // ======================================================================================================
  // STATION 2: gild it (east): the medal-maker's tent
  // ======================================================================================================
  const gild = E.gild
  const BX = { x: 8.4, z: -2.5, h: 0.92 }
  {
    // the bench, under an open tent
    const cab = new THREE.Mesh(new THREE.BoxGeometry(4.8, BX.h - 0.08, 1.0), wood)
    cab.position.set(BX.x, (BX.h - 0.08) / 2, BX.z)
    const top = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.08, 1.1), std('#7a5d49'))
    top.position.set(BX.x, BX.h - 0.04, BX.z)
    root.add(cab, top)
    solids.push(box(BX.x, BX.z, 4.9, 1.1))
    // tent: four poles, a gable roof and a front valance
    const pole = new THREE.CylinderGeometry(0.05, 0.06, 3.6, 8)
    const px = [5.4, 11.4]
    const pz = [-4.2, -0.9]
    for (const x of px) for (const z of pz) {
      const p = new THREE.Mesh(pole, wood)
      p.position.set(x, 1.8, z)
      root.add(p)
      solids.push(circle(x, z, 0.12))
    }
    const cloth = new THREE.MeshStandardMaterial({ color: '#d9cfb8', roughness: 0.95, side: THREE.DoubleSide, emissive: '#3a3020', emissiveIntensity: 0.35 })
    const roofGeo = new THREE.BufferGeometry()
    const ridgeY = 4.4
    const eaveY = 3.6
    const x0 = px[0] - 0.4
    const x1 = px[1] + 0.4
    const zf = pz[1] + 0.3
    const zb = pz[0] - 0.3
    const zr = (pz[0] + pz[1]) / 2
    const V = [x0, eaveY, zf, x1, eaveY, zf, x1, ridgeY, zr, x0, ridgeY, zr, x0, eaveY, zb, x1, eaveY, zb]
    roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(V, 3))
    roofGeo.setIndex([0, 1, 2, 0, 2, 3, 3, 2, 5, 3, 5, 4])
    roofGeo.computeVertexNormals()
    root.add(new THREE.Mesh(roofGeo, cloth))
    const val = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, 0.4), new THREE.MeshStandardMaterial({ color: '#2a46a0', roughness: 0.9, side: THREE.DoubleSide }))
    val.position.set((x0 + x1) / 2, eaveY - 0.2, zf)
    root.add(val)
    const back = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 - 0.4, 3.0), new THREE.MeshStandardMaterial({ color: '#202a58', roughness: 1, side: THREE.DoubleSide }))
    back.position.set((x0 + x1) / 2, 1.9, zb + 0.3)
    root.add(back)
    // a hanging lamp
    for (const x of [7.4, 9.6]) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshStandardMaterial({ color: '#fff0c8', emissive: '#ffd890', emissiveIntensity: 1.6 }))
      bulb.position.set(x, 3.3, BX.z + 0.4)
      root.add(bulb)
    }
    if (!light) {
      const pl = new THREE.PointLight('#ffd9a0', 9, 9, 1.5)
      pl.position.set(BX.x, 3.0, BX.z + 0.8)
      root.add(pl)
    }
  }
  // the power supply: an ammeter, a switch, two terminals
  const SUP = { x: 6.75, z: BX.z }
  const dialTex = canvasTex(256, 256, (g, w) => {
    g.fillStyle = '#f3efe2'
    g.beginPath()
    g.arc(w / 2, w / 2, w / 2 - 4, 0, TAU)
    g.fill()
    g.strokeStyle = '#2a2a2a'
    g.lineWidth = 3
    g.fillStyle = '#2a2a2a'
    g.font = font(26)
    g.textAlign = 'center'
    for (let i = 0; i <= 8; i++) {
      const a = lerp(-0.95, 0.95, i / 8) - 0 // from the left (0 A) to the right (2 A)
      const x0 = w / 2 + Math.sin(a) * w * 0.4
      const y0 = w / 2 - Math.cos(a) * w * 0.4 + 18
      const x1 = w / 2 + Math.sin(a) * w * (i % 2 ? 0.44 : 0.47)
      const y1 = w / 2 - Math.cos(a) * w * (i % 2 ? 0.44 : 0.47) + 18
      g.beginPath()
      g.moveTo(x0, y0)
      g.lineTo(x1, y1)
      g.stroke()
      if (i % 2 === 0) g.fillText(String(i / 4), w / 2 + Math.sin(a) * w * 0.31, w / 2 - Math.cos(a) * w * 0.31 + 28)
    }
    g.font = font(40)
    g.fillText('A', w / 2, w * 0.78)
  })
  textures.push(dialTex)
  const needle = new THREE.Group()
  const lever = new THREE.Group()
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshStandardMaterial({ color: '#244', emissive: '#00ff88', emissiveIntensity: 0 }))
  {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.44, 0.5, 2, 0.03), std('#3a4766', { metalness: 0.2 }))
    body.position.set(SUP.x, BX.h + 0.22, SUP.z)
    root.add(body)
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), new THREE.MeshBasicMaterial({ map: dialTex, color: '#8f8c82' }))
    dial.position.set(SUP.x - 0.2, BX.h + 0.25, SUP.z + 0.255)
    root.add(dial)
    const nd = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.13, 0.008), new THREE.MeshBasicMaterial({ color: '#c01818' }))
    nd.position.y = 0.065
    needle.add(nd)
    needle.position.set(SUP.x - 0.2, BX.h + 0.25 - 0.04, SUP.z + 0.262)
    root.add(needle)
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.02), std('#242b40'))
    plate.position.set(SUP.x + 0.2, BX.h + 0.2, SUP.z + 0.255)
    root.add(plate)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.17, 8), M.silver)
    stem.position.y = 0.085
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), std('#d83a3a', { emissive: '#601010', emissiveIntensity: 0.4 }))
    knob.position.y = 0.17
    lever.add(stem, knob)
    lever.position.set(SUP.x + 0.2, BX.h + 0.16, SUP.z + 0.27)
    root.add(lever)
    led.position.set(SUP.x + 0.2, BX.h + 0.36, SUP.z + 0.27)
    root.add(led)
  }
  const TERM = { neg: new THREE.Vector3(SUP.x - 0.2, BX.h + 0.5, SUP.z - 0.05), pos: new THREE.Vector3(SUP.x + 0.12, BX.h + 0.5, SUP.z - 0.05) }
  for (const [k, c] of [['neg', '#1a1a1a'], ['pos', '#d02a2a']]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.1, 10), std(c))
    post.position.copy(TERM[k]).y -= 0.03
    root.add(post)
  }
  // the tank: clear glass holding a clear yellow bath, a bar across the top for each electrode
  const TK = { x: 9.75, z: BX.z, w: 1.5, h: 0.95, d: 0.8 }
  const FRONT = { z: TK.z + 0.15 }
  const BACK = { z: TK.z - 0.25 }
  const BAR_Y = BX.h + TK.h + 0.05
  {
    const glass = new THREE.Mesh(new THREE.BoxGeometry(TK.w, TK.h, TK.d), new THREE.MeshStandardMaterial({ color: '#cfe9ff', transparent: true, opacity: 0.12, roughness: 0.08, depthWrite: false, side: THREE.DoubleSide }))
    glass.position.set(TK.x, BX.h + TK.h / 2, TK.z)
    glass.renderOrder = 4
    root.add(glass)
    const liquid = new THREE.Mesh(new THREE.BoxGeometry(TK.w - 0.06, TK.h - 0.2, TK.d - 0.06), new THREE.MeshStandardMaterial({ color: '#f2d36a', transparent: true, opacity: 0.3, roughness: 0.2, depthWrite: false, emissive: '#6a5410', emissiveIntensity: 0.35 }))
    liquid.position.set(TK.x, BX.h + 0.03 + (TK.h - 0.2) / 2, TK.z)
    liquid.renderOrder = 3
    root.add(liquid)
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(TK.w, TK.h, TK.d)), new THREE.LineBasicMaterial({ color: '#d6e8f8', transparent: true, opacity: 0.6 }))
    edges.position.copy(glass.position)
    root.add(edges)
    for (const z of [FRONT.z, BACK.z]) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, TK.w + 0.2, 8), M.silver)
      bar.rotation.z = Math.PI / 2
      bar.position.set(TK.x, BAR_Y, z)
      root.add(bar)
    }
    // the other electrode: a platinum-coated plate behind the medal
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.56, 0.015), std('#5b6270', { metalness: 0.6, roughness: 0.35 }))
    plate.position.set(TK.x, BX.h + 0.5, BACK.z)
    root.add(plate)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, BAR_Y - (BX.h + 0.78), 6), M.silver)
    rod.position.set(TK.x, (BAR_Y + BX.h + 0.78) / 2, BACK.z)
    root.add(rod)
  }
  // the clips and their signs
  const clipMat = { red: std('#d02a2a', { emissive: '#400808', emissiveIntensity: 0.4 }), black: std('#1a1a1a') }
  const clips = ['front', 'back'].map((k, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), clipMat.black)
    const z = i === 0 ? FRONT.z : BACK.z
    m.position.set(TK.x + TK.w / 2 + 0.12, BAR_Y, z)
    root.add(m)
    const t = sign('-', 0.2, { color: '#ffffff', maxWidth: 0.5 })
    t.position.set(m.position.x + 0.02, BAR_Y + 0.2, z + 0.08)
    root.add(t)
    return { mesh: m, text: t, z }
  })
  // cables: from each terminal over the tank to each clip (the two that are live show)
  const cableCurve = (from, to, lift) => {
    const mid = new THREE.Vector3((from.x + to.x) / 2, 2.2 + lift, (from.z + to.z) / 2 + 0.1)
    return new THREE.CatmullRomCurve3([from.clone(), from.clone().add(new THREE.Vector3(0, 0.25, 0)), new THREE.Vector3(lerp(from.x, to.x, 0.3), 2.05 + lift, lerp(from.z, to.z, 0.3)), mid, new THREE.Vector3(lerp(from.x, to.x, 0.85), 2.1 + lift, lerp(from.z, to.z, 0.9)), to.clone().add(new THREE.Vector3(0.0, 0.05, 0))])
  }
  const clipPos = i => clips[i].mesh.position
  const cables = {}
  for (const [term, tcol] of [['neg', 'black'], ['pos', 'red']]) {
    for (const [ci, name] of [[0, 'front'], [1, 'back']]) {
      const curve = cableCurve(TERM[term], clipPos(ci), term === 'neg' ? 0 : 0.1)
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.014, 6), clipMat[tcol])
      root.add(mesh)
      cables[`${term}-${name}`] = { mesh, curve }
    }
  }
  // electrons marching along the live cables
  const eN = light ? 6 : 10
  const eMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: '#7ad0ff' }), eN * 2)
  eMesh.frustumCulled = false
  eMesh.count = 0
  root.add(eMesh)
  // the blank
  const BL = { R: 0.36 }
  const blankMat = new THREE.MeshMatcapMaterial({ matcap: metals.gold(), color: '#f4e4b8', transparent: true, opacity: 0, depthWrite: false })
  const blank = new THREE.Group()
  const blankBody = new THREE.Mesh(new THREE.CylinderGeometry(BL.R, BL.R, BL.R * 0.216, 64).rotateX(Math.PI / 2), M.silver)
  const blankSkin = new THREE.Mesh(new THREE.CylinderGeometry(BL.R * 1.006, BL.R * 1.006, BL.R * 0.216 * 1.06, 64).rotateX(Math.PI / 2), blankMat)
  blankSkin.renderOrder = 6
  const blankRim = new THREE.Mesh(new THREE.TorusGeometry(BL.R * 0.8, 0.008, 6, 48), M.silver)
  blankRim.position.z = BL.R * 0.108 + 0.002
  blank.add(blankBody, blankSkin, blankRim)
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 14), M.silver)
  loop.position.y = BL.R + 0.03
  blank.add(loop)
  root.add(blank)
  const HOOK = new THREE.Vector3(8.15, BX.h + 0.62, FRONT.z)
  const BATH = new THREE.Vector3(TK.x, BX.h + 0.56, FRONT.z)
  {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 1.4, 8), steel)
    post.position.set(HOOK.x, BX.h + 0.7, BACK.z + 0.1)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, FRONT.z - BACK.z - 0.1 + 0.05), steel)
    arm.position.set(HOOK.x, BX.h + 1.4, (FRONT.z + BACK.z) / 2 + 0.05)
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.4), steel)
    base.position.set(HOOK.x, BX.h + 0.025, BACK.z + 0.1)
    root.add(post, arm, base)
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 6, 12, Math.PI * 1.5), steel)
    hook.position.set(HOOK.x, BX.h + 1.37, FRONT.z)
    root.add(hook)
  }
  // the board: current, time, gold, skin (and silver lost)
  const counter = board(2.5, 1.05, 1024)
  counter.group.position.set(8.3, 2.95, BX.z - 0.6)
  root.add(counter.group)
  // ions in the bath: gold ones wander (the bath is stirred); silver ones leave a medal that is the anode
  const NI = light ? 26 : 44
  const ions = { gold: [], silver: [] }
  const ionGeo = new THREE.SphereGeometry(0.032, 10, 8)
  const goldIons = new THREE.InstancedMesh(ionGeo, new THREE.MeshStandardMaterial({ color: '#ffc93a', emissive: '#a06a00', emissiveIntensity: 0.6, roughness: 0.3 }), NI)
  const silverIons = new THREE.InstancedMesh(ionGeo, new THREE.MeshStandardMaterial({ color: '#b4bcc8', emissive: '#404858', emissiveIntensity: 0.5, roughness: 0.3 }), NI)
  goldIons.frustumCulled = silverIons.frustumCulled = false
  root.add(goldIons, silverIons)
  const rndIon = random(77)
  const inTank = () => ({ x: TK.x + (rndIon() - 0.5) * (TK.w - 0.2), y: BX.h + 0.08 + rndIon() * (TK.h - 0.35), z: TK.z + (rndIon() - 0.5) * (TK.d - 0.15) })
  for (let i = 0; i < NI; i++) ions.gold.push({ ...inTank(), vx: 0, vy: 0, vz: 0 })
  for (let i = 0; i < NI; i++) ions.silver.push({ x: 0, y: -9, z: 0, life: 0, vx: 0, vy: 0, vz: 0 })

  // the station's state: the blank in the bath or not, the polarity, the switch, the current, the gold laid
  // (shared as a snapshot and the wall-clock time it was taken: the running bath is worked out from them)
  const G = { inBath: false, pol: 'cath', on: false, amps: AMPS.start, g0: 0, l0: 0, s0: 0, since: 0 }
  let moveK = 0
  let gildMine = false
  const running = () => G.on && G.inBath && cur().g < GMAX
  function cur() {
    const dtS = G.on && G.inBath ? Math.max(0, (Date.now() - G.since) / 1000) : 0
    const sim = dtS * SPEED
    let g = G.g0
    let l = G.l0
    if (G.pol === 'cath') g = Math.min(GMAX, g + G.amps * sim * AU_RATE)
    else l = Math.min(80, l + G.amps * sim * AG_RATE)
    const s = G.s0 + (G.pol === 'cath' ? (g - G.g0) / (G.amps * AU_RATE || 1) : (l - G.l0) / (G.amps * AG_RATE || 1))
    return { g, l, s: G.on && G.inBath ? s : G.s0 }
  }
  // the bath's clock runs only while it is on: otherwise `since` is 0 (and the same on every screen)
  const stamp = () => (G.since = G.on && G.inBath ? Date.now() : 0)
  const snap = () => {
    const c = cur()
    G.g0 = c.g
    G.l0 = c.l
    G.s0 = c.s
    G.since = Date.now()
  }
  const gildPanel = lv => ({
    title: gild.title,
    color: GOLD,
    blocks: [
      {
        slider: {
          label: gild.slider,
          min: AMPS.min,
          max: AMPS.max,
          step: AMPS.step,
          value: G.amps,
          onInput: v => gildStep('amps', v),
          format: v => `${nf(v, 1)} A`,
          live: () => G.amps,
        },
      },
      { buttons: [['hang', () => gildStep('blank')], ['switch', () => gildStep('switch')], ['swap', () => gildStep('clips')], ['fresh', () => gildStep('fresh')]].map(([k, f]) => ({ label: gild.buttons[k], onClick: f })) },
      ...paras(gild.panel, lv),
    ],
  })
  const gildChanged = () => {
    stamp()
    gildMine = true
    ex.discover('gild', gildPanel, 3)
    share('gild')
  }
  const toldG = { half: false, full: false, lost: false }
  function gildStep(step, v) {
    const lv = level()
    const S = gild.says
    if (step === 'blank') {
      snap()
      G.inBath = !G.inBath
      if (!G.inBath) G.on = false
      play('select')
      say(at(G.inBath ? S.hang : S.lift, lv))
    } else if (step === 'switch') {
      if (!G.inBath) return say(at(S.noMedal, lv))
      snap()
      if (!G.on && cur().g >= GMAX && G.pol === 'cath') return say(at(S.enough, lv))
      G.on = !G.on
      play(G.on ? 'beam' : 'tap')
      say(at(G.on ? (G.pol === 'cath' ? S.runCath : S.runAnode) : S.stop, lv))
    } else if (step === 'clips') {
      snap()
      G.pol = G.pol === 'cath' ? 'anode' : 'cath'
      play('select')
      say(at(G.pol === 'cath' ? S.swapBack : S.swap, lv))
    } else if (step === 'fresh') {
      G.inBath = false
      G.on = false
      G.pol = 'cath'
      G.g0 = G.l0 = G.s0 = 0
      G.since = 0
      toldG.half = toldG.full = toldG.lost = false
      play('tap')
      say(at(S.fresh, lv))
    } else if (step === 'amps') {
      snap()
      G.amps = clamp(Math.round(Number(v) * 10) / 10, AMPS.min, AMPS.max)
      stamp()
      gildMine = true
      ex.discover('gild', gildPanel, 3)
      if (sending) return
      sending = true
      later(0.25, () => {
        sending = false
        share('gild')
      })
      return
    } else return
    gildChanged()
  }
  let sending = false
  ex.add({
    id: 'gild',
    x: 8.4,
    z: 2.2,
    radius: 2.6,
    manual: true,
    label: gild.label,
    verb: () => {
      const h = gild.hints
      const c = cur()
      if (!G.inBath) return c.g > 0 && c.g >= 0.5 ? h.again : h.hang
      if (!G.on) return c.g >= 6 || c.l >= 3 ? h.lift : h.switch
      return h.stop
    },
    focus: focusOf(8.5, 1.5, BX.z, 3.1, 5.0),
    act: () => ctx.showPanel(gildPanel),
  })
  clickable(blank, () => gildStep('blank'), { reach: 7 })
  const swHit = hit(0.4, 0.5, 0.25, SUP.x + 0.2, BX.h + 0.25, SUP.z + 0.28)
  clickable(swHit, () => gildStep('switch'), { reach: 7 })
  const clipHit = hit(0.4, 0.5, 0.7, TK.x + TK.w / 2 + 0.12, BAR_Y + 0.05, TK.z - 0.05)
  clickable(clipHit, () => gildStep('clips'), { reach: 7 })
  const blankHit = hit(0.85, 0.85, 0.25, 0, 0, 0, blank)
  let counterKey = ''
  const drawCounter = (lv, c) => {
    const { g, w, h } = counter
    panelBg(counter)
    const L = gild.board
    const cath = G.pol === 'cath'
    const cell = (x, y, label, value, color = '#ffffff') => {
      line(g, label, x, y, 30, { color: '#aebbe8', maxW: w / 2 - 40, weight: 600 })
      line(g, value, x, y + 70, 64, { color, maxW: w / 2 - 40 })
    }
    cell(w / 4, 70, at(L.current, lv), `${nf(G.amps, 1)} A`, '#7ad0ff')
    const hours = c.s / 3600
    const hh = Math.floor(hours)
    const mm2 = Math.floor((hours - hh) * 60)
    cell((w * 3) / 4, 70, at(L.time, lv), `${hh}:${String(mm2).padStart(2, '0')} h`)
    if (cath) {
      cell(w / 4, 220, at(L.gold, lv), `${nf(c.g, 1)} g`, c.g >= 6 ? '#ffd166' : '#ffffff')
      cell((w * 3) / 4, 220, at(L.skin, lv), `${nf(c.g * SKIN_UM, 0)} µm`)
    } else {
      cell(w / 4, 220, at(L.lost, lv), `${nf(c.l, 1)} g`, '#ff9a8a')
      cell((w * 3) / 4, 220, at(L.gold, lv), `${nf(c.g, 1)} g`)
    }
    const note = !G.inBath ? L.idle : !G.on ? L.ready : cath ? (c.g >= 6 ? L.enough : L.cath) : L.anode
    line(g, at(note, lv), w / 2, h - 28, 30, { color: cath ? '#ffd166' : '#ff9a8a', maxW: w - 60, weight: 600 })
    counter.tex.needsUpdate = true
  }
  const eTmp = new THREE.Object3D()
  const eV = new THREE.Vector3()
  updates.push((dt, t) => {
    const lv = level()
    const c = cur()
    // polarity: clip colours and signs, and which cables show
    const cath = G.pol === 'cath'
    clips[0].mesh.material = cath ? clipMat.black : clipMat.red
    clips[1].mesh.material = cath ? clipMat.red : clipMat.black
    for (const [i, ck] of clips.entries()) {
      const neg = (i === 0) === cath
      const want = neg ? '-' : '+'
      if (ck.text.text !== want) {
        ck.text.text = want
        ck.text.sync()
      }
      ck.text.color = neg ? '#c8d0e0' : '#ff8a80'
    }
    cables['neg-front'].mesh.visible = cath
    cables['neg-back'].mesh.visible = !cath
    cables['pos-front'].mesh.visible = !cath
    cables['pos-back'].mesh.visible = cath
    // the blank travels to the bath and back
    moveK = damp(moveK, G.inBath ? 1 : 0, 3.2, dt)
    const m = ease(moveK)
    blank.position.set(lerp(HOOK.x, BATH.x, m), lerp(HOOK.y, BATH.y, m) + 0.95 * Math.sin(Math.PI * m), HOOK.z)
    blank.rotation.y = 0
    const run = running()
    // the gold laid on it, and the silver lost the other way (it dulls a little)
    blankMat.opacity = clamp(Math.pow(c.g / 6, 0.7))
    blankBody.material.color.setScalar(1 - clamp(c.l / 20) * 0.35)
    blankSkin.visible = c.g > 0.02
    // the dial, the lamp, the switch
    needle.rotation.z = damp(needle.rotation.z, lerp(0.95, -0.95, (G.on && G.inBath ? G.amps : 0) / 2), 5, dt)
    lever.rotation.z = damp(lever.rotation.z, G.on ? -0.6 : 0.6, 10, dt)
    led.material.emissiveIntensity = G.on ? 1.6 : 0
    // electrons along the live cables
    let n = 0
    if (run) {
      const negC = cables[cath ? 'neg-front' : 'neg-back'].curve
      const posC = cables[cath ? 'pos-back' : 'pos-front'].curve
      for (let i = 0; i < eN; i++) {
        const u = (t * 0.28 * (0.5 + G.amps * 0.6) + i / eN) % 1
        negC.getPointAt(u, eV)
        eTmp.position.copy(eV)
        eTmp.updateMatrix()
        eMesh.setMatrixAt(n++, eTmp.matrix)
        posC.getPointAt(1 - u, eV)
        eTmp.position.copy(eV)
        eTmp.updateMatrix()
        eMesh.setMatrixAt(n++, eTmp.matrix)
      }
    }
    eMesh.count = n
    eMesh.instanceMatrix.needsUpdate = true
    // the ions: gold wanders (stirred); with the medal as cathode they stream to it and are taken; the silver
    // ones come off a medal that is the anode
    const face = FRONT.z + BL.R * 0.108 + 0.02
    const inB = G.inBath && moveK > 0.9
    const plating = run && cath && inB
    const dissolving = run && !cath && inB
    ions.gold.forEach((p, i) => {
      p.vx += (Math.random() - 0.5) * 0.9 * dt
      p.vy += (Math.random() - 0.5) * 0.9 * dt
      p.vz += (Math.random() - 0.5) * 0.9 * dt
      if (plating) {
        const dx = BATH.x - p.x
        const dy = BATH.y - p.y
        p.vx += dx * 0.5 * dt * G.amps
        p.vy += dy * 0.5 * dt * G.amps
        p.vz += (face + 0.03 - p.z) * 1.6 * dt * G.amps
        if (p.z > face - 0.02 && p.z < face + 0.12 && Math.hypot(p.x - BATH.x, p.y - BATH.y) < BL.R * 0.95) Object.assign(p, inTank(), { vx: 0, vy: 0, vz: 0 })
      }
      p.vx *= 0.95
      p.vy *= 0.95
      p.vz *= 0.95
      p.x = clamp(p.x + p.vx * dt, TK.x - TK.w / 2 + 0.06, TK.x + TK.w / 2 - 0.06)
      p.y = clamp(p.y + p.vy * dt, BX.h + 0.06, BX.h + TK.h - 0.2)
      p.z = clamp(p.z + p.vz * dt, TK.z - TK.d / 2 + 0.06, TK.z + TK.d / 2 - 0.06)
      eTmp.position.set(p.x, p.y, p.z)
      eTmp.updateMatrix()
      goldIons.setMatrixAt(i, eTmp.matrix)
    })
    goldIons.instanceMatrix.needsUpdate = true
    ions.silver.forEach((p, i) => {
      if (p.life <= 0 && dissolving && Math.random() < dt * 6 * G.amps) {
        const a = Math.random() * TAU
        const r = BL.R * Math.sqrt(Math.random()) * 0.9
        Object.assign(p, { x: BATH.x + Math.cos(a) * r, y: BATH.y + Math.sin(a) * r, z: face, life: 1, vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12, vz: 0.1 + Math.random() * 0.12 })
      }
      if (p.life > 0) {
        p.life -= dt * 0.3
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.z += p.vz * dt
        p.vz *= 0.995
        p.vy -= dt * 0.01
        if (p.life <= 0 || p.z > TK.z + TK.d / 2 - 0.05) p.life = 0
      }
      eTmp.position.set(p.x, p.life > 0 ? p.y : -9, p.z)
      eTmp.scale.setScalar(p.life > 0 ? 0.5 + p.life : 0.0001)
      eTmp.updateMatrix()
      silverIons.setMatrixAt(i, eTmp.matrix)
      eTmp.scale.setScalar(1)
    })
    silverIons.instanceMatrix.needsUpdate = true
    // the board
    const key = `${lv}|${G.amps}|${G.pol}|${G.inBath}|${Math.round(c.g * 10)}|${Math.round(c.l * 10)}|${Math.floor(c.s / 60)}`
    if (key !== counterKey) {
      counterKey = key
      drawCounter(lv, c)
    }
    // what is worth saying on the way (told once, to whoever ran it)
    if (run && gildMine) {
      if (cath && !toldG.half && c.g >= 3) (toldG.half = true), say(at(gild.says.half, lv))
      if (cath && !toldG.full && c.g >= 6) (toldG.full = true), say(at(gild.says.full, lv)), play('discover')
      if (!cath && !toldG.lost && c.l >= 2) (toldG.lost = true), say(at(gild.says.lost, lv))
    }
    if (G.on && G.inBath && cath && c.g >= GMAX) {
      snap()
      G.on = false
      stamp()
      if (gildMine) say(at(gild.says.enough, lv))
    }
  })

  // ======================================================================================================
  // STATION 3: who got what? (the podium)
  // ======================================================================================================
  const games = E.games
  const PD = { x: 0, z: -9.2 }
  const LOOKS = [
    [{ body: 'silver', hex: false, kit: ['olive', 'diploma'] }, { body: 'copper', hex: false, kit: ['laurel'] }, null],
    [{ cup: 1 }, { cup: 0.7 }, null],
    [{ body: 'gold', hex: false }, { body: 'silver', hex: false }, { body: 'bronze', hex: false }],
    [{ body: 'gold', hex: false }, { body: 'silver', hex: false }, { body: 'bronze', hex: false }],
    [{ body: 'silver', skin: true, hex: false }, { body: 'silver', hex: false }, { body: 'bronze', hex: false }],
    [{ body: 'silver', skin: true, hex: true }, { body: 'silver', hex: true }, { body: 'bronze', hex: true }],
  ]
  const STEPS = [
    { n: 1, x: PD.x, h: 0.5 },
    { n: 2, x: PD.x - 1.6, h: 0.36 },
    { n: 3, x: PD.x + 1.6, h: 0.24 },
  ]
  const steps = STEPS.map(s => {
    const grp = new THREE.Group()
    grp.position.set(s.x, 0, PD.z)
    root.add(grp)
    const blk = new THREE.Mesh(new RoundedBoxGeometry(1.5, s.h, 1.2, 2, 0.03), navy)
    blk.position.y = s.h / 2
    const strip = new THREE.Group()
    for (const [bw, bd, bx, bz] of [[1.52, 0.05, 0, 0.6], [0.05, 1.22, -0.735, 0], [0.05, 1.22, 0.735, 0]]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.035, bd), edgeGold)
      bar.position.set(bx, 0, bz)
      strip.add(bar)
    }
    strip.position.y = s.h
    const num = sign(String(s.n), 0.28, { color: '#ffd166', maxWidth: 1 })
    num.position.set(0, s.h / 2, 0.62)
    grp.add(blk, strip, num)
    solids.push(box(s.x, PD.z, 1.5, 1.2, { y1: s.h }))
    const stand = new THREE.Group()
    stand.position.y = s.h + 0.03
    grp.add(stand)
    const mk = makeMedal(M, { R: 0.3, body: 'silver', hex: false })
    mk.group.position.set(0, 0.44, -0.1)
    stand.add(mk.group)
    const holder = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.22), steel)
    holder.position.set(0, 0.05, -0.1)
    stand.add(holder)
    // the extras of 1896 and 1900
    const kit = new THREE.Group()
    stand.add(kit)
    const leafMat = std('#4f7a38')
    const branch = (color, n, lean) => {
      const g = new THREE.Group()
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.9, 5), wood)
      stem.rotation.z = Math.PI / 2
      g.add(stem)
      for (let i = 0; i < n; i++) {
        const lf = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), color)
        lf.scale.set(1.5, 0.35, 0.6)
        lf.position.set(-0.4 + (i / (n - 1)) * 0.8, 0.03 * (i % 2 ? 1 : -1), 0.03 * (i % 2 ? 1 : -1))
        lf.rotation.z = (i % 2 ? 1 : -1) * 0.7 + lean
        g.add(lf)
      }
      return g
    }
    const olive = branch(leafMat, 12, 0)
    olive.position.set(0, 0.03, 0.4)
    const laurel = branch(std('#2f5e3a'), 14, 0.2)
    laurel.position.set(0, 0.03, 0.4)
    const diploma = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 10), std('#efe6d0'))
    diploma.rotation.z = Math.PI / 2
    diploma.position.set(0.5, 0.05, 0.25)
    const ribbonD = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.04, 10), std('#b02a2a'))
    ribbonD.rotation.z = Math.PI / 2
    ribbonD.position.copy(diploma.position)
    // a cup
    const cupPts = [[0.001, 0], [0.14, 0], [0.14, 0.03], [0.04, 0.06], [0.035, 0.2], [0.17, 0.3], [0.2, 0.45], [0.17, 0.45], [0.15, 0.32], [0.001, 0.22]].map(([r, y]) => new THREE.Vector2(r, y))
    const cup = new THREE.Group()
    const cupBody = new THREE.Mesh(new THREE.LatheGeometry(cupPts, 24), M.silver)
    cupBody.material = M.silver.clone()
    cupBody.material.side = THREE.DoubleSide
    cup.add(cupBody)
    for (const sx of [-1, 1]) {
      const hd = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 6, 16, Math.PI), M.silver)
      hd.position.set(sx * 0.2, 0.32, 0)
      hd.rotation.z = sx > 0 ? -Math.PI / 2 : Math.PI / 2
      cup.add(hd)
    }
    cup.position.set(0, 0, 0.12)
    kit.add(olive, laurel, diploma, ribbonD, cup)
    const parts = { olive, laurel, diploma: [diploma, ribbonD], cup }
    return { ...s, grp, stand, medal: mk, holder, parts, y0: s.h + 0.03, lift: 0 }
  })
  const bd = board(3.6, 2.5, 1280)
  bd.group.position.set(PD.x, 3.0, PD.z - 0.9)
  root.add(bd.group)
  const gold2 = { en: 0 }
  void gold2
  let game = 5 // the Games shown: an index into LOOKS (and the slider)
  let sel = -1
  let gamesMine = false
  let boardKey = ''
  const lookAt = (g, i) => LOOKS[g][i]
  const applyGame = () => {
    steps.forEach((s, i) => {
      const L = lookAt(game, i)
      const medalOn = !!(L && L.body)
      s.medal.group.visible = s.holder.visible = medalOn
      if (medalOn) s.medal.setLook({ body: L.body, skin: !!L.skin, hex: !!L.hex })
      const k = L?.kit ?? []
      s.parts.olive.visible = k.includes('olive')
      s.parts.laurel.visible = k.includes('laurel')
      s.parts.diploma.forEach(d => (d.visible = k.includes('diploma')))
      s.parts.cup.visible = !!L?.cup
      if (L?.cup) s.parts.cup.scale.setScalar(L.cup)
    })
  }
  const drawBoard = (lv, g, i) => {
    const { g: c, w, h } = bd
    panelBg(bd)
    const row = games.rows[g]
    line(c, row.head, 40, 90, 78, { color: GOLD, align: 'left', maxW: w * 0.55 })
    const L = i >= 0 ? lookAt(g, i) : null
    if (i < 0) {
      line(c, at(games.board.tap, lv), w / 2, 220, 56, { color: '#7ad0ff', maxW: w - 80 })
      wrap(c, at(row.what, lv), 50, 330, w - 100, 58, 76, { maxH: h - 350 })
    } else if (!L) {
      line(c, at(games.board.none, lv), w / 2, 230, 62, { color: '#ffb36b', maxW: w - 80 })
      wrap(c, at(row.what, lv), 50, 350, w - 100, 54, 70, { maxH: h - 370 })
    } else if (L.cup) {
      line(c, games.board.step[i], w - 40, 90, 46, { color: '#aebbe8', align: 'right', maxW: w * 0.4 })
      line(c, at(games.board.cup, lv), w / 2, 290, 66, { color: '#e3e6ee', maxW: w - 80 })
      wrap(c, at(row.what, lv), 50, 390, w - 100, 52, 68, { maxH: h - 410 })
    } else {
      // the medal cut through: a slab, the gold skin drawn much too thick
      const mat = games.mats
      const x0 = 190
      const x1 = w - 190
      const y0 = 170
      const th = 110
      const fillOf = { gold: '#ffc93a', silver: '#c4cbd6', copper: '#c8743c', bronze: '#a87a3c' }
      c.fillStyle = fillOf[L.body]
      c.fillRect(x0, y0, x1 - x0, th)
      if (L.skin) {
        c.fillStyle = '#ffc93a'
        c.fillRect(x0 - 8, y0 - 18, x1 - x0 + 16, 18)
        c.fillRect(x0 - 8, y0 + th, x1 - x0 + 16, 18)
        c.fillRect(x0 - 18, y0 - 18, 18, th + 36)
        c.fillRect(x1, y0 - 18, 18, th + 36)
      }
      if (L.hex) {
        c.fillStyle = '#6f7480'
        c.fillRect((x0 + x1) / 2 - 110, y0 - 4, 220, th + 8)
      }
      c.strokeStyle = 'rgba(0,0,0,0.35)'
      c.lineWidth = 2
      c.strokeRect(x0, y0, x1 - x0, th)
      line(c, games.board.step[i], w - 40, 90, 46, { color: '#aebbe8', align: 'right', maxW: w * 0.4 })
      const name = L.skin ? mat.gilded : mat[L.body === 'bronze' && game === 5 ? 'bronze24' : L.body]
      line(c, name, w / 2, y0 + th + 80, 56, { color: '#ffffff', maxW: w - 80 })
      const gram = game === 5 ? [PARIS.gold, PARIS.silver, PARIS.bronze][i] : null
      const bits = []
      if (gram) bits.push(`${gram} g`)
      if (L.skin) bits.push(at(mat.skin, lv))
      if (L.hex) bits.push(mat.hex)
      line(c, bits.join('   '), w / 2, y0 + th + 135, 40, { color: '#ffd166', maxW: w - 80, weight: 600 })
      wrap(c, at(row.what, lv), 50, y0 + th + 215, w - 100, 50, 64, { color: '#c9d4ff', maxH: h - (y0 + th + 215) - 10 })
    }
    bd.tex.needsUpdate = true
  }
  const gamesPanel = lv => ({
    title: games.title,
    color: GOLD,
    blocks: [
      {
        slider: {
          label: games.slider,
          min: 0,
          max: 5,
          step: 1,
          value: game,
          onInput: v => gamesStep('game', v),
          format: v => games.years[Math.round(v)],
          live: () => game,
        },
      },
      { buttons: [0, 1, 2].map(i => ({ label: games.buttons[i], onClick: () => gamesStep('step', i) })) },
      ...paras(games.panel, lv),
    ],
  })
  let gSending = false
  const gamesChanged = () => {
    gamesMine = true
    ex.discover('games', gamesPanel, 3)
    share('games')
  }
  function gamesStep(step, v) {
    const lv = level()
    if (step === 'game') {
      const g = clamp(Math.round(Number(v)), 0, 5)
      if (g === game) return
      game = g
      sel = -1
      applyGame()
      play('tap')
      say(at(games.rows[game].what, lv))
      gamesMine = true
      ex.discover('games', gamesPanel, 3)
      if (gSending) return
      gSending = true
      later(0.3, () => {
        gSending = false
        share('games')
      })
      return
    } else if (step === 'step') {
      const i = clamp(Math.round(Number(v)), 0, 2)
      sel = sel === i ? -1 : i
      play(lookAt(game, i) ? 'select' : 'tap')
      say(at(lookAt(game, i) ? games.says.step[i] : games.says.none, lv))
    } else return
    gamesChanged()
  }
  ex.add({
    id: 'games',
    x: 0,
    z: -4.9,
    radius: 2.8,
    manual: true,
    label: games.label,
    verb: () => (sel < 0 ? games.hints.tap : games.hints.slide),
    focus: focusOf(PD.x, 1.7, PD.z, 4.1, 4.2),
    act: () => ctx.showPanel(gamesPanel),
  })
  steps.forEach((s, i) => {
    const h = hit(1.5, s.h + 1.0, 1.2, 0, (s.h + 1.0) / 2, 0, s.grp)
    clickable(h, () => gamesStep('step', i), { reach: 8 })
  })
  clickable(bd.group, () => gamesStep('step', sel < 0 ? 0 : sel), { reach: 8, when: () => false })
  applyGame()
  updates.push((dt, t) => {
    const lv = level()
    steps.forEach((s, i) => {
      s.lift = damp(s.lift, sel === i ? 1 : 0, 5, dt)
      s.stand.position.y = s.y0 + 0.28 * ease(s.lift)
      s.medal.group.rotation.y = sel === i ? Math.sin(t * 1.4) * 0.55 : Math.sin(t * 0.5 + i) * 0.08
    })
    const key = `${lv}|${game}|${sel}`
    if (key !== boardKey) {
      boardKey = key
      drawBoard(lv, game, sel)
    }
  })

  updates.push((dt, t) => stage.update(t))

  const fall = (x, z, rx) => ({ x, z, rx })
  void fall
  return {
    env: stage.env,
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, minX: -14.5, maxX: 14.5, maxZ: 11.4 },
    cameraPitchMax: 0.4,
    spawn: { x: 0, z: 8.2, yaw: 0 },
    hostSpot: { x: 2.2, z: 6.2, yaw: Math.atan2(-2.2, -6.2) },
    back: { x: 0, z: 12.4, rot: Math.PI },
    // the easel off the stations' lines of sight
    stand: { x: 3.4, z: 4.4, rot: Math.atan2(-3.4, 3.8) },
    parts: {
      under: {
        tap: step => underStep(step), // 'corner' | 'balance' | 'hex'
        get peeled() {
          return peeled
        },
        get weighed() {
          return weighed
        },
        get hex() {
          return hexShown
        },
      },
      gild: {
        tap: (step, v) => gildStep(step, v), // 'blank' | 'switch' | 'clips' | 'fresh' | 'amps'
        get state() {
          const c = cur()
          return { inBath: G.inBath, pol: G.pol, on: G.on, amps: G.amps, gold: c.g, lost: c.l }
        },
      },
      games: {
        tap: i => gamesStep('step', i),
        year: i => gamesStep('game', i),
        get state() {
          return { game, sel }
        },
      },
      at: {
        corner: () => world(mainMedal.group).add(mainMedal.cornerAt().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.22)),
        hex: () => world(mainMedal.hex),
        balance: () => new THREE.Vector3(U.bx, 1.1, U.z + 0.5),
        blank: () => world(blank),
        switch: () => new THREE.Vector3(SUP.x + 0.2, BX.h + 0.25, SUP.z + 0.29),
        clips: () => new THREE.Vector3(TK.x + TK.w / 2 + 0.12, BAR_Y, TK.z + 0.1),
        step: i => new THREE.Vector3(steps[i].x, steps[i].h, PD.z + 0.3),
      },
      rayTo,
    },
    panels: { under: underPanel, gild: gildPanel, games: gamesPanel },
    shared: {
      under: {
        get: () => ({ peeled, weighed, hex: hexShown }),
        set: s => {
          peeled = !!s?.peeled
          weighed = !!s?.weighed
          hexShown = !!s?.hex
          underMine = false
        },
      },
      gild: {
        get: () => ({ ...G }),
        set: s => {
          G.inBath = !!s?.inBath
          G.pol = s?.pol === 'anode' ? 'anode' : 'cath'
          G.on = !!s?.on && G.inBath
          G.amps = clamp(Math.round((Number(s?.amps) || AMPS.start) * 10) / 10, AMPS.min, AMPS.max)
          G.g0 = clamp(Number(s?.g0) || 0, 0, GMAX)
          G.l0 = clamp(Number(s?.l0) || 0, 0, 80)
          G.s0 = Math.max(0, Number(s?.s0) || 0)
          G.since = G.on ? Number(s?.since) || Date.now() : 0
          gildMine = false
        },
      },
      games: {
        get: () => ({ game, sel }),
        set: s => {
          game = clamp(Math.round(Number(s?.game) || 0), 0, 5)
          sel = clamp(Math.round(Number(s?.sel ?? -1)), -1, 2)
          applyGame()
          gamesMine = false
        },
      },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const d of disposers) d()
      void gamesMine
      void underMine
    },
  }
}
