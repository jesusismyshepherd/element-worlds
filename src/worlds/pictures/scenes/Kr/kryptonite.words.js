// The words of krypton's kryptonite room ("Is kryptonite real?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Kr.js
// (the easel shows it). Facts: jadarite LiNaSiB3O7(OH), Jadar basin near Loznica, described in 2007 by Chris
// Stanley (Natural History Museum, London) with Canada's National Research Council; the label of Superman
// Returns (2006), "sodium lithium boron silicate hydroxide with fluorine"; kryptonite from the 1943 radio
// serial; krypton melts at 115.79 K (-157.4 C) and boils at 119.93 K (-153.2 C) at one atmosphere (elements.json),
// face-centred cubic when solid; liquid nitrogen boils at 77 K; nitrogen narcosis from about 30 m (4 bar),
// krypton about seven times as narcotic as air, so 50 % krypton + 50 % air at 1 bar acts as 0.5 x 7 + 0.5 = 4 bar.
// {name} is the element's name in the language, {sym} its symbol.
export const KRYPTONITE_WORDS = {
  en: {
    title: 'The night gallery',
    greet: {
      kid: 'Shh, the museum is closed! In this gallery at night a comic book page has come to life beside a real mineral case. Try the three stations. The story of the picture is on the easel.',
      sci: 'A mineral gallery at night, in the spirit of a natural history museum. One bay is dressed as a comic page; the cases hold real science. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Krypton is a gas with no colour and no smell. A little of it is in every breath you take, and it does nothing to you.',
        'Superman\'s home planet is called Krypton, and most people think the name came from the element. Nobody has ever found a glowing green rock.',
        'Real krypton has been useful: it fills some lamps, and its orange light was used to define the metre until 1983.',
      ],
      sci: [
        'Krypton is 1.14 ppm of air by volume. Ramsay and Travers found it in 1898 in what was left of liquid air.',
        'Superman first appeared in 1938. That the planet was named after the element is the usual reading; its creators left no word on it.',
        'Kryptonite was invented for a radio serial in 1943. Jadarite is the real mineral whose formula matches the label of the film prop.',
      ],
    },
    recipe: {
      label: 'Same recipe?',
      verb: 'Tap a tile',
      title: 'A prop and a mineral',
      comic: { title: 'KRYPTONITE', sub: 'made up' },
      real: { title: 'JADARITE', sub: 'a real mineral' },
      noF: 'no F',
      lens: 'white and earthy',
      battery: 'lithium',
      says: {
        tile: { kid: '{name}! It is in the film\'s recipe, and in jadarite too.', sci: '{name} ({sym}) is on the prop\'s label and in jadarite\'s formula.' },
        fluorine: { kid: 'Fluorine is on the film\'s label, but jadarite has none. That is the one difference.', sci: 'Fluorine is on the prop\'s label; jadarite, LiNaSiB3O7(OH), contains none.' },
        lithium: { kid: 'Lithium! The metal in phone batteries. The ground under this mineral in Serbia holds a lot of it.', sci: 'Lithium: the Jadar deposit is one of Europe\'s largest stores of it, the metal of lithium-ion batteries.' },
        all: { kid: 'Six of seven match! Jadarite is like the film\'s recipe, but white and harmless.', sci: 'Six of the label\'s seven elements are in jadarite. Fluorine is the exception.' },
        crystals: { kid: 'They flicker! The crystals are a prop with a stage lamp behind them, made up for a radio show in 1943.', sci: 'A stage lamp behind the prop makes it glow. Kryptonite was invented for the radio serial of 1943.' },
        jadarite: { kid: 'Look closely: jadarite is white and earthy, like chalky clay. No glowing green crystals here.', sci: 'Jadarite is a white, earthy mineral. It does not glow green and it is not radioactive.' },
      },
      tip: 'Tap a tile, the crystals, the mineral or the battery.',
      buttons: { all: 'Light every tile', crystals: 'Flicker the crystals', jadarite: 'Look at jadarite', battery: 'Fill the battery' },
      panel: {
        kid: [
          'On the left is the glowing rock from the story. On the right is the real mineral in its case. Tap a tile on the story rock\'s label and the same tile lights up on the real one.',
          'The label on a film prop read "sodium lithium boron silicate hydroxide with fluorine". In 2007 a scientist at a museum in London, Chris Stanley, found a new mineral with almost the same recipe, only without the fluorine. It is called jadarite, after the valley in Serbia where it was found.',
        ],
        sci: [
          'The prop label in Superman Returns (2006) read "sodium lithium boron silicate hydroxide with fluorine": Na, Li, B, Si, O, H and F. Jadarite, LiNaSiB3O7(OH), described in 2007 by Chris Stanley of the Natural History Museum, London, with Canada\'s National Research Council, has every one of them but the fluorine.',
          'It was found by Rio Tinto geologists exploring for borates in the Jadar basin near Loznica, Serbia. It is white, earthy, not luminous and not radioactive; the deposit is one of Europe\'s largest stores of lithium. Kryptonite itself is fiction from the 1943 radio serial.',
        ],
      },
    },
    flask: {
      label: 'Real krypton',
      verbLens: 'Tap the flask',
      verbDip: 'Tap the Dewar',
      verbSlide: 'Tap the Dewar again',
      title: 'Krypton can be a rock',
      temp: 'Temperature of the bulb',
      dewar: 'liquid nitrogen',
      states: { solid: 'solid', liquid: 'liquid', gas: 'gas' },
      lens: { solid: 'a solid: tidy rows', liquid: 'a liquid: a loose crowd', gas: 'a gas: atoms flying' },
      says: {
        lens: { kid: 'Inside the flask, krypton atoms fly about on their own, far apart. That is a gas, and you cannot see it.', sci: 'Krypton gas at room temperature: single atoms about 3 nm apart on average, moving at roughly 270 m/s.' },
        dip: { kid: 'Brrr! The flask is in liquid nitrogen, at −196 °C. Watch the atoms slow down.', sci: 'The bulb sits in liquid nitrogen, which boils at −196 °C, well below krypton\'s melting point of −157.4 °C.' },
        lift: { kid: 'Out of the cold, it warms up. The crystals will melt, then the liquid will boil away.', sci: 'Out of the nitrogen the bulb warms: the solid melts at −157.4 °C and the liquid boils at −153.2 °C.' },
        solid: { kid: 'It froze! Below −157 °C krypton is a white solid, with its atoms in tidy rows.', sci: 'Below −157.4 °C: solid krypton, white, face-centred cubic, each atom touching twelve others.' },
        liquid: { kid: 'A little liquid! Krypton stays liquid for only about four degrees.', sci: 'Liquid between −157.4 °C and −153.2 °C at normal pressure: a range of only 4.1 degrees.' },
        gas: { kid: 'Warm enough, and it is a gas again: atoms flying about on their own.', sci: 'Above −153.2 °C it is a gas again, at normal pressure.' },
      },
      tip: 'Tap the flask for the lens, tap the Dewar to dip the flask, or drag the temperature.',
      buttons: { lens: 'Show the atoms', dip: 'Dip in liquid nitrogen', lift: 'Lift out' },
      panel: {
        kid: [
          'Krypton is a gas you cannot see. In this flask it is just atoms flying about. Make it cold enough and they slow down and stick together: first a little liquid, then a white solid, like water turning to ice but at a much, much lower temperature.',
          'Drag the slider. Liquid krypton exists only between −153 °C and −157 °C, about four degrees wide. Kryptonite is made up, but a rock of real krypton is real: you only need liquid nitrogen to make it, and it melts away as soon as it warms up.',
        ],
        sci: [
          'At one atmosphere krypton condenses at 119.93 K (−153.2 °C) and freezes at 115.79 K (−157.4 °C): its liquid range is only 4.1 K. Solid krypton is white and face-centred cubic, like solid neon, argon and xenon. (The triple point is near 115.8 K and 73 kPa; below that pressure there is no liquid at all.)',
          'Liquid nitrogen boils at 77 K (−196 °C), cold enough to freeze krypton, as it does in cryogenic traps. The lens shows one layer of atoms: a gas of atoms moving at roughly 270 m/s at room temperature, a loose crowd in the liquid, a tidy hexagonal layer of the cubic lattice in the solid.',
        ],
      },
    },
    chamber: {
      label: 'The diving bell',
      verbBell: 'Tap the bell',
      verbBottle: 'Tap the krypton bottle',
      title: 'What krypton really does to people',
      gauge: { real: 'real depth', feels: 'feels like', unit: 'm' },
      pressure: 'Pressure of the air',
      bottle: 'krypton and air, half and half',
      says: {
        calm: { kid: 'Near the surface the diver thinks clearly: two plus two is four. Drag the slider to dive.', sci: 'Near the surface the air has no narcotic effect worth noting. Drag the slider to raise the pressure.' },
        narc: { kid: 'Uh-oh, the diver is getting giddy. This is nitrogen narcosis: from about 30 m down, the nitrogen in air starts to act like a drug.', sci: 'Nitrogen narcosis, the "rapture of the deep": from about 30 m (4 bar) the nitrogen in air impairs judgement and coordination.' },
        deep: { kid: 'Very giddy now. Real divers who go this deep need training and special gas mixes.', sci: 'At 40 m (5 bar) the impairment is plain. Deep divers breathe mixes with helium in place of most of the nitrogen.' },
        kr: { kid: 'The bottle is open: half krypton, half air, at normal pressure, and the diver is as giddy as at 30 m! Krypton is about seven times as dizzying as air. Only in a story: never breathe gas from a bottle.', sci: '50 % krypton and 50 % air at 1 bar: 0.5 × 7 + 0.5 = 4, as air at 4 bar, a depth of 30 m. Krypton is about seven times as narcotic as air.' },
        krOff: { kid: 'Bottle closed: plain air again, and a clear head.', sci: 'Bottle closed: air alone, at the pressure on the gauge.' },
      },
      tip: 'Tap the bell, drag the slider to dive, and tap the krypton bottle.',
      buttons: { on: 'Open the krypton bottle', off: 'Close the krypton bottle' },
      panel: {
        kid: [
          'A diver goes deeper, and the air is squeezed. At about 30 metres the nitrogen in it starts to make the diver giddy and muddled. It is called nitrogen narcosis, or "the rapture of the deep". Drag the slider to dive.',
          'Krypton does the same, only much stronger: about seven times stronger than air. So half krypton and half air at normal pressure would feel like 30 metres down. That only happens in labs: Superman\'s story is made up, and nobody should ever breathe from a bottle they were not taught to use.',
        ],
        sci: [
          'Pressure rises by about 1 bar for every 10 m of seawater, so 30 m is 4 bar absolute and 40 m is 5 bar. Nitrogen narcosis, noticeable from about 30 m, impairs judgement and coordination; the effect grows with the pressure of the gas times its narcotic potency.',
          'Krypton is about seven times as narcotic as air, so a mix of 50 % krypton and 50 % air at 1 bar acts like air at 0.5 × 7 + 0.5 = 4 bar, as at 30 m. The orange needle shows that sum; the white one is the real pressure. The 1.14 ppm of krypton in the air you breathe is harmless.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A galeria à noite',
    greet: {
      kid: 'Chiu, o museu está fechado! Nesta galeria, à noite, uma página de banda desenhada ganhou vida ao lado de uma vitrine de minerais a sério. Experimenta os três postos. A história da imagem está no cavalete.',
      sci: 'Uma galeria de minerais à noite, ao jeito de um museu de história natural. Um recanto está vestido de página de banda desenhada; as vitrines guardam ciência a sério. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O crípton é um gás sem cor e sem cheiro. Há um bocadinho dele em cada respiração que fazes, e não te faz nada.',
        'O planeta do Super-Homem chama-se Krypton, e muita gente pensa que o nome veio do elemento. Ninguém encontrou nunca uma rocha verde a brilhar.',
        'O crípton verdadeiro tem sido útil: enche algumas lâmpadas, e a sua luz cor de laranja serviu para definir o metro até 1983.',
      ],
      sci: [
        'O crípton é 1,14 ppm do ar em volume. Ramsay e Travers descobriram-no em 1898 no que sobrava do ar líquido.',
        'O Super-Homem apareceu em 1938. Que o planeta tenha o nome do elemento é a leitura habitual; os criadores não deixaram nenhuma palavra sobre isso.',
        'A kryptonite foi inventada para uma série de rádio em 1943. A jadarite é o mineral verdadeiro cuja fórmula coincide com o rótulo do adereço do filme.',
      ],
    },
    recipe: {
      label: 'Mesma receita?',
      verb: 'Toca num quadrado',
      title: 'Um adereço e um mineral',
      comic: { title: 'KRYPTONITE', sub: 'inventada' },
      real: { title: 'JADARITE', sub: 'um mineral a sério' },
      noF: 'sem F',
      lens: 'branca e terrosa',
      battery: 'lítio',
      says: {
        tile: { kid: '{name}! Está na receita do filme, e na jadarite também.', sci: '{name} ({sym}) está no rótulo do adereço e na fórmula da jadarite.' },
        fluorine: { kid: 'O flúor está no rótulo do filme, mas a jadarite não tem nenhum. É a única diferença.', sci: 'O flúor está no rótulo do adereço; a jadarite, LiNaSiB3O7(OH), não o contém.' },
        lithium: { kid: 'Lítio! O metal das baterias dos telemóveis. O terreno por baixo deste mineral, na Sérvia, tem muito.', sci: 'Lítio: o jazigo de Jadar é uma das maiores reservas da Europa, o metal das baterias de iões de lítio.' },
        all: { kid: 'Seis em sete coincidem! A jadarite parece a receita do filme, mas é branca e inofensiva.', sci: 'Seis dos sete elementos do rótulo estão na jadarite. O flúor é a exceção.' },
        crystals: { kid: 'Tremeluzem! Os cristais são um adereço com um candeeiro de palco atrás, inventados para um programa de rádio em 1943.', sci: 'Um candeeiro de palco atrás do adereço faz com que brilhe. A kryptonite foi inventada para a série de rádio de 1943.' },
        jadarite: { kid: 'Olha de perto: a jadarite é branca e terrosa, como barro de giz. Nada de cristais verdes a brilhar.', sci: 'A jadarite é um mineral branco e terroso. Não brilha de verde e não é radioativa.' },
      },
      tip: 'Toca num quadrado, nos cristais, no mineral ou na bateria.',
      buttons: { all: 'Acender todos os quadrados', crystals: 'Fazer tremeluzir os cristais', jadarite: 'Ver a jadarite', battery: 'Encher a bateria' },
      panel: {
        kid: [
          'À esquerda está a rocha brilhante da história. À direita está o mineral verdadeiro, na sua vitrine. Toca num quadrado do rótulo da rocha da história e o mesmo quadrado acende-se no verdadeiro.',
          'O rótulo de um adereço de filme dizia «sodium lithium boron silicate hydroxide with fluorine». Em 2007, um cientista de um museu de Londres, Chris Stanley, encontrou um mineral novo com quase a mesma receita, só sem o flúor. Chama-se jadarite, por causa do vale da Sérvia onde foi encontrado.',
        ],
        sci: [
          'O rótulo do adereço de Superman Returns (2006) dizia «sodium lithium boron silicate hydroxide with fluorine»: Na, Li, B, Si, O, H e F. A jadarite, LiNaSiB3O7(OH), descrita em 2007 por Chris Stanley, do Natural History Museum de Londres, com o National Research Council do Canadá, tem todos menos o flúor.',
          'Foi encontrada por geólogos da Rio Tinto à procura de boratos na bacia do Jadar, perto de Loznica, na Sérvia. É branca, terrosa, não luminosa e não radioativa; o jazigo é uma das maiores reservas de lítio da Europa. A kryptonite em si é ficção da série de rádio de 1943.',
        ],
      },
    },
    flask: {
      label: 'Crípton a sério',
      verbLens: 'Toca no balão',
      verbDip: 'Toca no Dewar',
      verbSlide: 'Toca outra vez no Dewar',
      title: 'O crípton pode ser uma rocha',
      temp: 'Temperatura do bolbo',
      dewar: 'azoto líquido',
      states: { solid: 'sólido', liquid: 'líquido', gas: 'gás' },
      lens: { solid: 'um sólido: fileiras certinhas', liquid: 'um líquido: uma multidão solta', gas: 'um gás: átomos a voar' },
      says: {
        lens: { kid: 'Dentro do balão, os átomos de crípton voam cada um por si, longe uns dos outros. Isso é um gás, e não se vê.', sci: 'Crípton gasoso à temperatura ambiente: átomos isolados, em média a cerca de 3 nm uns dos outros, a mover-se a uns 270 m/s.' },
        dip: { kid: 'Brrr! O balão está em azoto líquido, a −196 °C. Vê os átomos a abrandar.', sci: 'O bolbo está em azoto líquido, que ferve a −196 °C, muito abaixo do ponto de fusão do crípton, −157,4 °C.' },
        lift: { kid: 'Fora do frio, aquece. Os cristais vão derreter e depois o líquido vai evaporar-se.', sci: 'Fora do azoto, o bolbo aquece: o sólido funde a −157,4 °C e o líquido ferve a −153,2 °C.' },
        solid: { kid: 'Congelou! Abaixo de −157 °C o crípton é um sólido branco, com os átomos em fileiras certinhas.', sci: 'Abaixo de −157,4 °C: crípton sólido, branco, cúbico de faces centradas, cada átomo a tocar em doze outros.' },
        liquid: { kid: 'Um pouco de líquido! O crípton só fica líquido durante cerca de quatro graus.', sci: 'Líquido entre −157,4 °C e −153,2 °C à pressão normal: um intervalo de apenas 4,1 graus.' },
        gas: { kid: 'Quente que chegue, e é outra vez um gás: átomos a voar cada um por si.', sci: 'Acima de −153,2 °C é outra vez um gás, à pressão normal.' },
      },
      tip: 'Toca no balão para ver a lupa, toca no Dewar para mergulhar o balão, ou arrasta a temperatura.',
      buttons: { lens: 'Mostrar os átomos', dip: 'Mergulhar em azoto líquido', lift: 'Tirar' },
      panel: {
        kid: [
          'O crípton é um gás que não se vê. Neste balão são só átomos a voar. Se o arrefeceres bastante, eles abrandam e juntam-se: primeiro um bocadinho de líquido, depois um sólido branco, como a água que vira gelo, mas a uma temperatura muito, muito mais baixa.',
          'Arrasta o cursor. O crípton líquido só existe entre −153 °C e −157 °C, cerca de quatro graus. A kryptonite é inventada, mas uma rocha de crípton verdadeiro existe: só precisas de azoto líquido para a fazer, e ela derrete assim que aquece.',
        ],
        sci: [
          'À pressão de uma atmosfera, o crípton condensa a 119,93 K (−153,2 °C) e congela a 115,79 K (−157,4 °C): o seu intervalo líquido é de apenas 4,1 K. O crípton sólido é branco e cúbico de faces centradas, como o néon, o árgon e o xénon sólidos. (O ponto triplo fica perto de 115,8 K e 73 kPa; abaixo dessa pressão não há líquido nenhum.)',
          'O azoto líquido ferve a 77 K (−196 °C), frio que chegue para congelar o crípton, como acontece nas armadilhas criogénicas. A lupa mostra uma camada de átomos: um gás de átomos a mover-se a uns 270 m/s à temperatura ambiente, uma multidão solta no líquido, uma camada hexagonal certinha da rede cúbica no sólido.',
        ],
      },
    },
    chamber: {
      label: 'O sino de mergulho',
      verbBell: 'Toca no sino',
      verbBottle: 'Toca na garrafa de crípton',
      title: 'O que o crípton faz mesmo às pessoas',
      gauge: { real: 'profundidade real', feels: 'parece', unit: 'm' },
      pressure: 'Pressão do ar',
      bottle: 'crípton e ar, metade e metade',
      says: {
        calm: { kid: 'Perto da superfície o mergulhador pensa com clareza: dois mais dois são quatro. Arrasta o cursor para mergulhar.', sci: 'Perto da superfície o ar não tem efeito narcótico que se note. Arrasta o cursor para subir a pressão.' },
        narc: { kid: 'Ui, o mergulhador está a ficar tonto. É a narcose pelo azoto: a partir dos 30 m, o azoto do ar começa a agir como uma droga.', sci: 'Narcose pelo azoto, a «embriaguez das profundidades»: a partir de uns 30 m (4 bar), o azoto do ar prejudica o discernimento e a coordenação.' },
        deep: { kid: 'Agora está muito tonto. Os mergulhadores a sério que vão tão fundo precisam de treino e de misturas de gás especiais.', sci: 'A 40 m (5 bar) o prejuízo é claro. Os mergulhadores profundos respiram misturas com hélio no lugar de quase todo o azoto.' },
        kr: { kid: 'A garrafa está aberta: metade crípton, metade ar, à pressão normal, e o mergulhador está tão tonto como a 30 m! O crípton atordoa cerca de sete vezes mais do que o ar. Só numa história: nunca respires gás de uma garrafa.', sci: '50 % de crípton e 50 % de ar a 1 bar: 0,5 × 7 + 0,5 = 4, como o ar a 4 bar, a uma profundidade de 30 m. O crípton é cerca de sete vezes mais narcótico do que o ar.' },
        krOff: { kid: 'Garrafa fechada: outra vez ar normal, e a cabeça clara.', sci: 'Garrafa fechada: só ar, à pressão do manómetro.' },
      },
      tip: 'Toca no sino, arrasta o cursor para mergulhar e toca na garrafa de crípton.',
      buttons: { on: 'Abrir a garrafa de crípton', off: 'Fechar a garrafa de crípton' },
      panel: {
        kid: [
          'Um mergulhador desce, e o ar é comprimido. A cerca de 30 metros, o azoto do ar começa a deixá-lo tonto e confuso. Chama-se narcose pelo azoto, ou «embriaguez das profundidades». Arrasta o cursor para mergulhar.',
          'O crípton faz o mesmo, só que muito mais forte: cerca de sete vezes mais do que o ar. Por isso, metade crípton e metade ar à pressão normal pareceria 30 metros de profundidade. Isso só acontece em laboratórios: a história do Super-Homem é inventada, e ninguém deve respirar de uma garrafa que não aprendeu a usar.',
        ],
        sci: [
          'A pressão sobe cerca de 1 bar por cada 10 m de água do mar, por isso 30 m são 4 bar absolutos e 40 m são 5 bar. A narcose pelo azoto, notória a partir de uns 30 m, prejudica o discernimento e a coordenação; o efeito cresce com a pressão do gás vezes o seu poder narcótico.',
          'O crípton é cerca de sete vezes mais narcótico do que o ar, por isso uma mistura de 50 % de crípton e 50 % de ar a 1 bar atua como ar a 0,5 × 7 + 0,5 = 4 bar, como a 30 m. O ponteiro cor de laranja mostra essa soma; o branco é a pressão real. Os 1,14 ppm de crípton no ar que respiras são inofensivos.',
        ],
      },
    },
  },
  pl: {
    title: 'Nocna galeria',
    greet: {
      kid: 'Ciii, muzeum jest zamknięte! W tej galerii nocą strona komiksu ożyła obok prawdziwej gabloty z minerałami. Wypróbuj trzy stanowiska. Historia obrazka jest na sztalugach.',
      sci: 'Galeria minerałów nocą, na wzór muzeum historii naturalnej. Jedna wnęka jest ubrana jak strona komiksu; w gablotach jest prawdziwa nauka. Historia obrazka jest na sztalugach.',
    },
    talk: {
      kid: [
        'Krypton to gaz bez barwy i zapachu. Odrobina jest w każdym twoim oddechu i nic ci nie robi.',
        'Rodzinna planeta Supermana nazywa się Krypton i wiele osób sądzi, że nazwę wzięto od pierwiastka. Nikt nigdy nie znalazł świecącej zielonej skały.',
        'Prawdziwy krypton bywa przydatny: napełnia niektóre lampy, a jego pomarańczowe światło służyło do określenia metra aż do 1983 roku.',
      ],
      sci: [
        'Krypton to 1,14 ppm powietrza objętościowo. Ramsay i Travers odkryli go w 1898 roku w tym, co zostało z ciekłego powietrza.',
        'Superman pojawił się po raz pierwszy w 1938 roku. Że planetę nazwano od pierwiastka, to zwykłe odczytanie; jej twórcy nie zostawili na ten temat ani słowa.',
        'Kryptonit wymyślono do serialu radiowego w 1943 roku. Jadaryt to prawdziwy minerał, którego wzór zgadza się z napisem na rekwizycie z filmu.',
      ],
    },
    recipe: {
      label: 'Ten sam przepis?',
      verb: 'Dotknij kafelka',
      title: 'Rekwizyt i minerał',
      comic: { title: 'KRYPTONIT', sub: 'zmyślony' },
      real: { title: 'JADARYT', sub: 'prawdziwy minerał' },
      noF: 'bez F',
      lens: 'biały i ziemisty',
      battery: 'lit',
      says: {
        tile: { kid: '{name}! Jest w przepisie z filmu, a także w jadarycie.', sci: '{name} ({sym}) jest na napisie rekwizytu i we wzorze jadarytu.' },
        fluorine: { kid: 'Fluor jest na napisie z filmu, ale jadaryt go nie ma. To jedyna różnica.', sci: 'Fluor jest na napisie rekwizytu; jadaryt, LiNaSiB3O7(OH), go nie zawiera.' },
        lithium: { kid: 'Lit! Metal z baterii do telefonów. Ziemia pod tym minerałem w Serbii ma go bardzo dużo.', sci: 'Lit: złoże Jadar to jeden z największych w Europie zasobów litu, metalu baterii litowo-jonowych.' },
        all: { kid: 'Sześć z siedmiu się zgadza! Jadaryt jest jak przepis z filmu, ale biały i niegroźny.', sci: 'Sześć z siedmiu pierwiastków z napisu jest w jadarycie. Wyjątkiem jest fluor.' },
        crystals: { kid: 'Migoczą! Kryształy to rekwizyt z lampą teatralną z tyłu, wymyślony do audycji radiowej w 1943 roku.', sci: 'Lampa teatralna za rekwizytem sprawia, że świeci. Kryptonit wymyślono do serialu radiowego z 1943 roku.' },
        jadarite: { kid: 'Przyjrzyj się: jadaryt jest biały i ziemisty, jak kredowa glina. Żadnych świecących zielonych kryształów.', sci: 'Jadaryt to biały, ziemisty minerał. Nie świeci na zielono i nie jest promieniotwórczy.' },
      },
      tip: 'Dotknij kafelka, kryształów, minerału albo baterii.',
      buttons: { all: 'Zapal każdy kafelek', crystals: 'Zamigoc kryształami', jadarite: 'Obejrzyj jadaryt', battery: 'Naładuj baterię' },
      panel: {
        kid: [
          'Po lewej jest świecąca skała z opowieści. Po prawej prawdziwy minerał w gablocie. Dotknij kafelka na tabliczce skały z opowieści, a ten sam kafelek zapali się przy prawdziwej.',
          'Napis na filmowym rekwizycie brzmiał „sodium lithium boron silicate hydroxide with fluorine”. W 2007 roku naukowiec z muzeum w Londynie, Chris Stanley, znalazł nowy minerał o prawie takim samym przepisie, tylko bez fluoru. Nazywa się jadaryt, od doliny w Serbii, w której go znaleziono.',
        ],
        sci: [
          'Napis na rekwizycie w filmie Superman Returns (2006) brzmiał „sodium lithium boron silicate hydroxide with fluorine”: Na, Li, B, Si, O, H i F. Jadaryt, LiNaSiB3O7(OH), opisany w 2007 roku przez Chrisa Stanleya z Natural History Museum w Londynie wraz z kanadyjską National Research Council, ma wszystkie oprócz fluoru.',
          'Znaleźli go geolodzy firmy Rio Tinto, szukający boranów w dolinie Jadaru koło Loznicy w Serbii. Jest biały, ziemisty, nie świeci i nie jest promieniotwórczy; złoże to jeden z największych w Europie zasobów litu. Sam kryptonit to fikcja z serialu radiowego z 1943 roku.',
        ],
      },
    },
    flask: {
      label: 'Prawdziwy krypton',
      verbLens: 'Dotknij kolby',
      verbDip: 'Dotknij naczynia Dewara',
      verbSlide: 'Dotknij Dewara jeszcze raz',
      title: 'Krypton może być skałą',
      temp: 'Temperatura kolby',
      dewar: 'ciekły azot',
      states: { solid: 'ciało stałe', liquid: 'ciecz', gas: 'gaz' },
      lens: { solid: 'ciało stałe: równe rzędy', liquid: 'ciecz: luźny tłum', gas: 'gaz: latające atomy' },
      says: {
        lens: { kid: 'W kolbie atomy kryptonu latają każdy sam, daleko od siebie. To gaz i nie można go zobaczyć.', sci: 'Gazowy krypton w temperaturze pokojowej: pojedyncze atomy, średnio w odległości około 3 nm, poruszające się z szybkością około 270 m/s.' },
        dip: { kid: 'Brr! Kolba jest w ciekłym azocie, w −196 °C. Patrz, jak atomy zwalniają.', sci: 'Kolba tkwi w ciekłym azocie, który wrze w −196 °C, znacznie poniżej temperatury topnienia kryptonu, −157,4 °C.' },
        lift: { kid: 'Poza chłodem robi się cieplej. Kryształy się stopią, a potem ciecz wyparuje.', sci: 'Poza azotem kolba się ogrzewa: ciało stałe topi się w −157,4 °C, a ciecz wrze w −153,2 °C.' },
        solid: { kid: 'Zamarzł! Poniżej −157 °C krypton jest białym ciałem stałym, a jego atomy stoją w równych rzędach.', sci: 'Poniżej −157,4 °C: stały krypton, biały, regularny ściennie centrowany, każdy atom dotyka dwunastu innych.' },
        liquid: { kid: 'Trochę cieczy! Krypton jest ciekły tylko przez około cztery stopnie.', sci: 'Ciecz między −157,4 °C a −153,2 °C pod normalnym ciśnieniem: zakres zaledwie 4,1 stopnia.' },
        gas: { kid: 'Dość ciepło i znów jest gazem: atomy latają każdy sam.', sci: 'Powyżej −153,2 °C znów jest gazem, pod normalnym ciśnieniem.' },
      },
      tip: 'Dotknij kolby, by zobaczyć lupę, dotknij Dewara, by zanurzyć kolbę, albo przeciągnij temperaturę.',
      buttons: { lens: 'Pokaż atomy', dip: 'Zanurz w ciekłym azocie', lift: 'Wyjmij' },
      panel: {
        kid: [
          'Krypton to gaz, którego nie widać. W tej kolbie to po prostu latające atomy. Ochłodź go dość mocno, a zwolnią i sklejają się: najpierw trochę cieczy, potem biała substancja stała, jak woda zamieniająca się w lód, ale w znacznie, znacznie niższej temperaturze.',
          'Przeciągnij suwak. Ciekły krypton istnieje tylko między −153 °C a −157 °C, to około czterech stopni. Kryptonit jest zmyślony, ale skała z prawdziwego kryptonu jest prawdziwa: do jej zrobienia potrzebny jest tylko ciekły azot, a topi się, gdy tylko się ogrzeje.',
        ],
        sci: [
          'Pod ciśnieniem jednej atmosfery krypton skrapla się w 119,93 K (−153,2 °C) i krzepnie w 115,79 K (−157,4 °C): jego zakres ciekły to zaledwie 4,1 K. Stały krypton jest biały i regularny ściennie centrowany, jak stały neon, argon i ksenon. (Punkt potrójny jest przy około 115,8 K i 73 kPa; poniżej tego ciśnienia cieczy nie ma wcale.)',
          'Ciekły azot wrze w 77 K (−196 °C), dość zimno, by zamrozić krypton, jak w pułapkach kriogenicznych. Lupa pokazuje jedną warstwę atomów: gaz atomów poruszających się z szybkością około 270 m/s w temperaturze pokojowej, luźny tłum w cieczy, równą warstwę sześciokątną sieci regularnej w ciele stałym.',
        ],
      },
    },
    chamber: {
      label: 'Dzwon nurkowy',
      verbBell: 'Dotknij dzwonu',
      verbBottle: 'Dotknij butli z kryptonem',
      title: 'Co krypton naprawdę robi ludziom',
      gauge: { real: 'prawdziwa głębokość', feels: 'czuje się jak', unit: 'm' },
      pressure: 'Ciśnienie powietrza',
      bottle: 'krypton z powietrzem, pół na pół',
      says: {
        calm: { kid: 'Blisko powierzchni nurek myśli jasno: dwa plus dwa to cztery. Przeciągnij suwak, by nurkować.', sci: 'Blisko powierzchni powietrze nie ma zauważalnego działania odurzającego. Przeciągnij suwak, by podnieść ciśnienie.' },
        narc: { kid: 'Ojej, nurkowi kręci się w głowie. To narkoza azotowa: od około 30 m w dół azot z powietrza zaczyna działać jak narkotyk.', sci: 'Narkoza azotowa, „upojenie głębin”: od około 30 m (4 bar) azot z powietrza osłabia osąd i koordynację.' },
        deep: { kid: 'Teraz kręci mu się mocno. Prawdziwi nurkowie, którzy schodzą tak głęboko, potrzebują szkolenia i specjalnych mieszanin gazów.', sci: 'Na 40 m (5 bar) zaburzenia są wyraźne. Głębinowi nurkowie oddychają mieszaninami z helem zamiast większości azotu.' },
        kr: { kid: 'Butla jest otwarta: pół kryptonu, pół powietrza, pod normalnym ciśnieniem, a nurek odurzony jak na 30 m! Krypton oszałamia około siedem razy mocniej niż powietrze. Tylko w opowieści: nigdy nie oddychaj gazem z butli.', sci: '50 % kryptonu i 50 % powietrza pod 1 bar: 0,5 × 7 + 0,5 = 4, jak powietrze pod 4 bar, głębokość 30 m. Krypton działa odurzająco około siedem razy mocniej niż powietrze.' },
        krOff: { kid: 'Butla zamknięta: znów zwykłe powietrze i jasna głowa.', sci: 'Butla zamknięta: samo powietrze, pod ciśnieniem z manometru.' },
      },
      tip: 'Dotknij dzwonu, przeciągnij suwak, by nurkować, i dotknij butli z kryptonem.',
      buttons: { on: 'Otwórz butlę z kryptonem', off: 'Zamknij butlę z kryptonem' },
      panel: {
        kid: [
          'Nurek schodzi głębiej, a powietrze zostaje ściśnięte. Na około 30 metrach azot z powietrza zaczyna go odurzać i mącić mu w głowie. Nazywa się to narkozą azotową, czyli „upojeniem głębin”. Przeciągnij suwak, by nurkować.',
          'Krypton robi to samo, tylko dużo mocniej: około siedem razy mocniej niż powietrze. Pół kryptonu i pół powietrza pod normalnym ciśnieniem czułoby się więc jak 30 metrów w głębi. Zdarza się to tylko w laboratoriach: opowieść o Supermanie jest zmyślona i nikt nie powinien oddychać z butli, której obsługi go nie nauczono.',
        ],
        sci: [
          'Ciśnienie rośnie o około 1 bar na każde 10 m wody morskiej, więc 30 m to 4 bar bezwzględnych, a 40 m to 5 bar. Narkoza azotowa, zauważalna od około 30 m, osłabia osąd i koordynację; jej siła rośnie z ciśnieniem gazu razy jego siła odurzająca.',
          'Krypton jest około siedem razy bardziej odurzający niż powietrze, więc mieszanina 50 % kryptonu i 50 % powietrza pod 1 bar działa jak powietrze pod 0,5 × 7 + 0,5 = 4 bar, jak na 30 m. Pomarańczowa wskazówka pokazuje tę sumę; biała to prawdziwe ciśnienie. 1,14 ppm kryptonu w powietrzu, którym oddychasz, jest nieszkodliwe.',
        ],
      },
    },
  },
  de: {
    title: 'Die nächtliche Galerie',
    greet: {
      kid: 'Psst, das Museum ist geschlossen! In dieser Galerie ist nachts eine Comicseite neben einer echten Mineralvitrine zum Leben erwacht. Probier die drei Stationen aus. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Eine Mineraliengalerie bei Nacht, im Geist eines Naturkundemuseums. Eine Nische ist als Comicseite gestaltet; die Vitrinen zeigen echte Wissenschaft. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Krypton ist ein Gas ohne Farbe und ohne Geruch. In jedem Atemzug ist ein bisschen davon, und es tut dir nichts.',
        'Supermans Heimatplanet heißt Krypton, und die meisten denken, der Name stamme von dem Element. Einen leuchtend grünen Stein hat nie jemand gefunden.',
        'Echtes Krypton ist nützlich: Es füllt manche Lampen, und sein oranges Licht diente bis 1983 zur Festlegung des Meters.',
      ],
      sci: [
        'Krypton macht 1,14 ppm der Luft aus (Volumenanteil). Ramsay und Travers fanden es 1898 in dem, was von flüssiger Luft übrig blieb.',
        'Superman erschien zum ersten Mal 1938. Dass der Planet nach dem Element benannt wurde, ist die übliche Lesart; seine Schöpfer haben dazu nichts hinterlassen.',
        'Kryptonit wurde 1943 für eine Radioserie erfunden. Jadarit ist das echte Mineral, dessen Formel zum Etikett der Filmrequisite passt.',
      ],
    },
    recipe: {
      label: 'Dasselbe Rezept?',
      verb: 'Tippe auf ein Feld',
      title: 'Eine Requisite und ein Mineral',
      comic: { title: 'KRYPTONIT', sub: 'erfunden' },
      real: { title: 'JADARIT', sub: 'ein echtes Mineral' },
      noF: 'kein F',
      lens: 'weiß und erdig',
      battery: 'Lithium',
      says: {
        tile: { kid: '{name}! Es steht im Rezept des Films und auch im Jadarit.', sci: '{name} ({sym}) steht auf dem Etikett der Requisite und in der Formel des Jadarits.' },
        fluorine: { kid: 'Fluor steht auf dem Etikett des Films, aber Jadarit hat keines. Das ist der einzige Unterschied.', sci: 'Fluor steht auf dem Etikett der Requisite; Jadarit, LiNaSiB3O7(OH), enthält keines.' },
        lithium: { kid: 'Lithium! Das Metall in Handyakkus. Der Boden unter diesem Mineral in Serbien enthält sehr viel davon.', sci: 'Lithium: Die Lagerstätte Jadar gehört zu den größten Vorkommen Europas, das Metall der Lithium-Ionen-Akkus.' },
        all: { kid: 'Sechs von sieben passen! Jadarit ist wie das Rezept aus dem Film, aber weiß und harmlos.', sci: 'Sechs der sieben Elemente des Etiketts stecken im Jadarit. Fluor ist die Ausnahme.' },
        crystals: { kid: 'Sie flackern! Die Kristalle sind eine Requisite mit einer Bühnenlampe dahinter, 1943 für eine Radiosendung erfunden.', sci: 'Eine Bühnenlampe hinter der Requisite lässt sie leuchten. Kryptonit wurde für die Radioserie von 1943 erfunden.' },
        jadarite: { kid: 'Schau genau hin: Jadarit ist weiß und erdig, wie kreidiger Lehm. Keine grün leuchtenden Kristalle.', sci: 'Jadarit ist ein weißes, erdiges Mineral. Es leuchtet nicht grün und ist nicht radioaktiv.' },
      },
      tip: 'Tippe auf ein Feld, die Kristalle, das Mineral oder den Akku.',
      buttons: { all: 'Jedes Feld leuchten lassen', crystals: 'Die Kristalle flackern lassen', jadarite: 'Den Jadarit ansehen', battery: 'Den Akku füllen' },
      panel: {
        kid: [
          'Links ist der leuchtende Stein aus der Geschichte. Rechts ist das echte Mineral in seiner Vitrine. Tippe auf ein Feld am Schild des Geschichtensteins, und dasselbe Feld leuchtet am echten auf.',
          'Das Etikett einer Filmrequisite lautete „sodium lithium boron silicate hydroxide with fluorine“. 2007 fand ein Forscher an einem Museum in London, Chris Stanley, ein neues Mineral mit fast demselben Rezept, nur ohne Fluor. Es heißt Jadarit, nach dem Tal in Serbien, in dem es gefunden wurde.',
        ],
        sci: [
          'Das Etikett der Requisite in Superman Returns (2006) lautete „sodium lithium boron silicate hydroxide with fluorine“: Na, Li, B, Si, O, H und F. Jadarit, LiNaSiB3O7(OH), 2007 von Chris Stanley vom Natural History Museum in London zusammen mit dem kanadischen National Research Council beschrieben, hat alle außer dem Fluor.',
          'Geologen von Rio Tinto fanden es bei der Suche nach Boraten im Jadar-Becken bei Loznica in Serbien. Es ist weiß, erdig, nicht leuchtend und nicht radioaktiv; die Lagerstätte gehört zu den größten Lithiumvorkommen Europas. Kryptonit selbst ist Fiktion aus der Radioserie von 1943.',
        ],
      },
    },
    flask: {
      label: 'Echtes Krypton',
      verbLens: 'Tippe auf den Kolben',
      verbDip: 'Tippe auf das Dewar-Gefäß',
      verbSlide: 'Tippe noch einmal auf das Dewar-Gefäß',
      title: 'Krypton kann ein Stein sein',
      temp: 'Temperatur des Kolbens',
      dewar: 'flüssiger Stickstoff',
      states: { solid: 'fest', liquid: 'flüssig', gas: 'Gas' },
      lens: { solid: 'fest: ordentliche Reihen', liquid: 'flüssig: ein lockeres Gewimmel', gas: 'Gas: fliegende Atome' },
      says: {
        lens: { kid: 'Im Kolben fliegen die Kryptonatome jedes für sich, weit auseinander. Das ist ein Gas, und man sieht es nicht.', sci: 'Kryptongas bei Raumtemperatur: einzelne Atome, im Mittel etwa 3 nm voneinander entfernt, mit rund 270 m/s unterwegs.' },
        dip: { kid: 'Brr! Der Kolben steckt in flüssigem Stickstoff, bei −196 °C. Sieh zu, wie die Atome langsamer werden.', sci: 'Der Kolben steckt in flüssigem Stickstoff, der bei −196 °C siedet, weit unter dem Schmelzpunkt von Krypton, −157,4 °C.' },
        lift: { kid: 'Aus der Kälte heraus wird er wärmer. Die Kristalle schmelzen, dann verdampft die Flüssigkeit.', sci: 'Außerhalb des Stickstoffs erwärmt sich der Kolben: Der Feststoff schmilzt bei −157,4 °C, die Flüssigkeit siedet bei −153,2 °C.' },
        solid: { kid: 'Es ist gefroren! Unter −157 °C ist Krypton ein weißer Feststoff, seine Atome stehen in ordentlichen Reihen.', sci: 'Unter −157,4 °C: festes Krypton, weiß, kubisch flächenzentriert, jedes Atom berührt zwölf andere.' },
        liquid: { kid: 'Ein bisschen Flüssigkeit! Krypton bleibt nur etwa vier Grad lang flüssig.', sci: 'Flüssig zwischen −157,4 °C und −153,2 °C bei Normaldruck: ein Bereich von nur 4,1 Grad.' },
        gas: { kid: 'Warm genug, und es ist wieder ein Gas: Atome, die jedes für sich fliegen.', sci: 'Über −153,2 °C ist es bei Normaldruck wieder ein Gas.' },
      },
      tip: 'Tippe auf den Kolben für die Lupe, tippe auf das Dewar-Gefäß, um den Kolben einzutauchen, oder ziehe die Temperatur.',
      buttons: { lens: 'Die Atome zeigen', dip: 'In flüssigen Stickstoff tauchen', lift: 'Herausheben' },
      panel: {
        kid: [
          'Krypton ist ein Gas, das man nicht sieht. In diesem Kolben sind es nur herumfliegende Atome. Kühlst du es stark genug, werden sie langsamer und kleben zusammen: erst ein bisschen Flüssigkeit, dann ein weißer Feststoff, wie Wasser, das zu Eis wird, aber bei viel, viel tieferer Temperatur.',
          'Ziehe den Regler. Flüssiges Krypton gibt es nur zwischen −153 °C und −157 °C, etwa vier Grad breit. Kryptonit ist erfunden, aber ein Stein aus echtem Krypton ist echt: Du brauchst nur flüssigen Stickstoff, um ihn zu machen, und er schmilzt, sobald er warm wird.',
        ],
        sci: [
          'Bei einer Atmosphäre kondensiert Krypton bei 119,93 K (−153,2 °C) und erstarrt bei 115,79 K (−157,4 °C): Sein flüssiger Bereich beträgt nur 4,1 K. Festes Krypton ist weiß und kubisch flächenzentriert, wie festes Neon, Argon und Xenon. (Der Tripelpunkt liegt bei etwa 115,8 K und 73 kPa; unter diesem Druck gibt es gar keine Flüssigkeit.)',
          'Flüssiger Stickstoff siedet bei 77 K (−196 °C), kalt genug, um Krypton einzufrieren, wie es in Kühlfallen geschieht. Die Lupe zeigt eine Atomlage: ein Gas aus Atomen mit rund 270 m/s bei Raumtemperatur, ein lockeres Gewimmel in der Flüssigkeit, eine ordentliche sechseckige Lage des kubischen Gitters im Feststoff.',
        ],
      },
    },
    chamber: {
      label: 'Die Taucherglocke',
      verbBell: 'Tippe auf die Glocke',
      verbBottle: 'Tippe auf die Kryptonflasche',
      title: 'Was Krypton Menschen wirklich antut',
      gauge: { real: 'echte Tiefe', feels: 'fühlt sich an wie', unit: 'm' },
      pressure: 'Druck der Luft',
      bottle: 'Krypton und Luft, halb und halb',
      says: {
        calm: { kid: 'Nahe der Oberfläche denkt der Taucher klar: zwei plus zwei ist vier. Ziehe den Regler, um zu tauchen.', sci: 'Nahe der Oberfläche hat die Luft keine nennenswerte narkotische Wirkung. Ziehe den Regler, um den Druck zu erhöhen.' },
        narc: { kid: 'Oje, dem Taucher wird schwindlig. Das ist die Stickstoffnarkose: Ab etwa 30 m Tiefe wirkt der Stickstoff in der Luft wie eine Droge.', sci: 'Stickstoffnarkose, der „Tiefenrausch“: Ab etwa 30 m (4 bar) beeinträchtigt der Stickstoff der Luft Urteilsvermögen und Koordination.' },
        deep: { kid: 'Jetzt ist ihm sehr schwindlig. Echte Taucher, die so tief gehen, brauchen Training und besondere Gasmischungen.', sci: 'Bei 40 m (5 bar) ist die Beeinträchtigung deutlich. Tieftaucher atmen Mischungen mit Helium anstelle des größten Teils des Stickstoffs.' },
        kr: { kid: 'Die Flasche ist offen: halb Krypton, halb Luft, bei normalem Druck, und der Taucher ist so benommen wie in 30 m! Krypton benebelt etwa siebenmal so stark wie Luft. Nur in der Geschichte: Atme nie Gas aus einer Flasche.', sci: '50 % Krypton und 50 % Luft bei 1 bar: 0,5 × 7 + 0,5 = 4, wie Luft bei 4 bar, in 30 m Tiefe. Krypton wirkt etwa siebenmal so narkotisch wie Luft.' },
        krOff: { kid: 'Flasche zu: wieder normale Luft und ein klarer Kopf.', sci: 'Flasche zu: nur Luft, beim Druck der Anzeige.' },
      },
      tip: 'Tippe auf die Glocke, ziehe den Regler, um zu tauchen, und tippe auf die Kryptonflasche.',
      buttons: { on: 'Die Kryptonflasche öffnen', off: 'Die Kryptonflasche schließen' },
      panel: {
        kid: [
          'Ein Taucher geht tiefer, und die Luft wird zusammengedrückt. In etwa 30 Metern Tiefe macht der Stickstoff darin den Taucher benommen und durcheinander. Das heißt Stickstoffnarkose oder „Tiefenrausch“. Ziehe den Regler, um zu tauchen.',
          'Krypton macht dasselbe, nur viel stärker: etwa siebenmal so stark wie Luft. Halb Krypton und halb Luft bei normalem Druck würde sich also anfühlen wie 30 Meter Tiefe. Das gibt es nur in Labors: Supermans Geschichte ist erfunden, und niemand sollte aus einer Flasche atmen, die er nicht zu benutzen gelernt hat.',
        ],
        sci: [
          'Der Druck steigt um etwa 1 bar je 10 m Meerwasser, 30 m sind also 4 bar absolut und 40 m 5 bar. Die Stickstoffnarkose, ab etwa 30 m spürbar, beeinträchtigt Urteilsvermögen und Koordination; die Wirkung wächst mit dem Druck des Gases mal seiner narkotischen Stärke.',
          'Krypton wirkt etwa siebenmal so narkotisch wie Luft, also verhält sich eine Mischung aus 50 % Krypton und 50 % Luft bei 1 bar wie Luft bei 0,5 × 7 + 0,5 = 4 bar, wie in 30 m. Die orange Nadel zeigt diese Summe; die weiße ist der echte Druck. Die 1,14 ppm Krypton in der Luft, die du atmest, sind harmlos.',
        ],
      },
    },
  },
}
