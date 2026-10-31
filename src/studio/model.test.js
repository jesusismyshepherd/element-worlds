import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { sections, threadOf, newestFirst, myVerdict, unanswered, problemOf, canVote, whose, millions, dayOf } from './model.js'

// The family studio's logic (src/studio/model.js): the page's sections from the real backlog, and the
// threads from rows shaped as ew_studio_list returns them.
const backlog = JSON.parse(readFileSync(new URL('../../docs/studio/backlog.json', import.meta.url), 'utf8'))

test('the sections come from the backlog: queue order, nothing built among the ideas, newest days first', () => {
  const s = sections(backlog)
  const queued = backlog.next.filter(id => backlog.items.find(i => i.id === id).status === 'next')
  assert.deepEqual(s.next.map(i => i.id), queued)
  assert.deepEqual(s.building.map(i => i.id).sort(), backlog.items.filter(i => i.status === 'building').map(i => i.id).sort())
  const ideas = s.ideas.flatMap(g => g.items)
  assert.ok(ideas.every(i => i.status !== 'built'))
  assert.equal(ideas.length, backlog.items.filter(i => i.status !== 'built').length)
  for (const g of s.ideas) assert.ok(g.items.every(i => i.kind === g.kind.id))
  const days = s.built.map(d => d.date)
  assert.deepEqual(days, [...days].sort().reverse())
  assert.equal(s.built.reduce((n, d) => n + d.entries.length, 0), backlog.built.length)
  assert.equal(s.decisions[0], backlog.decisions[backlog.decisions.length - 1])
  assert.equal(s.waiting, backlog.waiting)
})

test('a building item left out of the queue still shows, and empty parts are fine', () => {
  const b = { items: [{ id: 'a', kind: 'k', status: 'building' }, { id: 'b', kind: 'k', status: 'next' }], next: ['b'], kinds: [{ id: 'k' }] }
  const s = sections(b)
  assert.deepEqual(s.building.map(i => i.id), ['a'])
  assert.deepEqual(s.next.map(i => i.id), ['b'])
  assert.deepEqual(s.built, [])
  assert.equal(s.tokens, 0)
})

const rows = [
  { id: 1, kind: 'idea', item: null, text: 'a world for iron', created_at: '2026-10-31T10:00:00Z', username: 'artur', mine: false },
  { id: 2, kind: 'verdict', item: 'x', value: 'later', text: '', created_at: '2026-10-31T10:01:00Z', username: 'dad', mine: true },
  { id: 3, kind: 'note', item: 'x', text: 'more stars', created_at: '2026-10-31T10:02:00Z', username: 'dad', mine: true, reply: 'Done.', replied_at: '2026-10-31T12:00:00Z' },
  { id: 4, kind: 'verdict', item: 'x', value: 'first', text: '', created_at: '2026-10-31T10:03:00Z', username: 'dad', mine: true },
  { id: 5, kind: 'verdict', item: 'x', value: 'no', text: '', created_at: '2026-10-31T10:04:00Z', username: 'artur', mine: false },
  { id: 6, kind: 'note', item: '', text: 'hello', created_at: '2026-10-31T09:00:00Z', username: 'dad', mine: true },
]

test('threads: by item, oldest first; the studio thread takes ideas and messages', () => {
  assert.deepEqual(threadOf(rows, 'x').map(r => r.id), [2, 3, 4, 5])
  assert.deepEqual(threadOf(rows, null).map(r => r.id), [6, 1])
  assert.deepEqual(threadOf(rows, '').map(r => r.id), [6, 1])
  assert.deepEqual(newestFirst(rows).map(r => r.id), [5, 4, 3, 2, 1, 6])
  assert.deepEqual(threadOf(null, 'x'), [])
})

test("the account's verdict is its own last one; someone else's does not count", () => {
  assert.equal(myVerdict(rows, 'x'), 'first')
  assert.equal(myVerdict(rows, 'y'), null)
  assert.equal(unanswered(rows), 5)
})

test('what a post answered: signed out, the server refusing, a failed call', () => {
  assert.equal(problemOf(null), 'signedOut')
  assert.equal(problemOf({ error: 'slow' }), 'slow')
  assert.equal(problemOf({ error: 'something new' }), 'failed')
  assert.equal(problemOf({ id: 7, kind: 'idea' }), null)
  assert.equal(problemOf({}), 'failed')
})

test('verdicts only where they mean something; whose an idea is', () => {
  assert.ok(canVote({ status: 'next' }) && canVote({ status: 'idea' }) && canVote({ status: 'parked' }))
  assert.ok(!canVote({ status: 'building' }) && !canVote({ status: 'built' }) && !canVote(undefined))
  assert.equal(whose({ from: 'me' }), 'you')
  assert.equal(whose({ from: 'artur' }), 'artur')
})

test('tokens and days in the reader language', () => {
  assert.equal(millions(390e6, 'en'), '390 M')
  assert.equal(millions(35.04e6, 'en'), '35.0 M')
  assert.equal(millions(35.04e6, 'de'), '35,0 M')
  assert.equal(millions(1.234e6, 'pl', 2), '1,23 M')
  assert.match(dayOf('2026-10-31', 'en'), /31/)
  assert.equal(dayOf('not a day', 'en'), 'not a day')
})
