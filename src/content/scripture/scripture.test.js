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

test('the whole chapter: which one, the quoted verses marked, the Bible App link, the same numbers as the API', async () => {
  const { chapterOf } = await import('./index.js')
  const { YV, parseNlt } = await import('../../../api/_bible.js')
  for (const [k, v] of Object.entries(VERSIONS)) assert.equal(YV[k], v.yv, `${k}: the Bible App's number`)
  const si = chapterOf('Si', 'en', 'explorer')
  assert.deepEqual([si.v, si.ch, si.marks, si.title], ['NLT', 'PSA.139', [17, 18], 'Psalm 139'])
  assert.equal(si.app, 'https://www.bible.com/bible/116/PSA.139.17-18')
  // a translation that numbers a psalm's title as verse 1 marks its own verse
  assert.deepEqual(chapterOf('plaza', 'de', 'explorer').marks, [2])
  assert.equal(chapterOf('Fe', 'pl', 'scientist').title, 'Przysłów 27')
  // Tyndale's page: numbers, notes and the psalm's title left out, LORD in capitals, poetry line by line
  const html = `<section><h2 class="bk_ch_vs_header">Psalm 12:6</h2><verse_export orig="psal_12_1" bk="psal" ch="12" vn="1">
<p class="psa-title">For the choir director.</p><p class="poet1-vn"><span class="vn">1</span>Help, O <span class="sc">Lord</span>,</p>
<p class="poet2">for the godly are fast disappearing!<a class="a-tn">*</a><span class="tn"><span class="tn-ref">12:1</span> Or <em>note</em></span></p>
</verse_export><verse_export orig="psal_12_2" bk="psal" ch="12" vn="2"><p class="body"><span class="vn">2</span>Neighbors lie &amp; flatter.</p></verse_export></section>`
  const r = parseNlt(html)
  assert.deepEqual(r.verses, [{ n: 1, text: 'Help, O LORD,\nfor the godly are fast disappearing!' }, { n: 2, text: 'Neighbors lie & flatter.' }])
  assert.equal(r.poem, true)
})
