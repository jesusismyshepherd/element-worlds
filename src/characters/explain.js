// An Atomling read aloud: each feature and what it says about the element (the Atomlings page's
// card). Pure: traits in, sentences out, in both languages.
import { ELEMENTS, nameOf } from '../data/elements.js'
import { traitsOf } from './traits.js'
import { HELMET, SIGNATURE } from './look.js'

// the flame-test colours' names (look.js FLAME)
const FLAME_NAME = {
  Li: ['crimson', 'carmesim'], Na: ['yellow-orange', 'amarelo-alaranjado'], K: ['lilac', 'lilás'],
  Rb: ['red-violet', 'vermelho-violeta'], Cs: ['blue-violet', 'azul-violeta'],
  Ca: ['orange-red', 'vermelho-alaranjado'], Sr: ['crimson', 'carmesim'], Ba: ['apple green', 'verde-maçã'], Ra: ['crimson', 'carmesim'],
}
const SHAPE = {
  round: ['a round helmet', 'um capacete redondo'], crest: ['a crest', 'uma crista'], horns: ['two horns', 'dois chifres'],
  visor: ['a visor', 'uma viseira'], spike: ['a spike', 'um espigão'], plume: ['a plume', 'um penacho'],
  bolts: ['two bolts', 'dois parafusos'], band: ['a band', 'um aro'], coin: ['a coin', 'uma moeda'], drop: ['a drop', 'uma gota'],
}
const SIG = {
  drop: ['The water drop: two hydrogens and an oxygen make water.', 'A gota de água: dois hidrogénios e um oxigénio fazem água.'],
  balloon: ['The balloon: helium is lighter than air, so it lifts party balloons.', 'O balão: o hélio é mais leve do que o ar, por isso faz subir os balões.'],
  battery: ['The battery: lithium-ion batteries power phones and electric cars.', 'A pilha: as baterias de iões de lítio alimentam telemóveis e carros elétricos.'],
  salt: ['The salt cube: table salt is sodium chloride.', 'O cubo de sal: o sal de cozinha é cloreto de sódio.'],
  leaf: ['The leaf: every chlorophyll molecule, the green of leaves, has a magnesium atom at its heart.', 'A folha: cada molécula de clorofila, o verde das folhas, tem um átomo de magnésio no centro.'],
  match: ["The match: matches light thanks to phosphorus, on the box's striking strip.", 'O fósforo de acender: acende graças ao fósforo da lixa da caixa.'],
  banana: ['The banana: bananas are rich in potassium.', 'A banana: as bananas são ricas em potássio.'],
  bone: ['The bone: our bones and teeth are made with calcium.', 'O osso: os nossos ossos e dentes são feitos com cálcio.'],
  chip: ['The chip: computer chips are made of silicon.', 'O chip: os chips dos computadores são feitos de silício.'],
  magnet: ['The magnet: iron is magnetic.', 'O íman: o ferro é magnético.'],
  coil: ['The coil: copper wires carry electricity.', 'A bobina: os fios de cobre levam a eletricidade.'],
  bulb: ['The bulb: old light bulbs glowed with a tungsten filament, the metal with the highest melting point.', 'A lâmpada: as lâmpadas antigas brilhavam com um filamento de tungsténio, o metal com o ponto de fusão mais alto.'],
  crown: ['The crown: gold has been the metal of kings and treasures for thousands of years.', 'A coroa: o ouro é o metal dos reis e dos tesouros há milhares de anos.'],
}

const art = el => (el.symbol === 'Ag' || el.symbol === 'Pt' ? 'a' : 'o')
const byRadius = [...ELEMENTS].filter(e => e.radius.covalent != null).sort((a, b) => b.radius.covalent - a.radius.covalent)
const radiusRank = new Map(byRadius.map((e, i) => [e.z, i + 1]))

const ordinal = n => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
const S = {
  en: {
    hands0: 'No hands: its outer shell is full, so it almost never bonds.',
    giving: n => `${n} hand${n > 1 ? 's' : ''} holding out ${n > 1 ? 'electrons' : 'an electron'}: a metal gives electrons away.`,
    hands: n => `${n} hand${n > 1 ? 's' : ''}: it usually makes ${n} bond${n > 1 ? 's' : ''}.`,
    hoop: (v, free, places) => `Its hoop: ${v} outer electron${v === 1 ? '' : 's'}, and ${free ? `${free} free place${free > 1 ? 's' : ''}` : 'no free place'} of ${places}.`,
    inHands: n => (n > 1 ? 'Its outer electrons are in its hands, ready to be given away.' : 'Its outer electron is in its hand, ready to be given away.'),
    hoopInner: v => `Its hoop: ${v} outer electron${v === 1 ? '' : 's'}; the others hide in inner shells.`,
    size: (h, r, rank, of) => rank <= of / 2
      ? `${h} m tall: its atomic radius is ${r} pm, the ${rank > 1 ? `${ordinal(rank)} ` : ''}largest of ${of}.`
      : `${h} m tall: its atomic radius is ${r} pm, the ${of + 1 - rank > 1 ? `${ordinal(of + 1 - rank)} ` : ''}smallest of ${of}.`,
    walk: 'It walks: at 20 °C it is a solid.',
    slide: 'It slides: at 20 °C it is a liquid.',
    floatHigh: 'It floats high: a gas lighter than air.',
    floatLow: 'It floats low: a gas heavier than air.',
    metal: 'A shiny metal body: it is a metal.',
    nonmetal: 'A see-through body with its nucleus inside: a non-metal.',
    metalloid: 'Half metal, half not: a metalloid.',
    noble: 'A glowing see-through body: a noble gas.',
    marks: {
      flame: 'The flame: alkali metals react wildly, even with water.',
      nubs: 'Two nubs: an alkaline earth metal.',
      helmet: "A smith's helmet: a transition metal.",
      cap: 'A cap: a post-transition metal, softer than its neighbours.',
      antenna: 'An antenna: a metalloid, between the metals and the non-metals.',
      crest: 'Spikes: a halogen, always grabbing one more electron.',
      halo: 'A halo: a noble gas, complete and calm.',
      gem: 'A gem: a lanthanide or an actinide.',
      curl: 'One curl: hydrogen, the simplest atom of all.',
    },
    radioactive: 'Its glow: it is radioactive.',
    superheavy: 'It flickers: only a few atoms of it have ever been made.',
  },
  'pt-pt': {
    hands0: 'Sem mãos: a camada de fora está cheia, por isso quase nunca faz ligações.',
    giving: n => `${n} ${n > 1 ? 'mãos a estender eletrões' : 'mão a estender um eletrão'}: um metal dá eletrões.`,
    hands: n => `${n} ${n > 1 ? 'mãos' : 'mão'}: costuma fazer ${n} ${n > 1 ? 'ligações' : 'ligação'}.`,
    hoop: (v, free, places) => `O arco: ${v} ${v === 1 ? 'eletrão' : 'eletrões'} de fora e ${free ? `${free} ${free > 1 ? 'lugares livres' : 'lugar livre'}` : 'nenhum lugar livre'} em ${places}.`,
    inHands: n => (n > 1 ? 'Os eletrões de fora estão nas mãos, prontos a ser dados.' : 'O eletrão de fora está na mão, pronto a ser dado.'),
    hoopInner: v => `O arco: ${v} ${v === 1 ? 'eletrão' : 'eletrões'} de fora; os outros escondem-se nas camadas de dentro.`,
    size: (h, r, rank, of) => rank <= of / 2
      ? `${h} m de altura: o raio atómico é ${r} pm, o ${rank > 1 ? `${rank}.º ` : ''}maior de ${of}.`
      : `${h} m de altura: o raio atómico é ${r} pm, o ${of + 1 - rank > 1 ? `${of + 1 - rank}.º ` : ''}mais pequeno de ${of}.`,
    walk: 'Anda: a 20 °C é sólido.',
    slide: 'Desliza: a 20 °C é líquido.',
    floatHigh: 'Flutua alto: um gás mais leve do que o ar.',
    floatLow: 'Flutua baixo: um gás mais pesado do que o ar.',
    metal: 'Um corpo de metal brilhante: é um metal.',
    nonmetal: 'Um corpo transparente com o núcleo lá dentro: um não metal.',
    metalloid: 'Metade metal, metade não: um semimetal.',
    noble: 'Um corpo transparente que brilha: um gás nobre.',
    marks: {
      flame: 'A chama: os metais alcalinos reagem com força, até com a água.',
      nubs: 'Duas bolinhas: um metal alcalinoterroso.',
      helmet: 'Um capacete de ferreiro: um metal de transição.',
      cap: 'Um gorro: um metal pós-transição, mais mole do que os vizinhos.',
      antenna: 'Uma antena: um semimetal, entre os metais e os não metais.',
      crest: 'Espinhos: um halogéneo, sempre a agarrar mais um eletrão.',
      halo: 'Um halo: um gás nobre, completo e tranquilo.',
      gem: 'Uma pedra preciosa: um lantanídeo ou um actinídeo.',
      curl: 'Um caracol: o hidrogénio, o átomo mais simples de todos.',
    },
    radioactive: 'O brilho: é radioativo.',
    superheavy: 'Pisca: só se fizeram alguns átomos dele.',
  },
}

/** The sentences that read an Atomling, in order: hands, hoop, size, movement, body, mark, glow. */
export function explain(el, lang) {
  const L = S[lang] ?? S.en
  const tr = traitsOf(el)
  const out = []
  out.push(tr.hands === 0 ? L.hands0 : tr.giving ? L.giving(tr.hands) : L.hands(tr.hands))
  if (tr.electronsInHands) out.push(L.inHands(tr.valence))
  else if (tr.places) out.push(L.hoop(tr.valence, tr.places - tr.valence, tr.places))
  else out.push(L.hoopInner(tr.valence))
  const h = tr.height.toFixed(2).replace('.', lang === 'pt-pt' ? ',' : '.')
  out.push(L.size(h, el.radius.covalent, radiusRank.get(el.z), byRadius.length))
  out.push(tr.locomotion === 'walk' ? L.walk : tr.locomotion === 'slide' ? L.slide : tr.hover > 0.5 ? L.floatHigh : L.floatLow)
  out.push(L[tr.material])
  const replaced = tr.mark === 'helmet' && ['crown', 'bulb'].includes(SIGNATURE[el.symbol])
  if (tr.mark && L.marks[tr.mark] && !replaced) out.push(L.marks[tr.mark])
  const k = lang === 'pt-pt' ? 1 : 0
  if (FLAME_NAME[el.symbol] && (tr.mark === 'flame' || tr.mark === 'nubs')) {
    const c = FLAME_NAME[el.symbol][k]
    out.push(k ? `Brilha ${c}: a cor que ${art(el)} ${nameOf(el, lang).toLowerCase()} dá a uma chama.` : `It glows ${c}: the colour ${nameOf(el, lang).toLowerCase()} gives a flame.`)
  }
  if (tr.mark === 'helmet' && HELMET[el.group] && !['crown', 'bulb'].includes(SIGNATURE[el.symbol])) {
    const shape = SHAPE[HELMET[el.group]][k]
    out.push(k ? `No capacete, ${shape}: a marca do grupo ${el.group}, que toda a coluna usa.` : `On its helmet, ${shape}: the mark of group ${el.group}, worn by its whole column.`)
  }
  if (SIGNATURE[el.symbol] && SIG[SIGNATURE[el.symbol]]) out.push(SIG[SIGNATURE[el.symbol]][k])
  if (tr.superheavy) out.push(L.superheavy)
  else if (tr.radioactive) out.push(L.radioactive)
  return out
}
