// What each element looks like for real, for the specimen case in its atrium: a form (metal, crystal,
// powder, liquid, gas, tube for the noble gases' glow, unknown for the superheavies nobody has seen),
// a colour, and a short description in every language. Elements not listed are silvery metals.
const SILVER = { form: 'metal', color: '#c8ccd4', look: { en: 'a silvery metal', 'pt-pt': 'um metal prateado', pl: 'srebrzysty metal', de: 'ein silbriges Metall' } }

const texts = (en, pt, pl, de) => ({ en, 'pt-pt': pt, pl, de })
const G = (color, en, pt, pl, de, extra = {}) => ({ form: 'gas', color, look: texts(en, pt, pl, de), ...extra })
const M = (color, en, pt, pl, de, extra = {}) => ({ form: 'metal', color, look: texts(en, pt, pl, de), ...extra })
const X = (color, en, pt, pl, de, extra = {}) => ({ form: 'crystal', color, look: texts(en, pt, pl, de), ...extra })
const L = (color, en, pt, pl, de, extra = {}) => ({ form: 'liquid', color, look: texts(en, pt, pl, de), ...extra })
const T = (glow, en, pt, pl, de) => ({ form: 'tube', color: '#e8eef7', glow, look: texts(en, pt, pl, de) })

const LOOK = {
  H: G('#f4f7fb', 'a colourless gas, the lightest of all, that glows pink-violet in a tube', 'um gás incolor, o mais leve de todos, que brilha rosa-violeta num tubo', 'bezbarwny gaz, najlżejszy ze wszystkich, który w rurce świeci różowofioletowo', 'ein farbloses Gas, das leichteste von allen, das in einer Röhre rosaviolett leuchtet'),
  He: T('#ffb38a', 'a colourless gas that glows peach-pink in a lamp', 'um gás incolor que brilha cor de pêssego numa lâmpada', 'bezbarwny gaz, który w lampie świeci brzoskwiniowo-różowo', 'ein farbloses Gas, das in einer Lampe pfirsichrosa leuchtet'),
  Li: M('#d8d9dc', 'a soft silvery metal, so light it floats on oil', 'um metal prateado e mole, tão leve que flutua no óleo', 'miękki srebrzysty metal, tak lekki, że pływa po oleju', 'ein weiches, silbriges Metall, so leicht, dass es auf Öl schwimmt'),
  Be: M('#b6bcc4', 'a hard steel-grey metal', 'um metal cinzento-aço e duro', 'twardy stalowoszary metal', 'ein hartes, stahlgraues Metall'),
  B: X('#3b3532', 'hard black-brown crystals', 'cristais duros, castanho-escuros', 'twarde czarnobrązowe kryształy', 'harte schwarzbraune Kristalle'),
  C: X('#2b2d31', 'black shiny graphite (and, squeezed hard, clear diamond)', 'grafite preta e brilhante (e, muito apertado, diamante transparente)', 'czarny, błyszczący grafit (a mocno ściśnięty: przezroczysty diament)', 'schwarzer, glänzender Graphit (und, stark zusammengepresst, klarer Diamant)'),
  N: G('#f4f7fb', 'a colourless gas, most of the air', 'um gás incolor, a maior parte do ar', 'bezbarwny gaz, z którego składa się większość powietrza', 'ein farbloses Gas, der größte Teil der Luft'),
  O: G('#dfe9ff', 'a colourless gas; as a liquid it is pale blue', 'um gás incolor; líquido, é azul-claro', 'bezbarwny gaz; jako ciecz jest bladoniebieski', 'ein farbloses Gas; als Flüssigkeit ist es hellblau', { liquid: '#9cc7ff' }),
  F: G('#f0f2a0', 'a pale yellow gas, the most reactive element', 'um gás amarelo-pálido, o elemento mais reativo', 'bladożółty gaz, najbardziej reaktywny pierwiastek', 'ein blassgelbes Gas, das reaktivste Element'),
  Ne: T('#ff5a3c', 'a colourless gas that glows red-orange in neon signs', 'um gás incolor que brilha vermelho-alaranjado nos reclamos de néon', 'bezbarwny gaz, który w neonach świeci na czerwono-pomarańczowo', 'ein farbloses Gas, das in Leuchtreklamen rotorange leuchtet'),
  Na: M('#d9dadb', 'a soft silvery metal you can cut with a knife', 'um metal prateado tão mole que se corta com uma faca', 'miękki srebrzysty metal, który można kroić nożem', 'ein weiches, silbriges Metall, das man mit einem Messer schneiden kann'),
  Mg: M('#c4c8cc', 'a shiny grey metal that burns with a dazzling white light', 'um metal cinzento e brilhante que arde com uma luz branca ofuscante', 'błyszczący szary metal, który płonie oślepiająco białym światłem', 'ein glänzendes graues Metall, das mit blendend weißem Licht brennt'),
  Al: M('#d3d6da', 'a light silvery metal', 'um metal prateado e leve', 'lekki srebrzysty metal', 'ein leichtes, silbriges Metall'),
  Si: X('#6f7a8a', 'grey crystals with a blue metallic shine', 'cristais cinzentos com brilho metálico azulado', 'szare kryształy o niebieskawym metalicznym połysku', 'graue Kristalle mit bläulichem Metallglanz'),
  P: X('#efe6c4', 'white phosphorus: a waxy solid that glows faintly in the dark', 'fósforo branco: um sólido parecido com cera que brilha fraquinho no escuro', 'biały fosfor: woskowate ciało stałe, które słabo świeci w ciemności', 'weißer Phosphor: ein wachsartiger Feststoff, der im Dunkeln schwach leuchtet', { glow: '#b9ff9c' }),
  S: X('#f2d21b', 'bright yellow crystals', 'cristais amarelo-vivo', 'jaskrawożółte kryształy', 'leuchtend gelbe Kristalle'),
  Cl: G('#c7e86b', 'a yellow-green gas with a sharp smell', 'um gás amarelo-esverdeado de cheiro forte', 'żółtozielony gaz o ostrym zapachu', 'ein gelbgrünes Gas mit stechendem Geruch'),
  Ar: T('#c38bff', 'a colourless gas that glows violet in a lamp', 'um gás incolor que brilha violeta numa lâmpada', 'bezbarwny gaz, który w lampie świeci na fioletowo', 'ein farbloses Gas, das in einer Lampe violett leuchtet'),
  K: M('#d6d7d9', 'a soft silvery metal', 'um metal prateado e mole', 'miękki srebrzysty metal', 'ein weiches, silbriges Metall'),
  Ca: M('#c9c6bc', 'a dull silvery-grey metal', 'um metal cinzento-prateado e baço', 'matowy srebrzystoszary metal', 'ein mattes, silbergraues Metall'),
  Ti: M('#a8adb4', 'a strong, light grey metal', 'um metal cinzento, forte e leve', 'mocny, lekki szary metal', 'ein festes, leichtes graues Metall'),
  Cr: M('#c3cbd6', 'a hard, very shiny bluish-silver metal', 'um metal duro, prateado-azulado e muito brilhante', 'twardy, bardzo błyszczący niebieskawosrebrny metal', 'ein hartes, stark glänzendes, bläulich silbernes Metall'),
  Mn: M('#a9a9a4', 'a hard, brittle grey metal', 'um metal cinzento, duro e quebradiço', 'twardy, kruchy szary metal', 'ein hartes, sprödes graues Metall'),
  Fe: M('#a3a6ab', 'a grey metal (that rusts red-brown) and an etched iron meteorite', 'um metal cinzento (que enferruja) e um meteorito de ferro gravado com ácido', 'szary metal (który rdzewieje na rudobrązowo) i wytrawiony meteoryt żelazny', 'ein graues Metall (das rotbraun rostet) und ein geätzter Eisenmeteorit'),
  Co: M('#a8b0bd', 'a hard bluish-grey metal', 'um metal duro, cinzento-azulado', 'twardy niebieskawoszary metal', 'ein hartes, bläulich graues Metall'),
  Ni: M('#cfc8b8', 'a silvery metal with a hint of gold', 'um metal prateado com um toque dourado', 'srebrzysty metal ze złotawym odcieniem', 'ein silbriges Metall mit einem Hauch von Gold'),
  Cu: M('#d27d4f', 'a reddish-orange metal', 'um metal laranja-avermelhado', 'czerwonawopomarańczowy metal', 'ein rötlich oranges Metall'),
  Zn: M('#b7bfca', 'a bluish-silver metal', 'um metal prateado-azulado', 'niebieskawosrebrny metal', 'ein bläulich silbernes Metall'),
  Ga: M('#d5dbe2', 'a silvery metal that melts in your hand', 'um metal prateado que derrete na mão', 'srebrzysty metal, który topi się w dłoni', 'ein silbriges Metall, das in der Hand schmilzt'),
  Ge: X('#9aa1a8', 'grey-white shiny crystals', 'cristais brilhantes, branco-acinzentados', 'błyszczące szarobiałe kryształy', 'glänzende grauweiße Kristalle'),
  As: X('#7e8288', 'metallic grey crystals', 'cristais cinzentos com brilho metálico', 'szare kryształy o metalicznym połysku', 'metallisch graue Kristalle'),
  Se: X('#5b5f66', 'grey metallic crystals (red when powdered)', 'cristais cinzentos metálicos (vermelho em pó)', 'szare metaliczne kryształy (czerwone jako proszek)', 'graue, metallische Kristalle (rot als Pulver)'),
  Br: L('#7a1408', 'a dark red-brown liquid that gives off orange fumes', 'um líquido castanho-avermelhado que liberta vapores cor de laranja', 'ciemna czerwonobrązowa ciecz, która wydziela pomarańczowe opary', 'eine dunkle rotbraune Flüssigkeit, die orange Dämpfe abgibt'),
  Kr: T('#e8ddff', 'a colourless gas that glows white-lilac in a lamp', 'um gás incolor que brilha branco-lilás numa lâmpada', 'bezbarwny gaz, który w lampie świeci biało-liliowo', 'ein farbloses Gas, das in einer Lampe weißlich lila leuchtet'),
  Rb: M('#d9d7cf', 'a very soft silvery metal', 'um metal prateado muito mole', 'bardzo miękki srebrzysty metal', 'ein sehr weiches, silbriges Metall'),
  Tc: M('#b9bcc2', 'a silvery-grey metal, radioactive', 'um metal cinzento-prateado, radioativo', 'srebrzystoszary metal, promieniotwórczy', 'ein silbergraues Metall, radioaktiv', { radioactive: true }),
  Ag: M('#e3e6ea', 'the whitest, most shiny metal', 'o metal mais branco e brilhante', 'najbielszy i najbardziej błyszczący metal', 'das weißeste und am stärksten glänzende Metall'),
  Cd: M('#bcc4cf', 'a soft bluish-silver metal', 'um metal mole, prateado-azulado', 'miękki niebieskawosrebrny metal', 'ein weiches, bläulich silbernes Metall'),
  In: M('#cfd2d6', 'a metal so soft you can scratch it with a fingernail', 'um metal tão mole que se risca com a unha', 'metal tak miękki, że można go zarysować paznokciem', 'ein Metall, so weich, dass man es mit dem Fingernagel ritzen kann'),
  Sb: X('#a3a7ad', 'a brittle silvery-grey solid', 'um sólido quebradiço, cinzento-prateado', 'kruche srebrzystoszare ciało stałe', 'ein spröder, silbergrauer Feststoff'),
  Te: X('#b4b8bd', 'a brittle silvery-white solid', 'um sólido quebradiço, branco-prateado', 'kruche srebrzystobiałe ciało stałe', 'ein spröder, silberweißer Feststoff'),
  I: X('#3a2b49', 'shiny violet-black crystals that make violet vapour', 'cristais negro-violeta e brilhantes que libertam vapor violeta', 'błyszczące fioletowoczarne kryształy, z których powstaje fioletowa para', 'glänzende violettschwarze Kristalle, die violetten Dampf bilden', { vapour: '#9b5bd6' }),
  Xe: T('#7ea8ff', 'a colourless gas that glows blue in a lamp', 'um gás incolor que brilha azul numa lâmpada', 'bezbarwny gaz, który w lampie świeci na niebiesko', 'ein farbloses Gas, das in einer Lampe blau leuchtet'),
  Cs: M('#e3c776', 'a pale gold metal that melts at 28 °C', 'um metal dourado-pálido que funde a 28 °C', 'bladozłoty metal, który topi się w 28 °C', 'ein blassgoldenes Metall, das bei 28 °C schmilzt'),
  Eu: M('#c9c3b5', 'a silvery metal that quickly tarnishes', 'um metal prateado que escurece depressa', 'srebrzysty metal, który szybko ciemnieje', 'ein silbriges Metall, das schnell anläuft'),
  Pm: M('#c3c6cc', 'a silvery metal, radioactive', 'um metal prateado, radioativo', 'srebrzysty metal, promieniotwórczy', 'ein silbriges Metall, radioaktiv', { radioactive: true }),
  Ta: M('#9aa4b4', 'a hard grey-blue metal', 'um metal duro, cinzento-azulado', 'twardy szaroniebieski metal', 'ein hartes, graublaues Metall'),
  W: M('#b3b6bb', 'a heavy greyish-white metal (melts at 3422 °C)', 'um metal pesado, branco-acinzentado (funde a 3422 °C)', 'ciężki szarobiały metal (topi się w 3422 °C)', 'ein schweres, grauweißes Metall (schmilzt bei 3422 °C)'),
  Os: M('#a9b8d6', 'a bluish-white metal, the densest element', 'um metal branco-azulado, o elemento mais denso', 'niebieskawobiały metal, pierwiastek o największej gęstości', 'ein bläulich weißes Metall, das dichteste Element'),
  Pt: M('#dfe1e3', 'a heavy silvery-white precious metal', 'um metal precioso, pesado e branco-prateado', 'ciężki srebrzystobiały metal szlachetny', 'ein schweres, silberweißes Edelmetall'),
  Au: M('#f2c040', 'a shiny yellow precious metal', 'um metal precioso amarelo e brilhante', 'błyszczący żółty metal szlachetny', 'ein glänzendes gelbes Edelmetall'),
  Hg: L('#c9ced6', 'a silvery liquid metal', 'um metal líquido e prateado', 'srebrzysty ciekły metal', 'ein silbriges, flüssiges Metall'),
  Tl: M('#a9aeb3', 'a soft grey metal, very poisonous', 'um metal cinzento e mole, muito venenoso', 'miękki szary metal, bardzo trujący', 'ein weiches graues Metall, sehr giftig'),
  Pb: M('#8a8f98', 'a soft, heavy, dull grey metal', 'um metal cinzento-baço, mole e pesado', 'miękki, ciężki, matowoszary metal', 'ein weiches, schweres, mattgraues Metall'),
  Bi: X('#d6b9e3', 'rainbow-coloured stepped crystals', 'cristais em degraus, com cores de arco-íris', 'schodkowe kryształy w kolorach tęczy', 'treppenförmige Kristalle in Regenbogenfarben', { rainbow: true }),
  Po: M('#bfc3c9', 'a silvery metal that glows with radioactivity', 'um metal prateado que brilha com a radioatividade', 'srebrzysty metal, który świeci od promieniotwórczości', 'ein silbriges Metall, das durch seine Radioaktivität leuchtet', { radioactive: true }),
  At: { form: 'unknown', color: '#8a8f99', look: texts('nobody knows: there was never enough to see', 'ninguém sabe: nunca houve o suficiente para se ver', 'nikt nie wie: nigdy nie było go tyle, żeby dało się go zobaczyć', 'niemand weiß es: Es gab nie genug davon, um es zu sehen') },
  Rn: G('#f4f7fb', 'a colourless radioactive gas', 'um gás incolor e radioativo', 'bezbarwny gaz promieniotwórczy', 'ein farbloses, radioaktives Gas', { radioactive: true }),
  Fr: { form: 'unknown', color: '#8a8f99', look: texts('nobody has seen it: it breaks apart in minutes', 'ninguém o viu: desfaz-se em minutos', 'nikt go nie widział: rozpada się w ciągu minut', 'niemand hat es gesehen: Es zerfällt in Minuten') },
  Ra: M('#e2e3df', 'a silvery-white metal, radioactive', 'um metal branco-prateado, radioativo', 'srebrzystobiały metal, promieniotwórczy', 'ein silberweißes Metall, radioaktiv', { radioactive: true }),
  Ac: M('#d3d6dc', 'a silvery metal that glows pale blue in the dark', 'um metal prateado que brilha azul-pálido no escuro', 'srebrzysty metal, który w ciemności świeci bladoniebiesko', 'ein silbriges Metall, das im Dunkeln blassblau leuchtet', { radioactive: true }),
  U: M('#a6a9a6', 'a heavy silvery-grey metal, radioactive', 'um metal pesado, cinzento-prateado, radioativo', 'ciężki srebrzystoszary metal, promieniotwórczy', 'ein schweres, silbergraues Metall, radioaktiv', { radioactive: true }),
  Pu: M('#b8b6ae', 'a silvery metal, warm to the touch from its radioactivity', 'um metal prateado, morno por causa da radioatividade', 'srebrzysty metal, ciepły w dotyku od swojej promieniotwórczości', 'ein silbriges Metall, das sich durch seine Radioaktivität warm anfühlt', { radioactive: true }),
}

/** How an element looks: its entry, or by family and number for the rest. */
export function appearanceOf(el) {
  if (LOOK[el.symbol]) return LOOK[el.symbol]
  if (el.z >= 100) {
    return { form: 'unknown', color: '#8a8f99', look: texts('nobody has seen it: only a few atoms were ever made', 'ninguém o viu: só se fizeram alguns átomos', 'nikt go nie widział: wytworzono tylko kilka atomów', 'niemand hat es gesehen: Es wurden nur ein paar Atome hergestellt') }
  }
  if (el.family === 'actinide' || el.radioactive) {
    return { ...SILVER, radioactive: true, look: texts('a silvery metal, radioactive', 'um metal prateado, radioativo', 'srebrzysty metal, promieniotwórczy', 'ein silbriges Metall, radioaktiv') }
  }
  return SILVER
}
