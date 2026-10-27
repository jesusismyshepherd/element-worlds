// The Atomlings' second layer of looks (on top of the grammar in traits.js): what makes each of the
// 118 its own, especially the metals, which the grammar alone made silver twins.
// - Flame-test colours: an alkali metal's flame tuft burns in the colour its salts give a flame;
//   an alkaline earth metal's nubs glow in it.
// - Group styles: a transition metal's helmet has its column's shape, so a column looks like one.
// - Signatures: an object from the element's story (gold's crown, helium's balloon...).

/** Flame-test colours (the colour a flame turns with the element's salts). */
export const FLAME = {
  Li: '#ff2a48', Na: '#ffb21e', K: '#c58cff', Rb: '#e0457f', Cs: '#7a6dff', Fr: '#ff6a6a',
  Ca: '#ff6b2c', Sr: '#ff2d40', Ba: '#86ff52', Ra: '#ff3d5c', Mg: '#ffffff', Be: '#e8eef7',
}

/** The helmet's shape by group (3 to 12): crest, horns, visor... */
export const HELMET = {
  3: 'round', 4: 'crest', 5: 'horns', 6: 'visor', 7: 'spike', 8: 'plume', 9: 'bolts', 10: 'band', 11: 'coin', 12: 'drop',
}

/** Objects from an element's story, worn or carried. */
export const SIGNATURE = {
  H: 'drop', He: 'balloon', Li: 'battery', Na: 'salt', Mg: 'leaf', P: 'match', K: 'banana', Ca: 'bone',
  Si: 'chip', Fe: 'magnet', Cu: 'coil', W: 'bulb', Au: 'crown',
}

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
