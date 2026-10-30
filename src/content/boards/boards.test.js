import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(HERE, '../../../public/boards')
const LANGS = ['en', 'pt-pt', 'pl', 'de']
const files = readdirSync(HERE).filter(f => /^[A-Z][a-z]?\.js$/.test(f))

for (const f of files) {
  const symbol = f.replace('.js', '')
  test(`${symbol}'s picture boards`, async () => {
    const boards = (await import(`./${f}`)).default
    // the fact file takes one spot of the eight, the pictures (and a doorway board, if any) the other seven
    assert.equal(boards.length, 7, 'seven boards')
    assert.equal(new Set(boards.map(b => b.id)).size, boards.length, 'ids differ')
    assert.ok(boards.filter(b => b.doors).length <= 1, 'one doorway board at most')
    for (const b of boards.filter(b => b.doors)) {
      assert.match(b.color, /^#[0-9a-f]{6}$/i, `${symbol} doorway board: colour`)
      assert.ok(Array.isArray(b.doors) && b.doors.length > 0, `${symbol} doorway board: its doors`)
    }
    for (const b of boards.filter(b => !b.doors)) {
      const where = `${symbol} ${b.id}`
      assert.match(b.color, /^#[0-9a-f]{6}$/i, `${where}: colour`)
      assert.ok(existsSync(path.join(PUBLIC, symbol, `${b.id}.svg`)), `${where}: public/boards/${symbol}/${b.id}.svg`)
      for (const lang of LANGS) {
        const title = b.title[lang]
        assert.ok(typeof title === 'string' && title.length > 0 && title.length <= 44, `${where}: title in ${lang}`)
        for (const depth of ['kid', 'sci']) {
          const story = b.story[lang]?.[depth]
          assert.ok(Array.isArray(story) && story.length === b.story.en[depth].length, `${where}: ${depth} story in ${lang}, as many paragraphs as English`)
          for (const p of [title, ...story]) {
            assert.ok(!/[—]|\s–\s/.test(p), `${where} (${lang}): no em dash or en dash as a pause: ${p}`)
          }
        }
      }
    }
  })
}
