// What the HUD covers of the screen, edge by edge, so the 3D can keep its middle in the part left
// free (docs/knowledge/hud-layout.md). A HUD piece that hugs an edge (the top bar, a side panel, a
// sheet at the bottom) reports how far in from that edge it reaches; the engine eases its camera's
// view offset so the world's centre is drawn at the centre of the free area, and worlds that frame
// something (the plaza's table, the lab's molecule, the forge's atom) fit it into that area.
const covers = new Map()
let next = 0

/** A new cover's id. */
export const coverId = () => `c${++next}`

/** Set (or with null clear) what a HUD piece covers: { side: 'top' | 'right' | 'bottom' | 'left', size } in CSS px. */
export function setCover(id, cover) {
  if (cover && cover.size > 0) covers.set(id, cover)
  else covers.delete(id)
}

/** How far in from each edge the HUD reaches (the largest cover per edge). */
export function insets() {
  const o = { top: 0, right: 0, bottom: 0, left: 0 }
  for (const c of covers.values()) o[c.side] = Math.max(o[c.side], c.size)
  return o
}

/** The free area for a screen of w x h with these insets, never less than a third of either side
 *  (a panel too big for the screen leaves the 3D at least that much). */
export function freeArea(w, h, ins) {
  let { top, right, bottom, left } = ins
  const fit = (a, b, size) => {
    const over = a + b - size * (2 / 3)
    if (over <= 0) return [a, b]
    const k = (size * (2 / 3)) / (a + b)
    return [a * k, b * k]
  }
  ;[left, right] = fit(left, right, w)
  ;[top, bottom] = fit(top, bottom, h)
  return { x: left, y: top, w: w - left - right, h: h - top - bottom }
}
