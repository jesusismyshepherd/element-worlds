import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, nameOf } from '../data/elements.js'
import { makeQuestion, cluesFor, mask, poolOf, KID_POOL, points, saysSymbol } from './quiz.js'

const content = {}
for (const e of ELEMENTS) content[e.symbol] = (await import(`../content/${e.symbol}.js`)).default

// a seeded random number generator, so the questions are the same every run
const seeded = (s = 1) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646

test('names and symbols are hidden, words that only start like them are not', () => {
  const fe = ELEMENTS.find(e => e.symbol === 'Fe')
  assert.equal(mask('Steel (iron with a little carbon)', fe), 'Steel (??? with a little carbon)')
  assert.equal(mask('Fe2O3 + 3 CO → 2 Fe', fe), '???2O3 + 3 CO → 2 ???')
  assert.equal(mask('O Ferro e a ferrugem', fe), 'O ??? e a ferrugem')
  const c = ELEMENTS.find(e => e.symbol === 'C')
  const k = ELEMENTS.find(e => e.symbol === 'K')
  assert.equal(mask('C + O2 makes CO2 at 700 °C', c), '??? + O2 makes ???O2 at 700 °C')
  assert.equal(mask('KCl melts at 1044 K.', k), '???Cl melts at 1044 K.')
  const o = ELEMENTS.find(e => e.symbol === 'O')
  assert.equal(mask('O meu O2 e o O3.', o), 'O meu ???2 e o ???3.')
  const i = ELEMENTS.find(e => e.symbol === 'I')
  assert.equal(mask('I am in salt as I- ions.', i), 'I am in salt as ???- ions.')
})

test('every question has four different options with the answer among them', () => {
  const rng = seeded(7)
  for (const level of ['explorer', 'scientist']) {
    for (let i = 0; i < 200; i++) {
      const q = makeQuestion(level, rng)
      assert.equal(new Set(q.options).size, 4)
      assert.ok(q.options.includes(q.answer))
      const pool = poolOf(level).map(e => e.z)
      assert.ok(q.options.every(z => pool.includes(z)))
    }
  }
  assert.equal(KID_POOL.length, poolOf('explorer').length)
  assert.ok(poolOf('explorer').every(Boolean))
})

test('every element has at least five clues in both languages, and none says its name', () => {
  for (const el of ELEMENTS) {
    for (const lang of ['pt-pt', 'en']) {
      for (const level of ['explorer', 'scientist']) {
        for (const seed of [0, 1, 2, 3, 5, 8, 13]) {
          const clues = cluesFor({ answer: el.z, seed }, content[el.symbol], lang, level, 'family')
          assert.ok(clues.length >= 5, `${el.symbol} ${lang} ${level}: ${clues.length} clues`)
          for (const c of clues) {
            for (const name of [nameOf(el, 'en'), nameOf(el, 'pt-pt')]) {
              assert.ok(!new RegExp(`(?<![\\p{L}])${name}(?![\\p{L}])`, 'iu').test(c), `${el.symbol} ${lang} ${level}: "${c}"`)
            }
            // (the last clue, the symbol's first letter, is meant to give a one-letter symbol away)
            if (!/symbol starts|símbolo começa/.test(c)) assert.ok(!saysSymbol(c, el), `${el.symbol} symbol in "${c}"`)
            assert.ok(!/undefined|NaN|\bnull\b/.test(c), `${el.symbol}: "${c}"`)
          }
        }
      }
    }
  }
})

test('fewer clues, more points', () => {
  assert.equal(points(1, 7), 7)
  assert.equal(points(7, 7), 1)
  assert.equal(points(9, 7), 1)
})
