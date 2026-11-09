// The words of germanium's deep room ("Why hide a crystal under a mountain?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Ge.js (the easel shows it); the room adds the things to do.
// Sources and numbers, checked for this room:
// - The Laboratori Nazionali del Gran Sasso (INFN): under the Gran Sasso massif, reached from the 10 km
//   motorway tunnel (A24); three big halls (A, B, C), each about 100 m long, 20 m wide and 18 m high; at least
//   1400 m of rock overhead, 3800 m of water equivalent (2.7 g/cm3 x 1400 m = 3780). The muon flux there is
//   about a million times lower than at the surface: Borexino measured 3.41 x 10^-4 per m2 per second, about
//   1.2 per m2 per hour. At sea level muons cross a flat surface at about 1 per cm2 per minute (PDG), 6 x 10^5
//   per m2 per hour, i.e. about 170 per m2 per second: 170 / 3.4e-4 = 5 x 10^5, "of the order of a million".
//   The curve between the two ends (10^(-5.7 (d/1400)^0.9)) is the room's own smooth sketch, said so in the
//   panel; the clicks are slowed to be heard, said so too.
// - Zone refining: W. G. Pfann, Bell Labs, 1951 (Trans. AIME 194, 747, 1952), invented to purify germanium for
//   transistors. For an impurity with a segregation coefficient below 1 the liquid keeps it and the zone sweeps
//   it to the end. FLAGGED: boron in germanium has a coefficient above 1 (about 17, Trumbore 1960; not
//   re-checked in the original), so the words say only "above 1". The gauge is the room's example: a start of
//   99.9999 % germanium (4.4 x 10^22 atoms per cm3, so 4 x 10^16 others), a quarter kept per pass (a model, said
//   so), 12 passes giving 2.4 x 10^9; HPGe net impurities near 10^10 per cm3 (the board; ORTEC and Canberra
//   quote <= 10^10).
// - Gamma lines of cobalt-60: 1173.2 and 1332.5 keV (nickel-60). Compton edges 963 and 1118 keV (computed from
//   E 2E/(2E + 511)). HPGe resolution about 1.9 keV FWHM at 1332 keV, 0.14 % (the board says about 0.15 %);
//   about 3 eV per electron-hole pair (2.96 eV at 77 K), so 1332 keV frees about 450 000 pairs; liquid nitrogen
//   77 K = -196 C. NaI(Tl) about 7 % at 662 keV (cesium-137), scaled as 1/sqrt(E) to about 5 % (65 keV) at 1332.
//   The room's counts are made up to show the shapes.
// - Germanium-76: 7.75 % of natural germanium (elements.json), enriched to about 90 % for the detectors;
//   2-neutrino double-beta decay half-life about 1.9 x 10^21 years (GERDA measured 1.926; the board says about
//   1.9); 40 kg x 1000 / 75.92 x 6.022e23 = 3.17e26 atoms, x ln2 / 1.9e21 = 1.16e5 a year, about 320 a day
//   (the design's "about 8 a day per kg"). Q(bb) = 2039 keV (GERDA 2039.061). The 2-neutrino spectrum's shape:
//   Doi, Kotani and Takasugi 1985 (K (T0-K)^5 times a polynomial). GERDA's final result: T1/2 (0nubb) above
//   1.8 x 10^26 years at 90 % confidence (Phys. Rev. Lett. 125, 252502, 2020); its array had about 36 kg of
//   enriched germanium; background about 5 x 10^-4 counts per keV, kg and year (FLAGGED, quoted from memory);
//   GERDA's water tank 10 m across and its argon cryostat (64 m3) are used by LEGEND-200 (first data 2023, up to
//   200 kg of detectors, FLAGGED: check what it holds now); LEGEND-1000 (a tonne) is planned. If T1/2 were
//   exactly 1.8e26 years, 3.17e26 x ln2 / 1.8e26 = 1.2 decays a year for 40 kg.
// - Liquid argon boils at 87 K = -186 C. The universe is 1.38 x 10^10 years old: 1.9e21 / 1.38e10 = 1.4e11.
export const DEEP_WORDS = {
  en: {
    title: 'Hall A, under the mountain',
    greet: {
      kid: "We are inside the picture, in a huge hall dug under a mountain in Italy, with 1400 metres of rock above our heads. Cosmic rays rain on the mountain from space, but hardly any get down here. On the left, see how the rock stops them. On the right, see how germanium is made so pure. In the middle, the long wait. The picture's story is on the easel.",
      sci: "Hall A of the Laboratori Nazionali del Gran Sasso, under at least 1400 m of rock (3800 m of water equivalent); the real hall is 100 m long, 20 m wide and 18 m high. At the far end, the water tank of GERDA and now LEGEND-200, scaled down to fit. Left: the muon flux against depth. Right: zone refining and gamma-ray spectra. Middle: the search for neutrinoless double-beta decay. The picture's story is on the easel.",
    },
    talk: {
      kid: [
        'Cosmic rays come from space all the time. One kind, the muon, goes through your hand about once every second. Down here it is only about once an hour for a whole square metre.',
        'Germanium for these detectors is so pure that fewer than one atom in a million million is something else. A crystal that clean can feel one tiny particle.',
        'The crystals in the tank are kept in liquid argon, colder than any freezer, about minus 186 degrees. Cold keeps them quiet enough to listen.',
        'The way here is a motorway tunnel, 10 kilometres long, and a side tunnel leads to this hall. That is how the scientists get in.',
      ],
      sci: [
        'Cosmic-ray muons cross a flat surface at sea level at about 1 per cm² per minute. In this hall the measured flux is about 3.4 × 10⁻⁴ per m² per second, a reduction of the order of a million.',
        'High-purity germanium has net impurities near 10¹⁰ per cm³ against 4.4 × 10²² germanium atoms per cm³: about one atom in 4 × 10¹².',
        'Germanium-76 is 7.75% of natural germanium; the detectors are enriched to about 90%. The germanium is both the source and the detector, so the two electrons give their whole energy to the crystal.',
        'The two-neutrino decay of ⁷⁶Ge has a half-life near 1.9 × 10²¹ years. GERDA showed the neutrinoless one is longer than 1.8 × 10²⁶ years (2020), some 10⁵ times longer.',
      ],
    },
    leave: {
      kid: 'Before you go: an empty line is an answer too. Physicists will keep listening at that gold line for years, and if it ever lights up, it will be a big discovery. The easel has the whole story.',
      sci: 'Before you go: an empty line is a result too. Every year of data without an event raises the lower limit on the half-life. LEGEND-200 is taking data, and a tonne-scale LEGEND-1000 is planned.',
    },
    rain: {
      label: 'The rain from space',
      title: 'Rain from space, stopped by rock',
      tags: { ruler: 'rock above (m)', hall: 'Hall A', road: 'road tunnel', sky: 'cosmic rays', counter: 'MUON COUNTER', unit: 'per m2 per hour' },
      hints: { dig: 'Tap the mountain, deeper down', sky: 'Tap the sky for a shower', deeper: 'Tap the mountain even deeper', counter: 'Tap the counter' },
      slider: 'Rock above the counter',
      buttons: { top: 'On the surface', half: 'Half way down', hall: 'In the hall', sky: 'A shower from the sky', counter: 'Read the counter' },
      rows: { depth: 'Rock above', rate: 'Muons through one square metre', less: 'Compared with the surface', rock: 'As a depth of water' },
      units: { rate: 'per m² per hour', mwe: 'm of water' },
      says: {
        top: { kid: 'On the surface the counter rattles: about 170 muons go through every square metre, every second.', sci: 'At the surface: about 1 muon per cm² per minute, 6 × 10⁵ per m² per hour.' },
        half: { kid: 'Half way down, the rock has already stopped most of them. The rattle is a slow patter.', sci: 'Half way: the curve here is a smooth sketch between the two measured ends.' },
        hall: {
          kid: 'In the hall the counter clicks only now and then: about once for every square metre, every hour. The rock keeps out about a million times more than the surface lets in.',
          sci: 'In the hall: about 1 per m² per hour (3.4 × 10⁻⁴ per m² per second, Borexino), of the order of a million times fewer. The clicks here are sped up so you can hear them.',
        },
        shower: { kid: 'A shower of {n} particles: they all stopped in the rock, the deepest at about {c} m.', sci: '{n} particles drawn from the model: all stopped, the deepest at about {c} m of rock.' },
        reached: { kid: 'A shower of {n}, and one got all the way down to the hall! That is very, very rare.', sci: 'One of the {n} crossed the full 1400 m. In this model that is about one in half a million.' },
        count: { kid: 'Here, {d} m down: {r} muons through every square metre, every hour.', sci: '{d} m of rock: {r} per m² per hour.' },
      },
      panel: {
        kid: [
          'Cosmic rays come from space and crash into the air, making showers of particles. The ones that reach the ground are mostly muons, a bit like heavy cousins of the electron. About one goes through your hand every second.',
          'Rock stops most of them. Tap the mountain, or slide the slider, to put the counter deeper: the rattle slows and slows. Tap the sky to send a shower and see how deep each particle gets.',
          'In the hall, under 1400 metres of rock, a muon comes through a square metre only about once an hour. That is why the germanium crystals hang here: almost nothing from space can disturb them.',
        ],
        sci: [
          'Cosmic-ray muons, made in showers high in the atmosphere, cross a horizontal surface at sea level at roughly 1 per cm² per minute (6 × 10⁵ per m² per hour). The Gran Sasso halls lie under at least 1400 m of rock, about 3800 m of water equivalent.',
          'There the measured muon flux is about 3.4 × 10⁻⁴ per m² per second (Borexino), roughly 1 per m² per hour: a reduction of the order of a million. The curve between the two ends is a smooth sketch (10 to the power of −5.7 at 1400 m), not a measurement.',
          'Each streak stops at a depth drawn from that curve: most stop in the first few hundred metres and only the most energetic muons go deep. The counter keeps the real order of the rates but is slowed to be heard; the real surface rate would be a roar.',
        ],
      },
    },
    pure: {
      label: 'The purest crystal',
      title: 'Zone refining and a gamma-ray test',
      tags: { ring: 'heater ring', ingot: 'germanium bar', source: 'cobalt-60', ge: 'germanium detector', nai: 'sodium iodide' },
      hints: { ring: 'Tap the heater ring', again: 'Tap the heater ring again', source: 'Tap the cobalt source', zoom: 'Zoom in with the slider', done: 'Tap the source for more counts' },
      slider: 'Passes of the heater',
      zoom: 'Zoom in on the lines',
      buttons: { pass: 'One more pass', fresh: 'A new bar', source: 'Switch on the cobalt source', clear: 'Clear the screens' },
      rows: { passes: 'Passes', atoms: 'Other atoms in each cm³', shots: 'Minutes of counting', share: 'As a share of all atoms' },
      units: { cm3: 'per cm³' },
      says: {
        first: {
          kid: 'The heater melts a short stretch of the bar and slides along it. The melted bit holds on to the specks, so they ride along with it to the end.',
          sci: 'The molten zone keeps the impurities that prefer the liquid and carries them to the end of the bar: zone refining (Pfann, Bell Labs, 1951).',
        },
        three: {
          kid: 'After three passes you can hardly see any specks. But there are still atoms too small to see, so the gauge keeps counting down.',
          sci: 'Most visible specks have gone, but the gauge counts atoms: in this example each pass leaves a quarter of the impurity.',
        },
        five: { kid: 'Five passes, and the gauge is still falling.', sci: 'Five passes: 4 × 10¹⁶ × (1/4)⁵ is about 4 × 10¹³ per cm³.' },
        last: { kid: 'Twelve passes: purer than a detector needs!', sci: 'Twelve passes: 2.4 × 10⁹ per cm³, below the 10¹⁰ of a detector crystal. Real bars need more care, and the crystal is then grown from the purified metal.' },
        max: { kid: 'That is enough passes for this bar. Start a new one to try again.', sci: 'Twelve passes is the most this model runs. Start a new bar to begin again.' },
        hpge: { kid: 'The gauge has crossed the gold line: this germanium is pure enough for a detector!', sci: 'Below 10¹⁰ per cm³: pure enough for a detector crystal.' },
        source: {
          kid: 'The cobalt-60 source sends out two exact amounts of energy as gamma rays. The germanium detector draws two sharp lines. The sodium iodide detector draws only two blurry humps.',
          sci: 'Cobalt-60 emits gamma rays of 1173.2 and 1332.5 keV. The germanium detector separates them (about 1.9 keV wide at 1332 keV, 0.14%); the sodium iodide one (about 7% at 662 keV, about 5% here) blurs them into humps.',
        },
        again: { kid: 'More counts. Zoom in with the slider to see how thin the germanium lines are.', sci: 'More counts: the lines grow, their width does not.' },
        ge: {
          kid: 'A germanium crystal, kept cold by liquid nitrogen at minus 196 degrees. Every gamma ray that stops in it makes a tiny pulse of electricity, as big as the energy the ray carried.',
          sci: 'An HPGe detector, cooled by liquid nitrogen (77 K). One electron-hole pair per about 3 eV absorbed: a 1332 keV gamma ray frees about 450 000 pairs, and the charge collected measures its energy.',
        },
        nai: {
          kid: 'A sodium iodide crystal with a dash of thallium. It flashes when a gamma ray hits it, and a tube turns the flash into electricity. It catches more rays but measures their energy less exactly.',
          sci: 'A NaI(Tl) scintillator with a photomultiplier: about 7% resolution at 662 keV (cesium-137), about 5% at 1332 keV; high efficiency, poor energy resolution.',
        },
      },
      board: {
        title: 'IMPURITY ATOMS',
        unit: 'per cm3',
        hpge: 'detector crystal',
        passes: 'passes',
        enough: 'pure enough!',
        more: 'purer, keep going',
        sci: 'an example: each pass keeps 1/4 of the impurity',
        empty: 'no counts yet',
        ge: 'germanium',
        nai: 'sodium iodide',
        geFw: 'width 1.9 keV (0.14%)',
        naiFw: 'width 65 keV (4.9%)',
        keV: 'energy in keV',
      },
      panel: {
        kid: [
          'Detectors need germanium purer than almost anything. In 1951 William Pfann at Bell Labs found a way: melt a short stretch of the bar and slide the heater slowly along. Impurities like to stay in the liquid, so the melted zone carries them to the end, which is cut off.',
          'Tap the heater ring for each pass. The specks you can see are gone after a few passes, but the gauge keeps counting the atoms too small to see. Its gold line is the purity of a detector crystal.',
          'A crystal that pure measures energy very exactly. Tap the cobalt source: the germanium detector (top) draws two thin lines, the sodium iodide detector (bottom) only two blurry humps. Slide the zoom to see it.',
        ],
        sci: [
          'Zone refining: a molten zone a few centimetres long travels along the bar, and an impurity with a segregation coefficient below 1 stays in the liquid and is swept to the end (Pfann, Bell Labs, 1951, first used to purify germanium for transistors). A few impurities, boron in germanium among them, have a coefficient above 1 and go the other way.',
          'The gauge is an example: the starting metal is 99.9999% germanium (4 × 10¹⁶ foreign atoms per cm³ among 4.4 × 10²² germanium atoms per cm³) and each pass keeps a quarter. A real HPGe crystal has net impurities near 10¹⁰ per cm³, about one atom in 4 × 10¹²; the crystal is then grown from the refined metal.',
          'Cobalt-60 decays to nickel-60, which emits 1173.2 and 1332.5 keV. An HPGe diode (about 3 eV per electron-hole pair, kept near 77 K) reaches about 0.14% at 1332 keV; NaI(Tl) about 5%. Below each line lies its Compton shelf, ending at 963 and 1118 keV. The counts here are made up to show the shapes.',
        ],
      },
    },
    wait: {
      label: 'The long wait',
      title: 'Waiting for a decay nobody has seen',
      tags: { tank: 'the water tank, scaled down', argon: 'liquid argon', model: 'model of the crystal array', run: 'RUN 1 YEAR', lens: 'ONE DECAY' },
      hints: { run: 'Tap the green button', crystal: 'Tap a crystal', lens: 'Tap the lens', more: 'Run one more year', done: 'Tap a crystal, or the lens, again' },
      slider: 'Years of waiting',
      units: { years: 'years' },
      buttons: { year: 'Wait one more year', reset: 'Empty the screen', hoped: 'Show the decay everyone hopes for', usual: 'Back to the usual decay', decay: 'Watch a decay in the lens' },
      rows: { years: 'Years of waiting', events: 'Decays so far', perDay: 'Decays a day', window: 'Counted in the 2039 keV line', expect: 'A year in the line, if the half-life were exactly the limit' },
      says: {
        enough: { kid: 'Five years is the most this screen shows. Empty it to wait again.', sci: 'Five years is the longest run here. Empty the screen to start again.' },
        first: {
          kid: 'A year of waiting: about 117 000 ordinary decays. Each one is two electrons leaving a crystal, and both leave their energy behind.',
          sci: 'One year, 40 kg of germanium-76: about 1.2 × 10⁵ two-neutrino decays, from N ln 2 / T½ with T½ = 1.9 × 10²¹ years.',
        },
        last: {
          kid: 'Five years, and the gold line at 2039 is still empty. Waiting for an empty line is real science: it tells us how rare the decay is.',
          sci: 'Five years: still nothing at 2039 keV. This model has no background; real experiments work very hard to have almost none.',
        },
        decay: {
          kid: 'One germanium-76 atom: two neutrons turn into two protons at the same moment, and two electrons fly out, with two almost invisible partners called antineutrinos. The crystal measures the electrons. The neutrinos carry the rest away.',
          sci: 'Two-neutrino double-beta decay: ⁷⁶Ge becomes ⁷⁶Se. The detector records the electrons’ summed energy (a broad spectrum up to 2039 keV); the two antineutrinos escape unseen.',
        },
        hoped: {
          kid: 'The decay everyone hopes for: no neutrinos leave, so the two electrons carry all the energy, always the same amount: a sharp line at 2039. Nobody has ever seen it.',
          sci: 'Neutrinoless double-beta decay: both electrons carry the full Q = 2039 keV, a sharp line. It can exist only if the neutrino is its own antiparticle. GERDA: half-life above 1.8 × 10²⁶ years (2020).',
        },
        modeOn: { kid: 'The lens now shows the decay everyone hopes for. Tap a crystal to watch it.', sci: 'Lens set to neutrinoless double-beta decay (never observed). Tap a crystal.' },
        modeOff: { kid: 'Back to the usual decay, the one that really happens.', sci: 'Back to the two-neutrino decay, the one that has been measured.' },
      },
      board: {
        title: 'ENERGY OF THE TWO ELECTRONS',
        years: 'years',
        keV: 'energy in keV',
        line: 'counted in the line',
        ifSeen: 'it would look like this: never seen',
        thisOne: 'this one:',
        events: 'decays',
        sci: 'two-neutrino half-life 1.9e21 y, neutrinoless above 1.8e26 y',
        se: 'selenium-76',
        ge76: 'germanium-76',
        nuModeOn: 'tap the lens: the decay everyone hopes for',
        nuModeOff: 'tap the lens: back to the usual decay',
        noNu: 'no neutrinos: all the energy in the electrons',
        twoNu: 'two antineutrinos slip away',
        electrons: 'electrons',
        nus: 'antineutrinos',
        waiting: 'tap a crystal',
        twoAtOnce: 'two neutrons turn into protons at once',
        nucSci: 'a few of the 76 nucleons',
      },
      panel: {
        kid: [
          'Inside the tank the crystals hang in liquid argon. Germanium-76 is both the thing that might decay and the detector that notices. Tap the green button, or slide the slider, to wait year after year.',
          'Every year about a hundred thousand ordinary decays happen in this model, building up the hump. The gold line at 2039 stays empty: it is where the very rare decay would show up.',
          'Tap a crystal to look at one decay in the lens. Then tap the lens to see the decay everyone hopes for. Physicists keep waiting and checking, because one day it might be there.',
        ],
        sci: [
          'The model holds 40 kg of germanium-76 (GERDA’s array had about 36 kg of enriched detectors; LEGEND-200 holds up to 200 kg). For a two-neutrino half-life of 1.9 × 10²¹ years, N ln 2 / T½ gives about 320 decays a day, 1.2 × 10⁵ a year.',
          'The hump is the summed kinetic energy of the two electrons, K (Q − K)⁵ times a polynomial (Doi, Kotani and Takasugi), up to Q = 2039 keV. Nothing else is simulated: real spectra also hold the background of other radioactivity, which GERDA pushed down to about 5 × 10⁻⁴ counts per keV, kilogram and year.',
          'If the neutrinoless decay had exactly the limit’s half-life, 1.8 × 10²⁶ years, these 40 kg would give about 1.2 decays a year in the line. That is why experiments need hundreds of kilogram-years of data and almost no background.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Sala A, debaixo da montanha',
    greet: {
      kid: 'Estamos dentro da imagem, numa sala enorme escavada debaixo de uma montanha em Itália, com 1400 metros de rocha por cima das nossas cabeças. Os raios cósmicos chovem do espaço sobre a montanha, mas quase nenhum chega cá abaixo. À esquerda, vê como a rocha os pára. À direita, vê como se faz o germânio tão puro. No meio, a longa espera. A história da imagem está no cavalete.',
      sci: 'A Sala A dos Laboratori Nazionali del Gran Sasso, debaixo de pelo menos 1400 m de rocha (3800 m de água equivalente); a sala verdadeira tem 100 m de comprimento, 20 m de largura e 18 m de altura. Ao fundo, o tanque de água do GERDA e agora do LEGEND-200, em tamanho reduzido para caber. À esquerda: o fluxo de muões em função da profundidade. À direita: a refinação por zona e os espetros de raios gama. No meio: a procura do decaimento beta duplo sem neutrinos. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Os raios cósmicos chegam do espaço a toda a hora. Um tipo, o muão, atravessa a tua mão cerca de uma vez por segundo. Cá em baixo é só cerca de uma vez por hora num metro quadrado inteiro.',
        'O germânio para estes detetores é tão puro que menos de um átomo em cada milhão de milhões é outra coisa. Um cristal assim tão limpo consegue sentir uma só partícula minúscula.',
        'Os cristais do tanque ficam em árgon líquido, mais frio do que qualquer congelador, a cerca de 186 graus negativos. O frio mantém-nos sossegados o suficiente para ouvir.',
        'O caminho até aqui é um túnel de autoestrada com 10 quilómetros, e um túnel lateral leva a esta sala. É assim que os cientistas entram.',
      ],
      sci: [
        'Os muões dos raios cósmicos atravessam uma superfície plana ao nível do mar a cerca de 1 por cm² por minuto. Nesta sala o fluxo medido é cerca de 3,4 × 10⁻⁴ por m² por segundo, uma redução da ordem de um milhão.',
        'O germânio de alta pureza tem impurezas líquidas perto de 10¹⁰ por cm³, contra 4,4 × 10²² átomos de germânio por cm³: cerca de um átomo em 4 × 10¹².',
        'O germânio-76 é 7,75% do germânio natural; os detetores são enriquecidos a cerca de 90%. O germânio é ao mesmo tempo a fonte e o detetor, por isso os dois eletrões dão toda a sua energia ao cristal.',
        'O decaimento de dois neutrinos do ⁷⁶Ge tem meia-vida perto de 1,9 × 10²¹ anos. O GERDA mostrou que o decaimento sem neutrinos demora mais de 1,8 × 10²⁶ anos (2020), cerca de 10⁵ vezes mais.',
      ],
    },
    leave: {
      kid: 'Antes de ires: uma linha vazia também é uma resposta. Os físicos vão continuar a ouvir aquela linha dourada durante anos, e se um dia se acender, será uma grande descoberta. O cavalete tem a história toda.',
      sci: 'Antes de ires: uma linha vazia também é um resultado. Cada ano de dados sem um único evento sobe o limite inferior da meia-vida. O LEGEND-200 está a recolher dados, e está prevista uma experiência de uma tonelada, o LEGEND-1000.',
    },
    rain: {
      label: 'A chuva do espaço',
      title: 'Chuva do espaço, travada pela rocha',
      tags: { ruler: 'rocha por cima (m)', hall: 'Sala A', road: 'túnel da estrada', sky: 'raios cósmicos', counter: 'CONTADOR DE MUÕES', unit: 'por m2 por hora' },
      hints: { dig: 'Toca na montanha, mais para baixo', sky: 'Toca no céu para uma chuvada', deeper: 'Toca na montanha ainda mais fundo', counter: 'Toca no contador' },
      slider: 'Rocha por cima do contador',
      buttons: { top: 'À superfície', half: 'A meio caminho', hall: 'Na sala', sky: 'Uma chuvada do céu', counter: 'Ler o contador' },
      rows: { depth: 'Rocha por cima', rate: 'Muões por metro quadrado', less: 'Comparado com a superfície', rock: 'Como profundidade de água' },
      units: { rate: 'por m² por hora', mwe: 'm de água' },
      says: {
        top: { kid: 'À superfície o contador matraqueia: cerca de 170 muões atravessam cada metro quadrado, a cada segundo.', sci: 'À superfície: cerca de 1 muão por cm² por minuto, 6 × 10⁵ por m² por hora.' },
        half: { kid: 'A meio caminho, a rocha já parou a maior parte. O matraquear é um tamborilar lento.', sci: 'A meio caminho: a curva aqui é um esboço suave entre os dois extremos medidos.' },
        hall: {
          kid: 'Na sala, o contador só faz clique de vez em quando: cerca de uma vez por cada metro quadrado, a cada hora. A rocha deixa de fora cerca de um milhão de vezes mais do que a superfície deixa entrar.',
          sci: 'Na sala: cerca de 1 por m² por hora (3,4 × 10⁻⁴ por m² por segundo, Borexino), da ordem de um milhão de vezes menos. Os cliques aqui estão acelerados para os poderes ouvir.',
        },
        shower: { kid: 'Uma chuvada de {n} partículas: todas pararam na rocha, a mais funda a cerca de {c} m.', sci: '{n} partículas sorteadas no modelo: todas pararam, a mais funda a cerca de {c} m de rocha.' },
        reached: { kid: 'Uma chuvada de {n}, e uma chegou até à sala! É muito, muito raro.', sci: 'Uma das {n} atravessou os 1400 m todos. Neste modelo isso é cerca de uma em meio milhão.' },
        count: { kid: 'Aqui, a {d} m de profundidade: {r} muões por cada metro quadrado, a cada hora.', sci: '{d} m de rocha: {r} por m² por hora.' },
      },
      panel: {
        kid: [
          'Os raios cósmicos vêm do espaço e batem no ar, fazendo chuvadas de partículas. As que chegam ao chão são sobretudo muões, uma espécie de primos pesados do eletrão. Cerca de um atravessa a tua mão a cada segundo.',
          'A rocha pára a maior parte. Toca na montanha, ou mexe no cursor, para pôr o contador mais fundo: o matraquear abranda e abranda. Toca no céu para mandar uma chuvada e ver até onde chega cada partícula.',
          'Na sala, debaixo de 1400 metros de rocha, um muão só atravessa um metro quadrado cerca de uma vez por hora. É por isso que os cristais de germânio ficam aqui: quase nada do espaço os consegue perturbar.',
        ],
        sci: [
          'Os muões dos raios cósmicos, formados em chuveiros na alta atmosfera, atravessam uma superfície horizontal ao nível do mar a cerca de 1 por cm² por minuto (6 × 10⁵ por m² por hora). As salas do Gran Sasso estão debaixo de pelo menos 1400 m de rocha, cerca de 3800 m de água equivalente.',
          'Lá o fluxo de muões medido é cerca de 3,4 × 10⁻⁴ por m² por segundo (Borexino), mais ou menos 1 por m² por hora: uma redução da ordem de um milhão. A curva entre os dois extremos é um esboço suave (10 elevado a −5,7 aos 1400 m), não uma medição.',
          'Cada traço pára a uma profundidade sorteada a partir dessa curva: a maioria pára nas primeiras centenas de metros e só os muões mais energéticos vão fundo. O contador mantém a ordem real das taxas mas está abrandado para se ouvir; a taxa real à superfície seria um rugido.',
        ],
      },
    },
    pure: {
      label: 'O cristal mais puro',
      title: 'Refinação por zona e um teste com raios gama',
      tags: { ring: 'anel de aquecimento', ingot: 'barra de germânio', source: 'cobalto-60', ge: 'detetor de germânio', nai: 'iodeto de sódio' },
      hints: { ring: 'Toca no anel de aquecimento', again: 'Toca outra vez no anel', source: 'Toca na fonte de cobalto', zoom: 'Aproxima com o cursor', done: 'Toca na fonte para mais contagens' },
      slider: 'Passagens do aquecedor',
      zoom: 'Aproximar as linhas',
      buttons: { pass: 'Mais uma passagem', fresh: 'Uma barra nova', source: 'Ligar a fonte de cobalto', clear: 'Limpar os ecrãs' },
      rows: { passes: 'Passagens', atoms: 'Outros átomos em cada cm³', shots: 'Minutos de contagem', share: 'Como parte de todos os átomos' },
      units: { cm3: 'por cm³' },
      says: {
        first: {
          kid: 'O aquecedor derrete um bocadinho da barra e desliza ao longo dela. A parte derretida agarra os grãos, por isso eles vão com ela até ao fim.',
          sci: 'A zona fundida retém as impurezas que preferem o líquido e leva-as até ao fim da barra: refinação por zona (Pfann, Bell Labs, 1951).',
        },
        three: {
          kid: 'Depois de três passagens quase não se veem grãos. Mas ainda há átomos pequenos demais para ver, por isso o indicador continua a descer.',
          sci: 'A maior parte dos grãos visíveis desapareceu, mas o indicador conta átomos: neste exemplo cada passagem deixa um quarto da impureza.',
        },
        five: { kid: 'Cinco passagens, e o indicador continua a descer.', sci: 'Cinco passagens: 4 × 10¹⁶ × (1/4)⁵ é cerca de 4 × 10¹³ por cm³.' },
        last: { kid: 'Doze passagens: mais puro do que um detetor precisa!', sci: 'Doze passagens: 2,4 × 10⁹ por cm³, abaixo dos 10¹⁰ de um cristal de detetor. As barras verdadeiras pedem mais cuidado, e o cristal cresce depois a partir do metal purificado.' },
        max: { kid: 'Chega de passagens para esta barra. Começa uma nova para tentar outra vez.', sci: 'Doze passagens é o máximo que este modelo faz. Começa uma barra nova para recomeçar.' },
        hpge: { kid: 'O indicador passou a linha dourada: este germânio já é puro o suficiente para um detetor!', sci: 'Abaixo de 10¹⁰ por cm³: puro o bastante para um cristal de detetor.' },
        source: {
          kid: 'A fonte de cobalto-60 manda dois valores exatos de energia em raios gama. O detetor de germânio desenha duas linhas finas. O de iodeto de sódio desenha só dois montes desfocados.',
          sci: 'O cobalto-60 emite raios gama de 1173,2 e 1332,5 keV. O detetor de germânio separa-os (cerca de 1,9 keV de largura a 1332 keV, 0,14%); o de iodeto de sódio (cerca de 7% a 662 keV, cerca de 5% aqui) esbate-os em montes.',
        },
        again: { kid: 'Mais contagens. Aproxima com o cursor para ver como as linhas do germânio são finas.', sci: 'Mais contagens: as linhas crescem, a largura não.' },
        ge: {
          kid: 'Um cristal de germânio, mantido frio por azoto líquido a menos 196 graus. Cada raio gama que pára nele faz um pequeno pulso de eletricidade, tão grande como a energia que o raio trazia.',
          sci: 'Um detetor HPGe, arrefecido por azoto líquido (77 K). Um par eletrão-lacuna por cada cerca de 3 eV absorvidos: um raio gama de 1332 keV liberta cerca de 450 000 pares, e a carga recolhida mede a sua energia.',
        },
        nai: {
          kid: 'Um cristal de iodeto de sódio com uma pitada de tálio. Faz um clarão quando um raio gama lhe bate, e um tubo transforma o clarão em eletricidade. Apanha mais raios, mas mede a energia com menos exatidão.',
          sci: 'Um cintilador de NaI(Tl) com fotomultiplicador: cerca de 7% de resolução a 662 keV (césio-137), cerca de 5% a 1332 keV; boa eficiência, resolução de energia fraca.',
        },
      },
      board: {
        title: 'ÁTOMOS DE IMPUREZA',
        unit: 'por cm3',
        hpge: 'cristal de detetor',
        passes: 'passagens',
        enough: 'puro que chegue!',
        more: 'mais puro, continua',
        sci: 'um exemplo: cada passagem deixa 1/4 da impureza',
        empty: 'ainda sem contagens',
        ge: 'germânio',
        nai: 'iodeto de sódio',
        geFw: 'largura 1,9 keV (0,14%)',
        naiFw: 'largura 65 keV (4,9%)',
        keV: 'energia em keV',
      },
      panel: {
        kid: [
          'Os detetores precisam de germânio mais puro do que quase tudo. Em 1951, William Pfann, nos Bell Labs, achou um modo: derreter um bocadinho da barra e deslizar o aquecedor devagar. As impurezas gostam de ficar no líquido, por isso a zona derretida leva-as até ao fim, que depois se corta.',
          'Toca no anel de aquecimento para cada passagem. Os grãos que se veem desaparecem ao fim de umas passagens, mas o indicador continua a contar os átomos pequenos demais para ver. A linha dourada é a pureza de um cristal de detetor.',
          'Um cristal assim tão puro mede a energia com muita exatidão. Toca na fonte de cobalto: o detetor de germânio (em cima) desenha duas linhas finas, o de iodeto de sódio (em baixo) só dois montes desfocados. Mexe no cursor da aproximação para ver.',
        ],
        sci: [
          'Refinação por zona: uma zona fundida de poucos centímetros percorre a barra, e uma impureza com coeficiente de segregação abaixo de 1 fica no líquido e é varrida para o fim (Pfann, Bell Labs, 1951, usada primeiro para purificar germânio para transístores). Algumas impurezas, entre elas o boro no germânio, têm coeficiente acima de 1 e vão no sentido contrário.',
          'O indicador é um exemplo: o metal de partida é 99,9999% germânio (4 × 10¹⁶ átomos estranhos por cm³ entre 4,4 × 10²² átomos de germânio por cm³) e cada passagem deixa um quarto. Um cristal HPGe verdadeiro tem impurezas líquidas perto de 10¹⁰ por cm³, cerca de um átomo em 4 × 10¹²; o cristal cresce depois a partir do metal refinado.',
          'O cobalto-60 decai para níquel-60, que emite 1173,2 e 1332,5 keV. Um díodo HPGe (cerca de 3 eV por par eletrão-lacuna, mantido perto de 77 K) chega a cerca de 0,14% a 1332 keV; o NaI(Tl) a cerca de 5%. Abaixo de cada linha está o seu patamar de Compton, que acaba em 963 e 1118 keV. As contagens aqui são inventadas para mostrar as formas.',
        ],
      },
    },
    wait: {
      label: 'A longa espera',
      title: 'À espera de um decaimento que ninguém viu',
      tags: { tank: 'o tanque de água, em tamanho reduzido', argon: 'árgon líquido', model: 'modelo da fiada de cristais', run: 'CORRER 1 ANO', lens: 'UM DECAIMENTO' },
      hints: { run: 'Toca no botão verde', crystal: 'Toca num cristal', lens: 'Toca na lente', more: 'Corre mais um ano', done: 'Toca outra vez num cristal ou na lente' },
      slider: 'Anos de espera',
      units: { years: 'anos' },
      buttons: { year: 'Esperar mais um ano', reset: 'Esvaziar o ecrã', hoped: 'Mostrar o decaimento que todos esperam', usual: 'Voltar ao decaimento normal', decay: 'Ver um decaimento na lente' },
      rows: { years: 'Anos de espera', events: 'Decaimentos até agora', perDay: 'Decaimentos por dia', window: 'Contados na linha de 2039 keV', expect: 'Um ano na linha, se a meia-vida fosse exatamente o limite' },
      says: {
        enough: { kid: 'Cinco anos é o máximo que este ecrã mostra. Esvazia-o para esperar outra vez.', sci: 'Cinco anos é a corrida mais longa aqui. Esvazia o ecrã para recomeçar.' },
        first: {
          kid: 'Um ano de espera: cerca de 117 000 decaimentos normais. Cada um são dois eletrões a sair de um cristal, e os dois deixam lá a sua energia.',
          sci: 'Um ano, 40 kg de germânio-76: cerca de 1,2 × 10⁵ decaimentos de dois neutrinos, de N ln 2 / T½ com T½ = 1,9 × 10²¹ anos.',
        },
        last: {
          kid: 'Cinco anos, e a linha dourada dos 2039 continua vazia. Esperar por uma linha vazia é ciência a sério: diz-nos quão raro é o decaimento.',
          sci: 'Cinco anos: ainda nada aos 2039 keV. Este modelo não tem ruído de fundo; as experiências verdadeiras esforçam-se muito para o ter quase nulo.',
        },
        decay: {
          kid: 'Um átomo de germânio-76: dois neutrões tornam-se dois protões no mesmo instante, e saem dois eletrões, com dois parceiros quase invisíveis chamados antineutrinos. O cristal mede os eletrões. Os neutrinos levam o resto.',
          sci: 'Decaimento beta duplo de dois neutrinos: o ⁷⁶Ge torna-se ⁷⁶Se. O detetor regista a energia somada dos eletrões (um espetro largo até 2039 keV); os dois antineutrinos escapam sem se verem.',
        },
        hoped: {
          kid: 'O decaimento que todos esperam: não sai nenhum neutrino, por isso os dois eletrões levam a energia toda, sempre a mesma quantidade: uma linha fina aos 2039. Ninguém a viu até hoje.',
          sci: 'Decaimento beta duplo sem neutrinos: os dois eletrões levam todo o Q = 2039 keV, uma linha fina. Só pode existir se o neutrino for a sua própria antipartícula. GERDA: meia-vida acima de 1,8 × 10²⁶ anos (2020).',
        },
        modeOn: { kid: 'A lente mostra agora o decaimento que todos esperam. Toca num cristal para o ver.', sci: 'Lente em decaimento beta duplo sem neutrinos (nunca observado). Toca num cristal.' },
        modeOff: { kid: 'De volta ao decaimento normal, o que acontece mesmo.', sci: 'De volta ao decaimento de dois neutrinos, o que foi medido.' },
      },
      board: {
        title: 'ENERGIA DOS DOIS ELETRÕES',
        years: 'anos',
        keV: 'energia em keV',
        line: 'contados na linha',
        ifSeen: 'ficaria assim: nunca visto',
        thisOne: 'este:',
        events: 'decaimentos',
        sci: 'meia-vida de dois neutrinos 1,9e21 a, sem neutrinos acima de 1,8e26 a',
        se: 'selénio-76',
        ge76: 'germânio-76',
        nuModeOn: 'toca na lente: o decaimento que todos esperam',
        nuModeOff: 'toca na lente: voltar ao normal',
        noNu: 'sem neutrinos: toda a energia nos eletrões',
        twoNu: 'dois antineutrinos escapam',
        electrons: 'eletrões',
        nus: 'antineutrinos',
        waiting: 'toca num cristal',
        twoAtOnce: 'dois neutrões tornam-se protões ao mesmo tempo',
        nucSci: 'alguns dos 76 nucleões',
      },
      panel: {
        kid: [
          'Dentro do tanque, os cristais ficam pendurados em árgon líquido. O germânio-76 é ao mesmo tempo aquilo que pode decair e o detetor que o nota. Toca no botão verde, ou mexe no cursor, para esperar ano após ano.',
          'Todos os anos acontecem cerca de cem mil decaimentos normais neste modelo, a formar o monte. A linha dourada dos 2039 fica vazia: é onde apareceria o decaimento raríssimo.',
          'Toca num cristal para ver um decaimento na lente. Depois toca na lente para ver o decaimento que todos esperam. Os físicos continuam a esperar e a verificar, porque um dia ele pode estar lá.',
        ],
        sci: [
          'O modelo tem 40 kg de germânio-76 (a fiada do GERDA tinha cerca de 36 kg de detetores enriquecidos; o LEGEND-200 tem até 200 kg). Para uma meia-vida de dois neutrinos de 1,9 × 10²¹ anos, N ln 2 / T½ dá cerca de 320 decaimentos por dia, 1,2 × 10⁵ por ano.',
          'O monte é a energia cinética somada dos dois eletrões, K (Q − K)⁵ vezes um polinómio (Doi, Kotani e Takasugi), até Q = 2039 keV. Mais nada é simulado: os espetros verdadeiros têm ainda o ruído de fundo de outra radioatividade, que o GERDA baixou até cerca de 5 × 10⁻⁴ contagens por keV, quilograma e ano.',
          'Se o decaimento sem neutrinos tivesse exatamente a meia-vida do limite, 1,8 × 10²⁶ anos, estes 40 kg dariam cerca de 1,2 decaimentos por ano na linha. Por isso as experiências precisam de centenas de quilogramas-ano de dados e de quase nenhum ruído de fundo.',
        ],
      },
    },
  },
  pl: {
    title: 'Hala A, pod górą',
    greet: {
      kid: 'Jesteśmy w obrazku, w ogromnej hali wykutej pod górą we Włoszech, z 1400 metrami skały nad głowami. Promienie kosmiczne spadają z kosmosu na górę, ale prawie żaden nie dociera tutaj. Po lewej zobacz, jak skała je zatrzymuje. Po prawej zobacz, jak robi się tak czysty german. W środku jest długie czekanie. Historia obrazka jest na sztalugach.',
      sci: 'Hala A w Laboratori Nazionali del Gran Sasso, pod co najmniej 1400 m skały (3800 m ekwiwalentu wody); prawdziwa hala ma 100 m długości, 20 m szerokości i 18 m wysokości. Na końcu zbiornik wody GERDA, a teraz LEGEND-200, zmniejszony, żeby się zmieścił. Po lewej: strumień mionów w zależności od głębokości. Po prawej: rafinacja strefowa i widma gamma. W środku: poszukiwanie podwójnego rozpadu beta bez neutrin. Historia obrazka jest na sztalugach.',
    },
    talk: {
      kid: [
        'Promienie kosmiczne przylatują z kosmosu cały czas. Jeden rodzaj, mion, przelatuje przez twoją dłoń mniej więcej raz na sekundę. Tutaj, na dole, przez cały metr kwadratowy zaledwie raz na godzinę.',
        'German do tych detektorów jest tak czysty, że mniej niż jeden atom na milion milionów jest czymś innym. Tak czysty kryształ potrafi wyczuć pojedynczą maleńką cząstkę.',
        'Kryształy w zbiorniku trzyma się w ciekłym argonie, zimniejszym niż jakakolwiek zamrażarka, około minus 186 stopni. Zimno uspokaja je na tyle, żeby dało się nasłuchiwać.',
        'Droga tutaj prowadzi tunelem autostrady, długim na 10 kilometrów, a boczny tunel wiedzie do tej hali. Tak wchodzą naukowcy.',
      ],
      sci: [
        'Miony promieniowania kosmicznego przechodzą przez płaską powierzchnię na poziomie morza w tempie około 1 na cm² na minutę. W tej hali zmierzony strumień wynosi około 3,4 × 10⁻⁴ na m² na sekundę, czyli jest mniejszy rzędu miliona razy.',
        'German wysokiej czystości ma wypadkową ilość domieszek około 10¹⁰ na cm³ wobec 4,4 × 10²² atomów germanu na cm³: mniej więcej jeden atom na 4 × 10¹².',
        'German-76 to 7,75% naturalnego germanu; detektory są wzbogacone do około 90%. German jest jednocześnie źródłem i detektorem, więc oba elektrony oddają całą energię kryształowi.',
        'Rozpad dwuneutrinowy ⁷⁶Ge ma okres półrozpadu około 1,9 × 10²¹ lat. GERDA wykazała, że rozpad bezneutrinowy trwa dłużej niż 1,8 × 10²⁶ lat (2020), czyli około 10⁵ razy dłużej.',
      ],
    },
    leave: {
      kid: 'Zanim pójdziesz: pusta linia też jest odpowiedzią. Fizycy będą nasłuchiwać przy tej złotej linii latami, a jeśli kiedyś się zapali, będzie to wielkie odkrycie. Cała historia jest na sztalugach.',
      sci: 'Zanim pójdziesz: pusta linia to też wynik. Każdy rok danych bez zdarzenia podnosi dolną granicę okresu półrozpadu. LEGEND-200 zbiera dane, a planowany jest LEGEND-1000 w skali tony.',
    },
    rain: {
      label: 'Deszcz z kosmosu',
      title: 'Deszcz z kosmosu zatrzymany przez skałę',
      tags: { ruler: 'skała nad nami (m)', hall: 'Hala A', road: 'tunel drogowy', sky: 'promienie kosmiczne', counter: 'LICZNIK MIONÓW', unit: 'na m2 na godzinę' },
      hints: { dig: 'Dotknij góry, głębiej', sky: 'Dotknij nieba, by zrobić ulewę', deeper: 'Dotknij góry jeszcze głębiej', counter: 'Dotknij licznika' },
      slider: 'Skała nad licznikiem',
      buttons: { top: 'Na powierzchni', half: 'W połowie drogi', hall: 'W hali', sky: 'Ulewa z nieba', counter: 'Odczytaj licznik' },
      rows: { depth: 'Skała nad nami', rate: 'Miony przez jeden metr kwadratowy', less: 'W porównaniu z powierzchnią', rock: 'Jako głębokość wody' },
      units: { rate: 'na m² na godzinę', mwe: 'm wody' },
      says: {
        top: { kid: 'Na powierzchni licznik terkocze: przez każdy metr kwadratowy przelatuje około 170 mionów na sekundę.', sci: 'Na powierzchni: około 1 mion na cm² na minutę, 6 × 10⁵ na m² na godzinę.' },
        half: { kid: 'W połowie drogi skała zatrzymała już większość. Terkotanie zamieniło się w powolne stukanie.', sci: 'W połowie drogi: krzywa jest tu gładkim szkicem między dwoma zmierzonymi końcami.' },
        hall: {
          kid: 'W hali licznik tyka tylko od czasu do czasu: mniej więcej raz na każdy metr kwadratowy w ciągu godziny. Skała zatrzymuje około milion razy więcej, niż przepuszcza powierzchnia.',
          sci: 'W hali: około 1 na m² na godzinę (3,4 × 10⁻⁴ na m² na sekundę, Borexino), rzędu miliona razy mniej. Kliknięcia są tu przyspieszone, żebyś je słyszał.',
        },
        shower: { kid: 'Ulewa {n} cząstek: wszystkie zatrzymały się w skale, najgłębsza na około {c} m.', sci: '{n} cząstek wylosowanych z modelu: wszystkie się zatrzymały, najgłębsza na około {c} m skały.' },
        reached: { kid: 'Ulewa {n} cząstek i jedna dotarła aż do hali! To bardzo, bardzo rzadkie.', sci: 'Jedna z {n} przebyła całe 1400 m. W tym modelu to około jedna na pół miliona.' },
        count: { kid: 'Tutaj, {d} m w dół: {r} mionów przez każdy metr kwadratowy w ciągu godziny.', sci: '{d} m skały: {r} na m² na godzinę.' },
      },
      panel: {
        kid: [
          'Promienie kosmiczne lecą z kosmosu i uderzają w powietrze, robiąc ulewy cząstek. Te, które docierają do ziemi, to głównie miony, trochę jak ciężcy kuzyni elektronu. Około jeden przelatuje przez twoją dłoń co sekundę.',
          'Skała zatrzymuje większość z nich. Dotknij góry albo przesuń suwak, żeby ustawić licznik głębiej: terkotanie zwalnia i zwalnia. Dotknij nieba, żeby posłać ulewę i zobaczyć, jak głęboko dociera każda cząstka.',
          'W hali, pod 1400 metrami skały, mion przechodzi przez metr kwadratowy tylko mniej więcej raz na godzinę. Dlatego kryształy germanu wiszą właśnie tutaj: prawie nic z kosmosu nie może im przeszkodzić.',
        ],
        sci: [
          'Miony promieniowania kosmicznego, powstające w pęku cząstek wysoko w atmosferze, przechodzą przez poziomą powierzchnię na poziomie morza w tempie około 1 na cm² na minutę (6 × 10⁵ na m² na godzinę). Hale Gran Sasso leżą pod co najmniej 1400 m skały, około 3800 m ekwiwalentu wody.',
          'Tam zmierzony strumień mionów wynosi około 3,4 × 10⁻⁴ na m² na sekundę (Borexino), mniej więcej 1 na m² na godzinę: spadek rzędu miliona. Krzywa między oboma końcami jest gładkim szkicem (10 do potęgi −5,7 na 1400 m), nie pomiarem.',
          'Każda smuga zatrzymuje się na głębokości wylosowanej z tej krzywej: większość w pierwszych kilkuset metrach, a głęboko docierają tylko najbardziej energetyczne miony. Licznik zachowuje prawdziwą kolejność tempa, ale jest zwolniony, żeby go było słychać; prawdziwe tempo na powierzchni byłoby rykiem.',
        ],
      },
    },
    pure: {
      label: 'Najczystszy kryształ',
      title: 'Rafinacja strefowa i próba promieni gamma',
      tags: { ring: 'pierścień grzejny', ingot: 'sztabka germanu', source: 'kobalt-60', ge: 'detektor germanowy', nai: 'jodek sodu' },
      hints: { ring: 'Dotknij pierścienia grzejnego', again: 'Dotknij pierścienia jeszcze raz', source: 'Dotknij źródła kobaltu', zoom: 'Przybliż suwakiem', done: 'Dotknij źródła po więcej zliczeń' },
      slider: 'Przejścia grzałki',
      zoom: 'Przybliż linie',
      buttons: { pass: 'Jeszcze jedno przejście', fresh: 'Nowa sztabka', source: 'Włącz źródło kobaltu', clear: 'Wyczyść ekrany' },
      rows: { passes: 'Przejścia', atoms: 'Inne atomy w każdym cm³', shots: 'Minuty liczenia', share: 'Jako część wszystkich atomów' },
      units: { cm3: 'na cm³' },
      says: {
        first: {
          kid: 'Grzałka topi krótki kawałek sztabki i przesuwa się wzdłuż niej. Stopiony kawałek trzyma się drobinek, więc jadą z nim aż do końca.',
          sci: 'Strefa stopiona zatrzymuje domieszki, które wolą ciecz, i niesie je na koniec sztabki: rafinacja strefowa (Pfann, Bell Labs, 1951).',
        },
        three: {
          kid: 'Po trzech przejściach prawie nie widać już drobinek. Ale wciąż są atomy za małe, żeby je zobaczyć, więc wskaźnik dalej spada.',
          sci: 'Większość widocznych drobinek zniknęła, ale wskaźnik liczy atomy: w tym przykładzie każde przejście zostawia jedną czwartą domieszki.',
        },
        five: { kid: 'Pięć przejść, a wskaźnik wciąż spada.', sci: 'Pięć przejść: 4 × 10¹⁶ × (1/4)⁵ to około 4 × 10¹³ na cm³.' },
        last: { kid: 'Dwanaście przejść: czyściej, niż potrzeba detektorowi!', sci: 'Dwanaście przejść: 2,4 × 10⁹ na cm³, poniżej 10¹⁰ kryształu detektora. Prawdziwe sztabki wymagają więcej starań, a kryształ rośnie potem z oczyszczonego metalu.' },
        max: { kid: 'Dość przejść dla tej sztabki. Zacznij nową, żeby spróbować jeszcze raz.', sci: 'Dwanaście przejść to maksimum tego modelu. Zacznij nową sztabkę, żeby zacząć od nowa.' },
        hpge: { kid: 'Wskaźnik przekroczył złotą linię: ten german jest dość czysty na detektor!', sci: 'Poniżej 10¹⁰ na cm³: dość czysty na kryształ detektora.' },
        source: {
          kid: 'Źródło kobaltu-60 wysyła dwie dokładne porcje energii jako promienie gamma. Detektor germanowy rysuje dwie ostre linie. Detektor z jodku sodu rysuje tylko dwa rozmyte garby.',
          sci: 'Kobalt-60 emituje promienie gamma o energiach 1173,2 i 1332,5 keV. Detektor germanowy je rozdziela (szerokość około 1,9 keV przy 1332 keV, 0,14%); detektor z jodku sodu (około 7% przy 662 keV, tu około 5%) rozmywa je w garby.',
        },
        again: { kid: 'Więcej zliczeń. Przybliż suwakiem, żeby zobaczyć, jak cienkie są linie germanu.', sci: 'Więcej zliczeń: linie rosną, ich szerokość nie.' },
        ge: {
          kid: 'Kryształ germanu, trzymany w zimnie ciekłego azotu, minus 196 stopni. Każdy promień gamma, który się w nim zatrzyma, robi maleńki impuls prądu, tak duży, jak energia, którą niósł.',
          sci: 'Detektor HPGe chłodzony ciekłym azotem (77 K). Jedna para elektron-dziura na około 3 eV pochłoniętej energii: promień gamma 1332 keV uwalnia około 450 000 par, a zebrany ładunek mierzy jego energię.',
        },
        nai: {
          kid: 'Kryształ jodku sodu z odrobiną talu. Błyska, gdy uderzy w niego promień gamma, a lampa zamienia błysk na prąd. Łapie więcej promieni, ale mniej dokładnie mierzy ich energię.',
          sci: 'Scyntylator NaI(Tl) z fotopowielaczem: rozdzielczość około 7% przy 662 keV (cez-137), około 5% przy 1332 keV; wysoka wydajność, słaba rozdzielczość energii.',
        },
      },
      board: {
        title: 'ATOMY DOMIESZEK',
        unit: 'na cm3',
        hpge: 'kryształ detektora',
        passes: 'przejścia',
        enough: 'dość czysty!',
        more: 'czyściej, dalej',
        sci: 'przykład: każde przejście zostawia 1/4 domieszki',
        empty: 'jeszcze bez zliczeń',
        ge: 'german',
        nai: 'jodek sodu',
        geFw: 'szerokość 1,9 keV (0,14%)',
        naiFw: 'szerokość 65 keV (4,9%)',
        keV: 'energia w keV',
      },
      panel: {
        kid: [
          'Detektory potrzebują germanu czystszego niż prawie cokolwiek. W 1951 roku William Pfann z Bell Labs znalazł sposób: stopić krótki kawałek sztabki i powoli przesuwać grzałkę. Domieszki lubią zostawać w cieczy, więc stopiona strefa niesie je na koniec, który się odcina.',
          'Dotykaj pierścienia grzejnego przy każdym przejściu. Drobinki, które widać, znikają po kilku przejściach, ale wskaźnik liczy dalej atomy za małe, żeby je zobaczyć. Jego złota linia to czystość kryształu detektora.',
          'Tak czysty kryształ mierzy energię bardzo dokładnie. Dotknij źródła kobaltu: detektor germanowy (u góry) rysuje dwie cienkie linie, detektor z jodku sodu (u dołu) tylko dwa rozmyte garby. Przesuń suwak przybliżenia, żeby to zobaczyć.',
        ],
        sci: [
          'Rafinacja strefowa: stopiona strefa długa na kilka centymetrów przesuwa się wzdłuż sztabki, a domieszka o współczynniku segregacji poniżej 1 zostaje w cieczy i jest zmieciona na koniec (Pfann, Bell Labs, 1951, najpierw do oczyszczania germanu na tranzystory). Kilka domieszek, wśród nich bor w germanie, ma współczynnik powyżej 1 i wędruje w przeciwną stronę.',
          'Wskaźnik to przykład: metal wyjściowy to 99,9999% germanu (4 × 10¹⁶ obcych atomów na cm³ wśród 4,4 × 10²² atomów germanu na cm³), a każde przejście zostawia jedną czwartą. Prawdziwy kryształ HPGe ma wypadkową ilość domieszek około 10¹⁰ na cm³, mniej więcej jeden atom na 4 × 10¹²; kryształ rośnie potem z oczyszczonego metalu.',
          'Kobalt-60 rozpada się na nikiel-60, który emituje 1173,2 i 1332,5 keV. Dioda HPGe (około 3 eV na parę elektron-dziura, utrzymywana blisko 77 K) osiąga około 0,14% przy 1332 keV; NaI(Tl) około 5%. Pod każdą linią leży jej półka Comptona, kończąca się na 963 i 1118 keV. Zliczenia są tu wymyślone, żeby pokazać kształty.',
        ],
      },
    },
    wait: {
      label: 'Długie czekanie',
      title: 'Czekanie na rozpad, którego nikt nie widział',
      tags: { tank: 'zbiornik na wodę, zmniejszony', argon: 'ciekły argon', model: 'model układu kryształów', run: 'PRZEŚLIJ 1 ROK', lens: 'JEDEN ROZPAD' },
      hints: { run: 'Dotknij zielonego przycisku', crystal: 'Dotknij kryształu', lens: 'Dotknij soczewki', more: 'Przewiń jeszcze rok', done: 'Dotknij jeszcze raz kryształu albo soczewki' },
      slider: 'Lata czekania',
      units: { years: 'lat' },
      buttons: { year: 'Poczekaj jeszcze rok', reset: 'Opróżnij ekran', hoped: 'Pokaż rozpad, na który wszyscy liczą', usual: 'Z powrotem do zwykłego rozpadu', decay: 'Obejrzyj rozpad w soczewce' },
      rows: { years: 'Lata czekania', events: 'Rozpady do tej pory', perDay: 'Rozpady na dobę', window: 'Zliczone w linii 2039 keV', expect: 'Rok w linii, gdyby okres półrozpadu był dokładnie równy granicy' },
      says: {
        enough: { kid: 'Pięć lat to najwięcej, co pokazuje ten ekran. Opróżnij go, żeby czekać od nowa.', sci: 'Pięć lat to najdłuższy przebieg tutaj. Opróżnij ekran, żeby zacząć od nowa.' },
        first: {
          kid: 'Rok czekania: około 117 000 zwykłych rozpadów. Każdy to dwa elektrony opuszczające kryształ, a oba zostawiają w nim swoją energię.',
          sci: 'Jeden rok, 40 kg germanu-76: około 1,2 × 10⁵ rozpadów dwuneutrinowych, z N ln 2 / T½ przy T½ = 1,9 × 10²¹ lat.',
        },
        last: {
          kid: 'Pięć lat, a złota linia na 2039 wciąż jest pusta. Czekanie na pustą linię to prawdziwa nauka: mówi nam, jak rzadki jest ten rozpad.',
          sci: 'Pięć lat: wciąż nic przy 2039 keV. Ten model nie ma tła; prawdziwe eksperymenty bardzo się starają, by mieć je prawie zerowe.',
        },
        decay: {
          kid: 'Jeden atom germanu-76: dwa neutrony zamieniają się w dwa protony w tej samej chwili i wylatują dwa elektrony, z dwoma prawie niewidzialnymi towarzyszami zwanymi antyneutrinami. Kryształ mierzy elektrony. Neutrina zabierają resztę.',
          sci: 'Dwuneutrinowy podwójny rozpad beta: ⁷⁶Ge zamienia się w ⁷⁶Se. Detektor rejestruje sumę energii elektronów (szerokie widmo do 2039 keV); dwa antyneutrina uciekają niewidoczne.',
        },
        hoped: {
          kid: 'Rozpad, na który wszyscy liczą: nie wylatuje żadne neutrino, więc dwa elektrony niosą całą energię, zawsze tyle samo: ostra linia przy 2039. Nikt jej jeszcze nie widział.',
          sci: 'Bezneutrinowy podwójny rozpad beta: oba elektrony niosą pełne Q = 2039 keV, ostra linia. Może istnieć tylko wtedy, gdy neutrino jest swoją własną antycząstką. GERDA: okres półrozpadu powyżej 1,8 × 10²⁶ lat (2020).',
        },
        modeOn: { kid: 'Soczewka pokazuje teraz rozpad, na który wszyscy liczą. Dotknij kryształu, żeby go zobaczyć.', sci: 'Soczewka ustawiona na bezneutrinowy podwójny rozpad beta (nigdy nieobserwowany). Dotknij kryształu.' },
        modeOff: { kid: 'Z powrotem do zwykłego rozpadu, tego, który naprawdę się dzieje.', sci: 'Z powrotem do rozpadu dwuneutrinowego, tego, który zmierzono.' },
      },
      board: {
        title: 'ENERGIA DWÓCH ELEKTRONÓW',
        years: 'lat',
        keV: 'energia w keV',
        line: 'zliczone w linii',
        ifSeen: 'tak by wyglądał: nigdy niewidziany',
        thisOne: 'ten:',
        events: 'rozpady',
        sci: 'okres półrozpadu dwuneutrinowego 1,9e21 lat, bezneutrinowego powyżej 1,8e26 lat',
        se: 'selen-76',
        ge76: 'german-76',
        nuModeOn: 'dotknij soczewki: rozpad, na który wszyscy liczą',
        nuModeOff: 'dotknij soczewki: z powrotem do zwykłego',
        noNu: 'bez neutrin: cała energia w elektronach',
        twoNu: 'dwa antyneutrina uciekają',
        electrons: 'elektrony',
        nus: 'antyneutrina',
        waiting: 'dotknij kryształu',
        twoAtOnce: 'dwa neutrony zamieniają się w protony naraz',
        nucSci: 'kilka z 76 nukleonów',
      },
      panel: {
        kid: [
          'Wewnątrz zbiornika kryształy wiszą w ciekłym argonie. German-76 jest jednocześnie tym, co może się rozpaść, i detektorem, który to zauważy. Dotknij zielonego przycisku albo przesuń suwak, żeby czekać rok po roku.',
          'Co roku w tym modelu zdarza się około stu tysięcy zwykłych rozpadów, które budują garb. Złota linia przy 2039 zostaje pusta: tam pojawiłby się ten bardzo rzadki rozpad.',
          'Dotknij kryształu, żeby obejrzeć jeden rozpad w soczewce. Potem dotknij soczewki, żeby zobaczyć rozpad, na który wszyscy liczą. Fizycy wciąż czekają i sprawdzają, bo kiedyś może się pojawić.',
        ],
        sci: [
          'Model zawiera 40 kg germanu-76 (układ GERDA miał około 36 kg wzbogaconych detektorów; LEGEND-200 ma do 200 kg). Dla okresu półrozpadu dwuneutrinowego 1,9 × 10²¹ lat wzór N ln 2 / T½ daje około 320 rozpadów na dobę, 1,2 × 10⁵ na rok.',
          'Garb to suma energii kinetycznej dwóch elektronów, K (Q − K)⁵ razy wielomian (Doi, Kotani i Takasugi), do Q = 2039 keV. Nic więcej nie jest symulowane: prawdziwe widma zawierają też tło innej promieniotwórczości, które GERDA zmniejszyła do około 5 × 10⁻⁴ zliczeń na keV, kilogram i rok.',
          'Gdyby rozpad bezneutrinowy miał dokładnie okres półrozpadu równy granicy, 1,8 × 10²⁶ lat, te 40 kg dałoby około 1,2 rozpadu na rok w linii. Dlatego eksperymenty potrzebują setek kilogramolat danych i prawie zerowego tła.',
        ],
      },
    },
  },
  de: {
    title: 'Halle A, unter dem Berg',
    greet: {
      kid: 'Wir sind im Bild, in einer riesigen Halle, die unter einem Berg in Italien ausgehöhlt wurde, mit 1400 Metern Fels über unseren Köpfen. Kosmische Strahlen regnen aus dem All auf den Berg, aber kaum einer kommt hier unten an. Links siehst du, wie der Fels sie aufhält. Rechts siehst du, wie Germanium so rein gemacht wird. In der Mitte ist das lange Warten. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Halle A der Laboratori Nazionali del Gran Sasso, unter mindestens 1400 m Fels (3800 m Wasseräquivalent); die echte Halle ist 100 m lang, 20 m breit und 18 m hoch. Am Ende der Wassertank von GERDA und jetzt LEGEND-200, verkleinert, damit er hineinpasst. Links: der Myonenfluss gegen die Tiefe. Rechts: Zonenreinigung und Gammaspektren. In der Mitte: die Suche nach dem neutrinolosen doppelten Betazerfall. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Kosmische Strahlen kommen die ganze Zeit aus dem All. Eine Sorte, das Myon, fliegt etwa einmal pro Sekunde durch deine Hand. Hier unten ist es nur etwa einmal pro Stunde durch einen ganzen Quadratmeter.',
        'Germanium für diese Detektoren ist so rein, dass weniger als ein Atom unter einer Million Millionen etwas anderes ist. Ein so sauberer Kristall kann ein einziges winziges Teilchen spüren.',
        'Die Kristalle im Tank hängen in flüssigem Argon, kälter als jede Gefriertruhe, etwa minus 186 Grad. Die Kälte macht sie ruhig genug zum Lauschen.',
        'Der Weg hierher führt durch einen Autobahntunnel von 10 Kilometern Länge, und ein Seitentunnel führt zu dieser Halle. So kommen die Forscher herein.',
      ],
      sci: [
        'Myonen der kosmischen Strahlung durchqueren eine ebene Fläche auf Meereshöhe mit etwa 1 pro cm² und Minute. In dieser Halle beträgt der gemessene Fluss etwa 3,4 × 10⁻⁴ pro m² und Sekunde, eine Verringerung in der Größenordnung von einer Million.',
        'Hochreines Germanium hat netto etwa 10¹⁰ Fremdatome pro cm³ gegenüber 4,4 × 10²² Germaniumatomen pro cm³: etwa ein Atom unter 4 × 10¹².',
        'Germanium-76 macht 7,75% des natürlichen Germaniums aus; die Detektoren sind auf etwa 90% angereichert. Das Germanium ist zugleich Quelle und Detektor, daher geben beide Elektronen ihre ganze Energie an den Kristall ab.',
        'Der Zwei-Neutrino-Zerfall von ⁷⁶Ge hat eine Halbwertszeit um 1,9 × 10²¹ Jahre. GERDA zeigte, dass der neutrinolose länger als 1,8 × 10²⁶ Jahre dauert (2020), etwa 10⁵-mal so lange.',
      ],
    },
    leave: {
      kid: 'Bevor du gehst: Auch eine leere Linie ist eine Antwort. Die Physiker werden noch jahrelang an dieser goldenen Linie lauschen, und wenn sie je aufleuchtet, wird das eine große Entdeckung. Die ganze Geschichte steht auf der Staffelei.',
      sci: 'Bevor du gehst: Auch eine leere Linie ist ein Ergebnis. Jedes Jahr Daten ohne Ereignis hebt die untere Grenze der Halbwertszeit. LEGEND-200 nimmt Daten, und mit LEGEND-1000 ist ein Experiment im Tonnenmaßstab geplant.',
    },
    rain: {
      label: 'Der Regen aus dem All',
      title: 'Regen aus dem All, vom Fels gestoppt',
      tags: { ruler: 'Fels darüber (m)', hall: 'Halle A', road: 'Straßentunnel', sky: 'kosmische Strahlen', counter: 'MYONENZÄHLER', unit: 'pro m2 und Stunde' },
      hints: { dig: 'Tippe auf den Berg, tiefer unten', sky: 'Tippe auf den Himmel für einen Schauer', deeper: 'Tippe noch tiefer auf den Berg', counter: 'Tippe auf den Zähler' },
      slider: 'Fels über dem Zähler',
      buttons: { top: 'An der Oberfläche', half: 'Auf halbem Weg', hall: 'In der Halle', sky: 'Ein Schauer vom Himmel', counter: 'Zähler ablesen' },
      rows: { depth: 'Fels darüber', rate: 'Myonen durch einen Quadratmeter', less: 'Verglichen mit der Oberfläche', rock: 'Als Wassertiefe' },
      units: { rate: 'pro m² und Stunde', mwe: 'm Wasser' },
      says: {
        top: { kid: 'An der Oberfläche rattert der Zähler: Etwa 170 Myonen fliegen jede Sekunde durch jeden Quadratmeter.', sci: 'An der Oberfläche: etwa 1 Myon pro cm² und Minute, 6 × 10⁵ pro m² und Stunde.' },
        half: { kid: 'Auf halbem Weg hat der Fels schon die meisten gestoppt. Das Rattern ist ein langsames Prasseln.', sci: 'Auf halbem Weg: Die Kurve ist hier eine glatte Skizze zwischen den beiden gemessenen Enden.' },
        hall: {
          kid: 'In der Halle klickt der Zähler nur ab und zu: etwa einmal für jeden Quadratmeter, jede Stunde. Der Fels hält etwa eine Million Mal mehr ab, als die Oberfläche durchlässt.',
          sci: 'In der Halle: etwa 1 pro m² und Stunde (3,4 × 10⁻⁴ pro m² und Sekunde, Borexino), in der Größenordnung von einer Million Mal weniger. Die Klicks sind hier beschleunigt, damit du sie hören kannst.',
        },
        shower: { kid: 'Ein Schauer aus {n} Teilchen: Alle blieben im Fels stecken, das tiefste bei etwa {c} m.', sci: '{n} Teilchen aus dem Modell gezogen: alle gestoppt, das tiefste bei etwa {c} m Fels.' },
        reached: { kid: 'Ein Schauer aus {n}, und eines kam bis in die Halle! Das ist sehr, sehr selten.', sci: 'Eines der {n} durchquerte alle 1400 m. In diesem Modell ist das etwa eines unter einer halben Million.' },
        count: { kid: 'Hier, {d} m tief: {r} Myonen durch jeden Quadratmeter, jede Stunde.', sci: '{d} m Fels: {r} pro m² und Stunde.' },
      },
      panel: {
        kid: [
          'Kosmische Strahlen kommen aus dem All und prallen auf die Luft, wobei Schauer aus Teilchen entstehen. Die, die den Boden erreichen, sind meist Myonen, eine Art schwere Vettern des Elektrons. Etwa eines fliegt jede Sekunde durch deine Hand.',
          'Fels stoppt die meisten. Tippe auf den Berg oder zieh am Regler, um den Zähler tiefer zu setzen: Das Rattern wird langsamer und langsamer. Tippe auf den Himmel, um einen Schauer zu schicken und zu sehen, wie tief jedes Teilchen kommt.',
          'In der Halle, unter 1400 Metern Fels, fliegt ein Myon nur etwa einmal pro Stunde durch einen Quadratmeter. Darum hängen die Germaniumkristalle hier: Fast nichts aus dem All kann sie stören.',
        ],
        sci: [
          'Myonen der kosmischen Strahlung, in Schauern hoch in der Atmosphäre entstanden, durchqueren eine waagerechte Fläche auf Meereshöhe mit etwa 1 pro cm² und Minute (6 × 10⁵ pro m² und Stunde). Die Hallen des Gran Sasso liegen unter mindestens 1400 m Fels, etwa 3800 m Wasseräquivalent.',
          'Dort beträgt der gemessene Myonenfluss etwa 3,4 × 10⁻⁴ pro m² und Sekunde (Borexino), grob 1 pro m² und Stunde: eine Verringerung in der Größenordnung von einer Million. Die Kurve zwischen den beiden Enden ist eine glatte Skizze (10 hoch −5,7 bei 1400 m), keine Messung.',
          'Jede Spur endet in einer Tiefe, die aus dieser Kurve gezogen wird: Die meisten enden in den ersten paar hundert Metern, und nur die energiereichsten Myonen dringen tief ein. Der Zähler behält die echte Reihenfolge der Raten, ist aber verlangsamt, damit man ihn hört; die echte Rate an der Oberfläche wäre ein Brausen.',
        ],
      },
    },
    pure: {
      label: 'Der reinste Kristall',
      title: 'Zonenreinigung und ein Gammatest',
      tags: { ring: 'Heizring', ingot: 'Germaniumstab', source: 'Kobalt-60', ge: 'Germaniumdetektor', nai: 'Natriumiodid' },
      hints: { ring: 'Tippe auf den Heizring', again: 'Tippe noch einmal auf den Heizring', source: 'Tippe auf die Kobaltquelle', zoom: 'Zoome mit dem Regler', done: 'Tippe auf die Quelle für mehr Zählungen' },
      slider: 'Durchgänge der Heizung',
      zoom: 'Die Linien heranzoomen',
      buttons: { pass: 'Noch ein Durchgang', fresh: 'Ein neuer Stab', source: 'Kobaltquelle einschalten', clear: 'Bildschirme leeren' },
      rows: { passes: 'Durchgänge', atoms: 'Andere Atome in jedem cm³', shots: 'Minuten Zählen', share: 'Als Anteil aller Atome' },
      units: { cm3: 'pro cm³' },
      says: {
        first: {
          kid: 'Die Heizung schmilzt ein kurzes Stück des Stabs und gleitet an ihm entlang. Das geschmolzene Stück hält die Körnchen fest, sodass sie mit ihm bis ans Ende wandern.',
          sci: 'Die geschmolzene Zone behält die Verunreinigungen, die die Flüssigkeit bevorzugen, und trägt sie ans Ende des Stabs: Zonenreinigung (Pfann, Bell Labs, 1951).',
        },
        three: {
          kid: 'Nach drei Durchgängen sieht man kaum noch Körnchen. Aber es gibt noch Atome, die zu klein zum Sehen sind, darum zählt die Anzeige weiter abwärts.',
          sci: 'Die meisten sichtbaren Körnchen sind weg, aber die Anzeige zählt Atome: In diesem Beispiel lässt jeder Durchgang ein Viertel der Verunreinigung zurück.',
        },
        five: { kid: 'Fünf Durchgänge, und die Anzeige fällt weiter.', sci: 'Fünf Durchgänge: 4 × 10¹⁶ × (1/4)⁵ sind etwa 4 × 10¹³ pro cm³.' },
        last: { kid: 'Zwölf Durchgänge: reiner, als ein Detektor braucht!', sci: 'Zwölf Durchgänge: 2,4 × 10⁹ pro cm³, unter den 10¹⁰ eines Detektorkristalls. Echte Stäbe brauchen mehr Sorgfalt, und der Kristall wird danach aus dem gereinigten Metall gezogen.' },
        max: { kid: 'Das reicht an Durchgängen für diesen Stab. Beginne einen neuen, um es noch einmal zu probieren.', sci: 'Zwölf Durchgänge sind das Meiste, was dieses Modell macht. Beginne einen neuen Stab, um von vorn anzufangen.' },
        hpge: { kid: 'Die Anzeige hat die goldene Linie überschritten: Dieses Germanium ist rein genug für einen Detektor!', sci: 'Unter 10¹⁰ pro cm³: rein genug für einen Detektorkristall.' },
        source: {
          kid: 'Die Kobalt-60-Quelle schickt zwei genaue Energiemengen als Gammastrahlen aus. Der Germaniumdetektor zeichnet zwei scharfe Linien. Der Natriumiodid-Detektor zeichnet nur zwei verschwommene Hügel.',
          sci: 'Kobalt-60 sendet Gammastrahlen von 1173,2 und 1332,5 keV aus. Der Germaniumdetektor trennt sie (etwa 1,9 keV breit bei 1332 keV, 0,14%); der Natriumiodid-Detektor (etwa 7% bei 662 keV, hier etwa 5%) verschmiert sie zu Hügeln.',
        },
        again: { kid: 'Mehr Zählungen. Zoome mit dem Regler heran, um zu sehen, wie dünn die Germaniumlinien sind.', sci: 'Mehr Zählungen: Die Linien wachsen, ihre Breite nicht.' },
        ge: {
          kid: 'Ein Germaniumkristall, mit flüssigem Stickstoff bei minus 196 Grad kalt gehalten. Jeder Gammastrahl, der darin stecken bleibt, macht einen winzigen Stromimpuls, so groß wie die Energie, die er trug.',
          sci: 'Ein HPGe-Detektor, mit flüssigem Stickstoff gekühlt (77 K). Ein Elektron-Loch-Paar je etwa 3 eV absorbierter Energie: Ein Gammastrahl von 1332 keV setzt etwa 450 000 Paare frei, und die gesammelte Ladung misst seine Energie.',
        },
        nai: {
          kid: 'Ein Natriumiodid-Kristall mit einer Prise Thallium. Er blitzt, wenn ein Gammastrahl ihn trifft, und eine Röhre macht aus dem Blitz Strom. Er fängt mehr Strahlen, misst ihre Energie aber weniger genau.',
          sci: 'Ein NaI(Tl)-Szintillator mit Photomultiplier: etwa 7% Auflösung bei 662 keV (Cäsium-137), etwa 5% bei 1332 keV; hohe Effizienz, schlechte Energieauflösung.',
        },
      },
      board: {
        title: 'FREMDATOME',
        unit: 'pro cm3',
        hpge: 'Detektorkristall',
        passes: 'Durchgänge',
        enough: 'rein genug!',
        more: 'reiner, weiter so',
        sci: 'ein Beispiel: jeder Durchgang lässt 1/4 der Verunreinigung',
        empty: 'noch keine Zählungen',
        ge: 'Germanium',
        nai: 'Natriumiodid',
        geFw: 'Breite 1,9 keV (0,14%)',
        naiFw: 'Breite 65 keV (4,9%)',
        keV: 'Energie in keV',
      },
      panel: {
        kid: [
          'Detektoren brauchen Germanium, das reiner ist als fast alles. 1951 fand William Pfann bei den Bell Labs einen Weg: ein kurzes Stück des Stabs schmelzen und die Heizung langsam entlangschieben. Verunreinigungen bleiben gern in der Flüssigkeit, darum trägt die geschmolzene Zone sie ans Ende, das abgeschnitten wird.',
          'Tippe für jeden Durchgang auf den Heizring. Die Körnchen, die man sieht, sind nach ein paar Durchgängen weg, aber die Anzeige zählt weiter die Atome, die zu klein zum Sehen sind. Ihre goldene Linie ist die Reinheit eines Detektorkristalls.',
          'Ein so reiner Kristall misst Energie sehr genau. Tippe auf die Kobaltquelle: Der Germaniumdetektor (oben) zeichnet zwei dünne Linien, der Natriumiodid-Detektor (unten) nur zwei verschwommene Hügel. Zieh am Zoomregler, um es zu sehen.',
        ],
        sci: [
          'Zonenreinigung: Eine geschmolzene Zone von einigen Zentimetern wandert am Stab entlang, und eine Verunreinigung mit einem Segregationskoeffizienten unter 1 bleibt in der Flüssigkeit und wird ans Ende gekehrt (Pfann, Bell Labs, 1951, zuerst zur Reinigung von Germanium für Transistoren). Einige Verunreinigungen, darunter Bor in Germanium, haben einen Koeffizienten über 1 und wandern in die andere Richtung.',
          'Die Anzeige ist ein Beispiel: Das Ausgangsmetall ist zu 99,9999% Germanium (4 × 10¹⁶ Fremdatome pro cm³ unter 4,4 × 10²² Germaniumatomen pro cm³), und jeder Durchgang lässt ein Viertel zurück. Ein echter HPGe-Kristall hat netto etwa 10¹⁰ Fremdatome pro cm³, etwa ein Atom unter 4 × 10¹²; der Kristall wird danach aus dem gereinigten Metall gezogen.',
          'Kobalt-60 zerfällt zu Nickel-60, das 1173,2 und 1332,5 keV aussendet. Eine HPGe-Diode (etwa 3 eV je Elektron-Loch-Paar, nahe 77 K gehalten) erreicht etwa 0,14% bei 1332 keV; NaI(Tl) etwa 5%. Unter jeder Linie liegt ihr Compton-Plateau, das bei 963 und 1118 keV endet. Die Zählungen hier sind erfunden, um die Formen zu zeigen.',
        ],
      },
    },
    wait: {
      label: 'Das lange Warten',
      title: 'Warten auf einen Zerfall, den noch keiner sah',
      tags: { tank: 'der Wassertank, verkleinert', argon: 'flüssiges Argon', model: 'Modell der Kristallanordnung', run: '1 JAHR LAUFEN', lens: 'EIN ZERFALL' },
      hints: { run: 'Tippe auf den grünen Knopf', crystal: 'Tippe auf einen Kristall', lens: 'Tippe auf die Linse', more: 'Lass noch ein Jahr laufen', done: 'Tippe noch einmal auf einen Kristall oder die Linse' },
      slider: 'Jahre des Wartens',
      units: { years: 'Jahre' },
      buttons: { year: 'Noch ein Jahr warten', reset: 'Bildschirm leeren', hoped: 'Den Zerfall zeigen, auf den alle hoffen', usual: 'Zurück zum gewöhnlichen Zerfall', decay: 'Einen Zerfall in der Linse ansehen' },
      rows: { years: 'Jahre des Wartens', events: 'Zerfälle bisher', perDay: 'Zerfälle pro Tag', window: 'Gezählt in der Linie bei 2039 keV', expect: 'Ein Jahr in der Linie, wäre die Halbwertszeit genau die Grenze' },
      says: {
        enough: { kid: 'Fünf Jahre sind das Längste, was dieser Bildschirm zeigt. Leere ihn, um neu zu warten.', sci: 'Fünf Jahre sind der längste Lauf hier. Leere den Bildschirm, um neu zu beginnen.' },
        first: {
          kid: 'Ein Jahr Warten: etwa 117 000 gewöhnliche Zerfälle. Jeder besteht aus zwei Elektronen, die einen Kristall verlassen, und beide lassen ihre Energie darin zurück.',
          sci: 'Ein Jahr, 40 kg Germanium-76: etwa 1,2 × 10⁵ Zwei-Neutrino-Zerfälle, aus N ln 2 / T½ mit T½ = 1,9 × 10²¹ Jahren.',
        },
        last: {
          kid: 'Fünf Jahre, und die goldene Linie bei 2039 ist noch leer. Auf eine leere Linie zu warten ist echte Forschung: Es sagt uns, wie selten der Zerfall ist.',
          sci: 'Fünf Jahre: noch nichts bei 2039 keV. Dieses Modell hat keinen Untergrund; echte Experimente geben sich große Mühe, fast keinen zu haben.',
        },
        decay: {
          kid: 'Ein Germanium-76-Atom: Zwei Neutronen werden im selben Moment zu zwei Protonen, und zwei Elektronen fliegen davon, mit zwei fast unsichtbaren Begleitern, den Antineutrinos. Der Kristall misst die Elektronen. Die Neutrinos tragen den Rest davon.',
          sci: 'Zwei-Neutrino-Doppelbetazerfall: ⁷⁶Ge wird zu ⁷⁶Se. Der Detektor registriert die Summe der Elektronenenergien (ein breites Spektrum bis 2039 keV); die beiden Antineutrinos entkommen ungesehen.',
        },
        hoped: {
          kid: 'Der Zerfall, auf den alle hoffen: Kein Neutrino fliegt davon, also tragen die beiden Elektronen die ganze Energie, immer gleich viel: eine scharfe Linie bei 2039. Noch nie hat sie jemand gesehen.',
          sci: 'Neutrinoloser Doppelbetazerfall: Beide Elektronen tragen das volle Q = 2039 keV, eine scharfe Linie. Es kann ihn nur geben, wenn das Neutrino sein eigenes Antiteilchen ist. GERDA: Halbwertszeit über 1,8 × 10²⁶ Jahre (2020).',
        },
        modeOn: { kid: 'Die Linse zeigt jetzt den Zerfall, auf den alle hoffen. Tippe auf einen Kristall, um ihn zu sehen.', sci: 'Linse auf neutrinolosen Doppelbetazerfall gestellt (nie beobachtet). Tippe auf einen Kristall.' },
        modeOff: { kid: 'Zurück zum gewöhnlichen Zerfall, dem, der wirklich geschieht.', sci: 'Zurück zum Zwei-Neutrino-Zerfall, dem gemessenen.' },
      },
      board: {
        title: 'ENERGIE DER BEIDEN ELEKTRONEN',
        years: 'Jahre',
        keV: 'Energie in keV',
        line: 'in der Linie gezählt',
        ifSeen: 'so sähe er aus: nie gesehen',
        thisOne: 'dieser:',
        events: 'Zerfälle',
        sci: 'Halbwertszeit mit zwei Neutrinos 1,9e21 a, ohne Neutrinos über 1,8e26 a',
        se: 'Selen-76',
        ge76: 'Germanium-76',
        nuModeOn: 'tippe auf die Linse: der Zerfall, auf den alle hoffen',
        nuModeOff: 'tippe auf die Linse: zurück zum gewöhnlichen',
        noNu: 'keine Neutrinos: alle Energie in den Elektronen',
        twoNu: 'zwei Antineutrinos entkommen',
        electrons: 'Elektronen',
        nus: 'Antineutrinos',
        waiting: 'tippe auf einen Kristall',
        twoAtOnce: 'zwei Neutronen werden auf einmal zu Protonen',
        nucSci: 'einige der 76 Nukleonen',
      },
      panel: {
        kid: [
          'Im Tank hängen die Kristalle in flüssigem Argon. Germanium-76 ist zugleich das, was zerfallen könnte, und der Detektor, der es bemerkt. Tippe auf den grünen Knopf oder zieh am Regler, um Jahr für Jahr zu warten.',
          'Jedes Jahr geschehen in diesem Modell etwa hunderttausend gewöhnliche Zerfälle, die den Hügel aufbauen. Die goldene Linie bei 2039 bleibt leer: Dort würde der sehr seltene Zerfall auftauchen.',
          'Tippe auf einen Kristall, um einen Zerfall in der Linse anzusehen. Tippe dann auf die Linse, um den Zerfall zu sehen, auf den alle hoffen. Die Physiker warten und prüfen weiter, denn eines Tages könnte er da sein.',
        ],
        sci: [
          'Das Modell enthält 40 kg Germanium-76 (GERDAs Anordnung hatte etwa 36 kg angereicherte Detektoren; LEGEND-200 bis zu 200 kg). Bei einer Zwei-Neutrino-Halbwertszeit von 1,9 × 10²¹ Jahren ergibt N ln 2 / T½ etwa 320 Zerfälle pro Tag, 1,2 × 10⁵ pro Jahr.',
          'Der Hügel ist die summierte kinetische Energie der beiden Elektronen, K (Q − K)⁵ mal ein Polynom (Doi, Kotani und Takasugi), bis Q = 2039 keV. Nichts sonst ist simuliert: Echte Spektren enthalten auch den Untergrund anderer Radioaktivität, den GERDA auf etwa 5 × 10⁻⁴ Zählungen pro keV, Kilogramm und Jahr gesenkt hat.',
          'Hätte der neutrinolose Zerfall genau die Halbwertszeit der Grenze, 1,8 × 10²⁶ Jahre, würden diese 40 kg etwa 1,2 Zerfälle pro Jahr in der Linie liefern. Darum brauchen Experimente hunderte Kilogramm-Jahre an Daten und fast keinen Untergrund.',
        ],
      },
    },
  },
}
