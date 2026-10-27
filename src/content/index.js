// The elements' own words: one file per element, src/content/<Symbol>.js (see C.js), loaded when its
// atrium opens. A new file is picked up by itself (Vite's glob). The format and its checks:
// content.test.js.
const MODULES = import.meta.glob('./[A-Z]*.js')
const cache = {}

export const hasContent = symbol => `./${symbol}.js` in MODULES

/** Load an element's words (null when it has none yet). */
export async function loadContent(symbol) {
  const key = `./${symbol}.js`
  if (!(key in MODULES)) return null
  cache[symbol] ??= (await MODULES[key]()).default
  return cache[symbol]
}

/** The words already loaded (after loadContent). */
export const contentCached = symbol => cache[symbol] ?? null
