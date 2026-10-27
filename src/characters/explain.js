// An Atomling read aloud: each feature and what it says about the element (the Atomlings page's
// card). Pure: traits in, sentences out, in both languages.
import { ELEMENTS, nameOf } from '../data/elements.js'
import { traitsOf } from './traits.js'
import { HELMET, SIGNATURE, TAKES_HEAD } from './look.js'

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
/** What each signature (look.js SIGNATURE) says about its element: [English, European Portuguese]. */
export const SIG = {
  drop: ['The water drop: two hydrogens and an oxygen make water.', 'A gota de água: dois hidrogénios e um oxigénio fazem água.'],
  balloon: ['The balloon: helium is lighter than air, so it lifts party balloons.', 'O balão: o hélio é mais leve do que o ar, por isso faz subir os balões.'],
  battery: ['The battery: lithium-ion batteries power phones and electric cars.', 'A pilha: as baterias de iões de lítio alimentam telemóveis e carros elétricos.'],
  salt: ['The salt shaker: table salt is sodium chloride.', 'O saleiro: o sal de cozinha é cloreto de sódio.'],
  leaf: ['The leaf: every chlorophyll molecule, the green of leaves, has a magnesium atom at its heart.', 'A folha: cada molécula de clorofila, o verde das folhas, tem um átomo de magnésio no centro.'],
  match: ["The match: matches light thanks to phosphorus, on the box's striking strip.", 'O fósforo de acender: acende graças ao fósforo da lixa da caixa.'],
  banana: ['The banana: bananas are rich in potassium.', 'A banana: as bananas são ricas em potássio.'],
  bone: ['The bone: our bones and teeth are made with calcium.', 'O osso: os nossos ossos e dentes são feitos com cálcio.'],
  chip: ['The chip: computer chips are made of silicon.', 'O chip: os chips dos computadores são feitos de silício.'],
  magnet: ['The magnet and the nail: iron is magnetic.', 'O íman e o prego: o ferro é magnético.'],
  coil: ['The coil: copper wires carry electricity.', 'A bobina: os fios de cobre levam a eletricidade.'],
  bulb: ['The bulb: old light bulbs glowed with a tungsten filament, the metal with the highest melting point.', 'A lâmpada: as lâmpadas antigas brilhavam com um filamento de tungsténio, o metal com o ponto de fusão mais alto.'],
  crown: ['The crown: gold has been the metal of kings and treasures for thousands of years.', 'A coroa: o ouro é o metal dos reis e dos tesouros há milhares de anos.'],
  mirror: ["The golden hexagons: the James Webb Space Telescope's 18 mirrors are beryllium, light and stiff, covered in gold.", 'Os hexágonos dourados: os 18 espelhos do Telescópio Espacial James Webb são de berílio, leve e rígido, coberto de ouro.'],
  slime: ['The slime: borax, a boron compound, turns glue into slime.', 'O slime: o bórax, um composto de boro, transforma a cola em slime.'],
  pencil: ["The pencil: a pencil's 'lead' is graphite, carbon just like diamond.", 'O lápis: a mina do lápis é grafite, carbono tal como o diamante.'],
  crisps: ['The bag of crisps: it is puffed up with nitrogen, which keeps the crisps fresh and stops them breaking.', 'O pacote de batatas fritas: vem cheio de azoto, que mantém as batatas frescas e não as deixa partir.'],
  fishbowl: ['The fishbowl: fish breathe the oxygen dissolved in the water.', 'O aquário: os peixes respiram o oxigénio dissolvido na água.'],
  toothbrush: ['The toothbrush: fluoride in toothpaste makes teeth stronger.', 'A escova de dentes: o flúor da pasta de dentes torna os dentes mais fortes.'],
  neonsign: ['The glowing sign: neon glows red-orange inside a glass tube, the light of neon signs.', 'O letreiro luminoso: o néon brilha vermelho-alaranjado dentro de um tubo de vidro, a luz dos letreiros de néon.'],
  can: ['The can: drink cans are aluminium, light and easy to recycle.', 'A lata: as latas de bebidas são de alumínio, leve e fácil de reciclar.'],
  egg: ['The rotten egg: its stink is hydrogen sulfide, a sulfur compound.', 'O ovo podre: o mau cheiro é sulfureto de hidrogénio, um composto de enxofre.'],
  swimring: ['The swim ring: swimming pools are kept clean with chlorine.', 'A boia: as piscinas mantêm-se limpas com cloro.'],
  pillow: ["The pillow: argon's name means 'lazy' in Greek, because it hardly ever reacts.", "A almofada: árgon quer dizer 'preguiçoso' em grego, porque quase nunca reage."],
  plane: ['The plane: titanium is strong and light, so jet engines and planes are built with it.', 'O avião: o titânio é forte e leve, por isso faz parte de motores a jato e de aviões.'],
  spanner: ["The spanner: strong tools are made of chrome-vanadium steel (look for 'Cr-V' on one).", "A chave de bocas: as ferramentas fortes são de aço de crómio-vanádio (procura 'Cr-V' numa)."],
  ruby: ["The ruby: a pinch of chromium makes rubies red; chromium's name means 'colour'.", "O rubi: uma pitada de crómio torna os rubis vermelhos; crómio quer dizer 'cor'."],
  brush: ['The paintbrush: cobalt makes the deep blue of paints, glass and porcelain.', 'O pincel: o cobalto dá o azul forte das tintas, do vidro e da porcelana.'],
  coin: ['The coin: the 1 and 2 euro coins have nickel in them.', 'A moeda: as moedas de 1 e 2 euros têm níquel.'],
  sunscreen: ["The sun cream: zinc oxide in it blocks the sun's rays.", 'O protetor solar: o óxido de zinco que tem bloqueia os raios do sol.'],
  melt: ['The melting spoon: gallium melts at about 30 °C, so a gallium spoon droops in a cup of warm tea (and melts in your hand).', 'A colher a derreter: o gálio funde a cerca de 30 °C, por isso uma colher de gálio derrete numa chávena de chá quente (e na tua mão).'],
  'flag-de': ["The flag: germanium is named after Germany, the homeland of Clemens Winkler, who found it.", 'A bandeira: o germânio tem o nome da Alemanha, a terra de Clemens Winkler, que o descobriu.'],
  moon: ['The Moon: selenium is named after Selene, the Moon (its neighbour tellurium is named after the Earth).', 'A Lua: o selénio tem o nome de Selene, a Lua (o vizinho telúrio tem o nome da Terra).'],
  earth: ['The Earth: tellurium is named after Tellus, the Earth.', 'A Terra: o telúrio tem o nome de Tellus, a Terra.'],
  magnifier: ["The magnifying glass: krypton means 'the hidden one': it hid in the air until 1898.", "A lupa: crípton quer dizer 'o escondido': esteve escondido no ar até 1898."],
  glowstar: ['The glow-in-the-dark star: it glows thanks to strontium aluminate.', 'A estrela que brilha no escuro: brilha graças ao aluminato de estrôncio.'],
  firework: ['The green firework: barium gives fireworks their green.', 'O fogo de artifício verde: o bário dá o verde ao fogo de artifício.'],
  rose: ["The rose: rhodium's name means 'rose', for the colour of its salts.", "A rosa: ródio quer dizer 'rosa', pela cor dos seus sais."],
  car: ['The car: the palladium in catalytic converters cleans the fumes of cars.', 'O carro: o paládio dos catalisadores limpa os fumos dos carros.'],
  medal: ['The medal: Olympic silver medals are made of silver (and gold medals are silver covered in gold).', 'A medalha: as medalhas de prata olímpicas são de prata (e as de ouro são de prata coberta de ouro).'],
  phone: ['The phone: touchscreens have a see-through layer of indium tin oxide that feels your finger.', 'O telemóvel: os ecrãs táteis têm uma camada transparente de óxido de índio e estanho que sente o teu dedo.'],
  soldier: ['The toy soldier: tin melts easily (232 °C), so toy soldiers were cast from it.', 'O soldadinho: o estanho funde com facilidade (232 °C), por isso faziam-se soldadinhos de brinquedo de estanho (e de chumbo).'],
  flask: ["The flask: warm iodine turns into a violet vapour; its name means 'violet'.", "O frasco: o iodo aquecido liberta um vapor violeta; o nome quer dizer 'violeta'."],
  probe: ['The space probe: xenon ion engines push probes like Dawn through space, glowing blue.', 'A sonda espacial: os motores iónicos de xénon empurram sondas como a Dawn pelo espaço, com um brilho azul.'],
  clock: ['The clock: the second is defined by caesium atoms, in atomic clocks.', 'O relógio: o segundo é definido pelos átomos de césio, nos relógios atómicos.'],
  dumbbell: ['The dumbbell: osmium is the densest element: a litre of it weighs 22.6 kg.', 'O haltere: o ósmio é o elemento mais denso: um litro pesa 22,6 kg.'],
  asteroid: ['The asteroid: a layer of iridium all over the Earth shows the asteroid that ended the dinosaurs, 66 million years ago.', 'O asteroide: uma camada de irídio em toda a Terra mostra o asteroide que acabou com os dinossauros, há 66 milhões de anos.'],
  ring: ['The ring: platinum is a precious white metal for rings and jewels.', 'O anel: a platina é um metal precioso e branco para anéis e joias.'],
  thermometer: ['The thermometer: old thermometers held mercury, the metal that is liquid at room temperature.', 'O termómetro: os termómetros antigos tinham mercúrio, o metal que é líquido à temperatura ambiente.'],
  fishing: ["The fishing weight: sinkers are lead, soft and heavy (in Portuguese a sinker is a 'chumbada', from chumbo, lead).", 'A chumbada: os pesos de pesca são de chumbo, mole e pesado (daí o nome).'],
  crystal: ['The rainbow crystal: bismuth grows crystals shaped like little staircases, with a rainbow skin.', 'O cristal arco-íris: o bismuto forma cristais em forma de escadinhas, com uma pele de arco-íris.'],
  'flag-pl': ['The flag: Marie Curie named polonium after Poland, her homeland.', 'A bandeira: Marie Curie deu ao polónio o nome da Polónia, a sua terra.'],
  warning: ['The warning sign: radon is a radioactive gas that seeps from the ground into cellars, so houses are tested for it.', 'O sinal de aviso: o rádon é um gás radioativo que sai do chão e se junta nas caves, por isso as casas são testadas.'],
  'flag-fr': ['The flag: francium is named after France, where Marguerite Perey found it in 1939.', 'A bandeira: o frâncio tem o nome da França, onde Marguerite Perey o descobriu em 1939.'],
  watch: ['The watch: radium once made watch numbers glow in the dark, until people learnt it was harmful.', 'O relógio de pulso: o rádio fazia brilhar os números dos relógios no escuro, até se perceber que fazia mal.'],
  'flag-jp': ['The flag: nihonium is named after Japan (Nihon), the first element found in Asia.', 'A bandeira: o nihónio tem o nome do Japão (Nihon), o primeiro elemento descoberto na Ásia.'],
  camera: ['The camera: good camera lenses are made of lanthanum glass, which bends light strongly.', 'A máquina fotográfica: as boas lentes são de vidro de lantânio, que desvia muito a luz.'],
  sparks: ["The sparks: a lighter's 'flint' is cerium and iron, which spark when scratched.", "As faíscas: a 'pedra' dos isqueiros é cério e ferro, que fazem faíscas quando raspados."],
  headphones: ['The headphones: their tiny, strong magnets are made with neodymium.', 'Os auscultadores: os ímanes pequenos e fortes deles são feitos com neodímio.'],
  torch: ['The torch: promethium is named after Prometheus, who stole fire from the gods (a Greek myth).', 'A tocha: o promécio tem o nome de Prometeu, que roubou o fogo aos deuses (um mito grego).'],
  banknote: ['The banknote: euro notes hide marks that glow under ultraviolet light, to catch fakes, and europium makes the red glow.', 'A nota: as notas de euro escondem marcas que brilham com luz ultravioleta, para apanhar as falsas, e o európio faz o brilho vermelho.'],
  hammer: ['The hammer: thorium is named after Thor, the Norse god of thunder.', 'O martelo: o tório tem o nome de Thor, o deus nórdico do trovão.'],
  uranus: ['The planet Uranus: uranium is named after it, found eight years before; today uranium fuels nuclear power stations.', 'O planeta Úrano: o urânio tem o nome dele, descoberto oito anos antes; hoje o urânio alimenta as centrais nucleares.'],
  neptune: ['The planet Neptune: neptunium comes after uranium, as Neptune comes after Uranus.', 'O planeta Neptuno: o neptúnio vem depois do urânio, como Neptuno vem depois de Úrano.'],
  pluto: ['Pluto and its heart: plutonium is named after it, and plutonium powers space probes like New Horizons, which flew past Pluto in 2015.', 'Plutão e o seu coração: o plutónio tem o nome dele, e o plutónio dá energia a sondas como a New Horizons, que passou por Plutão em 2015.'],
  smoke: ['The smoke alarm: many smoke alarms hold a speck of americium.', 'O detetor de fumo: muitos detetores de fumo têm um grãozinho de amerício.'],
  hair: ['The wild white hair: einsteinium is named after Albert Einstein.', 'O cabelo branco despenteado: o einsténio tem o nome de Albert Einstein.'],
  table: ['The little periodic table: mendelevium is named after Dmitri Mendeleev, who made the periodic table in 1869.', 'A pequena tabela periódica: o mendelévio tem o nome de Dmitri Mendeleev, que fez a tabela periódica em 1869.'],
  goggles: ["The goggles: glassblowers wear didymium glasses, praseodymium with neodymium, which block the dazzling yellow glow of hot glass.", 'Os óculos de proteção: os sopradores de vidro usam óculos de didímio, praseodímio com neodímio, que tapam o brilho amarelo e ofuscante do vidro quente.'],
  turbine: ['The wind turbine: a little dysprosium keeps the magnets in wind turbines and electric cars strong when they get hot.', 'A turbina eólica: um pouco de disprósio mantém fortes os ímanes das turbinas eólicas e dos carros elétricos quando aquecem.'],
  'flag-se': ['The flag: ytterbium is named after Ytterby, a village in Sweden that gave its name to four elements.', 'A bandeira: o itérbio tem o nome de Ytterby, uma aldeia da Suécia que deu nome a quatro elementos.'],
  eiffel: ['The Eiffel Tower: lutetium is named after Lutetia, the old Roman name of Paris.', 'A Torre Eiffel: o lutécio tem o nome de Lutécia, o antigo nome romano de Paris.'],
  rover: ['The Mars rover: a speck of curium on Mars rovers helps them find out what the rocks of Mars are made of.', 'O robô de Marte: um grãozinho de cúrio nos robôs de Marte ajuda-os a descobrir de que são feitas as rochas de Marte.'],
  nobel: ['The gold medal: nobelium is named after Alfred Nobel, whose Nobel Prizes come with a gold medal.', 'A medalha de ouro: o nobélio tem o nome de Alfred Nobel, cujos Prémios Nobel vêm com uma medalha de ouro.'],
  sun: ['The Sun and the Earth: copernicium is named after Nicolaus Copernicus, who said the Earth goes round the Sun.', 'O Sol e a Terra: o copernício tem o nome de Nicolau Copérnico, que disse que a Terra anda à volta do Sol.'],
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
  const replaced = tr.mark === 'helmet' && TAKES_HEAD.has(SIGNATURE[el.symbol])
  if (tr.mark && L.marks[tr.mark] && !replaced) out.push(L.marks[tr.mark])
  const k = lang === 'pt-pt' ? 1 : 0
  if (FLAME_NAME[el.symbol] && (tr.mark === 'flame' || tr.mark === 'nubs')) {
    const c = FLAME_NAME[el.symbol][k]
    out.push(k ? `Brilha ${c}: a cor que ${art(el)} ${nameOf(el, lang).toLowerCase()} dá a uma chama.` : `It glows ${c}: the colour ${nameOf(el, lang).toLowerCase()} gives a flame.`)
  }
  if (tr.mark === 'helmet' && HELMET[el.group] && !replaced) {
    const shape = SHAPE[HELMET[el.group]][k]
    out.push(k ? `No capacete, ${shape}: a marca do grupo ${el.group}, que toda a coluna usa.` : `On its helmet, ${shape}: the mark of group ${el.group}, worn by its whole column.`)
  }
  if (SIGNATURE[el.symbol] && SIG[SIGNATURE[el.symbol]]) out.push(SIG[SIGNATURE[el.symbol]][k])
  if (tr.superheavy) out.push(L.superheavy)
  else if (tr.radioactive) out.push(L.radioactive)
  return out
}
