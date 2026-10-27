// Drawing spectra on a canvas: a dark band with a gas's bright lines in their own colours, a scale in
// nanometres under it, and a faint rainbow strip for where the colours are. Used by the spectroscope's
// big screen and the radon box's small one.
import { LINES, wavelengthRGB, lineBrightness, eyeWeight } from './nobleData.js'

export const NM_MIN = 380
export const NM_MAX = 750
/** Where a wavelength falls across a band from x to x + w. */
export const nmX = (nm, x, w) => x + ((nm - NM_MIN) / (NM_MAX - NM_MIN)) * w

const css = ([r, g, b], k = 1) => `rgb(${Math.round(Math.min(1, r * k) * 255)}, ${Math.round(Math.min(1, g * k) * 255)}, ${Math.round(Math.min(1, b * k) * 255)})`

/** A band of emission lines: [[nm, brightness 0..1]] drawn as glowing bars. */
export function drawLines(g, lines, { x, y, w, h, width = 4 }) {
  g.save()
  g.fillStyle = '#04050c'
  g.fillRect(x, y, w, h)
  g.globalCompositeOperation = 'lighter'
  for (const [nm, b] of lines) {
    const rgb = wavelengthRGB(nm)
    const px = nmX(nm, x, w)
    g.shadowColor = css(rgb, 1)
    g.shadowBlur = width * 3
    g.fillStyle = css(rgb, 0.35 + 0.75 * b)
    g.globalAlpha = 0.35 + 0.65 * b
    g.fillRect(px - width / 2, y + 2, width, h - 4)
  }
  g.restore()
}

/** A gas's lines from LINES, with their brightness. */
export const gasLines = sym => LINES[sym].map(([nm, I]) => [nm, lineBrightness(sym, I) * eyeWeight(nm)])

/** The scale under a band: ticks every 10 nm, numbers every 50, and a thin rainbow strip. */
export function drawScale(g, { x, y, w, font = 'Outfit', size = 22, color = '#c9d4ff', unit = 'nm', rainbow = 10 }) {
  g.save()
  if (rainbow) {
    for (let px = 0; px < w; px++) {
      const nm = NM_MIN + (px / w) * (NM_MAX - NM_MIN)
      g.fillStyle = css(wavelengthRGB(nm), 0.8)
      g.fillRect(x + px, y, 1.2, rainbow)
    }
  }
  const ty = y + rainbow + 2
  g.strokeStyle = color
  g.fillStyle = color
  g.lineWidth = 2
  g.font = `700 ${size}px ${font}, sans-serif`
  g.textAlign = 'center'
  g.textBaseline = 'top'
  for (let nm = 380; nm <= 750; nm += 10) {
    const px = nmX(nm, x, w)
    const big = nm % 50 === 0
    g.beginPath()
    g.moveTo(px, ty)
    g.lineTo(px, ty + (big ? 14 : 7))
    g.stroke()
    if (big) g.fillText(String(nm), px, ty + 17)
  }
  g.textAlign = 'right'
  g.fillText(unit, x + w, ty + 17 + size + 2)
  g.restore()
}
