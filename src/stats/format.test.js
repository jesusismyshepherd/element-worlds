import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dur, durShort, plural, times, list, pct, niceCeil, niceDuration, whenFrom, clock, startOfDay } from './format.js'
import { placeName, panelName, setBoardTitles, nuclideName, missionName, whereName, WING_PLACES } from './names.js'

test('durations in words', () => {
  assert.equal(dur(0), '0 s')
  assert.equal(dur(-5), '0 s')
  assert.equal(dur('x'), '0 s')
  assert.equal(dur(45000), '45 s')
  assert.equal(dur(200000), '3 min 20 s')
  assert.equal(dur(180000), '3 min')
  assert.equal(dur(744000), '12 min')
  assert.equal(dur(3900000), '1 h 5 min')
  assert.equal(dur(7200000), '2 h')
  assert.equal(durShort(40000), '40 s')
  assert.equal(durShort(720000), '12 min')
  assert.equal(durShort(5400000), '1.5 h')
})

test('counts and lists', () => {
  assert.equal(plural(1, 'visit'), '1 visit')
  assert.equal(plural(2, 'entry', 'entries'), '2 entries')
  assert.equal(times(1), 'once')
  assert.equal(times(2), 'twice')
  assert.equal(times(5), '5 times')
  assert.equal(list(['a']), 'a')
  assert.equal(list(['a', 'b', 'c']), 'a, b and c')
  assert.equal(pct(1, 3), '33%')
  assert.equal(pct(1, 0), '0%')
})

test('round axis tops', () => {
  assert.equal(niceCeil(7), 10)
  assert.equal(niceCeil(23), 25)
  assert.equal(niceCeil(0.3), 0.5)
  assert.equal(niceCeil(0), 1)
  assert.equal(niceDuration(45000), 60000)
  assert.equal(niceDuration(13 * 60000), 15 * 60000)
  assert.equal(niceDuration(0), 10000)
})

test('times of day: the day only when it differs', () => {
  const t = new Date(2026, 9, 29, 10, 42).getTime()
  assert.equal(clock(t), '10:42')
  assert.equal(whenFrom(t, t - 3600000), '10:42')
  assert.match(whenFrom(t, t - 2 * 86400000), /29 Oct, 10:42$/)
  assert.equal(startOfDay(t), new Date(2026, 9, 29).getTime())
})

test('names for places, panels, nuclei and missions', () => {
  assert.equal(placeName('plaza'), 'the plaza')
  assert.equal(placeName('atrium:C'), "Carbon's hall")
  assert.equal(placeName('wing:O:fire'), "Oxygen's wing “Fire”")
  assert.equal(placeName('page:/passport'), 'the passport page')
  assert.equal(placeName('room:9'), 'room:9')
  assert.equal(panelName('facts'), 'the Fact file')
  assert.equal(panelName('isotopes'), '“Isotopes”')
  assert.equal(panelName('board:twins', 'atrium:C'), 'the “twins” board')
  setBoardTitles('C', [{ id: 'twins', title: { en: 'A diamond and a pencil: twins?' } }])
  assert.equal(panelName('board:twins', 'atrium:C'), 'the board “A diamond and a pencil: twins?”')
  assert.equal(panelName('Some title'), '“Some title”')
  assert.equal(whereName('hall', ['atrium:C', 'atrium:O']), '2 halls')
  assert.equal(whereName('wing:signs', ['wing:Ne:signs']), "Neon's wing “The neon sign workshop”")
  assert.equal(nuclideName(6, 6), 'carbon-12')
  assert.equal(nuclideName(0, 1), 'a free neutron')
  assert.equal(missionName('forge:C12'), 'Carbon-12')
  assert.equal(missionName('lab:H2O'), 'lab:H2O')
  assert.ok(WING_PLACES.includes('wing:C:allotropes'))
})
