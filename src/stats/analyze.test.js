import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyze, normalize, placeOfPath, periodStart, visitsOf, bucketsOf, readingsOf, isQuick, MAIN_PLACES, FLICKER_MS } from './analyze.js'
import { sample, visitOne, visitTwo, T0, V1, V2, V3, PHONE } from './fixture.js'

const NOW = T0 + 2 * 3600 * 1000
const a = analyze(sample(), { period: '7', now: NOW, boards: ['C', 'O'] })
const stay = (v, w) => v.stays.filter(s => s.w === w)
const visit = id => a.visits.find(v => v.id === id)

test('normalize: junk left out, data always an object, sorted, the dashboard itself dropped', () => {
  const evs = normalize([null, 7, 'x', {}, { at: 'never' }, { at: '2026-10-29T10:00:02Z', kind: 'sel', data: [1] }, { at: '2026-10-29T10:00:01Z', kind: 'start', path: '/stats' }, { at: '2026-10-29T10:00:00Z', kind: 'enter', data: { w: 'plaza' } }])
  assert.equal(evs.length, 2)
  assert.deepEqual(evs.map(e => e.kind), ['enter', 'sel'])
  assert.deepEqual(evs[1].data, {})
  assert.deepEqual(normalize(undefined), [])
  assert.deepEqual(normalize({ error: 'password' }), [])
  assert.equal(a.events.some(e => e.path === '/stats'), false)
})

test('addresses name the worlds as telemetry.js does', () => {
  assert.equal(placeOfPath('/'), 'plaza')
  assert.equal(placeOfPath(''), 'plaza')
  assert.equal(placeOfPath('/lab'), 'lab')
  assert.equal(placeOfPath('/forge/'), 'forge')
  assert.equal(placeOfPath('/e/C'), 'atrium:C')
  assert.equal(placeOfPath('/e/c/allotropes'), 'wing:C:allotropes')
  assert.equal(placeOfPath('/passport'), 'page:/passport')
  assert.equal(placeOfPath('/e/Qq'), 'page:/e/Qq')
})

test('periods start at local midnight, today included', () => {
  const midnight = new Date(2026, 9, 29).getTime()
  assert.equal(periodStart('today', T0), midnight)
  assert.equal(periodStart('7', T0), new Date(2026, 9, 23).getTime())
  assert.equal(periodStart('30', T0), new Date(2026, 8, 30).getTime())
  assert.equal(periodStart('nonsense', T0), new Date(2026, 9, 23).getTime())
})

test('visits: one per page load, with device, tag and what was carried from an earlier load', () => {
  assert.equal(a.visits.length, 3)
  assert.deepEqual(a.visits.map(v => v.id), [V2, V1, V3])
  const v1 = visit(V1)
  assert.equal(v1.label, 'artur')
  assert.equal(v1.device, PHONE)
  assert.equal(v1.kind, 'phone')
  assert.equal(v1.size, '412×915')
  assert.equal(visit(V2).label, null)
  assert.equal(visit(V3).carried, 1)
  assert.equal(visit(V3).start, T0 + 3600 * 1000)
})

test('stays: a world rebuilt where it stood is one stay; an unclosed one is estimated without its hidden time', () => {
  const o = stay(visit(V2), 'atrium:O')
  assert.equal(o.length, 2)
  assert.equal(o[0].ms, 624 + 40 + 54336)
  assert.equal(o[0].act, 624 + 40 + 50000)
  const last = stay(visit(V1), 'plaza').at(-1)
  assert.ok(last.est)
  assert.equal(last.ms, 96000)
  assert.equal(last.act, 16000 + 20000) // shown 374 to 390 s and 450 to 470 s
  assert.ok(visit(V3).stays[0].est)
})

test('stays left by the floor table are passing through, not quick exits', () => {
  const c = stay(visit(V1), 'atrium:C')
  assert.equal(c.length, 2)
  assert.equal(c[1].byTile, true)
  assert.equal(isQuick(c[1]), false)
  assert.equal(isQuick(stay(visit(V1), 'atrium:O')[0]), true)
  assert.equal(isQuick({ w: 'plaza', act: 1000, byTile: false }), false)
})

test('readings: id corrections dropped, opens and closes paired by time in any order', () => {
  const r1 = visit(V1).readings
  assert.deepEqual(r1.map(r => [r.id, r.ms, r.place]), [['facts', 45000, 'atrium:C'], ['identity', 1000, 'atrium:C']])
  const r2 = visit(V2).readings
  assert.deepEqual(r2.map(r => [r.id, r.ms]), [['facts', 20000], ['look', 1000], ['look', 8500]])
  // the same events with every millisecond tie reversed give the same readings
  const shuffled = visitTwo().reverse().sort((x, y) => Date.parse(x.at) - Date.parse(y.at))
  const v = visitsOf(normalize(shuffled))[0]
  assert.deepEqual(readingsOf(v).map(r => [r.id, r.ms]), [['facts', 20000], ['look', 1000], ['look', 8500]])
  assert.ok(FLICKER_MS > 16)
})

test('a panel never closed is estimated to the last thing recorded', () => {
  const evs = normalize([
    { at: '2026-10-29T10:00:00Z', kind: 'enter', data: { w: 'atrium:C' }, path: '/e/C', visit: 'x' },
    { at: '2026-10-29T10:00:10Z', kind: 'panel', data: { id: 'facts' }, path: '/e/C', visit: 'x' },
    { at: '2026-10-29T10:00:50Z', kind: 'hide', path: '/e/C', visit: 'x' },
  ])
  const [r] = visitsOf(evs)[0].readings
  assert.equal(r.est, true)
  assert.equal(r.ms, 40000)
})

test('places: active time, entries, visits, quick exits, talks', () => {
  const p = Object.fromEntries(a.places.map(x => [x.w, x]))
  assert.equal(a.places[0].w, 'wing:C:allotropes')
  assert.equal(p['atrium:O'].visits, 2)
  assert.equal(p['atrium:O'].entries, 3)
  assert.equal(p['atrium:O'].quick, 2)
  assert.equal(p.forge.quick, 2)
  assert.equal(p.plaza.quick, 0)
  assert.equal(p.plaza.visits, 3)
  assert.equal(p['wing:O:fire'].talks, 1)
  assert.equal(p['atrium:C'].talks, 4) // three in visit 1, one carried into visit 3
})

test('halls: panels read and skimmed, reading time, talks, floor table, wings', () => {
  const h = Object.fromEntries(a.halls.map(x => [x.symbol, x]))
  assert.equal(h.C.read, 1)
  assert.equal(h.C.skimmed, 1)
  assert.equal(h.C.avgRead, 45000)
  assert.equal(h.C.talks, 4)
  assert.equal(h.C.tiles, 1)
  assert.deepEqual(h.C.wings, [{ id: 'allotropes', n: 1 }])
  assert.equal(h.C.boards, true)
  assert.equal(h.O.opened, 3)
  assert.equal(h.O.read, 2)
  assert.equal(h.O.talks, 0) // its Atomling was asked in the fire wing, not in the hall
  assert.deepEqual(h.O.wings, [{ id: 'fire', n: 1 }])
  assert.equal(h.O.idle, false)
})

test('panel groups: an exhibit across the halls is one row', () => {
  const facts = a.panels.find(g => g.key === 'hall|facts')
  assert.deepEqual(facts.places.sort(), ['atrium:C', 'atrium:O'])
  assert.equal(facts.opened, 2)
  assert.equal(facts.read, 2)
  assert.equal(facts.avgRead, (45000 + 20000) / 2)
  const look = a.panels.find(g => g.key === 'hall|look')
  assert.equal(look.skimmed, 1)
  assert.equal(a.confusion.reopened, 1)
})

test('quick exits and the places never entered', () => {
  assert.equal(a.quick.n, 5)
  assert.equal(a.quick.of, 8)
  assert.deepEqual(a.quick.places, [{ w: 'atrium:O', n: 2 }, { w: 'forge', n: 2 }, { w: 'wing:O:fire', n: 1 }])
  const never = Object.fromEntries(a.never.map(n => [n.w, n]))
  assert.ok(never.lab)
  assert.equal(never.forge, undefined)
  assert.equal(never['wing:C:allotropes'], undefined)
  assert.equal(never['wing:O:air'].hallEntered, true)
  assert.equal(never['wing:Ne:signs'].hallEntered, false)
  assert.ok(MAIN_PLACES.includes('wing:Rn:signs'))
})

test('features, plaza, quiz, forge, tools, errors and unknown kinds', () => {
  const f = Object.fromEntries(a.features.map(x => [x.id, x.n]))
  assert.equal(f.quiz, 1)
  assert.equal(f.find, 0)
  assert.equal(f.families, 1)
  assert.equal(f.beam, 1)
  assert.deepEqual(a.plaza.picks, [{ symbol: 'C', n: 1, entered: true }])
  assert.deepEqual(a.plaza.facts, [{ symbol: 'C', clicks: 2, seen: 3, n: 3 }])
  assert.equal(a.quiz.answers, 2)
  assert.equal(a.quiz.right, 1)
  assert.equal(a.quiz.clues, 3.5)
  assert.equal(a.quiz.wrongAfterAll, 1)
  assert.deepEqual(a.quiz.missed, [{ symbol: 'Au', n: 1 }])
  assert.equal(a.forge.actions, 4)
  assert.deepEqual(a.forge.parts, { p: 1, n: 1, e: 1 })
  assert.equal(a.forge.maxZ, 1)
  assert.deepEqual(a.forge.missions, ['forge:D'])
  assert.equal(a.forge.entries, 2)
  assert.deepEqual(a.tools.drawers, [{ id: 'families', n: 1 }])
  assert.deepEqual(a.tools.level, [{ v: 'scientist', n: 1 }])
  assert.equal(a.errors.length, 1)
  assert.equal(a.errors[0].m, 'boom')
  assert.deepEqual(a.errors[0].places, ['plaza'])
  assert.equal(a.errors[0].list[0].label, 'artur')
  assert.deepEqual(a.others.map(o => [o.kind, o.n]), [['zap', 1], ['room', 1]])
})

test('buckets: hours today, days over a week, weeks over half a year', () => {
  const today = bucketsOf(a.visits, 'today', NOW)
  assert.equal(today.length, 24)
  assert.equal(today[10].visits, 1) // visit 1 at 10:00
  assert.equal(today[11].visits, 1) // visit 3 at 11:00
  const week = a.days
  assert.equal(week.length, 7)
  assert.equal(week[6].visits, 2)
  assert.equal(week[5].visits, 1) // visit 2, the evening before
  assert.ok(week[5].active > 90000)
  const half = bucketsOf(a.visits, '180', NOW)
  assert.equal(new Date(half[0].start).getDay(), 1) // weeks start on Monday
  assert.ok(half.at(-1).start <= NOW && NOW < half.at(-1).end)
  assert.equal(half.reduce((x, b) => x + b.visits, 0), 3)
})

test('totals', () => {
  assert.equal(a.totals.visits, 3)
  assert.equal(a.totals.anon, 1)
  assert.equal(a.totals.read, 3)
  assert.equal(a.totals.opened, 5)
})

test('never crashes on what it does not know', () => {
  const junk = []
  const kinds = ['enter', 'leave', 'panel', 'pclose', 'quiz', 'forge', 'fact', 'sel', 'tile', 'talk', 'err', 'mission', 'level', 'drawer', 'start', 'mystery']
  const values = [null, undefined, 0, -5, 'abc', '', [], {}, { w: 1 }, true, 1e12]
  let s = 0
  for (const kind of kinds) {
    for (const v of values) {
      junk.push({ at: new Date(T0 + s++ * 1000).toISOString(), kind, path: s % 3 ? '/e/C' : null, visit: s % 2 ? 'a' : 'b', data: { w: v, ms: v, act: v, id: v, z: v, i: v, n: v, s: v, op: v, k: v, ok: v, from: v, to: v, m: v } })
      junk.push({ at: new Date(T0 + s++ * 1000).toISOString(), kind, data: v })
    }
  }
  for (const period of ['today', '7', '30', '180']) {
    const x = analyze(junk, { period, now: NOW })
    assert.ok(x.visits.length >= 1)
  }
  assert.doesNotThrow(() => analyze([...visitOne(), ...junk], { period: '7', now: NOW }))
})
