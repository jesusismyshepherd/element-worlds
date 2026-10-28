// Twisted bilayer graphene's bands near the Fermi level, computed ahead by scripts/data/tbg_bands.py
// (the Bistritzer-MacDonald continuum model) for angles from 0.5 to 12 degrees along K' - K - Gamma -
// M - K'; read here for any angle in between (linear between the two nearest computed ones).
import DATA from './tbgBands.json' with { type: 'json' }

let energies = null
const table = () => {
  if (!energies) {
    const bin = atob(DATA.energies)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    energies = new Int16Array(bytes.buffer)
  }
  return energies
}

/** The path (x of each point, 0..1, and the corner labels), the band count, the model. */
export const TBG = {
  x: DATA.x,
  ticks: DATA.ticks,
  bands: DATA.bands,
  angles: DATA.angles,
  min: DATA.angles[0],
  max: DATA.angles[DATA.angles.length - 1],
  model: DATA.model,
}

const POINTS = DATA.x.length

/** Where an angle falls among the computed ones: [index below, share toward the next]. */
function locate(deg) {
  const a = DATA.angles
  const d = Math.min(a[a.length - 1], Math.max(a[0], deg))
  let i = 0
  while (i < a.length - 2 && a[i + 1] < d) i++
  return [i, (d - a[i]) / (a[i + 1] - a[i])]
}

/** The bands at an angle, in meV: e[point * bands + band], lowest band first; null below 0.5 degrees
 *  (no moire to speak of; the bands crowd together). */
export function bandsAt(deg) {
  if (!(deg >= TBG.min)) return null
  const [i, u] = locate(deg)
  const e = table()
  const n = POINTS * DATA.bands
  const out = new Float32Array(n)
  for (let j = 0; j < n; j++) out[j] = (e[i * n + j] * (1 - u) + e[(i + 1) * n + j] * u) * DATA.scale
  return out
}

const lerpOf = list => deg => {
  const [i, u] = locate(deg)
  return list[i] * (1 - u) + list[i + 1] * u
}

/** How wide the two middle bands are at an angle, in meV. */
export const widthAt = lerpOf(DATA.width)

/** How fast electrons move at the Dirac point, as a share of plain graphene's speed. */
export const speedAt = lerpOf(DATA.speed)
