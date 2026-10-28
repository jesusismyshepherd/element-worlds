// Every word of the allotropes gallery, in English and European Portuguese, at two depths: kid
// (Explorer) and sci (Scientist). Signs are the lecterns in the gallery (3D text: Latin letters only,
// no Greek, no subscripts); panels open in the HUD (any character). No em dashes.

const EN = {
  back: 'Back to the atrium',
  kicker: 'Diamond, graphite and company',
  decimal: '.',
  wall: 'One element, many forms',
  greeting: {
    kid: "Welcome to my gallery! Look down: you're walking on graphene, a single layer of my atoms. In here I'm a diamond, a pencil, a tube and a ball. Try every exhibit to discover them all!",
    sci: 'Allotropes: one element, different bonding. sp³ in diamond; sp² in graphite, graphene, nanotubes and fullerenes. The floor is graphene drawn at 0.5 m per ångström. Along the left wall: graphene from four sides, and the twisted bilayer.',
  },
  pentagons: 'pentagons',
  hexagons: 'hexagons',
  totals: 'atoms · bonds',
  pressTitle: 'DIAMOND PRESS',
  source: 'source',
  drain: 'drain',
  gate: 'gate',
  gateVoltage: 'gate voltage',
  modes: ['plain graphene', 'bilayer in a field'],
  catLabel: 'cat: 4 kg',
  press: {
    steps: [
      { verb: 'Put in', label: 'graphite in the press' },
      { verb: 'Squeeze', label: 'the press to 6 GPa' },
      { verb: 'Heat', label: 'the capsule to 1500 °C' },
      { verb: 'Open', label: 'the press' },
      { verb: 'Start again', label: 'with new graphite' },
    ],
    wait: 'Wait',
    working: 'the press is working…',
    say: [
      'The graphite is in the capsule. Now squeeze!',
      '6 GPa: like 25 elephants standing on a one-cent coin. Now heat it!',
      "1500 °C! The flat sheets are turning into diamond's 3D net. Open the press!",
    ],
  },
  say: {
    peelFree: 'One single layer, free: that is graphene! Use the tape again to put it back.',
    peelBack: 'Back on the stack: graphene sheets stacked up are graphite.',
    slideBack: 'Stacked again. The sheets only rest on each other, so they slide easily.',
    transistor: [
      'See? At the lowest point the current still flows: plain graphene cannot switch off. Try again with a gap.',
      'With two layers in an electric field there is a gap, and the current stops: OFF!',
    ],
    moire: nm => `The magic angle, 1.1°! The big pattern is ${nm} nm across, 52 atoms. Cooled almost to absolute zero, these two sheets carry electricity with no resistance at all.`,
  },
  signLine: {
    moire: (deg, nm) => (deg === 0 ? 'Aligned: no moiré. Twist the top sheet!' : `Twist ${deg}°: moiré ${nm} nm${deg === 1.1 ? ' (the magic angle)' : ''}`),
    readout: (deg, nm) => (deg < 0.05 ? 'Aligned: no pattern' : `Turned ${deg.toFixed(1)}°\nthe pattern repeats every ${nm} nm`),
  },
  ex: {
    graphene: {
      label: 'the sticky tape', verb: 'Use', labelBack: 'the graphene sheet', verbBack: 'Put back',
      sign: { title: 'Graphene', kid: 'Peel one layer off graphite with sticky tape.', sci: 'One layer of graphite: 2004, Geim and Novoselov (Nobel Prize 2010).' },
      panel: {
        title: 'Graphene',
        kid: [
          { p: 'Graphite is a stack of flat sheets. Peel off just one sheet and you have graphene: a single layer of carbon atoms joined in hexagons, like a honeycomb. Each atom holds three neighbours.' },
          { big: '1 atom', small: 'thick: the thinnest material there is' },
          { p: 'In 2004 Andre Geim and Konstantin Novoselov, in Manchester, peeled graphite again and again with sticky tape until only one layer was left. In 2010 they won the Nobel Prize in Physics.' },
          { p: 'The floor of this gallery is graphene too, drawn 5 billion times bigger than real life. Along this wall you can explore it as a physicist, a chemist, an engineer and a materials scientist.' },
        ],
        sci: [
          { rows: [['Bond', 'C–C 0.142 nm, sp², 120°'], ['Lattice', 'hexagonal, a = 0.246 nm, two atoms per cell'], ['Thickness', 'one atom (layers in graphite are 0.335 nm apart)'], ['Isolated', '2004, Andre Geim and Konstantin Novoselov (Manchester), by mechanical exfoliation with adhesive tape'], ['Nobel Prize', 'Physics, 2010']] },
          { p: 'Thin flakes on oxidised silicon (300 nm of SiO₂) show by interference, so a single layer could be found under an ordinary optical microscope; the stack here peels the top layer of an AB-stacked crystal the same way.' },
          { p: 'Floor scale: 0.5 m per ångström, 5 × 10⁹ times life size.' },
        ],
      },
    },
    physics: {
      label: "graphene's energy cones", verb: 'Look at',
      sign: { title: 'Graphene · Physics', kid: 'Electrons race through it as if they weighed nothing.', sci: 'Dirac cones at the six K points; electrons at about 1 000 000 m/s.' },
      panel: {
        title: 'Graphene · Physics',
        kid: [
          { p: 'In graphene, electrons race through the sheet as if they weighed nothing, at about 1000 km every second (1/300 of the speed of light).' },
          { p: 'The sculpture shows the energies an electron can have in graphene: a blue surface below and an orange one above. They touch at only six points, where each surface is a cone. Those points make graphene special.' },
          { big: '2.3%', small: 'of light is stopped by one single layer: you can see it with your eyes' },
          { p: 'It also carries heat extremely well. A Canadian physicist, Philip Wallace, worked all this out on paper in 1947, more than 50 years before anyone made graphene.' },
        ],
        sci: [
          { big: 'E = ±ħv|k|', small: 'near the K points: massless Dirac fermions with a linear dispersion (v, the Fermi velocity)' },
          { rows: [
            ['Fermi velocity', 'v ≈ 1 × 10⁶ m/s, about 1/300 of the speed of light'],
            ['Band structure', 'P. R. Wallace, 1947, tight binding: E(k) = ±t·|1 + exp(ik·a₁) + exp(ik·a₂)|, t ≈ 2.8 eV'],
            ['Quantum Hall effect', 'half-integer, σxy = ±4(n + ½)e²/h (2005); seen even at room temperature (2007)'],
            ['Light', 'one layer absorbs πα ≈ 2.3% of white light (α the fine-structure constant)'],
            ['Heat', 'suspended graphene conducts thousands of W/(m·K)'],
          ] },
          { p: 'The sculpture is the π band over the hexagonal Brillouin zone: the valence band (blue) is full, the conduction band (orange) empty, and they meet only at the six corners K and K′, where the surfaces become cones. The lines are equal-energy contours: circles round each K point, triangles further out. Use it: rings run out from the K points at constant slope, which is the linear dispersion.' },
        ],
      },
    },
    chemistry: {
      label: 'the pi orbitals', verb: 'Look at',
      sign: { title: 'Graphene · Chemistry', kid: 'Three hands in the plane, one electron shared by all.', sci: 'sp²: three sigma bonds at 120°, one pi electron per atom.' },
      panel: {
        title: 'Graphene · Chemistry',
        kid: [
          { p: 'In graphene each carbon atom holds three neighbours, flat, at equal angles of 120°. Its fourth electron is shared with the whole sheet, in clouds above and below it (the blue and orange shapes).' },
          { big: '120°', small: 'between the three bonds of every atom' },
          { p: 'Chemists change it: add oxygen and you get graphene oxide; add a hydrogen to every atom and you get graphane, which no longer conducts electricity.' },
          { p: 'Big sheets are grown by passing a gas with carbon in it (methane) over very hot copper foil: the carbon atoms settle into one single layer.' },
        ],
        sci: [
          { rows: [
            ['Bonding', 'sp²: three σ bonds at 120°, C–C 0.142 nm; one pz electron per atom in delocalised π bonds'],
            ['Graphene oxide', 'oxidised graphite (Hummers method, 1958) split into sheets: epoxide and hydroxyl groups on the plane, carboxyl groups at the edges; an insulator that can be reduced back'],
            ['Graphane', 'every carbon bonded to one hydrogen (sp³); made in 2009 by exposing graphene to a hydrogen plasma; an insulator, reversible on heating'],
            ['Growth', 'chemical vapour deposition: methane on copper foil at about 1000 °C gives large single-layer sheets (2009); carbon barely dissolves in copper, so the growth stops at one layer'],
          ] },
          { p: 'The model shows one hexagon of graphene: the σ bonds in the plane and each atom’s p orbital standing across it, one phase above (blue) and one below (orange). Use it: the p orbitals merge into the π clouds that spread over the whole sheet.' },
        ],
      },
    },
    electronics: {
      label: 'the graphene transistor', verb: 'Try',
      sign: { title: 'Graphene · Electronics', kid: 'A very fast switch that never switches fully off.', sci: 'No band gap: a semimetal. On/off ratio only about 5 to 10.' },
      panel: {
        title: 'Graphene · Electronics',
        kid: [
          { p: 'A transistor is a tiny switch: a computer has billions of them. Electrons rush through graphene so fast that it makes very fast transistors, but there is a problem: it cannot switch fully off.' },
          { p: 'Turn the knob: the current falls, but even at its lowest it keeps flowing. Turn it again: now there are two layers in an electric field, and the current stops.' },
          { big: 'no gap', small: 'graphene never switches fully off on its own' },
          { p: 'Scientists open a gap: two layers in an electric field, or graphene cut into very narrow ribbons. It is also used in see-through electrodes and in sensors that can feel single molecules.' },
        ],
        sci: [
          { rows: [
            ['Band gap', 'none: a semimetal (zero gap); at the Dirac point the conductance has a minimum, not zero'],
            ['On/off ratio', 'about 5 to 10 at room temperature for a plain graphene transistor; silicon logic needs about 10⁴ to 10⁷'],
            ['Opening a gap', 'bilayer graphene in a perpendicular electric field (up to about 0.25 eV, 2009); nanoribbons a few nanometres wide'],
            ['Uses', 'radio-frequency transistors (cut-off frequencies of hundreds of GHz), transparent conductive films, sensors able to detect single gas molecules'],
          ] },
          { p: 'Ambipolar conduction: the gate moves the Fermi level up into the conduction band (electrons) or down into the valence band (holes); the current is lowest where the two cones meet, the charge-neutrality point.' },
        ],
      },
    },
    materials: {
      label: 'the graphene hammock', verb: 'Look at',
      sign: { title: 'Graphene · Materials', kid: 'One square metre would hold a cat and weigh less than a whisker.', sci: "Strength about 130 GPa, Young's modulus about 1 TPa, 0.77 mg per square metre." },
      panel: {
        title: 'Graphene · Materials',
        kid: [
          { p: 'A hammock of graphene one metre square could hold this 4 kg cat, yet it would weigh only 0.77 milligrams: less than one of the cat’s whiskers!' },
          { big: '0.77 mg', small: 'the mass of one square metre of graphene' },
          { p: 'It is one of the strongest materials ever measured. And not even the smallest gas atoms, helium, can pass through a perfect sheet.' },
          { p: 'That is why it is tried in strong light plastics, in coatings against rust, in batteries and in filters that clean water.' },
        ],
        sci: [
          { rows: [
            ['Thickness', 'one atom (0.335 nm as a layer in graphite)'],
            ['Strength', 'intrinsic strength about 130 GPa, Young’s modulus about 1 TPa (Lee, Wei, Kysar and Hone, Science 2008, pressing an AFM tip into suspended sheets)'],
            ['Areal density', '0.77 mg per square metre'],
            ['Barrier', 'impermeable to gases, even helium (2008)'],
            ['Uses', 'composites, anti-corrosion coatings, battery electrodes and supercapacitors, membranes for filtering and desalinating water'],
          ] },
          { p: 'The hammock is the Nobel committee’s example from 2010: a strip one metre wide breaks only at about 42 N, the weight of about 4 kg. Real sheets have defects and grain boundaries, so large ones are weaker than this ideal.' },
        ],
      },
    },
    moire: {
      label: 'the magic angle (1.1°)', verb: 'Turn to',
      sign: { title: 'Frontier: twisted graphene', kid: 'Two sheets, one turning: watch a giant pattern appear by itself.', sci: 'Twisted bilayer: at the magic angle (1.1°), superconductivity.' },
      panel: {
        title: 'Frontier: twisted graphene',
        kid: [
          { p: 'Two sheets of graphene, one on top of the other, the top one turning slowly. Nothing is painted on them: the big pattern appears by itself where the two honeycombs overlap, like two net curtains in front of a window. The smaller the turn, the bigger the pattern.' },
          { big: '1.1°', small: 'the magic angle' },
          { p: 'At 1.1°, about how far a clock’s minute hand moves in 11 seconds, two plain sheets of carbon, cooled almost to absolute zero, carry electricity with no resistance at all: they are a superconductor. Change a little how many electrons they hold and the same sheets block electricity completely. A tiny turn changes what the material is!' },
          { p: 'Why it is such a big deal: it was found in 2018 by Yuan Cao, a young student in Pablo Jarillo-Herrero’s lab at MIT. The magazine Physics World called it the breakthrough of the year; Jarillo-Herrero and the two physicists who had predicted the magic angle shared the Wolf Prize in Physics in 2020; and science got a new word, twistronics: electronics by twisting. Today labs all over the world stack and twist sheets one atom thin, like a deck of cards, to make materials that do not exist in nature.' },
        ],
        sci: [
          { big: 'θ ≈ 1.1°', small: 'the magic angle: flat bands, correlated insulators, superconductivity' },
          { rows: [
            ['Moiré period', 'λ = a / (2 sin(θ/2)): about 13 nm at 1.1° (a = 0.246 nm), some 11,000 atoms in each moiré cell'],
            ['Prediction', 'flat bands at the magic angle: Rafi Bistritzer and Allan MacDonald, PNAS, 2011'],
            ['Discovery', 'Yuan Cao, Pablo Jarillo-Herrero and colleagues (MIT), two papers in Nature, 2018: correlated insulating states at half filling of the flat bands and, next to them, superconductivity below about 1.7 K'],
            ['A new word', 'twistronics: tuning a material by the angle between its layers (Efthimios Kaxiras’s group, Harvard, 2017)'],
            ['Recognition', 'Physics World Breakthrough of the Year 2018; Wolf Prize in Physics 2020 (Bistritzer, Jarillo-Herrero, MacDonald)'],
            ['Since', 'magnetism and Chern insulators in the flat bands, twisted trilayers, twisted transition-metal dichalcogenides: the fractional quantum anomalous Hall effect in twisted MoTe₂ (2023), quasiparticles carrying a fraction of an electron’s charge, with no magnet at all'],
          ] },
          { p: 'Why: near the magic angle the moiré bands become almost flat, the electrons’ kinetic energy falls below their mutual repulsion and they organise collectively, much as in the copper-oxide superconductors, but in one tunable device: a gate voltage sets how many electrons fill the bands. Samples are made by “tear and stack” (2016): half of one graphene flake is picked up, turned by the wanted angle and laid on the other half. Keeping one angle across a whole device (twist-angle disorder) is still the hard part.' },
          { p: 'Here the sheets are drawn as transparencies on a light table, with a = 2.7 cm, so the 1.1° moiré is about 1.4 m across. Nothing marks the moiré: it comes from the overlap, lighter where atoms sit on atoms (AA), darker where they interleave (AB).' },
        ],
      },
    },
    graphite: {
      label: 'the graphite layers', verb: 'Slide', verbBack: 'Stack up',
      sign: { title: 'Graphite', kid: 'Sheets of hexagons that slide over each other.', sci: 'AB stacking, layers 3.35 Å apart; C–C 1.42 Å in each sheet.' },
      panel: {
        title: 'Graphite',
        kid: [
          { p: 'Graphite is graphene stacked up: flat sheets of hexagons, one on top of another. Inside a sheet the atoms hold on tight, but the sheets only cling to each other weakly, so they slide.' },
          { big: '3 hands', small: 'each atom holds three neighbours in its sheet' },
          { p: 'That is why graphite is soft and slippery: it is in pencils, and it is used as a dry lubricant for locks.' },
          { p: 'Electrons can travel along the sheets, so graphite conducts electricity: it is in batteries and in electric motors.' },
        ],
        sci: [
          { rows: [
            ['Stacking', 'ABAB (Bernal): every other layer is shifted by one bond, so half its atoms sit over atoms and half over hexagon centres'],
            ['Layer spacing', '3.35 Å, held by van der Waals forces'],
            ['In-plane bond', 'C–C 1.42 Å, sp²'],
            ['Density', '2.27 g/cm³'],
            ['Conductivity', 'metallic along the layers; thousands of times lower across them'],
            ['Name', 'from the Greek graphein, to write (A. G. Werner, 1789)'],
          ] },
          { p: 'At everyday pressure and temperature graphite, not diamond, is the most stable form of carbon. The fourth electrons are delocalised in π bands over each whole sheet, which is why graphite conducts along its layers and has a grey shine.' },
        ],
      },
    },
    pencil: {
      label: 'the giant pencil', verb: 'Write with',
      sign: { title: 'The pencil', kid: 'Writing leaves thin layers of graphite on the paper.', sci: 'Graphite and clay, fired: no lead at all.' },
      panel: {
        title: 'The pencil',
        kid: [
          { p: 'When you write, the paper scrapes tiny flakes off the tip: layers of graphite sliding off. Your line is made of thin sheets of carbon!' },
          { p: 'Pencil "lead" has no lead in it: it is graphite mixed with clay. More clay makes a harder, paler line (H); more graphite a softer, darker one (B).' },
          { big: 'graphite', small: 'from the Greek graphein: to write' },
        ],
        sci: [
          { rows: [
            ['Core', 'graphite powder and clay, mixed, pressed and fired'],
            ['Grades', 'from 9H (hard, pale) to 9B (soft, black); HB in the middle'],
            ['Line', 'flakes of graphite from a few nanometres to micrometres thick, caught in the paper fibres'],
          ] },
          { p: 'In the 1500s a large deposit of unusually pure graphite was found at Borrowdale, in England. People took it for a kind of lead (plumbago), and the name stuck. Carl Scheele showed in 1779 that graphite is carbon.' },
        ],
      },
    },
    diamond: {
      label: 'the diamond lattice', verb: 'Look at',
      sign: { title: 'Diamond', kid: 'Each atom holds four others, in 3D. The hardest natural material.', sci: 'Cubic, a = 3.567 Å; C–C 1.545 Å at 109.5°; sp³.' },
      panel: {
        title: 'Diamond',
        kid: [
          { p: 'In diamond every carbon atom holds four others, pointing to the corners of a pyramid with a triangle for a base (a tetrahedron). All the atoms are locked into one strong net that goes in every direction.' },
          { big: '10', small: 'on the Mohs scale: the hardest natural material' },
          { p: 'Diamond carries heat better than any other natural material, about five times better than copper. That is why a diamond feels cold when you touch it.' },
          { p: 'Natural diamonds grew about 150 km down inside the Earth, squeezed and heated, and were carried up by volcanic eruptions.' },
        ],
        sci: [
          { rows: [
            ['Structure', 'diamond cubic: two face-centred cubic lattices, one shifted by a quarter of the cube’s diagonal'],
            ['Cell', 'a = 3.567 Å, 8 atoms'],
            ['Bond', 'C–C 1.545 Å, sp³, 109.47°'],
            ['Density', '3.51 g/cm³ (graphite 2.27)'],
            ['Hardness', 'Mohs 10'],
            ['Thermal conductivity', 'about 2000 to 2200 W/(m·K); copper about 400'],
            ['Band gap', '5.5 eV: an electrical insulator'],
          ] },
          { p: 'At room pressure diamond is metastable: graphite is slightly more stable, but the change would have to break every bond, so it never happens at room temperature. Natural diamonds formed 140 to 200 km deep (about 4.5 to 6 GPa, 900 to 1300 °C) and reached the surface in kimberlite eruptions.' },
        ],
      },
    },
    brilliant: {
      label: 'the brilliant', verb: 'Look at',
      sign: { title: 'The brilliant', kid: 'Light bounces inside and splits into colours.', sci: 'n = 2.42, critical angle 24.4°, dispersion 0.044; 57 facets.' },
      panel: {
        title: 'The brilliant',
        kid: [
          { p: 'A cut diamond sparkles because it bends light very strongly. Light that gets in bounces from facet to facet inside and comes back out through the top, toward your eyes.' },
          { big: '57 facets', small: 'the round brilliant cut' },
          { p: 'Diamond also splits white light into its colours, like a prism. Jewellers call these flashes of colour fire.' },
          { p: 'This stone is drawn the same way: each ray of light is followed inside it, bounce after bounce.' },
        ],
        sci: [
          { rows: [
            ['Refractive index', 'n = 2.42 (glass about 1.5, water 1.33)'],
            ['Critical angle', '24.4°: inside, light meeting a facet at more than this from the perpendicular is totally reflected'],
            ['Dispersion', '0.044 (n for violet 2.45 minus n for red 2.41)'],
            ['Cut', 'round brilliant: 57 facets (58 with a culet); Marcel Tolkowsky worked out its proportions in 1919'],
          ] },
          { p: 'The pavilion facets slope at about 41°, so light entering through the table is totally reflected from one side of the pavilion to the other and leaves through the crown. Here every pixel traces its ray through the real facets, with a different index for red, green and blue light.' },
        ],
      },
    },
    press: {
      sign: { title: 'The diamond press', kid: 'Squeeze and heat graphite to make a diamond.', sci: 'HPHT: about 6 GPa and 1500 °C, with a metal catalyst.' },
      panel: {
        title: 'You made a diamond!',
        kid: [
          { p: 'You squeezed graphite as hard as 25 elephants standing on a one-cent coin and heated it to 1500 °C. Its flat sheets rearranged into diamond’s strong 3D net.' },
          { big: '6 GPa', small: '60 000 times the pressure of the air' },
          { p: 'That is what happens naturally about 150 km under your feet. Factories make diamonds this way for drills and saws that cut stone.' },
        ],
        sci: [
          { rows: [
            ['Pressure', 'about 5 to 6 GPa (here 6 GPa)'],
            ['Temperature', 'about 1300 to 1600 °C (here 1500 °C)'],
            ['Catalyst', 'molten iron, nickel or cobalt dissolves the graphite; diamond crystallises out of it'],
            ['First done', 'General Electric, 1954: Tracy Hall’s belt press'],
            ['Today', 'cubic presses and chemical vapour deposition (CVD); most industrial diamond is made, not mined'],
          ] },
          { p: 'At 1500 °C diamond becomes the stable form of carbon above about 5.7 GPa (the graphite–diamond equilibrium line). Press-grown diamonds come out as small cubo-octahedral crystals, often yellow from nitrogen atoms in the lattice.' },
        ],
      },
    },
    nanotube: {
      label: 'the nanotube', verb: 'Light up',
      sign: { title: 'Nanotube', kid: 'A sheet of graphene rolled into a tube. Walk through!', sci: 'Armchair (6,6): 0.81 nm across, walls one atom thick (Iijima, 1991).' },
      panel: {
        title: 'Carbon nanotube',
        kid: [
          { p: 'Roll a sheet of graphene into a tube and you get a carbon nanotube. You can walk through this one, made 5 billion times bigger: a real one is about 80 000 times thinner than a hair.' },
          { big: '1 atom', small: 'the walls are one atom thick' },
          { p: 'Nanotubes are among the strongest materials ever made, and they carry electricity. The Japanese scientist Sumio Iijima described them in 1991.' },
        ],
        sci: [
          { rows: [
            ['This tube', '(6,6) armchair: 0.81 nm across, metallic'],
            ['Rolling', 'the chiral vector C = n·a₁ + m·a₂ becomes the circumference'],
            ['Electrons', 'metallic when n − m is a multiple of 3 (all armchair tubes), otherwise semiconducting'],
            ['Discovery', 'Sumio Iijima (NEC), 1991, multi-walled; single-walled tubes in 1993'],
            ['Strength', 'tensile strength measured up to about 60 GPa (strong steel: 1 to 2 GPa)'],
          ] },
          { p: 'Some tubes are centimetres long and only a nanometre wide. They are used to strengthen plastics, in battery electrodes and in research on tiny transistors.' },
        ],
      },
    },
    fullerene: {
      label: 'the faces of C60', verb: 'Count',
      sign: { title: 'Buckminsterfullerene', kid: 'C60: a hollow ball of 60 atoms. You are inside one!', sci: '60 atoms, 90 bonds, 12 pentagons, 20 hexagons (1985).' },
      panel: {
        title: 'Buckminsterfullerene, C₆₀',
        kid: [
          { p: 'You are inside a C₆₀ molecule: 60 carbon atoms making a hollow cage shaped like a ball. Its faces: 12 pentagons and 20 hexagons.' },
          { big: 'C₆₀', small: '60 atoms, 90 bonds' },
          { p: 'It was discovered in 1985 by Harold Kroto, Robert Curl and Richard Smalley, who won the Nobel Prize in Chemistry in 1996. They named it after the architect Buckminster Fuller, famous for domes just like this one.' },
        ],
        sci: [
          { rows: [
            ['Shape', 'truncated icosahedron, symmetry Ih'],
            ['Counting', '60 vertices − 90 edges + 32 faces = 2 (Euler)'],
            ['Bonds', '30 between two hexagons (6:6), 1.40 Å, with double-bond character; 60 between a pentagon and a hexagon (5:6), 1.45 Å'],
            ['Size', '0.71 nm between opposite nuclei; this dome is drawn at 1.3 m per ångström'],
            ['Discovery', '1985, Rice University: Kroto, Curl and Smalley, with Heath and O’Brien; Nobel Prize in Chemistry 1996'],
          ] },
          { p: 'Any closed cage of three-bonded atoms made of pentagons and hexagons has exactly 12 pentagons, whatever the number of hexagons. C₆₀ is the smallest in which no two pentagons touch (the isolated pentagon rule), which makes it especially stable. The double sticks here are the 6:6 bonds.' },
        ],
      },
    },
    football: {
      label: 'the football', verb: 'Kick',
      sign: { title: 'The same pattern', kid: '12 pentagons and 20 hexagons, like C60.', sci: 'A truncated icosahedron: 32 panels, 60 corners, 90 seams.' },
      panel: {
        title: 'The same pattern',
        kid: [
          { p: 'A classic football is sewn from 12 black pentagons and 20 white hexagons: the same pattern as C₆₀! That is why C₆₀ is nicknamed the buckyball.' },
          { big: '12 + 20', small: 'pentagons + hexagons, just like C₆₀' },
        ],
        sci: [
          { p: 'The 32-panel ball is a truncated icosahedron puffed out into a sphere: 60 corners where three panels meet and 90 seams, like C₆₀’s 60 atoms and 90 bonds. It became famous with the Adidas Telstar of the 1970 World Cup, black and white so that it showed up on black-and-white television.' },
        ],
      },
    },
  },
}

const PT = {
  back: 'Voltar ao átrio',
  kicker: 'Diamante, grafite e companhia',
  decimal: ',',
  wall: 'Um elemento, muitas formas',
  greeting: {
    kid: 'Bem-vindo à minha galeria! Olha para o chão: estás a andar em grafeno, uma só camada dos meus átomos. Aqui sou diamante, lápis, tubo e bola. Experimenta cada peça para as descobrires todas!',
    sci: 'Alótropos: um só elemento, ligações diferentes. sp³ no diamante; sp² na grafite, no grafeno, nos nanotubos e nos fulerenos. O chão é grafeno desenhado a 0,5 m por ångström. Ao longo da parede da esquerda: o grafeno visto de quatro lados, e a bicamada torcida.',
  },
  pentagons: 'pentágonos',
  hexagons: 'hexágonos',
  totals: 'átomos · ligações',
  pressTitle: 'PRENSA DE DIAMANTES',
  source: 'fonte',
  drain: 'dreno',
  gate: 'porta',
  gateVoltage: 'tensão na porta',
  modes: ['grafeno simples', 'bicamada num campo'],
  catLabel: 'gato: 4 kg',
  press: {
    steps: [
      { verb: 'Pôr', label: 'grafite na prensa' },
      { verb: 'Apertar', label: 'a prensa até 6 GPa' },
      { verb: 'Aquecer', label: 'a cápsula até 1500 °C' },
      { verb: 'Abrir', label: 'a prensa' },
      { verb: 'Recomeçar', label: 'com grafite nova' },
    ],
    wait: 'Espera',
    working: 'a prensa está a trabalhar…',
    say: [
      'A grafite está dentro da cápsula. Agora aperta!',
      '6 GPa: como 25 elefantes em cima de uma moeda de 1 cêntimo. Agora aquece!',
      '1500 °C! As folhas planas estão a transformar-se na rede 3D do diamante. Abre a prensa!',
    ],
  },
  say: {
    peelFree: 'Uma única camada, solta: isto é grafeno! Usa a fita-cola outra vez para a pousar.',
    peelBack: 'De volta à pilha: folhas de grafeno empilhadas são grafite.',
    slideBack: 'Empilhadas outra vez. As folhas só estão pousadas umas nas outras, por isso deslizam com facilidade.',
    transistor: [
      'Vês? No ponto mais baixo a corrente continua a passar: o grafeno simples não consegue desligar. Experimenta outra vez, com um hiato.',
      'Com duas camadas num campo elétrico há um hiato, e a corrente para: DESLIGADO!',
    ],
    moire: nm => `O ângulo mágico, 1,1°! O padrão grande tem ${nm} nm, 52 átomos. Arrefecidas quase até ao zero absoluto, estas duas folhas conduzem a eletricidade sem resistência nenhuma.`,
  },
  signLine: {
    moire: (deg, nm) => (deg === 0 ? 'Alinhadas: sem moiré. Roda a folha de cima!' : `Rotação ${String(deg).replace('.', ',')}°: moiré de ${nm} nm${deg === 1.1 ? ' (o ângulo mágico)' : ''}`),
    readout: (deg, nm) => (deg < 0.05 ? 'Alinhadas: sem padrão' : `Rodada ${deg.toFixed(1).replace('.', ',')}°\no padrão repete-se a cada ${nm} nm`),
  },
  ex: {
    graphene: {
      label: 'a fita-cola', verb: 'Usar', labelBack: 'a folha de grafeno', verbBack: 'Pousar',
      sign: { title: 'Grafeno', kid: 'Descola uma camada da grafite com fita-cola.', sci: 'Uma camada de grafite: 2004, Geim e Novoselov (Prémio Nobel 2010).' },
      panel: {
        title: 'Grafeno',
        kid: [
          { p: 'A grafite é uma pilha de folhas planas. Descola só uma folha e tens grafeno: uma única camada de átomos de carbono ligados em hexágonos, como um favo de mel. Cada átomo segura três vizinhos.' },
          { big: '1 átomo', small: 'de espessura: o material mais fino que existe' },
          { p: 'Em 2004, Andre Geim e Konstantin Novoselov, em Manchester, descolaram grafite com fita-cola vezes sem conta, até sobrar só uma camada. Em 2010 ganharam o Prémio Nobel da Física.' },
          { p: 'O chão desta galeria também é grafeno, desenhado 5 mil milhões de vezes maior do que na realidade. Ao longo desta parede podes explorá-lo como um físico, um químico, um engenheiro e um cientista de materiais.' },
        ],
        sci: [
          { rows: [['Ligação', 'C–C 0,142 nm, sp², 120°'], ['Rede', 'hexagonal, a = 0,246 nm, dois átomos por célula'], ['Espessura', 'um átomo (na grafite, as camadas estão a 0,335 nm)'], ['Isolado', '2004, Andre Geim e Konstantin Novoselov (Manchester), por esfoliação mecânica com fita adesiva'], ['Prémio Nobel', 'Física, 2010']] },
          { p: 'Flocos finos sobre silício oxidado (300 nm de SiO₂) veem-se por interferência, por isso foi possível encontrar uma só camada num microscópio ótico comum; esta pilha descola a camada de cima de um cristal com empilhamento AB da mesma maneira.' },
          { p: 'Escala do chão: 0,5 m por ångström, 5 × 10⁹ vezes o tamanho real.' },
        ],
      },
    },
    physics: {
      label: 'os cones de energia do grafeno', verb: 'Ver',
      sign: { title: 'Grafeno · Física', kid: 'Os eletrões correm por ele como se não pesassem nada.', sci: 'Cones de Dirac nos seis pontos K; eletrões a cerca de 1 000 000 m/s.' },
      panel: {
        title: 'Grafeno · Física',
        kid: [
          { p: 'No grafeno, os eletrões correm pela folha como se não pesassem nada, a cerca de 1000 km por segundo (1/300 da velocidade da luz).' },
          { p: 'A escultura mostra as energias que um eletrão pode ter no grafeno: uma superfície azul em baixo e uma laranja em cima. Só se tocam em seis pontos, onde cada superfície é um cone. São esses pontos que tornam o grafeno especial.' },
          { big: '2,3%', small: 'da luz fica retida numa única camada: dá para a ver a olho nu' },
          { p: 'Também conduz o calor muitíssimo bem. Um físico canadiano, Philip Wallace, calculou tudo isto no papel em 1947, mais de 50 anos antes de alguém fazer grafeno.' },
        ],
        sci: [
          { big: 'E = ±ħv|k|', small: 'perto dos pontos K: fermiões de Dirac sem massa, com dispersão linear (v, a velocidade de Fermi)' },
          { rows: [
            ['Velocidade de Fermi', 'v ≈ 1 × 10⁶ m/s, cerca de 1/300 da velocidade da luz'],
            ['Estrutura de bandas', 'P. R. Wallace, 1947, modelo de ligações fortes: E(k) = ±t·|1 + exp(ik·a₁) + exp(ik·a₂)|, t ≈ 2,8 eV'],
            ['Efeito de Hall quântico', 'semi-inteiro, σxy = ±4(n + ½)e²/h (2005); observado até à temperatura ambiente (2007)'],
            ['Luz', 'uma camada absorve πα ≈ 2,3% da luz branca (α, a constante de estrutura fina)'],
            ['Calor', 'o grafeno suspenso conduz milhares de W/(m·K)'],
          ] },
          { p: 'A escultura é a banda π sobre a zona de Brillouin hexagonal: a banda de valência (azul) está cheia, a de condução (laranja) vazia, e só se encontram nos seis cantos K e K′, onde as superfícies se tornam cones. As linhas são curvas de igual energia: círculos à volta de cada ponto K, triângulos mais longe. Usa-a: saem anéis dos pontos K com inclinação constante, que é a dispersão linear.' },
        ],
      },
    },
    chemistry: {
      label: 'as orbitais pi', verb: 'Ver',
      sign: { title: 'Grafeno · Química', kid: 'Três mãos no plano, um eletrão partilhado por todos.', sci: 'sp²: três ligações sigma a 120°, um eletrão pi por átomo.' },
      panel: {
        title: 'Grafeno · Química',
        kid: [
          { p: 'No grafeno, cada átomo de carbono segura três vizinhos, no mesmo plano, com ângulos iguais de 120°. O quarto eletrão é partilhado com toda a folha, em nuvens por cima e por baixo dela (as formas azuis e laranja).' },
          { big: '120°', small: 'entre as três ligações de cada átomo' },
          { p: 'Os químicos transformam-no: junta oxigénio e tens óxido de grafeno; junta um hidrogénio a cada átomo e tens grafano, que já não conduz a eletricidade.' },
          { p: 'As folhas grandes fazem-se passando um gás com carbono (metano) sobre folha de cobre muito quente: os átomos de carbono assentam numa única camada.' },
        ],
        sci: [
          { rows: [
            ['Ligações', 'sp²: três ligações σ a 120°, C–C 0,142 nm; um eletrão pz por átomo em ligações π deslocalizadas'],
            ['Óxido de grafeno', 'grafite oxidada (método de Hummers, 1958) separada em folhas: grupos epóxido e hidroxilo no plano, carboxilo nas margens; um isolador que pode voltar a ser reduzido'],
            ['Grafano', 'cada carbono ligado a um hidrogénio (sp³); obtido em 2009 expondo grafeno a um plasma de hidrogénio; isolador, reversível com aquecimento'],
            ['Crescimento', 'deposição química em fase de vapor: metano sobre folha de cobre a cerca de 1000 °C dá folhas grandes de uma só camada (2009); o carbono quase não se dissolve no cobre, por isso o crescimento para numa camada'],
          ] },
          { p: 'O modelo mostra um hexágono de grafeno: as ligações σ no plano e a orbital p de cada átomo, atravessada ao plano, com uma fase em cima (azul) e outra em baixo (laranja). Usa-o: as orbitais p juntam-se nas nuvens π que se espalham por toda a folha.' },
        ],
      },
    },
    electronics: {
      label: 'o transístor de grafeno', verb: 'Experimentar',
      sign: { title: 'Grafeno · Eletrónica', kid: 'Um interruptor muito rápido que nunca desliga por completo.', sci: 'Sem hiato de energia: um semimetal. Razão ligado/desligado só de 5 a 10.' },
      panel: {
        title: 'Grafeno · Eletrónica',
        kid: [
          { p: 'Um transístor é um interruptor minúsculo: um computador tem milhares de milhões deles. Os eletrões correm tão depressa no grafeno que dá transístores muito rápidos, mas há um problema: não consegue desligar por completo.' },
          { p: 'Roda o botão: a corrente desce, mas mesmo no ponto mais baixo continua a passar. Roda outra vez: agora há duas camadas num campo elétrico, e a corrente para.' },
          { big: 'sem hiato', small: 'sozinho, o grafeno nunca desliga por completo' },
          { p: 'Os cientistas abrem um hiato: duas camadas num campo elétrico, ou grafeno cortado em fitas muito estreitas. Também se usa em elétrodos transparentes e em sensores que sentem moléculas isoladas.' },
        ],
        sci: [
          { rows: [
            ['Hiato de energia', 'nenhum: um semimetal (hiato nulo); no ponto de Dirac a condutância tem um mínimo, não zero'],
            ['Razão ligado/desligado', 'cerca de 5 a 10 à temperatura ambiente num transístor de grafeno simples; a lógica de silício precisa de cerca de 10⁴ a 10⁷'],
            ['Abrir um hiato', 'grafeno bicamada num campo elétrico perpendicular (até cerca de 0,25 eV, 2009); nanofitas com poucos nanómetros de largura'],
            ['Usos', 'transístores de radiofrequência (frequências de corte de centenas de GHz), películas condutoras transparentes, sensores capazes de detetar moléculas de gás isoladas'],
          ] },
          { p: 'Condução ambipolar: a porta sobe o nível de Fermi para a banda de condução (eletrões) ou desce-o para a banda de valência (lacunas); a corrente é mínima onde os dois cones se encontram, o ponto de neutralidade de carga.' },
        ],
      },
    },
    materials: {
      label: 'a rede de descanso de grafeno', verb: 'Ver',
      sign: { title: 'Grafeno · Materiais', kid: 'Um metro quadrado aguentaria um gato e pesaria menos do que um bigode.', sci: 'Resistência cerca de 130 GPa, módulo de Young cerca de 1 TPa, 0,77 mg por metro quadrado.' },
      panel: {
        title: 'Grafeno · Materiais',
        kid: [
          { p: 'Uma rede de descanso de grafeno com um metro quadrado aguentaria este gato de 4 kg, e pesaria só 0,77 miligramas: menos do que um dos bigodes do gato!' },
          { big: '0,77 mg', small: 'a massa de um metro quadrado de grafeno' },
          { p: 'É um dos materiais mais resistentes alguma vez medidos. E nem os átomos de gás mais pequenos, os de hélio, atravessam uma folha perfeita.' },
          { p: 'Por isso experimenta-se em plásticos leves e fortes, em revestimentos contra a ferrugem, em baterias e em filtros que limpam a água.' },
        ],
        sci: [
          { rows: [
            ['Espessura', 'um átomo (0,335 nm como camada na grafite)'],
            ['Resistência', 'resistência intrínseca cerca de 130 GPa, módulo de Young cerca de 1 TPa (Lee, Wei, Kysar e Hone, Science 2008, pressionando a ponta de um AFM contra folhas suspensas)'],
            ['Densidade superficial', '0,77 mg por metro quadrado'],
            ['Barreira', 'impermeável aos gases, até ao hélio (2008)'],
            ['Usos', 'compósitos, revestimentos anticorrosão, elétrodos de baterias e supercondensadores, membranas para filtrar e dessalinizar água'],
          ] },
          { p: 'A rede de descanso é o exemplo do comité Nobel (2010): uma tira com um metro de largura só parte com cerca de 42 N, o peso de cerca de 4 kg. As folhas reais têm defeitos e fronteiras de grão, por isso as grandes são mais fracas do que este ideal.' },
        ],
      },
    },
    moire: {
      label: 'o ângulo mágico (1,1°)', verb: 'Rodar até',
      sign: { title: 'Fronteira: grafeno torcido', kid: 'Duas folhas, uma a rodar: vê um padrão gigante aparecer sozinho.', sci: 'Bicamada torcida: no ângulo mágico (1,1°), supercondutividade.' },
      panel: {
        title: 'Fronteira: grafeno torcido',
        kid: [
          { p: 'Duas folhas de grafeno, uma em cima da outra, a de cima a rodar devagar. Não há nada pintado nelas: o padrão grande aparece sozinho onde os dois favos se sobrepõem, como duas cortinas de renda em frente a uma janela. Quanto menor a rotação, maior o padrão.' },
          { big: '1,1°', small: 'o ângulo mágico' },
          { p: 'A 1,1°, mais ou menos o que o ponteiro dos minutos de um relógio anda em 11 segundos, duas simples folhas de carbono, arrefecidas quase até ao zero absoluto, conduzem a eletricidade sem resistência nenhuma: são um supercondutor. Muda-se um pouco quantos eletrões têm e as mesmas folhas bloqueiam a eletricidade por completo. Uma pequena rotação muda aquilo que o material é!' },
          { p: 'Porque é tão importante: foi descoberto em 2018 por Yuan Cao, um jovem estudante do laboratório de Pablo Jarillo-Herrero, no MIT. A revista Physics World chamou-lhe a grande descoberta do ano; Jarillo-Herrero e os dois físicos que tinham previsto o ângulo mágico partilharam o Prémio Wolf de Física em 2020; e a ciência ganhou uma palavra nova, twistrónica: a eletrónica das rotações. Hoje, laboratórios do mundo inteiro empilham e rodam folhas com um átomo de espessura, como um baralho de cartas, para criar materiais que não existem na natureza.' },
        ],
        sci: [
          { big: 'θ ≈ 1,1°', small: 'o ângulo mágico: bandas planas, isoladores correlacionados, supercondutividade' },
          { rows: [
            ['Período do moiré', 'λ = a / (2 sen(θ/2)): cerca de 13 nm a 1,1° (a = 0,246 nm), uns 11 000 átomos em cada célula do moiré'],
            ['Previsão', 'bandas planas no ângulo mágico: Rafi Bistritzer e Allan MacDonald, PNAS, 2011'],
            ['Descoberta', 'Yuan Cao, Pablo Jarillo-Herrero e colegas (MIT), dois artigos na Nature, 2018: estados isoladores correlacionados a meio enchimento das bandas planas e, junto deles, supercondutividade abaixo de cerca de 1,7 K'],
            ['Uma palavra nova', 'twistrónica: afinar um material pelo ângulo entre as suas camadas (grupo de Efthimios Kaxiras, Harvard, 2017)'],
            ['Reconhecimento', 'Breakthrough of the Year 2018 da Physics World; Prémio Wolf de Física 2020 (Bistritzer, Jarillo-Herrero, MacDonald)'],
            ['Desde então', 'magnetismo e isoladores de Chern nas bandas planas, tricamadas torcidas, dicalcogenetos de metais de transição torcidos: o efeito Hall anómalo quântico fracionário no MoTe₂ torcido (2023), quasipartículas com uma fração da carga do eletrão, sem íman nenhum'],
          ] },
          { p: 'Porquê: perto do ângulo mágico as bandas do moiré ficam quase planas, a energia cinética dos eletrões fica abaixo da repulsão entre eles e organizam-se coletivamente, um pouco como nos supercondutores de óxido de cobre, mas num só dispositivo afinável: uma tensão de porta escolhe quantos eletrões enchem as bandas. As amostras fazem-se por “rasgar e empilhar” (2016): metade de um floco de grafeno é levantada, rodada pelo ângulo pretendido e pousada sobre a outra metade. Manter o mesmo ângulo em todo o dispositivo (a desordem do ângulo) ainda é a parte difícil.' },
          { p: 'Aqui as folhas estão desenhadas como transparências numa mesa de luz, com a = 2,7 cm, por isso o moiré de 1,1° tem cerca de 1,4 m. Nada marca o moiré: vem da sobreposição, mais claro onde os átomos ficam sobre átomos (AA), mais escuro onde se intercalam (AB).' },
        ],
      },
    },
    graphite: {
      label: 'as camadas de grafite', verb: 'Deslizar', verbBack: 'Empilhar',
      sign: { title: 'Grafite', kid: 'Folhas de hexágonos que deslizam umas sobre as outras.', sci: 'Empilhamento AB, camadas a 3,35 Å; C–C 1,42 Å em cada folha.' },
      panel: {
        title: 'Grafite',
        kid: [
          { p: 'A grafite é grafeno empilhado: folhas planas de hexágonos, umas em cima das outras. Dentro de cada folha os átomos seguram-se com força, mas as folhas mal se agarram umas às outras, por isso deslizam.' },
          { big: '3 mãos', small: 'cada átomo segura três vizinhos na sua folha' },
          { p: 'É por isso que a grafite é macia e escorregadia: está nos lápis e serve de lubrificante seco para fechaduras.' },
          { p: 'Os eletrões conseguem viajar ao longo das folhas, por isso a grafite conduz a eletricidade: está nas baterias e nos motores elétricos.' },
        ],
        sci: [
          { rows: [
            ['Empilhamento', 'ABAB (Bernal): uma camada sim, outra não, está deslocada uma ligação, por isso metade dos seus átomos fica sobre átomos e metade sobre o centro de hexágonos'],
            ['Distância entre camadas', '3,35 Å, unidas por forças de van der Waals'],
            ['Ligação no plano', 'C–C 1,42 Å, sp²'],
            ['Densidade', '2,27 g/cm³'],
            ['Condutividade', 'metálica ao longo das camadas; milhares de vezes menor na perpendicular'],
            ['Nome', 'do grego graphein, escrever (A. G. Werner, 1789)'],
          ] },
          { p: 'À pressão e à temperatura do dia a dia, a forma mais estável do carbono é a grafite, não o diamante. Os quartos eletrões estão deslocalizados em bandas π por toda a folha, e é por isso que a grafite conduz ao longo das camadas e tem um brilho cinzento.' },
        ],
      },
    },
    pencil: {
      label: 'o lápis gigante', verb: 'Escrever com',
      sign: { title: 'O lápis', kid: 'Ao escrever, ficam no papel camadas finas de grafite.', sci: 'Grafite e argila cozidas: não tem chumbo nenhum.' },
      panel: {
        title: 'O lápis',
        kid: [
          { p: 'Quando escreves, o papel arranca pequenas lascas da ponta: camadas de grafite a deslizar. O teu traço é feito de folhas finas de carbono!' },
          { p: 'Em inglês a mina do lápis chama-se lead, chumbo, mas não tem chumbo nenhum: é grafite misturada com argila. Mais argila dá um traço mais duro e claro (H); mais grafite, um traço mais macio e escuro (B).' },
          { big: 'grafite', small: 'do grego graphein: escrever' },
        ],
        sci: [
          { rows: [
            ['Mina', 'pó de grafite e argila, misturados, prensados e cozidos'],
            ['Durezas', 'de 9H (duro, claro) a 9B (macio, negro); HB ao meio'],
            ['Traço', 'lascas de grafite com alguns nanómetros a micrómetros de espessura, presas nas fibras do papel'],
          ] },
          { p: 'No século XVI encontrou-se em Borrowdale, Inglaterra, uma grande jazida de grafite invulgarmente pura. Pensava-se que era um tipo de chumbo (plumbago), e o nome ficou. Carl Scheele mostrou em 1779 que a grafite é carbono.' },
        ],
      },
    },
    diamond: {
      label: 'a rede do diamante', verb: 'Ver',
      sign: { title: 'Diamante', kid: 'Cada átomo segura outros quatro, em 3D. O material natural mais duro.', sci: 'Cúbico, a = 3,567 Å; C–C 1,545 Å a 109,5°; sp³.' },
      panel: {
        title: 'Diamante',
        kid: [
          { p: 'No diamante, cada átomo de carbono segura outros quatro, virados para os cantos de uma pirâmide de base triangular (um tetraedro). Todos os átomos ficam presos numa só rede, forte em todas as direções.' },
          { big: '10', small: 'na escala de Mohs: o material natural mais duro' },
          { p: 'O diamante conduz o calor melhor do que qualquer outro material natural, cerca de cinco vezes melhor do que o cobre. É por isso que um diamante parece frio quando lhe tocas.' },
          { p: 'Os diamantes naturais cresceram a cerca de 150 km de profundidade, apertados e aquecidos dentro da Terra, e foram trazidos para cima por erupções vulcânicas.' },
        ],
        sci: [
          { rows: [
            ['Estrutura', 'cúbica do diamante: duas redes cúbicas de faces centradas, uma deslocada um quarto da diagonal do cubo'],
            ['Célula', 'a = 3,567 Å, 8 átomos'],
            ['Ligação', 'C–C 1,545 Å, sp³, 109,47°'],
            ['Densidade', '3,51 g/cm³ (grafite 2,27)'],
            ['Dureza', 'Mohs 10'],
            ['Condutividade térmica', 'cerca de 2000 a 2200 W/(m·K); cobre cerca de 400'],
            ['Banda proibida', '5,5 eV: um isolador elétrico'],
          ] },
          { p: 'À pressão ambiente o diamante é metaestável: a grafite é ligeiramente mais estável, mas a mudança teria de partir todas as ligações, por isso nunca acontece à temperatura ambiente. Os diamantes naturais formaram-se a 140 a 200 km de profundidade (cerca de 4,5 a 6 GPa, 900 a 1300 °C) e chegaram à superfície em erupções de quimberlito.' },
        ],
      },
    },
    brilliant: {
      label: 'o brilhante', verb: 'Ver',
      sign: { title: 'O brilhante', kid: 'A luz salta lá dentro e separa-se em cores.', sci: 'n = 2,42, ângulo crítico 24,4°, dispersão 0,044; 57 facetas.' },
      panel: {
        title: 'O brilhante',
        kid: [
          { p: 'Um diamante lapidado brilha porque desvia muito a luz. A luz que entra salta de faceta em faceta lá dentro e volta a sair por cima, na direção dos teus olhos.' },
          { big: '57 facetas', small: 'a lapidação de brilhante' },
          { p: 'O diamante também separa a luz branca nas suas cores, como um prisma. Os joalheiros chamam fogo a esses lampejos de cor.' },
          { p: 'Esta pedra é desenhada da mesma maneira: cada raio de luz é seguido lá dentro, salto a salto.' },
        ],
        sci: [
          { rows: [
            ['Índice de refração', 'n = 2,42 (vidro cerca de 1,5, água 1,33)'],
            ['Ângulo crítico', '24,4°: lá dentro, a luz que chega a uma faceta com mais do que este ângulo em relação à perpendicular é totalmente refletida'],
            ['Dispersão', '0,044 (n do violeta 2,45 menos n do vermelho 2,41)'],
            ['Lapidação', 'brilhante redondo: 57 facetas (58 com culaça); proporções calculadas por Marcel Tolkowsky em 1919'],
          ] },
          { p: 'As facetas do pavilhão inclinam-se cerca de 41°, por isso a luz que entra pela mesa é totalmente refletida de um lado do pavilhão para o outro e sai pela coroa. Aqui cada píxel segue o seu raio pelas facetas verdadeiras, com um índice diferente para a luz vermelha, verde e azul.' },
        ],
      },
    },
    press: {
      sign: { title: 'A prensa de diamantes', kid: 'Aperta e aquece grafite para fazer um diamante.', sci: 'Alta pressão e temperatura: cerca de 6 GPa e 1500 °C, com um metal catalisador.' },
      panel: {
        title: 'Fizeste um diamante!',
        kid: [
          { p: 'Apertaste grafite com tanta força como 25 elefantes em cima de uma moeda de 1 cêntimo e aqueceste-a a 1500 °C. As suas folhas planas reorganizaram-se na rede forte, em 3D, do diamante.' },
          { big: '6 GPa', small: '60 000 vezes a pressão do ar' },
          { p: 'É o que acontece naturalmente a cerca de 150 km debaixo dos teus pés. As fábricas fazem diamantes assim para brocas e serras que cortam pedra.' },
        ],
        sci: [
          { rows: [
            ['Pressão', 'cerca de 5 a 6 GPa (aqui 6 GPa)'],
            ['Temperatura', 'cerca de 1300 a 1600 °C (aqui 1500 °C)'],
            ['Catalisador', 'ferro, níquel ou cobalto fundidos dissolvem a grafite; o diamante cristaliza a partir deles'],
            ['Primeira vez', 'General Electric, 1954: a prensa de cinta de Tracy Hall'],
            ['Hoje', 'prensas cúbicas e deposição química em fase de vapor (CVD); a maior parte do diamante industrial é fabricada, não extraída'],
          ] },
          { p: 'A 1500 °C o diamante passa a ser a forma estável do carbono acima de cerca de 5,7 GPa (a linha de equilíbrio grafite–diamante). Os diamantes feitos em prensa saem como pequenos cristais cubo-octaédricos, muitas vezes amarelos por causa de átomos de azoto na rede.' },
        ],
      },
    },
    nanotube: {
      label: 'o nanotubo', verb: 'Acender',
      sign: { title: 'Nanotubo', kid: 'Uma folha de grafeno enrolada num tubo. Atravessa-o!', sci: 'Tipo armchair (6,6): 0,81 nm de diâmetro, paredes de um átomo (Iijima, 1991).' },
      panel: {
        title: 'Nanotubo de carbono',
        kid: [
          { p: 'Enrola uma folha de grafeno num tubo e tens um nanotubo de carbono. Podes atravessar este, 5 mil milhões de vezes maior: um verdadeiro é cerca de 80 000 vezes mais fino do que um cabelo.' },
          { big: '1 átomo', small: 'as paredes têm um átomo de espessura' },
          { p: 'Os nanotubos estão entre os materiais mais resistentes alguma vez feitos, e conduzem a eletricidade. O cientista japonês Sumio Iijima descreveu-os em 1991.' },
        ],
        sci: [
          { rows: [
            ['Este tubo', '(6,6) armchair: 0,81 nm de diâmetro, metálico'],
            ['Enrolamento', 'o vetor quiral C = n·a₁ + m·a₂ passa a ser a circunferência'],
            ['Eletrões', 'metálico quando n − m é múltiplo de 3 (todos os armchair), senão semicondutor'],
            ['Descoberta', 'Sumio Iijima (NEC), 1991, de paredes múltiplas; de parede única em 1993'],
            ['Resistência', 'resistência à tração medida até cerca de 60 GPa (aço forte: 1 a 2 GPa)'],
          ] },
          { p: 'Há tubos com centímetros de comprimento e só um nanómetro de largura. Usam-se para reforçar plásticos, em elétrodos de baterias e na investigação de transístores minúsculos.' },
        ],
      },
    },
    fullerene: {
      label: 'as faces do C60', verb: 'Contar',
      sign: { title: 'Buckminsterfulereno', kid: 'C60: uma bola oca de 60 átomos. Estás dentro de uma!', sci: '60 átomos, 90 ligações, 12 pentágonos, 20 hexágonos (1985).' },
      panel: {
        title: 'Buckminsterfulereno, C₆₀',
        kid: [
          { p: 'Estás dentro de uma molécula de C₆₀: 60 átomos de carbono a formar uma gaiola oca com a forma de uma bola. As suas faces: 12 pentágonos e 20 hexágonos.' },
          { big: 'C₆₀', small: '60 átomos, 90 ligações' },
          { p: 'Foi descoberta em 1985 por Harold Kroto, Robert Curl e Richard Smalley, que ganharam o Prémio Nobel da Química em 1996. Deram-lhe o nome do arquiteto Buckminster Fuller, famoso por cúpulas iguaizinhas a esta.' },
        ],
        sci: [
          { rows: [
            ['Forma', 'icosaedro truncado, simetria Ih'],
            ['Contagem', '60 vértices − 90 arestas + 32 faces = 2 (Euler)'],
            ['Ligações', '30 entre dois hexágonos (6:6), com 1,40 Å e carácter de ligação dupla; 60 entre um pentágono e um hexágono (5:6), com 1,45 Å'],
            ['Tamanho', '0,71 nm entre núcleos opostos; esta cúpula está desenhada a 1,3 m por ångström'],
            ['Descoberta', '1985, Universidade Rice: Kroto, Curl e Smalley, com Heath e O’Brien; Prémio Nobel da Química 1996'],
          ] },
          { p: 'Qualquer gaiola fechada de átomos com três ligações, feita de pentágonos e hexágonos, tem exatamente 12 pentágonos, seja qual for o número de hexágonos. O C₆₀ é a mais pequena em que nenhum pentágono toca outro (a regra dos pentágonos isolados), o que a torna especialmente estável. Os paus duplos são as ligações 6:6.' },
        ],
      },
    },
    football: {
      label: 'a bola de futebol', verb: 'Chutar',
      sign: { title: 'O mesmo padrão', kid: '12 pentágonos e 20 hexágonos, como o C60.', sci: 'Um icosaedro truncado: 32 gomos, 60 vértices, 90 costuras.' },
      panel: {
        title: 'O mesmo padrão',
        kid: [
          { p: 'Uma bola de futebol clássica é cosida com 12 pentágonos pretos e 20 hexágonos brancos: o mesmo padrão do C₆₀! É por isso que o C₆₀ tem a alcunha de buckyball.' },
          { big: '12 + 20', small: 'pentágonos + hexágonos, tal como o C₆₀' },
        ],
        sci: [
          { p: 'A bola de 32 gomos é um icosaedro truncado insuflado até ficar esférico: 60 vértices onde se juntam três gomos e 90 costuras, tal como os 60 átomos e as 90 ligações do C₆₀. Ficou famosa com a Adidas Telstar do Mundial de 1970, a preto e branco para se ver bem na televisão a preto e branco.' },
        ],
      },
    },
  },
}

export const WORDS = { en: EN, 'pt-pt': PT }
export const wordsFor = lang => WORDS[lang] ?? (String(lang).startsWith('pt') ? PT : EN)
