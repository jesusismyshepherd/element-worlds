// Every word of the neon sign workshop, in English and European Portuguese (AO90), at the two depths
// (kid: Explorer, sci: Scientist). {placeholders} are filled when used: {gas} a gas's name, {Gas} the
// same with a capital, and numbers from src/data/elements.json or nobleData.js. Texts drawn in 3D (the
// screens' lines) keep to Latin letters: no Greek, no superscripts (the HUD's panels may have them).
// Facts: NIST Atomic Spectra Database (wavelengths, levels); Wikipedia "Neon sign" and "Neon lighting"
// (Claude's two 12 m tubes at the Paris Motor Show, 3 to 18 December 1910; fill pressures 3 to 20 torr);
// Rutherford and Royds, Phil. Mag. 17, 281 (1909) (after 2 days the helium yellow faintly visible, after 6
// days all the stronger lines); the 1960 metre: 1 650 763.73 wavelengths of krypton-86 (CGPM, until
// 1983); WHO: radon the second cause of lung cancer after smoking; INSA: radon in Portugal's granite
// regions (Guarda).

export const SIGNS_WORDS = {
  en: {
    back: "Back to {gas}'s hall",
    kicker: 'The neon sign workshop',
    talkTo: 'Talk to',
    open: 'OPEN',
    busy: { kid: 'Wait a moment: it is still working!', sci: 'One moment: the last run is still going.' },
    greet: {
      kid: 'Welcome to the neon sign workshop! Here we fill glass tubes with gases like me and make them glow. Light the tubes, write your name in neon and split the light with the prism.',
      sci: 'The neon sign workshop: glow discharges in the noble gases. Fill and light the tubes, write your name in any of them, and take their light apart in the spectroscope.',
    },
    greetGas: {
      He: {
        kid: 'Welcome to the neon sign workshop, in my room! I am helium; my name comes from the Greek word for the Sun, because I was found in the Sun before anyone found me on Earth. In a glass tube I glow a soft peach pink. Light the tubes and write your name in me on the wall!',
        sci: 'Helium’s room of the sign workshop. A helium discharge glows peach pink; its most visible line is the yellow one at 587.6 nm, the line that revealed helium in the Sun’s spectrum in 1868. Fill and light the tubes, write your name in any gas, and split their light in the spectroscope.',
      },
      Ne: {
        kid: 'Welcome to my workshop: neon signs are named after me! My name comes from the Greek word for “new”. Lit up, I glow the famous red-orange of shop signs. Light the tubes and write your name in me on the wall!',
        sci: 'Neon’s room: the gas that gave the signs their name. Its red-orange glow is a crowd of lines from yellow-orange to deep red; Georges Claude showed the first neon lights in Paris in 1910. Fill and light the tubes, write your name in any gas, and split their light in the spectroscope.',
      },
      Ar: {
        kid: 'Welcome to my room of the workshop! I am argon; my name comes from the Greek word for “lazy”, because I hardly ever react. Old light bulbs were filled with me. In a tube I glow pale lavender, and with a drop of mercury I make the blue signs.',
        sci: 'Argon’s room. Argon is 0.93 % of the air, the commonest noble gas here; a pure argon discharge glows lavender to violet, and argon with a drop of mercury and a coating on the glass makes most “neon” signs that are not red. Fill and light the tubes, write your name in any gas, and split their light in the spectroscope.',
      },
      Kr: {
        kid: 'Welcome to my room! I am krypton; my name comes from the Greek word for “hidden”, because there is so little of me in the air. Lit up, I glow almost white, with a hint of lilac. Light the tubes and write your name in me on the wall!',
        sci: 'Krypton’s room. About one part per million of the air. A krypton discharge looks whitish lilac, from strong lines across the spectrum (green at 557 nm, yellow at 587 nm); from 1960 to 1983 the metre was defined by an orange line of krypton-86 (605.8 nm). Fill and light the tubes, write your name in any gas, and split their light in the spectroscope.',
      },
      Xe: {
        kid: 'Welcome to my room! I am xenon; my name comes from the Greek word for “stranger”. I glow blue-violet, I light some car headlights, and some spacecraft fly with engines that push my atoms out behind them!',
        sci: 'Xenon’s room: the rarest stable noble gas in the air, about 0.09 parts per million. A xenon discharge glows blue to violet; xenon arc lamps give cinema projectors their daylight-like light, and ion engines such as those of NASA’s Dawn probe ran on xenon. Fill and light the tubes, write your name in any gas, and split their light in the spectroscope.',
      },
    },
    greetRadon: {
      kid: "Welcome to the neon sign workshop! The other gases glow in the signs, but not me: I am locked in the lead box at the end of the bench. Come and see why.",
      sci: 'The neon sign workshop. Radon is the one noble gas that never goes into a sign: its box is at the end of the filling bench, behind lead glass.',
    },
    talk: {
      kid: [
        'Every noble gas glows its own colour: neon red-orange, argon lavender, krypton white, xenon blue, helium peach pink.',
        "Many 'neon' signs that are not red have no neon in them at all: argon, a drop of mercury and a coating on the glass.",
        'Helium was found in the Sun 27 years before anyone found it on Earth!',
        'The noble gases have full outer shells, so they never hold hands with other atoms. Look at me: no hands!',
        'Sign makers bend each letter by hand, softening the glass tube in a flame.',
      ],
      sci: [
        'A glow discharge: free electrons, accelerated by the field, collide with atoms and excite them; each atom falls back by giving out photons of exact energies, its own lines.',
        'Sign tubes hold their gas at about 3 to 20 torr (0.4 to 3 kPa) and light at several thousand volts.',
        "Krypton-86's orange line defined the metre from 1960 to 1983: 1 650 763.73 wavelengths in vacuum.",
        'In 1962 Neil Bartlett made the first compound of a noble gas, a xenon hexafluoroplatinate: noble, but not completely inert.',
        'Before it is filled, a sign tube is pumped down and bombarded: heated by a strong current to drive out impurities that would spoil the colour.',
      ],
    },
    colours: { violet: 'violet', blue: 'blue', cyan: 'blue-green', green: 'green', yellow: 'yellow', orange: 'orange', red: 'red' },

    bench: {
      title: 'The filling bench',
      screen: { kid: 'Pump the air out, let a gas in, switch on the high voltage.', sci: 'Vacuum, then a few millibar of gas, then thousands of volts: a glow discharge.' },
      verbs: { fill: 'Fill with', off: 'Switch off', wait: 'Wait' },
      labels: { all: 'all the tubes', working: 'the tube is filling' },
      hv: 'HIGH VOLTAGE',
      air: 'air',
      says: {
        He: { kid: 'Helium glows a soft peach pink.', sci: 'Helium: yellow 587.6 nm, red 667.8 nm and violet 447.1 nm lines together look peach pink.' },
        Ne: { kid: 'Neon: the famous red-orange of the signs!', sci: 'Neon: dozens of red and orange lines between 585 and 750 nm.' },
        Ar: { kid: 'Argon glows lavender, a soft violet.', sci: 'Argon: red lines near 700 nm and violet ones near 420 nm mix into lavender.' },
        Kr: { kid: 'Krypton glows a silvery white.', sci: 'Krypton: yellow 587.1 nm, green 557.0 nm and a group of violet lines look almost white.' },
        Xe: { kid: 'Xenon glows blue.', sci: 'Xenon: its strongest visible lines are blue, from 473 to 492 nm.' },
        all: { kid: 'All five are lit: a rainbow of noble gases!', sci: 'All five lit: the same tube and voltage, five different sets of energy levels, five colours.' },
        off: { kid: 'All off. Want to light them again?', sci: 'Off: with no field, nothing excites the atoms, and the glow stops at once.' },
      },
      panel: {
        kid: [
          { p: 'Sign makers do it like this: first a pump sucks all the air out of the glass tube. Then a little noble gas goes in, much less than the air that was there. Then they switch on a very high voltage.' },
          { p: 'The electricity rushes through the gas, bumps into its atoms and makes them shine. Every noble gas shines its own colour, always the same one.' },
          { list: ['Helium: peach pink', 'Neon: red-orange', 'Argon: lavender', 'Krypton: silvery white', 'Xenon: blue'] },
          { p: 'One gas is missing: radon. It is locked in the lead box at the end of the bench. Go and see why!' },
        ],
        sci: [
          { p: 'The tube is pumped down to a vacuum, bombarded (heated by a strong current to drive out impurities), filled with a noble gas at about 3 to 20 torr (0.4 to 3 kPa, a few hundredths of an atmosphere) and sealed.' },
          { p: "Thousands of volts across the electrodes start a glow discharge. At low pressure an electron flies far enough between collisions to gather the energy that excites an atom; at atmospheric pressure the same tube would need a far higher voltage to strike (Paschen's law)." },
          { p: 'Each excited atom falls back by emitting photons with the energies between its own levels, so each gas has its own colour.' },
          { rows: [['He', 'peach pink: 587.6, 667.8, 447.1 nm'], ['Ne', 'red-orange: many lines, 585 to 750 nm'], ['Ar', 'lavender: 696.5, 706.7 nm and 415.9, 420.1 nm'], ['Kr', 'whitish: 587.1, 557.0 nm and violet lines'], ['Xe', 'blue: 473.4 to 492.3 nm']] },
        ],
      },
    },

    radon: {
      title: 'Radon, behind lead glass',
      label: 'the radon box',
      verb: 'Measure',
      screen: { kid: 'Never in a sign: it is radioactive.', sci: 'Radon-222, half-life {half} days. Its lines were measured in sealed tubes (NIST).' },
      sign: 'RADIOACTIVE',
      lines: "Radon's lines",
      says: {
        kid: "Click, click, click! You can't see radon, but the counter hears its atoms breaking apart.",
        sci: 'Each click is a decay: radon-222 gives out alpha particles; its short-lived daughters add beta and gamma rays.',
      },
      rows: { isotope: 'Isotope', half: 'Half-life', decay: 'Decay', density: 'Density' },
      values: { isotope: 'radon-222', half: '{half} days', decay: 'alpha, to polonium-218', density: '{density} g/L at 0 °C, the densest gas' },
      panel: {
        kid: [
          { p: 'Radon is a noble gas too, but it never goes into a sign. It is radioactive: its atoms break apart by themselves and shoot out tiny particles. Half of any radon is gone in less than four days.' },
          { p: 'Breathing it in is dangerous: after smoking, it is one of the main causes of lung cancer. It seeps out of granite, and in parts of northern and central Portugal it can gather in cellars, so people air their houses.' },
          { p: "That's why it stays here, behind thick lead glass, where the counter can still hear it." },
        ],
        sci: [
          { p: 'Never in a sign: its radon would be half gone in {half} days, the decay products (polonium, lead, bismuth) would coat the glass, and a broken tube would release a lung hazard. The WHO ranks radon as the second cause of lung cancer after smoking; in Portugal it is highest over the granites of the north and centre, such as Guarda.' },
          { p: 'Each alpha particle is a helium nucleus. Rutherford and Royds proved it in 1909 with a spectroscope: radon sealed in a glass tube with walls under 1/100 mm thick let its alphas through into an outer tube; after 2 days the yellow line of helium was faintly visible, after 6 days all its stronger lines.' },
        ],
      },
    },

    name: {
      title: 'Your name in neon',
      label: 'your name in neon',
      verb: 'Write',
      screen: { kid: 'Type a word and light it in any gas.', sci: 'Your word, bent in tubing and lit in any gas.' },
      overlay: {
        title: 'Write your name in neon',
        placeholder: 'Your name',
        gas: 'Gas',
        light: 'Light it!',
        close: 'Close',
        radon: 'Radon stays out: it is radioactive.',
      },
      says: { kid: '{word} in {gas}: beautiful!', sci: '{word}: {metres} m of tubing, lit in {gas}.' },
      panel: {
        kid: [
          { p: 'Real neon letters are glass tubes bent by hand. The sign maker softens the tube over a flame and bends it, letter by letter, following a drawing on the table, while blowing gently into the tube so it does not squash at the bends.' },
          { p: 'Then the tube is emptied, filled with a gas and sealed, with a metal electrode at each end for the electricity. Change the gas and the colour changes: try your name in all five!' },
        ],
        sci: [
          { p: 'Sign tubing is bent over a wide flame (a ribbon burner) on a full-size pattern, while the bender blows through a hose to keep the bore round; electrodes are sealed onto both ends, and the parts of the tube between letters are painted black.' },
          { p: 'The transformer gives the high voltage that starts the discharge and then limits the current; the glow fills the tube from one electrode to the other, so every letter lights along its whole length.' },
          { p: 'The colour depends only on the gas (and any coating or coloured glass), not on the shape: the same atoms give the same lines in any tube.' },
        ],
      },
    },

    spectrum: {
      title: 'The spectroscope',
      lines: 'lines',
      label: 'the spectroscope',
      verb: 'Try {gas}',
      screen: { kid: 'A prism splits the light into its colours.', sci: 'Emission lines in air, NIST Atomic Spectra Database.' },
      sun: 'The Sun, 1868',
      match: "It's helium!",
      footer: { kid: 'Every gas has its own lines: a fingerprint of light.', sci: 'Observed wavelengths in air (nm), NIST Atomic Spectra Database.' },
      says: {
        He: { kid: "Helium's yellow line is exactly under the Sun's mystery line: that is how helium was found in the Sun in 1868!", sci: "He I 587.6 nm lies exactly under the D3 line of the 1868 prominences; sodium's D lines are at 589.0 and 589.6 nm." },
        Ne: { kid: "Neon: a crowd of red and orange lines. Nothing under the Sun's yellow line.", sci: "Ne I: dozens of lines from 585 to 750 nm; NIST's strongest at 692.9 and 703.2 nm." },
        Ar: { kid: 'Argon: red lines on one side, violet on the other. Together they look lavender.', sci: 'Ar I: 696.5, 706.7 and 738.4 nm in the red, 415.9 and 420.1 nm in the violet.' },
        Kr: { kid: 'Krypton: a bright yellow line, a bright green one and a group of violet ones.', sci: 'Kr I: 587.1 and 557.0 nm, and a violet group from 427 to 450 nm. Close to D3, but not on it.' },
        Xe: { kid: 'Xenon: a family of blue lines.', sci: 'Xe I: 473.4, 480.7, 491.7 and 492.3 nm in the blue, and red lines near 700 nm.' },
      },
      panel: {
        kid: [
          { p: 'The prism splits the light of the tube into its colours. Sunlight would make a smooth rainbow; a noble gas gives only a few bright lines, always in the same places. Every element has its own pattern of lines, like a fingerprint.' },
          { p: 'In 1868, during an eclipse, astronomers looked at the edge of the Sun this way and saw a yellow line that matched nothing on Earth. They named the new element helium, after Helios, the Sun. Helium was only found on Earth in 1895.' },
          { p: "Try the tubes one by one: which gas makes the Sun's yellow line?" },
        ],
        sci: [
          { p: 'In the discharge, electrons lift atoms to excited levels; an atom falling to a lower level emits a photon with exactly the energy difference, E = hc/λ. Every element has its own levels, so its own wavelengths.' },
          { p: "18 August 1868: Pierre Janssen, at Guntur in India, saw a bright yellow line in the spectrum of the solar prominences during the eclipse; Norman Lockyer saw it in England that October without an eclipse. It lay at 587.6 nm, beside sodium's D lines (589.0 and 589.6 nm), and was called D3; Lockyer and Edward Frankland named the element. William Ramsay found helium on Earth in 1895, in the uranium mineral cleveite." },
          { p: "Krypton-86's orange line (605.78 nm in vacuum) defined the metre from 1960 to 1983." },
          { p: 'Lines: observed wavelengths in air from the NIST Atomic Spectra Database.' },
        ],
      },
    },

    atom: {
      title: 'Why they glow',
      label: 'the {gas} atom',
      verb: 'Fire an electron',
      screen: { kid: 'A full outer shell: nothing to hold on to. A bump makes light.', sci: 'A closed shell. Collisions excite it, and it gives the energy back as light: E = hc / wavelength.' },
      ladder: { title: 'Energy steps', ground: 'ground state', ion: 'ionisation', photon: 'photon' },
      says: {
        kid: 'Bump! An electron jumped up a step, fell back and gave out a flash of {colour} light.',
        sci: '{Gas}: falling from {hi} eV to {lo} eV gives a photon of {photon} eV, λ = {nm} nm.',
      },
      ionTitle: 'First ionisation energy',
      line: '{Gas}, line {nm} nm: upper level {hi} eV, lower level {lo} eV above the ground state; the photon carries {photon} eV = hc/λ. Levels from the NIST Atomic Spectra Database.',
      panel: {
        kid: [
          { p: "Look at the atom's outer ring: it is full. Two electrons for helium, eight for the others. A full outer ring is very stable, so these atoms don't need to share or swap electrons with anyone. That is why their Atomlings have no hands!" },
          { p: "Because they almost never join other atoms, people called them 'noble', like gold, which does not rust." },
          { p: 'But electricity can bump an electron up to a higher step. It soon jumps back down and gives out the extra energy as a flash of light. Each step down has its own colour, and billions of flashes every second make the glow of the tube.' },
        ],
        sci: [
          { p: 'Closed shells: 1s² for helium, ns² np⁶ for the rest. They have the highest first ionisation energies of their periods and no free places in the octet, so they form no ordinary bonds. In 1962 Neil Bartlett made the first noble-gas compound, xenon hexafluoroplatinate; fluorides of xenon and krypton followed. The German chemist Hugo Erdmann named them Edelgase, noble gases, after the noble metals.' },
        ],
      },
    },

    history: {
      title: 'Signs through time',
      label: 'a short history',
      verbs: { next: 'Light {year}', off: 'Switch off' },
      today: 'TODAY',
      screen: { kid: '1898, 1910, today: light them in order.', sci: 'From liquid air (1898) to the lights of the city.' },
      captions: { 1898: 'London: krypton, neon, xenon', 1910: 'Paris: the first neon lights', today: 'argon, mercury and a coating' },
      steps: {
        1898: {
          kid: '1898, London: Ramsay and Travers cooled air until it turned liquid, let it boil off slowly and found three new gases in a few weeks: krypton, neon and xenon.',
          sci: 'May to July 1898: the fractional distillation of liquid air gives Ramsay and Travers krypton (hidden), neon (new) and xenon (stranger).',
        },
        1910: {
          kid: '1910, Paris: Georges Claude lit two tubes of neon, 12 metres long, at the motor show. The first neon lights!',
          sci: '3 to 18 December 1910: Georges Claude shows two 12 m tubes of neon at the Paris Motor Show, in the Grand Palais; his first sign was sold in 1912, to a barber.',
        },
        today: {
          kid: "Today many 'neon' signs have no neon at all! They hold argon and a drop of mercury, and a powder inside the glass turns their invisible light into blue, green, white or pink.",
          sci: "Today: argon with a little mercury. The mercury's 253.7 nm ultraviolet makes a fluorescent coating on the glass glow in its own colour; many signs are now LED strips.",
        },
      },
      all: { kid: 'From liquid air to the lights of every city!', sci: 'Liquid air, 1898; the first neon lights, 1910; fluorescent coatings and LEDs today.' },
      off: { kid: 'Dark again. Shall we light the story once more?', sci: 'Off.' },
      panel: {
        kid: [
          { p: '1898: in London, William Ramsay and Morris Travers made air so cold that it turned liquid, then let it warm up slowly. Each gas boiled off at its own temperature, and in a few weeks they found three new ones: krypton, neon and xenon.' },
          { p: '1910: in Paris, Georges Claude, who made liquid air to sell its oxygen, had neon left over. He put it in long glass tubes and lit them at the motor show: the first neon lights.' },
          { p: "Today many 'neon' signs have no neon at all. They hold argon with a drop of mercury, and a coating inside the glass gives them their colour. Red still comes from real neon." },
          { p: 'The names are Greek: neon means new, krypton hidden, xenon stranger, argon lazy, and helium comes from Helios, the Sun.' },
        ],
        sci: [
          { rows: [['1868', 'helium seen in the Sun (Janssen, Lockyer)'], ['1894', 'argon, the first noble gas isolated (Rayleigh and Ramsay)'], ['1895', 'helium on Earth (Ramsay, in cleveite)'], ['1898', 'krypton, neon, xenon (Ramsay and Travers)'], ['1900', 'radon (Friedrich Ernst Dorn)'], ['1910', "Georges Claude's neon tubes, Paris"], ['1962', 'the first noble-gas compound (Bartlett)']] },
          { p: 'Liquid air separates by boiling point: neon {Ne} K, argon {Ar} K, krypton {Kr} K, xenon {Xe} K (nitrogen boils at {N} K, oxygen at {O} K).' },
          { p: "Claude's company, Air Liquide, made oxygen from liquid air and had neon to spare. Today many signs are argon with a little mercury: its 253.7 nm ultraviolet excites a fluorescent coating (the makers' 'phosphor', nothing to do with the element phosphorus) that glows in its own colour; clear tubes of neon still give the classic red. Many signs are now LEDs." },
        ],
      },
    },

    balloons: {
      title: 'Which balloon floats?',
      label: 'the balloons',
      verbs: { go: 'Let go', back: 'Tie them again' },
      screen: { kid: 'Lighter than air floats, heavier sinks.', sci: 'Lift per litre: the density of air minus that of the gas. Air: 1.293 g/L at 0 °C.' },
      says: {
        kid: 'Helium shoots up, neon floats up slowly, and argon, krypton and xenon fall: they are heavier than air!',
        sci: 'Lift per litre at 0 °C: helium {He} g, neon {Ne} g; argon, krypton and xenon are denser than air and sink.',
      },
      back: { kid: 'Tied again. Shall we let them go once more?', sci: 'Reset: five balloons of 11.5 L.' },
      air: 'air',
      at: 'at 0 °C and 1 atm',
      densities: 'Densities',
      panel: {
        kid: [
          { p: 'A balloon floats when the gas inside is lighter than the same amount of air. Helium is very light, so it rises fast. Neon is lighter than air too, so its balloon floats up, slowly.' },
          { p: 'Argon, krypton and xenon are heavier than air: their balloons drop to the floor. Xenon falls fastest: it is about four and a half times heavier than air!' },
          { p: 'Radon is the heaviest gas of all, more than seven times heavier than air. That is why it gathers in cellars.' },
        ],
        sci: [
          { p: 'At the same temperature and pressure a litre of any gas holds the same number of particles (Avogadro), so density follows molar mass: He 4.0, Ne 20.2, air about 29.0, Ar 39.9, Kr 83.8, Xe 131.3 g/mol.' },
          { p: 'Each balloon here holds 11.5 L in 2.5 g of rubber: helium lifts {liftHe} g and neon {liftNe} g, so both rise; argon, krypton and xenon weigh more than the air they push aside, and the drag of the air sets their speed.' },
        ],
      },
    },
  },

  'pt-pt': {
    back: 'Voltar ao salão do {gas}',
    kicker: 'A oficina do néon',
    talkTo: 'Falar com',
    open: 'ABERTO',
    busy: { kid: 'Espera um bocadinho: ainda está a funcionar!', sci: 'Um momento: a experiência anterior ainda está a decorrer.' },
    greet: {
      kid: 'Bem-vindo à oficina do néon! Aqui enchemos tubos de vidro com gases como eu e pomo-los a brilhar. Acende os tubos, escreve o teu nome em néon e separa a luz com o prisma.',
      sci: 'A oficina do néon: descargas luminosas nos gases nobres. Enche e acende os tubos, escreve o teu nome em qualquer um deles e decompõe a sua luz no espetroscópio.',
    },
    greetGas: {
      He: {
        kid: 'Bem-vindo à oficina do néon, à minha sala! Sou o hélio; o meu nome vem da palavra grega para Sol, porque fui descoberto no Sol antes de alguém me encontrar na Terra. Num tubo de vidro brilho num rosa-pêssego suave. Acende os tubos e escreve o teu nome em mim, na parede!',
        sci: 'A sala do hélio na oficina do néon. Uma descarga em hélio brilha em rosa-pêssego; a sua risca mais visível é a amarela, de 587,6 nm, a mesma que revelou o hélio no espetro do Sol em 1868. Enche e acende os tubos, escreve o teu nome em qualquer gás e decompõe a sua luz no espetroscópio.',
      },
      Ne: {
        kid: 'Bem-vindo à minha oficina: os letreiros de néon têm o meu nome! O meu nome vem da palavra grega para “novo”. Aceso, brilho no famoso vermelho-alaranjado dos letreiros das lojas. Acende os tubos e escreve o teu nome em mim, na parede!',
        sci: 'A sala do néon, o gás que deu nome aos letreiros. O seu brilho vermelho-alaranjado é uma multidão de riscas, do amarelo-alaranjado ao vermelho profundo; Georges Claude mostrou as primeiras luzes de néon em Paris, em 1910. Enche e acende os tubos, escreve o teu nome em qualquer gás e decompõe a sua luz no espetroscópio.',
      },
      Ar: {
        kid: 'Bem-vindo à minha sala da oficina! Sou o árgon; o meu nome vem da palavra grega para “preguiçoso”, porque quase nunca reajo. As lâmpadas antigas eram cheias de mim. Num tubo brilho num lilás pálido, e com uma gota de mercúrio faço os letreiros azuis.',
        sci: 'A sala do árgon. O árgon é 0,93 % do ar, o gás nobre mais comum aqui; uma descarga em árgon puro brilha de lilás a violeta, e árgon com uma gota de mercúrio e um revestimento no vidro faz a maior parte dos letreiros “de néon” que não são vermelhos. Enche e acende os tubos, escreve o teu nome em qualquer gás e decompõe a sua luz no espetroscópio.',
      },
      Kr: {
        kid: 'Bem-vindo à minha sala! Sou o crípton; o meu nome vem da palavra grega para “escondido”, porque há muito pouco de mim no ar. Aceso, brilho quase branco, com um toque de lilás. Acende os tubos e escreve o teu nome em mim, na parede!',
        sci: 'A sala do crípton. Cerca de uma parte por milhão do ar. Uma descarga em crípton parece branco-lilás, com riscas fortes por todo o espetro (verde a 557 nm, amarela a 587 nm); de 1960 a 1983, o metro foi definido por uma risca laranja do crípton-86 (605,8 nm). Enche e acende os tubos, escreve o teu nome em qualquer gás e decompõe a sua luz no espetroscópio.',
      },
      Xe: {
        kid: 'Bem-vindo à minha sala! Sou o xénon; o meu nome vem da palavra grega para “estrangeiro”. Brilho azul-violeta, ilumino alguns faróis de automóveis, e há naves espaciais que voam com motores que atiram os meus átomos para trás!',
        sci: 'A sala do xénon, o gás nobre estável mais raro no ar, cerca de 0,09 partes por milhão. Uma descarga em xénon brilha de azul a violeta; as lâmpadas de arco de xénon dão aos projetores de cinema uma luz parecida com a do dia, e motores iónicos como os da sonda Dawn, da NASA, funcionavam a xénon. Enche e acende os tubos, escreve o teu nome em qualquer gás e decompõe a sua luz no espetroscópio.',
      },
    },
    greetRadon: {
      kid: 'Bem-vindo à oficina do néon! Os outros gases brilham nos letreiros, mas eu não: estou fechado na caixa de chumbo, no fim da bancada. Anda ver porquê.',
      sci: 'A oficina do néon. O rádon é o único gás nobre que nunca vai para um letreiro: a sua caixa está no fim da bancada de enchimento, atrás de vidro de chumbo.',
    },
    talk: {
      kid: [
        'Cada gás nobre brilha com a sua cor: o néon vermelho-alaranjado, o árgon lilás, o crípton branco, o xénon azul e o hélio cor de pêssego.',
        'Muitos letreiros «de néon» que não são vermelhos não têm néon nenhum: têm árgon, uma gota de mercúrio e uma camada no vidro.',
        'O hélio foi descoberto no Sol 27 anos antes de alguém o encontrar na Terra!',
        'Os gases nobres têm a camada de fora cheia, por isso nunca dão a mão a outros átomos. Olha para mim: não tenho mãos!',
        'Os fabricantes de letreiros dobram cada letra à mão, amolecendo o tubo de vidro numa chama.',
      ],
      sci: [
        'Uma descarga luminosa: eletrões livres, acelerados pelo campo, chocam com os átomos e excitam-nos; cada átomo regressa emitindo fotões de energias exatas, as suas riscas.',
        'Os tubos dos letreiros têm o gás a cerca de 3 a 20 torr (0,4 a 3 kPa) e acendem com vários milhares de volts.',
        'A risca laranja do crípton-86 definiu o metro de 1960 a 1983: 1 650 763,73 comprimentos de onda no vácuo.',
        'Em 1962, Neil Bartlett fez o primeiro composto de um gás nobre, um hexafluoroplatinato de xénon: nobres, mas não completamente inertes.',
        'Antes de ser cheio, o tubo de um letreiro é evacuado e «bombardeado»: aquecido por uma corrente forte para expulsar as impurezas que estragariam a cor.',
      ],
    },
    colours: { violet: 'violeta', blue: 'azul', cyan: 'azul-esverdeada', green: 'verde', yellow: 'amarela', orange: 'alaranjada', red: 'vermelha' },

    bench: {
      title: 'A bancada de enchimento',
      screen: { kid: 'Tira o ar, deixa entrar um gás, liga a alta tensão.', sci: 'Vácuo, depois alguns milibares de gás, depois milhares de volts: uma descarga luminosa.' },
      verbs: { fill: 'Encher com', off: 'Apagar', wait: 'Espera' },
      labels: { all: 'todos os tubos', working: 'o tubo está a encher' },
      hv: 'ALTA TENSÃO',
      air: 'ar',
      says: {
        He: { kid: 'O hélio brilha num rosa cor de pêssego.', sci: 'Hélio: as riscas amarela de 587,6 nm, vermelha de 667,8 nm e violeta de 447,1 nm juntas parecem cor de pêssego.' },
        Ne: { kid: 'O néon: o famoso vermelho-alaranjado dos letreiros!', sci: 'Néon: dezenas de riscas vermelhas e laranja entre 585 e 750 nm.' },
        Ar: { kid: 'O árgon brilha lilás, um violeta suave.', sci: 'Árgon: riscas vermelhas perto de 700 nm e violetas perto de 420 nm misturam-se num lilás.' },
        Kr: { kid: 'O crípton brilha num branco prateado.', sci: 'Crípton: as riscas amarela de 587,1 nm, verde de 557,0 nm e um grupo de violetas parecem quase brancas.' },
        Xe: { kid: 'O xénon brilha azul.', sci: 'Xénon: as suas riscas visíveis mais fortes são azuis, de 473 a 492 nm.' },
        all: { kid: 'Os cinco acesos: um arco-íris de gases nobres!', sci: 'Os cinco acesos: o mesmo tubo e a mesma tensão, cinco conjuntos de níveis de energia, cinco cores.' },
        off: { kid: 'Tudo apagado. Queres acendê-los outra vez?', sci: 'Apagados: sem campo, nada excita os átomos, e o brilho para logo.' },
      },
      panel: {
        kid: [
          { p: 'Os fabricantes de letreiros fazem assim: primeiro, uma bomba tira todo o ar do tubo de vidro. Depois entra um bocadinho de gás nobre, muito menos do que o ar que lá estava. Por fim, ligam uma tensão elétrica muito alta.' },
          { p: 'A eletricidade corre pelo gás, choca com os seus átomos e põe-nos a brilhar. Cada gás nobre brilha com a sua cor, sempre a mesma.' },
          { list: ['Hélio: rosa cor de pêssego', 'Néon: vermelho-alaranjado', 'Árgon: lilás', 'Crípton: branco prateado', 'Xénon: azul'] },
          { p: 'Falta um gás: o rádon. Está fechado na caixa de chumbo, no fim da bancada. Vai ver porquê!' },
        ],
        sci: [
          { p: 'O tubo é evacuado, bombardeado (aquecido por uma corrente forte para expulsar as impurezas), cheio com um gás nobre a cerca de 3 a 20 torr (0,4 a 3 kPa, uns centésimos de atmosfera) e selado.' },
          { p: 'Milhares de volts entre os elétrodos acendem uma descarga luminosa. A baixa pressão, um eletrão voa o suficiente entre choques para ganhar a energia que excita um átomo; à pressão atmosférica, o mesmo tubo precisaria de uma tensão muito maior para acender (lei de Paschen).' },
          { p: 'Cada átomo excitado regressa emitindo fotões com as energias entre os seus próprios níveis, por isso cada gás tem a sua cor.' },
          { rows: [['He', 'rosa-pêssego: 587,6, 667,8, 447,1 nm'], ['Ne', 'vermelho-alaranjado: muitas riscas, de 585 a 750 nm'], ['Ar', 'lilás: 696,5, 706,7 nm e 415,9, 420,1 nm'], ['Kr', 'esbranquiçado: 587,1, 557,0 nm e riscas violetas'], ['Xe', 'azul: de 473,4 a 492,3 nm']] },
        ],
      },
    },

    radon: {
      title: 'O rádon, atrás de vidro de chumbo',
      label: 'a caixa do rádon',
      verb: 'Medir',
      screen: { kid: 'Nunca num letreiro: é radioativo.', sci: 'Rádon-222, período de semidesintegração de {half} dias. As suas riscas foram medidas em tubos selados (NIST).' },
      sign: 'RADIOATIVO',
      lines: 'As riscas do rádon',
      says: {
        kid: 'Tic, tic, tic! Não se vê o rádon, mas o contador ouve os seus átomos a desfazerem-se.',
        sci: 'Cada tic é uma desintegração: o rádon-222 emite partículas alfa, e os seus descendentes de vida curta juntam raios beta e gama.',
      },
      rows: { isotope: 'Isótopo', half: 'Período de semidesintegração', decay: 'Desintegração', density: 'Densidade' },
      values: { isotope: 'rádon-222', half: '{half} dias', decay: 'alfa, para polónio-218', density: '{density} g/L a 0 °C, o gás mais denso' },
      panel: {
        kid: [
          { p: 'O rádon também é um gás nobre, mas nunca vai para um letreiro. É radioativo: os seus átomos desfazem-se sozinhos e disparam partículas minúsculas. Metade de qualquer rádon desaparece em menos de quatro dias.' },
          { p: 'Respirá-lo é perigoso: depois do tabaco, é uma das principais causas de cancro do pulmão. Sai do granito e, em zonas do Norte e do Centro de Portugal, pode juntar-se nas caves, por isso as pessoas arejam as casas.' },
          { p: 'É por isso que fica aqui, atrás de vidro de chumbo grosso, onde o contador ainda o consegue ouvir.' },
        ],
        sci: [
          { p: 'Nunca num letreiro: metade do seu rádon desapareceria em {half} dias, os produtos da desintegração (polónio, chumbo, bismuto) cobririam o vidro, e um tubo partido libertaria um perigo para os pulmões. A OMS considera o rádon a segunda causa de cancro do pulmão, depois do tabaco; em Portugal é mais alto sobre os granitos do Norte e do Centro, como na Guarda.' },
          { p: 'Cada partícula alfa é um núcleo de hélio. Rutherford e Royds provaram-no em 1909 com um espetroscópio: rádon selado num tubo de vidro com paredes de menos de 1/100 mm deixava passar as partículas alfa para um tubo exterior; ao fim de 2 dias via-se, fraca, a risca amarela do hélio, ao fim de 6 dias todas as suas riscas mais fortes.' },
        ],
      },
    },

    name: {
      title: 'O teu nome em néon',
      label: 'o teu nome em néon',
      verb: 'Escrever',
      screen: { kid: 'Escreve uma palavra e acende-a no gás que quiseres.', sci: 'A tua palavra, dobrada em tubo e acesa em qualquer gás.' },
      overlay: {
        title: 'Escreve o teu nome em néon',
        placeholder: 'O teu nome',
        gas: 'Gás',
        light: 'Acender!',
        close: 'Fechar',
        radon: 'O rádon fica de fora: é radioativo.',
      },
      says: { kid: '{word} em {gas}: que bonito!', sci: '{word}: {metres} m de tubo, aceso em {gas}.' },
      panel: {
        kid: [
          { p: 'As letras de néon verdadeiras são tubos de vidro dobrados à mão. O fabricante amolece o tubo numa chama e dobra-o, letra a letra, por cima de um desenho na mesa, enquanto sopra devagarinho para dentro do tubo para ele não se espalmar nas curvas.' },
          { p: 'Depois o tubo é esvaziado, cheio com um gás e fechado, com um elétrodo de metal em cada ponta para a eletricidade. Muda o gás e a cor muda: experimenta o teu nome nos cinco!' },
        ],
        sci: [
          { p: 'O tubo é dobrado sobre uma chama larga (um queimador em fita), em cima de um desenho em tamanho real, enquanto o artesão sopra por uma mangueira para manter o tubo redondo; soldam-se elétrodos nas duas pontas, e os troços entre as letras são pintados de preto.' },
          { p: 'O transformador dá a alta tensão que acende a descarga e depois limita a corrente; o brilho enche o tubo de um elétrodo ao outro, por isso cada letra acende em todo o comprimento.' },
          { p: 'A cor só depende do gás (e de algum revestimento ou vidro colorido), não da forma: os mesmos átomos dão as mesmas riscas em qualquer tubo.' },
        ],
      },
    },

    spectrum: {
      title: 'O espetroscópio',
      lines: 'riscas',
      label: 'o espetroscópio',
      verb: 'Experimentar o {gas}',
      screen: { kid: 'Um prisma separa a luz nas suas cores.', sci: 'Riscas de emissão no ar, base de dados de espetros atómicos do NIST.' },
      sun: 'O Sol, 1868',
      match: 'É o hélio!',
      footer: { kid: 'Cada gás tem as suas riscas: uma impressão digital de luz.', sci: 'Comprimentos de onda observados no ar (nm), base de dados de espetros atómicos do NIST.' },
      says: {
        He: { kid: 'A risca amarela do hélio fica mesmo por baixo da risca misteriosa do Sol: foi assim que o hélio foi descoberto no Sol, em 1868!', sci: 'A risca de He I a 587,6 nm cai exatamente sob a risca D3 das proeminências de 1868; as riscas D do sódio estão a 589,0 e 589,6 nm.' },
        Ne: { kid: 'O néon: uma multidão de riscas vermelhas e laranja. Nada por baixo da risca amarela do Sol.', sci: 'Ne I: dezenas de riscas de 585 a 750 nm; as mais fortes da lista do NIST estão a 692,9 e 703,2 nm.' },
        Ar: { kid: 'O árgon: riscas vermelhas de um lado, violetas do outro. Juntas parecem lilás.', sci: 'Ar I: 696,5, 706,7 e 738,4 nm no vermelho, 415,9 e 420,1 nm no violeta.' },
        Kr: { kid: 'O crípton: uma risca amarela forte, uma verde forte e um grupo de violetas.', sci: 'Kr I: 587,1 e 557,0 nm, e um grupo violeta de 427 a 450 nm. Perto da D3, mas não em cima dela.' },
        Xe: { kid: 'O xénon: uma família de riscas azuis.', sci: 'Xe I: 473,4, 480,7, 491,7 e 492,3 nm no azul, e riscas vermelhas perto de 700 nm.' },
      },
      panel: {
        kid: [
          { p: 'O prisma separa a luz do tubo nas suas cores. A luz do Sol daria um arco-íris contínuo; um gás nobre dá só algumas riscas brilhantes, sempre nos mesmos sítios. Cada elemento tem o seu desenho de riscas, como uma impressão digital.' },
          { p: 'Em 1868, durante um eclipse, os astrónomos olharam assim para a beira do Sol e viram uma risca amarela que não correspondia a nada da Terra. Chamaram ao novo elemento hélio, de Hélios, o Sol. O hélio só foi encontrado na Terra em 1895.' },
          { p: 'Experimenta os tubos um a um: que gás faz a risca amarela do Sol?' },
        ],
        sci: [
          { p: 'Na descarga, os eletrões levam os átomos a níveis excitados; um átomo que desce para um nível mais baixo emite um fotão com exatamente a diferença de energia, E = hc/λ. Cada elemento tem os seus níveis, por isso os seus comprimentos de onda.' },
          { p: '18 de agosto de 1868: Pierre Janssen, em Guntur, na Índia, viu uma risca amarela brilhante no espetro das proeminências solares durante o eclipse; Norman Lockyer viu-a em Inglaterra em outubro, sem eclipse. Estava a 587,6 nm, ao lado das riscas D do sódio (589,0 e 589,6 nm), e chamaram-lhe D3; Lockyer e Edward Frankland deram o nome ao elemento. William Ramsay encontrou hélio na Terra em 1895, num mineral de urânio, a cleveíte.' },
          { p: 'A risca laranja do crípton-86 (605,78 nm no vácuo) definiu o metro de 1960 a 1983.' },
          { p: 'Riscas: comprimentos de onda observados no ar, da base de dados de espetros atómicos do NIST.' },
        ],
      },
    },

    atom: {
      title: 'Porque é que brilham',
      label: 'o átomo de {gas}',
      verb: 'Disparar um eletrão',
      screen: { kid: 'A camada de fora cheia: nada a que se agarrar. Um encontrão faz luz.', sci: 'Uma camada fechada. Os choques excitam-na, e ela devolve a energia em luz: E = hc / comprimento de onda.' },
      ladder: { title: 'Degraus de energia', ground: 'estado fundamental', ion: 'ionização', photon: 'fotão' },
      says: {
        kid: 'Pumba! Um eletrão saltou um degrau, voltou a cair e deu um clarão de luz {colour}.',
        sci: '{Gas}: descer de {hi} eV para {lo} eV dá um fotão de {photon} eV, λ = {nm} nm.',
      },
      ionTitle: 'Primeira energia de ionização',
      line: '{Gas}, risca de {nm} nm: nível de cima a {hi} eV, nível de baixo a {lo} eV acima do estado fundamental; o fotão leva {photon} eV = hc/λ. Níveis da base de dados de espetros atómicos do NIST.',
      panel: {
        kid: [
          { p: 'Olha para o anel de fora do átomo: está cheio. Dois eletrões no hélio, oito nos outros. Um anel de fora cheio é muito estável, por isso estes átomos não precisam de partilhar nem de trocar eletrões com ninguém. É por isso que os seus Atomitos não têm mãos!' },
          { p: 'Como quase nunca se juntam a outros átomos, chamaram-lhes «nobres», como o ouro, que não enferruja.' },
          { p: 'Mas a eletricidade pode empurrar um eletrão para um degrau mais alto. Pouco depois ele volta a descer e liberta a energia a mais num clarão de luz. Cada degrau tem a sua cor, e milhares de milhões de clarões por segundo fazem o brilho do tubo.' },
        ],
        sci: [
          { p: 'Camadas fechadas: 1s² no hélio, ns² np⁶ nos outros. Têm as primeiras energias de ionização mais altas dos seus períodos e nenhum lugar livre no octeto, por isso não formam ligações comuns. Em 1962, Neil Bartlett fez o primeiro composto de um gás nobre, o hexafluoroplatinato de xénon; seguiram-se fluoretos de xénon e de crípton. O químico alemão Hugo Erdmann chamou-lhes Edelgase, gases nobres, como os metais nobres.' },
        ],
      },
    },

    history: {
      title: 'Letreiros ao longo do tempo',
      label: 'um pouco de história',
      verbs: { next: 'Acender {year}', off: 'Apagar' },
      today: 'HOJE',
      screen: { kid: '1898, 1910, hoje: acende-os por ordem.', sci: 'Do ar líquido (1898) às luzes da cidade.' },
      captions: { 1898: 'Londres: crípton, néon, xénon', 1910: 'Paris: as primeiras luzes de néon', today: 'árgon, mercúrio e um revestimento' },
      steps: {
        1898: {
          kid: '1898, Londres: Ramsay e Travers arrefeceram ar até ficar líquido, deixaram-no ferver devagar e encontraram três gases novos em poucas semanas: o crípton, o néon e o xénon.',
          sci: 'De maio a julho de 1898: a destilação fracionada do ar líquido dá a Ramsay e Travers o crípton (escondido), o néon (novo) e o xénon (estrangeiro).',
        },
        1910: {
          kid: '1910, Paris: Georges Claude acendeu dois tubos de néon com 12 metros no salão do automóvel. As primeiras luzes de néon!',
          sci: '3 a 18 de dezembro de 1910: Georges Claude mostra dois tubos de néon de 12 m no Salão Automóvel de Paris, no Grand Palais; o seu primeiro letreiro foi vendido em 1912, a um barbeiro.',
        },
        today: {
          kid: 'Hoje, muitos letreiros «de néon» não têm néon nenhum! Têm árgon e uma gota de mercúrio, e um pó por dentro do vidro transforma a sua luz invisível em azul, verde, branco ou cor-de-rosa.',
          sci: 'Hoje: árgon com um pouco de mercúrio. O ultravioleta de 253,7 nm do mercúrio faz brilhar um revestimento fluorescente no vidro, com a sua própria cor; muitos letreiros são agora fitas de LED.',
        },
      },
      all: { kid: 'Do ar líquido às luzes de todas as cidades!', sci: 'Ar líquido, 1898; as primeiras luzes de néon, 1910; revestimentos fluorescentes e LED hoje.' },
      off: { kid: 'Às escuras outra vez. Acendemos a história de novo?', sci: 'Apagados.' },
      panel: {
        kid: [
          { p: '1898: em Londres, William Ramsay e Morris Travers arrefeceram o ar até ficar líquido e depois deixaram-no aquecer devagar. Cada gás fervia à sua temperatura, e em poucas semanas encontraram três novos: o crípton, o néon e o xénon.' },
          { p: '1910: em Paris, Georges Claude, que fazia ar líquido para vender o seu oxigénio, tinha néon a sobrar. Meteu-o em tubos de vidro compridos e acendeu-os no salão do automóvel: as primeiras luzes de néon.' },
          { p: 'Hoje, muitos letreiros «de néon» não têm néon nenhum. Têm árgon com uma gota de mercúrio, e uma camada por dentro do vidro dá-lhes a cor. O vermelho ainda vem do néon verdadeiro.' },
          { p: 'Os nomes vêm do grego: néon quer dizer novo, crípton escondido, xénon estrangeiro, árgon preguiçoso, e hélio vem de Hélios, o Sol.' },
        ],
        sci: [
          { rows: [['1868', 'hélio visto no Sol (Janssen, Lockyer)'], ['1894', 'árgon, o primeiro gás nobre isolado (Rayleigh e Ramsay)'], ['1895', 'hélio na Terra (Ramsay, na cleveíte)'], ['1898', 'crípton, néon, xénon (Ramsay e Travers)'], ['1900', 'rádon (Friedrich Ernst Dorn)'], ['1910', 'os tubos de néon de Georges Claude, Paris'], ['1962', 'o primeiro composto de um gás nobre (Bartlett)']] },
          { p: 'O ar líquido separa-se pelos pontos de ebulição: néon {Ne} K, árgon {Ar} K, crípton {Kr} K, xénon {Xe} K (o azoto ferve a {N} K, o oxigénio a {O} K).' },
          { p: 'A empresa de Claude, a Air Liquide, fazia oxigénio a partir do ar líquido e tinha néon de sobra. Hoje muitos letreiros são árgon com um pouco de mercúrio: o seu ultravioleta de 253,7 nm excita um revestimento fluorescente (o «fósforo» dos fabricantes, que nada tem a ver com o elemento fósforo) que brilha com a sua cor; os tubos transparentes de néon ainda dão o vermelho clássico. Muitos letreiros são agora de LED.' },
        ],
      },
    },

    balloons: {
      title: 'Que balão flutua?',
      label: 'os balões',
      verbs: { go: 'Largar', back: 'Prender outra vez' },
      screen: { kid: 'Mais leve do que o ar sobe, mais pesado desce.', sci: 'Impulsão por litro: a densidade do ar menos a do gás. Ar: 1,293 g/L a 0 °C.' },
      says: {
        kid: 'O hélio dispara para cima, o néon sobe devagar, e o árgon, o crípton e o xénon caem: são mais pesados do que o ar!',
        sci: 'Impulsão por litro a 0 °C: hélio {He} g, néon {Ne} g; o árgon, o crípton e o xénon são mais densos do que o ar e afundam.',
      },
      back: { kid: 'Presos outra vez. Largamo-los de novo?', sci: 'De novo: cinco balões de 11,5 L.' },
      air: 'ar',
      at: 'a 0 °C e 1 atm',
      densities: 'Densidades',
      panel: {
        kid: [
          { p: 'Um balão flutua quando o gás lá dentro é mais leve do que a mesma quantidade de ar. O hélio é muito leve, por isso sobe depressa. O néon também é mais leve do que o ar, por isso o seu balão sobe, devagarinho.' },
          { p: 'O árgon, o crípton e o xénon são mais pesados do que o ar: os seus balões caem ao chão. O xénon cai mais depressa: é cerca de quatro vezes e meia mais pesado do que o ar!' },
          { p: 'O rádon é o gás mais pesado de todos, mais de sete vezes mais pesado do que o ar. É por isso que se junta nas caves.' },
        ],
        sci: [
          { p: 'À mesma temperatura e pressão, um litro de qualquer gás tem o mesmo número de partículas (Avogadro), por isso a densidade acompanha a massa molar: He 4,0, Ne 20,2, ar cerca de 29,0, Ar 39,9, Kr 83,8, Xe 131,3 g/mol.' },
          { p: 'Cada balão tem 11,5 L em 2,5 g de borracha: o hélio levanta {liftHe} g e o néon {liftNe} g, por isso ambos sobem; o árgon, o crípton e o xénon pesam mais do que o ar que empurram, e o atrito do ar marca a sua velocidade.' },
        ],
      },
    },
  },
}
