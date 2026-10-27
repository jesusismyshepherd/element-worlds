// Every word of the fire wing, in English and European Portuguese, at the two depths (kid: Explorer,
// sci: Scientist). Formulas are written plainly (O2); the panels get real subscripts (kit.chem).
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
}
