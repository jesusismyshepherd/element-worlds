// Light mode for phones and weaker computers (from pokemon-site's arena, src/games/arena/render.js,
// where loading everything at once stopped a video call on a phone and crashed a weak laptop): no bloom,
// no glass (transmission), a lower pixel ratio, fewer particles. `?light=0|1` in the address decides
// instead (probes), then the player's choice in the settings, then the device.

const KEY = 'ew-quality'

export function graphicsChoice() {
  try {
    const q = localStorage.getItem(KEY)
    return q === 'high' || q === 'light' ? q : 'auto'
  } catch {
    return 'auto'
  }
}

export function setGraphicsChoice(q) {
  try {
    localStorage.setItem(KEY, q)
  } catch {
    // storage blocked: for this visit only
  }
}

export function lightMode(renderer = null) {
  const forced = new URLSearchParams(window.location.search).get('light')
  if (forced !== null) return forced === '1'
  const chosen = graphicsChoice()
  if (chosen !== 'auto') return chosen === 'light'
  if (window.matchMedia?.('(pointer: coarse)').matches) return true
  if ((navigator.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4) return true
  return weakGraphics(renderer)
}

/** Graphics drawn in software, or a chip built into the processor (Intel but not Arc, AMD's Radeon
 *  Graphics and Vega): a long frame there can make Windows reset the driver. */
export function weakGraphics(renderer) {
  const gl = renderer?.getContext()
  const info = gl?.getExtension('WEBGL_debug_renderer_info')
  const name = String((info && gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) || gl?.getParameter(gl.RENDERER) || '')
  if (/SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(name)) return true
  if (/Intel/i.test(name) && !/Arc/i.test(name)) return true
  return /Radeon\(TM\) Graphics|Radeon Graphics|Vega \d+ Graphics/i.test(name)
}
