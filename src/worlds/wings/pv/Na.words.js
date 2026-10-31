// Sodium's Periodic Videos room: the words of its stations (docs/pv/Na.md), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). {melt} °C, {density} g/cm3 and {ie} kJ/mol come from
// the game's data; the video's rounded numbers are not used.
export const NA_WORDS = {
  en: {
    forms: { el: 'sodium', El: 'Sodium' },
    // the professor: what he says in the film, retold (times: videos.js `prof`)
    prof: {
      name: 'Professor Poliakoff',
      verb: 'Listen',
      next: 'Next',
      watch: 'Watch him say it ({t})',
      note: 'What he says in the film, retold in the game\'s words. "Watch him say it" plays the moment.',
      lines: [
        'Sodium is a light metal, rather like lithium, and it melts at a low temperature, below the boiling point of water.',
        'Freshly cut, sodium is a very shiny metal, really quite beautiful. But it reacts very quickly with the air and with water: the white crust on the outside is the hydroxide.',
        'Many of you will know that if you drop sodium into water, it reacts almost explosively. So for the bigger reactions, we went outside.',
        'Salt lets infrared light through, so it makes windows for infrared cells. This one is broken (my students broke it), but look: it cracks at right angles, because the atoms inside are arranged in cubes.',
        'This table lamp is a lump of natural rock salt from under the ground, probably from Cheshire, where there are large underground salt mines.',
        'I like sodium because Na was my mother\'s nickname when she was a child: her name was Ena. So whenever I see sodium in a formula, I get a warm, motherly feeling.',
      ],
    },
    greet: {
      kid: 'Hi! This is my lab. Watch my video on the screen, then do the experiments yourself. Start at the oil tin by the bench!',
      sci: "This lab rebuilds the experiments from sodium's Periodic Videos film: cutting it, dropping it in water, and its salt. Each station plays its own part of the film.",
    },
    talk: {
      kid: ['I am so soft you can cut me with a knife.', 'I float on water, then I race around and catch fire!', 'The salt on your chips is half me: one sodium for every chlorine.'],
      sci: ['One outer electron, given away at the slightest chance: that is my whole chemistry.', 'My flame is yellow-orange: 589 nm, the D lines.', 'Humphry Davy made me first, in 1807, with electricity.'],
    },
    tin: {
      label: 'The oil tin',
      title: 'Sodium under oil',
      hints: { lift: 'Tap the oil tin to lift the rod out', cut: 'Tap the knife to cut a slice', fresh: 'This rod is used up: tap the oil tin for a new one', watch: 'Watch the cut face' },
      buttons: { lift: 'Lift a rod out of the oil', cut: 'Cut a slice' },
      says: {
        lift: { kid: 'Out of the oil it comes! The white outside is only a crust: the metal hides inside.', sci: 'The crust is hydroxide (and carbonate) from the air: only the inside is metal.' },
        cut: { kid: 'Look at the cut: shiny silver... now watch it go dull!', sci: 'Fresh sodium: a mirror for a few seconds, then oxide and hydroxide.' },
      },
      panel: {
        kid: [
          'Sodium is a metal you can cut with a knife, like cold butter. Inside it shines like silver.',
          'Watch the cut face: in a few seconds the shine turns dull and white. The oxygen and water in the air grab it at once. That is why sodium lives under oil: the oil keeps the air away.',
        ],
        sci: [
          'Sodium is soft (about 0.5 on the Mohs scale), melts at {melt} °C and has a density of {density} g/cm3, less than water.',
          'A fresh face stays bright only for seconds: 4 Na + O2 -> 2 Na2O, and with the moisture of the air NaOH, the white crust. Its single outer electron leaves easily (first ionisation energy {ie} kJ/mol), so it is stored under paraffin oil.',
        ],
      },
    },
    bowl: {
      label: 'The bowl of water',
      title: 'Sodium meets water',
      hints: {
        first: 'Tap a lump of sodium to drop it in the water',
        small: 'Now tap the small lump',
        medium: 'Now tap the medium lump',
        large: 'Now tap the large lump',
        indicator: 'Tap the indicator bottle to add a drop',
        again: 'Tap any lump to drop it in',
        watch: 'Watch the lump',
      },
      buttons: { small: 'Drop a small lump', medium: 'Drop a medium lump', large: 'Drop a large lump', indicator: 'Add a drop of indicator', bang: 'Watch the big one ({t})' },
      says: {
        notyet: { kid: 'Drop a lump of sodium in first: the indicator has nothing to show yet.', sci: 'In neutral water phenolphthalein stays colourless: react some sodium first.' },
        small: { kid: 'Too small to catch fire: it just fizzes away.', sci: 'A small piece loses its heat to the water faster than the hydrogen can ignite.' },
        flame: { kid: 'There! The hydrogen caught fire. See how orange it is?', sci: 'Ignition: hydrogen burning in air, coloured by sodium at 589 nm.' },
        bang: { kid: 'BANG! That is why they did it outside.', sci: 'The large lump: the hydrogen and air went off together.' },
        pink: { kid: 'Pink! The water has turned into an alkali.', sci: 'Phenolphthalein above pH 8.2: the water is now sodium hydroxide solution.' },
      },
      panel: {
        kid: [
          'Sodium is lighter than water, so it floats. The reaction makes so much heat that the sodium melts into a shiny ball, which zooms around on its own fizz.',
          'The fizz is hydrogen gas. When the ball gets hot enough, the hydrogen catches fire. The flame is orange because hot sodium glows that colour, like the old orange street lamps, which were filled with sodium.',
          'A big lump makes hydrogen so fast that it bangs. Try the three sizes, then add the indicator.',
        ],
        sci: [
          '2 Na + 2 H2O -> 2 NaOH + H2, giving out about 184 kJ per mole of sodium. The metal (density {density} g/cm3) floats, melts ({melt} °C) and is pushed around by the hydrogen forming under it.',
          'Once the bead is hot enough the hydrogen ignites in the air; the yellow-orange is the sodium D lines at 589.0 and 589.6 nm, the lines in the neon workshop\'s spectroscope. In 2015 high-speed films of drops of a liquid sodium-potassium alloy showed why the start is so violent: electrons leave the metal so fast that its positive ions push each other apart (a Coulomb explosion), spikes of metal shooting into the water.',
          'A large lump traps heat and gas until hydrogen and air go off together, throwing molten sodium out. Afterwards the water is sodium hydroxide solution: phenolphthalein turns pink in it.',
        ],
      },
    },
    window: {
      label: 'The salt window',
      crack: 'Crack it',
      again: 'Take a new window',
      hints: { crack: 'Tap the window to crack it', again: 'Tap the window to put in a new one' },
      title: 'Why salt cracks in squares',
      says: { kid: 'Look at the cracks: all straight, all at right angles!', sci: 'Cleavage along the cube faces, the {100} planes.' },
      panel: {
        kid: [
          'This clear window is made of salt: sodium chloride, the salt you eat, grown as one big crystal. Chemists use windows like this to shine invisible infrared light through.',
          'Crack it and look: the cracks run straight, at right angles, like the lines on squared paper. Inside, the sodium and chlorine pieces are stacked in tiny cubes, so the crystal splits along the faces of the cubes.',
        ],
        sci: [
          'NaCl has the rock-salt structure: Na+ and Cl- ions alternating on a cubic lattice with a cell edge of 564 pm. It cleaves along the {100} planes, the cube faces, so the cracks meet at 90°.',
          'Salt lets infrared light through where glass absorbs it, so infrared spectrometers have salt windows. They are kept dry: water dissolves them.',
        ],
      },
    },
    lamp: {
      label: 'The salt lamp',
      on: 'Switch it on',
      off: 'Switch it off',
      hints: { on: 'Tap the switch to turn it on', off: 'Tap the switch to turn it off' },
      title: 'A lamp of rock salt',
      panel: {
        kid: ['This lamp is a lump of rock salt with a bulb inside. Rock salt is the same sodium chloride, left behind when ancient seas dried up millions of years ago and were buried. Miners dig it out of the ground.'],
        sci: ['Rock salt (halite) beds formed as evaporites when shallow seas dried up; the salt field of Cheshire, in England, is Triassic, about 200 million years old. Pure halite is colourless: the warm colour comes from traces of iron oxides.'],
      },
    },
    note: {
      label: "The professor's card",
      read: 'Read it',
      title: 'Why Na?',
      panel: {
        kid: [
          'Professor Poliakoff likes sodium for a family reason: its symbol, Na, was the nickname of his mother, Ena, when she was a little girl.',
          'Na comes from natrium, the Latin name of sodium. That is why its symbol does not look like its English name.',
        ],
        sci: [
          'Professor Poliakoff\'s reason to like sodium: Na was the childhood nickname of his mother, Ena.',
          'The symbol comes from natrium, after natron, a natural sodium carbonate the ancient Egyptians used. Humphry Davy first made the metal in 1807, passing electricity through molten sodium hydroxide.',
        ],
      },
    },
  },
  'pt-pt': {
    forms: { el: 'sódio', El: 'Sódio', do_el: 'do sódio' },
    // the professor: what he says in the film, retold (times: videos.js `prof`)
    prof: {
      name: 'Professor Poliakoff',
      verb: 'Ouvir',
      next: 'A seguir',
      watch: 'Vê-lo a dizer isto ({t})',
      note: 'O que ele diz no filme, recontado pelo jogo. "Vê-lo a dizer isto" põe o filme nesse momento.',
      lines: [
        'O sódio é um metal leve, um pouco como o lítio, e funde a uma temperatura baixa, abaixo da de ebulição da água.',
        'Acabado de cortar, o sódio é um metal muito brilhante, mesmo bonito. Mas reage muito depressa com o ar e com a água: a crosta branca por fora é o hidróxido.',
        'Muitos de vocês sabem que, se deitarem sódio na água, ele reage de forma quase explosiva. Por isso, para as reações maiores, fomos lá para fora.',
        'O sal deixa passar a luz infravermelha, por isso serve para janelas de células de infravermelho. Esta está partida (foram os meus alunos), mas olhem: parte em ângulos retos, porque os átomos lá dentro estão arrumados em cubos.',
        'Este candeeiro de mesa é um pedaço de sal-gema natural, de debaixo da terra, provavelmente de Cheshire, onde há grandes minas de sal subterrâneas.',
        'Gosto do sódio porque Na era a alcunha da minha mãe quando era pequena: ela chamava-se Ena. Por isso, sempre que vejo sódio numa fórmula, sinto um carinho de mãe.',
      ],
    },
    greet: {
      kid: 'Olá! Este é o meu laboratório. Vê o meu vídeo no ecrã e depois faz tu as experiências. Começa pela lata de óleo, na bancada!',
      sci: 'Este laboratório reconstrói as experiências do filme dos Periodic Videos sobre o sódio: cortá-lo, deitá-lo na água e o seu sal. Cada posto põe a dar a sua parte do filme.',
    },
    talk: {
      kid: ['Sou tão mole que me cortas com uma faca.', 'Flutuo na água, depois corro de um lado para o outro e pego fogo!', 'O sal das tuas batatas fritas é metade eu: um sódio para cada cloro.'],
      sci: ['Um eletrão exterior, que dou à primeira oportunidade: é toda a minha química.', 'A minha chama é amarelo-alaranjada: 589 nm, as riscas D.', 'Humphry Davy fez-me pela primeira vez, em 1807, com eletricidade.'],
    },
    tin: {
      label: 'A lata de óleo',
      title: 'Sódio debaixo de óleo',
      hints: { lift: 'Toca na lata de óleo para tirares a barra', cut: 'Toca na faca para cortares uma fatia', fresh: 'Esta barra já acabou: toca na lata de óleo para tirares outra', watch: 'Olha para a face cortada' },
      buttons: { lift: 'Tirar uma barra do óleo', cut: 'Cortar uma fatia' },
      says: {
        lift: { kid: 'Cá está ela, a sair do óleo! O branco por fora é só uma crosta: o metal esconde-se lá dentro.', sci: 'A crosta é hidróxido (e carbonato) formado com o ar: só o interior é metal.' },
        cut: { kid: 'Olha para o corte: prateado e brilhante... agora vê como fica baço!', sci: 'Sódio acabado de cortar: um espelho por segundos, depois óxido e hidróxido.' },
      },
      panel: {
        kid: [
          'O sódio é um metal que se corta com uma faca, como manteiga fria. Por dentro brilha como a prata.',
          'Olha para a face cortada: em poucos segundos o brilho fica baço e branco. O oxigénio e a água do ar agarram-no logo. É por isso que o sódio vive debaixo de óleo: o óleo afasta o ar.',
        ],
        sci: [
          'O sódio é mole (cerca de 0,5 na escala de Mohs), funde a {melt} °C e tem uma densidade de {density} g/cm3, menor do que a da água.',
          'Uma face nova só brilha durante segundos: 4 Na + O2 -> 2 Na2O e, com a humidade do ar, NaOH, a crosta branca. O seu único eletrão exterior sai com facilidade (primeira energia de ionização {ie} kJ/mol), por isso guarda-se em óleo de parafina.',
        ],
      },
    },
    bowl: {
      label: 'A tigela de água',
      title: 'O sódio encontra a água',
      hints: {
        first: 'Toca num pedaço de sódio para o deitares na água',
        small: 'Agora toca no pedaço pequeno',
        medium: 'Agora toca no pedaço médio',
        large: 'Agora toca no pedaço grande',
        indicator: 'Toca no frasco de indicador para juntares uma gota',
        again: 'Toca em qualquer pedaço para o deitares na água',
        watch: 'Olha para o pedaço',
      },
      buttons: { small: 'Deitar um pedaço pequeno', medium: 'Deitar um pedaço médio', large: 'Deitar um pedaço grande', indicator: 'Juntar uma gota de indicador', bang: 'Ver o grande ({t})' },
      says: {
        notyet: { kid: 'Primeiro deita um pedaço de sódio na água: o indicador ainda não tem nada para mostrar.', sci: 'Em água neutra a fenolftaleína fica incolor: primeiro faz reagir algum sódio.' },
        small: { kid: 'Pequeno demais para pegar fogo: só se desfaz a borbulhar.', sci: 'Um pedaço pequeno perde o calor para a água mais depressa do que o hidrogénio se inflama.' },
        flame: { kid: 'Já está! O hidrogénio pegou fogo. Vês como é laranja?', sci: 'Ignição: hidrogénio a arder no ar, colorido pelo sódio a 589 nm.' },
        bang: { kid: 'PUM! É por isso que o fizeram lá fora.', sci: 'O pedaço grande: o hidrogénio e o ar explodiram juntos.' },
        pink: { kid: 'Cor-de-rosa! A água transformou-se numa base.', sci: 'Fenolftaleína acima de pH 8,2: a água é agora uma solução de hidróxido de sódio.' },
      },
      panel: {
        kid: [
          'O sódio é mais leve do que a água, por isso flutua. A reação faz tanto calor que o sódio derrete numa bolinha brilhante, que corre pela água empurrada pelas suas próprias bolhas.',
          'As bolhas são hidrogénio. Quando a bolinha aquece o suficiente, o hidrogénio pega fogo. A chama é laranja porque o sódio quente brilha dessa cor, como os antigos candeeiros de rua cor de laranja, que tinham sódio lá dentro.',
          'Um pedaço grande faz hidrogénio tão depressa que rebenta. Experimenta os três tamanhos e depois junta o indicador.',
        ],
        sci: [
          '2 Na + 2 H2O -> 2 NaOH + H2, libertando cerca de 184 kJ por mole de sódio. O metal (densidade {density} g/cm3) flutua, funde ({melt} °C) e é empurrado pelo hidrogénio que se forma por baixo dele.',
          'Quando a bolinha aquece o bastante, o hidrogénio inflama-se no ar; o amarelo-alaranjado são as riscas D do sódio, a 589,0 e 589,6 nm, as riscas do espectroscópio da oficina do néon. Em 2015, filmes de alta velocidade de gotas de uma liga líquida de sódio e potássio mostraram porque é que o início é tão violento: os eletrões saem do metal tão depressa que os seus iões positivos se repelem (uma explosão de Coulomb), com espigões de metal a disparar para a água.',
          'Um pedaço grande prende calor e gás até o hidrogénio e o ar explodirem juntos, atirando sódio fundido para fora. Depois, a água é uma solução de hidróxido de sódio: a fenolftaleína fica cor-de-rosa nela.',
        ],
      },
    },
    window: {
      label: 'A janela de sal',
      crack: 'Parti-la',
      again: 'Pegar numa janela nova',
      hints: { crack: 'Toca na janela para a partires', again: 'Toca na janela para pores uma nova' },
      title: 'Porque é que o sal parte aos quadrados',
      says: { kid: 'Olha para as fendas: todas direitas, todas em ângulo reto!', sci: 'Clivagem pelas faces do cubo, os planos {100}.' },
      panel: {
        kid: [
          'Esta janela transparente é feita de sal: cloreto de sódio, o sal que comes, crescido como um único cristal grande. Os químicos usam janelas assim para fazer passar luz infravermelha, que não se vê.',
          'Parte-a e olha: as fendas são direitas, em ângulo reto, como as linhas de uma folha quadriculada. Lá dentro, as peças de sódio e de cloro estão empilhadas em cubinhos, por isso o cristal parte pelas faces dos cubos.',
        ],
        sci: [
          'O NaCl tem a estrutura do sal-gema: iões Na+ e Cl- alternados numa rede cúbica com uma aresta de célula de 564 pm. Cliva pelos planos {100}, as faces do cubo, por isso as fendas encontram-se a 90°.',
          'O sal deixa passar a luz infravermelha que o vidro absorve, por isso os espectrómetros de infravermelho têm janelas de sal. Guardam-se em seco: a água dissolve-as.',
        ],
      },
    },
    lamp: {
      label: 'O candeeiro de sal',
      on: 'Acender',
      off: 'Apagar',
      hints: { on: 'Toca no interruptor para o acenderes', off: 'Toca no interruptor para o apagares' },
      title: 'Um candeeiro de sal-gema',
      panel: {
        kid: ['Este candeeiro é um pedaço de sal-gema com uma lâmpada lá dentro. O sal-gema é o mesmo cloreto de sódio, deixado para trás quando mares antigos secaram, há milhões de anos, e ficaram enterrados. Os mineiros tiram-no da terra.'],
        sci: ['As camadas de sal-gema (halite) formaram-se como evaporitos quando mares pouco fundos secaram; a jazida de sal de Cheshire, em Inglaterra, é do Triásico, com cerca de 200 milhões de anos. A halite pura é incolor: a cor quente vem de vestígios de óxidos de ferro.'],
      },
    },
    note: {
      label: 'O cartão do professor',
      read: 'Ler',
      title: 'Porquê Na?',
      panel: {
        kid: [
          'O Professor Poliakoff gosta do sódio por uma razão de família: o seu símbolo, Na, era a alcunha da mãe dele, Ena, quando era pequena.',
          'Na vem de natrium, o nome latino do sódio. É por isso que o símbolo não se parece com o nome em português.',
        ],
        sci: [
          'A razão do Professor Poliakoff para gostar do sódio: Na era a alcunha de infância da mãe dele, Ena.',
          'O símbolo vem de natrium, a partir de natrão, um carbonato de sódio natural que os antigos egípcios usavam. Humphry Davy obteve o metal pela primeira vez em 1807, fazendo passar eletricidade por hidróxido de sódio fundido.',
        ],
      },
    },
  },
  pl: {
    forms: { el: 'sód', El: 'Sód' },
    // the professor: what he says in the film, retold (times: videos.js `prof`)
    prof: {
      name: 'Profesor Poliakoff',
      verb: 'Posłuchaj',
      next: 'Dalej',
      watch: 'Zobacz, jak to mówi ({t})',
      note: 'To, co mówi w filmie, opowiedziane słowami gry. „Zobacz, jak to mówi” puszcza film w tej chwili.',
      lines: [
        'Sód to lekki metal, trochę jak lit, i topi się w niskiej temperaturze, niższej niż temperatura wrzenia wody.',
        'Świeżo pokrojony sód to bardzo błyszczący metal, naprawdę piękny. Ale bardzo szybko reaguje z powietrzem i z wodą: biały nalot na zewnątrz to wodorotlenek.',
        'Wielu z was wie, że sód wrzucony do wody reaguje niemal wybuchowo. Dlatego z większymi reakcjami wyszliśmy na dwór.',
        'Sól przepuszcza podczerwień, więc robi się z niej okienka do kuwet na podczerwień. To jest pęknięte (to moi studenci), ale spójrzcie: pęka pod kątem prostym, bo atomy w środku są ułożone w sześciany.',
        'Ta lampka to bryła naturalnej soli kamiennej spod ziemi, pewnie z Cheshire, gdzie są wielkie podziemne kopalnie soli.',
        'Lubię sód, bo Na było przezwiskiem mojej mamy, kiedy była dzieckiem: miała na imię Ena. Więc kiedy widzę sód we wzorze, czuję takie ciepło jak od mamy.',
      ],
    },
    greet: {
      kid: 'Cześć! To jest moje laboratorium. Obejrzyj mój film na ekranie, a potem zrób doświadczenia sam. Zacznij od puszki z olejem przy stole!',
      sci: 'To laboratorium odtwarza doświadczenia z filmu Periodic Videos o sodzie: krojenie, wrzucanie do wody i jego sól. Każde stanowisko puszcza swój fragment filmu.',
    },
    talk: {
      kid: ['Jestem tak miękki, że można mnie kroić nożem.', 'Pływam po wodzie, potem pędzę w kółko i się zapalam!', 'Sól na twoich frytkach to w połowie ja: jeden sód na każdy chlor.'],
      sci: ['Jeden elektron walencyjny, oddawany przy pierwszej okazji: to cała moja chemia.', 'Mój płomień jest żółtopomarańczowy: 589 nm, linie D.', 'Humphry Davy otrzymał mnie pierwszy, w 1807 roku, za pomocą prądu.'],
    },
    tin: {
      label: 'Puszka z olejem',
      title: 'Sód pod olejem',
      hints: { lift: 'Dotknij puszki z olejem, żeby wyjąć pręt', cut: 'Dotknij noża, żeby odkroić plasterek', fresh: 'Ten pręt się skończył: dotknij puszki z olejem, żeby wyjąć nowy', watch: 'Patrz na przekrój' },
      buttons: { lift: 'Wyjmij pręt z oleju', cut: 'Odkrój plasterek' },
      says: {
        lift: { kid: 'Wychodzi z oleju! Biała warstwa na zewnątrz to tylko skorupka: metal chowa się w środku.', sci: 'Skorupka to wodorotlenek (i węglan) z powietrza: metal jest tylko w środku.' },
        cut: { kid: 'Spójrz na przekrój: srebrny i błyszczący... a teraz zobacz, jak matowieje!', sci: 'Świeży sód: lustro przez kilka sekund, potem tlenek i wodorotlenek.' },
      },
      panel: {
        kid: [
          'Sód to metal, który można kroić nożem jak zimne masło. W środku błyszczy jak srebro.',
          'Popatrz na przekrój: po kilku sekundach blask matowieje i bieleje. Tlen i woda z powietrza od razu się do niego zabierają. Dlatego sód trzyma się pod olejem: olej nie dopuszcza powietrza.',
        ],
        sci: [
          'Sód jest miękki (około 0,5 w skali Mohsa), topi się w {melt} °C i ma gęstość {density} g/cm3, mniejszą niż woda.',
          'Świeża powierzchnia błyszczy tylko przez sekundy: 4 Na + O2 -> 2 Na2O, a z wilgocią powietrza NaOH, biały nalot. Jedyny elektron walencyjny odchodzi łatwo (pierwsza energia jonizacji {ie} kJ/mol), dlatego sód przechowuje się w oleju parafinowym.',
        ],
      },
    },
    bowl: {
      label: 'Miska z wodą',
      title: 'Sód spotyka wodę',
      hints: {
        first: 'Dotknij kawałka sodu, żeby wrzucić go do wody',
        small: 'Teraz dotknij małego kawałka',
        medium: 'Teraz dotknij średniego kawałka',
        large: 'Teraz dotknij dużego kawałka',
        indicator: 'Dotknij buteleczki ze wskaźnikiem, żeby dodać kroplę',
        again: 'Dotknij dowolnego kawałka, żeby go wrzucić',
        watch: 'Patrz na kawałek',
      },
      buttons: { small: 'Wrzuć mały kawałek', medium: 'Wrzuć średni kawałek', large: 'Wrzuć duży kawałek', indicator: 'Dodaj kroplę wskaźnika', bang: 'Obejrzyj ten duży ({t})' },
      says: {
        notyet: { kid: 'Najpierw wrzuć do wody kawałek sodu: wskaźnik nie ma jeszcze czego pokazać.', sci: 'W obojętnej wodzie fenoloftaleina jest bezbarwna: najpierw przeprowadź reakcję z sodem.' },
        small: { kid: 'Za mały, żeby się zapalić: po prostu znika, sycząc.', sci: 'Mały kawałek oddaje ciepło wodzie szybciej, niż wodór zdąży się zapalić.' },
        flame: { kid: 'Jest! Wodór się zapalił. Widzisz, jaki pomarańczowy?', sci: 'Zapłon: wodór płonie w powietrzu, zabarwiony przez sód przy 589 nm.' },
        bang: { kid: 'BUM! Dlatego robili to na dworze.', sci: 'Duży kawałek: wodór i powietrze wybuchły razem.' },
        pink: { kid: 'Różowa! Woda zmieniła się w zasadę.', sci: 'Fenoloftaleina powyżej pH 8,2: woda jest teraz roztworem wodorotlenku sodu.' },
      },
      panel: {
        kid: [
          'Sód jest lżejszy od wody, więc pływa. Reakcja daje tyle ciepła, że sód topi się w błyszczącą kulkę, która pędzi po wodzie na własnych bąbelkach.',
          'Bąbelki to wodór. Kiedy kulka dość się nagrzeje, wodór się zapala. Płomień jest pomarańczowy, bo gorący sód świeci tym kolorem, jak dawne pomarańczowe latarnie uliczne, w których był sód.',
          'Duży kawałek robi wodór tak szybko, że wybucha. Spróbuj trzech wielkości, a potem dodaj wskaźnik.',
        ],
        sci: [
          '2 Na + 2 H2O -> 2 NaOH + H2, z wydzieleniem około 184 kJ na mol sodu. Metal (gęstość {density} g/cm3) pływa, topi się ({melt} °C) i jest popychany przez wodór powstający pod nim.',
          'Gdy kulka jest dość gorąca, wodór zapala się w powietrzu; żółtopomarańczowy kolor to linie D sodu przy 589,0 i 589,6 nm, te same co w spektroskopie w pracowni neonów. W 2015 roku szybkie kamery, filmujące krople ciekłego stopu sodu z potasem, pokazały, czemu początek jest tak gwałtowny: elektrony opuszczają metal tak szybko, że jego dodatnie jony się odpychają (eksplozja kulombowska), a kolce metalu wystrzeliwują w wodę.',
          'Duży kawałek zatrzymuje ciepło i gaz, aż wodór z powietrzem wybuchną razem, wyrzucając stopiony sód. Potem woda jest roztworem wodorotlenku sodu: fenoloftaleina barwi się w nim na różowo.',
        ],
      },
    },
    window: {
      label: 'Solne okienko',
      crack: 'Pęknij je',
      again: 'Weź nowe okienko',
      hints: { crack: 'Dotknij okienka, żeby pękło', again: 'Dotknij okienka, żeby włożyć nowe' },
      title: 'Czemu sól pęka w kratkę',
      says: { kid: 'Spójrz na pęknięcia: wszystkie proste, wszystkie pod kątem prostym!', sci: 'Łupliwość wzdłuż ścian sześcianu, płaszczyzn {100}.' },
      panel: {
        kid: [
          'To przezroczyste okienko jest z soli: chlorku sodu, tej soli, którą jesz, wyhodowanej jako jeden wielki kryształ. Chemicy przepuszczają przez takie okienka niewidzialne światło podczerwone.',
          'Pęknij je i popatrz: pęknięcia biegną prosto, pod kątem prostym, jak linie w zeszycie w kratkę. W środku kawałki sodu i chloru są ułożone w malutkie sześciany, więc kryształ pęka wzdłuż ich ścian.',
        ],
        sci: [
          'NaCl ma strukturę soli kamiennej: jony Na+ i Cl- na przemian w sieci regularnej o krawędzi komórki 564 pm. Łupie się wzdłuż płaszczyzn {100}, ścian sześcianu, więc pęknięcia spotykają się pod kątem 90°.',
          'Sól przepuszcza podczerwień, którą szkło pochłania, dlatego spektrometry podczerwieni mają okienka z soli. Trzyma się je w suchym miejscu: woda je rozpuszcza.',
        ],
      },
    },
    lamp: {
      label: 'Lampa solna',
      on: 'Włącz',
      off: 'Wyłącz',
      hints: { on: 'Dotknij przełącznika, żeby ją włączyć', off: 'Dotknij przełącznika, żeby ją wyłączyć' },
      title: 'Lampa z soli kamiennej',
      panel: {
        kid: ['Ta lampa to bryła soli kamiennej z żarówką w środku. Sól kamienna to ten sam chlorek sodu, który został, gdy dawne morza wyschły miliony lat temu i zostały zasypane. Górnicy wydobywają ją spod ziemi.'],
        sci: ['Pokłady soli kamiennej (halitu) powstały jako ewaporaty, gdy płytkie morza wysychały; złoże soli w Cheshire w Anglii pochodzi z triasu, ma około 200 milionów lat. Czysty halit jest bezbarwny: ciepły kolor dają ślady tlenków żelaza.'],
      },
    },
    note: {
      label: 'Kartka profesora',
      read: 'Przeczytaj',
      title: 'Dlaczego Na?',
      panel: {
        kid: [
          'Profesor Poliakoff lubi sód z rodzinnego powodu: jego symbol, Na, był przezwiskiem jego mamy, Eny, kiedy była małą dziewczynką.',
          'Na pochodzi od natrium, łacińskiej nazwy sodu. Dlatego symbol nie przypomina polskiej nazwy.',
        ],
        sci: [
          'Powód, dla którego profesor Poliakoff lubi sód: Na było przezwiskiem z dzieciństwa jego mamy, Eny.',
          'Symbol pochodzi od natrium, od natronu, naturalnego węglanu sodu, którego używali starożytni Egipcjanie. Humphry Davy otrzymał metal pierwszy w 1807 roku, przepuszczając prąd przez stopiony wodorotlenek sodu.',
        ],
      },
    },
  },
  de: {
    forms: { el: 'Natrium', El: 'Natrium' },
    // the professor: what he says in the film, retold (times: videos.js `prof`)
    prof: {
      name: 'Professor Poliakoff',
      verb: 'Zuhören',
      next: 'Weiter',
      watch: 'Ihn das sagen sehen ({t})',
      note: 'Was er im Film sagt, in den Worten des Spiels nacherzählt. „Ihn das sagen sehen“ spielt die Stelle ab.',
      lines: [
        'Natrium ist ein leichtes Metall, ein bisschen wie Lithium, und es schmilzt schon bei niedriger Temperatur, unter dem Siedepunkt von Wasser.',
        'Frisch geschnitten ist Natrium ein sehr glänzendes Metall, wirklich schön. Aber es reagiert sehr schnell mit Luft und Wasser: Die weiße Kruste außen ist das Hydroxid.',
        'Viele von euch wissen: Wirft man Natrium ins Wasser, reagiert es fast explosiv. Für die größeren Reaktionen sind wir deshalb nach draußen gegangen.',
        'Salz lässt Infrarotlicht durch, darum macht man daraus Fenster für Infrarotzellen. Dieses ist kaputt (das waren meine Studenten), aber seht: Es bricht im rechten Winkel, weil die Atome darin in Würfeln angeordnet sind.',
        'Diese Tischlampe ist ein Brocken natürliches Steinsalz aus der Erde, wahrscheinlich aus Cheshire, wo es große unterirdische Salzbergwerke gibt.',
        'Ich mag Natrium, weil Na der Spitzname meiner Mutter war, als sie ein Kind war: Sie hieß Ena. Wenn ich Natrium in einer Formel sehe, habe ich deshalb ein warmes, mütterliches Gefühl.',
      ],
    },
    greet: {
      kid: 'Hallo! Das ist mein Labor. Sieh dir mein Video auf dem Bildschirm an und mach dann die Versuche selbst. Fang bei der Öldose am Labortisch an!',
      sci: 'Dieses Labor baut die Versuche aus dem Film von Periodic Videos über Natrium nach: schneiden, ins Wasser werfen und sein Salz. Jede Station spielt ihren Teil des Films ab.',
    },
    talk: {
      kid: ['Ich bin so weich, dass man mich mit einem Messer schneiden kann.', 'Ich schwimme auf dem Wasser, dann sause ich herum und fange Feuer!', 'Das Salz auf deinen Pommes ist zur Hälfte ich: ein Natrium auf jedes Chlor.'],
      sci: ['Ein Außenelektron, das ich bei der ersten Gelegenheit abgebe: Das ist meine ganze Chemie.', 'Meine Flamme ist gelborange: 589 nm, die D-Linien.', 'Humphry Davy stellte mich 1807 als Erster her, mit Strom.'],
    },
    tin: {
      label: 'Die Öldose',
      title: 'Natrium unter Öl',
      hints: { lift: 'Tippe auf die Öldose, um die Stange herauszuholen', cut: 'Tippe auf das Messer, um eine Scheibe abzuschneiden', fresh: 'Diese Stange ist aufgebraucht: Tippe auf die Öldose für eine neue', watch: 'Schau auf die Schnittfläche' },
      buttons: { lift: 'Eine Stange aus dem Öl holen', cut: 'Eine Scheibe abschneiden' },
      says: {
        lift: { kid: 'Raus aus dem Öl! Das Weiße außen ist nur eine Kruste: Das Metall versteckt sich innen.', sci: 'Die Kruste ist Hydroxid (und Carbonat) aus der Luft: Nur das Innere ist Metall.' },
        cut: { kid: 'Sieh dir den Schnitt an: silbern und glänzend... und jetzt schau, wie er matt wird!', sci: 'Frisches Natrium: ein paar Sekunden ein Spiegel, dann Oxid und Hydroxid.' },
      },
      panel: {
        kid: [
          'Natrium ist ein Metall, das man mit einem Messer schneiden kann wie kalte Butter. Innen glänzt es wie Silber.',
          'Schau auf die Schnittfläche: Nach ein paar Sekunden wird der Glanz matt und weiß. Sauerstoff und Wasser aus der Luft greifen es sofort an. Darum wohnt Natrium unter Öl: Das Öl hält die Luft fern.',
        ],
        sci: [
          'Natrium ist weich (etwa 0,5 auf der Mohs-Skala), schmilzt bei {melt} °C und hat eine Dichte von {density} g/cm3, weniger als Wasser.',
          'Eine frische Fläche glänzt nur Sekunden: 4 Na + O2 -> 2 Na2O, mit der Luftfeuchtigkeit NaOH, die weiße Kruste. Sein einziges Außenelektron geht leicht ab (erste Ionisierungsenergie {ie} kJ/mol), darum lagert man es unter Paraffinöl.',
        ],
      },
    },
    bowl: {
      label: 'Die Wasserschüssel',
      title: 'Natrium trifft Wasser',
      hints: {
        first: 'Tippe auf ein Stück Natrium, um es ins Wasser zu werfen',
        small: 'Tippe jetzt auf das kleine Stück',
        medium: 'Tippe jetzt auf das mittlere Stück',
        large: 'Tippe jetzt auf das große Stück',
        indicator: 'Tippe auf die Indikatorflasche, um einen Tropfen dazuzugeben',
        again: 'Tippe auf irgendein Stück, um es hineinzuwerfen',
        watch: 'Schau dem Stück zu',
      },
      buttons: { small: 'Ein kleines Stück hineinwerfen', medium: 'Ein mittleres Stück hineinwerfen', large: 'Ein großes Stück hineinwerfen', indicator: 'Einen Tropfen Indikator dazugeben', bang: 'Das große ansehen ({t})' },
      says: {
        notyet: { kid: 'Wirf zuerst ein Stück Natrium hinein: Der Indikator hat noch nichts zu zeigen.', sci: 'In neutralem Wasser bleibt Phenolphthalein farblos: Lass zuerst etwas Natrium reagieren.' },
        small: { kid: 'Zu klein, um Feuer zu fangen: Es zischt einfach weg.', sci: 'Ein kleines Stück gibt seine Wärme schneller ans Wasser ab, als der Wasserstoff zünden kann.' },
        flame: { kid: 'Da! Der Wasserstoff hat Feuer gefangen. Siehst du, wie orange er ist?', sci: 'Zündung: Wasserstoff brennt an der Luft, gefärbt vom Natrium bei 589 nm.' },
        bang: { kid: 'PENG! Darum haben sie es draußen gemacht.', sci: 'Das große Stück: Wasserstoff und Luft sind zusammen explodiert.' },
        pink: { kid: 'Pink! Das Wasser ist zu einer Lauge geworden.', sci: 'Phenolphthalein über pH 8,2: Das Wasser ist jetzt Natronlauge.' },
      },
      panel: {
        kid: [
          'Natrium ist leichter als Wasser, darum schwimmt es. Die Reaktion macht so viel Wärme, dass das Natrium zu einer glänzenden Kugel schmilzt, die auf ihren eigenen Bläschen herumflitzt.',
          'Die Bläschen sind Wasserstoff. Wird die Kugel heiß genug, fängt der Wasserstoff Feuer. Die Flamme ist orange, weil heißes Natrium in dieser Farbe leuchtet, wie die alten orangen Straßenlaternen, in denen Natrium war.',
          'Ein großes Stück macht so schnell Wasserstoff, dass es knallt. Probiere die drei Größen und gib dann den Indikator dazu.',
        ],
        sci: [
          '2 Na + 2 H2O -> 2 NaOH + H2; dabei werden etwa 184 kJ pro Mol Natrium frei. Das Metall (Dichte {density} g/cm3) schwimmt, schmilzt ({melt} °C) und wird vom Wasserstoff angetrieben, der sich darunter bildet.',
          'Ist die Kugel heiß genug, zündet der Wasserstoff an der Luft; das Gelborange sind die D-Linien des Natriums bei 589,0 und 589,6 nm, die Linien im Spektroskop der Neonwerkstatt. 2015 zeigten Hochgeschwindigkeitsaufnahmen von Tropfen einer flüssigen Natrium-Kalium-Legierung, warum der Anfang so heftig ist: Die Elektronen verlassen das Metall so schnell, dass sich seine positiven Ionen abstoßen (eine Coulomb-Explosion) und Metallspitzen ins Wasser schießen.',
          'Ein großes Stück hält Wärme und Gas zurück, bis Wasserstoff und Luft zusammen explodieren und geschmolzenes Natrium herausschleudern. Danach ist das Wasser Natronlauge: Phenolphthalein färbt sich darin pink.',
        ],
      },
    },
    window: {
      label: 'Das Salzfenster',
      crack: 'Zerbrechen',
      again: 'Ein neues Fenster nehmen',
      hints: { crack: 'Tippe auf das Fenster, um es zu zerbrechen', again: 'Tippe auf das Fenster, um ein neues einzusetzen' },
      title: 'Warum Salz in Quadraten bricht',
      says: { kid: 'Schau dir die Risse an: alle gerade, alle im rechten Winkel!', sci: 'Spaltung entlang der Würfelflächen, der {100}-Ebenen.' },
      panel: {
        kid: [
          'Dieses durchsichtige Fenster ist aus Salz: Natriumchlorid, das Salz, das du isst, gewachsen als ein großer Kristall. Chemiker schicken durch solche Fenster unsichtbares Infrarotlicht.',
          'Zerbrich es und schau: Die Risse laufen gerade, im rechten Winkel, wie die Linien auf Karopapier. Innen sind die Natrium- und Chlorteilchen in winzigen Würfeln gestapelt, darum bricht der Kristall entlang der Würfelflächen.',
        ],
        sci: [
          'NaCl hat die Steinsalzstruktur: Na+- und Cl--Ionen abwechselnd auf einem kubischen Gitter mit 564 pm Kantenlänge der Zelle. Es spaltet entlang der {100}-Ebenen, der Würfelflächen, darum treffen sich die Risse unter 90°.',
          'Salz lässt Infrarotlicht durch, das Glas verschluckt, darum haben Infrarotspektrometer Salzfenster. Man hält sie trocken: Wasser löst sie auf.',
        ],
      },
    },
    lamp: {
      label: 'Die Salzlampe',
      on: 'Einschalten',
      off: 'Ausschalten',
      hints: { on: 'Tippe auf den Schalter, um sie einzuschalten', off: 'Tippe auf den Schalter, um sie auszuschalten' },
      title: 'Eine Lampe aus Steinsalz',
      panel: {
        kid: ['Diese Lampe ist ein Brocken Steinsalz mit einer Glühbirne darin. Steinsalz ist dasselbe Natriumchlorid, übrig geblieben, als alte Meere vor Millionen Jahren austrockneten und verschüttet wurden. Bergleute holen es aus der Erde.'],
        sci: ['Steinsalzlager (Halit) entstanden als Evaporite, wenn flache Meere austrockneten; das Salzlager von Cheshire in England stammt aus der Trias, etwa 200 Millionen Jahre alt. Reiner Halit ist farblos: Die warme Farbe kommt von Spuren von Eisenoxiden.'],
      },
    },
    note: {
      label: 'Die Karte des Professors',
      read: 'Lesen',
      title: 'Warum Na?',
      panel: {
        kid: [
          'Professor Poliakoff mag Natrium aus einem Familiengrund: Sein Symbol, Na, war der Spitzname seiner Mutter Ena, als sie ein kleines Mädchen war.',
          'Na kommt von Natrium, dem lateinischen Namen. Im Deutschen heißt es genauso, im Englischen aber sodium.',
        ],
        sci: [
          'Professor Poliakoffs Grund, Natrium zu mögen: Na war der Kindheitsspitzname seiner Mutter Ena.',
          'Das Symbol kommt von Natrium, nach Natron, einem natürlichen Natriumcarbonat, das schon die alten Ägypter benutzten. Humphry Davy stellte das Metall 1807 als Erster her, indem er Strom durch geschmolzenes Natriumhydroxid schickte.',
        ],
      },
    },
  },
}
