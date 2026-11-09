import { test } from 'node:test'
import assert from 'node:assert/strict'
import { planDish, grown, remaining, cleanDish, FINDS, HOPPER } from './plan.js'
import { COMPOUNDS } from './lattice.js'

test('a dish plan is the same from the same compound, speed and seed', () => {
  assert.deepEqual(planDish('NaCl', 0.8, 1234), planDish('NaCl', 0.8, 1234))
  assert.notDeepEqual(planDish('NaCl', 0.8, 1234), planDish('NaCl', 0.8, 1235))
})

test('slow: one crystal on the thread, a perfect cube; fast: a hopper and more crystals', () => {
  for (const c of COMPOUNDS) {
    const slow = planDish(c.id, 0.1, 7)
    assert.equal(slow.crystals.length, 1, c.id)
    assert.equal(slow.crystals[0].mode, 'thread')
    assert.equal(slow.habit, 'perfect')
    assert.equal(slow.crystals[0].grow.hollow, 0)
    const fast = planDish(c.id, 0.95, 7)
    assert.equal(fast.habit, 'hopper', c.id)
    assert.ok(fast.crystals[0].grow.hollow >= HOPPER)
    assert.ok(fast.crystals.length >= 2, c.id)
    // brine grows boats at its surface; a melt grows small crystals on the floor
    for (const k of fast.crystals.slice(1)) assert.equal(k.mode, c.medium === 'water' ? 'boat' : 'floor', c.id)
    // faster is quicker
    assert.ok(fast.end < slow.end)
  }
  assert.equal(planDish('NaCl', 0.5, 3).habit, 'between')
})

test('the crystals lie inside the dish and start after the water has begun to dry', () => {
  for (const s of [0.4, 0.7, 1]) {
    for (const seed of [1, 2, 3, 99]) {
      const p = planDish('NaCl', s, seed)
      for (const c of p.crystals) {
        assert.ok(Math.hypot(...c.at) <= 0.8, `${s} ${seed}`)
        assert.ok(c.start > 0.5 && c.dur > 4)
      }
    }
  }
})

test('growth goes from 0 to 1 and never back; the liquid only goes down', () => {
  const p = planDish('KCl', 0.6, 5)
  for (const c of p.crystals) {
    let last = -1
    for (let t = 0; t <= p.end + 2; t += 0.25) {
      const g = grown(c, t)
      assert.ok(g >= last && g >= 0 && g <= 1)
      last = g
    }
    assert.equal(grown(c, c.start), 0)
    assert.equal(grown(c, c.start + c.dur), 1)
  }
  assert.equal(remaining(p, 0), 1)
  assert.equal(remaining(p, p.end), 0)
  assert.ok(remaining(p, p.end / 2) > 0.4 && remaining(p, p.end / 2) < 0.6)
})

test('a dish from another device is checked before it is used', () => {
  assert.equal(cleanDish(null), null)
  assert.equal(cleanDish({ c: 'Xx', s: 0.5, seed: 1 }), null)
  assert.equal(cleanDish({ c: 'NaCl', s: 'fast', seed: 1 }), null)
  assert.equal(cleanDish({ c: 'NaCl', s: 0.5, seed: 1, age: -3 }), null)
  assert.deepEqual(cleanDish({ c: 'MgO', s: 7, seed: -12.7, age: 3.5, by: 'ana' }), { c: 'MgO', s: 1, seed: 12, age: 3.5, by: 'ana' })
  assert.deepEqual(cleanDish({ c: 'NaCl', s: 0.123, seed: 5 }), { c: 'NaCl', s: 0.12, seed: 5, age: null, by: null })
})

test('the discoveries: the moments and every compound', () => {
  for (const f of ['neighbours', 'perfect', 'hopper', 'grain']) assert.ok(FINDS.includes(f))
  for (const c of COMPOUNDS) assert.ok(FINDS.includes(c.id))
  assert.equal(new Set(FINDS).size, FINDS.length)
})
