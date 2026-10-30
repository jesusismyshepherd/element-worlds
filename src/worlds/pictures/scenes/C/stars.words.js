// The words of carbon's red giant ("Made inside a giant star"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/C.js (the
// easel shows it). Each step is done by tapping its thing: `hints` are what the prompt shows as the next
// step, `verbs` the panels' buttons that do the same. `signs` and `levels` are drawn in 3D (plain text: no
// superscripts or subscripts, "carbon-12" not ¹²C); {placeholders} are filled in by the scene.
// Sources: Be-8's half-life 8.19e-17 s (src/data/nuclides.json, NUBASE); the Hoyle state at 7.654 MeV, 0+;
// Dunbar, Pixley, Wenzel and Whaling, Phys. Rev. 92, 649 (1953): 7.68 ± 0.03 MeV; Hoyle, Dunbar, Wenzel and
// Whaling, Phys. Rev. 92, 1095 (1953); the Nobel Prize in Physics 1983 (Chandrasekhar, Fowler); H. Kragh,
// "An anthropic myth: Fred Hoyle's carbon-12 resonance level", Arch. Hist. Exact Sci. 64 (2010).
export const STARS_WORDS = {
  en: {
    title: 'Beside a red giant',
    greet: {
      kid: 'Hello! I am carbon, and this is where carbon is born: beside a red giant star. The lens shows its core, where helium turns into carbon. Three things to try, and the picture’s story is on the easel.',
      sci: 'Welcome to a red giant. In its core, at about 100 million kelvin, helium-4 fuses into carbon-12 by the triple-alpha process. Three stations: the catch, Hoyle’s resonance and the star’s end. The picture’s story is on the easel.',
    },
    talk: {
      kid: [
        'Every carbon atom, the ones in you too, was made inside a star. Three helium nuclei had to crash together at almost the same moment!',
        'A helium nucleus is two protons and two neutrons. Scientists call it an alpha particle, so making carbon from three of them is called the triple-alpha process.',
        'Red giants are huge: a hundred times wider than the Sun, or more. One day, in about 5 billion years, our Sun will become one too.',
      ],
      sci: [
        'A Sun-like star burns helium in its core for about 100 million years. The energy freed, 7.275 MeV for every carbon-12 made, keeps the giant shining.',
        'Carbon-12 is also chemistry’s yardstick: the dalton (atomic mass unit) is one twelfth of a carbon-12 atom’s mass, and until 2019 the mole was the number of atoms in 12 g of it.',
        'Burning helium also turns some carbon into oxygen (¹²C + ⁴He → ¹⁶O + γ). How fast that goes is still not well measured, and it sets how much carbon and oxygen stars leave behind.',
      ],
    },
    catch: {
      label: 'The triple-alpha catch',
      title: 'Three heliums make a carbon',
      hints: { fire: 'Tap the lens to make two heliums collide', third: 'Quick, tap again to send the third helium', watch: 'Watch the core' },
      verbs: { fire: 'Two heliums collide', third: 'Send the third helium' },
      made: 'Carbon made',
      lost: 'Broke apart',
      rows: [
        ['Beryllium-8 half-life', '8.2 × 10⁻¹⁷ s (82 attoseconds)'],
        ['3 ⁴He → ¹²C frees', '7.275 MeV'],
        ['Core', 'about 10⁸ K, 10⁵ g/cm³'],
      ],
      signs: {
        core: { kid: 'Inside the core: 100 million degrees', sci: 'The core: about 100 million K, burning helium' },
        be8: { kid: 'beryllium-8!', sci: 'beryllium-8' },
        broke: { kid: 'broke apart!', sci: 'beryllium-8 decayed: 2 helium-4' },
        c12: { kid: 'carbon-12!', sci: 'carbon-12 + gamma rays' },
        clock: 'beryllium-8 alive: {t} as',
        half: 'half-life: {t} as',
        scale: '1 s here = 100 as',
        tally: 'carbon made: {made}    broke apart: {lost}',
      },
      says: {
        fire: {
          kid: 'Here come two helium nuclei! When they join, tap again, quickly.',
          sci: '⁴He + ⁴He → ⁸Be. Beryllium-8 is unbound by 92 keV: tap again as soon as it forms.',
        },
        early: { kid: 'Not yet! Wait until the two join.', sci: 'No beryllium-8 yet: wait for the two to meet.' },
        made: {
          kid: 'You did it! Three heliums became one carbon-12, and it shone out gamma rays. All the carbon there is was made like this.',
          sci: '⁸Be + ⁴He → ¹²C*, the Hoyle state, which here settles into carbon-12 by giving off gamma rays. In a real core only a few in 10 000 settle; the rest break up again.',
        },
        late: { kid: 'Too late! The beryllium-8 broke apart just before the third helium got there.', sci: 'The ⁸Be decayed into two alphas before the third one reached it.' },
        lost: { kid: 'Oops, it broke apart! Beryllium-8 lasts only a tiny moment. Tap the lens to try again.', sci: '⁸Be → 2 ⁴He, half-life 82 attoseconds. Tap the lens to try again.' },
      },
      panel: {
        kid: [
          'Deep inside a giant star it is about 100 million degrees, and helium nuclei race about and crash into each other. Two of them can join into beryllium-8, but it falls apart again almost at once.',
          'To make carbon, a third helium nucleus must hit the beryllium-8 in that tiny moment. Tap the lens to make two collide, then tap again quickly to send the third. Sometimes it breaks before you can: nobody can tell when it will.',
        ],
        sci: [
          'The triple-alpha process: ⁴He + ⁴He ⇌ ⁸Be. Beryllium-8 is unbound by 92 keV and decays back into two alphas with a half-life of 8.2 × 10⁻¹⁷ s (82 attoseconds). In a helium-burning core at about 10⁸ K and 10⁵ g/cm³, only about one helium nucleus in a billion is in a beryllium-8 at any moment.',
          'A third alpha must arrive within that lifetime: ⁸Be + ⁴He → ¹²C, in all 3 ⁴He → ¹²C + 7.275 MeV. Here time runs 10¹⁶ times slower (1 s = 100 as) and distances are not to scale; each beryllium-8 lives a time drawn from its real exponential decay, so it may break at any moment.',
        ],
      },
    },
    hoyle: {
      label: 'Hoyle’s ladder',
      title: 'Hoyle’s resonance',
      slider: 'Energy of the incoming helium',
      energy: '{e} keV',
      energySci: '{e} keV ({total} MeV in carbon-12)',
      verbs: { fire: 'Fire the helium gun', page: 'Turn a page of Hoyle’s notebook' },
      hints: { watch: 'Watch the heliums fly', fire: 'Tap the helium gun to fire', slide: 'Slide the energy (or tap the rail), then fire again', book: 'Tap Hoyle’s notebook', more: 'Try other energies, or turn a page' },
      chart: { title: 'Your tries', x: 'energy (keV)', xSci: 'energy above beryllium-8 + helium-4 (keV)', y: 'caught (of 16)' },
      signs: {
        title: { kid: 'Carbon’s energy ladder', sci: 'Carbon-12: its energy levels' },
        book: 'Hoyle’s notebook, 1953',
        energy: 'helium’s energy',
        energySci: '{total} MeV',
        caught: 'caught: {c} of {n}',
      },
      levels: {
        kid: { ground: 'carbon-12, calm', first: 'a step up', three: 'three heliums apart', pair: 'beryllium-8 + helium' },
        sci: { ground: 'ground state, 0 MeV', first: '4.44 MeV', three: '3 helium-4: 7.275 MeV', pair: 'beryllium-8 + helium-4: 7.367 MeV' },
        hoyle: { kid: 'Hoyle’s step!', sci: 'Hoyle state: 7.654 MeV' },
        guess: { kid: 'Hoyle: a step here?', sci: 'Hoyle 1953: near 7.7 MeV?' },
      },
      pages: [
        {
          kid: 'Page one, 1953. Fred Hoyle worked out that stars could only make so much carbon if carbon-12 had a special step of energy, just above beryllium-8 plus helium. Nobody had seen one. He said: look for it!',
          sci: '1953, at Caltech: Fred Hoyle argued that the triple-alpha process could make the carbon we see only through a resonance in carbon-12 near 7.7 MeV, just above the ⁸Be + ⁴He threshold (7.367 MeV). He asked the experimenters of the Kellogg Radiation Laboratory to look for it.',
        },
        {
          kid: 'Page two. Ward Whaling’s team at Caltech looked, and found the step that same year, at 7.68 MeV! Today it is measured at 7.654 MeV, and it is called the Hoyle state.',
          sci: 'Dunbar, Pixley, Wenzel and Whaling (Physical Review, 1953) found a level at 7.68 ± 0.03 MeV in the alpha particles from nitrogen-14 struck by deuterons. In 1957 a Caltech team including William Fowler showed that it breaks up into ⁸Be + ⁴He, so it can also form from them. Today: 7.654 MeV, spin 0, even parity (0⁺).',
        },
        {
          kid: 'Page three, 1983. William Fowler won the Nobel Prize in Physics for his work on how stars make the elements. Fred Hoyle did not share it, and many scientists thought that was unfair.',
          sci: 'Fowler shared the 1983 Nobel Prize in Physics with Subrahmanyan Chandrasekhar, for his theoretical and experimental studies of the nuclear reactions that matter in forming the chemical elements. Hoyle, his partner in that work (Burbidge, Burbidge, Fowler and Hoyle, 1957), was left out, which many found hard to explain.',
        },
        {
          kid: 'Page four. People often tell it like this: Hoyle knew the step had to be there because we are made of carbon, and we are here. But in 1953 he reasoned from how much carbon there is in the stars. The story about life came later.',
          sci: 'It is often told as the first “anthropic” prediction: carbon-based life exists, so the level must. The historian Helge Kragh (2010) found that in 1953 Hoyle argued from the abundance of carbon, not from life; the anthropic reading appeared in the 1980s. And the measurement was Whaling’s team’s, though it is often credited to Fowler.',
        },
      ],
      says: {
        found: {
          kid: 'Lots caught! You found Hoyle’s step: the energy that matches carbon-12’s level.',
          sci: 'Resonance: about 288 keV above ⁸Be + ⁴He, which is 7.654 MeV in carbon-12, the capture becomes far more likely.',
        },
        close: { kid: 'A few more caught: you are close! Slide just a little.', sci: 'On the flank of the resonance: closer.' },
        miss: { kid: 'Hardly any caught. Try another energy: slide it, or tap the rail.', sci: 'Off resonance: almost no captures. Scan the energy.' },
      },
      rows: [
        ['Hoyle state', '7.654 MeV, 0⁺'],
        ['Above ⁸Be + ⁴He', '288 keV'],
        ['Found in 1953', '7.68 ± 0.03 MeV'],
        ['Real width', 'under 10 eV'],
      ],
      panel: {
        kid: [
          'Carbon-12 can hold energy only in certain amounts, like the steps of a ladder. Hoyle’s step sits just above the energy of beryllium-8 plus a helium nucleus.',
          'Slide the helium’s energy (or tap the rail beside the ladder) and tap the helium gun to fire. When the energy matches the step, carbon catches the helium far more often: that is called a resonance. Hoyle’s notebook tells the story, a page for each tap.',
        ],
        sci: [
          'The capture ⁸Be + ⁴He → ¹²C is fast only through a resonance: an excited state of carbon-12 with spin 0 and even parity, the Hoyle state at 7.654 MeV, 288 keV above the ⁸Be + ⁴He threshold (7.367 MeV) and 379 keV above three free alphas (7.275 MeV).',
          'The peak is drawn about 28 keV wide here so it can be found with a slider; the real level is less than 10 eV wide. Most nuclei caught in it break up again; only a few in 10 000 fall to the ground state, by two gamma rays (3.21 and 4.44 MeV) or an electron-positron pair. At 10⁸ K, kT is only about 9 keV: 288 keV lies far out in the thermal tail, which is why the rate climbs so steeply with temperature.',
        ],
      },
    },
    star: {
      label: 'The red giant',
      title: 'Carbon into space',
      sign: { kid: 'Watch it grow old', sci: 'The end of a red giant' },
      verbs: { giant: 'Make the star old', old: 'Puff off its outer layers', nebula: 'Gather the dust', cloud: 'Show the blue planet', you: 'Start again' },
      hints: {
        watch: 'Watch',
        giant: 'Tap the giant star to make it old',
        old: 'Tap the old star again',
        nebula: 'Tap the dark cloud of dust',
        cloud: 'Tap the blue planet',
        you: 'Tap the young sun to start again',
      },
      signs: {
        carbon: { kid: 'carbon', sci: 'carbon: gas and soot' },
        you: 'the carbon in you',
        youSub: { kid: 'made in giant stars, long ago', sci: 'about 18 % of your body’s mass' },
      },
      says: {
        order: { kid: 'Not that one yet! The prompt says what to tap next.', sci: 'Out of order: the next step is in the prompt.' },
        giant: { kid: 'Back to the start: another red giant, long ago, turning helium into carbon in its core.', sci: 'Again: a red giant, its core burning helium into carbon and oxygen.' },
        old: {
          kid: 'Millions of years go by. Now the star’s middle is carbon and oxygen; it swells, it puffs, and it stirs carbon up to its surface. Tap it again!',
          sci: 'The asymptotic giant branch: a carbon-oxygen core, helium and hydrogen burning in shells, thermal pulses. Dredge-ups mix fresh carbon into the envelope, and soot-like dust forms in the cool wind.',
        },
        nebula: {
          kid: 'Puff! The star blows its outer layers away: a glowing cloud called a planetary nebula, full of carbon. Only its tiny hot core is left, a white dwarf.',
          sci: 'The envelope leaves at a few tens of km/s; the hot core, a white dwarf about the size of the Earth, makes the gas glow: a planetary nebula, bright for only some 10 000 to 20 000 years. The carbon leaves in the gas and in grains of soot (amorphous carbon) and silicon carbide.',
        },
        gather: {
          kid: 'See the dark grey carbon drifting past us? It gathers in a dark cloud of dust and gas. Tap the cloud!',
          sci: 'Over millions of years the dust mixes into the gas between the stars; dense, cold clouds of gas and dust are where new stars form.',
        },
        cloud: {
          kid: 'The cloud falls in on itself: a new sun lights up in the middle, with a disc of dust round it where planets grow.',
          sci: 'Gravitational collapse: a protostar, a protoplanetary disc, then planets. Our Sun formed this way about 4.6 billion years ago, from gas and dust already enriched by earlier stars.',
        },
        you: {
          kid: 'This blue planet is the Earth. The carbon in your body was made inside giant stars long before the Sun was born. You are made of stardust!',
          sci: 'About 18 % of your body’s mass is carbon, some 6 × 10²⁶ atoms in a 70 kg adult. Every one was made in stars: in red giants like this one, and in massive stars, which make it too.',
        },
      },
      panel: {
        kid: [
          'A star like this one burns helium into carbon for millions of years. When it grows old, it puffs its outer layers gently into space: a glowing cloud called a planetary nebula, with carbon in its gas and dust.',
          'That carbon drifts for millions of years until it ends up in a new cloud, where a new sun and new planets are born. Tap the giant, then each thing the prompt names, and follow the carbon all the way to you.',
        ],
        sci: [
          'Stars of about 0.8 to 8 solar masses end this way. On the asymptotic giant branch, helium burns in a shell in thermal pulses and dredge-ups carry carbon to the surface (making carbon stars); dusty winds, then the ejected envelope, carry it out as gas and soot-like grains. The core left behind is a white dwarf.',
          'Carbon is the fourth most abundant element in the universe. Red giants and massive stars both return it to the gas between the stars, and dense clouds of that gas and dust collapse into new stars and planets. The solar system formed so 4.6 billion years ago; the Sun will become a red giant in about 5 billion years.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Ao lado de uma gigante vermelha',
    greet: {
      kid: 'Olá! Eu sou o carbono, e é aqui que o carbono nasce: ao lado de uma estrela gigante vermelha. A lente mostra o seu núcleo, onde o hélio se transforma em carbono. Há três coisas para experimentar, e a história da imagem está no cavalete.',
      sci: 'Bem-vindo a uma gigante vermelha. No seu núcleo, a cerca de 100 milhões de kelvin, o hélio-4 funde-se em carbono-12 pelo processo triplo-alfa. Três estações: a captura, a ressonância de Hoyle e o fim da estrela. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Todos os átomos de carbono, também os que estão em ti, foram feitos dentro de uma estrela. Três núcleos de hélio tiveram de chocar quase no mesmo instante!',
        'Um núcleo de hélio tem dois protões e dois neutrões. Os cientistas chamam-lhe partícula alfa, por isso fazer carbono com três delas chama-se processo triplo-alfa.',
        'As gigantes vermelhas são enormes: cem vezes mais largas do que o Sol, ou mais. Um dia, daqui a cerca de 5 mil milhões de anos, o nosso Sol também será uma.',
      ],
      sci: [
        'Uma estrela como o Sol queima hélio no núcleo durante cerca de 100 milhões de anos. A energia libertada, 7,275 MeV por cada carbono-12 formado, mantém a gigante a brilhar.',
        'O carbono-12 é também a régua da química: o dalton (unidade de massa atómica) é um doze avos da massa de um átomo de carbono-12, e até 2019 a mole era o número de átomos em 12 g dele.',
        'Queimar hélio também transforma algum carbono em oxigénio (¹²C + ⁴He → ¹⁶O + γ). A rapidez com que isso acontece ainda está mal medida, e é ela que decide quanto carbono e quanto oxigénio as estrelas deixam.',
      ],
    },
    catch: {
      label: 'A captura triplo-alfa',
      title: 'Três hélios fazem um carbono',
      hints: { fire: 'Toca na lente para fazer chocar dois hélios', third: 'Depressa, toca outra vez para enviar o terceiro hélio', watch: 'Observa o núcleo' },
      verbs: { fire: 'Dois hélios chocam', third: 'Enviar o terceiro hélio' },
      made: 'Carbono feito',
      lost: 'Desfeitos',
      rows: [
        ['Meia-vida do berílio-8', '8,2 × 10⁻¹⁷ s (82 attossegundos)'],
        ['3 ⁴He → ¹²C liberta', '7,275 MeV'],
        ['Núcleo', 'cerca de 10⁸ K, 10⁵ g/cm³'],
      ],
      signs: {
        core: { kid: 'Dentro do núcleo: 100 milhões de graus', sci: 'O núcleo: cerca de 100 milhões de K, a queimar hélio' },
        be8: { kid: 'berílio-8!', sci: 'berílio-8' },
        broke: { kid: 'desfez-se!', sci: 'o berílio-8 decaiu: 2 hélio-4' },
        c12: { kid: 'carbono-12!', sci: 'carbono-12 + raios gama' },
        clock: 'berílio-8 vivo: {t} as',
        half: 'meia-vida: {t} as',
        scale: '1 s aqui = 100 as',
        tally: 'carbono feito: {made}    desfeitos: {lost}',
      },
      says: {
        fire: {
          kid: 'Aí vêm dois núcleos de hélio! Quando se juntarem, toca outra vez, depressa.',
          sci: '⁴He + ⁴He → ⁸Be. O berílio-8 fica 92 keV acima de duas partículas alfa (não é ligado): toca outra vez assim que se formar.',
        },
        early: { kid: 'Ainda não! Espera que os dois se juntem.', sci: 'Ainda não há berílio-8: espera que os dois se encontrem.' },
        made: {
          kid: 'Conseguiste! Três hélios tornaram-se um carbono-12, que brilhou com raios gama. Todo o carbono que existe foi feito assim.',
          sci: '⁸Be + ⁴He → ¹²C*, o estado de Hoyle, que aqui assenta em carbono-12 emitindo raios gama. Num núcleo verdadeiro só alguns em 10 000 assentam; os outros desfazem-se outra vez.',
        },
        late: { kid: 'Tarde demais! O berílio-8 desfez-se mesmo antes de o terceiro hélio lá chegar.', sci: 'O ⁸Be decaiu em duas partículas alfa antes de a terceira o alcançar.' },
        lost: { kid: 'Ups, desfez-se! O berílio-8 dura só um instante minúsculo. Toca na lente para tentares outra vez.', sci: '⁸Be → 2 ⁴He, meia-vida de 82 attossegundos. Toca na lente para tentar outra vez.' },
      },
      panel: {
        kid: [
          'Lá no fundo de uma estrela gigante estão cerca de 100 milhões de graus, e os núcleos de hélio andam a toda a velocidade e chocam uns com os outros. Dois deles podem juntar-se num berílio-8, mas ele desfaz-se outra vez quase logo.',
          'Para fazer carbono, um terceiro núcleo de hélio tem de acertar no berílio-8 nesse instante minúsculo. Toca na lente para fazer chocar dois, e depois toca outra vez, depressa, para enviar o terceiro. Às vezes desfaz-se antes de conseguires: ninguém sabe dizer quando.',
        ],
        sci: [
          'O processo triplo-alfa: ⁴He + ⁴He ⇌ ⁸Be. O berílio-8 fica 92 keV acima de duas partículas alfa separadas (não é ligado) e decai de novo em duas partículas alfa com uma meia-vida de 8,2 × 10⁻¹⁷ s (82 attossegundos). Num núcleo a queimar hélio, a cerca de 10⁸ K e 10⁵ g/cm³, só cerca de um núcleo de hélio em mil milhões está num berílio-8 a cada instante.',
          'Uma terceira partícula alfa tem de chegar durante esse tempo de vida: ⁸Be + ⁴He → ¹²C, ao todo 3 ⁴He → ¹²C + 7,275 MeV. Aqui o tempo corre 10¹⁶ vezes mais devagar (1 s = 100 as) e as distâncias não estão à escala; cada berílio-8 vive um tempo tirado do seu decaimento exponencial real, por isso pode desfazer-se a qualquer momento.',
        ],
      },
    },
    hoyle: {
      label: 'A escada de Hoyle',
      title: 'A ressonância de Hoyle',
      slider: 'Energia do hélio que chega',
      energy: '{e} keV',
      energySci: '{e} keV ({total} MeV no carbono-12)',
      verbs: { fire: 'Disparar o canhão de hélio', page: 'Virar uma página do caderno de Hoyle' },
      hints: { watch: 'Observa os hélios a voar', fire: 'Toca no canhão de hélio para disparar', slide: 'Muda a energia (ou toca no carril) e dispara outra vez', book: 'Toca no caderno de Hoyle', more: 'Experimenta outras energias, ou vira uma página' },
      chart: { title: 'As tuas tentativas', x: 'energia (keV)', xSci: 'energia acima de berílio-8 + hélio-4 (keV)', y: 'apanhados (de 16)' },
      signs: {
        title: { kid: 'A escada de energia do carbono', sci: 'Carbono-12: os seus níveis de energia' },
        book: 'Caderno de Hoyle, 1953',
        energy: 'energia do hélio',
        energySci: '{total} MeV',
        caught: 'apanhados: {c} de {n}',
      },
      levels: {
        kid: { ground: 'carbono-12, calmo', first: 'um degrau acima', three: 'três hélios separados', pair: 'berílio-8 + hélio' },
        sci: { ground: 'estado fundamental, 0 MeV', first: '4,44 MeV', three: '3 hélio-4: 7,275 MeV', pair: 'berílio-8 + hélio-4: 7,367 MeV' },
        hoyle: { kid: 'O degrau de Hoyle!', sci: 'Estado de Hoyle: 7,654 MeV' },
        guess: { kid: 'Hoyle: um degrau aqui?', sci: 'Hoyle 1953: perto de 7,7 MeV?' },
      },
      pages: [
        {
          kid: 'Página um, 1953. Fred Hoyle percebeu que as estrelas só podiam fazer tanto carbono se o carbono-12 tivesse um degrau de energia especial, logo acima do berílio-8 mais hélio. Ninguém o tinha visto. Ele disse: procurem-no!',
          sci: '1953, no Caltech: Fred Hoyle defendeu que o processo triplo-alfa só podia fazer o carbono que vemos através de uma ressonância do carbono-12 perto de 7,7 MeV, logo acima do limiar ⁸Be + ⁴He (7,367 MeV). Pediu aos experimentalistas do Kellogg Radiation Laboratory que a procurassem.',
        },
        {
          kid: 'Página dois. A equipa de Ward Whaling, no Caltech, procurou e encontrou o degrau nesse mesmo ano, a 7,68 MeV! Hoje mede-se a 7,654 MeV, e chama-se estado de Hoyle.',
          sci: 'Dunbar, Pixley, Wenzel e Whaling (Physical Review, 1953) encontraram um nível a 7,68 ± 0,03 MeV nas partículas alfa do azoto-14 atingido por deuterões. Em 1957, uma equipa do Caltech com William Fowler mostrou que ele se desfaz em ⁸Be + ⁴He, por isso também se pode formar a partir deles. Hoje: 7,654 MeV, spin 0, paridade par (0⁺).',
        },
        {
          kid: 'Página três, 1983. William Fowler ganhou o Prémio Nobel da Física pelo seu trabalho sobre como as estrelas fazem os elementos. Fred Hoyle não o partilhou, e muitos cientistas acharam isso injusto.',
          sci: 'Fowler partilhou o Prémio Nobel da Física de 1983 com Subrahmanyan Chandrasekhar, pelos seus estudos teóricos e experimentais das reações nucleares que contam na formação dos elementos químicos. Hoyle, seu parceiro nesse trabalho (Burbidge, Burbidge, Fowler e Hoyle, 1957), ficou de fora, o que muitos acharam difícil de explicar.',
        },
        {
          kid: 'Página quatro. Muitas vezes conta-se assim: Hoyle sabia que o degrau tinha de existir porque somos feitos de carbono e estamos aqui. Mas em 1953 ele raciocinou a partir de quanto carbono há nas estrelas. A história da vida veio depois.',
          sci: 'Conta-se muitas vezes como a primeira previsão “antrópica”: a vida baseada no carbono existe, logo o nível tem de existir. O historiador Helge Kragh (2010) mostrou que, em 1953, Hoyle argumentou a partir da abundância de carbono, não da vida; a leitura antrópica surgiu nos anos 1980. E a medição foi da equipa de Whaling, embora muitas vezes se atribua a Fowler.',
        },
      ],
      says: {
        found: {
          kid: 'Apanhaste muitos! Encontraste o degrau de Hoyle: a energia que bate certo com o nível do carbono-12.',
          sci: 'Ressonância: a cerca de 288 keV acima de ⁸Be + ⁴He, ou seja 7,654 MeV no carbono-12, a captura torna-se muito mais provável.',
        },
        close: { kid: 'Apanhaste mais alguns: estás perto! Muda só um bocadinho.', sci: 'Na encosta da ressonância: mais perto.' },
        miss: { kid: 'Quase nenhum apanhado. Experimenta outra energia: muda-a, ou toca no carril.', sci: 'Fora da ressonância: quase nenhuma captura. Varre a energia.' },
      },
      rows: [
        ['Estado de Hoyle', '7,654 MeV, 0⁺'],
        ['Acima de ⁸Be + ⁴He', '288 keV'],
        ['Encontrado em 1953', '7,68 ± 0,03 MeV'],
        ['Largura real', 'menos de 10 eV'],
      ],
      panel: {
        kid: [
          'O carbono-12 só consegue guardar energia em certas quantidades, como os degraus de uma escada. O degrau de Hoyle fica logo acima da energia do berílio-8 mais um núcleo de hélio.',
          'Muda a energia do hélio (ou toca no carril ao lado da escada) e toca no canhão de hélio para disparar. Quando a energia bate certo com o degrau, o carbono apanha o hélio muito mais vezes: a isso chama-se ressonância. O caderno de Hoyle conta a história, uma página por cada toque.',
        ],
        sci: [
          'A captura ⁸Be + ⁴He → ¹²C só é rápida através de uma ressonância: um estado excitado do carbono-12 com spin 0 e paridade par, o estado de Hoyle a 7,654 MeV, 288 keV acima do limiar ⁸Be + ⁴He (7,367 MeV) e 379 keV acima de três partículas alfa livres (7,275 MeV).',
          'Aqui o pico está desenhado com cerca de 28 keV de largura para se poder encontrar com um cursor; o nível real tem menos de 10 eV de largura. A maior parte dos núcleos apanhados nele desfaz-se outra vez; só alguns em 10 000 descem ao estado fundamental, por dois raios gama (3,21 e 4,44 MeV) ou por um par eletrão-positrão. A 10⁸ K, kT é só cerca de 9 keV: 288 keV ficam muito longe na cauda térmica, e é por isso que a taxa sobe tão depressa com a temperatura.',
        ],
      },
    },
    star: {
      label: 'A gigante vermelha',
      title: 'O carbono vai para o espaço',
      sign: { kid: 'Vê-a envelhecer', sci: 'O fim de uma gigante vermelha' },
      verbs: { giant: 'Envelhecer a estrela', old: 'Soprar as camadas de fora', nebula: 'Juntar a poeira', cloud: 'Mostrar o planeta azul', you: 'Recomeçar' },
      hints: {
        watch: 'Observa',
        giant: 'Toca na estrela gigante para a envelhecer',
        old: 'Toca outra vez na estrela velha',
        nebula: 'Toca na nuvem escura de poeira',
        cloud: 'Toca no planeta azul',
        you: 'Toca no sol jovem para recomeçar',
      },
      signs: {
        carbon: { kid: 'carbono', sci: 'carbono: gás e fuligem' },
        you: 'o carbono em ti',
        youSub: { kid: 'feito em estrelas gigantes, há muito tempo', sci: 'cerca de 18 % da massa do teu corpo' },
      },
      says: {
        order: { kid: 'Esse ainda não! O aviso diz em que tocar a seguir.', sci: 'Fora de ordem: o passo seguinte está no aviso.' },
        giant: { kid: 'De volta ao início: outra gigante vermelha, há muito tempo, a transformar hélio em carbono no seu núcleo.', sci: 'Outra vez: uma gigante vermelha, com o núcleo a queimar hélio em carbono e oxigénio.' },
        old: {
          kid: 'Passam milhões de anos. Agora o meio da estrela é carbono e oxigénio; ela incha, dá sopros e mexe o carbono até à sua superfície. Toca outra vez!',
          sci: 'O ramo assintótico das gigantes: um núcleo de carbono e oxigénio, hélio e hidrogénio a arder em camadas, pulsos térmicos. As dragagens misturam carbono novo no envelope, e forma-se poeira parecida com fuligem no vento frio.',
        },
        nebula: {
          kid: 'Puf! A estrela sopra para longe as suas camadas de fora: uma nuvem brilhante chamada nebulosa planetária, cheia de carbono. Só fica o seu pequeno núcleo quente, uma anã branca.',
          sci: 'O envelope sai a algumas dezenas de km/s; o núcleo quente, uma anã branca do tamanho da Terra, faz o gás brilhar: uma nebulosa planetária, brilhante só durante uns 10 000 a 20 000 anos. O carbono sai no gás e em grãos de fuligem (carbono amorfo) e de carboneto de silício.',
        },
        gather: {
          kid: 'Vês o carbono cinzento-escuro a passar por nós? Junta-se numa nuvem escura de poeira e gás. Toca na nuvem!',
          sci: 'Ao longo de milhões de anos a poeira mistura-se no gás entre as estrelas; as nuvens densas e frias de gás e poeira são onde nascem novas estrelas.',
        },
        cloud: {
          kid: 'A nuvem cai sobre si mesma: um sol novo acende-se no meio, com um disco de poeira à volta onde crescem planetas.',
          sci: 'Colapso gravitacional: uma protoestrela, um disco protoplanetário, depois planetas. O nosso Sol formou-se assim há cerca de 4,6 mil milhões de anos, a partir de gás e poeira já enriquecidos por estrelas anteriores.',
        },
        you: {
          kid: 'Este planeta azul é a Terra. O carbono do teu corpo foi feito dentro de estrelas gigantes muito antes de o Sol nascer. És feito de poeira de estrelas!',
          sci: 'Cerca de 18 % da massa do teu corpo é carbono, uns 6 × 10²⁶ átomos num adulto de 70 kg. Cada um foi feito em estrelas: em gigantes vermelhas como esta, e em estrelas de grande massa, que também o fazem.',
        },
      },
      panel: {
        kid: [
          'Uma estrela como esta queima hélio em carbono durante milhões de anos. Quando envelhece, sopra com suavidade as suas camadas de fora para o espaço: uma nuvem brilhante chamada nebulosa planetária, com carbono no seu gás e na sua poeira.',
          'Esse carbono anda à deriva durante milhões de anos até ir parar a uma nuvem nova, onde nascem um sol novo e planetas novos. Toca na gigante, depois em cada coisa que o aviso disser, e segue o carbono até chegar a ti.',
        ],
        sci: [
          'As estrelas de cerca de 0,8 a 8 massas solares acabam assim. No ramo assintótico das gigantes, o hélio arde numa camada em pulsos térmicos e as dragagens levam carbono à superfície (fazendo estrelas de carbono); ventos com poeira e depois o envelope ejetado levam-no para fora, como gás e grãos parecidos com fuligem. O núcleo que fica é uma anã branca.',
          'O carbono é o quarto elemento mais abundante do universo. As gigantes vermelhas e as estrelas de grande massa devolvem-no ao gás entre as estrelas, e as nuvens densas desse gás e dessa poeira colapsam em novas estrelas e planetas. O sistema solar formou-se assim há 4,6 mil milhões de anos; o Sol será uma gigante vermelha daqui a cerca de 5 mil milhões de anos.',
        ],
      },
    },
  },
  pl: {
    title: 'Obok czerwonego olbrzyma',
    greet: {
      kid: 'Cześć! Jestem Węgiel i to tutaj rodzi się węgiel: obok gwiazdy, czerwonego olbrzyma. Soczewka pokazuje jej jądro, gdzie hel zamienia się w węgiel. Są tu trzy rzeczy do wypróbowania, a historia obrazka jest na sztaludze.',
      sci: 'Witaj przy czerwonym olbrzymie. W jego jądrze, w temperaturze około 100 milionów kelwinów, hel-4 łączy się w węgiel-12 w procesie potrójnej alfa. Trzy stanowiska: łapanie, rezonans Hoyle’a i koniec gwiazdy. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Każdy atom węgla, także te w tobie, powstał we wnętrzu gwiazdy. Trzy jądra helu musiały się zderzyć prawie w tej samej chwili!',
        'Jądro helu to dwa protony i dwa neutrony. Naukowcy nazywają je cząstką alfa, dlatego robienie węgla z trzech takich cząstek to proces potrójnej alfa.',
        'Czerwone olbrzymy są ogromne: sto razy szersze od Słońca albo jeszcze większe. Kiedyś, za około 5 miliardów lat, nasze Słońce też się nim stanie.',
      ],
      sci: [
        'Gwiazda podobna do Słońca spala hel w jądrze przez około 100 milionów lat. Uwolniona energia, 7,275 MeV na każde powstałe jądro węgla-12, utrzymuje blask olbrzyma.',
        'Węgiel-12 to także miara chemii: dalton (jednostka masy atomowej) to jedna dwunasta masy atomu węgla-12, a do 2019 roku mol był liczbą atomów w 12 g tego izotopu.',
        'Spalanie helu zamienia też część węgla w tlen (¹²C + ⁴He → ¹⁶O + γ). Tempo tej reakcji wciąż jest słabo zmierzone, a to ono decyduje, ile węgla i tlenu zostawiają gwiazdy.',
      ],
    },
    catch: {
      label: 'Łapanie potrójnej alfa',
      title: 'Trzy jądra helu robią węgiel',
      hints: { fire: 'Dotknij soczewki, żeby zderzyć dwa jądra helu', third: 'Szybko, dotknij jeszcze raz, żeby wysłać trzecie jądro helu', watch: 'Obserwuj jądro gwiazdy' },
      verbs: { fire: 'Dwa jądra helu się zderzają', third: 'Wyślij trzecie jądro helu' },
      made: 'Powstały węgiel',
      lost: 'Rozpady',
      rows: [
        ['Czas połowicznego rozpadu berylu-8', '8,2 × 10⁻¹⁷ s (82 attosekundy)'],
        ['3 ⁴He → ¹²C uwalnia', '7,275 MeV'],
        ['Jądro gwiazdy', 'około 10⁸ K, 10⁵ g/cm³'],
      ],
      signs: {
        core: { kid: 'W jądrze gwiazdy: 100 milionów stopni', sci: 'Jądro: około 100 milionów K, spalanie helu' },
        be8: { kid: 'beryl-8!', sci: 'beryl-8' },
        broke: { kid: 'rozpadł się!', sci: 'beryl-8 się rozpadł: 2 jądra helu-4' },
        c12: { kid: 'węgiel-12!', sci: 'węgiel-12 + promienie gamma' },
        clock: 'beryl-8 istnieje: {t} as',
        half: 'czas połowicznego rozpadu: {t} as',
        scale: '1 s tutaj = 100 as',
        tally: 'powstały węgiel: {made}    rozpady: {lost}',
      },
      says: {
        fire: {
          kid: 'Lecą dwa jądra helu! Kiedy się połączą, dotknij jeszcze raz, szybko.',
          sci: '⁴He + ⁴He → ⁸Be. Beryl-8 ma energię o 92 keV wyższą niż dwie cząstki alfa (jest niezwiązany): dotknij jeszcze raz, gdy tylko powstanie.',
        },
        early: { kid: 'Jeszcze nie! Poczekaj, aż te dwa się połączą.', sci: 'Berylu-8 jeszcze nie ma: poczekaj, aż oba się spotkają.' },
        made: {
          kid: 'Udało się! Trzy jądra helu stały się jednym węglem-12, który zaświecił promieniami gamma. Cały węgiel na świecie powstał właśnie tak.',
          sci: '⁸Be + ⁴He → ¹²C*, stan Hoyle’a, który tutaj przechodzi w węgiel-12, wysyłając promienie gamma. W prawdziwym jądrze gwiazdy przechodzi tak tylko kilka na 10 000; reszta znów się rozpada.',
        },
        late: { kid: 'Za późno! Beryl-8 rozpadł się tuż przed przylotem trzeciego jądra helu.', sci: '⁸Be rozpadł się na dwie cząstki alfa, zanim dotarła do niego trzecia.' },
        lost: { kid: 'Ojej, rozpadł się! Beryl-8 istnieje tylko przez malutką chwilę. Dotknij soczewki, żeby spróbować jeszcze raz.', sci: '⁸Be → 2 ⁴He, czas połowicznego rozpadu 82 attosekundy. Dotknij soczewki, żeby spróbować ponownie.' },
      },
      panel: {
        kid: [
          'Głęboko we wnętrzu olbrzymiej gwiazdy jest około 100 milionów stopni, a jądra helu pędzą i zderzają się ze sobą. Dwa z nich mogą połączyć się w beryl-8, ale on prawie od razu znów się rozpada.',
          'Żeby powstał węgiel, trzecie jądro helu musi trafić w beryl-8 w tej malutkiej chwili. Dotknij soczewki, żeby zderzyć dwa jądra, a potem szybko dotknij jeszcze raz, żeby wysłać trzecie. Czasem beryl rozpada się wcześniej: nikt nie wie, kiedy to nastąpi.',
        ],
        sci: [
          'Proces potrójnej alfa: ⁴He + ⁴He ⇌ ⁸Be. Beryl-8 ma energię o 92 keV wyższą niż dwie osobne cząstki alfa (jest niezwiązany) i rozpada się z powrotem na dwie cząstki alfa z czasem połowicznego rozpadu 8,2 × 10⁻¹⁷ s (82 attosekundy). W jądrze spalającym hel, w około 10⁸ K i przy 10⁵ g/cm³, w każdej chwili tylko mniej więcej jedno jądro helu na miliard tkwi w berylu-8.',
          'Trzecia cząstka alfa musi dotrzeć w tym czasie życia: ⁸Be + ⁴He → ¹²C, w sumie 3 ⁴He → ¹²C + 7,275 MeV. Tutaj czas płynie 10¹⁶ razy wolniej (1 s = 100 as), a odległości nie są w skali; każdy beryl-8 żyje przez czas losowany z jego prawdziwego rozpadu wykładniczego, więc może się rozpaść w dowolnej chwili.',
        ],
      },
    },
    hoyle: {
      label: 'Drabina Hoyle’a',
      title: 'Rezonans Hoyle’a',
      slider: 'Energia nadlatującego helu',
      energy: '{e} keV',
      energySci: '{e} keV ({total} MeV w węglu-12)',
      verbs: { fire: 'Wystrzel z działa helowego', page: 'Przewróć stronę notatnika Hoyle’a' },
      hints: { watch: 'Patrz, jak lecą jądra helu', fire: 'Dotknij działa helowego, żeby strzelić', slide: 'Przesuń energię (albo dotknij szyny) i strzel jeszcze raz', book: 'Dotknij notatnika Hoyle’a', more: 'Spróbuj innych energii albo przewróć stronę' },
      chart: { title: 'Twoje próby', x: 'energia (keV)', xSci: 'energia ponad beryl-8 + hel-4 (keV)', y: 'złapane (z 16)' },
      signs: {
        title: { kid: 'Drabina energii węgla', sci: 'Węgiel-12: poziomy energetyczne' },
        book: 'Notatnik Hoyle’a, 1953',
        energy: 'energia helu',
        energySci: '{total} MeV',
        caught: 'złapane: {c} z {n}',
      },
      levels: {
        kid: { ground: 'węgiel-12, spokojny', first: 'stopień wyżej', three: 'trzy osobne jądra helu', pair: 'beryl-8 + hel' },
        sci: { ground: 'stan podstawowy, 0 MeV', first: '4,44 MeV', three: '3 hel-4: 7,275 MeV', pair: 'beryl-8 + hel-4: 7,367 MeV' },
        hoyle: { kid: 'Stopień Hoyle’a!', sci: 'Stan Hoyle’a: 7,654 MeV' },
        guess: { kid: 'Hoyle: tu jest stopień?', sci: 'Hoyle 1953: blisko 7,7 MeV?' },
      },
      pages: [
        {
          kid: 'Strona pierwsza, 1953. Fred Hoyle wyliczył, że gwiazdy mogą zrobić tyle węgla tylko wtedy, gdy węgiel-12 ma specjalny stopień energii, tuż ponad berylem-8 z helem. Nikt go nie widział. Powiedział: szukajcie go!',
          sci: '1953, Caltech: Fred Hoyle dowodził, że proces potrójnej alfa może wytworzyć obserwowany węgiel tylko dzięki rezonansowi w węglu-12 blisko 7,7 MeV, tuż ponad progiem ⁸Be + ⁴He (7,367 MeV). Poprosił eksperymentatorów z Kellogg Radiation Laboratory, żeby go poszukali.',
        },
        {
          kid: 'Strona druga. Zespół Warda Whalinga w Caltechu poszukał i znalazł ten stopień jeszcze w tym samym roku, przy 7,68 MeV! Dziś mierzy się go przy 7,654 MeV i nazywa stanem Hoyle’a.',
          sci: 'Dunbar, Pixley, Wenzel i Whaling (Physical Review, 1953) znaleźli poziom 7,68 ± 0,03 MeV w cząstkach alfa z azotu-14 bombardowanego deuteronami. W 1957 roku zespół z Caltechu, w którym był William Fowler, pokazał, że ten stan rozpada się na ⁸Be + ⁴He, więc może też z nich powstawać. Dziś: 7,654 MeV, spin 0, parzystość dodatnia (0⁺).',
        },
        {
          kid: 'Strona trzecia, 1983. William Fowler dostał Nagrodę Nobla z fizyki za badania nad tym, jak gwiazdy robią pierwiastki. Fred Hoyle jej z nim nie dzielił i wielu naukowców uznało to za niesprawiedliwe.',
          sci: 'Fowler podzielił Nagrodę Nobla z fizyki w 1983 roku z Subrahmanyanem Chandrasekharem, za teoretyczne i doświadczalne badania reakcji jądrowych ważnych dla powstawania pierwiastków chemicznych. Hoyle, jego partner w tej pracy (Burbidge, Burbidge, Fowler i Hoyle, 1957), został pominięty, czego wielu nie umiało wyjaśnić.',
        },
        {
          kid: 'Strona czwarta. Często opowiada się to tak: Hoyle wiedział, że stopień musi istnieć, bo jesteśmy zrobieni z węgla i jesteśmy tutaj. Ale w 1953 roku rozumował na podstawie tego, ile węgla jest w gwiazdach. Opowieść o życiu pojawiła się później.',
          sci: 'Często przedstawia się to jako pierwsze przewidywanie „antropiczne”: życie oparte na węglu istnieje, więc ten poziom musi istnieć. Historyk Helge Kragh (2010) wykazał, że w 1953 roku Hoyle wychodził od obfitości węgla, nie od życia; odczytanie antropiczne pojawiło się w latach 80. A pomiar wykonał zespół Whalinga, choć często przypisuje się go Fowlerowi.',
        },
      ],
      says: {
        found: {
          kid: 'Mnóstwo złapanych! To jest stopień Hoyle’a: energia, która pasuje do poziomu węgla-12.',
          sci: 'Rezonans: około 288 keV ponad ⁸Be + ⁴He, czyli przy 7,654 MeV w węglu-12, wychwyt staje się dużo bardziej prawdopodobny.',
        },
        close: { kid: 'Złapanych jest trochę więcej: jesteś blisko! Przesuń tylko odrobinę.', sci: 'Na zboczu rezonansu: bliżej.' },
        miss: { kid: 'Prawie nic nie złapane. Spróbuj innej energii: przesuń suwak albo dotknij szyny.', sci: 'Poza rezonansem: prawie żadnych wychwytów. Przeszukaj energie.' },
      },
      rows: [
        ['Stan Hoyle’a', '7,654 MeV, 0⁺'],
        ['Ponad ⁸Be + ⁴He', '288 keV'],
        ['Znaleziony w 1953 roku', '7,68 ± 0,03 MeV'],
        ['Prawdziwa szerokość', 'poniżej 10 eV'],
      ],
      panel: {
        kid: [
          'Węgiel-12 może przyjmować energię tylko w określonych porcjach, jak stopnie drabiny. Stopień Hoyle’a jest tuż ponad energią berylu-8 razem z jądrem helu.',
          'Przesuń energię helu (albo dotknij szyny obok drabiny) i dotknij działa helowego, żeby strzelić. Kiedy energia pasuje do stopnia, węgiel łapie hel o wiele częściej: to się nazywa rezonans. Notatnik Hoyle’a opowiada historię, jedna strona na każde dotknięcie.',
        ],
        sci: [
          'Wychwyt ⁸Be + ⁴He → ¹²C jest szybki tylko dzięki rezonansowi: stanowi wzbudzonemu węgla-12 o spinie 0 i parzystości dodatniej, stanowi Hoyle’a przy 7,654 MeV, 288 keV ponad progiem ⁸Be + ⁴He (7,367 MeV) i 379 keV ponad trzema swobodnymi cząstkami alfa (7,275 MeV).',
          'Tutaj szczyt ma około 28 keV szerokości, żeby dało się go znaleźć suwakiem; prawdziwy poziom ma mniej niż 10 eV szerokości. Większość złapanych w nim jąder znów się rozpada; tylko kilka na 10 000 spada do stanu podstawowego, wysyłając dwa promienie gamma (3,21 i 4,44 MeV) albo parę elektron-pozyton. W 10⁸ K kT wynosi tylko około 9 keV: 288 keV leży daleko w ogonie rozkładu termicznego, dlatego tempo reakcji tak stromo rośnie z temperaturą.',
        ],
      },
    },
    star: {
      label: 'Czerwony olbrzym',
      title: 'Węgiel leci w kosmos',
      sign: { kid: 'Zobacz, jak się starzeje', sci: 'Koniec czerwonego olbrzyma' },
      verbs: { giant: 'Postarz gwiazdę', old: 'Zdmuchnij jej zewnętrzne warstwy', nebula: 'Zbierz pył', cloud: 'Pokaż niebieską planetę', you: 'Zacznij od nowa' },
      hints: {
        watch: 'Patrz',
        giant: 'Dotknij olbrzymiej gwiazdy, żeby ją postarzyć',
        old: 'Dotknij starej gwiazdy jeszcze raz',
        nebula: 'Dotknij ciemnej chmury pyłu',
        cloud: 'Dotknij niebieskiej planety',
        you: 'Dotknij młodego słońca, żeby zacząć od nowa',
      },
      signs: {
        carbon: { kid: 'węgiel', sci: 'węgiel: gaz i sadza' },
        you: 'węgiel w tobie',
        youSub: { kid: 'zrobiony w olbrzymich gwiazdach dawno temu', sci: 'około 18 % masy twojego ciała' },
      },
      says: {
        order: { kid: 'Jeszcze nie to! Podpowiedź mówi, czego dotknąć teraz.', sci: 'Nie po kolei: następny krok jest w podpowiedzi.' },
        giant: { kid: 'Wracamy do początku: kolejny czerwony olbrzym, dawno temu, zamienia hel w węgiel w swoim jądrze.', sci: 'Jeszcze raz: czerwony olbrzym, w jego jądrze hel spala się w węgiel i tlen.' },
        old: {
          kid: 'Mijają miliony lat. Teraz środek gwiazdy to węgiel i tlen; gwiazda puchnie, dmucha i wynosi węgiel na swoją powierzchnię. Dotknij jej jeszcze raz!',
          sci: 'Asymptotyczna gałąź olbrzymów: jądro z węgla i tlenu, hel i wodór spalane w powłokach, impulsy termiczne. Kolejne wymieszania wynoszą świeży węgiel do otoczki, a w chłodnym wietrze tworzy się pył podobny do sadzy.',
        },
        nebula: {
          kid: 'Puf! Gwiazda zdmuchuje swoje zewnętrzne warstwy: świecącą chmurę zwaną mgławicą planetarną, pełną węgla. Zostaje tylko jej malutkie gorące jądro, biały karzeł.',
          sci: 'Otoczka odpływa z prędkością kilkudziesięciu km/s; gorące jądro, biały karzeł wielkości Ziemi, sprawia, że gaz świeci: mgławica planetarna, jasna tylko przez jakieś 10 000 do 20 000 lat. Węgiel odlatuje w gazie oraz w ziarnach sadzy (węgla bezpostaciowego) i węglika krzemu.',
        },
        gather: {
          kid: 'Widzisz ciemnoszary węgiel, który przelatuje obok nas? Zbiera się w ciemnej chmurze pyłu i gazu. Dotknij chmury!',
          sci: 'Przez miliony lat pył miesza się z gazem między gwiazdami; gęste, zimne chmury gazu i pyłu to miejsca, gdzie rodzą się nowe gwiazdy.',
        },
        cloud: {
          kid: 'Chmura zapada się w sobie: w środku zapala się nowe słońce, a wokół niego jest dysk pyłu, w którym rosną planety.',
          sci: 'Kolaps grawitacyjny: protogwiazda, dysk protoplanetarny, potem planety. Nasze Słońce powstało tak około 4,6 miliarda lat temu, z gazu i pyłu już wzbogaconych przez wcześniejsze gwiazdy.',
        },
        you: {
          kid: 'Ta niebieska planeta to Ziemia. Węgiel w twoim ciele powstał w olbrzymich gwiazdach, długo zanim narodziło się Słońce. Jesteś z gwiezdnego pyłu!',
          sci: 'Około 18 % masy twojego ciała to węgiel, mniej więcej 6 × 10²⁶ atomów u dorosłego ważącego 70 kg. Każdy z nich powstał w gwiazdach: w czerwonych olbrzymach takich jak ten i w gwiazdach masywnych, które też go wytwarzają.',
        },
      },
      panel: {
        kid: [
          'Taka gwiazda jak ta spala hel w węgiel przez miliony lat. Kiedy się zestarzeje, delikatnie zdmuchuje swoje zewnętrzne warstwy w kosmos: świecącą chmurę zwaną mgławicą planetarną, z węglem w gazie i w pyle.',
          'Ten węgiel dryfuje przez miliony lat, aż trafi do nowej chmury, w której rodzą się nowe słońce i nowe planety. Dotknij olbrzyma, potem każdej rzeczy, którą wskaże podpowiedź, i śledź węgiel aż do ciebie.',
        ],
        sci: [
          'Tak kończą gwiazdy o masach od około 0,8 do 8 mas Słońca. Na asymptotycznej gałęzi olbrzymów hel spala się w powłoce w impulsach termicznych, a wymieszania wynoszą węgiel na powierzchnię (powstają gwiazdy węglowe); pyłowe wiatry, a potem odrzucona otoczka unoszą go na zewnątrz jako gaz i ziarna podobne do sadzy. Pozostałe jądro to biały karzeł.',
          'Węgiel jest czwartym najobficiej występującym pierwiastkiem we wszechświecie. Czerwone olbrzymy i gwiazdy masywne oddają go do gazu między gwiazdami, a gęste chmury tego gazu i pyłu zapadają się w nowe gwiazdy i planety. Układ Słoneczny powstał tak 4,6 miliarda lat temu; Słońce stanie się czerwonym olbrzymem za około 5 miliardów lat.',
        ],
      },
    },
  },
  de: {
    title: 'Neben einem Roten Riesen',
    greet: {
      kid: 'Hallo! Ich bin der Kohlenstoff, und hier entsteht Kohlenstoff: neben einem Roten Riesen. Die Linse zeigt seinen Kern, wo Helium zu Kohlenstoff wird. Drei Dinge zum Ausprobieren, und die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Willkommen bei einem Roten Riesen. In seinem Kern, bei etwa 100 Millionen Kelvin, verschmilzt Helium-4 im Drei-Alpha-Prozess zu Kohlenstoff-12. Drei Stationen: der Fang, Hoyles Resonanz und das Ende des Sterns. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Jedes Kohlenstoffatom, auch die in dir, ist in einem Stern entstanden. Drei Heliumkerne mussten fast im selben Augenblick zusammenkrachen!',
        'Ein Heliumkern besteht aus zwei Protonen und zwei Neutronen. Forscher nennen ihn Alphateilchen, deshalb heißt Kohlenstoff aus dreien davon zu machen Drei-Alpha-Prozess.',
        'Rote Riesen sind riesig: hundertmal so breit wie die Sonne oder mehr. Eines Tages, in etwa 5 Milliarden Jahren, wird auch unsere Sonne einer.',
      ],
      sci: [
        'Ein sonnenähnlicher Stern brennt etwa 100 Millionen Jahre lang Helium in seinem Kern. Die freigesetzte Energie, 7,275 MeV für jedes entstandene Kohlenstoff-12, lässt den Riesen leuchten.',
        'Kohlenstoff-12 ist auch der Maßstab der Chemie: Das Dalton (die atomare Masseneinheit) ist ein Zwölftel der Masse eines Kohlenstoff-12-Atoms, und bis 2019 war das Mol die Zahl der Atome in 12 g davon.',
        'Beim Heliumbrennen wird auch etwas Kohlenstoff zu Sauerstoff (¹²C + ⁴He → ¹⁶O + γ). Wie schnell das geht, ist noch immer schlecht gemessen, und davon hängt ab, wie viel Kohlenstoff und Sauerstoff Sterne hinterlassen.',
      ],
    },
    catch: {
      label: 'Der Drei-Alpha-Fang',
      title: 'Drei Heliumkerne machen einen Kohlenstoff',
      hints: { fire: 'Tipp die Linse an, damit zwei Heliumkerne zusammenstoßen', third: 'Schnell, tipp noch einmal, um den dritten Heliumkern zu schicken', watch: 'Schau in den Kern' },
      verbs: { fire: 'Zwei Heliumkerne stoßen zusammen', third: 'Den dritten Heliumkern schicken' },
      made: 'Kohlenstoff gemacht',
      lost: 'Zerfallen',
      rows: [
        ['Halbwertszeit von Beryllium-8', '8,2 × 10⁻¹⁷ s (82 Attosekunden)'],
        ['3 ⁴He → ¹²C setzt frei', '7,275 MeV'],
        ['Kern', 'etwa 10⁸ K, 10⁵ g/cm³'],
      ],
      signs: {
        core: { kid: 'Im Kern: 100 Millionen Grad', sci: 'Der Kern: etwa 100 Millionen K, Heliumbrennen' },
        be8: { kid: 'Beryllium-8!', sci: 'Beryllium-8' },
        broke: { kid: 'zerfallen!', sci: 'Beryllium-8 zerfallen: 2 Helium-4' },
        c12: { kid: 'Kohlenstoff-12!', sci: 'Kohlenstoff-12 + Gammastrahlen' },
        clock: 'Beryllium-8 lebt: {t} as',
        half: 'Halbwertszeit: {t} as',
        scale: '1 s hier = 100 as',
        tally: 'Kohlenstoff gemacht: {made}    zerfallen: {lost}',
      },
      says: {
        fire: {
          kid: 'Da kommen zwei Heliumkerne! Wenn sie sich verbinden, tipp noch einmal, schnell.',
          sci: '⁴He + ⁴He → ⁸Be. Beryllium-8 ist um 92 keV ungebunden: tipp noch einmal, sobald es entsteht.',
        },
        early: { kid: 'Noch nicht! Warte, bis sich die zwei verbinden.', sci: 'Noch kein Beryllium-8: warte, bis die beiden sich treffen.' },
        made: {
          kid: 'Geschafft! Aus drei Heliumkernen wurde ein Kohlenstoff-12, und er hat Gammastrahlen ausgesandt. Aller Kohlenstoff, den es gibt, ist so entstanden.',
          sci: '⁸Be + ⁴He → ¹²C*, der Hoyle-Zustand, der hier unter Aussendung von Gammastrahlen zu Kohlenstoff-12 wird. In einem echten Sternkern tun das nur einige von 10 000; der Rest zerfällt wieder.',
        },
        late: { kid: 'Zu spät! Das Beryllium-8 ist zerfallen, kurz bevor der dritte Heliumkern ankam.', sci: 'Das ⁸Be ist in zwei Alphateilchen zerfallen, bevor das dritte es erreichte.' },
        lost: { kid: 'Hoppla, zerfallen! Beryllium-8 hält nur einen winzigen Augenblick. Tipp die Linse an, um es noch einmal zu versuchen.', sci: '⁸Be → 2 ⁴He, Halbwertszeit 82 Attosekunden. Tipp die Linse an für einen neuen Versuch.' },
      },
      panel: {
        kid: [
          'Tief im Inneren eines Riesensterns ist es etwa 100 Millionen Grad heiß, und Heliumkerne rasen herum und stoßen zusammen. Zwei von ihnen können sich zu Beryllium-8 verbinden, aber das zerfällt fast sofort wieder.',
          'Damit Kohlenstoff entsteht, muss ein dritter Heliumkern das Beryllium-8 in diesem winzigen Augenblick treffen. Tipp die Linse an, damit zwei zusammenstoßen, und tipp dann schnell noch einmal, um den dritten zu schicken. Manchmal zerfällt es vorher: Niemand kann sagen, wann.',
        ],
        sci: [
          'Der Drei-Alpha-Prozess: ⁴He + ⁴He ⇌ ⁸Be. Beryllium-8 ist um 92 keV ungebunden und zerfällt mit einer Halbwertszeit von 8,2 × 10⁻¹⁷ s (82 Attosekunden) wieder in zwei Alphateilchen. In einem heliumbrennenden Kern bei etwa 10⁸ K und 10⁵ g/cm³ steckt in jedem Augenblick nur etwa einer von einer Milliarde Heliumkernen in einem Beryllium-8.',
          'Ein drittes Alphateilchen muss innerhalb dieser Lebensdauer ankommen: ⁸Be + ⁴He → ¹²C, insgesamt 3 ⁴He → ¹²C + 7,275 MeV. Hier läuft die Zeit 10¹⁶-mal langsamer (1 s = 100 as), und die Abstände sind nicht maßstabsgetreu; jedes Beryllium-8 lebt eine Zeit, die aus seinem echten exponentiellen Zerfall gezogen wird, also kann es jederzeit zerfallen.',
        ],
      },
    },
    hoyle: {
      label: 'Hoyles Leiter',
      title: 'Hoyles Resonanz',
      slider: 'Energie des ankommenden Heliums',
      energy: '{e} keV',
      energySci: '{e} keV ({total} MeV im Kohlenstoff-12)',
      verbs: { fire: 'Die Heliumkanone abfeuern', page: 'Eine Seite in Hoyles Notizbuch umblättern' },
      hints: { watch: 'Schau den Heliumkernen beim Fliegen zu', fire: 'Tipp die Heliumkanone an, um zu feuern', slide: 'Verschieb die Energie (oder tipp die Schiene an) und feuere wieder', book: 'Tipp Hoyles Notizbuch an', more: 'Probier andere Energien oder blättere um' },
      chart: { title: 'Deine Versuche', x: 'Energie (keV)', xSci: 'Energie über Beryllium-8 + Helium-4 (keV)', y: 'gefangen (von 16)' },
      signs: {
        title: { kid: 'Die Energieleiter des Kohlenstoffs', sci: 'Kohlenstoff-12: seine Energieniveaus' },
        book: 'Hoyles Notizbuch, 1953',
        energy: 'Energie des Heliums',
        energySci: '{total} MeV',
        caught: 'gefangen: {c} von {n}',
      },
      levels: {
        kid: { ground: 'Kohlenstoff-12, ruhig', first: 'eine Stufe höher', three: 'drei Heliumkerne getrennt', pair: 'Beryllium-8 + Helium' },
        sci: { ground: 'Grundzustand, 0 MeV', first: '4,44 MeV', three: '3 Helium-4: 7,275 MeV', pair: 'Beryllium-8 + Helium-4: 7,367 MeV' },
        hoyle: { kid: 'Hoyles Stufe!', sci: 'Hoyle-Zustand: 7,654 MeV' },
        guess: { kid: 'Hoyle: hier eine Stufe?', sci: 'Hoyle 1953: nahe 7,7 MeV?' },
      },
      pages: [
        {
          kid: 'Seite eins, 1953. Fred Hoyle rechnete aus, dass Sterne nur dann so viel Kohlenstoff machen können, wenn Kohlenstoff-12 eine besondere Energiestufe hat, knapp über Beryllium-8 plus Helium. Niemand hatte sie gesehen. Er sagte: Sucht sie!',
          sci: '1953, am Caltech: Fred Hoyle argumentierte, dass der Drei-Alpha-Prozess den beobachteten Kohlenstoff nur über eine Resonanz im Kohlenstoff-12 nahe 7,7 MeV erzeugen kann, knapp über der Schwelle ⁸Be + ⁴He (7,367 MeV). Er bat die Experimentatoren des Kellogg Radiation Laboratory, danach zu suchen.',
        },
        {
          kid: 'Seite zwei. Das Team von Ward Whaling am Caltech suchte und fand die Stufe noch im selben Jahr, bei 7,68 MeV! Heute misst man sie bei 7,654 MeV, und sie heißt Hoyle-Zustand.',
          sci: 'Dunbar, Pixley, Wenzel und Whaling (Physical Review, 1953) fanden ein Niveau bei 7,68 ± 0,03 MeV in den Alphateilchen aus mit Deuteronen beschossenem Stickstoff-14. 1957 zeigte ein Caltech-Team mit William Fowler, dass es in ⁸Be + ⁴He zerfällt, also auch aus ihnen entstehen kann. Heute: 7,654 MeV, Spin 0, positive Parität (0⁺).',
        },
        {
          kid: 'Seite drei, 1983. William Fowler bekam den Nobelpreis für Physik für seine Arbeit darüber, wie Sterne die Elemente machen. Fred Hoyle bekam ihn nicht mit, und viele Forscher fanden das ungerecht.',
          sci: 'Fowler teilte den Nobelpreis für Physik 1983 mit Subrahmanyan Chandrasekhar, für seine theoretischen und experimentellen Studien der Kernreaktionen, die für die Bildung der chemischen Elemente wichtig sind. Hoyle, sein Partner bei dieser Arbeit (Burbidge, Burbidge, Fowler und Hoyle, 1957), ging leer aus, was viele kaum erklären konnten.',
        },
        {
          kid: 'Seite vier. Oft wird es so erzählt: Hoyle wusste, dass die Stufe da sein muss, weil wir aus Kohlenstoff sind und es uns gibt. Aber 1953 ging er davon aus, wie viel Kohlenstoff es in den Sternen gibt. Die Geschichte mit dem Leben kam erst später.',
          sci: 'Oft wird es als erste „anthropische“ Vorhersage erzählt: Leben auf Kohlenstoffbasis existiert, also muss es das Niveau geben. Der Historiker Helge Kragh (2010) zeigte, dass Hoyle 1953 von der Häufigkeit des Kohlenstoffs ausging, nicht vom Leben; die anthropische Deutung kam in den 1980er-Jahren auf. Und die Messung stammte von Whalings Team, auch wenn man sie oft Fowler zuschreibt.',
        },
      ],
      says: {
        found: {
          kid: 'Viele gefangen! Du hast Hoyles Stufe gefunden: die Energie, die zum Niveau des Kohlenstoff-12 passt.',
          sci: 'Resonanz: etwa 288 keV über ⁸Be + ⁴He, also bei 7,654 MeV im Kohlenstoff-12, wird der Einfang viel wahrscheinlicher.',
        },
        close: { kid: 'Ein paar mehr gefangen: Du bist nah dran! Verschieb nur ein kleines bisschen.', sci: 'An der Flanke der Resonanz: näher.' },
        miss: { kid: 'Fast keiner gefangen. Probier eine andere Energie: Verschieb sie oder tipp die Schiene an.', sci: 'Neben der Resonanz: fast keine Einfänge. Durchsuche die Energie.' },
      },
      rows: [
        ['Hoyle-Zustand', '7,654 MeV, 0⁺'],
        ['Über ⁸Be + ⁴He', '288 keV'],
        ['Gefunden 1953', '7,68 ± 0,03 MeV'],
        ['Echte Breite', 'unter 10 eV'],
      ],
      panel: {
        kid: [
          'Kohlenstoff-12 kann Energie nur in bestimmten Mengen aufnehmen, wie die Sprossen einer Leiter. Hoyles Stufe liegt knapp über der Energie von Beryllium-8 plus einem Heliumkern.',
          'Verschieb die Energie des Heliums (oder tipp die Schiene neben der Leiter an) und tipp die Heliumkanone an, um zu feuern. Wenn die Energie zur Stufe passt, fängt der Kohlenstoff das Helium viel öfter: Das nennt man Resonanz. Hoyles Notizbuch erzählt die Geschichte, eine Seite pro Tipp.',
        ],
        sci: [
          'Der Einfang ⁸Be + ⁴He → ¹²C ist nur über eine Resonanz schnell: einen angeregten Zustand des Kohlenstoff-12 mit Spin 0 und positiver Parität, den Hoyle-Zustand bei 7,654 MeV, 288 keV über der Schwelle ⁸Be + ⁴He (7,367 MeV) und 379 keV über drei freien Alphateilchen (7,275 MeV).',
          'Der Gipfel ist hier etwa 28 keV breit gezeichnet, damit man ihn mit einem Schieberegler findet; das echte Niveau ist weniger als 10 eV breit. Die meisten darin gefangenen Kerne zerfallen wieder; nur einige von 10 000 fallen in den Grundzustand, mit zwei Gammastrahlen (3,21 und 4,44 MeV) oder einem Elektron-Positron-Paar. Bei 10⁸ K ist kT nur etwa 9 keV: 288 keV liegen weit draußen im thermischen Ausläufer, deshalb steigt die Rate so steil mit der Temperatur.',
        ],
      },
    },
    star: {
      label: 'Der Rote Riese',
      title: 'Kohlenstoff ins All',
      sign: { kid: 'Schau, wie er alt wird', sci: 'Das Ende eines Roten Riesen' },
      verbs: { giant: 'Den Stern altern lassen', old: 'Seine äußeren Schichten wegpusten', nebula: 'Den Staub sammeln', cloud: 'Den blauen Planeten zeigen', you: 'Von vorn anfangen' },
      hints: {
        watch: 'Schau zu',
        giant: 'Tipp den Riesenstern an, damit er alt wird',
        old: 'Tipp den alten Stern noch einmal an',
        nebula: 'Tipp die dunkle Staubwolke an',
        cloud: 'Tipp den blauen Planeten an',
        you: 'Tipp die junge Sonne an, um von vorn anzufangen',
      },
      signs: {
        carbon: { kid: 'Kohlenstoff', sci: 'Kohlenstoff: Gas und Ruß' },
        you: 'der Kohlenstoff in dir',
        youSub: { kid: 'gemacht in Riesensternen, vor langer Zeit', sci: 'etwa 18 % der Masse deines Körpers' },
      },
      says: {
        order: { kid: 'Das noch nicht! Der Hinweis sagt, was du als Nächstes antippen sollst.', sci: 'Falsche Reihenfolge: Der nächste Schritt steht im Hinweis.' },
        giant: { kid: 'Zurück zum Anfang: ein anderer Roter Riese, vor langer Zeit, der in seinem Kern Helium zu Kohlenstoff macht.', sci: 'Noch einmal: ein Roter Riese, in dessen Kern Helium zu Kohlenstoff und Sauerstoff brennt.' },
        old: {
          kid: 'Millionen Jahre vergehen. Jetzt ist die Mitte des Sterns Kohlenstoff und Sauerstoff; er bläht sich auf, pustet und rührt Kohlenstoff bis an seine Oberfläche. Tipp ihn noch einmal an!',
          sci: 'Der asymptotische Riesenast: ein Kern aus Kohlenstoff und Sauerstoff, Helium und Wasserstoff brennen in Schalen, thermische Pulse. Dredge-ups mischen frischen Kohlenstoff in die Hülle, und im kühlen Wind bildet sich rußartiger Staub.',
        },
        nebula: {
          kid: 'Puff! Der Stern pustet seine äußeren Schichten weg: eine leuchtende Wolke namens Planetarischer Nebel, voller Kohlenstoff. Übrig bleibt nur sein winziger heißer Kern, ein Weißer Zwerg.',
          sci: 'Die Hülle entweicht mit einigen zehn km/s; der heiße Kern, ein Weißer Zwerg etwa so groß wie die Erde, bringt das Gas zum Leuchten: ein Planetarischer Nebel, hell nur für etwa 10 000 bis 20 000 Jahre. Der Kohlenstoff geht im Gas mit und in Körnern aus Ruß (amorphem Kohlenstoff) und Siliciumcarbid.',
        },
        gather: {
          kid: 'Siehst du den dunkelgrauen Kohlenstoff an uns vorbeitreiben? Er sammelt sich in einer dunklen Wolke aus Staub und Gas. Tipp die Wolke an!',
          sci: 'Über Millionen Jahre mischt sich der Staub in das Gas zwischen den Sternen; dichte, kalte Wolken aus Gas und Staub sind die Orte, an denen neue Sterne entstehen.',
        },
        cloud: {
          kid: 'Die Wolke fällt in sich zusammen: In der Mitte leuchtet eine neue Sonne auf, mit einer Staubscheibe drumherum, in der Planeten wachsen.',
          sci: 'Gravitationskollaps: ein Protostern, eine protoplanetare Scheibe, dann Planeten. Unsere Sonne ist so vor etwa 4,6 Milliarden Jahren entstanden, aus Gas und Staub, die frühere Sterne schon angereichert hatten.',
        },
        you: {
          kid: 'Dieser blaue Planet ist die Erde. Der Kohlenstoff in deinem Körper wurde in Riesensternen gemacht, lange bevor die Sonne geboren wurde. Du bist aus Sternenstaub!',
          sci: 'Etwa 18 % der Masse deines Körpers sind Kohlenstoff, rund 6 × 10²⁶ Atome bei einem Erwachsenen mit 70 kg. Jedes davon entstand in Sternen: in Roten Riesen wie diesem und in massereichen Sternen, die ihn auch erzeugen.',
        },
      },
      panel: {
        kid: [
          'Ein Stern wie dieser brennt Millionen Jahre lang Helium zu Kohlenstoff. Wenn er alt wird, pustet er seine äußeren Schichten sanft ins All: eine leuchtende Wolke namens Planetarischer Nebel, mit Kohlenstoff in ihrem Gas und Staub.',
          'Dieser Kohlenstoff treibt Millionen Jahre lang umher, bis er in einer neuen Wolke landet, in der eine neue Sonne und neue Planeten entstehen. Tipp den Riesen an, dann jedes Ding, das der Hinweis nennt, und folge dem Kohlenstoff bis zu dir.',
        ],
        sci: [
          'Sterne von etwa 0,8 bis 8 Sonnenmassen enden so. Auf dem asymptotischen Riesenast brennt Helium in einer Schale in thermischen Pulsen, und Dredge-ups bringen Kohlenstoff an die Oberfläche (so entstehen Kohlenstoffsterne); staubige Winde, dann die abgestoßene Hülle tragen ihn als Gas und rußartige Körner hinaus. Der zurückbleibende Kern ist ein Weißer Zwerg.',
          'Kohlenstoff ist das vierthäufigste Element im Universum. Rote Riesen und massereiche Sterne geben ihn an das Gas zwischen den Sternen zurück, und dichte Wolken aus diesem Gas und Staub kollabieren zu neuen Sternen und Planeten. Das Sonnensystem entstand so vor 4,6 Milliarden Jahren; die Sonne wird in etwa 5 Milliarden Jahren ein Roter Riese.',
        ],
      },
    },
  },
}
