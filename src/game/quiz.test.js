import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ELEMENTS, nameOf } from '../data/elements.js'
import { makeQuestion, cluesFor, mask, poolOf, KID_POOL, points, saysSymbol } from './quiz.js'

const content = {}
for (const e of ELEMENTS) content[e.symbol] = (await import(`../content/${e.symbol}.js`)).default

// a seeded random number generator, so the questions are the same every run
const seeded = (s = 1) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646

test('names and symbols are hidden, words that only start like them are not', () => {
  const fe = ELEMENTS.find(e => e.symbol === 'Fe')
  assert.equal(mask('Steel (iron with a little carbon)', fe), 'Steel (??? with a little carbon)')
  assert.equal(mask('Fe2O3 + 3 CO → 2 Fe', fe), '???2O3 + 3 CO → 2 ???')
  assert.equal(mask('O Ferro e a ferrugem', fe), 'O ??? e a ferrugem')
  const c = ELEMENTS.find(e => e.symbol === 'C')
  const k = ELEMENTS.find(e => e.symbol === 'K')
  assert.equal(mask('C + O2 makes CO2 at 700 °C', c), '??? + O2 makes ???O2 at 700 °C')
  assert.equal(mask('KCl melts at 1044 K.', k), '???Cl melts at 1044 K.')
  const o = ELEMENTS.find(e => e.symbol === 'O')
  assert.equal(mask('O meu O2 e o O3.', o), 'O meu ???2 e o ???3.')
  const i = ELEMENTS.find(e => e.symbol === 'I')
  assert.equal(mask('I am in salt as I- ions.', i), 'I am in salt as ???- ions.')
})

const el = s => ELEMENTS.find(e => e.symbol === s)

test('Polish: the name is hidden in every case and in words made from it', () => {
  assert.equal(mask('Węgiel, węgla, węglem i węglu.', el('C'), 'pl'), '???, ???, ??? i ???.')
  assert.equal(mask('Dwutlenek węgla to CO2, a węglowodory palą się.', el('C'), 'pl'), 'Dwutlenek ??? to ???O2, a ??? palą się.')
  assert.equal(mask('Tlen i tlenu w powietrzu; dwutlenek, O2.', el('O'), 'pl'), '??? i ??? w powietrzu; ???, ???2.')
  assert.equal(mask('Srebro, srebra, srebrem, w srebrze; srebrny medal.', el('Ag'), 'pl'), '???, ???, ???, w ???; ??? medal.')
  assert.equal(mask('Złota maska: złoto nie rdzewieje, nawet w złocie.', el('Au'), 'pl'), '??? maska: ??? nie rdzewieje, nawet w ???.')
  assert.equal(mask('Sód i sodu, w sodzie; NaCl to sól.', el('Na'), 'pl'), '??? i ???, w ???; ???Cl to sól.')
  assert.equal(mask('Wodór, wodoru, w wodorze; wodorotlenek.', el('H'), 'pl'), '???, ???, w ???; ???.')
  assert.equal(mask('Ołów, ołowiu, ołowiem; ołówek.', el('Pb'), 'pl'), '???, ???, ???; ???.')
  assert.equal(mask('Wapń i wapnia; miedź, miedzi, miedziany.', el('Ca'), 'pl'), '??? i ???; miedź, miedzi, miedziany.')
  assert.equal(mask('Miedź, miedzi, miedzią; miedziany drut.', el('Cu'), 'pl'), '???, ???, ???; ??? drut.')
  assert.equal(mask('Siarka, siarki, w siarce; siarkowy.', el('S'), 'pl'), '???, ???, w ???; ???.')
  assert.equal(mask('Azot, azotu, w azocie.', el('N'), 'pl'), '???, ???, w ???.')
  // a short name takes only its endings: "cynk" (zinc) is not "cyna" (tin)
  assert.equal(mask('Cyna, cyny, cyną; cynk to co innego.', el('Sn'), 'pl'), '???, ???, ???; cynk to co innego.')
})

test('Polish: words spelt like symbols are left alone, the symbols are hidden', () => {
  assert.equal(mask('W 1783 roku bracia otrzymali wolfram. W Szwecji też. Symbol W, 60 W.', el('W'), 'pl'), 'W 1783 roku bracia otrzymali ???. W Szwecji też. Symbol ???, 60 W.')
  assert.equal(mask('Na Ziemi jest dużo sodu, a Na+ jest w soli.', el('Na'), 'pl'), 'Na Ziemi jest dużo ???, a ???+ jest w soli.')
  assert.equal(mask('Po wojnie polon (Po) badano dalej.', el('Po'), 'pl'), 'Po wojnie ??? (???) badano dalej.')
  assert.equal(mask('Co roku powstaje kobalt; CoCl2 jest różowy.', el('Co'), 'pl'), 'Co roku powstaje ???; ???Cl2 jest różowy.')
  assert.equal(mask('Ołów i O2.', el('O'), 'pl'), 'Ołów i ???2.')
  assert.equal(mask('I to jest jod, I2.', el('I'), 'pl'), 'I to jest ???, ???2.')
  assert.equal(mask('U ludzi uran (U) się nie gromadzi.', el('U'), 'pl'), 'U ludzi ??? (???) się nie gromadzi.')
  assert.ok(!saysSymbol('W temperaturze pokojowej jestem ciałem stałym.', el('W'), 'pl'))
  assert.ok(saysSymbol('Jego symbol to W.', el('W'), 'pl'))
})

test('German: the name is hidden in its cases and compounds, words spelt like symbols are left alone', () => {
  assert.equal(mask('Kohlenstoff, des Kohlenstoffs, ein Kohlenstoffatom und Luftsauerstoff.', el('C'), 'de'), '???, des ???, ein ??? und Luftsauerstoff.')
  assert.equal(mask('Sauerstoff im Luftsauerstoff, O2 und Ozon.', el('O'), 'de'), '??? im ???, ???2 und Ozon.')
  assert.equal(mask('Die Goldmaske ist golden: Gold rostet nie, goldene Farbe.', el('Au'), 'de'), 'Die ??? ist ???: ??? rostet nie, ??? Farbe.')
  assert.equal(mask('Blei bleibt weich; ein Bleirohr ist bleihaltig.', el('Pb'), 'de'), '??? bleibt weich; ein ??? ist ???.')
  assert.equal(mask('Eisenerz und Eisens; reisen und beweisen.', el('Fe'), 'de'), '??? und ???; reisen und beweisen.')
  // umlauts are letters: Für is not fluorine, Hälfte not hydrogen
  assert.equal(mask('Für Zahnpasta: Fluorid. F2 ist ein Gas.', el('F'), 'de'), 'Für Zahnpasta: ???. ???2 ist ein Gas.')
  assert.equal(mask('Die Hälfte des Wasserstoffs, H2O.', el('H'), 'de'), 'Die Hälfte des ???, ???2O.')
  assert.equal(mask('Es ist schwer zu machen. Es wurde 1952 gefunden; Symbol Es.', el('Es'), 'de'), 'Es ist schwer zu machen. Es wurde 1952 gefunden; Symbol ???.')
  assert.equal(mask('Er leuchtet rosa: Erbium, Er2O3.', el('Er'), 'de'), 'Er leuchtet rosa: ???, ???2O3.')
  assert.equal(mask('In Bildschirmen steckt Indium (In).', el('In'), 'de'), 'In Bildschirmen steckt ??? (???).')
  assert.equal(mask('Am Ende: Americium, Am-241.', el('Am'), 'de'), 'Am Ende: ???, ???-241.')
})

test('every question has four different options with the answer among them', () => {
  const rng = seeded(7)
  for (const level of ['explorer', 'scientist']) {
    for (let i = 0; i < 200; i++) {
      const q = makeQuestion(level, rng)
      assert.equal(new Set(q.options).size, 4)
      assert.ok(q.options.includes(q.answer))
      const pool = poolOf(level).map(e => e.z)
      assert.ok(q.options.every(z => pool.includes(z)))
    }
  }
  assert.equal(KID_POOL.length, poolOf('explorer').length)
  assert.ok(poolOf('explorer').every(Boolean))
})

test('every element has at least five clues in every language, and none says its name', () => {
  for (const el of ELEMENTS) {
    for (const lang of ['pt-pt', 'en', 'pl', 'de']) {
      for (const level of ['explorer', 'scientist']) {
        for (const seed of [0, 1, 2, 3, 5, 8, 13]) {
          const clues = cluesFor({ answer: el.z, seed }, content[el.symbol], lang, level, 'family')
          assert.ok(clues.length >= 5, `${el.symbol} ${lang} ${level}: ${clues.length} clues`)
          for (const c of clues) {
            for (const name of new Set([nameOf(el, 'en'), nameOf(el, 'pt-pt'), nameOf(el, lang)])) {
              assert.ok(!new RegExp(`(?<![\\p{L}])${name}(?![\\p{L}])`, 'iu').test(c), `${el.symbol} ${lang} ${level}: "${c}"`)
            }
            // German compounds and cases start with the name (Kohlenstoffatom, Eisens)
            if (lang === 'de') assert.ok(!new RegExp(`(?<![\\p{L}])${nameOf(el, 'de')}`, 'u').test(c), `${el.symbol} de ${level}: "${c}"`)
            // (the last clue, the symbol's first letter, is meant to give a one-letter symbol away)
            if (!/symbol starts|símbolo começa|symbol zaczyna|Symbol beginnt/.test(c)) assert.ok(!saysSymbol(c, el, lang), `${el.symbol} ${lang} symbol in "${c}"`)
            // (German "null" is zero: "nahezu null Wärmeausdehnung")
            assert.ok(!(lang === 'de' ? /undefined|NaN/ : /undefined|NaN|\bnull\b/).test(c), `${el.symbol} ${lang}: "${c}"`)
          }
        }
      }
    }
  }
})

test('fewer clues, more points', () => {
  assert.equal(points(1, 7), 7)
  assert.equal(points(7, 7), 1)
  assert.equal(points(9, 7), 1)
})
