// Text in the 3D scenes: troika's signed-distance-field text, sharp at any distance. Two faces: the
// display face (Outfit, symbols and titles) and the reading face (Nunito, sentences). Fonts are served
// from public/fonts (Latin, with every Portuguese letter).
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
