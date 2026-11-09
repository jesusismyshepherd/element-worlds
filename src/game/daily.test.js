import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, element } from '../data/elements.js'
import { KID_POOL } from './quiz.js'
import {
  dayOf, addDays, daysBetween, weekdayOf, seeded, CYCLE, EPOCH, FIRST_WEEK, elementOfDay, streakOf, weekOf, MAX_FREEZES,
  answered, dueOn, metFrom, reviewsFor, makeLesson, lessonNeeds, mysteryFor, normalDaily, finishLesson, guessMystery, eraOf, familyOf,
} from './daily.js'
import en from '../i18n/locales/en.json' with { type: 'json' }
import pt from '../i18n/locales/pt-pt.json' with { type: 'json' }
import pl from '../i18n/locales/pl.json' with { type: 'json' }
import de from '../i18n/locales/de.json' with { type: 'json' }

const content = {}
for (const e of ELEMENTS) content[e.symbol] = (await import(`../content/${e.symbol}.js`)).default
const contentOf = s => content[s] ?? null

/** Days done, from a list of 'YYYY-MM-DD'. */
const done = list => Object.fromEntries(list.map(d => [d, { s: 'C', r: 5, n: 6, at: 1 }]))
const run = (from, n) => Array.from({ length: n }, (_, i) => addDays(from, i))

test('days: counted on the calendar, across months, years and clock changes', () => {
  assert.equal(dayOf(new Date(2026, 10, 9, 23, 59)), '2026-11-09')
  assert.equal(addDays('2026-12-31', 1), '2027-01-01')
  assert.equal(addDays('2028-02-28', 1), '2028-02-29')
  assert.equal(addDays('2026-03-29', 1), '2026-03-30') // the clocks go forward in Lisbon that night
  assert.equal(daysBetween('2026-11-09', '2027-11-09'), 365)
  assert.equal(weekdayOf('2026-11-09'), 0) // a Monday
  assert.equal(weekdayOf('2026-11-15'), 6)
})

test('the same words give the same random numbers', () => {
  const a = seeded('x')
  const b = seeded('x')
  assert.deepEqual([a(), a(), a()], [b(), b(), b()])
  assert.notEqual(seeded('y')(), seeded('x')())
})

test('the order of the days: every element, the first week first, no element again within 30 days', () => {
  assert.equal(new Set(CYCLE).size, 118)
  assert.deepEqual(CYCLE.slice(0, 7), FIRST_WEEK)
  assert.equal(elementOfDay(EPOCH), 'C')
  assert.equal(elementOfDay(addDays(EPOCH, 1)), 'Na')
  assert.equal(elementOfDay(addDays(EPOCH, CYCLE.length)), 'C')
  assert.equal(elementOfDay(addDays(EPOCH, -1)), CYCLE.at(-1))
  for (let i = 0; i < CYCLE.length; i++) {
    for (let k = 1; k < 30; k++) assert.notEqual(CYCLE[i], CYCLE[(i + k) % CYCLE.length], `${CYCLE[i]} on day ${i} and ${i + k}`)
  }
  // about every other day an element a ten-year-old has heard of, in every month
  for (let m = 0; m + 30 <= CYCLE.length; m += 30) {
    const known = CYCLE.slice(m, m + 30).filter(s => KID_POOL.includes(s)).length
    assert.ok(known >= 12, `${known} known in days ${m} to ${m + 29}`)
  }
})

test('a streak: days in a row, today still open', () => {
  assert.deepEqual(streakOf({}, '2026-11-09'), { streak: 0, best: 0, freezes: 1, frozen: [], doneToday: false, lost: null, total: 0 })
  const three = done(run('2026-11-07', 3))
  assert.equal(streakOf(three, '2026-11-09').streak, 3)
  assert.equal(streakOf(three, '2026-11-09').doneToday, true)
  // the next day, not played yet: still 3
  const next = streakOf(three, '2026-11-10')
  assert.equal(next.streak, 3)
  assert.equal(next.doneToday, false)
  assert.equal(next.freezes, 1)
})

test('a day missed spends a freeze; two missed with one freeze end the streak', () => {
  const days = done(['2026-11-01', '2026-11-02', '2026-11-04'])
  const st = streakOf(days, '2026-11-04')
  assert.equal(st.streak, 3)
  assert.deepEqual(st.frozen, ['2026-11-03'])
  assert.equal(st.freezes, 0)
  const lost = streakOf(done(['2026-11-01', '2026-11-02', '2026-11-05']), '2026-11-05')
  assert.equal(lost.streak, 1)
  assert.deepEqual(lost.lost, { n: 2, on: '2026-11-04' })
  assert.equal(lost.best, 2)
})

test('a freeze more at every seventh day, two at most', () => {
  assert.equal(streakOf(done(run('2026-11-01', 6)), '2026-11-06').freezes, 1)
  assert.equal(streakOf(done(run('2026-11-01', 7)), '2026-11-07').freezes, 2)
  assert.equal(streakOf(done(run('2026-11-01', 14)), '2026-11-14').freezes, MAX_FREEZES)
  // two days missed after a week: both kept
  const kept = streakOf(done([...run('2026-11-01', 7), '2026-11-10']), '2026-11-10')
  assert.equal(kept.streak, 8)
  assert.deepEqual(kept.frozen, ['2026-11-08', '2026-11-09'])
  assert.equal(kept.freezes, 0)
})

test('the week: done, perfect, frozen, missed, today, coming', () => {
  const days = { ...done(['2026-11-09', '2026-11-11']), '2026-11-12': { s: 'H', r: 6, n: 6, at: 1 } }
  const week = weekOf(days, '2026-11-13')
  assert.deepEqual(week.map(d => d.state), ['done', 'frozen', 'done', 'done', 'today', 'coming', 'coming'])
  assert.deepEqual(week.map(d => d.perfect), [false, false, false, true, false, false, false])
  assert.deepEqual(weekOf({}, '2026-11-11').map(d => d.state), ['none', 'none', 'today', 'coming', 'coming', 'coming', 'coming'])
  assert.equal(weekOf(done(['2026-11-03']), '2026-11-11')[1].state, 'missed')
})

test("the family: each one's streak and today, and the days in a row everyone did it", () => {
  const me = { name: 'miki', me: true, days: run('2026-11-05', 5) }
  const kid = { name: 'artur', me: false, days: ['2026-11-07', '2026-11-08'] }
  let f = familyOf([me, kid], '2026-11-09')
  assert.deepEqual(f.people.map(p => [p.name, p.me, p.doneToday, p.streak]), [['miki', true, true, 5], ['artur', false, false, 2]])
  assert.equal(f.together, 2) // the 7th and the 8th: today waits for artur
  assert.equal(f.allToday, false)
  f = familyOf([me, { ...kid, days: [...kid.days, '2026-11-09'] }], '2026-11-09')
  assert.equal(f.together, 3)
  assert.equal(f.allToday, true)
  assert.equal(familyOf([me], '2026-11-09').together, 0)
  assert.deepEqual(familyOf(null, '2026-11-09').people, [])
})

test('the boxes: right moves an element up and further away, wrong brings it back tomorrow', () => {
  let b = answered({}, 'Fe', true, '2026-11-09', 5)
  assert.deepEqual(b.Fe, { b: 1, d: '2026-11-10', at: 5 })
  b = answered(b, 'Fe', true, '2026-11-10', 6)
  assert.deepEqual(b.Fe, { b: 2, d: '2026-11-12', at: 6 })
  b = answered(b, 'Fe', false, '2026-11-12', 7)
  assert.deepEqual(b.Fe, { b: 1, d: '2026-11-13', at: 7 })
  b = answered(b, 'O', true, '2026-11-09')
  assert.deepEqual(dueOn(b, '2026-11-12'), ['O'])
  assert.deepEqual(dueOn(b, '2026-11-13'), ['O', 'Fe'])
})

test('the elements to go over: the due ones, then the met ones, then new ones; never today\'s or tomorrow\'s', () => {
  assert.deepEqual(metFrom(['C:atom', 'C:look', 'lab:H2O', 'forge:C12', 'Na:board:salt', 'stars:sun']), ['C', 'Na'])
  const boxes = { Fe: { b: 1, d: '2026-11-08', at: 0 }, Au: { b: 3, d: '2026-11-20', at: 0 } }
  const r = reviewsFor({ boxes, met: ['C', 'Na', 'Fe'], today: '2026-11-09', symbol: 'C', avoid: ['Na'], level: 'explorer', n: 3, rng: seeded('t') })
  assert.equal(r[0], 'Fe')
  assert.ok(!r.includes('C') && !r.includes('Na') && !r.includes('Au'))
  assert.equal(r.length, 3)
  assert.ok(KID_POOL.includes(r[1]) && KID_POOL.includes(r[2]))
})

const KINDS = new Set(['find', 'state', 'family', 'protons', 'symbol', 'use', 'truth', 'compare', 'year', 'config', 'who'])

test('every day\'s lesson at both levels: find it, three about it, two to go over, every answer among its options', () => {
  for (let i = 0; i < CYCLE.length; i++) {
    const day = addDays(EPOCH, i)
    for (const level of ['explorer', 'scientist']) {
      for (const lang of ['en', 'pt-pt', 'pl', 'de']) {
        if (lang !== 'en' && i % 10) continue
        const l = makeLesson({ day, level, boxes: {}, met: ['C', 'O'], lang, contentOf })
        assert.equal(l.symbol, elementOfDay(day))
        assert.equal(l.steps[0].kind, 'find')
        assert.equal(l.steps[0].z, element(l.symbol).z)
        assert.equal(l.steps.filter(s => s.today).length, 4, `${day} ${level}: ${l.steps.map(s => s.kind)}`)
        assert.equal(l.steps.filter(s => s.review).length, 2)
        assert.equal(new Set(l.steps.filter(s => s.today).map(s => s.kind)).size, 4)
        for (const s of l.steps) {
          assert.ok(KINDS.has(s.kind), s.kind)
          if (s.kind === 'find') continue
          assert.ok(s.options.includes(s.answer), `${day} ${level} ${s.kind}: ${s.answer} in ${s.options}`)
          assert.equal(new Set(s.options).size, s.options.length, `${s.kind} ${s.options}`)
          assert.ok(s.options.length >= 2)
        }
        for (const s of l.steps.filter(s => s.review)) assert.ok(s.z !== element(l.symbol).z && s.z !== element(l.tomorrow).z)
      }
    }
  }
})

test('the questions are right: the state, the family, the symbol, the facts, the comparisons', () => {
  const steps = []
  for (let i = 0; i < CYCLE.length; i++) {
    for (const level of ['explorer', 'scientist']) steps.push(...makeLesson({ day: addDays(EPOCH, i), level, contentOf }).steps)
  }
  for (const s of steps) {
    const el = ELEMENTS[s.z - 1]
    if (s.kind === 'state') assert.equal(s.answer, el.state)
    if (s.kind === 'family') assert.equal(s.answer, el.family)
    if (s.kind === 'symbol') {
      assert.equal(s.answer, el.symbol)
      assert.equal(s.options.length, 4)
    }
    if (s.kind === 'protons') assert.equal(s.answer, el.z)
    if (s.kind === 'year') assert.equal(s.answer, eraOf(el))
    if (s.kind === 'truth' && s.fact === 'dense') assert.equal(s.answer === 'yes', el.density < 1)
    if (s.kind === 'truth' && s.fact === 'radio') assert.equal(s.answer === 'yes', el.radioactive)
    if (s.kind === 'compare') {
      const [a, b] = s.options.map(z => ELEMENTS[z - 1])
      const v = { mass: e => e.mass, melt: e => e.melt, en: e => e.en, radius: e => e.radius.atomic, density: e => e.density }[s.what]
      assert.equal(s.answer, v(a) > v(b) ? a.z : b.z, `${s.what} ${a.symbol} ${b.symbol}`)
      assert.ok(!(s.what === 'melt' && (a.sublimes || b.sublimes)), 'carbon and arsenic do not melt at the air\'s pressure')
    }
    if (s.kind === 'use') {
      for (const o of s.options) {
        const [z, i] = o.split(':').map(Number)
        assert.ok(content[ELEMENTS[z - 1].symbol].uses.en.kid.length > i || content[ELEMENTS[z - 1].symbol].uses.en.sci?.length > i)
      }
    }
  }
  const kinds = new Set(steps.map(s => s.kind))
  for (const k of KINDS) assert.ok(kinds.has(k), `${k} is asked somewhere`)
})

test('practice: five to go over, the day not counted', () => {
  const l = makeLesson({ day: '2026-11-09', level: 'explorer', boxes: {}, met: [], contentOf, practice: true })
  assert.equal(l.steps.length, 5)
  assert.ok(l.steps.every(s => s.review))
  const state = finishLesson({}, { day: '2026-11-09', symbol: 'C', results: [{ about: 'Fe', ok: true }], practice: true }, 9)
  assert.deepEqual(state.days, {})
  assert.equal(state.boxes.Fe.b, 1)
})

test('the contents a lesson needs are the ones it uses', () => {
  const args = { day: '2026-11-12', level: 'explorer', boxes: {}, met: ['C'] }
  const needs = lessonNeeds(args)
  const l = makeLesson({ ...args, contentOf: s => (needs.includes(s) ? content[s] : null) })
  const full = makeLesson({ ...args, contentOf })
  assert.deepEqual(l.steps, full.steps)
})

test('tomorrow\'s mystery: the same for everyone at a level, its answer among four', () => {
  const m = mysteryFor('2026-11-09', 'explorer')
  assert.deepEqual(m, mysteryFor('2026-11-09', 'explorer'))
  assert.equal(m.day, '2026-11-10')
  assert.equal(m.answer, element('Na').z)
  assert.equal(m.options.length, 4)
  assert.ok(m.options.includes(m.answer))
})

test('a lesson done: the day kept once, the boxes moved, a guess kept', () => {
  let s = finishLesson({}, { day: '2026-11-09', symbol: 'C', results: [{ about: 'C', ok: true }, { about: 'C', ok: false }, { about: 'Fe', ok: true }] }, 3)
  assert.deepEqual(s.days['2026-11-09'], { s: 'C', r: 2, n: 3, at: 3 })
  assert.equal(s.boxes.C.b, 1)
  assert.equal(s.boxes.Fe.d, '2026-11-10')
  const again = finishLesson(s, { day: '2026-11-09', symbol: 'C', results: [{ about: 'C', ok: true }] }, 4)
  assert.deepEqual(again.days['2026-11-09'], { s: 'C', r: 2, n: 3, at: 3 })
  s = guessMystery(s, '2026-11-10', 11)
  assert.equal(s.guess['2026-11-10'], 11)
  for (let i = 0; i < 70; i++) s = guessMystery(s, addDays('2026-12-01', i), 1)
  assert.equal(Object.keys(s.guess).length, 60)
  assert.deepEqual(normalDaily({ days: { nope: {}, '2026-11-09': 'x' }, boxes: { Xx: { b: 1, d: '2026-11-09' } }, guess: { '2026-11-09': 200 } }), { days: {}, boxes: {}, guess: {} })
})

const LOCALES = { en, 'pt-pt': pt, pl, de }
function leaves(o, path = '') {
  if (o == null || typeof o !== 'object') return [[path, o]]
  return Object.entries(o).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k))
}
// a plural's forms: one and other everywhere, Polish also few and many
const base = p => p.replace(/_(one|few|many|other)$/, '')

test('words: every daily text in all four languages, with the same blanks, without dashes', () => {
  const keys = l => new Set(leaves(LOCALES[l].daily).map(([p]) => base(p)))
  const ref = keys('en')
  assert.ok(ref.size > 40)
  for (const lang of Object.keys(LOCALES)) {
    assert.deepEqual([...keys(lang)].sort(), [...ref].sort(), lang)
    for (const [p, v] of leaves(LOCALES[lang].daily)) {
      assert.equal(typeof v, 'string', `${lang} daily.${p}`)
      assert.ok(!v.includes('—'), `${lang} daily.${p} has a dash`)
      // the same blanks (a language may say one twice, or once where English says it twice)
      const blanks = s => [...new Set([...String(s).matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]))].filter(b => b !== 'count').sort().join(',')
      const enValue = leaves(en.daily).find(([q]) => base(q) === base(p))?.[1]
      assert.equal(blanks(v), blanks(enValue), `${lang} daily.${p}`)
    }
  }
  for (const k of ['streak_one', 'streak_few', 'streak_many', 'streak_other']) assert.ok(pl.daily[k], `pl daily.${k}`)
})
