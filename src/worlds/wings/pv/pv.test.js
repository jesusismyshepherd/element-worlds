import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PV_WORDS } from './pv.words.js'
import { NA_WORDS } from './Na.words.js'
import { VIDEOS, ROOMS } from './videos.js'

const LANGS = ['en', 'pt-pt', 'pl', 'de']
const ROOM_WORDS = { Na: NA_WORDS }
const EM = String.fromCharCode(0x2014)

/** Every key path of an object, arrays by their length (so each language has as many paragraphs). */
const shape = (o, at = '') =>
  Array.isArray(o) ? [`${at}[${o.length}]`] : o && typeof o === 'object' ? Object.keys(o).sort().flatMap(k => shape(o[k], `${at}.${k}`)) : [at]

test('the shared words exist in every language, in the same shape, without em dashes', () => {
  for (const l of LANGS) {
    assert.deepEqual(shape(PV_WORDS[l]), shape(PV_WORDS.en), l)
    assert.ok(!JSON.stringify(PV_WORDS[l]).includes(EM), l)
  }
})

test("each room's words exist in every language, in the same shape (forms aside), without em dashes", () => {
  for (const sym of ROOMS) {
    const W = ROOM_WORDS[sym]
    assert.ok(W, `${sym}: no words`)
    const strip = o => ({ ...o, forms: undefined })
    for (const l of LANGS) {
      assert.deepEqual(shape(strip(W[l])), shape(strip(W.en)), `${sym} ${l}`)
      assert.ok(W[l].forms?.el && W[l].forms?.El, `${sym} ${l}: forms`)
      assert.ok(!JSON.stringify(W[l]).includes(EM), `${sym} ${l}`)
    }
  }
  // Portuguese sentences name the element with its article
  for (const sym of ROOMS) assert.ok(ROOM_WORDS[sym]['pt-pt'].forms.do_el, `${sym}: do_el`)
})

test("the professor has one line for each moment he says one, in every language", () => {
  for (const sym of ROOMS) {
    const times = VIDEOS[sym].prof ?? []
    for (const l of LANGS) assert.equal(ROOM_WORDS[sym][l].prof?.lines.length ?? 0, times.length, `${sym} ${l}`)
    for (const s of times) assert.ok(s >= 0 && s < VIDEOS[sym].length, `${sym}: ${s}`)
  }
})

test("every room's video has its parts inside the film", () => {
  for (const sym of ROOMS) {
    const v = VIDEOS[sym]
    assert.match(v.id, /^[\w-]{11}$/, sym)
    for (const [part, s] of Object.entries(v.parts)) assert.ok(s >= 0 && s < v.length, `${sym} ${part}: ${s}`)
  }
})
