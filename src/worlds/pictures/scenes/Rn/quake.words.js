// The words of radon's quake room ("Can a gas warn of earthquakes?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Rn.js (the
// easel shows it). Said as research throughout: what scientists test, never a way to predict.
// Facts: Igarashi et al., Science 269, 60 (1995): radon in groundwater from a well at Nishinomiya (17 m deep in two
// sources; about 30 km from the epicentre) rose about fourfold from late October 1994 (when measuring began) to the
// end of December, peaked on 8 January 1995 at more than ten times the initial level, nine days before the
// earthquake, then fell; afterwards it stayed low. Kobe (Hyogo-ken Nanbu) earthquake: 17 January 1995, 5:46 local
// time, Mw 6.9 (JMA 7.2 then, now 7.3), 6434 deaths. Elastic rebound: H. F. Reid, 1910, after the 1906 San Francisco
// earthquake. Dilatancy-diffusion: Scholz, Sykes and Aggarwal, Science 181, 803 (1973). Tashkent: rising radon in deep
// wells before the 1966 earthquake (Ulomov and Mavashev), usually cited as the first such record. Japan's
// Headquarters for Earthquake Research Promotion gives 30-year probabilities for active faults; the Japan
// Meteorological Agency's public Earthquake Early Warning began in October 2007. Radon-222's half-life: 3.82 days.
// Soil-gas surveys: probes about 0.5 to 1 m deep, readings in kBq/m3, faults as narrow highs (King and others).
// The three other records on the screen and the field's readings are illustrative, and the words say so.
// {n} is a number.
export const QUAKE_WORDS = {
  en: {
    title: 'Beside the fault',
    greet: {
      kid: 'Hello! We are in a village in Japan at dusk, right beside a fault, a crack where huge blocks of rock meet. Can a gas warn of earthquakes? Try the fault model, the well hut and the probe. The picture\'s story is on the easel.',
      sci: 'A hillside village in Japan at dusk, beside an active fault, with a trench cut across it. Three stations: the idea being tested, the best-known record, and a use that works. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'I come from tiny bits of uranium in rocks. I am a gas, so I seep up through cracks into the soil and into well water.',
        'Nobody can predict earthquakes yet. In Japan people stay safe with strong buildings, drills at school and maps of where the faults are.',
        'Radon in a well goes up and down for lots of reasons: rain, air pressure, pumping. That is why scientists compare many records.',
      ],
      sci: [
        'Radon-222 has a half-life of 3.82 days, so what a well or a soil probe measures was made in rock close by, recently.',
        'One of the first radon records linked to an earthquake came from deep wells in Tashkent, before its earthquake of 1966.',
        'Japan maps its active faults and gives the chance of a large quake over 30 years, never a date. Its early warning, public since 2007, gives seconds of notice once a quake has begun.',
      ],
    },
    signs: { fault: 'the fault', trench: 'trench across the fault' },
    fault: {
      label: 'The fault model',
      verbs: { first: 'Tap the red arrows', more: 'Push harder', again: 'Push again' },
      title: 'Two blocks, one fault',
      push: 'How hard the blocks press',
      gauge: { push: 'push', limit: 'limit', radon: 'radon out' },
      says: {
        push: { kid: 'Push! The blocks press harder, but the fault is stuck, so the rock bends a little. Watch the layers.', sci: 'Stress builds while the fault stays locked: the rock either side deforms elastically, and the layers bend near the fault.' },
        cracks: { kid: 'Look: tiny cracks near the fault, and more radon getting out! At least, that is the idea scientists are testing.', sci: 'Near failure, microcracks may open, exposing fresh grain surfaces and new paths for gas: more radon could escape. A hypothesis, still being tested.' },
        slip: { kid: 'Whoa, it slipped! That jolt is an earthquake. The cracks close, and the radon goes back to normal.', sci: 'The fault slips: the stored strain is released at once (elastic rebound). The cracks close and the leak falls back to its background.' },
        again: { kid: 'Another slip! See how the layers no longer line up across the fault, like in the trench.', sci: 'Each slip adds to the offset of the layers, as the trench walls show.' },
      },
      tip: 'Tap the red arrows to push, or drag the slider.',
      buttons: { push: 'Push harder', limit: 'Push to the limit' },
      panel: {
        kid: [
          'Deep underground, two huge blocks of rock meet at a fault. They are pushed past each other very slowly, but the fault sticks, so the rock bends and stores up the push, like a ruler you bend. When it cannot hold any more, it slips all at once: an earthquake.',
          'Some scientists think that just before, the squeezed rock gets tiny cracks, and the radon made in the rock finds new ways out into soil and water. That is an idea they are testing, not something anyone can use to warn people yet.',
        ],
        sci: [
          'Elastic rebound (H. F. Reid, 1910, after the 1906 San Francisco earthquake): the blocks move steadily, the fault stays locked, strain builds up in the rock either side and is released in a sudden slip. The model\'s layers bend near the fault while it loads and snap straight, offset, when it slips.',
          'The precursor hypothesis: as stress nears failure, rock dilates with microcracks (the dilatancy-diffusion model of Scholz, Sykes and Aggarwal, 1973), exposing fresh grain surfaces from which radon-222 escapes and opening paths for gas and water. Some laboratory tests on stressed rock show radon emission rising before failure; in the field the link is not consistent.',
        ],
      },
    },
    record: {
      label: 'The well\'s record',
      verbs: { hut: 'Tap the hut', folder: 'Tap a folder' },
      title: 'One well before Kobe',
      time: 'Time on the record',
      week: 'week {n}',
      folders: { kobe: 'Kobe 1995', rain: 'Heavy rain', quiet: 'A quiet well', air: 'Air pressure' },
      screen: {
        kobe: { title: 'Radon in the water of one well', line: 'Nishinomiya, about 30 km from the epicentre' },
        rain: { title: 'Another well, after heavy rain', line: 'Radon rose, and no earthquake came' },
        quiet: { title: 'Another well, an earthquake nearby', line: 'The earthquake came, and radon stayed the same' },
        air: { title: 'A soil station and the air pressure', line: 'Radon up when the air pressure falls' },
        times: 'times the start',
        week: 'week',
        peak: '8 Jan: more than 10 times',
        quake: '17 Jan: the Kobe earthquake',
        quakeShort: 'earthquake',
        rainWord: 'rain',
        radon: 'radon',
        pressure: 'air pressure',
        example: 'EXAMPLE',
        off: 'Tap the hut to start',
      },
      says: {
        on: { kid: 'The hut sends the well\'s readings by radio. Late October 1994: watch the radon start to creep up.', sci: 'Measuring began in late October 1994. By the end of December the radon was about four times its first level.' },
        peak: { kid: '8 January: more than ten times the start! Nine days before the earthquake. Then it fell again.', sci: '8 January 1995: the peak, more than ten times the initial level, nine days before the earthquake; then it declined.' },
        quake: { kid: '17 January 1995, 5:46 in the morning: the Kobe earthquake. It was terrible: more than 6000 people died, and afterwards Japan made its buildings and plans much safer.', sci: '17 January 1995, 05:46 local time: the Hyogo-ken Nanbu (Kobe) earthquake, Mw 6.9; 6434 people died. Afterwards the radon in this well stayed low.' },
        rain: { kid: 'This well\'s radon rose after days of heavy rain, and no earthquake came. Water soaking into the ground changes how the gas moves.', sci: 'A rise after heavy rainfall: infiltration changes soil moisture and groundwater flow, and radon with them. No earthquake followed.' },
        quiet: { kid: 'Here an earthquake came, but the radon did not change at all.', sci: 'An earthquake with no radon anomaly: the common case.' },
        air: { kid: 'Up and down, up and down: when the air pressure falls, more gas breathes out of the ground; when it rises, less.', sci: 'Radon against barometric pressure: falling pressure draws soil gas out, rising pressure pushes air in.' },
        all: { kid: 'So one well cannot tell you. That is why scientists keep measuring and comparing.', sci: 'One record proves nothing: a precursor must be told apart from rain, pressure, tides and pumping, and must come before many earthquakes, not one.' },
      },
      tip: 'Tap the hut to play the record, drag the slider, and tap a folder for another record.',
      buttons: { play: 'Play the record' },
      panel: {
        kid: [
          'This hut measures the radon in the water of a well. Before the Kobe earthquake in Japan in 1995, a well at Nishinomiya recorded the radon going up for weeks, to more than ten times where it started, and falling again just before the earthquake.',
          'It looks like a warning! But the folders hold other records: radon can rise after rain and go up and down with the air pressure, and many earthquakes come with no change at all. That is why one record is not enough.',
        ],
        sci: [
          'Igarashi et al., Science 269, 60 (1995): radon in groundwater from a well at Nishinomiya, about 30 km from the epicentre, rose about fourfold from late October to the end of December 1994, peaked on 8 January 1995 at more than ten times the initial level and then declined, nine days before the Mw 6.9 earthquake of 17 January. The trace follows those numbers; its small day-to-day wiggles are drawn, not measured.',
          'The other three folders are examples, not real wells, of what such records also show: rises after heavy rain, earthquakes with no anomaly, and swings with barometric pressure (tides and pumping move radon too). Reviews find anomalies before some earthquakes but not consistently, so radon is not used to predict them.',
        ],
      },
    },
    probe: {
      label: 'Finding the fault',
      verbs: { first: 'Tap a marked spot', more: 'Tap another spot', done: 'Tap any spot' },
      title: 'A fault found by its radon',
      pos: 'Position along the line',
      unit: 'kBq/m³',
      map: { title: 'Where is the fault?', count: 'Spots measured: {n} of 5', found: 'the fault\'s hidden line', trench: 'trench', line: 'probe line' },
      says: {
        first: { kid: 'In goes the probe, about as deep as your arm is long. The meter sucks up gas from the soil and counts its radon.', sci: 'The probe goes about 0.8 m into the soil; a pump draws soil gas into the detector, which counts radon\'s alpha decays.' },
        high: { kid: 'Wow, much more here! The ground is cracked along the fault, so gas from deep down comes up faster.', sci: 'A clear high: along a fault the fractured zone lets soil gas rise faster, so less of its radon decays on the way up.' },
        low: { kid: 'Only a little radon here. Try more spots along the line.', sci: 'Background level. Keep going along the profile.' },
        found: { kid: 'Five spots! Join the highest one to the fault in the trench, and there is the fault\'s hidden line across the field.', sci: 'With five readings the anomaly is clear: joined to the trench, it traces the fault under the field.' },
        hint: { kid: 'Five spots, but no high reading yet. Try other spots along the line.', sci: 'No anomaly among these readings yet: extend the profile.' },
      },
      tip: 'Tap a marked spot, or drag the probe along the line.',
      buttons: { all: 'Measure every marked spot', clear: 'Start a new survey' },
      panel: {
        kid: [
          'Faults are not always easy to see: grass and soil cover them. But the ground along a fault is full of cracks, and radon from deep down slips up them faster. So a line of radon readings across a field shows a bump right where the fault is.',
          'Geologists really do this, to map faults before building, and to look for uranium, the metal radon comes from. This one works: it does not predict earthquakes, it shows where faults are.',
        ],
        sci: [
          'Soil-gas radon surveys: a hollow probe about 0.5 to 1 m deep, soil gas pumped into a detector (an ionisation chamber or a scintillation cell), readings in kBq/m³ along profiles across the suspected trace. Fractured fault zones are more permeable, so gas rises faster than radon-222 (half-life 3.82 days) decays: narrow highs of several times the background mark the fault.',
          'The readings in this field are an example. The method is used to map active faults (with trenches and geophysics) and in uranium exploration; readings also depend on soil moisture, weather and the gases carrying the radon, so surveys are repeated.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Junto à falha',
    greet: {
      kid: 'Olá! Estamos numa aldeia do Japão ao fim da tarde, mesmo ao lado de uma falha, uma fenda onde se encontram enormes blocos de rocha. Um gás pode avisar dos sismos? Experimenta a maqueta da falha, a cabana do poço e a sonda. A história da imagem está no cavalete.',
      sci: 'Uma aldeia numa encosta do Japão ao fim da tarde, junto a uma falha ativa, com uma trincheira aberta através dela. Três postos: a ideia que se está a testar, o registo mais conhecido e um uso que funciona. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Eu venho de pedacinhos de urânio que há nas rochas. Sou um gás, por isso subo pelas fendas até à terra e à água dos poços.',
        'Ainda ninguém consegue prever sismos. No Japão as pessoas protegem-se com prédios fortes, exercícios na escola e mapas de onde estão as falhas.',
        'O rádon de um poço sobe e desce por muitas razões: a chuva, a pressão do ar, a bombagem. Por isso os cientistas comparam muitos registos.',
      ],
      sci: [
        'O rádon-222 tem uma meia-vida de 3,82 dias, por isso o que um poço ou uma sonda no solo medem foi feito em rocha próxima, há pouco tempo.',
        'Um dos primeiros registos de rádon associados a um sismo veio de poços profundos em Tashkent, antes do sismo de 1966.',
        'O Japão cartografa as suas falhas ativas e dá a probabilidade de um grande sismo em 30 anos, nunca uma data. O seu alerta sísmico, público desde 2007, dá segundos de aviso depois de um sismo começar.',
      ],
    },
    signs: { fault: 'a falha', trench: 'trincheira através da falha' },
    fault: {
      label: 'A maqueta da falha',
      verbs: { first: 'Toca nas setas vermelhas', more: 'Empurra mais', again: 'Empurra outra vez' },
      title: 'Dois blocos, uma falha',
      push: 'Com que força os blocos se apertam',
      gauge: { push: 'empurrão', limit: 'limite', radon: 'rádon a sair' },
      says: {
        push: { kid: 'Empurra! Os blocos apertam-se com mais força, mas a falha está presa, por isso a rocha dobra um bocadinho. Olha para as camadas.', sci: 'A tensão acumula-se enquanto a falha está bloqueada: a rocha dos dois lados deforma-se elasticamente e as camadas dobram junto à falha.' },
        cracks: { kid: 'Olha: fendas pequeninas junto à falha, e mais rádon a sair! Pelo menos, é essa a ideia que os cientistas estão a testar.', sci: 'Perto da rotura podem abrir-se microfissuras, que expõem superfícies de grão novas e abrem caminhos para o gás: poderia escapar mais rádon. Uma hipótese, ainda em teste.' },
        slip: { kid: 'Uau, escorregou! Esse solavanco é um sismo. As fendas fecham e o rádon volta ao normal.', sci: 'A falha desliza: a deformação acumulada liberta-se de uma vez (ressalto elástico). As fendas fecham e a fuga volta ao nível de fundo.' },
        again: { kid: 'Outro deslize! Vê como as camadas já não estão alinhadas dos dois lados da falha, como na trincheira.', sci: 'Cada deslize aumenta o desnível das camadas, como mostram as paredes da trincheira.' },
      },
      tip: 'Toca nas setas vermelhas para empurrar, ou arrasta o cursor.',
      buttons: { push: 'Empurrar mais', limit: 'Empurrar até ao limite' },
      panel: {
        kid: [
          'Bem fundo debaixo da terra, dois enormes blocos de rocha encontram-se numa falha. São empurrados um contra o outro muito devagar, mas a falha está presa, por isso a rocha dobra e vai guardando o empurrão, como uma régua que dobras. Quando já não aguenta mais, escorrega de repente: um sismo.',
          'Alguns cientistas pensam que, mesmo antes, a rocha apertada ganha fendas pequeninas, e o rádon feito na rocha encontra novos caminhos para a terra e para a água. É uma ideia que estão a testar, não algo que alguém possa já usar para avisar as pessoas.',
        ],
        sci: [
          'Ressalto elástico (H. F. Reid, 1910, depois do sismo de São Francisco de 1906): os blocos movem-se de forma constante, a falha fica bloqueada, a deformação acumula-se na rocha dos dois lados e liberta-se num deslize súbito. As camadas da maqueta dobram junto à falha enquanto ela carrega e endireitam-se, desniveladas, quando desliza.',
          'A hipótese do precursor: à medida que a tensão se aproxima da rotura, a rocha dilata com microfissuras (o modelo de dilatância e difusão de Scholz, Sykes e Aggarwal, 1973), expondo superfícies de grão novas de onde escapa o rádon-222 e abrindo caminhos para o gás e a água. Alguns ensaios de laboratório com rocha sob tensão mostram a emissão de rádon a subir antes da rotura; no terreno a relação não é constante.',
        ],
      },
    },
    record: {
      label: 'O registo do poço',
      verbs: { hut: 'Toca na cabana', folder: 'Toca numa pasta' },
      title: 'Um poço antes de Kobe',
      time: 'Tempo no registo',
      week: 'semana {n}',
      folders: { kobe: 'Kobe 1995', rain: 'Chuva forte', quiet: 'Um poço calmo', air: 'Pressão do ar' },
      screen: {
        kobe: { title: 'Rádon na água de um poço', line: 'Nishinomiya, a cerca de 30 km do epicentro' },
        rain: { title: 'Outro poço, depois de chuva forte', line: 'O rádon subiu, e não veio nenhum sismo' },
        quiet: { title: 'Outro poço, um sismo perto', line: 'O sismo veio, e o rádon ficou igual' },
        air: { title: 'Uma estação no solo e a pressão do ar', line: 'O rádon sobe quando a pressão do ar desce' },
        times: 'vezes o início',
        week: 'semana',
        peak: '8 jan.: mais de 10 vezes',
        quake: '17 jan.: o sismo de Kobe',
        quakeShort: 'sismo',
        rainWord: 'chuva',
        radon: 'rádon',
        pressure: 'pressão do ar',
        example: 'EXEMPLO',
        off: 'Toca na cabana para começar',
      },
      says: {
        on: { kid: 'A cabana envia por rádio as medições do poço. Fim de outubro de 1994: olha o rádon a começar a subir devagarinho.', sci: 'As medições começaram no fim de outubro de 1994. No fim de dezembro o rádon estava em cerca de quatro vezes o primeiro nível.' },
        peak: { kid: '8 de janeiro: mais de dez vezes o início! Nove dias antes do sismo. Depois voltou a descer.', sci: '8 de janeiro de 1995: o pico, mais de dez vezes o nível inicial, nove dias antes do sismo; depois desceu.' },
        quake: { kid: '17 de janeiro de 1995, às 5:46 da manhã: o sismo de Kobe. Foi terrível: morreram mais de 6000 pessoas, e depois o Japão tornou os seus prédios e planos muito mais seguros.', sci: '17 de janeiro de 1995, 05:46, hora local: o sismo de Hyogo-ken Nanbu (Kobe), Mw 6,9; morreram 6434 pessoas. Depois disso o rádon deste poço manteve-se baixo.' },
        rain: { kid: 'O rádon deste poço subiu depois de dias de chuva forte, e não veio nenhum sismo. A água que se infiltra na terra muda a maneira como o gás se move.', sci: 'Uma subida depois de chuva intensa: a infiltração muda a humidade do solo e o fluxo das águas subterrâneas, e com eles o rádon. Não se seguiu nenhum sismo.' },
        quiet: { kid: 'Aqui veio um sismo, mas o rádon não mudou nada.', sci: 'Um sismo sem anomalia de rádon: o caso mais comum.' },
        air: { kid: 'Sobe e desce, sobe e desce: quando a pressão do ar desce, sai mais gás da terra; quando sobe, sai menos.', sci: 'O rádon contra a pressão atmosférica: a pressão a descer puxa o gás do solo para fora, a pressão a subir empurra ar para dentro.' },
        all: { kid: 'Então um poço sozinho não te pode dizer nada. É por isso que os cientistas continuam a medir e a comparar.', sci: 'Um registo sozinho não prova nada: um precursor tem de se distinguir da chuva, da pressão, das marés e da bombagem, e tem de aparecer antes de muitos sismos, não de um.' },
      },
      tip: 'Toca na cabana para mostrar o registo, arrasta o cursor e toca numa pasta para ver outro registo.',
      buttons: { play: 'Mostrar o registo' },
      panel: {
        kid: [
          'Esta cabana mede o rádon na água de um poço. Antes do sismo de Kobe, no Japão, em 1995, um poço em Nishinomiya registou o rádon a subir durante semanas, até mais de dez vezes o início, e a descer outra vez mesmo antes do sismo.',
          'Parece um aviso! Mas as pastas guardam outros registos: o rádon pode subir depois da chuva e subir e descer com a pressão do ar, e muitos sismos chegam sem mudança nenhuma. É por isso que um registo não chega.',
        ],
        sci: [
          'Igarashi et al., Science 269, 60 (1995): o rádon nas águas subterrâneas de um poço em Nishinomiya, a cerca de 30 km do epicentro, subiu cerca de quatro vezes do fim de outubro ao fim de dezembro de 1994, atingiu o pico a 8 de janeiro de 1995 com mais de dez vezes o nível inicial e depois desceu, nove dias antes do sismo de 17 de janeiro (Mw 6,9). A curva segue esses números; as pequenas oscilações de dia para dia são desenhadas, não medidas.',
          'As outras três pastas são exemplos, não poços reais, do que estes registos também mostram: subidas depois de chuva intensa, sismos sem anomalia e oscilações com a pressão atmosférica (as marés e a bombagem também mexem no rádon). As revisões encontram anomalias antes de alguns sismos, mas não de forma constante, por isso o rádon não é usado para os prever.',
        ],
      },
    },
    probe: {
      label: 'Encontrar a falha',
      verbs: { first: 'Toca num ponto marcado', more: 'Toca noutro ponto', done: 'Toca em qualquer ponto' },
      title: 'Uma falha encontrada pelo rádon',
      pos: 'Posição ao longo da linha',
      unit: 'kBq/m³',
      map: { title: 'Onde está a falha?', count: 'Pontos medidos: {n} de 5', found: 'a linha escondida da falha', trench: 'trincheira', line: 'linha da sonda' },
      says: {
        first: { kid: 'Lá entra a sonda, mais ou menos tão fundo como o comprimento do teu braço. O medidor aspira gás da terra e conta o seu rádon.', sci: 'A sonda entra cerca de 0,8 m no solo; uma bomba aspira o gás do solo para o detetor, que conta os decaimentos alfa do rádon.' },
        high: { kid: 'Uau, aqui há muito mais! A terra está rachada ao longo da falha, por isso o gás lá de baixo sobe mais depressa.', sci: 'Um máximo claro: ao longo de uma falha a zona fraturada deixa o gás do solo subir mais depressa, por isso menos rádon decai pelo caminho.' },
        low: { kid: 'Aqui há só um bocadinho de rádon. Experimenta mais pontos ao longo da linha.', sci: 'Nível de fundo. Continua ao longo do perfil.' },
        found: { kid: 'Cinco pontos! Liga o mais alto à falha da trincheira, e aí está a linha escondida da falha através do campo.', sci: 'Com cinco medições a anomalia é clara: ligada à trincheira, traça a falha por baixo do campo.' },
        hint: { kid: 'Cinco pontos, mas ainda nenhuma medição alta. Experimenta outros pontos ao longo da linha.', sci: 'Ainda nenhuma anomalia nestas medições: prolonga o perfil.' },
      },
      tip: 'Toca num ponto marcado, ou arrasta a sonda ao longo da linha.',
      buttons: { all: 'Medir todos os pontos marcados', clear: 'Começar um novo levantamento' },
      panel: {
        kid: [
          'Nem sempre é fácil ver as falhas: a relva e a terra tapam-nas. Mas o chão ao longo de uma falha está cheio de fendas, e o rádon lá de baixo sobe por elas mais depressa. Por isso uma linha de medições de rádon através de um campo mostra uma subida mesmo onde está a falha.',
          'Os geólogos fazem mesmo isto, para cartografar falhas antes de construir e para procurar urânio, o metal de onde vem o rádon. Isto funciona: não prevê sismos, mostra onde estão as falhas.',
        ],
        sci: [
          'Levantamentos de rádon no gás do solo: uma sonda oca a cerca de 0,5 a 1 m de profundidade, o gás do solo bombeado para um detetor (uma câmara de ionização ou uma célula de cintilação), medições em kBq/m³ ao longo de perfis que atravessam o traço suspeito. As zonas de falha fraturadas são mais permeáveis, por isso o gás sobe mais depressa do que o rádon-222 (meia-vida de 3,82 dias) decai: máximos estreitos de várias vezes o fundo marcam a falha.',
          'As medições deste campo são um exemplo. O método é usado para cartografar falhas ativas (com trincheiras e geofísica) e na prospeção de urânio; as medições dependem também da humidade do solo, do tempo e dos gases que transportam o rádon, por isso os levantamentos repetem-se.',
        ],
      },
    },
  },
  pl: {
    title: 'Przy uskoku',
    greet: {
      kid: 'Cześć! Jesteśmy o zmierzchu w wiosce w Japonii, tuż obok uskoku, czyli pęknięcia, gdzie stykają się ogromne bloki skalne. Czy gaz może ostrzec przed trzęsieniem ziemi? Wypróbuj model uskoku, budkę przy studni i sondę. Historia obrazka jest na sztaludze.',
      sci: 'Wioska na zboczu w Japonii o zmierzchu, obok aktywnego uskoku, przez który przekopano rów. Trzy stanowiska: badana hipoteza, najbardziej znany zapis i zastosowanie, które działa. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Powstaję z malutkich ilości uranu w skałach. Jestem gazem, więc przesączam się szczelinami do gleby i do wody w studniach.',
        'Nikt jeszcze nie umie przewidywać trzęsień ziemi. W Japonii ludzie chronią się dzięki mocnym budynkom, ćwiczeniom w szkole i mapom uskoków.',
        'Radon w studni rośnie i spada z wielu powodów: przez deszcz, ciśnienie powietrza, pompowanie. Dlatego naukowcy porównują wiele zapisów.',
      ],
      sci: [
        'Radon-222 ma okres półtrwania 3,82 dnia, więc to, co mierzy studnia albo sonda w glebie, powstało niedawno w skale w pobliżu.',
        'Jeden z pierwszych zapisów radonu powiązanych z trzęsieniem ziemi pochodzi z głębokich studni w Taszkencie, sprzed trzęsienia w 1966 roku.',
        'Japonia kartuje swoje aktywne uskoki i podaje prawdopodobieństwo silnego trzęsienia w ciągu 30 lat, nigdy datę. Jej system wczesnego ostrzegania, publiczny od 2007 roku, daje kilka sekund, gdy trzęsienie już się zaczęło.',
      ],
    },
    signs: { fault: 'uskok', trench: 'rów przez uskok' },
    fault: {
      label: 'Model uskoku',
      verbs: { first: 'Dotknij czerwonych strzałek', more: 'Pchnij mocniej', again: 'Pchnij jeszcze raz' },
      title: 'Dwa bloki, jeden uskok',
      push: 'Jak mocno bloki na siebie naciskają',
      gauge: { push: 'nacisk', limit: 'granica', radon: 'ucieka radon' },
      says: {
        push: { kid: 'Pchnij! Bloki naciskają mocniej, ale uskok się zaciął, więc skała trochę się wygina. Patrz na warstwy.', sci: 'Naprężenie rośnie, a uskok pozostaje zablokowany: skała po obu stronach odkształca się sprężyście, a warstwy wyginają się przy uskoku.' },
        cracks: { kid: 'Patrz: malutkie pęknięcia przy uskoku i więcej uciekającego radonu! Przynajmniej taką hipotezę sprawdzają naukowcy.', sci: 'Blisko zniszczenia mogą otwierać się mikropęknięcia, odsłaniając świeże powierzchnie ziaren i nowe drogi dla gazu: mogłoby uciekać więcej radonu. To hipoteza, wciąż sprawdzana.' },
        slip: { kid: 'Ojej, przesunęło się! To szarpnięcie to trzęsienie ziemi. Pęknięcia się zamykają, a radon wraca do normy.', sci: 'Uskok się przesuwa: zgromadzone odkształcenie uwalnia się naraz (odbicie sprężyste). Pęknięcia się zamykają, a wyciek wraca do poziomu tła.' },
        again: { kid: 'Kolejne przesunięcie! Zobacz, warstwy po obu stronach uskoku już do siebie nie pasują, jak w rowie.', sci: 'Każde przesunięcie zwiększa przemieszczenie warstw, co widać na ścianach rowu.' },
      },
      tip: 'Dotknij czerwonych strzałek, żeby pchać, albo przesuń suwak.',
      buttons: { push: 'Pchnij mocniej', limit: 'Pchnij do granicy' },
      panel: {
        kid: [
          'Głęboko pod ziemią dwa ogromne bloki skalne stykają się na uskoku. Bardzo powoli przesuwają się względem siebie, ale uskok się zacina, więc skała się wygina i gromadzi nacisk, jak wygięta linijka. Kiedy nie może już wytrzymać, nagle się przesuwa: to trzęsienie ziemi.',
          'Niektórzy naukowcy myślą, że tuż przedtem ściśnięta skała dostaje malutkich pęknięć, a radon powstający w skale znajduje nowe drogi do gleby i wody. To hipoteza, którą sprawdzają, a nie coś, czego ktoś mógłby już używać do ostrzegania ludzi.',
        ],
        sci: [
          'Odbicie sprężyste (H. F. Reid, 1910, po trzęsieniu ziemi w San Francisco w 1906 roku): bloki przesuwają się stale, uskok pozostaje zablokowany, odkształcenie gromadzi się w skale po obu stronach i uwalnia się w nagłym przesunięciu. Warstwy modelu wyginają się przy uskoku, gdy rośnie naprężenie, i prostują się, przesunięte, gdy uskok się ruszy.',
          'Hipoteza zwiastuna: gdy naprężenie zbliża się do granicy wytrzymałości, skała zwiększa objętość przez mikropęknięcia (model dylatancji i dyfuzji Scholza, Sykesa i Aggarwala, 1973), odsłaniając świeże powierzchnie ziaren, z których ucieka radon-222, i otwierając drogi dla gazu i wody. Niektóre badania laboratoryjne naprężonej skały pokazują wzrost emisji radonu przed zniszczeniem; w terenie ten związek nie jest regularny.',
        ],
      },
    },
    record: {
      label: 'Zapis ze studni',
      verbs: { hut: 'Dotknij budki', folder: 'Dotknij teczki' },
      title: 'Jedna studnia przed Kobe',
      time: 'Czas na zapisie',
      week: 'tydzień {n}',
      folders: { kobe: 'Kobe 1995', rain: 'Ulewa', quiet: 'Spokojna studnia', air: 'Ciśnienie' },
      screen: {
        kobe: { title: 'Radon w wodzie z jednej studni', line: 'Nishinomiya, około 30 km od epicentrum' },
        rain: { title: 'Inna studnia, po ulewnym deszczu', line: 'Radon wzrósł, a trzęsienie nie przyszło' },
        quiet: { title: 'Inna studnia, trzęsienie w pobliżu', line: 'Trzęsienie przyszło, a radon się nie zmienił' },
        air: { title: 'Stacja w glebie i ciśnienie powietrza', line: 'Radon rośnie, gdy ciśnienie spada' },
        times: 'razy więcej niż na początku',
        week: 'tydzień',
        peak: '8 sty: ponad 10 razy',
        quake: '17 sty: trzęsienie w Kobe',
        quakeShort: 'trzęsienie',
        rainWord: 'deszcz',
        radon: 'radon',
        pressure: 'ciśnienie powietrza',
        example: 'PRZYKŁAD',
        off: 'Dotknij budki, żeby zacząć',
      },
      says: {
        on: { kid: 'Budka wysyła pomiary ze studni przez radio. Koniec października 1994: patrz, jak radon zaczyna powoli rosnąć.', sci: 'Pomiary zaczęły się pod koniec października 1994 roku. Pod koniec grudnia radonu było około cztery razy więcej niż na początku.' },
        peak: { kid: '8 stycznia: ponad dziesięć razy więcej niż na początku! Dziewięć dni przed trzęsieniem. Potem znów spadł.', sci: '8 stycznia 1995: szczyt, ponad dziesięciokrotność poziomu początkowego, dziewięć dni przed trzęsieniem; potem spadał.' },
        quake: { kid: '17 stycznia 1995, o 5:46 rano: trzęsienie ziemi w Kobe. Było straszne: zginęło ponad 6000 osób, a potem Japonia sprawiła, że jej budynki i plany są dużo bezpieczniejsze.', sci: '17 stycznia 1995, 5:46 czasu lokalnego: trzęsienie Hyogo-ken Nanbu (Kobe), Mw 6,9; zginęły 6434 osoby. Potem radon w tej studni pozostał niski.' },
        rain: { kid: 'Radon w tej studni wzrósł po kilku dniach ulewnego deszczu, a trzęsienie nie przyszło. Woda wsiąkająca w ziemię zmienia to, jak porusza się gaz.', sci: 'Wzrost po ulewnych opadach: infiltracja zmienia wilgotność gleby i przepływ wód podziemnych, a razem z nimi radon. Żadne trzęsienie nie nastąpiło.' },
        quiet: { kid: 'Tutaj przyszło trzęsienie ziemi, a radon wcale się nie zmienił.', sci: 'Trzęsienie bez anomalii radonu: najczęstszy przypadek.' },
        air: { kid: 'W górę i w dół, w górę i w dół: gdy ciśnienie powietrza spada, z ziemi wydostaje się więcej gazu, a gdy rośnie, mniej.', sci: 'Radon a ciśnienie atmosferyczne: spadające ciśnienie wyciąga gaz glebowy na zewnątrz, rosnące wtłacza powietrze do gleby.' },
        all: { kid: 'Czyli jedna studnia nic ci nie powie. Dlatego naukowcy ciągle mierzą i porównują.', sci: 'Jeden zapis niczego nie dowodzi: zwiastun trzeba odróżnić od deszczu, ciśnienia, pływów i pompowania, i musi pojawiać się przed wieloma trzęsieniami, nie przed jednym.' },
      },
      tip: 'Dotknij budki, żeby odtworzyć zapis, przesuń suwak i dotknij teczki, żeby zobaczyć inny zapis.',
      buttons: { play: 'Odtwórz zapis' },
      panel: {
        kid: [
          'Ta budka mierzy radon w wodzie ze studni. Przed trzęsieniem ziemi w Kobe w Japonii w 1995 roku studnia w Nishinomiya zapisała, jak radon rósł przez wiele tygodni, do ponad dziesięciu razy więcej niż na początku, i znów spadał tuż przed trzęsieniem.',
          'Wygląda jak ostrzeżenie! Ale w teczkach są inne zapisy: radon może rosnąć po deszczu i wahać się razem z ciśnieniem powietrza, a wiele trzęsień przychodzi bez żadnej zmiany. Dlatego jeden zapis nie wystarczy.',
        ],
        sci: [
          'Igarashi i in., Science 269, 60 (1995): radon w wodzie podziemnej ze studni w Nishinomiya, około 30 km od epicentrum, wzrósł mniej więcej czterokrotnie od końca października do końca grudnia 1994 roku, osiągnął szczyt 8 stycznia 1995 roku, ponad dziesięciokrotność poziomu początkowego, a potem spadał, dziewięć dni przed trzęsieniem ziemi z 17 stycznia (Mw 6,9). Krzywa idzie za tymi liczbami; jej drobne wahania z dnia na dzień są narysowane, nie zmierzone.',
          'Pozostałe trzy teczki to przykłady, nie prawdziwe studnie, tego, co takie zapisy też pokazują: wzrosty po ulewnych deszczach, trzęsienia bez anomalii i wahania z ciśnieniem atmosferycznym (pływy i pompowanie też zmieniają radon). Przeglądy badań znajdują anomalie przed niektórymi trzęsieniami, ale nie regularnie, dlatego radonu nie używa się do ich przewidywania.',
        ],
      },
    },
    probe: {
      label: 'Szukanie uskoku',
      verbs: { first: 'Dotknij zaznaczonego miejsca', more: 'Dotknij innego miejsca', done: 'Dotknij dowolnego miejsca' },
      title: 'Uskok znaleziony po radonie',
      pos: 'Położenie na linii',
      unit: 'kBq/m³',
      map: { title: 'Gdzie jest uskok?', count: 'Zmierzone miejsca: {n} z 5', found: 'ukryta linia uskoku', trench: 'rów', line: 'linia sondy' },
      says: {
        first: { kid: 'Sonda wchodzi w ziemię mniej więcej na długość twojej ręki. Miernik zasysa gaz z gleby i liczy jego radon.', sci: 'Sonda wchodzi na około 0,8 m w glebę; pompa zasysa gaz glebowy do detektora, który liczy rozpady alfa radonu.' },
        high: { kid: 'Ojej, tu jest dużo więcej! Ziemia wzdłuż uskoku jest popękana, więc gaz z głębi wydostaje się szybciej.', sci: 'Wyraźne maksimum: wzdłuż uskoku spękana strefa pozwala gazowi glebowemu szybciej się wznosić, więc mniej radonu rozpada się po drodze.' },
        low: { kid: 'Tu jest tylko trochę radonu. Spróbuj więcej miejsc na linii.', sci: 'Poziom tła. Idź dalej wzdłuż profilu.' },
        found: { kid: 'Pięć miejsc! Połącz najwyższy pomiar z uskokiem w rowie, a zobaczysz ukrytą linię uskoku w poprzek pola.', sci: 'Przy pięciu pomiarach anomalia jest wyraźna: połączona z rowem wyznacza uskok pod polem.' },
        hint: { kid: 'Pięć miejsc, ale jeszcze żadnego wysokiego pomiaru. Spróbuj innych miejsc na linii.', sci: 'W tych pomiarach nie ma jeszcze anomalii: przedłuż profil.' },
      },
      tip: 'Dotknij zaznaczonego miejsca albo przesuń sondę wzdłuż linii.',
      buttons: { all: 'Zmierz wszystkie zaznaczone miejsca', clear: 'Zacznij nowe pomiary' },
      panel: {
        kid: [
          'Uskoki nie zawsze łatwo zobaczyć: przykrywa je trawa i gleba. Ale ziemia wzdłuż uskoku jest pełna pęknięć, a radon z głębi przemyka nimi w górę szybciej. Dlatego linia pomiarów radonu w poprzek pola pokazuje górkę właśnie tam, gdzie jest uskok.',
          'Geolodzy naprawdę tak robią, żeby zaznaczyć uskoki na mapie przed budową i żeby szukać uranu, metalu, z którego powstaje radon. To działa: nie przewiduje trzęsień, ale pokazuje, gdzie są uskoki.',
        ],
        sci: [
          'Pomiary radonu w gazie glebowym: wydrążona sonda na głębokości około 0,5 do 1 m, gaz glebowy pompowany do detektora (komory jonizacyjnej albo komórki scyntylacyjnej), wyniki w kBq/m³ wzdłuż profili przecinających domniemany przebieg uskoku. Spękane strefy uskoków są bardziej przepuszczalne, więc gaz wznosi się szybciej, niż rozpada się radon-222 (okres półtrwania 3,82 dnia): wąskie maksima kilka razy wyższe od tła wyznaczają uskok.',
          'Wyniki na tym polu są przykładem. Metodę stosuje się do kartowania aktywnych uskoków (razem z rowami i geofizyką) i w poszukiwaniach uranu; wyniki zależą też od wilgotności gleby, pogody i gazów niosących radon, dlatego pomiary się powtarza.',
        ],
      },
    },
  },
  de: {
    title: 'An der Verwerfung',
    greet: {
      kid: 'Hallo! Wir sind in der Abenddämmerung in einem Dorf in Japan, direkt neben einer Verwerfung, einem Riss, an dem riesige Gesteinsblöcke aufeinandertreffen. Kann ein Gas vor Erdbeben warnen? Probier das Verwerfungsmodell, die Brunnenhütte und die Sonde aus. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Ein Dorf an einem Hang in Japan in der Abenddämmerung, neben einer aktiven Verwerfung, quer durch die ein Graben gezogen ist. Drei Stationen: die Idee, die getestet wird, die bekannteste Aufzeichnung und eine Anwendung, die funktioniert. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Ich entstehe aus winzigen Mengen Uran im Gestein. Ich bin ein Gas, also sickere ich durch Risse nach oben in den Boden und ins Brunnenwasser.',
        'Niemand kann Erdbeben bisher vorhersagen. In Japan schützen sich die Menschen mit stabilen Häusern, Übungen in der Schule und Karten, die zeigen, wo die Verwerfungen sind.',
        'Das Radon in einem Brunnen steigt und fällt aus vielen Gründen: Regen, Luftdruck, Pumpen. Deshalb vergleichen Forscher viele Aufzeichnungen.',
      ],
      sci: [
        'Radon-222 hat eine Halbwertszeit von 3,82 Tagen; was ein Brunnen oder eine Bodensonde misst, ist also kürzlich in Gestein ganz in der Nähe entstanden.',
        'Eine der ersten Radon-Aufzeichnungen, die mit einem Erdbeben in Verbindung gebracht wurde, stammt aus tiefen Brunnen in Taschkent, vor dem Erdbeben von 1966.',
        'Japan kartiert seine aktiven Verwerfungen und gibt die Wahrscheinlichkeit eines starken Bebens in 30 Jahren an, nie ein Datum. Seine Erdbebenfrühwarnung, öffentlich seit 2007, gibt Sekunden Vorlauf, wenn ein Beben schon begonnen hat.',
      ],
    },
    signs: { fault: 'die Verwerfung', trench: 'Graben quer zur Verwerfung' },
    fault: {
      label: 'Das Verwerfungsmodell',
      verbs: { first: 'Tippe auf die roten Pfeile', more: 'Drück fester', again: 'Drück noch einmal' },
      title: 'Zwei Blöcke, eine Verwerfung',
      push: 'Wie fest die Blöcke drücken',
      gauge: { push: 'Druck', limit: 'Grenze', radon: 'Radon tritt aus' },
      says: {
        push: { kid: 'Drück! Die Blöcke pressen fester, aber die Verwerfung klemmt, also biegt sich das Gestein ein bisschen. Schau auf die Schichten.', sci: 'Die Spannung wächst, während die Verwerfung verhakt bleibt: Das Gestein auf beiden Seiten verformt sich elastisch, und die Schichten biegen sich nahe der Verwerfung.' },
        cracks: { kid: 'Schau: winzige Risse an der Verwerfung, und mehr Radon kommt heraus! Jedenfalls ist das die Idee, die Forscher testen.', sci: 'Kurz vor dem Bruch könnten sich Mikrorisse öffnen, frische Kornoberflächen freilegen und neue Wege für Gas schaffen: Mehr Radon könnte entweichen. Eine Hypothese, die noch getestet wird.' },
        slip: { kid: 'Huch, es ist gerutscht! Dieser Ruck ist ein Erdbeben. Die Risse schließen sich, und das Radon geht wieder auf normal zurück.', sci: 'Die Verwerfung rutscht: Die gespeicherte Verformung wird auf einmal frei (elastischer Rückprall). Die Risse schließen sich, und der Austritt fällt auf seinen Hintergrund zurück.' },
        again: { kid: 'Noch ein Rutsch! Sieh mal, die Schichten passen auf beiden Seiten der Verwerfung nicht mehr zusammen, wie im Graben.', sci: 'Jeder Rutsch vergrößert den Versatz der Schichten, wie die Grabenwände zeigen.' },
      },
      tip: 'Tippe auf die roten Pfeile, um zu drücken, oder zieh den Regler.',
      buttons: { push: 'Fester drücken', limit: 'Bis zur Grenze drücken' },
      panel: {
        kid: [
          'Tief unter der Erde treffen zwei riesige Gesteinsblöcke an einer Verwerfung aufeinander. Sie werden ganz langsam aneinander vorbeigeschoben, aber die Verwerfung klemmt, also biegt sich das Gestein und speichert den Druck, wie ein Lineal, das du biegst. Wenn es nicht mehr hält, rutscht es auf einmal: ein Erdbeben.',
          'Manche Forscher denken, dass das gepresste Gestein kurz davor winzige Risse bekommt und das Radon aus dem Gestein neue Wege in Boden und Wasser findet. Das ist eine Idee, die sie testen, nichts, womit man Menschen schon warnen könnte.',
        ],
        sci: [
          'Elastischer Rückprall (H. F. Reid, 1910, nach dem Erdbeben von San Francisco 1906): Die Blöcke bewegen sich stetig, die Verwerfung bleibt verhakt, die Verformung sammelt sich im Gestein auf beiden Seiten und wird in einem plötzlichen Rutsch frei. Die Schichten des Modells biegen sich nahe der Verwerfung, während sie sich auflädt, und schnellen versetzt gerade, wenn sie rutscht.',
          'Die Vorläufer-Hypothese: Nähert sich die Spannung dem Bruch, dehnt sich das Gestein durch Mikrorisse aus (das Dilatanz-Diffusions-Modell von Scholz, Sykes und Aggarwal, 1973), legt frische Kornoberflächen frei, aus denen Radon-222 entweicht, und öffnet Wege für Gas und Wasser. Manche Laborversuche mit belastetem Gestein zeigen steigende Radonabgabe vor dem Bruch; im Gelände ist der Zusammenhang nicht verlässlich.',
        ],
      },
    },
    record: {
      label: 'Die Aufzeichnung des Brunnens',
      verbs: { hut: 'Tippe auf die Hütte', folder: 'Tippe auf eine Mappe' },
      title: 'Ein Brunnen vor Kobe',
      time: 'Zeit auf der Aufzeichnung',
      week: 'Woche {n}',
      folders: { kobe: 'Kobe 1995', rain: 'Starkregen', quiet: 'Ein ruhiger Brunnen', air: 'Luftdruck' },
      screen: {
        kobe: { title: 'Radon im Wasser eines Brunnens', line: 'Nishinomiya, etwa 30 km vom Epizentrum' },
        rain: { title: 'Ein anderer Brunnen, nach Starkregen', line: 'Das Radon stieg, und kein Erdbeben kam' },
        quiet: { title: 'Ein anderer Brunnen, ein Erdbeben in der Nähe', line: 'Das Erdbeben kam, und das Radon blieb gleich' },
        air: { title: 'Eine Bodenstation und der Luftdruck', line: 'Radon steigt, wenn der Luftdruck fällt' },
        times: 'mal so viel wie am Anfang',
        week: 'Woche',
        peak: '8. Jan.: mehr als 10-mal',
        quake: '17. Jan.: das Kobe-Erdbeben',
        quakeShort: 'Erdbeben',
        rainWord: 'Regen',
        radon: 'Radon',
        pressure: 'Luftdruck',
        example: 'BEISPIEL',
        off: 'Tippe auf die Hütte, um zu starten',
      },
      says: {
        on: { kid: 'Die Hütte schickt die Messwerte des Brunnens per Funk. Ende Oktober 1994: Schau, wie das Radon langsam zu steigen beginnt.', sci: 'Die Messungen begannen Ende Oktober 1994. Ende Dezember lag das Radon bei etwa dem Vierfachen des ersten Werts.' },
        peak: { kid: '8. Januar: mehr als zehnmal so viel wie am Anfang! Neun Tage vor dem Erdbeben. Danach sank es wieder.', sci: '8. Januar 1995: der Höchstwert, mehr als das Zehnfache des Anfangswerts, neun Tage vor dem Erdbeben; danach sank er.' },
        quake: { kid: '17. Januar 1995, 5:46 Uhr morgens: das Erdbeben von Kobe. Es war schrecklich: Mehr als 6000 Menschen starben, und danach hat Japan seine Häuser und Pläne viel sicherer gemacht.', sci: '17. Januar 1995, 5:46 Uhr Ortszeit: das Hyogo-ken-Nanbu-Erdbeben (Kobe), Mw 6,9; 6434 Menschen starben. Danach blieb das Radon in diesem Brunnen niedrig.' },
        rain: { kid: 'Das Radon in diesem Brunnen stieg nach Tagen mit starkem Regen, und kein Erdbeben kam. Wasser, das in den Boden sickert, verändert, wie sich das Gas bewegt.', sci: 'Ein Anstieg nach Starkregen: Versickerung ändert die Bodenfeuchte und den Grundwasserfluss und damit das Radon. Kein Erdbeben folgte.' },
        quiet: { kid: 'Hier kam ein Erdbeben, aber das Radon hat sich gar nicht verändert.', sci: 'Ein Erdbeben ohne Radonanomalie: der häufige Fall.' },
        air: { kid: 'Rauf und runter, rauf und runter: Wenn der Luftdruck fällt, atmet der Boden mehr Gas aus; wenn er steigt, weniger.', sci: 'Radon gegen Luftdruck: Fallender Druck zieht Bodenluft heraus, steigender drückt Luft hinein.' },
        all: { kid: 'Ein Brunnen allein kann es dir also nicht sagen. Deshalb messen und vergleichen Forscher immer weiter.', sci: 'Eine Aufzeichnung allein beweist nichts: Ein Vorläufer muss sich von Regen, Luftdruck, Gezeiten und Pumpen unterscheiden lassen und vor vielen Erdbeben auftreten, nicht vor einem.' },
      },
      tip: 'Tippe auf die Hütte, um die Aufzeichnung abzuspielen, zieh den Regler und tippe auf eine Mappe für eine andere Aufzeichnung.',
      buttons: { play: 'Aufzeichnung abspielen' },
      panel: {
        kid: [
          'Diese Hütte misst das Radon im Wasser eines Brunnens. Vor dem Erdbeben von Kobe in Japan 1995 zeichnete ein Brunnen in Nishinomiya auf, wie das Radon wochenlang stieg, auf mehr als das Zehnfache des Anfangs, und kurz vor dem Beben wieder sank.',
          'Das sieht aus wie eine Warnung! Aber in den Mappen stecken andere Aufzeichnungen: Radon kann nach Regen steigen und mit dem Luftdruck auf und ab gehen, und viele Erdbeben kommen ganz ohne Veränderung. Deshalb reicht eine Aufzeichnung nicht.',
        ],
        sci: [
          'Igarashi u. a., Science 269, 60 (1995): Radon im Grundwasser eines Brunnens in Nishinomiya, etwa 30 km vom Epizentrum, stieg von Ende Oktober bis Ende Dezember 1994 etwa auf das Vierfache, erreichte am 8. Januar 1995 mehr als das Zehnfache des Anfangswerts und sank dann, neun Tage vor dem Erdbeben vom 17. Januar (Mw 6,9). Die Kurve folgt diesen Zahlen; ihre kleinen Schwankungen von Tag zu Tag sind gezeichnet, nicht gemessen.',
          'Die anderen drei Mappen sind Beispiele, keine echten Brunnen, für das, was solche Aufzeichnungen auch zeigen: Anstiege nach Starkregen, Erdbeben ohne Anomalie und Schwankungen mit dem Luftdruck (auch Gezeiten und Pumpen verändern Radon). Übersichtsarbeiten finden Anomalien vor manchen Erdbeben, aber nicht verlässlich, deshalb wird Radon nicht zur Vorhersage genutzt.',
        ],
      },
    },
    probe: {
      label: 'Die Verwerfung finden',
      verbs: { first: 'Tippe auf eine markierte Stelle', more: 'Tippe auf eine andere Stelle', done: 'Tippe auf irgendeine Stelle' },
      title: 'Eine Verwerfung, gefunden durch ihr Radon',
      pos: 'Position entlang der Linie',
      unit: 'kBq/m³',
      map: { title: 'Wo ist die Verwerfung?', count: 'Gemessene Stellen: {n} von 5', found: 'die verborgene Linie der Verwerfung', trench: 'Graben', line: 'Sondenlinie' },
      says: {
        first: { kid: 'Die Sonde geht in den Boden, ungefähr so tief, wie dein Arm lang ist. Das Messgerät saugt Gas aus dem Boden und zählt sein Radon.', sci: 'Die Sonde geht etwa 0,8 m in den Boden; eine Pumpe saugt Bodenluft in den Detektor, der die Alphazerfälle des Radons zählt.' },
        high: { kid: 'Wow, hier ist viel mehr! Der Boden entlang der Verwerfung ist voller Risse, also kommt Gas aus der Tiefe schneller herauf.', sci: 'Ein klarer Höchstwert: Entlang einer Verwerfung lässt die zerrüttete Zone Bodenluft schneller aufsteigen, also zerfällt unterwegs weniger von ihrem Radon.' },
        low: { kid: 'Hier ist nur ein bisschen Radon. Probier mehr Stellen entlang der Linie.', sci: 'Hintergrundwert. Mach weiter entlang des Profils.' },
        found: { kid: 'Fünf Stellen! Verbinde die höchste mit der Verwerfung im Graben, und da ist die verborgene Linie der Verwerfung quer über das Feld.', sci: 'Mit fünf Messwerten ist die Anomalie klar: Mit dem Graben verbunden, zeichnet sie die Verwerfung unter dem Feld nach.' },
        hint: { kid: 'Fünf Stellen, aber noch kein hoher Wert. Probier andere Stellen entlang der Linie.', sci: 'Noch keine Anomalie in diesen Messwerten: Verlängere das Profil.' },
      },
      tip: 'Tippe auf eine markierte Stelle oder zieh die Sonde entlang der Linie.',
      buttons: { all: 'Alle markierten Stellen messen', clear: 'Neue Messreihe beginnen' },
      panel: {
        kid: [
          'Verwerfungen sind nicht immer leicht zu sehen: Gras und Erde bedecken sie. Aber der Boden entlang einer Verwerfung ist voller Risse, und Radon aus der Tiefe schlüpft darin schneller nach oben. Darum zeigt eine Reihe von Radonmessungen quer über ein Feld einen Buckel genau dort, wo die Verwerfung ist.',
          'Geologen machen das wirklich, um Verwerfungen vor dem Bauen zu kartieren und um nach Uran zu suchen, dem Metall, aus dem Radon entsteht. Das funktioniert: Es sagt keine Erdbeben vorher, es zeigt, wo Verwerfungen sind.',
        ],
        sci: [
          'Radonmessungen in der Bodenluft: eine hohle Sonde in etwa 0,5 bis 1 m Tiefe, Bodenluft wird in einen Detektor gepumpt (eine Ionisationskammer oder eine Szintillationszelle), Messwerte in kBq/m³ entlang von Profilen quer zum vermuteten Verlauf. Zerrüttete Verwerfungszonen sind durchlässiger, also steigt Gas schneller auf, als Radon-222 (Halbwertszeit 3,82 Tage) zerfällt: schmale Höchstwerte von einem Mehrfachen des Hintergrunds markieren die Verwerfung.',
          'Die Messwerte auf diesem Feld sind ein Beispiel. Die Methode dient zum Kartieren aktiver Verwerfungen (mit Gräben und Geophysik) und zur Uransuche; die Werte hängen auch von Bodenfeuchte, Wetter und den Gasen ab, die das Radon tragen, deshalb werden Messungen wiederholt.',
        ],
      },
    },
  },
}
