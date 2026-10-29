// The dashboard's plain readings (/stats): one line under each section saying what its numbers suggest,
// and the list at the top of the page, "What it suggests": guesses at what is liked, revisited and where
// the time goes, and at why something is not (not found, left quickly, little to do there, confusing,
// broken). Words only; the numbers come from analyze.js.
import { dur, plural, times, list, pct, dec, clock, day, shortDay } from './format.js'
import { placeName, panelName, elementName, featureName, missionName, drawerTitle, levelName, viewName, langName, wingTitle, WING_PLACES } from './names.js'
import { QUICK_MS, SKIM_MS, isRead, isSkim } from './analyze.js'

const avg = xs => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/** "a, b, c and 4 more" (at most n named). */
export function listSome(items, n = 3) {
  if (items.length <= n + 1) return list(items)
  return `${items.slice(0, n).join(', ')} and ${items.length - n} more`
}

/** Visits and active time per day (per hour today, per week over 180 days). */
export function readDays(a) {
  const { totals, days } = a
  if (!totals.visits) return 'No visits in this period.'
  const unit = days[0]?.unit ?? 'day'
  const used = days.filter(b => b.visits || b.active).length
  const best = [...days].sort((x, y) => y.active - x.active)[0]
  const span = unit === 'hour' ? 'today' : `on ${used} of the ${days.length} ${unit}s`
  let s = `${plural(totals.visits, 'visit')} ${span}, ${dur(totals.active)} active in all${totals.visits > 1 ? ` (${dur(totals.perVisit)} a visit)` : ''}.`
  if (best && best.active > 0) {
    const label = unit === 'hour' ? `at ${clock(best.start)}` : unit === 'week' ? `the week of ${shortDay(best.start)}` : day(best.start)
    s += ` The most: ${label}, ${dur(best.active)}.`
  }
  return s
}

/** Where the active time went, and the places come back to. */
export function readPlaces(a) {
  const ps = a.places
  if (!ps.length) return 'No world was entered.'
  const total = ps.reduce((s, p) => s + p.active, 0)
  const lead = ps.filter(p => p.active > 0).slice(0, 3).map(p => `${placeName(p.w)} ${pct(p.active, total)}`)
  let s = lead.length ? `Most of the active time: ${list(lead)}.` : 'No active time was recorded.'
  const back = ps.filter(p => p.w !== 'plaza' && p.visits >= 2).sort((x, y) => y.visits - x.visits || y.active - x.active)
  if (back.length) s += ` Came back to ${listSome(back.map(p => `${placeName(p.w)} (${p.visits} visits)`), 3)}.`
  else if (a.totals.visits >= 2) s += ' No place but the plaza was entered in more than one visit.'
  if (a.totals.est) s += ` ${plural(a.totals.est, 'stay')} ended with the page closed or put away: ${a.totals.est === 1 ? 'its time is' : 'their times are'} estimated.`
  return s
}

/** What was done in the halls. */
export function readHalls(a) {
  const hs = a.halls.filter(h => h.entries > 0)
  if (!hs.length) return 'No hall was entered.'
  const best = hs[0]
  const wingVisits = best.wings.reduce((x, w) => x + w.n, 0)
  const did = [best.read && `${plural(best.read, 'panel')} read`, best.talks && `${plural(best.talks, 'talk')} with its Atomling`, wingVisits && `its wings entered ${times(wingVisits)}`].filter(Boolean)
  let s = `${plural(hs.length, 'hall')} entered; the longest time in ${placeName(`atrium:${best.symbol}`)}, ${dur(best.active)}${did.length ? ` (${list(did)})` : ''}.`
  const idle = hs.filter(h => h.idle)
  if (idle.length) {
    const which = idle.length === hs.length ? (hs.length === 1 ? 'it' : 'all of them') : idle.length <= 3 ? list(idle.map(h => `${elementName(h.symbol)}'s hall`)) : `${idle.length} of them`
    s += ` In ${which} nothing was opened, asked or followed (no panel, talk, floor tile or wing).`
  }
  return s
}

/** Panels read or skimmed. */
export function readPanels(a) {
  const rs = a.readings
  if (!rs.length) return 'No panel was opened.'
  const read = rs.filter(isRead)
  const skim = rs.filter(isSkim)
  let s = `${plural(rs.length, 'panel')} opened: ${read.length} read (open ${SKIM_MS / 1000} s or longer${read.length ? `, ${dur(avg(read.map(r => r.ms)))} on average` : ''}), ${skim.length} skimmed.`
  const skimmed = a.panels.filter(g => g.opened >= 2 && g.skimmed / g.opened >= 0.5).sort((x, y) => y.skimmed - x.skimmed)
  if (skimmed.length) s += ` Mostly skimmed: ${listSome(skimmed.map(g => `${panelName(g.id, g.places[0])} (${g.skimmed} of ${g.opened})`), 2)}.`
  const longest = a.panels.filter(g => g.read).sort((x, y) => y.avgRead - x.avgRead)[0]
  if (longest) s += ` Read longest: ${panelName(longest.id, longest.places[0])}, ${dur(longest.avgRead)} on average.`
  return s
}

/** Worlds left within QUICK_MS of active time. */
export function readQuick(a) {
  const q = a.quick
  if (!q.of) return 'No world but the plaza was entered.'
  if (!q.n) return `No world was left within ${QUICK_MS / 1000} s of active time (${plural(q.of, 'entry', 'entries')}).`
  return `Left within ${QUICK_MS / 1000} s ${times(q.n)} (of ${plural(q.of, 'entry', 'entries')}): ${listSome(q.places.map(p => `${placeName(p.w)} (${p.n})`), 4)}.`
}

/** The never-entered main places as rows ({ key, name, note }): a wing shared by several elements (the
 *  noble gases' sign workshop) said once when none of its rooms was entered; the note says whether the
 *  hall it is reached from was entered (its arch was there to see). */
export function neverGroups(never) {
  const missing = new Set(never.map(n => n.w))
  const shared = new Map()
  for (const w of WING_PLACES) {
    const id = w.split(':')[2]
    if (!shared.has(id)) shared.set(id, [])
    shared.get(id).push(w)
  }
  const out = []
  const done = new Set()
  for (const n of never) {
    if (done.has(n.w)) continue
    const [kind, symbol, id] = n.w.split(':')
    const all = kind === 'wing' ? shared.get(id) ?? [] : []
    if (all.length > 1 && all.every(w => missing.has(w))) {
      all.forEach(w => done.add(w))
      const seen = never.filter(x => all.includes(x.w) && x.hallEntered).map(x => elementName(x.w.split(':')[1]))
      out.push({ key: `wing:*:${id}`, name: `${wingTitle(symbol, id).replace(/^The /, 'the ')} (all ${all.length} rooms)`, note: seen.length ? `the halls of ${list(seen)} were entered` : 'none of their halls was entered' })
    } else {
      done.add(n.w)
      out.push({ key: n.w, name: placeName(n.w), note: n.hall ? (n.hallEntered ? 'its hall was entered' : 'its hall was not entered either') : '' })
    }
  }
  return out
}

export const neverNames = never => neverGroups(never).map(g => g.name)

/** Never entered, never used. */
export function readNever(a) {
  const parts = [a.never.length ? `Never entered: ${list(neverNames(a.never))}.` : 'Every main place (the lab, the forge, every wing) was entered.']
  const unused = a.features.filter(f => f.n === 0)
  if (unused.length) parts.push(`Never used: ${list(unused.map(f => featureName(f.id)))}.`)
  return parts.join(' ')
}

/** The plaza: picks, the card's facts, the search. */
export function readPlaza(a) {
  const p = a.plaza
  const parts = []
  if (p.picks.length === 1) {
    const x = p.picks[0]
    parts.push(`Picked ${elementName(x.symbol)} on the table ${times(x.n)}, and ${x.entered ? 'entered its hall' : 'never entered its hall'}.`)
  } else if (p.picks.length) {
    const most = listSome(p.picks.map(x => `${elementName(x.symbol)} (${x.n})`), 3)
    parts.push(`Picked ${p.picks.length} different elements on the table (${plural(p.picked, 'pick')}; most often ${most}), and entered the halls of ${p.pickedEntered} of them.`)
  } else parts.push('No element was picked on the table.')
  if (p.factClicks) {
    const all = p.facts.filter(f => f.n > 1 && f.seen >= f.n)
    parts.push(`The card's facts were clicked ${times(p.factClicks)} on ${plural(p.facts.length, 'element')}${all.length ? `; every fact read for ${list(all.map(f => elementName(f.symbol)))}` : ''}.`)
  } else parts.push("The card's facts were never clicked.")
  if (p.finds.length) parts.push(`Found with the search: ${listSome(p.finds.map(x => elementName(x.symbol)), 4)}.`)
  return parts.join(' ')
}

/** The quiz. */
export function readQuiz(a) {
  const q = a.quiz
  if (!q.opened && !q.answers) return 'The quiz was never opened.'
  if (!q.answers) return `The quiz was opened ${times(q.opened)} but no question was answered.`
  let s = `${q.opened ? `Opened ${times(q.opened)}; ` : ''}${plural(q.answers, 'answer')}, ${q.right} right (${pct(q.right, q.answers)})${q.of ? `, with ${dec(q.clues)} of ${dec(q.of)} clues shown on average` : ''}.`
  if (q.firstClue) s += ` ${q.firstClue} right at the first clue.`
  if (q.rounds) s += ` ${plural(q.rounds, 'round')} of 10 finished.`
  if (q.missed.length) s += ` Missed: ${listSome(q.missed.map(m => `${elementName(m.symbol)}${m.n > 1 ? ` (${m.n})` : ''}`), 4)}.`
  return s
}

/** The Atom Forge. */
export function readForge(a) {
  const f = a.forge
  if (!f.entries && !f.actions) return 'The Atom Forge was not entered.'
  if (!f.actions) return `Entered ${times(f.entries)} (${dur(f.active)} active), but nothing was built.`
  let s = `${plural(f.actions, 'action')}: ${f.add} added, ${f.remove} removed${f.fire ? `, ${plural(f.fire, 'beam')} fired` : ''}${f.maxZ ? `; up to element ${f.maxZ} (${elementName(f.maxZ)})` : ''}.`
  s += f.missions.length ? ` Missions done: ${listSome(f.missions.map(missionName), 4)}.` : ' No mission done.'
  return s
}

/** The plaza's drawers, level, view and language. */
export function readTools(a) {
  const t = a.tools
  const parts = []
  if (t.drawers.length) parts.push(`Drawers opened: ${list(t.drawers.map(d => `${drawerTitle(d.id)} (${d.n})`))}.`)
  else parts.push("The plaza's drawers were never opened.")
  const sw = [
    ...t.level.map(x => `to ${levelName(x.v)} ${times(x.n)}`),
    ...t.view.map(x => `to ${viewName(x.v)} ${times(x.n)}`),
  ]
  if (sw.length) parts.push(`Switched ${list(sw)}.`)
  if (t.lang.length) parts.push(`Language changed to ${list(t.lang.map(x => `${langName(x.v)}${x.n > 1 ? ` (${x.n})` : ''}`))}.`)
  return parts.join(' ')
}

const short = (s, n = 70) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

/** Errors. */
export function readErrors(a) {
  const es = a.errors
  if (!es.length) return 'No errors.'
  const n = es.reduce((x, g) => x + g.n, 0)
  const g = [...es].sort((x, y) => y.n - x.n)[0]
  return `${plural(n, 'error')} (${plural(es.length, 'kind')}); the most frequent: “${short(g.m)}”, ${times(g.n)}, in ${list(g.places.map(placeName))}.`
}

/** Kinds the dashboard does not know yet. */
export function readOthers(a) {
  if (!a.others.length) return 'None.'
  return `Kinds this page does not analyse yet: ${list(a.others.map(o => `${o.kind} (${o.n})`))}.`
}

const perStay = hs => {
  const n = hs.reduce((x, h) => x + h.entries, 0)
  return n ? hs.reduce((x, h) => x + h.active, 0) / n : 0
}

/** "What it suggests": guesses from the numbers, each with a tone (the page labels it). */
export function signalsOf(a) {
  const out = []
  const add = (tone, text) => out.push({ tone, text })
  if (!a.visits.length) return out
  const ps = a.places.filter(p => p.w !== 'plaza')

  const lead = a.places.filter(p => p.active > 0).slice(0, 3)
  if (lead.length) add('time', `Most of the active time went to ${list(lead.map(p => `${placeName(p.w)} (${dur(p.active)}, ${pct(p.active, a.totals.active)})`))}.`)

  const liked = []
  for (const p of ps) if (p.entries >= 2 && p.active / p.entries >= 120000) liked.push(`long stays in ${placeName(p.w)} (${dur(p.active / p.entries)} each)`)
  for (const g of a.panels) if (g.read >= 2 && g.avgRead >= 20000) liked.push(`${panelName(g.id, g.places[0])} read ${times(g.read)} (${dur(g.avgRead)} each)`)
  const allFacts = a.plaza.facts.filter(f => f.n > 1 && f.seen >= f.n)
  if (allFacts.length) liked.push(`every card fact of ${list(allFacts.map(f => elementName(f.symbol)))}`)
  if (a.quiz.rounds) liked.push(`${plural(a.quiz.rounds, 'quiz round')} played to the end`)
  if (a.forge.missions.length >= 2) liked.push(`${plural(a.forge.missions.length, 'forge mission')} done`)
  if (liked.length) add('liked', `Liked, it seems: ${listSome(liked, 4)}.`)

  const back = ps.filter(p => p.visits >= 2).sort((x, y) => y.visits - x.visits || y.active - x.active)
  if (back.length) add('back', `Came back to ${listSome(back.map(p => `${placeName(p.w)} (in ${p.visits} visits)`), 4)}.`)

  const seen = a.never.filter(n => n.hallEntered)
  if (seen.length === 1) add('obscure', `${placeName(seen[0].w).replace(/^\w/, c => c.toUpperCase())}: its hall was entered but this wing never. Its arch may go unnoticed, or did not tempt.`)
  else if (seen.length) add('obscure', `${list(seen.map(n => placeName(n.w)))}: their halls were entered but these wings never. Their arches may go unnoticed, or did not tempt.`)
  const unreached = a.never.filter(n => n.hallEntered === false)
  if (unreached.length) add('obscure', `Never reached: ${list(neverNames(unreached))}, whose halls were not entered either.`)
  for (const n of a.never.filter(x => x.hall == null)) add('obscure', `${placeName(n.w).replace(/^the/, 'The')} was never entered: the way to it (the plaza's dock${n.w === 'forge' ? ", a hall's “Inside the atom” panel" : ''}) may go unnoticed.`)
  const scientist = a.features.find(f => f.id === 'scientist')?.n > 0
  const unused = a.features.filter(f => f.n === 0 && !(f.id === 'trends' && !scientist))
  if (unused.length) add('obscure', `Never used: ${list(unused.map(f => featureName(f.id)))}.`)

  const fast = ps.filter(p => p.quick >= 2 && p.quick / p.entries >= 0.5)
  if (fast.length) add('quick', `Left within ${QUICK_MS / 1000} s in most entries: ${list(fast.map(p => `${placeName(p.w)} (${p.quick} of ${p.entries})`))}. Not what was expected there, or not liked.`)

  const halls = a.halls.filter(h => h.entries > 0)
  const idle = halls.filter(h => h.idle)
  if (idle.length >= 2) {
    let s = `Nothing was opened or asked in ${idle.length} of the ${halls.length} halls entered (${dur(perStay(idle))} a stay): little to do there, or nothing caught the eye.`
    const rich = halls.filter(h => h.boards)
    const plain = halls.filter(h => !h.boards)
    if (rich.length && plain.length) s += ` Halls with picture boards: ${dur(perStay(rich))} a stay; the others: ${dur(perStay(plain))}.`
    add('thin', s)
  }

  const conf = []
  for (const g of a.panels) if (g.opened >= 3 && g.skimmed / g.opened >= 0.6) conf.push(`${panelName(g.id, g.places[0])} closed within ${SKIM_MS / 1000} s ${g.skimmed} of ${g.opened} times`)
  if (a.confusion.reopened >= 3) conf.push(`a panel opened again within 30 s of closing ${times(a.confusion.reopened)} (walking away closes a panel)`)
  if (a.quiz.opened && !a.quiz.answers) conf.push(`the quiz opened ${times(a.quiz.opened)} and never answered`)
  if (a.quiz.wrongAfterAll >= 3) conf.push(`${a.quiz.wrongAfterAll} quiz answers wrong even with every clue shown`)
  if (a.forge.entries && !a.forge.actions && a.forge.active >= QUICK_MS) conf.push(`the Atom Forge entered for ${dur(a.forge.active)} with nothing built`)
  if (a.confusion.flipped >= 2) conf.push(`the level switched and switched back within a minute ${times(a.confusion.flipped)}`)
  if (conf.length) add('confusing', `Possibly confusing: ${list(conf)}.`)

  if (a.errors.length) {
    const n = a.errors.reduce((x, g) => x + g.n, 0)
    const where = [...new Set(a.errors.flatMap(g => g.places))]
    add('broken', `${plural(n, 'error')} in ${list(where.map(placeName))}: see Errors.`)
  }
  return out
}

/** How the page labels each tone (never colour alone: a word and a mark). */
export const TONES = {
  time: { label: 'Time spent', mark: '◷' },
  liked: { label: 'Liked', mark: '♥' },
  back: { label: 'Revisited', mark: '↻' },
  obscure: { label: 'Not found?', mark: '?' },
  quick: { label: 'Disliked?', mark: '↩' },
  thin: { label: 'Underdeveloped?', mark: '○' },
  confusing: { label: 'Confusing?', mark: '!' },
  broken: { label: 'Broken', mark: '⚠' },
}
