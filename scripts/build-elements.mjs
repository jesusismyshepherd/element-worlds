// Builds src/data/elements.json from the raw sources kept in scripts/data/ (no network needed):
//   pubchem.json    PubChem's periodic table (public domain): https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON
//   mendeleev.json  numeric fields of the mendeleev package (MIT), made by export_mendeleev.py
//   names.mjs       names in English (IUPAC) and European Portuguese
// Run: npm run data. Derived values (table position, valence, hands) are computed at run time in
// src/data/elements.js and src/chem/atom.js, where the tests can reach them.
import { readFileSync, writeFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { NAMES } from './data/names.mjs'
import { shellsOf } from '../src/chem/atom.js'

const here = p => fileURLToPath(new URL(p, import.meta.url))
const pubchem = JSON.parse(readFileSync(here('./data/pubchem.json'), 'utf8')).Table
const mendeleev = JSON.parse(readFileSync(here('./data/mendeleev.json'), 'utf8'))

const FAMILY = {
  'Nonmetal': 'nonmetal',
  'Noble gas': 'noble-gas',
  'Alkali metal': 'alkali-metal',
  'Alkaline earth metal': 'alkaline-earth-metal',
  'Metalloid': 'metalloid',
  'Halogen': 'halogen',
  'Post-transition metal': 'post-transition-metal',
  'Transition metal': 'transition-metal',
  'Lanthanide': 'lanthanide',
  'Actinide': 'actinide',
}

// Slips in the sources, fixed here so the raw files stay as published.
// Years: when the element was first recognised as new, or first isolated where PubChem gives the year
// a compound was known (fluorite 1670, alum and lime "ancient"); discoverers to match those years.
const YEAR = { 9: 1886, 13: 1825, 14: 1824, 20: 1808, 44: 1844 }
const DISCOVERERS = {
  2: 'Pierre Janssen, Norman Lockyer',
  4: 'Louis-Nicolas Vauquelin',
  8: 'Carl Wilhelm Scheele, Joseph Priestley',
  9: 'Henri Moissan',
  10: 'William Ramsay, Morris Travers',
  23: 'Andrés Manuel del Río (1801), Nils Gabriel Sefström (1830)',
  30: 'Andreas Sigismund Marggraf',
  36: 'William Ramsay, Morris Travers',
  54: 'William Ramsay, Morris Travers',
  78: 'Antonio de Ulloa',
  91: 'Kasimir Fajans, Oswald Helmuth Göhring',
}
const PLACE = {
  2: 'India, England', 4: 'France', 10: 'England', 18: 'England', 30: 'Germany', 36: 'England', 54: 'England', 78: 'Colombia',
}
// IUPAC's conventional weights where PubChem gives a rounded one; densities at 20 °C
const MASS = { 82: 207.2 }
const DENSITY = { 19: 0.862, 29: 8.96 }
// aluminium's melting point had two digits swapped (the ITS-90 fixed point is 933.473 K); helium only
// freezes under about 25 atm, so at normal pressure it has no melting point
const MELT = { 2: null, 13: 933.473 }
const EA = { 9: 3.401 }
const SPELLING = [
  [/A\.C\.Wohl/g, 'A. C. Wahl'], [/Humphrey Davy/g, 'Humphry Davy'], [/Johann Arfwedson/g, 'Johan August Arfwedson'],
  [/Ramsey/g, 'Ramsay'], [/Fredrich/g, 'Friedrich'], [/Smithson Tenant/g, 'Smithson Tennant'], [/S\.Tenant/g, 'S. Tennant'],
  [/Fourcory/g, 'Fourcroy'], [/Aver von Welsbach/g, 'Auer von Welsbach'], [/Nils Langet/g, 'Nils Langlet'], [/George Brandt/g, 'Georg Brandt'],
]
const spell = t => (t == null ? t : SPELLING.reduce((s, [a, b]) => s.replace(a, b), t))

const cols = pubchem.Columns.Column
const num = v => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v))
const round = (v, d = 4) => (v == null ? null : Number(v.toFixed(d)))

const elements = pubchem.Row.map(({ Cell }) => {
  const p = Object.fromEntries(cols.map((c, i) => [c, Cell[i]]))
  const z = Number(p.AtomicNumber)
  const m = mendeleev[z - 1]
  if (m.z !== z || m.symbol !== p.Symbol) throw new Error(`sources disagree at ${z}`)
  const family = FAMILY[p.GroupBlock]
  if (!family) throw new Error(`unknown family ${p.GroupBlock} (${p.Symbol})`)
  const stateText = p.StandardState.toLowerCase()
  const state = ['solid', 'liquid', 'gas'].find(s => stateText.includes(s)) ?? null
  const config = p.ElectronConfiguration.replace(/\s*\(predicted\)\s*/i, '').trim()
  const ancient = /ancient/i.test(p.YearDiscovered)
  return {
    z,
    symbol: p.Symbol,
    name: { en: NAMES[z][0], 'pt-pt': NAMES[z][1] },
    // the conventional atomic weight (mendeleev: Li 6.94, Ar 39.948, Pb 207.2) where PubChem gives
    // IUPAC's shorter abridged one; PubChem's for the superheavies (a mass number)
    mass: MASS[z] ?? (m.atomicWeight != null && m.isotopes.some(i => i.abundance) ? m.atomicWeight : num(p.AtomicMass)),
    family,
    group: m.group,
    period: m.period,
    block: m.block,
    config,
    configPredicted: /predicted/i.test(p.ElectronConfiguration),
    // From the configuration shown (PubChem's); mendeleev predicts other ones for Lr, Ds and Rg.
    shells: shellsOf(config),
    cpk: p.CPKHexColor ? `#${p.CPKHexColor.toLowerCase()}` : null,
    en: num(p.Electronegativity),
    // the first from PubChem; the next three from mendeleev where known
    ie: [num(p.IonizationEnergy), ...m.ionisationEnergies.slice(1).map(v => round(v, 3))],
    ea: EA[z] ?? num(p.ElectronAffinity),
    oxidation: p.OxidationStates ? p.OxidationStates.split(',').map(s => Number(s.trim())).filter(Number.isFinite) : [],
    state,
    statePredicted: /expected/i.test(p.StandardState),
    melt: z in MELT ? MELT[z] : num(p.MeltingPoint),
    boil: num(p.BoilingPoint),
    density: DENSITY[z] ?? num(p.Density),
    discovered: YEAR[z] ?? (ancient ? null : num(p.YearDiscovered)),
    ancient: YEAR[z] ? false : ancient,
    discoverers: DISCOVERERS[z] ?? (/known to the ancients/i.test(m.discoverers ?? '') ? null : spell(m.discoverers)),
    discoveryPlace: PLACE[z] ?? m.discoveryLocation,
    radius: {
      covalent: round(m.covalentRadius, 1),
      atomic: round(m.atomicRadius, 1),
      vdw: round(m.vdwRadius, 1),
      metallic: round(m.metallicRadius, 1),
    },
    abundance: { crust: m.abundanceCrust, sea: m.abundanceSea },
    radioactive: m.radioactive,
    lattice: m.latticeStructure,
    thermalConductivity: m.thermalConductivity,
    specificHeat: m.specificHeat,
    pricePerKg: m.pricePerKg,
    isotopes: m.isotopes.map(i => ({
      A: i.A,
      abundance: i.abundance,
      halfLife: i.halfLife,
      halfLifeUnit: i.halfLifeUnit,
      halfLifeSeconds: i.halfLifeSeconds,
    })),
  }
})

if (elements.length !== 118) throw new Error(`expected 118 elements, got ${elements.length}`)

// Build the whole text first, then swap it in (never truncate the old file before the new one exists).
const out = here('../src/data/elements.json')
const text = JSON.stringify(elements)
JSON.parse(text)
writeFileSync(out + '.tmp', text)
renameSync(out + '.tmp', out)

const counts = elements.reduce((a, e) => ((a[e.family] = (a[e.family] ?? 0) + 1), a), {})
console.log(`118 elements -> src/data/elements.json (${(text.length / 1024).toFixed(1)} KB)`)
console.log(counts)
