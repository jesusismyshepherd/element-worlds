// Numbers for people: temperatures in °C (and K for the scientist), masses, densities.
export const celsius = k => (k == null ? null : Math.round(k - 273.15))

export function temperature(k, level, lang) {
  if (k == null) return '?'
  const c = celsius(k).toLocaleString(lang)
  return level === 'scientist' ? `${c} °C (${num(k, lang, 6)} K)` : `${c} °C`
}

export function num(v, lang, digits = 4) {
  if (v == null) return '?'
  // tiny amounts in powers of ten (radon in the crust: 4 × 10⁻¹³), never "0"
  if (v !== 0 && Math.abs(v) < 1e-4) {
    const e = Math.floor(Math.log10(Math.abs(v)))
    const m = Number((v / 10 ** e).toPrecision(Math.min(digits, 3)))
    const sup = String(e).replace(/-/g, '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])
    return `${m.toLocaleString(lang)} × 10${sup}`
  }
  return Number(v.toPrecision(digits)).toLocaleString(lang, { maximumFractionDigits: 6 })
}

/** Density: g/cm³ for solids and liquids, g/L for gases (a gas in g/cm³ reads as 0.0013). */
export function density(el, lang) {
  if (el.density == null) return '?'
  if (el.state === 'gas') return `${num(el.density * 1000, lang, 3)} g/L (0 °C)`
  return `${num(el.density, lang, 3)} g/cm³`
}

/** Electron configuration with superscripts: "[He]2s2 2p2" -> "[He] 2s² 2p²". */
export function config(text) {
  const sup = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }
  return text.replace(/\]/, '] ').replace(/(\d[spdf])(\d+)/g, (_, a, b) => a + [...b].map(d => sup[d]).join(''))
}

export const LANG_TAG = { 'pt-pt': 'pt-PT', en: 'en' }
