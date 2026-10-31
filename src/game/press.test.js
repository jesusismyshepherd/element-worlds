// The diamond press for two (src/game/press.js): the science (the graphite-diamond line, the window),
// the pump and its safety valve, the heater, the jobs when two are at the press, the end of a run.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { newRun, act, tick, present, may, holder, zone, lineP, growth, done, left, mm, RUN_MS, VALVE, AFTER_VALVE, T_MELT } from './press.js'

test('the graphite-diamond line and the window', () => {
  // Kennedy & Kennedy (1976): 5.69 GPa at 1500 °C, as the gallery's panel says (about 5.7 GPa)
  assert.ok(Math.abs(lineP(1500) - 5.69) < 0.01)
  assert.equal(zone(7, 1200), 'cold')
  assert.equal(zone(5, 1450), 'graphite')
  assert.equal(zone(6.5, 1450), 'grow')
  assert.equal(zone(7, 1650), 'hot')
  assert.ok(growth(6.5, 1450) > 0 && growth(5, 1450) < 0 && growth(7, 1200) === 0)
  assert.ok(growth(7, 1450) > growth(5.8, 1450), 'faster well above the line')
})

test('the pump raises the pressure, the seals let it down, too much opens the valve', () => {
  let s = newRun('a', ['a'], 0)
  s = act(s, 'a', { t: 'pump' }, 0)
  assert.ok(s.P > 0.4 && s.pumps === 1)
  const before = s.P
  s = tick(s, 5000)
  assert.ok(s.P < before, 'it leaks')
  s = { ...s, P: VALVE - 0.05 }
  s = act(s, 'a', { t: 'pump' }, 5000)
  assert.equal(s.P, AFTER_VALVE)
  assert.equal(s.valve, 1)
})

test('the capsule follows the heater slowly, and a diamond grows only in the window', () => {
  let s = newRun('a', ['a'], 0)
  s = act(s, 'a', { t: 'heat', p: 0.8 }, 0)
  s = tick(s, 1000)
  assert.ok(s.T > 200 && s.T < 1200, `after 1 s: ${s.T}`)
  s = tick(s, 15000)
  assert.ok(s.T > T_MELT, 'hot after 15 s')
  assert.equal(s.ct, 0, 'no pressure, no diamond')
  // keep the pressure up: about two strokes a second
  for (let t = 15000; t < 40000; t += 500) {
    s = act(s, 'a', { t: 'pump' }, t)
    s = tick(s, t + 250)
  }
  assert.ok(s.ct > 0.3, `a diamond: ${s.ct}`)
  // the pressure lost while it is hot: it turns back into graphite
  const grown = s.ct
  s = tick({ ...s, P: 4.5 }, 41500)
  assert.ok(s.ct < grown)
})

test('the run ends after its time with the diamond there is', () => {
  let s = newRun('a', ['a'], 1000)
  assert.equal(left(s, 1000), RUN_MS / 1000)
  s = { ...s, ct: 0.4237 }
  s = tick(s, 1000 + RUN_MS + 50)
  assert.ok(done(s))
  assert.equal(s.ct0, Math.round(s.ct * 100) / 100)
  assert.equal(act(s, 'a', { t: 'pump' }, 1000 + RUN_MS + 100), s, 'nothing after the end')
  assert.ok(Math.abs(mm(1) - 6.5) < 1e-9)
})

test('alone you work both; together each keeps the job they took', () => {
  let solo = newRun('a', ['a'], 0)
  assert.ok(may(solo, 'a', 'pump') && may(solo, 'a', 'heat'))
  let s = newRun('a', ['a', 'b'], 0)
  s = act(s, 'a', { t: 'pump' }, 10)
  assert.equal(s.roles.pump, 'a')
  // a has the pump: the heater is for someone else
  assert.equal(act(s, 'a', { t: 'heat', p: 0.5 }, 20), s)
  assert.ok(!may(s, 'a', 'heat'))
  s = act(s, 'b', { t: 'heat', p: 0.6 }, 30)
  assert.equal(s.roles.heat, 'b')
  assert.deepEqual(s.doers, ['a', 'b'], 'the diamond is theirs')
  assert.equal(s.power, 0.6)
  assert.equal(act(s, 'b', { t: 'pump' }, 40), s, 'b has the heater: the pump is a\'s')
  assert.equal(holder(s, 'b', 'pump'), 'a')
  // b leaves: a is alone and may work both again
  s = present(s, ['a'])
  assert.deepEqual(s.players, ['a'])
  assert.equal(s.roles.heat, null)
  assert.ok(may(s, 'a', 'heat'))
  // someone new comes to the press during a run
  s = present(s, ['a', 'c'])
  assert.deepEqual(s.players, ['a', 'c'])
  assert.ok(may(s, 'c', 'heat') && !may(s, 'c', 'pump'))
})
