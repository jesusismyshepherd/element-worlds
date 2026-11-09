// Germanium's picture "Can you predict a new element?" as a room (docs/knowledge/picture-rooms.md): the
// picture made into two places in one hall (stages/study.js). West, Dmitri Mendeleev's study in St Petersburg on
// a winter night about 1870: a tiled stove, bookcases, the frozen Neva behind the windows, oil lamps. East, behind
// a glazed screen marked with a year, Clemens Winkler's bench at the Freiberg Bergakademie in the evening of 1886,
// by gaslight. Three things to do, each step chosen by tapping its thing (the user, 2026-10-30: pressing E through
// fixed steps felt passive); the prompt names the next tap, E opens the station's panel, whose buttons and slider
// do the same:
// - The patience game (the picture's wall of cards): the heap on a baize table, 27 cards of the elements known in
//   1871 that the wall has room for (hydrogen to iodine, the main families, as the picture draws them). Tap the
//   heap: the next card, in order of atomic weight, flies to the column its behaviour gives it (arsenic under
//   phosphorus, iodine under bromine and tellurium before it: weight is not the order); the places Mendeleev
//   left empty glow when all are dealt, under aluminium and under silicon. A slider deals any number.
// - Predict it (the gap and its neighbours): silicon above, tin below, arsenic beside the empty card. Tap each
//   neighbour and a coin carries its weight and density to the ledger on the writing table; then the quill
//   writes the prediction line by line on the empty card (weight 72, density 5.5, a high melting point, dirty
//   grey, the dioxide's density 4.7, the chloride that boils below 100 C and weighs 1.9).
// - Winkler's bench (the picture's argyrodite): tap the lump (ground in a mortar), the silver dish, the sulfur dish:
//   the chart on the wall climbs to about 93 of 100 and the rest glows; tap the gap: germanium sulfide, a grey
//   bead, and the board compares the prediction with what he found. A year slider and the three cards of the
//   rail: gallium 1875, scandium 1879, germanium 1886.
// All three are shared in a room (src/net/shared.js); the words, panels and discoveries stay each one's.
// parts.<station>.tap(...) does what a tap does, for the probes. Facts and sources: predicted.words.js.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { canvasTex, at, clamp, damp, fill, num, random } from '../../../wings/noble/kit.js'
import { studyStage } from '../../stages/study.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { element, nameOf } from '../../../../data/elements.js'
import { PREDICTED_WORDS } from './predicted.words.js'

export const WORDS = PREDICTED_WORDS

const TAU = Math.PI * 2
const ROOM = { x0: -9.4, x1: 9.4, z0: -4.6, z1: 4.6, h: 4.2 }
const WALL = ROOM.z0 + 0.06 // the plane the cards hang on
const ghost = new THREE.MeshBasicMaterial({ visible: false })
const V = (x, y, z) => new THREE.Vector3(x, y, z)
const mix = (a, b, k) => new THREE.Color(a).lerp(new THREE.Color(b), k).getStyle()

// ---- the cards: the elements Mendeleev's wall has room for, in their columns (Roman numerals) and rows ----
const CPK = {
  H: '#e8ecf4', Li: '#cc80ff', Be: '#b0e000', B: '#ffb5b5', C: '#7a808c', N: '#3050f8', O: '#ff3030', F: '#90e050',
  Na: '#ab5cf2', Mg: '#8ae000', Al: '#bfa6a6', Si: '#f0c8a0', P: '#ff8000', S: '#f4e030', Cl: '#1ff01f', K: '#8f40d4',
  Ca: '#3ddc2a', As: '#bd80e3', Se: '#ffa100', Br: '#c03a3a', Rb: '#702eb0', Sr: '#00d000', In: '#a67573', Sn: '#8f9aa8',
  Sb: '#9e63b5', Te: '#d47a00', I: '#a020a0', Ga: '#c28f8f', Ge: '#6fa4a0', Sc: '#e6e6e6',
}
const PLACE = {
  H: [0, 0],
  Li: [1, 0], Be: [1, 1], B: [1, 2], C: [1, 3], N: [1, 4], O: [1, 5], F: [1, 6],
  Na: [2, 0], Mg: [2, 1], Al: [2, 2], Si: [2, 3], P: [2, 4], S: [2, 5], Cl: [2, 6],
  K: [3, 0], Ca: [3, 1], As: [3, 4], Se: [3, 5], Br: [3, 6],
  Rb: [4, 0], Sr: [4, 1], In: [4, 2], Sn: [4, 3], Sb: [4, 4], Te: [4, 5], I: [4, 6],
}
const CARDS = Object.keys(PLACE)
  .map(sym => ({ sym, el: element(sym), row: PLACE[sym][0], col: PLACE[sym][1], color: CPK[sym] }))
  .sort((a, b) => a.el.mass - b.el.mass)
const N = CARDS.length // 27
const I_AS = CARDS.findIndex(c => c.sym === 'As')
const I_I = CARDS.findIndex(c => c.sym === 'I')
const GAP_AL = { row: 3, col: 2 } // eka-aluminium, under aluminium
const GAP_SI = { row: 3, col: 3 } // eka-silicon, under silicon
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

// the wall's board
const BX = -5.4
const PITCH = [0.64, 0.56]
const CARD = [0.56, 0.5]
const slotAt = (row, col) => V(BX + (col - 3) * PITCH[0], 3.02 - row * PITCH[1], WALL + 0.02)
// the heap on the baize table
const HEAP = V(-2.2, 0.83, -3.3)
// station 2's cross of cards
const CX = 1.2
const CY = 2.3
const NEIGH = {
  si: { sym: 'Si', x: CX, y: 3.68 },
  as: { sym: 'As', x: CX + 1.3, y: CY },
  sn: { sym: 'Sn', x: CX, y: 0.98 },
}
const PRED_W = 1.5
const PRED_H = 1.75
const LEDGER = V(1.15, 1.2, -3.42)
// station 3
const BT = 0.92 // the bench top
const BZ = -4.05
const IZ = BZ + 0.2 // the line the apparatus stands on
const DISH = { ag: 7.2, s: 7.85, ge: 8.5 }
const MORTAR_X = 6.3
const AG_PCT = 76.5 // Ag8GeS6 by formula: 862.96 / 1127.95 g/mol
const S_PCT = 17.05
const GE_PCT = 100 - AG_PCT - S_PCT // 6.45
const YEARS = [1869, 1886]
const FOUND = [
  { sym: 'Ga', year: 1875, eka: 0 },
  { sym: 'Sc', year: 1879, eka: 1 },
  { sym: 'Ge', year: 1886, eka: 2 },
]

// ---- drawing ----
const rr = (g, x, y, w, h, r) => {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}
const ball = (g, cx, cy, r, c) => {
  const grd = g.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.05, cx, cy, r)
  grd.addColorStop(0, mix(c, '#ffffff', 0.7))
  grd.addColorStop(0.35, c)
  grd.addColorStop(0.85, mix(c, '#000000', 0.45))
  grd.addColorStop(1, mix(c, '#000000', 0.65))
  g.fillStyle = grd
  g.beginPath()
  g.arc(cx, cy, r, 0, TAU)
  g.fill()
}
const CW = 192
const CH = 172
const COLS = 6
/** One card's face: dark violet, an amber edge, the element's ball, its symbol and weight. */
function drawCard(g, x, y, c, lang) {
  const grd = g.createLinearGradient(0, y, 0, y + CH)
  grd.addColorStop(0, '#3a3048')
  grd.addColorStop(1, '#241e34')
  rr(g, x + 5, y + 5, CW - 10, CH - 10, 14)
  g.fillStyle = grd
  g.fill()
  g.strokeStyle = '#b8863c'
  g.lineWidth = 4
  g.stroke()
  ball(g, x + CW / 2, y + 66, 38, c.color)
  g.fillStyle = '#ffffff'
  g.font = '700 44px Outfit, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(c.sym, x + CW / 2, y + 140)
  g.fillStyle = '#e8c98a'
  g.font = '700 22px Outfit, sans-serif'
  g.textAlign = 'right'
  g.fillText(num(c.el.mass, c.el.mass < 10 ? 2 : 1, lang), x + CW - 16, y + 26)
}
/** An empty card: a dashed glowing edge and a ghost of the ball that is missing. */
function drawGap(g, x, y, c, text) {
  rr(g, x + 5, y + 5, CW - 10, CH - 10, 14)
  g.fillStyle = 'rgba(40,30,20,0.55)'
  g.fill()
  g.setLineDash([16, 10])
  g.strokeStyle = '#ffb347'
  g.lineWidth = 6
  g.stroke()
  g.setLineDash([])
  g.globalAlpha = 0.4
  ball(g, x + CW / 2, y + 66, 38, c)
  g.globalAlpha = 1
  g.fillStyle = '#ffd9a0'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  let size = 30
  g.font = `700 ${size}px Outfit, sans-serif`
  while (g.measureText(text).width > CW - 30 && size > 12) {
    size -= 1
    g.font = `700 ${size}px Outfit, sans-serif`
  }
  g.fillText(text, x + CW / 2, y + 140)
}

/** A flat card face: a plane with the atlas cell `i` of `rows` rows. */
function cellGeometry(i, rows, w, h) {
  const g = new THREE.PlaneGeometry(w, h)
  const uv = g.attributes.uv
  const col = i % COLS
  const row = Math.floor(i / COLS)
  for (let k = 0; k < uv.count; k++) uv.setXY(k, (col + uv.getX(k)) / COLS, 1 - (row + 1 - uv.getY(k)) / rows)
  return g
}

/** A drawn metal ball for germanium (a dark grey mirror, as the hall's showpiece). */
function metalCap(light) {
  return canvasTex(128, 128, g => {
    const base = g.createLinearGradient(0, 0, 0, 128)
    for (const [o, c] of [[0, '#8a9098'], [0.35, '#5a6068'], [0.65, '#34383e'], [1, '#1a1c20']]) base.addColorStop(o, c)
    g.fillStyle = base
    g.fillRect(0, 0, 128, 128)
    const w = g.createRadialGradient(42, 36, 0, 42, 36, 18)
    w.addColorStop(0, 'rgba(245,247,250,0.9)')
    w.addColorStop(1, 'rgba(200,204,212,0)')
    g.fillStyle = w
    g.fillRect(0, 0, 128, 128)
  })
}

export async function build({ ctx, root, el, lang, E, ex, say: speak, later, light, color, level, depth, clickable }) {
  const textures = []
  const tex = t => (textures.push(t), t)
  const geos = []
  const geo = g => (geos.push(g), g)
  const share = id => ctx.share?.(id)
  const lv = () => level()
  const dp = () => depth(level())
  const T = (key, vars) => fill(at(key, lv()), vars)
  const wall = () => Date.now() / 1000
  const updates = []
  const nm = sym => nameOf(element(sym), lang)

  // ---- the stage: Mendeleev's study and Winkler's bench ----
  const stage = studyStage({
    light,
    windows: [
      { side: 'w', at: -1.0, view: 'neva' },
      { side: 's', at: -6.4, view: 'neva' },
      { side: 's', at: -3.6, view: 'neva' },
      { side: 's', at: 7.0, view: 'freiberg', width: 1.6 },
      { side: 'e', at: 3.6, view: 'freiberg' },
    ],
    bookcases: [
      { side: 'w', at: 1.6, width: 1.7 },
      { side: 'w', at: -3.1, width: 1.7 },
      { side: 's', at: 2.9, width: 1.3 },
    ],
    rugs: [
      { x: -5.2, z: -0.9, w: 6.6, d: 4.1 },
      { x: 1.2, z: -2.2, w: 3.4, d: 2.1 },
    ],
    stove: { x: -8.7, z: 3.7, rot: 0 },
  })
  root.add(stage.group)
  const solids = stage.solids
  const M = stage.mats
  const mesh = (g, m, x = 0, y = 0, z = 0, parent = root) => {
    const o = new THREE.Mesh(g, m)
    o.position.set(x, y, z)
    parent.add(o)
    return o
  }
  const std = (c, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, ...extra })
  const text = (s, size, c = '#ffffff', opts = {}) => makeText(s, { size, color: c, ...opts })
  /** A canvas-lit board: a frame, a face drawn on a canvas (`draw(g, w, h)` again with `redraw`). */
  function board(w, h, pw, ph, draw, { frame = '#ffb347', glow = 0.7 } = {}) {
    const group = new THREE.Group()
    const t = tex(canvasTex(pw, ph, draw))
    const edge = mesh(geo(new RoundedBoxGeometry(w + 0.1, h + 0.1, 0.05, 2, 0.02)), new THREE.MeshStandardMaterial({ color: frame, emissive: frame, emissiveIntensity: glow, roughness: 0.4 }), 0, 0, 0, group)
    const face = mesh(geo(new THREE.PlaneGeometry(w, h)), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), 0, 0, 0.03, group)
    return { group, tex: t, face, edge, redraw: fn => t.userData.redraw(fn ?? draw) }
  }
  const onFace = (group, x, y, z, ry = 0) => {
    group.position.set(x, y, z)
    group.rotation.y = ry
    root.add(group)
  }

  // the signs over the screen's opening, one on each face
  {
    const lintelY = 3.45
    const west = text(E.signs.freiberg, 0.3, '#ffe2b0', { maxWidth: 3.2 })
    west.position.set(ROOM.x0 + (stage.annex - ROOM.x0) - 0.14, lintelY, 0)
    west.rotation.y = -Math.PI / 2
    const east = text(E.signs.petersburg, 0.26, '#cfe0ff', { maxWidth: 3.2 })
    east.position.set(stage.annex + 0.14, lintelY, 0)
    east.rotation.y = Math.PI / 2
    root.add(west, east)
  }

  // =============================================================================================
  // 1. The patience game
  // =============================================================================================
  const S1 = { n: 0 }
  const atlasRows = Math.ceil((N + 2) / COLS)
  const atlas = tex(canvasTex(CW * COLS, CH * atlasRows, (g, w, h) => {
    CARDS.forEach((c, i) => drawCard(g, (i % COLS) * CW, Math.floor(i / COLS) * CH, c, lang))
    drawGap(g, (N % COLS) * CW, Math.floor(N / COLS) * CH, mix(CPK.Ga, '#ffffff', 0), E.signs.ekaAl)
    drawGap(g, ((N + 1) % COLS) * CW, Math.floor((N + 1) / COLS) * CH, CPK.Ge, E.signs.ekaSi)
  }))
  const cardMat = new THREE.MeshStandardMaterial({ map: atlas, emissiveMap: atlas, emissive: '#ffffff', emissiveIntensity: 0.42, roughness: 0.7 })
  const gapMat = (extra = 0) => new THREE.MeshBasicMaterial({ map: atlas, transparent: true, opacity: 0, toneMapped: false, color: new THREE.Color(1 + extra, 1 + extra, 1 + extra) })

  // the board: a walnut frame, a dark green baize, the columns' numerals, the title above
  const b1 = new THREE.Group()
  {
    const w = 7 * PITCH[0] + 0.4
    const h = 3.4
    mesh(geo(new RoundedBoxGeometry(w + 0.14, h + 0.14, 0.06, 2, 0.02)), std('#6a4a2a', { roughness: 0.5 }), 0, 0, 0, b1)
    mesh(geo(new THREE.PlaneGeometry(w, h)), std('#2a5240', { roughness: 0.95 }), 0, 0, 0.032, b1)
    for (let c = 0; c < 7; c++) {
      const t = text(ROMAN[c], 0.17, '#ffcf8a')
      t.position.set((c - 3) * PITCH[0], 1.4, 0.04)
      b1.add(t)
    }
    const title = text(E.signs.board, 0.12, '#e8d6b0', { maxWidth: w })
    title.position.set(0, 1.62 - 0.0, 0.04)
    b1.add(title)
    b1.position.set(BX, 2.2, ROOM.z0 + 0.04)
    root.add(b1)
    // a brass picture light on the wall above
    const arm = mesh(geo(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8)), M.brass, BX, 4.0, ROOM.z0 + 0.28)
    arm.rotation.x = Math.PI / 2
    mesh(geo(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 20, 1, true)), M.brass, BX, 3.98, ROOM.z0 + 0.5)
    const pl = new THREE.PointLight('#ffc888', light ? 3 : 4.2, 9, 1.4)
    pl.position.set(BX, 3.5, ROOM.z0 + 1.7)
    root.add(pl)
  }
  const cardsG = new THREE.Group()
  root.add(cardsG)
  const cards = CARDS.map((c, i) => {
    const m = new THREE.Mesh(geo(cellGeometry(i, atlasRows, CARD[0], CARD[1])), cardMat)
    m.userData.i = i
    cardsG.add(m)
    const rnd = random(i * 13 + 5)
    return { m, p: 0, slot: slotAt(c.row, c.col), jx: (rnd() - 0.5) * 0.12, jz: (rnd() - 0.5) * 0.1, jr: (rnd() - 0.5) * 1.4 }
  })
  const heapAt = i => V(HEAP.x + cards[i].jx, HEAP.y + (N - i) * 0.004, HEAP.z + cards[i].jz)
  const gaps = [
    { cell: GAP_AL, i: N, m: null, k: 0 },
    { cell: GAP_SI, i: N + 1, m: null, k: 0 },
  ]
  for (const gp of gaps) {
    gp.mat = gapMat()
    gp.m = mesh(geo(cellGeometry(gp.i, atlasRows, CARD[0], CARD[1])), gp.mat, 0, 0, 0, root)
    const s = slotAt(gp.cell.row, gp.cell.col)
    gp.m.position.copy(s)
    gp.m.visible = false
  }
  const gapHit = gaps.map(gp => {
    const h = mesh(geo(new THREE.PlaneGeometry(CARD[0] + 0.1, CARD[1] + 0.1)), ghost, gp.m.position.x, gp.m.position.y, gp.m.position.z + 0.02)
    return h
  })
  let gapTold = false
  // the heap's table
  {
    mesh(geo(new THREE.CylinderGeometry(0.58, 0.58, 0.05, 28)), M.wood, HEAP.x, 0.78, HEAP.z)
    mesh(geo(new THREE.CylinderGeometry(0.5, 0.5, 0.012, 28)), M.cloth, HEAP.x, 0.81, HEAP.z)
    mesh(geo(new THREE.CylinderGeometry(0.06, 0.1, 0.76, 12)), M.wood, HEAP.x, 0.38, HEAP.z)
    mesh(geo(new THREE.CylinderGeometry(0.3, 0.34, 0.05, 20)), M.wood, HEAP.x, 0.025, HEAP.z)
    solids.push(circle(HEAP.x, HEAP.z, 0.62))
    stage.oilLamp(HEAP.x + 0.25, 0.81, HEAP.z - 0.38, { glow: light ? 1.6 : 2.2, reach: 6, shade: true })
  }
  const heapHit = mesh(geo(new THREE.CylinderGeometry(0.36, 0.36, 0.34, 14)), ghost, HEAP.x, 0.96, HEAP.z)

  const ease3 = v => v * v * (3 - 2 * v)
  function placeCard(i) {
    const c = cards[i]
    const e = ease3(c.p)
    const a = heapAt(i)
    const b = c.slot
    c.m.position.lerpVectors(a, b, e)
    c.m.position.y += Math.sin(Math.PI * e) * 0.9
    const s = 0.34 + 0.66 * e
    c.m.scale.setScalar(s)
    c.m.rotation.set(-Math.PI / 2 * (1 - e), c.jr * (1 - e), 0)
    c.m.visible = true
  }
  cards.forEach((_, i) => placeCard(i))

  function lineFor(prev, next) {
    if (next >= N) return 'done'
    if (prev < I_I + 1 && next >= I_I + 1) return 'swap'
    if (prev < I_AS + 1 && next >= I_AS + 1) return 'skip'
    if (prev === 0 && next >= 1) return 'first'
    return null
  }
  function setN(v, { now = false } = {}) {
    const n = clamp(Math.round(Number(v) || 0), 0, N)
    if (n === S1.n) return
    const prev = S1.n
    S1.n = n
    if (n < N) gapTold = false
    if (now) {
      play(n === N ? 'discover' : 'tap')
      const k = lineFor(prev, n)
      if (k) speak(T(E.s1.says[k]))
      if (prev === 0 && n > 0) ex.discover('patience', panel1, 6)
      share('cards')
    }
  }
  const deal = () => setN(S1.n + 1, { now: true })
  clickable(heapHit, deal, { when: () => S1.n < N, reach: 6 })
  clickable(cardsG, hit => {
    const c = CARDS[hit.object.userData.i]
    speak(T(E.s1.says.card, { name: nm(c.sym), w: num(c.el.mass, 1, lang), col: ROMAN[c.col] }))
    play('tap')
  }, { when: () => S1.n > 0, accept: h => h.object.userData.i != null && cards[h.object.userData.i].p > 0.97, reach: 8 })
  function gapTap(which) {
    if (S1.n < N) return
    play('select')
    if (which === 'si') {
      gapTold = true
      speak(T(E.s1.says.gapSi))
      ex.discover('patience', panel1, 6)
    } else speak(T(E.s1.says.gapAl))
  }
  clickable(gapHit[1], () => gapTap('si'), { when: () => S1.n >= N, reach: 8 })
  clickable(gapHit[0], () => gapTap('al'), { when: () => S1.n >= N, reach: 8 })
  function panel1(l) {
    return {
      title: E.s1.title,
      color,
      blocks: [
        { slider: { label: E.s1.slider, min: 0, max: N, step: 1, value: S1.n, onInput: v => setN(v, { now: true }), format: v => fill(E.s1.sliderFmt, { n: Math.round(v), total: N }), live: () => S1.n } },
        {
          buttons: [
            { label: E.s1.buttons.deal, onClick: () => deal() },
            { label: E.s1.buttons.gap, onClick: () => gapTap('si') },
            { label: E.s1.buttons.reset, onClick: () => setN(0, { now: true }) },
          ],
        },
        ...E.s1.panel[depth(l)].map(p => ({ p })),
      ],
    }
  }
  ex.add({
    id: 'patience',
    x: -5.0,
    z: -1.1,
    radius: 2.9,
    manual: true,
    label: E.s1.label,
    verb: () => {
      const H = E.s1.hints
      if (S1.n === 0) return H.start
      if (S1.n < N) return H.more
      return gapTold ? H.done : H.gap
    },
    focus: { x: BX, y: 2.0, z: ROOM.z0, size: 3.5, width: 5.2 },
    act: () => ctx.showPanel(panel1),
  })
  const cardsState = () => ({ n: S1.n })
  const cardsSet = (s, liveSet) => {
    const n = clamp(Math.round(Number(s?.n) || 0), 0, N)
    if (liveSet && n !== S1.n) play(n === N ? 'discover' : 'tap')
    S1.n = n
    if (n < N) gapTold = false
    if (!liveSet) cards.forEach((c, i) => (c.p = i < n ? 1 : 0))
  }
  updates.push((dt, t) => {
    cards.forEach((c, i) => {
      const target = i < S1.n ? 1 : 0
      if (c.p === target) return
      c.p += clamp(target - c.p, -dt * 1.15, dt * 1.15)
      if (Math.abs(target - c.p) < 0.002) c.p = target
      placeCard(i)
    })
    gaps.forEach((gp, k) => {
      const want = S1.n > I_AS ? 1 : 0
      gp.k = damp(gp.k, want, 3, dt)
      gp.m.visible = gp.k > 0.02
      const pulse = S1.n >= N ? 0.5 + 0.5 * Math.sin(t * 3 + k) : 0
      gp.mat.opacity = gp.k * (S1.n >= N ? 1 : 0.65)
      gp.mat.color.setScalar(1 + pulse * 0.8)
    })
  })

  // =============================================================================================
  // 2. Predict it
  // =============================================================================================
  const S2 = { c: 0, l: 0 } // c: bits 1 Si, 2 As, 4 Sn (coins dropped); l: lines written
  const NEIGH_BIT = { si: 1, as: 2, sn: 4 }
  let landed = 0 // coins that reached the ledger
  let lineAge = 1 // seconds since the newest line began
  const LINES = E.s2.card.rows.length
  // the wall: the neighbours of the gap
  const b2 = new THREE.Group()
  mesh(geo(new THREE.PlaneGeometry(4.5, 3.65)), std('#1c2a24', { roughness: 0.95 }), CX + 0.35, 2.3, WALL - 0.03, b2)
  b2.position.set(0, 0, 0)
  root.add(b2)
  const neighMeshes = {}
  for (const [id, nb] of Object.entries(NEIGH)) {
    const i = CARDS.findIndex(c => c.sym === nb.sym)
    const m = mesh(geo(cellGeometry(i, atlasRows, 0.7, 0.625)), cardMat, nb.x, nb.y, WALL + 0.02, b2)
    m.userData.id = id
    neighMeshes[id] = m
    // a glow behind the card until its coin is taken
    const halo = mesh(geo(new THREE.PlaneGeometry(0.86, 0.78)), new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }), nb.x, nb.y, WALL + 0.012, b2)
    m.userData.halo = halo
  }
  // the left neighbour: another gap, eka-aluminium, faint
  {
    const m = mesh(geo(cellGeometry(N, atlasRows, 0.7, 0.625)), new THREE.MeshBasicMaterial({ map: atlas, transparent: true, opacity: 0.55, toneMapped: false }), CX - 1.3, CY, WALL + 0.02, b2)
    m.userData.faint = true
  }
  // the arrows into the gap
  const arrowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb347').multiplyScalar(1.3), side: THREE.DoubleSide })
  const arrow = (x, y, rot) => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.12)
    s.lineTo(0.13, -0.06)
    s.lineTo(0.04, -0.06)
    s.lineTo(0.04, -0.2)
    s.lineTo(-0.04, -0.2)
    s.lineTo(-0.04, -0.06)
    s.lineTo(-0.13, -0.06)
    s.closePath()
    const a = mesh(geo(new THREE.ShapeGeometry(s)), arrowMat, x, y, WALL + 0.025, b2)
    a.rotation.z = rot
  }
  arrow(CX, 3.1 - 0.0, Math.PI) // from silicon down into the gap
  arrow(CX, 1.5, 0) // from tin up
  arrow(CX + 0.9, CY, Math.PI / 2) // from arsenic in
  // the prediction card: an empty card that fills line by line as the quill writes
  const pred = board(PRED_W, PRED_H, 384, 448, (g, w, h) => drawPrediction(g, w, h), { frame: '#ffb347', glow: 0.9 })
  onFace(pred.group, CX, CY, WALL + 0.03)
  function drawPrediction(g, w, h) {
    const P = E.s2.card
    g.clearRect(0, 0, w, h)
    rr(g, 6, 6, w - 12, h - 12, 18)
    g.fillStyle = '#2a2236'
    g.fill()
    g.setLineDash([22, 12])
    g.strokeStyle = '#ffb347'
    g.lineWidth = 7
    g.stroke()
    g.setLineDash([])
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#ffd9a0'
    g.font = '700 38px Outfit, sans-serif'
    g.fillText(P.head, w / 2, 50)
    g.globalAlpha = 0.32
    ball(g, w / 2, 126, 42, CPK.Ge)
    g.globalAlpha = 1
    g.fillStyle = '#ffffff'
    g.font = '700 30px Outfit, sans-serif'
    g.fillText('?', w / 2, 126)
    const y0 = 184
    const rowH = 33
    for (let i = 0; i < LINES; i++) {
      const a = i < S2.l - 1 ? 1 : i === S2.l - 1 ? Math.min(1, lineAge / 0.9) : 0
      const y = y0 + i * rowH
      if (a <= 0) {
        g.fillStyle = 'rgba(255,217,160,0.16)'
        g.fillRect(36, y + 12, w - 72, 3)
        continue
      }
      g.globalAlpha = a
      g.textAlign = 'left'
      g.fillStyle = '#c8a878'
      g.font = '500 18px Outfit, sans-serif'
      g.fillText(P.rows[i][0], 28, y)
      g.textAlign = 'right'
      g.fillStyle = '#ffffff'
      g.font = '500 18px Outfit, sans-serif'
      const lw = g.measureText(P.rows[i][0]).width
      let size = 22
      g.font = `700 ${size}px Outfit, sans-serif`
      while (g.measureText(P.rows[i][1]).width > w - 56 - lw - 14 && size > 12) {
        size -= 1
        g.font = `700 ${size}px Outfit, sans-serif`
      }
      g.fillText(P.rows[i][1], w - 28, y)
      g.globalAlpha = 1
    }
    if (S2.l >= LINES) {
      g.textAlign = 'center'
      g.fillStyle = '#e8d6b0'
      g.font = '700 24px Outfit, sans-serif'
      g.fillText(P.seal, w / 2, h - 26)
    }
  }
  // the writing table: a desk, an oil lamp, the ledger and the quill
  {
    const dz = -3.5
    mesh(geo(new THREE.BoxGeometry(2.3, 0.07, 1.0)), M.wood, CX, 0.78, dz)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh(geo(new THREE.BoxGeometry(0.08, 0.75, 0.08)), M.wood, CX + sx * 1.05, 0.375, dz + sz * 0.42)
    mesh(geo(new THREE.BoxGeometry(2.1, 0.22, 0.9)), M.trim, CX, 0.62, dz)
    mesh(geo(new THREE.BoxGeometry(2.0, 0.012, 0.86)), M.cloth, CX, 0.82, dz)
    solids.push(box(CX, dz, 2.4, 1.1))
    stage.oilLamp(CX - 0.75, 0.82, dz - 0.18, { glow: light ? 2.6 : 3.6, reach: 10, shade: true })
  }
  // the ledger, standing open on a stand, tilted back
  const ledger = board(1.3, 0.78, 640, 384, (g, w, h) => drawLedger(g, w, h), { frame: '#c49a4c', glow: 0.25 })
  onFace(ledger.group, LEDGER.x + 0.1, LEDGER.y, LEDGER.z, 0)
  ledger.group.rotation.x = -0.5
  function drawLedger(g, w, h) {
    const Lg = E.s2.ledger
    g.fillStyle = '#e8dcc0'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#d6c8a6'
    g.fillRect(w / 2 - 2, 0, 4, h)
    g.textBaseline = 'middle'
    g.fillStyle = '#4a3622'
    g.font = '700 30px Outfit, sans-serif'
    g.textAlign = 'left'
    g.fillText(Lg.head, 28, 36)
    g.font = '700 21px Outfit, sans-serif'
    g.textAlign = 'right'
    g.fillText(Lg.weight, 400, 36)
    g.fillText(Lg.density, 608, 36)
    g.fillStyle = 'rgba(74,54,34,0.4)'
    g.fillRect(24, 62, w - 48, 2)
    const rows = [['si', 'Si'], ['as', 'As'], ['sn', 'Sn']]
    rows.forEach(([id, sym], i) => {
      const y = 100 + i * 58
      if (!(landed & NEIGH_BIT[id])) {
        g.fillStyle = 'rgba(74,54,34,0.2)'
        g.fillRect(70, y + 6, 300, 3)
        return
      }
      const e = element(sym)
      ball(g, 48, y, 17, CPK[sym])
      g.textAlign = 'left'
      g.fillStyle = '#2a1c10'
      g.font = '700 28px Outfit, sans-serif'
      g.fillText(nm(sym), 80, y)
      g.textAlign = 'right'
      g.font = '700 30px Outfit, sans-serif'
      g.fillText(num(e.mass, 1, lang), 400, y)
      g.fillText(num(e.density, 2, lang), 608, y)
    })
    if (landed & 1 && landed & 4) {
      g.fillStyle = 'rgba(74,54,34,0.4)'
      g.fillRect(24, 262, w - 48, 2)
      g.textAlign = 'left'
      g.fillStyle = '#6a4a24'
      g.font = '500 22px Outfit, sans-serif'
      g.fillText(at(Lg.between, lv()), 30, 292)
      g.textAlign = 'right'
      g.font = '700 30px Outfit, sans-serif'
      g.fillText(num((element('Si').mass + element('Sn').mass) / 2, 0, lang), 400, 292)
      g.fillStyle = '#a2481c'
      g.textAlign = 'left'
      g.font = '500 22px Outfit, sans-serif'
      g.fillText(Lg.wrote, 30, 336)
      g.textAlign = 'right'
      g.font = '700 30px Outfit, sans-serif'
      g.fillText('72', 400, 336)
      g.fillText(num(5.5, 1, lang), 608, 336)
    }
  }
  // stand for the ledger and its slope
  mesh(geo(new THREE.BoxGeometry(1.34, 0.04, 0.5)), M.wood, LEDGER.x + 0.1, 0.86, LEDGER.z + 0.05)
  // the inkwell and the quill
  const inkP = V(CX + 0.85, 0.82, -3.3)
  const quill = new THREE.Group()
  {
    mesh(geo(new THREE.CylinderGeometry(0.06, 0.07, 0.07, 14)), M.dark, inkP.x, inkP.y + 0.035, inkP.z)
    mesh(geo(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 14)), M.brass, inkP.x, inkP.y + 0.075, inkP.z)
    const shaft = mesh(geo(new THREE.CylinderGeometry(0.004, 0.006, 0.42, 6)), std('#e8dcc0'), 0, 0.21, 0, quill)
    shaft.name = 'shaft'
    const vane = new THREE.Shape()
    vane.moveTo(0, 0)
    vane.quadraticCurveTo(0.09, 0.12, 0.03, 0.34)
    vane.quadraticCurveTo(-0.02, 0.22, 0, 0)
    mesh(geo(new THREE.ShapeGeometry(vane)), new THREE.MeshStandardMaterial({ color: '#f0ead8', roughness: 0.8, side: THREE.DoubleSide }), 0, 0.1, 0, quill)
    quill.position.set(inkP.x, inkP.y + 0.08, inkP.z)
    quill.rotation.set(0.1, 0, -0.35)
    root.add(quill)
  }
  const quillHit = mesh(geo(new THREE.BoxGeometry(0.34, 0.6, 0.34)), ghost, inkP.x - 0.05, inkP.y + 0.3, inkP.z)
  // the coins carrying the numbers to the ledger
  const coinGeo = geo(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 18))
  const coinMat = new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffb347', emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.9 })
  const flights = []
  function flyCoin(id) {
    const c = mesh(coinGeo, coinMat, 0, 0, 0)
    c.rotation.x = Math.PI / 2
    flights.push({ c, id, t: 0, from: V(NEIGH[id].x, NEIGH[id].y, WALL + 0.2), to: V(LEDGER.x - 0.25 + 0.5 * (id === 'si' ? 0 : id === 'as' ? 0.5 : 1), LEDGER.y + 0.1, LEDGER.z + 0.1) })
  }
  const cardsOf = id => ({ si: 'Si', as: 'As', sn: 'Sn' })[id]
  function neighStep(id, { now = true } = {}) {
    const bit = NEIGH_BIT[id]
    if (S2.c & bit) return false
    S2.c |= bit
    if (now) {
      play('tap')
      flyCoin(id)
      const e = element(cardsOf(id))
      speak(T(E.s2.says[`coin${cardsOf(id)}`], { name: nm(cardsOf(id)), w: num(e.mass, 1, lang), d: num(e.density, 2, lang) }))
      // silicon and tin both taken: what lies halfway
      if ((S2.c & 5) === 5 && bit !== 2) later(3.2, () => speak(T(E.s2.says.between)))
      ex.discover('predict', panel2, 6)
      share('predict')
    }
    return true
  }
  for (const [id, m] of Object.entries(neighMeshes)) clickable(m, () => neighStep(id), { when: () => !(S2.c & NEIGH_BIT[id]), reach: 8 })
  const allCoins = () => (S2.c & 7) === 7
  function writeLine({ now = true } = {}) {
    if (S2.l >= LINES) return false
    if (!allCoins()) {
      if (now) speak(T(E.s2.says.early))
      return false
    }
    S2.l += 1
    lineAge = 0
    if (now) {
      play(S2.l >= LINES ? 'discover' : 'select')
      speak(T(E.s2.says[S2.l >= LINES ? 'done' : `line${S2.l}`]))
      ex.discover('predict', panel2, 6)
      share('predict')
    }
    return true
  }
  clickable(quillHit, () => writeLine(), { when: () => S2.l < LINES, reach: 8 })
  function setLines(v, now = true) {
    const l = clamp(Math.round(Number(v) || 0), 0, LINES)
    if (l === S2.l) return
    if (l > 0 && !allCoins()) {
      for (const id of ['si', 'as', 'sn']) neighStep(id, { now: false })
      landed = 7
    }
    const was = S2.l
    S2.l = l
    lineAge = l > was ? 0 : 1
    if (now) {
      play('select')
      share('predict')
    }
  }
  function resetPredict() {
    S2.c = 0
    S2.l = 0
    landed = 0
    play('select')
    share('predict')
  }
  function panel2(l) {
    return {
      title: E.s2.title,
      color,
      blocks: [
        { slider: { label: E.s2.slider, min: 0, max: LINES, step: 1, value: S2.l, onInput: v => setLines(v), format: v => fill(E.s2.sliderFmt, { n: Math.round(v), total: LINES }), live: () => S2.l } },
        {
          buttons: [
            { label: E.s2.buttons.si, onClick: () => neighStep('si') },
            { label: E.s2.buttons.as, onClick: () => neighStep('as') },
            { label: E.s2.buttons.sn, onClick: () => neighStep('sn') },
            { label: E.s2.buttons.quill, onClick: () => writeLine() },
            { label: E.s2.buttons.reset, onClick: () => resetPredict() },
          ],
        },
        ...E.s2.panel[depth(l)].map(p => ({ p })),
      ],
    }
  }
  ex.add({
    id: 'predict',
    x: CX,
    z: -0.6,
    radius: 2.6,
    manual: true,
    label: E.s2.label,
    verb: () => {
      const H = E.s2.hints
      if (!allCoins()) return H.neigh
      if (S2.l < LINES) return H.quill
      return H.done
    },
    focus: { x: CX + 0.3, y: 2.1, z: ROOM.z0, size: 3.7, width: 4.6 },
    act: () => ctx.showPanel(panel2),
  })
  const predictState = () => ({ c: S2.c, l: S2.l })
  const predictSet = (s, liveSet) => {
    const c = clamp(Math.round(Number(s?.c) || 0), 0, 7)
    const l = clamp(Math.round(Number(s?.l) || 0), 0, LINES)
    if (liveSet) {
      for (const id of ['si', 'as', 'sn']) if (c & NEIGH_BIT[id] && !(S2.c & NEIGH_BIT[id])) (play('tap'), flyCoin(id))
      if (l > S2.l) (play('select'), (lineAge = 0))
    }
    S2.c = c
    S2.l = l
    if (!liveSet) {
      landed = c
      lineAge = 1
    }
  }
  let ledgerLv = null
  let predDrawn = ''
  updates.push((dt, t) => {
    // coins in flight
    for (let i = flights.length - 1; i >= 0; i--) {
      const f = flights[i]
      f.t += dt / 0.9
      const e = Math.min(1, f.t)
      f.c.position.lerpVectors(f.from, f.to, e * e * (3 - 2 * e))
      f.c.position.y += Math.sin(Math.PI * e) * 0.6
      f.c.rotation.z += dt * 9
      if (f.t >= 1) {
        landed |= NEIGH_BIT[f.id]
        f.c.parent.remove(f.c)
        flights.splice(i, 1)
        play('tap')
      }
    }
    // the quill bobs while it writes, the halos pulse until a coin is taken
    lineAge += dt
    const writing = lineAge < 0.9
    quill.rotation.z = -0.35 + (writing ? Math.sin(t * 22) * 0.12 : 0)
    quill.rotation.x = 0.1 + (writing ? Math.cos(t * 17) * 0.06 : 0)
    for (const m of Object.values(neighMeshes)) {
      const free = !(S2.c & NEIGH_BIT[m.userData.id])
      m.userData.halo.visible = free
      m.userData.halo.material.opacity = 0.25 + 0.2 * Math.sin(t * 3)
    }
    const key = `${S2.l}|${S2.c === 7 ? 1 : 0}|${Math.floor(Math.min(lineAge, 1) * 10)}|${lv()}`
    if (key !== predDrawn) {
      predDrawn = key
      pred.redraw()
    }
    const lk = `${landed}|${lv()}`
    if (ledgerLv !== lk) {
      ledgerLv = lk
      ledger.redraw()
    }
  })

  // =============================================================================================
  // 3. Winkler's bench: the missing seven per cent
  // =============================================================================================
  const S3 = { g: 0, ag: 0, s: 0, ge: 0, year: 1869 } // g: ground; ag, s: dishes done; ge: 0 none, 1 sulfide, 2 bead
  const K3 = { g: 0, ag: 0, s: 0, ge: 0, gs: 0, cmp: 0, year: 1869 }
  // the bench
  {
    mesh(geo(new THREE.BoxGeometry(4.5, 0.07, 1.0)), M.oak, 6.95, BT - 0.035, BZ)
    mesh(geo(new THREE.BoxGeometry(4.4, 0.85, 0.9)), M.wood, 6.95, 0.425, BZ)
    for (let i = 0; i < 4; i++) mesh(geo(new THREE.BoxGeometry(1.0, 0.7, 0.02)), M.trim, 5.6 + i * 1.12, 0.45, BZ + 0.46)
    solids.push(box(6.95, BZ, 4.6, 1.05))
    stage.gasLamp(stage.annex + 0.2, 3.3, -3.4, { glow: light ? 2.4 : 3.2, reach: 9 })
    stage.gasLamp(ROOM.x1 - 0.05, 3.3, -2.6, { glow: light ? 2.0 : 2.6, reach: 9 }).rotation.y = Math.PI
  }
  const porcelain = std('#e8e6dc', { roughness: 0.25 })
  const dishGeo = geo(new THREE.LatheGeometry([[0, 0.012], [0.07, 0.012], [0.1, 0.03], [0.115, 0.045], [0.11, 0.045], [0.095, 0.03], [0.065, 0.02], [0, 0.02]].map(([x, y]) => new THREE.Vector2(x, y)), 24))
  const dishes = {}
  for (const [id, x] of Object.entries(DISH)) {
    dishes[id] = mesh(dishGeo, porcelain, x, BT, IZ)
    dishes[id].scale.setScalar(2.3)
  }
  // heaps: silver grey, sulfur yellow, white germanium sulfide
  const heapGeo = geo(new THREE.SphereGeometry(0.1, 16, 10, 0, TAU, 0, Math.PI / 2))
  const HEAP_K = 1.9
  const heaps = {
    ag: mesh(heapGeo, std('#c4ccd8', { roughness: 0.3, metalness: 0.9 }), DISH.ag, BT + 0.02, IZ),
    s: mesh(heapGeo, std('#e8d63a', { roughness: 0.8 }), DISH.s, BT + 0.02, IZ),
    ge: mesh(heapGeo, std('#f4f2ea', { roughness: 0.9 }), DISH.ge, BT + 0.02, IZ),
  }
  for (const h of Object.values(heaps)) h.scale.set(0.001, 0.001, 0.001)
  const beadMat = new THREE.MeshMatcapMaterial({ matcap: tex(metalCap(light)) })
  const bead = mesh(geo(new THREE.SphereGeometry(0.05, 20, 14)), beadMat, DISH.ge, BT + 0.09, IZ)
  bead.scale.setScalar(0.001)
  // the labels on the bench's lip
  for (const [id, x] of Object.entries(DISH)) {
    const t = text(id === 'ge' ? '?' : id === 'ag' ? 'Ag' : 'S', 0.14, '#ffd9a0')
    t.position.set(x, BT + 0.003, BZ + 0.43)
    t.rotation.x = -Math.PI / 2
    root.add(t)
  }
  // the mortar, the lump and its crystals, the pestle
  const mortar = new THREE.Group()
  mortar.position.set(MORTAR_X, BT, IZ)
  mortar.scale.setScalar(1.7)
  root.add(mortar)
  mesh(geo(new THREE.LatheGeometry([[0, 0], [0.12, 0], [0.14, 0.04], [0.17, 0.12], [0.175, 0.14], [0.16, 0.14], [0.13, 0.06], [0, 0.04]].map(([x, y]) => new THREE.Vector2(x, y)), 24)), std('#9a968a', { roughness: 0.5 }), 0, 0, 0, mortar)
  const lump = new THREE.Group()
  lump.position.set(0, 0.06, 0)
  mortar.add(lump)
  {
    const rnd = random(1885)
    const rock = std('#a8908a', { roughness: 0.9 })
    mesh(geo(new THREE.IcosahedronGeometry(0.1, 0)), rock, 0, 0.0, 0, lump).scale.set(1.2, 0.5, 1)
    const dark = new THREE.MeshMatcapMaterial({ matcap: tex(canvasTex(64, 64, g => {
      const gr = g.createLinearGradient(0, 0, 64, 64)
      gr.addColorStop(0, '#7a8092')
      gr.addColorStop(0.5, '#2a2e3a')
      gr.addColorStop(1, '#14161e')
      g.fillStyle = gr
      g.fillRect(0, 0, 64, 64)
    })) })
    for (let k = 0; k < 9; k++) {
      const c = mesh(geo(new THREE.OctahedronGeometry(0.035, 0)), dark, (rnd() - 0.5) * 0.15, 0.04 + rnd() * 0.05, (rnd() - 0.5) * 0.1, lump)
      c.scale.set(0.8, 1.6 + rnd(), 0.8)
      c.rotation.set((rnd() - 0.5) * 0.5, rnd() * 3, (rnd() - 0.5) * 0.5)
    }
  }
  const powder = mesh(heapGeo, std('#3a3e4a', { roughness: 0.95 }), 0, 0.06, 0, mortar)
  powder.scale.set(0.001, 0.001, 0.001)
  const pestle = new THREE.Group()
  mesh(geo(new THREE.CylinderGeometry(0.018, 0.03, 0.2, 12)), std('#bdb8aa', { roughness: 0.5 }), 0, 0.1, 0, pestle)
  mesh(geo(new THREE.SphereGeometry(0.036, 14, 10)), std('#bdb8aa', { roughness: 0.5 }), 0, 0.0, 0, pestle)
  pestle.position.set(0.2, 0.1, 0.08)
  pestle.rotation.z = -0.5
  mortar.add(pestle)
  const lumpHit = mesh(geo(new THREE.BoxGeometry(0.7, 0.55, 0.7)), ghost, MORTAR_X, BT + 0.22, IZ)
  // the balance in its glass case, the beam moving as the powder is weighed
  const balance = new THREE.Group()
  balance.position.set(5.3, BT, IZ)
  balance.scale.setScalar(1.4)
  root.add(balance)
  mesh(geo(new THREE.BoxGeometry(0.6, 0.03, 0.34)), M.wood, 0, 0.015, 0, balance)
  mesh(geo(new THREE.CylinderGeometry(0.02, 0.03, 0.3, 10)), M.brass, 0, 0.18, 0, balance)
  const beam = new THREE.Group()
  beam.position.set(0, 0.33, 0)
  balance.add(beam)
  mesh(geo(new THREE.BoxGeometry(0.5, 0.012, 0.014)), M.brass, 0, 0, 0, beam)
  const pans = [-1, 1].map(s => {
    const p = new THREE.Group()
    p.position.set(s * 0.24, 0, 0)
    beam.add(p)
    mesh(geo(new THREE.CylinderGeometry(0.0025, 0.0025, 0.14, 4)), M.brass, 0, -0.07, 0, p)
    mesh(geo(new THREE.CylinderGeometry(0.06, 0.05, 0.012, 16)), M.brass, 0, -0.145, 0, p)
    return p
  })
  {
    // the glass case round it, on the bench
    const gl = mesh(geo(new THREE.BoxGeometry(0.62, 0.52, 0.36)), M.glass, 0, 0.27, 0, balance)
    gl.renderOrder = 3
    for (const [w, h, d, x, y, z] of [[0.64, 0.02, 0.38, 0, 0.53, 0], [0.02, 0.52, 0.02, -0.31, 0.27, 0.18], [0.02, 0.52, 0.02, 0.31, 0.27, 0.18], [0.02, 0.52, 0.02, -0.31, 0.27, -0.18], [0.02, 0.52, 0.02, 0.31, 0.27, -0.18]]) mesh(geo(new THREE.BoxGeometry(w, h, d)), M.brass, x, y, z, balance)
  }
  // the weights on the right-hand pan
  const wts = mesh(geo(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 10)), M.brass, 0, -0.125, 0, pans[1])
  wts.scale.setScalar(0.001)
  const pile = mesh(heapGeo, std('#3a3e4a', { roughness: 0.95 }), 0, -0.14, 0, pans[0])
  pile.scale.set(0.001, 0.001, 0.001)
  pile.geometry.computeBoundingSphere()
  // dishes' hit shapes
  const hit3 = {
    ag: mesh(geo(new THREE.CylinderGeometry(0.27, 0.27, 0.36, 12)), ghost, DISH.ag, BT + 0.12, IZ),
    s: mesh(geo(new THREE.CylinderGeometry(0.27, 0.27, 0.36, 12)), ghost, DISH.s, BT + 0.12, IZ),
    ge: mesh(geo(new THREE.CylinderGeometry(0.27, 0.27, 0.36, 12)), ghost, DISH.ge, BT + 0.12, IZ),
  }
  // the north wall of the laboratory, left to right: the comparison board, the chart of the ore (one bar to
  // 100, silver, sulfur and the missing part), and over both the rail of the years
  const WZ = ROOM.z0 + 0.06
  const CHART_W = 2.5
  const CHART_PX = [1008, 523]
  const CHART_H = (CHART_W * CHART_PX[1]) / CHART_PX[0]
  const CHART_X = 7.85
  const CHART_Y = 2.4
  const BAR = { x0: 70, x1: 910, y0: 200, y1: 300 } // the bar on the canvas, 0 to 100
  const barPx = v => BAR.x0 + (v / 100) * (BAR.x1 - BAR.x0)
  const chart = board(CHART_W, CHART_H, CHART_PX[0], CHART_PX[1], (g, w, h) => drawChart(g, w, h), { frame: '#c49a4c', glow: 0.3 })
  onFace(chart.group, CHART_X, CHART_Y, WZ)
  function drawChart(g, w, h) {
    const C = E.s3.chart
    g.fillStyle = '#10141c'
    g.fillRect(0, 0, w, h)
    const { x0, x1, y0, y1 } = BAR
    g.textBaseline = 'middle'
    g.textAlign = 'center'
    g.font = '700 38px Outfit, sans-serif'
    g.fillStyle = '#c8d2e4'
    g.fillText(C.head, w / 2, 40)
    // the scale under the bar
    g.font = '500 26px Outfit, sans-serif'
    for (let v = 0; v <= 100; v += 25) {
      g.fillStyle = '#7a869c'
      g.fillText(String(v), barPx(v), y1 + 52)
      g.fillStyle = 'rgba(122,134,156,0.5)'
      g.fillRect(barPx(v) - 1, y1 + 4, 2, 16)
    }
    g.fillStyle = 'rgba(122,134,156,0.28)'
    g.fillRect(x0, y0, x1 - x0, y1 - y0)
    const ag = K3.ag * AG_PCT
    const s = K3.s * S_PCT
    const dpt = dp() === 'sci' ? 1 : 0
    // the kid's whole numbers (76 and 17) add to the 93 that is shown; the scientist's tenths too (76.5, 17.1, 93.6)
    const show = v => num(dpt ? v : Math.floor(v + 1e-6), dpt, lang)
    const seg = (from, v, c, label) => {
      if (v < 0.05) return
      const xa = barPx(from)
      const xb = barPx(from + v)
      g.fillStyle = c
      g.fillRect(xa, y0, xb - xa, y1 - y0)
      g.fillStyle = '#10141c'
      g.textAlign = 'center'
      g.font = '700 40px Outfit, sans-serif'
      if (xb - xa > 60) g.fillText(label, (xa + xb) / 2, (y0 + y1) / 2)
      g.fillStyle = '#e8ecf4'
      g.font = '700 34px Outfit, sans-serif'
      g.fillText(show(v), (xa + xb) / 2, y0 - 34)
    }
    seg(0, ag, '#b4bcc8', 'Ag')
    seg(ag, s, '#e8d63a', 'S')
    const done = ag + s
    if (K3.ag > 0.98 && K3.s > 0.98) {
      const xa = barPx(done)
      const glow = 0.55 + 0.45 * Math.sin(Date.now() / 260)
      if (K3.gs < 0.5) {
        g.setLineDash([12, 7])
        g.lineWidth = 6
        g.strokeStyle = `rgba(255,179,71,${0.5 + glow * 0.5})`
        g.strokeRect(xa, y0 - 3, x1 - xa, y1 - y0 + 6)
        g.setLineDash([])
        g.fillStyle = `rgba(255,179,71,${0.12 + glow * 0.2})`
        g.fillRect(xa, y0, x1 - xa, y1 - y0)
        g.fillStyle = '#ffd9a0'
        g.textAlign = 'center'
        g.font = '700 44px Outfit, sans-serif'
        g.fillText('?', (xa + x1) / 2, (y0 + y1) / 2 + 2)
        g.font = '700 30px Outfit, sans-serif'
        g.fillText(C.missing, (xa + x1) / 2, y0 - 82)
      }
      // a mark at what was accounted for
      g.fillStyle = '#ffd9a0'
      g.fillRect(xa - 1.5, y1, 3, 56)
      g.textAlign = 'right'
      g.font = '700 30px Outfit, sans-serif'
      g.fillText(`= ${show(done)}`, xa - 10, y1 + 80)
    }
    if (K3.gs > 0.02) {
      const ge = K3.gs * GE_PCT
      const xa = barPx(done)
      const xb = barPx(done + ge)
      g.fillStyle = CPK.Ge
      g.fillRect(xa, y0, xb - xa, y1 - y0)
      g.fillStyle = '#0c1a1a'
      g.textAlign = 'center'
      g.font = '700 34px Outfit, sans-serif'
      g.fillText('Ge', (xa + xb) / 2, (y0 + y1) / 2)
      g.fillStyle = '#e8ecf4'
      g.fillText(C.found, (xa + xb) / 2, y0 - 82)
    }
  }
  // the hit shape over the bar's missing end
  const gapX = CHART_X - CHART_W / 2 + (barPx(AG_PCT + S_PCT + GE_PCT / 2) / CHART_PX[0]) * CHART_W
  const gapY = CHART_Y + CHART_H / 2 - (250 / CHART_PX[1]) * CHART_H
  const chartGapHit = mesh(geo(new THREE.PlaneGeometry(0.5, 0.6)), ghost, gapX, gapY, WZ + 0.1)
  // the comparison board: the prediction of 1871 against what Winkler found
  const ROWS = E.s3.compare.rows.length
  const cmp = board(2.0, (2.0 * 479) / 736, 736, 479, (g, w, h) => drawCompare(g, w, h), { frame: '#ffb347', glow: 0.5 })
  onFace(cmp.group, 5.55, CHART_Y, WZ)
  function drawCompare(g, w, h) {
    const Cm = E.s3.compare
    g.fillStyle = '#10141c'
    g.fillRect(0, 0, w, h)
    g.textBaseline = 'middle'
    g.textAlign = 'center'
    g.fillStyle = '#ffd9a0'
    g.font = '700 34px Outfit, sans-serif'
    g.fillText(Cm.head, w / 2, 32)
    g.font = '700 26px Outfit, sans-serif'
    g.fillStyle = '#ffb347'
    g.fillText(Cm.cols[0], 366, 80)
    g.fillStyle = '#9ad0cc'
    g.fillText(Cm.cols[1], 566, 80)
    g.fillStyle = 'rgba(200,210,230,0.25)'
    g.fillRect(24, 100, w - 48, 2)
    const rowH = 56
    const sci = dp() === 'sci'
    for (let i = 0; i < ROWS; i++) {
      const y = 138 + i * rowH
      const r = Cm.rows[i]
      const lit = clamp(K3.cmp - i, 0, 1)
      g.textAlign = 'left'
      g.fillStyle = '#c8d2e4'
      g.font = '500 25px Outfit, sans-serif'
      g.fillText(r[0], 28, y)
      g.textAlign = 'center'
      g.fillStyle = '#ffd9a0'
      g.font = '700 28px Outfit, sans-serif'
      g.fillText(r[1], 366, y)
      if (lit > 0) {
        g.globalAlpha = lit
        g.fillStyle = '#e8fff6'
        g.fillText(sci && r[3] ? r[3] : r[2], 566, y)
        if (lit >= 1) {
          g.strokeStyle = '#5fe0a0'
          g.lineWidth = 6
          g.beginPath()
          g.moveTo(660, y + 2)
          g.lineTo(676, y + 16)
          g.lineTo(710, y - 14)
          g.stroke()
        }
        g.globalAlpha = 1
      } else {
        g.fillStyle = 'rgba(200,210,230,0.2)'
        g.fillRect(506, y - 2, 120, 4)
      }
    }
  }
  // the year rail across the top: three gaps filled in turn
  const RAIL_W = 4.5
  const RAIL_PX = 1600
  const RAIL_PH = 320
  const RAIL_H = (RAIL_W * RAIL_PH) / RAIL_PX
  const RAIL_X = 6.9
  const RAIL_Y = 3.66
  const railX = y => 70 + ((y - YEARS[0]) / (YEARS[1] - YEARS[0])) * (RAIL_PX - 160)
  const RC = { w: 132, h: 118, top: 44 } // a card on the rail, in canvas pixels
  const rail = board(RAIL_W, RAIL_H, RAIL_PX, RAIL_PH, (g, w, h) => drawRail(g, w, h), { frame: '#c49a4c', glow: 0.3 })
  onFace(rail.group, RAIL_X, RAIL_Y, WZ)
  function drawRail(g, w, h) {
    const R = E.s3.rail
    g.fillStyle = '#10141c'
    g.fillRect(0, 0, w, h)
    g.textBaseline = 'middle'
    g.textAlign = 'center'
    g.fillStyle = '#c8d2e4'
    g.font = '700 30px Outfit, sans-serif'
    g.fillText(R.head, w / 2, 24)
    const ly = 272
    g.fillStyle = '#5a6478'
    g.fillRect(railX(1869), ly - 3, railX(1886) - railX(1869), 6)
    const now = K3.year
    g.fillStyle = '#ffb347'
    g.fillRect(railX(1869), ly - 3, railX(now) - railX(1869), 6)
    for (const y of [1869, 1871, 1875, 1879, 1886]) {
      g.fillStyle = y <= now ? '#ffd9a0' : '#7a869c'
      g.fillRect(railX(y) - 2, ly - 12, 4, 24)
      g.font = '500 25px Outfit, sans-serif'
      g.fillText(String(y), railX(y), ly + 28)
    }
    g.fillStyle = '#ffd9a0'
    g.font = '500 25px Outfit, sans-serif'
    g.textAlign = 'left'
    g.fillText(R.t1871, railX(1871) + 14, ly - 28)
    g.textAlign = 'center'
    // the three cards
    FOUND.forEach(f => {
      const x = railX(f.year)
      const filled = now >= f.year
      const cxl = clamp(x - RC.w / 2, 8, w - RC.w - 8)
      g.save()
      g.translate(cxl, RC.top)
      g.scale(RC.w / CW, RC.h / CH)
      const c = { sym: f.sym, el: element(f.sym), color: CPK[f.sym] }
      if (filled) drawCard(g, 0, 0, c, lang)
      else drawGap(g, 0, 0, c.color, R.eka[f.eka])
      g.restore()
      g.fillStyle = filled ? '#ffd9a0' : '#9a8a70'
      g.font = '700 25px Outfit, sans-serif'
      g.fillText(filled ? `${nm(f.sym)} ${f.year}` : R.eka[f.eka], clamp(x, RC.w / 2 + 8, w - RC.w / 2 - 8), RC.top + RC.h + 22)
      g.strokeStyle = filled ? '#ffd9a0' : '#5a6478'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(x, RC.top + RC.h + 40)
      g.lineTo(x, ly - 14)
      g.stroke()
    })
    // the marker and the year
    const mx = railX(now)
    g.fillStyle = '#ffd166'
    g.beginPath()
    g.moveTo(mx, ly - 20)
    g.lineTo(mx + 16, ly)
    g.lineTo(mx, ly + 20)
    g.lineTo(mx - 16, ly)
    g.fill()
    g.font = '700 84px Outfit, sans-serif'
    g.textAlign = 'center'
    g.fillStyle = '#ffffff'
    g.fillText(String(Math.round(now)), 270, 156)
  }
  // taps on the rail's cards jump the year
  const railHits = FOUND.map(f => {
    const x = clamp(railX(f.year), RC.w / 2 + 8, RAIL_PX - RC.w / 2 - 8)
    const hx = RAIL_X - RAIL_W / 2 + (x / RAIL_PX) * RAIL_W
    const hy = RAIL_Y + RAIL_H / 2 - ((RC.top + RC.h / 2) / RAIL_PH) * RAIL_H
    const h = mesh(geo(new THREE.PlaneGeometry(0.5, 0.42)), ghost, hx, hy, WZ + 0.1)
    clickable(h, () => setYear(f.year, { now: true }), { reach: 9 })
    return { f, h }
  })

  // ---- what each step does ----
  const done3 = () => S3.ge > 0
  function setYear(y, { now = false } = {}) {
    const v = clamp(Math.round(Number(y) || 1869), YEARS[0], YEARS[1])
    if (v === S3.year) return
    const prev = S3.year
    S3.year = v
    if (now) {
      for (const [yr, key] of [[1871, 'y1871'], [1875, 'y1875'], [1879, 'y1879'], [1886, 'y1886']]) if (prev < yr && v >= yr) speak(T(E.s3.says[key]))
      play('tap')
      ex.discover('winkler', panel3, 6)
      share('winkler')
    }
  }
  function benchStep(what) {
    if (what === 'lump') {
      if (S3.g) return false
      S3.g = 1
      play('select')
      speak(T(E.s3.says.lump))
      ex.discover('winkler', panel3, 6)
    } else if (what === 'ag' || what === 's') {
      if (!S3.g) {
        speak(T(E.s3.says.early))
        return false
      }
      if (S3[what]) return false
      S3[what] = 1
      play('tap')
      speak(T(E.s3.says[what === 'ag' ? 'ag' : 's']))
      if (S3.ag && S3.s) later(2.4, () => speak(T(E.s3.says.missing)))
    } else if (what === 'ge') {
      if (!(S3.ag && S3.s)) {
        speak(T(E.s3.says.early))
        return false
      }
      if (S3.ge) return false
      S3.ge = 1
      play('discover')
      speak(T(E.s3.says.found))
      later(2.4, () => {
        if (S3.ge === 1) {
          S3.ge = 2
          share('winkler')
        }
      })
      later(3.0, () => speak(T(E.s3.says.compare)))
    } else return false
    share('winkler')
    return true
  }
  function resetBench() {
    S3.g = S3.ag = S3.s = S3.ge = 0
    S3.year = 1869
    play('select')
    share('winkler')
  }
  clickable(lumpHit, () => benchStep('lump'), { when: () => !S3.g, reach: 7 })
  clickable(hit3.ag, () => benchStep('ag'), { when: () => !!S3.g && !S3.ag, reach: 7 })
  clickable(hit3.s, () => benchStep('s'), { when: () => !!S3.g && !S3.s, reach: 7 })
  clickable(hit3.ge, () => benchStep('ge'), { when: () => !!(S3.ag && S3.s) && !S3.ge, reach: 7 })
  clickable(chartGapHit, () => benchStep('ge'), { when: () => !!(S3.ag && S3.s) && !S3.ge, reach: 8 })
  function panel3(l) {
    return {
      title: E.s3.title,
      color,
      blocks: [
        { slider: { label: E.s3.slider, min: YEARS[0], max: YEARS[1], step: 1, value: S3.year, onInput: v => setYear(v, { now: true }), format: v => fill(E.s3.sliderFmt, { y: Math.round(v) }), live: () => S3.year } },
        {
          buttons: [
            { label: E.s3.buttons.lump, onClick: () => benchStep('lump') },
            { label: E.s3.buttons.ag, onClick: () => benchStep('ag') },
            { label: E.s3.buttons.s, onClick: () => benchStep('s') },
            { label: E.s3.buttons.ge, onClick: () => benchStep('ge') },
            { label: E.s3.buttons.reset, onClick: () => resetBench() },
          ],
        },
        ...E.s3.panel[depth(l)].map(p => ({ p })),
      ],
    }
  }
  ex.add({
    id: 'winkler',
    x: 6.6,
    z: -1.1,
    radius: 2.9,
    manual: true,
    label: E.s3.label,
    verb: () => {
      const H = E.s3.hints
      if (!S3.g) return H.lump
      if (!S3.ag && !S3.s) return H.dish
      if (!S3.ag) return H.ag
      if (!S3.s) return H.s
      if (!S3.ge) return H.gap
      return H.done
    },
    focus: { x: 6.85, y: 2.5, z: ROOM.z0 + 0.3, size: 4.1, width: 5.0 },
    act: () => ctx.showPanel(panel3),
  })
  const winklerState = () => ({ g: S3.g, ag: S3.ag, s: S3.s, ge: S3.ge, year: S3.year })
  const winklerSet = (s, liveSet) => {
    const b = v => (v ? 1 : 0)
    const next = { g: b(s?.g), ag: b(s?.ag), s: b(s?.s), ge: clamp(Math.round(Number(s?.ge) || 0), 0, 2), year: clamp(Math.round(Number(s?.year) || 1869), YEARS[0], YEARS[1]) }
    if (liveSet) {
      if (next.ge && !S3.ge) play('discover')
      else if (next.g !== S3.g || next.ag !== S3.ag || next.s !== S3.s || next.year !== S3.year) play('tap')
    }
    Object.assign(S3, next)
    if (!liveSet) Object.assign(K3, { g: next.g, ag: next.ag, s: next.s, ge: next.ge ? (next.ge === 2 ? 1 : 0.5) : 0, gs: next.ge ? 1 : 0, cmp: next.ge ? ROWS : 0, year: next.year })
  }
  let grindT = 0
  updates.push((dt, t) => {
    const r = (a, b, rate) => damp(a, b, rate, dt)
    const lin = (a, b, rate) => a + clamp(b - a, -dt * rate, dt * rate)
    const wasG = K3.g
    K3.g = lin(K3.g, S3.g, 0.8)
    K3.ag = lin(K3.ag, S3.ag, 0.7)
    K3.s = lin(K3.s, S3.s, 0.7)
    K3.ge = lin(K3.ge, S3.ge === 2 ? 1 : S3.ge === 1 ? 0.5 : 0, 0.5)
    K3.gs = lin(K3.gs, S3.ge ? 1 : 0, 1.2)
    K3.cmp = lin(K3.cmp, S3.ge ? ROWS : 0, S3.ge ? 1.2 : 6)
    K3.year = lin(K3.year, S3.year, 22)
    grindT = S3.g && K3.g < 1 ? grindT + dt : 0
    // the lump crumbles, the powder rises, the pestle works, the beam settles
    lump.scale.setScalar(Math.max(0.001, 1 - K3.g))
    lump.visible = K3.g < 0.99
    powder.scale.set(Math.max(0.001, K3.g * 1.5), Math.max(0.001, K3.g * 1.0), Math.max(0.001, K3.g * 1.5))
    pestle.position.y = 0.1 + (S3.g && K3.g < 1 ? Math.abs(Math.sin(grindT * 9)) * 0.06 : 0)
    const tilt = S3.g ? -0.14 * Math.exp(-K3.g * 0.4) * (K3.g < 1 ? 1 + Math.sin(t * 6) * 0.25 : 1) + 0.01 : 0
    beam.rotation.z = r(beam.rotation.z, tilt, 3)
    pans[0].rotation.z = -beam.rotation.z
    pans[1].rotation.z = -beam.rotation.z
    wts.scale.setScalar(Math.max(0.001, K3.g))
    pile.scale.set(Math.max(0.001, K3.g * 0.4), Math.max(0.001, K3.g * 0.35), Math.max(0.001, K3.g * 0.4))
    // the dishes fill
    const setHeap = (h, k, s) => h.scale.set(Math.max(0.001, k * s), Math.max(0.001, k * s * 0.7), Math.max(0.001, k * s))
    setHeap(heaps.ag, K3.ag, HEAP_K)
    setHeap(heaps.s, K3.s, HEAP_K)
    // the sulfide: white powder rises to the first half, is reduced to a bead by the second
    const pw = K3.ge <= 0.5 ? K3.ge * 2 : 1 - (K3.ge - 0.5) * 2
    setHeap(heaps.ge, pw, HEAP_K * 0.95)
    bead.scale.setScalar(Math.max(0.001, clamp((K3.ge - 0.4) * 2, 0, 1)))
    // the empty dish glows till its gap is filled
    const dishGlow = S3.ag && S3.s && !S3.ge ? 0.5 + 0.5 * Math.sin(t * 3.2) : 0
    ge3Ring.material.opacity = dishGlow * 0.9
    ge3Ring.visible = dishGlow > 0.01
    // the boards
    const key = `${K3.ag.toFixed(2)}|${K3.s.toFixed(2)}|${K3.gs.toFixed(2)}|${lv()}|${S3.ag && S3.s && !S3.ge ? Math.floor(t * 8) : 0}`
    if (key !== chartKey) {
      chartKey = key
      chart.redraw()
    }
    const ck = `${K3.cmp.toFixed(1)}|${lv()}`
    if (ck !== cmpKey) {
      cmpKey = ck
      cmp.redraw()
    }
    const rk = `${K3.year.toFixed(1)}|${lv()}`
    if (rk !== railKey) {
      railKey = rk
      rail.redraw()
    }
  })
  let chartKey = ''
  let cmpKey = ''
  let railKey = ''
  const ge3Ring = mesh(geo(new THREE.TorusGeometry(0.28, 0.016, 8, 32)), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb347').multiplyScalar(1.6), transparent: true, opacity: 0, depthWrite: false }), DISH.ge, BT + 0.05, IZ)
  ge3Ring.rotation.x = Math.PI / 2
  ge3Ring.visible = false

  // the stage's own update (dust, lamps)
  updates.push((dt, t) => stage.update(t))
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())

  return {
    env: { ...stage.env },
    solids,
    // the camera stays in front of the frame (behind it, it would look through the swirl)
    cameraBounds: { ...stage.cameraBounds, maxZ: 3.9 },
    spawn: { x: -1.0, z: 2.0, yaw: 0 },
    hostSpot: { x: -2.4, z: 1.2, yaw: Math.atan2(-2.4, -1.2) },
    back: { x: 0.2, z: 4.2, rot: Math.PI },
    // the easel by the glazed screen, off the lines the stations' views back along
    stand: { x: 2.7, z: 1.9, rot: Math.atan2(-3.7, 0.1) },
    parts: {
      cards: {
        tap: () => deal(),
        set: n => setN(n, { now: true }),
        gap: which => gapTap(which),
        get state() { return cardsState() },
        get placed() { return cards.filter(c => c.p > 0.99).length },
        heapAt: () => HEAP.clone().setY(0.95),
        cardAt: i => cards[i].slot.clone(),
        gapAt: which => gapHit[which === 'si' ? 1 : 0].position.clone(),
      },
      predict: {
        tap: what => (what === 'quill' ? writeLine() : neighStep(what)), // 'si', 'as', 'sn', 'quill'
        set: n => setLines(n),
        get state() { return predictState() },
        cardAt: id => V(NEIGH[id].x, NEIGH[id].y, WALL + 0.1),
        quillAt: () => V(inkP.x, inkP.y + 0.3, inkP.z),
      },
      winkler: {
        tap: what => benchStep(what), // 'lump', 'ag', 's', 'ge'
        year: y => setYear(y, { now: true }),
        get state() { return winklerState() },
        lumpAt: () => V(MORTAR_X, BT + 0.22, IZ),
        dishAt: id => V(DISH[id], BT + 0.1, IZ),
        gapAt: () => chartGapHit.position.clone(),
        railAt: i => railHits[i].h.position.clone(),
      },
      rayTo,
    },
    panels: { patience: panel1, predict: panel2, winkler: panel3 },
    shared: {
      cards: { get: cardsState, set: cardsSet },
      predict: { get: predictState, set: predictSet },
      winkler: { get: winklerState, set: winklerSet },
    },
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const g of geos) g.dispose()
    },
  }
}
