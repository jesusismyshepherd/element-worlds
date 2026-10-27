// Text helpers for oxygen's wings (no three.js here, so the tests can use them).

const SUB = '₀₁₂₃₄₅₆₇₈₉'
const SYMBOLS = new Set(['H', 'He', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Kr', 'Xe'])

/** Formulas in a sentence get real subscripts: "CO2 and 2 H2O" -> "CO₂ and 2 H₂O" (the HUD's fonts
 *  fall back for the subscript digits). Numbers on their own, and words like "AO90", are left alone. */
export function chem(text) {
  return String(text).replace(/(?<![A-Za-z0-9])(?:[A-Z][a-z]?\d*)+(?![a-z0-9])/g, tok => {
    if (!/\d/.test(tok)) return tok
    const parts = tok.match(/[A-Z][a-z]?\d*/g)
    if (parts.join('') !== tok || !parts.every(p => SYMBOLS.has(p.replace(/\d+$/, '')))) return tok
    return tok.replace(/\d/g, d => SUB[d])
  })
}

/** A panel's blocks with formulas made readable. */
export function chemBlocks(blocks) {
  return blocks.map(b => {
    if (b.p) return { p: chem(b.p) }
    if (b.big) return { big: chem(b.big), small: b.small ? chem(b.small) : undefined }
    if (b.rows) return { rows: b.rows.map(([k, v]) => [chem(k), chem(v)]) }
    if (b.list) return { list: b.list.map(chem) }
    return b
  })
}

/** Text at the reader's depth from { kid, sci } (or a plain string). */
export const at = (entry, level) => (entry == null ? '' : typeof entry === 'string' ? entry : (level === 'scientist' ? entry.sci : null) ?? entry.kid ?? entry.sci)
