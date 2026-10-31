// The diamond press, made for two (the user, 2026-10-31: stations two people can play, more fun together,
// some needing another person, like the science centres' exhibits; this is the working example). Real
// diamonds are grown at high pressure and high temperature at once (HPHT), so the press has two jobs: one
// keeps the pressure up at the pump (the seals leak, and too much opens the safety valve), the other keeps
// the capsule's temperature in the window at the heater (it follows slowly, and drifts as the cell
// settles and the pressure changes). The diamond grows only while both are right; with the pressure too
// low it turns back into graphite. Alone, one player works both; when two or more are at the press, each
// player keeps the job they took, so it needs two. docs/knowledge/press.md.
//
// Pure functions of the state, run by the room's referee (src/net/press.js, src/net/referee.js) or, alone,
// by the gallery itself (src/worlds/wings/carbon/pressRun.js).

export const RUN_MS = 45000 // a run (a real press takes days for a carat: 45 s stand for them)
export const CLOSE_MS = 2000 // the graphite goes in and the press closes at the start
export const LEAK = 0.05 // the seals' leak: GPa lost a second for each GPa held
export const STROKE = 0.45 // GPa a stroke of the pump adds from nothing (less as the pressure rises)
export const STROKE_TOP = 12 // GPa where a stroke would add nothing
export const VALVE = 7.6 // GPa: above it the safety valve opens...
export const AFTER_VALVE = 5.0 // ...and lets the pressure down to this
export const TAU = 2.5 // s: how slowly the capsule follows the heater
export const T_ROOM = 20
export const T_SPAN = 1700 // °C the heater adds at full power, at 5 GPa
export const T_MELT = 1300 // °C: the iron-nickel solvent melts; below it nothing grows
export const T_FLAWED = 1600 // °C: above it the crystal grows full of flaws, so this press stops it growing
export const GROW = 0.035 // carats a second at best
export const SHRINK = 0.02 // carats a second turning back into graphite
export const MOST = 6 // people taking part

/** The graphite-diamond line (Kennedy & Kennedy 1976: P = 19.4 kbar + 0.025 kbar/°C): the pressure in
 *  GPa above which diamond is the stable form of carbon at T °C. */
export const lineP = T => 1.94 + 0.0025 * T

/** Where (P GPa, T °C) is: 'cold' (the solvent is solid), 'graphite' (below the line: diamond turns back),
 *  'hot' (too hot to grow well) or 'grow'. */
export function zone(P, T) {
  if (T < T_MELT) return 'cold'
  if (P < lineP(T)) return 'graphite'
  if (T > T_FLAWED) return 'hot'
  return 'grow'
}

/** Carats a second at (P, T): fastest well above the line, a quarter of that right on it; negative while
 *  the diamond turns back into graphite. */
export function growth(P, T) {
  const z = zone(P, T)
  if (z === 'grow') return GROW * Math.min(1, 0.25 + (P - lineP(T)) / 0.5)
  if (z === 'graphite') return -SHRINK
  return 0
}

/** The temperature the heater's power p (0 to 1) drives the capsule to, t s into the run at P GPa: the
 *  same power heats more as the cell is squeezed (better contact, from 4 GPa up), and the cell drifts as it
 *  settles. */
export function heatTarget(p, P, t) {
  const gain = 1 + 0.06 * (Math.max(4, P) - 5)
  const drift = 90 * Math.sin((2 * Math.PI * t) / 11) + 55 * Math.sin((2 * Math.PI * t) / 17.3 + 1)
  return T_ROOM + p * T_SPAN * gain + (p > 0.3 ? drift : 0)
}

/** A new run started by `ref` with everyone in `ids` at the press. */
export function newRun(ref, ids, now) {
  const players = [ref, ...ids.filter(x => x && x !== ref)].filter((x, i, a) => a.indexOf(x) === i).slice(0, MOST)
  return {
    id: `${ref}-${now}`,
    ref,
    phase: 'run', // run | done
    start: now,
    at: now,
    P: 0,
    T: T_ROOM,
    power: 0, // the heater, 0 to 1
    ct: 0,
    best: 0, // the biggest the diamond was this run
    valve: 0, // times the safety valve opened (each plays once)
    pumps: 0,
    players, // who is at the press (in the order they came)
    doers: [], // who has pumped or turned the heater (the diamond is theirs)
    roles: { pump: null, heat: null }, // with two or more, who has each job
    ct0: null, // the diamond at the end
    v: 1,
  }
}

const bump = s => ({ ...s, v: s.v + 1 })
const did = (s, id) => (s.doers.includes(id) ? s.doers : [...s.doers, id])
export const together = s => !!s && s.players.length >= 2

/** May `id` work `job` ('pump' or 'heat')? Alone, both; together, the job they have, or a free one when
 *  they have none. */
export function may(s, id, job) {
  if (!s || s.phase !== 'run') return false
  if (!together(s)) return true
  const holder = s.roles[job]
  if (holder && holder !== id && s.players.includes(holder)) return false
  const other = job === 'pump' ? 'heat' : 'pump'
  return s.roles[other] !== id
}

/** Who has `job`, if someone else does (for "Ana works the heater"). */
export function holder(s, id, job) {
  const h = s?.roles?.[job]
  return h && h !== id && together(s) && s.players.includes(h) ? h : null
}

/** Someone does something: { t: 'pump' } or { t: 'heat', p } (0 to 1). Returns the next state, or the same
 *  one when nothing changes (not allowed, or the run is over). */
export function act(s, id, a, now) {
  if (!s || !a || !id || s.phase !== 'run') return s
  if (!s.players.includes(id) && s.players.length < MOST) s = { ...s, players: [...s.players, id] }
  if (a.t === 'pump') {
    if (!may(s, id, 'pump')) return s
    let P = s.P + STROKE * Math.max(0, 1 - s.P / STROKE_TOP)
    let valve = s.valve
    if (P > VALVE) {
      P = AFTER_VALVE
      valve += 1
    }
    const roles = together(s) ? { ...s.roles, pump: id } : s.roles
    return bump({ ...s, P, valve, pumps: s.pumps + 1, roles, doers: did(s, id) })
  }
  if (a.t === 'heat') {
    const p = Number(a.p)
    if (!Number.isFinite(p) || !may(s, id, 'heat')) return s
    const roles = together(s) ? { ...s.roles, heat: id } : s.roles
    return bump({ ...s, power: Math.max(0, Math.min(1, p)), roles, doers: did(s, id) })
  }
  return s
}

/** The press runs on to `now`: the leak, the capsule following the heater, the diamond growing or
 *  shrinking; at the end of the run, the diamond is what there is. */
export function tick(s, now) {
  if (!s || s.phase !== 'run') return s
  const end = s.start + RUN_MS
  const to = Math.min(now, end)
  let { P, T, ct, best } = s
  // in steps of at most 0.1 s (the referee ticks four times a second, alone it is every frame)
  for (let t = s.at; t < to;) {
    const dt = Math.min(100, to - t) / 1000
    t += dt * 1000
    const run = (t - s.start) / 1000
    P *= Math.exp(-LEAK * dt)
    T += (heatTarget(s.power, P, run) - T) * (1 - Math.exp(-dt / TAU))
    ct = Math.max(0, ct + growth(P, T) * dt)
    best = Math.max(best, ct)
  }
  const next = { ...s, at: to, P, T, ct, best }
  if (now >= end) return bump({ ...next, phase: 'done', ct0: Math.round(ct * 100) / 100 })
  return bump(next)
}

/** People came or went (`ids`: who is at the press now): the ones gone lose their jobs. */
export function present(s, ids) {
  if (!s) return s
  const players = s.players.filter(x => ids.includes(x))
  for (const x of ids) if (!players.includes(x) && players.length < MOST) players.push(x)
  if (players.length === s.players.length && players.every((x, i) => x === s.players[i])) return s
  const roles = Object.fromEntries(Object.entries(s.roles).map(([k, x]) => [k, x && players.includes(x) ? x : null]))
  return bump({ ...s, players, roles })
}

export const done = s => !!s && s.phase === 'done'
export const left = (s, now) => (s ? Math.max(0, Math.ceil((s.start + RUN_MS - now) / 1000)) : 0)

/** A round brilliant's width in mm for `ct` carats (1 carat is about 6.5 mm across). */
export const mm = ct => 6.5 * Math.cbrt(Math.max(0, ct))
