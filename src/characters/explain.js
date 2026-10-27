// An Atomling read aloud: each feature and what it says about the element (the Atomlings page's
// card). Pure: traits in, sentences out, in both languages.
import { ELEMENTS } from '../data/elements.js'
import { traitsOf } from './traits.js'

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
  if (tr.mark && L.marks[tr.mark]) out.push(L.marks[tr.mark])
  if (tr.superheavy) out.push(L.superheavy)
  else if (tr.radioactive) out.push(L.radioactive)
  return out
}
