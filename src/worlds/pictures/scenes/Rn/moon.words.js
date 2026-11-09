// The words of radon's moon room ("Does the Moon breathe out a gas?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Rn.js
// (the easel shows it); the room lets you work the gas, the counter and the map and adds to it.
// Facts and where they come from (checked 2026-11-09):
// - Apollo 15's alpha-particle spectrometer, in the service module's Scientific Instrument Module (SIM) bay, on
//   from 29 July to 7 August 1971 (Apollo 16 carried one in April 1972): ten silicon surface-barrier detectors,
//   each 3 cm2 with a 90 degree field of view (Gorenstein, Bjorkholm and Golub, Apollo alpha particle
//   spectrometer, PI report, 1973). It detected Rn-222 over the region of Aristarchus (Gorenstein and
//   Bjorkholm, Science 179, 792, 1973). Excess Po-210 at the edges of maria, in both missions' data: Fecunditatis,
//   Crisium, Smythii, Tranquillitatis, Nubium, Cognitum, Procellarum (Gorenstein, Golub and Bjorkholm,
//   Science 183, 411, 1974); localised sources at Aristarchus and Grimaldi (The Moon 9, 129, 1974).
// - Lunar Prospector (launched January 1998, crashed on purpose near the south pole on 31 July 1999): a drum
//   1.36 m across and 1.28 m high, three 2.5 m booms; its APS five pairs of 3 x 3 cm silicon detectors on five
//   faces of a cube (about 18 cm) at the tip of one boom, shared with the neutron spectrometer; spinning at
//   12 rpm while mapping, from a polar orbit about 100 km up, a map cycle every two weeks. A sunlight-blocking
//   foil leaked light from launch (noise; Wikipedia says one of the five faces was ruined); the solar cycle was
//   near maximum, so only quiet periods were used: 229 days of good data over 16 months. Rn-222 near
//   Aristarchus and Kepler; Po-210 in thirteen boxes of 15 by 10 degrees, most at mare edges (two at Imbrium's,
//   Serenitatis among them, a few on the eastern far side), Aristarchus the only place with both. Radon
//   released on the Moon spreads several hundred kilometres by ballistic hops before it decays; about half the
//   Po-218 recoils land on the surface; Po-210 marks releases over roughly the last 60 years (Lawson et al.,
//   J. Geophys. Res. 110, E09009, 2005; NASA's Lunar Prospector pages).
// - Aristarchus: 40 km across, 2.7 km deep, the brightest large crater on the Moon, about 450 million years
//   old, on the Aristarchus plateau, 23.7 N 47.4 W. Kepler: 8.1 N 38.0 W.
// - Half-lives (NNDC): Rn-222 3.82 d, Po-218 3.1 min, Pb-210 22.2 y, Bi-210 5.0 d, Po-210 138.4 d; alpha
//   energies Rn-222 5.49, Po-218 6.00, Po-210 5.30 MeV. After one puff, Po-210's activity peaks about 2.3 years
//   later at about 1/2300 of the radon's starting activity, half that about 22 years after, about 5% after a
//   century (Bateman equations, worked out in moon.js).
// - Hops: a radon atom at about 390 K (lunar noon) moves at about 190 m/s; under the Moon's 1.62 m/s2 a 45 degree
//   hop would be about 23 km long and last about 3 minutes (worked out, not measured: the words say "kilometres"
//   and "a few minutes"). On Earth, radon's decay products attach to aerosol particles and come down with
//   them (lead-210 in rain is a tracer of this).
// - The model of the command and service module is 1:3 (the real service module 3.9 m across).
// - Unsure, so not said: the exact paths and coverage of Apollo 15's orbit (the map shows a strip "drawn
//   simply"); the globe's amber boxes are placed by those descriptions, not copied from the published map.
// Placeholders: {n} a number, {t} a time with its unit (units: {n} in each plural form).
export const MOON_WORDS = {
  en: {
    title: 'On the Moon',
    greet: {
      kid: "We are inside the picture, on the Moon! Down there is the bright crater Aristarchus. There is no air here, so the sky stays black even in the daytime. The picture's story is on the easel.",
      sci: "The Moon's near side, on the plateau above the crater Aristarchus (23.7° N, 47.4° W), drawn far smaller than the real one, which is 40 km across and 2.7 km deep. No atmosphere: a black sky in daylight, hard shadows, no haze at any distance. The picture's story is on the easel.",
    },
    talk: {
      kid: [
        'Up here there is no wind and no rain. What I turn into stays where it falls for years, like footprints in the dust.',
        'On Earth I seep out of rocks and soil too, and sometimes into cellars. There people measure me and blow me outside: the cellar picture in the hall tells that story.',
        'See the Earth? From here it never rises or sets. It hangs in the same spot in the sky, while the Sun takes about two weeks to cross it.',
        'I come from uranium in the rocks. Uranium breaks down very slowly, step by step, and one of the steps is me.',
      ],
      sci: [
        "Rn-222 forms in rock from radium-226, in uranium-238's decay chain. Where there is more uranium, as round Aristarchus (rich in thorium too, by Lunar Prospector's gamma-ray map), more radon is made.",
        'On Earth the same gas seeps from granite and soil; indoors it is measured in becquerels per cubic metre and vented outside (the cellar picture in the hall).',
        'From the near side the Earth hangs still in the sky, apart from a small wobble (libration). A lunar day lasts about 29.5 Earth days, so the Sun takes about two weeks to cross the sky.',
        'Aristarchus is the brightest large crater on the Moon: about 450 million years old, too young for space weathering to have darkened its rock.',
      ],
    },
    vent: {
      label: 'The crack',
      title: 'Radon hops out',
      signs: { crack: 'Crack' },
      slider: 'Air over the crack',
      air: "{n} % of Earth's air",
      airNone: 'none, as on the Moon',
      hints: {
        tap: 'Tap the crack in the ground',
        air: 'Press E and give the crack some air',
        again: 'Tap the crack again',
        more: 'Tap the crack for more gas',
      },
      buttons: { puff: 'Let gas out' },
      readout: {
        title: 'Radon atoms',
        hopping: 'Hopping: {n}',
        drifting: 'Drifting: {n}',
        broken: 'Broken apart: {n}',
        dots: 'Amber dots left: {n}',
        floated: 'Dots left: none (blown away)',
        clock: { kid: '3.8 days pass in 6 seconds', sci: 'Half-life 3.82 d, here 6 s' },
      },
      says: {
        puff: {
          kid: 'Out they come! There is no air to carry them or slow them down, so each radon atom flies in a long arc, lands, and hops again.',
          sci: 'Radon leaves the crack and travels ballistically: no gas to collide with, only gravity bending each path. On the real Moon a hop is kilometres long; here the hops are shrunk.',
        },
        again: {
          kid: 'More radon! Watch one atom: it hops and hops until, all of a sudden, it breaks apart and leaves an amber dot.',
          sci: 'Each decay comes at a random moment: half the atoms are gone within one half-life, whenever the puff came out.',
        },
        puffThin: {
          kid: 'With a little air the hops get shorter and wobblier: the atoms keep bumping into air.',
          sci: 'A thin gas shortens the free flights: collisions damp the ballistic arcs into short, jittery ones.',
        },
        puffAir: {
          kid: 'With air like ours the atoms do not hop at all. The breeze carries them off and spreads them thin, and what they turn into floats away on specks of dust.',
          sci: 'In a dense atmosphere radon is carried and mixed by the wind; its decay products attach to aerosol particles and travel with them, so they leave no mark at the vent.',
        },
        airNone: { kid: 'No air again, just like the real Moon.', sci: 'Back to a vacuum.' },
        airThin: {
          kid: 'A little air in the bubble now. Tap the crack and see what it does.',
          sci: 'A thin gas fills the bubble: tap the crack to let radon into it.',
        },
        airFull: {
          kid: 'Now the bubble holds air as thick as the Earth’s. Tap the crack and compare!',
          sci: "Earth's sea-level density: an atom collides after well under a micrometre. Tap the crack and compare.",
        },
      },
      panel: {
        kid: [
          "Radon comes up through cracks in the Moon's rocks. With no air, its atoms hop across the ground in long arcs. On the real Moon a single hop can be kilometres long, so a puff of radon spreads over hundreds of kilometres before it is gone.",
          'After a few days (here a few seconds) each atom breaks apart and turns into polonium, then lead. Those stick where they land and stay for years. On Earth the wind would carry them away and the rain would wash them down; on the Moon they mark where gas came out.',
        ],
        sci: [
          "Released radon migrates ballistically over the airless surface. At lunar noon an atom leaves the ground at about 200 m/s, so one hop can carry it kilometres and last a few minutes (worked out from the Moon's 1.62 m/s² gravity, not measured). Lawson et al. (2005): the gas spreads several hundred kilometres before it decays. Here the hops are shrunk and 3.82 days become 6 s.",
          'Rn-222 → Po-218 (3.1 min) → Pb-214 → Bi-214 → Po-214 → Pb-210 (22.2 years) → Bi-210 → Po-210 (138 days) → Pb-206. Po-218 recoils as it forms; about half of it lands on the surface and stays, so the chain marks the release site for decades. In an atmosphere radon is mixed by the wind and its daughters ride on aerosols until rain or settling brings them down.',
        ],
      },
    },
    orbiter: {
      label: "Apollo 15's counter",
      title: 'Counting from orbit',
      signs: { ship: 'Apollo 15 (1971)', aps: 'Alpha-particle counter' },
      slider: 'Time after a puff of gas at the crater',
      hints: {
        tap: 'Tap the gold box under the spaceship',
        years: 'Press E and slide the time',
        again: 'Tap the gold box to scan again',
      },
      buttons: { scan: 'Scan the Moon' },
      board: {
        head: { kid: "What Apollo 15's counter found (1971)", sci: 'Apollo 15 alpha-particle spectrometer, 1971' },
        unseen: 'Tap the gold box to start counting',
        aristarchus: 'Aristarchus',
        legendRn: { kid: 'radon: gas coming out now', sci: 'Rn-222 (5.49 MeV): release within days' },
        legendPo: { kid: 'polonium: gas in recent years', sci: 'Po-210 (5.30 MeV): within decades' },
        after: { kid: 'A puff of gas at the crater below, {t} later', sci: 'One puff of radon at the crater, {t} later' },
        rn: 'Radon',
        po: 'Polonium-210',
        rnShort: 'Rn-222 (start = 1)',
        poShort: 'Po-210 (its peak = 1)',
        ticks: ['1 d', '1 wk', '1 mo', '1 yr', '10 yr', '100 yr'],
      },
      says: {
        scan: {
          kid: 'The gold box counts alpha particles: tiny bits that radon and polonium throw out when they break apart. Watch the map fill in as the spaceship passes over.',
          sci: "The spectrometer's ten silicon detectors measured each alpha particle's energy: 5.49 MeV from Rn-222, 5.30 MeV from Po-210, so the two could be told apart.",
        },
        again: {
          kid: 'Scanning again! Over Aristarchus the counter finds radon: gas coming out right now.',
          sci: 'Rn-222 above the background over Aristarchus (Gorenstein and Bjorkholm, 1973): gas released within the last days.',
        },
        days: {
          kid: 'Within days the radon is gone. It breaks apart so fast that the teal glow fades away.',
          sci: 'Rn-222 halves every 3.82 days: after a month less than 1 % is left.',
        },
        years: {
          kid: "Now the amber glow grows: polonium, made from what the radon left behind. It lasts for years.",
          sci: "Pb-210 (22.2 years) feeds Po-210 (138 days); Po-210's activity peaks about 2.3 years after the puff.",
        },
        decades: {
          kid: 'Even after many years a faint amber glow is left. That is how polonium tells us that gas came out in recent years.',
          sci: 'Po-210 then follows Pb-210 down: half its peak about 22 years later, about 5 % after a century. An excess of it means radon released within decades.',
        },
      },
      panel: {
        kid: [
          'In 1971 Apollo 15 circled the Moon with this gold box in its open instrument bay. It counted alpha particles: tiny bits that radon and polonium throw out when they break apart. Over Aristarchus it found radon: gas coming out right then.',
          "Along the edges of the dark 'seas' it found polonium instead. Polonium appears slowly from what radon leaves behind and lasts for decades, so it shows where gas came out in recent years. Slide the time to see why: teal for now, amber for lately. (The spaceship is a model, a third of its real size.)",
        ],
        sci: [
          "Apollo 15 (July and August 1971) and Apollo 16 (April 1972) carried an alpha-particle spectrometer in the service module's Scientific Instrument Module bay: ten silicon surface-barrier detectors, each 3 cm² with a 90° field of view, measuring alpha energies. Apollo 15 detected Rn-222 over the region of Aristarchus (Gorenstein and Bjorkholm, Science 179, 792, 1973).",
          'Both found excess Po-210 at the edges of maria (Fecunditatis, Crisium, Smythii, Tranquillitatis, Nubium, Cognitum, Procellarum: Gorenstein, Golub and Bjorkholm, Science 183, 411, 1974) and at Grimaldi. After one puff, Po-210 activity peaks about 2.3 years later at about 1/2300 of the radon’s starting activity (Bateman equations): Rn-222 marks release within days, excess Po-210 within decades. The map is drawn simply; the model is 1:3 (the real service module is 3.9 m across).',
        ],
      },
    },
    prospector: {
      label: 'Lunar Prospector',
      title: 'Mapping the whole Moon',
      signs: { lp: 'Lunar Prospector (1998 to 1999)' },
      hints: {
        tap: 'Tap Lunar Prospector',
        more: 'Tap it again for two more weeks',
        again: 'Tap it to add two more weeks',
      },
      buttons: { cycle: 'Map two more weeks' },
      readout: {
        none: 'Its map: not started',
        cycles: 'Good maps added: {n}',
        weeks: '{t} of counting',
        storm: 'Stormy Sun: these weeks thrown away',
      },
      says: {
        first: {
          kid: 'Lunar Prospector flies round the Moon over both poles while the Moon turns under it, so in two weeks it sees every part. Its counter is the gold cube at the end of one arm.',
          sci: 'A polar orbit about 100 km up, the Moon turning beneath it: the whole surface every two weeks (a map cycle). The APS was a cube of five detector pairs at the tip of one 2.5 m boom, the spacecraft spinning 12 times a minute.',
        },
        more: {
          kid: 'The counts are very faint, so one map is full of speckles. Add more maps: the real spots stay and the speckles fade away.',
          sci: 'Counting statistics: the noise in an average falls as 1/√N, so summing map cycles lifts weak peaks out of the background.',
        },
        clear: {
          kid: 'Now two radon spots stand out: Aristarchus, and the crater Kepler! And amber spots where gas came out in recent decades.',
          sci: 'Rn-222 above the background near Aristarchus and Kepler; Po-210 in thirteen boxes, most at mare edges; Aristarchus the only place with both (Lawson et al., 2005).',
        },
        storm: {
          kid: 'Oh no, a storm on the Sun! It sprays the counter with alpha particles from space, so these two weeks are thrown away.',
          sci: 'Solar energetic particle events flood the detector with interplanetary alpha particles; the team kept only quiet periods, 229 days of good data.',
        },
      },
      panel: {
        kid: [
          'Lunar Prospector was a small drum with three long arms, spinning like a top. From January 1998 to July 1999 it circled the Moon over both poles, so it could map the whole Moon. One arm carried a cube that counted alpha particles, like Apollo’s gold box.',
          'Its counts were faint: one of its five faces was hurt at launch, and the Sun was very stormy. So the team added up many quiet weeks. Then the radon showed, near Aristarchus again and near Kepler. The Moon still lets out a little gas now and then.',
        ],
        sci: [
          'Lunar Prospector (launched in January 1998, crashed on purpose near the south pole on 31 July 1999) was a spin-stabilised drum 1.36 m across and 1.28 m high with three 2.5 m booms. Its APS: five pairs of 3 × 3 cm silicon detectors on five faces of a cube at the tip of one boom, which it shared with the neutron spectrometer. It mapped in two-week cycles from a polar orbit, at first about 100 km up.',
          'A sunlight-blocking foil leaked light from launch, adding noise, and the solar cycle was near its maximum, so only periods of low interplanetary alpha flux were used: 229 days over 16 months. Lawson et al. (J. Geophys. Res. 110, E09009, 2005) mapped Rn-222 near Aristarchus and Kepler and Po-210 in thirteen 15° × 10° boxes, most at mare edges. The globe’s boxes are placed by that description, not copied from their map.',
        ],
      },
    },
    units: {
      hour: { one: '{n} hour', few: '{n} hours', many: '{n} hours' },
      day: { one: '{n} day', few: '{n} days', many: '{n} days' },
      week: { one: '{n} week', few: '{n} weeks', many: '{n} weeks' },
      month: { one: '{n} month', few: '{n} months', many: '{n} months' },
      year: { one: '{n} year', few: '{n} years', many: '{n} years' },
    },
  },
  'pt-pt': {
    title: 'Na Lua',
    greet: {
      kid: 'Estamos dentro do quadro, na Lua! Lá em baixo está a cratera brilhante Aristarco. Aqui não há ar, por isso o céu fica preto mesmo de dia. A história do quadro está no cavalete.',
      sci: 'A face visível da Lua, no planalto sobre a cratera Aristarco (23,7° N, 47,4° W), desenhada muito mais pequena do que a verdadeira, que tem 40 km de diâmetro e 2,7 km de profundidade. Sem atmosfera: céu preto em pleno dia, sombras duras, nenhuma névoa a qualquer distância. A história do quadro está no cavalete.',
    },
    talk: {
      kid: [
        'Aqui em cima não há vento nem chuva. Aquilo em que me transformo fica onde cai durante anos, como pegadas no pó.',
        'Na Terra também saio das rochas e do solo, e às vezes entro nas caves. Lá as pessoas medem-me e sopram-me para fora: o quadro da cave, na sala, conta essa história.',
        'Vês a Terra? Daqui ela nunca nasce nem se põe. Fica parada no mesmo sítio do céu, enquanto o Sol leva cerca de duas semanas a atravessá-lo.',
        'Venho do urânio das rochas. O urânio desfaz-se muito devagar, passo a passo, e um dos passos sou eu.',
      ],
      sci: [
        'O Rn-222 forma-se nas rochas a partir do rádio-226, na cadeia de decaimento do urânio-238. Onde há mais urânio, como à volta de Aristarco (rica também em tório, segundo o mapa de raios gama da Lunar Prospector), forma-se mais rádon.',
        'Na Terra o mesmo gás sai do granito e do solo; dentro de casa mede-se em becquerel por metro cúbico e ventila-se para fora (o quadro da cave, na sala).',
        'Da face visível, a Terra fica parada no céu, tirando uma pequena oscilação (a libração). Um dia lunar dura cerca de 29,5 dias terrestres, por isso o Sol leva cerca de duas semanas a atravessar o céu.',
        'Aristarco é a grande cratera mais brilhante da Lua: tem cerca de 450 milhões de anos, é jovem de mais para a meteorização espacial lhe ter escurecido a rocha.',
      ],
    },
    vent: {
      label: 'A fenda',
      title: 'O rádon sai aos saltos',
      signs: { crack: 'Fenda' },
      slider: 'Ar sobre a fenda',
      air: '{n} % do ar da Terra',
      airNone: 'nenhum, como na Lua',
      hints: {
        tap: 'Toca na fenda do chão',
        air: 'Carrega em E e dá algum ar à fenda',
        again: 'Toca outra vez na fenda',
        more: 'Toca na fenda para sair mais gás',
      },
      buttons: { puff: 'Deixar sair gás' },
      readout: {
        title: 'Átomos de rádon',
        hopping: 'Aos saltos: {n}',
        drifting: 'A flutuar: {n}',
        broken: 'Desfeitos: {n}',
        dots: 'Pontos cor de âmbar: {n}',
        floated: 'Pontos: nenhum (levados)',
        clock: { kid: '3,8 dias passam em 6 segundos', sci: 'Meia-vida 3,82 d, aqui 6 s' },
      },
      says: {
        puff: {
          kid: 'Aí vêm eles! Não há ar que os leve nem que os trave, por isso cada átomo de rádon voa num arco comprido, aterra e salta outra vez.',
          sci: 'O rádon sai da fenda e desloca-se em trajetórias balísticas: não há gás com que colidir, só a gravidade a curvar cada percurso. Na Lua verdadeira um salto tem quilómetros; aqui os saltos estão encolhidos.',
        },
        again: {
          kid: 'Mais rádon! Olha para um átomo: salta e salta até que, de repente, se desfaz e deixa um ponto cor de âmbar.',
          sci: 'Cada decaimento chega num instante ao acaso: metade dos átomos desaparece ao fim de uma meia-vida, seja quando for que a baforada saiu.',
        },
        puffThin: {
          kid: 'Com um pouco de ar, os saltos ficam mais curtos e tremidos: os átomos estão sempre a chocar com o ar.',
          sci: 'Um gás rarefeito encurta os voos livres: as colisões amortecem os arcos balísticos em percursos curtos e irregulares.',
        },
        puffAir: {
          kid: 'Com ar como o nosso, os átomos já não saltam. A brisa leva-os e espalha-os, e aquilo em que se transformam vai embora agarrado a grãozinhos de pó.',
          sci: 'Numa atmosfera densa o rádon é levado e misturado pelo vento; os produtos do decaimento prendem-se a partículas de aerossol e viajam com elas, por isso não deixam marca junto à fenda.',
        },
        airNone: { kid: 'Outra vez sem ar, como na Lua verdadeira.', sci: 'De volta ao vácuo.' },
        airThin: {
          kid: 'Agora há um pouco de ar na bolha. Toca na fenda e vê o que acontece.',
          sci: 'Um gás rarefeito enche a bolha: toca na fenda para lá deixar entrar rádon.',
        },
        airFull: {
          kid: 'Agora a bolha tem ar tão denso como o da Terra. Toca na fenda e compara!',
          sci: 'A densidade da Terra ao nível do mar: um átomo colide ao fim de muito menos de um micrómetro. Toca na fenda e compara.',
        },
      },
      panel: {
        kid: [
          'O rádon sobe pelas fendas das rochas da Lua. Como não há ar, os átomos vão aos saltos pelo chão, em arcos compridos. Na Lua verdadeira um só salto pode ter quilómetros, por isso uma baforada de rádon espalha-se por centenas de quilómetros antes de desaparecer.',
          'Ao fim de alguns dias (aqui, alguns segundos) cada átomo desfaz-se e transforma-se em polónio, depois em chumbo. Esses ficam presos onde caem e lá ficam durante anos. Na Terra o vento levá-los-ia e a chuva fá-los-ia cair; na Lua marcam o sítio por onde saiu gás.',
        ],
        sci: [
          'O rádon libertado migra em trajetórias balísticas pela superfície sem ar. Ao meio-dia lunar um átomo sai do chão a cerca de 200 m/s, por isso um salto pode levá-lo a quilómetros e durar alguns minutos (calculado a partir da gravidade da Lua, 1,62 m/s², não medido). Lawson et al. (2005): o gás espalha-se por várias centenas de quilómetros antes de decair. Aqui os saltos estão encolhidos e 3,82 dias passam a 6 s.',
          'Rn-222 → Po-218 (3,1 min) → Pb-214 → Bi-214 → Po-214 → Pb-210 (22,2 anos) → Bi-210 → Po-210 (138 dias) → Pb-206. O Po-218 recua ao formar-se; cerca de metade cai na superfície e lá fica, por isso a cadeia marca o local da libertação durante décadas. Numa atmosfera o rádon é misturado pelo vento e os descendentes viajam em aerossóis até a chuva ou a sedimentação os fazerem cair.',
        ],
      },
    },
    orbiter: {
      label: 'O contador da Apollo 15',
      title: 'Contar a partir da órbita',
      signs: { ship: 'Apollo 15 (1971)', aps: 'Contador de partículas alfa' },
      slider: 'Tempo depois de uma baforada de gás na cratera',
      hints: {
        tap: 'Toca na caixa dourada por baixo da nave',
        years: 'Carrega em E e desliza o tempo',
        again: 'Toca na caixa dourada para voltar a medir',
      },
      buttons: { scan: 'Medir a Lua' },
      board: {
        head: { kid: 'O que o contador da Apollo 15 encontrou (1971)', sci: 'Espetrómetro de partículas alfa da Apollo 15, 1971' },
        unseen: 'Toca na caixa dourada para começar a contar',
        aristarchus: 'Aristarco',
        legendRn: { kid: 'rádon: gás a sair agora', sci: 'Rn-222 (5,49 MeV): libertação há dias' },
        legendPo: { kid: 'polónio: gás nos últimos anos', sci: 'Po-210 (5,30 MeV): há décadas' },
        after: { kid: 'Uma baforada de gás na cratera, {t} depois', sci: 'Uma baforada de rádon na cratera, {t} depois' },
        rn: 'Rádon',
        po: 'Polónio-210',
        rnShort: 'Rn-222 (início = 1)',
        poShort: 'Po-210 (o seu máximo = 1)',
        ticks: ['1 d', '1 sem.', '1 mês', '1 ano', '10 anos', '100 anos'],
      },
      says: {
        scan: {
          kid: 'A caixa dourada conta partículas alfa: pedacinhos que o rádon e o polónio atiram para fora quando se desfazem. Vê o mapa a encher-se enquanto a nave passa por cima.',
          sci: 'Os dez detetores de silício do espetrómetro mediam a energia de cada partícula alfa: 5,49 MeV do Rn-222, 5,30 MeV do Po-210, por isso era possível distingui-los.',
        },
        again: {
          kid: 'A medir outra vez! Por cima de Aristarco o contador encontra rádon: gás a sair neste momento.',
          sci: 'Rn-222 acima do fundo sobre Aristarco (Gorenstein e Bjorkholm, 1973): gás libertado nos últimos dias.',
        },
        days: {
          kid: 'Em poucos dias o rádon desaparece. Desfaz-se tão depressa que o brilho azul-esverdeado se apaga.',
          sci: 'O Rn-222 reduz-se a metade a cada 3,82 dias: ao fim de um mês resta menos de 1 %.',
        },
        years: {
          kid: 'Agora cresce o brilho cor de âmbar: polónio, feito com o que o rádon deixou. Dura anos.',
          sci: 'O Pb-210 (22,2 anos) alimenta o Po-210 (138 dias); a atividade do Po-210 atinge o máximo cerca de 2,3 anos depois da baforada.',
        },
        decades: {
          kid: 'Mesmo ao fim de muitos anos ainda resta um leve brilho cor de âmbar. É assim que o polónio nos diz que saiu gás nos últimos anos.',
          sci: 'Depois o Po-210 acompanha a descida do Pb-210: metade do máximo cerca de 22 anos depois, cerca de 5 % ao fim de um século. Um excesso dele indica rádon libertado nas últimas décadas.',
        },
      },
      panel: {
        kid: [
          'Em 1971 a Apollo 15 deu voltas à Lua com esta caixa dourada no seu compartimento de instrumentos aberto. Contava partículas alfa: pedacinhos que o rádon e o polónio atiram para fora quando se desfazem. Por cima de Aristarco encontrou rádon: gás a sair naquele momento.',
          'Ao longo das margens dos «mares» escuros encontrou polónio. O polónio aparece devagar a partir do que o rádon deixa e dura décadas, por isso mostra por onde saiu gás nos últimos anos. Desliza o tempo para veres porquê: azul-esverdeado para agora, âmbar para há pouco. (A nave é uma maqueta, com um terço do tamanho verdadeiro.)',
        ],
        sci: [
          'A Apollo 15 (julho e agosto de 1971) e a Apollo 16 (abril de 1972) levavam um espetrómetro de partículas alfa no compartimento de instrumentos científicos (SIM) do módulo de serviço: dez detetores de silício de barreira de superfície, cada um com 3 cm² e um campo de visão de 90°, que mediam a energia das partículas alfa. A Apollo 15 detetou Rn-222 sobre a região de Aristarco (Gorenstein e Bjorkholm, Science 179, 792, 1973).',
          'As duas encontraram excesso de Po-210 nas margens dos mares (Fecunditatis, Crisium, Smythii, Tranquillitatis, Nubium, Cognitum, Procellarum: Gorenstein, Golub e Bjorkholm, Science 183, 411, 1974) e em Grimaldi. Depois de uma baforada, a atividade do Po-210 atinge o máximo cerca de 2,3 anos depois, a cerca de 1/2300 da atividade inicial do rádon (equações de Bateman): o Rn-222 marca libertação há dias, o excesso de Po-210 há décadas. O mapa está desenhado de forma simples; a maqueta está à escala 1:3 (o módulo de serviço verdadeiro tem 3,9 m de diâmetro).',
        ],
      },
    },
    prospector: {
      label: 'A Lunar Prospector',
      title: 'Cartografar a Lua inteira',
      signs: { lp: 'Lunar Prospector (1998 a 1999)' },
      hints: {
        tap: 'Toca na Lunar Prospector',
        more: 'Toca outra vez para mais duas semanas',
        again: 'Toca para juntar mais duas semanas',
      },
      buttons: { cycle: 'Cartografar mais duas semanas' },
      readout: {
        none: 'O mapa: ainda por começar',
        cycles: 'Mapas bons somados: {n}',
        weeks: '{t} de contagem',
        storm: 'Sol tempestuoso: semanas deitadas fora',
      },
      says: {
        first: {
          kid: 'A Lunar Prospector voa à volta da Lua passando pelos dois polos, enquanto a Lua roda por baixo dela, por isso em duas semanas vê todas as partes. O contador é o cubo dourado na ponta de um dos braços.',
          sci: 'Uma órbita polar a cerca de 100 km de altitude, com a Lua a rodar por baixo: a superfície inteira a cada duas semanas (um ciclo de mapeamento). O APS era um cubo com cinco pares de detetores na ponta de um mastro de 2,5 m, e a sonda girava 12 vezes por minuto.',
        },
        more: {
          kid: 'As contagens são muito fracas, por isso um mapa sozinho está cheio de pintinhas. Junta mais mapas: as manchas verdadeiras ficam e as pintinhas desaparecem.',
          sci: 'Estatística de contagem: o ruído de uma média desce como 1/√N, por isso somar ciclos de mapeamento faz sobressair picos fracos acima do fundo.',
        },
        clear: {
          kid: 'Agora destacam-se duas manchas de rádon: Aristarco e a cratera Kepler! E manchas cor de âmbar onde saiu gás nas últimas décadas.',
          sci: 'Rn-222 acima do fundo perto de Aristarco e de Kepler; Po-210 em treze caixas, a maioria nas margens dos mares; Aristarco é o único sítio com os dois (Lawson et al., 2005).',
        },
        storm: {
          kid: 'Oh não, uma tempestade no Sol! Enche o contador de partículas alfa vindas do espaço, por isso estas duas semanas vão para o lixo.',
          sci: 'Eventos de partículas solares energéticas inundam o detetor com partículas alfa interplanetárias; a equipa só usou períodos calmos, 229 dias de dados bons.',
        },
      },
      panel: {
        kid: [
          'A Lunar Prospector era um pequeno tambor com três braços compridos, a girar como um pião. De janeiro de 1998 a julho de 1999 deu voltas à Lua passando pelos dois polos, para poder cartografar a Lua inteira. Um dos braços levava um cubo que contava partículas alfa, como a caixa dourada da Apollo.',
          'As contagens eram fracas: uma das cinco faces ficou danificada no lançamento, e o Sol andava muito tempestuoso. Por isso a equipa somou muitas semanas calmas. Então o rádon apareceu, outra vez perto de Aristarco e também perto de Kepler. A Lua ainda deixa sair um pouco de gás de vez em quando.',
        ],
        sci: [
          'A Lunar Prospector (lançada em janeiro de 1998, despenhada de propósito perto do polo sul a 31 de julho de 1999) era um tambor estabilizado por rotação, com 1,36 m de diâmetro e 1,28 m de altura, e três mastros de 2,5 m. O seu APS: cinco pares de detetores de silício de 3 × 3 cm em cinco faces de um cubo na ponta de um mastro, que partilhava com o espetrómetro de neutrões. Cartografava em ciclos de duas semanas numa órbita polar, primeiro a cerca de 100 km de altitude.',
          'Uma película que bloqueava a luz do Sol deixou passar luz desde o lançamento, juntando ruído, e o ciclo solar estava perto do máximo, por isso só se usaram períodos de fluxo alfa interplanetário baixo: 229 dias em 16 meses. Lawson et al. (J. Geophys. Res. 110, E09009, 2005) cartografaram Rn-222 perto de Aristarco e Kepler e Po-210 em treze caixas de 15° × 10°, a maioria nas margens dos mares. As caixas do globo estão colocadas segundo essa descrição, não copiadas do mapa deles.',
        ],
      },
    },
    units: {
      hour: { one: '{n} hora', few: '{n} horas', many: '{n} horas' },
      day: { one: '{n} dia', few: '{n} dias', many: '{n} dias' },
      week: { one: '{n} semana', few: '{n} semanas', many: '{n} semanas' },
      month: { one: '{n} mês', few: '{n} meses', many: '{n} meses' },
      year: { one: '{n} ano', few: '{n} anos', many: '{n} anos' },
    },
  },
  pl: {
    title: 'Na Księżycu',
    greet: {
      kid: 'Jesteśmy w obrazie, na Księżycu! Tam w dole jest jasny krater Arystarch. Tu nie ma powietrza, więc niebo jest czarne nawet w dzień. Historia obrazu jest na sztalugach.',
      sci: 'Widoczna strona Księżyca, płaskowyż nad kraterem Arystarch (23,7° N, 47,4° W), narysowanym dużo mniejszym niż prawdziwy, który ma 40 km średnicy i 2,7 km głębokości. Brak atmosfery: czarne niebo w dzień, ostre cienie, żadnej mgiełki na żadnej odległości. Historia obrazu jest na sztalugach.',
    },
    talk: {
      kid: [
        'Tu na górze nie ma wiatru ani deszczu. To, w co się zamieniam, zostaje tam, gdzie spadnie, przez lata, jak ślady stóp w pyle.',
        'Na Ziemi też sączę się ze skał i gleby, a czasem wpadam do piwnic. Tam ludzie mnie mierzą i wydmuchują na zewnątrz: opowiada o tym obraz z piwnicą w sali.',
        'Widzisz Ziemię? Stąd nigdy nie wschodzi ani nie zachodzi. Wisi w tym samym miejscu nieba, a Słońce przechodzi przez nie mniej więcej przez dwa tygodnie.',
        'Pochodzę z uranu w skałach. Uran rozpada się bardzo powoli, krok po kroku, a jednym z tych kroków jestem ja.',
      ],
      sci: [
        'Rn-222 powstaje w skałach z radu-226, w szeregu rozpadu uranu-238. Gdzie jest więcej uranu, jak wokół Arystarcha (bogatego też w tor według mapy promieniowania gamma sondy Lunar Prospector), powstaje więcej radonu.',
        'Na Ziemi ten sam gaz sączy się z granitu i gleby; w domach mierzy się go w bekerelach na metr sześcienny i wentyluje na zewnątrz (obraz z piwnicą w sali).',
        'Z widocznej strony Ziemia wisi nieruchomo na niebie, nie licząc niewielkiego chybotania (libracji). Doba księżycowa trwa około 29,5 doby ziemskiej, więc Słońce przechodzi przez niebo mniej więcej dwa tygodnie.',
        'Arystarch to najjaśniejszy duży krater na Księżycu: ma około 450 milionów lat, jest zbyt młody, by wietrzenie kosmiczne zdążyło przyciemnić jego skały.',
      ],
    },
    vent: {
      label: 'Szczelina',
      title: 'Radon wyskakuje',
      signs: { crack: 'Szczelina' },
      slider: 'Powietrze nad szczeliną',
      air: '{n} % powietrza Ziemi',
      airNone: 'brak, jak na Księżycu',
      hints: {
        tap: 'Dotknij szczeliny w gruncie',
        air: 'Naciśnij E i daj szczelinie trochę powietrza',
        again: 'Dotknij szczeliny jeszcze raz',
        more: 'Dotknij szczeliny, by wypuścić więcej gazu',
      },
      buttons: { puff: 'Wypuść gaz' },
      readout: {
        title: 'Atomy radonu',
        hopping: 'Skaczą: {n}',
        drifting: 'Dryfują: {n}',
        broken: 'Rozpadły się: {n}',
        dots: 'Bursztynowe kropki: {n}',
        floated: 'Kropki: brak (zwiane)',
        clock: { kid: '3,8 dnia mija w 6 sekund', sci: 'Okres półtrwania 3,82 d, tu 6 s' },
      },
      says: {
        puff: {
          kid: 'Wychodzą! Nie ma powietrza, które by je niosło albo hamowało, więc każdy atom radonu leci długim łukiem, ląduje i skacze dalej.',
          sci: 'Radon opuszcza szczelinę i porusza się balistycznie: nie ma gazu, z którym mógłby się zderzać, tylko grawitacja zakrzywia każdy tor. Na prawdziwym Księżycu skok ma kilometry; tu skoki są pomniejszone.',
        },
        again: {
          kid: 'Więcej radonu! Popatrz na jeden atom: skacze i skacze, aż nagle się rozpada i zostawia bursztynową kropkę.',
          sci: 'Każdy rozpad następuje w przypadkowej chwili: połowa atomów znika w ciągu jednego okresu półtrwania, niezależnie od tego, kiedy wyszła chmurka.',
        },
        puffThin: {
          kid: 'Przy odrobinie powietrza skoki są krótsze i chwiejne: atomy ciągle zderzają się z powietrzem.',
          sci: 'Rozrzedzony gaz skraca swobodne loty: zderzenia tłumią łuki balistyczne w krótkie, rozedrgane odcinki.',
        },
        puffAir: {
          kid: 'Przy powietrzu takim jak nasze atomy w ogóle nie skaczą. Wiaterek je unosi i rozprasza, a to, w co się zamieniają, odlatuje na drobinkach pyłu.',
          sci: 'W gęstej atmosferze radon jest unoszony i mieszany przez wiatr; produkty rozpadu przyczepiają się do cząstek aerozolu i podróżują z nimi, więc nie zostawiają śladu przy szczelinie.',
        },
        airNone: { kid: 'Znowu bez powietrza, jak na prawdziwym Księżycu.', sci: 'Z powrotem próżnia.' },
        airThin: {
          kid: 'Teraz w bańce jest trochę powietrza. Dotknij szczeliny i zobacz, co się stanie.',
          sci: 'Bańkę wypełnia rozrzedzony gaz: dotknij szczeliny, by wpuścić do niej radon.',
        },
        airFull: {
          kid: 'Teraz w bańce jest powietrze tak gęste jak na Ziemi. Dotknij szczeliny i porównaj!',
          sci: 'Gęstość jak na Ziemi przy poziomie morza: atom zderza się po drodze dużo krótszej niż mikrometr. Dotknij szczeliny i porównaj.',
        },
      },
      panel: {
        kid: [
          'Radon wydostaje się szczelinami w skałach Księżyca. Nie ma powietrza, więc jego atomy skaczą po gruncie długimi łukami. Na prawdziwym Księżycu jeden skok może mieć kilometry, więc chmurka radonu rozchodzi się na setki kilometrów, zanim zniknie.',
          'Po kilku dniach (tu po kilku sekundach) każdy atom się rozpada i zamienia w polon, a potem w ołów. Te przywierają tam, gdzie spadną, i zostają na lata. Na Ziemi wiatr by je porwał, a deszcz zmył na dół; na Księżycu znaczą miejsce, z którego wyszedł gaz.',
        ],
        sci: [
          'Uwolniony radon wędruje balistycznie po powierzchni bez powietrza. W księżycowe południe atom opuszcza grunt z prędkością około 200 m/s, więc jeden skok może go przenieść o kilometry i trwać kilka minut (obliczone z grawitacji Księżyca, 1,62 m/s², nie zmierzone). Lawson i in. (2005): gaz rozchodzi się na kilkaset kilometrów, zanim się rozpadnie. Tu skoki są pomniejszone, a 3,82 dnia trwa 6 s.',
          'Rn-222 → Po-218 (3,1 min) → Pb-214 → Bi-214 → Po-214 → Pb-210 (22,2 roku) → Bi-210 → Po-210 (138 dni) → Pb-206. Powstający Po-218 doznaje odrzutu; mniej więcej połowa trafia na powierzchnię i tam zostaje, więc szereg znaczy miejsce uwolnienia przez dziesięciolecia. W atmosferze radon jest mieszany przez wiatr, a jego pochodne wędrują na aerozolach, aż deszcz lub osiadanie sprowadzą je na ziemię.',
        ],
      },
    },
    orbiter: {
      label: 'Licznik Apollo 15',
      title: 'Liczenie z orbity',
      signs: { ship: 'Apollo 15 (1971)', aps: 'Licznik cząstek alfa' },
      slider: 'Czas po wypuszczeniu gazu w kraterze',
      hints: {
        tap: 'Dotknij złotej skrzynki pod statkiem',
        years: 'Naciśnij E i przesuń czas',
        again: 'Dotknij złotej skrzynki, by zmierzyć jeszcze raz',
      },
      buttons: { scan: 'Zbadaj Księżyc' },
      board: {
        head: { kid: 'Co znalazł licznik Apollo 15 (1971)', sci: 'Spektrometr cząstek alfa Apollo 15, 1971' },
        unseen: 'Dotknij złotej skrzynki, by zacząć liczyć',
        aristarchus: 'Arystarch',
        legendRn: { kid: 'radon: gaz wychodzi teraz', sci: 'Rn-222 (5,49 MeV): uwolnienie przed dniami' },
        legendPo: { kid: 'polon: gaz w ostatnich latach', sci: 'Po-210 (5,30 MeV): przed dziesięcioleciami' },
        after: { kid: 'Chmurka gazu w kraterze, {t} później', sci: 'Jedna chmurka radonu w kraterze, {t} później' },
        rn: 'Radon',
        po: 'Polon-210',
        rnShort: 'Rn-222 (początek = 1)',
        poShort: 'Po-210 (jego szczyt = 1)',
        ticks: ['1 d.', '1 tydz.', '1 mies.', '1 rok', '10 lat', '100 lat'],
      },
      says: {
        scan: {
          kid: 'Złota skrzynka liczy cząstki alfa: maleńkie okruchy, które radon i polon wyrzucają, kiedy się rozpadają. Patrz, jak mapa się wypełnia, gdy statek przelatuje nad Księżycem.',
          sci: 'Dziesięć krzemowych detektorów spektrometru mierzyło energię każdej cząstki alfa: 5,49 MeV od Rn-222, 5,30 MeV od Po-210, więc dało się je odróżnić.',
        },
        again: {
          kid: 'Mierzymy jeszcze raz! Nad Arystarchem licznik znajduje radon: gaz, który wychodzi właśnie teraz.',
          sci: 'Rn-222 ponad tłem nad Arystarchem (Gorenstein i Bjorkholm, 1973): gaz uwolniony w ostatnich dniach.',
        },
        days: {
          kid: 'W ciągu kilku dni radonu już nie ma. Rozpada się tak szybko, że turkusowa poświata gaśnie.',
          sci: 'Rn-222 ubywa o połowę co 3,82 dnia: po miesiącu zostaje mniej niż 1 %.',
        },
        years: {
          kid: 'Teraz rośnie bursztynowa poświata: polon, powstały z tego, co zostawił radon. Trwa latami.',
          sci: 'Pb-210 (22,2 roku) zasila Po-210 (138 dni); aktywność Po-210 osiąga szczyt około 2,3 roku po wypuszczeniu gazu.',
        },
        decades: {
          kid: 'Nawet po wielu latach zostaje słaba bursztynowa poświata. Tak polon mówi nam, że w ostatnich latach wychodził gaz.',
          sci: 'Potem Po-210 maleje razem z Pb-210: połowa szczytu po około 22 latach, około 5 % po stuleciu. Jego nadmiar oznacza radon uwolniony w ciągu dziesięcioleci.',
        },
      },
      panel: {
        kid: [
          'W 1971 roku Apollo 15 okrążał Księżyc z tą złotą skrzynką w otwartej wnęce przyrządów. Liczyła cząstki alfa: maleńkie okruchy, które radon i polon wyrzucają, kiedy się rozpadają. Nad Arystarchem znalazła radon: gaz, który wychodził właśnie wtedy.',
          'Wzdłuż brzegów ciemnych „mórz” znalazła za to polon. Polon powstaje powoli z tego, co zostawia radon, i trwa dziesięciolecia, więc pokazuje, gdzie gaz wychodził w ostatnich latach. Przesuń czas, by zobaczyć dlaczego: turkus to teraz, bursztyn to niedawno. (Statek to model, jedna trzecia prawdziwej wielkości.)',
        ],
        sci: [
          'Apollo 15 (lipiec i sierpień 1971) i Apollo 16 (kwiecień 1972) miały spektrometr cząstek alfa we wnęce przyrządów naukowych (SIM) modułu serwisowego: dziesięć krzemowych detektorów z barierą powierzchniową, każdy o powierzchni 3 cm² i polu widzenia 90°, mierzących energię cząstek alfa. Apollo 15 wykrył Rn-222 nad okolicą Arystarcha (Gorenstein i Bjorkholm, Science 179, 792, 1973).',
          'Oba znalazły nadmiar Po-210 na brzegach mórz (Fecunditatis, Crisium, Smythii, Tranquillitatis, Nubium, Cognitum, Procellarum: Gorenstein, Golub i Bjorkholm, Science 183, 411, 1974) oraz w Grimaldim. Po jednej chmurce aktywność Po-210 osiąga szczyt po około 2,3 roku, na poziomie około 1/2300 początkowej aktywności radonu (równania Batemana): Rn-222 znaczy uwolnienie przed dniami, nadmiar Po-210 przed dziesięcioleciami. Mapa jest narysowana w uproszczeniu; model ma skalę 1:3 (prawdziwy moduł serwisowy ma 3,9 m średnicy).',
        ],
      },
    },
    prospector: {
      label: 'Lunar Prospector',
      title: 'Mapa całego Księżyca',
      signs: { lp: 'Lunar Prospector (1998–1999)' },
      hints: {
        tap: 'Dotknij sondy Lunar Prospector',
        more: 'Dotknij jej znowu, by dodać dwa tygodnie',
        again: 'Dotknij jej, by dodać kolejne dwa tygodnie',
      },
      buttons: { cycle: 'Mapuj kolejne dwa tygodnie' },
      readout: {
        none: 'Jej mapa: jeszcze nie zaczęta',
        cycles: 'Dodane dobre mapy: {n}',
        weeks: '{t} liczenia',
        storm: 'Burza na Słońcu: te tygodnie odrzucone',
      },
      says: {
        first: {
          kid: 'Lunar Prospector krąży wokół Księżyca nad oboma biegunami, a Księżyc obraca się pod nim, więc w dwa tygodnie widzi każdy jego kawałek. Licznik to złota kostka na końcu jednego ramienia.',
          sci: 'Orbita polarna na wysokości około 100 km, a pod nią obracający się Księżyc: cała powierzchnia co dwa tygodnie (jeden cykl mapowania). APS był kostką z pięcioma parami detektorów na końcu jednego 2,5-metrowego wysięgnika, a sonda obracała się 12 razy na minutę.',
        },
        more: {
          kid: 'Zliczeń jest bardzo mało, więc jedna mapa jest pełna plamek. Dodawaj kolejne mapy: prawdziwe plamy zostają, a przypadkowe plamki znikają.',
          sci: 'Statystyka zliczeń: szum średniej maleje jak 1/√N, więc sumowanie cykli mapowania wydobywa słabe szczyty ponad tło.',
        },
        clear: {
          kid: 'Teraz widać dwie plamy radonu: Arystarcha i krater Kepler! A także bursztynowe plamy tam, gdzie w ostatnich dziesięcioleciach wychodził gaz.',
          sci: 'Rn-222 ponad tłem przy Arystarchu i Keplerze; Po-210 w trzynastu polach, w większości na brzegach mórz; Arystarch to jedyne miejsce z jednym i drugim (Lawson i in., 2005).',
        },
        storm: {
          kid: 'O nie, burza na Słońcu! Zasypuje licznik cząstkami alfa z kosmosu, więc te dwa tygodnie trzeba odrzucić.',
          sci: 'Słoneczne zdarzenia cząstek energetycznych zalewają detektor międzyplanetarnymi cząstkami alfa; zespół użył tylko spokojnych okresów, 229 dni dobrych danych.',
        },
      },
      panel: {
        kid: [
          'Lunar Prospector był małym bębnem z trzema długimi ramionami, wirującym jak bączek. Od stycznia 1998 do lipca 1999 roku krążył wokół Księżyca nad oboma biegunami, żeby zrobić mapę całego Księżyca. Jedno ramię niosło kostkę, która liczyła cząstki alfa, tak jak złota skrzynka Apollo.',
          'Zliczeń było mało: jedna z pięciu ścianek ucierpiała przy starcie, a na Słońcu szalały burze. Dlatego zespół zsumował wiele spokojnych tygodni. Wtedy pokazał się radon, znów przy Arystarchu i jeszcze przy Keplerze. Księżyc wciąż od czasu do czasu wypuszcza trochę gazu.',
        ],
        sci: [
          'Lunar Prospector (start w styczniu 1998, celowo rozbity w pobliżu bieguna południowego 31 lipca 1999) był stabilizowanym obrotowo bębnem o średnicy 1,36 m i wysokości 1,28 m, z trzema 2,5-metrowymi wysięgnikami. Jego APS: pięć par krzemowych detektorów 3 × 3 cm na pięciu ścianach kostki na końcu jednego wysięgnika, dzielonego ze spektrometrem neutronów. Mapował w dwutygodniowych cyklach z orbity polarnej, najpierw na wysokości około 100 km.',
          'Folia blokująca światło słoneczne przepuszczała światło od startu, co dodawało szumu, a cykl słoneczny był blisko maksimum, więc użyto tylko okresów niskiego międzyplanetarnego strumienia cząstek alfa: 229 dni w ciągu 16 miesięcy. Lawson i in. (J. Geophys. Res. 110, E09009, 2005) zmapowali Rn-222 przy Arystarchu i Keplerze oraz Po-210 w trzynastu polach 15° × 10°, w większości na brzegach mórz. Pola na globusie są rozmieszczone według tego opisu, nie skopiowane z ich mapy.',
        ],
      },
    },
    units: {
      hour: { one: '{n} godzina', few: '{n} godziny', many: '{n} godzin' },
      day: { one: '{n} dzień', few: '{n} dni', many: '{n} dni' },
      week: { one: '{n} tydzień', few: '{n} tygodnie', many: '{n} tygodni' },
      month: { one: '{n} miesiąc', few: '{n} miesiące', many: '{n} miesięcy' },
      year: { one: '{n} rok', few: '{n} lata', many: '{n} lat' },
    },
  },
  de: {
    title: 'Auf dem Mond',
    greet: {
      kid: 'Wir sind im Bild, auf dem Mond! Da unten liegt der helle Krater Aristarchus. Hier gibt es keine Luft, deshalb bleibt der Himmel sogar am Tag schwarz. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Die Vorderseite des Mondes, auf dem Plateau über dem Krater Aristarchus (23,7° N, 47,4° W), viel kleiner gezeichnet als der echte, der 40 km breit und 2,7 km tief ist. Keine Atmosphäre: ein schwarzer Himmel bei Tag, harte Schatten, kein Dunst in irgendeiner Entfernung. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Hier oben gibt es keinen Wind und keinen Regen. Was aus mir wird, bleibt jahrelang dort liegen, wo es hinfällt, wie Fußspuren im Staub.',
        'Auf der Erde sickere ich auch aus Gestein und Boden, und manchmal in Keller. Dort messen mich die Leute und blasen mich nach draußen: Das Kellerbild in der Halle erzählt davon.',
        'Siehst du die Erde? Von hier aus geht sie nie auf und nie unter. Sie hängt immer an derselben Stelle am Himmel, während die Sonne etwa zwei Wochen braucht, um ihn zu überqueren.',
        'Ich komme vom Uran in den Gesteinen. Uran zerfällt sehr langsam, Schritt für Schritt, und einer der Schritte bin ich.',
      ],
      sci: [
        'Rn-222 entsteht im Gestein aus Radium-226, in der Zerfallsreihe von Uran-238. Wo mehr Uran ist, wie rund um Aristarchus (laut der Gammakarte von Lunar Prospector auch reich an Thorium), entsteht mehr Radon.',
        'Auf der Erde sickert dasselbe Gas aus Granit und Boden; in Häusern wird es in Becquerel pro Kubikmeter gemessen und nach draußen gelüftet (das Kellerbild in der Halle).',
        'Von der Vorderseite aus hängt die Erde still am Himmel, bis auf ein kleines Schwanken (Libration). Ein Mondtag dauert etwa 29,5 Erdtage, deshalb braucht die Sonne etwa zwei Wochen über den Himmel.',
        'Aristarchus ist der hellste große Krater des Mondes: etwa 450 Millionen Jahre alt, zu jung, als dass die Weltraumverwitterung sein Gestein schon nachgedunkelt hätte.',
      ],
    },
    vent: {
      label: 'Der Spalt',
      title: 'Radon hüpft heraus',
      signs: { crack: 'Spalt' },
      slider: 'Luft über dem Spalt',
      air: '{n} % der Erdluft',
      airNone: 'keine, wie auf dem Mond',
      hints: {
        tap: 'Tippe auf den Spalt im Boden',
        air: 'Drück E und gib dem Spalt etwas Luft',
        again: 'Tippe noch einmal auf den Spalt',
        more: 'Tippe auf den Spalt für mehr Gas',
      },
      buttons: { puff: 'Gas herauslassen' },
      readout: {
        title: 'Radonatome',
        hopping: 'Hüpfen: {n}',
        drifting: 'Treiben: {n}',
        broken: 'Zerfallen: {n}',
        dots: 'Bernsteinpunkte: {n}',
        floated: 'Punkte: keine (verweht)',
        clock: { kid: '3,8 Tage vergehen in 6 Sekunden', sci: 'Halbwertszeit 3,82 d, hier 6 s' },
      },
      says: {
        puff: {
          kid: 'Da kommen sie! Keine Luft trägt sie oder bremst sie, deshalb fliegt jedes Radonatom in einem langen Bogen, landet und hüpft weiter.',
          sci: 'Radon verlässt den Spalt und fliegt ballistisch: kein Gas, mit dem es zusammenstoßen könnte, nur die Schwerkraft krümmt jede Bahn. Auf dem echten Mond ist ein Sprung kilometerlang; hier sind die Sprünge verkleinert.',
        },
        again: {
          kid: 'Mehr Radon! Schau dir ein Atom an: Es hüpft und hüpft, bis es plötzlich zerfällt und einen bernsteinfarbenen Punkt hinterlässt.',
          sci: 'Jeder Zerfall kommt zu einem zufälligen Zeitpunkt: Die Hälfte der Atome ist nach einer Halbwertszeit fort, ganz gleich, wann der Stoß herauskam.',
        },
        puffThin: {
          kid: 'Mit ein bisschen Luft werden die Sprünge kürzer und wackliger: Die Atome stoßen ständig an die Luft.',
          sci: 'Ein dünnes Gas verkürzt die freien Flüge: Stöße dämpfen die ballistischen Bögen zu kurzen, zittrigen Stücken.',
        },
        puffAir: {
          kid: 'Mit Luft wie unserer hüpfen die Atome gar nicht. Der Wind trägt sie fort und verteilt sie, und was aus ihnen wird, schwebt auf Staubkörnchen davon.',
          sci: 'In einer dichten Atmosphäre wird Radon vom Wind getragen und vermischt; seine Zerfallsprodukte lagern sich an Aerosolteilchen an und reisen mit ihnen, deshalb hinterlassen sie am Spalt keine Spur.',
        },
        airNone: { kid: 'Wieder keine Luft, wie auf dem echten Mond.', sci: 'Zurück zum Vakuum.' },
        airThin: {
          kid: 'Jetzt ist ein bisschen Luft in der Blase. Tippe auf den Spalt und schau, was passiert.',
          sci: 'Ein dünnes Gas füllt die Blase: Tippe auf den Spalt, um Radon hineinzulassen.',
        },
        airFull: {
          kid: 'Jetzt ist die Luft in der Blase so dicht wie auf der Erde. Tippe auf den Spalt und vergleiche!',
          sci: 'Die Dichte der Erdluft auf Meereshöhe: Ein Atom stößt nach weit weniger als einem Mikrometer an. Tippe auf den Spalt und vergleiche.',
        },
      },
      panel: {
        kid: [
          'Radon steigt durch Spalten im Gestein des Mondes auf. Weil es keine Luft gibt, hüpfen seine Atome in langen Bögen über den Boden. Auf dem echten Mond kann ein einziger Sprung kilometerlang sein, deshalb verteilt sich ein Stoß Radon über Hunderte Kilometer, bevor er verschwunden ist.',
          'Nach ein paar Tagen (hier ein paar Sekunden) zerfällt jedes Atom und wird zu Polonium, dann zu Blei. Die bleiben haften, wo sie landen, und liegen dort jahrelang. Auf der Erde würde der Wind sie forttragen und der Regen sie herunterwaschen; auf dem Mond zeigen sie, wo Gas herauskam.',
        ],
        sci: [
          'Freigesetztes Radon wandert ballistisch über die luftlose Oberfläche. Zur Mondmittagszeit verlässt ein Atom den Boden mit etwa 200 m/s, deshalb kann ein Sprung es kilometerweit tragen und einige Minuten dauern (berechnet aus der Schwerkraft des Mondes, 1,62 m/s², nicht gemessen). Lawson u. a. (2005): Das Gas verteilt sich über mehrere hundert Kilometer, bevor es zerfällt. Hier sind die Sprünge verkleinert, und aus 3,82 Tagen werden 6 s.',
          'Rn-222 → Po-218 (3,1 min) → Pb-214 → Bi-214 → Po-214 → Pb-210 (22,2 Jahre) → Bi-210 → Po-210 (138 Tage) → Pb-206. Po-218 erhält bei seiner Entstehung einen Rückstoß; etwa die Hälfte landet auf der Oberfläche und bleibt dort, deshalb markiert die Reihe den Ort der Freisetzung über Jahrzehnte. In einer Atmosphäre vermischt der Wind das Radon, und seine Folgeprodukte reisen auf Aerosolen, bis Regen oder Absetzen sie herunterholen.',
        ],
      },
    },
    orbiter: {
      label: 'Der Zähler von Apollo 15',
      title: 'Zählen aus der Umlaufbahn',
      signs: { ship: 'Apollo 15 (1971)', aps: 'Alphateilchen-Zähler' },
      slider: 'Zeit nach einem Gasstoß im Krater',
      hints: {
        tap: 'Tippe auf die goldene Kiste unter dem Raumschiff',
        years: 'Drück E und schieb die Zeit',
        again: 'Tippe auf die goldene Kiste, um noch einmal zu messen',
      },
      buttons: { scan: 'Den Mond messen' },
      board: {
        head: { kid: 'Was der Zähler von Apollo 15 fand (1971)', sci: 'Alphateilchen-Spektrometer von Apollo 15, 1971' },
        unseen: 'Tippe auf die goldene Kiste, um mit dem Zählen zu beginnen',
        aristarchus: 'Aristarchus',
        legendRn: { kid: 'Radon: Gas kommt jetzt heraus', sci: 'Rn-222 (5,49 MeV): Freisetzung vor Tagen' },
        legendPo: { kid: 'Polonium: Gas in den letzten Jahren', sci: 'Po-210 (5,30 MeV): vor Jahrzehnten' },
        after: { kid: 'Ein Gasstoß im Krater, {t} später', sci: 'Ein Stoß Radon im Krater, {t} später' },
        rn: 'Radon',
        po: 'Polonium-210',
        rnShort: 'Rn-222 (Anfang = 1)',
        poShort: 'Po-210 (sein Maximum = 1)',
        ticks: ['1 T.', '1 Wo.', '1 Mon.', '1 J.', '10 J.', '100 J.'],
      },
      says: {
        scan: {
          kid: 'Die goldene Kiste zählt Alphateilchen: winzige Stückchen, die Radon und Polonium beim Zerfallen hinauswerfen. Schau, wie sich die Karte füllt, während das Raumschiff darüberfliegt.',
          sci: 'Die zehn Siliziumdetektoren des Spektrometers maßen die Energie jedes Alphateilchens: 5,49 MeV von Rn-222, 5,30 MeV von Po-210, deshalb ließen sich die beiden unterscheiden.',
        },
        again: {
          kid: 'Noch einmal messen! Über Aristarchus findet der Zähler Radon: Gas, das gerade jetzt herauskommt.',
          sci: 'Rn-222 über dem Untergrund über Aristarchus (Gorenstein und Bjorkholm, 1973): in den letzten Tagen freigesetztes Gas.',
        },
        days: {
          kid: 'Nach ein paar Tagen ist das Radon fort. Es zerfällt so schnell, dass das türkise Leuchten verblasst.',
          sci: 'Rn-222 halbiert sich alle 3,82 Tage: Nach einem Monat ist weniger als 1 % übrig.',
        },
        years: {
          kid: 'Jetzt wächst das bernsteinfarbene Leuchten: Polonium, entstanden aus dem, was das Radon hinterlassen hat. Es hält jahrelang.',
          sci: 'Pb-210 (22,2 Jahre) speist Po-210 (138 Tage); die Aktivität von Po-210 erreicht etwa 2,3 Jahre nach dem Stoß ihr Maximum.',
        },
        decades: {
          kid: 'Selbst nach vielen Jahren bleibt ein schwaches bernsteinfarbenes Leuchten. So verrät uns das Polonium, dass in den letzten Jahren Gas herauskam.',
          sci: 'Danach folgt Po-210 dem Pb-210 nach unten: die Hälfte des Maximums nach etwa 22 Jahren, etwa 5 % nach einem Jahrhundert. Ein Überschuss davon bedeutet Radon, das innerhalb von Jahrzehnten frei wurde.',
        },
      },
      panel: {
        kid: [
          '1971 umkreiste Apollo 15 den Mond mit dieser goldenen Kiste in seinem offenen Instrumentenschacht. Sie zählte Alphateilchen: winzige Stückchen, die Radon und Polonium beim Zerfallen hinauswerfen. Über Aristarchus fand sie Radon: Gas, das genau in dem Moment herauskam.',
          'An den Rändern der dunklen „Meere“ fand sie dagegen Polonium. Polonium entsteht langsam aus dem, was Radon hinterlässt, und hält Jahrzehnte, deshalb zeigt es, wo in den letzten Jahren Gas herauskam. Schieb die Zeit, um zu sehen, warum: Türkis für jetzt, Bernstein für vor Kurzem. (Das Raumschiff ist ein Modell, ein Drittel so groß wie das echte.)',
        ],
        sci: [
          'Apollo 15 (Juli und August 1971) und Apollo 16 (April 1972) trugen ein Alphateilchen-Spektrometer im wissenschaftlichen Instrumentenschacht (SIM) des Servicemoduls: zehn Silizium-Oberflächensperrschichtdetektoren, jeder 3 cm² groß mit einem Sichtfeld von 90°, die die Energie der Alphateilchen maßen. Apollo 15 entdeckte Rn-222 über der Gegend von Aristarchus (Gorenstein und Bjorkholm, Science 179, 792, 1973).',
          'Beide fanden einen Überschuss an Po-210 an den Rändern der Maria (Fecunditatis, Crisium, Smythii, Tranquillitatis, Nubium, Cognitum, Procellarum: Gorenstein, Golub und Bjorkholm, Science 183, 411, 1974) und bei Grimaldi. Nach einem Stoß erreicht die Po-210-Aktivität etwa 2,3 Jahre später ihr Maximum, bei etwa 1/2300 der anfänglichen Radonaktivität (Bateman-Gleichungen): Rn-222 zeigt eine Freisetzung vor Tagen an, ein Po-210-Überschuss eine vor Jahrzehnten. Die Karte ist vereinfacht gezeichnet; das Modell hat den Maßstab 1:3 (das echte Servicemodul ist 3,9 m breit).',
        ],
      },
    },
    prospector: {
      label: 'Lunar Prospector',
      title: 'Den ganzen Mond kartieren',
      signs: { lp: 'Lunar Prospector (1998 bis 1999)' },
      hints: {
        tap: 'Tippe auf Lunar Prospector',
        more: 'Tippe noch einmal für zwei weitere Wochen',
        again: 'Tippe darauf, um zwei weitere Wochen dazuzunehmen',
      },
      buttons: { cycle: 'Zwei weitere Wochen kartieren' },
      readout: {
        none: 'Seine Karte: noch nicht begonnen',
        cycles: 'Gute Karten addiert: {n}',
        weeks: '{t} gezählt',
        storm: 'Stürmische Sonne: diese Wochen verworfen',
      },
      says: {
        first: {
          kid: 'Lunar Prospector fliegt über beide Pole um den Mond, während sich der Mond unter ihm dreht, deshalb sieht er in zwei Wochen jeden Teil. Sein Zähler ist der goldene Würfel am Ende eines Arms.',
          sci: 'Eine polare Umlaufbahn in etwa 100 km Höhe, darunter der sich drehende Mond: alle zwei Wochen die ganze Oberfläche (ein Kartierungszyklus). Das APS war ein Würfel mit fünf Detektorpaaren an der Spitze eines 2,5 m langen Auslegers, und die Sonde drehte sich 12-mal pro Minute.',
        },
        more: {
          kid: 'Es kommen sehr wenige Zählungen, deshalb ist eine einzelne Karte voller Flecken. Addiere mehr Karten: Die echten Stellen bleiben, die Zufallsflecken verschwinden.',
          sci: 'Zählstatistik: Das Rauschen eines Mittelwerts fällt wie 1/√N, deshalb hebt das Aufsummieren von Kartierungszyklen schwache Spitzen aus dem Untergrund.',
        },
        clear: {
          kid: 'Jetzt stechen zwei Radonflecken hervor: Aristarchus und der Krater Kepler! Und bernsteinfarbene Flecken, wo in den letzten Jahrzehnten Gas herauskam.',
          sci: 'Rn-222 über dem Untergrund nahe Aristarchus und Kepler; Po-210 in dreizehn Feldern, die meisten an Mare-Rändern; Aristarchus ist der einzige Ort mit beidem (Lawson u. a., 2005).',
        },
        storm: {
          kid: 'Oh nein, ein Sturm auf der Sonne! Er überschüttet den Zähler mit Alphateilchen aus dem All, deshalb werden diese zwei Wochen verworfen.',
          sci: 'Solare Teilchenereignisse überfluten den Detektor mit interplanetaren Alphateilchen; das Team nutzte nur ruhige Zeiten, 229 Tage gute Daten.',
        },
      },
      panel: {
        kid: [
          'Lunar Prospector war eine kleine Trommel mit drei langen Armen, die sich wie ein Kreisel drehte. Von Januar 1998 bis Juli 1999 umkreiste er den Mond über beide Pole, damit er den ganzen Mond kartieren konnte. Ein Arm trug einen Würfel, der Alphateilchen zählte, wie die goldene Kiste von Apollo.',
          'Seine Zählungen waren schwach: Eine seiner fünf Seiten wurde beim Start beschädigt, und auf der Sonne tobten viele Stürme. Deshalb addierte das Team viele ruhige Wochen. Dann zeigte sich das Radon, wieder nahe Aristarchus und auch nahe Kepler. Der Mond lässt immer noch ab und zu ein wenig Gas heraus.',
        ],
        sci: [
          'Lunar Prospector (gestartet im Januar 1998, am 31. Juli 1999 absichtlich nahe dem Südpol zum Absturz gebracht) war eine drallstabilisierte Trommel von 1,36 m Durchmesser und 1,28 m Höhe mit drei 2,5 m langen Auslegern. Sein APS: fünf Paare von 3 × 3 cm großen Siliziumdetektoren auf fünf Seiten eines Würfels an der Spitze eines Auslegers, den er mit dem Neutronenspektrometer teilte. Es kartierte in Zwei-Wochen-Zyklen aus einer polaren Umlaufbahn, zuerst in etwa 100 km Höhe.',
          'Eine Folie, die das Sonnenlicht abhalten sollte, ließ seit dem Start Licht durch und brachte Rauschen, und der Sonnenzyklus war nahe seinem Maximum, deshalb wurden nur Zeiten mit geringem interplanetarem Alphafluss verwendet: 229 Tage in 16 Monaten. Lawson u. a. (J. Geophys. Res. 110, E09009, 2005) kartierten Rn-222 nahe Aristarchus und Kepler und Po-210 in dreizehn Feldern von 15° × 10°, die meisten an Mare-Rändern. Die Felder auf dem Globus sind nach dieser Beschreibung gesetzt, nicht von ihrer Karte abgemalt.',
        ],
      },
    },
    units: {
      hour: { one: '{n} Stunde', few: '{n} Stunden', many: '{n} Stunden' },
      day: { one: '{n} Tag', few: '{n} Tage', many: '{n} Tage' },
      week: { one: '{n} Woche', few: '{n} Wochen', many: '{n} Wochen' },
      month: { one: '{n} Monat', few: '{n} Monate', many: '{n} Monate' },
      year: { one: '{n} Jahr', few: '{n} Jahre', many: '{n} Jahre' },
    },
  },
}
