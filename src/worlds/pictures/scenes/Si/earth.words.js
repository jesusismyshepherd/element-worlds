// The words of silicon's room in space ("What are the Earth and Moon made of?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Si.js (the easel shows it). `layers` and `moon.rocks`, `moon.match`, `star.sign`
// and `moon.sign` are drawn in 3D: plain text, no subscripts.
export const EARTH_WORDS = {
  en: {
    title: 'Earth, Moon and stardust',
    greet: {
      kid: "Whoa, we're floating in space! In front of us is the Earth, cut open so we can see inside it, with the Moon beside it and a giant star far away. The story of this picture is on the easel beside you.",
      sci: "A viewing deck in space: the Earth cut open with its layers to scale, the Moon at its true size beside it, and a massive star in the distance. The picture's story is on the easel.",
    },
    talk: {
      kid: [
        "I'm in almost every rock under your feet. The crust and the mantle are mostly silicon and oxygen, holding hands with other atoms.",
        'The Earth is a bit like a peach: a thin skin, a thick middle and a hard stone in the centre.',
        "Every silicon atom was made inside a star, long before the Sun was born. I'm older than the Earth!",
      ],
      sci: [
        "Iron, oxygen, silicon and magnesium make up over 90% of the Earth's mass; silicon is third, at about 15%.",
        'In the crust I am 28% of the mass, second only to oxygen at 46%.',
        'About 92% of silicon atoms are silicon-28, the isotope oxygen burning makes; silicon-29 and silicon-30 make up the rest.',
      ],
    },
    layers: {
      surface: 'Surface',
      names: ['Crust', 'Upper mantle', 'Transition zone', 'Lower mantle', 'Outer core', 'Inner core'],
      minerals: ['feldspar, quartz', 'olivine', 'wadsleyite, ringwoodite', 'bridgmanite', 'liquid iron and nickel', 'solid iron and nickel'],
    },
    earth: {
      label: 'The Earth cut open',
      tap: 'Tap a layer',
      down: 'Go deeper',
      up: 'Back to the surface',
      depth: 'Depth',
      title: 'Journey to the centre of the Earth',
      surface: {
        kid: 'Back up on the surface, where the rocks are cold and hard.',
        sci: 'At the surface: 0 km. The centre lies 6371 km below.',
      },
      at: [
        {
          kid: 'The crust: the thin, rocky skin we live on. Compared with the whole Earth it is thinner than the skin of an apple!',
          sci: 'The crust: 35 km thick here (5 to 10 km under the oceans, up to 70 km under high mountains). Silicon is 28% of its mass, after oxygen (46%).',
        },
        {
          kid: 'The upper mantle: hot rock that is mostly olivine, a green mineral of silicon, oxygen, magnesium and iron. It is solid, but it creeps along slowly, a few centimetres a year.',
          sci: 'Upper mantle, down to 410 km: peridotite, about 60% olivine, (Mg,Fe)₂SiO₄. Each silicon sits in a tetrahedron of four oxygens; the rock is solid, yet it creeps a few centimetres a year.',
        },
        {
          kid: 'The transition zone: the same atoms as olivine, squeezed so hard that they pack into new, tighter crystals. They can even hold water!',
          sci: 'Transition zone, 410 to 660 km: olivine turns into wadsleyite at about 14 GPa, then into ringwoodite at about 520 km, each denser. A ringwoodite in a diamond from Brazil, described in 2014, held about 1.5% water by weight.',
        },
        {
          kid: 'The lower mantle: the biggest layer. Its rock is mostly bridgmanite, the commonest mineral on Earth, though it only got its name in 2014.',
          sci: 'Lower mantle, 660 to about 2890 km: bridgmanite, (Mg,Fe)SiO₃, with ferropericlase, (Mg,Fe)O. Here each silicon has six oxygen neighbours; the pressure reaches about 136 GPa at the bottom.',
        },
        {
          kid: 'The outer core: a sea of liquid iron and nickel, thousands of degrees hot. Its swirling makes the Earth a giant magnet, the one your compass feels. No silicon rocks down here!',
          sci: "Outer core, 2890 to 5150 km: liquid iron-nickel with a few per cent of lighter elements (oxygen, sulfur, perhaps silicon). Its convection drives the geodynamo, the Earth's magnetic field.",
        },
        {
          kid: 'The very centre, 6371 km down: a ball of solid iron and nickel, about as hot as the surface of the Sun. The pressure is so huge that it cannot melt.',
          sci: 'Inner core, from 5150 km to the centre at 6371 km: solid iron-nickel, about 1220 km in radius, at roughly 5000 to 6000 °C and about 360 GPa, 3.6 million times the air pressure at the surface.',
        },
      ],
      rows: {
        kid: ['0 to about 35 km', 'to 410 km', 'to 660 km', 'to 2890 km', 'to 5150 km (liquid)', 'to 6371 km, the centre (solid)'],
        sci: [
          '0 to 35 km: feldspars, quartz; basalt under the oceans',
          '35 to 410 km: peridotite (olivine)',
          '410 to 660 km: wadsleyite, ringwoodite',
          '660 to 2890 km: bridgmanite, ferropericlase',
          '2890 to 5150 km: liquid iron-nickel',
          '5150 to 6371 km: solid iron-nickel',
        ],
      },
      panel: {
        kid: [
          'This is the Earth cut open, with every layer drawn at its right size. Tap a layer of the cut, or slide the bar, to send the light down, as far as the centre, 6371 km below your feet. The magnifying glass shows the atoms wherever the light is.',
          'Almost everything between the thin crust and the core is rock made of silicates: silicon and oxygen joined with magnesium and iron. Near the top it is green olivine: Hawaii has a beach of green olivine sand, and the gem peridot is olivine too. Deeper down, the weight of the rock above squeezes the same atoms into tighter crystals. Of every 100 kg of Earth, about 15 kg is silicon, but none of its rock is in the core, which is iron and nickel.',
        ],
        sci: [
          "The layers to scale (mean radius 6371 km). The mantle is about 84% of the Earth's volume and two thirds of its mass. Tap a layer of the cut or slide to move the probe; the lens shows the structure at its depth.",
          "Silicon is about 15% of the Earth's mass (iron 32%, oxygen 30%, magnesium 14%), almost all of it in the mantle's silicates. At about 410 km olivine, (Mg,Fe)₂SiO₄, becomes wadsleyite, at about 520 km ringwoodite; at 660 km (about 23 GPa) ringwoodite breaks down into bridgmanite and ferropericlase, and silicon goes from four oxygen neighbours to six. Bridgmanite was named in 2014, after the high-pressure physicist Percy Bridgman (Nobel Prize 1946), when natural crystals were described from the Tenham meteorite. The core holds no silicates: it is iron-nickel, perhaps with some dissolved silicon.",
        ],
      },
    },
    moon: {
      label: "The Moon's rocks",
      dark: 'Fetch a dark rock',
      pale: 'Fetch a pale rock',
      compare: 'Compare with Earth',
      back: 'Put them back',
      tapMoon: 'Tap the Moon',
      tapSea: 'Tap a dark sea on the Moon',
      tapHigh: 'Tap the bright highlands',
      tapCompare: 'Tap the case to compare',
      tapBack: 'Tap the case to put them back',
      hint: {
        kid: 'First tap the Moon: a dark sea gives you basalt, the bright highlands anorthosite.',
        sci: 'First bring a lunar sample: tap a dark mare for basalt or the bright highlands for anorthosite.',
      },
      title: 'Rocks from the Moon',
      sign: 'Apollo, 1969 to 1972: 382 kg',
      rocks: ['Basalt', 'Anorthosite', 'Earth rock'],
      match: 'Same oxygen',
      says: {
        basalt: {
          kid: 'Here comes a dark rock from one of the Moon’s “seas”. It is basalt: old lava that flooded giant craters. Apollo 11 picked up rocks like it in 1969.',
          sci: 'Mare basalt from the Sea of Tranquillity, where Apollo 11 landed: lava rich in iron and titanium that flooded the impact basins, mostly 3 to 4 billion years ago.',
        },
        anorthosite: {
          kid: 'And a pale rock from the bright highlands: anorthosite, made mostly of a white mineral called feldspar. It is some of the oldest rock on the Moon!',
          sci: "Highland anorthosite, like the rocks Apollo 16 collected in the Descartes highlands: over 90% plagioclase feldspar, mostly anorthite, CaAl₂Si₂O₈. It floated to the top of the young Moon's magma ocean more than 4 billion years ago.",
        },
        earth: {
          kid: "Now a rock from the Earth's mantle. Scientists compared their oxygen, and it matches almost exactly, like the same fingerprint! So the Moon is probably made of Earth stuff.",
          sci: 'The three stable oxygen isotopes, ¹⁶O, ¹⁷O and ¹⁸O, occur in the same proportions in lunar and terrestrial rocks, within a few parts per million; Mars and most meteorites differ clearly.',
        },
        back: {
          kid: 'Back they go. The real Moon rocks are kept safe in a NASA laboratory in Houston.',
          sci: "Most of the Apollo samples are kept in nitrogen-filled cabinets at NASA's Lunar Sample Laboratory, Johnson Space Center, Houston.",
        },
      },
      panel: {
        kid: [
          'The Moon is made of the same kind of rock as the outside of the Earth: silicates, silicon and oxygen joined with metals. The dark patches you see from home are its “seas”, but there is no water in them: they are dark basalt, lava that filled giant craters long ago. The bright parts are highlands of pale anorthosite.',
          'Between 1969 and 1972, six Apollo missions landed twelve astronauts on the Moon, and they brought back 382 kg of rock and dust; the six little lights on the Moon show where they landed. Moon rock and Earth rock have the same oxygen fingerprint. Scientists think the Moon formed from the bits thrown out when a planet about the size of Mars crashed into the young Earth.',
        ],
        sci: [
          'Six Apollo landings (Apollo 11, 12, 14, 15, 16 and 17, 1969 to 1972) returned 382 kg in 2196 samples; the lights mark their sites. The Soviet Luna 16, 20 and 24 robots added about 0.3 kg. Mare basalts cover about 16% of the surface, almost all on the near side; the highlands are anorthosite, the flotation crust of an early magma ocean. Silicon and oxygen make up about two thirds of the mass of both.',
          "Their oxygen isotope ratios (Δ¹⁷O) match the Earth's within a few parts per million, while Mars and most meteorites differ: the main clue, with the Moon's small iron core, for the giant-impact hypothesis, in which a Mars-sized body (Theia) hit the young Earth about 4.5 billion years ago. Drawn here at its true size beside the Earth (radius 1737 km against 6371 km), the real Moon is 384,400 km away, about 30 Earth diameters.",
        ],
      },
    },
    star: {
      label: 'A giant star',
      make: 'Make silicon',
      tap: 'Tap the star',
      title: 'Made in a star',
      sign: 'Where silicon is made',
      says: {
        start: {
          kid: 'Long ago, before the Sun was born, a giant star burned. Deep inside it, oxygen atoms crash together and turn into silicon!',
          sci: 'Oxygen burning in the core at about 2 billion K: ¹⁶O + ¹⁶O → ²⁸Si + ⁴He. It lasts less than a year.',
        },
        boom: {
          kid: 'Boom! The star explodes: a supernova, for a while brighter than a whole galaxy.',
          sci: 'Silicon burning makes an iron core, which collapses in under a second; the rebound and the neutrinos blow the star apart at thousands of kilometres per second.',
        },
        cloud: {
          kid: 'The silicon flies out into space and, millions of years later, joins a cloud of gas and dust.',
          sci: 'The ejecta mix with interstellar gas; silicon condenses into grains of silicate dust.',
        },
        disc: {
          kid: "The cloud shrinks and spins into a disc: a new Sun in the middle and rocky planets around it. That's how our Earth was made, out of star stuff!",
          sci: 'About 4.6 billion years ago a cloud like this collapsed into the Sun and a disc, where silicate dust stuck together into planetesimals and then rocky planets.',
        },
      },
      panel: {
        kid: [
          'Most of the silicon on Earth, in sand, in rocks and in the chips of computers, was made inside giant stars that lived and died before the Sun was born. A giant star is like an onion: near its end, layer after layer burns into heavier elements, hydrogen into helium, helium into carbon and oxygen, and deep inside, oxygen into silicon.',
          'Then the silicon burns into iron, and that is the end: the core collapses and the star explodes. The explosion throws the silicon out into space, where it drifted for millions of years into the cloud that our Sun and planets grew from. The oxygen you breathe and the iron in your blood were made in stars too.',
        ],
        sci: [
          'Stars of more than about 8 solar masses burn hydrogen, helium, carbon, neon, oxygen and finally silicon in their cores, each stage hotter and shorter. Oxygen burning, at about 2 billion K, fuses ¹⁶O + ¹⁶O → ²⁸Si + ⁴He (with other products, such as phosphorus and sulfur); silicon burning, lasting about a day, builds iron-group nuclei, mostly nickel-56, until the core can release no more energy and collapses.',
          "The supernova's shock adds explosive oxygen burning and throws the layers out; the silicon condenses into silicate dust. Most of the Solar System's silicon came from such core-collapse supernovae, much of the rest from exploding white dwarfs (type Ia). Silicon-28 is 92.2% of all silicon; grains of silicon carbide in meteorites are real stardust, older than the Sun.",
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Terra, Lua e poeira de estrelas',
    greet: {
      kid: 'Uau, estamos a flutuar no espaço! À nossa frente está a Terra, cortada para vermos o que tem lá dentro, com a Lua ao lado e uma estrela gigante ao longe. A história desta imagem está no cavalete ao teu lado.',
      sci: 'Um miradouro no espaço: a Terra cortada, com as camadas à escala, a Lua ao lado no seu tamanho real e, ao longe, uma estrela de grande massa. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Estou em quase todas as rochas debaixo dos teus pés. A crosta e o manto são feitos sobretudo de silício e oxigénio, de mãos dadas com outros átomos.',
        'A Terra é um pouco como um pêssego: uma casca fina, um meio grosso e um caroço duro no centro.',
        'Cada átomo de silício foi feito dentro de uma estrela, muito antes de o Sol nascer. Sou mais velho do que a Terra!',
      ],
      sci: [
        'O ferro, o oxigénio, o silício e o magnésio são mais de 90% da massa da Terra; o silício é o terceiro, com cerca de 15%.',
        'Na crosta sou 28% da massa, só atrás do oxigénio, com 46%.',
        'Cerca de 92% dos átomos de silício são silício-28, o isótopo que a queima do oxigénio produz; o silício-29 e o silício-30 são o resto.',
      ],
    },
    layers: {
      surface: 'Superfície',
      names: ['Crosta', 'Manto superior', 'Zona de transição', 'Manto inferior', 'Núcleo externo', 'Núcleo interno'],
      minerals: ['feldspato, quartzo', 'olivina', 'wadsleyite, ringwoodite', 'bridgmanite', 'ferro e níquel líquidos', 'ferro e níquel sólidos'],
    },
    earth: {
      label: 'A Terra cortada',
      tap: 'Toca numa camada',
      down: 'Descer mais',
      up: 'Voltar à superfície',
      depth: 'Profundidade',
      title: 'Viagem ao centro da Terra',
      surface: {
        kid: 'De volta à superfície, onde as rochas são frias e duras.',
        sci: 'À superfície: 0 km. O centro fica 6371 km mais abaixo.',
      },
      at: [
        {
          kid: 'A crosta: a pele fina de rocha onde vivemos. Comparada com a Terra inteira, é mais fina do que a casca de uma maçã!',
          sci: 'A crosta: aqui com 35 km de espessura (5 a 10 km debaixo dos oceanos, até 70 km debaixo das montanhas altas). O silício é 28% da sua massa, depois do oxigénio (46%).',
        },
        {
          kid: 'O manto superior: rocha quente feita sobretudo de olivina, um mineral verde de silício, oxigénio, magnésio e ferro. É sólido, mas desliza devagarinho, alguns centímetros por ano.',
          sci: 'Manto superior, até aos 410 km: peridotito, com cerca de 60% de olivina, (Mg,Fe)₂SiO₄. Cada silício está num tetraedro de quatro oxigénios; a rocha é sólida, mas flui alguns centímetros por ano.',
        },
        {
          kid: 'A zona de transição: os mesmos átomos da olivina, tão apertados que se arrumam em cristais novos, mais compactos. Até conseguem guardar água!',
          sci: 'Zona de transição, dos 410 aos 660 km: a olivina passa a wadsleyite a cerca de 14 GPa e depois a ringwoodite, por volta dos 520 km, cada uma mais densa. Uma ringwoodite num diamante do Brasil, descrita em 2014, tinha cerca de 1,5% de água em massa.',
        },
        {
          kid: 'O manto inferior: a camada maior. A sua rocha é sobretudo bridgmanite, o mineral mais comum da Terra, que só recebeu nome em 2014.',
          sci: 'Manto inferior, dos 660 até cerca dos 2890 km: bridgmanite, (Mg,Fe)SiO₃, com ferropericlase, (Mg,Fe)O. Aqui cada silício tem seis oxigénios vizinhos; a pressão chega a cerca de 136 GPa no fundo.',
        },
        {
          kid: 'O núcleo externo: um mar de ferro e níquel líquidos, a milhares de graus. Ao rodopiar, faz da Terra um íman gigante, o que a tua bússola sente. Aqui em baixo não há rochas de silício!',
          sci: 'Núcleo externo, dos 2890 aos 5150 km: ferro e níquel líquidos com alguns por cento de elementos mais leves (oxigénio, enxofre, talvez silício). A sua convecção alimenta o geodínamo, o campo magnético da Terra.',
        },
        {
          kid: 'O centro, a 6371 km de profundidade: uma bola de ferro e níquel sólidos, mais ou menos tão quente como a superfície do Sol. A pressão é tão grande que não consegue derreter.',
          sci: 'Núcleo interno, dos 5150 km até ao centro, a 6371 km: ferro e níquel sólidos, com cerca de 1220 km de raio, a uns 5000 a 6000 °C e cerca de 360 GPa, 3,6 milhões de vezes a pressão do ar à superfície.',
        },
      ],
      rows: {
        kid: ['de 0 a cerca de 35 km', 'até aos 410 km', 'até aos 660 km', 'até aos 2890 km', 'até aos 5150 km (líquido)', 'até aos 6371 km, o centro (sólido)'],
        sci: [
          '0 a 35 km: feldspatos, quartzo; basalto sob os oceanos',
          '35 a 410 km: peridotito (olivina)',
          '410 a 660 km: wadsleyite, ringwoodite',
          '660 a 2890 km: bridgmanite, ferropericlase',
          '2890 a 5150 km: ferro-níquel líquido',
          '5150 a 6371 km: ferro-níquel sólido',
        ],
      },
      panel: {
        kid: [
          'Esta é a Terra cortada, com cada camada desenhada no tamanho certo. Toca numa camada do corte, ou desliza a barra, para mandar a luz lá para baixo, até ao centro, 6371 km debaixo dos teus pés. A lupa mostra os átomos onde quer que a luz esteja.',
          'Quase tudo entre a crosta fina e o núcleo é rocha feita de silicatos: silício e oxigénio unidos ao magnésio e ao ferro. Perto de cima é olivina verde: no Havai há uma praia de areia verde de olivina, e a pedra preciosa peridoto também é olivina. Mais abaixo, o peso da rocha por cima aperta os mesmos átomos em cristais mais compactos. Em cada 100 kg de Terra, cerca de 15 kg são silício, mas nenhuma das suas rochas está no núcleo, que é de ferro e níquel.',
        ],
        sci: [
          'As camadas à escala (raio médio de 6371 km). O manto é cerca de 84% do volume da Terra e dois terços da sua massa. Toca numa camada do corte ou desliza para mover a sonda; a lupa mostra a estrutura à profundidade onde ela está.',
          'O silício é cerca de 15% da massa da Terra (ferro 32%, oxigénio 30%, magnésio 14%), quase todo nos silicatos do manto. A cerca de 410 km a olivina, (Mg,Fe)₂SiO₄, passa a wadsleyite e a cerca de 520 km a ringwoodite; aos 660 km (cerca de 23 GPa) a ringwoodite decompõe-se em bridgmanite e ferropericlase, e o silício passa de quatro oxigénios vizinhos para seis. A bridgmanite recebeu nome em 2014, em honra do físico das altas pressões Percy Bridgman (Prémio Nobel de 1946), quando se descreveram cristais naturais no meteorito de Tenham. O núcleo não tem silicatos: é de ferro e níquel, talvez com algum silício dissolvido.',
        ],
      },
    },
    moon: {
      label: 'As rochas da Lua',
      dark: 'Trazer uma rocha escura',
      pale: 'Trazer uma rocha clara',
      compare: 'Comparar com a Terra',
      back: 'Devolvê-las',
      tapMoon: 'Toca na Lua',
      tapSea: 'Toca num mar escuro da Lua',
      tapHigh: 'Toca nas terras altas claras',
      tapCompare: 'Toca na vitrina para comparar',
      tapBack: 'Toca na vitrina para as devolver',
      hint: {
        kid: 'Primeiro toca na Lua: um mar escuro dá-te basalto, as terras altas claras dão anortosito.',
        sci: 'Primeiro traz uma amostra lunar: toca num mar escuro para basalto ou nas terras altas claras para anortosito.',
      },
      title: 'Rochas da Lua',
      sign: 'Apollo, 1969 a 1972: 382 kg',
      rocks: ['Basalto', 'Anortosito', 'Rocha da Terra'],
      match: 'O mesmo oxigénio',
      says: {
        basalt: {
          kid: 'Aí vem uma rocha escura de um dos «mares» da Lua. É basalto: lava antiga que inundou crateras gigantes. A Apollo 11 apanhou rochas assim em 1969.',
          sci: 'Basalto dos mares, do Mar da Tranquilidade, onde a Apollo 11 alunou: lava rica em ferro e titânio que inundou as bacias de impacto, quase toda há 3 a 4 mil milhões de anos.',
        },
        anorthosite: {
          kid: 'E uma rocha clara das terras altas brilhantes: anortosito, feito sobretudo de um mineral branco chamado feldspato. É das rochas mais antigas da Lua!',
          sci: 'Anortosito das terras altas, como as rochas que a Apollo 16 recolheu nas terras altas de Descartes: mais de 90% de feldspato plagioclase, sobretudo anortite, CaAl₂Si₂O₈. Subiu ao cimo do oceano de magma da Lua jovem há mais de 4 mil milhões de anos.',
        },
        earth: {
          kid: 'Agora uma rocha do manto da Terra. Os cientistas compararam o oxigénio delas e é quase igual, como a mesma impressão digital! Por isso a Lua deve ser feita de material da Terra.',
          sci: 'Os três isótopos estáveis do oxigénio, ¹⁶O, ¹⁷O e ¹⁸O, aparecem nas mesmas proporções nas rochas lunares e terrestres, com diferenças de poucas partes por milhão; Marte e a maioria dos meteoritos são claramente diferentes.',
        },
        back: {
          kid: 'De volta para casa. As verdadeiras rochas da Lua estão guardadas num laboratório da NASA em Houston.',
          sci: 'A maior parte das amostras Apollo está guardada em armários cheios de azoto no Laboratório de Amostras Lunares da NASA, no Centro Espacial Johnson, em Houston.',
        },
      },
      panel: {
        kid: [
          'A Lua é feita do mesmo tipo de rocha que a parte de fora da Terra: silicatos, silício e oxigénio unidos a metais. As manchas escuras que vês de casa são os seus «mares», mas não têm água: são basalto escuro, lava que encheu crateras gigantes há muito tempo. As partes claras são terras altas de anortosito.',
          'Entre 1969 e 1972, seis missões Apollo levaram doze astronautas à Lua, e eles trouxeram 382 kg de rochas e poeira; as seis luzinhas na Lua mostram onde alunaram. As rochas da Lua e da Terra têm a mesma impressão digital de oxigénio. Os cientistas pensam que a Lua se formou com os pedaços atirados para o espaço quando um planeta do tamanho de Marte chocou com a Terra jovem.',
        ],
        sci: [
          'Seis alunagens Apollo (Apollo 11, 12, 14, 15, 16 e 17, de 1969 a 1972) trouxeram 382 kg em 2196 amostras; as luzes marcam os locais. As sondas soviéticas Luna 16, 20 e 24 juntaram cerca de 0,3 kg. Os basaltos dos mares cobrem cerca de 16% da superfície, quase todos na face visível; as terras altas são de anortosito, a crosta que flutuou num antigo oceano de magma. O silício e o oxigénio são cerca de dois terços da massa de ambos.',
          'As razões dos seus isótopos de oxigénio (Δ¹⁷O) coincidem com as da Terra com diferenças de poucas partes por milhão, enquanto Marte e a maioria dos meteoritos diferem: é a principal pista, com o pequeno núcleo de ferro da Lua, a favor da hipótese do impacto gigante, em que um corpo do tamanho de Marte (Teia) atingiu a Terra jovem há cerca de 4,5 mil milhões de anos. Aqui desenhada no tamanho real ao lado da Terra (raio de 1737 km contra 6371 km), a Lua verdadeira está a 384 400 km, cerca de 30 diâmetros terrestres.',
        ],
      },
    },
    star: {
      label: 'Uma estrela gigante',
      make: 'Fazer silício',
      tap: 'Toca na estrela',
      title: 'Feito numa estrela',
      sign: 'Onde nasce o silício',
      says: {
        start: {
          kid: 'Há muito tempo, antes de o Sol nascer, ardia uma estrela gigante. Lá bem no fundo, os átomos de oxigénio chocam uns com os outros e transformam-se em silício!',
          sci: 'Queima do oxigénio no núcleo, a cerca de 2 mil milhões de K: ¹⁶O + ¹⁶O → ²⁸Si + ⁴He. Dura menos de um ano.',
        },
        boom: {
          kid: 'Bum! A estrela explode: uma supernova, durante um tempo mais brilhante do que uma galáxia inteira.',
          sci: 'A queima do silício faz um núcleo de ferro, que colapsa em menos de um segundo; o ressalto e os neutrinos desfazem a estrela a milhares de quilómetros por segundo.',
        },
        cloud: {
          kid: 'O silício voa pelo espaço e, milhões de anos depois, junta-se a uma nuvem de gás e poeira.',
          sci: 'Os restos misturam-se com o gás interestelar; o silício condensa-se em grãos de poeira de silicatos.',
        },
        disc: {
          kid: 'A nuvem encolhe e gira até ficar um disco: um Sol novo no meio e planetas de rocha à volta. Foi assim que a nossa Terra se fez, de poeira de estrelas!',
          sci: 'Há cerca de 4,6 mil milhões de anos uma nuvem assim colapsou no Sol e num disco, onde a poeira de silicatos se juntou em planetesimais e depois em planetas rochosos.',
        },
      },
      panel: {
        kid: [
          'A maior parte do silício da Terra, na areia, nas rochas e nos chips dos computadores, foi feita dentro de estrelas gigantes que viveram e morreram antes de o Sol nascer. Uma estrela gigante é como uma cebola: perto do fim, camada a camada, queima elementos cada vez mais pesados, o hidrogénio em hélio, o hélio em carbono e oxigénio e, lá bem no fundo, o oxigénio em silício.',
          'Depois o silício queima-se em ferro, e é o fim: o núcleo colapsa e a estrela explode. A explosão atira o silício para o espaço, onde andou milhões de anos até chegar à nuvem de onde nasceram o nosso Sol e os planetas. O oxigénio que respiras e o ferro do teu sangue também foram feitos em estrelas.',
        ],
        sci: [
          'As estrelas com mais de cerca de 8 massas solares queimam no núcleo hidrogénio, hélio, carbono, néon, oxigénio e por fim silício, cada fase mais quente e mais curta. A queima do oxigénio, a cerca de 2 mil milhões de K, funde ¹⁶O + ¹⁶O → ²⁸Si + ⁴He (com outros produtos, como fósforo e enxofre); a queima do silício, que dura cerca de um dia, forma núcleos do grupo do ferro, sobretudo níquel-56, até o núcleo já não conseguir libertar energia e colapsar.',
          'A onda de choque da supernova junta uma queima explosiva do oxigénio e atira as camadas para fora; o silício condensa-se em poeira de silicatos. A maior parte do silício do Sistema Solar veio destas supernovas de colapso do núcleo, e boa parte do resto de anãs brancas que explodiram (tipo Ia). O silício-28 é 92,2% de todo o silício; os grãos de carboneto de silício dos meteoritos são verdadeira poeira de estrelas, mais antiga do que o Sol.',
        ],
      },
    },
  },
  pl: {
    title: 'Ziemia, Księżyc i gwiezdny pył',
    greet: {
      kid: 'Ojej, unosimy się w kosmosie! Przed nami jest Ziemia, rozcięta tak, że widać jej wnętrze, obok niej Księżyc, a daleko olbrzymia gwiazda. Historia tego obrazka jest na sztaludze obok ciebie.',
      sci: 'Taras widokowy w kosmosie: rozcięta Ziemia z warstwami w skali, obok Księżyc w prawdziwej wielkości, a w oddali masywna gwiazda. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Jestem w prawie każdej skale pod twoimi stopami. Skorupa i płaszcz to głównie krzem i tlen, trzymające się za ręce z innymi atomami.',
        'Ziemia jest trochę jak brzoskwinia: cienka skórka, gruby miąższ i twarda pestka w samym środku.',
        'Każdy atom krzemu powstał we wnętrzu gwiazdy, długo przed narodzinami Słońca. Jestem starszy od Ziemi!',
      ],
      sci: [
        'Żelazo, tlen, krzem i magnez stanowią ponad 90% masy Ziemi; krzem jest trzeci, z około 15%.',
        'W skorupie stanowię 28% masy, ustępując tylko tlenowi z 46%.',
        'Około 92% atomów krzemu to krzem-28, izotop powstający w spalaniu tlenu; resztę stanowią krzem-29 i krzem-30.',
      ],
    },
    layers: {
      surface: 'Powierzchnia',
      names: ['Skorupa', 'Płaszcz górny', 'Strefa przejściowa', 'Płaszcz dolny', 'Jądro zewnętrzne', 'Jądro wewnętrzne'],
      minerals: ['skaleń, kwarc', 'oliwin', 'wadsleyit, ringwoodyt', 'bridgmanit', 'ciekłe żelazo i nikiel', 'stałe żelazo i nikiel'],
    },
    earth: {
      label: 'Ziemia w przekroju',
      tap: 'Dotknij warstwy',
      down: 'Zjedź głębiej',
      up: 'Wróć na powierzchnię',
      depth: 'Głębokość',
      title: 'Podróż do wnętrza Ziemi',
      surface: {
        kid: 'Z powrotem na powierzchni, gdzie skały są zimne i twarde.',
        sci: 'Na powierzchni: 0 km. Środek leży 6371 km niżej.',
      },
      at: [
        {
          kid: 'Skorupa: cienka, skalista skórka, na której żyjemy. W porównaniu z całą Ziemią jest cieńsza niż skórka jabłka!',
          sci: 'Skorupa: tutaj 35 km grubości (5 do 10 km pod oceanami, do 70 km pod wysokimi górami). Krzem stanowi 28% jej masy, po tlenie (46%).',
        },
        {
          kid: 'Płaszcz górny: gorąca skała, głównie oliwin, zielony minerał z krzemu, tlenu, magnezu i żelaza. Jest stały, ale powoli pełznie, kilka centymetrów na rok.',
          sci: 'Płaszcz górny, do 410 km: perydotyt, w około 60% oliwin, (Mg,Fe)₂SiO₄. Każdy atom krzemu siedzi w czworościanie z czterech atomów tlenu; skała jest stała, a jednak płynie kilka centymetrów na rok.',
        },
        {
          kid: 'Strefa przejściowa: te same atomy co w oliwinie, ściśnięte tak mocno, że układają się w nowe, ciaśniejsze kryształy. Potrafią nawet przechowywać wodę!',
          sci: 'Strefa przejściowa, od 410 do 660 km: oliwin przechodzi w wadsleyit przy około 14 GPa, a potem, na około 520 km, w ringwoodyt, każdy gęstszy. Ringwoodyt w diamencie z Brazylii, opisany w 2014 roku, zawierał około 1,5% wody wagowo.',
        },
        {
          kid: 'Płaszcz dolny: największa warstwa. Jej skała to głównie bridgmanit, najpospolitszy minerał na Ziemi, choć nazwę dostał dopiero w 2014 roku.',
          sci: 'Płaszcz dolny, od 660 do około 2890 km: bridgmanit, (Mg,Fe)SiO₃, z ferroperyklazem, (Mg,Fe)O. Tutaj każdy atom krzemu ma sześciu sąsiadów tlenowych; ciśnienie na dnie sięga około 136 GPa.',
        },
        {
          kid: 'Jądro zewnętrzne: morze ciekłego żelaza i niklu, gorące na tysiące stopni. Jego wirowanie robi z Ziemi olbrzymi magnes, ten, który czuje twój kompas. Tu na dole nie ma skał z krzemu!',
          sci: 'Jądro zewnętrzne, od 2890 do 5150 km: ciekły stop żelaza i niklu z kilkoma procentami lżejszych pierwiastków (tlen, siarka, może krzem). Jego konwekcja napędza geodynamo, pole magnetyczne Ziemi.',
        },
        {
          kid: 'Sam środek, 6371 km w głąb: kula ze stałego żelaza i niklu, mniej więcej tak gorąca jak powierzchnia Słońca. Ciśnienie jest tak ogromne, że nie może się stopić.',
          sci: 'Jądro wewnętrzne, od 5150 km do środka na 6371 km: stały stop żelaza i niklu o promieniu około 1220 km, w temperaturze około 5000 do 6000 °C i pod ciśnieniem około 360 GPa, 3,6 miliona razy większym niż ciśnienie powietrza na powierzchni.',
        },
      ],
      rows: {
        kid: ['od 0 do około 35 km', 'do 410 km', 'do 660 km', 'do 2890 km', 'do 5150 km (ciekłe)', 'do 6371 km, środek (stałe)'],
        sci: [
          '0 do 35 km: skalenie, kwarc; bazalt pod oceanami',
          '35 do 410 km: perydotyt (oliwin)',
          '410 do 660 km: wadsleyit, ringwoodyt',
          '660 do 2890 km: bridgmanit, ferroperyklaz',
          '2890 do 5150 km: ciekły stop żelaza i niklu',
          '5150 do 6371 km: stały stop żelaza i niklu',
        ],
      },
      panel: {
        kid: [
          'To jest Ziemia w przekroju, a każda warstwa ma tu właściwą grubość. Dotknij warstwy na przekroju albo przesuń suwak, żeby wysłać światełko w głąb, aż do środka, 6371 km pod twoimi stopami. Lupa pokazuje atomy tam, gdzie jest światełko.',
          'Prawie wszystko między cienką skorupą a jądrem to skały z krzemianów: krzemu i tlenu połączonych z magnezem i żelazem. Blisko powierzchni to zielony oliwin: na Hawajach jest plaża z zielonego piasku oliwinowego, a kamień szlachetny perydot to też oliwin. Głębiej ciężar skał powyżej ściska te same atomy w ciaśniejsze kryształy. Na każde 100 kg Ziemi około 15 kg to krzem, ale w jądrze nie ma jego skał: jądro jest z żelaza i niklu.',
        ],
        sci: [
          'Warstwy w skali (średni promień 6371 km). Płaszcz to około 84% objętości Ziemi i dwie trzecie jej masy. Dotknij warstwy na przekroju albo przesuń suwak, żeby przesunąć sondę; lupa pokazuje strukturę na jej głębokości.',
          'Krzem stanowi około 15% masy Ziemi (żelazo 32%, tlen 30%, magnez 14%), prawie w całości w krzemianach płaszcza. Na około 410 km oliwin, (Mg,Fe)₂SiO₄, przechodzi w wadsleyit, na około 520 km w ringwoodyt; na 660 km (około 23 GPa) ringwoodyt rozpada się na bridgmanit i ferroperyklaz, a krzem zamiast czterech sąsiadów tlenowych ma sześciu. Bridgmanit nazwano w 2014 roku na cześć fizyka wysokich ciśnień Percy’ego Bridgmana (Nagroda Nobla w 1946 roku), gdy opisano naturalne kryształy z meteorytu Tenham. W jądrze nie ma krzemianów: to żelazo i nikiel, może z odrobiną rozpuszczonego krzemu.',
        ],
      },
    },
    moon: {
      label: 'Skały z Księżyca',
      dark: 'Przynieś ciemną skałę',
      pale: 'Przynieś jasną skałę',
      compare: 'Porównaj z Ziemią',
      back: 'Odłóż je z powrotem',
      tapMoon: 'Dotknij Księżyca',
      tapSea: 'Dotknij ciemnego morza na Księżycu',
      tapHigh: 'Dotknij jasnych wyżyn',
      tapCompare: 'Dotknij gabloty, żeby porównać',
      tapBack: 'Dotknij gabloty, żeby je odłożyć',
      hint: {
        kid: 'Najpierw dotknij Księżyca: ciemne morze da ci bazalt, a jasne wyżyny anortozyt.',
        sci: 'Najpierw przynieś próbkę z Księżyca: dotknij ciemnego morza, żeby dostać bazalt, albo jasnych wyżyn, żeby dostać anortozyt.',
      },
      title: 'Skały z Księżyca',
      sign: 'Apollo, 1969 do 1972: 382 kg',
      rocks: ['Bazalt', 'Anortozyt', 'Skała z Ziemi'],
      match: 'Ten sam tlen',
      says: {
        basalt: {
          kid: 'Leci ciemna skała z jednego z księżycowych „mórz”. To bazalt: dawna lawa, która zalała olbrzymie kratery. Apollo 11 zebrał takie skały w 1969 roku.',
          sci: 'Bazalt morski z Morza Spokoju, gdzie wylądował Apollo 11: lawa bogata w żelazo i tytan, która zalała baseny uderzeniowe, przeważnie 3 do 4 miliardów lat temu.',
        },
        anorthosite: {
          kid: 'I jasna skała z jasnych wyżyn: anortozyt, zbudowany głównie z białego minerału zwanego skaleniem. To jedna z najstarszych skał na Księżycu!',
          sci: 'Anortozyt z wyżyn, taki jak skały zebrane przez Apollo 16 na wyżynie Kartezjusza (Descartes): ponad 90% skalenia plagioklazowego, głównie anortytu, CaAl₂Si₂O₈. Wypłynął na powierzchnię oceanu magmy młodego Księżyca ponad 4 miliardy lat temu.',
        },
        earth: {
          kid: 'A teraz skała z płaszcza Ziemi. Naukowcy porównali ich tlen i jest prawie taki sam, jak ten sam odcisk palca! Więc Księżyc jest pewnie zrobiony z ziemskiego materiału.',
          sci: 'Trzy trwałe izotopy tlenu, ¹⁶O, ¹⁷O i ¹⁸O, występują w skałach księżycowych i ziemskich w tych samych proporcjach, z dokładnością do kilku części na milion; Mars i większość meteorytów wyraźnie się różnią.',
        },
        back: {
          kid: 'Wracają na miejsce. Prawdziwe skały z Księżyca są przechowywane w laboratorium NASA w Houston.',
          sci: 'Większość próbek z misji Apollo przechowuje się w szafach wypełnionych azotem w Laboratorium Próbek Księżycowych NASA, w Centrum Kosmicznym imienia Johnsona w Houston.',
        },
      },
      panel: {
        kid: [
          'Księżyc jest zbudowany z tego samego rodzaju skał co zewnętrzna część Ziemi: z krzemianów, czyli krzemu i tlenu połączonych z metalami. Ciemne plamy, które widzisz z domu, to jego „morza”, ale nie ma w nich wody: to ciemny bazalt, lawa, która dawno temu wypełniła olbrzymie kratery. Jasne części to wyżyny z jasnego anortozytu.',
          'Od 1969 do 1972 roku sześć misji Apollo zawiozło na Księżyc dwunastu astronautów, a oni przywieźli 382 kg skał i pyłu; sześć małych światełek na Księżycu pokazuje, gdzie wylądowali. Skały z Księżyca i z Ziemi mają ten sam tlenowy odcisk palca. Naukowcy uważają, że Księżyc powstał z okruchów wyrzuconych, gdy planeta wielkości Marsa zderzyła się z młodą Ziemią.',
        ],
        sci: [
          'Sześć lądowań Apollo (Apollo 11, 12, 14, 15, 16 i 17, od 1969 do 1972 roku) przywiozło 382 kg w 2196 próbkach; światełka oznaczają miejsca lądowań. Radzieckie sondy Łuna 16, 20 i 24 dodały około 0,3 kg. Bazalty morskie pokrywają około 16% powierzchni, prawie w całości po widocznej stronie; wyżyny to anortozyt, skorupa, która wypłynęła na wczesnym oceanie magmy. Krzem i tlen stanowią około dwóch trzecich masy obu.',
          'Ich stosunki izotopów tlenu (Δ¹⁷O) zgadzają się z ziemskimi z dokładnością do kilku części na milion, a Mars i większość meteorytów się różnią: to główna wskazówka, obok małego żelaznego jądra Księżyca, na rzecz hipotezy wielkiego zderzenia, w której ciało wielkości Marsa (Theia) uderzyło w młodą Ziemię około 4,5 miliarda lat temu. Narysowany tu w prawdziwej wielkości obok Ziemi (promień 1737 km wobec 6371 km), prawdziwy Księżyc krąży 384 400 km od Ziemi, około 30 jej średnic.',
        ],
      },
    },
    star: {
      label: 'Olbrzymia gwiazda',
      make: 'Zrób krzem',
      tap: 'Dotknij gwiazdy',
      title: 'Zrodzony w gwieździe',
      sign: 'Tu powstaje krzem',
      says: {
        start: {
          kid: 'Dawno temu, zanim narodziło się Słońce, świeciła olbrzymia gwiazda. Głęboko w jej wnętrzu atomy tlenu zderzają się i zamieniają w krzem!',
          sci: 'Spalanie tlenu w jądrze, w około 2 miliardach K: ¹⁶O + ¹⁶O → ²⁸Si + ⁴He. Trwa krócej niż rok.',
        },
        boom: {
          kid: 'Bum! Gwiazda wybucha: to supernowa, przez jakiś czas jaśniejsza niż cała galaktyka.',
          sci: 'Spalanie krzemu tworzy żelazne jądro, które zapada się w niecałą sekundę; odbicie i neutrina rozrywają gwiazdę z prędkością tysięcy kilometrów na sekundę.',
        },
        cloud: {
          kid: 'Krzem leci w kosmos i miliony lat później trafia do obłoku gazu i pyłu.',
          sci: 'Wyrzucona materia miesza się z gazem międzygwiazdowym; krzem kondensuje w ziarna pyłu krzemianowego.',
        },
        disc: {
          kid: 'Obłok kurczy się i wiruje, aż staje się dyskiem: w środku nowe Słońce, a dookoła skaliste planety. Tak powstała nasza Ziemia, z gwiezdnego pyłu!',
          sci: 'Około 4,6 miliarda lat temu taki obłok zapadł się w Słońce i dysk, w którym pył krzemianowy zlepiał się w planetozymale, a potem w planety skaliste.',
        },
      },
      panel: {
        kid: [
          'Większość krzemu na Ziemi, w piasku, w skałach i w komputerowych chipach, powstała we wnętrzu olbrzymich gwiazd, które żyły i zgasły, zanim narodziło się Słońce. Olbrzymia gwiazda jest jak cebula: pod koniec życia warstwa po warstwie spala coraz cięższe pierwiastki, wodór w hel, hel w węgiel i tlen, a głęboko w środku tlen w krzem.',
          'Potem krzem spala się w żelazo i to już koniec: jądro się zapada, a gwiazda wybucha. Wybuch wyrzuca krzem w kosmos, gdzie przez miliony lat dryfował, aż trafił do obłoku, z którego powstały nasze Słońce i planety. Tlen, którym oddychasz, i żelazo w twojej krwi też powstały w gwiazdach.',
        ],
        sci: [
          'Gwiazdy o masie większej niż około 8 mas Słońca spalają w jądrze kolejno wodór, hel, węgiel, neon, tlen i wreszcie krzem, a każdy etap jest gorętszy i krótszy. Spalanie tlenu, w około 2 miliardach K, łączy ¹⁶O + ¹⁶O → ²⁸Si + ⁴He (z innymi produktami, takimi jak fosfor i siarka); spalanie krzemu, trwające około doby, tworzy jądra z grupy żelaza, głównie nikiel-56, aż jądro gwiazdy nie może już uwolnić energii i się zapada.',
          'Fala uderzeniowa supernowej dokłada wybuchowe spalanie tlenu i wyrzuca warstwy na zewnątrz; krzem kondensuje w pył krzemianowy. Większość krzemu Układu Słonecznego pochodzi z takich supernowych z kolapsu jądra, a sporo reszty z wybuchających białych karłów (typ Ia). Krzem-28 to 92,2% całego krzemu; ziarna węglika krzemu w meteorytach to prawdziwy gwiezdny pył, starszy od Słońca.',
        ],
      },
    },
  },
  de: {
    title: 'Erde, Mond und Sternenstaub',
    greet: {
      kid: 'Wow, wir schweben im Weltraum! Vor uns ist die Erde, aufgeschnitten, damit wir hineinschauen können, daneben der Mond und weit weg ein Riesenstern. Die Geschichte dieses Bildes steht auf der Staffelei neben dir.',
      sci: 'Eine Aussichtsplattform im Weltraum: die aufgeschnittene Erde mit maßstabsgetreuen Schichten, daneben der Mond in seiner wahren Größe und in der Ferne ein massereicher Stern. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Ich stecke in fast jedem Gestein unter deinen Füßen. Kruste und Mantel bestehen vor allem aus Silicium und Sauerstoff, die sich mit anderen Atomen an den Händen halten.',
        'Die Erde ist ein bisschen wie ein Pfirsich: eine dünne Haut, ein dickes Fruchtfleisch und ein harter Kern in der Mitte.',
        'Jedes Siliciumatom ist in einem Stern entstanden, lange bevor die Sonne geboren wurde. Ich bin älter als die Erde!',
      ],
      sci: [
        'Eisen, Sauerstoff, Silicium und Magnesium machen über 90% der Erdmasse aus; Silicium ist mit etwa 15% das dritthäufigste.',
        'In der Kruste bin ich 28% der Masse, nur Sauerstoff hat mit 46% mehr.',
        'Etwa 92% der Siliciumatome sind Silicium-28, das Isotop, das beim Sauerstoffbrennen entsteht; Silicium-29 und Silicium-30 sind der Rest.',
      ],
    },
    layers: {
      surface: 'Oberfläche',
      names: ['Kruste', 'Oberer Mantel', 'Übergangszone', 'Unterer Mantel', 'Äußerer Kern', 'Innerer Kern'],
      minerals: ['Feldspat, Quarz', 'Olivin', 'Wadsleyit, Ringwoodit', 'Bridgmanit', 'flüssiges Eisen und Nickel', 'festes Eisen und Nickel'],
    },
    earth: {
      label: 'Die aufgeschnittene Erde',
      tap: 'Tippe auf eine Schicht',
      down: 'Tiefer hinab',
      up: 'Zurück an die Oberfläche',
      depth: 'Tiefe',
      title: 'Reise zum Mittelpunkt der Erde',
      surface: {
        kid: 'Wieder oben an der Oberfläche, wo das Gestein kalt und hart ist.',
        sci: 'An der Oberfläche: 0 km. Der Mittelpunkt liegt 6371 km tiefer.',
      },
      at: [
        {
          kid: 'Die Kruste: die dünne, felsige Haut, auf der wir leben. Im Vergleich zur ganzen Erde ist sie dünner als die Schale eines Apfels!',
          sci: 'Die Kruste: hier 35 km dick (5 bis 10 km unter den Ozeanen, bis zu 70 km unter hohen Gebirgen). Silicium macht 28% ihrer Masse aus, nach Sauerstoff (46%).',
        },
        {
          kid: 'Der obere Mantel: heißes Gestein, vor allem Olivin, ein grünes Mineral aus Silicium, Sauerstoff, Magnesium und Eisen. Es ist fest, kriecht aber langsam, ein paar Zentimeter im Jahr.',
          sci: 'Oberer Mantel, bis 410 km: Peridotit, zu etwa 60% Olivin, (Mg,Fe)₂SiO₄. Jedes Silicium sitzt in einem Tetraeder aus vier Sauerstoffatomen; das Gestein ist fest und kriecht doch ein paar Zentimeter im Jahr.',
        },
        {
          kid: 'Die Übergangszone: dieselben Atome wie im Olivin, so fest zusammengedrückt, dass sie sich zu neuen, dichteren Kristallen ordnen. Die können sogar Wasser speichern!',
          sci: 'Übergangszone, 410 bis 660 km: Olivin wird bei etwa 14 GPa zu Wadsleyit, dann bei etwa 520 km zu Ringwoodit, jedes dichter. Ein Ringwoodit in einem Diamanten aus Brasilien, 2014 beschrieben, enthielt etwa 1,5 Gewichtsprozent Wasser.',
        },
        {
          kid: 'Der untere Mantel: die größte Schicht. Sein Gestein ist vor allem Bridgmanit, das häufigste Mineral der Erde, das aber erst 2014 einen Namen bekam.',
          sci: 'Unterer Mantel, 660 bis etwa 2890 km: Bridgmanit, (Mg,Fe)SiO₃, mit Ferroperiklas, (Mg,Fe)O. Hier hat jedes Silicium sechs Sauerstoffnachbarn; der Druck erreicht unten etwa 136 GPa.',
        },
        {
          kid: 'Der äußere Kern: ein Meer aus flüssigem Eisen und Nickel, Tausende Grad heiß. Sein Strömen macht die Erde zu einem riesigen Magneten, den dein Kompass spürt. Hier unten gibt es kein Siliciumgestein!',
          sci: 'Äußerer Kern, 2890 bis 5150 km: flüssige Eisen-Nickel-Legierung mit einigen Prozent leichterer Elemente (Sauerstoff, Schwefel, vielleicht Silicium). Ihre Konvektion treibt den Geodynamo an, das Magnetfeld der Erde.',
        },
        {
          kid: 'Der Mittelpunkt, 6371 km tief: eine Kugel aus festem Eisen und Nickel, ungefähr so heiß wie die Oberfläche der Sonne. Der Druck ist so gewaltig, dass sie nicht schmelzen kann.',
          sci: 'Innerer Kern, von 5150 km bis zum Mittelpunkt in 6371 km: festes Eisen-Nickel, etwa 1220 km im Radius, bei etwa 5000 bis 6000 °C und etwa 360 GPa, dem 3,6-Millionenfachen des Luftdrucks an der Oberfläche.',
        },
      ],
      rows: {
        kid: ['0 bis etwa 35 km', 'bis 410 km', 'bis 660 km', 'bis 2890 km', 'bis 5150 km (flüssig)', 'bis 6371 km, der Mittelpunkt (fest)'],
        sci: [
          '0 bis 35 km: Feldspäte, Quarz; Basalt unter den Ozeanen',
          '35 bis 410 km: Peridotit (Olivin)',
          '410 bis 660 km: Wadsleyit, Ringwoodit',
          '660 bis 2890 km: Bridgmanit, Ferroperiklas',
          '2890 bis 5150 km: flüssiges Eisen-Nickel',
          '5150 bis 6371 km: festes Eisen-Nickel',
        ],
      },
      panel: {
        kid: [
          'Das ist die aufgeschnittene Erde, jede Schicht in der richtigen Dicke gezeichnet. Tippe auf eine Schicht im Schnitt oder schieb den Regler, um das Licht hinabzuschicken, bis zum Mittelpunkt, 6371 km unter deinen Füßen. Die Lupe zeigt die Atome dort, wo das Licht gerade ist.',
          'Fast alles zwischen der dünnen Kruste und dem Kern ist Gestein aus Silikaten: Silicium und Sauerstoff, verbunden mit Magnesium und Eisen. Weit oben ist es grüner Olivin: Auf Hawaii gibt es einen Strand aus grünem Olivinsand, und der Edelstein Peridot ist auch Olivin. Weiter unten drückt das Gewicht des Gesteins darüber dieselben Atome zu dichteren Kristallen zusammen. Von 100 kg Erde sind etwa 15 kg Silicium, aber im Kern gibt es kein Silikatgestein: Er besteht aus Eisen und Nickel.',
        ],
        sci: [
          'Die Schichten maßstabsgetreu (mittlerer Radius 6371 km). Der Mantel macht etwa 84% des Erdvolumens und zwei Drittel der Erdmasse aus. Tippe auf eine Schicht im Schnitt oder schieb den Regler, um die Sonde zu bewegen; die Lupe zeigt die Struktur in ihrer Tiefe.',
          'Silicium macht etwa 15% der Erdmasse aus (Eisen 32%, Sauerstoff 30%, Magnesium 14%), fast alles in den Silikaten des Mantels. Bei etwa 410 km wird Olivin, (Mg,Fe)₂SiO₄, zu Wadsleyit, bei etwa 520 km zu Ringwoodit; bei 660 km (etwa 23 GPa) zerfällt Ringwoodit in Bridgmanit und Ferroperiklas, und Silicium hat statt vier Sauerstoffnachbarn nun sechs. Bridgmanit wurde 2014 nach dem Hochdruckphysiker Percy Bridgman benannt (Nobelpreis 1946), als natürliche Kristalle aus dem Meteoriten Tenham beschrieben wurden. Der Kern enthält keine Silikate: Er ist Eisen-Nickel, vielleicht mit etwas gelöstem Silicium.',
        ],
      },
    },
    moon: {
      label: 'Das Mondgestein',
      dark: 'Hol einen dunklen Stein',
      pale: 'Hol einen hellen Stein',
      compare: 'Vergleiche mit der Erde',
      back: 'Bring sie zurück',
      tapMoon: 'Tippe auf den Mond',
      tapSea: 'Tippe auf ein dunkles Meer des Mondes',
      tapHigh: 'Tippe auf das helle Hochland',
      tapCompare: 'Tippe auf die Vitrine zum Vergleichen',
      tapBack: 'Tippe auf die Vitrine, um sie zurückzubringen',
      hint: {
        kid: 'Tippe zuerst auf den Mond: Ein dunkles Meer gibt dir Basalt, das helle Hochland Anorthosit.',
        sci: 'Hol zuerst eine Mondprobe: Tippe auf ein dunkles Mare für Basalt oder auf das helle Hochland für Anorthosit.',
      },
      title: 'Gestein vom Mond',
      sign: 'Apollo, 1969 bis 1972: 382 kg',
      rocks: ['Basalt', 'Anorthosit', 'Erdgestein'],
      match: 'Gleicher Sauerstoff',
      says: {
        basalt: {
          kid: 'Da kommt ein dunkler Stein aus einem der „Meere“ des Mondes. Es ist Basalt: alte Lava, die riesige Krater geflutet hat. Apollo 11 hat 1969 solche Steine eingesammelt.',
          sci: 'Mare-Basalt aus dem Meer der Ruhe, wo Apollo 11 landete: eisen- und titanreiche Lava, die die Einschlagbecken flutete, meist vor 3 bis 4 Milliarden Jahren.',
        },
        anorthosite: {
          kid: 'Und ein heller Stein aus dem leuchtenden Hochland: Anorthosit, vor allem aus einem weißen Mineral namens Feldspat. Er gehört zu den ältesten Gesteinen des Mondes!',
          sci: 'Hochland-Anorthosit, wie die Gesteine, die Apollo 16 im Descartes-Hochland sammelte: über 90% Plagioklas-Feldspat, vor allem Anorthit, CaAl₂Si₂O₈. Er schwamm vor über 4 Milliarden Jahren oben auf dem Magmaozean des jungen Mondes.',
        },
        earth: {
          kid: 'Jetzt ein Stein aus dem Erdmantel. Forscher haben ihren Sauerstoff verglichen, und er ist fast gleich, wie derselbe Fingerabdruck! Der Mond ist also wahrscheinlich aus Erdmaterial gemacht.',
          sci: 'Die drei stabilen Sauerstoffisotope, ¹⁶O, ¹⁷O und ¹⁸O, kommen in Mond- und Erdgestein im gleichen Verhältnis vor, auf wenige Millionstel genau; Mars und die meisten Meteoriten weichen deutlich ab.',
        },
        back: {
          kid: 'Zurück mit ihnen. Das echte Mondgestein wird in einem Labor der NASA in Houston sicher aufbewahrt.',
          sci: 'Die meisten Apollo-Proben lagern in stickstoffgefüllten Schränken im Mondprobenlabor der NASA am Johnson Space Center in Houston.',
        },
      },
      panel: {
        kid: [
          'Der Mond besteht aus derselben Art Gestein wie die Außenseite der Erde: aus Silikaten, Silicium und Sauerstoff mit Metallen verbunden. Die dunklen Flecken, die du von zu Hause siehst, sind seine „Meere“, aber darin ist kein Wasser: Es ist dunkler Basalt, Lava, die vor langer Zeit riesige Krater gefüllt hat. Die hellen Teile sind Hochländer aus hellem Anorthosit.',
          'Zwischen 1969 und 1972 brachten sechs Apollo-Missionen zwölf Astronauten auf den Mond, und sie brachten 382 kg Gestein und Staub mit; die sechs kleinen Lichter auf dem Mond zeigen, wo sie gelandet sind. Mondgestein und Erdgestein haben denselben Sauerstoff-Fingerabdruck. Forscher glauben, dass der Mond aus den Trümmern entstand, als ein Planet von der Größe des Mars mit der jungen Erde zusammenstieß.',
        ],
        sci: [
          'Sechs Apollo-Landungen (Apollo 11, 12, 14, 15, 16 und 17, 1969 bis 1972) brachten 382 kg in 2196 Proben zurück; die Lichter markieren die Landestellen. Die sowjetischen Sonden Luna 16, 20 und 24 brachten etwa 0,3 kg dazu. Mare-Basalte bedecken etwa 16% der Oberfläche, fast alle auf der Vorderseite; das Hochland ist Anorthosit, die aufgeschwommene Kruste eines frühen Magmaozeans. Silicium und Sauerstoff machen etwa zwei Drittel der Masse beider aus.',
          'Ihre Sauerstoffisotopenverhältnisse (Δ¹⁷O) stimmen auf wenige Millionstel mit denen der Erde überein, während Mars und die meisten Meteoriten abweichen: der wichtigste Hinweis, neben dem kleinen Eisenkern des Mondes, auf die Theorie des großen Einschlags, nach der ein marsgroßer Körper (Theia) vor etwa 4,5 Milliarden Jahren die junge Erde traf. Hier in wahrer Größe neben der Erde gezeichnet (Radius 1737 km gegenüber 6371 km), ist der echte Mond 384 400 km entfernt, etwa 30 Erddurchmesser.',
        ],
      },
    },
    star: {
      label: 'Ein Riesenstern',
      make: 'Mach Silicium',
      tap: 'Tippe auf den Stern',
      title: 'In einem Stern gemacht',
      sign: 'Wo Silicium entsteht',
      says: {
        start: {
          kid: 'Vor langer Zeit, bevor die Sonne geboren wurde, leuchtete ein Riesenstern. Tief in seinem Inneren prallen Sauerstoffatome zusammen und werden zu Silicium!',
          sci: 'Sauerstoffbrennen im Kern bei etwa 2 Milliarden K: ¹⁶O + ¹⁶O → ²⁸Si + ⁴He. Es dauert weniger als ein Jahr.',
        },
        boom: {
          kid: 'Bumm! Der Stern explodiert: eine Supernova, eine Zeit lang heller als eine ganze Galaxie.',
          sci: 'Siliciumbrennen erzeugt einen Eisenkern, der in weniger als einer Sekunde kollabiert; Rückprall und Neutrinos zerreißen den Stern mit Tausenden Kilometern pro Sekunde.',
        },
        cloud: {
          kid: 'Das Silicium fliegt hinaus ins All und landet Millionen Jahre später in einer Wolke aus Gas und Staub.',
          sci: 'Die Auswürfe mischen sich mit interstellarem Gas; Silicium kondensiert zu Körnern aus Silikatstaub.',
        },
        disc: {
          kid: 'Die Wolke schrumpft und dreht sich zu einer Scheibe: eine neue Sonne in der Mitte und Gesteinsplaneten drum herum. So ist unsere Erde entstanden, aus Sternenstaub!',
          sci: 'Vor etwa 4,6 Milliarden Jahren kollabierte eine solche Wolke zur Sonne und einer Scheibe, in der Silikatstaub zu Planetesimalen und dann zu Gesteinsplaneten verklumpte.',
        },
      },
      panel: {
        kid: [
          'Das meiste Silicium der Erde, im Sand, im Gestein und in den Computerchips, entstand in Riesensternen, die lebten und starben, bevor die Sonne geboren wurde. Ein Riesenstern ist wie eine Zwiebel: Gegen Ende verbrennt er Schicht um Schicht immer schwerere Elemente, Wasserstoff zu Helium, Helium zu Kohlenstoff und Sauerstoff und tief im Inneren Sauerstoff zu Silicium.',
          'Dann verbrennt das Silicium zu Eisen, und das ist das Ende: Der Kern stürzt zusammen und der Stern explodiert. Die Explosion schleudert das Silicium ins All, wo es Millionen Jahre trieb, bis es in die Wolke kam, aus der unsere Sonne und die Planeten entstanden. Der Sauerstoff, den du atmest, und das Eisen in deinem Blut sind auch in Sternen entstanden.',
        ],
        sci: [
          'Sterne mit mehr als etwa 8 Sonnenmassen brennen im Kern Wasserstoff, Helium, Kohlenstoff, Neon, Sauerstoff und zuletzt Silicium, jede Stufe heißer und kürzer. Das Sauerstoffbrennen bei etwa 2 Milliarden K verschmilzt ¹⁶O + ¹⁶O → ²⁸Si + ⁴He (mit anderen Produkten wie Phosphor und Schwefel); das Siliciumbrennen, das etwa einen Tag dauert, baut Kerne der Eisengruppe auf, vor allem Nickel-56, bis der Kern keine Energie mehr freisetzen kann und kollabiert.',
          'Die Stoßwelle der Supernova fügt explosives Sauerstoffbrennen hinzu und schleudert die Schichten hinaus; das Silicium kondensiert zu Silikatstaub. Das meiste Silicium des Sonnensystems stammt aus solchen Kernkollaps-Supernovae, vieles vom Rest aus explodierenden Weißen Zwergen (Typ Ia). Silicium-28 macht 92,2% des gesamten Siliciums aus; Siliciumcarbidkörner in Meteoriten sind echter Sternenstaub, älter als die Sonne.',
        ],
      },
    },
  },
}
