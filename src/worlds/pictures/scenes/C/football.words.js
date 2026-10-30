// The words of carbon's football room ("A molecule shaped like a football"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/C.js (the easel shows it); the room tells how C60 was found and what rolled-up carbon
// can do. Carbon's gallery (wings/carbon) already shows the molecules themselves.
// Sources: Kroto, Heath, O'Brien, Curl and Smalley, "C60: Buckminsterfullerene", Nature 318, 162 (1985),
// received 13 September 1985 (the Nobel Foundation's press release of 1996): the machine (the second
// harmonic of a Q-switched Nd:YAG laser, about 30 mJ a pulse, a rotating graphite disc, a dense pulse of
// helium, a time-of-flight mass spectrometer) and the three clustering conditions (after the helium had
// passed, a broad spread with C60 largest but not dominant; at the helium's peak, C60 about five times
// its neighbours; with the integrating cup, C60 about 40 times and more than half of the large clusters,
// C70 about 5%). Kroto on the Expo 67 dome and the library book that Smalley borrowed (Sheffield's Kroto
// archive); Smalley's paper hexagons and pentagons one evening at home (The Scientist); William Veech,
// chair of mathematics at Rice, named it a soccer ball (his biography). Nanotubes: Yu and coworkers,
// Science 2000 (outer shells broke at 11 to 63 GPa); Peng and coworkers, 2008 (about 100 GPa). Some
// accounts name a third student, Yuan Liu; the room names the paper's authors only.
// Placeholders: {h} and {p} (hexagons and pentagons still missing).
export const FOOTBALL_WORDS = {
  en: {
    title: 'Rice University, 1985',
    greet: {
      kid: 'We are inside the picture: a laboratory at Rice University in Houston, Texas, in September 1985. Here a team zapped graphite with a laser and found a molecule nobody had ever seen: a ball of 60 carbon atoms. The picture\'s story is on the easel beside you.',
      sci: 'Richard Smalley\'s laboratory at Rice University, Houston, September 1985: the laser-vaporization cluster-beam machine, its time-of-flight mass spectrometer, a chalkboard. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Harry Kroto came all the way from England. He wanted to know how long chains of carbon atoms are made near old giant stars, and Smalley\'s machine could make clusters of carbon to study.',
        'The team was five people: Harold Kroto, Robert Curl and Richard Smalley, with two students, James Heath and Sean O\'Brien. In 1996 Kroto, Curl and Smalley won the Nobel Prize in Chemistry.',
        'Kroto remembered a giant dome he had visited at the world\'s fair in Montreal in 1967, built by the architect Buckminster Fuller. That is where the molecule\'s name comes from: buckminsterfullerene, or buckyball for short.',
        'In 1991 Sumio Iijima in Japan looked through a very powerful microscope at carbon made in an electric spark, and saw tiny tubes of carbon: nanotubes.',
      ],
      sci: [
        'Kroto (University of Sussex) was after the long carbon chains that radio astronomers had found in interstellar clouds, and suspected they form round carbon-rich red giant stars; Smalley and Curl\'s cluster machine could make carbon clusters in the laboratory.',
        'The paper "C₆₀: Buckminsterfullerene" by Kroto, Heath, O\'Brien, Curl and Smalley reached Nature on 13 September 1985, after about two weeks of experiments, and was published on 14 November. Kroto, Curl and Smalley shared the Nobel Prize in Chemistry in 1996.',
        'At Expo 67 in Montreal, Buckminster Fuller\'s United States pavilion was a geodesic dome 76 m across. Kroto had visited it, and it was the picture in his mind when the team looked for a closed cage.',
        'C₆₀ in bulk came in 1990, when Krätschmer, Huffman and coworkers made enough of it from carbon soot to see and to crystallize. Iijima\'s paper of 1991 made multiwalled carbon nanotubes famous; single-walled ones followed in 1993.',
      ],
    },
    calendar: 'SEPTEMBER 1985',
    poster: 'Expo 67, Montreal',
    beam: {
      label: 'The cluster machine',
      title: 'The mysterious peak',
      tags: { laser: 'laser', helium: 'helium', disc: 'graphite' },
      axis: { kid: 'carbon atoms in a cluster', sci: 'mass (u)' },
      slider: 'Helium and time to stick together',
      levels: { low: 'after the helium has passed', mid: 'at the peak of the helium', high: 'at the peak, with the extra cup' },
      hints: { fire: 'Tap the laser to fire it at the graphite', helium: 'Tap the helium bottle to add helium', look: 'Look at the screen, or tap the laser to stop it' },
      buttons: { fire: 'Fire the laser', stop: 'Stop the laser', helium: 'More helium' },
      says: {
        fire: {
          kid: 'Zap! The laser hits the spinning graphite ten times a second. Carbon atoms boil off, stick together in the helium, and race down the tube. The screen draws a line for each size of cluster.',
          sci: 'Firing: 532 nm pulses at 10 per second vaporize the rotating graphite disc into the helium; the clusters expand into the vacuum and the time-of-flight spectrometer sorts them by mass.',
        },
        low: {
          kid: 'Hardly any helium: clusters of every even size, and 60 only a little taller than the rest.',
          sci: 'Laser fired after most of the helium pulse had passed: a broad spread of even-numbered clusters, C₆₀ the largest but not dominant.',
        },
        mid: {
          kid: 'More helium: the clusters bump into each other more, and 60 stands out, about five times taller than its neighbours. 70 grows too!',
          sci: 'Fired at the helium\'s maximum density: C₆₀ about five times its neighbours, C₇₀ strong as well.',
        },
        high: {
          kid: 'Helium and extra time to bump around: now 60 towers over everything! What shape could 60 carbon atoms make that is so tough?',
          sci: 'With the integrating cup (more collisions before the expansion) C₆₀ dominates: about 40 times its neighbours, more than half of all large clusters; C₇₀ about 5%.',
        },
        set: { kid: 'Helium set. Tap the laser to see what it does.', sci: 'Clustering conditions set; fire the laser.' },
        stop: { kid: 'Laser off. The last picture stays on the screen.', sci: 'Laser off; the last spectrum is held.' },
      },
      panel: {
        kid: [
          'This is the machine Smalley\'s team built. A laser zaps a spinning disc of graphite, the black stuff in pencils, and carbon atoms fly off. A puff of helium gas cools them down, and they stick together into clusters.',
          'Then the clusters race down a long tube, and the lightest arrive first. The screen draws one line for each size: the taller the line, the more clusters of that size.',
          'In September 1985 one line kept standing out: clusters of exactly 60 carbon atoms. With more helium and more time it grew taller and taller. The team had found something special. But what was it?',
        ],
        sci: [
          'Laser vaporization into a supersonic cluster beam: the second harmonic of a Q-switched Nd:YAG laser (532 nm, about 30 mJ a pulse) vaporizes a rotating graphite disc into a dense pulse of helium; the carbon condenses into clusters, which expand into vacuum as a supersonic beam and are ionized by a second, ultraviolet laser.',
          'Time-of-flight mass spectrometry: ions given the same energy fly at speeds proportional to 1/√m, so lighter clusters reach the detector first. Above about C₄₀ only even-numbered clusters appear. C₆₀ has a mass of 720 u (12 u a carbon atom), C₇₀ 840 u.',
          'The clustering conditions decided the spectrum (Nature, 1985): fired after most of the helium had passed, a broad spread; at maximum helium density, C₆₀ about five times its neighbours; with an "integrating cup" added for more collisions, about 40 times. Exxon\'s group (Rohlfing, Cox and Kaldor, 1984) had seen the even clusters before without explaining C₆₀.',
        ],
      },
    },
    ball: {
      label: 'Smalley\'s paper model',
      title: 'Hexagons and pentagons',
      board: { hex: 'hexagons', pent: 'pentagons', corners: 'corners' },
      hints: {
        start: 'Tap the hexagons or the pentagons to tape one on',
        flat: 'Flat as a floor. Tap the pentagons',
        round: 'Tap the hexagons to go round the pentagon',
        both: 'Still missing hexagons ({h}) and pentagons ({p})',
        hex: 'Still missing hexagons ({h})',
        pent: 'Still missing pentagons ({p})',
        closed: 'Closed! Tap the ball to put an atom at every corner',
        atoms: 'Tap the ball to take it apart',
      },
      buttons: { hex: 'Tape on a hexagon', pent: 'Tape on a pentagon', atoms: 'An atom at every corner', apart: 'Take it apart' },
      says: {
        flat: {
          kid: 'Hexagons fit together like floor tiles, and they stay flat. Smalley tried hexagons first too, like the rings in a sheet of graphite.',
          sci: 'Hexagons alone tile the plane: three 120° corners make exactly 360°, so the sheet stays flat, like a layer of graphite.',
        },
        still: {
          kid: 'However many hexagons you tape, it stays flat. A flat sheet can never close into a ball!',
          sci: 'Still flat: no number of hexagons alone can close a cage.',
        },
        curl: {
          kid: 'A pentagon! Its corners are a little narrower, so the hexagons round it have to bend up into a bowl.',
          sci: 'At a pentagon\'s corner the faces add up to 108° + 120° + 120° = 348°: 12° short of flat, so the sheet curves.',
        },
        apartP: {
          kid: 'Pentagons never touch each other in this ball: each one sits among hexagons. Tape hexagons round it first.',
          sci: 'In C₆₀ no two pentagons share an edge (the isolated-pentagon rule): each is ringed by five hexagons.',
        },
        noHex: {
          kid: 'No hexagon fits now: the gaps left need pentagons.',
          sci: 'All 20 hexagons are in; every gap left is a pentagon.',
        },
        closed: {
          kid: 'It closed! 12 pentagons and 20 hexagons make a ball with 60 corners: one for each carbon atom. When Smalley showed his paper ball, a mathematician at Rice told him it was a football.',
          sci: 'Closed: 12 pentagons, 20 hexagons, 60 vertices, 90 edges, the truncated icosahedron. William Veech, chair of mathematics at Rice, recognized it as a soccer ball.',
        },
        atoms: {
          kid: 'A carbon atom at every corner: that is C₆₀, the buckyball. Each atom is joined to three neighbours.',
          sci: 'One carbon at each vertex, each bonded to three: C₆₀, 0.71 nm across from nucleus to nucleus, bonds of 1.40 Å between two hexagons and 1.45 Å between a hexagon and a pentagon.',
        },
        apart: { kid: 'Taken apart: the paper is ready for another try.', sci: 'Model taken apart.' },
        dome: {
          kid: 'Buckminster Fuller\'s dome at the world\'s fair of 1967. Look closely: among all its hexagons there are a few pentagons. Without them a dome cannot curve round.',
          sci: 'The US pavilion at Expo 67: a geodesic dome 76 m across, a three-quarter sphere. A geodesic sphere has 12 points where five triangles meet instead of six; they do what C₆₀\'s pentagons do.',
        },
      },
      panel: {
        kid: [
          'What shape could 60 carbon atoms make that was so tough? The team guessed a hollow cage, with no loose ends. Kroto remembered Buckminster Fuller\'s great dome, and Smalley borrowed a book about Fuller\'s domes from the library.',
          'One evening Smalley tried paper. Hexagons alone stayed flat, so he added pentagons. With 12 pentagons and 20 hexagons, the paper closed into a ball with exactly 60 corners.',
          'The team named the molecule buckminsterfullerene, after Fuller. Most people call it the buckyball.',
        ],
        sci: [
          'Why a cage: a flat fragment of 60 atoms would have dangling bonds round its edge; closing it ties them all up, which explains the cluster\'s stability. Kroto recalled Fuller\'s dome at Expo 67 and suggested a book on Fuller\'s domes from the library; Smalley borrowed it and built the model at home from paper hexagons and pentagons.',
          'Euler\'s formula (V − E + F = 2), with three faces at every corner, forces any closed cage of pentagons and hexagons to have exactly 12 pentagons; the number of hexagons may vary (C₇₀ has 25). C₆₀, with 20, is the smallest in which no two pentagons touch.',
          'The truncated icosahedron (symmetry Ih): 60 vertices, 90 edges, 32 faces. The structure was confirmed once C₆₀ could be made in visible amounts (1990): its carbon-13 NMR spectrum is a single line, as 60 identical atoms should give.',
        ],
      },
    },
    tube: {
      label: 'Rolled-up carbon',
      title: 'Nanotubes',
      tags: { steel: 'steel', tube: 'nanotube', armchair: 'armchair', zigzag: 'zigzag' },
      hints: {
        roll: 'Tap armchair or zigzag to roll the sheet',
        hang: 'Tap the weights to hang one on each wire',
        more: 'Tap the weights to hang on another',
        snapped: 'The steel snapped! Tap the weights for more on the tube',
        off: 'Tap a hook to take the weights off',
      },
      buttons: { armchair: 'Roll it armchair', zigzag: 'Roll it zigzag', unroll: 'Unroll it', weight: 'Hang a weight', off: 'Take the weights off' },
      says: {
        armchair: {
          kid: 'Rolled this way, the rim of the tube looks like a row of little armchairs. The tube on the hook is just as thin as the steel wire next to it.',
          sci: 'Armchair (6,6): rolled along the armchair direction, 0.81 nm across, metallic.',
        },
        zigzag: {
          kid: 'Rolled the other way, the rim zigzags. The tube on the hook is just as thin as the steel wire next to it.',
          sci: 'Zigzag (10,0): rolled along the zigzag direction, 0.78 nm across, a semiconductor (10 is not a multiple of 3).',
        },
        unroll: { kid: 'Flat again: a sheet of graphene, one atom thick.', sci: 'Unrolled: a graphene sheet.' },
        hang: { kid: 'One more weight on each. Both still hold.', sci: 'Load raised: both hold.' },
        snap: {
          kid: 'Ping! The steel wire snapped. The nanotube, just as thin, still holds on.',
          sci: 'The steel fails first: the strongest steel wire breaks at about 2 to 3 GPa, a nanotube\'s wall at tens of GPa.',
        },
        hold: {
          kid: 'All six! A nanotube could hold tens of times more than steel of the same thickness.',
          sci: 'Still holding: single nanotube shells have been measured to break only near 100 GPa.',
        },
        full: { kid: 'That was the last weight. Tap a hook to take them off.', sci: 'No weights left; unload to start again.' },
        off: { kid: 'Weights off, and a new steel wire is hung up.', sci: 'Unloaded; the steel wire replaced.' },
        first: { kid: 'Roll the sheet into a tube first!', sci: 'Roll the sheet first.' },
      },
      panel: {
        kid: [
          'Roll up a sheet of graphene, carbon\'s honeycomb just one atom thick, and you get a nanotube. Like the buckyball, it has no loose edges along its sides.',
          'How you roll it matters: one way the rim looks like armchairs, the other way it zigzags. The two kinds even carry electricity differently.',
          'A real nanotube is about 1 nanometre wide, tens of thousands of times thinner than a hair. Pulled hard, it is among the strongest things ever measured: much stronger than steel of the same thickness.',
        ],
        sci: [
          'A single-walled nanotube is a graphene strip rolled along its chiral vector C = n a₁ + m a₂ and closed without a seam: (n, n) armchair, (n, 0) zigzag, any other chiral. Diameter d = (a/π)√(n² + nm + m²), a = 0.246 nm: 0.81 nm for (6,6), 0.78 nm for (10,0).',
          'In the simplest picture a tube is metallic when n − m is a multiple of 3 (every armchair tube) and a semiconductor otherwise.',
          'Measured on single tubes: a Young\'s modulus of about 1 TPa (steel: about 200 GPa) and tensile strengths of tens of GPa, about 100 GPa for defect-free shells; the strongest steel wires break at 2 to 3 GPa. Ropes and fibres of nanotubes are far weaker, as the tubes slide past each other. A hair is 50 to 100 µm thick: 50 000 to 100 000 times a 1 nm tube.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Universidade Rice, 1985',
    greet: {
      kid: 'Estamos dentro da imagem: um laboratório da Universidade Rice, em Houston, no Texas, em setembro de 1985. Aqui uma equipa disparou um laser contra grafite e encontrou uma molécula que ninguém tinha visto: uma bola de 60 átomos de carbono. A história da imagem está no cavalete ao teu lado.',
      sci: 'O laboratório de Richard Smalley na Universidade Rice, Houston, setembro de 1985: a máquina de feixes de agregados por vaporização laser, o seu espetrómetro de massa de tempo de voo, um quadro de giz. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O Harry Kroto veio de propósito de Inglaterra. Queria saber como se formam longas cadeias de átomos de carbono perto de estrelas gigantes velhas, e a máquina do Smalley conseguia fazer agregados de carbono para estudar.',
        'A equipa era de cinco pessoas: Harold Kroto, Robert Curl e Richard Smalley, com dois estudantes, James Heath e Sean O\'Brien. Em 1996, Kroto, Curl e Smalley ganharam o Prémio Nobel da Química.',
        'O Kroto lembrou-se de uma cúpula gigante que tinha visitado na exposição mundial de Montreal, em 1967, construída pelo arquiteto Buckminster Fuller. É daí que vem o nome da molécula: buckminsterfulereno, ou buckyball, para encurtar.',
        'Em 1991, Sumio Iijima, no Japão, olhou por um microscópio muito potente para carbono feito numa faísca elétrica e viu tubinhos de carbono: os nanotubos.',
      ],
      sci: [
        'Kroto (Universidade de Sussex) interessava-se pelas longas cadeias de carbono que os radioastrónomos tinham encontrado nas nuvens interestelares, e suspeitava que se formam em torno de gigantes vermelhas ricas em carbono; a máquina de agregados de Smalley e Curl podia produzir agregados de carbono em laboratório.',
        'O artigo «C₆₀: Buckminsterfullerene», de Kroto, Heath, O\'Brien, Curl e Smalley, chegou à Nature a 13 de setembro de 1985, após cerca de duas semanas de experiências, e foi publicado a 14 de novembro. Kroto, Curl e Smalley partilharam o Prémio Nobel da Química de 1996.',
        'Na Expo 67, em Montreal, o pavilhão dos Estados Unidos de Buckminster Fuller era uma cúpula geodésica com 76 m de diâmetro. Kroto tinha-a visitado, e era essa a imagem que tinha em mente quando a equipa procurava uma gaiola fechada.',
        'O C₆₀ em quantidade chegou em 1990, quando Krätschmer, Huffman e colaboradores o obtiveram da fuligem de carbono em quantidade suficiente para o ver e cristalizar. O artigo de Iijima de 1991 tornou famosos os nanotubos de carbono de paredes múltiplas; os de parede simples seguiram-se em 1993.',
      ],
    },
    calendar: 'SETEMBRO 1985',
    poster: 'Expo 67, Montreal',
    beam: {
      label: 'A máquina de agregados',
      title: 'O pico misterioso',
      tags: { laser: 'laser', helium: 'hélio', disc: 'grafite' },
      axis: { kid: 'átomos de carbono num agregado', sci: 'massa (u)' },
      slider: 'Hélio e tempo para se juntarem',
      levels: { low: 'depois de o hélio passar', mid: 'no pico do hélio', high: 'no pico, com o copo extra' },
      hints: { fire: 'Toca no laser para o disparar contra a grafite', helium: 'Toca na garrafa de hélio para juntar hélio', look: 'Olha para o ecrã, ou toca no laser para o parar' },
      buttons: { fire: 'Disparar o laser', stop: 'Parar o laser', helium: 'Mais hélio' },
      says: {
        fire: {
          kid: 'Zás! O laser atinge a grafite que gira, dez vezes por segundo. Os átomos de carbono soltam-se, juntam-se no hélio e correm pelo tubo. O ecrã desenha uma risca para cada tamanho de agregado.',
          sci: 'A disparar: impulsos de 532 nm, 10 por segundo, vaporizam o disco de grafite rotativo para dentro do hélio; os agregados expandem-se no vácuo e o espetrómetro de tempo de voo separa-os pela massa.',
        },
        low: {
          kid: 'Quase nenhum hélio: agregados de todos os tamanhos pares, e o 60 só um pouco mais alto do que os outros.',
          sci: 'Laser disparado depois de passar a maior parte do impulso de hélio: uma distribuição larga de agregados pares, o C₆₀ o maior, mas sem dominar.',
        },
        mid: {
          kid: 'Mais hélio: os agregados chocam mais uns com os outros, e o 60 destaca-se, cerca de cinco vezes mais alto do que os vizinhos. O 70 também cresce!',
          sci: 'Disparado na densidade máxima de hélio: o C₆₀ cerca de cinco vezes os vizinhos, e o C₇₀ também forte.',
        },
        high: {
          kid: 'Hélio e tempo extra para chocarem: agora o 60 está muito acima de tudo! Que forma podem fazer 60 átomos de carbono para serem tão resistentes?',
          sci: 'Com o copo integrador (mais colisões antes da expansão) o C₆₀ domina: cerca de 40 vezes os vizinhos, mais de metade de todos os agregados grandes; o C₇₀ cerca de 5%.',
        },
        set: { kid: 'Hélio acertado. Toca no laser para ver o que acontece.', sci: 'Condições de agregação acertadas; dispara o laser.' },
        stop: { kid: 'Laser desligado. A última imagem fica no ecrã.', sci: 'Laser desligado; o último espetro fica retido.' },
      },
      panel: {
        kid: [
          'Esta é a máquina que a equipa do Smalley construiu. Um laser atinge um disco de grafite a girar, a coisa preta dos lápis, e os átomos de carbono saltam. Um sopro de gás hélio arrefece-os e eles juntam-se em agregados.',
          'Depois os agregados correm por um tubo comprido, e os mais leves chegam primeiro. O ecrã desenha uma risca para cada tamanho: quanto mais alta a risca, mais agregados desse tamanho.',
          'Em setembro de 1985 havia uma risca que se destacava sempre: agregados de exatamente 60 átomos de carbono. Com mais hélio e mais tempo, ficava cada vez mais alta. A equipa tinha encontrado algo especial. Mas o que era?',
        ],
        sci: [
          'Vaporização laser num feixe supersónico de agregados: o segundo harmónico de um laser Nd:YAG com comutação Q (532 nm, cerca de 30 mJ por impulso) vaporiza um disco de grafite rotativo para dentro de um impulso denso de hélio; o carbono condensa em agregados, que se expandem no vácuo como um feixe supersónico e são ionizados por um segundo laser, ultravioleta.',
          'Espetrometria de massa de tempo de voo: iões com a mesma energia voam a velocidades proporcionais a 1/√m, por isso os agregados mais leves chegam primeiro ao detetor. Acima de cerca de C₄₀ só aparecem agregados com número par de átomos. O C₆₀ tem massa 720 u (12 u por átomo de carbono), o C₇₀ 840 u.',
          'As condições de agregação decidiam o espetro (Nature, 1985): disparando depois de passar a maior parte do hélio, uma distribuição larga; na densidade máxima de hélio, o C₆₀ cerca de cinco vezes os vizinhos; com um «copo integrador» acrescentado para mais colisões, cerca de 40 vezes. O grupo da Exxon (Rohlfing, Cox e Kaldor, 1984) já tinha visto os agregados pares, sem explicar o C₆₀.',
        ],
      },
    },
    ball: {
      label: 'O modelo de papel do Smalley',
      title: 'Hexágonos e pentágonos',
      board: { hex: 'hexágonos', pent: 'pentágonos', corners: 'cantos' },
      hints: {
        start: 'Toca nos hexágonos ou nos pentágonos para colar um',
        flat: 'Plano como um chão. Toca nos pentágonos',
        round: 'Toca nos hexágonos para rodear o pentágono',
        both: 'Ainda faltam hexágonos ({h}) e pentágonos ({p})',
        hex: 'Ainda faltam hexágonos ({h})',
        pent: 'Ainda faltam pentágonos ({p})',
        closed: 'Fechou! Toca na bola para pôr um átomo em cada canto',
        atoms: 'Toca na bola para a desmontar',
      },
      buttons: { hex: 'Colar um hexágono', pent: 'Colar um pentágono', atoms: 'Um átomo em cada canto', apart: 'Desmontar' },
      says: {
        flat: {
          kid: 'Os hexágonos encaixam como os mosaicos do chão, e ficam planos. O Smalley também começou pelos hexágonos, como os anéis de uma folha de grafite.',
          sci: 'Só hexágonos pavimentam o plano: três cantos de 120° somam exatamente 360°, por isso a folha fica plana, como uma camada de grafite.',
        },
        still: {
          kid: 'Por mais hexágonos que coles, fica plano. Uma folha plana nunca se fecha numa bola!',
          sci: 'Ainda plano: nenhum número de hexágonos sozinhos consegue fechar uma gaiola.',
        },
        curl: {
          kid: 'Um pentágono! Os cantos dele são um pouco mais estreitos, por isso os hexágonos à volta têm de dobrar para cima, numa tigela.',
          sci: 'No canto de um pentágono as faces somam 108° + 120° + 120° = 348°: faltam 12° para ficar plano, por isso a folha curva.',
        },
        apartP: {
          kid: 'Nesta bola os pentágonos nunca se tocam: cada um fica rodeado de hexágonos. Cola primeiro hexágonos à volta dele.',
          sci: 'No C₆₀ não há dois pentágonos com uma aresta em comum (a regra dos pentágonos isolados): cada um está rodeado por cinco hexágonos.',
        },
        noHex: {
          kid: 'Agora não cabe nenhum hexágono: os buracos que faltam precisam de pentágonos.',
          sci: 'Os 20 hexágonos já estão colados; cada buraco que falta é um pentágono.',
        },
        closed: {
          kid: 'Fechou! 12 pentágonos e 20 hexágonos fazem uma bola com 60 cantos: um para cada átomo de carbono. Quando o Smalley mostrou a bola de papel, um matemático da Universidade Rice disse-lhe que era uma bola de futebol.',
          sci: 'Fechado: 12 pentágonos, 20 hexágonos, 60 vértices, 90 arestas, o icosaedro truncado. William Veech, diretor do departamento de matemática da Rice, reconheceu nele uma bola de futebol.',
        },
        atoms: {
          kid: 'Um átomo de carbono em cada canto: é o C₆₀, a buckyball. Cada átomo está ligado a três vizinhos.',
          sci: 'Um carbono em cada vértice, cada um ligado a três: o C₆₀, com 0,71 nm de diâmetro de núcleo a núcleo, ligações de 1,40 Å entre dois hexágonos e de 1,45 Å entre um hexágono e um pentágono.',
        },
        apart: { kid: 'Desmontado: o papel está pronto para outra tentativa.', sci: 'Modelo desmontado.' },
        dome: {
          kid: 'A cúpula de Buckminster Fuller na exposição mundial de 1967. Olha bem: no meio de todos os hexágonos há alguns pentágonos. Sem eles, uma cúpula não consegue curvar.',
          sci: 'O pavilhão dos EUA na Expo 67: uma cúpula geodésica com 76 m de diâmetro, três quartos de esfera. Uma esfera geodésica tem 12 pontos onde se juntam cinco triângulos em vez de seis; fazem o mesmo que os pentágonos do C₆₀.',
        },
      },
      panel: {
        kid: [
          'Que forma podiam fazer 60 átomos de carbono para serem tão resistentes? A equipa pensou numa gaiola oca, sem pontas soltas. O Kroto lembrou-se da grande cúpula de Buckminster Fuller, e o Smalley foi buscar à biblioteca um livro sobre as cúpulas de Fuller.',
          'Uma noite, o Smalley experimentou com papel. Só com hexágonos ficava plano, por isso juntou pentágonos. Com 12 pentágonos e 20 hexágonos, o papel fechou-se numa bola com exatamente 60 cantos.',
          'A equipa deu à molécula o nome de buckminsterfulereno, em honra de Fuller. Quase toda a gente lhe chama buckyball.',
        ],
        sci: [
          'Porquê uma gaiola: um fragmento plano de 60 átomos teria ligações soltas à volta da borda; fechá-lo prende-as todas, o que explica a estabilidade do agregado. Kroto lembrou-se da cúpula de Fuller na Expo 67 e sugeriu um livro da biblioteca sobre as cúpulas de Fuller; Smalley requisitou-o e construiu o modelo em casa com hexágonos e pentágonos de papel.',
          'A fórmula de Euler (V − A + F = 2), com três faces em cada vértice, obriga qualquer gaiola fechada de pentágonos e hexágonos a ter exatamente 12 pentágonos; o número de hexágonos pode variar (o C₇₀ tem 25). O C₆₀, com 20, é a mais pequena em que não há dois pentágonos a tocar-se.',
          'O icosaedro truncado (simetria Ih): 60 vértices, 90 arestas, 32 faces. A estrutura foi confirmada quando o C₆₀ passou a ser produzido em quantidades visíveis (1990): o seu espetro de RMN de carbono-13 é uma única risca, como devem dar 60 átomos idênticos.',
        ],
      },
    },
    tube: {
      label: 'Carbono enrolado',
      title: 'Nanotubos',
      tags: { steel: 'aço', tube: 'nanotubo', armchair: 'cadeira', zigzag: 'ziguezague' },
      hints: {
        roll: 'Toca em cadeira ou ziguezague para enrolar a folha',
        hang: 'Toca nos pesos para pendurar um em cada fio',
        more: 'Toca nos pesos para pendurar mais um',
        snapped: 'O aço partiu! Toca nos pesos para pôr mais no tubo',
        off: 'Toca num gancho para tirar os pesos',
      },
      buttons: { armchair: 'Enrolar em cadeira', zigzag: 'Enrolar em ziguezague', unroll: 'Desenrolar', weight: 'Pendurar um peso', off: 'Tirar os pesos' },
      says: {
        armchair: {
          kid: 'Enrolado assim, a borda do tubo parece uma fila de cadeirinhas com braços. O tubo no gancho é tão fino como o fio de aço ao lado.',
          sci: 'Cadeira (armchair) (6,6): enrolado segundo a direção em cadeira, 0,81 nm de diâmetro, metálico.',
        },
        zigzag: {
          kid: 'Enrolado ao contrário, a borda faz ziguezague. O tubo no gancho é tão fino como o fio de aço ao lado.',
          sci: 'Ziguezague (10,0): enrolado segundo a direção em ziguezague, 0,78 nm de diâmetro, semicondutor (10 não é múltiplo de 3).',
        },
        unroll: { kid: 'Plano outra vez: uma folha de grafeno, com um átomo de espessura.', sci: 'Desenrolado: uma folha de grafeno.' },
        hang: { kid: 'Mais um peso em cada um. Os dois aguentam.', sci: 'Carga aumentada: os dois aguentam.' },
        snap: {
          kid: 'Ping! O fio de aço partiu. O nanotubo, igualmente fino, continua a aguentar.',
          sci: 'O aço cede primeiro: o fio de aço mais resistente parte a cerca de 2 a 3 GPa, a parede de um nanotubo a dezenas de GPa.',
        },
        hold: {
          kid: 'Os seis! Um nanotubo aguentaria dezenas de vezes mais do que aço da mesma espessura.',
          sci: 'Ainda aguenta: mediram-se paredes individuais de nanotubos que só partem perto dos 100 GPa.',
        },
        full: { kid: 'Era o último peso. Toca num gancho para os tirar.', sci: 'Não há mais pesos; descarrega para recomeçar.' },
        off: { kid: 'Pesos fora, e um fio de aço novo pendurado.', sci: 'Descarregado; o fio de aço substituído.' },
        first: { kid: 'Primeiro enrola a folha num tubo!', sci: 'Enrola primeiro a folha.' },
      },
      panel: {
        kid: [
          'Enrola uma folha de grafeno, o favo de mel de carbono com só um átomo de espessura, e obténs um nanotubo. Tal como a buckyball, não tem bordas soltas dos lados.',
          'A maneira de enrolar conta: de uma maneira a borda parece cadeirinhas com braços, da outra faz ziguezague. Os dois tipos até conduzem a eletricidade de forma diferente.',
          'Um nanotubo verdadeiro tem cerca de 1 nanómetro de largura, dezenas de milhares de vezes mais fino do que um cabelo. Puxado com força, está entre as coisas mais resistentes alguma vez medidas: muito mais resistente do que aço da mesma espessura.',
        ],
        sci: [
          'Um nanotubo de parede simples é uma tira de grafeno enrolada segundo o seu vetor quiral C = n a₁ + m a₂ e fechada sem costura: (n, n) em cadeira (armchair), (n, 0) em ziguezague, qualquer outro quiral. Diâmetro d = (a/π)√(n² + nm + m²), a = 0,246 nm: 0,81 nm para (6,6), 0,78 nm para (10,0).',
          'Na imagem mais simples, um tubo é metálico quando n − m é múltiplo de 3 (todos os tubos em cadeira) e semicondutor nos outros casos.',
          'Medido em tubos individuais: um módulo de Young de cerca de 1 TPa (aço: cerca de 200 GPa) e resistências à tração de dezenas de GPa, cerca de 100 GPa em paredes sem defeitos; os fios de aço mais resistentes partem a 2 a 3 GPa. Cordas e fibras de nanotubos são muito mais fracas, porque os tubos deslizam uns sobre os outros. Um cabelo tem 50 a 100 µm de espessura: 50 000 a 100 000 vezes um tubo de 1 nm.',
        ],
      },
    },
  },
  pl: {
    title: 'Uniwersytet Rice, 1985',
    greet: {
      kid: 'Jesteśmy w środku obrazka: w laboratorium Uniwersytetu Rice w Houston w Teksasie, we wrześniu 1985 roku. Tutaj zespół strzelał laserem w grafit i odkrył cząsteczkę, której nikt wcześniej nie widział: kulę z 60 atomów węgla. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Laboratorium Richarda Smalleya na Uniwersytecie Rice, Houston, wrzesień 1985: aparatura do wiązki klastrów z odparowaniem laserowym, jej spektrometr mas czasu przelotu, tablica. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Harry Kroto przyjechał aż z Anglii. Chciał się dowiedzieć, jak przy starych olbrzymich gwiazdach powstają długie łańcuchy atomów węgla, a maszyna Smalleya potrafiła robić klastry węgla do badań.',
        'Zespół liczył pięć osób: Harold Kroto, Robert Curl i Richard Smalley oraz dwaj studenci, James Heath i Sean O\'Brien. W 1996 roku Kroto, Curl i Smalley dostali Nagrodę Nobla z chemii.',
        'Kroto przypomniał sobie olbrzymią kopułę, którą zwiedził na wystawie światowej w Montrealu w 1967 roku, zbudowaną przez architekta Buckminstera Fullera. Stąd nazwa cząsteczki: buckminsterfuleren, a w skrócie buckyball.',
        'W 1991 roku Sumio Iijima w Japonii obejrzał pod bardzo silnym mikroskopem węgiel powstały w iskrze elektrycznej i zobaczył maleńkie rurki z węgla: nanorurki.',
      ],
      sci: [
        'Kroto (Uniwersytet Sussex) badał długie łańcuchy węglowe, które radioastronomowie znaleźli w obłokach międzygwiazdowych, i podejrzewał, że powstają wokół bogatych w węgiel czerwonych olbrzymów; aparatura Smalleya i Curla potrafiła wytwarzać klastry węgla w laboratorium.',
        'Praca „C₆₀: Buckminsterfullerene” Kroto, Heatha, O\'Briena, Curla i Smalleya dotarła do „Nature” 13 września 1985 roku, po mniej więcej dwóch tygodniach doświadczeń, i ukazała się 14 listopada. Kroto, Curl i Smalley otrzymali wspólnie Nagrodę Nobla z chemii w 1996 roku.',
        'Na Expo 67 w Montrealu pawilon Stanów Zjednoczonych zaprojektowany przez Buckminstera Fullera był kopułą geodezyjną o średnicy 76 m. Kroto ją zwiedził i właśnie ten obraz miał przed oczami, gdy zespół szukał zamkniętej klatki.',
        'C₆₀ w większych ilościach pojawił się w 1990 roku, gdy Krätschmer, Huffman i współpracownicy uzyskali go z sadzy tyle, by dało się go zobaczyć i skrystalizować. Praca Iijimy z 1991 roku rozsławiła wielościenne nanorurki węglowe; jednościenne pojawiły się w 1993 roku.',
      ],
    },
    calendar: 'WRZESIEŃ 1985',
    poster: 'Expo 67, Montreal',
    beam: {
      label: 'Maszyna do klastrów',
      title: 'Tajemniczy pik',
      tags: { laser: 'laser', helium: 'hel', disc: 'grafit' },
      axis: { kid: 'atomy węgla w klastrze', sci: 'masa (u)' },
      slider: 'Hel i czas na sklejanie',
      levels: { low: 'po przejściu helu', mid: 'w szczycie dopływu helu', high: 'w szczycie, z dodatkowym kubkiem' },
      hints: { fire: 'Stuknij laser, żeby strzelić w grafit', helium: 'Stuknij butlę z helem, żeby dodać helu', look: 'Patrz na ekran albo stuknij laser, żeby go wyłączyć' },
      buttons: { fire: 'Włącz laser', stop: 'Wyłącz laser', helium: 'Więcej helu' },
      says: {
        fire: {
          kid: 'Bzzt! Laser trafia w wirujący grafit dziesięć razy na sekundę. Atomy węgla odparowują, sklejają się w helu i pędzą rurą. Ekran rysuje kreskę dla każdej wielkości klastra.',
          sci: 'Strzały: impulsy 532 nm, 10 na sekundę, odparowują wirujący grafitowy dysk do helu; klastry rozprężają się w próżni, a spektrometr czasu przelotu sortuje je według masy.',
        },
        low: {
          kid: 'Prawie bez helu: klastry każdej parzystej wielkości, a 60 tylko trochę wyższe od reszty.',
          sci: 'Laser wystrzelony, gdy większość impulsu helu już przeszła: szeroki rozkład klastrów o parzystej liczbie atomów, C₆₀ największy, ale nie dominuje.',
        },
        mid: {
          kid: 'Więcej helu: klastry częściej się zderzają i 60 się wyróżnia, mniej więcej pięć razy wyższe od sąsiadów. 70 też rośnie!',
          sci: 'Strzał przy maksymalnej gęstości helu: C₆₀ około pięciu razy silniejszy od sąsiadów, C₇₀ też wyraźny.',
        },
        high: {
          kid: 'Hel i dodatkowy czas na zderzenia: teraz 60 góruje nad wszystkim! Jaki kształt z 60 atomów węgla może być tak wytrzymały?',
          sci: 'Z kubkiem integrującym (więcej zderzeń przed rozprężeniem) dominuje C₆₀: około 40 razy silniejszy od sąsiadów, ponad połowa wszystkich dużych klastrów; C₇₀ około 5%.',
        },
        set: { kid: 'Hel ustawiony. Stuknij laser i zobacz, co się stanie.', sci: 'Warunki tworzenia klastrów ustawione; włącz laser.' },
        stop: { kid: 'Laser wyłączony. Ostatni obraz zostaje na ekranie.', sci: 'Laser wyłączony; ostatnie widmo zostaje zachowane.' },
      },
      panel: {
        kid: [
          'To maszyna, którą zbudował zespół Smalleya. Laser strzela w wirujący krążek grafitu, tego czarnego czegoś z ołówków, i odrywają się atomy węgla. Podmuch helu je studzi, a one sklejają się w grudki, czyli klastry.',
          'Potem klastry pędzą długą rurą, a najlżejsze docierają pierwsze. Ekran rysuje jedną kreskę dla każdej wielkości: im wyższa kreska, tym więcej klastrów tej wielkości.',
          'We wrześniu 1985 roku jedna kreska ciągle się wyróżniała: klastry z dokładnie 60 atomów węgla. Z większą ilością helu i czasu rosła coraz wyżej. Zespół znalazł coś wyjątkowego. Tylko co to było?',
        ],
        sci: [
          'Odparowanie laserowe do naddźwiękowej wiązki klastrów: druga harmoniczna lasera Nd:YAG z przełączaniem dobroci (532 nm, około 30 mJ na impuls) odparowuje wirujący grafitowy dysk do gęstego impulsu helu; węgiel kondensuje w klastry, które rozprężają się w próżni jako wiązka naddźwiękowa i są jonizowane drugim laserem, ultrafioletowym.',
          'Spektrometria mas czasu przelotu: jony o tej samej energii lecą z prędkościami proporcjonalnymi do 1/√m, więc lżejsze klastry docierają do detektora pierwsze. Powyżej około C₄₀ pojawiają się tylko klastry o parzystej liczbie atomów. C₆₀ ma masę 720 u (12 u na atom węgla), C₇₀ 840 u.',
          'O widmie decydowały warunki tworzenia klastrów („Nature”, 1985): strzał po przejściu większości helu dawał szeroki rozkład; przy maksymalnej gęstości helu C₆₀ był około pięciu razy silniejszy od sąsiadów; z dodanym „kubkiem integrującym” dla większej liczby zderzeń około 40 razy. Grupa z Exxonu (Rohlfing, Cox i Kaldor, 1984) widziała wcześniej parzyste klastry, ale nie wyjaśniła C₆₀.',
        ],
      },
    },
    ball: {
      label: 'Papierowy model Smalleya',
      title: 'Sześciokąty i pięciokąty',
      board: { hex: 'sześciokąty', pent: 'pięciokąty', corners: 'wierzchołki' },
      hints: {
        start: 'Stuknij sześciokąty albo pięciokąty, żeby przykleić jeden',
        flat: 'Płaskie jak podłoga. Stuknij pięciokąty',
        round: 'Stuknij sześciokąty, żeby otoczyć pięciokąt',
        both: 'Wciąż brakuje sześciokątów ({h}) i pięciokątów ({p})',
        hex: 'Wciąż brakuje sześciokątów ({h})',
        pent: 'Wciąż brakuje pięciokątów ({p})',
        closed: 'Zamknięta! Stuknij kulę, żeby w każdym wierzchołku był atom',
        atoms: 'Stuknij kulę, żeby ją rozebrać',
      },
      buttons: { hex: 'Przyklej sześciokąt', pent: 'Przyklej pięciokąt', atoms: 'Atom w każdym wierzchołku', apart: 'Rozbierz' },
      says: {
        flat: {
          kid: 'Sześciokąty pasują do siebie jak płytki na podłodze i leżą płasko. Smalley też zaczął od sześciokątów, takich jak pierścienie w warstwie grafitu.',
          sci: 'Same sześciokąty wypełniają płaszczyznę: trzy kąty po 120° dają dokładnie 360°, więc warstwa jest płaska jak warstwa grafitu.',
        },
        still: {
          kid: 'Niezależnie od liczby sześciokątów wszystko leży płasko. Płaska warstwa nigdy nie zamknie się w kulę!',
          sci: 'Wciąż płasko: żadna liczba samych sześciokątów nie zamknie klatki.',
        },
        curl: {
          kid: 'Pięciokąt! Jego kąty są trochę węższe, więc sześciokąty wokół niego muszą wygiąć się w miseczkę.',
          sci: 'W wierzchołku pięciokąta ściany dają 108° + 120° + 120° = 348°: brakuje 12° do płaskości, więc warstwa się wygina.',
        },
        apartP: {
          kid: 'W tej kuli pięciokąty nigdy się nie stykają: każdy leży wśród sześciokątów. Najpierw otocz go sześciokątami.',
          sci: 'W C₆₀ żadne dwa pięciokąty nie mają wspólnej krawędzi (reguła izolowanych pięciokątów): każdy jest otoczony pięcioma sześciokątami.',
        },
        noHex: {
          kid: 'Teraz nie pasuje żaden sześciokąt: pozostałe dziury potrzebują pięciokątów.',
          sci: 'Wszystkie 20 sześciokątów jest na miejscu; każda pozostała dziura to pięciokąt.',
        },
        closed: {
          kid: 'Zamknęła się! 12 pięciokątów i 20 sześciokątów tworzy kulę z 60 wierzchołkami: po jednym na każdy atom węgla. Kiedy Smalley pokazał swoją papierową kulę, matematyk z Uniwersytetu Rice powiedział mu, że to piłka nożna.',
          sci: 'Zamknięta: 12 pięciokątów, 20 sześciokątów, 60 wierzchołków, 90 krawędzi, dwudziestościan ścięty. William Veech, kierownik wydziału matematyki Rice, rozpoznał w niej piłkę nożną.',
        },
        atoms: {
          kid: 'Atom węgla w każdym wierzchołku: to C₆₀, buckyball. Każdy atom jest połączony z trzema sąsiadami.',
          sci: 'Jeden węgiel w każdym wierzchołku, każdy związany z trzema: C₆₀, 0,71 nm średnicy od jądra do jądra, wiązania 1,40 Å między dwoma sześciokątami i 1,45 Å między sześciokątem a pięciokątem.',
        },
        apart: { kid: 'Rozebrana: papier jest gotowy do kolejnej próby.', sci: 'Model rozebrany.' },
        dome: {
          kid: 'Kopuła Buckminstera Fullera na wystawie światowej w 1967 roku. Przyjrzyj się: wśród wszystkich sześciokątów jest kilka pięciokątów. Bez nich kopuła nie mogłaby się zaokrąglić.',
          sci: 'Pawilon USA na Expo 67: kopuła geodezyjna o średnicy 76 m, trzy czwarte kuli. Sfera geodezyjna ma 12 punktów, w których spotyka się pięć trójkątów zamiast sześciu; robią to samo co pięciokąty w C₆₀.',
        },
      },
      panel: {
        kid: [
          'Jaki kształt z 60 atomów węgla mógł być tak wytrzymały? Zespół zgadywał, że to pusta klatka bez luźnych końców. Kroto przypomniał sobie wielką kopułę Buckminstera Fullera, a Smalley wypożyczył z biblioteki książkę o kopułach Fullera.',
          'Pewnego wieczoru Smalley spróbował z papierem. Same sześciokąty leżały płasko, więc dodał pięciokąty. Z 12 pięciokątów i 20 sześciokątów papier zamknął się w kulę z dokładnie 60 wierzchołkami.',
          'Zespół nazwał cząsteczkę buckminsterfulerenem, na cześć Fullera. Większość ludzi mówi na nią buckyball.',
        ],
        sci: [
          'Dlaczego klatka: płaski fragment z 60 atomów miałby wolne wiązania na brzegu; zamknięcie go wiąże je wszystkie, co tłumaczy trwałość klastra. Kroto przypomniał sobie kopułę Fullera z Expo 67 i zaproponował książkę o kopułach Fullera z biblioteki; Smalley ją wypożyczył i zbudował model w domu z papierowych sześciokątów i pięciokątów.',
          'Wzór Eulera (W − K + S = 2), przy trzech ścianach w każdym wierzchołku, wymusza, by każda zamknięta klatka z pięciokątów i sześciokątów miała dokładnie 12 pięciokątów; liczba sześciokątów może się zmieniać (C₇₀ ma ich 25). C₆₀, z 20, jest najmniejszą, w której żadne dwa pięciokąty się nie stykają.',
          'Dwudziestościan ścięty (symetria Ih): 60 wierzchołków, 90 krawędzi, 32 ściany. Strukturę potwierdzono, gdy C₆₀ dało się wytwarzać w widocznych ilościach (1990): jego widmo NMR węgla-13 to jedna linia, jak powinno być dla 60 identycznych atomów.',
        ],
      },
    },
    tube: {
      label: 'Zwinięty węgiel',
      title: 'Nanorurki',
      tags: { steel: 'stal', tube: 'nanorurka', armchair: 'fotel', zigzag: 'zygzak' },
      hints: {
        roll: 'Stuknij fotel albo zygzak, żeby zwinąć warstwę',
        hang: 'Stuknij ciężarki, żeby zawiesić po jednym na każdym drucie',
        more: 'Stuknij ciężarki, żeby zawiesić kolejny',
        snapped: 'Stal pękła! Stuknij ciężarki, żeby dołożyć na rurkę',
        off: 'Stuknij hak, żeby zdjąć ciężarki',
      },
      buttons: { armchair: 'Zwiń typu fotel', zigzag: 'Zwiń typu zygzak', unroll: 'Rozwiń', weight: 'Zawieś ciężarek', off: 'Zdejmij ciężarki' },
      says: {
        armchair: {
          kid: 'Zwinięta w ten sposób rurka ma brzeg jak rządek małych foteli. Rurka na haku jest tak samo cienka jak stalowy drut obok.',
          sci: 'Fotel (armchair) (6,6): zwinięta wzdłuż kierunku fotelowego, średnica 0,81 nm, metaliczna.',
        },
        zigzag: {
          kid: 'Zwinięta w drugą stronę ma brzeg w zygzak. Rurka na haku jest tak samo cienka jak stalowy drut obok.',
          sci: 'Zygzak (10,0): zwinięta wzdłuż kierunku zygzakowego, średnica 0,78 nm, półprzewodnik (10 nie jest wielokrotnością 3).',
        },
        unroll: { kid: 'Znowu płasko: warstwa grafenu grubości jednego atomu.', sci: 'Rozwinięta: warstwa grafenu.' },
        hang: { kid: 'Po jeszcze jednym ciężarku na każdym. Oba wytrzymują.', sci: 'Obciążenie zwiększone: oba wytrzymują.' },
        snap: {
          kid: 'Brzdęk! Stalowy drut pękł. Nanorurka, tak samo cienka, wciąż trzyma.',
          sci: 'Stal pęka pierwsza: najmocniejszy drut stalowy zrywa się przy około 2 do 3 GPa, ścianka nanorurki przy dziesiątkach GPa.',
        },
        hold: {
          kid: 'Wszystkie sześć! Nanorurka utrzymałaby dziesiątki razy więcej niż stal tej samej grubości.',
          sci: 'Wciąż trzyma: zmierzono, że pojedyncze ścianki nanorurek pękają dopiero przy około 100 GPa.',
        },
        full: { kid: 'To był ostatni ciężarek. Stuknij hak, żeby je zdjąć.', sci: 'Brak ciężarków; zdejmij obciążenie, żeby zacząć od nowa.' },
        off: { kid: 'Ciężarki zdjęte i zawieszony nowy stalowy drut.', sci: 'Odciążone; drut stalowy wymieniony.' },
        first: { kid: 'Najpierw zwiń warstwę w rurkę!', sci: 'Najpierw zwiń warstwę.' },
      },
      panel: {
        kid: [
          'Zwiń warstwę grafenu, węglowy plaster miodu grubości jednego atomu, a dostaniesz nanorurkę. Tak jak buckyball nie ma luźnych brzegów po bokach.',
          'Liczy się, jak ją zwiniesz: w jedną stronę brzeg wygląda jak fotele, w drugą tworzy zygzak. Te dwa rodzaje nawet inaczej przewodzą prąd.',
          'Prawdziwa nanorurka ma około 1 nanometra szerokości, jest dziesiątki tysięcy razy cieńsza od włosa. Mocno ciągnięta, należy do najwytrzymalszych rzeczy, jakie kiedykolwiek zmierzono: jest dużo mocniejsza od stali tej samej grubości.',
        ],
        sci: [
          'Jednościenna nanorurka to pasek grafenu zwinięty wzdłuż wektora chiralnego C = n a₁ + m a₂ i zamknięty bez szwu: (n, n) fotel, (n, 0) zygzak, każda inna chiralna. Średnica d = (a/π)√(n² + nm + m²), a = 0,246 nm: 0,81 nm dla (6,6), 0,78 nm dla (10,0).',
          'W najprostszym obrazie rurka jest metaliczna, gdy n − m jest wielokrotnością 3 (każda rurka typu fotel), a w pozostałych przypadkach półprzewodnikowa.',
          'Zmierzone na pojedynczych rurkach: moduł Younga około 1 TPa (stal: około 200 GPa) i wytrzymałość na rozciąganie rzędu dziesiątek GPa, około 100 GPa dla ścianek bez defektów; najmocniejsze druty stalowe zrywają się przy 2 do 3 GPa. Liny i włókna z nanorurek są dużo słabsze, bo rurki przesuwają się względem siebie. Włos ma 50 do 100 µm grubości: 50 000 do 100 000 razy więcej niż rurka o średnicy 1 nm.',
        ],
      },
    },
  },
  de: {
    title: 'Rice University, 1985',
    greet: {
      kid: 'Wir sind im Bild: in einem Labor der Rice University in Houston, Texas, im September 1985. Hier hat ein Team Graphit mit einem Laser beschossen und ein Molekül gefunden, das noch niemand gesehen hatte: einen Ball aus 60 Kohlenstoffatomen. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Richard Smalleys Labor an der Rice University, Houston, September 1985: die Clusterstrahl-Apparatur mit Laserverdampfung, ihr Flugzeit-Massenspektrometer, eine Tafel. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Harry Kroto kam extra aus England. Er wollte wissen, wie lange Ketten aus Kohlenstoffatomen in der Nähe alter Riesensterne entstehen, und Smalleys Maschine konnte Kohlenstoff-Cluster zum Untersuchen herstellen.',
        'Das Team bestand aus fünf Leuten: Harold Kroto, Robert Curl und Richard Smalley, mit zwei Studenten, James Heath und Sean O\'Brien. 1996 bekamen Kroto, Curl und Smalley den Nobelpreis für Chemie.',
        'Kroto erinnerte sich an eine riesige Kuppel, die er 1967 auf der Weltausstellung in Montreal besucht hatte, gebaut vom Architekten Buckminster Fuller. Daher kommt der Name des Moleküls: Buckminsterfulleren, kurz Buckyball.',
        'Im Jahr 1991 sah sich Sumio Iijima in Japan mit einem sehr starken Mikroskop Kohlenstoff an, der in einem elektrischen Funken entstanden war, und entdeckte winzige Röhrchen aus Kohlenstoff: Nanoröhren.',
      ],
      sci: [
        'Kroto (University of Sussex) interessierte sich für die langen Kohlenstoffketten, die Radioastronomen in interstellaren Wolken gefunden hatten, und vermutete, dass sie um kohlenstoffreiche Rote Riesen entstehen; Smalleys und Curls Clusterapparatur konnte Kohlenstoffcluster im Labor erzeugen.',
        'Die Arbeit „C₆₀: Buckminsterfullerene“ von Kroto, Heath, O\'Brien, Curl und Smalley ging am 13. September 1985 bei Nature ein, nach etwa zwei Wochen Experimenten, und erschien am 14. November. Kroto, Curl und Smalley teilten sich 1996 den Nobelpreis für Chemie.',
        'Auf der Expo 67 in Montreal war Buckminster Fullers Pavillon der Vereinigten Staaten eine geodätische Kuppel von 76 m Durchmesser. Kroto hatte sie besucht, und genau dieses Bild hatte er vor Augen, als das Team nach einem geschlossenen Käfig suchte.',
        'C₆₀ in größeren Mengen gab es ab 1990, als Krätschmer, Huffman und Mitarbeiter genug davon aus Kohlenstoffruß gewannen, um es zu sehen und zu kristallisieren. Iijimas Arbeit von 1991 machte mehrwandige Kohlenstoffnanoröhren berühmt; einwandige folgten 1993.',
      ],
    },
    calendar: 'SEPTEMBER 1985',
    poster: 'Expo 67, Montreal',
    beam: {
      label: 'Die Clustermaschine',
      title: 'Der rätselhafte Peak',
      tags: { laser: 'Laser', helium: 'Helium', disc: 'Graphit' },
      axis: { kid: 'Kohlenstoffatome im Cluster', sci: 'Masse (u)' },
      slider: 'Helium und Zeit zum Zusammenkleben',
      levels: { low: 'nachdem das Helium vorbei ist', mid: 'beim Höchststand des Heliums', high: 'beim Höchststand, mit dem Extra-Becher' },
      hints: { fire: 'Tippe auf den Laser, um auf den Graphit zu schießen', helium: 'Tippe auf die Heliumflasche, um Helium dazuzugeben', look: 'Schau auf den Bildschirm oder tippe auf den Laser, um ihn auszuschalten' },
      buttons: { fire: 'Laser einschalten', stop: 'Laser ausschalten', helium: 'Mehr Helium' },
      says: {
        fire: {
          kid: 'Zack! Der Laser trifft den sich drehenden Graphit zehnmal pro Sekunde. Kohlenstoffatome verdampfen, kleben im Helium zusammen und rasen durch das Rohr. Der Bildschirm zeichnet für jede Clustergröße einen Strich.',
          sci: 'Schuss: 532-nm-Pulse, 10 pro Sekunde, verdampfen die rotierende Graphitscheibe in das Helium; die Cluster expandieren ins Vakuum, und das Flugzeitspektrometer sortiert sie nach Masse.',
        },
        low: {
          kid: 'Kaum Helium: Cluster jeder geraden Größe, und die 60 nur ein bisschen höher als die anderen.',
          sci: 'Laser gefeuert, nachdem der Großteil des Heliumpulses vorbei war: eine breite Verteilung geradzahliger Cluster, C₆₀ der größte, aber nicht dominant.',
        },
        mid: {
          kid: 'Mehr Helium: Die Cluster stoßen öfter zusammen, und die 60 sticht heraus, etwa fünfmal so hoch wie ihre Nachbarn. Die 70 wächst auch!',
          sci: 'Gefeuert bei maximaler Heliumdichte: C₆₀ etwa fünfmal so stark wie seine Nachbarn, C₇₀ ebenfalls kräftig.',
        },
        high: {
          kid: 'Helium und extra Zeit zum Zusammenstoßen: Jetzt überragt die 60 alles! Welche Form aus 60 Kohlenstoffatomen könnte so stabil sein?',
          sci: 'Mit dem Integrationsbecher (mehr Stöße vor der Expansion) dominiert C₆₀: etwa 40-mal so stark wie seine Nachbarn, mehr als die Hälfte aller großen Cluster; C₇₀ etwa 5%.',
        },
        set: { kid: 'Helium eingestellt. Tippe auf den Laser und schau, was passiert.', sci: 'Clusterbedingungen eingestellt; schalte den Laser ein.' },
        stop: { kid: 'Laser aus. Das letzte Bild bleibt auf dem Bildschirm.', sci: 'Laser aus; das letzte Spektrum bleibt stehen.' },
      },
      panel: {
        kid: [
          'Das ist die Maschine, die Smalleys Team gebaut hat. Ein Laser beschießt eine sich drehende Scheibe aus Graphit, dem schwarzen Zeug in Bleistiften, und Kohlenstoffatome fliegen heraus. Ein Hauch Heliumgas kühlt sie ab, und sie kleben zu Clustern zusammen.',
          'Dann rasen die Cluster durch ein langes Rohr, und die leichtesten kommen zuerst an. Der Bildschirm zeichnet für jede Größe einen Strich: Je höher der Strich, desto mehr Cluster dieser Größe.',
          'Im September 1985 stach ein Strich immer wieder heraus: Cluster aus genau 60 Kohlenstoffatomen. Mit mehr Helium und mehr Zeit wurde er immer höher. Das Team hatte etwas Besonderes gefunden. Aber was war es?',
        ],
        sci: [
          'Laserverdampfung in einen Überschall-Clusterstrahl: Die zweite Harmonische eines gütegeschalteten Nd:YAG-Lasers (532 nm, etwa 30 mJ pro Puls) verdampft eine rotierende Graphitscheibe in einen dichten Heliumpuls; der Kohlenstoff kondensiert zu Clustern, die als Überschallstrahl ins Vakuum expandieren und von einem zweiten, ultravioletten Laser ionisiert werden.',
          'Flugzeit-Massenspektrometrie: Ionen mit gleicher Energie fliegen mit Geschwindigkeiten proportional zu 1/√m, darum erreichen leichtere Cluster den Detektor zuerst. Oberhalb von etwa C₄₀ erscheinen nur Cluster mit gerader Atomzahl. C₆₀ hat die Masse 720 u (12 u pro Kohlenstoffatom), C₇₀ 840 u.',
          'Die Clusterbedingungen bestimmten das Spektrum (Nature, 1985): gefeuert, nachdem der Großteil des Heliums vorbei war, eine breite Verteilung; bei maximaler Heliumdichte C₆₀ etwa fünfmal so stark wie seine Nachbarn; mit einem zusätzlichen „Integrationsbecher“ für mehr Stöße etwa 40-mal. Die Exxon-Gruppe (Rohlfing, Cox und Kaldor, 1984) hatte die geraden Cluster schon gesehen, ohne C₆₀ zu erklären.',
        ],
      },
    },
    ball: {
      label: 'Smalleys Papiermodell',
      title: 'Sechsecke und Fünfecke',
      board: { hex: 'Sechsecke', pent: 'Fünfecke', corners: 'Ecken' },
      hints: {
        start: 'Tippe auf die Sechsecke oder Fünfecke, um eins anzukleben',
        flat: 'Flach wie ein Fußboden. Tippe auf die Fünfecke',
        round: 'Tippe auf die Sechsecke, um das Fünfeck zu umrunden',
        both: 'Es fehlen noch Sechsecke ({h}) und Fünfecke ({p})',
        hex: 'Es fehlen noch Sechsecke ({h})',
        pent: 'Es fehlen noch Fünfecke ({p})',
        closed: 'Geschlossen! Tippe auf den Ball, um an jede Ecke ein Atom zu setzen',
        atoms: 'Tippe auf den Ball, um ihn auseinanderzunehmen',
      },
      buttons: { hex: 'Ein Sechseck ankleben', pent: 'Ein Fünfeck ankleben', atoms: 'Ein Atom an jede Ecke', apart: 'Auseinandernehmen' },
      says: {
        flat: {
          kid: 'Sechsecke passen zusammen wie Fliesen auf dem Boden, und sie bleiben flach. Smalley hat es auch zuerst mit Sechsecken versucht, wie die Ringe in einer Graphitschicht.',
          sci: 'Sechsecke allein füllen die Ebene: Drei Ecken zu 120° ergeben genau 360°, also bleibt die Schicht flach wie eine Lage Graphit.',
        },
        still: {
          kid: 'Egal wie viele Sechsecke du anklebst, es bleibt flach. Eine flache Schicht kann sich nie zu einem Ball schließen!',
          sci: 'Immer noch flach: Keine Zahl von Sechsecken allein kann einen Käfig schließen.',
        },
        curl: {
          kid: 'Ein Fünfeck! Seine Ecken sind etwas schmaler, darum müssen sich die Sechsecke darum herum zu einer Schale hochbiegen.',
          sci: 'An der Ecke eines Fünfecks ergeben die Flächen 108° + 120° + 120° = 348°: 12° fehlen bis flach, also krümmt sich die Schicht.',
        },
        apartP: {
          kid: 'In diesem Ball berühren sich Fünfecke nie: Jedes sitzt zwischen Sechsecken. Klebe zuerst Sechsecke um dieses herum.',
          sci: 'In C₆₀ teilen keine zwei Fünfecke eine Kante (die Regel der isolierten Fünfecke): Jedes ist von fünf Sechsecken umgeben.',
        },
        noHex: {
          kid: 'Jetzt passt kein Sechseck: Die übrigen Lücken brauchen Fünfecke.',
          sci: 'Alle 20 Sechsecke sind dran; jede übrige Lücke ist ein Fünfeck.',
        },
        closed: {
          kid: 'Er ist zu! 12 Fünfecke und 20 Sechsecke ergeben einen Ball mit 60 Ecken: eine für jedes Kohlenstoffatom. Als Smalley seinen Papierball zeigte, sagte ihm ein Mathematiker der Rice University, dass es ein Fußball ist.',
          sci: 'Geschlossen: 12 Fünfecke, 20 Sechsecke, 60 Ecken, 90 Kanten, der Ikosaederstumpf. William Veech, Leiter des Mathematik-Instituts der Rice University, erkannte darin einen Fußball.',
        },
        atoms: {
          kid: 'Ein Kohlenstoffatom an jeder Ecke: Das ist C₆₀, der Buckyball. Jedes Atom ist mit drei Nachbarn verbunden.',
          sci: 'Ein Kohlenstoff an jeder Ecke, jeder an drei gebunden: C₆₀, 0,71 nm Durchmesser von Kern zu Kern, Bindungen von 1,40 Å zwischen zwei Sechsecken und 1,45 Å zwischen Sechseck und Fünfeck.',
        },
        apart: { kid: 'Auseinandergenommen: Das Papier ist bereit für einen neuen Versuch.', sci: 'Modell auseinandergenommen.' },
        dome: {
          kid: 'Buckminster Fullers Kuppel auf der Weltausstellung von 1967. Schau genau hin: Zwischen all den Sechsecken gibt es ein paar Fünfecke. Ohne sie kann sich eine Kuppel nicht rund wölben.',
          sci: 'Der US-Pavillon auf der Expo 67: eine geodätische Kuppel von 76 m Durchmesser, eine Dreiviertelkugel. Eine geodätische Kugel hat 12 Punkte, an denen sich fünf statt sechs Dreiecke treffen; sie tun dasselbe wie die Fünfecke von C₆₀.',
        },
      },
      panel: {
        kid: [
          'Welche Form aus 60 Kohlenstoffatomen konnte so stabil sein? Das Team vermutete einen hohlen Käfig ohne lose Enden. Kroto erinnerte sich an Buckminster Fullers große Kuppel, und Smalley lieh sich in der Bibliothek ein Buch über Fullers Kuppeln aus.',
          'Eines Abends probierte Smalley es mit Papier. Sechsecke allein blieben flach, also nahm er Fünfecke dazu. Mit 12 Fünfecken und 20 Sechsecken schloss sich das Papier zu einem Ball mit genau 60 Ecken.',
          'Das Team nannte das Molekül Buckminsterfulleren, nach Fuller. Die meisten sagen Buckyball dazu.',
        ],
        sci: [
          'Warum ein Käfig: Ein flaches Stück aus 60 Atomen hätte am Rand freie Bindungen; schließt man es, sind alle abgesättigt, was die Stabilität des Clusters erklärt. Kroto erinnerte sich an Fullers Kuppel auf der Expo 67 und schlug ein Buch über Fullers Kuppeln aus der Bibliothek vor; Smalley lieh es aus und baute das Modell zu Hause aus Sechsecken und Fünfecken aus Papier.',
          'Der eulersche Polyedersatz (E − K + F = 2) zwingt bei drei Flächen an jeder Ecke jeden geschlossenen Käfig aus Fünf- und Sechsecken zu genau 12 Fünfecken; die Zahl der Sechsecke kann sich ändern (C₇₀ hat 25). C₆₀ mit 20 ist der kleinste, in dem sich keine zwei Fünfecke berühren.',
          'Der Ikosaederstumpf (Symmetrie Ih): 60 Ecken, 90 Kanten, 32 Flächen. Die Struktur wurde bestätigt, als C₆₀ in sichtbaren Mengen hergestellt werden konnte (1990): Sein Kohlenstoff-13-NMR-Spektrum ist eine einzige Linie, wie es 60 gleiche Atome ergeben müssen.',
        ],
      },
    },
    tube: {
      label: 'Aufgerollter Kohlenstoff',
      title: 'Nanoröhren',
      tags: { steel: 'Stahl', tube: 'Nanoröhre', armchair: 'Sessel', zigzag: 'Zickzack' },
      hints: {
        roll: 'Tippe auf Sessel oder Zickzack, um die Schicht aufzurollen',
        hang: 'Tippe auf die Gewichte, um an jeden Draht eins zu hängen',
        more: 'Tippe auf die Gewichte, um noch eins anzuhängen',
        snapped: 'Der Stahl ist gerissen! Tippe auf die Gewichte für mehr an der Röhre',
        off: 'Tippe auf einen Haken, um die Gewichte abzunehmen',
      },
      buttons: { armchair: 'Als Sessel aufrollen', zigzag: 'Als Zickzack aufrollen', unroll: 'Ausrollen', weight: 'Ein Gewicht anhängen', off: 'Gewichte abnehmen' },
      says: {
        armchair: {
          kid: 'So aufgerollt sieht der Rand der Röhre aus wie eine Reihe kleiner Sessel. Die Röhre am Haken ist genauso dünn wie der Stahldraht daneben.',
          sci: 'Sessel (armchair) (6,6): entlang der Sesselrichtung aufgerollt, 0,81 nm Durchmesser, metallisch.',
        },
        zigzag: {
          kid: 'Andersherum aufgerollt läuft der Rand im Zickzack. Die Röhre am Haken ist genauso dünn wie der Stahldraht daneben.',
          sci: 'Zickzack (10,0): entlang der Zickzackrichtung aufgerollt, 0,78 nm Durchmesser, ein Halbleiter (10 ist kein Vielfaches von 3).',
        },
        unroll: { kid: 'Wieder flach: eine Schicht Graphen, ein Atom dick.', sci: 'Ausgerollt: eine Graphenschicht.' },
        hang: { kid: 'Noch ein Gewicht an jedem. Beide halten.', sci: 'Last erhöht: beide halten.' },
        snap: {
          kid: 'Ping! Der Stahldraht ist gerissen. Die Nanoröhre, genauso dünn, hält immer noch.',
          sci: 'Der Stahl versagt zuerst: Der festeste Stahldraht reißt bei etwa 2 bis 3 GPa, die Wand einer Nanoröhre erst bei Dutzenden GPa.',
        },
        hold: {
          kid: 'Alle sechs! Eine Nanoröhre könnte Dutzende Male mehr halten als Stahl gleicher Dicke.',
          sci: 'Hält immer noch: Einzelne Nanoröhrenwände reißen gemessen erst bei etwa 100 GPa.',
        },
        full: { kid: 'Das war das letzte Gewicht. Tippe auf einen Haken, um sie abzunehmen.', sci: 'Keine Gewichte mehr; entlaste, um neu anzufangen.' },
        off: { kid: 'Gewichte ab, und ein neuer Stahldraht hängt.', sci: 'Entlastet; der Stahldraht ersetzt.' },
        first: { kid: 'Rolle die Schicht erst zu einer Röhre auf!', sci: 'Erst die Schicht aufrollen.' },
      },
      panel: {
        kid: [
          'Rolle eine Schicht Graphen auf, die Bienenwabe aus Kohlenstoff, nur ein Atom dick, und du bekommst eine Nanoröhre. Wie der Buckyball hat sie an den Seiten keine losen Ränder.',
          'Wie man sie aufrollt, ist wichtig: In die eine Richtung sieht der Rand aus wie Sessel, in die andere läuft er im Zickzack. Die beiden Sorten leiten sogar Strom unterschiedlich.',
          'Eine echte Nanoröhre ist etwa 1 Nanometer breit, zehntausende Male dünner als ein Haar. Kräftig gezogen gehört sie zu den festesten Dingen, die je gemessen wurden: viel fester als Stahl gleicher Dicke.',
        ],
        sci: [
          'Eine einwandige Nanoröhre ist ein Graphenstreifen, entlang seines chiralen Vektors C = n a₁ + m a₂ aufgerollt und nahtlos geschlossen: (n, n) Sessel, (n, 0) Zickzack, alle anderen chiral. Durchmesser d = (a/π)√(n² + nm + m²), a = 0,246 nm: 0,81 nm für (6,6), 0,78 nm für (10,0).',
          'Im einfachsten Bild ist eine Röhre metallisch, wenn n − m ein Vielfaches von 3 ist (jede Sesselröhre), und sonst ein Halbleiter.',
          'Gemessen an einzelnen Röhren: ein Elastizitätsmodul von etwa 1 TPa (Stahl: etwa 200 GPa) und Zugfestigkeiten von Dutzenden GPa, etwa 100 GPa für fehlerfreie Wände; die festesten Stahldrähte reißen bei 2 bis 3 GPa. Seile und Fasern aus Nanoröhren sind viel schwächer, weil die Röhren aneinander vorbeigleiten. Ein Haar ist 50 bis 100 µm dick: 50 000- bis 100 000-mal so dick wie eine 1-nm-Röhre.',
        ],
      },
    },
  },
}
