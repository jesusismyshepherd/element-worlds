import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CODES } from '../i18n/langs.js'
import { ELEMENTS, element } from '../data/elements.js'
import { explain, SIG } from './explain.js'

test('every Atomling can be read in every language, with nothing left undefined', () => {
  for (const lang of CODES) {
    for (const e of ELEMENTS) {
      const lines = explain(e, lang)
      assert.ok(lines.length >= 5, e.symbol)
      for (const l of lines) {
        assert.ok(!/undefined|NaN|null/.test(l), `${e.symbol} ${lang}: ${l}`)
        assert.ok(!l.includes('—'), `${e.symbol} ${lang}: an em dash`)
      }
      // the same features in every language: one sentence each
      assert.equal(lines.length, explain(e, 'en').length, `${e.symbol} ${lang}`)
    }
  }
})

test('every signature is told in every language', () => {
  for (const [kind, words] of Object.entries(SIG)) {
    for (const lang of CODES) assert.ok(words[lang]?.trim(), `${kind}: no ${lang}`)
  }
})

test('the words match the grammar', () => {
  assert.match(explain(element('C'), 'en')[0], /^4 hands/)
  assert.match(explain(element('Cs'), 'en')[2], /the largest of/)
  assert.match(explain(element('Na'), 'en')[1], /outer electron is in its hand/)
  assert.match(explain(element('O'), 'pt-pt').join(' '), /Flutua baixo/)
  assert.match(explain(element('He'), 'pt-pt')[0], /^Sem mãos/)
  // Polish counts: 1 ręka, 2 ręce; 6 elektronów, 2 elektrony; element names lower case in a sentence
  assert.match(explain(element('H'), 'pl')[0], /^1 ręka:/)
  assert.match(explain(element('O'), 'pl')[0], /^2 ręce: zwykle tworzy 2 wiązania\./)
  assert.match(explain(element('O'), 'pl')[1], /6 elektronów zewnętrznych i 2 wolne miejsca na 8/)
  assert.match(explain(element('Li'), 'pl').join(' '), /kolorem karminowym: na taki kolor lit barwi płomień/)
  assert.match(explain(element('Cs'), 'pl')[2], /, największy z \d+\.$/)
  assert.match(explain(element('O'), 'pl')[2], /0,\d\d m wzrostu/)
  // German: a capital for every noun, the element's name too
  assert.match(explain(element('Na'), 'de').join(' '), /So färbt Natrium eine Flamme\./)
  assert.match(explain(element('H'), 'de')[0], /^1 Hand: Meist entsteht 1 Bindung\./)
  assert.match(explain(element('Fe'), 'de').join(' '), /Ein Helm mit einem Federbusch: das Zeichen der Gruppe 8/)
  assert.match(explain(element('O'), 'de')[2], /^0,\d\d m groß: Der Atomradius beträgt 63 pm, der 3\.-kleinste von \d+\.$/)
})
