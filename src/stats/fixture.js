// Synthetic usage events for the dashboard's tests (analyze, readings, timeline), shaped like what
// src/net/telemetry.js sends (checked against a real capture, 2026-10-29):
// - visit 1, a marked phone (artur): the plaza (a pick, two card facts, a drawer), Carbon's hall (a
//   panel recorded under its title and a frame later under its exhibit id, three talks, a skimmed
//   station), Carbon's allotropes wing, back, the floor table to Oxygen, out after 14 s, the quiz, the
//   forge (three particles, a mission, a beam), level, view and language, an error, the page put away
//   and back, a room, then put away for good (no leave: estimated);
// - visit 2, an anonymous computer the day before: Oxygen's hall rebuilt twice where it stood (one stay),
//   a stale panel id corrected, a skimmed panel opened again at once, the fire wing left quickly, the
//   forge entered and left with nothing built, a kind the dashboard does not know, closed on the plaza;
// - visit 3, the marked phone an hour later, with an event left over from an earlier page load;
// - an event of the dashboard's own page, which the analysis must drop.
export const T0 = new Date(2026, 9, 29, 10, 0, 0).getTime() // 10:00 in the local time zone
export const PHONE = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
export const V1 = '11111111-1111-4111-8111-111111111111'
export const V2 = '22222222-2222-4222-8222-222222222222'
export const V3 = '33333333-3333-4333-8333-333333333333'

const iso = ms => new Date(ms).toISOString()

/** One event as ew_admin returns it, `s` seconds after `base`. */
export const event = (base, s, kind, data, path, visit, device = null, label = null) => ({ at: iso(base + s * 1000), kind, path, data: data ?? null, visit, device, label })

export function visitOne(base = T0) {
  const e = (s, kind, data, path = '/') => event(base, s, kind, data, path, V1, PHONE, 'artur')
  return [
    e(0, 'start', { kind: 'phone', browser: 'Chrome on Android', w: 412, h: 915 }),
    e(1, 'enter', { w: 'plaza' }),
    e(5, 'sel', { z: 6 }),
    e(8, 'fact', { s: 'C', i: 1, n: 3 }),
    e(10, 'fact', { s: 'C', i: 2, n: 3 }),
    e(12, 'drawer', { id: 'families' }),
    e(20, 'leave', { w: 'plaza', ms: 19000, act: 19000 }),
    e(20, 'enter', { w: 'atrium:C' }, '/e/C'),
    e(30, 'panel', { id: 'Fact file' }, '/e/C'),
    e(30.001, 'pclose', { id: 'Fact file', ms: 1 }, '/e/C'),
    e(30.001, 'panel', { id: 'facts' }, '/e/C'),
    e(75.001, 'pclose', { id: 'facts', ms: 45000 }, '/e/C'),
    e(80, 'talk', { w: 'C' }, '/e/C'),
    e(85, 'talk', { w: 'C' }, '/e/C'),
    e(90, 'talk', { w: 'C' }, '/e/C'),
    e(100, 'panel', { id: 'identity' }, '/e/C'),
    e(101, 'pclose', { id: 'identity', ms: 1000 }, '/e/C'),
    e(120, 'leave', { w: 'atrium:C', ms: 100000, act: 90000 }, '/e/C/allotropes'),
    e(120, 'enter', { w: 'wing:C:allotropes' }, '/e/C/allotropes'),
    e(300, 'leave', { w: 'wing:C:allotropes', ms: 180000, act: 150000 }, '/e/C'),
    e(300, 'enter', { w: 'atrium:C' }, '/e/C'),
    e(305, 'tile', { from: 'C', to: 'O' }, '/e/C'),
    e(306, 'leave', { w: 'atrium:C', ms: 6000, act: 6000 }, '/e/O'),
    e(306, 'enter', { w: 'atrium:O' }, '/e/O'),
    e(320, 'leave', { w: 'atrium:O', ms: 14000, act: 14000 }, '/'),
    e(320, 'enter', { w: 'plaza' }),
    e(325, 'quizopen', null),
    e(340, 'quiz', { z: 8, pick: 8, ok: true, clues: 2, of: 5, n: 1 }),
    e(355, 'quiz', { z: 79, pick: 47, ok: false, clues: 5, of: 5, n: 2 }),
    e(360, 'leave', { w: 'plaza', ms: 40000, act: 40000 }, '/forge'),
    e(360, 'enter', { w: 'forge' }, '/forge'),
    e(365, 'forge', { op: 'add', k: 'p', z: 0, n: 0, e: 0 }, '/forge'),
    e(366, 'forge', { op: 'add', k: 'n', z: 1, n: 0, e: 0 }, '/forge'),
    e(367, 'forge', { op: 'add', k: 'e', z: 1, n: 1, e: 0 }, '/forge'),
    e(370, 'mission', { id: 'forge:D' }, '/forge'),
    e(372, 'forge', { op: 'fire', beam: 'a', z: 1, n: 1 }, '/forge'),
    e(374, 'leave', { w: 'forge', ms: 14000, act: 14000 }, '/'),
    e(374, 'enter', { w: 'plaza' }),
    e(375, 'level', { v: 'scientist' }),
    e(376, 'view', { v: 'first' }),
    e(377, 'lang', { v: 'pl' }),
    e(380, 'err', { m: 'boom', s: 'x.js:1' }),
    e(390, 'hide', null),
    e(450, 'show', null),
    e(460, 'room', { op: 'join' }),
    e(470, 'hide', null),
  ]
}

export function visitTwo(base = T0 - 16 * 3600 * 1000) {
  const e = (s, kind, data, path = '/') => event(base, s, kind, data, path, V2)
  return [
    e(0, 'start', { kind: 'computer', browser: 'Edge on Windows', w: 1280, h: 720 }),
    e(0.5, 'enter', { w: 'plaza' }),
    e(5, 'leave', { w: 'plaza', ms: 4500, act: 4500 }, '/e/O'),
    e(5, 'enter', { w: 'atrium:O' }, '/e/O'),
    e(5.624, 'leave', { w: 'atrium:O', ms: 624, act: 624 }, '/e/O'),
    e(5.624, 'enter', { w: 'atrium:O' }, '/e/O'),
    e(5.664, 'leave', { w: 'atrium:O', ms: 40, act: 40 }, '/e/O'),
    e(5.664, 'enter', { w: 'atrium:O' }, '/e/O'),
    e(10, 'panel', { id: 'Fact file' }, '/e/O'),
    e(10.001, 'pclose', { id: 'Fact file', ms: 1 }, '/e/O'),
    e(10.001, 'panel', { id: 'facts' }, '/e/O'),
    e(30.001, 'pclose', { id: 'facts', ms: 20000 }, '/e/O'),
    // the next exhibit opened while the last one's id was still in the store
    e(40, 'panel', { id: 'facts' }, '/e/O'),
    e(40.016, 'pclose', { id: 'facts', ms: 16 }, '/e/O'),
    e(40.016, 'panel', { id: 'look' }, '/e/O'),
    e(41.016, 'pclose', { id: 'look', ms: 1000 }, '/e/O'),
    e(41.5, 'panel', { id: 'look' }, '/e/O'),
    e(50, 'pclose', { id: 'look', ms: 8500 }, '/e/O'),
    e(60, 'leave', { w: 'atrium:O', ms: 54336, act: 50000 }, '/e/O/fire'),
    e(60, 'enter', { w: 'wing:O:fire' }, '/e/O/fire'),
    e(61, 'talk', { w: 'O' }, '/e/O/fire'),
    e(75, 'leave', { w: 'wing:O:fire', ms: 15000, act: 15000 }, '/e/O'),
    e(75, 'enter', { w: 'atrium:O' }, '/e/O'),
    e(80, 'leave', { w: 'atrium:O', ms: 5000, act: 5000 }, '/'),
    e(80, 'enter', { w: 'plaza' }),
    e(85, 'zap', { x: 1, deep: { y: [1, 2] } }),
    e(90, 'leave', { w: 'plaza', ms: 10000, act: 10000 }, '/forge'),
    e(90, 'enter', { w: 'forge' }, '/forge'),
    e(95, 'leave', { w: 'forge', ms: 5000, act: 5000 }, '/'),
    e(95, 'enter', { w: 'plaza' }),
    e(100, 'hide', null),
  ]
}

export function visitThree(base = T0 + 3600 * 1000) {
  const e = (s, kind, data, path = '/') => event(base, s, kind, data, path, V3, PHONE, 'artur')
  return [
    e(-100, 'talk', { w: 'C' }, '/e/C'), // left over from an earlier page load, sent with this one
    e(0, 'start', { kind: 'phone', browser: 'Chrome on Android', w: 412, h: 915 }),
    e(1, 'enter', { w: 'plaza' }),
    e(30, 'hide', null),
  ]
}

/** The three visits and the dashboard's own page, in the order the database returns them. */
export function sample() {
  const own = event(T0, 500, 'start', { kind: 'computer' }, '/stats', '44444444-4444-4444-8444-444444444444')
  return [...visitTwo(), ...visitOne(), own, ...visitThree()].sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
}
