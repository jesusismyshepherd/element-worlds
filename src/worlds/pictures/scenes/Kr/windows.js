// Krypton's picture "Why is there gas in your window?" as a room (docs/knowledge/picture-rooms.md): a window
// factory on a winter evening (stages/glazing.js), its big doors open on a snowy yard. The picture tells why a
// triple window's two gaps hold krypton: heat crosses a gas by its atoms bumping, krypton's are heavy and
// slow, and a coating on the glass turns the heat's infrared back. Three stations, each worked by tapping its
// thing (the user, 2026-10-30; the prompt names the next tap; E opens the panel, whose buttons and slider do
// the same):
// - the glass line (west wall): tap the glass pane (it rides through the coating chamber and comes out with
//   an invisible coating, a faint gold shimmer), the spacer frames (laid on, the second and third panes
//   pressed on), a gas bottle (air, argon, krypton: the press fills both gaps through a hole in the spacer,
//   the gauge climbs to about 90%), the red plug (it seals); the finished window slides onto the rack, a shelf
//   for each gas with its colour on the spacer;
// - the giant gap (north-east bench): the picture's close-up made big. Tap a gas bottle (air, argon, krypton,
//   xenon): the gap fills with that gas's atoms, each at its true relative speed (mean speed goes as one over
//   the square root of the mass), warm ones red and cold ones blue as they carry heat across; a meter reads the
//   heat through the gap for a 15 degree difference, split into conduction, rolling (convection) and infrared;
//   a slider widens the gap from 4 to 24 mm, a gold mark on the ruler is that gas's best width; tap the cold
//   glass and the coating goes on, the infrared arrows bounce back;
// - the test house (east wall): three windows side by side, one pane, two panes of air, three panes with
//   krypton and coatings, a cold chamber behind them. A slider sets the cold outside, 10 to -30 degrees, a
//   meter under each window reads watts; tap the thermal camera (the windows and the sleeping cat turn to false
//   colour from their surface temperatures), tap the krypton window for a lens on its gap.
// The numbers: conductivities from elements.json (krypton 0.0095, argon 0.0177, xenon 0.0057, nitrogen 0.026
// W/(m.K)); the rolling of the gas (convection) from the Nusselt number of a tall gap (ISO 15099's vertical
// correlation, from memory: the room's model, not a measurement), which reproduces each gas's best width
// (krypton about 11 mm, argon about 16, xenon about 8, air about 18) and so the vendors' tables; infrared from
// 4 sigma T^3 and the glass's emissivities (0.84 plain, 0.04 for a silver coating); the three windows' U-values
// of about 5.8, 2.8 and 0.6 W/(m2.K) are typical figures, not exact ones; the glass's inside face is
// T_in - U x 0.13 x (T_in - T_out), 0.13 m2.K/W being the standard resistance of the room's air film.
// All of it is shared in a room (src/net/shared.js); words, panels and discoveries stay each one's.
// parts.<station> does what a tap does, for the probes; parts.at.<thing>() gives a point to aim a real tap at.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { at, clamp, lerp, damp, fill } from '../../../wings/noble/kit.js'
import { glazingStage } from '../../stages/glazing.js'
import { ease } from '../../kit.js'
import { play } from '../../../../audio/sound.js'
import { box, circle } from '../../../../engine/collide.js'
import { makeText } from '../../../../engine/text.js'
import { WINDOWS_WORDS } from './windows.words.js'

export const WORDS = WINDOWS_WORDS

const LOCALE = { en: 'en-GB', 'pt-pt': 'pt-PT', pl: 'pl-PL', de: 'de-DE' }
const span = (a, b, v) => ease(clamp((v - a) / (b - a)))

// ---- the physics the stations follow ----
// the gases at room temperature: conductivity (elements.json), viscosity, specific heat, molar mass
const GAS = {
  air: { k: 0.026, mu: 1.85e-5, cp: 1005, M: 28.96, r: 0.032, hex: '#aab2bf' },
  argon: { k: 0.0177, mu: 2.27e-5, cp: 520, M: 39.948, r: 0.042, hex: '#8fe0ee' },
  krypton: { k: 0.0095, mu: 2.55e-5, cp: 248, M: 83.798, r: 0.047, hex: '#19b5a5' },
  xenon: { k: 0.0057, mu: 2.32e-5, cp: 158, M: 131.293, r: 0.053, hex: '#a58cf0' },
}
const GAS_IDS = Object.keys(GAS)
const T_MEAN = 283 // K, the gap's mean temperature
for (const g of Object.values(GAS)) {
  g.rho = (g.M * 1e-3 * 101325) / (8.314 * T_MEAN)
  // the mean speed of the atoms, relative to the air's (it goes as 1/sqrt(mass))
  g.speed = Math.sqrt(GAS.air.M / g.M)
}
const DT_GAP = 15 // the difference across the giant gap, K
// the rolling of the gas in a tall gap (Nusselt number: 1 means pure conduction)
const rayleigh = (g, dm) => (g.rho * g.rho * dm ** 3 * 9.81 * (1 / T_MEAN) * g.cp * DT_GAP) / (g.mu * g.k)
const nusselt = ra => (ra <= 1e4 ? 1 + 1.7596678e-10 * ra ** 2.2984755 : ra <= 5e4 ? 0.028154 * ra ** 0.4134 : 0.0673838 * ra ** (1 / 3))
const nuOf = (g, mm) => nusselt(rayleigh(g, mm / 1000))
// heat through the gap per square metre, split (W/m2): conduction, rolling, infrared
const SIGMA4T3 = 4 * 5.67e-8 * T_MEAN ** 3
const H_RAD = { plain: SIGMA4T3 / (2 / 0.84 - 1), coated: SIGMA4T3 / (1 / 0.04 + 1 / 0.84 - 1) }
function heatThrough(gas, mm, coat) {
  const g = GAS[gas]
  const dm = mm / 1000
  const nu = nuOf(g, mm)
  const cond = (g.k / dm) * DT_GAP
  const roll = (g.k * (nu - 1) / dm) * DT_GAP
  const rad = (coat ? H_RAD.coated : H_RAD.plain) * DT_GAP
  return { cond, roll, rad, nu, total: cond + roll + rad }
}
// each gas's best width: where the gas's own part is smallest
const BEST = {}
for (const id of GAS_IDS) {
  let best = 4
  let lo = Infinity
  for (let mm = 4; mm <= 24; mm += 0.25) {
    const h = heatThrough(id, mm, true)
    const gasPart = h.cond + h.roll
    if (gasPart < lo) (lo = gasPart), (best = mm)
  }
  BEST[id] = best
}
const W_MIN = 4
const W_MAX = 24
const W_START = 12
const SCALE = 45 // metres of giant gap per metre of real gap

// the test house: typical U-values (W/m2.K), the window's size, the inside and the glass's inner face
const U = { single: 5.8, double: 2.8, triple: 0.6 }
const WIN = { w: 1.1, h: 1.35 }
const AREA = WIN.w * WIN.h
const T_IN = 20
const T_OUT = { min: -30, max: 10, start: -10 }
const R_SI = 0.13
const watts = (u, tOut) => u * AREA * (T_IN - tOut)
const faceTemp = (u, tOut) => T_IN - u * R_SI * (T_IN - tOut)
const WIN_IDS = ['single', 'double', 'triple']

// the false colour of the thermal camera (degrees C): dark blue, violet, red, orange, yellow, near white
const RAMP = [
  [-25, '#0a0f3c'],
  [-10, '#2a1a7a'],
  [0, '#6a1f8a'],
  [8, '#b02a6a'],
  [14, '#e0453a'],
  [20, '#f58a1f'],
  [27, '#fcd23a'],
  [34, '#fff3b0'],
]
const rampColor = (T, out = new THREE.Color()) => {
  const t = clamp(T, RAMP[0][0], RAMP[RAMP.length - 1][0])
  for (let i = 1; i < RAMP.length; i++) {
    if (t <= RAMP[i][0]) {
      const k = (t - RAMP[i - 1][0]) / (RAMP[i][0] - RAMP[i - 1][0])
      return out.set(RAMP[i - 1][1]).lerp(new THREE.Color(RAMP[i][1]), k)
    }
  }
  return out.set(RAMP[RAMP.length - 1][1])
}

// ---- the room ----

export async function build({ ctx, root, E, W, ex, say, later, light, level, color, clickable, lang }) {
  const H = 5.5
  const X0 = -10.5
  const X1 = 11.5
  const Z0 = -6
  const Z1 = 8
  const stage = glazingStage({ light, x0: X0, x1: X1, z0: Z0, z1: Z1, h: H, door: { at: 0, width: 6, height: 4.2 }, yard: { x0: -14, x1: 14, depth: 30 } })
  root.add(stage.group)
  const { mats } = stage
  const solids = stage.solids
  const share = id => ctx.share?.(id)
  const updates = []
  const textures = []
  const disposers = []
  const depthOf = lv => (lv === 'scientist' ? 'sci' : 'kid')
  const paras = (entry, lv) => entry[depthOf(lv)].map(p => ({ p }))
  const nf = (v, digits = 0) => new Intl.NumberFormat(LOCALE[lang] ?? 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v).replace('-', '−')
  const ghost = new THREE.MeshBasicMaterial({ visible: false })
  const focusOf = (x, y, z, high, wide) => ({ x, y, z, size: high, width: wide })
  const sign = (text, size, { color: c = '#e8f1fb', maxWidth = 3, anchorX = 'center', anchorY = 'middle' } = {}) =>
    makeText(text, { size, color: c, maxWidth, anchorX, anchorY, outlineWidth: size * 0.08, outlineColor: '#0b1020' })
  /** A tap's hit shape: an invisible box. */
  const hit = (w, h, d, x, y, z, parent = root) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ghost)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  const solid = (b, parent, x, y, z, mat = mats.dark) => {
    const m = new THREE.Mesh(b, mat)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  /** A canvas screen in a dark frame, facing +z: draw on `g`, then `tex.needsUpdate = true`. */
  function screen(w, h, px = 512, frameMat = mats.dark) {
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
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: '#d8d8d8', toneMapped: false }))
    face.position.z = 0.035
    group.add(frame, face)
    return { group, g: canvas.getContext('2d'), w: cw, h: ch, tex }
  }
  /** A line that shrinks until it fits (the four languages differ in length). */
  const fit = (g, text, x, y, size, weight = 700, maxW = 400) => {
    let s = size
    g.font = `${weight} ${s}px Outfit`
    while (s > 11 && g.measureText(text).width > maxW) g.font = `${weight} ${--s}px Outfit`
    g.fillText(text, x, y)
  }
  /** Lines of text wrapped to a width, from y; returns the y after the last line. */
  const wrap = (g, text, x, y, size, maxW, lh = 1.2, weight = 500) => {
    g.font = `${weight} ${size}px Outfit`
    const words = String(text).split(' ')
    let line = ''
    for (const w of words) {
      const test = line ? `${line} ${w}` : w
      if (g.measureText(test).width > maxW && line) {
        g.fillText(line, x, y)
        y += size * lh
        line = w
      } else line = test
    }
    if (line) g.fillText(line, x, y)
    return y + size * lh
  }
  // glass, and the colours of the gases
  const paneMat = new THREE.MeshStandardMaterial({ color: '#bfe6ea', emissive: '#2f6770', emissiveIntensity: 0.35, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.38, depthWrite: false })
  const coatedMat = new THREE.MeshStandardMaterial({ color: '#e0cf8a', emissive: '#8a6a1a', emissiveIntensity: 0.35, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.5, depthWrite: false })
  const GAS_C = Object.fromEntries(GAS_IDS.map(id => [id, new THREE.Color(GAS[id].hex)]))
  const SPACER_C = new THREE.Color('#c0c6cc')
  // things whose words follow the depth switch
  const redraws = []
  const gasName = id => E.gases[id]

  // ======================================================================================================
  // station 1: the glass line along the west wall (belt at x = -8, from z = 4 down to z = -4.5)
  // ======================================================================================================
  const BX = -8
  const BELT_Y = 0.9
  const ZS = { pane: 3.2, spacer: -0.3, press: -2.6, endBelt: -4.3, shelf: -5.1 }
  const SHELF_Y = { air: 0.9, argon: 1.5, krypton: 2.1 }
  const LINE_GASES = ['air', 'argon', 'krypton']
  {
    // the belt: two rails, rollers, legs
    const rail = new THREE.BoxGeometry(0.1, 0.12, 8.8)
    for (const s of [-1, 1]) solid(rail, root, BX + s * 0.8, BELT_Y - 0.07, -0.2, mats.steel)
    const rollerGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.56, 10)
    const n = 36
    const rollers = new THREE.InstancedMesh(rollerGeo, mats.dark, n)
    const m4 = new THREE.Matrix4()
    const rq = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))
    for (let i = 0; i < n; i++) rollers.setMatrixAt(i, m4.compose(new THREE.Vector3(BX, BELT_Y - 0.045, 4.15 - i * 0.245), rq, new THREE.Vector3(1, 1, 1)))
    root.add(rollers)
    for (const z of [4, 2, 0, -2, -4]) for (const s of [-1, 1]) solid(new THREE.BoxGeometry(0.08, BELT_Y - 0.12, 0.08), root, BX + s * 0.8, (BELT_Y - 0.12) / 2, z, mats.bench)
    solids.push(box(BX, -0.2, 1.8, 8.8))
  }
  // the glass waiting, a pallet of panes leaning beside the belt's start
  {
    const pallet = new THREE.Group()
    pallet.position.set(-9.8, 0, 3.5)
    solid(new THREE.BoxGeometry(0.9, 0.12, 1.5), pallet, 0, 0.06, 0, mats.bench)
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.25, 1.2), paneMat)
      p.position.set(-0.3 + i * 0.075, 0.12 + 0.63, 0)
      p.rotation.z = -0.1
      pallet.add(p)
    }
    root.add(pallet)
    solids.push(box(-9.8, 3.5, 1.0, 1.6))
  }
  // the coating chamber: a hood over the belt with violet glass sides; inside, the sputtering glow
  const COAT = { z: 1.5, len: 1.4 }
  const slitMat = new THREE.MeshStandardMaterial({ color: '#7d5cff', emissive: '#7d5cff', emissiveIntensity: 0.2, transparent: true, opacity: 0.55, roughness: 0.2 })
  const sputter = new THREE.PointLight('#9b7dff', 0, 4, 1.6)
  {
    const hood = new THREE.Group()
    hood.position.set(BX, 0, COAT.z)
    solid(new THREE.BoxGeometry(1.95, 0.8, COAT.len + 0.1), hood, 0, 1.85 + 0.05, 0, mats.bench)
    // the west side is shut; the visitor's side (east) is open as a window onto the violet glow
    solid(new THREE.BoxGeometry(0.1, 0.62, COAT.len + 0.1), hood, -0.92, 1.26, 0, mats.dark)
    for (const s of [-1, 1]) solid(new THREE.BoxGeometry(1.95, 0.62, 0.08), hood, 0, 1.26, s * (COAT.len / 2 + 0.01), mats.dark)
    solid(new THREE.BoxGeometry(0.04, 0.5, COAT.len - 0.1), hood, -0.86, 1.2, 0, slitMat)
    // two bright bars inside that sputter
    for (const s of [-0.28, 0.28]) {
      const bar = solid(new THREE.BoxGeometry(1.4, 0.05, 0.06), hood, 0, 1.3, s, slitMat)
      bar.userData.sputter = true
    }
    sputter.position.set(0, 1.35, 0)
    hood.add(sputter)
    const t = sign(E.line.signs.coater, 0.14, { maxWidth: 1.6 })
    t.position.set(1.0, 2.0, 0)
    t.rotation.y = Math.PI / 2
    hood.add(t)
    root.add(hood)
  }
  // the spacer table (east of the belt): two frames lie on it
  const TABLE = { x: -9.7, z: ZS.spacer - 0.1 }
  const spacerOnTable = []
  const spacerMatTable = new THREE.MeshStandardMaterial({ color: '#c0c6cc', roughness: 0.35, metalness: 0.85 })
  {
    const tb = new THREE.Group()
    tb.position.set(TABLE.x, 0, TABLE.z)
    solid(new THREE.BoxGeometry(0.9, 0.08, 1.2), tb, 0, 0.86, 0, mats.bench)
    for (const [x, z] of [[-0.4, -0.52], [0.4, -0.52], [-0.4, 0.52], [0.4, 0.52]]) solid(new THREE.BoxGeometry(0.06, 0.82, 0.06), tb, x, 0.41, z, mats.dark)
    for (let i = 0; i < 2; i++) {
      const f = spacerFrame(spacerMatTable)
      f.scale.set(0.62, 1, 0.68)
      f.rotation.y = Math.PI / 2
      f.position.set(0, 0.95 + i * 0.075, 0)
      tb.add(f)
      spacerOnTable.push(f)
    }
    const t = sign(E.line.signs.spacers, 0.12, { maxWidth: 1.4 })
    t.position.set(0.1, 1.5, 0)
    t.rotation.y = Math.PI / 2
    tb.add(t)
    root.add(tb)
    solids.push(box(TABLE.x, TABLE.z, 1.0, 1.3))
  }
  /** A spacer frame (a window's gap holder), lying flat: 1.14 by 0.84 m, 0.07 high. */
  function spacerFrame(mat) {
    const g = new THREE.Group()
    const bars = [
      [1.14, 0.03, 0, 0.405],
      [1.14, 0.03, 0, -0.405],
      [0.03, 0.84, 0.555, 0],
      [0.03, 0.84, -0.555, 0],
    ]
    for (const [w, d, x, z] of bars) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, d), mat)
      b.position.set(x, 0, z)
      g.add(b)
    }
    return g
  }
  // the gas press: a gantry over the belt, its head lowering onto the unit, a gauge on a post, bottles beside it
  const PRESS = { z: ZS.press }
  const headGroup = new THREE.Group()
  const gauge = screen(0.8, 0.5, 384)
  let hoseMesh = null
  const hoseMat = new THREE.MeshStandardMaterial({ color: '#2a2f36', roughness: 0.6 })
  const BOTTLE = { x: -6.3, z: { air: -1.75, argon: -2.4, krypton: -3.05 } }
  const BOTTLE_H = 0.85
  {
    const g = new THREE.Group()
    g.position.set(BX, 0, PRESS.z)
    for (const s of [-1, 1]) solid(new THREE.BoxGeometry(0.14, 2.3, 0.14), g, s * 1.15, 1.15, 0, mats.bench)
    solid(new THREE.BoxGeometry(2.44, 0.16, 0.2), g, 0, 2.3, 0, mats.bench)
    // the head: a block on a ram that lowers to the unit's corner
    headGroup.position.set(0.5, 2.0, 0.33)
    solid(new THREE.BoxGeometry(0.34, 0.22, 0.3), headGroup, 0, 0, 0, mats.steel)
    solid(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), headGroup, 0, 0.3, 0, mats.steel)
    solid(new THREE.CylinderGeometry(0.045, 0.06, 0.16, 10), headGroup, 0, -0.17, 0, mats.dark)
    g.add(headGroup)
    // the gauge on the east post, facing the visitor
    gauge.group.position.set(1.15, 1.55, 0)
    gauge.group.rotation.y = Math.PI / 2
    gauge.group.position.x = 1.25
    g.add(gauge.group)
    const t = sign(E.line.signs.press, 0.15, { maxWidth: 1.8 })
    t.position.set(1.0, 2.6, 0)
    t.rotation.y = Math.PI / 2
    g.add(t)
    root.add(g)
    solids.push(box(BX - 1.15, PRESS.z, 0.3, 0.3), box(BX + 1.15, PRESS.z, 0.3, 0.3))
  }
  const bottles = {}
  for (const id of LINE_GASES) {
    const b = new THREE.Group()
    b.position.set(BOTTLE.x, 0, BOTTLE.z[id])
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#3a4350', roughness: 0.4, metalness: 0.6 })
    const shoulderMat = new THREE.MeshStandardMaterial({ color: GAS[id].hex, roughness: 0.4, metalness: 0.3, emissive: GAS[id].hex, emissiveIntensity: 0.25 })
    solid(new THREE.CylinderGeometry(0.11, 0.11, BOTTLE_H - 0.2, 18), b, 0, (BOTTLE_H - 0.2) / 2, 0, bodyMat)
    solid(new THREE.SphereGeometry(0.11, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), b, 0, BOTTLE_H - 0.2, 0, shoulderMat)
    solid(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), b, 0, BOTTLE_H, 0, mats.steel)
    solid(new THREE.CylinderGeometry(0.113, 0.113, 0.1, 18), b, 0, 0.3, 0, shoulderMat)
    const t = sign(gasName(id), 0.1, { maxWidth: 1.2 })
    t.position.set(0.05, BOTTLE_H + 0.18, 0)
    t.rotation.y = Math.PI / 2
    b.add(t)
    root.add(b)
    bottles[id] = b
    solids.push(circle(BOTTLE.x, BOTTLE.z[id], 0.16))
  }
  // the rack: a shelf for each gas, three windows each
  const rack = new THREE.Group()
  root.add(rack)
  {
    for (const x of [-10.1, -5.9]) solid(new THREE.BoxGeometry(0.1, 2.6, 0.1), rack, x, 1.3, ZS.shelf + 0.5, mats.bench)
    for (const x of [-10.1, -5.9]) solid(new THREE.BoxGeometry(0.1, 2.6, 0.1), rack, x, 1.3, ZS.shelf - 0.5, mats.bench)
    for (const id of LINE_GASES) {
      solid(new THREE.BoxGeometry(4.2, 0.06, 1.1), rack, -8, SHELF_Y[id] - 0.03, ZS.shelf, mats.bench)
      const band = new THREE.MeshStandardMaterial({ color: GAS[id].hex, emissive: GAS[id].hex, emissiveIntensity: 0.6, roughness: 0.4 })
      solid(new THREE.BoxGeometry(4.2, 0.07, 0.03), rack, -8, SHELF_Y[id] - 0.03, ZS.shelf + 0.56, band)
      const t = sign(gasName(id), 0.15, { maxWidth: 1.2, anchorX: 'left' })
      t.position.set(-10.0, SHELF_Y[id] + 0.5, ZS.shelf + 0.58)
      rack.add(t)
    }
    const t = sign(E.line.signs.rack, 0.2, { maxWidth: 2.4 })
    t.position.set(-8, 2.85, ZS.shelf + 0.55)
    rack.add(t)
    solids.push(box(-8, ZS.shelf, 4.4, 1.3))
  }

  // ---- a window unit lying on the belt: three panes, two spacer frames, the gas in the gaps, a plug ----
  const LAYER = { p0: 0.0175, s0: 0.07, p1: 0.1225, s1: 0.175, p2: 0.2275 }
  function makeUnit() {
    const group = new THREE.Group()
    const spacerMat = new THREE.MeshStandardMaterial({ color: '#c0c6cc', roughness: 0.35, metalness: 0.85 })
    const gasMat = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0, roughness: 0.2, depthWrite: false })
    const panes = [LAYER.p0, LAYER.p1, LAYER.p2].map(y => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.035, 0.9), paneMat)
      p.position.y = y
      p.renderOrder = 2
      group.add(p)
      return p
    })
    const spacers = [LAYER.s0, LAYER.s1].map(y => {
      const f = spacerFrame(spacerMat)
      f.position.y = y
      group.add(f)
      return f
    })
    const fills = [LAYER.s0, LAYER.s1].map(y => {
      const f = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.065, 0.8), gasMat)
      f.position.y = y
      f.renderOrder = 1
      group.add(f)
      return f
    })
    // the red plug in the first spacer's corner, a small cap
    const plugMat = new THREE.MeshStandardMaterial({ color: '#e0453a', emissive: '#e0453a', emissiveIntensity: 0.9, roughness: 0.4 })
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 12), plugMat)
    plug.position.set(0.54, LAYER.s0 + 0.005, 0.405)
    plug.rotation.x = Math.PI / 2
    group.add(plug)
    plug.visible = false
    const u = {
      group,
      panes,
      spacers,
      fills,
      plug,
      spacerMat,
      gasMat,
      plugMat,
      layers: 1,
      coated: false,
      // how many layers show (1 = the bottom pane only; 3 = the whole stack), the coating on the bottom pane
      setLayers(k) {
        u.layers = k
        panes[1].visible = k >= 2
        panes[2].visible = k >= 3
        spacers[0].visible = k >= 2
        spacers[1].visible = k >= 3
        fills[0].visible = k >= 2
        fills[1].visible = k >= 3
      },
      setCoated(c) {
        u.coated = c
        panes[0].material = c ? coatedMat : paneMat
      },
      setGas(id, k) {
        const c = id ? GAS_C[id] : SPACER_C
        gasMat.color.copy(c)
        gasMat.opacity = id ? 0.42 * k : 0
        spacerMat.color.copy(k > 0.99 || !id ? c : SPACER_C.clone().lerp(c, k))
        spacerMat.emissive.copy(id ? c : new THREE.Color(0))
        spacerMat.emissiveIntensity = id ? 0.25 * k : 0
      },
      dispose() {
        group.removeFromParent()
        spacerMat.dispose()
        gasMat.dispose()
        plugMat.dispose()
      },
    }
    u.setLayers(1)
    u.setGas(null, 0)
    return u
  }
  let unit = null
  const placed = { air: [], argon: [], krypton: [] }
  const rackSlotX = i => -8 + (i - 1) * 1.3
  const newUnit = () => {
    unit?.group.removeFromParent()
    unit = makeUnit()
    unit.group.position.set(BX, BELT_Y, ZS.pane)
    root.add(unit.group)
    return unit
  }
  const lineHit = {}
  // hit shapes that stay put in the list of taps and follow whichever unit is on the belt
  lineHit.unit = hit(1.3, 0.4, 1.0, BX, BELT_Y + 0.15, ZS.pane)
  clickable(lineHit.unit, () => lineStep('pane'), { reach: 7, when: () => !!unit })
  lineHit.plug = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), ghost)
  root.add(lineHit.plug)
  clickable(lineHit.plug, () => lineStep('plug'), { reach: 7, when: () => !!unit?.plug.visible })
  // taps that stay put: the spacer table, the three bottles, the pane pallet
  lineHit.table = hit(1.1, 0.4, 1.4, TABLE.x, 1.02, TABLE.z)
  clickable(lineHit.table, () => lineStep('spacer'), { reach: 6 })
  lineHit.pallet = hit(1.0, 1.3, 1.5, -9.8, 0.8, 3.5)
  clickable(lineHit.pallet, () => lineStep('pane'), { reach: 7 })
  for (const id of LINE_GASES) {
    lineHit[id] = hit(0.36, BOTTLE_H + 0.15, 0.36, BOTTLE.x, (BOTTLE_H + 0.15) / 2, BOTTLE.z[id])
    clickable(lineHit[id], () => lineStep(id), { reach: 6 })
  }

  // ---- the line's state (shared): where the unit is, the gas, how many of each stand on the rack ----
  // `L` is what is true at the end of whatever is moving; `anim` is the motion itself
  const L = { phase: 'p0', gas: null, racks: { air: 0, argon: 0, krypton: 0 } }
  let lineN = 0
  let anim = null
  let gaugePct = 0
  let lineMine = false
  const lineSay = (key, lv) => say(at(E.line.says[key], lv))
  const lineHint = () => {
    const h = E.line.hints
    if (anim) return h.wait
    return { p0: h.pane, p2: h.spacer, p3: h.gas, p4: h.plug }[L.phase]
  }
  const linePanel = lv => ({
    title: E.line.title,
    color,
    blocks: [{ buttons: ['pane', 'spacer', 'air', 'argon', 'krypton', 'plug'].map(k => ({ label: E.line.buttons[k], onClick: () => lineStep(k) })) }, ...paras(E.line.panel, lv)],
  })
  function lineFirst(find, delay = 2.6) {
    lineMine = true
    ex.discover(find, linePanel, delay)
    share('line')
  }
  // the hose from the press head to the chosen bottle
  function setHose(id) {
    if (hoseMesh) {
      hoseMesh.removeFromParent()
      hoseMesh.geometry.dispose()
      hoseMesh = null
    }
    if (!id) return
    const from = new THREE.Vector3(BOTTLE.x, BOTTLE_H + 0.08, BOTTLE.z[id])
    const to = new THREE.Vector3(BX + 0.5, 1.82, PRESS.z + 0.33)
    const mid1 = new THREE.Vector3(from.x, 1.35, from.z)
    const mid2 = new THREE.Vector3((from.x + to.x) / 2, 1.6, (from.z + to.z) / 2)
    const path = new THREE.CatmullRomCurve3([from, mid1, mid2, to.clone().add(new THREE.Vector3(0, 0.25, 0)), to])
    hoseMesh = new THREE.Mesh(new THREE.TubeGeometry(path, 24, 0.022, 8, false), hoseMat)
    root.add(hoseMesh)
  }
  // the unit's pose for each resting phase
  function poseUnit(phase) {
    if (!unit) newUnit()
    const g = unit.group
    if (phase === 'p0') {
      g.position.set(BX, BELT_Y, ZS.pane)
      unit.setLayers(1)
      unit.setCoated(false)
      unit.setGas(null, 0)
    } else if (phase === 'p2') {
      g.position.set(BX, BELT_Y, ZS.spacer)
      unit.setLayers(1)
      unit.setCoated(true)
      unit.setGas(null, 0)
    } else if (phase === 'p3') {
      g.position.set(BX, BELT_Y, ZS.spacer)
      unit.setLayers(3)
      unit.setCoated(true)
      unit.setGas(null, 0)
    } else if (phase === 'p4') {
      g.position.set(BX, BELT_Y, ZS.press)
      unit.setLayers(3)
      unit.setCoated(true)
      unit.setGas(L.gas, 1)
    }
    unit.plug.visible = phase === 'p4'
    unit.plugMat.color.set('#e0453a')
    unit.plugMat.emissive.set('#e0453a')
    gaugePct = phase === 'p4' ? 90 : 0
    headGroup.position.y = phase === 'p4' ? 1.78 : 2.0
    setHose(phase === 'p4' ? L.gas : null)
  }
  // finished windows on the rack, as many as were made (the shelf holds three, newest replaces oldest)
  function buildRack() {
    for (const id of LINE_GASES) {
      for (const u of placed[id]) u.dispose()
      placed[id] = []
      const count = Math.min(3, L.racks[id])
      for (let i = 0; i < count; i++) {
        const u = makeUnit()
        u.setLayers(3)
        u.setCoated(true)
        u.setGas(id, 1)
        u.group.position.set(rackSlotX(i), SHELF_Y[id], ZS.shelf)
        root.add(u.group)
        placed[id].push(u)
      }
    }
  }
  const lineStable = () => ({ n: lineN, phase: L.phase, gas: L.gas, racks: [L.racks.air, L.racks.argon, L.racks.krypton] })
  /** The next thing to do from a resting phase, as a step name. */
  const AFTER = { p0: 'p2', p2: 'p3', p3: 'p4', p4: 'p0' }
  const nextStep = (phase, gas) => ({ p0: 'pane', p2: 'spacer', p3: gas, p4: 'plug' }[phase])
  function lineStep(step, mine = true) {
    const lv = level()
    if (anim) return mine ? say(at(W.busy, lv)) : false
    const isGas = LINE_GASES.includes(step)
    const ok = (step === 'pane' && L.phase === 'p0') || (step === 'spacer' && L.phase === 'p2') || (isGas && L.phase === 'p3') || (step === 'plug' && L.phase === 'p4')
    if (!ok) {
      if (!mine) return false
      // the wrong tap: the Atomling says what the line is waiting for
      if (isGas && L.phase === 'p4') return lineSay('filled', lv)
      if (step === 'pane' && L.phase !== 'p0') return lineSay('paneBusy', lv)
      return say(at(lineHint(), lv))
    }
    lineN++
    const S = E.line.says
    if (step === 'pane') {
      L.phase = 'p2'
      anim = {
        t: 0,
        dur: 3.4,
        tick: u => {
          const z = lerp(ZS.pane, ZS.spacer, ease(u))
          unit.group.position.z = z
          if (z < COAT.z + 0.1 && !unit.coated) unit.setCoated(true)
          const inside = Math.max(0, 1 - Math.abs(z - COAT.z) / (COAT.len / 2 + 0.3))
          sputter.intensity = 14 * inside
          slitMat.emissiveIntensity = 0.2 + 1.4 * inside
        },
        done: () => {
          sputter.intensity = 0
          slitMat.emissiveIntensity = 0.2
          if (mine) lineSay('coated', level())
        },
      }
      play('beam')
      if (mine) lineFirst('line')
    } else if (step === 'spacer') {
      L.phase = 'p3'
      unit.setLayers(1)
      const parts = [
        { obj: unit.spacers[0], fill: unit.fills[0], at: 0, from: 0.15 },
        { obj: unit.panes[1], at: 0.2, from: 0.35 },
        { obj: unit.spacers[1], fill: unit.fills[1], at: 0.45, from: 0.55 },
        { obj: unit.panes[2], at: 0.65, from: 0.75 },
      ]
      for (const p of parts) {
        p.obj.visible = false
        if (p.fill) p.fill.visible = false
      }
      const tx = TABLE.x - BX
      anim = {
        t: 0,
        dur: 2.8,
        tick: u => {
          parts.forEach((p, i) => {
            const k = clamp((u - p.at) / 0.25)
            p.obj.visible = k > 0
            if (p.fill) p.fill.visible = k > 0.9
            const e = ease(k)
            const y = i === 0 ? LAYER.s0 : i === 1 ? LAYER.p1 : i === 2 ? LAYER.s1 : LAYER.p2
            p.obj.position.set(lerp(tx, 0, e), y + (1 - e) * 0.5 * Math.sin(Math.PI * Math.min(1, 0.2 + e)), lerp(0.1, 0, e))
          })
        },
        done: () => {
          unit.setLayers(3)
          if (mine) lineSay('stacked', level())
        },
      }
      play('select')
      if (mine) lineFirst('line', 3.2)
    } else if (isGas) {
      L.phase = 'p4'
      L.gas = step
      setHose(step)
      anim = {
        t: 0,
        dur: 4.4,
        tick: u => {
          // the unit rolls to the press, the head lowers, the gas climbs
          const move = span(0, 0.25, u)
          unit.group.position.z = lerp(ZS.spacer, ZS.press, move)
          headGroup.position.y = lerp(2.0, 1.78, span(0.2, 0.32, u))
          const fillK = span(0.3, 0.95, u)
          gaugePct = Math.round(90 * fillK)
          unit.setGas(step, fillK)
          unit.plug.visible = u > 0.3
        },
        done: () => {
          gaugePct = 90
          unit.setGas(step, 1)
          unit.plug.visible = true
          if (mine) lineSay(step, level())
        },
      }
      play('fizz', { order: 0.8 })
      if (mine) lineFirst('press')
    } else if (step === 'plug') {
      const gas = L.gas
      const slot = L.racks[gas] % 3
      L.racks[gas]++
      L.phase = 'p0'
      const u0 = unit
      u0.plugMat.color.set('#4b535d')
      u0.plugMat.emissive.set('#000000')
      play('select')
      const old = placed[gas][slot]
      anim = {
        t: 0,
        dur: 3.2,
        tick: u => {
          const a = span(0, 0.3, u)
          const b = span(0.3, 0.8, u)
          const g = u0.group.position
          if (u < 0.3) g.set(BX, BELT_Y, lerp(ZS.press, ZS.endBelt, a))
          else g.set(lerp(BX, rackSlotX(slot), b), lerp(BELT_Y, SHELF_Y[gas], b) + Math.sin(Math.PI * b) * 0.25, lerp(ZS.endBelt, ZS.shelf, b))
          if (u > 0.5 && old && old.group.visible) old.group.visible = false
          headGroup.position.y = lerp(1.78, 2.0, span(0, 0.2, u))
          if (u > 0.8) {
            const arrive = span(0.8, 1, u)
            if (!unit || unit === u0) {
              unit = null
              newUnit()
              unit.group.position.z = lerp(4.0, ZS.pane, arrive)
              unit.setLayers(1)
            } else unit.group.position.z = lerp(4.0, ZS.pane, arrive)
          }
        },
        done: () => {
          if (old) old.dispose()
          placed[gas][slot] = u0
          gaugePct = 0
          setHose(null)
          if (mine) lineSay('sealed' + gas[0].toUpperCase() + gas.slice(1), level())
        },
      }
      if (mine) lineFirst('press', 4)
    }
    return true
  }
  // the gauge: gas name and the percentage of the gap that is gas, a bar
  let gaugeKey = ''
  const drawGauge = lv => {
    const { g, w, h } = gauge
    const k = `${lv}|${gaugePct}|${L.phase}|${L.gas}`
    if (k === gaugeKey) return
    gaugeKey = k
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'center'
    g.fillStyle = '#9fb4ff'
    fit(g, E.line.board.title, w / 2, 52, 40, 700, w - 40)
    const c = L.gas && (L.phase === 'p4') ? GAS[L.gas].hex : '#7b86a8'
    g.fillStyle = c
    fit(g, L.gas && L.phase === 'p4' ? gasName(L.gas) : '–', w / 2, 120, 58, 700, w - 40)
    g.fillStyle = '#ffffff'
    g.font = '700 84px Outfit'
    g.fillText(`${gaugePct} %`, w / 2, 215)
    g.fillStyle = '#1c2552'
    g.fillRect(34, 250, w - 68, 36)
    g.fillStyle = c
    g.fillRect(34, 250, ((w - 68) * gaugePct) / 100, 36)
    g.fillStyle = '#9fb4ff'
    fit(g, at(E.line.board.note, lv), w / 2, 322, 28, 500, w - 40)
    gauge.tex.needsUpdate = true
  }
  redraws.push(drawGauge)
  ex.add({
    id: 'line',
    x: -3.7,
    z: 1.3,
    radius: 2.6,
    manual: true,
    label: E.line.label,
    verb: lineHint,
    focus: focusOf(-8, 1.2, 1.1, 3.4, 5.6),
    act: () => ctx.showPanel(linePanel),
  })
  ex.add({
    id: 'press',
    x: -3.7,
    z: -2.7,
    radius: 2.6,
    manual: true,
    label: E.line.labelPress,
    verb: lineHint,
    focus: focusOf(-7.5, 1.2, -3.0, 3.4, 5.6),
    act: () => ctx.showPanel(linePanel),
  })
  updates.push((dt, t) => {
    if (anim) {
      anim.t += dt
      const u = clamp(anim.t / anim.dur)
      anim.tick(u)
      if (u >= 1) {
        const done = anim.done
        anim = null
        done?.()
      }
    }
    if (unit) {
      lineHit.unit.position.set(unit.group.position.x, unit.group.position.y + 0.15, unit.group.position.z)
      lineHit.plug.position.copy(unit.plug.getWorldPosition(new THREE.Vector3()))
    }
    coatedMat.emissiveIntensity = 0.3 + 0.2 * Math.sin(t * 2.2)
    if (unit) unit.plugMat.emissiveIntensity = unit.plugMat.color.getHex() === 0xe0453a ? 0.7 + 0.4 * Math.sin(t * 5) : 0
  })
  newUnit()
  poseUnit('p0')
  /** What a tap does to the line for someone else's or a saved state: put everything as it stands. */
  function lineSnap(s) {
    anim = null
    sputter.intensity = 0
    slitMat.emissiveIntensity = 0.2
    L.phase = ['p0', 'p2', 'p3', 'p4'].includes(s?.phase) ? s.phase : 'p0'
    L.gas = LINE_GASES.includes(s?.gas) ? s.gas : null
    if (L.phase === 'p4' && !L.gas) L.phase = 'p3'
    const r = Array.isArray(s?.racks) ? s.racks : [0, 0, 0]
    LINE_GASES.forEach((id, i) => (L.racks[id] = clamp(Math.round(Number(r[i]) || 0), 0, 999)))
    lineN = Math.max(0, Math.round(Number(s?.n) || 0))
    newUnit()
    poseUnit(L.phase)
    buildRack()
  }

  // ======================================================================================================
  // station 2: the giant gap on the north-east bench
  // ======================================================================================================
  const GAPB = { x: 6.0, z: -3.6, top: 0.9 }
  const HOT_X = 5.25 // the hot plate's inner face
  const GY0 = 0.97
  const GY1 = 2.07
  const GZ = 0.26
  const gap = { gas: 'air', mm: W_START, coat: false }
  let gapMine = false
  const widthM = () => (gap.mm * SCALE) / 1000
  const hotMat = new THREE.MeshStandardMaterial({ color: '#d9532a', emissive: '#ff6a2a', emissiveIntensity: 0.65, roughness: 0.5 })
  const coldMat = new THREE.MeshStandardMaterial({ color: '#3f8fe0', emissive: '#4aa3ff', emissiveIntensity: 0.45, roughness: 0.4 })
  const filmMat = new THREE.MeshStandardMaterial({ color: '#f1d98a', emissive: '#d9a62a', emissiveIntensity: 0.5, transparent: true, opacity: 0.8, roughness: 0.2, metalness: 0.5 })
  const GB = new THREE.Group()
  root.add(GB)
  const hotPlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, GY1 - GY0, GZ * 2 + 0.1), hotMat)
  hotPlate.position.set(HOT_X - 0.07, (GY0 + GY1) / 2, GAPB.z)
  const coldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, GY1 - GY0, GZ * 2 + 0.1), coldMat)
  const film = new THREE.Mesh(new THREE.BoxGeometry(0.012, GY1 - GY0 - 0.04, GZ * 2 + 0.06), filmMat)
  film.visible = false
  GB.add(hotPlate, coldPlate, film)
  {
    // the bench, a top and a base; glass front and back keep the atoms in (clear), a steel cap above and below
    solid(new THREE.BoxGeometry(5.3, 0.1, 1.1), GB, GAPB.x - 0.2, GAPB.top - 0.05, GAPB.z, mats.bench)
    for (const [dx, dz] of [[-2.7, -0.47], [2.3, -0.47], [-2.7, 0.47], [2.3, 0.47]]) solid(new THREE.BoxGeometry(0.09, GAPB.top - 0.1, 0.09), GB, GAPB.x + dx - 0.2 + 0.2, (GAPB.top - 0.1) / 2, GAPB.z + dz, mats.dark)
    solid(new THREE.BoxGeometry(5.2, GAPB.top - 0.1 - 0.06, 0.04), GB, GAPB.x - 0.2, (GAPB.top - 0.1) / 2, GAPB.z - 0.52, mats.dark)
    solids.push(box(GAPB.x - 0.2, GAPB.z, 5.3, 1.1))
    // the unit's top and bottom edges: caps over the plates
    const capBottom = solid(new THREE.BoxGeometry(1.4, 0.04, GZ * 2 + 0.1), GB, HOT_X + 0.5, GY0 - 0.02, GAPB.z, mats.steel)
    capBottom.userData.cap = true
    // the air above is open at the front: the atoms are held by an invisible wall
    const t = sign(E.gap.signs.warm, 0.15, { maxWidth: 1.4, anchorX: 'right' })
    t.position.set(HOT_X - 0.1, GY1 + 0.2, GAPB.z + 0.1)
    GB.add(t)
    const t2 = sign(E.gap.signs.cold, 0.12, { maxWidth: 1.4, anchorX: 'left' })
    GB.add(t2)
    GB.userData.coldLabel = t2
  }
  // the capping glass: a clear lid and base of the gap that moves with the cold plate
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1, 0.03, GZ * 2 + 0.1), mats.steel)
  lid.position.y = GY1 + 0.015
  const base = new THREE.Mesh(new THREE.BoxGeometry(1, 0.03, GZ * 2 + 0.1), mats.steel)
  base.position.y = GY0 - 0.015
  GB.add(lid, base)
  // four bottles: air, argon, krypton, xenon, at the bench's west end
  const GB_BOTTLES = { air: 3.75, argon: 4.11, krypton: 4.47, xenon: 4.83 }
  const gapHit = {}
  for (const id of GAS_IDS) {
    const b = new THREE.Group()
    b.position.set(GB_BOTTLES[id], GAPB.top, GAPB.z + 0.1)
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#3a4350', roughness: 0.4, metalness: 0.6 })
    const shoulderMat = new THREE.MeshStandardMaterial({ color: GAS[id].hex, roughness: 0.4, metalness: 0.3, emissive: GAS[id].hex, emissiveIntensity: 0.25 })
    solid(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 16), b, 0, 0.275, 0, bodyMat)
    solid(new THREE.SphereGeometry(0.07, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), b, 0, 0.55, 0, shoulderMat)
    solid(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8), b, 0, 0.65, 0, mats.steel)
    solid(new THREE.CylinderGeometry(0.073, 0.073, 0.07, 16), b, 0, 0.22, 0, shoulderMat)
    const t = sign(gasName(id), 0.072, { maxWidth: 0.6 })
    t.position.set(0, 0.8, 0.02)
    b.add(t)
    GB.add(b)
    gapHit[id] = hit(0.24, 0.8, 0.24, GB_BOTTLES[id], GAPB.top + 0.4, GAPB.z + 0.1)
    clickable(gapHit[id], () => gapStep(id), { reach: 6 })
  }
  gapHit.coat = hit(0.5, GY1 - GY0, GZ * 2 + 0.1, 0, (GY0 + GY1) / 2, GAPB.z)
  clickable(gapHit.coat, () => gapStep('coat'), { reach: 7 })
  // the ruler under the gap: millimetres of real gap, a gold mark at each gas's best width
  const rulerTex = (() => {
    const c = document.createElement('canvas')
    c.width = 1088
    c.height = 64
    const g = c.getContext('2d')
    g.fillStyle = '#10163a'
    g.fillRect(0, 0, 1088, 64)
    g.fillStyle = '#9fb4ff'
    g.font = '600 22px Outfit'
    g.textAlign = 'center'
    for (let mm = 0; mm <= 24; mm++) {
      const x = 4 + (mm / 24) * 1080
      g.fillRect(x - 1, 0, 2, mm % 4 === 0 ? 28 : 14)
      if (mm % 4 === 0) g.fillText(String(mm), x, 54)
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    textures.push(t)
    return t
  })()
  const ruler = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.064), new THREE.MeshBasicMaterial({ map: rulerTex, toneMapped: false, color: '#cfcfcf' }))
  ruler.position.set(HOT_X + 0.54 + 0.0, GAPB.top + 0.04, GAPB.z + 0.62)
  ruler.rotation.x = -Math.PI / 2 + 0.5
  GB.add(ruler)
  const bestMark = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 4), new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffd166', emissiveIntensity: 1.1 }))
  bestMark.rotation.x = Math.PI
  GB.add(bestMark)
  const bestLabel = sign('', 0.075, { color: '#ffd166', maxWidth: 1.2 })
  GB.add(bestLabel)
  let bestLabelText = ''
  // the atoms: 34 in the gap, colour by the heat they carry
  const NA = 34
  const aPos = new Float32Array(NA * 3)
  const aVel = new Float32Array(NA * 3)
  const aHeat = new Float32Array(NA)
  const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.05, emissive: '#262626', emissiveIntensity: 1 }), NA)
  atoms.frustumCulled = false
  atoms.raycast = () => {}
  atoms.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  atoms.setColorAt(0, new THREE.Color('#ffffff'))
  GB.add(atoms)
  const COLD_C = new THREE.Color('#4aa3ff')
  const HOT_C = new THREE.Color('#ff7a3a')
  const tmpC = new THREE.Color()
  const dummy = new THREE.Object3D()
  for (let i = 0; i < NA; i++) {
    aPos[i * 3] = HOT_X + 0.1 + Math.random() * 0.5
    aPos[i * 3 + 1] = GY0 + 0.1 + Math.random() * (GY1 - GY0 - 0.2)
    aPos[i * 3 + 2] = GAPB.z + (Math.random() - 0.5) * (GZ * 2 - 0.1)
    aHeat[i] = Math.random()
    const a = Math.random() * Math.PI * 2
    const b = Math.random() * 2 - 1
    const s = Math.sqrt(1 - b * b)
    aVel[i * 3] = Math.cos(a) * s
    aVel[i * 3 + 1] = b
    aVel[i * 3 + 2] = Math.sin(a) * s
  }
  const V0 = 1.15 // m/s, the air's atoms in the model
  function stepAtoms(dt) {
    const g = GAS[gap.gas]
    const vr = g.speed * V0
    const r = g.r
    const xa = HOT_X + r
    const xb = HOT_X + widthM() - r
    const ya = GY0 + r
    const yb = GY1 - r
    const za = GAPB.z - GZ + r
    const zb = GAPB.z + GZ - r
    const h = heatThrough(gap.gas, gap.mm, gap.coat)
    const roll = clamp((h.nu - 1) * 4, 0, 1.4)
    const mid = HOT_X + widthM() / 2
    const sub = 2
    for (let s = 0; s < sub; s++) {
      const d = dt / sub
      for (let i = 0; i < NA; i++) {
        const k = i * 3
        // rolling: the gas rises along the hot plate and falls along the cold one
        if (roll > 0.05) aVel[k + 1] += (aPos[k] < mid ? 1 : -1) * roll * 1.2 * d
        aPos[k] += aVel[k] * vr * d
        aPos[k + 1] += aVel[k + 1] * vr * d
        aPos[k + 2] += aVel[k + 2] * vr * d
        if (aPos[k] < xa) {
          aPos[k] = xa
          aVel[k] = Math.abs(aVel[k]) + 0.2
          aHeat[i] = lerp(aHeat[i], 1, 0.8)
        } else if (aPos[k] > xb) {
          aPos[k] = xb
          aVel[k] = -Math.abs(aVel[k]) - 0.2
          aHeat[i] = lerp(aHeat[i], 0, 0.8)
        }
        if (aPos[k + 1] < ya) {
          aPos[k + 1] = ya
          aVel[k + 1] = Math.abs(aVel[k + 1])
        } else if (aPos[k + 1] > yb) {
          aPos[k + 1] = yb
          aVel[k + 1] = -Math.abs(aVel[k + 1])
        }
        if (aPos[k + 2] < za) {
          aPos[k + 2] = za
          aVel[k + 2] = Math.abs(aVel[k + 2])
        } else if (aPos[k + 2] > zb) {
          aPos[k + 2] = zb
          aVel[k + 2] = -Math.abs(aVel[k + 2])
        }
      }
      // bumps: equal masses swap what they carry along the line between them, and share their heat
      for (let i = 0; i < NA; i++) {
        for (let j = i + 1; j < NA; j++) {
          const dx = aPos[j * 3] - aPos[i * 3]
          const dy = aPos[j * 3 + 1] - aPos[i * 3 + 1]
          const dz = aPos[j * 3 + 2] - aPos[i * 3 + 2]
          const dd = dx * dx + dy * dy + dz * dz
          if (dd < 4 * r * r && dd > 1e-8) {
            const l = Math.sqrt(dd)
            const nx = dx / l
            const ny = dy / l
            const nz = dz / l
            const rel = (aVel[j * 3] - aVel[i * 3]) * nx + (aVel[j * 3 + 1] - aVel[i * 3 + 1]) * ny + (aVel[j * 3 + 2] - aVel[i * 3 + 2]) * nz
            if (rel < 0) {
              for (const [q, c] of [[0, nx], [1, ny], [2, nz]]) {
                aVel[i * 3 + q] += rel * c
                aVel[j * 3 + q] -= rel * c
              }
              const m = (aHeat[i] + aHeat[j]) / 2
              aHeat[i] = lerp(aHeat[i], m, 0.5)
              aHeat[j] = lerp(aHeat[j], m, 0.5)
            }
          }
        }
      }
    }
    // keep the speeds near the gas's own (collisions alone drift them)
    for (let i = 0; i < NA; i++) {
      const k = i * 3
      const sp = Math.hypot(aVel[k], aVel[k + 1], aVel[k + 2]) || 1
      const want = 0.75 + 0.5 * aHeat[i]
      const f = lerp(1, want / sp, Math.min(1, dt * 1.6))
      aVel[k] *= f
      aVel[k + 1] *= f
      aVel[k + 2] *= f
    }
    for (let i = 0; i < NA; i++) {
      dummy.position.set(aPos[i * 3], aPos[i * 3 + 1], aPos[i * 3 + 2])
      dummy.scale.setScalar(r)
      dummy.updateMatrix()
      atoms.setMatrixAt(i, dummy.matrix)
      atoms.setColorAt(i, tmpC.copy(COLD_C).lerp(HOT_C, aHeat[i]))
    }
    atoms.instanceMatrix.needsUpdate = true
    atoms.instanceColor.needsUpdate = true
  }
  // infrared: rays leaving the warm plate; the coating sends them back
  const rays = []
  {
    const rayMat = new THREE.MeshStandardMaterial({ color: '#ff5a3c', emissive: '#ff5a3c', emissiveIntensity: 1.3, transparent: true, opacity: 0.9 })
    for (let i = 0; i < 5; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 8), rayMat.clone())
      cone.rotation.z = -Math.PI / 2
      cone.position.z = GAPB.z + 0.2 - (i % 2) * 0.1
      GB.add(cone)
      rays.push({ cone, y: GY0 + 0.12 + (i + 0.5) * ((GY1 - GY0 - 0.24) / 5), ph: i * 0.2 + (i % 2) * 0.07 })
    }
  }
  let coldFlash = 0
  function updateGapView(t, dt) {
    const wm = widthM()
    coldPlate.position.set(HOT_X + wm + 0.07, (GY0 + GY1) / 2, GAPB.z)
    film.position.set(HOT_X + wm - 0.006, (GY0 + GY1) / 2, GAPB.z)
    film.visible = gap.coat
    filmMat.emissiveIntensity = 0.35 + 0.2 * Math.sin(t * 2.4)
    lid.scale.x = wm + 0.04
    lid.position.x = HOT_X + wm / 2
    base.scale.x = wm + 0.04
    base.position.x = HOT_X + wm / 2
    GB.userData.coldLabel.position.set(HOT_X + wm + 0.16, GY1 + 0.2, GAPB.z + 0.1)
    gapHit.coat.scale.x = 1
    gapHit.coat.position.x = HOT_X + wm + 0.07
    for (const r of rays) {
      const u = (t * 0.45 + r.ph) % 1
      let s
      let a
      let dir = 1
      if (gap.coat) {
        const out = 0.55
        if (u < out) {
          s = u / out
          a = 1
        } else {
          s = 1 - (u - out) / (1 - out)
          dir = -1
          a = 1 - (u - out) / (1 - out) * 0.9
        }
      } else {
        s = u
        a = 1 - span(0.85, 1, u)
        if (u > 0.9) coldFlash = Math.min(1, coldFlash + dt * 3)
      }
      r.cone.position.set(HOT_X + 0.06 + s * (wm - 0.12), r.y, r.cone.position.z)
      r.cone.rotation.z = (dir > 0 ? -1 : 1) * (Math.PI / 2)
      r.cone.material.opacity = a * 0.9
    }
    coldFlash = damp(coldFlash, 0, 3, dt)
    coldMat.emissiveIntensity = 0.45 + (gap.coat ? 0 : 0.7 * coldFlash)
    hotMat.emissiveIntensity = 0.65 + 0.15 * Math.sin(t * 3)
    // the best width of this gas, a gold mark on the ruler
    const best = BEST[gap.gas]
    bestMark.position.set(HOT_X + (best * SCALE) / 1000, GAPB.top + 0.09, GAPB.z + 0.58)
    bestLabel.position.set(HOT_X + (best * SCALE) / 1000, GAPB.top + 0.2, GAPB.z + 0.58)
    bestLabel.rotation.x = -0.35
    const txt = fill(E.gap.signs.best, { mm: nf(Math.round(best)) })
    if (txt !== bestLabelText) {
      bestLabelText = txt
      bestLabel.text = txt
      bestLabel.sync()
    }
  }
  // the heat meter, on a stand at the bench's east end
  const heat = screen(1.5, 1.2, 640)
  heat.group.position.set(8.05, 1.7, GAPB.z + 0.05)
  root.add(heat.group)
  solid(new THREE.BoxGeometry(0.08, 0.8, 0.08), root, 8.05, 0.9 + 0.4 - 0.1, GAPB.z - 0.05, mats.dark)
  let heatKey = ''
  const drawHeat = lv => {
    const key = `${lv}|${gap.gas}|${gap.mm}|${gap.coat}`
    if (key === heatKey) return
    heatKey = key
    const { g, w, h } = heat
    const r = heatThrough(gap.gas, gap.mm, gap.coat)
    const air = heatThrough('air', gap.mm, false)
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'left'
    g.fillStyle = GAS[gap.gas].hex
    fit(g, `${gasName(gap.gas)}, ${gap.mm} mm${gap.coat ? ', ' + E.gap.meter.coated : ''}`, 30, 46, 42, 700, w - 60)
    g.fillStyle = '#9fb4ff'
    fit(g, E.gap.meter.title, 30, 80, 24, 500, w - 60)
    g.fillStyle = '#ffffff'
    g.font = '700 96px Outfit'
    g.fillText(nf(Math.round(r.total)), 30, 176)
    const nw = g.measureText(nf(Math.round(r.total))).width
    g.fillStyle = '#9fb4ff'
    g.font = '600 34px Outfit'
    g.fillText('W/m²', 30 + nw + 14, 176)
    // the stacked bar: 120 W/m2 fills it (a wide gap of plain air with bare glass runs off the end)
    const x0 = 30
    const bw = w - 60
    const max = 120
    g.fillStyle = '#1c2552'
    g.fillRect(x0, 196, bw, 44)
    let x = x0
    const parts = [
      [r.cond, '#7fd1a6', E.gap.meter.conduction],
      [r.roll, '#d9a62a', E.gap.meter.rolling],
      [r.rad, '#ff6a4a', E.gap.meter.rays],
    ]
    for (const [v, c] of parts) {
      const pw = Math.min(x0 + bw - x, (v / max) * bw)
      if (pw <= 0) continue
      g.fillStyle = c
      g.fillRect(x, 196, pw, 44)
      x += pw
    }
    // the plain air's own mark at this width
    const ax = x0 + Math.min(1, air.total / max) * bw
    g.fillStyle = '#ffffff'
    g.fillRect(ax - 2, 188, 4, 60)
    g.font = '500 22px Outfit'
    g.textAlign = ax > w * 0.6 ? 'right' : 'left'
    g.fillText(E.gap.meter.airMark, ax + (ax > w * 0.6 ? -8 : 8), 268)
    g.textAlign = 'left'
    let ly = 320
    for (const [v, c, label] of parts) {
      g.fillStyle = c
      g.fillRect(30, ly - 22, 24, 24)
      g.fillStyle = '#d2dbff'
      g.font = '500 28px Outfit'
      g.fillText(`${label}: ${nf(Math.round(v))}`, 66, ly)
      ly += 40
    }
    g.fillStyle = '#9fb4ff'
    if (depthOf(lv) === 'sci') {
      g.font = '500 24px Outfit'
      g.fillText(fill(E.gap.meter.sci, { k: nf(GAS[gap.gas].k, 4), nu: nf(r.nu, 2) }), 30, 456)
      g.fillText(fill(E.gap.meter.sci2, { dt: DT_GAP }), 30, 486)
    } else {
      wrap(g, fill(E.gap.meter.kid, { x: nf(r.total / Math.max(1, air.total), 2) }), 30, 456, 26, w - 60, 1.15)
    }
    heat.tex.needsUpdate = true
  }
  redraws.push(drawHeat)
  const gapPanel = lv => ({
    title: E.gap.title,
    color,
    blocks: [
      {
        slider: {
          label: E.gap.slider,
          min: W_MIN,
          max: W_MAX,
          step: 1,
          value: gap.mm,
          onInput: v => gapWidth(v),
          format: v => `${nf(v)} mm`,
          live: () => gap.mm,
        },
      },
      { buttons: [...GAS_IDS, 'coat'].map(k => ({ label: E.gap.buttons[k], onClick: () => gapStep(k) })) },
      ...paras(E.gap.panel, lv),
    ],
  })
  const gapChanged = () => {
    gapMine = true
    ex.discover('gap', gapPanel, 2.6)
    share('gap')
  }
  function gapStep(step, mine = true) {
    const lv = level()
    const S = E.gap.says
    if (GAS_IDS.includes(step)) {
      if (gap.gas === step) return say(at(S[step], lv))
      gap.gas = step
      play('tap')
      if (mine) say(at(S[step], lv))
    } else if (step === 'coat') {
      gap.coat = !gap.coat
      play(gap.coat ? 'select' : 'tap')
      if (mine) say(at(gap.coat ? S.coatOn : S.coatOff, lv))
    } else return
    gapChanged()
  }
  let gapSending = false
  let lastRoll = false
  function gapWidth(v) {
    gap.mm = clamp(Math.round(v), W_MIN, W_MAX)
    gapChanged()
    if (gapSending) return
    gapSending = true
    later(0.25, () => {
      gapSending = false
      share('gap')
    })
    const roll = heatThrough(gap.gas, gap.mm, gap.coat).nu > 1.12
    if (roll && !lastRoll) say(at(E.gap.says.rolling, level()))
    lastRoll = roll
  }
  ex.add({
    id: 'gap',
    x: 6.0,
    z: -0.5,
    radius: 2.6,
    manual: true,
    label: E.gap.label,
    verb: () => (gap.coat ? E.gap.hints.slide : E.gap.hints.coat),
    focus: focusOf(6.0, 1.45, GAPB.z, 2.8, 5.6),
    act: () => ctx.showPanel(gapPanel),
  })
  updates.push((dt, t) => {
    stepAtoms(Math.min(dt, 0.05))
    updateGapView(t, dt)
  })

  // ======================================================================================================
  // station 3: the test house on the east wall (wall x = 8.9, z 0.4 to 5.0), a cold chamber behind it
  // ======================================================================================================
  const WX = 8.9
  const WZ = [1.35, 2.7, 4.05]
  const outside = { t: T_OUT.start, cam: false, lens: false }
  let houseMine = false
  const wallMat = new THREE.MeshStandardMaterial({ color: '#a39478', roughness: 0.9 })
  const frameMat = new THREE.MeshStandardMaterial({ color: '#d9d6cf', roughness: 0.6 })
  const glassMats = WIN_IDS.map(() => new THREE.MeshStandardMaterial({ color: '#bfe6ea', emissive: '#000000', emissiveIntensity: 0, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.18, depthWrite: false }))
  const thermalWall = new THREE.Color()
  {
    const g = new THREE.Group()
    root.add(g)
    // the wall's pieces between and round the windows
    for (const [z0, z1] of [[-1.0, 0.8], [1.9, 2.15], [3.25, 3.5], [4.6, 5.0]]) solid(new THREE.BoxGeometry(0.26, 3.0, z1 - z0), g, WX, 1.5, (z0 + z1) / 2, wallMat)
    for (const z of WZ) {
      solid(new THREE.BoxGeometry(0.26, 0.95, WIN.w), g, WX, 0.475, z, wallMat)
      solid(new THREE.BoxGeometry(0.26, 3.0 - 2.3, WIN.w), g, WX, 2.65, z, wallMat)
      // the frame (white), the sill sticking into the room
      for (const [w, h, y] of [[WIN.w, 0.05, 0.975], [WIN.w, 0.05, 2.275]]) solid(new THREE.BoxGeometry(0.2, h, w), g, WX - 0.02, y, z, frameMat)
      for (const s of [-1, 1]) solid(new THREE.BoxGeometry(0.2, WIN.h, 0.05), g, WX - 0.02, 1.625, z + s * (WIN.w / 2 - 0.025), frameMat)
      solid(new THREE.BoxGeometry(0.3, 0.04, WIN.w + 0.1), g, WX - 0.2, 0.96, z, frameMat)
    }
    solids.push(box(WX, 2.0, 0.3, 6.0))
  }
  // the panes of each window and what lies between
  const winGlass = {}
  WIN_IDS.forEach((id, i) => {
    const z = WZ[i]
    const n = id === 'single' ? 1 : id === 'double' ? 2 : 3
    const xs = n === 1 ? [0] : n === 2 ? [-0.04, 0.04] : [-0.07, 0, 0.07]
    xs.forEach((dx, k) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.012, WIN.h - 0.05, WIN.w - 0.05), k === 0 ? glassMats[i] : paneMat)
      m.position.set(WX - 0.06 + dx, 1.625, z)
      m.renderOrder = 3
      root.add(m)
      if (k === 0) winGlass[id] = m
    })
    // the gaps' gas, a faint tint
    if (n > 1) {
      const c = id === 'double' ? GAS_C.air : GAS_C.krypton
      for (let k = 0; k < n - 1; k++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.01, WIN.h - 0.08, WIN.w - 0.08), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: id === 'double' ? 0.1 : 0.18, depthWrite: false }))
        m.position.set(WX - 0.06 + (xs[k] + xs[k + 1]) / 2, 1.625, z)
        root.add(m)
      }
    }
    // a thin gold film on a pane of the triple, as on the picture
    if (id === 'triple') {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.004, WIN.h - 0.08, WIN.w - 0.08), new THREE.MeshStandardMaterial({ color: '#f1d98a', emissive: '#d9a62a', emissiveIntensity: 0.25, transparent: true, opacity: 0.16, depthWrite: false }))
      m.position.set(WX - 0.06 + 0.035, 1.625, z)
      root.add(m)
    }
  })
  // the cold chamber behind the wall: a snowy porch with a lamp, a spruce, falling snow
  {
    const ch = new THREE.Group()
    root.add(ch)
    const snowFloor = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.6), stage.snowMaterial)
    snowFloor.rotation.x = -Math.PI / 2
    snowFloor.position.set(WX + 1.43, 0.014, 2.7)
    ch.add(snowFloor)
    const chamberWall = new THREE.MeshStandardMaterial({ color: '#2a3550', roughness: 0.8 })
    for (const z of [0.4, 5.0]) solid(new THREE.BoxGeometry(2.7, 3.2, 0.12), ch, WX + 1.45, 1.6, z, chamberWall)
    solids.push(box(WX + 1.5, 2.7, 3.0, 4.8))
    // a spruce and a lamp, warm against the snow
    const tree = new THREE.Group()
    tree.position.set(WX + 2.0, 0, 4.2)
    solid(new THREE.ConeGeometry(0.62, 1.7, 8), tree, 0, 1.0, 0, new THREE.MeshStandardMaterial({ color: '#1d3a2c', roughness: 0.9 }))
    solid(new THREE.ConeGeometry(0.45, 1.2, 8), tree, 0, 1.9, 0, new THREE.MeshStandardMaterial({ color: '#234535', roughness: 0.9 }))
    solid(new THREE.ConeGeometry(0.3, 0.7, 8), tree, 0, 2.55, 0, new THREE.MeshStandardMaterial({ color: '#8f9bb5', roughness: 1 }))
    ch.add(tree)
    const lampMat = new THREE.MeshStandardMaterial({ color: '#fff0d0', emissive: '#ffd59a', emissiveIntensity: 2.2 })
    solid(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 8), ch, WX + 1.8, 1.1, 1.0, mats.dark)
    solid(new THREE.SphereGeometry(0.14, 12, 10), ch, WX + 1.8, 2.25, 1.0, lampMat)
    const lampLight = new THREE.PointLight('#ffcf8a', light ? 5 : 7, 5, 1.6)
    lampLight.position.set(WX + 1.7, 2.1, 1.1)
    ch.add(lampLight)
    const cold = new THREE.PointLight('#8fb4ff', light ? 3 : 4, 6, 1.6)
    cold.position.set(WX + 1.0, 2.6, 3.4)
    ch.add(cold)
    const flakesC = stage.flakes({ x0: WX + 0.2, x1: WX + 2.6, z0: 0.5, z1: 4.9, y1: 3.1, count: 320, seed: 11, size: 0.07 })
    flakesC.k = 0.7
    updates.push(() => {
      flakesC.k = clamp(0.25 + (T_IN - outside.t) / 60, 0.2, 1)
    })
  }
  // the room's side: a cat asleep on the second sill, a mug on the third
  const catMat = new THREE.MeshStandardMaterial({ color: '#d98a3a', roughness: 0.9 })
  const mugMat = new THREE.MeshStandardMaterial({ color: '#c94a3c', roughness: 0.5 })
  const catGroup = new THREE.Group()
  {
    catGroup.position.set(WX - 0.22, 0.98, WZ[1] + 0.05)
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), catMat)
    body.scale.set(1.1, 0.7, 1.4)
    body.position.y = 0.12
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), catMat)
    head.position.set(-0.03, 0.14, -0.2)
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 4), catMat)
      ear.position.set(-0.03 + s * 0.05, 0.23, -0.2)
      catGroup.add(ear)
    }
    const tail = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 6, 14, Math.PI * 1.2), catMat)
    tail.rotation.x = Math.PI / 2
    tail.position.set(0.0, 0.05, 0.12)
    catGroup.add(body, head, tail)
    root.add(catGroup)
    const mug = new THREE.Group()
    mug.position.set(WX - 0.22, 0.98, WZ[2] - 0.2)
    solid(new THREE.CylinderGeometry(0.05, 0.045, 0.1, 14), mug, 0, 0.05, 0, mugMat)
    solid(new THREE.TorusGeometry(0.03, 0.01, 6, 10), mug, 0.06, 0.05, 0, mugMat)
    root.add(mug)
  }
  // a thermometer over the windows: the cold outside, the warm inside
  const thermo = sign('', 0.22, { color: '#bcd3ff', maxWidth: 4 })
  thermo.position.set(WX - 0.16, 2.72, WZ[1])
  thermo.rotation.y = -Math.PI / 2
  root.add(thermo)
  let thermoText = ''
  // a heat meter under each window
  const meters = WIN_IDS.map((id, i) => {
    const s = screen(1.0, 0.72, 400)
    s.group.position.set(WX - 0.17, 0.5, WZ[i])
    s.group.rotation.y = -Math.PI / 2
    root.add(s.group)
    return s
  })
  let metersKey = ''
  const drawMeters = lv => {
    const key = `${lv}|${outside.t}`
    if (key === metersKey) return
    metersKey = key
    WIN_IDS.forEach((id, i) => {
      const { g, w, h } = meters[i]
      const q = watts(U[id], outside.t)
      g.fillStyle = '#0d1233'
      g.fillRect(0, 0, w, h)
      g.textAlign = 'center'
      g.fillStyle = id === 'triple' ? GAS.krypton.hex : id === 'double' ? '#aab2bf' : '#ffb27a'
      fit(g, E.house.signs[id], w / 2, 46, 36, 700, w - 30)
      g.fillStyle = '#ffffff'
      g.font = '700 82px Outfit'
      g.fillText(`${nf(Math.round(q))} W`, w / 2, 140)
      const maxQ = watts(U.single, T_OUT.min)
      g.fillStyle = '#1c2552'
      g.fillRect(30, 162, w - 60, 20)
      g.fillStyle = id === 'triple' ? GAS.krypton.hex : id === 'double' ? '#aab2bf' : '#ff8a4a'
      g.fillRect(30, 162, (w - 60) * clamp(q / maxQ), 20)
      g.fillStyle = '#9fb4ff'
      if (depthOf(lv) === 'sci') fit(g, `U ≈ ${nf(U[id], 1)} W/(m²·K)`, w / 2, 218, 30, 500, w - 30)
      else wrap(g, id === 'triple' ? E.house.meter.best : fill(E.house.meter.kid, { x: nf(q / watts(U.triple, outside.t), 0) }), w / 2, 214, 30, w - 40, 1.1)
      meters[i].tex.needsUpdate = true
    })
  }
  redraws.push(drawMeters)
  // the thermal camera on its tripod, and the colour scale beside it
  const camGroup = new THREE.Group()
  const CAM = { x: 7.3, z: 5.5 }
  {
    camGroup.position.set(CAM.x, 0, CAM.z)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.4
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 1.3, 6), mats.dark)
      leg.position.set(Math.cos(a) * 0.22, 0.6, Math.sin(a) * 0.22)
      leg.rotation.z = Math.cos(a) * 0.17
      leg.rotation.x = -Math.sin(a) * 0.17
      camGroup.add(leg)
    }
    solid(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8), camGroup, 0, 1.3, 0, mats.dark)
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.2, 0.18, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#d9a62a', roughness: 0.5, metalness: 0.2 }))
    body.position.set(0.04, 1.5, 0)
    camGroup.add(body)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.14, 14), mats.dark)
    lens.rotation.z = Math.PI / 2
    lens.position.set(0.24, 1.5, 0)
    camGroup.add(lens)
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), new THREE.MeshStandardMaterial({ color: '#7d5cff', emissive: '#7d5cff', emissiveIntensity: 1.0 }))
    eye.rotation.z = Math.PI / 2
    eye.position.set(0.32, 1.5, 0)
    camGroup.add(eye)
    camGroup.rotation.y = -0.5
    root.add(camGroup)
    solids.push(circle(CAM.x, CAM.z, 0.3))
    const t = sign(E.house.signs.camera, 0.14, { maxWidth: 1.4 })
    t.position.set(CAM.x - 0.1, 1.85, CAM.z + 0.15)
    root.add(t)
  }
  const camHit = hit(0.7, 0.55, 0.5, CAM.x + 0.1, 1.5, CAM.z)
  clickable(camHit, () => houseStep('camera'), { reach: 7 })
  // the scale: a bar from -25 to 35 degrees with the three faces and the cat marked
  const legend = screen(1.3, 1.2, 520)
  legend.group.position.set(WX - 0.17, 1.6, -0.1)
  legend.group.rotation.y = -Math.PI / 2
  root.add(legend.group)
  const legendBar = (() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 8
    const g = c.getContext('2d')
    for (let x = 0; x < 256; x++) {
      g.fillStyle = '#' + rampColor(-25 + (x / 255) * 60).getHexString()
      g.fillRect(x, 0, 1, 8)
    }
    return c
  })()
  let legendKey = ''
  const drawLegend = lv => {
    const key = `${lv}|${outside.t}|${outside.cam}`
    if (key === legendKey) return
    legendKey = key
    const { g, w, h } = legend
    g.fillStyle = '#0d1233'
    g.fillRect(0, 0, w, h)
    g.textAlign = 'left'
    g.fillStyle = '#9fb4ff'
    fit(g, E.house.legend.title, 24, 44, 34, 700, w - 48)
    g.drawImage(legendBar, 24, 62, w - 48, 26)
    g.font = '500 22px Outfit'
    g.fillStyle = '#d2dbff'
    for (const T of [-20, -10, 0, 10, 20, 30]) {
      const x = 24 + ((T + 25) / 60) * (w - 48)
      g.textAlign = 'center'
      g.fillText(String(T).replace('-', '−'), x, 114)
    }
    g.textAlign = 'left'
    let y = 160
    for (const id of WIN_IDS) {
      const tf = faceTemp(U[id], outside.t)
      g.fillStyle = '#' + rampColor(tf).getHexString()
      g.fillRect(24, y - 24, 28, 28)
      g.fillStyle = '#e4ecff'
      g.font = '600 30px Outfit'
      g.fillText(`${E.house.signs[id]}: ${nf(tf, 1)} °C`, 64, y)
      y += 42
    }
    g.fillStyle = '#9fb4ff'
    g.font = '500 24px Outfit'
    if (depthOf(lv) === 'sci') wrap(g, fill(E.house.legend.sci, { dew: nf(9.3, 1) }), 24, y + 14, 24, w - 48, 1.15)
    else wrap(g, E.house.legend.kid, 24, y + 14, 24, w - 48, 1.15)
    legend.tex.needsUpdate = true
  }
  redraws.push(drawLegend)
  // the lens on the krypton window's gap: big slow atoms and a warm wave that dies out
  const lensG = new THREE.Group()
  lensG.position.set(WX - 0.75, 1.7, WZ[2] + 0.1)
  lensG.rotation.y = -Math.PI / 2 - 0.45
  lensG.visible = false
  const lensDisc = (() => {
    const s = screen(1.0, 1.0, 512, mats.steel)
    return s
  })()
  const LR = 0.5
  let lensAmt = 0
  const LN = 12
  const lPos = new Float32Array(LN * 2)
  const lVel = new Float32Array(LN * 2)
  for (let i = 0; i < LN; i++) {
    lPos[i * 2] = 0.2 + Math.random() * 0.6
    lPos[i * 2 + 1] = 0.2 + Math.random() * 0.6
    const a = Math.random() * 6.28
    lVel[i * 2] = Math.cos(a)
    lVel[i * 2 + 1] = Math.sin(a)
  }
  {
    const face = new THREE.Mesh(new THREE.CircleGeometry(LR, 48), new THREE.MeshBasicMaterial({ map: lensDisc.tex, toneMapped: false, color: '#d8d8d8' }))
    face.position.z = 0.02
    lensG.add(face)
    root.add(lensG)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(LR + 0.04, 0.025, 8, 40), new THREE.MeshStandardMaterial({ color: '#ffd166', emissive: '#ffd166', emissiveIntensity: 0.6 }))
    lensG.add(ring)
    ring.position.z = 0.03
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8), mats.dark)
    handle.position.set(0.35, -LR - 0.2, 0.0)
    handle.rotation.z = 0.5
    lensG.add(handle)
  }
  const drawLens = (lv, t) => {
    const { g, w, h } = lensDisc
    g.fillStyle = '#0a1030'
    g.fillRect(0, 0, w, h)
    // the windows' two panes at the sides, the room on the left, the outside on the right
    g.fillStyle = '#16205a'
    g.fillRect(70, 110, 22, 290)
    g.fillRect(w - 92, 110, 22, 290)
    g.fillStyle = '#9fb4ff'
    g.font = '600 28px Outfit'
    g.textAlign = 'center'
    g.fillText(E.house.lens.room, 140, 110)
    g.fillText(E.house.lens.outside, w - 140, 110)
    // the warm wave, travelling from the room toward the outside and dying as it goes
    for (let i = 0; i < 6; i++) {
      const u = (t * 0.45 + i / 6) % 1
      const x = 100 + u * (w - 200)
      const a = Math.exp(-u * 2.6)
      g.strokeStyle = `rgba(255,120,70,${a})`
      g.lineWidth = 8
      g.beginPath()
      for (let y = 140; y < 380; y += 10) {
        const dx = Math.sin(y * 0.05 + i) * 10
        if (y === 140) g.moveTo(x + dx, y)
        else g.lineTo(x + dx, y)
      }
      g.stroke()
    }
    // the atoms: big and slow
    for (let i = 0; i < LN; i++) {
      const px = lPos[i * 2] * w
      const py = lPos[i * 2 + 1] * h
      const hot = 1 - clamp((px - 90) / (w - 180))
      g.fillStyle = `#${COLD_C.clone().lerp(HOT_C, hot * 0.9).getHexString()}`
      g.beginPath()
      g.arc(px, py, 24, 0, 6.28)
      g.fill()
      g.fillStyle = 'rgba(255,255,255,0.35)'
      g.beginPath()
      g.arc(px - 7, py - 8, 7, 0, 6.28)
      g.fill()
    }
    g.fillStyle = '#d2dbff'
    g.textAlign = 'center'
    wrap(g, at(E.house.lens.note, lv), w / 2, 410, 24, 330, 1.1)
    lensDisc.tex.needsUpdate = true
  }
  function stepLens(dt) {
    const sp = 0.18 * GAS.krypton.speed
    for (let i = 0; i < LN; i++) {
      for (const q of [0, 1]) {
        lPos[i * 2 + q] += lVel[i * 2 + q] * sp * dt
        if (lPos[i * 2 + q] < 0.2) (lPos[i * 2 + q] = 0.2), (lVel[i * 2 + q] = Math.abs(lVel[i * 2 + q]))
        if (lPos[i * 2 + q] > 0.8) (lPos[i * 2 + q] = 0.8), (lVel[i * 2 + q] = -Math.abs(lVel[i * 2 + q]))
      }
    }
  }
  const lensHit = hit(0.1, WIN.h, WIN.w, WX - 0.06, 1.625, WZ[2])
  clickable(lensHit, () => houseStep('lens'), { reach: 7 })
  const housePanel = lv => ({
    title: E.house.title,
    color,
    blocks: [
      {
        slider: {
          label: E.house.slider,
          min: T_OUT.min,
          max: T_OUT.max,
          step: 1,
          value: outside.t,
          onInput: v => houseTemp(v),
          format: v => `${nf(v)} °C`,
          live: () => outside.t,
        },
      },
      { buttons: ['camera', 'lens'].map(k => ({ label: E.house.buttons[k], onClick: () => houseStep(k) })) },
      ...paras(E.house.panel, lv),
    ],
  })
  const houseChanged = () => {
    houseMine = true
    ex.discover('house', housePanel, 2.6)
    share('house')
  }
  function houseStep(step, mine = true) {
    const lv = level()
    const S = E.house.says
    if (step === 'camera') {
      outside.cam = !outside.cam
      play(outside.cam ? 'beam' : 'tap')
      if (mine) say(at(outside.cam ? S.camera : S.cameraOff, lv))
    } else if (step === 'lens') {
      outside.lens = !outside.lens
      play(outside.lens ? 'select' : 'tap')
      if (mine) say(at(outside.lens ? S.lens : S.lensOff, lv))
    } else return
    houseChanged()
  }
  let houseSending = false
  function houseTemp(v) {
    outside.t = clamp(Math.round(v), T_OUT.min, T_OUT.max)
    houseChanged()
    if (houseSending) return
    houseSending = true
    later(0.25, () => {
      houseSending = false
      share('house')
    })
  }
  ex.add({
    id: 'house',
    x: 4.9,
    z: 2.2,
    radius: 2.8,
    manual: true,
    label: E.house.label,
    verb: () => (!outside.cam ? E.house.hints.camera : !outside.lens ? E.house.hints.lens : E.house.hints.slide),
    focus: focusOf(WX, 1.6, 2.1, 2.9, 6.4),
    act: () => ctx.showPanel(housePanel),
  })
  // the false colour: each window's inner pane, the wall and the cat take their surface temperature
  let thermalK = 0
  const tmpA = new THREE.Color()
  updates.push((dt, t) => {
    thermalK = damp(thermalK, outside.cam ? 1 : 0, 5, dt)
    const k = thermalK
    WIN_IDS.forEach((id, i) => {
      const m = glassMats[i]
      rampColor(faceTemp(U[id], outside.t), tmpA)
      m.color.copy(new THREE.Color('#bfe6ea').lerp(tmpA, k))
      m.emissive.copy(tmpA)
      m.emissiveIntensity = 0.85 * k
      m.opacity = lerp(0.18, 0.96, k)
    })
    rampColor(15.5, thermalWall)
    wallMat.color.copy(new THREE.Color('#a39478').lerp(thermalWall, k * 0.9))
    wallMat.emissive.copy(thermalWall)
    wallMat.emissiveIntensity = 0.32 * k
    rampColor(31, tmpA)
    catMat.color.copy(new THREE.Color('#d98a3a').lerp(tmpA, k))
    catMat.emissive.copy(tmpA)
    catMat.emissiveIntensity = 0.9 * k
    rampColor(27, tmpA)
    mugMat.color.copy(new THREE.Color('#c94a3c').lerp(tmpA, k))
    mugMat.emissive.copy(tmpA)
    mugMat.emissiveIntensity = 0.7 * k
    // the lens
    lensAmt = damp(lensAmt, outside.lens ? 1 : 0, 6, dt)
    lensG.visible = lensAmt > 0.02
    lensG.scale.setScalar(Math.max(0.01, lensAmt))
    if (lensG.visible) {
      stepLens(dt)
      drawLens(level(), t)
    }
    // the thermometer sign
    const tt = fill(E.house.signs.thermo, { out: nf(outside.t), in: nf(T_IN) })
    if (tt !== thermoText) {
      thermoText = tt
      thermo.text = tt
      thermo.sync()
    }
    stage.setSnow(clamp(0.3 + (T_IN - outside.t) / 70, 0.3, 1))
  })
  void houseMine
  void gapMine

  // ======================================================================================================
  // words that follow the depth switch, the stage
  // ======================================================================================================
  updates.push((dt, t) => {
    const lv = level()
    for (const r of redraws) r(lv)
    stage.update(t)
  })
  // a ray from the camera to a point, for the probes' real taps
  const rayTo = p => new THREE.Ray(ctx.camera.position.clone(), p.clone().sub(ctx.camera.position).normalize())
  const world = obj => obj.getWorldPosition(new THREE.Vector3())

  return {
    env: stage.env,
    solids,
    cameraBounds: { ...stage.cameraBounds, maxZ: 6.8 },
    cameraPitchMax: 0.45,
    spawn: { x: 0, z: 5.2, yaw: 0 },
    hostSpot: { x: 1.8, z: 4.2, yaw: Math.atan2(1.8, -1.0) },
    back: { x: 0, z: 7.4, rot: Math.PI },
    // the easel on the left of the arrival, off the stations' lines of sight
    stand: { x: -2.4, z: 4.2, rot: Math.atan2(2.4, 1.0) },
    parts: {
      line: {
        tap: step => lineStep(step), // 'pane' 'spacer' 'air' 'argon' 'krypton' 'plug' (the panel's buttons too)
        get phase() {
          return L.phase
        },
        get gas() {
          return L.gas
        },
        get racks() {
          return { ...L.racks }
        },
        get busy() {
          return !!anim
        },
        get gauge() {
          return gaugePct
        },
      },
      gap: {
        tap: id => gapStep(id), // 'air' 'argon' 'krypton' 'xenon' 'coat'
        width: v => gapWidth(v), // the panel's slider (mm)
        get state() {
          return { ...gap, ...heatThrough(gap.gas, gap.mm, gap.coat), best: { ...BEST } }
        },
      },
      house: {
        tap: id => houseStep(id), // 'camera' 'lens'
        temp: v => houseTemp(v), // the panel's slider (degrees C)
        get state() {
          return { ...outside, watts: WIN_IDS.map(id => watts(U[id], outside.t)), faces: WIN_IDS.map(id => faceTemp(U[id], outside.t)) }
        },
      },
      at: {
        pane: () => world(unit.panes[0]),
        spacers: () => world(lineHit.table),
        bottle: id => world(lineHit[id]).add(new THREE.Vector3(0, 0.1, 0)),
        plug: () => world(unit.plug),
        gasBottle: id => world(gapHit[id]),
        coat: () => world(gapHit.coat),
        camera: () => world(camHit),
        lensWindow: () => world(lensHit),
      },
      rayTo,
    },
    panels: { line: linePanel, gap: gapPanel, house: housePanel },
    shared: {
      line: {
        get: () => lineStable(),
        set: (s, liveSet) => {
          lineMine = false
          const step = nextStep(L.phase, s?.gas)
          // someone did the next step: play it here; otherwise put everything as it stands
          if (liveSet && !anim && step && Number(s?.n) === lineN + 1 && s.phase === AFTER[L.phase]) lineStep(step, false)
          else lineSnap(s)
        },
      },
      gap: {
        get: () => ({ gas: gap.gas, mm: gap.mm, coat: gap.coat }),
        set: (s, liveSet) => {
          gapMine = false
          const gas = GAS_IDS.includes(s?.gas) ? s.gas : 'air'
          const was = gap.coat
          gap.gas = gas
          gap.mm = clamp(Math.round(Number(s?.mm) || W_START), W_MIN, W_MAX)
          gap.coat = !!s?.coat
          if (liveSet && was !== gap.coat) play(gap.coat ? 'select' : 'tap')
          if (!liveSet) coldFlash = 0
        },
      },
      house: {
        get: () => ({ t: outside.t, cam: outside.cam, lens: outside.lens }),
        set: (s, liveSet) => {
          houseMine = false
          const was = [outside.cam, outside.lens]
          outside.t = clamp(Math.round(Number(s?.t) || 0) || (s?.t === 0 ? 0 : T_OUT.start), T_OUT.min, T_OUT.max)
          outside.cam = !!s?.cam
          outside.lens = !!s?.lens
          if (liveSet && (was[0] !== outside.cam || was[1] !== outside.lens)) play('tap')
          if (!liveSet) {
            thermalK = outside.cam ? 1 : 0
            lensAmt = outside.lens ? 1 : 0
          }
        },
      },
    },
    attach() {
      buildRack()
    },
    detach() {},
    update(dt, t) {
      for (const u of updates) u(dt, t)
    },
    dispose() {
      stage.dispose()
      for (const tx of textures) tx.dispose()
      for (const d of disposers) d()
      for (const id of LINE_GASES) for (const u of placed[id]) u.dispose()
      if (hoseMesh) hoseMesh.geometry.dispose()
    },
  }
}
