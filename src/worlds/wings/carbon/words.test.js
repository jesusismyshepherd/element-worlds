import { test } from 'node:test'
import assert from 'node:assert/strict'
import { WORDS as ALLOTROPES, wordsFor as allotropesFor } from './allotropes.words.js'
import { WORDS as LIFE, wordsFor as lifeFor } from './life.words.js'

const LANGS = ['en', 'pt-pt', 'pl', 'de']

/** Every leaf of an object as [path, value]; list items keep their index, so lists must match in length. */
function leaves(o, path = '') {
  if (o == null || typeof o !== 'object') return [[path, o]]
  return Object.entries(o).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k))
}
const shape = o => leaves(o).map(([p, v]) => `${p}:${typeof v}${typeof v === 'function' ? `/${v.length}` : ''}`).sort()

/** Arguments to call each function with, as the wing calls it: the carbon-14 line by halving (years
 *  already formatted), fmt with numbers, the sign lines with a twist in degrees and a formatted length;
 *  every other function gets numbers already written in the language's own way (or '?'). */
function samples(path, fn) {
  if (path === 'say.c14') return Array.from({ length: 9 }, (_, h) => [h, '5730', 32])
  if (path === 'fmt') return [[0], [5730], [11460], [45840]]
  if (path.startsWith('signLine.')) return [[0, ''], [0.04, ''], [1.1, '12,8'], [0.7, '20,1'], [5, '2,8']]
  return ['0', '12,8', '?'].map(v => Array(fn.length).fill(v))
}

/** What no text may hold: an em dash, an en dash used as a pause. */
function clean(where, s) {
  assert.ok(!s.includes('\u2014'), `${where} has an em dash`)
  assert.ok(!s.includes(' \u2013 '), `${where} has an en dash used as a pause`)
}

for (const [name, W, wordsFor] of [['allotropes', ALLOTROPES, allotropesFor], ['life', LIFE, lifeFor]]) {
  test(`${name}: four languages, English the fallback`, () => {
    assert.deepEqual(Object.keys(W).sort(), [...LANGS].sort())
    for (const lang of LANGS) assert.equal(wordsFor(lang), W[lang])
    assert.equal(wordsFor('xx'), W.en)
  })

  for (const lang of LANGS.slice(1)) {
    test(`${name}: ${lang} has the shape of English (keys, list lengths, function arity)`, () => {
      assert.deepEqual(shape(W[lang]), shape(W.en))
    })
  }

  test(`${name}: every text non-empty, no em dash`, () => {
    for (const lang of LANGS) {
      for (const [p, v] of leaves(W[lang])) {
        if (typeof v === 'function') continue
        assert.equal(typeof v, 'string', `${lang}.${p}`)
        assert.ok(v.trim().length > 0, `${lang}.${p} is empty`)
        clean(`${lang}.${p}`, v)
      }
    }
  })

  test(`${name}: every function gives a whole string in every language`, () => {
    for (const lang of LANGS) {
      for (const [p, fn] of leaves(W[lang])) {
        if (typeof fn !== 'function') continue
        for (const args of samples(p, fn)) {
          const where = `${lang}.${p}(${args.join(', ')})`
          const out = fn(...args)
          assert.equal(typeof out, 'string', where)
          assert.ok(out.trim().length > 0, `${where} is empty`)
          assert.ok(!out.includes('undefined') && !out.includes('NaN'), `${where}: ${out}`)
          clean(where, out)
        }
      }
    }
  })

  test(`${name}: every panel exists at both depths`, () => {
    for (const lang of LANGS) {
      for (const [id, ex] of Object.entries(W[lang].ex)) {
        if (!ex.panel) continue
        assert.ok(ex.panel.kid?.length > 0, `${lang}.${id}.panel.kid`)
        assert.ok(ex.panel.sci?.length > 0, `${lang}.${id}.panel.sci`)
      }
    }
  })

  test(`${name}: Polish and German write a decimal comma`, () => {
    for (const lang of ['pl', 'de']) {
      assert.equal(W[lang].decimal, ',')
      for (const [p, v] of leaves(W[lang])) {
        if (typeof v === 'string') assert.ok(!/\d\.\d/.test(v), `${lang}.${p}: ${v}`)
        if (typeof v !== 'function') continue
        for (const args of samples(p, v)) {
          const out = v(...args)
          assert.ok(!/\d\.\d/.test(out), `${lang}.${p}(${args.join(', ')}): ${out}`)
        }
      }
    }
  })
}

test('the twist readout: decimal comma in Polish and German, nothing shown when aligned', () => {
  assert.equal(ALLOTROPES.en.signLine.readout(1.1, '12.8'), 'Turned 1.10°\nthe pattern repeats every 12.8 nm')
  assert.ok(ALLOTROPES.pl.signLine.readout(1.1, '12,8').startsWith('Obrót 1,10°\n'))
  assert.ok(ALLOTROPES.de.signLine.readout(2.5, '5,6').startsWith('Gedreht um 2,5°\n'))
  assert.ok(ALLOTROPES.de.signLine.moire(1.1, '12,8').includes('1,1°'))
  for (const lang of LANGS) assert.ok(!ALLOTROPES[lang].signLine.readout(0.01, '').includes('nm'), lang)
})

test('carbon-14: Polish and German verbs agree with the number of atoms left', () => {
  assert.ok(LIFE.pl.say.c14(1, '5730', 32).includes('Zostały 32 z 64'))
  assert.ok(LIFE.pl.say.c14(1, '5730', 25).includes('Zostało 25 z 64'))
  assert.ok(LIFE.pl.say.c14(1, '5730', 1).includes('Został 1 z 64'))
  assert.ok(LIFE.de.say.c14(1, '5730', 32).includes('32 von 64 sind übrig'))
  assert.ok(LIFE.de.say.c14(1, '5730', 1).includes('1 von 64 ist übrig'))
  // years on the clock: a space between thousands from 10 000 up, as in the texts
  assert.equal(LIFE.pl.fmt(45840), '45 840')
  assert.equal(LIFE.de.fmt(5730), '5730')
})

test('element names follow elements.json (Polish and German)', async () => {
  const { default: elements } = await import('../../../data/elements.json', { with: { type: 'json' } })
  const list = Array.isArray(elements) ? elements : elements.elements ?? Object.values(elements)
  const name = (sym, lang) => list.find(e => e.symbol === sym).name[lang]
  for (const lang of ['pl', 'de']) {
    for (const sym of ['O', 'C', 'H', 'N', 'Ca', 'P']) assert.equal(LIFE[lang].el[sym], name(sym, lang), `${lang} ${sym}`)
  }
})
