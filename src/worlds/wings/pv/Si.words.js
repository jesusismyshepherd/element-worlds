// Silicon's Periodic Videos room: the words of its stations (docs/pv/Si.md), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). {melt} °C, {density} g/cm3, {crust} % come from the
// game's data. The professor's lines retell only what he says in the film (times: videos.js `prof`).
export const SI_WORDS = {
  en: {
    forms: { el: 'silicon', El: 'Silicon' },
    prof: {
      name: 'Professor Poliakoff',
      verb: 'Listen',
      next: 'Next',
      watch: 'Watch him say it ({t})',
      note: 'What he says in the film, retold in the game\'s words. "Watch him say it" plays the moment.',
      lines: [
        'Silicon is a very common element. It is found particularly in sand, which is silica: the compound of silicon and oxygen.',
        'It is also in a huge number of minerals called silicates, made of silicon, oxygen and another metal. Unless you are a specialist that sounds boring, but like everything, when you really go into it, it becomes quite interesting.',
        'Silicon is the basis of most of the electronic devices we use: my watch, your video camera, and computers.',
        'This is pure silicon on the back. On the front people have grown chips, Pentium 4s I think, with their connectors on either side, a whole lot of them at once.',
        'They are chopped up and tested: the ones that work go into computers, and the ones that are no good are thrown away. A fantastically delicate piece of engineering.',
        'This is a 20 centimetre wafer. Now they make chips on 30 centimetre wafers, about this size, and get many more on each.',
        'Silicon nitride is extremely tough and very light, so it is used for the impellers in car turbochargers: it spins up very fast when you press the accelerator, and it does not fall to bits as it revs up.',
      ],
    },
    greet: {
      kid: 'Hi! I am silicon, the element inside computers. Watch my video on the screen, then try the experiments. Start with my lump in the cupboard on the bench!',
      sci: "This lab rebuilds what silicon's Periodic Videos film shows: the lump, the wafer and its chips, and silicon nitride. Each station plays its own part of the film.",
    },
    talk: {
      kid: ['There is more of me in the ground than anything except oxygen.', 'Every computer, phone and games console thinks with chips made of me.', 'The sand on the beach is me, held tight by oxygen.'],
      sci: ['Four outer electrons: I bond like carbon, but I much prefer oxygen.', 'Purified until only one atom in a billion is not me, I become a chip.', 'Jöns Berzelius first isolated me, in 1824.'],
    },
    lump: {
      label: 'The silicon lump',
      take: 'Take it out',
      turn: 'Turn it in the light',
      title: 'Silicon from sand',
      says: { kid: 'Look how it glitters! Every sparkle is a crystal of its own.', sci: 'Polycrystalline: many small crystals, each catching the light at its own angle.' },
      panel: {
        kid: [
          'This shiny lump is pure silicon. It glitters because it is made of many little crystals, and each one catches the light at its own angle.',
          'Silicon is everywhere, but never on its own: in the sand beside it, silicon is held tightly by oxygen. Sand is silica, the same stuff as quartz and glass. After oxygen, silicon is the most common element in the ground under your feet.',
        ],
        sci: [
          "Silicon makes up about {crust}% of the Earth's crust by mass, second only to oxygen, but always bound to oxygen: silica (SiO2) and the silicates. It melts at {melt} °C and has a density of {density} g/cm3.",
          'It is won from quartz with carbon in an electric arc furnace at about 2000 °C (SiO2 + 2 C -> Si + 2 CO), then purified until only about one atom in a billion is something else. Grown slowly from the melt as one single crystal it becomes the wafers of chips; this lump is polycrystalline: many crystals, each turned its own way.',
        ],
      },
    },
    chips: {
      label: 'The chip line',
      cut: 'Cut the wafer',
      test: 'Test the chips',
      sort: 'Sort them',
      again: 'Take the next wafer',
      working: 'Working',
      title: 'Making chips',
      buttons: { small: 'A 20 cm wafer', big: 'A 30 cm wafer' },
      says: {
        cut: { kid: 'Snip! Every little square is a chip.', sci: 'Diced along the lines between the dies.' },
        test: { kid: 'Green works, red does not.', sci: 'Each die is probed: the share that works is the yield.' },
        sorted: { kid: '{good} chips for computers, {bad} in the bin.', sci: 'Yield: {good} of {all} dies, {pct}%.' },
        big: { kid: 'The big wafer holds many more chips!', sci: 'A 30 cm wafer has 2.25 times the area of a 20 cm one.' },
      },
      panel: {
        kid: [
          'A wafer is a thin disc of silicon cut from one big crystal. Factories make hundreds of chips on it at once, in rows.',
          'Then the wafer is cut into squares, every chip is tested, and only the ones that work go into computers and phones. The rest are thrown away. Try it, then try the bigger wafer.',
        ],
        sci: [
          'Hundreds of dies are made at once on each wafer by photolithography, layer by layer; then the wafer is diced along the lines between them and each die is tested. The share that works is the yield.',
          'A 30 cm wafer has 2.25 times the area of a 20 cm one, so it carries more than twice as many chips; most chips today are made on 30 cm wafers.',
        ],
      },
    },
    wafer: {
      label: 'The wafer',
      flip: 'Turn it over',
      tilt: 'Tilt',
      title: 'A rainbow on a chip',
      says: {
        front: { kid: 'Tilt it: a rainbow!', sci: "Diffraction from the circuits' repeating patterns." },
        back: { kid: 'The back is a mirror of pure silicon.', sci: 'Polished single-crystal silicon: a grey mirror.' },
      },
      panel: {
        kid: [
          'The back of a wafer is a grey mirror of pure silicon. The front is covered in chips.',
          'Tilt it under the lamp and a rainbow slides across the chips. Their tiny circuits repeat in lines much finer than a hair, and lines that fine split white light into its colours, like the back of a CD.',
        ],
        sci: [
          'The wafer is sliced from a single crystal grown from the melt and polished to a mirror on one side; the chips are built into that face.',
          "The circuits' repeating patterns, about as fine as a CD's grooves (1.6 µm) or finer, act as a diffraction grating: each colour leaves at its own angle (d sin θ = m λ), so tilting the wafer sweeps the spectrum across it.",
        ],
      },
    },
    turbo: {
      label: 'The turbocharger',
      press: 'Press the pedal',
      title: 'A wheel of silicon nitride',
      steel: 'Steel',
      ceramic: 'Silicon nitride',
      says: { kid: 'The light wheel wins every time!', sci: 'The same push, about 2.5 times less to turn: it spins up first.' },
      panel: {
        kid: [
          "A turbocharger pushes extra air into a car's engine with a little wheel that spins incredibly fast in the hot exhaust.",
          'Make that wheel from silicon nitride, a ceramic of silicon and nitrogen, and it is much lighter than steel but just as tough, so it spins up faster when you press the pedal. Press it and watch the two wheels race.',
        ],
        sci: [
          'Silicon nitride (Si3N4) has a density of about 3.2 g/cm3, against about 7.9 g/cm3 for steel; for wheels of the same shape the moment of inertia goes with the mass, so the same torque spins the ceramic one up about 2.5 times faster.',
          'It keeps its strength above 1000 °C and shrugs off sudden heating, which is why ceramic turbine wheels went into production cars in the 1980s.',
        ],
      },
    },
    minerals: {
      label: 'The minerals',
      look: 'Look at the next one',
      title: 'Sand, rock and silicates',
      names: { quartz: 'Quartz', mica: 'Mica', feldspar: 'Feldspar', garnet: 'Garnet' },
      says: {
        quartz: { kid: 'Quartz: sand is mostly tiny bits of it.', sci: 'Quartz, SiO2: every SiO4 tetrahedron shares all four corners, a framework in three dimensions.' },
        mica: { kid: 'Mica peels into sheets thinner than paper.', sci: 'Mica: SiO4 tetrahedra joined in sheets, so it splits into flakes.' },
        feldspar: { kid: "Feldspar: the most common mineral in the Earth's crust.", sci: 'Feldspar: a framework silicate with aluminium, and sodium, potassium or calcium.' },
        garnet: { kid: 'Garnet: a red gem made of silicate.', sci: 'Garnet: separate SiO4 tetrahedra held together by metal ions.' },
      },
      panel: {
        kid: [
          'Most rocks are made of silicates: silicon and oxygen joined with metals. Quartz, mica, feldspar and garnet are all silicates, and sand is mostly crushed quartz.',
          'Use the table again to look at each one.',
        ],
        sci: [
          'In every silicate the basic piece is the SiO4 tetrahedron: one silicon among four oxygens. How the tetrahedra share their corners decides the mineral: alone (garnet), in sheets (mica), or in a framework (quartz, feldspar).',
          'Feldspars are the most abundant minerals of the crust, and silicates make up about 90% of it.',
        ],
      },
    },
  },
  'pt-pt': {
    forms: { el: 'silício', El: 'Silício', do_el: 'do silício' },
    prof: {
      name: 'Professor Poliakoff',
      verb: 'Ouvir',
      next: 'A seguir',
      watch: 'Vê-lo a dizer isto ({t})',
      note: 'O que ele diz no filme, recontado pelo jogo. "Vê-lo a dizer isto" põe o filme nesse momento.',
      lines: [
        'O silício é um elemento muito comum. Encontra-se sobretudo na areia, que é sílica: o composto de silício e oxigénio.',
        'Também está num número enorme de minerais chamados silicatos, feitos de silício, oxigénio e outro metal. Para quem não é especialista parece aborrecido, mas, como tudo, quando se vai a fundo torna-se bastante interessante.',
        'O silício é a base da maior parte dos aparelhos eletrónicos que usamos: o meu relógio, a vossa câmara de vídeo e os computadores.',
        'Isto é silício puro, na parte de trás. À frente, cresceram chips, Pentium 4, acho eu, com os conectores dos dois lados, muitos de uma só vez.',
        'São cortados e testados: os que funcionam vão para os computadores e os que não prestam vão para o lixo. Uma peça de engenharia fantasticamente delicada.',
        'Isto é uma bolacha de 20 centímetros. Agora fazem chips em bolachas de 30 centímetros, mais ou menos deste tamanho, e cabem muitos mais em cada uma.',
        'O nitreto de silício é extremamente resistente e muito leve, por isso usa-se nos rotores dos turbocompressores dos carros: acelera muito depressa quando carregas no acelerador e não se desfaz a girar.',
      ],
    },
    greet: {
      kid: 'Olá! Sou o silício, o elemento que está dentro dos computadores. Vê o meu vídeo no ecrã e depois experimenta. Começa pelo meu pedaço no armário da bancada!',
      sci: 'Este laboratório reconstrói o que o filme dos Periodic Videos sobre o silício mostra: o pedaço, a bolacha e os seus chips, e o nitreto de silício. Cada posto põe a dar a sua parte do filme.',
    },
    talk: {
      kid: ['No chão há mais de mim do que de qualquer outro elemento, tirando o oxigénio.', 'Todos os computadores, telemóveis e consolas pensam com chips feitos de mim.', 'A areia da praia sou eu, bem agarrado ao oxigénio.'],
      sci: ['Quatro eletrões exteriores: ligo-me como o carbono, mas prefiro muito o oxigénio.', 'Purificado até só um átomo em mil milhões não ser eu, torno-me um chip.', 'Jöns Berzelius isolou-me pela primeira vez, em 1824.'],
    },
    lump: {
      label: 'O pedaço de silício',
      take: 'Tirá-lo',
      turn: 'Rodá-lo à luz',
      title: 'Silício a partir da areia',
      says: { kid: 'Olha como brilha! Cada cintilação é um cristal só seu.', sci: 'Policristalino: muitos cristais pequenos, cada um a apanhar a luz no seu ângulo.' },
      panel: {
        kid: [
          'Este pedaço brilhante é silício puro. Cintila porque é feito de muitos cristais pequeninos, e cada um apanha a luz no seu próprio ângulo.',
          'O silício está em todo o lado, mas nunca sozinho: na areia ao lado, o silício está bem agarrado ao oxigénio. A areia é sílica, a mesma coisa que o quartzo e o vidro. Depois do oxigénio, o silício é o elemento mais comum no chão que pisas.',
        ],
        sci: [
          'O silício forma cerca de {crust}% da massa da crosta terrestre, só atrás do oxigénio, mas sempre ligado ao oxigénio: sílica (SiO2) e silicatos. Funde a {melt} °C e tem uma densidade de {density} g/cm3.',
          'Obtém-se do quartzo com carbono num forno de arco elétrico a cerca de 2000 °C (SiO2 + 2 C -> Si + 2 CO) e depois purifica-se até só cerca de um átomo em mil milhões ser outra coisa. Crescido devagar a partir do material fundido como um único cristal, dá as bolachas dos chips; este pedaço é policristalino: muitos cristais, cada um virado para o seu lado.',
        ],
      },
    },
    chips: {
      label: 'A linha de chips',
      cut: 'Cortar a bolacha',
      test: 'Testar os chips',
      sort: 'Separá-los',
      again: 'Pegar na bolacha seguinte',
      working: 'A trabalhar',
      title: 'Fazer chips',
      buttons: { small: 'Uma bolacha de 20 cm', big: 'Uma bolacha de 30 cm' },
      says: {
        cut: { kid: 'Zás! Cada quadradinho é um chip.', sci: 'Cortada pelas linhas entre os chips.' },
        test: { kid: 'Verde funciona, vermelho não.', sci: 'Cada chip é testado: a fração que funciona é o rendimento.' },
        sorted: { kid: '{good} chips para computadores, {bad} para o lixo.', sci: 'Rendimento: {good} de {all} chips, {pct}%.' },
        big: { kid: 'A bolacha grande leva muitos mais chips!', sci: 'Uma bolacha de 30 cm tem 2,25 vezes a área de uma de 20 cm.' },
      },
      panel: {
        kid: [
          'Uma bolacha é um disco fino de silício cortado de um grande cristal. As fábricas fazem centenas de chips nela de uma só vez, em filas.',
          'Depois a bolacha é cortada em quadrados, cada chip é testado e só os que funcionam vão para computadores e telemóveis. Os outros vão para o lixo. Experimenta e depois tenta a bolacha maior.',
        ],
        sci: [
          'Centenas de chips fazem-se de uma vez em cada bolacha por fotolitografia, camada a camada; depois a bolacha é cortada pelas linhas entre eles e cada chip é testado. A fração que funciona é o rendimento.',
          'Uma bolacha de 30 cm tem 2,25 vezes a área de uma de 20 cm, por isso leva mais do dobro dos chips; hoje a maior parte dos chips faz-se em bolachas de 30 cm.',
        ],
      },
    },
    wafer: {
      label: 'A bolacha',
      flip: 'Virá-la',
      tilt: 'Inclinar',
      title: 'Um arco-íris num chip',
      says: {
        front: { kid: 'Inclina-a: um arco-íris!', sci: 'Difração nos padrões repetidos dos circuitos.' },
        back: { kid: 'A parte de trás é um espelho de silício puro.', sci: 'Silício monocristalino polido: um espelho cinzento.' },
      },
      panel: {
        kid: [
          'A parte de trás de uma bolacha é um espelho cinzento de silício puro. A frente está coberta de chips.',
          'Inclina-a debaixo do candeeiro e um arco-íris desliza pelos chips. Os seus circuitos minúsculos repetem-se em linhas muito mais finas do que um cabelo, e linhas tão finas separam a luz branca nas suas cores, como a parte de trás de um CD.',
        ],
        sci: [
          'A bolacha é cortada de um único cristal crescido a partir do material fundido e polida até ficar um espelho de um lado; os chips são construídos nessa face.',
          'Os padrões repetidos dos circuitos, tão finos como os sulcos de um CD (1,6 µm) ou mais, funcionam como uma rede de difração: cada cor sai no seu ângulo (d sen θ = m λ), por isso inclinar a bolacha faz o espectro deslizar por ela.',
        ],
      },
    },
    turbo: {
      label: 'O turbocompressor',
      press: 'Carregar no pedal',
      title: 'Uma roda de nitreto de silício',
      steel: 'Aço',
      ceramic: 'Nitreto de silício',
      says: { kid: 'A roda leve ganha sempre!', sci: 'O mesmo empurrão, cerca de 2,5 vezes menos para rodar: acelera primeiro.' },
      panel: {
        kid: [
          'Um turbocompressor empurra mais ar para dentro do motor de um carro com uma rodinha que gira incrivelmente depressa nos gases quentes do escape.',
          'Se essa roda for de nitreto de silício, uma cerâmica de silício e azoto, é muito mais leve do que o aço mas igualmente resistente, por isso acelera mais depressa quando carregas no pedal. Carrega e vê as duas rodas a correr.',
        ],
        sci: [
          'O nitreto de silício (Si3N4) tem uma densidade de cerca de 3,2 g/cm3, contra cerca de 7,9 g/cm3 do aço; para rodas com a mesma forma, o momento de inércia acompanha a massa, por isso o mesmo binário acelera a de cerâmica cerca de 2,5 vezes mais depressa.',
          'Mantém a resistência acima de 1000 °C e aguenta aquecimentos bruscos, e é por isso que as rodas de turbina de cerâmica entraram em carros de série nos anos 80.',
        ],
      },
    },
    minerals: {
      label: 'Os minerais',
      look: 'Ver o seguinte',
      title: 'Areia, rocha e silicatos',
      names: { quartz: 'Quartzo', mica: 'Mica', feldspar: 'Feldspato', garnet: 'Granada' },
      says: {
        quartz: { kid: 'Quartzo: a areia é sobretudo pedacinhos dele.', sci: 'Quartzo, SiO2: cada tetraedro SiO4 partilha os quatro vértices, uma estrutura em três dimensões.' },
        mica: { kid: 'A mica separa-se em folhas mais finas do que papel.', sci: 'Mica: tetraedros SiO4 ligados em folhas, por isso parte-se em lâminas.' },
        feldspar: { kid: 'Feldspato: o mineral mais comum da crosta terrestre.', sci: 'Feldspato: um silicato em estrutura tridimensional com alumínio e sódio, potássio ou cálcio.' },
        garnet: { kid: 'Granada: uma pedra preciosa vermelha feita de silicato.', sci: 'Granada: tetraedros SiO4 separados, unidos por iões metálicos.' },
      },
      panel: {
        kid: [
          'A maior parte das rochas é feita de silicatos: silício e oxigénio juntos com metais. O quartzo, a mica, o feldspato e a granada são todos silicatos, e a areia é sobretudo quartzo moído.',
          'Usa a mesa outra vez para ver cada um.',
        ],
        sci: [
          'Em todos os silicatos a peça base é o tetraedro SiO4: um silício entre quatro oxigénios. A forma como os tetraedros partilham os vértices decide o mineral: isolados (granada), em folhas (mica) ou numa estrutura tridimensional (quartzo, feldspato).',
          'Os feldspatos são os minerais mais abundantes da crosta, e os silicatos formam cerca de 90% dela.',
        ],
      },
    },
  },
  pl: {
    forms: { el: 'krzem', El: 'Krzem' },
    prof: {
      name: 'Profesor Poliakoff',
      verb: 'Posłuchaj',
      next: 'Dalej',
      watch: 'Zobacz, jak to mówi ({t})',
      note: 'To, co mówi w filmie, opowiedziane słowami gry. „Zobacz, jak to mówi” puszcza film w tej chwili.',
      lines: [
        'Krzem to bardzo pospolity pierwiastek. Zwłaszcza w piasku, który jest krzemionką: związkiem krzemu i tlenu.',
        'Jest też w ogromnej liczbie minerałów zwanych krzemianami, zbudowanych z krzemu, tlenu i innego metalu. Kto nie jest specjalistą, uzna to za nudne, ale jak ze wszystkim, kiedy się w to wgłębić, robi się całkiem ciekawie.',
        'Krzem to podstawa większości urządzeń elektronicznych, których używamy: mojego zegarka, waszej kamery i komputerów.',
        'Z tyłu to czysty krzem. Z przodu wyhodowano chipy, chyba Pentium 4, ze złączami po obu stronach, mnóstwo naraz.',
        'Tnie się je i testuje: te, które działają, trafiają do komputerów, a te do niczego idą do kosza. Fantastycznie delikatne dzieło inżynierii.',
        'To jest wafel o średnicy 20 centymetrów. Teraz robi się chipy na waflach 30-centymetrowych, mniej więcej takich, i mieści się na nich dużo więcej.',
        'Azotek krzemu jest niezwykle wytrzymały i bardzo lekki, dlatego robi się z niego wirniki turbosprężarek w samochodach: rozkręca się bardzo szybko, kiedy wciśniesz gaz, i nie rozpada się przy wysokich obrotach.',
      ],
    },
    greet: {
      kid: 'Cześć! Jestem krzem, pierwiastek w środku komputerów. Obejrzyj mój film na ekranie, a potem spróbuj doświadczeń. Zacznij od mojej bryłki w szafce na stole!',
      sci: 'To laboratorium odtwarza to, co pokazuje film Periodic Videos o krzemie: bryłkę, wafel i jego chipy oraz azotek krzemu. Każde stanowisko puszcza swój fragment filmu.',
    },
    talk: {
      kid: ['W ziemi jest mnie więcej niż czegokolwiek oprócz tlenu.', 'Każdy komputer, telefon i konsola myśli chipami zrobionymi ze mnie.', 'Piasek na plaży to ja, mocno trzymany przez tlen.'],
      sci: ['Cztery elektrony walencyjne: wiążę się jak węgiel, ale wolę tlen.', 'Oczyszczony tak, że tylko jeden atom na miliard nie jest mną, staję się chipem.', 'Jöns Berzelius wyodrębnił mnie pierwszy, w 1824 roku.'],
    },
    lump: {
      label: 'Bryłka krzemu',
      take: 'Wyjmij ją',
      turn: 'Obróć ją w świetle',
      title: 'Krzem z piasku',
      says: { kid: 'Zobacz, jak się mieni! Każdy błysk to osobny kryształ.', sci: 'Polikrystaliczny: wiele małych kryształów, każdy łapie światło pod swoim kątem.' },
      panel: {
        kid: [
          'Ta błyszcząca bryłka to czysty krzem. Mieni się, bo składa się z wielu małych kryształków, a każdy łapie światło pod swoim kątem.',
          'Krzem jest wszędzie, ale nigdy sam: w piasku obok krzem jest mocno złączony z tlenem. Piasek to krzemionka, to samo co kwarc i szkło. Po tlenie krzem to najczęstszy pierwiastek w ziemi pod twoimi stopami.',
        ],
        sci: [
          'Krzem stanowi około {crust}% masy skorupy ziemskiej, ustępując tylko tlenowi, ale zawsze jest związany z tlenem: krzemionka (SiO2) i krzemiany. Topi się w {melt} °C i ma gęstość {density} g/cm3.',
          'Otrzymuje się go z kwarcu i węgla w piecu łukowym w około 2000 °C (SiO2 + 2 C -> Si + 2 CO), a potem oczyszcza, aż tylko mniej więcej jeden atom na miliard jest czymś innym. Wyhodowany powoli ze stopu jako jeden monokryształ daje wafle do chipów; ta bryłka jest polikrystaliczna: wiele kryształów, każdy zwrócony inaczej.',
        ],
      },
    },
    chips: {
      label: 'Linia chipów',
      cut: 'Potnij wafel',
      test: 'Przetestuj chipy',
      sort: 'Posortuj je',
      again: 'Weź następny wafel',
      working: 'Pracuję',
      title: 'Robienie chipów',
      buttons: { small: 'Wafel 20 cm', big: 'Wafel 30 cm' },
      says: {
        cut: { kid: 'Ciach! Każdy kwadracik to chip.', sci: 'Pocięty wzdłuż linii między chipami.' },
        test: { kid: 'Zielony działa, czerwony nie.', sci: 'Każdy chip jest sprawdzany: odsetek działających to uzysk.' },
        sorted: { kid: '{good} chipów do komputerów, {bad} do kosza.', sci: 'Uzysk: {good} z {all} chipów, {pct}%.' },
        big: { kid: 'Na duży wafel mieści się o wiele więcej chipów!', sci: 'Wafel 30 cm ma 2,25 razy większą powierzchnię niż 20 cm.' },
      },
      panel: {
        kid: [
          'Wafel to cienki krążek krzemu wycięty z jednego wielkiego kryształu. Fabryki robią na nim naraz setki chipów, w rzędach.',
          'Potem wafel tnie się na kwadraty, każdy chip jest sprawdzany i tylko działające trafiają do komputerów i telefonów. Reszta idzie do kosza. Spróbuj, a potem weź większy wafel.',
        ],
        sci: [
          'Setki chipów powstają naraz na każdym waflu dzięki fotolitografii, warstwa po warstwie; potem wafel tnie się wzdłuż linii między nimi i każdy chip jest testowany. Odsetek działających to uzysk.',
          'Wafel 30 cm ma 2,25 razy większą powierzchnię niż 20 cm, więc mieści ponad dwa razy więcej chipów; większość dzisiejszych chipów powstaje na waflach 30 cm.',
        ],
      },
    },
    wafer: {
      label: 'Wafel',
      flip: 'Odwróć go',
      tilt: 'Przechyl',
      title: 'Tęcza na chipie',
      says: {
        front: { kid: 'Przechyl go: tęcza!', sci: 'Dyfrakcja na powtarzających się wzorach obwodów.' },
        back: { kid: 'Tył to lustro z czystego krzemu.', sci: 'Polerowany krzem monokrystaliczny: szare lustro.' },
      },
      panel: {
        kid: [
          'Tył wafla to szare lustro z czystego krzemu. Przód jest pokryty chipami.',
          'Przechyl go pod lampą, a po chipach przesunie się tęcza. Ich malutkie obwody powtarzają się w liniach o wiele cieńszych niż włos, a tak cienkie linie rozszczepiają białe światło na kolory, jak spód płyty CD.',
        ],
        sci: [
          'Wafel wycina się z monokryształu wyhodowanego ze stopu i poleruje na lustro z jednej strony; chipy buduje się na tej powierzchni.',
          'Powtarzające się wzory obwodów, tak drobne jak rowki płyty CD (1,6 µm) albo drobniejsze, działają jak siatka dyfrakcyjna: każdy kolor wychodzi pod swoim kątem (d sin θ = m λ), więc przechylanie wafla przesuwa po nim widmo.',
        ],
      },
    },
    turbo: {
      label: 'Turbosprężarka',
      press: 'Wciśnij pedał',
      title: 'Koło z azotku krzemu',
      steel: 'Stal',
      ceramic: 'Azotek krzemu',
      says: { kid: 'Lekkie koło zawsze wygrywa!', sci: 'To samo pchnięcie, około 2,5 razy mniej do obrócenia: rozkręca się pierwsze.' },
      panel: {
        kid: [
          'Turbosprężarka wtłacza do silnika samochodu więcej powietrza dzięki małemu kółku, które kręci się niesamowicie szybko w gorących spalinach.',
          'Jeśli to kółko zrobić z azotku krzemu, ceramiki z krzemu i azotu, jest o wiele lżejsze od stali, a równie wytrzymałe, więc rozkręca się szybciej, gdy wciśniesz pedał. Wciśnij i patrz, jak dwa kółka się ścigają.',
        ],
        sci: [
          'Azotek krzemu (Si3N4) ma gęstość około 3,2 g/cm3, a stal około 7,9 g/cm3; dla kół o tym samym kształcie moment bezwładności rośnie z masą, więc ten sam moment siły rozkręca ceramiczne około 2,5 razy szybciej.',
          'Zachowuje wytrzymałość powyżej 1000 °C i znosi gwałtowne nagrzewanie, dlatego ceramiczne wirniki turbin weszły do seryjnych samochodów w latach 80.',
        ],
      },
    },
    minerals: {
      label: 'Minerały',
      look: 'Zobacz następny',
      title: 'Piasek, skały i krzemiany',
      names: { quartz: 'Kwarc', mica: 'Mika', feldspar: 'Skaleń', garnet: 'Granat' },
      says: {
        quartz: { kid: 'Kwarc: piasek to głównie jego okruchy.', sci: 'Kwarc, SiO2: każdy tetraedr SiO4 dzieli wszystkie cztery naroża, szkielet w trzech wymiarach.' },
        mica: { kid: 'Mika rozdziela się na listki cieńsze niż papier.', sci: 'Mika: tetraedry SiO4 połączone w warstwy, dlatego łupie się na płatki.' },
        feldspar: { kid: 'Skaleń: najczęstszy minerał skorupy ziemskiej.', sci: 'Skaleń: krzemian szkieletowy z glinem i sodem, potasem albo wapniem.' },
        garnet: { kid: 'Granat: czerwony kamień szlachetny z krzemianu.', sci: 'Granat: oddzielne tetraedry SiO4 spięte jonami metali.' },
      },
      panel: {
        kid: [
          'Większość skał składa się z krzemianów: krzemu i tlenu połączonych z metalami. Kwarc, mika, skaleń i granat to krzemiany, a piasek to głównie pokruszony kwarc.',
          'Użyj stołu jeszcze raz, żeby obejrzeć każdy.',
        ],
        sci: [
          'W każdym krzemianie podstawowym klockiem jest tetraedr SiO4: jeden krzem wśród czterech tlenów. To, jak tetraedry dzielą naroża, decyduje o minerale: osobno (granat), w warstwach (mika) albo w szkielecie (kwarc, skaleń).',
          'Skalenie to najobfitsze minerały skorupy, a krzemiany stanowią około 90% jej masy.',
        ],
      },
    },
  },
  de: {
    forms: { el: 'Silicium', El: 'Silicium' },
    prof: {
      name: 'Professor Poliakoff',
      verb: 'Zuhören',
      next: 'Weiter',
      watch: 'Ihn das sagen sehen ({t})',
      note: 'Was er im Film sagt, in den Worten des Spiels nacherzählt. „Ihn das sagen sehen“ spielt die Stelle ab.',
      lines: [
        'Silicium ist ein sehr häufiges Element. Man findet es vor allem in Sand, und Sand ist Siliciumdioxid: die Verbindung aus Silicium und Sauerstoff.',
        'Es steckt auch in einer riesigen Zahl von Mineralen, den Silikaten, aus Silicium, Sauerstoff und einem weiteren Metall. Wer kein Spezialist ist, findet das langweilig, aber wie alles wird es richtig spannend, wenn man sich hineinvertieft.',
        'Silicium ist die Grundlage der meisten elektronischen Geräte, die wir benutzen: meiner Uhr, eurer Videokamera und der Computer.',
        'Hinten ist das reines Silicium. Vorne hat man Chips wachsen lassen, Pentium 4, glaube ich, mit den Anschlüssen auf beiden Seiten, ganz viele auf einmal.',
        'Sie werden zerschnitten und geprüft: Die funktionierenden kommen in Computer, die unbrauchbaren werden weggeworfen. Ein fantastisch empfindliches Stück Technik.',
        'Das ist ein 20-Zentimeter-Wafer. Heute macht man Chips auf 30-Zentimeter-Wafern, etwa so groß, und bekommt viel mehr auf jeden.',
        'Siliciumnitrid ist extrem zäh und sehr leicht, darum macht man daraus die Laufräder von Turboladern in Autos: Es dreht sehr schnell hoch, wenn man Gas gibt, und fliegt beim Hochdrehen nicht auseinander.',
      ],
    },
    greet: {
      kid: 'Hallo! Ich bin Silicium, das Element in den Computern. Sieh dir mein Video auf dem Bildschirm an und probier dann die Versuche aus. Fang mit meinem Brocken im Schrank auf dem Labortisch an!',
      sci: 'Dieses Labor baut nach, was der Film von Periodic Videos über Silicium zeigt: den Brocken, den Wafer mit seinen Chips und Siliciumnitrid. Jede Station spielt ihren Teil des Films ab.',
    },
    talk: {
      kid: ['Im Boden gibt es mehr von mir als von allem anderen außer Sauerstoff.', 'Jeder Computer, jedes Handy und jede Spielkonsole denkt mit Chips aus mir.', 'Der Sand am Strand bin ich, fest vom Sauerstoff gehalten.'],
      sci: ['Vier Außenelektronen: Ich binde wie Kohlenstoff, aber Sauerstoff mag ich viel lieber.', 'So rein gemacht, dass nur ein Atom von einer Milliarde nicht ich ist, werde ich zum Chip.', 'Jöns Berzelius hat mich 1824 als Erster rein dargestellt.'],
    },
    lump: {
      label: 'Der Siliciumbrocken',
      take: 'Herausnehmen',
      turn: 'Im Licht drehen',
      title: 'Silicium aus Sand',
      says: { kid: 'Schau, wie er glitzert! Jedes Funkeln ist ein eigener Kristall.', sci: 'Polykristallin: viele kleine Kristalle, jeder fängt das Licht in seinem eigenen Winkel.' },
      panel: {
        kid: [
          'Dieser glänzende Brocken ist reines Silicium. Er glitzert, weil er aus vielen kleinen Kristallen besteht, und jeder fängt das Licht in seinem eigenen Winkel.',
          'Silicium ist überall, aber nie allein: Im Sand daneben ist Silicium fest an Sauerstoff gebunden. Sand ist Siliciumdioxid, dasselbe wie Quarz und Glas. Nach Sauerstoff ist Silicium das häufigste Element im Boden unter deinen Füßen.',
        ],
        sci: [
          'Silicium macht etwa {crust} % der Masse der Erdkruste aus, nur Sauerstoff ist häufiger, aber es ist immer an Sauerstoff gebunden: Siliciumdioxid (SiO2) und Silikate. Es schmilzt bei {melt} °C und hat eine Dichte von {density} g/cm3.',
          'Man gewinnt es aus Quarz mit Kohlenstoff im Lichtbogenofen bei etwa 2000 °C (SiO2 + 2 C -> Si + 2 CO) und reinigt es dann, bis nur noch etwa ein Atom von einer Milliarde etwas anderes ist. Langsam aus der Schmelze als ein einziger Kristall gezogen, wird es zu den Wafern der Chips; dieser Brocken ist polykristallin: viele Kristalle, jeder anders ausgerichtet.',
        ],
      },
    },
    chips: {
      label: 'Die Chipstraße',
      cut: 'Den Wafer zerschneiden',
      test: 'Die Chips prüfen',
      sort: 'Sortieren',
      again: 'Den nächsten Wafer nehmen',
      working: 'Läuft',
      title: 'Chips machen',
      buttons: { small: 'Ein 20-cm-Wafer', big: 'Ein 30-cm-Wafer' },
      says: {
        cut: { kid: 'Schnipp! Jedes kleine Quadrat ist ein Chip.', sci: 'Entlang der Linien zwischen den Chips zersägt.' },
        test: { kid: 'Grün funktioniert, Rot nicht.', sci: 'Jeder Chip wird geprüft: der funktionierende Anteil ist die Ausbeute.' },
        sorted: { kid: '{good} Chips für Computer, {bad} in den Müll.', sci: 'Ausbeute: {good} von {all} Chips, {pct} %.' },
        big: { kid: 'Auf den großen Wafer passen viel mehr Chips!', sci: 'Ein 30-cm-Wafer hat die 2,25-fache Fläche eines 20-cm-Wafers.' },
      },
      panel: {
        kid: [
          'Ein Wafer ist eine dünne Scheibe Silicium, aus einem großen Kristall geschnitten. Fabriken machen Hunderte Chips auf einmal darauf, in Reihen.',
          'Dann wird der Wafer in Quadrate zerschnitten, jeder Chip wird geprüft, und nur die funktionierenden kommen in Computer und Handys. Der Rest wird weggeworfen. Probier es aus und nimm dann den größeren Wafer.',
        ],
        sci: [
          'Hunderte Chips entstehen gleichzeitig auf jedem Wafer durch Fotolithografie, Schicht für Schicht; dann wird der Wafer entlang der Linien dazwischen zersägt und jeder Chip geprüft. Der funktionierende Anteil ist die Ausbeute.',
          'Ein 30-cm-Wafer hat die 2,25-fache Fläche eines 20-cm-Wafers und trägt daher mehr als doppelt so viele Chips; die meisten Chips entstehen heute auf 30-cm-Wafern.',
        ],
      },
    },
    wafer: {
      label: 'Der Wafer',
      flip: 'Umdrehen',
      tilt: 'Kippen',
      title: 'Ein Regenbogen auf dem Chip',
      says: {
        front: { kid: 'Kipp ihn: ein Regenbogen!', sci: 'Beugung an den sich wiederholenden Mustern der Schaltkreise.' },
        back: { kid: 'Die Rückseite ist ein Spiegel aus reinem Silicium.', sci: 'Poliertes einkristallines Silicium: ein grauer Spiegel.' },
      },
      panel: {
        kid: [
          'Die Rückseite eines Wafers ist ein grauer Spiegel aus reinem Silicium. Die Vorderseite ist voller Chips.',
          'Kipp ihn unter der Lampe, und ein Regenbogen gleitet über die Chips. Ihre winzigen Schaltkreise wiederholen sich in Linien, viel feiner als ein Haar, und so feine Linien zerlegen weißes Licht in seine Farben, wie die Rückseite einer CD.',
        ],
        sci: [
          'Der Wafer wird aus einem Einkristall gesägt, der aus der Schmelze gezogen wurde, und auf einer Seite spiegelblank poliert; die Chips entstehen in dieser Fläche.',
          'Die sich wiederholenden Muster der Schaltkreise, so fein wie die Rillen einer CD (1,6 µm) oder feiner, wirken als Beugungsgitter: Jede Farbe verlässt sie unter ihrem eigenen Winkel (d sin θ = m λ), darum wandert beim Kippen das Spektrum über den Wafer.',
        ],
      },
    },
    turbo: {
      label: 'Der Turbolader',
      press: 'Aufs Pedal treten',
      title: 'Ein Rad aus Siliciumnitrid',
      steel: 'Stahl',
      ceramic: 'Siliciumnitrid',
      says: { kid: 'Das leichte Rad gewinnt jedes Mal!', sci: 'Derselbe Schub, etwa 2,5-mal weniger zu drehen: Es dreht zuerst hoch.' },
      panel: {
        kid: [
          'Ein Turbolader drückt zusätzliche Luft in den Motor eines Autos, mit einem kleinen Rad, das sich im heißen Abgas unglaublich schnell dreht.',
          'Macht man dieses Rad aus Siliciumnitrid, einer Keramik aus Silicium und Stickstoff, ist es viel leichter als Stahl und genauso zäh, darum dreht es schneller hoch, wenn du aufs Pedal trittst. Tritt drauf und sieh den beiden Rädern beim Wettrennen zu.',
        ],
        sci: [
          'Siliciumnitrid (Si3N4) hat eine Dichte von etwa 3,2 g/cm3, Stahl etwa 7,9 g/cm3; bei gleicher Form wächst das Trägheitsmoment mit der Masse, darum dreht dasselbe Drehmoment das Keramikrad etwa 2,5-mal schneller hoch.',
          'Es behält seine Festigkeit über 1000 °C und verträgt plötzliches Aufheizen, deshalb kamen Turbinenräder aus Keramik in den 1980er-Jahren in Serienautos.',
        ],
      },
    },
    minerals: {
      label: 'Die Minerale',
      look: 'Das nächste ansehen',
      title: 'Sand, Gestein und Silikate',
      names: { quartz: 'Quarz', mica: 'Glimmer', feldspar: 'Feldspat', garnet: 'Granat' },
      says: {
        quartz: { kid: 'Quarz: Sand besteht meist aus winzigen Stückchen davon.', sci: 'Quarz, SiO2: Jedes SiO4-Tetraeder teilt alle vier Ecken, ein Gerüst in drei Dimensionen.' },
        mica: { kid: 'Glimmer lässt sich in Blättchen spalten, dünner als Papier.', sci: 'Glimmer: SiO4-Tetraeder in Schichten verbunden, darum spaltet er in Plättchen.' },
        feldspar: { kid: 'Feldspat: das häufigste Mineral der Erdkruste.', sci: 'Feldspat: ein Gerüstsilikat mit Aluminium und Natrium, Kalium oder Calcium.' },
        garnet: { kid: 'Granat: ein roter Edelstein aus Silikat.', sci: 'Granat: einzelne SiO4-Tetraeder, von Metallionen zusammengehalten.' },
      },
      panel: {
        kid: [
          'Die meisten Gesteine bestehen aus Silikaten: Silicium und Sauerstoff mit Metallen. Quarz, Glimmer, Feldspat und Granat sind alles Silikate, und Sand ist meist zerriebener Quarz.',
          'Benutze den Tisch noch einmal, um dir jedes anzusehen.',
        ],
        sci: [
          'In jedem Silikat ist der Grundbaustein das SiO4-Tetraeder: ein Silicium zwischen vier Sauerstoffen. Wie die Tetraeder ihre Ecken teilen, entscheidet über das Mineral: einzeln (Granat), in Schichten (Glimmer) oder als Gerüst (Quarz, Feldspat).',
          'Feldspäte sind die häufigsten Minerale der Kruste, und Silikate machen etwa 90 % davon aus.',
        ],
      },
    },
  },
}
