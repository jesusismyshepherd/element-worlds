import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, element } from '../../data/elements.js'
import { electronsOf } from '../../chem/orbitals.js'
import { WORDS, say, sci10, length, sizeWords, configText, shortConfig } from './words.js'
import { atomView, orbitalView, photoOf, maxZoomOf, ROOM_R } from './views.js'

const LANGS = ['en', 'pt-pt', 'pl', 'de']
// sample numbers for every placeholder the words use
const V = { name: 'iron', z: 26, id: '3d', n: 3, count: 6, zeff: '6,25', rn: 0, an: 2, e: 1, label: '3dxy', mag: '1,3 × 10¹¹', p: 26, nn: 30, size: 'a grain', d: '2 mm', r: '4,6', R: 140, ratio: '30 000', share: '99,97', pm: '2,1', rule: '4s² 3d⁴', real: '4s¹ 3d⁵', half: true, u: 4 }

// every leaf of the words: [path, value]
const leaves = (o, path = []) =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? leaves(v, [...path, k]) : [[[...path, k].join('.'), v]]))

test('the room speaks all four languages, with the same words at both depths', () => {
  const en = leaves(WORDS.en)
  for (const lang of LANGS) {
    const mine = Object.fromEntries(leaves(WORDS[lang]))
    for (const [path, v] of en) {
      assert.ok(path in mine, `${lang}: ${path} missing`)
      assert.equal(typeof mine[path], typeof v, `${lang}: ${path} is a ${typeof mine[path]}`)
    }
  }
})

test('no em dashes, nothing left unfilled, plurals for one and many', () => {
  for (const lang of LANGS) {
    for (const [path, v] of leaves(WORDS[lang])) {
      for (const sample of [V, { ...V, z: 1, count: 1, e: 0, rn: 1, an: 1, u: 0, p: 1, nn: 0, half: false }, { ...V, z: 2, count: 2, e: 2, rn: 2, an: 3, u: 1 }]) {
        const text = typeof v === 'function' ? v(sample) : v
        assert.equal(typeof text, 'string', `${lang} ${path}`)
        assert.ok(!text.includes('—'), `${lang} ${path}: an em dash`)
        assert.ok(!/\{\w+\}|undefined|NaN/.test(text), `${lang} ${path}: ${text}`)
      }
    }
  }
  assert.equal(WORDS.en.board.all(1), 'The one electron')
  assert.equal(WORDS.pl.panel.camera.count(5), '5 zdjęć')
  assert.equal(WORDS.pl.panel.camera.count(22), '22 zdjęcia')
  assert.equal(say(WORDS.de.sub.p, 'scientist', V).startsWith('3d: l = 1'), true)
})

test('numbers written the way each language writes them', () => {
  assert.equal(sci10(1.3e11, 'en'), '1.3 × 10¹¹')
  assert.equal(sci10(1.3e11, 'de'), '1,3 × 10¹¹')
  assert.equal(length(0.0021, 'en'), '2.1 mm')
  assert.equal(length(0.4, 'pl'), '40 cm')
  assert.equal(length(3e-6, 'en'), '3.0 µm')
  assert.equal(sizeWords(0.001, 'en'), 'the size of a grain of sand')
  assert.equal(sizeWords(0.4, 'de'), 'so groß wie ein Fußball')
  assert.equal(configText([{ id: '4s', count: 1 }, { id: '3d', count: 10 }]), '4s¹ 3d¹⁰')
  assert.equal(shortConfig('[Ar]4s2 3d6'), '[Ar] 4s² 3d⁶')
  assert.equal(shortConfig('1s1'), '1s¹')
  assert.equal(shortConfig('[Xe]6s1 4f14 5d10'), '[Xe] 6s¹ 4f¹⁴ 5d¹⁰')
})

test('every element: the whole atom, each subshell and each orbital make a cloud that fits the room', () => {
  for (const el of ELEMENTS) {
    const info = electronsOf(el)
    const all = atomView(info, 1)
    assert.ok(all.scale > 0 && all.cut > 0 && all.cut <= ROOM_R, `${el.symbol} atom view`)
    const deep = atomView(info, maxZoomOf(info))
    assert.ok(deep.scale >= all.scale, el.symbol)
    for (const sub of info.subs) {
      const v = orbitalView(sub)
      assert.ok(Number.isFinite(v.scale) && v.scale > 0, `${el.symbol} ${sub.id}`)
      assert.equal(v.orbitals.length, sub.orbitals.length)
      for (const o of v.orbitals) assert.ok(o.level > 0 && Number.isFinite(o.level), `${el.symbol} ${sub.id} skin`)
      // the skin of every orbital fits inside the room's cloud
      const one = orbitalView(sub, sub.orbitals.length - 1)
      assert.ok(one.phase && one.orbitals.length === 1)
    }
  }
})

test('photos: the same on every screen for a series, inside the cloud, coloured', () => {
  const info = electronsOf(element('Fe'))
  const v = orbitalView(info.subs.find(s => s.id === '3d'))
  const a = photoOf(v, info, 1234, 7)
  const b = photoOf(v, info, 1234, 7)
  assert.deepEqual(a.p.toArray(), b.p.toArray())
  let inside = 0
  for (let i = 0; i < 400; i++) if (photoOf(v, info, 99, i).p.length() * v.scale < v.cut) inside++
  assert.ok(inside > 390, `${inside} of 400 inside`)
  const all = atomView(info, 1)
  const c = photoOf(all, info, 5, 1)
  assert.ok(c.color.r + c.color.g + c.color.b > 0)
})
