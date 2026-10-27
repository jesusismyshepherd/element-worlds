// The Atomling grammar (docs/design.md): what an element's character looks like and how it moves,
// read from the element's real properties. Pure: element record in, description out; the builder
// (atomling.js) only draws what this says, and the tests check it for all 118.
import { hands, isMetal, nucleus, octetPlaces, valenceElectrons } from '../chem/atom.js'

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = v => Math.max(0, Math.min(1, v))

// Range of covalent radii (pm, Pyykkö) mapped to heights: hydrogen 32, caesium 232.
const R_MIN = 32
const R_MAX = 232
export const H_MIN = 0.7
export const H_MAX = 1.6

// Real look of metals that are not silvery; every other metal is silver with a faint tint of its colour.
const METAL_TINT = {
  Cu: '#e0875e', Au: '#ffcc4d', Cs: '#e9cf8c', Os: '#9fb2d6', Bi: '#d4bfe0', Pb: '#8e96a5',
}

// The colour of each noble gas glowing in a discharge tube (the neon-sign colours), which is how
// people see them; oganesson is unknown.
const DISCHARGE = { He: '#ffb38a', Ne: '#ff5a3c', Ar: '#c38bff', Kr: '#e8ddff', Xe: '#7ea8ff', Rn: '#ff6f86', Og: '#9aa3b5' }

const MARK = {
  'alkali-metal': 'flame',
  'alkaline-earth-metal': 'nubs',
  'transition-metal': 'helmet',
  'post-transition-metal': 'cap',
  metalloid: 'antenna',
  halogen: 'crest',
  'noble-gas': 'halo',
  lanthanide: 'gem',
  actinide: 'gem',
  nonmetal: null,
}

// Touches from an element's own story, on top of the grammar (more come element by element):
// carbon's body is clear like diamond and its hands are graphite, its two best-known forms.
const SIGNATURE = {
  C: { body: '#dfe8f3', limbs: '#2e323b', sparkle: true },
}

const EYES = {
  'alkali-metal': 'eager',
  halogen: 'sharp',
  'noble-gas': 'serene',
}

/** Air is about 29 g/mol: a gas Atomling floats higher the lighter its gas is than air (its usual
 *  molecule: H2, N2, O2, F2, Cl2 are pairs; the noble gases single atoms). */
const AIR = 28.96
const DIATOMIC = new Set(['H', 'N', 'O', 'F', 'Cl'])

export function traitsOf(el) {
  const metal = isMetal(el)
  const r = el.radius.covalent ?? 150
  const height = lerp(H_MIN, H_MAX, clamp01((r - R_MIN) / (R_MAX - R_MIN)))
  const state = el.state ?? 'solid'
  const locomotion = state === 'gas' ? 'float' : state === 'liquid' ? 'slide' : 'walk'
  const molar = el.mass * (DIATOMIC.has(el.symbol) ? 2 : 1)
  // lighter than air: up to a metre and a half above the floor; heavier: a hand's breadth
  const hover = locomotion === 'float' ? (molar < AIR ? lerp(1.5, 0.6, molar / AIR) : lerp(0.35, 0.12, clamp01((molar - AIR) / 200))) : 0
  const h = hands(el)
  const places = octetPlaces(el)
  const material = el.family === 'noble-gas' ? 'noble' : metal ? 'metal' : el.family === 'metalloid' ? 'metalloid' : 'nonmetal'
  const cpk = el.cpk ?? '#b0b8c8'
  const body = material === 'metal' ? METAL_TINT[el.symbol] ?? '#c9ced8' : material === 'noble' ? DISCHARGE[el.symbol] ?? cpk : cpk
  const superheavy = el.z >= 104
  // speed from anatomy (as in the arena): legs grow with height, walking speed with the square root
  // of the leg; heavy atoms a little slower; floaters glide, slides creep
  const heft = 1 - 0.12 * clamp01(Math.log10(el.mass) / Math.log10(300))
  const walk = (locomotion === 'float' ? 1.25 : locomotion === 'slide' ? 0.75 : 1.05 * Math.sqrt(height / 0.9)) * heft
  return {
    z: el.z,
    symbol: el.symbol,
    family: el.family,
    height,
    width: el.family === 'alkali-metal' ? 0.96 : el.family === 'noble-gas' ? 0.8 : el.family === 'halogen' ? 0.8 : 0.86,
    locomotion,
    hover,
    hands: h.count,
    giving: h.giving,
    // s-block metals and aluminium hold their outer electrons in their hands, ready to give them away
    electronsInHands: metal && (el.block === 's' || el.block === 'p'),
    valence: valenceElectrons(el),
    places,
    full: places != null && valenceElectrons(el) === places,
    inner: el.shells.slice(0, -1),
    nucleus: nucleus(el),
    material,
    translucent: material === 'nonmetal' || material === 'noble' || locomotion === 'float',
    body: SIGNATURE[el.symbol]?.body ?? body,
    limbs: SIGNATURE[el.symbol]?.limbs ?? null,
    sparkle: !!SIGNATURE[el.symbol]?.sparkle,
    accent: material === 'metal' ? cpk : body,
    mark: el.z === 1 ? 'curl' : MARK[el.family] ?? null,
    eyes: EYES[el.family] ?? (metal ? 'steady' : 'friendly'),
    radioactive: !!el.radioactive,
    superheavy,
    speeds: { walk, run: walk * 2.1 },
    jump: locomotion === 'float' ? 0.5 : 0.25 + height * 0.25,
  }
}
