import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, element } from '../data/elements.js'
import { explain } from './explain.js'

test('every Atomling can be read in both languages, with nothing left undefined', () => {
  for (const lang of ['en', 'pt-pt']) {
    for (const e of ELEMENTS) {
      const lines = explain(e, lang)
      assert.ok(lines.length >= 5, e.symbol)
      for (const l of lines) assert.ok(!/undefined|NaN|null/.test(l), `${e.symbol} ${lang}: ${l}`)
    }
  }
})

test('the words match the grammar', () => {
  assert.match(explain(element('C'), 'en')[0], /^4 hands/)
  assert.match(explain(element('Cs'), 'en')[2], /the largest of/)
  assert.match(explain(element('Na'), 'en')[1], /outer electron is in its hand/)
  assert.match(explain(element('O'), 'pt-pt').join(' '), /Flutua baixo/)
  assert.match(explain(element('He'), 'pt-pt')[0], /^Sem mãos/)
})
