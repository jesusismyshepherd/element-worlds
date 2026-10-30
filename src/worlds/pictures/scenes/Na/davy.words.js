// The words of sodium's Davy room ("1807: a metal nobody had ever seen"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Na.js (the easel shows it); the room shows it happening and adds to it.
// Sources: Davy's Bakerian Lecture read on 19 November 1807 (Phil. Trans. 98, 1808): the batteries, the
// platinum disc, "the power of 250", the globules and the "jets of fire" are his words; the footnote there
// gives potassium on 6 October 1807 and sodium a few days after (his notebook gives other days, so the
// room says "October 1807"). Edmund Davy's account ("bounded about the room in ecstatic delight") is in
// John Davy's Memoirs of the Life of Sir Humphry Davy. Placeholders: {pairs} (pairs of plates), {n}.
export const DAVY_WORDS = {
  en: {
    title: 'Davy\'s laboratory, 1807',
    greet: {
      kid: 'We are inside the picture: the basement laboratory of the Royal Institution in London, in 1807, lit by candles. Here Humphry Davy pulled a brand new metal out of soda with electricity. The picture\'s story is on the easel beside you.',
      sci: 'The Royal Institution\'s basement laboratory, Albemarle Street, London, autumn 1807: troughs of copper and zinc plates, an insulated platinum disc and a lump of moist caustic soda. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Chemists guessed that a metal was hiding inside soda and potash, but no fire could get it out. Davy tried electricity.',
        'Davy was only 28. Later he invented a safety lamp that saved the lives of many miners.',
        'A young bookbinder called Michael Faraday came to Davy\'s lectures here and became his assistant. He grew up to be one of the greatest scientists of all.',
      ],
      sci: [
        'Lavoisier left potash and soda out of his table of simple substances in 1789, suspecting they were compounds. Davy showed that each holds a metal bound to oxygen.',
        'Davy was 28 in 1807. In 1815 he invented the miners\' safety lamp, whose wire gauze keeps its flame from lighting the gas outside.',
        'Michael Faraday, a bookbinder\'s apprentice, heard Davy lecture here in 1812 and became his assistant in 1813; he later discovered electromagnetic induction in this same building.',
      ],
    },
    battery: {
      label: 'The great battery',
      title: 'Troughs of copper and zinc',
      slate: 'pairs of plates',
      slider: 'Troughs filled',
      count: '{n} of 10 troughs, {pairs} pairs',
      hints: { first: 'Tap a trough to fill it with acid', more: 'Tap another trough ({pairs} pairs so far)', full: 'All 250 pairs! Tap a trough to empty it' },
      buttons: { next: 'Fill a trough', all: 'Fill them all', none: 'Empty them all' },
      says: {
        fill: { kid: 'In goes the acid, and the plates begin to fizz. {pairs} pairs of plates push together now.', sci: 'Trough charged with dilute acid: {pairs} copper-zinc pairs in series.' },
        drain: { kid: 'Emptied: that trough pushes no more. {pairs} pairs left.', sci: 'Trough drained: {pairs} pairs left in series.' },
        potash: { kid: '100 pairs: enough to split potash, Davy found. But will it split soda?', sci: '100 pairs, like Davy\'s battery of 100 plates of 6 inches: enough for potash.' },
        full: { kid: 'All ten troughs: 250 pairs of plates! That is the power Davy used to split soda.', sci: '250 pairs: "the power of 250", as Davy wrote, the batteries he used on soda.' },
        none: { kid: 'All the troughs are empty: no push at all.', sci: 'All troughs drained: no current.' },
      },
      panel: {
        kid: [
          'A battery is a row of cells. In each one a copper plate and a zinc plate stand in acid: the zinc slowly dissolves and pushes electricity round. One pair pushes only a little, but joined in a row their pushes add up. The Royal Institution had huge batteries with hundreds of pairs of plates.',
          'Tap the troughs to fill them. With few plates the push is weak; Davy needed his biggest batteries to get a metal out of soda. Acid burns, so it was poured with great care.',
        ],
        sci: [
          'A voltaic cell: zinc and copper in dilute acid. The zinc dissolves (Zn -> Zn2+ + 2 e−) and the electrons flow round the outer circuit; a copper-zinc pair gives about 1 volt. In a trough battery the double plates (copper soldered to zinc) are cemented into cells, so that the pairs are connected in series and their voltages add.',
          'The Royal Institution\'s batteries, as Davy listed them in his Bakerian Lecture: 24 plates of copper and zinc 12 inches square, 100 of 6 inches and 150 of 4 inches, charged with solutions of alum and nitric acid. He describes "the battery of the power of 250 of 6 and 4", and "the power of 250" for soda. Here ten troughs of 25 pairs stand for them: four of 6-inch plates (100 pairs) and six of 4-inch plates (150).',
        ],
      },
    },
    soda: {
      label: 'The soda and the wires',
      title: 'Splitting soda with electricity',
      hints: { touch: 'Tap the wire to touch it to the soda', weak: 'Too weak: fill more troughs, or tap the wire to lift it', watch: 'Watch the bottom of the lump', bead: 'Tap a shiny bead to look closer', atoms: 'Tap the lens to see the atoms', lens: 'Tap the lens to empty it' },
      buttons: { wire: 'Touch or lift the wire', bead: 'Look at a bead', atoms: 'Look at its atoms' },
      says: {
        none: { kid: 'Nothing happens: no electricity flows. Fill some troughs of the battery first!', sci: 'No current: the battery is not charged.' },
        warm: { kid: 'The soda only gets warm. The battery is far too weak.', sci: '{pairs} pairs: the current only warms the moist alkali.' },
        strong: { kid: 'Hot, but still no metal! This much would split potash, but soda holds on to its metal more tightly. Fill more troughs.', sci: '{pairs} pairs: hot, but no decomposition. Potash gave way to 100 pairs of 6-inch plates; soda "demanded greater intensity of action in the batteries", Davy wrote.' },
        splits: { kid: 'Look! Bubbles at the top, and tiny shiny beads at the bottom, like drops of mercury. Some burst into flame! That is sodium, a metal nobody had ever seen.', sci: 'The alkali fuses at both contacts: oxygen effervesces at the positive wire, and on the negative platinum globules with the lustre of mercury appear, some burning as they form. Sodium.' },
        lift: { kid: 'Wire up: the electricity stops, and so do the beads.', sci: 'Circuit open: the electrolysis stops.' },
        weaker: { kid: 'The battery got weaker, so no more beads come.', sci: 'Below 250 pairs the decomposition stops.' },
        bead: { kid: 'Through the lens: a bead of sodium, shiny like mercury. Watch: the air gives it a white skin.', sci: 'Fresh sodium has a silvery lustre; in air it tarnishes at once and a white crust forms on it (sodium hydroxide, then carbonate).' },
        atoms: { kid: 'Closer still: sodium atoms in neat rows. Each one lets go of one electron, and all the loose electrons are shared: that is what makes a metal shine.', sci: 'Body-centred cubic sodium, cube edge 429 pm: each atom gives its 3s electron to a shared sea of electrons, which makes the metal shine and conduct.' },
        close: { kid: 'The lens is empty again.', sci: 'Lens empty.' },
        noBeads: { kid: 'There are no beads to look at yet.', sci: 'No globules yet.' },
      },
      panel: {
        kid: [
          'Davy put a little lump of caustic soda, a bit damp so that electricity could pass through it, on a platinum dish joined to one end of the battery. A platinum wire from the other end touched its top. With enough plates the soda melted where the wires touched: bubbles of oxygen came off at the top, and at the bottom tiny shiny beads of sodium appeared. Some burst into bright flames.',
          'No fire could get sodium out of soda, because sodium holds on to oxygen so tightly: it took electricity. This is very dangerous! Hot caustic soda burns skin and sodium catches fire, so only chemists do it, in a laboratory, with protection.',
        ],
        sci: [
          'Davy\'s arrangement: slightly moist sodium hydroxide (dry, it does not conduct) on an insulated platinum disc joined to the negative pole, and a platinum wire from the positive pole on its upper surface. The alkali fuses at both contacts. At the positive wire, oxygen: 4 OH− -> O2 + 2 H2O + 4 e−. At the negative disc: Na+ + e− -> Na, in globules that are liquid in the hot alkali (sodium melts at 97.8 °C) and solid, with the lustre of silver, once cool.',
          'With "the power of 250", he wrote, the globules "often burnt at the moment of their formation", and some exploded into smaller ones that flew through the air, "producing a beautiful effect of continued jets of fire". Soda needed more than potash: with 100 pairs he could not decompose pieces of soda of more than 15 or 20 grains (about 1 g). Molten alkali and burning sodium are dangerous: done only by chemists, in a laboratory, with protection.',
        ],
      },
    },
    notebook: {
      label: 'Davy\'s desk',
      hints: { page: 'Tap the notebook to read on', downs: 'Tap the model of a Downs cell' },
      buttons: { page: 'Turn the page', downs: 'Run the Downs cell', stop: 'Stop the Downs cell' },
      pages: [
        {
          title: 'October 1807: potassium first',
          kid: ['Davy tried potash first, in October 1807: a white stuff made from wood ashes. When the first tiny shiny globules burst through its crust and caught fire, he was so happy that he jumped about the room for joy, his cousin Edmund remembered. Edmund was his assistant. That first new metal was potassium.'],
          sci: ['Potassium came first, in October 1807, from slightly moist potash (potassium hydroxide) on the same platinum disc. His cousin Edmund Davy, then his assistant in this laboratory, told how Humphry, seeing the minute globules burst through the crust of potash and take fire, "actually bounded about the room in ecstatic delight" (in the Memoirs written by his brother, John Davy).'],
        },
        {
          title: 'A few days later: sodium',
          kid: ['A few days later he tried caustic soda. It was harder: soda needed a stronger battery. Out came sodium, liquid while hot and shiny like silver once cool. On 19 November 1807 he told the Royal Society about both new metals, and named them after potash and soda: potassium and sodium.'],
          sci: ['Sodium followed a few days later: soda "demanded greater intensity of action in the batteries, or the alkali was required to be in much thinner and smaller pieces". The new metal was fluid at the heat of its formation, and solid with the lustre of silver when cool. In his Bakerian Lecture, read to the Royal Society on 19 November 1807, Davy announced both metals and named them after potash and soda.'],
        },
        {
          title: '1808: four more metals',
          kid: ['The next year, 1808, Davy used electricity again and found four more metals: magnesium, calcium, strontium and barium. There is calcium in your bones and in chalk!'],
          sci: ['In 1808 Davy electrolysed the moist earths with a mercury cathode, following a method of Berzelius and Pontin, and distilled the mercury from the amalgams: small, impure samples of magnesium, calcium, strontium and barium. In two years, electricity had given chemistry six new metals.'],
        },
      ],
    },
    downs: {
      title: 'Sodium today: the Downs cell (1924)',
      labels: { na: 'sodium', cl: 'chlorine', sign: 'Downs cell, 1924' },
      says: {
        on: { kid: 'Switched on: shiny sodium rises on one side, and yellow-green chlorine bubbles up on the other.', sci: 'Running: Na+ + e− -> Na at the iron cathode, 2 Cl− -> Cl2 + 2 e− at the graphite anode.' },
        off: { kid: 'Switched off.', sci: 'Current off.' },
      },
      panel: {
        kid: [
          'Sodium is still made with electricity today, but from melted salt, in big steel tanks called Downs cells (1924). Mixed with calcium chloride, the salt melts at about 600 °C instead of 801 °C, which saves a lot of heat.',
          'In the middle, electricity pulls chlorine, a yellow-green poisonous gas, out of the salt; all around it, liquid sodium forms, floats up and is piped away. A wire net keeps the two apart, or they would burn back into salt.',
        ],
        sci: [
          'The Downs cell (James C. Downs, 1924) electrolyses molten sodium chloride with calcium chloride added, which lowers the melting point from 801 °C to about 600 °C. Overall: 2 NaCl -> 2 Na + Cl2.',
          'A graphite anode in the middle: 2 Cl− -> Cl2 + 2 e−, the gas collected under a hood. An iron cathode around it: Na+ + e− -> Na; the liquid sodium, less dense than the melt, rises into a collector. A steel gauze diaphragm keeps the sodium and the chlorine from meeting again.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'O laboratório de Davy, 1807',
    greet: {
      kid: 'Estamos dentro da imagem: o laboratório na cave da Royal Institution, em Londres, em 1807, iluminado por velas. Foi aqui que Humphry Davy arrancou à soda um metal novinho em folha, com eletricidade. A história da imagem está no cavalete ao teu lado.',
      sci: 'O laboratório na cave da Royal Institution, Albemarle Street, Londres, outono de 1807: tinas com placas de cobre e zinco, um disco de platina isolado e um pedaço de soda cáustica húmida. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Os químicos desconfiavam que havia um metal escondido na soda e na potassa, mas nenhum fogo o conseguia tirar de lá. Davy experimentou a eletricidade.',
        'Davy tinha só 28 anos. Mais tarde inventou uma lâmpada de segurança que salvou a vida a muitos mineiros.',
        'Um jovem encadernador chamado Michael Faraday veio ouvir as palestras de Davy aqui e tornou-se seu assistente. Cresceu e tornou-se um dos maiores cientistas de sempre.',
      ],
      sci: [
        'Lavoisier deixou a potassa e a soda fora da sua tabela de substâncias simples, em 1789, por desconfiar que eram compostos. Davy mostrou que cada uma contém um metal ligado ao oxigénio.',
        'Davy tinha 28 anos em 1807. Em 1815 inventou a lâmpada de segurança dos mineiros, cuja rede de arame impede a chama de acender o gás lá fora.',
        'Michael Faraday, aprendiz de encadernador, ouviu Davy aqui em 1812 e tornou-se seu assistente em 1813; mais tarde descobriu a indução eletromagnética neste mesmo edifício.',
      ],
    },
    battery: {
      label: 'A grande bateria',
      title: 'Tinas de cobre e zinco',
      slate: 'pares de placas',
      slider: 'Tinas cheias',
      count: '{n} de 10 tinas, {pairs} pares',
      hints: { first: 'Toca numa tina para a encher de ácido', more: 'Toca noutra tina (já há {pairs} pares)', full: 'Os 250 pares! Toca numa tina para a esvaziar' },
      buttons: { next: 'Encher uma tina', all: 'Encher todas', none: 'Esvaziar todas' },
      says: {
        fill: { kid: 'Lá vai o ácido, e as placas começam a borbulhar. Agora {pairs} pares de placas empurram juntos.', sci: 'Tina carregada com ácido diluído: {pairs} pares de cobre e zinco em série.' },
        drain: { kid: 'Esvaziada: essa tina já não empurra. Ficam {pairs} pares.', sci: 'Tina despejada: ficam {pairs} pares em série.' },
        potash: { kid: '100 pares: Davy viu que chegava para decompor a potassa. Mas chegará para a soda?', sci: '100 pares, como a bateria de Davy de 100 placas de 6 polegadas: chega para a potassa.' },
        full: { kid: 'As dez tinas: 250 pares de placas! Foi esta a força que Davy usou para decompor a soda.', sci: '250 pares: «a força de 250», como escreveu Davy, as baterias que usou na soda.' },
        none: { kid: 'As tinas estão todas vazias: não há empurrão nenhum.', sci: 'Todas as tinas despejadas: não há corrente.' },
      },
      panel: {
        kid: [
          'Uma bateria é uma fila de células. Em cada uma, uma placa de cobre e uma de zinco estão mergulhadas em ácido: o zinco vai-se dissolvendo e empurra a eletricidade à volta. Um par empurra pouco, mas ligados em fila os empurrões somam-se. A Royal Institution tinha baterias enormes, com centenas de pares de placas.',
          'Toca nas tinas para as encher. Com poucas placas o empurrão é fraco; Davy precisou das suas maiores baterias para tirar um metal da soda. O ácido queima, por isso era deitado com muito cuidado.',
        ],
        sci: [
          'Uma pilha de Volta: zinco e cobre em ácido diluído. O zinco dissolve-se (Zn -> Zn2+ + 2 e−) e os eletrões percorrem o circuito exterior; um par cobre-zinco dá cerca de 1 volt. Numa bateria de tinas, as placas duplas (cobre soldado a zinco) estão fixadas em células, de modo que os pares ficam ligados em série e as tensões somam-se.',
          'As baterias da Royal Institution, tal como Davy as enumerou na sua Bakerian Lecture: 24 placas de cobre e zinco de 12 polegadas de lado, 100 de 6 polegadas e 150 de 4 polegadas, carregadas com soluções de alúmen e de ácido nítrico. Descreve «a bateria da força de 250 de 6 e 4», e «a força de 250» para a soda. Aqui fazem as vezes delas dez tinas de 25 pares: quatro de placas de 6 polegadas (100 pares) e seis de placas de 4 polegadas (150).',
        ],
      },
    },
    soda: {
      label: 'A soda e os fios',
      title: 'Decompor a soda com eletricidade',
      hints: { touch: 'Toca no fio para o encostar à soda', weak: 'Fraco demais: enche mais tinas, ou toca no fio para o levantar', watch: 'Olha para o fundo do pedaço de soda', bead: 'Toca numa bolinha brilhante para a veres de perto', atoms: 'Toca na lupa para veres os átomos', lens: 'Toca na lupa para a esvaziar' },
      buttons: { wire: 'Encostar ou levantar o fio', bead: 'Ver uma bolinha', atoms: 'Ver os seus átomos' },
      says: {
        none: { kid: 'Não acontece nada: não passa eletricidade. Primeiro enche algumas tinas da bateria!', sci: 'Sem corrente: a bateria não está carregada.' },
        warm: { kid: 'A soda só aquece. A bateria é fraca demais.', sci: '{pairs} pares: a corrente só aquece o álcali húmido.' },
        strong: { kid: 'Quente, mas nada de metal! Isto chegava para decompor a potassa, mas a soda agarra-se ao seu metal com mais força. Enche mais tinas.', sci: '{pairs} pares: quente, mas sem decomposição. A potassa cedeu a 100 pares de placas de 6 polegadas; a soda «exigia maior intensidade de ação das baterias», escreveu Davy.' },
        splits: { kid: 'Olha! Bolhas em cima, e em baixo bolinhas brilhantes, como gotas de mercúrio. Algumas pegam fogo! É sódio, um metal que ninguém tinha visto.', sci: 'O álcali funde nos dois contactos: o oxigénio borbulha no fio positivo e, na platina negativa, aparecem glóbulos com o brilho do mercúrio, alguns a arder à medida que se formam. Sódio.' },
        lift: { kid: 'Fio levantado: a eletricidade para, e as bolinhas também.', sci: 'Circuito aberto: a eletrólise para.' },
        weaker: { kid: 'A bateria ficou mais fraca, por isso já não aparecem bolinhas.', sci: 'Abaixo de 250 pares a decomposição para.' },
        bead: { kid: 'Pela lupa: uma bolinha de sódio, brilhante como o mercúrio. Vê: o ar dá-lhe uma pele branca.', sci: 'O sódio acabado de formar tem um brilho prateado; ao ar embacia logo e forma-se-lhe uma crosta branca (hidróxido de sódio, depois carbonato).' },
        atoms: { kid: 'Ainda mais perto: átomos de sódio em filas certinhas. Cada um larga um eletrão, e todos os eletrões soltos são partilhados: é isso que faz um metal brilhar.', sci: 'Sódio cúbico de corpo centrado, aresta do cubo 429 pm: cada átomo cede o seu eletrão 3s a um mar de eletrões partilhado, que faz o metal brilhar e conduzir.' },
        close: { kid: 'A lupa fica vazia outra vez.', sci: 'Lupa vazia.' },
        noBeads: { kid: 'Ainda não há bolinhas para ver.', sci: 'Ainda não há glóbulos.' },
      },
      panel: {
        kid: [
          'Davy pôs um pedacinho de soda cáustica, um pouco húmido para a eletricidade conseguir passar, num disco de platina ligado a uma ponta da bateria. Um fio de platina, vindo da outra ponta, tocava-lhe em cima. Com placas que chegassem, a soda derretia onde os fios tocavam: em cima saíam bolhas de oxigénio e em baixo apareciam bolinhas brilhantes de sódio. Algumas pegavam fogo com chamas vivas.',
          'Nenhum fogo conseguia tirar o sódio da soda, porque o sódio se agarra ao oxigénio com muita força: foi precisa a eletricidade. Isto é muito perigoso! A soda cáustica quente queima a pele e o sódio pega fogo, por isso só os químicos o fazem, num laboratório e com proteção.',
        ],
        sci: [
          'A montagem de Davy: hidróxido de sódio ligeiramente húmido (seco não conduz) num disco de platina isolado, ligado ao polo negativo, e um fio de platina do polo positivo na sua superfície de cima. O álcali funde nos dois contactos. No fio positivo, oxigénio: 4 OH− -> O2 + 2 H2O + 4 e−. No disco negativo: Na+ + e− -> Na, em glóbulos líquidos no álcali quente (o sódio funde a 97,8 °C) e sólidos, com o brilho da prata, depois de arrefecerem.',
          'Com «a força de 250», escreveu, os glóbulos «ardiam muitas vezes no momento em que se formavam», e alguns explodiam em glóbulos mais pequenos que voavam pelo ar, «produzindo um belo efeito de jatos de fogo contínuos». A soda precisou de mais do que a potassa: com 100 pares não conseguiu decompor pedaços de soda de mais de 15 ou 20 grãos (cerca de 1 g). O álcali fundido e o sódio a arder são perigosos: só os químicos o fazem, num laboratório e com proteção.',
        ],
      },
    },
    notebook: {
      label: 'A secretária de Davy',
      hints: { page: 'Toca no caderno para continuares a ler', downs: 'Toca no modelo de uma célula de Downs' },
      buttons: { page: 'Virar a página', downs: 'Ligar a célula de Downs', stop: 'Desligar a célula de Downs' },
      pages: [
        {
          title: 'Outubro de 1807: primeiro o potássio',
          kid: ['Davy experimentou primeiro a potassa, em outubro de 1807: um pó branco feito de cinza de madeira. Quando as primeiras bolinhas brilhantes rebentaram pela crosta e pegaram fogo, ficou tão contente que andou aos saltos pela sala, contou o primo Edmund, que era o seu assistente. Esse primeiro metal novo foi o potássio.'],
          sci: ['O potássio veio primeiro, em outubro de 1807, da potassa (hidróxido de potássio) ligeiramente húmida no mesmo disco de platina. O primo Edmund Davy, então seu assistente neste laboratório, contou que Humphry, ao ver os minúsculos glóbulos romperem a crosta de potassa e pegarem fogo, saltou pela sala num êxtase de alegria (nas Memórias escritas pelo irmão, John Davy).'],
        },
        {
          title: 'Dias depois: o sódio',
          kid: ['Uns dias depois experimentou a soda cáustica. Foi mais difícil: a soda precisava de uma bateria mais forte. Saiu o sódio, líquido enquanto quente e brilhante como a prata depois de frio. A 19 de novembro de 1807 falou dos dois metais novos à Royal Society e deu-lhes nomes tirados da potassa e da soda: potássio e sódio.'],
          sci: ['O sódio veio poucos dias depois: a soda «exigia maior intensidade de ação das baterias, ou então o álcali tinha de estar em pedaços muito mais finos e pequenos». O metal novo era líquido ao calor em que se formava e sólido, com o brilho da prata, depois de frio. Na Bakerian Lecture, lida perante a Royal Society a 19 de novembro de 1807, Davy anunciou os dois metais e deu-lhes nomes tirados da potassa e da soda.'],
        },
        {
          title: '1808: mais quatro metais',
          kid: ['No ano seguinte, 1808, Davy voltou a usar a eletricidade e descobriu mais quatro metais: o magnésio, o cálcio, o estrôncio e o bário. Há cálcio nos teus ossos e no giz!'],
          sci: ['Em 1808 Davy fez a eletrólise das terras húmidas com um cátodo de mercúrio, seguindo um método de Berzelius e Pontin, e destilou o mercúrio das amálgamas: amostras pequenas e impuras de magnésio, cálcio, estrôncio e bário. Em dois anos, a eletricidade tinha dado à química seis metais novos.'],
        },
      ],
    },
    downs: {
      title: 'O sódio hoje: a célula de Downs (1924)',
      labels: { na: 'sódio', cl: 'cloro', sign: 'Célula de Downs, 1924' },
      says: {
        on: { kid: 'Ligada: de um lado sobe sódio brilhante, do outro borbulha cloro amarelo-esverdeado.', sci: 'A funcionar: Na+ + e− -> Na no cátodo de ferro, 2 Cl− -> Cl2 + 2 e− no ânodo de grafite.' },
        off: { kid: 'Desligada.', sci: 'Corrente desligada.' },
      },
      panel: {
        kid: [
          'O sódio ainda hoje se faz com eletricidade, mas a partir de sal derretido, em grandes tanques de aço chamados células de Downs (1924). Misturado com cloreto de cálcio, o sal funde a cerca de 600 °C em vez de 801 °C, o que poupa muito calor.',
          'No meio, a eletricidade tira do sal o cloro, um gás amarelo-esverdeado e venenoso; à volta forma-se sódio líquido, que sobe e é levado por um tubo. Uma rede de arame mantém os dois separados, senão voltavam a arder e a fazer sal.',
        ],
        sci: [
          'A célula de Downs (James C. Downs, 1924) faz a eletrólise do cloreto de sódio fundido com cloreto de cálcio, que baixa o ponto de fusão de 801 °C para cerca de 600 °C. No total: 2 NaCl -> 2 Na + Cl2.',
          'Um ânodo de grafite no meio: 2 Cl− -> Cl2 + 2 e−, o gás recolhido debaixo de uma campânula. Um cátodo de ferro à volta: Na+ + e− -> Na; o sódio líquido, menos denso do que o banho, sobe para um coletor. Um diafragma de rede de aço impede o sódio e o cloro de se voltarem a encontrar.',
        ],
      },
    },
  },
  pl: {
    title: 'Laboratorium Davy’ego, 1807',
    greet: {
      kid: 'Jesteśmy w środku obrazka: w piwnicznym laboratorium Royal Institution w Londynie, w 1807 roku, przy świecach. Tutaj Humphry Davy wydobył prądem z sody zupełnie nowy metal. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Piwniczne laboratorium Royal Institution, Albemarle Street, Londyn, jesień 1807: koryta z płytkami miedzi i cynku, izolowany krążek platyny i grudka wilgotnej sody kaustycznej. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Chemicy podejrzewali, że w sodzie i potażu ukrywa się metal, ale żaden ogień nie potrafił go wydobyć. Davy spróbował prądu.',
        'Davy miał tylko 28 lat. Później wynalazł lampę bezpieczeństwa, która uratowała życie wielu górnikom.',
        'Młody introligator Michael Faraday przychodził tu na wykłady Davy’ego i został jego asystentem. Wyrósł na jednego z największych naukowców wszech czasów.',
      ],
      sci: [
        'Lavoisier pominął potaż i sodę w swojej tablicy substancji prostych z 1789 roku, bo podejrzewał, że to związki. Davy pokazał, że każde z nich zawiera metal związany z tlenem.',
        'W 1807 roku Davy miał 28 lat. W 1815 roku wynalazł górniczą lampę bezpieczeństwa, której siatka z drutu nie pozwala płomieniowi zapalić gazu na zewnątrz.',
        'Michael Faraday, uczeń introligatora, słuchał tu wykładów Davy’ego w 1812 roku, a w 1813 został jego asystentem; później w tym samym budynku odkrył indukcję elektromagnetyczną.',
      ],
    },
    battery: {
      label: 'Wielka bateria',
      title: 'Koryta z miedzią i cynkiem',
      slate: 'par płytek',
      slider: 'Napełnione koryta',
      count: '{n} z 10 koryt, {pairs} par',
      hints: { first: 'Dotknij koryta, żeby nalać do niego kwasu', more: 'Dotknij następnego koryta (na razie {pairs} par)', full: 'Wszystkie 250 par! Dotknij koryta, żeby je opróżnić' },
      buttons: { next: 'Napełnij koryto', all: 'Napełnij wszystkie', none: 'Opróżnij wszystkie' },
      says: {
        fill: { kid: 'Wlewamy kwas i płytki zaczynają musować. Teraz pcha razem {pairs} par płytek.', sci: 'Koryto napełnione rozcieńczonym kwasem: {pairs} par miedź-cynk połączonych szeregowo.' },
        drain: { kid: 'Opróżnione: to koryto już nie pcha. Zostało {pairs} par.', sci: 'Koryto opróżnione: w szeregu zostało {pairs} par.' },
        potash: { kid: '100 par: Davy przekonał się, że tyle wystarczy, żeby rozłożyć potaż. A czy wystarczy na sodę?', sci: '100 par, jak w baterii Davy’ego ze 100 płytek 6-calowych: dość na potaż.' },
        full: { kid: 'Wszystkie dziesięć koryt: 250 par płytek! Takiej mocy użył Davy, żeby rozłożyć sodę.', sci: '250 par: „moc 250”, jak pisał Davy, baterie, których użył do sody.' },
        none: { kid: 'Wszystkie koryta są puste: nic nie pcha.', sci: 'Wszystkie koryta opróżnione: brak prądu.' },
      },
      panel: {
        kid: [
          'Bateria to rząd ogniw. W każdym płytka miedzi i płytka cynku stoją w kwasie: cynk powoli się rozpuszcza i pcha prąd dookoła. Jedna para pcha słabo, ale połączone w rząd ich pchnięcia się sumują. Royal Institution miała ogromne baterie z setkami par płytek.',
          'Dotykaj koryt, żeby je napełnić. Przy kilku płytkach pchnięcie jest słabe; Davy potrzebował swoich największych baterii, żeby wydobyć metal z sody. Kwas parzy, więc nalewano go bardzo ostrożnie.',
        ],
        sci: [
          'Ogniwo Volty: cynk i miedź w rozcieńczonym kwasie. Cynk się rozpuszcza (Zn -> Zn2+ + 2 e−), a elektrony płyną obwodem zewnętrznym; para miedź-cynk daje około 1 wolta. W baterii korytowej płytki podwójne (miedź przylutowana do cynku) są osadzone w przegródkach, tak że pary są połączone szeregowo i ich napięcia się sumują.',
          'Baterie Royal Institution, jak wymienił je Davy w swoim wykładzie Bakerian Lecture: 24 płytki miedzi i cynku o boku 12 cali, 100 płytek 6-calowych i 150 płytek 4-calowych, napełnione roztworami ałunu i kwasu azotowego. Opisuje „baterię o mocy 250 z 6 i 4”, a do sody „moc 250”. Tutaj zastępuje je dziesięć koryt po 25 par: cztery z płytkami 6-calowymi (100 par) i sześć z 4-calowymi (150).',
        ],
      },
    },
    soda: {
      label: 'Soda i druty',
      title: 'Rozkładanie sody prądem',
      hints: { touch: 'Dotknij drutu, żeby przyłożyć go do sody', weak: 'Za słabo: napełnij więcej koryt albo dotknij drutu, żeby go podnieść', watch: 'Patrz na spód grudki', bead: 'Dotknij błyszczącej kuleczki, żeby przyjrzeć się z bliska', atoms: 'Dotknij lupy, żeby zobaczyć atomy', lens: 'Dotknij lupy, żeby ją opróżnić' },
      buttons: { wire: 'Przyłóż albo podnieś drut', bead: 'Obejrzyj kuleczkę', atoms: 'Obejrzyj jej atomy' },
      says: {
        none: { kid: 'Nic się nie dzieje: prąd nie płynie. Najpierw napełnij kilka koryt baterii!', sci: 'Brak prądu: bateria nie jest naładowana.' },
        warm: { kid: 'Soda tylko się nagrzewa. Bateria jest o wiele za słaba.', sci: '{pairs} par: prąd tylko ogrzewa wilgotną zasadę.' },
        strong: { kid: 'Gorąco, ale metalu ani śladu! Tyle wystarczyłoby, żeby rozłożyć potaż, ale soda mocniej trzyma swój metal. Napełnij więcej koryt.', sci: '{pairs} par: gorąco, ale bez rozkładu. Potaż ustąpił przy 100 parach płytek 6-calowych; soda „wymagała większej intensywności działania baterii”, pisał Davy.' },
        splits: { kid: 'Patrz! Na górze bąbelki, a na dole malutkie błyszczące kuleczki, jak krople rtęci. Niektóre wybuchają płomieniem! To sód, metal, którego nikt wcześniej nie widział.', sci: 'Zasada topi się w obu punktach styku: przy dodatnim drucie musuje tlen, a na ujemnej platynie pojawiają się kuleczki o połysku rtęci, niektóre płonące już w chwili powstania. Sód.' },
        lift: { kid: 'Drut w górze: prąd przestaje płynąć i kuleczki też przestają się pojawiać.', sci: 'Obwód otwarty: elektroliza ustaje.' },
        weaker: { kid: 'Bateria osłabła, więc nie ma już nowych kuleczek.', sci: 'Poniżej 250 par rozkład ustaje.' },
        bead: { kid: 'Przez lupę: kuleczka sodu, błyszcząca jak rtęć. Patrz: powietrze okrywa ją białą skórką.', sci: 'Świeży sód ma srebrzysty połysk; na powietrzu od razu matowieje i pokrywa się białym nalotem (wodorotlenek sodu, potem węglan).' },
        atoms: { kid: 'Jeszcze bliżej: atomy sodu w równych rzędach. Każdy oddaje jeden elektron, a wszystkie luźne elektrony są wspólne: dlatego metal błyszczy.', sci: 'Sód o sieci regularnej przestrzennie centrowanej, krawędź komórki 429 pm: każdy atom oddaje swój elektron 3s do wspólnego morza elektronów, dzięki czemu metal błyszczy i przewodzi prąd.' },
        close: { kid: 'Lupa znów jest pusta.', sci: 'Lupa pusta.' },
        noBeads: { kid: 'Nie ma jeszcze kuleczek do oglądania.', sci: 'Jeszcze brak kuleczek.' },
      },
      panel: {
        kid: [
          'Davy położył małą grudkę sody kaustycznej, lekko wilgotną, żeby prąd mógł przez nią płynąć, na platynowym krążku połączonym z jednym końcem baterii. Platynowy drut z drugiego końca dotykał jej od góry. Przy dość wielu płytkach soda topiła się tam, gdzie dotykały druty: na górze uciekały bąbelki tlenu, a na dole pojawiały się błyszczące kuleczki sodu. Niektóre zapalały się jasnym płomieniem.',
          'Żaden ogień nie potrafił wydobyć sodu z sody, bo sód bardzo mocno trzyma się tlenu: potrzebny był prąd. To bardzo niebezpieczne! Gorąca soda kaustyczna parzy skórę, a sód się zapala, więc robią to tylko chemicy, w laboratorium i w ochronie.',
        ],
        sci: [
          'Układ Davy’ego: lekko wilgotny wodorotlenek sodu (suchy nie przewodzi) na izolowanym krążku platyny połączonym z biegunem ujemnym i platynowy drut z bieguna dodatniego na jego górnej powierzchni. Zasada topi się w obu punktach styku. Przy dodatnim drucie tlen: 4 OH− -> O2 + 2 H2O + 4 e−. Na ujemnym krążku: Na+ + e− -> Na, w kuleczkach ciekłych w gorącej zasadzie (sód topi się w 97,8 °C), a po ostygnięciu stałych, o połysku srebra.',
          'Przy „mocy 250”, pisał, kuleczki „często paliły się w chwili powstania”, a niektóre rozpryskiwały się na mniejsze, które leciały przez powietrze, „dając piękny efekt nieprzerwanych strumieni ognia”. Soda wymagała więcej niż potaż: przy 100 parach nie dało się rozłożyć kawałków sody cięższych niż 15 lub 20 granów (około 1 g). Stopiona zasada i płonący sód są niebezpieczne: robią to tylko chemicy, w laboratorium, w ochronie.',
        ],
      },
    },
    notebook: {
      label: 'Biurko Davy’ego',
      hints: { page: 'Dotknij notatnika, żeby czytać dalej', downs: 'Dotknij modelu elektrolizera Downsa' },
      buttons: { page: 'Przewróć stronę', downs: 'Uruchom elektrolizer Downsa', stop: 'Zatrzymaj elektrolizer Downsa' },
      pages: [
        {
          title: 'Październik 1807: najpierw potas',
          kid: ['W październiku 1807 roku Davy spróbował najpierw potażu, białej substancji z popiołu drzewnego. Kiedy pierwsze malutkie błyszczące kuleczki przebiły się przez skorupkę i zapaliły, tak się ucieszył, że skakał po pokoju z radości, jak wspominał jego kuzyn Edmund, który był jego asystentem. Tym pierwszym nowym metalem był potas.'],
          sci: ['Najpierw był potas, w październiku 1807 roku, z lekko wilgotnego potażu (wodorotlenku potasu) na tym samym krążku platyny. Jego kuzyn Edmund Davy, wtedy asystent w tym laboratorium, opowiadał, że Humphry, widząc, jak maleńkie kuleczki przebijają skorupkę potażu i się zapalają, skakał po pokoju w ekstatycznej radości (we wspomnieniach spisanych przez jego brata, Johna Davy’ego).'],
        },
        {
          title: 'Kilka dni później: sód',
          kid: ['Kilka dni później spróbował sody kaustycznej. To było trudniejsze: soda potrzebowała silniejszej baterii. Wyszedł z niej sód, ciekły na gorąco i błyszczący jak srebro po ostygnięciu. 19 listopada 1807 roku Davy opowiedział o obu nowych metalach w Royal Society i nadał im nazwy od potażu i sody (po angielsku potassium i sodium).'],
          sci: ['Sód przyszedł kilka dni później: soda „wymagała większej intensywności działania baterii albo zasada musiała być w dużo cieńszych i mniejszych kawałkach”. Nowy metal był ciekły w cieple, w którym powstawał, a po ostygnięciu stały, o połysku srebra. W wykładzie Bakerian Lecture, odczytanym w Royal Society 19 listopada 1807 roku, Davy ogłosił oba metale i nadał im nazwy od potażu i sody.'],
        },
        {
          title: '1808: jeszcze cztery metale',
          kid: ['W następnym roku, 1808, Davy znów użył prądu i znalazł jeszcze cztery metale: magnez, wapń, stront i bar. Wapń jest w twoich kościach i w kredzie!'],
          sci: ['W 1808 roku Davy poddał elektrolizie wilgotne ziemie z katodą rtęciową, według metody Berzeliusa i Pontina, i oddestylował rtęć z amalgamatów: dostał małe, zanieczyszczone próbki magnezu, wapnia, strontu i baru. W ciągu dwóch lat prąd dał chemii sześć nowych metali.'],
        },
      ],
    },
    downs: {
      title: 'Sód dziś: elektrolizer Downsa (1924)',
      labels: { na: 'sód', cl: 'chlor', sign: 'Elektrolizer Downsa, 1924' },
      says: {
        on: { kid: 'Włączony: z jednej strony wypływa błyszczący sód, z drugiej bulgocze żółtozielony chlor.', sci: 'Pracuje: Na+ + e− -> Na na żelaznej katodzie, 2 Cl− -> Cl2 + 2 e− na grafitowej anodzie.' },
        off: { kid: 'Wyłączony.', sci: 'Prąd wyłączony.' },
      },
      panel: {
        kid: [
          'Sód wciąż robi się prądem, ale ze stopionej soli, w dużych stalowych zbiornikach zwanych elektrolizerami Downsa (1924). Sól zmieszana z chlorkiem wapnia topi się w około 600 °C zamiast w 801 °C, co oszczędza mnóstwo ciepła.',
          'W środku prąd wyciąga z soli chlor, żółtozielony trujący gaz; dookoła powstaje ciekły sód, który wypływa do góry i jest odprowadzany rurą. Druciana siatka trzyma je osobno, bo inaczej spaliłyby się z powrotem na sól.',
        ],
        sci: [
          'Elektrolizer Downsa (James C. Downs, 1924) rozkłada stopiony chlorek sodu z dodatkiem chlorku wapnia, który obniża temperaturę topnienia z 801 °C do około 600 °C. W sumie: 2 NaCl -> 2 Na + Cl2.',
          'Grafitowa anoda w środku: 2 Cl− -> Cl2 + 2 e−, gaz zbierany pod kołpakiem. Żelazna katoda dookoła: Na+ + e− -> Na; ciekły sód, lżejszy od stopu, wypływa do odbieralnika. Przepona ze stalowej siatki nie pozwala, żeby sód i chlor znów się spotkały.',
        ],
      },
    },
  },
  de: {
    title: 'Davys Labor, 1807',
    greet: {
      kid: 'Wir sind im Bild: im Kellerlabor der Royal Institution in London, im Jahr 1807, bei Kerzenlicht. Hier holte Humphry Davy mit Strom ein ganz neues Metall aus Soda. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Das Kellerlabor der Royal Institution, Albemarle Street, London, Herbst 1807: Tröge mit Kupfer- und Zinkplatten, eine isolierte Platinscheibe und ein Stück feuchtes Ätznatron. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Chemiker vermuteten, dass in Soda und Pottasche ein Metall steckt, aber kein Feuer bekam es heraus. Davy versuchte es mit Strom.',
        'Davy war erst 28. Später erfand er eine Sicherheitslampe, die vielen Bergleuten das Leben rettete.',
        'Ein junger Buchbinder namens Michael Faraday kam hierher zu Davys Vorlesungen und wurde sein Assistent. Er wurde einer der größten Wissenschaftler überhaupt.',
      ],
      sci: [
        'Lavoisier ließ Pottasche und Soda 1789 aus seiner Tabelle der einfachen Stoffe weg, weil er sie für Verbindungen hielt. Davy zeigte, dass jede ein Metall enthält, das an Sauerstoff gebunden ist.',
        'Davy war 1807 28 Jahre alt. 1815 erfand er die Sicherheitslampe der Bergleute, deren Drahtgewebe verhindert, dass ihre Flamme das Gas draußen entzündet.',
        'Michael Faraday, Lehrling bei einem Buchbinder, hörte Davy hier 1812 und wurde 1813 sein Assistent; später entdeckte er im selben Gebäude die elektromagnetische Induktion.',
      ],
    },
    battery: {
      label: 'Die große Batterie',
      title: 'Tröge mit Kupfer und Zink',
      slate: 'Plattenpaare',
      slider: 'Gefüllte Tröge',
      count: '{n} von 10 Trögen, {pairs} Paare',
      hints: { first: 'Tippe auf einen Trog, um ihn mit Säure zu füllen', more: 'Tippe auf noch einen Trog (bisher {pairs} Paare)', full: 'Alle 250 Paare! Tippe auf einen Trog, um ihn zu leeren' },
      buttons: { next: 'Einen Trog füllen', all: 'Alle füllen', none: 'Alle leeren' },
      says: {
        fill: { kid: 'Die Säure fließt hinein, und die Platten fangen an zu sprudeln. Jetzt schieben {pairs} Plattenpaare zusammen.', sci: 'Trog mit verdünnter Säure gefüllt: {pairs} Kupfer-Zink-Paare in Reihe.' },
        drain: { kid: 'Geleert: Dieser Trog schiebt nicht mehr. Noch {pairs} Paare.', sci: 'Trog geleert: noch {pairs} Paare in Reihe.' },
        potash: { kid: '100 Paare: Das reichte, fand Davy, um Pottasche zu zerlegen. Aber reicht es auch für Soda?', sci: '100 Paare, wie Davys Batterie aus 100 Platten von 6 Zoll: genug für Pottasche.' },
        full: { kid: 'Alle zehn Tröge: 250 Plattenpaare! Mit dieser Kraft zerlegte Davy die Soda.', sci: '250 Paare: „die Kraft von 250“, wie Davy schrieb, die Batterien, die er für Soda nahm.' },
        none: { kid: 'Alle Tröge sind leer: Da schiebt gar nichts.', sci: 'Alle Tröge geleert: kein Strom.' },
      },
      panel: {
        kid: [
          'Eine Batterie ist eine Reihe von Zellen. In jeder stehen eine Kupferplatte und eine Zinkplatte in Säure: Das Zink löst sich langsam auf und schiebt den Strom herum. Ein Paar schiebt nur ein bisschen, aber in einer Reihe verbunden addieren sich die Schübe. Die Royal Institution hatte riesige Batterien mit Hunderten von Plattenpaaren.',
          'Tippe auf die Tröge, um sie zu füllen. Mit wenigen Platten ist der Schub schwach; Davy brauchte seine größten Batterien, um ein Metall aus Soda zu holen. Säure ätzt, deshalb wurde sie sehr vorsichtig eingegossen.',
        ],
        sci: [
          'Eine Voltasche Zelle: Zink und Kupfer in verdünnter Säure. Das Zink löst sich (Zn -> Zn2+ + 2 e−), die Elektronen fließen durch den äußeren Stromkreis; ein Kupfer-Zink-Paar liefert etwa 1 Volt. In einer Trogbatterie sind die Doppelplatten (Kupfer an Zink gelötet) in Zellen eingekittet, sodass die Paare in Reihe geschaltet sind und sich ihre Spannungen addieren.',
          'Die Batterien der Royal Institution, wie Davy sie in seiner Bakerian Lecture aufzählte: 24 Platten aus Kupfer und Zink von 12 Zoll im Quadrat, 100 von 6 Zoll und 150 von 4 Zoll, gefüllt mit Lösungen von Alaun und Salpetersäure. Er beschreibt „die Batterie von der Kraft von 250 aus 6 und 4“ und für Soda „die Kraft von 250“. Hier stehen zehn Tröge mit je 25 Paaren dafür: vier mit 6-Zoll-Platten (100 Paare) und sechs mit 4-Zoll-Platten (150).',
        ],
      },
    },
    soda: {
      label: 'Die Soda und die Drähte',
      title: 'Soda mit Strom zerlegen',
      hints: { touch: 'Tippe auf den Draht, um ihn an die Soda zu halten', weak: 'Zu schwach: Fülle mehr Tröge, oder tippe auf den Draht, um ihn anzuheben', watch: 'Schau auf die Unterseite des Stücks', bead: 'Tippe auf ein glänzendes Kügelchen, um es näher anzusehen', atoms: 'Tippe auf die Lupe, um die Atome zu sehen', lens: 'Tippe auf die Lupe, um sie zu leeren' },
      buttons: { wire: 'Draht anlegen oder anheben', bead: 'Ein Kügelchen ansehen', atoms: 'Seine Atome ansehen' },
      says: {
        none: { kid: 'Nichts passiert: Es fließt kein Strom. Fülle zuerst ein paar Tröge der Batterie!', sci: 'Kein Strom: Die Batterie ist nicht geladen.' },
        warm: { kid: 'Die Soda wird nur warm. Die Batterie ist viel zu schwach.', sci: '{pairs} Paare: Der Strom erwärmt nur das feuchte Alkali.' },
        strong: { kid: 'Heiß, aber kein Metall! So viel würde Pottasche zerlegen, aber Soda hält ihr Metall fester. Fülle mehr Tröge.', sci: '{pairs} Paare: heiß, aber keine Zerlegung. Pottasche gab bei 100 Paaren von 6-Zoll-Platten nach; Soda „verlangte eine größere Intensität der Wirkung der Batterien“, schrieb Davy.' },
        splits: { kid: 'Schau! Oben Bläschen, und unten winzige glänzende Kügelchen, wie Quecksilbertropfen. Manche gehen in Flammen auf! Das ist Natrium, ein Metall, das noch niemand gesehen hatte.', sci: 'Das Alkali schmilzt an beiden Kontakten: Am positiven Draht perlt Sauerstoff, und auf dem negativen Platin erscheinen Kügelchen mit dem Glanz von Quecksilber, manche brennen schon beim Entstehen. Natrium.' },
        lift: { kid: 'Draht hoch: Der Strom hört auf, und die Kügelchen auch.', sci: 'Stromkreis offen: Die Elektrolyse hört auf.' },
        weaker: { kid: 'Die Batterie ist schwächer geworden, deshalb kommen keine Kügelchen mehr.', sci: 'Unter 250 Paaren hört die Zerlegung auf.' },
        bead: { kid: 'Durch die Lupe: ein Kügelchen Natrium, glänzend wie Quecksilber. Schau: Die Luft gibt ihm eine weiße Haut.', sci: 'Frisches Natrium glänzt silbrig; an der Luft läuft es sofort an, und eine weiße Kruste bildet sich (Natriumhydroxid, später Carbonat).' },
        atoms: { kid: 'Noch näher: Natriumatome in ordentlichen Reihen. Jedes gibt ein Elektron ab, und alle losen Elektronen werden geteilt: Deshalb glänzt ein Metall.', sci: 'Kubisch raumzentriertes Natrium, Würfelkante 429 pm: Jedes Atom gibt sein 3s-Elektron an ein gemeinsames Elektronenmeer ab, das das Metall glänzen und leiten lässt.' },
        close: { kid: 'Die Lupe ist wieder leer.', sci: 'Lupe leer.' },
        noBeads: { kid: 'Es gibt noch keine Kügelchen zum Ansehen.', sci: 'Noch keine Kügelchen.' },
      },
      panel: {
        kid: [
          'Davy legte ein kleines Stück Ätznatron, ein bisschen feucht, damit der Strom hindurchkam, auf eine Platinscheibe, die mit einem Ende der Batterie verbunden war. Ein Platindraht vom anderen Ende berührte es von oben. Mit genug Platten schmolz die Soda dort, wo die Drähte sie berührten: Oben stiegen Sauerstoffbläschen auf, und unten erschienen glänzende Kügelchen aus Natrium. Manche gingen mit hellen Flammen in Feuer auf.',
          'Kein Feuer bekam das Natrium aus der Soda heraus, weil Natrium den Sauerstoff so fest hält: Es brauchte Strom. Das ist sehr gefährlich! Heißes Ätznatron verätzt die Haut, und Natrium fängt Feuer, deshalb machen das nur Chemiker, im Labor und mit Schutz.',
        ],
        sci: [
          'Davys Anordnung: leicht feuchtes Natriumhydroxid (trocken leitet es nicht) auf einer isolierten Platinscheibe am negativen Pol und ein Platindraht vom positiven Pol auf seiner Oberseite. Das Alkali schmilzt an beiden Kontakten. Am positiven Draht Sauerstoff: 4 OH− -> O2 + 2 H2O + 4 e−. An der negativen Scheibe: Na+ + e− -> Na, in Kügelchen, die im heißen Alkali flüssig sind (Natrium schmilzt bei 97,8 °C) und nach dem Abkühlen fest und silberglänzend.',
          'Bei „der Kraft von 250“, schrieb er, „brannten die Kügelchen oft im Moment ihrer Entstehung“, und manche zerplatzten in kleinere, die durch die Luft flogen, „mit dem schönen Effekt anhaltender Feuerstrahlen“. Soda brauchte mehr als Pottasche: Mit 100 Paaren ließen sich Sodastücke von mehr als 15 oder 20 Gran (etwa 1 g) nicht zerlegen. Geschmolzenes Alkali und brennendes Natrium sind gefährlich: Das machen nur Chemiker, im Labor, mit Schutz.',
        ],
      },
    },
    notebook: {
      label: 'Davys Schreibtisch',
      hints: { page: 'Tippe auf das Notizbuch, um weiterzulesen', downs: 'Tippe auf das Modell einer Downs-Zelle' },
      buttons: { page: 'Umblättern', downs: 'Die Downs-Zelle anschalten', stop: 'Die Downs-Zelle ausschalten' },
      pages: [
        {
          title: 'Oktober 1807: zuerst Kalium',
          kid: ['Davy versuchte im Oktober 1807 zuerst Pottasche, ein weißes Zeug aus Holzasche. Als die ersten winzigen glänzenden Kügelchen durch die Kruste brachen und Feuer fingen, freute er sich so sehr, dass er durchs Zimmer hüpfte, erzählte sein Cousin Edmund, der sein Assistent war. Dieses erste neue Metall war Kalium.'],
          sci: ['Zuerst kam das Kalium, im Oktober 1807, aus leicht feuchter Pottasche (Kaliumhydroxid) auf derselben Platinscheibe. Sein Cousin Edmund Davy, damals sein Assistent in diesem Labor, erzählte, dass Humphry, als er die winzigen Kügelchen durch die Kruste der Pottasche brechen und Feuer fangen sah, vor Entzücken durch den Raum sprang (in den Memoiren seines Bruders John Davy).'],
        },
        {
          title: 'Ein paar Tage später: Natrium',
          kid: ['Ein paar Tage später versuchte er Ätznatron. Das war schwerer: Soda brauchte eine stärkere Batterie. Heraus kam Natrium, flüssig, solange es heiß war, und glänzend wie Silber, als es abkühlte. Am 19. November 1807 erzählte er der Royal Society von beiden neuen Metallen und benannte sie nach Pottasche und Soda (auf Englisch potassium und sodium).'],
          sci: ['Natrium folgte wenige Tage später: Soda „verlangte eine größere Intensität der Wirkung der Batterien, oder das Alkali musste in viel dünneren und kleineren Stücken sein“. Das neue Metall war bei der Hitze seiner Entstehung flüssig und nach dem Abkühlen fest, mit dem Glanz von Silber. In seiner Bakerian Lecture, am 19. November 1807 vor der Royal Society verlesen, gab Davy beide Metalle bekannt und benannte sie nach Pottasche und Soda.'],
        },
        {
          title: '1808: noch vier Metalle',
          kid: ['Im nächsten Jahr, 1808, nahm Davy wieder Strom und fand noch vier Metalle: Magnesium, Calcium, Strontium und Barium. Calcium steckt in deinen Knochen und in Kreide!'],
          sci: ['1808 elektrolysierte Davy die feuchten Erden mit einer Quecksilberkathode, nach einer Methode von Berzelius und Pontin, und destillierte das Quecksilber aus den Amalgamen ab: kleine, unreine Proben von Magnesium, Calcium, Strontium und Barium. In zwei Jahren hatte der Strom der Chemie sechs neue Metalle gegeben.'],
        },
      ],
    },
    downs: {
      title: 'Natrium heute: die Downs-Zelle (1924)',
      labels: { na: 'Natrium', cl: 'Chlor', sign: 'Downs-Zelle, 1924' },
      says: {
        on: { kid: 'Eingeschaltet: Auf einer Seite steigt glänzendes Natrium auf, auf der anderen sprudelt gelbgrünes Chlor.', sci: 'In Betrieb: Na+ + e− -> Na an der Eisenkathode, 2 Cl− -> Cl2 + 2 e− an der Graphitanode.' },
        off: { kid: 'Ausgeschaltet.', sci: 'Strom aus.' },
      },
      panel: {
        kid: [
          'Natrium wird noch heute mit Strom gemacht, aber aus geschmolzenem Salz, in großen Stahlbehältern, die Downs-Zellen heißen (1924). Mit Calciumchlorid gemischt schmilzt das Salz schon bei etwa 600 °C statt bei 801 °C, und das spart viel Wärme.',
          'In der Mitte holt der Strom Chlor aus dem Salz, ein gelbgrünes giftiges Gas; ringsum entsteht flüssiges Natrium, das nach oben steigt und durch ein Rohr abfließt. Ein Drahtnetz hält die beiden auseinander, sonst würden sie wieder zu Salz verbrennen.',
        ],
        sci: [
          'Die Downs-Zelle (James C. Downs, 1924) elektrolysiert geschmolzenes Natriumchlorid mit Zusatz von Calciumchlorid, der den Schmelzpunkt von 801 °C auf etwa 600 °C senkt. Insgesamt: 2 NaCl -> 2 Na + Cl2.',
          'Die Graphitanode in der Mitte: 2 Cl− -> Cl2 + 2 e−, das Gas wird unter einer Haube gesammelt. Die Eisenkathode ringsum: Na+ + e− -> Na; das flüssige Natrium, leichter als die Schmelze, steigt in einen Sammler. Ein Diaphragma aus Stahlgewebe verhindert, dass sich Natrium und Chlor wieder treffen.',
        ],
      },
    },
  },
}
