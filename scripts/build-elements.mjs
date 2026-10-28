// Builds src/data/elements.json from the raw sources kept in scripts/data/ (no network needed):
//   pubchem.json    PubChem's periodic table (public domain): https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON
//   mendeleev.json  numeric fields of the mendeleev package (MIT), made by export_mendeleev.py
//   names.mjs       names in English (IUPAC), European Portuguese, Polish and German
// Run: npm run data. Derived values (table position, valence, hands) are computed at run time in
// src/data/elements.js and src/chem/atom.js, where the tests can reach them.
import { readFileSync, writeFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { NAMES } from './data/names.mjs'
import { shellsOf } from '../src/chem/atom.js'
import { UNCONFIRMED, HALF, half } from './data/fixes.mjs'

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
// The superheavies: the year of the work IUPAC and IUPAP credited (nobelium: Dubna 1966, not the
// unconfirmed Stockholm claim of 1957; bohrium: GSI 1981, not Dubna's rejected 1976 claim).
const YEAR = { 9: 1886, 13: 1825, 14: 1824, 20: 1808, 44: 1844, 102: 1966, 105: 1968, 107: 1981 }
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
  67: 'Marc Delafontaine, Jacques-Louis Soret, Per Teodor Cleve',
  78: 'Antonio de Ulloa',
  83: 'Claude François Geoffroy',
  91: 'Kasimir Fajans, Oswald Helmuth Göhring',
  101: 'Albert Ghiorso, Bernard G. Harvey, Gregory R. Choppin, Stanley G. Thompson, Glenn T. Seaborg',
  102: "Georgy Flerov's team (JINR, Dubna)",
  104: "Georgy Flerov's team (Dubna, 1964) and Albert Ghiorso's team (Berkeley, 1969), credit shared",
  105: "Georgy Flerov's team (Dubna, 1968) and Albert Ghiorso's team (Berkeley, 1970), credit shared",
  106: 'Albert Ghiorso, J. Michael Nitschke, Kenneth Hulet and team (Berkeley and Livermore)',
  107: "Peter Armbruster and Gottfried Münzenberg's team (GSI)",
  116: "Yuri Oganessian's team (JINR, Dubna) with Lawrence Livermore National Laboratory",
}
const PLACE = {
  2: 'India, England', 4: 'France', 10: 'England', 18: 'England', 23: 'Mexico (1801), Sweden (1830)', 30: 'Germany',
  36: 'England', 54: 'England', 78: 'Colombia', 83: 'France', 91: 'Germany',
  102: 'Soviet Union (Dubna)', 104: 'Soviet Union (Dubna), United States (Berkeley)',
  105: 'Soviet Union (Dubna), United States (Berkeley)', 106: 'United States (Berkeley, Livermore)',
  107: 'Germany (Darmstadt)', 116: 'Russia (Dubna), with the United States (Livermore)',
}
// IUPAC's conventional weights where PubChem gives a rounded one; densities at 20 °C
const MASS = { 82: 207.2 }
const DENSITY = { 19: 0.862, 29: 8.96, 44: 12.45, 73: 16.69, 75: 21.02, 76: 22.59, 77: 22.56 }
// erbium's colour is blank in PubChem (Jmol's #00e675, between holmium and thulium)
const CPK = { 68: '00e675' }
// first ionisation energies measured on a few atoms: astatine 9.31751 eV (Rothe 2013), francium
// 4.0727 eV (NIST), nobelium 6.626 eV (Chhetri 2018), lawrencium 4.96 eV (Sato 2015)
const IE1 = { 85: 9.31751, 87: 4.0727, 102: 6.626, 103: 4.96 }
// lawrencium: its low ionisation energy supports 7p1 rather than 6d1 (still a calculation)
const CONFIG = { 103: '[Rn]5f14 7s2 7p1' }
// states by calculation: copernicium a liquid (Mewes 2019), flerovium probably a liquid, oganesson a
// solid (Smits 2020); never seen in bulk, so their states are predictions too: astatine, francium,
// fermium to lawrencium
const STATE = { 112: 'liquid', 114: 'liquid', 118: 'solid' }
const STATE_PREDICTED = new Set([85, 87, 100, 101, 102, 103, 112, 114, 118])
const BOIL = { 112: 340, 118: 450 }
// isotope fixes shared with the chart of nuclides (scripts/data/fixes.mjs): unconfirmed ones out,
// newer half-lives in
function fixIsotopes(symbol, list) {
  const key = i => `${symbol}-${i.A}`
  let out = list.filter(i => !UNCONFIRMED.has(key(i))).map(i => (HALF[key(i)] && !i.meta ? { ...i, ...half(HALF[key(i)]) } : i))
  for (const [k, v] of Object.entries(HALF)) {
    const [s, A] = k.split('-')
    if (s === symbol && !out.some(i => i.A === Number(A))) out.push({ A: Number(A), abundance: null, ...half(v) })
  }
  if (out.length !== list.length || out.some((i, n) => i !== list[n])) {
    // the radioactive ones longest first, as the sources list them
    const natural = out.filter(i => i.abundance)
    out = [...natural, ...out.filter(i => !i.abundance).sort((a, b) => (b.halfLifeSeconds ?? 0) - (a.halfLifeSeconds ?? 0))]
  }
  return out
}
// isotopes: tantalum's second natural one, Ta-180m (0.01201%, CIAAW)
const ISOTOPE = {
  73: list => [list[0], { A: 180, meta: true, abundance: 0.01201, halfLife: null, halfLifeUnit: null, halfLifeSeconds: null }, ...list.slice(1).filter(i => i.A !== 180)],
}
// indium in seawater: the old table value was about 100 000 times too high (Alibo, Nozaki and Jeandel 1999)
const SEA = { 49: 1e-7 }
// at normal pressure these turn straight from solid to gas (sublime) at this temperature, in K
const SUBLIMES = { 6: 3915, 33: 887 }
// aluminium's melting point had two digits swapped (the ITS-90 fixed point is 933.473 K); helium only
// freezes under about 25 atm, so at normal pressure it has no melting point
// (copernicium 283 K and oganesson 325 K by calculation)
const MELT = { 2: null, 13: 933.473, 112: 283, 118: 325 }
// astatine's electron affinity was measured in 2020: 2.416 eV (Leimbach)
const EA = { 9: 3.401, 85: 2.416 }
const SPELLING = [
  [/A\.C\.Wohl/g, 'A. C. Wahl'], [/Émillo Segrè/g, 'Emilio Segrè'], [/G\. Kirchoff/g, 'Gustav Kirchhoff'],
  [/Gustov Kirchoff/g, 'Gustav Kirchhoff'], [/Charles Hatchet/g, 'Charles Hatchett'], [/Johann Gahn/g, 'Johan Gottlieb Gahn'],
  [/Johann Gadolin/g, 'Johan Gadolin'], [/Karl Klaus/g, 'Karl Ernst Claus'], [/Collet-Descoltils/g, 'Collet-Descotils'], [/Humphrey Davy/g, 'Humphry Davy'], [/Johann Arfwedson/g, 'Johan August Arfwedson'],
  [/Ramsey/g, 'Ramsay'], [/Fredrich/g, 'Friedrich'], [/Smithson Tenant/g, 'Smithson Tennant'], [/S\.Tenant/g, 'S. Tennant'],
  [/Fourcory/g, 'Fourcroy'], [/Aver von Welsbach/g, 'Auer von Welsbach'], [/Nils Langet/g, 'Nils Langlet'], [/George Brandt/g, 'Georg Brandt'],
  [/S\.G\.Tompson/g, 'S. G. Thompson'], [/Marguerite Derey/g, 'Marguerite Perey'], [/E\.Segré/g, 'E. Segrè'],
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
  const state = STATE[z] ?? ['solid', 'liquid', 'gas'].find(s => stateText.includes(s)) ?? null
  const config = CONFIG[z] ?? p.ElectronConfiguration.replace(/\s*\((predicted|calculated)\)\s*/i, '').trim()
  const ancient = /ancient/i.test(p.YearDiscovered)
  return {
    z,
    symbol: p.Symbol,
    name: { en: NAMES[z][0], 'pt-pt': NAMES[z][1], pl: NAMES[z][2], de: NAMES[z][3] },
    // the conventional atomic weight (mendeleev: Li 6.94, Ar 39.948, Pb 207.2) where PubChem gives
    // IUPAC's shorter abridged one; PubChem's for the superheavies (a mass number)
    mass: MASS[z] ?? (m.atomicWeight != null && m.isotopes.some(i => i.abundance) ? m.atomicWeight : num(p.AtomicMass)),
    family,
    group: m.group,
    period: m.period,
    block: m.block,
    config,
    configPredicted: z in CONFIG || /predicted|calculated/i.test(p.ElectronConfiguration),
    // From the configuration shown (PubChem's, lawrencium's from CONFIG); mendeleev predicts other ones for Ds and Rg.
    shells: shellsOf(config),
    // (PubChem drops leading zeros: palladium's "6985" is #006985)
    cpk: CPK[z] ? `#${CPK[z]}` : p.CPKHexColor ? `#${p.CPKHexColor.toLowerCase().padStart(6, '0')}` : null,
    en: num(p.Electronegativity),
    // the first from PubChem; the next three from mendeleev where known
    ie: [IE1[z] ?? num(p.IonizationEnergy), ...m.ionisationEnergies.slice(1).map(v => round(v, 3))],
    ea: EA[z] ?? num(p.ElectronAffinity),
    oxidation: p.OxidationStates ? p.OxidationStates.split(',').map(s => Number(s.trim())).filter(Number.isFinite) : [],
    state,
    statePredicted: STATE_PREDICTED.has(z) || /expected/i.test(p.StandardState),
    melt: z in MELT ? MELT[z] : num(p.MeltingPoint),
    boil: z in BOIL ? BOIL[z] : num(p.BoilingPoint),
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
    abundance: { crust: m.abundanceCrust, sea: z in SEA ? SEA[z] : m.abundanceSea },
    sublimes: SUBLIMES[z] ?? null,
    radioactive: m.radioactive,
    lattice: m.latticeStructure,
    thermalConductivity: m.thermalConductivity,
    specificHeat: m.specificHeat,
    pricePerKg: m.pricePerKg,
    isotopes: fixIsotopes(p.Symbol, (ISOTOPE[z] ?? (l => l))(m.isotopes.map(i => ({
      A: i.A,
      abundance: i.abundance,
      halfLife: i.halfLife,
      halfLifeUnit: i.halfLifeUnit,
      halfLifeSeconds: i.halfLifeSeconds,
    })))),
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
