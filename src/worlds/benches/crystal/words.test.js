import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CODES } from '../../../i18n/langs.js'
import { COMPOUNDS, STRUCTURES } from './lattice.js'
import { FINDS } from './plan.js'
import { TABLES, ui, statusText, partyText, aboutText, tapText, grainText, findName, complicatedText, ions, ionSym, sub, num, sciNum, lengthText, compoundName } from './words.js'

const BAD = /undefined|NaN|\bnull\b|\[object|\{\{|\}\}|=>/
const LEVELS = ['explorer', 'scientist']

/** A text the bench shows: a non-empty string with no hole in it and no em dash. */
function ok(text, where) {
  assert.equal(typeof text, 'string', `${where}: not a string`)
  assert.ok(text.trim().length > 0, `${where}: empty`)
  assert.ok(!BAD.test(text), `${where}: "${text}"`)
  assert.ok(!text.includes('—'), `${where}: an em dash in "${text}"`)
}

/** The same keys and kinds as English, all the way down. */
function sameShape(en, other, where) {
  if (typeof en === 'string' || typeof en === 'function') {
    assert.equal(typeof other, typeof en, where)
    return
  }
  assert.deepEqual(Object.keys(other).sort(), Object.keys(en).sort(), where)
  for (const k of Object.keys(en)) sameShape(en[k], other[k], `${where}.${k}`)
}

test('every language has every text of English, at both depths', () => {
  for (const lang of CODES) {
    assert.ok(TABLES.WORDS[lang], lang)
    sameShape(TABLES.WORDS.en, TABLES.WORDS[lang], lang)
    assert.deepEqual(Object.keys(TABLES.ION_NAMES[lang]).sort(), Object.keys(TABLES.ION_NAMES.en).sort(), lang)
    assert.deepEqual(Object.keys(TABLES.POLY[lang]).sort(), ['4', '6', '8'])
  }
})

test('every sentence for every compound, language and depth reads whole', () => {
  for (const lang of CODES) {
    const W = ui(lang)
    for (const [k, v] of Object.entries(W)) {
      if (typeof v === 'string') ok(v, `${lang} ui.${k}`)
      else if (typeof v === 'function') ok(v('Ana'), `${lang} ui.${k}`)
      else for (const [m, t] of Object.entries(v)) ok(t, `${lang} ui.${k}.${m}`)
    }
    for (const level of LEVELS) {
      ok(complicatedText(lang, level), `${lang} complicated ${level}`)
      for (const c of COMPOUNDS) {
        const where = `${lang} ${level} ${c.id}`
        for (const phase of ['waiting', 'drift', 'seed']) ok(statusText(phase, c.id, lang, level), `${where} ${phase}`)
        for (const kind of ['perfect', 'between', 'hopper']) ok(partyText(kind, c.id, lang, level), `${where} ${kind}`)
        const about = aboutText(c.id, lang, level)
        ok(about.structure, `${where} structure`)
        ok(about.medium, `${where} medium`)
        const cn = STRUCTURES[c.structure].cn
        for (const [sym, other, k] of [[c.cation, c.anion, 0], [c.anion, c.cation, 1]]) {
          for (let n = 1; n <= cn[k]; n++) ok(tapText({ sym, other, n, cn: cn[k] }, c.id, lang, level), `${where} tap ${sym} ${n}`)
        }
        ok(grainText({ across: 4.3e-9, times: 70000 }, c.id, lang, level), `${where} grain`)
        ok(compoundName(c.id, lang), `${where} name`)
      }
    }
    for (const f of FINDS) ok(findName(f, lang), `${lang} find ${f}`)
  }
})

test('Polish and German are their own, not English', () => {
  for (const lang of ['pl', 'de', 'pt-pt']) {
    for (const level of LEVELS) {
      assert.notEqual(partyText('hopper', 'NaCl', lang, level), partyText('hopper', 'NaCl', 'en', level))
      assert.notEqual(aboutText('CaF2', lang, level).medium, aboutText('CaF2', 'en', level).medium)
    }
  }
})

test('Polish counts: 1 jon, 2 to 4 jony, 5 and up jonów (12 to 14 too), German one and other', () => {
  assert.equal(ions('Cl', 1, 'pl'), 'jon chlorkowy')
  assert.equal(ions('Cl', 3, 'pl'), 'jony chlorkowe')
  assert.equal(ions('Cl', 4, 'pl'), 'jony chlorkowe')
  assert.equal(ions('Cl', 6, 'pl'), 'jonów chlorkowych')
  assert.equal(ions('Na', 8, 'pl'), 'jonów sodu')
  assert.equal(ions('Na', 12, 'pl'), 'jonów sodu')
  assert.equal(ions('Na', 22, 'pl'), 'jony sodu')
  assert.equal(ions('Na', 1, 'de'), 'Natrium-Ion')
  assert.equal(ions('Na', 6, 'de'), 'Natrium-Ionen')
  assert.equal(ions('O', 1, 'pt-pt'), 'ião óxido')
  assert.equal(ions('O', 4, 'pt-pt'), 'iões óxido')
  assert.match(tapText({ sym: 'Na', other: 'Cl', n: 6, cn: 6 }, 'NaCl', 'pl', 'explorer'), /przytula 6 jonów chlorkowych/)
  assert.match(tapText({ sym: 'Ca', other: 'F', n: 4, cn: 8 }, 'CaF2', 'pl', 'explorer'), /4 jony fluorkowe/)
})

test('formulas, charges and numbers as people write them', () => {
  assert.equal(sub('CaF2'), 'CaF₂')
  assert.equal(sub('2 H2O'), '2 H₂O')
  assert.equal(sub('Mg(OH)2'), 'Mg(OH)₂')
  assert.equal(ionSym('Na'), 'Na⁺')
  assert.equal(ionSym('Mg'), 'Mg²⁺')
  assert.equal(ionSym('O'), 'O²⁻')
  assert.equal(num(3375, 'de'), '3375')
  assert.equal(num(12345, 'en'), '12,345')
  assert.equal(num(564.0, 'pl', 1), '564,0')
  assert.equal(sciNum(1.2e18, 'en'), '1.2 × 10¹⁸')
  assert.equal(sciNum(6.02e17, 'de'), '6,0 × 10¹⁷')
  assert.equal(lengthText(4.3e-9, 'en'), '4.3 nm')
  assert.equal(lengthText(3e-4, 'pt-pt'), '300 µm')
})
