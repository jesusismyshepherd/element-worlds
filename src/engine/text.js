// Text in the 3D scenes: troika's signed-distance-field text, sharp at any distance. Two faces: the
// display face (Outfit, symbols and titles) and the reading face (Nunito, sentences). Fonts are served
// from public/fonts (Latin, with every Portuguese letter).
import { Group } from 'three'
import { Text } from 'troika-three-text'

export const FONTS = {
  display: '/fonts/outfit-700.woff',
  medium: '/fonts/outfit-500.woff',
  body: '/fonts/nunito-700.woff',
}

/** A text mesh, synced. `size` is the letter height in metres. */
export function makeText(text, {
  font = 'display', size = 0.3, color = '#ffffff', anchorX = 'center', anchorY = 'middle', maxWidth = Infinity,
  align = 'center', lineHeight = 1.15, outlineWidth = 0, outlineColor = '#000000', opacity = 1, depthTest = true,
} = {}) {
  const t = new Text()
  Object.assign(t, {
    text, font: FONTS[font] ?? font, fontSize: size, color, anchorX, anchorY, maxWidth, textAlign: align,
    lineHeight, outlineWidth, outlineColor, fillOpacity: opacity,
  })
  t.material.depthTest = depthTest
  t.sync()
  return t
}

/** Preload the faces so the first words do not pop in (troika fetches a font on first use). */
export function preloadFonts() {
  return Promise.all(Object.values(FONTS).map(font => new Promise(resolve => {
    const t = new Text()
    Object.assign(t, { text: 'Áa1', font })
    t.sync(() => {
      t.dispose()
      resolve()
    })
  })))
}

/** A chemical formula with real subscripts and charges ("CO2" -> CO₂, "O2+" -> O₂⁺) from text pieces:
 *  the fonts have no subscript digits. Returns a Group, centred once the pieces are laid out. */
export function formulaText(formula, { size = 0.3, color = '#ffffff', font = 'display' } = {}) {
  const group = new Group()
  const runs = [...formula.matchAll(/([A-Z][a-z]?|\(|\))|(\d+)|([+-])/g)].map(m => (m[1] ? { t: m[1], k: 'main' } : m[2] ? { t: m[2], k: 'sub' } : { t: m[3] === '-' ? '−' : '+', k: 'sup' }))
  const pieces = runs.map(r => {
    const t = new Text()
    Object.assign(t, {
      text: r.t, font: FONTS[font] ?? font, color, anchorX: 'left', anchorY: 'middle',
      fontSize: r.k === 'main' ? size : size * 0.62,
    })
    t.position.y = r.k === 'sub' ? -size * 0.28 : r.k === 'sup' ? size * 0.32 : 0
    group.add(t)
    return t
  })
  let left = pieces.length
  for (const t of pieces) {
    t.sync(() => {
      if (--left > 0) return
      let x = 0
      for (const p of pieces) {
        p.position.x = x
        const b = p.textRenderInfo?.blockBounds
        x += b ? b[2] - b[0] : size * 0.6
      }
      for (const p of pieces) p.position.x -= x / 2
    })
  }
  return group
}
