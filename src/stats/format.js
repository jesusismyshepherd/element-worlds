// Numbers, times and lists in plain English for the family dashboard (/stats). The dashboard is an admin
// page in English only (docs/knowledge/usage-data.md), so these do not go through i18n.

/** A duration in words: 45 s, 3 min 20 s, 12 min, 1 h 5 min. */
export function dur(ms) {
  const s = Math.round(Math.max(0, Number(ms) || 0) / 1000)
  if (s < 60) return `${s} s`
  const m = Math.floor(s / 60)
  if (m < 10) return s % 60 ? `${m} min ${s % 60} s` : `${m} min`
  const mins = Math.round(s / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  return mins % 60 ? `${h} h ${mins % 60} min` : `${h} h`
}

/** A short duration for axis ticks and tight labels: 40 s, 12 min, 1.5 h. */
export function durShort(ms) {
  const s = Math.max(0, Number(ms) || 0) / 1000
  if (s < 90) return `${Math.round(s)} s`
  const m = s / 60
  if (m < 90) return `${Math.round(m)} min`
  const h = m / 60
  return `${h < 10 ? Math.round(h * 10) / 10 : Math.round(h)} h`
}

/** "3 visits", "1 visit" (many defaults to the word with an s). */
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

/** once, twice, 3 times */
export const times = n => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`)

/** "a", "a and b", "a, b and c" */
export function list(items) {
  const xs = items.filter(x => x != null && x !== '')
  if (xs.length <= 1) return xs.join('')
  return `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`
}

/** A share as a whole percentage, "0%" when there is nothing to share. */
export const pct = (a, b) => `${b ? Math.round((100 * a) / b) : 0}%`

export const cap = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/** A number with a decimal only when it helps: 2, 2.5, 12. */
export const dec = n => String(Math.round((Number(n) || 0) * 10) / 10)

const fmt = opts => new Intl.DateTimeFormat('en-GB', opts)
const CLOCK = fmt({ hour: '2-digit', minute: '2-digit', hour12: false })
const DAY = fmt({ weekday: 'short', day: 'numeric', month: 'short' })
const SHORT_DAY = fmt({ day: 'numeric', month: 'short' })

/** 10:42 (the viewer's own time zone) */
export const clock = ms => CLOCK.format(new Date(ms))
/** Wed 29 Oct */
export const day = ms => DAY.format(new Date(ms))
/** 29 Oct */
export const shortDay = ms => SHORT_DAY.format(new Date(ms))
/** Wed 29 Oct, 10:42 */
export const when = ms => `${day(ms)}, ${clock(ms)}`

/** The start of the day `ms` falls in, in the viewer's time zone. */
export function startOfDay(ms) {
  const d = new Date(ms)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** Wed 29 Oct, 10:42, or only 10:42 when it is the same day as `ref`. */
export const whenFrom = (ms, ref) => (startOfDay(ms) === startOfDay(ref) ? clock(ms) : when(ms))

/** A round number at or above x for an axis: 1, 2, 2.5, 5 times a power of ten. */
export function niceCeil(x) {
  if (!(x > 0)) return 1
  const p = 10 ** Math.floor(Math.log10(x))
  for (const k of [1, 2, 2.5, 5, 10]) if (k * p >= x - 1e-9) return k * p
  return 10 * p
}

/** An axis maximum for a duration: whole seconds, minutes or hours that read well. */
export function niceDuration(ms) {
  const steps = [10, 20, 30, 60, 120, 300, 600, 900, 1200, 1800, 2700, 3600, 5400, 7200, 10800, 14400, 21600, 28800, 43200, 86400]
  const s = Math.max(0, Number(ms) || 0) / 1000
  for (const t of steps) if (t >= s) return t * 1000
  return niceCeil(s / 3600) * 3600 * 1000
}
