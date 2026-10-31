// The words of hydrogen's Jupiter room ("What is inside Jupiter?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/H.js
// (the easel shows it); the room rides down into the clouds and adds to it.
// Sources: NASA NSSDC, "Galileo probe new results" (helium about 24 % by mass against the Sun's about 25 %;
// winds of more than 400 mph; lightning about a tenth of Earth's per area, each event about ten times as
// energetic; the hot spot; the dry entry site; entry above 106,000 mph, 228 g, 57 minutes of data);
// Seiff et al., J. Geophys. Res. 103 (1998), the probe's temperature profile (166.1 K at 1 bar, 429 K at
// 22 bar, 133 km below the 1-bar level, close to a dry adiabat between 6 and 16 bar); Wikipedia's Galileo
// probe (entry on 7 December 1995 at 6°30′ N); Weir, Mitchell and Nellis, Phys. Rev. Lett. 76, 1860 (1996)
// (resistivity of shocked liquid hydrogen falling almost four orders of magnitude from 93 to 140 GPa, level
// to 180 GPa; a semiconducting to metallic, mostly diatomic fluid at about 140 GPa and 3000 K; ninefold
// compression); Wigner and Huntington, J. Chem. Phys. 3, 764 (1935). Jupiter's dipole (about 4.2 gauss at
// the equator, moment about 1.5 × 10²⁰ T·m³, tilted about 10°, opposite to Earth's) and Io's footprint
// (Connerney et al., Science 1993) as in the usual references. Placeholders: {p} (million bar), {n}.
// Unsure, so said loosely: where in Jupiter the hydrogen counts as a metal (models differ: "thousands of
// kilometres down"); the pressure where the probe's parachute opened (not claimed); its minutes at each level.
export const JUPITER_WORDS = {
  en: {
    title: 'Into Jupiter\'s clouds',
    greet: {
      kid: 'We are inside the picture: hanging under a giant parachute above Jupiter\'s clouds, where the Galileo probe fell in 1995. Jupiter has no ground, only gas getting thicker, hotter and darker. The picture\'s story is on the easel.',
      sci: 'Inside the picture: an observation gondola under a parachute at 0.4 bar in Jupiter\'s atmosphere, above the Galileo probe\'s entry site (7 December 1995, 6.5° N). The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'I am hydrogen, and Jupiter is mostly me! It weighs as much as 318 Earths.',
        'Jupiter spins so fast that its day lasts less than 10 hours.',
        'More than 1300 Earths would fit inside Jupiter.',
      ],
      sci: [
        'Jupiter: 318 Earth masses. Its outer envelope is about three quarters hydrogen and a quarter helium by mass, like the gas the Sun was born from.',
        'The probe also found neon at about a tenth of the Sun\'s share: perhaps carried down in droplets of helium raining out deep inside.',
        'Jupiter gives off about 1.7 times as much energy as it gets from the Sun: it is still losing the heat of its birth.',
      ],
    },
    descent: {
      label: 'The descent',
      title: 'Down through the clouds',
      slider: 'How deep',
      hints: {
        sink: 'Tap the red handle to sink',
        helium: 'Tap the helium counter',
        lightning: 'Tap the lightning detector',
        probe: 'Tap the Galileo probe outside',
        deeper: 'Tap the red handle to sink deeper',
        top: 'Tap the red handle to float back up',
        moving: 'Sinking, watch the clouds go by',
      },
      buttons: { sink: 'Sink to the next level', helium: 'Measure the helium', lightning: 'Listen for lightning', probe: 'Ask the probe' },
      labels: { handle: 'sink', helium: 'helium counter', lightning: 'lightning detector', measuring: 'measuring', listening: 'listening', hydrogen: 'hydrogen', heliumBar: 'helium' },
      board: {
        title: 'Galileo\'s way down',
        depth: 'depth',
        pressure: 'pressure',
        temp: 'temperature',
        kidP: '{n} × the air at home',
        probe: 'Galileo probe, 1995',
        lost: 'signal lost',
        imagined: 'imagined',
        clouds: { kid: ['ammonia ice', 'brown clouds', 'water clouds'], sci: ['NH₃ ice', 'NH₄SH', 'H₂O'] },
        where: {
          above: 'Above the clouds',
          ammonia: 'Inside the ammonia ice clouds',
          between: 'Between the clouds',
          nh4sh: 'Inside the brown clouds',
          water: 'Inside the water clouds',
          below: 'Below the clouds: hot, dark gas',
          imagined: 'Imagined: no probe has been here',
        },
      },
      stops: [
        { kid: 'Back at the top, under our parachute. It is about −145 °C up here! Below us lie three layers of cloud, and we can see them through a clear hole.', sci: '0.4 bar, about 128 K (−145 °C), some 21 km above the 1-bar level. Below: the expected decks of ammonia ice (0.7 bar), ammonium hydrosulfide (2 bar) and water (5 bar).' },
        { kid: 'We are in the top clouds: tiny crystals of ammonia ice, white like snow. They make Jupiter\'s pale stripes. About −120 °C!', sci: '0.7 bar, about −120 °C: the ammonia ice (NH3) deck, the white tops of Jupiter\'s bright zones.' },
        { kid: 'Brown clouds now, made of ammonia and hydrogen sulfide. They would smell of rotten eggs! −70 °C, and the gas presses twice as hard as the air at home.', sci: '2 bar, about −70 °C: the ammonium hydrosulfide (NH4SH) deck, from NH3 and H2S. What paints the belts brown is still argued over: traces of other compounds.' },
        { kid: 'Water clouds, like Earth\'s! It is about 0 °C, and the gas presses five times as hard as the air at home. Look: lightning flashes inside them.', sci: '5 bar, about 0 °C: the water cloud deck, where the temperature passes 273 K and water condenses. Jupiter\'s lightning forms here (Voyager 1 saw its flashes in 1979).' },
        { kid: 'No more clouds below us, only thick, hot gas getting darker. It is 65 °C, hotter than any summer day, and ten times the air\'s pressure.', sci: '10 bar, about 335 K (65 °C): below the clouds the gas warms steadily with depth, close to a dry adiabat, as the probe measured it between 6 and 16 bar.' },
        { kid: 'This is where the Galileo probe went quiet, after about 58 minutes of falling: 155 °C and 22 times the pressure of the air at home. The heat and the squeeze were too much for it.', sci: '22 bar, 429 K (156 °C), 133 km below the 1-bar level: the probe\'s last data. Beyond here no instrument has ever reached.' },
        { kid: 'No probe has ever come this deep, so from here on we only imagine it: 100 times the air\'s pressure, about 410 °C, hotter than any oven, and pitch dark. And it goes on getting thicker for thousands of kilometres.', sci: '100 bar, about 680 K (410 °C), if the dry adiabat holds: below 22 bar these numbers come from that model, not from a measurement. The hydrogen grows denser and hotter for tens of thousands of kilometres; there is no surface.' },
      ],
      says: {
        up: { kid: 'Up we go, back to the top of the clouds!', sci: 'Rising to 0.4 bar.' },
        lost: { kid: 'Beep... silence. The Galileo probe has stopped talking. It fell on into the heat, which destroyed it.', sci: 'Loss of signal at about 22 bar, 57.6 minutes into the descent. The probe fell on; the heat deeper down destroyed it.' },
        helium: { kid: 'The helium counter says: about three quarters of the gas\'s weight is hydrogen and a quarter is helium. Almost the same mix as the Sun!', sci: 'Galileo\'s helium abundance detector: He/H2 = 0.157 by number, a helium mass fraction of about 0.24, close to the Sun\'s 0.25.' },
        lightning: { kid: 'Crackle, crackle! The detector hears lightning by its radio noise, from storms far away. Jupiter\'s lightning is rarer than Earth\'s, but each flash is about ten times stronger.', sci: 'The Lightning and Radio Emission Detector heard distant discharges: about a tenth of Earth\'s flash rate per area, each event about ten times as energetic.' },
        probeGone: { kid: 'The probe is gone: its radio went quiet at 22 bar, and the heat destroyed it.', sci: 'The probe was lost at 22 bar.' },
      },
      probe: [
        { kid: 'That is the Galileo probe, falling beside us! It hit Jupiter\'s air at about 170,000 km/h; its heat shield slowed it, squeezed 228 times as hard as Earth\'s gravity. Then its parachute opened.', sci: 'The Galileo probe: entry on 7 December 1995 at about 47 km/s (170,000 km/h), up to 228 g behind its heat shield; then the parachute, radioing its data to the Galileo orbiter overhead.' },
        { kid: 'The probe fell into a clear, dry patch between the clouds, a "hot spot", like the hole we are sinking through.', sci: 'It entered near the edge of a 5-micron hot spot: a clear, dry region where heat from below shines out, so it met far fewer clouds than expected.' },
        { kid: 'The probe found only thin clouds: one layer, not the three thick ones expected.', sci: 'Instead of three thick decks, the probe\'s instruments found thin cloud, with one distinct layer: what a hot spot would give.' },
        { kid: 'Here the probe expected thick water clouds, but the gas was surprisingly dry.', sci: 'Little water vapour and no thick water cloud: the hot spot was dry. Most of the team thought Jupiter as a whole unlikely to be so short of water.' },
        { kid: 'Even down here the probe was blown along by winds of about 650 km/h, faster than any hurricane on Earth. They are pushed by heat from deep inside Jupiter.', sci: 'Doppler tracking of the probe\'s radio: winds above 400 mph (650 km/h) that did not die down below the clouds, so they are probably driven by heat escaping from inside, not by sunlight.' },
      ],
      panel: {
        kid: [
          'We are riding where the Galileo probe went on 7 December 1995: down through Jupiter\'s clouds, hanging under a parachute. Jupiter has no ground. The deeper you go, the thicker, hotter and darker the gas gets.',
          'Tap the red handle to sink from one cloud layer to the next, or slide the depth. Tap the instruments on the desk and the probe outside to find out what the real probe found.',
        ],
        sci: [
          'Galileo\'s probe descended under its parachute to 22 bar, radioing 57.6 minutes of data to the orbiter overhead. The board follows its measured temperatures: 166 K at 1 bar, 429 K at 22 bar, close to a dry adiabat below the clouds. Depths count from where our descent began, about 21 km above the 1-bar level.',
          'The three cloud decks stand where equilibrium chemistry puts them: ammonia ice near 0.7 bar, ammonium hydrosulfide near 2 bar, water near 5 bar. Below 22 bar no instrument has been: the gondola carries on along the same adiabat, an imagined continuation.',
        ],
      },
    },
    squeeze: {
      label: 'Squeezing hydrogen',
      title: 'Making a metal out of hydrogen',
      slider: 'How hard the gun squeezes',
      format: '{p} million bar',
      hints: { fire: 'Tap the gas gun to fire', load: 'Tap the frosty flask to load a fresh sample', watch: 'Watch the lens' },
      buttons: { fire: 'Fire the gun', load: 'Load a fresh sample' },
      labels: { gun: 'gas gun (model)', flask: 'liquid hydrogen', chart: 'Your shots', x: 'pressure (million bar)', yKid: 'how well electricity flows', ySci: 'conductivity (log scale)', metal: 'like a metal', none: 'too little to measure', nellis: 'Livermore, 1996', jupiter: 'like deep in Jupiter' },
      says: {
        load: { kid: 'A fresh drop of liquid hydrogen, at −253 °C, sealed between two windows of sapphire.', sci: 'A fresh cell: a thin layer of liquid hydrogen at 20 K between sapphire anvils, with electrodes to measure its resistance.' },
        loaded: { kid: 'There is already a fresh sample in the gun. Fire it!', sci: 'A sample is loaded.' },
        noCell: { kid: 'The last shot smashed the sample. Tap the frosty flask to load a fresh one.', sci: 'The cell was destroyed by the last shot: load a fresh one.' },
        fire: { kid: 'Bang! A plate flies down the barrel at several kilometres a second and slams into the sample. In real life the squeeze lasts less than a millionth of a second; here it is slowed right down.', sci: 'Impactor away: the shock reverberates between the anvils, compressing the hydrogen in steps (shown slowed down by about a million).' },
        insulator: { kid: 'Squeezed hard, but the bulb stays dark: the molecules are crowded together, but each keeps its electrons.', sci: '{p} Mbar: still an insulator, too resistive to read.' },
        semi: { kid: 'A faint glow! A few electrons are starting to hop between the squeezed molecules. Squeeze harder!', sci: '{p} Mbar: a semiconducting fluid, its resistivity falling steeply with pressure.' },
        metal: { kid: 'The bulb lights! At 1.4 million times the air\'s pressure the electrons roam freely through the hydrogen: it has become a liquid metal, like deep inside Jupiter!', sci: '{p} Mbar, about 3000 K: metallic. The resistivity has levelled off at a value typical of a liquid metal (Weir, Mitchell and Nellis, 1996).' },
      },
      panel: {
        kid: [
          'Deep inside Jupiter the hydrogen is squeezed by the weight of all the gas above it. Nobody can go there, so in 1996, at Livermore in California, scientists squeezed hydrogen themselves: a gas gun fired a plate at several kilometres a second into a thin layer of liquid hydrogen.',
          'For less than a millionth of a second it was squeezed to more than a million times the pressure of air, and became very hot. At about 1.4 million times, the hydrogen started to carry electricity like a metal. That is how the hydrogen deep in Jupiter can make its giant magnet.',
        ],
        sci: [
          'The experiment: a two-stage light-gas gun at Lawrence Livermore National Laboratory fired an impactor at several km/s into a cell of liquid hydrogen (20 K) between sapphire anvils. The shock reverberating between the anvils compressed it in steps, which kept it far cooler (about 3000 K) than a single shock would, while electrodes measured its resistance.',
          'Weir, Mitchell and Nellis (Phys. Rev. Lett. 76, 1860, 1996): from 0.93 to 1.4 Mbar (93 to 140 GPa) the resistivity fell almost four orders of magnitude, then stayed at a value typical of a liquid metal up to 1.8 Mbar: a continuous change from a semiconducting to a metallic, still mostly diatomic fluid, at about nine times the liquid\'s density.',
          'Eugene Wigner and Hillard Huntington predicted metallic hydrogen in 1935, expecting it at about 0.25 Mbar. Solid metallic hydrogen needs far more, and claims to have made it in diamond anvil cells (since 2017) are still argued over. In Jupiter the hydrogen conducts like this thousands of kilometres down, and deeper.',
        ],
      },
    },
    magnet: {
      label: 'Jupiter\'s magnet',
      title: 'The biggest magnet among the planets',
      hints: { field: 'Tap Jupiter to show its magnet', pole: 'Tap one of Jupiter\'s poles', io: 'Tap Io, the little yellow moon', earth: 'Tap the little Earth', again: 'Tap Jupiter, a pole, Io or the Earth' },
      buttons: { field: 'Magnet', aurora: 'Auroras', io: 'Io\'s volcanoes', earth: 'The Earth beside it' },
      labels: { north: 'north', south: 'south', io: 'Io', earth: 'Earth', compass: 'compass' },
      says: {
        fieldOn: { kid: 'Jupiter\'s magnet! Its spinning sea of metal hydrogen makes the strongest magnet of any planet. Look at the compass: its red end points to Jupiter\'s south. Jupiter\'s magnet is the other way round from Earth\'s!', sci: 'The dipole: about 20,000 times Earth\'s magnetic moment, tilted about 10° from the spin axis and opposite to Earth\'s, so a compass\'s north end points south. Currents in the conducting hydrogen drive it as Jupiter turns, once in 9 h 56 min.' },
        fieldOff: { kid: 'Magnet hidden. (The real one never switches off!)', sci: 'Field lines hidden.' },
        auroraOn: { kid: 'Auroras glow in rings round both poles, much bigger than Earth\'s. They shine mostly in ultraviolet light from hydrogen, which our eyes cannot see, so here they are drawn pink, as in the picture.', sci: 'The main auroral ovals: mostly ultraviolet emission from H and H2, and infrared from H3+, drawn in the picture\'s pink. Unlike Earth\'s, they are powered mainly by Jupiter\'s own spin and the plasma from Io, more than by the solar wind.' },
        auroraOff: { kid: 'Auroras hidden.', sci: 'Ovals hidden.' },
        ioOn: { kid: 'Io has hundreds of volcanoes. They puff out about a tonne of gas every second, which becomes a ring of charged gas round Jupiter. The magnet joins Io to Jupiter, and where that link lands, a bright spot of aurora follows Io round!', sci: 'Io\'s volcanoes supply about a tonne a second of sulfur and oxygen to a torus of plasma along its orbit. Io, moving through the field, drives currents along the field lines into Jupiter\'s upper atmosphere: Io\'s footprint, an auroral spot that follows it (first seen in the infrared in 1993). Io really orbits about 6 Jupiter radii out; here it is drawn closer.' },
        ioOff: { kid: 'Io rests.', sci: 'Torus and footprint hidden.' },
        earthOn: { kid: 'That is the Earth, to scale: Jupiter is 11 Earths wide! And Jupiter\'s magnet is about 20,000 times as strong as Earth\'s. On Earth, a compass points north.', sci: 'Earth to scale: Jupiter\'s equator is 11.2 Earth diameters. Earth\'s dipole moment is about 20,000 times smaller; at the cloud tops Jupiter\'s field is about 4 gauss at the equator, some 14 times Earth\'s at its surface.' },
        earthOff: { kid: 'The Earth\'s magnet is hidden.', sci: 'Earth\'s field hidden.' },
      },
      panel: {
        kid: [
          'Deep inside Jupiter, the liquid metal hydrogen carries electricity. As Jupiter spins, once every 10 hours, electric currents swirl in it and make a gigantic magnet. Its magnetic bubble is so big that, if we could see it from Earth, it would look bigger than the full Moon, and its tail stretches as far as Saturn\'s orbit.',
          'Tap the planet, its poles, Io and the little Earth to see what the magnet does.',
        ],
        sci: [
          'A dynamo: convection in the electrically conducting hydrogen, turned by Jupiter\'s fast rotation (9 h 56 min), keeps the field going. Magnetic moment about 1.5 × 10²⁰ T·m³, about 20,000 times Earth\'s; the dipole is tilted about 10° and points the opposite way to Earth\'s present one.',
          'Juno, in orbit since 2016, mapped the field close up: it is lumpier than expected, with an intense patch near the equator (the "Great Blue Spot"), and the core it found is dilute, not a small solid ball.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Para dentro das nuvens de Júpiter',
    greet: {
      kid: 'Estamos dentro da imagem: pendurados num paraquedas gigante por cima das nuvens de Júpiter, onde a sonda Galileo caiu em 1995. Júpiter não tem chão, só gás cada vez mais espesso, mais quente e mais escuro. A história da imagem está no cavalete.',
      sci: 'Dentro da imagem: uma gôndola de observação presa a um paraquedas, a 0,4 bar na atmosfera de Júpiter, por cima do local de entrada da sonda Galileo (7 de dezembro de 1995, 6,5° N). A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Eu sou o hidrogénio, e Júpiter é feito sobretudo de mim! Pesa tanto como 318 Terras.',
        'Júpiter gira tão depressa que o seu dia dura menos de 10 horas.',
        'Cabiam mais de 1300 Terras dentro de Júpiter.',
      ],
      sci: [
        'Júpiter: 318 massas terrestres. O seu invólucro exterior é cerca de três quartos hidrogénio e um quarto hélio, em massa, como o gás de que o Sol nasceu.',
        'A sonda também encontrou néon a cerca de um décimo da parte que tem no Sol: talvez levado para o fundo em gotas de hélio que chovem lá dentro.',
        'Júpiter emite cerca de 1,7 vezes a energia que recebe do Sol: ainda está a perder o calor do seu nascimento.',
      ],
    },
    descent: {
      label: 'A descida',
      title: 'Para baixo, através das nuvens',
      slider: 'Profundidade',
      hints: {
        sink: 'Toca na alavanca vermelha para descer',
        helium: 'Toca no contador de hélio',
        lightning: 'Toca no detetor de relâmpagos',
        probe: 'Toca na sonda Galileo lá fora',
        deeper: 'Toca na alavanca vermelha para descer mais',
        top: 'Toca na alavanca vermelha para voltar a subir',
        moving: 'A descer, vê as nuvens a passar',
      },
      buttons: { sink: 'Descer ao nível seguinte', helium: 'Medir o hélio', lightning: 'Escutar os relâmpagos', probe: 'Perguntar à sonda' },
      labels: { handle: 'descer', helium: 'contador de hélio', lightning: 'detetor de relâmpagos', measuring: 'a medir', listening: 'a escutar', hydrogen: 'hidrogénio', heliumBar: 'hélio' },
      board: {
        title: 'O caminho da Galileo',
        depth: 'profundidade',
        pressure: 'pressão',
        temp: 'temperatura',
        kidP: '{n} × o ar cá de casa',
        probe: 'sonda Galileo, 1995',
        lost: 'sinal perdido',
        imagined: 'imaginado',
        clouds: { kid: ['gelo de amoníaco', 'nuvens castanhas', 'nuvens de água'], sci: ['gelo de NH₃', 'NH₄SH', 'H₂O'] },
        where: {
          above: 'Por cima das nuvens',
          ammonia: 'Dentro das nuvens de gelo de amoníaco',
          between: 'Entre as nuvens',
          nh4sh: 'Dentro das nuvens castanhas',
          water: 'Dentro das nuvens de água',
          below: 'Por baixo das nuvens: gás quente e escuro',
          imagined: 'Imaginado: nenhuma sonda chegou aqui',
        },
      },
      stops: [
        { kid: 'De volta ao topo, presos ao nosso paraquedas. Aqui em cima estão cerca de −145 °C! Lá em baixo há três camadas de nuvens, e vemo-las por um buraco limpo.', sci: '0,4 bar, cerca de 128 K (−145 °C), uns 21 km acima do nível de 1 bar. Em baixo: as camadas esperadas de gelo de amoníaco (0,7 bar), hidrogenossulfureto de amónio (2 bar) e água (5 bar).' },
        { kid: 'Estamos nas nuvens de cima: cristais minúsculos de gelo de amoníaco, brancos como neve. São eles que fazem as riscas claras de Júpiter. Cerca de −120 °C!', sci: '0,7 bar, cerca de −120 °C: a camada de gelo de amoníaco (NH3), os topos brancos das zonas claras de Júpiter.' },
        { kid: 'Agora nuvens castanhas, feitas de amoníaco e sulfureto de hidrogénio. Cheirariam a ovos podres! −70 °C, e o gás aperta o dobro do ar cá de casa.', sci: '2 bar, cerca de −70 °C: a camada de hidrogenossulfureto de amónio (NH4SH), de NH3 e H2S. O que pinta as faixas de castanho ainda se discute: vestígios de outros compostos.' },
        { kid: 'Nuvens de água, como as da Terra! Estão cerca de 0 °C, e o gás aperta cinco vezes mais do que o ar cá de casa. Olha: relâmpagos a piscar lá dentro.', sci: '5 bar, cerca de 0 °C: a camada de nuvens de água, onde a temperatura passa os 273 K e a água condensa. É aqui que se formam os relâmpagos de Júpiter (a Voyager 1 viu-os em 1979).' },
        { kid: 'Já não há nuvens por baixo de nós, só gás espesso e quente, cada vez mais escuro. Estão 65 °C, mais do que em qualquer dia de verão, e dez vezes a pressão do ar.', sci: '10 bar, cerca de 335 K (65 °C): por baixo das nuvens o gás aquece com a profundidade, perto de uma adiabática seca, como a sonda o mediu entre 6 e 16 bar.' },
        { kid: 'Foi aqui que a sonda Galileo se calou, depois de uns 58 minutos a cair: 155 °C e 22 vezes a pressão do ar cá de casa. O calor e o aperto foram demais para ela.', sci: '22 bar, 429 K (156 °C), 133 km abaixo do nível de 1 bar: os últimos dados da sonda. Para lá daqui nenhum instrumento chegou.' },
        { kid: 'Nenhuma sonda desceu tanto, por isso daqui para baixo só imaginamos: 100 vezes a pressão do ar, cerca de 410 °C, mais quente do que qualquer forno, e escuro como breu. E continua a ficar mais espesso durante milhares de quilómetros.', sci: '100 bar, cerca de 680 K (410 °C), se a adiabática seca se mantiver: abaixo de 22 bar estes números vêm desse modelo, não de uma medição. O hidrogénio fica mais denso e mais quente ao longo de dezenas de milhares de quilómetros; não há superfície.' },
      ],
      says: {
        up: { kid: 'Lá vamos nós, de volta ao topo das nuvens!', sci: 'A subir para 0,4 bar.' },
        lost: { kid: 'Bip... silêncio. A sonda Galileo deixou de falar. Continuou a cair para o calor, que a destruiu.', sci: 'Perda de sinal a cerca de 22 bar, 57,6 minutos depois do início da descida. A sonda continuou a cair; o calor mais abaixo destruiu-a.' },
        helium: { kid: 'O contador de hélio diz: cerca de três quartos do peso do gás é hidrogénio e um quarto é hélio. Quase a mesma mistura que o Sol!', sci: 'O detetor de abundância de hélio da Galileo: He/H2 = 0,157 em número, uma fração mássica de hélio de cerca de 0,24, perto da do Sol, 0,25.' },
        lightning: { kid: 'Crepita, crepita! O detetor ouve os relâmpagos pelo seu ruído de rádio, vindo de tempestades distantes. Em Júpiter há menos relâmpagos do que na Terra, mas cada um é cerca de dez vezes mais forte.', sci: 'O detetor de relâmpagos e emissões de rádio ouviu descargas distantes: cerca de um décimo da frequência da Terra por área, cada uma cerca de dez vezes mais energética.' },
        probeGone: { kid: 'A sonda desapareceu: o rádio calou-se aos 22 bar, e o calor destruiu-a.', sci: 'A sonda perdeu-se aos 22 bar.' },
      },
      probe: [
        { kid: 'Aquela é a sonda Galileo, a cair ao nosso lado! Entrou no ar de Júpiter a cerca de 170 000 km/h; o escudo térmico travou-a, apertada 228 vezes mais do que a gravidade da Terra. Depois abriu-se o paraquedas.', sci: 'A sonda Galileo: entrada a 7 de dezembro de 1995 a cerca de 47 km/s (170 000 km/h), até 228 g atrás do escudo térmico; depois o paraquedas, a enviar os dados por rádio para o orbitador Galileo lá em cima.' },
        { kid: 'A sonda caiu numa zona limpa e seca entre as nuvens, um "ponto quente", como o buraco por onde estamos a descer.', sci: 'Entrou perto da borda de um ponto quente de 5 mícrones: uma região limpa e seca por onde o calor de baixo brilha para fora, por isso encontrou muito menos nuvens do que se esperava.' },
        { kid: 'A sonda só encontrou nuvens finas: uma camada, e não as três camadas espessas que se esperavam.', sci: 'Em vez de três camadas espessas, os instrumentos da sonda encontraram nuvens finas, com uma única camada distinta: o que um ponto quente daria.' },
        { kid: 'Aqui a sonda esperava nuvens de água espessas, mas o gás estava surpreendentemente seco.', sci: 'Pouco vapor de água e nenhuma nuvem de água espessa: o ponto quente era seco. A maior parte da equipa achava pouco provável que Júpiter, no seu todo, tivesse tão pouca água.' },
        { kid: 'Mesmo aqui em baixo a sonda era levada por ventos de cerca de 650 km/h, mais rápidos do que qualquer furacão da Terra. São empurrados pelo calor que vem do fundo de Júpiter.', sci: 'O seguimento Doppler do rádio da sonda: ventos acima de 400 mph (650 km/h) que não enfraqueciam por baixo das nuvens, por isso devem ser movidos pelo calor que escapa do interior, não pela luz do Sol.' },
      ],
      panel: {
        kid: [
          'Estamos a viajar por onde a sonda Galileo foi a 7 de dezembro de 1995: para baixo, através das nuvens de Júpiter, pendurados num paraquedas. Júpiter não tem chão. Quanto mais fundo, mais espesso, mais quente e mais escuro fica o gás.',
          'Toca na alavanca vermelha para descer de uma camada de nuvens para a seguinte, ou desliza a profundidade. Toca nos instrumentos da mesa e na sonda lá fora para descobrir o que a sonda verdadeira encontrou.',
        ],
        sci: [
          'A sonda da Galileo desceu de paraquedas até 22 bar, enviando por rádio 57,6 minutos de dados para o orbitador lá em cima. O quadro segue as temperaturas que mediu: 166 K a 1 bar, 429 K a 22 bar, perto de uma adiabática seca por baixo das nuvens. As profundidades contam a partir de onde a nossa descida começou, cerca de 21 km acima do nível de 1 bar.',
          'As três camadas de nuvens estão onde a química de equilíbrio as põe: gelo de amoníaco perto de 0,7 bar, hidrogenossulfureto de amónio perto de 2 bar, água perto de 5 bar. Abaixo de 22 bar nenhum instrumento esteve: a gôndola continua pela mesma adiabática, um prolongamento imaginado.',
        ],
      },
    },
    squeeze: {
      label: 'Apertar o hidrogénio',
      title: 'Fazer um metal de hidrogénio',
      slider: 'Com que força o canhão aperta',
      format: '{p} milhões de bar',
      hints: { fire: 'Toca no canhão de gás para disparar', load: 'Toca no frasco gelado para carregar uma amostra nova', watch: 'Olha para a lente' },
      buttons: { fire: 'Disparar o canhão', load: 'Carregar uma amostra nova' },
      labels: { gun: 'canhão de gás (modelo)', flask: 'hidrogénio líquido', chart: 'Os teus disparos', x: 'pressão (milhões de bar)', yKid: 'como passa a eletricidade', ySci: 'condutividade (escala log)', metal: 'como um metal', none: 'pouco demais para medir', nellis: 'Livermore, 1996', jupiter: 'como no fundo de Júpiter' },
      says: {
        load: { kid: 'Uma gota nova de hidrogénio líquido, a −253 °C, fechada entre duas janelas de safira.', sci: 'Uma célula nova: uma camada fina de hidrogénio líquido a 20 K entre bigornas de safira, com elétrodos para medir a sua resistência.' },
        loaded: { kid: 'Já há uma amostra nova no canhão. Dispara!', sci: 'Há uma amostra carregada.' },
        noCell: { kid: 'O último disparo desfez a amostra. Toca no frasco gelado para carregar outra.', sci: 'A célula foi destruída pelo último disparo: carrega uma nova.' },
        fire: { kid: 'Bum! Uma placa voa pelo cano a vários quilómetros por segundo e bate na amostra. Na vida real o aperto dura menos de um milionésimo de segundo; aqui está muito mais lento.', sci: 'Projétil lançado: o choque reverbera entre as bigornas e comprime o hidrogénio por degraus (mostrado cerca de um milhão de vezes mais lento).' },
        insulator: { kid: 'Apertado com força, mas a lâmpada continua apagada: as moléculas estão apertadas umas contra as outras, mas cada uma fica com os seus eletrões.', sci: '{p} Mbar: ainda um isolante, resistivo demais para medir.' },
        semi: { kid: 'Um brilho fraquinho! Alguns eletrões começam a saltar entre as moléculas apertadas. Aperta mais!', sci: '{p} Mbar: um fluido semicondutor, a resistividade a cair a pique com a pressão.' },
        metal: { kid: 'A lâmpada acende! A 1,4 milhões de vezes a pressão do ar os eletrões passeiam livremente pelo hidrogénio: tornou-se um metal líquido, como no fundo de Júpiter!', sci: '{p} Mbar, cerca de 3000 K: metálico. A resistividade estabilizou num valor típico de um metal líquido (Weir, Mitchell e Nellis, 1996).' },
      },
      panel: {
        kid: [
          'No fundo de Júpiter o hidrogénio é apertado pelo peso de todo o gás que tem por cima. Ninguém consegue ir lá, por isso em 1996, em Livermore, na Califórnia, uns cientistas apertaram eles próprios o hidrogénio: um canhão de gás disparou uma placa a vários quilómetros por segundo contra uma camada fina de hidrogénio líquido.',
          'Durante menos de um milionésimo de segundo ficou apertado a mais de um milhão de vezes a pressão do ar, e muito quente. A cerca de 1,4 milhões de vezes, o hidrogénio começou a conduzir eletricidade como um metal. É assim que o hidrogénio no fundo de Júpiter pode fazer o seu íman gigante.',
        ],
        sci: [
          'A experiência: um canhão de gás leve de dois estágios no Lawrence Livermore National Laboratory disparou um projétil a vários km/s contra uma célula de hidrogénio líquido (20 K) entre bigornas de safira. O choque a reverberar entre as bigornas comprimiu-o por degraus, o que o manteve muito mais frio (cerca de 3000 K) do que um choque único o deixaria, enquanto elétrodos mediam a sua resistência.',
          'Weir, Mitchell e Nellis (Phys. Rev. Lett. 76, 1860, 1996): de 0,93 a 1,4 Mbar (93 a 140 GPa) a resistividade caiu quase quatro ordens de grandeza, e depois manteve-se num valor típico de um metal líquido até 1,8 Mbar: uma mudança contínua de fluido semicondutor para metálico, ainda sobretudo diatómico, a cerca de nove vezes a densidade do líquido.',
          'Eugene Wigner e Hillard Huntington previram o hidrogénio metálico em 1935, à espera dele a cerca de 0,25 Mbar. O hidrogénio metálico sólido precisa de muito mais, e as afirmações de o ter feito em células de bigornas de diamante (desde 2017) ainda se discutem. Em Júpiter o hidrogénio conduz assim a milhares de quilómetros de profundidade, e mais abaixo.',
        ],
      },
    },
    magnet: {
      label: 'O íman de Júpiter',
      title: 'O maior íman entre os planetas',
      hints: { field: 'Toca em Júpiter para mostrar o seu íman', pole: 'Toca num dos polos de Júpiter', io: 'Toca em Io, a luazinha amarela', earth: 'Toca na pequena Terra', again: 'Toca em Júpiter, num polo, em Io ou na Terra' },
      buttons: { field: 'Íman', aurora: 'Auroras', io: 'Os vulcões de Io', earth: 'A Terra ao lado' },
      labels: { north: 'norte', south: 'sul', io: 'Io', earth: 'Terra', compass: 'bússola' },
      says: {
        fieldOn: { kid: 'O íman de Júpiter! O seu mar de hidrogénio metálico a girar faz o íman mais forte de todos os planetas. Olha para a bússola: a ponta vermelha aponta para o sul de Júpiter. O íman de Júpiter está ao contrário do da Terra!', sci: 'O dipolo: cerca de 20 000 vezes o momento magnético da Terra, inclinado cerca de 10° em relação ao eixo de rotação e oposto ao da Terra, por isso o norte de uma bússola aponta para sul. Alimentam-no correntes no hidrogénio condutor enquanto Júpiter gira, uma vez em 9 h 56 min.' },
        fieldOff: { kid: 'Íman escondido. (O verdadeiro nunca se desliga!)', sci: 'Linhas de campo escondidas.' },
        auroraOn: { kid: 'As auroras brilham em anéis à volta dos dois polos, muito maiores do que as da Terra. Brilham sobretudo em luz ultravioleta do hidrogénio, que os nossos olhos não veem, por isso aqui estão desenhadas a cor-de-rosa, como na imagem.', sci: 'Os ovais aurorais principais: sobretudo emissão ultravioleta de H e H2, e infravermelha de H3+, desenhados no cor-de-rosa da imagem. Ao contrário dos da Terra, são alimentados sobretudo pela rotação de Júpiter e pelo plasma de Io, mais do que pelo vento solar.' },
        auroraOff: { kid: 'Auroras escondidas.', sci: 'Ovais escondidos.' },
        ioOn: { kid: 'Io tem centenas de vulcões. Deitam cerca de uma tonelada de gás por segundo, que se torna um anel de gás carregado à volta de Júpiter. O íman liga Io a Júpiter, e onde essa ligação chega, uma mancha brilhante de aurora segue Io à volta!', sci: 'Os vulcões de Io fornecem cerca de uma tonelada por segundo de enxofre e oxigénio a um toro de plasma ao longo da sua órbita. Io, ao mover-se no campo, gera correntes ao longo das linhas de campo até à alta atmosfera de Júpiter: a pegada de Io, uma mancha auroral que a segue (vista pela primeira vez no infravermelho em 1993). Io orbita na verdade a cerca de 6 raios de Júpiter; aqui está desenhada mais perto.' },
        ioOff: { kid: 'Io descansa.', sci: 'Toro e pegada escondidos.' },
        earthOn: { kid: 'Aquela é a Terra, à escala: Júpiter tem a largura de 11 Terras! E o íman de Júpiter é cerca de 20 000 vezes mais forte do que o da Terra. Na Terra, a bússola aponta para norte.', sci: 'A Terra à escala: o equador de Júpiter mede 11,2 diâmetros terrestres. O momento dipolar da Terra é cerca de 20 000 vezes menor; no topo das nuvens o campo de Júpiter tem cerca de 4 gauss no equador, umas 14 vezes o da Terra à superfície.' },
        earthOff: { kid: 'O íman da Terra está escondido.', sci: 'Campo da Terra escondido.' },
      },
      panel: {
        kid: [
          'No fundo de Júpiter, o hidrogénio metálico líquido conduz eletricidade. Enquanto Júpiter gira, uma vez a cada 10 horas, correntes elétricas rodopiam nele e fazem um íman gigantesco. A sua bolha magnética é tão grande que, se a pudéssemos ver da Terra, pareceria maior do que a Lua cheia, e a sua cauda estende-se até à órbita de Saturno.',
          'Toca no planeta, nos seus polos, em Io e na pequena Terra para veres o que o íman faz.',
        ],
        sci: [
          'Um dínamo: a convecção no hidrogénio condutor, rodada pela rotação rápida de Júpiter (9 h 56 min), mantém o campo. Momento magnético de cerca de 1,5 × 10²⁰ T·m³, cerca de 20 000 vezes o da Terra; o dipolo está inclinado cerca de 10° e aponta ao contrário do atual da Terra.',
          'A Juno, em órbita desde 2016, mapeou o campo de perto: é mais irregular do que se esperava, com uma mancha intensa perto do equador (a "Grande Mancha Azul"), e o núcleo que encontrou é difuso, não uma pequena bola sólida.',
        ],
      },
    },
  },
  pl: {
    title: 'W głąb chmur Jowisza',
    greet: {
      kid: 'Jesteśmy w środku obrazka: wisimy pod olbrzymim spadochronem nad chmurami Jowisza, tam, gdzie w 1995 roku spadła sonda Galileo. Jowisz nie ma gruntu, tylko gaz, coraz gęstszy, gorętszy i ciemniejszy. Historia obrazka jest na sztaludze.',
      sci: 'W środku obrazka: gondola obserwacyjna pod spadochronem, na poziomie 0,4 bara w atmosferze Jowisza, nad miejscem wejścia sondy Galileo (7 grudnia 1995, 6,5° N). Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Jestem wodorem, a Jowisz to głównie ja! Waży tyle co 318 Ziem.',
        'Jowisz kręci się tak szybko, że jego doba trwa niecałe 10 godzin.',
        'W Jowiszu zmieściłoby się ponad 1300 Ziem.',
      ],
      sci: [
        'Jowisz: 318 mas Ziemi. Jego zewnętrzna otoczka to masowo mniej więcej w trzech czwartych wodór i w jednej czwartej hel, jak gaz, z którego narodziło się Słońce.',
        'Sonda znalazła też neon w ilości około jednej dziesiątej tej w Słońcu: może zniosły go w głąb krople helu padające jak deszcz głęboko w środku.',
        'Jowisz wypromieniowuje około 1,7 razy więcej energii, niż dostaje od Słońca: wciąż traci ciepło z czasów swoich narodzin.',
      ],
    },
    descent: {
      label: 'Opadanie',
      title: 'W dół przez chmury',
      slider: 'Jak głęboko',
      hints: {
        sink: 'Stuknij czerwoną dźwignię, żeby opaść',
        helium: 'Stuknij licznik helu',
        lightning: 'Stuknij wykrywacz piorunów',
        probe: 'Stuknij sondę Galileo za burtą',
        deeper: 'Stuknij czerwoną dźwignię, żeby opaść głębiej',
        top: 'Stuknij czerwoną dźwignię, żeby wznieść się z powrotem',
        moving: 'Opadamy, patrz, jak mijają chmury',
      },
      buttons: { sink: 'Opadnij na następny poziom', helium: 'Zmierz hel', lightning: 'Nasłuchuj piorunów', probe: 'Zapytaj sondę' },
      labels: { handle: 'w dół', helium: 'licznik helu', lightning: 'wykrywacz piorunów', measuring: 'pomiar', listening: 'nasłuch', hydrogen: 'wodór', heliumBar: 'hel' },
      board: {
        title: 'Droga Galileo w dół',
        depth: 'głębokość',
        pressure: 'ciśnienie',
        temp: 'temperatura',
        kidP: '{n} × powietrze w domu',
        probe: 'sonda Galileo, 1995',
        lost: 'utrata sygnału',
        imagined: 'wyobrażone',
        clouds: { kid: ['lód amoniakalny', 'brązowe chmury', 'chmury wodne'], sci: ['lód NH₃', 'NH₄SH', 'H₂O'] },
        where: {
          above: 'Nad chmurami',
          ammonia: 'W chmurach z lodu amoniakalnego',
          between: 'Między chmurami',
          nh4sh: 'W brązowych chmurach',
          water: 'W chmurach wodnych',
          below: 'Pod chmurami: gorący, ciemny gaz',
          imagined: 'Wyobrażone: żadna sonda tu nie dotarła',
        },
      },
      stops: [
        { kid: 'Znów na górze, pod naszym spadochronem. Tu jest około −145 °C! Pod nami leżą trzy warstwy chmur i widzimy je przez czystą dziurę.', sci: '0,4 bara, około 128 K (−145 °C), jakieś 21 km nad poziomem 1 bara. Poniżej: oczekiwane warstwy lodu amoniakalnego (0,7 bara), wodorosiarczku amonu (2 bary) i wody (5 barów).' },
        { kid: 'Jesteśmy w górnych chmurach: to malutkie kryształki lodu amoniakalnego, białe jak śnieg. To one tworzą jasne pasy Jowisza. Około −120 °C!', sci: '0,7 bara, około −120 °C: warstwa lodu amoniakalnego (NH3), białe szczyty jasnych stref Jowisza.' },
        { kid: 'Teraz brązowe chmury, z amoniaku i siarkowodoru. Pachniałyby zgniłymi jajami! −70 °C, a gaz naciska dwa razy mocniej niż powietrze w domu.', sci: '2 bary, około −70 °C: warstwa wodorosiarczku amonu (NH4SH), z NH3 i H2S. Co barwi pasy na brązowo, wciąż jest przedmiotem sporu: śladowe ilości innych związków.' },
        { kid: 'Chmury wodne, jak na Ziemi! Jest około 0 °C, a gaz naciska pięć razy mocniej niż powietrze w domu. Patrz: w środku błyskają pioruny.', sci: '5 barów, około 0 °C: warstwa chmur wodnych, gdzie temperatura przekracza 273 K i woda się skrapla. Tu powstają pioruny Jowisza (Voyager 1 zobaczył ich błyski w 1979 roku).' },
        { kid: 'Pod nami nie ma już chmur, tylko gęsty, gorący gaz, coraz ciemniejszy. Jest 65 °C, goręcej niż w najgorętszy letni dzień, a ciśnienie jest dziesięć razy większe niż powietrza.', sci: '10 barów, około 335 K (65 °C): pod chmurami gaz równo ogrzewa się z głębokością, blisko adiabaty suchej, jak zmierzyła go sonda między 6 a 16 barami.' },
        { kid: 'Tu sonda Galileo umilkła, po mniej więcej 58 minutach spadania: 155 °C i ciśnienie 22 razy większe niż powietrza w domu. Żar i ściskanie były dla niej za mocne.', sci: '22 bary, 429 K (156 °C), 133 km pod poziomem 1 bara: ostatnie dane sondy. Głębiej nie dotarł nigdy żaden przyrząd.' },
        { kid: 'Żadna sonda nie dotarła tak głęboko, więc dalej tylko sobie wyobrażamy: ciśnienie 100 razy większe niż powietrza, około 410 °C, goręcej niż w każdym piekarniku, i ciemno choć oko wykol. A gaz gęstnieje dalej przez tysiące kilometrów.', sci: '100 barów, około 680 K (410 °C), jeśli adiabata sucha się utrzymuje: poniżej 22 barów te liczby pochodzą z tego modelu, nie z pomiaru. Wodór gęstnieje i rozgrzewa się przez dziesiątki tysięcy kilometrów; powierzchni nie ma.' },
      ],
      says: {
        up: { kid: 'W górę, z powrotem na szczyt chmur!', sci: 'Wznosimy się do 0,4 bara.' },
        lost: { kid: 'Pip... cisza. Sonda Galileo przestała mówić. Spadała dalej w żar, który ją zniszczył.', sci: 'Utrata sygnału przy około 22 barach, 57,6 minuty po rozpoczęciu opadania. Sonda spadała dalej; zniszczył ją żar głębiej.' },
        helium: { kid: 'Licznik helu mówi: mniej więcej trzy czwarte wagi gazu to wodór, a jedna czwarta to hel. Prawie taka sama mieszanka jak w Słońcu!', sci: 'Detektor zawartości helu na Galileo: He/H2 = 0,157 liczbowo, masowy udział helu około 0,24, blisko słonecznego 0,25.' },
        lightning: { kid: 'Trzask, trzask! Wykrywacz słyszy pioruny po ich szumie radiowym, z dalekich burz. Na Jowiszu piorunów jest mniej niż na Ziemi, ale każdy jest mniej więcej dziesięć razy silniejszy.', sci: 'Detektor piorunów i emisji radiowych usłyszał odległe wyładowania: na jednostkę powierzchni około jednej dziesiątej częstości ziemskiej, każde około dziesięć razy bardziej energetyczne.' },
        probeGone: { kid: 'Sondy już nie ma: jej radio umilkło przy 22 barach, a żar ją zniszczył.', sci: 'Sonda została utracona przy 22 barach.' },
      },
      probe: [
        { kid: 'To sonda Galileo, spada obok nas! Wpadła w powietrze Jowisza z prędkością około 170 000 km/h; hamowała ją osłona termiczna, ściskana 228 razy mocniej niż ziemska grawitacja. Potem otworzył się spadochron.', sci: 'Sonda Galileo: wejście 7 grudnia 1995 z prędkością około 47 km/s (170 000 km/h), do 228 g za osłoną termiczną; potem spadochron i dane wysyłane radiem do orbitera Galileo nad nią.' },
        { kid: 'Sonda wpadła w czyste, suche miejsce między chmurami, „gorącą plamę”, taką jak dziura, przez którą opadamy.', sci: 'Weszła blisko skraju gorącej plamy widocznej w 5 mikronach: czystego, suchego obszaru, przez który świeci ciepło z dołu, więc spotkała dużo mniej chmur, niż oczekiwano.' },
        { kid: 'Sonda znalazła tylko cienkie chmury: jedną warstwę, a nie trzy grube, których się spodziewano.', sci: 'Zamiast trzech grubych warstw przyrządy sondy znalazły cienkie chmury z jedną wyraźną warstwą: tego można się spodziewać w gorącej plamie.' },
        { kid: 'Tu sonda oczekiwała grubych chmur wodnych, ale gaz był zaskakująco suchy.', sci: 'Mało pary wodnej i żadnej grubej chmury wodnej: gorąca plama była sucha. Większość zespołu uważała za mało prawdopodobne, by cały Jowisz miał tak mało wody.' },
        { kid: 'Nawet tu na dole sondę niosły wiatry o prędkości około 650 km/h, szybsze niż każdy huragan na Ziemi. Pcha je ciepło z głębi Jowisza.', sci: 'Śledzenie dopplerowskie radia sondy: wiatry ponad 400 mph (650 km/h), które nie słabły pod chmurami, więc napędza je raczej ciepło uchodzące z wnętrza, a nie światło słoneczne.' },
      ],
      panel: {
        kid: [
          'Jedziemy tam, gdzie 7 grudnia 1995 roku leciała sonda Galileo: w dół przez chmury Jowisza, na spadochronie. Jowisz nie ma gruntu. Im głębiej, tym gaz jest gęstszy, gorętszy i ciemniejszy.',
          'Stuknij czerwoną dźwignię, żeby opaść z jednej warstwy chmur do następnej, albo przesuń głębokość. Stuknij przyrządy na biurku i sondę za burtą, żeby dowiedzieć się, co znalazła prawdziwa sonda.',
        ],
        sci: [
          'Sonda Galileo opadła na spadochronie do 22 barów i przesłała radiem 57,6 minuty danych do orbitera nad nią. Tablica pokazuje zmierzone przez nią temperatury: 166 K przy 1 barze, 429 K przy 22 barach, blisko adiabaty suchej pod chmurami. Głębokość liczymy od miejsca, gdzie zaczęło się nasze opadanie, około 21 km nad poziomem 1 bara.',
          'Trzy warstwy chmur leżą tam, gdzie umieszcza je chemia równowagowa: lód amoniakalny przy około 0,7 bara, wodorosiarczek amonu przy około 2 barach, woda przy około 5 barach. Poniżej 22 barów nie był żaden przyrząd: gondola jedzie dalej po tej samej adiabacie, w wyobrażonym ciągu dalszym.',
        ],
      },
    },
    squeeze: {
      label: 'Ściskanie wodoru',
      title: 'Metal z wodoru',
      slider: 'Jak mocno ściska działo',
      format: '{p} mln barów',
      hints: { fire: 'Stuknij działo gazowe, żeby strzelić', load: 'Stuknij oszronioną kolbę, żeby załadować świeżą próbkę', watch: 'Patrz w soczewkę' },
      buttons: { fire: 'Strzel z działa', load: 'Załaduj świeżą próbkę' },
      labels: { gun: 'działo gazowe (model)', flask: 'ciekły wodór', chart: 'Twoje strzały', x: 'ciśnienie (mln barów)', yKid: 'jak płynie prąd', ySci: 'przewodnictwo (skala log)', metal: 'jak metal', none: 'za mało, by zmierzyć', nellis: 'Livermore, 1996', jupiter: 'jak głęboko w Jowiszu' },
      says: {
        load: { kid: 'Świeża kropla ciekłego wodoru, w temperaturze −253 °C, zamknięta między dwoma okienkami z szafiru.', sci: 'Świeża komórka: cienka warstwa ciekłego wodoru w 20 K między kowadłami z szafiru, z elektrodami do pomiaru oporu.' },
        loaded: { kid: 'W dziale jest już świeża próbka. Strzelaj!', sci: 'Próbka załadowana.' },
        noCell: { kid: 'Ostatni strzał rozbił próbkę. Stuknij oszronioną kolbę, żeby załadować nową.', sci: 'Ostatni strzał zniszczył komórkę: załaduj nową.' },
        fire: { kid: 'Bum! Płytka leci lufą z prędkością kilku kilometrów na sekundę i uderza w próbkę. Naprawdę ściskanie trwa krócej niż milionową część sekundy; tu jest bardzo zwolnione.', sci: 'Pocisk wystrzelony: fala uderzeniowa odbija się między kowadłami i ściska wodór stopniowo (pokazane mniej więcej milion razy wolniej).' },
        insulator: { kid: 'Mocno ściśnięty, ale żarówka nie świeci: cząsteczki są stłoczone, ale każda trzyma swoje elektrony.', sci: '{p} Mbar: wciąż izolator, za duży opór, by go zmierzyć.' },
        semi: { kid: 'Słaby blask! Kilka elektronów zaczyna przeskakiwać między ściśniętymi cząsteczkami. Ściśnij mocniej!', sci: '{p} Mbar: płyn półprzewodzący, jego opór właściwy szybko spada z ciśnieniem.' },
        metal: { kid: 'Żarówka świeci! Przy ciśnieniu 1,4 miliona razy większym niż powietrza elektrony swobodnie wędrują po wodorze: stał się ciekłym metalem, jak głęboko w Jowiszu!', sci: '{p} Mbar, około 3000 K: stan metaliczny. Opór właściwy ustalił się na wartości typowej dla ciekłego metalu (Weir, Mitchell i Nellis, 1996).' },
      },
      panel: {
        kid: [
          'Głęboko w Jowiszu wodór ściska ciężar całego gazu nad nim. Nikt nie może się tam dostać, więc w 1996 roku w Livermore w Kalifornii naukowcy sami ścisnęli wodór: działo gazowe wystrzeliło płytkę z prędkością kilku kilometrów na sekundę w cienką warstwę ciekłego wodoru.',
          'Przez mniej niż milionową część sekundy był ściśnięty ponad milion razy mocniej niż powietrze i bardzo gorący. Przy mniej więcej 1,4 miliona razy wodór zaczął przewodzić prąd jak metal. Dzięki temu wodór w głębi Jowisza może wytwarzać jego olbrzymi magnes.',
        ],
        sci: [
          'Doświadczenie: dwustopniowe działo na lekki gaz w Lawrence Livermore National Laboratory wystrzeliło pocisk z prędkością kilku km/s w komórkę z ciekłym wodorem (20 K) między kowadłami z szafiru. Fala uderzeniowa odbijająca się między kowadłami ściskała go stopniowo, co utrzymało go dużo chłodniejszym (około 3000 K) niż przy pojedynczym uderzeniu, a elektrody mierzyły jego opór.',
          'Weir, Mitchell i Nellis (Phys. Rev. Lett. 76, 1860, 1996): od 0,93 do 1,4 Mbar (93 do 140 GPa) opór właściwy spadł prawie o cztery rzędy wielkości, a potem utrzymywał się na wartości typowej dla ciekłego metalu aż do 1,8 Mbar: ciągła przemiana z płynu półprzewodzącego w metaliczny, wciąż głównie dwuatomowy, przy gęstości około dziewięć razy większej niż cieczy.',
          'Eugene Wigner i Hillard Huntington przewidzieli metaliczny wodór w 1935 roku, spodziewając się go przy około 0,25 Mbar. Stały metaliczny wodór wymaga dużo więcej, a doniesienia o jego wytworzeniu w komórkach z kowadłami diamentowymi (od 2017 roku) wciąż są przedmiotem sporu. W Jowiszu wodór przewodzi tak tysiące kilometrów pod chmurami i głębiej.',
        ],
      },
    },
    magnet: {
      label: 'Magnes Jowisza',
      title: 'Największy magnes wśród planet',
      hints: { field: 'Stuknij Jowisza, żeby pokazać jego magnes', pole: 'Stuknij jeden z biegunów Jowisza', io: 'Stuknij Io, mały żółty księżyc', earth: 'Stuknij małą Ziemię', again: 'Stuknij Jowisza, biegun, Io albo Ziemię' },
      buttons: { field: 'Magnes', aurora: 'Zorze', io: 'Wulkany Io', earth: 'Ziemia obok' },
      labels: { north: 'północ', south: 'południe', io: 'Io', earth: 'Ziemia', compass: 'kompas' },
      says: {
        fieldOn: { kid: 'Magnes Jowisza! Jego wirujące morze metalicznego wodoru tworzy najsilniejszy magnes ze wszystkich planet. Spójrz na kompas: jego czerwony koniec wskazuje południe Jowisza. Magnes Jowisza jest odwrócony w porównaniu z ziemskim!', sci: 'Dipol: moment magnetyczny około 20 000 razy większy niż Ziemi, nachylony o około 10° do osi obrotu i skierowany przeciwnie niż ziemski, więc północny koniec igły kompasu wskazuje południe. Napędzają go prądy w przewodzącym wodorze, gdy Jowisz obraca się raz na 9 h 56 min.' },
        fieldOff: { kid: 'Magnes ukryty. (Prawdziwy nigdy się nie wyłącza!)', sci: 'Linie pola ukryte.' },
        auroraOn: { kid: 'Zorze świecą w pierścieniach wokół obu biegunów, dużo większych niż na Ziemi. Świecą głównie w ultrafiolecie wodoru, którego nasze oczy nie widzą, więc tu są narysowane na różowo, jak na obrazku.', sci: 'Główne owale zorzowe: głównie emisja ultrafioletowa H i H2 oraz podczerwona H3+, narysowane różem z obrazka. W odróżnieniu od ziemskich zasila je głównie własny obrót Jowisza i plazma z Io, bardziej niż wiatr słoneczny.' },
        auroraOff: { kid: 'Zorze ukryte.', sci: 'Owale ukryte.' },
        ioOn: { kid: 'Io ma setki wulkanów. Wyrzucają około tony gazu na sekundę, który tworzy pierścień naładowanego gazu wokół Jowisza. Magnes łączy Io z Jowiszem, a tam, gdzie to połączenie dociera, jasna plamka zorzy biegnie za Io dookoła!', sci: 'Wulkany Io dostarczają około tony siarki i tlenu na sekundę do torusa plazmy wzdłuż jego orbity. Io, poruszając się w polu, wymusza prądy wzdłuż linii pola do górnej atmosfery Jowisza: ślad Io, plamkę zorzy, która za nim podąża (po raz pierwszy zobaczoną w podczerwieni w 1993 roku). Naprawdę Io krąży około 6 promieni Jowisza od niego; tu jest narysowany bliżej.' },
        ioOff: { kid: 'Io odpoczywa.', sci: 'Torus i ślad ukryte.' },
        earthOn: { kid: 'To Ziemia, w skali: Jowisz jest szeroki na 11 Ziem! A magnes Jowisza jest około 20 000 razy silniejszy niż ziemski. Na Ziemi kompas wskazuje północ.', sci: 'Ziemia w skali: równik Jowisza to 11,2 średnicy Ziemi. Ziemski moment dipolowy jest około 20 000 razy mniejszy; na szczytach chmur pole Jowisza ma na równiku około 4 gausów, mniej więcej 14 razy więcej niż ziemskie przy powierzchni.' },
        earthOff: { kid: 'Magnes Ziemi ukryty.', sci: 'Pole Ziemi ukryte.' },
      },
      panel: {
        kid: [
          'Głęboko w Jowiszu ciekły metaliczny wodór przewodzi prąd. Gdy Jowisz się obraca, raz na 10 godzin, wirują w nim prądy elektryczne i tworzą gigantyczny magnes. Jego magnetyczna bańka jest tak wielka, że gdybyśmy mogli ją zobaczyć z Ziemi, wyglądałaby na większą niż Księżyc w pełni, a jej ogon sięga aż do orbity Saturna.',
          'Stuknij planetę, jej bieguny, Io i małą Ziemię, żeby zobaczyć, co robi magnes.',
        ],
        sci: [
          'Dynamo: konwekcja w przewodzącym wodorze, obracana szybką rotacją Jowisza (9 h 56 min), podtrzymuje pole. Moment magnetyczny około 1,5 × 10²⁰ T·m³, około 20 000 razy większy niż Ziemi; dipol jest nachylony o około 10° i skierowany przeciwnie niż obecny ziemski.',
          'Juno, na orbicie od 2016 roku, zmapowała pole z bliska: jest bardziej nieregularne, niż oczekiwano, z silną plamą blisko równika („Wielka Niebieska Plama”), a jądro, które znalazła, jest rozmyte, a nie jest małą twardą kulą.',
        ],
      },
    },
  },
  de: {
    title: 'Hinab in Jupiters Wolken',
    greet: {
      kid: 'Wir sind im Bild: Wir hängen an einem riesigen Fallschirm über Jupiters Wolken, wo 1995 die Galileo-Sonde hinabfiel. Jupiter hat keinen Boden, nur Gas, das immer dichter, heißer und dunkler wird. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Im Bild: eine Beobachtungsgondel an einem Fallschirm, bei 0,4 bar in Jupiters Atmosphäre, über der Eintrittsstelle der Galileo-Sonde (7. Dezember 1995, 6,5° N). Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Ich bin der Wasserstoff, und Jupiter besteht hauptsächlich aus mir! Er wiegt so viel wie 318 Erden.',
        'Jupiter dreht sich so schnell, dass sein Tag keine 10 Stunden dauert.',
        'Mehr als 1300 Erden würden in Jupiter hineinpassen.',
      ],
      sci: [
        'Jupiter: 318 Erdmassen. Seine äußere Hülle besteht nach Masse etwa zu drei Vierteln aus Wasserstoff und zu einem Viertel aus Helium, wie das Gas, aus dem die Sonne entstand.',
        'Die Sonde fand auch Neon, nur etwa ein Zehntel des Sonnenanteils: vielleicht von Heliumtröpfchen mitgenommen, die tief im Inneren herabregnen.',
        'Jupiter strahlt etwa 1,7-mal so viel Energie ab, wie er von der Sonne bekommt: Er verliert immer noch die Wärme seiner Entstehung.',
      ],
    },
    descent: {
      label: 'Der Abstieg',
      title: 'Hinunter durch die Wolken',
      slider: 'Wie tief',
      hints: {
        sink: 'Tippe auf den roten Hebel, um zu sinken',
        helium: 'Tippe auf den Heliumzähler',
        lightning: 'Tippe auf den Blitzdetektor',
        probe: 'Tippe auf die Galileo-Sonde draußen',
        deeper: 'Tippe auf den roten Hebel, um tiefer zu sinken',
        top: 'Tippe auf den roten Hebel, um wieder aufzusteigen',
        moving: 'Wir sinken, schau, wie die Wolken vorbeiziehen',
      },
      buttons: { sink: 'Zur nächsten Stufe sinken', helium: 'Helium messen', lightning: 'Nach Blitzen lauschen', probe: 'Die Sonde fragen' },
      labels: { handle: 'sinken', helium: 'Heliumzähler', lightning: 'Blitzdetektor', measuring: 'misst', listening: 'lauscht', hydrogen: 'Wasserstoff', heliumBar: 'Helium' },
      board: {
        title: 'Galileos Weg nach unten',
        depth: 'Tiefe',
        pressure: 'Druck',
        temp: 'Temperatur',
        kidP: '{n} × die Luft zu Hause',
        probe: 'Galileo-Sonde, 1995',
        lost: 'Signal weg',
        imagined: 'vorgestellt',
        clouds: { kid: ['Ammoniakeis', 'braune Wolken', 'Wasserwolken'], sci: ['NH₃-Eis', 'NH₄SH', 'H₂O'] },
        where: {
          above: 'Über den Wolken',
          ammonia: 'In den Wolken aus Ammoniakeis',
          between: 'Zwischen den Wolken',
          nh4sh: 'In den braunen Wolken',
          water: 'In den Wasserwolken',
          below: 'Unter den Wolken: heißes, dunkles Gas',
          imagined: 'Vorgestellt: hier war noch keine Sonde',
        },
      },
      stops: [
        { kid: 'Wieder oben, an unserem Fallschirm. Hier oben sind es etwa −145 °C! Unter uns liegen drei Wolkenschichten, und wir sehen sie durch ein klares Loch.', sci: '0,4 bar, etwa 128 K (−145 °C), rund 21 km über dem 1-bar-Niveau. Darunter: die erwarteten Schichten aus Ammoniakeis (0,7 bar), Ammoniumhydrogensulfid (2 bar) und Wasser (5 bar).' },
        { kid: 'Wir sind in den obersten Wolken: winzige Kristalle aus Ammoniakeis, weiß wie Schnee. Sie machen Jupiters helle Streifen. Etwa −120 °C!', sci: '0,7 bar, etwa −120 °C: die Schicht aus Ammoniakeis (NH3), die weißen Wolkendecken von Jupiters hellen Zonen.' },
        { kid: 'Jetzt braune Wolken, aus Ammoniak und Schwefelwasserstoff. Sie würden nach faulen Eiern riechen! −70 °C, und das Gas drückt doppelt so stark wie die Luft zu Hause.', sci: '2 bar, etwa −70 °C: die Schicht aus Ammoniumhydrogensulfid (NH4SH), aus NH3 und H2S. Was die Bänder braun färbt, ist noch umstritten: Spuren anderer Verbindungen.' },
        { kid: 'Wasserwolken, wie auf der Erde! Es sind etwa 0 °C, und das Gas drückt fünfmal so stark wie die Luft zu Hause. Schau: Darin zucken Blitze.', sci: '5 bar, etwa 0 °C: die Wasserwolkenschicht, wo die Temperatur 273 K überschreitet und Wasser kondensiert. Hier entstehen Jupiters Blitze (Voyager 1 sah ihre Blitze 1979).' },
        { kid: 'Unter uns sind keine Wolken mehr, nur dichtes, heißes Gas, das immer dunkler wird. Es sind 65 °C, heißer als an jedem Sommertag, und der zehnfache Luftdruck.', sci: '10 bar, etwa 335 K (65 °C): Unter den Wolken wird das Gas mit der Tiefe stetig wärmer, nahe an einer trockenen Adiabate, wie die Sonde es zwischen 6 und 16 bar gemessen hat.' },
        { kid: 'Hier verstummte die Galileo-Sonde, nach etwa 58 Minuten Fall: 155 °C und der 22-fache Druck der Luft zu Hause. Die Hitze und das Zusammenpressen waren zu viel für sie.', sci: '22 bar, 429 K (156 °C), 133 km unter dem 1-bar-Niveau: die letzten Daten der Sonde. Tiefer ist nie ein Messgerät gekommen.' },
        { kid: 'Keine Sonde ist je so tief gekommen, also stellen wir es uns ab hier nur vor: der 100-fache Luftdruck, etwa 410 °C, heißer als jeder Backofen, und stockdunkel. Und es wird noch Tausende Kilometer lang immer dichter.', sci: '100 bar, etwa 680 K (410 °C), wenn die trockene Adiabate weiter gilt: Unter 22 bar stammen diese Zahlen aus diesem Modell, nicht aus einer Messung. Der Wasserstoff wird über Zehntausende Kilometer dichter und heißer; eine Oberfläche gibt es nicht.' },
      ],
      says: {
        up: { kid: 'Hinauf geht es, zurück zu den Wolkengipfeln!', sci: 'Aufstieg auf 0,4 bar.' },
        lost: { kid: 'Piep... Stille. Die Galileo-Sonde spricht nicht mehr. Sie fiel weiter in die Hitze, die sie zerstört hat.', sci: 'Signalverlust bei etwa 22 bar, 57,6 Minuten nach Beginn des Abstiegs. Die Sonde fiel weiter; die Hitze weiter unten zerstörte sie.' },
        helium: { kid: 'Der Heliumzähler sagt: Etwa drei Viertel vom Gewicht des Gases sind Wasserstoff und ein Viertel ist Helium. Fast dieselbe Mischung wie in der Sonne!', sci: 'Galileos Helium-Detektor: He/H2 = 0,157 nach Teilchenzahl, ein Helium-Massenanteil von etwa 0,24, nahe am Wert der Sonne, 0,25.' },
        lightning: { kid: 'Knister, knister! Der Detektor hört Blitze an ihrem Funkrauschen, aus weit entfernten Gewittern. Auf Jupiter gibt es seltener Blitze als auf der Erde, aber jeder ist etwa zehnmal stärker.', sci: 'Der Blitz- und Funkdetektor hörte entfernte Entladungen: pro Fläche etwa ein Zehntel der irdischen Blitzrate, jedes Ereignis etwa zehnmal so energiereich.' },
        probeGone: { kid: 'Die Sonde ist fort: Ihr Funk verstummte bei 22 bar, und die Hitze hat sie zerstört.', sci: 'Die Sonde ging bei 22 bar verloren.' },
      },
      probe: [
        { kid: 'Das ist die Galileo-Sonde, sie fällt neben uns! Sie traf mit etwa 170.000 km/h auf Jupiters Luft; ihr Hitzeschild bremste sie, mit dem 228-Fachen der Erdschwerkraft. Dann öffnete sich ihr Fallschirm.', sci: 'Die Galileo-Sonde: Eintritt am 7. Dezember 1995 mit etwa 47 km/s (170.000 km/h), bis zu 228 g hinter ihrem Hitzeschild; dann der Fallschirm, die Daten per Funk zum Galileo-Orbiter über ihr.' },
        { kid: 'Die Sonde fiel in eine klare, trockene Stelle zwischen den Wolken, einen „heißen Fleck“, wie das Loch, durch das wir sinken.', sci: 'Sie trat nahe am Rand eines 5-Mikrometer-Hot-Spots ein: einer klaren, trockenen Gegend, durch die Wärme von unten nach außen scheint, deshalb traf sie auf viel weniger Wolken als erwartet.' },
        { kid: 'Die Sonde fand nur dünne Wolken: eine Schicht, nicht die drei dicken, die man erwartet hatte.', sci: 'Statt drei dicker Schichten fanden die Instrumente der Sonde dünne Wolken mit einer deutlichen Schicht: das, was ein Hot Spot erwarten lässt.' },
        { kid: 'Hier erwartete die Sonde dicke Wasserwolken, aber das Gas war überraschend trocken.', sci: 'Wenig Wasserdampf und keine dicke Wasserwolke: Der Hot Spot war trocken. Die meisten im Team hielten es für unwahrscheinlich, dass ganz Jupiter so wenig Wasser hat.' },
        { kid: 'Sogar hier unten wurde die Sonde von Winden mit etwa 650 km/h getragen, schneller als jeder Hurrikan auf der Erde. Sie werden von der Wärme tief aus Jupiter angetrieben.', sci: 'Doppler-Verfolgung des Sondenfunks: Winde über 400 mph (650 km/h), die unter den Wolken nicht nachließen, also wohl von Wärme aus dem Inneren angetrieben, nicht vom Sonnenlicht.' },
      ],
      panel: {
        kid: [
          'Wir fahren dort, wo die Galileo-Sonde am 7. Dezember 1995 entlangkam: hinunter durch Jupiters Wolken, an einem Fallschirm. Jupiter hat keinen Boden. Je tiefer man kommt, desto dichter, heißer und dunkler wird das Gas.',
          'Tippe auf den roten Hebel, um von einer Wolkenschicht zur nächsten zu sinken, oder schiebe die Tiefe. Tippe auf die Geräte auf dem Pult und auf die Sonde draußen, um herauszufinden, was die echte Sonde gefunden hat.',
        ],
        sci: [
          'Galileos Sonde sank am Fallschirm bis 22 bar und funkte 57,6 Minuten lang Daten zum Orbiter über ihr. Die Tafel folgt ihren gemessenen Temperaturen: 166 K bei 1 bar, 429 K bei 22 bar, nahe an einer trockenen Adiabate unter den Wolken. Die Tiefe zählt ab dem Beginn unseres Abstiegs, etwa 21 km über dem 1-bar-Niveau.',
          'Die drei Wolkenschichten liegen dort, wo die Gleichgewichtschemie sie hinlegt: Ammoniakeis bei etwa 0,7 bar, Ammoniumhydrogensulfid bei etwa 2 bar, Wasser bei etwa 5 bar. Unter 22 bar war noch kein Instrument: Die Gondel fährt auf derselben Adiabate weiter, eine vorgestellte Fortsetzung.',
        ],
      },
    },
    squeeze: {
      label: 'Wasserstoff pressen',
      title: 'Metall aus Wasserstoff',
      slider: 'Wie fest die Kanone presst',
      format: '{p} Millionen bar',
      hints: { fire: 'Tippe auf die Gaskanone, um zu feuern', load: 'Tippe auf die bereifte Flasche, um eine frische Probe zu laden', watch: 'Schau in die Lupe' },
      buttons: { fire: 'Kanone abfeuern', load: 'Frische Probe laden' },
      labels: { gun: 'Gaskanone (Modell)', flask: 'flüssiger Wasserstoff', chart: 'Deine Schüsse', x: 'Druck (Millionen bar)', yKid: 'wie gut Strom fließt', ySci: 'Leitfähigkeit (log. Skala)', metal: 'wie ein Metall', none: 'zu wenig zum Messen', nellis: 'Livermore, 1996', jupiter: 'wie tief im Jupiter' },
      says: {
        load: { kid: 'Ein frischer Tropfen flüssiger Wasserstoff, bei −253 °C, eingeschlossen zwischen zwei Fenstern aus Saphir.', sci: 'Eine frische Zelle: eine dünne Schicht flüssiger Wasserstoff bei 20 K zwischen Saphir-Ambossen, mit Elektroden, die seinen Widerstand messen.' },
        loaded: { kid: 'In der Kanone steckt schon eine frische Probe. Feuer!', sci: 'Eine Probe ist geladen.' },
        noCell: { kid: 'Der letzte Schuss hat die Probe zertrümmert. Tippe auf die bereifte Flasche, um eine neue zu laden.', sci: 'Der letzte Schuss hat die Zelle zerstört: Lade eine neue.' },
        fire: { kid: 'Peng! Eine Platte fliegt mit mehreren Kilometern pro Sekunde durch den Lauf und knallt auf die Probe. In Wirklichkeit dauert das Pressen weniger als eine millionstel Sekunde; hier ist es stark verlangsamt.', sci: 'Projektil abgefeuert: Der Stoß läuft zwischen den Ambossen hin und her und presst den Wasserstoff in Stufen (etwa millionenfach verlangsamt gezeigt).' },
        insulator: { kid: 'Fest gepresst, aber die Lampe bleibt dunkel: Die Moleküle sind dicht gedrängt, aber jedes behält seine Elektronen.', sci: '{p} Mbar: noch ein Isolator, zu hochohmig zum Messen.' },
        semi: { kid: 'Ein schwaches Glimmen! Ein paar Elektronen beginnen, zwischen den gepressten Molekülen zu hüpfen. Press fester!', sci: '{p} Mbar: ein halbleitendes Fluid, sein spezifischer Widerstand fällt steil mit dem Druck.' },
        metal: { kid: 'Die Lampe leuchtet! Beim 1,4-Millionenfachen des Luftdrucks wandern die Elektronen frei durch den Wasserstoff: Er ist ein flüssiges Metall geworden, wie tief im Jupiter!', sci: '{p} Mbar, etwa 3000 K: metallisch. Der spezifische Widerstand hat sich bei einem für flüssige Metalle typischen Wert eingependelt (Weir, Mitchell und Nellis, 1996).' },
      },
      panel: {
        kid: [
          'Tief im Jupiter wird der Wasserstoff vom Gewicht des ganzen Gases darüber zusammengepresst. Niemand kann dorthin, also haben Forscher 1996 in Livermore in Kalifornien Wasserstoff selbst gepresst: Eine Gaskanone schoss eine Platte mit mehreren Kilometern pro Sekunde in eine dünne Schicht flüssigen Wasserstoffs.',
          'Weniger als eine millionstel Sekunde lang wurde er auf mehr als das Millionenfache des Luftdrucks gepresst und dabei sehr heiß. Beim etwa 1,4-Millionenfachen begann der Wasserstoff, Strom zu leiten wie ein Metall. So kann der Wasserstoff tief im Jupiter seinen riesigen Magneten machen.',
        ],
        sci: [
          'Das Experiment: Eine zweistufige Leichtgaskanone am Lawrence Livermore National Laboratory schoss ein Projektil mit mehreren km/s auf eine Zelle mit flüssigem Wasserstoff (20 K) zwischen Saphir-Ambossen. Der zwischen den Ambossen hin- und herlaufende Stoß presste ihn in Stufen, was ihn viel kühler hielt (etwa 3000 K) als ein einzelner Stoß, während Elektroden seinen Widerstand maßen.',
          'Weir, Mitchell und Nellis (Phys. Rev. Lett. 76, 1860, 1996): Von 0,93 bis 1,4 Mbar (93 bis 140 GPa) fiel der spezifische Widerstand um fast vier Größenordnungen und blieb dann bis 1,8 Mbar bei einem für flüssige Metalle typischen Wert: ein stetiger Übergang von einem halbleitenden zu einem metallischen, noch überwiegend zweiatomigen Fluid, bei etwa der neunfachen Dichte der Flüssigkeit.',
          'Eugene Wigner und Hillard Huntington sagten metallischen Wasserstoff 1935 voraus und erwarteten ihn bei etwa 0,25 Mbar. Fester metallischer Wasserstoff braucht viel mehr, und Berichte, ihn in Diamantstempelzellen hergestellt zu haben (seit 2017), sind noch umstritten. Im Jupiter leitet der Wasserstoff so Tausende Kilometer tief und tiefer.',
        ],
      },
    },
    magnet: {
      label: 'Jupiters Magnet',
      title: 'Der größte Magnet unter den Planeten',
      hints: { field: 'Tippe auf Jupiter, um seinen Magneten zu zeigen', pole: 'Tippe auf einen von Jupiters Polen', io: 'Tippe auf Io, den kleinen gelben Mond', earth: 'Tippe auf die kleine Erde', again: 'Tippe auf Jupiter, einen Pol, Io oder die Erde' },
      buttons: { field: 'Magnet', aurora: 'Polarlichter', io: 'Ios Vulkane', earth: 'Die Erde daneben' },
      labels: { north: 'Norden', south: 'Süden', io: 'Io', earth: 'Erde', compass: 'Kompass' },
      says: {
        fieldOn: { kid: 'Jupiters Magnet! Sein kreisendes Meer aus metallischem Wasserstoff macht den stärksten Magneten aller Planeten. Schau auf den Kompass: Sein rotes Ende zeigt zu Jupiters Süden. Jupiters Magnet ist andersherum als der der Erde!', sci: 'Der Dipol: etwa das 20.000-Fache des magnetischen Moments der Erde, etwa 10° gegen die Drehachse geneigt und dem der Erde entgegengesetzt, also zeigt das Nordende einer Kompassnadel nach Süden. Ströme im leitenden Wasserstoff treiben ihn an, während Jupiter sich in 9 h 56 min einmal dreht.' },
        fieldOff: { kid: 'Magnet versteckt. (Der echte schaltet sich nie ab!)', sci: 'Feldlinien ausgeblendet.' },
        auroraOn: { kid: 'Polarlichter leuchten in Ringen um beide Pole, viel größer als auf der Erde. Sie leuchten vor allem in ultraviolettem Licht von Wasserstoff, das unsere Augen nicht sehen, deshalb sind sie hier rosa gemalt, wie im Bild.', sci: 'Die Hauptovale der Polarlichter: vor allem ultraviolette Strahlung von H und H2 und infrarote von H3+, im Rosa des Bildes gemalt. Anders als die der Erde werden sie hauptsächlich von Jupiters eigener Drehung und dem Plasma von Io gespeist, mehr als vom Sonnenwind.' },
        auroraOff: { kid: 'Polarlichter versteckt.', sci: 'Ovale ausgeblendet.' },
        ioOn: { kid: 'Io hat Hunderte Vulkane. Sie stoßen etwa eine Tonne Gas pro Sekunde aus, das zu einem Ring aus geladenem Gas um Jupiter wird. Der Magnet verbindet Io mit Jupiter, und wo diese Verbindung ankommt, folgt ein heller Polarlichtfleck Io rundherum!', sci: 'Ios Vulkane liefern etwa eine Tonne Schwefel und Sauerstoff pro Sekunde an einen Plasmatorus entlang seiner Bahn. Io treibt bei seiner Bewegung durch das Feld Ströme entlang der Feldlinien in Jupiters obere Atmosphäre: Ios Fußpunkt, ein Polarlichtfleck, der ihm folgt (1993 zuerst im Infraroten gesehen). In Wirklichkeit kreist Io etwa 6 Jupiterradien entfernt; hier ist er näher gezeichnet.' },
        ioOff: { kid: 'Io ruht.', sci: 'Torus und Fußpunkt ausgeblendet.' },
        earthOn: { kid: 'Das ist die Erde, maßstabsgetreu: Jupiter ist 11 Erden breit! Und Jupiters Magnet ist etwa 20.000-mal so stark wie der der Erde. Auf der Erde zeigt ein Kompass nach Norden.', sci: 'Die Erde im Maßstab: Jupiters Äquator misst 11,2 Erddurchmesser. Das Dipolmoment der Erde ist etwa 20.000-mal kleiner; an den Wolkenobergrenzen hat Jupiters Feld am Äquator etwa 4 Gauß, rund 14-mal so viel wie das der Erde an ihrer Oberfläche.' },
        earthOff: { kid: 'Der Magnet der Erde ist versteckt.', sci: 'Erdfeld ausgeblendet.' },
      },
      panel: {
        kid: [
          'Tief im Jupiter leitet der flüssige metallische Wasserstoff Strom. Während Jupiter sich dreht, einmal in 10 Stunden, wirbeln darin elektrische Ströme und machen einen gigantischen Magneten. Seine magnetische Blase ist so groß, dass sie von der Erde aus größer als der Vollmond aussähe, wenn wir sie sehen könnten, und ihr Schweif reicht bis zur Bahn des Saturn.',
          'Tippe auf den Planeten, seine Pole, Io und die kleine Erde, um zu sehen, was der Magnet macht.',
        ],
        sci: [
          'Ein Dynamo: Konvektion im leitenden Wasserstoff, von Jupiters schneller Drehung (9 h 56 min) verwirbelt, hält das Feld aufrecht. Magnetisches Moment etwa 1,5 × 10²⁰ T·m³, etwa das 20.000-Fache der Erde; der Dipol ist etwa 10° geneigt und zeigt entgegengesetzt zum heutigen der Erde.',
          'Juno, seit 2016 im Orbit, hat das Feld aus der Nähe kartiert: Es ist unregelmäßiger als erwartet, mit einem starken Fleck nahe dem Äquator (dem „Großen Blauen Fleck“), und der Kern, den sie fand, ist verdünnt, keine kleine feste Kugel.',
        ],
      },
    },
  },
}
