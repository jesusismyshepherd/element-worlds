// Growing Crystals' words (/lab/crystal), in every language (i18n/langs.js: pt-pt, en, pl, de; a missing
// one falls back to English) and at both depths (kid: Explorer, sci: Scientist). The bench's title is
// `bench.crystal.title` in the locale files; everything else the HUD says is here. words.test.js checks
// every table has every language and depth, no holes and no em dashes.
// Polish nouns after a count have three forms (1 jon, 2 jony, 5 jonów) and German two: `ions(sym, n)`
// picks one with Intl.PluralRules. Formulas get real subscripts (`sub`), charges real superscripts.
import { tagOf } from '../../../i18n/langs.js'
import { KNOWN } from '../../../chem/build.js'
import { COMPOUND, IONS, CATION, STRUCTURES, radiusOf, nearestDistance, radiusRatio, grainCount } from './lattice.js'

const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' }
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '+': '⁺', '-': '⁻', '−': '⁻' }
/** A formula with real subscripts: digits after a letter or a bracket ("2 H2O" -> 2 H₂O). */
export const sub = text => String(text).replace(/([A-Za-z)])(\d+)/g, (_, a, d) => a + [...d].map(c => SUB[c]).join(''))
/** An ion with its charge as a superscript: Na⁺, Mg²⁺, O²⁻. */
export function ionSym(sym) {
  const q = IONS[sym].q
  return `${sym}${Math.abs(q) > 1 ? SUP[Math.abs(q)] : ''}${q > 0 ? '⁺' : '⁻'}`
}
const supNum = n => String(n).split('').map(c => SUP[c] ?? c).join('')

const RULES = {}
const pluralOf = (n, lang) => (RULES[lang] ??= new Intl.PluralRules(tagOf(lang))).select(n)

/** A number in the language (no separator in four digits, a real minus). */
export function num(v, lang, digits = 0) {
  return new Intl.NumberFormat(tagOf(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(v).replace('-', '−')
}
/** A large number as m × 10ⁿ. */
export function sciNum(v, lang, digits = 1) {
  const e = Math.floor(Math.log10(v))
  return `${num(v / 10 ** e, lang, digits)} × 10${supNum(e)}`
}
/** A length in metres, in the unit that suits it (nm, µm, mm). */
export function lengthText(m, lang) {
  if (m < 1e-6) return `${num(m * 1e9, lang, m < 1e-8 ? 1 : 0)} nm`
  if (m < 1e-3) return `${num(m * 1e6, lang, m < 1e-5 ? 1 : 0)} µm`
  return `${num(m * 1e3, lang, 1)} mm`
}

// ---- the ions' names: [singular, plural] (Polish: one, few, many; German: one, other) ----
const ION_NAMES = {
  en: {
    Li: ['lithium ion', 'lithium ions'], Na: ['sodium ion', 'sodium ions'], K: ['potassium ion', 'potassium ions'],
    Mg: ['magnesium ion', 'magnesium ions'], Ca: ['calcium ion', 'calcium ions'], F: ['fluoride ion', 'fluoride ions'],
    Cl: ['chloride ion', 'chloride ions'], O: ['oxide ion', 'oxide ions'], S: ['sulfide ion', 'sulfide ions'], H: ['hydride ion', 'hydride ions'],
  },
  'pt-pt': {
    Li: ['ião lítio', 'iões lítio'], Na: ['ião sódio', 'iões sódio'], K: ['ião potássio', 'iões potássio'],
    Mg: ['ião magnésio', 'iões magnésio'], Ca: ['ião cálcio', 'iões cálcio'], F: ['ião fluoreto', 'iões fluoreto'],
    Cl: ['ião cloreto', 'iões cloreto'], O: ['ião óxido', 'iões óxido'], S: ['ião sulfureto', 'iões sulfureto'], H: ['ião hidreto', 'iões hidreto'],
  },
  pl: {
    Li: ['jon litu', 'jony litu', 'jonów litu'], Na: ['jon sodu', 'jony sodu', 'jonów sodu'], K: ['jon potasu', 'jony potasu', 'jonów potasu'],
    Mg: ['jon magnezu', 'jony magnezu', 'jonów magnezu'], Ca: ['jon wapnia', 'jony wapnia', 'jonów wapnia'],
    F: ['jon fluorkowy', 'jony fluorkowe', 'jonów fluorkowych'], Cl: ['jon chlorkowy', 'jony chlorkowe', 'jonów chlorkowych'],
    O: ['jon tlenkowy', 'jony tlenkowe', 'jonów tlenkowych'], S: ['jon siarczkowy', 'jony siarczkowe', 'jonów siarczkowych'],
    H: ['jon wodorkowy', 'jony wodorkowe', 'jonów wodorkowych'],
  },
  de: {
    Li: ['Lithium-Ion', 'Lithium-Ionen'], Na: ['Natrium-Ion', 'Natrium-Ionen'], K: ['Kalium-Ion', 'Kalium-Ionen'],
    Mg: ['Magnesium-Ion', 'Magnesium-Ionen'], Ca: ['Calcium-Ion', 'Calcium-Ionen'], F: ['Fluorid-Ion', 'Fluorid-Ionen'],
    Cl: ['Chlorid-Ion', 'Chlorid-Ionen'], O: ['Oxid-Ion', 'Oxid-Ionen'], S: ['Sulfid-Ion', 'Sulfid-Ionen'], H: ['Hydrid-Ion', 'Hydrid-Ionen'],
  },
}
const names = lang => ION_NAMES[lang] ?? ION_NAMES.en
/** An ion's name, singular. */
export const ionOne = (sym, lang) => names(lang)[sym][0]
/** An ion's name after the count n (Polish: 1 jon, 2 jony, 5 jonów; the plural for "many" without a count). */
export function ions(sym, n, lang) {
  const f = names(lang)[sym]
  if (lang === 'pl') {
    const k = pluralOf(n, 'pl')
    return k === 'one' ? f[0] : k === 'few' ? f[1] : f[2]
  }
  return n === 1 ? f[0] : f[1]
}
/** An ion's name in the plural, with no count (Polish: the "few" form, the nominative plural). */
const many = (sym, lang) => names(lang)[sym][1]
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

/** A compound's name (the lab's, chem/build.js), with or without what it is known as. */
export function compoundName(c, lang, { short = false } = {}) {
  const k = KNOWN.find(x => x.show === c)
  const n = k?.name?.[lang] ?? k?.name?.en ?? c
  return short ? n.replace(/\s*\(.*\)\s*$/, '') : n
}

// the values a sentence about a compound uses
function factsOf(c, lang) {
  const cmp = COMPOUND[c]
  const S = STRUCTURES[cmp.structure]
  return {
    c, cmp, lang,
    formula: sub(c),
    name: compoundName(c, lang),
    short: compoundName(c, lang, { short: true }),
    cat: cmp.cation,
    an: cmp.anion,
    catSym: ionSym(cmp.cation),
    anSym: ionSym(cmp.anion),
    rC: radiusOf(cmp, CATION),
    rA: radiusOf(cmp, 1),
    a: num(cmp.a, lang, 1).replace(/[.,]0$/, ''),
    d: num(nearestDistance(cmp), lang),
    ratio: num(radiusRatio(cmp), lang, 2),
    cn: S.cn,
    sol: cmp.solubility != null ? num(cmp.solubility, lang, cmp.solubility < 0.01 ? 4 : cmp.solubility < 1 ? 2 : 1) : null,
    melt: cmp.melt ? num(cmp.melt, lang) : null,
    water: cmp.water ? sub(cmp.water) : null,
    hydrate: cmp.water && !cmp.water.includes('→'),
  }
}

// ================= English =================
const EN = {
  ui: {
    compounds: 'Crystals', speed: { water: 'Evaporation', melt: 'Cooling' }, slow: { water: 'slow', melt: 'slow' }, fast: { water: 'fast', melt: 'fast' },
    newDish: 'New dish', inside: 'See inside', fullSize: 'Full size', grain: 'A real grain', back: 'Back to the crystal',
    from: { water: 'grows from water', melt: 'grows from a melt' }, found: 'Discoveries', about: 'About this crystal',
    help: 'Drag to turn · scroll or pinch to come closer · tap an ion to see its neighbours',
    by: n => `Started by ${n}`, together: 'Growing together: ', zooming: 'Width of the view', ionsIn: 'Ions in the crystals', close: 'Close',
    tapStart: { water: 'Tap the water', melt: 'Tap the melt' },
  },
  status: {
    waiting: {
      kid: v => (v.cmp.medium === 'water'
        ? `${cap(many(v.cat, 'en'))} and ${many(v.an, 'en')} drift in the water. Tap the water to let it evaporate!`
        : `${cap(many(v.cat, 'en'))} and ${many(v.an, 'en')} drift in the hot melt. Tap it to let it cool!`),
      sci: v => (v.cmp.medium === 'water'
        ? `${v.catSym} and ${v.anSym} ions, each in a shell of water molecules, wander at random (Brownian motion). Tap the water to start the evaporation.`
        : `Molten ${v.formula}: free ${v.catSym} and ${v.anSym} ions above the melting point. Tap the melt to start the cooling.`),
    },
    drift: {
      kid: v => (v.cmp.medium === 'water' ? 'The water dries up and the ions crowd together...' : 'The melt cools and the ions slow down...'),
      sci: v => (v.cmp.medium === 'water' ? 'The solution grows supersaturated; first a nucleus must form.' : 'Below the melting point the melt is supercooled; first a nucleus must form.'),
    },
    seed: {
      kid: 'A seed crystal! Watch the ions find their places.',
      sci: 'Nucleation: a cluster above the critical size survives and grows ion by ion.',
    },
  },
  party: {
    perfect: {
      kid: v => (v.c === 'NaCl' ? 'A perfect cube! That is why every grain of salt is a tiny cube: look at some with a magnifying glass.' : `A perfect cube of ${v.short}! Grown slowly, every ion found its place.`),
      sci: 'Layer growth at low supersaturation: each face grows one complete layer at a time, so the faces stay flat and the crystal is a cube.',
    },
    between: {
      kid: 'Grown quickly: the middles of its faces dip in a little. Faster still makes hopper crystals!',
      sci: 'Moderate supersaturation: the face centres begin to lag behind the edges (incipient hopper growth), and more nuclei form.',
    },
    hopper: {
      kid: v => `A hopper crystal! Grown fast, its edges raced ahead and its faces stayed hollow, like stairs going in.${v.cmp.medium === 'water' ? ' And look: salt boats floating on the water!' : ''}`,
      sci: v => `Hopper (skeletal) growth at high supersaturation: corners and edges reach further into the solution and get more solute (the Berg effect), so the face centres lag as stepped hollows.${v.cmp.medium === 'water' ? ' At the surface, “salt boats” grow: hollow pyramids upside down, floating.' : ''}`,
    },
  },
  tap: {
    kid: v => `This ${ionOne(v.sym, 'en')} hugs ${v.n} ${ions(v.other, v.n, 'en')}!${v.n < v.cn
      ? ` It sits on the outside; inside the crystal every ${ionOne(v.sym, 'en')} hugs ${v.cn}.`
      : ' It is the same everywhere inside: no pairs, no molecules, only neighbours.'}`,
    sci: v => `${v.mine} (r = ${v.rMine} pm): coordination number ${v.cn}, ${POLY.en[v.cn]} of ${v.theirs} (r = ${v.rTheirs} pm). Here ${v.n} of ${v.cn}${v.n < v.cn ? ' (a surface ion)' : ''}. ${v.sym}–${v.other} distance ${v.d} pm; a = ${v.a} pm.`,
  },
  structure: {
    rocksalt: {
      kid: v => `Rock salt pattern: like a chessboard in 3D. Every ${ionOne(v.cat, 'en')} sits between 6 ${ions(v.an, 6, 'en')}, and every ${ionOne(v.an, 'en')} between 6 ${ions(v.cat, 6, 'en')}.`,
      sci: v => `Rock-salt (halite) structure, Fm3̄m: two interpenetrating fcc lattices, coordination 6:6, 4 formula units per cell, a = ${v.a} pm. Radius ratio r₊/r₋ = ${v.ratio}.`,
    },
    fluorite: {
      kid: v => `Fluorite pattern: each ${ionOne(v.cat, 'en')} sits in a little cube of 8 ${ions(v.an, 8, 'en')}; each ${ionOne(v.an, 'en')} has 4 ${ions(v.cat, 4, 'en')} around it.`,
      sci: v => `Fluorite structure, Fm3̄m: ${v.catSym} on an fcc lattice, ${v.anSym} in all the tetrahedral holes; coordination 8:4, 4 formula units per cell, a = ${v.a} pm.`,
    },
    antifluorite: {
      kid: v => `Antifluorite pattern: fluorite turned inside out. The small ${many(v.cat, 'en')} fill the gaps between the big ${many(v.an, 'en')}: each ${ionOne(v.cat, 'en')} has 4 around it, each ${ionOne(v.an, 'en')} has 8.`,
      sci: v => `Antifluorite structure, Fm3̄m: ${v.anSym} on an fcc lattice, ${v.catSym} in all the tetrahedral holes; coordination 4:8 (twice as many cations), a = ${v.a} pm.`,
    },
  },
  medium: {
    water: {
      kid: v => `${cap(v.short)} dissolves in water (${v.sol} g in 100 g of water). As the water evaporates there is too little of it to hold all the ions, so they stack into crystals.`,
      sci: v => `Solubility about ${v.sol} g per 100 g of water. Evaporation pushes the concentration above saturation; the excess deposits on nuclei and on growing faces. Slow: low supersaturation, one big crystal; fast: many nuclei, many small crystals.`,
    },
    melt: {
      kid: v => (v.sol
        ? `${cap(v.short)} hardly dissolves in water (${v.sol} g in 100 g of water), so its big clear crystals are grown from a hot melt as it cools.`
        : v.hydrate ? `In water, ${v.short} would crystallise with water inside it. Here it grows from a hot melt as it cools, like crystals in cooling lava.`
          : `No water here: water would turn ${v.short} into something else. It grows from a hot melt as it cools, like crystals in cooling lava.`),
      sci: v => `Grown here from the melt${v.melt ? ` (melting point ${v.melt} °C)` : ''} as it cools: the cooling speed sets the supercooling as evaporation sets the supersaturation. ${v.sol ? `Solubility only ${v.sol} g per 100 g of water.` : v.hydrate ? `From water it crystallises as the hydrate ${v.water}.` : `In water: ${v.water}.`} (A model: some of these are made other ways.)`,
    },
  },
  grain: {
    kid: v => `A real grain of ${v.short}, 0.3 mm across, holds about ${num(v.m, 'en', 1)} quintillion ions (${num(Math.round(v.m * 10) * 1e17, 'en')})! It is ${num(v.times, 'en')} times wider than the crystal you grew.`,
    sci: v => `A grain 0.3 mm across: N = ${v.per} (L/a)³ = ${v.per} × (0.3 mm / ${v.a} pm)³ ≈ ${sciNum(v.ions, 'en')} ions, ${sciNum(v.units, 'en')} formula units of ${v.formula}. Your crystal: ${lengthText(v.across, 'en')} across; the grain is ${num(v.times, 'en')} times wider.`,
  },
  finds: { neighbours: 'Neighbours seen', perfect: 'A perfect crystal (slow)', hopper: 'A hopper crystal (fast)', grain: 'A real grain', grown: f => `${f} grown` },
  complicated: {
    kid: 'The lab’s other ionic compounds (MgCl₂, CaCl₂, MgF₂, Li₃N, Mg₃N₂, Al₂O₃, AlF₃, AlN) build more complicated crystals: not here yet.',
    sci: 'Not modelled here: MgCl₂ (CdCl₂ layers), CaCl₂ (a distorted rutile), MgF₂ (rutile), Li₃N (its own hexagonal type), Mg₃N₂ (anti-bixbyite), Al₂O₃ (corundum), AlF₃ (a distorted ReO₃ type), AlN (wurtzite).',
  },
}

// ================= Portuguese (Portugal) =================
const PT = {
  ui: {
    compounds: 'Cristais', speed: { water: 'Evaporação', melt: 'Arrefecimento' }, slow: { water: 'lenta', melt: 'lento' }, fast: { water: 'rápida', melt: 'rápido' },
    newDish: 'Recomeçar', inside: 'Ver por dentro', fullSize: 'Tamanho real', grain: 'Um grão verdadeiro', back: 'Voltar ao cristal',
    from: { water: 'cresce a partir da água', melt: 'cresce a partir de um material fundido' }, found: 'Descobertas', about: 'Sobre este cristal',
    help: 'Arrasta para rodar · aproxima com a roda ou com dois dedos · toca num ião para ver os seus vizinhos',
    by: n => `Começado por ${n}`, together: 'A crescer juntos: ', zooming: 'Largura da vista', ionsIn: 'Iões nos cristais', close: 'Fechar',
    tapStart: { water: 'Toca na água', melt: 'Toca no material fundido' },
  },
  status: {
    waiting: {
      kid: v => (v.cmp.medium === 'water'
        ? `${cap(many(v.cat, 'pt-pt'))} e ${many(v.an, 'pt-pt')} andam à deriva na água. Toca na água para a deixar evaporar!`
        : `${cap(many(v.cat, 'pt-pt'))} e ${many(v.an, 'pt-pt')} andam à deriva no material fundido, muito quente. Toca-lhe para o deixar arrefecer!`),
      sci: v => (v.cmp.medium === 'water'
        ? `Iões ${v.catSym} e ${v.anSym}, cada um envolto em moléculas de água, movem-se ao acaso (movimento browniano). Toca na água para começar a evaporação.`
        : `${v.formula} fundido: iões ${v.catSym} e ${v.anSym} livres acima do ponto de fusão. Toca no material fundido para começar o arrefecimento.`),
    },
    drift: {
      kid: v => (v.cmp.medium === 'water' ? 'A água está a secar e os iões apertam-se uns contra os outros...' : 'O material fundido arrefece e os iões abrandam...'),
      sci: v => (v.cmp.medium === 'water' ? 'A solução fica sobressaturada; primeiro tem de se formar um núcleo.' : 'Abaixo do ponto de fusão o líquido fica sobrearrefecido; primeiro tem de se formar um núcleo.'),
    },
    seed: {
      kid: 'Um cristal semente! Vê os iões a encontrar os seus lugares.',
      sci: 'Nucleação: um agregado acima do tamanho crítico sobrevive e cresce ião a ião.',
    },
  },
  party: {
    perfect: {
      kid: v => (v.c === 'NaCl' ? 'Um cubo perfeito! É por isso que cada grão de sal é um cubinho: espreita alguns com uma lupa.' : `Um cubo perfeito de ${v.short}! Como cresceu devagar, cada ião encontrou o seu lugar.`),
      sci: 'Crescimento camada a camada com pouca sobressaturação: cada face cresce uma camada completa de cada vez, por isso as faces ficam planas e o cristal é um cubo.',
    },
    between: {
      kid: 'Cresceu depressa: o meio das faces afunda um pouco. Ainda mais depressa e dá cristais em tremonha!',
      sci: 'Sobressaturação moderada: o centro das faces começa a atrasar-se em relação às arestas (início do crescimento em tremonha) e formam-se mais núcleos.',
    },
    hopper: {
      kid: v => `Um cristal em tremonha! Cresceu depressa: as arestas correram à frente e as faces ficaram ocas, como degraus para dentro.${v.cmp.medium === 'water' ? ' E olha: barcos de sal a flutuar na água!' : ''}`,
      sci: v => `Crescimento em tremonha (esquelético) com muita sobressaturação: os vértices e as arestas avançam mais para dentro da solução e recebem mais soluto (efeito de Berg), por isso o centro das faces fica para trás em degraus ocos.${v.cmp.medium === 'water' ? ' À superfície crescem «barcos de sal»: pirâmides ocas viradas ao contrário, a flutuar.' : ''}`,
    },
  },
  tap: {
    kid: v => `Este ${ionOne(v.sym, 'pt-pt')} abraça ${v.n} ${ions(v.other, v.n, 'pt-pt')}!${v.n < v.cn
      ? ` Está à superfície; lá dentro, cada ${ionOne(v.sym, 'pt-pt')} abraça ${v.cn}.`
      : ' Lá dentro é sempre assim: não há pares nem moléculas, só vizinhos.'}`,
    sci: v => `${v.mine} (r = ${v.rMine} pm): número de coordenação ${v.cn}, ${POLY['pt-pt'][v.cn]} de ${v.theirs} (r = ${v.rTheirs} pm). Aqui ${v.n} de ${v.cn}${v.n < v.cn ? ' (um ião da superfície)' : ''}. Distância ${v.sym}–${v.other} ${v.d} pm; a = ${v.a} pm.`,
  },
  structure: {
    rocksalt: {
      kid: v => `O padrão do sal-gema: como um tabuleiro de xadrez em 3D. Cada ${ionOne(v.cat, 'pt-pt')} fica entre 6 ${ions(v.an, 6, 'pt-pt')} e cada ${ionOne(v.an, 'pt-pt')} entre 6 ${ions(v.cat, 6, 'pt-pt')}.`,
      sci: v => `Estrutura do sal-gema (halite), Fm3̄m: duas redes cúbicas de faces centradas entrelaçadas, coordenação 6:6, 4 unidades de fórmula por célula, a = ${v.a} pm. Razão dos raios r₊/r₋ = ${v.ratio}.`,
    },
    fluorite: {
      kid: v => `O padrão da fluorite: cada ${ionOne(v.cat, 'pt-pt')} fica dentro de um cubinho de 8 ${ions(v.an, 8, 'pt-pt')}; cada ${ionOne(v.an, 'pt-pt')} tem 4 ${ions(v.cat, 4, 'pt-pt')} à volta.`,
      sci: v => `Estrutura da fluorite, Fm3̄m: ${v.catSym} numa rede cúbica de faces centradas, ${v.anSym} em todos os interstícios tetraédricos; coordenação 8:4, 4 unidades de fórmula por célula, a = ${v.a} pm.`,
    },
    antifluorite: {
      kid: v => `O padrão da antifluorite: a fluorite virada do avesso. Os pequenos ${many(v.cat, 'pt-pt')} enchem os espaços entre os grandes ${many(v.an, 'pt-pt')}: cada ${ionOne(v.cat, 'pt-pt')} tem 4 à volta, cada ${ionOne(v.an, 'pt-pt')} tem 8.`,
      sci: v => `Estrutura da antifluorite, Fm3̄m: ${v.anSym} numa rede cúbica de faces centradas, ${v.catSym} em todos os interstícios tetraédricos; coordenação 4:8 (o dobro dos catiões), a = ${v.a} pm.`,
    },
  },
  medium: {
    water: {
      kid: v => `O ${v.short} dissolve-se na água (${v.sol} g em 100 g de água). Quando a água evapora, já não há água que chegue para segurar todos os iões, e eles empilham-se em cristais.`,
      sci: v => `Solubilidade de cerca de ${v.sol} g por 100 g de água. A evaporação leva a concentração acima da saturação; o excesso deposita-se nos núcleos e nas faces em crescimento. Devagar: pouca sobressaturação, um cristal grande; depressa: muitos núcleos, muitos cristais pequenos.`,
    },
    melt: {
      kid: v => (v.sol
        ? `O ${v.short} quase não se dissolve na água (${v.sol} g em 100 g de água), por isso os seus grandes cristais transparentes crescem a partir do material fundido, ao arrefecer.`
        : v.hydrate ? `Na água, o ${v.short} cristalizaria com água lá dentro. Aqui cresce a partir do material fundido, ao arrefecer, como os cristais na lava que arrefece.`
          : `Aqui não há água: a água transformaria o ${v.short} noutra coisa. Cresce a partir do material fundido, ao arrefecer, como os cristais na lava que arrefece.`),
      sci: v => `Aqui cresce a partir do material fundido${v.melt ? ` (ponto de fusão ${v.melt} °C)` : ''} ao arrefecer: a velocidade de arrefecimento define o sobrearrefecimento, como a evaporação define a sobressaturação. ${v.sol ? `Solubilidade de apenas ${v.sol} g por 100 g de água.` : v.hydrate ? `A partir da água cristaliza como o hidrato ${v.water}.` : `Na água: ${v.water}.`} (Um modelo: alguns destes fazem-se de outras maneiras.)`,
    },
  },
  grain: {
    kid: v => `Um grão verdadeiro de ${v.short}, com 0,3 mm de lado, tem cerca de ${num(v.m, 'pt-pt', 1)} triliões de iões (${num(Math.round(v.m * 10) * 1e17, 'pt-pt')})! É ${num(v.times, 'pt-pt')} vezes mais largo do que o cristal que fizeste crescer.`,
    sci: v => `Um grão com 0,3 mm de lado: N = ${v.per} (L/a)³ = ${v.per} × (0,3 mm / ${v.a} pm)³ ≈ ${sciNum(v.ions, 'pt-pt')} iões, ${sciNum(v.units, 'pt-pt')} unidades de fórmula de ${v.formula}. O teu cristal: ${lengthText(v.across, 'pt-pt')} de lado; o grão é ${num(v.times, 'pt-pt')} vezes mais largo.`,
  },
  finds: { neighbours: 'Vizinhos vistos', perfect: 'Um cristal perfeito (devagar)', hopper: 'Um cristal em tremonha (depressa)', grain: 'Um grão verdadeiro', grown: f => `${f} crescido` },
  complicated: {
    kid: 'Os outros compostos iónicos do laboratório (MgCl₂, CaCl₂, MgF₂, Li₃N, Mg₃N₂, Al₂O₃, AlF₃, AlN) formam cristais mais complicados: ainda não estão aqui.',
    sci: 'Ainda sem modelo aqui: MgCl₂ (camadas do tipo CdCl₂), CaCl₂ (um rútilo deformado), MgF₂ (rútilo), Li₃N (um tipo hexagonal próprio), Mg₃N₂ (anti-bixbyite), Al₂O₃ (corindo), AlF₃ (um tipo ReO₃ deformado), AlN (wurtzite).',
  },
}

// ================= Polish =================
const PL = {
  ui: {
    compounds: 'Kryształy', speed: { water: 'Parowanie', melt: 'Chłodzenie' }, slow: { water: 'wolne', melt: 'wolne' }, fast: { water: 'szybkie', melt: 'szybkie' },
    newDish: 'Od nowa', inside: 'Zajrzyj do środka', fullSize: 'Prawdziwy rozmiar', grain: 'Prawdziwe ziarenko', back: 'Wróć do kryształu',
    from: { water: 'rośnie z wody', melt: 'rośnie ze stopu' }, found: 'Odkrycia', about: 'O tym krysztale',
    help: 'Przeciągnij, żeby obrócić · przybliż kółkiem albo dwoma palcami · dotknij jonu, żeby zobaczyć jego sąsiadów',
    by: n => `Uruchomione przez: ${n}`, together: 'Hodujecie razem: ', zooming: 'Szerokość widoku', ionsIn: 'Jony w kryształach', close: 'Zamknij',
    tapStart: { water: 'Dotknij wody', melt: 'Dotknij stopu' },
  },
  status: {
    waiting: {
      kid: v => (v.cmp.medium === 'water'
        ? `${cap(many(v.cat, 'pl'))} i ${many(v.an, 'pl')} dryfują w wodzie. Dotknij wody, żeby zaczęła parować!`
        : `${cap(many(v.cat, 'pl'))} i ${many(v.an, 'pl')} dryfują w gorącym stopie. Dotknij go, żeby zaczął stygnąć!`),
      sci: v => (v.cmp.medium === 'water'
        ? `Jony ${v.catSym} i ${v.anSym}, każdy w otoczce cząsteczek wody, wędrują przypadkowo (ruchy Browna). Dotknij wody, żeby zacząć parowanie.`
        : `Stopiony ${v.formula}: swobodne jony ${v.catSym} i ${v.anSym} powyżej temperatury topnienia. Dotknij stopu, żeby zacząć chłodzenie.`),
    },
    drift: {
      kid: v => (v.cmp.medium === 'water' ? 'Woda wysycha, a jonom robi się coraz ciaśniej...' : 'Stop stygnie, a jony zwalniają...'),
      sci: v => (v.cmp.medium === 'water' ? 'Roztwór staje się przesycony; najpierw musi powstać zarodek.' : 'Poniżej temperatury topnienia ciecz jest przechłodzona; najpierw musi powstać zarodek.'),
    },
    seed: {
      kid: 'Zarodek kryształu! Patrz, jak jony znajdują swoje miejsca.',
      sci: 'Nukleacja: skupisko większe od rozmiaru krytycznego przetrwa i rośnie jon po jonie.',
    },
  },
  party: {
    perfect: {
      kid: v => (v.c === 'NaCl' ? 'Idealny sześcian! Dlatego każde ziarenko soli to malutki sześcian: obejrzyj kilka przez lupę.' : `Idealny sześcian: ${v.short}! Rosnąc powoli, każdy jon znalazł swoje miejsce.`),
      sci: 'Wzrost warstwa po warstwie przy małym przesyceniu: każda ściana dostaje naraz jedną pełną warstwę, więc ściany zostają płaskie, a kryształ jest sześcianem.',
    },
    between: {
      kid: 'Rósł szybko: środki ścian trochę się zapadają. Jeszcze szybciej, a powstaną kryształy szkieletowe!',
      sci: 'Umiarkowane przesycenie: środki ścian zaczynają zostawać w tyle za krawędziami (początek wzrostu szkieletowego) i powstaje więcej zarodków.',
    },
    hopper: {
      kid: v => `Kryształ szkieletowy! Rósł szybko: krawędzie pognały naprzód, a ściany zostały puste, jak schodki w głąb.${v.cmp.medium === 'water' ? ' A popatrz: solne łódki pływają po wodzie!' : ''}`,
      sci: v => `Wzrost szkieletowy (lejkowaty) przy dużym przesyceniu: naroża i krawędzie sięgają dalej w roztwór i dostają więcej substancji (efekt Berga), więc środki ścian zostają w tyle jako schodkowe wgłębienia.${v.cmp.medium === 'water' ? ' Na powierzchni rosną „solne łódki”: puste, odwrócone piramidy, które pływają.' : ''}`,
    },
  },
  tap: {
    kid: v => `Ten ${ionOne(v.sym, 'pl')} przytula ${v.n} ${ions(v.other, v.n, 'pl')}!${v.n < v.cn
      ? ` Siedzi na powierzchni; w środku kryształu każdy ${ionOne(v.sym, 'pl')} przytula ich ${v.cn}.`
      : ' W całym krysztale jest tak samo: nie ma par ani cząsteczek, są tylko sąsiedzi.'}`,
    sci: v => `${v.mine} (r = ${v.rMine} pm): liczba koordynacyjna ${v.cn}, ${POLY.pl[v.cn]} z jonów ${v.theirs} (r = ${v.rTheirs} pm). Tu ${v.n} z ${v.cn}${v.n < v.cn ? ' (jon na powierzchni)' : ''}. Odległość ${v.sym}–${v.other} ${v.d} pm; a = ${v.a} pm.`,
  },
  structure: {
    rocksalt: {
      kid: v => `Wzór soli kamiennej: jak szachownica w 3D. Każdy ${ionOne(v.cat, 'pl')} otacza 6 ${ions(v.an, 6, 'pl')}, a każdy ${ionOne(v.an, 'pl')} otacza 6 ${ions(v.cat, 6, 'pl')}.`,
      sci: v => `Struktura soli kamiennej (halitu), Fm3̄m: dwie przenikające się sieci regularne ściennie centrowane, koordynacja 6:6, 4 jednostki wzorowe w komórce, a = ${v.a} pm. Stosunek promieni r₊/r₋ = ${v.ratio}.`,
    },
    fluorite: {
      kid: v => `Wzór fluorytu: każdy ${ionOne(v.cat, 'pl')} siedzi w sześcianiku z 8 ${ions(v.an, 8, 'pl')}, a każdy ${ionOne(v.an, 'pl')} ma wokół siebie 4 ${ions(v.cat, 4, 'pl')}.`,
      sci: v => `Struktura fluorytu, Fm3̄m: ${v.catSym} w sieci regularnej ściennie centrowanej, ${v.anSym} we wszystkich lukach tetraedrycznych; koordynacja 8:4, 4 jednostki wzorowe w komórce, a = ${v.a} pm.`,
    },
    antifluorite: {
      kid: v => `Wzór antyfluorytu: fluoryt odwrócony na drugą stronę. Małe ${many(v.cat, 'pl')} wypełniają luki w sieci dużych ${ions(v.an, 5, 'pl')}: każdy ${ionOne(v.cat, 'pl')} ma wokół 4 sąsiadów, każdy ${ionOne(v.an, 'pl')} 8.`,
      sci: v => `Struktura antyfluorytu, Fm3̄m: ${v.anSym} w sieci regularnej ściennie centrowanej, ${v.catSym} we wszystkich lukach tetraedrycznych; koordynacja 4:8 (kationów jest dwa razy więcej), a = ${v.a} pm.`,
    },
  },
  medium: {
    water: {
      kid: v => `${cap(v.short)} rozpuszcza się w wodzie (${v.sol} g w 100 g wody). Gdy woda paruje, robi się jej za mało, żeby utrzymać wszystkie jony, więc układają się w kryształy.`,
      sci: v => `Rozpuszczalność około ${v.sol} g na 100 g wody. Parowanie podnosi stężenie ponad nasycenie; nadmiar osadza się na zarodkach i na rosnących ścianach. Powoli: małe przesycenie, jeden duży kryształ; szybko: wiele zarodków, wiele małych kryształów.`,
    },
    melt: {
      kid: v => (v.sol
        ? `${cap(v.short)} prawie nie rozpuszcza się w wodzie (${v.sol} g w 100 g wody), więc jego duże, przejrzyste kryształy hoduje się z gorącego stopu, gdy stygnie.`
        : v.hydrate ? `W wodzie ${v.short} krystalizowałby razem z wodą w środku. Tutaj rośnie z gorącego stopu, gdy stygnie, jak kryształy w stygnącej lawie.`
          : `Tu nie ma wody: woda zamieniłaby ${v.short} w coś innego. Rośnie z gorącego stopu, gdy stygnie, jak kryształy w stygnącej lawie.`),
      sci: v => `Tutaj rośnie ze stopu${v.melt ? ` (temperatura topnienia ${v.melt} °C)` : ''}, gdy stygnie: szybkość chłodzenia wyznacza przechłodzenie, tak jak parowanie wyznacza przesycenie. ${v.sol ? `Rozpuszczalność tylko ${v.sol} g na 100 g wody.` : v.hydrate ? `Z wody krystalizuje jako hydrat ${v.water}.` : `W wodzie: ${v.water}.`} (To model: niektóre z tych związków otrzymuje się inaczej.)`,
    },
  },
  grain: {
    kid: v => `Prawdziwe ziarenko (${v.short}) o boku 0,3 mm ma około ${num(v.m, 'pl', 1)} tryliona jonów (${num(Math.round(v.m * 10) * 1e17, 'pl')})! Jest ${num(v.times, 'pl')} razy szersze niż kryształ, który wyhodowano tutaj.`,
    sci: v => `Ziarno o boku 0,3 mm: N = ${v.per} (L/a)³ = ${v.per} × (0,3 mm / ${v.a} pm)³ ≈ ${sciNum(v.ions, 'pl')} jonów, ${sciNum(v.units, 'pl')} jednostek wzorowych ${v.formula}. Ten kryształ: ${lengthText(v.across, 'pl')} szerokości; ziarno jest ${num(v.times, 'pl')} razy szersze.`,
  },
  finds: { neighbours: 'Sąsiedzi zobaczeni', perfect: 'Idealny kryształ (powoli)', hopper: 'Kryształ szkieletowy (szybko)', grain: 'Prawdziwe ziarenko', grown: f => `${f} wyhodowany` },
  complicated: {
    kid: 'Pozostałe związki jonowe z laboratorium (MgCl₂, CaCl₂, MgF₂, Li₃N, Mg₃N₂, Al₂O₃, AlF₃, AlN) tworzą bardziej skomplikowane kryształy: jeszcze ich tu nie ma.',
    sci: 'Jeszcze bez modelu: MgCl₂ (warstwy typu CdCl₂), CaCl₂ (zniekształcony rutyl), MgF₂ (rutyl), Li₃N (własny typ heksagonalny), Mg₃N₂ (anty-biksbit), Al₂O₃ (korund), AlF₃ (zniekształcony typ ReO₃), AlN (wurcyt).',
  },
}

// ================= German =================
const DE = {
  ui: {
    compounds: 'Kristalle', speed: { water: 'Verdunsten', melt: 'Abkühlen' }, slow: { water: 'langsam', melt: 'langsam' }, fast: { water: 'schnell', melt: 'schnell' },
    newDish: 'Neu starten', inside: 'Hineinschauen', fullSize: 'Echte Größe', grain: 'Ein echtes Körnchen', back: 'Zurück zum Kristall',
    from: { water: 'wächst aus Wasser', melt: 'wächst aus einer Schmelze' }, found: 'Entdeckungen', about: 'Über diesen Kristall',
    help: 'Ziehen zum Drehen · mit dem Mausrad oder zwei Fingern näher · tippe auf ein Ion, um seine Nachbarn zu sehen',
    by: n => `Gestartet von ${n}`, together: 'Gemeinsam: ', zooming: 'Breite des Blicks', ionsIn: 'Ionen in den Kristallen', close: 'Schließen',
    tapStart: { water: 'Tippe aufs Wasser', melt: 'Tippe auf die Schmelze' },
  },
  status: {
    waiting: {
      kid: v => (v.cmp.medium === 'water'
        ? `${many(v.cat, 'de')} und ${many(v.an, 'de')} treiben im Wasser. Tippe aufs Wasser, damit es verdunstet!`
        : `${many(v.cat, 'de')} und ${many(v.an, 'de')} treiben in der heißen Schmelze. Tippe darauf, damit sie abkühlt!`),
      sci: v => (v.cmp.medium === 'water'
        ? `${v.catSym}- und ${v.anSym}-Ionen, jedes in einer Hülle aus Wassermolekülen, wandern zufällig (Brownsche Bewegung). Tippe aufs Wasser, um das Verdunsten zu starten.`
        : `Geschmolzenes ${v.formula}: freie ${v.catSym}- und ${v.anSym}-Ionen über dem Schmelzpunkt. Tippe auf die Schmelze, um das Abkühlen zu starten.`),
    },
    drift: {
      kid: v => (v.cmp.medium === 'water' ? 'Das Wasser trocknet, und die Ionen rücken eng zusammen...' : 'Die Schmelze kühlt ab, und die Ionen werden langsamer...'),
      sci: v => (v.cmp.medium === 'water' ? 'Die Lösung wird übersättigt; zuerst muss ein Keim entstehen.' : 'Unter dem Schmelzpunkt ist die Schmelze unterkühlt; zuerst muss ein Keim entstehen.'),
    },
    seed: {
      kid: 'Ein Kristallkeim! Schau, wie die Ionen ihre Plätze finden.',
      sci: 'Keimbildung: Ein Cluster über der kritischen Größe überlebt und wächst Ion für Ion.',
    },
  },
  party: {
    perfect: {
      kid: v => (v.c === 'NaCl' ? 'Ein perfekter Würfel! Darum ist jedes Salzkorn ein winziger Würfel: Schau dir ein paar mit der Lupe an.' : `Ein perfekter Würfel aus ${v.short}! Langsam gewachsen, hat jedes Ion seinen Platz gefunden.`),
      sci: 'Schichtwachstum bei geringer Übersättigung: Jede Fläche wächst um eine vollständige Schicht nach der anderen, darum bleiben die Flächen eben und der Kristall ist ein Würfel.',
    },
    between: {
      kid: 'Schnell gewachsen: Die Mitten der Flächen sinken ein wenig ein. Noch schneller gibt es Skelettkristalle!',
      sci: 'Mittlere Übersättigung: Die Flächenmitten bleiben hinter den Kanten zurück (beginnendes Skelettwachstum), und es bilden sich mehr Keime.',
    },
    hopper: {
      kid: v => `Ein Skelettkristall! Schnell gewachsen: Die Kanten sind vorausgeeilt, die Flächen blieben hohl, wie Treppen nach innen.${v.cmp.medium === 'water' ? ' Und schau: Salzboote schwimmen auf dem Wasser!' : ''}`,
      sci: v => `Skelettwachstum (Trichterkristalle) bei hoher Übersättigung: Ecken und Kanten ragen weiter in die Lösung und bekommen mehr gelösten Stoff (Berg-Effekt), darum bleiben die Flächenmitten als gestufte Mulden zurück.${v.cmp.medium === 'water' ? ' An der Oberfläche wachsen „Salzboote“: hohle, umgedrehte Pyramiden, die schwimmen.' : ''}`,
    },
  },
  tap: {
    kid: v => `Dieses ${ionOne(v.sym, 'de')} umarmt ${v.n} ${ions(v.other, v.n, 'de')}!${v.n < v.cn
      ? ` Es sitzt an der Oberfläche; im Inneren umarmt jedes ${ionOne(v.sym, 'de')} ${v.cn}.`
      : ' So ist es überall im Kristall: keine Paare, keine Moleküle, nur Nachbarn.'}`,
    sci: v => `${v.mine} (r = ${v.rMine} pm): Koordinationszahl ${v.cn}, ${POLY.de[v.cn]} aus ${v.theirs} (r = ${v.rTheirs} pm). Hier ${v.n} von ${v.cn}${v.n < v.cn ? ' (ein Ion an der Oberfläche)' : ''}. Abstand ${v.sym}–${v.other} ${v.d} pm; a = ${v.a} pm.`,
  },
  structure: {
    rocksalt: {
      kid: v => `Das Steinsalz-Muster: wie ein Schachbrett in 3D. Jedes ${ionOne(v.cat, 'de')} sitzt zwischen 6 ${ions(v.an, 6, 'de')}, jedes ${ionOne(v.an, 'de')} zwischen 6 ${ions(v.cat, 6, 'de')}.`,
      sci: v => `Steinsalzstruktur (Halit), Fm3̄m: zwei ineinandergestellte kubisch-flächenzentrierte Gitter, Koordination 6:6, 4 Formeleinheiten pro Zelle, a = ${v.a} pm. Radienverhältnis r₊/r₋ = ${v.ratio}.`,
    },
    fluorite: {
      kid: v => `Das Fluorit-Muster: Jedes ${ionOne(v.cat, 'de')} sitzt in einem kleinen Würfel aus 8 ${ions(v.an, 8, 'de')}; jedes ${ionOne(v.an, 'de')} hat 4 ${ions(v.cat, 4, 'de')} um sich.`,
      sci: v => `Fluoritstruktur, Fm3̄m: ${v.catSym} auf einem kubisch-flächenzentrierten Gitter, ${v.anSym} in allen Tetraederlücken; Koordination 8:4, 4 Formeleinheiten pro Zelle, a = ${v.a} pm.`,
    },
    antifluorite: {
      kid: v => `Das Antifluorit-Muster: Fluorit, umgestülpt. Die kleinen ${many(v.cat, 'de')} füllen die Lücken zwischen den großen ${many(v.an, 'de')}: Jedes ${ionOne(v.cat, 'de')} hat 4 um sich, jedes ${ionOne(v.an, 'de')} 8.`,
      sci: v => `Antifluoritstruktur, Fm3̄m: ${v.anSym} auf einem kubisch-flächenzentrierten Gitter, ${v.catSym} in allen Tetraederlücken; Koordination 4:8 (doppelt so viele Kationen), a = ${v.a} pm.`,
    },
  },
  medium: {
    water: {
      kid: v => `${v.short} löst sich in Wasser (${v.sol} g in 100 g Wasser). Wenn das Wasser verdunstet, ist zu wenig davon da, um alle Ionen zu halten, und sie stapeln sich zu Kristallen.`,
      sci: v => `Löslichkeit etwa ${v.sol} g pro 100 g Wasser. Das Verdunsten treibt die Konzentration über die Sättigung; der Überschuss lagert sich an Keimen und wachsenden Flächen an. Langsam: geringe Übersättigung, ein großer Kristall; schnell: viele Keime, viele kleine Kristalle.`,
    },
    melt: {
      kid: v => (v.sol
        ? `${v.short} löst sich kaum in Wasser (${v.sol} g in 100 g Wasser), darum züchtet man seine großen klaren Kristalle aus einer heißen Schmelze, während sie abkühlt.`
        : v.hydrate ? `In Wasser würde ${v.short} mit Wasser darin kristallisieren. Hier wächst es aus einer heißen Schmelze, während sie abkühlt, wie Kristalle in erkaltender Lava.`
          : `Hier gibt es kein Wasser: Wasser würde ${v.short} in etwas anderes verwandeln. Es wächst aus einer heißen Schmelze, während sie abkühlt, wie Kristalle in erkaltender Lava.`),
      sci: v => `Hier aus der Schmelze gezüchtet${v.melt ? ` (Schmelzpunkt ${v.melt} °C)` : ''}, während sie abkühlt: Die Abkühlgeschwindigkeit bestimmt die Unterkühlung, wie das Verdunsten die Übersättigung. ${v.sol ? `Löslichkeit nur ${v.sol} g pro 100 g Wasser.` : v.hydrate ? `Aus Wasser kristallisiert es als Hydrat ${v.water}.` : `In Wasser: ${v.water}.`} (Ein Modell: Manche davon stellt man anders her.)`,
    },
  },
  grain: {
    kid: v => `Ein echtes Körnchen ${v.short}, 0,3 mm breit, enthält etwa ${num(v.m, 'de', 1)} Trillionen Ionen (${num(Math.round(v.m * 10) * 1e17, 'de')})! Es ist ${num(v.times, 'de')}-mal breiter als der Kristall, den du gezüchtet hast.`,
    sci: v => `Ein Korn von 0,3 mm Kantenlänge: N = ${v.per} (L/a)³ = ${v.per} × (0,3 mm / ${v.a} pm)³ ≈ ${sciNum(v.ions, 'de')} Ionen, ${sciNum(v.units, 'de')} Formeleinheiten ${v.formula}. Dein Kristall: ${lengthText(v.across, 'de')} breit; das Korn ist ${num(v.times, 'de')}-mal breiter.`,
  },
  finds: { neighbours: 'Nachbarn gesehen', perfect: 'Ein perfekter Kristall (langsam)', hopper: 'Ein Skelettkristall (schnell)', grain: 'Ein echtes Körnchen', grown: f => `${f} gezüchtet` },
  complicated: {
    kid: 'Die anderen Ionenverbindungen des Labors (MgCl₂, CaCl₂, MgF₂, Li₃N, Mg₃N₂, Al₂O₃, AlF₃, AlN) bilden kompliziertere Kristalle: noch nicht hier.',
    sci: 'Hier noch nicht modelliert: MgCl₂ (CdCl₂-Schichten), CaCl₂ (ein verzerrter Rutil), MgF₂ (Rutil), Li₃N (ein eigener hexagonaler Typ), Mg₃N₂ (Anti-Bixbyit), Al₂O₃ (Korund), AlF₃ (ein verzerrter ReO₃-Typ), AlN (Wurtzit).',
  },
}

// the coordination polyhedra (by coordination number), as the sentence needs them
const POLY = {
  en: { 4: 'a tetrahedron', 6: 'an octahedron', 8: 'a cube' },
  'pt-pt': { 4: 'um tetraedro', 6: 'um octaedro', 8: 'um cubo' },
  pl: { 4: 'czworościan', 6: 'ośmiościan', 8: 'sześcian' },
  de: { 4: 'ein Tetraeder', 6: 'ein Oktaeder', 8: 'ein Würfel' },
}

export const WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
const W = lang => WORDS[lang] ?? EN
const depth = level => (level === 'scientist' ? 'sci' : 'kid')
const say = (entry, v, level) => {
  const e = entry[depth(level)]
  return typeof e === 'function' ? e(v) : e
}

/** The HUD's labels. */
export const ui = lang => W(lang).ui

/** What the dish is doing (phase: waiting, drift, seed). */
export function statusText(phase, c, lang, level) {
  const entry = W(lang).status[phase]
  return entry ? say(entry, factsOf(c, lang), level) : ''
}

/** The moment a crystal is done (kind: perfect, between, hopper). */
export function partyText(kind, c, lang, level) {
  return say(W(lang).party[kind] ?? W(lang).party.perfect, factsOf(c, lang), level)
}

/** About a compound's crystal: its pattern and what it grows from. */
export function aboutText(c, lang, level) {
  const v = factsOf(c, lang)
  return { structure: say(W(lang).structure[v.cmp.structure], v, level), medium: say(W(lang).medium[v.cmp.medium], v, level) }
}

/** A tapped ion and its neighbours: { sym, other, n (neighbours here), cn (inside the crystal) }. */
export function tapText(t, c, lang, level) {
  const v = factsOf(c, lang)
  const mine = t.sym === v.cat
  return say(W(lang).tap, {
    ...v, ...t,
    mine: ionSym(t.sym), theirs: ionSym(t.other),
    rMine: mine ? v.rC : v.rA, rTheirs: mine ? v.rA : v.rC,
  }, level)
}

/** The grain of real salt: across (the crystal's width, m), times (how many times wider the grain is). */
export function grainText(z, c, lang, level) {
  const v = factsOf(c, lang)
  const g = grainCount(c)
  return say(W(lang).grain, {
    ...v, ions: g.ions, units: g.units, m: g.ions / 1e18, per: STRUCTURES[v.cmp.structure].ionsPerCell,
    across: z.across, times: Math.round(z.times / 100) * 100,
  }, level)
}

/** A discovery's name. */
export function findName(f, lang) {
  const t = W(lang).finds
  return COMPOUND[f] ? t.grown(sub(f)) : t[f] ?? f
}

/** The lab's ionic compounds not modelled here. */
export const complicatedText = (lang, level) => say(W(lang).complicated, null, level)

// for the tests
export const TABLES = { WORDS, ION_NAMES, POLY }
