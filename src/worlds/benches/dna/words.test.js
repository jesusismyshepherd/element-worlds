import { test } from 'node:test'
import assert from 'node:assert/strict'
import { WORDS, say, findText, num } from './words.js'
import { CODES } from '../../../i18n/langs.js'
import { FINDS } from './bases.js'

const VARS = { b: 'G', p: 'C', n: 3, hb: 8, nm: '1,0', turns: '0,3', gc: 67 }

/** Every text a key can give: both depths, filled in. */
function texts(w, path = '') {
  if (typeof w === 'string') return [[path, w]]
  if (typeof w === 'function') return [[path, w('A')], [path, w(VARS)]].filter(([, s]) => typeof s === 'string')
  if (Array.isArray(w)) return w.flatMap((x, i) => texts(x, `${path}[${i}]`))
  return Object.entries(w).flatMap(([k, x]) => texts(x, `${path}.${k}`))
}

test('every word of the bench is in all four languages, with the same shape as the English', () => {
  const shape = w => (typeof w === 'function' ? 'fn' : typeof w === 'string' ? 's' : Array.isArray(w) ? `[${w.length}]` : Object.keys(w).sort().map(k => `${k}:${shape(w[k])}`).join(','))
  for (const lang of CODES) {
    assert.ok(WORDS[lang], lang)
    for (const key of Object.keys(WORDS.en)) assert.equal(shape(WORDS[lang][key] ?? null), shape(WORDS.en[key]), `${lang}.${key}`)
  }
})

test('no em dashes, no empty texts, the numbers in each language\'s way', () => {
  for (const lang of CODES) {
    for (const [path, s] of texts(WORDS[lang])) {
      assert.ok(s.trim().length > 0, `${lang}${path}`)
      assert.ok(!s.includes('—') && !/[a-z] – [a-z]/i.test(s), `${lang}${path}: a dash used as a pause`)
      if (lang !== 'en') assert.ok(!/\d\.\d/.test(s) || /\d\.\d{3}/.test(s), `${lang}${path}: a decimal point (${s})`)
    }
  }
  assert.equal(num(1.25, 'en', 2), '1.25')
  assert.equal(num(1.25, 'pl', 2), '1,25')
})

test('the depths differ where they should, and every find has its words', () => {
  for (const lang of CODES) {
    assert.notEqual(say('start', lang, 'explorer'), say('start', lang, 'scientist'))
    assert.match(say('pair', lang, 'scientist', { b: 'A', p: 'T' }), /N6-H···O4/)
    assert.match(say('pair', lang, 'scientist', { b: 'C', p: 'G' }), /N2-H···O2/)
    for (const id of FINDS) {
      const f = findText(id, lang, 'scientist')
      assert.ok(f.title && f.text, `${lang} ${id}`)
    }
  }
  // Polish counts: 1 para, 3 pary, 5 par; 22 wiązania, 25 wiązań
  assert.match(say('status', 'pl', 'explorer', { n: 1, hb: 2 }), /^1 para · 2 wiązania wodorowe$/)
  assert.match(say('status', 'pl', 'explorer', { n: 5, hb: 12 }), /^5 par · 12 wiązań wodorowych$/)
  assert.match(say('status', 'pl', 'explorer', { n: 22, hb: 54 }), /^22 pary · 54 wiązania wodorowe$/)
})
