// The words of sodium's street-lamp room ("Why were old street lights yellow?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Na.js (the easel shows it); the room shows it happening and adds to it.
// Facts: low-pressure sodium lamps start in a neon-argon (Penning) mixture that glows red-pink, and run
// up in about 7 to 15 minutes as the sodium evaporates; the arc tube works near 260 °C (sources give 245
// to 280 °C) inside an evacuated jacket; efficacy up to about 200 lm/W; the D lines are 588.995 and
// 589.592 nm (NIST); the eye's sensitivity at 589 nm is about three quarters of its peak at 555 nm (CIE
// 1924); the first lamps lit the road between Beek and Geleen, the Netherlands, on 28 June 1932
// (Philips); the last were made in 2019; observatories preferred them, one narrow line being easy to
// filter. A white LED is a blue InGaN chip under a cerium-doped YAG phosphor.
const EN = {
  title: 'A street at night',
  greet: {
    kid: 'We are inside the picture: a street at night! The old street lamp is still off. Tap the switch on its post and watch what colour it glows. The picture\'s story is on the easel beside you.',
    sci: 'A street at night: a low-pressure sodium lamp, still cold, a white LED lamp across the road and a spectroscope on a tripod. Switch the sodium lamp on at its post and watch it run up. The picture\'s story is on the easel.',
  },
  talk: {
    kid: [
      'Inside that old lamp there is a little of me: sodium, a soft silvery metal. Heat me into a gas and I glow yellow.',
      'Lamps like this one lit streets for almost 90 years. Today most of them have been swapped for white LED lamps.',
      'Astronomers loved these yellow lamps: their light is just one colour, so a filter on a telescope can take it away and leave the stars.',
    ],
    sci: [
      'The lamp is a U-shaped discharge tube of sodium-resistant glass with a little metallic sodium and a starting gas of neon with a trace of argon, inside an evacuated outer jacket that keeps it hot.',
      'The first low-pressure sodium lamps lit a road between Beek and Geleen, in the Netherlands, in 1932; the last were made in 2019.',
      'Near observatories low-pressure sodium was the lamp of choice: nearly all its light is in the D lines, which a narrow filter blocks.',
    ],
  },
  sign: 'BAKERY',
  lamp: {
    label: 'The sodium lamp',
    title: 'Switching on a sodium lamp',
    hints: { off: 'Tap the switch on the lamp post', warm: 'Watch the lamp and the clock', on: 'Tap the switch to turn it off' },
    buttons: { switch: 'Switch on or off' },
    says: {
      on: { kid: 'Click! It glows pink first: that is the neon gas inside, which starts the lamp. Watch the clock on the post: it runs 30 times faster than a real one.', sci: 'Struck: the discharge runs first in the neon starting gas, a dim red-pink glow. The clock on the post runs 30 times fast.' },
      warm: { kid: 'The sodium is warming up and turning into a gas: the light turns orange, then yellow.', sci: 'The tube heats, the sodium evaporates and takes over the discharge: its yellow D lines grow while the neon fades.' },
      full: { kid: 'Ten minutes, and it shines its brightest yellow. Now look at the street: where have the colours gone?', sci: 'Run up after about ten minutes (real lamps take 7 to 15): nearly all the light is now at 589 nm. Look at the colours of the street.' },
      off: { kid: 'Off. The sodium cools down and turns back into solid metal.', sci: 'Off: as the tube cools, the sodium vapour condenses back into metal.' },
    },
    panel: {
      kid: [
        'Inside the lamp is a long glass tube bent like a U, with a little sodium and some neon gas. Sodium is a metal, solid when it is cold. When you switch on, the electricity first flows through the neon, which glows pink-red.',
        'The neon\'s glow warms the tube. The sodium melts and turns into a gas, and then the sodium glows instead: orange first, then a bright yellow. A real lamp takes about ten minutes to get there; the clock on the post runs 30 times faster.',
      ],
      sci: [
        'A low-pressure sodium lamp: a U-shaped arc tube of sodium-resistant glass holding metallic sodium and a neon starting gas with a trace of argon (a Penning mixture), inside an evacuated outer jacket that keeps the heat in. Cold, the sodium has almost no vapour, so the discharge first runs in the neon: a dim red-pink glow.',
        'The discharge heats the tube to about 260 °C; the sodium evaporates and, much easier to excite than neon, takes over: the light goes through orange to the yellow of the D lines at 589.0 and 589.6 nm. Run-up takes about 7 to 15 minutes; the clock here runs 30 times fast. Up to about 200 lumens per watt: the most efficient lamp of its day.',
      ],
    },
  },
  colours: {
    label: 'Colours that vanish',
    title: 'Colours that vanish',
    slider: 'White light',
    hints: { lamp: 'Switch on the sodium lamp at its post', led: 'Tap the white lamp to switch it on', naOff: 'Tap the sodium lamp to switch it off', things: 'Tap the car, the tree or the ball' },
    buttons: { led: 'White lamp on or off', na: 'Sodium lamp on or off' },
    says: {
      ledOn: { kid: 'White light! The car is red again, the tree green and the ball blue. White light holds every colour, so each thing can show its own.', sci: 'The white LED\'s light spans the whole visible spectrum, so each surface\'s own reflectance across it, its hue, shows again.' },
      ledOff: { kid: 'White lamp off.', sci: 'LED off.' },
      both: { kid: 'The white light brings the colours back, but the sodium lamp still makes them yellowish. Switch it off to see their true colours!', sci: 'Mixed light: the white share brings the hues back; the sodium share adds the same yellow to everything, the more the better a surface reflects 589 nm.' },
      dark: { kid: 'It is too dark to see colours. Switch a lamp on!', sci: 'Too little light for the eye\'s colour-sensing cones: switch a lamp on.' },
    },
    things: {
      car: {
        na: { kid: 'The car is red, but under the sodium lamp it looks grey: red paint sends back only a little of this yellow light.', sci: 'Red paint reflects strongly only above about 600 nm; at 589 nm it sends back about a quarter of the light, so it looks a middling grey.' },
        white: { kid: 'In white light the car is bright red: its paint sends back the red part of the light.', sci: 'In white light the paint reflects the long-wavelength end of the spectrum: red.' },
      },
      tree: {
        na: { kid: 'The tree looks almost black: green leaves send back very little of this yellow light.', sci: 'Leaves reflect little visible light, most of it near 550 nm; at 589 nm less still, so they look dark grey.' },
        white: { kid: 'In white light the leaves are green again.', sci: 'In white light the leaves\' reflectance peak near 550 nm shows: green.' },
      },
      ball: {
        na: { kid: 'The blue ball looks nearly black: blue sends back almost none of this yellow light. Only its white stripe still shines.', sci: 'Blue pigment reflects mainly below about 500 nm and almost nothing at 589 nm: the ball looks nearly black, its white stripe bright.' },
        white: { kid: 'In white light the ball is blue, with a white stripe.', sci: 'In white light its reflectance at short wavelengths shows: blue.' },
      },
      flowers: {
        na: { kid: 'The yellow and white flowers shine, the red and orange ones are grey, the blue and purple ones nearly black.', sci: 'Each petal is reduced to one number, its reflectance at 589 nm: yellow and white high, red and orange middling, blue and violet low.' },
        white: { kid: 'In white light: red, orange, yellow, pink, purple, blue and white flowers!', sci: 'White light restores every petal\'s hue.' },
      },
      sign: {
        na: { kid: 'The sign is still easy to read: yellow paint sends back lots of this yellow light, so it shines.', sci: 'Yellow pigment reflects everything above about 520 nm, 589 nm included: the board stays bright, the red letters middling, the blue border dark.' },
        white: { kid: 'In white light: a yellow sign with red letters and a blue border.', sci: 'In white light the sign shows its three hues.' },
      },
      clothes: {
        na: { kid: 'Red shirt, blue jeans, yellow towel, green dress, white sheet: under this lamp they are only lighter or darker.', sci: 'Five dyes, one wavelength: the yellow towel and the white sheet bright, the red shirt grey, the green dress dark, the blue jeans darkest.' },
        white: { kid: 'In white light every piece of washing has its own colour back.', sci: 'In white light each dye shows its hue again.' },
      },
    },
    panel: {
      kid: [
        'Sodium light is just one colour, a deep yellow. A red car looks red because its paint sends back red light. But in sodium light there is no red light at all, so the car can only send back a little of the yellow: it looks grey.',
        'It is the same for everything: under the sodium lamp, things only look lighter or darker, depending on how much yellow light they send back. White light has all the colours in it, so in white light everything shows its own colour again. Slide the white light up and watch.',
      ],
      sci: [
        'A low-pressure sodium lamp is nearly monochromatic: almost all its visible light is in the D lines at 589.0 and 589.6 nm. Colour vision compares the signals of three kinds of cone; at a single wavelength their ratio is the same for every surface, so every hue collapses into one, and surfaces differ only in luminance, set by their reflectance at 589 nm.',
        'That is why high-pressure sodium lamps, with broader pinkish-gold light, and then white LEDs replaced them. A white LED is a blue LED under a yellow phosphor: its light covers the whole visible spectrum, so the differences in reflectance from one wavelength to another, the hues, show again. Mix the two lamps with the slider.',
      ],
    },
  },
  scope: {
    label: 'The spectroscope',
    title: 'Taking the light apart',
    screen: 'What the spectroscope shows',
    names: { na: 'Sodium lamp', led: 'White LED' },
    hints: { look: 'Tap the spectroscope', white: 'Tap the white lamp to compare', sodium: 'Tap the sodium lamp to compare' },
    buttons: { na: 'Look at the sodium lamp', led: 'Look at the white lamp' },
    says: {
      na: { kid: 'Look at the screen: one bright yellow line, and nothing else! The sodium lamp makes just this one colour.', sci: 'The D lines: 589.0 and 589.6 nm, too close together for the main scale; the close-up below shows them apart.' },
      neon: { kid: 'Red and orange lines: that is the neon, still starting the lamp. Watch the yellow line grow as the sodium warms.', sci: 'Neon\'s lines, orange to deep red, with sodium\'s D lines growing as its vapour pressure rises.' },
      led: { kid: 'A whole rainbow, from violet to red! White light has every colour in it.', sci: 'A continuous spectrum: the blue chip\'s peak near 450 nm and the phosphor\'s broad band from green to red.' },
      off: { kid: 'That lamp is off: no light, nothing to see. Switch it on!', sci: 'No light from that lamp: switch it on.' },
    },
    view: {
      na: { kid: 'One bright yellow line', sci: 'Sodium\'s D lines' },
      neon: { kid: 'Red lines: the neon starting', sci: 'Neon lines, sodium growing' },
      led: { kid: 'A whole rainbow', sci: 'Blue peak and a broad band' },
      off: 'The lamp is off',
      idle: 'Tap the spectroscope to look',
      zoom: 'Close up: 586 to 593 nm',
    },
    panel: {
      kid: [
        'A spectroscope splits light into its colours, as raindrops make a rainbow. White light, with every colour in it, makes a whole rainbow. But the sodium lamp makes just one thin yellow line, because sodium atoms give out light of almost only that one colour.',
        'Compare the two lamps! That yellow line is why colours vanish under the sodium lamp: there is no red, green or blue light for things to send back.',
      ],
      sci: [
        'The sodium D lines: D2 at 588.995 nm and D1 at 589.592 nm, from the 3p to 3s transition, split in two by the electron\'s spin-orbit coupling. They lie near the eye\'s peak sensitivity (555 nm; at 589 nm the eye is still about three quarters as sensitive), which is why the lamp gives so many lumens per watt.',
        'A white LED is a blue InGaN chip (about 450 nm) under a cerium-doped YAG phosphor that turns part of the blue into a broad yellow band: a continuous spectrum. Astronomers liked low-pressure sodium because one narrow line is easy to filter out of a telescope\'s view; light spread over the whole spectrum cannot be filtered that way.',
      ],
    },
  },
}

const PT = {
  title: 'Uma rua à noite',
  greet: {
    kid: 'Estamos dentro da imagem: uma rua à noite! O velho candeeiro ainda está apagado. Toca no interruptor do poste e vê de que cor ele brilha. A história da imagem está no cavalete ao teu lado.',
    sci: 'Uma rua à noite: uma lâmpada de sódio de baixa pressão, ainda fria, um candeeiro LED branco do outro lado da rua e um espetroscópio num tripé. Acende a lâmpada de sódio no poste e vê-a aquecer. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'Dentro daquele candeeiro velho há um bocadinho de mim: sódio, um metal mole e prateado. Aquece-me até virar gás e eu brilho amarelo.',
      'Candeeiros como este iluminaram ruas durante quase 90 anos. Hoje, a maior parte foi trocada por candeeiros LED brancos.',
      'Os astrónomos adoravam estes candeeiros amarelos: a luz deles é só de uma cor, por isso um filtro no telescópio consegue tirá-la e deixar ver as estrelas.',
    ],
    sci: [
      'A lâmpada é um tubo de descarga em forma de U, de vidro resistente ao sódio, com um pouco de sódio metálico e um gás de arranque de néon com um vestígio de árgon, dentro de uma ampola exterior com vácuo que a mantém quente.',
      'As primeiras lâmpadas de sódio de baixa pressão iluminaram uma estrada entre Beek e Geleen, nos Países Baixos, em 1932; as últimas foram fabricadas em 2019.',
      'Perto dos observatórios, o sódio de baixa pressão era a lâmpada preferida: quase toda a sua luz está nas riscas D, que um filtro estreito bloqueia.',
    ],
  },
  sign: 'PADARIA',
  lamp: {
    label: 'A lâmpada de sódio',
    title: 'Acender uma lâmpada de sódio',
    hints: { off: 'Toca no interruptor do poste', warm: 'Olha para a lâmpada e para o relógio', on: 'Toca no interruptor para a apagar' },
    buttons: { switch: 'Acender ou apagar' },
    says: {
      on: { kid: 'Clique! Primeiro brilha cor-de-rosa: é o gás néon lá dentro, que põe a lâmpada a funcionar. Olha para o relógio do poste: anda 30 vezes mais depressa do que um verdadeiro.', sci: 'Acesa: a descarga passa primeiro no gás de arranque, o néon, com um brilho vermelho-rosado fraco. O relógio do poste anda 30 vezes mais depressa.' },
      warm: { kid: 'O sódio está a aquecer e a transformar-se em gás: a luz fica cor de laranja e depois amarela.', sci: 'O tubo aquece, o sódio evapora-se e passa a conduzir a descarga: as suas riscas D amarelas crescem enquanto o néon se desvanece.' },
      full: { kid: 'Dez minutos, e brilha no seu amarelo mais forte. Agora olha para a rua: para onde foram as cores?', sci: 'Aquecida ao fim de cerca de dez minutos (as lâmpadas reais levam 7 a 15): quase toda a luz está agora a 589 nm. Olha para as cores da rua.' },
      off: { kid: 'Apagada. O sódio arrefece e volta a ser metal sólido.', sci: 'Apagada: ao arrefecer o tubo, o vapor de sódio volta a condensar em metal.' },
    },
    panel: {
      kid: [
        'Dentro da lâmpada há um tubo de vidro comprido dobrado em U, com um pouco de sódio e algum gás néon. O sódio é um metal, sólido quando está frio. Quando acendes, a eletricidade passa primeiro pelo néon, que brilha vermelho-rosado.',
        'O brilho do néon aquece o tubo. O sódio derrete e transforma-se em gás, e então é o sódio que brilha: primeiro cor de laranja, depois um amarelo forte. Uma lâmpada verdadeira demora cerca de dez minutos a chegar lá; o relógio do poste anda 30 vezes mais depressa.',
      ],
      sci: [
        'Uma lâmpada de sódio de baixa pressão: um tubo de descarga em U, de vidro resistente ao sódio, com sódio metálico e um gás de arranque de néon com um vestígio de árgon (uma mistura de Penning), dentro de uma ampola exterior com vácuo que guarda o calor. A frio, o sódio quase não tem vapor, por isso a descarga passa primeiro no néon: um brilho vermelho-rosado fraco.',
        'A descarga aquece o tubo até cerca de 260 °C; o sódio evapora-se e, muito mais fácil de excitar do que o néon, toma conta da descarga: a luz passa pelo laranja até ao amarelo das riscas D, a 589,0 e 589,6 nm. O aquecimento demora cerca de 7 a 15 minutos; aqui o relógio anda 30 vezes mais depressa. Até cerca de 200 lúmenes por watt: a lâmpada mais eficiente do seu tempo.',
      ],
    },
  },
  colours: {
    label: 'Cores que desaparecem',
    title: 'Cores que desaparecem',
    slider: 'Luz branca',
    hints: { lamp: 'Acende a lâmpada de sódio no poste', led: 'Toca no candeeiro branco para o acender', naOff: 'Toca na lâmpada de sódio para a apagar', things: 'Toca no carro, na árvore ou na bola' },
    buttons: { led: 'Candeeiro branco: acender ou apagar', na: 'Lâmpada de sódio: acender ou apagar' },
    says: {
      ledOn: { kid: 'Luz branca! O carro volta a ser vermelho, a árvore verde e a bola azul. A luz branca tem todas as cores, por isso cada coisa pode mostrar a sua.', sci: 'A luz do LED branco cobre todo o espetro visível, por isso a refletância de cada superfície ao longo dele, a sua cor, volta a ver-se.' },
      ledOff: { kid: 'Candeeiro branco apagado.', sci: 'LED apagado.' },
      both: { kid: 'A luz branca traz as cores de volta, mas a lâmpada de sódio ainda as deixa amareladas. Apaga-a para veres as cores verdadeiras!', sci: 'Luz mista: a parte branca devolve as cores; a parte de sódio junta o mesmo amarelo a tudo, tanto mais quanto melhor a superfície reflete os 589 nm.' },
      dark: { kid: 'Está escuro demais para ver cores. Acende um candeeiro!', sci: 'Luz a menos para os cones do olho, as células que veem as cores: acende um candeeiro.' },
    },
    things: {
      car: {
        na: { kid: 'O carro é vermelho, mas debaixo da lâmpada de sódio parece cinzento: a tinta vermelha devolve só um bocadinho desta luz amarela.', sci: 'A tinta vermelha só reflete muito acima de cerca de 600 nm; a 589 nm devolve cerca de um quarto da luz, por isso parece de um cinzento médio.' },
        white: { kid: 'Com luz branca o carro é vermelho vivo: a tinta devolve a parte vermelha da luz.', sci: 'Com luz branca a tinta reflete a ponta do espetro dos comprimentos de onda longos: vermelho.' },
      },
      tree: {
        na: { kid: 'A árvore parece quase preta: as folhas verdes devolvem muito pouco desta luz amarela.', sci: 'As folhas refletem pouca luz visível, a maior parte perto dos 550 nm; a 589 nm ainda menos, por isso parecem cinzento-escuras.' },
        white: { kid: 'Com luz branca as folhas voltam a ser verdes.', sci: 'Com luz branca vê-se o máximo de refletância das folhas perto dos 550 nm: verde.' },
      },
      ball: {
        na: { kid: 'A bola azul parece quase preta: o azul não devolve quase nada desta luz amarela. Só a risca branca ainda brilha.', sci: 'O pigmento azul reflete sobretudo abaixo de cerca de 500 nm e quase nada a 589 nm: a bola parece quase preta e a risca branca clara.' },
        white: { kid: 'Com luz branca a bola é azul, com uma risca branca.', sci: 'Com luz branca vê-se a sua refletância nos comprimentos de onda curtos: azul.' },
      },
      flowers: {
        na: { kid: 'As flores amarelas e brancas brilham, as vermelhas e cor de laranja ficam cinzentas, as azuis e roxas quase pretas.', sci: 'Cada pétala fica reduzida a um número, a sua refletância a 589 nm: alta nas amarelas e brancas, média nas vermelhas e laranja, baixa nas azuis e violeta.' },
        white: { kid: 'Com luz branca: flores vermelhas, cor de laranja, amarelas, cor-de-rosa, roxas, azuis e brancas!', sci: 'A luz branca devolve a cor a cada pétala.' },
      },
      sign: {
        na: { kid: 'A tabuleta continua fácil de ler: a tinta amarela devolve muita desta luz amarela, por isso brilha.', sci: 'O pigmento amarelo reflete tudo acima de cerca de 520 nm, incluindo os 589 nm: o fundo fica claro, as letras vermelhas médias, a moldura azul escura.' },
        white: { kid: 'Com luz branca: uma tabuleta amarela com letras vermelhas e moldura azul.', sci: 'Com luz branca a tabuleta mostra as suas três cores.' },
      },
      clothes: {
        na: { kid: 'T-shirt vermelha, calças de ganga azuis, toalha amarela, vestido verde, lençol branco: debaixo desta lâmpada são só mais claros ou mais escuros.', sci: 'Cinco corantes, um só comprimento de onda: a toalha amarela e o lençol branco claros, a t-shirt vermelha cinzenta, o vestido verde escuro, as calças azuis o mais escuro de todos.' },
        white: { kid: 'Com luz branca cada peça de roupa recupera a sua cor.', sci: 'Com luz branca cada corante volta a mostrar a sua cor.' },
      },
    },
    panel: {
      kid: [
        'A luz de sódio tem uma só cor, um amarelo forte. Um carro vermelho parece vermelho porque a tinta devolve luz vermelha. Mas na luz de sódio não há luz vermelha nenhuma, por isso o carro só consegue devolver um pouco do amarelo: parece cinzento.',
        'Acontece o mesmo com tudo: debaixo da lâmpada de sódio, as coisas só parecem mais claras ou mais escuras, conforme a quantidade de luz amarela que devolvem. A luz branca tem todas as cores, por isso com luz branca cada coisa volta a mostrar a sua cor. Sobe a luz branca e vê.',
      ],
      sci: [
        'Uma lâmpada de sódio de baixa pressão é quase monocromática: quase toda a sua luz visível está nas riscas D, a 589,0 e 589,6 nm. A visão das cores compara os sinais de três tipos de cones; num só comprimento de onda a razão entre eles é a mesma para todas as superfícies, por isso todas as cores se reduzem a uma, e as superfícies só diferem na luminância, dada pela sua refletância a 589 nm.',
        'Foi por isso que as lâmpadas de sódio de alta pressão, de luz mais larga e dourado-rosada, e depois os LED brancos as substituíram. Um LED branco é um LED azul sob um fósforo amarelo: a sua luz cobre todo o espetro visível, por isso as diferenças de refletância de um comprimento de onda para outro, as cores, voltam a ver-se. Mistura as duas lâmpadas com o cursor.',
      ],
    },
  },
  scope: {
    label: 'O espetroscópio',
    title: 'Separar a luz',
    screen: 'O que o espetroscópio mostra',
    names: { na: 'Lâmpada de sódio', led: 'LED branco' },
    hints: { look: 'Toca no espetroscópio', white: 'Toca no candeeiro branco para comparar', sodium: 'Toca na lâmpada de sódio para comparar' },
    buttons: { na: 'Olhar para a lâmpada de sódio', led: 'Olhar para o candeeiro branco' },
    says: {
      na: { kid: 'Olha para o ecrã: uma risca amarela brilhante, e mais nada! A lâmpada de sódio dá só esta cor.', sci: 'As riscas D: 589,0 e 589,6 nm, juntas demais para a escala principal; o pormenor em baixo mostra-as separadas.' },
      neon: { kid: 'Riscas vermelhas e cor de laranja: é o néon, que ainda está a pôr a lâmpada a funcionar. Vê a risca amarela crescer à medida que o sódio aquece.', sci: 'As riscas do néon, do laranja ao vermelho-escuro, com as riscas D do sódio a crescer à medida que sobe a pressão do seu vapor.' },
      led: { kid: 'Um arco-íris inteiro, do violeta ao vermelho! A luz branca tem todas as cores.', sci: 'Um espetro contínuo: o pico do chip azul perto dos 450 nm e a banda larga do fósforo, do verde ao vermelho.' },
      off: { kid: 'Esse candeeiro está apagado: sem luz, não há nada para ver. Acende-o!', sci: 'Nenhuma luz desse candeeiro: acende-o.' },
    },
    view: {
      na: { kid: 'Uma risca amarela brilhante', sci: 'As riscas D do sódio' },
      neon: { kid: 'Riscas vermelhas: o néon a arrancar', sci: 'Riscas do néon, sódio a crescer' },
      led: { kid: 'Um arco-íris inteiro', sci: 'Pico azul e uma banda larga' },
      off: 'A lâmpada está apagada',
      idle: 'Toca no espetroscópio para ver',
      zoom: 'Pormenor: 586 a 593 nm',
    },
    panel: {
      kid: [
        'Um espetroscópio separa a luz nas suas cores, como as gotas de chuva fazem um arco-íris. A luz branca, que tem todas as cores, faz um arco-íris inteiro. Mas a lâmpada de sódio faz só uma risca amarela fininha, porque os átomos de sódio dão luz quase só daquela cor.',
        'Compara os dois candeeiros! Aquela risca amarela é a razão por que as cores desaparecem debaixo da lâmpada de sódio: não há luz vermelha, verde nem azul para as coisas devolverem.',
      ],
      sci: [
        'As riscas D do sódio: D2 a 588,995 nm e D1 a 589,592 nm, da transição 3p para 3s, separadas em duas pelo acoplamento spin-órbita do eletrão. Ficam perto do máximo de sensibilidade do olho (555 nm; a 589 nm o olho ainda tem cerca de três quartos dessa sensibilidade), e é por isso que a lâmpada dá tantos lúmenes por watt.',
        'Um LED branco é um chip azul de InGaN (cerca de 450 nm) sob um fósforo de YAG dopado com cério que converte parte do azul numa banda amarela larga: um espetro contínuo. Os astrónomos gostavam do sódio de baixa pressão porque uma só risca estreita é fácil de filtrar da vista de um telescópio; a luz espalhada por todo o espetro não se filtra assim.',
      ],
    },
  },
}

const PL = {
  title: 'Ulica nocą',
  greet: {
    kid: 'Jesteśmy w obrazku: na ulicy nocą! Stara latarnia jeszcze nie świeci. Dotknij wyłącznika na słupie i zobacz, jakim kolorem się zaświeci. Historia obrazka jest na sztaludze obok ciebie.',
    sci: 'Ulica nocą: niskoprężna lampa sodowa, jeszcze zimna, biała latarnia LED po drugiej stronie ulicy i spektroskop na statywie. Włącz lampę sodową na słupie i patrz, jak się rozgrzewa. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'W tej starej latarni jest odrobina mnie: sód, miękki, srebrzysty metal. Rozgrzej mnie, aż zamienię się w gaz, a zaświecę na żółto.',
      'Takie latarnie oświetlały ulice przez prawie 90 lat. Dziś większość zamieniono na białe latarnie LED.',
      'Astronomowie uwielbiali te żółte latarnie: ich światło ma tylko jeden kolor, więc filtr na teleskopie może je usunąć i zostawić gwiazdy.',
    ],
    sci: [
      'Lampa to rurka wyładowcza w kształcie litery U ze szkła odpornego na sód, z odrobiną metalicznego sodu i gazem zapłonowym, neonem ze śladem argonu, wewnątrz zewnętrznej bańki z próżnią, która utrzymuje ciepło.',
      'Pierwsze niskoprężne lampy sodowe oświetliły w 1932 roku drogę między Beek a Geleen w Holandii; ostatnie wyprodukowano w 2019 roku.',
      'W pobliżu obserwatoriów niskoprężny sód był lampą z wyboru: prawie całe jego światło przypada na linie D, które blokuje wąski filtr.',
    ],
  },
  sign: 'PIEKARNIA',
  lamp: {
    label: 'Lampa sodowa',
    title: 'Włączanie lampy sodowej',
    hints: { off: 'Dotknij wyłącznika na słupie', warm: 'Patrz na lampę i na zegar', on: 'Dotknij wyłącznika, żeby ją wyłączyć' },
    buttons: { switch: 'Włącz lub wyłącz' },
    says: {
      on: { kid: 'Klik! Najpierw świeci na różowo: to neon w środku, który uruchamia lampę. Patrz na zegar na słupie: chodzi 30 razy szybciej niż prawdziwy.', sci: 'Zapłon: wyładowanie biegnie najpierw w neonie, gazie zapłonowym, słabą czerwonoróżową poświatą. Zegar na słupie chodzi 30 razy szybciej.' },
      warm: { kid: 'Sód się nagrzewa i zamienia w gaz: światło robi się pomarańczowe, a potem żółte.', sci: 'Rurka się nagrzewa, sód paruje i przejmuje wyładowanie: jego żółte linie D rosną, a neon słabnie.' },
      full: { kid: 'Dziesięć minut i świeci najjaśniejszym żółtym światłem. Popatrz teraz na ulicę: gdzie podziały się kolory?', sci: 'Rozgrzana po około dziesięciu minutach (prawdziwe lampy potrzebują od 7 do 15): prawie całe światło ma teraz 589 nm. Popatrz na kolory ulicy.' },
      off: { kid: 'Wyłączona. Sód stygnie i znowu staje się stałym metalem.', sci: 'Wyłączona: gdy rurka stygnie, para sodu skrapla się z powrotem w metal.' },
    },
    panel: {
      kid: [
        'W lampie jest długa szklana rurka wygięta w literę U, z odrobiną sodu i trochę neonu. Sód to metal, stały, kiedy jest zimny. Po włączeniu prąd płynie najpierw przez neon, który świeci na czerwonoróżowo.',
        'Świecący neon ogrzewa rurkę. Sód topi się i zamienia w gaz, i wtedy to sód zaczyna świecić: najpierw na pomarańczowo, potem jasno na żółto. Prawdziwa lampa potrzebuje na to około dziesięciu minut; zegar na słupie chodzi 30 razy szybciej.',
      ],
      sci: [
        'Niskoprężna lampa sodowa: rurka wyładowcza w kształcie litery U ze szkła odpornego na sód, z metalicznym sodem i gazem zapłonowym, neonem ze śladem argonu (mieszanina Penninga), wewnątrz zewnętrznej bańki z próżnią, która zatrzymuje ciepło. Na zimno sód prawie nie ma pary, więc wyładowanie biegnie najpierw w neonie: słaba czerwonoróżowa poświata.',
        'Wyładowanie ogrzewa rurkę do około 260 °C; sód paruje i, znacznie łatwiejszy do wzbudzenia niż neon, przejmuje wyładowanie: światło przechodzi przez pomarańcz do żółci linii D przy 589,0 i 589,6 nm. Rozgrzewanie trwa około 7 do 15 minut; tutaj zegar chodzi 30 razy szybciej. Do około 200 lumenów na wat: najwydajniejsza lampa swoich czasów.',
      ],
    },
  },
  colours: {
    label: 'Znikające kolory',
    title: 'Znikające kolory',
    slider: 'Białe światło',
    hints: { lamp: 'Włącz lampę sodową na słupie', led: 'Dotknij białej latarni, żeby ją włączyć', naOff: 'Dotknij lampy sodowej, żeby ją wyłączyć', things: 'Dotknij samochodu, drzewa albo piłki' },
    buttons: { led: 'Biała latarnia: włącz lub wyłącz', na: 'Lampa sodowa: włącz lub wyłącz' },
    says: {
      ledOn: { kid: 'Białe światło! Samochód znów jest czerwony, drzewo zielone, a piłka niebieska. Białe światło ma w sobie wszystkie kolory, więc każda rzecz może pokazać swój.', sci: 'Światło białej diody LED obejmuje całe widmo widzialne, więc odbicie każdej powierzchni w całym tym zakresie, czyli jej barwa, znów jest widoczne.' },
      ledOff: { kid: 'Biała latarnia wyłączona.', sci: 'LED wyłączony.' },
      both: { kid: 'Białe światło przywraca kolory, ale lampa sodowa wciąż je zażółca. Wyłącz ją, żeby zobaczyć prawdziwe kolory!', sci: 'Światło mieszane: biała część przywraca barwy, a sodowa dodaje wszystkiemu tę samą żółć, tym więcej, im lepiej powierzchnia odbija 589 nm.' },
      dark: { kid: 'Jest za ciemno, żeby widzieć kolory. Włącz jakąś lampę!', sci: 'Za mało światła dla czopków, komórek oka, które widzą barwy: włącz lampę.' },
    },
    things: {
      car: {
        na: { kid: 'Samochód jest czerwony, ale pod lampą sodową wygląda na szary: czerwony lakier odbija tylko odrobinę tego żółtego światła.', sci: 'Czerwony lakier silnie odbija dopiero powyżej około 600 nm; przy 589 nm odbija mniej więcej ćwierć światła, więc wygląda na średnio szary.' },
        white: { kid: 'W białym świetle samochód jest jaskrawoczerwony: lakier odbija czerwoną część światła.', sci: 'W białym świetle lakier odbija długofalowy koniec widma: czerwień.' },
      },
      tree: {
        na: { kid: 'Drzewo wygląda na prawie czarne: zielone liście odbijają bardzo mało tego żółtego światła.', sci: 'Liście odbijają mało światła widzialnego, najwięcej w okolicy 550 nm; przy 589 nm jeszcze mniej, więc wyglądają na ciemnoszare.' },
        white: { kid: 'W białym świetle liście znów są zielone.', sci: 'W białym świetle widać maksimum odbicia liści w okolicy 550 nm: zieleń.' },
      },
      ball: {
        na: { kid: 'Niebieska piłka wygląda na prawie czarną: niebieski kolor prawie wcale nie odbija tego żółtego światła. Świeci tylko jej biały pasek.', sci: 'Niebieski pigment odbija głównie poniżej około 500 nm, a przy 589 nm prawie nic: piłka wygląda na prawie czarną, a jej biały pasek na jasny.' },
        white: { kid: 'W białym świetle piłka jest niebieska, z białym paskiem.', sci: 'W białym świetle widać jej odbicie przy krótkich falach: błękit.' },
      },
      flowers: {
        na: { kid: 'Żółte i białe kwiaty świecą, czerwone i pomarańczowe są szare, a niebieskie i fioletowe prawie czarne.', sci: 'Każdy płatek sprowadza się do jednej liczby, swojego odbicia przy 589 nm: wysokiego dla żółtych i białych, średniego dla czerwonych i pomarańczowych, niskiego dla niebieskich i fioletowych.' },
        white: { kid: 'W białym świetle: kwiaty czerwone, pomarańczowe, żółte, różowe, fioletowe, niebieskie i białe!', sci: 'Białe światło przywraca barwę każdemu płatkowi.' },
      },
      sign: {
        na: { kid: 'Szyld wciąż łatwo przeczytać: żółta farba odbija dużo tego żółtego światła, więc świeci.', sci: 'Żółty pigment odbija wszystko powyżej około 520 nm, łącznie z 589 nm: tło zostaje jasne, czerwone litery średnie, niebieska ramka ciemna.' },
        white: { kid: 'W białym świetle: żółty szyld z czerwonymi literami i niebieską ramką.', sci: 'W białym świetle szyld pokazuje swoje trzy barwy.' },
      },
      clothes: {
        na: { kid: 'Czerwona koszulka, niebieskie dżinsy, żółty ręcznik, zielona sukienka, białe prześcieradło: pod tą lampą są tylko jaśniejsze albo ciemniejsze.', sci: 'Pięć barwników, jedna długość fali: żółty ręcznik i białe prześcieradło jasne, czerwona koszulka szara, zielona sukienka ciemna, niebieskie dżinsy najciemniejsze.' },
        white: { kid: 'W białym świetle każda rzecz na sznurku odzyskuje swój kolor.', sci: 'W białym świetle każdy barwnik znów pokazuje swoją barwę.' },
      },
    },
    panel: {
      kid: [
        'Światło sodowe ma tylko jeden kolor, ciemnożółty. Czerwony samochód wygląda na czerwony, bo jego lakier odbija czerwone światło. Ale w świetle sodowym w ogóle nie ma czerwonego światła, więc samochód może odbić tylko trochę żółtego: wygląda na szary.',
        'Tak samo jest ze wszystkim: pod lampą sodową rzeczy są tylko jaśniejsze albo ciemniejsze, zależnie od tego, ile żółtego światła odbijają. Białe światło ma w sobie wszystkie kolory, więc w białym świetle każda rzecz znów pokazuje swój kolor. Przesuń suwak białego światła w górę i patrz.',
      ],
      sci: [
        'Niskoprężna lampa sodowa jest prawie monochromatyczna: prawie całe jej światło widzialne przypada na linie D przy 589,0 i 589,6 nm. Widzenie barw porównuje sygnały trzech rodzajów czopków; przy jednej długości fali ich stosunek jest taki sam dla każdej powierzchni, więc wszystkie barwy zlewają się w jedną, a powierzchnie różnią się tylko luminancją, zależną od ich odbicia przy 589 nm.',
        'Dlatego zastąpiły je wysokoprężne lampy sodowe o szerszym, różowozłotym świetle, a potem białe diody LED. Biała dioda LED to niebieska dioda pod żółtym luminoforem: jej światło obejmuje całe widmo widzialne, więc różnice w odbiciu między długościami fal, czyli barwy, znów są widoczne. Zmieszaj światło obu lamp suwakiem.',
      ],
    },
  },
  scope: {
    label: 'Spektroskop',
    title: 'Rozkładanie światła',
    screen: 'Co pokazuje spektroskop',
    names: { na: 'Lampa sodowa', led: 'Biała dioda LED' },
    hints: { look: 'Dotknij spektroskopu', white: 'Dotknij białej latarni, żeby porównać', sodium: 'Dotknij lampy sodowej, żeby porównać' },
    buttons: { na: 'Spójrz na lampę sodową', led: 'Spójrz na białą latarnię' },
    says: {
      na: { kid: 'Popatrz na ekran: jedna jasna żółta linia i nic więcej! Lampa sodowa daje tylko ten jeden kolor.', sci: 'Linie D: 589,0 i 589,6 nm, zbyt blisko siebie dla głównej skali; zbliżenie poniżej pokazuje je osobno.' },
      neon: { kid: 'Czerwone i pomarańczowe linie: to neon, który wciąż uruchamia lampę. Patrz, jak żółta linia rośnie, gdy sód się nagrzewa.', sci: 'Linie neonu, od pomarańczowych do ciemnoczerwonych, i rosnące linie D sodu, w miarę jak wzrasta ciśnienie jego pary.' },
      led: { kid: 'Cała tęcza, od fioletu do czerwieni! Białe światło ma w sobie wszystkie kolory.', sci: 'Widmo ciągłe: szczyt niebieskiego chipu w okolicy 450 nm i szerokie pasmo luminoforu od zieleni do czerwieni.' },
      off: { kid: 'Ta latarnia jest wyłączona: nie ma światła, nie ma nic do oglądania. Włącz ją!', sci: 'Z tej lampy nie płynie światło: włącz ją.' },
    },
    view: {
      na: { kid: 'Jedna jasna żółta linia', sci: 'Linie D sodu' },
      neon: { kid: 'Czerwone linie: startuje neon', sci: 'Linie neonu, sód rośnie' },
      led: { kid: 'Cała tęcza', sci: 'Niebieski szczyt i szerokie pasmo' },
      off: 'Lampa jest wyłączona',
      idle: 'Dotknij spektroskopu, żeby spojrzeć',
      zoom: 'Zbliżenie: od 586 do 593 nm',
    },
    panel: {
      kid: [
        'Spektroskop rozkłada światło na kolory, tak jak krople deszczu robią tęczę. Białe światło, które ma w sobie wszystkie kolory, daje całą tęczę. Ale lampa sodowa daje tylko jedną cienką żółtą linię, bo atomy sodu świecą prawie wyłącznie tym jednym kolorem.',
        'Porównaj obie lampy! Ta żółta linia to powód, dla którego kolory znikają pod lampą sodową: nie ma czerwonego, zielonego ani niebieskiego światła, które rzeczy mogłyby odbić.',
      ],
      sci: [
        'Linie D sodu: D2 przy 588,995 nm i D1 przy 589,592 nm, z przejścia 3p do 3s, rozszczepione na dwie przez sprzężenie spin-orbita elektronu. Leżą blisko maksimum czułości oka (555 nm; przy 589 nm oko ma jeszcze około trzech czwartych tej czułości), dlatego lampa daje tyle lumenów na wat.',
        'Biała dioda LED to niebieski chip InGaN (około 450 nm) pod luminoforem YAG domieszkowanym cerem, który zamienia część błękitu w szerokie żółte pasmo: widmo ciągłe. Astronomowie lubili niskoprężny sód, bo jedną wąską linię łatwo odfiltrować z obrazu teleskopu; światła rozłożonego na całe widmo nie da się tak odfiltrować.',
      ],
    },
  },
}

const DE = {
  title: 'Eine Straße bei Nacht',
  greet: {
    kid: 'Wir sind im Bild: auf einer Straße bei Nacht! Die alte Straßenlampe ist noch aus. Tipp auf den Schalter an ihrem Mast und schau, in welcher Farbe sie leuchtet. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
    sci: 'Eine Straße bei Nacht: eine Natriumdampf-Niederdrucklampe, noch kalt, gegenüber eine weiße LED-Lampe und ein Spektroskop auf einem Stativ. Schalte die Natriumlampe an ihrem Mast ein und sieh zu, wie sie hochläuft. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'In der alten Lampe steckt ein bisschen von mir: Natrium, ein weiches, silbriges Metall. Mach mich heiß, bis ich ein Gas bin, und ich leuchte gelb.',
      'Lampen wie diese haben fast 90 Jahre lang Straßen beleuchtet. Heute sind die meisten gegen weiße LED-Lampen ausgetauscht.',
      'Astronomen liebten diese gelben Lampen: Ihr Licht hat nur eine Farbe, also kann ein Filter am Teleskop es wegnehmen und die Sterne übrig lassen.',
    ],
    sci: [
      'Die Lampe ist ein U-förmiges Entladungsrohr aus natriumbeständigem Glas mit etwas metallischem Natrium und einem Zündgas aus Neon mit einer Spur Argon, in einem evakuierten Außenkolben, der sie warm hält.',
      'Die ersten Natriumdampf-Niederdrucklampen beleuchteten 1932 eine Straße zwischen Beek und Geleen in den Niederlanden; die letzten wurden 2019 hergestellt.',
      'In der Nähe von Sternwarten war die Natrium-Niederdrucklampe die Lampe der Wahl: Fast ihr ganzes Licht liegt in den D-Linien, die ein schmaler Filter sperrt.',
    ],
  },
  sign: 'BÄCKEREI',
  lamp: {
    label: 'Die Natriumlampe',
    title: 'Eine Natriumlampe einschalten',
    hints: { off: 'Tipp auf den Schalter am Mast', warm: 'Schau auf die Lampe und die Uhr', on: 'Tipp auf den Schalter, um sie auszuschalten' },
    buttons: { switch: 'Ein oder aus' },
    says: {
      on: { kid: 'Klick! Zuerst leuchtet sie rosa: Das ist das Neongas darin, das die Lampe startet. Schau auf die Uhr am Mast: Sie läuft 30-mal so schnell wie eine echte.', sci: 'Gezündet: Die Entladung läuft zuerst im Zündgas Neon, ein schwaches rotrosa Leuchten. Die Uhr am Mast läuft 30-mal so schnell.' },
      warm: { kid: 'Das Natrium wird warm und verwandelt sich in Gas: Das Licht wird orange, dann gelb.', sci: 'Das Rohr erwärmt sich, das Natrium verdampft und übernimmt die Entladung: Seine gelben D-Linien wachsen, während das Neon verblasst.' },
      full: { kid: 'Zehn Minuten, und sie leuchtet in ihrem hellsten Gelb. Schau dir jetzt die Straße an: Wo sind die Farben hin?', sci: 'Hochgelaufen nach etwa zehn Minuten (echte Lampen brauchen 7 bis 15): Fast das ganze Licht liegt jetzt bei 589 nm. Schau dir die Farben der Straße an.' },
      off: { kid: 'Aus. Das Natrium kühlt ab und wird wieder zu festem Metall.', sci: 'Aus: Während das Rohr abkühlt, kondensiert der Natriumdampf wieder zu Metall.' },
    },
    panel: {
      kid: [
        'In der Lampe steckt ein langes Glasrohr, gebogen wie ein U, mit etwas Natrium und ein wenig Neongas. Natrium ist ein Metall, fest, solange es kalt ist. Wenn du einschaltest, fließt der Strom zuerst durch das Neon, das rotrosa leuchtet.',
        'Das Leuchten des Neons wärmt das Rohr. Das Natrium schmilzt und wird zu Gas, und dann leuchtet das Natrium: zuerst orange, dann hellgelb. Eine echte Lampe braucht dafür etwa zehn Minuten; die Uhr am Mast läuft 30-mal so schnell.',
      ],
      sci: [
        'Eine Natriumdampf-Niederdrucklampe: ein U-förmiges Entladungsrohr aus natriumbeständigem Glas mit metallischem Natrium und einem Zündgas aus Neon mit einer Spur Argon (ein Penning-Gemisch), in einem evakuierten Außenkolben, der die Wärme hält. Kalt hat das Natrium fast keinen Dampf, also läuft die Entladung zuerst im Neon: ein schwaches rotrosa Leuchten.',
        'Die Entladung heizt das Rohr auf etwa 260 °C; das Natrium verdampft und übernimmt, viel leichter anzuregen als Neon, die Entladung: Das Licht geht über Orange in das Gelb der D-Linien bei 589,0 und 589,6 nm über. Der Hochlauf dauert etwa 7 bis 15 Minuten; die Uhr hier läuft 30-mal so schnell. Bis zu etwa 200 Lumen pro Watt: die effizienteste Lampe ihrer Zeit.',
      ],
    },
  },
  colours: {
    label: 'Farben, die verschwinden',
    title: 'Farben, die verschwinden',
    slider: 'Weißes Licht',
    hints: { lamp: 'Schalte die Natriumlampe am Mast ein', led: 'Tipp auf die weiße Lampe, um sie einzuschalten', naOff: 'Tipp auf die Natriumlampe, um sie auszuschalten', things: 'Tipp auf das Auto, den Baum oder den Ball' },
    buttons: { led: 'Weiße Lampe ein oder aus', na: 'Natriumlampe ein oder aus' },
    says: {
      ledOn: { kid: 'Weißes Licht! Das Auto ist wieder rot, der Baum grün und der Ball blau. Weißes Licht enthält alle Farben, also kann jedes Ding seine eigene zeigen.', sci: 'Das Licht der weißen LED überspannt das ganze sichtbare Spektrum, also zeigt sich der Reflexionsgrad jeder Fläche darüber, ihr Farbton, wieder.' },
      ledOff: { kid: 'Weiße Lampe aus.', sci: 'LED aus.' },
      both: { kid: 'Das weiße Licht bringt die Farben zurück, aber die Natriumlampe macht sie noch gelblich. Schalte sie aus, dann siehst du die echten Farben!', sci: 'Mischlicht: Der weiße Anteil bringt die Farbtöne zurück; der Natriumanteil legt über alles dasselbe Gelb, umso mehr, je besser eine Fläche 589 nm reflektiert.' },
      dark: { kid: 'Es ist zu dunkel, um Farben zu sehen. Schalte eine Lampe ein!', sci: 'Zu wenig Licht für die Zapfen, die Farbsinneszellen des Auges: Schalte eine Lampe ein.' },
    },
    things: {
      car: {
        na: { kid: 'Das Auto ist rot, aber unter der Natriumlampe sieht es grau aus: Roter Lack wirft nur ein bisschen von diesem gelben Licht zurück.', sci: 'Roter Lack reflektiert stark erst oberhalb von etwa 600 nm; bei 589 nm wirft er etwa ein Viertel des Lichts zurück, also wirkt er mittelgrau.' },
        white: { kid: 'In weißem Licht ist das Auto knallrot: Sein Lack wirft den roten Teil des Lichts zurück.', sci: 'In weißem Licht reflektiert der Lack das langwellige Ende des Spektrums: Rot.' },
      },
      tree: {
        na: { kid: 'Der Baum sieht fast schwarz aus: Grüne Blätter werfen sehr wenig von diesem gelben Licht zurück.', sci: 'Blätter reflektieren wenig sichtbares Licht, das meiste um 550 nm; bei 589 nm noch weniger, also wirken sie dunkelgrau.' },
        white: { kid: 'In weißem Licht sind die Blätter wieder grün.', sci: 'In weißem Licht zeigt sich das Reflexionsmaximum der Blätter um 550 nm: Grün.' },
      },
      ball: {
        na: { kid: 'Der blaue Ball sieht fast schwarz aus: Blau wirft fast nichts von diesem gelben Licht zurück. Nur sein weißer Streifen leuchtet noch.', sci: 'Blaues Pigment reflektiert vor allem unterhalb von etwa 500 nm und bei 589 nm fast nichts: Der Ball wirkt fast schwarz, sein weißer Streifen hell.' },
        white: { kid: 'In weißem Licht ist der Ball blau, mit einem weißen Streifen.', sci: 'In weißem Licht zeigt sich sein Reflexionsgrad bei kurzen Wellenlängen: Blau.' },
      },
      flowers: {
        na: { kid: 'Die gelben und weißen Blumen leuchten, die roten und orangen sind grau, die blauen und lila fast schwarz.', sci: 'Jedes Blütenblatt schrumpft auf eine Zahl, seinen Reflexionsgrad bei 589 nm: hoch bei Gelb und Weiß, mittel bei Rot und Orange, niedrig bei Blau und Violett.' },
        white: { kid: 'In weißem Licht: rote, orange, gelbe, rosa, lila, blaue und weiße Blumen!', sci: 'Weißes Licht gibt jedem Blütenblatt seinen Farbton zurück.' },
      },
      sign: {
        na: { kid: 'Das Schild ist immer noch leicht zu lesen: Gelbe Farbe wirft viel von diesem gelben Licht zurück, also leuchtet es.', sci: 'Gelbes Pigment reflektiert alles oberhalb von etwa 520 nm, 589 nm eingeschlossen: Der Grund bleibt hell, die roten Buchstaben mittel, der blaue Rand dunkel.' },
        white: { kid: 'In weißem Licht: ein gelbes Schild mit roten Buchstaben und blauem Rand.', sci: 'In weißem Licht zeigt das Schild seine drei Farbtöne.' },
      },
      clothes: {
        na: { kid: 'Rotes T-Shirt, blaue Jeans, gelbes Handtuch, grünes Kleid, weißes Laken: Unter dieser Lampe sind sie nur heller oder dunkler.', sci: 'Fünf Farbstoffe, eine Wellenlänge: das gelbe Handtuch und das weiße Laken hell, das rote T-Shirt grau, das grüne Kleid dunkel, die blauen Jeans am dunkelsten.' },
        white: { kid: 'In weißem Licht hat jedes Wäschestück seine Farbe wieder.', sci: 'In weißem Licht zeigt jeder Farbstoff wieder seinen Farbton.' },
      },
    },
    panel: {
      kid: [
        'Natriumlicht hat nur eine Farbe, ein kräftiges Gelb. Ein rotes Auto sieht rot aus, weil sein Lack rotes Licht zurückwirft. Aber im Natriumlicht gibt es gar kein rotes Licht, also kann das Auto nur ein wenig vom Gelb zurückwerfen: Es sieht grau aus.',
        'So ist es mit allem: Unter der Natriumlampe sehen die Dinge nur heller oder dunkler aus, je nachdem, wie viel gelbes Licht sie zurückwerfen. Weißes Licht enthält alle Farben, also zeigt in weißem Licht jedes Ding wieder seine eigene Farbe. Schieb das weiße Licht hoch und schau zu.',
      ],
      sci: [
        'Eine Natriumdampf-Niederdrucklampe ist fast monochromatisch: Fast ihr ganzes sichtbares Licht liegt in den D-Linien bei 589,0 und 589,6 nm. Das Farbensehen vergleicht die Signale dreier Zapfenarten; bei einer einzigen Wellenlänge ist ihr Verhältnis für jede Fläche gleich, also fallen alle Farbtöne in einen zusammen, und Flächen unterscheiden sich nur in der Leuchtdichte, die ihr Reflexionsgrad bei 589 nm bestimmt.',
        'Deshalb wurden sie durch Natriumdampf-Hochdrucklampen mit breiterem, rosagoldenem Licht und dann durch weiße LEDs ersetzt. Eine weiße LED ist eine blaue LED unter einem gelben Leuchtstoff: Ihr Licht deckt das ganze sichtbare Spektrum ab, also zeigen sich die Unterschiede im Reflexionsgrad von einer Wellenlänge zur anderen, die Farbtöne, wieder. Misch die beiden Lampen mit dem Schieberegler.',
      ],
    },
  },
  scope: {
    label: 'Das Spektroskop',
    title: 'Licht zerlegen',
    screen: 'Was das Spektroskop zeigt',
    names: { na: 'Natriumlampe', led: 'Weiße LED' },
    hints: { look: 'Tipp auf das Spektroskop', white: 'Tipp auf die weiße Lampe zum Vergleich', sodium: 'Tipp auf die Natriumlampe zum Vergleich' },
    buttons: { na: 'Die Natriumlampe ansehen', led: 'Die weiße Lampe ansehen' },
    says: {
      na: { kid: 'Schau auf den Bildschirm: eine helle gelbe Linie und sonst nichts! Die Natriumlampe macht nur diese eine Farbe.', sci: 'Die D-Linien: 589,0 und 589,6 nm, zu nah beieinander für die Hauptskala; die Vergrößerung darunter zeigt sie getrennt.' },
      neon: { kid: 'Rote und orange Linien: Das ist das Neon, das die Lampe noch startet. Schau, wie die gelbe Linie wächst, während das Natrium warm wird.', sci: 'Die Linien des Neons, von Orange bis Tiefrot, und die D-Linien des Natriums, die mit seinem Dampfdruck wachsen.' },
      led: { kid: 'Ein ganzer Regenbogen, von Violett bis Rot! Weißes Licht enthält alle Farben.', sci: 'Ein kontinuierliches Spektrum: die Spitze des blauen Chips um 450 nm und das breite Band des Leuchtstoffs von Grün bis Rot.' },
      off: { kid: 'Diese Lampe ist aus: kein Licht, nichts zu sehen. Schalte sie ein!', sci: 'Kein Licht von dieser Lampe: Schalte sie ein.' },
    },
    view: {
      na: { kid: 'Eine helle gelbe Linie', sci: 'Die D-Linien des Natriums' },
      neon: { kid: 'Rote Linien: Das Neon startet', sci: 'Neonlinien, Natrium wächst' },
      led: { kid: 'Ein ganzer Regenbogen', sci: 'Blaue Spitze und ein breites Band' },
      off: 'Die Lampe ist aus',
      idle: 'Tipp auf das Spektroskop',
      zoom: 'Vergrößert: 586 bis 593 nm',
    },
    panel: {
      kid: [
        'Ein Spektroskop zerlegt Licht in seine Farben, so wie Regentropfen einen Regenbogen machen. Weißes Licht, das alle Farben enthält, macht einen ganzen Regenbogen. Aber die Natriumlampe macht nur eine dünne gelbe Linie, weil Natriumatome fast nur Licht dieser einen Farbe aussenden.',
        'Vergleiche die beiden Lampen! Diese gelbe Linie ist der Grund, warum unter der Natriumlampe die Farben verschwinden: Es gibt kein rotes, grünes oder blaues Licht, das die Dinge zurückwerfen könnten.',
      ],
      sci: [
        'Die Natrium-D-Linien: D2 bei 588,995 nm und D1 bei 589,592 nm, aus dem Übergang 3p nach 3s, durch die Spin-Bahn-Kopplung des Elektrons in zwei aufgespalten. Sie liegen nahe der größten Empfindlichkeit des Auges (555 nm; bei 589 nm hat das Auge noch etwa drei Viertel davon), darum gibt die Lampe so viele Lumen pro Watt.',
        'Eine weiße LED ist ein blauer InGaN-Chip (etwa 450 nm) unter einem cerdotierten YAG-Leuchtstoff, der einen Teil des Blaus in ein breites gelbes Band umwandelt: ein kontinuierliches Spektrum. Astronomen mochten die Natrium-Niederdrucklampe, weil sich eine einzige schmale Linie leicht aus dem Bild eines Teleskops filtern lässt; Licht, das über das ganze Spektrum verteilt ist, lässt sich so nicht filtern.',
      ],
    },
  },
}

export const LAMPS_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
