import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fresh, atomOf, bump, rebase, merge, covers, changes, clean, canon, raw, untouched } from './together.js'

// a few presses by one player, one after the other
const press = (s, who, list, at = 1000) => list.reduce((x, [k, sign]) => bump(x, who, k, sign, at), s)

test('the first presses in a fresh room count on the world as built: two at once both count', () => {
  const ana = press(fresh(), 'ana', [['p', 1], ['p', 1], ['p', 1]], 5000)
  const dad = press(fresh(), 'dad', [['n', 1], ['n', 1], ['n', 1]], 5001)
  assert.equal(ana.k, 0)
  assert.deepEqual(atomOf(merge(ana, dad)), { Z: 3, N: 3, E: 0 })
  assert.deepEqual(canon(merge(ana, dad)), canon(merge(dad, ana)))
  // the world as built, untouched, is told apart (it replaces: a room joined or left)
  assert.equal(untouched(fresh()), true)
  assert.equal(untouched(ana), false)
})

test('two players adding at the same moment both count, in whatever order the copies arrive', () => {
  const start = rebase(fresh(), 'ana', { Z: 1, N: 0, E: 1 }, { t: 'set' }, null, 100)
  const ana = press(start, 'ana', [['p', 1], ['p', 1]])
  const dad = press(start, 'dad', [['n', 1], ['n', 1], ['e', 1]])
  const one = merge(ana, dad)
  const two = merge(dad, ana)
  assert.deepEqual(atomOf(one), { Z: 3, N: 2, E: 2 })
  assert.deepEqual(canon(one), canon(two))
  // taking a copy twice changes nothing
  assert.deepEqual(canon(merge(one, dad)), canon(one))
  assert.deepEqual(canon(merge(one, one)), canon(one))
})

test('covers says who has something the other lacks (so they tell)', () => {
  const start = rebase(fresh(), 'ana', { Z: 2, N: 2, E: 2 }, { t: 'set' }, null, 100)
  const ana = bump(start, 'ana', 'p', 1)
  const dad = bump(start, 'dad', 'n', 1)
  const both = merge(ana, dad)
  assert.equal(covers(ana, dad), false)
  assert.equal(covers(both, ana), true)
  assert.equal(covers(both, dad), true)
  assert.equal(covers(dad, both), false)
  // an older base has nothing to tell a newer one
  const later = rebase(both, 'dad', { Z: 0, N: 0, E: 0 }, { t: 'set' }, null, 200)
  assert.equal(covers(later, both), true)
  assert.equal(covers(both, later), false)
})

test('a later base wins over counts on an older one (a decay while someone was adding)', () => {
  const start = rebase(fresh(), 'ana', { Z: 6, N: 8, E: 6 }, { t: 'set' }, null, 100)
  const adding = bump(start, 'dad', 'n', 1)
  const decayed = rebase(start, 'ana', { Z: 7, N: 7, E: 6 }, { t: 'decay', f: [6, 8, 6] }, null, 200)
  assert.deepEqual(atomOf(merge(adding, decayed)), { Z: 7, N: 7, E: 6 })
  assert.deepEqual(atomOf(merge(decayed, adding)), { Z: 7, N: 7, E: 6 })
  // two bases at the same moment: the same one wins for everyone
  const other = rebase(start, 'bob', { Z: 1, N: 0, E: 1 }, { t: 'set' }, null, 200)
  assert.deepEqual(canon(merge(decayed, other)), canon(merge(other, decayed)))
})

test('a new base is always later than the one it replaces, even when the clock is behind', () => {
  const s = rebase(fresh(), 'ana', { Z: 1, N: 0, E: 1 }, null, null, 9000)
  const next = rebase(s, 'ana', { Z: 2, N: 2, E: 2 }, null, null, 10)
  assert.equal(next.k, 9001)
})

test('counts that went past what can be fold first, so the next press shows', () => {
  const start = rebase(fresh(), 'ana', { Z: 1, N: 0, E: 1 }, { t: 'set' }, null, 100)
  // both took the last proton away at once
  const both = merge(bump(start, 'ana', 'p', -1), bump(start, 'dad', 'p', -1))
  assert.deepEqual(raw(both), [-1, 0, 1])
  assert.deepEqual(atomOf(both), { Z: 0, N: 0, E: 0 })
  const again = bump(both, 'ana', 'p', 1, 300)
  assert.equal(again.ev.t, 'fold')
  assert.deepEqual(atomOf(again), { Z: 1, N: 0, E: 0 })
})

test('the electrons are kept to what can be: none without protons, at most three extra', () => {
  let s = rebase(fresh(), 'ana', { Z: 1, N: 0, E: 1 }, null, null, 100)
  s = press(s, 'ana', [['e', 1], ['e', 1], ['e', 1], ['e', 1], ['e', 1]])
  assert.equal(atomOf(s).E, 4)
  assert.deepEqual(atomOf(bump(s, 'ana', 'p', -1)), { Z: 0, N: 0, E: 0 })
})

test('changes tell who added and took away what, or the new base', () => {
  const start = rebase(fresh(), 'ana', { Z: 2, N: 2, E: 2 }, { t: 'set' }, null, 100)
  const after = merge(press(start, 'ana', [['p', 1], ['p', 1], ['e', -1]]), bump(start, 'dad', 'n', 1))
  const c = changes(start, after)
  assert.equal(c.rebased, false)
  assert.deepEqual(c.list.sort((a, b) => (a.by + a.k).localeCompare(b.by + b.k)), [
    { by: 'ana', k: 'e', n: -1 },
    { by: 'ana', k: 'p', n: 2 },
    { by: 'dad', k: 'n', n: 1 },
  ])
  const fired = rebase(after, 'dad', { Z: 8, N: 9, E: 6 }, { t: 'fire', f: [7, 7, 6], beam: 'a' }, null, 300)
  assert.deepEqual(changes(after, fired), { rebased: true, by: 'dad', ev: { t: 'fire', f: [7, 7, 6], beam: 'a' } })
})

test('a copy from the network is checked', () => {
  assert.equal(clean(null), null)
  assert.equal(clean({ b: [1, 2] }), null)
  const s = clean({ k: '12', by: 7, b: [500, -3, 2.4], d: { ana: [1, 0, 0, 0, 0, 0], bad: [1, 2], x: 'no' }, ev: { t: 'boom' }, o: [92, 146] })
  assert.deepEqual(s, { k: 12, by: '7', b: [118, 0, 2], d: { ana: [1, 0, 0, 0, 0, 0] }, ev: null, o: [92, 146] })
  const ok = rebase(fresh(), 'ana', { Z: 7, N: 7, E: 7 }, { t: 'fire', f: [7, 7, 7], beam: 'a' }, [92, 146], 100)
  assert.deepEqual(clean(JSON.parse(JSON.stringify(ok))), ok)
})
