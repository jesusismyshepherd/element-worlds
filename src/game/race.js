// A race in a room (docs/knowledge/multiplayer.md, "The forge's race"): someone picks a goal (one of the
// Atom Forge's missions), everyone who is there takes part unless they choose to watch, and after a
// countdown each builds their own; the board shows how far each one is, and the first to finish wins.
// Then everyone goes back to what they shared. The rules are pure functions of the state (this file),
// like the quiz duel's (src/game/duel.js); one player, the referee, runs them and sends the state to the
// room (src/net/referee.js, src/net/race.js). Unlike the duel there are no seats: everyone can race.

export const READY_MS = 7000 // the countdown before the start (time for one told elsewhere to come and join)
export const RACE_MS = 6 * 60 * 1000 // nobody done after six minutes: time is up
export const OVER_MS = 10000 // the winner on show, then back to building together
export const MOST = 8

/** A new race to `goal`, started by `ref`, with everyone in `ids` taking part. */
export function newRace(ref, goal, ids, now) {
  const order = [ref, ...ids.filter(x => x && x !== ref)].filter((x, i, a) => a.indexOf(x) === i).slice(0, MOST)
  return {
    id: `${ref}-${now}`,
    ref,
    goal,
    phase: 'ready', // ready | racing | over | done
    until: now + READY_MS,
    start: null,
    order, // who races, in the order they came in
    at: Object.fromEntries(order.map(id => [id, { p: 0 }])), // each racer's atom and progress, as they tell
    winner: null,
    time: null,
    v: 1,
  }
}

const bump = s => ({ ...s, v: s.v + 1 })
const racing = (s, id) => s.order.includes(id)

/** Someone does something (`id` is who); returns the next state, or the same one when nothing changes. */
export function act(s, id, a, now) {
  if (!s || !a || !id) return s
  if (a.t === 'join') {
    if (s.phase !== 'ready' || racing(s, id) || s.order.length >= MOST) return s
    return bump({ ...s, order: [...s.order, id], at: { ...s.at, [id]: { p: 0 } } })
  }
  if (a.t === 'leave') {
    if (!racing(s, id) || s.phase === 'over' || s.phase === 'done') return s
    return dropped(s, [id])
  }
  if (a.t === 'at') {
    if (s.phase !== 'racing' || !racing(s, id)) return s
    const p = Number(a.p)
    return bump({ ...s, at: { ...s.at, [id]: { a: atom(a.a), o: a.o ?? null, p: Number.isFinite(p) ? Math.max(0, Math.min(1, p)) : 0 } } })
  }
  if (a.t === 'done') {
    if (s.phase !== 'racing' || !racing(s, id) || s.winner) return s
    return bump({ ...s, phase: 'over', winner: id, time: now - s.start, until: now + OVER_MS, at: { ...s.at, [id]: { ...s.at[id], a: atom(a.a) ?? s.at[id]?.a, p: 1, done: true } } })
  }
  if (a.t === 'again') {
    // the same goal, the same racers (and whoever asked), a new countdown
    if (s.phase !== 'over') return s
    const order = racing(s, id) ? s.order : [...s.order, id].slice(0, MOST)
    return { ...s, id: `${id}-${now}`, phase: 'ready', until: now + READY_MS, start: null, order, at: Object.fromEntries(order.map(x => [x, { p: 0 }])), winner: null, time: null, v: s.v + 1 }
  }
  if (a.t === 'stop') {
    if (s.phase === 'done') return s
    return bump({ ...s, phase: 'done', until: null })
  }
  return s
}

const atom = x => (Array.isArray(x) && x.length === 3 && x.every(Number.isFinite) ? x.map(v => Math.round(v)) : null)

/** Racers gone (left the race, the place or the room): out of the race; nobody left racing, it ends. */
function dropped(s, ids) {
  const order = s.order.filter(x => !ids.includes(x))
  const at = Object.fromEntries(Object.entries(s.at).filter(([x]) => order.includes(x)))
  const next = { ...s, order, at }
  // (after the finish the board stays as it was: the winner may have gone already)
  if (!order.length && s.phase !== 'over') return bump({ ...next, phase: 'done', until: null })
  return bump(next)
}

/** Only the people still here (`ids`) race. */
export function present(s, ids) {
  if (!s) return s
  const gone = s.order.filter(x => !ids.includes(x))
  return gone.length ? dropped(s, gone) : s
}

/** Time passes (the referee calls this four times a second). */
export function tick(s, now) {
  if (!s) return s
  if (s.phase === 'ready' && now >= s.until) {
    if (!s.order.length) return bump({ ...s, phase: 'done', until: null })
    return bump({ ...s, phase: 'racing', start: now, until: now + RACE_MS })
  }
  if (s.phase === 'racing' && now >= s.until) return bump({ ...s, phase: 'over', winner: null, time: null, until: now + OVER_MS })
  if (s.phase === 'over' && now >= s.until) return bump({ ...s, phase: 'done', until: null })
  return s
}

/** The racers, nearest the goal first (the winner on top). */
export const standings = s => [...s.order].sort((a, b) => (b === s.winner) - (a === s.winner) || (s.at[b]?.p ?? 0) - (s.at[a]?.p ?? 0))
