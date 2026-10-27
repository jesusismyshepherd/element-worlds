// What each element looks like for real, for the specimen case in its atrium: a form (metal, crystal,
// powder, liquid, gas, tube for the noble gases' glow, unknown for the superheavies nobody has seen),
// a colour, and a short description in both languages. Elements not listed are silvery metals.
const SILVER = { form: 'metal', color: '#c8ccd4', look: { en: 'a silvery metal', 'pt-pt': 'um metal prateado' } }

const G = (color, en, pt, extra = {}) => ({ form: 'gas', color, look: { en, 'pt-pt': pt }, ...extra })
const M = (color, en, pt, extra = {}) => ({ form: 'metal', color, look: { en, 'pt-pt': pt }, ...extra })
const X = (color, en, pt, extra = {}) => ({ form: 'crystal', color, look: { en, 'pt-pt': pt }, ...extra })
const L = (color, en, pt, extra = {}) => ({ form: 'liquid', color, look: { en, 'pt-pt': pt }, ...extra })
const T = (glow, en, pt) => ({ form: 'tube', color: '#e8eef7', glow, look: { en, 'pt-pt': pt } })

const LOOK = {
  H: G('#f4f7fb', 'a colourless gas, the lightest of all', 'um gás incolor, o mais leve de todos'),
  He: T('#ffb38a', 'a colourless gas that glows peach-pink in a lamp', 'um gás incolor que brilha cor de pêssego numa lâmpada'),
  Li: M('#d8d9dc', 'a soft silvery metal, so light it floats on oil', 'um metal prateado e mole, tão leve que flutua no óleo'),
  Be: M('#b6bcc4', 'a hard steel-grey metal', 'um metal cinzento-aço e duro'),
  B: X('#3b3532', 'hard black-brown crystals', 'cristais duros, castanho-escuros'),
  C: X('#2b2d31', 'black shiny graphite (and, squeezed hard, clear diamond)', 'grafite preta e brilhante (e, muito apertado, diamante transparente)'),
  N: G('#f4f7fb', 'a colourless gas, most of the air', 'um gás incolor, a maior parte do ar'),
  O: G('#dfe9ff', 'a colourless gas; as a liquid it is pale blue', 'um gás incolor; líquido, é azul-claro', { liquid: '#9cc7ff' }),
  F: G('#f0f2a0', 'a pale yellow gas, the most reactive element', 'um gás amarelo-pálido, o elemento mais reativo'),
  Ne: T('#ff5a3c', 'a colourless gas that glows red-orange in neon signs', 'um gás incolor que brilha vermelho-alaranjado nos reclamos de néon'),
  Na: M('#d9dadb', 'a soft silvery metal you can cut with a knife', 'um metal prateado tão mole que se corta com uma faca'),
  Mg: M('#c4c8cc', 'a shiny grey metal that burns with a dazzling white light', 'um metal cinzento e brilhante que arde com uma luz branca ofuscante'),
  Al: M('#d3d6da', 'a light silvery metal', 'um metal prateado e leve'),
  Si: X('#6f7a8a', 'grey crystals with a blue metallic shine', 'cristais cinzentos com brilho metálico azulado'),
  P: X('#efe6c4', 'white phosphorus: a waxy solid that glows faintly in the dark', 'fósforo branco: um sólido parecido com cera que brilha fraquinho no escuro', { glow: '#b9ff9c' }),
  S: X('#f2d21b', 'bright yellow crystals', 'cristais amarelo-vivo'),
  Cl: G('#c7e86b', 'a yellow-green gas with a sharp smell', 'um gás amarelo-esverdeado de cheiro forte'),
  Ar: T('#c38bff', 'a colourless gas that glows violet in a lamp', 'um gás incolor que brilha violeta numa lâmpada'),
  K: M('#d6d7d9', 'a soft silvery metal', 'um metal prateado e mole'),
  Ca: M('#c9c6bc', 'a dull silvery-grey metal', 'um metal cinzento-prateado e baço'),
  Ti: M('#a8adb4', 'a strong, light grey metal', 'um metal cinzento, forte e leve'),
  Cr: M('#c3cbd6', 'a hard, very shiny bluish-silver metal', 'um metal duro, prateado-azulado e muito brilhante'),
  Mn: M('#a9a9a4', 'a hard, brittle grey metal', 'um metal cinzento, duro e quebradiço'),
  Fe: M('#a3a6ab', 'a grey metal (that rusts red-brown)', 'um metal cinzento (que enferruja, castanho-avermelhado)'),
  Co: M('#a8b0bd', 'a hard bluish-grey metal', 'um metal duro, cinzento-azulado'),
  Ni: M('#cfc8b8', 'a silvery metal with a hint of gold', 'um metal prateado com um toque dourado'),
  Cu: M('#d27d4f', 'a reddish-orange metal', 'um metal laranja-avermelhado'),
  Zn: M('#b7bfca', 'a bluish-silver metal', 'um metal prateado-azulado'),
  Ga: M('#d5dbe2', 'a silvery metal that melts in your hand', 'um metal prateado que derrete na mão'),
  Ge: X('#9aa1a8', 'grey-white shiny crystals', 'cristais brilhantes, branco-acinzentados'),
  As: X('#7e8288', 'metallic grey crystals', 'cristais cinzentos com brilho metálico'),
  Se: X('#5b5f66', 'grey metallic crystals (red when powdered)', 'cristais cinzentos metálicos (vermelho em pó)'),
  Br: L('#7a1408', 'a dark red-brown liquid that gives off orange fumes', 'um líquido castanho-avermelhado que liberta vapores cor de laranja'),
  Kr: T('#e8ddff', 'a colourless gas that glows white-lilac in a lamp', 'um gás incolor que brilha branco-lilás numa lâmpada'),
  Rb: M('#d9d7cf', 'a very soft silvery metal', 'um metal prateado muito mole'),
  Tc: M('#b9bcc2', 'a silvery-grey metal, radioactive', 'um metal cinzento-prateado, radioativo', { radioactive: true }),
  Ag: M('#e3e6ea', 'the whitest, most shiny metal', 'o metal mais branco e brilhante'),
  Cd: M('#bcc4cf', 'a soft bluish-silver metal', 'um metal mole, prateado-azulado'),
  In: M('#cfd2d6', 'a metal so soft you can scratch it with a fingernail', 'um metal tão mole que se risca com a unha'),
  Sb: X('#a3a7ad', 'a brittle silvery-grey solid', 'um sólido quebradiço, cinzento-prateado'),
  Te: X('#b4b8bd', 'a brittle silvery-white solid', 'um sólido quebradiço, branco-prateado'),
  I: X('#3a2b49', 'shiny violet-black crystals that make violet vapour', 'cristais negro-violeta e brilhantes que libertam vapor violeta', { vapour: '#9b5bd6' }),
  Xe: T('#7ea8ff', 'a colourless gas that glows blue in a lamp', 'um gás incolor que brilha azul numa lâmpada'),
  Cs: M('#e3c776', 'a pale gold metal that melts at 28 °C', 'um metal dourado-pálido que funde a 28 °C'),
  Eu: M('#c9c3b5', 'a silvery metal that quickly tarnishes', 'um metal prateado que escurece depressa'),
  Pm: M('#c3c6cc', 'a silvery metal, radioactive', 'um metal prateado, radioativo', { radioactive: true }),
  Ta: M('#9aa4b4', 'a hard grey-blue metal', 'um metal duro, cinzento-azulado'),
  W: M('#b3b6bb', 'a heavy greyish-white metal (melts at 3422 °C)', 'um metal pesado, branco-acinzentado (funde a 3422 °C)'),
  Os: M('#a9b8d6', 'a bluish-white metal, the densest element', 'um metal branco-azulado, o elemento mais denso'),
  Pt: M('#dfe1e3', 'a heavy silvery-white precious metal', 'um metal precioso, pesado e branco-prateado'),
  Au: M('#f2c040', 'a shiny yellow precious metal', 'um metal precioso amarelo e brilhante'),
  Hg: L('#c9ced6', 'a silvery liquid metal', 'um metal líquido e prateado'),
  Tl: M('#a9aeb3', 'a soft grey metal, very poisonous', 'um metal cinzento e mole, muito venenoso'),
  Pb: M('#8a8f98', 'a soft, heavy, dull grey metal', 'um metal cinzento-baço, mole e pesado'),
  Bi: X('#d6b9e3', 'rainbow-coloured stepped crystals', 'cristais em degraus, com cores de arco-íris', { rainbow: true }),
  Po: M('#bfc3c9', 'a silvery metal that glows with radioactivity', 'um metal prateado que brilha com a radioatividade', { radioactive: true }),
  At: { form: 'unknown', color: '#8a8f99', look: { en: 'nobody knows: there was never enough to see', 'pt-pt': 'ninguém sabe: nunca houve o suficiente para se ver' } },
  Rn: G('#f4f7fb', 'a colourless radioactive gas', 'um gás incolor e radioativo', { radioactive: true }),
  Fr: { form: 'unknown', color: '#8a8f99', look: { en: 'nobody has seen it: it breaks apart in minutes', 'pt-pt': 'ninguém o viu: desfaz-se em minutos' } },
  Ra: M('#e2e3df', 'a silvery-white metal, radioactive', 'um metal branco-prateado, radioativo', { radioactive: true }),
  Ac: M('#d3d6dc', 'a silvery metal that glows pale blue in the dark', 'um metal prateado que brilha azul-pálido no escuro', { radioactive: true }),
  U: M('#a6a9a6', 'a heavy silvery-grey metal, radioactive', 'um metal pesado, cinzento-prateado, radioativo', { radioactive: true }),
  Pu: M('#b8b6ae', 'a silvery metal, warm to the touch from its radioactivity', 'um metal prateado, morno por causa da radioatividade', { radioactive: true }),
}

/** How an element looks: its entry, or by family and number for the rest. */
export function appearanceOf(el) {
  if (LOOK[el.symbol]) return LOOK[el.symbol]
  if (el.z >= 100) {
    return { form: 'unknown', color: '#8a8f99', look: { en: 'nobody has seen it: only a few atoms were ever made', 'pt-pt': 'ninguém o viu: só se fizeram alguns átomos' } }
  }
  if (el.family === 'actinide' || el.radioactive) {
    return { ...SILVER, radioactive: true, look: { en: 'a silvery metal, radioactive', 'pt-pt': 'um metal prateado, radioativo' } }
  }
  return SILVER
}
