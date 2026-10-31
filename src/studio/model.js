// The family studio (/studio, src/pages/Studio.jsx; docs/knowledge/update-dashboard.md) as plain
// functions: the page's sections from the backlog (docs/studio/backlog.json) and the threads of what the
// family sent (the rows of ew_studio_list: { id, kind, item, value, text, created_at, reply, replied_at,
// username, mine }), and the dates and token counts in the reader's language.
import { tagOf, decimalOf } from '../i18n/langs.js'

// the verdicts, in the buttons' order (the claude.ai studio's Sooner, Later and Not now)
export const VERDICTS = ['first', 'later', 'no']
// the errors ew_studio_post answers with (anything else, or a failed call, is 'failed')
const PROBLEMS = ['kind', 'verdict', 'empty', 'long', 'slow']

/** The page's sections: being built, up next (the queue's order), waiting on the family, ideas by kind
 *  (all but the built ones), built by day (newest first, with the tokens of all), decisions (newest first). */
export function sections(b) {
  const byId = new Map(b.items.map(i => [i.id, i]))
  const queued = (b.next ?? []).map(id => byId.get(id)).filter(Boolean)
  const building = queued.filter(i => i.status === 'building')
  // one being built but left out of the queue (the backlog test forbids it) still shows
  for (const i of b.items) if (i.status === 'building' && !building.includes(i)) building.push(i)
  const next = queued.filter(i => i.status === 'next')
  const ideas = (b.kinds ?? [])
    .map(kind => ({ kind, items: b.items.filter(i => i.kind === kind.id && i.status !== 'built') }))
    .filter(g => g.items.length)
  const days = {}
  for (const x of b.built ?? []) (days[x.date] ??= []).push(x)
  const built = Object.keys(days).sort().reverse().map(date => ({ date, entries: days[date] }))
  const tokens = (b.built ?? []).reduce((n, x) => n + (x.tokens?.total ?? 0), 0)
  return { building, next, waiting: b.waiting ?? [], ideas, built, tokens, decisions: [...(b.decisions ?? [])].reverse() }
}

/** Whose an idea is, as the filter chips group them: you (the user, written `me` in older entries),
 *  artur or claude. */
export const whose = item => (item.from === 'me' ? 'you' : item.from)

/** A verdict means something for an idea that is not being built nor built. */
export const canVote = item => !!item && ['next', 'idea', 'parked'].includes(item.status)

const at = r => Date.parse(r.created_at) || 0

/** The rows about one item ('' or null: the studio itself, ideas and messages), oldest first. */
export function threadOf(rows, id) {
  const key = id || null
  return (rows ?? []).filter(r => (r.item || null) === key).sort((a, b) => at(a) - at(b) || a.id - b.id)
}

/** Every row, newest first (the page's list of what was sent). */
export const newestFirst = rows => [...(rows ?? [])].sort((a, b) => at(b) - at(a) || b.id - a.id)

/** The signed-in account's own last verdict on an item ('first', 'later', 'no'), or null. */
export function myVerdict(rows, id) {
  const mine = threadOf(rows, id).filter(r => r.mine && r.kind === 'verdict' && VERDICTS.includes(r.value))
  return mine.length ? mine[mine.length - 1].value : null
}

/** How many rows Claude has not answered yet. */
export const unanswered = rows => (rows ?? []).filter(r => !r.replied_at).length

/** What went wrong with a post, as a key of studio.errors, or null when it went through. A signed-out
 *  call answers null. */
export function problemOf(result) {
  if (result == null) return 'signedOut'
  if (result.error) return PROBLEMS.includes(result.error) ? result.error : 'failed'
  return result.id != null ? null : 'failed'
}

/** A day of the backlog ('2026-10-31') as the language writes it short (31 Oct; 31/10 style left to Intl). */
export function dayOf(date, lang) {
  const d = new Date(String(date).length === 10 ? `${date}T12:00:00` : date)
  return Number.isNaN(d.getTime()) ? String(date ?? '') : d.toLocaleDateString(tagOf(lang), { day: 'numeric', month: 'short' })
}

/** A moment (a row's created_at or replied_at) with its time of day. */
export function momentOf(iso, lang) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString(tagOf(lang), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

/** Tokens in millions, as the claude.ai studio writes them (390 M, 35.0 M), with the language's decimal mark. */
export function millions(n, lang, digits = null) {
  const m = (n ?? 0) / 1e6
  const d = digits ?? (n >= 1e8 ? 0 : 1)
  return `${m.toFixed(d).replace('.', decimalOf(lang))} M`
}
