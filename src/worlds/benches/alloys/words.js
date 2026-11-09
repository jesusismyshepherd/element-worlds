// The Alloy Forge's words, in every language (i18n/langs.js: pt-pt, en, pl, de; a missing one falls back
// to English) and at both depths (kid: Explorer, sci: Scientist): the HUD's labels, the alloys' names, facts
// and recipes, what the crucible and each strike say. Our own words have no em dashes. Numbers: a decimal
// comma in every language but English, no space before % (translating.md).
// Element names in running text: lowercase (German keeps its capitals); Polish needs the genitive after
// "more" and "atoms of" (GEN), German its compounds (Zinnatome: ATOMS), and both their adjectives' genders.
import { element, nameOf } from '../../../data/elements.js'
import { decimalOf } from '../../../i18n/langs.js'
import { ALLOY } from './mix.js'

const name = (el, lang) => (lang === 'de' ? nameOf(element(el), lang) : nameOf(element(el), lang).toLowerCase())
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

/** A number in the language: decimal comma but in English, no grouping under 10000. */
export function num(v, lang, digits = 0) {
  const s = Number(v).toFixed(digits)
  return lang === 'en' ? s : s.replace('.', decimalOf(lang))
}
/** A fraction as a percentage with as many decimals as it needs to be honest (0.99%, 12%, 92.9%). */
export function pct(f, lang) {
  const p = f * 100
  const digits = p < 1 ? 2 : p < 10 || Math.abs(p - Math.round(p)) > 0.05 ? 1 : 0
  return `${num(p, lang, digits).replace(/[.,]0+$/, '')}%`
}

// Polish: the genitive (więcej miedzi, atomy cyny), a pinch counted, and "pure" by gender
const GEN = { Cu: 'miedzi', Sn: 'cyny', Zn: 'cynku', Ni: 'niklu', Fe: 'żelaza', C: 'węgla', Cr: 'chromu', Ag: 'srebra', Au: 'złota', Pb: 'ołowiu' }
const PURE_PL = { Cu: 'czysta miedź', Sn: 'czysta cyna', Zn: 'czysty cynk', Ni: 'czysty nikiel', Fe: 'czyste żelazo', Cr: 'czysty chrom', Ag: 'czyste srebro', Au: 'czyste złoto', Pb: 'czysty ołów' }
const plPlural = (n, one, few, many) => {
  if (n === 1) return one
  const t = n % 10
  const h = n % 100
  return t >= 2 && t <= 4 && !(h >= 12 && h <= 14) ? few : many
}
// German: the atoms of an element as one word
const ATOMS_DE = { Cu: 'Kupferatome', Sn: 'Zinnatome', Zn: 'Zinkatome', Ni: 'Nickelatome', Fe: 'Eisenatome', C: 'Kohlenstoffatome', Cr: 'Chromatome', Ag: 'Silberatome', Au: 'Goldatome', Pb: 'Bleiatome' }

const EN = {
  ui: {
    crucible: 'The crucible', anvil: 'On the anvil', book: 'Alloy book', empty: 'Empty', pour: 'Pour', strike: 'Strike',
    byMass: 'by mass', byAtoms: 'by atoms', inside: 'Inside the metal', slip: 'slip plane', sea: 'electron sea',
    hardness: 'Hardness', melts: 'Melts', fill: 'Fill the crucible', emptyNow: 'empty', together: 'Forging with',
    help: 'Tap an Atomling to throw in its metal (hold it for more) · tap the crucible to pour · tap the hammer to strike',
    lumps: (n, g) => `${n} ${n === 1 ? 'lump' : 'lumps'} · ${g} g`, will: 'will make', mixLine: 'In the crucible',
  },
  alloy: {
    bronze: { name: 'bronze', kid: 'Copper with a little tin: harder than both. It gave its name to the Bronze Age, which began over 5000 years ago.', sci: 'Tin bronze, classically about 88% Cu and 12% Sn. Tin atoms are about 20% bigger than copper atoms and pin the slip planes. The Bronze Age began in the Near East around 3300 BC.' },
    bell: { name: 'bell bronze', kid: 'Lots of tin: very hard, and it rings like a bell. But it is brittle: big bells can crack.', sci: 'Bell metal, about 20 to 25% Sn: hard and brittle, with a long, clear ring. Bells are cast, never hammered into shape.' },
    brass: { name: 'brass', kid: 'Copper and zinc: shiny and gold-coloured. Trumpets, trombones and tubas are made of brass.', sci: 'Brass: Cu with zinc, commonly 30 to 37% (70/30 cartridge brass, 63/37 yellow brass). Zinc atoms are close to copper in size, so brass is ductile and only moderately harder.' },
    cupronickel: { name: 'cupronickel', kid: 'Three parts copper, one part nickel, and it looks silver! Many coins are made of it.', sci: 'Cu with 25% Ni is silver-white although three quarters of it is copper: nickel changes how the metal reflects light. US 5-cent coins have been 75/25 since 1866.' },
    stainless: { name: 'stainless steel', kid: 'Chromium makes an invisible shield on the steel, so it does not rust. Spoons, sinks and saucepans.', sci: 'At least 10.5% Cr: a passive film of chromium oxide a few nanometres thick that heals itself. 304 (18/8) has 18 to 20% Cr and 8 to 10.5% Ni. Harry Brearley, Sheffield, 1913.' },
    steel: { name: 'steel', kid: 'Iron with a pinch of carbon. The tiny carbon atoms squeeze into the gaps and make it far stronger: bridges, nails, swords.', sci: 'Fe with up to 2.14% C by mass. Mild steel under about 0.3% C, tool steels near 1%. Here each carbon atom sits in a gap; in real steel much of it forms tiny iron carbide (Fe3C) crystals, which pin the layers too.' },
    castIron: { name: 'cast iron', kid: 'Too much carbon! Cast iron is hard but brittle: it cracks instead of bending. Great for pans and stoves.', sci: 'Fe with more than 2.14% C (usually 2 to 4%). In grey cast iron the carbon forms flakes of graphite that act like cracks. Near 4.3% C it melts at 1147 °C, about 400 °C below pure iron: easy to cast.' },
    sterling: { name: 'sterling silver', kid: 'Silver with a little copper, so rings and spoons do not bend. Pure silver is too soft.', sci: 'At least 92.5% Ag, the rest usually Cu: about 65 HV against 25 HV for pure silver. Hallmarked 925.' },
    gold18: { name: '18-carat gold', kid: 'Three quarters gold. The rest makes it harder, and changes its colour: copper makes it pink, silver greenish.', sci: '18 carats = 18/24 = 75% Au by mass (hallmark 750). Cu makes it rose, Ag green-yellow, Ni or Pd white. About 140 HV, against 22 HV for pure gold.' },
    solder: { name: 'solder', kid: 'Tin and lead together melt at only 183 °C, lower than either one! It joins wires in electronics.', sci: 'Sn-Pb eutectic: 61.9% Sn melts at 183 °C (Sn 232, Pb 327 °C). Lead is toxic: since 2006 the EU (RoHS) requires lead-free solder in most electronics (SAC305: Sn 96.5, Ag 3, Cu 0.5, about 217 °C).' },
  },
  grade: {
    steel: { mild: 'mild steel', medium: 'medium-carbon steel', high: 'high-carbon steel' },
    stainless: { 304: '18/8 stainless steel (304)', nickel: 'chromium-nickel stainless steel', chromium: 'chromium stainless steel' },
    gold18: { yellow: '18-carat yellow gold', rose: '18-carat rose gold', green: '18-carat green gold', white: '18-carat white gold' },
    solder: { eutectic: 'eutectic solder', plain: 'tin-lead solder' },
  },
  range: {
    bronze: 'Cu + 3 to 20% Sn', bell: 'Cu + 20 to 26% Sn', brass: 'Cu + 10 to 45% Zn', cupronickel: 'Cu + 10 to 30% Ni',
    stainless: 'Fe + at least 10.5% Cr (and Ni), at most 1.2% C', steel: 'Fe + 0.02 to 2.14% C', castIron: 'Fe + 2.14 to about 4.5% C',
    sterling: 'at least 92.5% Ag, the rest Cu', gold18: '75 to 79% Au, the rest Ag, Cu or Ni', solder: 'Sn + Pb, 30 to 70% Sn',
  },
  pure: {
    Cu: { kid: 'Pure copper is soft and bends easily. It carries electricity in nearly every wire.', sci: 'Pure copper (face-centred cubic), about 37 HV: very ductile. Its conductivity is second only to silver.' },
    Sn: { kid: 'Tin is so soft that a bar of it creaks when you bend it: the "tin cry".', sci: 'White tin, about 5 HV. Bending a bar makes the tin cry, the sound of its crystals twinning.' },
    Zn: { kid: 'Zinc coats steel to keep it from rusting: that is called galvanising.', sci: 'Zinc (hexagonal), about 35 HV; brittle at room temperature, workable at 100 to 150 °C. Galvanising protects steel.' },
    Fe: { kid: 'Pure iron is quite soft. A pinch of carbon turns it into steel.', sci: 'Pure iron (body-centred cubic ferrite), about 62 HV. With up to 2.14% carbon it is steel.' },
    Au: { kid: 'Pure gold is so soft that jewellers mix other metals into it.', sci: '24-carat gold, about 22 HV and the most malleable metal: one gram beats into a sheet of about a square metre.' },
    Ag: { kid: 'Pure silver is soft and shines brighter than any other metal.', sci: 'Pure silver, about 25 HV: the best conductor of electricity and heat of all the elements.' },
    Cr: { kid: 'Chromium is hard and very shiny: the bright coat on taps and bikes.', sci: 'Chromium (body-centred cubic), about 108 HV here. It makes steel stainless.' },
    Ni: { kid: 'Nickel is a tough, silvery metal that hardly rusts.', sci: 'Nickel (face-centred cubic), about 65 HV. With chromium it makes stainless steel tough.' },
    Pb: { kid: 'Lead is very soft, very heavy and poisonous: handle it with care.', sci: 'Lead (face-centred cubic), about 5 HV. The Romans piped water in it (plumbum: the plumber\'s word), but it is toxic.' },
  },
  line: {
    start: { kid: 'Tap an Atomling to throw its metal into the crucible.', sci: 'Tap an Atomling to add a lump (100 g; carbon by the 1 g pinch). Alloys are named by mass.' },
    strikeIt: { kid: 'Tap the hammer to strike the ingot.', sci: 'Tap the hammer (or the anvil) to strike, and watch the rows inside.' },
    full: { kid: 'The crucible is full! Pour it, or empty it.', sci: 'Full: 30 lumps (3 kg). Cast it, or empty it.' },
    carbonAlone: { kid: 'Carbon will not melt in a fire. Add a metal for it to mix with.', sci: 'Carbon does not melt at a forge\'s heat (graphite sublimes at about 3640 °C): it must dissolve in a metal, and only iron takes it in.' },
    floating: { kid: 'The carbon floats on top like soot: it only mixes with iron.', sci: 'Carbon hardly dissolves in this melt: it floats on top (foundries cover molten copper with charcoal to keep the air off). Only iron takes carbon in.' },
    unnamed: { kid: 'A mix with no name in the book. Pour it and see!', sci: 'Not an alloy in the book (the bench has no numbers for it).' },
    cracked: { kid: 'It broke in two. Pour a new ingot!', sci: 'Fractured. Cast a new ingot.' },
    nothing: { kid: 'Put some metal in the crucible first.', sci: 'The crucible is empty.' },
    pourMix: { kid: 'Tap the crucible to pour it and see what you made.', sci: 'Tap the crucible to cast the mix.' },
  },
  strike: {
    slipPure: { kid: n => `The rows of atoms slid over each other: ${n} bends! The electron sea holds them together while they slide.`, sci: () => 'Slip: the rows above the plane moved one place. Metallic bonds are not between fixed pairs, so the ions slide and the electron sea still binds them (malleable, ductile). In a real metal, dislocations glide one row at a time.' },
    slipAlloy: { kid: () => 'These rows slid: no odd-sized atoms stood in their way. Strike again!', sci: () => 'This plane had no misfits in it and slipped: a dilute alloy still bends.' },
    jam: { kid: (alloy, el) => `Clonk! The ${atomsOf(el, 'en')} are a different size and jam the rows: ${alloy} is harder.`, sci: (alloy, el, misfit) => `${cap(name(el, 'en'))} atoms (${misfit} in size) pin the slip plane: solid-solution strengthening makes ${alloy} harder.` },
    jamCarbon: { kid: () => 'Clonk! The little carbon atoms stuck in the gaps jam the rows: steel is much stronger than iron.', sci: () => 'Interstitial carbon pins the planes (and in real steel, tiny iron carbide crystals): far harder than pure iron.' },
    bell: { kid: () => 'Dong! Bell bronze rings out: the tin jams its rows so well that it rings instead of bending.', sci: () => 'A long ring: hard, stiff bell bronze gives the blow back as vibration instead of deforming.' },
    crack: { kid: () => 'Crack! Cast iron cannot bend: it broke along a flake of graphite.', sci: () => 'Brittle fracture along a graphite flake: cast iron has almost no ductility.' },
    broken: { kid: () => 'Clink. It is already broken.', sci: () => 'Already fractured.' },
  },
  dents: ['Very soft: a deep dent.', 'Soft: a big dent.', 'Firm: a small dent.', 'Hard: a tiny dent.', 'Very hard: hardly a mark.'],
  hard: (v, s) => `about ${v} ${s} (${s === 'HV' ? 'Vickers' : 'Brinell'})`,
  meltAt: t => `at ${t} °C`,
  meltRange: (a, b) => `from ${a} to ${b} °C`,
  pureName: el => `pure ${name(el, 'en')}`,
  carats: n => `${n}-carat gold`,
  mix: 'a mix with no name',
  near: (alloy, el) => ({ kid: `Almost ${alloy}! Add more ${name(el, 'en')}.`, sci: `Nearly ${alloy}, but outside its range: add ${name(el, 'en')}.` }),
  apart: (a, b) => ({ kid: `${cap(name(a, 'en'))} and ${name(b, 'en')} do not really mix: they cool into separate grains.`, sci: `${cap(name(a, 'en'))} and ${name(b, 'en')} hardly dissolve in each other as solids: two phases.` }),
  pourIt: n => ({ kid: `Tap the crucible to pour your ${n}.`, sci: `Tap the crucible to cast it: ${n}.` }),
  made: n => `You made ${n}!`,
  firstStrike: 'First strike!',
  crackedParty: 'Cast iron cracked!',
  recipe: (parts) => parts.map(([el, n]) => (el === 'C' ? `${n} ${n === 1 ? 'pinch' : 'pinches'} of carbon` : `${n} × ${name(el, 'en')}`)).join(' + '),
}

const PT = {
  ui: {
    crucible: 'O cadinho', anvil: 'Na bigorna', book: 'Livro das ligas', empty: 'Esvaziar', pour: 'Vazar', strike: 'Martelar',
    byMass: 'em massa', byAtoms: 'em átomos', inside: 'Dentro do metal', slip: 'plano de deslizamento', sea: 'mar de eletrões',
    hardness: 'Dureza', melts: 'Funde', fill: 'Encher o cadinho', emptyNow: 'vazio', together: 'A forjar com',
    help: 'Toca num Atomling para atirar o seu metal (segura para mais) · toca no cadinho para vazar · toca no martelo para martelar',
    lumps: (n, g) => `${n} ${n === 1 ? 'pedaço' : 'pedaços'} · ${g} g`, will: 'vai dar', mixLine: 'No cadinho',
  },
  alloy: {
    bronze: { name: 'bronze', kid: 'Cobre com um pouco de estanho: mais duro do que os dois. Deu o nome à Idade do Bronze, que começou há mais de 5000 anos.', sci: 'Bronze de estanho, classicamente cerca de 88% Cu e 12% Sn. Os átomos de estanho são cerca de 20% maiores do que os de cobre e prendem os planos de deslizamento. A Idade do Bronze começou no Próximo Oriente por volta de 3300 a.C.' },
    bell: { name: 'bronze de sinos', kid: 'Muito estanho: muito duro, e toca como um sino. Mas é quebradiço: os sinos grandes podem rachar.', sci: 'Bronze de sinos, cerca de 20 a 25% Sn: duro e quebradiço, com um som longo e limpo. Os sinos são fundidos, nunca moldados a martelo.' },
    brass: { name: 'latão', kid: 'Cobre e zinco: brilhante e cor de ouro. Os trompetes, os trombones e as tubas são feitos de latão.', sci: 'Latão: Cu com zinco, muitas vezes 30 a 37% (latão de cartuchos 70/30, latão amarelo 63/37). Os átomos de zinco têm quase o tamanho dos de cobre, por isso o latão é dúctil e só um pouco mais duro.' },
    cupronickel: { name: 'cuproníquel', kid: 'Três partes de cobre e uma de níquel, e parece prata! Muitas moedas são feitas dele.', sci: 'Cu com 25% Ni é branco-prateado, embora três quartos sejam cobre: o níquel muda a forma como o metal reflete a luz. As moedas de 5 cêntimos dos EUA são 75/25 desde 1866.' },
    stainless: { name: 'aço inoxidável', kid: 'O crómio faz um escudo invisível no aço, e por isso não enferruja. Colheres, lava-loiças e tachos.', sci: 'Pelo menos 10,5% Cr: uma película passiva de óxido de crómio com alguns nanómetros, que se refaz sozinha. O 304 (18/8) tem 18 a 20% Cr e 8 a 10,5% Ni. Harry Brearley, Sheffield, 1913.' },
    steel: { name: 'aço', kid: 'Ferro com uma pitada de carbono. Os átomos pequeninos de carbono metem-se nos buracos e tornam-no muito mais forte: pontes, pregos, espadas.', sci: 'Fe com até 2,14% C em massa. Aço macio com menos de cerca de 0,3% C, aços de ferramentas perto de 1%. Aqui cada átomo de carbono fica num buraco; no aço real, grande parte forma cristais minúsculos de carboneto de ferro (Fe3C), que também prendem as camadas.' },
    castIron: { name: 'ferro fundido', kid: 'Carbono a mais! O ferro fundido é duro mas quebradiço: racha em vez de dobrar. Ótimo para frigideiras e fogões.', sci: 'Fe com mais de 2,14% C (normalmente 2 a 4%). No ferro fundido cinzento o carbono forma lamelas de grafite que funcionam como fendas. Perto de 4,3% C funde a 1147 °C, uns 400 °C abaixo do ferro puro: fácil de fundir em moldes.' },
    sterling: { name: 'prata de lei', kid: 'Prata com um pouco de cobre, para os anéis e as colheres não dobrarem. A prata pura é mole demais.', sci: 'Pelo menos 92,5% Ag, o resto geralmente Cu: cerca de 65 HV, contra 25 HV da prata pura. Marcada 925.' },
    gold18: { name: 'ouro de 18 quilates', kid: 'Três quartos de ouro. O resto torna-o mais duro e muda-lhe a cor: o cobre deixa-o cor-de-rosa, a prata esverdeado.', sci: '18 quilates = 18/24 = 75% Au em massa (contraste 750). O Cu dá ouro rosa, a Ag verde-amarelo, o Ni ou o Pd ouro branco. Cerca de 140 HV, contra 22 HV do ouro puro.' },
    solder: { name: 'solda', kid: 'Estanho e chumbo juntos fundem a só 183 °C, menos do que cada um! Liga os fios na eletrónica.', sci: 'Eutético Sn-Pb: 61,9% Sn funde a 183 °C (Sn 232, Pb 327 °C). O chumbo é tóxico: desde 2006 a UE (RoHS) exige solda sem chumbo na maior parte da eletrónica (SAC305: Sn 96,5, Ag 3, Cu 0,5, cerca de 217 °C).' },
  },
  grade: {
    steel: { mild: 'aço macio', medium: 'aço de médio carbono', high: 'aço de alto carbono' },
    stainless: { 304: 'aço inoxidável 18/8 (304)', nickel: 'aço inoxidável ao crómio-níquel', chromium: 'aço inoxidável ao crómio' },
    gold18: { yellow: 'ouro amarelo de 18 quilates', rose: 'ouro rosa de 18 quilates', green: 'ouro verde de 18 quilates', white: 'ouro branco de 18 quilates' },
    solder: { eutectic: 'solda eutética', plain: 'solda de estanho e chumbo' },
  },
  range: {
    bronze: 'Cu + 3 a 20% Sn', bell: 'Cu + 20 a 26% Sn', brass: 'Cu + 10 a 45% Zn', cupronickel: 'Cu + 10 a 30% Ni',
    stainless: 'Fe + pelo menos 10,5% Cr (e Ni), no máximo 1,2% C', steel: 'Fe + 0,02 a 2,14% C', castIron: 'Fe + 2,14 a cerca de 4,5% C',
    sterling: 'pelo menos 92,5% Ag, o resto Cu', gold18: '75 a 79% Au, o resto Ag, Cu ou Ni', solder: 'Sn + Pb, 30 a 70% Sn',
  },
  pure: {
    Cu: { kid: 'O cobre puro é mole e dobra-se com facilidade. Leva a eletricidade em quase todos os fios.', sci: 'Cobre puro (cúbico de faces centradas), cerca de 37 HV: muito dúctil. Só a prata conduz melhor a eletricidade.' },
    Sn: { kid: 'O estanho é tão mole que uma barra range quando a dobras: o "grito do estanho".', sci: 'Estanho branco, cerca de 5 HV. Dobrar uma barra faz o grito do estanho, o som dos seus cristais a maclar.' },
    Zn: { kid: 'O zinco cobre o aço para não enferrujar: chama-se galvanizar.', sci: 'Zinco (hexagonal), cerca de 35 HV; quebradiço à temperatura ambiente, trabalha-se a 100 a 150 °C. A galvanização protege o aço.' },
    Fe: { kid: 'O ferro puro é bastante mole. Uma pitada de carbono transforma-o em aço.', sci: 'Ferro puro (ferrite, cúbica de corpo centrado), cerca de 62 HV. Com até 2,14% de carbono é aço.' },
    Au: { kid: 'O ouro puro é tão mole que os ourives lhe misturam outros metais.', sci: 'Ouro de 24 quilates, cerca de 22 HV e o metal mais maleável: um grama estica-se numa folha de cerca de um metro quadrado.' },
    Ag: { kid: 'A prata pura é mole e brilha mais do que qualquer outro metal.', sci: 'Prata pura, cerca de 25 HV: o melhor condutor de eletricidade e de calor de todos os elementos.' },
    Cr: { kid: 'O crómio é duro e muito brilhante: a camada reluzente das torneiras e das bicicletas.', sci: 'Crómio (cúbico de corpo centrado), cerca de 108 HV aqui. Torna o aço inoxidável.' },
    Ni: { kid: 'O níquel é um metal prateado e resistente que quase não enferruja.', sci: 'Níquel (cúbico de faces centradas), cerca de 65 HV. Com o crómio torna o aço inoxidável resistente.' },
    Pb: { kid: 'O chumbo é muito mole, muito pesado e venenoso: usa-se com cuidado.', sci: 'Chumbo (cúbico de faces centradas), cerca de 5 HV. Os romanos faziam canos com ele (plumbum, a origem de "plumber"), mas é tóxico.' },
  },
  line: {
    start: { kid: 'Toca num Atomling para atirar o seu metal para o cadinho.', sci: 'Toca num Atomling para juntar um pedaço (100 g; o carbono à pitada de 1 g). As ligas têm nome pela massa.' },
    strikeIt: { kid: 'Toca no martelo para bater no lingote.', sci: 'Toca no martelo (ou na bigorna) para martelar e vê as filas lá dentro.' },
    full: { kid: 'O cadinho está cheio! Vaza-o ou esvazia-o.', sci: 'Cheio: 30 pedaços (3 kg). Vaza-o ou esvazia-o.' },
    carbonAlone: { kid: 'O carbono não funde numa fogueira. Junta um metal para ele se misturar.', sci: 'O carbono não funde ao calor de uma forja (a grafite sublima a cerca de 3640 °C): tem de se dissolver num metal, e só o ferro o aceita.' },
    floating: { kid: 'O carbono fica a boiar por cima, como fuligem: só se mistura com o ferro.', sci: 'O carbono quase não se dissolve neste banho: boia por cima (as fundições cobrem o cobre fundido com carvão para o proteger do ar). Só o ferro aceita carbono.' },
    unnamed: { kid: 'Uma mistura sem nome no livro. Vaza-a e vê!', sci: 'Não é uma liga do livro (a bancada não tem números para ela).' },
    cracked: { kid: 'Partiu-se ao meio. Vaza um lingote novo!', sci: 'Fraturado. Vaza um lingote novo.' },
    nothing: { kid: 'Primeiro põe metal no cadinho.', sci: 'O cadinho está vazio.' },
    pourMix: { kid: 'Toca no cadinho para vazar e ver o que fizeste.', sci: 'Toca no cadinho para vazar a mistura.' },
  },
  strike: {
    slipPure: { kid: n => `As filas de átomos deslizaram umas sobre as outras: ${n} dobra-se! O mar de eletrões mantém-nas unidas enquanto deslizam.`, sci: () => 'Deslizamento: as filas acima do plano andaram um lugar. A ligação metálica não é entre pares fixos, por isso os iões deslizam e o mar de eletrões continua a uni-los (maleável, dúctil). Num metal real, as deslocações avançam uma fila de cada vez.' },
    slipAlloy: { kid: () => 'Estas filas deslizaram: não havia átomos de tamanho diferente no caminho. Bate outra vez!', sci: () => 'Este plano não tinha átomos desajustados e deslizou: uma liga diluída ainda dobra.' },
    jam: { kid: (alloy, el) => `Clonc! ${cap(atomsOf(el, 'pt-pt'))} têm outro tamanho e encravam as filas: por isso esta liga (${alloy}) é mais dura.`, sci: (alloy, el, misfit) => `Os átomos de ${name(el, 'pt-pt')} (${misfit} no tamanho) prendem o plano de deslizamento: o endurecimento por solução sólida torna a liga mais dura (${alloy}).` },
    jamCarbon: { kid: () => 'Clonc! Os átomos pequeninos de carbono presos nos buracos encravam as filas: o aço é muito mais forte do que o ferro.', sci: () => 'O carbono intersticial prende os planos (e no aço real, cristais minúsculos de carboneto de ferro): muito mais duro do que o ferro puro.' },
    bell: { kid: () => 'Dom! O bronze de sinos ressoa: o estanho encrava tão bem as filas que ele toca em vez de dobrar.', sci: () => 'Um som longo: o bronze de sinos, duro e rígido, devolve a pancada em vibração em vez de se deformar.' },
    crack: { kid: () => 'Crac! O ferro fundido não dobra: partiu-se ao longo de uma lamela de grafite.', sci: () => 'Fratura frágil ao longo de uma lamela de grafite: o ferro fundido quase não tem ductilidade.' },
    broken: { kid: () => 'Tlim. Já está partido.', sci: () => 'Já está fraturado.' },
  },
  dents: ['Muito mole: uma mossa funda.', 'Mole: uma mossa grande.', 'Firme: uma mossa pequena.', 'Duro: uma mossa minúscula.', 'Muito duro: quase nem marca.'],
  hard: (v, s) => `cerca de ${v} ${s} (${s === 'HV' ? 'Vickers' : 'Brinell'})`,
  meltAt: t => `a ${t} °C`,
  meltRange: (a, b) => `de ${a} a ${b} °C`,
  pureName: el => (el === 'Ag' ? 'prata pura' : `${name(el, 'pt-pt')} puro`),
  carats: n => `ouro de ${n} quilates`,
  mix: 'uma mistura sem nome',
  near: (alloy, el) => ({ kid: `Quase ${alloy}! Junta mais ${name(el, 'pt-pt')}.`, sci: `Quase ${alloy}, mas fora da sua gama: junta ${name(el, 'pt-pt')}.` }),
  apart: (a, b) => ({ kid: `${cap(articled(a))} e ${articled(b)} não se misturam bem: ao arrefecer separam-se em grãos diferentes.`, sci: `${cap(articled(a))} e ${articled(b)} quase não se dissolvem um no outro no estado sólido: duas fases.` }),
  pourIt: n => ({ kid: `Toca no cadinho para vazar: ${n}.`, sci: `Toca no cadinho para vazar: ${n}.` }),
  made: n => `Fizeste ${n}!`,
  firstStrike: 'Primeira martelada!',
  crackedParty: 'O ferro fundido rachou!',
  recipe: (parts) => parts.map(([el, n]) => (el === 'C' ? `${n} ${n === 1 ? 'pitada' : 'pitadas'} de carbono` : `${n} × ${name(el, 'pt-pt')}`)).join(' + '),
}
// Portuguese element names with their article in running text ("o cobre", "a prata")
const articled = el => `${el === 'Ag' ? 'a' : 'o'} ${name(el, 'pt-pt')}`

const PL = {
  ui: {
    crucible: 'Tygiel', anvil: 'Na kowadle', book: 'Księga stopów', empty: 'Opróżnij', pour: 'Odlej', strike: 'Uderz',
    byMass: 'masowo', byAtoms: 'w atomach', inside: 'Wnętrze metalu', slip: 'płaszczyzna poślizgu', sea: 'morze elektronów',
    hardness: 'Twardość', melts: 'Topi się', fill: 'Napełnij tygiel', emptyNow: 'pusty', together: 'Kujesz z',
    help: 'Dotknij Atomka, żeby wrzucić jego metal (przytrzymaj, by dodać więcej) · dotknij tygla, żeby odlać · dotknij młota, żeby uderzyć',
    lumps: (n, g) => `${n} ${plPlural(n, 'bryłka', 'bryłki', 'bryłek')} · ${g} g`, will: 'da', mixLine: 'W tyglu',
  },
  alloy: {
    bronze: { name: 'brąz', kid: 'Miedź z odrobiną cyny: twardszy niż obie. Dał nazwę epoce brązu, która zaczęła się ponad 5000 lat temu.', sci: 'Brąz cynowy, klasycznie około 88% Cu i 12% Sn. Atomy cyny są o około 20% większe od atomów miedzi i blokują płaszczyzny poślizgu. Epoka brązu zaczęła się na Bliskim Wschodzie około 3300 p.n.e.' },
    bell: { name: 'brąz dzwonowy', kid: 'Dużo cyny: bardzo twardy i dźwięczy jak dzwon. Ale jest kruchy: wielkie dzwony potrafią pęknąć.', sci: 'Spiż dzwonowy, około 20 do 25% Sn: twardy i kruchy, o długim, czystym dźwięku. Dzwony się odlewa, nigdy nie kuje.' },
    brass: { name: 'mosiądz', kid: 'Miedź i cynk: błyszczący i złocisty. Trąbki, puzony i tuby robi się z mosiądzu.', sci: 'Mosiądz: Cu z cynkiem, zwykle 30 do 37% (mosiądz łuskowy 70/30, żółty 63/37). Atomy cynku są prawie tej samej wielkości co atomy miedzi, więc mosiądz jest ciągliwy i tylko trochę twardszy.' },
    cupronickel: { name: 'miedzionikiel', kid: 'Trzy części miedzi, jedna niklu, a wygląda jak srebro! Robi się z niego wiele monet.', sci: 'Cu z 25% Ni jest srebrzystobiały, choć w trzech czwartych to miedź: nikiel zmienia to, jak metal odbija światło. Amerykańskie monety 5-centowe mają skład 75/25 od 1866 roku.' },
    stainless: { name: 'stal nierdzewna', kid: 'Chrom tworzy na stali niewidzialną tarczę, więc stal nie rdzewieje. Łyżki, zlewy i garnki.', sci: 'Co najmniej 10,5% Cr: warstwa pasywna tlenku chromu grubości kilku nanometrów, która sama się odnawia. Stal 304 (18/8) ma 18 do 20% Cr i 8 do 10,5% Ni. Harry Brearley, Sheffield, 1913.' },
    steel: { name: 'stal', kid: 'Żelazo ze szczyptą węgla. Malutkie atomy węgla wciskają się w szczeliny i czynią ją dużo mocniejszą: mosty, gwoździe, miecze.', sci: 'Fe z najwyżej 2,14% C (masowo). Stal niskowęglowa poniżej około 0,3% C, stale narzędziowe blisko 1%. Tu każdy atom węgla siedzi w szczelinie; w prawdziwej stali duża część tworzy maleńkie kryształy węglika żelaza (Fe3C), które też blokują warstwy.' },
    castIron: { name: 'żeliwo', kid: 'Za dużo węgla! Żeliwo jest twarde, ale kruche: pęka, zamiast się zginać. Świetne na patelnie i piecyki.', sci: 'Fe z ponad 2,14% C (zwykle 2 do 4%). W żeliwie szarym węgiel tworzy płatki grafitu, które działają jak pęknięcia. Przy około 4,3% C topi się w 1147 °C, około 400 °C niżej niż czyste żelazo: łatwo je odlewać.' },
    sterling: { name: 'srebro próby 925', kid: 'Srebro z odrobiną miedzi, żeby pierścionki i łyżki się nie wyginały. Czyste srebro jest za miękkie.', sci: 'Co najmniej 92,5% Ag, reszta zwykle Cu: około 65 HV wobec 25 HV czystego srebra. Cecha 925.' },
    gold18: { name: 'złoto 18-karatowe', kid: 'Trzy czwarte złota. Reszta czyni je twardszym i zmienia jego kolor: miedź barwi je na różowo, srebro na zielonkawo.', sci: '18 karatów = 18/24 = 75% Au masowo (próba 750). Cu daje złoto różowe, Ag zielonożółte, Ni lub Pd białe. Około 140 HV wobec 22 HV czystego złota.' },
    solder: { name: 'lut', kid: 'Cyna i ołów razem topią się już w 183 °C, niżej niż każde z nich! Łączy się nim przewody w elektronice.', sci: 'Eutektyk Sn-Pb: 61,9% Sn topi się w 183 °C (Sn 232, Pb 327 °C). Ołów jest toksyczny: od 2006 roku UE (RoHS) wymaga lutu bezołowiowego w większości elektroniki (SAC305: Sn 96,5, Ag 3, Cu 0,5, około 217 °C).' },
  },
  grade: {
    steel: { mild: 'stal niskowęglowa', medium: 'stal średniowęglowa', high: 'stal wysokowęglowa' },
    stainless: { 304: 'stal nierdzewna 18/8 (304)', nickel: 'stal nierdzewna chromowo-niklowa', chromium: 'stal nierdzewna chromowa' },
    gold18: { yellow: 'żółte złoto 18-karatowe', rose: 'różowe złoto 18-karatowe', green: 'zielone złoto 18-karatowe', white: 'białe złoto 18-karatowe' },
    solder: { eutectic: 'lut eutektyczny', plain: 'lut cynowo-ołowiowy' },
  },
  range: {
    bronze: 'Cu + 3 do 20% Sn', bell: 'Cu + 20 do 26% Sn', brass: 'Cu + 10 do 45% Zn', cupronickel: 'Cu + 10 do 30% Ni',
    stainless: 'Fe + co najmniej 10,5% Cr (i Ni), najwyżej 1,2% C', steel: 'Fe + 0,02 do 2,14% C', castIron: 'Fe + 2,14 do około 4,5% C',
    sterling: 'co najmniej 92,5% Ag, reszta Cu', gold18: '75 do 79% Au, reszta Ag, Cu lub Ni', solder: 'Sn + Pb, 30 do 70% Sn',
  },
  pure: {
    Cu: { kid: 'Czysta miedź jest miękka i łatwo się wygina. Płynie nią prąd w prawie każdym przewodzie.', sci: 'Czysta miedź (sieć regularna ściennie centrowana), około 37 HV: bardzo ciągliwa. Lepiej przewodzi prąd tylko srebro.' },
    Sn: { kid: 'Cyna jest tak miękka, że jej pręt trzeszczy, kiedy go zginasz: to „krzyk cyny”.', sci: 'Cyna biała, około 5 HV. Zginany pręt wydaje krzyk cyny, dźwięk bliźniakowania jej kryształów.' },
    Zn: { kid: 'Cynkiem pokrywa się stal, żeby nie rdzewiała: to się nazywa cynkowanie.', sci: 'Cynk (heksagonalny), około 35 HV; kruchy w temperaturze pokojowej, daje się obrabiać w 100 do 150 °C. Cynkowanie chroni stal.' },
    Fe: { kid: 'Czyste żelazo jest dość miękkie. Szczypta węgla zmienia je w stal.', sci: 'Czyste żelazo (ferryt, sieć regularna przestrzennie centrowana), około 62 HV. Z najwyżej 2,14% węgla to stal.' },
    Au: { kid: 'Czyste złoto jest tak miękkie, że złotnicy dodają do niego inne metale.', sci: 'Złoto 24-karatowe, około 22 HV, najbardziej kowalny metal: z jednego grama wyklepie się arkusz około metra kwadratowego.' },
    Ag: { kid: 'Czyste srebro jest miękkie i lśni jaśniej niż każdy inny metal.', sci: 'Czyste srebro, około 25 HV: najlepszy przewodnik prądu i ciepła ze wszystkich pierwiastków.' },
    Cr: { kid: 'Chrom jest twardy i bardzo błyszczący: to lśniąca warstwa na kranach i rowerach.', sci: 'Chrom (sieć regularna przestrzennie centrowana), tu około 108 HV. Czyni stal nierdzewną.' },
    Ni: { kid: 'Nikiel to wytrzymały, srebrzysty metal, który prawie nie rdzewieje.', sci: 'Nikiel (sieć regularna ściennie centrowana), około 65 HV. Z chromem czyni stal nierdzewną wytrzymałą.' },
    Pb: { kid: 'Ołów jest bardzo miękki, bardzo ciężki i trujący: trzeba z nim uważać.', sci: 'Ołów (sieć regularna ściennie centrowana), około 5 HV. Rzymianie robili z niego rury wodociągowe (plumbum, stąd angielskie „plumber”), ale jest toksyczny.' },
  },
  line: {
    start: { kid: 'Dotknij Atomka, żeby wrzucił swój metal do tygla.', sci: 'Dotknij Atomka, żeby dodać bryłkę (100 g; węgiel szczyptami po 1 g). Stopy nazywa się według masy.' },
    strikeIt: { kid: 'Dotknij młota, żeby uderzyć w sztabkę.', sci: 'Dotknij młota (albo kowadła), żeby uderzyć, i patrz na rzędy w środku.' },
    full: { kid: 'Tygiel jest pełny! Odlej go albo opróżnij.', sci: 'Pełny: 30 bryłek (3 kg). Odlej albo opróżnij.' },
    carbonAlone: { kid: 'Węgiel nie stopi się w ogniu. Dodaj metal, z którym się zmiesza.', sci: 'Węgiel nie topi się w żarze kuźni (grafit sublimuje w około 3640 °C): musi się rozpuścić w metalu, a przyjmuje go tylko żelazo.' },
    floating: { kid: 'Węgiel pływa na wierzchu jak sadza: miesza się tylko z żelazem.', sci: 'Węgiel prawie nie rozpuszcza się w tej kąpieli: pływa po wierzchu (odlewnie przykrywają ciekłą miedź węglem drzewnym, żeby odciąć powietrze). Węgiel przyjmuje tylko żelazo.' },
    unnamed: { kid: 'Mieszanina, której nie ma w księdze. Odlej ją i zobacz!', sci: 'To nie jest stop z księgi (stół nie ma dla niego liczb).' },
    cracked: { kid: 'Pękła na pół. Odlej nową sztabkę!', sci: 'Przełom. Odlej nową sztabkę.' },
    nothing: { kid: 'Najpierw włóż metal do tygla.', sci: 'Tygiel jest pusty.' },
    pourMix: { kid: 'Dotknij tygla, żeby odlać i zobaczyć, co wyszło.', sci: 'Dotknij tygla, żeby odlać mieszaninę.' },
  },
  strike: {
    slipPure: { kid: n => `Rzędy atomów przesunęły się po sobie: ${n} się wygina! Morze elektronów trzyma je razem, kiedy się przesuwają.`, sci: () => 'Poślizg: rzędy nad płaszczyzną przesunęły się o jedno miejsce. Wiązanie metaliczne nie łączy stałych par, więc jony się przesuwają, a morze elektronów nadal je wiąże (kowalność, ciągliwość). W prawdziwym metalu dyslokacje przesuwają się po jednym rzędzie.' },
    slipAlloy: { kid: () => 'Te rzędy się przesunęły: nie stały im na drodze atomy innej wielkości. Uderz jeszcze raz!', sci: () => 'W tej płaszczyźnie nie było obcych atomów i nastąpił poślizg: rozcieńczony stop nadal się wygina.' },
    jam: { kid: (alloy, el) => `Klank! Atomy ${GEN[el]} mają inną wielkość i blokują rzędy: ten stop (${alloy}) jest twardszy.`, sci: (alloy, el, misfit) => `Atomy ${GEN[el]} (${misfit} różnicy wielkości) blokują płaszczyznę poślizgu: umocnienie roztworowe czyni stop twardszym (${alloy}).` },
    jamCarbon: { kid: () => 'Klank! Małe atomy węgla wciśnięte w szczeliny blokują rzędy: stal jest dużo mocniejsza niż żelazo.', sci: () => 'Węgiel międzywęzłowy blokuje płaszczyzny (a w prawdziwej stali także maleńkie kryształy węglika żelaza): dużo twardsza niż czyste żelazo.' },
    bell: { kid: () => 'Bim! Brąz dzwonowy dźwięczy: cyna tak dobrze blokuje rzędy, że zamiast się zgiąć, dzwoni.', sci: () => 'Długi dźwięk: twardy, sztywny brąz dzwonowy oddaje uderzenie jako drgania, zamiast się odkształcić.' },
    crack: { kid: () => 'Trzask! Żeliwo nie umie się zgiąć: pękło wzdłuż płatka grafitu.', sci: () => 'Kruchy przełom wzdłuż płatka grafitu: żeliwo prawie nie ma ciągliwości.' },
    broken: { kid: () => 'Brzdęk. Już jest pęknięte.', sci: () => 'Już jest przełamane.' },
  },
  dents: ['Bardzo miękki: głębokie wgniecenie.', 'Miękki: duże wgniecenie.', 'Dość twardy: małe wgniecenie.', 'Twardy: malutkie wgniecenie.', 'Bardzo twardy: prawie bez śladu.'],
  hard: (v, s) => `około ${v} ${s} (${s === 'HV' ? 'Vickers' : 'Brinell'})`,
  meltAt: t => `w ${t} °C`,
  meltRange: (a, b) => `od ${a} do ${b} °C`,
  pureName: el => PURE_PL[el],
  carats: n => `złoto ${n}-karatowe`,
  mix: 'mieszanina bez nazwy',
  near: (alloy, el) => ({ kid: `Prawie ${alloy}! Dodaj więcej ${GEN[el]}.`, sci: `Prawie ${alloy}, ale poza zakresem: dodaj ${GEN[el]}.` }),
  apart: (a, b) => ({ kid: `${cap(name(a, 'pl'))} i ${name(b, 'pl')} prawie się nie mieszają: stygnąc, rozdzielają się na osobne ziarna.`, sci: `${cap(name(a, 'pl'))} i ${name(b, 'pl')} w stanie stałym prawie się w sobie nie rozpuszczają: dwie fazy.` }),
  pourIt: n => ({ kid: `Dotknij tygla, żeby odlać: ${n}.`, sci: `Dotknij tygla, żeby odlać: ${n}.` }),
  made: n => `Udało się: ${n}!`,
  firstStrike: 'Pierwsze uderzenie!',
  crackedParty: 'Żeliwo pękło!',
  recipe: (parts) => parts.map(([el, n]) => (el === 'C' ? `${n} ${plPlural(n, 'szczypta', 'szczypty', 'szczypt')} węgla` : `${n} × ${name(el, 'pl')}`)).join(' + '),
}

const DE = {
  ui: {
    crucible: 'Der Tiegel', anvil: 'Auf dem Amboss', book: 'Buch der Legierungen', empty: 'Leeren', pour: 'Gießen', strike: 'Schlagen',
    byMass: 'nach Masse', byAtoms: 'nach Atomen', inside: 'Im Inneren des Metalls', slip: 'Gleitebene', sea: 'Elektronensee',
    hardness: 'Härte', melts: 'Schmilzt', fill: 'Tiegel füllen', emptyNow: 'leer', together: 'Du schmiedest mit',
    help: 'Tippe einen Atomling an, damit er sein Metall hineinwirft (halten für mehr) · tippe den Tiegel an zum Gießen · tippe den Hammer an zum Schlagen',
    lumps: (n, g) => `${n} Brocken · ${g} g`, will: 'ergibt', mixLine: 'Im Tiegel',
  },
  alloy: {
    bronze: { name: 'Bronze', kid: 'Kupfer mit ein wenig Zinn: härter als beide. Sie gab der Bronzezeit ihren Namen, die vor über 5000 Jahren begann.', sci: 'Zinnbronze, klassisch etwa 88% Cu und 12% Sn. Zinnatome sind etwa 20% größer als Kupferatome und blockieren die Gleitebenen. Die Bronzezeit begann im Vorderen Orient um 3300 v. Chr.' },
    bell: { name: 'Glockenbronze', kid: 'Viel Zinn: sehr hart, und sie klingt wie eine Glocke. Aber sie ist spröde: große Glocken können springen.', sci: 'Glockenbronze, etwa 20 bis 25% Sn: hart und spröde, mit langem, klarem Klang. Glocken werden gegossen, nie geschmiedet.' },
    brass: { name: 'Messing', kid: 'Kupfer und Zink: glänzend und goldfarben. Trompeten, Posaunen und Tuben sind aus Messing.', sci: 'Messing: Cu mit Zink, meist 30 bis 37% (Patronenmessing 70/30, Gelbmessing 63/37). Zinkatome sind fast so groß wie Kupferatome, darum ist Messing duktil und nur mäßig härter.' },
    cupronickel: { name: 'Kupfernickel', kid: 'Drei Teile Kupfer, ein Teil Nickel, und es sieht aus wie Silber! Viele Münzen sind daraus.', sci: 'Cu mit 25% Ni ist silberweiß, obwohl es zu drei Vierteln Kupfer ist: Nickel ändert, wie das Metall Licht zurückwirft. Die 5-Cent-Münzen der USA sind seit 1866 aus 75/25.' },
    stainless: { name: 'Edelstahl', kid: 'Chrom macht einen unsichtbaren Schild auf dem Stahl, darum rostet er nicht. Löffel, Spülen und Töpfe.', sci: 'Mindestens 10,5% Cr: eine Passivschicht aus Chromoxid, wenige Nanometer dick, die sich selbst erneuert. 304 (18/8) hat 18 bis 20% Cr und 8 bis 10,5% Ni. Harry Brearley, Sheffield, 1913.' },
    steel: { name: 'Stahl', kid: 'Eisen mit einer Prise Kohlenstoff. Die winzigen Kohlenstoffatome zwängen sich in die Lücken und machen ihn viel fester: Brücken, Nägel, Schwerter.', sci: 'Fe mit bis zu 2,14% C (nach Masse). Baustahl unter etwa 0,3% C, Werkzeugstähle um 1%. Hier sitzt jedes Kohlenstoffatom in einer Lücke; in echtem Stahl bildet ein großer Teil winzige Eisenkarbid-Kristalle (Fe3C), die die Lagen ebenfalls festhalten.' },
    castIron: { name: 'Gusseisen', kid: 'Zu viel Kohlenstoff! Gusseisen ist hart, aber spröde: es bricht, statt sich zu biegen. Toll für Pfannen und Öfen.', sci: 'Fe mit mehr als 2,14% C (meist 2 bis 4%). Im Grauguss bildet der Kohlenstoff Graphitlamellen, die wie Risse wirken. Bei etwa 4,3% C schmilzt es bei 1147 °C, rund 400 °C unter reinem Eisen: leicht zu gießen.' },
    sterling: { name: 'Sterlingsilber', kid: 'Silber mit ein wenig Kupfer, damit sich Ringe und Löffel nicht verbiegen. Reines Silber ist zu weich.', sci: 'Mindestens 92,5% Ag, der Rest meist Cu: etwa 65 HV gegen 25 HV bei reinem Silber. Gestempelt 925.' },
    gold18: { name: '18-karätiges Gold', kid: 'Drei Viertel Gold. Der Rest macht es härter und ändert seine Farbe: Kupfer macht es rosa, Silber grünlich.', sci: '18 Karat = 18/24 = 75% Au nach Masse (Stempel 750). Cu ergibt Rotgold, Ag Grüngold, Ni oder Pd Weißgold. Etwa 140 HV gegen 22 HV bei reinem Gold.' },
    solder: { name: 'Lötzinn', kid: 'Zinn und Blei zusammen schmelzen schon bei 183 °C, tiefer als jedes allein! Damit lötet man Drähte in der Elektronik.', sci: 'Sn-Pb-Eutektikum: 61,9% Sn schmilzt bei 183 °C (Sn 232, Pb 327 °C). Blei ist giftig: Seit 2006 verlangt die EU (RoHS) in der meisten Elektronik bleifreies Lot (SAC305: Sn 96,5, Ag 3, Cu 0,5, etwa 217 °C).' },
  },
  grade: {
    steel: { mild: 'kohlenstoffarmer Stahl', medium: 'Stahl mit mittlerem Kohlenstoffgehalt', high: 'kohlenstoffreicher Stahl' },
    stainless: { 304: 'Edelstahl 18/8 (304)', nickel: 'Chrom-Nickel-Edelstahl', chromium: 'rostfreier Chromstahl' },
    gold18: { yellow: '18-karätiges Gelbgold', rose: '18-karätiges Rotgold', green: '18-karätiges Grüngold', white: '18-karätiges Weißgold' },
    solder: { eutectic: 'eutektisches Lötzinn', plain: 'Zinn-Blei-Lot' },
  },
  range: {
    bronze: 'Cu + 3 bis 20% Sn', bell: 'Cu + 20 bis 26% Sn', brass: 'Cu + 10 bis 45% Zn', cupronickel: 'Cu + 10 bis 30% Ni',
    stainless: 'Fe + mindestens 10,5% Cr (und Ni), höchstens 1,2% C', steel: 'Fe + 0,02 bis 2,14% C', castIron: 'Fe + 2,14 bis etwa 4,5% C',
    sterling: 'mindestens 92,5% Ag, der Rest Cu', gold18: '75 bis 79% Au, der Rest Ag, Cu oder Ni', solder: 'Sn + Pb, 30 bis 70% Sn',
  },
  pure: {
    Cu: { kid: 'Reines Kupfer ist weich und lässt sich leicht biegen. Es leitet den Strom in fast jedem Kabel.', sci: 'Reines Kupfer (kubisch flächenzentriert), etwa 37 HV: sehr duktil. Nur Silber leitet Strom besser.' },
    Sn: { kid: 'Zinn ist so weich, dass ein Stab knirscht, wenn du ihn biegst: das „Zinngeschrei“.', sci: 'Weißes Zinn, etwa 5 HV. Ein gebogener Stab macht das Zinngeschrei, das Geräusch seiner Kristalle beim Verzwillingen.' },
    Zn: { kid: 'Zink überzieht Stahl, damit er nicht rostet: das heißt Verzinken.', sci: 'Zink (hexagonal), etwa 35 HV; bei Raumtemperatur spröde, bei 100 bis 150 °C gut formbar. Verzinken schützt Stahl.' },
    Fe: { kid: 'Reines Eisen ist ziemlich weich. Eine Prise Kohlenstoff macht daraus Stahl.', sci: 'Reines Eisen (Ferrit, kubisch raumzentriert), etwa 62 HV. Mit bis zu 2,14% Kohlenstoff ist es Stahl.' },
    Au: { kid: 'Reines Gold ist so weich, dass Goldschmiede andere Metalle hineinmischen.', sci: '24-karätiges Gold, etwa 22 HV und das dehnbarste Metall: Ein Gramm lässt sich zu einer Folie von etwa einem Quadratmeter schlagen.' },
    Ag: { kid: 'Reines Silber ist weich und glänzt heller als jedes andere Metall.', sci: 'Reines Silber, etwa 25 HV: der beste Leiter für Strom und Wärme unter allen Elementen.' },
    Cr: { kid: 'Chrom ist hart und glänzt stark: die blanke Schicht auf Wasserhähnen und Fahrrädern.', sci: 'Chrom (kubisch raumzentriert), hier etwa 108 HV. Es macht Stahl rostfrei.' },
    Ni: { kid: 'Nickel ist ein zähes, silbriges Metall, das kaum rostet.', sci: 'Nickel (kubisch flächenzentriert), etwa 65 HV. Mit Chrom macht es Edelstahl zäh.' },
    Pb: { kid: 'Blei ist sehr weich, sehr schwer und giftig: Vorsicht damit.', sci: 'Blei (kubisch flächenzentriert), etwa 5 HV. Die Römer leiteten Wasser durch Bleirohre (plumbum, daher das englische „plumber“), doch es ist giftig.' },
  },
  line: {
    start: { kid: 'Tippe einen Atomling an, damit er sein Metall in den Tiegel wirft.', sci: 'Tippe einen Atomling an, um einen Brocken dazuzugeben (100 g; Kohlenstoff prisenweise zu 1 g). Legierungen werden nach Masse benannt.' },
    strikeIt: { kid: 'Tippe den Hammer an, um auf den Barren zu schlagen.', sci: 'Tippe den Hammer (oder den Amboss) an, um zu schlagen, und sieh dir die Reihen im Inneren an.' },
    full: { kid: 'Der Tiegel ist voll! Gieß ihn aus oder leere ihn.', sci: 'Voll: 30 Brocken (3 kg). Gießen oder leeren.' },
    carbonAlone: { kid: 'Kohlenstoff schmilzt im Feuer nicht. Gib ein Metall dazu, mit dem er sich mischen kann.', sci: 'Kohlenstoff schmilzt bei der Hitze einer Schmiede nicht (Graphit sublimiert bei etwa 3640 °C): Er muss sich in einem Metall lösen, und nur Eisen nimmt ihn auf.' },
    floating: { kid: 'Der Kohlenstoff schwimmt oben wie Ruß: Er mischt sich nur mit Eisen.', sci: 'Kohlenstoff löst sich in dieser Schmelze kaum: Er schwimmt oben (Gießereien decken flüssiges Kupfer mit Holzkohle ab, um die Luft fernzuhalten). Nur Eisen nimmt Kohlenstoff auf.' },
    unnamed: { kid: 'Eine Mischung ohne Namen im Buch. Gieß sie und schau!', sci: 'Keine Legierung aus dem Buch (der Tisch hat keine Zahlen dafür).' },
    cracked: { kid: 'Er ist in zwei Teile gebrochen. Gieß einen neuen Barren!', sci: 'Gebrochen. Gieß einen neuen Barren.' },
    nothing: { kid: 'Leg zuerst etwas Metall in den Tiegel.', sci: 'Der Tiegel ist leer.' },
    pourMix: { kid: 'Tippe den Tiegel an, um zu gießen und zu sehen, was du gemacht hast.', sci: 'Tippe den Tiegel an, um die Mischung zu gießen.' },
  },
  strike: {
    slipPure: { kid: n => `Die Atomreihen sind übereinander geglitten: ${n} biegt sich! Der Elektronensee hält sie zusammen, während sie gleiten.`, sci: () => 'Gleiten: Die Reihen über der Ebene sind um einen Platz gerückt. Die Metallbindung verbindet keine festen Paare, darum gleiten die Ionen, und der Elektronensee hält sie weiter zusammen (verformbar, duktil). In echtem Metall wandern Versetzungen Reihe für Reihe.' },
    slipAlloy: { kid: () => 'Diese Reihen sind geglitten: Keine Atome anderer Größe standen im Weg. Schlag noch einmal!', sci: () => 'In dieser Ebene saßen keine Fremdatome, sie ist geglitten: Eine verdünnte Legierung biegt sich noch.' },
    jam: { kid: (alloy, el) => `Klonk! Die ${ATOMS_DE[el]} sind anders groß und verklemmen die Reihen: ${alloy} ist härter.`, sci: (alloy, el, misfit) => `${ATOMS_DE[el]} (${misfit} Größenunterschied) blockieren die Gleitebene: Mischkristallverfestigung macht ${alloy} härter.` },
    jamCarbon: { kid: () => 'Klonk! Die kleinen Kohlenstoffatome in den Lücken verklemmen die Reihen: Stahl ist viel fester als Eisen.', sci: () => 'Eingelagerter Kohlenstoff blockiert die Ebenen (in echtem Stahl auch winzige Eisenkarbid-Kristalle): viel härter als reines Eisen.' },
    bell: { kid: () => 'Dong! Die Glockenbronze klingt: Das Zinn verklemmt ihre Reihen so gut, dass sie klingt, statt sich zu biegen.', sci: () => 'Ein langer Klang: Harte, steife Glockenbronze gibt den Schlag als Schwingung zurück, statt sich zu verformen.' },
    crack: { kid: () => 'Krach! Gusseisen kann sich nicht biegen: Es ist an einer Graphitlamelle gebrochen.', sci: () => 'Sprödbruch entlang einer Graphitlamelle: Gusseisen hat fast keine Duktilität.' },
    broken: { kid: () => 'Klirr. Er ist schon gebrochen.', sci: () => 'Schon gebrochen.' },
  },
  dents: ['Sehr weich: eine tiefe Delle.', 'Weich: eine große Delle.', 'Fest: eine kleine Delle.', 'Hart: eine winzige Delle.', 'Sehr hart: kaum ein Kratzer.'],
  hard: (v, s) => `etwa ${v} ${s} (${s === 'HV' ? 'Vickers' : 'Brinell'})`,
  meltAt: t => `bei ${t} °C`,
  meltRange: (a, b) => `von ${a} bis ${b} °C`,
  pureName: el => `reines ${name(el, 'de')}`,
  carats: n => `${n}-karätiges Gold`,
  mix: 'eine Mischung ohne Namen',
  near: (alloy, el) => ({ kid: `Fast ${alloy}! Gib mehr ${name(el, 'de')} dazu.`, sci: `Fast ${alloy}, aber außerhalb des Bereichs: gib ${name(el, 'de')} dazu.` }),
  apart: (a, b) => ({ kid: `${name(a, 'de')} und ${name(b, 'de')} mischen sich kaum: Beim Abkühlen trennen sie sich in eigene Körner.`, sci: `${name(a, 'de')} und ${name(b, 'de')} lösen sich im festen Zustand kaum ineinander: zwei Phasen.` }),
  pourIt: n => ({ kid: `Tippe den Tiegel an, um zu gießen: ${n}.`, sci: `Tippe den Tiegel an, um zu gießen: ${n}.` }),
  made: n => `Geschafft: ${n}!`,
  firstStrike: 'Der erste Schlag!',
  crackedParty: 'Das Gusseisen ist gebrochen!',
  recipe: (parts) => parts.map(([el, n]) => (el === 'C' ? `${n} ${n === 1 ? 'Prise' : 'Prisen'} Kohlenstoff` : `${n} × ${name(el, 'de')}`)).join(' + '),
}

export const WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
export const words = lang => WORDS[lang] ?? EN
const depth = level => (level === 'scientist' ? 'sci' : 'kid')

/** "the tin atoms" (en), "os átomos de estanho" (pt-pt) for an element. */
function atomsOf(el, lang) {
  if (lang === 'pt-pt') return `os átomos de ${name(el, lang)}`
  if (lang === 'pl') return `atomy ${GEN[el]}`
  if (lang === 'de') return `die ${ATOMS_DE[el]}`
  return `${name(el, 'en')} atoms`
}

/** What a mix (mix.js identify) is called: an alloy's name (its grade's for the Scientist), "pure copper",
 *  "22-carat gold", or "a mix with no name". */
export function nameOfMix(info, lang, level) {
  const W = words(lang)
  if (!info || info.kind === 'empty') return W.ui.emptyNow
  if (info.kind === 'carbon') return name('C', lang)
  if (info.kind === 'pure') return W.pureName(info.el)
  if (info.kind === 'gold') return W.carats(info.carats)
  if (info.kind === 'alloy') {
    const g = info.grade && W.grade[info.id]?.[info.grade]
    return level === 'scientist' && g ? g : W.alloy[info.id].name
  }
  return W.mix
}
/** The same with its first letter capital (a title). */
export const titleOfMix = (info, lang, level) => cap(nameOfMix(info, lang, level))

/** The fact about what the ingot is. */
export function factOf(info, lang, level) {
  const W = words(lang)
  const d = depth(level)
  if (info?.kind === 'alloy') return W.alloy[info.id][d]
  if (info?.kind === 'pure') return W.pure[info.el]?.[d] ?? ''
  if (info?.kind === 'gold') return W.alloy.gold18[d]
  if (info?.kind === 'mix') return W.line.unnamed[d]
  return ''
}

/** The book's hint for an alloy: its recipe in lumps (Explorer) or its range by mass (Scientist). */
export function recipeText(id, lang, level) {
  const W = words(lang)
  if (level === 'scientist') return `${W.range[id]} (${W.ui.byMass})`
  return W.recipe(Object.entries(ALLOY[id].recipe))
}

/** The hardness line ({ v, s }: a number and its scale, HV or HB): words and a dent (Explorer), the number
 *  and its scale (Scientist); null for no number. */
export function hardnessText(hard, lang, level) {
  if (!hard) return null
  const W = words(lang)
  if (level === 'scientist') return W.hard(hard.v, hard.s)
  const v = hard.v
  const k = v < 12 ? 0 : v < 45 ? 1 : v < 100 ? 2 : v < 200 ? 3 : 4
  return W.dents[k]
}

/** The melting line for the Scientist: "at 1085 °C", "from 850 to 1000 °C". */
export function meltText(melt, lang) {
  if (!melt) return null
  const W = words(lang)
  return melt[0] === melt[1] ? W.meltAt(melt[0]) : W.meltRange(melt[0], melt[1])
}

/** What the crucible's card says under the bar: the next step, or why not. */
export function crucibleLine(info, { full, lang, level }) {
  const W = words(lang)
  const d = depth(level)
  if (full) return W.line.full[d]
  if (!info || info.kind === 'empty') return W.line.start[d]
  if (info.kind === 'carbon') return W.line.carbonAlone[d]
  const parts = []
  if (info.floating) parts.push(W.line.floating[d])
  if (info.kind === 'mix' && info.near) parts.push(W.near(W.alloy[info.near.id].name, info.near.more)[d])
  else if (info.kind === 'mix' && info.apart?.length) parts.push(W.apart(...info.apart[0])[d])
  if (info.kind === 'alloy' || info.kind === 'gold' || info.kind === 'pure') parts.push(W.pourIt(nameOfMix(info, lang, level))[d])
  else parts.push(W.line.pourMix[d])
  return parts.join(' ')
}

/** What a strike did, in words: { kind, plane, dir, by (the element that pinned it), misfit }. */
export function strikeText(s, ingot, lang, level) {
  if (!s) return null
  const W = words(lang)
  const d = depth(level)
  const alloyName = nameOfMix(ingot, lang, 'explorer')
  if (s.kind === 'broken') return W.strike.broken[d]()
  if (s.kind === 'crack') return W.strike.crack[d]()
  if (s.kind === 'slip') return ingot?.kind === 'pure' ? W.strike.slipPure[d](nameOfMix(ingot, lang, 'explorer')) : W.strike.slipAlloy[d]()
  if (ingot?.kind === 'alloy' && ingot.id === 'bell') return W.strike.bell[d]()
  if (s.by === 'C') return W.strike.jamCarbon[d]()
  if (s.by) return W.strike.jam[d](alloyName, s.by, s.misfit ?? '')
  return W.strike.slipAlloy[d]()
}

/** Every table, for the tests. */
export const TABLES = { WORDS }
