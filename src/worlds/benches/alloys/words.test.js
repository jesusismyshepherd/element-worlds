import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CODES } from '../../../i18n/langs.js'
import { WORDS, nameOfMix, titleOfMix, factOf, recipeText, hardnessText, meltText, crucibleLine, strikeText, pct, num } from './words.js'
import { ALLOYS, BOOK, PALETTE, identify, propertiesOf, slabOf, strikeOf } from './mix.js'

const BAD = /undefined|NaN|\bnull\b|\[object|\{\{|\}\}|\$\{/
const LEVELS = ['explorer', 'scientist']

/** A text the bench shows: a non-empty string with no hole in it and no em dash. */
function ok(text, where) {
  assert.equal(typeof text, 'string', `${where}: not a string`)
  assert.ok(text.trim().length > 0, `${where}: empty`)
  assert.ok(!BAD.test(text), `${where}: "${text}"`)
  assert.ok(!text.includes('—'), `${where}: an em dash in "${text}"`)
}

/** Every leaf of a words table: [path, value]. */
function leaves(o, path = '') {
  if (typeof o === 'string' || typeof o === 'function') return [[path, o]]
  if (Array.isArray(o)) return o.flatMap((v, i) => leaves(v, `${path}[${i}]`))
  return Object.entries(o).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k))
}

test('every language has every key of the English, of the same kind', () => {
  const en = leaves(WORDS.en)
  for (const lang of CODES) {
    assert.ok(WORDS[lang], `no ${lang}`)
    const mine = new Map(leaves(WORDS[lang]))
    for (const [path, v] of en) {
      assert.ok(mine.has(path), `${lang} lacks ${path}`)
      assert.equal(typeof mine.get(path), typeof v, `${lang} ${path}`)
      if (typeof v === 'string') ok(mine.get(path), `${lang} ${path}`)
    }
    assert.equal(mine.size, en.length, `${lang} has keys English lacks`)
  }
})

test('Polish and German are translated, not English', () => {
  for (const lang of ['pl', 'de', 'pt-pt']) {
    for (const id of BOOK) {
      assert.notEqual(WORDS[lang].alloy[id].kid, WORDS.en.alloy[id].kid, `${lang} ${id}`)
      assert.notEqual(WORDS[lang].alloy[id].sci, WORDS.en.alloy[id].sci, `${lang} ${id}`)
    }
  }
})

test('names, facts, recipes, hardness and melting for every alloy and metal, in every language and depth', () => {
  const mixes = [...ALLOYS.map(a => a.recipe), ...PALETTE.filter(el => el !== 'C').map(el => ({ [el]: 1 })), { Au: 11, Cu: 1 }, { Cu: 1, Fe: 1 }, { Ag: 12, Cu: 1 }, { Fe: 1, C: 8 }, { Au: 3, Ag: 1 }, { Au: 3, Ni: 1 }, { Au: 3, Cu: 1 }, { Fe: 4, Cr: 1 }, { Fe: 5, C: 1 }]
  for (const lang of CODES) {
    for (const level of LEVELS) {
      for (const mix of mixes) {
        const info = identify(mix)
        const where = `${lang} ${level} ${JSON.stringify(mix)}`
        ok(nameOfMix(info, lang, level), `${where} name`)
        ok(titleOfMix(info, lang, level), `${where} title`)
        ok(factOf(info, lang, level), `${where} fact`)
        ok(crucibleLine(info, { full: false, lang, level }), `${where} line`)
        const p = propertiesOf(info)
        if (p.hard) ok(hardnessText(p.hard, lang, level), `${where} hardness`)
        if (p.melt) ok(meltText(p.melt, lang), `${where} melt`)
      }
      for (const id of BOOK) ok(recipeText(id, lang, level), `${lang} ${level} ${id} recipe`)
      for (const info of [identify({}), identify({ C: 2 }), identify({ Cu: 8, Sn: 1, C: 2 })]) ok(crucibleLine(info, { full: false, lang, level }), `${lang} ${level} ${info.kind} line`)
      ok(crucibleLine(identify({ Cu: 30 }), { full: true, lang, level }), `${lang} full`)
    }
  }
})

test('what each strike did, in words', () => {
  const cases = [{ Cu: 1 }, { Cu: 8, Sn: 1 }, { Cu: 7, Sn: 2 }, { Fe: 1, C: 1 }, { Fe: 1, C: 3 }, { Ag: 13, Cu: 1 }, { Fe: 7, Cr: 2, Ni: 1 }]
  for (const mix of cases) {
    const slab = slabOf(mix)
    const info = identify(mix)
    const s = strikeOf(slab, 1)
    const by = s.kind === 'jam' ? (slab.gaps.length ? 'C' : slab.sites.find(x => x.el !== slab.host)?.el) : null
    for (const lang of CODES) for (const level of LEVELS) {
      ok(strikeText({ ...s, by, misfit: '+20%' }, info, lang, level), `${lang} ${level} ${JSON.stringify(mix)} ${s.kind}`)
      ok(strikeText({ kind: 'broken' }, info, lang, level), `${lang} broken`)
    }
  }
})

test('numbers: decimal commas but in English, no space before %', () => {
  assert.equal(pct(0.125, 'en'), '12.5%')
  assert.equal(pct(0.125, 'pl'), '12,5%')
  assert.equal(pct(0.12, 'de'), '12%')
  assert.equal(pct(0.0099, 'en'), '0.99%')
  assert.equal(pct(0.925, 'pt-pt'), '92,5%')
  assert.equal(num(1.5, 'de', 1), '1,5')
})

test('Polish and German grammar in the sentences that take an element', () => {
  assert.match(WORDS.pl.near('brąz', 'Cu').kid, /więcej miedzi/)
  assert.match(WORDS.pl.recipe([['Fe', 1], ['C', 3]]), /3 szczypty węgla/)
  assert.match(WORDS.pl.recipe([['Fe', 1], ['C', 5]]), /5 szczypt węgla/)
  assert.match(WORDS.de.strike.jam.kid('Bronze', 'Sn'), /Zinnatome/)
  assert.match(WORDS.de.pureName('Cu'), /^reines Kupfer$/)
  assert.equal(WORDS['pt-pt'].pureName('Ag'), 'prata pura')
  assert.equal(WORDS.pl.pureName('Fe'), 'czyste żelazo')
})
