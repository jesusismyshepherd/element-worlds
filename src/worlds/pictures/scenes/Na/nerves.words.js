// The words of sodium's nerve room ("How does your brain send a message?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Na.js (the easel shows it); the room shows it happening and adds to it.
// Signs drawn in 3D or on the screens say "Na+" in plain letters (the 3D fonts have no superscripts).
const EN = {
  title: 'Beside a nerve fibre',
  greet: {
    kid: 'We are inside your body, shrunk smaller than a cell! That long glowing tube is a nerve fibre, and it carries messages. The picture\'s story is on the easel beside you.',
    sci: 'We are in the fluid between cells, beside an axon, its cell body on the left. The bare stretch next to the cell, the initial segment, is where each signal starts; further on the axon is wrapped in myelin. The picture\'s story is on the easel.',
  },
  talk: {
    kid: [
      'The violet balls marked Na+ are sodium, the same sodium as in table salt. The darker ones marked K+ are potassium, and the green ones are chloride.',
      'Outside the nerve there is lots of sodium; inside there is lots of potassium. Keeping them apart is what lets a nerve send its messages.',
      'Your brain has billions of nerve cells, and your longest nerve fibres reach all the way from the bottom of your back to your toes.',
    ],
    sci: [
      'Outside the cells there is about ten times as much Na+ as inside, and inside about 30 times as much K+ as outside. The membrane keeps them apart; channels and pumps let them through.',
      'The resting potential, about −70 mV inside, comes mostly from K+ leaking out through potassium channels that stay open at rest.',
      'A human brain has about 86 billion neurons. The longest axons, from the spinal cord to the foot, are about a metre long.',
    ],
  },
  fire: {
    label: 'The nerve cell',
    title: 'Sending a message',
    meter: 'Voltage inside the nerve',
    rest: 'rest',
    threshold: 'threshold',
    slider: { kid: 'How hard the push is', sci: 'Stimulus (depolarisation)' },
    hints: { fire: 'Tap the nerve cell to send a message', tired: 'First tap the golden pump to clear the sodium' },
    buttons: { fire: 'Send a message' },
    says: {
      fire: {
        kid: 'A message! Watch the blue gates open: sodium rushes in, and the inside of the nerve jumps from minus to plus. Then potassium flows out through the other gates and it goes back.',
        sci: 'Past threshold, about −55 mV, the voltage-gated Na+ channels open: Na+ rushes in and the inside swings from −70 mV to about +30 mV in under a millisecond. Then the Na+ channels close, K+ channels open, K+ flows out and the membrane repolarises.',
      },
      weak: {
        kid: 'Too gentle! The voltage rose a little and fell back, and the gates stayed shut. A nerve fires all the way or not at all. Make the push stronger with the slider in the panel.',
        sci: 'Below threshold: the depolarisation stayed under about −55 mV, too few Na+ channels opened and the potential decayed. All or nothing: a stronger stimulus gives a spike that comes sooner, not a bigger one.',
      },
      tired: {
        kid: 'The gates opened, but hardly anything happened: so much sodium has come in already that it no longer rushes in. Tap the golden pump to push it out again.',
        sci: 'The Na+ gradient has run down (here after three spikes; a real axon manages thousands): too little driving force, and the spike fails. Run the Na+/K+ pump to restore it.',
      },
    },
    panel: {
      kid: [
        'Every message in your nerves is the same little electric blip, passed along like a wave going round a stadium. The inside of a nerve is normally a little negative, about −70 millivolts. When the blue gates open, sodium rushes in and the inside jumps to plus for a moment; then potassium flows out through other gates and it goes back to minus. All of that takes about a thousandth of a second!',
        'Try a gentle push with the slider: if it is too weak, nothing happens. If it is strong enough, you always get the same whole message, never half of one. Scientists call this all or nothing. Each message lets a little sodium in, and after three messages here the golden pump has to clear it out.',
      ],
      sci: [
        'An action potential: at rest the inside sits near −70 mV. A stimulus depolarises the membrane; at threshold, about −55 mV, voltage-gated Na+ channels open, Na+ flows in down its gradient and the potential overshoots to about +30 mV within about a millisecond. The Na+ channels then inactivate, voltage-gated K+ channels open, K+ flows out, and the membrane repolarises, briefly undershooting the resting level.',
        'Alan Hodgkin and Andrew Huxley recorded it from inside the giant axon of a squid, a fibre about half a millimetre thick, in 1939, and by 1952 had explained it with equations for the Na+ and K+ currents (Nobel Prize in Physiology or Medicine 1963). The spike is all or nothing: a stronger stimulus fires sooner, not higher. Each spike moves only a tiny fraction of the ions.',
      ],
    },
  },
  pump: {
    label: 'The sodium pump',
    title: 'The sodium-potassium pump',
    sign: { title: 'The sodium pump', naOut: 'Na+ out', kIn: 'K+ in', atp: 'ATP used', ready: 'Messages ready' },
    hints: { pump: 'Tap the golden pump to run it once', rest: 'Tap the golden pump to run it anyway' },
    buttons: { pump: 'Run the pump once' },
    says: {
      pump: {
        kid: 'Clunk! The pump grabs three sodium from inside, uses one ATP for energy, throws them out and brings two potassium in.',
        sci: 'One cycle of the Na+/K+-ATPase: 3 Na+ bind inside, ATP phosphorylates the pump, it opens outward and releases them, binds 2 K+, lets go of the phosphate and opens inward again. One net positive charge leaves per cycle.',
      },
      idle: {
        kid: 'Nothing extra to clear, but the pump works anyway: a little sodium always leaks back in, so the pumps never stop.',
        sci: 'At rest Na+ leaks in and K+ leaks out slowly; the pumps balance the leaks all the time. Watch the sodium leak back in.',
      },
      done: {
        kid: 'All the extra sodium is out again. The nerve is ready for three more messages!',
        sci: 'Gradient restored: the extra Na+ is out and the K+ back in.',
      },
    },
    panel: {
      kid: [
        'Each message lets a little sodium into the nerve and a little potassium out. Golden pumps in the wall put them back: three sodium out and two potassium in at every turn, paid for with one ATP, the little packets of energy your cells make from food.',
        'Your body has enormous numbers of these pumps, and they work all the time, even while you sleep. Your brain spends about half of its energy just running them! Here each ball stands for very many ions, so the nerve runs out after three messages; a real one could send thousands first.',
      ],
      sci: [
        'The Na+/K+-ATPase pumps 3 Na+ out and 2 K+ in for each ATP it splits, against both gradients, and so moves one net positive charge out per cycle. It keeps Na+ about ten times higher outside than inside and K+ about 30 times higher inside: the gradients every action potential runs on.',
        'Jens Christian Skou found it in crab nerves in 1957, the first ion-transporting enzyme known (Nobel Prize in Chemistry 1997). It uses a large share of the body\'s energy at rest, about half of the brain\'s. One spike changes the concentrations only by a tiny fraction: here each ion stands for very many and the gradient runs down after three spikes, where a real axon could fire thousands.',
      ],
    },
  },
  race: {
    label: 'The race',
    title: 'Bare or wrapped?',
    bare: 'Bare',
    wrapped: 'Wrapped in myelin',
    go: 'Go',
    board: '1 metre of nerve',
    speed: { bare: 'about 1 m/s', wrapped: 'up to about 120 m/s' },
    hints: { go: 'Tap Go to start the race', again: 'Tap Go to race again' },
    buttons: { go: 'Start the race' },
    says: {
      go: {
        kid: 'Ready, steady, go! Both fibres get the same message at the same moment.',
        sci: 'Both fibres are stimulated together. The clocks show real time for a 1 m fibre; the race itself runs in slow motion.',
      },
      won: {
        kid: 'The wrapped one is there already, and the bare one has hardly started! Let me speed up time, or we would wait more than two minutes.',
        sci: 'Myelinated, up to about 120 m/s: 1 m in about 8 ms. At this slow motion the bare fibre would take two and a half minutes, so the clock now runs faster.',
      },
      done: {
        kid: 'There it is, after a whole second. The wrapped fibre was over a hundred times faster: its message jumps from gap to gap instead of creeping all the way.',
        sci: 'Unmyelinated, about 1 m/s: 1 m in about 1 s. Saltatory conduction wins by more than a hundred times.',
      },
    },
    panel: {
      kid: [
        'Some nerve fibres are wrapped in myelin, a fatty coat rolled round them many times, like tape round a cable. The message cannot get through the coat, so it jumps from one little gap to the next. Your fastest nerves carry messages at up to about 120 metres a second, faster than a racing car!',
        'Bare thin fibres creep along at about 1 metre a second, about as fast as a slow walk. They carry slow messages, like the dull ache that comes a moment after you stub your toe; the sharp first ouch arrives on faster, wrapped fibres.',
      ],
      sci: [
        'Myelin is many layers of membrane wrapped round an axon by Schwann cells (in the body\'s nerves) or oligodendrocytes (in the brain and spinal cord). It insulates the axon, so the current spreads quickly beneath it and the action potential is regenerated only at the nodes of Ranvier (Louis-Antoine Ranvier, 1878), where the Na+ channels cluster: saltatory conduction. The fastest fibres reach about 120 m/s.',
        'Thin unmyelinated C fibres conduct at about 1 m/s. Without myelin, speed grows only with the square root of the diameter: the squid\'s giant axon, about half a millimetre thick, reaches only about 20 to 25 m/s, while a myelinated fibre about 20 µm thick, 25 times thinner, is about five times faster. In multiple sclerosis the myelin in the brain and spinal cord is damaged and signals slow down or fail.',
      ],
    },
  },
}

const PT = {
  title: 'Ao lado de uma fibra nervosa',
  greet: {
    kid: 'Estamos dentro do teu corpo, encolhidos até ficarmos mais pequenos do que uma célula! Aquele tubo comprido e brilhante é uma fibra nervosa, e leva mensagens. A história da imagem está no cavalete ao teu lado.',
    sci: 'Estamos no líquido entre as células, ao lado de um axónio, com o corpo celular à esquerda. O troço nu junto à célula, o segmento inicial, é onde começa cada sinal; mais à frente o axónio está envolvido em mielina. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'As bolas violeta com Na+ são sódio, o mesmo sódio do sal de cozinha. As mais escuras com K+ são potássio, e as verdes são cloreto.',
      'Fora do nervo há muito sódio; dentro há muito potássio. É por os manter separados que o nervo consegue enviar as suas mensagens.',
      'O teu cérebro tem milhares de milhões de células nervosas, e as tuas fibras nervosas mais compridas vão desde o fundo das costas até aos dedos dos pés.',
    ],
    sci: [
      'Fora das células há cerca de dez vezes mais Na+ do que dentro, e dentro cerca de 30 vezes mais K+ do que fora. A membrana mantém-nos separados; canais e bombas deixam-nos passar.',
      'O potencial de repouso, cerca de −70 mV no interior, vem sobretudo do K+ que sai por canais de potássio que ficam abertos em repouso.',
      'Um cérebro humano tem cerca de 86 mil milhões de neurónios. Os axónios mais compridos, da medula espinal até ao pé, medem cerca de um metro.',
    ],
  },
  fire: {
    label: 'A célula nervosa',
    title: 'Enviar uma mensagem',
    meter: 'Voltagem dentro do nervo',
    rest: 'repouso',
    threshold: 'limiar',
    slider: { kid: 'Com que força é o empurrão', sci: 'Estímulo (despolarização)' },
    hints: { fire: 'Toca na célula nervosa para enviar uma mensagem', tired: 'Primeiro toca na bomba dourada para tirar o sódio' },
    buttons: { fire: 'Enviar uma mensagem' },
    says: {
      fire: {
        kid: 'Uma mensagem! Vê as portinhas azuis a abrir: o sódio entra a correr, e o interior do nervo salta de menos para mais. Depois o potássio sai pelas outras portinhas e tudo volta ao que era.',
        sci: 'Passado o limiar, cerca de −55 mV, abrem-se os canais de Na+ dependentes da voltagem: o Na+ entra em massa e o interior passa de −70 mV para cerca de +30 mV em menos de um milissegundo. Depois os canais de Na+ fecham, os canais de K+ abrem, o K+ sai e a membrana repolariza.',
      },
      weak: {
        kid: 'Fraco demais! A voltagem subiu um pouco e voltou a descer, e as portinhas ficaram fechadas. Um nervo dispara por inteiro ou não dispara. Empurra com mais força com o controlo deslizante no painel.',
        sci: 'Abaixo do limiar: a despolarização ficou aquém de cerca de −55 mV, abriram poucos canais de Na+ e o potencial voltou a descer. Tudo ou nada: um estímulo mais forte dá um pico que chega mais cedo, não um maior.',
      },
      tired: {
        kid: 'As portinhas abriram, mas quase nada aconteceu: já entrou tanto sódio que ele deixou de entrar a correr. Toca na bomba dourada para o pôr outra vez lá fora.',
        sci: 'O gradiente de Na+ esgotou-se (aqui ao fim de três picos; um axónio verdadeiro aguenta milhares): a força motriz é pequena demais e o pico falha. Põe a bomba de Na+/K+ a trabalhar para o repor.',
      },
    },
    panel: {
      kid: [
        'Todas as mensagens dos teus nervos são o mesmo pequeno impulso elétrico, passado de mão em mão como uma onda num estádio. O interior de um nervo é normalmente um pouco negativo, cerca de −70 milivolts. Quando as portinhas azuis abrem, o sódio entra a correr e o interior salta para mais por um instante; depois o potássio sai por outras portinhas e volta a menos. Tudo isto demora cerca de um milésimo de segundo!',
        'Experimenta um empurrão fraco com o controlo deslizante: se for fraco demais, não acontece nada. Se for forte que chegue, sai sempre a mesma mensagem inteira, nunca meia. Os cientistas chamam a isto tudo ou nada. Cada mensagem deixa entrar um pouco de sódio, e aqui, ao fim de três mensagens, a bomba dourada tem de o pôr lá fora.',
      ],
      sci: [
        'Um potencial de ação: em repouso o interior está perto de −70 mV. Um estímulo despolariza a membrana; no limiar, cerca de −55 mV, abrem-se canais de Na+ dependentes da voltagem, o Na+ entra a favor do gradiente e o potencial ultrapassa o zero até cerca de +30 mV em cerca de um milissegundo. Depois os canais de Na+ inativam-se, abrem-se canais de K+ dependentes da voltagem, o K+ sai e a membrana repolariza, descendo por momentos abaixo do repouso.',
        'Alan Hodgkin e Andrew Huxley registaram-no por dentro do axónio gigante de uma lula, uma fibra com cerca de meio milímetro de espessura, em 1939, e em 1952 tinham-no explicado com equações para as correntes de Na+ e de K+ (Prémio Nobel da Fisiologia ou Medicina de 1963). O pico é tudo ou nada: um estímulo mais forte dispara mais cedo, não mais alto. Cada pico move apenas uma fração mínima dos iões.',
      ],
    },
  },
  pump: {
    label: 'A bomba de sódio',
    title: 'A bomba de sódio e potássio',
    sign: { title: 'A bomba de sódio', naOut: 'Na+ para fora', kIn: 'K+ para dentro', atp: 'ATP gasto', ready: 'Mensagens prontas' },
    hints: { pump: 'Toca na bomba dourada para a pôr a trabalhar uma vez', rest: 'Toca na bomba dourada para a pôr a trabalhar na mesma' },
    buttons: { pump: 'Pôr a bomba a trabalhar uma vez' },
    says: {
      pump: {
        kid: 'Clonc! A bomba agarra três iões de sódio lá de dentro, gasta um ATP como energia, deita-os cá para fora e traz dois iões de potássio para dentro.',
        sci: 'Um ciclo da Na+/K+-ATPase: 3 Na+ ligam-se do lado de dentro, o ATP fosforila a bomba, ela abre-se para fora e liberta-os, liga 2 K+, larga o fosfato e abre-se outra vez para dentro. Em cada ciclo sai uma carga positiva efetiva.',
      },
      idle: {
        kid: 'Não há nada a mais para tirar, mas a bomba trabalha na mesma: entra sempre um bocadinho de sódio, por isso as bombas nunca param.',
        sci: 'Em repouso o Na+ entra e o K+ sai devagar; as bombas compensam essas fugas o tempo todo. Vê o sódio a voltar a entrar.',
      },
      done: {
        kid: 'Todo o sódio a mais já saiu. O nervo está pronto para mais três mensagens!',
        sci: 'Gradiente reposto: o Na+ a mais está fora e o K+ outra vez dentro.',
      },
    },
    panel: {
      kid: [
        'Cada mensagem deixa entrar um pouco de sódio no nervo e sair um pouco de potássio. Bombas douradas na parede põem-nos no lugar: três iões de sódio para fora e dois de potássio para dentro em cada volta, pagos com um ATP, os pacotinhos de energia que as tuas células fazem a partir da comida.',
        'O teu corpo tem um número enorme destas bombas, e elas trabalham sempre, até quando dormes. O teu cérebro gasta cerca de metade da sua energia só para as manter a trabalhar! Aqui cada bola vale por muitíssimos iões, por isso o nervo esgota-se ao fim de três mensagens; um verdadeiro conseguia enviar milhares antes disso.',
      ],
      sci: [
        'A Na+/K+-ATPase bombeia 3 Na+ para fora e 2 K+ para dentro por cada ATP que hidrolisa, contra os dois gradientes, e por isso tira uma carga positiva efetiva em cada ciclo. Mantém o Na+ cerca de dez vezes mais concentrado fora do que dentro e o K+ cerca de 30 vezes mais concentrado dentro: os gradientes de que vive cada potencial de ação.',
        'Jens Christian Skou descobriu-a em nervos de caranguejo em 1957, a primeira enzima conhecida a transportar iões (Prémio Nobel da Química de 1997). Gasta uma grande parte da energia do corpo em repouso, cerca de metade da do cérebro. Um só pico altera as concentrações apenas numa fração mínima: aqui cada ião vale por muitíssimos e o gradiente esgota-se ao fim de três picos, quando um axónio verdadeiro podia disparar milhares.',
      ],
    },
  },
  race: {
    label: 'A corrida',
    title: 'Nua ou envolvida?',
    bare: 'Nua',
    wrapped: 'Envolvida em mielina',
    go: 'Vai',
    board: '1 metro de nervo',
    speed: { bare: 'cerca de 1 m/s', wrapped: 'até cerca de 120 m/s' },
    hints: { go: 'Toca em Vai para começar a corrida', again: 'Toca em Vai para correr outra vez' },
    buttons: { go: 'Começar a corrida' },
    says: {
      go: {
        kid: 'Preparar, apontar, já! As duas fibras recebem a mesma mensagem no mesmo instante.',
        sci: 'As duas fibras são estimuladas ao mesmo tempo. Os relógios mostram o tempo real para uma fibra de 1 m; a corrida em si passa em câmara lenta.',
      },
      won: {
        kid: 'A envolvida já chegou, e a nua quase nem saiu do sítio! Vou acelerar o tempo, senão esperávamos mais de dois minutos.',
        sci: 'Mielinizada, até cerca de 120 m/s: 1 m em cerca de 8 ms. Nesta câmara lenta a fibra nua levaria dois minutos e meio, por isso o relógio passa a andar mais depressa.',
      },
      done: {
        kid: 'Lá chegou, ao fim de um segundo inteiro. A fibra envolvida foi mais de cem vezes mais rápida: a mensagem salta de falha em falha em vez de se arrastar o caminho todo.',
        sci: 'Sem mielina, cerca de 1 m/s: 1 m em cerca de 1 s. A condução saltatória ganha por mais de cem vezes.',
      },
    },
    panel: {
      kid: [
        'Algumas fibras nervosas estão envolvidas em mielina, uma capa de gordura enrolada à volta delas muitas vezes, como fita-cola à volta de um cabo. A mensagem não consegue atravessar a capa, por isso salta de uma pequena falha para a seguinte. Os teus nervos mais rápidos levam mensagens até cerca de 120 metros por segundo, mais depressa do que um carro de corrida!',
        'As fibras finas e nuas arrastam-se a cerca de 1 metro por segundo, mais ou menos a velocidade de quem passeia devagar. Levam as mensagens lentas, como a dor surda que chega um momento depois de bateres com o dedo do pé; o primeiro ai, o agudo, chega por fibras mais rápidas, envolvidas em mielina.',
      ],
      sci: [
        'A mielina são muitas camadas de membrana enroladas à volta de um axónio pelas células de Schwann (nos nervos do corpo) ou pelos oligodendrócitos (no cérebro e na medula espinal). Isola o axónio, de modo que a corrente se espalha depressa por baixo dela e o potencial de ação só se regenera nos nódulos de Ranvier (Louis-Antoine Ranvier, 1878), onde os canais de Na+ se concentram: condução saltatória. As fibras mais rápidas chegam a cerca de 120 m/s.',
        'As fibras C, finas e sem mielina, conduzem a cerca de 1 m/s. Sem mielina, a velocidade só cresce com a raiz quadrada do diâmetro: o axónio gigante da lula, com cerca de meio milímetro de espessura, chega apenas a cerca de 20 a 25 m/s, enquanto uma fibra mielinizada com cerca de 20 µm, 25 vezes mais fina, é cerca de cinco vezes mais rápida. Na esclerose múltipla a mielina do cérebro e da medula espinal fica danificada e os sinais abrandam ou falham.',
      ],
    },
  },
}

const PL = {
  title: 'Obok włókna nerwowego',
  greet: {
    kid: 'Jesteśmy w twoim ciele, zmniejszeni tak, że jesteśmy mniejsi od komórki! Ta długa świecąca rura to włókno nerwowe i ono przenosi wiadomości. Historia obrazka jest na sztaludze obok ciebie.',
    sci: 'Jesteśmy w płynie między komórkami, obok aksonu, a jego ciało komórki jest po lewej. Goły odcinek przy komórce, odcinek początkowy, to miejsce, gdzie zaczyna się każdy sygnał; dalej akson jest owinięty mieliną. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Fioletowe kulki z napisem Na+ to sód, ten sam sód co w soli kuchennej. Ciemniejsze z napisem K+ to potas, a zielone to chlorek.',
      'Na zewnątrz nerwu jest dużo sodu, a w środku dużo potasu. Właśnie dzięki temu, że są rozdzielone, nerw może wysyłać wiadomości.',
      'Twój mózg ma miliardy komórek nerwowych, a najdłuższe włókna nerwowe sięgają od dołu pleców aż do palców stóp.',
    ],
    sci: [
      'Na zewnątrz komórek jest około dziesięć razy więcej Na+ niż w środku, a w środku około 30 razy więcej K+ niż na zewnątrz. Błona trzyma je osobno; kanały i pompy przepuszczają je przez nią.',
      'Potencjał spoczynkowy, około −70 mV wewnątrz, bierze się głównie z K+ wypływającego przez kanały potasowe, które w spoczynku są otwarte.',
      'Ludzki mózg ma około 86 miliardów neuronów. Najdłuższe aksony, od rdzenia kręgowego do stopy, mają około metra długości.',
    ],
  },
  fire: {
    label: 'Komórka nerwowa',
    title: 'Wysyłanie wiadomości',
    meter: 'Napięcie wewnątrz nerwu',
    rest: 'spoczynek',
    threshold: 'próg',
    slider: { kid: 'Jak mocne jest pchnięcie', sci: 'Bodziec (depolaryzacja)' },
    hints: { fire: 'Dotknij komórki nerwowej, żeby wysłać wiadomość', tired: 'Najpierw dotknij złotej pompy, żeby usunąć sód' },
    buttons: { fire: 'Wyślij wiadomość' },
    says: {
      fire: {
        kid: 'Wiadomość! Patrz, jak otwierają się niebieskie bramki: sód wpada do środka, a wnętrze nerwu skacze z minusa na plus. Potem potas wypływa przez inne bramki i wszystko wraca do normy.',
        sci: 'Po przekroczeniu progu, około −55 mV, otwierają się bramkowane napięciem kanały Na+: Na+ wlewa się do środka, a wnętrze w niecałą milisekundę zmienia się z −70 mV do około +30 mV. Potem kanały Na+ się zamykają, otwierają się kanały K+, K+ wypływa i błona się repolaryzuje.',
      },
      weak: {
        kid: 'Za słabo! Napięcie trochę wzrosło i opadło, a bramki zostały zamknięte. Nerw strzela w całości albo wcale. Pchnij mocniej suwakiem na tablicy.',
        sci: 'Poniżej progu: depolaryzacja nie sięgnęła około −55 mV, otworzyło się za mało kanałów Na+ i potencjał opadł. Wszystko albo nic: silniejszy bodziec daje iglicę, która przychodzi wcześniej, a nie większą.',
      },
      tired: {
        kid: 'Bramki się otworzyły, ale prawie nic się nie stało: do środka weszło już tyle sodu, że przestał się tam pchać. Dotknij złotej pompy, żeby znowu go wypchnąć.',
        sci: 'Gradient Na+ się wyczerpał (tutaj po trzech iglicach; prawdziwy akson wytrzymuje tysiące): siła napędowa jest za mała i iglica się nie udaje. Uruchom pompę Na+/K+, żeby go odbudować.',
      },
    },
    panel: {
      kid: [
        'Każda wiadomość w twoich nerwach to ten sam mały elektryczny impuls, przekazywany dalej jak fala na stadionie. Wnętrze nerwu jest zwykle trochę ujemne, około −70 miliwoltów. Kiedy niebieskie bramki się otwierają, sód wpada do środka i wnętrze na chwilę skacze na plus; potem potas wypływa innymi bramkami i wraca na minus. Wszystko to trwa około tysięcznej części sekundy!',
        'Spróbuj słabego pchnięcia suwakiem: jeśli jest za słabe, nic się nie dzieje. Jeśli jest dość mocne, zawsze wychodzi ta sama cała wiadomość, nigdy połowa. Naukowcy nazywają to zasadą wszystko albo nic. Każda wiadomość wpuszcza trochę sodu, a tutaj po trzech wiadomościach złota pompa musi go wypompować.',
      ],
      sci: [
        'Potencjał czynnościowy: w spoczynku wnętrze ma około −70 mV. Bodziec depolaryzuje błonę; przy progu, około −55 mV, otwierają się bramkowane napięciem kanały Na+, Na+ wpływa zgodnie z gradientem, a potencjał przekracza zero i dochodzi do około +30 mV w ciągu mniej więcej milisekundy. Potem kanały Na+ się inaktywują, otwierają się bramkowane napięciem kanały K+, K+ wypływa, a błona się repolaryzuje, na chwilę schodząc poniżej poziomu spoczynkowego.',
        'Alan Hodgkin i Andrew Huxley zarejestrowali go od środka olbrzymiego aksonu kałamarnicy, włókna grubego na około pół milimetra, w 1939 roku, a do 1952 roku wyjaśnili go równaniami dla prądów Na+ i K+ (Nagroda Nobla w dziedzinie fizjologii lub medycyny 1963). Iglica działa na zasadzie wszystko albo nic: silniejszy bodziec wyzwala ją wcześniej, a nie wyżej. Każda iglica przenosi tylko drobny ułamek jonów.',
      ],
    },
  },
  pump: {
    label: 'Pompa sodowa',
    title: 'Pompa sodowo-potasowa',
    sign: { title: 'Pompa sodowa', naOut: 'Na+ na zewnątrz', kIn: 'K+ do środka', atp: 'Zużyte ATP', ready: 'Gotowe wiadomości' },
    hints: { pump: 'Dotknij złotej pompy, żeby wykonała jeden obrót', rest: 'Dotknij złotej pompy, żeby i tak wykonała obrót' },
    buttons: { pump: 'Jeden obrót pompy' },
    says: {
      pump: {
        kid: 'Klik! Pompa łapie trzy jony sodu ze środka, zużywa jedną cząsteczkę ATP jako energię, wyrzuca je na zewnątrz i wciąga dwa jony potasu do środka.',
        sci: 'Jeden cykl Na+/K+-ATPazy: 3 Na+ wiążą się od środka, ATP fosforyluje pompę, ta otwiera się na zewnątrz i je uwalnia, wiąże 2 K+, oddaje fosforan i znowu otwiera się do środka. W każdym cyklu wychodzi jeden ładunek dodatni netto.',
      },
      idle: {
        kid: 'Nie ma nic nadmiarowego do usunięcia, ale pompa i tak pracuje: trochę sodu zawsze przecieka do środka, więc pompy nigdy nie stają.',
        sci: 'W spoczynku Na+ powoli przecieka do środka, a K+ na zewnątrz; pompy cały czas równoważą te przecieki. Zobacz, jak sód wraca do środka.',
      },
      done: {
        kid: 'Cały nadmiar sodu jest już na zewnątrz. Nerw jest gotowy na trzy kolejne wiadomości!',
        sci: 'Gradient odbudowany: nadmiar Na+ jest na zewnątrz, a K+ znowu w środku.',
      },
    },
    panel: {
      kid: [
        'Każda wiadomość wpuszcza do nerwu trochę sodu i wypuszcza trochę potasu. Złote pompy w ściance odkładają je na miejsce: przy każdym obrocie trzy jony sodu na zewnątrz i dwa jony potasu do środka, a płaci się za to jedną cząsteczką ATP, czyli małą paczką energii, którą twoje komórki robią z jedzenia.',
        'Twoje ciało ma ogromnie dużo takich pomp i pracują one cały czas, nawet kiedy śpisz. Twój mózg zużywa mniej więcej połowę swojej energii tylko na ich pracę! Tutaj każda kulka oznacza bardzo wiele jonów, więc nerw wyczerpuje się po trzech wiadomościach; prawdziwy mógłby przedtem wysłać ich tysiące.',
      ],
      sci: [
        'Na+/K+-ATPaza wypompowuje 3 Na+ na zewnątrz i wpompowuje 2 K+ do środka na każdą rozłożoną cząsteczkę ATP, wbrew obu gradientom, i dlatego w każdym cyklu wynosi jeden ładunek dodatni netto. Utrzymuje stężenie Na+ na zewnątrz około dziesięć razy wyższe niż w środku, a stężenie K+ w środku około 30 razy wyższe: gradienty, z których korzysta każdy potencjał czynnościowy.',
        'Jens Christian Skou odkrył ją w nerwach kraba w 1957 roku, był to pierwszy poznany enzym transportujący jony (Nagroda Nobla w dziedzinie chemii 1997). Zużywa dużą część energii ciała w spoczynku, mniej więcej połowę energii mózgu. Jedna iglica zmienia stężenia tylko o drobny ułamek: tutaj każdy jon oznacza bardzo wiele i gradient wyczerpuje się po trzech iglicach, a prawdziwy akson mógłby wyładować się tysiące razy.',
      ],
    },
  },
  race: {
    label: 'Wyścig',
    title: 'Gołe czy owinięte?',
    bare: 'Gołe',
    wrapped: 'Owinięte mieliną',
    go: 'Start',
    board: '1 metr nerwu',
    speed: { bare: 'około 1 m/s', wrapped: 'do około 120 m/s' },
    hints: { go: 'Dotknij Start, żeby zacząć wyścig', again: 'Dotknij Start, żeby ścigać się jeszcze raz' },
    buttons: { go: 'Zacznij wyścig' },
    says: {
      go: {
        kid: 'Do biegu, gotowi, start! Oba włókna dostają tę samą wiadomość w tej samej chwili.',
        sci: 'Oba włókna są pobudzane jednocześnie. Zegary pokazują rzeczywisty czas dla włókna długości 1 m; sam wyścig jest pokazany w zwolnionym tempie.',
      },
      won: {
        kid: 'Owinięte już dotarło, a gołe ledwie ruszyło! Przyspieszę czas, bo inaczej czekalibyśmy ponad dwie minuty.',
        sci: 'Z mieliną, do około 120 m/s: 1 m w około 8 ms. Przy tym zwolnieniu gołe włókno potrzebowałoby dwóch i pół minuty, więc zegar idzie teraz szybciej.',
      },
      done: {
        kid: 'Jest, po całej sekundzie. Owinięte włókno było ponad sto razy szybsze: jego wiadomość skacze od przerwy do przerwy, zamiast pełznąć całą drogę.',
        sci: 'Bez mieliny, około 1 m/s: 1 m w około 1 s. Przewodzenie skokowe wygrywa ponad stukrotnie.',
      },
    },
    panel: {
      kid: [
        'Niektóre włókna nerwowe są owinięte mieliną, tłuszczową osłonką nawiniętą na nie wiele razy, jak taśma na kabel. Wiadomość nie może przejść przez osłonkę, więc skacze od jednej małej przerwy do następnej. Twoje najszybsze nerwy przenoszą wiadomości z prędkością do około 120 metrów na sekundę, szybciej niż samochód wyścigowy!',
        'Cienkie gołe włókna pełzną z prędkością około 1 metra na sekundę, mniej więcej tak szybko, jak ktoś, kto powoli spaceruje. Przenoszą wolne wiadomości, na przykład tępy ból, który przychodzi chwilę po tym, jak uderzysz się w palec u nogi; pierwsze ostre ała przychodzi szybszymi włóknami, owiniętymi mieliną.',
      ],
      sci: [
        'Mielina to wiele warstw błony nawiniętych na akson przez komórki Schwanna (w nerwach ciała) albo przez oligodendrocyty (w mózgu i rdzeniu kręgowym). Izoluje akson, więc prąd szybko rozchodzi się pod nią, a potencjał czynnościowy odnawia się tylko w przewężeniach Ranviera (Louis-Antoine Ranvier, 1878), gdzie skupiają się kanały Na+: przewodzenie skokowe. Najszybsze włókna osiągają około 120 m/s.',
        'Cienkie włókna C bez mieliny przewodzą z prędkością około 1 m/s. Bez mieliny prędkość rośnie tylko z pierwiastkiem kwadratowym średnicy: olbrzymi akson kałamarnicy, gruby na około pół milimetra, osiąga tylko około 20 do 25 m/s, a włókno z mieliną grube na około 20 µm, 25 razy cieńsze, jest około pięć razy szybsze. W stwardnieniu rozsianym mielina w mózgu i rdzeniu kręgowym ulega uszkodzeniu, a sygnały zwalniają albo zanikają.',
      ],
    },
  },
}

const DE = {
  title: 'Neben einer Nervenfaser',
  greet: {
    kid: 'Wir sind in deinem Körper, geschrumpft, bis wir kleiner sind als eine Zelle! Die lange leuchtende Röhre da ist eine Nervenfaser, und sie trägt Nachrichten. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
    sci: 'Wir sind in der Flüssigkeit zwischen den Zellen, neben einem Axon, links sein Zellkörper. Das nackte Stück direkt an der Zelle, das Initialsegment, ist der Ort, an dem jedes Signal beginnt; weiter hinten ist das Axon in Myelin gewickelt. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Die violetten Kugeln mit Na+ sind Natrium, dasselbe Natrium wie im Kochsalz. Die dunkleren mit K+ sind Kalium, und die grünen sind Chlorid.',
      'Außerhalb des Nervs gibt es viel Natrium, innen viel Kalium. Dass beide getrennt bleiben, ist das, was den Nerv Nachrichten schicken lässt.',
      'Dein Gehirn hat Milliarden Nervenzellen, und deine längsten Nervenfasern reichen vom unteren Rücken bis hinunter zu den Zehen.',
    ],
    sci: [
      'Außerhalb der Zellen gibt es etwa zehnmal so viel Na+ wie innen, und innen etwa 30-mal so viel K+ wie außen. Die Membran hält sie getrennt; Kanäle und Pumpen lassen sie hindurch.',
      'Das Ruhepotenzial, innen etwa −70 mV, kommt vor allem von K+, das durch Kaliumkanäle hinausströmt, die in Ruhe offen bleiben.',
      'Ein menschliches Gehirn hat etwa 86 Milliarden Neuronen. Die längsten Axone, vom Rückenmark bis zum Fuß, sind etwa einen Meter lang.',
    ],
  },
  fire: {
    label: 'Die Nervenzelle',
    title: 'Eine Nachricht schicken',
    meter: 'Spannung im Nerv',
    rest: 'Ruhe',
    threshold: 'Schwelle',
    slider: { kid: 'Wie stark der Stups ist', sci: 'Reiz (Depolarisation)' },
    hints: { fire: 'Tippe auf die Nervenzelle, um eine Nachricht zu schicken', tired: 'Tippe zuerst auf die goldene Pumpe, um das Natrium hinauszubringen' },
    buttons: { fire: 'Schicke eine Nachricht' },
    says: {
      fire: {
        kid: 'Eine Nachricht! Schau, wie sich die blauen Tore öffnen: Das Natrium strömt hinein, und das Innere des Nervs springt von Minus auf Plus. Dann fließt Kalium durch die anderen Tore hinaus, und alles ist wieder wie vorher.',
        sci: 'Jenseits der Schwelle, etwa −55 mV, öffnen sich die spannungsgesteuerten Na+-Kanäle: Na+ strömt hinein, und das Innere springt in weniger als einer Millisekunde von −70 mV auf etwa +30 mV. Dann schließen sich die Na+-Kanäle, K+-Kanäle öffnen sich, K+ strömt hinaus, und die Membran repolarisiert.',
      },
      weak: {
        kid: 'Zu sanft! Die Spannung ist ein bisschen gestiegen und wieder gefallen, und die Tore sind zu geblieben. Ein Nerv feuert ganz oder gar nicht. Stups stärker mit dem Schieberegler auf der Tafel.',
        sci: 'Unterschwellig: Die Depolarisation blieb unter etwa −55 mV, zu wenige Na+-Kanäle öffneten sich, und das Potenzial klang ab. Alles oder nichts: Ein stärkerer Reiz gibt eine Spitze, die früher kommt, keine größere.',
      },
      tired: {
        kid: 'Die Tore sind aufgegangen, aber fast nichts ist passiert: Es ist schon so viel Natrium hineingekommen, dass es nicht mehr hineinströmt. Tippe auf die goldene Pumpe, um es wieder hinauszubringen.',
        sci: 'Der Na+-Gradient ist aufgebraucht (hier nach drei Spitzen; ein echtes Axon schafft Tausende): zu wenig Triebkraft, die Spitze bleibt aus. Lass die Na+/K+-Pumpe laufen, um ihn wiederherzustellen.',
      },
    },
    panel: {
      kid: [
        'Jede Nachricht in deinen Nerven ist derselbe kleine elektrische Puls, weitergegeben wie eine La-Ola-Welle im Stadion. Das Innere eines Nervs ist normalerweise ein wenig negativ, etwa −70 Millivolt. Wenn sich die blauen Tore öffnen, strömt Natrium hinein, und das Innere springt für einen Moment auf Plus; dann fließt Kalium durch andere Tore hinaus, und es geht zurück auf Minus. Das alles dauert etwa eine tausendstel Sekunde!',
        'Probier einen sanften Stups mit dem Schieberegler: Ist er zu schwach, passiert nichts. Ist er stark genug, kommt immer dieselbe ganze Nachricht heraus, nie eine halbe. Forscher nennen das Alles oder nichts. Jede Nachricht lässt ein bisschen Natrium hinein, und hier muss die goldene Pumpe es nach drei Nachrichten wieder hinausschaffen.',
      ],
      sci: [
        'Ein Aktionspotenzial: In Ruhe liegt das Innere bei etwa −70 mV. Ein Reiz depolarisiert die Membran; an der Schwelle, etwa −55 mV, öffnen sich spannungsgesteuerte Na+-Kanäle, Na+ strömt seinem Gradienten folgend hinein, und das Potenzial schießt in etwa einer Millisekunde über null bis etwa +30 mV. Dann inaktivieren die Na+-Kanäle, spannungsgesteuerte K+-Kanäle öffnen sich, K+ strömt hinaus, und die Membran repolarisiert, wobei sie kurz unter das Ruheniveau fällt.',
        'Alan Hodgkin und Andrew Huxley maßen es 1939 im Inneren des Riesenaxons eines Tintenfischs, einer etwa einen halben Millimeter dicken Faser, und hatten es bis 1952 mit Gleichungen für die Na+- und K+-Ströme erklärt (Nobelpreis für Physiologie oder Medizin 1963). Die Spitze folgt dem Alles-oder-nichts-Prinzip: Ein stärkerer Reiz löst sie früher aus, nicht höher. Jede Spitze bewegt nur einen winzigen Bruchteil der Ionen.',
      ],
    },
  },
  pump: {
    label: 'Die Natriumpumpe',
    title: 'Die Natrium-Kalium-Pumpe',
    sign: { title: 'Die Natriumpumpe', naOut: 'Na+ hinaus', kIn: 'K+ hinein', atp: 'ATP verbraucht', ready: 'Nachrichten bereit' },
    hints: { pump: 'Tippe auf die goldene Pumpe, damit sie einmal arbeitet', rest: 'Tippe auf die goldene Pumpe, damit sie trotzdem arbeitet' },
    buttons: { pump: 'Lass die Pumpe einmal arbeiten' },
    says: {
      pump: {
        kid: 'Klonk! Die Pumpe schnappt sich drei Natrium-Ionen von innen, verbraucht ein ATP als Energie, wirft sie hinaus und holt zwei Kalium-Ionen herein.',
        sci: 'Ein Zyklus der Na+/K+-ATPase: 3 Na+ binden innen, ATP phosphoryliert die Pumpe, sie öffnet sich nach außen und gibt sie frei, bindet 2 K+, lässt das Phosphat los und öffnet sich wieder nach innen. Pro Zyklus verlässt netto eine positive Ladung die Zelle.',
      },
      idle: {
        kid: 'Es gibt nichts zusätzlich hinauszubringen, aber die Pumpe arbeitet trotzdem: Ein bisschen Natrium sickert immer wieder hinein, darum hören die Pumpen nie auf.',
        sci: 'In Ruhe sickert Na+ langsam hinein und K+ hinaus; die Pumpen gleichen diese Lecks ständig aus. Schau, wie das Natrium wieder hineinsickert.',
      },
      done: {
        kid: 'Das ganze zusätzliche Natrium ist wieder draußen. Der Nerv ist bereit für drei weitere Nachrichten!',
        sci: 'Gradient wiederhergestellt: Das zusätzliche Na+ ist draußen und das K+ wieder drinnen.',
      },
    },
    panel: {
      kid: [
        'Jede Nachricht lässt ein bisschen Natrium in den Nerv und ein bisschen Kalium hinaus. Goldene Pumpen in der Wand bringen sie zurück: bei jeder Runde drei Natrium-Ionen hinaus und zwei Kalium-Ionen hinein, bezahlt mit einem ATP, den kleinen Energiepäckchen, die deine Zellen aus der Nahrung machen.',
        'Dein Körper hat riesig viele dieser Pumpen, und sie arbeiten die ganze Zeit, sogar wenn du schläfst. Dein Gehirn verbraucht etwa die Hälfte seiner Energie nur dafür, sie anzutreiben! Hier steht jede Kugel für sehr viele Ionen, darum ist der Nerv nach drei Nachrichten erschöpft; ein echter könnte vorher Tausende schicken.',
      ],
      sci: [
        'Die Na+/K+-ATPase pumpt für jedes gespaltene ATP 3 Na+ hinaus und 2 K+ hinein, gegen beide Gradienten, und bringt so pro Zyklus netto eine positive Ladung hinaus. Sie hält Na+ außen etwa zehnmal so hoch konzentriert wie innen und K+ innen etwa 30-mal so hoch: die Gradienten, von denen jedes Aktionspotenzial lebt.',
        'Jens Christian Skou entdeckte sie 1957 in Krabbennerven, das erste bekannte ionentransportierende Enzym (Nobelpreis für Chemie 1997). Sie verbraucht einen großen Teil der Energie des Körpers in Ruhe, etwa die Hälfte der Energie des Gehirns. Eine einzelne Spitze ändert die Konzentrationen nur um einen winzigen Bruchteil: Hier steht jedes Ion für sehr viele, und der Gradient ist nach drei Spitzen erschöpft, wo ein echtes Axon Tausende Male feuern könnte.',
      ],
    },
  },
  race: {
    label: 'Das Rennen',
    title: 'Nackt oder umwickelt?',
    bare: 'Nackte Faser',
    wrapped: 'Mit Myelin umwickelt',
    go: 'Los',
    board: '1 Meter Nerv',
    speed: { bare: 'etwa 1 m/s', wrapped: 'bis etwa 120 m/s' },
    hints: { go: 'Tippe auf Los, um das Rennen zu starten', again: 'Tippe auf Los für ein neues Rennen' },
    buttons: { go: 'Starte das Rennen' },
    says: {
      go: {
        kid: 'Auf die Plätze, fertig, los! Beide Fasern bekommen im selben Moment dieselbe Nachricht.',
        sci: 'Beide Fasern werden gleichzeitig gereizt. Die Uhren zeigen die echte Zeit für eine 1 m lange Faser; das Rennen selbst läuft in Zeitlupe.',
      },
      won: {
        kid: 'Die umwickelte ist schon da, und die nackte ist kaum losgekommen! Ich mache die Zeit schneller, sonst würden wir mehr als zwei Minuten warten.',
        sci: 'Myelinisiert, bis etwa 120 m/s: 1 m in etwa 8 ms. In dieser Zeitlupe bräuchte die nackte Faser zweieinhalb Minuten, darum läuft die Uhr jetzt schneller.',
      },
      done: {
        kid: 'Da ist sie, nach einer ganzen Sekunde. Die umwickelte Faser war über hundertmal schneller: Ihre Nachricht springt von Lücke zu Lücke, statt den ganzen Weg zu kriechen.',
        sci: 'Ohne Myelin, etwa 1 m/s: 1 m in etwa 1 s. Die saltatorische Erregungsleitung gewinnt mehr als hundertfach.',
      },
    },
    panel: {
      kid: [
        'Manche Nervenfasern sind in Myelin gewickelt, einen fettigen Mantel, der viele Male um sie herumgerollt ist, wie Klebeband um ein Kabel. Die Nachricht kommt durch den Mantel nicht hindurch, also springt sie von einer kleinen Lücke zur nächsten. Deine schnellsten Nerven tragen Nachrichten mit bis zu etwa 120 Metern pro Sekunde, schneller als ein Rennwagen!',
        'Dünne nackte Fasern kriechen mit etwa 1 Meter pro Sekunde dahin, ungefähr so schnell, wie jemand langsam spazieren geht. Sie tragen langsame Nachrichten, wie den dumpfen Schmerz, der einen Moment nachdem du dir den Zeh gestoßen hast kommt; das erste scharfe Autsch kommt über schnellere, umwickelte Fasern.',
      ],
      sci: [
        'Myelin sind viele Membranschichten, die Schwann-Zellen (in den Nerven des Körpers) oder Oligodendrozyten (in Gehirn und Rückenmark) um ein Axon wickeln. Es isoliert das Axon, sodass sich der Strom darunter schnell ausbreitet und das Aktionspotenzial nur an den Ranvier-Schnürringen (Louis-Antoine Ranvier, 1878) neu entsteht, wo sich die Na+-Kanäle drängen: saltatorische Erregungsleitung. Die schnellsten Fasern erreichen etwa 120 m/s.',
        'Dünne marklose C-Fasern leiten mit etwa 1 m/s. Ohne Myelin wächst die Geschwindigkeit nur mit der Quadratwurzel des Durchmessers: Das Riesenaxon des Tintenfischs, etwa einen halben Millimeter dick, erreicht nur etwa 20 bis 25 m/s, während eine myelinisierte Faser von etwa 20 µm, 25-mal dünner, etwa fünfmal schneller ist. Bei Multipler Sklerose wird das Myelin in Gehirn und Rückenmark geschädigt, und Signale werden langsamer oder fallen aus.',
      ],
    },
  },
}

export const NERVES_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
