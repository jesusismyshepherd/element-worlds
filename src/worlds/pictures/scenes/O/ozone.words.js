// The words of oxygen's ozone station ("Earth's invisible sunscreen"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/O.js (the
// easel shows it). Each step is done by tapping its thing: `hints` are what the prompt shows as the next step,
// `verbs` the panels' buttons that do the same; `signs` are drawn in 3D (plain text, no subscripts); `chart`
// and `screen` are drawn on canvases. Placeholders: {mm}, {du}, {pct}.
//
// Sources (checked 2026-10-30): Halley's provisional monthly means and the Dobson season (British Antarctic
// Survey, J. Shanklin, legacy.bas.ac.uk/met/jds/ozone); Farman, Gardiner and Shanklin, Nature 315, 207-210
// (May 1985); NOAA's ozone hole pages (the 14 to 22 km layer, a pre-hole peak near 18 km) and its Ozone
// Depleting Gas Index (Antarctic EESC peak 4151 ppt in 2001 and 2002, 3583 ppt in 2024, the 1980 level
// expected around 2070); the WMO/UNEP Scientific Assessment of Ozone Depletion 2022 (1980 values around 2066
// over the Antarctic, 2045 the Arctic, 2040 elsewhere); UNEP's Ozone Secretariat (universal ratification on
// 16 September 2009, with the Vienna Convention); the US EPA (one chlorine atom can destroy more than 100,000
// ozone molecules); the 1995 Nobel Prize in Chemistry citation; the European Central Bank (1 euro coin 23.25
// mm across, 2.33 mm thick).
export const OZONE_WORDS = {
  en: {
    title: 'The ozone station',
    greet: {
      kid: "Brrr, welcome to Antarctica! This is a research station on the Brunt Ice Shelf, where people first noticed the ozone hole. I am oxygen: high in the sky, three of my atoms join up to make ozone, the Earth's invisible sunscreen. Three things to try, and the picture's story is on the easel.",
      sci: "The Brunt Ice Shelf, Antarctica, about 75.6° S, in spring. Halley station's Dobson readings, begun in 1956, revealed the ozone hole (Farman, Gardiner and Shanklin, Nature, May 1985). Here: how ozone is made, how it is measured, and how the world stopped its destruction. The picture's story is on the easel.",
    },
    talk: {
      kid: [
        'Ozone is three oxygen atoms stuck together: O3. The oxygen you breathe is two: O2. One atom more makes all the difference!',
        "The ice under your feet floats on the sea and slowly flows towards the ocean. That is why Halley's buildings stand on legs with skis: they can be towed to a new place.",
        'In winter the Sun does not rise here for about three months. Ozone meters need sunlight, so the measuring starts again each year at the end of August.',
      ],
      sci: [
        'Ozone, O₃, is bent (116.8°) with two equal bonds of about 128 pm, between a single and a double bond. Even in the ozone layer it is rare: only a few parts per million of the air.',
        'Halley stands on the floating Brunt Ice Shelf, which flows toward the Weddell Sea. Its present station, Halley VI, stands on hydraulic legs and skis, so it can climb above the drifting snow and be towed inland when the ice cracks.',
        "Over Antarctica the ozone layer sits lower than over the tropics, its peak near 18 km in NOAA's South Pole soundings; in winter the air there falls below −78 °C, cold enough for polar stratospheric clouds.",
      ],
    },
    months: ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'],
    monthsShort: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    eras: { e60: '1960s', e70: '1970s', e80: '1980s', e90: '1990s' },
    factory: {
      label: 'The ozone factory',
      title: 'Sunlight makes and breaks ozone',
      signs: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'visible', layer: 'the ozone layer', beads: 'UV beads', heat: 'warmth' },
      verbs: { C: 'A UV-C photon', B: 'A UV-B photon', A: 'A UV-A photon', V: 'Visible light', sun: 'All the sunlight at once', off: 'Beam off' },
      hints: { C: 'Tap the UV-C filter', B: 'Now tap the UV-B filter', A: 'Tap UV-A, then visible light', sun: 'Tap the sun for all of them', wave: 'Tap the screen and slide the wavelength' },
      wave: 'Wavelength of the beam',
      screen: { title: 'What reaches the snow?', x: 'wavelength (nm)', y: 'reaches the snow', beam: 'Beam', hint: 'Slide the wavelength in the panel' },
      bands: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'visible light' },
      reach: { none: 'none of it gets through', little: 'only a little gets through', half: 'about half gets through', most: 'most of it gets through', all: 'almost all gets through' },
      pct: 'about {pct} % passes the ozone',
      pctNone: 'less than 1 % passes',
      says: {
        C: {
          kid: 'Zap! The UV-C photon split an oxygen molecule into two atoms. Each atom grabbed another O2, and now there are two new ozone molecules!',
          sci: 'O₂ + light (λ < 242 nm) → 2 O, then O + O₂ + M → O₃ + M, twice: three O₂ became two O₃. M is any third molecule, N₂ or O₂, carrying the energy away.',
        },
        Cfull: {
          kid: 'Almost all the oxygen here is ozone now! This time an ozone molecule caught the UV-C.',
          sci: 'No O₂ left to split: O₃ absorbs UV-C too (the Hartley band, peaking near 255 nm).',
        },
        B: {
          kid: 'The UV-B was caught! An ozone molecule broke apart, and its loose atom joined an O2 again: the ozone is back, and the light became warmth.',
          sci: 'O₃ + light (λ < 320 nm) → O₂ + O, then O + O₂ + M → O₃ + M: the UV-B ends as heat. That is why the stratosphere grows warmer with height.',
        },
        Bbreak: {
          kid: 'This time the loose atom bumped into another ozone, and both became ordinary oxygen. Ozone is made and broken all the time.',
          sci: "O + O₃ → 2 O₂, Chapman's loss reaction: making and breaking balance into a steady amount of ozone.",
        },
        Bthrough: {
          kid: 'This UV-B photon slipped through to the snow! A little UV-B always gets down: it is the kind that gives sunburn.',
          sci: 'A small part of UV-B (280 to 315 nm) reaches the ground, mostly its longest waves: the band that causes sunburn and counts in the UV index.',
        },
        A: {
          kid: 'UV-A goes straight through the ozone and lands on the beads: look, they turn colourful! That is why you still need sun cream.',
          sci: "Ozone barely absorbs UV-A (315 to 400 nm); the beads' photochromic dye switches to a coloured form under it and back in the shade.",
        },
        V: {
          kid: 'Visible light gets through too, but the beads stay white: they only change colour in ultraviolet.',
          sci: 'Visible light: the weak Chappuis band (around 600 nm) takes only a few per cent. The beads need UV to switch.',
        },
        sun: {
          kid: 'All the sunlight at once: UV-C and UV-B are caught up in the ozone layer, UV-A and visible light come down to the snow.',
          sci: 'Sunlight sorted by the stratosphere: below 242 nm by O₂ and O₃, from 242 to 300 nm almost wholly by O₃, a growing share passing above 300 nm.',
        },
        beads: {
          kid: 'These are UV beads: white in the shade, they turn purple, blue and pink in ultraviolet light. You can buy them for experiments.',
          sci: 'UV-detecting beads hold photochromic dyes that switch to a coloured form under UV-A and switch back within minutes in the shade.',
        },
      },
      panel: {
        kid: [
          'Sunlight comes in many kinds. Ultraviolet (UV) has more energy than the light we see, and the strongest kinds harm living things.',
          'Up high, the strongest UV, UV-C, splits oxygen molecules (O2) into atoms, and each atom joins another O2 to make ozone (O3). Then ozone catches UV-B and breaks, and its atom joins up again: a factory that makes and breaks ozone all day long. Tap each filter and watch what reaches the beads.',
        ],
        sci: [
          'The Chapman cycle (Sydney Chapman, 1930): O₂ + light (λ < 242 nm) → 2 O; O + O₂ + M → O₃ + M; O₃ + light (λ < 320 nm) → O₂ + O; O + O₃ → 2 O₂. Ozone is made and destroyed continually; the balance sets how much there is.',
          'O₂ absorbs below 242 nm and O₃ strongly from about 200 to 310 nm (the Hartley band, peak near 255 nm), so no UV-C reaches the ground and only a small part of the UV-B, mostly its longest waves. UV-A (315 to 400 nm) and visible light mostly pass. The screen shows the share passing 300 DU of ozone with the sun overhead (ozone alone, no scattering).',
        ],
      },
    },
    measure: {
      label: 'Measuring the ozone',
      title: 'How much ozone is above us?',
      signs: { dobson: 'Dobson spectrophotometer', log: 'logbook', coin: '1 euro coin: 2.33 mm', scale: 'both 10 times bigger', balloon: 'ozonesonde' },
      chart: {
        month: 'Ozone above Halley, month by month',
        night: 'May to July: polar night, no Sun to measure by',
        du: 'Dobson units',
        ozone: 'ozone',
        profile: "The balloon's ozone",
        km: 'km',
        layer: 'ozone layer',
        before: 'before the hole',
        wait: 'Launch the balloon!',
      },
      verbs: { dobson: 'Squeeze the ozone', back: 'Let it spread out again', log: 'Another decade', balloon: 'Launch the balloon' },
      hints: { dobson: 'Tap the Dobson meter', balloon: 'Tap the balloon to launch it', log: 'Tap the logbook for another decade', more: 'Tap the chart for the next month' },
      slider: 'Month',
      rows: { month: 'Month', era: 'Decade', ozone: 'Ozone above Halley', thick: 'Squeezed to the ground' },
      says: {
        squeeze: {
          kid: 'Squeezed down to the air pressure at the ground, all the ozone above us makes a layer only {mm} mm thick. Look how it compares with the coin!',
          sci: '{du} DU: compressed to 0 °C and 1 atm, the whole column would be {mm} mm thick (1 DU = 0.01 mm, about 2.69 × 10²⁰ molecules per square metre).',
        },
        back: {
          kid: 'Up it goes again: the real ozone is spread over kilometres and kilometres of sky.',
          sci: 'Back to its real spread: even in the stratosphere ozone is only a few parts per million of the air.',
        },
        e60: {
          kid: 'The 1960s: before the ozone hole. In spring the ozone even went up.',
          sci: '1960s: October means near 300 DU, rising to about 350 in November as the polar vortex breaks up.',
        },
        e70: {
          kid: 'The 1970s: the spring ozone is already a little lower.',
          sci: '1970s: September and October means already some 20 DU lower than in the 1960s.',
        },
        e80: {
          kid: 'The 1980s: in spring a third of the ozone is gone. This is what the scientists at Halley noticed!',
          sci: '1980s: October means near 200 DU. Farman, Gardiner and Shanklin of the British Antarctic Survey reported the fall in Nature in May 1985.',
        },
        e90: {
          kid: 'The 1990s: every spring more than half of the ozone over Halley was gone!',
          sci: '1990s: October means near 140 DU; the lowest month, October 1993, had 122 DU.',
        },
        spring: {
          kid: 'September and October: spring, when the Sun comes back. In the years of the hole, that is exactly when the ozone fell.',
          sci: 'The loss needs sunlight on chlorine set loose in the dark: it runs from late August to October and stops as the polar vortex breaks up in November or December.',
        },
        launch: {
          kid: 'Off it goes! The balloon carries a little ozone meter up beyond 30 km and radios its readings back.',
          sci: 'An ozonesonde: in its electrochemical cell, ozone reacts with potassium iodide solution and the current gives the ozone. It rises about 5 m/s and bursts near 30 to 35 km.',
        },
        burst: {
          kid: 'Pop! The balloon burst, high up. On the chart, the big bulge is the ozone layer.',
          sci: 'A full profile: most of the ozone between about 12 and 28 km, its peak near 18 km.',
        },
        burstHole: {
          kid: 'Pop! Look at the chart: this spring the middle of the ozone layer is almost empty!',
          sci: "Spring loss: between about 14 and 22 km the ozone is nearly all gone, as NOAA's South Pole soundings show (90 % or more destroyed).",
        },
        coin: {
          kid: 'A real 1 euro coin is 2.33 mm thick: the ozone layer squeezed down is about that thin!',
          sci: '1 euro coin: 23.25 mm across, 2.33 mm thick. Both it and the slab are shown 10 times bigger.',
        },
      },
      panel: {
        kid: [
          'A Dobson spectrophotometer looks at the Sun and compares two kinds of ultraviolet light: one that ozone soaks up and one it lets through. The difference tells how much ozone is above.',
          'Squeezed to the pressure at the ground, all the ozone above us would be only about 3 mm thick! Slide through the months, look at another decade in the logbook, and launch a balloon to see how high the ozone is.',
        ],
        sci: [
          "G. M. B. Dobson's spectrophotometer (1920s) compares pairs of UV wavelengths, one strongly absorbed by ozone and one weakly (for example 305.5 and 325.4 nm); the ratio gives the total ozone column in Dobson units, 1 DU being 0.01 mm of pure ozone at 0 °C and 1 atm. Halley's record began in 1956; the instrument needs the Sun, so the season runs from late August to mid-April.",
          "In the 1980s October's mean fell from about 300 DU to below 200 DU: Joe Farman, Brian Gardiner and Jonathan Shanklin of the British Antarctic Survey reported it in Nature in May 1985. The chart shows Halley's provisional monthly means by decade (BAS, J. Shanklin); the balloon's profiles are a model scaled to those means.",
        ],
      },
    },
    fix: {
      label: 'The fix',
      title: 'How the world closed the hole',
      signs: {
        can: 'spray can',
        fridge: 'old fridge',
        cloud: 'icy cloud',
        sun: 'spring sun',
        treaty: 'MONTREAL PROTOCOL',
        treatyAll: 'on Substances that Deplete the Ozone Layer. Ratified by every country.',
        nobel: 'Nobel Prize in Chemistry 1995',
        diorama: '20 km above Antarctica',
        years: 'it takes years',
        nocfc: 'no CFC',
        count: 'ozone broken',
        max: '100,000',
      },
      chart: { title: 'Over the years at Halley', ozone: 'ozone in October', chlorine: 'chlorine up high', found: 'hole found', treaty: 'Montreal', back: 'back to 1980', expected: 'expected' },
      verbs: { can: 'Spray the can', fridge: 'Open the old fridge', cloud: 'Winter: the icy cloud', sun: 'Spring: the Sun comes back', treaty: 'The treaty', again: 'Start again' },
      hints: {
        cfc: 'Tap the spray can or the fridge',
        wait: 'Watch the CFC climb',
        cloud: 'Tap the icy cloud',
        sun: 'Tap the spring sun',
        watch: 'Watch the chlorine at work',
        treaty: 'Tap the treaty on the wall',
        years: 'Tap the chart and slide the years',
        end: 'Slide the years into the future',
      },
      slider: 'Year',
      rows: { year: 'Year', ozone: 'Ozone over Halley in October', chlorine: 'Chlorine and bromine up high' },
      says: {
        cfc: {
          kid: 'Psst! Out come CFCs, gases once used in spray cans and fridges. Down here they are harmless, but they slowly float all the way up.',
          sci: 'CFC-12, CCl₂F₂, a refrigerant and spray propellant: inert in the lower atmosphere, it lasts about a century and is carried up into the stratosphere over several years.',
        },
        arrive: {
          kid: 'Years later it reaches the ozone layer. Strong sunlight up here breaks the CFC, but its chlorine is soon locked away, for now.',
          sci: 'In the stratosphere short-wave UV breaks the CFC; its chlorine ends mostly in reservoir molecules, HCl and ClONO₂, which do not attack ozone.',
        },
        nocfc: {
          kid: 'There is no CFC up there yet: tap the spray can or the fridge first.',
          sci: 'No chlorine up there yet: release a CFC first.',
        },
        cloud: {
          kid: 'Polar winter: dark, and colder than −78 °C. Icy clouds form, and on their ice the locked-up chlorine is set loose as Cl2.',
          sci: 'Polar stratospheric clouds form below about −78 °C (195 K); on their particles HCl + ClONO₂ → Cl₂ + HNO₃, turning stored chlorine into Cl₂, which light can split.',
        },
        cloudDone: {
          kid: 'The chlorine is already loose. Now tap the spring sun!',
          sci: 'Already activated: now the Sun.',
        },
        cloudLate: {
          kid: 'Spring has come: the icy clouds are melting away.',
          sci: 'The vortex warms: the clouds are gone.',
        },
        sunFirst: {
          kid: 'First the chlorine must be set loose: tap the icy cloud.',
          sci: 'Light alone does little to HCl and ClONO₂: the clouds must activate the chlorine first.',
        },
        sunLate: {
          kid: 'This spring is over. Tap the spray can or the fridge for another year, or the treaty.',
          sci: "This spring's loss is over.",
        },
        spring: {
          kid: 'Spring sunshine splits the Cl2 into two chlorine atoms, and each one breaks ozone after ozone! One chlorine atom can break more than 100,000 ozone molecules before it is caught.',
          sci: 'Cl₂ + light → 2 Cl; Cl + O₃ → ClO + O₂ (twice); ClO + ClO → Cl₂O₂; Cl₂O₂ + light → 2 Cl + O₂. Net 2 O₃ → 3 O₂, the chlorine free again each time: the US EPA estimates one chlorine atom can destroy more than 100,000 ozone molecules.',
        },
        caught: {
          kid: 'At last the chlorine is caught again and locked away, but most of the ozone here is gone: that is the ozone hole.',
          sci: 'As the vortex warms, chlorine returns to HCl and ClONO₂; by then most of the ozone between about 14 and 22 km is gone.',
        },
        treaty: {
          kid: '1987: countries met in Montreal and agreed to stop making CFCs. Later every country in the world joined, the first time that had ever happened for a United Nations treaty!',
          sci: 'The Montreal Protocol, signed on 16 September 1987, and its amendments phased out CFCs, halons and other ozone-depleting gases (CFCs worldwide by 2010). On 16 September 2009 it and the Vienna Convention became the first treaties in UN history ratified by every country.',
        },
        canAfter: {
          kid: 'Not any more! Under the treaty, new sprays and fridges use other gases that do not harm the ozone.',
          sci: 'Replaced by hydrocarbons, HFCs and other gases; HFCs, strong greenhouse gases, are now being cut too, under the Kigali Amendment of 2016.',
        },
        again: {
          kid: 'A new year: over the summer the ozone came back. But the chlorine is still up there, so next spring the ozone is broken again, until the CFCs are gone.',
          sci: 'Each summer the ozone recovers; each spring the chlorine still in the stratosphere destroys it again, for as long as the CFCs last.',
        },
        oneAtATime: {
          kid: 'Let us follow this one first: tap the icy cloud or the spring sun.',
          sci: 'One CFC at a time: follow this one through winter and spring.',
        },
        future: {
          kid: 'Look at the globe: the hole is healing! Over Antarctica, the ozone should be back to how it was in 1980 around 2066.',
          sci: "The 2022 WMO/UNEP assessment: with today's rules, Antarctic ozone returns to its 1980 values around 2066, the Arctic's around 2045, the rest of the world's around 2040.",
        },
        end: {
          kid: 'People noticed the danger, agreed what to do, and fixed it, all together. That is a story worth remembering!',
          sci: 'Molina and Rowland warned about CFCs in 1974; with Paul Crutzen they shared the 1995 Nobel Prize in Chemistry. Measurements, theory and a treaty kept by every country: the ozone layer is recovering.',
        },
        globe: {
          kid: 'This globe shows the ozone over Antarctica in October, in the year on the slider. Dark means a hole.',
          sci: "The hole drawn from Halley's October mean in the chosen year: measured to 2025, expected after.",
        },
        nobel: {
          kid: 'Mario Molina, Sherwood Rowland and Paul Crutzen won the Nobel Prize for explaining how ozone is made and destroyed.',
          sci: 'Nobel Prize in Chemistry 1995: Paul J. Crutzen, Mario J. Molina and F. Sherwood Rowland, for their work in atmospheric chemistry, particularly concerning the formation and decomposition of ozone.',
        },
      },
      panel: {
        kid: [
          'CFCs were handy gases for spray cans and fridges. Years after they float up, the cold dark polar winter makes icy clouds that set their chlorine loose, and when the Sun comes back in spring, each chlorine atom breaks ozone after ozone. That is the ozone hole.',
          'In 1987 countries agreed in Montreal to stop making CFCs, and in the end every country joined. Slide the years: the chlorine slowly goes away and the hole heals, back to how it was in 1980 around 2066.',
        ],
        sci: [
          'Chlorine from CFCs (and bromine from halons) is stored as HCl and ClONO₂ until polar stratospheric clouds, below about −78 °C, turn it into Cl₂. Spring sunlight then drives the ClO dimer cycle (described by Luisa and Mario Molina in 1987), destroying ozone fastest between about 14 and 22 km.',
          "Under the Montreal Protocol (1987) the gases were phased out. Chlorine and bromine over Antarctica (as EESC, NOAA) peaked in 2001 and 2002 at about 4.15 ppb; by 2024 they had fallen about a quarter of the way back to the 1980 level, expected around 2070. The 2022 WMO/UNEP assessment expects Antarctic ozone back at 1980 values around 2066. The chart: Halley's October means (BAS Dobson; satellite where the Dobson has gaps) and NOAA's EESC, the years before 1980 sketched.",
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A estação do ozono',
    greet: {
      kid: 'Brrr, bem-vindo à Antártida! Isto é uma estação de investigação na Plataforma de Gelo Brunt, onde as pessoas repararam pela primeira vez no buraco do ozono. Eu sou o oxigénio: lá no alto do céu, três dos meus átomos juntam-se para formar ozono, o protetor solar invisível da Terra. Há três coisas para experimentar, e a história da imagem está no cavalete.',
      sci: 'A Plataforma de Gelo Brunt, na Antártida, a cerca de 75,6° S, na primavera. As medições Dobson da estação Halley, começadas em 1956, revelaram o buraco do ozono (Farman, Gardiner e Shanklin, Nature, maio de 1985). Aqui: como se forma o ozono, como se mede, e como o mundo travou a sua destruição. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O ozono são três átomos de oxigénio agarrados: O3. O oxigénio que respiras são dois: O2. Um átomo a mais faz toda a diferença!',
        'O gelo debaixo dos teus pés flutua no mar e desliza devagar para o oceano. Por isso os edifícios de Halley estão em pernas com esquis: podem ser rebocados para outro sítio.',
        'No inverno, o Sol não nasce aqui durante cerca de três meses. Os medidores de ozono precisam de luz do Sol, por isso as medições recomeçam todos os anos no fim de agosto.',
      ],
      sci: [
        'O ozono, O₃, é uma molécula angular (116,8°) com duas ligações iguais de cerca de 128 pm, entre uma ligação simples e uma dupla. Mesmo na camada de ozono é raro: só umas poucas partes por milhão do ar.',
        'Halley está sobre a Plataforma de Gelo Brunt, que flutua e desliza para o mar de Weddell. A estação atual, Halley VI, assenta em pernas hidráulicas e esquis, para subir acima da neve acumulada e ser rebocada para o interior quando o gelo racha.',
        'Sobre a Antártida, a camada de ozono fica mais baixa do que nos trópicos, com o máximo perto dos 18 km nas sondagens da NOAA no Polo Sul; no inverno o ar lá desce abaixo de −78 °C, frio que chegue para nuvens estratosféricas polares.',
      ],
    },
    months: ['agosto', 'setembro', 'outubro', 'novembro', 'dezembro', 'janeiro', 'fevereiro', 'março', 'abril'],
    monthsShort: ['ago', 'set', 'out', 'nov', 'dez', 'jan', 'fev', 'mar', 'abr'],
    eras: { e60: 'anos 1960', e70: 'anos 1970', e80: 'anos 1980', e90: 'anos 1990' },
    factory: {
      label: 'A fábrica de ozono',
      title: 'A luz do Sol faz e desfaz ozono',
      signs: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'visível', layer: 'a camada de ozono', beads: 'contas UV', heat: 'calor' },
      verbs: { C: 'Um fotão UV-C', B: 'Um fotão UV-B', A: 'Um fotão UV-A', V: 'Luz visível', sun: 'Toda a luz do Sol de uma vez', off: 'Desligar o feixe' },
      hints: { C: 'Toca no filtro UV-C', B: 'Agora toca no filtro UV-B', A: 'Toca no UV-A e depois na luz visível', sun: 'Toca no sol para todos de uma vez', wave: 'Toca no ecrã e desliza o comprimento de onda' },
      wave: 'Comprimento de onda do feixe',
      screen: { title: 'O que chega à neve?', x: 'comprimento de onda (nm)', y: 'chega à neve', beam: 'Feixe', hint: 'Desliza o comprimento de onda no painel' },
      bands: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'luz visível' },
      reach: { none: 'nada passa', little: 'passa só um pouco', half: 'passa cerca de metade', most: 'passa a maior parte', all: 'passa quase tudo' },
      pct: 'cerca de {pct} % atravessa o ozono',
      pctNone: 'atravessa menos de 1 %',
      says: {
        C: {
          kid: 'Zás! O fotão UV-C partiu uma molécula de oxigénio em dois átomos. Cada átomo agarrou outro O2, e agora há duas moléculas de ozono novas!',
          sci: 'O₂ + luz (λ < 242 nm) → 2 O, depois O + O₂ + M → O₃ + M, duas vezes: três O₂ deram dois O₃. M é uma terceira molécula qualquer, N₂ ou O₂, que leva a energia.',
        },
        Cfull: {
          kid: 'Quase todo o oxigénio aqui já é ozono! Desta vez foi uma molécula de ozono que apanhou o UV-C.',
          sci: 'Não há O₂ para partir: o O₃ também absorve UV-C (a banda de Hartley, com máximo perto dos 255 nm).',
        },
        B: {
          kid: 'O UV-B foi apanhado! Uma molécula de ozono partiu-se, e o átomo solto juntou-se outra vez a um O2: o ozono voltou, e a luz virou calor.',
          sci: 'O₃ + luz (λ < 320 nm) → O₂ + O, depois O + O₂ + M → O₃ + M: o UV-B acaba em calor. É por isso que a estratosfera aquece com a altitude.',
        },
        Bbreak: {
          kid: 'Desta vez o átomo solto chocou com outro ozono, e os dois viraram oxigénio comum. O ozono é feito e desfeito o tempo todo.',
          sci: 'O + O₃ → 2 O₂, a reação de perda de Chapman: a produção e a destruição equilibram-se numa quantidade estável de ozono.',
        },
        Bthrough: {
          kid: 'Este fotão UV-B escapou até à neve! Um pouco de UV-B chega sempre cá abaixo: é o que provoca escaldões.',
          sci: 'Uma pequena parte do UV-B (280 a 315 nm) chega ao solo, sobretudo as ondas mais longas: a banda que causa escaldões e conta para o índice UV.',
        },
        A: {
          kid: 'O UV-A atravessa o ozono e chega às contas: olha, ficam coloridas! É por isso que continuas a precisar de protetor solar.',
          sci: 'O ozono quase não absorve UV-A (315 a 400 nm); o corante fotocrómico das contas muda para uma forma colorida e volta atrás à sombra.',
        },
        V: {
          kid: 'A luz visível também passa, mas as contas ficam brancas: só mudam de cor com ultravioleta.',
          sci: 'Luz visível: a fraca banda de Chappuis (perto dos 600 nm) só tira uns poucos por cento. As contas precisam de UV para mudar.',
        },
        sun: {
          kid: 'Toda a luz do Sol de uma vez: o UV-C e o UV-B ficam presos lá em cima na camada de ozono, o UV-A e a luz visível descem até à neve.',
          sci: 'A luz do Sol triada pela estratosfera: abaixo de 242 nm pelo O₂ e pelo O₃, de 242 a 300 nm quase toda pelo O₃, e acima de 300 nm passa uma parte cada vez maior.',
        },
        beads: {
          kid: 'Estas são contas UV: brancas à sombra, ficam roxas, azuis e cor-de-rosa com luz ultravioleta. Vendem-se para fazer experiências.',
          sci: 'As contas detetoras de UV têm corantes fotocrómicos que mudam para uma forma colorida com UV-A e voltam ao normal em poucos minutos, à sombra.',
        },
      },
      panel: {
        kid: [
          'A luz do Sol tem muitos tipos. O ultravioleta (UV) tem mais energia do que a luz que vemos, e os tipos mais fortes fazem mal aos seres vivos.',
          'Lá no alto, o UV mais forte, o UV-C, parte as moléculas de oxigénio (O2) em átomos, e cada átomo junta-se a outro O2 para formar ozono (O3). Depois o ozono apanha o UV-B e parte-se, e o seu átomo volta a juntar-se: uma fábrica que faz e desfaz ozono o dia todo. Toca em cada filtro e vê o que chega às contas.',
        ],
        sci: [
          'O ciclo de Chapman (Sydney Chapman, 1930): O₂ + luz (λ < 242 nm) → 2 O; O + O₂ + M → O₃ + M; O₃ + luz (λ < 320 nm) → O₂ + O; O + O₃ → 2 O₂. O ozono é feito e destruído sem parar; o equilíbrio decide quanto há.',
          'O O₂ absorve abaixo de 242 nm e o O₃ fortemente de cerca de 200 a 310 nm (a banda de Hartley, com máximo perto dos 255 nm): nenhum UV-C chega ao solo, e do UV-B só uma pequena parte, sobretudo as ondas mais longas. O UV-A (315 a 400 nm) e a luz visível passam quase todos. O ecrã mostra a parte que atravessa 300 DU de ozono com o Sol a pino (só o ozono, sem dispersão).',
        ],
      },
    },
    measure: {
      label: 'Medir o ozono',
      title: 'Quanto ozono há por cima de nós?',
      signs: { dobson: 'espectrofotómetro de Dobson', log: 'livro de registos', coin: 'moeda de 1 euro: 2,33 mm', scale: 'ambos 10 vezes maiores', balloon: 'ozonossonda' },
      chart: {
        month: 'O ozono sobre Halley, mês a mês',
        night: 'De maio a julho: noite polar, sem Sol para medir',
        du: 'unidades Dobson',
        ozone: 'ozono',
        profile: 'O ozono do balão',
        km: 'km',
        layer: 'camada de ozono',
        before: 'antes do buraco',
        wait: 'Lança o balão!',
      },
      verbs: { dobson: 'Comprimir o ozono', back: 'Deixá-lo espalhar-se outra vez', log: 'Outra década', balloon: 'Lançar o balão' },
      hints: { dobson: 'Toca no medidor Dobson', balloon: 'Toca no balão para o lançar', log: 'Toca no livro de registos para outra década', more: 'Toca no gráfico para o mês seguinte' },
      slider: 'Mês',
      rows: { month: 'Mês', era: 'Década', ozone: 'Ozono sobre Halley', thick: 'Comprimido ao nível do solo' },
      says: {
        squeeze: {
          kid: 'Comprimido à pressão do ar ao nível do solo, todo o ozono por cima de nós faz uma camada com só {mm} mm de espessura. Compara com a moeda!',
          sci: '{du} DU: comprimida a 0 °C e 1 atm, a coluna inteira teria {mm} mm de espessura (1 DU = 0,01 mm, cerca de 2,69 × 10²⁰ moléculas por metro quadrado).',
        },
        back: {
          kid: 'Lá vai ele outra vez para cima: o ozono verdadeiro está espalhado por quilómetros e quilómetros de céu.',
          sci: 'De volta à sua distribuição real: mesmo na estratosfera, o ozono é só umas poucas partes por milhão do ar.',
        },
        e60: {
          kid: 'Anos 1960: antes do buraco do ozono. Na primavera, o ozono até subia.',
          sci: 'Anos 1960: médias de outubro perto de 300 DU, a subir para cerca de 350 em novembro, quando o vórtice polar se desfaz.',
        },
        e70: {
          kid: 'Anos 1970: o ozono da primavera já está um pouco mais baixo.',
          sci: 'Anos 1970: médias de setembro e outubro já cerca de 20 DU abaixo das dos anos 1960.',
        },
        e80: {
          kid: 'Anos 1980: na primavera, falta um terço do ozono. Foi isto que os cientistas de Halley notaram!',
          sci: 'Anos 1980: médias de outubro perto de 200 DU. Farman, Gardiner e Shanklin, do British Antarctic Survey, publicaram a descida na Nature em maio de 1985.',
        },
        e90: {
          kid: 'Anos 1990: todas as primaveras, mais de metade do ozono sobre Halley desaparecia!',
          sci: 'Anos 1990: médias de outubro perto de 140 DU; o mês mais baixo, outubro de 1993, teve 122 DU.',
        },
        spring: {
          kid: 'Setembro e outubro: a primavera, quando o Sol volta. Nos anos do buraco, foi exatamente aí que o ozono caiu.',
          sci: 'A perda precisa de luz sobre o cloro libertado no escuro: vai do fim de agosto a outubro e para quando o vórtice polar se desfaz, em novembro ou dezembro.',
        },
        launch: {
          kid: 'Lá vai! O balão leva um pequeno medidor de ozono a mais de 30 km de altura e envia as medições por rádio.',
          sci: 'Uma ozonossonda: na sua célula eletroquímica, o ozono reage com uma solução de iodeto de potássio e a corrente dá o ozono. Sobe cerca de 5 m/s e rebenta perto dos 30 a 35 km.',
        },
        burst: {
          kid: 'Pum! O balão rebentou lá no alto. No gráfico, a grande barriga é a camada de ozono.',
          sci: 'Um perfil completo: a maior parte do ozono entre cerca de 12 e 28 km, com o máximo perto dos 18 km.',
        },
        burstHole: {
          kid: 'Pum! Olha para o gráfico: nesta primavera, o meio da camada de ozono está quase vazio!',
          sci: 'Perda de primavera: entre cerca de 14 e 22 km quase não resta ozono, como mostram as sondagens da NOAA no Polo Sul (90 % ou mais destruído).',
        },
        coin: {
          kid: 'Uma moeda de 1 euro verdadeira tem 2,33 mm de espessura: a camada de ozono comprimida é mais ou menos assim fina!',
          sci: 'Moeda de 1 euro: 23,25 mm de diâmetro, 2,33 mm de espessura. Ela e a placa aparecem 10 vezes maiores.',
        },
      },
      panel: {
        kid: [
          'Um espectrofotómetro de Dobson olha para o Sol e compara dois tipos de luz ultravioleta: um que o ozono absorve e outro que deixa passar. A diferença diz quanto ozono há por cima.',
          'Comprimido à pressão do solo, todo o ozono por cima de nós teria só cerca de 3 mm de espessura! Percorre os meses, vê outra década no livro de registos, e lança um balão para ver a que altura está o ozono.',
        ],
        sci: [
          'O espectrofotómetro de G. M. B. Dobson (anos 1920) compara pares de comprimentos de onda UV, um muito absorvido pelo ozono e outro pouco (por exemplo 305,5 e 325,4 nm); a razão dá a coluna total de ozono em unidades Dobson, sendo 1 DU igual a 0,01 mm de ozono puro a 0 °C e 1 atm. O registo de Halley começou em 1956; o aparelho precisa do Sol, por isso a época vai do fim de agosto a meados de abril.',
          'Nos anos 1980, a média de outubro caiu de cerca de 300 DU para menos de 200 DU: Joe Farman, Brian Gardiner e Jonathan Shanklin, do British Antarctic Survey, publicaram-no na Nature em maio de 1985. O gráfico mostra as médias mensais provisórias de Halley por década (BAS, J. Shanklin); os perfis do balão são um modelo ajustado a essas médias.',
        ],
      },
    },
    fix: {
      label: 'A solução',
      title: 'Como o mundo fechou o buraco',
      signs: {
        can: 'lata de spray',
        fridge: 'frigorífico antigo',
        cloud: 'nuvem gelada',
        sun: 'sol da primavera',
        treaty: 'PROTOCOLO DE MONTREAL',
        treatyAll: 'relativo às substâncias que empobrecem a camada de ozono. Ratificado por todos os países.',
        nobel: 'Prémio Nobel da Química 1995',
        diorama: '20 km acima da Antártida',
        years: 'demora anos',
        nocfc: 'sem CFC',
        count: 'ozono partido',
        max: '100 000',
      },
      chart: { title: 'Ao longo dos anos em Halley', ozone: 'ozono em outubro', chlorine: 'cloro lá no alto', found: 'buraco descoberto', treaty: 'Montreal', back: 'como em 1980', expected: 'previsto' },
      verbs: { can: 'Usar a lata de spray', fridge: 'Abrir o frigorífico antigo', cloud: 'Inverno: a nuvem gelada', sun: 'Primavera: o Sol volta', treaty: 'O tratado', again: 'Recomeçar' },
      hints: {
        cfc: 'Toca na lata de spray ou no frigorífico',
        wait: 'Vê o CFC a subir',
        cloud: 'Toca na nuvem gelada',
        sun: 'Toca no sol da primavera',
        watch: 'Vê o cloro a trabalhar',
        treaty: 'Toca no tratado na parede',
        years: 'Toca no gráfico e desliza os anos',
        end: 'Desliza os anos até ao futuro',
      },
      slider: 'Ano',
      rows: { year: 'Ano', ozone: 'Ozono sobre Halley em outubro', chlorine: 'Cloro e bromo lá no alto' },
      says: {
        cfc: {
          kid: 'Psst! Saem CFC, gases que se usavam em latas de spray e frigoríficos. Cá em baixo são inofensivos, mas sobem devagarinho até lá acima.',
          sci: 'CFC-12, CCl₂F₂, refrigerante e propulsor de sprays: inerte na baixa atmosfera, dura cerca de um século e é levado até à estratosfera ao longo de vários anos.',
        },
        arrive: {
          kid: 'Anos depois chega à camada de ozono. A luz forte do Sol cá em cima parte o CFC, mas o seu cloro fica logo guardado, por agora.',
          sci: 'Na estratosfera, o UV de onda curta parte o CFC; o seu cloro acaba sobretudo em moléculas reservatório, HCl e ClONO₂, que não atacam o ozono.',
        },
        nocfc: {
          kid: 'Ainda não há CFC lá em cima: primeiro toca na lata de spray ou no frigorífico.',
          sci: 'Ainda não há cloro lá em cima: liberta primeiro um CFC.',
        },
        cloud: {
          kid: 'Inverno polar: escuro, e mais frio do que −78 °C. Formam-se nuvens geladas, e no seu gelo o cloro guardado fica solto, como Cl2.',
          sci: 'As nuvens estratosféricas polares formam-se abaixo de cerca de −78 °C (195 K); nas suas partículas, HCl + ClONO₂ → Cl₂ + HNO₃, e o cloro guardado vira Cl₂, que a luz consegue partir.',
        },
        cloudDone: {
          kid: 'O cloro já está solto. Agora toca no sol da primavera!',
          sci: 'Já ativado: agora o Sol.',
        },
        cloudLate: {
          kid: 'Chegou a primavera: as nuvens geladas estão a desaparecer.',
          sci: 'O vórtice aquece: as nuvens desapareceram.',
        },
        sunFirst: {
          kid: 'Primeiro é preciso soltar o cloro: toca na nuvem gelada.',
          sci: 'Só a luz pouco faz ao HCl e ao ClONO₂: primeiro as nuvens têm de ativar o cloro.',
        },
        sunLate: {
          kid: 'Esta primavera já passou. Toca na lata ou no frigorífico para outro ano, ou no tratado.',
          sci: 'A perda desta primavera já terminou.',
        },
        spring: {
          kid: 'O sol da primavera parte o Cl2 em dois átomos de cloro, e cada um parte ozono atrás de ozono! Um só átomo de cloro pode partir mais de 100 000 moléculas de ozono antes de ser apanhado.',
          sci: 'Cl₂ + luz → 2 Cl; Cl + O₃ → ClO + O₂ (duas vezes); ClO + ClO → Cl₂O₂; Cl₂O₂ + luz → 2 Cl + O₂. No total 2 O₃ → 3 O₂, e o cloro fica livre outra vez: a agência ambiental dos EUA (EPA) estima que um átomo de cloro pode destruir mais de 100 000 moléculas de ozono.',
        },
        caught: {
          kid: 'Finalmente o cloro é apanhado e guardado outra vez, mas a maior parte do ozono aqui desapareceu: é o buraco do ozono.',
          sci: 'Quando o vórtice aquece, o cloro volta ao HCl e ao ClONO₂; até lá, a maior parte do ozono entre cerca de 14 e 22 km desapareceu.',
        },
        treaty: {
          kid: '1987: os países reuniram-se em Montreal e combinaram deixar de fabricar CFC. Mais tarde, todos os países do mundo aderiram: foi a primeira vez que isso aconteceu com um tratado das Nações Unidas!',
          sci: 'O Protocolo de Montreal, assinado a 16 de setembro de 1987, e as suas emendas eliminaram os CFC, os halons e outros gases que destroem o ozono (os CFC em todo o mundo até 2010). A 16 de setembro de 2009, ele e a Convenção de Viena foram os primeiros tratados da história da ONU ratificados por todos os países.',
        },
        canAfter: {
          kid: 'Agora já não! Com o tratado, os sprays e frigoríficos novos usam outros gases, que não fazem mal ao ozono.',
          sci: 'Substituídos por hidrocarbonetos, HFC e outros gases; os HFC, fortes gases com efeito de estufa, estão agora também a ser reduzidos, pela Emenda de Kigali de 2016.',
        },
        again: {
          kid: 'Um ano novo: durante o verão, o ozono voltou. Mas o cloro continua lá em cima, por isso na primavera seguinte o ozono volta a ser partido, até os CFC acabarem.',
          sci: 'Todos os verões o ozono recupera; todas as primaveras, o cloro que resta na estratosfera volta a destruí-lo, enquanto os CFC durarem.',
        },
        oneAtATime: {
          kid: 'Vamos seguir primeiro este: toca na nuvem gelada ou no sol da primavera.',
          sci: 'Um CFC de cada vez: segue este pelo inverno e pela primavera.',
        },
        future: {
          kid: 'Olha para o globo: o buraco está a sarar! Sobre a Antártida, o ozono deve voltar a estar como em 1980 por volta de 2066.',
          sci: 'A avaliação OMM/PNUA de 2022: com as regras atuais, o ozono da Antártida volta aos valores de 1980 por volta de 2066, o do Ártico por volta de 2045, e o do resto do mundo por volta de 2040.',
        },
        end: {
          kid: 'As pessoas viram o perigo, combinaram o que fazer e resolveram-no, todas juntas. É uma história que vale a pena lembrar!',
          sci: 'Molina e Rowland alertaram para os CFC em 1974; com Paul Crutzen, partilharam o Prémio Nobel da Química de 1995. Medições, teoria e um tratado cumprido por todos os países: a camada de ozono está a recuperar.',
        },
        globe: {
          kid: 'Este globo mostra o ozono sobre a Antártida em outubro, no ano escolhido na barra. Escuro quer dizer buraco.',
          sci: 'O buraco desenhado a partir da média de outubro em Halley no ano escolhido: medida até 2025, prevista depois.',
        },
        nobel: {
          kid: 'Mario Molina, Sherwood Rowland e Paul Crutzen ganharam o Prémio Nobel por explicarem como o ozono se forma e se destrói.',
          sci: 'Prémio Nobel da Química de 1995: Paul J. Crutzen, Mario J. Molina e F. Sherwood Rowland, pelo seu trabalho em química da atmosfera, em particular sobre a formação e a decomposição do ozono.',
        },
      },
      panel: {
        kid: [
          'Os CFC eram gases práticos para latas de spray e frigoríficos. Anos depois de subirem, o inverno polar, frio e escuro, faz nuvens geladas que soltam o seu cloro, e quando o Sol volta na primavera, cada átomo de cloro parte ozono atrás de ozono. É o buraco do ozono.',
          'Em 1987, os países combinaram em Montreal deixar de fabricar CFC, e no fim todos os países aderiram. Desliza os anos: o cloro vai-se embora devagar e o buraco sara, até ficar como em 1980 por volta de 2066.',
        ],
        sci: [
          'O cloro dos CFC (e o bromo dos halons) fica guardado como HCl e ClONO₂ até as nuvens estratosféricas polares, abaixo de cerca de −78 °C, o transformarem em Cl₂. A luz da primavera põe então a girar o ciclo do dímero de ClO (descrito por Luisa e Mario Molina em 1987), que destrói o ozono mais depressa entre cerca de 14 e 22 km.',
          'Com o Protocolo de Montreal (1987), os gases foram eliminados. O cloro e o bromo sobre a Antártida (como EESC, NOAA) atingiram o máximo em 2001 e 2002, com cerca de 4,15 ppb; em 2024 tinham descido cerca de um quarto do caminho de volta ao nível de 1980, esperado por volta de 2070. A avaliação OMM/PNUA de 2022 prevê o ozono da Antártida de volta aos valores de 1980 por volta de 2066. O gráfico: as médias de outubro em Halley (Dobson do BAS; satélite onde o Dobson tem falhas) e o EESC da NOAA, com os anos antes de 1980 esboçados.',
        ],
      },
    },
  },
  pl: {
    title: 'Stacja ozonowa',
    greet: {
      kid: 'Brrr, witaj na Antarktydzie! To stacja badawcza na Lodowcu Szelfowym Brunta, gdzie ludzie po raz pierwszy zauważyli dziurę ozonową. Jestem Tlen: wysoko na niebie trzy moje atomy łączą się w ozon, niewidzialny krem z filtrem dla Ziemi. Są tu trzy rzeczy do wypróbowania, a historia obrazka jest na sztaludze.',
      sci: 'Lodowiec Szelfowy Brunta na Antarktydzie, około 75,6° S, wiosną. Pomiary Dobsona na stacji Halley, prowadzone od 1956 roku, ujawniły dziurę ozonową (Farman, Gardiner i Shanklin, Nature, maj 1985). Tutaj: jak powstaje ozon, jak się go mierzy i jak świat powstrzymał jego niszczenie. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Ozon to trzy sklejone atomy tlenu: O3. Tlen, którym oddychasz, to dwa: O2. Jeden atom więcej robi ogromną różnicę!',
        'Lód pod twoimi stopami unosi się na morzu i powoli płynie w stronę oceanu. Dlatego budynki Halley stoją na nogach z płozami: można je przeciągnąć w nowe miejsce.',
        'Zimą Słońce nie wschodzi tu przez mniej więcej trzy miesiące. Mierniki ozonu potrzebują światła słonecznego, więc co roku pomiary zaczynają się od nowa pod koniec sierpnia.',
      ],
      sci: [
        'Ozon, O₃, to cząsteczka zgięta (116,8°) z dwoma jednakowymi wiązaniami o długości około 128 pm, pośrednimi między pojedynczym a podwójnym. Nawet w warstwie ozonowej jest go mało: zaledwie kilka części na milion powietrza.',
        'Halley stoi na pływającym Lodowcu Szelfowym Brunta, który spływa ku Morzu Weddella. Obecna stacja, Halley VI, stoi na hydraulicznych nogach z płozami, więc może wspinać się ponad nawiewany śnieg i zostać przeciągnięta w głąb lądu, gdy lód pęka.',
        'Nad Antarktydą warstwa ozonowa leży niżej niż nad tropikami, z maksimum około 18 km w sondażach NOAA na biegunie południowym; zimą powietrze spada tam poniżej −78 °C, co wystarcza do powstania polarnych chmur stratosferycznych.',
      ],
    },
    months: ['sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień', 'styczeń', 'luty', 'marzec', 'kwiecień'],
    monthsShort: ['sie', 'wrz', 'paź', 'lis', 'gru', 'sty', 'lut', 'mar', 'kwi'],
    eras: { e60: 'lata 60.', e70: 'lata 70.', e80: 'lata 80.', e90: 'lata 90.' },
    factory: {
      label: 'Fabryka ozonu',
      title: 'Światło Słońca tworzy i rozbija ozon',
      signs: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'widzialne', layer: 'warstwa ozonowa', beads: 'koraliki UV', heat: 'ciepło' },
      verbs: { C: 'Foton UV-C', B: 'Foton UV-B', A: 'Foton UV-A', V: 'Światło widzialne', sun: 'Całe światło Słońca naraz', off: 'Wyłącz wiązkę' },
      hints: { C: 'Dotknij filtra UV-C', B: 'Teraz dotknij filtra UV-B', A: 'Dotknij UV-A, a potem światła widzialnego', sun: 'Dotknij słońca, żeby wysłać wszystkie', wave: 'Dotknij ekranu i przesuń długość fali' },
      wave: 'Długość fali wiązki',
      screen: { title: 'Co dociera do śniegu?', x: 'długość fali (nm)', y: 'dociera do śniegu', beam: 'Wiązka', hint: 'Przesuń długość fali na tablicy' },
      bands: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'światło widzialne' },
      reach: { none: 'nic nie przechodzi', little: 'przechodzi tylko trochę', half: 'przechodzi mniej więcej połowa', most: 'przechodzi większość', all: 'przechodzi prawie wszystko' },
      pct: 'około {pct} % przechodzi przez ozon',
      pctNone: 'przechodzi mniej niż 1 %',
      says: {
        C: {
          kid: 'Bzzt! Foton UV-C rozbił cząsteczkę tlenu na dwa atomy. Każdy atom złapał inną cząsteczkę O2 i teraz są dwie nowe cząsteczki ozonu!',
          sci: 'O₂ + światło (λ < 242 nm) → 2 O, potem O + O₂ + M → O₃ + M, dwa razy: z trzech O₂ powstały dwa O₃. M to dowolna trzecia cząsteczka, N₂ albo O₂, która zabiera energię.',
        },
        Cfull: {
          kid: 'Prawie cały tlen jest tu już ozonem! Tym razem UV-C złapała cząsteczka ozonu.',
          sci: 'Brak O₂ do rozbicia: O₃ też pochłania UV-C (pasmo Hartleya, z maksimum około 255 nm).',
        },
        B: {
          kid: 'UV-B został złapany! Cząsteczka ozonu się rozpadła, a wolny atom znowu dołączył do O2: ozon wrócił, a światło zamieniło się w ciepło.',
          sci: 'O₃ + światło (λ < 320 nm) → O₂ + O, potem O + O₂ + M → O₃ + M: UV-B kończy jako ciepło. Dlatego stratosfera ogrzewa się z wysokością.',
        },
        Bbreak: {
          kid: 'Tym razem wolny atom wpadł na inny ozon i oba zamieniły się w zwykły tlen. Ozon cały czas powstaje i się rozpada.',
          sci: 'O + O₃ → 2 O₂, reakcja ubytku Chapmana: tworzenie i niszczenie równoważą się w stałej ilości ozonu.',
        },
        Bthrough: {
          kid: 'Ten foton UV-B prześlizgnął się aż do śniegu! Trochę UV-B zawsze dociera na dół: to właśnie on powoduje oparzenia słoneczne.',
          sci: 'Niewielka część UV-B (280 do 315 nm) dociera do ziemi, głównie najdłuższe fale: to pasmo powoduje oparzenia słoneczne i liczy się w indeksie UV.',
        },
        A: {
          kid: 'UV-A przechodzi przez ozon i trafia w koraliki: patrz, robią się kolorowe! Dlatego nadal potrzebujesz kremu z filtrem.',
          sci: 'Ozon prawie nie pochłania UV-A (315 do 400 nm); barwnik fotochromowy w koralikach przechodzi w barwną formę i wraca w cieniu.',
        },
        V: {
          kid: 'Światło widzialne też przechodzi, ale koraliki zostają białe: zmieniają kolor tylko w ultrafiolecie.',
          sci: 'Światło widzialne: słabe pasmo Chappuisa (około 600 nm) zabiera tylko kilka procent. Koraliki potrzebują UV, żeby się przełączyć.',
        },
        sun: {
          kid: 'Całe światło Słońca naraz: UV-C i UV-B zostają wysoko w warstwie ozonowej, UV-A i światło widzialne schodzą do śniegu.',
          sci: 'Światło Słońca przesiane przez stratosferę: poniżej 242 nm przez O₂ i O₃, od 242 do 300 nm prawie całe przez O₃, a powyżej 300 nm przechodzi coraz większa część.',
        },
        beads: {
          kid: 'To koraliki UV: w cieniu białe, w ultrafiolecie robią się fioletowe, niebieskie i różowe. Można je kupić do doświadczeń.',
          sci: 'Koraliki wykrywające UV zawierają barwniki fotochromowe, które pod wpływem UV-A przechodzą w barwną formę i w cieniu wracają po kilku minutach.',
        },
      },
      panel: {
        kid: [
          'Światło Słońca jest różnego rodzaju. Ultrafiolet (UV) ma więcej energii niż światło, które widzimy, a jego najsilniejsze rodzaje szkodzą żywym istotom.',
          'Wysoko w górze najsilniejszy UV, czyli UV-C, rozbija cząsteczki tlenu (O2) na atomy, a każdy atom łączy się z inną O2 w ozon (O3). Potem ozon łapie UV-B i się rozpada, a jego atom znowu się łączy: fabryka, która przez cały dzień tworzy i rozbija ozon. Dotknij każdego filtra i zobacz, co dociera do koralików.',
        ],
        sci: [
          'Cykl Chapmana (Sydney Chapman, 1930): O₂ + światło (λ < 242 nm) → 2 O; O + O₂ + M → O₃ + M; O₃ + światło (λ < 320 nm) → O₂ + O; O + O₃ → 2 O₂. Ozon stale powstaje i jest niszczony; równowaga decyduje, ile go jest.',
          'O₂ pochłania poniżej 242 nm, a O₃ silnie od około 200 do 310 nm (pasmo Hartleya, maksimum około 255 nm), więc żaden UV-C nie dociera do ziemi, a z UV-B tylko niewielka część, głównie najdłuższe fale. UV-A (315 do 400 nm) i światło widzialne przechodzą w większości. Ekran pokazuje, jaka część przechodzi przez 300 DU ozonu przy Słońcu w zenicie (sam ozon, bez rozpraszania).',
        ],
      },
    },
    measure: {
      label: 'Pomiar ozonu',
      title: 'Ile ozonu jest nad nami?',
      signs: { dobson: 'spektrofotometr Dobsona', log: 'dziennik pomiarów', coin: 'moneta 1 euro: 2,33 mm', scale: 'oba 10 razy większe', balloon: 'ozonosonda' },
      chart: {
        month: 'Ozon nad Halley, miesiąc po miesiącu',
        night: 'Od maja do lipca: noc polarna, brak Słońca do pomiaru',
        du: 'jednostki Dobsona',
        ozone: 'ozon',
        profile: 'Ozon z balonu',
        km: 'km',
        layer: 'warstwa ozonowa',
        before: 'przed dziurą',
        wait: 'Wypuść balon!',
      },
      verbs: { dobson: 'Ściśnij ozon', back: 'Niech znowu się rozciągnie', log: 'Inna dekada', balloon: 'Wypuść balon' },
      hints: { dobson: 'Dotknij miernika Dobsona', balloon: 'Dotknij balonu, żeby go wypuścić', log: 'Dotknij dziennika, żeby zmienić dekadę', more: 'Dotknij wykresu, żeby przejść do następnego miesiąca' },
      slider: 'Miesiąc',
      rows: { month: 'Miesiąc', era: 'Dekada', ozone: 'Ozon nad Halley', thick: 'Ściśnięty do ciśnienia przy ziemi' },
      says: {
        squeeze: {
          kid: 'Ściśnięty do ciśnienia powietrza przy ziemi, cały ozon nad nami tworzy warstwę grubą tylko na {mm} mm. Porównaj z monetą!',
          sci: '{du} DU: sprężona do 0 °C i 1 atm, cała kolumna miałaby {mm} mm grubości (1 DU = 0,01 mm, około 2,69 × 10²⁰ cząsteczek na metr kwadratowy).',
        },
        back: {
          kid: 'I znowu w górę: prawdziwy ozon jest rozłożony na wiele kilometrów nieba.',
          sci: 'Z powrotem w prawdziwym rozkładzie: nawet w stratosferze ozon stanowi zaledwie kilka części na milion powietrza.',
        },
        e60: {
          kid: 'Lata 60.: przed dziurą ozonową. Wiosną ozonu było nawet więcej.',
          sci: 'Lata 60.: średnie październikowe około 300 DU, rosnące do około 350 w listopadzie, gdy rozpada się wir polarny.',
        },
        e70: {
          kid: 'Lata 70.: wiosną ozonu jest już trochę mniej.',
          sci: 'Lata 70.: średnie wrześniowe i październikowe już około 20 DU niższe niż w latach 60.',
        },
        e80: {
          kid: 'Lata 80.: wiosną brakuje jednej trzeciej ozonu. To właśnie zauważyli naukowcy z Halley!',
          sci: 'Lata 80.: średnie październikowe około 200 DU. Farman, Gardiner i Shanklin z British Antarctic Survey opisali ten spadek w Nature w maju 1985 roku.',
        },
        e90: {
          kid: 'Lata 90.: każdej wiosny znikała ponad połowa ozonu nad Halley!',
          sci: 'Lata 90.: średnie październikowe około 140 DU; najniższy miesiąc, październik 1993, miał 122 DU.',
        },
        spring: {
          kid: 'Wrzesień i październik: wiosna, kiedy wraca Słońce. W latach dziury właśnie wtedy ozonu ubywało.',
          sci: 'Ubytek wymaga światła padającego na chlor uwolniony w ciemności: trwa od końca sierpnia do października i ustaje, gdy wir polarny rozpada się w listopadzie lub grudniu.',
        },
        launch: {
          kid: 'Leci! Balon niesie mały miernik ozonu wyżej niż 30 km i przesyła pomiary przez radio.',
          sci: 'Ozonosonda: w jej ogniwie elektrochemicznym ozon reaguje z roztworem jodku potasu, a prąd mówi, ile jest ozonu. Wznosi się około 5 m/s i pęka na wysokości około 30 do 35 km.',
        },
        burst: {
          kid: 'Bum! Balon pękł wysoko w górze. Na wykresie duży brzuszek to warstwa ozonowa.',
          sci: 'Pełny profil: większość ozonu między około 12 a 28 km, z maksimum około 18 km.',
        },
        burstHole: {
          kid: 'Bum! Spójrz na wykres: tej wiosny środek warstwy ozonowej jest prawie pusty!',
          sci: 'Wiosenny ubytek: między około 14 a 22 km prawie nie ma ozonu, jak pokazują sondaże NOAA na biegunie południowym (zniszczone 90 % lub więcej).',
        },
        coin: {
          kid: 'Prawdziwa moneta 1 euro ma 2,33 mm grubości: ściśnięta warstwa ozonowa jest mniej więcej tak cienka!',
          sci: 'Moneta 1 euro: 23,25 mm średnicy, 2,33 mm grubości. Ona i płytka są pokazane 10 razy większe.',
        },
      },
      panel: {
        kid: [
          'Spektrofotometr Dobsona patrzy na Słońce i porównuje dwa rodzaje ultrafioletu: jeden, który ozon pochłania, i drugi, który przepuszcza. Różnica mówi, ile ozonu jest nad nami.',
          'Ściśnięty do ciśnienia przy ziemi, cały ozon nad nami miałby tylko około 3 mm grubości! Przesuwaj miesiące, zajrzyj do innej dekady w dzienniku i wypuść balon, żeby zobaczyć, jak wysoko jest ozon.',
        ],
        sci: [
          'Spektrofotometr G. M. B. Dobsona (lata 20. XX wieku) porównuje pary długości fal UV, jedną silnie pochłanianą przez ozon i jedną słabo (na przykład 305,5 i 325,4 nm); ich stosunek daje całkowitą kolumnę ozonu w jednostkach Dobsona, przy czym 1 DU to 0,01 mm czystego ozonu w 0 °C i 1 atm. Pomiary w Halley zaczęły się w 1956 roku; przyrząd potrzebuje Słońca, więc sezon trwa od końca sierpnia do połowy kwietnia.',
          'W latach 80. średnia październikowa spadła z około 300 DU do poniżej 200 DU: Joe Farman, Brian Gardiner i Jonathan Shanklin z British Antarctic Survey opisali to w Nature w maju 1985 roku. Wykres pokazuje tymczasowe średnie miesięczne z Halley według dekad (BAS, J. Shanklin); profile z balonu to model dopasowany do tych średnich.',
        ],
      },
    },
    fix: {
      label: 'Ratunek',
      title: 'Jak świat załatał dziurę',
      signs: {
        can: 'puszka sprayu',
        fridge: 'stara lodówka',
        cloud: 'lodowa chmura',
        sun: 'wiosenne słońce',
        treaty: 'PROTOKÓŁ MONTREALSKI',
        treatyAll: 'w sprawie substancji zubożających warstwę ozonową. Ratyfikowany przez wszystkie kraje.',
        nobel: 'Nagroda Nobla z chemii 1995',
        diorama: '20 km nad Antarktydą',
        years: 'to trwa lata',
        nocfc: 'bez CFC',
        count: 'rozbity ozon',
        max: '100 000',
      },
      chart: { title: 'Halley przez lata', ozone: 'ozon w październiku', chlorine: 'chlor wysoko w górze', found: 'odkrycie dziury', treaty: 'Montreal', back: 'jak w 1980', expected: 'przewidywane' },
      verbs: { can: 'Psiknij sprayem', fridge: 'Otwórz starą lodówkę', cloud: 'Zima: lodowa chmura', sun: 'Wiosna: wraca Słońce', treaty: 'Traktat', again: 'Od nowa' },
      hints: {
        cfc: 'Dotknij puszki sprayu albo lodówki',
        wait: 'Patrz, jak CFC się wspina',
        cloud: 'Dotknij lodowej chmury',
        sun: 'Dotknij wiosennego słońca',
        watch: 'Patrz, jak działa chlor',
        treaty: 'Dotknij traktatu na ścianie',
        years: 'Dotknij wykresu i przesuń lata',
        end: 'Przesuń lata w przyszłość',
      },
      slider: 'Rok',
      rows: { year: 'Rok', ozone: 'Ozon nad Halley w październiku', chlorine: 'Chlor i brom wysoko w górze' },
      says: {
        cfc: {
          kid: 'Psst! Wylatują CFC, gazy, których kiedyś używano w sprayach i lodówkach. Tu na dole są nieszkodliwe, ale powoli unoszą się aż na samą górę.',
          sci: 'CFC-12, CCl₂F₂, czynnik chłodniczy i gaz nośny w sprayach: obojętny w dolnej atmosferze, przetrwa około stulecia i przez kilka lat jest wynoszony do stratosfery.',
        },
        arrive: {
          kid: 'Po latach dociera do warstwy ozonowej. Silne światło Słońca rozbija tu CFC, ale jego chlor szybko zostaje zamknięty, na razie.',
          sci: 'W stratosferze krótkofalowy UV rozbija CFC; jego chlor trafia głównie do cząsteczek rezerwuarowych, HCl i ClONO₂, które nie atakują ozonu.',
        },
        nocfc: {
          kid: 'Na górze nie ma jeszcze CFC: najpierw dotknij puszki sprayu albo lodówki.',
          sci: 'Na górze nie ma jeszcze chloru: najpierw uwolnij CFC.',
        },
        cloud: {
          kid: 'Zima polarna: ciemno i zimniej niż −78 °C. Powstają lodowe chmury, a na ich lodzie zamknięty chlor zostaje uwolniony jako Cl2.',
          sci: 'Polarne chmury stratosferyczne powstają poniżej około −78 °C (195 K); na ich cząstkach zachodzi HCl + ClONO₂ → Cl₂ + HNO₃ i zmagazynowany chlor zmienia się w Cl₂, który światło potrafi rozbić.',
        },
        cloudDone: {
          kid: 'Chlor jest już wolny. Teraz dotknij wiosennego słońca!',
          sci: 'Już aktywowany: teraz Słońce.',
        },
        cloudLate: {
          kid: 'Przyszła wiosna: lodowe chmury znikają.',
          sci: 'Wir się ogrzewa: chmur już nie ma.',
        },
        sunFirst: {
          kid: 'Najpierw trzeba uwolnić chlor: dotknij lodowej chmury.',
          sci: 'Samo światło niewiele robi z HCl i ClONO₂: najpierw chmury muszą aktywować chlor.',
        },
        sunLate: {
          kid: 'Ta wiosna już minęła. Dotknij puszki albo lodówki, żeby zacząć kolejny rok, albo traktatu.',
          sci: 'Tegoroczny wiosenny ubytek już się skończył.',
        },
        spring: {
          kid: 'Wiosenne słońce rozbija Cl2 na dwa atomy chloru, a każdy z nich rozbija ozon za ozonem! Jeden atom chloru może rozbić ponad 100 000 cząsteczek ozonu, zanim zostanie złapany.',
          sci: 'Cl₂ + światło → 2 Cl; Cl + O₃ → ClO + O₂ (dwa razy); ClO + ClO → Cl₂O₂; Cl₂O₂ + światło → 2 Cl + O₂. W sumie 2 O₃ → 3 O₂, a chlor za każdym razem znów jest wolny: amerykańska agencja EPA szacuje, że jeden atom chloru może zniszczyć ponad 100 000 cząsteczek ozonu.',
        },
        caught: {
          kid: 'W końcu chlor zostaje złapany i znowu zamknięty, ale większość ozonu tutaj zniknęła: to jest dziura ozonowa.',
          sci: 'Gdy wir się ogrzewa, chlor wraca do HCl i ClONO₂; do tego czasu większość ozonu między około 14 a 22 km już zniknęła.',
        },
        treaty: {
          kid: '1987: kraje spotkały się w Montrealu i umówiły się, że przestaną produkować CFC. Później przyłączyły się wszystkie kraje świata: pierwszy raz w historii traktatu ONZ!',
          sci: 'Protokół montrealski, podpisany 16 września 1987 roku, wraz z poprawkami wycofał CFC, halony i inne gazy niszczące ozon (CFC na całym świecie do 2010 roku). 16 września 2009 roku on i konwencja wiedeńska stały się pierwszymi traktatami w historii ONZ ratyfikowanymi przez wszystkie kraje.',
        },
        canAfter: {
          kid: 'Już nie! Dzięki traktatowi nowe spraye i lodówki używają innych gazów, które nie szkodzą ozonowi.',
          sci: 'Zastąpione węglowodorami, HFC i innymi gazami; HFC, silne gazy cieplarniane, są teraz też ograniczane, na mocy poprawki z Kigali z 2016 roku.',
        },
        again: {
          kid: 'Nowy rok: przez lato ozon wrócił. Ale chlor wciąż jest na górze, więc następnej wiosny ozon znowu zostanie rozbity, dopóki CFC nie znikną.',
          sci: 'Co lato ozon się odbudowuje; co wiosnę chlor, który został w stratosferze, znowu go niszczy, dopóki trwają CFC.',
        },
        oneAtATime: {
          kid: 'Najpierw prześledźmy ten jeden: dotknij lodowej chmury albo wiosennego słońca.',
          sci: 'Po jednym CFC naraz: prześledź ten przez zimę i wiosnę.',
        },
        future: {
          kid: 'Spójrz na globus: dziura się goi! Nad Antarktydą ozon powinien wrócić do stanu z 1980 roku około 2066 roku.',
          sci: 'Ocena WMO/UNEP z 2022 roku: przy dzisiejszych przepisach ozon nad Antarktydą wróci do wartości z 1980 roku około 2066, nad Arktyką około 2045, a nad resztą świata około 2040 roku.',
        },
        end: {
          kid: 'Ludzie zauważyli niebezpieczeństwo, uzgodnili, co robić, i naprawili to, wszyscy razem. To historia warta zapamiętania!',
          sci: 'Molina i Rowland ostrzegli przed CFC w 1974 roku; razem z Paulem Crutzenem otrzymali Nagrodę Nobla z chemii w 1995 roku. Pomiary, teoria i traktat przestrzegany przez wszystkie kraje: warstwa ozonowa się odbudowuje.',
        },
        globe: {
          kid: 'Ten globus pokazuje ozon nad Antarktydą w październiku, w roku wybranym na suwaku. Ciemne miejsce to dziura.',
          sci: 'Dziura narysowana według średniej październikowej z Halley w wybranym roku: zmierzonej do 2025, potem przewidywanej.',
        },
        nobel: {
          kid: 'Mario Molina, Sherwood Rowland i Paul Crutzen dostali Nagrodę Nobla za wyjaśnienie, jak ozon powstaje i jak się rozpada.',
          sci: 'Nagroda Nobla z chemii 1995: Paul J. Crutzen, Mario J. Molina i F. Sherwood Rowland, za prace z chemii atmosfery, zwłaszcza dotyczące powstawania i rozkładu ozonu.',
        },
      },
      panel: {
        kid: [
          'CFC były wygodnymi gazami do sprayów i lodówek. Kilka lat po tym, jak uniosą się w górę, zimna i ciemna polarna zima tworzy lodowe chmury, które uwalniają ich chlor, a gdy wiosną wraca Słońce, każdy atom chloru rozbija ozon za ozonem. Tak powstaje dziura ozonowa.',
          'W 1987 roku kraje umówiły się w Montrealu, że przestaną produkować CFC, a w końcu przyłączyły się wszystkie kraje. Przesuń lata: chlor powoli znika, a dziura się goi i około 2066 roku będzie jak w 1980.',
        ],
        sci: [
          'Chlor z CFC (i brom z halonów) jest przechowywany jako HCl i ClONO₂, dopóki polarne chmury stratosferyczne, poniżej około −78 °C, nie zamienią go w Cl₂. Wiosenne światło napędza wtedy cykl dimeru ClO (opisany przez Luisę i Mario Molinów w 1987 roku), który najszybciej niszczy ozon między około 14 a 22 km.',
          'Na mocy protokołu montrealskiego (1987) gazy wycofano. Chlor i brom nad Antarktydą (jako EESC, NOAA) osiągnęły maksimum w latach 2001 i 2002, około 4,15 ppb; do 2024 roku spadły o mniej więcej jedną czwartą drogi do poziomu z 1980 roku, oczekiwanego około 2070. Ocena WMO/UNEP z 2022 roku przewiduje powrót ozonu nad Antarktydą do wartości z 1980 roku około 2066. Wykres: średnie październikowe z Halley (Dobson BAS; satelita tam, gdzie w pomiarach Dobsona są luki) i EESC według NOAA, lata przed 1980 naszkicowane.',
        ],
      },
    },
  },
  de: {
    title: 'Die Ozonstation',
    greet: {
      kid: 'Brrr, willkommen in der Antarktis! Das ist eine Forschungsstation auf dem Brunt-Schelfeis, wo Menschen zum ersten Mal das Ozonloch bemerkt haben. Ich bin der Sauerstoff: Hoch oben am Himmel tun sich drei meiner Atome zu Ozon zusammen, der unsichtbaren Sonnencreme der Erde. Drei Dinge kannst du ausprobieren, und die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Das Brunt-Schelfeis in der Antarktis, etwa 75,6° S, im Frühling. Die Dobson-Messungen der Station Halley, begonnen 1956, deckten das Ozonloch auf (Farman, Gardiner und Shanklin, Nature, Mai 1985). Hier: wie Ozon entsteht, wie man es misst und wie die Welt seine Zerstörung gestoppt hat. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Ozon sind drei aneinanderhängende Sauerstoffatome: O3. Der Sauerstoff, den du atmest, sind zwei: O2. Ein Atom mehr macht den ganzen Unterschied!',
        'Das Eis unter deinen Füßen schwimmt auf dem Meer und fließt langsam zum Ozean. Darum stehen die Gebäude von Halley auf Beinen mit Kufen: Man kann sie an einen neuen Ort ziehen.',
        'Im Winter geht die Sonne hier etwa drei Monate lang nicht auf. Ozonmessgeräte brauchen Sonnenlicht, deshalb beginnen die Messungen jedes Jahr Ende August von Neuem.',
      ],
      sci: [
        'Ozon, O₃, ist gewinkelt (116,8°) mit zwei gleichen Bindungen von etwa 128 pm, zwischen Einfach- und Doppelbindung. Selbst in der Ozonschicht ist es selten: nur wenige Teile pro Million der Luft.',
        'Halley steht auf dem schwimmenden Brunt-Schelfeis, das zum Weddellmeer fließt. Die heutige Station, Halley VI, steht auf hydraulischen Beinen mit Kufen, damit sie sich über den Treibschnee heben und landeinwärts ziehen lässt, wenn das Eis reißt.',
        'Über der Antarktis liegt die Ozonschicht tiefer als über den Tropen, ihr Maximum bei etwa 18 km in den Südpol-Sondierungen der NOAA; im Winter fällt die Luft dort unter −78 °C, kalt genug für polare Stratosphärenwolken.',
      ],
    },
    months: ['August', 'September', 'Oktober', 'November', 'Dezember', 'Januar', 'Februar', 'März', 'April'],
    monthsShort: ['Aug', 'Sep', 'Okt', 'Nov', 'Dez', 'Jan', 'Feb', 'Mär', 'Apr'],
    eras: { e60: '1960er', e70: '1970er', e80: '1980er', e90: '1990er' },
    factory: {
      label: 'Die Ozonfabrik',
      title: 'Sonnenlicht macht und zerlegt Ozon',
      signs: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'sichtbar', layer: 'die Ozonschicht', beads: 'UV-Perlen', heat: 'Wärme' },
      verbs: { C: 'Ein UV-C-Photon', B: 'Ein UV-B-Photon', A: 'Ein UV-A-Photon', V: 'Sichtbares Licht', sun: 'Das ganze Sonnenlicht auf einmal', off: 'Strahl aus' },
      hints: { C: 'Tippe auf den UV-C-Filter', B: 'Jetzt tippe auf den UV-B-Filter', A: 'Tippe auf UV-A, dann auf sichtbares Licht', sun: 'Tippe auf die Sonne für alle auf einmal', wave: 'Tippe auf den Bildschirm und schieb die Wellenlänge' },
      wave: 'Wellenlänge des Strahls',
      screen: { title: 'Was kommt im Schnee an?', x: 'Wellenlänge (nm)', y: 'kommt im Schnee an', beam: 'Strahl', hint: 'Schieb die Wellenlänge auf der Tafel' },
      bands: { C: 'UV-C', B: 'UV-B', A: 'UV-A', V: 'sichtbares Licht' },
      reach: { none: 'nichts kommt durch', little: 'nur wenig kommt durch', half: 'etwa die Hälfte kommt durch', most: 'das meiste kommt durch', all: 'fast alles kommt durch' },
      pct: 'etwa {pct} % gehen durch das Ozon',
      pctNone: 'weniger als 1 % geht durch',
      says: {
        C: {
          kid: 'Zack! Das UV-C-Photon hat ein Sauerstoffmolekül in zwei Atome gespalten. Jedes Atom hat sich ein anderes O2 geschnappt, und jetzt gibt es zwei neue Ozonmoleküle!',
          sci: 'O₂ + Licht (λ < 242 nm) → 2 O, dann O + O₂ + M → O₃ + M, zweimal: Aus drei O₂ wurden zwei O₃. M ist irgendein drittes Molekül, N₂ oder O₂, das die Energie abführt.',
        },
        Cfull: {
          kid: 'Fast der ganze Sauerstoff hier ist schon Ozon! Diesmal hat ein Ozonmolekül das UV-C gefangen.',
          sci: 'Kein O₂ mehr zum Spalten: Auch O₃ absorbiert UV-C (die Hartley-Bande, mit dem Maximum bei etwa 255 nm).',
        },
        B: {
          kid: 'Das UV-B wurde gefangen! Ein Ozonmolekül ist zerbrochen, und sein loses Atom hat sich wieder an ein O2 gehängt: Das Ozon ist zurück, und das Licht wurde zu Wärme.',
          sci: 'O₃ + Licht (λ < 320 nm) → O₂ + O, dann O + O₂ + M → O₃ + M: Das UV-B endet als Wärme. Darum wird die Stratosphäre nach oben hin wärmer.',
        },
        Bbreak: {
          kid: 'Diesmal ist das lose Atom gegen ein anderes Ozon gestoßen, und beide wurden zu gewöhnlichem Sauerstoff. Ozon wird ständig gemacht und zerlegt.',
          sci: 'O + O₃ → 2 O₂, Chapmans Abbaureaktion: Bildung und Abbau gleichen sich zu einer stabilen Ozonmenge aus.',
        },
        Bthrough: {
          kid: 'Dieses UV-B-Photon ist bis zum Schnee durchgerutscht! Ein bisschen UV-B kommt immer unten an: Es macht den Sonnenbrand.',
          sci: 'Ein kleiner Teil des UV-B (280 bis 315 nm) erreicht den Boden, vor allem die längsten Wellen: Dieses Band verursacht Sonnenbrand und zählt im UV-Index.',
        },
        A: {
          kid: 'UV-A geht durch das Ozon und landet auf den Perlen: Schau, sie werden bunt! Deshalb brauchst du trotzdem Sonnencreme.',
          sci: 'Ozon absorbiert UV-A (315 bis 400 nm) kaum; der photochrome Farbstoff der Perlen schaltet darunter in eine farbige Form und im Schatten wieder zurück.',
        },
        V: {
          kid: 'Sichtbares Licht kommt auch durch, aber die Perlen bleiben weiß: Sie ändern ihre Farbe nur im Ultraviolett.',
          sci: 'Sichtbares Licht: Die schwache Chappuis-Bande (um 600 nm) nimmt nur ein paar Prozent. Die Perlen brauchen UV zum Umschalten.',
        },
        sun: {
          kid: 'Das ganze Sonnenlicht auf einmal: UV-C und UV-B bleiben oben in der Ozonschicht hängen, UV-A und sichtbares Licht kommen bis zum Schnee.',
          sci: 'Sonnenlicht, von der Stratosphäre sortiert: unter 242 nm durch O₂ und O₃, von 242 bis 300 nm fast ganz durch O₃, über 300 nm geht ein wachsender Teil durch.',
        },
        beads: {
          kid: 'Das sind UV-Perlen: im Schatten weiß, im ultravioletten Licht werden sie lila, blau und rosa. Man kann sie für Experimente kaufen.',
          sci: 'UV-Perlen enthalten photochrome Farbstoffe, die unter UV-A in eine farbige Form wechseln und im Schatten nach ein paar Minuten zurückschalten.',
        },
      },
      panel: {
        kid: [
          'Sonnenlicht gibt es in vielen Arten. Ultraviolett (UV) hat mehr Energie als das Licht, das wir sehen, und die stärksten Arten schaden Lebewesen.',
          'Hoch oben spaltet das stärkste UV, UV-C, Sauerstoffmoleküle (O2) in Atome, und jedes Atom verbindet sich mit einem anderen O2 zu Ozon (O3). Dann fängt das Ozon UV-B ein und zerbricht, und sein Atom verbindet sich wieder: eine Fabrik, die den ganzen Tag Ozon macht und zerlegt. Tippe auf jeden Filter und schau, was bei den Perlen ankommt.',
        ],
        sci: [
          'Der Chapman-Zyklus (Sydney Chapman, 1930): O₂ + Licht (λ < 242 nm) → 2 O; O + O₂ + M → O₃ + M; O₃ + Licht (λ < 320 nm) → O₂ + O; O + O₃ → 2 O₂. Ozon wird ständig gebildet und zerstört; das Gleichgewicht bestimmt, wie viel es gibt.',
          'O₂ absorbiert unter 242 nm und O₃ stark von etwa 200 bis 310 nm (die Hartley-Bande, Maximum bei etwa 255 nm): Kein UV-C erreicht den Boden und vom UV-B nur ein kleiner Teil, vor allem die längsten Wellen. UV-A (315 bis 400 nm) und sichtbares Licht gehen größtenteils durch. Der Bildschirm zeigt den Anteil, der 300 DU Ozon bei senkrecht stehender Sonne durchquert (nur das Ozon, ohne Streuung).',
        ],
      },
    },
    measure: {
      label: 'Ozon messen',
      title: 'Wie viel Ozon ist über uns?',
      signs: { dobson: 'Dobson-Spektrophotometer', log: 'Messbuch', coin: '1-Euro-Münze: 2,33 mm', scale: 'beide 10-mal größer', balloon: 'Ozonsonde' },
      chart: {
        month: 'Ozon über Halley, Monat für Monat',
        night: 'Mai bis Juli: Polarnacht, keine Sonne zum Messen',
        du: 'Dobson-Einheiten',
        ozone: 'Ozon',
        profile: 'Das Ozon des Ballons',
        km: 'km',
        layer: 'Ozonschicht',
        before: 'vor dem Loch',
        wait: 'Lass den Ballon steigen!',
      },
      verbs: { dobson: 'Das Ozon zusammenpressen', back: 'Wieder ausbreiten lassen', log: 'Ein anderes Jahrzehnt', balloon: 'Den Ballon steigen lassen' },
      hints: { dobson: 'Tippe auf das Dobson-Messgerät', balloon: 'Tippe auf den Ballon, um ihn steigen zu lassen', log: 'Tippe auf das Messbuch für ein anderes Jahrzehnt', more: 'Tippe auf das Diagramm für den nächsten Monat' },
      slider: 'Monat',
      rows: { month: 'Monat', era: 'Jahrzehnt', ozone: 'Ozon über Halley', thick: 'Am Boden zusammengepresst' },
      says: {
        squeeze: {
          kid: 'Auf den Luftdruck am Boden zusammengepresst, ergibt das ganze Ozon über uns eine Schicht von nur {mm} mm. Vergleich sie mit der Münze!',
          sci: '{du} DU: Bei 0 °C und 1 atm wäre die ganze Säule {mm} mm dick (1 DU = 0,01 mm, etwa 2,69 × 10²⁰ Moleküle pro Quadratmeter).',
        },
        back: {
          kid: 'Und wieder hinauf: Das echte Ozon ist über viele Kilometer Himmel verteilt.',
          sci: 'Zurück in seine echte Verteilung: Selbst in der Stratosphäre macht Ozon nur wenige Teile pro Million der Luft aus.',
        },
        e60: {
          kid: 'Die 1960er: vor dem Ozonloch. Im Frühling stieg das Ozon sogar an.',
          sci: '1960er: Oktobermittel um 300 DU, im November auf etwa 350 steigend, wenn der Polarwirbel zerfällt.',
        },
        e70: {
          kid: 'Die 1970er: Im Frühling ist schon etwas weniger Ozon da.',
          sci: '1970er: September- und Oktobermittel schon etwa 20 DU niedriger als in den 1960ern.',
        },
        e80: {
          kid: 'Die 1980er: Im Frühling fehlt ein Drittel des Ozons. Genau das haben die Forschenden in Halley bemerkt!',
          sci: '1980er: Oktobermittel um 200 DU. Farman, Gardiner und Shanklin vom British Antarctic Survey veröffentlichten den Rückgang im Mai 1985 in Nature.',
        },
        e90: {
          kid: 'Die 1990er: Jeden Frühling verschwand mehr als die Hälfte des Ozons über Halley!',
          sci: '1990er: Oktobermittel um 140 DU; der niedrigste Monat, Oktober 1993, hatte 122 DU.',
        },
        spring: {
          kid: 'September und Oktober: Frühling, wenn die Sonne zurückkommt. In den Jahren des Lochs fiel das Ozon genau dann.',
          sci: 'Der Abbau braucht Licht auf dem Chlor, das im Dunkeln freigesetzt wurde: Er läuft von Ende August bis Oktober und endet, wenn der Polarwirbel im November oder Dezember zerfällt.',
        },
        launch: {
          kid: 'Los geht es! Der Ballon trägt ein kleines Ozonmessgerät über 30 km hoch und funkt seine Messwerte zurück.',
          sci: 'Eine Ozonsonde: In ihrer elektrochemischen Zelle reagiert Ozon mit Kaliumiodidlösung, und der Strom zeigt das Ozon an. Sie steigt etwa 5 m/s und platzt bei etwa 30 bis 35 km.',
        },
        burst: {
          kid: 'Peng! Der Ballon ist hoch oben geplatzt. Im Diagramm ist der große Bauch die Ozonschicht.',
          sci: 'Ein vollständiges Profil: das meiste Ozon zwischen etwa 12 und 28 km, sein Maximum bei etwa 18 km.',
        },
        burstHole: {
          kid: 'Peng! Schau auf das Diagramm: In diesem Frühling ist die Mitte der Ozonschicht fast leer!',
          sci: 'Frühlingsabbau: Zwischen etwa 14 und 22 km ist fast kein Ozon mehr, wie die Südpol-Sondierungen der NOAA zeigen (90 % oder mehr zerstört).',
        },
        coin: {
          kid: 'Eine echte 1-Euro-Münze ist 2,33 mm dick: Die zusammengepresste Ozonschicht ist ungefähr so dünn!',
          sci: '1-Euro-Münze: 23,25 mm Durchmesser, 2,33 mm dick. Sie und die Platte sind 10-mal größer dargestellt.',
        },
      },
      panel: {
        kid: [
          'Ein Dobson-Spektrophotometer schaut in die Sonne und vergleicht zwei Arten von ultraviolettem Licht: eine, die Ozon schluckt, und eine, die es durchlässt. Der Unterschied zeigt, wie viel Ozon über uns ist.',
          'Auf den Druck am Boden zusammengepresst, wäre das ganze Ozon über uns nur etwa 3 mm dick! Geh die Monate durch, schau dir im Messbuch ein anderes Jahrzehnt an und lass einen Ballon steigen, um zu sehen, wie hoch das Ozon ist.',
        ],
        sci: [
          'G. M. B. Dobsons Spektrophotometer (1920er) vergleicht Paare von UV-Wellenlängen, eine stark und eine schwach vom Ozon absorbiert (zum Beispiel 305,5 und 325,4 nm); das Verhältnis ergibt die Gesamtozonsäule in Dobson-Einheiten, wobei 1 DU 0,01 mm reinem Ozon bei 0 °C und 1 atm entspricht. Halleys Messreihe begann 1956; das Gerät braucht die Sonne, deshalb läuft die Saison von Ende August bis Mitte April.',
          'In den 1980ern fiel das Oktobermittel von etwa 300 DU auf unter 200 DU: Joe Farman, Brian Gardiner und Jonathan Shanklin vom British Antarctic Survey berichteten es im Mai 1985 in Nature. Das Diagramm zeigt Halleys vorläufige Monatsmittel nach Jahrzehnten (BAS, J. Shanklin); die Ballonprofile sind ein an diese Mittel angepasstes Modell.',
        ],
      },
    },
    fix: {
      label: 'Die Rettung',
      title: 'Wie die Welt das Loch geschlossen hat',
      signs: {
        can: 'Spraydose',
        fridge: 'alter Kühlschrank',
        cloud: 'Eiswolke',
        sun: 'Frühlingssonne',
        treaty: 'MONTREALER PROTOKOLL',
        treatyAll: 'über Stoffe, die zu einem Abbau der Ozonschicht führen. Von allen Ländern ratifiziert.',
        nobel: 'Nobelpreis für Chemie 1995',
        diorama: '20 km über der Antarktis',
        years: 'das dauert Jahre',
        nocfc: 'kein FCKW',
        count: 'zerlegtes Ozon',
        max: '100.000',
      },
      chart: { title: 'Halley über die Jahre', ozone: 'Ozon im Oktober', chlorine: 'Chlor hoch oben', found: 'Loch entdeckt', treaty: 'Montreal', back: 'wie 1980', expected: 'erwartet' },
      verbs: { can: 'Die Spraydose sprühen', fridge: 'Den alten Kühlschrank öffnen', cloud: 'Winter: die Eiswolke', sun: 'Frühling: Die Sonne kommt zurück', treaty: 'Der Vertrag', again: 'Von vorn' },
      hints: {
        cfc: 'Tippe auf die Spraydose oder den Kühlschrank',
        wait: 'Schau, wie das FCKW aufsteigt',
        cloud: 'Tippe auf die Eiswolke',
        sun: 'Tippe auf die Frühlingssonne',
        watch: 'Schau dem Chlor bei der Arbeit zu',
        treaty: 'Tippe auf den Vertrag an der Wand',
        years: 'Tippe auf das Diagramm und schieb die Jahre',
        end: 'Schieb die Jahre in die Zukunft',
      },
      slider: 'Jahr',
      rows: { year: 'Jahr', ozone: 'Ozon über Halley im Oktober', chlorine: 'Chlor und Brom hoch oben' },
      says: {
        cfc: {
          kid: 'Psst! Heraus kommen FCKW, Gase, die früher in Spraydosen und Kühlschränken steckten. Hier unten sind sie harmlos, aber sie schweben langsam ganz nach oben.',
          sci: 'FCKW-12 (CFC-12), CCl₂F₂, Kältemittel und Treibgas: in der unteren Atmosphäre reaktionsträge, hält es etwa ein Jahrhundert und wird über mehrere Jahre in die Stratosphäre getragen.',
        },
        arrive: {
          kid: 'Jahre später erreicht es die Ozonschicht. Starkes Sonnenlicht zerlegt hier oben das FCKW, aber sein Chlor wird gleich weggeschlossen, vorerst.',
          sci: 'In der Stratosphäre spaltet kurzwelliges UV das FCKW; sein Chlor landet vor allem in Reservoirmolekülen, HCl und ClONO₂, die das Ozon nicht angreifen.',
        },
        nocfc: {
          kid: 'Da oben ist noch kein FCKW: Tippe zuerst auf die Spraydose oder den Kühlschrank.',
          sci: 'Noch kein Chlor da oben: Setz zuerst ein FCKW frei.',
        },
        cloud: {
          kid: 'Polarwinter: dunkel und kälter als −78 °C. Eiswolken bilden sich, und auf ihrem Eis wird das weggeschlossene Chlor als Cl2 freigesetzt.',
          sci: 'Polare Stratosphärenwolken bilden sich unter etwa −78 °C (195 K); auf ihren Teilchen läuft HCl + ClONO₂ → Cl₂ + HNO₃, und gespeichertes Chlor wird zu Cl₂, das Licht spalten kann.',
        },
        cloudDone: {
          kid: 'Das Chlor ist schon frei. Jetzt tippe auf die Frühlingssonne!',
          sci: 'Schon aktiviert: Jetzt die Sonne.',
        },
        cloudLate: {
          kid: 'Der Frühling ist da: Die Eiswolken verschwinden.',
          sci: 'Der Wirbel erwärmt sich: Die Wolken sind weg.',
        },
        sunFirst: {
          kid: 'Zuerst muss das Chlor frei werden: Tippe auf die Eiswolke.',
          sci: 'Licht allein bewirkt bei HCl und ClONO₂ wenig: Erst müssen die Wolken das Chlor aktivieren.',
        },
        sunLate: {
          kid: 'Dieser Frühling ist vorbei. Tippe auf die Dose oder den Kühlschrank für ein neues Jahr, oder auf den Vertrag.',
          sci: 'Der Abbau dieses Frühlings ist vorbei.',
        },
        spring: {
          kid: 'Die Frühlingssonne spaltet das Cl2 in zwei Chloratome, und jedes zerlegt ein Ozon nach dem anderen! Ein einziges Chloratom kann mehr als 100.000 Ozonmoleküle zerstören, bevor es eingefangen wird.',
          sci: 'Cl₂ + Licht → 2 Cl; Cl + O₃ → ClO + O₂ (zweimal); ClO + ClO → Cl₂O₂; Cl₂O₂ + Licht → 2 Cl + O₂. Insgesamt 2 O₃ → 3 O₂, und das Chlor ist jedes Mal wieder frei: Die US-Umweltbehörde EPA schätzt, dass ein Chloratom mehr als 100.000 Ozonmoleküle zerstören kann.',
        },
        caught: {
          kid: 'Endlich wird das Chlor wieder eingefangen und weggeschlossen, aber das meiste Ozon hier ist weg: Das ist das Ozonloch.',
          sci: 'Wenn sich der Wirbel erwärmt, kehrt das Chlor in HCl und ClONO₂ zurück; bis dahin ist das meiste Ozon zwischen etwa 14 und 22 km verschwunden.',
        },
        treaty: {
          kid: '1987: Länder trafen sich in Montreal und vereinbarten, keine FCKW mehr herzustellen. Später machten alle Länder der Welt mit: zum ersten Mal überhaupt bei einem Vertrag der Vereinten Nationen!',
          sci: 'Das Montrealer Protokoll, unterzeichnet am 16. September 1987, und seine Änderungen beendeten FCKW, Halone und andere ozonabbauende Gase (FCKW weltweit bis 2010). Am 16. September 2009 wurden es und das Wiener Übereinkommen die ersten Verträge in der Geschichte der UN, die alle Länder ratifiziert haben.',
        },
        canAfter: {
          kid: 'Nicht mehr! Dank des Vertrags benutzen neue Sprays und Kühlschränke andere Gase, die dem Ozon nicht schaden.',
          sci: 'Ersetzt durch Kohlenwasserstoffe, HFKW und andere Gase; die HFKW, starke Treibhausgase, werden nun ebenfalls verringert, nach der Kigali-Änderung von 2016.',
        },
        again: {
          kid: 'Ein neues Jahr: Über den Sommer ist das Ozon zurückgekommen. Aber das Chlor ist noch da oben, also wird das Ozon im nächsten Frühling wieder zerlegt, bis die FCKW weg sind.',
          sci: 'Jeden Sommer erholt sich das Ozon; jeden Frühling zerstört das Chlor, das noch in der Stratosphäre ist, es erneut, solange die FCKW halten.',
        },
        oneAtATime: {
          kid: 'Verfolgen wir erst dieses eine: Tippe auf die Eiswolke oder die Frühlingssonne.',
          sci: 'Ein FCKW nach dem anderen: Verfolge dieses durch Winter und Frühling.',
        },
        future: {
          kid: 'Schau auf den Globus: Das Loch heilt! Über der Antarktis sollte das Ozon um 2066 wieder so sein wie 1980.',
          sci: 'Der WMO/UNEP-Bericht von 2022: Mit den heutigen Regeln kehrt das Ozon über der Antarktis um 2066 zu den Werten von 1980 zurück, über der Arktis um 2045, über dem Rest der Welt um 2040.',
        },
        end: {
          kid: 'Menschen haben die Gefahr bemerkt, sich geeinigt, was zu tun ist, und sie gemeinsam gebannt. Diese Geschichte lohnt sich zu merken!',
          sci: 'Molina und Rowland warnten 1974 vor FCKW; mit Paul Crutzen teilten sie den Nobelpreis für Chemie 1995. Messungen, Theorie und ein Vertrag, den alle Länder einhalten: Die Ozonschicht erholt sich.',
        },
        globe: {
          kid: 'Dieser Globus zeigt das Ozon über der Antarktis im Oktober, im Jahr auf dem Schieberegler. Dunkel heißt Loch.',
          sci: 'Das Loch, gezeichnet nach Halleys Oktobermittel im gewählten Jahr: gemessen bis 2025, danach erwartet.',
        },
        nobel: {
          kid: 'Mario Molina, Sherwood Rowland und Paul Crutzen bekamen den Nobelpreis dafür, dass sie erklärt haben, wie Ozon entsteht und zerfällt.',
          sci: 'Nobelpreis für Chemie 1995: Paul J. Crutzen, Mario J. Molina und F. Sherwood Rowland, für ihre Arbeiten zur Chemie der Atmosphäre, besonders zur Bildung und zum Abbau von Ozon.',
        },
      },
      panel: {
        kid: [
          'FCKW waren praktische Gase für Spraydosen und Kühlschränke. Jahre nachdem sie aufgestiegen sind, bildet der kalte, dunkle Polarwinter Eiswolken, die ihr Chlor freisetzen, und wenn im Frühling die Sonne zurückkommt, zerlegt jedes Chloratom ein Ozon nach dem anderen. So entsteht das Ozonloch.',
          '1987 vereinbarten Länder in Montreal, keine FCKW mehr herzustellen, und am Ende machten alle Länder mit. Schieb die Jahre: Das Chlor verschwindet langsam, und das Loch heilt, bis es um 2066 wieder so ist wie 1980.',
        ],
        sci: [
          'Chlor aus FCKW (und Brom aus Halonen) wird als HCl und ClONO₂ gespeichert, bis polare Stratosphärenwolken unter etwa −78 °C es in Cl₂ verwandeln. Das Frühlingslicht treibt dann den ClO-Dimer-Zyklus an (1987 von Luisa und Mario Molina beschrieben), der Ozon am schnellsten zwischen etwa 14 und 22 km zerstört.',
          'Mit dem Montrealer Protokoll (1987) wurden die Gase abgeschafft. Chlor und Brom über der Antarktis (als EESC, NOAA) erreichten 2001 und 2002 ihr Maximum von etwa 4,15 ppb; bis 2024 waren sie etwa ein Viertel des Weges zurück zum Stand von 1980 gefallen, der um 2070 erwartet wird. Der WMO/UNEP-Bericht von 2022 erwartet das Ozon über der Antarktis um 2066 zurück bei den Werten von 1980. Das Diagramm: Halleys Oktobermittel (Dobson des BAS; Satellit, wo der Dobson Lücken hat) und das EESC der NOAA, die Jahre vor 1980 skizziert.',
        ],
      },
    },
  },
}
