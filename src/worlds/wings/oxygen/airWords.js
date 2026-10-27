// Every word of the air wing, in English and European Portuguese, at the two depths (kid: Explorer,
// sci: Scientist). Formulas are written plainly (O2); the panels get real subscripts (kit.chem).
// Sources for the numbers: dry air by volume (NOAA, CRC Handbook); O2 data (src/data/elements.json:
// boils at 90.2 K, melts at 54.36 K); ozone (WMO/UNEP Scientific Assessment of Ozone Depletion 2022);
// UV reaching the ground (WHO); the Great Oxidation Event (Lyons et al. 2014, Luo et al. 2016).

export const AIR_WORDS = {
  en: {
    back: "Back to oxygen's hall",
    kicker: 'The air',
    greet: {
      kid: 'Welcome to the sky deck! All around you is air, and 21 of every 100 of its molecules are me: oxygen. Look round, and press E at anything that glows.',
      sci: 'The sky deck. Dry air by volume: 78.08% nitrogen, 20.95% oxygen, 0.93% argon, about 0.04% carbon dioxide. Each exhibit is about the O2 in it.',
    },
    box: {
      title: 'The box of air',
      screenTitle: '100 molecules of air',
      label: 'The box of air',
      verbs: { O2: 'Find the oxygen', N2: 'Show the nitrogen', Ar: 'Find the argon', all: 'Show them all' },
      says: {
        O2: { kid: '21 red pairs: that is me, oxygen, about a fifth of the air.', sci: 'O2: 21 of 100 (20.95% by volume).' },
        N2: { kid: '78 blue pairs: nitrogen, most of the air. It hardly reacts with anything.', sci: 'N2: 78 of 100 (78.08%). Its triple bond (945 kJ/mol) makes it very unreactive.' },
        Ar: { kid: 'Just one argon atom, all alone: a noble gas holds nobody\'s hand.', sci: 'Ar: about 1 in 100 (0.93%), made by the decay of potassium-40 in rocks.' },
        all: { kid: 'All 100 together: that is air.', sci: 'Dry air: 78 N2, 21 O2, 1 Ar per 100 molecules.' },
      },
      panel: {
        kid: [
          { p: 'This box holds 100 molecules of air, mixed just like the real air around you.' },
          { big: '21 of 100', small: 'are oxygen (the red pairs)' },
          { list: ['78 are nitrogen (the blue pairs)', '21 are oxygen (the red pairs): that is me!', '1 is argon (a single atom: it holds no hands)'] },
          { p: 'In real air the molecules are tiny and far apart. They zoom about faster than a jet plane and bump into each other billions of times every second.' },
          { p: 'Press E again to find the other gases.' },
        ],
        sci: [
          { p: 'One hundred molecules in the proportions of dry air by volume. For a gas, the share by volume is the share of molecules (Avogadro\'s law).' },
          { rows: [['Nitrogen, N2', '78.08%'], ['Oxygen, O2', '20.95%'], ['Argon, Ar', '0.93%'], ['Carbon dioxide, CO2', 'about 0.04%'], ['Neon, helium, methane, krypton...', 'under 0.003%']] },
          { p: 'Water vapour is not part of dry air: it varies from almost 0 to about 4%.' },
          { p: 'At 20 °C and 1 atm a cubic metre of air holds about 2.5 × 10²⁵ molecules, on average 3.4 nm apart, ten times their own size. N2 averages 470 m/s and O2 440 m/s (mean speed goes as 1/√M). Each molecule collides about 7 billion times a second, travelling some 68 nm between collisions.' },
          { p: 'In the box the molecules are drawn huge and slow, but they move by the same rules: straight lines, elastic collisions, the heavier ones slower.' },
        ],
      },
    },
    rare: {
      title: 'The rare one: carbon dioxide',
      label: 'The rare one: carbon dioxide',
      verb: 'Look at',
      tag: '1 in about 2400',
      panel: {
        kid: [
          { p: 'Carbon dioxide is so rare in the air that it does not fit in the big box: you would need about 2400 molecules of air to find one!' },
          { big: '1 in 2400', small: 'molecules of air is carbon dioxide' },
          { p: 'But it matters a lot. Plants take it in to make their food (and give out oxygen), and it keeps the Earth warm like a blanket. Burning coal, oil and gas adds more of it every year.' },
        ],
        sci: [
          { big: 'about 0.042%', small: 'over 420 ppm, one molecule in about 2400' },
          { p: 'Before the Industrial Revolution CO2 was about 280 ppm. It now rises by 2 to 3 ppm a year, mainly from burning fossil fuels; measured continuously at Mauna Loa since 1958 (the Keeling curve).' },
          { p: 'A greenhouse gas: it lets sunlight through but absorbs part of the infrared the Earth gives off. Photosynthesis takes it in: 6 CO2 + 6 H2O → C6H12O6 + 6 O2.' },
        ],
      },
    },
    o2: {
      title: 'O2 up close',
      label: 'The oxygen molecule',
      verbs: { show: 'Show its electrons', hide: 'Hide its electrons' },
      screen: { kid: 'a double bond: two hands each', sci: 'O=O · 121 pm · 498 kJ/mol' },
      says: {
        show: { kid: 'Twelve outer electrons: four shared in the double bond, eight in pairs at home.', sci: 'Lewis: one σ and one π bond, two lone pairs on each atom. But see the two lit up: unpaired, in π*.' },
        hide: { kid: 'Two oxygen atoms holding both hands: that is O2.', sci: 'Bond order (8 − 4) / 2 = 2.' },
      },
      panel: {
        kid: [
          { p: 'Oxygen atoms almost never travel alone: in the air they go in pairs, as O2.' },
          { p: 'Each oxygen atom has two hands, and here the two atoms hold both hands at once. That is a double bond: the two sticks between the red balls.' },
          { p: 'The screen shows how chemists draw it (a Lewis diagram): the two lines are the double bond, the dots are the electrons that stay at home, in pairs.' },
        ],
        sci: [
          { rows: [['Bond', 'O=O, a double bond'], ['Bond length', '121 pm'], ['Bond energy', '498 kJ/mol'], ['Outer electrons', '12 (6 + 6)']] },
          { p: 'The Lewis diagram pairs up every electron, and it is wrong in one detail. Molecular orbital theory puts the last two electrons one in each of two π* orbitals, with parallel spins: the ground state of O2 is a triplet. Bond order (8 − 4) / 2 = 2, still a double bond.' },
          { p: 'Unpaired electrons are tiny magnets, so O2 is paramagnetic: it is pulled into a magnetic field. The magnet next to this model shows it with liquid oxygen.' },
          { p: 'The triplet state is also why O2 reacts slowly with most things at room temperature, though burning releases so much energy: the spins must flip first.' },
        ],
      },
    },
    magnet: {
      title: 'Liquid oxygen and a magnet',
      label: 'The magnet',
      verbs: { lox: 'Pour liquid oxygen', ln2: 'Pour liquid nitrogen' },
      screen: { kid: 'liquid oxygen sticks to a magnet', sci: 'boils at 90.2 K · paramagnetic' },
      says: {
        lox: { kid: 'Liquid oxygen: pale blue, and it hangs between the poles of the magnet!', sci: 'LOX, 90 K: drawn into the strongest field, between the poles, by its two unpaired electrons.' },
        ln2: { kid: 'Liquid nitrogen is not magnetic: it falls straight through.', sci: 'N2 is diamagnetic (all electrons paired): it pours through the gap and boils away at 77 K.' },
      },
      panel: {
        kid: [
          { p: 'Cooled to −183 °C, oxygen turns into a liquid, and the liquid is pale blue.' },
          { p: 'Pour it onto a strong magnet and it sticks! It hangs between the poles like a little bridge until it boils away.' },
          { p: 'Press E again to pour liquid nitrogen: it is not magnetic, so it falls straight through.' },
        ],
        sci: [
          { rows: [['Boiling point', '90.2 K (−183.0 °C)'], ['Melting point', '54.36 K (−218.8 °C)'], ['Liquid density', '1.141 g/cm³'], ['Colour', 'pale blue']] },
          { p: 'O2 is paramagnetic: its two unpaired π* electrons give each molecule a magnetic moment, so the liquid is drawn into the strongest part of the field, the gap between the poles.' },
          { p: 'N2 has all its electrons paired (diamagnetic): liquid nitrogen (77 K, −196 °C) pours straight through.' },
          { p: 'The blue: pairs of colliding O2 molecules absorb red, orange and yellow light together, in shared transitions to excited states, which leaves the blue.' },
        ],
      },
    },
    ozone: {
      title: 'The ozone layer',
      label: 'The ozone layer',
      verb: 'Send the Sun\'s UV',
      screen: { kid: 'the Earth\'s sunscreen', sci: 'stops all UV-C and most UV-B' },
      big: '15 to 35 km up',
      km: 'km',
      layer: 'ozone layer',
      everest: 'Everest 8.8 km',
      jet: 'jet plane 11 km',
      kinds: { A: 'UV-A', B: 'UV-B', C: 'UV-C' },
      passed: 'reach the ground',
      says: {
        kid: 'Ozone catches the dangerous UV-C and most UV-B. UV-A gets through: that is why you still need sunscreen!',
        sci: 'UV-C absorbed completely, about 90% of UV-B absorbed, UV-A mostly transmitted.',
      },
      panel: {
        kid: [
          { p: 'High above the clouds, from about 15 to 35 km up, there is a layer with a lot of ozone: molecules of three oxygen atoms, O3, bent like a boomerang.' },
          { p: 'Ozone is the Earth\'s sunscreen. It catches the Sun\'s most dangerous ultraviolet rays (UV) before they reach us. Look up: the glowing band in the sky is the ozone layer at work.' },
          { list: ['UV-C: all stopped', 'UV-B: most stopped', 'UV-A: most gets through (so we still need sunscreen!)'] },
          { p: 'If you squeezed all the ozone down to the ground, it would make a layer only 3 mm thick, like two coins.' },
        ],
        sci: [
          { rows: [['Molecule', 'O3, bent, 116.8°'], ['Bond length', '128 pm, between single and double (resonance)'], ['Where', 'stratosphere, 15 to 35 km, densest near 20 to 25 km'], ['Amount', 'about 300 Dobson units: 3 mm at 0 °C and 1 atm']] },
          { p: 'Made and destroyed by sunlight (the Chapman cycle): UV below 242 nm splits O2 into two O atoms, each O joins an O2 to make O3; O3 absorbs UV (200 to 320 nm) and splits again, turning the light into heat. That is why the stratosphere gets warmer with height.' },
          { p: 'UV-C (100 to 280 nm) never reaches the ground; about 90% of UV-B (280 to 315 nm) is absorbed; UV-A (315 to 400 nm) mostly passes.' },
          { p: 'The ozone hole: chlorine and bromine from CFCs and halons destroyed ozone over Antarctica each spring. The Montreal Protocol (1987), later ratified by every country in the world, phased them out; the layer is healing and should be back to its 1980 state by about 2066 over Antarctica.' },
        ],
      },
    },
    sources: {
      title: 'Where our oxygen comes from',
      label: 'Where our oxygen comes from',
      verbs: { land: 'Show the land\'s oxygen', ocean: 'Show the ocean\'s oxygen' },
      screen: { kid: 'about half from the ocean, half from the land', sci: 'photosynthesis: the oxygen comes from water' },
      land: 'Land',
      ocean: 'Ocean',
      says: {
        land: { kid: 'Forests and every green plant on land: about half of the oxygen.', sci: 'Land plants, above all tropical forests: roughly half of global photosynthesis.' },
        ocean: { kid: 'Tiny algae and bacteria in the sea, too small to see: the other half!', sci: 'Phytoplankton: diatoms, coccolithophores, cyanobacteria (Prochlorococcus, Synechococcus): roughly half.' },
      },
      panel: {
        kid: [
          { p: 'Almost all the oxygen in the air was made by living things that use sunlight: green plants on land, and tiny algae and bacteria floating in the sea, called phytoplankton.' },
          { big: 'About half', small: 'of the oxygen made each year comes from the ocean' },
          { p: 'They take in carbon dioxide and water and, with the energy of light, make sugar for food and give out oxygen. This is photosynthesis.' },
          { p: 'Press E again to switch between the land and the ocean.' },
        ],
        sci: [
          { p: 'Photosynthesis: 6 CO2 + 6 H2O + light → C6H12O6 + 6 O2. The oxygen given out comes from the water, not from the CO2 (shown in 1941 with water labelled with oxygen-18).' },
          { p: 'The ocean\'s phytoplankton (diatoms, coccolithophores and cyanobacteria such as Prochlorococcus, the most abundant photosynthesising organism on Earth) makes roughly half of the world\'s oxygen; land plants, above all tropical forests, most of the rest.' },
          { p: 'Almost all of it is used again within a year by breathing and decay. The 21% in the air is a store built up over hundreds of millions of years, from organic matter buried in rocks instead of rotting.' },
        ],
      },
    },
    goe: {
      title: 'The Great Oxidation',
      label: 'The Great Oxidation',
      verb: 'Travel through time',
      screen: { kid: '2.4 billion years ago', sci: 'about 2.4 to 2.1 billion years ago' },
      axis: { now: 'now', ago: 'billion years ago', o2: 'O2 in the air' },
      when: ga => (ga >= 0.995 ? `${ga.toFixed(1)} billion years ago` : ga > 0.004 ? `${Math.round(ga * 1000)} million years ago` : 'today'),
      marks: {
        earth: 'Earth forms',
        stromatolites: 'first stromatolites',
        goe: 'Great Oxidation',
        animals: 'first animals',
        dinos: 'dinosaurs',
        today: 'today 21%',
      },
      says: {
        kid: 'For half of Earth\'s history there was almost no oxygen. Cyanobacteria changed the whole planet!',
        sci: 'GOE about 2.4 Ga; a second rise, the Neoproterozoic Oxygenation, about 0.8 to 0.54 Ga.',
      },
      panel: {
        kid: [
          { p: 'For the first half of Earth\'s history the air had almost no oxygen. You could not have breathed it.' },
          { p: 'Then tiny bacteria, cyanobacteria, learned to make food from sunlight and water, giving out oxygen. They lived in slimy mats that built rocks layer by layer: stromatolites, like the ones in this pool. Living ones still grow in Shark Bay, in Australia.' },
          { p: 'About 2.4 billion years ago oxygen began to build up in the air: the Great Oxidation. First it rusted the iron dissolved in the seas (old rocks still show red stripes of it), and then it filled the sky.' },
          { p: 'Much later, oxygen let big animals evolve. Today it is 21% of the air.' },
        ],
        sci: [
          { rows: [['Earth forms', '4.54 billion years ago'], ['Oldest stromatolites', 'about 3.5 billion years ago'], ['Great Oxidation Event', 'about 2.4 to 2.1 billion years ago'], ['Neoproterozoic Oxygenation', 'about 800 to 540 million years ago'], ['Late Paleozoic peak', 'perhaps 30%, about 300 million years ago (models)'], ['Today', '20.95%']] },
          { p: 'Cyanobacteria invented oxygen-making photosynthesis, probably well before 2.4 billion years ago, but at first the oxygen was used up by dissolved iron, volcanic gases and sulfides. Banded iron formations record the iron of the oceans oxidising and settling as iron oxides.' },
          { p: 'A key clue: sulfur isotopes stop showing mass-independent fractionation about 2.33 billion years ago. That signal needs an atmosphere with almost no O2, so its end dates the rise.' },
          { p: 'The oxygen also made the ozone layer possible, which later shielded life as it moved onto land.' },
        ],
      },
    },
    breath: {
      title: 'Breathing',
      label: 'Breathing',
      verb: 'Take a breath',
      in: 'Air in',
      out: 'Air out',
      gas: { N2: 'nitrogen', O2: 'oxygen', CO2: 'carbon dioxide', Ar: 'argon' },
      trace: 'almost none',
      screen: { kid: 'you keep about a quarter of the oxygen', sci: 'in: 21% oxygen; out: about 16%, and 4% carbon dioxide' },
      says: {
        kid: 'Breathe in: oxygen goes into your blood. Breathe out: carbon dioxide comes back out.',
        sci: 'About a quarter of the inhaled O2 is taken up; CO2 rises a hundredfold, from 0.04% to about 4%.',
      },
      panel: {
        kid: [
          { p: 'Your lungs take oxygen from the air, and your blood carries it to every part of your body, where it burns food slowly to give you energy.' },
          { rows: [['Air in', '21% oxygen, almost no carbon dioxide'], ['Air out', 'about 16% oxygen and 4% carbon dioxide']] },
          { p: 'You only use about a quarter of the oxygen you breathe in. That is why the air you blow out can still save a life in rescue breathing!' },
        ],
        sci: [
          { rows: [['O2', '20.9% in, about 16% out'], ['CO2', '0.04% in, about 4% out'], ['N2', '78% in and out (not used)'], ['Water vapour', 'out: saturated, about 6% at 37 °C']] },
          { p: 'Cellular respiration: C6H12O6 + 6 O2 → 6 CO2 + 6 H2O + energy (stored as ATP), photosynthesis in reverse. At rest an adult takes up about 250 mL of O2 a minute.' },
          { p: 'In the lungs O2 crosses into the blood and binds to haemoglobin in the red blood cells, four O2 to each haemoglobin.' },
        ],
      },
    },
  },

  'pt-pt': {
    back: 'Voltar ao salão do oxigénio',
    kicker: 'O ar',
    greet: {
      kid: 'Bem-vindo ao miradouro do céu! À tua volta está o ar, e 21 em cada 100 das suas moléculas sou eu: o oxigénio. Olha à volta e carrega no E em tudo o que brilha.',
      sci: 'O miradouro do céu. Ar seco, em volume: 78,08% de azoto, 20,95% de oxigénio, 0,93% de árgon e cerca de 0,04% de dióxido de carbono. Cada experiência fala do O2 que lá está.',
    },
    box: {
      title: 'A caixa de ar',
      screenTitle: '100 moléculas de ar',
      label: 'A caixa de ar',
      verbs: { O2: 'Procurar o oxigénio', N2: 'Mostrar o azoto', Ar: 'Procurar o árgon', all: 'Mostrar todas' },
      says: {
        O2: { kid: '21 pares vermelhos: sou eu, o oxigénio, cerca de um quinto do ar.', sci: 'O2: 21 em 100 (20,95% em volume).' },
        N2: { kid: '78 pares azuis: o azoto, a maior parte do ar. Quase não reage com nada.', sci: 'N2: 78 em 100 (78,08%). A ligação tripla (945 kJ/mol) torna-o muito pouco reativo.' },
        Ar: { kid: 'Um só átomo de árgon, sozinho: um gás nobre não dá a mão a ninguém.', sci: 'Ar: cerca de 1 em 100 (0,93%), formado pelo decaimento do potássio-40 das rochas.' },
        all: { kid: 'As 100 juntas: isto é o ar.', sci: 'Ar seco: 78 N2, 21 O2 e 1 Ar em cada 100 moléculas.' },
      },
      panel: {
        kid: [
          { p: 'Esta caixa tem 100 moléculas de ar, misturadas tal e qual como o ar verdadeiro à tua volta.' },
          { big: '21 em 100', small: 'são de oxigénio (os pares vermelhos)' },
          { list: ['78 são de azoto (os pares azuis)', '21 são de oxigénio (os pares vermelhos): sou eu!', '1 é de árgon (um átomo sozinho: não dá a mão a ninguém)'] },
          { p: 'No ar verdadeiro as moléculas são minúsculas e estão afastadas umas das outras. Andam mais depressa do que um avião a jato e chocam umas com as outras milhares de milhões de vezes por segundo.' },
          { p: 'Carrega outra vez no E para encontrar os outros gases.' },
        ],
        sci: [
          { p: 'Cem moléculas nas proporções do ar seco em volume. Num gás, a fração em volume é a fração de moléculas (lei de Avogadro).' },
          { rows: [['Azoto, N2', '78,08%'], ['Oxigénio, O2', '20,95%'], ['Árgon, Ar', '0,93%'], ['Dióxido de carbono, CO2', 'cerca de 0,04%'], ['Néon, hélio, metano, crípton...', 'menos de 0,003%']] },
          { p: 'O vapor de água não faz parte do ar seco: varia de quase 0 a cerca de 4%.' },
          { p: 'A 20 °C e 1 atm, um metro cúbico de ar tem cerca de 2,5 × 10²⁵ moléculas, em média a 3,4 nm umas das outras, dez vezes o seu próprio tamanho. O N2 anda em média a 470 m/s e o O2 a 440 m/s (a velocidade média varia com 1/√M). Cada molécula choca cerca de 7 mil milhões de vezes por segundo e percorre uns 68 nm entre choques.' },
          { p: 'Na caixa as moléculas estão desenhadas enormes e lentas, mas movem-se pelas mesmas regras: em linha reta, com choques elásticos, as mais pesadas mais devagar.' },
        ],
      },
    },
    rare: {
      title: 'A rara: o dióxido de carbono',
      label: 'A rara: o dióxido de carbono',
      verb: 'Ver',
      tag: '1 em cerca de 2400',
      panel: {
        kid: [
          { p: 'O dióxido de carbono é tão raro no ar que não cabe na caixa grande: precisavas de cerca de 2400 moléculas de ar para encontrar uma!' },
          { big: '1 em 2400', small: 'moléculas de ar é de dióxido de carbono' },
          { p: 'Mas é muito importante. As plantas absorvem-no para fazer o seu alimento (e libertam oxigénio), e ele mantém a Terra quente como um cobertor. Queimar carvão, petróleo e gás acrescenta mais todos os anos.' },
        ],
        sci: [
          { big: 'cerca de 0,042%', small: 'mais de 420 ppm, uma molécula em cerca de 2400' },
          { p: 'Antes da Revolução Industrial o CO2 estava em cerca de 280 ppm. Hoje sobe 2 a 3 ppm por ano, sobretudo pela queima de combustíveis fósseis; é medido sem parar em Mauna Loa desde 1958 (a curva de Keeling).' },
          { p: 'Um gás com efeito de estufa: deixa passar a luz do Sol mas absorve parte do infravermelho que a Terra emite. A fotossíntese consome-o: 6 CO2 + 6 H2O → C6H12O6 + 6 O2.' },
        ],
      },
    },
    o2: {
      title: 'O O2 de perto',
      label: 'A molécula de oxigénio',
      verbs: { show: 'Mostrar os eletrões', hide: 'Esconder os eletrões' },
      screen: { kid: 'uma ligação dupla: duas mãos cada', sci: 'O=O · 121 pm · 498 kJ/mol' },
      says: {
        show: { kid: 'Doze eletrões de fora: quatro partilhados na ligação dupla, oito em pares em casa.', sci: 'Lewis: uma ligação σ e uma π, dois pares não ligantes em cada átomo. Mas repara nos dois acesos: desemparelhados, em π*.' },
        hide: { kid: 'Dois átomos de oxigénio de mãos dadas com as duas mãos: isto é o O2.', sci: 'Ordem de ligação (8 − 4) / 2 = 2.' },
      },
      panel: {
        kid: [
          { p: 'Os átomos de oxigénio quase nunca andam sozinhos: no ar andam aos pares, como O2.' },
          { p: 'Cada átomo de oxigénio tem duas mãos, e aqui os dois átomos dão as duas mãos ao mesmo tempo. É uma ligação dupla: os dois pauzinhos entre as bolas vermelhas.' },
          { p: 'O ecrã mostra como os químicos a desenham (uma fórmula de Lewis): os dois traços são a ligação dupla, os pontos são os eletrões que ficam em casa, aos pares.' },
        ],
        sci: [
          { rows: [['Ligação', 'O=O, ligação dupla'], ['Comprimento de ligação', '121 pm'], ['Energia de ligação', '498 kJ/mol'], ['Eletrões de valência', '12 (6 + 6)']] },
          { p: 'A fórmula de Lewis emparelha todos os eletrões, e erra num pormenor. A teoria das orbitais moleculares põe os dois últimos eletrões um em cada uma de duas orbitais π*, com spins paralelos: o estado fundamental do O2 é um tripleto. Ordem de ligação (8 − 4) / 2 = 2, continua a ser dupla.' },
          { p: 'Eletrões desemparelhados são ímanes minúsculos, por isso o O2 é paramagnético: é atraído para um campo magnético. O íman ao lado deste modelo mostra-o com oxigénio líquido.' },
          { p: 'O estado tripleto explica também porque é que o O2 reage devagar com quase tudo à temperatura ambiente, apesar de a combustão libertar tanta energia: os spins têm de se inverter primeiro.' },
        ],
      },
    },
    magnet: {
      title: 'Oxigénio líquido e um íman',
      label: 'O íman',
      verbs: { lox: 'Deitar oxigénio líquido', ln2: 'Deitar azoto líquido' },
      screen: { kid: 'o oxigénio líquido agarra-se a um íman', sci: 'ferve a 90,2 K · paramagnético' },
      says: {
        lox: { kid: 'Oxigénio líquido: azul-claro, e fica pendurado entre os polos do íman!', sci: 'LOX a 90 K: puxado para o campo mais forte, entre os polos, pelos seus dois eletrões desemparelhados.' },
        ln2: { kid: 'O azoto líquido não é magnético: cai a direito.', sci: 'O N2 é diamagnético (eletrões todos emparelhados): escorre pelo intervalo e ferve a 77 K.' },
      },
      panel: {
        kid: [
          { p: 'Arrefecido a −183 °C, o oxigénio passa a líquido, e esse líquido é azul-claro.' },
          { p: 'Deita-o num íman forte e ele agarra-se! Fica pendurado entre os polos como uma pontezinha, até ferver e desaparecer.' },
          { p: 'Carrega outra vez no E para deitar azoto líquido: não é magnético, por isso cai a direito.' },
        ],
        sci: [
          { rows: [['Ponto de ebulição', '90,2 K (−183,0 °C)'], ['Ponto de fusão', '54,36 K (−218,8 °C)'], ['Densidade do líquido', '1,141 g/cm³'], ['Cor', 'azul-claro']] },
          { p: 'O O2 é paramagnético: os seus dois eletrões π* desemparelhados dão a cada molécula um momento magnético, por isso o líquido é puxado para a zona de campo mais forte, o intervalo entre os polos.' },
          { p: 'O N2 tem os eletrões todos emparelhados (diamagnético): o azoto líquido (77 K, −196 °C) passa a direito.' },
          { p: 'O azul: pares de moléculas de O2 que chocam absorvem juntas luz vermelha, laranja e amarela, em transições partilhadas para estados excitados, e sobra o azul.' },
        ],
      },
    },
    ozone: {
      title: 'A camada de ozono',
      label: 'A camada de ozono',
      verb: 'Enviar os raios UV do Sol',
      screen: { kid: 'o protetor solar da Terra', sci: 'trava toda a UV-C e a maior parte da UV-B' },
      big: '15 a 35 km de altura',
      km: 'km',
      layer: 'camada de ozono',
      everest: 'Evereste 8,8 km',
      jet: 'avião a jato 11 km',
      kinds: { A: 'UV-A', B: 'UV-B', C: 'UV-C' },
      passed: 'chegam ao chão',
      says: {
        kid: 'O ozono apanha a perigosa UV-C e quase toda a UV-B. A UV-A passa: é por isso que ainda precisas de protetor solar!',
        sci: 'UV-C absorvida por completo, cerca de 90% da UV-B absorvida, a UV-A passa quase toda.',
      },
      panel: {
        kid: [
          { p: 'Muito acima das nuvens, entre cerca de 15 e 35 km de altura, há uma camada com muito ozono: moléculas de três átomos de oxigénio, O3, dobradas como um bumerangue.' },
          { p: 'O ozono é o protetor solar da Terra. Apanha os raios ultravioleta (UV) mais perigosos do Sol antes de chegarem até nós. Olha para cima: a faixa que brilha no céu é a camada de ozono a trabalhar.' },
          { list: ['UV-C: travada toda', 'UV-B: travada quase toda', 'UV-A: passa quase toda (por isso ainda precisamos de protetor solar!)'] },
          { p: 'Se apertasses todo o ozono junto ao chão, fazia uma camada com apenas 3 mm de espessura, como duas moedas.' },
        ],
        sci: [
          { rows: [['Molécula', 'O3, angular, 116,8°'], ['Comprimento de ligação', '128 pm, entre simples e dupla (ressonância)'], ['Onde', 'estratosfera, 15 a 35 km, mais densa perto dos 20 a 25 km'], ['Quantidade', 'cerca de 300 unidades Dobson: 3 mm a 0 °C e 1 atm']] },
          { p: 'Formado e destruído pela luz do Sol (o ciclo de Chapman): a UV abaixo de 242 nm parte o O2 em dois átomos de O, cada O junta-se a um O2 e forma O3; o O3 absorve UV (200 a 320 nm) e parte-se de novo, transformando a luz em calor. É por isso que a estratosfera aquece com a altitude.' },
          { p: 'A UV-C (100 a 280 nm) nunca chega ao chão; cerca de 90% da UV-B (280 a 315 nm) é absorvida; a UV-A (315 a 400 nm) passa quase toda.' },
          { p: 'O buraco do ozono: o cloro e o bromo dos CFC e halons destruíam o ozono sobre a Antártida em cada primavera. O Protocolo de Montreal (1987), depois ratificado por todos os países do mundo, acabou com eles; a camada está a recuperar e deve voltar ao estado de 1980 por volta de 2066 sobre a Antártida.' },
        ],
      },
    },
    sources: {
      title: 'De onde vem o nosso oxigénio',
      label: 'De onde vem o nosso oxigénio',
      verbs: { land: 'Mostrar o oxigénio da terra', ocean: 'Mostrar o oxigénio do mar' },
      screen: { kid: 'cerca de metade do mar, metade da terra', sci: 'fotossíntese: o oxigénio vem da água' },
      land: 'Terra',
      ocean: 'Mar',
      says: {
        land: { kid: 'As florestas e todas as plantas verdes em terra: cerca de metade do oxigénio.', sci: 'Plantas terrestres, sobretudo as florestas tropicais: cerca de metade da fotossíntese do planeta.' },
        ocean: { kid: 'Algas e bactérias minúsculas no mar, pequenas demais para se verem: a outra metade!', sci: 'Fitoplâncton: diatomáceas, cocolitóforos, cianobactérias (Prochlorococcus, Synechococcus): cerca de metade.' },
      },
      panel: {
        kid: [
          { p: 'Quase todo o oxigénio do ar foi feito por seres vivos que usam a luz do Sol: as plantas verdes em terra, e algas e bactérias minúsculas que flutuam no mar, o fitoplâncton.' },
          { big: 'Cerca de metade', small: 'do oxigénio produzido em cada ano vem do mar' },
          { p: 'Absorvem dióxido de carbono e água e, com a energia da luz, fazem açúcar para se alimentarem e libertam oxigénio. Isto é a fotossíntese.' },
          { p: 'Carrega outra vez no E para trocar entre a terra e o mar.' },
        ],
        sci: [
          { p: 'Fotossíntese: 6 CO2 + 6 H2O + luz → C6H12O6 + 6 O2. O oxigénio libertado vem da água, não do CO2 (demonstrado em 1941 com água marcada com oxigénio-18).' },
          { p: 'O fitoplâncton dos oceanos (diatomáceas, cocolitóforos e cianobactérias como a Prochlorococcus, o ser fotossintético mais abundante da Terra) produz cerca de metade do oxigénio do mundo; as plantas terrestres, sobretudo as florestas tropicais, quase todo o resto.' },
          { p: 'Quase todo é gasto de novo no próprio ano pela respiração e pela decomposição. Os 21% do ar são uma reserva acumulada ao longo de centenas de milhões de anos, a partir de matéria orgânica enterrada nas rochas em vez de apodrecer.' },
        ],
      },
    },
    goe: {
      title: 'A Grande Oxidação',
      label: 'A Grande Oxidação',
      verb: 'Viajar no tempo',
      screen: { kid: 'há 2,4 mil milhões de anos', sci: 'há cerca de 2,4 a 2,1 mil milhões de anos' },
      axis: { now: 'hoje', ago: 'mil milhões de anos atrás', o2: 'O2 no ar' },
      when: ga => (ga >= 0.995 ? `há ${ga.toFixed(1).replace('.', ',')} mil milhões de anos` : ga > 0.004 ? `há ${Math.round(ga * 1000)} milhões de anos` : 'hoje'),
      marks: {
        earth: 'forma-se a Terra',
        stromatolites: 'primeiros estromatólitos',
        goe: 'Grande Oxidação',
        animals: 'primeiros animais',
        dinos: 'dinossauros',
        today: 'hoje 21%',
      },
      says: {
        kid: 'Durante metade da história da Terra quase não havia oxigénio. As cianobactérias mudaram o planeta inteiro!',
        sci: 'Grande Oxidação há cerca de 2,4 Ga; uma segunda subida, a Oxigenação Neoproterozoica, há cerca de 0,8 a 0,54 Ga.',
      },
      panel: {
        kid: [
          { p: 'Durante a primeira metade da história da Terra o ar quase não tinha oxigénio. Não o conseguirias respirar.' },
          { p: 'Depois, bactérias minúsculas, as cianobactérias, aprenderam a fazer alimento com a luz do Sol e a água, libertando oxigénio. Viviam em tapetes viscosos que construíam rochas camada a camada: os estromatólitos, como os deste lago. Ainda há estromatólitos vivos a crescer em Shark Bay, na Austrália.' },
          { p: 'Há cerca de 2,4 mil milhões de anos o oxigénio começou a acumular-se no ar: a Grande Oxidação. Primeiro enferrujou o ferro dissolvido nos mares (as rochas antigas ainda mostram riscas vermelhas disso), e depois encheu o céu.' },
          { p: 'Muito mais tarde, o oxigénio permitiu que aparecessem os animais grandes. Hoje é 21% do ar.' },
        ],
        sci: [
          { rows: [['Forma-se a Terra', 'há 4,54 mil milhões de anos'], ['Estromatólitos mais antigos', 'há cerca de 3,5 mil milhões de anos'], ['Grande Oxidação', 'há cerca de 2,4 a 2,1 mil milhões de anos'], ['Oxigenação Neoproterozoica', 'há cerca de 800 a 540 milhões de anos'], ['Máximo do Paleozoico Superior', 'talvez 30%, há cerca de 300 milhões de anos (modelos)'], ['Hoje', '20,95%']] },
          { p: 'As cianobactérias inventaram a fotossíntese que liberta oxigénio, provavelmente bem antes de há 2,4 mil milhões de anos, mas ao início o oxigénio era gasto pelo ferro dissolvido, pelos gases vulcânicos e pelos sulfuretos. As formações de ferro bandado registam o ferro dos oceanos a oxidar-se e a depositar-se como óxidos de ferro.' },
          { p: 'Uma pista-chave: os isótopos de enxofre deixam de mostrar fracionamento independente da massa há cerca de 2,33 mil milhões de anos. Esse sinal exige uma atmosfera quase sem O2, por isso o seu fim data a subida.' },
          { p: 'O oxigénio tornou também possível a camada de ozono, que mais tarde protegeu a vida quando esta passou para terra.' },
        ],
      },
    },
    breath: {
      title: 'Respirar',
      label: 'Respirar',
      verb: 'Respirar fundo',
      in: 'Ar que entra',
      out: 'Ar que sai',
      gas: { N2: 'azoto', O2: 'oxigénio', CO2: 'dióxido de carbono', Ar: 'árgon' },
      trace: 'quase nada',
      screen: { kid: 'ficas com cerca de um quarto do oxigénio', sci: 'entra 21% de oxigénio; sai cerca de 16%, e 4% de dióxido de carbono' },
      says: {
        kid: 'Inspira: o oxigénio vai para o teu sangue. Expira: o dióxido de carbono volta para o ar.',
        sci: 'Cerca de um quarto do O2 inspirado é absorvido; o CO2 aumenta cem vezes, de 0,04% para cerca de 4%.',
      },
      panel: {
        kid: [
          { p: 'Os teus pulmões tiram o oxigénio do ar, e o sangue leva-o a todas as partes do corpo, onde queima os alimentos devagarinho para te dar energia.' },
          { rows: [['Ar que entra', '21% de oxigénio, quase nada de dióxido de carbono'], ['Ar que sai', 'cerca de 16% de oxigénio e 4% de dióxido de carbono']] },
          { p: 'Só usas cerca de um quarto do oxigénio que inspiras. É por isso que o ar que expiras ainda pode salvar uma vida na respiração boca a boca!' },
        ],
        sci: [
          { rows: [['O2', '20,9% à entrada, cerca de 16% à saída'], ['CO2', '0,04% à entrada, cerca de 4% à saída'], ['N2', '78% à entrada e à saída (não é usado)'], ['Vapor de água', 'à saída: saturado, cerca de 6% a 37 °C']] },
          { p: 'Respiração celular: C6H12O6 + 6 O2 → 6 CO2 + 6 H2O + energia (guardada como ATP), a fotossíntese ao contrário. Em repouso, um adulto absorve cerca de 250 mL de O2 por minuto.' },
          { p: 'Nos pulmões o O2 passa para o sangue e liga-se à hemoglobina dos glóbulos vermelhos, quatro O2 por cada hemoglobina.' },
        ],
      },
    },
  },
}
