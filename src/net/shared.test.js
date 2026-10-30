import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SharedWorld, newer, WAIT_MS } from './shared.js'

// A room of fake players on one bus: broadcasts reach everyone else (as the realtime channel does with
// self: false), in order, when the test delivers them; timers run when the test says.
function bus() {
  const players = []
  const queue = []
  let timers = []
  let clock = 0
  const add = (id, path = null) => {
    const listeners = new Map()
    const r = {
      active: true,
      status: 'on',
      me: { id },
      path,
      others: () => players.filter(p => p.room !== r && p.room.active).map(p => ({ id: p.room.me.id, path: p.room.path })),
      on: (e, fn) => (listeners.get(e) ?? listeners.set(e, []).get(e)).push(fn),
      emit: (e, p) => (listeners.get(e) ?? []).forEach(fn => fn(p)),
      send: (event, payload) => queue.push({ to: players.filter(p => p.room !== r), event, payload: { ...payload, from: id } }),
    }
    const wait = (ms, fn) => {
      const t = { at: clock + ms, fn }
      timers.push(t)
      return t
    }
    const cancel = t => (timers = timers.filter(x => x !== t))
    const sw = new SharedWorld(r, { wait, cancel })
    const player = { room: r, sw }
    players.push(player)
    return player
  }
  const flush = () => {
    while (queue.length) {
      const { to, event, payload } = queue.shift()
      for (const p of to) if (p.room.active) p.room.emit(event, payload)
    }
  }
  const tick = ms => {
    clock += ms
    for (const t of timers.filter(t => t.at <= clock)) {
      timers = timers.filter(x => x !== t)
      t.fn()
    }
    flush()
  }
  return { add, flush, tick }
}

// a world with one balloon rack: its state, and what set did (live or not)
function world() {
  const log = []
  const w = { free: false, word: 'NEON' }
  w.shared = {
    balloons: { get: () => ({ free: w.free }), set: (s, live) => { w.free = s.free; log.push(['balloons', s.free, live]) } },
    name: { get: () => ({ text: w.word }), set: (s, live) => { w.word = s.text; log.push(['name', s.text, live]) } },
  }
  return { w, log }
}

const enter = (b, player, path, made = world()) => {
  player.room.path = path
  player.sw.enter(made.w, path)
  b.flush()
  return made
}

test('(v, by) decides, the same for everyone', () => {
  assert.ok(newer({ v: 2, by: 'a' }, { v: 1, by: 'z' }))
  assert.ok(newer({ v: 1, by: 'b' }, { v: 1, by: 'a' }))
  assert.ok(!newer({ v: 1, by: 'a' }, { v: 1, by: 'a' }))
  assert.ok(newer({ v: 0, by: 'a' }, { v: -1, by: '' }))
  assert.ok(newer({ v: 0, by: 'a' }, undefined))
})

test('a change is played live for everyone in the same world, not in another', () => {
  const b = bus()
  const ana = b.add('ana')
  const bob = b.add('bob')
  const eve = b.add('eve')
  const A = enter(b, ana, '/e/Ne/signs')
  b.tick(WAIT_MS)
  const B = enter(b, bob, '/e/Ne/signs')
  b.tick(WAIT_MS)
  const E = enter(b, eve, '/e/He/signs')
  b.tick(WAIT_MS)
  A.w.free = true
  ana.sw.changed('balloons')
  b.flush()
  assert.equal(B.w.free, true)
  assert.deepEqual(B.log.at(-1), ['balloons', true, true])
  assert.equal(E.w.free, false, 'helium’s workshop is another world')
})

test('a newcomer takes the world as it stands, without playing it', () => {
  const b = bus()
  const ana = b.add('ana')
  const bob = b.add('bob')
  const A = enter(b, ana, '/e/Ne/signs')
  b.tick(WAIT_MS)
  A.w.free = true
  A.w.word = 'ARTUR'
  ana.sw.changed('balloons')
  ana.sw.changed('name')
  b.flush()
  // Bob's own saved word would be his; the room's wins
  const B = world()
  B.w.word = 'BOB'
  enter(b, bob, '/e/Ne/signs', B)
  assert.equal(B.w.free, true)
  assert.equal(B.w.word, 'ARTUR')
  assert.ok(B.log.every(([, , live]) => live === false))
  assert.equal(bob.sw.pending, false)
})

test('even untouched things come from those already there (their saved word)', () => {
  const b = bus()
  const ana = b.add('ana')
  const bob = b.add('bob')
  const A = world()
  A.w.word = 'ANA'
  enter(b, ana, '/e/Ne/signs', A)
  b.tick(WAIT_MS)
  const B = world()
  B.w.word = 'BOB'
  enter(b, bob, '/e/Ne/signs', B)
  assert.equal(B.w.word, 'ANA')
  assert.equal(A.w.word, 'ANA')
})

test('two who come in together end with one state', () => {
  const b = bus()
  const ana = b.add('ana')
  const bob = b.add('bob')
  const A = world()
  A.w.word = 'ANA'
  const B = world()
  B.w.word = 'BOB'
  // both arrive before either hears of the other: both ask, nobody answers
  ana.room.path = bob.room.path = '/e/Ne/signs'
  ana.sw.enter(A.w, '/e/Ne/signs')
  bob.sw.enter(B.w, '/e/Ne/signs')
  b.flush()
  b.tick(WAIT_MS)
  assert.equal(A.w.word, B.w.word)
})

test('a change made while still asking wins over the answer', () => {
  const b = bus()
  const ana = b.add('ana')
  const bob = b.add('bob')
  enter(b, ana, '/e/Ne/signs')
  b.tick(WAIT_MS)
  const B = world()
  bob.room.path = '/e/Ne/signs'
  bob.sw.enter(B.w, '/e/Ne/signs')
  // Bob lets the balloons go before Ana's answer arrives
  B.w.free = true
  bob.sw.changed('balloons')
  b.flush()
  b.tick(WAIT_MS)
  assert.equal(B.w.free, true)
})

test('nothing is sent or taken outside a room, or from a world that does not share', () => {
  const b = bus()
  const ana = b.add('ana')
  const bob = b.add('bob')
  ana.room.active = false
  const A = enter(b, ana, '/e/Ne/signs')
  const B = enter(b, bob, '/e/Ne/signs')
  b.tick(WAIT_MS)
  A.w.free = true
  ana.sw.changed('balloons')
  b.flush()
  assert.equal(B.w.free, false)
  bob.sw.leave()
  bob.sw.enter({ root: null }, '/lab')
  assert.equal(bob.sw.started, false)
})

test('a world left and come back to asks again', () => {
  const b = bus()
  const ana = b.add('ana')
  const bob = b.add('bob')
  const A = enter(b, ana, '/e/Ne/signs')
  b.tick(WAIT_MS)
  enter(b, bob, '/e/Ne/signs')
  A.w.free = true
  ana.sw.changed('balloons')
  b.flush()
  // Bob goes to the hall and back: a new world, built from scratch
  enter(b, bob, '/e/Ne')
  const B2 = enter(b, bob, '/e/Ne/signs')
  assert.equal(B2.w.free, true)
})
