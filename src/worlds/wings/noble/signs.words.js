// Every word of the neon sign workshop, in English, European Portuguese (AO90), Polish and German, at the
// two depths (kid: Explorer, sci: Scientist). {placeholders} are filled when used: {gas} a gas's name as
// it stands inside a sentence (lowercase, or as written where `nameCase` is 'keep': German nouns keep
// their capital), {Gas} the same with a capital, and numbers from src/data/elements.json or nobleData.js.
// Polish inflects the names: {gas}u is the genitive and {gas}em the instrumental of all six (helu, neonu,
// argonu, kryptonu, ksenonu, radonu; helem, neonem, ...). Texts drawn in 3D (the screens' lines) keep to
// Latin letters: no Greek, no superscripts (the HUD's panels may have them).
// Facts: NIST Atomic Spectra Database (wavelengths, levels); Wikipedia "Neon sign" and "Neon lighting"
// (Claude's two 12 m tubes at the Paris Motor Show, 3 to 18 December 1910; fill pressures 3 to 20 torr);
// Rutherford and Royds, Phil. Mag. 17, 281 (1909) (after 2 days the helium yellow faintly visible, after 6
// days all the stronger lines); the 1960 metre: 1 650 763.73 wavelengths of krypton-86 (CGPM, until
// 1983); WHO: radon the second cause of lung cancer after smoking; INSA: radon in Portugal's granite
// regions (Guarda).

export const SIGNS_WORDS = {
  en: {
    nameCase: 'lower',
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
      label: 'the filling bench',
      hints: { pump: 'Tap the pump', gas: 'Tap a gas bottle', hv: 'Tap the high-voltage box', off: 'Tap the high-voltage box to switch off', wait: 'Wait a moment' },
      buttons: { pump: 'Pump', hv: 'High voltage' },
      steps: {
        pumped: { kid: 'Whirr! The pump sucks the air out: the needle falls to 0. Now choose a gas: tap its bottle.', sci: 'Pumped down: the gauge reads 0 mbar. Now let a gas in: tap its flask.' },
        filled: { kid: 'A little {gas} is in the tube now, much less than the air that was there. Now the high voltage: tap the black box with the lightning sign.', sci: '{Gas} at about 10 mbar, a hundredth of the air pressure. Now the high voltage: tap the transformer.' },
        needPump: { kid: 'Wait: the tube is still full of air! The gas would mix with it and not glow properly. Tap the pump first.', sci: 'The line is still at air pressure: pump it down first, or the air would spoil the discharge.' },
        noAir: { kid: 'Nothing happens: in a tube full of air, the electricity cannot get through to make it glow. Pump the air out and let a gas in first.', sci: "No glow: at atmospheric pressure the breakdown voltage is far above what the transformer gives (Paschen's law). Pump down and fill first." },
        noGas: { kid: 'Nothing glows: the tube is empty! Choose a gas: tap its bottle.', sci: 'A vacuum has no atoms to excite: let a gas in first.' },
        waiting: { kid: 'The {gas} is waiting for the high voltage: tap the black box with the lightning sign.', sci: 'The {gas} fill is waiting: switch on the high voltage, or pump it out again.' },
      },
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
      verb: 'Tap the Geiger counter',
      button: 'Measure',
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
      verb: 'Tap the word on the wall',
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
      verb: 'Tap a tube in the rack',
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
      hints: { fire: 'Tap the atom to fire an electron', colour: 'Tap a colour on the energy steps' },
      button: 'Fire an electron',
      screen: { kid: 'A full outer shell: nothing to hold on to. A bump makes light.', sci: 'A closed shell. Collisions excite it, and it gives the energy back as light: E = hc / wavelength.' },
      ladder: { title: 'Energy steps', ground: 'ground state', ion: 'ionisation', photon: 'photon', pick: 'Tap a colour' },
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
      hints: { next: 'Tap the {year} sign', all: 'Tap a sign to hear it again' },
      buttons: { off: 'Switch them off' },
      today: 'TODAY',
      screen: { kid: '1898, 1910, today: tap a sign to light it.', sci: 'From liquid air (1898) to the lights of the city.' },
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
      hints: { go: 'Tap a balloon to let it go', back: 'Tap the table to tie them again' },
      buttons: { all: 'Let them all go', back: 'Tie them again' },
      one: {
        He: { kid: 'Whoosh! Helium shoots up to the ceiling: it is about seven times lighter than air.', sci: 'Helium, {rho} g/L against {air} g/L for air: the balloon rises at up to {speed} m/s.' },
        Ne: { kid: 'Neon floats up, slowly: it is lighter than air, but much heavier than helium.', sci: 'Neon, {rho} g/L against {air} g/L for air: its lift only just beats the rubber, and it rises at up to {speed} m/s.' },
        Ar: { kid: 'Argon drops to the floor: it is heavier than air.', sci: 'Argon, {rho} g/L against {air} g/L for air: the balloon sinks at up to {speed} m/s.' },
        Kr: { kid: 'Krypton falls faster: it is almost three times heavier than air.', sci: 'Krypton, {rho} g/L against {air} g/L for air: the balloon sinks at up to {speed} m/s.' },
        Xe: { kid: 'Xenon falls fastest of all: it is four and a half times heavier than air!', sci: 'Xenon, {rho} g/L against {air} g/L for air: the balloon sinks at up to {speed} m/s.' },
      },
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
          { p: 'Radon is the heaviest gas of all, more than seven times heavier than air. It gathers in cellars, but not because it is heavy: a house draws air in from the ground under it, and the radon comes in with it.' },
        ],
        sci: [
          { p: 'At the same temperature and pressure a litre of any gas holds the same number of particles (Avogadro), so density follows molar mass: He 4.0, Ne 20.2, air about 29.0, Ar 39.9, Kr 83.8, Xe 131.3 g/mol.' },
          { p: 'Each balloon here holds 11.5 L in 2.5 g of rubber: helium lifts {liftHe} g and neon {liftNe} g, so both rise; argon, krypton and xenon weigh more than the air they push aside, and the drag of the air sets their speed.' },
        ],
      },
    },
  },

  'pt-pt': {
    nameCase: 'lower',
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
      label: 'a bancada de enchimento',
      hints: { pump: 'Toca na bomba', gas: 'Toca num frasco de gás', hv: 'Toca na caixa da alta tensão', off: 'Toca na caixa da alta tensão para apagar', wait: 'Espera um momento' },
      buttons: { pump: 'Bomba', hv: 'Alta tensão' },
      steps: {
        pumped: { kid: 'Vrrr! A bomba tira o ar: o ponteiro desce até 0. Agora escolhe um gás: toca no frasco dele.', sci: 'Vácuo feito: o manómetro marca 0 mbar. Agora deixa entrar um gás: toca no frasco dele.' },
        filled: { kid: 'Já há um pouco de {gas} no tubo, muito menos do que o ar que lá estava. Agora a alta tensão: toca na caixa preta com o sinal do raio.', sci: '{Gas} a cerca de 10 mbar, um centésimo da pressão do ar. Agora a alta tensão: toca no transformador.' },
        needPump: { kid: 'Espera: o tubo ainda está cheio de ar! O gás misturava-se com ele e não brilhava bem. Toca primeiro na bomba.', sci: 'A linha ainda está à pressão do ar: tira-lhe o ar primeiro, ou o ar estragaria a descarga.' },
        noAir: { kid: 'Não acontece nada: num tubo cheio de ar, a eletricidade não consegue passar para o fazer brilhar. Tira primeiro o ar e deixa entrar um gás.', sci: 'Nenhum brilho: à pressão atmosférica, a tensão de rutura é muito maior do que a que o transformador dá (lei de Paschen). Faz vácuo e enche primeiro.' },
        noGas: { kid: 'Nada brilha: o tubo está vazio! Escolhe um gás: toca no frasco dele.', sci: 'No vácuo não há átomos para excitar: deixa entrar um gás primeiro.' },
        waiting: { kid: 'O {gas} está à espera da alta tensão: toca na caixa preta com o sinal do raio.', sci: 'O {gas} está à espera: liga a alta tensão, ou tira-o outra vez com a bomba.' },
      },
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
      verb: 'Toca no contador Geiger',
      button: 'Medir',
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
      verb: 'Toca na palavra da parede',
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
      verb: 'Toca num tubo do suporte',
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
      hints: { fire: 'Toca no átomo para disparar um eletrão', colour: 'Toca numa cor dos degraus de energia' },
      button: 'Disparar um eletrão',
      screen: { kid: 'A camada de fora cheia: nada a que se agarrar. Um encontrão faz luz.', sci: 'Uma camada fechada. Os choques excitam-na, e ela devolve a energia em luz: E = hc / comprimento de onda.' },
      ladder: { title: 'Degraus de energia', ground: 'estado fundamental', ion: 'ionização', photon: 'fotão', pick: 'Toca numa cor' },
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
      hints: { next: 'Toca no letreiro {year}', all: 'Toca num letreiro para o ouvires outra vez' },
      buttons: { off: 'Apagar todos' },
      today: 'HOJE',
      screen: { kid: '1898, 1910, hoje: toca num letreiro para o acender.', sci: 'Do ar líquido (1898) às luzes da cidade.' },
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
      hints: { go: 'Toca num balão para o largar', back: 'Toca na mesa para os prender outra vez' },
      buttons: { all: 'Largar todos', back: 'Prender outra vez' },
      one: {
        He: { kid: 'Zum! O hélio dispara até ao teto: é cerca de sete vezes mais leve do que o ar.', sci: 'Hélio, {rho} g/L contra {air} g/L do ar: o balão sobe a uma velocidade de até {speed} m/s.' },
        Ne: { kid: 'O néon sobe devagarinho: é mais leve do que o ar, mas muito mais pesado do que o hélio.', sci: 'Néon, {rho} g/L contra {air} g/L do ar: a impulsão mal vence o peso da borracha, e o balão sobe a uma velocidade de até {speed} m/s.' },
        Ar: { kid: 'O árgon cai para o chão: é mais pesado do que o ar.', sci: 'Árgon, {rho} g/L contra {air} g/L do ar: o balão desce a uma velocidade de até {speed} m/s.' },
        Kr: { kid: 'O crípton cai mais depressa: é quase três vezes mais pesado do que o ar.', sci: 'Crípton, {rho} g/L contra {air} g/L do ar: o balão desce a uma velocidade de até {speed} m/s.' },
        Xe: { kid: 'O xénon é o que cai mais depressa: é quatro vezes e meia mais pesado do que o ar!', sci: 'Xénon, {rho} g/L contra {air} g/L do ar: o balão desce a uma velocidade de até {speed} m/s.' },
      },
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
          { p: 'O rádon é o gás mais pesado de todos, mais de sete vezes mais pesado do que o ar. Junta-se nas caves, mas não por ser pesado: a casa puxa ar do chão por baixo dela, e o rádon entra com esse ar.' },
        ],
        sci: [
          { p: 'À mesma temperatura e pressão, um litro de qualquer gás tem o mesmo número de partículas (Avogadro), por isso a densidade acompanha a massa molar: He 4,0, Ne 20,2, ar cerca de 29,0, Ar 39,9, Kr 83,8, Xe 131,3 g/mol.' },
          { p: 'Cada balão tem 11,5 L em 2,5 g de borracha: o hélio levanta {liftHe} g e o néon {liftNe} g, por isso ambos sobem; o árgon, o crípton e o xénon pesam mais do que o ar que empurram, e o atrito do ar marca a sua velocidade.' },
        ],
      },
    },
  },

  pl: {
    nameCase: 'lower',
    back: 'Powrót do sali: {gas}',
    kicker: 'Pracownia neonów',
    talkTo: 'Porozmawiaj',
    open: 'OTWARTE',
    busy: { kid: 'Zaczekaj chwilę: to jeszcze działa!', sci: 'Chwileczkę: poprzednia próba jeszcze trwa.' },
    greet: {
      kid: 'Witaj w pracowni neonów! Napełniamy tu szklane rurki gazami takimi jak ja i sprawiamy, że świecą. Zapal rurki, napisz swoje imię w neonie i rozszczep światło pryzmatem.',
      sci: 'Pracownia neonów: wyładowania jarzeniowe w gazach szlachetnych. Napełnij i zapal rurki, napisz swoje imię w dowolnym z nich i rozszczep ich światło w spektroskopie.',
    },
    greetGas: {
      He: {
        kid: 'Witaj w pracowni neonów, w moim pokoju! Jestem Hel; moja nazwa pochodzi od greckiego słowa oznaczającego Słońce, bo odkryto mnie na Słońcu, zanim ktokolwiek znalazł mnie na Ziemi. W szklanej rurce świecę delikatnym brzoskwiniowym różem. Zapal rurki i napisz mną swoje imię na ścianie!',
        sci: 'Pokój helu w pracowni neonów. Wyładowanie w helu świeci brzoskwiniowym różem; jego najlepiej widoczna linia to żółta linia 587,6 nm, ta sama, która w 1868 roku ujawniła hel w widmie Słońca. Napełnij i zapal rurki, napisz swoje imię w dowolnym gazie i rozszczep ich światło w spektroskopie.',
      },
      Ne: {
        kid: 'Witaj w mojej pracowni: neony noszą moje imię! Moja nazwa pochodzi od greckiego słowa „nowy”. Kiedy się zapalę, świecę słynnym czerwonopomarańczowym blaskiem szyldów sklepowych. Zapal rurki i napisz mną swoje imię na ścianie!',
        sci: 'Pokój neonu: gazu, od którego neony wzięły nazwę. Jego czerwonopomarańczowy blask to tłum linii od żółtopomarańczowej do ciemnoczerwonej; Georges Claude pokazał pierwsze lampy neonowe w Paryżu w 1910 roku. Napełnij i zapal rurki, napisz swoje imię w dowolnym gazie i rozszczep ich światło w spektroskopie.',
      },
      Ar: {
        kid: 'Witaj w moim pokoju pracowni! Jestem Argon; moja nazwa pochodzi od greckiego słowa „leniwy”, bo prawie nigdy nie reaguję. Dawniej napełniano mną żarówki. W rurce świecę bladą lawendą, a z kropelką rtęci robię niebieskie neony.',
        sci: 'Pokój argonu. Argon to 0,93% powietrza, najczęstszy tu gaz szlachetny; wyładowanie w czystym argonie świeci od lawendowego do fioletowego, a argon z kropelką rtęci i powłoką na szkle tworzy większość „neonów”, które nie są czerwone. Napełnij i zapal rurki, napisz swoje imię w dowolnym gazie i rozszczep ich światło w spektroskopie.',
      },
      Kr: {
        kid: 'Witaj w moim pokoju! Jestem Krypton; moja nazwa pochodzi od greckiego słowa „ukryty”, bo w powietrzu jest mnie bardzo mało. Kiedy się zapalę, świecę prawie na biało, z odrobiną liliowego. Zapal rurki i napisz mną swoje imię na ścianie!',
        sci: 'Pokój kryptonu. Około jednej milionowej części powietrza. Wyładowanie w kryptonie wygląda na białoliliowe, dzięki silnym liniom w całym widmie (zielona przy 557 nm, żółta przy 587 nm); od 1960 do 1983 roku metr definiowała pomarańczowa linia kryptonu-86 (605,8 nm). Napełnij i zapal rurki, napisz swoje imię w dowolnym gazie i rozszczep ich światło w spektroskopie.',
      },
      Xe: {
        kid: 'Witaj w moim pokoju! Jestem Ksenon; moja nazwa pochodzi od greckiego słowa „obcy”. Świecę niebieskofioletowo, daję światło niektórym reflektorom samochodów, a niektóre statki kosmiczne latają dzięki silnikom, które wypychają moje atomy do tyłu!',
        sci: 'Pokój ksenonu: najrzadszego stabilnego gazu szlachetnego w powietrzu, około 0,09 części na milion. Wyładowanie w ksenonie świeci od niebieskiego do fioletowego; ksenonowe lampy łukowe dają projektorom kinowym światło podobne do dziennego, a silniki jonowe, takie jak w sondzie Dawn należącej do NASA, działały na ksenonie. Napełnij i zapal rurki, napisz swoje imię w dowolnym gazie i rozszczep ich światło w spektroskopie.',
      },
    },
    greetRadon: {
      kid: 'Witaj w pracowni neonów! Inne gazy świecą w neonach, ale nie ja: jestem zamknięty w ołowianej skrzynce na końcu stołu. Chodź zobaczyć, dlaczego.',
      sci: 'Pracownia neonów. Radon to jedyny gaz szlachetny, który nigdy nie trafia do neonu: jego skrzynka stoi na końcu stołu do napełniania, za szkłem ołowiowym.',
    },
    talk: {
      kid: [
        'Każdy gaz szlachetny świeci własnym kolorem: neon czerwonopomarańczowym, argon lawendowym, krypton białym, ksenon niebieskim, a hel brzoskwiniowym różem.',
        'Wiele „neonów”, które nie są czerwone, w ogóle nie ma w sobie neonu: mają argon, kropelkę rtęci i powłokę na szkle.',
        'Hel odkryto na Słońcu 27 lat wcześniej, niż ktokolwiek znalazł go na Ziemi!',
        'Gazy szlachetne mają pełne zewnętrzne powłoki, więc nigdy nie trzymają się za ręce z innymi atomami. Spójrz na mnie: nie mam rąk!',
        'Twórcy neonów wyginają każdą literę ręcznie, zmiękczając szklaną rurkę w płomieniu.',
      ],
      sci: [
        'Wyładowanie jarzeniowe: swobodne elektrony, przyspieszane przez pole, zderzają się z atomami i je wzbudzają; każdy atom wraca niżej, wysyłając fotony o ściśle określonych energiach, czyli swoje linie.',
        'Rurki neonów zawierają gaz pod ciśnieniem około 3 do 20 torów (0,4 do 3 kPa) i zapalają się przy kilku tysiącach woltów.',
        'Pomarańczowa linia kryptonu-86 definiowała metr od 1960 do 1983 roku: 1 650 763,73 długości fali w próżni.',
        'W 1962 roku Neil Bartlett otrzymał pierwszy związek gazu szlachetnego, heksafluoroplatynian ksenonu: szlachetne, ale nie całkiem obojętne.',
        'Zanim rurkę neonu się napełni, odpompowuje się ją i „bombarduje”: rozgrzewa silnym prądem, żeby wypędzić zanieczyszczenia, które zepsułyby kolor.',
      ],
    },
    colours: { violet: 'fioletowego', blue: 'niebieskiego', cyan: 'niebieskozielonego', green: 'zielonego', yellow: 'żółtego', orange: 'pomarańczowego', red: 'czerwonego' },

    bench: {
      title: 'Stół do napełniania',
      screen: { kid: 'Wypompuj powietrze, wpuść gaz, włącz wysokie napięcie.', sci: 'Próżnia, potem kilka milibarów gazu, potem tysiące woltów: wyładowanie jarzeniowe.' },
      label: 'stół do napełniania',
      hints: { pump: 'Dotknij pompy', gas: 'Dotknij kolby z gazem', hv: 'Dotknij skrzynki wysokiego napięcia', off: 'Dotknij skrzynki wysokiego napięcia, żeby wyłączyć', wait: 'Zaczekaj chwilę' },
      buttons: { pump: 'Pompa', hv: 'Wysokie napięcie' },
      steps: {
        pumped: { kid: 'Wrrr! Pompa wysysa powietrze: wskazówka spada do 0. Teraz wybierz gaz: dotknij jego kolby.', sci: 'Wypompowane: manometr pokazuje 0 mbar. Teraz wpuść gaz: dotknij jego kolby.' },
        filled: { kid: 'W rurce jest już trochę {gas}u, dużo mniej niż powietrza, które tam było. Teraz wysokie napięcie: dotknij czarnej skrzynki ze znakiem błyskawicy.', sci: '{Gas} pod ciśnieniem około 10 mbar, setnej części ciśnienia powietrza. Teraz wysokie napięcie: dotknij transformatora.' },
        needPump: { kid: 'Zaczekaj: rurka jest jeszcze pełna powietrza! Gaz by się z nim zmieszał i nie świeciłby dobrze. Najpierw dotknij pompy.', sci: 'W instalacji jest jeszcze ciśnienie atmosferyczne: najpierw ją wypompuj, bo powietrze zepsułoby wyładowanie.' },
        noAir: { kid: 'Nic się nie dzieje: w rurce pełnej powietrza prąd nie może przejść, żeby ją rozświetlić. Najpierw wypompuj powietrze i wpuść gaz.', sci: 'Brak świecenia: przy ciśnieniu atmosferycznym napięcie przebicia jest dużo wyższe, niż daje transformator (prawo Paschena). Najpierw wypompuj i napełnij.' },
        noGas: { kid: 'Nic nie świeci: rurka jest pusta! Wybierz gaz: dotknij jego kolby.', sci: 'W próżni nie ma atomów do wzbudzenia: najpierw wpuść gaz.' },
        waiting: { kid: 'Rurka z {gas}em czeka na wysokie napięcie: dotknij czarnej skrzynki ze znakiem błyskawicy.', sci: 'Rurka z {gas}em czeka: włącz wysokie napięcie albo wypompuj gaz z powrotem.' },
      },
      hv: 'WYSOKIE NAPIĘCIE',
      air: 'atm',
      says: {
        He: { kid: 'Hel świeci delikatnym brzoskwiniowym różem.', sci: 'Hel: żółta linia 587,6 nm, czerwona 667,8 nm i fioletowa 447,1 nm razem dają brzoskwiniowy róż.' },
        Ne: { kid: 'Neon: słynny czerwonopomarańczowy kolor neonów!', sci: 'Neon: dziesiątki czerwonych i pomarańczowych linii między 585 a 750 nm.' },
        Ar: { kid: 'Argon świeci lawendowo, łagodnym fioletem.', sci: 'Argon: czerwone linie w pobliżu 700 nm i fioletowe w pobliżu 420 nm mieszają się w lawendę.' },
        Kr: { kid: 'Krypton świeci srebrzystą bielą.', sci: 'Krypton: żółta linia 587,1 nm, zielona 557,0 nm i grupa fioletowych linii razem wyglądają prawie na białe.' },
        Xe: { kid: 'Ksenon świeci na niebiesko.', sci: 'Ksenon: jego najsilniejsze widzialne linie są niebieskie, od 473 do 492 nm.' },
        all: { kid: 'Pięć rurek świeci naraz: tęcza gazów szlachetnych!', sci: 'Pięć rurek zapalonych: ta sama rurka i to samo napięcie, pięć różnych zestawów poziomów energii, pięć kolorów.' },
        off: { kid: 'Wszystko zgaszone. Zapalimy je jeszcze raz?', sci: 'Wyłączone: bez pola nic nie wzbudza atomów i świecenie od razu gaśnie.' },
      },
      panel: {
        kid: [
          { p: 'Twórcy neonów robią to tak: najpierw pompa wysysa całe powietrze ze szklanej rurki. Potem wpuszcza się trochę gazu szlachetnego, dużo mniej, niż było tam powietrza. Na koniec włącza się bardzo wysokie napięcie.' },
          { p: 'Prąd pędzi przez gaz, uderza w jego atomy i sprawia, że świecą. Każdy gaz szlachetny świeci własnym kolorem, zawsze tym samym.' },
          { list: ['Hel: brzoskwiniowy róż', 'Neon: czerwonopomarańczowy', 'Argon: lawendowy', 'Krypton: srebrzysta biel', 'Ksenon: niebieski'] },
          { p: 'Brakuje jednego gazu: radonu. Jest zamknięty w ołowianej skrzynce na końcu stołu. Idź zobaczyć, dlaczego!' },
        ],
        sci: [
          { p: 'Rurkę odpompowuje się do próżni, bombarduje (rozgrzewa silnym prądem, żeby wypędzić zanieczyszczenia), napełnia gazem szlachetnym pod ciśnieniem około 3 do 20 torów (0,4 do 3 kPa, kilka setnych atmosfery) i zatapia.' },
          { p: 'Tysiące woltów między elektrodami zapalają wyładowanie jarzeniowe. Przy niskim ciśnieniu elektron leci między zderzeniami dość daleko, by zebrać energię, która wzbudza atom; przy ciśnieniu atmosferycznym ta sama rurka potrzebowałaby dużo wyższego napięcia, żeby się zapalić (prawo Paschena).' },
          { p: 'Każdy wzbudzony atom wraca niżej, emitując fotony o energiach równych odstępom między jego własnymi poziomami, więc każdy gaz ma swój kolor.' },
          { rows: [['He', 'brzoskwiniowy róż: 587,6; 667,8; 447,1 nm'], ['Ne', 'czerwonopomarańczowy: wiele linii, od 585 do 750 nm'], ['Ar', 'lawendowy: 696,5; 706,7 nm oraz 415,9; 420,1 nm'], ['Kr', 'białawy: 587,1; 557,0 nm i fioletowe linie'], ['Xe', 'niebieski: od 473,4 do 492,3 nm']] },
        ],
      },
    },

    radon: {
      title: 'Radon za szkłem ołowiowym',
      label: 'skrzynka z radonem',
      verb: 'Dotknij licznika Geigera',
      button: 'Zmierz',
      screen: { kid: 'Nigdy w neonie: jest promieniotwórczy.', sci: 'Radon-222, okres półtrwania {half} dnia. Jego linie zmierzono w zatopionych rurkach (NIST).' },
      sign: 'RADIOAKTYWNE',
      lines: 'Linie radonu',
      says: {
        kid: 'Tik, tik, tik! Radonu nie widać, ale licznik słyszy, jak jego atomy się rozpadają.',
        sci: 'Każde tyknięcie to rozpad: radon-222 wysyła cząstki alfa; jego krótko żyjące produkty rozpadu dokładają promieniowanie beta i gamma.',
      },
      rows: { isotope: 'Izotop', half: 'Okres półtrwania', decay: 'Rozpad', density: 'Gęstość' },
      values: { isotope: 'radon-222', half: '{half} dnia', decay: 'alfa, do polonu-218', density: '{density} g/L przy 0 °C, najgęstszy gaz' },
      panel: {
        kid: [
          { p: 'Radon też jest gazem szlachetnym, ale nigdy nie trafia do neonu. Jest promieniotwórczy: jego atomy same się rozpadają i wystrzeliwują malutkie cząstki. Połowa każdej porcji radonu znika w niecałe cztery dni.' },
          { p: 'Oddychanie nim jest niebezpieczne: po paleniu papierosów to jedna z głównych przyczyn raka płuc. Wydostaje się z granitu, a w niektórych częściach północnej i środkowej Portugalii może gromadzić się w piwnicach, dlatego ludzie wietrzą domy.' },
          { p: 'Dlatego zostaje tutaj, za grubym szkłem ołowiowym, gdzie licznik wciąż go słyszy.' },
        ],
        sci: [
          { p: 'Nigdy w neonie: połowa radonu zniknęłaby w {half} dnia, produkty rozpadu (polon, ołów, bizmut) pokryłyby szkło, a pęknięta rurka uwolniłaby zagrożenie dla płuc. WHO uznaje radon za drugą przyczynę raka płuc po paleniu tytoniu; w Portugalii jest go najwięcej nad granitami północy i centrum kraju, na przykład w Guardzie.' },
          { p: 'Każda cząstka alfa to jądro helu. Rutherford i Royds udowodnili to w 1909 roku za pomocą spektroskopu: radon zatopiony w szklanej rurce o ściankach cieńszych niż 1/100 mm przepuszczał swoje cząstki alfa do zewnętrznej rurki; po 2 dniach słabo widać było żółtą linię helu, po 6 dniach wszystkie jego silniejsze linie.' },
        ],
      },
    },

    name: {
      title: 'Twoje imię w neonie',
      label: 'twoje imię w neonie',
      verb: 'Dotknij słowa na ścianie',
      screen: { kid: 'Wpisz słowo i zapal je w dowolnym gazie.', sci: 'Twoje słowo wygięte z rurki i zapalone w dowolnym gazie.' },
      overlay: {
        title: 'Napisz swoje imię w neonie',
        placeholder: 'Twoje imię',
        gas: 'Gaz',
        light: 'Zapal!',
        close: 'Zamknij',
        radon: 'Radonu tu nie ma: jest promieniotwórczy.',
      },
      says: { kid: '{word} w rurce z {gas}em: pięknie!', sci: '{word}: {metres} m rurki wypełnionej {gas}em.' },
      panel: {
        kid: [
          { p: 'Prawdziwe neonowe litery to szklane rurki wyginane ręcznie. Twórca neonów zmiękcza rurkę nad płomieniem i wygina ją, litera po literze, według rysunku na stole, a przy tym delikatnie dmucha do środka, żeby rurka nie spłaszczyła się na zakrętach.' },
          { p: 'Potem rurkę się opróżnia, napełnia gazem i zatapia, z metalową elektrodą na każdym końcu dla prądu. Zmień gaz, a zmieni się kolor: wypróbuj swoje imię we wszystkich pięciu!' },
        ],
        sci: [
          { p: 'Rurkę wygina się nad szerokim płomieniem (palnikiem taśmowym) na rysunku w naturalnej wielkości, a rzemieślnik dmucha przez wężyk, żeby przekrój został okrągły; na obu końcach wtapia się elektrody, a odcinki rurki między literami maluje się na czarno.' },
          { p: 'Transformator daje wysokie napięcie, które zapala wyładowanie, a potem ogranicza prąd; świecenie wypełnia rurkę od jednej elektrody do drugiej, więc każda litera świeci na całej długości.' },
          { p: 'Kolor zależy tylko od gazu (i ewentualnej powłoki lub barwionego szkła), a nie od kształtu: te same atomy dają te same linie w każdej rurce.' },
        ],
      },
    },

    spectrum: {
      title: 'Spektroskop',
      lines: 'długości fal',
      label: 'spektroskop',
      verb: 'Dotknij rurki na stojaku',
      screen: { kid: 'Pryzmat rozszczepia światło na kolory.', sci: 'Linie emisyjne w powietrzu, baza danych widm atomowych NIST.' },
      sun: 'Słońce, 1868',
      match: 'To hel!',
      footer: { kid: 'Każdy gaz ma swoje linie: odcisk palca ze światła.', sci: 'Obserwowane długości fal w powietrzu (nm), baza danych widm atomowych NIST.' },
      says: {
        He: { kid: 'Żółta linia helu jest dokładnie pod tajemniczą linią Słońca: tak w 1868 roku odkryto hel na Słońcu!', sci: 'He I 587,6 nm leży dokładnie pod linią D3 protuberancji z 1868 roku; linie D sodu leżą przy 589,0 i 589,6 nm.' },
        Ne: { kid: 'Neon: tłum czerwonych i pomarańczowych linii. Nic pod żółtą linią Słońca.', sci: 'Ne I: dziesiątki linii od 585 do 750 nm; najsilniejsze według NIST przy 692,9 i 703,2 nm.' },
        Ar: { kid: 'Argon: czerwone linie z jednej strony, fioletowe z drugiej. Razem wyglądają lawendowo.', sci: 'Ar I: 696,5; 706,7 i 738,4 nm w czerwieni, 415,9 i 420,1 nm w fiolecie.' },
        Kr: { kid: 'Krypton: jasna żółta linia, jasna zielona i grupa fioletowych.', sci: 'Kr I: 587,1 i 557,0 nm oraz fioletowa grupa od 427 do 450 nm. Blisko D3, ale nie na niej.' },
        Xe: { kid: 'Ksenon: rodzina niebieskich linii.', sci: 'Xe I: 473,4; 480,7; 491,7 i 492,3 nm w błękicie oraz czerwone linie w pobliżu 700 nm.' },
      },
      panel: {
        kid: [
          { p: 'Pryzmat rozszczepia światło rurki na kolory. Światło słoneczne dałoby gładką tęczę; gaz szlachetny daje tylko kilka jasnych linii, zawsze w tych samych miejscach. Każdy pierwiastek ma swój własny wzór linii, jak odcisk palca.' },
          { p: 'W 1868 roku, podczas zaćmienia, astronomowie spojrzeli tak na brzeg Słońca i zobaczyli żółtą linię, która nie pasowała do niczego na Ziemi. Nowy pierwiastek nazwali helem, od Heliosa, czyli Słońca. Na Ziemi hel znaleziono dopiero w 1895 roku.' },
          { p: 'Wypróbuj rurki po kolei: który gaz daje żółtą linię Słońca?' },
        ],
        sci: [
          { p: 'W wyładowaniu elektrony przenoszą atomy na poziomy wzbudzone; atom spadający na niższy poziom emituje foton o energii dokładnie równej różnicy poziomów, E = hc/λ. Każdy pierwiastek ma własne poziomy, więc i własne długości fal.' },
          { p: '18 sierpnia 1868 roku Pierre Janssen w Guntur w Indiach zobaczył podczas zaćmienia jasną żółtą linię w widmie protuberancji słonecznych; Norman Lockyer zobaczył ją w Anglii w październiku tego roku, bez zaćmienia. Leżała przy 587,6 nm, obok linii D sodu (589,0 i 589,6 nm), i nazwano ją D3; Lockyer i Edward Frankland nadali pierwiastkowi nazwę. William Ramsay znalazł hel na Ziemi w 1895 roku, w minerale uranu, kleweicie.' },
          { p: 'Pomarańczowa linia kryptonu-86 (605,78 nm w próżni) definiowała metr od 1960 do 1983 roku.' },
          { p: 'Linie: obserwowane długości fal w powietrzu z bazy danych widm atomowych NIST.' },
        ],
      },
    },

    atom: {
      title: 'Dlaczego świecą',
      label: 'atom {gas}u',
      hints: { fire: 'Dotknij atomu, żeby wystrzelić elektron', colour: 'Dotknij koloru na stopniach energii' },
      button: 'Wystrzel elektron',
      screen: { kid: 'Pełna zewnętrzna powłoka: nie ma się czego trzymać. Uderzenie daje światło.', sci: 'Zamknięta powłoka. Zderzenia ją wzbudzają, a ona oddaje energię jako światło: E = hc / długość fali.' },
      ladder: { title: 'Stopnie energii', ground: 'stan podstawowy', ion: 'jonizacja', photon: 'foton', pick: 'Dotknij koloru' },
      says: {
        kid: 'Bum! Elektron wskoczył stopień wyżej, spadł z powrotem i wysłał błysk {colour} światła.',
        sci: '{Gas}: przejście z {hi} eV na {lo} eV daje foton o energii {photon} eV, λ = {nm} nm.',
      },
      ionTitle: 'Pierwsza energia jonizacji',
      line: '{Gas}, linia {nm} nm: górny poziom {hi} eV, dolny poziom {lo} eV powyżej stanu podstawowego; foton niesie {photon} eV = hc/λ. Poziomy z bazy danych widm atomowych NIST.',
      panel: {
        kid: [
          { p: 'Spójrz na zewnętrzny pierścień atomu: jest pełny. Dwa elektrony w helu, osiem w pozostałych. Pełny zewnętrzny pierścień jest bardzo stabilny, więc te atomy nie muszą z nikim dzielić się elektronami ani ich wymieniać. Dlatego ich Atomki nie mają rąk!' },
          { p: 'Ponieważ prawie nigdy nie łączą się z innymi atomami, nazwano je „szlachetnymi”, jak złoto, które nie rdzewieje.' },
          { p: 'Ale prąd może podbić elektron na wyższy stopień. Szybko zeskakuje z powrotem i oddaje nadmiar energii jako błysk światła. Każdy krok w dół ma swój kolor, a miliardy błysków na sekundę tworzą świecenie rurki.' },
        ],
        sci: [
          { p: 'Zamknięte powłoki: 1s² w helu, ns² np⁶ w pozostałych. Mają najwyższe pierwsze energie jonizacji w swoich okresach i żadnych wolnych miejsc w oktecie, więc nie tworzą zwykłych wiązań. W 1962 roku Neil Bartlett otrzymał pierwszy związek gazu szlachetnego, heksafluoroplatynian ksenonu; potem przyszły fluorki ksenonu i kryptonu. Niemiecki chemik Hugo Erdmann nazwał je Edelgase, czyli gazami szlachetnymi, na wzór metali szlachetnych.' },
        ],
      },
    },

    history: {
      title: 'Neony przez lata',
      label: 'krótka historia',
      hints: { next: 'Dotknij napisu {year}', all: 'Dotknij napisu, żeby znów go usłyszeć' },
      buttons: { off: 'Wyłącz wszystkie' },
      today: 'DZIŚ',
      screen: { kid: '1898, 1910, dziś: dotknij napisu, żeby go zapalić.', sci: 'Od ciekłego powietrza (1898) do świateł miasta.' },
      captions: { 1898: 'Londyn: krypton, neon, ksenon', 1910: 'Paryż: pierwsze lampy neonowe', today: 'argon, rtęć i powłoka' },
      steps: {
        1898: {
          kid: '1898, Londyn: Ramsay i Travers schłodzili powietrze, aż stało się ciekłe, pozwolili mu powoli wrzeć i w kilka tygodni znaleźli trzy nowe gazy: krypton, neon i ksenon.',
          sci: 'Od maja do lipca 1898 roku: destylacja frakcyjna ciekłego powietrza daje Ramsayowi i Traversowi krypton (ukryty), neon (nowy) i ksenon (obcy).',
        },
        1910: {
          kid: '1910, Paryż: Georges Claude zapalił na salonie samochodowym dwie rury z neonem, każdą długą na 12 metrów. Pierwsze lampy neonowe!',
          sci: 'Od 3 do 18 grudnia 1910 roku: Georges Claude pokazuje dwie rury z neonem o długości 12 m na Salonie Samochodowym w Paryżu, w Grand Palais; jego pierwszy szyld sprzedano w 1912 roku golibrodzie.',
        },
        today: {
          kid: 'Dziś wiele „neonów” w ogóle nie ma neonu! Mają argon i kropelkę rtęci, a proszek na wewnętrznej stronie szkła zamienia ich niewidzialne światło w niebieskie, zielone, białe albo różowe.',
          sci: 'Dziś: argon z odrobiną rtęci. Ultrafiolet rtęci o długości 253,7 nm sprawia, że powłoka fluorescencyjna na szkle świeci własnym kolorem; wiele szyldów to dziś taśmy LED.',
        },
      },
      all: { kid: 'Od ciekłego powietrza do świateł każdego miasta!', sci: 'Ciekłe powietrze, 1898; pierwsze lampy neonowe, 1910; dziś powłoki fluorescencyjne i diody LED.' },
      off: { kid: 'Znowu ciemno. Zapalimy historię jeszcze raz?', sci: 'Wyłączone.' },
      panel: {
        kid: [
          { p: '1898: w Londynie William Ramsay i Morris Travers schłodzili powietrze tak bardzo, że stało się ciekłe, a potem pozwolili mu się powoli ogrzewać. Każdy gaz odparowywał w swojej temperaturze i w kilka tygodni znaleźli trzy nowe: krypton, neon i ksenon.' },
          { p: '1910: w Paryżu Georges Claude, który robił ciekłe powietrze, żeby sprzedawać z niego tlen, miał nadmiar neonu. Wpuścił go do długich szklanych rur i zapalił je na salonie samochodowym: pierwsze lampy neonowe.' },
          { p: 'Dziś wiele „neonów” w ogóle nie ma neonu. Mają argon z kropelką rtęci, a powłoka na wewnętrznej stronie szkła nadaje im kolor. Czerwień wciąż pochodzi z prawdziwego neonu.' },
          { p: 'Nazwy są greckie: neon znaczy nowy, krypton ukryty, ksenon obcy, argon leniwy, a hel pochodzi od Heliosa, czyli Słońca.' },
        ],
        sci: [
          { rows: [['1868', 'hel dostrzeżony na Słońcu (Janssen, Lockyer)'], ['1894', 'argon, pierwszy wyodrębniony gaz szlachetny (Rayleigh i Ramsay)'], ['1895', 'hel na Ziemi (Ramsay, w kleweicie)'], ['1898', 'krypton, neon, ksenon (Ramsay i Travers)'], ['1900', 'radon (Friedrich Ernst Dorn)'], ['1910', 'rury neonowe Georges’a Claude’a, Paryż'], ['1962', 'pierwszy związek gazu szlachetnego (Bartlett)']] },
          { p: 'Ciekłe powietrze rozdziela się według temperatur wrzenia: neon {Ne} K, argon {Ar} K, krypton {Kr} K, ksenon {Xe} K (azot wrze przy {N} K, tlen przy {O} K).' },
          { p: 'Firma Claude’a, Air Liquide, wytwarzała tlen z ciekłego powietrza i miała neonu pod dostatkiem. Dziś wiele szyldów to argon z odrobiną rtęci: jej ultrafiolet o długości 253,7 nm wzbudza powłokę fluorescencyjną (luminofor, po angielsku „phosphor”, który nie ma nic wspólnego z pierwiastkiem fosforem), a ta świeci własnym kolorem; przezroczyste rury z neonem wciąż dają klasyczną czerwień. Wiele szyldów to dziś diody LED.' },
        ],
      },
    },

    balloons: {
      title: 'Który balon się unosi?',
      label: 'balony',
      hints: { go: 'Dotknij balonu, żeby go puścić', back: 'Dotknij stołu, żeby znowu je przywiązać' },
      buttons: { all: 'Puść wszystkie', back: 'Przywiąż je znowu' },
      one: {
        He: { kid: 'Fiuu! Hel wystrzeliwuje pod sufit: jest około siedmiu razy lżejszy od powietrza.', sci: 'Hel, {rho} g/L wobec {air} g/L powietrza: balon wznosi się z prędkością do {speed} m/s.' },
        Ne: { kid: 'Neon unosi się powoli: jest lżejszy od powietrza, ale dużo cięższy od helu.', sci: 'Neon, {rho} g/L wobec {air} g/L powietrza: siła nośna ledwo pokonuje ciężar gumy, a balon wznosi się z prędkością do {speed} m/s.' },
        Ar: { kid: 'Argon spada na podłogę: jest cięższy od powietrza.', sci: 'Argon, {rho} g/L wobec {air} g/L powietrza: balon opada z prędkością do {speed} m/s.' },
        Kr: { kid: 'Krypton spada szybciej: jest prawie trzy razy cięższy od powietrza.', sci: 'Krypton, {rho} g/L wobec {air} g/L powietrza: balon opada z prędkością do {speed} m/s.' },
        Xe: { kid: 'Ksenon spada najszybciej: jest cztery i pół raza cięższy od powietrza!', sci: 'Ksenon, {rho} g/L wobec {air} g/L powietrza: balon opada z prędkością do {speed} m/s.' },
      },
      screen: { kid: 'Lżejsze od powietrza się unosi, cięższe opada.', sci: 'Siła nośna na litr: gęstość powietrza minus gęstość gazu. Powietrze: 1,293 g/L przy 0 °C.' },
      says: {
        kid: 'Hel wystrzeliwuje w górę, neon unosi się powoli, a argon, krypton i ksenon spadają: są cięższe od powietrza!',
        sci: 'Siła nośna na litr przy 0 °C: hel {He} g, neon {Ne} g; argon, krypton i ksenon są gęstsze od powietrza i opadają.',
      },
      back: { kid: 'Znowu przywiązane. Puścimy je jeszcze raz?', sci: 'Od nowa: pięć balonów po 11,5 L.' },
      air: 'powietrze',
      at: 'przy 0 °C i 1 atm',
      densities: 'Gęstości',
      panel: {
        kid: [
          { p: 'Balon unosi się, kiedy gaz w środku jest lżejszy od tej samej ilości powietrza. Hel jest bardzo lekki, więc wznosi się szybko. Neon też jest lżejszy od powietrza, więc jego balon unosi się, ale powoli.' },
          { p: 'Argon, krypton i ksenon są cięższe od powietrza: ich balony spadają na podłogę. Ksenon spada najszybciej: jest około cztery i pół raza cięższy od powietrza!' },
          { p: 'Radon jest najcięższym gazem ze wszystkich, ponad siedem razy cięższym od powietrza. Gromadzi się w piwnicach, ale nie dlatego, że jest ciężki: dom wciąga powietrze z gruntu pod sobą, a razem z nim radon.' },
        ],
        sci: [
          { p: 'W tej samej temperaturze i pod tym samym ciśnieniem litr każdego gazu zawiera tyle samo cząstek (Avogadro), więc gęstość idzie w parze z masą molową: He 4,0; Ne 20,2; powietrze około 29,0; Ar 39,9; Kr 83,8; Xe 131,3 g/mol.' },
          { p: 'Każdy balon ma tu 11,5 L w 2,5 g gumy: hel podnosi {liftHe} g, a neon {liftNe} g, więc oba się wznoszą; argon, krypton i ksenon ważą więcej niż powietrze, które wypierają, a opór powietrza wyznacza ich prędkość.' },
        ],
      },
    },
  },

  de: {
    nameCase: 'keep',
    back: 'Zurück zur Halle: {gas}',
    kicker: 'Die Neonwerkstatt',
    talkTo: 'Sprich mit',
    open: 'OFFEN',
    busy: { kid: 'Warte kurz: Es läuft noch!', sci: 'Einen Moment: Der letzte Durchgang läuft noch.' },
    greet: {
      kid: 'Willkommen in der Neonwerkstatt! Hier füllen wir Glasröhren mit Gasen wie mir und bringen sie zum Leuchten. Schalte die Röhren ein, schreib deinen Namen in Neon und zerleg das Licht mit dem Prisma.',
      sci: 'Die Neonwerkstatt: Glimmentladungen in den Edelgasen. Füll die Röhren und zünde sie, schreib deinen Namen in einem beliebigen davon und zerleg ihr Licht im Spektroskop.',
    },
    greetGas: {
      He: {
        kid: 'Willkommen in der Neonwerkstatt, in meinem Raum! Ich bin das Helium; mein Name kommt vom griechischen Wort für die Sonne, denn man hat mich auf der Sonne entdeckt, bevor mich irgendwer auf der Erde fand. In einer Glasröhre leuchte ich in einem zarten Pfirsichrosa. Schalte die Röhren ein und schreib deinen Namen mit mir an die Wand!',
        sci: 'Der Raum des Heliums in der Neonwerkstatt. Eine Heliumentladung leuchtet pfirsichrosa; ihre auffälligste Linie ist die gelbe bei 587,6 nm, die Linie, die 1868 das Helium im Spektrum der Sonne verriet. Füll die Röhren und zünde sie, schreib deinen Namen in einem beliebigen Gas und zerleg ihr Licht im Spektroskop.',
      },
      Ne: {
        kid: 'Willkommen in meiner Werkstatt: Neonschilder sind nach mir benannt! Mein Name kommt vom griechischen Wort für „neu“. Wenn ich leuchte, dann im berühmten Rotorange der Ladenschilder. Schalte die Röhren ein und schreib deinen Namen mit mir an die Wand!',
        sci: 'Der Raum des Neons: das Gas, das den Leuchtschildern ihren Namen gab. Sein Leuchten in Rotorange ist eine Menge von Linien von Gelborange bis Tiefrot; Georges Claude zeigte 1910 in Paris die ersten Neonlichter. Füll die Röhren und zünde sie, schreib deinen Namen in einem beliebigen Gas und zerleg ihr Licht im Spektroskop.',
      },
      Ar: {
        kid: 'Willkommen in meinem Raum der Werkstatt! Ich bin das Argon; mein Name kommt vom griechischen Wort für „faul“, weil ich fast nie reagiere. Alte Glühbirnen waren mit mir gefüllt. In einer Röhre leuchte ich blass lavendelfarben, und mit einem Tropfen Quecksilber mache ich die blauen Schilder.',
        sci: 'Der Raum des Argons. Argon macht 0,93% der Luft aus, das häufigste Edelgas hier; eine Entladung in reinem Argon leuchtet lavendelfarben bis violett, und Argon mit einem Tropfen Quecksilber und einer Beschichtung auf dem Glas ergibt die meisten „Neon“-Schilder, die nicht rot sind. Füll die Röhren und zünde sie, schreib deinen Namen in einem beliebigen Gas und zerleg ihr Licht im Spektroskop.',
      },
      Kr: {
        kid: 'Willkommen in meinem Raum! Ich bin das Krypton; mein Name kommt vom griechischen Wort für „verborgen“, weil es so wenig von mir in der Luft gibt. Wenn ich leuchte, bin ich fast weiß, mit einem Hauch Flieder. Schalte die Röhren ein und schreib deinen Namen mit mir an die Wand!',
        sci: 'Der Raum des Kryptons. Etwa ein Millionstel der Luft. Eine Kryptonentladung wirkt weißlich fliederfarben, durch starke Linien quer durch das Spektrum (Grün bei 557 nm, Gelb bei 587 nm); von 1960 bis 1983 war der Meter über eine orange Linie von Krypton-86 definiert (605,8 nm). Füll die Röhren und zünde sie, schreib deinen Namen in einem beliebigen Gas und zerleg ihr Licht im Spektroskop.',
      },
      Xe: {
        kid: 'Willkommen in meinem Raum! Ich bin das Xenon; mein Name kommt vom griechischen Wort für „Fremder“. Ich leuchte blauviolett, ich stecke in manchen Autoscheinwerfern, und manche Raumfahrzeuge fliegen mit Triebwerken, die meine Atome nach hinten hinausstoßen!',
        sci: 'Der Raum des Xenons: das seltenste stabile Edelgas der Luft, etwa 0,09 Teile pro Million. Eine Xenonentladung leuchtet blau bis violett; Xenon-Bogenlampen geben Kinoprojektoren ihr tageslichtähnliches Licht, und Ionentriebwerke wie die der NASA-Sonde Dawn liefen mit Xenon. Füll die Röhren und zünde sie, schreib deinen Namen in einem beliebigen Gas und zerleg ihr Licht im Spektroskop.',
      },
    },
    greetRadon: {
      kid: 'Willkommen in der Neonwerkstatt! Die anderen Gase leuchten in den Schildern, ich aber nicht: Ich bin in der Bleikiste am Ende der Werkbank eingeschlossen. Komm und sieh nach, warum.',
      sci: 'Die Neonwerkstatt. Radon ist das einzige Edelgas, das nie in ein Schild kommt: Seine Kiste steht am Ende der Füllbank, hinter Bleiglas.',
    },
    talk: {
      kid: [
        'Jedes Edelgas leuchtet in seiner eigenen Farbe: Neon rotorange, Argon lavendelfarben, Krypton weiß, Xenon blau, Helium pfirsichrosa.',
        'Viele „Neon“-Schilder, die nicht rot sind, enthalten gar kein Neon: nur Argon, einen Tropfen Quecksilber und eine Beschichtung auf dem Glas.',
        'Helium wurde 27 Jahre früher auf der Sonne entdeckt als auf der Erde!',
        'Edelgase haben volle äußere Schalen, deshalb halten sie nie Händchen mit anderen Atomen. Schau mich an: keine Hände!',
        'Schildermacher biegen jeden Buchstaben von Hand und machen die Glasröhre dafür in einer Flamme weich.',
      ],
      sci: [
        'Eine Glimmentladung: Freie Elektronen, vom Feld beschleunigt, stoßen mit Atomen zusammen und regen sie an; jedes Atom fällt zurück und gibt dabei Photonen mit genau bestimmten Energien ab, seine eigenen Linien.',
        'Leuchtröhren enthalten ihr Gas bei etwa 3 bis 20 Torr (0,4 bis 3 kPa) und zünden bei mehreren tausend Volt.',
        'Die orange Linie von Krypton-86 definierte von 1960 bis 1983 den Meter: 1 650 763,73 Wellenlängen im Vakuum.',
        '1962 stellte Neil Bartlett die erste Verbindung eines Edelgases her, ein Xenon-Hexafluoroplatinat: edel, aber nicht völlig träge.',
        'Bevor eine Leuchtröhre gefüllt wird, wird sie leer gepumpt und „bombardiert“: mit starkem Strom erhitzt, um Verunreinigungen auszutreiben, die die Farbe verderben würden.',
      ],
    },
    colours: { violet: 'violetten', blue: 'blauen', cyan: 'blaugrünen', green: 'grünen', yellow: 'gelben', orange: 'orangefarbenen', red: 'roten' },

    bench: {
      title: 'Die Füllbank',
      screen: { kid: 'Pump die Luft ab, lass ein Gas hinein, schalte die Hochspannung ein.', sci: 'Vakuum, dann ein paar Millibar Gas, dann Tausende Volt: eine Glimmentladung.' },
      label: 'die Füllbank',
      hints: { pump: 'Tippe auf die Pumpe', gas: 'Tippe auf einen Gaskolben', hv: 'Tippe auf den Hochspannungskasten', off: 'Tippe auf den Hochspannungskasten, um auszuschalten', wait: 'Warte einen Moment' },
      buttons: { pump: 'Pumpe', hv: 'Hochspannung' },
      steps: {
        pumped: { kid: 'Brrr! Die Pumpe saugt die Luft heraus: Der Zeiger fällt auf 0. Jetzt wähle ein Gas: Tippe auf seinen Kolben.', sci: 'Abgepumpt: Das Manometer zeigt 0 mbar. Jetzt lass ein Gas hinein: Tippe auf seinen Kolben.' },
        filled: { kid: 'Jetzt ist ein bisschen {gas} in der Röhre, viel weniger als die Luft, die vorher drin war. Jetzt die Hochspannung: Tippe auf den schwarzen Kasten mit dem Blitz.', sci: '{Gas} bei etwa 10 mbar, einem Hundertstel des Luftdrucks. Jetzt die Hochspannung: Tippe auf den Transformator.' },
        needPump: { kid: 'Warte: Die Röhre ist noch voller Luft! Das Gas würde sich mit ihr mischen und nicht richtig leuchten. Tippe zuerst auf die Pumpe.', sci: 'Die Leitung steht noch unter Luftdruck: Pump sie zuerst ab, sonst verdirbt die Luft die Entladung.' },
        noAir: { kid: 'Nichts passiert: In einer Röhre voller Luft kommt der Strom nicht durch, um sie leuchten zu lassen. Pump zuerst die Luft ab und lass ein Gas hinein.', sci: 'Kein Leuchten: Bei Atmosphärendruck liegt die Zündspannung weit über dem, was der Transformator liefert (Paschen-Gesetz). Erst abpumpen und füllen.' },
        noGas: { kid: 'Nichts leuchtet: Die Röhre ist leer! Wähle ein Gas: Tippe auf seinen Kolben.', sci: 'Im Vakuum gibt es keine Atome, die man anregen könnte: Lass zuerst ein Gas hinein.' },
        waiting: { kid: 'Das {gas} wartet auf die Hochspannung: Tippe auf den schwarzen Kasten mit dem Blitz.', sci: 'Die {gas}-Füllung wartet: Schalte die Hochspannung ein oder pump sie wieder ab.' },
      },
      hv: 'HOCHSPANNUNG',
      air: 'Luft',
      says: {
        He: { kid: 'Helium leuchtet in einem zarten Pfirsichrosa.', sci: 'Helium: Die gelbe Linie bei 587,6 nm, die rote bei 667,8 nm und die violette bei 447,1 nm wirken zusammen pfirsichrosa.' },
        Ne: { kid: 'Neon: das berühmte Rotorange der Leuchtschilder!', sci: 'Neon: Dutzende roter und orangefarbener Linien zwischen 585 und 750 nm.' },
        Ar: { kid: 'Argon leuchtet lavendelfarben, ein sanftes Violett.', sci: 'Argon: Rote Linien um 700 nm und violette um 420 nm mischen sich zu Lavendel.' },
        Kr: { kid: 'Krypton leuchtet silbrig weiß.', sci: 'Krypton: Die gelbe Linie bei 587,1 nm, die grüne bei 557,0 nm und eine Gruppe violetter Linien wirken fast weiß.' },
        Xe: { kid: 'Xenon leuchtet blau.', sci: 'Xenon: Seine stärksten sichtbaren Linien sind blau, von 473 bis 492 nm.' },
        all: { kid: 'Alle fünf leuchten: ein Regenbogen der Edelgase!', sci: 'Alle fünf an: dieselbe Röhre und dieselbe Spannung, fünf verschiedene Sätze von Energieniveaus, fünf Farben.' },
        off: { kid: 'Alles aus. Sollen wir sie wieder einschalten?', sci: 'Aus: Ohne Feld regt nichts die Atome an, und das Leuchten erlischt sofort.' },
      },
      panel: {
        kid: [
          { p: 'So machen es Schildermacher: Zuerst saugt eine Pumpe die ganze Luft aus der Glasröhre. Dann kommt ein bisschen Edelgas hinein, viel weniger als die Luft, die vorher darin war. Dann schalten sie eine sehr hohe Spannung ein.' },
          { p: 'Der Strom saust durch das Gas, stößt gegen seine Atome und bringt sie zum Leuchten. Jedes Edelgas leuchtet in seiner eigenen Farbe, immer in derselben.' },
          { list: ['Helium: Pfirsichrosa', 'Neon: Rotorange', 'Argon: Lavendel', 'Krypton: Silberweiß', 'Xenon: Blau'] },
          { p: 'Ein Gas fehlt: Radon. Es ist in der Bleikiste am Ende der Werkbank eingeschlossen. Geh hin und sieh nach, warum!' },
        ],
        sci: [
          { p: 'Die Röhre wird leer gepumpt, bombardiert (mit starkem Strom erhitzt, um Verunreinigungen auszutreiben), mit einem Edelgas bei etwa 3 bis 20 Torr (0,4 bis 3 kPa, ein paar Hundertstel einer Atmosphäre) gefüllt und zugeschmolzen.' },
          { p: 'Tausende Volt zwischen den Elektroden zünden eine Glimmentladung. Bei niedrigem Druck fliegt ein Elektron zwischen zwei Stößen weit genug, um die Energie zu sammeln, die ein Atom anregt; bei Atmosphärendruck bräuchte dieselbe Röhre eine viel höhere Spannung, um zu zünden (Paschen-Gesetz).' },
          { p: 'Jedes angeregte Atom fällt zurück und sendet Photonen mit den Energien zwischen seinen eigenen Niveaus aus, deshalb hat jedes Gas seine eigene Farbe.' },
          { rows: [['He', 'pfirsichrosa: 587,6; 667,8; 447,1 nm'], ['Ne', 'rotorange: viele Linien, 585 bis 750 nm'], ['Ar', 'lavendelfarben: 696,5; 706,7 nm und 415,9; 420,1 nm'], ['Kr', 'weißlich: 587,1; 557,0 nm und violette Linien'], ['Xe', 'blau: 473,4 bis 492,3 nm']] },
        ],
      },
    },

    radon: {
      title: 'Radon, hinter Bleiglas',
      label: 'die Radonkiste',
      verb: 'Tippe auf den Geigerzähler',
      button: 'Messen',
      screen: { kid: 'Nie in einem Schild: Es ist radioaktiv.', sci: 'Radon-222, Halbwertszeit {half} Tage. Seine Linien wurden in zugeschmolzenen Röhren gemessen (NIST).' },
      sign: 'RADIOAKTIV',
      lines: 'Die Linien des Radons',
      says: {
        kid: 'Klick, klick, klick! Radon kann man nicht sehen, aber der Zähler hört, wie seine Atome zerfallen.',
        sci: 'Jedes Klicken ist ein Zerfall: Radon-222 sendet Alphateilchen aus; seine kurzlebigen Tochterkerne fügen Beta- und Gammastrahlung hinzu.',
      },
      rows: { isotope: 'Isotop', half: 'Halbwertszeit', decay: 'Zerfall', density: 'Dichte' },
      values: { isotope: 'Radon-222', half: '{half} Tage', decay: 'Alpha, zu Polonium-218', density: '{density} g/L bei 0 °C, das dichteste Gas' },
      panel: {
        kid: [
          { p: 'Radon ist auch ein Edelgas, aber es kommt nie in ein Schild. Es ist radioaktiv: Seine Atome zerfallen von selbst und schießen winzige Teilchen heraus. Die Hälfte jeder Menge Radon ist in weniger als vier Tagen verschwunden.' },
          { p: 'Es einzuatmen ist gefährlich: Nach dem Rauchen ist es eine der Hauptursachen für Lungenkrebs. Es sickert aus Granit, und in Teilen von Nord- und Mittelportugal kann es sich in Kellern sammeln, deshalb lüften die Leute ihre Häuser.' },
          { p: 'Deshalb bleibt es hier, hinter dickem Bleiglas, wo der Zähler es trotzdem hören kann.' },
        ],
        sci: [
          { p: 'Nie in einem Schild: Sein Radon wäre in {half} Tagen zur Hälfte verschwunden, die Zerfallsprodukte (Polonium, Blei, Bismut) würden das Glas überziehen, und eine zerbrochene Röhre würde eine Gefahr für die Lunge freisetzen. Die WHO stuft Radon als zweithäufigste Ursache von Lungenkrebs nach dem Rauchen ein; in Portugal ist es über den Graniten des Nordens und der Mitte am höchsten, etwa in Guarda.' },
          { p: 'Jedes Alphateilchen ist ein Heliumkern. Rutherford und Royds bewiesen es 1909 mit einem Spektroskop: Radon, eingeschmolzen in eine Glasröhre mit Wänden unter 1/100 mm Dicke, ließ seine Alphateilchen in eine äußere Röhre durch; nach 2 Tagen war die gelbe Linie des Heliums schwach zu sehen, nach 6 Tagen alle seine stärkeren Linien.' },
        ],
      },
    },

    name: {
      title: 'Dein Name in Neon',
      label: 'dein Name in Neon',
      verb: 'Tippe auf das Wort an der Wand',
      screen: { kid: 'Tipp ein Wort ein und lass es in einem beliebigen Gas leuchten.', sci: 'Dein Wort, aus Röhren gebogen und in einem beliebigen Gas gezündet.' },
      overlay: {
        title: 'Schreib deinen Namen in Neon',
        placeholder: 'Dein Name',
        gas: 'Gas',
        light: 'Einschalten!',
        close: 'Schließen',
        radon: 'Radon bleibt draußen: Es ist radioaktiv.',
      },
      says: { kid: '{word} in {gas}: wunderschön!', sci: '{word}: {metres} m Röhre, mit {gas} gezündet.' },
      panel: {
        kid: [
          { p: 'Echte Neonbuchstaben sind von Hand gebogene Glasröhren. Der Schildermacher macht die Röhre über einer Flamme weich und biegt sie Buchstabe für Buchstabe nach einer Zeichnung auf dem Tisch, während er sanft in die Röhre bläst, damit sie in den Kurven nicht zusammengedrückt wird.' },
          { p: 'Dann wird die Röhre leer gepumpt, mit einem Gas gefüllt und verschlossen, mit einer Metallelektrode an jedem Ende für den Strom. Wechsle das Gas, und die Farbe wechselt: Probier deinen Namen in allen fünf!' },
        ],
        sci: [
          { p: 'Leuchtröhren werden über einer breiten Flamme (einem Bandbrenner) auf einer Vorlage in Originalgröße gebogen, während der Glasbläser durch einen Schlauch bläst, damit der Querschnitt rund bleibt; an beiden Enden werden Elektroden angeschmolzen, und die Röhrenstücke zwischen den Buchstaben werden schwarz gestrichen.' },
          { p: 'Der Transformator liefert die Hochspannung, die die Entladung zündet, und begrenzt dann den Strom; das Leuchten füllt die Röhre von einer Elektrode zur anderen, deshalb leuchtet jeder Buchstabe auf seiner ganzen Länge.' },
          { p: 'Die Farbe hängt nur vom Gas ab (und von einer Beschichtung oder farbigem Glas), nicht von der Form: Dieselben Atome geben in jeder Röhre dieselben Linien.' },
        ],
      },
    },

    spectrum: {
      title: 'Das Spektroskop',
      lines: 'Linien',
      label: 'das Spektroskop',
      verb: 'Tippe auf eine Röhre im Ständer',
      screen: { kid: 'Ein Prisma zerlegt das Licht in seine Farben.', sci: 'Emissionslinien in Luft, Atomspektren-Datenbank des NIST.' },
      sun: 'Sonne, 1868',
      match: 'Es ist Helium!',
      footer: { kid: 'Jedes Gas hat seine eigenen Linien: ein Fingerabdruck aus Licht.', sci: 'Beobachtete Wellenlängen in Luft (nm), Atomspektren-Datenbank des NIST.' },
      says: {
        He: { kid: 'Die gelbe Linie des Heliums liegt genau unter der rätselhaften Linie der Sonne: So wurde Helium 1868 auf der Sonne entdeckt!', sci: 'He I 587,6 nm liegt genau unter der D3-Linie der Protuberanzen von 1868; die D-Linien des Natriums liegen bei 589,0 und 589,6 nm.' },
        Ne: { kid: 'Neon: eine Menge roter und orangefarbener Linien. Nichts unter der gelben Linie der Sonne.', sci: 'Ne I: Dutzende Linien von 585 bis 750 nm; die stärksten laut NIST bei 692,9 und 703,2 nm.' },
        Ar: { kid: 'Argon: rote Linien auf der einen Seite, violette auf der anderen. Zusammen wirken sie lavendelfarben.', sci: 'Ar I: 696,5; 706,7 und 738,4 nm im Roten, 415,9 und 420,1 nm im Violetten.' },
        Kr: { kid: 'Krypton: eine helle gelbe Linie, eine helle grüne und eine Gruppe violetter.', sci: 'Kr I: 587,1 und 557,0 nm und eine violette Gruppe von 427 bis 450 nm. Nah an D3, aber nicht darauf.' },
        Xe: { kid: 'Xenon: eine Familie blauer Linien.', sci: 'Xe I: 473,4; 480,7; 491,7 und 492,3 nm im Blauen und rote Linien um 700 nm.' },
      },
      panel: {
        kid: [
          { p: 'Das Prisma zerlegt das Licht der Röhre in seine Farben. Sonnenlicht ergäbe einen lückenlosen Regenbogen; ein Edelgas gibt nur ein paar helle Linien, immer an denselben Stellen. Jedes Element hat sein eigenes Linienmuster, wie einen Fingerabdruck.' },
          { p: '1868 schauten Astronomen während einer Sonnenfinsternis so auf den Rand der Sonne und sahen eine gelbe Linie, die zu nichts auf der Erde passte. Sie nannten das neue Element Helium, nach Helios, der Sonne. Auf der Erde wurde Helium erst 1895 gefunden.' },
          { p: 'Probier die Röhren eine nach der anderen: Welches Gas macht die gelbe Linie der Sonne?' },
        ],
        sci: [
          { p: 'In der Entladung heben Elektronen Atome auf angeregte Niveaus; ein Atom, das auf ein tieferes Niveau fällt, sendet ein Photon mit genau der Energiedifferenz aus, E = hc/λ. Jedes Element hat seine eigenen Niveaus, also seine eigenen Wellenlängen.' },
          { p: '18. August 1868: Pierre Janssen sah in Guntur in Indien während der Sonnenfinsternis eine helle gelbe Linie im Spektrum der Sonnenprotuberanzen; Norman Lockyer sah sie im Oktober desselben Jahres in England, ohne Finsternis. Sie lag bei 587,6 nm, neben den D-Linien des Natriums (589,0 und 589,6 nm), und wurde D3 genannt; Lockyer und Edward Frankland benannten das Element. William Ramsay fand Helium 1895 auf der Erde, im Uranmineral Cleveit.' },
          { p: 'Die orange Linie von Krypton-86 (605,78 nm im Vakuum) definierte von 1960 bis 1983 den Meter.' },
          { p: 'Linien: beobachtete Wellenlängen in Luft aus der Atomspektren-Datenbank des NIST.' },
        ],
      },
    },

    atom: {
      title: 'Warum sie leuchten',
      label: 'das {gas}-Atom',
      hints: { fire: 'Tippe auf das Atom, um ein Elektron zu schießen', colour: 'Tippe auf eine Farbe an den Energiestufen' },
      button: 'Elektron schießen',
      screen: { kid: 'Eine volle äußere Schale: nichts zum Festhalten. Ein Stoß macht Licht.', sci: 'Eine abgeschlossene Schale. Stöße regen sie an, und sie gibt die Energie als Licht zurück: E = hc / Wellenlänge.' },
      ladder: { title: 'Energiestufen', ground: 'Grundzustand', ion: 'Ionisierung', photon: 'Photon', pick: 'Tippe auf eine Farbe' },
      says: {
        kid: 'Bumm! Ein Elektron ist eine Stufe hochgesprungen, zurückgefallen und hat einen {colour} Lichtblitz ausgesandt.',
        sci: '{Gas}: Der Fall von {hi} eV auf {lo} eV ergibt ein Photon von {photon} eV, λ = {nm} nm.',
      },
      ionTitle: 'Erste Ionisierungsenergie',
      line: '{Gas}, Linie {nm} nm: oberes Niveau {hi} eV, unteres Niveau {lo} eV über dem Grundzustand; das Photon trägt {photon} eV = hc/λ. Niveaus aus der Atomspektren-Datenbank des NIST.',
      panel: {
        kid: [
          { p: 'Schau dir den äußeren Ring des Atoms an: Er ist voll. Zwei Elektronen bei Helium, acht bei den anderen. Ein voller äußerer Ring ist sehr stabil, deshalb müssen diese Atome mit niemandem Elektronen teilen oder tauschen. Darum haben ihre Atomlinge keine Hände!' },
          { p: 'Weil sie sich fast nie mit anderen Atomen verbinden, nannte man sie „edel“, wie Gold, das nicht rostet.' },
          { p: 'Aber Strom kann ein Elektron eine Stufe höher stoßen. Bald springt es wieder hinunter und gibt die zusätzliche Energie als Lichtblitz ab. Jede Stufe nach unten hat ihre eigene Farbe, und Milliarden Blitze pro Sekunde ergeben das Leuchten der Röhre.' },
        ],
        sci: [
          { p: 'Abgeschlossene Schalen: 1s² bei Helium, ns² np⁶ bei den übrigen. Sie haben die höchsten ersten Ionisierungsenergien ihrer Perioden und keine freien Plätze im Oktett, deshalb bilden sie keine gewöhnlichen Bindungen. 1962 stellte Neil Bartlett die erste Edelgasverbindung her, Xenon-Hexafluoroplatinat; Fluoride von Xenon und Krypton folgten. Der deutsche Chemiker Hugo Erdmann nannte sie Edelgase, nach den Edelmetallen.' },
        ],
      },
    },

    history: {
      title: 'Neon im Lauf der Zeit',
      label: 'eine kurze Geschichte',
      hints: { next: 'Tippe auf das Schild {year}', all: 'Tippe auf ein Schild, um es noch einmal zu hören' },
      buttons: { off: 'Alle ausschalten' },
      today: 'HEUTE',
      screen: { kid: '1898, 1910, heute: Tippe auf ein Schild, um es einzuschalten.', sci: 'Von flüssiger Luft (1898) zu den Lichtern der Stadt.' },
      captions: { 1898: 'London: Krypton, Neon, Xenon', 1910: 'Paris: die ersten Neonlichter', today: 'Argon, Quecksilber und eine Beschichtung' },
      steps: {
        1898: {
          kid: '1898, London: Ramsay und Travers kühlten Luft ab, bis sie flüssig wurde, ließen sie langsam verdampfen und fanden in wenigen Wochen drei neue Gase: Krypton, Neon und Xenon.',
          sci: 'Mai bis Juli 1898: Die fraktionierte Destillation flüssiger Luft liefert Ramsay und Travers Krypton (verborgen), Neon (neu) und Xenon (Fremder).',
        },
        1910: {
          kid: '1910, Paris: Georges Claude ließ auf der Automobilausstellung zwei Neonröhren leuchten, jede 12 Meter lang. Die ersten Neonlichter!',
          sci: '3. bis 18. Dezember 1910: Georges Claude zeigt auf dem Pariser Automobilsalon im Grand Palais zwei 12 m lange Neonröhren; sein erstes Schild wurde 1912 an einen Barbier verkauft.',
        },
        today: {
          kid: 'Heute enthalten viele „Neon“-Schilder gar kein Neon! Sie enthalten Argon und einen Tropfen Quecksilber, und ein Pulver innen im Glas verwandelt ihr unsichtbares Licht in Blau, Grün, Weiß oder Rosa.',
          sci: 'Heute: Argon mit etwas Quecksilber. Das Ultraviolett des Quecksilbers bei 253,7 nm bringt eine Leuchtstoffschicht auf dem Glas in ihrer eigenen Farbe zum Leuchten; viele Schilder sind heute LED-Streifen.',
        },
      },
      all: { kid: 'Von flüssiger Luft zu den Lichtern jeder Stadt!', sci: 'Flüssige Luft, 1898; die ersten Neonlichter, 1910; heute Leuchtstoffe und LEDs.' },
      off: { kid: 'Wieder dunkel. Sollen wir die Geschichte noch einmal einschalten?', sci: 'Aus.' },
      panel: {
        kid: [
          { p: '1898: In London machten William Ramsay und Morris Travers Luft so kalt, dass sie flüssig wurde, und ließen sie dann langsam warm werden. Jedes Gas verdampfte bei seiner eigenen Temperatur, und in wenigen Wochen fanden sie drei neue: Krypton, Neon und Xenon.' },
          { p: '1910: In Paris hatte Georges Claude, der flüssige Luft herstellte, um ihren Sauerstoff zu verkaufen, Neon übrig. Er füllte es in lange Glasröhren und ließ sie auf der Automobilausstellung leuchten: die ersten Neonlichter.' },
          { p: 'Heute enthalten viele „Neon“-Schilder gar kein Neon. Sie enthalten Argon mit einem Tropfen Quecksilber, und eine Beschichtung innen im Glas gibt ihnen ihre Farbe. Rot kommt immer noch von echtem Neon.' },
          { p: 'Die Namen sind griechisch: Neon heißt neu, Krypton verborgen, Xenon Fremder, Argon faul, und Helium kommt von Helios, der Sonne.' },
        ],
        sci: [
          { rows: [['1868', 'Helium in der Sonne gesehen (Janssen, Lockyer)'], ['1894', 'Argon, das erste isolierte Edelgas (Rayleigh und Ramsay)'], ['1895', 'Helium auf der Erde (Ramsay, im Cleveit)'], ['1898', 'Krypton, Neon, Xenon (Ramsay und Travers)'], ['1900', 'Radon (Friedrich Ernst Dorn)'], ['1910', 'Georges Claudes Neonröhren, Paris'], ['1962', 'die erste Edelgasverbindung (Bartlett)']] },
          { p: 'Flüssige Luft trennt sich nach Siedepunkten: Neon {Ne} K, Argon {Ar} K, Krypton {Kr} K, Xenon {Xe} K (Stickstoff siedet bei {N} K, Sauerstoff bei {O} K).' },
          { p: 'Claudes Firma, Air Liquide, stellte Sauerstoff aus flüssiger Luft her und hatte Neon übrig. Heute sind viele Schilder Argon mit etwas Quecksilber: Dessen Ultraviolett bei 253,7 nm regt eine Leuchtstoffschicht an (der „Phosphor“ der Hersteller, der mit dem Element Phosphor nichts zu tun hat), die in ihrer eigenen Farbe leuchtet; klare Neonröhren geben immer noch das klassische Rot. Viele Schilder sind heute LEDs.' },
        ],
      },
    },

    balloons: {
      title: 'Welcher Ballon schwebt?',
      label: 'die Ballons',
      hints: { go: 'Tippe auf einen Ballon, um ihn loszulassen', back: 'Tippe auf den Tisch, um sie wieder festzubinden' },
      buttons: { all: 'Alle loslassen', back: 'Wieder festbinden' },
      one: {
        He: { kid: 'Wusch! Helium schießt bis zur Decke: Es ist etwa siebenmal leichter als Luft.', sci: 'Helium, {rho} g/L gegen {air} g/L für Luft: Der Ballon steigt mit bis zu {speed} m/s.' },
        Ne: { kid: 'Neon schwebt langsam nach oben: Es ist leichter als Luft, aber viel schwerer als Helium.', sci: 'Neon, {rho} g/L gegen {air} g/L für Luft: Der Auftrieb schlägt das Gummi nur knapp, und der Ballon steigt mit bis zu {speed} m/s.' },
        Ar: { kid: 'Argon fällt auf den Boden: Es ist schwerer als Luft.', sci: 'Argon, {rho} g/L gegen {air} g/L für Luft: Der Ballon sinkt mit bis zu {speed} m/s.' },
        Kr: { kid: 'Krypton fällt schneller: Es ist fast dreimal so schwer wie Luft.', sci: 'Krypton, {rho} g/L gegen {air} g/L für Luft: Der Ballon sinkt mit bis zu {speed} m/s.' },
        Xe: { kid: 'Xenon fällt am schnellsten: Es ist viereinhalbmal so schwer wie Luft!', sci: 'Xenon, {rho} g/L gegen {air} g/L für Luft: Der Ballon sinkt mit bis zu {speed} m/s.' },
      },
      screen: { kid: 'Leichter als Luft steigt, schwerer sinkt.', sci: 'Auftrieb pro Liter: die Dichte der Luft minus die des Gases. Luft: 1,293 g/L bei 0 °C.' },
      says: {
        kid: 'Helium schießt nach oben, Neon steigt langsam, und Argon, Krypton und Xenon fallen: Sie sind schwerer als Luft!',
        sci: 'Auftrieb pro Liter bei 0 °C: Helium {He} g, Neon {Ne} g; Argon, Krypton und Xenon sind dichter als Luft und sinken.',
      },
      back: { kid: 'Wieder festgebunden. Sollen wir sie noch einmal loslassen?', sci: 'Zurückgesetzt: fünf Ballons zu je 11,5 L.' },
      air: 'Luft',
      at: 'bei 0 °C und 1 atm',
      densities: 'Dichten',
      panel: {
        kid: [
          { p: 'Ein Ballon schwebt, wenn das Gas darin leichter ist als dieselbe Menge Luft. Helium ist sehr leicht, deshalb steigt es schnell. Neon ist auch leichter als Luft, also schwebt sein Ballon nach oben, langsam.' },
          { p: 'Argon, Krypton und Xenon sind schwerer als Luft: Ihre Ballons fallen auf den Boden. Xenon fällt am schnellsten: Es ist etwa viereinhalbmal so schwer wie Luft!' },
          { p: 'Radon ist das schwerste Gas von allen, mehr als siebenmal so schwer wie Luft. Es sammelt sich in Kellern, aber nicht, weil es schwer ist: Ein Haus saugt Luft aus dem Boden unter sich an, und mit ihr kommt das Radon.' },
        ],
        sci: [
          { p: 'Bei gleicher Temperatur und gleichem Druck enthält ein Liter jedes Gases gleich viele Teilchen (Avogadro), also folgt die Dichte der molaren Masse: He 4,0; Ne 20,2; Luft etwa 29,0; Ar 39,9; Kr 83,8; Xe 131,3 g/mol.' },
          { p: 'Jeder Ballon hier fasst 11,5 L in 2,5 g Gummi: Helium hebt {liftHe} g und Neon {liftNe} g, also steigen beide; Argon, Krypton und Xenon wiegen mehr als die Luft, die sie verdrängen, und der Luftwiderstand bestimmt ihr Tempo.' },
        ],
      },
    },
  },
}
