// Growing Crystals (/lab/crystal): the crystals themselves, pure and tested (lattice.test.js). Three cubic
// structures cover fifteen of the lab's ionic compounds: rock salt (NaCl type, each ion among six of the
// other), fluorite (CaF2: each cation among eight anions, each anion among four cations) and antifluorite
// (Li2O: the same with the roles swapped). Sites are integer points: rock salt in units of a/2 (every
// point is an ion, the kinds alternating), fluorite and antifluorite in units of a/4 (the fcc ions on the
// even points whose sum is a multiple of 4, the others on the all-odd points). docs/knowledge/crystal.md.
//
// Sources (docs/knowledge/crystal.md, "The science"): lattice constants at room temperature from the
// table of the Wikipedia articles "Lattice constant" and "Fluorite structure" (and the CRC Handbook's
// values they cite); ionic radii from R. D. Shannon, Acta Cryst. A32 (1976) 751, for the coordination
// each ion has in its structure (read from the mendeleev package, scripts/data/.venv). The hydride ion
// has no Shannon radius (it is soft and changes with its neighbours): here half the cell edge minus the
// cation's radius, the distance the crystal itself shows.

export const CATION = 0
export const ANION = 1

const mod = (n, m) => ((n % m) + m) % m

const AXES = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
const CORNERS = []
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CORNERS.push([x, y, z])

/** The fcc points of the a/4 grid: every coordinate even and their sum a multiple of 4. */
const fcc = (x, y, z) => mod(x, 2) === 0 && mod(y, 2) === 0 && mod(z, 2) === 0 && mod(x + y + z, 4) === 0
const odd = (x, y, z) => mod(x, 2) === 1 && mod(y, 2) === 1 && mod(z, 2) === 1

/** Each structure: the grid's unit (the cell edge divided by `div`), which kind sits on a point (or -1),
 *  the steps to its nearest neighbours (always of the other kind), the coordination numbers, ions and
 *  formula units in a cell, the nucleus's first point. */
export const STRUCTURES = {
  rocksalt: {
    div: 2,
    kind: (x, y, z) => (mod(x + y + z, 2) === 0 ? CATION : ANION),
    steps: () => AXES,
    cn: [6, 6],
    ionsPerCell: 8,
    unitsPerCell: 4,
    seed: [0, 0, 0],
  },
  fluorite: {
    div: 4,
    kind: (x, y, z) => (fcc(x, y, z) ? CATION : odd(x, y, z) ? ANION : -1),
    steps: () => CORNERS,
    cn: [8, 4],
    ionsPerCell: 12,
    unitsPerCell: 4,
    seed: [0, 0, 0],
  },
  antifluorite: {
    div: 4,
    kind: (x, y, z) => (fcc(x, y, z) ? ANION : odd(x, y, z) ? CATION : -1),
    steps: () => CORNERS,
    cn: [4, 8],
    ionsPerCell: 12,
    unitsPerCell: 4,
    seed: [0, 0, 0],
  },
}

/** The nearest neighbours of a point (all of them, occupied or not). */
export function neighbours(structure, x, y, z) {
  const S = STRUCTURES[structure]
  const k = S.kind(x, y, z)
  if (k < 0) return []
  return S.steps(k).map(([dx, dy, dz]) => [x + dx, y + dy, z + dz]).filter(([a, b, c]) => S.kind(a, b, c) === 1 - k)
}

// a point as one integer (each coordinate within ±511)
export const keyOf = (x, y, z) => (x + 512) + (y + 512) * 1024 + (z + 512) * 1048576
export const pointOf = key => [mod(key, 1024) - 512, mod(Math.floor(key / 1024), 1024) - 512, Math.floor(key / 1048576) - 512]

// the ions: charge, Shannon radius (pm) for each coordination met here (keyed by the coordination number)
export const IONS = {
  Li: { q: 1, r: { 6: 76, 4: 59 } },
  Na: { q: 1, r: { 6: 102, 4: 99 } },
  K: { q: 1, r: { 6: 138, 4: 137 } },
  Mg: { q: 2, r: { 6: 72 } },
  Ca: { q: 2, r: { 6: 100, 8: 112 } },
  F: { q: -1, r: { 6: 133, 4: 131 } },
  Cl: { q: -1, r: { 6: 181 } },
  O: { q: -2, r: { 6: 140, 8: 142 } },
  // Shannon gives S2- only for six neighbours; in Na2S (eight) the crystal shows the same 184 pm
  S: { q: -2, r: { 6: 184, 8: 184 } },
  // no Shannon radius: a/2 minus the cation's (LiH 204 - 76, NaH 244 - 102)
  H: { q: -1, r: null },
}

// medium: 'water' (it crystallises from water: evaporation) or 'melt' (water would destroy it or it hardly
// dissolves: it grows from a hot melt as it cools); water: what water does to it (for the Scientist)
export const COMPOUNDS = [
  { id: 'NaCl', cation: 'Na', anion: 'Cl', structure: 'rocksalt', a: 564.0, medium: 'water', solubility: 36.0 },
  { id: 'KCl', cation: 'K', anion: 'Cl', structure: 'rocksalt', a: 629.2, medium: 'water', solubility: 34.2 },
  { id: 'NaF', cation: 'Na', anion: 'F', structure: 'rocksalt', a: 463.3, medium: 'water', solubility: 4.0 },
  { id: 'LiF', cation: 'Li', anion: 'F', structure: 'rocksalt', a: 402.7, medium: 'melt', melt: 845, solubility: 0.13 },
  { id: 'NaH', cation: 'Na', anion: 'H', structure: 'rocksalt', a: 488.0, medium: 'melt', water: 'NaH + H2O → NaOH + H2' },
  { id: 'LiH', cation: 'Li', anion: 'H', structure: 'rocksalt', a: 408.3, medium: 'melt', melt: 689, water: 'LiH + H2O → LiOH + H2' },
  { id: 'MgO', cation: 'Mg', anion: 'O', structure: 'rocksalt', a: 421.2, medium: 'melt', melt: 2852, water: 'MgO + H2O → Mg(OH)2' },
  { id: 'CaO', cation: 'Ca', anion: 'O', structure: 'rocksalt', a: 481.1, medium: 'melt', melt: 2613, water: 'CaO + H2O → Ca(OH)2' },
  { id: 'MgS', cation: 'Mg', anion: 'S', structure: 'rocksalt', a: 520.3, medium: 'melt', water: 'MgS + 2 H2O → Mg(OH)2 + H2S' },
  { id: 'CaS', cation: 'Ca', anion: 'S', structure: 'rocksalt', a: 569.5, medium: 'melt', water: 'CaS + 2 H2O → Ca(OH)2 + H2S' },
  { id: 'CaF2', cation: 'Ca', anion: 'F', structure: 'fluorite', a: 546.3, medium: 'melt', melt: 1418, solubility: 0.0016 },
  { id: 'Li2O', cation: 'Li', anion: 'O', structure: 'antifluorite', a: 461.1, medium: 'melt', melt: 1438, water: 'Li2O + H2O → 2 LiOH' },
  { id: 'Na2O', cation: 'Na', anion: 'O', structure: 'antifluorite', a: 555.0, medium: 'melt', melt: 1132, water: 'Na2O + H2O → 2 NaOH' },
  { id: 'K2O', cation: 'K', anion: 'O', structure: 'antifluorite', a: 643.6, medium: 'melt', water: 'K2O + H2O → 2 KOH' },
  { id: 'Na2S', cation: 'Na', anion: 'S', structure: 'antifluorite', a: 653.9, medium: 'melt', melt: 1176, water: 'Na2S · 9 H2O' },
]
export const COMPOUND = Object.fromEntries(COMPOUNDS.map(c => [c.id, c]))

// the lab's other ionic compounds, whose crystals are more complicated than these three (named for the
// Scientist): their structure types
export const COMPLICATED = {
  MgCl2: 'CdCl2', CaCl2: 'CaCl2', MgF2: 'rutile', Li3N: 'Li3N', Mg3N2: 'antibixbyite', Al2O3: 'corundum', AlF3: 'AlF3', AlN: 'wurtzite',
}

/** The radius (pm) of a compound's cation or anion in its crystal. */
export function radiusOf(c, kind) {
  const cmp = typeof c === 'string' ? COMPOUND[c] : c
  const S = STRUCTURES[cmp.structure]
  const sym = kind === CATION ? cmp.cation : cmp.anion
  const ion = IONS[sym]
  const cn = S.cn[kind]
  if (ion.r) return ion.r[cn]
  // the hydride: the cation-anion distance (a/2 in rock salt) less the cation's radius
  return Math.round(cmp.a / 2 - IONS[cmp.cation].r[S.cn[CATION]])
}

/** The distance (pm) between neighbouring ions of the other kind. */
export function nearestDistance(c) {
  const cmp = typeof c === 'string' ? COMPOUND[c] : c
  return cmp.structure === 'rocksalt' ? cmp.a / 2 : (cmp.a * Math.sqrt(3)) / 4
}

/** The ions and the formula units in a cube `edge` metres on a side (a grain of salt: 0.3 mm). */
export function grainCount(c, edge = 0.3e-3) {
  const cmp = typeof c === 'string' ? COMPOUND[c] : c
  const S = STRUCTURES[cmp.structure]
  const cells = Math.pow(edge / (cmp.a * 1e-12), 3)
  return { ions: S.ionsPerCell * cells, units: S.unitsPerCell * cells, perEdge: (edge / (cmp.a * 1e-12)) * S.div }
}

/** The ratio of the radii (cation / anion): rock salt's lies between 0.414 and 0.732 in the classic rule. */
export const radiusRatio = c => radiusOf(c, CATION) / radiusOf(c, ANION)

/** Charges as text with a real minus: "+", "2+", "−", "2−". */
export function chargeText(q) {
  if (!q) return ''
  const n = Math.abs(q)
  return `${n > 1 ? n : ''}${q > 0 ? '+' : '−'}`
}
