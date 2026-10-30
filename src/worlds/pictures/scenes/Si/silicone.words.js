// The words of silicon's silicone room ("Is your cake mould made of silicon?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Si.js (the easel shows it). Each step is done by tapping its thing: `hints` are what
// the prompt shows as the next step, `verbs` the panels' buttons that do the same; `signs` are drawn in 3D
// (plain text): the two words on the tiles over the tray and the silicon, the puller's two buttons.
export const SILICONE_WORDS = {
  en: {
    title: 'The silicone kitchen',
    greet: {
      kid: "Welcome to the kitchen in the picture! I am silicon, and people mix me up with silicone all the time. Let's find out which is which. The story of this picture is on the easel beside you.",
      sci: "Silicon the element, and the silicones made from it: this kitchen is about the difference. Three things to try, and the picture's story on the easel.",
    },
    talk: {
      kid: [
        'Silicon is me: hard, shiny and grey, like a metal that breaks like glass. Silicone is made from me, and it is soft and bendy.',
        'In silicone, my atoms hold hands with oxygen atoms, again and again, in a long, long chain.',
        'Swimming caps, the seal round the bath, soft phone cases and that blue putty: they are all silicone.',
      ],
      sci: [
        'Silicones are made from silicon itself: in the Müller-Rochow direct process, silicon and chloromethane over copper at about 300 °C give dimethyldichlorosilane, (CH3)2SiCl2.',
        'Water hydrolyses (CH3)2SiCl2 to the silanediol (CH3)2Si(OH)2, which condenses, losing water, into Si-O-Si chains and rings.',
        'The methyl groups face outwards, so silicone surfaces have a low surface energy, about 20 mN/m: water beads up on them and batter lets go.',
      ],
    },
    tray: {
      label: 'Silicon or silicone?',
      verbs: { bend: 'Bend the tray', snap: 'Bend the silicon', oven: 'Into the hot oven', freeze: 'Into the freezer' },
      signs: { silicone: 'silicone', silicon: 'silicon' },
      hints: { bend: 'Tap the tray to bend it', snap: 'Tap the silicon to bend it', oven: 'Tap the oven', freeze: 'Tap the freezer' },
      title: 'Silicon or silicone?',
      says: {
        bend: { kid: 'Boing! It bends and twists, the muffins pop out, and it springs straight back.', sci: 'Rubber elasticity: the cross-linked chains uncoil under the load and coil up again when let go.' },
        snap: { kid: 'Crack! Silicon cannot bend: it snaps like glass. Here is a new piece.', sci: 'Brittle fracture: at room temperature crystalline silicon cleaves instead of bending.' },
        oven: { kid: 'In the hot oven at 220 °C, and out again: still soft and bendy!', sci: '220 °C is within its range: silicone bakeware is usually rated to about 230 °C or more.' },
        freeze: { kid: 'In the freezer at −18 °C, and out again: still bendy, not cracked!', sci: '−18 °C is far above the glass transition of the chains (about −125 °C): they still move.' },
      },
      panel: {
        kid: [
          'Silicon and silicone sound almost the same, but they are very different things. Silicon is an element: hard, shiny and grey. If you try to bend it, it snaps like glass. Computer chips are made of it.',
          'Silicone is made from silicon. In silicone, silicon and oxygen atoms are joined into long chains that can wiggle and uncoil, so a silicone tray bends, twists and springs back. It does not melt in a hot oven or crack in the freezer, and muffins do not stick to it.',
        ],
        sci: [
          'Silicon is a crystalline element with the diamond structure: each atom holds four neighbours by strong, directional covalent bonds. At room temperature nothing in the crystal can slip, so instead of bending it breaks by brittle fracture, most easily along its (111) crystal planes.',
          'A silicone tray is cross-linked polydimethylsiloxane rubber, usually reinforced with fine silica. Between the cross-links the chains uncoil when stretched and recoil when let go (rubber elasticity), from far below freezing to above 200 °C; bakeware is usually rated from about −40 °C to 230 °C or more. Its methyl groups face outwards and give a low-energy, non-stick surface.',
        ],
      },
    },
    putty: {
      label: 'The bouncing putty',
      verbs: { throw: 'Throw it', slow: 'Pull it slowly', fast: 'Pull it fast', leave: 'Leave it alone' },
      hints: { throw: 'Tap the putty to throw it', slow: 'Press the green button', fast: 'Press the red button', leave: 'Tap the timer and wait' },
      signs: { slow: 'pull slowly', fast: 'pull fast' },
      title: 'Solid or liquid?',
      says: {
        throw: { kid: 'Boing, boing, boing! It bounces like a rubber ball.', sci: 'A sudden impact: the cross-links have no time to let go, so the putty answers like an elastic solid.' },
        slow: { kid: 'Pulled gently, it stretches and stretches, like chewing gum.', sci: 'A slow pull: the cross-links let go and re-form as it goes, so the putty flows.' },
        fast: { kid: 'Snap! Pulled fast, it breaks in two, with clean, flat ends.', sci: 'A fast pull: no time to flow, so it fractures like a brittle solid, leaving flat faces.' },
        leave: { kid: 'Now we wait... slowly, slowly it sags into a puddle. Here it is sped up: really it takes much longer.', sci: 'Under its own weight it creeps and spreads (sped up here): given time, it is a liquid.' },
      },
      panel: {
        kid: [
          'This blue putty is made from silicone too. It was found by accident in 1943 by James Wright, an engineer who was trying to make a new kind of rubber. It was no good as rubber, but it was great fun, and it became a famous toy.',
          'Is it a solid or a liquid? Both! When things happen fast, it acts like a solid: it bounces, and it snaps if you pull it hard. Given time, it acts like a liquid: it stretches when you pull it slowly, and left alone it slowly spreads into a puddle. Try all four: tap the putty, press the green and the red button, and tap the timer.',
        ],
        sci: [
          'Bouncing putty is silicone oil (polydimethylsiloxane) heated with boric acid. It is credited to James Wright of General Electric in 1943, during the search for a synthetic rubber in the Second World War (Earl Warrick at Dow Corning made a similar putty at about the same time); it has been sold as a toy, Silly Putty, since 1950.',
          'Boron links the chains through B-O-Si bonds and weaker boron-oxygen attractions that keep breaking and re-forming. Deformed faster than the links can rearrange, the network behaves as an elastic solid: it bounces, and it fractures with clean faces. Deformed more slowly, the links let go and it flows. It is a viscoelastic liquid: whether it flows depends on how long you watch, which rheologists measure with the Deborah number.',
        ],
      },
    },
    chain: {
      label: 'The silicone chain',
      hint: 'Slide the temperature',
      temp: 'Temperature',
      title: 'A chain that wiggles',
      says: {
        freeze: { kid: 'Brrr! Below about −125 °C the chain freezes stiff: it cannot wiggle at all.', sci: 'Below the glass transition, about −125 °C, the segments of the backbone lock where they are.' },
        heat: { kid: 'Hotter than an oven, and the chain wiggles like mad, but it does not fall apart!', sci: 'Hot: the segments move fast, but the strong Si-O bonds hold; silicone rubber works for thousands of hours at 200 °C.' },
        room: { kid: 'Back to room temperature: the chain wiggles gently. That is why silicone is soft and bendy.', sci: 'At 20 °C polydimethylsiloxane is about 145 °C above its glass transition: a very mobile chain.' },
      },
      panel: {
        kid: [
          "This is silicone up close, like in the picture's magnifying glass: a long chain of silicon (beige) and oxygen (red), silicon, oxygen, over and over. Each silicon also holds two little groups of carbon (dark grey) and hydrogen (white), sticking out at the sides.",
          'Slide the temperature. Warm chains wiggle and slide past each other: that makes silicone soft and bendy. Only at about −125 °C, much colder than any freezer, do they freeze stiff. And even at 250 °C, hotter than an oven, the chain holds together.',
        ],
        sci: [
          'Polydimethylsiloxane, -[Si(CH3)2-O]n-, the commonest silicone. Its Si-O bonds are long (about 164 pm, against 154 pm for C-C), its Si-O-Si angle is wide (about 143°) and bends easily, and turning about an Si-O bond costs almost no energy. So the chain is very flexible: PDMS has one of the lowest glass transitions of any polymer, about −125 °C. (Long chains cooled slowly can also crystallise; the crystals melt near −40 °C.)',
          'The Si-O bond is also strong, roughly 450 kJ/mol against about 350 for C-C, so silicones keep their properties to well over 200 °C. Frederic Kipping named them in 1901 after the ketones (R2C=O), expecting R2Si=O; but silicon makes no stable double bond to oxygen, and R2SiO units join up into Si-O-Si chains and rings instead.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A cozinha do silicone',
    greet: {
      kid: 'Bem-vindo à cozinha da imagem! Eu sou o silício, e estão sempre a confundir-me com o silicone. Vamos descobrir qual é qual. A história desta imagem está no cavalete ao teu lado.',
      sci: 'O silício, o elemento, e os silicones feitos a partir dele: esta cozinha é sobre a diferença. Há três coisas para experimentar, e a história da imagem no cavalete.',
    },
    talk: {
      kid: [
        'O silício sou eu: duro, brilhante e cinzento, como um metal que se parte como vidro. O silicone é feito a partir de mim, e é mole e dobrável.',
        'No silicone, os meus átomos dão as mãos a átomos de oxigénio, uma e outra vez, numa cadeia muito, muito comprida.',
        'Toucas de natação, o vedante à volta da banheira, capas macias de telemóvel e aquela massa azul: é tudo silicone.',
      ],
      sci: [
        'Os silicones fazem-se a partir do próprio silício: no processo direto de Müller-Rochow, silício e clorometano sobre cobre a cerca de 300 °C dão diclorodimetilsilano, (CH3)2SiCl2.',
        'A água hidrolisa o (CH3)2SiCl2 no silanodiol (CH3)2Si(OH)2, que condensa, libertando água, em cadeias e anéis Si-O-Si.',
        'Os grupos metilo ficam virados para fora, por isso as superfícies de silicone têm uma energia de superfície baixa, cerca de 20 mN/m: a água forma gotas e a massa dos bolos descola.',
      ],
    },
    tray: {
      label: 'Silício ou silicone?',
      verbs: { bend: 'Dobrar a forma', snap: 'Dobrar o silício', oven: 'Para o forno quente', freeze: 'Para o congelador' },
      signs: { silicone: 'silicone', silicon: 'silício' },
      hints: { bend: 'Toca na forma para a dobrar', snap: 'Toca no silício para o dobrar', oven: 'Toca no forno', freeze: 'Toca no congelador' },
      title: 'Silício ou silicone?',
      says: {
        bend: { kid: 'Boing! Dobra e torce, os queques saltam fora, e volta logo à forma.', sci: 'Elasticidade da borracha: as cadeias reticuladas desenrolam-se sob a força e voltam a enrolar-se quando as largas.' },
        snap: { kid: 'Crac! O silício não dobra: parte-se como vidro. Aqui está um pedaço novo.', sci: 'Fratura frágil: à temperatura ambiente, o silício cristalino cliva em vez de dobrar.' },
        oven: { kid: 'Para o forno quente a 220 °C, e cá fora outra vez: continua mole e dobrável!', sci: '220 °C está dentro da sua gama: as formas de silicone costumam aguentar até cerca de 230 °C ou mais.' },
        freeze: { kid: 'Para o congelador a −18 °C, e cá fora outra vez: continua dobrável, sem rachar!', sci: '−18 °C está muito acima da transição vítrea das cadeias (cerca de −125 °C): continuam a mexer-se.' },
      },
      panel: {
        kid: [
          'Silício e silicone soam quase igual, mas são coisas muito diferentes. O silício é um elemento: duro, brilhante e cinzento. Se o tentares dobrar, parte-se como vidro. Os chips dos computadores são feitos dele.',
          'O silicone é feito a partir do silício. No silicone, átomos de silício e de oxigénio estão ligados em cadeias compridas que se podem mexer e desenrolar, por isso uma forma de silicone dobra, torce e volta à forma. Não derrete no forno quente nem racha no congelador, e os queques não se agarram a ela.',
        ],
        sci: [
          'O silício é um elemento cristalino com a estrutura do diamante: cada átomo segura quatro vizinhos por ligações covalentes fortes e direcionais. À temperatura ambiente nada no cristal consegue deslizar, por isso, em vez de dobrar, parte-se por fratura frágil, mais facilmente ao longo dos seus planos cristalinos (111).',
          'Uma forma de silicone é borracha de polidimetilsiloxano reticulada, geralmente reforçada com sílica fina. Entre as ligações cruzadas, as cadeias desenrolam-se quando esticadas e voltam a enrolar-se quando largadas (elasticidade da borracha), desde muito abaixo de zero até mais de 200 °C; as formas costumam estar indicadas para cerca de −40 °C a 230 °C ou mais. Os seus grupos metilo ficam virados para fora e dão uma superfície de baixa energia, antiaderente.',
        ],
      },
    },
    putty: {
      label: 'A massa saltitona',
      verbs: { throw: 'Atirá-la', slow: 'Puxá-la devagar', fast: 'Puxá-la depressa', leave: 'Deixá-la em paz' },
      hints: { throw: 'Toca na massa para a atirar', slow: 'Carrega no botão verde', fast: 'Carrega no botão vermelho', leave: 'Toca no temporizador e espera' },
      signs: { slow: 'puxar devagar', fast: 'puxar depressa' },
      title: 'Sólido ou líquido?',
      says: {
        throw: { kid: 'Boing, boing, boing! Salta como uma bola de borracha.', sci: 'Um choque súbito: as ligações cruzadas não têm tempo de se soltar, por isso a massa responde como um sólido elástico.' },
        slow: { kid: 'Puxada com calma, estica e estica, como pastilha elástica.', sci: 'Um puxão lento: as ligações cruzadas soltam-se e voltam a formar-se pelo caminho, por isso a massa escorre.' },
        fast: { kid: 'Zás! Puxada depressa, parte-se em duas, com pontas lisas e direitas.', sci: 'Um puxão rápido: sem tempo para escorrer, fratura como um sólido frágil e deixa faces planas.' },
        leave: { kid: 'Agora esperamos... devagarinho, devagarinho, desfaz-se numa poça. Aqui está acelerado: na verdade demora muito mais.', sci: 'Sob o seu próprio peso, flui e espalha-se (aqui acelerado): com tempo, é um líquido.' },
      },
      panel: {
        kid: [
          'Esta massa azul também é feita de silicone. Foi descoberta por acaso em 1943 por James Wright, um engenheiro que tentava fazer um novo tipo de borracha. Não servia como borracha, mas era muito divertida, e tornou-se um brinquedo famoso.',
          'É sólida ou líquida? As duas coisas! Quando tudo acontece depressa, porta-se como um sólido: salta, e parte-se se a puxares com força. Com tempo, porta-se como um líquido: estica quando a puxas devagar e, se a deixares em paz, espalha-se devagarinho numa poça. Experimenta as quatro: toca na massa, carrega no botão verde e no vermelho, e toca no temporizador.',
        ],
        sci: [
          'A massa saltitona é óleo de silicone (polidimetilsiloxano) aquecido com ácido bórico. É atribuída a James Wright, da General Electric, em 1943, durante a procura de uma borracha sintética na Segunda Guerra Mundial (Earl Warrick, da Dow Corning, fez uma massa parecida mais ou menos na mesma altura); vende-se como brinquedo, Silly Putty, desde 1950.',
          'O boro liga as cadeias através de ligações B-O-Si e de atrações boro-oxigénio mais fracas, que estão sempre a partir-se e a formar-se de novo. Deformada mais depressa do que as ligações se conseguem rearranjar, a rede porta-se como um sólido elástico: salta, e fratura com faces limpas. Deformada mais devagar, as ligações soltam-se e ela escorre. É um líquido viscoelástico: escorrer ou não depende de quanto tempo esperas, o que os reologistas medem com o número de Deborah.',
        ],
      },
    },
    chain: {
      label: 'A cadeia de silicone',
      hint: 'Mexe na temperatura',
      temp: 'Temperatura',
      title: 'Uma cadeia que se mexe',
      says: {
        freeze: { kid: 'Brrr! Abaixo de cerca de −125 °C, a cadeia fica congelada e rígida: não se consegue mexer nada.', sci: 'Abaixo da transição vítrea, cerca de −125 °C, os segmentos do esqueleto ficam presos onde estão.' },
        heat: { kid: 'Mais quente do que um forno, e a cadeia mexe-se como louca, mas não se desfaz!', sci: 'Quente: os segmentos mexem-se depressa, mas as ligações Si-O, fortes, aguentam; a borracha de silicone trabalha milhares de horas a 200 °C.' },
        room: { kid: 'De volta à temperatura ambiente: a cadeia mexe-se devagarinho. É por isso que o silicone é mole e dobrável.', sci: 'A 20 °C, o polidimetilsiloxano está cerca de 145 °C acima da sua transição vítrea: uma cadeia muito móvel.' },
      },
      panel: {
        kid: [
          'Isto é o silicone visto muito de perto, como na lupa da imagem: uma cadeia comprida de silício (bege) e oxigénio (vermelho), silício, oxigénio, sempre assim. Cada silício segura ainda dois grupinhos de carbono (cinzento-escuro) e hidrogénio (branco), espetados dos lados.',
          'Mexe na temperatura. As cadeias quentes mexem-se e deslizam umas sobre as outras: é isso que torna o silicone mole e dobrável. Só a cerca de −125 °C, muito mais frio do que qualquer congelador, é que ficam rígidas. E mesmo a 250 °C, mais quente do que um forno, a cadeia não se desfaz.',
        ],
        sci: [
          'Polidimetilsiloxano, -[Si(CH3)2-O]n-, o silicone mais comum. As ligações Si-O são compridas (cerca de 164 pm, contra 154 pm na C-C), o ângulo Si-O-Si é largo (cerca de 143°) e dobra-se com facilidade, e rodar em torno de uma ligação Si-O quase não custa energia. Por isso a cadeia é muito flexível: o PDMS tem uma das transições vítreas mais baixas de todos os polímeros, cerca de −125 °C. (Cadeias longas arrefecidas devagar também podem cristalizar; os cristais fundem perto de −40 °C.)',
          'A ligação Si-O é também forte, cerca de 450 kJ/mol contra cerca de 350 na C-C, por isso os silicones mantêm as suas propriedades até bem acima de 200 °C. Frederic Kipping deu-lhes o nome em 1901, por analogia com as cetonas (R2C=O), esperando R2Si=O; mas o silício não faz uma ligação dupla estável com o oxigénio, e as unidades R2SiO juntam-se, em vez disso, em cadeias e anéis Si-O-Si.',
        ],
      },
    },
  },
  pl: {
    title: 'Silikonowa kuchnia',
    greet: {
      kid: 'Witaj w kuchni z obrazka! Jestem Krzem i wszyscy ciągle mylą mnie z silikonem. Sprawdźmy, co jest czym. Historia tego obrazka jest na sztaludze obok ciebie.',
      sci: 'Krzem, pierwiastek, i silikony z niego robione: ta kuchnia jest o różnicy między nimi. Trzy rzeczy do wypróbowania, a historia obrazka na sztaludze.',
    },
    talk: {
      kid: [
        'Krzem to ja: twardy, błyszczący i szary, jak metal, który pęka jak szkło. Silikon robi się ze mnie, ale on jest miękki i giętki.',
        'W silikonie moje atomy trzymają się za ręce z atomami tlenu, znowu i znowu, w długim, długim łańcuchu.',
        'Czepki pływackie, uszczelnienie wokół wanny, miękkie etui na telefony i ta niebieska masa: to wszystko silikon.',
      ],
      sci: [
        'Silikony robi się z samego krzemu: w metodzie bezpośredniej Müllera-Rochowa krzem i chlorometan nad miedzią w około 300 °C dają dichlorodimetylosilan, (CH3)2SiCl2.',
        'Woda hydrolizuje (CH3)2SiCl2 do silanodiolu (CH3)2Si(OH)2, który kondensuje, oddając wodę, w łańcuchy i pierścienie Si-O-Si.',
        'Grupy metylowe są zwrócone na zewnątrz, więc powierzchnia silikonu ma niską energię powierzchniową, około 20 mN/m: woda zbiera się w krople, a ciasto łatwo odchodzi.',
      ],
    },
    tray: {
      label: 'Krzem czy silikon?',
      verbs: { bend: 'Wygnij foremkę', snap: 'Wygnij krzem', oven: 'Do gorącego piekarnika', freeze: 'Do zamrażarki' },
      signs: { silicone: 'silikon', silicon: 'krzem' },
      hints: { bend: 'Dotknij foremki, żeby ją wygiąć', snap: 'Dotknij krzemu, żeby go wygiąć', oven: 'Dotknij piekarnika', freeze: 'Dotknij zamrażarki' },
      title: 'Krzem czy silikon?',
      says: {
        bend: { kid: 'Boing! Wygina się i skręca, babeczki wyskakują, a ona od razu wraca do kształtu.', sci: 'Elastyczność gumy: usieciowane łańcuchy rozwijają się pod obciążeniem i zwijają z powrotem, gdy je puścić.' },
        snap: { kid: 'Trzask! Krzem się nie wygina: pęka jak szkło. Oto nowy kawałek.', sci: 'Kruche pękanie: w temperaturze pokojowej krystaliczny krzem łupie się, zamiast się wyginać.' },
        oven: { kid: 'Do gorącego piekarnika, 220 °C, i z powrotem: nadal miękka i giętka!', sci: '220 °C mieści się w jej zakresie: silikonowe formy do pieczenia zwykle wytrzymują około 230 °C lub więcej.' },
        freeze: { kid: 'Do zamrażarki, −18 °C, i z powrotem: nadal giętka, nic nie pękło!', sci: '−18 °C to dużo powyżej temperatury zeszklenia łańcuchów (około −125 °C): nadal się ruszają.' },
      },
      panel: {
        kid: [
          'Krzem i silikon to dwie zupełnie różne rzeczy, choć ludzie ciągle je mylą (po angielsku brzmią prawie tak samo: silicon i silicone). Krzem to pierwiastek: twardy, błyszczący i szary. Jeśli spróbujesz go wygiąć, pęknie jak szkło. Robi się z niego chipy do komputerów.',
          'Silikon robi się z krzemu. W silikonie atomy krzemu i tlenu są połączone w długie łańcuchy, które mogą się wić i rozwijać, więc silikonowa foremka wygina się, skręca i wraca do kształtu. W gorącym piekarniku się nie topi, w zamrażarce nie pęka, a babeczki się do niej nie przyklejają.',
        ],
        sci: [
          'Krzem to pierwiastek krystaliczny o strukturze diamentu: każdy atom trzyma czterech sąsiadów mocnymi, kierunkowymi wiązaniami kowalencyjnymi. W temperaturze pokojowej nic w krysztale nie może się przesunąć, więc zamiast się wygiąć, pęka krucho, najłatwiej wzdłuż płaszczyzn krystalicznych (111).',
          'Silikonowa foremka to usieciowany kauczuk polidimetylosiloksanowy, zwykle wzmocniony drobną krzemionką. Między węzłami sieci łańcuchy rozwijają się przy rozciąganiu i zwijają z powrotem po puszczeniu (elastyczność gumy), od temperatur dużo poniżej zera do ponad 200 °C; formy do pieczenia mają zwykle zakres od około −40 °C do 230 °C lub więcej. Grupy metylowe zwrócone na zewnątrz dają powierzchnię o niskiej energii, nieprzywierającą.',
        ],
      },
    },
    putty: {
      label: 'Skacząca masa',
      verbs: { throw: 'Rzuć ją', slow: 'Ciągnij powoli', fast: 'Szarpnij szybko', leave: 'Zostaw ją' },
      hints: { throw: 'Dotknij masy, żeby ją rzucić', slow: 'Naciśnij zielony przycisk', fast: 'Naciśnij czerwony przycisk', leave: 'Dotknij minutnika i czekaj' },
      signs: { slow: 'ciągnij powoli', fast: 'szarpnij szybko' },
      title: 'Ciało stałe czy ciecz?',
      says: {
        throw: { kid: 'Hop, hop, hop! Odbija się jak gumowa piłka.', sci: 'Nagłe uderzenie: wiązania poprzeczne nie mają czasu się puścić, więc masa zachowuje się jak sprężyste ciało stałe.' },
        slow: { kid: 'Ciągnięta delikatnie, rozciąga się i rozciąga, jak guma do żucia.', sci: 'Powolne ciągnięcie: wiązania poprzeczne puszczają i tworzą się na nowo, więc masa płynie.' },
        fast: { kid: 'Trach! Szarpnięta szybko, pęka na dwie części z równymi, płaskimi końcami.', sci: 'Szybkie szarpnięcie: brak czasu na płynięcie, więc pęka jak kruche ciało stałe, zostawiając płaskie powierzchnie.' },
        leave: { kid: 'Teraz czekamy... powoli, powoli rozpływa się w kałużę. Tutaj jest przyspieszone: naprawdę trwa to dużo dłużej.', sci: 'Pod własnym ciężarem płynie i się rozlewa (tu przyspieszone): gdy ma czas, jest cieczą.' },
      },
      panel: {
        kid: [
          'Ta niebieska masa też jest z silikonu. Odkrył ją przypadkiem w 1943 roku James Wright, inżynier, który próbował zrobić nowy rodzaj gumy. Na gumę się nie nadawała, ale była świetną zabawą i stała się słynną zabawką.',
          'Czy to ciało stałe, czy ciecz? Jedno i drugie! Kiedy wszystko dzieje się szybko, zachowuje się jak ciało stałe: odbija się i pęka, gdy mocno szarpniesz. Kiedy ma czas, zachowuje się jak ciecz: rozciąga się, gdy ciągniesz powoli, a zostawiona powoli rozpływa się w kałużę. Wypróbuj wszystkie cztery: dotknij masy, naciśnij zielony i czerwony przycisk i dotknij minutnika.',
        ],
        sci: [
          'Skacząca masa to olej silikonowy (polidimetylosiloksan) ogrzany z kwasem borowym. Przypisuje się ją Jamesowi Wrightowi z General Electric (1943), w czasie poszukiwań syntetycznej gumy podczas II wojny światowej (Earl Warrick z Dow Corning zrobił podobną masę mniej więcej w tym samym czasie); jako zabawka, Silly Putty, jest sprzedawana od 1950 roku.',
          'Bor łączy łańcuchy wiązaniami B-O-Si i słabszymi przyciąganiami bor-tlen, które ciągle pękają i tworzą się na nowo. Odkształcana szybciej, niż wiązania zdążą się przegrupować, sieć zachowuje się jak sprężyste ciało stałe: odbija się i pęka, zostawiając czyste powierzchnie. Odkształcana wolniej, wiązania puszczają i masa płynie. To ciecz lepkosprężysta: to, czy płynie, zależy od tego, jak długo patrzysz, co reolodzy mierzą liczbą Debory.',
        ],
      },
    },
    chain: {
      label: 'Silikonowy łańcuch',
      hint: 'Przesuń temperaturę',
      temp: 'Temperatura',
      title: 'Łańcuch, który się wije',
      says: {
        freeze: { kid: 'Brrr! Poniżej około −125 °C łańcuch sztywnieje: nie może się wcale ruszać.', sci: 'Poniżej temperatury zeszklenia, około −125 °C, segmenty szkieletu zastygają tam, gdzie są.' },
        heat: { kid: 'Goręcej niż w piekarniku, a łańcuch wije się jak szalony, ale się nie rozpada!', sci: 'Gorąco: segmenty ruszają się szybko, ale mocne wiązania Si-O wytrzymują; guma silikonowa pracuje tysiące godzin w 200 °C.' },
        room: { kid: 'Z powrotem w temperaturze pokojowej: łańcuch wije się spokojnie. Dlatego silikon jest miękki i giętki.', sci: 'W 20 °C polidimetylosiloksan jest około 145 °C powyżej swojej temperatury zeszklenia: to bardzo ruchliwy łańcuch.' },
      },
      panel: {
        kid: [
          'Tak wygląda silikon z bliska, jak w lupie na obrazku: długi łańcuch z krzemu (beżowy) i tlenu (czerwony), krzem, tlen, i tak w kółko. Każdy krzem trzyma jeszcze dwie małe grupki z węgla (ciemnoszary) i wodoru (biały), sterczące na boki.',
          'Przesuń temperaturę. Ciepłe łańcuchy wiją się i przesuwają po sobie: dlatego silikon jest miękki i giętki. Dopiero w około −125 °C, dużo zimniej niż w jakiejkolwiek zamrażarce, sztywnieją. A nawet w 250 °C, goręcej niż w piekarniku, łańcuch się nie rozpada.',
        ],
        sci: [
          'Polidimetylosiloksan, -[Si(CH3)2-O]n-, najpowszechniejszy silikon. Wiązania Si-O są długie (około 164 pm, wobec 154 pm dla C-C), kąt Si-O-Si jest szeroki (około 143°) i łatwo się zmienia, a obrót wokół wiązania Si-O prawie nic nie kosztuje. Dlatego łańcuch jest bardzo giętki: PDMS ma jedną z najniższych temperatur zeszklenia wśród polimerów, około −125 °C. (Długie łańcuchy chłodzone powoli mogą też krystalizować; kryształy topią się w pobliżu −40 °C.)',
          'Wiązanie Si-O jest też mocne, około 450 kJ/mol wobec około 350 dla C-C, więc silikony zachowują swoje właściwości do znacznie powyżej 200 °C. Frederic Kipping nazwał je w 1901 roku przez analogię do ketonów (R2C=O), spodziewając się R2Si=O; ale krzem nie tworzy z tlenem trwałego wiązania podwójnego, a jednostki R2SiO łączą się zamiast tego w łańcuchy i pierścienie Si-O-Si.',
        ],
      },
    },
  },
  de: {
    title: 'Die Silikonküche',
    greet: {
      kid: 'Willkommen in der Küche aus dem Bild! Ich bin das Silicium, und alle verwechseln mich ständig mit Silikon. Finden wir heraus, was was ist. Die Geschichte dieses Bildes steht auf der Staffelei neben dir.',
      sci: 'Silicium, das Element, und die Silikone, die daraus gemacht werden: In dieser Küche geht es um den Unterschied. Drei Dinge zum Ausprobieren, und die Geschichte des Bildes auf der Staffelei.',
    },
    talk: {
      kid: [
        'Silicium bin ich: hart, glänzend und grau, wie ein Metall, das zerbricht wie Glas. Silikon wird aus mir gemacht, und es ist weich und biegsam.',
        'Im Silikon fassen meine Atome Sauerstoffatome an den Händen, immer wieder, in einer langen, langen Kette.',
        'Badekappen, die Fuge um die Badewanne, weiche Handyhüllen und die blaue Knete dort: alles Silikon.',
      ],
      sci: [
        'Silikone werden aus Silicium selbst gemacht: In der Müller-Rochow-Synthese ergeben Silicium und Chlormethan über Kupfer bei etwa 300 °C Dimethyldichlorsilan, (CH3)2SiCl2.',
        'Wasser hydrolysiert (CH3)2SiCl2 zum Silandiol (CH3)2Si(OH)2, das unter Wasserabspaltung zu Si-O-Si-Ketten und -Ringen kondensiert.',
        'Die Methylgruppen zeigen nach außen, deshalb haben Silikonoberflächen eine niedrige Oberflächenenergie, etwa 20 mN/m: Wasser perlt ab, und Teig löst sich leicht.',
      ],
    },
    tray: {
      label: 'Silicium oder Silikon?',
      verbs: { bend: 'Biege die Form', snap: 'Biege das Silicium', oven: 'In den heißen Ofen', freeze: 'Ins Gefrierfach' },
      signs: { silicone: 'Silikon', silicon: 'Silicium' },
      hints: { bend: 'Tipp die Form an, um sie zu biegen', snap: 'Tipp das Silicium an, um es zu biegen', oven: 'Tipp den Ofen an', freeze: 'Tipp das Gefrierfach an' },
      title: 'Silicium oder Silikon?',
      says: {
        bend: { kid: 'Boing! Sie biegt und verdreht sich, die Muffins hüpfen heraus, und sie federt sofort zurück.', sci: 'Gummielastizität: Die vernetzten Ketten entknäueln sich unter der Last und knäueln sich wieder, wenn man loslässt.' },
        snap: { kid: 'Knack! Silicium kann sich nicht biegen: Es zerbricht wie Glas. Hier ist ein neues Stück.', sci: 'Sprödbruch: Bei Raumtemperatur spaltet kristallines Silicium, statt sich zu biegen.' },
        oven: { kid: 'In den heißen Ofen, 220 °C, und wieder heraus: immer noch weich und biegsam!', sci: '220 °C liegen in ihrem Bereich: Silikonbackformen sind meist bis etwa 230 °C oder mehr zugelassen.' },
        freeze: { kid: 'Ins Gefrierfach, −18 °C, und wieder heraus: immer noch biegsam, nichts ist gebrochen!', sci: '−18 °C liegen weit über dem Glasübergang der Ketten (etwa −125 °C): Sie bewegen sich noch.' },
      },
      panel: {
        kid: [
          'Silicium und Silikon klingen fast gleich, sind aber ganz verschiedene Dinge. Silicium ist ein Element: hart, glänzend und grau. Wenn du versuchst, es zu biegen, zerbricht es wie Glas. Computerchips werden daraus gemacht.',
          'Silikon wird aus Silicium gemacht. Im Silikon sind Silicium- und Sauerstoffatome zu langen Ketten verbunden, die sich schlängeln und entknäueln können, deshalb biegt und verdreht sich eine Silikonform und federt zurück. Sie schmilzt nicht im heißen Ofen und bricht nicht im Gefrierfach, und Muffins kleben nicht daran fest.',
        ],
        sci: [
          'Silicium ist ein kristallines Element mit Diamantstruktur: Jedes Atom hält vier Nachbarn mit starken, gerichteten kovalenten Bindungen. Bei Raumtemperatur kann im Kristall nichts abgleiten, deshalb biegt es sich nicht, sondern bricht spröde, am leichtesten entlang seiner (111)-Kristallebenen.',
          'Eine Silikonform ist vernetzter Polydimethylsiloxan-Kautschuk, meist mit feiner Kieselsäure verstärkt. Zwischen den Vernetzungspunkten entknäueln sich die Ketten beim Dehnen und knäueln sich beim Loslassen wieder (Gummielastizität), von weit unter null bis über 200 °C; Backformen sind meist für etwa −40 °C bis 230 °C oder mehr angegeben. Ihre Methylgruppen zeigen nach außen und geben eine energiearme, antihaftende Oberfläche.',
        ],
      },
    },
    putty: {
      label: 'Die Hüpfknete',
      verbs: { throw: 'Wirf sie', slow: 'Zieh sie langsam', fast: 'Zieh sie schnell', leave: 'Lass sie liegen' },
      hints: { throw: 'Tipp die Knete an, um sie zu werfen', slow: 'Drück den grünen Knopf', fast: 'Drück den roten Knopf', leave: 'Tipp den Küchenwecker an und warte' },
      signs: { slow: 'langsam ziehen', fast: 'schnell ziehen' },
      title: 'Fest oder flüssig?',
      says: {
        throw: { kid: 'Boing, boing, boing! Sie springt wie ein Gummiball.', sci: 'Ein plötzlicher Stoß: Die Vernetzungen haben keine Zeit, sich zu lösen, deshalb antwortet die Knete wie ein elastischer Festkörper.' },
        slow: { kid: 'Sanft gezogen, dehnt sie sich und dehnt sich, wie Kaugummi.', sci: 'Langsames Ziehen: Die Vernetzungen lösen sich und bilden sich unterwegs neu, deshalb fließt die Knete.' },
        fast: { kid: 'Ratsch! Schnell gezogen, reißt sie in zwei Teile, mit glatten, flachen Enden.', sci: 'Schnelles Ziehen: keine Zeit zum Fließen, deshalb bricht sie wie ein spröder Festkörper, mit flachen Bruchflächen.' },
        leave: { kid: 'Jetzt warten wir... langsam, langsam zerfließt sie zu einer Pfütze. Hier geht es schneller: In Wirklichkeit dauert es viel länger.', sci: 'Unter ihrem eigenen Gewicht kriecht sie und breitet sich aus (hier beschleunigt): Mit genug Zeit ist sie eine Flüssigkeit.' },
      },
      panel: {
        kid: [
          'Diese blaue Knete ist auch aus Silikon. Sie wurde 1943 durch Zufall von James Wright entdeckt, einem Ingenieur, der eine neue Art Gummi herstellen wollte. Als Gummi taugte sie nichts, aber sie machte großen Spaß und wurde ein berühmtes Spielzeug.',
          'Ist sie fest oder flüssig? Beides! Wenn es schnell geht, verhält sie sich wie ein Festkörper: Sie springt, und sie reißt, wenn du kräftig ziehst. Mit Zeit verhält sie sich wie eine Flüssigkeit: Sie dehnt sich, wenn du langsam ziehst, und wenn du sie liegen lässt, zerfließt sie langsam zu einer Pfütze. Probier alle vier aus: Tipp die Knete an, drück den grünen und den roten Knopf und tipp den Küchenwecker an.',
        ],
        sci: [
          'Hüpfknete ist Silikonöl (Polydimethylsiloxan), mit Borsäure erhitzt. Sie wird James Wright von General Electric zugeschrieben (1943), bei der Suche nach synthetischem Gummi im Zweiten Weltkrieg (Earl Warrick von Dow Corning machte etwa zur selben Zeit eine ähnliche Knete); als Spielzeug, Silly Putty, wird sie seit 1950 verkauft.',
          'Bor verbindet die Ketten über B-O-Si-Bindungen und schwächere Bor-Sauerstoff-Anziehungen, die ständig brechen und sich neu bilden. Schneller verformt, als sich die Verbindungen umordnen können, verhält sich das Netzwerk wie ein elastischer Festkörper: Es springt und bricht mit sauberen Flächen. Langsamer verformt, lösen sich die Verbindungen, und es fließt. Es ist eine viskoelastische Flüssigkeit: Ob sie fließt, hängt davon ab, wie lange man zusieht; Rheologen messen das mit der Deborah-Zahl.',
        ],
      },
    },
    chain: {
      label: 'Die Silikonkette',
      hint: 'Verschieb die Temperatur',
      temp: 'Temperatur',
      title: 'Eine Kette, die zappelt',
      says: {
        freeze: { kid: 'Brrr! Unter etwa −125 °C friert die Kette steif ein: Sie kann sich gar nicht mehr bewegen.', sci: 'Unterhalb des Glasübergangs, etwa −125 °C, erstarren die Abschnitte des Rückgrats, wo sie gerade sind.' },
        heat: { kid: 'Heißer als ein Ofen, und die Kette zappelt wie wild, aber sie fällt nicht auseinander!', sci: 'Heiß: Die Abschnitte bewegen sich schnell, aber die starken Si-O-Bindungen halten; Silikonkautschuk arbeitet Tausende Stunden bei 200 °C.' },
        room: { kid: 'Zurück auf Raumtemperatur: Die Kette zappelt sanft. Deshalb ist Silikon weich und biegsam.', sci: 'Bei 20 °C liegt Polydimethylsiloxan etwa 145 °C über seinem Glasübergang: eine sehr bewegliche Kette.' },
      },
      panel: {
        kid: [
          'So sieht Silikon von ganz nah aus, wie in der Lupe auf dem Bild: eine lange Kette aus Silicium (beige) und Sauerstoff (rot), Silicium, Sauerstoff, immer wieder. Jedes Silicium hält außerdem zwei kleine Gruppen aus Kohlenstoff (dunkelgrau) und Wasserstoff (weiß), die zur Seite abstehen.',
          'Verschieb die Temperatur. Warme Ketten zappeln und gleiten aneinander vorbei: Das macht Silikon weich und biegsam. Erst bei etwa −125 °C, viel kälter als jedes Gefrierfach, frieren sie steif ein. Und selbst bei 250 °C, heißer als ein Ofen, hält die Kette zusammen.',
        ],
        sci: [
          'Polydimethylsiloxan, -[Si(CH3)2-O]n-, das häufigste Silikon. Seine Si-O-Bindungen sind lang (etwa 164 pm, gegenüber 154 pm bei C-C), sein Si-O-Si-Winkel ist weit (etwa 143°) und leicht zu biegen, und eine Drehung um eine Si-O-Bindung kostet fast keine Energie. Deshalb ist die Kette sehr beweglich: PDMS hat einen der niedrigsten Glasübergänge aller Polymere, etwa −125 °C. (Lange Ketten können beim langsamen Abkühlen auch kristallisieren; die Kristalle schmelzen bei etwa −40 °C.)',
          'Die Si-O-Bindung ist außerdem stark, etwa 450 kJ/mol gegenüber etwa 350 bei C-C, deshalb behalten Silikone ihre Eigenschaften bis weit über 200 °C. Frederic Kipping benannte sie 1901 nach den Ketonen (R2C=O) und erwartete R2Si=O; aber Silicium bildet mit Sauerstoff keine stabile Doppelbindung, und R2SiO-Einheiten verbinden sich stattdessen zu Si-O-Si-Ketten und -Ringen.',
        ],
      },
    },
  },
}
