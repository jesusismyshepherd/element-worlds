// The 118 elements (elements.json, built by scripts/build-elements.mjs) with lookups and their place in
// the table. Pure data: the 3D and the HUD read it.
import DATA from './elements.json' with { type: 'json' }

export const ELEMENTS = DATA
const BY_SYMBOL = new Map(DATA.map(e => [e.symbol.toLowerCase(), e]))

/** An element by atomic number or symbol (any case); undefined when there is none. */
export function element(ref) {
  if (typeof ref === 'number') return DATA[ref - 1]
  if (/^\d+$/.test(String(ref))) return DATA[Number(ref) - 1]
  return BY_SYMBOL.get(String(ref).toLowerCase())
}

/** The element's name in a language ('pt-pt', 'en'), English when there is none. */
export function nameOf(el, lang) {
  return el.name[lang] ?? el.name.en
}

export const F_ROW = { 6: 9, 7: 10 }

/** The element's cell in the 18-column table: { col: 1..18, row: 1..7 } for the main body, rows 9 and
 *  10 for the f-block (lanthanum to lutetium, actinium to lawrencium, from column 3), row 8 left empty
 *  as the gap. Group 3 holds scandium and yttrium; rows 6 and 7 of it point to the f-block. */
export function cellOf(el) {
  if (el.z >= 57 && el.z <= 71) return { col: 3 + el.z - 57, row: F_ROW[6] }
  if (el.z >= 89 && el.z <= 103) return { col: 3 + el.z - 89, row: F_ROW[7] }
  return { col: el.group, row: el.period }
}

/** The families in the order of the legend, with their colours (glow on the plaza, tint inside). */
export const FAMILIES = [
  { id: 'alkali-metal', color: '#ff6b5e' },
  { id: 'alkaline-earth-metal', color: '#ffa94d' },
  { id: 'transition-metal', color: '#f7d154' },
  { id: 'post-transition-metal', color: '#7fd7a8' },
  { id: 'metalloid', color: '#4fd1c5' },
  { id: 'nonmetal', color: '#5aa9ff' },
  { id: 'halogen', color: '#b38cff' },
  { id: 'noble-gas', color: '#ff7ad9' },
  { id: 'lanthanide', color: '#9be15d' },
  { id: 'actinide', color: '#ff8fa3' },
]
export const FAMILY = Object.fromEntries(FAMILIES.map(f => [f.id, f]))
