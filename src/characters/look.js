// The Atomlings' second layer of looks (on top of the grammar in traits.js): what makes each of the
// 118 its own, especially the metals, which the grammar alone made silver twins.
// - Flame-test colours: an alkali metal's flame tuft burns in the colour its salts give a flame;
//   an alkaline earth metal's nubs glow in it.
// - Group styles: a transition metal's helmet has its column's shape, so a column looks like one.
// - Signatures: an object from the element's story (gold's crown, helium's balloon, chlorine's swim
//   ring...), 75 of the 118; signatures.js builds them.

/** Flame-test colours (the colour a flame turns with the element's salts). */
export const FLAME = {
  Li: '#ff2a48', Na: '#ffb21e', K: '#c58cff', Rb: '#e0457f', Cs: '#7a6dff', Fr: '#ff6a6a',
  Ca: '#ff6b2c', Sr: '#ff2d40', Ba: '#86ff52', Ra: '#ff3d5c', Mg: '#ffffff', Be: '#e8eef7',
}

/** The helmet's shape by group (3 to 12): crest, horns, visor... */
export const HELMET = {
  3: 'round', 4: 'crest', 5: 'horns', 6: 'visor', 7: 'spike', 8: 'plume', 9: 'bolts', 10: 'band', 11: 'coin', 12: 'drop',
}

/** Objects from an element's story, worn or carried (built in signatures.js; their words in
 *  explain.js). Chosen where the object is truly the element's: a use everyone meets, its name's
 *  story, or the thing it is famous for, so that look-alike neighbours can be told apart. */
export const SIGNATURE = {
  // the first thirteen
  H: 'drop', He: 'balloon', Li: 'battery', Na: 'salt', Mg: 'leaf', P: 'match', K: 'banana', Ca: 'bone',
  Si: 'chip', Fe: 'magnet', Cu: 'coil', W: 'bulb', Au: 'crown',
  // periods 2 and 3
  Be: 'mirror', B: 'slime', C: 'pencil', N: 'crisps', O: 'fishbowl', F: 'toothbrush', Ne: 'neonsign',
  Al: 'can', S: 'egg', Cl: 'swimring', Ar: 'pillow',
  // period 4
  Ti: 'plane', V: 'spanner', Cr: 'ruby', Co: 'brush', Ni: 'coin', Zn: 'sunscreen', Ga: 'melt', Ge: 'flag-de',
  Se: 'moon', Kr: 'magnifier',
  // period 5
  Sr: 'glowstar', Rh: 'rose', Pd: 'car', Ag: 'medal', In: 'phone', Sn: 'soldier', Te: 'earth', I: 'flask',
  Xe: 'probe',
  // period 6
  Cs: 'clock', Ba: 'firework', Os: 'dumbbell', Ir: 'asteroid', Pt: 'ring', Hg: 'thermometer', Pb: 'fishing',
  Bi: 'crystal', Po: 'flag-pl', Rn: 'warning',
  // period 7
  Fr: 'flag-fr', Ra: 'watch', Nh: 'flag-jp',
  // lanthanides
  La: 'camera', Ce: 'sparks', Pr: 'goggles', Nd: 'headphones', Pm: 'torch', Eu: 'banknote', Dy: 'turbine',
  Yb: 'flag-se', Lu: 'eiffel',
  // actinides
  Th: 'hammer', U: 'uranus', Np: 'neptune', Pu: 'pluto', Am: 'smoke', Cm: 'rover', Es: 'hair', Md: 'table',
  No: 'nobel',
  // the superheavies
  Cn: 'sun',
}

/** Signatures worn on the head in place of the family's mark (a transition metal's helmet). */
export const TAKES_HEAD = new Set(['crown', 'bulb'])

const mix = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (p, s) => (p >> s) & 255
  const c = s => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t)
  return `#${((c(16) << 16) | (c(8) << 8) | c(0)).toString(16).padStart(6, '0')}`
}

/** A metal's body: its real colour where it has one, else silver tinted toward its own colour. */
export function metalBody(base, accent, real) {
  return real ? base : mix(base, accent, 0.12)
}

export { mix }
