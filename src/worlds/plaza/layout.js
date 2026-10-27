// Where the cubes stand on the plaza (metres), and the trends: the properties a cube's height can show.
import { cellOf } from '../../data/elements.js'

export const CUBE = 3
export const GAP = 0.85
export const PITCH = CUBE + GAP

/** The cube's centre on the ground: columns run along x (group 1 on the left), periods toward the
 *  viewer along z (period 1 farthest), the f-block rows nearest, closer to the main body than a full
 *  empty row. */
export function cubeSpot(el) {
  const { col, row } = cellOf(el)
  return spotOf(col, row)
}

export function spotOf(col, row) {
  const x = (col - 9.5) * PITCH
  const z = (row - 5) * PITCH - (row >= 9 ? 0.45 * PITCH : 0)
  return { x, z }
}

export const TABLE = (() => {
  const a = spotOf(1, 1)
  const b = spotOf(18, 10)
  return { minX: a.x - CUBE / 2, maxX: b.x + CUBE / 2, minZ: a.z - CUBE / 2, maxZ: b.z + CUBE / 2 }
})()

/** Properties for the trends (Scientist): value(el) or null when unknown; `log` for ranges spanning
 *  many powers of ten. Units are shown by the HUD (i18n trends.<id>.unit). */
export const TRENDS = [
  { id: 'radius', value: e => e.radius.covalent },
  { id: 'en', value: e => e.en },
  { id: 'ie', value: e => e.ie[0] ?? null },
  { id: 'melt', value: e => e.melt },
  { id: 'density', value: e => e.density, log: true },
  { id: 'mass', value: e => e.mass },
  { id: 'crust', value: e => e.abundance.crust, log: true },
  { id: 'year', value: e => (e.ancient ? null : e.discovered), ancient: true },
]

/** Each element's 0..1 place in a trend (null when unknown) and the range, for the bars and legend. */
export function trendScale(trend, elements) {
  const raw = elements.map(e => {
    const v = trend.value(e)
    return v == null || !(v > 0 || (!trend.log && v === 0)) ? null : v
  })
  const t = v => (trend.log ? Math.log10(v) : v)
  const known = raw.filter(v => v != null)
  const lo = Math.min(...known)
  const hi = Math.max(...known)
  const norm = raw.map((v, i) => {
    if (trend.ancient && elements[i].ancient) return 0
    return v == null ? null : (t(v) - t(lo)) / (t(hi) - t(lo) || 1)
  })
  return { norm, lo, hi }
}

// A perceptual scale from deep violet (low) through teal to warm yellow (high), close to viridis.
const STOPS = [
  [0.0, [0.27, 0.0, 0.33]],
  [0.25, [0.23, 0.32, 0.55]],
  [0.5, [0.13, 0.57, 0.55]],
  [0.75, [0.37, 0.79, 0.38]],
  [1.0, [0.99, 0.91, 0.14]],
]

export function scaleColor(t) {
  for (let i = 1; i < STOPS.length; i++) {
    const [b, cb] = STOPS[i]
    const [a, ca] = STOPS[i - 1]
    if (t <= b) {
      const k = (t - a) / (b - a)
      return ca.map((v, j) => v + (cb[j] - v) * k)
    }
  }
  return STOPS[STOPS.length - 1][1]
}

export const SCALE_CSS = `linear-gradient(90deg, ${STOPS.map(([p, c]) => `rgb(${c.map(v => Math.round(v * 255)).join(',')}) ${p * 100}%`).join(', ')})`
