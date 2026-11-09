// The words of radon's rock room ("How does a rock breathe out a gas?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Rn.js (the easel shows it); the room shows it happening and adds to it.
// Sources and what is flagged:
// - Ra-226 alpha decay: Q about 4.87 MeV, the main alpha 4.78 MeV, so the Rn-222 recoils with about 86 keV
//   (4/226 of Q, momentum shared equally). Recoil ranges as usually quoted (Tanner 1980, and after him
//   UNSCEAR 2000, Annex B): 20 to 70 nm in common minerals, about 100 nm in water, about 63 um in air. The
//   room's model uses 40 nm in both crystals, 100 nm in water and next to no loss in air; 1 m in the lens is
//   60 nm, the pore 70 nm wide.
// - The alpha particle's range in silicate minerals: some 20 micrometres (the alpha-ejection distances of
//   (U-Th)/He dating, Farley and colleagues 1996, are 11 to 34 um for the U and Th series' alphas; flagged as
//   a round figure).
// - The emanation coefficient, "a few percent to over half", and pore water raising it by stopping recoils:
//   the board's story (Rn.js) and the reviews it rests on (Sakoda and colleagues 2011; Sun and Furbish; the
//   MDPI Soil Systems review of 2018). Real grains are far bigger than the recoil range, so most emanating
//   radium sits in coatings, cracks and fine grains: said in the Scientist panel.
// - Rn-222 half-life 3.82 days (src/data/elements.json, 330 177 s), lambda 2.1e-6 per second, mean life 5.5
//   days. Diffusion coefficients of radon: about 1.1e-5 m2/s in air and 1.1e-9 m2/s in water (the standard
//   figures), so diffusion lengths about 2.3 m and about 2 cm; in soil typically 1 to 2 m dry. The column uses
//   L = 1.5 m dry and 0.3 m wet (a wet soil's figure is a choice inside the published range, flagged), and the
//   share reaching the surface from depth z goes as exp(-z/L) for steady diffusion with decay.
// - The U-238 series and its half-lives: src/data/nuclides.json (NUBASE), with Pa-234m (1.16 min; the ground
//   state Pa-234 lives 6.7 h) in place of the ground state. U-238 specific activity about 12.4 kBq per gram.
//   Every member but radon is a solid at room temperature; radon boils at -61.7 C (elements.json, 211.45 K).
//   Radium and polonium found by Marie and Pierre Curie in 1898, polonium named after Poland, Marie's homeland.
//   Outdoor radon about 10 Bq/m3 (UNSCEAR; Rn.js).
// - Granite holds a few grams of uranium per tonne (the cellar board's figure); the Serra da Estrela is a
//   granite range of central Portugal, and the granites of the north and centre give the country's highest
//   indoor radon (the cellar board). Uranium in granite sits mostly in accessory minerals (zircon, monazite,
//   uraninite) and along grain edges and cracks.
// Placeholders: {n}, {m}, {d}, and in the family's Scientist line {name}, {state}, {hl}, {mode}, {next}.
export const RN_ROCK_WORDS = {
  en: {
    title: 'A granite hillside at dusk',
    greet: {
      kid: 'We are inside the picture: a granite hillside in the Serra da Estrela at dusk! These rocks breathe out radon, and radon is me. Break a radium atom in the giant lens, let radon wander up the soil column, and meet my family on the staircase in the sky. The picture\'s story is on the easel.',
      sci: 'The Serra da Estrela at dusk: granite with a few grams of uranium per tonne. Three things to try: the recoil that frees radon from a grain, its diffusion up through soil, and its place in the uranium-238 series. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Granite is made of grains: pink feldspar, grey quartz and black mica. Look at the cut face of the big boulder!',
        'Every tonne of granite holds a few grams of uranium. That is enough to make radon all the time, for billions of years.',
        'When I am born I get a kick! A radium atom breaks apart: the alpha flies one way, and I fly the other.',
        'Most of me never leaves the rock. Only radon born close to the edge of a grain gets out, and water in the gap helps.',
        'Out here the wind spreads me so thin that it does not matter. Houses on granite are the places to air.',
      ],
      sci: [
        'Granite averages a few grams of uranium per tonne. The granites of the north and centre of Portugal give the country\'s highest indoor radon.',
        'Ra-226 decays with about 4.87 MeV: the alpha takes 4.78 MeV, and the Rn-222 recoils with about 86 keV, 4/226 of the energy, because the two share the momentum equally.',
        'Recoil ranges usually quoted: 20 to 70 nm in minerals, about 100 nm in water, about 63 µm in air. A dry pore wider than that last figure can stop radon too.',
        'Diffusion length L = √(D/λ), with λ = 2.1 × 10⁻⁶ per second: about 2.3 m in air, about 2 cm in water, typically 1 to 2 m in soil.',
        'Outdoor air holds about 10 Bq/m³ of radon on average. It is in closed rooms near the ground that it gathers.',
      ],
    },
    face: {
      kid: 'This is the boulder from the picture, cut open: pink feldspar, grey quartz and black mica. Some of these grains hold a little uranium.',
      sci: 'A cut face of granite: pink potassium feldspar, grey quartz, black biotite mica. Its uranium sits mostly in tiny accessory minerals (zircon, monazite, uraninite) and along grain edges and cracks.',
    },
    grain: {
      label: 'Inside the grains',
      title: 'The kick that frees radon',
      labels: { feldspar: 'feldspar', quartz: 'quartz', pore: 'pore', water: 'water', nm: '{n} nm' },
      hints: {
        radium: 'Tap the green radium atom',
        again: 'Tap the radium atom again',
        water: 'Tap the dropper to wet the pore',
        deeper: 'Tap deeper in the pink grain',
        board: 'Tap the board for 20 tries',
        more: 'Tap the radium, the pink grain or the dropper',
      },
      buttons: { one: 'Break one radium atom', twenty: '20 tries', water: 'Add water', dry: 'Dry the pore' },
      sliders: { depth: 'Radium below the surface', water: 'Water in the pore' },
      board: {
        title: 'The last 20 tries',
        free: 'free in the pore',
        stuck: 'stuck in its grain',
        buried: 'buried next door',
        share: 'free: {n} of {m}',
        none: 'No tries yet',
      },
      says: {
        free: {
          kid: 'Free! The water in the pore stopped me before I could crash into the grain next door. Now I can wander out of the rock.',
          sci: 'Stopped in the pore water, where its range is about 100 nm: released into the pore space, free to diffuse.',
        },
        stuck: {
          kid: 'Stuck! I was born too deep and stopped inside my own crystal. I will break apart right here.',
          sci: 'The recoil ended inside the feldspar: the path to the surface was longer than the range (40 nm in this model).',
        },
        buried: {
          kid: 'Whoosh! I flew right across the dry gap and buried myself in the quartz. Nothing in a dry pore can stop me.',
          sci: 'It crossed the dry pore (its range in air is about 63 µm, far wider than this gap) and implanted in the quartz opposite.',
        },
        freeAgain: { kid: 'Free again!', sci: 'Released into the pore.' },
        stuckAgain: { kid: 'Stuck in my grain.', sci: 'Stopped in its own grain.' },
        buriedAgain: { kid: 'Buried next door.', sci: 'Implanted in the neighbouring grain.' },
        moved: {
          kid: 'A radium atom {n} nm below the surface. Tap it!',
          sci: 'Radium at {n} nm below the grain surface.',
        },
        deep: {
          kid: 'That is below the dashed line: born that deep, I can never reach the surface.',
          sci: 'Deeper than the recoil range: no direction leads out.',
        },
        wet: {
          kid: 'A film of water now clings to the pink grain.',
          sci: 'A water film on the feldspar: a recoil runs about 100 nm in water, against some 63 µm in air, so the film can catch it.',
        },
        full: { kid: 'The pore is full of water.', sci: 'The pore is saturated.' },
        dry: { kid: 'The pore has dried out.', sci: 'The pore is dry again.' },
        twenty: {
          kid: 'Free: {n} of 20. Try another depth, or more water!',
          sci: '{n} of 20 released: an emanation fraction of {m} % for radium at this depth and wetness.',
        },
      },
      panel: {
        kid: [
          'This is the picture\'s lens made giant: the edge of a pink feldspar grain below and a grey quartz grain above, with a tiny gap between them, a pore. The dots are their atoms. The green one is radium.',
          'When radium breaks apart it shoots out an alpha particle, and the new radon atom is kicked the other way, like a cannon jumping back when it fires. It flies only a tiny distance: born deep, it stops inside its own grain; across a dry gap, it crashes into the grain opposite. Water in the gap stops it softly, and then it is free to wander out.',
        ],
        sci: [
          'Ra-226 decays by alpha emission (Q about 4.87 MeV). The momentum is shared equally, the energy is not: the alpha takes about 4.78 MeV and runs some 20 µm through the mineral, while the Rn-222 recoils with about 86 keV and stops within a few tens of nanometres. Ranges usually quoted are 20 to 70 nm in minerals, about 100 nm in water and about 63 µm in air. The model uses 40 nm in both crystals; 1 m in the lens is 60 nm.',
          'Only atoms born within one recoil range of a surface, and aimed outward, can leave the grain. In a narrow dry pore they cross and implant in the next grain; pore water stops them, which is why damp rock and soil release more radon. Real grains are thousands of times bigger than the part shown, so what lets radon out is radium near surfaces: in coatings on grains, along tiny cracks, in fine clay. The share released, the emanation coefficient, ranges from a few percent to over half.',
        ],
      },
    },
    soil: {
      label: 'The soil column',
      title: 'How far radon gets',
      labels: { air: 'air', granite: 'granite', m: '{n} m', day: 'day {n}' },
      hints: {
        level: 'Tap a level of the column',
        deeper: 'Tap a deeper level',
        rain: 'Tap the rain cloud',
        wet: 'Tap a level in the wet soil',
        dry: 'Tap the cloud to dry the soil',
      },
      buttons: { release: 'Release radon here', rain: 'Rain', dry: 'Dry the soil' },
      slider: 'Depth to release at',
      board: { title: 'Reached the air, out of 20', dry: 'dry soil', wet: 'wet soil' },
      says: {
        release: {
          kid: 'Twenty radon atoms, born {d} down. Watch them wander!',
          sci: 'Twenty Rn-222 atoms released at {d}. Each takes a random walk and decays at its own random moment (mean life 5.5 days, sped up).',
        },
        done: {
          kid: '{n} of 20 reached the air. The others broke apart in the soil and became polonium, a solid: the amber dots.',
          sci: '{n} of 20 reached the surface; the rest decayed underground to Po-218, which stays on the soil grains.',
        },
        rain: {
          kid: 'Rain! Water fills the gaps between the soil grains. In water I spread about ten thousand times more slowly than in air.',
          sci: 'The pores fill with water. Radon diffuses about 10⁴ times more slowly in water than in air, so its diffusion length falls (0.3 m in this model).',
        },
        dry: {
          kid: 'The sun and the wind dry the soil again.',
          sci: 'The soil drains and dries; the diffusion length is back to 1.5 m.',
        },
      },
      panel: {
        kid: [
          'Radon that gets out of the grains wanders through the gaps in the soil, zigzagging at random. But it does not have long: every radon atom breaks apart at its own random moment, half of them within about four days. Then it becomes polonium, a solid, and stays where it is (the amber dots).',
          'Release radon at different depths and see how many reach the air: from near the top most of them, from three metres down only a few. After rain the gaps fill with water, radon crawls through it very slowly, and even fewer get out.',
        ],
        sci: [
          'Rn-222 has a half-life of 3.82 days (λ = 2.1 × 10⁻⁶ per second, mean life 5.5 days). In that time it diffuses a typical distance L = √(D/λ), its diffusion length: about 2.3 m in open air (D about 1.1 × 10⁻⁵ m²/s), typically 1 to 2 m in dry soil, about 2 cm in water (D about 1.1 × 10⁻⁹ m²/s). The column uses L = 1.5 m dry and 0.3 m wet; about 2 s of the room are a day.',
          'From a source at depth z, the share reaching the surface goes as e^(−z/L): with L = 1.5 m about 70 % from 0.5 m, about 14 % from 3 m. So most radon entering the air comes from the top metre or two of soil. Wind and changes of air pressure also pump soil gas in and out, which the column leaves out.',
        ],
      },
    },
    family: {
      label: 'The uranium family',
      title: 'The one gas in the family',
      hints: { atom: 'Tap an atom on the staircase', radon: 'Tap the floating teal atom', more: 'Tap another atom' },
      buttons: { top: 'Uranium-238, the top', radon: 'Radon-222, the gas', end: 'Lead-206, the end' },
      state: { solid: 'solid', gas: 'gas' },
      hl: ['4.47 billion years', '24 days', '1.2 minutes', '245 500 years', '75 400 years', '1600 years', '3.8 days', '3.1 minutes', '27 minutes', '20 minutes', '164 microseconds', '22 years', '5 days', '138 days', 'stable'],
      kid: [
        'Uranium-238, the head of the family. Half of it changes only after 4.47 billion years, about the age of the Earth. A solid metal.',
        'Thorium-234, a solid metal. Half of it is gone in 24 days.',
        'Protactinium-234m, a solid metal that lasts only a minute or two.',
        'Uranium-234: uranium again! A solid metal. Half of it changes in about 245 000 years.',
        'Thorium-230, a solid metal. Half of it changes in about 75 000 years.',
        'Radium-226, my mother! A solid metal, found by Marie and Pierre Curie in 1898. Every radium atom that breaks apart makes a radon atom.',
        'That is me, radon-222: the only gas in the whole family! Half of us break apart within four days.',
        'Polonium-218, my daughter: a solid again. It lasts about three minutes. Marie and Pierre Curie named polonium after Poland, Marie\'s homeland.',
        'Lead-214, a solid metal. Half of it changes in about 27 minutes.',
        'Bismuth-214, a solid metal. Half of it changes in about 20 minutes.',
        'Polonium-214, a solid that lasts less than a blink: 164 millionths of a second!',
        'Lead-210, a solid metal. Half of it changes in about 22 years.',
        'Bismuth-210, a solid metal. Half of it changes in 5 days.',
        'Polonium-210, a solid metal. Half of it changes in 138 days.',
        'Lead-206: the bottom of the staircase. It never changes again.',
      ],
      sci: {
        line: '{name}: {state}, half-life {hl}; {mode} decay to {next}.',
        alpha: 'alpha',
        beta: 'beta',
        rn: 'Radon-222: the only gas of the series (it boils at −61.7 °C), half-life 3.82 days; alpha decay to Po-218.',
        end: 'Lead-206: solid and stable, the end of the series.',
        pa: 'Pa-234m is an excited state of the nucleus; the ground state, Pa-234, lives 6.7 hours.',
      },
      forge: 'The Atom Forge: watch a nucleus go down the whole staircase',
      panel: {
        kid: [
          'Uranium-238 is the head of a family. Very, very slowly it changes into thorium, then protactinium, and on down the staircase, fourteen steps in all, until it becomes lead-206, which never changes again. A big step down is an alpha decay: the atom throws out two protons and two neutrons. A small step is a beta decay: a neutron inside turns into a proton and an electron flies out.',
          'Every member of the family is a solid metal except one: radon, a gas. That is why radon is the one that can leave the rock. Tap the atoms to meet them.',
        ],
        sci: [
          'The uranium-238 series: 8 alpha and 6 beta-minus decays from U-238 (4.47 billion years) to stable Pb-206, through Th-234 (24.1 d), Pa-234m (1.16 min), U-234 (245 500 y), Th-230 (75 400 y), Ra-226 (1600 y), Rn-222 (3.82 d), Po-218 (3.10 min), Pb-214 (27 min), Bi-214 (19.9 min), Po-214 (164 µs), Pb-210 (22.2 y), Bi-210 (5.0 d) and Po-210 (138 d). Small side branches are left out.',
          'In a rock left undisturbed for a million years or more the chain is in secular equilibrium: every member decays at the rate of U-238 itself, about 12 400 decays a second per gram, so each gram of uranium keeps making radon at that rate. Radon is the only member that is a gas, so it is the one that can leave the mineral; once it decays, its daughters are solids again.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Uma encosta de granito ao entardecer',
    greet: {
      kid: 'Estamos dentro da imagem: uma encosta de granito na Serra da Estrela ao entardecer! Estas rochas expiram rádon, e o rádon sou eu. Parte um átomo de rádio na lupa gigante, deixa o rádon vaguear pela coluna de terra acima e conhece a minha família na escada do céu. A história da imagem está no cavalete.',
      sci: 'A Serra da Estrela ao entardecer: granito com alguns gramas de urânio por tonelada. Três coisas para experimentar: o recuo que liberta o rádon de um grão, a sua difusão pelo solo acima e o seu lugar na série do urânio-238. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O granito é feito de grãos: feldspato cor-de-rosa, quartzo cinzento e mica preta. Olha para a face cortada da pedra grande!',
        'Cada tonelada de granito tem alguns gramas de urânio. Chega para fazer rádon o tempo todo, durante milhares de milhões de anos.',
        'Quando nasço levo um pontapé! Um átomo de rádio parte-se: a alfa voa para um lado e eu voo para o outro.',
        'Quase todo o rádon nunca sai da rocha. Só sai o que nasce perto da borda de um grão, e a água na fenda ajuda.',
        'Aqui fora o vento espalha-me tanto que não tem importância. As casas em cima de granito é que se devem arejar.',
      ],
      sci: [
        'O granito tem em média alguns gramas de urânio por tonelada. Os granitos do norte e do centro de Portugal dão os valores de rádon mais altos do país dentro de casa.',
        'O Ra-226 decai com cerca de 4,87 MeV: a alfa leva 4,78 MeV e o Rn-222 recua com cerca de 86 keV, 4/226 da energia, porque os dois repartem o momento linear por igual.',
        'Alcances de recuo citados habitualmente: 20 a 70 nm nos minerais, cerca de 100 nm na água, cerca de 63 µm no ar. Um poro seco mais largo do que este último valor também consegue parar o rádon.',
        'Comprimento de difusão L = √(D/λ), com λ = 2,1 × 10⁻⁶ por segundo: cerca de 2,3 m no ar, cerca de 2 cm na água, tipicamente 1 a 2 m no solo.',
        'O ar livre tem em média cerca de 10 Bq/m³ de rádon. É em divisões fechadas perto do chão que ele se junta.',
      ],
    },
    face: {
      kid: 'Esta é a pedra da imagem, cortada ao meio: feldspato cor-de-rosa, quartzo cinzento e mica preta. Alguns destes grãos têm um pouco de urânio.',
      sci: 'Uma face cortada de granito: feldspato potássico cor-de-rosa, quartzo cinzento, biotite preta. O seu urânio está sobretudo em minúsculos minerais acessórios (zircão, monazite, uraninite) e ao longo das bordas dos grãos e das fissuras.',
    },
    grain: {
      label: 'Dentro dos grãos',
      title: 'O pontapé que liberta o rádon',
      labels: { feldspar: 'feldspato', quartz: 'quartzo', pore: 'poro', water: 'água', nm: '{n} nm' },
      hints: {
        radium: 'Toca no átomo verde de rádio',
        again: 'Toca outra vez no átomo de rádio',
        water: 'Toca no conta-gotas para molhar o poro',
        deeper: 'Toca mais fundo no grão cor-de-rosa',
        board: 'Toca no quadro para 20 tentativas',
        more: 'Toca no rádio, no grão cor-de-rosa ou no conta-gotas',
      },
      buttons: { one: 'Partir um átomo de rádio', twenty: '20 tentativas', water: 'Juntar água', dry: 'Secar o poro' },
      sliders: { depth: 'Rádio abaixo da superfície', water: 'Água no poro' },
      board: {
        title: 'As últimas 20 tentativas',
        free: 'livre no poro',
        stuck: 'preso no seu grão',
        buried: 'enterrado no vizinho',
        share: 'livres: {n} de {m}',
        none: 'Ainda sem tentativas',
      },
      says: {
        free: {
          kid: 'Livre! A água do poro travou-me antes de eu chocar com o grão vizinho. Agora posso vaguear para fora da rocha.',
          sci: 'Parou na água do poro, onde o seu alcance é de cerca de 100 nm: libertado no espaço do poro, livre para se difundir.',
        },
        stuck: {
          kid: 'Preso! Nasci fundo demais e parei dentro do meu próprio cristal. Vou partir-me mesmo aqui.',
          sci: 'O recuo terminou dentro do feldspato: o caminho até à superfície era mais longo do que o alcance (40 nm neste modelo).',
        },
        buried: {
          kid: 'Zás! Atravessei a fenda seca e enterrei-me no quartzo. Num poro seco nada me consegue parar.',
          sci: 'Atravessou o poro seco (o seu alcance no ar é de cerca de 63 µm, muito mais do que esta fenda) e implantou-se no quartzo em frente.',
        },
        freeAgain: { kid: 'Livre outra vez!', sci: 'Libertado no poro.' },
        stuckAgain: { kid: 'Preso no meu grão.', sci: 'Parou no seu próprio grão.' },
        buriedAgain: { kid: 'Enterrado no vizinho.', sci: 'Implantado no grão vizinho.' },
        moved: {
          kid: 'Um átomo de rádio a {n} nm da superfície. Toca nele!',
          sci: 'Rádio a {n} nm abaixo da superfície do grão.',
        },
        deep: {
          kid: 'Isso fica abaixo da linha tracejada: nascido tão fundo, nunca chego à superfície.',
          sci: 'Mais fundo do que o alcance de recuo: nenhuma direção leva para fora.',
        },
        wet: {
          kid: 'Agora há uma película de água agarrada ao grão cor-de-rosa.',
          sci: 'Uma película de água no feldspato: um recuo percorre cerca de 100 nm na água, contra uns 63 µm no ar, por isso a película pode apanhá-lo.',
        },
        full: { kid: 'O poro está cheio de água.', sci: 'O poro está saturado.' },
        dry: { kid: 'O poro secou.', sci: 'O poro voltou a estar seco.' },
        twenty: {
          kid: 'Livres: {n} de 20. Experimenta outra profundidade, ou mais água!',
          sci: '{n} de 20 libertados: uma fração de emanação de {m} % para rádio a esta profundidade e humidade.',
        },
      },
      panel: {
        kid: [
          'Esta é a lupa da imagem em ponto gigante: a borda de um grão de feldspato cor-de-rosa em baixo e de um grão de quartzo cinzento em cima, com uma fenda minúscula entre eles, um poro. Os pontinhos são os seus átomos. O verde é o rádio.',
          'Quando o rádio se parte, dispara uma partícula alfa, e o novo átomo de rádon é atirado para o outro lado, como um canhão que salta para trás quando dispara. Voa só uma distância minúscula: se nasceu fundo, para dentro do seu próprio grão; se atravessa uma fenda seca, choca com o grão em frente. A água na fenda trava-o devagarinho, e aí fica livre para vaguear para fora.',
        ],
        sci: [
          'O Ra-226 decai por emissão alfa (Q de cerca de 4,87 MeV). O momento linear reparte-se por igual, a energia não: a alfa leva cerca de 4,78 MeV e percorre uns 20 µm no mineral, enquanto o Rn-222 recua com cerca de 86 keV e para em poucas dezenas de nanómetros. Os alcances citados habitualmente são 20 a 70 nm nos minerais, cerca de 100 nm na água e cerca de 63 µm no ar. O modelo usa 40 nm nos dois cristais; 1 m na lupa são 60 nm.',
          'Só os átomos nascidos a menos de um alcance de recuo de uma superfície, e virados para fora, podem sair do grão. Num poro seco estreito atravessam-no e implantam-se no grão seguinte; a água do poro trava-os, e é por isso que a rocha e o solo húmidos libertam mais rádon. Os grãos reais são milhares de vezes maiores do que a parte mostrada, por isso o que deixa sair o rádon é o rádio perto das superfícies: em películas sobre os grãos, ao longo de fissuras minúsculas, na argila fina. A fração libertada, o coeficiente de emanação, vai de poucos por cento a mais de metade.',
        ],
      },
    },
    soil: {
      label: 'A coluna de terra',
      title: 'Até onde chega o rádon',
      labels: { air: 'ar', granite: 'granito', m: '{n} m', day: 'dia {n}' },
      hints: {
        level: 'Toca num nível da coluna',
        deeper: 'Toca num nível mais fundo',
        rain: 'Toca na nuvem de chuva',
        wet: 'Toca num nível da terra molhada',
        dry: 'Toca na nuvem para secar a terra',
      },
      buttons: { release: 'Libertar rádon aqui', rain: 'Chuva', dry: 'Secar a terra' },
      slider: 'Profundidade a que se liberta',
      board: { title: 'Chegaram ao ar, em 20', dry: 'terra seca', wet: 'terra molhada' },
      says: {
        release: {
          kid: 'Vinte átomos de rádon, nascidos a {d} de profundidade. Vê-os vaguear!',
          sci: 'Vinte átomos de Rn-222 libertados a {d}. Cada um faz um passeio aleatório e decai no seu próprio momento ao acaso (vida média de 5,5 dias, acelerada).',
        },
        done: {
          kid: 'No ar: {n} de 20. Os outros partiram-se na terra e viraram polónio, um sólido: os pontinhos cor de âmbar.',
          sci: 'À superfície: {n} de 20; os restantes decaíram debaixo do chão em Po-218, que fica nos grãos do solo.',
        },
        rain: {
          kid: 'Chuva! A água enche os espaços entre os grãos de terra. Na água espalho-me umas dez mil vezes mais devagar do que no ar.',
          sci: 'Os poros enchem-se de água. O rádon difunde-se cerca de 10⁴ vezes mais devagar na água do que no ar, por isso o comprimento de difusão cai (0,3 m neste modelo).',
        },
        dry: {
          kid: 'O sol e o vento voltam a secar a terra.',
          sci: 'O solo escorre e seca; o comprimento de difusão volta a 1,5 m.',
        },
      },
      panel: {
        kid: [
          'O rádon que sai dos grãos vagueia pelos espaços da terra, aos ziguezagues, ao acaso. Mas não tem muito tempo: cada átomo de rádon parte-se no seu próprio momento ao acaso, metade deles em cerca de quatro dias. Depois vira polónio, um sólido, e fica onde está (os pontinhos cor de âmbar).',
          'Liberta rádon a várias profundidades e vê quantos chegam ao ar: de perto do topo, a maior parte; de três metros de fundo, só alguns. Depois da chuva os espaços enchem-se de água, o rádon arrasta-se nela muito devagar, e saem ainda menos.',
        ],
        sci: [
          'O Rn-222 tem uma meia-vida de 3,82 dias (λ = 2,1 × 10⁻⁶ por segundo, vida média de 5,5 dias). Nesse tempo difunde-se uma distância típica L = √(D/λ), o seu comprimento de difusão: cerca de 2,3 m ao ar livre (D cerca de 1,1 × 10⁻⁵ m²/s), tipicamente 1 a 2 m em solo seco, cerca de 2 cm na água (D cerca de 1,1 × 10⁻⁹ m²/s). A coluna usa L = 1,5 m seca e 0,3 m molhada; cerca de 2 s da sala são um dia.',
          'De uma fonte à profundidade z, a fração que chega à superfície varia como e^(−z/L): com L = 1,5 m, cerca de 70 % a partir de 0,5 m e cerca de 14 % a partir de 3 m. Por isso, a maior parte do rádon que entra no ar vem do primeiro metro ou dois de solo. O vento e as variações da pressão do ar também bombeiam o gás do solo para dentro e para fora, o que a coluna deixa de fora.',
        ],
      },
    },
    family: {
      label: 'A família do urânio',
      title: 'O único gás da família',
      hints: { atom: 'Toca num átomo da escada', radon: 'Toca no átomo azul-esverdeado que flutua', more: 'Toca noutro átomo' },
      buttons: { top: 'Urânio-238, o topo', radon: 'Rádon-222, o gás', end: 'Chumbo-206, o fim' },
      state: { solid: 'sólido', gas: 'gás' },
      hl: ['4,47 mil milhões de anos', '24 dias', '1,2 minutos', '245 500 anos', '75 400 anos', '1600 anos', '3,8 dias', '3,1 minutos', '27 minutos', '20 minutos', '164 microssegundos', '22 anos', '5 dias', '138 dias', 'estável'],
      kid: [
        'Urânio-238, a cabeça da família. Metade dele só muda passados 4,47 mil milhões de anos, mais ou menos a idade da Terra. Um metal sólido.',
        'Tório-234, um metal sólido. Metade dele desaparece em 24 dias.',
        'Protactínio-234m, um metal sólido que dura só um ou dois minutos.',
        'Urânio-234: outra vez urânio! Um metal sólido. Metade dele muda em cerca de 245 000 anos.',
        'Tório-230, um metal sólido. Metade dele muda em cerca de 75 000 anos.',
        'Rádio-226, a minha mãe! Um metal sólido, descoberto por Marie e Pierre Curie em 1898. Cada átomo de rádio que se parte faz um átomo de rádon.',
        'Sou eu, o rádon-222: o único gás de toda a família! Metade de nós parte-se em menos de quatro dias.',
        'Polónio-218, a minha filha: outra vez um sólido. Dura cerca de três minutos. Marie e Pierre Curie deram ao polónio o nome da Polónia, a terra natal de Marie.',
        'Chumbo-214, um metal sólido. Metade dele muda em cerca de 27 minutos.',
        'Bismuto-214, um metal sólido. Metade dele muda em cerca de 20 minutos.',
        'Polónio-214, um sólido que dura menos do que um piscar de olhos: 164 milionésimos de segundo!',
        'Chumbo-210, um metal sólido. Metade dele muda em cerca de 22 anos.',
        'Bismuto-210, um metal sólido. Metade dele muda em 5 dias.',
        'Polónio-210, um metal sólido. Metade dele muda em 138 dias.',
        'Chumbo-206: o fundo da escada. Nunca mais muda.',
      ],
      sci: {
        line: '{name}: {state}, meia-vida de {hl}; decaimento {mode} para {next}.',
        alpha: 'alfa',
        beta: 'beta',
        rn: 'Rádon-222: o único gás da série (ferve a −61,7 °C), meia-vida de 3,82 dias; decaimento alfa para Po-218.',
        end: 'Chumbo-206: sólido e estável, o fim da série.',
        pa: 'O Pa-234m é um estado excitado do núcleo; o estado fundamental, o Pa-234, vive 6,7 horas.',
      },
      forge: 'A Forja de Átomos: vê um núcleo descer a escada toda',
      panel: {
        kid: [
          'O urânio-238 é a cabeça de uma família. Muito, muito devagar transforma-se em tório, depois em protactínio, e assim pela escada abaixo, catorze degraus ao todo, até se tornar chumbo-206, que nunca mais muda. Um degrau grande é um decaimento alfa: o átomo atira fora dois protões e dois neutrões. Um degrau pequeno é um decaimento beta: um neutrão lá dentro transforma-se num protão e sai disparado um eletrão.',
          'Todos os membros da família são metais sólidos menos um: o rádon, um gás. É por isso que o rádon é o que consegue sair da rocha. Toca nos átomos para os conheceres.',
        ],
        sci: [
          'A série do urânio-238: 8 decaimentos alfa e 6 beta-menos do U-238 (4,47 mil milhões de anos) ao Pb-206 estável, passando pelo Th-234 (24,1 d), Pa-234m (1,16 min), U-234 (245 500 a), Th-230 (75 400 a), Ra-226 (1600 a), Rn-222 (3,82 d), Po-218 (3,10 min), Pb-214 (27 min), Bi-214 (19,9 min), Po-214 (164 µs), Pb-210 (22,2 a), Bi-210 (5,0 d) e Po-210 (138 d). Os pequenos ramos laterais ficam de fora.',
          'Numa rocha intocada há um milhão de anos ou mais, a cadeia está em equilíbrio secular: cada membro decai ao ritmo do próprio U-238, cerca de 12 400 decaimentos por segundo por grama, por isso cada grama de urânio continua a fazer rádon a esse ritmo. O rádon é o único membro que é um gás, por isso é o que consegue sair do mineral; quando decai, as suas filhas voltam a ser sólidas.',
        ],
      },
    },
  },
  pl: {
    title: 'Granitowe zbocze o zmierzchu',
    greet: {
      kid: 'Jesteśmy w środku obrazu: na granitowym zboczu w Serra da Estrela o zmierzchu! Te skały wydychają radon, a radon to ja. Rozbij atom radu w olbrzymiej lupie, pozwól radonowi wędrować w górę kolumny gleby i poznaj moją rodzinę na schodach na niebie. Historia obrazu jest na sztalugach.',
      sci: 'Serra da Estrela o zmierzchu: granit z kilkoma gramami uranu na tonę. Trzy rzeczy do wypróbowania: odrzut, który uwalnia radon z ziarna, jego dyfuzja w górę przez glebę i jego miejsce w szeregu uranu-238. Historia obrazu jest na sztalugach.',
    },
    talk: {
      kid: [
        'Granit składa się z ziaren: różowego skalenia, szarego kwarcu i czarnej miki. Popatrz na przeciętą ścianę wielkiego głazu!',
        'Każda tona granitu zawiera kilka gramów uranu. To wystarczy, żeby cały czas wytwarzać radon, przez miliardy lat.',
        'Kiedy się rodzę, dostaję kopniaka! Atom radu się rozpada: cząstka alfa leci w jedną stronę, a ja w drugą.',
        'Większość radonu nigdy nie opuszcza skały. Wydostaje się tylko ten, który rodzi się blisko brzegu ziarna, a woda w szczelinie pomaga.',
        'Tutaj, na dworze, wiatr tak mnie rozprasza, że to nie ma znaczenia. Wietrzyć trzeba domy stojące na granicie.',
      ],
      sci: [
        'Granit zawiera średnio kilka gramów uranu na tonę. Granity północnej i środkowej Portugalii dają najwyższe w kraju stężenia radonu w domach.',
        'Ra-226 rozpada się z energią około 4,87 MeV: cząstka alfa unosi 4,78 MeV, a Rn-222 odskakuje z energią około 86 keV, 4/226 energii, bo oba dzielą pęd po równo.',
        'Zwykle podawane zasięgi odrzutu: 20 do 70 nm w minerałach, około 100 nm w wodzie, około 63 µm w powietrzu. Suchy por szerszy niż ta ostatnia wartość też może zatrzymać radon.',
        'Droga dyfuzji L = √(D/λ), przy λ = 2,1 × 10⁻⁶ na sekundę: około 2,3 m w powietrzu, około 2 cm w wodzie, zwykle 1 do 2 m w glebie.',
        'W powietrzu na dworze jest średnio około 10 Bq/m³ radonu. Gromadzi się on w zamkniętych pomieszczeniach blisko ziemi.',
      ],
    },
    face: {
      kid: 'To głaz z obrazu, przecięty na pół: różowy skaleń, szary kwarc i czarna mika. Niektóre z tych ziaren zawierają odrobinę uranu.',
      sci: 'Przecięta ściana granitu: różowy skaleń potasowy, szary kwarc, czarny biotyt. Uran siedzi w nim głównie w maleńkich minerałach akcesorycznych (cyrkon, monacyt, uraninit) oraz na brzegach ziaren i w spękaniach.',
    },
    grain: {
      label: 'Wewnątrz ziaren',
      title: 'Kopniak, który uwalnia radon',
      labels: { feldspar: 'skaleń', quartz: 'kwarc', pore: 'por', water: 'woda', nm: '{n} nm' },
      hints: {
        radium: 'Dotknij zielonego atomu radu',
        again: 'Dotknij atomu radu jeszcze raz',
        water: 'Dotknij zakraplacza, żeby zwilżyć por',
        deeper: 'Dotknij różowego ziarna głębiej',
        board: 'Dotknij tablicy, żeby zrobić 20 prób',
        more: 'Dotknij radu, różowego ziarna albo zakraplacza',
      },
      buttons: { one: 'Rozbij jeden atom radu', twenty: '20 prób', water: 'Dodaj wody', dry: 'Osusz por' },
      sliders: { depth: 'Rad pod powierzchnią', water: 'Woda w porze' },
      board: {
        title: 'Ostatnie 20 prób',
        free: 'wolny w porze',
        stuck: 'utknął w swoim ziarnie',
        buried: 'wbity w sąsiada',
        share: 'wolne: {n} z {m}',
        none: 'Jeszcze nie było prób',
      },
      says: {
        free: {
          kid: 'Wolny! Woda w porze zatrzymała mnie, zanim wbiłem się w sąsiednie ziarno. Teraz mogę wywędrować ze skały.',
          sci: 'Zatrzymany w wodzie w porze, gdzie jego zasięg to około 100 nm: uwolniony do przestrzeni porów, może swobodnie dyfundować.',
        },
        stuck: {
          kid: 'Utknąłem! Urodziłem się za głęboko i zatrzymałem się we własnym krysztale. Tutaj się rozpadnę.',
          sci: 'Odrzut skończył się wewnątrz skalenia: droga do powierzchni była dłuższa niż zasięg (w tym modelu 40 nm).',
        },
        buried: {
          kid: 'Fiuu! Przeleciałem przez suchą szczelinę i wbiłem się w kwarc. W suchym porze nic mnie nie zatrzyma.',
          sci: 'Przeleciał przez suchy por (jego zasięg w powietrzu to około 63 µm, dużo więcej niż ta szczelina) i wbił się w kwarc naprzeciwko.',
        },
        freeAgain: { kid: 'Znowu wolny!', sci: 'Uwolniony do poru.' },
        stuckAgain: { kid: 'Utknąłem w swoim ziarnie.', sci: 'Zatrzymany we własnym ziarnie.' },
        buriedAgain: { kid: 'Wbity w sąsiada.', sci: 'Wbity w sąsiednie ziarno.' },
        moved: {
          kid: 'Atom radu {n} nm pod powierzchnią. Dotknij go!',
          sci: 'Rad {n} nm pod powierzchnią ziarna.',
        },
        deep: {
          kid: 'To jest pod przerywaną linią: urodzony tak głęboko, nigdy nie dotrę do powierzchni.',
          sci: 'Głębiej niż zasięg odrzutu: żaden kierunek nie prowadzi na zewnątrz.',
        },
        wet: {
          kid: 'Teraz do różowego ziarna przylega warstewka wody.',
          sci: 'Warstewka wody na skaleniu: odrzut przebiega w wodzie około 100 nm, a w powietrzu jakieś 63 µm, więc warstewka może go złapać.',
        },
        full: { kid: 'Por jest pełen wody.', sci: 'Por jest nasycony wodą.' },
        dry: { kid: 'Por wysechł.', sci: 'Por znowu jest suchy.' },
        twenty: {
          kid: 'Wolnych: {n} z 20. Spróbuj innej głębokości albo więcej wody!',
          sci: 'Uwolnionych {n} z 20: współczynnik emanacji {m} % dla radu na tej głębokości i przy tej wilgotności.',
        },
      },
      panel: {
        kid: [
          'To lupa z obrazu, tylko olbrzymia: brzeg ziarna różowego skalenia na dole i ziarna szarego kwarcu na górze, a między nimi malutka szczelina, por. Kropki to ich atomy. Zielony to rad.',
          'Kiedy rad się rozpada, wystrzeliwuje cząstkę alfa, a nowy atom radonu zostaje odrzucony w drugą stronę, jak armata, która odskakuje przy strzale. Leci tylko maleńki kawałek: urodzony głęboko, zatrzymuje się we własnym ziarnie; przez suchą szczelinę wbija się w ziarno naprzeciwko. Woda w szczelinie łagodnie go zatrzymuje i wtedy może swobodnie wywędrować.',
        ],
        sci: [
          'Ra-226 rozpada się przez emisję alfa (Q około 4,87 MeV). Pęd dzieli się po równo, energia nie: cząstka alfa unosi około 4,78 MeV i przebiega w minerale jakieś 20 µm, a Rn-222 odskakuje z energią około 86 keV i zatrzymuje się po kilkudziesięciu nanometrach. Zwykle podawane zasięgi to 20 do 70 nm w minerałach, około 100 nm w wodzie i około 63 µm w powietrzu. Model przyjmuje 40 nm w obu kryształach; 1 m w lupie to 60 nm.',
          'Ziarno mogą opuścić tylko atomy urodzone w odległości jednego zasięgu odrzutu od powierzchni i skierowane na zewnątrz. W wąskim suchym porze przelatują i wbijają się w następne ziarno; woda w porach je zatrzymuje, dlatego wilgotna skała i gleba uwalniają więcej radonu. Prawdziwe ziarna są tysiące razy większe od pokazanego fragmentu, więc radon wypuszcza rad leżący blisko powierzchni: w powłokach na ziarnach, wzdłuż drobnych spękań, w drobnej glinie. Uwalniany ułamek, współczynnik emanacji, wynosi od kilku procent do ponad połowy.',
        ],
      },
    },
    soil: {
      label: 'Kolumna gleby',
      title: 'Jak daleko dociera radon',
      labels: { air: 'powietrze', granite: 'granit', m: '{n} m', day: 'dzień {n}' },
      hints: {
        level: 'Dotknij jakiegoś poziomu kolumny',
        deeper: 'Dotknij głębszego poziomu',
        rain: 'Dotknij chmury deszczowej',
        wet: 'Dotknij poziomu w mokrej glebie',
        dry: 'Dotknij chmury, żeby osuszyć glebę',
      },
      buttons: { release: 'Wypuść tu radon', rain: 'Deszcz', dry: 'Osusz glebę' },
      slider: 'Głębokość, na której go wypuścić',
      board: { title: 'Dotarło do powietrza, z 20', dry: 'sucha gleba', wet: 'mokra gleba' },
      says: {
        release: {
          kid: 'Dwadzieścia atomów radonu, urodzonych {d} pod ziemią. Patrz, jak wędrują!',
          sci: 'Dwadzieścia atomów Rn-222 wypuszczonych na głębokości {d}. Każdy błądzi losowo i rozpada się we własnej, losowej chwili (średni czas życia 5,5 dnia, przyspieszony).',
        },
        done: {
          kid: 'W powietrzu: {n} z 20. Pozostałe rozpadły się w glebie i zmieniły w polon, ciało stałe: to bursztynowe kropki.',
          sci: 'Na powierzchni: {n} z 20; reszta rozpadła się pod ziemią do Po-218, który zostaje na ziarnach gleby.',
        },
        rain: {
          kid: 'Deszcz! Woda wypełnia przerwy między ziarnami gleby. W wodzie rozchodzę się mniej więcej dziesięć tysięcy razy wolniej niż w powietrzu.',
          sci: 'Pory wypełniają się wodą. Radon dyfunduje w wodzie około 10⁴ razy wolniej niż w powietrzu, więc jego droga dyfuzji maleje (w tym modelu 0,3 m).',
        },
        dry: {
          kid: 'Słońce i wiatr znowu osuszają glebę.',
          sci: 'Gleba ocieka i wysycha; droga dyfuzji wraca do 1,5 m.',
        },
      },
      panel: {
        kid: [
          'Radon, który wydostał się z ziaren, wędruje przerwami w glebie, zygzakiem, na chybił trafił. Ale nie ma wiele czasu: każdy atom radonu rozpada się we własnej, losowej chwili, połowa z nich w ciągu około czterech dni. Wtedy zmienia się w polon, ciało stałe, i zostaje tam, gdzie jest (bursztynowe kropki).',
          'Wypuszczaj radon na różnych głębokościach i patrz, ile atomów dociera do powietrza: spod samej powierzchni większość, z trzech metrów tylko kilka. Po deszczu przerwy wypełniają się wodą, radon pełznie w niej bardzo wolno i wydostaje się jeszcze mniej.',
        ],
        sci: [
          'Rn-222 ma okres półtrwania 3,82 dnia (λ = 2,1 × 10⁻⁶ na sekundę, średni czas życia 5,5 dnia). W tym czasie dyfunduje na typową odległość L = √(D/λ), swoją drogę dyfuzji: około 2,3 m w powietrzu (D około 1,1 × 10⁻⁵ m²/s), zwykle 1 do 2 m w suchej glebie, około 2 cm w wodzie (D około 1,1 × 10⁻⁹ m²/s). Kolumna przyjmuje L = 1,5 m dla suchej i 0,3 m dla mokrej gleby; około 2 s w tej sali to jeden dzień.',
          'Ze źródła na głębokości z do powierzchni dociera ułamek proporcjonalny do e^(−z/L): przy L = 1,5 m około 70 % z 0,5 m, około 14 % z 3 m. Dlatego większość radonu, który trafia do powietrza, pochodzi z górnego metra lub dwóch gleby. Wiatr i zmiany ciśnienia powietrza też pompują gaz glebowy do środka i na zewnątrz, czego kolumna nie pokazuje.',
        ],
      },
    },
    family: {
      label: 'Rodzina uranu',
      title: 'Jedyny gaz w rodzinie',
      hints: { atom: 'Dotknij atomu na schodach', radon: 'Dotknij unoszącego się turkusowego atomu', more: 'Dotknij innego atomu' },
      buttons: { top: 'Uran-238, na górze', radon: 'Radon-222, gaz', end: 'Ołów-206, koniec' },
      state: { solid: 'ciało stałe', gas: 'gaz' },
      hl: ['4,47 miliarda lat', '24 dni', '1,2 minuty', '245 500 lat', '75 400 lat', '1600 lat', '3,8 dnia', '3,1 minuty', '27 minut', '20 minut', '164 mikrosekundy', '22 lata', '5 dni', '138 dni', 'trwały'],
      kid: [
        'Uran-238, głowa rodziny. Połowa jego atomów zmienia się dopiero po 4,47 miliarda lat, mniej więcej w wieku Ziemi. Metal, ciało stałe.',
        'Tor-234, metal, ciało stałe. Połowa znika w ciągu 24 dni.',
        'Protaktyn-234m, metal, ciało stałe, który trwa tylko minutę albo dwie.',
        'Uran-234: znowu uran! Metal, ciało stałe. Połowa zmienia się w ciągu około 245 000 lat.',
        'Tor-230, metal, ciało stałe. Połowa zmienia się w ciągu około 75 000 lat.',
        'Rad-226, moja mama! Metal, ciało stałe, odkryty przez Marię Skłodowską-Curie i Pierre’a Curie w 1898 roku. Każdy atom radu, który się rozpada, daje atom radonu.',
        'To ja, radon-222: jedyny gaz w całej rodzinie! Połowa z nas rozpada się w niecałe cztery dni.',
        'Polon-218, moja córka: znowu ciało stałe. Trwa około trzech minut. Maria i Pierre Curie nazwali polon na cześć Polski, ojczyzny Marii.',
        'Ołów-214, metal, ciało stałe. Połowa zmienia się w ciągu około 27 minut.',
        'Bizmut-214, metal, ciało stałe. Połowa zmienia się w ciągu około 20 minut.',
        'Polon-214, ciało stałe, które trwa krócej niż mrugnięcie oka: 164 milionowe części sekundy!',
        'Ołów-210, metal, ciało stałe. Połowa zmienia się w ciągu około 22 lat.',
        'Bizmut-210, metal, ciało stałe. Połowa zmienia się w ciągu 5 dni.',
        'Polon-210, metal, ciało stałe. Połowa zmienia się w ciągu 138 dni.',
        'Ołów-206: sam dół schodów. Już nigdy się nie zmieni.',
      ],
      sci: {
        line: '{name}: {state}, okres półtrwania {hl}; rozpad {mode} do {next}.',
        alpha: 'alfa',
        beta: 'beta',
        rn: 'Radon-222: jedyny gaz w szeregu (wrze w −61,7 °C), okres półtrwania 3,82 dnia; rozpad alfa do Po-218.',
        end: 'Ołów-206: ciało stałe, trwały, koniec szeregu.',
        pa: 'Pa-234m to stan wzbudzony jądra; stan podstawowy, Pa-234, żyje 6,7 godziny.',
      },
      forge: 'Kuźnia Atomów: zobacz, jak jądro schodzi po całych schodach',
      panel: {
        kid: [
          'Uran-238 to głowa rodziny. Bardzo, bardzo powoli zmienia się w tor, potem w protaktyn i tak dalej w dół po schodach, w sumie czternaście stopni, aż stanie się ołowiem-206, który już nigdy się nie zmienia. Duży stopień w dół to rozpad alfa: atom wyrzuca dwa protony i dwa neutrony. Mały stopień to rozpad beta: neutron w środku zmienia się w proton i wylatuje elektron.',
          'Każdy członek rodziny jest metalem i ciałem stałym, z wyjątkiem jednego: radonu, który jest gazem. Dlatego to radon może opuścić skałę. Dotykaj atomów, żeby je poznać.',
        ],
        sci: [
          'Szereg uranu-238: 8 rozpadów alfa i 6 rozpadów beta minus od U-238 (4,47 miliarda lat) do trwałego Pb-206, przez Th-234 (24,1 d), Pa-234m (1,16 min), U-234 (245 500 lat), Th-230 (75 400 lat), Ra-226 (1600 lat), Rn-222 (3,82 d), Po-218 (3,10 min), Pb-214 (27 min), Bi-214 (19,9 min), Po-214 (164 µs), Pb-210 (22,2 roku), Bi-210 (5,0 d) i Po-210 (138 d). Małe odgałęzienia pominięto.',
          'W skale nienaruszonej od miliona lat lub dłużej szereg jest w równowadze wiekowej: każdy jego członek rozpada się w tempie samego U-238, około 12 400 rozpadów na sekundę na gram, więc każdy gram uranu stale wytwarza radon w tym tempie. Radon jest jedynym członkiem, który jest gazem, więc tylko on może opuścić minerał; kiedy się rozpadnie, jego córki znów są ciałami stałymi.',
        ],
      },
    },
  },
  de: {
    title: 'Ein Granithang in der Abenddämmerung',
    greet: {
      kid: 'Wir sind im Bild: auf einem Granithang in der Serra da Estrela in der Abenddämmerung! Diese Felsen atmen Radon aus, und Radon bin ich. Lass in der Riesenlupe ein Radiumatom zerfallen, lass Radon die Bodensäule hinaufwandern und lerne meine Familie auf der Treppe im Himmel kennen. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Die Serra da Estrela in der Abenddämmerung: Granit mit einigen Gramm Uran pro Tonne. Drei Dinge zum Ausprobieren: der Rückstoß, der Radon aus einem Korn befreit, seine Diffusion durch den Boden nach oben und sein Platz in der Uran-238-Reihe. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Granit besteht aus Körnern: rosa Feldspat, grauem Quarz und schwarzem Glimmer. Schau dir die aufgeschnittene Seite des großen Felsbrockens an!',
        'In jeder Tonne Granit stecken ein paar Gramm Uran. Das reicht, um ständig Radon zu machen, Milliarden Jahre lang.',
        'Wenn ich geboren werde, bekomme ich einen Tritt! Ein Radiumatom zerfällt: Das Alphateilchen fliegt in die eine Richtung und ich in die andere.',
        'Das meiste Radon kommt nie aus dem Stein heraus. Nur Radon, das nah am Rand eines Korns entsteht, kommt raus, und Wasser im Spalt hilft dabei.',
        'Hier draußen verteilt mich der Wind so dünn, dass es keine Rolle spielt. Häuser auf Granit sind die Orte, die man lüften sollte.',
      ],
      sci: [
        'Granit enthält im Mittel einige Gramm Uran pro Tonne. Die Granite im Norden und in der Mitte Portugals ergeben die höchsten Radonwerte in Innenräumen des Landes.',
        'Ra-226 zerfällt mit etwa 4,87 MeV: Das Alphateilchen nimmt 4,78 MeV mit, das Rn-222 bekommt durch den Rückstoß etwa 86 keV, 4/226 der Energie, weil beide den Impuls gleich aufteilen.',
        'Übliche Rückstoßreichweiten: 20 bis 70 nm in Mineralen, etwa 100 nm in Wasser, etwa 63 µm in Luft. Eine trockene Pore, die breiter ist als dieser letzte Wert, kann Radon auch stoppen.',
        'Diffusionslänge L = √(D/λ), mit λ = 2,1 × 10⁻⁶ pro Sekunde: etwa 2,3 m in Luft, etwa 2 cm in Wasser, typisch 1 bis 2 m im Boden.',
        'Die Außenluft enthält im Mittel etwa 10 Bq/m³ Radon. In geschlossenen Räumen nah am Boden sammelt es sich.',
      ],
    },
    face: {
      kid: 'Das ist der Felsbrocken aus dem Bild, aufgeschnitten: rosa Feldspat, grauer Quarz und schwarzer Glimmer. Manche dieser Körner enthalten ein wenig Uran.',
      sci: 'Eine Schnittfläche von Granit: rosa Kalifeldspat, grauer Quarz, schwarzer Biotit. Sein Uran steckt vor allem in winzigen Nebengemengteilen (Zirkon, Monazit, Uraninit) und entlang von Korngrenzen und Rissen.',
    },
    grain: {
      label: 'In den Körnern',
      title: 'Der Tritt, der Radon befreit',
      labels: { feldspar: 'Feldspat', quartz: 'Quarz', pore: 'Pore', water: 'Wasser', nm: '{n} nm' },
      hints: {
        radium: 'Tippe das grüne Radiumatom an',
        again: 'Tippe das Radiumatom noch einmal an',
        water: 'Tippe die Pipette an, um die Pore zu befeuchten',
        deeper: 'Tippe tiefer in das rosa Korn',
        board: 'Tippe die Tafel an für 20 Versuche',
        more: 'Tippe das Radium, das rosa Korn oder die Pipette an',
      },
      buttons: { one: 'Ein Radiumatom zerfallen lassen', twenty: '20 Versuche', water: 'Wasser dazu', dry: 'Pore trocknen' },
      sliders: { depth: 'Radium unter der Oberfläche', water: 'Wasser in der Pore' },
      board: {
        title: 'Die letzten 20 Versuche',
        free: 'frei in der Pore',
        stuck: 'steckt im eigenen Korn',
        buried: 'im Nachbarkorn vergraben',
        share: 'frei: {n} von {m}',
        none: 'Noch keine Versuche',
      },
      says: {
        free: {
          kid: 'Frei! Das Wasser in der Pore hat mich gebremst, bevor ich ins Nachbarkorn krachen konnte. Jetzt kann ich aus dem Stein hinauswandern.',
          sci: 'Im Porenwasser gestoppt, wo seine Reichweite etwa 100 nm beträgt: in den Porenraum freigesetzt, frei zu diffundieren.',
        },
        stuck: {
          kid: 'Stecken geblieben! Ich bin zu tief entstanden und in meinem eigenen Kristall stehen geblieben. Hier werde ich zerfallen.',
          sci: 'Der Rückstoß endete im Feldspat: Der Weg zur Oberfläche war länger als die Reichweite (in diesem Modell 40 nm).',
        },
        buried: {
          kid: 'Wusch! Ich bin quer über den trockenen Spalt geflogen und habe mich in den Quarz gebohrt. In einer trockenen Pore hält mich nichts auf.',
          sci: 'Es hat die trockene Pore durchquert (seine Reichweite in Luft beträgt etwa 63 µm, viel mehr als dieser Spalt) und sich im gegenüberliegenden Quarz festgesetzt.',
        },
        freeAgain: { kid: 'Wieder frei!', sci: 'In die Pore freigesetzt.' },
        stuckAgain: { kid: 'Ich stecke im eigenen Korn.', sci: 'Im eigenen Korn gestoppt.' },
        buriedAgain: { kid: 'Im Nachbarkorn vergraben.', sci: 'Im Nachbarkorn implantiert.' },
        moved: {
          kid: 'Ein Radiumatom {n} nm unter der Oberfläche. Tippe es an!',
          sci: 'Radium {n} nm unter der Kornoberfläche.',
        },
        deep: {
          kid: 'Das liegt unter der gestrichelten Linie: So tief geboren, komme ich nie an die Oberfläche.',
          sci: 'Tiefer als die Rückstoßreichweite: Keine Richtung führt hinaus.',
        },
        wet: {
          kid: 'Jetzt klebt ein Wasserfilm am rosa Korn.',
          sci: 'Ein Wasserfilm auf dem Feldspat: Ein Rückstoß läuft in Wasser etwa 100 nm weit, in Luft rund 63 µm, also kann der Film ihn auffangen.',
        },
        full: { kid: 'Die Pore ist voller Wasser.', sci: 'Die Pore ist wassergesättigt.' },
        dry: { kid: 'Die Pore ist ausgetrocknet.', sci: 'Die Pore ist wieder trocken.' },
        twenty: {
          kid: 'Frei: {n} von 20. Probier eine andere Tiefe oder mehr Wasser!',
          sci: '{n} von 20 freigesetzt: ein Emanationsanteil von {m} % für Radium in dieser Tiefe und Feuchte.',
        },
      },
      panel: {
        kid: [
          'Das ist die Lupe aus dem Bild, riesengroß: der Rand eines rosa Feldspatkorns unten und eines grauen Quarzkorns oben, dazwischen ein winziger Spalt, eine Pore. Die Punkte sind ihre Atome. Das grüne ist Radium.',
          'Wenn Radium zerfällt, schießt es ein Alphateilchen heraus, und das neue Radonatom wird in die andere Richtung gestoßen, wie eine Kanone, die beim Schuss zurückspringt. Es fliegt nur ein winziges Stück: Tief geboren, bleibt es im eigenen Korn stecken; über einen trockenen Spalt kracht es ins Korn gegenüber. Wasser im Spalt bremst es sanft, und dann kann es frei hinauswandern.',
        ],
        sci: [
          'Ra-226 zerfällt durch Alphaemission (Q etwa 4,87 MeV). Der Impuls wird gleich aufgeteilt, die Energie nicht: Das Alphateilchen nimmt etwa 4,78 MeV mit und läuft rund 20 µm durch das Mineral, während das Rn-222 mit etwa 86 keV zurückgestoßen wird und nach wenigen zehn Nanometern stehen bleibt. Übliche Reichweiten sind 20 bis 70 nm in Mineralen, etwa 100 nm in Wasser und etwa 63 µm in Luft. Das Modell nimmt 40 nm in beiden Kristallen; 1 m in der Lupe sind 60 nm.',
          'Nur Atome, die weniger als eine Rückstoßreichweite von einer Oberfläche entfernt entstehen und nach außen zielen, können das Korn verlassen. In einer engen trockenen Pore fliegen sie hinüber und setzen sich im nächsten Korn fest; Porenwasser stoppt sie, darum geben feuchter Fels und Boden mehr Radon ab. Echte Körner sind tausendmal größer als der gezeigte Ausschnitt, deshalb lässt vor allem Radium nahe an Oberflächen Radon frei: in Überzügen auf Körnern, entlang feiner Risse, in feinem Ton. Der freigesetzte Anteil, der Emanationskoeffizient, reicht von wenigen Prozent bis über die Hälfte.',
        ],
      },
    },
    soil: {
      label: 'Die Bodensäule',
      title: 'Wie weit Radon kommt',
      labels: { air: 'Luft', granite: 'Granit', m: '{n} m', day: 'Tag {n}' },
      hints: {
        level: 'Tippe eine Höhe der Säule an',
        deeper: 'Tippe eine tiefere Stelle an',
        rain: 'Tippe die Regenwolke an',
        wet: 'Tippe eine Höhe im nassen Boden an',
        dry: 'Tippe die Wolke an, um den Boden zu trocknen',
      },
      buttons: { release: 'Hier Radon freisetzen', rain: 'Regen', dry: 'Boden trocknen' },
      slider: 'Tiefe zum Freisetzen',
      board: { title: 'In der Luft angekommen, von 20', dry: 'trockener Boden', wet: 'nasser Boden' },
      says: {
        release: {
          kid: 'Zwanzig Radonatome, geboren {d} tief. Sieh zu, wie sie wandern!',
          sci: 'Zwanzig Rn-222-Atome, freigesetzt in {d} Tiefe. Jedes macht eine Zufallsbewegung und zerfällt in seinem eigenen zufälligen Moment (mittlere Lebensdauer 5,5 Tage, beschleunigt).',
        },
        done: {
          kid: 'In der Luft angekommen: {n} von 20. Die anderen sind im Boden zerfallen und zu Polonium geworden, einem Feststoff: die bernsteinfarbenen Punkte.',
          sci: 'An der Oberfläche: {n} von 20; der Rest zerfiel unter der Erde zu Po-218, das an den Bodenkörnern haften bleibt.',
        },
        rain: {
          kid: 'Regen! Wasser füllt die Lücken zwischen den Bodenkörnern. In Wasser breite ich mich etwa zehntausendmal langsamer aus als in Luft.',
          sci: 'Die Poren füllen sich mit Wasser. Radon diffundiert in Wasser etwa 10⁴-mal langsamer als in Luft, also schrumpft seine Diffusionslänge (in diesem Modell 0,3 m).',
        },
        dry: {
          kid: 'Sonne und Wind trocknen den Boden wieder.',
          sci: 'Der Boden läuft ab und trocknet; die Diffusionslänge ist wieder 1,5 m.',
        },
      },
      panel: {
        kid: [
          'Radon, das aus den Körnern herauskommt, wandert durch die Lücken im Boden, im Zickzack, ganz zufällig. Aber es hat nicht lange Zeit: Jedes Radonatom zerfällt in seinem eigenen zufälligen Moment, die Hälfte innerhalb von etwa vier Tagen. Dann wird es zu Polonium, einem Feststoff, und bleibt, wo es ist (die bernsteinfarbenen Punkte).',
          'Setze Radon in verschiedenen Tiefen frei und schau, wie viele Atome die Luft erreichen: von knapp unter der Oberfläche die meisten, aus drei Metern Tiefe nur wenige. Nach Regen füllen sich die Lücken mit Wasser, Radon kriecht darin sehr langsam, und es kommen noch weniger heraus.',
        ],
        sci: [
          'Rn-222 hat eine Halbwertszeit von 3,82 Tagen (λ = 2,1 × 10⁻⁶ pro Sekunde, mittlere Lebensdauer 5,5 Tage). In dieser Zeit diffundiert es eine typische Strecke L = √(D/λ), seine Diffusionslänge: etwa 2,3 m in freier Luft (D etwa 1,1 × 10⁻⁵ m²/s), typisch 1 bis 2 m in trockenem Boden, etwa 2 cm in Wasser (D etwa 1,1 × 10⁻⁹ m²/s). Die Säule rechnet mit L = 1,5 m trocken und 0,3 m nass; etwa 2 s im Raum sind ein Tag.',
          'Von einer Quelle in der Tiefe z erreicht ein Anteil wie e^(−z/L) die Oberfläche: mit L = 1,5 m etwa 70 % aus 0,5 m, etwa 14 % aus 3 m. Darum stammt das meiste Radon, das in die Luft gelangt, aus dem obersten Meter oder zwei des Bodens. Wind und Luftdruckschwankungen pumpen Bodenluft zusätzlich hinein und heraus, was die Säule weglässt.',
        ],
      },
    },
    family: {
      label: 'Die Uranfamilie',
      title: 'Das einzige Gas der Familie',
      hints: { atom: 'Tippe ein Atom auf der Treppe an', radon: 'Tippe das schwebende türkise Atom an', more: 'Tippe ein anderes Atom an' },
      buttons: { top: 'Uran-238, ganz oben', radon: 'Radon-222, das Gas', end: 'Blei-206, das Ende' },
      state: { solid: 'fest', gas: 'gasförmig' },
      hl: ['4,47 Milliarden Jahre', '24 Tage', '1,2 Minuten', '245 500 Jahre', '75 400 Jahre', '1600 Jahre', '3,8 Tage', '3,1 Minuten', '27 Minuten', '20 Minuten', '164 Mikrosekunden', '22 Jahre', '5 Tage', '138 Tage', 'stabil'],
      kid: [
        'Uran-238, das Oberhaupt der Familie. Die Hälfte davon verwandelt sich erst nach 4,47 Milliarden Jahren, ungefähr dem Alter der Erde. Ein festes Metall.',
        'Thorium-234, ein festes Metall. Die Hälfte ist in 24 Tagen weg.',
        'Protactinium-234m, ein festes Metall, das nur ein, zwei Minuten hält.',
        'Uran-234: wieder Uran! Ein festes Metall. Die Hälfte verwandelt sich in etwa 245 000 Jahren.',
        'Thorium-230, ein festes Metall. Die Hälfte verwandelt sich in etwa 75 000 Jahren.',
        'Radium-226, meine Mutter! Ein festes Metall, 1898 von Marie und Pierre Curie entdeckt. Jedes Radiumatom, das zerfällt, macht ein Radonatom.',
        'Das bin ich, Radon-222: das einzige Gas in der ganzen Familie! Die Hälfte von uns zerfällt in weniger als vier Tagen.',
        'Polonium-218, meine Tochter: wieder ein Feststoff. Es hält etwa drei Minuten. Marie und Pierre Curie haben das Polonium nach Polen benannt, Maries Heimat.',
        'Blei-214, ein festes Metall. Die Hälfte verwandelt sich in etwa 27 Minuten.',
        'Bismut-214, ein festes Metall. Die Hälfte verwandelt sich in etwa 20 Minuten.',
        'Polonium-214, ein Feststoff, der kürzer hält als ein Wimpernschlag: 164 Millionstel einer Sekunde!',
        'Blei-210, ein festes Metall. Die Hälfte verwandelt sich in etwa 22 Jahren.',
        'Bismut-210, ein festes Metall. Die Hälfte verwandelt sich in 5 Tagen.',
        'Polonium-210, ein festes Metall. Die Hälfte verwandelt sich in 138 Tagen.',
        'Blei-206: das Ende der Treppe. Es verwandelt sich nie wieder.',
      ],
      sci: {
        line: '{name}: {state}, Halbwertszeit {hl}; {mode} zu {next}.',
        alpha: 'Alphazerfall',
        beta: 'Betazerfall',
        rn: 'Radon-222: das einzige Gas der Reihe (es siedet bei −61,7 °C), Halbwertszeit 3,82 Tage; Alphazerfall zu Po-218.',
        end: 'Blei-206: fest und stabil, das Ende der Reihe.',
        pa: 'Pa-234m ist ein angeregter Zustand des Kerns; der Grundzustand, Pa-234, lebt 6,7 Stunden.',
      },
      forge: 'Die Atomschmiede: sieh zu, wie ein Kern die ganze Treppe hinuntergeht',
      panel: {
        kid: [
          'Uran-238 ist das Oberhaupt einer Familie. Ganz, ganz langsam verwandelt es sich in Thorium, dann in Protactinium und so weiter die Treppe hinunter, vierzehn Stufen insgesamt, bis es zu Blei-206 wird, das sich nie mehr verwandelt. Eine große Stufe hinunter ist ein Alphazerfall: Das Atom wirft zwei Protonen und zwei Neutronen hinaus. Eine kleine Stufe ist ein Betazerfall: Ein Neutron im Inneren wird zu einem Proton, und ein Elektron fliegt heraus.',
          'Jedes Mitglied der Familie ist ein festes Metall, bis auf eines: Radon, ein Gas. Darum ist Radon dasjenige, das den Stein verlassen kann. Tippe die Atome an, um sie kennenzulernen.',
        ],
        sci: [
          'Die Uran-238-Reihe: 8 Alpha- und 6 Beta-minus-Zerfälle von U-238 (4,47 Milliarden Jahre) bis zum stabilen Pb-206, über Th-234 (24,1 d), Pa-234m (1,16 min), U-234 (245 500 a), Th-230 (75 400 a), Ra-226 (1600 a), Rn-222 (3,82 d), Po-218 (3,10 min), Pb-214 (27 min), Bi-214 (19,9 min), Po-214 (164 µs), Pb-210 (22,2 a), Bi-210 (5,0 d) und Po-210 (138 d). Kleine Seitenzweige sind weggelassen.',
          'In einem Gestein, das eine Million Jahre oder länger ungestört war, ist die Kette im säkularen Gleichgewicht: Jedes Glied zerfällt im Takt von U-238 selbst, etwa 12 400 Zerfälle pro Sekunde und Gramm, also macht jedes Gramm Uran in diesem Takt ständig Radon. Radon ist das einzige Glied, das ein Gas ist, darum kann es als einziges das Mineral verlassen; wenn es zerfällt, sind seine Töchter wieder Feststoffe.',
        ],
      },
    },
  },
}
