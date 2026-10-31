import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { newRace, act, tick, present, standings, READY_MS, RACE_MS, OVER_MS, MOST } from './race.js'
import { GOALS, RACES, progress } from '../worlds/forge/goals.js'
import { MISSIONS } from '../worlds/forge/words.js'
import { useChart, nuclide, decay, chain, collide } from '../chem/nucleus.js'

useChart(JSON.parse(readFileSync(new URL('../data/nuclides.json', import.meta.url), 'utf8')))

const started = () => {
  let s = newRace('ana', 'C12', ['ana', 'dad', 'bob'], 0)
  s = tick(s, READY_MS)
  assert.equal(s.phase, 'racing')
  return s
}

test('a race: the countdown, everyone there racing, the first one done wins', () => {
  let s = newRace('ana', 'C12', ['dad', 'ana'], 0)
  assert.deepEqual(s.order, ['ana', 'dad'])
  assert.equal(tick(s, READY_MS - 1), s)
  // someone who arrives during the countdown joins; one who would rather watch steps out
  s = act(s, 'bob', { t: 'join' }, 100)
  s = act(s, 'dad', { t: 'leave' }, 200)
  assert.deepEqual(s.order, ['ana', 'bob'])
  s = tick(s, READY_MS)
  assert.equal(s.phase, 'racing')
  assert.equal(s.start, READY_MS)
  // too late to join now
  assert.equal(act(s, 'dad', { t: 'join' }, READY_MS + 10), s)
  s = act(s, 'bob', { t: 'at', a: [6, 4, 0], p: 0.6 }, READY_MS + 1000)
  assert.deepEqual(s.at.bob, { a: [6, 4, 0], o: null, p: 0.6 })
  // a watcher cannot tell progress
  assert.equal(act(s, 'dad', { t: 'at', a: [1, 1, 1], p: 1 }, READY_MS + 1000), s)
  s = act(s, 'ana', { t: 'done', a: [6, 6, 6] }, READY_MS + 30000)
  assert.equal(s.phase, 'over')
  assert.equal(s.winner, 'ana')
  assert.equal(s.time, 30000)
  // the second one done is too late
  assert.equal(act(s, 'bob', { t: 'done' }, READY_MS + 30500).winner, 'ana')
  assert.deepEqual(standings(s), ['ana', 'bob'])
  s = tick(s, READY_MS + 30000 + OVER_MS)
  assert.equal(s.phase, 'done')
})

test('time up: nobody wins; the race can be run again with the same racers', () => {
  let s = started()
  s = tick(s, READY_MS + RACE_MS)
  assert.equal(s.phase, 'over')
  assert.equal(s.winner, null)
  const again = act(s, 'dad', { t: 'again' }, 900000)
  assert.equal(again.phase, 'ready')
  assert.notEqual(again.id, s.id)
  assert.deepEqual(again.order, s.order)
  assert.equal(again.at.ana.p, 0)
  // someone who only watched and asks for another one is in it
  const s2 = act(s, 'cid', { t: 'again' }, 900000)
  assert.ok(s2.order.includes('cid'))
})

test('racers who leave are out; nobody left, the race ends', () => {
  let s = started()
  s = present(s, ['ana', 'bob'])
  assert.deepEqual(s.order, ['ana', 'bob'])
  assert.equal(s.at.dad, undefined)
  s = act(s, 'ana', { t: 'leave' }, 9000)
  s = act(s, 'bob', { t: 'leave' }, 9100)
  assert.equal(s.phase, 'done')
  // the same people: nothing changes
  const t = started()
  assert.equal(present(t, ['ana', 'dad', 'bob', 'cid']), t)
  // anyone can stop it
  assert.equal(act(t, 'cid', { t: 'stop' }, 1).phase, 'done')
})

test('at most eight race', () => {
  let s = newRace('a', 'H', ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], 0)
  assert.equal(s.order.length, MOST)
  assert.equal(act(s, 'z', { t: 'join' }, 1), s)
})

test('progress: from nothing to the atom, then what to do with it', () => {
  assert.deepEqual(progress('C12', { a: [0, 0, 0] }), { need: { p: 6, n: 6, e: 6 }, built: false, then: null, hold: false, p: 0 })
  const half = progress('C12', { a: [6, 3, 0] })
  assert.equal(half.p, 0.5)
  assert.deepEqual(half.need, { p: 0, n: 3, e: 6 })
  assert.equal(progress('C12', { a: [6, 6, 6] }).built, true)
  assert.equal(progress('C12', { a: [6, 6, 6] }).p, 1)
  // too many counts against you
  assert.ok(progress('H', { a: [3, 0, 1] }).p < progress('H', { a: [1, 0, 0] }).p)
  // the charge does not matter where the mission does not ask
  assert.equal(progress('C14', { a: [6, 8, 0] }).built, true)
  assert.equal(progress('C14', { a: [6, 8, 0] }).then, 'decay')
  assert.ok(progress('C14', { a: [6, 8, 0] }).p < 1)
  // either chlorine isotope
  assert.equal(progress('Cl-', { a: [17, 20, 18] }).built, true)
  assert.equal(progress('Cl-', { a: [17, 19, 18] }).need.n, -1)
  // the uranium chain: building is the first half, the decays the second
  assert.equal(progress('U238', { a: [92, 146, 92] }).p, 0.5)
  const down = progress('U238', { a: [88, 138, 90], o: [92, 146] })
  assert.equal(down.built, true)
  assert.equal(down.p, 0.688) // radium-226: 12 of the 32 nucleons gone
  assert.equal(progress('U238', { a: [82, 124, 92], o: [92, 146], done: true }).p, 1)
  assert.equal(progress('nothing', { a: [1, 1, 1] }).p, 0)
})

test('every race goal can be done: the atom passes its mission, or the decay or the beam does', () => {
  assert.equal(RACES.length, MISSIONS.length - 1)
  for (const m of RACES) {
    const g = GOALS[m.id]
    const N = [].concat(g.N)[0]
    const E = g.E ?? g.Z
    const s = { Z: g.Z, N, E, nuc: nuclide(g.Z, N) }
    if (!g.then) {
      assert.ok(m.check(s, null), `${m.id}: the goal's atom does not pass`)
      continue
    }
    let ev
    if (g.then === 'decay') {
      const d = decay(g.Z, N)
      ev = { mode: d.mode, from: { Z: g.Z, N }, to: { Z: d.Z, N: d.N }, origin: { Z: g.Z, N } }
    } else if (g.then === 'chain') {
      const steps = chain(g.Z, N)
      const last = steps.at(-1)
      ev = { mode: last.mode, from: { Z: 0, N: 0 }, to: { Z: last.Z, N: last.N }, origin: { Z: g.Z, N } }
    } else {
      const c = collide(g.Z, N, g.then)
      ev = { mode: c.famous ? 'reaction' : 'fusion', from: { Z: g.Z, N }, to: c.result, famous: c.famous, beam: g.then }
    }
    const after = { Z: ev.to.Z, N: ev.to.N, E, nuc: nuclide(ev.to.Z, ev.to.N) }
    assert.ok(m.check(after, ev), `${m.id}: ${g.then} does not finish it`)
  }
})
