// The words of krypton's water room ("Water a million years old?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Kr.js (the
// easel shows it); the room shows it happening and adds to it.
// Sources: Sturchio and colleagues, "One million year old groundwater in the Sahara revealed by krypton-81 and
// chlorine-36", Geophysical Research Letters 31, L05503 (2004): gas stripped from several tonnes of water at six
// field sites in Egypt's Western Desert, krypton-81 ages of about 200 000 to 1 million years in the Nubian
// Sandstone Aquifer, consistent with flow from a recharge area near the Uweinat uplift (south-west Egypt),
// hydrogen isotopes pointing to Atlantic moisture in wetter Pleistocene (pluvial) periods. Atom Trap Trace
// Analysis: Chen and colleagues (Lu's group, Argonne), Science 286 (1999); the lasers near 811 nm (the
// 5s[3/2]2 to 5p[5/2]3 line of metastable krypton; flagged: from memory of the ATTA papers, not re-read).
// Krypton-81 half-life 229 000 years; in the air 81Kr/Kr about 5 x 10^-13 (Collon and colleagues 2000: about
// one atom in two trillion). Taylor Glacier ice of 120 000 years: Buizert and colleagues, PNAS 2014. The
// dissolved gases (air-saturated water at 10 degrees C, per litre at normal pressure: nitrogen about 14 mL,
// argon about 0.35 mL, krypton about 0.00005 mL, so 3 krypton atoms to a million nitrogen) are worked out from
// the gases' solubilities (Weiss 1970, 1971); real fossil water differs a little. The creep of "a metre or
// two a year" is the picture's (the board's) figure; the room counts at 1 m a year. The wet and dry spells
// drawn on the long window are only for show. The green Sahara ended about 5 000 years ago (African Humid
// Period, roughly). Krypton's discovery: Ramsay and Travers, May 1898. Placeholders: {n}, {d}.
export const KR_WATER_WORDS = {
  en: {
    title: 'An oasis in the Western Desert',
    greet: {
      kid: 'We are inside the picture: an oasis in the Sahara at dusk! Look at the long window by the dunes: it shows what lies under the sand, a hidden sea of water that is a million years old. Krypton helps us tell its age. The picture\'s story is on the easel beside you.',
      sci: 'An oasis in Egypt\'s Western Desert at dusk, above the Nubian Sandstone Aquifer. Krypton-81, with a half-life of 229 000 years, dates its water. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'My name means "hidden" in Greek. Scientists found krypton in 1898, and for all those years it was hiding in the air around us!',
        'A krypton-81 atom is very rare. Only about one krypton atom in two trillion is this kind. That is why we need a trap that can catch single atoms.',
        'In the Sahara the sand can sit on top of a hidden sea. People in Egypt dig wells and pump the water up for their fields.',
        'The Sahara was last green only about five thousand years ago. The water down here fell as rain long before that.',
      ],
      sci: [
        'Krypton (Greek kryptos, hidden) was found by Ramsay and Travers in London in May 1898, in the gas left when liquid air boiled away.',
        'Krypton-81 has a half-life of 229 000 years. Krypton-85, which comes from nuclear reactors, has only 10.7 years. This room\'s clock is the first.',
        'The last green Sahara, the African Humid Period, ended roughly 5 000 years ago. The water counted here fell far earlier, in older wet spells.',
        'Krypton-81 dating reaches from about 50 000 years to about a million: older than radiocarbon can see, younger than most rock clocks.',
      ],
    },
    source: {
      label: 'The hidden sea',
      title: 'Where the water came from',
      face: {
        hills: 'Uweinat hills',
        oasis: 'the oasis',
        sandstone: 'sandstone full of water',
        rock: 'hard rock',
        drop: 'the first drop',
        kr: 'krypton',
        kr81: 'krypton-81 (shown far too often)',
        cloud: 'Tap the rain',
        ago: '{n} years ago',
        today: 'today',
        journey: 'The first drop has crept {d}',
        creep: 'at 1 metre a year',
      },
      track: { start: '1 million years ago', end: 'today' },
      dist: { m: '{n} m', km: '{n} km' },
      hints: {
        rain: 'Tap the rain cloud',
        wait: 'Tap the time line to find a wet time',
        time: 'Tap the time line to let the years go by',
        again: 'Tap the time line to go back and watch again',
      },
      buttons: { rain: 'Make it rain', step: '100 000 years later', back: 'Back to a million years ago' },
      slider: 'Time',
      says: {
        rain: {
          kid: 'Rain on the hills! Every drop carries a little krypton from the air. Nearly all of it is ordinary, but a few atoms, the big ones, are krypton-81.',
          sci: 'Rain dissolves the air\'s gases, krypton too. About one krypton atom in two trillion is krypton-81; the window draws far too many so you can see them.',
        },
        soak: {
          kid: 'The rain soaks into the sandstone like water into a sponge, and starts creeping north.',
          sci: 'The water enters the sandstone near the Uweinat hills and begins to flow north through its pores.',
        },
        fade: {
          kid: 'Look at the big krypton dots: they are fading. Underground, nobody makes new krypton-81, so it slowly disappears.',
          sci: 'Underground no new krypton-81 is made, so each atom may decay: half of them are gone every 229 000 years.',
        },
        dry: {
          kid: 'The desert comes back, and up here it looks as if nothing happened. But under the sand the water keeps creeping.',
          sci: 'The climate dries and the dunes return, but the groundwater goes on flowing underneath, a metre or two a year.',
        },
        wet: {
          kid: 'Wet again! More rain soaks in behind the first drop.',
          sci: 'Another pluvial period: new recharge, behind the water that fell first.',
        },
        today: {
          kid: 'Today! The first drop has crept about a thousand kilometres, and now people pump it up. Only about a twentieth of its krypton-81 is left.',
          sci: 'Today. After a million years at 1 m a year the first drop has travelled about 1 000 km. Only about 5 % of its krypton-81 is left (4.4 half-lives).',
        },
      },
      panel: {
        kid: [
          'The long window shows what is under the sand. In the south-west, over the Uweinat hills, rain fell when the Sahara was green and soaked into the sandstone, like water into a sponge. Slide through a million years: the desert comes and goes, and the water keeps creeping north.',
          'It creeps only about a metre or two a year, but a million years is a very long time. The wet and dry times drawn here are only for show; the real ones came in no tidy pattern.',
        ],
        sci: [
          'The Nubian Sandstone Aquifer System lies under Egypt, Libya, Sudan and Chad and is one of the largest stores of ancient groundwater on Earth. Sturchio and colleagues (Geophysical Research Letters, 2004) measured krypton-81 in its water in Egypt\'s Western Desert and found ages of about 200 000 to 1 million years, consistent with flow from a recharge area near the Uweinat uplift in the south-west. Hydrogen isotopes in the same water point to rain from the Atlantic in wetter (pluvial) periods of the Pleistocene.',
          'The flow is of the order of a metre or two a year; the counter assumes 1 m a year and shows how far one drop would creep. The wet spells drawn here are schematic, not a climate record, and the section is not to scale.',
        ],
      },
    },
    well: {
      label: 'The well',
      title: 'Catching the gas',
      labels: { pump: 'pump', tank: 'degassing tank', valve: 'gas valve', bottle: 'gas bottle', litres: '{n} litres' },
      hints: {
        pump: 'Tap the pump to bring the water up',
        more: 'Keep pumping: it takes thousands of litres',
        valve: 'Tap the valve on top of the tank',
        bottle: 'Tap the gas bottle to see what is in it',
        again: 'Tap the pump to start over',
      },
      buttons: { pump: 'Start pumping', stop: 'Stop pumping', valve: 'Collect the gas', bottle: 'Split the gas', fresh: 'Start over' },
      says: {
        on: {
          kid: 'The pump brings up water a million years old! In the tank a vacuum pulls the gas out of it, in tiny bubbles.',
          sci: 'The pump lifts the groundwater into the tank; a vacuum strips the dissolved gas out of it.',
        },
        off: { kid: 'Pump stopped. Tap it again to go on.', sci: 'Pump stopped; the litre counter holds.' },
        few: {
          kid: 'Not enough yet! Krypton is so rare that we need thousands of litres.',
          sci: 'Too little water so far: with only about 50 nanolitres of krypton in each litre, the team needed thousands of litres.',
        },
        empty: {
          kid: 'The bottle is empty. Pump the water first, then open the valve on the tank.',
          sci: 'Nothing in the bottle yet: pump enough water, then open the tank\'s valve.',
        },
        valve: {
          kid: 'The gas flows into the bottle. Now tap the bottle to see what is in it.',
          sci: 'The stripped gas goes into the sample bottle. Tap it to see its parts.',
        },
        bottle: {
          kid: 'Mostly nitrogen, a little argon, and a few krypton atoms hiding among them.',
          sci: 'Nitrogen by far, then argon; krypton is only about 3 atoms in a million. Chemists separate it from the rest before it reaches the trap.',
        },
      },
      board: {
        title: 'What is in the gas',
        nitrogen: 'nitrogen',
        argon: 'argon',
        krypton: 'krypton',
        ratio: 'About {n} krypton atoms for every million nitrogen',
        note: 'dots not to scale',
      },
      panel: {
        kid: [
          'At the well, the pump brings up the ancient water. To read its krypton, scientists need the gas that is dissolved in it. They pump thousands of litres through a tank where a vacuum makes the gas bubble out.',
          'Krypton is very rare: from a thousand litres you get far less than one drop of it. So most of what you catch is nitrogen, then argon, with only a few krypton atoms for every million nitrogen.',
        ],
        sci: [
          'In 2004 the team (Sturchio and colleagues) pumped groundwater at six field sites in Egypt\'s Western Desert and stripped the dissolved gas out in a vacuum, from several tonnes of water per sample. The gas is then purified and its krypton separated before the atom trap sees it.',
          'Water in balance with air at 10 °C holds about 14 mL of nitrogen, 0.35 mL of argon and 0.00005 mL (50 nL) of krypton per litre (at normal pressure): about 3 krypton atoms for every million nitrogen, and about 50 microlitres of krypton from a thousand litres. Real fossil groundwater differs a little (other recharge temperatures, extra helium or methane), so the board shows the idealised case.',
        ],
      },
    },
    trap: {
      label: 'The atom trap',
      title: 'Catching single atoms',
      labels: { cylinder: 'krypton gas', air: 'air today', water: 'the well\'s water', dial: 'krypton-81 left', lasers: 'lasers', trap: 'trap' },
      screen: {
        title: 'Trap camera',
        idle: { kid: 'Tap the krypton gas', sci: 'No gas flowing yet' },
        air: 'sample: air today',
        water: 'sample: the well\'s water',
        caught: 'krypton-81 caught: {n}',
        left: 'krypton-81 left: {n} % of air',
        age: 'about {n} years old',
        fresh: 'as young as the air',
      },
      hints: {
        gas: 'Tap the krypton gas to let it flow',
        air: 'Tap the bottle of air and count its krypton-81',
        water: 'Tap the well\'s water bottle and count again',
        mark: 'Tap a mark on the dial: how old is the water?',
        again: 'Tap the bottles or a mark on the dial to compare',
      },
      buttons: { gas: 'Let krypton flow', stop: 'Stop the gas', air: 'Count the air', water: 'Count the well\'s water', mark: 'Water 458 000 years old' },
      slider: 'Age of the well\'s water',
      says: {
        gas: {
          kid: 'Krypton flows in from the left. Watch: nearly all of it flies straight through. Only the rare krypton-81 slows down, gets caught and glows!',
          sci: 'Krypton flows through the trap; the lasers act on krypton-81 only, so only its atoms slow down and are caught.',
        },
        stop: { kid: 'Gas off. The trap is quiet.', sci: 'Gas off; nothing left to catch.' },
        air: {
          kid: 'Air today: lots of catches. This is what fresh water would give.',
          sci: 'Modern air sets the reference count rate: 100 %.',
        },
        water: {
          kid: 'The well\'s water: fewer catches than air. Some of its krypton-81 has disappeared, and that tells us how old it is!',
          sci: 'Fewer krypton-81 atoms per krypton atom than in air: the ratio gives the age.',
        },
        mark: {
          kid: 'Half left means 229 000 years, a quarter 458 000, and so on: every halving is one more 229 000 years.',
          sci: 'age = 229 000 years x log2(1 / fraction left): half 229 000, a quarter 458 000, an eighth 687 000, a sixteenth about 916 000.',
        },
      },
      panel: {
        kid: [
          'This is the atom trap. Krypton gas flies in from the left. Three pairs of laser beams cross in the middle, tuned so that only krypton-81 takes any notice: it slows down, gets stuck where they cross and glows, and a camera sees it. All the other krypton flies straight on.',
          'Krypton-81 is so rare in the air that each atom takes a long wait. Here the catches come far more often than in real life, so you can see them. Count the air first, then the well\'s water: fewer catches means older water. Half as many means 229 000 years, a quarter 458 000.',
        ],
        sci: [
          'Atom Trap Trace Analysis (ATTA) was developed at Argonne National Laboratory by Zheng-Tian Lu\'s group (Chen and colleagues, Science, 1999). A discharge lifts krypton atoms into a long-lived excited state; laser light near 811 nm, tuned to krypton-81 alone (the tiny shift of its spectral line), then slows and holds them in a magneto-optical trap where three pairs of beams cross. Each trapped atom scatters light and shows as a single dot.',
          'The age comes from the ratio of the sample\'s krypton-81 count rate to modern air\'s: t = 229 000 years x log2(R air / R sample). About one krypton atom in two trillion in air is krypton-81; the catches here are shown far more often. Sturchio and colleagues found 200 000 to 1 million years in the Nubian aquifer; the same clock dated 120 000-year-old ice at Taylor Glacier, Antarctica (Buizert and colleagues, PNAS, 2014).',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Um oásis no Deserto Ocidental',
    greet: {
      kid: 'Estamos dentro da imagem: um oásis no Sara ao anoitecer! Olha para a janela comprida junto às dunas: mostra o que há debaixo da areia, um mar escondido de água com um milhão de anos. O crípton ajuda-nos a saber a idade dela. A história da imagem está no cavalete ao teu lado.',
      sci: 'Um oásis no Deserto Ocidental do Egito ao anoitecer, sobre o Aquífero de Arenito Núbio. O crípton-81, com meia-vida de 229 000 anos, data a sua água. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O meu nome quer dizer "escondido" em grego. Os cientistas descobriram o crípton em 1898, e durante todos esses anos esteve escondido no ar à nossa volta!',
        'Um átomo de crípton-81 é muito raro. Só cerca de um átomo de crípton em cada dois biliões é deste tipo. Por isso precisamos de uma armadilha que apanhe átomos um a um.',
        'No Sara, a areia pode estar em cima de um mar escondido. No Egito, as pessoas cavam poços e bombeiam a água para os campos.',
        'O Sara foi verde pela última vez há apenas cerca de cinco mil anos. A água cá de baixo caiu como chuva muito antes disso.',
      ],
      sci: [
        'O crípton (do grego kryptos, escondido) foi descoberto por Ramsay e Travers em Londres, em maio de 1898, no gás que sobrou da evaporação do ar líquido.',
        'O crípton-81 tem uma meia-vida de 229 000 anos. O crípton-85, que vem dos reatores nucleares, tem apenas 10,7 anos. O relógio desta sala é o primeiro.',
        'O último Sara verde, o Período Húmido Africano, terminou há cerca de 5 000 anos. A água contada aqui caiu muito antes, em períodos húmidos mais antigos.',
        'A datação por crípton-81 vai de cerca de 50 000 anos até cerca de um milhão: mais antiga do que o radiocarbono consegue ver, mais recente do que a maioria dos relógios das rochas.',
      ],
    },
    source: {
      label: 'O mar escondido',
      title: 'De onde veio a água',
      face: {
        hills: 'colinas de Uweinat',
        oasis: 'o oásis',
        sandstone: 'arenito cheio de água',
        rock: 'rocha dura',
        drop: 'a primeira gota',
        kr: 'crípton',
        kr81: 'crípton-81 (mostrado demais)',
        cloud: 'Toca na chuva',
        ago: 'há {n} anos',
        today: 'hoje',
        journey: 'A primeira gota já andou {d}',
        creep: 'a 1 metro por ano',
      },
      track: { start: 'há 1 milhão de anos', end: 'hoje' },
      dist: { m: '{n} m', km: '{n} km' },
      hints: {
        rain: 'Toca na nuvem de chuva',
        wait: 'Toca na linha do tempo para achar um tempo húmido',
        time: 'Toca na linha do tempo para deixar passar os anos',
        again: 'Toca na linha do tempo para voltar atrás e ver outra vez',
      },
      buttons: { rain: 'Fazer chover', step: '100 000 anos depois', back: 'Voltar a há um milhão de anos' },
      slider: 'Tempo',
      says: {
        rain: {
          kid: 'Chuva nas colinas! Cada gota leva um pouco de crípton do ar. Quase todo é normal, mas alguns átomos, os grandes, são crípton-81.',
          sci: 'A chuva dissolve os gases do ar, o crípton também. Cerca de um átomo de crípton em cada dois biliões é crípton-81; a janela desenha muitos mais para os poderes ver.',
        },
        soak: {
          kid: 'A chuva entranha-se no arenito como a água numa esponja e começa a andar para norte.',
          sci: 'A água entra no arenito junto às colinas de Uweinat e começa a escoar-se para norte pelos seus poros.',
        },
        fade: {
          kid: 'Olha para os pontos grandes de crípton: estão a ficar pálidos. Debaixo da terra ninguém faz crípton-81 novo, por isso ele vai desaparecendo devagar.',
          sci: 'No subsolo não se forma crípton-81 novo, por isso cada átomo pode decair: de 229 000 em 229 000 anos desaparece metade.',
        },
        dry: {
          kid: 'O deserto volta, e cá em cima parece que nada aconteceu. Mas debaixo da areia a água continua a andar.',
          sci: 'O clima seca e as dunas regressam, mas a água subterrânea continua a escoar-se por baixo, um ou dois metros por ano.',
        },
        wet: {
          kid: 'Outra vez húmido! Mais chuva entranha-se atrás da primeira gota.',
          sci: 'Outro período pluvial: nova recarga, atrás da água que caiu primeiro.',
        },
        today: {
          kid: 'Hoje! A primeira gota andou cerca de mil quilómetros, e agora as pessoas bombeiam-na. Só resta cerca de um vigésimo do seu crípton-81.',
          sci: 'Hoje. Passado um milhão de anos a 1 m por ano, a primeira gota percorreu cerca de 1 000 km. Resta apenas cerca de 5 % do seu crípton-81 (4,4 meias-vidas).',
        },
      },
      panel: {
        kid: [
          'A janela comprida mostra o que há debaixo da areia. No sudoeste, sobre as colinas de Uweinat, caiu chuva quando o Sara era verde e entranhou-se no arenito, como a água numa esponja. Passa por um milhão de anos: o deserto vem e vai, e a água continua a andar para norte.',
          'Anda só um ou dois metros por ano, mas um milhão de anos é muito tempo. Os tempos húmidos e secos desenhados aqui são só a fingir; os verdadeiros não vieram por nenhuma ordem certinha.',
        ],
        sci: [
          'O Sistema Aquífero de Arenito Núbio estende-se por baixo do Egito, da Líbia, do Sudão e do Chade e é uma das maiores reservas de água subterrânea antiga da Terra. Sturchio e colegas (Geophysical Research Letters, 2004) mediram o crípton-81 na sua água no Deserto Ocidental do Egito e encontraram idades de cerca de 200 000 a 1 milhão de anos, compatíveis com um escoamento desde uma zona de recarga junto ao planalto de Uweinat, no sudoeste. Os isótopos de hidrogénio da mesma água apontam para chuva vinda do Atlântico em períodos mais húmidos (pluviais) do Plistocénico.',
          'O escoamento é da ordem de um ou dois metros por ano; o contador supõe 1 m por ano e mostra quanto andaria uma gota. Os períodos húmidos desenhados aqui são esquemáticos, não um registo do clima, e o corte não está à escala.',
        ],
      },
    },
    well: {
      label: 'O poço',
      title: 'Apanhar o gás',
      labels: { pump: 'bomba', tank: 'tanque de desgaseificação', valve: 'válvula do gás', bottle: 'garrafa de gás', litres: '{n} litros' },
      hints: {
        pump: 'Toca na bomba para trazer a água cá para cima',
        more: 'Continua a bombear: são precisos milhares de litros',
        valve: 'Toca na válvula em cima do tanque',
        bottle: 'Toca na garrafa de gás para ver o que tem dentro',
        again: 'Toca na bomba para recomeçar',
      },
      buttons: { pump: 'Começar a bombear', stop: 'Parar de bombear', valve: 'Recolher o gás', bottle: 'Separar o gás', fresh: 'Recomeçar' },
      says: {
        on: {
          kid: 'A bomba traz água com um milhão de anos! No tanque, um vácuo tira-lhe o gás, em bolhinhas minúsculas.',
          sci: 'A bomba eleva a água subterrânea até ao tanque; um vácuo extrai-lhe o gás dissolvido.',
        },
        off: { kid: 'Bomba parada. Toca nela outra vez para continuar.', sci: 'Bomba parada; o contador de litros mantém-se.' },
        few: {
          kid: 'Ainda não chega! O crípton é tão raro que precisamos de milhares de litros.',
          sci: 'Ainda pouca água: com apenas cerca de 50 nanolitros de crípton em cada litro, a equipa precisou de milhares de litros.',
        },
        empty: {
          kid: 'A garrafa está vazia. Bombeia primeiro a água e depois abre a válvula do tanque.',
          sci: 'Ainda nada na garrafa: bombeia água suficiente e abre a válvula do tanque.',
        },
        valve: {
          kid: 'O gás corre para a garrafa. Agora toca na garrafa para ver o que tem dentro.',
          sci: 'O gás extraído vai para a garrafa da amostra. Toca nela para ver as suas partes.',
        },
        bottle: {
          kid: 'Quase tudo é azoto, um pouco de árgon, e alguns átomos de crípton escondidos no meio.',
          sci: 'Azoto de longe, depois árgon; o crípton é só cerca de 3 átomos em cada milhão. Os químicos separam-no do resto antes de chegar à armadilha.',
        },
      },
      board: {
        title: 'O que há no gás',
        nitrogen: 'azoto',
        argon: 'árgon',
        krypton: 'crípton',
        ratio: 'Cerca de {n} átomos de crípton por cada milhão de azoto',
        note: 'pontos fora de escala',
      },
      panel: {
        kid: [
          'No poço, a bomba traz a água antiga. Para ler o crípton dela, os cientistas precisam do gás que está dissolvido na água. Bombeiam milhares de litros por um tanque onde um vácuo faz o gás sair em bolhas.',
          'O crípton é muito raro: de mil litros sai muito menos do que uma gota dele. Por isso, quase tudo o que se apanha é azoto, depois árgon, e só alguns átomos de crípton por cada milhão de azoto.',
        ],
        sci: [
          'Em 2004, a equipa (Sturchio e colegas) bombeou água subterrânea em seis locais de campo no Deserto Ocidental do Egito e extraiu o gás dissolvido em vácuo, a partir de várias toneladas de água por amostra. O gás é depois purificado e o crípton é separado antes de chegar à armadilha atómica.',
          'A água em equilíbrio com o ar a 10 °C contém cerca de 14 mL de azoto, 0,35 mL de árgon e 0,00005 mL (50 nL) de crípton por litro (à pressão normal): cerca de 3 átomos de crípton por cada milhão de azoto, e cerca de 50 microlitros de crípton em mil litros. A água subterrânea fóssil real difere um pouco (outras temperaturas de recarga, hélio ou metano a mais), por isso o quadro mostra o caso idealizado.',
        ],
      },
    },
    trap: {
      label: 'A armadilha de átomos',
      title: 'Apanhar átomos um a um',
      labels: { cylinder: 'gás crípton', air: 'ar de hoje', water: 'a água do poço', dial: 'crípton-81 que resta', lasers: 'lasers', trap: 'armadilha' },
      screen: {
        title: 'Câmara da armadilha',
        idle: { kid: 'Toca no gás crípton', sci: 'Ainda sem gás a correr' },
        air: 'amostra: ar de hoje',
        water: 'amostra: a água do poço',
        caught: 'crípton-81 apanhados: {n}',
        left: 'crípton-81 que resta: {n} % do ar',
        age: 'com cerca de {n} anos',
        fresh: 'tão nova como o ar',
      },
      hints: {
        gas: 'Toca no gás crípton para o deixar correr',
        air: 'Toca na garrafa de ar e conta o seu crípton-81',
        water: 'Toca na garrafa da água do poço e conta outra vez',
        mark: 'Toca numa marca do mostrador: que idade tem a água?',
        again: 'Toca nas garrafas ou numa marca do mostrador para comparar',
      },
      buttons: { gas: 'Deixar correr o crípton', stop: 'Parar o gás', air: 'Contar o ar', water: 'Contar a água do poço', mark: 'Água com 458 000 anos' },
      slider: 'Idade da água do poço',
      says: {
        gas: {
          kid: 'O crípton entra pela esquerda. Olha: quase todo passa a direito. Só o raro crípton-81 abranda, fica preso e brilha!',
          sci: 'O crípton atravessa a armadilha; os lasers só atuam no crípton-81, por isso só os seus átomos abrandam e são apanhados.',
        },
        stop: { kid: 'Gás desligado. A armadilha está calada.', sci: 'Gás desligado; já não há nada para apanhar.' },
        air: {
          kid: 'Ar de hoje: muitas capturas. É isto que daria água fresca.',
          sci: 'O ar moderno define a taxa de contagem de referência: 100 %.',
        },
        water: {
          kid: 'A água do poço: menos capturas do que o ar. Parte do seu crípton-81 desapareceu, e isso diz-nos a idade dela!',
          sci: 'Menos átomos de crípton-81 por átomo de crípton do que no ar: a razão dá a idade.',
        },
        mark: {
          kid: 'Metade que resta quer dizer 229 000 anos, um quarto 458 000, e assim por diante: cada metade são mais 229 000 anos.',
          sci: 'idade = 229 000 anos x log2(1 / fração que resta): metade 229 000, um quarto 458 000, um oitavo 687 000, um dezasseis avos cerca de 916 000.',
        },
      },
      panel: {
        kid: [
          'Esta é a armadilha de átomos. O gás crípton entra pela esquerda. Três pares de raios laser cruzam-se no meio, afinados para que só o crípton-81 dê por eles: abranda, fica preso onde se cruzam e brilha, e uma câmara vê-o. Todo o outro crípton passa a direito.',
          'O crípton-81 é tão raro no ar que cada átomo demora muito a aparecer. Aqui as capturas vêm muito mais vezes do que na vida real, para as poderes ver. Conta primeiro o ar, depois a água do poço: menos capturas quer dizer água mais velha. Metade das capturas quer dizer 229 000 anos, um quarto 458 000.',
        ],
        sci: [
          'A Atom Trap Trace Analysis (ATTA) foi desenvolvida no Argonne National Laboratory pelo grupo de Zheng-Tian Lu (Chen e colegas, Science, 1999). Uma descarga eleva os átomos de crípton a um estado excitado de longa duração; a luz laser perto de 811 nm, afinada só para o crípton-81 (o minúsculo desvio da sua risca espetral), trava-os e retém-nos numa armadilha magneto-ótica, onde se cruzam três pares de feixes. Cada átomo preso espalha luz e aparece como um ponto isolado.',
          'A idade vem da razão entre a taxa de contagem do crípton-81 da amostra e a do ar moderno: t = 229 000 anos x log2(R ar / R amostra). Cerca de um átomo de crípton em cada dois biliões do ar é crípton-81; as capturas aqui aparecem muito mais vezes. Sturchio e colegas encontraram 200 000 a 1 milhão de anos no aquífero núbio; o mesmo relógio datou gelo com 120 000 anos no glaciar Taylor, na Antártida (Buizert e colegas, PNAS, 2014).',
        ],
      },
    },
  },
  pl: {
    title: 'Oaza na Pustyni Zachodniej',
    greet: {
      kid: 'Jesteśmy wewnątrz obrazu: oaza na Saharze o zmierzchu! Spójrz na długie okno przy wydmach: pokazuje, co jest pod piaskiem, ukryte morze wody sprzed miliona lat. Krypton pomaga nam poznać jej wiek. Historia obrazu leży na sztalugach obok ciebie.',
      sci: 'Oaza na Pustyni Zachodniej w Egipcie o zmierzchu, nad Nubijskim Systemem Wodonośnym. Krypton-81, o okresie półtrwania 229 000 lat, datuje jego wodę. Historia obrazu jest na sztalugach.',
    },
    talk: {
      kid: [
        'Moje imię po grecku znaczy "ukryty". Naukowcy odkryli krypton w 1898 roku, a przez wszystkie te lata chował się w powietrzu wokół nas!',
        'Atom kryptonu-81 jest bardzo rzadki. Tylko około jeden atom kryptonu na dwa biliony jest tego rodzaju. Dlatego potrzebna jest pułapka, która łapie pojedyncze atomy.',
        'Na Saharze piasek może leżeć na ukrytym morzu. W Egipcie ludzie kopią studnie i pompują wodę na swoje pola.',
        'Sahara była zielona po raz ostatni zaledwie około pięciu tysięcy lat temu. Woda tu na dole spadła jako deszcz o wiele wcześniej.',
      ],
      sci: [
        'Krypton (z greckiego kryptos, ukryty) odkryli Ramsay i Travers w Londynie w maju 1898 roku, w gazie, który został po odparowaniu ciekłego powietrza.',
        'Krypton-81 ma okres półtrwania 229 000 lat. Krypton-85, który pochodzi z reaktorów jądrowych, tylko 10,7 roku. Zegarem tej sali jest ten pierwszy.',
        'Ostatnia zielona Sahara, afrykański okres wilgotny, skończyła się około 5 000 lat temu. Woda liczona tutaj spadła o wiele wcześniej, w starszych okresach deszczowych.',
        'Datowanie kryptonem-81 sięga od około 50 000 lat do około miliona: dalej, niż widzi węgiel promieniotwórczy, bliżej niż większość zegarów skalnych.',
      ],
    },
    source: {
      label: 'Ukryte morze',
      title: 'Skąd wzięła się woda',
      face: {
        hills: 'wzgórza Uweinat',
        oasis: 'oaza',
        sandstone: 'piaskowiec pełen wody',
        rock: 'twarda skała',
        drop: 'pierwsza kropla',
        kr: 'krypton',
        kr81: 'krypton-81 (pokazany za często)',
        cloud: 'Dotknij deszczu',
        ago: '{n} lat temu',
        today: 'dziś',
        journey: 'Pierwsza kropla przepłynęła {d}',
        creep: 'po metrze na rok',
      },
      track: { start: '1 milion lat temu', end: 'dziś' },
      dist: { m: '{n} m', km: '{n} km' },
      hints: {
        rain: 'Dotknij chmury deszczowej',
        wait: 'Dotknij osi czasu, żeby znaleźć mokry czas',
        time: 'Dotknij osi czasu, żeby lata mijały',
        again: 'Dotknij osi czasu, żeby wrócić i obejrzeć jeszcze raz',
      },
      buttons: { rain: 'Zrób deszcz', step: '100 000 lat później', back: 'Z powrotem do miliona lat temu' },
      slider: 'Czas',
      says: {
        rain: {
          kid: 'Deszcz na wzgórzach! Każda kropla niesie trochę kryptonu z powietrza. Prawie cały jest zwykły, ale kilka atomów, te duże, to krypton-81.',
          sci: 'Deszcz rozpuszcza gazy z powietrza, także krypton. Około jeden atom kryptonu na dwa biliony to krypton-81; okno rysuje ich o wiele za dużo, żebyś je zobaczył.',
        },
        soak: {
          kid: 'Deszcz wsiąka w piaskowiec jak woda w gąbkę i zaczyna płynąć na północ.',
          sci: 'Woda wnika w piaskowiec przy wzgórzach Uweinat i zaczyna płynąć na północ przez jego pory.',
        },
        fade: {
          kid: 'Spójrz na duże kropki kryptonu: bledną. Pod ziemią nikt nie robi nowego kryptonu-81, więc powoli znika.',
          sci: 'Pod ziemią nie powstaje nowy krypton-81, więc każdy atom może się rozpaść: co 229 000 lat ubywa połowy.',
        },
        dry: {
          kid: 'Pustynia wraca, a tu na górze wygląda, jakby nic się nie stało. Ale pod piaskiem woda wciąż płynie.',
          sci: 'Klimat wysycha i wracają wydmy, ale woda gruntowa płynie dalej pod spodem, metr lub dwa na rok.',
        },
        wet: {
          kid: 'Znowu mokro! Więcej deszczu wsiąka za pierwszą kroplą.',
          sci: 'Kolejny okres pluwialny: nowe zasilanie, za wodą, która spadła pierwsza.',
        },
        today: {
          kid: 'Dziś! Pierwsza kropla przepłynęła około tysiąca kilometrów, a teraz ludzie ją wypompowują. Zostało jej tylko około jednej dwudziestej kryptonu-81.',
          sci: 'Dziś. Po milionie lat po metrze na rok pierwsza kropla pokonała około 1 000 km. Zostało tylko około 5 % jej kryptonu-81 (4,4 okresu półtrwania).',
        },
      },
      panel: {
        kid: [
          'Długie okno pokazuje, co jest pod piaskiem. Na południowym zachodzie, nad wzgórzami Uweinat, spadł deszcz, gdy Sahara była zielona, i wsiąkł w piaskowiec jak woda w gąbkę. Przesuń się przez milion lat: pustynia przychodzi i odchodzi, a woda wciąż płynie na północ.',
          'Płynie tylko metr lub dwa na rok, ale milion lat to bardzo dużo czasu. Mokre i suche czasy narysowane tutaj są tylko na niby; prawdziwe nie przychodziły w żadnym równym rytmie.',
        ],
        sci: [
          'Nubijski System Wodonośny leży pod Egiptem, Libią, Sudanem i Czadem i jest jednym z największych zasobów starożytnych wód gruntowych na Ziemi. Sturchio i współpracownicy (Geophysical Research Letters, 2004) zmierzyli krypton-81 w jego wodzie na Pustyni Zachodniej w Egipcie i znaleźli wiek od około 200 000 do 1 miliona lat, zgodny z przepływem z obszaru zasilania w pobliżu wyniesienia Uweinat na południowym zachodzie. Izotopy wodoru w tej samej wodzie wskazują na deszcz znad Atlantyku w wilgotniejszych (pluwialnych) okresach plejstocenu.',
          'Przepływ jest rzędu metra lub dwóch na rok; licznik zakłada 1 m na rok i pokazuje, jak daleko dotarłaby jedna kropla. Mokre okresy narysowane tutaj są schematyczne, to nie zapis klimatu, a przekrój nie jest w skali.',
        ],
      },
    },
    well: {
      label: 'Studnia',
      title: 'Łapanie gazu',
      labels: { pump: 'pompa', tank: 'zbiornik odgazowujący', valve: 'zawór gazu', bottle: 'butla z gazem', litres: '{n} litrów' },
      hints: {
        pump: 'Dotknij pompy, żeby wydobyć wodę',
        more: 'Pompuj dalej: potrzeba tysięcy litrów',
        valve: 'Dotknij zaworu na zbiorniku',
        bottle: 'Dotknij butli z gazem, żeby zobaczyć, co w niej jest',
        again: 'Dotknij pompy, żeby zacząć od nowa',
      },
      buttons: { pump: 'Zacznij pompować', stop: 'Przestań pompować', valve: 'Zbierz gaz', bottle: 'Rozdziel gaz', fresh: 'Zacznij od nowa' },
      says: {
        on: {
          kid: 'Pompa wydobywa wodę sprzed miliona lat! W zbiorniku próżnia wyciąga z niej gaz w maleńkich pęcherzykach.',
          sci: 'Pompa podnosi wodę gruntową do zbiornika; próżnia wydziela z niej rozpuszczony gaz.',
        },
        off: { kid: 'Pompa stoi. Dotknij jej jeszcze raz, żeby ruszyć dalej.', sci: 'Pompa zatrzymana; licznik litrów stoi.' },
        few: {
          kid: 'Jeszcze za mało! Krypton jest tak rzadki, że potrzeba tysięcy litrów.',
          sci: 'Na razie za mało wody: przy zaledwie około 50 nanolitrach kryptonu w litrze zespół potrzebował tysięcy litrów.',
        },
        empty: {
          kid: 'Butla jest pusta. Najpierw popompuj wodę, potem otwórz zawór zbiornika.',
          sci: 'W butli jeszcze nic nie ma: popompuj dość wody, potem otwórz zawór zbiornika.',
        },
        valve: {
          kid: 'Gaz płynie do butli. Teraz dotknij butli, żeby zobaczyć, co w niej jest.',
          sci: 'Wydzielony gaz trafia do butli z próbką. Dotknij jej, żeby zobaczyć składniki.',
        },
        bottle: {
          kid: 'Prawie sam azot, trochę argonu i kilka atomów kryptonu ukrytych pośród nich.',
          sci: 'Zdecydowanie najwięcej azotu, potem argon; krypton to tylko około 3 atomów na milion. Chemicy oddzielają go od reszty, zanim trafi do pułapki.',
        },
      },
      board: {
        title: 'Co jest w gazie',
        nitrogen: 'azot',
        argon: 'argon',
        krypton: 'krypton',
        ratio: 'Około {n} atomy kryptonu na każdy milion azotu',
        note: 'kropki nie w skali',
      },
      panel: {
        kid: [
          'Przy studni pompa wydobywa starożytną wodę. Żeby odczytać jej krypton, naukowcy potrzebują gazu rozpuszczonego w wodzie. Pompują tysiące litrów przez zbiornik, w którym próżnia sprawia, że gaz wydobywa się pęcherzykami.',
          'Krypton jest bardzo rzadki: z tysiąca litrów dostaje się go o wiele mniej niż kroplę. Dlatego prawie wszystko, co się złapie, to azot, potem argon, a kryptonu tylko kilka atomów na milion azotu.',
        ],
        sci: [
          'W 2004 roku zespół (Sturchio i współpracownicy) pompował wodę gruntową w sześciu punktach terenowych na Pustyni Zachodniej w Egipcie i odgazowywał rozpuszczony gaz w próżni, z kilku ton wody na próbkę. Gaz jest potem oczyszczany, a krypton oddzielany, zanim zobaczy go pułapka atomowa.',
          'Woda w równowadze z powietrzem w 10 °C zawiera na litr około 14 mL azotu, 0,35 mL argonu i 0,00005 mL (50 nL) kryptonu (przy normalnym ciśnieniu): około 3 atomów kryptonu na milion azotu i około 50 mikrolitrów kryptonu z tysiąca litrów. Prawdziwa kopalna woda gruntowa różni się trochę (inne temperatury zasilania, więcej helu lub metanu), więc tablica pokazuje przypadek wyidealizowany.',
        ],
      },
    },
    trap: {
      label: 'Pułapka na atomy',
      title: 'Łapanie pojedynczych atomów',
      labels: { cylinder: 'gaz krypton', air: 'dzisiejsze powietrze', water: 'woda ze studni', dial: 'pozostało kryptonu-81', lasers: 'lasery', trap: 'pułapka' },
      screen: {
        title: 'Kamera pułapki',
        idle: { kid: 'Dotknij gazu kryptonu', sci: 'Gaz jeszcze nie płynie' },
        air: 'próbka: dzisiejsze powietrze',
        water: 'próbka: woda ze studni',
        caught: 'złapane atomy kryptonu-81: {n}',
        left: 'pozostało kryptonu-81: {n} % wartości z powietrza',
        age: 'ma około {n} lat',
        fresh: 'młoda jak powietrze',
      },
      hints: {
        gas: 'Dotknij gazu kryptonu, żeby popłynął',
        air: 'Dotknij butelki z powietrzem i policz jego krypton-81',
        water: 'Dotknij butelki z wodą ze studni i policz jeszcze raz',
        mark: 'Dotknij znaku na tarczy: ile lat ma woda?',
        again: 'Dotknij butelek albo znaku na tarczy, żeby porównać',
      },
      buttons: { gas: 'Puść krypton', stop: 'Zatrzymaj gaz', air: 'Policz powietrze', water: 'Policz wodę ze studni', mark: 'Woda sprzed 458 000 lat' },
      slider: 'Wiek wody ze studni',
      says: {
        gas: {
          kid: 'Krypton wpływa z lewej. Patrz: prawie cały leci prosto na wylot. Tylko rzadki krypton-81 zwalnia, zostaje złapany i świeci!',
          sci: 'Krypton płynie przez pułapkę; lasery działają tylko na krypton-81, więc tylko jego atomy zwalniają i zostają złapane.',
        },
        stop: { kid: 'Gaz wyłączony. W pułapce cisza.', sci: 'Gaz wyłączony; nie ma już czego łapać.' },
        air: {
          kid: 'Dzisiejsze powietrze: dużo złapanych. Tyle dałaby świeża woda.',
          sci: 'Współczesne powietrze wyznacza wzorcową szybkość zliczeń: 100 %.',
        },
        water: {
          kid: 'Woda ze studni: mniej złapanych niż w powietrzu. Część jej kryptonu-81 zniknęła, i to mówi nam, ile ma lat!',
          sci: 'Mniej atomów kryptonu-81 na atom kryptonu niż w powietrzu: stosunek daje wiek.',
        },
        mark: {
          kid: 'Połowa zostaje po 229 000 latach, jedna czwarta po 458 000, i tak dalej: każde połowienie to kolejne 229 000 lat.',
          sci: 'wiek = 229 000 lat x log2(1 / pozostała część): połowa 229 000, jedna czwarta 458 000, jedna ósma 687 000, jedna szesnasta około 916 000.',
        },
      },
      panel: {
        kid: [
          'To jest pułapka na atomy. Gaz krypton wlatuje z lewej. Trzy pary wiązek laserowych krzyżują się pośrodku, dostrojone tak, że zwraca na nie uwagę tylko krypton-81: zwalnia, utyka tam, gdzie się krzyżują, i świeci, a kamera go widzi. Cały pozostały krypton leci prosto dalej.',
          'Krypton-81 jest w powietrzu tak rzadki, że na każdy atom trzeba długo czekać. Tutaj łapie się je o wiele częściej niż naprawdę, żebyś mógł je zobaczyć. Policz najpierw powietrze, potem wodę ze studni: mniej złapanych znaczy starsza woda. Dwa razy mniej to 229 000 lat, cztery razy mniej 458 000.',
        ],
        sci: [
          'Atom Trap Trace Analysis (ATTA) opracowała w Argonne National Laboratory grupa Zheng-Tiana Lu (Chen i współpracownicy, Science, 1999). Wyładowanie podnosi atomy kryptonu do długo żyjącego stanu wzbudzonego; światło lasera w pobliżu 811 nm, dostrojone tylko do kryptonu-81 (maleńkie przesunięcie jego linii widmowej), zwalnia je i zatrzymuje w pułapce magnetooptycznej, gdzie krzyżują się trzy pary wiązek. Każdy uwięziony atom rozprasza światło i widać go jako pojedynczy punkt.',
          'Wiek wynika ze stosunku szybkości zliczeń kryptonu-81 w próbce do tej w powietrzu współczesnym: t = 229 000 lat x log2(R powietrza / R próbki). Około jeden atom kryptonu na dwa biliony w powietrzu to krypton-81; złapane atomy pokazano tu o wiele częściej. Sturchio i współpracownicy znaleźli od 200 000 do 1 miliona lat w nubijskim systemie wodonośnym; ten sam zegar wyznaczył wiek lodu z Lodowca Taylora na Antarktydzie na 120 000 lat (Buizert i współpracownicy, PNAS, 2014).',
        ],
      },
    },
  },
  de: {
    title: 'Eine Oase in der Westlichen Wüste',
    greet: {
      kid: 'Wir sind im Bild: eine Oase in der Sahara in der Dämmerung! Sieh dir das lange Fenster bei den Dünen an: Es zeigt, was unter dem Sand liegt, ein verborgenes Meer aus Wasser, das eine Million Jahre alt ist. Krypton hilft uns, sein Alter zu erfahren. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Eine Oase in Ägyptens Westlicher Wüste in der Dämmerung, über dem Nubischen Sandstein-Aquifer. Krypton-81 mit einer Halbwertszeit von 229 000 Jahren datiert sein Wasser. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Mein Name bedeutet auf Griechisch "verborgen". Forscher entdeckten Krypton 1898, und all die Jahre davor versteckte es sich in der Luft um uns herum!',
        'Ein Krypton-81-Atom ist sehr selten. Nur etwa eines von zwei Billionen Kryptonatomen ist von dieser Sorte. Darum braucht man eine Falle, die einzelne Atome fängt.',
        'In der Sahara kann der Sand über einem verborgenen Meer liegen. In Ägypten graben Menschen Brunnen und pumpen das Wasser auf ihre Felder.',
        'Die Sahara war zuletzt vor nur etwa fünftausend Jahren grün. Das Wasser hier unten fiel schon viel früher als Regen.',
      ],
      sci: [
        'Krypton (griechisch kryptos, verborgen) wurde im Mai 1898 in London von Ramsay und Travers entdeckt, in dem Gas, das beim Verdampfen flüssiger Luft übrig blieb.',
        'Krypton-81 hat eine Halbwertszeit von 229 000 Jahren. Krypton-85, das aus Kernreaktoren stammt, nur 10,7 Jahre. Die Uhr dieses Raums ist die erste.',
        'Die letzte grüne Sahara, die Afrikanische Feuchtperiode, endete vor etwa 5 000 Jahren. Das hier gezählte Wasser fiel viel früher, in älteren Regenzeiten.',
        'Die Krypton-81-Datierung reicht von etwa 50 000 Jahren bis zu etwa einer Million: älter, als Radiokohlenstoff sehen kann, jünger als die meisten Gesteinsuhren.',
      ],
    },
    source: {
      label: 'Das verborgene Meer',
      title: 'Woher das Wasser kam',
      face: {
        hills: 'Uweinat-Berge',
        oasis: 'die Oase',
        sandstone: 'Sandstein voller Wasser',
        rock: 'hartes Gestein',
        drop: 'der erste Tropfen',
        kr: 'Krypton',
        kr81: 'Krypton-81 (viel zu oft gezeigt)',
        cloud: 'Tippe den Regen an',
        ago: 'vor {n} Jahren',
        today: 'heute',
        journey: 'Der erste Tropfen ist {d} gekrochen',
        creep: 'mit 1 Meter im Jahr',
      },
      track: { start: 'vor 1 Million Jahren', end: 'heute' },
      dist: { m: '{n} m', km: '{n} km' },
      hints: {
        rain: 'Tippe die Regenwolke an',
        wait: 'Tippe die Zeitleiste an, um eine feuchte Zeit zu finden',
        time: 'Tippe die Zeitleiste an, damit die Jahre vergehen',
        again: 'Tippe die Zeitleiste an, um zurückzugehen und noch einmal zu schauen',
      },
      buttons: { rain: 'Regnen lassen', step: '100 000 Jahre später', back: 'Zurück zu vor einer Million Jahren' },
      slider: 'Zeit',
      says: {
        rain: {
          kid: 'Regen auf den Bergen! Jeder Tropfen trägt ein wenig Krypton aus der Luft mit. Fast alles ist gewöhnlich, aber ein paar Atome, die großen, sind Krypton-81.',
          sci: 'Regen löst die Gase der Luft, auch Krypton. Etwa eines von zwei Billionen Kryptonatomen ist Krypton-81; das Fenster zeichnet viel zu viele, damit man sie sieht.',
        },
        soak: {
          kid: 'Der Regen sickert in den Sandstein wie Wasser in einen Schwamm und beginnt nach Norden zu kriechen.',
          sci: 'Das Wasser dringt bei den Uweinat-Bergen in den Sandstein ein und beginnt, durch dessen Poren nach Norden zu fließen.',
        },
        fade: {
          kid: 'Sieh dir die großen Kryptonpunkte an: Sie verblassen. Unter der Erde macht niemand neues Krypton-81, darum verschwindet es langsam.',
          sci: 'Unter der Erde entsteht kein neues Krypton-81, jedes Atom kann also zerfallen: Alle 229 000 Jahre ist die Hälfte weg.',
        },
        dry: {
          kid: 'Die Wüste kommt zurück, und hier oben sieht es aus, als wäre nichts geschehen. Aber unter dem Sand kriecht das Wasser weiter.',
          sci: 'Das Klima trocknet aus und die Dünen kehren zurück, aber das Grundwasser fließt darunter weiter, ein bis zwei Meter im Jahr.',
        },
        wet: {
          kid: 'Wieder nass! Mehr Regen sickert hinter dem ersten Tropfen ein.',
          sci: 'Eine weitere Pluvialzeit: neue Neubildung, hinter dem Wasser, das zuerst fiel.',
        },
        today: {
          kid: 'Heute! Der erste Tropfen ist etwa tausend Kilometer gekrochen, und jetzt pumpen Menschen ihn herauf. Nur etwa ein Zwanzigstel seines Krypton-81 ist noch übrig.',
          sci: 'Heute. Nach einer Million Jahren mit 1 m im Jahr hat der erste Tropfen etwa 1 000 km zurückgelegt. Nur etwa 5 % seines Krypton-81 sind übrig (4,4 Halbwertszeiten).',
        },
      },
      panel: {
        kid: [
          'Das lange Fenster zeigt, was unter dem Sand liegt. Im Südwesten, über den Uweinat-Bergen, fiel Regen, als die Sahara grün war, und sickerte in den Sandstein wie Wasser in einen Schwamm. Gleite durch eine Million Jahre: Die Wüste kommt und geht, und das Wasser kriecht weiter nach Norden.',
          'Es kriecht nur ein oder zwei Meter im Jahr, aber eine Million Jahre sind sehr lang. Die hier gezeichneten nassen und trockenen Zeiten sind nur zum Anschauen; die echten kamen in keinem ordentlichen Muster.',
        ],
        sci: [
          'Das Nubische Sandstein-Aquifersystem liegt unter Ägypten, Libyen, dem Sudan und dem Tschad und ist einer der größten Vorräte uralten Grundwassers der Erde. Sturchio und Kollegen (Geophysical Research Letters, 2004) maßen Krypton-81 in seinem Wasser in Ägyptens Westlicher Wüste und fanden Alter von etwa 200 000 bis 1 Million Jahren, passend zu einem Fluss aus einem Neubildungsgebiet nahe der Uweinat-Aufwölbung im Südwesten. Wasserstoffisotope im selben Wasser deuten auf Regen vom Atlantik in feuchteren (pluvialen) Perioden des Pleistozäns.',
          'Die Fließgeschwindigkeit liegt in der Größenordnung von ein bis zwei Metern im Jahr; der Zähler nimmt 1 m im Jahr an und zeigt, wie weit ein Tropfen käme. Die hier gezeichneten Feuchtphasen sind schematisch, keine Klimaaufzeichnung, und der Schnitt ist nicht maßstabsgerecht.',
        ],
      },
    },
    well: {
      label: 'Der Brunnen',
      title: 'Das Gas einfangen',
      labels: { pump: 'Pumpe', tank: 'Entgasungstank', valve: 'Gasventil', bottle: 'Gasflasche', litres: '{n} Liter' },
      hints: {
        pump: 'Tippe die Pumpe an, um das Wasser heraufzuholen',
        more: 'Pumpe weiter: Es braucht Tausende Liter',
        valve: 'Tippe das Ventil oben auf dem Tank an',
        bottle: 'Tippe die Gasflasche an, um zu sehen, was darin ist',
        again: 'Tippe die Pumpe an, um von vorn zu beginnen',
      },
      buttons: { pump: 'Pumpen starten', stop: 'Pumpen stoppen', valve: 'Gas sammeln', bottle: 'Gas auftrennen', fresh: 'Von vorn beginnen' },
      says: {
        on: {
          kid: 'Die Pumpe holt Wasser herauf, das eine Million Jahre alt ist! Im Tank zieht ein Vakuum das Gas in winzigen Bläschen heraus.',
          sci: 'Die Pumpe hebt das Grundwasser in den Tank; ein Vakuum treibt das gelöste Gas aus.',
        },
        off: { kid: 'Pumpe gestoppt. Tippe sie noch einmal an, um weiterzumachen.', sci: 'Pumpe gestoppt; der Literzähler bleibt stehen.' },
        few: {
          kid: 'Noch nicht genug! Krypton ist so selten, dass man Tausende Liter braucht.',
          sci: 'Bisher zu wenig Wasser: Bei nur etwa 50 Nanolitern Krypton je Liter brauchte das Team Tausende Liter.',
        },
        empty: {
          kid: 'Die Flasche ist leer. Pumpe zuerst das Wasser, dann öffne das Ventil am Tank.',
          sci: 'Noch nichts in der Flasche: pumpe genug Wasser, dann öffne das Ventil des Tanks.',
        },
        valve: {
          kid: 'Das Gas strömt in die Flasche. Tippe jetzt die Flasche an, um zu sehen, was darin ist.',
          sci: 'Das ausgetriebene Gas geht in die Probenflasche. Tippe sie an, um die Bestandteile zu sehen.',
        },
        bottle: {
          kid: 'Fast nur Stickstoff, ein bisschen Argon und ein paar Kryptonatome, die sich dazwischen verstecken.',
          sci: 'Bei Weitem am meisten Stickstoff, dann Argon; Krypton sind nur etwa 3 Atome auf eine Million. Chemiker trennen es vom Rest, bevor es in die Falle kommt.',
        },
      },
      board: {
        title: 'Was im Gas ist',
        nitrogen: 'Stickstoff',
        argon: 'Argon',
        krypton: 'Krypton',
        ratio: 'Etwa {n} Kryptonatome auf eine Million Stickstoffatome',
        note: 'Punkte nicht maßstabsgerecht',
      },
      panel: {
        kid: [
          'Am Brunnen holt die Pumpe das uralte Wasser herauf. Um sein Krypton zu lesen, brauchen die Forscher das Gas, das im Wasser gelöst ist. Sie pumpen Tausende Liter durch einen Tank, in dem ein Vakuum das Gas herausperlen lässt.',
          'Krypton ist sehr selten: Aus tausend Litern bekommt man viel weniger als einen Tropfen davon. Fast alles, was man fängt, ist darum Stickstoff, dann Argon, und nur ein paar Kryptonatome auf eine Million Stickstoffatome.',
        ],
        sci: [
          'Im Jahr 2004 pumpte das Team (Sturchio und Kollegen) Grundwasser an sechs Feldstandorten in Ägyptens Westlicher Wüste und trieb das gelöste Gas im Vakuum aus, aus mehreren Tonnen Wasser je Probe. Das Gas wird dann gereinigt und das Krypton abgetrennt, bevor die Atomfalle es sieht.',
          'Wasser im Gleichgewicht mit Luft bei 10 °C enthält je Liter etwa 14 mL Stickstoff, 0,35 mL Argon und 0,00005 mL (50 nL) Krypton (bei Normaldruck): etwa 3 Kryptonatome auf eine Million Stickstoffatome und etwa 50 Mikroliter Krypton aus tausend Litern. Echtes fossiles Grundwasser weicht etwas ab (andere Neubildungstemperaturen, zusätzliches Helium oder Methan), die Tafel zeigt darum den idealisierten Fall.',
        ],
      },
    },
    trap: {
      label: 'Die Atomfalle',
      title: 'Einzelne Atome fangen',
      labels: { cylinder: 'Kryptongas', air: 'Luft von heute', water: 'das Wasser des Brunnens', dial: 'Krypton-81 übrig', lasers: 'Laser', trap: 'Falle' },
      screen: {
        title: 'Kamera der Falle',
        idle: { kid: 'Tippe das Kryptongas an', sci: 'Noch kein Gas im Fluss' },
        air: 'Probe: Luft von heute',
        water: 'Probe: das Wasser des Brunnens',
        caught: 'Krypton-81 gefangen: {n}',
        left: 'Krypton-81 übrig: {n} % der Luft',
        age: 'etwa {n} Jahre alt',
        fresh: 'so jung wie die Luft',
      },
      hints: {
        gas: 'Tippe das Kryptongas an, damit es strömt',
        air: 'Tippe die Luftflasche an und zähle ihr Krypton-81',
        water: 'Tippe die Flasche mit dem Brunnenwasser an und zähle noch einmal',
        mark: 'Tippe eine Marke auf der Skala an: Wie alt ist das Wasser?',
        again: 'Tippe die Flaschen oder eine Marke auf der Skala an, um zu vergleichen',
      },
      buttons: { gas: 'Krypton strömen lassen', stop: 'Gas anhalten', air: 'Luft zählen', water: 'Brunnenwasser zählen', mark: 'Wasser, 458 000 Jahre alt' },
      slider: 'Alter des Brunnenwassers',
      says: {
        gas: {
          kid: 'Krypton strömt von links herein. Schau: Fast alles fliegt geradeaus hindurch. Nur das seltene Krypton-81 wird langsam, bleibt hängen und leuchtet!',
          sci: 'Krypton strömt durch die Falle; die Laser wirken nur auf Krypton-81, darum werden nur seine Atome langsam und gefangen.',
        },
        stop: { kid: 'Gas aus. Die Falle ist still.', sci: 'Gas aus; nichts mehr zu fangen.' },
        air: {
          kid: 'Luft von heute: viele Fänge. So viel gäbe frisches Wasser.',
          sci: 'Moderne Luft legt die Bezugszählrate fest: 100 %.',
        },
        water: {
          kid: 'Das Brunnenwasser: weniger Fänge als die Luft. Ein Teil seines Krypton-81 ist verschwunden, und das verrät uns sein Alter!',
          sci: 'Weniger Krypton-81-Atome je Kryptonatom als in der Luft: Das Verhältnis ergibt das Alter.',
        },
        mark: {
          kid: 'Die Hälfte übrig heißt 229 000 Jahre, ein Viertel 458 000, und so weiter: Jede Halbierung sind weitere 229 000 Jahre.',
          sci: 'Alter = 229 000 Jahre x log2(1 / übrig gebliebener Anteil): die Hälfte 229 000, ein Viertel 458 000, ein Achtel 687 000, ein Sechzehntel etwa 916 000.',
        },
      },
      panel: {
        kid: [
          'Das ist die Atomfalle. Kryptongas fliegt von links herein. Drei Paar Laserstrahlen kreuzen sich in der Mitte, so abgestimmt, dass nur Krypton-81 sie beachtet: Es wird langsamer, bleibt dort hängen, wo sie sich kreuzen, und leuchtet, und eine Kamera sieht es. Alles andere Krypton fliegt geradeaus weiter.',
          'Krypton-81 ist in der Luft so selten, dass man auf jedes Atom lange wartet. Hier kommen die Fänge viel öfter als im echten Leben, damit du sie sehen kannst. Zähle zuerst die Luft, dann das Brunnenwasser: Weniger Fänge heißt älteres Wasser. Halb so viele heißt 229 000 Jahre, ein Viertel 458 000.',
        ],
        sci: [
          'Die Atom Trap Trace Analysis (ATTA) wurde am Argonne National Laboratory von der Gruppe um Zheng-Tian Lu entwickelt (Chen und Kollegen, Science, 1999). Eine Entladung hebt Kryptonatome in einen langlebigen angeregten Zustand; Laserlicht nahe 811 nm, nur auf Krypton-81 abgestimmt (die winzige Verschiebung seiner Spektrallinie), bremst und hält sie in einer magneto-optischen Falle, wo sich drei Strahlenpaare kreuzen. Jedes gefangene Atom streut Licht und zeigt sich als einzelner Punkt.',
          'Das Alter folgt aus dem Verhältnis der Krypton-81-Zählrate der Probe zu der moderner Luft: t = 229 000 Jahre x log2(R Luft / R Probe). Etwa eines von zwei Billionen Kryptonatomen in der Luft ist Krypton-81; die Fänge werden hier viel öfter gezeigt. Sturchio und Kollegen fanden 200 000 bis 1 Million Jahre im Nubischen Aquifer; dieselbe Uhr datierte 120 000 Jahre altes Eis am Taylor-Gletscher in der Antarktis (Buizert und Kollegen, PNAS, 2014).',
        ],
      },
    },
  },
}
