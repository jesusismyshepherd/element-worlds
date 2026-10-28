import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { useChart, nuclide, decay, commonestN, collide, BEAMS } from '../../chem/nucleus.js'
import { CODES } from '../../i18n/langs.js'
import { TABLES, MISSIONS, BEAM_NAMES, describe, decayText, reactionText, isotopeName, halfLifeText, noteText } from './words.js'

useChart(JSON.parse(readFileSync(new URL('../../data/nuclides.json', import.meta.url), 'utf8')))

const BAD = /undefined|NaN|\bnull\b|\[object|\{\{|\}\}/
const YEAR = 3.15576e7
const LEVELS = ['explorer', 'scientist']

/** A text the forge shows: a non-empty string with no hole in it and no em dash. */
function ok(text, where) {
  assert.equal(typeof text, 'string', `${where}: not a string`)
  assert.ok(text.trim().length > 0, `${where}: empty`)
  assert.ok(!BAD.test(text), `${where}: "${text}"`)
  assert.ok(!text.includes('\u2014'), `${where}: an em dash in "${text}"`)
}

test('every table has every language, with the same keys and kinds as English', () => {
  for (const [name, table] of Object.entries(TABLES)) {
    for (const lang of CODES) {
      assert.ok(table[lang], `${name} has no ${lang}`)
      if (typeof table.en === 'string') {
        ok(table[lang], `${name}.${lang}`)
        continue
      }
      assert.deepEqual(Object.keys(table[lang]).sort(), Object.keys(table.en).sort(), `${name}.${lang} keys`)
      for (const [k, v] of Object.entries(table.en)) {
        const x = table[lang][k]
        // a unit may be one word or forms by count; everything else keeps English's kind
        if (name === 'UNITS') assert.ok(typeof x === 'string' || (x && typeof x.other === 'string' && typeof x.one === 'string'), `UNITS.${lang}.${k}`)
        else assert.equal(typeof x, typeof v, `${name}.${lang}.${k}`)
        if (typeof v === 'object' && v && 'kid' in v) {
          ok(x.kid, `${name}.${lang}.${k}.kid`)
          ok(x.sci, `${name}.${lang}.${k}.sci`)
        }
      }
    }
  }
  // Polish counts need one, few, many and the fractions' form; German one and other
  for (const forms of Object.values(TABLES.UNITS.pl)) if (typeof forms !== 'string') assert.deepEqual(Object.keys(forms).sort(), ['few', 'many', 'one', 'other'])
  for (const forms of Object.values(TABLES.UNITS.de)) if (typeof forms !== 'string') assert.deepEqual(Object.keys(forms).sort(), ['one', 'other'])
})

test('missions and beams have a name and a hint in every language', () => {
  for (const m of MISSIONS) {
    for (const lang of CODES) {
      ok(m.name[lang], `mission ${m.id} name ${lang}`)
      ok(m.hint[lang], `mission ${m.id} hint ${lang}`)
    }
    for (const lang of ['pl', 'de']) assert.notEqual(m.hint[lang], m.hint.en, `mission ${m.id} hint ${lang} is English`)
  }
  for (const lang of CODES) for (const b of Object.keys(BEAMS)) ok(BEAM_NAMES[lang][b], `beam ${b} ${lang}`)
})

test('isotope names: lowercase in running text, German keeps its capitals', () => {
  assert.equal(isotopeName(6, 6, 'pl'), 'węgiel-12')
  assert.equal(isotopeName(92, 146, 'pl'), 'uran-238')
  assert.equal(isotopeName(6, 6, 'de'), 'Kohlenstoff-12')
  assert.equal(isotopeName(92, 146, 'de'), 'Uran-238')
  assert.equal(isotopeName(1, 1, 'pl'), 'wodór-2 (deuter)')
  assert.equal(isotopeName(1, 2, 'de'), 'Wasserstoff-3 (Tritium)')
  assert.equal(isotopeName(6, 8, 'en'), 'carbon-14')
  assert.equal(isotopeName(1, 1, 'pt-pt'), 'hidrogénio-2 (deutério)')
})

test('half-lives: real plurals and decimal commas', () => {
  const pl = t => halfLifeText(t, 'pl')
  const de = t => halfLifeText(t, 'de')
  assert.equal(pl(YEAR), '1 rok')
  assert.equal(pl(2 * YEAR), '2 lata')
  assert.equal(pl(5 * YEAR), '5 lat')
  assert.equal(pl(12 * YEAR), '12 lat')
  assert.equal(pl(22 * YEAR), '22 lata')
  assert.equal(pl(1.25 * YEAR), '1,25 roku')
  assert.equal(pl(1), '1 sekunda')
  assert.equal(pl(3), '3 sekundy')
  assert.equal(pl(25), '25 sekund')
  assert.equal(pl(2.5 * 60), '2,5 minuty')
  assert.equal(pl(4.47e9 * YEAR), '4,47 miliarda lat')
  assert.equal(pl(2e6 * YEAR), '2 miliony lat')
  assert.equal(pl(1.8e19 * YEAR), '1,8 × 10¹⁹ lat')
  assert.equal(de(YEAR), '1 Jahr')
  assert.equal(de(2 * YEAR), '2 Jahre')
  assert.equal(de(1.5 * 86400), '1,5 Tage')
  assert.equal(de(1), '1 Sekunde')
  assert.equal(de(4.47e9 * YEAR), '4,47 Milliarden Jahre')
  assert.equal(de(1e9 * YEAR), '1 Milliarde Jahre')
  assert.equal(de(7e-4), '700 Millionstelsekunden')
  assert.equal(de(3.2e-15), '3,2 × 10⁻¹⁵ s')
  assert.equal(halfLifeText(3.2e-15, 'en'), '3.2 × 10⁻¹⁵ s')
  assert.equal(halfLifeText(5700 * YEAR, 'en'), '5,700 years')
  for (const lang of CODES) {
    for (const t of [1e-25, 2e-9, 4.5e-7, 1.6e-4, 0.7, 1, 22, 150, 3600, 86400, YEAR, 5700 * YEAR, 2.5e6 * YEAR, 4.47e9 * YEAR, 1.8e19 * YEAR]) ok(halfLifeText(t, lang), `half-life ${t} ${lang}`)
  }
})

test('describe and noteText: every language, both depths, a sample of atoms', () => {
  const atoms = [
    [0, 0, 0], [0, 1, 0], [0, 3, 0], [1, 0, 1], [1, 1, 1], [1, 2, 1], [1, 0, 2, 'crystalOnly'], [2, 2, 0], [2, 3, 2], [4, 4, 4],
    [6, 6, 6], [6, 8, 6], [7, 7, 8, 'noExtra'], [8, 8, 11, 'tooMany'], [11, 12, 10], [17, 18, 18], [26, 30, 23], [43, 55, 43],
    [47, 60, 47, 'noExtra'], [78, 117, 76], [92, 146, 92], [92, 146, 0], [6, 30, 6], [6, 0, 6], [118, 176, 118], [118, 177, 118],
  ]
  for (const lang of CODES) {
    for (const level of LEVELS) {
      for (const [Z, N, E, note] of atoms) {
        const lines = describe({ Z, N, E, nuc: nuclide(Z, N), common: Z ? commonestN(Z) : 0, held: true, note }, lang, level)
        assert.ok(lines.length > 0)
        for (const l of lines) ok(l.text, `describe ${Z},${N},${E} ${lang} ${level}`)
        if (lang === 'pl' || lang === 'de') {
          const en = describe({ Z, N, E, nuc: nuclide(Z, N), common: Z ? commonestN(Z) : 0, held: true, note }, 'en', level)
          lines.forEach((l, i) => {
            if (!/^[NZ] = /.test(l.text)) assert.notEqual(l.text, en[i].text, `describe ${Z},${N},${E} ${lang} ${level} line ${i} is English`)
          })
        }
      }
      for (const note of ['noHold', 'tooMany', 'crystalOnly']) ok(noteText(note, lang, level), `note ${note} ${lang} ${level}`)
    }
  }
})

test('decayText: every language, down whole chains and the odd ones', () => {
  const starts = [[92, 146], [90, 142], [6, 8], [26, 26], [4, 4], [3, 1], [1, 1], [0, 1], [11, 9], [98, 154], [118, 176], [6, 30], [6, 0]]
  for (const lang of CODES) {
    for (const [z0, n0] of starts) {
      let [Z, N] = [z0, n0]
      for (let i = 0; i < 16; i++) {
        const d = decay(Z, N)
        if (!d) break
        const t = decayText({ mode: d.mode, from: { Z, N }, to: { Z: d.Z, N: d.N } }, lang)
        ok(t.kid, `decay ${Z},${N} ${lang} kid`)
        ok(t.sci, `decay ${Z},${N} ${lang} sci`)
        if (lang === 'pl' || lang === 'de') assert.notEqual(t.kid, decayText({ mode: d.mode, from: { Z, N }, to: { Z: d.Z, N: d.N } }, 'en').kid)
        ;[Z, N] = [d.Z, d.N]
      }
    }
    // a decay that leaves no proton
    ok(decayText({ mode: 'p', from: { Z: 1, N: 1 }, to: { Z: 0, N: 1 } }, lang).kid, `decay to a neutron ${lang}`)
  }
  assert.match(decayText({ mode: 'p', from: { Z: 1, N: 1 }, to: { Z: 0, N: 1 } }, 'de').kid, /ein Neutron\.$/)
})

test('reactionText: every famous reaction and every beam, in every language', () => {
  const targets = [[1, 0], [1, 1], [1, 2], [3, 4], [4, 5], [4, 4], [7, 7], [13, 14], [92, 143], [98, 151], [97, 152], [83, 126], [82, 126], [0, 0], [26, 30], [79, 118]]
  let famous = 0
  for (const lang of CODES) {
    for (const [Z, N] of targets) {
      for (const beam of Object.keys(BEAMS)) {
        const c = collide(Z, N, beam)
        if (c.result.Z > 118) continue
        const ev = { mode: c.famous ? 'reaction' : 'fusion', from: { Z, N }, to: c.result, beam, famous: c.famous, out: c.out }
        const t = reactionText(ev, lang)
        ok(t.kid, `beam ${beam} at ${Z},${N} ${lang} kid`)
        ok(t.sci, `beam ${beam} at ${Z},${N} ${lang} sci`)
        if (c.famous) famous++
        if (lang === 'pl' || lang === 'de') assert.notEqual(t.kid, reactionText(ev, 'en').kid, `beam ${beam} at ${Z},${N} ${lang} is English`)
      }
    }
  }
  assert.ok(famous >= 10 * CODES.length)
  // the verb follows the count in Polish; German counts its neutrons
  const og = collide(98, 151, 'Ca48')
  assert.match(reactionText({ mode: 'fusion', from: { Z: 98, N: 151 }, to: og.result, beam: 'Ca48', out: og.out }, 'pl').kid, /wyparowały z niego 3 neutrony/)
  const mt = collide(83, 126, 'Fe58')
  assert.match(reactionText({ mode: 'fusion', from: { Z: 83, N: 126 }, to: mt.result, beam: 'Fe58', out: mt.out }, 'pl').kid, /wyparował z niego 1 neutron\./)
  assert.match(reactionText({ mode: 'fusion', from: { Z: 98, N: 151 }, to: og.result, beam: 'Ca48', out: og.out }, 'de').kid, /^Das Calcium-48 .* 3 Neutronen/)
})
