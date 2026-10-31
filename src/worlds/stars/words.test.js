import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { useChart } from '../../chem/nucleus.js'
import { WORDS, MISSIONS, timeKid, tempText, sunsText } from './words.js'
import { cardOf } from './card.js'
import { phasesOf, endOf, NURSERY } from './life.js'
import { sRun, rPath, SEED } from './neutrons.js'

useChart(JSON.parse(readFileSync(new URL('../../data/nuclides.json', import.meta.url), 'utf8')))

const LANGS = ['en', 'pt-pt', 'pl', 'de']
const LEVELS = ['explorer', 'scientist']

/** Every key path of a words object, functions and strings alike. */
const shape = (o, at = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? shape(v, `${at}${k}.`) : [`${at}${k}`])).sort()

test('every language has every word', () => {
  const en = shape(WORDS.en)
  for (const l of LANGS) assert.deepEqual(shape(WORDS[l]), en, l)
  for (const ms of MISSIONS) for (const l of LANGS) assert.ok(ms.name[l] && ms.hint[l], `${ms.id} ${l}`)
})

const clean = (s, where) => {
  assert.equal(typeof s, 'string', where)
  assert.ok(s.length > 0, `${where}: empty`)
  assert.ok(!/[{}]|undefined|NaN|null/.test(s), `${where}: ${s}`)
  assert.ok(!/\u2014/.test(s) && !/ \u2013 /.test(s), `${where}: a dash used as a pause: ${s}`)
}

test('no em dash and no placeholder left in any word', () => {
  const walk = (o, at) => {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string') assert.ok(!/\u2014/.test(v) && !/ \u2013 /.test(v), `${at}.${k}`)
      else if (v && typeof v === 'object') walk(v, `${at}.${k}`)
    }
  }
  for (const l of LANGS) walk(WORDS[l], l)
})

test('the card reads in every state, language and depth', () => {
  const states = []
  const star = (m, extra) => ({ place: 'star', m, x: 0, lit: false, i: 0, f: 0, end: null, ...extra })
  for (const m of [...NURSERY.map(s => s.m), 0.12, 0.7, 2, 9, 12, 20]) {
    states.push(star(m))
    phasesOf(m).forEach((_, i) => states.push(star(m, { lit: true, i, f: 0.5 })))
    const e = endOf(m)
    states.push(star(m, { lit: true, i: phasesOf(m).length - 1, end: { kind: e.kind, remnant: e.remnant, notYet: e.notYet } }))
  }
  // the slow capture: the seed, then each kind of step on its way to lead
  states.push({ place: 'slow', slow: { Z: SEED.Z, N: SEED.N, ev: null } })
  let prev = { Z: SEED.Z, N: SEED.N }
  const seen = new Set()
  for (const s of sRun(SEED.Z, SEED.N, 160)) {
    const ev = { op: s.op, from: prev, to: { Z: s.Z, N: s.N } }
    prev = { Z: s.Z, N: s.N }
    const k = `${s.op}:${s.Z === 43}`
    if (seen.has(k) && s.Z !== 83) continue
    seen.add(k)
    states.push({ place: 'slow', slow: { Z: s.Z, N: s.N, ev } })
  }
  const path = rPath()
  for (const phase of ['orbit', 'merge', 'flood', 'cool', 'decay', 'done']) {
    const p = path[Math.floor(path.length / 2)]
    states.push({ place: 'rapid', rapid: { phase, Z: p.Z, N: p.N, count: 54 } })
  }
  for (const l of LANGS) {
    for (const lv of LEVELS) {
      for (const s of states) {
        const c = cardOf(s, l, lv)
        const where = `${l} ${lv} ${JSON.stringify(s).slice(0, 90)}`
        clean(c.title, where)
        clean(c.prompt, where)
        c.lines.forEach(x => clean(x, where))
        if (c.link) clean(c.link.label, where)
      }
    }
  }
})

test('times, temperatures and masses in each language', () => {
  assert.equal(timeKid(1e10, 'en'), '10 billion years')
  assert.equal(timeKid(1e12, 'pt-pt'), '1 bilião de anos')
  assert.equal(timeKid(1.11e7, 'pl'), '11 milionów lat')
  assert.equal(timeKid(2.03e3, 'de'), '2000 Jahre')
  assert.equal(timeKid(0.732, 'en'), '8.8 months')
  assert.equal(timeKid(5.01e-2, 'pt-pt'), '18 dias')
  assert.equal(timeKid(2.01e-3, 'en'), '18 hours')
  assert.equal(tempText(1.57e7, 'en'), '15.7 million K')
  assert.equal(tempText(1.57e7, 'en', true), '16 million degrees')
  assert.equal(tempText(3.3e9, 'de'), '3,3 Milliarden K')
  assert.equal(tempText(1e8, 'pl', true), '100 milionów stopni')
  assert.equal(sunsText(1, 'en'), '1 sun')
  assert.equal(sunsText(3, 'pl'), '3 masy Słońca')
  assert.equal(sunsText(15, 'pl'), '15 mas Słońca')
  assert.equal(sunsText(0.25, 'de'), '0,25 Sonnen')
})
