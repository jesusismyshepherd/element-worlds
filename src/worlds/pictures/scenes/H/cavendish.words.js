// The words of hydrogen's Cavendish room ("A fire that makes water?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/H.js (the
// easel shows it); the room shows it happening and adds to it.
// Sources (checked 2026-10-31 against the Philosophical Transactions texts):
// - Cavendish, "Three Papers, Containing Experiments on Factitious Air", Phil. Trans. 56 (1766): "I know of
//   only three metallic substances, namely, zinc, iron and tin, that generate inflammable air by solution in
//   acids", only in diluted vitriolic acid or spirit of salt; one ounce of zinc about 356 ounce measures, iron
//   wire about 412, tinfoil 202, zinc "just the same whichever of these acids"; "8760 times lighter than water,
//   or eleven times lighter than common air"; "their phlogiston flies off ... and forms the inflammable air".
//   The quart bottle: 1 to 9 no fire at the mouth (in the belly, very little noise), 2 to 8 "a moderately loud
//   noise", 3 to 7 "a very loud noise" (no light inside), 4 to 6 a little louder, equal parts much the same
//   (a light inside), 6 to 4 not very loud, burning on, 7 to 3 "a very gentle bounce or rather puff", 8 to 2
//   fire "without any noise", in the neck only; "cannot burn without the assistance of common air". The pure
//   bottle is today's classroom test, not his, and the words say so.
// - Cavendish, "Experiments on Air", Phil. Trans. 74 (1784), read 15 January 1784; made "in the summer of the
//   year 1781"; Warltire's trial in Priestley's last volume (the glass "became dewy"); "423 measures of
//   inflammable air are nearly sufficient to completely phlogisticate 1000 of common air", leaving "very little
//   more than four-fifths"; 500000 grain measures burnt with common air in a cylinder eight feet long gave
//   "upwards of 135 grains of water", with "no taste nor smell"; the globe "holding 8800 grain measures,
//   furnished with a brass cock", exhausted, filled, fired by electricity, refilled (it held about a sixth):
//   19500 grain measures of dephlogisticated air and 37000 of inflammable; about 30 grains of liquor, "sensibly
//   acid to the taste" ("nitrous acid", nitric acid today); "water consists of dephlogisticated air united to phlogiston".
// - Modern values: hydrogen 0.084 g/L and air 1.20 g/L at 20 °C; burns in air from about 4% (upward) to 75%;
//   2 H2 + O2 -> 2 H2O, 29.5% hydrogen in air uses up both; the flame is fastest near 40%.
// - Lives: 13 Great Marlborough Street (his father's house, its stables the laboratory) until 1783; the notes to
//   his housekeeper and the back staircase are told of his house at Clapham (the Clapham Society). Lavoisier and
//   Laplace made water in June 1783, after Blagden told them of Cavendish's results; Watt's letter of April 1783;
//   the Méthode de nomenclature chimique (1787), "gaz hydrogène"; the 1785 bubble "not more than 1/120 part of
//   the whole" (argon, 1894); the Earth's density 5.48 (1798).
// Placeholders: {n}.
export const CAVENDISH_WORDS = {
  en: {
    title: 'Cavendish\'s laboratory, 1781',
    greet: {
      kid: 'We are inside the picture: Henry Cavendish\'s laboratory in London, on a summer night in 1781. He was terribly shy, but here he caught a gas that goes pop, and found that when it burns it makes water. The picture\'s story is on the easel beside you.',
      sci: 'London, summer 1781, by candlelight: Henry Cavendish\'s laboratory (he lived and worked in his father\'s house in Great Marlborough Street until 1783). His inflammable air from metals, his bottles of 1766, and the globe in which he made water. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Cavendish was so shy that he left notes for his housekeeper instead of talking to her. People say he even had a second staircase built so that he would not meet anyone on the stairs!',
        'He was one of the richest people in England, but he spent his money on books and instruments, and he lent his books to other scientists.',
        'In 1798 he worked out how heavy the whole Earth is, with lead balls and a rod hanging from a thin wire. People called it weighing the world.',
      ],
      sci: [
        'Henry Cavendish (1731 to 1810), grandson of two dukes, hardly spoke to anyone: he wrote notes to his housekeeper, and it is said he had a back staircase added to his house at Clapham so as not to meet his servants.',
        'With too much dephlogisticated air his water held a little nitric acid ("nitrous acid" to him): some nitrogen had burnt too. Chasing that, in 1785 he sparked air with extra dephlogisticated air until a small bubble was left that would not react, "not more than 1/120 part of the whole". It was argon, found by Rayleigh and Ramsay in 1894.',
        'In 1797 and 1798 he measured the Earth\'s mean density with John Michell\'s torsion balance: 5.48 times that of water. Today\'s value is 5.51.',
      ],
    },
    metals: {
      label: 'Inflammable air',
      title: 'Inflammable air from metals (1766)',
      names: ['Zinc', 'Iron', 'Tin'],
      acids: ['Oil of vitriol', 'Spirit of salt'],
      air: { common: 'common air', inflammable: 'inflammable air' },
      slate: { title: 'Which metal, which acid?', done: { kid: 'Every time the same light gas!', sci: 'One gas from them all: inflammable air' } },
      hints: {
        start: 'Tap a metal, zinc, iron or tin',
        acid: 'Now tap a bottle of acid',
        metal: 'Now tap a metal',
        wait: 'Watch the jar fill with gas',
        weigh: 'Tap the full jar to weigh it',
        next: 'Tap another metal or acid',
        again: 'All three metals tried! Tap any to go again',
      },
      buttons: { weigh: 'Weigh the jar', back: 'Put the jar back' },
      says: {
        metal: [
          { kid: 'Zinc in the bottle. Now an acid!', sci: 'Granulated zinc in the bottle, under water. Now the acid.' },
          { kid: 'A coil of iron wire in the bottle. Now an acid!', sci: 'Iron wire in the bottle. Now the acid.' },
          { kid: 'Tin foil in the bottle. Now an acid!', sci: 'Tinfoil in the bottle. Now the acid.' },
        ],
        acid: [
          { kid: 'Oil of vitriol, mixed with water. Now drop in a metal!', sci: 'Diluted oil of vitriol (sulfuric acid). Now the metal.' },
          { kid: 'Spirit of salt, mixed with water. Now drop in a metal!', sci: 'Spirit of salt (hydrochloric acid). Now the metal.' },
        ],
        fizz: [
          { kid: 'Fizz! The zinc bubbles fast. The gas runs through the tube and pushes the water out of the jar.', sci: 'Zinc dissolves briskly: Zn + 2 H⁺ → Zn²⁺ + H₂. The gas is caught over water. One ounce of zinc gave Cavendish about 356 ounce measures of it.' },
          { kid: 'Fizz! The iron bubbles more slowly. Watch the water in the jar go down.', sci: 'Iron dissolves: Fe + 2 H⁺ → Fe²⁺ + H₂. An ounce of iron wire gave him about 412 ounce measures.' },
          { kid: 'The tin fizzes only slowly. Be patient and watch the jar.', sci: 'Tin dissolves slowly: Sn + 2 H⁺ → Sn²⁺ + H₂. An ounce of tinfoil gave him 202 ounce measures.' },
        ],
        filling: { kid: 'Not full yet: the gas is still pushing the water out.', sci: 'Still collecting: wait until the water has left the jar.' },
        empty: { kid: 'The jar is still full of water. Make some gas first, with a metal and an acid!', sci: 'No gas collected yet: put a metal and an acid in the bottle.' },
        already: { kid: 'There is acid in the bottle already. Tap a metal!', sci: 'The acid is in. Now the metal.' },
        full: { kid: 'The jar is full of gas! Tap it to weigh it.', sci: 'The jar is full: stopper it under water and weigh it.' },
        weighed: { kid: 'Up goes the jar of inflammable air: it is much lighter than the jar of ordinary air!', sci: 'The jar of inflammable air rises: about 14 times lighter than common air by today\'s measure. Cavendish found eleven.' },
        same: { kid: 'Zinc, iron, tin: every time the same light gas. Cavendish had found a new kind of air!', sci: 'Whichever metal, whichever acid: the same gas, just as light. One substance, which he called inflammable air.' },
        back: { kid: 'The jar goes back into the trough, full of water again.', sci: 'The jar refilled with water, ready for the next gas.' },
        needMetal: { kid: 'The bottle needs a metal: tap the zinc, the iron or the tin.', sci: 'No metal in the bottle yet.' },
        needAcid: { kid: 'The bottle needs acid: tap one of the acid bottles.', sci: 'No acid in the bottle yet.' },
      },
      panel: {
        kid: [
          'In 1766 Henry Cavendish dropped bits of zinc, iron or tin into acid mixed with water. The metal fizzed, and he led the bubbles through a bent glass tube into a jar full of water standing upside down in a trough: the gas pushed the water out and stayed in the jar. That is how you catch a gas.',
          'Zinc, iron or tin, one acid or the other: it was always the same gas, and it was very light, much lighter than air. Near a flame it burned, so he called it inflammable air. Today we call it hydrogen.',
          'These acids are dangerous: they burn skin and eyes. Only chemists use them, in a laboratory, with protection.',
        ],
        sci: [
          'Cavendish, "Three Papers, Containing Experiments on Factitious Air" (Philosophical Transactions, 1766): "I know of only three metallic substances, namely, zinc, iron and tin, that generate inflammable air by solution in acids", and only in diluted vitriolic acid or spirit of salt. He caught it over water in inverted bottles. One ounce of zinc gave about 356 ounce measures of it, iron wire about 412, tinfoil 202, and for zinc the amount was "just the same whichever of these acids it is dissolved in".',
          'Today: Zn + H₂SO₄ → ZnSO₄ + H₂ and Fe + 2 HCl → FeCl₂ + H₂. Each atom of these metals frees one molecule of hydrogen, so iron (55.8 g/mol) gives the most per ounce and tin (118.7 g/mol) the least, as he found.',
          'He weighed it: "8760 times lighter than water, or eleven times lighter than common air". Hydrogen is in fact about 14 times lighter than air (0.084 g against 1.20 g per litre at 20 °C); his gas, caught over water, was moist and not quite pure. Like most chemists of his day he explained it by phlogiston: as the metals dissolve, "their phlogiston flies off" and "forms the inflammable air".',
        ],
      },
    },
    bottles: {
      label: 'Cavendish\'s bottles',
      title: 'The pop test (1766)',
      slate: { title: 'How loud was the bang?', axis: 'inflammable air : common air, in tenths', burns: 'burns in air: 4% to 75%', just: '29.5%: just enough oxygen' },
      slider: 'Inflammable air in the bottle',
      mix: '{n} of 10 parts',
      pure: 'Pure inflammable air',
      hints: { first: 'Tap a bottle to hold the flame to it', more: 'Tap another bottle to compare the bang', all: 'All nine tried! Tap any bottle again' },
      buttons: { light: 'Hold the flame to it' },
      says: {
        results: [
          { kid: 'Nothing at the mouth! Only when the flame goes right inside does it burn, slowly and almost silently.', sci: '1 to 9: no fire at the mouth; with the flame put into the belly of the bottle it took fire and burned with very little noise. So near its lower limit a hydrogen flame spreads upward but hardly downward.' },
          { kid: 'Pop! A fairly loud bang.', sci: '2 to 8: "a moderately loud noise".' },
          { kid: 'BANG! A very loud one!', sci: '3 to 7: "a very loud noise", and no light seen in the bottle.' },
          { kid: 'BANG! The loudest of all! Cavendish heard that too.', sci: '4 to 6: a little louder still, the loudest of his trials. A little richer than the mix that uses up all the oxygen (29.5% hydrogen), the flame races through fastest.' },
          { kid: 'Bang! Just as loud, and a flash of light inside.', sci: 'Equal parts: much the same sound, and a light appeared in the bottle for a moment.' },
          { kid: 'A softer bang, and then it goes on burning inside for a moment.', sci: '6 to 4: not very loud; it went on burning in the bottle for a short time after the sound.' },
          { kid: 'Only a gentle puff, then a flame burns inside for a few seconds.', sci: '7 to 3: "a very gentle bounce or rather puff", then it burned some seconds in the belly of the bottle.' },
          { kid: 'No bang at all: a quiet flame burns in the neck, then goes out.', sci: '8 to 2: it caught fire "without any noise" and burned in the neck only; the flame never went into the belly. Above 75% hydrogen a flame cannot travel through the mixture.' },
          { kid: 'Pure gas cannot burn inside the bottle: it burns only at the mouth, where it meets the air, with a pale flame. And the flame pushed inside goes out!', sci: 'Pure hydrogen (today\'s classroom test, not in his paper): it burns quietly at the mouth, where it meets air, with a pale flame; a taper pushed inside goes out, and lights again on the way out.' },
        ],
      },
      panel: {
        kid: [
          'Cavendish filled quart bottles (about a litre each) with his inflammable air mixed with ordinary air: 1 part in 10, 2 parts, 3 parts and so on. Then he held a flame to each one, one after the other, to compare the bangs.',
          'Too little gas: no bang. About 3 or 4 parts in 10: a very loud bang! Lots of gas: only a puff, then a quiet flame. The gas needs the oxygen in the air to burn, and the loudest bang comes when there is about the right amount of each.',
          'Burning hydrogen makes water: see how the glass mists over? Never try this yourself: a bang like that can burst a bottle.',
        ],
        sci: [
          'Cavendish, 1766: a quart bottle filled with mixtures made beforehand, its mouth kept closed under water until the flame was put to it, so that the sounds could be compared one after another. 1 part to 9 would not take fire at the mouth; 2 to 8 gave "a moderately loud noise", 3 to 7 "a very loud noise", 4 to 6 a little louder, equal parts much the same with a light seen inside; 6 to 4 not very loud; 7 to 3 "a very gentle bounce or rather puff"; 8 to 2 fire "without any noise", in the neck only.',
          'Today: 2 H₂ + O₂ → 2 H₂O. Air is 20.9% oxygen, so 29.5% hydrogen uses up both exactly. Hydrogen in air burns between about 4% (a flame rising upward) and 75% by volume, and its flame is fastest near 40%. Outside that range a flame cannot spread through the mixture, which is why the 8 to 2 bottle burned only in its neck, where air came in.',
          'His conclusion: this air, "like other inflammable substances, cannot burn without the assistance of common air". Mixed with air, hydrogen explodes: it is handled with great care.',
        ],
      },
    },
    globe: {
      label: 'The spark globe',
      title: 'Making water with a spark (1781)',
      slider: 'Charge in the Leyden jar',
      slate: { title: 'Gas used up', inflammable: 'inflammable air', dephlogisticated: 'dephlogisticated air', none: 'Let the gases in, then spark!', sparks: 'Sparks: {n}', his: 'Cavendish\'s own figures, 1781' },
      hints: {
        cock: 'Tap the brass cock to let the gases in',
        crank: 'Tap the machine to charge the Leyden jar',
        spark: 'Tap the globe to send a spark',
        drop: 'Tap the drop in the globe',
        more: 'Tap the cock to let more gas in',
        book: 'Tap the book from Paris',
        fresh: 'Tap the cock for fresh jars of gas',
      },
      buttons: { cock: 'Let the gases in', crank: 'Turn the machine', spark: 'Spark!', drop: 'Look at the drop', book: 'Read the book' },
      says: {
        cock: { kid: 'In goes the mixture. Look at the jars: the inflammable air goes down twice as fast as the dephlogisticated air (the old name of oxygen).', sci: 'The exhausted globe fills from both jars: two measures of inflammable air to one of dephlogisticated air (oxygen).' },
        more: { kid: 'More gas in: two of inflammable air to one of dephlogisticated air again.', sci: 'Refilled with the same mixture, 2 to 1.' },
        full: { kid: 'The globe is full already. Charge the jar and send a spark!', sci: 'The globe holds a mixture already: fire it.' },
        crank: { kid: 'Round and round: the glass rubs on the leather, and the Leyden jar fills up with electricity.', sci: 'The glass cylinder rubbing on the leather pad charges the prime conductor; the Leyden jar stores the charge.' },
        charged: { kid: 'The jar is full of charge: listen to it crackle!', sci: 'Fully charged.' },
        empty: { kid: 'The globe is empty. Let the gases in first: tap the brass cock.', sci: 'No mixture in the globe: open the cock.' },
        fresh0: { kid: 'The jars are used up. Tap the cock for fresh ones.', sci: 'Both jars spent: open the cock for fresh ones.' },
        fresh: { kid: 'Fresh jars of gas, and a clean, dry globe. Start again!', sci: 'New jars, a dry globe: the experiment again.' },
        noCharge: { kid: 'Not enough electricity for a spark: tap the machine to charge the Leyden jar.', sci: 'Too little charge: turn the machine.' },
        first: { kid: 'Crack! A flash, and the gas is almost gone. Look: the glass has gone dewy inside!', sci: 'Fired: almost all of the mixture lost its elasticity, and the inside of the globe became dewy, "as observed by Mr. Warltire".' },
        spark: { kid: 'Crack! More dew runs down the glass.', sci: 'Another filling fired; more dew.' },
        drop: { kid: 'Crack! The dew runs together into a drop of water at the bottom. Tap it!', sci: 'The condensed liquid gathers at the bottom: tap it to see what it is.' },
        six: { kid: 'Six sparks, like Cavendish: the jars are used up, and the gas has become a little water!', sci: 'Six fillings: 37000 grain measures of inflammable air and 19500 of dephlogisticated, 1.9 to 1, his own figures. About 30 grains of liquid: water, slightly acid.' },
        noDrop: { kid: 'There is no water to look at yet: send a few sparks first.', sci: 'Too little liquid yet.' },
        water: { kid: 'Inside the drop: water molecules, each one an oxygen with two hydrogens. Tap the lens to see how they were made.', sci: 'H₂O: one oxygen atom and two hydrogen atoms. Tap the lens for what the spark did.' },
        react: { kid: 'What the spark did: two hydrogen molecules and one oxygen molecule swap partners and become two water molecules!', sci: '2 H₂ + O₂ → 2 H₂O: two volumes of hydrogen to one of oxygen, because equal volumes of gas hold equal numbers of molecules (Avogadro, 1811).' },
        close: { kid: 'The lens is empty again.', sci: 'Lens empty.' },
      },
      panel: {
        kid: [
          'In 1781 Cavendish let his inflammable air, mixed with dephlogisticated air (the name of oxygen then), into a glass globe about as big as an orange. He closed it and sent an electric spark through it from a Leyden jar, a jar that stores electricity. Crack! The gas almost vanished, and the inside of the glass went dewy.',
          'Six times he let more gas in and sparked it, and the dew ran together into a little water. Each time, about two parts of inflammable air were used up for one part of dephlogisticated air. So water is made of these two gases: two of hydrogen to one of oxygen, H₂O!',
          'His drop tasted a little sour (chemists tasted things then: never do it!). With a little too much dephlogisticated air, a trace of nitrogen burns too and makes acid. When he burned his gas with ordinary air, the water had no taste and no smell: pure water.',
        ],
        sci: [
          '"Experiments on Air", read to the Royal Society on 15 January 1784; the experiments "were made in the summer of the year 1781". Priestley had reported John Warltire\'s trial, inflammable air fired with common air in a closed glass that became dewy inside. Cavendish measured it: "423 measures of inflammable air are nearly sufficient to completely phlogisticate 1000 of common air", leaving "very little more than four-fifths" of it. Burning about 500000 grain measures of inflammable air with common air in a glass cylinder eight feet long gave "upwards of 135 grains of water", with "no taste nor smell".',
          'With dephlogisticated air: "a glass globe, holding 8800 grain measures, furnished with a brass cock" (a grain measure is the volume of a grain of water, about 0.065 mL, so about 570 mL), exhausted with an air pump, filled with the mixture and fired by electricity, then refilled and fired again, the globe holding about a sixth of the whole: 19500 grain measures of dephlogisticated air and 37000 of inflammable, 1.9 to 1. The 30 grains or so of liquid were "sensibly acid to the taste": water with a little nitric acid ("nitrous acid" to him), which formed when the dephlogisticated air was in excess.',
          'His reading, in phlogiston\'s terms: "water consists of dephlogisticated air united to phlogiston". Today: 2 H₂ + O₂ → 2 H₂O, exactly 2 to 1 by volume.',
        ],
      },
      name: {
        title: '1787: the water maker',
        kid: [
          'Cavendish thought his gas was phlogiston, the "fire stuff" that chemists then believed was inside everything that burns. In Paris, Antoine Lavoisier heard about Cavendish\'s water, and in June 1783 he and Pierre-Simon Laplace made water from the two gases too. Lavoisier said: water is not an element, it is made of two.',
          'In 1787 Lavoisier and three other French chemists gave chemistry new names. This book is where inflammable air became hydrogène, from Greek words for water and making: the water maker!',
        ],
        sci: [
          'Charles Blagden, Cavendish\'s assistant, told Lavoisier of the results in Paris in 1783; in June Lavoisier and Pierre-Simon Laplace burned the two gases and collected water, and Lavoisier read water as a compound, with no phlogiston in it. James Watt had reached a similar conclusion in a letter of April 1783; who came first was argued over long afterwards.',
          'The Méthode de nomenclature chimique (Paris, 1787) of Guyton de Morveau, Lavoisier, Berthollet and Fourcroy named the gas hydrogène, from the Greek for water and for producing: inflammable air became "gaz hydrogène". Lavoisier\'s Traité élémentaire de chimie (1789) listed it among the simple substances.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'O laboratório de Cavendish, 1781',
    greet: {
      kid: 'Estamos dentro da imagem: o laboratório de Henry Cavendish em Londres, numa noite de verão de 1781. Ele era timidíssimo, mas foi aqui que apanhou um gás que faz pum, e descobriu que, ao arder, faz água. A história da imagem está no cavalete ao teu lado.',
      sci: 'Londres, verão de 1781, à luz das velas: o laboratório de Henry Cavendish (viveu e trabalhou em casa do pai, em Great Marlborough Street, até 1783). O seu ar inflamável tirado dos metais, as suas garrafas de 1766 e o globo em que fez água. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Cavendish era tão tímido que deixava bilhetes à governanta em vez de falar com ela. Dizem que até mandou fazer uma segunda escada para não se cruzar com ninguém!',
        'Era uma das pessoas mais ricas de Inglaterra, mas gastava o dinheiro em livros e instrumentos, e emprestava os livros a outros cientistas.',
        'Em 1798 descobriu quanto pesa a Terra inteira, com bolas de chumbo e uma vara pendurada de um fio fininho. Chamaram-lhe pesar o mundo.',
      ],
      sci: [
        'Henry Cavendish (1731 a 1810), neto de dois duques, quase não falava com ninguém: escrevia bilhetes à governanta, e conta-se que mandou acrescentar uma escada de serviço à sua casa de Clapham para não se cruzar com os criados.',
        'Com ar desflogisticado a mais, a sua água trazia um pouco de ácido nítrico («ácido nitroso», dizia ele): algum azoto também tinha ardido. Seguindo essa pista, em 1785 fez saltar faíscas em ar com ar desflogisticado a mais até restar uma bolhinha que não reagia, «não mais de 1/120 do todo». Era o árgon, descoberto por Rayleigh e Ramsay em 1894.',
        'Em 1797 e 1798 mediu a densidade média da Terra com a balança de torção de John Michell: 5,48 vezes a da água. O valor de hoje é 5,51.',
      ],
    },
    metals: {
      label: 'Ar inflamável',
      title: 'Ar inflamável tirado dos metais (1766)',
      names: ['Zinco', 'Ferro', 'Estanho'],
      acids: ['Óleo de vitríolo', 'Espírito de sal'],
      air: { common: 'ar comum', inflammable: 'ar inflamável' },
      slate: { title: 'Que metal, que ácido?', done: { kid: 'Sempre o mesmo gás levezinho!', sci: 'Um só gás de todos: ar inflamável' } },
      hints: {
        start: 'Toca num metal, zinco, ferro ou estanho',
        acid: 'Agora toca numa garrafa de ácido',
        metal: 'Agora toca num metal',
        wait: 'Olha o frasco a encher-se de gás',
        weigh: 'Toca no frasco cheio para o pesares',
        next: 'Toca noutro metal ou noutro ácido',
        again: 'Os três metais experimentados! Toca em qualquer um para repetir',
      },
      buttons: { weigh: 'Pesar o frasco', back: 'Pôr o frasco no lugar' },
      says: {
        metal: [
          { kid: 'Zinco na garrafa. Agora um ácido!', sci: 'Zinco granulado na garrafa, debaixo de água. Agora o ácido.' },
          { kid: 'Um rolinho de fio de ferro na garrafa. Agora um ácido!', sci: 'Fio de ferro na garrafa. Agora o ácido.' },
          { kid: 'Folha de estanho na garrafa. Agora um ácido!', sci: 'Folha de estanho na garrafa. Agora o ácido.' },
        ],
        acid: [
          { kid: 'Óleo de vitríolo, misturado com água. Agora deita lá um metal!', sci: 'Óleo de vitríolo diluído (ácido sulfúrico). Agora o metal.' },
          { kid: 'Espírito de sal, misturado com água. Agora deita lá um metal!', sci: 'Espírito de sal (ácido clorídrico). Agora o metal.' },
        ],
        fizz: [
          { kid: 'Efervescência! O zinco borbulha depressa. O gás corre pelo tubo e empurra a água para fora do frasco.', sci: 'O zinco dissolve-se depressa: Zn + 2 H⁺ → Zn²⁺ + H₂. O gás é recolhido sobre água. Uma onça de zinco deu a Cavendish cerca de 356 medidas de onça dele.' },
          { kid: 'Efervescência! O ferro borbulha mais devagar. Olha a água do frasco a descer.', sci: 'O ferro dissolve-se: Fe + 2 H⁺ → Fe²⁺ + H₂. Uma onça de fio de ferro deu-lhe cerca de 412 medidas de onça.' },
          { kid: 'O estanho borbulha só devagarinho. Tem paciência e olha para o frasco.', sci: 'O estanho dissolve-se devagar: Sn + 2 H⁺ → Sn²⁺ + H₂. Uma onça de folha de estanho deu-lhe 202 medidas de onça.' },
        ],
        filling: { kid: 'Ainda não está cheio: o gás continua a empurrar a água para fora.', sci: 'Ainda a recolher: espera que a água saia do frasco.' },
        empty: { kid: 'O frasco ainda está cheio de água. Primeiro faz gás, com um metal e um ácido!', sci: 'Ainda não há gás recolhido: põe um metal e um ácido na garrafa.' },
        already: { kid: 'Já há ácido na garrafa. Toca num metal!', sci: 'O ácido já lá está. Agora o metal.' },
        full: { kid: 'O frasco está cheio de gás! Toca nele para o pesares.', sci: 'O frasco está cheio: tapa-o debaixo de água e pesa-o.' },
        weighed: { kid: 'Lá sobe o frasco de ar inflamável: é muito mais leve do que o frasco de ar normal!', sci: 'O frasco de ar inflamável sobe: cerca de 14 vezes mais leve do que o ar comum, pelas medidas de hoje. Cavendish achou onze.' },
        same: { kid: 'Zinco, ferro, estanho: sempre o mesmo gás leve. Cavendish tinha encontrado um ar novo!', sci: 'Seja qual for o metal, seja qual for o ácido: o mesmo gás, igualmente leve. Uma só substância, a que chamou ar inflamável.' },
        back: { kid: 'O frasco volta para a tina, outra vez cheio de água.', sci: 'O frasco cheio de água outra vez, pronto para o gás seguinte.' },
        needMetal: { kid: 'A garrafa precisa de um metal: toca no zinco, no ferro ou no estanho.', sci: 'Ainda não há metal na garrafa.' },
        needAcid: { kid: 'A garrafa precisa de ácido: toca numa das garrafas de ácido.', sci: 'Ainda não há ácido na garrafa.' },
      },
      panel: {
        kid: [
          'Em 1766, Henry Cavendish deitou bocadinhos de zinco, ferro ou estanho em ácido misturado com água. O metal fazia efervescência, e ele levou as bolhas por um tubo de vidro dobrado até um frasco cheio de água, virado ao contrário numa tina: o gás empurrou a água para fora e ficou no frasco. É assim que se apanha um gás.',
          'Zinco, ferro ou estanho, um ácido ou o outro: era sempre o mesmo gás, e era levíssimo, muito mais leve do que o ar. Perto de uma chama ardia, por isso chamou-lhe ar inflamável. Hoje chamamos-lhe hidrogénio.',
          'Estes ácidos são perigosos: queimam a pele e os olhos. Só os químicos os usam, num laboratório, com proteção.',
        ],
        sci: [
          'Cavendish, «Three Papers, Containing Experiments on Factitious Air» (Philosophical Transactions, 1766): «só conheço três substâncias metálicas, a saber, o zinco, o ferro e o estanho, que geram ar inflamável ao dissolverem-se em ácidos», e só em ácido vitriólico diluído ou espírito de sal. Recolheu-o sobre água em garrafas viradas ao contrário. Uma onça de zinco deu cerca de 356 medidas de onça dele, o fio de ferro cerca de 412, a folha de estanho 202, e com o zinco a quantidade era «exatamente a mesma, seja qual for destes ácidos em que se dissolva».',
          'Hoje: Zn + H₂SO₄ → ZnSO₄ + H₂ e Fe + 2 HCl → FeCl₂ + H₂. Cada átomo destes metais liberta uma molécula de hidrogénio, por isso o ferro (55,8 g/mol) dá mais por onça e o estanho (118,7 g/mol) menos, como ele verificou.',
          'Pesou-o: «8760 vezes mais leve do que a água, ou onze vezes mais leve do que o ar comum». Na verdade o hidrogénio é cerca de 14 vezes mais leve do que o ar (0,084 g contra 1,20 g por litro a 20 °C); o seu gás, recolhido sobre água, era húmido e não muito puro. Como quase todos os químicos do seu tempo, explicava-o pelo flogisto: quando os metais se dissolvem, «o seu flogisto escapa-se» e «forma o ar inflamável».',
        ],
      },
    },
    bottles: {
      label: 'As garrafas de Cavendish',
      title: 'O teste do pum (1766)',
      slate: { title: 'Qual foi o estrondo?', axis: 'ar inflamável : ar comum, em décimos', burns: 'arde no ar: de 4% a 75%', just: '29,5%: oxigénio na medida certa' },
      slider: 'Ar inflamável na garrafa',
      mix: '{n} de 10 partes',
      pure: 'Ar inflamável puro',
      hints: { first: 'Toca numa garrafa para lhe chegares a chama', more: 'Toca noutra garrafa para comparares o estrondo', all: 'As nove experimentadas! Toca em qualquer garrafa outra vez' },
      buttons: { light: 'Chegar-lhe a chama' },
      says: {
        results: [
          { kid: 'Nada na boca da garrafa! Só quando a chama entra lá dentro é que arde, devagar e quase sem barulho.', sci: '1 para 9: nada de fogo na boca; com a chama metida na barriga da garrafa pegou fogo e ardeu com muito pouco ruído. Perto do seu limite inferior, a chama do hidrogénio espalha-se para cima mas quase nada para baixo.' },
          { kid: 'Pum! Um estrondo bastante forte.', sci: '2 para 8: «um ruído moderadamente forte».' },
          { kid: 'BUM! Um estrondo fortíssimo!', sci: '3 para 7: «um ruído muito forte», e nenhuma luz vista na garrafa.' },
          { kid: 'BUM! O mais forte de todos! Cavendish também o ouviu.', sci: '4 para 6: ainda um pouco mais forte, o mais forte dos seus ensaios. Um pouco mais rica do que a mistura que gasta todo o oxigénio (29,5% de hidrogénio), a chama corre mais depressa.' },
          { kid: 'Bum! Igualmente forte, e um clarão lá dentro.', sci: 'Partes iguais: um som muito parecido, e uma luz apareceu na garrafa por um instante.' },
          { kid: 'Um estrondo mais fraco, e depois continua a arder lá dentro por um instante.', sci: '6 para 4: não muito forte; continuou a arder na garrafa pouco tempo depois do som.' },
          { kid: 'Só um sopro suave, e depois uma chama arde lá dentro durante uns segundos.', sci: '7 para 3: «um salto muito suave, ou antes um sopro», e depois ardeu alguns segundos na barriga da garrafa.' },
          { kid: 'Nenhum estrondo: uma chama sossegada arde no gargalo e depois apaga-se.', sci: '8 para 2: pegou fogo «sem qualquer ruído» e ardeu só no gargalo; a chama nunca entrou na barriga. Acima de 75% de hidrogénio, uma chama não consegue atravessar a mistura.' },
          { kid: 'O gás puro não consegue arder dentro da garrafa: arde só na boca, onde encontra o ar, com uma chama pálida. E a chama metida lá dentro apaga-se!', sci: 'Hidrogénio puro (o teste das aulas de hoje, não está no artigo dele): arde sossegado na boca, onde encontra o ar, com uma chama pálida; uma vela fina metida lá dentro apaga-se, e volta a acender-se ao sair.' },
        ],
      },
      panel: {
        kid: [
          'Cavendish encheu garrafas de um quarto (cerca de um litro cada) com o seu ar inflamável misturado com ar normal: 1 parte em 10, 2 partes, 3 partes e assim por diante. Depois chegou uma chama a cada uma, uma a seguir à outra, para comparar os estrondos.',
          'Gás a menos: nada de estrondo. Cerca de 3 ou 4 partes em 10: um estrondo fortíssimo! Gás a mais: só um sopro, e depois uma chama sossegada. O gás precisa do oxigénio do ar para arder, e o maior estrondo vem quando há mais ou menos a quantidade certa de cada um.',
          'O hidrogénio, ao arder, faz água: vês como o vidro fica embaciado? Nunca experimentes isto: um estrondo assim pode rebentar uma garrafa.',
        ],
        sci: [
          'Cavendish, 1766: uma garrafa de um quarto cheia com misturas feitas antes, a boca fechada debaixo de água até se lhe chegar a chama, para comparar os sons uns a seguir aos outros. 1 parte para 9 não pegou fogo na boca; 2 para 8 deu «um ruído moderadamente forte», 3 para 7 «um ruído muito forte», 4 para 6 um pouco mais forte, partes iguais quase o mesmo com uma luz vista lá dentro; 6 para 4 não muito forte; 7 para 3 «um salto muito suave, ou antes um sopro»; 8 para 2 fogo «sem qualquer ruído», só no gargalo.',
          'Hoje: 2 H₂ + O₂ → 2 H₂O. O ar tem 20,9% de oxigénio, por isso 29,5% de hidrogénio gastam os dois por inteiro. O hidrogénio arde no ar entre cerca de 4% (uma chama a subir) e 75% em volume, e a sua chama é mais rápida perto de 40%. Fora desse intervalo uma chama não se espalha pela mistura, e é por isso que a garrafa de 8 para 2 só ardeu no gargalo, por onde entrava ar.',
          'A conclusão dele: este ar, «como outras substâncias inflamáveis, não pode arder sem a ajuda do ar comum». Misturado com ar, o hidrogénio explode: usa-se com muito cuidado.',
        ],
      },
    },
    globe: {
      label: 'O globo da faísca',
      title: 'Fazer água com uma faísca (1781)',
      slider: 'Carga na garrafa de Leiden',
      slate: { title: 'Gás gasto', inflammable: 'ar inflamável', dephlogisticated: 'ar desflogisticado', none: 'Deixa entrar os gases e faz faísca!', sparks: 'Faíscas: {n}', his: 'Os números do próprio Cavendish, 1781' },
      hints: {
        cock: 'Toca na torneira de latão para deixares entrar os gases',
        crank: 'Toca na máquina para carregares a garrafa de Leiden',
        spark: 'Toca no globo para mandares uma faísca',
        drop: 'Toca na gota dentro do globo',
        more: 'Toca na torneira para deixares entrar mais gás',
        book: 'Toca no livro de Paris',
        fresh: 'Toca na torneira para teres frascos novos de gás',
      },
      buttons: { cock: 'Deixar entrar os gases', crank: 'Rodar a máquina', spark: 'Faísca!', drop: 'Ver a gota', book: 'Ler o livro' },
      says: {
        cock: { kid: 'Lá entra a mistura. Olha para os frascos: o ar inflamável desce duas vezes mais depressa do que o ar desflogisticado (o nome antigo do oxigénio).', sci: 'O globo, esvaziado, enche-se dos dois frascos: duas medidas de ar inflamável para uma de ar desflogisticado (oxigénio).' },
        more: { kid: 'Mais gás lá dentro: outra vez dois de ar inflamável para um de ar desflogisticado.', sci: 'Cheio outra vez com a mesma mistura, 2 para 1.' },
        full: { kid: 'O globo já está cheio. Carrega a garrafa e manda uma faísca!', sci: 'O globo já tem mistura: faz-lhe a faísca.' },
        crank: { kid: 'Roda que roda: o vidro esfrega no couro, e a garrafa de Leiden enche-se de eletricidade.', sci: 'O cilindro de vidro, a esfregar na almofada de couro, carrega o condutor; a garrafa de Leiden guarda a carga.' },
        charged: { kid: 'A garrafa está cheia de carga: ouve-a crepitar!', sci: 'Carga completa.' },
        empty: { kid: 'O globo está vazio. Primeiro deixa entrar os gases: toca na torneira de latão.', sci: 'Não há mistura no globo: abre a torneira.' },
        fresh0: { kid: 'Os frascos estão gastos. Toca na torneira para teres frascos novos.', sci: 'Os dois frascos gastos: abre a torneira para frascos novos.' },
        fresh: { kid: 'Frascos novos de gás, e um globo limpo e seco. Começa outra vez!', sci: 'Frascos novos, globo seco: a experiência outra vez.' },
        noCharge: { kid: 'Não há eletricidade que chegue para uma faísca: toca na máquina para carregares a garrafa de Leiden.', sci: 'Carga a menos: roda a máquina.' },
        first: { kid: 'Crac! Um clarão, e o gás quase desapareceu. Olha: o vidro ficou orvalhado por dentro!', sci: 'Disparado: quase toda a mistura perdeu a sua elasticidade, e o interior do globo ficou orvalhado, «como observou o Sr. Warltire».' },
        spark: { kid: 'Crac! Escorre mais orvalho pelo vidro.', sci: 'Mais uma carga disparada; mais orvalho.' },
        drop: { kid: 'Crac! O orvalho junta-se numa gota de água no fundo. Toca nela!', sci: 'O líquido condensado junta-se no fundo: toca nele para veres o que é.' },
        six: { kid: 'Seis faíscas, como Cavendish: os frascos estão gastos, e o gás tornou-se um pouco de água!', sci: 'Seis cargas: 37000 medidas de grão de ar inflamável e 19500 de desflogisticado, 1,9 para 1, os números dele. Cerca de 30 grãos de líquido: água, um pouco ácida.' },
        noDrop: { kid: 'Ainda não há água para ver: manda primeiro umas faíscas.', sci: 'Ainda há pouco líquido.' },
        water: { kid: 'Dentro da gota: moléculas de água, cada uma um oxigénio com dois hidrogénios. Toca na lupa para veres como se fizeram.', sci: 'H₂O: um átomo de oxigénio e dois átomos de hidrogénio. Toca na lupa para veres o que a faísca fez.' },
        react: { kid: 'O que a faísca fez: duas moléculas de hidrogénio e uma de oxigénio trocam de par e tornam-se duas moléculas de água!', sci: '2 H₂ + O₂ → 2 H₂O: dois volumes de hidrogénio para um de oxigénio, porque volumes iguais de gás têm números iguais de moléculas (Avogadro, 1811).' },
        close: { kid: 'A lupa está vazia outra vez.', sci: 'Lupa vazia.' },
      },
      panel: {
        kid: [
          'Em 1781, Cavendish deixou entrar o seu ar inflamável, misturado com ar desflogisticado (o nome do oxigénio nessa altura), num globo de vidro do tamanho de uma laranja. Fechou-o e fez passar uma faísca elétrica de uma garrafa de Leiden, uma garrafa que guarda eletricidade. Crac! O gás quase desapareceu, e o vidro ficou orvalhado por dentro.',
          'Seis vezes deixou entrar mais gás e fez faísca, e o orvalho juntou-se num pouco de água. De cada vez gastavam-se cerca de duas partes de ar inflamável para uma parte de ar desflogisticado. Então a água é feita destes dois gases: dois de hidrogénio para um de oxigénio, H₂O!',
          'A gota dele sabia um pouco a azedo (os químicos provavam as coisas nessa altura: nunca o faças!). Com ar desflogisticado a mais, um bocadinho de azoto também arde e faz ácido. Quando queimou o gás com ar normal, a água não tinha sabor nem cheiro: água pura.',
        ],
        sci: [
          '«Experiments on Air», lido na Royal Society a 15 de janeiro de 1784; as experiências «foram feitas no verão do ano de 1781». Priestley tinha relatado o ensaio de John Warltire, ar inflamável disparado com ar comum num vidro fechado que ficou orvalhado por dentro. Cavendish mediu-o: «423 medidas de ar inflamável bastam quase para flogisticar completamente 1000 de ar comum», deixando «muito pouco mais de quatro quintos» dele. Queimar cerca de 500000 medidas de grão de ar inflamável com ar comum num cilindro de vidro de oito pés deu «mais de 135 grãos de água», «sem sabor nem cheiro».',
          'Com ar desflogisticado: «um globo de vidro, com capacidade de 8800 medidas de grão, munido de uma torneira de latão» (uma medida de grão é o volume de um grão de água, cerca de 0,065 mL, portanto cerca de 570 mL), esvaziado com uma bomba de ar, cheio com a mistura e disparado por eletricidade, depois cheio e disparado outra vez, cabendo no globo cerca de um sexto do total: 19500 medidas de grão de ar desflogisticado e 37000 de inflamável, 1,9 para 1. Os cerca de 30 grãos de líquido eram «sensivelmente ácidos ao paladar»: água com um pouco de ácido nítrico («ácido nitroso», dizia ele), que se formava quando o ar desflogisticado estava em excesso.',
          'A leitura dele, nos termos do flogisto: «a água consiste em ar desflogisticado unido ao flogisto». Hoje: 2 H₂ + O₂ → 2 H₂O, exatamente 2 para 1 em volume.',
        ],
      },
      name: {
        title: '1787: o que faz água',
        kid: [
          'Cavendish pensava que o seu gás era flogisto, a «matéria do fogo» que os químicos de então julgavam existir em tudo o que arde. Em Paris, Antoine Lavoisier soube da água de Cavendish, e em junho de 1783 ele e Pierre-Simon Laplace também fizeram água com os dois gases. Lavoisier disse: a água não é um elemento, é feita de dois.',
          'Em 1787, Lavoisier e mais três químicos franceses deram nomes novos à química. Foi neste livro que o ar inflamável passou a hydrogène, de palavras gregas para água e para fazer: o que faz água!',
        ],
        sci: [
          'Charles Blagden, assistente de Cavendish, contou os resultados a Lavoisier em Paris em 1783; em junho, Lavoisier e Pierre-Simon Laplace queimaram os dois gases e recolheram água, e Lavoisier leu a água como um composto, sem flogisto nenhum. James Watt tinha chegado a uma conclusão parecida numa carta de abril de 1783; quem chegou primeiro foi discutido muito tempo depois.',
          'A Méthode de nomenclature chimique (Paris, 1787), de Guyton de Morveau, Lavoisier, Berthollet e Fourcroy, chamou ao gás hydrogène, do grego para água e para gerar: o ar inflamável passou a «gaz hydrogène». O Traité élémentaire de chimie de Lavoisier (1789) pô-lo entre as substâncias simples.',
        ],
      },
    },
  },
  pl: {
    title: 'Laboratorium Cavendisha, 1781',
    greet: {
      kid: 'Jesteśmy w środku obrazka: w laboratorium Henry’ego Cavendisha w Londynie, w letnią noc 1781 roku. Był okropnie nieśmiały, ale to tutaj złapał gaz, który robi pyk, i odkrył, że kiedy się pali, powstaje woda. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Londyn, lato 1781, przy świecach: laboratorium Henry’ego Cavendisha (do 1783 roku mieszkał i pracował w domu ojca przy Great Marlborough Street). Jego palne powietrze z metali, jego butelki z 1766 roku i kula, w której zrobił wodę. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Cavendish był tak nieśmiały, że zostawiał gospodyni karteczki, zamiast z nią rozmawiać. Mówi się, że kazał nawet zbudować drugie schody, żeby nikogo na nich nie spotkać!',
        'Był jednym z najbogatszych ludzi w Anglii, ale wydawał pieniądze na książki i przyrządy, a swoje książki pożyczał innym uczonym.',
        'W 1798 roku obliczył, ile waży cała Ziemia, za pomocą ołowianych kul i pręta wiszącego na cienkim drucie. Nazwano to ważeniem świata.',
      ],
      sci: [
        'Henry Cavendish (1731 do 1810), wnuk dwóch książąt, prawie z nikim nie rozmawiał: pisał karteczki do gospodyni, a podobno kazał dobudować w swoim domu w Clapham tylne schody, żeby nie spotykać służby.',
        'Gdy zdeflogistonowanego powietrza było za dużo, w jego wodzie był trochę kwasu azotowego: spaliło się też trochę azotu. Idąc tym tropem, w 1785 roku przepuszczał iskry przez powietrze z nadmiarem zdeflogistonowanego powietrza, aż została mała bańka, która nie reagowała, „nie więcej niż 1/120 całości”. To był argon, odkryty przez Rayleigha i Ramsaya w 1894 roku.',
        'W latach 1797 i 1798 zmierzył średnią gęstość Ziemi wagą skręceń Johna Michella: 5,48 gęstości wody. Dzisiejsza wartość to 5,51.',
      ],
    },
    metals: {
      label: 'Palne powietrze',
      title: 'Palne powietrze z metali (1766)',
      names: ['Cynk', 'Żelazo', 'Cyna'],
      acids: ['Olej witriolowy', 'Spirytus solny'],
      air: { common: 'zwykłe powietrze', inflammable: 'palne powietrze' },
      slate: { title: 'Który metal, który kwas?', done: { kid: 'Za każdym razem ten sam lekki gaz!', sci: 'Ze wszystkich jeden gaz: palne powietrze' } },
      hints: {
        start: 'Dotknij metalu, cynku, żelaza albo cyny',
        acid: 'Teraz dotknij butelki z kwasem',
        metal: 'Teraz dotknij metalu',
        wait: 'Patrz, jak słój napełnia się gazem',
        weigh: 'Dotknij pełnego słoja, żeby go zważyć',
        next: 'Dotknij innego metalu albo kwasu',
        again: 'Wszystkie trzy metale wypróbowane! Dotknij któregoś, żeby powtórzyć',
      },
      buttons: { weigh: 'Zważ słój', back: 'Odstaw słój z powrotem' },
      says: {
        metal: [
          { kid: 'Cynk w butelce. Teraz kwas!', sci: 'Granulowany cynk w butelce, pod wodą. Teraz kwas.' },
          { kid: 'Zwój żelaznego drutu w butelce. Teraz kwas!', sci: 'Drut żelazny w butelce. Teraz kwas.' },
          { kid: 'Cynowa folia w butelce. Teraz kwas!', sci: 'Folia cynowa w butelce. Teraz kwas.' },
        ],
        acid: [
          { kid: 'Olej witriolowy zmieszany z wodą. Teraz wrzuć metal!', sci: 'Rozcieńczony olej witriolowy (kwas siarkowy). Teraz metal.' },
          { kid: 'Spirytus solny zmieszany z wodą. Teraz wrzuć metal!', sci: 'Spirytus solny (kwas solny). Teraz metal.' },
        ],
        fizz: [
          { kid: 'Szszsz! Cynk szybko bąbelkuje. Gaz płynie rurką i wypycha wodę ze słoja.', sci: 'Cynk szybko się rozpuszcza: Zn + 2 H⁺ → Zn²⁺ + H₂. Gaz zbiera się nad wodą. Uncja cynku dała Cavendishowi około 356 miar uncjowych tego gazu.' },
          { kid: 'Szszsz! Żelazo bąbelkuje wolniej. Patrz, jak woda w słoju opada.', sci: 'Żelazo się rozpuszcza: Fe + 2 H⁺ → Fe²⁺ + H₂. Uncja żelaznego drutu dała mu około 412 miar uncjowych.' },
          { kid: 'Cyna bąbelkuje tylko powoli. Bądź cierpliwy i patrz na słój.', sci: 'Cyna rozpuszcza się powoli: Sn + 2 H⁺ → Sn²⁺ + H₂. Uncja folii cynowej dała mu 202 miary uncjowe.' },
        ],
        filling: { kid: 'Jeszcze niepełny: gaz wciąż wypycha wodę.', sci: 'Zbieranie trwa: poczekaj, aż woda opuści słój.' },
        empty: { kid: 'Słój jest wciąż pełen wody. Najpierw zrób trochę gazu z metalu i kwasu!', sci: 'Nie zebrano jeszcze gazu: włóż do butelki metal i kwas.' },
        already: { kid: 'W butelce jest już kwas. Dotknij metalu!', sci: 'Kwas już jest. Teraz metal.' },
        full: { kid: 'Słój jest pełen gazu! Dotknij go, żeby go zważyć.', sci: 'Słój jest pełny: zatkaj go pod wodą i zważ.' },
        weighed: { kid: 'Słój z palnym powietrzem idzie w górę: jest dużo lżejszy niż słój ze zwykłym powietrzem!', sci: 'Słój z palnym powietrzem unosi się: według dzisiejszych pomiarów około 14 razy lżejszy od zwykłego powietrza. Cavendish otrzymał jedenaście.' },
        same: { kid: 'Cynk, żelazo, cyna: za każdym razem ten sam lekki gaz. Cavendish znalazł nowy rodzaj powietrza!', sci: 'Jakikolwiek metal, jakikolwiek kwas: ten sam gaz, tak samo lekki. Jedna substancja, którą nazwał palnym powietrzem.' },
        back: { kid: 'Słój wraca do wanny, znowu pełen wody.', sci: 'Słój znowu napełniony wodą, gotowy na następny gaz.' },
        needMetal: { kid: 'Butelka potrzebuje metalu: dotknij cynku, żelaza albo cyny.', sci: 'W butelce nie ma jeszcze metalu.' },
        needAcid: { kid: 'Butelka potrzebuje kwasu: dotknij jednej z butelek z kwasem.', sci: 'W butelce nie ma jeszcze kwasu.' },
      },
      panel: {
        kid: [
          'W 1766 roku Henry Cavendish wrzucał kawałki cynku, żelaza albo cyny do kwasu zmieszanego z wodą. Metal musował, a on prowadził bąbelki wygiętą szklaną rurką do słoja pełnego wody, odwróconego do góry dnem w wannie: gaz wypychał wodę i zostawał w słoju. Tak się łapie gaz.',
          'Cynk, żelazo czy cyna, ten czy inny kwas: zawsze był to ten sam gaz, i to bardzo lekki, dużo lżejszy od powietrza. Przy płomieniu się palił, więc nazwał go palnym powietrzem. Dziś nazywamy go wodorem.',
          'Te kwasy są niebezpieczne: parzą skórę i oczy. Używają ich tylko chemicy, w laboratorium, z ochroną.',
        ],
        sci: [
          'Cavendish, „Three Papers, Containing Experiments on Factitious Air” (Philosophical Transactions, 1766): „znam tylko trzy substancje metaliczne, mianowicie cynk, żelazo i cynę, które wytwarzają palne powietrze, rozpuszczając się w kwasach”, i to tylko w rozcieńczonym kwasie witriolowym lub spirytusie solnym. Zbierał je nad wodą w odwróconych butelkach. Uncja cynku dawała około 356 miar uncjowych gazu, drut żelazny około 412, folia cynowa 202, a dla cynku ilość była „dokładnie taka sama, w którymkolwiek z tych kwasów się go rozpuści”.',
          'Dziś: Zn + H₂SO₄ → ZnSO₄ + H₂ oraz Fe + 2 HCl → FeCl₂ + H₂. Każdy atom tych metali uwalnia jedną cząsteczkę wodoru, więc żelazo (55,8 g/mol) daje najwięcej na uncję, a cyna (118,7 g/mol) najmniej, tak jak stwierdził.',
          'Zważył go: „8760 razy lżejszy od wody, czyli jedenaście razy lżejszy od zwykłego powietrza”. Naprawdę wodór jest około 14 razy lżejszy od powietrza (0,084 g wobec 1,20 g na litr w 20 °C); jego gaz, zbierany nad wodą, był wilgotny i niezupełnie czysty. Jak większość chemików swoich czasów tłumaczył to flogistonem: gdy metale się rozpuszczają, „ich flogiston ulatuje” i „tworzy palne powietrze”.',
        ],
      },
    },
    bottles: {
      label: 'Butelki Cavendisha',
      title: 'Próba pyknięcia (1766)',
      slate: { title: 'Jak głośno huknęło?', axis: 'palne powietrze : zwykłe powietrze, w dziesiątych', burns: 'pali się w powietrzu: od 4% do 75%', just: '29,5%: tlenu w sam raz' },
      slider: 'Palne powietrze w butelce',
      mix: '{n} z 10 części',
      pure: 'Czyste palne powietrze',
      hints: { first: 'Dotknij butelki, żeby przyłożyć do niej płomień', more: 'Dotknij innej butelki, żeby porównać huk', all: 'Wszystkie dziewięć wypróbowane! Dotknij dowolnej butelki jeszcze raz' },
      buttons: { light: 'Przyłóż płomień' },
      says: {
        results: [
          { kid: 'Przy wylocie nic! Pali się dopiero wtedy, gdy płomień wejdzie do środka, powoli i prawie bezgłośnie.', sci: '1 do 9: przy wylocie nie zapaliło się; gdy płomień włożono do brzuśca butelki, zapaliło się i paliło z bardzo małym hałasem. Tak blisko dolnej granicy płomień wodoru szerzy się w górę, a w dół prawie wcale.' },
          { kid: 'Pyk! Całkiem głośny huk.', sci: '2 do 8: „umiarkowanie głośny huk”.' },
          { kid: 'BUM! Bardzo głośny!', sci: '3 do 7: „bardzo głośny huk”, a w butelce nie było widać światła.' },
          { kid: 'BUM! Najgłośniejszy ze wszystkich! Cavendish też to słyszał.', sci: '4 do 6: jeszcze trochę głośniej, najgłośniej ze wszystkich jego prób. Przy mieszaninie trochę bogatszej niż ta, która zużywa cały tlen (29,5% wodoru), płomień pędzi najszybciej.' },
          { kid: 'Bum! Równie głośno, i błysk światła w środku.', sci: 'Równe części: bardzo podobny dźwięk, a w butelce na chwilę pojawiło się światło.' },
          { kid: 'Cichszy huk, a potem przez chwilę pali się w środku.', sci: '6 do 4: niezbyt głośno; jeszcze przez krótką chwilę po huku paliło się w butelce.' },
          { kid: 'Tylko łagodne puf, a potem płomień pali się w środku przez kilka sekund.', sci: '7 do 3: „bardzo łagodne podskoczenie, a raczej puf”, a potem paliło się kilka sekund w brzuścu butelki.' },
          { kid: 'Wcale nie huknęło: cichy płomień pali się w szyjce, a potem gaśnie.', sci: '8 do 2: zapaliło się „bez żadnego hałasu” i paliło tylko w szyjce; płomień nigdy nie wszedł do brzuśca. Powyżej 75% wodoru płomień nie może przejść przez mieszaninę.' },
          { kid: 'Czysty gaz nie może się palić w butelce: pali się tylko przy wylocie, gdzie spotyka powietrze, bladym płomieniem. A płomień wsunięty do środka gaśnie!', sci: 'Czysty wodór (dzisiejsza szkolna próba, nie z jego pracy): pali się spokojnie przy wylocie, gdzie styka się z powietrzem, bladym płomieniem; wsunięta do środka świeczka gaśnie i zapala się znowu przy wyjmowaniu.' },
        ],
      },
      panel: {
        kid: [
          'Cavendish napełniał butelki o pojemności kwarty (mniej więcej litr każda) swoim palnym powietrzem zmieszanym ze zwykłym: 1 część na 10, 2 części, 3 części i tak dalej. Potem przykładał płomień do każdej, jednej po drugiej, żeby porównać huki.',
          'Za mało gazu: żadnego huku. Około 3 albo 4 części na 10: bardzo głośny huk! Dużo gazu: tylko puf, a potem cichy płomień. Gaz potrzebuje do palenia tlenu z powietrza, a najgłośniej huka wtedy, gdy obu jest mniej więcej tyle, ile trzeba.',
          'Palący się wodór robi wodę: widzisz, jak szkło zachodzi mgiełką? Nigdy nie próbuj tego sam: taki huk może rozsadzić butelkę.',
        ],
        sci: [
          'Cavendish, 1766: butelka o pojemności kwarty, napełniana przygotowanymi wcześniej mieszaninami, z wylotem zamkniętym pod wodą aż do przyłożenia płomienia, żeby porównywać dźwięki jeden po drugim. 1 część na 9 nie zapaliła się przy wylocie; 2 do 8 dało „umiarkowanie głośny huk”, 3 do 7 „bardzo głośny huk”, 4 do 6 trochę głośniejszy, równe części prawie to samo, z widocznym w środku światłem; 6 do 4 niezbyt głośno; 7 do 3 „bardzo łagodne podskoczenie, a raczej puf”; 8 do 2 ogień „bez żadnego hałasu”, tylko w szyjce.',
          'Dziś: 2 H₂ + O₂ → 2 H₂O. Powietrze zawiera 20,9% tlenu, więc przy 29,5% wodoru oba zużywają się dokładnie. Wodór pali się w powietrzu od około 4% (płomień idący w górę) do 75% objętości, a jego płomień jest najszybszy w pobliżu 40%. Poza tym zakresem płomień nie rozchodzi się po mieszaninie, dlatego butelka 8 do 2 paliła się tylko w szyjce, gdzie wchodziło powietrze.',
          'Jego wniosek: to powietrze, „jak inne substancje palne, nie może się palić bez pomocy zwykłego powietrza”. Zmieszany z powietrzem wodór wybucha: obchodzi się z nim bardzo ostrożnie.',
        ],
      },
    },
    globe: {
      label: 'Kula z iskrą',
      title: 'Woda z iskry (1781)',
      slider: 'Ładunek w butelce lejdejskiej',
      slate: { title: 'Zużyty gaz', inflammable: 'palne powietrze', dephlogisticated: 'zdeflogistonowane powietrze', none: 'Wpuść gazy, potem iskra!', sparks: 'Iskry: {n}', his: 'Liczby samego Cavendisha, 1781' },
      hints: {
        cock: 'Dotknij mosiężnego kurka, żeby wpuścić gazy',
        crank: 'Dotknij maszyny, żeby naładować butelkę lejdejską',
        spark: 'Dotknij kuli, żeby puścić iskrę',
        drop: 'Dotknij kropli w kuli',
        more: 'Dotknij kurka, żeby wpuścić więcej gazu',
        book: 'Dotknij książki z Paryża',
        fresh: 'Dotknij kurka, żeby dostać nowe słoje gazu',
      },
      buttons: { cock: 'Wpuść gazy', crank: 'Kręć maszyną', spark: 'Iskra!', drop: 'Obejrzyj kroplę', book: 'Czytaj książkę' },
      says: {
        cock: { kid: 'Mieszanina wchodzi. Popatrz na słoje: palnego powietrza ubywa dwa razy szybciej niż zdeflogistonowanego (to dawna nazwa tlenu).', sci: 'Opróżniona kula napełnia się z obu słojów: dwie miary palnego powietrza na jedną zdeflogistonowanego (tlenu).' },
        more: { kid: 'Więcej gazu: znowu dwie części palnego powietrza na jedną zdeflogistonowanego.', sci: 'Ponownie napełniona tą samą mieszaniną, 2 do 1.' },
        full: { kid: 'Kula jest już pełna. Naładuj butelkę i puść iskrę!', sci: 'Kula ma już mieszaninę: odpal ją.' },
        crank: { kid: 'Kręci się i kręci: szkło ociera się o skórę, a butelka lejdejska napełnia się elektrycznością.', sci: 'Szklany walec ocierany o skórzaną poduszkę ładuje konduktor; butelka lejdejska gromadzi ładunek.' },
        charged: { kid: 'Butelka jest pełna ładunku: posłuchaj, jak trzeszczy!', sci: 'W pełni naładowana.' },
        empty: { kid: 'Kula jest pusta. Najpierw wpuść gazy: dotknij mosiężnego kurka.', sci: 'W kuli nie ma mieszaniny: otwórz kurek.' },
        fresh0: { kid: 'Słoje są zużyte. Dotknij kurka, żeby dostać nowe.', sci: 'Oba słoje zużyte: otwórz kurek, żeby dostać nowe.' },
        fresh: { kid: 'Nowe słoje gazu i czysta, sucha kula. Zacznij od nowa!', sci: 'Nowe słoje, sucha kula: doświadczenie jeszcze raz.' },
        noCharge: { kid: 'Za mało elektryczności na iskrę: dotknij maszyny, żeby naładować butelkę lejdejską.', sci: 'Za mały ładunek: pokręć maszyną.' },
        first: { kid: 'Trzask! Błysk, i gazu prawie nie ma. Popatrz: szkło od środka zaszło rosą!', sci: 'Odpalone: prawie cała mieszanina straciła sprężystość, a wnętrze kuli pokryło się rosą, „jak zauważył pan Warltire”.' },
        spark: { kid: 'Trzask! Po szkle spływa więcej rosy.', sci: 'Odpalona kolejna porcja; więcej rosy.' },
        drop: { kid: 'Trzask! Rosa spływa i zbiera się w kroplę wody na dnie. Dotknij jej!', sci: 'Skroplona ciecz zbiera się na dnie: dotknij jej, żeby zobaczyć, co to jest.' },
        six: { kid: 'Sześć iskier, jak u Cavendisha: słoje są zużyte, a z gazu zrobiło się trochę wody!', sci: 'Sześć porcji: 37000 miar granowych palnego powietrza i 19500 zdeflogistonowanego, 1,9 do 1, jego własne liczby. Około 30 granów cieczy: woda, lekko kwaśna.' },
        noDrop: { kid: 'Nie ma jeszcze wody do oglądania: najpierw puść kilka iskier.', sci: 'Jeszcze za mało cieczy.' },
        water: { kid: 'W kropli: cząsteczki wody, każda to tlen z dwoma wodorami. Dotknij lupy, żeby zobaczyć, jak powstały.', sci: 'H₂O: jeden atom tlenu i dwa atomy wodoru. Dotknij lupy, żeby zobaczyć, co zrobiła iskra.' },
        react: { kid: 'Co zrobiła iskra: dwie cząsteczki wodoru i jedna tlenu zamieniają się partnerami i stają się dwiema cząsteczkami wody!', sci: '2 H₂ + O₂ → 2 H₂O: dwie objętości wodoru na jedną tlenu, bo w równych objętościach gazu jest tyle samo cząsteczek (Avogadro, 1811).' },
        close: { kid: 'Lupa znowu jest pusta.', sci: 'Lupa pusta.' },
      },
      panel: {
        kid: [
          'W 1781 roku Cavendish wpuścił swoje palne powietrze, zmieszane ze zdeflogistonowanym (tak się wtedy nazywał tlen), do szklanej kuli wielkości pomarańczy. Zamknął ją i przepuścił przez nią iskrę elektryczną z butelki lejdejskiej, czyli butelki, która gromadzi elektryczność. Trzask! Gaz prawie zniknął, a szkło od środka zaszło rosą.',
          'Sześć razy wpuszczał więcej gazu i puszczał iskrę, a rosa zebrała się w trochę wody. Za każdym razem zużywały się mniej więcej dwie części palnego powietrza na jedną część zdeflogistonowanego. Czyli woda składa się z tych dwóch gazów: dwa wodoru na jeden tlenu, H₂O!',
          'Jego kropla była trochę kwaśna w smaku (chemicy wtedy próbowali rzeczy: nigdy tego nie rób!). Gdy zdeflogistonowanego powietrza jest za dużo, spala się też odrobina azotu i powstaje kwas. Gdy spalał swój gaz ze zwykłym powietrzem, woda nie miała smaku ani zapachu: czysta woda.',
        ],
        sci: [
          '„Experiments on Air”, odczytane w Royal Society 15 stycznia 1784 roku; doświadczenia „wykonano latem roku 1781”. Priestley opisał próbę Johna Warltire’a: palne powietrze odpalone ze zwykłym w zamkniętym szkle, które od środka zaszło rosą. Cavendish to zmierzył: „423 miary palnego powietrza prawie wystarczają, by całkowicie sflogistonować 1000 miar zwykłego powietrza”, a zostaje go „niewiele więcej niż cztery piąte”. Spalenie około 500000 miar granowych palnego powietrza ze zwykłym powietrzem w szklanym walcu długości ośmiu stóp dało „ponad 135 granów wody”, „bez smaku i zapachu”.',
          'Ze zdeflogistonowanym powietrzem: „szklana kula o pojemności 8800 miar granowych, zaopatrzona w mosiężny kurek” (miara granowa to objętość grana wody, około 0,065 ml, więc około 570 ml), opróżniona pompą próżniową, napełniona mieszaniną i odpalona elektrycznością, potem znowu napełniona i odpalona, bo kula mieściła około jednej szóstej całości: 19500 miar granowych zdeflogistonowanego powietrza i 37000 palnego, 1,9 do 1. Mniej więcej 30 granów cieczy było „wyczuwalnie kwaśnych w smaku”: woda z odrobiną kwasu azotowego, który powstawał, gdy zdeflogistonowanego powietrza było w nadmiarze.',
          'Jego odczytanie, w języku flogistonu: „woda składa się ze zdeflogistonowanego powietrza połączonego z flogistonem”. Dziś: 2 H₂ + O₂ → 2 H₂O, dokładnie 2 do 1 objętościowo.',
        ],
      },
      name: {
        title: '1787: twórca wody',
        kid: [
          'Cavendish myślał, że jego gaz to flogiston, „ogniste coś”, które według ówczesnych chemików siedziało we wszystkim, co się pali. W Paryżu Antoine Lavoisier usłyszał o wodzie Cavendisha i w czerwcu 1783 roku razem z Pierre’em-Simonem Laplace’em też zrobił wodę z tych dwóch gazów. Lavoisier powiedział: woda nie jest pierwiastkiem, składa się z dwóch.',
          'W 1787 roku Lavoisier i trzech innych francuskich chemików nadało chemii nowe nazwy. W tej książce palne powietrze stało się hydrogène, od greckich słów oznaczających wodę i robienie: twórca wody!',
        ],
        sci: [
          'Charles Blagden, asystent Cavendisha, opowiedział Lavoisierowi o wynikach w Paryżu w 1783 roku; w czerwcu Lavoisier i Pierre-Simon Laplace spalili oba gazy i zebrali wodę, a Lavoisier odczytał wodę jako związek, bez żadnego flogistonu. James Watt doszedł do podobnego wniosku w liście z kwietnia 1783 roku; o to, kto był pierwszy, spierano się jeszcze długo potem.',
          'Méthode de nomenclature chimique (Paryż, 1787) Guytona de Morveau, Lavoisiera, Bertholleta i Fourcroya nazwała ten gaz hydrogène, od greckich słów oznaczających wodę i wytwarzanie: palne powietrze stało się „gaz hydrogène”. Traité élémentaire de chimie Lavoisiera (1789) umieścił go wśród substancji prostych.',
        ],
      },
    },
  },
  de: {
    title: 'Cavendishs Labor, 1781',
    greet: {
      kid: 'Wir sind im Bild: in Henry Cavendishs Labor in London, in einer Sommernacht im Jahr 1781. Er war furchtbar schüchtern, aber hier fing er ein Gas, das plopp macht, und fand heraus, dass es beim Brennen Wasser macht. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'London, Sommer 1781, bei Kerzenlicht: Henry Cavendishs Labor (bis 1783 lebte und arbeitete er im Haus seines Vaters in der Great Marlborough Street). Seine brennbare Luft aus Metallen, seine Flaschen von 1766 und die Kugel, in der er Wasser machte. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Cavendish war so schüchtern, dass er seiner Haushälterin Zettel hinlegte, statt mit ihr zu reden. Man erzählt sogar, er ließ eine zweite Treppe bauen, damit er auf der Treppe niemanden traf!',
        'Er war einer der reichsten Menschen Englands, aber er gab sein Geld für Bücher und Instrumente aus, und er lieh seine Bücher anderen Forschern.',
        '1798 fand er heraus, wie schwer die ganze Erde ist, mit Bleikugeln und einem Stab, der an einem dünnen Draht hing. Man nannte das: die Welt wiegen.',
      ],
      sci: [
        'Henry Cavendish (1731 bis 1810), Enkel zweier Herzöge, sprach kaum mit jemandem: Er schrieb seiner Haushälterin Zettel, und es heißt, er ließ an seinem Haus in Clapham eine Hintertreppe anbauen, um seinen Dienstboten nicht zu begegnen.',
        'Mit zu viel dephlogistisierter Luft enthielt sein Wasser ein wenig Salpetersäure: Etwas Stickstoff war mitverbrannt. Dieser Spur folgend, schickte er 1785 Funken durch Luft mit zusätzlicher dephlogistisierter Luft, bis eine kleine Blase übrig blieb, die nicht reagierte, „nicht mehr als 1/120 des Ganzen“. Es war Argon, 1894 von Rayleigh und Ramsay entdeckt.',
        '1797 und 1798 maß er mit John Michells Drehwaage die mittlere Dichte der Erde: das 5,48-Fache von Wasser. Der heutige Wert ist 5,51.',
      ],
    },
    metals: {
      label: 'Brennbare Luft',
      title: 'Brennbare Luft aus Metallen (1766)',
      names: ['Zink', 'Eisen', 'Zinn'],
      acids: ['Vitriolöl', 'Salzgeist'],
      air: { common: 'gewöhnliche Luft', inflammable: 'brennbare Luft' },
      slate: { title: 'Welches Metall, welche Säure?', done: { kid: 'Jedes Mal dasselbe leichte Gas!', sci: 'Aus allen ein Gas: brennbare Luft' } },
      hints: {
        start: 'Tippe auf ein Metall, Zink, Eisen oder Zinn',
        acid: 'Jetzt tippe auf eine Säureflasche',
        metal: 'Jetzt tippe auf ein Metall',
        wait: 'Schau, wie sich das Glas mit Gas füllt',
        weigh: 'Tippe auf das volle Glas, um es zu wiegen',
        next: 'Tippe auf ein anderes Metall oder eine andere Säure',
        again: 'Alle drei Metalle ausprobiert! Tippe auf eines, um es noch einmal zu machen',
      },
      buttons: { weigh: 'Glas wiegen', back: 'Glas zurückstellen' },
      says: {
        metal: [
          { kid: 'Zink in der Flasche. Jetzt eine Säure!', sci: 'Gekörntes Zink in der Flasche, unter Wasser. Jetzt die Säure.' },
          { kid: 'Eine Rolle Eisendraht in der Flasche. Jetzt eine Säure!', sci: 'Eisendraht in der Flasche. Jetzt die Säure.' },
          { kid: 'Zinnfolie in der Flasche. Jetzt eine Säure!', sci: 'Zinnfolie in der Flasche. Jetzt die Säure.' },
        ],
        acid: [
          { kid: 'Vitriolöl, mit Wasser gemischt. Jetzt wirf ein Metall hinein!', sci: 'Verdünntes Vitriolöl (Schwefelsäure). Jetzt das Metall.' },
          { kid: 'Salzgeist, mit Wasser gemischt. Jetzt wirf ein Metall hinein!', sci: 'Salzgeist (Salzsäure). Jetzt das Metall.' },
        ],
        fizz: [
          { kid: 'Es sprudelt! Das Zink blubbert schnell. Das Gas läuft durch das Rohr und drückt das Wasser aus dem Glas.', sci: 'Zink löst sich lebhaft: Zn + 2 H⁺ → Zn²⁺ + H₂. Das Gas wird über Wasser aufgefangen. Eine Unze Zink gab Cavendish etwa 356 Unzenmaß davon.' },
          { kid: 'Es sprudelt! Das Eisen blubbert langsamer. Schau, wie das Wasser im Glas sinkt.', sci: 'Eisen löst sich: Fe + 2 H⁺ → Fe²⁺ + H₂. Eine Unze Eisendraht gab ihm etwa 412 Unzenmaß.' },
          { kid: 'Das Zinn sprudelt nur langsam. Hab Geduld und schau auf das Glas.', sci: 'Zinn löst sich langsam: Sn + 2 H⁺ → Sn²⁺ + H₂. Eine Unze Zinnfolie gab ihm 202 Unzenmaß.' },
        ],
        filling: { kid: 'Noch nicht voll: Das Gas drückt das Wasser noch hinaus.', sci: 'Wird noch aufgefangen: Warte, bis das Wasser das Glas verlassen hat.' },
        empty: { kid: 'Das Glas ist noch voll Wasser. Mach erst Gas, mit einem Metall und einer Säure!', sci: 'Noch kein Gas aufgefangen: Gib ein Metall und eine Säure in die Flasche.' },
        already: { kid: 'In der Flasche ist schon Säure. Tippe auf ein Metall!', sci: 'Die Säure ist drin. Jetzt das Metall.' },
        full: { kid: 'Das Glas ist voll Gas! Tippe darauf, um es zu wiegen.', sci: 'Das Glas ist voll: unter Wasser verschließen und wiegen.' },
        weighed: { kid: 'Hoch geht das Glas mit brennbarer Luft: Es ist viel leichter als das Glas mit normaler Luft!', sci: 'Das Glas mit brennbarer Luft steigt: nach heutigem Maß etwa 14-mal leichter als gewöhnliche Luft. Cavendish fand elfmal.' },
        same: { kid: 'Zink, Eisen, Zinn: jedes Mal dasselbe leichte Gas. Cavendish hatte eine neue Art Luft gefunden!', sci: 'Welches Metall, welche Säure auch immer: dasselbe Gas, genauso leicht. Ein einziger Stoff, den er brennbare Luft nannte.' },
        back: { kid: 'Das Glas kommt zurück in die Wanne, wieder voll Wasser.', sci: 'Das Glas wieder mit Wasser gefüllt, bereit für das nächste Gas.' },
        needMetal: { kid: 'Die Flasche braucht ein Metall: Tippe auf das Zink, das Eisen oder das Zinn.', sci: 'Noch kein Metall in der Flasche.' },
        needAcid: { kid: 'Die Flasche braucht Säure: Tippe auf eine der Säureflaschen.', sci: 'Noch keine Säure in der Flasche.' },
      },
      panel: {
        kid: [
          '1766 warf Henry Cavendish Stückchen Zink, Eisen oder Zinn in Säure, die mit Wasser gemischt war. Das Metall sprudelte, und er leitete die Bläschen durch ein gebogenes Glasrohr in ein Glas voll Wasser, das kopfüber in einer Wanne stand: Das Gas drückte das Wasser hinaus und blieb im Glas. So fängt man ein Gas.',
          'Zink, Eisen oder Zinn, die eine Säure oder die andere: Es war immer dasselbe Gas, und es war sehr leicht, viel leichter als Luft. An einer Flamme brannte es, darum nannte er es brennbare Luft. Heute heißt es Wasserstoff.',
          'Diese Säuren sind gefährlich: Sie verätzen Haut und Augen. Nur Chemiker benutzen sie, in einem Labor, mit Schutz.',
        ],
        sci: [
          'Cavendish, „Three Papers, Containing Experiments on Factitious Air“ (Philosophical Transactions, 1766): „Ich kenne nur drei metallische Stoffe, nämlich Zink, Eisen und Zinn, die brennbare Luft erzeugen, wenn sie sich in Säuren lösen“, und zwar nur in verdünnter Vitriolsäure oder Salzgeist. Er fing sie über Wasser in umgedrehten Flaschen auf. Eine Unze Zink gab etwa 356 Unzenmaß davon, Eisendraht etwa 412, Zinnfolie 202, und beim Zink war die Menge „genau dieselbe, in welcher dieser Säuren es auch gelöst wird“.',
          'Heute: Zn + H₂SO₄ → ZnSO₄ + H₂ und Fe + 2 HCl → FeCl₂ + H₂. Jedes Atom dieser Metalle setzt ein Molekül Wasserstoff frei, darum gibt Eisen (55,8 g/mol) je Unze am meisten und Zinn (118,7 g/mol) am wenigsten, wie er fand.',
          'Er wog es: „8760-mal leichter als Wasser, oder elfmal leichter als gewöhnliche Luft“. Tatsächlich ist Wasserstoff etwa 14-mal leichter als Luft (0,084 g gegen 1,20 g pro Liter bei 20 °C); sein Gas, über Wasser aufgefangen, war feucht und nicht ganz rein. Wie die meisten Chemiker seiner Zeit erklärte er es mit dem Phlogiston: Wenn sich die Metalle lösen, „entweicht ihr Phlogiston“ und „bildet die brennbare Luft“.',
        ],
      },
    },
    bottles: {
      label: 'Cavendishs Flaschen',
      title: 'Die Knallprobe (1766)',
      slate: { title: 'Wie laut war der Knall?', axis: 'brennbare Luft : gewöhnliche Luft, in Zehnteln', burns: 'brennt in Luft: von 4% bis 75%', just: '29,5%: genau genug Sauerstoff' },
      slider: 'Brennbare Luft in der Flasche',
      mix: '{n} von 10 Teilen',
      pure: 'Reine brennbare Luft',
      hints: { first: 'Tippe auf eine Flasche, um die Flamme daranzuhalten', more: 'Tippe auf eine andere Flasche, um den Knall zu vergleichen', all: 'Alle neun ausprobiert! Tippe noch einmal auf eine Flasche' },
      buttons: { light: 'Flamme daranhalten' },
      says: {
        results: [
          { kid: 'An der Öffnung nichts! Erst als die Flamme ganz hineingeht, brennt es, langsam und fast lautlos.', sci: '1 zu 9: an der Öffnung kein Feuer; mit der Flamme im Bauch der Flasche fing es Feuer und brannte mit sehr wenig Geräusch. So nahe an ihrer unteren Grenze breitet sich eine Wasserstoffflamme nach oben aus, aber kaum nach unten.' },
          { kid: 'Plopp! Ein ziemlich lauter Knall.', sci: '2 zu 8: „ein mäßig lautes Geräusch“.' },
          { kid: 'PENG! Ein sehr lauter!', sci: '3 zu 7: „ein sehr lautes Geräusch“, und in der Flasche war kein Licht zu sehen.' },
          { kid: 'PENG! Der lauteste von allen! Cavendish hat das auch gehört.', sci: '4 zu 6: noch etwas lauter, der lauteste seiner Versuche. Etwas reicher als das Gemisch, das allen Sauerstoff verbraucht (29,5% Wasserstoff), rast die Flamme am schnellsten hindurch.' },
          { kid: 'Peng! Genauso laut, und ein Lichtblitz drinnen.', sci: 'Gleiche Teile: fast derselbe Ton, und in der Flasche erschien einen Augenblick lang ein Licht.' },
          { kid: 'Ein leiserer Knall, und dann brennt es drinnen noch einen Moment weiter.', sci: '6 zu 4: nicht sehr laut; nach dem Knall brannte es noch kurz in der Flasche weiter.' },
          { kid: 'Nur ein sanftes Puff, dann brennt drinnen ein paar Sekunden lang eine Flamme.', sci: '7 zu 3: „ein sehr sanfter Stoß, oder eher ein Puff“, dann brannte es einige Sekunden im Bauch der Flasche.' },
          { kid: 'Gar kein Knall: Eine leise Flamme brennt im Hals und geht dann aus.', sci: '8 zu 2: Es fing „ohne jedes Geräusch“ Feuer und brannte nur im Hals; die Flamme kam nie in den Bauch. Über 75% Wasserstoff kann eine Flamme nicht durch das Gemisch laufen.' },
          { kid: 'Reines Gas kann in der Flasche nicht brennen: Es brennt nur an der Öffnung, wo es auf die Luft trifft, mit einer blassen Flamme. Und die Flamme, die hineingeschoben wird, geht aus!', sci: 'Reiner Wasserstoff (der heutige Schulversuch, nicht aus seiner Arbeit): Er brennt ruhig an der Öffnung, wo er auf Luft trifft, mit blasser Flamme; ein hineingeschobener Kerzendocht erlischt und entzündet sich beim Herausziehen wieder.' },
        ],
      },
      panel: {
        kid: [
          'Cavendish füllte Flaschen von einem Quart (gut ein Liter) mit seiner brennbaren Luft, gemischt mit normaler Luft: 1 Teil von 10, 2 Teile, 3 Teile und so weiter. Dann hielt er eine Flamme an jede, eine nach der anderen, um die Knalle zu vergleichen.',
          'Zu wenig Gas: kein Knall. Etwa 3 oder 4 Teile von 10: ein sehr lauter Knall! Viel Gas: nur ein Puff, dann eine leise Flamme. Das Gas braucht zum Brennen den Sauerstoff der Luft, und der lauteste Knall kommt, wenn von beidem ungefähr die richtige Menge da ist.',
          'Brennender Wasserstoff macht Wasser: Siehst du, wie das Glas beschlägt? Probier das nie selbst aus: So ein Knall kann eine Flasche sprengen.',
        ],
        sci: [
          'Cavendish, 1766: eine Quart-Flasche, gefüllt mit vorher angesetzten Gemischen, die Öffnung unter Wasser verschlossen, bis die Flamme daran kam, damit sich die Geräusche nacheinander vergleichen ließen. 1 Teil zu 9 fing an der Öffnung kein Feuer; 2 zu 8 gab „ein mäßig lautes Geräusch“, 3 zu 7 „ein sehr lautes Geräusch“, 4 zu 6 etwas lauter, gleiche Teile fast dasselbe mit einem Licht drinnen; 6 zu 4 nicht sehr laut; 7 zu 3 „ein sehr sanfter Stoß, oder eher ein Puff“; 8 zu 2 Feuer „ohne jedes Geräusch“, nur im Hals.',
          'Heute: 2 H₂ + O₂ → 2 H₂O. Luft enthält 20,9% Sauerstoff, also verbrauchen sich bei 29,5% Wasserstoff beide genau. Wasserstoff brennt in Luft zwischen etwa 4% (eine aufsteigende Flamme) und 75% Volumenanteil, und seine Flamme ist nahe 40% am schnellsten. Außerhalb dieses Bereichs kann sich eine Flamme nicht im Gemisch ausbreiten; darum brannte die Flasche 8 zu 2 nur im Hals, wo Luft hereinkam.',
          'Sein Schluss: Diese Luft „kann wie andere brennbare Stoffe nicht ohne die Hilfe gewöhnlicher Luft brennen“. Mit Luft gemischt explodiert Wasserstoff: Man geht sehr vorsichtig damit um.',
        ],
      },
    },
    globe: {
      label: 'Die Funkenkugel',
      title: 'Wasser aus einem Funken (1781)',
      slider: 'Ladung in der Leidener Flasche',
      slate: { title: 'Verbrauchtes Gas', inflammable: 'brennbare Luft', dephlogisticated: 'dephlogistisierte Luft', none: 'Lass die Gase hinein, dann zünde!', sparks: 'Funken: {n}', his: 'Cavendishs eigene Zahlen, 1781' },
      hints: {
        cock: 'Tippe auf den Messinghahn, um die Gase hineinzulassen',
        crank: 'Tippe auf die Maschine, um die Leidener Flasche zu laden',
        spark: 'Tippe auf die Kugel, um einen Funken zu schicken',
        drop: 'Tippe auf den Tropfen in der Kugel',
        more: 'Tippe auf den Hahn, um mehr Gas hineinzulassen',
        book: 'Tippe auf das Buch aus Paris',
        fresh: 'Tippe auf den Hahn für frische Gläser voll Gas',
      },
      buttons: { cock: 'Gase hineinlassen', crank: 'Maschine drehen', spark: 'Funke!', drop: 'Tropfen ansehen', book: 'Buch lesen' },
      says: {
        cock: { kid: 'Das Gemisch strömt hinein. Schau auf die Gläser: Die brennbare Luft nimmt doppelt so schnell ab wie die dephlogistisierte Luft (der alte Name für Sauerstoff).', sci: 'Die leergepumpte Kugel füllt sich aus beiden Gläsern: zwei Maß brennbare Luft auf eines dephlogistisierte Luft (Sauerstoff).' },
        more: { kid: 'Mehr Gas hinein: wieder zwei Teile brennbare Luft auf einen Teil dephlogistisierte Luft.', sci: 'Wieder gefüllt mit demselben Gemisch, 2 zu 1.' },
        full: { kid: 'Die Kugel ist schon voll. Lade die Flasche und schick einen Funken!', sci: 'Die Kugel enthält schon ein Gemisch: zünde es.' },
        crank: { kid: 'Rundherum: Das Glas reibt am Leder, und die Leidener Flasche füllt sich mit Elektrizität.', sci: 'Der Glaszylinder, der am Lederkissen reibt, lädt den Konduktor; die Leidener Flasche speichert die Ladung.' },
        charged: { kid: 'Die Flasche ist voll geladen: Hör, wie sie knistert!', sci: 'Voll geladen.' },
        empty: { kid: 'Die Kugel ist leer. Lass zuerst die Gase hinein: Tippe auf den Messinghahn.', sci: 'Kein Gemisch in der Kugel: öffne den Hahn.' },
        fresh0: { kid: 'Die Gläser sind verbraucht. Tippe auf den Hahn für neue.', sci: 'Beide Gläser verbraucht: öffne den Hahn für neue.' },
        fresh: { kid: 'Frische Gläser voll Gas und eine saubere, trockene Kugel. Fang noch einmal an!', sci: 'Neue Gläser, eine trockene Kugel: der Versuch noch einmal.' },
        noCharge: { kid: 'Nicht genug Elektrizität für einen Funken: Tippe auf die Maschine, um die Leidener Flasche zu laden.', sci: 'Zu wenig Ladung: dreh die Maschine.' },
        first: { kid: 'Knack! Ein Blitz, und das Gas ist fast weg. Schau: Das Glas ist innen beschlagen!', sci: 'Gezündet: Fast das ganze Gemisch verlor seine Elastizität, und das Innere der Kugel beschlug, „wie Mr. Warltire beobachtet hat“.' },
        spark: { kid: 'Knack! Noch mehr Tau läuft am Glas herunter.', sci: 'Eine weitere Füllung gezündet; mehr Tau.' },
        drop: { kid: 'Knack! Der Tau läuft zu einem Wassertropfen am Boden zusammen. Tippe darauf!', sci: 'Die kondensierte Flüssigkeit sammelt sich am Boden: Tippe darauf, um zu sehen, was es ist.' },
        six: { kid: 'Sechs Funken, wie bei Cavendish: Die Gläser sind verbraucht, und aus dem Gas ist ein bisschen Wasser geworden!', sci: 'Sechs Füllungen: 37000 Granmaß brennbare Luft und 19500 dephlogistisierte, 1,9 zu 1, seine eigenen Zahlen. Etwa 30 Gran Flüssigkeit: Wasser, leicht sauer.' },
        noDrop: { kid: 'Noch kein Wasser zum Ansehen: Schick erst ein paar Funken.', sci: 'Noch zu wenig Flüssigkeit.' },
        water: { kid: 'Im Tropfen: Wassermoleküle, jedes ein Sauerstoff mit zwei Wasserstoffen. Tippe auf die Lupe, um zu sehen, wie sie entstanden sind.', sci: 'H₂O: ein Sauerstoffatom und zwei Wasserstoffatome. Tippe auf die Lupe, um zu sehen, was der Funke getan hat.' },
        react: { kid: 'Was der Funke getan hat: Zwei Wasserstoffmoleküle und ein Sauerstoffmolekül tauschen die Partner und werden zu zwei Wassermolekülen!', sci: '2 H₂ + O₂ → 2 H₂O: zwei Volumen Wasserstoff auf eines Sauerstoff, weil gleiche Gasvolumen gleich viele Moleküle enthalten (Avogadro, 1811).' },
        close: { kid: 'Die Lupe ist wieder leer.', sci: 'Lupe leer.' },
      },
      panel: {
        kid: [
          '1781 ließ Cavendish seine brennbare Luft, gemischt mit dephlogistisierter Luft (so hieß damals der Sauerstoff), in eine Glaskugel so groß wie eine Orange. Er verschloss sie und schickte einen elektrischen Funken aus einer Leidener Flasche hindurch, einer Flasche, die Elektrizität speichert. Knack! Das Gas verschwand fast ganz, und das Glas beschlug innen.',
          'Sechsmal ließ er mehr Gas hinein und zündete es, und der Tau lief zu ein bisschen Wasser zusammen. Jedes Mal wurden etwa zwei Teile brennbare Luft für einen Teil dephlogistisierte Luft verbraucht. Wasser besteht also aus diesen zwei Gasen: zwei Wasserstoff auf einen Sauerstoff, H₂O!',
          'Sein Tropfen schmeckte ein bisschen sauer (Chemiker probierten damals Dinge: Mach das nie!). Mit etwas zu viel dephlogistisierter Luft verbrennt auch eine Spur Stickstoff und macht Säure. Als er sein Gas mit normaler Luft verbrannte, hatte das Wasser keinen Geschmack und keinen Geruch: reines Wasser.',
        ],
        sci: [
          '„Experiments on Air“, vorgelesen in der Royal Society am 15. Januar 1784; die Versuche „wurden im Sommer des Jahres 1781 gemacht“. Priestley hatte von John Warltires Versuch berichtet, brennbare Luft mit gewöhnlicher Luft in einem geschlossenen Glas gezündet, das innen beschlug. Cavendish maß nach: „423 Maß brennbare Luft reichen beinahe aus, um 1000 gewöhnliche Luft vollständig zu phlogistisieren“, und übrig blieben „sehr wenig mehr als vier Fünftel“ davon. Etwa 500000 Granmaß brennbare Luft mit gewöhnlicher Luft in einem acht Fuß langen Glaszylinder verbrannt gaben „über 135 Gran Wasser“, „ohne Geschmack und Geruch“.',
          'Mit dephlogistisierter Luft: „eine Glaskugel, die 8800 Granmaß fasst, mit einem Messinghahn versehen“ (ein Granmaß ist das Volumen eines Grans Wasser, etwa 0,065 mL, also etwa 570 mL), mit einer Luftpumpe leergepumpt, mit dem Gemisch gefüllt und elektrisch gezündet, dann wieder gefüllt und wieder gezündet, da die Kugel nur etwa ein Sechstel des Ganzen fasste: 19500 Granmaß dephlogistisierte Luft und 37000 brennbare, 1,9 zu 1. Die etwa 30 Gran Flüssigkeit waren „merklich sauer im Geschmack“: Wasser mit etwas Salpetersäure, die entstand, wenn die dephlogistisierte Luft im Überschuss war.',
          'Seine Deutung, in der Sprache des Phlogistons: „Wasser besteht aus dephlogistisierter Luft, vereinigt mit Phlogiston“. Heute: 2 H₂ + O₂ → 2 H₂O, genau 2 zu 1 nach Volumen.',
        ],
      },
      name: {
        title: '1787: der Wassermacher',
        kid: [
          'Cavendish hielt sein Gas für Phlogiston, den „Feuerstoff“, der nach Meinung der damaligen Chemiker in allem steckte, was brennt. In Paris hörte Antoine Lavoisier von Cavendishs Wasser, und im Juni 1783 machten er und Pierre-Simon Laplace ebenfalls Wasser aus den beiden Gasen. Lavoisier sagte: Wasser ist kein Element, es besteht aus zweien.',
          '1787 gaben Lavoisier und drei andere französische Chemiker der Chemie neue Namen. In diesem Buch wurde aus der brennbaren Luft hydrogène, nach griechischen Wörtern für Wasser und machen: der Wassermacher!',
        ],
        sci: [
          'Charles Blagden, Cavendishs Assistent, berichtete Lavoisier 1783 in Paris von den Ergebnissen; im Juni verbrannten Lavoisier und Pierre-Simon Laplace die beiden Gase und fingen Wasser auf, und Lavoisier deutete Wasser als Verbindung, ganz ohne Phlogiston. James Watt war in einem Brief vom April 1783 zu einem ähnlichen Schluss gekommen; wer zuerst da war, wurde noch lange danach gestritten.',
          'Die Méthode de nomenclature chimique (Paris, 1787) von Guyton de Morveau, Lavoisier, Berthollet und Fourcroy nannte das Gas hydrogène, nach dem Griechischen für Wasser und erzeugen: Aus der brennbaren Luft wurde „gaz hydrogène“. Lavoisiers Traité élémentaire de chimie (1789) führte es unter den einfachen Stoffen.',
        ],
      },
    },
  },
}
