// Every word of the fire wing, in English, European Portuguese, Polish and German, at the two depths
// (kid: Explorer, sci: Scientist). Formulas are written plainly (O2); the panels get real subscripts (kit.chem).
// Numbers: methane's heat of combustion 890.3 kJ/mol (802.3 with the water as vapour); mean bond
// enthalpies C-H 413, O=O 498, C=O (in CO2) 799, O-H 463 kJ/mol; Fe2O3 forms with 824.2 kJ/mol;
// water absorbs 2257 kJ/kg as it boils; a candle in a closed jar goes out at roughly 15 to 16% O2.

export const FIRE_WORDS = {
  en: {
    back: "Back to oxygen's hall",
    kicker: 'Fire',
    talkTo: 'Talk to',
    busy: { kid: 'Wait a moment: it is still happening!', sci: 'One moment: the last run is still going.' },
    talk: {
      kid: [
        'The blue post on the triangle is me, oxygen. Take me away and watch the fire go out!',
        'A flame is not a thing: it is hot gas glowing while a reaction happens inside it.',
        'The hottest part of a candle flame is about 1400 °C, hotter than lava!',
        'Rust is iron burning very, very slowly: the same reaction as burning, only much slower.',
        'Come close to the campfire with me: fire loves oxygen, watch it flare!',
      ],
      sci: [
        'A candle\'s yellow light is glowing soot, carbon particles at about 1000 to 1400 °C; the blue at its base comes from excited C2 and CH radicals.',
        'Wood does not burn directly: heat breaks it down (pyrolysis) into flammable gases, which burn in the flame, while the char left behind glows.',
        'In pure O2, things that only smoulder in air burst into flame: oxygen cylinders are kept away from flames, oil and grease.',
        'Iron burns too when finely divided or hot enough: steel wool in air, sparklers, and the oxygen lance that cuts steel.',
        'Lavoisier\'s experiments in the 1770s replaced the phlogiston theory: burning adds oxygen, and mass is conserved.',
      ],
    },
    greet: {
      kid: 'Welcome to the fire chamber! Fire needs me, oxygen. Try taking me away from the campfire and see what happens.',
      sci: 'The fire chamber. Combustion: a fast reaction of a fuel with an oxidiser, almost always the O2 of the air, giving out energy as heat and light.',
    },
    triangle: {
      title: 'The fire triangle',
      sides: { fuel: 'Fuel', heat: 'Heat', oxygen: 'Oxygen' },
      // the sides as listed after says.missing ("Still missing: fuel, heat"): each language's own case and form
      missingNames: { fuel: 'fuel', heat: 'heat', oxygen: 'oxygen' },
      signs: {
        fuel: { kid: 'the wood that burns', sci: 'what burns: wood, gas, wax' },
        heat: { kid: 'to light it and keep it alight', sci: 'activation energy: the ignition temperature' },
        oxygen: { kid: 'from the air: that is me!', sci: 'the oxidiser: oxygen from the air' },
      },
      off: { kid: 'taken away: the fire goes out', sci: 'removed: combustion stops' },
      verbs: { take: 'Take away', give: 'Put back' },
      screen: { kid: 'take one away and the fire goes out', sci: 'fuel + oxidiser + activation energy' },
      says: {
        fuel: { kid: 'No fuel, nothing to burn: the fire starves.', sci: 'Fuel removed: no more vapour to burn.' },
        heat: { kid: 'Water cools it down: too cold to burn.', sci: 'Heat removed: water takes 2257 kJ per kilogram as it boils, cooling it below ignition.' },
        oxygen: { kid: 'The lid keeps me out, and without me the fire goes out!', sci: 'Oxidiser removed: the lid cuts off the O2.' },
        back: { kid: 'All three together again: fire!', sci: 'Triangle complete: it ignites again.' },
        missing: { kid: 'Still missing: ', sci: 'Still missing: ' },
      },
      panel: {
        kid: [
          { p: 'A fire needs three things at once: fuel (something to burn, like wood), heat (to start it and keep it going) and oxygen (from the air).' },
          { p: 'Take away any one of them and the fire goes out. That is how firefighters work: water takes away the heat, a fire blanket takes away the oxygen, and clearing the trees in front of a forest fire takes away its fuel.' },
          { p: 'Try each side of the triangle!' },
        ],
        sci: [
          { p: 'Combustion needs a fuel, an oxidiser (here O2) and enough energy to reach the ignition temperature (the activation energy). Once burning, the reaction\'s own heat keeps it going.' },
          { list: ['Remove the fuel: starve it (firebreaks, closing a gas valve).', 'Remove the heat: cool it below its ignition temperature (water absorbs 2257 kJ/kg as it boils).', 'Remove the oxidiser: smother it (a lid, a fire blanket, a CO2 extinguisher), or dilute the oxygen below about 15%.'] },
          { p: 'Fire scientists add a fourth side, the chain reaction of free radicals in the flame (the fire tetrahedron): some extinguishers, such as dry powders, work by breaking it.' },
        ],
      },
    },
    candle: {
      title: 'The candle under the jar',
      label: 'The candle and the jar',
      verbs: { cover: 'Cover the candle', lift: 'Lift the jar' },
      gauge: 'oxygen in the jar',
      out: 'out',
      screen: { kid: 'oxygen in the jar', sci: 'oxygen in the jar, % by volume' },
      says: {
        cover: { kid: 'Watch the gauge: the oxygen goes down and the flame gets smaller...', sci: 'Paraffin + O2 → CO2 + H2O: the O2 falls from 20.9%.' },
        out: { kid: 'Out, with about 16% oxygen still left in the jar!', sci: 'Extinguished at about 16% O2; CO2 is now about 3%.' },
        lift: { kid: 'Fresh air comes in: light it again!', sci: 'Fresh air, 20.9% O2: it can burn again.' },
      },
      panel: {
        kid: [
          { p: 'Under the jar the candle can only use the oxygen trapped inside. Watch the gauge: the oxygen goes down, the flame gets smaller, and then it goes out.' },
          { p: 'Surprise: it goes out while there is still about 16% oxygen left. A candle flame needs more than that to keep going.' },
          { p: 'Lift the jar and fresh air comes in: the candle can be lit again.' },
        ],
        sci: [
          { rows: [['O2 at the start', '20.9%'], ['O2 when it goes out', 'about 16%'], ['CO2 at the end', 'about 3%']] },
          { p: 'Paraffin wax (roughly C25H52) burns to CO2 and H2O. In a closed jar the flame dies at about 15 to 16% O2, when it can no longer release heat fast enough to stay above its ignition temperature.' },
          { p: 'The classic version over water is misleading: the water rises mostly because the hot gas cools and contracts, not because the oxygen is used up.' },
        ],
      },
    },
    splint: {
      title: 'The glowing splint test',
      label: 'The glowing splint',
      verb: 'Put the splint in the tube',
      tube: 'pure oxygen',
      screen: { kid: 'the test for oxygen', sci: 'a glowing splint relights in oxygen' },
      says: {
        kid: 'Whoosh! It bursts into flame: the gas in the tube is oxygen.',
        sci: 'Positive test: the smouldering splint relights in O2.',
      },
      panel: {
        kid: [
          { p: 'This is how scientists test a gas for oxygen. A wooden splint that is only glowing (no flame) goes into the test tube.' },
          { p: 'If the gas is oxygen, the splint bursts into flame! In air (21% oxygen) it only glows; in pure oxygen it burns much faster.' },
        ],
        sci: [
          { p: 'The glowing splint test: a smouldering splint relights in a gas rich in oxygen.' },
          { p: 'Smouldering is slow burning on the surface of the wood, limited by how fast O2 reaches it. With almost five times more O2 than air, the reaction speeds up, gives off heat faster, and the gases coming out of the hot wood catch fire.' },
          { p: 'The other school gas tests: hydrogen burns with a squeaky pop with a lit splint; carbon dioxide turns limewater milky.' },
        ],
      },
    },
    methane: {
      title: 'Burning, atom by atom',
      label: 'Methane burning',
      verbs: { burn: 'Burn the methane', again: 'Start again' },
      screen: { kid: 'atoms are never lost, only regrouped', sci: '890 kJ per mole of methane' },
      count: { C: 'C', H: 'H', O: 'O' },
      says: {
        burn: { kid: 'The bonds break, the atoms swap partners, and out comes light and heat!', sci: 'Bonds broken: 4 C−H and 2 O=O; made: 2 C=O and 4 O−H. About 800 kJ/mol released (water as vapour).' },
        again: { kid: 'Methane and oxygen, ready to burn again.', sci: 'Reactants: CH4 + 2 O2.' },
      },
      panel: {
        kid: [
          { p: 'The blue flame of a gas cooker burns methane, natural gas. Watch the atoms: the bonds break and the atoms swap partners.' },
          { p: 'One carbon and four hydrogens (methane) plus four oxygen atoms (two O2) become one carbon dioxide and two waters. Count them: no atom is lost, and none is made.' },
          { p: 'The new bonds are stronger than the old ones, so energy comes out as light and heat: that is the flame.' },
        ],
        sci: [
          { big: 'CH4 + 2 O2 → CO2 + 2 H2O', small: 'every atom accounted for' },
          { rows: [['Carbon', '1 → 1'], ['Hydrogen', '4 → 4'], ['Oxygen', '4 → 4'], ['Energy released', '890 kJ/mol (802 kJ/mol with the water as vapour)']] },
          { p: 'From mean bond enthalpies: broken, 4 C−H (413 each) and 2 O=O (498 each), 2648 kJ; made, 2 C=O (799 each) and 4 O−H (463 each), 3450 kJ. About 802 kJ/mol out.' },
          { p: 'Lavoisier showed in the 1770s that burning is combination with oxygen and that mass is conserved. A blue flame means complete combustion; a yellow, sooty flame lacks oxygen and makes soot and poisonous carbon monoxide.' },
        ],
      },
    },
    rust: {
      title: 'Rust, a slow burning',
      label: 'The three nails',
      verbs: { run: 'Speed up time', reset: 'New nails' },
      tubes: { wet: 'air + water', dry: 'dry air', airless: 'water, no air' },
      day: d => (d < 1 ? 'day 0' : d === 1 ? '1 day' : `${d} days`),
      screen: { kid: 'iron + oxygen + water', sci: 'rust: hydrated iron(III) oxide' },
      says: {
        run: { kid: 'Only the nail with air AND water rusts!', sci: 'Rusting needs both O2 and H2O: only tube 1 corrodes.' },
        reset: { kid: 'Three shiny new nails.', sci: 'Fresh iron in each tube.' },
      },
      panel: {
        kid: [
          { p: 'Iron also "burns" with oxygen, but very slowly: it rusts. Rust is iron joined to oxygen and a little water.' },
          { p: 'The three tubes are a classic experiment. Only the nail with both air and water rusts. In dry air (with a drying powder) or in boiled water under oil (no air), it stays shiny.' },
          { p: 'Salt makes it faster, which is why cars rust near the sea. Hand warmers are rusting made quick: iron powder rusts in minutes and gets hot!' },
        ],
        sci: [
          { big: '4 Fe + 3 O2 → 2 Fe2O3', small: 'rust is the hydrated form, Fe₂O₃·nH₂O' },
          { p: 'Rusting is electrochemical: where water touches the iron, Fe → Fe²⁺ + 2e⁻; the electrons reduce oxygen dissolved in the water, O2 + 2 H2O + 4e⁻ → 4 OH⁻. Salt makes the water conduct better and speeds it up.' },
          { p: 'It gives out as much energy as burning the same iron (about 824 kJ per mole of Fe2O3), only spread over months. Rust is porous and flakes off, exposing new iron; aluminium\'s oxide, by contrast, stays put and protects it.' },
          { p: 'Steel wool, with a huge surface, does burn in air with sparks: the same reaction, fast.' },
        ],
      },
    },
  },

  'pt-pt': {
    back: 'Voltar ao salão do oxigénio',
    kicker: 'O fogo',
    talkTo: 'Falar com',
    busy: { kid: 'Espera um bocadinho: ainda está a acontecer!', sci: 'Um momento: a experiência anterior ainda está a decorrer.' },
    talk: {
      kid: [
        'O poste azul do triângulo sou eu, o oxigénio. Tira-me e vê o fogo apagar-se!',
        'Uma chama não é uma coisa: é gás quente a brilhar enquanto lá dentro acontece uma reação.',
        'A parte mais quente da chama de uma vela anda pelos 1400 °C, mais quente do que a lava!',
        'A ferrugem é o ferro a arder muito, muito devagar: a mesma reação de arder, só que muito mais lenta.',
        'Chega-te à fogueira comigo: o fogo adora oxigénio, vê como se aviva!',
      ],
      sci: [
        'A luz amarela de uma vela é fuligem incandescente, partículas de carbono a cerca de 1000 a 1400 °C; o azul na base vem de radicais C2 e CH excitados.',
        'A madeira não arde diretamente: o calor decompõe-na (pirólise) em gases inflamáveis, que ardem na chama, enquanto o carvão que fica brilha em brasa.',
        'No O2 puro, o que no ar só arde em brasa inflama-se: por isso as garrafas de oxigénio se guardam longe de chamas, óleos e gorduras.',
        'O ferro também arde quando está em pó fino ou muito quente: a palha de aço no ar, as estrelinhas, e a lança de oxigénio que corta aço.',
        'As experiências de Lavoisier na década de 1770 derrubaram a teoria do flogisto: arder é juntar oxigénio, e a massa conserva-se.',
      ],
    },
    greet: {
      kid: 'Bem-vindo à câmara do fogo! O fogo precisa de mim, o oxigénio. Experimenta tirar-me da fogueira e vê o que acontece.',
      sci: 'A câmara do fogo. A combustão é uma reação rápida entre um combustível e um comburente, quase sempre o O2 do ar, que liberta energia na forma de calor e luz.',
    },
    triangle: {
      title: 'O triângulo do fogo',
      sides: { fuel: 'Combustível', heat: 'Calor', oxygen: 'Oxigénio' },
      missingNames: { fuel: 'combustível', heat: 'calor', oxygen: 'oxigénio' },
      signs: {
        fuel: { kid: 'a lenha que arde', sci: 'o que arde: madeira, gás, cera' },
        heat: { kid: 'para o acender e o manter aceso', sci: 'energia de ativação: a temperatura de ignição' },
        oxygen: { kid: 'do ar: sou eu!', sci: 'o comburente: o oxigénio do ar' },
      },
      off: { kid: 'tirado: o fogo apaga-se', sci: 'retirado: a combustão para' },
      verbs: { take: 'Tirar', give: 'Repor' },
      screen: { kid: 'tira um e o fogo apaga-se', sci: 'combustível + comburente + energia de ativação' },
      says: {
        fuel: { kid: 'Sem combustível, nada para arder: o fogo morre de fome.', sci: 'Sem combustível: deixa de haver vapores para arder.' },
        heat: { kid: 'A água arrefece-o: frio demais para arder.', sci: 'Sem calor: a água absorve 2257 kJ por quilograma ao ferver e arrefece-o abaixo da temperatura de ignição.' },
        oxygen: { kid: 'A tampa deixa-me de fora, e sem mim o fogo apaga-se!', sci: 'Sem comburente: a tampa corta o O2.' },
        back: { kid: 'Os três juntos outra vez: fogo!', sci: 'Triângulo completo: volta a inflamar-se.' },
        missing: { kid: 'Ainda falta: ', sci: 'Ainda falta: ' },
      },
      panel: {
        kid: [
          { p: 'Um fogo precisa de três coisas ao mesmo tempo: combustível (algo que arda, como a lenha), calor (para o acender e o manter aceso) e oxigénio (do ar), a que os cientistas chamam comburente.' },
          { p: 'Tira qualquer um deles e o fogo apaga-se. É assim que os bombeiros trabalham: a água tira o calor, uma manta corta-fogo tira o oxigénio, e cortar as árvores à frente de um incêndio florestal tira-lhe o combustível.' },
          { p: 'Experimenta cada lado do triângulo!' },
        ],
        sci: [
          { p: 'A combustão precisa de um combustível, de um comburente (aqui o O2) e de energia suficiente para atingir a temperatura de ignição (a energia de ativação). Depois de começar, o calor da própria reação mantém-na.' },
          { list: ['Tirar o combustível: deixá-lo sem alimento (aceiros, fechar uma válvula de gás).', 'Tirar o calor: arrefecê-lo abaixo da temperatura de ignição (a água absorve 2257 kJ/kg ao ferver).', 'Tirar o comburente: abafá-lo (uma tampa, uma manta corta-fogo, um extintor de CO2), ou diluir o oxigénio abaixo de cerca de 15%.'] },
          { p: 'Os cientistas do fogo juntam um quarto lado, a reação em cadeia dos radicais livres na chama (o tetraedro do fogo): alguns extintores, como os de pó químico, atuam quebrando-a.' },
        ],
      },
    },
    candle: {
      title: 'A vela debaixo do frasco',
      label: 'A vela e o frasco',
      verbs: { cover: 'Tapar a vela', lift: 'Levantar o frasco' },
      gauge: 'oxigénio no frasco',
      out: 'apagou',
      screen: { kid: 'oxigénio no frasco', sci: 'oxigénio no frasco, % em volume' },
      says: {
        cover: { kid: 'Olha para o mostrador: o oxigénio desce e a chama fica mais pequena...', sci: 'Parafina + O2 → CO2 + H2O: o O2 desce dos 20,9%.' },
        out: { kid: 'Apagou-se, e ainda sobra cerca de 16% de oxigénio no frasco!', sci: 'Extinta a cerca de 16% de O2; o CO2 está agora perto de 3%.' },
        lift: { kid: 'Entra ar fresco: acende-a outra vez!', sci: 'Ar fresco, 20,9% de O2: volta a poder arder.' },
      },
      panel: {
        kid: [
          { p: 'Debaixo do frasco a vela só pode usar o oxigénio que ficou preso lá dentro. Olha para o mostrador: o oxigénio desce, a chama fica mais pequena e depois apaga-se.' },
          { p: 'Surpresa: apaga-se quando ainda há cerca de 16% de oxigénio. Uma chama de vela precisa de mais do que isso para continuar acesa.' },
          { p: 'Levanta o frasco e entra ar fresco: a vela pode voltar a ser acesa.' },
        ],
        sci: [
          { rows: [['O2 no início', '20,9%'], ['O2 quando se apaga', 'cerca de 16%'], ['CO2 no fim', 'cerca de 3%']] },
          { p: 'A parafina (cerca de C25H52) arde dando CO2 e H2O. Num frasco fechado a chama extingue-se a cerca de 15 a 16% de O2, quando já não liberta calor depressa o suficiente para se manter acima da temperatura de ignição.' },
          { p: 'A versão clássica sobre água engana: a água sobe sobretudo porque o gás quente arrefece e contrai, e não porque o oxigénio se gasta.' },
        ],
      },
    },
    splint: {
      title: 'O teste da tala em brasa',
      label: 'A tala em brasa',
      verb: 'Pôr a tala no tubo',
      tube: 'oxigénio puro',
      screen: { kid: 'o teste do oxigénio', sci: 'uma tala em brasa reacende-se no oxigénio' },
      says: {
        kid: 'Fuuu! Pegou fogo: o gás do tubo é oxigénio.',
        sci: 'Teste positivo: a tala incandescente reacende-se no O2.',
      },
      panel: {
        kid: [
          { p: 'É assim que os cientistas descobrem se um gás é oxigénio. Uma tala de madeira só em brasa (sem chama) entra no tubo de ensaio.' },
          { p: 'Se o gás for oxigénio, a tala pega fogo! No ar (21% de oxigénio) fica só em brasa; no oxigénio puro arde muito mais depressa.' },
        ],
        sci: [
          { p: 'O teste da tala incandescente: uma tala em brasa reacende-se num gás rico em oxigénio.' },
          { p: 'A combustão lenta (sem chama) acontece à superfície da madeira e está limitada pela rapidez com que o O2 lá chega. Com quase cinco vezes mais O2 do que no ar, a reação acelera, liberta calor mais depressa, e os gases que saem da madeira quente inflamam-se.' },
          { p: 'Os outros testes de gases da escola: o hidrogénio arde com um pequeno estalo com uma tala acesa; o dióxido de carbono turva a água de cal.' },
        ],
      },
    },
    methane: {
      title: 'A combustão, átomo a átomo',
      label: 'O metano a arder',
      verbs: { burn: 'Queimar o metano', again: 'Recomeçar' },
      screen: { kid: 'os átomos nunca se perdem, só se reagrupam', sci: '890 kJ por mole de metano' },
      count: { C: 'C', H: 'H', O: 'O' },
      says: {
        burn: { kid: 'As ligações partem-se, os átomos trocam de par, e sai luz e calor!', sci: 'Partem-se 4 C−H e 2 O=O; formam-se 2 C=O e 4 O−H. Libertam-se cerca de 800 kJ/mol (com água em vapor).' },
        again: { kid: 'Metano e oxigénio, prontos para arder outra vez.', sci: 'Reagentes: CH4 + 2 O2.' },
      },
      panel: {
        kid: [
          { p: 'A chama azul de um fogão a gás queima metano, o gás natural. Olha para os átomos: as ligações partem-se e os átomos trocam de par.' },
          { p: 'Um carbono e quatro hidrogénios (o metano) mais quatro átomos de oxigénio (dois O2) passam a ser um dióxido de carbono e duas águas. Conta-os: nenhum átomo se perde, e nenhum aparece do nada.' },
          { p: 'As novas ligações são mais fortes do que as antigas, por isso sai energia na forma de luz e calor: é a chama.' },
        ],
        sci: [
          { big: 'CH4 + 2 O2 → CO2 + 2 H2O', small: 'todos os átomos contados' },
          { rows: [['Carbono', '1 → 1'], ['Hidrogénio', '4 → 4'], ['Oxigénio', '4 → 4'], ['Energia libertada', '890 kJ/mol (802 kJ/mol com a água em vapor)']] },
          { p: 'Pelas entalpias médias de ligação: partem-se 4 C−H (413 cada) e 2 O=O (498 cada), 2648 kJ; formam-se 2 C=O (799 cada) e 4 O−H (463 cada), 3450 kJ. Saem cerca de 802 kJ/mol.' },
          { p: 'Lavoisier mostrou na década de 1770 que arder é combinar-se com o oxigénio e que a massa se conserva. Uma chama azul é uma combustão completa; uma chama amarela e fuliginosa tem falta de oxigénio e produz fuligem e monóxido de carbono, um gás venenoso.' },
        ],
      },
    },
    rust: {
      title: 'A ferrugem, uma combustão lenta',
      label: 'Os três pregos',
      verbs: { run: 'Acelerar o tempo', reset: 'Pregos novos' },
      tubes: { wet: 'ar + água', dry: 'ar seco', airless: 'água sem ar' },
      day: d => (d < 1 ? 'dia 0' : d === 1 ? '1 dia' : `${d} dias`),
      screen: { kid: 'ferro + oxigénio + água', sci: 'ferrugem: óxido de ferro(III) hidratado' },
      says: {
        run: { kid: 'Só enferruja o prego que tem ar E água!', sci: 'A ferrugem precisa de O2 e de H2O: só o tubo 1 sofre corrosão.' },
        reset: { kid: 'Três pregos novos e brilhantes.', sci: 'Ferro novo em cada tubo.' },
      },
      panel: {
        kid: [
          { p: 'O ferro também "arde" com o oxigénio, mas muito devagar: enferruja. A ferrugem é ferro ligado ao oxigénio e a um pouco de água.' },
          { p: 'Os três tubos são uma experiência clássica. Só enferruja o prego que tem ar e água. No ar seco (com um pó secante) ou em água fervida tapada com óleo (sem ar), fica brilhante.' },
          { p: 'O sal acelera a ferrugem, e por isso os carros enferrujam mais perto do mar. Os aquecedores de mãos são ferrugem rápida: o pó de ferro enferruja em minutos e aquece!' },
        ],
        sci: [
          { big: '4 Fe + 3 O2 → 2 Fe2O3', small: 'a ferrugem é a forma hidratada, Fe₂O₃·nH₂O' },
          { p: 'A ferrugem forma-se por um processo eletroquímico: onde a água toca no ferro, Fe → Fe²⁺ + 2e⁻; os eletrões reduzem o oxigénio dissolvido na água, O2 + 2 H2O + 4e⁻ → 4 OH⁻. O sal torna a água melhor condutora e acelera-a.' },
          { p: 'Liberta tanta energia como queimar o mesmo ferro (cerca de 824 kJ por mole de Fe2O3), só que espalhada por meses. A ferrugem é porosa e desfaz-se, expondo ferro novo; o óxido do alumínio, pelo contrário, fica agarrado e protege-o.' },
          { p: 'A palha de aço, com uma superfície enorme, arde mesmo no ar, com faíscas: a mesma reação, depressa.' },
        ],
      },
    },
  },

  pl: {
    back: 'Wróć do sali tlenu',
    kicker: 'Ogień',
    talkTo: 'Porozmawiaj z',
    busy: { kid: 'Chwileczkę: to jeszcze trwa!', sci: 'Chwila: poprzednia próba jeszcze trwa.' },
    talk: {
      kid: [
        'Niebieski słupek trójkąta to ja, tlen. Zabierz mnie i zobacz, jak ogień gaśnie!',
        'Płomień to nie rzecz: to gorący gaz, który świeci, kiedy w środku zachodzi reakcja.',
        'Najgorętsza część płomienia świecy ma około 1400 °C, jest gorętsza niż lawa!',
        'Rdza to żelazo, które pali się bardzo, bardzo powoli: ta sama reakcja co spalanie, tylko dużo wolniejsza.',
        'Podejdź ze mną do ogniska: ogień kocha tlen, zobacz, jak buchnie!',
      ],
      sci: [
        'Żółte światło świecy to rozżarzona sadza, cząstki węgla w temperaturze około 1000 do 1400 °C; niebieski kolor u podstawy pochodzi od wzbudzonych rodników C2 i CH.',
        'Drewno nie pali się bezpośrednio: ciepło rozkłada je (piroliza) na palne gazy, które płoną w płomieniu, a pozostały węgiel drzewny się żarzy.',
        'W czystym O2 to, co w powietrzu tylko się tli, wybucha płomieniem: dlatego butle z tlenem trzyma się z dala od ognia, oleju i smaru.',
        'Żelazo też się pali, gdy jest drobno rozdrobnione albo dość gorące: wełna stalowa w powietrzu, zimne ognie i lanca tlenowa, która tnie stal.',
        'Doświadczenia Lavoisiera w latach 70. XVIII wieku obaliły teorię flogistonu: spalanie to przyłączanie tlenu, a masa jest zachowana.',
      ],
    },
    greet: {
      kid: 'Witaj w komnacie ognia! Ogień potrzebuje mnie, tlenu. Spróbuj zabrać mnie od ogniska i zobacz, co się stanie.',
      sci: 'Komnata ognia. Spalanie: szybka reakcja paliwa z utleniaczem, prawie zawsze z O2 z powietrza, w której energia wydziela się jako ciepło i światło.',
    },
    triangle: {
      title: 'Trójkąt spalania',
      sides: { fuel: 'Paliwo', heat: 'Ciepło', oxygen: 'Tlen' },
      missingNames: { fuel: 'paliwa', heat: 'ciepła', oxygen: 'tlenu' },
      signs: {
        fuel: { kid: 'drewno, które się pali', sci: 'to, co się pali: drewno, gaz, wosk' },
        heat: { kid: 'żeby go zapalić i podtrzymać', sci: 'energia aktywacji: temperatura zapłonu' },
        oxygen: { kid: 'z powietrza: to ja!', sci: 'utleniacz: tlen z powietrza' },
      },
      off: { kid: 'zabrane: ogień gaśnie', sci: 'usunięte: spalanie ustaje' },
      verbs: { take: 'Zabierz', give: 'Przywróć' },
      screen: { kid: 'zabierz jedno, a ogień zgaśnie', sci: 'paliwo + utleniacz + energia aktywacji' },
      says: {
        fuel: { kid: 'Bez paliwa nie ma co się palić: ogień głoduje.', sci: 'Usunięto paliwo: nie ma już par, które mogą się palić.' },
        heat: { kid: 'Woda go chłodzi: za zimno, żeby się palić.', sci: 'Usunięto ciepło: woda pochłania 2257 kJ na kilogram, gdy wrze, i chłodzi go poniżej temperatury zapłonu.' },
        oxygen: { kid: 'Pokrywa mnie odcina, a beze mnie ogień gaśnie!', sci: 'Usunięto utleniacz: pokrywa odcina O2.' },
        back: { kid: 'Wszystkie trzy znowu razem: ogień!', sci: 'Trójkąt kompletny: znów się zapala.' },
        missing: { kid: 'Wciąż brakuje: ', sci: 'Wciąż brakuje: ' },
      },
      panel: {
        kid: [
          { p: 'Ogień potrzebuje naraz trzech rzeczy: paliwa (czegoś, co się pali, na przykład drewna), ciepła (żeby go rozpalić i podtrzymać) i tlenu (z powietrza).' },
          { p: 'Zabierz którąkolwiek z nich, a ogień zgaśnie. Tak pracują strażacy: woda zabiera ciepło, koc gaśniczy zabiera tlen, a wycięcie drzew przed pożarem lasu zabiera mu paliwo.' },
          { p: 'Wypróbuj każdy bok trójkąta!' },
        ],
        sci: [
          { p: 'Spalanie wymaga paliwa, utleniacza (tutaj O2) i dość energii, by osiągnąć temperaturę zapłonu (energia aktywacji). Gdy już się pali, ciepło samej reakcji je podtrzymuje.' },
          { list: ['Usuń paliwo: zagłodź ogień (pasy przeciwpożarowe, zakręcenie zaworu gazu).', 'Usuń ciepło: ochłodź ogień poniżej temperatury zapłonu (woda pochłania 2257 kJ/kg, gdy wrze).', 'Usuń utleniacz: zduś ogień (pokrywa, koc gaśniczy, gaśnica CO2) albo rozcieńcz tlen poniżej około 15%.'] },
          { p: 'Badacze pożarów dodają czwarty bok, łańcuchową reakcję wolnych rodników w płomieniu (czworościan spalania): niektóre gaśnice, na przykład proszkowe, działają, przerywając ją.' },
        ],
      },
    },
    candle: {
      title: 'Świeca pod słojem',
      label: 'Świeca i słój',
      verbs: { cover: 'Przykryj świecę', lift: 'Podnieś słój' },
      gauge: 'tlen w słoju',
      out: 'zgasła',
      screen: { kid: 'tlen w słoju', sci: 'tlen w słoju, % objętościowo' },
      says: {
        cover: { kid: 'Patrz na wskaźnik: tlenu ubywa, a płomień robi się coraz mniejszy...', sci: 'Parafina + O2 → CO2 + H2O: O2 spada z 20,9%.' },
        out: { kid: 'Zgasła, a w słoju wciąż zostało około 16% tlenu!', sci: 'Zgasła przy około 16% O2; CO2 to teraz około 3%.' },
        lift: { kid: 'Wpada świeże powietrze: zapal ją znowu!', sci: 'Świeże powietrze, 20,9% O2: znów może się palić.' },
      },
      panel: {
        kid: [
          { p: 'Pod słojem świeca może korzystać tylko z tlenu uwięzionego w środku. Patrz na wskaźnik: tlenu ubywa, płomień maleje, a potem gaśnie.' },
          { p: 'Niespodzianka: gaśnie, gdy zostało jeszcze około 16% tlenu. Płomień świecy potrzebuje więcej, żeby dalej się palić.' },
          { p: 'Podnieś słój, a wpadnie świeże powietrze: świecę można znowu zapalić.' },
        ],
        sci: [
          { rows: [['O2 na początku', '20,9%'], ['O2, gdy gaśnie', 'około 16%'], ['CO2 na końcu', 'około 3%']] },
          { p: 'Parafina (mniej więcej C25H52) spala się do CO2 i H2O. W zamkniętym słoju płomień gaśnie przy około 15 do 16% O2, gdy nie może już wydzielać ciepła dość szybko, by utrzymać się powyżej temperatury zapłonu.' },
          { p: 'Klasyczna wersja nad wodą wprowadza w błąd: woda podnosi się głównie dlatego, że gorący gaz stygnie i się kurczy, a nie dlatego, że tlen się zużywa.' },
        ],
      },
    },
    splint: {
      title: 'Próba z tlącym się łuczywem',
      label: 'Tlące się łuczywo',
      verb: 'Włóż łuczywo do probówki',
      tube: 'czysty tlen',
      screen: { kid: 'próba na tlen', sci: 'tlące się łuczywo zapala się w tlenie' },
      says: {
        kid: 'Fiuu! Buchnął płomień: gaz w probówce to tlen.',
        sci: 'Wynik pozytywny: tlące się łuczywo zapala się ponownie w O2.',
      },
      panel: {
        kid: [
          { p: 'Tak naukowcy sprawdzają, czy gaz to tlen. Drewniane łuczywo, które tylko się żarzy (bez płomienia), wkłada się do probówki.' },
          { p: 'Jeśli gaz to tlen, łuczywo buchnie płomieniem! W powietrzu (21% tlenu) tylko się żarzy; w czystym tlenie pali się dużo szybciej.' },
        ],
        sci: [
          { p: 'Próba z tlącym się łuczywem: tlące się łuczywo zapala się ponownie w gazie bogatym w tlen.' },
          { p: 'Tlenie to powolne spalanie na powierzchni drewna, ograniczone tym, jak szybko dociera do niego O2. Przy prawie pięć razy większej ilości O2 niż w powietrzu reakcja przyspiesza, szybciej wydziela ciepło, a gazy uchodzące z gorącego drewna zapalają się.' },
          { p: 'Inne szkolne próby na gazy: wodór przy zapalonym łuczywie spala się z piskliwym „pyknięciem”; dwutlenek węgla powoduje mętnienie wody wapiennej.' },
        ],
      },
    },
    methane: {
      title: 'Spalanie, atom po atomie',
      label: 'Spalanie metanu',
      verbs: { burn: 'Spal metan', again: 'Zacznij od nowa' },
      screen: { kid: 'atomy nie giną, tylko się przegrupowują', sci: '890 kJ na mol metanu' },
      count: { C: 'C', H: 'H', O: 'O' },
      says: {
        burn: { kid: 'Wiązania pękają, atomy zamieniają się partnerami, a wychodzi światło i ciepło!', sci: 'Zerwane: 4 C−H i 2 O=O; utworzone: 2 C=O i 4 O−H. Wydziela się około 800 kJ/mol (woda jako para).' },
        again: { kid: 'Metan i tlen, gotowe, żeby znów się spalić.', sci: 'Substraty: CH4 + 2 O2.' },
      },
      panel: {
        kid: [
          { p: 'Niebieski płomień kuchenki gazowej spala metan, gaz ziemny. Patrz na atomy: wiązania pękają, a atomy zamieniają się partnerami.' },
          { p: 'Jeden atom węgla i cztery atomy wodoru (metan) plus cztery atomy tlenu (dwa O2) stają się jedną cząsteczką dwutlenku węgla i dwiema cząsteczkami wody. Policz je: żaden atom nie ginie i żaden nie powstaje.' },
          { p: 'Nowe wiązania są silniejsze od starych, więc energia wychodzi jako światło i ciepło: to jest płomień.' },
        ],
        sci: [
          { big: 'CH4 + 2 O2 → CO2 + 2 H2O', small: 'każdy atom się zgadza' },
          { rows: [['Węgiel', '1 → 1'], ['Wodór', '4 → 4'], ['Tlen', '4 → 4'], ['Wydzielona energia', '890 kJ/mol (802 kJ/mol z wodą w postaci pary)']] },
          { p: 'Ze średnich entalpii wiązań: zerwane 4 C−H (po 413) i 2 O=O (po 498), 2648 kJ; utworzone 2 C=O (po 799) i 4 O−H (po 463), 3450 kJ. Wychodzi około 802 kJ/mol.' },
          { p: 'Lavoisier pokazał w latach 70. XVIII wieku, że spalanie to łączenie się z tlenem i że masa jest zachowana. Niebieski płomień oznacza spalanie całkowite; żółty, kopcący płomień ma za mało tlenu i wytwarza sadzę oraz trujący tlenek węgla.' },
        ],
      },
    },
    rust: {
      title: 'Rdza, powolne spalanie',
      label: 'Trzy gwoździe',
      verbs: { run: 'Przyspiesz czas', reset: 'Nowe gwoździe' },
      tubes: { wet: 'powietrze + woda', dry: 'suche powietrze', airless: 'woda bez powietrza' },
      day: d => (d < 1 ? 'dzień 0' : d === 1 ? '1 dzień' : `${d} dni`),
      screen: { kid: 'żelazo + tlen + woda', sci: 'rdza: uwodniony tlenek żelaza(III)' },
      says: {
        run: { kid: 'Rdzewieje tylko gwóźdź, który ma powietrze I wodę!', sci: 'Rdzewienie wymaga zarówno O2, jak i H2O: koroduje tylko gwóźdź w probówce 1.' },
        reset: { kid: 'Trzy nowe, błyszczące gwoździe.', sci: 'Świeże żelazo w każdej probówce.' },
      },
      panel: {
        kid: [
          { p: 'Żelazo też „pali się” z tlenem, ale bardzo powoli: rdzewieje. Rdza to żelazo połączone z tlenem i odrobiną wody.' },
          { p: 'Trzy probówki to klasyczne doświadczenie. Rdzewieje tylko gwóźdź, który ma i powietrze, i wodę. W suchym powietrzu (ze środkiem suszącym) albo w przegotowanej wodzie pod olejem (bez powietrza) zostaje błyszczący.' },
          { p: 'Sól to przyspiesza, dlatego samochody rdzewieją nad morzem. Ogrzewacze do rąk to szybkie rdzewienie: proszek żelaza rdzewieje w kilka minut i robi się gorący!' },
        ],
        sci: [
          { big: '4 Fe + 3 O2 → 2 Fe2O3', small: 'rdza to forma uwodniona, Fe₂O₃·nH₂O' },
          { p: 'Rdzewienie jest procesem elektrochemicznym: tam, gdzie woda dotyka żelaza, Fe → Fe²⁺ + 2e⁻; elektrony redukują tlen rozpuszczony w wodzie, O2 + 2 H2O + 4e⁻ → 4 OH⁻. Sól sprawia, że woda lepiej przewodzi, i przyspiesza ten proces.' },
          { p: 'Wydziela tyle samo energii co spalenie tego samego żelaza (około 824 kJ na mol Fe2O3), tylko rozłożonej na miesiące. Rdza jest porowata i odpada płatami, odsłaniając nowe żelazo; tlenek glinu natomiast zostaje na miejscu i chroni glin.' },
          { p: 'Wełna stalowa, o ogromnej powierzchni, naprawdę pali się w powietrzu, sypiąc iskrami: ta sama reakcja, tylko szybko.' },
        ],
      },
    },
  },

  de: {
    back: 'Zurück zur Sauerstoffhalle',
    kicker: 'Feuer',
    talkTo: 'Sprich mit',
    busy: { kid: 'Warte kurz: es passiert noch!', sci: 'Einen Moment: der letzte Durchlauf läuft noch.' },
    talk: {
      kid: [
        'Der blaue Pfosten am Dreieck bin ich, Sauerstoff. Nimm mich weg und schau, wie das Feuer ausgeht!',
        'Eine Flamme ist kein Ding: sie ist heißes Gas, das leuchtet, während darin eine Reaktion abläuft.',
        'Der heißeste Teil einer Kerzenflamme hat etwa 1400 °C, heißer als Lava!',
        'Rost ist Eisen, das ganz, ganz langsam brennt: dieselbe Reaktion wie beim Verbrennen, nur viel langsamer.',
        'Komm mit mir näher ans Lagerfeuer: Feuer liebt Sauerstoff, schau, wie es auflodert!',
      ],
      sci: [
        'Das gelbe Licht einer Kerze ist glühender Ruß, Kohlenstoffteilchen bei etwa 1000 bis 1400 °C; das Blau an ihrem Fuß stammt von angeregten C2- und CH-Radikalen.',
        'Holz brennt nicht direkt: Hitze zersetzt es (Pyrolyse) in brennbare Gase, die in der Flamme brennen, während die zurückbleibende Holzkohle glüht.',
        'In reinem O2 geht in Flammen auf, was an der Luft nur glimmt: deshalb hält man Sauerstoffflaschen von Flammen, Öl und Fett fern.',
        'Auch Eisen brennt, wenn es fein verteilt oder heiß genug ist: Stahlwolle an der Luft, Wunderkerzen und die Sauerstofflanze, die Stahl schneidet.',
        'Lavoisiers Experimente in den 1770er-Jahren lösten die Phlogistontheorie ab: Verbrennen fügt Sauerstoff hinzu, und die Masse bleibt erhalten.',
      ],
    },
    greet: {
      kid: 'Willkommen in der Feuerkammer! Feuer braucht mich, Sauerstoff. Versuch mal, mich vom Lagerfeuer wegzunehmen, und schau, was passiert.',
      sci: 'Die Feuerkammer. Verbrennung: eine schnelle Reaktion eines Brennstoffs mit einem Oxidationsmittel, fast immer dem O2 der Luft, die Energie als Wärme und Licht abgibt.',
    },
    triangle: {
      title: 'Das Verbrennungsdreieck',
      sides: { fuel: 'Brennstoff', heat: 'Wärme', oxygen: 'Sauerstoff' },
      missingNames: { fuel: 'Brennstoff', heat: 'Wärme', oxygen: 'Sauerstoff' },
      signs: {
        fuel: { kid: 'das Holz, das brennt', sci: 'was brennt: Holz, Gas, Wachs' },
        heat: { kid: 'zum Anzünden und Weiterbrennen', sci: 'Aktivierungsenergie: die Zündtemperatur' },
        oxygen: { kid: 'aus der Luft: das bin ich!', sci: 'das Oxidationsmittel: Sauerstoff aus der Luft' },
      },
      off: { kid: 'weggenommen: das Feuer geht aus', sci: 'entfernt: die Verbrennung stoppt' },
      verbs: { take: 'Nimm weg', give: 'Gib zurück' },
      screen: { kid: 'nimm eins weg und das Feuer geht aus', sci: 'Brennstoff + Oxidationsmittel + Aktivierungsenergie' },
      says: {
        fuel: { kid: 'Kein Brennstoff, nichts zum Brennen: das Feuer verhungert.', sci: 'Brennstoff entfernt: kein Dampf mehr, der brennen kann.' },
        heat: { kid: 'Wasser kühlt es ab: zu kalt zum Brennen.', sci: 'Wärme entfernt: Wasser nimmt beim Verdampfen 2257 kJ pro Kilogramm auf und kühlt es unter die Zündtemperatur.' },
        oxygen: { kid: 'Der Deckel sperrt mich aus, und ohne mich geht das Feuer aus!', sci: 'Oxidationsmittel entfernt: der Deckel schneidet das O2 ab.' },
        back: { kid: 'Alle drei wieder zusammen: Feuer!', sci: 'Dreieck vollständig: es zündet wieder.' },
        missing: { kid: 'Es fehlt noch: ', sci: 'Es fehlt noch: ' },
      },
      panel: {
        kid: [
          { p: 'Ein Feuer braucht drei Dinge gleichzeitig: Brennstoff (etwas, das brennt, wie Holz), Wärme (zum Anzünden und Weiterbrennen) und Sauerstoff (aus der Luft).' },
          { p: 'Nimm eines davon weg, und das Feuer geht aus. So arbeitet die Feuerwehr: Wasser nimmt die Wärme weg, eine Löschdecke den Sauerstoff, und wer die Bäume vor einem Waldbrand fällt, nimmt ihm den Brennstoff.' },
          { p: 'Probier jede Seite des Dreiecks aus!' },
        ],
        sci: [
          { p: 'Verbrennung braucht einen Brennstoff, ein Oxidationsmittel (hier O2) und genug Energie, um die Zündtemperatur zu erreichen (die Aktivierungsenergie). Brennt es einmal, hält die Wärme der Reaktion selbst es in Gang.' },
          { list: ['Brennstoff entfernen: das Feuer aushungern (Brandschneisen, ein Gasventil schließen).', 'Wärme entfernen: unter die Zündtemperatur kühlen (Wasser nimmt beim Verdampfen 2257 kJ/kg auf).', 'Oxidationsmittel entfernen: ersticken (ein Deckel, eine Löschdecke, ein CO2-Löscher) oder den Sauerstoff unter etwa 15% verdünnen.'] },
          { p: 'Brandforscher fügen eine vierte Seite hinzu, die Kettenreaktion freier Radikale in der Flamme (das Verbrennungstetraeder): manche Löschmittel, etwa Löschpulver, wirken, indem sie sie unterbrechen.' },
        ],
      },
    },
    candle: {
      title: 'Die Kerze unter dem Glas',
      label: 'Die Kerze und das Glas',
      verbs: { cover: 'Deck die Kerze ab', lift: 'Heb das Glas an' },
      gauge: 'Sauerstoff im Glas',
      out: 'aus',
      screen: { kid: 'Sauerstoff im Glas', sci: 'Sauerstoff im Glas, Volumenanteil in %' },
      says: {
        cover: { kid: 'Schau auf die Anzeige: der Sauerstoff sinkt, und die Flamme wird kleiner...', sci: 'Paraffin + O2 → CO2 + H2O: der O2-Anteil fällt von 20,9%.' },
        out: { kid: 'Aus, und es sind noch etwa 16% Sauerstoff im Glas!', sci: 'Erloschen bei etwa 16% O2; CO2 liegt jetzt bei etwa 3%.' },
        lift: { kid: 'Frische Luft strömt herein: zünd sie wieder an!', sci: 'Frische Luft, 20,9% O2: sie kann wieder brennen.' },
      },
      panel: {
        kid: [
          { p: 'Unter dem Glas kann die Kerze nur den Sauerstoff nutzen, der darin eingeschlossen ist. Schau auf die Anzeige: der Sauerstoff sinkt, die Flamme wird kleiner, und dann geht sie aus.' },
          { p: 'Überraschung: sie geht aus, obwohl noch etwa 16% Sauerstoff übrig sind. Eine Kerzenflamme braucht mehr als das, um weiterzubrennen.' },
          { p: 'Heb das Glas an, und frische Luft strömt herein: die Kerze lässt sich wieder anzünden.' },
        ],
        sci: [
          { rows: [['O2 am Anfang', '20,9%'], ['O2, wenn sie ausgeht', 'etwa 16%'], ['CO2 am Ende', 'etwa 3%']] },
          { p: 'Paraffinwachs (ungefähr C25H52) verbrennt zu CO2 und H2O. In einem geschlossenen Glas erlischt die Flamme bei etwa 15 bis 16% O2, wenn sie Wärme nicht mehr schnell genug freisetzen kann, um über ihrer Zündtemperatur zu bleiben.' },
          { p: 'Die klassische Version über Wasser führt in die Irre: das Wasser steigt vor allem, weil das heiße Gas abkühlt und sich zusammenzieht, nicht weil der Sauerstoff verbraucht wird.' },
        ],
      },
    },
    splint: {
      title: 'Die Glimmspanprobe',
      label: 'Der Glimmspan',
      verb: 'Steck den Span ins Reagenzglas',
      tube: 'reiner Sauerstoff',
      screen: { kid: 'der Test auf Sauerstoff', sci: 'glimmender Span flammt in Sauerstoff auf' },
      says: {
        kid: 'Wusch! Er geht in Flammen auf: das Gas im Reagenzglas ist Sauerstoff.',
        sci: 'Positiver Nachweis: der glimmende Span flammt in O2 wieder auf.',
      },
      panel: {
        kid: [
          { p: 'So prüfen Forscher, ob ein Gas Sauerstoff ist. Ein Holzspan, der nur glimmt (ohne Flamme), kommt ins Reagenzglas.' },
          { p: 'Wenn das Gas Sauerstoff ist, geht der Span in Flammen auf! An der Luft (21% Sauerstoff) glimmt er nur; in reinem Sauerstoff brennt er viel schneller.' },
        ],
        sci: [
          { p: 'Die Glimmspanprobe: ein glimmender Span flammt in einem sauerstoffreichen Gas wieder auf.' },
          { p: 'Glimmen ist langsames Brennen an der Oberfläche des Holzes, begrenzt dadurch, wie schnell O2 dorthin gelangt. Mit fast fünfmal so viel O2 wie in Luft wird die Reaktion schneller, gibt schneller Wärme ab, und die Gase, die aus dem heißen Holz austreten, fangen Feuer.' },
          { p: 'Die anderen Gasnachweise aus der Schule: Wasserstoff verbrennt an einem brennenden Span mit einem pfeifenden „Plopp“ (Knallgasprobe); Kohlenstoffdioxid trübt Kalkwasser.' },
        ],
      },
    },
    methane: {
      title: 'Verbrennung, Atom für Atom',
      label: 'Methan verbrennt',
      verbs: { burn: 'Verbrenn das Methan', again: 'Fang von vorn an' },
      screen: { kid: 'Atome gehen nie verloren, nur neu geordnet', sci: '890 kJ pro Mol Methan' },
      count: { C: 'C', H: 'H', O: 'O' },
      says: {
        burn: { kid: 'Die Bindungen brechen, die Atome tauschen die Partner, und heraus kommen Licht und Wärme!', sci: 'Gebrochen: 4 C−H und 2 O=O; gebildet: 2 C=O und 4 O−H. Etwa 800 kJ/mol werden frei (Wasser als Dampf).' },
        again: { kid: 'Methan und Sauerstoff, bereit, wieder zu brennen.', sci: 'Edukte: CH4 + 2 O2.' },
      },
      panel: {
        kid: [
          { p: 'Die blaue Flamme eines Gasherds verbrennt Methan, Erdgas. Schau auf die Atome: die Bindungen brechen, und die Atome tauschen die Partner.' },
          { p: 'Ein Kohlenstoffatom und vier Wasserstoffatome (Methan) plus vier Sauerstoffatome (zwei O2) werden zu einem Kohlenstoffdioxid- und zwei Wassermolekülen. Zähl sie: kein Atom geht verloren, und keins kommt dazu.' },
          { p: 'Die neuen Bindungen sind stärker als die alten, deshalb kommt Energie als Licht und Wärme heraus: das ist die Flamme.' },
        ],
        sci: [
          { big: 'CH4 + 2 O2 → CO2 + 2 H2O', small: 'alle Atome gezählt' },
          { rows: [['Kohlenstoff', '1 → 1'], ['Wasserstoff', '4 → 4'], ['Sauerstoff', '4 → 4'], ['Freigesetzte Energie', '890 kJ/mol (802 kJ/mol mit dem Wasser als Dampf)']] },
          { p: 'Aus mittleren Bindungsenthalpien: gebrochen 4 C−H (je 413) und 2 O=O (je 498), 2648 kJ; gebildet 2 C=O (je 799) und 4 O−H (je 463), 3450 kJ. Etwa 802 kJ/mol werden frei.' },
          { p: 'Lavoisier zeigte in den 1770er-Jahren, dass Verbrennen eine Verbindung mit Sauerstoff ist und dass die Masse erhalten bleibt. Eine blaue Flamme bedeutet vollständige Verbrennung; eine gelbe, rußende Flamme hat zu wenig Sauerstoff und erzeugt Ruß und giftiges Kohlenstoffmonoxid.' },
        ],
      },
    },
    rust: {
      title: 'Rost, ein langsames Brennen',
      label: 'Die drei Nägel',
      verbs: { run: 'Spul die Zeit vor', reset: 'Neue Nägel' },
      tubes: { wet: 'Luft + Wasser', dry: 'trockene Luft', airless: 'Wasser ohne Luft' },
      day: d => (d < 1 ? 'Tag 0' : d === 1 ? '1 Tag' : `${d} Tage`),
      screen: { kid: 'Eisen + Sauerstoff + Wasser', sci: 'Rost: wasserhaltiges Eisen(III)-oxid' },
      says: {
        run: { kid: 'Nur der Nagel mit Luft UND Wasser rostet!', sci: 'Rosten braucht O2 und H2O zugleich: nur in Röhrchen 1 korrodiert der Nagel.' },
        reset: { kid: 'Drei glänzende neue Nägel.', sci: 'Frisches Eisen in jedem Röhrchen.' },
      },
      panel: {
        kid: [
          { p: 'Auch Eisen „brennt“ mit Sauerstoff, aber ganz langsam: es rostet. Rost ist Eisen, verbunden mit Sauerstoff und ein bisschen Wasser.' },
          { p: 'Die drei Röhrchen sind ein klassisches Experiment. Nur der Nagel mit Luft und Wasser rostet. In trockener Luft (mit einem Trockenmittel) oder in abgekochtem Wasser unter Öl (ohne Luft) bleibt er blank.' },
          { p: 'Salz macht es schneller, deshalb rosten Autos am Meer. Taschenwärmer sind schnelles Rosten: Eisenpulver rostet in Minuten und wird heiß!' },
        ],
        sci: [
          { big: '4 Fe + 3 O2 → 2 Fe2O3', small: 'Rost ist die wasserhaltige Form, Fe₂O₃·nH₂O' },
          { p: 'Rosten ist elektrochemisch: wo Wasser das Eisen berührt, gilt Fe → Fe²⁺ + 2e⁻; die Elektronen reduzieren den im Wasser gelösten Sauerstoff, O2 + 2 H2O + 4e⁻ → 4 OH⁻. Salz macht das Wasser leitfähiger und beschleunigt es.' },
          { p: 'Es setzt genauso viel Energie frei wie das Verbrennen desselben Eisens (etwa 824 kJ pro Mol Fe2O3), nur über Monate verteilt. Rost ist porös und blättert ab, sodass neues Eisen frei liegt; das Oxid des Aluminiums dagegen bleibt haften und schützt es.' },
          { p: 'Stahlwolle mit ihrer riesigen Oberfläche brennt an der Luft tatsächlich, mit Funken: dieselbe Reaktion, nur schnell.' },
        ],
      },
    },
  },
}
