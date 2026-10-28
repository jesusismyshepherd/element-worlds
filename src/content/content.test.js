// Every element's own words (src/content/<Symbol>.js) in the right shape: every language, the
// explorer's text everywhere, lists where a station shows bullet points, no em dashes. Polish and German
// are checked where present while they are being written (ALL_LANGUAGES false), then required.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { element } from '../data/elements.js'

const ALL_LANGUAGES = false
const LANGUAGES = ['en', 'pt-pt', 'pl', 'de']
const FIELDS = ['greeting', 'nameOrigin', 'discovery', 'stateNote', 'found', 'uses', 'isotopes', 'facts']
const LISTS = new Set(['uses', 'facts'])
const files = readdirSync(new URL('.', import.meta.url)).filter(f => /^[A-Z][a-z]?\.js$/.test(f))

test('content files are named by element symbols', () => {
  for (const f of files) assert.ok(element(f.replace('.js', '')), f)
})

for (const f of files) {
  test(`content ${f}`, async () => {
    const c = (await import(`./${f}`)).default
    assert.ok(c && typeof c === 'object', 'default export')
    for (const key of Object.keys(c)) assert.ok(FIELDS.includes(key), `unknown field ${key}`)
    assert.ok(c.greeting, 'a greeting')
    for (const [key, entry] of Object.entries(c)) {
      for (const lang of LANGUAGES) {
        const l = entry[lang]
        if (!l && !ALL_LANGUAGES && (lang === 'pl' || lang === 'de')) continue
        assert.ok(l && (l.kid || l.sci), `${key}.${lang}`)
        for (const level of ['kid', 'sci']) {
          const v = l[level]
          if (v == null) continue
          if (LISTS.has(key)) assert.ok(Array.isArray(v) && v.length && v.every(x => typeof x === 'string' && x.trim()), `${key}.${lang}.${level} is a list`)
          else assert.ok(typeof v === 'string' && v.trim().length > 10, `${key}.${lang}.${level} is a sentence`)
          const text = [v].flat().join(' ')
          assert.ok(!text.includes('\u2014'), `${key}.${lang}.${level}: no em dashes`)
          assert.ok(!/TODO|TBD|lorem ipsum/.test(text), `${key}.${lang}.${level}: unfinished`)
        }
      }
      if (!LISTS.has(key)) {
        // the Portuguese is European: no Brazilian spellings that differ
        const pt = [entry['pt-pt'].kid, entry['pt-pt'].sci].join(' ')
        assert.ok(!/\b(elétron|nitrogênio|oxigênio|hidrogênio|atômic|ônibus|você)\b/i.test(pt), `${key}: European Portuguese`)
      }
    }
  })
}
