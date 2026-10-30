// The words of sodium's space room ("Sodium 90 km above your head"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Na.js (the easel shows it). `sign`, `screen` and `tails` are drawn in 3D (one depth: no
// subscripts, no superscripts, no emoji). Facts and their sources: the header of space.js.
export const SPACE_WORDS = {
  en: {
    title: 'The observatory on the mountain',
    greet: {
      kid: 'We are on top of a mountain in a desert, high above the clouds! The air up here is so dry and still that the stars shine sharp. Let’s make a star of our own: tap the laser on the big telescope. The picture’s story is on the easel.',
      sci: 'A summit like Cerro Paranal, 2635 m up in Chile’s Atacama Desert: dry, dark, steady air above a sea of clouds. Here: a 589 nm laser guide star, adaptive optics, and the meteors that feed the sodium layer 90 km up. The picture’s story is on the easel.',
    },
    talk: {
      kid: [
        'See the red lamps? Astronomers use red light at night, because it spoils your eyes for the dark much less than white light.',
        'Most shooting stars are made by bits of space dust no bigger than a grain of sand, rushing in so fast that they burn up.',
        'That white sea below us is clouds over the Pacific Ocean. The mountain sticks up above them, so the sky up here is nearly always clear.',
      ],
      sci: [
        'Squeezed to the air pressure at the ground, all the sodium above you would make a film thinner than one atom: the whole layer holds only about 4 billion atoms over each square centimetre.',
        'Red lamps keep eyes adapted to the dark: the rods, the cells that see in dim light, hardly respond to deep red, so a red lamp barely bleaches them.',
        'Meteors leave other metals up there too: iron, magnesium, potassium, calcium. Sodium is used for guide stars because its 589 nm line scatters light back so strongly.',
      ],
    },
    laser: {
      label: 'The laser guide star',
      tap: 'Tap the laser launcher',
      tapOff: 'Tap the launcher to switch it off',
      on: 'Laser on',
      off: 'Laser off',
      title: 'A star made with a laser',
      sign: { layer: 'sodium layer', band: '80 to 105 km', planes: 'planes' },
      says: {
        on: {
          kid: 'Whoosh! The laser shines up 90 km and makes the sodium atoms there glow. Look up: a brand-new star!',
          sci: 'The 589 nm beam excites sodium atoms 80 to 105 km up; their fluorescence is the guide star. You see the beam itself because the air below scatters a little of its light.',
        },
        off: {
          kid: 'Laser off: the pretend star is gone at once.',
          sci: 'Beam off: an excited sodium atom re-emits within about 16 nanoseconds, so the guide star vanishes at once.',
        },
      },
      panel: {
        kid: [
          'This yellow-orange laser has exactly the colour of sodium’s own light. About 90 km up it reaches a thin layer of sodium atoms and makes them glow, so a pretend star appears where there was none.',
          'The scale beside the beam shows how high that is: the layer is between about 80 and 105 km up, thickest near 90 km. Planes fly at about 10 km, far below it. Tap the launcher on the telescope to switch the laser on or off.',
        ],
        sci: [
          'The laser is tuned to sodium’s D2 line at 589 nm. Sodium atoms in the mesosphere absorb it and re-emit the same light in every direction (resonance fluorescence): a small glowing spot 80 to 105 km up, the laser guide star. Seen from the side it is a short streak as long as the layer is thick; from the telescope, looking up along the beam, it is a point.',
          'The layer peaks near 90 km with only a few thousand atoms per cubic centimetre, enough for a star the telescope can use. At the Very Large Telescope on Cerro Paranal four lasers of 22 W each make four guide stars at once. Renaud Foy and Antoine Labeyrie proposed laser guide stars in 1985.',
        ],
      },
    },
    ao: {
      label: 'Taking the twinkle out',
      tap: 'Tap the deformable mirror',
      laserFirst: 'Switch on the laser first',
      slide: 'Change the air',
      on: 'Adaptive optics on',
      off: 'Adaptive optics off',
      slider: 'Turbulence in the air',
      calm: 'calm',
      wavy: 'wavy',
      rough: 'rough',
      title: 'Taking the twinkle out',
      screen: { title: 'The telescope’s camera', off: 'adaptive optics off', wait: 'no guide star', on: 'adaptive optics on', mirror: 'deformable mirror' },
      says: {
        on: {
          kid: 'Watch the mirror wiggle! It bends to undo the air’s wobbles, and the blurry star on the screen becomes a sharp dot.',
          sci: 'Loop closed: the wavefront sensor measures the guide star’s distortion and the deformable mirror takes the opposite shape, hundreds of times a second.',
        },
        wait: {
          kid: 'The mirror is ready, but it needs a star to watch the air by. Switch on the laser on the telescope!',
          sci: 'No reference: without a guide star the wavefront sensor has nothing to measure. Switch on the laser.',
        },
        off: {
          kid: 'Mirror off: the star wobbles and twinkles again.',
          sci: 'Loop open: the image is limited by the seeing again.',
        },
      },
      panel: {
        kid: [
          'Stars twinkle because the air above us is never still: warm and cold air mix and bend the starlight this way and that. Through a big telescope that turns a star into a blurry, wobbling blob.',
          'This mirror is thin and bendy, with lots of little pushers behind it. A camera watches the laser star, sees how the air bends its light, and the pushers reshape the mirror hundreds of times a second to make it straight again. Tap the mirror, and slide the turbulence to make the air calmer or rougher.',
        ],
        sci: [
          'Turbulent cells of air at slightly different temperatures, and so with different refractive indices, corrugate the incoming wavefront: even at a good site a star is smeared to about an arcsecond (the seeing), however big the telescope.',
          'Adaptive optics, proposed by Horace Babcock in 1953, measures the wavefront on a guide star and gives a deformable mirror the opposite shape, hundreds to about a thousand times a second. Yepun, the fourth of the VLT’s telescopes, has a deformable secondary mirror 1.12 m across and about 2 mm thick, shaped by 1170 actuators. An 8 m telescope can then come close to its diffraction limit, about 0.06 arcseconds at 2.2 µm.',
          'A laser star cannot show the image’s tilt (its light goes up and comes back down through the same air), so a faint natural star nearby is still needed for that.',
        ],
      },
    },
    sky: {
      label: 'Where the sodium comes from',
      tapSky: 'Tap the sky',
      tapComet: 'Tap the comet',
      shower: 'Meteor shower',
      showTails: 'Name the comet’s tails',
      hideTails: 'Hide the names',
      title: 'Sodium from space',
      tails: { dust: 'dust tail', ion: 'ion tail', sodium: 'sodium tail', name: 'Hale-Bopp, April 1997' },
      says: {
        meteor: {
          kid: 'A shooting star! It burnt up about 90 km high and left a puff of sodium in the layer.',
          sci: 'A meteoroid ablating near 90 km: its sodium is set free as atoms and joins the layer.',
        },
        shower: {
          kid: 'A meteor shower! See how they all seem to fly out of one spot in the sky?',
          sci: 'A shower: the meteoroids of one stream travel in parallel, so in perspective they seem to come from one point, the radiant.',
        },
        comet: {
          kid: 'Comet Hale-Bopp, in April 1997: a white tail of dust, a blue tail of gas, and a thin yellow one made of sodium!',
          sci: 'Hale-Bopp in April 1997: the curved dust tail, the straight ion tail, and the narrow neutral sodium tail found that month.',
        },
        hide: {
          kid: 'The names are hidden. Tap the comet again to see them.',
          sci: 'Labels off; tap the comet to show them again.',
        },
      },
      panel: {
        kid: [
          'Every day tens of tonnes of space dust fall into our air (scientists’ estimates vary). The bits rush in so fast that they burn up about 90 km high: shooting stars! The sodium in them stays up there and makes the sodium layer. Tap anywhere in the sky to send one.',
          'In 1997 comet Hale-Bopp grew three tails: a white one of dust, a blue one of gas, and a thin, straight one of sodium atoms, pushed away by the sunlight they shine back. Tap the comet to see which is which.',
          'The first person to see sodium’s glow in the night sky was the American astronomer Vesto Slipher, in 1929.',
        ],
        sci: [
          'Meteoroids enter the atmosphere at 11 to 72 km/s and ablate between about 70 and 120 km, releasing their metals as atoms. Estimates of the dust input vary widely; many recent ones are tens of tonnes a day. Sodium, a small fraction of it, builds the layer that peaks near 90 km.',
          'Vesto Slipher found the sodium D lines in the spectrum of the night sky’s glow in 1929. That glow comes from sodium atoms excited by reactions with ozone and atomic oxygen; the laser excites them directly.',
          'Comet Hale-Bopp: images taken from La Palma between 16 and 22 April 1997 showed a narrow, nearly straight tail of neutral sodium atoms more than 6 degrees long, beside the curved dust tail and the blue ion tail. Sodium scatters sunlight in its D lines so strongly that the light’s pressure pushes the atoms away from the Sun.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'O observatório na montanha',
    greet: {
      kid: 'Estamos no alto de uma montanha num deserto, muito acima das nuvens! O ar aqui é tão seco e calmo que as estrelas brilham nítidas. Vamos fazer uma estrela só nossa: toca no laser do grande telescópio. A história desta imagem está no cavalete.',
      sci: 'Um cume como o Cerro Paranal, a 2635 m no deserto do Atacama, no Chile: ar seco, escuro e estável por cima de um mar de nuvens. Aqui: uma estrela-guia laser de 589 nm, ótica adaptativa e os meteoros que alimentam a camada de sódio a 90 km de altitude. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Vês as luzes vermelhas? Os astrónomos usam luz vermelha à noite, porque estraga muito menos do que a luz branca os olhos habituados ao escuro.',
        'A maioria das estrelas cadentes é feita por bocadinhos de poeira do espaço, não maiores do que um grão de areia, que entram a tal velocidade que ardem.',
        'Aquele mar branco lá em baixo são nuvens sobre o oceano Pacífico. A montanha fica acima delas, por isso o céu aqui em cima está quase sempre limpo.',
      ],
      sci: [
        'Comprimido à pressão do ar ao nível do chão, todo o sódio por cima de ti formaria uma película mais fina do que um átomo: a camada inteira tem só cerca de 4 mil milhões de átomos sobre cada centímetro quadrado.',
        'As luzes vermelhas mantêm os olhos adaptados ao escuro: os bastonetes, as células que veem com pouca luz, quase não respondem ao vermelho escuro, por isso uma luz vermelha mal os ofusca.',
        'Os meteoros deixam lá em cima outros metais também: ferro, magnésio, potássio, cálcio. O sódio é o usado nas estrelas-guia porque a sua risca de 589 nm devolve a luz com muita força.',
      ],
    },
    laser: {
      label: 'A estrela-guia laser',
      tap: 'Toca no lançador do laser',
      tapOff: 'Toca no lançador para o desligar',
      on: 'Ligar o laser',
      off: 'Desligar o laser',
      title: 'Uma estrela feita com um laser',
      sign: { layer: 'camada de sódio', band: '80 a 105 km', planes: 'aviões' },
      says: {
        on: {
          kid: 'Zás! O laser sobe 90 km e põe a brilhar os átomos de sódio que lá estão. Olha para cima: uma estrela novinha!',
          sci: 'O feixe de 589 nm excita os átomos de sódio entre 80 e 105 km de altitude; a sua fluorescência é a estrela-guia. Vês o próprio feixe porque o ar cá em baixo dispersa um pouco da sua luz.',
        },
        off: {
          kid: 'Laser desligado: a estrela a fingir desaparece logo.',
          sci: 'Feixe desligado: um átomo de sódio excitado reemite em cerca de 16 nanossegundos, por isso a estrela-guia desaparece de imediato.',
        },
      },
      panel: {
        kid: [
          'Este laser amarelo-alaranjado tem exatamente a cor da luz do próprio sódio. A cerca de 90 km de altitude chega a uma camada fina de átomos de sódio e põe-nos a brilhar: aparece uma estrela a fingir onde antes não havia nenhuma.',
          'A escala ao lado do feixe mostra a que altura isso fica: a camada está entre cerca de 80 e 105 km, mais grossa perto dos 90 km. Os aviões voam a cerca de 10 km, muito abaixo dela. Toca no lançador do telescópio para ligar ou desligar o laser.',
        ],
        sci: [
          'O laser está sintonizado na risca D2 do sódio, a 589 nm. Os átomos de sódio da mesosfera absorvem-no e reemitem a mesma luz em todas as direções (fluorescência de ressonância): uma pequena mancha luminosa entre 80 e 105 km de altitude, a estrela-guia laser. Vista de lado é um risco curto, tão comprido quanto a camada é espessa; vista do telescópio, ao longo do feixe, é um ponto.',
          'A camada tem o máximo perto dos 90 km, com apenas alguns milhares de átomos por centímetro cúbico, o suficiente para uma estrela que o telescópio consegue usar. No Very Large Telescope, no Cerro Paranal, quatro lasers de 22 W cada fazem quatro estrelas-guia ao mesmo tempo. Renaud Foy e Antoine Labeyrie propuseram as estrelas-guia laser em 1985.',
        ],
      },
    },
    ao: {
      label: 'Tirar a cintilação',
      tap: 'Toca no espelho deformável',
      laserFirst: 'Primeiro liga o laser',
      slide: 'Muda o ar',
      on: 'Ligar a ótica adaptativa',
      off: 'Desligar a ótica adaptativa',
      slider: 'Turbulência no ar',
      calm: 'calmo',
      wavy: 'ondulado',
      rough: 'agitado',
      title: 'Tirar a cintilação',
      screen: { title: 'A câmara do telescópio', off: 'ótica adaptativa desligada', wait: 'sem estrela-guia', on: 'ótica adaptativa ligada', mirror: 'espelho deformável' },
      says: {
        on: {
          kid: 'Olha o espelho a mexer-se! Dobra-se para desfazer os tremores do ar, e a estrela borrada no ecrã fica um ponto nítido.',
          sci: 'Circuito fechado: o sensor de frente de onda mede a distorção da estrela-guia e o espelho deformável toma a forma oposta, centenas de vezes por segundo.',
        },
        wait: {
          kid: 'O espelho está pronto, mas precisa de uma estrela para ver como o ar está. Liga o laser do telescópio!',
          sci: 'Sem referência: sem estrela-guia, o sensor de frente de onda não tem nada para medir. Liga o laser.',
        },
        off: {
          kid: 'Espelho desligado: a estrela volta a tremer e a cintilar.',
          sci: 'Circuito aberto: a imagem volta a ficar limitada pelo seeing.',
        },
      },
      panel: {
        kid: [
          'As estrelas cintilam porque o ar por cima de nós nunca está quieto: o ar quente e o frio misturam-se e desviam a luz das estrelas para um lado e para o outro. Num grande telescópio, isso transforma uma estrela numa mancha borrada que treme.',
          'Este espelho é fino e flexível, com muitos pequenos empurradores por trás. Uma câmara observa a estrela do laser, vê como o ar lhe desvia a luz, e os empurradores mudam a forma do espelho centenas de vezes por segundo para a endireitar. Toca no espelho e mexe na turbulência para deixar o ar mais calmo ou mais agitado.',
        ],
        sci: [
          'Células de ar turbulento a temperaturas ligeiramente diferentes, e por isso com índices de refração diferentes, ondulam a frente de onda que chega: mesmo num bom local, uma estrela fica espalhada por cerca de um segundo de arco (o seeing), seja qual for o tamanho do telescópio.',
          'A ótica adaptativa, proposta por Horace Babcock em 1953, mede a frente de onda numa estrela-guia e dá a um espelho deformável a forma oposta, centenas a cerca de mil vezes por segundo. O Yepun, o quarto telescópio do VLT, tem um espelho secundário deformável com 1,12 m de diâmetro e cerca de 2 mm de espessura, moldado por 1170 atuadores. Um telescópio de 8 m pode então aproximar-se do seu limite de difração, cerca de 0,06 segundos de arco a 2,2 µm.',
          'Uma estrela laser não consegue mostrar a inclinação da imagem (a sua luz sobe e desce pelo mesmo ar), por isso continua a ser precisa uma estrela natural ténue ali perto para isso.',
        ],
      },
    },
    sky: {
      label: 'De onde vem o sódio',
      tapSky: 'Toca no céu',
      tapComet: 'Toca no cometa',
      shower: 'Chuva de meteoros',
      showTails: 'Dar nome às caudas do cometa',
      hideTails: 'Esconder os nomes',
      title: 'Sódio vindo do espaço',
      tails: { dust: 'cauda de poeira', ion: 'cauda de iões', sodium: 'cauda de sódio', name: 'Hale-Bopp, abril de 1997' },
      says: {
        meteor: {
          kid: 'Uma estrela cadente! Ardeu a cerca de 90 km de altitude e deixou uma nuvenzinha de sódio na camada.',
          sci: 'Um meteoroide em ablação perto dos 90 km: o seu sódio fica livre em átomos e junta-se à camada.',
        },
        shower: {
          kid: 'Uma chuva de meteoros! Vês como parecem todos sair do mesmo sítio do céu?',
          sci: 'Uma chuva: os meteoroides de um mesmo enxame viajam em paralelo, por isso, em perspetiva, parecem vir de um só ponto, o radiante.',
        },
        comet: {
          kid: 'O cometa Hale-Bopp, em abril de 1997: uma cauda branca de poeira, uma azul de gás e uma fininha amarela, feita de sódio!',
          sci: 'O Hale-Bopp em abril de 1997: a cauda curva de poeira, a cauda reta de iões e a estreita cauda de sódio neutro, descoberta nesse mês.',
        },
        hide: {
          kid: 'Os nomes estão escondidos. Toca outra vez no cometa para os veres.',
          sci: 'Legendas desligadas; toca no cometa para as mostrar outra vez.',
        },
      },
      panel: {
        kid: [
          'Todos os dias caem no nosso ar dezenas de toneladas de poeira do espaço (as contas dos cientistas variam). Os bocadinhos entram tão depressa que ardem a cerca de 90 km de altitude: são as estrelas cadentes! O sódio que trazem fica lá em cima e forma a camada de sódio. Toca em qualquer sítio do céu para mandares uma.',
          'Em 1997 o cometa Hale-Bopp ganhou três caudas: uma branca de poeira, uma azul de gás e uma fina e reta de átomos de sódio, empurrada pela luz do Sol que esses átomos devolvem. Toca no cometa para veres qual é qual.',
          'A primeira pessoa a ver o brilho do sódio no céu noturno foi o astrónomo americano Vesto Slipher, em 1929.',
        ],
        sci: [
          'Os meteoroides entram na atmosfera a 11 a 72 km/s e sofrem ablação entre cerca de 70 e 120 km, libertando os seus metais em átomos. As estimativas da poeira que chega variam muito; muitas das recentes andam pelas dezenas de toneladas por dia. O sódio, uma pequena parte dela, forma a camada que tem o máximo perto dos 90 km.',
          'Vesto Slipher encontrou as riscas D do sódio no espectro do brilho do céu noturno em 1929. Esse brilho vem de átomos de sódio excitados por reações com o ozono e o oxigénio atómico; o laser excita-os diretamente.',
          'O cometa Hale-Bopp: imagens tiradas em La Palma entre 16 e 22 de abril de 1997 mostraram uma cauda estreita e quase reta de átomos neutros de sódio, com mais de 6 graus de comprimento, ao lado da cauda curva de poeira e da cauda azul de iões. O sódio dispersa a luz do Sol nas suas riscas D com tanta força que a pressão da luz afasta os átomos do Sol.',
        ],
      },
    },
  },
  pl: {
    title: 'Obserwatorium na górze',
    greet: {
      kid: 'Jesteśmy na szczycie góry na pustyni, wysoko nad chmurami! Powietrze jest tu tak suche i spokojne, że gwiazdy świecą ostro. Zróbmy własną gwiazdę: dotknij lasera na wielkim teleskopie. Historia tego obrazka jest na sztaludze.',
      sci: 'Szczyt jak Cerro Paranal, 2635 m n.p.m. na pustyni Atakama w Chile: suche, ciemne, spokojne powietrze nad morzem chmur. Tutaj: laserowa gwiazda prowadząca 589 nm, optyka adaptatywna i meteory, które zasilają warstwę sodu 90 km nad ziemią. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Widzisz czerwone lampki? Astronomowie używają w nocy czerwonego światła, bo psuje oczy przyzwyczajone do ciemności dużo mniej niż białe.',
        'Większość spadających gwiazd to okruchy kosmicznego pyłu nie większe od ziarnka piasku, które wpadają tak szybko, że spalają się.',
        'To białe morze pod nami to chmury nad Oceanem Spokojnym. Góra wystaje ponad nie, więc niebo tutaj jest prawie zawsze czyste.',
      ],
      sci: [
        'Ściśnięty do ciśnienia powietrza przy ziemi, cały sód nad tobą utworzyłby warstewkę cieńszą niż jeden atom: cała warstwa ma tylko około 4 miliardów atomów nad każdym centymetrem kwadratowym.',
        'Czerwone lampy pozwalają oczom zostać przystosowanym do ciemności: pręciki, komórki widzące przy słabym świetle, prawie nie reagują na głęboką czerwień, więc czerwona lampa ledwie je oślepia.',
        'Meteory zostawiają tam w górze także inne metale: żelazo, magnez, potas, wapń. Do gwiazd prowadzących używa się sodu, bo jego linia 589 nm bardzo silnie odsyła światło z powrotem.',
      ],
    },
    laser: {
      label: 'Laserowa gwiazda prowadząca',
      tap: 'Dotknij nadajnika lasera',
      tapOff: 'Dotknij nadajnika, żeby go wyłączyć',
      on: 'Włącz laser',
      off: 'Wyłącz laser',
      title: 'Gwiazda zrobiona laserem',
      sign: { layer: 'warstwa sodu', band: '80 do 105 km', planes: 'samoloty' },
      says: {
        on: {
          kid: 'Fiuu! Laser świeci 90 km w górę i rozjaśnia tam atomy sodu. Spójrz w górę: całkiem nowa gwiazda!',
          sci: 'Wiązka 589 nm wzbudza atomy sodu na wysokości od 80 do 105 km; ich fluorescencja to gwiazda prowadząca. Samą wiązkę widać, bo powietrze niżej rozprasza trochę jej światła.',
        },
        off: {
          kid: 'Laser wyłączony: udawana gwiazda od razu znika.',
          sci: 'Wiązka wyłączona: wzbudzony atom sodu wypromieniowuje światło w około 16 nanosekund, więc gwiazda prowadząca znika natychmiast.',
        },
      },
      panel: {
        kid: [
          'Ten żółto-pomarańczowy laser ma dokładnie kolor światła samego sodu. Około 90 km w górze dociera do cienkiej warstwy atomów sodu i sprawia, że świecą: pojawia się udawana gwiazda tam, gdzie żadnej nie było.',
          'Skala obok wiązki pokazuje, jak to wysoko: warstwa leży na wysokości od około 80 do 105 km, najgęstsza blisko 90 km. Samoloty latają na około 10 km, daleko pod nią. Dotknij nadajnika na teleskopie, żeby włączyć albo wyłączyć laser.',
        ],
        sci: [
          'Laser jest dostrojony do linii D2 sodu, 589 nm. Atomy sodu w mezosferze pochłaniają to światło i wysyłają je z powrotem we wszystkich kierunkach (fluorescencja rezonansowa): mała świecąca plamka na wysokości od 80 do 105 km, laserowa gwiazda prowadząca. Z boku to krótka kreska, tak długa, jak gruba jest warstwa; z teleskopu, patrząc wzdłuż wiązki, to punkt.',
          'Warstwa ma maksimum blisko 90 km i tylko kilka tysięcy atomów na centymetr sześcienny, a to wystarczy na gwiazdę, której teleskop może użyć. Na Very Large Telescope na Cerro Paranal cztery lasery po 22 W tworzą naraz cztery gwiazdy prowadzące. Renaud Foy i Antoine Labeyrie zaproponowali laserowe gwiazdy prowadzące w 1985 roku.',
        ],
      },
    },
    ao: {
      label: 'Jak usunąć migotanie',
      tap: 'Dotknij odkształcalnego lustra',
      laserFirst: 'Najpierw włącz laser',
      slide: 'Zmień powietrze',
      on: 'Włącz optykę adaptatywną',
      off: 'Wyłącz optykę adaptatywną',
      slider: 'Turbulencja powietrza',
      calm: 'spokojnie',
      wavy: 'falująco',
      rough: 'burzliwie',
      title: 'Jak usunąć migotanie',
      screen: { title: 'Kamera teleskopu', off: 'optyka adaptatywna wyłączona', wait: 'brak gwiazdy prowadzącej', on: 'optyka adaptatywna włączona', mirror: 'lustro odkształcalne' },
      says: {
        on: {
          kid: 'Patrz, jak lustro się wygina! Odkształca się tak, żeby cofnąć drgania powietrza, i rozmazana gwiazda na ekranie staje się ostrą kropką.',
          sci: 'Pętla zamknięta: czujnik czoła fali mierzy zniekształcenie gwiazdy prowadzącej, a lustro odkształcalne przyjmuje przeciwny kształt, setki razy na sekundę.',
        },
        wait: {
          kid: 'Lustro jest gotowe, ale potrzebuje gwiazdy, żeby widzieć, co robi powietrze. Włącz laser na teleskopie!',
          sci: 'Brak odniesienia: bez gwiazdy prowadzącej czujnik czoła fali nie ma czego mierzyć. Włącz laser.',
        },
        off: {
          kid: 'Lustro wyłączone: gwiazda znowu drga i migocze.',
          sci: 'Pętla otwarta: obraz znowu ogranicza seeing.',
        },
      },
      panel: {
        kid: [
          'Gwiazdy migoczą, bo powietrze nad nami nigdy nie stoi w miejscu: ciepłe i zimne powietrze mieszają się i odchylają światło gwiazd raz w tę, raz w tamtą stronę. W wielkim teleskopie gwiazda zamienia się przez to w rozmazaną, drgającą plamę.',
          'To lustro jest cienkie i giętkie, a za nim jest mnóstwo małych popychaczy. Kamera obserwuje gwiazdę z lasera, widzi, jak powietrze odchyla jej światło, a popychacze setki razy na sekundę zmieniają kształt lustra, żeby je wyprostować. Dotknij lustra i przesuń suwak turbulencji, żeby powietrze było spokojniejsze albo bardziej burzliwe.',
        ],
        sci: [
          'Turbulentne komórki powietrza o nieco innej temperaturze, a więc i innym współczynniku załamania, marszczą nadchodzące czoło fali: nawet w dobrym miejscu gwiazda rozmywa się do około sekundy łuku (seeing), bez względu na wielkość teleskopu.',
          'Optyka adaptatywna, zaproponowana przez Horace’a Babcocka w 1953 roku, mierzy czoło fali na gwieździe prowadzącej i nadaje lustru odkształcalnemu przeciwny kształt, od setek do około tysiąca razy na sekundę. Yepun, czwarty z teleskopów VLT, ma odkształcalne lustro wtórne o średnicy 1,12 m i grubości około 2 mm, kształtowane przez 1170 aktuatorów. Teleskop 8-metrowy może wtedy zbliżyć się do swojej granicy dyfrakcyjnej, około 0,06 sekundy łuku przy 2,2 µm.',
          'Gwiazda laserowa nie pokaże nachylenia obrazu (jej światło idzie w górę i wraca przez to samo powietrze), więc do tego wciąż potrzebna jest słaba naturalna gwiazda w pobliżu.',
        ],
      },
    },
    sky: {
      label: 'Skąd się bierze sód',
      tapSky: 'Dotknij nieba',
      tapComet: 'Dotknij komety',
      shower: 'Rój meteorów',
      showTails: 'Nazwij ogony komety',
      hideTails: 'Ukryj nazwy',
      title: 'Sód z kosmosu',
      tails: { dust: 'ogon pyłowy', ion: 'ogon jonowy', sodium: 'ogon sodowy', name: 'Hale-Bopp, kwiecień 1997' },
      says: {
        meteor: {
          kid: 'Spadająca gwiazda! Spaliła się około 90 km nad ziemią i zostawiła w warstwie obłoczek sodu.',
          sci: 'Meteoroid ulegający ablacji blisko 90 km: jego sód uwalnia się w postaci atomów i dołącza do warstwy.',
        },
        shower: {
          kid: 'Rój meteorów! Widzisz, że wszystkie zdają się wylatywać z jednego miejsca na niebie?',
          sci: 'Rój: meteoroidy z jednego strumienia lecą równolegle, więc w perspektywie zdają się wylatywać z jednego punktu, radiantu.',
        },
        comet: {
          kid: 'Kometa Hale-Bopp w kwietniu 1997 roku: biały ogon z pyłu, niebieski z gazu i cieniutki żółty, zrobiony z sodu!',
          sci: 'Hale-Bopp w kwietniu 1997 roku: zakrzywiony ogon pyłowy, prosty ogon jonowy i wąski ogon z obojętnego sodu, odkryty w tym miesiącu.',
        },
        hide: {
          kid: 'Nazwy są ukryte. Dotknij komety jeszcze raz, żeby je zobaczyć.',
          sci: 'Podpisy wyłączone; dotknij komety, żeby znów je pokazać.',
        },
      },
      panel: {
        kid: [
          'Każdego dnia do naszego powietrza wpadają dziesiątki ton kosmicznego pyłu (szacunki naukowców się różnią). Okruchy pędzą tak szybko, że spalają się około 90 km nad ziemią: to spadające gwiazdy! Sód, który niosą, zostaje tam w górze i tworzy warstwę sodu. Dotknij nieba w dowolnym miejscu, żeby wysłać jedną.',
          'W 1997 roku kometa Hale-Bopp miała trzy ogony: biały z pyłu, niebieski z gazu i cienki, prosty z atomów sodu, odpychany przez światło słoneczne, które te atomy odsyłają. Dotknij komety, żeby zobaczyć, który jest który.',
          'Pierwszą osobą, która zobaczyła poświatę sodu na nocnym niebie, był amerykański astronom Vesto Slipher, w 1929 roku.',
        ],
        sci: [
          'Meteoroidy wpadają w atmosferę z prędkością od 11 do 72 km/s i ulegają ablacji na wysokości od około 70 do 120 km, uwalniając swoje metale w postaci atomów. Szacunki dopływu pyłu bardzo się różnią; wiele nowszych mówi o dziesiątkach ton dziennie. Sód, niewielka jego część, tworzy warstwę z maksimum blisko 90 km.',
          'Vesto Slipher znalazł linie D sodu w widmie poświaty nocnego nieba w 1929 roku. Ta poświata pochodzi od atomów sodu wzbudzanych w reakcjach z ozonem i tlenem atomowym; laser wzbudza je bezpośrednio.',
          'Kometa Hale-Bopp: zdjęcia zrobione na La Palmie między 16 a 22 kwietnia 1997 roku pokazały wąski, prawie prosty ogon z obojętnych atomów sodu, długi na ponad 6 stopni, obok zakrzywionego ogona pyłowego i niebieskiego ogona jonowego. Sód tak silnie rozprasza światło słoneczne w swoich liniach D, że ciśnienie światła odpycha atomy od Słońca.',
        ],
      },
    },
  },
  de: {
    title: 'Die Sternwarte auf dem Berg',
    greet: {
      kid: 'Wir stehen auf einem Berg in einer Wüste, hoch über den Wolken! Die Luft hier oben ist so trocken und ruhig, dass die Sterne scharf leuchten. Machen wir uns einen eigenen Stern: Tippe auf den Laser am großen Teleskop. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Ein Gipfel wie der Cerro Paranal, 2635 m hoch in der Atacama-Wüste in Chile: trockene, dunkle, ruhige Luft über einem Wolkenmeer. Hier: ein Laserleitstern bei 589 nm, adaptive Optik und die Meteore, die die Natriumschicht in 90 km Höhe speisen. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Siehst du die roten Lampen? Astronomen benutzen nachts rotes Licht, weil es Augen, die sich an die Dunkelheit gewöhnt haben, viel weniger stört als weißes.',
        'Die meisten Sternschnuppen kommen von Krümeln aus Weltraumstaub, nicht größer als ein Sandkorn, die so schnell hereinrasen, dass sie verglühen.',
        'Das weiße Meer unter uns sind Wolken über dem Pazifik. Der Berg ragt über sie hinaus, deshalb ist der Himmel hier oben fast immer klar.',
      ],
      sci: [
        'Auf den Luftdruck am Boden zusammengepresst, ergäbe alles Natrium über dir eine Schicht, dünner als ein Atom: Die ganze Schicht enthält nur etwa 4 Milliarden Atome über jedem Quadratzentimeter.',
        'Rote Lampen erhalten die Dunkelanpassung: Die Stäbchen, die Zellen für schwaches Licht, sprechen auf tiefes Rot kaum an, deshalb blendet eine rote Lampe sie kaum.',
        'Meteore hinterlassen dort oben auch andere Metalle: Eisen, Magnesium, Kalium, Calcium. Für Leitsterne nimmt man Natrium, weil seine Linie bei 589 nm das Licht so kräftig zurückstreut.',
      ],
    },
    laser: {
      label: 'Der Laserleitstern',
      tap: 'Tippe auf den Laserstrahler',
      tapOff: 'Tippe auf den Strahler, um ihn auszuschalten',
      on: 'Laser an',
      off: 'Laser aus',
      title: 'Ein Stern aus einem Laser',
      sign: { layer: 'Natriumschicht', band: '80 bis 105 km', planes: 'Flugzeuge' },
      says: {
        on: {
          kid: 'Wusch! Der Laser leuchtet 90 km hinauf und bringt die Natriumatome dort zum Leuchten. Schau nach oben: ein ganz neuer Stern!',
          sci: 'Der 589-nm-Strahl regt Natriumatome in 80 bis 105 km Höhe an; ihre Fluoreszenz ist der Leitstern. Den Strahl selbst siehst du, weil die Luft darunter ein wenig von seinem Licht streut.',
        },
        off: {
          kid: 'Laser aus: Der künstliche Stern ist sofort weg.',
          sci: 'Strahl aus: Ein angeregtes Natriumatom strahlt innerhalb von etwa 16 Nanosekunden wieder ab, deshalb verschwindet der Leitstern sofort.',
        },
      },
      panel: {
        kid: [
          'Dieser gelb-orange Laser hat genau die Farbe des Lichts, das Natrium selbst aussendet. In etwa 90 km Höhe trifft er auf eine dünne Schicht aus Natriumatomen und bringt sie zum Leuchten: Ein künstlicher Stern erscheint, wo vorher keiner war.',
          'Die Skala neben dem Strahl zeigt, wie hoch das ist: Die Schicht liegt zwischen etwa 80 und 105 km, am dichtesten bei 90 km. Flugzeuge fliegen in etwa 10 km Höhe, weit darunter. Tippe auf den Strahler am Teleskop, um den Laser ein- oder auszuschalten.',
        ],
        sci: [
          'Der Laser ist auf die D2-Linie des Natriums bei 589 nm abgestimmt. Natriumatome in der Mesosphäre absorbieren ihn und strahlen dasselbe Licht in alle Richtungen wieder ab (Resonanzfluoreszenz): ein kleiner leuchtender Fleck in 80 bis 105 km Höhe, der Laserleitstern. Von der Seite ist er ein kurzer Strich, so lang, wie die Schicht dick ist; vom Teleskop aus, entlang des Strahls, ist er ein Punkt.',
          'Die Schicht hat ihr Maximum nahe 90 km mit nur einigen tausend Atomen pro Kubikzentimeter, genug für einen Stern, den das Teleskop nutzen kann. Am Very Large Telescope auf dem Cerro Paranal erzeugen vier Laser mit je 22 W vier Leitsterne zugleich. Renaud Foy und Antoine Labeyrie schlugen Laserleitsterne 1985 vor.',
        ],
      },
    },
    ao: {
      label: 'Das Funkeln wegnehmen',
      tap: 'Tippe auf den verformbaren Spiegel',
      laserFirst: 'Schalte zuerst den Laser ein',
      slide: 'Ändere die Luft',
      on: 'Adaptive Optik an',
      off: 'Adaptive Optik aus',
      slider: 'Turbulenz der Luft',
      calm: 'ruhig',
      wavy: 'wellig',
      rough: 'stürmisch',
      title: 'Das Funkeln wegnehmen',
      screen: { title: 'Die Kamera des Teleskops', off: 'adaptive Optik aus', wait: 'kein Leitstern', on: 'adaptive Optik an', mirror: 'verformbarer Spiegel' },
      says: {
        on: {
          kid: 'Schau, wie der Spiegel wackelt! Er verbiegt sich so, dass er das Zittern der Luft rückgängig macht, und der verschwommene Stern auf dem Bildschirm wird ein scharfer Punkt.',
          sci: 'Regelkreis geschlossen: Der Wellenfrontsensor misst die Verzerrung des Leitsterns, und der verformbare Spiegel nimmt die Gegenform an, hunderte Male pro Sekunde.',
        },
        wait: {
          kid: 'Der Spiegel ist bereit, aber er braucht einen Stern, an dem er die Luft sehen kann. Schalte den Laser am Teleskop ein!',
          sci: 'Keine Referenz: Ohne Leitstern hat der Wellenfrontsensor nichts zu messen. Schalte den Laser ein.',
        },
        off: {
          kid: 'Spiegel aus: Der Stern zittert und funkelt wieder.',
          sci: 'Regelkreis offen: Das Bild ist wieder durch das Seeing begrenzt.',
        },
      },
      panel: {
        kid: [
          'Sterne funkeln, weil die Luft über uns nie stillsteht: Warme und kalte Luft mischen sich und lenken das Sternenlicht mal hierhin, mal dorthin. In einem großen Teleskop wird ein Stern dadurch zu einem verschwommenen, zitternden Fleck.',
          'Dieser Spiegel ist dünn und biegsam, mit vielen kleinen Schiebern dahinter. Eine Kamera beobachtet den Laserstern, sieht, wie die Luft sein Licht verbiegt, und die Schieber formen den Spiegel hunderte Male pro Sekunde um, damit es wieder gerade wird. Tippe auf den Spiegel und verschiebe die Turbulenz, um die Luft ruhiger oder stürmischer zu machen.',
        ],
        sci: [
          'Turbulente Luftzellen mit leicht unterschiedlicher Temperatur und damit unterschiedlicher Brechzahl wellen die ankommende Wellenfront: Selbst an einem guten Standort wird ein Stern auf etwa eine Bogensekunde verschmiert (das Seeing), egal wie groß das Teleskop ist.',
          'Die adaptive Optik, 1953 von Horace Babcock vorgeschlagen, misst die Wellenfront an einem Leitstern und gibt einem verformbaren Spiegel die Gegenform, hunderte bis etwa tausend Male pro Sekunde. Yepun, das vierte Teleskop des VLT, hat einen verformbaren Sekundärspiegel mit 1,12 m Durchmesser und etwa 2 mm Dicke, geformt von 1170 Aktuatoren. Ein 8-m-Teleskop kommt dann nahe an seine Beugungsgrenze, etwa 0,06 Bogensekunden bei 2,2 µm.',
          'Ein Laserstern kann die Neigung des Bildes nicht zeigen (sein Licht geht durch dieselbe Luft hinauf und wieder herunter), deshalb braucht man dafür weiterhin einen schwachen natürlichen Stern in der Nähe.',
        ],
      },
    },
    sky: {
      label: 'Woher das Natrium kommt',
      tapSky: 'Tippe an den Himmel',
      tapComet: 'Tippe auf den Kometen',
      shower: 'Meteorschauer',
      showTails: 'Schweife des Kometen benennen',
      hideTails: 'Namen ausblenden',
      title: 'Natrium aus dem All',
      tails: { dust: 'Staubschweif', ion: 'Ionenschweif', sodium: 'Natriumschweif', name: 'Hale-Bopp, April 1997' },
      says: {
        meteor: {
          kid: 'Eine Sternschnuppe! Sie ist in etwa 90 km Höhe verglüht und hat ein Wölkchen Natrium in der Schicht gelassen.',
          sci: 'Ein Meteoroid, der nahe 90 km abladiert: Sein Natrium wird als Atome frei und kommt zur Schicht hinzu.',
        },
        shower: {
          kid: 'Ein Meteorschauer! Siehst du, wie sie alle aus einem Punkt am Himmel zu kommen scheinen?',
          sci: 'Ein Schauer: Die Meteoroide eines Stroms fliegen parallel, deshalb scheinen sie in der Perspektive aus einem Punkt zu kommen, dem Radianten.',
        },
        comet: {
          kid: 'Der Komet Hale-Bopp im April 1997: ein weißer Schweif aus Staub, ein blauer aus Gas und ein dünner gelber aus Natrium!',
          sci: 'Hale-Bopp im April 1997: der gekrümmte Staubschweif, der gerade Ionenschweif und der schmale Schweif aus neutralem Natrium, in jenem Monat entdeckt.',
        },
        hide: {
          kid: 'Die Namen sind versteckt. Tippe noch einmal auf den Kometen, um sie zu sehen.',
          sci: 'Beschriftung aus; tippe auf den Kometen, um sie wieder zu zeigen.',
        },
      },
      panel: {
        kid: [
          'Jeden Tag fallen Dutzende Tonnen Weltraumstaub in unsere Luft (die Schätzungen der Forscher gehen auseinander). Die Krümel rasen so schnell herein, dass sie in etwa 90 km Höhe verglühen: Sternschnuppen! Das Natrium darin bleibt dort oben und bildet die Natriumschicht. Tippe irgendwo an den Himmel, um eine loszuschicken.',
          '1997 bekam der Komet Hale-Bopp drei Schweife: einen weißen aus Staub, einen blauen aus Gas und einen dünnen, geraden aus Natriumatomen, weggeschoben vom Sonnenlicht, das diese Atome zurückwerfen. Tippe auf den Kometen, um zu sehen, welcher welcher ist.',
          'Der Erste, der das Leuchten des Natriums am Nachthimmel sah, war der amerikanische Astronom Vesto Slipher, im Jahr 1929.',
        ],
        sci: [
          'Meteoroide treten mit 11 bis 72 km/s in die Atmosphäre ein und abladieren in etwa 70 bis 120 km Höhe, wobei ihre Metalle als Atome frei werden. Die Schätzungen des Staubeintrags gehen weit auseinander; viele neuere liegen bei Dutzenden Tonnen pro Tag. Natrium, ein kleiner Teil davon, bildet die Schicht mit dem Maximum nahe 90 km.',
          'Vesto Slipher fand 1929 die D-Linien des Natriums im Spektrum des Nachthimmelsleuchtens. Dieses Leuchten stammt von Natriumatomen, die durch Reaktionen mit Ozon und atomarem Sauerstoff angeregt werden; der Laser regt sie direkt an.',
          'Komet Hale-Bopp: Aufnahmen von La Palma zwischen dem 16. und 22. April 1997 zeigten einen schmalen, fast geraden Schweif aus neutralen Natriumatomen, mehr als 6 Grad lang, neben dem gekrümmten Staubschweif und dem blauen Ionenschweif. Natrium streut Sonnenlicht in seinen D-Linien so stark, dass der Lichtdruck die Atome von der Sonne wegschiebt.',
        ],
      },
    },
  },
}
