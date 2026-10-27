// "Who am I?" (Quem sou eu?): a mystery element told by clues, from hard to easy; the player picks it
// from four. The clues come from the element's data and its own words (src/content), its name hidden.
// Fewer clues, more points. The HUD is ui/QuizHud.jsx; the plaza flies to the answer.
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

/** A text with the element's name (both languages, any case) and its symbol hidden. */
export function mask(text, el) {
  let out = text
  for (const name of new Set([nameOf(el, 'en'), nameOf(el, 'pt-pt')])) {
    out = out.replace(new RegExp(`(?<![\\p{L}])${esc(name)}(?![\\p{L}])`, 'giu'), '???')
  }
  return out.replace(symbolRe(el), (m, at, all) => (notTheElement(el, at, all) ? m : '???'))
}

/** The element's symbol where it may stand: in formulas too (Fe2O3, Fe(II), "2 Fe"), not inside a word
 *  (Ferro) and not after a degree sign (°C). */
export const symbolRe = el => new RegExp(`(?<![A-Za-z°])${esc(el.symbol)}(?![a-z])`, 'g')

// symbols that are also everyday words (pt "O", "Na", "No", "Os", "Se", "As"; en "I", "He", "In", "At"...)
const WORDY = new Set(['O', 'I', 'As', 'No', 'In', 'He', 'Na', 'Os', 'Se', 'At', 'Be', 'Am'])

/** Where a symbol's letters are not the element: a unit after a number (300 K, 5 V, 60 W), or a word
 *  that happens to be spelt like a symbol, followed by more words ("O meu", "I am", "Na água"). */
export function notTheElement(el, at, all) {
  const s = el.symbol
  if (s.length === 1 && /\d\s$/.test(all.slice(Math.max(0, at - 2), at)) && /^($|[\s.,;:)])/.test(all.slice(at + 1, at + 2))) return true
  return WORDY.has(s) && /^\s\p{Ll}/u.test(all.slice(at + s.length, at + s.length + 2))
}

/** Whether a text still says the element's symbol somewhere. */
export const saysSymbol = (text, el) => [...text.matchAll(symbolRe(el))].some(m => !notTheElement(el, m.index, text))

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
}

const TAG = { 'pt-pt': 'pt-PT', en: 'en' }
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
  const facts = (words('facts') ?? []).map(f => mask(f, el)).filter(fine)
  const uses = (words('uses') ?? []).map(u => mask(u, el)).filter(fine)
  if (facts.length) out.push(L.fact(facts[q.seed % facts.length]))
  if (uses.length) out.push(L.use(uses[(q.seed >> 3) % uses.length]))
  if (level === 'scientist') {
    if (el.ancient) out.push(L.ancient)
    else if (el.discovered) out.push(el.discoverers ? L.yearBy(el.discovered, mask(el.discoverers, el), f) : L.year(el.discovered, f))
    out.push(el.statePredicted || !el.state ? L.statePredicted : `${state[el.state]}${el.melt != null ? ` ${L.melts(temperature(el.melt, 'scientist', TAG[lang]))}` : ''}`)
    out.push(L.family(familyName.toLowerCase()))
    out.push(L.place(el.period, el.group))
    out.push(L.protons(el.z))
  } else {
    out.push(el.statePredicted || !el.state ? L.statePredicted : state[el.state])
    out.push(L.family(familyName.toLowerCase()))
    out.push(L.hands(el.family === 'noble-gas' ? 0 : Math.min(4, bondCount(el))))
    out.push(el.ancient ? L.ancient : L.year(el.discovered, f))
    out.push(L.protons(el.z))
    out.push(L.letter(el.symbol[0]))
  }
  return out
}

/** Points for a right answer after seeing `shown` of `total` clues: more for fewer. */
export const points = (shown, total) => Math.max(1, total + 1 - shown)

