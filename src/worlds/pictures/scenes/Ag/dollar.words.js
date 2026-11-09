// The words of silver's dollar room ("Why is a dollar called a dollar?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Ag.js (the easel shows it); this room adds the things to do: cut a giant piece of
// eight into bits and weigh them, follow the silver roads on a map by years, and test coins like a purser.
// Sources (checked 2026-11-09): the piece of eight, 8 reales, authorised 1497 and fixed in 1537 at 27.47 g
// of 0.9305 fine silver (11 dineros 4 granos; University of Notre Dame's colonial coin notes, Wikipedia
// "Spanish dollar"); bits: a "bit" is one real, an eighth, 12.5 cents; "two bits", a quarter of a dollar;
// cobs hand-struck, at Potosí until 1773; milled pillar dollars (columnarios) from 1732 at Mexico City, round
// with a milled edge so clipping shows. Joachimsthal (Jachymov): silver found 1516, on 9 January 1520 the
// Schlick counts allowed to strike the Guldengroschen, about 12 million thalers by the mid-1500s (Czech Mint,
// Radio Prague, BBC; the first thalers' weight differs by source, about 27.6 to 29.3 g, so none is given).
// Potosi: founded 1545 after silver was found on the Cerro Rico (UNESCO), about 4000 m up, a royal mint from
// the 1570s (sources give 1572 to 1575, so "the 1570s"); Mexico City's mint, the first of the Americas, from
// the 1530s; Zacatecas and Guanajuato. Manila galleons 1565 to 1815. US Coinage Act of 2 April 1792: the
// dollar of 371.25 grains of pure silver (24.06 g); Spanish dollars legal tender in the USA until 21 February
// 1857. Densities from src/data/elements.json: silver 10.501, copper 8.96, tin 7.287, lead 11.342 g/cm3; the
// 93% coin is 1 / (0.93 / 10.501 + 0.07 / 8.96) = 10.37 g/cm3, 27.47 g takes 2.65 cm3, and a fake of the
// same size weighs density x 2.65 cm3: lead 30.0 g, copper 23.7 g, tin 19.3 g. The ring test is a rough,
// traditional test. Real people: no invented words in their mouths.

const EN = {
  title: 'The treasure galleon',
  greet: {
    kid: 'We are inside the picture, on a Spanish treasure galleon at anchor off America, on a moonlit night! On the left, a giant piece of eight, a chisel and a scale. In the cabin, a map of where the silver came from. On the right, the purser’s corner, where coins are tested. The picture’s story is on the easel.',
    sci: 'The deck of a Spanish treasure galleon at anchor off the American coast, at night. Left, in the waist: a model piece of eight (8 reales) to cut into bits and weigh. Great cabin: a map table of the silver roads, 1500 to 1857. Right, the purser’s corner: a coin tested by ring, volume and mass. The picture’s story is on the easel.',
  },
  talk: {
    kid: [
      'That is me in every coin! I am shiny, I do not rust, and a little copper mixed in makes me strong enough to be money.',
      'My symbol, Ag, comes from “argentum”, the Latin word for silver. The country Argentina is named after me, and so is the River Plate: “river of silver”.',
      'Beware of fakes! Lead is almost as heavy as I am. Only a scale and a little tube of water can tell us apart.',
    ],
    sci: [
      'A piece of eight was 93% silver (11 dineros and 4 granos, 0.9305 fine) and the rest copper: pure silver is too soft to circulate for long.',
      'Ag is from the Latin argentum; Argentina and the Río de la Plata (River of Silver) are named after it. Silver melts at 961.78 °C and has a density of 10.50 g/cm3.',
      'Lead, 11.34 g/cm3, is only 8% denser than silver, 10.50, and a 93% silver coin sits near 10.4: forgers knew it, so a purser measures volume and mass together.',
    ],
  },
  pieces: {
    label: 'Pieces of eight',
    title: 'A piece of eight, cut into bits',
    hints: {
      chisel: 'Tap the chisel',
      cob: 'Tap the rough coin',
      milled: 'Tap the round coin',
      fresh: 'Tap the coin for a fresh one',
    },
    buttons: { cut: 'Cut the coin', cob: 'Clip the rough coin', milled: 'Clip the round coin', fresh: 'A fresh coin' },
    signs: { cob: 'A cob: hand-struck', milled: 'A milled coin, 1732' },
    board: {
      name: [
        { kid: 'The whole coin: 8 reales', sci: 'Piece of eight: 8 reales' },
        { kid: 'A half: 4 reales', sci: 'A half: 4 reales' },
        { kid: 'A quarter: 2 reales, “two bits”', sci: 'A quarter: 2 reales, “two bits”' },
        { kid: 'An eighth: 1 real, “one bit”', sci: 'An eighth: 1 real, “one bit”, 12½ cents' },
      ],
      weigh: 'On the scale',
    },
    says: {
      cut1: {
        kid: 'One blow of the chisel: two halves! Each half is worth 4 reales and weighs {g} g.',
        sci: 'Cut in two: halves of 4 reales, {g} g each (27.47 g ÷ 2).',
      },
      cut2: {
        kid: 'Four quarters, 2 reales each: “two bits”! That is why a quarter of a dollar is still called “two bits” in the USA. One quarter weighs {g} g.',
        sci: 'Quarters of 2 reales, “two bits”, {g} g each. The US quarter dollar kept the nickname.',
      },
      cut3: {
        kid: 'Eight bits, one real each, {g} g each. A bit was the smallest change you could make.',
        sci: 'Eighths, one real or “one bit” each, {g} g: an eighth of a dollar, 12½ cents.',
      },
      fresh: { kid: 'A whole new coin, ready to be cut again.', sci: 'A fresh coin: 27.47 g.' },
      cob: {
        kid: 'This is a “cob”: hit by hand, lumpy, never quite round, its stamp half missing. A thief has shaved a little silver off its edge, and who could tell?',
        sci: 'A cob, struck by hand (at Potosí until 1773). Its edge was never round, so silver clipped from it showed little.',
      },
      milled: {
        kid: 'The round coins made by a machine have a pattern round the edge. Clip a bit off and the pattern breaks: everyone can see it! These came in 1732.',
        sci: 'From 1732 Mexico City struck round, machine-made “pillar dollars” with a milled edge: clipped silver shows at once.',
      },
    },
    panel: {
      kid: [
        'A piece of eight was a big silver coin worth eight reales. Hardly anyone had small change, so people simply cut the coin with a chisel. One eighth was a “bit”, and two bits made a quarter: in the USA a quarter of a dollar is still called “two bits”.',
        'Tap the chisel to cut the coin, then look at the two small coins on the little table. The rough one, a “cob”, was hit by hand. The round one was made by a machine, with a pattern round its edge so you can see if anyone cut a piece off.',
      ],
      sci: [
        'Spain fixed the silver piece of eight in 1537 at 27.47 g of silver of 93% fineness. Cut coins passed by weight: a half is 13.73 g, a quarter 6.87 g, an eighth, one real or “bit”, 3.43 g. A bit was 12½ cents of a dollar.',
        'Hand-struck cobs, made at Potosí until 1773, differ in shape and weight, so clipping was hard to see. Round, machine-struck milled pillar dollars came from 1732 at Mexico City; their milled edge shows at once where silver was taken.',
      ],
    },
  },
  map: {
    label: 'Where the silver came from',
    title: 'The silver roads',
    slider: 'The year',
    hints: {
      joachim: 'Tap the pin in Bohemia',
      potosi: 'Tap the pin in the Andes',
      mexico: 'Tap the pin in Mexico',
      manila: 'Tap the pin at Manila',
      seville: 'Tap the pin at Seville',
      done: 'Tap a pin, or slide the years',
    },
    buttons: { joachim: 'Joachimsthal', potosi: 'Potosí', mexico: 'Mexico', seville: 'Seville', manila: 'Manila' },
    geo: { atlantic: 'Atlantic Ocean', pacific: 'Pacific Ocean', toManila: 'to Manila', fromAcapulco: 'from Acapulco', bohemia: 'Bohemia', seville: 'Seville', mexico: 'Zacatecas, Guanajuato', potosi: 'Potosí', manila: 'Manila', year: 'Year' },
    start: { kid: 'Slide the years from 1500 and watch the silver start to move.', sci: 'Slide the years, 1500 to 1857: each road lights up when its silver began to flow.' },
    says: {
      joachim: {
        kid: 'In 1516 miners found a huge amount of silver in the valley of Joachimsthal in Bohemia. In 1520 the town began to strike big silver coins: thalers. Watch the name travel: tolar, talar, Taler, daler, dollar!',
        sci: 'Joachimsthal (Jáchymov): silver found in 1516; on 9 January 1520 the Schlick counts were allowed to strike large coins of about 93% silver, the Guldengroschen. About 12 million thalers had spread over Europe by the mid-1500s: tolar, talar, Taler, daler, dollar.',
      },
      potosi: {
        kid: 'Potosí, in the Andes in today’s Bolivia, 4000 m above the sea: the “Rich Hill”, Cerro Rico, was one of the biggest silver mountains ever found. Llamas and mules carried the silver down to the coast.',
        sci: 'Potosí, about 4000 m up in the Andes: the town was founded in 1545 after silver was found on Cerro Rico, and a royal mint struck coins there from the 1570s. Llama and mule trains took the silver to the Pacific coast, then ships to Panama and, by mule across the isthmus, to the treasure fleet.',
      },
      mexico: {
        kid: 'Mexico had great silver mines too, at Zacatecas and Guanajuato. In Mexico City the first mint of the Americas struck pieces of eight from the 1530s. Mules took the silver to the port of Veracruz, and ships took it to Spain.',
        sci: 'Zacatecas and Guanajuato: Mexico’s great silver mines. The Mexico City mint, the first of the Americas, struck pieces of eight from the 1530s; mule trains carried the silver to Veracruz for the fleet to Seville, or to Acapulco for the Manila galleon.',
      },
      seville: {
        kid: 'The treasure fleets crossed the Atlantic and came to Seville, in Spain, loaded with silver. From there, pieces of eight spread across Europe and the world.',
        sci: 'The fleets sailed from Havana to Seville, home of the House of Trade, which controlled trade with the Americas. From Spain, Spanish silver spread through Europe and the Mediterranean.',
      },
      manila: {
        kid: 'From 1565 to 1815, Manila galleons sailed across the Pacific from Acapulco in Mexico to Manila, with silver on board, and came back with silk and porcelain from China. That is how pieces of eight reached China.',
        sci: 'The Manila galleons, 1565 to 1815, carried silver from Acapulco to Manila, where it bought Chinese silk, porcelain and spices: the piece of eight became the first world currency.',
      },
    },
    years: [
      { y: 1516, kid: '1516: silver is found at Joachimsthal, in Bohemia.', sci: '1516: silver is found at Joachimsthal (Jáchymov), Bohemia.' },
      { y: 1520, kid: '1520: the first big silver coins, thalers, are struck. The word “dollar” starts here.', sci: '1520, 9 January: the Schlick counts may strike the Guldengroschen, the first thalers.' },
      { y: 1537, kid: '1537: Spain fixes the piece of eight: 27.47 grams, nearly pure silver.', sci: '1537: the piece of eight is fixed at 27.47 g of 93% silver; Mexico City has struck it since the 1530s.' },
      { y: 1545, kid: '1545: silver is found on the Cerro Rico at Potosí, in the Andes.', sci: '1545: Potosí is founded after silver is found on the Cerro Rico.' },
      { y: 1565, kid: '1565: the first Manila galleons sail between Mexico and the Philippines.', sci: '1565: the Manila galleon trade begins; it lasts until 1815.' },
      { y: 1575, kid: 'The 1570s: Potosí gets its own mint, so its silver becomes coins right there.', sci: 'The 1570s: a royal mint is working at Potosí (sources give 1572 to 1575).' },
      { y: 1732, kid: '1732: round coins made by a machine, with a pattern on the edge.', sci: '1732: Mexico City strikes the round, milled pillar dollars.' },
      { y: 1792, kid: '1792: the United States makes its own dollar, copied from the Spanish one.', sci: '1792: the US Coinage Act defines the dollar by weight: 371.25 grains, 24.06 g, of pure silver.' },
      { y: 1815, kid: '1815: the last Manila galleon sails.', sci: '1815: the last Manila galleon sails.' },
      { y: 1857, kid: '1857: Spanish dollars stop being money in the USA. The story ends.', sci: '1857, 21 February: Spanish dollars stop being legal tender in the USA.' },
    ],
    panel: {
      kid: [
        'This is the silver map. Silver came out of mines in Bohemia, Mexico and the Andes, and travelled by ship, mule and llama to become coins. Tap a pin to hear its story, or slide the years and watch the roads light up.',
        'Look how the word travelled: thaler, tolar, daler, dollar. In 1792 the new United States chose “dollar” for its own coin, because that was what people called the big Spanish silver coins.',
      ],
      sci: [
        'Silver set world trade moving: Joachimsthal in 1516, Potosí from 1545, Mexico’s mint from the 1530s, the Manila galleons from 1565 to 1815. The slider runs from 1500 to 1857; a road lights up when its silver began to flow.',
        'The US Coinage Act of 1792 defined the dollar by weight, 371.25 grains (24.06 g) of pure silver, after the Spanish dollar then in use; Spanish dollars stayed legal tender in the USA until 21 February 1857.',
      ],
    },
  },
  purser: {
    label: 'Is it real silver?',
    title: 'The purser’s test',
    hints: {
      coin: 'Tap a coin',
      can: 'Tap the can to dip the coin',
      pan: 'Tap the scale to weigh the coin',
      next: 'Tap another coin',
    },
    buttons: { coin: 'Next coin on the slab', can: 'Dip it in the can', pan: 'Weigh it', },
    signs: { slab: 'Ring test', can: 'Volume, mL' },
    mats: { ag: 'silver', pb: 'lead', cu: 'copper', sn: 'tin' },
    board: { title: 'Density, g/cm3', coin: 'Coin {n} of 6', unknown: 'not measured yet', alloy: 'silver coin' },
    says: {
      ring: {
        ag: { kid: 'Ding! It rings clear and long, like a tiny bell. A good sign, but not proof.', sci: 'A clear, long ring: a good sign, but only a rough test.' },
        pb: { kid: 'Thud. Lead is soft and dull: it does not ring.', sci: 'A dull thud: soft metal under a silver skin. A rough test.' },
        cu: { kid: 'Clunk. A shorter, duller sound than silver.', sci: 'Shorter and duller than silver, but ears can be fooled: a rough test.' },
        sn: { kid: 'A dull little tick. Tin does not ring like silver.', sci: 'A short, dull sound. A rough test only.' },
      },
      dip: {
        kid: 'The coin sinks and the water spills up the little tube: {v} mL. That is how much room the coin takes.',
        sci: 'Displaced water: {v} mL (cm3), the coin’s volume (Archimedes’ way).',
      },
      weigh: {
        kid: 'The scale says {m} g.',
        sci: 'Mass {m} g. Density = {m} g ÷ {v} cm3 = {d} g/cm3.',
      },
      verdict: {
        ag: { kid: '{d}: right for silver with a little copper (about 10.4). A real coin!', sci: '{d} g/cm3: a 93% silver alloy (about 10.4; pure silver 10.50). True.' },
        pb: { kid: '{d}: that is lead, 11.3! A fake with a thin silver coat.', sci: '{d} g/cm3: lead (11.34), not silver. It is close, so volume and mass must be read together.' },
        cu: { kid: '{d}: that is copper, 9.0. A fake!', sci: '{d} g/cm3: copper (8.96). False.' },
        sn: { kid: '{d}: that is tin, 7.3. A fake!', sci: '{d} g/cm3: tin (7.29). False.' },
      },
      all: {
        kid: 'You tested all six: three real silver coins and three fakes. Archimedes would be proud!',
        sci: 'All six tested: three true coins, three false. The same displacement trick is credited to Archimedes, in the story of a king’s crown.',
      },
    },
    panel: {
      kid: [
        'How can a purser tell a true silver coin from a fake? A fake is made of a cheaper metal with a silver coat, so it looks the same. But for the same size it weighs more or less than silver. So the purser finds how much room the coin takes (water spilling into a tube), how much it weighs, and divides: that is its density.',
        'Silver is 10.5 times heavier than the same amount of water; with a little copper in it, about 10.4. Copper is 9.0, tin 7.3, lead 11.3. Tap the coins one by one: which are real?',
      ],
      sci: [
        'Density = mass ÷ volume: silver 10.50 g/cm3, copper 8.96, tin 7.29, lead 11.34; a coin of 93% silver and 7% copper, about 10.4. A 27.47 g coin takes up 2.65 cm3.',
        'All six coins here have that size, so the fakes weigh 30.0 g (lead), 23.7 g (copper) and 19.3 g (tin). Lead is only 8% denser than silver: the ring test is old and rough, and only mass and volume read together are sure.',
      ],
    },
  },
}

const PT = {
  title: 'O galeão do tesouro',
  greet: {
    kid: 'Estamos dentro do quadro, num galeão espanhol do tesouro ancorado ao largo da América, numa noite de luar! À esquerda, uma peça de oito gigante, um cinzel e uma balança. Na cabina, um mapa de onde veio a prata. À direita, o canto do despenseiro, onde se testam moedas. A história do quadro está no cavalete.',
    sci: 'O convés de um galeão espanhol do tesouro ancorado ao largo da costa americana, de noite. À esquerda, ao meio do navio: uma peça de oito (8 reales) em modelo, para cortar em bocados e pesar. Grande câmara: uma mesa com o mapa das rotas da prata, de 1500 a 1857. À direita, o canto do despenseiro: uma moeda testada pelo som, pelo volume e pela massa. A história do quadro está no cavalete.',
  },
  talk: {
    kid: [
      'Sou eu em todas as moedas! Sou brilhante, não enferrujo, e um pouco de cobre misturado torna-me forte o suficiente para ser dinheiro.',
      'O meu símbolo, Ag, vem de «argentum», a palavra latina para prata. O país Argentina tem o nome por minha causa, e o Rio da Prata também: «rio de prata».',
      'Cuidado com as falsas! O chumbo é quase tão pesado como eu. Só uma balança e um tubinho com água nos conseguem distinguir.',
    ],
    sci: [
      'Uma peça de oito tinha 93% de prata (11 dineros e 4 granos, título 0,9305) e o resto era cobre: a prata pura é demasiado mole para circular muito tempo.',
      'Ag vem do latim argentum; a Argentina e o Rio da Prata (Río de la Plata) têm o nome dela. A prata funde a 961,78 °C e tem massa volúmica de 10,50 g/cm3.',
      'O chumbo, 11,34 g/cm3, é só 8% mais denso do que a prata, 10,50, e uma moeda com 93% de prata fica perto de 10,4: os falsificadores sabiam-no, por isso o despenseiro mede o volume e a massa em conjunto.',
    ],
  },
  pieces: {
    label: 'Peças de oito',
    title: 'Uma peça de oito, cortada em bocados',
    hints: {
      chisel: 'Toca no cinzel',
      cob: 'Toca na moeda grosseira',
      milled: 'Toca na moeda redonda',
      fresh: 'Toca na moeda para teres uma nova',
    },
    buttons: { cut: 'Cortar a moeda', cob: 'Aparar a moeda grosseira', milled: 'Aparar a moeda redonda', fresh: 'Uma moeda nova' },
    signs: { cob: 'Um «cob»: batido à mão', milled: 'Moeda cunhada à máquina, 1732' },
    board: {
      name: [
        { kid: 'A moeda inteira: 8 reales', sci: 'Peça de oito: 8 reales' },
        { kid: 'Metade: 4 reales', sci: 'Metade: 4 reales' },
        { kid: 'Um quarto: 2 reales, «two bits»', sci: 'Um quarto: 2 reales, «two bits»' },
        { kid: 'Um oitavo: 1 real, «one bit»', sci: 'Um oitavo: 1 real, «one bit», 12½ cêntimos' },
      ],
      weigh: 'Na balança',
    },
    says: {
      cut1: {
        kid: 'Uma pancada de cinzel: duas metades! Cada metade vale 4 reales e pesa {g} g.',
        sci: 'Cortada em duas: metades de 4 reales, {g} g cada (27,47 g ÷ 2).',
      },
      cut2: {
        kid: 'Quatro quartos, de 2 reales cada: «two bits»! É por isso que, nos EUA, um quarto de dólar ainda se chama «two bits». Um quarto pesa {g} g.',
        sci: 'Quartos de 2 reales, «two bits», {g} g cada. O quarto de dólar americano ficou com o nome.',
      },
      cut3: {
        kid: 'Oito bocados, um real cada, {g} g cada. Um bocado era o troco mais pequeno que se podia fazer.',
        sci: 'Oitavos, um real ou «one bit» cada, {g} g: um oitavo de dólar, 12½ cêntimos.',
      },
      fresh: { kid: 'Uma moeda inteirinha, pronta para ser cortada outra vez.', sci: 'Uma moeda nova: 27,47 g.' },
      cob: {
        kid: 'Isto é um «cob»: batido à mão, cheio de altos e baixos, nunca bem redondo, com o cunho meio apagado. Um ladrão limou um pouco de prata do rebordo, e quem repara?',
        sci: 'Um cob, cunhado à mão (em Potosí até 1773). O rebordo nunca era redondo, por isso a prata aparada mal se notava.',
      },
      milled: {
        kid: 'As moedas redondas feitas à máquina têm um padrão no rebordo. Se se cortar um bocadinho, o padrão parte-se: toda a gente vê! Estas surgiram em 1732.',
        sci: 'A partir de 1732, a Cidade do México cunhou os «dólares de colunas», redondos e feitos à máquina, com rebordo serrilhado: a prata aparada vê-se logo.',
      },
    },
    panel: {
      kid: [
        'Uma peça de oito era uma moeda grande de prata, a valer oito reales. Quase ninguém tinha trocos, por isso cortava-se a moeda com um cinzel. Um oitavo era um «bit», e dois bits faziam um quarto: nos EUA, um quarto de dólar ainda se chama «two bits».',
        'Toca no cinzel para cortar a moeda e depois olha para as duas moedas pequenas na mesinha. A grosseira, um «cob», era batida à mão. A redonda foi feita por uma máquina, com um padrão no rebordo para se ver se alguém cortou um bocado.',
      ],
      sci: [
        'Espanha fixou a peça de oito de prata em 1537 em 27,47 g de prata com 93% de título. As moedas cortadas passavam por peso: metade são 13,73 g, um quarto 6,87 g, um oitavo, um real ou «bit», 3,43 g. Um bit eram 12½ cêntimos de dólar.',
        'Os cobs, batidos à mão em Potosí até 1773, variam na forma e no peso, e por isso era difícil ver o aparamento. Os dólares de colunas, redondos e cunhados à máquina, surgiram em 1732 na Cidade do México; o rebordo serrilhado mostra logo onde se tirou prata.',
      ],
    },
  },
  map: {
    label: 'De onde veio a prata',
    title: 'As rotas da prata',
    slider: 'O ano',
    hints: {
      joachim: 'Toca no alfinete na Boémia',
      potosi: 'Toca no alfinete nos Andes',
      mexico: 'Toca no alfinete no México',
      manila: 'Toca no alfinete em Manila',
      seville: 'Toca no alfinete em Sevilha',
      done: 'Toca num alfinete ou desliza os anos',
    },
    buttons: { joachim: 'Joachimsthal', potosi: 'Potosí', mexico: 'México', seville: 'Sevilha', manila: 'Manila' },
    geo: { atlantic: 'Oceano Atlântico', pacific: 'Oceano Pacífico', toManila: 'para Manila', fromAcapulco: 'de Acapulco', bohemia: 'Boémia', seville: 'Sevilha', mexico: 'Zacatecas, Guanajuato', potosi: 'Potosí', manila: 'Manila', year: 'Ano' },
    start: { kid: 'Desliza os anos a partir de 1500 e vê a prata começar a mexer-se.', sci: 'Desliza os anos, de 1500 a 1857: cada rota acende-se quando a sua prata começou a correr.' },
    says: {
      joachim: {
        kid: 'Em 1516, uns mineiros encontraram muitíssima prata no vale de Joachimsthal, na Boémia. Em 1520 a vila começou a cunhar grandes moedas de prata: os táleres. Vê o nome a viajar: tolar, talar, Taler, daler, dólar!',
        sci: 'Joachimsthal (Jáchymov): prata encontrada em 1516; a 9 de janeiro de 1520 os condes Schlick foram autorizados a cunhar grandes moedas com cerca de 93% de prata, os Guldengroschen. Em meados do século XVI, uns 12 milhões de táleres tinham-se espalhado pela Europa: tolar, talar, Taler, daler, dollar.',
      },
      potosi: {
        kid: 'Potosí, nos Andes, na atual Bolívia, a 4000 m acima do mar: o «Monte Rico», Cerro Rico, foi uma das maiores montanhas de prata alguma vez encontradas. Lamas e mulas levavam a prata até à costa.',
        sci: 'Potosí, a cerca de 4000 m nos Andes: a cidade foi fundada em 1545, depois de se encontrar prata no Cerro Rico, e uma casa da moeda real cunhou lá moedas a partir da década de 1570. Caravanas de lamas e mulas levavam a prata até à costa do Pacífico, depois por mar até ao Panamá e, de mula pelo istmo, até à frota do tesouro.',
      },
      mexico: {
        kid: 'O México também tinha grandes minas de prata, em Zacatecas e Guanajuato. Na Cidade do México, a primeira casa da moeda das Américas cunhou peças de oito a partir da década de 1530. Mulas levavam a prata até ao porto de Veracruz, e os navios levavam-na para Espanha.',
        sci: 'Zacatecas e Guanajuato: as grandes minas de prata do México. A casa da moeda da Cidade do México, a primeira das Américas, cunhou peças de oito a partir da década de 1530; recuas de mulas levavam a prata a Veracruz para a frota de Sevilha, ou a Acapulco para o galeão de Manila.',
      },
      seville: {
        kid: 'As frotas do tesouro atravessavam o Atlântico e chegavam a Sevilha, em Espanha, carregadas de prata. Dali, as peças de oito espalhavam-se pela Europa e pelo mundo.',
        sci: 'As frotas navegavam de Havana para Sevilha, sede da Casa da Contratação, que controlava o comércio com as Américas. De Espanha, a prata espanhola espalhava-se pela Europa e pelo Mediterrâneo.',
      },
      manila: {
        kid: 'De 1565 a 1815, os galeões de Manila atravessavam o Pacífico de Acapulco, no México, até Manila, com prata a bordo, e voltavam com seda e porcelana da China. Foi assim que as peças de oito chegaram à China.',
        sci: 'Os galeões de Manila, de 1565 a 1815, levavam prata de Acapulco a Manila, onde ela comprava seda, porcelana e especiarias chinesas: a peça de oito tornou-se a primeira moeda mundial.',
      },
    },
    years: [
      { y: 1516, kid: '1516: encontra-se prata em Joachimsthal, na Boémia.', sci: '1516: encontra-se prata em Joachimsthal (Jáchymov), na Boémia.' },
      { y: 1520, kid: '1520: cunham-se as primeiras grandes moedas de prata, os táleres. A palavra «dólar» começa aqui.', sci: '1520, 9 de janeiro: os condes Schlick podem cunhar os Guldengroschen, os primeiros táleres.' },
      { y: 1537, kid: '1537: Espanha fixa a peça de oito: 27,47 gramas de prata quase pura.', sci: '1537: a peça de oito fica fixada em 27,47 g com 93% de prata; a Cidade do México cunha-a desde a década de 1530.' },
      { y: 1545, kid: '1545: encontra-se prata no Cerro Rico, em Potosí, nos Andes.', sci: '1545: Potosí é fundada depois de se encontrar prata no Cerro Rico.' },
      { y: 1565, kid: '1565: os primeiros galeões de Manila navegam entre o México e as Filipinas.', sci: '1565: começa o comércio dos galeões de Manila, que dura até 1815.' },
      { y: 1575, kid: 'Década de 1570: Potosí ganha a sua própria casa da moeda, e a prata vira moeda ali mesmo.', sci: 'Década de 1570: uma casa da moeda real funciona em Potosí (as fontes dão 1572 a 1575).' },
      { y: 1732, kid: '1732: moedas redondas feitas à máquina, com um padrão no rebordo.', sci: '1732: a Cidade do México cunha os dólares de colunas, redondos e serrilhados.' },
      { y: 1792, kid: '1792: os Estados Unidos fazem o seu próprio dólar, copiado do espanhol.', sci: '1792: a lei monetária dos EUA define o dólar por peso: 371,25 grãos, 24,06 g, de prata pura.' },
      { y: 1815, kid: '1815: parte o último galeão de Manila.', sci: '1815: parte o último galeão de Manila.' },
      { y: 1857, kid: '1857: os dólares espanhóis deixam de ser dinheiro nos EUA. A história acaba.', sci: '1857, 21 de fevereiro: os dólares espanhóis deixam de ter curso legal nos EUA.' },
    ],
    panel: {
      kid: [
        'Este é o mapa da prata. A prata saía de minas na Boémia, no México e nos Andes, e viajava de navio, de mula e de lama até se tornar moeda. Toca num alfinete para ouvir a sua história, ou desliza os anos e vê as rotas acenderem-se.',
        'Vê como a palavra viajou: thaler, tolar, daler, dólar. Em 1792, os novos Estados Unidos escolheram «dólar» para a sua moeda, porque era assim que as pessoas chamavam às grandes moedas espanholas de prata.',
      ],
      sci: [
        'A prata pôs o comércio mundial em movimento: Joachimsthal em 1516, Potosí a partir de 1545, a casa da moeda do México desde a década de 1530, os galeões de Manila de 1565 a 1815. O cursor vai de 1500 a 1857; uma rota acende-se quando a sua prata começou a correr.',
        'A lei monetária dos EUA de 1792 definiu o dólar por peso, 371,25 grãos (24,06 g) de prata pura, a partir do dólar espanhol então em uso; os dólares espanhóis tiveram curso legal nos EUA até 21 de fevereiro de 1857.',
      ],
    },
  },
  purser: {
    label: 'É prata verdadeira?',
    title: 'O teste do despenseiro',
    hints: {
      coin: 'Toca numa moeda',
      can: 'Toca na caneca para mergulhar a moeda',
      pan: 'Toca na balança para pesar a moeda',
      next: 'Toca noutra moeda',
    },
    buttons: { coin: 'Próxima moeda na pedra', can: 'Mergulhá-la na caneca', pan: 'Pesá-la' },
    signs: { slab: 'Teste do som', can: 'Volume, mL' },
    mats: { ag: 'prata', pb: 'chumbo', cu: 'cobre', sn: 'estanho' },
    board: { title: 'Massa volúmica, g/cm3', coin: 'Moeda {n} de 6', unknown: 'ainda sem medição', alloy: 'moeda de prata' },
    says: {
      ring: {
        ag: { kid: 'Ding! Soa claro e comprido, como um sininho. Bom sinal, mas não é prova.', sci: 'Um toque claro e comprido: bom sinal, mas só um teste grosseiro.' },
        pb: { kid: 'Pof. O chumbo é mole e abafado: não soa.', sci: 'Um som surdo: metal mole sob uma película de prata. Um teste grosseiro.' },
        cu: { kid: 'Clonc. Um som mais curto e mais abafado do que o da prata.', sci: 'Mais curto e mais abafado do que a prata, mas o ouvido pode enganar-se: um teste grosseiro.' },
        sn: { kid: 'Um tiquezinho abafado. O estanho não soa como a prata.', sci: 'Um som curto e abafado. Só um teste grosseiro.' },
      },
      dip: {
        kid: 'A moeda afunda-se e a água sobe pelo tubinho: {v} mL. É este o espaço que a moeda ocupa.',
        sci: 'Água deslocada: {v} mL (cm3), o volume da moeda (à maneira de Arquimedes).',
      },
      weigh: {
        kid: 'A balança marca {m} g.',
        sci: 'Massa {m} g. Massa volúmica = {m} g ÷ {v} cm3 = {d} g/cm3.',
      },
      verdict: {
        ag: { kid: '{d}: certo para prata com um pouco de cobre (cerca de 10,4). Uma moeda verdadeira!', sci: '{d} g/cm3: uma liga com 93% de prata (cerca de 10,4; prata pura 10,50). Verdadeira.' },
        pb: { kid: '{d}: isso é chumbo, 11,3! Uma falsa com uma película fina de prata.', sci: '{d} g/cm3: chumbo (11,34), não prata. Está perto, por isso o volume e a massa têm de ser lidos em conjunto.' },
        cu: { kid: '{d}: isso é cobre, 9,0. Uma falsa!', sci: '{d} g/cm3: cobre (8,96). Falsa.' },
        sn: { kid: '{d}: isso é estanho, 7,3. Uma falsa!', sci: '{d} g/cm3: estanho (7,29). Falsa.' },
      },
      all: {
        kid: 'Testaste as seis: três moedas de prata verdadeiras e três falsas. Arquimedes ficaria orgulhoso!',
        sci: 'As seis testadas: três verdadeiras, três falsas. O mesmo truque do deslocamento de água é atribuído a Arquimedes, na história da coroa de um rei.',
      },
    },
    panel: {
      kid: [
        'Como é que um despenseiro distingue uma moeda de prata verdadeira de uma falsa? A falsa é feita de um metal mais barato com uma película de prata, por isso parece igual. Mas, para o mesmo tamanho, pesa mais ou menos do que a prata. Então o despenseiro mede o espaço que a moeda ocupa (a água a subir num tubo), quanto pesa, e divide: essa é a massa volúmica.',
        'A prata é 10,5 vezes mais pesada do que a mesma quantidade de água; com um pouco de cobre, cerca de 10,4. O cobre é 9,0, o estanho 7,3 e o chumbo 11,3. Toca nas moedas uma a uma: quais são verdadeiras?',
      ],
      sci: [
        'Massa volúmica = massa ÷ volume: prata 10,50 g/cm3, cobre 8,96, estanho 7,29, chumbo 11,34; uma moeda com 93% de prata e 7% de cobre, cerca de 10,4. Uma moeda de 27,47 g ocupa 2,65 cm3.',
        'As seis moedas daqui têm esse tamanho, por isso as falsas pesam 30,0 g (chumbo), 23,7 g (cobre) e 19,3 g (estanho). O chumbo é só 8% mais denso do que a prata: o teste do som é antigo e grosseiro, e só a massa e o volume lidos juntos dão certeza.',
      ],
    },
  },
}

const PL = {
  title: 'Galeon ze skarbem',
  greet: {
    kid: 'Jesteśmy w środku obrazu, na hiszpańskim galeonie ze skarbem, który stoi na kotwicy u wybrzeży Ameryki w księżycową noc! Po lewej olbrzymia moneta ośmiorealowa, dłuto i waga. W kajucie mapa tego, skąd wzięło się srebro. Po prawej kącik intendenta, gdzie sprawdza się monety. Historia obrazu jest na sztalugach.',
    sci: 'Pokład hiszpańskiego galeonu ze skarbem, który stoi na kotwicy u wybrzeży Ameryki, nocą. Po lewej, w środku okrętu: model monety ośmiorealowej (8 reali) do cięcia na kawałki i ważenia. Wielka kajuta: stół z mapą dróg srebra, od 1500 do 1857. Po prawej kącik intendenta: moneta sprawdzana dźwiękiem, objętością i masą. Historia obrazu jest na sztalugach.',
  },
  talk: {
    kid: [
      'To ja jestem w każdej monecie! Błyszczę, nie rdzewieję, a odrobina miedzi sprawia, że jestem dość twarde, by być pieniądzem.',
      'Mój symbol, Ag, pochodzi od „argentum”, czyli po łacinie srebro. Od mojej nazwy ma imię kraj Argentyna i Rio de la Plata: „srebrna rzeka”.',
      'Uważaj na falsyfikaty! Ołów jest prawie tak ciężki jak ja. Tylko waga i rurka z wodą mogą nas odróżnić.',
    ],
    sci: [
      'Moneta ośmiorealowa miała 93% srebra (11 dineros i 4 granos, próba 0,9305), resztę stanowiła miedź: czyste srebro jest za miękkie, by długo krążyć.',
      'Ag pochodzi od łacińskiego argentum; od niego nazwano Argentynę i Rio de la Plata (Srebrną Rzekę). Srebro topi się w 961,78 °C i ma gęstość 10,50 g/cm3.',
      'Ołów, 11,34 g/cm3, jest tylko o 8% gęstszy od srebra, 10,50, a moneta z 93% srebra ma około 10,4: fałszerze o tym wiedzieli, więc intendent mierzy objętość i masę razem.',
    ],
  },
  pieces: {
    label: 'Monety ośmiorealowe',
    title: 'Moneta ośmiorealowa pocięta na kawałki',
    hints: {
      chisel: 'Dotknij dłuta',
      cob: 'Dotknij chropawej monety',
      milled: 'Dotknij okrągłej monety',
      fresh: 'Dotknij monety, by dostać nową',
    },
    buttons: { cut: 'Potnij monetę', cob: 'Przytnij chropawą monetę', milled: 'Przytnij okrągłą monetę', fresh: 'Nowa moneta' },
    signs: { cob: '„Cob”: bita ręcznie', milled: 'Moneta bita maszynowo, 1732' },
    board: {
      name: [
        { kid: 'Cała moneta: 8 reali', sci: 'Moneta ośmiorealowa: 8 reali' },
        { kid: 'Połowa: 4 reale', sci: 'Połowa: 4 reale' },
        { kid: 'Ćwiartka: 2 reale, „two bits”', sci: 'Ćwiartka: 2 reale, „two bits”' },
        { kid: 'Ósemka: 1 real, „one bit”', sci: 'Ósemka: 1 real, „one bit”, 12½ centa' },
      ],
      weigh: 'Na wadze',
    },
    says: {
      cut1: {
        kid: 'Jedno uderzenie dłuta: dwie połówki! Każda warta jest 4 reale i waży {g} g.',
        sci: 'Cięcie na dwoje: połówki po 4 reale, po {g} g (27,47 g ÷ 2).',
      },
      cut2: {
        kid: 'Cztery ćwiartki, po 2 reale każda: „two bits”! Dlatego w USA ćwierć dolara do dziś nazywa się „two bits”. Jedna ćwiartka waży {g} g.',
        sci: 'Ćwiartki po 2 reale, „two bits”, po {g} g. Amerykańskie ćwierć dolara zachowało tę nazwę.',
      },
      cut3: {
        kid: 'Osiem kawałków, po jednym realu, po {g} g. Kawałek był najmniejszą resztą, jaką dało się wydać.',
        sci: 'Ósemki, po jednym realu, czyli „one bit”, po {g} g: osiem części dolara, 12½ centa.',
      },
      fresh: { kid: 'Całkiem nowa moneta, gotowa do ponownego cięcia.', sci: 'Nowa moneta: 27,47 g.' },
      cob: {
        kid: 'To „cob”: bity ręcznie, nierówny, nigdy całkiem okrągły, ze stemplem w połowie wytartym. Złodziej zeskrobał trochę srebra z brzegu, i kto by to zauważył?',
        sci: 'Cob, bity ręcznie (w Potosí do 1773). Jego brzeg nigdy nie był okrągły, więc przycięte srebro prawie nie rzucało się w oczy.',
      },
      milled: {
        kid: 'Okrągłe monety robione maszyną mają wzór na brzegu. Odetnij kawałek, a wzór się przerwie: każdy to zobaczy! Takie pojawiły się w 1732 roku.',
        sci: 'Od 1732 roku mennica w Meksyku biła okrągłe „dolary z kolumnami”, wykonane maszynowo, z ząbkowanym brzegiem: przycięte srebro widać od razu.',
      },
    },
    panel: {
      kid: [
        'Moneta ośmiorealowa była dużą srebrną monetą wartą osiem reali. Prawie nikt nie miał drobnych, więc po prostu cięto monetę dłutem. Jedna ósma to „bit”, a dwa bity to ćwiartka: w USA ćwierć dolara do dziś nazywa się „two bits”.',
        'Dotknij dłuta, by pociąć monetę, a potem spójrz na dwie małe monety na stoliku. Chropawa, „cob”, była bita ręcznie. Okrągła powstała w maszynie, z wzorem na brzegu, żeby było widać, czy ktoś odciął kawałek.',
      ],
      sci: [
        'Hiszpania ustaliła srebrną monetę ośmiorealową w 1537 roku na 27,47 g srebra próby 93%. Cięte monety przyjmowano na wagę: połowa to 13,73 g, ćwiartka 6,87 g, ósemka, czyli jeden real albo „bit”, 3,43 g. Bit to było 12½ centa dolara.',
        'Cobs, bite ręcznie w Potosí do 1773 roku, różnią się kształtem i masą, więc przycinanie było trudne do zauważenia. Okrągłe, bite maszynowo „dolary z kolumnami” pojawiły się w 1732 roku w Meksyku; ich ząbkowany brzeg od razu pokazuje, gdzie zabrano srebro.',
      ],
    },
  },
  map: {
    label: 'Skąd wzięło się srebro',
    title: 'Drogi srebra',
    slider: 'Rok',
    hints: {
      joachim: 'Dotknij pinezki w Czechach',
      potosi: 'Dotknij pinezki w Andach',
      mexico: 'Dotknij pinezki w Meksyku',
      manila: 'Dotknij pinezki w Manili',
      seville: 'Dotknij pinezki w Sewilli',
      done: 'Dotknij pinezki albo przesuń lata',
    },
    buttons: { joachim: 'Joachimsthal', potosi: 'Potosí', mexico: 'Meksyk', seville: 'Sewilla', manila: 'Manila' },
    geo: { atlantic: 'Ocean Atlantycki', pacific: 'Ocean Spokojny', toManila: 'do Manili', fromAcapulco: 'z Acapulco', bohemia: 'Czechy', seville: 'Sewilla', mexico: 'Zacatecas, Guanajuato', potosi: 'Potosí', manila: 'Manila', year: 'Rok' },
    start: { kid: 'Przesuwaj lata od 1500 i patrz, jak srebro rusza w drogę.', sci: 'Przesuwaj lata, od 1500 do 1857: każda droga zapala się, gdy popłynęło nią srebro.' },
    says: {
      joachim: {
        kid: 'W 1516 roku górnicy znaleźli ogromne ilości srebra w dolinie Joachimsthal w Czechach. W 1520 roku miasto zaczęło bić wielkie srebrne monety: talary. Patrz, jak wędruje nazwa: tolar, talar, Taler, daler, dolar!',
        sci: 'Joachimsthal (Jáchymov): srebro znaleziono w 1516 roku; 9 stycznia 1520 roku hrabiowie Schlickowie dostali pozwolenie na bicie dużych monet zawierających około 93% srebra, Guldengroschen. Do połowy XVI wieku po Europie rozeszło się około 12 milionów talarów: tolar, talar, Taler, daler, dollar.',
      },
      potosi: {
        kid: 'Potosí, w Andach w dzisiejszej Boliwii, 4000 m nad morzem: „Bogate Wzgórze”, Cerro Rico, było jedną z największych srebrnych gór, jakie kiedykolwiek znaleziono. Lamy i muły niosły srebro na wybrzeże.',
        sci: 'Potosí, około 4000 m n.p.m. w Andach: miasto założono w 1545 roku po znalezieniu srebra na Cerro Rico, a królewska mennica biła tam monety od lat 70. XVI wieku. Karawany lam i mułów zwoziły srebro na wybrzeże Pacyfiku, potem statki do Panamy i, mułami przez przesmyk, do floty skarbów.',
      },
      mexico: {
        kid: 'Meksyk też miał wielkie kopalnie srebra, w Zacatecas i Guanajuato. W mieście Meksyk pierwsza mennica obu Ameryk biła monety ośmiorealowe od lat 30. XVI wieku. Muły zwoziły srebro do portu Veracruz, a statki zabierały je do Hiszpanii.',
        sci: 'Zacatecas i Guanajuato: wielkie kopalnie srebra Meksyku. Mennica w mieście Meksyk, pierwsza w obu Amerykach, biła monety ośmiorealowe od lat 30. XVI wieku; karawany mułów wiozły srebro do Veracruz dla floty do Sewilli albo do Acapulco dla galeonu z Manili.',
      },
      seville: {
        kid: 'Floty ze skarbem przepływały Atlantyk i docierały do Sewilli w Hiszpanii, pełne srebra. Stamtąd monety ośmiorealowe rozchodziły się po Europie i świecie.',
        sci: 'Floty płynęły z Hawany do Sewilli, siedziby Casa de Contratación, która kontrolowała handel z Amerykami. Z Hiszpanii hiszpańskie srebro rozchodziło się po Europie i basenie Morza Śródziemnego.',
      },
      manila: {
        kid: 'Od 1565 do 1815 roku galeony z Manili pływały przez Pacyfik z Acapulco w Meksyku do Manili ze srebrem na pokładzie, a wracały z jedwabiem i porcelaną z Chin. Tak monety ośmiorealowe dotarły do Chin.',
        sci: 'Galeony z Manili, 1565 do 1815, wiozły srebro z Acapulco do Manili, gdzie kupowało się za nie chiński jedwab, porcelanę i przyprawy: moneta ośmiorealowa stała się pierwszą walutą światową.',
      },
    },
    years: [
      { y: 1516, kid: '1516: w Joachimsthal w Czechach znaleziono srebro.', sci: '1516: w Joachimsthal (Jáchymov) w Czechach znaleziono srebro.' },
      { y: 1520, kid: '1520: biją pierwsze wielkie srebrne monety, talary. Od nich zaczyna się słowo „dolar”.', sci: '1520, 9 stycznia: hrabiowie Schlickowie mogą bić Guldengroschen, pierwsze talary.' },
      { y: 1537, kid: '1537: Hiszpania ustala monetę ośmiorealową: 27,47 grama prawie czystego srebra.', sci: '1537: moneta ośmiorealowa ustalona na 27,47 g srebra próby 93%; mennica w mieście Meksyk bije ją od lat 30. XVI wieku.' },
      { y: 1545, kid: '1545: na Cerro Rico w Potosí, w Andach, znaleziono srebro.', sci: '1545: założono Potosí po znalezieniu srebra na Cerro Rico.' },
      { y: 1565, kid: '1565: pierwsze galeony z Manili pływają między Meksykiem a Filipinami.', sci: '1565: zaczyna się handel galeonów z Manili, który trwa do 1815.' },
      { y: 1575, kid: 'Lata 70. XVI wieku: Potosí dostaje własną mennicę, więc srebro zamienia się w monety na miejscu.', sci: 'Lata 70. XVI wieku: w Potosí działa królewska mennica (źródła podają od 1572 do 1575).' },
      { y: 1732, kid: '1732: okrągłe monety robione maszyną, z wzorem na brzegu.', sci: '1732: mennica w mieście Meksyk bije okrągłe, ząbkowane „dolary z kolumnami”.' },
      { y: 1792, kid: '1792: Stany Zjednoczone robią własnego dolara, wzorowanego na hiszpańskim.', sci: '1792: amerykańska ustawa monetarna określa dolara wagą: 371,25 grana, 24,06 g czystego srebra.' },
      { y: 1815, kid: '1815: wypływa ostatni galeon z Manili.', sci: '1815: wypływa ostatni galeon z Manili.' },
      { y: 1857, kid: '1857: hiszpańskie dolary przestają być pieniędzmi w USA. Historia się kończy.', sci: '1857, 21 lutego: hiszpańskie dolary przestają być w USA prawnym środkiem płatniczym.' },
    ],
    panel: {
      kid: [
        'To mapa srebra. Srebro wydobywano w kopalniach w Czechach, Meksyku i Andach, a statki, muły i lamy wiozły je, żeby zamienić w monety. Dotknij pinezki, by posłuchać jej historii, albo przesuń lata i patrz, jak drogi się zapalają.',
        'Zobacz, jak wędrowało słowo: thaler, tolar, daler, dolar. W 1792 roku nowe Stany Zjednoczone wybrały „dolar” dla swojej monety, bo tak ludzie nazywali wielkie hiszpańskie srebrne monety.',
      ],
      sci: [
        'Srebro poruszyło handel światowy: Joachimsthal w 1516, Potosí od 1545, mennica w Meksyku od lat 30. XVI wieku, galeony z Manili od 1565 do 1815. Suwak biegnie od 1500 do 1857; droga zapala się, gdy zaczęło nią płynąć srebro.',
        'Amerykańska ustawa monetarna z 1792 roku określiła dolara wagą, 371,25 grana (24,06 g) czystego srebra, wzorując się na używanym wówczas dolarze hiszpańskim; hiszpańskie dolary były w USA prawnym środkiem płatniczym do 21 lutego 1857 roku.',
      ],
    },
  },
  purser: {
    label: 'Czy to prawdziwe srebro?',
    title: 'Próba intendenta',
    hints: {
      coin: 'Dotknij monety',
      can: 'Dotknij dzbanka, by zanurzyć monetę',
      pan: 'Dotknij wagi, by zważyć monetę',
      next: 'Dotknij następnej monety',
    },
    buttons: { coin: 'Następna moneta na płycie', can: 'Zanurz ją w dzbanku', pan: 'Zważ ją' },
    signs: { slab: 'Próba dźwiękiem', can: 'Objętość, mL' },
    mats: { ag: 'srebro', pb: 'ołów', cu: 'miedź', sn: 'cyna' },
    board: { title: 'Gęstość, g/cm3', coin: 'Moneta {n} z 6', unknown: 'jeszcze nie zmierzona', alloy: 'srebrna moneta' },
    says: {
      ring: {
        ag: { kid: 'Dzyń! Dzwoni czysto i długo, jak maleńki dzwonek. Dobry znak, ale to jeszcze nie dowód.', sci: 'Czysty, długi dźwięk: dobry znak, ale tylko przybliżona próba.' },
        pb: { kid: 'Łup. Ołów jest miękki i głuchy: nie dzwoni.', sci: 'Głuchy łoskot: miękki metal pod srebrną powłoką. Przybliżona próba.' },
        cu: { kid: 'Stuk. Krótszy i głuchszy dźwięk niż srebra.', sci: 'Krótszy i głuchszy niż srebro, ale ucho można oszukać: przybliżona próba.' },
        sn: { kid: 'Głuche, krótkie stuknięcie. Cyna nie dzwoni jak srebro.', sci: 'Krótki, głuchy dźwięk. Tylko przybliżona próba.' },
      },
      dip: {
        kid: 'Moneta tonie, a woda podnosi się w rurce: {v} mL. Tyle miejsca zajmuje moneta.',
        sci: 'Wyparta woda: {v} mL (cm3), czyli objętość monety (sposób Archimedesa).',
      },
      weigh: {
        kid: 'Waga pokazuje {m} g.',
        sci: 'Masa {m} g. Gęstość = {m} g ÷ {v} cm3 = {d} g/cm3.',
      },
      verdict: {
        ag: { kid: '{d}: tak jest ze srebrem z odrobiną miedzi (około 10,4). Prawdziwa moneta!', sci: '{d} g/cm3: stop z 93% srebra (około 10,4; czyste srebro 10,50). Prawdziwa.' },
        pb: { kid: '{d}: to ołów, 11,3! Falsyfikat z cienką srebrną powłoką.', sci: '{d} g/cm3: ołów (11,34), nie srebro. To blisko, więc objętość i masę trzeba czytać razem.' },
        cu: { kid: '{d}: to miedź, 9,0. Falsyfikat!', sci: '{d} g/cm3: miedź (8,96). Fałszywa.' },
        sn: { kid: '{d}: to cyna, 7,3. Falsyfikat!', sci: '{d} g/cm3: cyna (7,29). Fałszywa.' },
      },
      all: {
        kid: 'Sprawdzone wszystkie sześć monet: trzy prawdziwe srebrne i trzy falsyfikaty. Archimedes byłby dumny!',
        sci: 'Wszystkie sześć sprawdzone: trzy prawdziwe monety, trzy fałszywe. Ten sam trik z wypieraniem wody przypisuje się Archimedesowi, w opowieści o koronie króla.',
      },
    },
    panel: {
      kid: [
        'Jak intendent odróżnia prawdziwą srebrną monetę od fałszywej? Fałszywa jest zrobiona z tańszego metalu z srebrną powłoką, więc wygląda tak samo. Ale przy tej samej wielkości waży więcej albo mniej niż srebro. Intendent sprawdza więc, ile miejsca zajmuje moneta (woda wylewa się do rurki), ile waży, i dzieli: to jest gęstość.',
        'Srebro jest 10,5 raza cięższe od tej samej ilości wody; z odrobiną miedzi, około 10,4. Miedź ma 9,0, cyna 7,3, ołów 11,3. Dotykaj monet po kolei: które są prawdziwe?',
      ],
      sci: [
        'Gęstość = masa ÷ objętość: srebro 10,50 g/cm3, miedź 8,96, cyna 7,29, ołów 11,34; moneta z 93% srebra i 7% miedzi, około 10,4. Moneta o masie 27,47 g zajmuje 2,65 cm3.',
        'Wszystkie sześć monet ma taki rozmiar, więc falsyfikaty ważą 30,0 g (ołów), 23,7 g (miedź) i 19,3 g (cyna). Ołów jest tylko o 8% gęstszy od srebra: próba dźwiękiem jest stara i przybliżona, a pewność daje dopiero masa i objętość czytane razem.',
      ],
    },
  },
}

const DE = {
  title: 'Die Schatzgaleone',
  greet: {
    kid: 'Wir sind im Bild, auf einer spanischen Schatzgaleone, die in einer mondhellen Nacht vor Amerika vor Anker liegt! Links ein riesiges Achterstück, ein Meißel und eine Waage. In der Kajüte eine Karte, woher das Silber kam. Rechts die Ecke des Zahlmeisters, wo Münzen geprüft werden. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Das Deck einer spanischen Schatzgaleone, die nachts vor der amerikanischen Küste vor Anker liegt. Links, mittschiffs: ein Modell eines Achterstücks (8 Reales) zum Zerteilen und Wiegen. Große Kajüte: ein Kartentisch der Silberwege, 1500 bis 1857. Rechts die Ecke des Zahlmeisters: eine Münze, geprüft nach Klang, Volumen und Masse. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Das bin ich in jeder Münze! Ich glänze, ich roste nicht, und ein bisschen Kupfer macht mich stark genug, um Geld zu sein.',
      'Mein Symbol, Ag, kommt von „argentum“, dem lateinischen Wort für Silber. Das Land Argentinien ist nach mir benannt und der Río de la Plata: „Silberfluss“.',
      'Vorsicht vor Fälschungen! Blei ist fast so schwer wie ich. Nur eine Waage und ein Röhrchen mit Wasser können uns unterscheiden.',
    ],
    sci: [
      'Ein Achterstück bestand zu 93% aus Silber (11 Dineros und 4 Granos, Feingehalt 0,9305), der Rest war Kupfer: reines Silber ist zu weich, um lange umzulaufen.',
      'Ag kommt vom lateinischen argentum; Argentinien und der Río de la Plata (Silberfluss) sind danach benannt. Silber schmilzt bei 961,78 °C und hat eine Dichte von 10,50 g/cm3.',
      'Blei, 11,34 g/cm3, ist nur 8% dichter als Silber, 10,50, und eine Münze mit 93% Silber liegt bei etwa 10,4: Fälscher wussten das, darum misst ein Zahlmeister Volumen und Masse zusammen.',
    ],
  },
  pieces: {
    label: 'Achterstücke',
    title: 'Ein Achterstück, in Stücke geteilt',
    hints: {
      chisel: 'Tipp auf den Meißel',
      cob: 'Tipp auf die raue Münze',
      milled: 'Tipp auf die runde Münze',
      fresh: 'Tipp auf die Münze für eine frische',
    },
    buttons: { cut: 'Die Münze zerteilen', cob: 'Die raue Münze beschneiden', milled: 'Die runde Münze beschneiden', fresh: 'Eine frische Münze' },
    signs: { cob: 'Ein „Cob“: handgeprägt', milled: 'Maschinell geprägte Münze, 1732' },
    board: {
      name: [
        { kid: 'Die ganze Münze: 8 Reales', sci: 'Achterstück: 8 Reales' },
        { kid: 'Eine Hälfte: 4 Reales', sci: 'Eine Hälfte: 4 Reales' },
        { kid: 'Ein Viertel: 2 Reales, „two bits“', sci: 'Ein Viertel: 2 Reales, „two bits“' },
        { kid: 'Ein Achtel: 1 Real, „one bit“', sci: 'Ein Achtel: 1 Real, „one bit“, 12½ Cent' },
      ],
      weigh: 'Auf der Waage',
    },
    says: {
      cut1: {
        kid: 'Ein Schlag mit dem Meißel: zwei Hälften! Jede ist 4 Reales wert und wiegt {g} g.',
        sci: 'In zwei geteilt: Hälften zu 4 Reales, je {g} g (27,47 g ÷ 2).',
      },
      cut2: {
        kid: 'Vier Viertel zu je 2 Reales: „two bits“! Darum heißt ein Vierteldollar in den USA noch heute „two bits“. Ein Viertel wiegt {g} g.',
        sci: 'Viertel zu 2 Reales, „two bits“, je {g} g. Der amerikanische Vierteldollar behielt den Spitznamen.',
      },
      cut3: {
        kid: 'Acht Stücke, je ein Real, je {g} g. Ein Stück war das kleinste Wechselgeld, das man geben konnte.',
        sci: 'Achtel, je ein Real oder „one bit“, je {g} g: ein Achteldollar, 12½ Cent.',
      },
      fresh: { kid: 'Eine ganz neue Münze, bereit, wieder zerteilt zu werden.', sci: 'Eine frische Münze: 27,47 g.' },
      cob: {
        kid: 'Das ist ein „Cob“: von Hand geprägt, klumpig, nie ganz rund, sein Stempel halb verwischt. Ein Dieb hat ein bisschen Silber vom Rand abgeschabt, und wer merkt das schon?',
        sci: 'Ein Cob, von Hand geprägt (in Potosí bis 1773). Sein Rand war nie rund, darum fiel abgeschnittenes Silber kaum auf.',
      },
      milled: {
        kid: 'Die runden, maschinell gemachten Münzen haben ein Muster am Rand. Schneidest du ein Stück ab, ist das Muster zerstört: jeder sieht es! Diese kamen 1732.',
        sci: 'Ab 1732 prägte Mexiko-Stadt runde, maschinell gefertigte „Säulendollar“ mit geriffeltem Rand: beschnittenes Silber fällt sofort auf.',
      },
    },
    panel: {
      kid: [
        'Ein Achterstück war eine große Silbermünze im Wert von acht Reales. Kaum jemand hatte Kleingeld, also teilte man die Münze einfach mit einem Meißel. Ein Achtel war ein „bit“, und zwei bits ergaben ein Viertel: In den USA heißt ein Vierteldollar noch heute „two bits“.',
        'Tipp auf den Meißel, um die Münze zu zerteilen, und schau dann auf die zwei kleinen Münzen auf dem Tischchen. Die raue, ein „Cob“, wurde von Hand geprägt. Die runde machte eine Maschine, mit einem Muster am Rand, damit man sieht, ob jemand ein Stück abgeschnitten hat.',
      ],
      sci: [
        'Spanien legte das silberne Achterstück 1537 auf 27,47 g Silber mit einem Feingehalt von 93% fest. Geteilte Münzen galten nach Gewicht: eine Hälfte sind 13,73 g, ein Viertel 6,87 g, ein Achtel, ein Real oder „bit“, 3,43 g. Ein bit waren 12½ Cent eines Dollars.',
        'Handgeprägte Cobs, in Potosí bis 1773 gemacht, unterscheiden sich in Form und Gewicht, darum war Beschneiden schwer zu sehen. Runde, maschinell geprägte „Säulendollar“ kamen 1732 in Mexiko-Stadt; ihr geriffelter Rand zeigt sofort, wo Silber fehlt.',
      ],
    },
  },
  map: {
    label: 'Woher das Silber kam',
    title: 'Die Silberwege',
    slider: 'Das Jahr',
    hints: {
      joachim: 'Tipp auf die Nadel in Böhmen',
      potosi: 'Tipp auf die Nadel in den Anden',
      mexico: 'Tipp auf die Nadel in Mexiko',
      manila: 'Tipp auf die Nadel bei Manila',
      seville: 'Tipp auf die Nadel bei Sevilla',
      done: 'Tipp auf eine Nadel oder schieb die Jahre',
    },
    buttons: { joachim: 'Joachimsthal', potosi: 'Potosí', mexico: 'Mexiko', seville: 'Sevilla', manila: 'Manila' },
    geo: { atlantic: 'Atlantik', pacific: 'Pazifik', toManila: 'nach Manila', fromAcapulco: 'ab Acapulco', bohemia: 'Böhmen', seville: 'Sevilla', mexico: 'Zacatecas, Guanajuato', potosi: 'Potosí', manila: 'Manila', year: 'Jahr' },
    start: { kid: 'Schieb die Jahre ab 1500 und sieh, wie das Silber sich in Bewegung setzt.', sci: 'Schieb die Jahre, 1500 bis 1857: Jeder Weg leuchtet auf, wenn sein Silber zu fließen begann.' },
    says: {
      joachim: {
        kid: '1516 fanden Bergleute riesige Mengen Silber im Tal von Joachimsthal in Böhmen. 1520 begann die Stadt, große Silbermünzen zu prägen: Taler. Sieh, wie der Name wandert: Tolar, Talar, Taler, Daler, Dollar!',
        sci: 'Joachimsthal (Jáchymov): Silber 1516 gefunden; am 9. Januar 1520 durften die Grafen Schlick große Münzen mit etwa 93% Silber prägen, die Guldengroschen. Bis zur Mitte des 16. Jahrhunderts verbreiteten sich etwa 12 Millionen Taler über Europa: Tolar, Talar, Taler, Daler, Dollar.',
      },
      potosi: {
        kid: 'Potosí, in den Anden im heutigen Bolivien, 4000 m über dem Meer: der „Reiche Berg“, Cerro Rico, war einer der größten Silberberge, die je gefunden wurden. Lamas und Maultiere trugen das Silber hinunter zur Küste.',
        sci: 'Potosí, etwa 4000 m hoch in den Anden: Die Stadt wurde 1545 gegründet, nachdem auf dem Cerro Rico Silber gefunden worden war, und eine königliche Münzstätte prägte dort ab den 1570er-Jahren. Lama- und Maultierzüge brachten das Silber zur Pazifikküste, dann Schiffe nach Panama und, auf Maultieren über die Landenge, zur Schatzflotte.',
      },
      mexico: {
        kid: 'Auch Mexiko hatte große Silberminen, bei Zacatecas und Guanajuato. In Mexiko-Stadt prägte die erste Münzstätte Amerikas ab den 1530er-Jahren Achterstücke. Maultiere brachten das Silber zum Hafen Veracruz, und Schiffe brachten es nach Spanien.',
        sci: 'Zacatecas und Guanajuato: Mexikos große Silberminen. Die Münzstätte in Mexiko-Stadt, die erste Amerikas, prägte ab den 1530er-Jahren Achterstücke; Maultierkarawanen trugen das Silber nach Veracruz für die Flotte nach Sevilla oder nach Acapulco für die Manila-Galeone.',
      },
      seville: {
        kid: 'Die Schatzflotten überquerten den Atlantik und kamen mit Silber beladen nach Sevilla in Spanien. Von dort verbreiteten sich die Achterstücke über Europa und die Welt.',
        sci: 'Die Flotten segelten von Havanna nach Sevilla, Sitz des Handelshauses (Casa de Contratación), das den Handel mit Amerika kontrollierte. Von Spanien aus verbreitete sich das spanische Silber über Europa und den Mittelmeerraum.',
      },
      manila: {
        kid: 'Von 1565 bis 1815 segelten Manila-Galeonen mit Silber an Bord von Acapulco in Mexiko über den Pazifik nach Manila und kamen mit Seide und Porzellan aus China zurück. So gelangten Achterstücke nach China.',
        sci: 'Die Manila-Galeonen, 1565 bis 1815, brachten Silber von Acapulco nach Manila, wo es chinesische Seide, Porzellan und Gewürze kaufte: Das Achterstück wurde die erste Weltwährung.',
      },
    },
    years: [
      { y: 1516, kid: '1516: In Joachimsthal in Böhmen wird Silber gefunden.', sci: '1516: In Joachimsthal (Jáchymov) in Böhmen wird Silber gefunden.' },
      { y: 1520, kid: '1520: Die ersten großen Silbermünzen, die Taler, werden geprägt. Hier beginnt das Wort „Dollar“.', sci: '1520, 9. Januar: Die Grafen Schlick dürfen die Guldengroschen prägen, die ersten Taler.' },
      { y: 1537, kid: '1537: Spanien legt das Achterstück fest: 27,47 Gramm fast reines Silber.', sci: '1537: Das Achterstück wird auf 27,47 g mit 93% Silber festgelegt; Mexiko-Stadt prägt es seit den 1530er-Jahren.' },
      { y: 1545, kid: '1545: Auf dem Cerro Rico bei Potosí in den Anden wird Silber gefunden.', sci: '1545: Potosí wird gegründet, nachdem auf dem Cerro Rico Silber gefunden wurde.' },
      { y: 1565, kid: '1565: Die ersten Manila-Galeonen segeln zwischen Mexiko und den Philippinen.', sci: '1565: Der Handel der Manila-Galeonen beginnt; er dauert bis 1815.' },
      { y: 1575, kid: 'Die 1570er-Jahre: Potosí bekommt eine eigene Münzstätte, sein Silber wird gleich vor Ort zu Münzen.', sci: 'Die 1570er-Jahre: In Potosí arbeitet eine königliche Münzstätte (Quellen nennen 1572 bis 1575).' },
      { y: 1732, kid: '1732: Runde, maschinell gemachte Münzen mit einem Muster am Rand.', sci: '1732: Mexiko-Stadt prägt die runden, geriffelten Säulendollar.' },
      { y: 1792, kid: '1792: Die Vereinigten Staaten machen ihren eigenen Dollar, dem spanischen nachempfunden.', sci: '1792: Das US-Münzgesetz legt den Dollar nach Gewicht fest: 371,25 Grain, 24,06 g, reines Silber.' },
      { y: 1815, kid: '1815: Die letzte Manila-Galeone segelt.', sci: '1815: Die letzte Manila-Galeone segelt.' },
      { y: 1857, kid: '1857: Spanische Dollars sind in den USA kein Geld mehr. Die Geschichte endet.', sci: '1857, 21. Februar: Spanische Dollars sind in den USA kein gesetzliches Zahlungsmittel mehr.' },
    ],
    panel: {
      kid: [
        'Das ist die Silberkarte. Silber kam aus Minen in Böhmen, Mexiko und den Anden und reiste per Schiff, Maultier und Lama, bis es Münzen wurden. Tipp auf eine Nadel, um ihre Geschichte zu hören, oder schieb die Jahre und sieh die Wege aufleuchten.',
        'Sieh, wie das Wort gereist ist: Thaler, Tolar, Daler, Dollar. 1792 wählten die neuen Vereinigten Staaten „Dollar“ für ihre Münze, weil man so die großen spanischen Silbermünzen nannte.',
      ],
      sci: [
        'Silber brachte den Welthandel in Gang: Joachimsthal 1516, Potosí ab 1545, Mexikos Münzstätte ab den 1530er-Jahren, die Manila-Galeonen von 1565 bis 1815. Der Regler läuft von 1500 bis 1857; ein Weg leuchtet auf, wenn sein Silber zu fließen begann.',
        'Das US-Münzgesetz von 1792 legte den Dollar nach Gewicht fest, 371,25 Grain (24,06 g) reines Silber, nach dem damals gebräuchlichen spanischen Dollar; spanische Dollars blieben in den USA bis zum 21. Februar 1857 gesetzliches Zahlungsmittel.',
      ],
    },
  },
  purser: {
    label: 'Ist es echtes Silber?',
    title: 'Die Prüfung des Zahlmeisters',
    hints: {
      coin: 'Tipp auf eine Münze',
      can: 'Tipp auf die Kanne, um die Münze einzutauchen',
      pan: 'Tipp auf die Waage, um die Münze zu wiegen',
      next: 'Tipp auf eine andere Münze',
    },
    buttons: { coin: 'Nächste Münze auf die Platte', can: 'In die Kanne tauchen', pan: 'Wiegen' },
    signs: { slab: 'Klangprobe', can: 'Volumen, mL' },
    mats: { ag: 'Silber', pb: 'Blei', cu: 'Kupfer', sn: 'Zinn' },
    board: { title: 'Dichte, g/cm3', coin: 'Münze {n} von 6', unknown: 'noch nicht gemessen', alloy: 'Silbermünze' },
    says: {
      ring: {
        ag: { kid: 'Kling! Sie klingt hell und lang, wie ein winziges Glöckchen. Ein gutes Zeichen, aber kein Beweis.', sci: 'Ein heller, langer Klang: ein gutes Zeichen, aber nur eine grobe Probe.' },
        pb: { kid: 'Plumps. Blei ist weich und dumpf: es klingt nicht.', sci: 'Ein dumpfer Schlag: weiches Metall unter einer Silberhaut. Eine grobe Probe.' },
        cu: { kid: 'Klonk. Ein kürzerer, dumpferer Ton als bei Silber.', sci: 'Kürzer und dumpfer als Silber, aber Ohren lassen sich täuschen: eine grobe Probe.' },
        sn: { kid: 'Ein dumpfes kleines Ticken. Zinn klingt nicht wie Silber.', sci: 'Ein kurzer, dumpfer Ton. Nur eine grobe Probe.' },
      },
      dip: {
        kid: 'Die Münze sinkt und das Wasser steigt im Röhrchen: {v} mL. So viel Platz braucht die Münze.',
        sci: 'Verdrängtes Wasser: {v} mL (cm3), das Volumen der Münze (nach Archimedes).',
      },
      weigh: {
        kid: 'Die Waage zeigt {m} g.',
        sci: 'Masse {m} g. Dichte = {m} g ÷ {v} cm3 = {d} g/cm3.',
      },
      verdict: {
        ag: { kid: '{d}: passt zu Silber mit ein bisschen Kupfer (etwa 10,4). Eine echte Münze!', sci: '{d} g/cm3: eine Legierung mit 93% Silber (etwa 10,4; reines Silber 10,50). Echt.' },
        pb: { kid: '{d}: das ist Blei, 11,3! Eine Fälschung mit dünner Silberschicht.', sci: '{d} g/cm3: Blei (11,34), nicht Silber. Es liegt nah, darum müssen Volumen und Masse zusammen gelesen werden.' },
        cu: { kid: '{d}: das ist Kupfer, 9,0. Eine Fälschung!', sci: '{d} g/cm3: Kupfer (8,96). Falsch.' },
        sn: { kid: '{d}: das ist Zinn, 7,3. Eine Fälschung!', sci: '{d} g/cm3: Zinn (7,29). Falsch.' },
      },
      all: {
        kid: 'Du hast alle sechs geprüft: drei echte Silbermünzen und drei Fälschungen. Archimedes wäre stolz!',
        sci: 'Alle sechs geprüft: drei echte Münzen, drei falsche. Derselbe Verdrängungstrick wird Archimedes zugeschrieben, in der Geschichte von der Krone eines Königs.',
      },
    },
    panel: {
      kid: [
        'Wie erkennt ein Zahlmeister eine echte Silbermünze von einer falschen? Eine falsche besteht aus billigerem Metall mit einer Silberschicht, sieht also gleich aus. Aber bei gleicher Größe wiegt sie mehr oder weniger als Silber. Also misst der Zahlmeister, wie viel Platz die Münze braucht (Wasser läuft in ein Röhrchen), wie viel sie wiegt, und teilt: das ist die Dichte.',
        'Silber ist 10,5-mal schwerer als dieselbe Menge Wasser; mit ein bisschen Kupfer etwa 10,4. Kupfer hat 9,0, Zinn 7,3, Blei 11,3. Tipp die Münzen nacheinander an: Welche sind echt?',
      ],
      sci: [
        'Dichte = Masse ÷ Volumen: Silber 10,50 g/cm3, Kupfer 8,96, Zinn 7,29, Blei 11,34; eine Münze mit 93% Silber und 7% Kupfer etwa 10,4. Eine Münze von 27,47 g nimmt 2,65 cm3 ein.',
        'Alle sechs Münzen hier haben diese Größe, darum wiegen die Fälschungen 30,0 g (Blei), 23,7 g (Kupfer) und 19,3 g (Zinn). Blei ist nur 8% dichter als Silber: Die Klangprobe ist alt und grob, und nur Masse und Volumen zusammen geben Sicherheit.',
      ],
    },
  },
}

export const DOLLAR_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
