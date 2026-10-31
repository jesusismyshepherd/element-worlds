// The words of hydrogen's radio room ("How would you write to aliens?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/H.js (the easel shows it); the room adds the things to do.
// Sources (checked 2026-10-31): Wikipedia "Hydrogen line" (1420.405751768 MHz, 21.106 cm, a mean lifetime of
// about 11 million years; van de Hulst 1944; Ewen and Purcell 1951, confirmed by Muller and Oort and by
// Christiansen and Hindman); NRAO and Harvard on 25 March 1951 and the Nature papers of September 1951; the
// Rijksmonument register no. 530829 (Dwingeloo: 25 m, 3.25 m deep, the turning control house behind the
// reflector, the rail, 17 April 1956, Queen Juliana, then the largest radio telescope in the world);
// Wikipedia "Dwingeloo Radio Observatory" (overtaken by the 76 m Lovell Telescope in 1957); Wikipedia "Pioneer
// plaque" (the units 21 cm and 0.7 ns, the woman binary 8, about 168 cm, 15 lines and 14 pulsars, the
// planets' binary distances in tenths of Mercury's, the plaque's size and metal, Sagan, Drake, Linda Salzman
// Sagan, launches 2 March 1972 and 5 April 1973 local time, the struts shielding it from dust, Pioneer 11's
// later path to Saturn). Pioneer 11 was last heard in 1995 and Pioneer 10 in 2003 (NASA). The Milky Way's
// atomic hydrogen, several billion solar masses: about 10^67 atoms. The first spiral map: Oort, Kerr and
// Westerhout, 1958 (Leiden and Sydney surveys; nearly circular arms, blank wedges).

// Polish plurals: 1 rok, 2 lata, 5 lat (12 to 14 are "many")
const plPlural = (v, one, few, many) => {
  if (!Number.isInteger(v)) return few
  if (v === 1) return one
  const d = v % 10
  const h = v % 100
  return d >= 2 && d <= 4 && !(h >= 12 && h <= 14) ? few : many
}

const EN = {
  title: 'Listening to hydrogen',
  greet: {
    kid: 'Hello! I am hydrogen. We are inside the picture, on a heath in the Netherlands at night! That giant dish is the Dwingeloo radio telescope, and it listens to a whisper that I send out. Tap the dish to map our galaxy, flip my electron on the right, and read the golden letter to aliens on the left. The picture’s story is on the easel.',
    sci: 'Hello! I am hydrogen. This is the Dwingeloo radio telescope in Drenthe: 25 m across, opened in 1956 and then the largest radio telescope in the world. Ahead, its receiver and a map of the Milky Way’s atomic hydrogen; on the right, the spin flip behind the 21 cm line; on the left, the Pioneer plaque, which uses that line as its unit. The picture’s story is on the easel.',
  },
  talk: {
    kid: [
      'Radio waves pass straight through the dust between the stars, so a radio telescope can hear clouds that no ordinary telescope can see.',
      'My whisper is a radio wave 21 centimetres long: about as wide as a sheet of paper.',
      'That dish is as wide as two buses are long, and the whole telescope turns round on a rail in a circle.',
    ],
    sci: [
      'The 21 cm line is a hyperfine transition: with the electron’s and the proton’s spins parallel, the atom has 5.9 µeV more energy than with them antiparallel; the flip gives a photon of 1420.405751768 MHz.',
      'Interstellar dust absorbs visible light but hardly touches 21 cm waves, so the line reaches us from atomic hydrogen right across the Galactic disc.',
      'Dwingeloo’s dish is 25 m across and 3.25 m deep, hung from a steel truss 15 m high; the whole telescope turns on four wheels on a circular rail, the control house in its base always behind the reflector.',
    ],
  },
  map: {
    label: 'The radio telescope',
    title: 'Map the Milky Way',
    slider: 'Where the dish points (galactic longitude)',
    sydney: 'Charts from Sydney',
    centre: 'Centre',
    never: 'Never rises over the Netherlands',
    sun: { kid: 'Sun (us)', sci: 'Sun' },
    screen: {
      title: { kid: 'The hydrogen whisper from here', sci: '21 cm line profile' },
      part: 'Stretch {n} of {of}',
      kms: 'km/s',
      toward: 'coming closer',
      away: 'going away',
      still: 'standing still',
      done: 'Stretches heard: {n} of {of}',
      south: 'Sydney’s charts in',
    },
    hints: {
      sweep: 'Tap the dish to listen to the next stretch',
      busy: 'Watch the screen and the map',
      south: 'Tap the charts from Sydney',
      done: 'Tap the dish, the screen or the map',
    },
    buttons: { sweep: 'Listen to the next stretch', south: 'Add the charts from Sydney', clear: 'Clear the map' },
    says: {
      first: {
        kid: 'Off it goes! First the sky turns until that part of the Milky Way is high up, then the dish follows it. Watch the screen: every bump is a cloud of hydrogen.',
        sci: 'The sky turns to the stretch’s sidereal time, then the dish tracks along the Galactic plane from l = 10° to 50°. Each peak in the profile is gas at its own radial velocity.',
      },
      sweep: {
        kid: 'Next stretch! The Earth turns the sky round for us, and the dish listens on.',
        sci: 'Next stretch: the sky turns to its sidereal time and the dish scans along the plane.',
      },
      firstDone: {
        kid: 'See the dots on the map? Each bump on the screen is a cloud moving at its own speed, and from that speed we can work out how far away it is. Tap the dish again!',
        sci: 'The Galaxy’s rotation turns each radial velocity into a distance along the line of sight: that is how the clouds land on the map.',
      },
      more: {
        kid: 'More clouds on the map! Can you see them lining up into curved arms?',
        sci: 'The clouds line up along arcs: the spiral arms.',
      },
      wedge: {
        kid: 'Did you see? Straight away from the middle of the galaxy, the clouds move sideways, not toward us or away from us, so their speeds cannot tell how far they are. That is why the map has a gap there.',
        sci: 'Near l = 180° (and l = 0°) the gas moves across the line of sight: radial velocities near zero give no distances. Hence the blank wedges, as on the maps of the 1950s.',
      },
      allDutch: {
        kid: 'That is all of the Milky Way the Netherlands can see! The rest never rises over the Dutch horizon. Tap the charts from Sydney: astronomers in Australia listened to the southern sky.',
        sci: 'From 52.8° N, longitudes from about 255° to 350° never rise. Tap the Sydney charts: the southern half came from Australian surveys.',
      },
      south: {
        kid: 'Charts from Sydney! On the other side of the world, astronomers listened to the part of the sky we cannot see from here.',
        sci: 'The southern Milky Way, from Australian 21 cm surveys. The first map of the spiral arms (Oort, Kerr and Westerhout, 1958) joined the Dutch and the Australian halves.',
      },
      southIn: {
        kid: 'The southern part is on the map. Now listen to the rest of the northern sky with the dish!',
        sci: 'The southern data are in; the northern stretches are still to scan.',
      },
      southDone: { kid: 'Sydney’s charts are already on the map.', sci: 'The southern data are already in.' },
      complete: {
        kid: 'Look at the map: our galaxy’s spiral arms, drawn by hydrogen’s whisper! The gold ring is us.',
        sci: 'The map is complete: spiral arms traced in atomic hydrogen, with blank wedges toward the centre and the anticentre. Clear it in the panel to scan again.',
      },
      clear: { kid: 'The map is empty again. Tap the dish to start listening!', sci: 'Map cleared.' },
      screen: {
        kid: 'Each bump is hydrogen moving at its own speed: on the left, clouds coming closer; on the right, clouds going away. Different speeds, different arms!',
        sci: 'The Doppler shift: each peak is gas at one radial velocity; a shift of 1 MHz is about 211 km/s. The rotation curve turns velocities into distances.',
      },
      map: {
        kid: 'This is our galaxy seen from above. The gold ring is the Sun, with us. Every dot is a cloud of hydrogen the dish heard.',
        sci: 'Seen from the north Galactic pole, the Galaxy turning clockwise; the Sun 8.2 kpc (about 27,000 light-years) from the centre. Every dot is gas placed by its velocity.',
      },
      mapEmpty: { kid: 'The map is still empty. Tap the dish to start listening!', sci: 'No data yet: scan with the dish.' },
    },
    panel: {
      kid: [
        'Clouds of hydrogen fill the space between the stars. They whisper in radio, and radio waves pass straight through the dust that hides so many stars from us. Every cloud travels round the middle of the galaxy, so some come closer and some go away, and that shifts their whisper a tiny bit: the screen shows each cloud as its own bump.',
        'Because we know how the galaxy turns, each speed tells how far away a cloud is. Put all the clouds on the map and the spiral arms appear! In the 1950s, Dutch and Australian astronomers drew the first map of our galaxy’s arms this way. Tap the dish, or point it yourself with the slider.',
      ],
      sci: [
        'Each parcel of gas orbits the Galactic centre; along a line of sight at longitude l its radial velocity is v = (Θ(R)·R₀/R − Θ₀)·sin l. With a known rotation curve each velocity gives a galactocentric radius, and so a distance (or two in the inner Galaxy: the near-far ambiguity). Near l = 0° and 180° the velocities are close to zero and give no distances.',
        'The model here: a flat rotation, Θ₀ = 230 km/s, the Sun 8.2 kpc from the centre, four trailing arms with a pitch of 12° and the Local arm; the dots show the gas where its velocities would place it. The first maps (Oort, Kerr and Westerhout, 1958, from the Leiden and Sydney surveys) suffered real distance errors: their arms came out nearly circular. Dwingeloo (25 m, 1956) was the largest radio telescope in the world until the 76 m dish at Jodrell Bank in 1957.',
      ],
    },
  },
  flip: {
    label: 'The spin flip',
    title: 'Hydrogen’s 21 cm whisper',
    slider: 'How many atoms',
    oneAtom: 'one atom',
    proton: 'proton',
    electron: 'electron',
    ruler: '21 cm',
    a4: 'A4 paper: 21 cm wide',
    time: (v, t, unit) =>
      ({
        Myr: `${t} million years`,
        kyr: `${t} thousand years`,
        yr: `${t} ${v === 1 ? 'year' : 'years'}`,
        d: `${t} ${v === 1 ? 'day' : 'days'}`,
        h: `${t} ${v === 1 ? 'hour' : 'hours'}`,
        min: `${t} ${v === 1 ? 'minute' : 'minutes'}`,
        s: `${t} ${v === 1 ? 'second' : 'seconds'}`,
      })[unit],
    buttons: { flip: 'Tap the electron', one: 'One atom', cloud: 'A cloud', galaxy: 'The Milky Way' },
    hints: {
      flip: 'Tap the electron and wait for its flip',
      bump: 'Tap the electron to bump it back',
      waiting: 'Watch the years go by',
      watch: 'Watch the wave',
    },
    board: {
      same: { kid: 'Both arrows up: ready to flip', sci: 'Spins parallel (F = 1)' },
      opposite: { kid: 'Arrows opposite: whisper sent', sci: 'Spins antiparallel (F = 0)' },
      waiting: 'Waiting for the flip:',
      waited: 'This atom waited:',
      mean: 'A lone atom waits, on average:',
      atoms: 'Atoms:',
      one: 'one',
      galaxy: 'the Milky Way',
      cloud: 'a cloud between the stars',
      flips: 'Flips:',
      every: 'one every {t}',
      perSecond: 'every second',
    },
    says: {
      wait: {
        kid: 'Now we wait... An atom on its own waits millions of years for this. Watch the counter!',
        sci: 'Spontaneous emission: the wait is random, exponentially distributed, with a mean of 1/A, about 11 million years (A = 2.9 × 10⁻¹⁵ s⁻¹).',
      },
      flipped: {
        kid: 'Flip! The electron turned upside down and a radio wave flew out. This time it took {t}. Look at the ruler: one wave is 21 centimetres, as wide as a sheet of paper.',
        sci: 'F = 1 to F = 0: a photon of 1420.406 MHz, λ = 21.106 cm, after {t} (this draw). The atom is now in its lowest state.',
      },
      bump: {
        kid: 'Bonk! Another atom bumped into it and flipped the electron back up, ready to whisper again. In a cloud, bumps happen far more often than flips.',
        sci: 'Collisions refill the upper level far faster than spontaneous decay empties it, so about three quarters of the atoms are in F = 1 at any time (statistical weights 3:1).',
      },
      one: {
        kid: 'One atom alone: one whisper in about 11 million years. The radio hears nothing.',
        sci: 'N = 1: on average one photon per 11 million years.',
      },
      cloud: {
        kid: 'A cloud between the stars holds about 10⁶⁰ atoms: so many flips every second that the radio hears a steady hiss!',
        sci: '10⁶⁰ atoms (about 800 solar masses of hydrogen): with three quarters in F = 1, about 2 × 10⁴⁵ photons per second.',
      },
      galaxy: {
        kid: 'All the hydrogen gas in the Milky Way: about 10⁶⁷ atoms. Together they whisper so loudly that radio telescopes hear them all along the Milky Way.',
        sci: 'About 10⁶⁷ atoms, several billion solar masses of atomic gas: about 2 × 10⁵² photons per second.',
      },
      ruler: {
        kid: 'This ruler is 21 centimetres long: exactly one of hydrogen’s waves. A sheet of A4 paper is 21 centimetres wide too!',
        sci: 'λ = c/ν = 21.106 cm; an A4 sheet is 21.0 cm wide.',
      },
      radioLoud: {
        kid: 'Hear it? The radio’s green magic eye is wide open: trillions upon trillions of atoms are whispering at once.',
        sci: 'The magic eye (a 1950s tuning indicator tube) closes its shadow as the signal grows: the summed emission of many atoms.',
      },
      radioQuiet: {
        kid: 'Silence. One atom whispers far too rarely to hear. Slide in more atoms!',
        sci: 'Too few atoms: the expected rate of photons is negligible.',
      },
    },
    panel: {
      kid: [
        'A hydrogen atom is one proton with one electron. Both spin like tiny tops, and each is a tiny magnet. When their arrows point the same way, the atom holds a tiny bit of extra energy. Very rarely the electron flips over, and that extra energy flies away as a radio wave exactly 21 centimetres long.',
        'One atom waits about 11 million years for that flip! But space is full of hydrogen, so all together the atoms whisper loudly. Hendrik van de Hulst worked this out in 1944, and in 1951 Harold Ewen and Edward Purcell heard it for the first time, at Harvard.',
      ],
      sci: [
        'The ground state of hydrogen (1s) is split by the hyperfine interaction between the electron’s and the proton’s magnetic moments: F = 1 (spins parallel) lies 5.87 µeV above F = 0 (antiparallel). The transition is magnetic dipole and strongly forbidden: A = 2.88 × 10⁻¹⁵ s⁻¹, a mean lifetime of about 11 million years; ν = 1420.405751768 MHz, λ = 21.106 cm.',
        'In interstellar gas collisions set the populations (3:1 by statistical weight, since hν/k is only 0.068 K), so the emission grows with the column of atoms. Predicted by van de Hulst in 1944; detected by Ewen and Purcell at Harvard on 25 March 1951 and confirmed the same year by Muller and Oort in the Netherlands and by Christiansen and Hindman in Australia; the papers appeared together in Nature in September 1951.',
      ],
    },
  },
  plaque: {
    label: 'The Pioneer plaque',
    title: 'A letter to aliens',
    slider: 'Your height',
    caption: 'The Pioneer plaque, 1972 (a giant copy)',
    postTitle: 'Your height in hydrogen waves',
    unit: { kid: '1 = 21 cm', sci: '1 = 21 cm and 0.7 ns' },
    eight: '8 × 21 cm = 168 cm',
    reading: { kid: '{cm} cm: {u} waves, {bin} in binary', sci: '{cm} cm = {u} units, binary {bin}' },
    buttons: { h: 'The hydrogen symbol', woman: 'The woman', pulsars: 'The star of lines', planets: 'The planets', post: 'Measure me' },
    hints: {
      h: 'Tap the hydrogen symbol at the top left',
      woman: 'Tap the woman',
      pulsars: 'Tap the star of lines',
      planets: 'Tap the row of planets',
      post: 'Tap the measuring post',
      again: 'Tap the post or any part of the plaque',
      watch: 'Watch the plaque',
    },
    says: {
      h: {
        kid: 'These two circles are two hydrogen atoms, before and after the flip. The little line under them means 1: one hydrogen wave, 21 centimetres. That is the plaque’s ruler, and any scientist anywhere would know it!',
        sci: 'The hyperfine transition of neutral hydrogen; the stroke below is binary 1, which sets the units: a length of 21 cm and a time of 1/(1420 MHz), about 0.7 ns. Every number on the plaque counts in them.',
      },
      woman: {
        kid: 'Beside the woman is a number in binary: 1000, which is 8. Eight hydrogen waves: 8 × 21 cm = 168 cm. So whoever finds it can work out how tall we are!',
        sci: 'The bracket reads |−−−, binary 1000 = 8 units: 8 × 21 cm ≈ 168 cm. The spacecraft’s outline behind the figures, drawn to the same scale, gives a second check.',
      },
      pulsars: {
        kid: 'This star of lines is a map of where we live. Fourteen lines point to pulsars: dead stars that spin and blink like lighthouses, each to its own beat. The long line points to the middle of our galaxy.',
        sci: '15 lines from the Sun: 14 to pulsars, their lengths the relative distances, their binary ticks the periods in units of 0.7 ns; the long one runs to the Galactic centre. Pulsars slow down at known rates, so the periods also date the launch.',
      },
      planets: {
        kid: 'The Sun and its planets in a row. The little ship starts from the third planet, our Earth, swings past Jupiter, the biggest, and heads out into space.',
        sci: 'The Solar System, with binary distances in tenths of Mercury’s orbit; the path leaves the third planet and passes Jupiter. Pioneer 11 was later sent on to Saturn, so its copy’s path is wrong.',
      },
      post: {
        kid: 'You are {cm} cm tall: that is about {u} hydrogen waves. Rounded, {n}, which in binary is {bin}. Now you could be drawn on a plaque too!',
        sci: '{cm} cm = {u} units of 21.106 cm; rounded, {n}, or {bin} in binary, as the plaque would write it.',
      },
      where: {
        kid: 'Try the hydrogen symbol at the top left, the woman, the star of lines or the planets at the bottom.',
        sci: 'Tap a part: the hyperfine symbol, the figures, the pulsar map or the Solar System.',
      },
    },
    panel: {
      kid: [
        'In 1972 and 1973 two space probes, Pioneer 10 and Pioneer 11, were sent past Jupiter and on, out of the solar system. Each carries a golden plaque: a letter for anyone who might find it one day, far in the future. How do you write to someone who knows none of our words or numbers? With something they must know too: hydrogen!',
        'Every hydrogen atom in the universe whispers the same 21 cm wave, so the plaque uses it as its ruler and its clock. The woman is 8 of those waves tall. Carl Sagan and Frank Drake designed the plaque, and Linda Salzman Sagan drew it. Measure yourself in hydrogen waves at the post!',
      ],
      sci: [
        'The plaques, about 229 by 152 mm of gold-anodised aluminium, are fixed to the antenna struts of Pioneer 10 (launched in March 1972) and Pioneer 11 (April 1973), where they are shielded from interstellar dust. Designed by Carl Sagan and Frank Drake and drawn by Linda Salzman Sagan, they set their units by the hydrogen hyperfine transition: 21 cm and about 0.7 ns.',
        'In those units the binary numbers give the woman’s height (8 units, about 168 cm), the pulsars’ periods and the planets’ distances. Pioneer 11 was last heard in 1995 and Pioneer 10 in 2003; both coast on out among the stars. The copy here is simplified: its pulsar lines and numbers are not the real ones.',
      ],
    },
  },
}

const PT = {
  title: 'A ouvir o hidrogénio',
  greet: {
    kid: 'Olá! Eu sou o hidrogénio. Estamos dentro da imagem, numa charneca dos Países Baixos, à noite! Aquele prato gigante é o radiotelescópio de Dwingeloo, e escuta um sussurro que eu envio. Toca no prato para fazer o mapa da nossa galáxia, vira o meu eletrão à direita e lê a carta dourada para extraterrestres à esquerda. A história da imagem está no cavalete.',
    sci: 'Olá! Eu sou o hidrogénio. Este é o radiotelescópio de Dwingeloo, em Drenthe: 25 m de diâmetro, inaugurado em 1956 e então o maior radiotelescópio do mundo. À frente, o seu recetor e um mapa do hidrogénio atómico da Via Láctea; à direita, a inversão de spin por trás da risca dos 21 cm; à esquerda, a placa das Pioneer, que usa essa risca como unidade. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'As ondas de rádio atravessam a poeira entre as estrelas, por isso um radiotelescópio consegue ouvir nuvens que nenhum telescópio normal consegue ver.',
      'O meu sussurro é uma onda de rádio com 21 centímetros: mais ou menos a largura de uma folha de papel.',
      'Aquele prato é tão largo como dois autocarros em comprimento, e o telescópio inteiro gira sobre um carril em círculo.',
    ],
    sci: [
      'A risca dos 21 cm é uma transição hiperfina: com os spins do eletrão e do protão paralelos, o átomo tem mais 5,9 µeV de energia do que com eles antiparalelos; a inversão dá um fotão de 1420,405751768 MHz.',
      'A poeira interestelar absorve a luz visível mas quase não afeta as ondas de 21 cm, por isso a risca chega-nos do hidrogénio atómico de todo o disco galáctico.',
      'O prato de Dwingeloo tem 25 m de diâmetro e 3,25 m de fundo, suspenso numa treliça de aço com 15 m de altura; o telescópio inteiro gira sobre quatro rodas num carril circular, e a casa de comando na sua base fica sempre atrás do refletor.',
    ],
  },
  map: {
    label: 'O radiotelescópio',
    title: 'Faz o mapa da Via Láctea',
    slider: 'Para onde aponta o prato (longitude galáctica)',
    sydney: 'Mapas de Sydney',
    centre: 'Centro',
    never: 'Nunca nasce sobre os Países Baixos',
    sun: { kid: 'Sol (nós)', sci: 'Sol' },
    screen: {
      title: { kid: 'O sussurro do hidrogénio daqui', sci: 'Perfil da risca dos 21 cm' },
      part: 'Troço {n} de {of}',
      kms: 'km/s',
      toward: 'a aproximar-se',
      away: 'a afastar-se',
      still: 'parado',
      done: 'Troços ouvidos: {n} de {of}',
      south: 'mapas de Sydney incluídos',
    },
    hints: {
      sweep: 'Toca no prato para ouvir o troço seguinte',
      busy: 'Observa o ecrã e o mapa',
      south: 'Toca nos mapas de Sydney',
      done: 'Toca no prato, no ecrã ou no mapa',
    },
    buttons: { sweep: 'Ouvir o troço seguinte', south: 'Juntar os mapas de Sydney', clear: 'Limpar o mapa' },
    says: {
      first: {
        kid: 'Lá vai! Primeiro o céu roda até essa parte da Via Láctea estar bem alta, depois o prato segue-a. Observa o ecrã: cada bossa é uma nuvem de hidrogénio.',
        sci: 'O céu roda até ao tempo sideral do troço, depois o prato segue o plano galáctico de l = 10° a 50°. Cada pico do perfil é gás com a sua própria velocidade radial.',
      },
      sweep: {
        kid: 'Troço seguinte! A Terra roda o céu por nós, e o prato continua a ouvir.',
        sci: 'Troço seguinte: o céu roda até ao seu tempo sideral e o prato varre o plano.',
      },
      firstDone: {
        kid: 'Vês os pontos no mapa? Cada bossa no ecrã é uma nuvem a mover-se à sua própria velocidade, e com essa velocidade conseguimos saber a que distância está. Toca outra vez no prato!',
        sci: 'A rotação da Galáxia transforma cada velocidade radial numa distância ao longo da linha de visão: é assim que as nuvens vão parar ao mapa.',
      },
      more: {
        kid: 'Mais nuvens no mapa! Consegues vê-las a alinharem-se em braços curvos?',
        sci: 'As nuvens alinham-se em arcos: os braços em espiral.',
      },
      wedge: {
        kid: 'Viste? Na direção contrária ao meio da galáxia, as nuvens movem-se de lado, nem para nós nem para longe de nós, por isso a velocidade não diz a que distância estão. É por isso que o mapa tem ali um buraco.',
        sci: 'Perto de l = 180° (e de l = 0°) o gás move-se de través à linha de visão: velocidades radiais perto de zero não dão distâncias. Daí as cunhas vazias, como nos mapas dos anos 1950.',
      },
      allDutch: {
        kid: 'É toda a Via Láctea que os Países Baixos conseguem ver! O resto nunca nasce no horizonte neerlandês. Toca nos mapas de Sydney: astrónomos na Austrália ouviram o céu do sul.',
        sci: 'A 52,8° N, as longitudes de cerca de 255° a 350° nunca nascem. Toca nos mapas de Sydney: a metade sul veio de levantamentos australianos.',
      },
      south: {
        kid: 'Mapas de Sydney! Do outro lado do mundo, astrónomos ouviram a parte do céu que daqui não conseguimos ver.',
        sci: 'A Via Láctea do sul, de levantamentos australianos a 21 cm. O primeiro mapa dos braços em espiral (Oort, Kerr e Westerhout, 1958) juntou as metades neerlandesa e australiana.',
      },
      southIn: {
        kid: 'A parte sul já está no mapa. Agora ouve o resto do céu do norte com o prato!',
        sci: 'Os dados do sul estão incluídos; faltam varrer os troços do norte.',
      },
      southDone: { kid: 'Os mapas de Sydney já estão no mapa.', sci: 'Os dados do sul já estão incluídos.' },
      complete: {
        kid: 'Olha para o mapa: os braços em espiral da nossa galáxia, desenhados pelo sussurro do hidrogénio! O anel dourado somos nós.',
        sci: 'O mapa está completo: braços em espiral traçados em hidrogénio atómico, com cunhas vazias na direção do centro e do anticentro. Limpa-o no painel para voltar a varrer.',
      },
      clear: { kid: 'O mapa está vazio outra vez. Toca no prato para começar a ouvir!', sci: 'Mapa limpo.' },
      screen: {
        kid: 'Cada bossa é hidrogénio a mover-se à sua própria velocidade: à esquerda, nuvens a aproximar-se; à direita, nuvens a afastar-se. Velocidades diferentes, braços diferentes!',
        sci: 'O desvio de Doppler: cada pico é gás com uma velocidade radial; um desvio de 1 MHz corresponde a cerca de 211 km/s. A curva de rotação transforma velocidades em distâncias.',
      },
      map: {
        kid: 'Esta é a nossa galáxia vista de cima. O anel dourado é o Sol, connosco. Cada ponto é uma nuvem de hidrogénio que o prato ouviu.',
        sci: 'Vista do polo norte galáctico, a Galáxia a rodar no sentido dos ponteiros do relógio; o Sol a 8,2 kpc (cerca de 27 000 anos-luz) do centro. Cada ponto é gás colocado pela sua velocidade.',
      },
      mapEmpty: { kid: 'O mapa ainda está vazio. Toca no prato para começar a ouvir!', sci: 'Ainda sem dados: varre com o prato.' },
    },
    panel: {
      kid: [
        'Nuvens de hidrogénio enchem o espaço entre as estrelas. Sussurram em rádio, e as ondas de rádio atravessam a poeira que nos esconde tantas estrelas. Cada nuvem anda à volta do meio da galáxia, por isso umas aproximam-se e outras afastam-se, e isso muda um bocadinho o seu sussurro: o ecrã mostra cada nuvem como uma bossa.',
        'Como sabemos como a galáxia roda, cada velocidade diz a que distância está uma nuvem. Põe todas as nuvens no mapa e aparecem os braços em espiral! Nos anos 1950, astrónomos neerlandeses e australianos desenharam assim o primeiro mapa dos braços da nossa galáxia. Toca no prato, ou aponta-o tu com o cursor.',
      ],
      sci: [
        'Cada porção de gás orbita o centro galáctico; ao longo de uma linha de visão com longitude l, a sua velocidade radial é v = (Θ(R)·R₀/R − Θ₀)·sen l. Com uma curva de rotação conhecida, cada velocidade dá um raio galactocêntrico e daí uma distância (ou duas na Galáxia interior: a ambiguidade perto-longe). Perto de l = 0° e 180° as velocidades são quase nulas e não dão distâncias.',
        'O modelo aqui: rotação plana, Θ₀ = 230 km/s, o Sol a 8,2 kpc do centro, quatro braços arrastados com um ângulo de abertura de 12° e o braço Local; os pontos mostram o gás onde as suas velocidades o colocariam. Os primeiros mapas (Oort, Kerr e Westerhout, 1958, dos levantamentos de Leiden e de Sydney) tinham erros reais de distância: os braços saíram quase circulares. Dwingeloo (25 m, 1956) foi o maior radiotelescópio do mundo até ao prato de 76 m de Jodrell Bank, em 1957.',
      ],
    },
  },
  flip: {
    label: 'A inversão de spin',
    title: 'O sussurro de 21 cm do hidrogénio',
    slider: 'Quantos átomos',
    oneAtom: 'um átomo',
    proton: 'protão',
    electron: 'eletrão',
    ruler: '21 cm',
    a4: 'Papel A4: 21 cm de largura',
    time: (v, t, unit) =>
      ({
        Myr: `${t} milhões de anos`,
        kyr: `${t} mil anos`,
        yr: `${t} ${v === 1 ? 'ano' : 'anos'}`,
        d: `${t} ${v === 1 ? 'dia' : 'dias'}`,
        h: `${t} ${v === 1 ? 'hora' : 'horas'}`,
        min: `${t} ${v === 1 ? 'minuto' : 'minutos'}`,
        s: `${t} ${v === 1 ? 'segundo' : 'segundos'}`,
      })[unit],
    buttons: { flip: 'Tocar no eletrão', one: 'Um átomo', cloud: 'Uma nuvem', galaxy: 'A Via Láctea' },
    hints: {
      flip: 'Toca no eletrão e espera pela inversão',
      bump: 'Toca no eletrão para o empurrar de volta',
      waiting: 'Vê os anos a passar',
      watch: 'Observa a onda',
    },
    board: {
      same: { kid: 'As duas setas para cima: pronto a virar', sci: 'Spins paralelos (F = 1)' },
      opposite: { kid: 'Setas opostas: sussurro enviado', sci: 'Spins antiparalelos (F = 0)' },
      waiting: 'À espera da inversão:',
      waited: 'Este átomo esperou:',
      mean: 'Um átomo sozinho espera, em média:',
      atoms: 'Átomos:',
      one: 'um',
      galaxy: 'a Via Láctea',
      cloud: 'uma nuvem entre as estrelas',
      flips: 'Inversões:',
      every: 'uma a cada {t}',
      perSecond: 'por segundo',
    },
    says: {
      wait: {
        kid: 'Agora esperamos... Um átomo sozinho espera milhões de anos por isto. Olha para o contador!',
        sci: 'Emissão espontânea: a espera é aleatória, com distribuição exponencial, de média 1/A, cerca de 11 milhões de anos (A = 2,9 × 10⁻¹⁵ s⁻¹).',
      },
      flipped: {
        kid: 'Virou! O eletrão ficou de pernas para o ar e saiu uma onda de rádio. Desta vez demorou {t}. Olha para a régua: uma onda tem 21 centímetros, a largura de uma folha de papel.',
        sci: 'De F = 1 para F = 0: um fotão de 1420,406 MHz, λ = 21,106 cm, ao fim de {t} (este sorteio). O átomo está agora no seu estado mais baixo.',
      },
      bump: {
        kid: 'Pumba! Outro átomo chocou com ele e voltou a pôr o eletrão para cima, pronto para sussurrar outra vez. Numa nuvem, os choques acontecem muito mais vezes do que as inversões.',
        sci: 'As colisões voltam a encher o nível superior muito mais depressa do que o decaimento espontâneo o esvazia, por isso cerca de três quartos dos átomos estão em F = 1 a cada momento (pesos estatísticos 3:1).',
      },
      one: {
        kid: 'Um átomo sozinho: um sussurro em cerca de 11 milhões de anos. O rádio não ouve nada.',
        sci: 'N = 1: em média, um fotão a cada 11 milhões de anos.',
      },
      cloud: {
        kid: 'Uma nuvem entre as estrelas tem cerca de 10⁶⁰ átomos: tantas inversões por segundo que o rádio ouve um chiado constante!',
        sci: '10⁶⁰ átomos (cerca de 800 massas solares de hidrogénio): com três quartos em F = 1, cerca de 2 × 10⁴⁵ fotões por segundo.',
      },
      galaxy: {
        kid: 'Todo o hidrogénio gasoso da Via Láctea: cerca de 10⁶⁷ átomos. Juntos sussurram tão alto que os radiotelescópios os ouvem ao longo de toda a Via Láctea.',
        sci: 'Cerca de 10⁶⁷ átomos, vários milhares de milhões de massas solares de gás atómico: cerca de 2 × 10⁵² fotões por segundo.',
      },
      ruler: {
        kid: 'Esta régua tem 21 centímetros: exatamente uma onda do hidrogénio. Uma folha de papel A4 também tem 21 centímetros de largura!',
        sci: 'λ = c/ν = 21,106 cm; uma folha A4 tem 21,0 cm de largura.',
      },
      radioLoud: {
        kid: 'Ouves? O olho mágico verde do rádio está todo aberto: biliões e biliões de átomos estão a sussurrar ao mesmo tempo.',
        sci: 'O olho mágico (uma válvula indicadora de sintonia dos anos 1950) fecha a sombra à medida que o sinal cresce: a emissão somada de muitos átomos.',
      },
      radioQuiet: {
        kid: 'Silêncio. Um átomo sozinho sussurra raramente demais para se ouvir. Junta mais átomos com o cursor!',
        sci: 'Átomos a menos: o ritmo esperado de fotões é desprezável.',
      },
    },
    panel: {
      kid: [
        'Um átomo de hidrogénio é um protão com um eletrão. Os dois giram como piões minúsculos, e cada um é um ímã minúsculo. Quando as setas apontam para o mesmo lado, o átomo guarda um bocadinho de energia a mais. Muito raramente o eletrão vira-se, e essa energia a mais sai como uma onda de rádio com exatamente 21 centímetros.',
        'Um átomo espera cerca de 11 milhões de anos por essa inversão! Mas o espaço está cheio de hidrogénio, e todos juntos os átomos sussurram bem alto. Hendrik van de Hulst descobriu isto em 1944, e em 1951 Harold Ewen e Edward Purcell ouviram-no pela primeira vez, em Harvard.',
      ],
      sci: [
        'O estado fundamental do hidrogénio (1s) divide-se pela interação hiperfina entre os momentos magnéticos do eletrão e do protão: F = 1 (spins paralelos) fica 5,87 µeV acima de F = 0 (antiparalelos). A transição é de dipolo magnético e fortemente proibida: A = 2,88 × 10⁻¹⁵ s⁻¹, um tempo de vida médio de cerca de 11 milhões de anos; ν = 1420,405751768 MHz, λ = 21,106 cm.',
        'No gás interestelar são as colisões que definem as populações (3:1 pelos pesos estatísticos, pois hν/k é só 0,068 K), por isso a emissão cresce com a coluna de átomos. Prevista por van de Hulst em 1944; detetada por Ewen e Purcell em Harvard a 25 de março de 1951 e confirmada no mesmo ano por Muller e Oort nos Países Baixos e por Christiansen e Hindman na Austrália; os artigos saíram juntos na Nature em setembro de 1951.',
      ],
    },
  },
  plaque: {
    label: 'A placa das Pioneer',
    title: 'Uma carta para extraterrestres',
    slider: 'A tua altura',
    caption: 'A placa das Pioneer, 1972 (uma cópia gigante)',
    postTitle: 'A tua altura em ondas de hidrogénio',
    unit: { kid: '1 = 21 cm', sci: '1 = 21 cm e 0,7 ns' },
    eight: '8 × 21 cm = 168 cm',
    reading: { kid: '{cm} cm: {u} ondas, {bin} em binário', sci: '{cm} cm = {u} unidades, binário {bin}' },
    buttons: { h: 'O símbolo do hidrogénio', woman: 'A mulher', pulsars: 'A estrela de linhas', planets: 'Os planetas', post: 'Medir-me' },
    hints: {
      h: 'Toca no símbolo do hidrogénio, em cima à esquerda',
      woman: 'Toca na mulher',
      pulsars: 'Toca na estrela de linhas',
      planets: 'Toca na fila de planetas',
      post: 'Toca no poste de medir',
      again: 'Toca no poste ou em qualquer parte da placa',
      watch: 'Observa a placa',
    },
    says: {
      h: {
        kid: 'Estes dois círculos são dois átomos de hidrogénio, antes e depois da inversão. O tracinho por baixo quer dizer 1: uma onda de hidrogénio, 21 centímetros. É a régua da placa, e qualquer cientista, em qualquer lado, a conheceria!',
        sci: 'A transição hiperfina do hidrogénio neutro; o traço por baixo é o 1 binário, que define as unidades: um comprimento de 21 cm e um tempo de 1/(1420 MHz), cerca de 0,7 ns. Todos os números da placa contam nelas.',
      },
      woman: {
        kid: 'Ao lado da mulher há um número em binário: 1000, que é 8. Oito ondas de hidrogénio: 8 × 21 cm = 168 cm. Assim quem a encontrar consegue saber a nossa altura!',
        sci: 'O colchete diz |−−−, 1000 em binário = 8 unidades: 8 × 21 cm ≈ 168 cm. O contorno da sonda atrás das figuras, desenhado à mesma escala, dá uma segunda verificação.',
      },
      pulsars: {
        kid: 'Esta estrela de linhas é um mapa de onde vivemos. Catorze linhas apontam para pulsares: estrelas mortas que giram e piscam como faróis, cada uma ao seu ritmo. A linha comprida aponta para o meio da nossa galáxia.',
        sci: '15 linhas a partir do Sol: 14 para pulsares, com os comprimentos a dar as distâncias relativas e os traços binários os períodos em unidades de 0,7 ns; a comprida vai até ao centro galáctico. Os pulsares abrandam a ritmos conhecidos, por isso os períodos também datam o lançamento.',
      },
      planets: {
        kid: 'O Sol e os seus planetas em fila. A navezinha parte do terceiro planeta, a nossa Terra, passa por Júpiter, o maior, e segue para o espaço.',
        sci: 'O Sistema Solar, com as distâncias em binário em décimos da órbita de Mercúrio; o percurso sai do terceiro planeta e passa por Júpiter. A Pioneer 11 foi depois enviada para Saturno, por isso o percurso da sua cópia está errado.',
      },
      post: {
        kid: 'Tens {cm} cm de altura: são cerca de {u} ondas de hidrogénio. Arredondando, {n}, que em binário é {bin}. Agora também podias ser desenhado numa placa!',
        sci: '{cm} cm = {u} unidades de 21,106 cm; arredondando, {n}, ou {bin} em binário, como a placa o escreveria.',
      },
      where: {
        kid: 'Experimenta o símbolo do hidrogénio em cima à esquerda, a mulher, a estrela de linhas ou os planetas em baixo.',
        sci: 'Toca numa parte: o símbolo hiperfino, as figuras, o mapa dos pulsares ou o Sistema Solar.',
      },
    },
    panel: {
      kid: [
        'Em 1972 e 1973, duas sondas espaciais, a Pioneer 10 e a Pioneer 11, foram enviadas para lá de Júpiter e para fora do sistema solar. Cada uma leva uma placa dourada: uma carta para quem a encontrar um dia, num futuro muito distante. Como se escreve a alguém que não conhece nenhuma das nossas palavras nem números? Com uma coisa que também tem de conhecer: o hidrogénio!',
        'Todos os átomos de hidrogénio do universo sussurram a mesma onda de 21 cm, por isso a placa usa-a como régua e como relógio. A mulher mede 8 dessas ondas. Carl Sagan e Frank Drake criaram a placa, e Linda Salzman Sagan desenhou-a. Mede-te em ondas de hidrogénio no poste!',
      ],
      sci: [
        'As placas, de cerca de 229 por 152 mm de alumínio anodizado a ouro, estão presas aos suportes da antena da Pioneer 10 (lançada em março de 1972) e da Pioneer 11 (abril de 1973), onde ficam protegidas da poeira interestelar. Criadas por Carl Sagan e Frank Drake e desenhadas por Linda Salzman Sagan, definem as suas unidades pela transição hiperfina do hidrogénio: 21 cm e cerca de 0,7 ns.',
        'Nessas unidades, os números binários dão a altura da mulher (8 unidades, cerca de 168 cm), os períodos dos pulsares e as distâncias dos planetas. A Pioneer 11 foi ouvida pela última vez em 1995 e a Pioneer 10 em 2003; ambas seguem viagem entre as estrelas. A cópia aqui está simplificada: as linhas e os números dos pulsares não são os verdadeiros.',
      ],
    },
  },
}

const PL = {
  title: 'Słuchając wodoru',
  greet: {
    kid: 'Cześć! Jestem Wodór. Jesteśmy w środku obrazka, nocą na wrzosowisku w Niderlandach! Ta ogromna czasza to radioteleskop w Dwingeloo, który słucha szeptu, jaki wysyłam. Dotknij czaszy, żeby narysować mapę naszej Galaktyki, przewróć mój elektron po prawej i przeczytaj złoty list do kosmitów po lewej. Historia obrazka jest na sztaludze.',
    sci: 'Cześć! Jestem Wodór. To radioteleskop w Dwingeloo w Drenthe: 25 m średnicy, otwarty w 1956 roku, wtedy największy radioteleskop na świecie. Przed tobą jego odbiornik i mapa atomowego wodoru Drogi Mlecznej; po prawej przejście spinowe, z którego bierze się linia 21 cm; po lewej tabliczka Pioneerów, która używa tej linii jako jednostki. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Fale radiowe przechodzą prosto przez pył między gwiazdami, więc radioteleskop słyszy obłoki, których żaden zwykły teleskop nie zobaczy.',
      'Mój szept to fala radiowa długa na 21 centymetrów: mniej więcej tyle, ile szerokość kartki papieru.',
      'Ta czasza jest szeroka jak dwa autobusy ustawione jeden za drugim, a cały teleskop obraca się na szynie ułożonej w koło.',
    ],
    sci: [
      'Linia 21 cm to przejście nadsubtelne: przy równoległych spinach elektronu i protonu atom ma o 5,9 µeV więcej energii niż przy antyrównoległych; przewrót daje foton o częstotliwości 1420,405751768 MHz.',
      'Pył międzygwiazdowy pochłania światło widzialne, ale prawie nie tłumi fal 21 cm, więc linia dociera do nas od atomowego wodoru z całego dysku Galaktyki.',
      'Czasza w Dwingeloo ma 25 m średnicy i 3,25 m głębokości, zawieszona na stalowej kratownicy wysokiej na 15 m; cały teleskop obraca się na czterech kołach po okrągłej szynie, a budka sterownicza w jego podstawie jest zawsze za reflektorem.',
    ],
  },
  map: {
    label: 'Radioteleskop',
    title: 'Narysuj mapę Drogi Mlecznej',
    slider: 'Gdzie celuje czasza (długość galaktyczna)',
    sydney: 'Mapy z Sydney',
    centre: 'Środek',
    never: 'Nigdy nie wschodzi nad Niderlandami',
    sun: { kid: 'Słońce (my)', sci: 'Słońce' },
    screen: {
      title: { kid: 'Szept wodoru z tego kierunku', sci: 'Profil linii 21 cm' },
      part: 'Odcinek {n} z {of}',
      kms: 'km/s',
      toward: 'zbliża się',
      away: 'oddala się',
      still: 'stoi',
      done: 'Odsłuchane odcinki: {n} z {of}',
      south: 'mapy z Sydney dodane',
    },
    hints: {
      sweep: 'Dotknij czaszy, by posłuchać następnego odcinka',
      busy: 'Patrz na ekran i mapę',
      south: 'Dotknij map z Sydney',
      done: 'Dotknij czaszy, ekranu albo mapy',
    },
    buttons: { sweep: 'Posłuchaj następnego odcinka', south: 'Dodaj mapy z Sydney', clear: 'Wyczyść mapę' },
    says: {
      first: {
        kid: 'Ruszamy! Najpierw niebo obraca się, aż ta część Drogi Mlecznej będzie wysoko, a potem czasza za nią podąża. Patrz na ekran: każdy garb to obłok wodoru.',
        sci: 'Niebo obraca się do czasu gwiazdowego tego odcinka, a potem czasza śledzi płaszczyznę Galaktyki od l = 10° do 50°. Każdy szczyt profilu to gaz o własnej prędkości radialnej.',
      },
      sweep: {
        kid: 'Następny odcinek! Ziemia obraca dla nas niebo, a czasza słucha dalej.',
        sci: 'Następny odcinek: niebo obraca się do jego czasu gwiazdowego, a czasza przeczesuje płaszczyznę.',
      },
      firstDone: {
        kid: 'Widzisz kropki na mapie? Każdy garb na ekranie to obłok, który porusza się z własną prędkością, a z tej prędkości da się obliczyć, jak jest daleko. Dotknij czaszy jeszcze raz!',
        sci: 'Rotacja Galaktyki zamienia każdą prędkość radialną na odległość wzdłuż linii widzenia: tak obłoki trafiają na mapę.',
      },
      more: {
        kid: 'Więcej obłoków na mapie! Widzisz, jak układają się w wygięte ramiona?',
        sci: 'Obłoki układają się wzdłuż łuków: to ramiona spiralne.',
      },
      wedge: {
        kid: 'Popatrz: w kierunku dokładnie od środka Galaktyki obłoki poruszają się bokiem, ani do nas, ani od nas, więc ich prędkość nie mówi, jak są daleko. Dlatego na mapie jest tam przerwa.',
        sci: 'W pobliżu l = 180° (i l = 0°) gaz porusza się w poprzek linii widzenia: prędkości radialne bliskie zera nie dają odległości. Stąd puste kliny, jak na mapach z lat 50.',
      },
      allDutch: {
        kid: 'To cała Droga Mleczna, jaką widać z Niderlandów! Reszta nigdy nie wschodzi nad tamtejszym horyzontem. Dotknij map z Sydney: astronomowie w Australii słuchali południowego nieba.',
        sci: 'Na 52,8° N długości od około 255° do 350° nigdy nie wschodzą. Dotknij map z Sydney: południowa połowa pochodzi z australijskich przeglądów.',
      },
      south: {
        kid: 'Mapy z Sydney! Po drugiej stronie świata astronomowie słuchali tej części nieba, której stąd nie widać.',
        sci: 'Południowa Droga Mleczna z australijskich przeglądów w linii 21 cm. Pierwsza mapa ramion spiralnych (Oort, Kerr i Westerhout, 1958) połączyła połowę holenderską z australijską.',
      },
      southIn: {
        kid: 'Część południowa jest już na mapie. Teraz posłuchaj czaszą reszty północnego nieba!',
        sci: 'Dane z południa są już na mapie; północne odcinki czekają na przegląd.',
      },
      southDone: { kid: 'Mapy z Sydney są już na mapie.', sci: 'Dane z południa są już dodane.' },
      complete: {
        kid: 'Spójrz na mapę: ramiona spiralne naszej Galaktyki, narysowane szeptem wodoru! Złoty pierścień to my.',
        sci: 'Mapa jest gotowa: ramiona spiralne wykreślone w atomowym wodorze, z pustymi klinami w stronę środka i antycentrum. Wyczyść ją w panelu, by zacząć od nowa.',
      },
      clear: { kid: 'Mapa znowu jest pusta. Dotknij czaszy, żeby zacząć słuchać!', sci: 'Mapa wyczyszczona.' },
      screen: {
        kid: 'Każdy garb to wodór poruszający się z własną prędkością: po lewej obłoki, które się zbliżają, po prawej te, które się oddalają. Różne prędkości, różne ramiona!',
        sci: 'Przesunięcie Dopplera: każdy szczyt to gaz o jednej prędkości radialnej; przesunięcie o 1 MHz to około 211 km/s. Krzywa rotacji zamienia prędkości na odległości.',
      },
      map: {
        kid: 'To nasza Galaktyka widziana z góry. Złoty pierścień to Słońce, razem z nami. Każda kropka to obłok wodoru, który usłyszała czasza.',
        sci: 'Widok z północnego bieguna Galaktyki, która obraca się zgodnie z ruchem wskazówek zegara; Słońce 8,2 kpc (około 27 000 lat świetlnych) od środka. Każda kropka to gaz umieszczony według swojej prędkości.',
      },
      mapEmpty: { kid: 'Mapa jest jeszcze pusta. Dotknij czaszy, żeby zacząć słuchać!', sci: 'Brak danych: przeczesz niebo czaszą.' },
    },
    panel: {
      kid: [
        'Obłoki wodoru wypełniają przestrzeń między gwiazdami. Szepczą falami radiowymi, a fale radiowe przechodzą prosto przez pył, który zasłania przed nami tyle gwiazd. Każdy obłok krąży wokół środka Galaktyki, więc jedne się zbliżają, a inne oddalają, i to odrobinę zmienia ich szept: ekran pokazuje każdy obłok jako osobny garb.',
        'Wiemy, jak obraca się Galaktyka, więc każda prędkość mówi, jak daleko jest obłok. Połóż wszystkie obłoki na mapie, a pojawią się ramiona spiralne! W latach 50. holenderscy i australijscy astronomowie narysowali w ten sposób pierwszą mapę ramion naszej Galaktyki. Dotknij czaszy albo wyceluj nią sam suwakiem.',
      ],
      sci: [
        'Każda porcja gazu krąży wokół środka Galaktyki; wzdłuż linii widzenia o długości l jej prędkość radialna wynosi v = (Θ(R)·R₀/R − Θ₀)·sin l. Przy znanej krzywej rotacji każda prędkość daje promień galaktocentryczny, a z niego odległość (albo dwie w wewnętrznej Galaktyce: niejednoznaczność bliżej-dalej). W pobliżu l = 0° i 180° prędkości są bliskie zera i nie dają odległości.',
        'Model tutaj: płaska rotacja, Θ₀ = 230 km/s, Słońce 8,2 kpc od środka, cztery wleczone ramiona o kącie nachylenia 12° i Ramię Lokalne; kropki pokazują gaz tam, gdzie umieściłyby go jego prędkości. Pierwsze mapy (Oort, Kerr i Westerhout, 1958, z przeglądów w Lejdzie i Sydney) miały prawdziwe błędy odległości: ramiona wyszły prawie okrągłe. Dwingeloo (25 m, 1956) było największym radioteleskopem świata aż do 76-metrowej czaszy w Jodrell Bank w 1957 roku.',
      ],
    },
  },
  flip: {
    label: 'Przewrót spinu',
    title: 'Szept wodoru o długości 21 cm',
    slider: 'Ile atomów',
    oneAtom: 'jeden atom',
    proton: 'proton',
    electron: 'elektron',
    ruler: '21 cm',
    a4: 'Kartka A4: 21 cm szerokości',
    time: (v, t, unit) =>
      ({
        Myr: `${t} mln lat`,
        kyr: `${t} tys. lat`,
        yr: `${t} ${plPlural(v, 'rok', 'lata', 'lat')}`,
        d: `${t} ${plPlural(v, 'dzień', 'dni', 'dni')}`,
        h: `${t} ${plPlural(v, 'godzinę', 'godziny', 'godzin')}`,
        min: `${t} ${plPlural(v, 'minutę', 'minuty', 'minut')}`,
        s: `${t} ${plPlural(v, 'sekundę', 'sekundy', 'sekund')}`,
      })[unit],
    buttons: { flip: 'Dotknij elektronu', one: 'Jeden atom', cloud: 'Obłok', galaxy: 'Droga Mleczna' },
    hints: {
      flip: 'Dotknij elektronu i poczekaj na przewrót',
      bump: 'Dotknij elektronu, by go z powrotem potrącić',
      waiting: 'Patrz, jak mijają lata',
      watch: 'Patrz na falę',
    },
    board: {
      same: { kid: 'Obie strzałki w górę: gotowy do przewrotu', sci: 'Spiny równoległe (F = 1)' },
      opposite: { kid: 'Strzałki przeciwne: szept wysłany', sci: 'Spiny antyrównoległe (F = 0)' },
      waiting: 'Czekanie na przewrót:',
      waited: 'Ten atom czekał:',
      mean: 'Samotny atom czeka średnio:',
      atoms: 'Atomy:',
      one: 'jeden',
      galaxy: 'Droga Mleczna',
      cloud: 'obłok między gwiazdami',
      flips: 'Przewroty:',
      every: 'jeden na {t}',
      perSecond: 'na sekundę',
    },
    says: {
      wait: {
        kid: 'Teraz czekamy... Samotny atom czeka na to miliony lat. Patrz na licznik!',
        sci: 'Emisja spontaniczna: czas oczekiwania jest losowy, o rozkładzie wykładniczym, ze średnią 1/A, około 11 milionów lat (A = 2,9 × 10⁻¹⁵ s⁻¹).',
      },
      flipped: {
        kid: 'Przewrót! Elektron stanął do góry nogami i wyleciała fala radiowa. Tym razem trwało to {t}. Spójrz na linijkę: jedna fala ma 21 centymetrów, tyle co szerokość kartki papieru.',
        sci: 'Z F = 1 do F = 0: foton o częstotliwości 1420,406 MHz, λ = 21,106 cm, po {t} (to losowanie). Atom jest teraz w swoim najniższym stanie.',
      },
      bump: {
        kid: 'Bęc! Inny atom na niego wpadł i przewrócił elektron z powrotem do góry, gotowy znowu szeptać. W obłoku zderzenia zdarzają się dużo częściej niż przewroty.',
        sci: 'Zderzenia zapełniają górny poziom dużo szybciej, niż opróżnia go rozpad spontaniczny, więc w każdej chwili około trzech czwartych atomów jest w stanie F = 1 (wagi statystyczne 3:1).',
      },
      one: {
        kid: 'Jeden samotny atom: jeden szept na mniej więcej 11 milionów lat. Radio nic nie słyszy.',
        sci: 'N = 1: średnio jeden foton na 11 milionów lat.',
      },
      cloud: {
        kid: 'Obłok między gwiazdami zawiera około 10⁶⁰ atomów: tyle przewrotów na sekundę, że radio słyszy równy szum!',
        sci: '10⁶⁰ atomów (około 800 mas Słońca wodoru): przy trzech czwartych w F = 1 około 2 × 10⁴⁵ fotonów na sekundę.',
      },
      galaxy: {
        kid: 'Cały gazowy wodór Drogi Mlecznej: około 10⁶⁷ atomów. Razem szepczą tak głośno, że radioteleskopy słyszą je wzdłuż całej Drogi Mlecznej.',
        sci: 'Około 10⁶⁷ atomów, kilka miliardów mas Słońca gazu atomowego: około 2 × 10⁵² fotonów na sekundę.',
      },
      ruler: {
        kid: 'Ta linijka ma 21 centymetrów: dokładnie jedną falę wodoru. Kartka papieru A4 też ma 21 centymetrów szerokości!',
        sci: 'λ = c/ν = 21,106 cm; kartka A4 ma 21,0 cm szerokości.',
      },
      radioLoud: {
        kid: 'Słyszysz? Zielone magiczne oko radia jest szeroko otwarte: biliony bilionów atomów szepczą naraz.',
        sci: 'Magiczne oko (lampa wskaźnika dostrojenia z lat 50.) zamyka swój cień, gdy sygnał rośnie: to zsumowana emisja wielu atomów.',
      },
      radioQuiet: {
        kid: 'Cisza. Jeden atom szepcze o wiele za rzadko, żeby go usłyszeć. Dodaj suwakiem więcej atomów!',
        sci: 'Za mało atomów: oczekiwana liczba fotonów jest znikoma.',
      },
    },
    panel: {
      kid: [
        'Atom wodoru to jeden proton i jeden elektron. Oba wirują jak malutkie bączki i każdy jest malutkim magnesem. Kiedy ich strzałki wskazują w tę samą stronę, atom ma odrobinę dodatkowej energii. Bardzo rzadko elektron się przewraca, a ta dodatkowa energia odlatuje jako fala radiowa długa dokładnie na 21 centymetrów.',
        'Jeden atom czeka na taki przewrót około 11 milionów lat! Ale kosmos jest pełen wodoru, więc wszystkie atomy razem szepczą głośno. Hendrik van de Hulst wyliczył to w 1944 roku, a w 1951 roku Harold Ewen i Edward Purcell po raz pierwszy go usłyszeli, na Harvardzie.',
      ],
      sci: [
        'Stan podstawowy wodoru (1s) jest rozszczepiony przez oddziaływanie nadsubtelne momentów magnetycznych elektronu i protonu: F = 1 (spiny równoległe) leży 5,87 µeV nad F = 0 (antyrównoległe). Przejście jest magnetyczne dipolowe i silnie wzbronione: A = 2,88 × 10⁻¹⁵ s⁻¹, średni czas życia około 11 milionów lat; ν = 1420,405751768 MHz, λ = 21,106 cm.',
        'W gazie międzygwiazdowym obsadzenia ustalają zderzenia (3:1 według wag statystycznych, bo hν/k to tylko 0,068 K), więc emisja rośnie z kolumną atomów. Przewidziana przez van de Hulsta w 1944 roku; wykryta przez Ewena i Purcella na Harvardzie 25 marca 1951 roku i potwierdzona w tym samym roku przez Mullera i Oorta w Niderlandach oraz przez Christiansena i Hindmana w Australii; prace ukazały się razem w „Nature” we wrześniu 1951 roku.',
      ],
    },
  },
  plaque: {
    label: 'Tabliczka Pioneerów',
    title: 'List do kosmitów',
    slider: 'Twój wzrost',
    caption: 'Tabliczka Pioneerów, 1972 (wielka kopia)',
    postTitle: 'Twój wzrost w falach wodoru',
    unit: { kid: '1 = 21 cm', sci: '1 = 21 cm i 0,7 ns' },
    eight: '8 × 21 cm = 168 cm',
    reading: { kid: '{cm} cm: {u} fali, dwójkowo {bin}', sci: '{cm} cm = {u} jednostki, dwójkowo {bin}' },
    buttons: { h: 'Symbol wodoru', woman: 'Kobieta', pulsars: 'Gwiazda z linii', planets: 'Planety', post: 'Zmierz mnie' },
    hints: {
      h: 'Dotknij symbolu wodoru w lewym górnym rogu',
      woman: 'Dotknij kobiety',
      pulsars: 'Dotknij gwiazdy z linii',
      planets: 'Dotknij rzędu planet',
      post: 'Dotknij słupka do mierzenia',
      again: 'Dotknij słupka albo dowolnej części tabliczki',
      watch: 'Patrz na tabliczkę',
    },
    says: {
      h: {
        kid: 'Te dwa kółka to dwa atomy wodoru, przed przewrotem i po nim. Kreska pod nimi oznacza 1: jedną falę wodoru, 21 centymetrów. To linijka tabliczki i każdy naukowiec, gdziekolwiek, by ją znał!',
        sci: 'Przejście nadsubtelne obojętnego wodoru; kreska poniżej to dwójkowa jedynka, która ustala jednostki: długość 21 cm i czas 1/(1420 MHz), około 0,7 ns. Wszystkie liczby na tabliczce liczą się w nich.',
      },
      woman: {
        kid: 'Obok kobiety jest liczba zapisana dwójkowo: 1000, czyli 8. Osiem fal wodoru: 8 × 21 cm = 168 cm. Więc ten, kto ją znajdzie, może obliczyć, jak jesteśmy wysocy!',
        sci: 'Klamra głosi |−−−, dwójkowo 1000 = 8 jednostek: 8 × 21 cm ≈ 168 cm. Zarys sondy za postaciami, w tej samej skali, daje drugie sprawdzenie.',
      },
      pulsars: {
        kid: 'Ta gwiazda z linii to mapa miejsca, w którym mieszkamy. Czternaście linii wskazuje pulsary: martwe gwiazdy, które wirują i błyskają jak latarnie morskie, każda we własnym rytmie. Długa linia wskazuje środek naszej Galaktyki.',
        sci: '15 linii od Słońca: 14 do pulsarów, ich długości to względne odległości, a dwójkowe kreski to okresy w jednostkach 0,7 ns; długa linia biegnie do środka Galaktyki. Pulsary zwalniają w znanym tempie, więc okresy datują też start.',
      },
      planets: {
        kid: 'Słońce i jego planety w rzędzie. Mały statek startuje z trzeciej planety, naszej Ziemi, mija Jowisza, największego, i leci w kosmos.',
        sci: 'Układ Słoneczny z dwójkowymi odległościami w dziesiątych częściach orbity Merkurego; tor wychodzi od trzeciej planety i mija Jowisza. Pioneera 11 skierowano później do Saturna, więc tor na jego kopii jest błędny.',
      },
      post: {
        kid: 'Masz {cm} cm wzrostu: to około {u} fali wodoru. Po zaokrągleniu {n}, czyli dwójkowo {bin}. Teraz ciebie też można by narysować na tabliczce!',
        sci: '{cm} cm = {u} jednostki po 21,106 cm; po zaokrągleniu {n}, czyli dwójkowo {bin}, tak jak zapisałaby to tabliczka.',
      },
      where: {
        kid: 'Spróbuj symbolu wodoru w lewym górnym rogu, kobiety, gwiazdy z linii albo planet na dole.',
        sci: 'Dotknij części: symbolu nadsubtelnego, postaci, mapy pulsarów albo Układu Słonecznego.',
      },
    },
    panel: {
      kid: [
        'W 1972 i 1973 roku dwie sondy kosmiczne, Pioneer 10 i Pioneer 11, wysłano za Jowisza i dalej, poza Układ Słoneczny. Każda wiezie złotą tabliczkę: list dla każdego, kto może ją kiedyś znaleźć, w bardzo dalekiej przyszłości. Jak napisać do kogoś, kto nie zna żadnych naszych słów ani liczb? Czymś, co on też musi znać: wodorem!',
        'Każdy atom wodoru we wszechświecie szepcze tę samą falę 21 cm, więc tabliczka używa jej jako linijki i zegara. Kobieta ma wzrost 8 takich fal. Tabliczkę zaprojektowali Carl Sagan i Frank Drake, a narysowała ją Linda Salzman Sagan. Zmierz się w falach wodoru przy słupku!',
      ],
      sci: [
        'Tabliczki, około 229 na 152 mm z anodowanego na złoto aluminium, są przymocowane do wsporników anteny Pioneera 10 (start w marcu 1972 roku) i Pioneera 11 (kwiecień 1973), gdzie chroni je to przed pyłem międzygwiazdowym. Zaprojektowane przez Carla Sagana i Franka Drake’a i narysowane przez Lindę Salzman Sagan, ustalają jednostki przejściem nadsubtelnym wodoru: 21 cm i około 0,7 ns.',
        'W tych jednostkach liczby dwójkowe podają wzrost kobiety (8 jednostek, około 168 cm), okresy pulsarów i odległości planet. Pioneera 11 usłyszano po raz ostatni w 1995 roku, a Pioneera 10 w 2003; obie sondy lecą dalej między gwiazdy. Kopia jest tu uproszczona: jej linie i liczby pulsarów nie są prawdziwe.',
      ],
    },
  },
}

const DE = {
  title: 'Dem Wasserstoff lauschen',
  greet: {
    kid: 'Hallo! Ich bin der Wasserstoff. Wir sind im Bild, nachts auf einer Heide in den Niederlanden! Die riesige Schüssel ist das Radioteleskop von Dwingeloo, und es lauscht einem Flüstern, das ich aussende. Tipp auf die Schüssel, um eine Karte unserer Galaxis zu zeichnen, klapp rechts mein Elektron um und lies links den goldenen Brief an Außerirdische. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Hallo! Ich bin der Wasserstoff. Das ist das Radioteleskop von Dwingeloo in Drenthe: 25 m Durchmesser, 1956 eröffnet und damals das größte Radioteleskop der Welt. Vor dir sein Empfänger und eine Karte des atomaren Wasserstoffs der Milchstraße; rechts das Umklappen des Spins hinter der 21-cm-Linie; links die Pioneer-Plakette, die diese Linie als Einheit benutzt. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Radiowellen gehen glatt durch den Staub zwischen den Sternen, deshalb hört ein Radioteleskop Wolken, die kein gewöhnliches Teleskop sehen kann.',
      'Mein Flüstern ist eine Radiowelle, 21 Zentimeter lang: ungefähr so breit wie ein Blatt Papier.',
      'Die Schüssel ist so breit, wie zwei Busse hintereinander lang sind, und das ganze Teleskop dreht sich auf einer Schiene im Kreis.',
    ],
    sci: [
      'Die 21-cm-Linie ist ein Hyperfeinübergang: Mit parallelen Spins von Elektron und Proton hat das Atom 5,9 µeV mehr Energie als mit antiparallelen; das Umklappen gibt ein Photon von 1420,405751768 MHz.',
      'Interstellarer Staub schluckt sichtbares Licht, aber kaum 21-cm-Wellen, deshalb erreicht uns die Linie von atomarem Wasserstoff aus der ganzen galaktischen Scheibe.',
      'Die Schüssel von Dwingeloo misst 25 m und ist 3,25 m tief, aufgehängt an einem 15 m hohen Stahlfachwerk; das ganze Teleskop dreht sich auf vier Rädern auf einer kreisförmigen Schiene, und das Bedienungshaus in seinem Sockel liegt immer hinter dem Reflektor.',
    ],
  },
  map: {
    label: 'Das Radioteleskop',
    title: 'Kartiere die Milchstraße',
    slider: 'Wohin die Schüssel zeigt (galaktische Länge)',
    sydney: 'Karten aus Sydney',
    centre: 'Zentrum',
    never: 'Geht über den Niederlanden nie auf',
    sun: { kid: 'Sonne (wir)', sci: 'Sonne' },
    screen: {
      title: { kid: 'Das Flüstern des Wasserstoffs von hier', sci: 'Profil der 21-cm-Linie' },
      part: 'Abschnitt {n} von {of}',
      kms: 'km/s',
      toward: 'kommt näher',
      away: 'entfernt sich',
      still: 'steht still',
      done: 'Gehörte Abschnitte: {n} von {of}',
      south: 'Karten aus Sydney dabei',
    },
    hints: {
      sweep: 'Tipp auf die Schüssel, um den nächsten Abschnitt zu hören',
      busy: 'Schau auf den Bildschirm und die Karte',
      south: 'Tipp auf die Karten aus Sydney',
      done: 'Tipp auf die Schüssel, den Bildschirm oder die Karte',
    },
    buttons: { sweep: 'Den nächsten Abschnitt hören', south: 'Die Karten aus Sydney dazu', clear: 'Die Karte leeren' },
    says: {
      first: {
        kid: 'Los geht’s! Erst dreht sich der Himmel, bis dieser Teil der Milchstraße hoch steht, dann folgt ihm die Schüssel. Schau auf den Bildschirm: Jeder Buckel ist eine Wasserstoffwolke.',
        sci: 'Der Himmel dreht sich zur Sternzeit des Abschnitts, dann fährt die Schüssel die galaktische Ebene von l = 10° bis 50° ab. Jede Spitze im Profil ist Gas mit eigener Radialgeschwindigkeit.',
      },
      sweep: {
        kid: 'Nächster Abschnitt! Die Erde dreht den Himmel für uns, und die Schüssel lauscht weiter.',
        sci: 'Nächster Abschnitt: Der Himmel dreht sich zu seiner Sternzeit, und die Schüssel tastet die Ebene ab.',
      },
      firstDone: {
        kid: 'Siehst du die Punkte auf der Karte? Jeder Buckel auf dem Bildschirm ist eine Wolke mit ihrer eigenen Geschwindigkeit, und aus der Geschwindigkeit können wir ausrechnen, wie weit weg sie ist. Tipp noch einmal auf die Schüssel!',
        sci: 'Die Rotation der Galaxis macht aus jeder Radialgeschwindigkeit eine Entfernung entlang der Sichtlinie: So landen die Wolken auf der Karte.',
      },
      more: {
        kid: 'Mehr Wolken auf der Karte! Siehst du, wie sie sich zu gebogenen Armen aufreihen?',
        sci: 'Die Wolken reihen sich entlang von Bögen auf: den Spiralarmen.',
      },
      wedge: {
        kid: 'Hast du es gesehen? Genau vom Zentrum der Galaxis weg bewegen sich die Wolken seitwärts, weder auf uns zu noch von uns weg, deshalb verrät ihre Geschwindigkeit nicht, wie weit weg sie sind. Darum hat die Karte dort eine Lücke.',
        sci: 'Nahe l = 180° (und l = 0°) bewegt sich das Gas quer zur Sichtlinie: Radialgeschwindigkeiten nahe null geben keine Entfernungen. Daher die leeren Keile, wie auf den Karten der 1950er-Jahre.',
      },
      allDutch: {
        kid: 'Das ist die ganze Milchstraße, die man von den Niederlanden aus sieht! Der Rest geht über dem niederländischen Horizont nie auf. Tipp auf die Karten aus Sydney: Astronomen in Australien haben dem Südhimmel gelauscht.',
        sci: 'Auf 52,8° N gehen die Längen von etwa 255° bis 350° nie auf. Tipp auf die Karten aus Sydney: Die Südhälfte stammt aus australischen Durchmusterungen.',
      },
      south: {
        kid: 'Karten aus Sydney! Auf der anderen Seite der Welt haben Astronomen dem Teil des Himmels gelauscht, den wir von hier nicht sehen.',
        sci: 'Die südliche Milchstraße, aus australischen 21-cm-Durchmusterungen. Die erste Karte der Spiralarme (Oort, Kerr und Westerhout, 1958) fügte die niederländische und die australische Hälfte zusammen.',
      },
      southIn: {
        kid: 'Der südliche Teil ist auf der Karte. Jetzt lausch mit der Schüssel dem Rest des Nordhimmels!',
        sci: 'Die Süddaten sind drin; die nördlichen Abschnitte fehlen noch.',
      },
      southDone: { kid: 'Die Karten aus Sydney sind schon auf der Karte.', sci: 'Die Süddaten sind schon drin.' },
      complete: {
        kid: 'Schau dir die Karte an: die Spiralarme unserer Galaxis, gezeichnet vom Flüstern des Wasserstoffs! Der goldene Ring sind wir.',
        sci: 'Die Karte ist vollständig: Spiralarme, nachgezeichnet im atomaren Wasserstoff, mit leeren Keilen zum Zentrum und zum Antizentrum. Leere sie in der Tafel, um noch einmal abzutasten.',
      },
      clear: { kid: 'Die Karte ist wieder leer. Tipp auf die Schüssel, um zu lauschen!', sci: 'Karte geleert.' },
      screen: {
        kid: 'Jeder Buckel ist Wasserstoff mit seiner eigenen Geschwindigkeit: links Wolken, die näher kommen, rechts Wolken, die sich entfernen. Andere Geschwindigkeiten, andere Arme!',
        sci: 'Die Dopplerverschiebung: Jede Spitze ist Gas mit einer Radialgeschwindigkeit; 1 MHz Verschiebung sind etwa 211 km/s. Die Rotationskurve macht aus Geschwindigkeiten Entfernungen.',
      },
      map: {
        kid: 'Das ist unsere Galaxis von oben. Der goldene Ring ist die Sonne, mit uns. Jeder Punkt ist eine Wasserstoffwolke, die die Schüssel gehört hat.',
        sci: 'Vom galaktischen Nordpol aus gesehen, die Galaxis dreht sich im Uhrzeigersinn; die Sonne 8,2 kpc (etwa 27 000 Lichtjahre) vom Zentrum. Jeder Punkt ist Gas, das seine Geschwindigkeit dorthin setzt.',
      },
      mapEmpty: { kid: 'Die Karte ist noch leer. Tipp auf die Schüssel, um zu lauschen!', sci: 'Noch keine Daten: Taste mit der Schüssel ab.' },
    },
    panel: {
      kid: [
        'Wasserstoffwolken füllen den Raum zwischen den Sternen. Sie flüstern in Radiowellen, und Radiowellen gehen glatt durch den Staub, der uns so viele Sterne verbirgt. Jede Wolke zieht um die Mitte der Galaxis, also kommen manche näher und andere entfernen sich, und das verschiebt ihr Flüstern ein winziges bisschen: Der Bildschirm zeigt jede Wolke als eigenen Buckel.',
        'Weil wir wissen, wie sich die Galaxis dreht, verrät jede Geschwindigkeit, wie weit eine Wolke weg ist. Setz alle Wolken auf die Karte, und die Spiralarme erscheinen! In den 1950er-Jahren zeichneten niederländische und australische Astronomen so die erste Karte der Arme unserer Galaxis. Tipp auf die Schüssel, oder richte sie selbst mit dem Schieberegler aus.',
      ],
      sci: [
        'Jedes Gaspaket umkreist das galaktische Zentrum; entlang einer Sichtlinie mit der Länge l ist seine Radialgeschwindigkeit v = (Θ(R)·R₀/R − Θ₀)·sin l. Mit bekannter Rotationskurve gibt jede Geschwindigkeit einen galaktozentrischen Radius und daraus eine Entfernung (oder zwei in der inneren Galaxis: die Nah-fern-Mehrdeutigkeit). Nahe l = 0° und 180° sind die Geschwindigkeiten fast null und geben keine Entfernungen.',
        'Das Modell hier: flache Rotation, Θ₀ = 230 km/s, die Sonne 8,2 kpc vom Zentrum, vier nachlaufende Arme mit 12° Steigungswinkel und der lokale Arm; die Punkte zeigen das Gas dort, wo seine Geschwindigkeiten es hinsetzen würden. Die ersten Karten (Oort, Kerr und Westerhout, 1958, aus den Durchmusterungen von Leiden und Sydney) hatten echte Entfernungsfehler: Ihre Arme wurden fast kreisrund. Dwingeloo (25 m, 1956) war das größte Radioteleskop der Welt, bis 1957 die 76-m-Schüssel von Jodrell Bank kam.',
      ],
    },
  },
  flip: {
    label: 'Das Umklappen des Spins',
    title: 'Das 21-cm-Flüstern des Wasserstoffs',
    slider: 'Wie viele Atome',
    oneAtom: 'ein Atom',
    proton: 'Proton',
    electron: 'Elektron',
    ruler: '21 cm',
    a4: 'A4-Papier: 21 cm breit',
    time: (v, t, unit) =>
      ({
        Myr: `${t} Millionen Jahre`,
        kyr: `${t} Tausend Jahre`,
        yr: `${t} ${v === 1 ? 'Jahr' : 'Jahre'}`,
        d: `${t} ${v === 1 ? 'Tag' : 'Tage'}`,
        h: `${t} ${v === 1 ? 'Stunde' : 'Stunden'}`,
        min: `${t} ${v === 1 ? 'Minute' : 'Minuten'}`,
        s: `${t} ${v === 1 ? 'Sekunde' : 'Sekunden'}`,
      })[unit],
    buttons: { flip: 'Aufs Elektron tippen', one: 'Ein Atom', cloud: 'Eine Wolke', galaxy: 'Die Milchstraße' },
    hints: {
      flip: 'Tipp aufs Elektron und warte, bis es umklappt',
      bump: 'Tipp aufs Elektron, um es zurückzustoßen',
      waiting: 'Schau, wie die Jahre vergehen',
      watch: 'Schau auf die Welle',
    },
    board: {
      same: { kid: 'Beide Pfeile nach oben: bereit zum Umklappen', sci: 'Spins parallel (F = 1)' },
      opposite: { kid: 'Pfeile entgegengesetzt: Flüstern gesendet', sci: 'Spins antiparallel (F = 0)' },
      waiting: 'Warten aufs Umklappen:',
      waited: 'Dieses Atom wartete:',
      mean: 'Ein einzelnes Atom wartet im Mittel:',
      atoms: 'Atome:',
      one: 'eins',
      galaxy: 'die Milchstraße',
      cloud: 'eine Wolke zwischen den Sternen',
      flips: 'Umklappen:',
      every: 'einmal alle {t}',
      perSecond: 'pro Sekunde',
    },
    says: {
      wait: {
        kid: 'Jetzt warten wir... Ein einzelnes Atom wartet darauf Millionen Jahre. Schau auf den Zähler!',
        sci: 'Spontane Emission: Die Wartezeit ist zufällig, exponentialverteilt, im Mittel 1/A, etwa 11 Millionen Jahre (A = 2,9 × 10⁻¹⁵ s⁻¹).',
      },
      flipped: {
        kid: 'Klapp! Das Elektron hat sich auf den Kopf gestellt, und eine Radiowelle ist hinausgeflogen. Diesmal hat es {t} gedauert. Schau aufs Lineal: Eine Welle ist 21 Zentimeter lang, so breit wie ein Blatt Papier.',
        sci: 'Von F = 1 nach F = 0: ein Photon von 1420,406 MHz, λ = 21,106 cm, nach {t} (diese Ziehung). Das Atom ist jetzt in seinem tiefsten Zustand.',
      },
      bump: {
        kid: 'Bums! Ein anderes Atom ist dagegengestoßen und hat das Elektron wieder nach oben geklappt, bereit, wieder zu flüstern. In einer Wolke gibt es Stöße viel öfter als Umklappen.',
        sci: 'Stöße füllen das obere Niveau viel schneller wieder auf, als der spontane Zerfall es leert, deshalb sind zu jeder Zeit etwa drei Viertel der Atome in F = 1 (statistische Gewichte 3:1).',
      },
      one: {
        kid: 'Ein Atom allein: ein Flüstern in etwa 11 Millionen Jahren. Das Radio hört nichts.',
        sci: 'N = 1: im Mittel ein Photon alle 11 Millionen Jahre.',
      },
      cloud: {
        kid: 'Eine Wolke zwischen den Sternen enthält etwa 10⁶⁰ Atome: so viele Umklappen pro Sekunde, dass das Radio ein gleichmäßiges Rauschen hört!',
        sci: '10⁶⁰ Atome (etwa 800 Sonnenmassen Wasserstoff): mit drei Vierteln in F = 1 etwa 2 × 10⁴⁵ Photonen pro Sekunde.',
      },
      galaxy: {
        kid: 'Der ganze gasförmige Wasserstoff der Milchstraße: etwa 10⁶⁷ Atome. Zusammen flüstern sie so laut, dass Radioteleskope sie entlang der ganzen Milchstraße hören.',
        sci: 'Etwa 10⁶⁷ Atome, einige Milliarden Sonnenmassen atomares Gas: etwa 2 × 10⁵² Photonen pro Sekunde.',
      },
      ruler: {
        kid: 'Dieses Lineal ist 21 Zentimeter lang: genau eine Welle des Wasserstoffs. Ein Blatt A4-Papier ist auch 21 Zentimeter breit!',
        sci: 'λ = c/ν = 21,106 cm; ein A4-Blatt ist 21,0 cm breit.',
      },
      radioLoud: {
        kid: 'Hörst du es? Das grüne magische Auge des Radios ist weit offen: Billionen und Aberbillionen Atome flüstern gleichzeitig.',
        sci: 'Das magische Auge (eine Abstimmanzeigeröhre der 1950er-Jahre) schließt seinen Schatten, wenn das Signal wächst: die summierte Emission vieler Atome.',
      },
      radioQuiet: {
        kid: 'Stille. Ein Atom flüstert viel zu selten, um es zu hören. Schieb mehr Atome dazu!',
        sci: 'Zu wenige Atome: Die erwartete Photonenrate ist verschwindend klein.',
      },
    },
    panel: {
      kid: [
        'Ein Wasserstoffatom ist ein Proton mit einem Elektron. Beide drehen sich wie winzige Kreisel, und jedes ist ein winziger Magnet. Zeigen ihre Pfeile in dieselbe Richtung, hat das Atom ein winziges bisschen Extra-Energie. Ganz selten klappt das Elektron um, und diese Extra-Energie fliegt als Radiowelle davon, genau 21 Zentimeter lang.',
        'Ein Atom wartet etwa 11 Millionen Jahre auf dieses Umklappen! Aber das All ist voller Wasserstoff, und alle Atome zusammen flüstern laut. Hendrik van de Hulst hat das 1944 ausgerechnet, und 1951 haben Harold Ewen und Edward Purcell es zum ersten Mal gehört, in Harvard.',
      ],
      sci: [
        'Der Grundzustand des Wasserstoffs (1s) ist durch die Hyperfeinwechselwirkung der magnetischen Momente von Elektron und Proton aufgespalten: F = 1 (Spins parallel) liegt 5,87 µeV über F = 0 (antiparallel). Der Übergang ist ein magnetischer Dipolübergang und stark verboten: A = 2,88 × 10⁻¹⁵ s⁻¹, eine mittlere Lebensdauer von etwa 11 Millionen Jahren; ν = 1420,405751768 MHz, λ = 21,106 cm.',
        'Im interstellaren Gas bestimmen Stöße die Besetzungen (3:1 nach den statistischen Gewichten, da hν/k nur 0,068 K beträgt), deshalb wächst die Emission mit der Säule der Atome. Vorhergesagt von van de Hulst 1944; nachgewiesen von Ewen und Purcell in Harvard am 25. März 1951 und im selben Jahr bestätigt von Muller und Oort in den Niederlanden und von Christiansen und Hindman in Australien; die Arbeiten erschienen im September 1951 zusammen in „Nature“.',
      ],
    },
  },
  plaque: {
    label: 'Die Pioneer-Plakette',
    title: 'Ein Brief an Außerirdische',
    slider: 'Deine Größe',
    caption: 'Die Pioneer-Plakette, 1972 (eine riesige Kopie)',
    postTitle: 'Deine Größe in Wasserstoffwellen',
    unit: { kid: '1 = 21 cm', sci: '1 = 21 cm und 0,7 ns' },
    eight: '8 × 21 cm = 168 cm',
    reading: { kid: '{cm} cm: {u} Wellen, binär {bin}', sci: '{cm} cm = {u} Einheiten, binär {bin}' },
    buttons: { h: 'Das Wasserstoffzeichen', woman: 'Die Frau', pulsars: 'Der Linienstern', planets: 'Die Planeten', post: 'Miss mich' },
    hints: {
      h: 'Tipp auf das Wasserstoffzeichen oben links',
      woman: 'Tipp auf die Frau',
      pulsars: 'Tipp auf den Linienstern',
      planets: 'Tipp auf die Reihe der Planeten',
      post: 'Tipp auf den Messpfahl',
      again: 'Tipp auf den Pfahl oder einen Teil der Plakette',
      watch: 'Schau auf die Plakette',
    },
    says: {
      h: {
        kid: 'Diese zwei Kreise sind zwei Wasserstoffatome, vor und nach dem Umklappen. Der kleine Strich darunter bedeutet 1: eine Wasserstoffwelle, 21 Zentimeter. Das ist das Lineal der Plakette, und jeder Forscher, egal wo, würde es kennen!',
        sci: 'Der Hyperfeinübergang des neutralen Wasserstoffs; der Strich darunter ist die binäre 1, die die Einheiten festlegt: eine Länge von 21 cm und eine Zeit von 1/(1420 MHz), etwa 0,7 ns. Alle Zahlen der Plakette zählen in ihnen.',
      },
      woman: {
        kid: 'Neben der Frau steht eine Zahl in Binärschrift: 1000, das ist 8. Acht Wasserstoffwellen: 8 × 21 cm = 168 cm. So kann jeder, der sie findet, ausrechnen, wie groß wir sind!',
        sci: 'Die Klammer zeigt |−−−, binär 1000 = 8 Einheiten: 8 × 21 cm ≈ 168 cm. Der Umriss der Sonde hinter den Figuren, im selben Maßstab, ist eine zweite Kontrolle.',
      },
      pulsars: {
        kid: 'Dieser Linienstern ist eine Karte unseres Zuhauses. Vierzehn Linien zeigen zu Pulsaren: toten Sternen, die sich drehen und blinken wie Leuchttürme, jeder in seinem eigenen Takt. Die lange Linie zeigt zur Mitte unserer Galaxis.',
        sci: '15 Linien von der Sonne aus: 14 zu Pulsaren, ihre Längen die relativen Entfernungen, ihre binären Striche die Perioden in Einheiten von 0,7 ns; die lange führt zum galaktischen Zentrum. Pulsare werden in bekanntem Tempo langsamer, deshalb datieren die Perioden auch den Start.',
      },
      planets: {
        kid: 'Die Sonne und ihre Planeten in einer Reihe. Das kleine Raumschiff startet vom dritten Planeten, unserer Erde, fliegt am Jupiter vorbei, dem größten, und hinaus ins All.',
        sci: 'Das Sonnensystem mit binären Entfernungen in Zehnteln der Merkurbahn; die Bahn verlässt den dritten Planeten und passiert Jupiter. Pioneer 11 wurde später zum Saturn geschickt, deshalb ist die Bahn auf ihrer Kopie falsch.',
      },
      post: {
        kid: 'Du bist {cm} cm groß: Das sind etwa {u} Wasserstoffwellen. Gerundet {n}, und das ist binär {bin}. Jetzt könnte man dich auch auf eine Plakette zeichnen!',
        sci: '{cm} cm = {u} Einheiten von 21,106 cm; gerundet {n}, also binär {bin}, so wie die Plakette es schreiben würde.',
      },
      where: {
        kid: 'Probier das Wasserstoffzeichen oben links, die Frau, den Linienstern oder die Planeten unten.',
        sci: 'Tipp auf einen Teil: das Hyperfeinzeichen, die Figuren, die Pulsarkarte oder das Sonnensystem.',
      },
    },
    panel: {
      kid: [
        '1972 und 1973 wurden zwei Raumsonden, Pioneer 10 und Pioneer 11, am Jupiter vorbei und weiter hinaus aus dem Sonnensystem geschickt. Jede trägt eine goldene Plakette: einen Brief für jeden, der sie eines Tages finden könnte, in ferner Zukunft. Wie schreibt man jemandem, der keines unserer Wörter und keine unserer Zahlen kennt? Mit etwas, das er auch kennen muss: Wasserstoff!',
        'Jedes Wasserstoffatom im Universum flüstert dieselbe 21-cm-Welle, deshalb nimmt die Plakette sie als Lineal und als Uhr. Die Frau ist 8 dieser Wellen groß. Carl Sagan und Frank Drake haben die Plakette entworfen, und Linda Salzman Sagan hat sie gezeichnet. Miss dich am Pfahl in Wasserstoffwellen!',
      ],
      sci: [
        'Die Plaketten, etwa 229 mal 152 mm aus golden eloxiertem Aluminium, sind an den Antennenstreben von Pioneer 10 (gestartet im März 1972) und Pioneer 11 (April 1973) befestigt, wo sie vor interstellarem Staub geschützt sind. Entworfen von Carl Sagan und Frank Drake und gezeichnet von Linda Salzman Sagan, legen sie ihre Einheiten über den Hyperfeinübergang des Wasserstoffs fest: 21 cm und etwa 0,7 ns.',
        'In diesen Einheiten geben die Binärzahlen die Größe der Frau (8 Einheiten, etwa 168 cm), die Perioden der Pulsare und die Entfernungen der Planeten an. Pioneer 11 war 1995 zum letzten Mal zu hören, Pioneer 10 im Jahr 2003; beide gleiten weiter hinaus zwischen die Sterne. Die Kopie hier ist vereinfacht: Ihre Pulsarlinien und Zahlen sind nicht die echten.',
      ],
    },
  },
}

export const RADIO_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
