// The words of iron's meteorite room ("A dagger from outer space?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Fe.js
// (the easel shows it); the room measures Hoba, etches meteorite iron and follows it back to a little planet.
// Sources: Hoba (Wikipedia, "Hoba meteorite": found 1920 by Jacobus Hermanus Brits while ploughing, about
// 2.7 x 2.7 x 0.9 m, more than 60 t, IVB ataxite, national monument 15 March 1955, visitor centre 1987, no
// crater, fell less than 80,000 years ago; about 16.4% Ni and 0.8% Co, from the analyses the sources share);
// Gibeon (IVA fine octahedrite, about 7.7% Ni, Great Namaqualand, worked by the Nama); the Widmanstätten
// pattern (Thomson 1804, Widmanstätten 1808, kamacite grows between about 700 and 450 °C); cooling rates
// (IVA 100 to 6600 °C per million years, Yang, Goldstein and Scott 2008); the dagger (Comelli et al. 2016,
// Meteoritics & Planetary Science 51: 10.8% Ni, 0.58% Co by portable XRF; Matsui et al. 2022: traces of the
// pattern, forging below about 950 °C, a possible gift from Mitanni, disputed). X-ray lines: Fe Ka 6.40 keV,
// Co Ka 6.93 keV, Ni Ka 7.48 keV. An African bush elephant bull: about 6 t.

export const METEORITE_WORDS = {
  en: {
    title: 'Hoba farm at dusk',
    greet: {
      kid: "We are inside the picture: a farm in Namibia where the biggest meteorite on Earth lies! It is made of iron, like me, and it came from space. The picture's story is on the easel beside you.",
      sci: "Hoba West farm near Grootfontein, Namibia, at dusk: the largest known meteorite, an iron-nickel block of about 60 t, still lying where it fell. Measure it, etch meteorite iron, and follow it back to the core of a shattered little planet. The picture's story is on the easel.",
    },
    talk: {
      kid: [
        'A farmer found Hoba in 1920. He was ploughing his field when his plough hit something hard and stopped. It was a meteorite!',
        'Hoba has never been moved: it is far too heavy. People come from all over the world to sit on the stone steps round it, and some even climb on top.',
        'Look up now and then: a shooting star is a speck of space dust, often no bigger than a grain of sand, burning up high in the air.',
      ],
      sci: [
        'Jacobus Hermanus Brits found Hoba in 1920 while ploughing. It was declared a national monument in 1955; since 1987 a visitor centre and stone terraces have surrounded it, and the vandalism has stopped.',
        "Hoba's surface is a crust of iron hydroxides, weathered over the thousands of years it has lain here (it probably fell less than 80,000 years ago). Erosion, sampling and vandalism have made it lighter than when it was found.",
        'Meteors glow roughly 70 to 120 km up, as grains of dust burn in the air. Most meteorites that reach the ground are stony; irons are a small share, but they last long and are easy to recognise.',
      ],
    },
    hoba: {
      label: 'Hoba, the biggest meteorite',
      title: 'Hoba: 60 tonnes of iron from space',
      hints: {
        meter: 'Tap the X-ray meter to measure Hoba',
        reading: 'The meter is reading the metal',
        magnet: 'Tap the magnet hanging from the tripod',
        scale: 'Tap the big scale to weigh Hoba in elephants',
        more: 'Tap the scale for another elephant',
        off: 'Tap the magnet to pull it off',
        done: 'Tap the meter, the magnet or the scale again',
      },
      buttons: { meter: 'Measure it with X-rays', magnet: 'Try the magnet', off: 'Pull the magnet off', add: 'Add an elephant', empty: 'Empty the scale' },
      slider: 'Elephants on the scale',
      scale: { hoba: 'Hoba: about 60 t', count: '{n} × 6 t = {t} t', models: 'Models at 1:19' },
      legend: 'Fe 83%   Ni 16%   Co 0.8%',
      says: {
        meter: {
          kid: 'Beep! The meter shines X-rays into Hoba, and every kind of atom answers with its own X-ray glow. About 83% iron, 16% nickel and a pinch of cobalt. Iron mixed with that much nickel is the sign of a meteorite.',
          sci: 'X-ray fluorescence: the X-rays knock inner electrons out, and each element answers with its own lines (Fe Kα 6.40 keV, Co Kα 6.93 keV, Ni Kα 7.48 keV). Hoba: about 16.4% Ni and 0.8% Co, the rest iron. Metallic iron with this much nickel is the signature of a meteorite.',
        },
        magnet: {
          kid: 'Clunk! The magnet swings to Hoba and sticks fast. Under its rusty skin Hoba is solid metal, and iron metal pulls magnets hard.',
          sci: "Iron-nickel metal is ferromagnetic. The weathered crust is only weakly magnetic, but the metal under it holds the magnet: a meteorite hunter's first test.",
        },
        off: { kid: 'Pulled off! Now it swings to and fro on its string.', sci: 'Released: a pendulum again, slowly damped by the air.' },
        one: { kid: 'One elephant: 6 tonnes. Hoba does not even move!', sci: 'One African bush elephant bull, about 6 t: a tenth of Hoba.' },
        balanced: {
          kid: 'Ten elephants, and the scale balances! Hoba takes up hardly more room than one elephant, but it weighs as much as ten. Iron is that heavy.',
          sci: 'Balanced at 10 × 6 t = 60 t. Iron-nickel metal is about 7.9 g/cm³, nearly eight times as dense as an elephant, so a block the size of one or two elephants weighs as much as ten. Both models are at 1:19.',
        },
        heavier: { kid: 'Now the elephants are heavier, and their pan goes down.', sci: 'Over 60 t: the elephants outweigh Hoba.' },
        empty: { kid: 'Off they go! The scale is empty again.', sci: 'Pan cleared.' },
      },
      panel: {
        kid: [
          'Hoba is the biggest meteorite ever found: a flat block of iron and nickel about 2.7 metres across, as big as the floor of a small room, and about 60 tonnes heavy. A farmer, Jacobus Hermanus Brits, found it in 1920 when his plough hit it. Nobody has ever moved it: it lies where it landed.',
          'Strangely, there is no crater round it. Scientists think the air slowed it down a lot, maybe because it is so flat, so it landed quite gently for a meteorite. Tap the X-ray meter to see what Hoba is made of, the magnet to test it, and the big scale to weigh it in elephants.',
        ],
        sci: [
          'Hoba, found in 1920 by Jacobus Hermanus Brits on the farm Hoba West near Grootfontein, is the largest known meteorite: about 2.7 × 2.7 × 0.9 m and some 60 t today, more when found, since erosion, sampling and vandalism have taken their share. It is an ataxite of group IVB, with about 16.4% Ni and 0.8% Co. A national monument since 1955.',
          'No crater has been found. The usual explanation is that the atmosphere braked it to a low speed, perhaps helped by its flat shape, so it came down without blasting out a crater. For the scale: an African bush elephant bull weighs about 6 t.',
        ],
      },
    },
    dagger: {
      label: "Tutankhamun's dagger",
      title: "A pharaoh's dagger of sky iron",
      cards: { dagger: "Tutankhamun's dagger (copy)", knife: 'Smelted iron' },
      hints: {
        dagger: "Tap the dagger's iron blade to measure it",
        knife: 'Now tap the plain iron knife',
        again: 'Tap either blade to measure it again',
        reading: 'The meter is reading',
      },
      buttons: { dagger: 'Measure the dagger', knife: 'Measure the iron knife' },
      legend: { dagger: 'Ni 10.8%   Co 0.58%', knife: 'Ni < 1%' },
      says: {
        dagger: {
          kid: "The blade has almost 11% nickel and a little cobalt, just like iron meteorites. Tutankhamun's dagger was made of iron that fell from the sky!",
          sci: '10.8% Ni and 0.58% Co, as Comelli and colleagues measured on the real blade with portable X-ray fluorescence in 2016: the composition of an iron meteorite, not of smelted iron.',
        },
        knife: {
          kid: 'Hardly any nickel! Iron that people smelt from rock has very little. So the nickel tells sky iron from Earth iron.',
          sci: 'Smelted iron: nickel well under 1%. Iron ores carry little nickel, so smelted iron rarely has more than a few percent; meteoritic iron has about 5% or more.',
        },
      },
      panel: {
        kid: [
          "Tutankhamun was a young pharaoh of Egypt who died about 3300 years ago. When Howard Carter's team unwrapped him in 1925, they found two daggers with him: one with a blade of gold and one with a blade of iron, at a time when people were only beginning to make iron. This case holds a copy of the iron one.",
          'In 2016 scientists measured the real blade with an X-ray meter like this one, without touching it, and its nickel showed that the iron came from a meteorite. The handle is gold, decorated with tiny gold grains and colourful bands, with a knob of rock crystal on top.',
        ],
        sci: [
          "The iron dagger was found by Howard Carter's team in 1925 in the wrappings of Tutankhamun's mummy (he died around 1323 BC), beside a gold-bladed one. Its hilt is gold with granulation and inlay, with a rock-crystal pommel. In 2016 Comelli and colleagues measured the blade non-destructively with portable X-ray fluorescence: Fe with 10.8% Ni and 0.58% Co, a meteoritic composition.",
          'In 2022 Matsui and colleagues mapped the blade and reported traces of a Widmanstätten pattern, which suggests it was forged at fairly low temperatures, below about 950 °C; they proposed that it may have come as a gift from the kingdom of Mitanni. Others dispute this: where it was made is still open.',
        ],
      },
    },
    etch: {
      label: 'The etching bench',
      title: 'Cut, polish, etch: the hidden crystals',
      sign: 'Etching bench',
      pieces: { gibeon: 'Gibeon', hoba: 'Hoba', bar: 'Smelted iron' },
      hints: {
        saw: 'Tap the saw to cut this piece',
        polish: 'Tap the polishing wheel to polish it',
        acid: 'Tap the acid dropper to etch it',
        lens: 'Tap the lens to see its atoms',
        next: 'Tap another piece to work on it',
        fresh: 'Tap the crate for new pieces',
        working: 'Watch the bench',
      },
      buttons: { next: 'Next piece', saw: 'Saw', polish: 'Polish', acid: 'Acid', lens: 'Lens', fresh: 'New pieces' },
      legend: { gibeon: 'kamacite · taenite', hoba: 'Ni 16%', bar: 'Fe' },
      says: {
        pick: {
          gibeon: {
            kid: 'Gibeon, a meteorite from the south of Namibia. The Nama people made tools and spearheads from its iron.',
            sci: 'Gibeon: group IVA, a fine octahedrite with about 7.7% Ni, scattered over Great Namaqualand. The Nama worked it into tools and weapons.',
          },
          hoba: { kid: 'A piece of Hoba, the giant out there.', sci: 'Hoba: an IVB ataxite, about 16% Ni.' },
          bar: { kid: 'A bar of iron made by people, in a furnace, from rock.', sci: 'Smelted iron, made from ore: hardly any nickel.' },
        },
        saw: { kid: 'The saw cuts the end off. The new face is grey and full of scratches.', sci: 'Sawn: a fresh face, dull and scored by the blade.' },
        polish: {
          kid: 'The wheel spins with finer and finer powder until the face shines like a mirror. No pattern yet!',
          sci: 'Ground and polished with ever finer abrasives: a mirror, and no structure shows yet.',
        },
        acid: {
          gibeon: {
            kid: 'Look! A criss-cross pattern appears, like woven straw. The acid eats the iron plates with little nickel faster than their thin nickel-rich edges, so the crystals show.',
            sci: 'The Widmanstätten pattern: plates of kamacite (about 5 to 7% Ni) on the octahedral planes of the former taenite crystal, edged by nickel-rich taenite, which resists the acid. In Gibeon each plate is a few tenths of a millimetre wide (drawn larger here).',
          },
          hoba: {
            kid: 'Nothing! Hoba stays plain. It has so much nickel that its crystals are far too tiny to see.',
            sci: 'No pattern: with about 16% Ni the metal became a microscopic intergrowth of kamacite and taenite (plessite), far too fine for the eye.',
          },
          bar: {
            kid: 'Nothing here either. Iron made from rock has almost no nickel, so it never grows these crystals.',
            sci: 'No pattern: almost no nickel, and it cooled in hours, not over millions of years.',
          },
        },
        lens: {
          gibeon: {
            kid: 'Atoms! In the wide plates only a few nickel atoms (green) sit among the iron. In the thin bright edges there are lots.',
            sci: 'Kamacite: body-centred cubic iron with about 6% Ni. Taenite: face-centred cubic, 25 to 50% Ni near its edges. The nickel moved between them, atom by atom, over millions of years.',
          },
          hoba: { kid: 'Iron atoms with nickel sprinkled all through: about one atom in six.', sci: 'About 16% Ni, spread through a microscopic mix of kamacite and taenite.' },
          bar: { kid: 'Just iron atoms, hardly any nickel.', sci: 'Nearly pure iron (real bars also hold a little carbon and slag).' },
        },
        needCut: { kid: 'Cut it with the saw first.', sci: 'Saw it first.' },
        needPolish: { kid: 'Polish it first: the acid needs a smooth face.', sci: 'Polish it first: etching a sawn face shows only scratches.' },
        needEtch: { kid: 'Cut it, polish it and etch it first, then look closer.', sci: 'Prepare the face first: saw, polish, etch.' },
        done: { kid: 'This one is finished. Tap another piece.', sci: 'Done with this one: choose another piece.' },
        fresh: { kid: 'New pieces, all rough again!', sci: 'Fresh samples.' },
      },
      panel: {
        kid: [
          'Meteorite iron hides a secret inside. Tap a piece, cut it with the saw, polish it like a mirror, then put a few drops of acid on it. Try all three: Gibeon, a meteorite from the south of Namibia, a piece of Hoba, and a bar of iron made by people.',
          'Only one of them shows the criss-cross crystals. They grew while the iron cooled very slowly, over millions of years, inside a little planet. No furnace on Earth can cool that slowly, so a pattern like this is a sign that the iron came from space.',
        ],
        sci: [
          'William Thomson saw the pattern in 1804 in Naples after treating a meteorite with nitric acid; Count Alois von Beckh Widmanstätten observed it in 1808, and it carries his name. The usual etchant today is nital, a few percent of nitric acid in alcohol.',
          "Taenite (face-centred cubic, rich in nickel) is stable when hot. As the core cooled, kamacite (body-centred cubic, poor in nickel) grew from it in plates along its octahedral planes, mostly between about 700 and 450 °C, as nickel moved from the growing kamacite into the shrinking taenite. The plates' width depends on the cooling rate and the nickel content. Ataxites like Hoba, richer in nickel, never form coarse plates; smelted iron, with almost no nickel and cooled in hours, forms none.",
        ],
      },
    },
    asteroid: {
      label: 'A little planet',
      title: 'Where iron meteorites come from',
      hints: {
        heat: 'Tap the little planet to heat it',
        sinking: 'Watch the iron sink to the middle',
        slower: 'Tap the lens to cool the core slower',
        faster: 'Tap the lens to cool the core faster',
        smash: 'Tap the little planet to smash it',
        flying: 'Watch the pieces fly',
        again: 'Tap the pieces for a new little planet',
      },
      buttons: { heat: 'Heat it', smash: 'Smash it', again: 'A new little planet', slow: 'Cool slowly', fast: 'Cool fast' },
      slider: 'How fast the core cools',
      rate: { kid: '{r} °C every million years', sci: '{r} °C per million years: from 700 to 450 °C in {t} million years' },
      lensLabel: { none: 'No iron core yet', slow: 'Slow cooling: wide plates', mid: 'The slower, the wider', fast: 'Fast cooling: thin plates', sci: '{r} °C per million years' },
      says: {
        heat: {
          kid: 'The little planet heats up from inside! When the Solar System was young, some of its atoms were radioactive and gave off enough heat to melt it.',
          sci: 'Heating by aluminium-26 (half-life about 0.7 million years): planetesimals that formed within the first million years or two melted from the inside.',
        },
        core: {
          kid: 'Iron is heavier than rock, so the molten iron sinks to the middle and makes an iron heart, the core. The rock stays round it.',
          sci: 'Differentiation: molten iron-nickel, with some sulfur, is more than twice as dense as the silicate melt and sinks into a core; the silicates form the mantle.',
        },
        cooled: {
          kid: 'Now the core cools, very slowly, for millions of years. Look in the lens: crystals grow in the iron.',
          sci: 'The core cools; between about 700 and 450 °C kamacite plates grow from the taenite. The lens follows them.',
        },
        slower: { kid: 'Slower cooling: the plates have more time and grow wider.', sci: 'Slower cooling, more time for nickel to diffuse: wider kamacite plates.' },
        faster: { kid: 'Faster cooling: thin plates.', sci: 'Faster cooling: narrower plates.' },
        smash: {
          kid: 'Crash! Another rock smashes the little planet. Pieces of its iron heart become iron meteorites; pieces of its rocky outside become stony meteorites.',
          sci: 'A disruptive collision: core fragments become iron meteorites, mantle fragments stony ones (achondrites).',
        },
        earth: {
          kid: 'And one piece, after flying round the Sun for an enormously long time, falls to Earth!',
          sci: "The fragments drift for a long time before they reach the Earth: iron meteorites' cosmic-ray exposure ages are mostly hundreds of millions of years.",
        },
        again: { kid: 'A new little planet, all mixed up again: rock with grains of metal. Heat it and watch!', sci: 'Reset: an undifferentiated planetesimal, rock with grains of metal.' },
        first: { kid: 'No iron core yet: heat the little planet first.', sci: 'No core yet: melt the planetesimal first.' },
      },
      panel: {
        kid: [
          "Iron meteorites are pieces of the iron hearts of little planets. When the Solar System was young, little planets got so hot inside that they melted. Their iron sank to the middle and made a core, like the Earth's.",
          'The core cooled very, very slowly, over millions of years, and big crystals grew in it: the slower it cooled, the wider they grew. Then the little planet was smashed in a crash, and its pieces have been flying round the Sun ever since. Now and then one falls to Earth.',
        ],
        sci: [
          'Iron meteorites come from the metal cores of planetesimals that formed within the first million years or two of the Solar System and melted, heated mainly by aluminium-26. Metal separated from silicate and sank; the cores then cooled and crystallised. Iron meteorites sample dozens of different parent bodies.',
          "Cooling rates, read from the nickel profiles across taenite plates, run from tens to thousands of °C per million years; the IVA irons, Gibeon's group, alone span about 100 to 6600 (Yang and colleagues, 2008). The lens shows the trend only. Collisions broke the parent bodies apart; the fragments reach the Earth after hundreds of millions of years in space.",
        ],
      },
    },
  },

  'pt-pt': {
    title: 'A quinta de Hoba ao entardecer',
    greet: {
      kid: 'Estamos dentro da imagem: uma quinta na Namíbia onde está o maior meteorito da Terra! É feito de ferro, como eu, e veio do espaço. A história da imagem está no cavalete ao teu lado.',
      sci: 'A quinta Hoba West, perto de Grootfontein, na Namíbia, ao entardecer: o maior meteorito conhecido, um bloco de ferro e níquel com cerca de 60 t, ainda deitado onde caiu. Mede-o, ataca ferro de meteorito com ácido e segue-o até ao núcleo de um pequeno planeta despedaçado. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Um agricultor encontrou o Hoba em 1920. Estava a lavrar o campo quando o arado bateu em algo duro e parou. Era um meteorito!',
        'O Hoba nunca foi mudado de sítio: é pesado demais. Vem gente de todo o mundo sentar-se nos degraus de pedra à volta dele, e alguns até sobem para cima dele.',
        'Olha para cima de vez em quando: uma estrela cadente é um grão de poeira do espaço, muitas vezes não maior do que um grão de areia, a arder lá no alto.',
      ],
      sci: [
        'Jacobus Hermanus Brits encontrou o Hoba em 1920, enquanto lavrava. Foi declarado monumento nacional em 1955; desde 1987 está rodeado por um centro de visitantes e socalcos de pedra, e o vandalismo acabou.',
        'A superfície do Hoba é uma crosta de hidróxidos de ferro, alterada pelos milhares de anos que aqui passou (provavelmente caiu há menos de 80 mil anos). A erosão, as amostras e o vandalismo tornaram-no mais leve do que quando foi encontrado.',
        'Os meteoros brilham a cerca de 70 a 120 km de altitude, quando grãos de poeira ardem no ar. A maior parte dos meteoritos que chegam ao chão são rochosos; os de ferro são uma pequena parte, mas duram muito e reconhecem-se facilmente.',
      ],
    },
    hoba: {
      label: 'Hoba, o maior meteorito',
      title: 'Hoba: 60 toneladas de ferro do espaço',
      hints: {
        meter: 'Toca no medidor de raios X para medir o Hoba',
        reading: 'O medidor está a ler o metal',
        magnet: 'Toca no íman pendurado no tripé',
        scale: 'Toca na grande balança para pesar o Hoba em elefantes',
        more: 'Toca na balança para mais um elefante',
        off: 'Toca no íman para o arrancar',
        done: 'Toca outra vez no medidor, no íman ou na balança',
      },
      buttons: { meter: 'Medir com raios X', magnet: 'Experimentar o íman', off: 'Arrancar o íman', add: 'Pôr um elefante', empty: 'Esvaziar a balança' },
      slider: 'Elefantes na balança',
      scale: { hoba: 'Hoba: cerca de 60 t', count: '{n} × 6 t = {t} t', models: 'Modelos à escala 1:19' },
      legend: 'Fe 83%   Ni 16%   Co 0,8%',
      says: {
        meter: {
          kid: 'Bip! O medidor lança raios X para dentro do Hoba, e cada tipo de átomo responde com o seu próprio brilho de raios X. Cerca de 83% de ferro, 16% de níquel e uma pitada de cobalto. Ferro misturado com tanto níquel é sinal de meteorito.',
          sci: 'Fluorescência de raios X: os raios X arrancam eletrões interiores, e cada elemento responde com as suas próprias riscas (Fe Kα 6,40 keV, Co Kα 6,93 keV, Ni Kα 7,48 keV). Hoba: cerca de 16,4% de Ni e 0,8% de Co, o resto ferro. Ferro metálico com tanto níquel é a assinatura de um meteorito.',
        },
        magnet: {
          kid: 'Tlac! O íman salta para o Hoba e fica bem agarrado. Debaixo da pele enferrujada, o Hoba é metal maciço, e o ferro metálico puxa os ímanes com força.',
          sci: 'O metal de ferro e níquel é ferromagnético. A crosta alterada é só fracamente magnética, mas o metal por baixo segura o íman: o primeiro teste de quem procura meteoritos.',
        },
        off: { kid: 'Arrancado! Agora baloiça para trás e para a frente no fio.', sci: 'Solto: de novo um pêndulo, travado devagar pelo ar.' },
        one: { kid: 'Um elefante: 6 toneladas. O Hoba nem se mexe!', sci: 'Um elefante-da-savana macho, cerca de 6 t: um décimo do Hoba.' },
        balanced: {
          kid: 'Dez elefantes, e a balança fica equilibrada! O Hoba ocupa pouco mais espaço do que um elefante, mas pesa tanto como dez. O ferro é mesmo pesado.',
          sci: 'Equilíbrio em 10 × 6 t = 60 t. O metal de ferro e níquel tem cerca de 7,9 g/cm³, quase oito vezes a densidade de um elefante, por isso um bloco do tamanho de um ou dois elefantes pesa tanto como dez. Os dois modelos estão à escala 1:19.',
        },
        heavier: { kid: 'Agora os elefantes pesam mais, e o prato deles desce.', sci: 'Acima de 60 t: os elefantes pesam mais do que o Hoba.' },
        empty: { kid: 'Lá vão eles! A balança está vazia outra vez.', sci: 'Prato vazio.' },
      },
      panel: {
        kid: [
          'O Hoba é o maior meteorito alguma vez encontrado: um bloco achatado de ferro e níquel com cerca de 2,7 metros de lado, do tamanho do chão de um quarto pequeno, e cerca de 60 toneladas. Um agricultor, Jacobus Hermanus Brits, encontrou-o em 1920, quando o arado bateu nele. Ninguém nunca o mudou de sítio: está onde caiu.',
          'Curiosamente, não há cratera à volta dele. Os cientistas pensam que o ar o travou muito, talvez por ser tão achatado, e por isso aterrou com bastante suavidade para um meteorito. Toca no medidor de raios X para saberes de que é feito o Hoba, no íman para o testares e na grande balança para o pesares em elefantes.',
        ],
        sci: [
          'O Hoba, encontrado em 1920 por Jacobus Hermanus Brits na quinta Hoba West, perto de Grootfontein, é o maior meteorito conhecido: cerca de 2,7 × 2,7 × 0,9 m e umas 60 t hoje, mais quando foi encontrado, porque a erosão, as amostras e o vandalismo levaram a sua parte. É um ataxito do grupo IVB, com cerca de 16,4% de Ni e 0,8% de Co. Monumento nacional desde 1955.',
          'Nunca se encontrou uma cratera. A explicação habitual é que a atmosfera o travou até uma velocidade baixa, talvez ajudada pela sua forma achatada, e por isso desceu sem abrir uma cratera. Para a balança: um elefante-da-savana macho pesa cerca de 6 t.',
        ],
      },
    },
    dagger: {
      label: 'O punhal de Tutankhamon',
      title: 'O punhal de um faraó, de ferro do céu',
      cards: { dagger: 'Punhal de Tutankhamon (cópia)', knife: 'Ferro do minério' },
      hints: {
        dagger: 'Toca na lâmina de ferro do punhal para a medir',
        knife: 'Agora toca na faca simples de ferro',
        again: 'Toca numa das lâminas para a medir outra vez',
        reading: 'O medidor está a ler',
      },
      buttons: { dagger: 'Medir o punhal', knife: 'Medir a faca de ferro' },
      legend: { dagger: 'Ni 10,8%   Co 0,58%', knife: 'Ni < 1%' },
      says: {
        dagger: {
          kid: 'A lâmina tem quase 11% de níquel e um pouco de cobalto, tal como os meteoritos de ferro. O punhal de Tutankhamon foi feito de ferro que caiu do céu!',
          sci: '10,8% de Ni e 0,58% de Co, como mediram Comelli e colegas na lâmina verdadeira, com fluorescência de raios X portátil, em 2016: a composição de um meteorito de ferro, não de ferro obtido do minério.',
        },
        knife: {
          kid: 'Quase nenhum níquel! O ferro que as pessoas tiram das rochas tem muito pouco. Assim, o níquel distingue o ferro do céu do ferro da Terra.',
          sci: 'Ferro obtido do minério: níquel bem abaixo de 1%. Os minérios de ferro têm pouco níquel, por isso esse ferro raramente passa de alguns por cento; o ferro meteorítico tem cerca de 5% ou mais.',
        },
      },
      panel: {
        kid: [
          'Tutankhamon foi um jovem faraó do Egito que morreu há cerca de 3300 anos. Quando a equipa de Howard Carter lhe tirou as faixas, em 1925, encontrou com ele dois punhais: um com lâmina de ouro e outro com lâmina de ferro, numa altura em que as pessoas mal começavam a fazer ferro. Esta vitrine tem uma cópia do de ferro.',
          'Em 2016, cientistas mediram a lâmina verdadeira com um medidor de raios X como este, sem lhe tocar, e o níquel mostrou que o ferro veio de um meteorito. O cabo é de ouro, decorado com grãozinhos de ouro e faixas coloridas, com um botão de cristal de rocha em cima.',
        ],
        sci: [
          'O punhal de ferro foi encontrado pela equipa de Howard Carter em 1925, entre as faixas da múmia de Tutankhamon (que morreu por volta de 1323 a.C.), ao lado de um de lâmina de ouro. O punho é de ouro, com granulado e embutidos, e o pomo é de cristal de rocha. Em 2016, Comelli e colegas mediram a lâmina sem a danificar, com fluorescência de raios X portátil: Fe com 10,8% de Ni e 0,58% de Co, uma composição meteorítica.',
          'Em 2022, Matsui e colegas mapearam a lâmina e descreveram vestígios de um padrão de Widmanstätten, o que sugere que foi forjada a temperaturas bastante baixas, abaixo de cerca de 950 °C; propuseram que talvez tenha chegado como presente do reino de Mitanni. Outros discordam: onde foi feita continua em aberto.',
        ],
      },
    },
    etch: {
      label: 'A bancada do ácido',
      title: 'Cortar, polir, atacar: os cristais escondidos',
      sign: 'Bancada do ácido',
      pieces: { gibeon: 'Gibeon', hoba: 'Hoba', bar: 'Ferro do minério' },
      hints: {
        saw: 'Toca na serra para cortar esta peça',
        polish: 'Toca no disco de polir para a polir',
        acid: 'Toca no conta-gotas do ácido para a atacar',
        lens: 'Toca na lupa para veres os átomos',
        next: 'Toca noutra peça para trabalhares nela',
        fresh: 'Toca na caixa para peças novas',
        working: 'Observa a bancada',
      },
      buttons: { next: 'Peça seguinte', saw: 'Serrar', polish: 'Polir', acid: 'Ácido', lens: 'Lupa', fresh: 'Peças novas' },
      legend: { gibeon: 'camacite · taenite', hoba: 'Ni 16%', bar: 'Fe' },
      says: {
        pick: {
          gibeon: {
            kid: 'Gibeon, um meteorito do sul da Namíbia. O povo nama fazia ferramentas e pontas de lança com o seu ferro.',
            sci: 'Gibeon: grupo IVA, um octaedrito fino com cerca de 7,7% de Ni, espalhado pelo Grande Namaqualand. Os nama trabalhavam-no em ferramentas e armas.',
          },
          hoba: { kid: 'Um pedaço do Hoba, o gigante lá fora.', sci: 'Hoba: um ataxito IVB, cerca de 16% de Ni.' },
          bar: { kid: 'Uma barra de ferro feita pelas pessoas, num forno, a partir de rocha.', sci: 'Ferro obtido do minério: quase nenhum níquel.' },
        },
        saw: { kid: 'A serra corta a ponta. A face nova é cinzenta e cheia de riscos.', sci: 'Serrada: uma face fresca, baça e riscada pela lâmina.' },
        polish: {
          kid: 'O disco gira com pó cada vez mais fino até a face brilhar como um espelho. Ainda não há padrão!',
          sci: 'Desbastada e polida com abrasivos cada vez mais finos: um espelho, e ainda não se vê estrutura nenhuma.',
        },
        acid: {
          gibeon: {
            kid: 'Olha! Aparece um padrão cruzado, como palha entrançada. O ácido come mais depressa as placas de ferro com pouco níquel do que as suas bordas finas, ricas em níquel, e os cristais aparecem.',
            sci: 'O padrão de Widmanstätten: placas de camacite (cerca de 5 a 7% de Ni) nos planos octaédricos do antigo cristal de taenite, orladas de taenite rica em níquel, que resiste ao ácido. No Gibeon cada placa tem algumas décimas de milímetro de largura (aqui desenhadas maiores).',
          },
          hoba: {
            kid: 'Nada! O Hoba fica liso. Tem tanto níquel que os seus cristais são pequenos demais para se verem.',
            sci: 'Sem padrão: com cerca de 16% de Ni, o metal tornou-se uma mistura microscópica de camacite e taenite (plessite), fina demais para o olho.',
          },
          bar: {
            kid: 'Aqui também nada. O ferro feito a partir de rocha quase não tem níquel, por isso nunca forma estes cristais.',
            sci: 'Sem padrão: quase nenhum níquel, e arrefeceu em horas, não ao longo de milhões de anos.',
          },
        },
        lens: {
          gibeon: {
            kid: 'Átomos! Nas placas largas há só alguns átomos de níquel (verdes) no meio do ferro. Nas bordas finas e brilhantes há muitos.',
            sci: 'Camacite: ferro cúbico de corpo centrado com cerca de 6% de Ni. Taenite: cúbica de faces centradas, 25 a 50% de Ni junto às bordas. O níquel passou de uma para a outra, átomo a átomo, ao longo de milhões de anos.',
          },
          hoba: { kid: 'Átomos de ferro com níquel espalhado por todo o lado: cerca de um átomo em cada seis.', sci: 'Cerca de 16% de Ni, distribuído por uma mistura microscópica de camacite e taenite.' },
          bar: { kid: 'Só átomos de ferro, quase nenhum níquel.', sci: 'Ferro quase puro (as barras verdadeiras têm também um pouco de carbono e de escória).' },
        },
        needCut: { kid: 'Primeiro corta-a com a serra.', sci: 'Primeiro serra-a.' },
        needPolish: { kid: 'Primeiro pole-a: o ácido precisa de uma face lisa.', sci: 'Primeiro pole-a: atacar uma face serrada só mostra riscos.' },
        needEtch: { kid: 'Primeiro corta-a, pole-a e ataca-a com ácido; depois olha de perto.', sci: 'Primeiro prepara a face: serrar, polir, atacar.' },
        done: { kid: 'Esta já está pronta. Toca noutra peça.', sci: 'Esta está feita: escolhe outra peça.' },
        fresh: { kid: 'Peças novas, todas em bruto outra vez!', sci: 'Amostras novas.' },
      },
      panel: {
        kid: [
          'O ferro dos meteoritos esconde um segredo lá dentro. Toca numa peça, corta-a com a serra, pole-a até ficar um espelho e depois deita-lhe umas gotas de ácido. Experimenta as três: o Gibeon, um meteorito do sul da Namíbia, um pedaço do Hoba e uma barra de ferro feita pelas pessoas.',
          'Só uma delas mostra os cristais cruzados. Cresceram enquanto o ferro arrefecia muito devagar, ao longo de milhões de anos, dentro de um pequeno planeta. Nenhum forno da Terra consegue arrefecer tão devagar, por isso um padrão assim é sinal de que o ferro veio do espaço.',
        ],
        sci: [
          'William Thomson viu o padrão em 1804, em Nápoles, depois de tratar um meteorito com ácido nítrico; o conde Alois von Beckh Widmanstätten observou-o em 1808, e é o nome dele que o padrão tem. O reagente habitual hoje é o nital, alguns por cento de ácido nítrico em álcool.',
          'A taenite (cúbica de faces centradas, rica em níquel) é estável a quente. À medida que o núcleo arrefecia, a camacite (cúbica de corpo centrado, pobre em níquel) cresceu a partir dela em placas ao longo dos seus planos octaédricos, sobretudo entre cerca de 700 e 450 °C, enquanto o níquel passava da camacite em crescimento para a taenite que encolhia. A largura das placas depende da velocidade de arrefecimento e do teor de níquel. Os ataxitos como o Hoba, mais ricos em níquel, nunca formam placas grossas; o ferro obtido do minério, quase sem níquel e arrefecido em horas, não forma nenhumas.',
        ],
      },
    },
    asteroid: {
      label: 'Um pequeno planeta',
      title: 'De onde vêm os meteoritos de ferro',
      hints: {
        heat: 'Toca no pequeno planeta para o aquecer',
        sinking: 'Vê o ferro a afundar-se para o meio',
        slower: 'Toca na lupa para o núcleo arrefecer mais devagar',
        faster: 'Toca na lupa para o núcleo arrefecer mais depressa',
        smash: 'Toca no pequeno planeta para o despedaçar',
        flying: 'Vê os pedaços a voar',
        again: 'Toca nos pedaços para um novo pequeno planeta',
      },
      buttons: { heat: 'Aquecer', smash: 'Despedaçar', again: 'Um novo pequeno planeta', slow: 'Arrefecer devagar', fast: 'Arrefecer depressa' },
      slider: 'Velocidade de arrefecimento do núcleo',
      rate: { kid: '{r} °C em cada milhão de anos', sci: '{r} °C por milhão de anos: de 700 a 450 °C em {t} milhões de anos' },
      lensLabel: { none: 'Ainda sem núcleo de ferro', slow: 'Arrefecimento lento: placas largas', mid: 'Mais devagar, mais largas', fast: 'Arrefecimento rápido: placas finas', sci: '{r} °C por milhão de anos' },
      says: {
        heat: {
          kid: 'O pequeno planeta aquece por dentro! Quando o Sistema Solar era jovem, alguns dos seus átomos eram radioativos e davam calor suficiente para o derreter.',
          sci: 'Aquecimento pelo alumínio-26 (meia-vida de cerca de 0,7 milhões de anos): os planetesimais formados no primeiro milhão ou dois de anos fundiram por dentro.',
        },
        core: {
          kid: 'O ferro é mais pesado do que a rocha, por isso o ferro derretido afunda-se para o meio e faz um coração de ferro, o núcleo. A rocha fica à volta.',
          sci: 'Diferenciação: o ferro-níquel fundido, com algum enxofre, tem mais do dobro da densidade do magma silicatado e afunda-se num núcleo; os silicatos formam o manto.',
        },
        cooled: {
          kid: 'Agora o núcleo arrefece, muito devagar, durante milhões de anos. Olha para a lupa: crescem cristais no ferro.',
          sci: 'O núcleo arrefece; entre cerca de 700 e 450 °C crescem placas de camacite a partir da taenite. A lupa acompanha-as.',
        },
        slower: { kid: 'Arrefecimento mais lento: as placas têm mais tempo e crescem mais largas.', sci: 'Arrefecimento mais lento, mais tempo para o níquel se difundir: placas de camacite mais largas.' },
        faster: { kid: 'Arrefecimento mais rápido: placas finas.', sci: 'Arrefecimento mais rápido: placas mais estreitas.' },
        smash: {
          kid: 'Pumba! Outra rocha despedaça o pequeno planeta. Os pedaços do coração de ferro tornam-se meteoritos de ferro; os pedaços de rocha da parte de fora tornam-se meteoritos rochosos.',
          sci: 'Uma colisão destrutiva: os fragmentos do núcleo tornam-se meteoritos de ferro, os do manto meteoritos rochosos (acondritos).',
        },
        earth: {
          kid: 'E um pedaço, depois de andar à volta do Sol durante imenso tempo, cai na Terra!',
          sci: 'Os fragmentos vagueiam muito tempo antes de chegarem à Terra: as idades de exposição aos raios cósmicos dos meteoritos de ferro são, na maioria, de centenas de milhões de anos.',
        },
        again: { kid: 'Um novo pequeno planeta, todo misturado outra vez: rocha com grãos de metal. Aquece-o e vê!', sci: 'Recomeço: um planetesimal não diferenciado, rocha com grãos de metal.' },
        first: { kid: 'Ainda não há núcleo de ferro: primeiro aquece o pequeno planeta.', sci: 'Ainda sem núcleo: primeiro funde o planetesimal.' },
      },
      panel: {
        kid: [
          'Os meteoritos de ferro são pedaços dos corações de ferro de pequenos planetas. Quando o Sistema Solar era jovem, pequenos planetas ficaram tão quentes por dentro que derreteram. O ferro afundou-se para o meio e fez um núcleo, como o da Terra.',
          'O núcleo arrefeceu muito, muito devagar, ao longo de milhões de anos, e cresceram nele grandes cristais: quanto mais devagar arrefecia, mais largos ficavam. Depois o pequeno planeta foi despedaçado numa colisão, e os pedaços andam à volta do Sol desde então. De vez em quando, um cai na Terra.',
        ],
        sci: [
          'Os meteoritos de ferro vêm dos núcleos metálicos de planetesimais que se formaram no primeiro milhão ou dois de anos do Sistema Solar e fundiram, aquecidos sobretudo pelo alumínio-26. O metal separou-se dos silicatos e afundou-se; depois os núcleos arrefeceram e cristalizaram. Os meteoritos de ferro vêm de dezenas de corpos-mãe diferentes.',
          'As velocidades de arrefecimento, lidas nos perfis de níquel através das placas de taenite, vão de dezenas a milhares de °C por milhão de anos; só os ferros IVA, o grupo do Gibeon, vão de cerca de 100 a 6600 (Yang e colegas, 2008). A lupa mostra apenas a tendência. As colisões desfizeram os corpos-mãe; os fragmentos chegam à Terra depois de centenas de milhões de anos no espaço.',
        ],
      },
    },
  },

  pl: {
    title: 'Farma Hoba o zmierzchu',
    greet: {
      kid: 'Jesteśmy w środku obrazka: na farmie w Namibii, gdzie leży największy meteoryt na Ziemi! Jest z żelaza, tak jak ja, i przyleciał z kosmosu. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Farma Hoba West koło Grootfontein w Namibii o zmierzchu: największy znany meteoryt, blok żelaza z niklem o masie około 60 t, wciąż leżący tam, gdzie spadł. Zmierz go, wytraw żelazo meteorytowe i prześledź jego drogę aż do jądra rozbitej małej planety. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Pewien rolnik znalazł meteoryt Hoba w 1920 roku. Orał pole, kiedy jego pług uderzył w coś twardego i stanął. To był meteoryt!',
        'Meteorytu Hoba nigdy nie przeniesiono: jest o wiele za ciężki. Ludzie z całego świata przyjeżdżają, żeby posiedzieć na kamiennych stopniach wokół niego, a niektórzy nawet na niego wchodzą.',
        'Patrz czasem w górę: spadająca gwiazda to drobinka kosmicznego pyłu, często nie większa od ziarnka piasku, spalająca się wysoko w powietrzu.',
      ],
      sci: [
        'Jacobus Hermanus Brits znalazł meteoryt Hoba w 1920 roku podczas orki. W 1955 roku uznano go za pomnik narodowy; od 1987 roku otaczają go centrum dla zwiedzających i kamienne tarasy, a wandalizm ustał.',
        'Powierzchnia meteorytu Hoba to skorupa wodorotlenków żelaza, zwietrzała przez tysiące lat, które tu przeleżał (prawdopodobnie spadł mniej niż 80 tysięcy lat temu). Erozja, pobieranie próbek i wandalizm sprawiły, że jest lżejszy niż w chwili znalezienia.',
        'Meteory świecą na wysokości około 70 do 120 km, gdy ziarna pyłu spalają się w powietrzu. Większość meteorytów, które docierają do ziemi, to meteoryty kamienne; żelazne stanowią niewielką część, ale długo przetrwają i łatwo je rozpoznać.',
      ],
    },
    hoba: {
      label: 'Hoba, największy meteoryt',
      title: 'Hoba: 60 ton żelaza z kosmosu',
      hints: {
        meter: 'Stuknij w miernik rentgenowski, żeby zmierzyć meteoryt',
        reading: 'Miernik bada metal',
        magnet: 'Stuknij w magnes wiszący na trójnogu',
        scale: 'Stuknij w wielką wagę, żeby zważyć meteoryt w słoniach',
        more: 'Stuknij w wagę, żeby dodać słonia',
        off: 'Stuknij w magnes, żeby go oderwać',
        done: 'Stuknij jeszcze raz w miernik, magnes albo wagę',
      },
      buttons: { meter: 'Zmierz promieniami X', magnet: 'Wypróbuj magnes', off: 'Oderwij magnes', add: 'Dodaj słonia', empty: 'Opróżnij wagę' },
      slider: 'Słonie na wadze',
      scale: { hoba: 'Hoba: około 60 t', count: '{n} × 6 t = {t} t', models: 'Modele w skali 1:19' },
      legend: 'Fe 83%   Ni 16%   Co 0,8%',
      says: {
        meter: {
          kid: 'Piip! Miernik świeci promieniami rentgenowskimi w meteoryt, a każdy rodzaj atomów odpowiada własnym rentgenowskim blaskiem. Około 83% żelaza, 16% niklu i szczypta kobaltu. Żelazo z tak dużą ilością niklu to znak meteorytu.',
          sci: 'Fluorescencja rentgenowska: promienie X wybijają elektrony z wewnętrznych powłok, a każdy pierwiastek odpowiada własnymi liniami (Fe Kα 6,40 keV, Co Kα 6,93 keV, Ni Kα 7,48 keV). Hoba: około 16,4% Ni i 0,8% Co, reszta to żelazo. Metaliczne żelazo z tak dużą ilością niklu to podpis meteorytu.',
        },
        magnet: {
          kid: 'Klonk! Magnes skacze do meteorytu i mocno się trzyma. Pod rdzawą skórką Hoba to lity metal, a metaliczne żelazo mocno przyciąga magnesy.',
          sci: 'Stop żelaza z niklem jest ferromagnetyczny. Zwietrzała skorupa jest tylko słabo magnetyczna, ale metal pod nią trzyma magnes: to pierwszy test każdego poszukiwacza meteorytów.',
        },
        off: { kid: 'Oderwany! Teraz huśta się tam i z powrotem na sznurku.', sci: 'Puszczony: znów wahadło, powoli tłumione przez powietrze.' },
        one: { kid: 'Jeden słoń: 6 ton. Meteoryt nawet nie drgnie!', sci: 'Jeden samiec słonia afrykańskiego, około 6 t: jedna dziesiąta meteorytu Hoba.' },
        balanced: {
          kid: 'Dziesięć słoni i waga jest w równowadze! Meteoryt Hoba zajmuje niewiele więcej miejsca niż jeden słoń, ale waży tyle co dziesięć. Żelazo jest naprawdę ciężkie.',
          sci: 'Równowaga przy 10 × 6 t = 60 t. Stop żelaza z niklem ma gęstość około 7,9 g/cm³, prawie osiem razy większą niż słoń, więc blok wielkości jednego czy dwóch słoni waży tyle co dziesięć. Oba modele są w skali 1:19.',
        },
        heavier: { kid: 'Teraz słonie są cięższe i ich szalka opada.', sci: 'Ponad 60 t: słonie ważą więcej niż meteoryt Hoba.' },
        empty: { kid: 'Zeszły! Waga znów jest pusta.', sci: 'Szalka opróżniona.' },
      },
      panel: {
        kid: [
          'Hoba to największy meteoryt, jaki kiedykolwiek znaleziono: płaski blok żelaza i niklu o boku około 2,7 metra, wielkości podłogi małego pokoju, ważący około 60 ton. Znalazł go rolnik, Jacobus Hermanus Brits, w 1920 roku, kiedy jego pług w niego uderzył. Nikt go nigdy nie przeniósł: leży tam, gdzie spadł.',
          'Co dziwne, wokół niego nie ma krateru. Naukowcy sądzą, że powietrze mocno go wyhamowało, może dlatego, że jest taki płaski, więc jak na meteoryt wylądował dość łagodnie. Stuknij w miernik rentgenowski, żeby sprawdzić, z czego jest zrobiony, w magnes, żeby go przetestować, i w wielką wagę, żeby zważyć go w słoniach.',
        ],
        sci: [
          'Hoba, znaleziony w 1920 roku przez Jacobusa Hermanusa Britsa na farmie Hoba West koło Grootfontein, to największy znany meteoryt: około 2,7 × 2,7 × 0,9 m i dziś około 60 t, więcej w chwili znalezienia, bo erozja, pobieranie próbek i wandalizm zrobiły swoje. To ataksyt z grupy IVB, z około 16,4% Ni i 0,8% Co. Od 1955 roku jest pomnikiem narodowym.',
          'Nie znaleziono żadnego krateru. Zwykłe wyjaśnienie: atmosfera wyhamowała go do niewielkiej prędkości, może z pomocą jego płaskiego kształtu, więc spadł, nie wybijając krateru. Dla porównania na wadze: samiec słonia afrykańskiego waży około 6 t.',
        ],
      },
    },
    dagger: {
      label: 'Sztylet Tutanchamona',
      title: 'Sztylet faraona z niebiańskiego żelaza',
      cards: { dagger: 'Sztylet Tutanchamona (kopia)', knife: 'Żelazo z rudy' },
      hints: {
        dagger: 'Stuknij w żelazne ostrze sztyletu, żeby je zmierzyć',
        knife: 'Teraz stuknij w zwykły żelazny nóż',
        again: 'Stuknij w któreś ostrze, żeby zmierzyć je jeszcze raz',
        reading: 'Miernik bada ostrze',
      },
      buttons: { dagger: 'Zmierz sztylet', knife: 'Zmierz żelazny nóż' },
      legend: { dagger: 'Ni 10,8%   Co 0,58%', knife: 'Ni < 1%' },
      says: {
        dagger: {
          kid: 'Ostrze ma prawie 11% niklu i trochę kobaltu, zupełnie jak meteoryty żelazne. Sztylet Tutanchamona zrobiono z żelaza, które spadło z nieba!',
          sci: '10,8% Ni i 0,58% Co, tak jak zmierzyli Comelli i współpracownicy na prawdziwym ostrzu przenośnym spektrometrem fluorescencji rentgenowskiej w 2016 roku: skład meteorytu żelaznego, a nie żelaza wytopionego z rudy.',
        },
        knife: {
          kid: 'Prawie nie ma niklu! Żelazo, które ludzie wytapiają ze skał, ma go bardzo mało. Więc nikiel odróżnia żelazo z nieba od żelaza z Ziemi.',
          sci: 'Żelazo wytopione z rudy: nikiel wyraźnie poniżej 1%. Rudy żelaza zawierają mało niklu, więc takie żelazo rzadko ma go więcej niż kilka procent; żelazo meteorytowe ma około 5% lub więcej.',
        },
      },
      panel: {
        kid: [
          'Tutanchamon był młodym faraonem Egiptu, który zmarł około 3300 lat temu. Kiedy w 1925 roku zespół Howarda Cartera odwinął jego bandaże, znalazł przy nim dwa sztylety: jeden z ostrzem ze złota, a drugi z ostrzem z żelaza, w czasach, gdy ludzie dopiero zaczynali wytwarzać żelazo. W tej gablocie leży kopia tego żelaznego.',
          'W 2016 roku naukowcy zmierzyli prawdziwe ostrze takim miernikiem rentgenowskim jak ten, nawet go nie dotykając, i nikiel pokazał, że żelazo pochodzi z meteorytu. Rękojeść jest złota, ozdobiona drobniutkimi złotymi ziarenkami i kolorowymi pasami, a na górze ma gałkę z kryształu górskiego.',
        ],
        sci: [
          'Żelazny sztylet znalazł zespół Howarda Cartera w 1925 roku w bandażach mumii Tutanchamona (zmarł około 1323 roku p.n.e.), obok sztyletu ze złotym ostrzem. Rękojeść jest złota, zdobiona granulacją i inkrustacją, z głowicą z kryształu górskiego. W 2016 roku Comelli i współpracownicy zmierzyli ostrze bez uszkadzania go, przenośnym spektrometrem fluorescencji rentgenowskiej: Fe z 10,8% Ni i 0,58% Co, skład meteorytowy.',
          'W 2022 roku Matsui i współpracownicy zmapowali ostrze i opisali ślady figur Widmanstättena, co sugeruje kucie w dość niskiej temperaturze, poniżej około 950 °C; zasugerowali też, że sztylet mógł być darem z królestwa Mitanni. Inni się z tym nie zgadzają: miejsce jego wykonania wciąż pozostaje otwartą kwestią.',
        ],
      },
    },
    etch: {
      label: 'Stół do trawienia',
      title: 'Przetnij, wypoleruj, wytraw: ukryte kryształy',
      sign: 'Stół do trawienia',
      pieces: { gibeon: 'Gibeon', hoba: 'Hoba', bar: 'Żelazo z rudy' },
      hints: {
        saw: 'Stuknij w piłę, żeby przeciąć ten kawałek',
        polish: 'Stuknij w tarczę polerską, żeby go wypolerować',
        acid: 'Stuknij w zakraplacz z kwasem, żeby go wytrawić',
        lens: 'Stuknij w lupę, żeby zobaczyć atomy',
        next: 'Stuknij w inny kawałek, żeby się nim zająć',
        fresh: 'Stuknij w skrzynkę po nowe kawałki',
        working: 'Patrz na stół',
      },
      buttons: { next: 'Następny kawałek', saw: 'Piła', polish: 'Polerowanie', acid: 'Kwas', lens: 'Lupa', fresh: 'Nowe kawałki' },
      legend: { gibeon: 'kamacyt · taenit', hoba: 'Ni 16%', bar: 'Fe' },
      says: {
        pick: {
          gibeon: {
            kid: 'Gibeon, meteoryt z południa Namibii. Lud Nama robił z jego żelaza narzędzia i groty włóczni.',
            sci: 'Gibeon: grupa IVA, oktaedryt drobnopłytkowy z około 7,7% Ni, rozrzucony po Wielkim Namalandzie. Namowie wykuwali z niego narzędzia i broń.',
          },
          hoba: { kid: 'Kawałek meteorytu Hoba, tego olbrzyma na zewnątrz.', sci: 'Hoba: ataksyt IVB, około 16% Ni.' },
          bar: { kid: 'Sztabka żelaza zrobiona przez ludzi, w piecu, ze skały.', sci: 'Żelazo wytopione z rudy: prawie bez niklu.' },
        },
        saw: { kid: 'Piła odcina koniec. Nowa powierzchnia jest szara i pełna rys.', sci: 'Przecięte: świeża powierzchnia, matowa i porysowana przez ostrze.' },
        polish: {
          kid: 'Tarcza kręci się z coraz drobniejszym proszkiem, aż powierzchnia lśni jak lustro. Jeszcze nie widać wzoru!',
          sci: 'Szlifowane i polerowane coraz drobniejszymi ścierniwami: lustro, a struktury jeszcze nie widać.',
        },
        acid: {
          gibeon: {
            kid: 'Patrz! Pojawia się wzór z krzyżujących się pasków, jak pleciona słoma. Kwas szybciej zjada żelazne płytki z małą ilością niklu niż ich cienkie, bogate w nikiel brzegi, więc kryształy stają się widoczne.',
            sci: 'Figury Widmanstättena: płytki kamacytu (około 5 do 7% Ni) na płaszczyznach oktaedru dawnego kryształu taenitu, obrzeżone bogatym w nikiel taenitem, który opiera się kwasowi. W meteorycie Gibeon każda płytka ma kilka dziesiątych milimetra szerokości (tu narysowane większe).',
          },
          hoba: {
            kid: 'Nic! Hoba zostaje gładki. Ma tyle niklu, że jego kryształy są o wiele za małe, żeby je zobaczyć.',
            sci: 'Brak wzoru: przy około 16% Ni metal stał się mikroskopijnym przerostem kamacytu i taenitu (plesytem), o wiele za drobnym dla oka.',
          },
          bar: {
            kid: 'Tu też nic. Żelazo zrobione ze skały prawie nie ma niklu, więc nigdy nie wyrastają w nim takie kryształy.',
            sci: 'Brak wzoru: prawie bez niklu i ostygło w ciągu godzin, a nie milionów lat.',
          },
        },
        lens: {
          gibeon: {
            kid: 'Atomy! W szerokich płytkach jest tylko kilka atomów niklu (zielonych) wśród żelaza. W cienkich, jasnych brzegach jest ich mnóstwo.',
            sci: 'Kamacyt: żelazo o sieci regularnej przestrzennie centrowanej z około 6% Ni. Taenit: sieć regularna ściennie centrowana, 25 do 50% Ni przy brzegach. Nikiel przechodził między nimi, atom po atomie, przez miliony lat.',
          },
          hoba: { kid: 'Atomy żelaza z niklem rozsypanym wszędzie: mniej więcej jeden atom na sześć.', sci: 'Około 16% Ni, rozłożone w mikroskopijnej mieszaninie kamacytu i taenitu.' },
          bar: { kid: 'Same atomy żelaza, prawie bez niklu.', sci: 'Prawie czyste żelazo (prawdziwe sztabki zawierają też trochę węgla i żużla).' },
        },
        needCut: { kid: 'Najpierw przetnij go piłą.', sci: 'Najpierw go przetnij.' },
        needPolish: { kid: 'Najpierw go wypoleruj: kwas potrzebuje gładkiej powierzchni.', sci: 'Najpierw wypoleruj: trawienie przeciętej powierzchni pokazuje tylko rysy.' },
        needEtch: { kid: 'Najpierw go przetnij, wypoleruj i wytraw, a potem przyjrzyj się z bliska.', sci: 'Najpierw przygotuj powierzchnię: cięcie, polerowanie, trawienie.' },
        done: { kid: 'Ten jest gotowy. Stuknij w inny kawałek.', sci: 'Ten gotowy: wybierz inny kawałek.' },
        fresh: { kid: 'Nowe kawałki, znowu całkiem surowe!', sci: 'Świeże próbki.' },
      },
      panel: {
        kid: [
          'Żelazo z meteorytów skrywa w środku tajemnicę. Stuknij w kawałek, przetnij go piłą, wypoleruj na lustro, a potem nałóż kilka kropli kwasu. Wypróbuj wszystkie trzy: Gibeon, meteoryt z południa Namibii, kawałek meteorytu Hoba i sztabkę żelaza zrobioną przez ludzi.',
          'Tylko jeden z nich pokazuje krzyżujące się kryształy. Wyrosły, gdy żelazo stygło bardzo powoli, przez miliony lat, we wnętrzu małej planety. Żaden piec na Ziemi nie może stygnąć tak wolno, więc taki wzór to znak, że żelazo przybyło z kosmosu.',
        ],
        sci: [
          'William Thomson zobaczył ten wzór w 1804 roku w Neapolu, po potraktowaniu meteorytu kwasem azotowym; hrabia Alois von Beckh Widmanstätten zaobserwował go w 1808 roku i to jego nazwisko wzór nosi. Zwykle trawi się dziś nitalem, roztworem kilku procent kwasu azotowego w alkoholu.',
          'Taenit (sieć regularna ściennie centrowana, bogaty w nikiel) jest trwały na gorąco. Gdy jądro stygło, kamacyt (sieć regularna przestrzennie centrowana, ubogi w nikiel) wyrastał z niego w płytkach wzdłuż płaszczyzn oktaedru, głównie między około 700 a 450 °C, a nikiel przechodził z rosnącego kamacytu do kurczącego się taenitu. Szerokość płytek zależy od tempa stygnięcia i zawartości niklu. Ataksyty takie jak Hoba, bogatsze w nikiel, nigdy nie tworzą grubych płytek; żelazo wytopione z rudy, prawie bez niklu i ostudzone w ciągu godzin, nie tworzy ich wcale.',
        ],
      },
    },
    asteroid: {
      label: 'Mała planeta',
      title: 'Skąd się biorą meteoryty żelazne',
      hints: {
        heat: 'Stuknij w małą planetę, żeby ją podgrzać',
        sinking: 'Patrz, jak żelazo opada do środka',
        slower: 'Stuknij w lupę, żeby jądro stygło wolniej',
        faster: 'Stuknij w lupę, żeby jądro stygło szybciej',
        smash: 'Stuknij w małą planetę, żeby ją rozbić',
        flying: 'Patrz, jak lecą odłamki',
        again: 'Stuknij w odłamki po nową małą planetę',
      },
      buttons: { heat: 'Podgrzej', smash: 'Rozbij', again: 'Nowa mała planeta', slow: 'Studź powoli', fast: 'Studź szybko' },
      slider: 'Jak szybko stygnie jądro',
      rate: { kid: '{r} °C na każdy milion lat', sci: '{r} °C na milion lat: od 700 do 450 °C w {t} mln lat' },
      lensLabel: { none: 'Jeszcze nie ma żelaznego jądra', slow: 'Powolne stygnięcie: szerokie płytki', mid: 'Im wolniej, tym szersze', fast: 'Szybkie stygnięcie: cienkie płytki', sci: '{r} °C na milion lat' },
      says: {
        heat: {
          kid: 'Mała planeta nagrzewa się od środka! Kiedy Układ Słoneczny był młody, niektóre jej atomy były promieniotwórcze i wydzielały dość ciepła, żeby ją stopić.',
          sci: 'Ogrzewanie przez glin-26 (okres połowicznego rozpadu około 0,7 mln lat): planetozymale, które powstały w ciągu pierwszego miliona czy dwóch lat, topiły się od środka.',
        },
        core: {
          kid: 'Żelazo jest cięższe od skały, więc stopione żelazo opada do środka i tworzy żelazne serce, jądro. Skała zostaje wokół niego.',
          sci: 'Dyferencjacja: stopiony stop żelaza z niklem, z domieszką siarki, ma ponad dwa razy większą gęstość niż stop krzemianowy i opada, tworząc jądro; krzemiany tworzą płaszcz.',
        },
        cooled: {
          kid: 'Teraz jądro stygnie, bardzo powoli, przez miliony lat. Zajrzyj do lupy: w żelazie rosną kryształy.',
          sci: 'Jądro stygnie; między około 700 a 450 °C z taenitu wyrastają płytki kamacytu. Lupa je śledzi.',
        },
        slower: { kid: 'Wolniejsze stygnięcie: płytki mają więcej czasu i rosną szersze.', sci: 'Wolniejsze stygnięcie, więcej czasu na dyfuzję niklu: szersze płytki kamacytu.' },
        faster: { kid: 'Szybsze stygnięcie: cienkie płytki.', sci: 'Szybsze stygnięcie: węższe płytki.' },
        smash: {
          kid: 'Bum! Inna skała rozbija małą planetę. Kawałki jej żelaznego serca stają się meteorytami żelaznymi, a kawałki skalnej powłoki meteorytami kamiennymi.',
          sci: 'Niszczące zderzenie: odłamki jądra stają się meteorytami żelaznymi, odłamki płaszcza kamiennymi (achondrytami).',
        },
        earth: {
          kid: 'A jeden kawałek, po bardzo, bardzo długiej podróży wokół Słońca, spada na Ziemię!',
          sci: 'Odłamki długo krążą, zanim dotrą do Ziemi: wiek ekspozycji na promieniowanie kosmiczne meteorytów żelaznych to zwykle setki milionów lat.',
        },
        again: { kid: 'Nowa mała planeta, znów cała wymieszana: skała z ziarnami metalu. Podgrzej ją i patrz!', sci: 'Od nowa: niezróżnicowana planetozymala, skała z ziarnami metalu.' },
        first: { kid: 'Jeszcze nie ma żelaznego jądra: najpierw podgrzej małą planetę.', sci: 'Brak jądra: najpierw stop planetozymalę.' },
      },
      panel: {
        kid: [
          'Meteoryty żelazne to kawałki żelaznych serc małych planet. Kiedy Układ Słoneczny był młody, małe planety tak się nagrzały od środka, że się stopiły. Ich żelazo opadło do środka i utworzyło jądro, takie jak ziemskie.',
          'Jądro stygło bardzo, bardzo powoli, przez miliony lat, i wyrosły w nim duże kryształy: im wolniej stygło, tym szersze się stawały. Potem mała planeta rozbiła się w zderzeniu, a jej kawałki krążą wokół Słońca do dziś. Od czasu do czasu któryś spada na Ziemię.',
        ],
        sci: [
          'Meteoryty żelazne pochodzą z metalicznych jąder planetozymali, które powstały w ciągu pierwszego miliona czy dwóch lat Układu Słonecznego i stopiły się, ogrzewane głównie przez glin-26. Metal oddzielił się od krzemianów i opadł; potem jądra stygły i krystalizowały. Meteoryty żelazne pochodzą z kilkudziesięciu różnych ciał macierzystych.',
          'Tempo stygnięcia, odczytywane z profili niklu w poprzek płytek taenitu, wynosi od kilkudziesięciu do kilku tysięcy °C na milion lat; same meteoryty grupy IVA, do której należy Gibeon, obejmują zakres od około 100 do 6600 (Yang i współpracownicy, 2008). Lupa pokazuje tylko tendencję. Zderzenia rozbiły ciała macierzyste; odłamki docierają do Ziemi po setkach milionów lat w kosmosie.',
        ],
      },
    },
  },

  de: {
    title: 'Die Farm Hoba in der Abenddämmerung',
    greet: {
      kid: 'Wir sind im Bild: auf einer Farm in Namibia, wo der größte Meteorit der Erde liegt! Er ist aus Eisen, wie ich, und kam aus dem Weltall. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Die Farm Hoba West bei Grootfontein in Namibia in der Abenddämmerung: Der größte bekannte Meteorit, ein Block aus Eisen und Nickel von etwa 60 t, liegt noch dort, wo er fiel. Miss ihn, ätze Meteoriteneisen und verfolge es zurück bis zum Kern eines zertrümmerten kleinen Planeten. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Ein Farmer fand Hoba im Jahr 1920. Er pflügte sein Feld, als sein Pflug gegen etwas Hartes stieß und stehen blieb. Es war ein Meteorit!',
        'Hoba wurde nie bewegt: Er ist viel zu schwer. Menschen aus aller Welt kommen, um auf den Steinstufen rund um ihn zu sitzen, und manche klettern sogar hinauf.',
        'Schau ab und zu nach oben: Eine Sternschnuppe ist ein Stäubchen aus dem All, oft nicht größer als ein Sandkorn, das hoch oben in der Luft verglüht.',
      ],
      sci: [
        'Jacobus Hermanus Brits fand Hoba 1920 beim Pflügen. 1955 wurde er zum Nationaldenkmal erklärt; seit 1987 umgeben ihn ein Besucherzentrum und Steinterrassen, und der Vandalismus hat aufgehört.',
        'Hobas Oberfläche ist eine Kruste aus Eisenhydroxiden, verwittert in den Jahrtausenden, die er hier liegt (er fiel wahrscheinlich vor weniger als 80.000 Jahren). Erosion, Probenahmen und Vandalismus haben ihn leichter gemacht, als er bei seiner Entdeckung war.',
        'Meteore leuchten in etwa 70 bis 120 km Höhe, wenn Staubkörner in der Luft verglühen. Die meisten Meteoriten, die den Boden erreichen, sind Steinmeteoriten; Eisenmeteoriten sind ein kleiner Teil, aber sie halten lange und sind leicht zu erkennen.',
      ],
    },
    hoba: {
      label: 'Hoba, der größte Meteorit',
      title: 'Hoba: 60 Tonnen Eisen aus dem All',
      hints: {
        meter: 'Tipp das Röntgenmessgerät an, um Hoba zu messen',
        reading: 'Das Gerät liest das Metall',
        magnet: 'Tipp den Magneten am Dreibein an',
        scale: 'Tipp die große Waage an, um Hoba in Elefanten zu wiegen',
        more: 'Tipp die Waage an für noch einen Elefanten',
        off: 'Tipp den Magneten an, um ihn abzuziehen',
        done: 'Tipp das Messgerät, den Magneten oder die Waage noch einmal an',
      },
      buttons: { meter: 'Mit Röntgenstrahlen messen', magnet: 'Magnet ausprobieren', off: 'Magnet abziehen', add: 'Einen Elefanten dazu', empty: 'Waage leeren' },
      slider: 'Elefanten auf der Waage',
      scale: { hoba: 'Hoba: etwa 60 t', count: '{n} × 6 t = {t} t', models: 'Modelle im Maßstab 1:19' },
      legend: 'Fe 83%   Ni 16%   Co 0,8%',
      says: {
        meter: {
          kid: 'Piep! Das Gerät schickt Röntgenstrahlen in Hoba, und jede Atomsorte antwortet mit ihrem eigenen Röntgenleuchten. Etwa 83% Eisen, 16% Nickel und eine Prise Cobalt. Eisen mit so viel Nickel ist das Zeichen eines Meteoriten.',
          sci: 'Röntgenfluoreszenz: Die Röntgenstrahlen schlagen innere Elektronen heraus, und jedes Element antwortet mit seinen eigenen Linien (Fe Kα 6,40 keV, Co Kα 6,93 keV, Ni Kα 7,48 keV). Hoba: etwa 16,4% Ni und 0,8% Co, der Rest Eisen. Metallisches Eisen mit so viel Nickel ist die Handschrift eines Meteoriten.',
        },
        magnet: {
          kid: 'Klonk! Der Magnet schwingt zu Hoba und bleibt fest kleben. Unter seiner rostigen Haut ist Hoba massives Metall, und metallisches Eisen zieht Magnete kräftig an.',
          sci: 'Eisen-Nickel-Metall ist ferromagnetisch. Die verwitterte Kruste ist nur schwach magnetisch, aber das Metall darunter hält den Magneten: der erste Test jedes Meteoritensuchers.',
        },
        off: { kid: 'Abgezogen! Jetzt schwingt er an seiner Schnur hin und her.', sci: 'Losgelassen: wieder ein Pendel, langsam von der Luft gedämpft.' },
        one: { kid: 'Ein Elefant: 6 Tonnen. Hoba rührt sich nicht einmal!', sci: 'Ein Afrikanischer Elefantenbulle, etwa 6 t: ein Zehntel von Hoba.' },
        balanced: {
          kid: 'Zehn Elefanten, und die Waage ist im Gleichgewicht! Hoba braucht kaum mehr Platz als ein Elefant, wiegt aber so viel wie zehn. So schwer ist Eisen.',
          sci: 'Gleichgewicht bei 10 × 6 t = 60 t. Eisen-Nickel-Metall hat etwa 7,9 g/cm³, fast die achtfache Dichte eines Elefanten, deshalb wiegt ein Block von der Größe von ein oder zwei Elefanten so viel wie zehn. Beide Modelle sind im Maßstab 1:19.',
        },
        heavier: { kid: 'Jetzt sind die Elefanten schwerer, und ihre Schale sinkt.', sci: 'Über 60 t: Die Elefanten wiegen mehr als Hoba.' },
        empty: { kid: 'Und runter mit euch! Die Waage ist wieder leer.', sci: 'Schale geleert.' },
      },
      panel: {
        kid: [
          'Hoba ist der größte Meteorit, der je gefunden wurde: ein flacher Block aus Eisen und Nickel, etwa 2,7 Meter breit, so groß wie der Boden eines kleinen Zimmers, und etwa 60 Tonnen schwer. Ein Farmer, Jacobus Hermanus Brits, fand ihn 1920, als sein Pflug dagegen stieß. Niemand hat ihn je bewegt: Er liegt, wo er gelandet ist.',
          'Seltsamerweise gibt es keinen Krater um ihn herum. Forscher glauben, dass die Luft ihn stark abgebremst hat, vielleicht weil er so flach ist, sodass er für einen Meteoriten recht sanft gelandet ist. Tipp das Röntgenmessgerät an, um zu sehen, woraus Hoba besteht, den Magneten, um ihn zu testen, und die große Waage, um ihn in Elefanten zu wiegen.',
        ],
        sci: [
          'Hoba, 1920 von Jacobus Hermanus Brits auf der Farm Hoba West bei Grootfontein gefunden, ist der größte bekannte Meteorit: etwa 2,7 × 2,7 × 0,9 m und heute rund 60 t, beim Fund mehr, denn Erosion, Probenahmen und Vandalismus haben ihren Teil genommen. Er ist ein Ataxit der Gruppe IVB, mit etwa 16,4% Ni und 0,8% Co. Seit 1955 ist er ein Nationaldenkmal.',
          'Ein Krater wurde nie gefunden. Die übliche Erklärung: Die Atmosphäre bremste ihn auf eine geringe Geschwindigkeit ab, vielleicht unterstützt durch seine flache Form, sodass er ohne Krater niederging. Zum Vergleich für die Waage: Ein Afrikanischer Elefantenbulle wiegt etwa 6 t.',
        ],
      },
    },
    dagger: {
      label: 'Tutanchamuns Dolch',
      title: 'Der Dolch eines Pharaos aus Himmelseisen',
      cards: { dagger: 'Tutanchamuns Dolch (Kopie)', knife: 'Verhüttetes Eisen' },
      hints: {
        dagger: 'Tipp die Eisenklinge des Dolchs an, um sie zu messen',
        knife: 'Tipp jetzt das einfache Eisenmesser an',
        again: 'Tipp eine der Klingen an, um sie noch einmal zu messen',
        reading: 'Das Gerät misst',
      },
      buttons: { dagger: 'Den Dolch messen', knife: 'Das Eisenmesser messen' },
      legend: { dagger: 'Ni 10,8%   Co 0,58%', knife: 'Ni < 1%' },
      says: {
        dagger: {
          kid: 'Die Klinge hat fast 11% Nickel und etwas Cobalt, genau wie Eisenmeteoriten. Tutanchamuns Dolch wurde aus Eisen gemacht, das vom Himmel fiel!',
          sci: '10,8% Ni und 0,58% Co, wie Comelli und Kollegen 2016 an der echten Klinge mit tragbarer Röntgenfluoreszenz gemessen haben: die Zusammensetzung eines Eisenmeteoriten, nicht die von verhüttetem Eisen.',
        },
        knife: {
          kid: 'Kaum Nickel! Eisen, das Menschen aus Gestein schmelzen, hat sehr wenig davon. So verrät das Nickel, ob Eisen vom Himmel oder von der Erde stammt.',
          sci: 'Verhüttetes Eisen: Nickel deutlich unter 1%. Eisenerze enthalten wenig Nickel, deshalb hat solches Eisen selten mehr als ein paar Prozent; Meteoriteneisen hat etwa 5% oder mehr.',
        },
      },
      panel: {
        kid: [
          'Tutanchamun war ein junger Pharao Ägyptens, der vor etwa 3300 Jahren starb. Als das Team von Howard Carter 1925 seine Binden abwickelte, fand es zwei Dolche bei ihm: einen mit einer Klinge aus Gold und einen mit einer Klinge aus Eisen, zu einer Zeit, als die Menschen gerade erst anfingen, Eisen herzustellen. In dieser Vitrine liegt eine Kopie des eisernen.',
          '2016 haben Forscher die echte Klinge mit einem Röntgenmessgerät wie diesem gemessen, ohne sie zu berühren, und das Nickel zeigte, dass das Eisen aus einem Meteoriten stammt. Der Griff ist aus Gold, verziert mit winzigen Goldkügelchen und bunten Bändern, mit einem Knauf aus Bergkristall obendrauf.',
        ],
        sci: [
          'Den Eisendolch fand das Team von Howard Carter 1925 in den Binden der Mumie Tutanchamuns (er starb um 1323 v. Chr.), neben einem Dolch mit goldener Klinge. Der Griff ist aus Gold mit Granulation und Einlagen, der Knauf aus Bergkristall. 2016 maßen Comelli und Kollegen die Klinge zerstörungsfrei mit tragbarer Röntgenfluoreszenz: Fe mit 10,8% Ni und 0,58% Co, eine meteoritische Zusammensetzung.',
          '2022 kartierten Matsui und Kollegen die Klinge und beschrieben Spuren von Widmanstätten-Figuren, was auf ein Schmieden bei recht niedrigen Temperaturen, unter etwa 950 °C, hindeutet; sie vermuteten, der Dolch könnte ein Geschenk aus dem Reich Mitanni gewesen sein. Andere widersprechen: Wo er gefertigt wurde, ist noch offen.',
        ],
      },
    },
    etch: {
      label: 'Der Ätztisch',
      title: 'Schneiden, polieren, ätzen: die verborgenen Kristalle',
      sign: 'Ätztisch',
      pieces: { gibeon: 'Gibeon', hoba: 'Hoba', bar: 'Verhüttetes Eisen' },
      hints: {
        saw: 'Tipp die Säge an, um dieses Stück zu schneiden',
        polish: 'Tipp die Polierscheibe an, um es zu polieren',
        acid: 'Tipp die Säure-Pipette an, um es zu ätzen',
        lens: 'Tipp die Lupe an, um die Atome zu sehen',
        next: 'Tipp ein anderes Stück an, um es zu bearbeiten',
        fresh: 'Tipp die Kiste an für neue Stücke',
        working: 'Schau auf den Tisch',
      },
      buttons: { next: 'Nächstes Stück', saw: 'Sägen', polish: 'Polieren', acid: 'Säure', lens: 'Lupe', fresh: 'Neue Stücke' },
      legend: { gibeon: 'Kamacit · Taenit', hoba: 'Ni 16%', bar: 'Fe' },
      says: {
        pick: {
          gibeon: {
            kid: 'Gibeon, ein Meteorit aus dem Süden Namibias. Die Nama machten aus seinem Eisen Werkzeuge und Speerspitzen.',
            sci: 'Gibeon: Gruppe IVA, ein feiner Oktaedrit mit etwa 7,7% Ni, verstreut über Groß-Namaland. Die Nama verarbeiteten ihn zu Werkzeugen und Waffen.',
          },
          hoba: { kid: 'Ein Stück von Hoba, dem Riesen da draußen.', sci: 'Hoba: ein IVB-Ataxit, etwa 16% Ni.' },
          bar: { kid: 'Ein Eisenbarren, von Menschen in einem Ofen aus Gestein gemacht.', sci: 'Verhüttetes Eisen, aus Erz gewonnen: kaum Nickel.' },
        },
        saw: { kid: 'Die Säge schneidet das Ende ab. Die neue Fläche ist grau und voller Kratzer.', sci: 'Gesägt: eine frische Fläche, matt und von der Klinge zerkratzt.' },
        polish: {
          kid: 'Die Scheibe dreht sich mit immer feinerem Pulver, bis die Fläche glänzt wie ein Spiegel. Noch kein Muster!',
          sci: 'Geschliffen und mit immer feineren Schleifmitteln poliert: ein Spiegel, und noch zeigt sich keine Struktur.',
        },
        acid: {
          gibeon: {
            kid: 'Schau! Ein Muster aus gekreuzten Streifen erscheint, wie geflochtenes Stroh. Die Säure frisst die Eisenplatten mit wenig Nickel schneller als ihre dünnen, nickelreichen Ränder, und so zeigen sich die Kristalle.',
            sci: 'Die Widmanstätten-Figuren: Platten aus Kamacit (etwa 5 bis 7% Ni) auf den Oktaederebenen des früheren Taenitkristalls, gesäumt von nickelreichem Taenit, der der Säure widersteht. Im Gibeon ist jede Platte einige Zehntel Millimeter breit (hier größer gezeichnet).',
          },
          hoba: {
            kid: 'Nichts! Hoba bleibt glatt. Er hat so viel Nickel, dass seine Kristalle viel zu winzig zum Sehen sind.',
            sci: 'Kein Muster: Mit etwa 16% Ni wurde das Metall zu einer mikroskopisch feinen Verwachsung aus Kamacit und Taenit (Plessit), viel zu fein fürs Auge.',
          },
          bar: {
            kid: 'Hier auch nichts. Eisen aus Gestein hat fast kein Nickel, deshalb wachsen darin nie solche Kristalle.',
            sci: 'Kein Muster: fast kein Nickel, und es kühlte in Stunden ab, nicht über Millionen Jahre.',
          },
        },
        lens: {
          gibeon: {
            kid: 'Atome! In den breiten Platten sitzen nur wenige Nickelatome (grün) zwischen dem Eisen. In den dünnen, hellen Rändern sind es viele.',
            sci: 'Kamacit: kubisch-raumzentriertes Eisen mit etwa 6% Ni. Taenit: kubisch-flächenzentriert, 25 bis 50% Ni nahe seinen Rändern. Das Nickel wanderte zwischen beiden, Atom für Atom, über Millionen Jahre.',
          },
          hoba: { kid: 'Eisenatome mit Nickel überall dazwischen: etwa ein Atom von sechs.', sci: 'Etwa 16% Ni, verteilt in einem mikroskopischen Gemenge aus Kamacit und Taenit.' },
          bar: { kid: 'Nur Eisenatome, kaum Nickel.', sci: 'Fast reines Eisen (echte Barren enthalten auch etwas Kohlenstoff und Schlacke).' },
        },
        needCut: { kid: 'Schneide es zuerst mit der Säge.', sci: 'Zuerst sägen.' },
        needPolish: { kid: 'Poliere es zuerst: Die Säure braucht eine glatte Fläche.', sci: 'Zuerst polieren: Eine gesägte Fläche zeigt beim Ätzen nur Kratzer.' },
        needEtch: { kid: 'Schneide, poliere und ätze es zuerst, dann schau genauer hin.', sci: 'Zuerst die Fläche vorbereiten: sägen, polieren, ätzen.' },
        done: { kid: 'Dieses ist fertig. Tipp ein anderes Stück an.', sci: 'Dieses ist fertig: Wähle ein anderes Stück.' },
        fresh: { kid: 'Neue Stücke, alle wieder roh!', sci: 'Frische Proben.' },
      },
      panel: {
        kid: [
          'Meteoriteneisen versteckt ein Geheimnis in seinem Inneren. Tipp ein Stück an, schneide es mit der Säge, poliere es zu einem Spiegel und gib dann ein paar Tropfen Säure darauf. Probier alle drei: Gibeon, einen Meteoriten aus dem Süden Namibias, ein Stück von Hoba und einen Eisenbarren, den Menschen gemacht haben.',
          'Nur eines zeigt die gekreuzten Kristalle. Sie wuchsen, während das Eisen sehr langsam abkühlte, über Millionen Jahre, im Inneren eines kleinen Planeten. Kein Ofen auf der Erde kann so langsam abkühlen, deshalb ist so ein Muster ein Zeichen, dass das Eisen aus dem All kam.',
        ],
        sci: [
          'William Thomson sah das Muster 1804 in Neapel, nachdem er einen Meteoriten mit Salpetersäure behandelt hatte; Graf Alois von Beckh Widmanstätten beobachtete es 1808, und es trägt seinen Namen. Geätzt wird heute meist mit Nital, ein paar Prozent Salpetersäure in Alkohol.',
          'Taenit (kubisch-flächenzentriert, nickelreich) ist in der Hitze stabil. Als der Kern abkühlte, wuchs daraus Kamacit (kubisch-raumzentriert, nickelarm) in Platten entlang der Oktaederebenen, vor allem zwischen etwa 700 und 450 °C, während Nickel aus dem wachsenden Kamacit in den schrumpfenden Taenit wanderte. Die Breite der Platten hängt von der Abkühlrate und vom Nickelgehalt ab. Ataxite wie Hoba, nickelreicher, bilden nie grobe Platten; verhüttetes Eisen, fast ohne Nickel und in Stunden abgekühlt, bildet gar keine.',
        ],
      },
    },
    asteroid: {
      label: 'Ein kleiner Planet',
      title: 'Woher die Eisenmeteoriten kommen',
      hints: {
        heat: 'Tipp den kleinen Planeten an, um ihn zu erhitzen',
        sinking: 'Schau, wie das Eisen in die Mitte sinkt',
        slower: 'Tipp die Lupe an, damit der Kern langsamer abkühlt',
        faster: 'Tipp die Lupe an, damit der Kern schneller abkühlt',
        smash: 'Tipp den kleinen Planeten an, um ihn zu zertrümmern',
        flying: 'Schau, wie die Stücke fliegen',
        again: 'Tipp die Stücke an für einen neuen kleinen Planeten',
      },
      buttons: { heat: 'Erhitzen', smash: 'Zertrümmern', again: 'Ein neuer kleiner Planet', slow: 'Langsam abkühlen', fast: 'Schnell abkühlen' },
      slider: 'Wie schnell der Kern abkühlt',
      rate: { kid: '{r} °C in jeder Million Jahre', sci: '{r} °C pro Million Jahre: von 700 auf 450 °C in {t} Mio. Jahren' },
      lensLabel: { none: 'Noch kein Eisenkern', slow: 'Langsam abgekühlt: breite Platten', mid: 'Je langsamer, desto breiter', fast: 'Schnell abgekühlt: dünne Platten', sci: '{r} °C pro Million Jahre' },
      says: {
        heat: {
          kid: 'Der kleine Planet heizt sich von innen auf! Als das Sonnensystem jung war, waren einige seiner Atome radioaktiv und gaben genug Wärme ab, um ihn zu schmelzen.',
          sci: 'Heizung durch Aluminium-26 (Halbwertszeit etwa 0,7 Millionen Jahre): Planetesimale, die in den ersten ein, zwei Millionen Jahren entstanden, schmolzen von innen.',
        },
        core: {
          kid: 'Eisen ist schwerer als Gestein, also sinkt das geschmolzene Eisen in die Mitte und bildet ein eisernes Herz, den Kern. Das Gestein bleibt drumherum.',
          sci: 'Differentiation: Geschmolzenes Eisen-Nickel, mit etwas Schwefel, ist mehr als doppelt so dicht wie die Silikatschmelze und sinkt zu einem Kern; die Silikate bilden den Mantel.',
        },
        cooled: {
          kid: 'Jetzt kühlt der Kern ab, ganz langsam, über Millionen Jahre. Schau in die Lupe: Im Eisen wachsen Kristalle.',
          sci: 'Der Kern kühlt ab; zwischen etwa 700 und 450 °C wachsen Kamacitplatten aus dem Taenit. Die Lupe verfolgt sie.',
        },
        slower: { kid: 'Langsamer abkühlen: Die Platten haben mehr Zeit und werden breiter.', sci: 'Langsamere Abkühlung, mehr Zeit für die Diffusion des Nickels: breitere Kamacitplatten.' },
        faster: { kid: 'Schneller abkühlen: dünne Platten.', sci: 'Schnellere Abkühlung: schmalere Platten.' },
        smash: {
          kid: 'Krach! Ein anderer Felsbrocken zertrümmert den kleinen Planeten. Stücke seines eisernen Herzens werden zu Eisenmeteoriten, Stücke seiner steinernen Hülle zu Steinmeteoriten.',
          sci: 'Eine zerstörerische Kollision: Bruchstücke des Kerns werden zu Eisenmeteoriten, Bruchstücke des Mantels zu Steinmeteoriten (Achondriten).',
        },
        earth: {
          kid: 'Und ein Stück fällt nach einer unglaublich langen Reise um die Sonne auf die Erde!',
          sci: 'Die Bruchstücke treiben lange umher, bevor sie die Erde erreichen: Die Bestrahlungsalter von Eisenmeteoriten liegen meist bei Hunderten Millionen Jahren.',
        },
        again: { kid: 'Ein neuer kleiner Planet, wieder ganz durchmischt: Gestein mit Metallkörnchen. Erhitze ihn und schau zu!', sci: 'Neustart: ein undifferenziertes Planetesimal, Gestein mit Metallkörnern.' },
        first: { kid: 'Noch kein Eisenkern: Erhitze zuerst den kleinen Planeten.', sci: 'Noch kein Kern: Schmilz zuerst das Planetesimal.' },
      },
      panel: {
        kid: [
          'Eisenmeteoriten sind Stücke der eisernen Herzen kleiner Planeten. Als das Sonnensystem jung war, wurden kleine Planeten innen so heiß, dass sie schmolzen. Ihr Eisen sank in die Mitte und bildete einen Kern, wie den der Erde.',
          'Der Kern kühlte ganz, ganz langsam ab, über Millionen Jahre, und große Kristalle wuchsen darin: Je langsamer er abkühlte, desto breiter wurden sie. Dann wurde der kleine Planet bei einem Zusammenstoß zertrümmert, und seine Stücke kreisen seitdem um die Sonne. Ab und zu fällt eines auf die Erde.',
        ],
        sci: [
          'Eisenmeteoriten stammen aus den Metallkernen von Planetesimalen, die in den ersten ein, zwei Millionen Jahren des Sonnensystems entstanden und schmolzen, vor allem durch Aluminium-26 aufgeheizt. Metall trennte sich vom Silikat und sank; dann kühlten die Kerne ab und kristallisierten. Eisenmeteoriten stammen von Dutzenden verschiedener Mutterkörper.',
          'Die Abkühlraten, abgelesen an den Nickelprofilen quer durch Taenitplatten, reichen von einigen zehn bis zu einigen tausend °C pro Million Jahre; allein die IVA-Eisen, Gibeons Gruppe, umfassen etwa 100 bis 6600 (Yang und Kollegen, 2008). Die Lupe zeigt nur den Trend. Zusammenstöße zerbrachen die Mutterkörper; die Bruchstücke erreichen die Erde nach Hunderten Millionen Jahren im All.',
        ],
      },
    },
  },
}
