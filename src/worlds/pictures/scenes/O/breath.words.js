// The words of oxygen's breath room ("Why do you breathe?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/O.js (the
// easel shows it); the room follows the oxygen from an air sac to a muscle's power stations.
// Signs drawn in 3D say "O2" in plain letters (the 3D fonts have no subscripts); the canvases draw real ones.
// Sources for the numbers: Ochs et al. 2004 (480 million alveoli); Weibel (the blood-air barrier, about
// 0.2 to 0.6 µm); Sender, Fuchs and Milo 2016 (about 25 of 30 trillion cells are red cells); Severinghaus
// 1979 (the saturation curve: 98% at 100 mmHg, 75% at 40, 32% at 20, P50 about 27 mmHg); West, Respiratory
// Physiology (0.75 s in the lung capillaries, loaded in the first third); Guyton and Hall (cardiac output,
// extraction up to about three quarters in hard exercise); about 30 ATP per glucose with oxygen, 2 without.
const EN = {
  title: 'The journey of a breath',
  greet: {
    kid: 'Hi! We are inside your body now, smaller than a cell. I\'m the oxygen you just breathed in! On the left is a tiny air sac in your lung, straight ahead your heart, on the right a muscle. Let\'s follow me.',
    sci: 'We are at the scale of cells: an alveolus on the left with a capillary wrapped round it, the heart ahead (not to scale), a skeletal muscle fibre on the right. Follow the O2 from the air to the mitochondria. The picture\'s story is on the easel.',
  },
  talk: {
    kid: [
      'Your blood is never blue! Red cells full of oxygen are bright red, and without it they are dark red. Veins only look blue through your skin.',
      'You have about 25 trillion red blood cells, more than all your other cells put together. Your body makes about two million new ones every second!',
      'At this size your real heart would be several kilometres tall. Here it is drawn much smaller, so it fits in the room.',
    ],
    sci: [
      'A red cell is a biconcave disc about 7.5 µm across and 2 µm thick, with no nucleus: about 270 million haemoglobin molecules fill it, room for about a billion O2.',
      'An adult has about 25 trillion red cells in about 5 L of blood, most of the body\'s roughly 30 trillion cells (Sender, Fuchs and Milo, 2016). Each lives about 120 days, so the bone marrow makes about 2 million a second.',
      'At rest the blood goes all the way round in about a minute: the heart pumps about 5 L/min at about 70 beats a minute, about 100,000 beats a day.',
    ],
  },
  sac: {
    label: 'The air sac',
    title: 'An air sac in your lung',
    hints: { breathe: 'Tap the airway to breathe in', low: 'Tap the airway, the air sac is running out of oxygen' },
    buttons: { breathe: 'Breathe in' },
    says: {
      breathe: {
        kid: 'Breathe in! Fresh air rushes down into the air sac. The red pairs are oxygen; watch them slip through the thin wall into the red cells.',
        sci: 'Inspiration: fresh air refills the alveolus (alveolar PO2 about 100 mmHg). O2 diffuses across the blood-air barrier, under a micrometre thick, into the capillary blood and onto haemoglobin.',
      },
      low: {
        kid: 'The air sac has given almost all its oxygen to the blood. Time for another breath!',
        sci: 'Alveolar O2 is running down (sped up here: holding your breath, it takes about a minute), so the red cells leave less saturated. Breathe.',
      },
    },
    panel: {
      kid: [
        'Your lungs are full of tiny air sacs, about 480 million of them, each smaller than a full stop. Spread out flat they would cover about the floor of a classroom. Their walls are as thin as a soap bubble, and tiny blood vessels are wrapped all round them.',
        'When you breathe in, fresh air fills the sacs. The oxygen slips through the thin wall into the blood, and the red cells carry it away. The oxygen in a sac is soon used up, so you breathe again, and again: about 20,000 times a day.',
      ],
      sci: [
        'About 480 million alveoli (Ochs et al., 2004), each about 0.2 mm across, give a gas-exchange surface of roughly 50 to 100 m². The blood-air barrier (an alveolar cell, a basement membrane and a capillary cell) is as thin as about 0.2 µm, so O2 crosses by diffusion alone, from about 100 mmHg in the alveolus into blood arriving at about 40 mmHg.',
        'At rest a red cell spends about 0.75 s in the lung capillaries and is loaded within about the first third of that, a reserve for exercise. A breath at rest moves about 0.5 L, and about 2.5 L stays in the lungs between breaths, so alveolar air changes gradually. Here the sac empties far faster, to show why breathing never stops.',
      ],
    },
  },
  blood: {
    label: 'Inside a red cell',
    title: 'Haemoglobin, the oxygen carrier',
    plate: 'Haemoglobin',
    slider: { kid: 'How much oxygen is around', sci: 'Oxygen partial pressure, PO2' },
    presets: { lung: 'In the lungs', rest: 'Resting muscle', work: 'Working muscle' },
    curve: {
      title: { kid: 'How full are the seats?', sci: 'Oxygen-haemoglobin dissociation curve' },
      x: { kid: 'more oxygen around', sci: 'PO2 (mmHg)' },
      y: { kid: 'seats full', sci: 'saturation' },
      lung: 'lungs',
      rest: 'resting muscle',
      work: 'working muscle',
      seats: 'seats full: {n} of 4',
    },
    hints: { look: 'Tap a red cell to look inside', again: 'Tap another red cell, or the curve' },
    buttons: { look: 'Look inside a red cell' },
    says: {
      look: {
        kid: 'Inside every red cell are millions of these: haemoglobin. It has four seats, each with an iron atom, and each seat holds one oxygen. Watch them fill as the cell passes the air sac!',
        sci: 'Haemoglobin: four globin chains (two α, two β), each with a haem whose Fe2+ binds one O2. As the cell passes the alveolus the saturation climbs to about 98% and the blood turns from dark to bright red.',
      },
      full: {
        kid: 'All four seats are full! Did you see? Once one oxygen sat down, the others came faster: the seats help each other.',
        sci: 'Cooperative binding: each O2 bound makes the next bind more easily (Hill coefficient about 2.8). That is what gives the curve its S shape.',
      },
      curve: {
        kid: 'Slide along the curve: where there is lots of oxygen the seats fill up, where there is little they let it go.',
        sci: 'Along the curve: the steep part between about 20 and 40 mmHg is where the tissues take their O2; the flat top keeps the blood nearly full in the lungs.',
      },
    },
    panel: {
      kid: [
        'Each red cell is packed with about 270 million haemoglobin molecules, and each one has four seats for oxygen, with an iron atom in every seat. That is why blood is red: the haem round the iron is bright red with oxygen and dark red without it.',
        'The seats help each other. Where there is lots of oxygen, in the lungs, they fill right up. In a resting muscle about three in four stay full, and in a muscle working hard most of them let go. Try the slider, or tap the curve!',
      ],
      sci: [
        'The curve is S-shaped because binding is cooperative: O2 binding shifts the tetramer from the tense (T) towards the relaxed (R) state, which holds O2 more tightly. At 100 mmHg, in the lungs, about 98% of the sites are full; at 40 mmHg, in resting tissue, about 75%; at 20 mmHg, in a working muscle, about 30%. Half saturation, P50, is about 27 mmHg (pH 7.4, 37 °C). Max Perutz solved haemoglobin\'s structure (Nobel Prize in Chemistry 1962).',
        'In a working muscle, warmth, acid and CO2 shift the curve to the right, so even more O2 lets go: the Bohr effect (Christian Bohr, Karl Hasselbalch and August Krogh, 1904). Each gram of haemoglobin carries up to 1.34 mL of O2, about 200 mL per litre of blood, more than 60 times what the plasma could dissolve.',
      ],
    },
  },
  ride: {
    label: 'Ride a red cell',
    title: 'From the lungs to a muscle',
    hints: { go: 'Tap the big red cell to ride it', riding: 'Hold on tight', wait: 'Wait for the next red cell' },
    buttons: { go: 'Ride the red cell' },
    map: {
      title: 'Where are you?',
      places: { vein: 'To the heart', atrium: 'Left atrium', valve: 'Mitral valve', ventricle: 'Left ventricle', aorta: 'Aorta', artery: 'Artery to the leg', muscle: 'Leg muscle' },
    },
    says: {
      go: {
        kid: 'Hold on tight! This red cell is full of oxygen, and we are riding it to a muscle.',
        sci: 'Oxygenated blood leaves the lung in the pulmonary veins for the heart\'s left side. The ride is slowed down: from lung to leg takes only seconds.',
      },
      atrium: {
        kid: 'We are in your heart! This is its left side, the side for blood full of oxygen. First a small room: the atrium.',
        sci: 'The left atrium collects the blood of the four pulmonary veins and passes it on through the mitral valve.',
      },
      valve: {
        kid: 'A door that opens only one way! Its strings stop it from flapping back.',
        sci: 'The mitral valve: two leaflets held by the chordae tendineae, so blood cannot flow back into the atrium.',
      },
      ventricle: {
        kid: 'The strongest room in your heart. Squeeze! Here we go!',
        sci: 'The left ventricle, its wall about 1 cm thick, pumps about 70 mL a beat into the aorta at about 120 mmHg.',
      },
      aorta: {
        kid: 'Out into the aorta, the biggest blood vessel in your body, about as wide as a garden hose!',
        sci: 'The aorta, about 2.5 cm across: with each beat blood leaves the heart at up to about 1 m/s.',
      },
      artery: {
        kid: 'Now down an artery to your leg. The tubes get thinner and thinner.',
        sci: 'Arteries branch into arterioles and then capillaries 5 to 10 µm wide, where the blood slows to under 1 mm/s.',
      },
      arrive: {
        kid: 'We made it to a leg muscle! Now the oxygen hops off the red cell and into the muscle.',
        sci: 'In the muscle capillaries the PO2 falls to about 40 mmHg at rest (lower in exercise), and haemoglobin unloads its O2 into the fibres.',
      },
    },
    panel: {
      kid: [
        'A red cell is a soft round disc, thinner in the middle, about 7 to 8 thousandths of a millimetre across. It bends to squeeze through the thinnest blood vessels. It has no nucleus, so there is more room inside for oxygen.',
        'Your heart is two pumps side by side. The left one sends blood full of oxygen round your body; the right one sends the darker blood coming back to your lungs. At rest your blood goes all the way round in about a minute, and each red cell keeps going round for about four months.',
      ],
      sci: [
        'The red cell, a biconcave disc about 7.5 µm across and 2 µm thick, has no nucleus and no mitochondria: it makes its own ATP without oxygen, so it never uses what it carries. Its shape gives a large surface for gas exchange and lets it fold through capillaries narrower than itself.',
        'Two circuits in series: the right heart pumps to the lungs (pulmonary circulation), the left heart to the body (systemic circulation). At rest the whole 5 L of blood goes round in about a minute, so a red cell makes the circuit well over 100,000 times in its 120 days. Not to scale: at the size of these red cells a heart would be kilometres high.',
      ],
    },
  },
  muscle: {
    label: 'The working muscle',
    title: 'A muscle at work',
    levels: { rest: 'Resting', walk: 'Walking', run: 'Running', sprint: 'Sprinting' },
    board: {
      o2: 'Oxygen used',
      heart: 'Heartbeats',
      breaths: 'Breaths',
      pumped: 'Blood pumped',
      left: 'Blood leaving',
      full: '{n}% full',
      quick: 'Not enough oxygen: some energy the quick way',
      perMin: '/min',
    },
    slider: { kid: 'How hard the muscle works', sci: 'Effort (oxygen uptake)' },
    hints: { work: 'Tap the muscle to work harder', rest: 'Tap the muscle to rest' },
    says: {
      rest: {
        kid: 'Resting. Even now your muscles use a little oxygen, and your heart beats about 70 times a minute.',
        sci: 'Rest: about 0.25 L of O2 a minute for the whole body, heart about 70 beats/min, about 12 breaths/min; blood leaves the tissues about 75% saturated.',
      },
      walk: {
        kid: 'Walking! The muscle needs more oxygen, so your heart beats faster and you breathe faster too.',
        sci: 'Walking: about 1 L/min, four times rest. Heart rate, cardiac output and breathing rise, and the muscle takes more O2 from each red cell.',
      },
      run: {
        kid: 'Running! Now your body uses ten times as much oxygen as at rest. Look how dark the red cells are when they leave!',
        sci: 'Running: about 2.5 L/min, ten times rest. Cardiac output reaches about 20 L/min and the muscle extracts most of the O2: venous blood about 35% saturated.',
      },
      sprint: {
        kid: 'Sprinting! The oxygen cannot come fast enough for all the energy the muscle wants, so it makes some the quick way, without oxygen. You can only keep this up for a short time.',
        sci: 'Near a fit runner\'s maximum, about 3.5 to 4 L/min, around 15 times rest. Above the lactate threshold glycolysis outpaces the mitochondria and lactate builds up; the pace cannot be held for long.',
      },
    },
    panel: {
      kid: [
        'Your muscles are made of long cells called fibres, each about as thin as a hair, striped with tiny parts that pull. Pulling takes energy, and the energy comes with the help of oxygen.',
        'The harder you work, the more oxygen the muscle takes from each red cell, so the blood leaves darker. Your heart beats faster and you breathe faster to bring more. A fit runner\'s body can use about 15 times as much oxygen as at rest!',
      ],
      sci: [
        'Oxygen uptake (VO2) is cardiac output times the O2 taken from each litre of blood (the Fick principle, Adolf Fick, 1870): at rest about 5 L/min × 50 mL/L = 250 mL/min. In exercise both rise: cardiac output to about 20 to 25 L/min in a fit adult, extraction to about three quarters of the O2.',
        'A fit runner\'s VO2max is about 4 L/min (about 60 mL/kg/min), some 15 times rest; elite endurance athletes reach 5 to 6 L/min. Myoglobin, haemoglobin\'s one-seat cousin that makes muscle red, takes the O2 from the blood and hands it on to the mitochondria.',
      ],
    },
  },
  mito: {
    label: 'The power station',
    title: 'A mitochondrion, the power station',
    plate: 'Mitochondrion',
    chain: {
      title: { kid: 'Inside the power station', sci: 'The respiratory chain' },
      food: { kid: 'electrons from food', sci: 'NADH' },
      oxygen: { kid: 'oxygen', sci: 'O2' },
      water: { kid: 'water!', sci: '2 H2O' },
      turbine: { kid: 'turbine', sci: 'ATP synthase' },
      atp: 'ATP',
      sum: { kid: 'oxygen + electrons + H+ = water', sci: 'O2 + 4 e− + 4 H+ → 2 H2O' },
      steps: {
        kid: [
          'Used electrons from your food arrive.',
          'They run along the chain and pump H+ across the wall.',
          'At the end oxygen catches them, with H+: water!',
          'The H+ rush back through the turbine, and it makes ATP.',
        ],
        sci: [
          'NADH hands two electrons to complex I.',
          'Electrons pass I, III and IV; each complex pumps H+ out of the matrix.',
          'Complex IV: O2 + 4 e− + 4 H+ → 2 H2O.',
          'H+ flow back through ATP synthase, which turns and makes ATP.',
        ],
      },
      sugar: { title: 'One sugar', quick: 'quick way', oxygen: 'with oxygen', total: 'about 30 ATP', lactate: 'lactate: only 2 ATP' },
    },
    hints: { watch: 'Tap the power station to see the oxygen at work', sugar: 'Tap the sugar to feed the muscle' },
    buttons: { watch: 'Watch the oxygen at work', sugar: 'Feed the muscle a sugar' },
    says: {
      watch: {
        kid: 'This is a mitochondrion, one of the muscle\'s power stations. Watch the screen: used electrons from your food run along a chain, and at the end the oxygen catches them... and becomes water!',
        sci: 'The respiratory chain: electrons from NADH pass complexes I, III and IV, which pump H+ across the inner membrane. At complex IV, O2 + 4 e− + 4 H+ → 2 H2O. The H+ flow back through ATP synthase, which turns and makes ATP.',
      },
      sugar: {
        kid: 'Yum, a sugar! First it splits in two the quick way: 2 ATP. Then, with oxygen, the power station gets about 28 more!',
        sci: 'Glycolysis splits glucose into two pyruvate (net 2 ATP); with O2 the mitochondria oxidise them for about 28 more: about 30 ATP per glucose.',
      },
      quick: {
        kid: 'Not enough oxygen while you sprint! The sugar only went the quick way: just 2 ATP, about 15 times less, and its halves turned into lactate.',
        sci: 'Oxygen-limited: pyruvate is reduced to lactate to regenerate NAD+, and the glucose yields 2 ATP instead of about 30.',
      },
    },
    panel: {
      kid: [
        'Inside each muscle cell are hundreds, even thousands, of mitochondria, the cell\'s power stations. They take the energy out of your food bit by bit and pack it into ATP, tiny energy packets your muscles use to pull. Every day you make and use about your own weight in ATP!',
        'Oxygen\'s job is at the very end: it catches the used electrons, together with hydrogen, and becomes water. Without oxygen the chain stops, and the muscle can only make energy the quick way, which gets about 15 times less from the same sugar. And a surprise: the oxygen you breathe in does not leave in the carbon dioxide you breathe out. It becomes water!',
      ],
      sci: [
        'The electron transport chain in the inner mitochondrial membrane: complexes I, III and IV pump H+ out of the matrix as electrons pass from NADH to O2, and cytochrome c oxidase (complex IV) reduces it: O2 + 4 e− + 4 H+ → 2 H2O. The H+ gradient drives ATP synthase, a rotary motor (Peter Mitchell\'s chemiosmotic theory, 1961, Nobel Prize 1978; Paul Boyer and John Walker, Nobel Prize 1997).',
        'With O2, one glucose gives about 30 ATP (older books say 36 to 38); without, glycolysis to lactate gives 2. The O2 you breathe ends up in water: experiments with oxygen-18 show that the oxygen in exhaled CO2 comes from the food and from water, while the O2 becomes about 300 mL of metabolic water a day.',
      ],
    },
  },
}

const PT = {
  title: 'A viagem do ar que respiras',
  greet: {
    kid: 'Olá! Estamos dentro do teu corpo, mais pequenos do que uma célula. Eu sou o oxigénio que acabaste de inspirar! À esquerda está um alvéolo minúsculo do teu pulmão, à frente o teu coração, à direita um músculo. Vamos atrás de mim.',
    sci: 'Estamos à escala das células: um alvéolo à esquerda, com um capilar à volta, o coração à frente (fora de escala), uma fibra de músculo esquelético à direita. Segue o O2 desde o ar até às mitocôndrias. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'O teu sangue nunca é azul! Os glóbulos vermelhos cheios de oxigénio são vermelho vivo e, sem ele, vermelho escuro. As veias só parecem azuis vistas através da pele.',
      'Tens cerca de 25 biliões de glóbulos vermelhos, mais do que todas as outras células juntas. O teu corpo faz cerca de dois milhões novos por segundo!',
      'A este tamanho, o teu coração verdadeiro teria vários quilómetros de altura. Aqui está desenhado muito mais pequeno, para caber na sala.',
    ],
    sci: [
      'Um glóbulo vermelho é um disco bicôncavo com cerca de 7,5 µm de diâmetro e 2 µm de espessura, sem núcleo: enchem-no cerca de 270 milhões de moléculas de hemoglobina, com lugar para cerca de mil milhões de O2.',
      'Um adulto tem cerca de 25 biliões de glóbulos vermelhos em cerca de 5 L de sangue, a maioria das cerca de 30 biliões de células do corpo (Sender, Fuchs e Milo, 2016). Cada um vive cerca de 120 dias, por isso a medula óssea faz cerca de 2 milhões por segundo.',
      'Em repouso, o sangue dá a volta completa em cerca de um minuto: o coração bombeia cerca de 5 L/min a cerca de 70 batimentos por minuto, cerca de 100 000 batimentos por dia.',
    ],
  },
  sac: {
    label: 'O alvéolo',
    title: 'Um alvéolo do teu pulmão',
    hints: { breathe: 'Toca na via aérea para inspirar', low: 'Toca na via aérea, o alvéolo está a ficar sem oxigénio' },
    buttons: { breathe: 'Inspirar' },
    says: {
      breathe: {
        kid: 'Inspira! O ar fresco desce a correr até ao alvéolo. Os pares vermelhos são oxigénio; vê como passam pela parede fininha para dentro dos glóbulos vermelhos.',
        sci: 'Inspiração: o ar fresco renova o alvéolo (PO2 alveolar de cerca de 100 mmHg). O O2 difunde-se através da barreira alvéolo-capilar, com menos de um micrómetro de espessura, para o sangue do capilar e para a hemoglobina.',
      },
      low: {
        kid: 'O alvéolo já deu quase todo o oxigénio ao sangue. Está na hora de respirar outra vez!',
        sci: 'O O2 alveolar está a baixar (aqui acelerado: a suster a respiração, leva cerca de um minuto), por isso os glóbulos vermelhos saem menos saturados. Respira.',
      },
    },
    panel: {
      kid: [
        'Os teus pulmões estão cheios de saquinhos de ar minúsculos, os alvéolos: cerca de 480 milhões, cada um mais pequeno do que um ponto final. Estendidos, cobririam mais ou menos o chão de uma sala de aula. As paredes são finas como uma bola de sabão, e vasos sanguíneos minúsculos envolvem-nos por todo o lado.',
        'Quando inspiras, o ar fresco enche os alvéolos. O oxigénio passa pela parede fininha para o sangue, e os glóbulos vermelhos levam-no. O oxigénio de um alvéolo gasta-se depressa, por isso respiras outra vez, e outra: cerca de 20 000 vezes por dia.',
      ],
      sci: [
        'Cerca de 480 milhões de alvéolos (Ochs et al., 2004), cada um com cerca de 0,2 mm de diâmetro, dão uma superfície de trocas gasosas de cerca de 50 a 100 m². A barreira alvéolo-capilar (uma célula alveolar, uma membrana basal e uma célula do capilar) chega a ter apenas cerca de 0,2 µm, por isso o O2 passa só por difusão, de cerca de 100 mmHg no alvéolo para o sangue que chega a cerca de 40 mmHg.',
        'Em repouso, um glóbulo vermelho passa cerca de 0,75 s nos capilares do pulmão e fica carregado logo no primeiro terço desse tempo, uma reserva para o exercício. Uma respiração em repouso move cerca de 0,5 L e ficam cerca de 2,5 L nos pulmões entre respirações, por isso o ar alveolar muda aos poucos. Aqui o alvéolo esvazia-se muito mais depressa, para mostrar porque é que nunca deixamos de respirar.',
      ],
    },
  },
  blood: {
    label: 'Dentro de um glóbulo vermelho',
    title: 'A hemoglobina, a transportadora de oxigénio',
    plate: 'Hemoglobina',
    slider: { kid: 'Quanto oxigénio há à volta', sci: 'Pressão parcial de oxigénio, PO2' },
    presets: { lung: 'Nos pulmões', rest: 'Músculo em repouso', work: 'Músculo a trabalhar' },
    curve: {
      title: { kid: 'Quantos lugares estão ocupados?', sci: 'Curva de dissociação da oxi-hemoglobina' },
      x: { kid: 'mais oxigénio à volta', sci: 'PO2 (mmHg)' },
      y: { kid: 'lugares ocupados', sci: 'saturação' },
      lung: 'pulmões',
      rest: 'músculo em repouso',
      work: 'músculo a trabalhar',
      seats: 'lugares ocupados: {n} de 4',
    },
    hints: { look: 'Toca num glóbulo vermelho para ver o que tem dentro', again: 'Toca noutro glóbulo vermelho, ou na curva' },
    buttons: { look: 'Ver dentro de um glóbulo vermelho' },
    says: {
      look: {
        kid: 'Dentro de cada glóbulo vermelho há milhões disto: hemoglobina. Tem quatro lugares, cada um com um átomo de ferro, e cada lugar segura um oxigénio. Vê como se enchem quando o glóbulo passa pelo alvéolo!',
        sci: 'Hemoglobina: quatro cadeias de globina (duas α, duas β), cada uma com um heme cujo Fe2+ liga um O2. Ao passar pelo alvéolo, a saturação sobe até cerca de 98% e o sangue passa de vermelho escuro a vermelho vivo.',
      },
      full: {
        kid: 'Os quatro lugares estão ocupados! Viste? Depois de um oxigénio se sentar, os outros vieram mais depressa: os lugares ajudam-se uns aos outros.',
        sci: 'Ligação cooperativa: cada O2 ligado facilita a ligação do seguinte (coeficiente de Hill de cerca de 2,8). É isso que dá à curva a forma de S.',
      },
      curve: {
        kid: 'Desliza ao longo da curva: onde há muito oxigénio os lugares enchem-se, onde há pouco largam-no.',
        sci: 'Ao longo da curva: a parte íngreme, entre cerca de 20 e 40 mmHg, é onde os tecidos recebem o O2; o topo plano mantém o sangue quase cheio nos pulmões.',
      },
    },
    panel: {
      kid: [
        'Cada glóbulo vermelho está cheio de cerca de 270 milhões de moléculas de hemoglobina, e cada uma tem quatro lugares para oxigénio, com um átomo de ferro em cada lugar. É por isso que o sangue é vermelho: o heme à volta do ferro fica vermelho vivo com oxigénio e vermelho escuro sem ele.',
        'Os lugares ajudam-se uns aos outros. Onde há muito oxigénio, nos pulmões, enchem-se todos. Num músculo em repouso ficam ocupados cerca de três em cada quatro, e num músculo a trabalhar muito a maioria larga o oxigénio. Experimenta o controlo deslizante, ou toca na curva!',
      ],
      sci: [
        'A curva tem forma de S porque a ligação é cooperativa: a ligação do O2 faz passar o tetrâmero do estado tenso (T) para o estado relaxado (R), que segura o O2 com mais força. A 100 mmHg, nos pulmões, cerca de 98% dos locais estão ocupados; a 40 mmHg, num tecido em repouso, cerca de 75%; a 20 mmHg, num músculo a trabalhar, cerca de 30%. A meia saturação, P50, é de cerca de 27 mmHg (pH 7,4, 37 °C). Max Perutz resolveu a estrutura da hemoglobina (Prémio Nobel da Química de 1962).',
        'Num músculo a trabalhar, o calor, o ácido e o CO2 deslocam a curva para a direita, e ainda mais O2 se solta: o efeito de Bohr (Christian Bohr, Karl Hasselbalch e August Krogh, 1904). Cada grama de hemoglobina transporta até 1,34 mL de O2, cerca de 200 mL por litro de sangue, mais de 60 vezes o que o plasma conseguiria dissolver.',
      ],
    },
  },
  ride: {
    label: 'Andar num glóbulo vermelho',
    title: 'Dos pulmões a um músculo',
    hints: { go: 'Toca no glóbulo vermelho grande para andar nele', riding: 'Segura-te bem', wait: 'Espera pelo próximo glóbulo vermelho' },
    buttons: { go: 'Andar no glóbulo vermelho' },
    map: {
      title: 'Onde estás?',
      places: { vein: 'Para o coração', atrium: 'Aurícula esquerda', valve: 'Válvula mitral', ventricle: 'Ventrículo esquerdo', aorta: 'Aorta', artery: 'Artéria da perna', muscle: 'Músculo da perna' },
    },
    says: {
      go: {
        kid: 'Segura-te bem! Este glóbulo vermelho está cheio de oxigénio e vamos nele até um músculo.',
        sci: 'O sangue oxigenado sai do pulmão pelas veias pulmonares para o lado esquerdo do coração. A viagem está em câmara lenta: do pulmão à perna leva apenas segundos.',
      },
      atrium: {
        kid: 'Estamos no teu coração! Este é o lado esquerdo, o lado do sangue cheio de oxigénio. Primeiro uma sala pequena: a aurícula.',
        sci: 'A aurícula esquerda recolhe o sangue das quatro veias pulmonares e passa-o pela válvula mitral.',
      },
      valve: {
        kid: 'Uma porta que só abre para um lado! As cordas impedem-na de voltar para trás.',
        sci: 'A válvula mitral: dois folhetos presos pelas cordas tendinosas, para que o sangue não volte para a aurícula.',
      },
      ventricle: {
        kid: 'A sala mais forte do teu coração. Aperta! Lá vamos nós!',
        sci: 'O ventrículo esquerdo, com uma parede de cerca de 1 cm, bombeia cerca de 70 mL por batimento para a aorta, a cerca de 120 mmHg.',
      },
      aorta: {
        kid: 'Saímos para a aorta, o maior vaso sanguíneo do teu corpo, mais ou menos da largura de uma mangueira de jardim!',
        sci: 'A aorta, com cerca de 2,5 cm de diâmetro: a cada batimento o sangue sai do coração a até cerca de 1 m/s.',
      },
      artery: {
        kid: 'Agora descemos por uma artéria até à tua perna. Os tubos ficam cada vez mais finos.',
        sci: 'As artérias ramificam-se em arteríolas e depois em capilares de 5 a 10 µm, onde o sangue abranda para menos de 1 mm/s.',
      },
      arrive: {
        kid: 'Chegámos a um músculo da perna! Agora o oxigénio salta do glóbulo vermelho para dentro do músculo.',
        sci: 'Nos capilares do músculo, a PO2 desce para cerca de 40 mmHg em repouso (menos no exercício), e a hemoglobina liberta o seu O2 para as fibras.',
      },
    },
    panel: {
      kid: [
        'Um glóbulo vermelho é um disco mole e redondo, mais fino no meio, com cerca de 7 a 8 milésimas de milímetro. Dobra-se para passar pelos vasos sanguíneos mais finos. Não tem núcleo, por isso tem mais espaço lá dentro para o oxigénio.',
        'O teu coração são duas bombas lado a lado. A da esquerda manda o sangue cheio de oxigénio para todo o corpo; a da direita manda para os pulmões o sangue mais escuro que volta. Em repouso, o teu sangue dá a volta completa em cerca de um minuto, e cada glóbulo vermelho continua às voltas durante uns quatro meses.',
      ],
      sci: [
        'O glóbulo vermelho, um disco bicôncavo com cerca de 7,5 µm de diâmetro e 2 µm de espessura, não tem núcleo nem mitocôndrias: produz o seu ATP sem oxigénio, por isso nunca gasta o que transporta. A forma dá-lhe uma grande superfície para as trocas gasosas e deixa-o dobrar-se em capilares mais estreitos do que ele.',
        'Dois circuitos em série: o coração direito bombeia para os pulmões (circulação pulmonar), o esquerdo para o corpo (circulação sistémica). Em repouso, os 5 L de sangue dão a volta em cerca de um minuto, por isso um glóbulo vermelho faz o circuito bem mais de 100 000 vezes nos seus 120 dias. Fora de escala: ao tamanho destes glóbulos, um coração teria quilómetros de altura.',
      ],
    },
  },
  muscle: {
    label: 'O músculo a trabalhar',
    title: 'Um músculo a trabalhar',
    levels: { rest: 'Em repouso', walk: 'A andar', run: 'A correr', sprint: 'Sprint' },
    board: {
      o2: 'Oxigénio gasto',
      heart: 'Batimentos',
      breaths: 'Respirações',
      pumped: 'Sangue bombeado',
      left: 'Sangue que sai',
      full: '{n}% cheio',
      quick: 'Falta oxigénio: parte da energia vem do caminho rápido',
      perMin: '/min',
    },
    slider: { kid: 'Quanto trabalha o músculo', sci: 'Esforço (consumo de oxigénio)' },
    hints: { work: 'Toca no músculo para trabalhar mais', rest: 'Toca no músculo para descansar' },
    says: {
      rest: {
        kid: 'Em repouso. Mesmo agora os teus músculos gastam um pouco de oxigénio, e o teu coração bate cerca de 70 vezes por minuto.',
        sci: 'Repouso: cerca de 0,25 L de O2 por minuto para o corpo todo, coração a cerca de 70 batimentos/min, cerca de 12 respirações/min; o sangue sai dos tecidos com cerca de 75% de saturação.',
      },
      walk: {
        kid: 'A andar! O músculo precisa de mais oxigénio, por isso o teu coração bate mais depressa e também respiras mais depressa.',
        sci: 'A andar: cerca de 1 L/min, quatro vezes o repouso. Sobem a frequência cardíaca, o débito cardíaco e a respiração, e o músculo tira mais O2 a cada glóbulo vermelho.',
      },
      run: {
        kid: 'A correr! Agora o teu corpo gasta dez vezes mais oxigénio do que em repouso. Olha como os glóbulos vermelhos saem escuros!',
        sci: 'A correr: cerca de 2,5 L/min, dez vezes o repouso. O débito cardíaco chega a cerca de 20 L/min e o músculo extrai a maior parte do O2: sangue venoso com cerca de 35% de saturação.',
      },
      sprint: {
        kid: 'Sprint! O oxigénio não chega depressa para toda a energia que o músculo quer, por isso faz alguma pelo caminho rápido, sem oxigénio. Só consegues aguentar isto pouco tempo.',
        sci: 'Perto do máximo de um corredor em forma, cerca de 3,5 a 4 L/min, umas 15 vezes o repouso. Acima do limiar de lactato, a glicólise ultrapassa as mitocôndrias e o lactato acumula-se; o ritmo não se aguenta muito tempo.',
      },
    },
    panel: {
      kid: [
        'Os teus músculos são feitos de células compridas chamadas fibras, cada uma mais ou menos tão fina como um cabelo, às riscas, com pecinhas minúsculas que puxam. Puxar gasta energia, e a energia vem com a ajuda do oxigénio.',
        'Quanto mais trabalhas, mais oxigénio o músculo tira a cada glóbulo vermelho, por isso o sangue sai mais escuro. O teu coração bate mais depressa e respiras mais depressa para trazer mais. O corpo de um corredor em forma consegue gastar umas 15 vezes mais oxigénio do que em repouso!',
      ],
      sci: [
        'O consumo de oxigénio (VO2) é o débito cardíaco vezes o O2 retirado de cada litro de sangue (o princípio de Fick, Adolf Fick, 1870): em repouso, cerca de 5 L/min × 50 mL/L = 250 mL/min. No exercício sobem ambos: o débito cardíaco até cerca de 20 a 25 L/min num adulto em forma, a extração até cerca de três quartos do O2.',
        'O VO2máx de um corredor em forma é de cerca de 4 L/min (cerca de 60 mL/kg/min), umas 15 vezes o repouso; atletas de resistência de elite chegam a 5 a 6 L/min. A mioglobina, a prima de um só lugar da hemoglobina que torna o músculo vermelho, tira o O2 ao sangue e passa-o às mitocôndrias.',
      ],
    },
  },
  mito: {
    label: 'A central de energia',
    title: 'Uma mitocôndria, a central de energia',
    plate: 'Mitocôndria',
    chain: {
      title: { kid: 'Dentro da central de energia', sci: 'A cadeia respiratória' },
      food: { kid: 'eletrões da comida', sci: 'NADH' },
      oxygen: { kid: 'oxigénio', sci: 'O2' },
      water: { kid: 'água!', sci: '2 H2O' },
      turbine: { kid: 'turbina', sci: 'ATP sintase' },
      atp: 'ATP',
      sum: { kid: 'oxigénio + eletrões + H+ = água', sci: 'O2 + 4 e− + 4 H+ → 2 H2O' },
      steps: {
        kid: [
          'Chegam eletrões gastos da tua comida.',
          'Correm ao longo da cadeia e bombeiam H+ para o outro lado da parede.',
          'No fim, o oxigénio apanha-os, com H+: água!',
          'Os H+ voltam a correr pela turbina, e ela faz ATP.',
        ],
        sci: [
          'O NADH passa dois eletrões ao complexo I.',
          'Os eletrões passam pelos complexos I, III e IV; cada um bombeia H+ para fora da matriz.',
          'Complexo IV: O2 + 4 e− + 4 H+ → 2 H2O.',
          'Os H+ voltam pela ATP sintase, que roda e faz ATP.',
        ],
      },
      sugar: { title: 'Um açúcar', quick: 'caminho rápido', oxygen: 'com oxigénio', total: 'cerca de 30 ATP', lactate: 'lactato: só 2 ATP' },
    },
    hints: { watch: 'Toca na central de energia para ver o oxigénio a trabalhar', sugar: 'Toca no açúcar para alimentar o músculo' },
    buttons: { watch: 'Ver o oxigénio a trabalhar', sugar: 'Dar um açúcar ao músculo' },
    says: {
      watch: {
        kid: 'Isto é uma mitocôndria, uma das centrais de energia do músculo. Vê o ecrã: eletrões gastos da tua comida correm ao longo de uma cadeia e, no fim, o oxigénio apanha-os... e transforma-se em água!',
        sci: 'A cadeia respiratória: os eletrões do NADH passam pelos complexos I, III e IV, que bombeiam H+ através da membrana interna. No complexo IV, O2 + 4 e− + 4 H+ → 2 H2O. Os H+ voltam pela ATP sintase, que roda e faz ATP.',
      },
      sugar: {
        kid: 'Que bom, um açúcar! Primeiro parte-se ao meio pelo caminho rápido: 2 ATP. Depois, com oxigénio, a central de energia tira mais cerca de 28!',
        sci: 'A glicólise parte a glicose em dois piruvatos (2 ATP líquidos); com O2, as mitocôndrias oxidam-nos e tiram mais cerca de 28: cerca de 30 ATP por glicose.',
      },
      quick: {
        kid: 'Não há oxigénio que chegue no sprint! O açúcar só foi pelo caminho rápido: apenas 2 ATP, umas 15 vezes menos, e as metades transformaram-se em lactato.',
        sci: 'Limitado pelo oxigénio: o piruvato é reduzido a lactato para regenerar o NAD+, e a glicose rende 2 ATP em vez de cerca de 30.',
      },
    },
    panel: {
      kid: [
        'Dentro de cada célula do músculo há centenas, até milhares, de mitocôndrias, as centrais de energia da célula. Tiram a energia da comida aos bocadinhos e guardam-na em ATP, pacotinhos de energia que os músculos usam para puxar. Todos os dias fazes e gastas mais ou menos o teu próprio peso em ATP!',
        'O trabalho do oxigénio é mesmo no fim: apanha os eletrões gastos, junto com hidrogénio, e transforma-se em água. Sem oxigénio a cadeia para, e o músculo só consegue fazer energia pelo caminho rápido, que tira umas 15 vezes menos do mesmo açúcar. E uma surpresa: o oxigénio que inspiras não sai no dióxido de carbono que expiras. Transforma-se em água!',
      ],
      sci: [
        'A cadeia de transporte de eletrões na membrana mitocondrial interna: os complexos I, III e IV bombeiam H+ para fora da matriz enquanto os eletrões passam do NADH para o O2, e a citocromo c oxidase (complexo IV) reduz o O2: O2 + 4 e− + 4 H+ → 2 H2O. O gradiente de H+ faz andar a ATP sintase, um motor rotativo (teoria quimiosmótica de Peter Mitchell, 1961, Prémio Nobel de 1978; Paul Boyer e John Walker, Prémio Nobel de 1997).',
        'Com O2, uma glicose dá cerca de 30 ATP (livros mais antigos dizem 36 a 38); sem ele, a glicólise até ao lactato dá 2. O O2 que respiras acaba em água: experiências com oxigénio-18 mostram que o oxigénio do CO2 expirado vem da comida e da água, enquanto o O2 se torna em cerca de 300 mL de água metabólica por dia.',
      ],
    },
  },
}

const PL = {
  title: 'Podróż jednego oddechu',
  greet: {
    kid: 'Cześć! Jesteśmy teraz w twoim ciele, mniejsi niż komórka. Jestem tlenem, który właśnie wdychasz! Po lewej jest maleńki pęcherzyk płucny, na wprost twoje serce, po prawej mięsień. Chodź za mną.',
    sci: 'Jesteśmy w skali komórek: po lewej pęcherzyk płucny oplecony naczyniem włosowatym, na wprost serce (nie w skali), po prawej włókno mięśnia szkieletowego. Śledź O2 od powietrza do mitochondriów. Historia obrazu jest na sztaludze.',
  },
  talk: {
    kid: [
      'Twoja krew nigdy nie jest niebieska! Krwinki pełne tlenu są jaskrawoczerwone, a bez niego ciemnoczerwone. Żyły tylko wyglądają na niebieskie przez skórę.',
      'Masz około 25 bilionów czerwonych krwinek, więcej niż wszystkich innych komórek razem. Twoje ciało robi około dwóch milionów nowych co sekundę!',
      'Przy tym rozmiarze twoje prawdziwe serce miałoby kilka kilometrów wysokości. Tutaj jest narysowane dużo mniejsze, żeby zmieściło się w sali.',
    ],
    sci: [
      'Czerwona krwinka to dwuwklęsły krążek o średnicy około 7,5 µm i grubości 2 µm, bez jądra: wypełnia ją około 270 milionów cząsteczek hemoglobiny, miejsce dla około miliarda O2.',
      'Dorosły ma około 25 bilionów czerwonych krwinek w około 5 L krwi, większość z około 30 bilionów komórek ciała (Sender, Fuchs i Milo, 2016). Każda żyje około 120 dni, więc szpik kostny wytwarza około 2 milionów na sekundę.',
      'W spoczynku krew obiega całe ciało w około minutę: serce pompuje około 5 L/min przy około 70 uderzeniach na minutę, około 100 000 uderzeń na dobę.',
    ],
  },
  sac: {
    label: 'Pęcherzyk płucny',
    title: 'Pęcherzyk w twoim płucu',
    hints: { breathe: 'Dotknij drogi oddechowej, żeby zrobić wdech', low: 'Dotknij drogi oddechowej, w pęcherzyku kończy się tlen' },
    buttons: { breathe: 'Wdech' },
    says: {
      breathe: {
        kid: 'Wdech! Świeże powietrze wpada do pęcherzyka. Czerwone pary to tlen; zobacz, jak przechodzą przez cieniutką ściankę do czerwonych krwinek.',
        sci: 'Wdech: świeże powietrze odnawia pęcherzyk (pęcherzykowe PO2 około 100 mmHg). O2 dyfunduje przez barierę krew-powietrze, cieńszą niż mikrometr, do krwi w naczyniu włosowatym i na hemoglobinę.',
      },
      low: {
        kid: 'Pęcherzyk oddał już krwi prawie cały tlen. Czas na kolejny oddech!',
        sci: 'Tlenu w pęcherzyku ubywa (tu przyspieszone: przy wstrzymanym oddechu trwa to około minuty), więc krwinki odpływają mniej wysycone. Oddychaj.',
      },
    },
    panel: {
      kid: [
        'Twoje płuca są pełne maleńkich woreczków powietrza, około 480 milionów, każdy mniejszy niż kropka na końcu zdania. Rozłożone płasko pokryłyby mniej więcej podłogę klasy. Ich ścianki są cienkie jak bańka mydlana, a dookoła oplatają je maleńkie naczynia krwionośne.',
        'Kiedy robisz wdech, świeże powietrze wypełnia pęcherzyki. Tlen przechodzi przez cieniutką ściankę do krwi, a czerwone krwinki go zabierają. Tlen w pęcherzyku szybko się zużywa, więc oddychasz znowu i znowu: około 20 000 razy na dobę.',
      ],
      sci: [
        'Około 480 milionów pęcherzyków (Ochs i in., 2004), każdy o średnicy około 0,2 mm, daje powierzchnię wymiany gazowej około 50 do 100 m². Bariera krew-powietrze (komórka pęcherzyka, błona podstawna i komórka naczynia włosowatego) ma miejscami tylko około 0,2 µm, więc O2 przechodzi samą dyfuzją, z około 100 mmHg w pęcherzyku do krwi napływającej przy około 40 mmHg.',
        'W spoczynku krwinka spędza w naczyniach włosowatych płuc około 0,75 s i nasyca się już w pierwszej jednej trzeciej tego czasu, co jest zapasem na wysiłek. Oddech w spoczynku przesuwa około 0,5 L, a między oddechami w płucach zostaje około 2,5 L, więc powietrze pęcherzykowe zmienia się stopniowo. Tutaj pęcherzyk opróżnia się dużo szybciej, żeby pokazać, dlaczego oddychanie nigdy nie ustaje.',
      ],
    },
  },
  blood: {
    label: 'Wnętrze krwinki',
    title: 'Hemoglobina, przenośnik tlenu',
    plate: 'Hemoglobina',
    slider: { kid: 'Ile tlenu jest dookoła', sci: 'Ciśnienie parcjalne tlenu, PO2' },
    presets: { lung: 'W płucach', rest: 'Mięsień w spoczynku', work: 'Pracujący mięsień' },
    curve: {
      title: { kid: 'Ile miejsc jest zajętych?', sci: 'Krzywa dysocjacji oksyhemoglobiny' },
      x: { kid: 'więcej tlenu dookoła', sci: 'PO2 (mmHg)' },
      y: { kid: 'zajęte miejsca', sci: 'wysycenie' },
      lung: 'płuca',
      rest: 'mięsień w spoczynku',
      work: 'pracujący mięsień',
      seats: 'zajęte miejsca: {n} z 4',
    },
    hints: { look: 'Dotknij czerwonej krwinki, żeby zajrzeć do środka', again: 'Dotknij innej krwinki albo krzywej' },
    buttons: { look: 'Zajrzyj do czerwonej krwinki' },
    says: {
      look: {
        kid: 'W każdej czerwonej krwince są miliony takich: to hemoglobina. Ma cztery miejsca, w każdym atom żelaza, a każde miejsce trzyma jeden tlen. Zobacz, jak się zapełniają, kiedy krwinka mija pęcherzyk!',
        sci: 'Hemoglobina: cztery łańcuchy globiny (dwa α, dwa β), każdy z hemem, którego Fe2+ wiąże jeden O2. Gdy krwinka mija pęcherzyk, wysycenie rośnie do około 98%, a krew zmienia kolor z ciemnoczerwonego na jaskrawoczerwony.',
      },
      full: {
        kid: 'Wszystkie cztery miejsca zajęte! Widać było? Gdy usiadł pierwszy tlen, następne przychodziły szybciej: miejsca sobie pomagają.',
        sci: 'Wiązanie kooperatywne: każdy związany O2 ułatwia wiązanie następnego (współczynnik Hilla około 2,8). Stąd kształt litery S.',
      },
      curve: {
        kid: 'Przesuwaj się po krzywej: gdzie tlenu jest dużo, miejsca się zapełniają, gdzie mało, oddają go.',
        sci: 'Wzdłuż krzywej: stromy odcinek między około 20 a 40 mmHg to miejsce, gdzie tkanki pobierają O2; płaski szczyt utrzymuje krew prawie pełną w płucach.',
      },
    },
    panel: {
      kid: [
        'Każda czerwona krwinka jest wypełniona około 270 milionami cząsteczek hemoglobiny, a każda z nich ma cztery miejsca na tlen, z atomem żelaza w każdym miejscu. Dlatego krew jest czerwona: hem wokół żelaza jest jaskrawoczerwony z tlenem i ciemnoczerwony bez niego.',
        'Miejsca sobie pomagają. Tam, gdzie tlenu jest dużo, w płucach, zapełniają się całkiem. W mięśniu w spoczynku zajęte zostają mniej więcej trzy z czterech, a w mięśniu, który ciężko pracuje, większość oddaje tlen. Spróbuj suwaka albo dotknij krzywej!',
      ],
      sci: [
        'Krzywa ma kształt litery S, bo wiązanie jest kooperatywne: wiązanie O2 przesuwa tetramer ze stanu napiętego (T) w stronę rozluźnionego (R), który trzyma O2 mocniej. Przy 100 mmHg, w płucach, zajętych jest około 98% miejsc; przy 40 mmHg, w tkance w spoczynku, około 75%; przy 20 mmHg, w pracującym mięśniu, około 30%. Połowiczne wysycenie, P50, to około 27 mmHg (pH 7,4, 37 °C). Max Perutz poznał strukturę hemoglobiny (Nagroda Nobla z chemii 1962).',
        'W pracującym mięśniu ciepło, kwas i CO2 przesuwają krzywą w prawo, więc uwalnia się jeszcze więcej O2: efekt Bohra (Christian Bohr, Karl Hasselbalch i August Krogh, 1904). Każdy gram hemoglobiny przenosi do 1,34 mL O2, około 200 mL na litr krwi, ponad 60 razy więcej, niż mogłoby się rozpuścić w osoczu.',
      ],
    },
  },
  ride: {
    label: 'Przejażdżka na krwince',
    title: 'Z płuc do mięśnia',
    hints: { go: 'Dotknij dużej czerwonej krwinki, żeby na niej pojechać', riding: 'Trzymaj się mocno', wait: 'Poczekaj na następną krwinkę' },
    buttons: { go: 'Jedź na czerwonej krwince' },
    map: {
      title: 'Gdzie jesteś?',
      places: { vein: 'Do serca', atrium: 'Lewy przedsionek', valve: 'Zastawka mitralna', ventricle: 'Lewa komora', aorta: 'Aorta', artery: 'Tętnica do nogi', muscle: 'Mięsień nogi' },
    },
    says: {
      go: {
        kid: 'Trzymaj się mocno! Ta czerwona krwinka jest pełna tlenu i jedziemy na niej do mięśnia.',
        sci: 'Utlenowana krew płynie z płuca żyłami płucnymi do lewej części serca. Przejażdżka jest spowolniona: z płuca do nogi to tylko sekundy.',
      },
      atrium: {
        kid: 'Jesteśmy w twoim sercu! To jego lewa strona, strona krwi pełnej tlenu. Najpierw mały pokój: przedsionek.',
        sci: 'Lewy przedsionek zbiera krew z czterech żył płucnych i przekazuje ją przez zastawkę mitralną.',
      },
      valve: {
        kid: 'Drzwi, które otwierają się tylko w jedną stronę! Ich sznurki nie pozwalają im się cofnąć.',
        sci: 'Zastawka mitralna: dwa płatki przytrzymywane przez struny ścięgniste, żeby krew nie cofała się do przedsionka.',
      },
      ventricle: {
        kid: 'Najsilniejszy pokój w twoim sercu. Ściśnij! Jedziemy!',
        sci: 'Lewa komora, o ścianie grubej na około 1 cm, pompuje około 70 mL na jedno uderzenie do aorty pod ciśnieniem około 120 mmHg.',
      },
      aorta: {
        kid: 'Wylatujemy do aorty, największego naczynia krwionośnego w twoim ciele, mniej więcej szerokiego jak wąż ogrodowy!',
        sci: 'Aorta, o średnicy około 2,5 cm: przy każdym uderzeniu krew wypływa z serca z prędkością do około 1 m/s.',
      },
      artery: {
        kid: 'Teraz w dół tętnicą do twojej nogi. Rurki są coraz cieńsze.',
        sci: 'Tętnice rozgałęziają się w tętniczki, a potem w naczynia włosowate szerokie na 5 do 10 µm, gdzie krew zwalnia do poniżej 1 mm/s.',
      },
      arrive: {
        kid: 'Dotarliśmy do mięśnia nogi! Teraz tlen zeskakuje z czerwonej krwinki do mięśnia.',
        sci: 'W naczyniach włosowatych mięśnia PO2 spada do około 40 mmHg w spoczynku (w wysiłku niżej), a hemoglobina oddaje O2 włóknom.',
      },
    },
    panel: {
      kid: [
        'Czerwona krwinka to miękki, okrągły krążek, cieńszy w środku, o średnicy około 7 do 8 tysięcznych milimetra. Wygina się, żeby przecisnąć się przez najcieńsze naczynia. Nie ma jądra, więc ma w środku więcej miejsca na tlen.',
        'Twoje serce to dwie pompy obok siebie. Lewa wysyła krew pełną tlenu do całego ciała; prawa wysyła ciemniejszą krew, która wraca, do płuc. W spoczynku twoja krew obiega całe ciało w około minutę, a każda czerwona krwinka krąży tak przez mniej więcej cztery miesiące.',
      ],
      sci: [
        'Czerwona krwinka, dwuwklęsły krążek o średnicy około 7,5 µm i grubości 2 µm, nie ma jądra ani mitochondriów: wytwarza swoje ATP bez tlenu, więc nigdy nie zużywa tego, co przenosi. Jej kształt daje dużą powierzchnię do wymiany gazowej i pozwala jej się zginać w naczyniach węższych od niej samej.',
        'Dwa krążenia połączone szeregowo: prawe serce pompuje do płuc (krążenie płucne), lewe do ciała (krążenie duże). W spoczynku całe 5 L krwi obiega ciało w około minutę, więc krwinka okrąża je grubo ponad 100 000 razy w ciągu swoich 120 dni. Nie w skali: przy rozmiarze tych krwinek serce miałoby kilometry wysokości.',
      ],
    },
  },
  muscle: {
    label: 'Pracujący mięsień',
    title: 'Mięsień przy pracy',
    levels: { rest: 'Odpoczynek', walk: 'Spacer', run: 'Bieg', sprint: 'Sprint' },
    board: {
      o2: 'Zużyty tlen',
      heart: 'Uderzenia serca',
      breaths: 'Oddechy',
      pumped: 'Przepompowana krew',
      left: 'Krew odpływająca',
      full: 'pełna w {n}%',
      quick: 'Za mało tlenu: część energii szybką drogą',
      perMin: '/min',
    },
    slider: { kid: 'Jak ciężko pracuje mięsień', sci: 'Wysiłek (pobór tlenu)' },
    hints: { work: 'Dotknij mięśnia, żeby pracował ciężej', rest: 'Dotknij mięśnia, żeby odpoczął' },
    says: {
      rest: {
        kid: 'Odpoczynek. Nawet teraz twoje mięśnie zużywają trochę tlenu, a serce bije około 70 razy na minutę.',
        sci: 'Spoczynek: około 0,25 L O2 na minutę dla całego ciała, serce około 70 uderzeń/min, około 12 oddechów/min; krew odpływa z tkanek wysycona w około 75%.',
      },
      walk: {
        kid: 'Spacer! Mięsień potrzebuje więcej tlenu, więc serce bije szybciej i ty też oddychasz szybciej.',
        sci: 'Chód: około 1 L/min, cztery razy więcej niż w spoczynku. Rosną tętno, pojemność minutowa serca i oddychanie, a mięsień zabiera każdej krwince więcej O2.',
      },
      run: {
        kid: 'Bieg! Teraz twoje ciało zużywa dziesięć razy więcej tlenu niż w spoczynku. Zobacz, jak ciemne są krwinki, kiedy odpływają!',
        sci: 'Bieg: około 2,5 L/min, dziesięć razy więcej niż w spoczynku. Pojemność minutowa dochodzi do około 20 L/min, a mięsień pobiera większość O2: krew żylna wysycona w około 35%.',
      },
      sprint: {
        kid: 'Sprint! Tlen nie nadąża za całą energią, której chce mięsień, więc część robi szybką drogą, bez tlenu. Długo tak nie wytrzymasz.',
        sci: 'Blisko maksimum wytrenowanego biegacza, około 3,5 do 4 L/min, mniej więcej 15 razy więcej niż w spoczynku. Powyżej progu mleczanowego glikoliza wyprzedza mitochondria i gromadzi się mleczan; takiego tempa nie da się długo utrzymać.',
      },
    },
    panel: {
      kid: [
        'Twoje mięśnie są zbudowane z długich komórek zwanych włóknami, każde mniej więcej tak cienkie jak włos, w paski z maleńkich części, które ciągną. Ciągnięcie wymaga energii, a energia powstaje z pomocą tlenu.',
        'Im ciężej pracujesz, tym więcej tlenu mięsień zabiera każdej krwince, więc krew odpływa ciemniejsza. Serce bije szybciej, a ty oddychasz szybciej, żeby dostarczyć więcej. Ciało wytrenowanego biegacza potrafi zużyć mniej więcej 15 razy więcej tlenu niż w spoczynku!',
      ],
      sci: [
        'Pobór tlenu (VO2) to pojemność minutowa serca razy ilość O2 pobrana z każdego litra krwi (zasada Ficka, Adolf Fick, 1870): w spoczynku około 5 L/min × 50 mL/L = 250 mL/min. W wysiłku rosną obie: pojemność minutowa do około 20 do 25 L/min u wytrenowanego dorosłego, ekstrakcja do około trzech czwartych O2.',
        'VO2max wytrenowanego biegacza to około 4 L/min (około 60 mL/kg/min), mniej więcej 15 razy więcej niż w spoczynku; elitarni sportowcy wytrzymałościowi osiągają 5 do 6 L/min. Mioglobina, jednomiejscowa kuzynka hemoglobiny, która nadaje mięśniom czerwony kolor, odbiera O2 z krwi i przekazuje go mitochondriom.',
      ],
    },
  },
  mito: {
    label: 'Elektrownia',
    title: 'Mitochondrium, elektrownia komórki',
    plate: 'Mitochondrium',
    chain: {
      title: { kid: 'W elektrowni komórki', sci: 'Łańcuch oddechowy' },
      food: { kid: 'elektrony z jedzenia', sci: 'NADH' },
      oxygen: { kid: 'tlen', sci: 'O2' },
      water: { kid: 'woda!', sci: '2 H2O' },
      turbine: { kid: 'turbina', sci: 'syntaza ATP' },
      atp: 'ATP',
      sum: { kid: 'tlen + elektrony + H+ = woda', sci: 'O2 + 4 e− + 4 H+ → 2 H2O' },
      steps: {
        kid: [
          'Przybywają zużyte elektrony z twojego jedzenia.',
          'Biegną wzdłuż łańcucha i pompują H+ na drugą stronę ścianki.',
          'Na końcu łapie je tlen, razem z H+: woda!',
          'H+ wracają przez turbinę, a ona robi ATP.',
        ],
        sci: [
          'NADH oddaje dwa elektrony kompleksowi I.',
          'Elektrony mijają kompleksy I, III i IV; każdy wypompowuje H+ z macierzy.',
          'Kompleks IV: O2 + 4 e− + 4 H+ → 2 H2O.',
          'H+ wracają przez syntazę ATP, która się obraca i wytwarza ATP.',
        ],
      },
      sugar: { title: 'Jeden cukier', quick: 'szybka droga', oxygen: 'z tlenem', total: 'około 30 ATP', lactate: 'mleczan: tylko 2 ATP' },
    },
    hints: { watch: 'Dotknij elektrowni, żeby zobaczyć tlen przy pracy', sugar: 'Dotknij cukru, żeby nakarmić mięsień' },
    buttons: { watch: 'Zobacz tlen przy pracy', sugar: 'Daj mięśniowi cukier' },
    says: {
      watch: {
        kid: 'To mitochondrium, jedna z elektrowni mięśnia. Patrz na ekran: zużyte elektrony z twojego jedzenia biegną wzdłuż łańcucha, a na końcu łapie je tlen... i zmienia się w wodę!',
        sci: 'Łańcuch oddechowy: elektrony z NADH przechodzą przez kompleksy I, III i IV, które pompują H+ przez błonę wewnętrzną. W kompleksie IV: O2 + 4 e− + 4 H+ → 2 H2O. H+ wracają przez syntazę ATP, która się obraca i wytwarza ATP.',
      },
      sugar: {
        kid: 'Pycha, cukier! Najpierw dzieli się na pół szybką drogą: 2 ATP. Potem, z tlenem, elektrownia dokłada jeszcze około 28!',
        sci: 'Glikoliza rozkłada glukozę na dwa pirogroniany (netto 2 ATP); z O2 mitochondria utleniają je i dają jeszcze około 28: około 30 ATP z jednej glukozy.',
      },
      quick: {
        kid: 'Przy sprincie tlenu nie starcza! Cukier poszedł tylko szybką drogą: zaledwie 2 ATP, mniej więcej 15 razy mniej, a jego połówki zamieniły się w mleczan.',
        sci: 'Ograniczenie tlenowe: pirogronian jest redukowany do mleczanu, żeby odtworzyć NAD+, a glukoza daje 2 ATP zamiast około 30.',
      },
    },
    panel: {
      kid: [
        'W każdej komórce mięśnia są setki, a nawet tysiące mitochondriów, elektrowni komórki. Wyciągają energię z jedzenia kawałek po kawałku i pakują ją w ATP, maleńkie paczuszki energii, których mięśnie używają do ciągnięcia. Każdego dnia wytwarzasz i zużywasz mniej więcej tyle ATP, ile sam ważysz!',
        'Praca tlenu jest na samym końcu: łapie zużyte elektrony razem z wodorem i zmienia się w wodę. Bez tlenu łańcuch staje, a mięsień może robić energię tylko szybką drogą, która z tego samego cukru daje mniej więcej 15 razy mniej. I niespodzianka: tlen, którym oddychasz, nie wychodzi w dwutlenku węgla, który wydychasz. Zmienia się w wodę!',
      ],
      sci: [
        'Łańcuch transportu elektronów w wewnętrznej błonie mitochondrium: kompleksy I, III i IV wypompowują H+ z macierzy, gdy elektrony płyną od NADH do O2, a oksydaza cytochromu c (kompleks IV) redukuje O2: O2 + 4 e− + 4 H+ → 2 H2O. Gradient H+ napędza syntazę ATP, silnik obrotowy (teoria chemiosmotyczna Petera Mitchella, 1961, Nagroda Nobla 1978; Paul Boyer i John Walker, Nagroda Nobla 1997).',
        'Z O2 jedna glukoza daje około 30 ATP (starsze podręczniki podają 36 do 38); bez niego glikoliza do mleczanu daje 2. Wdychany O2 kończy jako woda: doświadczenia z tlenem-18 pokazują, że tlen w wydychanym CO2 pochodzi z jedzenia i z wody, a O2 staje się około 300 mL wody metabolicznej na dobę.',
      ],
    },
  },
}

const DE = {
  title: 'Die Reise eines Atemzugs',
  greet: {
    kid: 'Hallo! Wir sind jetzt in deinem Körper, kleiner als eine Zelle. Ich bin der Sauerstoff, den du gerade eingeatmet hast! Links ist ein winziges Lungenbläschen, geradeaus dein Herz, rechts ein Muskel. Komm mit mir.',
    sci: 'Wir sind auf der Größe von Zellen: links ein Lungenbläschen mit einer Kapillare darum, geradeaus das Herz (nicht maßstabsgetreu), rechts eine Skelettmuskelfaser. Folge dem O2 von der Luft bis zu den Mitochondrien. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Dein Blut ist nie blau! Rote Blutkörperchen voller Sauerstoff sind leuchtend rot, ohne ihn dunkelrot. Venen sehen nur durch die Haut blau aus.',
      'Du hast etwa 25 Billionen rote Blutkörperchen, mehr als alle anderen Zellen zusammen. Dein Körper macht jede Sekunde etwa zwei Millionen neue!',
      'In dieser Größe wäre dein echtes Herz mehrere Kilometer hoch. Hier ist es viel kleiner gezeichnet, damit es in den Raum passt.',
    ],
    sci: [
      'Ein rotes Blutkörperchen ist eine bikonkave Scheibe, etwa 7,5 µm breit und 2 µm dick, ohne Zellkern: Etwa 270 Millionen Hämoglobinmoleküle füllen es, Platz für etwa eine Milliarde O2.',
      'Ein Erwachsener hat etwa 25 Billionen rote Blutkörperchen in etwa 5 L Blut, die Mehrheit der rund 30 Billionen Körperzellen (Sender, Fuchs und Milo, 2016). Jedes lebt etwa 120 Tage, also bildet das Knochenmark etwa 2 Millionen pro Sekunde.',
      'In Ruhe läuft das Blut in etwa einer Minute einmal ganz herum: Das Herz pumpt etwa 5 L/min bei etwa 70 Schlägen pro Minute, etwa 100.000 Schläge am Tag.',
    ],
  },
  sac: {
    label: 'Das Lungenbläschen',
    title: 'Ein Lungenbläschen in deiner Lunge',
    hints: { breathe: 'Tippe auf den Luftweg, um einzuatmen', low: 'Tippe auf den Luftweg, dem Bläschen geht der Sauerstoff aus' },
    buttons: { breathe: 'Einatmen' },
    says: {
      breathe: {
        kid: 'Einatmen! Frische Luft strömt hinunter ins Lungenbläschen. Die roten Paare sind Sauerstoff; schau, wie sie durch die hauchdünne Wand in die roten Blutkörperchen schlüpfen.',
        sci: 'Einatmung: Frische Luft erneuert das Alveolarvolumen (alveolärer PO2 etwa 100 mmHg). O2 diffundiert durch die Blut-Luft-Schranke, dünner als ein Mikrometer, ins Kapillarblut und ans Hämoglobin.',
      },
      low: {
        kid: 'Das Lungenbläschen hat fast seinen ganzen Sauerstoff ans Blut abgegeben. Zeit für den nächsten Atemzug!',
        sci: 'Der alveoläre O2 sinkt (hier beschleunigt: beim Luftanhalten dauert es etwa eine Minute), also verlassen die roten Blutkörperchen die Lunge weniger gesättigt. Atme.',
      },
    },
    panel: {
      kid: [
        'Deine Lunge ist voller winziger Luftsäckchen, etwa 480 Millionen, jedes kleiner als ein Punkt am Satzende. Flach ausgebreitet würden sie etwa den Boden eines Klassenzimmers bedecken. Ihre Wände sind so dünn wie eine Seifenblase, und winzige Blutgefäße umspinnen sie überall.',
        'Wenn du einatmest, füllt frische Luft die Bläschen. Der Sauerstoff schlüpft durch die hauchdünne Wand ins Blut, und die roten Blutkörperchen tragen ihn fort. Der Sauerstoff in einem Bläschen ist bald verbraucht, also atmest du wieder und wieder: etwa 20.000 Mal am Tag.',
      ],
      sci: [
        'Etwa 480 Millionen Alveolen (Ochs et al., 2004), jede etwa 0,2 mm groß, ergeben eine Gasaustauschfläche von etwa 50 bis 100 m². Die Blut-Luft-Schranke (eine Alveolarzelle, eine Basalmembran und eine Kapillarzelle) ist stellenweise nur etwa 0,2 µm dick, also gelangt O2 allein durch Diffusion von etwa 100 mmHg in der Alveole ins Blut, das mit etwa 40 mmHg ankommt.',
        'In Ruhe verbringt ein rotes Blutkörperchen etwa 0,75 s in den Lungenkapillaren und ist schon im ersten Drittel dieser Zeit beladen, eine Reserve für Belastung. Ein Atemzug in Ruhe bewegt etwa 0,5 L, und zwischen den Atemzügen bleiben etwa 2,5 L in der Lunge, also ändert sich die Alveolarluft nur allmählich. Hier leert sich das Bläschen viel schneller, damit du siehst, warum das Atmen nie aufhört.',
      ],
    },
  },
  blood: {
    label: 'In einem roten Blutkörperchen',
    title: 'Hämoglobin, der Sauerstoffträger',
    plate: 'Hämoglobin',
    slider: { kid: 'Wie viel Sauerstoff ringsum ist', sci: 'Sauerstoffpartialdruck, PO2' },
    presets: { lung: 'In der Lunge', rest: 'Ruhender Muskel', work: 'Arbeitender Muskel' },
    curve: {
      title: { kid: 'Wie voll sind die Plätze?', sci: 'Sauerstoffbindungskurve des Hämoglobins' },
      x: { kid: 'mehr Sauerstoff ringsum', sci: 'PO2 (mmHg)' },
      y: { kid: 'besetzte Plätze', sci: 'Sättigung' },
      lung: 'Lunge',
      rest: 'ruhender Muskel',
      work: 'arbeitender Muskel',
      seats: 'besetzte Plätze: {n} von 4',
    },
    hints: { look: 'Tippe auf ein rotes Blutkörperchen, um hineinzuschauen', again: 'Tippe auf ein anderes Blutkörperchen oder auf die Kurve' },
    buttons: { look: 'In ein rotes Blutkörperchen schauen' },
    says: {
      look: {
        kid: 'In jedem roten Blutkörperchen stecken Millionen davon: Hämoglobin. Es hat vier Plätze, jeder mit einem Eisenatom, und jeder Platz hält einen Sauerstoff. Schau, wie sie sich füllen, wenn das Blutkörperchen am Lungenbläschen vorbeikommt!',
        sci: 'Hämoglobin: vier Globinketten (zwei α, zwei β), jede mit einem Häm, dessen Fe2+ ein O2 bindet. Am Lungenbläschen steigt die Sättigung auf etwa 98%, und das Blut wird von dunkelrot zu leuchtend rot.',
      },
      full: {
        kid: 'Alle vier Plätze sind besetzt! Hast du es gesehen? Als sich der erste Sauerstoff gesetzt hatte, kamen die anderen schneller: Die Plätze helfen einander.',
        sci: 'Kooperative Bindung: Jedes gebundene O2 erleichtert die Bindung des nächsten (Hill-Koeffizient etwa 2,8). Daher die S-Form der Kurve.',
      },
      curve: {
        kid: 'Fahr die Kurve entlang: Wo viel Sauerstoff ist, füllen sich die Plätze, wo wenig ist, geben sie ihn ab.',
        sci: 'Entlang der Kurve: Im steilen Teil zwischen etwa 20 und 40 mmHg holen sich die Gewebe ihren O2; das flache obere Ende hält das Blut in der Lunge fast voll.',
      },
    },
    panel: {
      kid: [
        'Jedes rote Blutkörperchen ist mit etwa 270 Millionen Hämoglobinmolekülen vollgepackt, und jedes hat vier Plätze für Sauerstoff, mit einem Eisenatom auf jedem Platz. Deshalb ist Blut rot: Das Häm um das Eisen ist mit Sauerstoff leuchtend rot und ohne ihn dunkelrot.',
        'Die Plätze helfen einander. Wo viel Sauerstoff ist, in der Lunge, füllen sie sich ganz. In einem ruhenden Muskel bleiben etwa drei von vier besetzt, und in einem Muskel, der hart arbeitet, lassen die meisten los. Probier den Schieberegler, oder tippe auf die Kurve!',
      ],
      sci: [
        'Die Kurve ist S-förmig, weil die Bindung kooperativ ist: Die O2-Bindung verschiebt das Tetramer vom gespannten (T) in Richtung des entspannten (R) Zustands, der O2 fester hält. Bei 100 mmHg, in der Lunge, sind etwa 98% der Bindungsstellen besetzt; bei 40 mmHg, in ruhendem Gewebe, etwa 75%; bei 20 mmHg, in einem arbeitenden Muskel, etwa 30%. Die Halbsättigung, P50, liegt bei etwa 27 mmHg (pH 7,4, 37 °C). Max Perutz klärte die Struktur des Hämoglobins auf (Nobelpreis für Chemie 1962).',
        'In einem arbeitenden Muskel verschieben Wärme, Säure und CO2 die Kurve nach rechts, sodass noch mehr O2 loslässt: der Bohr-Effekt (Christian Bohr, Karl Hasselbalch und August Krogh, 1904). Jedes Gramm Hämoglobin trägt bis zu 1,34 mL O2, etwa 200 mL pro Liter Blut, mehr als 60-mal so viel, wie das Plasma lösen könnte.',
      ],
    },
  },
  ride: {
    label: 'Auf einem Blutkörperchen reiten',
    title: 'Von der Lunge zum Muskel',
    hints: { go: 'Tippe auf das große rote Blutkörperchen, um darauf zu reiten', riding: 'Halt dich gut fest', wait: 'Warte auf das nächste Blutkörperchen' },
    buttons: { go: 'Auf dem Blutkörperchen reiten' },
    map: {
      title: 'Wo bist du?',
      places: { vein: 'Zum Herzen', atrium: 'Linker Vorhof', valve: 'Mitralklappe', ventricle: 'Linke Kammer', aorta: 'Aorta', artery: 'Arterie zum Bein', muscle: 'Beinmuskel' },
    },
    says: {
      go: {
        kid: 'Halt dich gut fest! Dieses rote Blutkörperchen ist voller Sauerstoff, und wir reiten darauf zu einem Muskel.',
        sci: 'Sauerstoffreiches Blut verlässt die Lunge durch die Lungenvenen zur linken Herzseite. Der Ritt ist verlangsamt: Von der Lunge bis ins Bein dauert es nur Sekunden.',
      },
      atrium: {
        kid: 'Wir sind in deinem Herzen! Das ist seine linke Seite, die Seite für Blut voller Sauerstoff. Zuerst ein kleiner Raum: der Vorhof.',
        sci: 'Der linke Vorhof sammelt das Blut der vier Lungenvenen und gibt es durch die Mitralklappe weiter.',
      },
      valve: {
        kid: 'Eine Tür, die nur in eine Richtung aufgeht! Ihre Fäden verhindern, dass sie zurückschlägt.',
        sci: 'Die Mitralklappe: zwei Segel, gehalten von den Sehnenfäden, damit das Blut nicht in den Vorhof zurückfließt.',
      },
      ventricle: {
        kid: 'Der stärkste Raum in deinem Herzen. Zusammendrücken! Los geht es!',
        sci: 'Die linke Kammer, ihre Wand etwa 1 cm dick, pumpt pro Schlag etwa 70 mL bei etwa 120 mmHg in die Aorta.',
      },
      aorta: {
        kid: 'Hinaus in die Aorta, das größte Blutgefäß deines Körpers, etwa so breit wie ein Gartenschlauch!',
        sci: 'Die Aorta, etwa 2,5 cm breit: Mit jedem Schlag verlässt das Blut das Herz mit bis zu etwa 1 m/s.',
      },
      artery: {
        kid: 'Jetzt eine Arterie hinunter zu deinem Bein. Die Röhren werden immer dünner.',
        sci: 'Arterien verzweigen sich in Arteriolen und dann in 5 bis 10 µm weite Kapillaren, in denen das Blut auf unter 1 mm/s langsamer wird.',
      },
      arrive: {
        kid: 'Wir sind an einem Beinmuskel angekommen! Jetzt hüpft der Sauerstoff vom roten Blutkörperchen in den Muskel.',
        sci: 'In den Muskelkapillaren fällt der PO2 in Ruhe auf etwa 40 mmHg (bei Belastung tiefer), und das Hämoglobin gibt seinen O2 an die Fasern ab.',
      },
    },
    panel: {
      kid: [
        'Ein rotes Blutkörperchen ist eine weiche, runde Scheibe, in der Mitte dünner, etwa 7 bis 8 Tausendstel Millimeter groß. Es biegt sich, um sich durch die dünnsten Blutgefäße zu quetschen. Es hat keinen Zellkern, also ist innen mehr Platz für Sauerstoff.',
        'Dein Herz besteht aus zwei Pumpen nebeneinander. Die linke schickt Blut voller Sauerstoff durch deinen Körper; die rechte schickt das dunklere Blut, das zurückkommt, zur Lunge. In Ruhe läuft dein Blut in etwa einer Minute einmal ganz herum, und jedes rote Blutkörperchen kreist so etwa vier Monate lang.',
      ],
      sci: [
        'Das rote Blutkörperchen, eine bikonkave Scheibe von etwa 7,5 µm Durchmesser und 2 µm Dicke, hat weder Zellkern noch Mitochondrien: Es macht sein ATP ohne Sauerstoff und verbraucht deshalb nie, was es trägt. Seine Form gibt ihm eine große Oberfläche für den Gasaustausch und lässt es sich durch Kapillaren falten, die enger sind als es selbst.',
        'Zwei Kreisläufe hintereinander: Das rechte Herz pumpt in die Lunge (Lungenkreislauf), das linke in den Körper (Körperkreislauf). In Ruhe läuft das ganze Blut, etwa 5 L, in rund einer Minute herum, also macht ein rotes Blutkörperchen die Runde in seinen 120 Tagen weit über 100.000 Mal. Nicht maßstabsgetreu: In der Größe dieser Blutkörperchen wäre ein Herz kilometerhoch.',
      ],
    },
  },
  muscle: {
    label: 'Der arbeitende Muskel',
    title: 'Ein Muskel bei der Arbeit',
    levels: { rest: 'Ruhe', walk: 'Gehen', run: 'Laufen', sprint: 'Sprint' },
    board: {
      o2: 'Verbrauchter Sauerstoff',
      heart: 'Herzschläge',
      breaths: 'Atemzüge',
      pumped: 'Gepumptes Blut',
      left: 'Abfließendes Blut',
      full: '{n}% voll',
      quick: 'Zu wenig Sauerstoff: etwas Energie auf dem schnellen Weg',
      perMin: '/min',
    },
    slider: { kid: 'Wie hart der Muskel arbeitet', sci: 'Belastung (Sauerstoffaufnahme)' },
    hints: { work: 'Tippe auf den Muskel, damit er härter arbeitet', rest: 'Tippe auf den Muskel, damit er ausruht' },
    says: {
      rest: {
        kid: 'Ruhe. Sogar jetzt verbrauchen deine Muskeln ein bisschen Sauerstoff, und dein Herz schlägt etwa 70 Mal in der Minute.',
        sci: 'Ruhe: etwa 0,25 L O2 pro Minute für den ganzen Körper, Herz etwa 70 Schläge/min, etwa 12 Atemzüge/min; das Blut verlässt die Gewebe zu etwa 75% gesättigt.',
      },
      walk: {
        kid: 'Gehen! Der Muskel braucht mehr Sauerstoff, also schlägt dein Herz schneller, und du atmest auch schneller.',
        sci: 'Gehen: etwa 1 L/min, das Vierfache der Ruhe. Herzfrequenz, Herzzeitvolumen und Atmung steigen, und der Muskel nimmt jedem roten Blutkörperchen mehr O2 ab.',
      },
      run: {
        kid: 'Laufen! Jetzt verbraucht dein Körper zehnmal so viel Sauerstoff wie in Ruhe. Schau, wie dunkel die roten Blutkörperchen sind, wenn sie gehen!',
        sci: 'Laufen: etwa 2,5 L/min, das Zehnfache der Ruhe. Das Herzzeitvolumen erreicht etwa 20 L/min, und der Muskel entnimmt den größten Teil des O2: venöses Blut etwa 35% gesättigt.',
      },
      sprint: {
        kid: 'Sprint! Der Sauerstoff kommt nicht schnell genug für all die Energie, die der Muskel will, also macht er etwas davon auf dem schnellen Weg, ohne Sauerstoff. Das hältst du nur kurz durch.',
        sci: 'Nahe am Maximum eines trainierten Läufers, etwa 3,5 bis 4 L/min, rund das 15-Fache der Ruhe. Oberhalb der Laktatschwelle überholt die Glykolyse die Mitochondrien, und Laktat sammelt sich an; das Tempo lässt sich nicht lange halten.',
      },
    },
    panel: {
      kid: [
        'Deine Muskeln bestehen aus langen Zellen, die Fasern heißen, jede etwa so dünn wie ein Haar, gestreift von winzigen Teilen, die ziehen. Ziehen kostet Energie, und die Energie entsteht mit der Hilfe von Sauerstoff.',
        'Je härter du arbeitest, desto mehr Sauerstoff nimmt der Muskel jedem roten Blutkörperchen ab, also fließt das Blut dunkler ab. Dein Herz schlägt schneller, und du atmest schneller, um mehr heranzuschaffen. Der Körper eines trainierten Läufers kann etwa 15-mal so viel Sauerstoff verbrauchen wie in Ruhe!',
      ],
      sci: [
        'Die Sauerstoffaufnahme (VO2) ist das Herzzeitvolumen mal dem O2, der jedem Liter Blut entnommen wird (das Fick-Prinzip, Adolf Fick, 1870): in Ruhe etwa 5 L/min × 50 mL/L = 250 mL/min. Bei Belastung steigen beide: das Herzzeitvolumen auf etwa 20 bis 25 L/min bei einem trainierten Erwachsenen, die Ausschöpfung auf etwa drei Viertel des O2.',
        'Die VO2max eines trainierten Läufers liegt bei etwa 4 L/min (etwa 60 mL/kg/min), rund das 15-Fache der Ruhe; Ausdauersportler der Weltspitze erreichen 5 bis 6 L/min. Myoglobin, der Cousin des Hämoglobins mit nur einem Platz, der Muskeln rot macht, übernimmt den O2 aus dem Blut und reicht ihn an die Mitochondrien weiter.',
      ],
    },
  },
  mito: {
    label: 'Das Kraftwerk',
    title: 'Ein Mitochondrium, das Kraftwerk',
    plate: 'Mitochondrium',
    chain: {
      title: { kid: 'Im Kraftwerk der Zelle', sci: 'Die Atmungskette' },
      food: { kid: 'Elektronen aus dem Essen', sci: 'NADH' },
      oxygen: { kid: 'Sauerstoff', sci: 'O2' },
      water: { kid: 'Wasser!', sci: '2 H2O' },
      turbine: { kid: 'Turbine', sci: 'ATP-Synthase' },
      atp: 'ATP',
      sum: { kid: 'Sauerstoff + Elektronen + H+ = Wasser', sci: 'O2 + 4 e− + 4 H+ → 2 H2O' },
      steps: {
        kid: [
          'Verbrauchte Elektronen aus deinem Essen kommen an.',
          'Sie laufen die Kette entlang und pumpen H+ durch die Wand.',
          'Am Ende fängt der Sauerstoff sie, mit H+: Wasser!',
          'Die H+ strömen durch die Turbine zurück, und sie macht ATP.',
        ],
        sci: [
          'NADH gibt zwei Elektronen an Komplex I.',
          'Elektronen durchlaufen I, III und IV; jeder Komplex pumpt H+ aus der Matrix.',
          'Komplex IV: O2 + 4 e− + 4 H+ → 2 H2O.',
          'H+ fließen durch die ATP-Synthase zurück, die sich dreht und ATP macht.',
        ],
      },
      sugar: { title: 'Ein Zucker', quick: 'schneller Weg', oxygen: 'mit Sauerstoff', total: 'etwa 30 ATP', lactate: 'Laktat: nur 2 ATP' },
    },
    hints: { watch: 'Tippe auf das Kraftwerk, um den Sauerstoff bei der Arbeit zu sehen', sugar: 'Tippe auf den Zucker, um den Muskel zu füttern' },
    buttons: { watch: 'Den Sauerstoff bei der Arbeit sehen', sugar: 'Dem Muskel einen Zucker geben' },
    says: {
      watch: {
        kid: 'Das ist ein Mitochondrium, eines der Kraftwerke des Muskels. Schau auf den Bildschirm: Verbrauchte Elektronen aus deinem Essen laufen eine Kette entlang, und am Ende fängt sie der Sauerstoff... und wird zu Wasser!',
        sci: 'Die Atmungskette: Elektronen aus NADH durchlaufen die Komplexe I, III und IV, die H+ durch die innere Membran pumpen. An Komplex IV: O2 + 4 e− + 4 H+ → 2 H2O. Die H+ fließen durch die ATP-Synthase zurück, die sich dreht und ATP macht.',
      },
      sugar: {
        kid: 'Lecker, ein Zucker! Zuerst zerfällt er auf dem schnellen Weg in zwei Hälften: 2 ATP. Dann holt das Kraftwerk mit Sauerstoff etwa 28 mehr heraus!',
        sci: 'Die Glykolyse spaltet Glukose in zwei Pyruvat (netto 2 ATP); mit O2 oxidieren die Mitochondrien sie und gewinnen etwa 28 mehr: etwa 30 ATP pro Glukose.',
      },
      quick: {
        kid: 'Beim Sprint reicht der Sauerstoff nicht! Der Zucker ging nur den schnellen Weg: bloß 2 ATP, etwa 15-mal weniger, und seine Hälften wurden zu Laktat.',
        sci: 'Sauerstofflimitiert: Pyruvat wird zu Laktat reduziert, um NAD+ zurückzugewinnen, und die Glukose liefert 2 ATP statt etwa 30.',
      },
    },
    panel: {
      kid: [
        'In jeder Muskelzelle stecken Hunderte, sogar Tausende Mitochondrien, die Kraftwerke der Zelle. Sie holen die Energie Stück für Stück aus deinem Essen und packen sie in ATP, winzige Energiepäckchen, mit denen deine Muskeln ziehen. Jeden Tag machst und verbrauchst du ungefähr dein eigenes Gewicht an ATP!',
        'Die Aufgabe des Sauerstoffs kommt ganz am Ende: Er fängt die verbrauchten Elektronen, zusammen mit Wasserstoff, und wird zu Wasser. Ohne Sauerstoff bleibt die Kette stehen, und der Muskel kann Energie nur auf dem schnellen Weg machen, der aus demselben Zucker etwa 15-mal weniger holt. Und eine Überraschung: Der Sauerstoff, den du einatmest, verlässt dich nicht im Kohlenstoffdioxid, das du ausatmest. Er wird zu Wasser!',
      ],
      sci: [
        'Die Elektronentransportkette in der inneren Mitochondrienmembran: Die Komplexe I, III und IV pumpen H+ aus der Matrix, während Elektronen von NADH zu O2 fließen, und die Cytochrom-c-Oxidase (Komplex IV) reduziert ihn: O2 + 4 e− + 4 H+ → 2 H2O. Der H+-Gradient treibt die ATP-Synthase an, einen Drehmotor (Peter Mitchells chemiosmotische Theorie, 1961, Nobelpreis 1978; Paul Boyer und John Walker, Nobelpreis 1997).',
        'Mit O2 liefert eine Glukose etwa 30 ATP (ältere Bücher nennen 36 bis 38); ohne ihn liefert die Glykolyse bis zum Laktat 2. Der eingeatmete O2 endet als Wasser: Versuche mit Sauerstoff-18 zeigen, dass der Sauerstoff im ausgeatmeten CO2 aus der Nahrung und aus Wasser stammt, während der O2 zu etwa 300 mL Stoffwechselwasser am Tag wird.',
      ],
    },
  },
}

export const BREATH_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
