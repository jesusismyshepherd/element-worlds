// "Who am I?" (Quem sou eu?): a mystery element told by clues, from hard to easy; the player picks it
// from four. The clues come from the element's data and its own words (src/content), its name hidden.
// Fewer clues, more points. The HUD is ui/QuizHud.jsx; the plaza flies to the answer.
import { discoverersOf } from '../data/discovery.js'
import { tagOf } from '../i18n/langs.js'
import { ELEMENTS, nameOf } from '../data/elements.js'
import { bondCount } from '../chem/atom.js'
import { temperature } from '../ui/format.js'

/** The Explorer's elements: the ones a ten-year-old meets (in the kitchen, the sky, the news, a medal). */
export const KID_POOL = [
  'H', 'He', 'Li', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Ti', 'Cr',
  'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Br', 'Kr', 'Ag', 'Sn', 'I', 'Xe', 'W', 'Pt', 'Au', 'Hg', 'Pb', 'Rn', 'Ra', 'U', 'Pu',
]

export const poolOf = level => (level === 'scientist' ? ELEMENTS : KID_POOL.map(s => ELEMENTS.find(e => e.symbol === s)))

const pickOne = (list, rng) => list[Math.floor(rng() * list.length)]

/** A new question: the answer, four options (one of the same family when there is one), a seed for
 *  choosing which fact and use to tell. */
export function makeQuestion(level, rng = Math.random, avoid = []) {
  const pool = poolOf(level)
  const fresh = pool.filter(e => !avoid.includes(e.z))
  const answer = pickOne(fresh.length ? fresh : pool, rng)
  const others = pool.filter(e => e.z !== answer.z)
  const kin = others.filter(e => e.family === answer.family)
  const options = [answer]
  if (kin.length) options.push(pickOne(kin, rng))
  while (options.length < 4) {
    const e = pickOne(others, rng)
    if (!options.includes(e)) options.push(e)
  }
  // shuffled
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }
  return { answer: answer.z, options: options.map(e => e.z), seed: Math.floor(rng() * 1e6) }
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const whole = (body, flags = 'giu') => new RegExp(`(?<![\\p{L}])(?:${body})(?![\\p{L}])`, flags)

// Polish endings after a name's stem: the cases (węgla, węglem, węglu) and the adjectives made from it
// (węglowy, srebrny, miedziany, rtęciowy, złotego, litowo-jonowy). Short stems (bor, sód, rad) take only
// these; longer ones take any letters after them (ołówek, tlenek) and a few prefixes before them
// (dwutlenek, wodorotlenek, nadtlenek, ocynkowany, pozłacany), but not any letters before (terb is in
// "Ytterby" and "iterb", cyna in "medycyna").
const PL_END = [
  'a', 'u', 'y', 'i', 'e', 'ę', 'ą', 'o', 'em', 'ie', 'iu', 'ia', 'ią', 'iem', 'om', 'ami', 'ach', 'ów', 'owi',
  'owy', 'owa', 'owe', 'owego', 'owej', 'owemu', 'owym', 'owych', 'owo', 'ny', 'na', 'ne', 'nego', 'nej', 'nym', 'nych',
  'iany', 'iana', 'iane', 'ianego', 'ianej', 'ianym', 'ianych', 'iowy', 'iowa', 'iowe', 'iowego', 'iowej', 'iowym', 'iowych', 'iowo',
  'ego', 'ej', 'ym', 'ych', 'emu',
]
const PL_PREFIX = '(?:dwu|trój|tri|di|mono|nad|pod|wodoro|po|o|prze|bez)?'
const PL_CONSONANT_END = /[^aeiouyąęó]+$/

// German compounds with the name at the end (Gusseisen, Lötzinn, Weißgold, Flüssigxenon) or, for names
// of six letters or more, anywhere (erbiumdotiert, Luftsauerstoff); these words only look like one
// (reisen, beweisen, Quecksilber, Ytterbium, Protactinium, Jargon) and are left alone
const DE_NOT_AFTER = { Eisen: /(?:^\p{L}?|[rwpkm])$/iu, Silber: /queck$/i, Terbium: /yt$/i, Actinium: /prot$/i, Argon: /j$/i }
// and forms not spelt like the name (gusseiserne Pfannen)
const DE_ALSO = { Eisen: ['eisern'] }

/** The stems a Polish element name is declined on: węgiel (węgl-a), wapń (wapni-a), miedź (miedz-i), rtęć
 *  (rtęc-i), wodór (wodor-u), ołów (ołow-iu), siarka (siark-i), złoto (złot-a), nobel (nobl-a); and the
 *  softened ones that only take -e or -ie (azot: azocie, sód: sodzie, wodór: wodorze, siarka: siarce,
 *  złoto: złocie). */
export function polishStems(name) {
  const b = name.toLowerCase()
  const stems = new Set([b])
  if (/iel$/.test(b)) stems.add(b.slice(0, -3) + 'l')
  else if (/[^aeiouyąęó]el$/.test(b)) stems.add(b.slice(0, -2) + 'l')
  if (/ń$/.test(b)) stems.add(b.slice(0, -1) + 'ni')
  if (/ź$/.test(b)) stems.add(b.slice(0, -1) + 'z')
  if (/ć$/.test(b)) stems.add(b.slice(0, -1) + 'c')
  if (/ó[^aeiouyąęó]+$/.test(b)) stems.add(b.replace(/ó(?=[^aeiouyąęó]+$)/, 'o'))
  if (/[ao]$/.test(b)) stems.add(b.slice(0, -1))
  const soft = new Set()
  for (const s of stems) {
    if (!PL_CONSONANT_END.test(s)) continue
    if (s.endsWith('t')) soft.add(s.slice(0, -1) + 'c')
    else if (s.endsWith('d') || s.endsWith('r')) soft.add(s + 'z')
    else if (s.endsWith('k')) soft.add(s.slice(0, -1) + 'c')
  }
  return { stems: [...stems], soft: [...soft] }
}

/** The patterns that find an element's name in a text of a language: its English and Portuguese names
 *  everywhere (as before), and in Polish its declined forms, in German its cases and compounds
 *  (Kohlenstoffs, Kohlenstoffatom, Luftsauerstoff, Gusseisen, golden, eisenhaltig). Each is
 *  { re, keep? }: keep(word) says a match is not the element after all. */
export function namePatterns(el, lang) {
  const out = [...new Set([nameOf(el, 'en'), nameOf(el, 'pt-pt'), ...(lang === 'pl' || lang === 'de' ? [nameOf(el, lang)] : [])])].map(n => ({ re: whole(esc(n)) }))
  if (lang === 'pl') {
    const { stems, soft } = polishStems(nameOf(el, 'pl'))
    const long = stems.filter(s => s.length >= 4).map(esc)
    const short = stems.filter(s => s.length < 4).map(esc)
    const body = [
      long.length && `${PL_PREFIX}(?:${long.join('|')})\\p{L}*`,
      short.length && `(?:${short.join('|')})(?:${PL_END.join('|')})?`,
      soft.length && `(?:${soft.map(esc).join('|')})i?e`,
    ].filter(Boolean)
    out.unshift({ re: whole(body.join('|')) })
  }
  if (lang === 'de') {
    const name = nameOf(el, 'de')
    const lower = name.toLowerCase()
    // a capitalised word that starts with the name: its genitive and every compound (case-sensitive, so
    // "bleiben" is not lead); lowercase adjectives made from it
    out.unshift({ re: whole(`${esc(name)}\\p{L}*`, 'gu') })
    out.unshift({ re: whole(`${esc(lower)}(?:(?:n|en|ern)(?:e|en|er|es|em)?|(?:haltig|farben|farbig|artig|rot|gelb|grau|weiß|grün|blau)\\p{L}*)`, 'gu') })
    // compounds with the name inside or at the end
    const notAfter = DE_NOT_AFTER[name]
    const keep = w => !!notAfter && notAfter.test(w.slice(0, w.toLowerCase().indexOf(lower)))
    if (lower.length >= 6) out.unshift({ re: whole(`\\p{L}*${esc(lower)}\\p{L}*`), keep })
    else if (lower.length >= 4) out.unshift({ re: whole(`\\p{L}{2,}${esc(lower)}(?:s|es|e|en|n|er|ern)?`), keep })
    for (const also of DE_ALSO[name] ?? []) out.unshift({ re: whole(`\\p{L}*${esc(also)}\\p{L}*`) })
  }
  return out
}

/** A text with the element's name (in the text's language and in English and Portuguese, any case, in
 *  Polish declined, in German in compounds) and its symbol hidden. */
export function mask(text, el, lang) {
  let out = text
  for (const { re, keep } of namePatterns(el, lang)) out = out.replace(re, w => (keep?.(w) ? w : '???'))
  return out.replace(symbolRe(el), (m, at, all) => (notTheElement(el, at, all, lang) ? m : '???'))
}

/** The element's symbol where it may stand: in formulas too (Fe2O3, Fe(II), "2 Fe"), not inside a word
 *  (Ferro, Für, Ołów: any letter, not only a-z) and not after a degree sign (°C). */
export const symbolRe = el => new RegExp(`(?<![\\p{L}°])${esc(el.symbol)}(?![\\p{Ll}])`, 'gu')

// symbols that are also everyday words, by language: pt "O", "Na", "No", "Os", "Se", "As" and en "I",
// "He", "In", "At"... (one list for both, as it has always been); pl "W" (in), "I" (and), "O" (about),
// "U" (at), "Na" (on), "Po" (after), "Co" (what), "Ta" and "Te" (this, these), "Ni" (nor), "No" (well);
// de "In", "Am" (at the), "Es" (it), "Er" (he). Polish and German words like these are followed by
// any word (W Polsce, Am Ende) and Polish ones by a year too (W 1774 roku).
const WORDY = {
  base: new Set(['O', 'I', 'As', 'No', 'In', 'He', 'Na', 'Os', 'Se', 'At', 'Be', 'Am']),
  pl: new Set(['I', 'W', 'O', 'U', 'Na', 'Po', 'Co', 'Ta', 'Ni', 'Te', 'No']),
  de: new Set(['In', 'Am', 'Es', 'Er']),
}
// (a hidden name, "???", counts as a word: "In ???GaN-LEDs")
const WORD_AFTER = { base: /^\s[\p{Ll}?]/u, pl: /^\s[\p{L}\d?]/u, de: /^\s[\p{L}?]/u }

/** Where a symbol's letters are not the element: a unit after a number (300 K, 5 V, 60 W), or a word
 *  that happens to be spelt like a symbol, followed by more words ("O meu", "I am", "Na água"), unless
 *  the text calls it a symbol ("symbol W", "Symbol Es"). */
export function notTheElement(el, at, all, lang) {
  const s = el.symbol
  if (s.length === 1 && /\d\s$/.test(all.slice(Math.max(0, at - 2), at)) && /^($|[\s.,;:)])/.test(all.slice(at + 1, at + 2))) return true
  if (/s[ií]mbol\p{L}*[\s:„“”"'«»]+$/iu.test(all.slice(Math.max(0, at - 16), at))) return false
  const words = WORDY[lang] ?? WORDY.base
  const after = WORD_AFTER[lang] ?? WORD_AFTER.base
  return words.has(s) && after.test(all.slice(at + s.length, at + s.length + 2))
}

/** Whether a text still says the element's symbol somewhere. */
export const saysSymbol = (text, el, lang) => [...text.matchAll(symbolRe(el))].some(m => !notTheElement(el, m.index, text, lang))

const W = {
  en: {
    fact: f => `A fact about me: ${f}`,
    use: u => `I am used for this: ${u}`,
    state: { solid: 'At room temperature I am a solid.', liquid: 'At room temperature I am a liquid.', gas: 'At room temperature I am a gas.' },
    statePredicted: 'Nobody has seen enough of me to say if I am a solid, a liquid or a gas.',
    melts: m => `I melt at ${m}.`,
    family: f => `I am one of the ${f}.`,
    hands: n => (n === 0 ? 'My Atomling has no hands: I hardly ever join other atoms.' : `My Atomling has ${n} hand${n > 1 ? 's' : ''}.`),
    ancient: 'People have known me since ancient times.',
    year: y => `I was discovered in ${y}.`,
    yearBy: (y, by) => `I was discovered in ${y}, by ${by}.`,
    config: c => `My electrons: ${c}.`,
    place: (p, g) => (g ? `I sit in row ${p}, column ${g} of the table.` : `I sit in row ${p} of the table, in the two long rows at the bottom.`),
    protons: z => `Every one of my atoms has ${z} protons.`,
    letter: l => `My symbol starts with ${l}.`,
  },
  'pt-pt': {
    fact: f => `Um facto sobre mim: ${f}`,
    use: u => `Sirvo para isto: ${u}`,
    state: { solid: 'À temperatura ambiente, sou sólido.', liquid: 'À temperatura ambiente, sou líquido.', gas: 'À temperatura ambiente, sou um gás.' },
    stateF: { solid: 'À temperatura ambiente, sou sólida.', liquid: 'À temperatura ambiente, sou líquida.', gas: 'À temperatura ambiente, sou um gás.' },
    statePredicted: 'Ninguém viu o suficiente de mim para dizer se sou sólido, líquido ou gás.',
    melts: m => `Fundo a ${m}.`,
    family: f => `Pertenço aos ${f}.`,
    hands: n => (n === 0 ? 'O meu Atomito não tem mãos: quase nunca me junto a outros átomos.' : `O meu Atomito tem ${n} ${n > 1 ? 'mãos' : 'mão'}.`),
    ancient: 'As pessoas conhecem-me desde a Antiguidade.',
    year: (y, f) => `Fui descobert${f ? 'a' : 'o'} em ${y}.`,
    yearBy: (y, by, f) => `Fui descobert${f ? 'a' : 'o'} em ${y}, por ${by}.`,
    config: c => `Os meus eletrões: ${c}.`,
    place: (p, g) => (g ? `Estou na linha ${p}, coluna ${g} da tabela.` : `Estou na linha ${p} da tabela, nas duas linhas compridas de baixo.`),
    protons: z => `Todos os meus átomos têm ${z} protões.`,
    letter: l => `O meu símbolo começa por ${l}.`,
  },
  // Polish: no clue needs the name's gender (jestem ciałem stałym, odkryto mnie) or a case of it
  pl: {
    fact: f => `Ciekawostka o mnie: ${f}`,
    use: u => `Tak się mnie używa: ${u}`,
    state: { solid: 'W temperaturze pokojowej jestem ciałem stałym.', liquid: 'W temperaturze pokojowej jestem cieczą.', gas: 'W temperaturze pokojowej jestem gazem.' },
    statePredicted: 'Nikt nie widział mnie w takiej ilości, żeby powiedzieć, czy jestem ciałem stałym, cieczą czy gazem.',
    melts: m => `Topię się w temperaturze ${m}.`,
    family: f => `Moja rodzina to ${f}.`,
    hands: n => (n === 0 ? 'Mój Atomek nie ma rąk: prawie nigdy nie łączę się z innymi atomami.' : `Mój Atomek ma ${n} ${plN(n, 'rękę', 'ręce', 'rąk')}.`),
    ancient: 'Ludzie znają mnie od starożytności.',
    year: y => `Odkryto mnie w ${y} roku.`,
    yearBy: (y, by) => `Odkryto mnie w ${y} roku. Kto mnie odkrył: ${by}.`,
    config: c => `Moje elektrony: ${c}.`,
    place: (p, g) => (g ? `Siedzę w wierszu ${p}, w kolumnie ${g} układu okresowego.` : `Siedzę w wierszu ${p} układu okresowego, w jednym z dwóch długich wierszy na dole.`),
    protons: z => `Każdy mój atom ma ${z} ${plN(z, 'proton', 'protony', 'protonów')}.`,
    letter: l => `Mój symbol zaczyna się na literę ${l}.`,
  },
  // German: family names are nouns and keep their capital (zur Familie der Edelgase)
  de: {
    nounCase: s => s,
    fact: f => `Etwas über mich: ${f}`,
    use: u => `Dafür braucht man mich: ${u}`,
    state: { solid: 'Bei Raumtemperatur bin ich ein Feststoff.', liquid: 'Bei Raumtemperatur bin ich eine Flüssigkeit.', gas: 'Bei Raumtemperatur bin ich ein Gas.' },
    statePredicted: 'Niemand hat genug von mir gesehen, um zu sagen, ob ich fest, flüssig oder gasförmig bin.',
    melts: m => `Ich schmelze bei ${m}.`,
    family: f => `Ich gehöre zur Familie der ${f}.`,
    hands: n => (n === 0 ? 'Mein Atomling hat keine Hände: Ich verbinde mich fast nie mit anderen Atomen.' : `Mein Atomling hat ${n} ${n === 1 ? 'Hand' : 'Hände'}.`),
    ancient: 'Die Menschen kennen mich schon seit dem Altertum.',
    year: y => `Ich wurde ${y} entdeckt.`,
    yearBy: (y, by) => `Ich wurde ${y} von ${by} entdeckt.`,
    config: c => `Meine Elektronen: ${c}.`,
    place: (p, g) => (g ? `Ich sitze in Zeile ${p}, Spalte ${g} des Periodensystems.` : `Ich sitze in Zeile ${p} des Periodensystems, in den zwei langen Zeilen unten.`),
    protons: z => `Jedes meiner Atome hat ${z} ${z === 1 ? 'Proton' : 'Protonen'}.`,
    letter: l => `Mein Symbol beginnt mit ${l}.`,
  },
}

// Polish nouns after a number: 1 rękę, 2 ręce, 5 rąk (12 to 14 "many", 22 to 24 "few")
const PL_PLURAL = new Intl.PluralRules('pl')
function plN(n, one, few, many) {
  const k = PL_PLURAL.select(n)
  return k === 'one' ? one : k === 'few' ? few : many
}

const FEMININE = new Set(['Ag', 'Pt']) // a prata, a platina

/**
 * The clues for a question, from hard to easy, in a language and at a depth. content is the element's
 * own words (src/content/<Symbol>.js) or null; familyName its family's name in that language.
 */
export function cluesFor(q, content, lang, level, familyName) {
  const el = ELEMENTS[q.answer - 1]
  const L = W[lang] ?? W.en
  const f = FEMININE.has(el.symbol)
  const state = (f && L.stateF) || L.state
  const depth = level === 'scientist' ? 'sci' : 'kid'
  const words = key => content?.[key]?.[lang]?.[depth] ?? content?.[key]?.[lang]?.kid ?? null
  const out = []
  // from the element's own words: a fact and a use, its name hidden (skipped if hiding it left nothing)
  const fine = t => t && t.replace(/\?\?\?/g, '').trim().length > 25
  const facts = (words('facts') ?? []).map(f => mask(f, el, lang)).filter(fine)
  const uses = (words('uses') ?? []).map(u => mask(u, el, lang)).filter(fine)
  const low = L.nounCase ?? (s => s.toLowerCase())
  if (facts.length) out.push(L.fact(facts[q.seed % facts.length]))
  if (uses.length) out.push(L.use(uses[(q.seed >> 3) % uses.length]))
  if (level === 'scientist') {
    if (el.ancient) out.push(L.ancient)
    else if (el.discovered) out.push(el.discoverers ? L.yearBy(el.discovered, mask(discoverersOf(el, lang), el, lang), f) : L.year(el.discovered, f))
    out.push(el.statePredicted || !el.state ? L.statePredicted : `${state[el.state]}${el.melt != null ? ` ${L.melts(temperature(el.melt, 'scientist', tagOf(lang)))}` : ''}`)
    out.push(L.family(low(familyName)))
    out.push(L.place(el.period, el.group))
    out.push(L.protons(el.z))
  } else {
    out.push(el.statePredicted || !el.state ? L.statePredicted : state[el.state])
    out.push(L.family(low(familyName)))
    out.push(L.hands(el.family === 'noble-gas' ? 0 : Math.min(4, bondCount(el))))
    out.push(el.ancient ? L.ancient : L.year(el.discovered, f))
    out.push(L.protons(el.z))
    out.push(L.letter(el.symbol[0]))
  }
  return out
}

/** Points for a right answer after seeing `shown` of `total` clues: more for fewer. */
export const points = (shown, total) => Math.max(1, total + 1 - shown)

