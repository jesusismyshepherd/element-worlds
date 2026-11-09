// The Atom Forge's words about its clouds (cloudWords.js): the configurations as chemists write them, and every
// kind of line in every language at both depths.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { element } from '../../data/elements.js'
import { ionOf } from '../../chem/orbitals.js'
import { CODES } from '../../i18n/langs.js'
import { configLine, cloudLine, CLOUD_WORDS } from './cloudWords.js'

const report = (sym, E, change) => {
  const info = ionOf(element(sym), E)
  return { z: info.z, e: info.e, subs: info.subs, unpaired: info.unpaired, exception: info.exception, change }
}

test('configurations: a noble gas core in brackets when there is more besides', () => {
  assert.equal(configLine(ionOf(element('Fe'), 24).subs), '[Ar] 3d⁶')
  assert.equal(configLine(ionOf(element('Fe'), 26).subs), '[Ar] 4s² 3d⁶')
  assert.equal(configLine(ionOf(element('Cl'), 18).subs), '[Ne] 3s² 3p⁶')
  assert.equal(configLine(ionOf(element('Ne'), 10).subs), '[He] 2s² 2p⁶')
  assert.equal(configLine(ionOf(element('He'), 2).subs), '1s²')
  assert.equal(configLine(ionOf(element('U'), 92).subs), '[Rn] 7s² 5f³ 6d¹')
})

test('every line of the clouds in every language, at both depths', () => {
  const cases = [
    ['went', report('C', 6, { kind: 'add', id: '2p', first: false, pairs: false, before: null })],
    ['went, a new shape', report('C', 5, { kind: 'add', id: '2p', first: true, pairs: false, before: null })],
    ['pair', report('O', 8, { kind: 'add', id: '2p', first: false, pairs: true, before: null })],
    ['before', report('Fe', 19, { kind: 'add', id: '3d', first: true, pairs: false, before: { inner: '3d', outer: '4s' } })],
    ['before, one missing', report('Fe', 25, { kind: 'add', id: '3d', first: false, pairs: false, before: { inner: '3d', outer: '4s' } })],
    ['rule breaker', report('Cr', 24, { kind: 'add', id: '4s', first: true, pairs: false, before: null })],
    ['noble gas', report('Ne', 10, { kind: 'add', id: '2p', first: false, pairs: false, before: null })],
    ['closed', report('Cl', 18, { kind: 'add', id: '3p', first: false, pairs: false, before: null })],
    ['left', report('Fe', 25, { kind: 'remove', id: '4s' })],
  ]
  for (const lang of CODES) {
    assert.ok(CLOUD_WORDS[lang], lang)
    for (const level of ['explorer', 'scientist']) {
      for (const [what, c] of cases) {
        const line = cloudLine(c, lang, level)
        assert.ok(line && line.length > 10, `${what} ${lang} ${level}`)
        assert.ok(!/undefined|NaN|\$\{/.test(line), `${what} ${lang} ${level}: ${line}`)
        assert.ok(!line.includes('—'), `${what} ${lang} ${level}: an em dash`)
      }
    }
  }
  // what each says, in English
  assert.match(cloudLine(cases[5][1], 'en', 'explorer'), /Chromium breaks the filling rule: the rule says 4s² 3d⁴, but it really is 4s¹ 3d⁵/)
  assert.match(cloudLine(cases[3][1], 'en', 'explorer'), /^3d before 4s! With 7 electrons still missing/)
  assert.match(cloudLine(cases[7][1], 'en', 'scientist'), /isoelectronic with argon/)
  assert.equal(cloudLine(report('Fe', 0, null), 'en', 'explorer'), null)
})
