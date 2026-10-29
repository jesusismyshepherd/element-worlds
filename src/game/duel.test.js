import { test } from 'node:test'
import assert from 'node:assert/strict'
import { newDuel, act, tick, again, present, CLUE_MS, LAST_MS, REVEAL_MS, START_MS, ROUNDS } from './duel.js'

// questions in order: iron, gold, oxygen, ... with six clues each
const QS = [26, 79, 8, 6, 1, 2, 3]
const next = asked => {
  const z = QS.find(a => !asked.includes(a))
  return { q: { answer: z, options: [z, 1, 2, 3], seed: 1 }, total: 6 }
}

const started = () => {
  let s = newDuel('ana', 'explorer', 0)
  s = act(s, 'bob', { t: 'sit', seat: 1 }, 100)
  assert.equal(s.until, 100 + START_MS)
  s = tick(s, 100 + START_MS, next)
  return s
}

test('two seats taken: the game starts after a moment, the first question with one clue', () => {
  const s = started()
  assert.equal(s.phase, 'asking')
  assert.equal(s.round, 1)
  assert.equal(s.q.answer, 26)
  assert.equal(s.shown, 1)
})

test('clues come one by one, then the answer is shown if nobody gets it', () => {
  let s = started()
  const t0 = s.since
  s = tick(s, t0 + CLUE_MS, next)
  assert.equal(s.shown, 2)
  let t = t0 + CLUE_MS
  while (s.shown < s.total) {
    t += CLUE_MS
    s = tick(s, t, next)
  }
  s = tick(s, t + LAST_MS, next)
  assert.equal(s.phase, 'reveal')
  assert.equal(s.winner, null)
})

test('the first right answer scores, more for fewer clues; a wrong one locks that player out', () => {
  let s = started()
  s = act(s, 'bob', { t: 'pick', z: 79 }, 3000)
  assert.equal(s.phase, 'asking')
  assert.equal(act(s, 'bob', { t: 'pick', z: 26 }, 3100), s, 'bob is locked out of this question')
  s = act(s, 'ana', { t: 'pick', z: 26 }, 3200)
  assert.equal(s.winner, 'ana')
  assert.equal(s.scores.ana, 6) // one clue of six seen: 6 points
  assert.equal(s.phase, 'reveal')
  // a watcher cannot answer
  assert.equal(act(started(), 'cid', { t: 'pick', z: 26 }, 3000).answers.cid, undefined)
})

test('both wrong: the answer is shown at once', () => {
  let s = started()
  s = act(s, 'ana', { t: 'pick', z: 1 }, 3000)
  s = act(s, 'bob', { t: 'pick', z: 2 }, 3100)
  assert.equal(s.phase, 'reveal')
})

test('five questions, then the winner', () => {
  let s = started()
  let t = s.since
  for (let r = 1; r <= ROUNDS; r++) {
    s = act(s, r % 2 ? 'ana' : 'bob', { t: 'pick', z: s.q.answer }, t + 1000)
    t += 1000 + REVEAL_MS
    s = tick(s, t, next)
  }
  assert.equal(s.phase, 'over')
  assert.equal(s.winner, 'ana') // three of five
})

test('watchers: a free seat is taken at once; else they wait in line', () => {
  let s = newDuel('ana', 'explorer', 0)
  s = act(s, 'bob', { t: 'line' }, 10)
  assert.deepEqual(s.seats, ['ana', 'bob'])
  s = act(s, 'cid', { t: 'line' }, 20)
  assert.deepEqual(s.line, ['cid'])
  s = act(s, 'cid', { t: 'unline' }, 30)
  assert.deepEqual(s.line, [])
})

test('a seated player gives their seat to the first in line, and waits in line themselves', () => {
  let s = started()
  s = act(s, 'cid', { t: 'line' }, 10)
  s = act(s, 'bob', { t: 'give' }, 20)
  assert.deepEqual(s.seats, ['ana', 'cid'])
  assert.deepEqual(s.line, ['bob'])
})

test('a watcher asks to swap: the seated one says yes or no', () => {
  let s = started()
  s = act(s, 'cid', { t: 'ask', seat: 1 }, 10)
  assert.deepEqual(s.ask, { from: 'cid', seat: 1 })
  assert.equal(act(s, 'ana', { t: 'answer', yes: true }, 20), s, 'only the one asked answers')
  const no = act(s, 'bob', { t: 'answer', yes: false }, 20)
  assert.deepEqual(no.seats, ['ana', 'bob'])
  assert.equal(no.ask, null)
  const yes = act(s, 'bob', { t: 'answer', yes: true }, 20)
  assert.deepEqual(yes.seats, ['ana', 'cid'])
  assert.deepEqual(yes.line, ['bob'])
})

test('play again: the winner stays, the other gives their seat to the first in line', () => {
  let s = started()
  s = act(s, 'cid', { t: 'line' }, 10)
  s = { ...s, phase: 'over', winner: 'bob', scores: { ana: 3, bob: 9 } }
  s = again(s, 50)
  assert.deepEqual(s.seats, ['cid', 'bob'])
  assert.deepEqual(s.line, ['ana'])
  assert.equal(s.phase, 'waiting')
  assert.equal(s.until, 50 + START_MS)
})

test('someone leaves the room: their seat goes to the next in line', () => {
  let s = started()
  s = act(s, 'cid', { t: 'line' }, 10)
  s = present(s, ['ana', 'cid'])
  assert.deepEqual(s.seats, ['ana', 'cid'])
  assert.deepEqual(s.line, [])
  s = present(s, ['ana'])
  assert.deepEqual(s.seats, ['ana', null])
  // the question waits for a second player
  assert.equal(tick(s, s.since + CLUE_MS * 3, next), s)
})
