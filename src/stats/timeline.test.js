import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyze } from './analyze.js'
import { timelineOf, compact } from './timeline.js'
import { sample, T0, V1, V2, V3 } from './fixture.js'

const a = analyze(sample(), { period: '7', now: T0 + 2 * 3600 * 1000 })
const lines = id => timelineOf(a.visits.find(v => v.id === id))
const texts = id => lines(id).map(l => l.text)

test('a visit in plain words: worlds with their times, panels with how long, runs folded', () => {
  const t = texts(V1)
  assert.equal(t[0], 'opened the site on a phone (Chrome on Android, 412×915)')
  assert.ok(t.includes("entered Carbon's hall (1 min 40 s, 1 min 30 s active)"))
  assert.ok(t.includes('opened the Fact file for 45 s'))
  assert.ok(t.includes("asked Carbon's Atomling to tell something, 3 times"))
  assert.ok(t.includes('opened “Identity card” and closed it after 1 s'))
  assert.ok(t.includes("clicked through 2 facts on Carbon's card (to fact 3 of 3)"))
  assert.ok(t.includes("took the floor table to Oxygen's hall"))
  assert.ok(t.includes('quiz question 1: Oxygen (right) with 2 of 5 clues shown'))
  assert.ok(t.includes('quiz question 2: Silver (wrong, it was Gold) with 5 of 5 clues shown'))
  assert.ok(t.includes('added a proton, a neutron and an electron in the forge (then hydrogen-2, 1 electron)'))
  assert.ok(t.includes('completed the mission “Deuterium, heavy hydrogen”'))
  assert.ok(t.includes('fired an alpha particle at hydrogen-2'))
  assert.ok(t.includes('switched to Scientist'))
  assert.ok(t.includes('changed the language to Polish'))
  assert.ok(t.includes('put the page away for 1 min'))
  assert.ok(t.includes('joined a room'))
  assert.equal(t.at(-1), 'put the page away')
  assert.ok(!t.some(x => x.includes('Fact file”')), 'the title recorded a frame before the exhibit id is not a reading')
  assert.ok(!t.some(x => x.includes('came back to the page')), 'a show is said with its hide')
  const err = lines(V1).find(l => l.tone === 'error')
  assert.equal(err.text, 'error: boom (x.js:1)')
  assert.equal(lines(V1).filter(l => l.head).length, 8)
})

test('a world rebuilt where it stood is entered once; a kind not known yet still shows', () => {
  const l = lines(V2)
  assert.equal(l.filter(x => x.text.startsWith("entered Oxygen's hall")).length, 2)
  assert.ok(l.some(x => x.text === "entered Oxygen's hall (55 s, 51 s active)"))
  assert.ok(l.some(x => x.text === 'opened the specimen case and closed it after 1 s'))
  assert.ok(l.some(x => x.text === "asked Oxygen's Atomling to tell something"))
  assert.ok(l.some(x => x.text === 'zap (x: 1, deep: {"y":[1,2]})'))
  assert.ok(l.some(x => /^entered the plaza \(5 s, 5 s active, estimated/.test(x.text)))
})

test('events sent late from an earlier page load are set apart', () => {
  const l = lines(V3)
  assert.equal(l[0].tone, 'note')
  assert.match(l[0].text, /^1 event from an earlier page load/)
  assert.equal(l[1].text, "asked Carbon's Atomling to tell something")
  assert.equal(l[2].text, 'This page load:')
  assert.match(l[3].text, /^opened the site on a phone/)
})

test('compact data for unknown kinds stays short', () => {
  assert.equal(compact({ a: 1, b: 'x' }), 'a: 1, b: x')
  assert.equal(compact(null), '')
  assert.ok(compact({ long: 'y'.repeat(500) }).length <= 120)
})
