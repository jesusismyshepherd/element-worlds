// The words of oxygen's aurora room ("Who paints the sky green?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/O.js (the
// easel shows it). Each step is done by tapping its thing: `hints` are what the prompt shows as the next step,
// `verbs` the panels' buttons that do the same. `signs` are drawn in 3D (plain text: "N2+", "1S", no
// subscripts or superscripts); the panels are HTML. {placeholders} are filled in by the scene.
// Sources (checked 2026-10-31): Wikipedia "Aurora" (557.7 nm in about 0.7 s, 630.0 nm up to two minutes,
// collisional quenching low down, the sharp lower edge from atomic oxygen thinning below about 100 km,
// nitrogen's blue and purple at the lower edge, the auroral zone centred on about 67°, electrons accelerated
// in the last few tens of thousands of kilometres); atoptics.co.uk (the red line's lifetime about 110 s, only
// above 150 km; other sources 107 s, and red from 200 km); NOAA SWPC's space weather scales (G1 to G5 = Kp 5
// to 9; G2 55°, G3 50°, G4 45°, G5 40° geomagnetic latitude); NOAA SWPC on CMEs (about 250 to 3000 km/s,
// the fastest arriving in 15 to 18 hours, slower ones in several days); Wikipedia "May 2024 solar storms"
// (G5, Kp 9, CMEs of 8 May arriving on 10 May, the strongest since 2003, seen in Portugal, Spain, the Canary
// Islands, Mexico); Observador, 11 May 2024 (seen from Bragança, Viseu, Guarda, Coimbra, Santarém, Portalegre,
// in purples and pinks, in photographs); Miguel Claro (Alqueva, 10 May 2024, some bands seen with the naked
// eye); Wikipedia "Firefox (mythology)" and Athropolis (revontulet, the fox's tail flinging sparks); US
// Standard Atmosphere 1976 (density at 100 km about 30 000 times that at 300 km). Oxygen's levels: 1D at
// 1.97 eV, 1S at 4.19 eV (NIST).
const EN = {
  title: 'A winter camp under the aurora',
  greet: {
    kid: 'Hello! I am oxygen, and the green up there is me, glowing! We are at a winter camp in Finnish Lapland. Three things to try: the Sun and the Earth on the ice table, the lens that looks up into the aurora, and the camera in the snow. The picture’s story is on the easel.',
    sci: 'Welcome to Finnish Lapland, about 69° north, under the auroral oval. The green is atomic oxygen’s 557.7 nm line, the red above it its 630.0 nm line. Three stations: the solar storm, oxygen’s two colours, and seeing it. The picture’s story is on the easel.',
  },
  talk: {
    kid: [
      'The northern lights shine in a ring round the top of the world, and the southern lights in another round the bottom. Here in Lapland we are right under the northern ring!',
      'The aurora is very high: its green glows about 100 kilometres above the ground. That is ten times higher than planes fly!',
      'In Finnish the northern lights are called revontulet: fox fires. Have you seen the white fox by the birch?',
    ],
    sci: [
      'The aurora borealis has a southern twin, the aurora australis. Both glow in ovals round the geomagnetic poles, centred on about 67° magnetic latitude.',
      'The particles that light it are mostly electrons, accelerated to a few thousand electronvolts in the last few tens of thousands of kilometres of their fall along the field lines.',
      'Oxygen is about a fifth of the air near the ground, as O2. High up, ultraviolet sunlight splits O2, and above about 200 km single oxygen atoms are the commonest particles.',
    ],
  },
  gust: {
    label: 'The Sun’s gust',
    title: 'A storm from the Sun',
    slider: 'How strong the storm is (Kp)',
    kp: 'Kp {k}: {name}',
    scale: {
      kid: ['very calm', 'calm', 'calm', 'lively', 'lively', 'a small storm', 'a storm', 'a strong storm', 'a severe storm', 'an extreme storm'],
      sci: ['quiet', 'quiet', 'quiet', 'unsettled', 'active', 'G1, minor storm', 'G2, moderate storm', 'G3, strong storm', 'G4, severe storm', 'G5, extreme storm'],
    },
    verbs: { send: 'Send a gust from the Sun' },
    hints: {
      send: 'Tap the Sun to send a gust',
      watch: 'Watch the particles',
      stronger: 'Look up at the sky, or make the storm stronger in the panel',
      again: 'Tap the Sun for another gust',
    },
    signs: {
      sun: 'the Sun',
      earth: 'the Earth',
      camp: 'our camp',
      portugal: 'Portugal',
      seen: 'Portugal: seen!',
      model: { kid: 'a model: not to scale', sci: 'not to scale: the Sun is 109 Earths wide and 150 million km away' },
    },
    says: {
      send: {
        kid: 'Whoosh! The Sun has thrown out a giant cloud of charged particles. Watch how the Earth’s magnetism steers them.',
        sci: 'A coronal mass ejection: a billion tonnes or more of magnetised plasma at hundreds to thousands of km/s. A real one takes from about 15 hours to several days to arrive; here, three seconds.',
      },
      arrive: {
        kid: 'Most of the particles are steered round the Earth, but some pour down round the poles in a ring. Now look up: the sky over our camp is dancing!',
        sci: 'The magnetosphere turns most of the plasma aside; the storm loads the magnetic tail, and electrons accelerated down the field lines pour into the auroral ovals round both geomagnetic poles. Look up.',
      },
      far: {
        kid: 'An extreme storm! The ring has spread so far from the pole that the lights could be seen in Portugal, as on 10 May 2024.',
        sci: 'Kp 9, G5. NOAA: at G5 aurora has been seen as low as about 40° geomagnetic latitude. On 10 and 11 May 2024 it was photographed from Portugal, Spain, the Canary Islands and Mexico.',
      },
      calm: {
        kid: 'A gentle gust: the ring stays up here, round the far north. Make the storm stronger and send another!',
        sci: 'A weak disturbance: the oval stays near its quiet place, about 65 to 67° magnetic latitude on the night side.',
      },
    },
    rows: [
      ['Auroral oval, quiet', 'about 67° magnetic latitude'],
      ['G3 storm (Kp 7)', 'seen to about 50° geomagnetic latitude'],
      ['G5 storm (Kp 9)', 'seen to about 40° geomagnetic latitude'],
      ['10 to 11 May 2024', 'G5, Kp 9: seen from Portugal'],
      ['CME speed', 'about 250 to 3000 km/s'],
    ],
    panel: {
      kid: [
        'The Sun blows a wind of tiny charged particles all the time. Sometimes it throws out a giant cloud of them, which reaches the Earth a day or a few days later.',
        'The Earth is a giant magnet. Its magnetism steers the particles round us and down near the poles, in a ring. Where they crash into the air, the sky glows. Tap the Sun to send a gust; slide the storm stronger, and the ring spreads farther from the pole.',
        'On 10 May 2024 there was a huge storm. The lights were seen as far south as Portugal: many people found them in their phone photos, in pinks and purples.',
      ],
      sci: [
        'A coronal mass ejection (CME) carries a billion tonnes or more of magnetised plasma at about 250 to 3000 km/s; it reaches the Earth in from about 15 hours to several days. The model is not to scale, and its time runs fast.',
        'The magnetosphere turns most of it aside. The storm stretches and loads the magnetic tail; when that energy is released, electrons accelerated down the field lines to a few keV strike the upper air in two ovals round the geomagnetic poles, centred on about 67° magnetic latitude and shifted toward the night side.',
        'The Kp index (0 to 9) measures how disturbed the Earth’s magnetic field is: the stronger the storm, the farther the ovals spread toward the equator. NOAA’s scale: G3 (Kp 7), aurora seen as low as about 50° geomagnetic latitude; G5 (Kp 9), about 40°. On 10 and 11 May 2024 (G5, the strongest since 2003) it was photographed all over Portugal, from Bragança to Alqueva.',
      ],
    },
  },
  colours: {
    label: 'Oxygen’s two colours',
    title: 'Green below, red above',
    slider: 'Height in the sky',
    height: '{h} km',
    verbs: { send: 'Send an electron at this height' },
    hints: {
      sky: 'Tap the aurora at any height, or the gauge by the lens',
      watch: 'Watch the oxygen atom',
      high: 'Now tap it high up, near the top',
      low: 'Now tap its very bottom edge',
      again: 'Tap any height to compare',
    },
    tally: { green: 'Green given', red: 'Red given', bumped: 'Bumped before red', nitrogen: 'Nitrogen glowed' },
    signs: {
      height: { kid: '{h} km up', sci: 'at {h} km' },
      ladder: { kid: 'a ladder up into the aurora', sci: 'height above the ground' },
      lifted: { kid: 'lifted up!', sci: 'excited to 1S' },
      wait: { kid: 'waiting to glow red...', sci: 'on 1D, waiting' },
      red: { kid: 'red!', sci: '1D to ground: red' },
      bumped: { kid: 'bump! no red', sci: 'quenched: no red' },
      nitrogen: { kid: 'nitrogen glows blue and purple', sci: 'N2+ glows: blue-violet' },
      greenLine: 'green 557.7 nm',
      redLine: 'red 630.0 nm',
      violetLine: '427.8 nm',
      clock: 'real time: {t} s',
      after: 'after {t} s',
      bumpedAfter: 'bumped after {t} s',
      fast: 'time runs 20 times faster while it waits',
      tally: 'green {g}    red {r}    bumped {b}',
    },
    says: {
      low: {
        kid: 'Green! But no red: down here the air is crowded, and a passing molecule bumped the atom and took its energy first.',
        sci: 'At {h} km a collision quenched the 1D level after {t} s, long before its 110 s lifetime: green, but no 630.0 nm.',
      },
      middle: {
        kid: 'Green, then a bump before the red. Higher up it gets better: try nearer the top!',
        sci: 'At {h} km, quenching still wins most of the time (here after {t} s). Above about 200 km the red line starts to win.',
      },
      red: {
        kid: 'Red! Up here the air is so thin that the atom could wait and wait, and then glow red.',
        sci: 'At {h} km the atom gave 630.0 nm after {t} s: collisions are rare enough up here for the slow transition.',
      },
      nitrogen: {
        kid: 'At the very bottom there are hardly any single oxygen atoms. The electron hit nitrogen, which glows blue and purple: the fringe under the green.',
        sci: 'Below about 100 km atomic oxygen thins out, so the green stops at a sharp edge. The most energetic electrons reach N2 here: N2+ gives the blue-violet 427.8 nm band, and N2 red bands; together, the purple fringe.',
      },
    },
    rows: [
      ['Green line', '557.7 nm, O(¹S → ¹D), about 0.7 s, mostly 100 to 150 km'],
      ['Red line', '630.0 nm, O(¹D → ³P), about 110 s, above about 150 to 200 km'],
      ['Purple fringe', 'N₂⁺ 427.8 nm and N₂ red bands, near 90 to 100 km'],
      ['Air at 100 km', 'about 30 000 times denser than at 300 km'],
    ],
    panel: {
      kid: [
        'Climb the ladder into the aurora! Tap the curtain at a height (or the gauge by the lens, or slide it), and an electron from space hits an oxygen atom there. The lens shows what happens.',
        'The atom is lifted up, then gives its energy back as light. Green comes in less than a second. Then it can give red too, but only after almost two minutes of waiting, so the clock here runs faster while it waits.',
        'Low down the air is crowded: a passing molecule bumps the waiting atom and takes its energy, so no red. High up the atoms are far apart, and the red can shine. At the very bottom, nitrogen glows blue and purple.',
      ],
      sci: [
        'An auroral electron excites atomic oxygen. From the ¹S level (4.19 eV) it falls to ¹D by giving the green 557.7 nm line, in about 0.7 s; from ¹D (1.97 eV) it can fall to the ground state by giving the red 630.0 nm line (and 636.4 nm), but only after about 110 s on average. Both are “forbidden” transitions, which is why they are so slow.',
        'Lower down, collisions with N₂ and O₂ take the ¹D energy first (quenching), so the red glows only high up, above about 150 to 200 km. The green, quick enough, glows mostly at 100 to 150 km; below about 100 km atomic oxygen thins out, which gives the curtain its sharp lower edge.',
        'At the bottom, the most energetic electrons reach N₂: N₂⁺ gives a blue-violet band at 427.8 nm, N₂ some red bands; together they make the purple fringe of strong auroras. Here time runs 20 times faster while the atom waits on ¹D, and the crowd in the lens follows the real density on a squeezed scale.',
      ],
    },
  },
  camera: {
    label: 'Seeing it',
    title: 'Your eyes and a camera',
    slider: 'Exposure time',
    verbs: { shoot: 'Take a long exposure', fox: 'Tell the fox’s tale' },
    hints: {
      shoot: 'Tap the camera to take a long exposure',
      open: 'Hold still, the shutter is open',
      fox: 'Slide the exposure, or tap the white fox',
      again: 'Slide the exposure, or tap the camera again',
    },
    signs: {
      eye: { kid: 'your eyes', sci: 'the eye at night: rods' },
      cam: { kid: 'the camera, {t}', sci: 'the camera: {t} exposure' },
      fox: { kid: 'revontulet: fox fires', sci: 'revontulet, the fox’s fires' },
    },
    says: {
      photo: {
        kid: 'Look at the camera’s photo: so much more colour than your eyes see! Even the red at the top shows.',
        sci: 'The sensor gathers light for the whole exposure; the eye adds it up for only a fraction of a second, and in dim light it sees with rods, which see no colour and hardly any red.',
      },
      long: {
        kid: 'So long that the dancing curtains smear into a blur, and the snow is far too bright!',
        sci: 'Too long: the moving rays smear out and the bright parts saturate. Aurora photographers usually expose for a few seconds.',
      },
      short: {
        kid: 'Too short: the camera hardly saw anything, just like your eyes.',
        sci: 'Too short to gather enough light: underexposed, as dim as the eye’s view.',
      },
      fox: {
        kid: 'A Finnish folk tale says a fox ran over the snowy fells, and its tail swept sparks up into the sky. That is why the northern lights are called revontulet: fox fires!',
        sci: 'Revontulet: “the fox’s fires” (repo is an old Finnish word for fox). In a folk tale from Lapland, a fire fox running over the fells flings sparks into the sky with its tail; in other tellings its tail sweeps up snow crystals that spark. A tale, told in many versions.',
      },
    },
    rows: [
      ['Night vision', 'rods: no colour, most sensitive near 507 nm, nearly blind to red'],
      ['Colour vision', 'cones: need more light, most sensitive near 555 nm'],
      ['A usual aurora photo', 'a few seconds, a wide aperture, a high ISO'],
    ],
    panel: {
      kid: [
        'At night your eyes switch to their night cells. They see well in the dark, but not in colour, and hardly at all in red. So a faint aurora looks grey or pale green to you.',
        'A camera can keep its shutter open for seconds and gather much more light, so its photo shows the green and the red. Tap the camera; slide the exposure to try shorter and longer ones.',
        'In Finnish the northern lights are revontulet: fox fires. Tap the white fox to hear why.',
      ],
      sci: [
        'In dim light the eye sees with rods (scotopic vision): very sensitive, but colour-blind, most sensitive near 507 nm and nearly blind at 630 nm. Cones, which see colour, need more light; they are most sensitive near 555 nm, so oxygen’s 557.7 nm green is what a bright aurora shows best, and its faint 630.0 nm red often goes unseen.',
        'A sensor adds up light for the whole exposure and keeps its colour in dim light, so a few seconds record far more than the eye. Too long, and the moving rays smear and the brightest parts saturate. On 10 May 2024 many people in Portugal found the aurora only in their phone photos.',
        'Here the camera draws the camp from its tripod several times across the exposure and adds them up; the eye’s view keeps mostly the light the rods would catch.',
      ],
    },
  },
}

const PT = {
  title: 'Um acampamento de inverno sob a aurora',
  greet: {
    kid: 'Olá! Eu sou o oxigénio, e o verde lá em cima sou eu a brilhar! Estamos num acampamento de inverno na Lapónia finlandesa. Há três coisas para experimentar: o Sol e a Terra na mesa de gelo, a lente que olha para dentro da aurora e a máquina fotográfica na neve. A história da imagem está no cavalete.',
    sci: 'Bem-vindo à Lapónia finlandesa, a cerca de 69° norte, sob a oval auroral. O verde é a risca de 557,7 nm do oxigénio atómico, o vermelho por cima dele a sua risca de 630,0 nm. Três estações: a tempestade solar, as duas cores do oxigénio e vê-la. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'As auroras boreais brilham num anel à volta do topo do mundo, e as austrais noutro à volta do fundo. Aqui na Lapónia estamos mesmo por baixo do anel do norte!',
      'A aurora está muito alta: o seu verde brilha a cerca de 100 quilómetros do chão. É dez vezes mais alto do que voam os aviões!',
      'Em finlandês, as auroras boreais chamam-se revontulet: fogos da raposa. Já viste a raposa branca ao pé da bétula?',
    ],
    sci: [
      'A aurora boreal tem uma gémea a sul, a aurora austral. Ambas brilham em ovais à volta dos polos geomagnéticos, centradas em cerca de 67° de latitude magnética.',
      'As partículas que a acendem são sobretudo eletrões, acelerados até alguns milhares de eletrões-volt nas últimas dezenas de milhares de quilómetros da sua queda ao longo das linhas de campo.',
      'Junto ao chão, o oxigénio é cerca de um quinto do ar, como O2. Lá no alto, a luz ultravioleta do Sol parte o O2, e acima de cerca de 200 km os átomos de oxigénio soltos são as partículas mais comuns.',
    ],
  },
  gust: {
    label: 'A rajada do Sol',
    title: 'Uma tempestade vinda do Sol',
    slider: 'Força da tempestade (Kp)',
    kp: 'Kp {k}: {name}',
    scale: {
      kid: ['muito calma', 'calma', 'calma', 'agitada', 'agitada', 'uma pequena tempestade', 'uma tempestade', 'uma tempestade forte', 'uma tempestade severa', 'uma tempestade extrema'],
      sci: ['calmo', 'calmo', 'calmo', 'instável', 'ativo', 'G1, tempestade fraca', 'G2, tempestade moderada', 'G3, tempestade forte', 'G4, tempestade severa', 'G5, tempestade extrema'],
    },
    verbs: { send: 'Enviar uma rajada do Sol' },
    hints: {
      send: 'Toca no Sol para enviar uma rajada',
      watch: 'Observa as partículas',
      stronger: 'Olha para o céu, ou torna a tempestade mais forte no painel',
      again: 'Toca no Sol para outra rajada',
    },
    signs: {
      sun: 'o Sol',
      earth: 'a Terra',
      camp: 'o nosso acampamento',
      portugal: 'Portugal',
      seen: 'Portugal: vista!',
      model: { kid: 'um modelo: fora de escala', sci: 'fora de escala: o Sol tem 109 Terras de largura e está a 150 milhões de km' },
    },
    says: {
      send: {
        kid: 'Zum! O Sol lançou uma nuvem gigante de partículas com carga elétrica. Vê como o magnetismo da Terra as desvia.',
        sci: 'Uma ejeção de massa coronal: mil milhões de toneladas ou mais de plasma magnetizado, a centenas ou milhares de km/s. Uma verdadeira demora de cerca de 15 horas a vários dias a chegar; aqui, três segundos.',
      },
      arrive: {
        kid: 'A maior parte das partículas é desviada à volta da Terra, mas algumas descem à volta dos polos, num anel. Agora olha para cima: o céu sobre o acampamento está a dançar!',
        sci: 'A magnetosfera desvia a maior parte do plasma; a tempestade carrega a cauda magnética, e eletrões acelerados ao longo das linhas de campo caem nas ovais aurorais à volta dos dois polos geomagnéticos. Olha para cima.',
      },
      far: {
        kid: 'Uma tempestade extrema! O anel alargou-se tanto que as luzes se podiam ver em Portugal, como a 10 de maio de 2024.',
        sci: 'Kp 9, G5. Segundo a NOAA, com G5 já se viu aurora até cerca de 40° de latitude geomagnética. A 10 e 11 de maio de 2024 foi fotografada em Portugal, Espanha, nas Canárias e no México.',
      },
      calm: {
        kid: 'Uma rajada suave: o anel fica aqui em cima, à volta do extremo norte. Torna a tempestade mais forte e envia outra!',
        sci: 'Uma perturbação fraca: a oval fica perto do seu lugar calmo, a cerca de 65 a 67° de latitude magnética do lado da noite.',
      },
    },
    rows: [
      ['Oval auroral, calma', 'cerca de 67° de latitude magnética'],
      ['Tempestade G3 (Kp 7)', 'vista até cerca de 50° de latitude geomagnética'],
      ['Tempestade G5 (Kp 9)', 'vista até cerca de 40° de latitude geomagnética'],
      ['10 a 11 de maio de 2024', 'G5, Kp 9: vista de Portugal'],
      ['Velocidade de uma EMC', 'cerca de 250 a 3000 km/s'],
    ],
    panel: {
      kid: [
        'O Sol sopra sempre um vento de partículas minúsculas com carga elétrica. Às vezes lança uma nuvem gigante delas, que chega à Terra um dia ou alguns dias depois.',
        'A Terra é um íman gigante. O seu magnetismo desvia as partículas à nossa volta e fá-las descer perto dos polos, num anel. Onde chocam com o ar, o céu brilha. Toca no Sol para enviar uma rajada; torna a tempestade mais forte e o anel alarga-se para longe do polo.',
        'A 10 de maio de 2024 houve uma tempestade enorme. As luzes viram-se até em Portugal: muitas pessoas encontraram-nas nas fotografias do telemóvel, em cor-de-rosa e roxo.',
      ],
      sci: [
        'Uma ejeção de massa coronal (EMC) leva mil milhões de toneladas ou mais de plasma magnetizado a cerca de 250 a 3000 km/s; chega à Terra em cerca de 15 horas a vários dias. O modelo está fora de escala, e o seu tempo corre depressa.',
        'A magnetosfera desvia a maior parte. A tempestade estica e carrega a cauda magnética; quando essa energia se liberta, eletrões acelerados ao longo das linhas de campo até alguns keV atingem a alta atmosfera em duas ovais à volta dos polos geomagnéticos, centradas em cerca de 67° de latitude magnética e desviadas para o lado da noite.',
        'O índice Kp (0 a 9) mede quão perturbado está o campo magnético da Terra: quanto mais forte a tempestade, mais as ovais se alargam para o equador. Na escala da NOAA: G3 (Kp 7), aurora vista até cerca de 50° de latitude geomagnética; G5 (Kp 9), cerca de 40°. A 10 e 11 de maio de 2024 (G5, a mais forte desde 2003) foi fotografada por todo o Portugal, de Bragança ao Alqueva.',
      ],
    },
  },
  colours: {
    label: 'As duas cores do oxigénio',
    title: 'Verde em baixo, vermelho em cima',
    slider: 'Altura no céu',
    height: '{h} km',
    verbs: { send: 'Enviar um eletrão a esta altura' },
    hints: {
      sky: 'Toca na aurora a qualquer altura, ou na régua junto à lente',
      watch: 'Observa o átomo de oxigénio',
      high: 'Agora toca-lhe bem alto, perto do topo',
      low: 'Agora toca-lhe mesmo na borda de baixo',
      again: 'Toca a qualquer altura para comparar',
    },
    tally: { green: 'Verde dado', red: 'Vermelho dado', bumped: 'Chocou antes do vermelho', nitrogen: 'O azoto brilhou' },
    signs: {
      height: { kid: 'a {h} km de altura', sci: 'a {h} km' },
      ladder: { kid: 'uma escada para dentro da aurora', sci: 'altura acima do chão' },
      lifted: { kid: 'subiu!', sci: 'excitado para 1S' },
      wait: { kid: 'à espera de brilhar a vermelho...', sci: 'em 1D, à espera' },
      red: { kid: 'vermelho!', sci: '1D para o fundamental: vermelho' },
      bumped: { kid: 'pumba! sem vermelho', sci: 'desexcitado: sem vermelho' },
      nitrogen: { kid: 'o azoto brilha azul e roxo', sci: 'o N2+ brilha: azul-violeta' },
      greenLine: 'verde 557,7 nm',
      redLine: 'vermelho 630,0 nm',
      violetLine: '427,8 nm',
      clock: 'tempo real: {t} s',
      after: 'após {t} s',
      bumpedAfter: 'chocou após {t} s',
      fast: 'o tempo corre 20 vezes mais depressa enquanto espera',
      tally: 'verde {g}    vermelho {r}    choques {b}',
    },
    says: {
      low: {
        kid: 'Verde! Mas sem vermelho: cá em baixo o ar está cheio, e uma molécula que passava chocou com o átomo e levou-lhe a energia primeiro.',
        sci: 'A {h} km uma colisão desexcitou o nível 1D após {t} s, muito antes do seu tempo de vida de 110 s: verde, mas sem 630,0 nm.',
      },
      middle: {
        kid: 'Verde, e depois um choque antes do vermelho. Mais acima é melhor: experimenta mais perto do topo!',
        sci: 'A {h} km as colisões ainda ganham quase sempre (aqui após {t} s). Acima de cerca de 200 km a risca vermelha começa a ganhar.',
      },
      red: {
        kid: 'Vermelho! Cá em cima o ar é tão rarefeito que o átomo pôde esperar e esperar, e depois brilhar a vermelho.',
        sci: 'A {h} km o átomo deu 630,0 nm após {t} s: cá em cima as colisões são raras o suficiente para a transição lenta.',
      },
      nitrogen: {
        kid: 'Lá mesmo em baixo quase não há átomos de oxigénio soltos. O eletrão atingiu o azoto, que brilha azul e roxo: a franja por baixo do verde.',
        sci: 'Abaixo de cerca de 100 km o oxigénio atómico rareia, por isso o verde para numa borda nítida. Os eletrões mais energéticos chegam aqui ao N2: o N2+ dá a banda azul-violeta de 427,8 nm, e o N2 bandas vermelhas; juntas, a franja roxa.',
      },
    },
    rows: [
      ['Risca verde', '557,7 nm, O(¹S → ¹D), cerca de 0,7 s, sobretudo a 100 a 150 km'],
      ['Risca vermelha', '630,0 nm, O(¹D → ³P), cerca de 110 s, acima de cerca de 150 a 200 km'],
      ['Franja roxa', 'N₂⁺ 427,8 nm e bandas vermelhas do N₂, perto de 90 a 100 km'],
      ['Ar a 100 km', 'cerca de 30 000 vezes mais denso do que a 300 km'],
    ],
    panel: {
      kid: [
        'Sobe a escada para dentro da aurora! Toca na cortina a uma altura (ou na régua junto à lente, ou desliza), e um eletrão vindo do espaço atinge ali um átomo de oxigénio. A lente mostra o que acontece.',
        'O átomo sobe, e depois devolve a energia como luz. O verde vem em menos de um segundo. Depois também pode dar vermelho, mas só depois de quase dois minutos à espera, por isso aqui o relógio anda mais depressa enquanto ele espera.',
        'Cá em baixo o ar está cheio: uma molécula que passa choca com o átomo à espera e leva-lhe a energia, e não há vermelho. Lá em cima os átomos estão longe uns dos outros, e o vermelho pode brilhar. Mesmo em baixo, o azoto brilha azul e roxo.',
      ],
      sci: [
        'Um eletrão auroral excita o oxigénio atómico. Do nível ¹S (4,19 eV) cai para ¹D dando a risca verde de 557,7 nm, em cerca de 0,7 s; de ¹D (1,97 eV) pode cair para o estado fundamental dando a risca vermelha de 630,0 nm (e 636,4 nm), mas só após cerca de 110 s em média. Ambas são transições “proibidas”, e é por isso que são tão lentas.',
        'Mais abaixo, as colisões com N₂ e O₂ levam primeiro a energia de ¹D (desexcitação colisional), por isso o vermelho só brilha lá no alto, acima de cerca de 150 a 200 km. O verde, rápido o suficiente, brilha sobretudo a 100 a 150 km; abaixo de cerca de 100 km o oxigénio atómico rareia, o que dá à cortina a sua borda inferior nítida.',
        'Em baixo, os eletrões mais energéticos chegam ao N₂: o N₂⁺ dá uma banda azul-violeta a 427,8 nm, o N₂ algumas bandas vermelhas; juntas fazem a franja roxa das auroras fortes. Aqui o tempo corre 20 vezes mais depressa enquanto o átomo espera em ¹D, e a multidão na lente segue a densidade real numa escala comprimida.',
      ],
    },
  },
  camera: {
    label: 'Vê-la',
    title: 'Os teus olhos e uma máquina fotográfica',
    slider: 'Tempo de exposição',
    verbs: { shoot: 'Tirar uma longa exposição', fox: 'Contar a história da raposa' },
    hints: {
      shoot: 'Toca na máquina para tirar uma longa exposição',
      open: 'Não te mexas, o obturador está aberto',
      fox: 'Desliza a exposição, ou toca na raposa branca',
      again: 'Desliza a exposição, ou toca outra vez na máquina',
    },
    signs: {
      eye: { kid: 'os teus olhos', sci: 'o olho de noite: bastonetes' },
      cam: { kid: 'a máquina, {t}', sci: 'a máquina: exposição de {t}' },
      fox: { kid: 'revontulet: fogos da raposa', sci: 'revontulet, os fogos da raposa' },
    },
    says: {
      photo: {
        kid: 'Olha para a fotografia da máquina: tanta mais cor do que os teus olhos veem! Até o vermelho lá em cima aparece.',
        sci: 'O sensor junta luz durante toda a exposição; o olho soma-a só durante uma fração de segundo, e com pouca luz vê com os bastonetes, que não veem cor e quase nenhum vermelho.',
      },
      long: {
        kid: 'Tão longa que as cortinas a dançar ficam todas borradas, e a neve fica clara demais!',
        sci: 'Longa demais: os raios em movimento borram-se e as partes claras saturam. Os fotógrafos de auroras costumam expor alguns segundos.',
      },
      short: {
        kid: 'Curta demais: a máquina quase não viu nada, tal como os teus olhos.',
        sci: 'Curta demais para juntar luz suficiente: subexposta, tão escura como a vista do olho.',
      },
      fox: {
        kid: 'Um conto popular finlandês diz que uma raposa correu pelos montes nevados, e a sua cauda varreu faíscas para o céu. É por isso que as auroras boreais se chamam revontulet: fogos da raposa!',
        sci: 'Revontulet: “os fogos da raposa” (repo é uma palavra finlandesa antiga para raposa). Num conto popular da Lapónia, uma raposa de fogo que corre pelos montes lança faíscas para o céu com a cauda; noutras versões a cauda levanta cristais de neve que faíscam. Um conto, contado de muitas maneiras.',
      },
    },
    rows: [
      ['Visão noturna', 'bastonetes: sem cor, mais sensíveis perto de 507 nm, quase cegos ao vermelho'],
      ['Visão das cores', 'cones: precisam de mais luz, mais sensíveis perto de 555 nm'],
      ['Uma fotografia de aurora habitual', 'alguns segundos, abertura grande, ISO alto'],
    ],
    panel: {
      kid: [
        'De noite, os teus olhos passam a usar as suas células da noite. Veem bem no escuro, mas não a cores, e quase nada o vermelho. Por isso uma aurora fraca parece-te cinzenta ou verde-clara.',
        'Uma máquina fotográfica pode deixar o obturador aberto durante segundos e juntar muito mais luz, e por isso a sua fotografia mostra o verde e o vermelho. Toca na máquina; desliza a exposição para experimentar mais curtas e mais longas.',
        'Em finlandês, as auroras boreais chamam-se revontulet: fogos da raposa. Toca na raposa branca para saberes porquê.',
      ],
      sci: [
        'Com pouca luz, o olho vê com os bastonetes (visão escotópica): muito sensíveis, mas cegos às cores, mais sensíveis perto de 507 nm e quase cegos a 630 nm. Os cones, que veem as cores, precisam de mais luz; são mais sensíveis perto de 555 nm, por isso o verde de 557,7 nm do oxigénio é o que uma aurora brilhante mostra melhor, e o seu vermelho fraco de 630,0 nm passa muitas vezes despercebido.',
        'Um sensor soma luz durante toda a exposição e mantém a cor com pouca luz, por isso alguns segundos registam muito mais do que o olho. Longa demais, e os raios em movimento borram-se e as partes mais claras saturam. A 10 de maio de 2024 muitas pessoas em Portugal só encontraram a aurora nas fotografias do telemóvel.',
        'Aqui a máquina desenha o acampamento a partir do tripé várias vezes ao longo da exposição e soma-as; a vista do olho guarda sobretudo a luz que os bastonetes apanhariam.',
      ],
    },
  },
}

const PL = {
  title: 'Zimowy obóz pod zorzą',
  greet: {
    kid: 'Cześć! Jestem Tlen, a ta zieleń w górze to ja, świecę! Jesteśmy w zimowym obozie w fińskiej Laponii. Trzy rzeczy do wypróbowania: Słońce i Ziemia na lodowym stole, soczewka, która zagląda w zorzę, i aparat w śniegu. Historia obrazka jest na sztaludze.',
    sci: 'Cześć! Jestem Tlen. Witaj w fińskiej Laponii, około 69° na północ, pod owalem zorzowym. Zieleń to linia 557,7 nm tlenu atomowego, czerwień nad nią to jego linia 630,0 nm. Trzy stanowiska: burza słoneczna, dwa kolory tlenu i patrzenie. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Zorza polarna północna świeci w pierścieniu wokół szczytu świata, a południowa w drugim wokół dołu. Tu, w Laponii, jesteśmy dokładnie pod północnym pierścieniem!',
      'Zorza jest bardzo wysoko: jej zieleń świeci około 100 kilometrów nad ziemią. To dziesięć razy wyżej, niż latają samoloty!',
      'Po fińsku zorza polarna to revontulet: lisie ognie. Widzisz białego lisa przy brzozie?',
    ],
    sci: [
      'Zorza północna ma bliźniaczkę na południu, zorzę południową. Obie świecą w owalach wokół biegunów geomagnetycznych, o środku na około 67° szerokości magnetycznej.',
      'Cząstki, które ją zapalają, to głównie elektrony, przyspieszone do kilku tysięcy elektronowoltów na ostatnich kilkudziesięciu tysiącach kilometrów ich spadania wzdłuż linii pola.',
      'Przy ziemi tlen to około jednej piątej powietrza, jako O2. Wysoko ultrafioletowe światło Słońca rozbija O2, a powyżej około 200 km pojedyncze atomy tlenu są najczęstszymi cząstkami.',
    ],
  },
  gust: {
    label: 'Podmuch ze Słońca',
    title: 'Burza ze Słońca',
    slider: 'Siła burzy (Kp)',
    kp: 'Kp {k}: {name}',
    scale: {
      kid: ['bardzo spokojnie', 'spokojnie', 'spokojnie', 'żywo', 'żywo', 'mała burza', 'burza', 'silna burza', 'groźna burza', 'ekstremalna burza'],
      sci: ['spokojnie', 'spokojnie', 'spokojnie', 'niespokojnie', 'aktywnie', 'G1, słaba burza', 'G2, umiarkowana burza', 'G3, silna burza', 'G4, poważna burza', 'G5, ekstremalna burza'],
    },
    verbs: { send: 'Wyślij podmuch ze Słońca' },
    hints: {
      send: 'Dotknij Słońca, by wysłać podmuch',
      watch: 'Patrz na cząstki',
      stronger: 'Spójrz w niebo albo wzmocnij burzę na tablicy',
      again: 'Dotknij Słońca, by wysłać kolejny podmuch',
    },
    signs: {
      sun: 'Słońce',
      earth: 'Ziemia',
      camp: 'nasz obóz',
      portugal: 'Portugalia',
      seen: 'Portugalia: widać!',
      model: { kid: 'model: nie w skali', sci: 'nie w skali: Słońce ma 109 średnic Ziemi i jest 150 milionów km stąd' },
    },
    says: {
      send: {
        kid: 'Szszsz! Słońce wyrzuciło ogromną chmurę naładowanych cząstek. Zobacz, jak magnetyzm Ziemi nimi kieruje.',
        sci: 'Koronalny wyrzut masy: miliard ton lub więcej namagnesowanej plazmy, z prędkością od setek do tysięcy km/s. Prawdziwy dociera od około 15 godzin do kilku dni; tutaj w trzy sekundy.',
      },
      arrive: {
        kid: 'Większość cząstek omija Ziemię bokiem, ale część spływa w dół wokół biegunów, w pierścieniu. Spójrz w górę: niebo nad obozem tańczy!',
        sci: 'Magnetosfera odchyla większość plazmy; burza ładuje magnetyczny ogon, a elektrony przyspieszone wzdłuż linii pola spływają do owali zorzowych wokół obu biegunów geomagnetycznych. Spójrz w górę.',
      },
      far: {
        kid: 'Ekstremalna burza! Pierścień rozszerzył się tak daleko od bieguna, że światła było widać w Portugalii, jak 10 maja 2024 roku.',
        sci: 'Kp 9, G5. Według NOAA przy G5 zorzę widziano aż do około 40° szerokości geomagnetycznej. 10 i 11 maja 2024 roku fotografowano ją w Portugalii, Hiszpanii, na Wyspach Kanaryjskich i w Meksyku.',
      },
      calm: {
        kid: 'Łagodny podmuch: pierścień zostaje tu w górze, wokół dalekiej północy. Wzmocnij burzę i wyślij następny!',
        sci: 'Słabe zaburzenie: owal zostaje blisko swojego spokojnego miejsca, około 65 do 67° szerokości magnetycznej po stronie nocnej.',
      },
    },
    rows: [
      ['Owal zorzowy, spokojnie', 'około 67° szerokości magnetycznej'],
      ['Burza G3 (Kp 7)', 'widoczna do około 50° szerokości geomagnetycznej'],
      ['Burza G5 (Kp 9)', 'widoczna do około 40° szerokości geomagnetycznej'],
      ['10 do 11 maja 2024', 'G5, Kp 9: widoczna z Portugalii'],
      ['Prędkość CME', 'około 250 do 3000 km/s'],
    ],
    panel: {
      kid: [
        'Słońce cały czas wieje wiatrem malutkich naładowanych cząstek. Czasem wyrzuca ich ogromną chmurę, która dociera do Ziemi po dniu albo kilku dniach.',
        'Ziemia to wielki magnes. Jej magnetyzm kieruje cząstki wokół nas i w dół, blisko biegunów, w pierścieniu. Tam, gdzie zderzają się z powietrzem, niebo świeci. Dotknij Słońca, by wysłać podmuch; wzmocnij burzę suwakiem, a pierścień rozszerzy się dalej od bieguna.',
        '10 maja 2024 roku była ogromna burza. Światła widziano aż w Portugalii: wielu ludzi znalazło je na zdjęciach z telefonu, w różach i fioletach.',
      ],
      sci: [
        'Koronalny wyrzut masy (CME) niesie miliard ton lub więcej namagnesowanej plazmy z prędkością około 250 do 3000 km/s; dociera do Ziemi w czasie od około 15 godzin do kilku dni. Model nie jest w skali, a czas płynie w nim szybko.',
        'Magnetosfera odchyla większość z niego. Burza rozciąga i ładuje ogon magnetyczny; gdy ta energia się uwalnia, elektrony przyspieszone wzdłuż linii pola do kilku keV uderzają w górne warstwy powietrza w dwóch owalach wokół biegunów geomagnetycznych, o środku na około 67° szerokości magnetycznej, przesuniętych ku stronie nocnej.',
        'Indeks Kp (od 0 do 9) mierzy, jak zaburzone jest pole magnetyczne Ziemi: im silniejsza burza, tym dalej owale rozszerzają się ku równikowi. Skala NOAA: G3 (Kp 7), zorzę widziano do około 50° szerokości geomagnetycznej; G5 (Kp 9), do około 40°. 10 i 11 maja 2024 roku (G5, najsilniejsza od 2003) fotografowano ją w całej Portugalii, od Bragançy po Alquevę.',
      ],
    },
  },
  colours: {
    label: 'Dwa kolory tlenu',
    title: 'Zieleń na dole, czerwień na górze',
    slider: 'Wysokość na niebie',
    height: '{h} km',
    verbs: { send: 'Wyślij elektron na tę wysokość' },
    hints: {
      sky: 'Dotknij zorzy na dowolnej wysokości albo miarki przy soczewce',
      watch: 'Patrz na atom tlenu',
      high: 'Teraz dotknij jej wysoko, przy samej górze',
      low: 'Teraz dotknij jej samego dolnego brzegu',
      again: 'Dotknij dowolnej wysokości, by porównać',
    },
    tally: { green: 'Dał zieleń', red: 'Dał czerwień', bumped: 'Zderzony przed czerwienią', nitrogen: 'Azot zaświecił' },
    signs: {
      height: { kid: '{h} km w górze', sci: 'na {h} km' },
      ladder: { kid: 'drabina w głąb zorzy', sci: 'wysokość nad ziemią' },
      lifted: { kid: 'podniesiony!', sci: 'wzbudzony do 1S' },
      wait: { kid: 'czeka, by zaświecić na czerwono...', sci: 'na 1D, czeka' },
      red: { kid: 'czerwień!', sci: '1D do stanu podstawowego: czerwień' },
      bumped: { kid: 'bęc! bez czerwieni', sci: 'wygaszony: bez czerwieni' },
      nitrogen: { kid: 'azot świeci na niebiesko i fioletowo', sci: 'świeci N2+: niebieskofioletowo' },
      greenLine: 'zieleń 557,7 nm',
      redLine: 'czerwień 630,0 nm',
      violetLine: '427,8 nm',
      clock: 'czas prawdziwy: {t} s',
      after: 'po {t} s',
      bumpedAfter: 'zderzenie po {t} s',
      fast: 'gdy atom czeka, czas płynie 20 razy szybciej',
      tally: 'zieleń {g}    czerwień {r}    zderzenia {b}',
    },
    says: {
      low: {
        kid: 'Zieleń! Ale bez czerwieni: tu na dole powietrze jest gęste, a przelatująca cząsteczka zderzyła się z atomem i pierwsza zabrała mu energię.',
        sci: 'Na {h} km zderzenie wygasiło poziom 1D po {t} s, dużo przed jego czasem życia 110 s: zieleń, ale bez 630,0 nm.',
      },
      middle: {
        kid: 'Zieleń, a potem zderzenie przed czerwienią. Wyżej jest lepiej: spróbuj bliżej góry!',
        sci: 'Na {h} km zderzenia wciąż prawie zawsze wygrywają (tu po {t} s). Powyżej około 200 km zaczyna wygrywać linia czerwona.',
      },
      red: {
        kid: 'Czerwień! Tu w górze powietrze jest tak rzadkie, że atom mógł czekać i czekać, a potem zaświecić na czerwono.',
        sci: 'Na {h} km atom wysłał 630,0 nm po {t} s: tu w górze zderzenia są dość rzadkie dla powolnego przejścia.',
      },
      nitrogen: {
        kid: 'Na samym dole prawie nie ma pojedynczych atomów tlenu. Elektron trafił w azot, który świeci na niebiesko i fioletowo: to brzeżek pod zielenią.',
        sci: 'Poniżej około 100 km tlenu atomowego szybko ubywa, więc zieleń kończy się ostrym brzegiem. Najbardziej energetyczne elektrony docierają tu do N2: N2+ daje niebieskofioletowe pasmo 427,8 nm, a N2 pasma czerwone; razem dają fioletowy brzeżek.',
      },
    },
    rows: [
      ['Linia zielona', '557,7 nm, O(¹S → ¹D), około 0,7 s, głównie 100 do 150 km'],
      ['Linia czerwona', '630,0 nm, O(¹D → ³P), około 110 s, powyżej około 150 do 200 km'],
      ['Fioletowy brzeżek', 'N₂⁺ 427,8 nm i czerwone pasma N₂, około 90 do 100 km'],
      ['Powietrze na 100 km', 'około 30 000 razy gęstsze niż na 300 km'],
    ],
    panel: {
      kid: [
        'Wejdź po drabinie w głąb zorzy! Dotknij zasłony na jakiejś wysokości (albo miarki przy soczewce, albo przesuń suwak), a elektron z kosmosu trafi tam w atom tlenu. Soczewka pokazuje, co się dzieje.',
        'Atom zostaje podniesiony, a potem oddaje energię jako światło. Zieleń pojawia się w niecałą sekundę. Potem może dać też czerwień, ale dopiero po prawie dwóch minutach czekania, więc tu zegar przyspiesza, gdy atom czeka.',
        'Nisko powietrze jest gęste: przelatująca cząsteczka zderza się z czekającym atomem i zabiera mu energię, więc czerwieni nie ma. Wysoko atomy są daleko od siebie i czerwień może zaświecić. Na samym dole azot świeci na niebiesko i fioletowo.',
      ],
      sci: [
        'Elektron zorzowy wzbudza tlen atomowy. Z poziomu ¹S (4,19 eV) spada on do ¹D, wysyłając zieloną linię 557,7 nm, w około 0,7 s; z ¹D (1,97 eV) może spaść do stanu podstawowego, wysyłając czerwoną linię 630,0 nm (i 636,4 nm), ale dopiero średnio po około 110 s. Oba przejścia są „wzbronione” i dlatego są tak powolne.',
        'Niżej zderzenia z N₂ i O₂ pierwsze zabierają energię poziomu ¹D (wygaszanie), więc czerwień świeci tylko wysoko, powyżej około 150 do 200 km. Zieleń, dość szybka, świeci głównie na 100 do 150 km; poniżej około 100 km tlenu atomowego ubywa i to daje zasłonie ostry dolny brzeg.',
        'Na dole najbardziej energetyczne elektrony docierają do N₂: N₂⁺ daje niebieskofioletowe pasmo 427,8 nm, a N₂ kilka pasm czerwonych; razem tworzą fioletowy brzeżek silnych zórz. Tutaj czas płynie 20 razy szybciej, gdy atom czeka na ¹D, a tłok w soczewce odpowiada prawdziwej gęstości w ściśniętej skali.',
      ],
    },
  },
  camera: {
    label: 'Patrzenie',
    title: 'Twoje oczy i aparat',
    slider: 'Czas naświetlania',
    verbs: { shoot: 'Zrób długie naświetlanie', fox: 'Opowiedz historię lisa' },
    hints: {
      shoot: 'Dotknij aparatu, by zrobić długie naświetlanie',
      open: 'Nie ruszaj się, migawka jest otwarta',
      fox: 'Przesuń czas naświetlania albo dotknij białego lisa',
      again: 'Przesuń czas naświetlania albo znów dotknij aparatu',
    },
    signs: {
      eye: { kid: 'twoje oczy', sci: 'oko nocą: pręciki' },
      cam: { kid: 'aparat, {t}', sci: 'aparat: naświetlanie {t}' },
      fox: { kid: 'revontulet: lisie ognie', sci: 'revontulet, ognie lisa' },
    },
    says: {
      photo: {
        kid: 'Spójrz na zdjęcie z aparatu: o tyle więcej kolorów, niż widzą twoje oczy! Widać nawet czerwień na górze.',
        sci: 'Matryca zbiera światło przez całe naświetlanie; oko sumuje je tylko przez ułamek sekundy, a w słabym świetle widzi pręcikami, które nie widzą kolorów i prawie nie widzą czerwieni.',
      },
      long: {
        kid: 'Tak długo, że tańczące zasłony rozmazują się, a śnieg jest o wiele za jasny!',
        sci: 'Za długo: ruchome promienie się rozmazują, a jasne miejsca się prześwietlają. Fotografowie zórz zwykle naświetlają kilka sekund.',
      },
      short: {
        kid: 'Za krótko: aparat prawie nic nie zobaczył, tak jak twoje oczy.',
        sci: 'Za krótko, by zebrać dość światła: niedoświetlone, ciemne jak widok oka.',
      },
      fox: {
        kid: 'Fińska baśń ludowa mówi, że lis biegł przez ośnieżone fjeldy, a jego ogon zmiatał iskry w niebo. Dlatego zorza polarna nazywa się revontulet: lisie ognie!',
        sci: 'Revontulet: „ognie lisa” (repo to dawne fińskie słowo oznaczające lisa). W baśni ludowej z Laponii ognisty lis biegnący przez fjeldy rzuca ogonem iskry w niebo; w innych wersjach ogon wzbija kryształki śniegu, które iskrzą. Baśń opowiadana na wiele sposobów.',
      },
    },
    rows: [
      ['Widzenie nocne', 'pręciki: bez kolorów, najczulsze około 507 nm, prawie ślepe na czerwień'],
      ['Widzenie barwne', 'czopki: potrzebują więcej światła, najczulsze około 555 nm'],
      ['Zwykłe zdjęcie zorzy', 'kilka sekund, szeroki otwór przysłony, wysokie ISO'],
    ],
    panel: {
      kid: [
        'Nocą twoje oczy przełączają się na swoje nocne komórki. Dobrze widzą w ciemności, ale nie w kolorze, a czerwieni prawie wcale. Dlatego słaba zorza wydaje ci się szara albo bladozielona.',
        'Aparat może trzymać migawkę otwartą przez kilka sekund i zebrać dużo więcej światła, więc jego zdjęcie pokazuje zieleń i czerwień. Dotknij aparatu; przesuń czas naświetlania, by spróbować krótszych i dłuższych.',
        'Po fińsku zorza polarna to revontulet: lisie ognie. Dotknij białego lisa, by dowiedzieć się dlaczego.',
      ],
      sci: [
        'W słabym świetle oko widzi pręcikami (widzenie skotopowe): bardzo czułymi, ale nierozróżniającymi barw, najczulszymi około 507 nm i prawie ślepymi przy 630 nm. Czopki, które widzą kolory, potrzebują więcej światła; są najczulsze około 555 nm, więc zieleń tlenu 557,7 nm to to, co jasna zorza pokazuje najlepiej, a jej słaba czerwień 630,0 nm często pozostaje niezauważona.',
        'Matryca sumuje światło przez całe naświetlanie i zachowuje kolor w słabym świetle, więc kilka sekund rejestruje dużo więcej niż oko. Za długo, a ruchome promienie się rozmazują i najjaśniejsze miejsca się prześwietlają. 10 maja 2024 roku wielu ludzi w Portugalii znalazło zorzę tylko na zdjęciach z telefonu.',
        'Tutaj aparat rysuje obóz ze statywu kilka razy w trakcie naświetlania i dodaje te obrazy; widok oka zachowuje głównie światło, które złapałyby pręciki.',
      ],
    },
  },
}

const DE = {
  title: 'Ein Winterlager unter dem Polarlicht',
  greet: {
    kid: 'Hallo! Ich bin der Sauerstoff, und das Grün da oben bin ich, ich leuchte! Wir sind in einem Winterlager im finnischen Lappland. Drei Dinge zum Ausprobieren: die Sonne und die Erde auf dem Eistisch, die Linse, die ins Polarlicht hinaufschaut, und die Kamera im Schnee. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Hallo! Ich bin der Sauerstoff. Willkommen im finnischen Lappland, auf etwa 69° Nord, unter dem Polarlichtoval. Das Grün ist die 557,7-nm-Linie des atomaren Sauerstoffs, das Rot darüber seine 630,0-nm-Linie. Drei Stationen: der Sonnensturm, die zwei Farben des Sauerstoffs und das Sehen. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Das Nordlicht leuchtet in einem Ring um die Spitze der Welt, das Südlicht in einem anderen um ihren Boden. Hier in Lappland sind wir genau unter dem nördlichen Ring!',
      'Das Polarlicht ist sehr hoch: Sein Grün leuchtet etwa 100 Kilometer über dem Boden. Das ist zehnmal höher, als Flugzeuge fliegen!',
      'Auf Finnisch heißt das Nordlicht revontulet: Fuchsfeuer. Hast du den weißen Fuchs bei der Birke gesehen?',
    ],
    sci: [
      'Das Nordlicht hat einen südlichen Zwilling, das Südlicht. Beide leuchten in Ovalen um die geomagnetischen Pole, mit der Mitte bei etwa 67° magnetischer Breite.',
      'Die Teilchen, die es zum Leuchten bringen, sind meist Elektronen, beschleunigt auf einige tausend Elektronenvolt auf den letzten zehntausenden Kilometern ihres Falls entlang der Feldlinien.',
      'Am Boden ist Sauerstoff etwa ein Fünftel der Luft, als O2. Hoch oben spaltet das ultraviolette Sonnenlicht das O2, und oberhalb von etwa 200 km sind einzelne Sauerstoffatome die häufigsten Teilchen.',
    ],
  },
  gust: {
    label: 'Der Windstoß der Sonne',
    title: 'Ein Sturm von der Sonne',
    slider: 'Wie stark der Sturm ist (Kp)',
    kp: 'Kp {k}: {name}',
    scale: {
      kid: ['ganz ruhig', 'ruhig', 'ruhig', 'lebhaft', 'lebhaft', 'ein kleiner Sturm', 'ein Sturm', 'ein starker Sturm', 'ein schwerer Sturm', 'ein extremer Sturm'],
      sci: ['ruhig', 'ruhig', 'ruhig', 'unruhig', 'aktiv', 'G1, schwacher Sturm', 'G2, mäßiger Sturm', 'G3, starker Sturm', 'G4, schwerer Sturm', 'G5, extremer Sturm'],
    },
    verbs: { send: 'Schick einen Windstoß von der Sonne' },
    hints: {
      send: 'Tipp auf die Sonne, um einen Windstoß zu schicken',
      watch: 'Schau den Teilchen zu',
      stronger: 'Schau in den Himmel, oder mach den Sturm auf der Tafel stärker',
      again: 'Tipp auf die Sonne für einen weiteren Windstoß',
    },
    signs: {
      sun: 'die Sonne',
      earth: 'die Erde',
      camp: 'unser Lager',
      portugal: 'Portugal',
      seen: 'Portugal: gesehen!',
      model: { kid: 'ein Modell: nicht maßstabsgetreu', sci: 'nicht maßstabsgetreu: die Sonne ist 109 Erden breit und 150 Millionen km entfernt' },
    },
    says: {
      send: {
        kid: 'Wusch! Die Sonne hat eine riesige Wolke elektrisch geladener Teilchen hinausgeschleudert. Schau, wie der Magnetismus der Erde sie lenkt.',
        sci: 'Ein koronaler Massenauswurf: eine Milliarde Tonnen oder mehr magnetisiertes Plasma mit Hunderten bis Tausenden km/s. Ein echter braucht etwa 15 Stunden bis mehrere Tage bis zur Erde; hier drei Sekunden.',
      },
      arrive: {
        kid: 'Die meisten Teilchen werden um die Erde herumgelenkt, aber einige strömen rund um die Pole herab, in einem Ring. Jetzt schau nach oben: Der Himmel über unserem Lager tanzt!',
        sci: 'Die Magnetosphäre lenkt das meiste Plasma ab; der Sturm lädt den magnetischen Schweif, und entlang der Feldlinien beschleunigte Elektronen strömen in die Polarlichtovale um beide geomagnetischen Pole. Schau nach oben.',
      },
      far: {
        kid: 'Ein extremer Sturm! Der Ring hat sich so weit vom Pol ausgebreitet, dass man die Lichter in Portugal sehen konnte, wie am 10. Mai 2024.',
        sci: 'Kp 9, G5. Laut NOAA wurde bei G5 Polarlicht bis hinunter zu etwa 40° geomagnetischer Breite gesehen. Am 10. und 11. Mai 2024 wurde es in Portugal, Spanien, auf den Kanaren und in Mexiko fotografiert.',
      },
      calm: {
        kid: 'Ein sanfter Windstoß: Der Ring bleibt hier oben, rund um den hohen Norden. Mach den Sturm stärker und schick noch einen!',
        sci: 'Eine schwache Störung: Das Oval bleibt nahe seinem ruhigen Platz, bei etwa 65 bis 67° magnetischer Breite auf der Nachtseite.',
      },
    },
    rows: [
      ['Polarlichtoval, ruhig', 'etwa 67° magnetische Breite'],
      ['Sturm G3 (Kp 7)', 'gesehen bis etwa 50° geomagnetische Breite'],
      ['Sturm G5 (Kp 9)', 'gesehen bis etwa 40° geomagnetische Breite'],
      ['10. bis 11. Mai 2024', 'G5, Kp 9: von Portugal aus gesehen'],
      ['Geschwindigkeit eines KMA', 'etwa 250 bis 3000 km/s'],
    ],
    panel: {
      kid: [
        'Die Sonne bläst die ganze Zeit einen Wind aus winzigen geladenen Teilchen. Manchmal schleudert sie eine riesige Wolke davon hinaus, die einen Tag oder ein paar Tage später die Erde erreicht.',
        'Die Erde ist ein riesiger Magnet. Ihr Magnetismus lenkt die Teilchen um uns herum und nahe den Polen hinunter, in einem Ring. Wo sie auf die Luft prallen, leuchtet der Himmel. Tipp auf die Sonne, um einen Windstoß zu schicken; mach den Sturm stärker, und der Ring breitet sich weiter vom Pol aus.',
        'Am 10. Mai 2024 gab es einen riesigen Sturm. Die Lichter wurden bis nach Portugal gesehen: Viele Leute fanden sie auf ihren Handyfotos, in Rosa und Lila.',
      ],
      sci: [
        'Ein koronaler Massenauswurf (KMA) trägt eine Milliarde Tonnen oder mehr magnetisiertes Plasma mit etwa 250 bis 3000 km/s; er erreicht die Erde in etwa 15 Stunden bis mehreren Tagen. Das Modell ist nicht maßstabsgetreu, und seine Zeit läuft schnell.',
        'Die Magnetosphäre lenkt das meiste ab. Der Sturm dehnt und lädt den magnetischen Schweif; wird diese Energie frei, treffen Elektronen, entlang der Feldlinien auf einige keV beschleunigt, die obere Luft in zwei Ovalen um die geomagnetischen Pole, mit der Mitte bei etwa 67° magnetischer Breite und zur Nachtseite verschoben.',
        'Der Kp-Index (0 bis 9) misst, wie gestört das Erdmagnetfeld ist: Je stärker der Sturm, desto weiter breiten sich die Ovale zum Äquator aus. Die Skala der NOAA: G3 (Kp 7), Polarlicht gesehen bis etwa 50° geomagnetischer Breite; G5 (Kp 9), bis etwa 40°. Am 10. und 11. Mai 2024 (G5, der stärkste seit 2003) wurde es in ganz Portugal fotografiert, von Bragança bis Alqueva.',
      ],
    },
  },
  colours: {
    label: 'Die zwei Farben des Sauerstoffs',
    title: 'Grün unten, Rot oben',
    slider: 'Höhe am Himmel',
    height: '{h} km',
    verbs: { send: 'Schick ein Elektron in diese Höhe' },
    hints: {
      sky: 'Tipp auf das Polarlicht in irgendeiner Höhe, oder auf die Leiste bei der Linse',
      watch: 'Schau dem Sauerstoffatom zu',
      high: 'Jetzt tipp ganz hoch, nahe der Spitze',
      low: 'Jetzt tipp ganz an den unteren Rand',
      again: 'Tipp auf irgendeine Höhe zum Vergleichen',
    },
    tally: { green: 'Grün gegeben', red: 'Rot gegeben', bumped: 'Vor dem Rot angestoßen', nitrogen: 'Stickstoff hat geleuchtet' },
    signs: {
      height: { kid: '{h} km hoch', sci: 'in {h} km' },
      ladder: { kid: 'eine Leiter hinauf ins Polarlicht', sci: 'Höhe über dem Boden' },
      lifted: { kid: 'hochgehoben!', sci: 'angeregt zu 1S' },
      wait: { kid: 'wartet darauf, rot zu leuchten...', sci: 'auf 1D, wartet' },
      red: { kid: 'rot!', sci: '1D zum Grundzustand: rot' },
      bumped: { kid: 'bums! kein Rot', sci: 'gelöscht: kein Rot' },
      nitrogen: { kid: 'Stickstoff leuchtet blau und lila', sci: 'N2+ leuchtet: blauviolett' },
      greenLine: 'grün 557,7 nm',
      redLine: 'rot 630,0 nm',
      violetLine: '427,8 nm',
      clock: 'echte Zeit: {t} s',
      after: 'nach {t} s',
      bumpedAfter: 'angestoßen nach {t} s',
      fast: 'die Zeit läuft 20-mal schneller, während es wartet',
      tally: 'grün {g}    rot {r}    angestoßen {b}',
    },
    says: {
      low: {
        kid: 'Grün! Aber kein Rot: Hier unten ist die Luft voll, und ein vorbeifliegendes Molekül hat das Atom angestoßen und ihm zuerst die Energie genommen.',
        sci: 'In {h} km hat ein Stoß das 1D-Niveau nach {t} s gelöscht, lange vor seiner Lebensdauer von 110 s: Grün, aber kein 630,0 nm.',
      },
      middle: {
        kid: 'Grün, dann ein Stoß vor dem Rot. Weiter oben wird es besser: Probier es näher an der Spitze!',
        sci: 'In {h} km gewinnen die Stöße noch fast immer (hier nach {t} s). Oberhalb von etwa 200 km beginnt die rote Linie zu gewinnen.',
      },
      red: {
        kid: 'Rot! Hier oben ist die Luft so dünn, dass das Atom warten und warten konnte und dann rot geleuchtet hat.',
        sci: 'In {h} km hat das Atom nach {t} s 630,0 nm ausgesandt: Hier oben sind Stöße selten genug für den langsamen Übergang.',
      },
      nitrogen: {
        kid: 'Ganz unten gibt es kaum einzelne Sauerstoffatome. Das Elektron hat Stickstoff getroffen, der blau und lila leuchtet: der Saum unter dem Grün.',
        sci: 'Unterhalb von etwa 100 km wird atomarer Sauerstoff rasch seltener, deshalb endet das Grün an einer scharfen Kante. Die energiereichsten Elektronen erreichen hier N2: N2+ gibt die blauviolette Bande bei 427,8 nm, N2 rote Banden; zusammen der lila Saum.',
      },
    },
    rows: [
      ['Grüne Linie', '557,7 nm, O(¹S → ¹D), etwa 0,7 s, meist 100 bis 150 km'],
      ['Rote Linie', '630,0 nm, O(¹D → ³P), etwa 110 s, oberhalb von etwa 150 bis 200 km'],
      ['Lila Saum', 'N₂⁺ 427,8 nm und rote Banden von N₂, bei etwa 90 bis 100 km'],
      ['Luft in 100 km', 'etwa 30 000-mal dichter als in 300 km'],
    ],
    panel: {
      kid: [
        'Steig die Leiter hinauf ins Polarlicht! Tipp auf den Vorhang in einer Höhe (oder auf die Leiste bei der Linse, oder schieb den Regler), und ein Elektron aus dem All trifft dort ein Sauerstoffatom. Die Linse zeigt, was passiert.',
        'Das Atom wird hochgehoben und gibt seine Energie dann als Licht zurück. Grün kommt in weniger als einer Sekunde. Danach kann es auch Rot geben, aber erst nach fast zwei Minuten Warten, deshalb läuft die Uhr hier schneller, während es wartet.',
        'Weiter unten ist die Luft voll: Ein vorbeifliegendes Molekül stößt das wartende Atom an und nimmt ihm die Energie, also kein Rot. Hoch oben sind die Atome weit voneinander entfernt, und das Rot kann leuchten. Ganz unten leuchtet Stickstoff blau und lila.',
      ],
      sci: [
        'Ein Polarlicht-Elektron regt atomaren Sauerstoff an. Vom ¹S-Niveau (4,19 eV) fällt er unter Aussendung der grünen 557,7-nm-Linie in etwa 0,7 s auf ¹D; von ¹D (1,97 eV) kann er unter Aussendung der roten 630,0-nm-Linie (und 636,4 nm) in den Grundzustand fallen, aber erst nach durchschnittlich etwa 110 s. Beides sind „verbotene“ Übergänge, deshalb sind sie so langsam.',
        'Weiter unten nehmen Stöße mit N₂ und O₂ die Energie von ¹D zuerst (Stoßlöschung), deshalb leuchtet das Rot nur hoch oben, oberhalb von etwa 150 bis 200 km. Das Grün, schnell genug, leuchtet meist in 100 bis 150 km; unterhalb von etwa 100 km wird atomarer Sauerstoff selten, was dem Vorhang seine scharfe Unterkante gibt.',
        'Unten erreichen die energiereichsten Elektronen N₂: N₂⁺ gibt eine blauviolette Bande bei 427,8 nm, N₂ einige rote Banden; zusammen bilden sie den lila Saum starker Polarlichter. Hier läuft die Zeit 20-mal schneller, während das Atom auf ¹D wartet, und das Gedränge in der Linse folgt der echten Dichte in einer zusammengedrückten Skala.',
      ],
    },
  },
  camera: {
    label: 'Das Sehen',
    title: 'Deine Augen und eine Kamera',
    slider: 'Belichtungszeit',
    verbs: { shoot: 'Mach eine Langzeitbelichtung', fox: 'Erzähl die Geschichte vom Fuchs' },
    hints: {
      shoot: 'Tipp auf die Kamera für eine Langzeitbelichtung',
      open: 'Halt still, der Verschluss ist offen',
      fox: 'Schieb die Belichtungszeit, oder tipp auf den weißen Fuchs',
      again: 'Schieb die Belichtungszeit, oder tipp noch einmal auf die Kamera',
    },
    signs: {
      eye: { kid: 'deine Augen', sci: 'das Auge nachts: Stäbchen' },
      cam: { kid: 'die Kamera, {t}', sci: 'die Kamera: {t} belichtet' },
      fox: { kid: 'revontulet: Fuchsfeuer', sci: 'revontulet, die Feuer des Fuchses' },
    },
    says: {
      photo: {
        kid: 'Schau dir das Foto der Kamera an: so viel mehr Farbe, als deine Augen sehen! Sogar das Rot oben ist zu sehen.',
        sci: 'Der Sensor sammelt Licht über die ganze Belichtung; das Auge summiert es nur einen Bruchteil einer Sekunde lang, und bei schwachem Licht sieht es mit Stäbchen, die keine Farben und kaum Rot sehen.',
      },
      long: {
        kid: 'So lange, dass die tanzenden Vorhänge verschwimmen und der Schnee viel zu hell wird!',
        sci: 'Zu lang: Die bewegten Strahlen verwischen, und die hellen Stellen sind überbelichtet. Polarlichtfotografen belichten meist einige Sekunden.',
      },
      short: {
        kid: 'Zu kurz: Die Kamera hat fast nichts gesehen, genau wie deine Augen.',
        sci: 'Zu kurz, um genug Licht zu sammeln: unterbelichtet, so dunkel wie der Blick des Auges.',
      },
      fox: {
        kid: 'Ein finnisches Volksmärchen erzählt, dass ein Fuchs über die verschneiten Fjells lief und sein Schwanz Funken in den Himmel fegte. Deshalb heißt das Nordlicht revontulet: Fuchsfeuer!',
        sci: 'Revontulet: „die Feuer des Fuchses“ (repo ist ein altes finnisches Wort für Fuchs). In einem Volksmärchen aus Lappland schleudert ein Feuerfuchs, der über die Fjells läuft, mit seinem Schwanz Funken in den Himmel; in anderen Fassungen wirbelt sein Schwanz Schneekristalle auf, die funkeln. Ein Märchen, in vielen Fassungen erzählt.',
      },
    },
    rows: [
      ['Nachtsehen', 'Stäbchen: keine Farben, am empfindlichsten bei etwa 507 nm, für Rot fast blind'],
      ['Farbsehen', 'Zapfen: brauchen mehr Licht, am empfindlichsten bei etwa 555 nm'],
      ['Ein übliches Polarlichtfoto', 'einige Sekunden, offene Blende, hohe ISO'],
    ],
    panel: {
      kid: [
        'Nachts schalten deine Augen auf ihre Nachtzellen um. Sie sehen gut im Dunkeln, aber nicht in Farbe, und Rot fast gar nicht. Deshalb sieht ein schwaches Polarlicht für dich grau oder blassgrün aus.',
        'Eine Kamera kann ihren Verschluss Sekunden lang offen halten und viel mehr Licht sammeln, deshalb zeigt ihr Foto das Grün und das Rot. Tipp auf die Kamera; schieb die Belichtungszeit, um kürzere und längere auszuprobieren.',
        'Auf Finnisch heißt das Nordlicht revontulet: Fuchsfeuer. Tipp auf den weißen Fuchs, um zu hören, warum.',
      ],
      sci: [
        'Bei schwachem Licht sieht das Auge mit den Stäbchen (skotopisches Sehen): sehr empfindlich, aber farbenblind, am empfindlichsten bei etwa 507 nm und bei 630 nm fast blind. Die Zapfen, die Farben sehen, brauchen mehr Licht; sie sind bei etwa 555 nm am empfindlichsten, deshalb zeigt ein helles Polarlicht das 557,7-nm-Grün des Sauerstoffs am besten, und sein schwaches 630,0-nm-Rot bleibt oft unbemerkt.',
        'Ein Sensor summiert Licht über die ganze Belichtung und behält bei schwachem Licht die Farbe, deshalb halten einige Sekunden weit mehr fest als das Auge. Zu lang, und die bewegten Strahlen verwischen und die hellsten Stellen sind überbelichtet. Am 10. Mai 2024 fanden viele Menschen in Portugal das Polarlicht nur auf ihren Handyfotos.',
        'Hier zeichnet die Kamera das Lager von ihrem Stativ aus mehrmals während der Belichtung und addiert die Bilder; der Blick des Auges behält vor allem das Licht, das die Stäbchen auffangen würden.',
      ],
    },
  },
}

export const AURORA_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
