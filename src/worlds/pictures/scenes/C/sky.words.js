// The words of carbon's sky room ("The carbon in the sky"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/C.js (the
// easel shows it); the room shows it happening and adds to it, calmly: what is measured, why it matters and
// what people are doing about it. Sources (checked 2026-10-30): NOAA GML's Mauna Loa monthly and annual
// means (file of 9 October 2026; March 1958 to April 1974 from Scripps), Scripps' news of June 2026 (the May
// peak), IPCC AR6 WG1 (2021), the ICS chart (Carboniferous 358.9 to 298.9 million years ago), Ember's Global
// Electricity Review 2025, the Global Carbon Budget 2024. Text drawn in 3D or on canvases writes CO2 plainly;
// the HUD's texts use real subscripts (CO₂).
export const SKY_WORDS = {
  en: {
    title: 'Above the clouds on Mauna Loa',
    greet: {
      kid: 'We are inside the picture: high on Mauna Loa, a volcano in Hawaii, above the clouds. People here have measured the carbon dioxide in the air every day since 1958. The picture\'s story is on the easel beside you.',
      sci: 'Mauna Loa Observatory, 3397 m up on the island of Hawaii, above the trade-wind clouds: home of the longest continuous record of atmospheric CO₂, begun by Charles David Keeling in March 1958. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Carbon dioxide is me holding two oxygen atoms. Plants breathe me in, you breathe me out, and a little of me in the air keeps the Earth warm enough to live on.',
        'The air up here has blown across thousands of kilometres of ocean, far from cities and forests. It is clean and well mixed, much like the air all over the world.',
        'Charles David Keeling started measuring here in 1958, when he was 29. He kept at it for the rest of his life, and his son Ralph carries on the measurements today.',
      ],
      sci: [
        'In 1955 and 1956 Keeling measured CO₂ in California\'s forests and mountains and found that well-mixed afternoon air held nearly the same amount everywhere. A single remote station could therefore follow the whole atmosphere.',
        'In November 2022 lava from Mauna Loa itself cut the observatory\'s road and power. From December 2022 the measurements came from Maunakea, about 34 km to the north, until they resumed here in July 2023.',
        'The air is drawn from intakes high on a tower. Hours when the wind brings gas from the volcano\'s vents, or air up from the island\'s forests, are set aside, so the record shows the background air.',
      ],
    },
    forest: {
      label: 'The window in time',
      title: 'The coal forest',
      sign: {
        ago: '{n} million years ago',
        today: 'Today',
        peat: 'Peat',
        brown: 'Brown coal',
        coal: 'Coal',
        rock: 'Sand and mud, now rock',
        sea: 'Sea mud',
        shale: 'Black shale',
        oil: 'Oil',
        gas: 'Gas',
      },
      slider: 'Time',
      hints: {
        tree: 'Tap a giant club moss',
        sea: 'Tap the sea',
        dial: 'Tap the time dial to press time',
        coal: 'Tap the coal seam',
        oil: 'Tap the oil',
        back: 'Tap the time dial to go back',
      },
      buttons: { tree: 'Fell a tree', sea: 'Plankton fall', coal: 'Lift out the coal', oil: 'Lift out the oil', back: 'Back to the forest' },
      says: {
        tree: {
          kid: 'Crash! The giant club moss falls into the swamp. The water has hardly any oxygen in it, so the wood does not rot away: it piles up as peat.',
          sci: 'A Lepidodendron falls into the swamp. In stagnant, oxygen-poor water fungi and bacteria break wood down only slowly, so it accumulates as peat.',
        },
        trees: {
          kid: 'All three giants are down. Now move time on and see what the swamp becomes: tap the time dial.',
          sci: 'Peat accumulates for thousands of years. Now let burial do its work: the time dial.',
        },
        fallen: { kid: 'That one has fallen already. Try another giant!', sci: 'Already fallen: choose a standing tree.' },
        sea: {
          kid: 'In the warm sea beside the swamp, tiny living things drift by the billion. When they die they sink like snow into the mud on the bottom.',
          sci: 'Plankton, mostly microscopic algae, rain down onto the sea floor. Where the bottom water lacks oxygen, their remains are buried in the mud instead of being eaten or decayed.',
        },
        brown: {
          kid: 'Sand and mud pile on top. The peat is squeezed and warmed: it is turning into brown coal.',
          sci: 'Burial: the peat loses water and is compacted into lignite, brown coal, already richer in carbon.',
        },
        coal: {
          kid: 'Millions of years of squeezing and warming: the peat has become black, shiny coal. Its carbon has been locked away from the air all this time.',
          sci: 'Deeper burial and higher temperatures drive off water, oxygen and hydrogen: lignite becomes bituminous coal, and with more heat anthracite, above 90 % carbon (dry and ash-free).',
        },
        oil: {
          kid: 'The sea mud has turned into black rock, and deep down the warmth has cooked the tiny sea creatures into oil and gas. They creep up into the sand above.',
          sci: 'In the source rock heat breaks the kerogen down: oil forms at roughly 60 to 120 °C, gas at higher temperatures. Both migrate up through porous sandstone until a tight cap rock traps them.',
        },
        today: {
          kid: 'Today! The forest lies deep under the ground as a seam of coal. Tap it.',
          sci: 'The present: the Carboniferous swamp is a coal seam under hundreds of metres of rock. Tap the seam.',
        },
        lift: {
          kid: 'Here it is: a block of coal, about 300 million years old. Almost all of it is carbon that plants once took out of the air.',
          sci: 'A block of Carboniferous coal: carbon fixed by photosynthesis about 300 million years ago and kept out of the atmosphere ever since. Burning it returns that carbon as CO₂ within seconds.',
        },
        oilOut: {
          kid: 'And a flask of oil. Oil and gas are buried sunshine too: tiny sea creatures caught it long ago.',
          sci: 'Crude oil, and the gas above it: carbon from ancient plankton. Burnt, they return it as CO₂, as coal does.',
        },
        notYet: { kid: 'No coal yet: the peat needs millions of years. Tap the time dial and press time on.', sci: 'Coalification needs deep burial and millions of years: move time on.' },
        noOil: { kid: 'No oil yet: the sea mud must be buried deeper and warmed for longer.', sci: 'The source rock has not reached the oil window yet.' },
        buried: { kid: 'The forest is buried now. Tap the time dial and go back in time to see it again.', sci: 'Buried: move time back to see the living swamp.' },
        back: { kid: 'Back 300 million years: the swamp forest is alive again.', sci: 'Back to the late Carboniferous swamp.' },
      },
      panel: {
        kid: [
          'About 300 million years ago, in a time called the Carboniferous, much of the land was warm swamp. Giant club mosses grew 30 metres tall and more, beside tree ferns and horsetails as big as trees, and insects like dragonflies flew on wings as wide as a pigeon\'s.',
          'When the giants fell, the swamp water kept them from rotting. They piled up as peat, were buried under sand and mud, and over millions of years were squeezed and warmed into coal. Oil and gas formed in the same slow way, mostly from tiny sea creatures. That is why they are called fossil fuels: they are made of things that lived long ago, full of carbon from the air of their time.',
        ],
        sci: [
          'The Carboniferous ran from about 359 to 299 million years ago; its name means "coal-bearing". Much of the coal of Europe and eastern North America comes from its later part, roughly 320 to 300 million years ago: tropical peat swamps of lycopsids such as Lepidodendron and Sigillaria, tree ferns (Psaronius) and giant horsetails (Calamites). The griffinfly Meganeura spanned about 65 cm.',
          'Coalification runs from peat to lignite, sub-bituminous and bituminous coal, then anthracite: with burial the material loses water, oxygen and hydrogen and is compacted several times over, so a coal seam stands for a much thicker layer of peat. Oil and gas come mostly from marine plankton and algae buried in oxygen-poor mud; heated to roughly 60 to 120 °C the kerogen yields oil, hotter still gas. Why the Carboniferous buried so much carbon is still debated: wet tropical climates and sinking basins mattered, and the idea that wood-rotting fungi had not yet evolved is now doubted.',
        ],
      },
    },
    curve: {
      label: 'The Keeling curve',
      title: 'Measuring the air since 1958',
      chart: {
        title: 'CO2 in the air at Mauna Loa',
        unit: 'parts per million (ppm)',
        before: 'Before factories: about 280 ppm, from air in old ice',
        year: 'One year up close',
        months: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        summer: 'Leaves out: plants take CO2 in',
        winter: 'Leaves fall: CO2 comes back',
        source: 'Monthly means: Scripps and NOAA',
        analyser: 'Analyser',
        ice: 'Ice core',
      },
      slider: 'Year',
      hints: {
        analyser: 'Tap the analyser to measure',
        wait: 'Watch the curve grow',
        tree: 'Tap the little tree',
        ice: 'Tap the ice core',
        slide: 'Slide through the years (E)',
      },
      buttons: { measure: 'Measure to today', tree: 'One year up close', ice: 'Air from old ice', start: 'Back to 1958' },
      says: {
        measure: {
          kid: 'Whoosh! Air from the top of the tower goes down the tube into the analyser, which measures its carbon dioxide. Watch the line grow, month after month.',
          sci: 'Air from the tower intakes flows to the analyser. Keeling\'s first instrument was a non-dispersive infrared analyser: it measured CO₂ by how much infrared light the air absorbed, checked against reference gases he measured with a manometer.',
        },
        today: {
          kid: 'From about 315 in 1958 to more than 420 now: the line climbs every year. In 2025 it was 427 on average.',
          sci: 'From 315.7 ppm in March 1958 to 427.35 ppm as the mean of 2025 (NOAA); the peak of May 2026 was about 432 ppm (Scripps 432.0, NOAA 432.3). The climb has sped up: under 1 ppm a year around 1960, about 2.5 ppm a year on average since 2010.',
        },
        tree: {
          kid: 'Watch one year. In spring and summer the leaves of the northern forests come out and breathe carbon dioxide in, so the line dips. In autumn and winter the leaves fall and rot, and it comes back.',
          sci: 'The seasonal cycle, about 6 ppm from peak to trough at Mauna Loa: northern-hemisphere photosynthesis draws CO₂ down from May to late September; respiration and decay outpace it from October to May.',
        },
        ice: {
          kid: 'This ice is from Antarctica. As the snow piled up it trapped tiny bubbles of air, so the ice keeps old air. Before factories and engines the air had about 280 parts per million: the blue line.',
          sci: 'Air bubbles in Antarctic ice, at Law Dome for instance, give about 280 ppm before the industrial era. Over the last 800,000 years the EPICA Dome C core shows CO₂ between about 180 ppm in ice ages and about 300 ppm in warm periods: today\'s level is higher than anywhere in that record.',
        },
        start: { kid: 'Back to 1958, when the measuring began.', sci: 'Reset to March 1958.' },
      },
      panel: {
        kid: [
          'Every bit of the line is a measurement. Charles David Keeling began in March 1958, high on this volcano, and the measuring has gone on ever since. "ppm" means parts per million: 420 ppm means that out of every million bits of air, 420 are carbon dioxide. That is very little, but it matters a lot for keeping heat in.',
          'The line goes up and down every year, as the forests of the north breathe in during summer and out during winter. But each year ends higher than the last, because burning coal, oil and gas adds more carbon dioxide than plants and the oceans can take back. Before factories there were about 280 parts per million; now there are more than 420.',
        ],
        sci: [
          'CO₂ is given as a mole fraction in dry air, in µmol/mol (ppm). Keeling\'s record at Mauna Loa, by Scripps from 1958 and by NOAA alongside since 1974, is the longest continuous one: 315.7 ppm in March 1958, 427.35 ppm as the annual mean of 2025 (NOAA). The seasonal cycle of about 6 ppm comes from the land plants of the northern hemisphere; the climb comes from fossil fuels, about 37 billion tonnes of CO₂ in 2024 (Global Carbon Budget), and from land-use change.',
          'About half of the CO₂ emitted each year stays in the air; the ocean and land plants take up the rest. The air itself shows where it comes from: its share of ¹³C is falling, because fossil carbon, made by plants, has less of it; its ¹⁴C has been diluted, because fossil carbon is too old to hold any (the Suess effect); and its oxygen is slowly decreasing as the fuel burns, as Ralph Keeling\'s measurements show.',
        ],
      },
    },
    blanket: {
      label: 'The blanket',
      title: 'How CO₂ keeps heat in',
      sign: { space: 'To space', ir: 'Heat light (infrared)', sun: 'Sunlight', warm: 'Warmer', n2: 'nitrogen', o2: 'oxygen', co2: 'carbon dioxide' },
      slider: 'CO₂ molecules in the model',
      hints: {
        chimney: 'Tap the chimney to burn coal',
        co2: 'Tap a CO₂ molecule',
        air: 'Tap a blue or a red pair',
        help: 'Tap the wind turbine, the solar panels or the trees',
        slide: 'Try more or less CO₂ (E)',
      },
      buttons: { burn: 'Burn coal', clean: 'Wind and sun', tree: 'Plant a tree', catch: 'Catch some heat' },
      says: {
        burn: {
          kid: 'Puff! Burning coal joins its carbon to oxygen from the air: one more CO₂ molecule floats up into the sky.',
          sci: 'C + O₂ → CO₂: every 12 g of carbon burnt makes 44 g of carbon dioxide. In the model each molecule stands for about 35 ppm.',
        },
        full: {
          kid: 'That is a lot of CO₂ for this little sky. Try the wind turbine, the solar panels or the trees!',
          sci: 'The model holds 20 at most, about 700 ppm.',
        },
        catch: {
          kid: 'Caught! The CO₂ molecule catches heat light, wobbles, and sends it out again in any direction. Some goes back down and warms the ground.',
          sci: 'Absorption near 15 µm excites the bending vibration; the energy goes out again in a random direction, so part of the outgoing infrared returns to the surface.',
        },
        none: { kid: 'There is no CO₂ in this sky now. Tap the chimney to add some.', sci: 'No CO₂ in the model: add some first.' },
        n2: {
          kid: 'Nitrogen: two atoms the same. Heat light goes straight through it; it cannot catch it.',
          sci: 'N₂, two identical atoms: its only vibration, a stretch, keeps it symmetric, with no changing dipole, so it does not absorb thermal infrared.',
        },
        o2: {
          kid: 'Oxygen: two atoms the same, like nitrogen. Heat light goes straight through it too.',
          sci: 'O₂, like N₂, gains no dipole when it vibrates: transparent to the Earth\'s infrared. Together they make 99 % of dry air.',
        },
        clean: {
          kid: 'The wind turbine spins and the solar panels shine: electricity without burning anything. The chimney stops, and no more CO₂ goes up.',
          sci: 'Wind and solar power make electricity without combustion. In 2024 they made about 15 % of the world\'s electricity together, more than ever before (Ember).',
        },
        already: { kid: 'The wind and the sun are making the electricity already.', sci: 'Already running on wind and sun.' },
        again: { kid: 'Back to burning coal: the chimney smokes again.', sci: 'Combustion resumes.' },
        tree: {
          kid: 'A new tree grows and breathes in one CO₂ molecule, keeping its carbon in the wood. Trees help, slowly; burning less helps most.',
          sci: 'Photosynthesis fixes CO₂ into wood. Land plants and soils take up roughly a quarter to a third of the CO₂ emitted each year, as long as forests grow and are not cut or burnt.',
        },
        bare: { kid: 'There is no CO₂ left in this sky for the trees to take.', sci: 'No CO₂ left in the model.' },
        forest: { kid: 'A whole little forest! Its trees keep their carbon as long as they stand.', sci: 'The model forest is full: four trees at most.' },
      },
      panel: {
        kid: [
          'Sunlight comes through the air and warms the ground. The warm ground then glows with heat light, called infrared, that our eyes cannot see. Nitrogen and oxygen, almost all of the air, let it straight through. Carbon dioxide catches some of it and sends it out again in every direction, some of it back down, so the ground stays warmer, as you do under a blanket. In real air only about 4 in every ten thousand bits are carbon dioxide; here there are many more, so you can see them.',
          'A little of this is good: without any blanket the Earth would be frozen, about −18 °C on average instead of about 15 °C. More carbon dioxide makes the blanket thicker, and the Earth warms. And people are doing something about it: wind turbines, solar panels and new forests are growing all over the world, and we are learning to make electricity, heat our homes and travel without burning so much.',
        ],
        sci: [
          'The surface, at about 15 °C, radiates in the thermal infrared, most strongly near 10 µm. A molecule absorbs infrared only if its vibration changes its dipole moment. N₂ and O₂, two identical atoms, stay symmetric however they stretch, so they let it pass. CO₂ has three atoms and can bend: the carbon moves one way, the oxygens the other, and the charge shifts. The bend absorbs at 667 cm⁻¹, about 15 µm, close to the peak of the Earth\'s emission; the asymmetric stretch absorbs at 4.3 µm. Water vapour and methane absorb for the same reason.',
          'In the dense lower air an excited CO₂ molecule usually hands its energy to its neighbours in collisions before it can re-emit; the warmed air then radiates in all directions, partly back down. With more CO₂ the Earth sends its heat to space from higher, colder air, so it warms until the balance returns: about 1.1 °C so far (2011 to 2020 against 1850 to 1900, IPCC 2021), and about 3 °C for each doubling of CO₂ in the long run (likely 2.5 to 4 °C). In the model each CO₂ stands for about 35 ppm; real air holds about one CO₂ in every 2300 molecules. Since the Paris Agreement of 2015 nearly every country has set targets to cut emissions, and wind and solar power are growing faster than any other source of electricity (Ember, 2025).',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Acima das nuvens no Mauna Loa',
    greet: {
      kid: 'Estamos dentro da imagem: no alto do Mauna Loa, um vulcão no Havai, acima das nuvens. Aqui mede-se o dióxido de carbono do ar todos os dias desde 1958. A história da imagem está no cavalete ao teu lado.',
      sci: 'O Observatório de Mauna Loa, a 3397 m de altitude na ilha do Havai, acima das nuvens dos alísios: aqui fica o mais longo registo contínuo do CO₂ da atmosfera, começado por Charles David Keeling em março de 1958. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O dióxido de carbono sou eu agarrado a dois átomos de oxigénio. As plantas absorvem-me, tu expiras-me, e um pouco de mim no ar mantém a Terra quente o suficiente para haver vida.',
        'O ar aqui em cima veio soprado por milhares de quilómetros de oceano, longe das cidades e das florestas. É limpo e bem misturado, muito parecido com o ar do mundo inteiro.',
        'Charles David Keeling começou a medir aqui em 1958, quando tinha 29 anos. Continuou durante o resto da vida, e hoje é o filho, Ralph, quem continua as medições.',
      ],
      sci: [
        'Em 1955 e 1956 Keeling mediu o CO₂ nas florestas e montanhas da Califórnia e viu que o ar bem misturado da tarde tinha quase a mesma quantidade em todo o lado. Por isso, uma única estação remota podia acompanhar a atmosfera inteira.',
        'Em novembro de 2022 a lava do próprio Mauna Loa cortou a estrada e a eletricidade do observatório. A partir de dezembro de 2022 as medições vieram de Maunakea, cerca de 34 km a norte, até recomeçarem aqui em julho de 2023.',
        'O ar é aspirado por entradas no alto de uma torre. As horas em que o vento traz gases das fendas do vulcão, ou ar das florestas da ilha, ficam de parte, para que o registo mostre o ar de fundo.',
      ],
    },
    forest: {
      label: 'A janela no tempo',
      title: 'A floresta do carvão',
      sign: {
        ago: 'Há {n} milhões de anos',
        today: 'Hoje',
        peat: 'Turfa',
        brown: 'Lenhite',
        coal: 'Carvão',
        rock: 'Areia e lodo, agora rocha',
        sea: 'Lodo do mar',
        shale: 'Xisto negro',
        oil: 'Petróleo',
        gas: 'Gás',
      },
      slider: 'Tempo',
      hints: {
        tree: 'Toca num licopódio gigante',
        sea: 'Toca no mar',
        dial: 'Toca no mostrador do tempo para o fazer avançar',
        coal: 'Toca na camada de carvão',
        oil: 'Toca no petróleo',
        back: 'Toca no mostrador do tempo para voltar atrás',
      },
      buttons: { tree: 'Derrubar uma árvore', sea: 'Chuva de plâncton', coal: 'Tirar o carvão', oil: 'Tirar o petróleo', back: 'Voltar à floresta' },
      says: {
        tree: {
          kid: 'Catrapum! O licopódio gigante cai no pântano. A água quase não tem oxigénio, por isso a madeira não apodrece: vai-se acumulando como turfa.',
          sci: 'Um Lepidodendron cai no pântano. Em água parada e pobre em oxigénio, fungos e bactérias decompõem a madeira só muito devagar, e ela acumula-se como turfa.',
        },
        trees: {
          kid: 'Os três gigantes caíram. Agora faz avançar o tempo e vê em que se transforma o pântano: toca no mostrador do tempo.',
          sci: 'A turfa acumula-se durante milhares de anos. Agora deixa o soterramento fazer o seu trabalho: o mostrador do tempo.',
        },
        fallen: { kid: 'Esse já caiu. Experimenta outro gigante!', sci: 'Já caído: escolhe uma árvore de pé.' },
        sea: {
          kid: 'No mar quente ao lado do pântano flutuam aos milhares de milhões seres vivos minúsculos. Quando morrem, afundam-se como neve no lodo do fundo.',
          sci: 'O plâncton, sobretudo algas microscópicas, cai como chuva no fundo do mar. Onde a água do fundo tem pouco oxigénio, os seus restos ficam enterrados no lodo em vez de serem comidos ou decompostos.',
        },
        brown: {
          kid: 'Areia e lodo amontoam-se por cima. A turfa é apertada e aquecida: está a transformar-se em lenhite, um carvão castanho.',
          sci: 'Soterramento: a turfa perde água e é compactada em lenhite, carvão castanho, já mais rica em carbono.',
        },
        coal: {
          kid: 'Milhões de anos a apertar e a aquecer: a turfa tornou-se carvão preto e brilhante. O seu carbono esteve todo este tempo guardado, longe do ar.',
          sci: 'Um soterramento mais fundo e temperaturas mais altas expulsam água, oxigénio e hidrogénio: a lenhite passa a carvão betuminoso e, com mais calor, a antracite, com mais de 90 % de carbono (seca e sem cinzas).',
        },
        oil: {
          kid: 'O lodo do mar tornou-se rocha negra, e lá no fundo o calor cozinhou os seres marinhos minúsculos em petróleo e gás. Eles sobem devagarinho para a areia de cima.',
          sci: 'Na rocha-mãe o calor decompõe o querogénio: o petróleo forma-se a cerca de 60 a 120 °C, o gás a temperaturas mais altas. Ambos sobem pelo arenito poroso até uma rocha de cobertura impermeável os reter.',
        },
        today: {
          kid: 'Hoje! A floresta está enterrada bem fundo no chão, como uma camada de carvão. Toca nela.',
          sci: 'O presente: o pântano do Carbonífero é uma camada de carvão debaixo de centenas de metros de rocha. Toca na camada.',
        },
        lift: {
          kid: 'Aqui está: um bloco de carvão com cerca de 300 milhões de anos. Quase todo ele é carbono que as plantas tiraram do ar há muito tempo.',
          sci: 'Um bloco de carvão do Carbonífero: carbono fixado pela fotossíntese há cerca de 300 milhões de anos e mantido fora da atmosfera desde então. Queimá-lo devolve esse carbono como CO₂ em segundos.',
        },
        oilOut: {
          kid: 'E um frasco de petróleo. O petróleo e o gás também são sol enterrado: seres marinhos minúsculos apanharam-no há muito tempo.',
          sci: 'Petróleo bruto, e o gás por cima dele: carbono de plâncton antigo. Queimados, devolvem-no como CO₂, tal como o carvão.',
        },
        notYet: { kid: 'Ainda não há carvão: a turfa precisa de milhões de anos. Toca no mostrador do tempo e faz o tempo avançar.', sci: 'A incarbonização precisa de soterramento profundo e de milhões de anos: faz avançar o tempo.' },
        noOil: { kid: 'Ainda não há petróleo: o lodo do mar tem de ficar mais fundo e aquecer durante mais tempo.', sci: 'A rocha-mãe ainda não chegou à janela do petróleo.' },
        buried: { kid: 'A floresta agora está enterrada. Toca no mostrador do tempo e volta atrás no tempo para a veres outra vez.', sci: 'Enterrada: faz recuar o tempo para ver o pântano vivo.' },
        back: { kid: 'Recuámos 300 milhões de anos: a floresta do pântano está viva outra vez.', sci: 'De volta ao pântano do Carbonífero superior.' },
      },
      panel: {
        kid: [
          'Há cerca de 300 milhões de anos, num tempo chamado Carbonífero, grande parte da terra era pântano quente. Licopódios gigantes cresciam até 30 metros de altura e mais, ao lado de fetos arbóreos e cavalinhas do tamanho de árvores, e insetos parecidos com libélulas voavam com asas tão largas como as de um pombo.',
          'Quando os gigantes caíam, a água do pântano não os deixava apodrecer. Acumulavam-se como turfa, ficavam enterrados debaixo de areia e lodo e, ao longo de milhões de anos, eram apertados e aquecidos até virarem carvão. O petróleo e o gás formaram-se da mesma maneira lenta, sobretudo a partir de seres marinhos minúsculos. É por isso que se chamam combustíveis fósseis: são feitos de seres que viveram há muito tempo, cheios de carbono do ar do seu tempo.',
        ],
        sci: [
          'O Carbonífero durou de há cerca de 359 a 299 milhões de anos; o nome significa «que contém carvão». Grande parte do carvão da Europa e do leste da América do Norte vem da sua parte final, entre há cerca de 320 e 300 milhões de anos: pântanos tropicais de turfa com licófitas como Lepidodendron e Sigillaria, fetos arbóreos (Psaronius) e cavalinhas gigantes (Calamites). A Meganeura, parecida com uma libélula, tinha uma envergadura de cerca de 65 cm.',
          'A incarbonização vai da turfa à lenhite, ao carvão sub-betuminoso e betuminoso e depois à antracite: com o soterramento o material perde água, oxigénio e hidrogénio e é compactado várias vezes, por isso uma camada de carvão corresponde a uma camada de turfa muito mais espessa. O petróleo e o gás vêm sobretudo de plâncton e algas marinhas enterrados em lodo pobre em oxigénio; aquecido a cerca de 60 a 120 °C, o querogénio dá petróleo e, mais quente ainda, gás. Porque é que o Carbonífero enterrou tanto carbono ainda se discute: os climas tropicais húmidos e as bacias em afundamento contaram, e a ideia de que os fungos que apodrecem a madeira ainda não tinham surgido é hoje posta em dúvida.',
        ],
      },
    },
    curve: {
      label: 'A curva de Keeling',
      title: 'A medir o ar desde 1958',
      chart: {
        title: 'CO2 no ar do Mauna Loa',
        unit: 'partes por milhão (ppm)',
        before: 'Antes das fábricas: cerca de 280 ppm, do ar no gelo antigo',
        year: 'Um ano de perto',
        months: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        summer: 'Folhas a crescer: as plantas absorvem CO2',
        winter: 'Folhas a cair: o CO2 volta',
        source: 'Médias mensais: Scripps e NOAA',
        analyser: 'Analisador',
        ice: 'Testemunho de gelo',
      },
      slider: 'Ano',
      hints: {
        analyser: 'Toca no analisador para medir',
        wait: 'Vê a curva a crescer',
        tree: 'Toca na arvorezinha',
        ice: 'Toca no testemunho de gelo',
        slide: 'Percorre os anos com o cursor (E)',
      },
      buttons: { measure: 'Medir até hoje', tree: 'Um ano de perto', ice: 'Ar do gelo antigo', start: 'Voltar a 1958' },
      says: {
        measure: {
          kid: 'Fuuu! O ar do alto da torre desce pelo tubo até ao analisador, que mede o seu dióxido de carbono. Vê a linha a crescer, mês após mês.',
          sci: 'O ar das entradas da torre corre até ao analisador. O primeiro instrumento de Keeling era um analisador de infravermelho não dispersivo: media o CO₂ pela quantidade de luz infravermelha que o ar absorvia, verificado com gases de referência que o próprio Keeling media com um manómetro.',
        },
        today: {
          kid: 'De cerca de 315 em 1958 para mais de 420 agora: a linha sobe todos os anos. Em 2025 foi em média 427.',
          sci: 'De 315,7 ppm em março de 1958 para 427,35 ppm como média de 2025 (NOAA); o pico de maio de 2026 foi de cerca de 432 ppm (Scripps 432,0; NOAA 432,3). A subida acelerou: menos de 1 ppm por ano por volta de 1960, cerca de 2,5 ppm por ano em média desde 2010.',
        },
        tree: {
          kid: 'Vê um ano inteiro. Na primavera e no verão as folhas das florestas do norte rebentam e absorvem dióxido de carbono, por isso a linha desce. No outono e no inverno as folhas caem e apodrecem, e ele volta.',
          sci: 'O ciclo das estações, cerca de 6 ppm entre o máximo e o mínimo no Mauna Loa: a fotossíntese do hemisfério norte faz baixar o CO₂ de maio ao fim de setembro; a respiração e a decomposição ultrapassam-na de outubro a maio.',
        },
        ice: {
          kid: 'Este gelo vem da Antártida. Enquanto a neve se ia acumulando, apanhou bolhinhas de ar, por isso o gelo guarda ar antigo. Antes das fábricas e dos motores, o ar tinha cerca de 280 partes por milhão: a linha azul.',
          sci: 'As bolhas de ar no gelo da Antártida, em Law Dome por exemplo, dão cerca de 280 ppm antes da era industrial. Nos últimos 800 000 anos, o testemunho EPICA Dome C mostra o CO₂ entre cerca de 180 ppm nas idades do gelo e cerca de 300 ppm nos períodos quentes: o nível de hoje é mais alto do que em qualquer ponto desse registo.',
        },
        start: { kid: 'Voltámos a 1958, quando as medições começaram.', sci: 'Reposto em março de 1958.' },
      },
      panel: {
        kid: [
          'Cada bocadinho da linha é uma medição. Charles David Keeling começou em março de 1958, no alto deste vulcão, e as medições nunca pararam. «ppm» quer dizer partes por milhão: 420 ppm significa que, em cada milhão de partículas de ar, 420 são de dióxido de carbono. É muito pouco, mas conta muito para segurar o calor.',
          'A linha sobe e desce todos os anos, porque as florestas do norte absorvem dióxido de carbono no verão e libertam-no no inverno. Mas cada ano acaba mais alto do que o anterior, porque queimar carvão, petróleo e gás junta mais dióxido de carbono do que as plantas e os oceanos conseguem tirar. Antes das fábricas havia cerca de 280 partes por milhão; agora há mais de 420.',
        ],
        sci: [
          'O CO₂ é dado como fração molar no ar seco, em µmol/mol (ppm). O registo de Keeling no Mauna Loa, feito pela Scripps desde 1958 e também pela NOAA desde 1974, é o mais longo registo contínuo: 315,7 ppm em março de 1958, 427,35 ppm como média anual de 2025 (NOAA). O ciclo das estações, de cerca de 6 ppm, vem das plantas terrestres do hemisfério norte; a subida vem dos combustíveis fósseis, cerca de 37 mil milhões de toneladas de CO₂ em 2024 (Global Carbon Budget), e das mudanças no uso do solo.',
          'Cerca de metade do CO₂ emitido em cada ano fica no ar; o oceano e as plantas terrestres absorvem o resto. O próprio ar mostra de onde ele vem: a sua parte de ¹³C está a diminuir, porque o carbono fóssil, feito por plantas, tem menos dele; o seu ¹⁴C foi diluído, porque o carbono fóssil é demasiado antigo para ainda ter algum (o efeito Suess); e o seu oxigénio está a diminuir devagar à medida que o combustível arde, como mostram as medições de Ralph Keeling.',
        ],
      },
    },
    blanket: {
      label: 'O cobertor',
      title: 'Como o CO₂ segura o calor',
      sign: { space: 'Para o espaço', ir: 'Luz de calor (infravermelho)', sun: 'Luz do Sol', warm: 'Mais quente', n2: 'azoto', o2: 'oxigénio', co2: 'dióxido de carbono' },
      slider: 'Moléculas de CO₂ no modelo',
      hints: {
        chimney: 'Toca na chaminé para queimar carvão',
        co2: 'Toca numa molécula de CO₂',
        air: 'Toca num par azul ou vermelho',
        help: 'Toca na turbina eólica, nos painéis solares ou nas árvores',
        slide: 'Experimenta mais ou menos CO₂ (E)',
      },
      buttons: { burn: 'Queimar carvão', clean: 'Vento e sol', tree: 'Plantar uma árvore', catch: 'Apanhar calor' },
      says: {
        burn: {
          kid: 'Puf! Queimar carvão junta o seu carbono ao oxigénio do ar: mais uma molécula de CO₂ sobe para o céu.',
          sci: 'C + O₂ → CO₂: cada 12 g de carbono queimado dão 44 g de dióxido de carbono. No modelo, cada molécula representa cerca de 35 ppm.',
        },
        full: {
          kid: 'É muito CO₂ para este céu pequenino. Experimenta a turbina eólica, os painéis solares ou as árvores!',
          sci: 'O modelo leva no máximo 20, cerca de 700 ppm.',
        },
        catch: {
          kid: 'Apanhada! A molécula de CO₂ apanha luz de calor, abana e volta a enviá-la numa direção qualquer. Uma parte volta para baixo e aquece o chão.',
          sci: 'A absorção perto dos 15 µm excita a vibração de flexão; a energia volta a sair numa direção ao acaso, por isso parte do infravermelho que sobe regressa à superfície.',
        },
        none: { kid: 'Agora não há CO₂ neste céu. Toca na chaminé para juntar algum.', sci: 'Não há CO₂ no modelo: junta algum primeiro.' },
        n2: {
          kid: 'Azoto: dois átomos iguais. A luz de calor passa a direito por ele; não a consegue apanhar.',
          sci: 'N₂, dois átomos iguais: a sua única vibração, um estiramento, mantém-no simétrico, sem dipolo variável, por isso não absorve o infravermelho térmico.',
        },
        o2: {
          kid: 'Oxigénio: dois átomos iguais, como o azoto. A luz de calor também passa a direito.',
          sci: 'O O₂, tal como o N₂, não ganha dipolo quando vibra: é transparente ao infravermelho da Terra. Juntos fazem 99 % do ar seco.',
        },
        clean: {
          kid: 'A turbina eólica gira e os painéis solares brilham: eletricidade sem queimar nada. A chaminé para, e não sobe mais CO₂.',
          sci: 'A energia eólica e a solar produzem eletricidade sem combustão. Em 2024 fizeram juntas cerca de 15 % da eletricidade do mundo, mais do que nunca (Ember).',
        },
        already: { kid: 'O vento e o sol já estão a fazer a eletricidade.', sci: 'Já a funcionar com vento e sol.' },
        again: { kid: 'De volta a queimar carvão: a chaminé fumega outra vez.', sci: 'A combustão recomeça.' },
        tree: {
          kid: 'Uma árvore nova cresce e absorve uma molécula de CO₂, guardando o carbono na madeira. As árvores ajudam, devagar; queimar menos é o que mais ajuda.',
          sci: 'A fotossíntese fixa o CO₂ na madeira. As plantas terrestres e os solos absorvem entre um quarto e um terço do CO₂ emitido em cada ano, desde que as florestas cresçam e não sejam cortadas nem queimadas.',
        },
        bare: { kid: 'Já não há CO₂ neste céu para as árvores apanharem.', sci: 'Não resta CO₂ no modelo.' },
        forest: { kid: 'Uma florestazinha inteira! As árvores guardam o seu carbono enquanto estão de pé.', sci: 'A floresta do modelo está cheia: quatro árvores no máximo.' },
      },
      panel: {
        kid: [
          'A luz do Sol atravessa o ar e aquece o chão. O chão quente brilha então com luz de calor, chamada infravermelho, que os nossos olhos não veem. O azoto e o oxigénio, quase todo o ar, deixam-na passar a direito. O dióxido de carbono apanha uma parte e volta a enviá-la em todas as direções, uma parte para baixo, e assim o chão fica mais quente, como tu debaixo de um cobertor. No ar a sério só cerca de 4 em cada dez mil partículas são de dióxido de carbono; aqui há muitas mais, para as conseguires ver.',
          'Um bocadinho disto é bom: sem cobertor nenhum a Terra estaria gelada, com cerca de −18 °C em média em vez de cerca de 15 °C. Mais dióxido de carbono torna o cobertor mais grosso, e a Terra aquece. E as pessoas estão a fazer alguma coisa: turbinas eólicas, painéis solares e florestas novas estão a crescer por todo o mundo, e estamos a aprender a fazer eletricidade, aquecer as casas e viajar sem queimar tanto.',
        ],
        sci: [
          'A superfície, a cerca de 15 °C, irradia no infravermelho térmico, mais fortemente perto dos 10 µm. Uma molécula só absorve infravermelho se a sua vibração alterar o seu momento dipolar. O N₂ e o O₂, dois átomos iguais, ficam simétricos por mais que se estiquem, por isso deixam-no passar. O CO₂ tem três átomos e pode dobrar-se: o carbono vai para um lado, os oxigénios para o outro, e a carga desloca-se. A flexão absorve a 667 cm⁻¹, cerca de 15 µm, perto do máximo da emissão da Terra; o estiramento assimétrico absorve a 4,3 µm. O vapor de água e o metano absorvem pela mesma razão.',
          'No ar denso das camadas baixas, uma molécula de CO₂ excitada costuma passar a energia às vizinhas em colisões antes de a poder reemitir; o ar aquecido irradia então em todas as direções, em parte para baixo. Com mais CO₂ a Terra manda o seu calor para o espaço a partir de ar mais alto e mais frio, por isso aquece até o equilíbrio voltar: cerca de 1,1 °C até agora (2011 a 2020 em relação a 1850 a 1900, IPCC 2021) e cerca de 3 °C por cada duplicação do CO₂ a longo prazo (provavelmente 2,5 a 4 °C). No modelo cada CO₂ representa cerca de 35 ppm; o ar real tem cerca de um CO₂ em cada 2300 moléculas. Desde o Acordo de Paris de 2015 quase todos os países fixaram metas para cortar emissões, e a energia eólica e a solar crescem mais depressa do que qualquer outra fonte de eletricidade (Ember, 2025).',
        ],
      },
    },
  },
  pl: {
    title: 'Ponad chmurami na Mauna Loa',
    greet: {
      kid: 'Jesteśmy w obrazku: wysoko na Mauna Loa, wulkanie na Hawajach, ponad chmurami. Ludzie mierzą tu dwutlenek węgla w powietrzu codziennie od 1958 roku. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Obserwatorium Mauna Loa, 3397 m n.p.m. na Hawajach, ponad chmurami pasatów: tu prowadzi się najdłuższy ciągły pomiar CO₂ w atmosferze, rozpoczęty przez Charlesa Davida Keelinga w marcu 1958 roku. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Dwutlenek węgla to ja, trzymający dwa atomy tlenu. Rośliny mnie pobierają, ty mnie wydychasz, a odrobina mnie w powietrzu sprawia, że na Ziemi jest dość ciepło, żeby żyć.',
        'Powietrze tutaj przywiał wiatr znad tysięcy kilometrów oceanu, z dala od miast i lasów. Jest czyste i dobrze wymieszane, bardzo podobne do powietrza na całym świecie.',
        'Charles David Keeling zaczął tu mierzyć w 1958 roku, kiedy miał 29 lat. Robił to do końca życia, a dziś pomiary prowadzi dalej jego syn Ralph.',
      ],
      sci: [
        'W latach 1955 i 1956 Keeling mierzył CO₂ w lasach i górach Kalifornii i odkrył, że dobrze wymieszane popołudniowe powietrze ma go wszędzie prawie tyle samo. Dlatego jedna odległa stacja mogła śledzić całą atmosferę.',
        'W listopadzie 2022 roku lawa z samej Mauna Loa przecięła drogę i linię zasilania obserwatorium. Od grudnia 2022 roku pomiary pochodziły z Maunakea, około 34 km na północ, aż w lipcu 2023 roku wznowiono je tutaj.',
        'Powietrze jest pobierane przez wloty wysoko na wieży. Godziny, w których wiatr niesie gazy ze szczelin wulkanu albo powietrze z lasów wyspy, są pomijane, żeby pomiar pokazywał powietrze tła.',
      ],
    },
    forest: {
      label: 'Okno w czasie',
      title: 'Las węglowy',
      sign: {
        ago: '{n} mln lat temu',
        today: 'Dziś',
        peat: 'Torf',
        brown: 'Węgiel brunatny',
        coal: 'Węgiel kamienny',
        rock: 'Piasek i muł, dziś skała',
        sea: 'Muł morski',
        shale: 'Czarny łupek',
        oil: 'Ropa',
        gas: 'Gaz',
      },
      slider: 'Czas',
      hints: {
        tree: 'Dotknij olbrzymiego widłaka',
        sea: 'Dotknij morza',
        dial: 'Dotknij tarczy czasu, żeby przesunąć czas',
        coal: 'Dotknij pokładu węgla',
        oil: 'Dotknij ropy',
        back: 'Dotknij tarczy czasu, żeby cofnąć czas',
      },
      buttons: { tree: 'Zwal drzewo', sea: 'Deszcz planktonu', coal: 'Wyjmij węgiel', oil: 'Wyjmij ropę', back: 'Z powrotem do lasu' },
      says: {
        tree: {
          kid: 'Trach! Olbrzymi widłak wpada do bagna. W wodzie prawie nie ma tlenu, więc drewno nie gnije: odkłada się jako torf.',
          sci: 'Lepidodendron wpada do bagna. W stojącej, ubogiej w tlen wodzie grzyby i bakterie rozkładają drewno bardzo powoli, więc gromadzi się ono jako torf.',
        },
        trees: {
          kid: 'Wszystkie trzy olbrzymy leżą. Teraz przesuń czas naprzód i zobacz, czym stanie się bagno: dotknij tarczy czasu.',
          sci: 'Torf gromadzi się przez tysiące lat. Teraz niech pogrzebanie zrobi swoje: tarcza czasu.',
        },
        fallen: { kid: 'Ten już leży. Spróbuj innego olbrzyma!', sci: 'Już przewrócony: wybierz stojące drzewo.' },
        sea: {
          kid: 'W ciepłym morzu obok bagna unoszą się miliardy maleńkich żywych istot. Kiedy umierają, opadają jak śnieg w muł na dnie.',
          sci: 'Plankton, głównie mikroskopijne glony, opada na dno morza. Tam, gdzie przy dnie brakuje tlenu, jego szczątki zostają pogrzebane w mule, zamiast zostać zjedzone albo rozłożone.',
        },
        brown: {
          kid: 'Na wierzchu piętrzą się piasek i muł. Torf jest ściskany i ogrzewany: zmienia się w węgiel brunatny.',
          sci: 'Pogrzebanie: torf traci wodę i jest zagęszczany w węgiel brunatny (lignit), już bogatszy w pierwiastek węgiel.',
        },
        coal: {
          kid: 'Miliony lat ściskania i ogrzewania: torf stał się czarnym, błyszczącym węglem kamiennym. Jego węgiel był przez cały ten czas zamknięty z dala od powietrza.',
          sci: 'Głębsze pogrzebanie i wyższa temperatura wypędzają wodę, tlen i wodór: węgiel brunatny staje się węglem kamiennym, a przy większym cieple antracytem, z ponad 90 % pierwiastka węgla (w stanie suchym i bezpopiołowym).',
        },
        oil: {
          kid: 'Muł morski zmienił się w czarną skałę, a głęboko pod ziemią ciepło ugotowało maleńkie morskie stworzenia na ropę i gaz. Powoli przesączają się w górę, do piasku.',
          sci: 'W skale macierzystej ciepło rozkłada kerogen: ropa powstaje w około 60 do 120 °C, gaz w wyższej temperaturze. Oba migrują w górę przez porowaty piaskowiec, aż zatrzyma je szczelna skała uszczelniająca.',
        },
        today: {
          kid: 'Dziś! Las leży głęboko pod ziemią jako pokład węgla. Dotknij go.',
          sci: 'Teraźniejszość: karbońskie bagno to pokład węgla pod setkami metrów skał. Dotknij pokładu.',
        },
        lift: {
          kid: 'Proszę bardzo: bryła węgla kamiennego, ma około 300 milionów lat. Prawie cała jest z węgla, który rośliny dawno temu wyjęły z powietrza.',
          sci: 'Bryła karbońskiego węgla kamiennego: węgiel związany w fotosyntezie około 300 milionów lat temu i od tamtej pory trzymany z dala od atmosfery. Spalenie go oddaje ten węgiel jako CO₂ w kilka sekund.',
        },
        oilOut: {
          kid: 'I butelka ropy. Ropa i gaz to też zakopane światło słońca: maleńkie morskie stworzenia złapały je dawno temu.',
          sci: 'Ropa naftowa i gaz nad nią: węgiel z dawnego planktonu. Spalone oddają go jako CO₂, tak jak węgiel kamienny.',
        },
        notYet: { kid: 'Jeszcze nie ma węgla: torf potrzebuje milionów lat. Dotknij tarczy czasu i przesuń czas naprzód.', sci: 'Uwęglenie wymaga głębokiego pogrzebania i milionów lat: przesuń czas naprzód.' },
        noOil: { kid: 'Jeszcze nie ma ropy: muł morski musi leżeć głębiej i dłużej się grzać.', sci: 'Skała macierzysta nie weszła jeszcze w okno ropne.' },
        buried: { kid: 'Las jest teraz pogrzebany. Dotknij tarczy czasu i cofnij czas, żeby znowu go zobaczyć.', sci: 'Pogrzebany: cofnij czas, żeby zobaczyć żywe bagno.' },
        back: { kid: 'Cofamy się o 300 milionów lat: bagienny las znowu żyje.', sci: 'Z powrotem w bagnie późnego karbonu.' },
      },
      panel: {
        kid: [
          'Około 300 milionów lat temu, w czasach zwanych karbonem, duża część lądu była ciepłym bagnem. Olbrzymie widłaki rosły na 30 metrów i więcej, obok paproci drzewiastych i skrzypów wielkich jak drzewa, a owady podobne do ważek latały na skrzydłach szerokich jak u gołębia.',
          'Kiedy olbrzymy się przewracały, woda bagna nie pozwalała im zgnić. Odkładały się jako torf, były zasypywane piaskiem i mułem i przez miliony lat ściskane i ogrzewane, aż stały się węglem kamiennym. Ropa i gaz powstały w ten sam powolny sposób, głównie z maleńkich morskich stworzeń. Dlatego nazywamy je paliwami kopalnymi: są zrobione z istot, które żyły dawno temu, i pełne węgla z powietrza ich czasów.',
        ],
        sci: [
          'Karbon trwał od około 359 do 299 milionów lat temu; jego nazwa znaczy „niosący węgiel”. Duża część węgla Europy i wschodniej Ameryki Północnej pochodzi z jego późniejszej części, mniej więcej sprzed 320 do 300 milionów lat: z tropikalnych torfowisk z widłakami takimi jak Lepidodendron i Sigillaria, paprociami drzewiastymi (Psaronius) i olbrzymimi skrzypami (Calamites). Podobna do ważki Meganeura miała rozpiętość skrzydeł około 65 cm.',
          'Uwęglenie prowadzi od torfu przez węgiel brunatny, subbitumiczny i bitumiczny do antracytu: przy pogrzebaniu materiał traci wodę, tlen i wodór i jest kilkakrotnie zagęszczany, więc pokład węgla odpowiada znacznie grubszej warstwie torfu. Ropa i gaz pochodzą głównie z morskiego planktonu i glonów pogrzebanych w ubogim w tlen mule; ogrzany do około 60 do 120 °C kerogen daje ropę, a jeszcze cieplejszy gaz. Dlaczego w karbonie pogrzebane zostało tyle węgla, wciąż jest przedmiotem sporu: liczyły się wilgotny tropikalny klimat i obniżające się baseny, a pomysł, że grzyby rozkładające drewno jeszcze nie istniały, jest dziś podawany w wątpliwość.',
        ],
      },
    },
    curve: {
      label: 'Krzywa Keelinga',
      title: 'Mierzenie powietrza od 1958 roku',
      chart: {
        title: 'CO2 w powietrzu na Mauna Loa',
        unit: 'części na milion (ppm)',
        before: 'Przed fabrykami: około 280 ppm, z powietrza w starym lodzie',
        year: 'Jeden rok z bliska',
        months: ['S', 'L', 'M', 'K', 'M', 'C', 'L', 'S', 'W', 'P', 'L', 'G'],
        summer: 'Liście rosną: rośliny pobierają CO2',
        winter: 'Liście opadają: CO2 wraca',
        source: 'Średnie miesięczne: Scripps i NOAA',
        analyser: 'Analizator',
        ice: 'Rdzeń lodowy',
      },
      slider: 'Rok',
      hints: {
        analyser: 'Dotknij analizatora, żeby zmierzyć',
        wait: 'Patrz, jak rośnie krzywa',
        tree: 'Dotknij małego drzewka',
        ice: 'Dotknij rdzenia lodowego',
        slide: 'Przejdź przez lata suwakiem (E)',
      },
      buttons: { measure: 'Zmierz do dziś', tree: 'Jeden rok z bliska', ice: 'Powietrze ze starego lodu', start: 'Z powrotem do 1958' },
      says: {
        measure: {
          kid: 'Fiuu! Powietrze ze szczytu wieży spływa rurką do analizatora, który mierzy jego dwutlenek węgla. Patrz, jak linia rośnie, miesiąc po miesiącu.',
          sci: 'Powietrze z wlotów na wieży płynie do analizatora. Pierwszym przyrządem Keelinga był niedyspersyjny analizator podczerwieni: mierzył CO₂ tym, ile światła podczerwonego pochłaniało powietrze, sprawdzany gazami wzorcowymi, które Keeling mierzył manometrem.',
        },
        today: {
          kid: 'Od około 315 w 1958 roku do ponad 420 teraz: linia idzie w górę co roku. W 2025 roku było średnio 427.',
          sci: 'Od 315,7 ppm w marcu 1958 roku do 427,35 ppm średnio w 2025 roku (NOAA); szczyt w maju 2026 roku wyniósł około 432 ppm (Scripps 432,0; NOAA 432,3). Wzrost przyspieszył: poniżej 1 ppm rocznie około 1960 roku, średnio około 2,5 ppm rocznie od 2010 roku.',
        },
        tree: {
          kid: 'Popatrz na jeden rok. Wiosną i latem lasy północy wypuszczają liście i pobierają dwutlenek węgla, więc linia spada. Jesienią i zimą liście opadają i gniją, a on wraca.',
          sci: 'Cykl pór roku, około 6 ppm między szczytem a dołkiem na Mauna Loa: fotosynteza na półkuli północnej obniża CO₂ od maja do końca września; oddychanie i rozkład przeważają nad nią od października do maja.',
        },
        ice: {
          kid: 'Ten lód jest z Antarktydy. Kiedy śnieg się gromadził, zamykał w sobie maleńkie pęcherzyki powietrza, więc lód przechowuje dawne powietrze. Przed fabrykami i silnikami powietrze miało około 280 części na milion: niebieska linia.',
          sci: 'Pęcherzyki powietrza w lodzie Antarktydy, na przykład z Law Dome, dają około 280 ppm przed erą przemysłową. W ciągu ostatnich 800 000 lat rdzeń EPICA Dome C pokazuje CO₂ od około 180 ppm w epokach lodowych do około 300 ppm w okresach ciepłych: dzisiejszy poziom jest wyższy niż gdziekolwiek w tym zapisie.',
        },
        start: { kid: 'Z powrotem w 1958 roku, kiedy zaczęły się pomiary.', sci: 'Powrót do marca 1958 roku.' },
      },
      panel: {
        kid: [
          'Każdy kawałek linii to pomiar. Charles David Keeling zaczął w marcu 1958 roku, wysoko na tym wulkanie, i od tamtej pory pomiary trwają. „ppm” znaczy części na milion: 420 ppm oznacza, że na każdy milion drobinek powietrza 420 to dwutlenek węgla. To bardzo mało, ale bardzo ważne dla zatrzymywania ciepła.',
          'Linia co roku chodzi w górę i w dół, bo lasy północy pobierają dwutlenek węgla latem i oddają go zimą. Ale każdy rok kończy się wyżej niż poprzedni, bo spalanie węgla, ropy i gazu dodaje więcej dwutlenku węgla, niż rośliny i oceany mogą zabrać. Przed fabrykami było około 280 części na milion; teraz jest ponad 420.',
        ],
        sci: [
          'CO₂ podaje się jako ułamek molowy w suchym powietrzu, w µmol/mol (ppm). Pomiary Keelinga na Mauna Loa, prowadzone przez Scripps od 1958 roku, a równolegle przez NOAA od 1974 roku, to najdłuższy ciągły zapis: 315,7 ppm w marcu 1958 roku, 427,35 ppm jako średnia roczna z 2025 roku (NOAA). Cykl pór roku, około 6 ppm, pochodzi od roślin lądowych półkuli północnej; wzrost pochodzi z paliw kopalnych, około 37 miliardów ton CO₂ w 2024 roku (Global Carbon Budget), oraz ze zmian użytkowania gruntów.',
          'Mniej więcej połowa CO₂ wyemitowanego w każdym roku zostaje w powietrzu; ocean i rośliny lądowe pochłaniają resztę. Samo powietrze pokazuje, skąd on pochodzi: udział ¹³C spada, bo węgiel kopalny, wytworzony przez rośliny, ma go mniej; ¹⁴C został rozcieńczony, bo węgiel kopalny jest za stary, żeby jakikolwiek zawierać (efekt Suessa); a tlenu w powietrzu powoli ubywa, gdy paliwo się spala, co pokazują pomiary Ralpha Keelinga.',
        ],
      },
    },
    blanket: {
      label: 'Koc',
      title: 'Jak CO₂ zatrzymuje ciepło',
      sign: { space: 'W kosmos', ir: 'Światło cieplne (podczerwień)', sun: 'Światło słońca', warm: 'Cieplej', n2: 'azot', o2: 'tlen', co2: 'dwutlenek węgla' },
      slider: 'Cząsteczki CO₂ w modelu',
      hints: {
        chimney: 'Dotknij komina, żeby spalić węgiel',
        co2: 'Dotknij cząsteczki CO₂',
        air: 'Dotknij niebieskiej albo czerwonej pary',
        help: 'Dotknij turbiny wiatrowej, paneli słonecznych albo drzew',
        slide: 'Spróbuj więcej albo mniej CO₂ (E)',
      },
      buttons: { burn: 'Spal węgiel', clean: 'Wiatr i słońce', tree: 'Posadź drzewo', catch: 'Złap ciepło' },
      says: {
        burn: {
          kid: 'Puf! Spalanie łączy węgiel z tlenem z powietrza: kolejna cząsteczka CO₂ unosi się w niebo.',
          sci: 'C + O₂ → CO₂: z każdych 12 g spalonego węgla powstaje 44 g dwutlenku węgla. W modelu każda cząsteczka oznacza około 35 ppm.',
        },
        full: {
          kid: 'To bardzo dużo CO₂ jak na to małe niebo. Spróbuj turbiny wiatrowej, paneli słonecznych albo drzew!',
          sci: 'Model mieści najwyżej 20, około 700 ppm.',
        },
        catch: {
          kid: 'Złapane! Cząsteczka CO₂ łapie światło cieplne, chwieje się i wysyła je dalej w dowolną stronę. Część wraca w dół i ogrzewa ziemię.',
          sci: 'Pochłanianie w okolicy 15 µm wzbudza drganie zginające; energia wychodzi znowu w losowym kierunku, więc część uciekającej podczerwieni wraca do powierzchni.',
        },
        none: { kid: 'Teraz w tym niebie nie ma CO₂. Dotknij komina, żeby trochę dodać.', sci: 'W modelu nie ma CO₂: najpierw trochę dodaj.' },
        n2: {
          kid: 'Azot: dwa takie same atomy. Światło cieplne przechodzi przez niego na wprost; nie umie go złapać.',
          sci: 'N₂, dwa identyczne atomy: jego jedyne drganie, rozciąganie, zostawia go symetrycznym, bez zmiennego dipola, więc nie pochłania podczerwieni cieplnej.',
        },
        o2: {
          kid: 'Tlen: dwa takie same atomy, jak azot. Światło cieplne też przechodzi na wprost.',
          sci: 'O₂, tak jak N₂, nie zyskuje dipola, gdy drga: jest przezroczysty dla podczerwieni Ziemi. Razem stanowią 99 % suchego powietrza.',
        },
        clean: {
          kid: 'Turbina wiatrowa się kręci, a panele słoneczne świecą: prąd bez spalania czegokolwiek. Komin przestaje dymić i więcej CO₂ już nie leci.',
          sci: 'Energia wiatrowa i słoneczna dają prąd bez spalania. W 2024 roku wytworzyły razem około 15 % prądu na świecie, więcej niż kiedykolwiek (Ember).',
        },
        already: { kid: 'Wiatr i słońce już robią prąd.', sci: 'Już działa na wietrze i słońcu.' },
        again: { kid: 'Z powrotem do spalania węgla: komin znowu dymi.', sci: 'Spalanie rusza na nowo.' },
        tree: {
          kid: 'Nowe drzewo rośnie i pobiera jedną cząsteczkę CO₂, zatrzymując jej węgiel w drewnie. Drzewa pomagają, powoli; najbardziej pomaga mniej spalać.',
          sci: 'Fotosynteza wiąże CO₂ w drewnie. Rośliny lądowe i gleby pochłaniają mniej więcej od jednej czwartej do jednej trzeciej CO₂ emitowanego w każdym roku, dopóki lasy rosną i nie są wycinane ani palone.',
        },
        bare: { kid: 'W tym niebie nie zostało już CO₂ dla drzew.', sci: 'W modelu nie zostało CO₂.' },
        forest: { kid: 'Cały mały las! Jego drzewa trzymają swój węgiel, dopóki stoją.', sci: 'Las w modelu jest pełny: najwyżej cztery drzewa.' },
      },
      panel: {
        kid: [
          'Światło słońca przechodzi przez powietrze i ogrzewa ziemię. Ciepła ziemia świeci wtedy światłem cieplnym, zwanym podczerwienią, którego nasze oczy nie widzą. Azot i tlen, prawie całe powietrze, przepuszczają je na wprost. Dwutlenek węgla łapie jego część i wysyła ją dalej we wszystkie strony, część z powrotem w dół, więc ziemi jest cieplej, tak jak tobie pod kocem. W prawdziwym powietrzu tylko około 4 na dziesięć tysięcy drobinek to dwutlenek węgla; tutaj jest ich dużo więcej, żeby było je widać.',
          'Trochę tego to dobra rzecz: bez żadnego koca Ziemia byłaby zamarznięta, średnio około −18 °C zamiast około 15 °C. Więcej dwutlenku węgla robi koc grubszym, a Ziemia się ogrzewa. A ludzie coś z tym robią: turbin wiatrowych, paneli słonecznych i nowych lasów przybywa na całym świecie, a my uczymy się wytwarzać prąd, ogrzewać domy i podróżować bez spalania tak dużo.',
        ],
        sci: [
          'Powierzchnia o temperaturze około 15 °C promieniuje w podczerwieni cieplnej, najsilniej w pobliżu 10 µm. Cząsteczka pochłania podczerwień tylko wtedy, gdy jej drganie zmienia jej moment dipolowy. N₂ i O₂, dwa identyczne atomy, zostają symetryczne, jakkolwiek się rozciągają, więc ją przepuszczają. CO₂ ma trzy atomy i może się zginać: węgiel przesuwa się w jedną stronę, tleny w drugą, i ładunek się przesuwa. Zginanie pochłania przy 667 cm⁻¹, około 15 µm, blisko maksimum promieniowania Ziemi; asymetryczne drganie rozciągające pochłania przy 4,3 µm. Para wodna i metan pochłaniają z tego samego powodu.',
          'W gęstym dolnym powietrzu wzbudzona cząsteczka CO₂ zwykle oddaje energię sąsiadkom w zderzeniach, zanim zdąży ją wypromieniować; ogrzane powietrze promieniuje wtedy we wszystkich kierunkach, częściowo w dół. Przy większej ilości CO₂ Ziemia wysyła ciepło w kosmos z wyższego, zimniejszego powietrza, więc ogrzewa się, aż równowaga wróci: dotąd o około 1,1 °C (lata 2011 do 2020 wobec 1850 do 1900, IPCC 2021) i o około 3 °C na każde podwojenie CO₂ w długim okresie (prawdopodobnie 2,5 do 4 °C). W modelu każda cząsteczka CO₂ oznacza około 35 ppm; prawdziwe powietrze ma około jednej cząsteczki CO₂ na 2300. Od porozumienia paryskiego z 2015 roku prawie każdy kraj wyznaczył cele ograniczenia emisji, a energia wiatrowa i słoneczna rośnie szybciej niż jakiekolwiek inne źródło prądu (Ember, 2025).',
        ],
      },
    },
  },
  de: {
    title: 'Über den Wolken auf dem Mauna Loa',
    greet: {
      kid: 'Wir sind im Bild: hoch oben auf dem Mauna Loa, einem Vulkan auf Hawaii, über den Wolken. Seit 1958 wird hier jeden Tag das Kohlenstoffdioxid in der Luft gemessen. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Das Mauna-Loa-Observatorium, 3397 m hoch auf der Insel Hawaii, über den Passatwolken: Hier läuft die längste ununterbrochene Messreihe des atmosphärischen CO₂, begonnen von Charles David Keeling im März 1958. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Kohlenstoffdioxid, das bin ich mit zwei Sauerstoffatomen an der Hand. Pflanzen nehmen mich auf, du atmest mich aus, und ein bisschen von mir in der Luft hält die Erde warm genug zum Leben.',
        'Die Luft hier oben ist über Tausende Kilometer Ozean geweht, weit weg von Städten und Wäldern. Sie ist sauber und gut durchmischt, ganz ähnlich wie die Luft auf der ganzen Welt.',
        'Charles David Keeling hat hier 1958 mit dem Messen angefangen, da war er 29. Er hat sein ganzes Leben lang weitergemacht, und heute führt sein Sohn Ralph die Messungen fort.',
      ],
      sci: [
        '1955 und 1956 maß Keeling CO₂ in Kaliforniens Wäldern und Bergen und fand, dass gut durchmischte Nachmittagsluft überall fast gleich viel enthielt. Darum konnte eine einzige abgelegene Station die ganze Atmosphäre verfolgen.',
        'Im November 2022 zerschnitt Lava des Mauna Loa selbst die Straße und die Stromleitung des Observatoriums. Ab Dezember 2022 kamen die Messungen vom Maunakea, etwa 34 km nördlich, bis sie im Juli 2023 hier wieder aufgenommen wurden.',
        'Die Luft wird über Einlässe hoch oben an einem Turm angesaugt. Stunden, in denen der Wind Gase aus den Spalten des Vulkans oder Luft aus den Wäldern der Insel heranträgt, werden aussortiert, damit die Messreihe die Hintergrundluft zeigt.',
      ],
    },
    forest: {
      label: 'Das Fenster in die Zeit',
      title: 'Der Kohlewald',
      sign: {
        ago: 'Vor {n} Millionen Jahren',
        today: 'Heute',
        peat: 'Torf',
        brown: 'Braunkohle',
        coal: 'Steinkohle',
        rock: 'Sand und Schlamm, jetzt Gestein',
        sea: 'Meeresschlamm',
        shale: 'Schwarzschiefer',
        oil: 'Erdöl',
        gas: 'Erdgas',
      },
      slider: 'Zeit',
      hints: {
        tree: 'Tippe auf einen Riesenbärlapp',
        sea: 'Tippe auf das Meer',
        dial: 'Tippe auf das Zeitrad, um die Zeit voranzutreiben',
        coal: 'Tippe auf das Kohleflöz',
        oil: 'Tippe auf das Erdöl',
        back: 'Tippe auf das Zeitrad, um zurückzugehen',
      },
      buttons: { tree: 'Baum fällen', sea: 'Planktonregen', coal: 'Kohle herausholen', oil: 'Erdöl herausholen', back: 'Zurück zum Wald' },
      says: {
        tree: {
          kid: 'Krach! Der Riesenbärlapp fällt in den Sumpf. Das Wasser hat kaum Sauerstoff, darum verrottet das Holz nicht: Es häuft sich als Torf an.',
          sci: 'Ein Lepidodendron stürzt in den Sumpf. In stehendem, sauerstoffarmem Wasser bauen Pilze und Bakterien Holz nur sehr langsam ab, darum sammelt es sich als Torf.',
        },
        trees: {
          kid: 'Alle drei Riesen liegen. Jetzt treib die Zeit voran und schau, was aus dem Sumpf wird: Tippe auf das Zeitrad.',
          sci: 'Torf sammelt sich über Jahrtausende. Jetzt soll die Überdeckung ihre Arbeit tun: das Zeitrad.',
        },
        fallen: { kid: 'Der liegt schon. Probier einen anderen Riesen!', sci: 'Schon gefallen: Wähle einen stehenden Baum.' },
        sea: {
          kid: 'Im warmen Meer neben dem Sumpf schweben Milliarden winziger Lebewesen. Wenn sie sterben, sinken sie wie Schnee in den Schlamm am Grund.',
          sci: 'Plankton, vor allem mikroskopische Algen, rieselt auf den Meeresboden. Wo das Bodenwasser wenig Sauerstoff hat, werden seine Reste im Schlamm begraben, statt gefressen oder zersetzt zu werden.',
        },
        brown: {
          kid: 'Sand und Schlamm türmen sich darüber. Der Torf wird zusammengepresst und erwärmt: Er wird zu Braunkohle.',
          sci: 'Überdeckung: Der Torf verliert Wasser und wird zu Braunkohle (Lignit) verdichtet, schon reicher an Kohlenstoff.',
        },
        coal: {
          kid: 'Millionen Jahre Pressen und Wärmen: Aus dem Torf ist schwarze, glänzende Steinkohle geworden. Ihr Kohlenstoff war die ganze Zeit weggesperrt, fern von der Luft.',
          sci: 'Tiefere Versenkung und höhere Temperaturen treiben Wasser, Sauerstoff und Wasserstoff aus: Aus Braunkohle wird Steinkohle und mit mehr Hitze Anthrazit, mit über 90 % Kohlenstoff (wasser- und aschefrei).',
        },
        oil: {
          kid: 'Der Meeresschlamm ist zu schwarzem Gestein geworden, und tief unten hat die Wärme die winzigen Meerestiere zu Erdöl und Erdgas gekocht. Sie kriechen nach oben in den Sand.',
          sci: 'Im Muttergestein zerlegt die Hitze das Kerogen: Erdöl entsteht bei etwa 60 bis 120 °C, Erdgas bei höheren Temperaturen. Beide wandern durch porösen Sandstein nach oben, bis ein dichtes Deckgestein sie festhält.',
        },
        today: {
          kid: 'Heute! Der Wald liegt tief unter der Erde als Kohleflöz. Tippe darauf.',
          sci: 'Die Gegenwart: Der Sumpf aus dem Karbon ist ein Kohleflöz unter Hunderten Metern Gestein. Tippe auf das Flöz.',
        },
        lift: {
          kid: 'Da ist er: ein Brocken Steinkohle, etwa 300 Millionen Jahre alt. Fast alles daran ist Kohlenstoff, den Pflanzen einst aus der Luft geholt haben.',
          sci: 'Ein Brocken Steinkohle aus dem Karbon: Kohlenstoff, vor etwa 300 Millionen Jahren durch Fotosynthese gebunden und seitdem der Atmosphäre entzogen. Verbrennen gibt ihn in Sekunden als CO₂ zurück.',
        },
        oilOut: {
          kid: 'Und eine Flasche Erdöl. Erdöl und Erdgas sind auch vergrabener Sonnenschein: Winzige Meerestiere haben ihn vor langer Zeit eingefangen.',
          sci: 'Rohöl und das Gas darüber: Kohlenstoff aus urzeitlichem Plankton. Verbrannt geben sie ihn als CO₂ zurück, wie die Kohle.',
        },
        notYet: { kid: 'Noch keine Kohle: Der Torf braucht Millionen Jahre. Tippe auf das Zeitrad und treib die Zeit voran.', sci: 'Inkohlung braucht tiefe Versenkung und Millionen Jahre: Treib die Zeit voran.' },
        noOil: { kid: 'Noch kein Erdöl: Der Meeresschlamm muss tiefer liegen und länger warm werden.', sci: 'Das Muttergestein hat das Ölfenster noch nicht erreicht.' },
        buried: { kid: 'Der Wald ist jetzt begraben. Tippe auf das Zeitrad und geh in der Zeit zurück, um ihn wiederzusehen.', sci: 'Begraben: Dreh die Zeit zurück, um den lebenden Sumpf zu sehen.' },
        back: { kid: '300 Millionen Jahre zurück: Der Sumpfwald lebt wieder.', sci: 'Zurück im Sumpf des späten Karbons.' },
      },
      panel: {
        kid: [
          'Vor etwa 300 Millionen Jahren, in einer Zeit namens Karbon, war ein großer Teil des Landes warmer Sumpf. Riesenbärlappe wuchsen 30 Meter hoch und mehr, neben Baumfarnen und Schachtelhalmen so groß wie Bäume, und libellenartige Insekten flogen mit Flügeln so breit wie die einer Taube.',
          'Wenn die Riesen umfielen, ließ das Sumpfwasser sie nicht verrotten. Sie häuften sich als Torf an, wurden unter Sand und Schlamm begraben und über Millionen Jahre zu Kohle gepresst und erwärmt. Erdöl und Erdgas sind auf die gleiche langsame Weise entstanden, vor allem aus winzigen Meerestieren. Darum heißen sie fossile Brennstoffe: Sie bestehen aus Lebewesen, die vor langer Zeit lebten, voller Kohlenstoff aus der Luft ihrer Zeit.',
        ],
        sci: [
          'Das Karbon dauerte von etwa 359 bis 299 Millionen Jahren vor heute; sein Name bedeutet „kohleführend“. Ein großer Teil der Kohle Europas und des östlichen Nordamerikas stammt aus seinem späteren Abschnitt, vor etwa 320 bis 300 Millionen Jahren: aus tropischen Torfsümpfen mit Bärlapppflanzen wie Lepidodendron und Sigillaria, Baumfarnen (Psaronius) und Riesenschachtelhalmen (Calamites). Die libellenähnliche Meganeura hatte eine Spannweite von etwa 65 cm.',
          'Die Inkohlung führt von Torf über Braunkohle (Weich- und Hartbraunkohle) und Steinkohle zu Anthrazit: Bei der Versenkung verliert das Material Wasser, Sauerstoff und Wasserstoff und wird um ein Mehrfaches verdichtet, darum steht ein Kohleflöz für eine viel dickere Torfschicht. Erdöl und Erdgas stammen vor allem aus Meeresplankton und Algen, die in sauerstoffarmem Schlamm begraben wurden; auf etwa 60 bis 120 °C erhitzt, liefert das Kerogen Erdöl, noch heißer Erdgas. Warum im Karbon so viel Kohlenstoff begraben wurde, ist noch umstritten: Feuchttropisches Klima und absinkende Becken spielten mit, und die Idee, dass holzzersetzende Pilze damals noch fehlten, gilt heute als zweifelhaft.',
        ],
      },
    },
    curve: {
      label: 'Die Keeling-Kurve',
      title: 'Die Luft messen seit 1958',
      chart: {
        title: 'CO2 in der Luft am Mauna Loa',
        unit: 'Teile pro Million (ppm)',
        before: 'Vor den Fabriken: etwa 280 ppm, aus Luft im alten Eis',
        year: 'Ein Jahr aus der Nähe',
        months: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        summer: 'Blätter treiben aus: Pflanzen nehmen CO2 auf',
        winter: 'Blätter fallen: CO2 kommt zurück',
        source: 'Monatsmittel: Scripps und NOAA',
        analyser: 'Analysator',
        ice: 'Eisbohrkern',
      },
      slider: 'Jahr',
      hints: {
        analyser: 'Tippe auf den Analysator, um zu messen',
        wait: 'Schau, wie die Kurve wächst',
        tree: 'Tippe auf das Bäumchen',
        ice: 'Tippe auf den Eisbohrkern',
        slide: 'Fahr mit dem Regler durch die Jahre (E)',
      },
      buttons: { measure: 'Bis heute messen', tree: 'Ein Jahr aus der Nähe', ice: 'Luft aus altem Eis', start: 'Zurück nach 1958' },
      says: {
        measure: {
          kid: 'Wusch! Luft von der Turmspitze strömt durch das Rohr in den Analysator, der ihr Kohlenstoffdioxid misst. Schau, wie die Linie wächst, Monat für Monat.',
          sci: 'Luft aus den Einlässen am Turm strömt zum Analysator. Keelings erstes Gerät war ein nichtdispersiver Infrarot-Analysator: Er maß CO₂ daran, wie viel Infrarotlicht die Luft absorbierte, geprüft mit Referenzgasen, die Keeling mit einem Manometer bestimmte.',
        },
        today: {
          kid: 'Von etwa 315 im Jahr 1958 auf mehr als 420 heute: Die Linie steigt jedes Jahr. 2025 waren es im Mittel 427.',
          sci: 'Von 315,7 ppm im März 1958 auf 427,35 ppm im Jahresmittel 2025 (NOAA); der Höchststand im Mai 2026 lag bei etwa 432 ppm (Scripps 432,0; NOAA 432,3). Der Anstieg hat sich beschleunigt: unter 1 ppm pro Jahr um 1960, seit 2010 im Mittel etwa 2,5 ppm pro Jahr.',
        },
        tree: {
          kid: 'Schau dir ein Jahr an. Im Frühling und Sommer treiben die Wälder im Norden Blätter aus und nehmen Kohlenstoffdioxid auf, darum sinkt die Linie. Im Herbst und Winter fallen die Blätter und verrotten, und es kommt zurück.',
          sci: 'Der Jahresgang, etwa 6 ppm zwischen Höchst- und Tiefstwert am Mauna Loa: Die Fotosynthese der Nordhalbkugel senkt das CO₂ von Mai bis Ende September; Atmung und Zersetzung überwiegen von Oktober bis Mai.',
        },
        ice: {
          kid: 'Dieses Eis kommt aus der Antarktis. Als sich der Schnee auftürmte, schloss er winzige Luftbläschen ein, darum bewahrt das Eis alte Luft. Vor Fabriken und Motoren hatte die Luft etwa 280 Teile pro Million: die blaue Linie.',
          sci: 'Luftbläschen im antarktischen Eis, etwa von Law Dome, ergeben rund 280 ppm vor dem Industriezeitalter. In den letzten 800.000 Jahren zeigt der Bohrkern EPICA Dome C CO₂ zwischen etwa 180 ppm in Eiszeiten und etwa 300 ppm in Warmzeiten: Der heutige Wert liegt höher als irgendwo in dieser Reihe.',
        },
        start: { kid: 'Zurück im Jahr 1958, als das Messen begann.', sci: 'Zurückgesetzt auf März 1958.' },
      },
      panel: {
        kid: [
          'Jedes Stück der Linie ist eine Messung. Charles David Keeling fing im März 1958 hoch oben auf diesem Vulkan an, und seitdem wird immer weiter gemessen. „ppm“ heißt Teile pro Million: 420 ppm bedeutet, dass von jeder Million Luftteilchen 420 Kohlenstoffdioxid sind. Das ist sehr wenig, aber es ist sehr wichtig dafür, wie viel Wärme festgehalten wird.',
          'Die Linie geht jedes Jahr auf und ab, weil die Wälder im Norden im Sommer Kohlenstoffdioxid aufnehmen und im Winter wieder abgeben. Aber jedes Jahr endet höher als das vorige, weil das Verbrennen von Kohle, Erdöl und Erdgas mehr Kohlenstoffdioxid dazugibt, als Pflanzen und Ozeane zurücknehmen können. Vor den Fabriken waren es etwa 280 Teile pro Million; jetzt sind es mehr als 420.',
        ],
        sci: [
          'CO₂ wird als Stoffmengenanteil in trockener Luft angegeben, in µmol/mol (ppm). Keelings Messreihe am Mauna Loa, seit 1958 von Scripps und seit 1974 parallel von der NOAA geführt, ist die längste ununterbrochene: 315,7 ppm im März 1958, 427,35 ppm im Jahresmittel 2025 (NOAA). Der Jahresgang von etwa 6 ppm kommt von den Landpflanzen der Nordhalbkugel; der Anstieg kommt aus fossilen Brennstoffen, etwa 37 Milliarden Tonnen CO₂ im Jahr 2024 (Global Carbon Budget), und aus Landnutzungsänderungen.',
          'Etwa die Hälfte des jedes Jahr ausgestoßenen CO₂ bleibt in der Luft; Ozean und Landpflanzen nehmen den Rest auf. Die Luft selbst zeigt, woher es stammt: Ihr Anteil an ¹³C sinkt, weil fossiler Kohlenstoff, von Pflanzen gebildet, weniger davon enthält; ihr ¹⁴C wurde verdünnt, weil fossiler Kohlenstoff zu alt ist, um noch welches zu enthalten (der Suess-Effekt); und ihr Sauerstoff nimmt langsam ab, während der Brennstoff verbrennt, wie Ralph Keelings Messungen zeigen.',
        ],
      },
    },
    blanket: {
      label: 'Die Decke',
      title: 'Wie CO₂ Wärme festhält',
      sign: { space: 'Ins Weltall', ir: 'Wärmelicht (Infrarot)', sun: 'Sonnenlicht', warm: 'Wärmer', n2: 'Stickstoff', o2: 'Sauerstoff', co2: 'Kohlenstoffdioxid' },
      slider: 'CO₂-Moleküle im Modell',
      hints: {
        chimney: 'Tippe auf den Schornstein, um Kohle zu verbrennen',
        co2: 'Tippe auf ein CO₂-Molekül',
        air: 'Tippe auf ein blaues oder rotes Paar',
        help: 'Tippe auf das Windrad, die Solarmodule oder die Bäume',
        slide: 'Probier mehr oder weniger CO₂ (E)',
      },
      buttons: { burn: 'Kohle verbrennen', clean: 'Wind und Sonne', tree: 'Baum pflanzen', catch: 'Wärme einfangen' },
      says: {
        burn: {
          kid: 'Puff! Beim Verbrennen verbindet sich der Kohlenstoff der Kohle mit Sauerstoff aus der Luft: Noch ein CO₂-Molekül steigt in den Himmel.',
          sci: 'C + O₂ → CO₂: Aus je 12 g verbranntem Kohlenstoff werden 44 g Kohlenstoffdioxid. Im Modell steht jedes Molekül für etwa 35 ppm.',
        },
        full: {
          kid: 'Das ist viel CO₂ für diesen kleinen Himmel. Probier das Windrad, die Solarmodule oder die Bäume!',
          sci: 'Das Modell fasst höchstens 20, etwa 700 ppm.',
        },
        catch: {
          kid: 'Gefangen! Das CO₂-Molekül fängt Wärmelicht ein, wackelt und schickt es in irgendeine Richtung weiter. Ein Teil geht zurück nach unten und wärmt den Boden.',
          sci: 'Die Absorption um 15 µm regt die Biegeschwingung an; die Energie geht in zufälliger Richtung wieder hinaus, sodass ein Teil des aufsteigenden Infrarots zur Oberfläche zurückkehrt.',
        },
        none: { kid: 'Jetzt ist kein CO₂ in diesem Himmel. Tippe auf den Schornstein, um welches dazuzugeben.', sci: 'Kein CO₂ im Modell: Gib zuerst welches dazu.' },
        n2: {
          kid: 'Stickstoff: zwei gleiche Atome. Wärmelicht geht glatt durch ihn hindurch; er kann es nicht fangen.',
          sci: 'N₂, zwei gleiche Atome: Seine einzige Schwingung, eine Streckung, lässt es symmetrisch, ohne sich änderndes Dipolmoment, darum absorbiert es keine Wärmestrahlung.',
        },
        o2: {
          kid: 'Sauerstoff: zwei gleiche Atome, wie beim Stickstoff. Wärmelicht geht auch glatt hindurch.',
          sci: 'O₂ bekommt wie N₂ beim Schwingen kein Dipolmoment: durchsichtig für das Infrarot der Erde. Zusammen machen sie 99 % der trockenen Luft aus.',
        },
        clean: {
          kid: 'Das Windrad dreht sich und die Solarmodule glänzen: Strom, ohne etwas zu verbrennen. Der Schornstein hört auf, und kein CO₂ steigt mehr auf.',
          sci: 'Wind- und Solarkraft erzeugen Strom ohne Verbrennung. 2024 lieferten sie zusammen etwa 15 % des Stroms der Welt, mehr als je zuvor (Ember).',
        },
        already: { kid: 'Wind und Sonne machen den Strom schon.', sci: 'Läuft schon mit Wind und Sonne.' },
        again: { kid: 'Zurück zum Kohleverbrennen: Der Schornstein raucht wieder.', sci: 'Die Verbrennung läuft wieder.' },
        tree: {
          kid: 'Ein neuer Baum wächst und nimmt ein CO₂-Molekül auf; seinen Kohlenstoff behält er im Holz. Bäume helfen, langsam; weniger verbrennen hilft am meisten.',
          sci: 'Fotosynthese bindet CO₂ im Holz. Landpflanzen und Böden nehmen grob ein Viertel bis ein Drittel des jedes Jahr ausgestoßenen CO₂ auf, solange Wälder wachsen und nicht abgeholzt oder verbrannt werden.',
        },
        bare: { kid: 'In diesem Himmel ist kein CO₂ mehr übrig, das die Bäume aufnehmen könnten.', sci: 'Kein CO₂ mehr im Modell.' },
        forest: { kid: 'Ein ganzer kleiner Wald! Seine Bäume behalten ihren Kohlenstoff, solange sie stehen.', sci: 'Der Modellwald ist voll: höchstens vier Bäume.' },
      },
      panel: {
        kid: [
          'Sonnenlicht geht durch die Luft und wärmt den Boden. Der warme Boden leuchtet dann mit Wärmelicht, Infrarot genannt, das unsere Augen nicht sehen. Stickstoff und Sauerstoff, fast die ganze Luft, lassen es glatt durch. Kohlenstoffdioxid fängt einen Teil davon ein und schickt ihn in alle Richtungen weiter, einen Teil zurück nach unten, darum bleibt der Boden wärmer, so wie du unter einer Decke. In echter Luft sind nur etwa 4 von zehntausend Teilchen Kohlenstoffdioxid; hier sind es viel mehr, damit man sie sehen kann.',
          'Ein bisschen davon ist gut: Ganz ohne Decke wäre die Erde gefroren, im Mittel etwa −18 °C statt etwa 15 °C. Mehr Kohlenstoffdioxid macht die Decke dicker, und die Erde wird wärmer. Und die Menschen tun etwas dagegen: Windräder, Solarmodule und neue Wälder entstehen auf der ganzen Welt, und wir lernen, Strom zu machen, Häuser zu heizen und zu reisen, ohne so viel zu verbrennen.',
        ],
        sci: [
          'Die Oberfläche strahlt bei etwa 15 °C im thermischen Infrarot, am stärksten um 10 µm. Ein Molekül absorbiert Infrarot nur, wenn seine Schwingung sein Dipolmoment ändert. N₂ und O₂, zwei gleiche Atome, bleiben symmetrisch, wie sie sich auch strecken, darum lassen sie es durch. CO₂ hat drei Atome und kann sich biegen: Der Kohlenstoff bewegt sich in die eine Richtung, die Sauerstoffatome in die andere, und die Ladung verschiebt sich. Die Biegung absorbiert bei 667 cm⁻¹, etwa 15 µm, nahe dem Maximum der Abstrahlung der Erde; die asymmetrische Streckschwingung absorbiert bei 4,3 µm. Wasserdampf und Methan absorbieren aus demselben Grund.',
          'In der dichten unteren Luft gibt ein angeregtes CO₂-Molekül seine Energie meist durch Stöße an die Nachbarn ab, bevor es sie wieder ausstrahlen kann; die erwärmte Luft strahlt dann in alle Richtungen, teils nach unten. Mit mehr CO₂ gibt die Erde ihre Wärme aus höherer, kälterer Luft ins All ab, darum erwärmt sie sich, bis das Gleichgewicht wiederhergestellt ist: bisher um etwa 1,1 °C (2011 bis 2020 gegenüber 1850 bis 1900, IPCC 2021) und langfristig um etwa 3 °C je Verdopplung des CO₂ (wahrscheinlich 2,5 bis 4 °C). Im Modell steht jedes CO₂ für etwa 35 ppm; echte Luft enthält etwa ein CO₂ unter 2300 Molekülen. Seit dem Pariser Abkommen von 2015 haben sich fast alle Länder Ziele zur Senkung der Emissionen gesetzt, und Wind- und Solarstrom wachsen schneller als jede andere Stromquelle (Ember, 2025).',
        ],
      },
    },
  },
}
