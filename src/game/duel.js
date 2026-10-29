// The quiz as a duel in a room (docs/knowledge/multiplayer.md; the user, 2026-10-29: games "more
// suitable for 2" with "the others ... spectators with possibility to easily swap seats"). Two seats; the
// two seated race on the same mystery element, clues coming one by one; the first right answer scores
// (more for fewer clues), a wrong one locks that player out of the question. Everyone else watches the
// same clues and scores, and can take a free seat, wait in line, or ask a seated player to swap; a
// seated player can give their seat to the next in line; after a game the winner stays and the next in
// line takes the other seat. The rules are pure functions of the state (this file); one player, the
// referee, runs them and sends the state to the room (src/net/duel.js).
import { points } from './quiz.js'

export const SEATS = 2
export const ROUNDS = 5
export const CLUE_MS = 7000 // a new clue every seven seconds
export const LAST_MS = 9000 // after the last clue, this long to answer
export const REVEAL_MS = 4500 // the answer on show before the next question
export const START_MS = 2500 // both seats taken: a moment, then the first question

/** A new duel, started by `ref` (who takes the first seat). */
export function newDuel(ref, level, now) {
  return {
    id: `${ref}-${now}`,
    ref,
    level,
    seats: [ref, null],
    line: [],
    scores: {},
    round: 0,
    q: null,
    total: 0,
    shown: 0,
    since: now,
    answers: {},
    winner: null,
    phase: 'waiting', // waiting | asking | reveal | over
    until: null,
    ask: null, // { from, seat }: a watcher asks a seated player to swap
    v: 1,
  }
}

const seated = (s, id) => s.seats.indexOf(id)
const bump = s => ({ ...s, v: s.v + 1 })
const without = (list, id) => list.filter(x => x !== id)
const full = s => s.seats.every(Boolean)

/** Someone does something; `id` is who. Returns the next state (the same one when nothing changes). */
export function act(s, id, a, now) {
  if (!s || !a) return s
  const at = seated(s, id)
  if (a.t === 'sit') {
    const k = a.seat
    if (at >= 0 || k < 0 || k >= SEATS || s.seats[k]) return s
    const seats = [...s.seats]
    seats[k] = id
    return start(bump({ ...s, seats, line: without(s.line, id), scores: { ...s.scores, [id]: s.scores[id] ?? 0 } }), now)
  }
  if (a.t === 'line') {
    if (at >= 0 || s.line.includes(id)) return s
    // a free seat is taken at once
    const free = s.seats.indexOf(null)
    if (free >= 0) return act(s, id, { t: 'sit', seat: free }, now)
    return bump({ ...s, line: [...s.line, id] })
  }
  if (a.t === 'unline') return s.line.includes(id) ? bump({ ...s, line: without(s.line, id), ask: s.ask?.from === id ? null : s.ask }) : s
  if (a.t === 'give') {
    if (at < 0) return s
    return bump(handOver(s, at, s.line[0] ?? null))
  }
  if (a.t === 'ask') {
    if (at >= 0 || !s.seats[a.seat]) return s
    return bump({ ...s, ask: { from: id, seat: a.seat } })
  }
  if (a.t === 'answer') {
    const ask = s.ask
    if (!ask || s.seats[ask.seat] !== id) return s
    if (!a.yes) return bump({ ...s, ask: null })
    return bump({ ...handOver({ ...s, line: without(s.line, ask.from) }, ask.seat, ask.from), ask: null })
  }
  if (a.t === 'pick') {
    if (s.phase !== 'asking' || at < 0 || s.answers[id] != null || s.winner) return s
    const answers = { ...s.answers, [id]: a.z }
    if (a.z === s.q.answer) {
      const scores = { ...s.scores, [id]: (s.scores[id] ?? 0) + points(s.shown, s.total) }
      return bump({ ...s, answers, scores, winner: id, phase: 'reveal', until: now + REVEAL_MS })
    }
    // both wrong: the answer is shown
    const out = s.seats.filter(Boolean).every(p => answers[p] != null && answers[p] !== s.q.answer)
    return bump({ ...s, answers, ...(out ? { phase: 'reveal', until: now + REVEAL_MS } : {}) })
  }
  return s
}

/** The seat k passes to `to` (or empties); the one who leaves it goes to the end of the line. */
function handOver(s, k, to) {
  const seats = [...s.seats]
  const was = seats[k]
  seats[k] = to
  const line = without(s.line, to)
  return { ...s, seats, line: was && was !== to ? [...line, was] : line, scores: to ? { ...s.scores, [to]: s.scores[to] ?? 0 } : s.scores }
}

/** Both seats taken while waiting: the game starts after a moment. */
function start(s, now) {
  if (s.phase === 'waiting' && full(s)) return { ...s, until: now + START_MS }
  return s
}

/** People who left the room: out of the seats and the line (a seat goes to the next in line). */
export function present(s, ids) {
  if (!s) return s
  let next = s
  next.seats.forEach((p, k) => {
    if (p && !ids.includes(p)) next = handOver({ ...next, line: next.line }, k, next.line.find(x => ids.includes(x)) ?? null)
  })
  const line = next.line.filter(x => ids.includes(x))
  if (next === s && line.length === s.line.length) return s
  return bump({ ...next, line, ask: next.ask && ids.includes(next.ask.from) ? next.ask : null })
}

/**
 * Time passes (the referee calls this every quarter second). `ask(avoid)` gives a new question
 * { q, total } (prepared ahead: the clues need the element's words), or null if not ready.
 */
export function tick(s, now, nextQuestion) {
  if (!s) return s
  if (s.phase === 'waiting') {
    if (!full(s) || s.until == null || now < s.until) return s
    const nq = nextQuestion([])
    if (!nq) return s
    return bump({ ...s, phase: 'asking', round: 1, q: nq.q, total: nq.total, shown: 1, since: now, answers: {}, winner: null, until: null, asked: [nq.q.answer], scores: Object.fromEntries(s.seats.map(p => [p, 0])) })
  }
  if (s.phase === 'asking') {
    if (!full(s)) return s // a seat empty mid-question: wait for someone
    if (s.shown < s.total && now - s.since >= CLUE_MS) return bump({ ...s, shown: s.shown + 1, since: now })
    if (s.shown >= s.total && now - s.since >= LAST_MS) return bump({ ...s, phase: 'reveal', until: now + REVEAL_MS })
    return s
  }
  if (s.phase === 'reveal') {
    if (now < s.until) return s
    if (s.round >= ROUNDS) {
      const [a, b] = s.seats
      const sa = s.scores[a] ?? 0
      const sb = s.scores[b] ?? 0
      return bump({ ...s, phase: 'over', winner: sa === sb ? null : sa > sb ? a : b, until: null })
    }
    const nq = nextQuestion(s.asked ?? [])
    if (!nq) return s
    return bump({ ...s, phase: 'asking', round: s.round + 1, q: nq.q, total: nq.total, shown: 1, since: now, answers: {}, winner: null, until: null, asked: [...(s.asked ?? []), nq.q.answer] })
  }
  return s
}

/** Play again: the winner stays, the other gives their seat to the first in line (if anyone waits). */
export function again(s, now) {
  if (!s || s.phase !== 'over') return s
  let next = s
  if (s.line.length) {
    const [a, b] = s.seats
    const loser = s.winner === a ? b : s.winner === b ? a : (s.scores[a] ?? 0) <= (s.scores[b] ?? 0) ? a : b
    next = handOver(s, s.seats.indexOf(loser), s.line[0])
  }
  return bump({ ...next, phase: 'waiting', round: 0, q: null, shown: 0, answers: {}, winner: null, asked: [], scores: Object.fromEntries(next.seats.filter(Boolean).map(p => [p, 0])), until: now + START_MS })
}
