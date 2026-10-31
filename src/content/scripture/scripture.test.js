// The Bible passages through the worlds (src/content/scripture/, docs/knowledge/scripture.md): every
// passage fetched in all four languages at both depths from the translation that depth quotes, every
// place and every hall with one, every "why" written, and nothing the 3D fonts cannot draw. The passages
// are quoted word for word, their own punctuation included (dashes too); the words we write have no em
// dash and no dash as a pause.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ELEMENTS } from '../../data/elements.js'
import { VERSIONS, citeOf, verseOf, whyOf, hallPassage, hasPassage, versePanel } from './index.js'
import WHY from './why.js'

const read = f => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'))
const PASSAGES = read('./passages.json')
const VERSES = read('./verses.json')
const LANGUAGES = ['en', 'pt-pt', 'pl', 'de']
// the translations each language quotes, Explorer then Scientist (scripts/data/fetch_verses.py, PAIRS)
const PAIRS = { en: ['NLT', 'CSB'], 'pt-pt': ['BPT09', 'ARC'], pl: ['SNP', 'BW1975'], de: ['HFA', 'SCH2000'] }
// the places the worlds quote by name (the halls take theirs from hallPassage)
const PLACES = ['plaza', 'lab', 'forge', 'stars', 'atomlings', 'quiz', 'allotropes', 'life', 'air', 'fire', 'signs']

test('every passage is fetched as listed, in every language at both depths', () => {
  assert.deepEqual(Object.keys(VERSES).sort(), Object.keys(PASSAGES).sort(), 'run scripts/data/fetch_verses.py')
  for (const [id, p] of Object.entries(PASSAGES)) {
    const e = VERSES[id]
    assert.equal(e._ref, p.ref, `${id}: fetched for ${e._ref}, listed as ${p.ref}`)
    const [book, ch] = p.ref.split('.')
    for (const lang of LANGUAGES) {
      for (const [i, d] of ['kid', 'sci'].entries()) {
        const q = e[lang]?.[d]
        assert.ok(q?.text?.trim(), `${id} ${lang} ${d}: no words`)
        assert.equal(q.v, PAIRS[lang][i], `${id} ${lang} ${d}: from ${q.v}`)
        assert.ok(VERSIONS[q.v], `${id}: ${q.v} has no notice`)
        const [b, c] = q.ref.split('.')
        assert.ok(b === book && c === ch, `${id} ${lang} ${d}: ${q.ref} is not in ${book} ${ch}`)
        assert.ok(!/[֐-׿]/.test(q.text), `${id} ${lang} ${d}: Hebrew letters`)
      }
    }
  }
})

test('the words fit the 3D fonts (Latin, Polish and German letters, the usual quotation marks)', () => {
  for (const [id, e] of Object.entries(VERSES)) {
    for (const lang of LANGUAGES) {
      for (const d of ['kid', 'sci']) {
        const odd = [...e[lang][d].text].filter(c => c !== '\n' && !/[ -~ -ſ–—‘’“”„…«»]/.test(c))
        assert.deepEqual(odd, [], `${id} ${lang} ${d}`)
      }
    }
  }
})

test('every place and every hall has a passage', () => {
  for (const id of PLACES) assert.ok(hasPassage(id), id)
  for (const el of ELEMENTS) assert.ok(hasPassage(hallPassage(el)), `${el.symbol}: ${hallPassage(el)}`)
  // the element's own where there is one, else by its name, else by what it is
  assert.equal(hallPassage(ELEMENTS[25]), 'Fe')
  assert.equal(hallPassage(ELEMENTS[83]), 'nations') // polonium, after Poland
  assert.equal(hallPassage(ELEMENTS[100]), 'scientists') // mendelevium
  assert.equal(hallPassage(ELEMENTS[114]), 'superheavy') // moscovium
  assert.equal(hallPassage(ELEMENTS[91]), 'radioactive') // uranium
  assert.equal(hallPassage(ELEMENTS[56]), 'lanthanide') // lanthanum
})

test('every passage says why it stands there, at both depths, in every language, without dashes', () => {
  assert.deepEqual(Object.keys(WHY).sort(), Object.keys(PASSAGES).sort())
  for (const [id, w] of Object.entries(WHY)) {
    for (const lang of LANGUAGES) {
      for (const d of ['kid', 'sci']) {
        const s = w[lang]?.[d]
        assert.ok(s?.trim(), `${id} ${lang} ${d}`)
        assert.ok(!/—|\s–\s/.test(s), `${id} ${lang} ${d}: an em dash or a dash as a pause`)
      }
      assert.equal(whyOf(id, lang, 'scientist'), w[lang].sci)
    }
  }
})

test('references are cited the way each language cites them', () => {
  assert.equal(citeOf('PSA.19.1', 'en'), 'Psalm 19:1')
  assert.equal(citeOf('PSA.19.2', 'de'), 'Psalm 19,2')
  assert.equal(citeOf('PRO.27.17', 'pl'), 'Przysłów 27,17')
  assert.equal(citeOf('GEN.1.3', 'pt-pt'), 'Génesis 1:3')
  for (const e of Object.values(VERSES)) {
    for (const lang of LANGUAGES) for (const d of ['kid', 'sci']) assert.ok(!/^[A-Z0-9]{3} /.test(citeOf(e[lang][d].ref, lang)), `${e[lang][d].ref}: no book name in ${lang}`)
  }
  const v = verseOf('plaza', 'en', 'scientist')
  assert.equal(v.label, 'Psalm 19:1 (CSB)')
  assert.equal(verseOf('plaza', 'en', 'explorer').version, 'NLT')
  const panel = versePanel('Fe', 'de', 'explorer')
  assert.equal(panel.blocks[0].verse.cite, 'Sprüche 27,17 (HFA)')
  assert.ok(panel.blocks[1].p)
})
