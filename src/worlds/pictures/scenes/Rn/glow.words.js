// The words of radon's glow room ("Can a frozen gas glow by itself?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Rn.js (the easel shows it); the room adds the things to do.
// Sources, read for this room:
// - Gray and Ramsay, "Some physical properties of radium emanation", J. Chem. Soc. Trans. 95, 1073 (1909),
//   read in the original (zenodo 1529110): the emanation of 0.2111 g of radium (as bromide) over seven
//   days, about 0.09 mm3 at 0 C and 1 atm; liquefied by compression in a modified Andrews apparatus, then
//   "jacketed at various temperatures"; the liquid "colourless, and transparent, like water", causing the
//   glass to phosphoresce: blue in silica, bluish green in lead-potash glass, lilac in soda glass, and
//   "when compressed strongly in soda-glass, the colour reminds one of the cyanogen flame, at once blue and
//   pink"; melts at -71 C (pentane thermometer); boils at -62 C (211 K) at atmospheric pressure; the solid
//   "glows with great brilliancy, like a small, steel-blue arc-light", yellow on further cooling, "brilliant
//   orange-red" in liquid air, the reverse on warming, the red disappearing "pretty sharply at -118";
//   watched through a microscope with an objective of about one inch focal length; capillary drawn from
//   thermometer tubing, about 1/20 mm across; liquid about 0.00025 mm3, about 0.24 mm of the tube; their
//   vapour pressure table (500 mm at 202.6 K to 47 450 mm at the critical point, 377.5 K, 104.5 C; "below
//   500 mm pressure, the emanation is solid"); and their conclusion of an atomic weight of 176, "until the
//   actual density of the gas has been determined by weighing".
//   Flagged: the paper gives no temperature for the change from steel-blue to yellow; the room blends it
//   (a model) and the words give only the order and the -118. The 14 atm at 20 C is interpolated in their
//   table (10 000 mm at 290.3 K, 15 000 mm at 307.6 K).
// - The weighing: Ramsay and Gray, "La densite de l'emanation du radium", Comptes rendus 151, 126 (1910),
//   also proposing the name niton, "brillant, pour rappeler ses proprietes phosphorescentes" (quoted by
//   wordorigins.org). The five samples' volumes and masses (72.8, 58.5, 58.5, 67.7, 73.0 x 10^-3 mm3;
//   722, 564, 577, 658, 706 x 10^-6 mg) from Giunta's teaching notes (web.lemoyne.edu/giunta), not checked
//   against the original; the atomic weights "varying from 216 to 227" from a textbook of the 1910s quoting
//   the same paper (Alchemy: Ancient and Modern). The quartz microbalance (Steele and Grant's design) was
//   balanced by changing the pressure in its case, the buoyancy of a quartz bulb on one arm (Aston, Proc.
//   R. Soc. A 89, 439, 1914; Edwards, NBS Technologic Paper 89); its sensitivity is given as "half a
//   millionth of a milligram" (Giunta) and 10^-9 g (Aston): the words say "about a millionth". The
//   samples were sealed in small capillary tubes. The balance is in the Science Museum, London (1947-265).
//   The tube of air is the room's own comparison (sample I's volume of air at 1.293 g/L: 94 x 10^-6 mg).
// - Radon-222's half-life 3.8 days, 222.018 u; density 9.73 g/L at 0 C (src/data/elements.json), air 1.29;
//   a grain of table salt about 0.06 mg. Today's critical point about 377.5 K and 6.28 MPa.
// `weigh.unit` has plural forms (Intl.PluralRules: one, few, many, other) so Polish reads right after 722
// (few) and 577 (many); `{u}` in a line is that unit for the number `{m}`.
export const GLOW_WORDS = {
  en: {
    title: 'Inside the capillary, 1909',
    greet: {
      kid: "We are inside the picture, shrunk smaller than a speck of dust: this glass tunnel is the hair-thin tube Gray and Ramsay used in 1909. The silver wall behind you is mercury. Ahead, where the tube narrows, is the radon. The picture's story is on the easel.",
      sci: "Inside the capillary of 1909, about 1/20 mm across, drawn 160 000 times larger. Behind you, the mercury thread that compressed the gas; ahead, the tube's drawn end inside a cold jacket, where the radon condenses. The teal balls stand for radon atoms (real ones would still be far too small to see). The picture's story is on the easel.",
    },
    talk: {
      kid: [
        'My atoms break apart all by themselves, and the tiny bits they shoot out make the glass glow, and my frozen crystals too. That is why I shine without any lamp.',
        'In 1910 Gray and Ramsay gave me a name of my own: niton, from the Latin word for shining. Later the name radon won.',
        'They watched me through a microscope. The whole drop of liquid radon was about a quarter of a millimetre long.',
        'Half of any radon is gone in less than four days, so Gray and Ramsay always had to work fast.',
      ],
      sci: [
        'The emanation of 0.2111 g of radium, collected for seven days: about 0.09 mm³ of gas at 0 °C and 1 atm. As a liquid it filled about 0.00025 mm³, some 0.24 mm of the capillary.',
        'The glow is radioluminescence: alpha particles from radon-222 (half-life 3.8 days) and from its short-lived daughters excite the glass and the solid itself.',
        'Niton, from the Latin nitens, shining, was the name they proposed in 1910; radon became the official name later.',
        'From their vapour pressures, the critical point: 104.5 °C at 47 450 mm of mercury, about 62 atm (today about 104 °C and 6.3 MPa).',
      ],
    },
    leave: {
      kid: 'One more thing before you go: I am a noble gas like neon, yet I never go into a neon sign. The lead box in the neon sign workshop tells you why.',
      sci: 'Before you go: radon is a noble gas like neon, yet no sign is ever filled with it. The lead box in the neon sign workshop says why.',
    },
    cold: {
      label: 'The cold bath',
      title: 'Cooling the radon',
      tags: { room: 'room', boil: 'boils', freeze: 'freezes', red: 'red ends', air: 'liquid air' },
      hints: {
        start: 'Tap the thermometer just below −62 °C',
        cooling: 'Watch the radon',
        liquid: 'Tap the thermometer below −71 °C to freeze it',
        solid: 'Tap the liquid air tap for the coldest glow',
        coldest: 'Tap higher on the thermometer to warm it back',
      },
      slider: 'Temperature of the bath',
      buttons: { liquid: 'Just below −62 °C', freeze: 'Freeze it', air: 'Pour in liquid air', warm: 'Back to room temperature' },
      states: { gas: 'a gas', liquid: 'a liquid', solid: 'a solid' },
      rows: { state: 'Radon is', pressure: 'Pressure on it' },
      says: {
        condense: {
          kid: 'At −62 °C the radon turns into a liquid! The atoms rush to the tip and become a drop as clear as water, and the glass around it starts to glow.',
          sci: 'Below −62 °C (at 1 atm) it condenses: a colourless, transparent liquid, "like water", that makes the glass phosphoresce.',
        },
        freeze: {
          kid: 'At −71 °C it freezes. Now the frozen radon shines by itself, like a tiny steel-blue lamp!',
          sci: 'At −71 °C it solidifies and turns opaque, and the solid "glows with great brilliancy, like a small, steel-blue arc-light".',
        },
        yellow: { kid: 'Colder still, and the glow turns yellow.', sci: 'On further cooling the phosphorescence turns yellow.' },
        red: { kid: 'In liquid air, near −190 °C, it glows bright orange-red!', sci: 'In liquid air, about −190 °C: "brilliant orange-red".' },
        redGone: { kid: 'Warmer than −118 °C, and the red is gone, all at once.', sci: 'Warming: the red phosphorescence "disappears pretty sharply at −118°".' },
        blue: { kid: 'Warmer still: steel-blue again.', sci: 'The colours return in reverse order: steel-blue near the melting point.' },
        melt: { kid: 'At −71 °C it melts back into a clear liquid.', sci: 'It melts at −71 °C and is transparent again.' },
        boil: { kid: 'Warmer than −62 °C it boils, and the atoms fly off as a gas again.', sci: 'Above its boiling point it evaporates: gas again.' },
        pour: { kid: 'Liquid air pours into the bath around the tube, bubbling at about −190 °C.', sci: 'Liquid air into the jacket: about −190 °C.' },
        warm: { kid: 'The bath drains away and the tube warms up to room temperature.', sci: 'Bath removed: back towards room temperature.' },
        look: {
          gas: {
            kid: 'Radon gas. You could not see it at all, so here its atoms are the teal balls. Make it cold to catch it.',
            sci: 'Radon gas fills the tube; only a faint glow on the glass would show it. The teal balls stand for its atoms.',
          },
          liquid: {
            kid: 'Liquid radon, as clear as water. The light is not in the drop: its radiation makes the glass glow.',
            sci: 'Colourless and transparent; the colour is the glass phosphorescing.',
          },
          solid: {
            kid: 'Frozen radon glowing with its own light. No lamp, no electricity: just its own radioactivity.',
            sci: 'An opaque solid, radioluminescent: excited by its own alpha particles and those of its daughters.',
          },
        },
      },
      panel: {
        kid: [
          'Gray and Ramsay put their tube in a cold bath and watched the radon through a microscope. Choose the temperature: tap the thermometer, slide it here, or pour in liquid air.',
          'At −62 °C the gas becomes a clear liquid. At −71 °C it freezes and shines by itself: steel-blue, then yellow as it gets colder, and orange-red in liquid air. Warm it and the colours come back the other way; the red goes out suddenly at −118 °C.',
          "All that light comes from radon's own radioactivity: its atoms break apart, and the bits they shoot out make things glow.",
        ],
        sci: [
          'Gray and Ramsay, J. Chem. Soc. 95, 1073 (1909): boiling point −62 °C at atmospheric pressure, melting point −71 °C, read with a pentane thermometer and watched through a microscope with an objective of about one inch focal length (today: −61.7 °C and −71 °C).',
          'The liquid is "colourless, and transparent, like water" and causes the glass to phosphoresce. The solid glows "like a small, steel-blue arc-light", turns yellow on further cooling and "brilliant orange-red" in liquid air; on warming the order reverses and the red disappears "pretty sharply at −118°". The paper gives no temperature for the yellow: the room blends the colours between.',
          'The phases follow their vapour pressure table (500 mm of mercury at 202.6 K up to 47 450 mm at the critical point, 377.5 K): where the pressure on the radon exceeds its vapour pressure it is liquid; below 500 mm it is solid.',
        ],
      },
    },
    glass: {
      label: 'Three kinds of glass',
      title: 'Which glass glows which colour?',
      names: { silica: 'silica', lead: 'lead-potash glass', soda: 'soda glass' },
      tags: { silica: 'silica', lead: 'lead-potash', soda: 'soda glass', wheel: 'squeeze' },
      hints: {
        squeeze: 'Tap the wheel to squeeze the radon into a liquid',
        glass: 'Tap a glass to make the tube of it',
        hard: 'Tap the wheel again to squeeze it hard',
        solid: 'Warm the radon, it is frozen',
        again: 'Tap another glass, or the wheel to let go',
      },
      slider: 'Pressure on the radon',
      buttons: { squeeze: 'Squeeze', hard: 'Squeeze hard', release: 'Let go' },
      rows: { pressure: 'Pressure on the radon', vapour: 'Its vapour pressure', glass: 'Glass' },
      says: {
        silica: { kid: 'Silica glass: the radon makes it glow blue.', sci: 'In silica, blue.' },
        lead: { kid: 'Lead-potash glass: now the glow is bluish green. The same radon, a different glass!', sci: 'In lead-potash glass, bluish green.' },
        soda: { kid: 'Soda glass, like a window pane: the glow turns lilac.', sci: 'In soda glass, lilac.' },
        pinkBlue: {
          kid: 'Squeezed hard in soda glass, the glow is blue and pink at once, like the flame of a gas called cyanogen. Gray and Ramsay wrote exactly that!',
          sci: '"When compressed strongly in soda-glass, the colour reminds one of the cyanogen flame, at once blue and pink."',
        },
        hardOther: { kid: 'Squeezed hard, the glass glows a little brighter.', sci: 'Compressed strongly. Only in soda glass did they note a change of colour.' },
        squeezed: {
          kid: "The mercury pushes in, and at about 14 times the air's pressure the radon turns liquid, even warm! That is how Gray and Ramsay made their drop.",
          sci: 'At 20 °C its vapour pressure is about 10 700 mm of mercury (14 atm): compressed past it, the gas condenses, as in their modified Andrews apparatus.',
        },
        release: { kid: 'The mercury lets go. Warm radon turns back into a gas.', sci: 'Pressure off: above its boiling point the liquid evaporates.' },
        noLiquid: {
          kid: 'The bright glow needs liquid radon. Squeeze it with the wheel, or cool it to just below −62 °C.',
          sci: 'The colours belong to the liquid: compress it, or cool it below its boiling point, first.',
        },
        frozen: {
          kid: 'The radon is frozen, so now it shines by itself. Warm it a little to see the glass glow again.',
          sci: 'Solid: its own radioluminescence outshines the glass. Warm it above −71 °C.',
        },
      },
      panel: {
        kid: [
          "Gray and Ramsay noticed something odd: liquid radon itself is clear, yet it glows, and the colour depends on the glass of its tube. It is really the glass that glows, lit up by radon's radiation.",
          'Tap a glass to make the tube of it: silica glows blue, lead-potash glass bluish green, soda glass lilac.',
          'The wheel pushes the mercury and squeezes the radon. Squeezed hard enough, it turns liquid even at room temperature. Squeeze it hard in soda glass and watch!',
        ],
        sci: [
          '"It itself is, however, phosphorescent, and shines with a colour varying with the nature of the glass forming the tube in which it is confined; it might be more correct to say that it causes the glass to phosphoresce" (1909): blue in silica, bluish green in lead-potash glass, lilac in soda glass.',
          "They liquefied the gas by compression at room temperature in a modified Andrews apparatus, then jacketed it at various temperatures. The dial's red needle is its vapour pressure from their table: push the pressure past it and the gas condenses. Above the critical temperature, 104.5 °C, no pressure would.",
          'Compressed strongly in soda glass, the colour "reminds one of the cyanogen flame, at once blue and pink". Each glass was a separate tube; here the tube changes when you tap one.',
        ],
      },
    },
    weigh: {
      label: 'The microbalance',
      title: 'Weighing a speck of gas',
      tags: { air: 'air', year: '1910' },
      hints: {
        pick: 'Tap a tube to hang it on the balance',
        level: 'Slide the air until the beam is level, or tap the beam',
        next: 'Tap another tube',
        air: 'Tap the tube of air to compare',
        done: 'Tap a tube to weigh it again',
      },
      slider: 'Air let out of the case',
      unit: {
        kid: { one: 'millionth of a mg', few: 'millionths of a mg', many: 'millionths of a mg', other: 'millionths of a mg' },
        sci: { one: '× 10⁻⁶ mg', few: '× 10⁻⁶ mg', many: '× 10⁻⁶ mg', other: '× 10⁻⁶ mg' },
      },
      buttons: { auto: 'Level the beam', off: 'Take the tube off' },
      board: { title: 'Weighing radon, 1910', mass: 'millionths of a mg', reading: 'reading', guess: '1909 guess: 176', found: '1910, weighed: 216 to 227', today: 'today: 222', times: 'radon {n} times heavier' },
      says: {
        hang: {
          kid: 'The tube goes on the hook and the beam tips. Now balance it: let air out of the case, or tap the beam.',
          sci: 'Sample {id} on the hook. Balance it by lowering the pressure in the case: the quartz bulb on the other arm loses buoyancy.',
        },
        hangAir: { kid: 'The same size of tube, full of air. Lighter or heavier?', sci: 'A tube of the same volume filled with air, for comparison.' },
        level: {
          kid: 'Level! This speck of radon weighs {m} {u}, about a hundredth of a grain of salt.',
          sci: 'Balanced: {m} {u} for {v} × 10⁻³ mm³ of gas at 0 °C and 1 atm.',
        },
        levelAir: {
          kid: 'Level: the air weighs only {m} {u}. Radon is more than seven times heavier!',
          sci: 'Air, the same volume: {m} {u}, so this radon is {n} times as dense (today: 9.73 against 1.29 g/L at 0 °C, 7.5 times).',
        },
        all: {
          kid: 'All five weighed! A radon atom is about 220 times as heavy as a hydrogen atom: the heaviest gas there is.',
          sci: 'Five samples: atomic weights from 216 to 227 in 1910; today 222, which is radium-226 minus an alpha particle.',
        },
        off: { kid: 'The tube goes back in the rack.', sci: 'Sample removed.' },
        pickFirst: { kid: 'Hang a tube on the balance first: tap one in the rack.', sci: 'No sample on the hook yet.' },
      },
      panel: {
        kid: [
          'In 1909 Gray and Ramsay worked out from the boiling point how heavy radon atoms are, and got it wrong: 176. The only way to be sure was to weigh some.',
          'So in 1910 they weighed tubes of radon gas the size of a grain of salt on a balance made of quartz, so delicate it used no weights: a hollow glass ball on the other arm floats a little in the air, like a ball in water. Let air out of the case and the ball floats less, until the beam is level.',
          'Each speck weighed less than a thousandth of a milligram. A radon atom turned out to be about 220 times as heavy as a hydrogen atom: the heaviest gas of all.',
        ],
        sci: [
          'The 1909 paper put the atomic weight at 176 (from the boiling and critical points of argon, krypton and xenon on an arc) and added: "Until the actual density of the gas has been determined by weighing, it must be left doubtful".',
          "Ramsay and Gray, Comptes rendus 151, 126 (1910): a quartz microbalance (Steele and Grant's design), sensitive to about a millionth of a milligram, balanced by changing the pressure in its case, so the buoyancy of a quartz bulb on one arm. Five samples sealed in fine capillaries, 58.5 to 73.0 × 10⁻³ mm³ of gas weighing 564 to 722 × 10⁻⁶ mg, gave atomic weights from 216 to 227. The same paper proposed the name niton. Their balance is in the Science Museum, London.",
          'Today: radon-222, 222.018 u, from radium-226 by the loss of an alpha particle. 9.73 g/L at 0 °C, the densest gas, against 1.29 g/L for air.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Dentro do capilar, 1909',
    greet: {
      kid: 'Estamos dentro da imagem, encolhidos até ficarmos mais pequenos do que um grão de pó: este túnel de vidro é o tubo fino como um cabelo que Gray e Ramsay usaram em 1909. A parede prateada atrás de ti é mercúrio. Em frente, onde o tubo se estreita, está o rádon. A história da imagem está no cavalete.',
      sci: 'Dentro do capilar de 1909, com cerca de 1/20 mm de diâmetro, desenhado 160 000 vezes maior. Atrás de ti, o fio de mercúrio que comprimia o gás; em frente, a ponta estirada do tubo dentro de uma camisa fria, onde o rádon condensa. As bolinhas verde-azuladas representam átomos de rádon (os verdadeiros continuariam pequenos demais para se verem). A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Os meus átomos desfazem-se sozinhos, e os pedacinhos que disparam fazem brilhar o vidro, e também os meus cristais congelados. É por isso que brilho sem lâmpada nenhuma.',
        'Em 1910, Gray e Ramsay deram-me um nome só meu: niton, da palavra latina para brilhante. Mais tarde ganhou o nome rádon.',
        'Observaram-me ao microscópio. A gota inteira de rádon líquido tinha cerca de um quarto de milímetro de comprimento.',
        'Metade de qualquer rádon desaparece em menos de quatro dias, por isso Gray e Ramsay tinham sempre de trabalhar depressa.',
      ],
      sci: [
        'A emanação de 0,2111 g de rádio, recolhida durante sete dias: cerca de 0,09 mm³ de gás a 0 °C e 1 atm. Em líquido ocupava cerca de 0,00025 mm³, uns 0,24 mm do capilar.',
        'O brilho é radioluminescência: as partículas alfa do rádon-222 (meia-vida de 3,8 dias) e dos seus descendentes de vida curta excitam o vidro e o próprio sólido.',
        'Niton, do latim nitens, brilhante, foi o nome que propuseram em 1910; rádon passou a ser o nome oficial mais tarde.',
        'Das suas pressões de vapor, o ponto crítico: 104,5 °C a 47 450 mm de mercúrio, cerca de 62 atm (hoje cerca de 104 °C e 6,3 MPa).',
      ],
    },
    leave: {
      kid: 'Só mais uma coisa antes de ires: sou um gás nobre como o néon, mas nunca vou para um reclamo luminoso. A caixa de chumbo na oficina dos reclamos de néon explica porquê.',
      sci: 'Antes de ires: o rádon é um gás nobre como o néon, mas nenhum reclamo é cheio com ele. A caixa de chumbo na oficina dos reclamos de néon diz porquê.',
    },
    cold: {
      label: 'O banho frio',
      title: 'Arrefecer o rádon',
      tags: { room: 'ambiente', boil: 'ferve', freeze: 'congela', red: 'fim do vermelho', air: 'ar líquido' },
      hints: {
        start: 'Toca no termómetro um pouco abaixo de −62 °C',
        cooling: 'Observa o rádon',
        liquid: 'Toca no termómetro abaixo de −71 °C para o congelar',
        solid: 'Toca na torneira do ar líquido para o brilho mais frio',
        coldest: 'Toca mais acima no termómetro para o aquecer de novo',
      },
      slider: 'Temperatura do banho',
      buttons: { liquid: 'Um pouco abaixo de −62 °C', freeze: 'Congelar', air: 'Deitar ar líquido', warm: 'Voltar à temperatura ambiente' },
      states: { gas: 'um gás', liquid: 'um líquido', solid: 'um sólido' },
      rows: { state: 'O rádon é', pressure: 'Pressão sobre ele' },
      says: {
        condense: {
          kid: 'A −62 °C o rádon passa a líquido! Os átomos correm para a ponta e formam uma gota transparente como a água, e o vidro à volta começa a brilhar.',
          sci: 'Abaixo de −62 °C (a 1 atm) condensa: um líquido incolor e transparente, «como a água», que faz o vidro fosforescer.',
        },
        freeze: {
          kid: 'A −71 °C congela. Agora o rádon gelado brilha sozinho, como uma lâmpada minúscula azul-aço!',
          sci: 'A −71 °C solidifica e fica opaco, e o sólido «brilha intensamente, como uma pequena lâmpada de arco azul-aço».',
        },
        yellow: { kid: 'Ainda mais frio, e o brilho fica amarelo.', sci: 'Arrefecendo mais, a fosforescência fica amarela.' },
        red: { kid: 'Em ar líquido, perto de −190 °C, brilha laranja-avermelhado vivo!', sci: 'Em ar líquido, cerca de −190 °C: «laranja-avermelhado brilhante».' },
        redGone: { kid: 'Mais quente do que −118 °C, e o vermelho desaparece de uma vez.', sci: 'Ao aquecer, a fosforescência vermelha «desaparece bastante de repente a −118°».' },
        blue: { kid: 'Ainda mais quente: azul-aço outra vez.', sci: 'As cores voltam pela ordem inversa: azul-aço perto do ponto de fusão.' },
        melt: { kid: 'A −71 °C derrete e volta a ser um líquido transparente.', sci: 'Funde a −71 °C e fica de novo transparente.' },
        boil: { kid: 'Mais quente do que −62 °C ferve, e os átomos voam outra vez como gás.', sci: 'Acima do ponto de ebulição evapora-se: gás outra vez.' },
        pour: { kid: 'O ar líquido entra no banho à volta do tubo, a borbulhar a cerca de −190 °C.', sci: 'Ar líquido na camisa: cerca de −190 °C.' },
        warm: { kid: 'O banho escoa-se e o tubo aquece até à temperatura ambiente.', sci: 'Banho retirado: de volta à temperatura ambiente.' },
        look: {
          gas: {
            kid: 'Rádon gasoso. Não o conseguirias ver, por isso aqui os átomos são as bolinhas verde-azuladas. Arrefece-o para o apanhar.',
            sci: 'O rádon gasoso enche o tubo; só um brilho ténue no vidro o mostraria. As bolinhas verde-azuladas representam os seus átomos.',
          },
          liquid: {
            kid: 'Rádon líquido, transparente como a água. A luz não está na gota: é a radiação dela que faz brilhar o vidro.',
            sci: 'Incolor e transparente; a cor é o vidro a fosforescer.',
          },
          solid: {
            kid: 'Rádon gelado a brilhar com luz própria. Sem lâmpada, sem eletricidade: só a sua própria radioatividade.',
            sci: 'Um sólido opaco, radioluminescente: excitado pelas suas próprias partículas alfa e pelas dos seus descendentes.',
          },
        },
      },
      panel: {
        kid: [
          'Gray e Ramsay puseram o tubo num banho frio e observaram o rádon ao microscópio. Escolhe a temperatura: toca no termómetro, desliza aqui, ou deita ar líquido.',
          'A −62 °C o gás passa a um líquido transparente. A −71 °C congela e brilha sozinho: azul-aço, depois amarelo à medida que arrefece, e laranja-avermelhado em ar líquido. Aquece-o e as cores voltam pelo caminho inverso; o vermelho apaga-se de repente a −118 °C.',
          'Toda essa luz vem da própria radioatividade do rádon: os seus átomos desfazem-se, e os pedacinhos que disparam fazem as coisas brilhar.',
        ],
        sci: [
          'Gray e Ramsay, J. Chem. Soc. 95, 1073 (1909): ponto de ebulição −62 °C à pressão atmosférica, ponto de fusão −71 °C, lidos com um termómetro de pentano e observados ao microscópio com uma objetiva de cerca de uma polegada de distância focal (hoje: −61,7 °C e −71 °C).',
          'O líquido é «incolor e transparente, como a água» e faz o vidro fosforescer. O sólido brilha «como uma pequena lâmpada de arco azul-aço», fica amarelo ao arrefecer mais e «laranja-avermelhado brilhante» em ar líquido; ao aquecer a ordem inverte-se e o vermelho desaparece «bastante de repente a −118°». O artigo não dá temperatura para o amarelo: a sala mistura as cores entre elas.',
          'As fases seguem a sua tabela de pressões de vapor (500 mm de mercúrio a 202,6 K até 47 450 mm no ponto crítico, 377,5 K): onde a pressão sobre o rádon excede a sua pressão de vapor, é líquido; abaixo de 500 mm é sólido.',
        ],
      },
    },
    glass: {
      label: 'Três tipos de vidro',
      title: 'Que vidro brilha de que cor?',
      names: { silica: 'sílica', lead: 'vidro de chumbo e potássio', soda: 'vidro de soda' },
      tags: { silica: 'sílica', lead: 'chumbo e potássio', soda: 'vidro de soda', wheel: 'apertar' },
      hints: {
        squeeze: 'Toca na roda para apertar o rádon até ficar líquido',
        glass: 'Toca num vidro para fazer o tubo dele',
        hard: 'Toca outra vez na roda para apertar com força',
        solid: 'Aquece o rádon, está congelado',
        again: 'Toca noutro vidro, ou na roda para aliviar',
      },
      slider: 'Pressão sobre o rádon',
      buttons: { squeeze: 'Apertar', hard: 'Apertar com força', release: 'Aliviar' },
      rows: { pressure: 'Pressão sobre o rádon', vapour: 'A sua pressão de vapor', glass: 'Vidro' },
      says: {
        silica: { kid: 'Vidro de sílica: o rádon fá-lo brilhar azul.', sci: 'Na sílica, azul.' },
        lead: { kid: 'Vidro de chumbo e potássio: agora o brilho é azul-esverdeado. O mesmo rádon, outro vidro!', sci: 'No vidro de chumbo e potássio, azul-esverdeado.' },
        soda: { kid: 'Vidro de soda, como o de uma janela: o brilho fica lilás.', sci: 'No vidro de soda, lilás.' },
        pinkBlue: {
          kid: 'Apertado com força no vidro de soda, o brilho é azul e cor-de-rosa ao mesmo tempo, como a chama de um gás chamado cianogénio. Gray e Ramsay escreveram exatamente isso!',
          sci: '«Quando fortemente comprimido no vidro de soda, a cor lembra a chama do cianogénio, ao mesmo tempo azul e cor-de-rosa.»',
        },
        hardOther: { kid: 'Apertado com força, o vidro brilha um pouco mais.', sci: 'Fortemente comprimido. Só no vidro de soda notaram uma mudança de cor.' },
        squeezed: {
          kid: 'O mercúrio empurra, e a cerca de 14 vezes a pressão do ar o rádon passa a líquido, mesmo quente! Foi assim que Gray e Ramsay fizeram a sua gota.',
          sci: 'A 20 °C a sua pressão de vapor é de cerca de 10 700 mm de mercúrio (14 atm): comprimido para lá dela, o gás condensa, como no seu aparelho de Andrews modificado.',
        },
        release: { kid: 'O mercúrio alivia. O rádon quente volta a ser gás.', sci: 'Sem pressão: acima do ponto de ebulição o líquido evapora-se.' },
        noLiquid: {
          kid: 'O brilho forte precisa de rádon líquido. Aperta-o com a roda, ou arrefece-o até um pouco abaixo de −62 °C.',
          sci: 'As cores são do líquido: comprime-o, ou arrefece-o abaixo do ponto de ebulição, primeiro.',
        },
        frozen: {
          kid: 'O rádon está congelado, por isso agora brilha sozinho. Aquece-o um pouco para voltares a ver o vidro brilhar.',
          sci: 'Sólido: a sua própria radioluminescência ofusca o vidro. Aquece-o acima de −71 °C.',
        },
      },
      panel: {
        kid: [
          'Gray e Ramsay repararam numa coisa estranha: o rádon líquido é transparente, mas brilha, e a cor depende do vidro do tubo. Na verdade é o vidro que brilha, aceso pela radiação do rádon.',
          'Toca num vidro para fazer o tubo dele: a sílica brilha azul, o vidro de chumbo e potássio azul-esverdeado, o vidro de soda lilás.',
          'A roda empurra o mercúrio e aperta o rádon. Apertado com força suficiente, passa a líquido mesmo à temperatura ambiente. Aperta-o com força no vidro de soda e observa!',
        ],
        sci: [
          '«Ele próprio é, contudo, fosforescente, e brilha com uma cor que varia com a natureza do vidro do tubo em que está confinado; talvez fosse mais correto dizer que faz o vidro fosforescer» (1909): azul na sílica, azul-esverdeado no vidro de chumbo e potássio, lilás no vidro de soda.',
          'Liquefizeram o gás por compressão à temperatura ambiente num aparelho de Andrews modificado, e depois envolveram-no em banhos a várias temperaturas. A agulha vermelha do mostrador é a sua pressão de vapor, da tabela deles: empurra a pressão para lá dela e o gás condensa. Acima da temperatura crítica, 104,5 °C, nenhuma pressão o faria.',
          'Fortemente comprimido no vidro de soda, a cor «lembra a chama do cianogénio, ao mesmo tempo azul e cor-de-rosa». Cada vidro era um tubo diferente; aqui o tubo muda quando tocas num.',
        ],
      },
    },
    weigh: {
      label: 'A microbalança',
      title: 'Pesar um grãozinho de gás',
      tags: { air: 'ar', year: '1910' },
      hints: {
        pick: 'Toca num tubo para o pendurar na balança',
        level: 'Desliza o ar até o braço ficar nivelado, ou toca no braço',
        next: 'Toca noutro tubo',
        air: 'Toca no tubo de ar para comparar',
        done: 'Toca num tubo para o pesar outra vez',
      },
      slider: 'Ar tirado da caixa',
      unit: {
        kid: { one: 'milionésimo de mg', few: 'milionésimos de mg', many: 'milionésimos de mg', other: 'milionésimos de mg' },
        sci: { one: '× 10⁻⁶ mg', few: '× 10⁻⁶ mg', many: '× 10⁻⁶ mg', other: '× 10⁻⁶ mg' },
      },
      buttons: { auto: 'Nivelar o braço', off: 'Tirar o tubo' },
      board: { title: 'Pesar o rádon, 1910', mass: 'milionésimos de mg', reading: 'leitura', guess: 'palpite de 1909: 176', found: '1910, pesado: 216 a 227', today: 'hoje: 222', times: 'rádon {n} vezes mais pesado' },
      says: {
        hang: {
          kid: 'O tubo vai para o gancho e o braço inclina-se. Agora equilibra-o: tira ar da caixa, ou toca no braço.',
          sci: 'Amostra {id} no gancho. Equilibra-a baixando a pressão na caixa: a ampola de quartzo do outro braço perde impulsão.',
        },
        hangAir: { kid: 'Um tubo do mesmo tamanho, cheio de ar. Mais leve ou mais pesado?', sci: 'Um tubo do mesmo volume cheio de ar, para comparar.' },
        level: {
          kid: 'Nivelado! Este grãozinho de rádon pesa {m} {u}, cerca de um centésimo de um grão de sal.',
          sci: 'Equilibrado: {m} {u} para {v} × 10⁻³ mm³ de gás a 0 °C e 1 atm.',
        },
        levelAir: {
          kid: 'Nivelado: o ar pesa só {m} {u}. O rádon é mais de sete vezes mais pesado!',
          sci: 'Ar, o mesmo volume: {m} {u}, por isso este rádon é {n} vezes mais denso (hoje: 9,73 contra 1,29 g/L a 0 °C, 7,5 vezes).',
        },
        all: {
          kid: 'Os cinco pesados! Um átomo de rádon é cerca de 220 vezes mais pesado do que um átomo de hidrogénio: o gás mais pesado que existe.',
          sci: 'Cinco amostras: pesos atómicos de 216 a 227 em 1910; hoje 222, que é o rádio-226 menos uma partícula alfa.',
        },
        off: { kid: 'O tubo volta para o suporte.', sci: 'Amostra retirada.' },
        pickFirst: { kid: 'Primeiro pendura um tubo na balança: toca num do suporte.', sci: 'Ainda não há amostra no gancho.' },
      },
      panel: {
        kid: [
          'Em 1909, Gray e Ramsay calcularam pelo ponto de ebulição quanto pesam os átomos de rádon, e enganaram-se: 176. A única maneira de ter a certeza era pesar algum.',
          'Por isso, em 1910, pesaram tubos de rádon gasoso do tamanho de um grão de sal numa balança de quartzo tão delicada que não usava pesos: uma bola de vidro oca no outro braço flutua um pouco no ar, como uma bola na água. Tira ar da caixa e a bola flutua menos, até o braço ficar nivelado.',
          'Cada grãozinho pesava menos de um milésimo de miligrama. Um átomo de rádon mostrou ser cerca de 220 vezes mais pesado do que um átomo de hidrogénio: o gás mais pesado de todos.',
        ],
        sci: [
          'O artigo de 1909 pôs o peso atómico em 176 (a partir dos pontos de ebulição e críticos do árgon, do crípton e do xénon num arco) e acrescentou: «Até a densidade real do gás ter sido determinada por pesagem, tem de ficar em dúvida».',
          'Ramsay e Gray, Comptes rendus 151, 126 (1910): uma microbalança de quartzo (do modelo de Steele e Grant), sensível a cerca de um milionésimo de miligrama, equilibrada mudando a pressão na sua caixa, e assim a impulsão de uma ampola de quartzo num dos braços. Cinco amostras seladas em capilares finos, de 58,5 a 73,0 × 10⁻³ mm³ de gás com 564 a 722 × 10⁻⁶ mg, deram pesos atómicos de 216 a 227. O mesmo artigo propôs o nome niton. A balança deles está no Science Museum, em Londres.',
          'Hoje: rádon-222, 222,018 u, do rádio-226 pela perda de uma partícula alfa. 9,73 g/L a 0 °C, o gás mais denso, contra 1,29 g/L do ar.',
        ],
      },
    },
  },
  pl: {
    title: 'W kapilarze, 1909',
    greet: {
      kid: 'Jesteśmy w środku obrazu, zmniejszeni tak, że jesteśmy mniejsi od pyłku kurzu: ten szklany tunel to cieniutka jak włos rurka, której Gray i Ramsay użyli w 1909 roku. Srebrna ściana za tobą to rtęć. Przed nami, tam gdzie rurka się zwęża, jest radon. Historia obrazu jest na sztalugach.',
      sci: 'W kapilarze z 1909 roku, o średnicy około 1/20 mm, narysowanej 160 000 razy większej. Za tobą nitka rtęci, która sprężała gaz; przed nami wyciągnięty koniec rurki w zimnym płaszczu, gdzie radon się skrapla. Turkusowe kulki to atomy radonu (prawdziwe nadal byłyby o wiele za małe, żeby je zobaczyć). Historia obrazu jest na sztalugach.',
    },
    talk: {
      kid: [
        'Moje atomy rozpadają się same z siebie, a malutkie okruchy, które wystrzeliwują, sprawiają, że świeci szkło, a także moje zamrożone kryształki. Dlatego świecę bez żadnej lampy.',
        'W 1910 roku Gray i Ramsay dali mi własne imię: niton, od łacińskiego słowa oznaczającego świecący. Później wygrała nazwa radon.',
        'Oglądali mnie pod mikroskopem. Cała kropla ciekłego radonu miała około ćwierć milimetra długości.',
        'Połowa każdego radonu znika w niecałe cztery dni, więc Gray i Ramsay zawsze musieli pracować szybko.',
      ],
      sci: [
        'Emanacja z 0,2111 g radu, zbierana przez siedem dni: około 0,09 mm³ gazu w 0 °C i pod ciśnieniem 1 atm. Jako ciecz zajmowała około 0,00025 mm³, jakieś 0,24 mm kapilary.',
        'Świecenie to radioluminescencja: cząstki alfa radonu-222 (okres półtrwania 3,8 dnia) i jego krótko żyjących produktów rozpadu wzbudzają szkło i samo ciało stałe.',
        'Niton, od łacińskiego nitens, świecący, to nazwa, którą zaproponowali w 1910 roku; radon stał się nazwą oficjalną później.',
        'Z ich prężności pary punkt krytyczny: 104,5 °C przy 47 450 mm słupa rtęci, około 62 atm (dziś około 104 °C i 6,3 MPa).',
      ],
    },
    leave: {
      kid: 'Jeszcze jedno, zanim pójdziesz: jestem gazem szlachetnym jak neon, a jednak nigdy nie trafiam do neonu. Ołowiana skrzynka w pracowni neonów powie ci dlaczego.',
      sci: 'Zanim pójdziesz: radon jest gazem szlachetnym jak neon, a jednak żadnego neonu się nim nie napełnia. Ołowiana skrzynka w pracowni neonów mówi dlaczego.',
    },
    cold: {
      label: 'Zimna kąpiel',
      title: 'Chłodzenie radonu',
      tags: { room: 'w pokoju', boil: 'wrze', freeze: 'zamarza', red: 'koniec czerwieni', air: 'ciekłe powietrze' },
      hints: {
        start: 'Dotknij termometru tuż poniżej −62 °C',
        cooling: 'Patrz na radon',
        liquid: 'Dotknij termometru poniżej −71 °C, żeby go zamrozić',
        solid: 'Dotknij kranu ciekłego powietrza, żeby zobaczyć najzimniejsze świecenie',
        coldest: 'Dotknij termometru wyżej, żeby go z powrotem ogrzać',
      },
      slider: 'Temperatura kąpieli',
      buttons: { liquid: 'Tuż poniżej −62 °C', freeze: 'Zamroź', air: 'Wlej ciekłe powietrze', warm: 'Z powrotem do temperatury pokojowej' },
      states: { gas: 'gazem', liquid: 'cieczą', solid: 'ciałem stałym' },
      rows: { state: 'Radon jest', pressure: 'Ciśnienie na niego' },
      says: {
        condense: {
          kid: 'W −62 °C radon zamienia się w ciecz! Atomy pędzą do czubka i tworzą kroplę przezroczystą jak woda, a szkło wokół zaczyna świecić.',
          sci: 'Poniżej −62 °C (przy 1 atm) skrapla się: bezbarwna, przezroczysta ciecz, „jak woda”, która pobudza szkło do fosforescencji.',
        },
        freeze: {
          kid: 'W −71 °C zamarza. Teraz zamrożony radon świeci sam z siebie, jak malutka stalowoniebieska lampka!',
          sci: 'W −71 °C krzepnie i staje się nieprzezroczysty, a ciało stałe „świeci z wielkim blaskiem, jak mała, stalowoniebieska lampa łukowa”.',
        },
        yellow: { kid: 'Jeszcze zimniej, i świecenie robi się żółte.', sci: 'Przy dalszym chłodzeniu fosforescencja staje się żółta.' },
        red: { kid: 'W ciekłym powietrzu, w około −190 °C, świeci jaskrawo na pomarańczowoczerwono!', sci: 'W ciekłym powietrzu, około −190 °C: „jaskrawo pomarańczowoczerwony”.' },
        redGone: { kid: 'Cieplej niż −118 °C, i czerwień znika, nagle.', sci: 'Przy ogrzewaniu czerwona fosforescencja „znika dość gwałtownie w −118°”.' },
        blue: { kid: 'Jeszcze cieplej: znów stalowoniebieski.', sci: 'Barwy wracają w odwrotnej kolejności: stalowoniebieska blisko temperatury topnienia.' },
        melt: { kid: 'W −71 °C topi się i znowu jest przezroczystą cieczą.', sci: 'Topi się w −71 °C i znów jest przezroczysty.' },
        boil: { kid: 'Cieplej niż −62 °C wrze, a atomy znów odlatują jako gaz.', sci: 'Powyżej temperatury wrzenia odparowuje: znów gaz.' },
        pour: { kid: 'Ciekłe powietrze wlewa się do kąpieli wokół rurki i bulgocze w około −190 °C.', sci: 'Ciekłe powietrze w płaszczu: około −190 °C.' },
        warm: { kid: 'Kąpiel spływa, a rurka ogrzewa się do temperatury pokojowej.', sci: 'Kąpiel usunięta: z powrotem do temperatury pokojowej.' },
        look: {
          gas: {
            kid: 'Radon jako gaz. Nie dałoby się go w ogóle zobaczyć, więc tutaj jego atomy to turkusowe kulki. Ochłodź go, żeby go złapać.',
            sci: 'Gazowy radon wypełnia rurkę; zdradzałoby go tylko słabe świecenie szkła. Turkusowe kulki to jego atomy.',
          },
          liquid: {
            kid: 'Ciekły radon, przezroczysty jak woda. Światło nie jest w kropli: to jej promieniowanie sprawia, że świeci szkło.',
            sci: 'Bezbarwny i przezroczysty; barwa to fosforescencja szkła.',
          },
          solid: {
            kid: 'Zamrożony radon świecący własnym światłem. Bez lampy, bez prądu: tylko jego własna promieniotwórczość.',
            sci: 'Nieprzezroczyste ciało stałe, radioluminescencyjne: wzbudzane przez własne cząstki alfa i cząstki jego produktów rozpadu.',
          },
        },
      },
      panel: {
        kid: [
          'Gray i Ramsay włożyli rurkę do zimnej kąpieli i oglądali radon pod mikroskopem. Wybierz temperaturę: dotknij termometru, przesuń suwak tutaj albo wlej ciekłe powietrze.',
          'W −62 °C gaz staje się przezroczystą cieczą. W −71 °C zamarza i świeci sam z siebie: na stalowoniebiesko, potem na żółto, gdy robi się zimniej, a w ciekłym powietrzu na pomarańczowoczerwono. Ogrzej go, a barwy wrócą w odwrotnej kolejności; czerwień gaśnie nagle w −118 °C.',
          'Całe to światło bierze się z własnej promieniotwórczości radonu: jego atomy się rozpadają, a okruchy, które wystrzeliwują, sprawiają, że rzeczy świecą.',
        ],
        sci: [
          'Gray i Ramsay, J. Chem. Soc. 95, 1073 (1909): temperatura wrzenia −62 °C pod ciśnieniem atmosferycznym, temperatura topnienia −71 °C, odczytane termometrem pentanowym i obserwowane pod mikroskopem z obiektywem o ogniskowej około jednego cala (dziś: −61,7 °C i −71 °C).',
          'Ciecz jest „bezbarwna i przezroczysta, jak woda” i pobudza szkło do fosforescencji. Ciało stałe świeci „jak mała, stalowoniebieska lampa łukowa”, przy dalszym chłodzeniu żółknie, a w ciekłym powietrzu jest „jaskrawo pomarańczowoczerwone”; przy ogrzewaniu kolejność się odwraca, a czerwień znika „dość gwałtownie w −118°”. Artykuł nie podaje temperatury dla żółci: sala płynnie łączy barwy.',
          'Stany skupienia wynikają z ich tablicy prężności pary (od 500 mm słupa rtęci w 202,6 K do 47 450 mm w punkcie krytycznym, 377,5 K): gdzie ciśnienie na radon przekracza jego prężność pary, jest cieczą; poniżej 500 mm jest ciałem stałym.',
        ],
      },
    },
    glass: {
      label: 'Trzy rodzaje szkła',
      title: 'Które szkło świeci na jaki kolor?',
      names: { silica: 'krzemionka', lead: 'szkło ołowiowo-potasowe', soda: 'szkło sodowe' },
      tags: { silica: 'krzemionka', lead: 'ołowiowo-potasowe', soda: 'szkło sodowe', wheel: 'ściśnij' },
      hints: {
        squeeze: 'Dotknij koła, żeby ścisnąć radon w ciecz',
        glass: 'Dotknij szkła, żeby zrobić z niego rurkę',
        hard: 'Dotknij koła jeszcze raz, żeby ścisnąć mocno',
        solid: 'Ogrzej radon, jest zamarznięty',
        again: 'Dotknij innego szkła albo koła, żeby puścić',
      },
      slider: 'Ciśnienie na radon',
      buttons: { squeeze: 'Ściśnij', hard: 'Ściśnij mocno', release: 'Puść' },
      rows: { pressure: 'Ciśnienie na radon', vapour: 'Jego prężność pary', glass: 'Szkło' },
      says: {
        silica: { kid: 'Krzemionka: radon sprawia, że świeci na niebiesko.', sci: 'W krzemionce niebieska.' },
        lead: { kid: 'Szkło ołowiowo-potasowe: teraz świecenie jest niebieskozielone. Ten sam radon, inne szkło!', sci: 'W szkle ołowiowo-potasowym niebieskozielona.' },
        soda: { kid: 'Szkło sodowe, jak w szybie okiennej: świecenie robi się liliowe.', sci: 'W szkle sodowym liliowa.' },
        pinkBlue: {
          kid: 'Mocno ściśnięty w szkle sodowym świeci naraz na niebiesko i różowo, jak płomień gazu zwanego cyjanem. Gray i Ramsay napisali dokładnie to!',
          sci: '„Przy silnym sprężeniu w szkle sodowym barwa przypomina płomień cyjanu, jednocześnie niebieski i różowy.”',
        },
        hardOther: { kid: 'Mocno ściśnięte szkło świeci trochę jaśniej.', sci: 'Silnie sprężony. Tylko w szkle sodowym zauważyli zmianę barwy.' },
        squeezed: {
          kid: 'Rtęć napiera, i przy ciśnieniu około 14 razy większym niż ciśnienie powietrza radon staje się cieczą, nawet ciepły! Tak Gray i Ramsay zrobili swoją kroplę.',
          sci: 'W 20 °C jego prężność pary wynosi około 10 700 mm słupa rtęci (14 atm): sprężony ponad nią gaz się skrapla, jak w ich zmodyfikowanym aparacie Andrewsa.',
        },
        release: { kid: 'Rtęć puszcza. Ciepły radon znów staje się gazem.', sci: 'Bez ciśnienia: powyżej temperatury wrzenia ciecz odparowuje.' },
        noLiquid: {
          kid: 'Jasne świecenie wymaga ciekłego radonu. Ściśnij go kołem albo ochłodź tuż poniżej −62 °C.',
          sci: 'Barwy należą do cieczy: najpierw go spręż albo ochłodź poniżej temperatury wrzenia.',
        },
        frozen: {
          kid: 'Radon jest zamarznięty, więc teraz świeci sam. Ogrzej go trochę, żeby znów zobaczyć świecące szkło.',
          sci: 'Ciało stałe: jego własna radioluminescencja przyćmiewa szkło. Ogrzej go powyżej −71 °C.',
        },
      },
      panel: {
        kid: [
          'Gray i Ramsay zauważyli coś dziwnego: sam ciekły radon jest przezroczysty, a jednak świeci, i to na kolor zależny od szkła rurki. Tak naprawdę świeci szkło, rozpalone promieniowaniem radonu.',
          'Dotknij szkła, żeby zrobić z niego rurkę: krzemionka świeci na niebiesko, szkło ołowiowo-potasowe na niebieskozielono, szkło sodowe na liliowo.',
          'Koło pcha rtęć i ściska radon. Ściśnięty wystarczająco mocno staje się cieczą nawet w temperaturze pokojowej. Ściśnij go mocno w szkle sodowym i patrz!',
        ],
        sci: [
          '„Sama jednak fosforyzuje i świeci barwą zależną od rodzaju szkła rurki, w której jest zamknięta; może słuszniej byłoby powiedzieć, że pobudza szkło do fosforescencji” (1909): niebieską w krzemionce, niebieskozieloną w szkle ołowiowo-potasowym, liliową w szkle sodowym.',
          'Skroplili gaz przez sprężenie w temperaturze pokojowej w zmodyfikowanym aparacie Andrewsa, a potem otaczali go kąpielami o różnych temperaturach. Czerwona wskazówka tarczy to jego prężność pary z ich tablicy: zwiększ ciśnienie ponad nią, a gaz się skropli. Powyżej temperatury krytycznej, 104,5 °C, żadne ciśnienie by tego nie zrobiło.',
          'Silnie sprężona w szkle sodowym barwa „przypomina płomień cyjanu, jednocześnie niebieski i różowy”. Każde szkło było osobną rurką; tutaj rurka zmienia się, gdy dotkniesz któregoś.',
        ],
      },
    },
    weigh: {
      label: 'Mikrowaga',
      title: 'Ważenie okruszka gazu',
      tags: { air: 'powietrze', year: '1910' },
      hints: {
        pick: 'Dotknij rurki, żeby zawiesić ją na wadze',
        level: 'Przesuń suwak powietrza, aż belka będzie pozioma, albo dotknij belki',
        next: 'Dotknij innej rurki',
        air: 'Dotknij rurki z powietrzem, żeby porównać',
        done: 'Dotknij rurki, żeby zważyć ją jeszcze raz',
      },
      slider: 'Powietrze wypuszczone z obudowy',
      unit: {
        kid: { one: 'milionowa część mg', few: 'milionowe części mg', many: 'milionowych części mg', other: 'milionowej części mg' },
        sci: { one: '× 10⁻⁶ mg', few: '× 10⁻⁶ mg', many: '× 10⁻⁶ mg', other: '× 10⁻⁶ mg' },
      },
      buttons: { auto: 'Wypoziomuj belkę', off: 'Zdejmij rurkę' },
      board: { title: 'Ważenie radonu, 1910', mass: 'w milionowych częściach mg', reading: 'odczyt', guess: 'w 1909 zgadli: 176', found: '1910, zważony: 216 do 227', today: 'dziś: 222', times: 'radon {n} razy cięższy' },
      says: {
        hang: {
          kid: 'Rurka trafia na haczyk i belka się przechyla. Teraz ją zrównoważ: wypuść powietrze z obudowy albo dotknij belki.',
          sci: 'Próbka {id} na haczyku. Zrównoważ ją, obniżając ciśnienie w obudowie: kwarcowa bańka na drugim ramieniu traci wypór.',
        },
        hangAir: { kid: 'Rurka tej samej wielkości, pełna powietrza. Lżejsza czy cięższa?', sci: 'Rurka o tej samej objętości wypełniona powietrzem, do porównania.' },
        level: {
          kid: 'Poziomo! Ten okruszek radonu waży {m} {u}, mniej więcej setną część ziarenka soli.',
          sci: 'Zrównoważone: {m} {u} na {v} × 10⁻³ mm³ gazu w 0 °C i pod ciśnieniem 1 atm.',
        },
        levelAir: {
          kid: 'Poziomo: powietrze waży tylko {m} {u}. Radon jest ponad siedem razy cięższy!',
          sci: 'Powietrze, ta sama objętość: {m} {u}, więc ten radon jest {n} razy gęstszy (dziś: 9,73 wobec 1,29 g/L w 0 °C, 7,5 razy).',
        },
        all: {
          kid: 'Wszystkie pięć zważone! Atom radonu jest około 220 razy cięższy od atomu wodoru: to najcięższy gaz, jaki istnieje.',
          sci: 'Pięć próbek: masy atomowe od 216 do 227 w 1910 roku; dziś 222, czyli rad-226 minus cząstka alfa.',
        },
        off: { kid: 'Rurka wraca do stojaka.', sci: 'Próbka zdjęta.' },
        pickFirst: { kid: 'Najpierw zawieś rurkę na wadze: dotknij którejś w stojaku.', sci: 'Na haczyku nie ma jeszcze próbki.' },
      },
      panel: {
        kid: [
          'W 1909 roku Gray i Ramsay obliczyli z temperatury wrzenia, ile ważą atomy radonu, i pomylili się: 176. Jedynym sposobem, żeby mieć pewność, było trochę go zważyć.',
          'Dlatego w 1910 roku ważyli rurki z gazowym radonem wielkości ziarenka soli na wadze z kwarcu, tak czułej, że nie używała odważników: pusta szklana kulka na drugim ramieniu trochę unosi się w powietrzu, jak piłka w wodzie. Wypuść powietrze z obudowy, a kulka unosi się słabiej, aż belka będzie pozioma.',
          'Każdy okruszek ważył mniej niż tysięczną część miligrama. Okazało się, że atom radonu jest około 220 razy cięższy od atomu wodoru: to najcięższy gaz ze wszystkich.',
        ],
        sci: [
          'Artykuł z 1909 roku podał masę atomową 176 (z temperatur wrzenia i punktów krytycznych argonu, kryptonu i ksenonu na łuku) i dodał: „Dopóki rzeczywista gęstość gazu nie zostanie wyznaczona przez ważenie, musi to pozostać wątpliwe”.',
          'Ramsay i Gray, Comptes rendus 151, 126 (1910): kwarcowa mikrowaga (według projektu Steele’a i Granta), czuła na około milionową część miligrama, równoważona zmianą ciśnienia w obudowie, a więc wyporu kwarcowej bańki na jednym ramieniu. Pięć próbek zatopionych w cienkich kapilarach, od 58,5 do 73,0 × 10⁻³ mm³ gazu o masie od 564 do 722 × 10⁻⁶ mg, dało masy atomowe od 216 do 227. Ten sam artykuł zaproponował nazwę niton. Ich waga jest w Science Museum w Londynie.',
          'Dziś: radon-222, 222,018 u, z radu-226 przez utratę cząstki alfa. 9,73 g/L w 0 °C, najgęstszy gaz, wobec 1,29 g/L dla powietrza.',
        ],
      },
    },
  },
  de: {
    title: 'In der Kapillare, 1909',
    greet: {
      kid: 'Wir sind im Bild, kleiner geschrumpft als ein Staubkorn: Dieser Glastunnel ist das haarfeine Röhrchen, das Gray und Ramsay 1909 benutzt haben. Die silberne Wand hinter dir ist Quecksilber. Vorne, wo das Röhrchen schmaler wird, ist das Radon. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'In der Kapillare von 1909, etwa 1/20 mm weit, 160 000-mal vergrößert gezeichnet. Hinter dir der Quecksilberfaden, der das Gas zusammenpresste; vorne das ausgezogene Ende des Röhrchens in einem kalten Mantel, wo das Radon kondensiert. Die türkisen Kugeln stehen für Radonatome (echte wären immer noch viel zu klein, um sie zu sehen). Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Meine Atome zerfallen ganz von selbst, und die winzigen Teilchen, die sie herausschießen, bringen das Glas zum Leuchten und auch meine gefrorenen Kristalle. Darum leuchte ich ohne jede Lampe.',
        '1910 gaben mir Gray und Ramsay einen eigenen Namen: Niton, nach dem lateinischen Wort für leuchtend. Später setzte sich der Name Radon durch.',
        'Sie haben mich unter dem Mikroskop beobachtet. Der ganze Tropfen flüssiges Radon war etwa einen Viertelmillimeter lang.',
        'Die Hälfte von jedem Radon ist in weniger als vier Tagen weg, darum mussten Gray und Ramsay immer schnell arbeiten.',
      ],
      sci: [
        'Die Emanation von 0,2111 g Radium, sieben Tage lang gesammelt: etwa 0,09 mm³ Gas bei 0 °C und 1 atm. Als Flüssigkeit füllte sie etwa 0,00025 mm³, rund 0,24 mm der Kapillare.',
        'Das Leuchten ist Radiolumineszenz: Alphateilchen von Radon-222 (Halbwertszeit 3,8 Tage) und seinen kurzlebigen Tochternukliden regen das Glas und den Feststoff selbst an.',
        'Niton, vom lateinischen nitens, leuchtend, war der Name, den sie 1910 vorschlugen; Radon wurde erst später der offizielle Name.',
        'Aus ihren Dampfdrücken der kritische Punkt: 104,5 °C bei 47 450 mm Quecksilbersäule, etwa 62 atm (heute etwa 104 °C und 6,3 MPa).',
      ],
    },
    leave: {
      kid: 'Noch etwas, bevor du gehst: Ich bin ein Edelgas wie Neon und komme doch nie in eine Leuchtreklame. Die Bleikiste in der Neonwerkstatt sagt dir, warum.',
      sci: 'Bevor du gehst: Radon ist ein Edelgas wie Neon, und doch wird keine Leuchtreklame damit gefüllt. Die Bleikiste in der Neonwerkstatt sagt, warum.',
    },
    cold: {
      label: 'Das Kältebad',
      title: 'Das Radon abkühlen',
      tags: { room: 'Zimmer', boil: 'siedet', freeze: 'gefriert', red: 'Rot erlischt', air: 'flüssige Luft' },
      hints: {
        start: 'Tippe auf das Thermometer knapp unter −62 °C',
        cooling: 'Schau auf das Radon',
        liquid: 'Tippe unter −71 °C auf das Thermometer, um es einzufrieren',
        solid: 'Tippe auf den Hahn der flüssigen Luft für das kälteste Leuchten',
        coldest: 'Tippe weiter oben auf das Thermometer, um es wieder zu erwärmen',
      },
      slider: 'Temperatur des Bades',
      buttons: { liquid: 'Knapp unter −62 °C', freeze: 'Einfrieren', air: 'Flüssige Luft eingießen', warm: 'Zurück auf Zimmertemperatur' },
      states: { gas: 'ein Gas', liquid: 'eine Flüssigkeit', solid: 'ein Feststoff' },
      rows: { state: 'Radon ist', pressure: 'Druck darauf' },
      says: {
        condense: {
          kid: 'Bei −62 °C wird das Radon flüssig! Die Atome eilen zur Spitze und werden zu einem Tropfen, klar wie Wasser, und das Glas ringsum beginnt zu leuchten.',
          sci: 'Unter −62 °C (bei 1 atm) kondensiert es: eine farblose, durchsichtige Flüssigkeit, „wie Wasser“, die das Glas zum Phosphoreszieren bringt.',
        },
        freeze: {
          kid: 'Bei −71 °C gefriert es. Jetzt leuchtet das gefrorene Radon von selbst, wie ein winziges stahlblaues Lämpchen!',
          sci: 'Bei −71 °C erstarrt es und wird undurchsichtig, und der Feststoff „leuchtet mit großer Helligkeit, wie eine kleine, stahlblaue Bogenlampe“.',
        },
        yellow: { kid: 'Noch kälter, und das Leuchten wird gelb.', sci: 'Beim weiteren Abkühlen wird die Phosphoreszenz gelb.' },
        red: { kid: 'In flüssiger Luft, bei etwa −190 °C, leuchtet es hell orangerot!', sci: 'In flüssiger Luft, etwa −190 °C: „leuchtend orangerot“.' },
        redGone: { kid: 'Wärmer als −118 °C, und das Rot ist auf einmal weg.', sci: 'Beim Erwärmen „verschwindet die rote Phosphoreszenz ziemlich plötzlich bei −118°“.' },
        blue: { kid: 'Noch wärmer: wieder stahlblau.', sci: 'Die Farben kehren in umgekehrter Reihenfolge zurück: stahlblau nahe dem Schmelzpunkt.' },
        melt: { kid: 'Bei −71 °C schmilzt es wieder zu einer klaren Flüssigkeit.', sci: 'Es schmilzt bei −71 °C und ist wieder durchsichtig.' },
        boil: { kid: 'Wärmer als −62 °C siedet es, und die Atome fliegen wieder als Gas davon.', sci: 'Oberhalb seines Siedepunkts verdampft es: wieder Gas.' },
        pour: { kid: 'Flüssige Luft strömt in das Bad um das Röhrchen und brodelt bei etwa −190 °C.', sci: 'Flüssige Luft in den Mantel: etwa −190 °C.' },
        warm: { kid: 'Das Bad läuft ab, und das Röhrchen erwärmt sich auf Zimmertemperatur.', sci: 'Bad entfernt: zurück zur Zimmertemperatur.' },
        look: {
          gas: {
            kid: 'Radongas. Du könntest es gar nicht sehen, darum sind seine Atome hier die türkisen Kugeln. Kühl es ab, um es einzufangen.',
            sci: 'Radongas füllt das Röhrchen; nur ein schwaches Leuchten des Glases würde es verraten. Die türkisen Kugeln stehen für seine Atome.',
          },
          liquid: {
            kid: 'Flüssiges Radon, klar wie Wasser. Das Licht ist nicht im Tropfen: Seine Strahlung bringt das Glas zum Leuchten.',
            sci: 'Farblos und durchsichtig; die Farbe ist das phosphoreszierende Glas.',
          },
          solid: {
            kid: 'Gefrorenes Radon, das mit eigenem Licht leuchtet. Keine Lampe, kein Strom: nur seine eigene Radioaktivität.',
            sci: 'Ein undurchsichtiger Feststoff, radiolumineszent: angeregt von seinen eigenen Alphateilchen und denen seiner Tochternuklide.',
          },
        },
      },
      panel: {
        kid: [
          'Gray und Ramsay stellten ihr Röhrchen in ein Kältebad und beobachteten das Radon unter dem Mikroskop. Wähle die Temperatur: Tippe auf das Thermometer, schiebe sie hier, oder gieß flüssige Luft ein.',
          'Bei −62 °C wird das Gas zu einer klaren Flüssigkeit. Bei −71 °C gefriert es und leuchtet von selbst: stahlblau, dann gelb, wenn es kälter wird, und orangerot in flüssiger Luft. Erwärme es, und die Farben kommen in umgekehrter Reihenfolge zurück; das Rot erlischt plötzlich bei −118 °C.',
          'All dieses Licht kommt aus der eigenen Radioaktivität des Radons: Seine Atome zerfallen, und die Teilchen, die sie herausschießen, bringen Dinge zum Leuchten.',
        ],
        sci: [
          'Gray und Ramsay, J. Chem. Soc. 95, 1073 (1909): Siedepunkt −62 °C bei Atmosphärendruck, Schmelzpunkt −71 °C, mit einem Pentanthermometer abgelesen und unter einem Mikroskop mit einem Objektiv von etwa einem Zoll Brennweite beobachtet (heute: −61,7 °C und −71 °C).',
          'Die Flüssigkeit ist „farblos und durchsichtig, wie Wasser“ und bringt das Glas zum Phosphoreszieren. Der Feststoff leuchtet „wie eine kleine, stahlblaue Bogenlampe“, wird beim weiteren Abkühlen gelb und in flüssiger Luft „leuchtend orangerot“; beim Erwärmen kehrt sich die Reihenfolge um, und das Rot verschwindet „ziemlich plötzlich bei −118°“. Für das Gelb nennt der Artikel keine Temperatur: Der Raum blendet die Farben dazwischen über.',
          'Die Phasen folgen ihrer Dampfdrucktabelle (500 mm Quecksilbersäule bei 202,6 K bis 47 450 mm am kritischen Punkt, 377,5 K): Wo der Druck auf das Radon seinen Dampfdruck übersteigt, ist es flüssig; unter 500 mm ist es fest.',
        ],
      },
    },
    glass: {
      label: 'Drei Glassorten',
      title: 'Welches Glas leuchtet in welcher Farbe?',
      names: { silica: 'Quarzglas', lead: 'Bleikaliglas', soda: 'Natronglas' },
      tags: { silica: 'Quarzglas', lead: 'Bleikaliglas', soda: 'Natronglas', wheel: 'pressen' },
      hints: {
        squeeze: 'Tippe auf das Rad, um das Radon flüssig zu pressen',
        glass: 'Tippe auf ein Glas, um das Röhrchen daraus zu machen',
        hard: 'Tippe noch einmal auf das Rad, um fest zu pressen',
        solid: 'Erwärme das Radon, es ist gefroren',
        again: 'Tippe auf ein anderes Glas, oder auf das Rad, um loszulassen',
      },
      slider: 'Druck auf das Radon',
      buttons: { squeeze: 'Pressen', hard: 'Fest pressen', release: 'Loslassen' },
      rows: { pressure: 'Druck auf das Radon', vapour: 'Sein Dampfdruck', glass: 'Glas' },
      says: {
        silica: { kid: 'Quarzglas: Das Radon lässt es blau leuchten.', sci: 'In Quarzglas blau.' },
        lead: { kid: 'Bleikaliglas: Jetzt ist das Leuchten blaugrün. Dasselbe Radon, ein anderes Glas!', sci: 'In Bleikaliglas blaugrün.' },
        soda: { kid: 'Natronglas, wie eine Fensterscheibe: Das Leuchten wird lila.', sci: 'In Natronglas lila.' },
        pinkBlue: {
          kid: 'Fest gepresst in Natronglas ist das Leuchten blau und rosa zugleich, wie die Flamme eines Gases namens Dicyan. Genau das haben Gray und Ramsay geschrieben!',
          sci: '„Stark zusammengepresst in Natronglas erinnert die Farbe an die Dicyanflamme, zugleich blau und rosa.“',
        },
        hardOther: { kid: 'Fest gepresst leuchtet das Glas ein bisschen heller.', sci: 'Stark zusammengepresst. Nur in Natronglas bemerkten sie eine Farbänderung.' },
        squeezed: {
          kid: 'Das Quecksilber drückt hinein, und bei etwa dem 14-fachen Luftdruck wird das Radon flüssig, sogar warm! So haben Gray und Ramsay ihren Tropfen gemacht.',
          sci: 'Bei 20 °C beträgt sein Dampfdruck etwa 10 700 mm Quecksilbersäule (14 atm): darüber hinaus zusammengepresst kondensiert das Gas, wie in ihrem abgewandelten Andrews-Apparat.',
        },
        release: { kid: 'Das Quecksilber lässt los. Warmes Radon wird wieder zu Gas.', sci: 'Druck weg: oberhalb seines Siedepunkts verdampft die Flüssigkeit.' },
        noLiquid: {
          kid: 'Das helle Leuchten braucht flüssiges Radon. Press es mit dem Rad, oder kühl es knapp unter −62 °C.',
          sci: 'Die Farben gehören zur Flüssigkeit: erst zusammenpressen oder unter den Siedepunkt kühlen.',
        },
        frozen: {
          kid: 'Das Radon ist gefroren, also leuchtet es jetzt selbst. Erwärme es ein wenig, um das Glas wieder leuchten zu sehen.',
          sci: 'Fest: Seine eigene Radiolumineszenz überstrahlt das Glas. Erwärme es über −71 °C.',
        },
      },
      panel: {
        kid: [
          'Gray und Ramsay fiel etwas Seltsames auf: Flüssiges Radon ist selbst klar, und doch leuchtet es, und die Farbe hängt vom Glas seines Röhrchens ab. Eigentlich leuchtet das Glas, angeregt von der Strahlung des Radons.',
          'Tippe auf ein Glas, um das Röhrchen daraus zu machen: Quarzglas leuchtet blau, Bleikaliglas blaugrün, Natronglas lila.',
          'Das Rad schiebt das Quecksilber und presst das Radon zusammen. Fest genug gepresst wird es sogar bei Zimmertemperatur flüssig. Press es fest in Natronglas und schau zu!',
        ],
        sci: [
          '„Sie selbst ist jedoch phosphoreszierend und leuchtet in einer Farbe, die mit der Art des Glases wechselt, aus dem das Röhrchen besteht, in dem sie eingeschlossen ist; richtiger wäre vielleicht zu sagen, dass sie das Glas zum Phosphoreszieren bringt“ (1909): blau in Quarzglas, blaugrün in Bleikaliglas, lila in Natronglas.',
          'Sie verflüssigten das Gas durch Zusammenpressen bei Zimmertemperatur in einem abgewandelten Andrews-Apparat und umgaben es dann mit Bädern verschiedener Temperatur. Der rote Zeiger der Skala ist sein Dampfdruck aus ihrer Tabelle: Erhöhe den Druck darüber, und das Gas kondensiert. Oberhalb der kritischen Temperatur, 104,5 °C, ginge das bei keinem Druck.',
          'Stark zusammengepresst in Natronglas „erinnert die Farbe an die Dicyanflamme, zugleich blau und rosa“. Jedes Glas war ein eigenes Röhrchen; hier wechselt das Röhrchen, wenn du eines antippst.',
        ],
      },
    },
    weigh: {
      label: 'Die Mikrowaage',
      title: 'Ein Krümelchen Gas wiegen',
      tags: { air: 'Luft', year: '1910' },
      hints: {
        pick: 'Tippe auf ein Röhrchen, um es an die Waage zu hängen',
        level: 'Schieb die Luft, bis der Balken waagrecht ist, oder tippe auf den Balken',
        next: 'Tippe auf ein anderes Röhrchen',
        air: 'Tippe zum Vergleich auf das Röhrchen mit Luft',
        done: 'Tippe auf ein Röhrchen, um es noch einmal zu wiegen',
      },
      slider: 'Aus dem Gehäuse gelassene Luft',
      unit: {
        kid: { one: 'Millionstel Milligramm', few: 'Millionstel Milligramm', many: 'Millionstel Milligramm', other: 'Millionstel Milligramm' },
        sci: { one: '× 10⁻⁶ mg', few: '× 10⁻⁶ mg', many: '× 10⁻⁶ mg', other: '× 10⁻⁶ mg' },
      },
      buttons: { auto: 'Balken ausgleichen', off: 'Röhrchen abnehmen' },
      board: { title: 'Radon wiegen, 1910', mass: 'Millionstel mg', reading: 'Anzeige', guess: '1909 geschätzt: 176', found: '1910 gewogen: 216 bis 227', today: 'heute: 222', times: 'Radon {n}-mal schwerer' },
      says: {
        hang: {
          kid: 'Das Röhrchen kommt an den Haken, und der Balken kippt. Jetzt gleiche ihn aus: Lass Luft aus dem Gehäuse, oder tippe auf den Balken.',
          sci: 'Probe {id} am Haken. Gleiche sie aus, indem du den Druck im Gehäuse senkst: Der Quarzkolben am anderen Arm verliert Auftrieb.',
        },
        hangAir: { kid: 'Ein gleich großes Röhrchen voller Luft. Leichter oder schwerer?', sci: 'Ein Röhrchen gleichen Volumens mit Luft, zum Vergleich.' },
        level: {
          kid: 'Waagrecht! Dieses Krümelchen Radon wiegt {m} {u}, etwa ein Hundertstel eines Salzkorns.',
          sci: 'Ausgeglichen: {m} {u} für {v} × 10⁻³ mm³ Gas bei 0 °C und 1 atm.',
        },
        levelAir: {
          kid: 'Waagrecht: Die Luft wiegt nur {m} {u}. Radon ist mehr als siebenmal schwerer!',
          sci: 'Luft, gleiches Volumen: {m} {u}, also ist dieses Radon {n}-mal so dicht (heute: 9,73 gegenüber 1,29 g/L bei 0 °C, 7,5-mal).',
        },
        all: {
          kid: 'Alle fünf gewogen! Ein Radonatom ist etwa 220-mal so schwer wie ein Wasserstoffatom: das schwerste Gas, das es gibt.',
          sci: 'Fünf Proben: Atomgewichte von 216 bis 227 im Jahr 1910; heute 222, also Radium-226 minus ein Alphateilchen.',
        },
        off: { kid: 'Das Röhrchen kommt zurück in den Ständer.', sci: 'Probe abgenommen.' },
        pickFirst: { kid: 'Häng zuerst ein Röhrchen an die Waage: Tippe auf eines im Ständer.', sci: 'Noch keine Probe am Haken.' },
      },
      panel: {
        kid: [
          '1909 rechneten Gray und Ramsay aus dem Siedepunkt aus, wie schwer Radonatome sind, und lagen falsch: 176. Sicher sein konnte man nur, wenn man welches wog.',
          'Darum wogen sie 1910 Röhrchen mit Radongas, so groß wie ein Salzkorn, auf einer Waage aus Quarz, so empfindlich, dass sie ohne Gewichte auskam: Eine hohle Glaskugel am anderen Arm schwebt ein bisschen in der Luft, wie ein Ball im Wasser. Lass Luft aus dem Gehäuse, und die Kugel schwebt weniger, bis der Balken waagrecht ist.',
          'Jedes Krümelchen wog weniger als ein Tausendstel Milligramm. Ein Radonatom erwies sich als etwa 220-mal so schwer wie ein Wasserstoffatom: das schwerste Gas von allen.',
        ],
        sci: [
          'Der Artikel von 1909 setzte das Atomgewicht auf 176 (aus den Siede- und kritischen Punkten von Argon, Krypton und Xenon auf einem Kreisbogen) und fügte hinzu: „Bis die tatsächliche Dichte des Gases durch Wägung bestimmt ist, muss es zweifelhaft bleiben“.',
          'Ramsay und Gray, Comptes rendus 151, 126 (1910): eine Quarz-Mikrowaage (nach der Bauart von Steele und Grant), empfindlich auf etwa ein Millionstel Milligramm, ausgeglichen durch Ändern des Drucks im Gehäuse, also des Auftriebs eines Quarzkolbens an einem Arm. Fünf in feine Kapillaren eingeschmolzene Proben, 58,5 bis 73,0 × 10⁻³ mm³ Gas mit 564 bis 722 × 10⁻⁶ mg, ergaben Atomgewichte von 216 bis 227. Derselbe Artikel schlug den Namen Niton vor. Ihre Waage steht im Science Museum in London.',
          'Heute: Radon-222, 222,018 u, aus Radium-226 durch den Verlust eines Alphateilchens. 9,73 g/L bei 0 °C, das dichteste Gas, gegenüber 1,29 g/L bei Luft.',
        ],
      },
    },
  },
}
