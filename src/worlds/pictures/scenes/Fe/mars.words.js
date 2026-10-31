// The words of iron's Mars room ("Why is Mars red?"), in English, European Portuguese, Polish and German,
// kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Fe.js (the easel
// shows it); the room shows it happening and adds to it.
// Sources: NASA/JPL mission pages and Wikipedia's articles on Opportunity (landed 25 January 2004, 05:05 UTC,
// in Eagle crater, Meridiani Planum; 90 sols planned; last heard from 10 June 2018; 45.16 km), Eagle crater
// (22 m across, 3 m deep), Bounce Rock (football-sized, mostly pyroxene, struck as the lander bounced), the
// Rock Abrasion Tool (Honeybee Robotics; a hole about 45 mm across, a few millimetres deep), MIMOS II
// (Klingelhöfer, Mainz; cobalt-57; 6 to 12 hours a spectrum) and the Martian spherules (Weitz and colleagues
// 2006: mean about 4.2 mm at Eagle crater; concretions of hematite; released by wind erosion over about
// three billion years; Navajo Sandstone concretions as analogues). Jarosite at Meridiani: Klingelhöfer and
// colleagues, Science 2004 (forms in acidic, sulfate-rich water). The MarsDial: Bill Nye's idea, with Woody
// Sullivan and Jim Bell, about 3 inches square, "Two Worlds, One Sun" (the number of languages for "Mars"
// on it differs between sources, so the room leaves it out). The magnets and the dust's magnetite and
// olivine: Goetz and colleagues, Nature 436 (2005). Blue sunsets: NASA's captions (dust scatters blue light
// forwards); Spirit's photographs (2005), Curiosity's (sol 956, 15 April 2015). The Earth as an evening star:
// Curiosity, 31 January 2014. The Mössbauer lines drawn in the room are typical values (doublets of
// iron(II) in olivine and pyroxene, iron(III) in nanophase oxide, sextets of hematite and magnetite), not
// one real spectrum. Placeholders: {n}.
export const MARS_WORDS = {
  en: {
    title: 'Mars, beside Eagle crater',
    greet: {
      kid: 'We are inside the picture: on Mars! This is Meridiani Planum, the plain where the rover Opportunity landed in 2004, beside Eagle, the little crater it rolled into. All this red is rusty iron, like me. The picture\'s story is on the easel beside you.',
      sci: 'Meridiani Planum, Mars, beside Eagle crater (22 m across), where Opportunity came to rest on 25 January 2004. The red is iron(III) oxide in the dust. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Opportunity was built to work for 90 Mars days. It kept going for more than 14 years and drove over 45 kilometres!',
        'A day on Mars is called a sol. It lasts 24 hours and 39 minutes, a little longer than ours.',
        'From Mars the Sun looks smaller, about two thirds as wide as from Earth, because Mars is farther away from it.',
        'Opportunity bounced down inside a ball of airbags and rolled right into this little crater. The scientists called it a hole in one!',
      ],
      sci: [
        'Opportunity landed on 25 January 2004 for a mission planned to last 90 sols. It was last heard from on 10 June 2018, during a planet-wide dust storm, after driving 45.16 km.',
        'A sol lasts 24 h 39 min 35 s. Mars orbits about 1.52 times farther from the Sun than the Earth, so the Sun looks about two thirds as wide and its light is about 43 % as strong.',
        'The lander bounced across the plain in its airbags and rolled into Eagle crater, 22 m across and about 3 m deep: a hole in one, the team said. Its wall showed layered bedrock that told of water.',
        'Iron-57, the atom the Mössbauer spectrometer listens to, is only about 2 % of natural iron, but that is enough.',
      ],
    },
    arm: {
      label: 'Opportunity\'s arm',
      title: 'The rover\'s arm and its iron detector',
      screen: 'Mössbauer spectrometer',
      screenIdle: { kid: 'Tap the rock, the dust or a blueberry', sci: 'No spectrum yet: choose a target' },
      targets: { rock: 'The rock, ground open', dust: 'The red dust', berry: 'A blueberry' },
      progress: '{n} % measured',
      complete: 'finished',
      axis: 'speed of the source (mm/s)',
      hints: {
        busy: 'Watch the arm',
        measuring: 'Watch the spectrum grow',
        brush: 'Tap the rock to brush off its dust',
        grind: 'Tap the rock again to grind a hole',
        rock: 'Tap the rock to measure its iron',
        dust: 'Tap the red dust to measure its iron',
        berry: 'Tap a blueberry to measure its iron',
        again: 'Tap the rock, the dust or a blueberry to compare',
      },
      buttons: { brush: 'Brush the rock', grind: 'Grind a hole', rock: 'Measure the rock', dust: 'Measure the dust', berry: 'Measure a blueberry', fresh: 'A fresh, dusty rock' },
      says: {
        fresh: { kid: 'A new rock, still covered in red dust.', sci: 'New target: a dust-covered rock.' },
        brush: { kid: 'The arm brings its grinder down. First a little brush sweeps the dust away.', sci: 'Rock Abrasion Tool: brushing the dust off first.' },
        brushed: { kid: 'Under the red dust the rock is much darker. The red is only skin deep!', sci: 'Brushed: a dark surface under the coat of ferric dust.' },
        grind: { kid: 'Now the grinder spins and cuts into the rock.', sci: 'Grinding: a diamond-studded wheel cuts a round hole about 45 mm across.' },
        ground: { kid: 'A round hole, and inside, the rock is dark grey. Its iron never rusted.', sci: 'A fresh surface a few millimetres down: dark grey, unweathered basalt.' },
        measure: {
          rock: { kid: 'The iron detector sits down in the hole and listens to the iron inside.', sci: 'Mössbauer spectrometer on the ground surface: counting.' },
          dust: { kid: 'The iron detector sits down on the red dust.', sci: 'Mössbauer spectrometer on the dust drift: counting.' },
          berry: { kid: 'The iron detector sits down on the blueberries.', sci: 'Mössbauer spectrometer on the spherules: counting.' },
        },
        result: {
          rock: { kid: 'Pyroxene and olivine: iron that never met enough oxygen to rust. That is why the rock is grey inside.', sci: 'Two doublets of iron(II), in pyroxene and olivine, as in basalt: the iron has not been oxidised to iron(III).' },
          dust: { kid: 'In the dust the iron has rusted: fine red iron oxide, with crumbs of the old rock and a little magnetite.', sci: 'Mostly the doublet of a fine-grained iron(III) oxide, with olivine, pyroxene and the six lines of magnetite.' },
          berry: { kid: 'Six lines! That is hematite, an iron oxide like rust, but grown into grey crystals.', sci: 'Six lines, a magnetic field at the nucleus near 52 T: hematite, Fe2O3.' },
        },
      },
      minerals: { pyroxene: 'pyroxene', olivine: 'olivine', npox: 'fine iron oxide', magnetite: 'magnetite', hematite: 'hematite' },
      lens: { title: 'Iron atoms catching rays', source: 'cobalt-57', speed: 'speed of the source' },
      panel: {
        kid: [
          'Opportunity carried its tools at the end of an arm. One is a grinder: it brushes the dust off a rock, then cuts a round hole into it, so the scientists can see the rock as it really is inside. Under the red dust, the rocks here are dark grey.',
          'Another is an iron detector, the Mössbauer spectrometer. A tiny source shoots invisible rays at the rock while it swings to and fro. Iron atoms catch the rays only when the swing has just the right speed, and every iron mineral has its own speeds, like its own song. On Mars one measurement took hours; here it is sped up.',
        ],
        sci: [
          'The Rock Abrasion Tool (Honeybee Robotics) brushes a target, then grinds a hole about 45 mm across and a few millimetres deep, removing the dust and the weathered rind. Meridiani\'s loose basalt, such as Bounce Rock (football-sized, mostly pyroxene, struck by the bouncing lander), is dark grey inside.',
          'MIMOS II (Göstar Klingelhöfer\'s group, Mainz) moves a cobalt-57 source to and fro at up to about 10 mm/s; the Doppler shift tunes its 14.4 keV gamma rays. Iron-57 nuclei absorb and re-emit them only at energies set by the iron\'s charge and surroundings: iron(II) silicates give wide doublets, iron(III) narrower ones, magnetic hematite and magnetite six lines. A spectrum took about 6 to 12 hours on Mars. Rudolf Mössbauer found the effect in 1958 (Nobel Prize, 1961).',
        ],
      },
    },
    berries: {
      label: 'The blueberries',
      title: 'Blueberries of hematite',
      dish: 'Magnifier, ten times bigger',
      zoom: 'The crater\'s rock, ten times bigger',
      slider: 'Time',
      stages: ['Sand dunes, long ago', 'Water soaks the sand', 'Blueberries grow', 'The wind wears it away', 'Today'],
      hints: {
        scoop: 'Tap the blueberries on the ground',
        cut: 'Tap the magnifier to cut one open',
        model: 'Tap the model to step through its story',
        ledge: 'Tap the pale ledge of rock',
      },
      buttons: { scoop: 'Pick up a handful', cut: 'Cut one open', again: 'Pick up a new handful', step: 'Step the story on', ledge: 'Look for jarosite' },
      says: {
        scoop: { kid: 'A handful of blueberries! In the magnifier they are ten times bigger. Each one is really only a few millimetres across, smaller than a pea.', sci: 'A handful of spherules, shown ten times bigger: at Eagle crater they are about 4 mm across on average (roughly 3 to 6 mm).' },
        empty: { kid: 'The magnifier is empty. Pick up some blueberries first!', sci: 'Nothing in the dish yet.' },
        cut: { kid: 'Cut in half: grey and shiny all the way through. It is hematite, an iron oxide.', sci: 'Sectioned: grey hematite all through; iron oxide makes up most of each spherule.' },
        whole: { kid: 'A whole one again.', sci: 'Whole spherules.' },
        stages: [
          { kid: 'Long, long ago: wind piles sand into dunes, layer on layer. The sand is salty.', sci: 'More than 3 billion years ago: sulfate-rich sand laid down by the wind in dunes, in thin, slanting layers.' },
          { kid: 'Water seeps up and down through the sand and glues it into rock. The water is acidic: sour, like vinegar.', sci: 'Groundwater rises and falls through the sand and cements it with salts. It is acidic and full of sulfate, as the jarosite shows.' },
          { kid: 'In the wet rock, iron gathers into little grey balls of hematite, growing bigger and bigger.', sci: 'Concretions: iron carried in the groundwater comes out as hematite, growing outwards from a centre, scattered through the rock.' },
          { kid: 'For billions of years the wind blasts the rock with sand and wears it away. The hard blueberries stay and end up lying on top.', sci: 'Wind erosion over roughly 3 billion years lowers the soft sandstone; the harder spherules weather out and gather on the surface.' },
          { kid: 'Today: blueberries lie all over the plain, and red dust covers everything. That is what Opportunity found!', sci: 'Today: loose spherules cover the plain under a coat of ferric dust, and the outcrop still shows them embedded.' },
        ],
        ledge: { kid: 'The pale rock holds jarosite, a yellowish mineral with iron in it. It only forms in acidic water, so this rock was once soaked in water!', sci: 'Jarosite, KFe3(SO4)2(OH)6, found in this outcrop by the Mössbauer spectrometer in 2004: it forms only in acidic, sulfate-rich water.' },
        ledgeEarly: { kid: 'The pale rock holds jarosite, which forms in acidic water. In the model the sand is still dry: move time on to see where it comes from.', sci: 'Jarosite, an acid-sulfate mineral, is in the outcrop. In the model it appears once the groundwater arrives.' },
      },
      panel: {
        kid: [
          'Opportunity found the plain covered with little grey balls a few millimetres across, which the scientists nicknamed blueberries. They are made of hematite, an iron oxide. Some still sit inside the pale rock, others lie loose on the ground.',
          'On Earth, balls like these grow inside rocks soaked by water (there are some in the deserts of Utah). So long ago there was water here, soaking through the ground. The model tells their story ten times bigger: move the time with the slider, or tap the model.',
        ],
        sci: [
          'The spherules are concretions: hematite that came out of groundwater inside the sandstone, then weathered out as the wind eroded the rock. At Eagle crater they average about 4 mm across. An orbiter had seen hematite\'s signature here from above, which is why Opportunity was sent to Meridiani.',
          'The outcrop also holds jarosite, an iron sulfate with water and hydroxide in it that forms only in acidic water, and some of its fine layers were laid down by flowing water. Together they say that Meridiani was once soaked by acidic, salty groundwater. On Earth, similar concretions weather out of the Navajo Sandstone in Utah.',
        ],
      },
    },
    sky: {
      label: 'The sky clock',
      title: 'Evening on Mars',
      time: 'Mars time',
      earth: 'Earth',
      slider: 'Time of the sol',
      parts: { noon: 'midday', afternoon: 'afternoon', sunset: 'sunset', after: 'after sunset', night: 'night' },
      hints: {
        dial: 'Tap the sundial to move the Sun on',
        sky: 'Tap the sky to see a speck of dust',
        earth: 'Tap the bright dot above the sunset',
        later: 'Tap the sundial, on towards sunset',
      },
      buttons: { later: 'Move the Sun on', lens: 'Show the speck of dust', lensOff: 'Hide the speck of dust', earth: 'Find the Earth' },
      says: {
        noon: { kid: 'Midday on Mars: the sky is not blue but pale butterscotch, the colour of caramel, because of the red dust in the air.', sci: 'Noon: a butterscotch sky. The iron oxide dust absorbs blue light and spreads the warmer colours all over the sky.' },
        afternoon: { kid: 'The Sun is getting low. Look how small it is!', sci: 'Afternoon: the Sun, about two thirds as wide as seen from Earth, sinking in the west.' },
        sunset: { kid: 'Sunset! Look: the sky around the Sun turns blue. On Mars the sunsets are blue!', sci: 'Sunset: a blue glow round the Sun. The fine dust scatters blue light forwards, close to the Sun\'s direction, and the long path through the dust makes it show.' },
        after: { kid: 'The Sun has set, but the blue glow lingers. The dust high up still catches the light.', sci: 'After sunset: Martian twilight lasts long, because sunlight still reaches the dust high in the atmosphere.' },
        night: { kid: 'Night on Mars, and the stars come out. It is very, very cold now.', sci: 'Night. The thin air holds little heat: near the equator it can drop below −70 °C before dawn.' },
        lens: { kid: 'Here is a speck of Mars dust, much thinner than a hair. Sunlight comes in; blue light goes on almost straight ahead, red light is thrown all around.', sci: 'A dust grain a few micrometres across: its forward scattering is narrower for blue light than for red, so near the Sun the sky looks blue.' },
        lensOff: { kid: 'The speck of dust is gone.', sci: 'Lens closed.' },
        earth: { kid: 'That bright dot is the Earth, our home, shining as an evening star! Everyone you know is on that dot.', sci: 'The Earth, an evening star in the west after sunset. Curiosity photographed it, with the Moon, in 2014.' },
        noEarth: { kid: 'The sky is still too bright to see the Earth. Wait until after sunset!', sci: 'Still too bright: the Earth shows only in the twilight after sunset.' },
      },
      lens: { title: 'A speck of dust', sun: 'Sun', you: 'you' },
      panel: {
        kid: [
          'This is a copy of the sundial the rovers carried, five times bigger. Its shadow tells the time on Mars, and its grey rings and coloured corners helped the cameras get the colours of Mars right. Its motto is "Two Worlds, One Sun".',
          'By day the Martian sky is butterscotch, because the red dust in the air soaks up blue light. But at sunset the sky around the Sun turns blue: when you look towards the Sun, the tiny grains of dust send blue light straight on to you.',
        ],
        sci: [
          'The MarsDial on Spirit and Opportunity (about 8 cm square; Bill Nye\'s idea, made with Woody Sullivan and Jim Bell) is the panoramic camera\'s calibration target: grey rings and colour chips round a post whose shadow tells the time. Its motto: "Two Worlds, One Sun". The times here are local solar time; a Mars hour is a 24th of a sol, about 61.6 minutes.',
          'The dust (grains a few micrometres across) absorbs blue light and scatters red and orange widely: a butterscotch sky. Its forward-scattering peak is narrower for blue, so blue light stays closer to the Sun\'s direction; low in the sky, with a long path through the dust, this makes the blue glow of sunset. Spirit photographed it in 2005, Curiosity in 2015.',
        ],
      },
    },
    magnets: {
      label: 'The rover\'s magnets',
      title: 'Magnets that catch the dust',
      labels: { capture: 'capture magnet', filter: 'filter magnet' },
      sol: 'sols since landing',
      slider: 'Sols since landing',
      count: 'sol {n}',
      hints: { tap: 'Tap the magnets to let sols go by', full: 'Tap the magnets to clean them and start again' },
      buttons: { more: '60 sols later', clean: 'Clean them' },
      says: {
        clean: { kid: 'Clean magnets, as on the day of landing.', sci: 'Sol 0: clean magnet surfaces.' },
        few: { kid: 'The wind carries dust over the rover, and some of it sticks to the magnets!', sci: 'Airborne dust settling on the magnets: the magnetic grains stay.' },
        many: { kid: 'More and more: a ring of dust on the strong magnet, less on the weak one. The dust holds a little magnetite, an iron mineral a magnet pulls.', sci: 'A thick ring on the capture magnet; on the weaker filter magnet only the most magnetic grains. The spectra showed magnetite.' },
      },
      panel: {
        kid: [
          'Spirit and Opportunity carried magnets on the front of their decks, where their cameras could see them. As the sols went by, the dust blowing in the wind settled on them, and the magnetic grains stayed.',
          'So the Martian dust is a little magnetic: besides its rusty iron, it holds tiny grains of magnetite, an iron mineral that a magnet pulls. These magnets are copies, bigger than the real ones.',
        ],
        sci: [
          'Each rover carried a strong capture magnet and a weaker filter magnet on its deck, a sweep magnet and small magnets in the Rock Abrasion Tool. The filter magnet holds only the most strongly magnetic particles. The panoramic camera watched the dust build up; the Mössbauer and X-ray spectrometers measured it on the magnets.',
          'Goetz and colleagues (Nature, 2005) found that the dust\'s magnetic mineral is magnetite, with olivine beside it. Olivine weathers quickly in liquid water, so they read the dust as a sign of long, dry periods on Mars.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Marte, junto à cratera Eagle',
    greet: {
      kid: 'Estamos dentro da imagem: em Marte! Isto é Meridiani Planum, a planície onde o robô Opportunity aterrou em 2004, junto à Eagle, a pequena cratera para onde ele rolou. Todo este vermelho é ferro enferrujado, como eu. A história da imagem está no cavalete ao teu lado.',
      sci: 'Meridiani Planum, Marte, junto à cratera Eagle (22 m de diâmetro), onde o Opportunity parou a 25 de janeiro de 2004. O vermelho é óxido de ferro(III) na poeira. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O Opportunity foi feito para trabalhar 90 dias de Marte. Continuou durante mais de 14 anos e percorreu mais de 45 quilómetros!',
        'Um dia em Marte chama-se «sol». Dura 24 horas e 39 minutos, um pouco mais do que o nosso.',
        'Visto de Marte, o Sol parece mais pequeno, cerca de dois terços da largura que tem visto da Terra, porque Marte está mais longe dele.',
        'O Opportunity desceu aos saltos dentro de uma bola de airbags e rolou mesmo para dentro desta pequena cratera. Os cientistas disseram que foi um buraco à primeira!',
      ],
      sci: [
        'O Opportunity aterrou a 25 de janeiro de 2004, para uma missão prevista de 90 sóis. Deu notícias pela última vez a 10 de junho de 2018, durante uma tempestade de poeira que cobriu o planeta inteiro, depois de percorrer 45,16 km.',
        'Um sol dura 24 h 39 min 35 s. Marte orbita cerca de 1,52 vezes mais longe do Sol do que a Terra, por isso o Sol parece ter cerca de dois terços da largura e a sua luz cerca de 43 % da força.',
        'O módulo saltou pela planície dentro dos airbags e rolou para a cratera Eagle, com 22 m de diâmetro e cerca de 3 m de profundidade: um buraco à primeira, disse a equipa. A parede mostrava rocha em camadas que falava de água.',
        'O ferro-57, o átomo que o espetrómetro de Mössbauer escuta, é só cerca de 2 % do ferro natural, mas chega.',
      ],
    },
    arm: {
      label: 'O braço do Opportunity',
      title: 'O braço do robô e o seu detetor de ferro',
      screen: 'Espetrómetro de Mössbauer',
      screenIdle: { kid: 'Toca na rocha, na poeira ou num mirtilo', sci: 'Ainda sem espetro: escolhe um alvo' },
      targets: { rock: 'A rocha, desbastada', dust: 'A poeira vermelha', berry: 'Um mirtilo' },
      progress: '{n} % medido',
      complete: 'terminado',
      axis: 'velocidade da fonte (mm/s)',
      hints: {
        busy: 'Olha para o braço',
        measuring: 'Olha para o espetro a crescer',
        brush: 'Toca na rocha para lhe tirar a poeira',
        grind: 'Toca outra vez na rocha para abrir um buraco',
        rock: 'Toca na rocha para medir o seu ferro',
        dust: 'Toca na poeira vermelha para medir o seu ferro',
        berry: 'Toca num mirtilo para medir o seu ferro',
        again: 'Toca na rocha, na poeira ou num mirtilo para comparar',
      },
      buttons: { brush: 'Escovar a rocha', grind: 'Abrir um buraco', rock: 'Medir a rocha', dust: 'Medir a poeira', berry: 'Medir um mirtilo', fresh: 'Uma rocha nova, com poeira' },
      says: {
        fresh: { kid: 'Uma rocha nova, ainda coberta de poeira vermelha.', sci: 'Novo alvo: uma rocha coberta de poeira.' },
        brush: { kid: 'O braço baixa o desbastador. Primeiro, uma escovinha varre a poeira.', sci: 'Ferramenta de abrasão de rochas: primeiro escova a poeira.' },
        brushed: { kid: 'Debaixo da poeira vermelha, a rocha é muito mais escura. O vermelho é só por fora!', sci: 'Escovada: uma superfície escura debaixo da camada de poeira férrica.' },
        grind: { kid: 'Agora o desbastador gira e corta a rocha.', sci: 'A desbastar: uma roda com diamantes corta um buraco redondo com cerca de 45 mm de diâmetro.' },
        ground: { kid: 'Um buraco redondo, e lá dentro a rocha é cinzenta-escura. O seu ferro nunca enferrujou.', sci: 'Uma superfície fresca a poucos milímetros de profundidade: basalto cinzento-escuro, sem alteração.' },
        measure: {
          rock: { kid: 'O detetor de ferro pousa no buraco e escuta o ferro lá dentro.', sci: 'Espetrómetro de Mössbauer sobre a superfície desbastada: a contar.' },
          dust: { kid: 'O detetor de ferro pousa na poeira vermelha.', sci: 'Espetrómetro de Mössbauer sobre o monte de poeira: a contar.' },
          berry: { kid: 'O detetor de ferro pousa nos mirtilos.', sci: 'Espetrómetro de Mössbauer sobre as esférulas: a contar.' },
        },
        result: {
          rock: { kid: 'Piroxena e olivina: ferro que nunca encontrou oxigénio suficiente para enferrujar. É por isso que a rocha é cinzenta por dentro.', sci: 'Dois dupletos de ferro(II), na piroxena e na olivina, como no basalto: o ferro não foi oxidado a ferro(III).' },
          dust: { kid: 'Na poeira o ferro enferrujou: óxido de ferro vermelho e fino, com migalhas da rocha antiga e um pouco de magnetite.', sci: 'Sobretudo o dupleto de um óxido de ferro(III) de grão fino, com olivina, piroxena e as seis riscas da magnetite.' },
          berry: { kid: 'Seis riscas! É hematite, um óxido de ferro como a ferrugem, mas crescido em cristais cinzentos.', sci: 'Seis riscas, um campo magnético no núcleo perto de 52 T: hematite, Fe2O3.' },
        },
      },
      minerals: { pyroxene: 'piroxena', olivine: 'olivina', npox: 'óxido de ferro fino', magnetite: 'magnetite', hematite: 'hematite' },
      lens: { title: 'Átomos de ferro a apanhar raios', source: 'cobalto-57', speed: 'velocidade da fonte' },
      panel: {
        kid: [
          'O Opportunity levava as suas ferramentas na ponta de um braço. Uma é um desbastador: escova a poeira de uma rocha e depois corta-lhe um buraco redondo, para os cientistas verem a rocha como ela é por dentro. Debaixo da poeira vermelha, as rochas aqui são cinzentas-escuras.',
          'Outra é um detetor de ferro, o espetrómetro de Mössbauer. Uma fonte minúscula dispara raios invisíveis contra a rocha enquanto balança para a frente e para trás. Os átomos de ferro só apanham os raios quando o balanço tem a velocidade certa, e cada mineral de ferro tem as suas velocidades, como uma canção própria. Em Marte, uma medição demorava horas; aqui é acelerada.',
        ],
        sci: [
          'A ferramenta de abrasão de rochas (Honeybee Robotics) escova um alvo e depois desbasta um buraco com cerca de 45 mm de diâmetro e alguns milímetros de profundidade, tirando a poeira e a crosta alterada. O basalto solto de Meridiani, como a Bounce Rock (do tamanho de uma bola de futebol, sobretudo piroxena, atingida pelo módulo aos saltos), é cinzento-escuro por dentro.',
          'O MIMOS II (o grupo de Göstar Klingelhöfer, Mainz) move uma fonte de cobalto-57 para a frente e para trás a até cerca de 10 mm/s; o efeito Doppler afina os seus raios gama de 14,4 keV. Os núcleos de ferro-57 absorvem-nos e reemitem-nos só a energias fixadas pela carga e pela vizinhança do ferro: os silicatos de ferro(II) dão dupletos largos, o ferro(III) mais estreitos, a hematite e a magnetite, magnéticas, seis riscas. Um espetro levava cerca de 6 a 12 horas em Marte. Rudolf Mössbauer descobriu o efeito em 1958 (Prémio Nobel, 1961).',
        ],
      },
    },
    berries: {
      label: 'Os mirtilos',
      title: 'Mirtilos de hematite',
      dish: 'Lupa, dez vezes maior',
      zoom: 'A rocha da cratera, dez vezes maior',
      slider: 'Tempo',
      stages: ['Dunas de areia, há muito', 'A água ensopa a areia', 'Os mirtilos crescem', 'O vento desgasta a rocha', 'Hoje'],
      hints: {
        scoop: 'Toca nos mirtilos do chão',
        cut: 'Toca na lupa para abrir um ao meio',
        model: 'Toca no modelo para avançar na sua história',
        ledge: 'Toca na laje de rocha clara',
      },
      buttons: { scoop: 'Apanhar uma mão-cheia', cut: 'Abrir um ao meio', again: 'Apanhar outra mão-cheia', step: 'Avançar na história', ledge: 'Procurar jarosite' },
      says: {
        scoop: { kid: 'Uma mão-cheia de mirtilos! Na lupa estão dez vezes maiores. Cada um tem, na verdade, só alguns milímetros, é mais pequeno do que uma ervilha.', sci: 'Uma mão-cheia de esférulas, mostradas dez vezes maiores: na cratera Eagle têm em média cerca de 4 mm (mais ou menos de 3 a 6 mm).' },
        empty: { kid: 'A lupa está vazia. Apanha primeiro alguns mirtilos!', sci: 'Ainda nada no prato.' },
        cut: { kid: 'Aberto ao meio: cinzento e brilhante por dentro todo. É hematite, um óxido de ferro.', sci: 'Seccionada: hematite cinzenta de uma ponta à outra; o óxido de ferro é a maior parte de cada esférula.' },
        whole: { kid: 'Outra vez inteiro.', sci: 'Esférulas inteiras.' },
        stages: [
          { kid: 'Há muito, muito tempo: o vento junta a areia em dunas, camada sobre camada. A areia é salgada.', sci: 'Há mais de 3 mil milhões de anos: areia rica em sulfatos depositada pelo vento em dunas, em camadas finas e inclinadas.' },
          { kid: 'A água sobe e desce pela areia e cola-a em rocha. A água é ácida: azeda, como o vinagre.', sci: 'A água subterrânea sobe e desce pela areia e cimenta-a com sais. É ácida e cheia de sulfato, como mostra a jarosite.' },
          { kid: 'Na rocha molhada, o ferro junta-se em bolinhas cinzentas de hematite, cada vez maiores.', sci: 'Concreções: o ferro levado pela água subterrânea sai como hematite, a crescer para fora a partir de um centro, espalhadas pela rocha.' },
          { kid: 'Durante milhares de milhões de anos, o vento fustiga a rocha com areia e desgasta-a. Os mirtilos, duros, ficam e acabam pousados por cima.', sci: 'A erosão do vento, durante cerca de 3 mil milhões de anos, baixa o arenito mole; as esférulas, mais duras, soltam-se e juntam-se à superfície.' },
          { kid: 'Hoje: há mirtilos por toda a planície, e a poeira vermelha cobre tudo. Foi isto que o Opportunity encontrou!', sci: 'Hoje: esférulas soltas cobrem a planície debaixo de uma camada de poeira férrica, e o afloramento ainda as mostra metidas na rocha.' },
        ],
        ledge: { kid: 'A rocha clara tem jarosite, um mineral amarelado com ferro. Só se forma em água ácida, por isso esta rocha já esteve ensopada em água!', sci: 'Jarosite, KFe3(SO4)2(OH)6, encontrada neste afloramento pelo espetrómetro de Mössbauer em 2004: só se forma em água ácida e rica em sulfato.' },
        ledgeEarly: { kid: 'A rocha clara tem jarosite, que se forma em água ácida. No modelo a areia ainda está seca: avança no tempo para veres de onde vem.', sci: 'A jarosite, um mineral de sulfato ácido, está no afloramento. No modelo aparece quando chega a água subterrânea.' },
      },
      panel: {
        kid: [
          'O Opportunity encontrou a planície coberta de bolinhas cinzentas com alguns milímetros, a que os cientistas chamaram mirtilos. São feitas de hematite, um óxido de ferro. Algumas ainda estão dentro da rocha clara, outras estão soltas no chão.',
          'Na Terra, bolas assim crescem dentro de rochas ensopadas em água (há algumas nos desertos do Utah). Por isso, há muito tempo, houve aqui água a encharcar o chão. O modelo conta a história delas dez vezes maior: muda o tempo com o controlo deslizante, ou toca no modelo.',
        ],
        sci: [
          'As esférulas são concreções: hematite que saiu da água subterrânea dentro do arenito e que depois se soltou quando o vento desgastou a rocha. Na cratera Eagle têm em média cerca de 4 mm. Uma sonda em órbita tinha visto lá de cima o sinal da hematite, e foi por isso que o Opportunity foi enviado para Meridiani.',
          'O afloramento tem também jarosite, um sulfato de ferro com água e hidróxido que só se forma em água ácida, e algumas das suas camadas finas foram depositadas por água a correr. Juntas, dizem que Meridiani já esteve ensopada em água subterrânea ácida e salgada. Na Terra, concreções parecidas soltam-se do arenito Navajo, no Utah.',
        ],
      },
    },
    sky: {
      label: 'O relógio do céu',
      title: 'Fim de tarde em Marte',
      time: 'Hora de Marte',
      earth: 'Terra',
      slider: 'Hora do sol',
      parts: { noon: 'meio-dia', afternoon: 'tarde', sunset: 'pôr do sol', after: 'depois do pôr do sol', night: 'noite' },
      hints: {
        dial: 'Toca no relógio de sol para fazer avançar o Sol',
        sky: 'Toca no céu para veres um grão de poeira',
        earth: 'Toca no ponto brilhante por cima do pôr do sol',
        later: 'Toca no relógio de sol, até ao pôr do sol',
      },
      buttons: { later: 'Fazer avançar o Sol', lens: 'Mostrar o grão de poeira', lensOff: 'Esconder o grão de poeira', earth: 'Encontrar a Terra' },
      says: {
        noon: { kid: 'Meio-dia em Marte: o céu não é azul, é cor de caramelo claro, por causa da poeira vermelha no ar.', sci: 'Meio-dia: um céu cor de caramelo. A poeira de óxido de ferro absorve a luz azul e espalha as cores quentes por todo o céu.' },
        afternoon: { kid: 'O Sol está a ficar baixo. Olha como é pequeno!', sci: 'Tarde: o Sol, com cerca de dois terços da largura que tem visto da Terra, a descer a oeste.' },
        sunset: { kid: 'Pôr do sol! Olha: o céu à volta do Sol fica azul. Em Marte o pôr do sol é azul!', sci: 'Pôr do sol: um brilho azul à volta do Sol. A poeira fina espalha a luz azul para a frente, perto da direção do Sol, e o longo caminho através da poeira torna-o visível.' },
        after: { kid: 'O Sol já se pôs, mas o brilho azul continua. A poeira lá em cima ainda apanha a luz.', sci: 'Depois do pôr do sol: o crepúsculo marciano é longo, porque a luz do Sol ainda chega à poeira no alto da atmosfera.' },
        night: { kid: 'Noite em Marte, e aparecem as estrelas. Agora está muito, muito frio.', sci: 'Noite. O ar rarefeito guarda pouco calor: perto do equador pode descer abaixo de −70 °C antes do amanhecer.' },
        lens: { kid: 'Aqui está um grão de poeira de Marte, muito mais fino do que um cabelo. A luz do Sol chega; a luz azul segue quase a direito, a luz vermelha é atirada para todos os lados.', sci: 'Um grão de poeira com alguns micrómetros: a sua dispersão para a frente é mais estreita para a luz azul do que para a vermelha, por isso perto do Sol o céu parece azul.' },
        lensOff: { kid: 'O grão de poeira desapareceu.', sci: 'Lupa fechada.' },
        earth: { kid: 'Aquele ponto brilhante é a Terra, a nossa casa, a brilhar como estrela da tarde! Toda a gente que conheces está naquele ponto.', sci: 'A Terra, uma estrela da tarde a oeste depois do pôr do sol. O Curiosity fotografou-a, com a Lua, em 2014.' },
        noEarth: { kid: 'O céu ainda está claro demais para se ver a Terra. Espera pelo pôr do sol!', sci: 'Ainda claro demais: a Terra só aparece no crepúsculo depois do pôr do sol.' },
      },
      lens: { title: 'Um grão de poeira', sun: 'Sol', you: 'tu' },
      panel: {
        kid: [
          'Esta é uma cópia do relógio de sol que os robôs levavam, cinco vezes maior. A sua sombra diz a hora em Marte, e os anéis cinzentos e os cantos coloridos ajudavam as câmaras a acertar nas cores de Marte. Tem escrito, em inglês, «Two Worlds, One Sun»: dois mundos, um Sol.',
          'De dia, o céu de Marte é cor de caramelo, porque a poeira vermelha no ar absorve a luz azul. Mas ao pôr do sol o céu à volta do Sol fica azul: quando olhas para o Sol, os grãozinhos de poeira mandam-te a luz azul a direito.',
        ],
        sci: [
          'O MarsDial do Spirit e do Opportunity (cerca de 8 cm de lado; ideia de Bill Nye, feito com Woody Sullivan e Jim Bell) é o alvo de calibração da câmara panorâmica: anéis cinzentos e amostras de cor à volta de um pino cuja sombra diz a hora. O lema: «Two Worlds, One Sun» (dois mundos, um Sol). As horas aqui são hora solar local; uma hora de Marte é um 24.º de sol, cerca de 61,6 minutos.',
          'A poeira (grãos com alguns micrómetros) absorve a luz azul e espalha o vermelho e o laranja em todas as direções: um céu cor de caramelo. O seu pico de dispersão para a frente é mais estreito para o azul, por isso a luz azul fica mais perto da direção do Sol; com o Sol baixo e um longo caminho através da poeira, isto faz o brilho azul do pôr do sol. O Spirit fotografou-o em 2005, o Curiosity em 2015.',
        ],
      },
    },
    magnets: {
      label: 'Os ímanes do robô',
      title: 'Ímanes que apanham a poeira',
      labels: { capture: 'íman de captura', filter: 'íman filtro' },
      sol: 'sóis desde a aterragem',
      slider: 'Sóis desde a aterragem',
      count: 'sol {n}',
      hints: { tap: 'Toca nos ímanes para passarem sóis', full: 'Toca nos ímanes para os limpar e recomeçar' },
      buttons: { more: '60 sóis depois', clean: 'Limpá-los' },
      says: {
        clean: { kid: 'Ímanes limpos, como no dia da aterragem.', sci: 'Sol 0: superfícies dos ímanes limpas.' },
        few: { kid: 'O vento leva poeira por cima do robô, e alguma fica agarrada aos ímanes!', sci: 'Poeira do ar a pousar nos ímanes: os grãos magnéticos ficam.' },
        many: { kid: 'Cada vez mais: um anel de poeira no íman forte, menos no fraco. A poeira tem um pouco de magnetite, um mineral de ferro que os ímanes puxam.', sci: 'Um anel espesso no íman de captura; no íman filtro, mais fraco, só os grãos mais magnéticos. Os espetros mostraram magnetite.' },
      },
      panel: {
        kid: [
          'O Spirit e o Opportunity levavam ímanes na frente do convés, onde as câmaras os podiam ver. Com o passar dos sóis, a poeira levada pelo vento pousava neles, e os grãos magnéticos ficavam.',
          'Então a poeira de Marte é um bocadinho magnética: além do seu ferro enferrujado, tem grãozinhos de magnetite, um mineral de ferro que os ímanes puxam. Estes ímanes são cópias, maiores do que os verdadeiros.',
        ],
        sci: [
          'Cada robô levava no convés um íman de captura forte e um íman filtro mais fraco, um íman de varrimento e ímanes pequenos na ferramenta de abrasão. O íman filtro só segura as partículas mais magnéticas. A câmara panorâmica viu a poeira acumular-se; os espetrómetros de Mössbauer e de raios X mediram-na sobre os ímanes.',
          'Goetz e colegas (Nature, 2005) concluíram que o mineral magnético da poeira é a magnetite, com olivina ao lado. A olivina altera-se depressa em água líquida, por isso leram a poeira como sinal de longos períodos secos em Marte.',
        ],
      },
    },
  },
  pl: {
    title: 'Mars, obok krateru Eagle',
    greet: {
      kid: 'Jesteśmy w środku obrazka: na Marsie! To Meridiani Planum, równina, na której w 2004 roku wylądował łazik Opportunity, obok Eagle, małego krateru, do którego się wtoczył. Cała ta czerwień to zardzewiałe żelazo, takie jak ja. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Meridiani Planum na Marsie, obok krateru Eagle (22 m średnicy), gdzie Opportunity zatrzymał się 25 stycznia 2004 roku. Czerwień to tlenek żelaza(III) w pyle. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Opportunity miał pracować przez 90 marsjańskich dni. Działał ponad 14 lat i przejechał ponad 45 kilometrów!',
        'Dzień na Marsie nazywa się sol. Trwa 24 godziny i 39 minut, trochę dłużej niż nasz.',
        'Z Marsa Słońce wygląda na mniejsze, ma mniej więcej dwie trzecie tej szerokości co z Ziemi, bo Mars jest od niego dalej.',
        'Opportunity spadł, podskakując w kuli z poduszek powietrznych, i wtoczył się prosto do tego małego krateru. Naukowcy mówili, że trafił jak golfista: dołek za pierwszym uderzeniem!',
      ],
      sci: [
        'Opportunity wylądował 25 stycznia 2004 roku na misję zaplanowaną na 90 soli. Ostatni raz odezwał się 10 czerwca 2018 roku, podczas burzy pyłowej obejmującej całą planetę, po przejechaniu 45,16 km.',
        'Sol trwa 24 h 39 min 35 s. Mars krąży około 1,52 raza dalej od Słońca niż Ziemia, więc Słońce wygląda na mniej więcej dwie trzecie szerokości, a jego światło ma około 43 % siły.',
        'Lądownik podskakiwał po równinie w poduszkach powietrznych i wtoczył się do krateru Eagle o średnicy 22 m i głębokości około 3 m: „hole in one”, jak mówił zespół. Jego ściana odsłaniała warstwową skałę, która opowiadała o wodzie.',
        'Żelazo-57, atom, którego słucha spektrometr mössbauerowski, to tylko około 2 % naturalnego żelaza, ale to wystarcza.',
      ],
    },
    arm: {
      label: 'Ramię Opportunity',
      title: 'Ramię łazika i jego wykrywacz żelaza',
      screen: 'Spektrometr mössbauerowski',
      screenIdle: { kid: 'Dotknij skały, pyłu albo jagody', sci: 'Jeszcze brak widma: wybierz cel' },
      targets: { rock: 'Skała, przeszlifowana', dust: 'Czerwony pył', berry: 'Jagoda' },
      progress: 'zmierzono {n} %',
      complete: 'gotowe',
      axis: 'prędkość źródła (mm/s)',
      hints: {
        busy: 'Patrz na ramię',
        measuring: 'Patrz, jak rośnie widmo',
        brush: 'Dotknij skały, żeby zmieść z niej pył',
        grind: 'Dotknij skały jeszcze raz, żeby wyszlifować dziurę',
        rock: 'Dotknij skały, żeby zmierzyć jej żelazo',
        dust: 'Dotknij czerwonego pyłu, żeby zmierzyć jego żelazo',
        berry: 'Dotknij jagody, żeby zmierzyć jej żelazo',
        again: 'Dotknij skały, pyłu albo jagody, żeby porównać',
      },
      buttons: { brush: 'Omieć skałę', grind: 'Wyszlifuj dziurę', rock: 'Zmierz skałę', dust: 'Zmierz pył', berry: 'Zmierz jagodę', fresh: 'Nowa, zakurzona skała' },
      says: {
        fresh: { kid: 'Nowa skała, jeszcze pokryta czerwonym pyłem.', sci: 'Nowy cel: skała pokryta pyłem.' },
        brush: { kid: 'Ramię opuszcza szlifierkę. Najpierw mała szczotka zmiata pył.', sci: 'Narzędzie do ścierania skał: najpierw zmiata pył.' },
        brushed: { kid: 'Pod czerwonym pyłem skała jest dużo ciemniejsza. Czerwień jest tylko na wierzchu!', sci: 'Omiecione: ciemna powierzchnia pod warstwą pyłu z tlenkami żelaza(III).' },
        grind: { kid: 'Teraz szlifierka się kręci i wcina w skałę.', sci: 'Szlifowanie: tarcza z diamentami wycina okrągłą dziurę o średnicy około 45 mm.' },
        ground: { kid: 'Okrągła dziura, a w środku skała jest ciemnoszara. Jej żelazo nigdy nie zardzewiało.', sci: 'Świeża powierzchnia kilka milimetrów w głąb: ciemnoszary, niezwietrzały bazalt.' },
        measure: {
          rock: { kid: 'Wykrywacz żelaza siada w dziurze i słucha żelaza w środku.', sci: 'Spektrometr mössbauerowski na przeszlifowanej powierzchni: zliczanie.' },
          dust: { kid: 'Wykrywacz żelaza siada na czerwonym pyle.', sci: 'Spektrometr mössbauerowski na zaspie pyłu: zliczanie.' },
          berry: { kid: 'Wykrywacz żelaza siada na jagodach.', sci: 'Spektrometr mössbauerowski na kuleczkach: zliczanie.' },
        },
        result: {
          rock: { kid: 'Piroksen i oliwin: żelazo, które nigdy nie spotkało dość tlenu, żeby zardzewieć. Dlatego skała jest w środku szara.', sci: 'Dwa dublety żelaza(II), w piroksenie i oliwinie, jak w bazalcie: żelazo nie utleniło się do żelaza(III).' },
          dust: { kid: 'W pyle żelazo zardzewiało: drobny czerwony tlenek żelaza, z okruchami dawnej skały i odrobiną magnetytu.', sci: 'Głównie dublet drobnoziarnistego tlenku żelaza(III), z oliwinem, piroksenem i sześcioma liniami magnetytu.' },
          berry: { kid: 'Sześć linii! To hematyt, tlenek żelaza jak rdza, ale wyrosły w szare kryształy.', sci: 'Sześć linii, pole magnetyczne przy jądrze bliskie 52 T: hematyt, Fe2O3.' },
        },
      },
      minerals: { pyroxene: 'piroksen', olivine: 'oliwin', npox: 'drobny tlenek żelaza', magnetite: 'magnetyt', hematite: 'hematyt' },
      lens: { title: 'Atomy żelaza łapią promienie', source: 'kobalt-57', speed: 'prędkość źródła' },
      panel: {
        kid: [
          'Opportunity miał narzędzia na końcu ramienia. Jedno to szlifierka: zmiata pył ze skały, a potem wycina w niej okrągłą dziurę, żeby naukowcy zobaczyli, jaka skała jest naprawdę w środku. Pod czerwonym pyłem skały są tu ciemnoszare.',
          'Drugie to wykrywacz żelaza, spektrometr mössbauerowski. Maleńkie źródło strzela w skałę niewidzialnymi promieniami i przy tym kołysze się w przód i w tył. Atomy żelaza łapią promienie tylko wtedy, gdy kołysanie ma akurat właściwą prędkość, a każdy minerał żelaza ma swoje prędkości, jak własną piosenkę. Na Marsie jeden pomiar trwał godzinami; tutaj jest przyspieszony.',
        ],
        sci: [
          'Narzędzie do ścierania skał (Honeybee Robotics) omiata cel, a potem szlifuje dziurę o średnicy około 45 mm i głębokości kilku milimetrów, usuwając pył i zwietrzałą skorupę. Luźny bazalt z Meridiani, taki jak Bounce Rock (wielkości piłki, głównie piroksen, uderzony przez podskakujący lądownik), jest w środku ciemnoszary.',
          'MIMOS II (grupa Göstara Klingelhöfera, Moguncja) porusza źródłem kobaltu-57 w przód i w tył z prędkością do około 10 mm/s; efekt Dopplera dostraja jego promienie gamma o energii 14,4 keV. Jądra żelaza-57 pochłaniają je i wysyłają ponownie tylko przy energiach zależnych od ładunku i otoczenia żelaza: krzemiany żelaza(II) dają szerokie dublety, żelazo(III) węższe, magnetyczne hematyt i magnetyt sześć linii. Widmo trwało na Marsie około 6 do 12 godzin. Rudolf Mössbauer odkrył to zjawisko w 1958 roku (Nagroda Nobla, 1961).',
        ],
      },
    },
    berries: {
      label: 'Jagody',
      title: 'Jagody z hematytu',
      dish: 'Lupa, dziesięć razy większe',
      zoom: 'Skała krateru, dziesięć razy większa',
      slider: 'Czas',
      stages: ['Wydmy piasku, dawno temu', 'Woda nasącza piasek', 'Jagody rosną', 'Wiatr ściera skałę', 'Dziś'],
      hints: {
        scoop: 'Dotknij jagód na ziemi',
        cut: 'Dotknij lupy, żeby przeciąć jedną',
        model: 'Dotknij modelu, żeby przejść przez jego historię',
        ledge: 'Dotknij jasnej półki skalnej',
      },
      buttons: { scoop: 'Weź garść', cut: 'Przetnij jedną', again: 'Weź nową garść', step: 'Dalej w historii', ledge: 'Szukaj jarosytu' },
      says: {
        scoop: { kid: 'Garść jagód! W lupie są dziesięć razy większe. Naprawdę każda ma tylko kilka milimetrów, jest mniejsza od ziarnka grochu.', sci: 'Garść kuleczek, pokazanych dziesięć razy większych: w kraterze Eagle mają średnio około 4 mm (mniej więcej od 3 do 6 mm).' },
        empty: { kid: 'Lupa jest pusta. Najpierw weź trochę jagód!', sci: 'Na szalce jeszcze nic nie ma.' },
        cut: { kid: 'Przecięta na pół: szara i błyszcząca na wskroś. To hematyt, tlenek żelaza.', sci: 'Przekrój: szary hematyt na wskroś; tlenek żelaza stanowi większość każdej kuleczki.' },
        whole: { kid: 'Znowu cała.', sci: 'Całe kuleczki.' },
        stages: [
          { kid: 'Dawno, dawno temu: wiatr usypuje piasek w wydmy, warstwa po warstwie. Piasek jest słony.', sci: 'Ponad 3 miliardy lat temu: bogaty w siarczany piasek usypany przez wiatr w wydmy, w cienkich, skośnych warstwach.' },
          { kid: 'Woda wsiąka w piasek w górę i w dół i skleja go w skałę. Woda jest kwaśna, jak ocet.', sci: 'Wody gruntowe podnoszą się i opadają w piasku i cementują go solami. Są kwaśne i pełne siarczanów, co pokazuje jarosyt.' },
          { kid: 'W mokrej skale żelazo zbiera się w małe szare kuleczki hematytu, coraz większe.', sci: 'Konkrecje: żelazo niesione przez wody gruntowe wytrąca się jako hematyt, rosnący od środka na zewnątrz, rozsiany w skale.' },
          { kid: 'Przez miliardy lat wiatr smaga skałę piaskiem i ją ściera. Twarde jagody zostają i w końcu leżą na wierzchu.', sci: 'Erozja wietrzna przez około 3 miliardy lat obniża miękki piaskowiec; twardsze kuleczki wypadają i zbierają się na powierzchni.' },
          { kid: 'Dziś: jagody leżą na całej równinie, a czerwony pył pokrywa wszystko. To właśnie znalazł Opportunity!', sci: 'Dziś: luźne kuleczki pokrywają równinę pod warstwą pyłu z tlenkami żelaza(III), a odsłonięta skała wciąż pokazuje je osadzone w środku.' },
        ],
        ledge: { kid: 'Jasna skała zawiera jarosyt, żółtawy minerał z żelazem. Powstaje tylko w kwaśnej wodzie, więc ta skała była kiedyś nasiąknięta wodą!', sci: 'Jarosyt, KFe3(SO4)2(OH)6, znaleziony w tej skale przez spektrometr mössbauerowski w 2004 roku: powstaje tylko w kwaśnej wodzie bogatej w siarczany.' },
        ledgeEarly: { kid: 'Jasna skała zawiera jarosyt, który powstaje w kwaśnej wodzie. W modelu piasek jest jeszcze suchy: przesuń czas, żeby zobaczyć, skąd się bierze.', sci: 'Jarosyt, kwaśny minerał siarczanowy, jest w odsłoniętej skale. W modelu pojawia się, gdy przychodzą wody gruntowe.' },
      },
      panel: {
        kid: [
          'Opportunity znalazł równinę pokrytą małymi szarymi kuleczkami o średnicy kilku milimetrów, które naukowcy nazwali jagodami. Są z hematytu, tlenku żelaza. Niektóre wciąż tkwią w jasnej skale, inne leżą luzem na ziemi.',
          'Na Ziemi takie kulki rosną w skałach nasiąkniętych wodą (są takie na pustyniach Utah). Więc dawno temu była tu woda, która przesiąkała przez grunt. Model opowiada ich historię dziesięć razy większą: przesuń czas suwakiem albo dotknij modelu.',
        ],
        sci: [
          'Kuleczki to konkrecje: hematyt wytrącony z wód gruntowych w piaskowcu, który potem wypadł ze skały, gdy wiatr ją ścierał. W kraterze Eagle mają średnio około 4 mm. Sonda z orbity zobaczyła tu z góry ślad hematytu i dlatego Opportunity wysłano na Meridiani.',
          'Skała zawiera też jarosyt, siarczan żelaza z wodą i grupami wodorotlenkowymi, który powstaje tylko w kwaśnej wodzie, a niektóre jej cienkie warstwy osadziła płynąca woda. Razem mówią, że Meridiani była kiedyś nasiąknięta kwaśnymi, słonymi wodami gruntowymi. Na Ziemi podobne konkrecje wypadają z piaskowca Navajo w Utah.',
        ],
      },
    },
    sky: {
      label: 'Zegar nieba',
      title: 'Wieczór na Marsie',
      time: 'Czas Marsa',
      earth: 'Ziemia',
      slider: 'Pora sola',
      parts: { noon: 'południe', afternoon: 'popołudnie', sunset: 'zachód słońca', after: 'po zachodzie', night: 'noc' },
      hints: {
        dial: 'Dotknij zegara słonecznego, żeby przesunąć Słońce',
        sky: 'Dotknij nieba, żeby zobaczyć drobinę pyłu',
        earth: 'Dotknij jasnego punktu nad zachodem słońca',
        later: 'Dotknij zegara słonecznego, dalej ku zachodowi',
      },
      buttons: { later: 'Przesuń Słońce', lens: 'Pokaż drobinę pyłu', lensOff: 'Schowaj drobinę pyłu', earth: 'Znajdź Ziemię' },
      says: {
        noon: { kid: 'Południe na Marsie: niebo nie jest niebieskie, tylko jasnokarmelowe, przez czerwony pył w powietrzu.', sci: 'Południe: karmelowe niebo. Pył z tlenków żelaza pochłania niebieskie światło i rozprasza cieplejsze barwy po całym niebie.' },
        afternoon: { kid: 'Słońce schodzi coraz niżej. Zobacz, jakie jest małe!', sci: 'Popołudnie: Słońce, mniej więcej dwie trzecie tej szerokości co z Ziemi, zniża się na zachodzie.' },
        sunset: { kid: 'Zachód słońca! Zobacz: niebo wokół Słońca robi się niebieskie. Na Marsie zachody są niebieskie!', sci: 'Zachód: niebieska poświata wokół Słońca. Drobny pył rozprasza niebieskie światło do przodu, blisko kierunku Słońca, a długa droga przez pył sprawia, że to widać.' },
        after: { kid: 'Słońce zaszło, ale niebieska poświata trwa. Pył wysoko w górze wciąż łapie światło.', sci: 'Po zachodzie: marsjański zmierzch trwa długo, bo światło Słońca wciąż dociera do pyłu wysoko w atmosferze.' },
        night: { kid: 'Noc na Marsie i wychodzą gwiazdy. Teraz jest bardzo, bardzo zimno.', sci: 'Noc. Rzadkie powietrze słabo trzyma ciepło: przy równiku przed świtem może spaść poniżej −70 °C.' },
        lens: { kid: 'To drobina marsjańskiego pyłu, dużo cieńsza od włosa. Światło Słońca wpada; niebieskie leci prawie prosto dalej, czerwone jest rzucane na wszystkie strony.', sci: 'Ziarno pyłu o średnicy kilku mikrometrów: rozpraszanie do przodu jest węższe dla światła niebieskiego niż dla czerwonego, więc blisko Słońca niebo wygląda na niebieskie.' },
        lensOff: { kid: 'Drobina pyłu zniknęła.', sci: 'Lupa zamknięta.' },
        earth: { kid: 'Ten jasny punkt to Ziemia, nasz dom, świecąca jak gwiazda wieczorna! Wszyscy, których znasz, są na tym punkcie.', sci: 'Ziemia, gwiazda wieczorna na zachodzie po zachodzie Słońca. Curiosity sfotografował ją razem z Księżycem w 2014 roku.' },
        noEarth: { kid: 'Niebo jest jeszcze za jasne, żeby zobaczyć Ziemię. Poczekaj do zachodu słońca!', sci: 'Jeszcze za jasno: Ziemię widać dopiero w zmierzchu po zachodzie Słońca.' },
      },
      lens: { title: 'Drobina pyłu', sun: 'Słońce', you: 'ty' },
      panel: {
        kid: [
          'To kopia zegara słonecznego, który wiozły łaziki, pięć razy większa. Jego cień pokazuje godzinę na Marsie, a szare pierścienie i kolorowe rogi pomagały kamerom oddać prawdziwe kolory Marsa. Jest na nim napis po angielsku „Two Worlds, One Sun”: dwa światy, jedno Słońce.',
          'W dzień marsjańskie niebo jest karmelowe, bo czerwony pył w powietrzu pochłania niebieskie światło. Ale o zachodzie niebo wokół Słońca robi się niebieskie: kiedy patrzysz w stronę Słońca, drobinki pyłu wysyłają niebieskie światło prosto do ciebie.',
        ],
        sci: [
          'MarsDial na Spiricie i Opportunity (około 8 cm boku; pomysł Billa Nye’a, wykonany z Woodym Sullivanem i Jimem Bellem) to wzorzec kalibracyjny kamery panoramicznej: szare pierścienie i pola barwne wokół trzpienia, którego cień pokazuje godzinę. Motto: „Two Worlds, One Sun” (dwa światy, jedno Słońce). Godziny są tu lokalnym czasem słonecznym; marsjańska godzina to 1/24 sola, około 61,6 minuty.',
          'Pył (ziarna o średnicy kilku mikrometrów) pochłania niebieskie światło i szeroko rozprasza czerwień i pomarańcz: karmelowe niebo. Jego szczyt rozpraszania do przodu jest węższy dla niebieskiego, więc niebieskie światło zostaje bliżej kierunku Słońca; nisko nad horyzontem, przy długiej drodze przez pył, daje to niebieską poświatę zachodu. Spirit sfotografował ją w 2005 roku, Curiosity w 2015.',
        ],
      },
    },
    magnets: {
      label: 'Magnesy łazika',
      title: 'Magnesy, które łapią pył',
      labels: { capture: 'magnes chwytający', filter: 'magnes filtrujący' },
      sol: 'soli od lądowania',
      slider: 'Sole od lądowania',
      count: 'sol {n}',
      hints: { tap: 'Dotknij magnesów, żeby minęły sole', full: 'Dotknij magnesów, żeby je wyczyścić i zacząć od nowa' },
      buttons: { more: '60 soli później', clean: 'Wyczyść je' },
      says: {
        clean: { kid: 'Czyste magnesy, jak w dniu lądowania.', sci: 'Sol 0: czyste powierzchnie magnesów.' },
        few: { kid: 'Wiatr niesie pył nad łazikiem i trochę przylepia się do magnesów!', sci: 'Pył z powietrza osiada na magnesach: zostają magnetyczne ziarna.' },
        many: { kid: 'Coraz więcej: pierścień pyłu na silnym magnesie, mniej na słabym. Pył zawiera trochę magnetytu, minerału żelaza, który przyciąga magnes.', sci: 'Gruby pierścień na magnesie chwytającym; na słabszym magnesie filtrującym tylko najbardziej magnetyczne ziarna. Widma pokazały magnetyt.' },
      },
      panel: {
        kid: [
          'Spirit i Opportunity wiozły magnesy z przodu swoich pokładów, tam gdzie widziały je kamery. Z każdym solem pył niesiony wiatrem osiadał na nich, a magnetyczne ziarna zostawały.',
          'Czyli marsjański pył jest trochę magnetyczny: oprócz zardzewiałego żelaza zawiera maleńkie ziarenka magnetytu, minerału żelaza, który przyciąga magnes. Te magnesy to kopie, większe od prawdziwych.',
        ],
        sci: [
          'Każdy łazik miał na pokładzie silny magnes chwytający i słabszy magnes filtrujący, magnes omiatany oraz małe magnesy w narzędziu do ścierania skał. Magnes filtrujący trzyma tylko najsilniej magnetyczne cząstki. Kamera panoramiczna obserwowała narastanie pyłu; spektrometry mössbauerowski i rentgenowski zmierzyły go na magnesach.',
          'Goetz i współpracownicy (Nature, 2005) ustalili, że magnetycznym minerałem pyłu jest magnetyt, a obok niego oliwin. Oliwin szybko wietrzeje w ciekłej wodzie, więc odczytali pył jako znak długich, suchych okresów na Marsie.',
        ],
      },
    },
  },
  de: {
    title: 'Mars, am Krater Eagle',
    greet: {
      kid: 'Wir sind im Bild: auf dem Mars! Das ist Meridiani Planum, die Ebene, auf der der Rover Opportunity 2004 gelandet ist, neben Eagle, dem kleinen Krater, in den er hineinrollte. Das ganze Rot hier ist rostiges Eisen, so wie ich. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Meridiani Planum auf dem Mars, am Krater Eagle (22 m Durchmesser), wo Opportunity am 25. Januar 2004 zur Ruhe kam. Das Rot ist Eisen(III)-oxid im Staub. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Opportunity sollte 90 Marstage arbeiten. Er hielt mehr als 14 Jahre durch und fuhr über 45 Kilometer!',
        'Ein Tag auf dem Mars heißt Sol. Er dauert 24 Stunden und 39 Minuten, ein bisschen länger als unserer.',
        'Vom Mars aus sieht die Sonne kleiner aus, etwa zwei Drittel so breit wie von der Erde, weil der Mars weiter von ihr weg ist.',
        'Opportunity hüpfte in einem Ball aus Airbags herunter und rollte genau in diesen kleinen Krater. Die Forscher nannten das ein Hole-in-one, wie beim Golf!',
      ],
      sci: [
        'Opportunity landete am 25. Januar 2004 für eine Mission, die 90 Sols dauern sollte. Zuletzt meldete er sich am 10. Juni 2018, während eines Staubsturms über den ganzen Planeten, nach 45,16 km Fahrt.',
        'Ein Sol dauert 24 h 39 min 35 s. Der Mars kreist etwa 1,52-mal so weit von der Sonne wie die Erde, deshalb wirkt die Sonne etwa zwei Drittel so breit, und ihr Licht hat etwa 43 % der Stärke.',
        'Der Lander hüpfte in seinen Airbags über die Ebene und rollte in den Krater Eagle, 22 m breit und etwa 3 m tief: ein Hole-in-one, sagte das Team. Seine Wand zeigte geschichtetes Grundgestein, das von Wasser erzählte.',
        'Eisen-57, das Atom, auf das das Mößbauer-Spektrometer hört, macht nur etwa 2 % des natürlichen Eisens aus, aber das genügt.',
      ],
    },
    arm: {
      label: 'Der Arm von Opportunity',
      title: 'Der Arm des Rovers und sein Eisendetektor',
      screen: 'Mößbauer-Spektrometer',
      screenIdle: { kid: 'Tippe auf den Stein, den Staub oder eine Blaubeere', sci: 'Noch kein Spektrum: Wähle ein Ziel' },
      targets: { rock: 'Der Stein, angeschliffen', dust: 'Der rote Staub', berry: 'Eine Blaubeere' },
      progress: '{n} % gemessen',
      complete: 'fertig',
      axis: 'Geschwindigkeit der Quelle (mm/s)',
      hints: {
        busy: 'Schau dem Arm zu',
        measuring: 'Schau, wie das Spektrum wächst',
        brush: 'Tippe auf den Stein, um den Staub abzubürsten',
        grind: 'Tippe noch einmal auf den Stein, um ein Loch zu schleifen',
        rock: 'Tippe auf den Stein, um sein Eisen zu messen',
        dust: 'Tippe auf den roten Staub, um sein Eisen zu messen',
        berry: 'Tippe auf eine Blaubeere, um ihr Eisen zu messen',
        again: 'Tippe auf den Stein, den Staub oder eine Blaubeere zum Vergleichen',
      },
      buttons: { brush: 'Den Stein abbürsten', grind: 'Ein Loch schleifen', rock: 'Den Stein messen', dust: 'Den Staub messen', berry: 'Eine Blaubeere messen', fresh: 'Ein neuer, staubiger Stein' },
      says: {
        fresh: { kid: 'Ein neuer Stein, noch voller rotem Staub.', sci: 'Neues Ziel: ein staubbedeckter Stein.' },
        brush: { kid: 'Der Arm senkt seinen Schleifer. Zuerst fegt eine kleine Bürste den Staub weg.', sci: 'Gesteinsschleifer: zuerst den Staub abbürsten.' },
        brushed: { kid: 'Unter dem roten Staub ist der Stein viel dunkler. Das Rot ist nur außen!', sci: 'Abgebürstet: eine dunkle Oberfläche unter der Schicht aus eisenhaltigem Staub.' },
        grind: { kid: 'Jetzt dreht sich der Schleifer und schneidet in den Stein.', sci: 'Schleifen: Ein diamantbesetztes Rad schneidet ein rundes Loch von etwa 45 mm Durchmesser.' },
        ground: { kid: 'Ein rundes Loch, und innen ist der Stein dunkelgrau. Sein Eisen ist nie gerostet.', sci: 'Eine frische Fläche wenige Millimeter tief: dunkelgrauer, unverwitterter Basalt.' },
        measure: {
          rock: { kid: 'Der Eisendetektor setzt sich ins Loch und hört dem Eisen darin zu.', sci: 'Mößbauer-Spektrometer auf der angeschliffenen Fläche: Zählung läuft.' },
          dust: { kid: 'Der Eisendetektor setzt sich auf den roten Staub.', sci: 'Mößbauer-Spektrometer auf der Staubwehe: Zählung läuft.' },
          berry: { kid: 'Der Eisendetektor setzt sich auf die Blaubeeren.', sci: 'Mößbauer-Spektrometer auf den Kügelchen: Zählung läuft.' },
        },
        result: {
          rock: { kid: 'Pyroxen und Olivin: Eisen, das nie genug Sauerstoff getroffen hat, um zu rosten. Darum ist der Stein innen grau.', sci: 'Zwei Dubletts von Eisen(II), in Pyroxen und Olivin, wie im Basalt: Das Eisen ist nicht zu Eisen(III) oxidiert.' },
          dust: { kid: 'Im Staub ist das Eisen gerostet: feines rotes Eisenoxid, mit Krümeln vom alten Gestein und etwas Magnetit.', sci: 'Vor allem das Dublett eines feinkörnigen Eisen(III)-oxids, dazu Olivin, Pyroxen und die sechs Linien des Magnetits.' },
          berry: { kid: 'Sechs Linien! Das ist Hämatit, ein Eisenoxid wie Rost, aber zu grauen Kristallen gewachsen.', sci: 'Sechs Linien, ein Magnetfeld am Kern nahe 52 T: Hämatit, Fe2O3.' },
        },
      },
      minerals: { pyroxene: 'Pyroxen', olivine: 'Olivin', npox: 'feines Eisenoxid', magnetite: 'Magnetit', hematite: 'Hämatit' },
      lens: { title: 'Eisenatome fangen Strahlen', source: 'Cobalt-57', speed: 'Geschwindigkeit der Quelle' },
      panel: {
        kid: [
          'Opportunity trug seine Werkzeuge am Ende eines Arms. Eines ist ein Schleifer: Er bürstet den Staub von einem Stein und schneidet dann ein rundes Loch hinein, damit die Forscher sehen, wie der Stein innen wirklich ist. Unter dem roten Staub sind die Steine hier dunkelgrau.',
          'Ein anderes ist ein Eisendetektor, das Mößbauer-Spektrometer. Eine winzige Quelle schießt unsichtbare Strahlen auf den Stein und schwingt dabei hin und her. Eisenatome fangen die Strahlen nur, wenn das Schwingen genau die richtige Geschwindigkeit hat, und jedes Eisenmineral hat seine eigenen Geschwindigkeiten, wie ein eigenes Lied. Auf dem Mars dauerte eine Messung Stunden; hier geht es schneller.',
        ],
        sci: [
          'Der Gesteinsschleifer (Rock Abrasion Tool, Honeybee Robotics) bürstet ein Ziel ab und schleift dann ein Loch von etwa 45 mm Durchmesser und wenigen Millimetern Tiefe, das den Staub und die verwitterte Kruste entfernt. Der lose Basalt von Meridiani, etwa Bounce Rock (so groß wie ein Fußball, vor allem Pyroxen, vom hüpfenden Lander getroffen), ist innen dunkelgrau.',
          'MIMOS II (die Gruppe von Göstar Klingelhöfer, Mainz) bewegt eine Quelle aus Cobalt-57 mit bis zu etwa 10 mm/s hin und her; der Doppler-Effekt stimmt ihre Gammastrahlen von 14,4 keV ab. Kerne von Eisen-57 absorbieren und senden sie nur bei Energien wieder aus, die von der Ladung und der Umgebung des Eisens abhängen: Eisen(II)-Silikate geben breite Dubletts, Eisen(III) schmalere, die magnetischen Minerale Hämatit und Magnetit sechs Linien. Ein Spektrum dauerte auf dem Mars etwa 6 bis 12 Stunden. Rudolf Mößbauer entdeckte den Effekt 1958 (Nobelpreis 1961).',
        ],
      },
    },
    berries: {
      label: 'Die Blaubeeren',
      title: 'Blaubeeren aus Hämatit',
      dish: 'Lupe, zehnmal größer',
      zoom: 'Das Gestein des Kraters, zehnmal größer',
      slider: 'Zeit',
      stages: ['Sanddünen, vor langer Zeit', 'Wasser tränkt den Sand', 'Blaubeeren wachsen', 'Der Wind trägt es ab', 'Heute'],
      hints: {
        scoop: 'Tippe auf die Blaubeeren am Boden',
        cut: 'Tippe auf die Lupe, um eine aufzuschneiden',
        model: 'Tippe auf das Modell, um seine Geschichte weiterzuschalten',
        ledge: 'Tippe auf die helle Felsbank',
      },
      buttons: { scoop: 'Eine Handvoll aufheben', cut: 'Eine aufschneiden', again: 'Eine neue Handvoll aufheben', step: 'Die Geschichte weiterschalten', ledge: 'Nach Jarosit suchen' },
      says: {
        scoop: { kid: 'Eine Handvoll Blaubeeren! In der Lupe sind sie zehnmal größer. In Wirklichkeit ist jede nur ein paar Millimeter groß, kleiner als eine Erbse.', sci: 'Eine Handvoll Kügelchen, zehnmal vergrößert: Am Krater Eagle sind sie im Mittel etwa 4 mm groß (ungefähr 3 bis 6 mm).' },
        empty: { kid: 'Die Lupe ist leer. Heb erst ein paar Blaubeeren auf!', sci: 'Noch nichts in der Schale.' },
        cut: { kid: 'In zwei Hälften: grau und glänzend bis ganz innen. Das ist Hämatit, ein Eisenoxid.', sci: 'Aufgeschnitten: durch und durch grauer Hämatit; Eisenoxid macht den größten Teil jedes Kügelchens aus.' },
        whole: { kid: 'Wieder eine ganze.', sci: 'Ganze Kügelchen.' },
        stages: [
          { kid: 'Vor langer, langer Zeit: Der Wind häuft Sand zu Dünen auf, Schicht um Schicht. Der Sand ist salzig.', sci: 'Vor mehr als 3 Milliarden Jahren: sulfatreicher Sand, vom Wind zu Dünen aufgeweht, in dünnen, schrägen Schichten.' },
          { kid: 'Wasser sickert im Sand auf und ab und klebt ihn zu Stein. Das Wasser ist sauer, wie Essig.', sci: 'Grundwasser steigt und sinkt im Sand und verkittet ihn mit Salzen. Es ist sauer und voller Sulfat, wie der Jarosit zeigt.' },
          { kid: 'Im nassen Stein sammelt sich Eisen zu kleinen grauen Kugeln aus Hämatit, die immer größer werden.', sci: 'Konkretionen: Im Grundwasser gelöstes Eisen fällt als Hämatit aus, wächst von einem Kern nach außen, im Gestein verstreut.' },
          { kid: 'Milliarden Jahre lang schleift der Wind den Stein mit Sand ab. Die harten Blaubeeren bleiben übrig und liegen am Ende obendrauf.', sci: 'Winderosion trägt in etwa 3 Milliarden Jahren den weichen Sandstein ab; die härteren Kügelchen wittern heraus und sammeln sich an der Oberfläche.' },
          { kid: 'Heute: Überall auf der Ebene liegen Blaubeeren, und roter Staub bedeckt alles. Genau das hat Opportunity gefunden!', sci: 'Heute: Lose Kügelchen bedecken die Ebene unter einer Schicht aus eisenhaltigem Staub, und der Aufschluss zeigt sie noch im Gestein.' },
        ],
        ledge: { kid: 'Der helle Stein enthält Jarosit, ein gelbliches Mineral mit Eisen. Es entsteht nur in saurem Wasser, also war dieser Stein einmal von Wasser durchtränkt!', sci: 'Jarosit, KFe3(SO4)2(OH)6, 2004 vom Mößbauer-Spektrometer in diesem Aufschluss gefunden: Er bildet sich nur in saurem, sulfatreichem Wasser.' },
        ledgeEarly: { kid: 'Der helle Stein enthält Jarosit, das in saurem Wasser entsteht. Im Modell ist der Sand noch trocken: Schalte die Zeit weiter, um zu sehen, woher es kommt.', sci: 'Jarosit, ein saures Sulfatmineral, steckt im Aufschluss. Im Modell erscheint er, sobald das Grundwasser kommt.' },
      },
      panel: {
        kid: [
          'Opportunity fand die Ebene voller kleiner grauer Kugeln, ein paar Millimeter groß, die die Forscher Blaubeeren nannten. Sie bestehen aus Hämatit, einem Eisenoxid. Manche stecken noch im hellen Gestein, andere liegen lose am Boden.',
          'Auf der Erde wachsen solche Kugeln in Gestein, das von Wasser durchtränkt ist (es gibt welche in den Wüsten von Utah). Also gab es hier vor langer Zeit Wasser, das durch den Boden sickerte. Das Modell erzählt ihre Geschichte zehnmal größer: Verschieb die Zeit mit dem Regler oder tippe auf das Modell.',
        ],
        sci: [
          'Die Kügelchen sind Konkretionen: Hämatit, der im Sandstein aus dem Grundwasser ausfiel und herauswitterte, als der Wind das Gestein abtrug. Am Krater Eagle sind sie im Mittel etwa 4 mm groß. Eine Sonde in der Umlaufbahn hatte die Spur des Hämatits hier von oben gesehen; darum wurde Opportunity nach Meridiani geschickt.',
          'Der Aufschluss enthält auch Jarosit, ein Eisensulfat mit Wasser und Hydroxid, das sich nur in saurem Wasser bildet, und einige seiner feinen Schichten wurden von fließendem Wasser abgelagert. Zusammen sagen sie, dass Meridiani einst von saurem, salzigem Grundwasser durchtränkt war. Auf der Erde wittern ähnliche Konkretionen aus dem Navajo-Sandstein in Utah.',
        ],
      },
    },
    sky: {
      label: 'Die Himmelsuhr',
      title: 'Abend auf dem Mars',
      time: 'Marszeit',
      earth: 'Erde',
      slider: 'Uhrzeit im Sol',
      parts: { noon: 'Mittag', afternoon: 'Nachmittag', sunset: 'Sonnenuntergang', after: 'nach Sonnenuntergang', night: 'Nacht' },
      hints: {
        dial: 'Tippe auf die Sonnenuhr, um die Sonne weiterzuschieben',
        sky: 'Tippe auf den Himmel, um ein Staubkorn zu sehen',
        earth: 'Tippe auf den hellen Punkt über dem Sonnenuntergang',
        later: 'Tippe auf die Sonnenuhr, weiter zum Sonnenuntergang',
      },
      buttons: { later: 'Die Sonne weiterschieben', lens: 'Das Staubkorn zeigen', lensOff: 'Das Staubkorn verbergen', earth: 'Die Erde finden' },
      says: {
        noon: { kid: 'Mittag auf dem Mars: Der Himmel ist nicht blau, sondern hell karamellfarben, wegen des roten Staubs in der Luft.', sci: 'Mittag: ein karamellfarbener Himmel. Der Eisenoxidstaub schluckt blaues Licht und verteilt die warmen Farben über den ganzen Himmel.' },
        afternoon: { kid: 'Die Sonne steht schon tief. Schau, wie klein sie ist!', sci: 'Nachmittag: Die Sonne, etwa zwei Drittel so breit wie von der Erde aus, sinkt im Westen.' },
        sunset: { kid: 'Sonnenuntergang! Schau: Der Himmel um die Sonne wird blau. Auf dem Mars sind Sonnenuntergänge blau!', sci: 'Sonnenuntergang: ein blauer Schein um die Sonne. Der feine Staub streut blaues Licht nach vorn, nahe der Richtung der Sonne, und der lange Weg durch den Staub macht es sichtbar.' },
        after: { kid: 'Die Sonne ist untergegangen, aber der blaue Schein bleibt. Der Staub hoch oben fängt noch Licht.', sci: 'Nach Sonnenuntergang: Die Marsdämmerung dauert lange, weil Sonnenlicht noch den Staub hoch in der Atmosphäre erreicht.' },
        night: { kid: 'Nacht auf dem Mars, und die Sterne kommen heraus. Jetzt ist es sehr, sehr kalt.', sci: 'Nacht. Die dünne Luft hält kaum Wärme: Nahe am Äquator kann es vor dem Morgen unter −70 °C fallen.' },
        lens: { kid: 'Hier ist ein Körnchen Marsstaub, viel dünner als ein Haar. Sonnenlicht kommt herein; blaues Licht fliegt fast geradeaus weiter, rotes wird in alle Richtungen geworfen.', sci: 'Ein Staubkorn von einigen Mikrometern: Seine Vorwärtsstreuung ist für blaues Licht schmaler als für rotes, darum wirkt der Himmel nahe der Sonne blau.' },
        lensOff: { kid: 'Das Staubkorn ist weg.', sci: 'Lupe geschlossen.' },
        earth: { kid: 'Der helle Punkt ist die Erde, unser Zuhause, als Abendstern! Alle, die du kennst, sind auf diesem Punkt.', sci: 'Die Erde, ein Abendstern im Westen nach Sonnenuntergang. Curiosity hat sie 2014 zusammen mit dem Mond fotografiert.' },
        noEarth: { kid: 'Der Himmel ist noch zu hell, um die Erde zu sehen. Warte bis nach Sonnenuntergang!', sci: 'Noch zu hell: Die Erde zeigt sich erst in der Dämmerung nach Sonnenuntergang.' },
      },
      lens: { title: 'Ein Staubkorn', sun: 'Sonne', you: 'du' },
      panel: {
        kid: [
          'Das ist eine Kopie der Sonnenuhr, die die Rover dabeihatten, fünfmal größer. Ihr Schatten zeigt die Uhrzeit auf dem Mars, und ihre grauen Ringe und bunten Ecken halfen den Kameras, die Farben des Mars richtig zu treffen. Auf ihr steht auf Englisch „Two Worlds, One Sun“: zwei Welten, eine Sonne.',
          'Am Tag ist der Marshimmel karamellfarben, weil der rote Staub in der Luft blaues Licht schluckt. Aber bei Sonnenuntergang wird der Himmel um die Sonne blau: Wenn du zur Sonne schaust, schicken dir die winzigen Staubkörner das blaue Licht geradeaus zu.',
        ],
        sci: [
          'Das MarsDial auf Spirit und Opportunity (etwa 8 cm im Quadrat; Bill Nyes Idee, gebaut mit Woody Sullivan und Jim Bell) ist das Kalibrierziel der Panoramakamera: graue Ringe und Farbfelder um einen Stab, dessen Schatten die Uhrzeit zeigt. Sein Motto: „Two Worlds, One Sun“ (zwei Welten, eine Sonne). Die Uhrzeiten hier sind wahre Ortszeit; eine Marsstunde ist ein 24stel Sol, etwa 61,6 Minuten.',
          'Der Staub (Körner von einigen Mikrometern) schluckt blaues Licht und streut Rot und Orange weit: ein karamellfarbener Himmel. Seine Vorwärtsstreuung ist für Blau schmaler, darum bleibt blaues Licht näher an der Richtung der Sonne; tief am Himmel, auf einem langen Weg durch den Staub, entsteht so der blaue Schein des Sonnenuntergangs. Spirit fotografierte ihn 2005, Curiosity 2015.',
        ],
      },
    },
    magnets: {
      label: 'Die Magnete des Rovers',
      title: 'Magnete, die den Staub fangen',
      labels: { capture: 'Fangmagnet', filter: 'Filtermagnet' },
      sol: 'Sols seit der Landung',
      slider: 'Sols seit der Landung',
      count: 'Sol {n}',
      hints: { tap: 'Tippe auf die Magnete, damit Sols vergehen', full: 'Tippe auf die Magnete, um sie zu säubern und neu anzufangen' },
      buttons: { more: '60 Sols später', clean: 'Säubern' },
      says: {
        clean: { kid: 'Saubere Magnete, wie am Tag der Landung.', sci: 'Sol 0: saubere Magnetflächen.' },
        few: { kid: 'Der Wind weht Staub über den Rover, und ein Teil bleibt an den Magneten hängen!', sci: 'Staub aus der Luft setzt sich auf die Magnete: Die magnetischen Körner bleiben.' },
        many: { kid: 'Immer mehr: ein Staubring auf dem starken Magneten, weniger auf dem schwachen. Der Staub enthält etwas Magnetit, ein Eisenmineral, das ein Magnet anzieht.', sci: 'Ein dicker Ring auf dem Fangmagneten; auf dem schwächeren Filtermagneten nur die magnetischsten Körner. Die Spektren zeigten Magnetit.' },
      },
      panel: {
        kid: [
          'Spirit und Opportunity hatten vorn auf ihrem Deck Magnete, wo ihre Kameras sie sehen konnten. Sol um Sol setzte sich der Staub aus dem Wind darauf, und die magnetischen Körner blieben hängen.',
          'Der Marsstaub ist also ein bisschen magnetisch: Neben seinem rostigen Eisen enthält er winzige Körner aus Magnetit, einem Eisenmineral, das ein Magnet anzieht. Diese Magnete sind Kopien, größer als die echten.',
        ],
        sci: [
          'Jeder Rover trug einen starken Fangmagneten und einen schwächeren Filtermagneten auf dem Deck, dazu einen Kehrmagneten und kleine Magnete im Gesteinsschleifer. Der Filtermagnet hält nur die am stärksten magnetischen Teilchen. Die Panoramakamera sah den Staub wachsen; das Mößbauer- und das Röntgenspektrometer maßen ihn auf den Magneten.',
          'Goetz und Kollegen (Nature, 2005) fanden, dass das magnetische Mineral des Staubs Magnetit ist, mit Olivin daneben. Olivin verwittert in flüssigem Wasser schnell, darum deuteten sie den Staub als Zeichen langer, trockener Zeiten auf dem Mars.',
        ],
      },
    },
  },
}
