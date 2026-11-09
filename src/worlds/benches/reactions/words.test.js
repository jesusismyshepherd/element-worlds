import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CODES } from '../../../i18n/langs.js'
import { WORDS, say, num, molName } from './words.js'
import { REACTIONS, MOLECULES } from './chemistry.js'

const BAD = /undefined|NaN|\bnull\b|\[object|\{\{|\}\}/
const LEVELS = ['explorer', 'scientist']
const V = { n: 3, total: 10, name: 'Oxygen', sym: 'O', left: 2, right: 1, d: 2, kJ: '890', dH: '−890.3', litres: '2.7', water: 'liquid', from: 'the light' }

function ok(text, where) {
  assert.equal(typeof text, 'string', `${where}: not a string`)
  assert.ok(text.trim().length > 0, `${where}: empty`)
  assert.ok(!BAD.test(text), `${where}: "${text}"`)
  assert.ok(!text.includes('—'), `${where}: an em dash in "${text}"`)
}

/** Every leaf path of a words table: a string, a function, or a { kid, sci } pair. */
function leaves(o, at = '') {
  if (typeof o === 'string' || typeof o === 'function') return [at]
  if ('kid' in o && 'sci' in o) return [at]
  return Object.entries(o).flatMap(([k, v]) => leaves(v, at ? `${at}.${k}` : k))
}

test('every language has every text of the English, at both depths, with no holes and no em dash', () => {
  const paths = leaves(WORDS.en)
  for (const lang of CODES) {
    assert.ok(WORDS[lang], lang)
    assert.deepEqual(leaves(WORDS[lang]).sort(), [...paths].sort(), `${lang}: the same texts as English`)
    for (const p of paths) for (const level of LEVELS) ok(say(lang, level, p, V), `${lang} ${level} ${p}`)
  }
})

test('every reaction and every molecule has its words', () => {
  for (const lang of CODES) {
    for (const r of REACTIONS) {
      for (const level of LEVELS) {
        ok(say(lang, level, `reactions.${r.id}.name`), `${lang} ${r.id} name`)
        ok(say(lang, level, `reactions.${r.id}.tag`), `${lang} ${r.id} tag`)
        ok(say(lang, level, `reactions.${r.id}.fact`), `${lang} ${r.id} fact`)
      }
      if (r.needs) ok(say(lang, 'explorer', `needs.${r.needs}`), `${lang} needs ${r.needs}`)
    }
    for (const f of Object.keys(MOLECULES)) for (const level of LEVELS) ok(molName(f, lang, level), `${lang} ${f}`)
  }
  // the translations are translations, not the English left in place
  for (const lang of ['pt-pt', 'pl', 'de']) {
    for (const r of REACTIONS) {
      assert.notEqual(say(lang, 'explorer', `reactions.${r.id}.fact`), say('en', 'explorer', `reactions.${r.id}.fact`), `${lang} ${r.id}`)
      assert.notEqual(say(lang, 'scientist', `reactions.${r.id}.fact`), say('en', 'scientist', `reactions.${r.id}.fact`), `${lang} ${r.id}`)
    }
  }
})

test('the facts keep the numbers of the science', () => {
  for (const lang of CODES) {
    const sci = id => say(lang, 'scientist', `reactions.${id}.fact`)
    assert.match(sci('methane'), /890[.,]3/)
    assert.match(sci('methane'), /802[.,]3/)
    assert.match(sci('water'), /1[.,]23 V/)
    assert.match(sci('photosynthesis'), /2803/)
    assert.match(sci('ethanol'), /1367[.,]6/)
    assert.match(sci('limestone'), /178[.,]3/)
    assert.match(sci('rust'), /825[.,]5/)
    assert.match(sci('salt'), /589 nm/)
  }
  // Portuguese is European: azoto, not nitrogênio; hidrogénio with an acute accent
  assert.equal(molName('N2', 'pt-pt', 'explorer'), 'azoto')
  assert.ok(!/gênio|elétron|ônico/.test(JSON.stringify(WORDS['pt-pt'])), 'no Brazilian forms (hidrogênio, elétron, iônico)')
})

test('numbers: a decimal comma but in English, a real minus, + on request', () => {
  assert.equal(num(-890.3, 'en', { digits: 1 }), '−890.3')
  assert.equal(num(-890.3, 'pt-pt', { digits: 1 }), '−890,3')
  assert.equal(num(2803.3, 'de', { digits: 1, plus: true }), '+2803,3')
  assert.equal(num(2.66, 'pl', { digits: 1 }), '2,7')
})
