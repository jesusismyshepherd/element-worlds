import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SharedWorld, newer, PUT_MS } from './shared.js'

// Fake players on one bus: broadcasts reach everyone else in the room (as the realtime channel does with
// self: false) when the test delivers them; timers run when the test says; the rooms' store keeps the
// higher (v, by) as ew_room_world_put does; each player has their own saved worlds.
function bus() {
  const players = []
  const queue = []
  const db = new Map() // `${code} ${path} ${part}` -> { v, by, s, at }
  let timers = []
  let clock = 1000000
  const store = {
    load: async (code, path) => [...db.entries()].filter(([k]) => k.startsWith(`${code} ${path} `)).map(([k, r]) => ({ part: k.split(' ')[2], v: r.v, by: r.by, s: r.s, ago: (clock - r.at) / 1000 })),
    put: async (code, path, part, v, by, s) => {
      const k = `${code} ${path} ${part}`
      if (newer({ v, by }, db.get(k))) db.set(k, { v, by, s, at: clock })
    },
  }
  const add = id => {
    const listeners = new Map()
    const saved = new Map()
    const r = {
      active: false,
      code: null,
      status: 'off',
      me: { id },
      path: null,
      others: () => players.filter(p => p.room !== r && p.room.active && p.room.code === r.code).map(p => ({ id: p.room.me.id, path: p.room.path })),
      on: (e, fn) => (listeners.get(e) ?? listeners.set(e, []).get(e)).push(fn),
      emit: (e, p) => (listeners.get(e) ?? []).forEach(fn => fn(p)),
      send: (event, payload) => r.active && queue.push({ code: r.code, from: r, event, payload: { ...payload, from: id } }),
    }
    const wait = (ms, fn) => {
      const t = { at: clock + ms, fn }
      timers.push(t)
      return t
    }
    const cancel = t => (timers = timers.filter(x => x !== t))
    const own = { load: path => saved.get(path) ?? null, keep: (path, parts) => saved.set(path, { at: clock, parts }) }
    const sw = new SharedWorld(r, { wait, cancel, store, own, now: () => clock })
    const lives = []
    sw.onLive = (part, from) => lives.push([part, from])
    const player = { room: r, sw, saved, lives }
    players.push(player)
    return player
  }
  // let promises settle, then deliver the broadcasts
  const flush = async () => {
    for (let i = 0; i < 5; i++) {
      await new Promise(res => setImmediate(res))
      while (queue.length) {
        const { code, from, event, payload } = queue.shift()
        for (const p of players) if (p.room !== from && p.room.active && p.room.code === code) p.room.emit(event, payload)
      }
    }
  }
  const tick = async ms => {
    clock += ms
    for (const t of timers.filter(t => t.at <= clock)) {
      timers = timers.filter(x => x !== t)
      t.fn()
    }
    await flush()
  }
  const join = async (player, code) => {
    Object.assign(player.room, { active: true, code, status: 'on' })
    for (const p of players) p.room.emit('members')
    await flush()
  }
  const quit = async player => {
    Object.assign(player.room, { active: false, code: null, status: 'off' })
    for (const p of players) p.room.emit('members')
    await flush()
  }
  return { add, flush, tick, join, quit, db }
}

// a world with balloons that fly (their age runs on) and a word on the wall
function world() {
  const log = []
  const w = { free: false, age: 0, word: 'NEON' }
  w.shared = {
    balloons: {
      get: () => ({ free: w.free, age: w.age }),
      set: (s, live, ago) => {
        w.free = s.free
        w.age = s.free ? s.age + ago : 0
        log.push(['balloons', s.free, live])
      },
    },
    name: { get: () => ({ text: w.word }), set: (s, live) => { w.word = s.text; log.push(['name', s.text, live]) } },
  }
  return { w, log }
}

const enter = async (b, player, path, made = world()) => {
  player.room.path = path
  player.sw.enter(made.w, path)
  player.room.emit('members')
  await b.flush()
  return made
}
const meetAll = async (b, players) => {
  for (const p of players) p.room.emit('members')
  await b.flush()
}

test('(v, by) decides, the same for everyone', () => {
  assert.ok(newer({ v: 2, by: 'a' }, { v: 1, by: 'z' }))
  assert.ok(newer({ v: 1, by: 'b' }, { v: 1, by: 'a' }))
  assert.ok(!newer({ v: 1, by: 'a' }, { v: 1, by: 'a' }))
  assert.ok(newer({ v: 1, by: 'a' }, { v: 0, by: '' }))
  assert.ok(newer({ v: 0, by: 'a' }, undefined))
})

test('a change is played live for everyone in the same world of the room, not in another', async () => {
  const b = bus()
  const [ana, bob, eve] = ['ana', 'bob', 'eve'].map(b.add)
  for (const p of [ana, bob, eve]) await b.join(p, 'ABCD')
  const A = await enter(b, ana, '/e/Ne/signs')
  const B = await enter(b, bob, '/e/Ne/signs')
  const E = await enter(b, eve, '/e/He/signs')
  A.w.free = true
  ana.sw.changed('balloons')
  await b.flush()
  assert.equal(B.w.free, true)
  assert.deepEqual(B.log.at(-1), ['balloons', true, true])
  assert.deepEqual(bob.lives.at(-1), ['balloons', 'ana'])
  assert.equal(E.w.free, false, 'helium’s workshop is another world')
})

test('a newcomer takes the world as it stands from those there, without playing it', async () => {
  const b = bus()
  const [ana, bob] = ['ana', 'bob'].map(b.add)
  await b.join(ana, 'ABCD')
  await b.join(bob, 'ABCD')
  const A = await enter(b, ana, '/e/Ne/signs')
  A.w.free = true
  A.w.word = 'ARTUR'
  ana.sw.changed('balloons')
  ana.sw.changed('name')
  await b.flush()
  // before the store has it (no tick yet): Ana, who is there, tells Bob when she sees him come in
  const B = await enter(b, bob, '/e/Ne/signs')
  await meetAll(b, [ana])
  assert.equal(B.w.free, true)
  assert.equal(B.w.word, 'ARTUR')
  assert.ok(B.log.every(([, , live]) => live === false))
})

test('the room keeps its world while nobody is in it, the time gone by handed on', async () => {
  const b = bus()
  const [ana, bob] = ['ana', 'bob'].map(b.add)
  await b.join(ana, 'ABCD')
  const A = await enter(b, ana, '/e/Ne/signs')
  A.w.free = true
  A.w.word = 'ARTUR'
  ana.sw.changed('balloons')
  ana.sw.changed('name')
  await b.tick(PUT_MS)
  // Ana goes to the hall: nobody is in the workshop now
  await enter(b, ana, '/e/Ne')
  await b.tick(60000)
  await b.join(bob, 'ABCD')
  const B = await enter(b, bob, '/e/Ne/signs')
  assert.equal(B.w.word, 'ARTUR')
  assert.equal(B.w.free, true)
  assert.ok(B.w.age >= 60, `the balloons have flown on: ${B.w.age}`)
})

test("a room's world starts as built, not from anyone's own; my own comes back when I leave the room", async () => {
  const b = bus()
  const ana = b.add('ana')
  // alone, Ana writes her word: it is kept as her own
  const A = await enter(b, ana, '/e/Ne/signs')
  A.w.word = 'ANA'
  ana.sw.changed('name')
  assert.equal(ana.saved.get('/e/Ne/signs').parts.name.text, 'ANA')
  // she joins a room while there: the room's workshop is fresh
  await b.join(ana, 'WXYZ')
  assert.equal(A.w.word, 'NEON')
  A.w.word = 'ROOM'
  ana.sw.changed('name')
  await b.tick(PUT_MS)
  assert.equal(ana.saved.get('/e/Ne/signs').parts.name.text, 'ANA', 'the room’s word is not saved as hers')
  // she leaves the room: her own word is back
  await b.quit(ana)
  assert.equal(A.w.word, 'ANA')
  // and the room still has its own for the next time
  await b.join(ana, 'WXYZ')
  await b.flush()
  assert.equal(A.w.word, 'ROOM')
})

test('alone, my own world is kept and found again on the next visit, run on by the time away', async () => {
  const b = bus()
  const ana = b.add('ana')
  const A = await enter(b, ana, '/e/Ne/signs')
  A.w.free = true
  ana.sw.changed('balloons')
  await enter(b, ana, '/e/Ne')
  await b.tick(30000)
  const A2 = await enter(b, ana, '/e/Ne/signs')
  assert.equal(A2.w.free, true)
  assert.ok(A2.w.age >= 30)
  assert.ok(A2.log.every(([, , live]) => live === false))
})

test('a change made before the store answered wins over what it holds', async () => {
  const b = bus()
  const [ana, bob] = ['ana', 'bob'].map(b.add)
  await b.join(ana, 'ABCD')
  const A = await enter(b, ana, '/e/Ne/signs')
  A.w.word = 'OLD'
  ana.sw.changed('name')
  await b.tick(PUT_MS)
  await enter(b, ana, '/')
  await b.join(bob, 'ABCD')
  const B = world()
  bob.room.path = '/e/Ne/signs'
  bob.sw.enter(B.w, '/e/Ne/signs')
  B.w.word = 'NEW'
  bob.sw.changed('name')
  await b.flush()
  await b.tick(PUT_MS)
  assert.equal(B.w.word, 'NEW')
  assert.equal(b.db.get('ABCD /e/Ne/signs name').s.text, 'NEW')
})

test('a world that shares nothing keeps and sends nothing', async () => {
  const b = bus()
  const bob = b.add('bob')
  await b.join(bob, 'ABCD')
  bob.sw.enter({ root: null }, '/lab')
  assert.equal(bob.sw.mode, null)
  bob.sw.enter({ shared: {} }, '/e/Fe')
  assert.equal(bob.sw.mode, null)
})
