// The words of iron's compass room ("Why does a compass point north?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Fe.js (the easel shows it); oxygen's aurora room already steers the Sun's particles
// to the poles and silicon's earth room cuts the Earth open to its core, so this room keeps to the field:
// Gilbert's dip, the dynamo, the stripes on the sea floor, the wandering pole.
// Sources (checked 2026-10-31): the field at 36.8° N, 33.1° W on 2026-10-31 from WMM2025 (BGS web
// service): 42 934 nT, dip 51.3°, declination −9.4°, changing +10.4′ a year, vertical 33 506 nT, horizontal
// 26 846 nT. Robert Norman measured the dip in London in 1581, 71° 50′ (The Newe Attractive); Gilbert's
// De Magnete (1600), the terrella and "magnus magnes ipse est globus terrestris". Shen Kuo, 1088 (the
// needle and its declination); Zhu Yu's Pingzhou Table Talks, written 1111 to 1117 (ships steering by
// compass). Kelvin's soft-iron spheres (quadrantal correctors) and the Flinders bar. Outer core 2890 to
// 5150 km, inner core radius 1220 km; core flow about 10 to 20 km a year; temperature roughly 4000 K at the
// core-mantle boundary and over 5000 K at the inner core (estimates differ, so "roughly"). Lab dynamos:
// Riga and Karlsruhe, 1999, liquid sodium; VKS reversals (Berhanu and others, 2007). Glatzmaier and
// Roberts, Nature 1995: a simulated reversal. Iron: saturation magnetisation about 2.2 T at room
// temperature, Curie point 770 °C. Magnetite's Curie point about 580 °C; lodestones probably magnetised by
// lightning (Wasilewski and Kletetschka, 1999). Mid-Atlantic Ridge: about 2.5 cm a year in all. Vine and
// Matthews, Nature 1963, and Morley; Heirtzler, Le Pichon and Baron, 1966 (Reykjanes Ridge). Polarity
// chrons from GTS2020 (Brunhes-Matuyama 0.773 Ma). North dip pole: NOAA NCEI's modelled positions 1590 to
// 2025 (NP.xy), speeds computed from them (about 55 km a year in 2001 to 2007, 37 km in 2025, the date
// line crossed in 2017); James Clark Ross at the pole on 1 June 1831, Boothia Peninsula, dip 89° 59′.

const EN = {
  title: 'The research ship',
  greet: {
    kid: 'We are inside the picture, on a research ship in the middle of the Atlantic at night! At the chart table: Gilbert\'s little magnetic Earth and the ship\'s compass. In the middle: a globe of liquid iron. Can you turn it into a magnet? By the right-hand rail, the sea floor remembers every flip of the field, and on the wall the north magnetic pole goes for a walk. The picture\'s story is on the easel.',
    sci: 'A research ship on the Mid-Atlantic Ridge south-west of the Azores, towing a magnetometer. Forward: Gilbert\'s terrella and the binnacle compass. Amidships: a model dynamo of the outer core, rotation and heat flow as its controls. To starboard: a model of the ridge recording reversals in its basalt, with the magnetometer\'s trace. On the deckhouse: the north dip pole since 1590. The picture\'s story is on the easel.',
  },
  talk: {
    kid: [
      'Lodestone, the stone that first showed people magnetism, is magnetite: iron and oxygen. So the very first magnets ever found were made of me!',
      'A compass needle is a thin piece of magnetised steel, and steel is mostly iron. Of all the elements, pure iron can be made the most strongly magnetic at room temperature.',
      'Above 770 °C iron stops being a magnet. The Earth\'s core is thousands of degrees hot, so it cannot be a giant fridge magnet: its magnetism has to be made all the time by the moving liquid iron.',
    ],
    sci: [
      'Magnetite, Fe3O4, is ferrimagnetic: iron ions on two kinds of site with opposed moments that do not cancel. Natural lodestones were probably magnetised by lightning strikes.',
      'Iron\'s saturation magnetisation, about 2.2 T at room temperature, is the highest of any pure element; iron stays ferromagnetic up to its Curie point, 770 °C (1043 K).',
      'The outer core is roughly 4000 K at its top and over 5000 K at its base, far above any Curie point: the field cannot be a frozen-in magnetisation. The flowing, conducting liquid must regenerate it all the time, as a self-sustaining dynamo.',
    ],
  },
  gilbert: {
    label: 'Gilbert\'s little Earth',
    title: 'The Earth is a great magnet',
    slider: 'Where the little needle stands (latitude)',
    signs: {
      plaque: { kid: 'Gilbert\'s little Earth, 1600', sci: 'Terrella of lodestone, W. Gilbert, De Magnete, 1600' },
    },
    hints: {
      ball: 'Tap a spot on the lodestone ball',
      compass: 'Tap the ship\'s compass',
      again: 'Tap the ball or the compass',
    },
    buttons: { equator: 'At the equator', mid: 'Halfway to the pole', pole: 'At the pole', compass: 'The ship\'s compass' },
    board: { kid: 'Needle tilt: {d}°', sci: '{l}° {ns}   dip {d}°' },
    says: {
      equator: { kid: 'At the equator the little needle lies flat along the ball, its red end pointing to the north pole.', sci: 'At the magnetic equator the field runs parallel to the surface: dip 0°.' },
      midN: { kid: 'Here the needle tilts: its red end dips {d}° down into the ball. The nearer the pole, the steeper.', sci: 'Latitude {l}° N: dip {d}°. For a dipole, tan I = 2 tan λ, so the dip is steeper than the latitude.' },
      midS: { kid: 'In the southern half the red end tilts up, {d}°, out of the ball, but it still points north.', sci: 'Latitude {l}° S: dip {d}° upward. The field leaves the southern hemisphere and enters the northern one.' },
      poleN: { kid: 'At the north pole the needle stands on end, its red end straight down! That is what a magnetic pole is.', sci: 'At the pole the field is vertical: dip 90°. On the Earth, the north dip pole is where a free needle points straight down.' },
      poleS: { kid: 'At the south pole the red end points straight up, out of the ball.', sci: 'At the south pole the dip is 90° upward: the field leaves the surface vertically.' },
      compass: [
        { kid: 'The card swings and settles back: north! Here our compass points about {dec}° west of true north, because the magnetic pole is not where the Earth\'s axis is.', sci: 'The card settles on magnetic north: the declination here is about {dec}° W (WMM2025, for 2026), moving east by about 10′ a year.' },
        { kid: 'See the two iron balls beside the compass? The ship is made of steel, which pulls the needle a little. The iron balls pull back just as much, so the compass stays honest.', sci: 'Kelvin\'s soft-iron spheres correct the quadrantal deviation caused by the ship\'s own steel; the Flinders bar in its brass case corrects the vertical induced magnetism.' },
        { kid: 'A needle free to tilt would dip {dip}° here, like Gilbert\'s little needle about a third of the way up his ball. A compass needle is weighted so it stays level and turns freely.', sci: 'A free needle would dip {dip}° here (vertical 33.5 µT, horizontal 26.8 µT, total 42.9 µT). Compass cards are balanced for their zone, so the dip does not tilt them.' },
      ],
    },
    panel: {
      kid: [
        'Over 400 years ago an English doctor, William Gilbert, shaped a ball out of lodestone, a natural magnet, and called it a little Earth. He moved a tiny needle over it and found that it behaved just like a compass on the real Earth: flat at the equator, tilting more and more toward the poles, standing on end at a pole. So, he said, the whole Earth must be a giant magnet.',
        'Tap anywhere on the ball and watch the needle. Then tap the ship\'s compass: its needle cannot tilt, but a free one would dip about 51° here. Compasses are much older than Gilbert\'s book: in China, sailors were already steering by compass more than 900 years ago.',
      ],
      sci: [
        'William Gilbert, a London physician, published De Magnete in 1600. With a terrella, a sphere of lodestone, and a small pivoted needle he reproduced the dip Robert Norman had measured in London in 1581 (71° 50′), and concluded that the Earth itself is a great magnet ("magnus magnes ipse est globus terrestris"). For an axial dipole the dip I and the magnetic latitude λ obey tan I = 2 tan λ.',
        'Here, at 36.8° N, 33.1° W, WMM2025 gives a total field of 42.9 µT, a dip of 51.3° and a declination of 9.4° W for 2026. Shen Kuo described the magnetic needle and its declination in 1088; Zhu Yu\'s Pingzhou Table Talks (written 1111 to 1117) record Chinese ships steering by compass in dark weather.',
      ],
    },
  },
  dynamo: {
    label: 'The dynamo globe',
    title: 'A magnet made of liquid iron',
    slider: 'Heat flowing out of the core',
    signs: {
      plaque: { kid: 'Liquid iron round a solid core', sci: 'Outer core (liquid Fe-Ni), inner core: a model' },
      heat: 'Heat',
      flip: 'Flip',
    },
    hints: {
      spin: 'Tap the globe to spin it',
      spinToo: 'Tap the globe to spin it too',
      heat: 'Tap the heat dial',
      weak: 'Turn up the heat',
      grow: 'Watch the field grow',
      flip: 'Tap the lever to flip the field',
      flipping: 'Watch the field turn over',
    },
    buttons: { spin: 'Spin or stop', heat: 'Heat on or off', flip: 'Flip the field' },
    says: {
      spin: { kid: 'The globe spins, like the Earth. But the liquid iron just turns along with it: nothing stirs inside, and no field appears. It needs heat too!', sci: 'Rotation alone: the fluid co-rotates as a solid body. With no flow relative to the rotating frame there is no induction.' },
      spinHot: { kid: 'Spinning and hot! Watch the liquid iron roll into swirling columns.', sci: 'Rotation added to convection: the Coriolis force organises the flow into columns parallel to the axis.' },
      heat: { kid: 'Heat flows out of the core and the liquid iron starts to tumble: hot blobs rise, cooler ones sink. Now spin the globe!', sci: 'Convection without rotation: plumes rise and sink at random, with no organised helicity, and the model makes no lasting dipole.' },
      heatSpin: { kid: 'Heat and spin together! The tumbling liquid iron rolls into swirling columns.', sci: 'Convection in a rotating shell: columnar rolls form round the inner core, and their helical flow is what regenerates the field.' },
      spinOff: { kid: 'The globe stops turning. Without the spin the columns break up and the field fades away.', sci: 'Rotation stopped: the columnar flow breaks down and the field decays (here in seconds; in the core, ohmic decay would take tens of thousands of years).' },
      stopped: { kid: 'The globe stops.', sci: 'Rotation stopped.' },
      heatOff: { kid: 'No more heat: the liquid iron calms down and the field fades away.', sci: 'Heat flow cut: convection stops, the flow can no longer make up for the ohmic losses, and the field decays.' },
      cold: { kid: 'The heat is off: the liquid iron goes quiet.', sci: 'No heat flow: no convection.' },
      grow: { kid: 'Look! Field lines are growing out of the globe and looping from pole to pole, just like in the picture. Moving metal makes electric currents, and the currents make the magnetism.', sci: 'Dynamo action: the moving conductor induces currents whose field the helical flow stretches and twists, amplifying it until the Lorentz force holds it back. The result is mostly an axial dipole.' },
      faded: { kid: 'The field has faded away. A dynamo needs both: the spin and the heat.', sci: 'The field has decayed: rotation and a strong enough heat flow are both needed.' },
      flipNo: { kid: 'There is no field to flip yet. Spin the globe and give it heat first.', sci: 'No field to reverse: get the dynamo running first.' },
      flip: { kid: 'Flip! The field gets weak and wobbly while its poles swing across the globe.', sci: 'Reversal: the dipole weakens and its axis swings through low latitudes. On the Earth a transition takes some thousands of years.' },
      flippedR: { kid: 'Done: now the field points the other way, and a compass would point south! Look at the compass in the glass ball.', sci: 'Reversed polarity: the field lines now leave the north and enter the south. The Earth was like this until about 780,000 years ago.' },
      flippedN: { kid: 'Back again: the field points the way it does today.', sci: 'Normal polarity again, as in the present Brunhes chron.' },
    },
    panel: {
      kid: [
        'Deep under our feet, about 2900 km down, lies the outer core: an ocean of liquid iron. Heat escapes from it into the rock above, so hot liquid rises and cooler liquid sinks. And because the Earth spins, the moving iron is twisted into swirling columns.',
        'Moving metal makes electric currents, and electric currents make magnetism. In the swirling columns the currents keep making themselves stronger: a dynamo. Take away the spin or the heat and it stops. Every so often the real field even flips over by itself; nobody pulls a lever!',
      ],
      sci: [
        'The outer core, 2890 to 5150 km deep, is a liquid iron-nickel alloy with some lighter elements, flowing at roughly 10 to 20 km a year. Convection is driven by heat leaving the core and by the slow freezing of the inner core, which releases latent heat and light elements. Rotation organises the flow into columns along the axis; their helical motion stretches and twists the field, regenerating it against ohmic decay.',
        'The globe is a model, and sped up: a laboratory dynamo needs a lot of fast liquid metal. The first ones worked in 1999 in Riga and Karlsruhe, with liquid sodium, and the VKS experiment at Cadarache showed reversals in 2007. Glatzmaier and Roberts simulated a spontaneous reversal of a geodynamo in 1995. Left to itself, the core\'s dipole would decay in some tens of thousands of years.',
      ],
    },
  },
  ridge: {
    label: 'The sea floor recorder',
    title: 'Stripes on the sea floor',
    slider: 'Time the sea floor spreads',
    sliderUnit: '{t} million years',
    signs: {
      plaque: { kid: 'The sea floor under our ship', sci: 'Mid-Atlantic Ridge, cut away (a model)' },
      west: 'West',
      east: 'East',
    },
    hints: {
      watch: 'Watch the sea floor spread',
      again: 'Tap the ridge to start a new sea floor',
      full: 'Tap the screen for the real sea floor',
      erupt: 'Tap the ridge to let lava out',
      dynamo: 'Start the dynamo globe, then tap the ridge',
      real: 'Tap the screen for the real sea floor',
      more: 'Tap the ridge, or flip the field at the globe',
    },
    buttons: { erupt: 'Let lava out', flip: 'Flip the field', real: 'The real sea floor', clear: 'Start again' },
    says: {
      normal: { kid: 'Lava wells up at the ridge and spreads both ways. As it cools below about 580 °C, its tiny magnetite grains freeze the field\'s direction: north, like today.', sci: 'Half a million years at about 1.25 cm a year to each side: {km} km of new floor each way, magnetised normal as it cooled through magnetite\'s Curie point (about 580 °C).' },
      reversed: { kid: 'This lava cools in the flipped field, so its magnetite remembers north pointing south: a reversed stripe!', sci: 'Reversed polarity recorded: {km} km of floor on each side, its remanence opposite to today\'s field.' },
      weak: { kid: 'The field is too weak right now, so the lava remembers almost nothing: a grey stripe.', sci: 'The field is weak (still growing, or mid-reversal): the floor records little remanence.' },
      none: { kid: 'The lava cools, but there is no field for it to remember: grey rock. Start the dynamo globe (spin it and give it heat), then tap the ridge again.', sci: 'No field: the basalt cools without remanence. Run the dynamo globe first.' },
      full: { kid: 'Five million years: the model is full! Tap the screen to see the real sea floor, or the ridge again to start a new one.', sci: 'The model spans 5 million years, 62.5 km on each side. Tap the screen for the observed record, or the ridge again to start afresh.' },
      real: { kid: 'This is the real record of the last five million years. The stripes are the same on both sides of the ridge, like a mirror! The middle one is our time: the field has pointed north since it last flipped, about 780,000 years ago.', sci: 'The polarity time scale (GTS2020) laid out at 1.25 cm a year: Brunhes (normal, since 0.773 Ma), Matuyama with the Jaramillo and Olduvai subchrons, Gauss, Gilbert. The symmetry about the axis is what Vine and Matthews, and independently Morley, predicted in 1963.' },
      clear: { kid: 'A fresh sea floor: the ridge starts again.', sci: 'Record cleared.' },
    },
    screen: {
      title: 'Magnetometer',
      ridge: 'Ridge',
      west: 'West',
      east: 'East',
      empty: { kid: 'Tap the ridge: the lava comes out here', sci: 'No record yet: tap the ridge to start the spreading' },
      normal: 'normal',
      reversed: 'reversed',
      none: 'no field',
      time: 'Spreading for {t} million years',
      timeKid: '{t} million years',
    },
    panel: {
      kid: [
        'Down the middle of the Atlantic runs a mountain range under the sea, the Mid-Atlantic Ridge. There the sea floor splits apart, about as fast as your fingernails grow, and lava wells up to fill the gap. As the lava cools, tiny grains of magnetite in it (iron again!) freeze the direction of the Earth\'s field, like compasses stopped for ever.',
        'So the sea floor is like a tape recorder. Each time the field flipped, the new rock recorded it the other way round. Ships towing magnetometers found the stripes, the same on both sides of the ridge, like a mirror. That showed that the sea floor spreads, and that the field flips.',
      ],
      sci: [
        'At the Mid-Atlantic Ridge the plates separate at about 2.5 cm a year in all. New basaltic crust acquires a thermoremanent magnetisation as it cools through the Curie point of its titanomagnetite (about 580 °C for pure magnetite), recording the field\'s polarity. A magnetometer towed far behind the ship, away from its steel, measures the stripes as anomalies above and below the regional field.',
        'Vine and Matthews (1963), and independently Lawrence Morley, explained the stripes as spreading plus reversals; profiles across the Reykjanes Ridge south of Iceland (Heirtzler, Le Pichon and Baron, 1966) showed the symmetry clearly. Matched to dated lava flows, the stripes became the polarity time scale: the last reversal, the Brunhes-Matuyama, was about 773,000 years ago (GTS2020).',
      ],
    },
  },
  pole: {
    label: 'The wandering pole',
    title: 'The north magnetic pole goes for a walk',
    slider: 'Year',
    signs: {
      title: { kid: 'Where is the north magnetic pole?', sci: 'North dip pole, 1590 to 2025 (NOAA)' },
    },
    hints: { play: 'Tap the chart to play the years', pause: 'Tap the chart to pause' },
    buttons: { play: 'Play or pause', ross: '1831: Ross', fast: 'About 2003: fastest', now: 'Today' },
    says: {
      play: { kid: 'Watch the north magnetic pole wander, from 1590 to today!', sci: 'Modelled north dip pole positions, 1590 to 2025 (NOAA NCEI).' },
      pause: { kid: 'Paused.', sci: 'Paused.' },
      ross: { kid: '1831: the explorer James Clark Ross reached the north magnetic pole in northern Canada, where his needle pointed straight down.', sci: '1 June 1831: James Clark Ross located the north magnetic pole on the Boothia Peninsula, measuring a dip of 89° 59′.' },
      fast: { kid: 'Around the year 2000 it sped up: about {v} km a year, off towards Siberia!', sci: 'Around 2000 the pole accelerated to about {v} km a year, heading north-northwest across the Arctic Ocean.' },
      now: { kid: 'Today it is near the middle of the Arctic Ocean and slowing down: about {v} km a year.', sci: '2025: about 86° N, 138° E, moving about {v} km a year and slowing.' },
    },
    chart: {
      canada: 'Canada',
      greenland: 'Greenland',
      siberia: 'Siberia',
      alaska: 'Alaska',
      geo: 'North Pole',
      ross: 'Ross 1831',
      speed: { kid: '{v} km a year', sci: 'speed: {v} km/year' },
    },
    panel: {
      kid: [
        'The north magnetic pole is the place where a needle that can tilt points straight down. It is not where the Earth\'s axis is (the North Pole, the star in the middle), and it does not stay still: the swirling iron in the core keeps changing the field.',
        'For centuries it wandered about northern Canada. Since about 1900 it has headed north, and around the year 2000 it raced across the Arctic Ocean towards Siberia at more than 50 km a year. Now it is slowing down. That is why sea charts give the compass correction with a date.',
      ],
      sci: [
        'The north dip pole is where the field is vertical. The positions shown are NOAA NCEI\'s modelled north dip pole, found by iteration from all the Gauss coefficients of global field models (for the early centuries, models built largely from ships\' logbooks), so it differs from the geomagnetic (dipole) pole.',
        'James Clark Ross reached it on the Boothia Peninsula on 1 June 1831. It moved about 10 km a year through most of the 20th century, sped up to about 55 km a year in the early 2000s, crossed the date line in 2017 and was moving about 37 km a year in 2025. The changes come from the flow at the top of the outer core.',
      ],
    },
  },
}

const PT = {
  title: 'O navio de investigação',
  greet: {
    kid: 'Estamos dentro do quadro, num navio de investigação a meio do Atlântico, de noite! Na mesa das cartas: a pequena Terra magnética de Gilbert e a bússola do navio. Ao meio: um globo de ferro líquido. Consegues transformá-lo num íman? Junto à amurada da direita, o fundo do mar lembra-se de cada inversão do campo, e na parede o polo norte magnético vai passear. A história do quadro está no cavalete.',
    sci: 'Um navio de investigação sobre a Dorsal Médio-Atlântica, a sudoeste dos Açores, a rebocar um magnetómetro. À proa: a terrella de Gilbert e a agulha de marear na bitácula. A meio: um dínamo modelo do núcleo externo, com a rotação e o fluxo de calor como comandos. A estibordo: um modelo da dorsal que regista as inversões no seu basalto, com o registo do magnetómetro. Na casa do convés: o polo norte de inclinação desde 1590. A história do quadro está no cavalete.',
  },
  talk: {
    kid: [
      'A pedra-íman, a pedra que primeiro mostrou o magnetismo às pessoas, é magnetite: ferro e oxigénio. Por isso os primeiros ímanes que alguém encontrou eram feitos de mim!',
      'A agulha de uma bússola é um pedacinho fino de aço magnetizado, e o aço é quase todo ferro. De todos os elementos, o ferro puro é o que pode ficar mais fortemente magnético à temperatura ambiente.',
      'Acima de 770 °C o ferro deixa de ser íman. O núcleo da Terra está a milhares de graus, por isso não pode ser um íman de frigorífico gigante: o seu magnetismo tem de estar sempre a ser feito pelo ferro líquido em movimento.',
    ],
    sci: [
      'A magnetite, Fe3O4, é ferrimagnética: iões de ferro em dois tipos de posição, com momentos opostos que não se anulam. As pedras-íman naturais foram provavelmente magnetizadas por raios.',
      'A magnetização de saturação do ferro, cerca de 2,2 T à temperatura ambiente, é a mais alta de todos os elementos puros; o ferro continua ferromagnético até à sua temperatura de Curie, 770 °C (1043 K).',
      'O núcleo externo está a cerca de 4000 K no topo e a mais de 5000 K na base, muito acima de qualquer temperatura de Curie: o campo não pode ser uma magnetização congelada. O líquido condutor em movimento tem de o regenerar sempre, como um dínamo autossustentado.',
    ],
  },
  gilbert: {
    label: 'A pequena Terra de Gilbert',
    title: 'A Terra é um grande íman',
    slider: 'Onde está a agulhinha (latitude)',
    signs: {
      plaque: { kid: 'A pequena Terra de Gilbert, 1600', sci: 'Terrella de pedra-íman, W. Gilbert, De Magnete, 1600' },
    },
    hints: {
      ball: 'Toca num ponto da bola de pedra-íman',
      compass: 'Toca na bússola do navio',
      again: 'Toca na bola ou na bússola',
    },
    buttons: { equator: 'No equador', mid: 'A meio caminho do polo', pole: 'No polo', compass: 'A bússola do navio' },
    board: { kid: 'Inclinação da agulha: {d}°', sci: '{l}° {ns}   inclinação {d}°' },
    says: {
      equator: { kid: 'No equador a agulhinha fica deitada ao longo da bola, com a ponta vermelha a apontar para o polo norte.', sci: 'No equador magnético o campo é paralelo à superfície: inclinação 0°.' },
      midN: { kid: 'Aqui a agulha inclina-se: a ponta vermelha mergulha {d}° para dentro da bola. Quanto mais perto do polo, mais a pique.', sci: 'Latitude {l}° N: inclinação {d}°. Para um dipolo, tg I = 2 tg λ, por isso a inclinação é maior do que a latitude.' },
      midS: { kid: 'Na metade sul a ponta vermelha inclina-se para cima, {d}°, para fora da bola, mas continua a apontar para norte.', sci: 'Latitude {l}° S: inclinação {d}° para cima. O campo sai do hemisfério sul e entra no hemisfério norte.' },
      poleN: { kid: 'No polo norte a agulha fica de pé, com a ponta vermelha virada a direito para baixo! É isso um polo magnético.', sci: 'No polo o campo é vertical: inclinação 90°. Na Terra, o polo norte de inclinação é onde uma agulha livre aponta a direito para baixo.' },
      poleS: { kid: 'No polo sul a ponta vermelha aponta a direito para cima, para fora da bola.', sci: 'No polo sul a inclinação é de 90° para cima: o campo sai da superfície na vertical.' },
      compass: [
        { kid: 'A rosa dos ventos roda e volta ao sítio: norte! Aqui a nossa bússola aponta cerca de {dec}° a oeste do norte verdadeiro, porque o polo magnético não está onde está o eixo da Terra.', sci: 'A rosa assenta no norte magnético: aqui a declinação é de cerca de {dec}° W (WMM2025, para 2026) e desloca-se para leste cerca de 10′ por ano.' },
        { kid: 'Vês as duas bolas de ferro ao lado da bússola? O navio é de aço, que puxa um bocadinho a agulha. As bolas de ferro puxam ao contrário com a mesma força, e a bússola não engana.', sci: 'As esferas de ferro macio de Kelvin corrigem o desvio quadrantal causado pelo próprio aço do navio; a barra de Flinders, no seu estojo de latão, corrige o magnetismo induzido vertical.' },
        { kid: 'Uma agulha livre de se inclinar mergulharia aqui {dip}°, como a agulhinha de Gilbert a cerca de um terço do caminho para o polo da bola. A agulha da bússola tem um contrapeso para ficar direita e rodar à vontade.', sci: 'Aqui uma agulha livre inclinaria {dip}° (vertical 33,5 µT, horizontal 26,8 µT, total 42,9 µT). As rosas das bússolas são equilibradas para a sua zona, para que a inclinação não as incline.' },
      ],
    },
    panel: {
      kid: [
        'Há mais de 400 anos, um médico inglês, William Gilbert, fez uma bola de pedra-íman, um íman natural, e chamou-lhe pequena Terra. Passou uma agulha minúscula por cima dela e viu que se portava tal e qual uma bússola na Terra a sério: deitada no equador, cada vez mais inclinada para os polos, de pé num polo. Então, disse ele, a Terra inteira tem de ser um íman gigante.',
        'Toca em qualquer ponto da bola e olha para a agulha. Depois toca na bússola do navio: a agulha dela não se pode inclinar, mas uma livre mergulharia aqui cerca de 51°. As bússolas são muito mais antigas do que o livro de Gilbert: na China, os marinheiros já se guiavam pela bússola há mais de 900 anos.',
      ],
      sci: [
        'William Gilbert, médico em Londres, publicou o De Magnete em 1600. Com uma terrella, uma esfera de pedra-íman, e uma pequena agulha num pivô, reproduziu a inclinação que Robert Norman tinha medido em Londres em 1581 (71° 50′) e concluiu que a própria Terra é um grande íman («magnus magnes ipse est globus terrestris»). Para um dipolo axial, a inclinação I e a latitude magnética λ cumprem tg I = 2 tg λ.',
        'Aqui, a 36,8° N, 33,1° W, o WMM2025 dá um campo total de 42,9 µT, uma inclinação de 51,3° e uma declinação de 9,4° W para 2026. Shen Kuo descreveu a agulha magnética e a sua declinação em 1088; as Conversas de Pingzhou de Zhu Yu (escritas entre 1111 e 1117) contam que os navios chineses se guiavam pela bússola com tempo escuro.',
      ],
    },
  },
  dynamo: {
    label: 'O globo dínamo',
    title: 'Um íman feito de ferro líquido',
    slider: 'Calor que sai do núcleo',
    signs: {
      plaque: { kid: 'Ferro líquido à volta de um núcleo sólido', sci: 'Núcleo externo (Fe-Ni líquido) e interno: modelo' },
      heat: 'Calor',
      flip: 'Inverter',
    },
    hints: {
      spin: 'Toca no globo para o pôr a girar',
      spinToo: 'Toca no globo para o pôr a girar também',
      heat: 'Toca no botão do calor',
      weak: 'Aumenta o calor',
      grow: 'Vê o campo a crescer',
      flip: 'Toca na alavanca para inverter o campo',
      flipping: 'Vê o campo a virar-se',
    },
    buttons: { spin: 'Girar ou parar', heat: 'Calor ligado ou desligado', flip: 'Inverter o campo' },
    says: {
      spin: { kid: 'O globo gira, como a Terra. Mas o ferro líquido limita-se a rodar com ele: lá dentro nada se mexe e não aparece campo nenhum. Também precisa de calor!', sci: 'Só rotação: o fluido roda como um corpo sólido. Sem escoamento em relação ao referencial em rotação não há indução.' },
      spinHot: { kid: 'A girar e quente! Vê o ferro líquido a enrolar-se em colunas que rodopiam.', sci: 'Rotação somada à convecção: a força de Coriolis organiza o escoamento em colunas paralelas ao eixo.' },
      heat: { kid: 'O calor sai do núcleo e o ferro líquido começa a revolver-se: as bolhas quentes sobem, as mais frias descem. Agora põe o globo a girar!', sci: 'Convecção sem rotação: plumas sobem e descem ao acaso, sem helicidade organizada, e o modelo não faz um dipolo duradouro.' },
      heatSpin: { kid: 'Calor e rotação juntos! O ferro líquido a revolver-se enrola-se em colunas que rodopiam.', sci: 'Convecção numa camada em rotação: formam-se rolos em colunas à volta do núcleo interno, e o seu escoamento helicoidal é o que regenera o campo.' },
      spinOff: { kid: 'O globo deixa de girar. Sem a rotação as colunas desfazem-se e o campo desaparece aos poucos.', sci: 'Rotação parada: o escoamento em colunas desfaz-se e o campo decai (aqui em segundos; no núcleo, o decaimento óhmico levaria dezenas de milhares de anos).' },
      stopped: { kid: 'O globo para.', sci: 'Rotação parada.' },
      heatOff: { kid: 'Acabou o calor: o ferro líquido acalma e o campo desaparece aos poucos.', sci: 'Fluxo de calor cortado: a convecção para, o escoamento deixa de compensar as perdas óhmicas e o campo decai.' },
      cold: { kid: 'O calor está desligado: o ferro líquido fica sossegado.', sci: 'Sem fluxo de calor: sem convecção.' },
      grow: { kid: 'Olha! Estão a crescer linhas de campo do globo, em laços de polo a polo, tal e qual como no quadro. Metal em movimento faz correntes elétricas, e as correntes fazem o magnetismo.', sci: 'Efeito dínamo: o condutor em movimento induz correntes cujo campo o escoamento helicoidal estica e torce, amplificando-o até a força de Lorentz o travar. O resultado é sobretudo um dipolo axial.' },
      faded: { kid: 'O campo desapareceu. Um dínamo precisa das duas coisas: a rotação e o calor.', sci: 'O campo decaiu: são precisos a rotação e um fluxo de calor suficientemente forte.' },
      flipNo: { kid: 'Ainda não há campo para inverter. Primeiro põe o globo a girar e dá-lhe calor.', sci: 'Não há campo para inverter: põe primeiro o dínamo a funcionar.' },
      flip: { kid: 'Inverte! O campo fica fraco e às voltas enquanto os polos atravessam o globo.', sci: 'Inversão: o dipolo enfraquece e o seu eixo passa por latitudes baixas. Na Terra, uma transição leva alguns milhares de anos.' },
      flippedR: { kid: 'Pronto: agora o campo aponta ao contrário, e uma bússola apontaria para sul! Olha para a bússola na bola de vidro.', sci: 'Polaridade invertida: as linhas de campo saem agora pelo norte e entram pelo sul. A Terra esteve assim até há cerca de 780 mil anos.' },
      flippedN: { kid: 'De volta: o campo aponta como aponta hoje.', sci: 'De novo polaridade normal, como no atual cron de Brunhes.' },
    },
    panel: {
      kid: [
        'Lá no fundo, cerca de 2900 km debaixo dos nossos pés, fica o núcleo externo: um oceano de ferro líquido. O calor escapa-se dele para a rocha de cima, por isso o líquido quente sobe e o mais frio desce. E como a Terra gira, o ferro em movimento torce-se em colunas que rodopiam.',
        'Metal em movimento faz correntes elétricas, e as correntes elétricas fazem magnetismo. Nas colunas que rodopiam, as correntes estão sempre a tornar-se mais fortes: um dínamo. Tira a rotação ou o calor e ele para. De vez em quando o campo verdadeiro até se inverte sozinho; ninguém puxa nenhuma alavanca!',
      ],
      sci: [
        'O núcleo externo, entre 2890 e 5150 km de profundidade, é uma liga líquida de ferro e níquel com alguns elementos mais leves, que se escoa a cerca de 10 a 20 km por ano. A convecção é alimentada pelo calor que sai do núcleo e pela lenta solidificação do núcleo interno, que liberta calor latente e elementos leves. A rotação organiza o escoamento em colunas ao longo do eixo; o seu movimento helicoidal estica e torce o campo e regenera-o contra o decaimento óhmico.',
        'O globo é um modelo, e acelerado: um dínamo de laboratório precisa de muito metal líquido a andar depressa. Os primeiros funcionaram em 1999, em Riga e em Karlsruhe, com sódio líquido, e a experiência VKS, em Cadarache, mostrou inversões em 2007. Glatzmaier e Roberts simularam em 1995 uma inversão espontânea de um geodínamo. Entregue a si próprio, o dipolo do núcleo decairia em algumas dezenas de milhares de anos.',
      ],
    },
  },
  ridge: {
    label: 'O registador do fundo do mar',
    title: 'Riscas no fundo do mar',
    slider: 'Tempo de expansão do fundo do mar',
    sliderUnit: '{t} milhões de anos',
    signs: {
      plaque: { kid: 'O fundo do mar debaixo do navio', sci: 'Dorsal Médio-Atlântica em corte (modelo)' },
      west: 'Oeste',
      east: 'Leste',
    },
    hints: {
      watch: 'Vê o fundo do mar a alargar',
      again: 'Toca na dorsal para começar um fundo do mar novo',
      full: 'Toca no ecrã para ver o fundo do mar verdadeiro',
      erupt: 'Toca na dorsal para deixar sair lava',
      dynamo: 'Liga o globo dínamo e depois toca na dorsal',
      real: 'Toca no ecrã para ver o fundo do mar verdadeiro',
      more: 'Toca na dorsal, ou inverte o campo no globo',
    },
    buttons: { erupt: 'Deixar sair lava', flip: 'Inverter o campo', real: 'O fundo do mar verdadeiro', clear: 'Recomeçar' },
    says: {
      normal: { kid: 'A lava sobe na dorsal e espalha-se para os dois lados. Ao arrefecer abaixo de cerca de 580 °C, os seus grãozinhos de magnetite congelam a direção do campo: norte, como hoje.', sci: 'Meio milhão de anos a cerca de 1,25 cm por ano para cada lado: {km} km de fundo novo de cada lado, magnetizado em polaridade normal ao arrefecer abaixo da temperatura de Curie da magnetite (cerca de 580 °C).' },
      reversed: { kid: 'Esta lava arrefece no campo invertido, por isso a sua magnetite lembra-se do norte a apontar para sul: uma risca invertida!', sci: 'Polaridade invertida registada: {km} km de fundo de cada lado, com remanência oposta ao campo de hoje.' },
      weak: { kid: 'O campo está fraco demais neste momento, por isso a lava quase não se lembra de nada: uma risca cinzenta.', sci: 'O campo está fraco (ainda a crescer, ou a meio de uma inversão): o fundo regista pouca remanência.' },
      none: { kid: 'A lava arrefece, mas não há campo de que se lembrar: rocha cinzenta. Liga o globo dínamo (põe-no a girar e dá-lhe calor) e depois volta a tocar na dorsal.', sci: 'Sem campo: o basalto arrefece sem remanência. Põe primeiro o globo dínamo a funcionar.' },
      full: { kid: 'Cinco milhões de anos: o modelo está cheio! Toca no ecrã para ver o fundo do mar verdadeiro, ou outra vez na dorsal para começar um novo.', sci: 'O modelo abrange 5 milhões de anos, 62,5 km de cada lado. Toca no ecrã para ver o registo observado, ou outra vez na dorsal para recomeçar.' },
      real: { kid: 'Este é o registo verdadeiro dos últimos cinco milhões de anos. As riscas são iguais dos dois lados da dorsal, como num espelho! A do meio é o nosso tempo: o campo aponta para norte desde a última inversão, há cerca de 780 mil anos.', sci: 'A escala de tempo de polaridade (GTS2020) disposta a 1,25 cm por ano: Brunhes (normal, desde há 0,773 Ma), Matuyama com os subcrons de Jaramillo e Olduvai, Gauss, Gilbert. A simetria em relação ao eixo é o que Vine e Matthews, e independentemente Morley, previram em 1963.' },
      clear: { kid: 'Um fundo do mar novinho: a dorsal recomeça.', sci: 'Registo apagado.' },
    },
    screen: {
      title: 'Magnetómetro',
      ridge: 'Dorsal',
      west: 'Oeste',
      east: 'Leste',
      empty: { kid: 'Toca na dorsal: a lava sai aqui', sci: 'Ainda sem registo: toca na dorsal para começar a expansão' },
      normal: 'normal',
      reversed: 'invertida',
      none: 'sem campo',
      time: 'Expansão durante {t} milhões de anos',
      timeKid: '{t} milhões de anos',
    },
    panel: {
      kid: [
        'Pelo meio do Atlântico passa uma cordilheira debaixo do mar, a Dorsal Médio-Atlântica. Ali o fundo do mar abre-se, mais ou menos à velocidade a que crescem as tuas unhas, e a lava sobe para tapar a fenda. Ao arrefecer, os grãozinhos de magnetite que tem lá dentro (ferro outra vez!) congelam a direção do campo da Terra, como bússolas paradas para sempre.',
        'Por isso o fundo do mar é como um gravador. Sempre que o campo se inverteu, a rocha nova registou-o ao contrário. Navios a rebocar magnetómetros encontraram as riscas, iguais dos dois lados da dorsal, como num espelho. Isso mostrou que o fundo do mar se expande e que o campo se inverte.',
      ],
      sci: [
        'Na Dorsal Médio-Atlântica as placas afastam-se cerca de 2,5 cm por ano no total. A crosta basáltica nova adquire uma magnetização termorremanente ao arrefecer abaixo da temperatura de Curie da sua titanomagnetite (cerca de 580 °C para a magnetite pura), registando a polaridade do campo. Um magnetómetro rebocado bem atrás do navio, longe do seu aço, mede as riscas como anomalias acima e abaixo do campo regional.',
        'Vine e Matthews (1963), e independentemente Lawrence Morley, explicaram as riscas pela expansão somada às inversões; perfis através da Dorsal de Reykjanes, a sul da Islândia (Heirtzler, Le Pichon e Baron, 1966), mostraram claramente a simetria. Acertadas com escoadas de lava datadas, as riscas tornaram-se a escala de tempo de polaridade: a última inversão, a de Brunhes-Matuyama, foi há cerca de 773 mil anos (GTS2020).',
      ],
    },
  },
  pole: {
    label: 'O polo que passeia',
    title: 'O polo norte magnético vai passear',
    slider: 'Ano',
    signs: {
      title: { kid: 'Onde está o polo norte magnético?', sci: 'Polo norte de inclinação, 1590 a 2025 (NOAA)' },
    },
    hints: { play: 'Toca na carta para os anos andarem', pause: 'Toca na carta para fazer pausa' },
    buttons: { play: 'Andar ou pausa', ross: '1831: Ross', fast: 'Cerca de 2003: o mais rápido', now: 'Hoje' },
    says: {
      play: { kid: 'Vê o polo norte magnético a passear, de 1590 até hoje!', sci: 'Posições modeladas do polo norte de inclinação, de 1590 a 2025 (NOAA NCEI).' },
      pause: { kid: 'Em pausa.', sci: 'Em pausa.' },
      ross: { kid: '1831: o explorador James Clark Ross chegou ao polo norte magnético, no norte do Canadá, onde a sua agulha apontava a direito para baixo.', sci: '1 de junho de 1831: James Clark Ross localizou o polo norte magnético na península de Boothia, medindo uma inclinação de 89° 59′.' },
      fast: { kid: 'Por volta do ano 2000 acelerou: cerca de {v} km por ano, a caminho da Sibéria!', sci: 'Por volta de 2000 o polo acelerou para cerca de {v} km por ano, rumo a nor-noroeste, através do oceano Ártico.' },
      now: { kid: 'Hoje está perto do meio do oceano Ártico e a abrandar: cerca de {v} km por ano.', sci: '2025: cerca de 86° N, 138° E, a deslocar-se cerca de {v} km por ano e a abrandar.' },
    },
    chart: {
      canada: 'Canadá',
      greenland: 'Gronelândia',
      siberia: 'Sibéria',
      alaska: 'Alasca',
      geo: 'Polo Norte',
      ross: 'Ross 1831',
      speed: { kid: '{v} km por ano', sci: 'velocidade: {v} km/ano' },
    },
    panel: {
      kid: [
        'O polo norte magnético é o sítio onde uma agulha que se pode inclinar aponta a direito para baixo. Não fica onde está o eixo da Terra (o Polo Norte, a estrela do meio), e não está quieto: o ferro que rodopia no núcleo está sempre a mudar o campo.',
        'Durante séculos andou a passear pelo norte do Canadá. Desde cerca de 1900 foi para norte e, por volta do ano 2000, atravessou a correr o oceano Ártico em direção à Sibéria, a mais de 50 km por ano. Agora está a abrandar. É por isso que as cartas náuticas indicam a correção da bússola com uma data.',
      ],
      sci: [
        'O polo norte de inclinação é onde o campo é vertical. As posições mostradas são o polo norte de inclinação modelado pela NOAA NCEI, encontrado por iteração a partir de todos os coeficientes de Gauss de modelos globais do campo (nos primeiros séculos, modelos feitos sobretudo a partir de diários de bordo), por isso difere do polo geomagnético (do dipolo).',
        'James Clark Ross chegou a ele na península de Boothia a 1 de junho de 1831. Deslocou-se cerca de 10 km por ano durante a maior parte do século XX, acelerou para cerca de 55 km por ano no início dos anos 2000, atravessou a linha de mudança de data em 2017 e deslocava-se cerca de 37 km por ano em 2025. As mudanças vêm do escoamento no topo do núcleo externo.',
      ],
    },
  },
}

const PL = {
  title: 'Statek badawczy',
  greet: {
    kid: 'Jesteśmy w środku obrazu, na statku badawczym pośrodku Atlantyku, w nocy! Przy stole nawigacyjnym: mała magnetyczna Ziemia Gilberta i kompas statku. Pośrodku: kula z ciekłego żelaza. Uda ci się zrobić z niej magnes? Przy prawej burcie dno morza pamięta każde odwrócenie pola, a na ścianie północny biegun magnetyczny idzie na spacer. Historia obrazu jest na sztaludze.',
    sci: 'Statek badawczy nad Grzbietem Śródatlantyckim, na południowy zachód od Azorów, holujący magnetometr. Na dziobie: terella Gilberta i kompas w kompasówce. Pośrodku: model dynama jądra zewnętrznego, sterowany obrotem i strumieniem ciepła. Przy prawej burcie: model grzbietu, który zapisuje odwrócenia w swoim bazalcie, z zapisem magnetometru. Na nadbudówce: północny biegun inklinacji od 1590 roku. Historia obrazu jest na sztaludze.',
  },
  talk: {
    kid: [
      'Magnetyt, kamień, który jako pierwszy pokazał ludziom magnetyzm, to żelazo i tlen. Więc pierwsze magnesy, jakie ktokolwiek znalazł, były zrobione ze mnie!',
      'Igła kompasu to cienki kawałek namagnesowanej stali, a stal to głównie żelazo. Ze wszystkich pierwiastków czyste żelazo można w temperaturze pokojowej namagnesować najsilniej.',
      'Powyżej 770 °C żelazo przestaje być magnesem. Jądro Ziemi ma tysiące stopni, więc nie może być olbrzymim magnesem na lodówkę: jego magnetyzm musi być ciągle wytwarzany przez poruszające się ciekłe żelazo.',
    ],
    sci: [
      'Magnetyt, Fe3O4, jest ferrimagnetykiem: jony żelaza zajmują dwa rodzaje miejsc, a ich przeciwne momenty się nie znoszą. Naturalne kamienie magnetyczne zostały namagnesowane najpewniej przez uderzenia piorunów.',
      'Magnetyzacja nasycenia żelaza, około 2,2 T w temperaturze pokojowej, jest najwyższa spośród czystych pierwiastków; żelazo pozostaje ferromagnetykiem aż do punktu Curie, 770 °C (1043 K).',
      'Jądro zewnętrzne ma u góry około 4000 K, a u podstawy ponad 5000 K, znacznie powyżej każdego punktu Curie: pole nie może być zamrożoną magnetyzacją. Płynąca, przewodząca ciecz musi je stale odtwarzać, jako samowzbudne dynamo.',
    ],
  },
  gilbert: {
    label: 'Mała Ziemia Gilberta',
    title: 'Ziemia jest wielkim magnesem',
    slider: 'Gdzie stoi mała igła (szerokość geograficzna)',
    signs: {
      plaque: { kid: 'Mała Ziemia Gilberta, 1600', sci: 'Terella z magnetytu, W. Gilbert, De Magnete, 1600' },
    },
    hints: {
      ball: 'Dotknij jakiegoś miejsca na kuli z magnetytu',
      compass: 'Dotknij kompasu statku',
      again: 'Dotknij kuli albo kompasu',
    },
    buttons: { equator: 'Na równiku', mid: 'W połowie drogi do bieguna', pole: 'Na biegunie', compass: 'Kompas statku' },
    board: { kid: 'Nachylenie igły: {d}°', sci: '{l}° {ns}   inklinacja {d}°' },
    says: {
      equator: { kid: 'Na równiku mała igła leży płasko wzdłuż kuli, a jej czerwony koniec wskazuje biegun północny.', sci: 'Na równiku magnetycznym pole biegnie równolegle do powierzchni: inklinacja 0°.' },
      midN: { kid: 'Tutaj igła się przechyla: jej czerwony koniec opada o {d}° w stronę kuli. Im bliżej bieguna, tym bardziej stromo.', sci: 'Szerokość {l}° N: inklinacja {d}°. Dla dipola tg I = 2 tg λ, więc inklinacja jest większa niż szerokość.' },
      midS: { kid: 'Na południowej połowie czerwony koniec unosi się o {d}°, w górę od kuli, ale wciąż wskazuje północ.', sci: 'Szerokość {l}° S: inklinacja {d}° w górę. Pole wychodzi z półkuli południowej i wchodzi w północną.' },
      poleN: { kid: 'Na biegunie północnym igła staje na sztorc, czerwonym końcem prosto w dół! Tym właśnie jest biegun magnetyczny.', sci: 'Na biegunie pole jest pionowe: inklinacja 90°. Na Ziemi północny biegun inklinacji to miejsce, gdzie swobodna igła wskazuje prosto w dół.' },
      poleS: { kid: 'Na biegunie południowym czerwony koniec wskazuje prosto w górę, od kuli.', sci: 'Na biegunie południowym inklinacja wynosi 90° w górę: pole wychodzi z powierzchni pionowo.' },
      compass: [
        { kid: 'Róża kompasu kręci się i wraca na miejsce: północ! Tutaj nasz kompas wskazuje około {dec}° na zachód od prawdziwej północy, bo biegun magnetyczny nie leży tam, gdzie oś Ziemi.', sci: 'Róża ustawia się na północ magnetyczną: deklinacja wynosi tu około {dec}° W (WMM2025, na rok 2026) i przesuwa się na wschód o około 10′ rocznie.' },
        { kid: 'Widzisz dwie żelazne kule obok kompasu? Statek jest ze stali, która trochę przyciąga igłę. Żelazne kule ciągną w drugą stronę tak samo mocno, więc kompas nie kłamie.', sci: 'Kule z miękkiego żelaza Kelvina kompensują dewiację ćwierćokresową od stali samego statku; pręt Flindersa w mosiężnej osłonie kompensuje pionowy magnetyzm indukowany.' },
        { kid: 'Igła, która może się przechylać, opadłaby tutaj o {dip}°, jak mała igła Gilberta mniej więcej w jednej trzeciej drogi do bieguna kuli. Igła kompasu ma przeciwwagę, żeby leżała poziomo i swobodnie się obracała.', sci: 'Swobodna igła miałaby tu inklinację {dip}° (składowa pionowa 33,5 µT, pozioma 26,8 µT, całkowite pole 42,9 µT). Róże kompasów wyważa się dla danej strefy, żeby inklinacja ich nie przechylała.' },
      ],
    },
    panel: {
      kid: [
        'Ponad 400 lat temu angielski lekarz William Gilbert wyrzeźbił kulę z magnetytu, naturalnego magnesu, i nazwał ją małą Ziemią. Przesuwał nad nią malutką igłę i odkrył, że zachowuje się dokładnie jak kompas na prawdziwej Ziemi: leży płasko na równiku, przechyla się coraz bardziej w stronę biegunów, a na biegunie staje na sztorc. Więc, jak powiedział, cała Ziemia musi być olbrzymim magnesem.',
        'Dotknij kuli w dowolnym miejscu i patrz na igłę. Potem dotknij kompasu statku: jego igła nie może się przechylać, ale swobodna opadłaby tutaj o około 51°. Kompasy są dużo starsze niż książka Gilberta: w Chinach żeglarze kierowali się kompasem już ponad 900 lat temu.',
      ],
      sci: [
        'William Gilbert, londyński lekarz, wydał De Magnete w 1600 roku. Za pomocą terelli, kuli z magnetytu, i małej igły na osi odtworzył inklinację, którą Robert Norman zmierzył w Londynie w 1581 roku (71° 50′), i wywnioskował, że sama Ziemia jest wielkim magnesem („magnus magnes ipse est globus terrestris”). Dla osiowego dipola inklinacja I i szerokość magnetyczna λ spełniają tg I = 2 tg λ.',
        'Tutaj, na 36,8° N, 33,1° W, model WMM2025 daje na rok 2026 pole całkowite 42,9 µT, inklinację 51,3° i deklinację 9,4° W. Shen Kuo opisał igłę magnetyczną i jej deklinację w 1088 roku; „Rozmowy z Pingzhou” Zhu Yu (spisane w latach 1111 do 1117) mówią, że chińskie statki przy złej widoczności kierowały się kompasem.',
      ],
    },
  },
  dynamo: {
    label: 'Kula dynama',
    title: 'Magnes z ciekłego żelaza',
    slider: 'Ciepło uciekające z jądra',
    signs: {
      plaque: { kid: 'Ciekłe żelazo wokół stałego jądra', sci: 'Jądro zewnętrzne (ciekłe Fe-Ni) i wewnętrzne: model' },
      heat: 'Ciepło',
      flip: 'Odwróć',
    },
    hints: {
      spin: 'Dotknij kuli, żeby ją rozkręcić',
      spinToo: 'Dotknij kuli, żeby ją też rozkręcić',
      heat: 'Dotknij pokrętła ciepła',
      weak: 'Podkręć ciepło',
      grow: 'Patrz, jak rośnie pole',
      flip: 'Dotknij dźwigni, żeby odwrócić pole',
      flipping: 'Patrz, jak pole się przewraca',
    },
    buttons: { spin: 'Kręć albo zatrzymaj', heat: 'Ciepło włącz albo wyłącz', flip: 'Odwróć pole' },
    says: {
      spin: { kid: 'Kula się kręci, jak Ziemia. Ale ciekłe żelazo po prostu obraca się razem z nią: w środku nic się nie miesza i pole się nie pojawia. Potrzeba jeszcze ciepła!', sci: 'Sam obrót: ciecz obraca się jak ciało sztywne. Bez przepływu względem obracającego się układu nie ma indukcji.' },
      spinHot: { kid: 'Kręci się i jest gorąco! Patrz, jak ciekłe żelazo zwija się w wirujące kolumny.', sci: 'Obrót dodany do konwekcji: siła Coriolisa układa przepływ w kolumny równoległe do osi.' },
      heat: { kid: 'Ciepło ucieka z jądra i ciekłe żelazo zaczyna się kotłować: gorące bąble wznoszą się, chłodniejsze opadają. Teraz rozkręć kulę!', sci: 'Konwekcja bez obrotu: pióropusze wznoszą się i opadają przypadkowo, bez uporządkowanej skrętności, i model nie wytwarza trwałego dipola.' },
      heatSpin: { kid: 'Ciepło i obrót naraz! Kotłujące się ciekłe żelazo zwija się w wirujące kolumny.', sci: 'Konwekcja w obracającej się warstwie: wokół jądra wewnętrznego tworzą się kolumnowe wiry, a ich śrubowy przepływ odtwarza pole.' },
      spinOff: { kid: 'Kula przestaje się kręcić. Bez obrotu kolumny się rozpadają, a pole powoli znika.', sci: 'Obrót zatrzymany: przepływ kolumnowy się rozpada, a pole zanika (tu w kilka sekund; w jądrze zanik omowy trwałby dziesiątki tysięcy lat).' },
      stopped: { kid: 'Kula się zatrzymuje.', sci: 'Obrót zatrzymany.' },
      heatOff: { kid: 'Koniec ciepła: ciekłe żelazo się uspokaja, a pole powoli znika.', sci: 'Strumień ciepła odcięty: konwekcja ustaje, przepływ nie nadąża za stratami omowymi i pole zanika.' },
      cold: { kid: 'Ciepło wyłączone: ciekłe żelazo się uspokaja.', sci: 'Bez strumienia ciepła: bez konwekcji.' },
      grow: { kid: 'Patrz! Z kuli wyrastają linie pola i zataczają pętle od bieguna do bieguna, dokładnie jak na obrazie. Poruszający się metal wytwarza prądy elektryczne, a prądy tworzą magnetyzm.', sci: 'Działanie dynama: poruszający się przewodnik indukuje prądy, których pole śrubowy przepływ rozciąga i skręca, wzmacniając je, aż siła Lorentza je powstrzyma. Wychodzi z tego głównie osiowy dipol.' },
      faded: { kid: 'Pole zniknęło. Dynamo potrzebuje obu rzeczy: obrotu i ciepła.', sci: 'Pole zanikło: potrzebne są i obrót, i dostatecznie silny strumień ciepła.' },
      flipNo: { kid: 'Na razie nie ma pola do odwrócenia. Najpierw rozkręć kulę i daj jej ciepło.', sci: 'Brak pola do odwrócenia: najpierw uruchom dynamo.' },
      flip: { kid: 'Odwracamy! Pole słabnie i chwieje się, a jego bieguny przechodzą na drugą stronę kuli.', sci: 'Odwrócenie: dipol słabnie, a jego oś przechodzi przez niskie szerokości. Na Ziemi takie przejście trwa kilka tysięcy lat.' },
      flippedR: { kid: 'Gotowe: teraz pole wskazuje w drugą stronę i kompas wskazywałby południe! Spójrz na kompas w szklanej kuli.', sci: 'Biegunowość odwrócona: linie pola wychodzą teraz z północy i wchodzą na południu. Tak było na Ziemi do około 780 tysięcy lat temu.' },
      flippedN: { kid: 'Z powrotem: pole wskazuje tak, jak dzisiaj.', sci: 'Znowu biegunowość normalna, jak w obecnym chronie Brunhesa.' },
    },
    panel: {
      kid: [
        'Głęboko pod naszymi stopami, około 2900 km w dół, leży jądro zewnętrzne: ocean ciekłego żelaza. Ciepło ucieka z niego do skał powyżej, więc gorąca ciecz się wznosi, a chłodniejsza opada. A ponieważ Ziemia się obraca, poruszające się żelazo skręca się w wirujące kolumny.',
        'Poruszający się metal wytwarza prądy elektryczne, a prądy elektryczne tworzą magnetyzm. W wirujących kolumnach prądy same się ciągle wzmacniają: to dynamo. Zabierz obrót albo ciepło, a się zatrzyma. Co jakiś czas prawdziwe pole nawet samo się odwraca; nikt nie ciągnie za żadną dźwignię!',
      ],
      sci: [
        'Jądro zewnętrzne, na głębokości od 2890 do 5150 km, to ciekły stop żelaza i niklu z domieszką lżejszych pierwiastków, płynący z prędkością rzędu 10 do 20 km rocznie. Konwekcję napędza ciepło uciekające z jądra i powolne krzepnięcie jądra wewnętrznego, które uwalnia ciepło utajone i lekkie pierwiastki. Obrót układa przepływ w kolumny wzdłuż osi; ich śrubowy ruch rozciąga i skręca pole, odtwarzając je wbrew zanikowi omowemu.',
        'Kula jest modelem, i to przyspieszonym: laboratoryjne dynamo potrzebuje dużo szybko płynącego ciekłego metalu. Pierwsze zadziałały w 1999 roku w Rydze i Karlsruhe, z ciekłym sodem, a eksperyment VKS w Cadarache pokazał odwrócenia w 2007 roku. Glatzmaier i Roberts zasymulowali w 1995 roku samorzutne odwrócenie geodynama. Pozostawiony sam sobie dipol jądra zaniknąłby w ciągu kilkudziesięciu tysięcy lat.',
      ],
    },
  },
  ridge: {
    label: 'Rejestrator dna morskiego',
    title: 'Pasy na dnie morza',
    slider: 'Czas rozrastania się dna',
    sliderUnit: '{t} mln lat',
    signs: {
      plaque: { kid: 'Dno morza pod naszym statkiem', sci: 'Grzbiet Śródatlantycki w przekroju (model)' },
      west: 'Zachód',
      east: 'Wschód',
    },
    hints: {
      watch: 'Patrz, jak dno morza się rozsuwa',
      again: 'Dotknij grzbietu, żeby zacząć nowe dno',
      full: 'Dotknij ekranu, żeby zobaczyć prawdziwe dno',
      erupt: 'Dotknij grzbietu, żeby wypuścić lawę',
      dynamo: 'Uruchom kulę dynama, potem dotknij grzbietu',
      real: 'Dotknij ekranu, żeby zobaczyć prawdziwe dno',
      more: 'Dotknij grzbietu albo odwróć pole przy kuli',
    },
    buttons: { erupt: 'Wypuść lawę', flip: 'Odwróć pole', real: 'Prawdziwe dno morza', clear: 'Zacznij od nowa' },
    says: {
      normal: { kid: 'Lawa wypływa w grzbiecie i rozchodzi się w obie strony. Gdy stygnie poniżej około 580 °C, jej malutkie ziarenka magnetytu zamrażają kierunek pola: na północ, jak dzisiaj.', sci: 'Pół miliona lat po około 1,25 cm rocznie w każdą stronę: {km} km nowego dna z każdej strony, namagnesowanego normalnie podczas stygnięcia poniżej punktu Curie magnetytu (około 580 °C).' },
      reversed: { kid: 'Ta lawa stygnie w odwróconym polu, więc jej magnetyt zapamiętuje północ wskazującą na południe: odwrócony pas!', sci: 'Zapisana biegunowość odwrócona: {km} km dna z każdej strony, z pozostałością magnetyczną przeciwną do dzisiejszego pola.' },
      weak: { kid: 'Pole jest teraz za słabe, więc lawa prawie nic nie zapamiętuje: szary pas.', sci: 'Pole jest słabe (jeszcze rośnie albo trwa odwrócenie): dno zapisuje niewielką pozostałość magnetyczną.' },
      none: { kid: 'Lawa stygnie, ale nie ma pola, które mogłaby zapamiętać: szara skała. Uruchom kulę dynama (rozkręć ją i daj jej ciepło), potem znów dotknij grzbietu.', sci: 'Brak pola: bazalt stygnie bez pozostałości magnetycznej. Najpierw uruchom kulę dynama.' },
      full: { kid: 'Pięć milionów lat: model jest pełny! Dotknij ekranu, żeby zobaczyć prawdziwe dno, albo jeszcze raz grzbietu, żeby zacząć nowe.', sci: 'Model obejmuje 5 milionów lat, 62,5 km z każdej strony. Dotknij ekranu, żeby zobaczyć zapis obserwowany, albo znów grzbietu, żeby zacząć od nowa.' },
      real: { kid: 'To prawdziwy zapis ostatnich pięciu milionów lat. Pasy są takie same po obu stronach grzbietu, jak w lustrze! Środkowy to nasze czasy: pole wskazuje północ od ostatniego odwrócenia, około 780 tysięcy lat temu.', sci: 'Skala czasu biegunowości (GTS2020) rozłożona po 1,25 cm rocznie: Brunhes (normalna, od 0,773 mln lat), Matuyama z subchronami Jaramillo i Olduvai, Gauss, Gilbert. Symetria względem osi to właśnie to, co w 1963 roku przewidzieli Vine i Matthews, a niezależnie Morley.' },
      clear: { kid: 'Całkiem nowe dno morza: grzbiet zaczyna od nowa.', sci: 'Zapis wyczyszczony.' },
    },
    screen: {
      title: 'Magnetometr',
      ridge: 'Grzbiet',
      west: 'Zachód',
      east: 'Wschód',
      empty: { kid: 'Dotknij grzbietu: lawa wypłynie tutaj', sci: 'Brak zapisu: dotknij grzbietu, żeby zacząć rozrastanie' },
      normal: 'normalna',
      reversed: 'odwrócona',
      none: 'brak pola',
      time: 'Rozrastanie przez {t} mln lat',
      timeKid: '{t} mln lat',
    },
    panel: {
      kid: [
        'Środkiem Atlantyku biegnie podmorskie pasmo górskie, Grzbiet Śródatlantycki. Tam dno morza się rozsuwa, mniej więcej tak szybko, jak rosną ci paznokcie, a lawa wypływa, żeby wypełnić szczelinę. Kiedy lawa stygnie, malutkie ziarenka magnetytu w niej (znowu żelazo!) zamrażają kierunek pola Ziemi, jak kompasy zatrzymane na zawsze.',
        'Więc dno morza jest jak magnetofon. Za każdym razem, gdy pole się odwracało, nowa skała zapisywała je odwrotnie. Statki holujące magnetometry znalazły te pasy, takie same po obu stronach grzbietu, jak w lustrze. To pokazało, że dno morza się rozrasta, a pole się odwraca.',
      ],
      sci: [
        'W Grzbiecie Śródatlantyckim płyty oddalają się łącznie o około 2,5 cm rocznie. Nowa skorupa bazaltowa nabiera termopozostałości magnetycznej, gdy stygnie poniżej punktu Curie swojego tytanomagnetytu (około 580 °C dla czystego magnetytu), i zapisuje biegunowość pola. Magnetometr holowany daleko za statkiem, z dala od jego stali, mierzy pasy jako anomalie powyżej i poniżej pola regionalnego.',
        'Vine i Matthews (1963), a niezależnie Lawrence Morley, wyjaśnili pasy rozrastaniem dna i odwróceniami pola; profile w poprzek Grzbietu Reykjanes na południe od Islandii (Heirtzler, Le Pichon i Baron, 1966) wyraźnie pokazały symetrię. Dopasowane do datowanych potoków lawy pasy stały się skalą czasu biegunowości: ostatnie odwrócenie, Brunhes-Matuyama, nastąpiło około 773 tysięcy lat temu (GTS2020).',
      ],
    },
  },
  pole: {
    label: 'Wędrujący biegun',
    title: 'Północny biegun magnetyczny idzie na spacer',
    slider: 'Rok',
    signs: {
      title: { kid: 'Gdzie jest północny biegun magnetyczny?', sci: 'Północny biegun inklinacji, 1590 do 2025 (NOAA)' },
    },
    hints: { play: 'Dotknij mapy, żeby puścić lata', pause: 'Dotknij mapy, żeby zatrzymać' },
    buttons: { play: 'Puść albo zatrzymaj', ross: '1831: Ross', fast: 'Około 2003: najszybciej', now: 'Dziś' },
    says: {
      play: { kid: 'Patrz, jak północny biegun magnetyczny wędruje, od 1590 roku do dziś!', sci: 'Modelowe położenia północnego bieguna inklinacji, 1590 do 2025 (NOAA NCEI).' },
      pause: { kid: 'Pauza.', sci: 'Pauza.' },
      ross: { kid: '1831: podróżnik James Clark Ross dotarł do północnego bieguna magnetycznego na północy Kanady, gdzie jego igła wskazywała prosto w dół.', sci: '1 czerwca 1831: James Clark Ross zlokalizował północny biegun magnetyczny na półwyspie Boothia, mierząc inklinację 89° 59′.' },
      fast: { kid: 'Około roku 2000 przyspieszył: około {v} km rocznie, w stronę Syberii!', sci: 'Około 2000 roku biegun przyspieszył do około {v} km rocznie, kierując się na północny północny zachód przez Ocean Arktyczny.' },
      now: { kid: 'Dziś jest blisko środka Oceanu Arktycznego i zwalnia: około {v} km rocznie.', sci: '2025: około 86° N, 138° E, przesuwa się o około {v} km rocznie i zwalnia.' },
    },
    chart: {
      canada: 'Kanada',
      greenland: 'Grenlandia',
      siberia: 'Syberia',
      alaska: 'Alaska',
      geo: 'Biegun Północny',
      ross: 'Ross 1831',
      speed: { kid: '{v} km rocznie', sci: 'prędkość: {v} km/rok' },
    },
    panel: {
      kid: [
        'Północny biegun magnetyczny to miejsce, gdzie igła, która może się przechylać, wskazuje prosto w dół. Nie leży tam, gdzie oś Ziemi (Biegun Północny, gwiazdka pośrodku), i nie stoi w miejscu: wirujące żelazo w jądrze ciągle zmienia pole.',
        'Przez wieki wędrował po północnej Kanadzie. Od około 1900 roku kieruje się na północ, a około roku 2000 pędził przez Ocean Arktyczny w stronę Syberii z prędkością ponad 50 km rocznie. Teraz zwalnia. Dlatego mapy morskie podają poprawkę kompasu razem z datą.',
      ],
      sci: [
        'Północny biegun inklinacji to miejsce, gdzie pole jest pionowe. Pokazane położenia to modelowy północny biegun inklinacji NOAA NCEI, wyznaczany iteracyjnie ze wszystkich współczynników Gaussa globalnych modeli pola (dla pierwszych stuleci z modeli opartych głównie na dziennikach okrętowych), dlatego różni się od bieguna geomagnetycznego (dipolowego).',
        'James Clark Ross dotarł do niego na półwyspie Boothia 1 czerwca 1831 roku. Przez większą część XX wieku przesuwał się o około 10 km rocznie, na początku lat 2000 przyspieszył do około 55 km rocznie, w 2017 roku przekroczył linię zmiany daty, a w 2025 roku przesuwał się o około 37 km rocznie. Zmiany pochodzą od przepływu na górnej granicy jądra zewnętrznego.',
      ],
    },
  },
}

const DE = {
  title: 'Das Forschungsschiff',
  greet: {
    kid: 'Wir sind im Bild, auf einem Forschungsschiff mitten im Atlantik, nachts! Am Kartentisch: Gilberts kleine magnetische Erde und der Kompass des Schiffs. In der Mitte: eine Kugel aus flüssigem Eisen. Schaffst du es, daraus einen Magneten zu machen? An der rechten Reling erinnert sich der Meeresboden an jede Umpolung des Feldes, und an der Wand geht der magnetische Nordpol spazieren. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Ein Forschungsschiff über dem Mittelatlantischen Rücken südwestlich der Azoren, das ein Magnetometer schleppt. Vorn: Gilberts Terrella und der Kompass im Kompasshaus. Mittschiffs: ein Modelldynamo des äußeren Kerns, gesteuert über Rotation und Wärmefluss. An Steuerbord: ein Modell des Rückens, das Umpolungen in seinem Basalt aufzeichnet, mit der Spur des Magnetometers. Am Deckshaus: der nördliche Inklinationspol seit 1590. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Magneteisenstein, der Stein, der den Menschen als Erstes den Magnetismus zeigte, ist Magnetit: Eisen und Sauerstoff. Die allerersten Magnete, die je jemand fand, waren also aus mir!',
      'Eine Kompassnadel ist ein dünnes Stück magnetisierter Stahl, und Stahl ist vor allem Eisen. Von allen Elementen lässt sich reines Eisen bei Zimmertemperatur am stärksten magnetisieren.',
      'Über 770 °C ist Eisen kein Magnet mehr. Der Erdkern ist Tausende Grad heiß, also kann er kein riesiger Kühlschrankmagnet sein: Sein Magnetismus muss ständig vom bewegten flüssigen Eisen gemacht werden.',
    ],
    sci: [
      'Magnetit, Fe3O4, ist ferrimagnetisch: Eisenionen auf zwei Arten von Gitterplätzen, deren entgegengesetzte Momente sich nicht aufheben. Natürlicher Magneteisenstein wurde wahrscheinlich durch Blitzeinschläge magnetisiert.',
      'Die Sättigungsmagnetisierung von Eisen, etwa 2,2 T bei Zimmertemperatur, ist die höchste aller reinen Elemente; Eisen bleibt bis zu seiner Curie-Temperatur von 770 °C (1043 K) ferromagnetisch.',
      'Der äußere Kern hat oben grob 4000 K und unten über 5000 K, weit über jeder Curie-Temperatur: Das Feld kann keine eingefrorene Magnetisierung sein. Die strömende, leitende Flüssigkeit muss es ständig erneuern, als selbsterregter Dynamo.',
    ],
  },
  gilbert: {
    label: 'Gilberts kleine Erde',
    title: 'Die Erde ist ein großer Magnet',
    slider: 'Wo die kleine Nadel steht (Breite)',
    signs: {
      plaque: { kid: 'Gilberts kleine Erde, 1600', sci: 'Terrella aus Magneteisenstein, W. Gilbert, De Magnete, 1600' },
    },
    hints: {
      ball: 'Tippe auf eine Stelle der Magnetsteinkugel',
      compass: 'Tippe auf den Kompass des Schiffs',
      again: 'Tippe auf die Kugel oder den Kompass',
    },
    buttons: { equator: 'Am Äquator', mid: 'Auf halbem Weg zum Pol', pole: 'Am Pol', compass: 'Der Kompass des Schiffs' },
    board: { kid: 'Neigung der Nadel: {d}°', sci: '{l}° {ns}   Inklination {d}°' },
    says: {
      equator: { kid: 'Am Äquator liegt die kleine Nadel flach an der Kugel, ihr rotes Ende zeigt zum Nordpol.', sci: 'Am magnetischen Äquator verläuft das Feld parallel zur Oberfläche: Inklination 0°.' },
      midN: { kid: 'Hier neigt sich die Nadel: Ihr rotes Ende taucht {d}° in die Kugel hinein. Je näher am Pol, desto steiler.', sci: 'Breite {l}° N: Inklination {d}°. Für einen Dipol gilt tan I = 2 tan λ, also ist die Inklination steiler als die Breite.' },
      midS: { kid: 'Auf der Südhälfte hebt sich das rote Ende um {d}°, aus der Kugel heraus, zeigt aber immer noch nach Norden.', sci: 'Breite {l}° S: Inklination {d}° nach oben. Das Feld tritt aus der Südhalbkugel aus und in die Nordhalbkugel ein.' },
      poleN: { kid: 'Am Nordpol steht die Nadel senkrecht, ihr rotes Ende genau nach unten! Genau das ist ein magnetischer Pol.', sci: 'Am Pol ist das Feld senkrecht: Inklination 90°. Auf der Erde ist der nördliche Inklinationspol der Ort, an dem eine frei bewegliche Nadel genau nach unten zeigt.' },
      poleS: { kid: 'Am Südpol zeigt das rote Ende genau nach oben, aus der Kugel heraus.', sci: 'Am Südpol beträgt die Inklination 90° nach oben: Das Feld verlässt die Oberfläche senkrecht.' },
      compass: [
        { kid: 'Die Rose schwingt und pendelt sich wieder ein: Norden! Hier zeigt unser Kompass etwa {dec}° westlich von geografisch Nord, weil der magnetische Pol nicht dort liegt, wo die Erdachse ist.', sci: 'Die Rose stellt sich auf magnetisch Nord ein: Die Missweisung beträgt hier etwa {dec}° W (WMM2025, für 2026) und wandert um etwa 10′ pro Jahr nach Osten.' },
        { kid: 'Siehst du die zwei Eisenkugeln neben dem Kompass? Das Schiff ist aus Stahl, und der zieht ein wenig an der Nadel. Die Eisenkugeln ziehen genauso stark dagegen, so bleibt der Kompass ehrlich.', sci: 'Kelvins Weicheisenkugeln gleichen die quadrantale Deviation durch den Stahl des Schiffs aus; der Flindersstab im Messinggehäuse gleicht den senkrecht induzierten Magnetismus aus.' },
        { kid: 'Eine Nadel, die sich neigen kann, würde hier {dip}° nach unten zeigen, wie Gilberts kleine Nadel etwa ein Drittel des Weges zum Pol seiner Kugel. Eine Kompassnadel hat ein Gegengewicht, damit sie waagerecht bleibt und sich frei dreht.', sci: 'Eine frei bewegliche Nadel hätte hier {dip}° Inklination (vertikal 33,5 µT, horizontal 26,8 µT, gesamt 42,9 µT). Kompassrosen werden für ihre Zone ausbalanciert, damit die Inklination sie nicht kippt.' },
      ],
    },
    panel: {
      kid: [
        'Vor über 400 Jahren formte ein englischer Arzt, William Gilbert, eine Kugel aus Magneteisenstein, einem natürlichen Magneten, und nannte sie kleine Erde. Er bewegte eine winzige Nadel darüber und fand, dass sie sich genau wie ein Kompass auf der echten Erde verhielt: flach am Äquator, zu den Polen hin immer schräger, senkrecht an einem Pol. Also, sagte er, muss die ganze Erde ein riesiger Magnet sein.',
        'Tippe irgendwo auf die Kugel und schau auf die Nadel. Dann tippe auf den Kompass des Schiffs: Seine Nadel kann sich nicht neigen, aber eine frei bewegliche würde hier etwa 51° nach unten zeigen. Kompasse sind viel älter als Gilberts Buch: In China steuerten Seeleute schon vor mehr als 900 Jahren mit dem Kompass.',
      ],
      sci: [
        'William Gilbert, ein Londoner Arzt, veröffentlichte 1600 De Magnete. Mit einer Terrella, einer Kugel aus Magneteisenstein, und einer kleinen drehbaren Nadel stellte er die Inklination nach, die Robert Norman 1581 in London gemessen hatte (71° 50′), und folgerte, dass die Erde selbst ein großer Magnet ist („magnus magnes ipse est globus terrestris“). Für einen axialen Dipol gilt zwischen Inklination I und magnetischer Breite λ tan I = 2 tan λ.',
        'Hier, bei 36,8° N, 33,1° W, ergibt WMM2025 für 2026 ein Gesamtfeld von 42,9 µT, eine Inklination von 51,3° und eine Missweisung von 9,4° W. Shen Kuo beschrieb 1088 die Magnetnadel und ihre Missweisung; Zhu Yus „Tischgespräche aus Pingzhou“ (geschrieben 1111 bis 1117) berichten, dass chinesische Schiffe bei trübem Wetter nach dem Kompass steuerten.',
      ],
    },
  },
  dynamo: {
    label: 'Die Dynamokugel',
    title: 'Ein Magnet aus flüssigem Eisen',
    slider: 'Wärme, die aus dem Kern strömt',
    signs: {
      plaque: { kid: 'Flüssiges Eisen um einen festen Kern', sci: 'Äußerer Kern (flüssiges Fe-Ni), innerer Kern: Modell' },
      heat: 'Wärme',
      flip: 'Umpolen',
    },
    hints: {
      spin: 'Tippe auf die Kugel, um sie zu drehen',
      spinToo: 'Tippe auf die Kugel, um sie auch zu drehen',
      heat: 'Tippe auf den Wärmeregler',
      weak: 'Dreh die Wärme höher',
      grow: 'Schau, wie das Feld wächst',
      flip: 'Tippe auf den Hebel, um das Feld umzupolen',
      flipping: 'Schau, wie sich das Feld umdreht',
    },
    buttons: { spin: 'Drehen oder anhalten', heat: 'Wärme an oder aus', flip: 'Feld umpolen' },
    says: {
      spin: { kid: 'Die Kugel dreht sich, wie die Erde. Aber das flüssige Eisen dreht sich einfach mit: Innen rührt sich nichts, und kein Feld erscheint. Es braucht auch Wärme!', sci: 'Nur Rotation: Die Flüssigkeit rotiert wie ein starrer Körper mit. Ohne Strömung relativ zum rotierenden System gibt es keine Induktion.' },
      spinHot: { kid: 'Sie dreht sich und ist heiß! Schau, wie sich das flüssige Eisen zu wirbelnden Säulen aufrollt.', sci: 'Rotation zur Konvektion hinzu: Die Corioliskraft ordnet die Strömung zu Säulen parallel zur Achse.' },
      heat: { kid: 'Wärme strömt aus dem Kern, und das flüssige Eisen fängt an zu brodeln: Heiße Blasen steigen, kühlere sinken. Jetzt dreh die Kugel!', sci: 'Konvektion ohne Rotation: Plumes steigen und sinken zufällig, ohne geordnete Helizität, und das Modell erzeugt keinen dauerhaften Dipol.' },
      heatSpin: { kid: 'Wärme und Drehung zusammen! Das brodelnde flüssige Eisen rollt sich zu wirbelnden Säulen auf.', sci: 'Konvektion in einer rotierenden Schale: Um den inneren Kern bilden sich säulenförmige Walzen, und ihre schraubenförmige Strömung erneuert das Feld.' },
      spinOff: { kid: 'Die Kugel hört auf, sich zu drehen. Ohne Drehung zerfallen die Säulen, und das Feld verblasst.', sci: 'Rotation gestoppt: Die Säulenströmung zerfällt, und das Feld klingt ab (hier in Sekunden; im Kern würde der ohmsche Zerfall Zehntausende von Jahren dauern).' },
      stopped: { kid: 'Die Kugel bleibt stehen.', sci: 'Rotation gestoppt.' },
      heatOff: { kid: 'Keine Wärme mehr: Das flüssige Eisen beruhigt sich, und das Feld verblasst.', sci: 'Wärmefluss unterbrochen: Die Konvektion hört auf, die Strömung kann die ohmschen Verluste nicht mehr ausgleichen, und das Feld klingt ab.' },
      cold: { kid: 'Die Wärme ist aus: Das flüssige Eisen wird ruhig.', sci: 'Kein Wärmefluss: keine Konvektion.' },
      grow: { kid: 'Schau! Aus der Kugel wachsen Feldlinien und laufen in Schleifen von Pol zu Pol, genau wie auf dem Bild. Bewegtes Metall erzeugt elektrische Ströme, und die Ströme machen den Magnetismus.', sci: 'Dynamowirkung: Der bewegte Leiter induziert Ströme, deren Feld die schraubenförmige Strömung dehnt und verdrillt und so verstärkt, bis die Lorentzkraft es bremst. Heraus kommt vor allem ein axialer Dipol.' },
      faded: { kid: 'Das Feld ist verblasst. Ein Dynamo braucht beides: die Drehung und die Wärme.', sci: 'Das Feld ist abgeklungen: Nötig sind Rotation und ein ausreichend starker Wärmefluss.' },
      flipNo: { kid: 'Noch gibt es kein Feld zum Umpolen. Dreh zuerst die Kugel und gib ihr Wärme.', sci: 'Kein Feld zum Umkehren: Bring zuerst den Dynamo zum Laufen.' },
      flip: { kid: 'Umpolen! Das Feld wird schwach und wackelig, während seine Pole über die Kugel wandern.', sci: 'Umkehrung: Der Dipol wird schwächer, und seine Achse schwenkt durch niedrige Breiten. Auf der Erde dauert ein Übergang einige Tausend Jahre.' },
      flippedR: { kid: 'Fertig: Jetzt zeigt das Feld andersherum, und ein Kompass würde nach Süden zeigen! Schau auf den Kompass in der Glaskugel.', sci: 'Umgekehrte Polarität: Die Feldlinien treten jetzt im Norden aus und im Süden ein. So war es auf der Erde bis vor etwa 780.000 Jahren.' },
      flippedN: { kid: 'Wieder zurück: Das Feld zeigt so, wie es heute zeigt.', sci: 'Wieder normale Polarität, wie im heutigen Brunhes-Chron.' },
    },
    panel: {
      kid: [
        'Tief unter unseren Füßen, etwa 2900 km hinab, liegt der äußere Kern: ein Ozean aus flüssigem Eisen. Wärme entweicht daraus in das Gestein darüber, also steigt heiße Flüssigkeit auf und kühlere sinkt ab. Und weil sich die Erde dreht, wird das bewegte Eisen zu wirbelnden Säulen verdreht.',
        'Bewegtes Metall erzeugt elektrische Ströme, und elektrische Ströme erzeugen Magnetismus. In den wirbelnden Säulen verstärken sich die Ströme immer wieder selbst: ein Dynamo. Nimm die Drehung oder die Wärme weg, und er hört auf. Hin und wieder polt sich das echte Feld sogar von selbst um; niemand zieht an einem Hebel!',
      ],
      sci: [
        'Der äußere Kern, in 2890 bis 5150 km Tiefe, ist eine flüssige Eisen-Nickel-Legierung mit einigen leichteren Elementen, die mit grob 10 bis 20 km pro Jahr strömt. Angetrieben wird die Konvektion von der Wärme, die den Kern verlässt, und vom langsamen Erstarren des inneren Kerns, das latente Wärme und leichte Elemente freisetzt. Die Rotation ordnet die Strömung zu Säulen entlang der Achse; ihre schraubenförmige Bewegung dehnt und verdrillt das Feld und erneuert es gegen den ohmschen Zerfall.',
        'Die Kugel ist ein Modell, und zwar ein beschleunigtes: Ein Labordynamo braucht viel schnell strömendes flüssiges Metall. Die ersten liefen 1999 in Riga und Karlsruhe, mit flüssigem Natrium, und das VKS-Experiment in Cadarache zeigte 2007 Umpolungen. Glatzmaier und Roberts simulierten 1995 eine spontane Umkehr eines Geodynamos. Sich selbst überlassen, würde der Dipol des Kerns in einigen Zehntausend Jahren abklingen.',
      ],
    },
  },
  ridge: {
    label: 'Der Meeresboden-Schreiber',
    title: 'Streifen auf dem Meeresboden',
    slider: 'Wie lange sich der Meeresboden spreizt',
    sliderUnit: '{t} Mio. Jahre',
    signs: {
      plaque: { kid: 'Der Meeresboden unter unserem Schiff', sci: 'Mittelatlantischer Rücken im Schnitt (Modell)' },
      west: 'Westen',
      east: 'Osten',
    },
    hints: {
      watch: 'Schau, wie sich der Meeresboden ausbreitet',
      again: 'Tippe auf den Rücken für einen neuen Meeresboden',
      full: 'Tippe auf den Bildschirm für den echten Meeresboden',
      erupt: 'Tippe auf den Rücken, um Lava herauszulassen',
      dynamo: 'Starte die Dynamokugel, dann tippe auf den Rücken',
      real: 'Tippe auf den Bildschirm für den echten Meeresboden',
      more: 'Tippe auf den Rücken, oder pole das Feld an der Kugel um',
    },
    buttons: { erupt: 'Lava herauslassen', flip: 'Feld umpolen', real: 'Der echte Meeresboden', clear: 'Neu anfangen' },
    says: {
      normal: { kid: 'Lava quillt am Rücken hervor und breitet sich nach beiden Seiten aus. Wenn sie unter etwa 580 °C abkühlt, frieren ihre winzigen Magnetitkörner die Richtung des Feldes ein: Norden, wie heute.', sci: 'Eine halbe Million Jahre mit etwa 1,25 cm pro Jahr zu jeder Seite: {km} km neuer Boden auf jeder Seite, normal magnetisiert beim Abkühlen unter die Curie-Temperatur des Magnetits (etwa 580 °C).' },
      reversed: { kid: 'Diese Lava kühlt im umgepolten Feld ab, also merkt sich ihr Magnetit einen Norden, der nach Süden zeigt: ein umgekehrter Streifen!', sci: 'Umgekehrte Polarität aufgezeichnet: {km} km Boden auf jeder Seite, mit einer Remanenz entgegen dem heutigen Feld.' },
      weak: { kid: 'Das Feld ist gerade zu schwach, also merkt sich die Lava fast nichts: ein grauer Streifen.', sci: 'Das Feld ist schwach (es wächst noch oder polt gerade um): Der Boden zeichnet wenig Remanenz auf.' },
      none: { kid: 'Die Lava kühlt ab, aber es gibt kein Feld, das sie sich merken könnte: graues Gestein. Starte die Dynamokugel (dreh sie und gib ihr Wärme), dann tippe wieder auf den Rücken.', sci: 'Kein Feld: Der Basalt kühlt ohne Remanenz ab. Bring zuerst die Dynamokugel zum Laufen.' },
      full: { kid: 'Fünf Millionen Jahre: Das Modell ist voll! Tippe auf den Bildschirm für den echten Meeresboden, oder noch einmal auf den Rücken für einen neuen.', sci: 'Das Modell umfasst 5 Millionen Jahre, 62,5 km auf jeder Seite. Tippe auf den Bildschirm für die beobachtete Abfolge, oder wieder auf den Rücken, um neu anzufangen.' },
      real: { kid: 'Das ist die echte Aufzeichnung der letzten fünf Millionen Jahre. Die Streifen sind auf beiden Seiten des Rückens gleich, wie im Spiegel! Der mittlere ist unsere Zeit: Das Feld zeigt nach Norden, seit es sich zuletzt umgepolt hat, vor etwa 780.000 Jahren.', sci: 'Die Polaritätszeitskala (GTS2020), ausgelegt mit 1,25 cm pro Jahr: Brunhes (normal, seit 0,773 Mio. Jahren), Matuyama mit den Subchrons Jaramillo und Olduvai, Gauss, Gilbert. Die Symmetrie zur Achse ist genau das, was Vine und Matthews und unabhängig Morley 1963 vorhergesagt haben.' },
      clear: { kid: 'Ein ganz neuer Meeresboden: Der Rücken fängt von vorn an.', sci: 'Aufzeichnung gelöscht.' },
    },
    screen: {
      title: 'Magnetometer',
      ridge: 'Rücken',
      west: 'Westen',
      east: 'Osten',
      empty: { kid: 'Tippe auf den Rücken: Hier kommt die Lava heraus', sci: 'Noch keine Aufzeichnung: Tippe auf den Rücken, um die Spreizung zu starten' },
      normal: 'normal',
      reversed: 'umgekehrt',
      none: 'kein Feld',
      time: 'Spreizung seit {t} Mio. Jahren',
      timeKid: '{t} Mio. Jahre',
    },
    panel: {
      kid: [
        'Mitten durch den Atlantik zieht sich ein Gebirge unter dem Meer, der Mittelatlantische Rücken. Dort reißt der Meeresboden auseinander, etwa so schnell, wie deine Fingernägel wachsen, und Lava quillt hervor, um die Lücke zu füllen. Wenn die Lava abkühlt, frieren winzige Magnetitkörner darin (wieder Eisen!) die Richtung des Erdfeldes ein, wie Kompasse, die für immer stehen geblieben sind.',
        'Der Meeresboden ist also wie ein Tonbandgerät. Jedes Mal, wenn sich das Feld umpolte, zeichnete das neue Gestein es andersherum auf. Schiffe, die Magnetometer schleppten, fanden die Streifen, auf beiden Seiten des Rückens gleich, wie im Spiegel. Das zeigte, dass sich der Meeresboden ausbreitet und dass sich das Feld umpolt.',
      ],
      sci: [
        'Am Mittelatlantischen Rücken entfernen sich die Platten insgesamt um etwa 2,5 cm pro Jahr. Neue basaltische Kruste erwirbt eine thermoremanente Magnetisierung, wenn sie unter die Curie-Temperatur ihres Titanomagnetits abkühlt (etwa 580 °C für reinen Magnetit), und zeichnet so die Polarität des Feldes auf. Ein weit hinter dem Schiff geschlepptes Magnetometer, fern von dessen Stahl, misst die Streifen als Anomalien über und unter dem regionalen Feld.',
        'Vine und Matthews (1963) und unabhängig Lawrence Morley erklärten die Streifen durch Spreizung plus Umpolungen; Profile quer über den Reykjanes-Rücken südlich von Island (Heirtzler, Le Pichon und Baron, 1966) zeigten die Symmetrie deutlich. Abgeglichen mit datierten Lavaströmen wurden die Streifen zur Polaritätszeitskala: Die letzte Umkehr, die Brunhes-Matuyama-Umkehr, war vor etwa 773.000 Jahren (GTS2020).',
      ],
    },
  },
  pole: {
    label: 'Der wandernde Pol',
    title: 'Der magnetische Nordpol geht spazieren',
    slider: 'Jahr',
    signs: {
      title: { kid: 'Wo ist der magnetische Nordpol?', sci: 'Nördlicher Inklinationspol, 1590 bis 2025 (NOAA)' },
    },
    hints: { play: 'Tippe auf die Karte, um die Jahre laufen zu lassen', pause: 'Tippe auf die Karte zum Anhalten' },
    buttons: { play: 'Abspielen oder anhalten', ross: '1831: Ross', fast: 'Um 2003: am schnellsten', now: 'Heute' },
    says: {
      play: { kid: 'Schau, wie der magnetische Nordpol wandert, von 1590 bis heute!', sci: 'Modellierte Positionen des nördlichen Inklinationspols, 1590 bis 2025 (NOAA NCEI).' },
      pause: { kid: 'Angehalten.', sci: 'Angehalten.' },
      ross: { kid: '1831: Der Entdecker James Clark Ross erreichte den magnetischen Nordpol im Norden Kanadas, wo seine Nadel genau nach unten zeigte.', sci: '1. Juni 1831: James Clark Ross bestimmte den magnetischen Nordpol auf der Boothia-Halbinsel und maß eine Inklination von 89° 59′.' },
      fast: { kid: 'Um das Jahr 2000 wurde er schneller: etwa {v} km pro Jahr, auf und davon Richtung Sibirien!', sci: 'Um 2000 beschleunigte der Pol auf etwa {v} km pro Jahr, Richtung Nordnordwest quer über den Arktischen Ozean.' },
      now: { kid: 'Heute ist er nahe der Mitte des Arktischen Ozeans und wird langsamer: etwa {v} km pro Jahr.', sci: '2025: etwa 86° N, 138° O, mit etwa {v} km pro Jahr unterwegs und langsamer werdend.' },
    },
    chart: {
      canada: 'Kanada',
      greenland: 'Grönland',
      siberia: 'Sibirien',
      alaska: 'Alaska',
      geo: 'Nordpol',
      ross: 'Ross 1831',
      speed: { kid: '{v} km pro Jahr', sci: 'Tempo: {v} km/Jahr' },
    },
    panel: {
      kid: [
        'Der magnetische Nordpol ist der Ort, an dem eine Nadel, die sich neigen kann, genau nach unten zeigt. Er liegt nicht dort, wo die Erdachse ist (der Nordpol, der Stern in der Mitte), und er bleibt nicht stehen: Das wirbelnde Eisen im Kern verändert ständig das Feld.',
        'Jahrhundertelang wanderte er im Norden Kanadas umher. Seit etwa 1900 zieht er nach Norden, und um das Jahr 2000 raste er mit mehr als 50 km pro Jahr über den Arktischen Ozean Richtung Sibirien. Jetzt wird er langsamer. Deshalb geben Seekarten die Kompasskorrektur mit einem Datum an.',
      ],
      sci: [
        'Der nördliche Inklinationspol ist der Ort, an dem das Feld senkrecht steht. Die gezeigten Positionen sind der modellierte nördliche Inklinationspol der NOAA NCEI, iterativ aus allen Gauß-Koeffizienten globaler Feldmodelle bestimmt (für die frühen Jahrhunderte aus Modellen, die vor allem auf Schiffslogbüchern beruhen), und unterscheiden sich daher vom geomagnetischen (Dipol-)Pol.',
        'James Clark Ross erreichte ihn am 1. Juni 1831 auf der Boothia-Halbinsel. Den größten Teil des 20. Jahrhunderts wanderte er etwa 10 km pro Jahr, beschleunigte Anfang der 2000er-Jahre auf etwa 55 km pro Jahr, überquerte 2017 die Datumsgrenze und war 2025 mit etwa 37 km pro Jahr unterwegs. Die Änderungen stammen von der Strömung an der Oberseite des äußeren Kerns.',
      ],
    },
  },
}

export const COMPASS_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
