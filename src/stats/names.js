// Names in plain English for what the usage events mention: places (worlds and pages), panels (the
// exhibits of a hall or a wing), the plaza's drawers, levels, views, languages, forge missions and beams,
// and people (a marked device's tag, or an anonymous visitor). The dashboard shows these instead of ids.
import { element } from '../data/elements.js'
import { WINGS } from '../worlds/registry.js'
import { MISSIONS, BEAM_NAMES } from '../worlds/forge/words.js'
import en from '../i18n/locales/en.json' with { type: 'json' }

/** An element's English name from its number or symbol; the raw value when there is no such element. */
export function elementName(ref) {
  const el = ref == null || ref === '' ? null : element(ref)
  return el ? el.name.en : String(ref ?? '?')
}

/** The symbol of an element from its number or symbol (null when there is none). */
export const symbolOf = ref => (ref == null || ref === '' ? null : element(ref)?.symbol ?? null)

export const wingTitle = (symbol, id) => en.wings?.[symbol]?.[id]?.title ?? id

const PAGES = { '/passport': 'the passport page', '/atomlings': 'the Atomlings page', '/stats': 'this dashboard' }

/** A world or page as telemetry.js names it ('plaza', 'atrium:C', 'wing:C:allotropes', 'page:/passport'). */
export function placeName(w) {
  const key = String(w ?? '')
  if (key === 'plaza') return 'the plaza'
  if (key === 'lab') return 'the Molecule Lab'
  if (key === 'forge') return 'the Atom Forge'
  if (key === 'stars') return 'the Star Forge'
  const [kind, a, b] = key.split(':')
  if (kind === 'atrium' && a) return `${elementName(a)}'s hall`
  if (kind === 'wing' && a && b) return `${elementName(a)}'s wing “${wingTitle(a, b)}”`
  if (kind === 'page') {
    const path = key.slice(5)
    return PAGES[path] ?? `the page ${path}`
  }
  return key || 'somewhere'
}

/** The same, starting with a capital (for the start of a line or a table cell). */
export const PlaceName = w => {
  const s = placeName(w)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// the eight text stations of a hall without picture boards (src/content/stations.js, English titles)
const STATIONS = {
  identity: 'Identity card',
  atom: 'Inside the atom',
  state: 'At room temperature',
  discovery: 'Discovery',
  found: 'Where it is found',
  uses: 'What it is for',
  family: 'Its family',
  isotopes: 'Isotopes',
}
// the hall's other exhibits (src/worlds/atrium/atrium.js)
const EXHIBITS = { facts: 'the Fact file', look: 'the specimen case', 'big-atom': 'the big atom (Inside the atom)', host: 'the Atomling' }

// picture boards' titles by `${symbol}:${id}`, filled by the page once it has loaded a hall's boards
const BOARD_TITLES = new Map()
export function setBoardTitles(symbol, boards) {
  for (const b of boards ?? []) if (b?.id) BOARD_TITLES.set(`${symbol}:${b.id}`, b.title?.en ?? b.id)
}

/** A panel by the id telemetry.js gives it: the exhibit's id ('facts', 'board:twins', 'identity'), or the
 *  panel's title when it was not opened from an exhibit. `place` says where it was opened. */
export function panelName(id, place = '') {
  const s = String(id ?? '')
  if (EXHIBITS[s]) return EXHIBITS[s]
  if (STATIONS[s]) return `“${STATIONS[s]}”`
  if (s.startsWith('board:')) {
    const board = s.slice(6)
    const symbol = String(place).split(':')[1] ?? ''
    const title = BOARD_TITLES.get(`${symbol}:${board}`)
    return title ? `the board “${title}”` : `the “${board}” board`
  }
  return s ? `“${s}”` : 'a panel'
}

/** Where a group of panels was opened (analyze.js panelGroupsOf: 'hall', 'wing:<id>' or a place). */
export function whereName(where, places = []) {
  if (where === 'hall') {
    const halls = places.filter(p => p.startsWith('atrium:')).map(p => p.slice(7))
    if (halls.length === 1) return `${elementName(halls[0])}'s hall`
    return halls.length ? `${halls.length} halls` : 'the halls'
  }
  if (where.startsWith('wing:')) {
    const id = where.slice(5)
    const syms = places.filter(p => p.startsWith('wing:')).map(p => p.split(':')[1])
    const title = syms.length ? wingTitle(syms[0], id) : id
    return syms.length === 1 ? placeName(`wing:${syms[0]}:${id}`) : `“${title}” (${syms.length} wings)`
  }
  return placeName(where)
}

// the plaza's drawers (src/ui/PlazaHud.jsx DRAWERS)
const DRAWERS = { find: 'Search', families: 'Families', time: 'Time machine', trends: 'Trends' }
/** One of the plaza's drawers: its title, and in a sentence. */
export const drawerTitle = id => DRAWERS[id] ?? String(id ?? '?')
export const drawerName = id => `the ${drawerTitle(id)} drawer`

export const levelName = v => (v === 'scientist' ? 'Scientist' : v === 'explorer' ? 'Explorer' : String(v ?? '?'))
export const viewName = v => (v === 'first' ? 'the first-person view' : v === 'third' ? 'the character view' : `the ${String(v ?? '?')} view`)
const LANGS = { 'pt-pt': 'Portuguese', pt: 'Portuguese', en: 'English', pl: 'Polish', de: 'German' }
export const langName = v => LANGS[String(v ?? '').toLowerCase()] ?? String(v ?? '?')

/** A mission by the id its event carries ('forge:C12'). */
export function missionName(id) {
  const s = String(id ?? '')
  if (s.startsWith('forge:')) {
    const m = MISSIONS.find(x => x.id === s.slice(6))
    if (m) return m.name.en
  }
  return s || 'a mission'
}

export const beamName = id => BEAM_NAMES.en[id] ?? String(id ?? '?')

/** A nucleus or atom on the forge's table: carbon-12, a free neutron, nothing. */
export function nuclideName(z, n) {
  const Z = Math.max(0, Math.round(Number(z) || 0))
  const N = Math.max(0, Math.round(Number(n) || 0))
  if (Z === 0) return N === 0 ? 'nothing' : N === 1 ? 'a free neutron' : `${N} neutrons`
  return `${elementName(Z).toLowerCase()}-${Z + N}`
}

// the things to find and use, for "never used" (analyze.js FEATURES has the tests)
const FEATURES = {
  quiz: 'the quiz “Who am I?”',
  facts: "the plaza card's facts",
  talk: 'talking to an Atomling',
  tile: "a hall's floor table",
  find: 'the search',
  families: 'the families drawer',
  time: 'the time machine',
  trends: 'the trends (Scientist only)',
  scientist: 'the Scientist level',
  first: 'the first-person view',
  beam: "the forge's beam",
  passport: 'the passport page',
  atomlings: 'the Atomlings page',
}
export const featureName = id => FEATURES[id] ?? id

/** Who a visit or device is: its tag, or "an anonymous visitor". */
export const personName = label => (label ? label : 'anonymous')

/** A device in a few words: "phone, Chrome on Android". */
export function deviceName(kind, browser) {
  return [kind, browser].filter(Boolean).join(', ') || 'unknown device'
}

/** The wings every element's hall leads to, as place keys ('wing:C:allotropes'). */
export const WING_PLACES = Object.entries(WINGS).flatMap(([symbol, ws]) => ws.map(w => `wing:${symbol}:${w.id}`))
