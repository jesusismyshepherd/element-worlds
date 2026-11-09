// The Alloy Forge's chemistry, pure (no three.js, tested by mix.test.js): the metals on the bench, a
// crucible's mix by mass and by atoms, which alloy a mix is (the ranges and their sources:
// docs/knowledge/alloys.md), its hardness and melting, the slab of atoms the bench draws for it (sites in
// rows, carbon in the gaps, the misfits' strain) and what a hammer strike does to that slab (the layers
// slip, the misfits jam them, cast iron cracks).
// Alloys are named by mass (as metallurgists and jewellers give them); the slab shows atoms, so a mix is
// turned into atom fractions with each element's molar mass (src/data/elements.json).
import { element } from '../../../data/elements.js'

/** The metals on the bench, left to right (alloys made of neighbours stand side by side). */
export const PALETTE = ['Pb', 'Sn', 'Cu', 'Zn', 'Ni', 'Fe', 'C', 'Cr', 'Ag', 'Au']

/** Grams in each lump an Atomling throws in; carbon goes in by the pinch (steel holds a percent or two). */
export const LUMP = { C: 1 }
export const lumpOf = el => LUMP[el] ?? 100
/** The crucible holds at most this many lumps (3 kg of metal) and pinches of carbon. */
export const MAX_LUMPS = 30
export const MAX_PINCHES = 30

// Electrons each atom gives to the metal's electron sea in the free-electron model (the s and p electrons
// outside the filled shells; Ashcroft and Mermin's table for Cu, Ag, Au, Zn, Fe, Sn, Pb). Carbon in iron
// keeps its electrons near it: none are drawn for it.
export const SEA = { Cu: 1, Ag: 1, Au: 1, Zn: 2, Fe: 2, Ni: 2, Cr: 1, Sn: 4, Pb: 4, C: 0 }

// Typical hardness of the pure metals, annealed, as { v, s }: Vickers (HV) where the table gives it,
// Brinell (HB) for tin, zinc and lead (Wikipedia's "Hardnesses of the elements", from Samsonov 1968: MPa
// divided by 9.807). Below about 300 the two scales read nearly alike. alloys.md lists every value.
const HV = v => ({ v, s: 'HV' })
const HB = v => ({ v, s: 'HB' })
export const PURE_HARD = { Cu: HV(37), Sn: HB(6), Zn: HB(35), Fe: HV(62), Au: HV(21), Ag: HV(25), Cr: HV(108), Ni: HV(65), Pb: HB(5) }

/** How each metal looks: the colour of its ingot and its melt (src/data/appearance.js, tin's added). */
export const LOOK = {
  Cu: '#d27d4f', Sn: '#d4d8de', Zn: '#b7bfca', Fe: '#a3a6ab', Au: '#f2c040', Ag: '#e3e6ea', Cr: '#c3cbd6',
  Ni: '#cfc8b8', Pb: '#8a8f98', C: '#2b2d31',
}
// the colour of each atom in the slab: its Atomling's own (the CPK colour it wears), a few made brighter to
// tell them apart on a dark bench
export const ION = {
  Cu: '#e8994a', Sn: '#8fb3b3', Zn: '#8d90c8', Fe: '#d8583a', Au: '#ffd123', Ag: '#d6d6dc', Cr: '#93a6e0',
  Ni: '#5ed65e', Pb: '#6e7280', C: '#3c4048',
}

const isNum = v => typeof v === 'number' && Number.isFinite(v)

/** A clean mix: { el: lumps } with only bench elements and whole, positive counts within the crucible's
 *  room (what comes from another device is checked here). */
export function cleanMix(m) {
  const out = {}
  if (!m || typeof m !== 'object') return out
  let lumps = 0
  for (const el of PALETTE) {
    const n = Math.floor(Number(m[el]))
    if (!isNum(n) || n <= 0) continue
    const room = el === 'C' ? MAX_PINCHES : MAX_LUMPS - lumps
    const k = Math.min(n, room)
    if (k <= 0) continue
    out[el] = k
    if (el !== 'C') lumps += k
  }
  return out
}

export const lumpsIn = mix => Object.entries(mix).reduce((s, [el, n]) => s + (el === 'C' ? 0 : n), 0)
export const gramsOf = mix => Object.entries(mix).reduce((s, [el, n]) => s + n * lumpOf(el), 0)

/** Can one more of `el` go into the crucible? */
export const roomFor = (mix, el) => (el === 'C' ? (mix.C ?? 0) < MAX_PINCHES : lumpsIn(mix) < MAX_LUMPS)

/** Mass fractions { el: 0..1 } (the metals present; empty for an empty crucible). */
export function massFractions(mix) {
  const g = gramsOf(mix)
  const w = {}
  if (!g) return w
  for (const [el, n] of Object.entries(mix)) if (n > 0) w[el] = (n * lumpOf(el)) / g
  return w
}

/** Atom fractions from mass fractions: x_i = (w_i / M_i) / sum(w_j / M_j). */
export function atomFractions(w) {
  let total = 0
  const moles = {}
  for (const [el, f] of Object.entries(w)) {
    moles[el] = f / element(el).mass
    total += moles[el]
  }
  const x = {}
  for (const el of Object.keys(moles)) x[el] = total ? moles[el] / total : 0
  return x
}

const at = (w, el) => w[el] ?? 0
const others = (w, keep) => Object.entries(w).reduce((s, [el, f]) => s + (keep.includes(el) ? 0 : f), 0)
const E = 1e-9
const within = (v, [lo, hi]) => v >= lo - E && v <= hi + E

// The alloys the bench knows, by mass (each range, and where it comes from: docs/knowledge/alloys.md).
// An alloy is its `key` element within its range, the rest from `only` (anything else at most `tol`),
// and `also` when it says more. The first that matches names the mix. `hard` is a typical hardness ({ v, s }:
// annealed, or as cast where the alloy is used so); `melt` [solidus, liquidus] in °C, for a typical alloy of
// the kind (each named in alloys.md) or, for steel, cast iron, solder and cupronickel, from their diagrams.
export const ALLOYS = [
  {
    // cast tin bronze C90700 (Cu 88-90, Sn 10-12): 102 HB, 831-999 °C
    id: 'bronze', base: 'Cu', look: '#c9965a', recipe: { Cu: 8, Sn: 1 }, key: ['Sn', [0.03, 0.18]], only: ['Cu', 'Sn'],
    hard: () => HB(102), melt: () => [831, 999],
  },
  {
    // bell bronze, 18 to 26 % tin (C91300, Cu 79-82 Sn 18-20, is cast for bells: at least 160 HB, 818-889 °C)
    id: 'bell', base: 'Cu', look: '#c7ab72', recipe: { Cu: 7, Sn: 2 }, key: ['Sn', [0.18, 0.26]], only: ['Cu', 'Sn'],
    hard: () => HB(160), melt: () => [818, 889],
  },
  {
    // brass, 5 to 45 % zinc (70/30 cartridge brass C26000: about 65 HV annealed, 916-954 °C)
    id: 'brass', base: 'Cu', look: '#dcb75c', recipe: { Cu: 2, Zn: 1 }, key: ['Zn', [0.05, 0.45]], only: ['Cu', 'Zn'],
    hard: () => HV(65), melt: () => [916, 954],
  },
  {
    // cupronickel, 10 to 30 % nickel (soft 75/25: 70-100 HV); melting between 90/10 (1100-1145) and 70/30
    // (1170-1240 °C)
    id: 'cupronickel', base: 'Cu', look: '#c8c7c2', recipe: { Cu: 3, Ni: 1 }, key: ['Ni', [0.1, 0.3]], only: ['Cu', 'Ni'],
    hard: () => HV(85),
    melt: w => [Math.round(lerp([[0.1, 1100], [0.3, 1170]], at(w, 'Ni'))), Math.round(lerp([[0.1, 1145], [0.3, 1240]], at(w, 'Ni')))],
  },
  {
    // EN 10088: at least 10.5 % Cr, at most 1.2 % C (304 annealed: HRB 84, about 165 HV; 1399-1454 °C)
    id: 'stainless', base: 'Fe', look: '#cdd3da', recipe: { Fe: 7, Cr: 2, Ni: 1 }, key: ['Cr', [0.105, 0.3]], only: ['Fe', 'Cr', 'Ni', 'C'],
    also: w => at(w, 'Fe') >= 0.5 && at(w, 'C') <= 0.012 + E,
    hard: () => HV(165), melt: () => [1399, 1454],
  },
  {
    // steel: 0.02 to 2.14 % carbon (the most austenite holds)
    id: 'steel', base: 'Fe', look: '#9ba2aa', recipe: { Fe: 1, C: 1 }, key: ['C', [0.0002, 0.0214]], only: ['Fe', 'C'], tol: 0.05,
    hard: w => HB(steelHB(at(w, 'C') * 100)), melt: w => ironMelt(at(w, 'C') * 100),
  },
  {
    // cast iron: over 2.14 % carbon, real ones up to about 4.5 % (6.67 % is cementite itself); grey iron
    // class 30 about 210 HB
    id: 'castIron', base: 'Fe', look: '#5e6167', recipe: { Fe: 1, C: 3 }, key: ['C', [0.0214 + 1e-6, 0.045]], only: ['Fe', 'C'], tol: 0.05, brittle: true,
    hard: () => HB(210), melt: w => ironMelt(at(w, 'C') * 100),
  },
  {
    // sterling: at least 92.5 % silver, the rest copper (annealed 56-66 HV; about 810-892 °C)
    id: 'sterling', base: 'Ag', look: '#e0e2e6', recipe: { Ag: 13, Cu: 1 }, key: ['Ag', [0.925, 0.99]], only: ['Ag', 'Cu'], tol: 0.005,
    hard: () => HV(60), melt: () => [810, 892],
  },
  {
    // 18 carats: 75 % gold; the colours' datasheets (Cookson-CLAL 3N yellow, 4N rose; none here for green
    // and white)
    id: 'gold18', base: 'Au', recipe: { Au: 6, Ag: 1, Cu: 1 }, key: ['Au', [0.75, 0.79]], only: ['Au', 'Ag', 'Cu', 'Ni', 'Zn'], tol: 0.005,
    hard: (w, grade) => ({ yellow: HV(140), rose: HV(160) })[grade] ?? null,
    melt: (w, grade) => ({ yellow: [885, 905], rose: [890, 910] })[grade] ?? null,
  },
  {
    // tin-lead solder, 30 to 70 % tin (63/37: 14-17 HB)
    id: 'solder', base: 'Sn', look: '#b8bcc2', recipe: { Sn: 5, Pb: 3 }, key: ['Sn', [0.3, 0.7]], only: ['Sn', 'Pb'],
    hard: () => HB(15), melt: w => solderMelt(at(w, 'Sn') * 100),
  },
]
export const BOOK = ALLOYS.map(a => a.id)
export const ALLOY = Object.fromEntries(ALLOYS.map(a => [a.id, a]))
const fits = (a, w) => within(at(w, a.key[0]), a.key[1]) && others(w, a.only) <= (a.tol ?? 0.02) + E && (!a.also || a.also(w))

const lerp = (pts, x) => {
  if (x <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return pts[pts.length - 1][1]
}
/** A plain carbon steel's hardness (HB, annealed) by its carbon (percent by mass): pure iron, AISI 1020
 *  (111), 1045 (about 165), 1095 (about 192); nearly flat beyond, where few steels are made. */
export const steelHB = c => Math.round(lerp([[0, 59], [0.2, 111], [0.45, 165], [0.95, 192], [2.14, 200]], c))
/** The iron-carbon diagram's lines (°C): solidus and liquidus by carbon (percent by mass), straightened
 *  between their corners (pure iron 1538, the peritectic 1495 at 0.09 to 0.53, austenite's most carbon
 *  2.14 and the eutectic 4.3 at 1147). */
export function ironMelt(c) {
  const liquidus = lerp([[0, 1538], [0.53, 1495], [4.3, 1147], [6.67, 1250]], c)
  const solidus = c >= 2.14 ? 1147 : lerp([[0, 1538], [0.09, 1495], [0.17, 1495], [2.14, 1147]], c)
  return [Math.round(solidus), Math.round(liquidus)]
}
/** Tin and lead (°C), by tin (percent by mass): lead 327, the eutectic 61.9 % at 183, tin 232; the
 *  solidus is the eutectic line between about 18.3 % and 97.8 % tin. */
export function solderMelt(sn) {
  const liquidus = lerp([[0, 327], [61.9, 183], [100, 232]], sn)
  const solidus = sn >= 18.3 && sn <= 97.8 ? 183 : sn < 18.3 ? lerp([[0, 327], [18.3, 183]], sn) : lerp([[97.8, 183], [100, 232]], sn)
  return [Math.round(solidus), Math.round(liquidus)]
}

const meltOf = el => Math.round(element(el).melt - 273.15)

/** What the mix is: { kind, w (by mass), x (by atoms), base (the most by mass), ... }. Kinds: 'empty';
 *  'carbon' (carbon alone: it does not melt in a forge); 'pure' (el); 'alloy' (id, grade); 'gold' (gold of
 *  `carats`, not 18); 'mix' (no name: `near` the alloy it nearly is, `apart` the pairs that do not
 *  dissolve in each other). Carbon dissolves only in iron: in any other melt it floats on top
 *  (`floating`, pinches) and the ingot is made without it. */
export function identify(mix) {
  const clean = cleanMix(mix)
  const metals = Object.keys(clean).filter(el => el !== 'C')
  if (!Object.keys(clean).length) return { kind: 'empty', w: {}, x: {}, melt: {} }
  if (!metals.length) return { kind: 'carbon', w: { C: 1 }, x: { C: 1 }, melt: {}, floating: clean.C }
  const floating = clean.C && !clean.Fe ? clean.C : 0
  const melt = { ...clean }
  if (floating) delete melt.C
  const w = massFractions(melt)
  const x = atomFractions(w)
  const base = Object.entries(w).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0]
  const carats = at(w, 'Au') >= 0.375 - E ? Math.floor(24 * w.Au + 1e-6) : null
  const out = { base, w, x, carats, floating, melt }
  if (Object.keys(melt).length === 1) return { kind: 'pure', el: base, ...out }
  const alloy = ALLOYS.find(a => fits(a, w))
  if (alloy) return { kind: 'alloy', id: alloy.id, grade: gradeOf(alloy.id, w), ...out }
  if (carats && others(w, ['Au', 'Ag', 'Cu', 'Ni', 'Zn']) <= 0.005 + E) return { kind: 'gold', ...out }
  return { kind: 'mix', near: nearOf(w), apart: apartPairs(Object.keys(melt)), ...out }
}

/** The alloy a nameless mix of its metals nearly is: { id, more } (the element to add more of). */
function nearOf(w) {
  let best = null
  for (const a of ALLOYS) {
    if (!Object.keys(w).every(el => a.only.includes(el)) || !Object.keys(w).includes(a.key[0])) continue
    const v = at(w, a.key[0])
    const [lo, hi] = a.key[1]
    const d = v < lo ? lo - v : v - hi
    if (d <= 0 || (best && d >= best.d)) continue
    best = { id: a.id, more: v < lo ? a.key[0] : a.base === a.key[0] ? a.only.find(el => el !== a.key[0] && w[el]) : a.base, d }
  }
  return best && best.d < 0.2 ? { id: best.id, more: best.more } : null
}

/** A finer name inside an alloy: steel by its carbon, 304 stainless, eutectic solder, 18-carat gold's colour. */
function gradeOf(id, w) {
  if (id === 'steel') return w.C < 0.003 ? 'mild' : w.C < 0.006 ? 'medium' : 'high'
  if (id === 'stainless') return within(w.Cr, [0.18, 0.2]) && within(at(w, 'Ni'), [0.08, 0.105]) ? '304' : at(w, 'Ni') >= 0.08 ? 'nickel' : 'chromium'
  if (id === 'solder') return within(w.Sn, [0.6, 0.64]) ? 'eutectic' : 'plain'
  if (id === 'gold18') {
    const ag = at(w, 'Ag')
    const cu = at(w, 'Cu')
    if (at(w, 'Ni') + at(w, 'Zn') >= 0.08) return 'white'
    if (cu >= 2 * ag) return 'rose'
    if (ag >= 2 * cu) return 'green'
    return 'yellow'
  }
  return null
}

// pairs of the bench's metals that hardly dissolve in each other as solids (they separate into grains of
// each as they cool): alloys.md lists them with their sources
const APART = new Set(['Fe-Pb', 'Ag-Fe', 'Cu-Pb', 'Cu-Fe', 'Ag-Ni', 'Pb-Zn', 'Cr-Cu', 'Ag-Cr', 'Ni-Pb'].map(p => p.split('-').sort().join('-')))
export const keepApart = (a, b) => APART.has([a, b].sort().join('-'))
function apartPairs(els) {
  const out = []
  for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) if (keepApart(els[i], els[j])) out.push([els[i], els[j]].sort())
  return out
}

/** The mix's colour: an alloy's own, a pure metal's, else the metals' colours blended by mass. */
export function lookOf(info) {
  if (info.kind === 'empty') return '#3a3f48'
  if (info.kind === 'carbon') return LOOK.C
  if (info.kind === 'pure') return LOOK[info.el]
  if (info.kind === 'alloy' && info.id === 'gold18') return { yellow: '#e8bd52', rose: '#e4a37c', green: '#d6cc72', white: '#dedcd2' }[info.grade]
  if (info.kind === 'alloy') return ALLOY[info.id].look
  return blend(info.w)
}
function blend(w) {
  let r = 0
  let g = 0
  let b = 0
  for (const [el, f] of Object.entries(w)) {
    const c = parseInt(LOOK[el].slice(1), 16)
    r += f * (c >> 16)
    g += f * ((c >> 8) & 255)
    b += f * (c & 255)
  }
  const hex = v => Math.round(v).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

/** Hardness ({ v, s }) and melting ([solidus, liquidus] °C) of what the mix makes, or null where the bench
 *  has no number (an unnamed mix, green or white gold). */
export function propertiesOf(info) {
  if (info.kind === 'pure') return { hard: PURE_HARD[info.el] ?? null, melt: [meltOf(info.el), meltOf(info.el)] }
  if (info.kind === 'alloy') {
    const a = ALLOY[info.id]
    return { hard: a.hard(info.w, info.grade), melt: a.melt(info.w, info.grade) }
  }
  return { hard: null, melt: null }
}

/** Can the crucible be poured? Something must melt: carbon alone does not. */
export const pourable = info => info.kind !== 'empty' && info.kind !== 'carbon'

// ---- the slab: the metal's atoms, drawn ----

/** A small seeded random generator (mulberry32): the same slab on every screen of a room. */
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
/** A number for a mix (and a pour), the slab's seed. */
export function mixSeed(mix, salt = 0) {
  let h = (2166136261 ^ salt) >>> 0
  for (const el of PALETTE) {
    for (const ch of `${el}${mix[el] ?? 0};`) {
      h ^= ch.charCodeAt(0)
      h = Math.imul(h, 16777619) >>> 0
    }
  }
  return h >>> 0
}
const shuffle = (list, rand) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

export const ROW_H = Math.sqrt(3) / 2
const radiusOf = el => element(el).radius.metallic ?? element(el).radius.covalent
/** The slab's size: the same on every device (a room's players must see the same strikes). */
export const SLAB = { cols: 12, rows: 7, depth: 3 }

/** Spread `n` items into whole counts by fractions (largest remainder): the slab's atoms per metal. */
export function apportion(fractions, n) {
  const entries = Object.entries(fractions).filter(([, f]) => f > 0)
  const out = Object.fromEntries(entries.map(([el, f]) => [el, Math.floor(f * n)]))
  let left = n - Object.values(out).reduce((s, v) => s + v, 0)
  const order = entries.map(([el, f]) => [el, f * n - Math.floor(f * n)]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
  for (let i = 0; left > 0 && order.length; i = (i + 1) % order.length, left--) out[order[i][0]] += 1
  return out
}

/** The slab for an ingot's mix: `cols` x `rows` sites in close-packed rows (each row set half a place over
 *  from the one below), `depth` such sheets one behind the other; the lattice spacing is 1 (the host atom's
 *  diameter). Sites: { el, row, col, layer, x, y, z, r } (r: radius, from the metallic radii of
 *  elements.json, the host's being 0.5); carbon sits in the gaps between rows: { el: 'C', below: row, x, y,
 *  z, r, flake }. How the atoms are spread (`phase`): 'solution' (at random), 'apart' (metals that do not
 *  dissolve in each other gather in grains of their own), 'lamellae' (tin-lead solder: bands of each); in
 *  cast iron most carbon gathers in a flake of graphite along one gap. Then every atom is pushed a little by
 *  its misfit neighbours (bigger ones push away, carbon in a gap pushes its neighbours apart). */
export function slabOf(mix, { cols = SLAB.cols, rows = SLAB.rows, depth = SLAB.depth, seed = mixSeed(mix) } = {}) {
  const info = identify(mix)
  const rand = rng(seed)
  const sites = []
  const gaps = []
  if (info.kind === 'empty' || info.kind === 'carbon') return { info, sites, gaps, cols, rows, depth, seed, phase: 'none', host: null }
  for (let layer = 0; layer < depth; layer++) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) sites.push({ el: null, row, col, layer, x: col + (row % 2) * 0.5, y: row * ROW_H, z: layer })
    }
  }
  const x = info.x
  const metals = Object.keys(x).filter(el => el !== 'C').sort()
  const total = metals.reduce((s, el) => s + x[el], 0)
  const share = Object.fromEntries(metals.map(el => [el, x[el] / total]))
  const counts = apportion(share, sites.length)
  const host = [...metals].sort((a, b) => share[b] - share[a] || (a < b ? -1 : 1))[0]
  const hostR = radiusOf(host)
  let phase = 'solution'
  if (info.id === 'solder') phase = 'lamellae'
  else if (info.kind === 'mix' && info.apart?.length) phase = 'apart'
  if (phase === 'lamellae') {
    // bands across the slab: each period of 3.2 places holds tin for its share, lead for the rest
    const period = 3.2
    const key = s => ((s.x / period) % 1) + s.x * 1e-6
    const order = [...sites].sort((a, b) => key(a) - key(b))
    const sn = counts.Sn ?? 0
    order.forEach((s, i) => {
      s.el = i < sn ? 'Sn' : 'Pb'
    })
  } else if (phase === 'apart') {
    // grains: the metals fill the slab in turn along a slanted, wavy front (its slant from the seed)
    const tilt = rand() * 0.8 - 0.4
    const wave = rand() * 6
    const key = new Map(sites.map(s => [s, s.x + tilt * s.y * 2 + Math.sin(s.y * 1.3 + wave) * 0.8 + s.z * 0.15]))
    const order = [...sites].sort((a, b) => key.get(a) - key.get(b))
    let i = 0
    for (const el of metals) for (let k = 0; k < counts[el]; k++) order[i++].el = el
  } else {
    const order = shuffle([...sites], rand)
    let i = 0
    // the host last, so the others are spread at random among its sites
    for (const el of metals.filter(e => e !== host)) for (let k = 0; k < counts[el]; k++) order[i++].el = el
    for (; i < order.length; i++) order[i].el = host
  }
  for (const s of sites) {
    s.el ??= host
    s.r = (0.5 * radiusOf(s.el)) / hostR
  }
  // carbon in iron: in the gaps between rows, as many per metal atom as the atom fractions say
  if (x.C) {
    const want = Math.round((sites.length * x.C) / (1 - x.C))
    const spots = []
    for (let layer = 0; layer < depth; layer++) {
      for (let row = 0; row < rows - 1; row++) {
        const low = (row % 2) * 0.5
        const high = ((row + 1) % 2) * 0.5
        // the two kinds of gap between a row and the next: a triangle pointing up (two atoms below, one
        // above) and one pointing down
        for (let col = 0; col < cols - 1; col++) {
          spots.push({ below: row, layer, x: col + low + 0.5, y: row * ROW_H + ROW_H / 3 })
          spots.push({ below: row, layer, x: col + high + 0.5, y: row * ROW_H + (2 * ROW_H) / 3 })
        }
      }
    }
    const rC = (0.5 * radiusOf('C')) / hostR
    const chosen = []
    // cast iron: the carbon above what steel can hold (2.14 %) gathers in a flake of graphite along a gap
    const flakeShare = info.id === 'castIron' ? Math.max(0, 1 - 2.14 / (info.w.C * 100)) : 0
    const flakes = Math.min(Math.round(want * flakeShare), (cols - 1) * 2 * depth)
    const taken = new Set()
    if (flakes) {
      const row = 1 + Math.floor(rand() * Math.max(1, rows - 3))
      const line = spots.filter(s => s.below === row).sort((a, b) => a.layer - b.layer || a.x - b.x)
      for (const s of line.slice(0, flakes)) {
        chosen.push({ ...s, flake: true })
        taken.add(s)
      }
    }
    const free = shuffle(spots.filter(s => !taken.has(s)), rand)
    for (const s of free.slice(0, Math.max(0, want - chosen.length))) chosen.push(s)
    for (const s of chosen) gaps.push({ el: 'C', below: s.below, layer: s.layer, x: s.x, y: s.y, z: s.layer, r: rC, flake: !!s.flake })
  }
  strain(sites, gaps)
  return { info, sites, gaps, cols, rows, depth, seed, phase, host }
}

/** Push the atoms round each misfit: a bigger atom pushes its neighbours away, a smaller one lets them
 *  close in, a carbon atom in a gap pushes its neighbours apart. Kept small (a drawing, not a simulation):
 *  enough to see the rows go bumpy. */
function strain(sites, gaps) {
  const byLayer = new Map()
  const move = new Map(sites.map(s => [s, [0, 0]]))
  for (const s of sites) {
    if (!byLayer.has(s.layer)) byLayer.set(s.layer, [])
    byLayer.get(s.layer).push(s)
  }
  const push = (src, reach, amount) => {
    for (const s of byLayer.get(src.layer) ?? []) {
      if (s === src) continue
      const dx = s.x - src.x
      const dy = s.y - src.y
      const d = Math.hypot(dx, dy)
      if (d > reach || d < 1e-6) continue
      const k = amount * (1 - d / (reach + 0.25))
      const m = move.get(s)
      m[0] += (dx / d) * k
      m[1] += (dy / d) * k
    }
  }
  for (const s of sites) if (Math.abs(s.r - 0.5) > 0.005) push(s, 1.25, (s.r - 0.5) * 0.9)
  for (const g of gaps) push(g, 0.75, g.flake ? 0.06 : 0.12)
  const clamp = v => Math.max(-0.2, Math.min(0.2, v))
  for (const s of sites) {
    const [dx, dy] = move.get(s)
    s.x += clamp(dx)
    s.y += clamp(dy)
  }
}

/** How strongly a slip between row `plane - 1` and row `plane` is pinned: the misfits in those two rows
 *  (by how much their size differs from the host's) and the carbon in the gap between them and beside it. */
export function pinning(slab, plane) {
  let p = 0
  for (const s of slab.sites) if ((s.row === plane - 1 || s.row === plane) && s.el !== slab.host) p += Math.abs(s.r - 0.5) / 0.5 + 0.02
  for (const g of slab.gaps) if (g.below >= plane - 2 && g.below <= plane) p += g.below === plane - 1 ? 0.6 : 0.25
  return p / slab.depth
}
export const PIN = 0.12

/** What strike number `k` (1, 2, ...) does to the slab, given how its rows have slipped so far
 *  (`shifts[row]`, in places): { kind: 'slip' | 'jam' | 'crack', plane, dir }. A pure metal's rows slip
 *  (the metal bends); misfit atoms in the way jam them; cast iron cracks along its flake of graphite. The
 *  same on every screen (seeded by the slab and the strike). */
export function strikeOf(slab, k, shifts = []) {
  const rows = slab.rows
  if (slab.info.id === 'castIron') {
    const flake = slab.gaps.find(g => g.flake)
    return { kind: 'crack', plane: flake ? flake.below + 1 : Math.ceil(rows / 2), dir: 0 }
  }
  const rand = rng((slab.seed ^ Math.imul(k, 0x9e3779b1)) >>> 0)
  // the hammer pushes the upper rows along: one of the middle planes, the way that keeps the slab from
  // wandering off to one side
  const planes = []
  for (let p = 1; p < rows; p++) planes.push(p)
  planes.sort((a, b) => Math.abs(a - rows / 2) - Math.abs(b - rows / 2) || a - b)
  // every middle plane both ways, kept to the moves that leave no row more than two places out
  const moves = planes.slice(0, 4).flatMap(plane => [-1, 1].map(dir => {
    let worst = 0
    for (let r = 0; r < rows; r++) worst = Math.max(worst, Math.abs((shifts[r] ?? 0) + (r >= plane ? dir : 0)))
    return { plane, dir, worst }
  }))
  const least = Math.min(...moves.map(m => m.worst))
  const fine = moves.filter(m => m.worst <= Math.max(2, least))
  const { plane, dir } = fine[Math.floor(rand() * fine.length)]
  const kind = pinning(slab, plane) > PIN ? 'jam' : 'slip'
  return { kind, plane, dir }
}

/** The rows' shifts after `n` strikes (replayed, so a newcomer sees the slab as it stands), and the crack
 *  if it has cracked. */
export function shiftsAfter(slab, n) {
  const shifts = new Array(slab.rows).fill(0)
  let cracked = null
  for (let k = 1; k <= n && !cracked; k++) {
    const s = strikeOf(slab, k, shifts)
    if (s.kind === 'crack') cracked = s
    if (s.kind === 'slip') for (let r = s.plane; r < slab.rows; r++) shifts[r] += s.dir
  }
  return { shifts, cracked }
}

/** How deep a strike dents an ingot of this hardness (a number on either scale; metres): soft metals
 *  deeply, hard ones hardly. */
export const dentOf = h => Math.min(0.06, 0.045 * Math.pow(40 / Math.max(4, h ?? 60), 0.7))
