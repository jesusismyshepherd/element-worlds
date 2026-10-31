// Every word of the allotropes gallery, in English, European Portuguese, Polish and German, at two
// depths: kid (Explorer) and sci (Scientist). Signs are the lecterns in the gallery (3D text: Latin
// letters with the Polish and German ones, no Greek, no subscripts); panels open in the HUD (any
// character). No em dashes. Prompts read "verb: label", so a label takes the case its verb needs.

const EN = {
  back: 'Back to the atrium',
  kicker: 'Diamond, graphite and company',
  decimal: '.',
  talkTo: 'Talk to',
  graphiteWord: 'GRAPHITE',
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
    hints: ['Tap the graphite on the tray', 'Tap the red lever to squeeze', 'Tap the capsule to heat it', 'Tap the piston to open the press', 'Tap the diamond to start again'],
    buttons: ['Put in the graphite', 'Squeeze to 6 GPa', 'Heat to 1500 °C', 'Open the press', 'Start again'],
    how: {
      kid: 'Make a diamond: put the graphite in, squeeze it, heat it, open the press. Tap each thing in turn, or use the buttons.',
      sci: 'High pressure, high temperature (HPHT): load the graphite, press it to about 6 GPa, heat it to about 1500 °C, then cool it and let the pressure off.',
    },
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
  moireControls: {
    hint: {
      kid: 'Turn the top sheet with the slider: watch its corners, the pattern and the board. At 1.1° the two gold lines go flat: the electrons almost stop.',
      sci: 'Twist with the slider; the board shows the bands along K′-K-Γ-M-K′ and the middle-band width against the angle.',
    },
    twist: 'Twist',
    rings: 'Ring size (the drawing only)',
    magic: '✨ The magic angle, 1.1°',
    auto: 'Let it turn by itself',
  },
  board: {
    kid: {
      title: 'What the electrons can do', sub: 'each line: a way the electrons can move', energy: 'energy',
      speed: 'How fast the electrons can move', speedKid: p => `${p} % of their speed in ordinary graphene`, speedSci: (v, w) => `v*/v = ${v} · middle bands ${w} meV wide`,
      strip: 'How flat the middle lines are (lower is flatter)', magic: 'magic 1.1°', tooSmall: 'Twist more than half a degree to see the lines',
    },
    sci: {
      title: 'Bands near the Fermi level (meV)', sub: 'Bistritzer-MacDonald model, one valley', energy: 'E (meV)',
      speed: 'Dirac velocity', speedKid: p => `${p} %`, speedSci: (v, w) => `v*/v = ${v} · middle bands ${w} meV wide`,
      strip: 'Middle-band width against twist (meV, log scale)', magic: 'magic 1.1°', tooSmall: 'Below 0.5° the bands crowd together',
    },
  },
  signLine: {
    moire: (deg, nm) => (deg === 0 ? 'Aligned: no moiré. Twist the top sheet!' : `Twist ${deg}°: moiré ${nm} nm${deg === 1.1 ? ' (the magic angle)' : ''}`),
    readout: (deg, nm) => (deg < 0.05 ? 'Aligned: no pattern' : `Turned ${deg.toFixed(deg < 2 ? 2 : 1)}°\nthe pattern repeats every ${nm} nm`),
  },
  ex: {
    graphene: {
      label: 'the sticky tape', verb: 'Use',
      taps: { hints: { peel: 'Tap the stack to peel off its top layer with the tape', back: 'Tap the floating sheet to put it back', moving: 'Watch the sheet' }, buttons: { peel: 'Peel off one layer', back: 'Put it back' } },
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
      taps: {
        hints: { sweep: 'Tap the gate, the middle gold bar, to turn its voltage down and up', gap: 'Tap the chip for two layers with a gap', again: 'Tap the gate again to see if the current stops now', plain: 'Tap the chip for plain graphene again', busy: 'Watch the current in the glass tube' },
        buttons: { sweep: 'Turn the knob down and up', plain: 'Plain graphene', gap: 'Two layers in a field' },
        slider: 'Gate voltage',
      },
      sign: { title: 'Graphene · Electronics', kid: 'A very fast switch that never switches fully off.', sci: 'No band gap: a semimetal. On/off ratio only about 5 to 10.' },
      panel: {
        title: 'Graphene · Electronics',
        kid: [
          { p: 'A transistor is a tiny switch: a computer has billions of them. Electrons rush through graphene so fast that it makes very fast transistors, but there is a problem: it cannot switch fully off.' },
          { p: 'Tap the gate (the middle gold bar), or move its voltage yourself: the current falls, but even at its lowest it keeps flowing. Now tap the chip for two layers in an electric field and try again: the current stops.' },
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
      label: 'the two sheets', verb: 'Twist',
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
      label: 'the graphite layers', verb: 'Slide',
      taps: { hints: { slide: 'Tap the layers to slide them', back: 'Tap the layers to stack them up again' }, buttons: { slide: 'Slide the layers', back: 'Stack them up' } },
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
  talkTo: 'Falar com',
  graphiteWord: 'GRAFITE',
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
    hints: ['Toca na grafite no tabuleiro', 'Toca na alavanca vermelha para apertar', 'Toca na cápsula para a aquecer', 'Toca no pistão para abrir a prensa', 'Toca no diamante para recomeçar'],
    buttons: ['Pôr a grafite', 'Apertar até 6 GPa', 'Aquecer até 1500 °C', 'Abrir a prensa', 'Recomeçar'],
    how: {
      kid: 'Faz um diamante: põe a grafite, aperta, aquece e abre a prensa. Toca em cada coisa, uma de cada vez, ou usa os botões.',
      sci: 'Alta pressão e alta temperatura (HPHT): pôr a grafite, apertar até cerca de 6 GPa, aquecer até cerca de 1500 °C, depois arrefecer e aliviar a pressão.',
    },
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
  moireControls: {
    hint: {
      kid: 'Roda a folha de cima com o cursor: vê os cantos, o padrão e o quadro. A 1,1° as duas linhas douradas ficam planas: os eletrões quase param.',
      sci: 'Roda com o cursor; o quadro mostra as bandas ao longo de K′-K-Γ-M-K′ e a largura das bandas do meio consoante o ângulo.',
    },
    twist: 'Rotação',
    rings: 'Tamanho dos anéis (só no desenho)',
    magic: '✨ O ângulo mágico, 1,1°',
    auto: 'Deixar rodar sozinha',
  },
  board: {
    kid: {
      title: 'O que os eletrões podem fazer', sub: 'cada linha: uma maneira de os eletrões se moverem', energy: 'energia',
      speed: 'Quão depressa se podem mover os eletrões', speedKid: p => `${p} % da sua velocidade no grafeno normal`, speedSci: (v, w) => `v*/v = ${v} · bandas do meio com ${w} meV de largura`,
      strip: 'Quão planas ficam as linhas do meio (mais abaixo, mais planas)', magic: 'mágico 1,1°', tooSmall: 'Roda mais de meio grau para veres as linhas',
    },
    sci: {
      title: 'Bandas perto do nível de Fermi (meV)', sub: 'modelo de Bistritzer-MacDonald, um vale', energy: 'E (meV)',
      speed: 'Velocidade de Dirac', speedKid: p => `${p} %`, speedSci: (v, w) => `v*/v = ${v} · bandas do meio com ${w} meV de largura`,
      strip: 'Largura das bandas do meio consoante a rotação (meV, escala log.)', magic: 'mágico 1,1°', tooSmall: 'Abaixo de 0,5° as bandas amontoam-se',
    },
  },
  signLine: {
    moire: (deg, nm) => (deg === 0 ? 'Alinhadas: sem moiré. Roda a folha de cima!' : `Rotação ${String(deg).replace('.', ',')}°: moiré de ${nm} nm${deg === 1.1 ? ' (o ângulo mágico)' : ''}`),
    readout: (deg, nm) => (deg < 0.05 ? 'Alinhadas: sem padrão' : `Rodada ${deg.toFixed(deg < 2 ? 2 : 1).replace('.', ',')}°\no padrão repete-se a cada ${nm} nm`),
  },
  ex: {
    graphene: {
      label: 'a fita-cola', verb: 'Usar',
      taps: { hints: { peel: 'Toca na pilha para descolar a camada de cima com a fita', back: 'Toca na folha a flutuar para a pousar', moving: 'Olha para a folha' }, buttons: { peel: 'Descolar uma camada', back: 'Pousar a folha' } },
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
      taps: {
        hints: { sweep: 'Toca na porta, a barra dourada do meio, para baixar e subir a tensão', gap: 'Toca no chip para teres duas camadas com um hiato', again: 'Toca outra vez na porta para ver se agora a corrente para', plain: 'Toca no chip para voltar ao grafeno simples', busy: 'Olha para a corrente no tubo de vidro' },
        buttons: { sweep: 'Rodar o botão para baixo e para cima', plain: 'Grafeno simples', gap: 'Duas camadas num campo' },
        slider: 'Tensão na porta',
      },
      sign: { title: 'Grafeno · Eletrónica', kid: 'Um interruptor muito rápido que nunca desliga por completo.', sci: 'Sem hiato de energia: um semimetal. Razão ligado/desligado só de 5 a 10.' },
      panel: {
        title: 'Grafeno · Eletrónica',
        kid: [
          { p: 'Um transístor é um interruptor minúsculo: um computador tem milhares de milhões deles. Os eletrões correm tão depressa no grafeno que dá transístores muito rápidos, mas há um problema: não consegue desligar por completo.' },
          { p: 'Toca na porta (a barra dourada do meio), ou muda tu a tensão: a corrente desce, mas mesmo no ponto mais baixo continua a passar. Agora toca no chip para teres duas camadas num campo elétrico e experimenta outra vez: a corrente para.' },
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
      label: 'as duas folhas', verb: 'Rodar',
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
      label: 'as camadas de grafite', verb: 'Deslizar',
      taps: { hints: { slide: 'Toca nas camadas para as deslizar', back: 'Toca nas camadas para as empilhar outra vez' }, buttons: { slide: 'Deslizar as camadas', back: 'Empilhar' } },
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

const PL = {
  back: 'Powrót do sali: Węgiel',
  kicker: 'Diament, grafit i spółka',
  decimal: ',',
  talkTo: 'Porozmawiaj',
  graphiteWord: 'GRAFIT',
  wall: 'Jeden pierwiastek, wiele postaci',
  greeting: {
    kid: 'Witaj w mojej galerii! Spójrz w dół: chodzisz po grafenie, jednej warstwie moich atomów. Tutaj jestem diamentem, ołówkiem, rurką i piłką. Wypróbuj każdy eksponat, żeby odkryć je wszystkie!',
    sci: 'Odmiany alotropowe: jeden pierwiastek, różne wiązania. sp³ w diamencie; sp² w graficie, grafenie, nanorurkach i fulerenach. Podłoga to grafen narysowany w skali 0,5 m na angstrem. Wzdłuż lewej ściany: grafen z czterech stron i skręcona dwuwarstwa.',
  },
  pentagons: 'pięciokąty',
  hexagons: 'sześciokąty',
  totals: 'atomy · wiązania',
  pressTitle: 'PRASA DIAMENTOWA',
  source: 'źródło',
  drain: 'dren',
  gate: 'bramka',
  gateVoltage: 'napięcie bramki',
  modes: ['zwykły grafen', 'dwuwarstwa w polu'],
  catLabel: 'kot: 4 kg',
  press: {
    hints: ['Dotknij grafitu na tacce', 'Dotknij czerwonej dźwigni, żeby ścisnąć', 'Dotknij kapsuły, żeby ją podgrzać', 'Dotknij tłoka, żeby otworzyć prasę', 'Dotknij diamentu, żeby zacząć od nowa'],
    buttons: ['Włóż grafit', 'Ściśnij do 6 GPa', 'Podgrzej do 1500 °C', 'Otwórz prasę', 'Zacznij od nowa'],
    how: {
      kid: 'Zrób diament: włóż grafit, ściśnij go, podgrzej i otwórz prasę. Dotykaj po kolei każdej rzeczy albo użyj przycisków.',
      sci: 'Wysokie ciśnienie i wysoka temperatura (HPHT): włożenie grafitu, ściśnięcie do około 6 GPa, podgrzanie do około 1500 °C, potem schłodzenie i zwolnienie nacisku.',
    },
    wait: 'Zaczekaj',
    working: 'prasa pracuje…',
    say: [
      'Grafit jest w kapsule. Teraz ściskaj!',
      '6 GPa: jak 25 słoni stojących na monecie jednocentowej. Teraz podgrzej!',
      '1500 °C! Płaskie warstwy zamieniają się w trójwymiarową sieć diamentu. Otwórz prasę!',
    ],
  },
  say: {
    peelFree: 'Jedna pojedyncza warstwa, wolna: to jest grafen! Użyj taśmy jeszcze raz, żeby ją odłożyć.',
    peelBack: 'Z powrotem na stosie: warstwy grafenu ułożone jedna na drugiej to grafit.',
    slideBack: 'Znowu w stosie. Warstwy tylko na sobie leżą, więc łatwo się przesuwają.',
    transistor: [
      'Widzisz? W najniższym punkcie prąd wciąż płynie: zwykły grafen nie potrafi się wyłączyć. Spróbuj jeszcze raz, z przerwą.',
      'Przy dwóch warstwach w polu elektrycznym jest przerwa i prąd staje: WYŁĄCZONE!',
    ],
    moire: nm => `Magiczny kąt, 1,1°! Duży wzór ma ${nm} nm szerokości, 52 atomy. Ochłodzone prawie do zera absolutnego, te dwie warstwy przewodzą prąd bez żadnego oporu.`,
  },
  moireControls: {
    hint: {
      kid: 'Obracaj górną warstwę suwakiem: patrz na jej rogi, na wzór i na tablicę. Przy 1,1° dwie złote linie robią się płaskie: elektrony prawie stoją.',
      sci: 'Skręcaj suwakiem; tablica pokazuje pasma wzdłuż K′-K-Γ-M-K′ i szerokość środkowych pasm w funkcji kąta.',
    },
    twist: 'Skręt',
    rings: 'Wielkość pierścieni (tylko na rysunku)',
    magic: '✨ Magiczny kąt, 1,1°',
    auto: 'Niech obraca się sama',
  },
  board: {
    kid: {
      title: 'Co mogą robić elektrony', sub: 'każda linia: jeden sposób ruchu elektronów', energy: 'energia',
      speed: 'Jak szybko mogą się poruszać elektrony', speedKid: p => `${p} % ich prędkości w zwykłym grafenie`, speedSci: (v, w) => `v*/v = ${v} · środkowe pasma szerokie na ${w} meV`,
      strip: 'Jak płaskie są środkowe linie (niżej: płaściej)', magic: 'magiczny 1,1°', tooSmall: 'Obróć o więcej niż pół stopnia, by zobaczyć linie',
    },
    sci: {
      title: 'Pasma blisko poziomu Fermiego (meV)', sub: 'model Bistritzera-MacDonalda, jedna dolina', energy: 'E (meV)',
      speed: 'Prędkość Diraca', speedKid: p => `${p} %`, speedSci: (v, w) => `v*/v = ${v} · środkowe pasma szerokie na ${w} meV`,
      strip: 'Szerokość środkowych pasm a skręt (meV, skala log.)', magic: 'magiczny 1,1°', tooSmall: 'Poniżej 0,5° pasma się zagęszczają',
    },
  },
  signLine: {
    moire: (deg, nm) => (deg === 0 ? 'Ułożone równo: brak mory. Obróć górną warstwę!' : `Skręt ${String(deg).replace('.', ',')}°: mora ${nm} nm${deg === 1.1 ? ' (magiczny kąt)' : ''}`),
    readout: (deg, nm) => (deg < 0.05 ? 'Ułożone równo: brak wzoru' : `Obrót ${deg.toFixed(deg < 2 ? 2 : 1).replace('.', ',')}°\nwzór powtarza się co ${nm} nm`),
  },
  ex: {
    graphene: {
      label: 'taśmy klejącej', verb: 'Użyj',
      taps: { hints: { peel: 'Dotknij stosu, żeby taśmą oderwać górną warstwę', back: 'Dotknij unoszącej się warstwy, żeby ją odłożyć', moving: 'Patrz na warstwę' }, buttons: { peel: 'Oderwij jedną warstwę', back: 'Odłóż ją' } },
      sign: { title: 'Grafen', kid: 'Oderwij taśmą klejącą jedną warstwę grafitu.', sci: 'Jedna warstwa grafitu: 2004, Geim i Novoselov (Nagroda Nobla 2010).' },
      panel: {
        title: 'Grafen',
        kid: [
          { p: 'Grafit to stos płaskich warstw. Oderwij tylko jedną warstwę, a masz grafen: pojedynczą warstwę atomów węgla połączonych w sześciokąty, jak plaster miodu. Każdy atom trzyma trzech sąsiadów.' },
          { big: '1 atom', small: 'grubości: najcieńszy materiał, jaki istnieje' },
          { p: 'W 2004 roku Andre Geim i Konstantin Novoselov w Manchesterze odrywali grafit taśmą klejącą raz za razem, aż została tylko jedna warstwa. W 2010 roku dostali za to Nagrodę Nobla z fizyki.' },
          { p: 'Podłoga tej galerii to też grafen, narysowany 5 miliardów razy większy niż w rzeczywistości. Wzdłuż tej ściany możesz go zbadać jak fizyk, chemik, inżynier i specjalista od materiałów.' },
        ],
        sci: [
          { rows: [['Wiązanie', 'C–C 0,142 nm, sp², 120°'], ['Sieć', 'heksagonalna, a = 0,246 nm, dwa atomy na komórkę'], ['Grubość', 'jeden atom (warstwy w graficie dzieli 0,335 nm)'], ['Wyodrębniony', '2004, Andre Geim i Konstantin Novoselov (Manchester), przez mechaniczną eksfoliację taśmą klejącą'], ['Nagroda Nobla', 'fizyka, 2010']] },
          { p: 'Cienkie płatki na utlenionym krzemie (300 nm SiO₂) widać dzięki interferencji, więc pojedynczą warstwę dało się znaleźć pod zwykłym mikroskopem optycznym; stos tutaj odrywa w ten sam sposób górną warstwę kryształu o ułożeniu AB.' },
          { p: 'Skala podłogi: 0,5 m na angstrem, 5 × 10⁹ razy więcej niż w rzeczywistości.' },
        ],
      },
    },
    physics: {
      label: 'stożki energii grafenu', verb: 'Zobacz',
      sign: { title: 'Grafen · Fizyka', kid: 'Elektrony pędzą przez niego, jakby nic nie ważyły.', sci: 'Stożki Diraca w sześciu punktach K; elektrony z prędkością ok. 1 000 000 m/s.' },
      panel: {
        title: 'Grafen · Fizyka',
        kid: [
          { p: 'W grafenie elektrony pędzą przez warstwę, jakby nic nie ważyły, z prędkością około 1000 km na sekundę (1/300 prędkości światła).' },
          { p: 'Rzeźba pokazuje energie, jakie elektron może mieć w grafenie: niebieską powierzchnię na dole i pomarańczową na górze. Stykają się tylko w sześciu punktach, gdzie każda powierzchnia jest stożkiem. To właśnie te punkty czynią grafen wyjątkowym.' },
          { big: '2,3%', small: 'światła zatrzymuje jedna pojedyncza warstwa: widać ją gołym okiem' },
          { p: 'Grafen świetnie przewodzi też ciepło. Kanadyjski fizyk Philip Wallace obliczył to wszystko na papierze w 1947 roku, ponad 50 lat zanim ktokolwiek wytworzył grafen.' },
        ],
        sci: [
          { big: 'E = ±ħv|k|', small: 'w pobliżu punktów K: bezmasowe fermiony Diraca z liniową dyspersją (v, prędkość Fermiego)' },
          { rows: [
            ['Prędkość Fermiego', 'v ≈ 1 × 10⁶ m/s, ok. 1/300 prędkości światła'],
            ['Struktura pasmowa', 'P. R. Wallace, 1947, model ciasnego wiązania: E(k) = ±t·|1 + exp(ik·a₁) + exp(ik·a₂)|, t ≈ 2,8 eV'],
            ['Kwantowy efekt Halla', 'połówkowy, σxy = ±4(n + ½)e²/h (2005); widoczny nawet w temperaturze pokojowej (2007)'],
            ['Światło', 'jedna warstwa pochłania πα ≈ 2,3% światła białego (α to stała struktury subtelnej)'],
            ['Ciepło', 'zawieszony grafen przewodzi tysiące W/(m·K)'],
          ] },
          { p: 'Rzeźba to pasmo π nad heksagonalną strefą Brillouina: pasmo walencyjne (niebieskie) jest pełne, pasmo przewodnictwa (pomarańczowe) puste, a spotykają się tylko w sześciu narożnikach K i K′, gdzie powierzchnie stają się stożkami. Linie to kontury stałej energii: okręgi wokół każdego punktu K, dalej trójkąty. Użyj jej: od punktów K rozchodzą się pierścienie o stałym nachyleniu, czyli liniowa dyspersja.' },
        ],
      },
    },
    chemistry: {
      label: 'orbitale pi', verb: 'Zobacz',
      sign: { title: 'Grafen · Chemia', kid: 'Trzy ręce w płaszczyźnie, jeden elektron wspólny dla wszystkich.', sci: 'sp²: trzy wiązania sigma pod kątem 120°, jeden elektron pi na atom.' },
      panel: {
        title: 'Grafen · Chemia',
        kid: [
          { p: 'W grafenie każdy atom węgla trzyma trzech sąsiadów, płasko, pod równymi kątami 120°. Swój czwarty elektron dzieli z całą warstwą, w chmurach nad nią i pod nią (niebieskie i pomarańczowe kształty).' },
          { big: '120°', small: 'między trzema wiązaniami każdego atomu' },
          { p: 'Chemicy go przerabiają: dodaj tlen, a dostaniesz tlenek grafenu; dodaj atom wodoru do każdego atomu węgla, a dostaniesz grafan, który już nie przewodzi prądu.' },
          { p: 'Duże warstwy hoduje się, przepuszczając gaz zawierający węgiel (metan) nad bardzo gorącą folią miedzianą: atomy węgla układają się w jedną pojedynczą warstwę.' },
        ],
        sci: [
          { rows: [
            ['Wiązania', 'sp²: trzy wiązania σ pod kątem 120°, C–C 0,142 nm; jeden elektron pz na atom w zdelokalizowanych wiązaniach π'],
            ['Tlenek grafenu', 'utleniony grafit (metoda Hummersa, 1958) rozdzielony na warstwy: grupy epoksydowe i hydroksylowe na płaszczyźnie, karboksylowe na brzegach; izolator, który można z powrotem zredukować'],
            ['Grafan', 'każdy atom węgla związany z jednym atomem wodoru (sp³); otrzymany w 2009 roku przez wystawienie grafenu na plazmę wodorową; izolator, odwracalny przez ogrzanie'],
            ['Wzrost', 'chemiczne osadzanie z fazy gazowej: metan na folii miedzianej w ok. 1000 °C daje duże jednowarstwowe arkusze (2009); węgiel prawie nie rozpuszcza się w miedzi, więc wzrost kończy się na jednej warstwie'],
          ] },
          { p: 'Model pokazuje jeden sześciokąt grafenu: wiązania σ w płaszczyźnie i orbital p każdego atomu stojący w poprzek niej, jedna faza nad nią (niebieska), druga pod nią (pomarańczowa). Użyj go: orbitale p łączą się w chmury π, które rozlewają się po całej warstwie.' },
        ],
      },
    },
    electronics: {
      label: 'tranzystor grafenowy', verb: 'Wypróbuj',
      taps: {
        hints: { sweep: 'Dotknij bramki, środkowej złotej belki, żeby obniżyć i podnieść napięcie', gap: 'Dotknij chipa, żeby mieć dwie warstwy z przerwą', again: 'Dotknij znowu bramki i zobacz, czy prąd teraz staje', plain: 'Dotknij chipa, żeby wrócić do zwykłego grafenu', busy: 'Patrz na prąd w szklanej rurce' },
        buttons: { sweep: 'Przekręć pokrętło w dół i w górę', plain: 'Zwykły grafen', gap: 'Dwie warstwy w polu' },
        slider: 'Napięcie bramki',
      },
      sign: { title: 'Grafen · Elektronika', kid: 'Bardzo szybki przełącznik, który nigdy nie wyłącza się całkiem.', sci: 'Brak przerwy energetycznej: półmetal. Stosunek on/off tylko ok. 5 do 10.' },
      panel: {
        title: 'Grafen · Elektronika',
        kid: [
          { p: 'Tranzystor to malutki przełącznik: komputer ma ich miliardy. Elektrony pędzą przez grafen tak szybko, że powstają z niego bardzo szybkie tranzystory, ale jest problem: grafenu nie da się całkiem wyłączyć.' },
          { p: 'Dotknij bramki (środkowej złotej belki) albo sam zmieniaj jej napięcie: prąd spada, ale nawet w najniższym punkcie wciąż płynie. Teraz dotknij chipa, żeby mieć dwie warstwy w polu elektrycznym, i spróbuj jeszcze raz: prąd staje.' },
          { big: 'brak przerwy', small: 'sam grafen nigdy nie wyłącza się całkiem' },
          { p: 'Naukowcy otwierają przerwę: dwie warstwy w polu elektrycznym albo grafen pocięty na bardzo wąskie wstążki. Używa się go też w przezroczystych elektrodach i w czujnikach, które wyczuwają pojedyncze cząsteczki.' },
        ],
        sci: [
          { rows: [
            ['Przerwa energetyczna', 'brak: półmetal (przerwa zerowa); w punkcie Diraca konduktancja ma minimum, a nie zero'],
            ['Stosunek on/off', 'ok. 5 do 10 w temperaturze pokojowej dla zwykłego tranzystora grafenowego; logika krzemowa potrzebuje ok. 10⁴ do 10⁷'],
            ['Otwarcie przerwy', 'grafen dwuwarstwowy w prostopadłym polu elektrycznym (do ok. 0,25 eV, 2009); nanowstążki szerokie na kilka nanometrów'],
            ['Zastosowania', 'tranzystory wielkiej częstotliwości (częstotliwości graniczne rzędu setek GHz), przezroczyste warstwy przewodzące, czujniki zdolne wykryć pojedyncze cząsteczki gazu'],
          ] },
          { p: 'Przewodnictwo ambipolarne: bramka przesuwa poziom Fermiego w górę, do pasma przewodnictwa (elektrony), albo w dół, do pasma walencyjnego (dziury); prąd jest najmniejszy tam, gdzie stykają się dwa stożki, w punkcie neutralności ładunku.' },
        ],
      },
    },
    materials: {
      label: 'hamak z grafenu', verb: 'Zobacz',
      sign: { title: 'Grafen · Materiały', kid: 'Metr kwadratowy utrzymałby kota i ważyłby mniej niż jeden wąs.', sci: 'Wytrzymałość ok. 130 GPa, moduł Younga ok. 1 TPa, 0,77 mg na metr kwadratowy.' },
      panel: {
        title: 'Grafen · Materiały',
        kid: [
          { p: 'Hamak z grafenu o powierzchni jednego metra kwadratowego utrzymałby tego kota ważącego 4 kg, a sam ważyłby tylko 0,77 miligrama: mniej niż jeden z kocich wąsów!' },
          { big: '0,77 mg', small: 'masa jednego metra kwadratowego grafenu' },
          { p: 'To jeden z najwytrzymalszych materiałów, jakie kiedykolwiek zmierzono. A przez idealną warstwę nie przejdą nawet najmniejsze atomy gazu, atomy helu.' },
          { p: 'Dlatego próbuje się go w mocnych, lekkich tworzywach, w powłokach chroniących przed rdzą, w bateriach i w filtrach, które oczyszczają wodę.' },
        ],
        sci: [
          { rows: [
            ['Grubość', 'jeden atom (0,335 nm jako warstwa w graficie)'],
            ['Wytrzymałość', 'wytrzymałość wewnętrzna ok. 130 GPa, moduł Younga ok. 1 TPa (Lee, Wei, Kysar i Hone, Science 2008, przez wciskanie ostrza AFM w zawieszone warstwy)'],
            ['Gęstość powierzchniowa', '0,77 mg na metr kwadratowy'],
            ['Bariera', 'nieprzepuszczalny dla gazów, nawet dla helu (2008)'],
            ['Zastosowania', 'kompozyty, powłoki antykorozyjne, elektrody baterii i superkondensatory, membrany do filtrowania i odsalania wody'],
          ] },
          { p: 'Hamak to przykład komitetu noblowskiego z 2010 roku: pas o szerokości jednego metra pęka dopiero przy ok. 42 N, czyli ciężarze ok. 4 kg. Prawdziwe warstwy mają defekty i granice ziaren, więc duże są słabsze niż ten ideał.' },
        ],
      },
    },
    moire: {
      label: 'dwie warstwy', verb: 'Skręć',
      sign: { title: 'Front badań: skręcony grafen', kid: 'Dwie warstwy, jedna się obraca: zobacz, jak sam pojawia się olbrzymi wzór.', sci: 'Skręcona dwuwarstwa: przy magicznym kącie (1,1°) nadprzewodnictwo.' },
      panel: {
        title: 'Front badań: skręcony grafen',
        kid: [
          { p: 'Dwie warstwy grafenu, jedna na drugiej, górna powoli się obraca. Nic na nich nie jest namalowane: duży wzór pojawia się sam tam, gdzie dwa plastry miodu na siebie zachodzą, jak dwie firanki przed oknem. Im mniejszy obrót, tym większy wzór.' },
          { big: '1,1°', small: 'magiczny kąt' },
          { p: 'Przy 1,1°, mniej więcej tyle, o ile wskazówka minutowa zegara przesuwa się w 11 sekund, dwie zwykłe warstwy węgla, ochłodzone prawie do zera absolutnego, przewodzą prąd bez żadnego oporu: są nadprzewodnikiem. Zmień trochę, ile mają elektronów, a te same warstwy całkiem zablokują prąd. Malutki obrót zmienia to, czym jest materiał!' },
          { p: 'Dlaczego to takie ważne: odkrył to w 2018 roku Yuan Cao, młody student w laboratorium Pabla Jarillo-Herrero w MIT. Czasopismo Physics World nazwało to przełomem roku; Jarillo-Herrero i dwaj fizycy, którzy przewidzieli magiczny kąt, podzielili się w 2020 roku Nagrodą Wolfa z fizyki; a nauka zyskała nowe słowo, twistronika: elektronika przez skręcanie. Dziś laboratoria na całym świecie układają i skręcają warstwy grube na jeden atom, jak talię kart, żeby tworzyć materiały, których nie ma w przyrodzie.' },
        ],
        sci: [
          { big: 'θ ≈ 1,1°', small: 'magiczny kąt: płaskie pasma, skorelowane izolatory, nadprzewodnictwo' },
          { rows: [
            ['Okres mory (moiré)', 'λ = a / (2 sin(θ/2)): ok. 13 nm przy 1,1° (a = 0,246 nm), ok. 11 000 atomów w każdej komórce mory'],
            ['Przewidywanie', 'płaskie pasma przy magicznym kącie: Rafi Bistritzer i Allan MacDonald, PNAS, 2011'],
            ['Odkrycie', 'Yuan Cao, Pablo Jarillo-Herrero i współpracownicy (MIT), dwie prace w Nature, 2018: skorelowane stany izolujące przy połowicznym zapełnieniu płaskich pasm, a tuż obok nich nadprzewodnictwo poniżej ok. 1,7 K'],
            ['Nowe słowo', 'twistronika: strojenie materiału kątem między jego warstwami (grupa Efthimiosa Kaxirasa, Harvard, 2017)'],
            ['Uznanie', 'Physics World Breakthrough of the Year 2018; Nagroda Wolfa z fizyki 2020 (Bistritzer, Jarillo-Herrero, MacDonald)'],
            ['Od tamtej pory', 'magnetyzm i izolatory Cherna w płaskich pasmach, skręcone trójwarstwy, skręcone dichalkogenki metali przejściowych: ułamkowy kwantowy anomalny efekt Halla w skręconym MoTe₂ (2023), kwazicząstki niosące ułamek ładunku elektronu, zupełnie bez magnesu'],
          ] },
          { p: 'Dlaczego: blisko magicznego kąta pasma mory stają się prawie płaskie, energia kinetyczna elektronów spada poniżej ich wzajemnego odpychania i elektrony organizują się zbiorowo, podobnie jak w nadprzewodnikach na bazie tlenków miedzi, ale w jednym przestrajalnym urządzeniu: napięcie bramki ustala, ile elektronów wypełnia pasma. Próbki robi się metodą „rozerwij i ułóż” (2016): połowę jednego płatka grafenu się podnosi, obraca o zadany kąt i kładzie na drugiej połowie. Utrzymanie jednego kąta w całym urządzeniu (nieporządek kąta skręcenia) to wciąż najtrudniejsza część.' },
          { p: 'Tutaj warstwy są narysowane jak folie na podświetlanym stole, z a = 2,7 cm, więc mora przy 1,1° ma ok. 1,4 m szerokości. Nic nie zaznacza mory: bierze się z nakładania, jaśniejsza tam, gdzie atomy leżą na atomach (AA), ciemniejsza tam, gdzie się przeplatają (AB).' },
        ],
      },
    },
    graphite: {
      label: 'warstwy grafitu', verb: 'Przesuń',
      taps: { hints: { slide: 'Dotknij warstw, żeby je przesunąć', back: 'Dotknij warstw, żeby znów ułożyć je w stos' }, buttons: { slide: 'Przesuń warstwy', back: 'Ułóż w stos' } },
      sign: { title: 'Grafit', kid: 'Warstwy sześciokątów, które ślizgają się po sobie.', sci: 'Ułożenie AB, warstwy co 3,35 Å; C–C 1,42 Å w każdej warstwie.' },
      panel: {
        title: 'Grafit',
        kid: [
          { p: 'Grafit to grafen ułożony w stos: płaskie warstwy sześciokątów, jedna na drugiej. Wewnątrz warstwy atomy trzymają się mocno, ale warstwy tylko słabo lgną do siebie, więc się ślizgają.' },
          { big: '3 ręce', small: 'każdy atom trzyma trzech sąsiadów w swojej warstwie' },
          { p: 'Dlatego grafit jest miękki i śliski: jest w ołówkach i służy jako suchy smar do zamków.' },
          { p: 'Elektrony mogą wędrować wzdłuż warstw, więc grafit przewodzi prąd: jest w bateriach i w silnikach elektrycznych.' },
        ],
        sci: [
          { rows: [
            ['Ułożenie', 'ABAB (Bernala): co druga warstwa jest przesunięta o jedno wiązanie, więc połowa jej atomów leży nad atomami, a połowa nad środkami sześciokątów'],
            ['Odległość warstw', '3,35 Å, utrzymywana przez siły van der Waalsa'],
            ['Wiązanie w warstwie', 'C–C 1,42 Å, sp²'],
            ['Gęstość', '2,27 g/cm³'],
            ['Przewodnictwo', 'metaliczne wzdłuż warstw; tysiące razy mniejsze w poprzek nich'],
            ['Nazwa', 'od greckiego graphein, pisać (A. G. Werner, 1789)'],
          ] },
          { p: 'Przy codziennym ciśnieniu i temperaturze najtrwalszą odmianą węgla jest grafit, nie diament. Czwarte elektrony są zdelokalizowane w pasmach π na całej warstwie, dlatego grafit przewodzi wzdłuż warstw i ma szary połysk.' },
        ],
      },
    },
    pencil: {
      label: 'olbrzymim ołówkiem', verb: 'Pisz',
      sign: { title: 'Ołówek', kid: 'Pisanie zostawia na papierze cienkie warstwy grafitu.', sci: 'Grafit i glina, wypalone: ani grama ołowiu.' },
      panel: {
        title: 'Ołówek',
        kid: [
          { p: 'Kiedy piszesz, papier zdrapuje z czubka malutkie płatki: zsuwające się warstwy grafitu. Twoja kreska składa się z cienkich warstw węgla!' },
          { p: 'Nazwa „ołówek” pochodzi od ołowiu, ale w ołówku nie ma ołowiu: jest grafit zmieszany z gliną. Więcej gliny daje twardszą, jaśniejszą kreskę (H); więcej grafitu bardziej miękką, ciemniejszą (B).' },
          { big: 'grafit', small: 'od greckiego graphein: pisać' },
        ],
        sci: [
          { rows: [
            ['Rdzeń', 'proszek grafitowy i glina, zmieszane, sprasowane i wypalone'],
            ['Twardości', 'od 9H (twardy, jasny) do 9B (miękki, czarny); HB pośrodku'],
            ['Kreska', 'płatki grafitu o grubości od kilku nanometrów do mikrometrów, uwięzione we włóknach papieru'],
          ] },
          { p: 'W XVI wieku w Borrowdale w Anglii znaleziono duże złoże niezwykle czystego grafitu. Ludzie wzięli go za rodzaj ołowiu (plumbago) i nazwa się przyjęła. Carl Scheele wykazał w 1779 roku, że grafit to węgiel.' },
        ],
      },
    },
    diamond: {
      label: 'sieć diamentu', verb: 'Zobacz',
      sign: { title: 'Diament', kid: 'Każdy atom trzyma cztery inne, w 3D. Najtwardszy naturalny materiał.', sci: 'Regularny, a = 3,567 Å; C–C 1,545 Å pod kątem 109,5°; sp³.' },
      panel: {
        title: 'Diament',
        kid: [
          { p: 'W diamencie każdy atom węgla trzyma cztery inne, skierowane do narożników piramidy o trójkątnej podstawie (czworościanu). Wszystkie atomy są zamknięte w jednej mocnej sieci, która biegnie we wszystkich kierunkach.' },
          { big: '10', small: 'w skali Mohsa: najtwardszy naturalny materiał' },
          { p: 'Diament przewodzi ciepło lepiej niż jakikolwiek inny naturalny materiał, około pięć razy lepiej niż miedź. Dlatego diament wydaje się zimny, kiedy go dotkniesz.' },
          { p: 'Naturalne diamenty rosły około 150 km pod ziemią, ściskane i podgrzewane we wnętrzu Ziemi, i zostały wyniesione na górę przez erupcje wulkanów.' },
        ],
        sci: [
          { rows: [
            ['Struktura', 'struktura diamentu: dwie sieci regularne ściennie centrowane, jedna przesunięta o ćwierć przekątnej sześcianu'],
            ['Komórka', 'a = 3,567 Å, 8 atomów'],
            ['Wiązanie', 'C–C 1,545 Å, sp³, 109,47°'],
            ['Gęstość', '3,51 g/cm³ (grafit 2,27)'],
            ['Twardość', '10 w skali Mohsa'],
            ['Przewodność cieplna', 'ok. 2000 do 2200 W/(m·K); miedź ok. 400'],
            ['Przerwa energetyczna', '5,5 eV: izolator elektryczny'],
          ] },
          { p: 'Przy ciśnieniu atmosferycznym diament jest metastabilny: grafit jest nieco trwalszy, ale przemiana musiałaby zerwać każde wiązanie, więc w temperaturze pokojowej nigdy nie zachodzi. Naturalne diamenty powstały na głębokości 140 do 200 km (ok. 4,5 do 6 GPa, 900 do 1300 °C) i dotarły na powierzchnię w erupcjach kimberlitowych.' },
        ],
      },
    },
    brilliant: {
      label: 'brylant', verb: 'Zobacz',
      sign: { title: 'Brylant', kid: 'Światło odbija się w środku i rozszczepia na kolory.', sci: 'n = 2,42, kąt graniczny 24,4°, dyspersja 0,044; 57 faset.' },
      panel: {
        title: 'Brylant',
        kid: [
          { p: 'Oszlifowany diament lśni, bo bardzo mocno załamuje światło. Światło, które wpadnie do środka, odbija się od fasety do fasety i wychodzi z powrotem górą, w stronę twoich oczu.' },
          { big: '57 faset', small: 'okrągły szlif brylantowy' },
          { p: 'Diament rozszczepia też białe światło na kolory, jak pryzmat. Jubilerzy nazywają te błyski koloru ogniem.' },
          { p: 'Ten kamień jest narysowany tak samo: każdy promień światła śledzi się w jego wnętrzu, odbicie po odbiciu.' },
        ],
        sci: [
          { rows: [
            ['Współczynnik załamania', 'n = 2,42 (szkło ok. 1,5, woda 1,33)'],
            ['Kąt graniczny', '24,4°: w środku światło padające na fasetę pod kątem większym niż ten (od prostopadłej) ulega całkowitemu odbiciu'],
            ['Dyspersja', '0,044 (n dla fioletu 2,45 minus n dla czerwieni 2,41)'],
            ['Szlif', 'okrągły brylantowy: 57 faset (58 z koletem); Marcel Tolkowsky obliczył jego proporcje w 1919 roku'],
          ] },
          { p: 'Fasety pawilonu są nachylone pod kątem ok. 41°, więc światło wpadające przez taflę odbija się całkowicie od jednej strony pawilonu do drugiej i wychodzi przez koronę. Tutaj każdy piksel śledzi swój promień przez prawdziwe fasety, z innym współczynnikiem dla światła czerwonego, zielonego i niebieskiego.' },
        ],
      },
    },
    press: {
      sign: { title: 'Prasa do diamentów', kid: 'Ściśnij i podgrzej grafit, żeby zrobić diament.', sci: 'HPHT: ok. 6 GPa i 1500 °C, z metalicznym katalizatorem.' },
      panel: {
        title: 'Udało ci się zrobić diament!',
        kid: [
          { p: 'Grafit został ściśnięty tak mocno, jak gdyby 25 słoni stanęło na monecie jednocentowej, i podgrzany do 1500 °C. Jego płaskie warstwy przebudowały się w mocną trójwymiarową sieć diamentu.' },
          { big: '6 GPa', small: '60 000 razy więcej niż ciśnienie powietrza' },
          { p: 'Tak dzieje się w przyrodzie około 150 km pod twoimi stopami. Fabryki robią w ten sposób diamenty do wierteł i pił, które tną kamień.' },
        ],
        sci: [
          { rows: [
            ['Ciśnienie', 'ok. 5 do 6 GPa (tutaj 6 GPa)'],
            ['Temperatura', 'ok. 1300 do 1600 °C (tutaj 1500 °C)'],
            ['Katalizator', 'stopione żelazo, nikiel lub kobalt rozpuszcza grafit; diament z niego krystalizuje'],
            ['Pierwszy raz', 'General Electric, 1954: prasa typu belt Tracy’ego Halla'],
            ['Dziś', 'prasy kubiczne i chemiczne osadzanie z fazy gazowej (CVD); większość diamentów przemysłowych jest wytwarzana, a nie wydobywana'],
          ] },
          { p: 'W 1500 °C diament staje się trwałą odmianą węgla powyżej ok. 5,7 GPa (linia równowagi grafit–diament). Diamenty z prasy wychodzą jako małe kryształy kubooktaedryczne, często żółte od atomów azotu w sieci.' },
        ],
      },
    },
    nanotube: {
      label: 'nanorurkę', verb: 'Rozświetl',
      sign: { title: 'Nanorurka', kid: 'Warstwa grafenu zwinięta w rurkę. Przejdź przez nią!', sci: 'Typu armchair (6,6): średnica 0,81 nm, ścianki grubości jednego atomu (Iijima, 1991).' },
      panel: {
        title: 'Nanorurka węglowa',
        kid: [
          { p: 'Zwiń warstwę grafenu w rurkę, a dostaniesz nanorurkę węglową. Przez tę możesz przejść, bo jest 5 miliardów razy większa: prawdziwa jest około 80 000 razy cieńsza od włosa.' },
          { big: '1 atom', small: 'ścianki mają grubość jednego atomu' },
          { p: 'Nanorurki należą do najwytrzymalszych materiałów, jakie kiedykolwiek wytworzono, i przewodzą prąd. Japoński naukowiec Sumio Iijima opisał je w 1991 roku.' },
        ],
        sci: [
          { rows: [
            ['Ta rurka', '(6,6) armchair: średnica 0,81 nm, metaliczna'],
            ['Zwijanie', 'wektor chiralny C = n·a₁ + m·a₂ staje się obwodem'],
            ['Elektrony', 'metaliczna, gdy n − m jest wielokrotnością 3 (wszystkie rurki armchair), w przeciwnym razie półprzewodnikowa'],
            ['Odkrycie', 'Sumio Iijima (NEC), 1991, wielościenne; jednościenne w 1993 roku'],
            ['Wytrzymałość', 'zmierzona wytrzymałość na rozciąganie do ok. 60 GPa (mocna stal: 1 do 2 GPa)'],
          ] },
          { p: 'Niektóre rurki mają centymetry długości i tylko nanometr szerokości. Używa się ich do wzmacniania tworzyw sztucznych, w elektrodach baterii i w badaniach nad malutkimi tranzystorami.' },
        ],
      },
    },
    fullerene: {
      label: 'ściany C60', verb: 'Policz',
      sign: { title: 'Buckminsterfuleren', kid: 'C60: pusta w środku kula z 60 atomów. Jesteś w jej wnętrzu!', sci: '60 atomów, 90 wiązań, 12 pięciokątów, 20 sześciokątów (1985).' },
      panel: {
        title: 'Buckminsterfuleren, C₆₀',
        kid: [
          { p: 'Jesteś wewnątrz cząsteczki C₆₀: 60 atomów węgla tworzy pustą w środku klatkę w kształcie piłki. Jej ściany: 12 pięciokątów i 20 sześciokątów.' },
          { big: 'C₆₀', small: '60 atomów, 90 wiązań' },
          { p: 'Odkryli ją w 1985 roku Harold Kroto, Robert Curl i Richard Smalley, którzy w 1996 roku dostali Nagrodę Nobla z chemii. Nazwali ją na cześć architekta Buckminstera Fullera, słynnego z kopuł właśnie takich jak ta.' },
        ],
        sci: [
          { rows: [
            ['Kształt', 'dwudziestościan ścięty, symetria Ih'],
            ['Liczenie', '60 wierzchołków − 90 krawędzi + 32 ściany = 2 (Euler)'],
            ['Wiązania', '30 między dwoma sześciokątami (6:6), 1,40 Å, o charakterze wiązania podwójnego; 60 między pięciokątem a sześciokątem (5:6), 1,45 Å'],
            ['Rozmiar', '0,71 nm między przeciwległymi jądrami; ta kopuła jest narysowana w skali 1,3 m na angstrem'],
            ['Odkrycie', '1985, Rice University: Kroto, Curl i Smalley, z Heathem i O’Brienem; Nagroda Nobla z chemii 1996'],
          ] },
          { p: 'Każda zamknięta klatka z atomów o trzech wiązaniach, złożona z pięciokątów i sześciokątów, ma dokładnie 12 pięciokątów, bez względu na liczbę sześciokątów. C₆₀ jest najmniejszą, w której żadne dwa pięciokąty się nie stykają (reguła izolowanych pięciokątów), co czyni ją szczególnie trwałą. Podwójne pręciki to wiązania 6:6.' },
        ],
      },
    },
    football: {
      label: 'piłkę', verb: 'Kopnij',
      sign: { title: 'Ten sam wzór', kid: '12 pięciokątów i 20 sześciokątów, jak C60.', sci: 'Dwudziestościan ścięty: 32 łaty, 60 wierzchołków, 90 szwów.' },
      panel: {
        title: 'Ten sam wzór',
        kid: [
          { p: 'Klasyczna piłka nożna jest zszyta z 12 czarnych pięciokątów i 20 białych sześciokątów: to ten sam wzór co C₆₀! Dlatego C₆₀ ma przezwisko buckyball.' },
          { big: '12 + 20', small: 'pięciokąty + sześciokąty, tak jak w C₆₀' },
        ],
        sci: [
          { p: 'Piłka z 32 łat to dwudziestościan ścięty nadmuchany do kształtu kuli: 60 wierzchołków, w których spotykają się trzy łaty, i 90 szwów, jak 60 atomów i 90 wiązań C₆₀. Rozsławił ją Adidas Telstar z mundialu w 1970 roku, czarno-biały, żeby był dobrze widoczny w czarno-białej telewizji.' },
        ],
      },
    },
  },
}

const DE = {
  back: 'Zurück zur Halle: Kohlenstoff',
  kicker: 'Diamant, Graphit und Co.',
  decimal: ',',
  talkTo: 'Sprich mit',
  graphiteWord: 'GRAPHIT',
  wall: 'Ein Element, viele Formen',
  greeting: {
    kid: 'Willkommen in meiner Galerie! Schau nach unten: Du läufst auf Graphen, einer einzigen Schicht meiner Atome. Hier drin bin ich ein Diamant, ein Bleistift, eine Röhre und ein Ball. Probier jedes Exponat aus, um sie alle zu entdecken!',
    sci: 'Allotrope: ein Element, verschiedene Bindungen. sp³ im Diamanten; sp² in Graphit, Graphen, Nanoröhren und Fullerenen. Der Boden ist Graphen im Maßstab 0,5 m pro Ångström. Entlang der linken Wand: Graphen von vier Seiten und die verdrehte Doppelschicht.',
  },
  pentagons: 'Fünfecke',
  hexagons: 'Sechsecke',
  totals: 'Atome · Bindungen',
  pressTitle: 'DIAMANTPRESSE',
  source: 'Source',
  drain: 'Drain',
  gate: 'Gate',
  gateVoltage: 'Gate-Spannung',
  modes: ['einfaches Graphen', 'Doppelschicht im Feld'],
  catLabel: 'Katze: 4 kg',
  press: {
    hints: ['Tippe auf den Graphit auf dem Tablett', 'Tippe auf den roten Hebel, um zu pressen', 'Tippe auf die Kapsel, um sie zu erhitzen', 'Tippe auf den Kolben, um die Presse zu öffnen', 'Tippe auf den Diamanten, um von vorn anzufangen'],
    buttons: ['Graphit einlegen', 'Auf 6 GPa pressen', 'Auf 1500 °C erhitzen', 'Presse öffnen', 'Von vorn anfangen'],
    how: {
      kid: 'Mach einen Diamanten: Leg den Graphit ein, press ihn, erhitze ihn und öffne die Presse. Tippe der Reihe nach auf jedes Ding oder nimm die Knöpfe.',
      sci: 'Hochdruck-Hochtemperatur-Synthese (HPHT): Graphit einlegen, auf etwa 6 GPa pressen, auf etwa 1500 °C erhitzen, dann abkühlen und den Druck ablassen.',
    },
    wait: 'Warte',
    working: 'die Presse arbeitet…',
    say: [
      'Der Graphit ist in der Kapsel. Jetzt pressen!',
      '6 GPa: wie 25 Elefanten auf einer Ein-Cent-Münze. Jetzt erhitzen!',
      '1500 °C! Die flachen Schichten werden zum 3D-Netz des Diamanten. Öffne die Presse!',
    ],
  },
  say: {
    peelFree: 'Eine einzige Schicht, ganz frei: Das ist Graphen! Nimm das Klebeband noch einmal, um sie zurückzulegen.',
    peelBack: 'Zurück auf dem Stapel: Aufeinandergestapelte Graphenschichten sind Graphit.',
    slideBack: 'Wieder gestapelt. Die Schichten liegen nur aufeinander, deshalb gleiten sie leicht.',
    transistor: [
      'Siehst du? Am tiefsten Punkt fließt der Strom immer noch: Einfaches Graphen kann nicht ausschalten. Probier es noch einmal, mit einer Lücke.',
      'Mit zwei Schichten in einem elektrischen Feld gibt es eine Lücke, und der Strom stoppt: AUS!',
    ],
    moire: nm => `Der magische Winkel, 1,1°! Das große Muster ist ${nm} nm breit, 52 Atome. Fast bis zum absoluten Nullpunkt gekühlt, leiten diese zwei Schichten Strom ganz ohne Widerstand.`,
  },
  moireControls: {
    hint: {
      kid: 'Dreh die obere Schicht mit dem Schieberegler: Schau auf ihre Ecken, das Muster und die Tafel. Bei 1,1° werden die zwei goldenen Linien flach: Die Elektronen bleiben fast stehen.',
      sci: 'Verdrehe mit dem Schieberegler; die Tafel zeigt die Bänder entlang K′-K-Γ-M-K′ und die Breite der Mittelbänder abhängig vom Winkel.',
    },
    twist: 'Verdrehung',
    rings: 'Ringgröße (nur die Zeichnung)',
    magic: '✨ Der magische Winkel, 1,1°',
    auto: 'Von selbst drehen lassen',
  },
  board: {
    kid: {
      title: 'Was die Elektronen können', sub: 'jede Linie: eine Bewegungsart der Elektronen', energy: 'Energie',
      speed: 'Wie schnell sich die Elektronen bewegen', speedKid: p => `${p} % ihres Tempos in normalem Graphen`, speedSci: (v, w) => `v*/v = ${v} · Mittelbänder ${w} meV breit`,
      strip: 'Wie flach die mittleren Linien sind (tiefer ist flacher)', magic: 'magisch 1,1°', tooSmall: 'Ab einem halben Grad siehst du die Linien',
    },
    sci: {
      title: 'Bänder nahe dem Fermi-Niveau (meV)', sub: 'Bistritzer-MacDonald-Modell, ein Tal', energy: 'E (meV)',
      speed: 'Dirac-Geschwindigkeit', speedKid: p => `${p} %`, speedSci: (v, w) => `v*/v = ${v} · Mittelbänder ${w} meV breit`,
      strip: 'Mittelband-Breite gegen Verdrehung (meV, log. Skala)', magic: 'magisch 1,1°', tooSmall: 'Unter 0,5° drängen sich die Bänder',
    },
  },
  signLine: {
    moire: (deg, nm) => (deg === 0 ? 'Deckungsgleich: kein Moiré. Dreh die obere Schicht!' : `Drehung ${String(deg).replace('.', ',')}°: Moiré ${nm} nm${deg === 1.1 ? ' (der magische Winkel)' : ''}`),
    readout: (deg, nm) => (deg < 0.05 ? 'Deckungsgleich: kein Muster' : `Gedreht um ${deg.toFixed(deg < 2 ? 2 : 1).replace('.', ',')}°\ndas Muster wiederholt sich alle ${nm} nm`),
  },
  ex: {
    graphene: {
      label: 'das Klebeband', verb: 'Benutze',
      taps: { hints: { peel: 'Tippe auf den Stapel, um die oberste Schicht mit dem Band abzuziehen', back: 'Tippe auf die schwebende Schicht, um sie zurückzulegen', moving: 'Schau auf die Schicht' }, buttons: { peel: 'Eine Schicht abziehen', back: 'Zurücklegen' } },
      sign: { title: 'Graphen', kid: 'Zieh mit Klebeband eine Schicht vom Graphit ab.', sci: 'Eine Schicht Graphit: 2004, Geim und Novoselov (Nobelpreis 2010).' },
      panel: {
        title: 'Graphen',
        kid: [
          { p: 'Graphit ist ein Stapel flacher Schichten. Zieh nur eine Schicht ab, und du hast Graphen: eine einzige Lage Kohlenstoffatome, in Sechsecken verbunden wie eine Bienenwabe. Jedes Atom hält drei Nachbarn fest.' },
          { big: '1 Atom', small: 'dick: das dünnste Material, das es gibt' },
          { p: '2004 zogen Andre Geim und Konstantin Novoselov in Manchester Graphit immer wieder mit Klebeband ab, bis nur noch eine Schicht übrig war. 2010 bekamen sie dafür den Nobelpreis für Physik.' },
          { p: 'Auch der Boden dieser Galerie ist Graphen, 5 Milliarden Mal größer gezeichnet als in Wirklichkeit. Entlang dieser Wand kannst du es erforschen wie ein Physiker, ein Chemiker, ein Ingenieur und ein Materialwissenschaftler.' },
        ],
        sci: [
          { rows: [['Bindung', 'C–C 0,142 nm, sp², 120°'], ['Gitter', 'hexagonal, a = 0,246 nm, zwei Atome pro Zelle'], ['Dicke', 'ein Atom (im Graphit liegen die Schichten 0,335 nm auseinander)'], ['Isoliert', '2004, Andre Geim und Konstantin Novoselov (Manchester), durch mechanische Exfoliation mit Klebeband'], ['Nobelpreis', 'Physik, 2010']] },
          { p: 'Dünne Flocken auf oxidiertem Silicium (300 nm SiO₂) werden durch Interferenz sichtbar, so ließ sich eine einzelne Schicht unter einem gewöhnlichen Lichtmikroskop finden; der Stapel hier löst die oberste Schicht eines AB-gestapelten Kristalls auf dieselbe Weise ab.' },
          { p: 'Maßstab des Bodens: 0,5 m pro Ångström, 5 × 10⁹-fache Lebensgröße.' },
        ],
      },
    },
    physics: {
      label: 'die Energiekegel des Graphens', verb: 'Betrachte',
      sign: { title: 'Graphen · Physik', kid: 'Elektronen rasen hindurch, als wären sie gewichtslos.', sci: 'Dirac-Kegel an den sechs K-Punkten; Elektronen mit etwa 1 000 000 m/s.' },
      panel: {
        title: 'Graphen · Physik',
        kid: [
          { p: 'Im Graphen rasen Elektronen durch die Schicht, als wären sie gewichtslos, mit etwa 1000 km pro Sekunde (1/300 der Lichtgeschwindigkeit).' },
          { p: 'Die Skulptur zeigt die Energien, die ein Elektron im Graphen haben kann: eine blaue Fläche unten und eine orangefarbene oben. Sie berühren sich nur an sechs Punkten, wo jede Fläche ein Kegel ist. Diese Punkte machen Graphen so besonders.' },
          { big: '2,3%', small: 'des Lichts hält eine einzige Schicht auf: Du kannst sie mit bloßem Auge sehen' },
          { p: 'Es leitet auch Wärme extrem gut. Ein kanadischer Physiker, Philip Wallace, hat das alles schon 1947 auf Papier ausgerechnet, mehr als 50 Jahre bevor jemand Graphen herstellte.' },
        ],
        sci: [
          { big: 'E = ±ħv|k|', small: 'nahe den K-Punkten: masselose Dirac-Fermionen mit linearer Dispersion (v, die Fermi-Geschwindigkeit)' },
          { rows: [
            ['Fermi-Geschwindigkeit', 'v ≈ 1 × 10⁶ m/s, etwa 1/300 der Lichtgeschwindigkeit'],
            ['Bandstruktur', 'P. R. Wallace, 1947, Tight-Binding-Modell: E(k) = ±t·|1 + exp(ik·a₁) + exp(ik·a₂)|, t ≈ 2,8 eV'],
            ['Quanten-Hall-Effekt', 'halbzahlig, σxy = ±4(n + ½)e²/h (2005); sogar bei Raumtemperatur beobachtet (2007)'],
            ['Licht', 'eine Schicht absorbiert πα ≈ 2,3% des weißen Lichts (α die Feinstrukturkonstante)'],
            ['Wärme', 'freitragendes Graphen leitet Tausende W/(m·K)'],
          ] },
          { p: 'Die Skulptur ist das π-Band über der hexagonalen Brillouin-Zone: Das Valenzband (blau) ist voll, das Leitungsband (orange) leer, und sie treffen sich nur an den sechs Ecken K und K′, wo die Flächen zu Kegeln werden. Die Linien sind Linien gleicher Energie: Kreise um jeden K-Punkt, weiter außen Dreiecke. Benutze sie: Von den K-Punkten laufen Ringe mit konstanter Steigung aus, das ist die lineare Dispersion.' },
        ],
      },
    },
    chemistry: {
      label: 'die Pi-Orbitale', verb: 'Betrachte',
      sign: { title: 'Graphen · Chemie', kid: 'Drei Hände in der Ebene, ein Elektron, das allen gehört.', sci: 'sp²: drei Sigma-Bindungen im Winkel von 120°, ein Pi-Elektron pro Atom.' },
      panel: {
        title: 'Graphen · Chemie',
        kid: [
          { p: 'Im Graphen hält jedes Kohlenstoffatom drei Nachbarn fest, flach, in gleichen Winkeln von 120°. Sein viertes Elektron teilt es mit der ganzen Schicht, in Wolken über und unter ihr (die blauen und orangefarbenen Formen).' },
          { big: '120°', small: 'zwischen den drei Bindungen jedes Atoms' },
          { p: 'Chemiker verändern es: Gib Sauerstoff dazu, und du bekommst Graphenoxid; häng an jedes Atom ein Wasserstoffatom, und du bekommst Graphan, das keinen Strom mehr leitet.' },
          { p: 'Große Schichten wachsen, wenn man ein Gas mit Kohlenstoff darin (Methan) über sehr heiße Kupferfolie leitet: Die Kohlenstoffatome legen sich zu einer einzigen Schicht zusammen.' },
        ],
        sci: [
          { rows: [
            ['Bindung', 'sp²: drei σ-Bindungen im Winkel von 120°, C–C 0,142 nm; ein pz-Elektron pro Atom in delokalisierten π-Bindungen'],
            ['Graphenoxid', 'oxidierter Graphit (Hummers-Methode, 1958), in Schichten getrennt: Epoxid- und Hydroxylgruppen auf der Fläche, Carboxylgruppen an den Rändern; ein Isolator, der sich wieder reduzieren lässt'],
            ['Graphan', 'jedes Kohlenstoffatom an ein Wasserstoffatom gebunden (sp³); 2009 hergestellt, indem Graphen einem Wasserstoffplasma ausgesetzt wurde; ein Isolator, beim Erhitzen umkehrbar'],
            ['Wachstum', 'chemische Gasphasenabscheidung: Methan auf Kupferfolie bei etwa 1000 °C ergibt große einlagige Schichten (2009); Kohlenstoff löst sich kaum in Kupfer, daher stoppt das Wachstum bei einer Lage'],
          ] },
          { p: 'Das Modell zeigt ein Sechseck des Graphens: die σ-Bindungen in der Ebene und das p-Orbital jedes Atoms, das quer dazu steht, eine Phase oben (blau) und eine unten (orange). Benutze es: Die p-Orbitale verschmelzen zu den π-Wolken, die sich über die ganze Schicht ausbreiten.' },
        ],
      },
    },
    electronics: {
      label: 'den Graphen-Transistor', verb: 'Probier',
      taps: {
        hints: { sweep: 'Tippe auf das Gate, den goldenen Balken in der Mitte, um die Spannung herunter- und hochzudrehen', gap: 'Tippe auf den Chip für zwei Schichten mit einer Lücke', again: 'Tippe noch einmal auf das Gate und schau, ob der Strom jetzt aufhört', plain: 'Tippe auf den Chip für einfaches Graphen', busy: 'Schau auf den Strom im Glasrohr' },
        buttons: { sweep: 'Knopf herunter- und hochdrehen', plain: 'Einfaches Graphen', gap: 'Zwei Schichten im Feld' },
        slider: 'Gate-Spannung',
      },
      sign: { title: 'Graphen · Elektronik', kid: 'Ein sehr schneller Schalter, der nie ganz ausschaltet.', sci: 'Keine Bandlücke: ein Halbmetall. An/Aus-Verhältnis nur etwa 5 bis 10.' },
      panel: {
        title: 'Graphen · Elektronik',
        kid: [
          { p: 'Ein Transistor ist ein winziger Schalter: Ein Computer hat Milliarden davon. Elektronen rasen so schnell durch Graphen, dass sich daraus sehr schnelle Transistoren bauen lassen, aber es gibt ein Problem: Graphen lässt sich nicht ganz ausschalten.' },
          { p: 'Tippe auf das Gate (den goldenen Balken in der Mitte) oder stell seine Spannung selbst ein: Der Strom sinkt, aber selbst am tiefsten Punkt fließt er weiter. Tippe jetzt auf den Chip für zwei Schichten in einem elektrischen Feld und probier es noch einmal: Der Strom stoppt.' },
          { big: 'keine Lücke', small: 'Graphen allein schaltet nie ganz aus' },
          { p: 'Forscher öffnen eine Lücke: zwei Schichten in einem elektrischen Feld oder Graphen, in sehr schmale Bänder geschnitten. Es steckt auch in durchsichtigen Elektroden und in Sensoren, die einzelne Moleküle spüren können.' },
        ],
        sci: [
          { rows: [
            ['Bandlücke', 'keine: ein Halbmetall (Lücke null); am Dirac-Punkt hat der Leitwert ein Minimum, nicht null'],
            ['An/Aus-Verhältnis', 'etwa 5 bis 10 bei Raumtemperatur für einen einfachen Graphen-Transistor; Siliciumlogik braucht etwa 10⁴ bis 10⁷'],
            ['Eine Lücke öffnen', 'zweilagiges Graphen in einem senkrechten elektrischen Feld (bis etwa 0,25 eV, 2009); Nanobänder von wenigen Nanometern Breite'],
            ['Anwendungen', 'Hochfrequenztransistoren (Grenzfrequenzen von Hunderten GHz), transparente leitfähige Schichten, Sensoren, die einzelne Gasmoleküle nachweisen können'],
          ] },
          { p: 'Ambipolare Leitung: Das Gate schiebt das Fermi-Niveau hinauf ins Leitungsband (Elektronen) oder hinab ins Valenzband (Löcher); der Strom ist dort am kleinsten, wo sich die beiden Kegel treffen, am Ladungsneutralitätspunkt.' },
        ],
      },
    },
    materials: {
      label: 'die Graphen-Hängematte', verb: 'Betrachte',
      sign: { title: 'Graphen · Materialien', kid: 'Ein Quadratmeter würde eine Katze tragen und weniger wiegen als ein Schnurrhaar.', sci: 'Festigkeit etwa 130 GPa, E-Modul etwa 1 TPa, 0,77 mg pro Quadratmeter.' },
      panel: {
        title: 'Graphen · Materialien',
        kid: [
          { p: 'Eine Hängematte aus Graphen, einen Quadratmeter groß, könnte diese 4 kg schwere Katze tragen und würde doch nur 0,77 Milligramm wiegen: weniger als eines der Schnurrhaare der Katze!' },
          { big: '0,77 mg', small: 'die Masse von einem Quadratmeter Graphen' },
          { p: 'Es ist eines der festesten Materialien, die je gemessen wurden. Und nicht einmal die kleinsten Gasatome, die des Heliums, kommen durch eine perfekte Schicht.' },
          { p: 'Deshalb wird es in festen, leichten Kunststoffen ausprobiert, in Beschichtungen gegen Rost, in Batterien und in Filtern, die Wasser reinigen.' },
        ],
        sci: [
          { rows: [
            ['Dicke', 'ein Atom (0,335 nm als Schicht im Graphit)'],
            ['Festigkeit', 'intrinsische Festigkeit etwa 130 GPa, Elastizitätsmodul etwa 1 TPa (Lee, Wei, Kysar und Hone, Science 2008, durch Eindrücken einer AFM-Spitze in freitragende Schichten)'],
            ['Flächendichte', '0,77 mg pro Quadratmeter'],
            ['Barriere', 'undurchlässig für Gase, sogar für Helium (2008)'],
            ['Anwendungen', 'Verbundwerkstoffe, Korrosionsschutzschichten, Batterieelektroden und Superkondensatoren, Membranen zum Filtern und Entsalzen von Wasser'],
          ] },
          { p: 'Die Hängematte ist das Beispiel des Nobelkomitees von 2010: Ein Streifen von einem Meter Breite reißt erst bei etwa 42 N, dem Gewicht von etwa 4 kg. Echte Schichten haben Defekte und Korngrenzen, deshalb sind große schwächer als dieses Ideal.' },
        ],
      },
    },
    moire: {
      label: 'die zwei Schichten', verb: 'Verdreh',
      sign: { title: 'Neuland: verdrehtes Graphen', kid: 'Zwei Schichten, eine dreht sich: Sieh zu, wie von selbst ein Riesenmuster entsteht.', sci: 'Verdrehte Doppelschicht: beim magischen Winkel (1,1°) Supraleitung.' },
      panel: {
        title: 'Neuland: verdrehtes Graphen',
        kid: [
          { p: 'Zwei Schichten Graphen übereinander, die obere dreht sich langsam. Auf ihnen ist nichts aufgemalt: Das große Muster entsteht von selbst, wo sich die zwei Waben überlappen, wie bei zwei Gardinen vor einem Fenster. Je kleiner die Drehung, desto größer das Muster.' },
          { big: '1,1°', small: 'der magische Winkel' },
          { p: 'Bei 1,1°, etwa so weit, wie der Minutenzeiger einer Uhr in 11 Sekunden weiterrückt, leiten zwei schlichte Schichten Kohlenstoff, fast bis zum absoluten Nullpunkt gekühlt, Strom ganz ohne Widerstand: Sie sind ein Supraleiter. Ändert man ein wenig, wie viele Elektronen sie enthalten, sperren dieselben Schichten den Strom vollständig. Eine winzige Drehung verändert, was das Material ist!' },
          { p: 'Warum das so wichtig ist: Entdeckt hat es 2018 Yuan Cao, ein junger Student im Labor von Pablo Jarillo-Herrero am MIT. Die Zeitschrift Physics World nannte es den Durchbruch des Jahres; Jarillo-Herrero und die zwei Physiker, die den magischen Winkel vorhergesagt hatten, teilten sich 2020 den Wolf-Preis für Physik; und die Wissenschaft bekam ein neues Wort, Twistronik: Elektronik durch Verdrehen. Heute stapeln und verdrehen Labore auf der ganzen Welt atomdünne Schichten wie ein Kartenspiel, um Materialien herzustellen, die es in der Natur nicht gibt.' },
        ],
        sci: [
          { big: 'θ ≈ 1,1°', small: 'der magische Winkel: flache Bänder, korrelierte Isolatoren, Supraleitung' },
          { rows: [
            ['Moiré-Periode', 'λ = a / (2 sin(θ/2)): etwa 13 nm bei 1,1° (a = 0,246 nm), rund 11 000 Atome in jeder Moiré-Zelle'],
            ['Vorhersage', 'flache Bänder beim magischen Winkel: Rafi Bistritzer und Allan MacDonald, PNAS, 2011'],
            ['Entdeckung', 'Yuan Cao, Pablo Jarillo-Herrero und Kollegen (MIT), zwei Artikel in Nature, 2018: korrelierte isolierende Zustände bei halber Füllung der flachen Bänder und gleich daneben Supraleitung unter etwa 1,7 K'],
            ['Ein neues Wort', 'Twistronik: ein Material über den Winkel zwischen seinen Schichten einstellen (Gruppe von Efthimios Kaxiras, Harvard, 2017)'],
            ['Anerkennung', 'Physics World Breakthrough of the Year 2018; Wolf-Preis für Physik 2020 (Bistritzer, Jarillo-Herrero, MacDonald)'],
            ['Seitdem', 'Magnetismus und Chern-Isolatoren in den flachen Bändern, verdrehte Dreifachschichten, verdrehte Übergangsmetall-Dichalkogenide: der fraktionale anomale Quanten-Hall-Effekt in verdrehtem MoTe₂ (2023), Quasiteilchen mit einem Bruchteil der Elektronenladung, ganz ohne Magnet'],
          ] },
          { p: 'Warum: Nahe dem magischen Winkel werden die Moiré-Bänder fast flach, die kinetische Energie der Elektronen fällt unter ihre gegenseitige Abstoßung, und sie ordnen sich kollektiv, ähnlich wie in den Kupferoxid-Supraleitern, aber in einem einzigen einstellbaren Bauteil: Eine Gate-Spannung legt fest, wie viele Elektronen die Bänder füllen. Proben entstehen durch „Abreißen und Stapeln“ (2016): Die Hälfte einer Graphenflocke wird abgehoben, um den gewünschten Winkel gedreht und auf die andere Hälfte gelegt. Einen einzigen Winkel über ein ganzes Bauteil zu halten (Unordnung des Drehwinkels), ist noch immer der schwierige Teil.' },
          { p: 'Hier sind die Schichten als Folien auf einem Leuchttisch gezeichnet, mit a = 2,7 cm, daher ist das Moiré bei 1,1° etwa 1,4 m breit. Nichts markiert das Moiré: Es entsteht aus der Überlagerung, heller, wo Atome auf Atomen sitzen (AA), dunkler, wo sie ineinandergreifen (AB).' },
        ],
      },
    },
    graphite: {
      label: 'die Graphitschichten', verb: 'Verschieb',
      taps: { hints: { slide: 'Tippe auf die Schichten, um sie zu verschieben', back: 'Tippe auf die Schichten, um sie wieder zu stapeln' }, buttons: { slide: 'Schichten verschieben', back: 'Stapeln' } },
      sign: { title: 'Graphit', kid: 'Schichten aus Sechsecken, die übereinander gleiten.', sci: 'AB-Stapelung, Schichtabstand 3,35 Å; C–C 1,42 Å in jeder Schicht.' },
      panel: {
        title: 'Graphit',
        kid: [
          { p: 'Graphit ist gestapeltes Graphen: flache Schichten aus Sechsecken, eine über der anderen. Innerhalb einer Schicht halten sich die Atome fest, aber die Schichten haften nur schwach aneinander, deshalb gleiten sie.' },
          { big: '3 Hände', small: 'jedes Atom hält drei Nachbarn in seiner Schicht' },
          { p: 'Deshalb ist Graphit weich und rutschig: Es steckt in Bleistiften und dient als Trockenschmiermittel für Schlösser.' },
          { p: 'Elektronen können sich entlang der Schichten bewegen, deshalb leitet Graphit Strom: Es steckt in Batterien und in Elektromotoren.' },
        ],
        sci: [
          { rows: [
            ['Stapelung', 'ABAB (Bernal): Jede zweite Schicht ist um eine Bindung verschoben, so liegt die Hälfte ihrer Atome über Atomen und die Hälfte über Sechseckmitten'],
            ['Schichtabstand', '3,35 Å, gehalten von Van-der-Waals-Kräften'],
            ['Bindung in der Schicht', 'C–C 1,42 Å, sp²'],
            ['Dichte', '2,27 g/cm³'],
            ['Leitfähigkeit', 'metallisch entlang der Schichten; quer dazu tausende Male geringer'],
            ['Name', 'vom griechischen graphein, schreiben (A. G. Werner, 1789)'],
          ] },
          { p: 'Bei alltäglichem Druck und alltäglicher Temperatur ist Graphit, nicht Diamant, die stabilste Form des Kohlenstoffs. Die vierten Elektronen sind in π-Bändern über jede ganze Schicht delokalisiert, deshalb leitet Graphit entlang seiner Schichten und hat einen grauen Glanz.' },
        ],
      },
    },
    pencil: {
      label: 'dem Riesenbleistift', verb: 'Schreib mit',
      sign: { title: 'Der Bleistift', kid: 'Beim Schreiben bleiben dünne Graphitschichten auf dem Papier.', sci: 'Graphit und Ton, gebrannt: überhaupt kein Blei.' },
      panel: {
        title: 'Der Bleistift',
        kid: [
          { p: 'Wenn du schreibst, schabt das Papier winzige Flocken von der Spitze: Graphitschichten, die abgleiten. Deine Linie besteht aus dünnen Schichten Kohlenstoff!' },
          { p: 'Ein Bleistift enthält gar kein Blei: Seine Mine ist Graphit, mit Ton gemischt. Mehr Ton ergibt eine härtere, hellere Linie (H); mehr Graphit eine weichere, dunklere (B).' },
          { big: 'Graphit', small: 'vom griechischen graphein: schreiben' },
        ],
        sci: [
          { rows: [
            ['Mine', 'Graphitpulver und Ton, gemischt, gepresst und gebrannt'],
            ['Härtegrade', 'von 9H (hart, hell) bis 9B (weich, schwarz); HB in der Mitte'],
            ['Strich', 'Graphitflocken von wenigen Nanometern bis Mikrometern Dicke, in den Papierfasern festgehalten'],
          ] },
          { p: 'Im 16. Jahrhundert fand man in Borrowdale in England ein großes Vorkommen ungewöhnlich reinen Graphits. Man hielt ihn für eine Art Blei (Plumbago), und der Name blieb. Carl Scheele zeigte 1779, dass Graphit Kohlenstoff ist.' },
        ],
      },
    },
    diamond: {
      label: 'das Diamantgitter', verb: 'Betrachte',
      sign: { title: 'Diamant', kid: 'Jedes Atom hält vier andere, in 3D. Das härteste natürliche Material.', sci: 'Kubisch, a = 3,567 Å; C–C 1,545 Å bei 109,5°; sp³.' },
      panel: {
        title: 'Diamant',
        kid: [
          { p: 'Im Diamanten hält jedes Kohlenstoffatom vier andere fest, die zu den Ecken einer Pyramide mit dreieckiger Grundfläche zeigen (einem Tetraeder). Alle Atome sind in einem einzigen festen Netz verankert, das in alle Richtungen reicht.' },
          { big: '10', small: 'auf der Mohs-Skala: das härteste natürliche Material' },
          { p: 'Diamant leitet Wärme besser als jedes andere natürliche Material, etwa fünfmal besser als Kupfer. Deshalb fühlt sich ein Diamant kalt an, wenn du ihn berührst.' },
          { p: 'Natürliche Diamanten sind etwa 150 km tief im Inneren der Erde gewachsen, gepresst und erhitzt, und wurden von Vulkanausbrüchen nach oben getragen.' },
        ],
        sci: [
          { rows: [
            ['Struktur', 'Diamantstruktur: zwei kubisch-flächenzentrierte Gitter, eines um ein Viertel der Würfeldiagonale verschoben'],
            ['Zelle', 'a = 3,567 Å, 8 Atome'],
            ['Bindung', 'C–C 1,545 Å, sp³, 109,47°'],
            ['Dichte', '3,51 g/cm³ (Graphit 2,27)'],
            ['Härte', 'Mohs 10'],
            ['Wärmeleitfähigkeit', 'etwa 2000 bis 2200 W/(m·K); Kupfer etwa 400'],
            ['Bandlücke', '5,5 eV: ein elektrischer Isolator'],
          ] },
          { p: 'Bei Normaldruck ist Diamant metastabil: Graphit ist etwas stabiler, aber die Umwandlung müsste jede Bindung brechen, deshalb geschieht sie bei Raumtemperatur nie. Natürliche Diamanten entstanden in 140 bis 200 km Tiefe (etwa 4,5 bis 6 GPa, 900 bis 1300 °C) und gelangten in Kimberlit-Ausbrüchen an die Oberfläche.' },
        ],
      },
    },
    brilliant: {
      label: 'den Brillanten', verb: 'Betrachte',
      sign: { title: 'Der Brillant', kid: 'Licht springt darin hin und her und zerfällt in Farben.', sci: 'n = 2,42, Grenzwinkel 24,4°, Dispersion 0,044; 57 Facetten.' },
      panel: {
        title: 'Der Brillant',
        kid: [
          { p: 'Ein geschliffener Diamant funkelt, weil er Licht sehr stark bricht. Licht, das hineinkommt, springt drinnen von Facette zu Facette und kommt oben wieder heraus, auf deine Augen zu.' },
          { big: '57 Facetten', small: 'der runde Brillantschliff' },
          { p: 'Diamant zerlegt weißes Licht auch in seine Farben, wie ein Prisma. Juweliere nennen diese Farbblitze Feuer.' },
          { p: 'Dieser Stein ist genauso gezeichnet: Jeder Lichtstrahl wird in seinem Inneren verfolgt, Spiegelung für Spiegelung.' },
        ],
        sci: [
          { rows: [
            ['Brechungsindex', 'n = 2,42 (Glas etwa 1,5, Wasser 1,33)'],
            ['Grenzwinkel', '24,4°: Licht, das innen unter mehr als diesem Winkel zum Lot auf eine Facette trifft, wird total reflektiert'],
            ['Dispersion', '0,044 (n für Violett 2,45 minus n für Rot 2,41)'],
            ['Schliff', 'runder Brillant: 57 Facetten (58 mit Kalette); Marcel Tolkowsky berechnete seine Proportionen 1919'],
          ] },
          { p: 'Die Pavillonfacetten sind um etwa 41° geneigt, so wird Licht, das durch die Tafel eintritt, von einer Seite des Pavillons zur anderen total reflektiert und verlässt den Stein durch die Krone. Hier verfolgt jedes Pixel seinen Strahl durch die echten Facetten, mit einem anderen Index für rotes, grünes und blaues Licht.' },
        ],
      },
    },
    press: {
      sign: { title: 'Die Diamantpresse', kid: 'Press und erhitze Graphit, um einen Diamanten zu machen.', sci: 'HPHT: etwa 6 GPa und 1500 °C, mit einem Metallkatalysator.' },
      panel: {
        title: 'Du hast einen Diamanten gemacht!',
        kid: [
          { p: 'Du hast Graphit so fest gepresst wie 25 Elefanten auf einer Ein-Cent-Münze und auf 1500 °C erhitzt. Seine flachen Schichten haben sich zum festen 3D-Netz des Diamanten umgeordnet.' },
          { big: '6 GPa', small: 'das 60 000-Fache des Luftdrucks' },
          { p: 'Genau das passiert in der Natur etwa 150 km unter deinen Füßen. Fabriken stellen so Diamanten für Bohrer und Sägen her, die Stein schneiden.' },
        ],
        sci: [
          { rows: [
            ['Druck', 'etwa 5 bis 6 GPa (hier 6 GPa)'],
            ['Temperatur', 'etwa 1300 bis 1600 °C (hier 1500 °C)'],
            ['Katalysator', 'geschmolzenes Eisen, Nickel oder Cobalt löst den Graphit; der Diamant kristallisiert daraus'],
            ['Zum ersten Mal', 'General Electric, 1954: die Belt-Presse von Tracy Hall'],
            ['Heute', 'kubische Pressen und chemische Gasphasenabscheidung (CVD); der meiste Industriediamant wird hergestellt, nicht abgebaut'],
          ] },
          { p: 'Bei 1500 °C wird Diamant oberhalb von etwa 5,7 GPa zur stabilen Form des Kohlenstoffs (die Gleichgewichtslinie Graphit–Diamant). In der Presse gewachsene Diamanten kommen als kleine kuboktaedrische Kristalle heraus, oft gelb durch Stickstoffatome im Gitter.' },
        ],
      },
    },
    nanotube: {
      label: 'die Nanoröhre', verb: 'Bring zum Leuchten',
      sign: { title: 'Nanoröhre', kid: 'Eine Graphenschicht, zu einer Röhre gerollt. Geh hindurch!', sci: 'Armchair (6,6): 0,81 nm Durchmesser, Wände ein Atom dick (Iijima, 1991).' },
      panel: {
        title: 'Kohlenstoffnanoröhre',
        kid: [
          { p: 'Roll eine Graphenschicht zu einer Röhre, und du hast eine Kohlenstoffnanoröhre. Durch diese hier kannst du gehen, sie ist 5 Milliarden Mal vergrößert: Eine echte ist etwa 80 000-mal dünner als ein Haar.' },
          { big: '1 Atom', small: 'die Wände sind ein Atom dick' },
          { p: 'Nanoröhren gehören zu den festesten Materialien, die je hergestellt wurden, und sie leiten Strom. Der japanische Forscher Sumio Iijima beschrieb sie 1991.' },
        ],
        sci: [
          { rows: [
            ['Diese Röhre', '(6,6) Armchair: 0,81 nm Durchmesser, metallisch'],
            ['Aufrollen', 'der chirale Vektor C = n·a₁ + m·a₂ wird zum Umfang'],
            ['Elektronen', 'metallisch, wenn n − m ein Vielfaches von 3 ist (alle Armchair-Röhren), sonst halbleitend'],
            ['Entdeckung', 'Sumio Iijima (NEC), 1991, mehrwandig; einwandige Röhren 1993'],
            ['Festigkeit', 'Zugfestigkeit gemessen bis etwa 60 GPa (fester Stahl: 1 bis 2 GPa)'],
          ] },
          { p: 'Manche Röhren sind Zentimeter lang und nur einen Nanometer breit. Sie verstärken Kunststoffe, stecken in Batterieelektroden und werden für winzige Transistoren erforscht.' },
        ],
      },
    },
    fullerene: {
      label: 'die Flächen von C60', verb: 'Zähl',
      sign: { title: 'Buckminsterfulleren', kid: 'C60: ein hohler Ball aus 60 Atomen. Du bist in einem drin!', sci: '60 Atome, 90 Bindungen, 12 Fünfecke, 20 Sechsecke (1985).' },
      panel: {
        title: 'Buckminsterfulleren, C₆₀',
        kid: [
          { p: 'Du bist in einem C₆₀-Molekül: 60 Kohlenstoffatome bilden einen hohlen Käfig in Form eines Balls. Seine Flächen: 12 Fünfecke und 20 Sechsecke.' },
          { big: 'C₆₀', small: '60 Atome, 90 Bindungen' },
          { p: 'Entdeckt wurde es 1985 von Harold Kroto, Robert Curl und Richard Smalley, die 1996 den Nobelpreis für Chemie bekamen. Sie benannten es nach dem Architekten Buckminster Fuller, berühmt für genau solche Kuppeln.' },
        ],
        sci: [
          { rows: [
            ['Form', 'Ikosaederstumpf, Symmetrie Ih'],
            ['Zählung', '60 Ecken − 90 Kanten + 32 Flächen = 2 (Euler)'],
            ['Bindungen', '30 zwischen zwei Sechsecken (6:6), 1,40 Å, mit Doppelbindungscharakter; 60 zwischen einem Fünfeck und einem Sechseck (5:6), 1,45 Å'],
            ['Größe', '0,71 nm zwischen gegenüberliegenden Kernen; diese Kuppel ist mit 1,3 m pro Ångström gezeichnet'],
            ['Entdeckung', '1985, Rice University: Kroto, Curl und Smalley, mit Heath und O’Brien; Nobelpreis für Chemie 1996'],
          ] },
          { p: 'Jeder geschlossene Käfig aus Atomen mit drei Bindungen, der aus Fünf- und Sechsecken besteht, hat genau 12 Fünfecke, egal wie viele Sechsecke. C₆₀ ist der kleinste, in dem sich keine zwei Fünfecke berühren (die Regel der isolierten Fünfecke), was ihn besonders stabil macht. Die Doppelstäbe hier sind die 6:6-Bindungen.' },
        ],
      },
    },
    football: {
      label: 'den Fußball', verb: 'Schieß',
      sign: { title: 'Dasselbe Muster', kid: '12 Fünfecke und 20 Sechsecke, wie C60.', sci: 'Ein Ikosaederstumpf: 32 Felder, 60 Ecken, 90 Nähte.' },
      panel: {
        title: 'Dasselbe Muster',
        kid: [
          { p: 'Ein klassischer Fußball ist aus 12 schwarzen Fünfecken und 20 weißen Sechsecken genäht: dasselbe Muster wie C₆₀! Deshalb hat C₆₀ den Spitznamen Buckyball.' },
          { big: '12 + 20', small: 'Fünfecke + Sechsecke, genau wie bei C₆₀' },
        ],
        sci: [
          { p: 'Der Ball aus 32 Feldern ist ein zur Kugel aufgeblasener Ikosaederstumpf: 60 Ecken, an denen drei Felder zusammentreffen, und 90 Nähte, wie die 60 Atome und 90 Bindungen von C₆₀. Berühmt wurde er mit dem Adidas Telstar der Weltmeisterschaft 1970, schwarz-weiß, damit er im Schwarz-Weiß-Fernsehen gut zu sehen war.' },
        ],
      },
    },
  },
}

export const WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
export const wordsFor = lang => WORDS[lang] ?? EN
