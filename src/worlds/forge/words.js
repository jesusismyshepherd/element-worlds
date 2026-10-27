// The Atom Forge's words: the missions and what the forge says about the atom on the table, in both
// languages and at both depths (kid: Explorer, sci: Scientist). The HUD's button labels are in the
// locale files (forge.*).
import { ELEMENTS, nameOf } from '../../data/elements.js'
import { halfLifeParts, modeFamily, nuclideSymbol } from '../../chem/nucleus.js'

const el = Z => ELEMENTS[Z - 1]
const nm = (Z, lang) => nameOf(el(Z), lang).toLowerCase()
const SPECIAL = {
  en: { '1-1': 'protium', '1-2': 'deuterium', '1-3': 'tritium' },
  'pt-pt': { '1-1': 'prótio', '1-2': 'deutério', '1-3': 'trítio' },
}

/** "carbon-14", "hydrogen-2 (deuterium)". */
export function isotopeName(Z, N, lang) {
  const special = SPECIAL[lang]?.[`${Z}-${Z + N}`]
  return `${nm(Z, lang)}-${Z + N}${special ? ` (${special})` : ''}`
}

const UNITS = {
  en: {
    years: 'years', billionYears: 'billion years', millionYears: 'million years', days: 'days', hours: 'hours',
    minutes: 'minutes', seconds: 'seconds', ms: 'thousandths of a second', us: 'millionths of a second',
    ns: 'billionths of a second',
  },
  'pt-pt': {
    years: 'anos', billionYears: 'mil milhões de anos', millionYears: 'milhões de anos', days: 'dias', hours: 'horas',
    minutes: 'minutos', seconds: 'segundos', ms: 'milésimos de segundo', us: 'milionésimos de segundo',
    ns: 'mil-milionésimos de segundo',
  },
}
const TAG = { en: 'en', 'pt-pt': 'pt-PT' }
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const power = v => {
  const e = Math.floor(Math.log10(v))
  const m = Number((v / 10 ** e).toPrecision(2))
  return `${m} × 10${String(e).replace('-', '⁻').replace(/\d/g, d => SUP[d])}`
}

/** A half-life for people: "5700 years", "0.7 thousandths of a second", "6 × 10⁻²² s". */
export function halfLifeText(t, lang) {
  const p = halfLifeParts(t)
  if (!p) return ''
  const n = v => v.toLocaleString(TAG[lang] ?? 'en', { maximumFractionDigits: 3 })
  if (p.unit === 'secondsSci') return `${power(p.value)} s`
  if (p.unit === 'yearsSci') return `${power(p.value)} ${lang === 'pt-pt' ? 'anos' : 'years'}`
  return `${n(p.value)} ${UNITS[lang]?.[p.unit] ?? UNITS.en[p.unit]}`
}

const W = {
  en: {
    empty: {
      kid: 'Build an atom! Protons make the element, neutrons glue the nucleus together, electrons whizz around it.',
      sci: 'Choose Z (protons), N (neutrons) and the electron count: the forge looks the nuclide up in the chart of nuclides (NUBASE, 3552 known).',
    },
    neutron: {
      kid: 'One neutron on its own: no protons, so no element yet. Left alone it turns into a proton and an electron in about 10 minutes: a hydrogen atom!',
      sci: 'A free neutron: mean life 878 s (half-life 609 s), n → p + e⁻ + antineutrino. Too long for the forge to wait: press decay to see it.',
    },
    neutrons: {
      kid: 'Neutrons on their own do not stick together. Add a proton!',
      sci: 'No bound state of neutrons alone exists (the dineutron is unbound); a neutron star is held by gravity, not by the nuclear force.',
    },
    element: (Z, lang) => ({
      kid: `${Z} proton${Z > 1 ? 's' : ''}: that makes it ${nm(Z, lang)}! The number of protons decides which element an atom is.`,
      sci: `Z = ${Z}: ${nm(Z, lang)}. The atomic number alone fixes the element; N and the electrons only change its isotope and its charge.`,
    }),
    isotope: (Z, N, common) => ({
      kid: N === common ? `With ${N} neutron${N === 1 ? '' : 's'} this is the commonest kind.` : `With ${N} neutron${N === 1 ? '' : 's'} (the commonest kind has ${common}) it is another isotope: the same element, a ${N > common ? 'heavier' : 'lighter'} nucleus.`,
      sci: `N = ${N}, A = ${Z + N}${N === common ? ' (the commonest isotope)' : ` (the commonest has N = ${common})`}.`,
    }),
    ion: (q, sym) => ({
      kid: q === 0 ? 'As many electrons as protons: a neutral atom.' : q > 0 ? `${q} electron${q > 1 ? 's' : ''} short: a positive ion (${sym}). Metals like to lose electrons this way.` : `${-q} extra electron${q < -1 ? 's' : ''}: a negative ion (${sym}).`,
      sci: q === 0 ? 'Neutral: Z electrons.' : `Charge ${q > 0 ? '+' : '−'}${Math.abs(q)} (${sym}).`,
    }),
    crystalOnly: {
      kid: 'More than one extra electron only stays put inside a crystal, where neighbours share the push (like the oxide ions in rust).',
      sci: 'Free atomic dianions are unbound in the gas phase (O²⁻ exists only stabilised by a lattice, the Madelung energy).',
    },
    noExtra: (Z, lang) => ({
      kid: `${cap(nm(Z, lang))} does not want an extra electron: it flies off.`,
      sci: `${cap(nm(Z, lang))} has no positive electron affinity: its anion is unbound.`,
    }),
    tooMany: { kid: 'No room: the extra electrons push each other away.', sci: 'Beyond a charge of −3 nothing binds an atomic anion.' },
    noHold: { kid: 'With no protons, nothing holds an electron.', sci: 'No nuclear charge: an electron cannot be bound.' },
    stable: {
      kid: 'Its nucleus is stable: it can last for ever.',
      sci: 'Stable (no decay observed).',
    },
    natural: ab => ({ kid: `This is how ${ab >= 50 ? 'most' : 'some'} of it is found in nature (${ab}%).`, sci: `Natural abundance ${ab}%.` }),
    radioactive: (hl, mode) => ({
      kid: `Radioactive! Half of a pile of these breaks apart in ${hl}. It decays by ${KIDMODE.en[mode] ?? 'breaking apart'}.`,
      sci: `Radioactive: half-life ${hl}, decay mode ${SCIMODE.en[mode] ?? mode}.`,
    }),
    instant: { kid: 'Far too wobbly: it falls apart at once!', sci: 'Unbound or nearly so: it decays within about 10⁻¹² s, often by shedding a nucleon.' },
    unmeasured: { kid: 'Scientists have made this one, but nobody has timed how long it lasts.', sci: 'Observed, half-life not measured.' },
    rich: { kid: 'Too many neutrons: the nucleus cannot hold them, so they drip out.', sci: 'Beyond the known isotopes on the neutron-rich side (past the neutron drip line): neutrons are shed.' },
    poor: { kid: 'Too few neutrons: the protons push each other apart, and one flies out.', sci: 'Beyond the known isotopes on the proton-rich side (past the proton drip line): protons are shed.' },
    notMade: { kid: 'Nobody has made this one yet! Maybe one day...', sci: 'Not yet observed: no measurement exists.' },
    held: { kid: 'The force field is holding it together while you build.', sci: 'Held (auto-decay off).' },
  },
  'pt-pt': {
    empty: {
      kid: 'Constrói um átomo! Os protões fazem o elemento, os neutrões colam o núcleo, os eletrões giram à volta.',
      sci: 'Escolhe Z (protões), N (neutrões) e o número de eletrões: a forja procura o nuclídeo na carta de nuclídeos (NUBASE, 3552 conhecidos).',
    },
    neutron: {
      kid: 'Um neutrão sozinho: sem protões ainda não há elemento. Deixado sozinho, transforma-se num protão e num eletrão em cerca de 10 minutos: um átomo de hidrogénio!',
      sci: 'Um neutrão livre: vida média de 878 s (meia-vida de 609 s), n → p + e⁻ + antineutrino. Demasiado tempo para a forja esperar: carrega em decair para ver.',
    },
    neutrons: {
      kid: 'Os neutrões sozinhos não se colam uns aos outros. Junta um protão!',
      sci: 'Não existe nenhum estado ligado só de neutrões (o dineutrão não é ligado); uma estrela de neutrões segura-se pela gravidade, não pela força nuclear.',
    },
    element: (Z, lang) => ({
      kid: `${Z} ${Z > 1 ? 'protões' : 'protão'}: isto é ${nm(Z, lang)}! É o número de protões que decide de que elemento é um átomo.`,
      sci: `Z = ${Z}: ${nm(Z, lang)}. Só o número atómico fixa o elemento; N e os eletrões só mudam o isótopo e a carga.`,
    }),
    isotope: (Z, N, common) => ({
      kid: N === common ? `Com ${N} ${N === 1 ? 'neutrão' : 'neutrões'}, é a forma mais comum.` : `Com ${N} ${N === 1 ? 'neutrão' : 'neutrões'} (a forma mais comum tem ${common}), é outro isótopo: o mesmo elemento, um núcleo mais ${N > common ? 'pesado' : 'leve'}.`,
      sci: `N = ${N}, A = ${Z + N}${N === common ? ' (o isótopo mais comum)' : ` (o mais comum tem N = ${common})`}.`,
    }),
    ion: (q, sym) => ({
      kid: q === 0 ? 'Tantos eletrões como protões: um átomo neutro.' : q > 0 ? `${q === 1 ? 'Falta-lhe 1 eletrão' : `Faltam-lhe ${q} eletrões`}: um ião positivo (${sym}). Os metais gostam de perder eletrões assim.` : `${-q === 1 ? '1 eletrão a mais' : `${-q} eletrões a mais`}: um ião negativo (${sym}).`,
      sci: q === 0 ? 'Neutro: Z eletrões.' : `Carga ${q > 0 ? '+' : '−'}${Math.abs(q)} (${sym}).`,
    }),
    crystalOnly: {
      kid: 'Mais de um eletrão extra só fica no sítio dentro de um cristal, onde os vizinhos ajudam a aguentar o empurrão (como os iões óxido da ferrugem).',
      sci: 'Os dianiões atómicos livres não são ligados em fase gasosa (o O²⁻ só existe estabilizado por uma rede cristalina, a energia de Madelung).',
    },
    noExtra: (Z, lang) => ({
      kid: `${cap(art(Z))} ${nm(Z, lang)} não quer um eletrão a mais: ele foge.`,
      sci: `${cap(art(Z))} ${nm(Z, lang)} não tem afinidade eletrónica positiva: o seu anião não é ligado.`,
    }),
    tooMany: { kid: 'Não há espaço: os eletrões a mais empurram-se uns aos outros para fora.', sci: 'Para lá da carga −3, nada liga um anião atómico.' },
    noHold: { kid: 'Sem protões, nada segura um eletrão.', sci: 'Sem carga nuclear, um eletrão não fica ligado.' },
    stable: {
      kid: 'O núcleo é estável: pode durar para sempre.',
      sci: 'Estável (nunca se observou decaimento).',
    },
    natural: ab => ({ kid: `É assim que ${ab >= 50 ? 'a maior parte dele' : 'uma parte dele'} se encontra na natureza (${String(ab).replace('.', ',')}%).`, sci: `Abundância natural: ${String(ab).replace('.', ',')}%.` }),
    radioactive: (hl, mode) => ({
      kid: `Radioativo! Metade de um monte destes desfaz-se em ${hl}. Decai por ${KIDMODE['pt-pt'][mode] ?? 'se desfazer'}.`,
      sci: `Radioativo: meia-vida de ${hl}, modo de decaimento ${SCIMODE['pt-pt'][mode] ?? mode}.`,
    }),
    instant: { kid: 'Treme demasiado: desfaz-se logo!', sci: 'Não ligado ou quase: decai em cerca de 10⁻¹² s, muitas vezes largando um nucleão.' },
    unmeasured: { kid: 'Os cientistas já fizeram este, mas ninguém mediu quanto tempo dura.', sci: 'Observado, meia-vida por medir.' },
    rich: { kid: 'Neutrões a mais: o núcleo não os consegue segurar, por isso vão pingando para fora.', sci: 'Para lá dos isótopos conhecidos, do lado rico em neutrões (além da linha de gotejamento de neutrões): largam-se neutrões.' },
    poor: { kid: 'Neutrões a menos: os protões empurram-se uns aos outros e um sai disparado.', sci: 'Para lá dos isótopos conhecidos, do lado rico em protões (além da linha de gotejamento de protões): largam-se protões.' },
    notMade: { kid: 'Ainda ninguém fez este! Talvez um dia...', sci: 'Ainda não observado: não há nenhuma medição.' },
    held: { kid: 'O campo de forças está a segurá-lo enquanto constróis.', sci: 'Seguro (decaimento automático desligado).' },
  },
}

const FEMININE = new Set(['Ag', 'Pt'])
const art = Z => (FEMININE.has(el(Z).symbol) ? 'a' : 'o')
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

const KIDMODE = {
  en: { alpha: 'shooting out an alpha particle (2 protons and 2 neutrons)', betaMinus: 'turning a neutron into a proton and shooting out an electron', betaPlus: 'turning a proton into a neutron and shooting out a positron', capture: 'swallowing one of its own electrons', proton: 'spitting out a proton', neutron: 'spitting out a neutron', fission: 'splitting in two', cluster: 'shooting out a whole small nucleus' },
  'pt-pt': { alpha: 'disparar uma partícula alfa (2 protões e 2 neutrões)', betaMinus: 'transformar um neutrão num protão e disparar um eletrão', betaPlus: 'transformar um protão num neutrão e disparar um positrão', capture: 'engolir um dos seus próprios eletrões', proton: 'cuspir um protão', neutron: 'cuspir um neutrão', fission: 'se partir em dois', cluster: 'disparar um pequeno núcleo inteiro' },
}
const SCIMODE = {
  en: { alpha: 'α', betaMinus: 'β⁻', betaPlus: 'β⁺', capture: 'electron capture (EC)', proton: 'proton emission', neutron: 'neutron emission', fission: 'spontaneous fission', cluster: 'cluster decay' },
  'pt-pt': { alpha: 'α', betaMinus: 'β⁻', betaPlus: 'β⁺', capture: 'captura eletrónica (CE)', proton: 'emissão de protão', neutron: 'emissão de neutrão', fission: 'fissão espontânea', cluster: 'decaimento por agregado' },
}

const DECAYED = {
  en: {
    alpha: (a, b) => `It shot out an alpha particle: 2 protons and 2 neutrons. Two steps back in the table: now it is ${b}.`,
    betaMinus: (a, b) => `A neutron turned into a proton and shot out an electron (and a ghostly antineutrino). One step forward: now it is ${b}.`,
    betaPlus: (a, b) => `A proton turned into a neutron and shot out a positron, the electron's antiparticle. One step back: now it is ${b}.`,
    capture: (a, b) => `The nucleus swallowed one of its own electrons: a proton became a neutron. One step back: now it is ${b}.`,
    proton: (a, b) => `A proton flew out: now it is ${b}.`,
    neutron: (a, b) => `A neutron dripped out: now it is ${b}.`,
    fission: (a, b) => `It split in two! One piece flew away with a few neutrons; the bigger piece stayed: ${b}.`,
    cluster: (a, b) => `It shot out a whole small nucleus! What is left is ${b}.`,
  },
  'pt-pt': {
    alpha: (a, b) => `Disparou uma partícula alfa: 2 protões e 2 neutrões. Dois passos atrás na tabela: agora é ${b}.`,
    betaMinus: (a, b) => `Um neutrão transformou-se num protão e disparou um eletrão (e um antineutrino quase fantasma). Um passo em frente: agora é ${b}.`,
    betaPlus: (a, b) => `Um protão transformou-se num neutrão e disparou um positrão, a antipartícula do eletrão. Um passo atrás: agora é ${b}.`,
    capture: (a, b) => `O núcleo engoliu um dos seus próprios eletrões: um protão passou a neutrão. Um passo atrás: agora é ${b}.`,
    proton: (a, b) => `Saiu disparado um protão: agora é ${b}.`,
    neutron: (a, b) => `Pingou um neutrão para fora: agora é ${b}.`,
    fission: (a, b) => `Partiu-se em dois! Um pedaço voou com alguns neutrões; ficou o pedaço maior: ${b}.`,
    cluster: (a, b) => `Disparou um pequeno núcleo inteiro! O que ficou é ${b}.`,
  },
}

const EQUATION_PARTICLE = { alpha: '⁴He (α)', betaMinus: 'e⁻ + ν̄', betaPlus: 'e⁺ + ν', capture: 'ν', proton: 'p', neutron: 'n', fission: '…', cluster: '…' }

/** What the forge says after a decay: { kid, sci } (sci: the nuclear equation). */
export function decayText(ev, lang) {
  const fam = modeFamily(ev.mode) ?? 'neutron'
  const to = ev.to.Z ? isotopeName(ev.to.Z, ev.to.N, lang) : lang === 'pt-pt' ? 'um neutrão' : 'a neutron'
  const from = ev.from.Z ? nuclideSymbol(ev.from.Z, ev.from.N, ev.from.Z) : 'n'
  const toSym = ev.to.Z ? nuclideSymbol(ev.to.Z, ev.to.N, ev.to.Z) : 'n'
  const L = DECAYED[lang] ?? DECAYED.en
  return { kid: L[fam](from, to), sci: `${from} → ${toSym} + ${EQUATION_PARTICLE[fam]} (${SCIMODE[lang]?.[fam] ?? ev.mode})` }
}

/**
 * The lines the forge shows about the atom on the table: [{ text, tone }], tone one of 'info', 'good',
 * 'warn', 'bad'. s: { Z, N, E, nuc (nucleus.js nuclide), common (the commonest N), held, note }.
 */
export function describe(s, lang, level) {
  const L = W[lang] ?? W.en
  const d = x => (level === 'scientist' ? x.sci : x.kid)
  const out = []
  const { Z, N, E, nuc } = s
  if (nuc.kind === 'empty') return [{ text: d(L.empty), tone: 'info' }]
  if (Z === 0) {
    out.push({ text: d(nuc.kind === 'neutron' ? L.neutron : L.neutrons), tone: nuc.kind === 'neutron' ? 'warn' : 'bad' })
    if (s.note) out.push({ text: d(L[s.note] ?? s.note), tone: 'warn' })
    return out
  }
  out.push({ text: d(L.element(Z, lang)), tone: 'info' })
  out.push({ text: d(L.isotope(Z, N, s.common)), tone: 'info' })
  if (nuc.kind === 'stable') out.push({ text: d(L.stable), tone: 'good' })
  else if (nuc.kind === 'radioactive') out.push({ text: d(L.radioactive(halfLifeText(nuc.t, lang), modeFamily(nuc.modes[0]) ?? nuc.modes[0])), tone: 'warn' })
  else if (nuc.kind === 'instant') out.push({ text: d(L.instant), tone: 'bad' })
  else if (nuc.kind === 'unmeasured') out.push({ text: d(L.unmeasured), tone: 'warn' })
  else if (nuc.kind === 'unknown') out.push({ text: d(nuc.side === 'rich' ? L.rich : nuc.side === 'poor' ? L.poor : L.notMade), tone: nuc.side ? 'bad' : 'warn' })
  if (nuc.abundance > 0) out.push({ text: d(L.natural(nuc.abundance)), tone: 'good' })
  const q = Z - E
  out.push({ text: d(L.ion(q, nuclideSymbol(Z, N, E))), tone: 'info' })
  if (s.note === 'crystalOnly') out.push({ text: d(L.crystalOnly), tone: 'warn' })
  if (s.note === 'noExtra') out.push({ text: d(L.noExtra(Z, lang)), tone: 'warn' })
  if (s.note === 'tooMany') out.push({ text: d(L.tooMany), tone: 'warn' })
  if (s.held && nuc.kind !== 'stable') out.push({ text: d(L.held), tone: 'info' })
  return out
}

/** A note without an atom (an electron with no protons to hold it). */
export const noteText = (note, lang, level) => {
  const x = (W[lang] ?? W.en)[note]
  return x ? (level === 'scientist' ? x.sci : x.kid) : null
}

/**
 * The missions, easy to hard. check(s, ev) with s the state { Z, N, E, nuc } and ev the last decay
 * ({ mode, from, to, origin }) or null.
 */
export const MISSIONS = [
  { id: 'H', check: s => s.Z === 1 && s.N === 0 && s.E === 1, name: { en: 'A hydrogen atom', 'pt-pt': 'Um átomo de hidrogénio' }, hint: { en: '1 proton and 1 electron: the simplest atom of all.', 'pt-pt': '1 protão e 1 eletrão: o átomo mais simples de todos.' } },
  { id: 'D', check: s => s.Z === 1 && s.N === 1 && s.E === 1, name: { en: 'Deuterium, heavy hydrogen', 'pt-pt': 'Deutério, o hidrogénio pesado' }, hint: { en: 'Hydrogen with a neutron too. About 1 in 6400 hydrogen atoms in the sea is one.', 'pt-pt': 'Hidrogénio com um neutrão. Cerca de 1 em cada 6400 átomos de hidrogénio do mar é assim.' } },
  { id: 'He4', check: s => s.Z === 2 && s.N === 2 && s.E === 2, name: { en: 'Helium-4', 'pt-pt': 'Hélio-4' }, hint: { en: '2 protons, 2 neutrons, 2 electrons: what the Sun makes from hydrogen.', 'pt-pt': '2 protões, 2 neutrões, 2 eletrões: o que o Sol faz a partir do hidrogénio.' } },
  { id: 'alpha', check: s => s.Z === 2 && s.N === 2 && s.E === 0, name: { en: 'An alpha particle', 'pt-pt': 'Uma partícula alfa' }, hint: { en: 'A helium nucleus with no electrons at all: what radium and uranium shoot out.', 'pt-pt': 'Um núcleo de hélio sem eletrão nenhum: o que o rádio e o urânio disparam.' } },
  { id: 'C12', check: s => s.Z === 6 && s.N === 6 && s.E === 6, name: { en: 'Carbon-12', 'pt-pt': 'Carbono-12' }, hint: { en: '6 of each: the carbon of every living thing.', 'pt-pt': '6 de cada: o carbono de todos os seres vivos.' } },
  { id: 'C14', check: (s, ev) => !!ev && ev.from.Z === 6 && ev.from.N === 8, name: { en: 'Carbon-14 turning into nitrogen', 'pt-pt': 'Carbono-14 a virar azoto' }, hint: { en: 'Make carbon-14 (8 neutrons) and press decay: the clock of archaeologists.', 'pt-pt': 'Faz carbono-14 (8 neutrões) e carrega em decair: o relógio dos arqueólogos.' } },
  { id: 'O16', check: s => s.Z === 8 && s.N === 8 && s.E === 8, name: { en: 'Oxygen-16', 'pt-pt': 'Oxigénio-16' }, hint: { en: '8 protons, 8 neutrons, 8 electrons: the oxygen you breathe.', 'pt-pt': '8 protões, 8 neutrões, 8 eletrões: o oxigénio que respiras.' } },
  { id: 'Na+', check: s => s.Z === 11 && s.N === 12 && s.E === 10, name: { en: 'A sodium ion, Na⁺', 'pt-pt': 'Um ião sódio, Na⁺' }, hint: { en: 'Sodium-23 with one electron given away, as in table salt.', 'pt-pt': 'Sódio-23 que deu um eletrão, como no sal de cozinha.' } },
  { id: 'Cl-', check: s => s.Z === 17 && (s.N === 18 || s.N === 20) && s.E === 18, name: { en: 'A chloride ion, Cl⁻', 'pt-pt': 'Um ião cloreto, Cl⁻' }, hint: { en: 'Chlorine-35 or 37 with one extra electron: the other half of salt.', 'pt-pt': 'Cloro-35 ou 37 com um eletrão a mais: a outra metade do sal.' } },
  { id: 'Fe56', check: s => s.Z === 26 && s.N === 30 && s.E === 26, name: { en: 'Iron-56', 'pt-pt': 'Ferro-56' }, hint: { en: 'Where the stars stop: fusing past iron costs energy instead of giving it.', 'pt-pt': 'Onde as estrelas param: fundir para lá do ferro gasta energia em vez de a dar.' } },
  { id: 'Tc', check: s => s.Z === 43 && s.nuc.kind !== 'unknown', name: { en: 'Technetium', 'pt-pt': 'Tecnécio' }, hint: { en: '43 protons: the first element made by people (1937), none of it stable.', 'pt-pt': '43 protões: o primeiro elemento feito pelas pessoas (1937), sem nenhum isótopo estável.' } },
  { id: 'flash', check: s => s.nuc.t != null && s.nuc.t > 0 && s.nuc.t < 1e-6, name: { en: 'A millionth-of-a-second nucleus', 'pt-pt': 'Um núcleo de um milionésimo de segundo' }, hint: { en: 'Find a nucleus with a half-life under a millionth of a second (try too many neutrons).', 'pt-pt': 'Encontra um núcleo com meia-vida abaixo de um milionésimo de segundo (experimenta neutrões a mais).' } },
  { id: 'U238', check: (s, ev) => !!ev && ev.to.Z === 82 && ev.to.N === 124 && ev.origin?.Z === 92 && ev.origin?.N === 146, name: { en: 'From uranium to lead', 'pt-pt': 'Do urânio ao chumbo' }, hint: { en: 'Make uranium-238 (92 protons, 146 neutrons) and keep pressing decay until it is lead-206: 14 steps.', 'pt-pt': 'Faz urânio-238 (92 protões, 146 neutrões) e carrega em decair até ser chumbo-206: 14 passos.' } },
  { id: 'Og', check: s => s.Z === 118 && s.N === 176, name: { en: 'Oganesson-294', 'pt-pt': 'Oganésson-294' }, hint: { en: 'The heaviest atom ever made: 118 protons, 176 neutrons, gone in under a thousandth of a second.', 'pt-pt': 'O átomo mais pesado alguma vez feito: 118 protões, 176 neutrões, desaparece em menos de um milésimo de segundo.' } },
]
