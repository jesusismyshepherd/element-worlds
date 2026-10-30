// The words of silicon's valley room ("Why is a valley named after silicon?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Si.js (the easel shows it). `board` and `parts` are drawn in 3D (one depth: no
// subscripts, no emoji); the valley's moments are keyed by year (`y1956`) and `today`.
export const VALLEY_WORDS = {
  en: {
    title: 'Above Silicon Valley',
    greet: {
      kid: 'What a view! Down there is a real valley in California, full of fruit trees. Use the lever at the lookout and watch it turn into Silicon Valley. The picture’s story is on the easel beside you.',
      sci: 'Below lies the Santa Clara Valley, south of San Francisco, as it was in 1950. The lever at the lookout runs it on to today; the transistor and the 4004 on this hill show what grew there. The picture’s story is on the easel.',
    },
    talk: {
      kid: [
        'There are no silicon mines down there! The valley got its name because so many companies there made things out of silicon.',
        'In spring, before the factories came, the whole valley was white and pink with blossom. A few of the old orchards are still kept today.',
        'The first chips had a handful of transistors. A phone’s chip has billions, each far too small to see.',
      ],
      sci: [
        'Silicon’s band gap is 1.12 eV at room temperature, germanium’s 0.66 eV: heat frees far fewer electrons in silicon, so its transistors still switch cleanly when hot.',
        'In 1965 Gordon Moore noticed that the number of components on a chip was doubling every year; in 1975 he made it every two years. “Moore’s law” held for decades.',
        'Jack Kilby at Texas Instruments built the first integrated circuit in 1958, on germanium, its parts joined by fine gold wires. Noyce’s design of 1959 was flat silicon with metal lines laid on its oxide: a chip that could be mass-produced.',
      ],
    },
    valley: {
      label: 'The valley through time',
      next: 'Move time on',
      restart: 'Back to 1950',
      title: 'From orchards to chips',
      year: 'Year',
      today: 'today',
      paper: 'Electronic News, 11 January 1971',
      board: {
        y1950: 'The Valley of Heart’s Delight',
        y1956: 'Shockley’s laboratory',
        y1957: 'Fairchild Semiconductor',
        y1959: 'Noyce’s silicon chip',
        y1968: 'Intel',
        y1971: '“Silicon Valley U.S.A.”',
        today: 'Silicon Valley today',
      },
      says: {
        y1950: {
          kid: 'It is 1950: orchards as far as you can see, apricots, plums and cherries. People called it the Valley of Heart’s Delight.',
          sci: '1950: the Santa Clara Valley, the “Valley of Heart’s Delight”, is mostly orchards; its plums are dried into prunes and its apricots canned in the town.',
        },
        y1956: {
          kid: '1956: William Shockley, one of the inventors of the transistor, opens a laboratory here to make transistors from silicon.',
          sci: '1956: William Shockley, Nobel Prize in Physics that year with Bardeen and Brattain, opens the Shockley Semiconductor Laboratory in Mountain View to make silicon transistors.',
        },
        y1957: {
          kid: '1957: eight of his engineers walk out and start their own company, Fairchild Semiconductor.',
          sci: '1957: eight of Shockley’s engineers, Robert Noyce and Gordon Moore among them, leave and found Fairchild Semiconductor.',
        },
        y1959: {
          kid: '1959: at Fairchild, Robert Noyce works out how to put a whole circuit on one flat piece of silicon: a chip!',
          sci: '1959: at Fairchild, Robert Noyce conceives the planar integrated circuit, built on Jean Hoerni’s planar process: the parts and their metal wiring on one flat, oxide-covered piece of silicon.',
        },
        y1968: {
          kid: '1968: Robert Noyce and Gordon Moore start a new company: Intel.',
          sci: '1968: Noyce and Moore leave Fairchild and found Intel; people from Fairchild start dozens of other companies.',
        },
        y1971: {
          kid: '1971: a journalist calls this place Silicon Valley, and the name sticks! The same year Intel makes the 4004, a computer’s brain on one chip.',
          sci: '11 January 1971: Don Hoefler’s series “Silicon Valley U.S.A.” begins in Electronic News. In November Intel brings out the 4004, the first microprocessor sold as one chip.',
        },
        today: {
          kid: 'Today: lights everywhere, and only a few orchards left. Many of the world’s phones, computers and websites are designed down there.',
          sci: 'Today nearly two million people live in Santa Clara County, against about 290 000 in 1950. Chips are designed here, but most are made in factories elsewhere, many of them in Taiwan.',
        },
      },
      panel: {
        kid: [
          'In 1950 this valley south of San Francisco was one of the biggest fruit-growing places in the world: apricots, plums and cherries in orchards as far as you could see. People called it the Valley of Heart’s Delight.',
          'Then people found that very pure silicon makes wonderful tiny electric switches, transistors. Companies to make them started here one after another, and new companies grew out of old ones. Move the years on with the lever, or with the slider here, and watch the trees give way to buildings, lights and cars.',
          'In 1971 a journalist wrote about the place and called it Silicon Valley. The name stuck, even though no silicon is dug up there: the silicon is in what they make.',
        ],
        sci: [
          'The Santa Clara Valley was among the world’s largest fruit-growing regions, with canneries and drying yards for its prunes and apricots. Stanford University, at its northern end, urged its engineers to start companies nearby: Hewlett-Packard began in a Palo Alto garage in 1939.',
          'The silicon industry arrived in 1956 with William Shockley’s laboratory in Mountain View. The eight who left him in 1957 founded Fairchild Semiconductor, where Jean Hoerni’s planar process and Robert Noyce’s integrated circuit (1959) set the way chips are still made; people from Fairchild went on to found dozens of firms, Intel (1968) among them.',
          'Don Hoefler named the region in “Silicon Valley U.S.A.”, a series in Electronic News that began on 11 January 1971; that November came Intel’s 4004. The orchards were built over from the 1950s to the 1980s. The valley now designs a large share of the world’s chips, most of them made elsewhere.',
        ],
      },
    },
    gate: {
      label: 'The switch',
      on: 'Gate on',
      off: 'Gate off',
      title: 'A switch with no moving parts',
      parts: { source: 'source', gate: 'gate', drain: 'drain', silicon: 'silicon' },
      says: {
        on: {
          kid: 'Click! The gate pulls electrons into a bridge under it, and they rush across: the lamp lights up!',
          sci: 'A positive gate voltage draws electrons to the surface under the oxide: an n-type channel joins source and drain, and a current flows.',
        },
        off: {
          kid: 'Gate off: the bridge is gone, the electrons stop and the lamp goes dark.',
          sci: 'Below the threshold voltage the channel disappears: no current flows from source to drain.',
        },
      },
      panel: {
        kid: [
          'This is a transistor, the switch chips are made of, blown up to giant size. It has no moving parts: electrons can only get from one side, the source, to the other, the drain, when the gate on top is switched on.',
          'The gate never touches the silicon. It sits on a thin skin of glass, silicon dioxide, that silicon grows on itself, and its electric pull reaches through and gathers electrons into a bridge. A phone has billions of these switches, each flicking on and off up to billions of times a second.',
        ],
        sci: [
          'An n-channel MOSFET (metal-oxide-semiconductor field-effect transistor): two n-type regions, the source and the drain, in p-type silicon, with the gate over the gap between them on a thin layer of silicon dioxide. Above the threshold voltage the gate’s field draws electrons to the surface and inverts it into an n-type channel; almost no current flows into the gate itself.',
          'Silicon beat germanium because it grows its own stable, insulating oxide (germanium’s dissolves in water) and works at higher temperatures. Mohamed Atalla and Dawon Kahng made the first MOSFET at Bell Labs in 1959. In today’s fastest chips the silicon dioxide is only a few atoms thick, under a layer of hafnium oxide that leaks less.',
        ],
      },
    },
    chip: {
      label: 'The chip that counts',
      grow: 'Today’s chip',
      back: 'Back to the 4004',
      title: 'From 2300 to billions',
      unit: 'transistors',
      one: 'one Intel 4004, 1971',
      each: 'each light is a whole 4004',
      phone: 'about as many as in a phone’s chip',
      says: {
        grow: {
          kid: 'Zoom out! Every light becomes a whole 4004 chip, and then again: 12 billion, about as many as in a phone!',
          sci: 'Each step turns every transistor into a whole 4004: 2300 × 2300 × 2300 = 12 167 000 000, about the count of a phone’s processor.',
        },
        back: {
          kid: 'Back to the very first: 2300 lights, one for every switch in the 4004.',
          sci: 'The 4004: 2300 transistors on a 3 × 4 mm die, made with 10 µm silicon-gate MOS.',
        },
      },
      panel: {
        kid: [
          'The Intel 4004 of 1971 was the first computer brain sold as a single chip, made for a calculator. Each of these 2300 lights stands for one of its transistors, the switches you can see on this hill.',
          'Zoom out and each light becomes a whole 4004, and then each of those again. That makes about 12 billion lights, about as many switches as in the chip of a phone: far too many to see one by one, so together they just glow.',
        ],
        sci: [
          'Intel’s 4004 (November 1971), designed by Federico Faggin, Ted Hoff, Stanley Mazor and Masatoshi Shima for Busicom’s calculators: a 4-bit processor of 2300 transistors on a 3 × 4 mm die, made with Faggin’s silicon-gate MOS process at 10 µm and clocked at up to 740 kHz.',
          'Two steps of ×2300 give 2300³, about 1.2 × 10¹⁰ transistors. Apple’s A14 phone chip (2020) has 11.8 billion; the largest processors today have over 100 billion, each a MOSFET like the one on this hill, a few tens of nanometres across.',
        ],
      },
    },
    vial: {
      label: 'Berzelius’s silicon',
      verb: 'Look',
      tag: 'Berzelius, 1824',
      title: 'Where it started: a brown powder',
      says: {
        kid: 'A little brown powder: the first silicon anyone made on its own, in 1824.',
        sci: 'Amorphous silicon, as Berzelius made it in 1824 by heating potassium fluorosilicate with potassium.',
      },
      panel: {
        kid: [
          'In 1824, in Stockholm, the Swedish chemist Jöns Jacob Berzelius heated a salt of silicon with the metal potassium and washed away everything else. What was left was a brown powder: silicon, never seen on its own before.',
          'Nobody then could have guessed that, more than 130 years later, this element would fill a valley with companies, and your pocket with a phone.',
        ],
        sci: [
          'Berzelius reduced potassium fluorosilicate, K2SiF6, with molten potassium and washed the product again and again until a brown powder of amorphous silicon was left. Gay-Lussac and Thénard may have made some impure silicon in 1811, without recognising it as a new element.',
          'Crystalline silicon, grey and shiny, was first made by Henri Sainte-Claire Deville in 1854. The first transistor (1947) was made of germanium; silicon took over during the 1960s, grown as single crystals far purer than Berzelius’s powder.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Por cima do Vale do Silício',
    greet: {
      kid: 'Que vista! Lá em baixo está um vale de verdade, na Califórnia, cheio de árvores de fruto. Usa a alavanca no miradouro e vê-o transformar-se no Vale do Silício. A história desta imagem está no cavalete ao teu lado.',
      sci: 'Lá em baixo fica o vale de Santa Clara, a sul de São Francisco, tal como era em 1950. A alavanca do miradouro leva-o até hoje; o transístor e o 4004 neste monte mostram o que lá cresceu. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Lá em baixo não há minas de silício! O vale ganhou este nome porque havia lá muitas empresas que faziam coisas de silício.',
        'Na primavera, antes de chegarem as fábricas, o vale inteiro ficava branco e cor-de-rosa com as flores. Ainda hoje se guardam alguns dos pomares antigos.',
        'Os primeiros chips tinham meia dúzia de transístores. O chip de um telemóvel tem milhares de milhões, cada um pequeno demais para se ver.',
      ],
      sci: [
        'A banda proibida do silício é de 1,12 eV à temperatura ambiente, a do germânio de 0,66 eV: o calor liberta muito menos eletrões no silício, por isso os seus transístores continuam a comutar bem quando aquecem.',
        'Em 1965, Gordon Moore reparou que o número de componentes num chip duplicava todos os anos; em 1975 corrigiu para cada dois anos. A «lei de Moore» manteve-se durante décadas.',
        'Jack Kilby, da Texas Instruments, construiu o primeiro circuito integrado em 1958, em germânio, com as peças ligadas por fios de ouro finíssimos. O projeto de Noyce, de 1959, era de silício plano, com linhas de metal sobre o óxido: um chip que se podia produzir em massa.',
      ],
    },
    valley: {
      label: 'O vale ao longo do tempo',
      next: 'Avançar no tempo',
      restart: 'Voltar a 1950',
      title: 'Dos pomares aos chips',
      year: 'Ano',
      today: 'hoje',
      paper: 'Electronic News, 11 de janeiro de 1971',
      board: {
        y1950: '«Valley of Heart’s Delight»',
        y1956: 'O laboratório de Shockley',
        y1957: 'Fairchild Semiconductor',
        y1959: 'O chip de silício de Noyce',
        y1968: 'Intel',
        y1971: '«Silicon Valley U.S.A.»',
        today: 'O Vale do Silício hoje',
      },
      says: {
        y1950: {
          kid: 'Estamos em 1950: pomares a perder de vista, de alperces, ameixas e cerejas. Chamavam-lhe «Valley of Heart’s Delight», o vale das delícias do coração.',
          sci: '1950: o vale de Santa Clara, o «Valley of Heart’s Delight», é sobretudo pomares; as ameixas secam-se e os alperces vão para as fábricas de conservas da cidade.',
        },
        y1956: {
          kid: '1956: William Shockley, um dos inventores do transístor, abre aqui um laboratório para fazer transístores de silício.',
          sci: '1956: William Shockley, Prémio Nobel da Física nesse ano com Bardeen e Brattain, abre o Shockley Semiconductor Laboratory em Mountain View, para fazer transístores de silício.',
        },
        y1957: {
          kid: '1957: oito dos seus engenheiros vão-se embora e criam a sua própria empresa, a Fairchild Semiconductor.',
          sci: '1957: oito engenheiros de Shockley, entre eles Robert Noyce e Gordon Moore, saem e fundam a Fairchild Semiconductor.',
        },
        y1959: {
          kid: '1959: na Fairchild, Robert Noyce descobre como pôr um circuito inteiro numa só peça plana de silício: um chip!',
          sci: '1959: na Fairchild, Robert Noyce concebe o circuito integrado planar, assente no processo planar de Jean Hoerni: os componentes e as ligações de metal numa só peça de silício plana, coberta de óxido.',
        },
        y1968: {
          kid: '1968: Robert Noyce e Gordon Moore criam uma empresa nova: a Intel.',
          sci: '1968: Noyce e Moore saem da Fairchild e fundam a Intel; gente da Fairchild funda dezenas de outras empresas.',
        },
        y1971: {
          kid: '1971: um jornalista chama a este sítio Silicon Valley, e o nome pega! No mesmo ano, a Intel faz o 4004, o cérebro de um computador num só chip.',
          sci: '11 de janeiro de 1971: começa na Electronic News a série «Silicon Valley U.S.A.», de Don Hoefler. Em novembro, a Intel lança o 4004, o primeiro microprocessador vendido num só chip.',
        },
        today: {
          kid: 'Hoje: luzes por todo o lado, e só restam alguns pomares. Muitos dos telemóveis, computadores e sites do mundo são criados lá em baixo.',
          sci: 'Hoje vivem no condado de Santa Clara quase dois milhões de pessoas, contra cerca de 290 000 em 1950. Os chips são projetados aqui, mas a maioria é fabricada noutros sítios, muitos em Taiwan.',
        },
      },
      panel: {
        kid: [
          'Em 1950, este vale a sul de São Francisco era um dos maiores sítios de fruta do mundo: alperces, ameixas e cerejas em pomares a perder de vista. Chamavam-lhe «Valley of Heart’s Delight», o vale das delícias do coração.',
          'Depois descobriu-se que o silício muito puro dá uns interruptores elétricos minúsculos fantásticos, os transístores. Começaram a nascer aqui empresas para os fazer, umas atrás das outras, e das empresas velhas nasciam novas. Avança os anos com a alavanca, ou com o cursor aqui, e vê as árvores darem lugar a prédios, luzes e carros.',
          'Em 1971, um jornalista escreveu sobre este sítio e chamou-lhe Silicon Valley, o Vale do Silício. O nome pegou, embora lá não se escave silício nenhum: o silício está no que lá se faz.',
        ],
        sci: [
          'O vale de Santa Clara era uma das maiores regiões frutícolas do mundo, com fábricas de conservas e secadouros para as suas ameixas e alperces. A Universidade de Stanford, no extremo norte, incentivava os seus engenheiros a criar empresas ali perto: a Hewlett-Packard começou numa garagem de Palo Alto em 1939.',
          'A indústria do silício chegou em 1956, com o laboratório de William Shockley em Mountain View. Os oito que o deixaram em 1957 fundaram a Fairchild Semiconductor, onde o processo planar de Jean Hoerni e o circuito integrado de Robert Noyce (1959) definiram a forma como os chips ainda hoje se fazem; gente da Fairchild fundou depois dezenas de empresas, entre elas a Intel (1968).',
          'Don Hoefler deu nome à região em «Silicon Valley U.S.A.», uma série na Electronic News que começou a 11 de janeiro de 1971; em novembro desse ano chegou o 4004 da Intel. Os pomares foram sendo construídos dos anos 1950 aos anos 1980. Hoje o vale projeta uma grande parte dos chips do mundo, a maioria deles fabricada noutros sítios.',
        ],
      },
    },
    gate: {
      label: 'O interruptor',
      on: 'Ligar a porta',
      off: 'Desligar a porta',
      title: 'Um interruptor sem peças móveis',
      parts: { source: 'fonte', gate: 'porta', drain: 'dreno', silicon: 'silício' },
      says: {
        on: {
          kid: 'Clique! A porta puxa eletrões e faz com eles uma ponte por baixo dela, e eles atravessam a correr: a lâmpada acende!',
          sci: 'Uma tensão positiva na porta atrai eletrões para a superfície por baixo do óxido: um canal do tipo n liga a fonte ao dreno, e passa corrente.',
        },
        off: {
          kid: 'Porta desligada: a ponte desaparece, os eletrões param e a lâmpada apaga-se.',
          sci: 'Abaixo da tensão de limiar o canal desaparece: não passa corrente da fonte para o dreno.',
        },
      },
      panel: {
        kid: [
          'Isto é um transístor, o interruptor de que os chips são feitos, em tamanho gigante. Não tem peças que se mexam: os eletrões só conseguem ir de um lado, a fonte, para o outro, o dreno, quando a porta lá em cima está ligada.',
          'A porta nunca toca no silício. Está pousada numa pele fina de vidro, dióxido de silício, que o silício cria sozinho à superfície, e a sua força elétrica atravessa-a e junta os eletrões numa ponte. Um telemóvel tem milhares de milhões destes interruptores, cada um a ligar e desligar até milhares de milhões de vezes por segundo.',
        ],
        sci: [
          'Um MOSFET de canal n (transístor de efeito de campo metal-óxido-semicondutor): duas regiões do tipo n, a fonte e o dreno, em silício do tipo p, com a porta por cima do espaço entre elas, numa camada fina de dióxido de silício. Acima da tensão de limiar, o campo da porta atrai eletrões para a superfície e inverte-a num canal do tipo n; para dentro da porta quase não passa corrente.',
          'O silício venceu o germânio porque cria o seu próprio óxido, estável e isolante (o do germânio dissolve-se na água), e funciona a temperaturas mais altas. Mohamed Atalla e Dawon Kahng fizeram o primeiro MOSFET nos Bell Labs em 1959. Nos chips mais rápidos de hoje, o dióxido de silício tem só alguns átomos de espessura, por baixo de uma camada de óxido de háfnio que deixa escapar menos corrente.',
        ],
      },
    },
    chip: {
      label: 'O chip que conta',
      grow: 'O chip de hoje',
      back: 'Voltar ao 4004',
      title: 'De 2300 a milhares de milhões',
      unit: 'transístores',
      one: 'um Intel 4004, 1971',
      each: 'cada luz é um 4004 inteiro',
      phone: 'mais ou menos como no chip de um telemóvel',
      says: {
        grow: {
          kid: 'Vamos afastar-nos! Cada luz passa a ser um chip 4004 inteiro, e outra vez: 12 mil milhões, mais ou menos como num telemóvel!',
          sci: 'Cada passo transforma cada transístor num 4004 inteiro: 2300 × 2300 × 2300 = 12 167 000 000, mais ou menos o número do processador de um telemóvel.',
        },
        back: {
          kid: 'De volta ao primeiro de todos: 2300 luzes, uma por cada interruptor do 4004.',
          sci: 'O 4004: 2300 transístores num chip de 3 × 4 mm, feito com a tecnologia MOS de porta de silício de 10 µm.',
        },
      },
      panel: {
        kid: [
          'O Intel 4004, de 1971, foi o primeiro cérebro de computador vendido num só chip, feito para uma calculadora. Cada uma destas 2300 luzes representa um dos seus transístores, os interruptores que vês neste monte.',
          'Afasta-te e cada luz passa a ser um 4004 inteiro, e depois cada um desses outra vez. Dá cerca de 12 mil milhões de luzes, mais ou menos tantos interruptores como no chip de um telemóvel: demasiados para ver um a um, por isso juntos só brilham.',
        ],
        sci: [
          'O 4004 da Intel (novembro de 1971), projetado por Federico Faggin, Ted Hoff, Stanley Mazor e Masatoshi Shima para as calculadoras da Busicom: um processador de 4 bits, com 2300 transístores num chip de 3 × 4 mm, feito com o processo MOS de porta de silício de Faggin, a 10 µm, e com um relógio até 740 kHz.',
          'Dois passos de ×2300 dão 2300³, cerca de 1,2 × 10¹⁰ transístores. O chip A14 da Apple, para telemóveis (2020), tem 11,8 mil milhões; os maiores processadores de hoje têm mais de 100 mil milhões, cada um deles um MOSFET como o deste monte, com algumas dezenas de nanómetros.',
        ],
      },
    },
    vial: {
      label: 'O silício de Berzelius',
      verb: 'Ver',
      tag: 'Berzelius, 1824',
      title: 'Onde tudo começou: um pó castanho',
      says: {
        kid: 'Um pozinho castanho: o primeiro silício que alguém conseguiu obter sozinho, em 1824.',
        sci: 'Silício amorfo, tal como Berzelius o obteve em 1824, aquecendo fluorossilicato de potássio com potássio.',
      },
      panel: {
        kid: [
          'Em 1824, em Estocolmo, o químico sueco Jöns Jacob Berzelius aqueceu um sal de silício com o metal potássio e lavou tudo o resto. O que sobrou foi um pó castanho: silício, que nunca ninguém tinha visto sozinho.',
          'Ninguém podia adivinhar que, mais de 130 anos depois, este elemento ia encher um vale de empresas, e o teu bolso com um telemóvel.',
        ],
        sci: [
          'Berzelius reduziu fluorossilicato de potássio, K2SiF6, com potássio fundido e lavou o produto vezes sem conta, até restar um pó castanho de silício amorfo. Gay-Lussac e Thénard talvez tenham obtido algum silício impuro em 1811, sem o reconhecerem como um elemento novo.',
          'O silício cristalino, cinzento e brilhante, foi obtido pela primeira vez por Henri Sainte-Claire Deville em 1854. O primeiro transístor (1947) era de germânio; o silício tomou o seu lugar ao longo dos anos 1960, em monocristais muito mais puros do que o pó de Berzelius.',
        ],
      },
    },
  },
  pl: {
    title: 'Nad Doliną Krzemową',
    greet: {
      kid: 'Ale widok! Tam na dole jest prawdziwa dolina w Kalifornii, pełna drzew owocowych. Użyj dźwigni na punkcie widokowym i zobacz, jak zmienia się w Dolinę Krzemową. Historia tego obrazka jest na sztaludze obok ciebie.',
      sci: 'Na dole leży dolina Santa Clara, na południe od San Francisco, taka, jaka była w 1950 roku. Dźwignia na punkcie widokowym przesuwa ją aż do dziś; tranzystor i 4004 na tym wzgórzu pokazują, co tam wyrosło. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Tam na dole nie ma kopalni krzemu! Dolina dostała tę nazwę, bo tyle tamtejszych firm robiło rzeczy z krzemu.',
        'Wiosną, zanim przyszły fabryki, cała dolina była biało-różowa od kwiatów. Kilka starych sadów zachowano do dziś.',
        'Pierwsze układy scalone miały garstkę tranzystorów. Układ w telefonie ma ich miliardy, każdy o wiele za mały, żeby go zobaczyć.',
      ],
      sci: [
        'Przerwa energetyczna krzemu to 1,12 eV w temperaturze pokojowej, germanu 0,66 eV: ciepło uwalnia w krzemie znacznie mniej elektronów, więc jego tranzystory nadal dobrze przełączają, gdy są gorące.',
        'W 1965 roku Gordon Moore zauważył, że liczba elementów w układzie scalonym podwaja się co roku; w 1975 roku poprawił to na co dwa lata. „Prawo Moore’a” sprawdzało się przez dziesięciolecia.',
        'Jack Kilby z Texas Instruments zbudował pierwszy układ scalony w 1958 roku, z germanu, z częściami połączonymi cienkimi złotymi drucikami. Projekt Noyce’a z 1959 roku był płaskim krzemem z metalowymi ścieżkami na tlenku: układem, który dało się produkować masowo.',
      ],
    },
    valley: {
      label: 'Dolina w czasie',
      next: 'Przesuń czas',
      restart: 'Wróć do 1950',
      title: 'Od sadów do układów scalonych',
      year: 'Rok',
      today: 'dziś',
      paper: 'Electronic News, 11 stycznia 1971',
      board: {
        y1950: '„Valley of Heart’s Delight”',
        y1956: 'Laboratorium Shockleya',
        y1957: 'Fairchild Semiconductor',
        y1959: 'Krzemowy układ Noyce’a',
        y1968: 'Intel',
        y1971: '„Silicon Valley U.S.A.”',
        today: 'Dolina Krzemowa dziś',
      },
      says: {
        y1950: {
          kid: 'Jest 1950 rok: sady, jak okiem sięgnąć, morele, śliwki i czereśnie. Nazywano ją „Valley of Heart’s Delight”, doliną radości serca.',
          sci: '1950: dolina Santa Clara, „Valley of Heart’s Delight”, to głównie sady; śliwki się tu suszy, a morele trafiają do przetwórni w mieście.',
        },
        y1956: {
          kid: '1956: William Shockley, jeden z wynalazców tranzystora, otwiera tu laboratorium, żeby robić tranzystory z krzemu.',
          sci: '1956: William Shockley, w tym samym roku laureat Nagrody Nobla z fizyki razem z Bardeenem i Brattainem, otwiera Shockley Semiconductor Laboratory w Mountain View, by produkować tranzystory krzemowe.',
        },
        y1957: {
          kid: '1957: ośmiu jego inżynierów odchodzi i zakłada własną firmę, Fairchild Semiconductor.',
          sci: '1957: ośmiu inżynierów Shockleya, wśród nich Robert Noyce i Gordon Moore, odchodzi i zakłada Fairchild Semiconductor.',
        },
        y1959: {
          kid: '1959: w Fairchild Robert Noyce wymyśla, jak zmieścić cały obwód na jednym płaskim kawałku krzemu: to układ scalony!',
          sci: '1959: w Fairchild Robert Noyce opracowuje planarny układ scalony, oparty na procesie planarnym Jeana Hoerniego: elementy i ich metalowe połączenia na jednym płaskim kawałku krzemu pokrytym tlenkiem.',
        },
        y1968: {
          kid: '1968: Robert Noyce i Gordon Moore zakładają nową firmę: Intel.',
          sci: '1968: Noyce i Moore odchodzą z Fairchild i zakładają Intel; ludzie z Fairchild zakładają dziesiątki innych firm.',
        },
        y1971: {
          kid: '1971: dziennikarz nazywa to miejsce Doliną Krzemową, Silicon Valley, i ta nazwa zostaje na dobre! W tym samym roku Intel robi 4004, mózg komputera w jednym układzie scalonym.',
          sci: '11 stycznia 1971: w „Electronic News” rusza seria Dona Hoeflera „Silicon Valley U.S.A.”. W listopadzie Intel wprowadza 4004, pierwszy mikroprocesor sprzedawany jako jeden układ scalony.',
        },
        today: {
          kid: 'Dziś: wszędzie światła i tylko kilka sadów. Wiele telefonów, komputerów i stron internetowych z całego świata projektuje się tam na dole.',
          sci: 'Dziś w hrabstwie Santa Clara mieszka prawie dwa miliony ludzi, wobec około 290 000 w 1950 roku. Układy scalone projektuje się tutaj, ale większość produkuje się w fabrykach gdzie indziej, wiele z nich na Tajwanie.',
        },
      },
      panel: {
        kid: [
          'W 1950 roku ta dolina na południe od San Francisco była jednym z największych sadowniczych miejsc na świecie: morele, śliwki i czereśnie w sadach, jak okiem sięgnąć. Nazywano ją „Valley of Heart’s Delight”, doliną radości serca.',
          'Potem okazało się, że bardzo czysty krzem świetnie nadaje się na malutkie elektryczne przełączniki, tranzystory. Powstawały tu kolejne firmy, które je robiły, a ze starych firm wyrastały nowe. Przesuwaj lata dźwignią albo suwakiem tutaj i patrz, jak drzewa ustępują miejsca budynkom, światłom i samochodom.',
          'W 1971 roku pewien dziennikarz napisał o tym miejscu i nazwał je Doliną Krzemową, Silicon Valley. Nazwa przylgnęła, choć nikt tam nie wydobywa krzemu: krzem jest w tym, co się tam robi.',
        ],
        sci: [
          'Dolina Santa Clara była jednym z największych regionów sadowniczych świata, z przetwórniami i suszarniami śliwek i moreli. Uniwersytet Stanforda na jej północnym krańcu zachęcał swoich inżynierów do zakładania firm w pobliżu: Hewlett-Packard zaczął w garażu w Palo Alto w 1939 roku.',
          'Przemysł krzemowy przyszedł w 1956 roku razem z laboratorium Williama Shockleya w Mountain View. Ośmiu, którzy odeszli od niego w 1957 roku, założyło Fairchild Semiconductor, gdzie proces planarny Jeana Hoerniego i układ scalony Roberta Noyce’a (1959) wyznaczyły sposób, w jaki do dziś robi się układy scalone; ludzie z Fairchild założyli potem dziesiątki firm, wśród nich Intel (1968).',
          'Don Hoefler nazwał region w „Silicon Valley U.S.A.”, serii artykułów w „Electronic News”, która zaczęła się 11 stycznia 1971 roku; w listopadzie tego roku pojawił się Intel 4004. Sady zabudowywano od lat 50. do lat 80. XX wieku. Dziś dolina projektuje dużą część układów scalonych świata, choć większość z nich produkuje się gdzie indziej.',
        ],
      },
    },
    gate: {
      label: 'Przełącznik',
      on: 'Włącz bramkę',
      off: 'Wyłącz bramkę',
      title: 'Przełącznik bez ruchomych części',
      parts: { source: 'źródło', gate: 'bramka', drain: 'dren', silicon: 'krzem' },
      says: {
        on: {
          kid: 'Klik! Bramka przyciąga elektrony i robi z nich mostek pod sobą, a one pędzą na drugą stronę: lampa się zapala!',
          sci: 'Dodatnie napięcie bramki przyciąga elektrony do powierzchni pod tlenkiem: kanał typu n łączy źródło z drenem i płynie prąd.',
        },
        off: {
          kid: 'Bramka wyłączona: mostek znika, elektrony stają, a lampa gaśnie.',
          sci: 'Poniżej napięcia progowego kanał znika: prąd nie płynie ze źródła do drenu.',
        },
      },
      panel: {
        kid: [
          'To tranzystor, przełącznik, z którego zbudowane są układy scalone, powiększony do olbrzymich rozmiarów. Nie ma ruchomych części: elektrony mogą przejść z jednej strony, ze źródła, na drugą, do drenu, tylko gdy bramka na górze jest włączona.',
          'Bramka nigdy nie dotyka krzemu. Leży na cienkiej warstewce szkła, dwutlenku krzemu, którą krzem sam na sobie wytwarza, a jej elektryczne przyciąganie sięga przez nią i zbiera elektrony w mostek. Telefon ma miliardy takich przełączników, a każdy włącza się i wyłącza nawet miliardy razy na sekundę.',
        ],
        sci: [
          'Tranzystor MOSFET z kanałem typu n (tranzystor polowy metal-tlenek-półprzewodnik): dwa obszary typu n, źródło i dren, w krzemie typu p, a nad szczeliną między nimi bramka na cienkiej warstwie dwutlenku krzemu. Powyżej napięcia progowego pole bramki przyciąga elektrony do powierzchni i odwraca ją w kanał typu n; do samej bramki prawie nie płynie prąd.',
          'Krzem wygrał z germanem, bo sam wytwarza trwały, izolujący tlenek (tlenek germanu rozpuszcza się w wodzie) i działa w wyższych temperaturach. Mohamed Atalla i Dawon Kahng zbudowali pierwszy MOSFET w Bell Labs w 1959 roku. W najszybszych dzisiejszych układach dwutlenek krzemu ma grubość zaledwie kilku atomów, a nad nim leży warstwa tlenku hafnu, przez którą przecieka mniej prądu.',
        ],
      },
    },
    chip: {
      label: 'Układ, który liczy',
      grow: 'Dzisiejszy układ',
      back: 'Wróć do 4004',
      title: 'Od 2300 do miliardów',
      unit: 'tranzystory',
      one: 'jeden Intel 4004, 1971',
      each: 'każde światełko to cały 4004',
      phone: 'mniej więcej tyle, co w układzie telefonu',
      says: {
        grow: {
          kid: 'Oddalamy się! Każde światełko staje się całym układem 4004, a potem jeszcze raz: 12 miliardów, mniej więcej tyle, co w telefonie!',
          sci: 'Każdy krok zamienia każdy tranzystor w cały układ 4004: 2300 × 2300 × 2300 = 12 167 000 000, mniej więcej tyle, ile ma procesor telefonu.',
        },
        back: {
          kid: 'Z powrotem do pierwszego: 2300 światełek, po jednym na każdy przełącznik w 4004.',
          sci: '4004: 2300 tranzystorów na płytce 3 × 4 mm, wykonany w technologii MOS z bramką krzemową 10 µm.',
        },
      },
      panel: {
        kid: [
          'Intel 4004 z 1971 roku był pierwszym mózgiem komputera sprzedawanym jako jeden układ scalony, zrobionym do kalkulatora. Każde z tych 2300 światełek to jeden z jego tranzystorów, przełączników, które widać na tym wzgórzu.',
          'Oddal się, a każde światełko stanie się całym układem 4004, a potem każdy z nich jeszcze raz. Wychodzi około 12 miliardów światełek, mniej więcej tyle przełączników, ile ma układ w telefonie: o wiele za dużo, żeby je widzieć pojedynczo, więc razem po prostu świecą.',
        ],
        sci: [
          'Intel 4004 (listopad 1971), zaprojektowany przez Federica Faggina, Teda Hoffa, Stanleya Mazora i Masatoshiego Shimę dla kalkulatorów firmy Busicom: 4-bitowy procesor z 2300 tranzystorami na płytce 3 × 4 mm, wykonany w opracowanej przez Faggina technologii MOS z bramką krzemową 10 µm, taktowany zegarem do 740 kHz.',
          'Dwa kroki po ×2300 dają 2300³, około 1,2 × 10¹⁰ tranzystorów. Układ A14 Apple do telefonów (2020) ma ich 11,8 miliarda; największe dzisiejsze procesory mają ponad 100 miliardów, a każdy z nich to MOSFET taki jak ten na wzgórzu, o rozmiarach kilkudziesięciu nanometrów.',
        ],
      },
    },
    vial: {
      label: 'Krzem Berzeliusa',
      verb: 'Obejrzyj',
      tag: 'Berzelius, 1824',
      title: 'Tu się zaczęło: brązowy proszek',
      says: {
        kid: 'Trochę brązowego proszku: pierwszy krzem, jaki ktokolwiek otrzymał osobno, w 1824 roku.',
        sci: 'Krzem bezpostaciowy, taki, jaki Berzelius otrzymał w 1824 roku, ogrzewając fluorokrzemian potasu z potasem.',
      },
      panel: {
        kid: [
          'W 1824 roku w Sztokholmie szwedzki chemik Jöns Jacob Berzelius ogrzał sól krzemu z metalicznym potasem i wypłukał całą resztę. Został brązowy proszek: krzem, którego nikt wcześniej nie widział osobno.',
          'Nikt wtedy nie mógł zgadnąć, że ponad 130 lat później ten pierwiastek wypełni całą dolinę firmami, a twoją kieszeń telefonem.',
        ],
        sci: [
          'Berzelius zredukował fluorokrzemian potasu, K2SiF6, stopionym potasem i płukał produkt raz po raz, aż został brązowy proszek krzemu bezpostaciowego. Gay-Lussac i Thénard mogli otrzymać trochę zanieczyszczonego krzemu już w 1811 roku, nie rozpoznając w nim nowego pierwiastka.',
          'Krzem krystaliczny, szary i błyszczący, pierwszy otrzymał Henri Sainte-Claire Deville w 1854 roku. Pierwszy tranzystor (1947) był z germanu; krzem przejął jego miejsce w latach 60. XX wieku, w postaci monokryształów o wiele czystszych niż proszek Berzeliusa.',
        ],
      },
    },
  },
  de: {
    title: 'Über dem Silicon Valley',
    greet: {
      kid: 'Was für eine Aussicht! Da unten liegt ein echtes Tal in Kalifornien, voller Obstbäume. Benutze den Hebel am Aussichtspunkt und schau, wie es zum Silicon Valley wird. Die Geschichte dieses Bildes steht auf der Staffelei neben dir.',
      sci: 'Unter uns liegt das Santa Clara Valley südlich von San Francisco, so wie es 1950 war. Der Hebel am Aussichtspunkt lässt es bis heute weiterlaufen; der Transistor und der 4004 auf diesem Hügel zeigen, was dort gewachsen ist. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Da unten gibt es keine Siliciumminen! Das Tal hat seinen Namen bekommen, weil dort so viele Firmen Dinge aus Silicium gemacht haben.',
        'Im Frühling, bevor die Fabriken kamen, war das ganze Tal weiß und rosa vor lauter Blüten. Ein paar der alten Obstgärten gibt es heute noch.',
        'Die ersten Chips hatten eine Handvoll Transistoren. Der Chip in einem Handy hat Milliarden, jeder viel zu klein, um ihn zu sehen.',
      ],
      sci: [
        'Die Bandlücke von Silicium beträgt bei Raumtemperatur 1,12 eV, die von Germanium 0,66 eV: Wärme setzt in Silicium viel weniger Elektronen frei, darum schalten seine Transistoren auch heiß noch sauber.',
        '1965 bemerkte Gordon Moore, dass sich die Zahl der Bauteile auf einem Chip jedes Jahr verdoppelte; 1975 änderte er es auf alle zwei Jahre. Das „Mooresche Gesetz“ hielt jahrzehntelang.',
        'Jack Kilby von Texas Instruments baute 1958 den ersten integrierten Schaltkreis, aus Germanium, die Teile mit feinen Golddrähten verbunden. Noyces Entwurf von 1959 war flaches Silicium mit Metallbahnen auf dem Oxid: ein Chip, den man in Massen herstellen konnte.',
      ],
    },
    valley: {
      label: 'Das Tal im Lauf der Zeit',
      next: 'Dreh die Zeit weiter',
      restart: 'Zurück nach 1950',
      title: 'Von Obstgärten zu Chips',
      year: 'Jahr',
      today: 'heute',
      paper: 'Electronic News, 11. Januar 1971',
      board: {
        y1950: '„Valley of Heart’s Delight“',
        y1956: 'Shockleys Labor',
        y1957: 'Fairchild Semiconductor',
        y1959: 'Noyces Siliciumchip',
        y1968: 'Intel',
        y1971: '„Silicon Valley U.S.A.“',
        today: 'Silicon Valley heute',
      },
      says: {
        y1950: {
          kid: 'Wir sind im Jahr 1950: Obstgärten, so weit das Auge reicht, mit Aprikosen, Pflaumen und Kirschen. Man nannte es „Valley of Heart’s Delight“, das Tal der Herzensfreude.',
          sci: '1950: Das Santa Clara Valley, das „Valley of Heart’s Delight“, besteht vor allem aus Obstgärten; die Pflaumen werden zu Trockenpflaumen, die Aprikosen kommen in die Konservenfabriken der Stadt.',
        },
        y1956: {
          kid: '1956: William Shockley, einer der Erfinder des Transistors, eröffnet hier ein Labor, um Transistoren aus Silicium zu bauen.',
          sci: '1956: William Shockley, im selben Jahr Physik-Nobelpreisträger mit Bardeen und Brattain, eröffnet das Shockley Semiconductor Laboratory in Mountain View, um Siliciumtransistoren herzustellen.',
        },
        y1957: {
          kid: '1957: Acht seiner Ingenieure gehen und gründen ihre eigene Firma, Fairchild Semiconductor.',
          sci: '1957: Acht von Shockleys Ingenieuren, darunter Robert Noyce und Gordon Moore, gehen und gründen Fairchild Semiconductor.',
        },
        y1959: {
          kid: '1959: Bei Fairchild findet Robert Noyce heraus, wie man eine ganze Schaltung auf ein einziges flaches Stück Silicium bringt: ein Chip!',
          sci: '1959: Bei Fairchild entwirft Robert Noyce den planaren integrierten Schaltkreis, aufbauend auf Jean Hoernis Planarverfahren: die Bauteile und ihre Metallverbindungen auf einem flachen, oxidbedeckten Stück Silicium.',
        },
        y1968: {
          kid: '1968: Robert Noyce und Gordon Moore gründen eine neue Firma: Intel.',
          sci: '1968: Noyce und Moore verlassen Fairchild und gründen Intel; Leute von Fairchild gründen Dutzende weitere Firmen.',
        },
        y1971: {
          kid: '1971: Ein Journalist nennt die Gegend Silicon Valley, und der Name bleibt! Im selben Jahr baut Intel den 4004, das Gehirn eines Computers auf einem einzigen Chip.',
          sci: '11. Januar 1971: In den Electronic News beginnt Don Hoeflers Serie „Silicon Valley U.S.A.“. Im November bringt Intel den 4004 heraus, den ersten Mikroprozessor, der als ein einziger Chip verkauft wurde.',
        },
        today: {
          kid: 'Heute: überall Lichter, und nur noch ein paar Obstgärten. Viele Handys, Computer und Webseiten der Welt werden da unten entworfen.',
          sci: 'Heute leben im Santa Clara County fast zwei Millionen Menschen, gegenüber etwa 290 000 im Jahr 1950. Chips werden hier entworfen, aber die meisten anderswo gefertigt, viele davon in Taiwan.',
        },
      },
      panel: {
        kid: [
          '1950 war dieses Tal südlich von San Francisco eines der größten Obstanbaugebiete der Welt: Aprikosen, Pflaumen und Kirschen in Obstgärten, so weit das Auge reichte. Man nannte es „Valley of Heart’s Delight“, das Tal der Herzensfreude.',
          'Dann fand man heraus, dass sehr reines Silicium wunderbare winzige elektrische Schalter ergibt, Transistoren. Hier entstanden nacheinander Firmen, die sie herstellten, und aus alten Firmen wuchsen neue. Dreh die Jahre mit dem Hebel weiter, oder mit dem Schieberegler hier, und schau, wie die Bäume Gebäuden, Lichtern und Autos weichen.',
          '1971 schrieb ein Journalist über die Gegend und nannte sie Silicon Valley, das Siliciumtal. Der Name blieb, obwohl dort gar kein Silicium abgebaut wird: Das Silicium steckt in dem, was man dort macht.',
        ],
        sci: [
          'Das Santa Clara Valley gehörte zu den größten Obstanbaugebieten der Welt, mit Konservenfabriken und Trockenplätzen für seine Pflaumen und Aprikosen. Die Stanford University an seinem Nordende ermunterte ihre Ingenieure, in der Nähe Firmen zu gründen: Hewlett-Packard begann 1939 in einer Garage in Palo Alto.',
          'Die Siliciumindustrie kam 1956 mit William Shockleys Labor in Mountain View. Die acht, die ihn 1957 verließen, gründeten Fairchild Semiconductor, wo Jean Hoernis Planarverfahren und Robert Noyces integrierter Schaltkreis (1959) festlegten, wie Chips bis heute gemacht werden; Leute von Fairchild gründeten danach Dutzende Firmen, darunter Intel (1968).',
          'Don Hoefler gab der Gegend ihren Namen in „Silicon Valley U.S.A.“, einer Serie in den Electronic News, die am 11. Januar 1971 begann; im November kam Intels 4004. Die Obstgärten wurden von den 1950er- bis in die 1980er-Jahre überbaut. Heute entwirft das Tal einen großen Teil der Chips der Welt; die meisten werden anderswo gefertigt.',
        ],
      },
    },
    gate: {
      label: 'Der Schalter',
      on: 'Gate an',
      off: 'Gate aus',
      title: 'Ein Schalter ohne bewegliche Teile',
      parts: { source: 'Source', gate: 'Gate', drain: 'Drain', silicon: 'Silicium' },
      says: {
        on: {
          kid: 'Klick! Das Gate zieht Elektronen zu einer Brücke unter sich zusammen, und sie flitzen hinüber: Die Lampe leuchtet!',
          sci: 'Eine positive Gatespannung zieht Elektronen an die Oberfläche unter dem Oxid: Ein n-Kanal verbindet Source und Drain, und es fließt Strom.',
        },
        off: {
          kid: 'Gate aus: Die Brücke ist weg, die Elektronen bleiben stehen und die Lampe geht aus.',
          sci: 'Unterhalb der Schwellenspannung verschwindet der Kanal: Von Source zu Drain fließt kein Strom.',
        },
      },
      panel: {
        kid: [
          'Das ist ein Transistor, der Schalter, aus dem Chips bestehen, riesig vergrößert. Er hat keine beweglichen Teile: Elektronen kommen nur dann von einer Seite, der Source, zur anderen, dem Drain, wenn das Gate oben eingeschaltet ist.',
          'Das Gate berührt das Silicium nie. Es liegt auf einer dünnen Haut aus Glas, Siliciumdioxid, die das Silicium selbst auf sich wachsen lässt, und seine elektrische Anziehung reicht hindurch und sammelt Elektronen zu einer Brücke. Ein Handy hat Milliarden solcher Schalter, und jeder schaltet bis zu Milliarden Mal in der Sekunde ein und aus.',
        ],
        sci: [
          'Ein n-Kanal-MOSFET (Metall-Oxid-Halbleiter-Feldeffekttransistor): zwei n-dotierte Gebiete, Source und Drain, in p-dotiertem Silicium, und über der Lücke zwischen ihnen das Gate auf einer dünnen Schicht Siliciumdioxid. Oberhalb der Schwellenspannung zieht das Feld des Gates Elektronen an die Oberfläche und invertiert sie zu einem n-Kanal; ins Gate selbst fließt fast kein Strom.',
          'Silicium setzte sich gegen Germanium durch, weil es ein eigenes stabiles, isolierendes Oxid bildet (das des Germaniums löst sich in Wasser) und bei höheren Temperaturen arbeitet. Mohamed Atalla und Dawon Kahng bauten 1959 bei den Bell Labs den ersten MOSFET. In den schnellsten Chips von heute ist das Siliciumdioxid nur wenige Atome dick, unter einer Schicht Hafniumoxid, durch die weniger Strom entweicht.',
        ],
      },
    },
    chip: {
      label: 'Der Chip, der zählt',
      grow: 'Der Chip von heute',
      back: 'Zurück zum 4004',
      title: 'Von 2300 zu Milliarden',
      unit: 'Transistoren',
      one: 'ein Intel 4004, 1971',
      each: 'jedes Licht ist ein ganzer 4004',
      phone: 'etwa so viele wie im Chip eines Handys',
      says: {
        grow: {
          kid: 'Rauszoomen! Jedes Licht wird ein ganzer 4004-Chip, und dann noch einmal: 12 Milliarden, etwa so viele wie in einem Handy!',
          sci: 'Jeder Schritt macht aus jedem Transistor einen ganzen 4004: 2300 × 2300 × 2300 = 12 167 000 000, etwa so viele wie im Prozessor eines Handys.',
        },
        back: {
          kid: 'Zurück zum allerersten: 2300 Lichter, eines für jeden Schalter im 4004.',
          sci: 'Der 4004: 2300 Transistoren auf einem Chip von 3 × 4 mm, gefertigt in 10-µm-Silicon-Gate-MOS-Technik.',
        },
      },
      panel: {
        kid: [
          'Der Intel 4004 von 1971 war das erste Computergehirn, das als ein einziger Chip verkauft wurde, gebaut für einen Taschenrechner. Jedes dieser 2300 Lichter steht für einen seiner Transistoren, die Schalter, die du auf diesem Hügel siehst.',
          'Zoom heraus, und jedes Licht wird ein ganzer 4004, und dann jeder davon noch einmal. Das ergibt etwa 12 Milliarden Lichter, ungefähr so viele Schalter wie im Chip eines Handys: viel zu viele, um sie einzeln zu sehen, darum leuchten sie zusammen nur noch.',
        ],
        sci: [
          'Intels 4004 (November 1971), entworfen von Federico Faggin, Ted Hoff, Stanley Mazor und Masatoshi Shima für die Rechner von Busicom: ein 4-Bit-Prozessor mit 2300 Transistoren auf einem Chip von 3 × 4 mm, gefertigt in Faggins Silicon-Gate-MOS-Verfahren mit 10 µm und mit bis zu 740 kHz getaktet.',
          'Zwei Schritte von ×2300 ergeben 2300³, etwa 1,2 × 10¹⁰ Transistoren. Apples Handychip A14 (2020) hat 11,8 Milliarden; die größten Prozessoren von heute haben über 100 Milliarden, jeder davon ein MOSFET wie der auf diesem Hügel, nur einige Dutzend Nanometer groß.',
        ],
      },
    },
    vial: {
      label: 'Berzelius’ Silicium',
      verb: 'Betrachte',
      tag: 'Berzelius, 1824',
      title: 'Wo alles anfing: ein braunes Pulver',
      says: {
        kid: 'Ein bisschen braunes Pulver: das erste Silicium, das jemand für sich allein gewonnen hat, 1824.',
        sci: 'Amorphes Silicium, wie Berzelius es 1824 gewann, indem er Kaliumhexafluorosilicat mit Kalium erhitzte.',
      },
      panel: {
        kid: [
          '1824 erhitzte der schwedische Chemiker Jöns Jacob Berzelius in Stockholm ein Salz des Siliciums mit dem Metall Kalium und wusch alles andere weg. Übrig blieb ein braunes Pulver: Silicium, das noch nie jemand für sich allein gesehen hatte.',
          'Niemand konnte damals ahnen, dass dieses Element mehr als 130 Jahre später ein ganzes Tal mit Firmen füllen würde, und deine Tasche mit einem Handy.',
        ],
        sci: [
          'Berzelius reduzierte Kaliumhexafluorosilicat, K2SiF6, mit geschmolzenem Kalium und wusch das Produkt immer wieder aus, bis ein braunes Pulver aus amorphem Silicium übrig blieb. Gay-Lussac und Thénard hatten 1811 vielleicht schon etwas unreines Silicium gewonnen, ohne es als neues Element zu erkennen.',
          'Kristallines Silicium, grau und glänzend, stellte Henri Sainte-Claire Deville 1854 als Erster her. Der erste Transistor (1947) war aus Germanium; Silicium übernahm in den 1960er-Jahren, als Einkristalle, viel reiner als Berzelius’ Pulver.',
        ],
      },
    },
  },
}
