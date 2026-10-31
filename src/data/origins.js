// Where the atoms of each element in the Solar System were made, after Jennifer Johnson's periodic table
// of the origins of the elements (Ohio State University; the SDSS blog, 2017; Science 363, 474, 2019).
// Johnson published it as a picture, each element's tile filled in proportion to its sources, not as a
// table: these shares are as read from her 2017 chart by CMG Lee for Wikimedia Commons ("Nucleosynthesis
// periodic table.svg", 4 November 2017, CC BY-SA 3.0), rounded to whole per cent there. So they are
// approximate (a few per cent either way), and the 2019 version may differ slightly. docs/knowledge/
// star-forge.md lists what is approximated. Elements past lawrencium (103) have none: made only by people.
//
// The sources, in Johnson's colours: b the Big Bang, c cosmic rays splitting atoms, l dying low-mass stars,
// n merging neutron stars, m exploding massive stars, w exploding white dwarfs, x none (no stable or
// long-lived isotope: made by people).

export const SOURCES = [
  { id: 'b', key: 'bigbang', color: '#0099ff' },
  { id: 'c', key: 'cosmic', color: '#ff9999' },
  { id: 'l', key: 'lowmass', color: '#3fcf5a' },
  { id: 'm', key: 'massive', color: '#ffcc00' },
  { id: 'w', key: 'whitedwarf', color: '#e6e6ee' },
  { id: 'n', key: 'merger', color: '#c58cff' },
  { id: 'x', key: 'people', color: '#8f8f66' },
]
export const SOURCE = Object.fromEntries(SOURCES.map(s => [s.id, s]))

// atomic number 1 to 103, in order: each source's per cent
const RAW = [
  'b100', 'b91 m5 l4', 'b23 c13 l64', 'c100', 'c100', 'm25 l75',
  'm25 l75', 'm100', 'm100', 'm100', 'm100', 'm99 w1',
  'm99.6 w0.4', 'm71 w29', 'm97 w3', 'm58 w42', 'm84 w16', 'm56 w44',
  'm82 w18', 'm51 w49', 'm82 w18', 'm35 w65', 'm25 w75', 'm23 w77',
  'm16 w84', 'm36 w64', 'm33 w67', 'm30 w70', 'm42 w58', 'm46 w54',
  'm100', 'm100', 'm100', 'm100', 'm100', 'm100',
  'm100', 'm13 l87', 'm8 l92', 'm16 l84', 'l87 n13', 'l63 n37',
  'x100', 'l32 n68', 'l13 n87', 'l45 n55', 'l19 n81', 'l52 n48',
  'l36 n64', 'l69 n31', 'l25 n75', 'l57 n43', 'l5 n95', 'l17 n83',
  'l15 n85', 'l82 n18', 'l62 n38', 'l76 n24', 'l48 n52', 'l60 n40',
  'x100', 'l29 n71', 'l5 n95', 'l15 n85', 'l7 n93', 'l14 n86',
  'l7 n93', 'l16 n84', 'l12 n88', 'l32 n68', 'l20 n80', 'l55 n45',
  'l41 n59', 'l57 n43', 'l8 n92', 'l10 n90', 'l1 n99', 'l5 n95',
  'l6 n94', 'l62 n38', 'l77 n23', 'l47 n53', 'l0.5 n99.5', 'n100',
  'n100', 'n100', 'n100', 'n100', 'n100', 'n100',
  'n100', 'n100', 'n100', 'n100', 'x100', 'x100',
  'x100', 'x100', 'x100', 'x100', 'x100', 'x100',
  'x100',
]

/** Element Z's sources: [{ id, share (0..1) }], the biggest first. */
export function originOf(Z) {
  const raw = RAW[Z - 1]
  if (!raw) return [{ id: 'x', share: 1 }]
  return raw.split(' ').map(p => ({ id: p[0], share: Number(p.slice(1)) / 100 })).sort((a, b) => b.share - a.share)
}

/** The biggest source of element Z. */
export const mainOrigin = Z => originOf(Z)[0].id

// A body's main elements by mass (per cent), as carbon's "What are you made of?" room has them (oxygen 65,
// carbon 18, hydrogen 10, nitrogen 3, calcium 1.5, phosphorus 1), and the next few (Emsley, Nature's
// Building Blocks; the usual textbook table): potassium 0.4, sulfur 0.3, sodium 0.2, chlorine 0.2, magnesium
// 0.1; iron about 4 g in 70 kg (0.006), iodine about 15 mg (0.00002).
export const BODY = [
  [8, 65], [6, 18], [1, 10], [7, 3], [20, 1.5], [15, 1], [19, 0.4], [16, 0.3], [11, 0.2], [17, 0.2], [12, 0.1], [26, 0.006], [53, 0.00002],
]

/** How much of a body (by mass, per cent) each source made: { b, m, l, w, n, ... }. */
export function bodyBySource() {
  const out = {}
  for (const [Z, pct] of BODY) {
    for (const { id, share } of originOf(Z)) out[id] = (out[id] ?? 0) + pct * share
  }
  return out
}
