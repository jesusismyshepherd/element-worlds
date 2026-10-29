import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyze } from './analyze.js'
import * as R from './readings.js'
import { sample, T0 } from './fixture.js'

const NOW = T0 + 2 * 3600 * 1000
const a = analyze(sample(), { period: '7', now: NOW, boards: ['C', 'O'] })
const empty = analyze([], { period: '7', now: NOW })
// the en and em dash (no dash may stand for a pause in the site's words)
const DASHES = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`)
const READS = ['readDays', 'readPlaces', 'readHalls', 'readPanels', 'readQuick', 'readNever', 'readPlaza', 'readQuiz', 'readForge', 'readTools', 'readErrors', 'readOthers']

test('every section has a plain reading, also with nothing recorded, and no dashes for pauses', () => {
  for (const f of READS) {
    for (const x of [a, empty]) {
      const s = R[f](x)
      assert.equal(typeof s, 'string', f)
      assert.ok(s.length > 3, f)
      assert.ok(!DASHES.test(s), `${f}: ${s}`)
      assert.ok(!/undefined|NaN|null|\[object/.test(s), `${f}: ${s}`)
    }
  }
  assert.deepEqual(R.signalsOf(empty), [])
})

test('quick exits read as a sentence with the places and their counts', () => {
  assert.equal(R.readQuick(a), "Left within 20 s 5 times (of 8 entries): Oxygen's hall (2), the Atom Forge (2) and Oxygen's wing “Fire” (1).")
  assert.equal(R.readQuick(empty), 'No world but the plaza was entered.')
})

test('never entered: a wing shared by six gases is said once', () => {
  const s = R.readNever(a)
  assert.match(s, /^Never entered: the Molecule Lab, /)
  assert.match(s, /the neon sign workshop \(all 6 rooms\)/)
  assert.match(s, /Never used: the search/)
  assert.ok(!s.includes("Neon's wing"))
})

test('the other readings say what the numbers suggest', () => {
  assert.match(R.readDays(a), /^3 visits on 2 of the 7 days/)
  assert.match(R.readPlaces(a), /Came back to Oxygen's hall \(2 visits\) and the Atom Forge \(2 visits\)\./)
  assert.match(R.readPlaces(a), /3 stays ended with the page closed or put away: their times are estimated\./)
  assert.match(R.readHalls(a), /^2 halls entered; the longest time in Carbon's hall/)
  assert.match(R.readPanels(a), /^5 panels opened: 3 read \(open 3 s or longer, 25 s on average\), 2 skimmed\./)
  assert.match(R.readQuiz(a), /2 answers, 1 right \(50%\), with 3\.5 of 5 clues shown on average\. Missed: Gold\./)
  assert.match(R.readForge(a), /^4 actions: 3 added, 0 removed, 1 beam fired; up to element 1 \(Hydrogen\)\. Missions done: Deuterium, heavy hydrogen\./)
  assert.match(R.readErrors(a), /^1 error \(1 kind\); the most frequent: “boom”, once, in the plaza\./)
  assert.match(R.readOthers(a), /zap \(1\) and room \(1\)/)
  assert.match(R.readPlaza(a), /^Picked Carbon on the table once, and entered its hall\. .*every fact read for Carbon/)
})

test('what it suggests: time, revisits, not found, left quickly, confusing, broken', () => {
  const sig = R.signalsOf(a)
  const tones = sig.map(s => s.tone)
  for (const t of ['time', 'back', 'obscure', 'quick', 'broken']) assert.ok(tones.includes(t), t)
  for (const s of sig) assert.ok(R.TONES[s.tone], s.tone)
  const quick = sig.find(s => s.tone === 'quick').text
  assert.match(quick, /Oxygen's hall \(2 of 3\)/)
  assert.match(quick, /the Atom Forge \(2 of 2\)/)
  const obscure = sig.filter(s => s.tone === 'obscure').map(s => s.text).join(' ')
  assert.match(obscure, /Carbon's wing “The carbon of life” and Oxygen's wing “The air”: their halls were entered/)
  assert.match(obscure, /The Molecule Lab was never entered/)
})

test('confusion and underdevelopment are guessed from patterns, not single events', () => {
  // three halls entered and left with nothing done, a skimmed panel, the quiz opened and never answered
  const ev = (s, kind, data, path = '/') => ({ at: new Date(T0 + s * 1000).toISOString(), kind, data, path, visit: 'v' })
  const raw = [ev(0, 'start', { kind: 'computer' }), ev(1, 'quizopen', null), ev(2, 'quizopen', null)]
  let t = 10
  for (const sym of ['Fe', 'Cu', 'Zn']) {
    raw.push(ev(t, 'enter', { w: `atrium:${sym}` }, `/e/${sym}`), ev(t + 30, 'leave', { w: `atrium:${sym}`, ms: 30000, act: 30000 }, `/e/${sym}`))
    t += 40
  }
  for (let i = 0; i < 3; i++) raw.push(ev(t + i * 60, 'panel', { id: 'identity' }, '/e/Zn'), ev(t + i * 60 + 1, 'pclose', { id: 'identity', ms: 1000 }, '/e/Zn'))
  const x = analyze(raw, { period: '7', now: NOW })
  const sig = R.signalsOf(x)
  const thin = sig.find(s => s.tone === 'thin')
  assert.ok(thin, 'underdeveloped?')
  assert.match(thin.text, /Nothing was opened or asked in 2 of the 3 halls entered/)
  const conf = sig.find(s => s.tone === 'confusing').text
  assert.match(conf, /“Identity card” closed within 3 s 3 of 3 times/)
  assert.match(conf, /the quiz opened twice and never answered/)
})

test('listSome names a few and counts the rest', () => {
  assert.equal(R.listSome(['a', 'b', 'c', 'd'], 3), 'a, b, c and d')
  assert.equal(R.listSome(['a', 'b', 'c', 'd', 'e', 'f'], 3), 'a, b, c and 3 more')
})
