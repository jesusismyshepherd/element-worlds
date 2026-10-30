// The picture rooms (docs/knowledge/picture-rooms.md): each scene stands behind a real picture of its hall,
// and its words exist in all four languages, in the same shape as the English, both depths, no em dashes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, existsSync } from 'node:fs'
import { PIC_WORDS } from './words.js'

const LANGS = ['en', 'pt-pt', 'pl', 'de']
const dir = new URL('./scenes/', import.meta.url)
const scenes = readdirSync(dir).flatMap(sym =>
  readdirSync(new URL(`${sym}/`, dir))
    .filter(f => /^[a-z][\w-]*\.js$/.test(f) && !f.endsWith('.words.js') && !f.endsWith('.test.js'))
    .map(f => ({ sym, id: f.replace(/\.js$/, '') })),
)

/** Every string of `o` with its path, so two languages can be compared shape by shape. */
function shape(o, path = '') {
  if (typeof o === 'string') return [[path, 'string']]
  if (Array.isArray(o)) return [[path, `array ${o.length}`], ...o.flatMap((v, i) => shape(v, `${path}[${i}]`))]
  if (o && typeof o === 'object') return Object.keys(o).sort().flatMap(k => shape(o[k], `${path}.${k}`))
  return [[path, typeof o]]
}
const strings = o => (typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(strings) : [])

test('the shared words are in every language, without em dashes', () => {
  for (const lang of LANGS) {
    assert.deepEqual(shape(PIC_WORDS[lang]), shape(PIC_WORDS.en), lang)
    for (const s of strings(PIC_WORDS[lang])) assert.ok(!s.includes('—'), `${lang}: ${s}`)
  }
})

test('every room stands behind a picture of its hall', async () => {
  assert.ok(scenes.length > 0)
  for (const { sym, id } of scenes) {
    const boards = (await import(`../../content/boards/${sym}.js`)).default
    assert.ok(boards.some(b => b.id === id && !b.doors), `${sym}/${id}: no such picture in the hall`)
    assert.ok(existsSync(new URL(`${sym}/${id}.words.js`, dir)), `${sym}/${id}: its words`)
  }
})

test("every room's words: four languages, the same shape, both depths, no em dashes", async () => {
  for (const { sym, id } of scenes) {
    const mod = await import(`./scenes/${sym}/${id}.words.js`)
    const words = Object.values(mod).find(v => v && typeof v === 'object' && v.en)
    assert.ok(words, `${sym}/${id}: a words object by language`)
    assert.ok(words.en.title && words.en.greet?.kid && words.en.greet?.sci, `${sym}/${id}: title and greeting`)
    assert.ok(words.en.talk?.kid?.length && words.en.talk?.sci?.length, `${sym}/${id}: the Atomling's lines`)
    for (const lang of LANGS) {
      assert.ok(words[lang], `${sym}/${id}: ${lang}`)
      assert.deepEqual(shape(words[lang]), shape(words.en), `${sym}/${id}: ${lang} differs from English`)
      for (const s of strings(words[lang])) {
        assert.ok(s.trim(), `${sym}/${id} ${lang}: an empty text`)
        assert.ok(!s.includes('—'), `${sym}/${id} ${lang}: an em dash in "${s}"`)
      }
    }
  }
})
