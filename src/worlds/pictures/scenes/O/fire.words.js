// The words of oxygen's fire picture room ("What does a fire need?"): Lavoisier's laboratory in Paris in the
// 1770s, in English, European Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The
// picture's own story stays in src/content/boards/O.js (the easel shows it); the fire wing shows what a fire
// needs, this room how it was found out. Placeholders: {d} (a day), {v} (cubic inches of air).
// Sources: Lavoisier, Traité élémentaire de chimie (1789), part 1, chapter 3, in Robert Kerr's translation
// (1790; Project Gutenberg 30775): the matrass of 36 cubic inches, 4 ounces of mercury, 12 days, 50 cubic
// inches of air down to "between 42 and 43", "about 1/6", 45 grains of red calx giving 41.5 grains of
// mercury and "7 or 8 cubical inches" of gas, the taper put out "as if it had been immersed into water" and
// burning "with a dazzling splendour", azote from the Greek a- and zoe, oxygen from oxys; "nothing is
// created" is in chapter 13. Priestley, Experiments and Observations on Different Kinds of Air, vol. 2
// (1775): 1 August 1774, a lens of 12 inches diameter and 20 inches focal distance. Lavoisier's memoir on
// the calcination of tin in closed vessels (Mém. Acad. 1774, published 1777). Trudaine's lens (Smeaton,
// Annals of Science 1987). Scheele's date varies between sources (1771 to 1772), so the room says "the
// early 1770s"; his book is of 1777. Lavoisier's death: 8 May 1794 (sci only, once, plainly).
export const FIRE_WORDS = {
  en: {
    title: 'Lavoisier\'s laboratory, 1770s',
    greet: {
      kid: 'We are inside the picture: Antoine Lavoisier\'s laboratory in Paris, in the 1770s, when people found out what a fire really needs. Out on the terrace stands a giant burning lens. The picture\'s story is on the easel beside you.',
      sci: 'Lavoisier\'s laboratory in Paris in the 1770s, the years when oxygen was found and burning understood: the burning lens on the terrace, the twelve days on the back bench, the balance by the window. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'For almost a hundred years chemists believed that burning things give off a fire stuff called phlogiston. Lavoisier weighed everything, and found the opposite: burning things take something from the air.',
        'Marie-Anne Lavoisier worked in this laboratory too. She wrote down the results and drew the apparatus so well that her pictures went into Lavoisier\'s famous book.',
        'Oxygen was found by three people at almost the same time: Carl Wilhelm Scheele in Sweden, Joseph Priestley in England and Lavoisier here in Paris. Lavoisier was the one who explained what it does in a fire.',
      ],
      sci: [
        'The phlogiston theory (Georg Ernst Stahl, early 1700s) said that a burning body gives off phlogiston. Yet a metal turned to calx in air gains weight. Lavoisier\'s answer: it combines with a part of the air, the part he named oxygène.',
        'Marie-Anne Paulze Lavoisier learned English and translated Richard Kirwan\'s Essay on Phlogiston (1788) with critical notes, studied drawing with Jacques-Louis David, and drew and engraved the 13 plates of the Traité élémentaire de chimie (1789).',
        'Lavoisier was guillotined in Paris on 8 May 1794, during the Terror, as a former tax farmer (fermier général). He was 50.',
      ],
    },
    lens: {
      label: 'The great burning lens',
      title: '1774: the air from a red powder',
      hints: { aim: 'Tap the lens to aim the sun at the red powder', wait: 'Watch the gas push the mercury down', candle: 'Tap the candle to lower it into the gas', again: 'Tap the lens to try it again' },
      buttons: { aim: 'Aim the lens at the sun', candle: 'Lower the candle into the gas' },
      says: {
        aim: { kid: 'The lens gathers the sunshine into one dazzling spot on the red powder. Watch the jar!', sci: 'The lens brings the sun to a focus on the red calx of mercury (HgO), floating at the top of the jar of mercury.' },
        heating: { kid: 'Still heating: a gas is coming out of the red powder.', sci: 'Still heating: 2 HgO → 2 Hg + O₂.' },
        caught: { kid: 'The red powder is gone, and a gas has pushed the mercury out of the jar. Now tap the candle!', sci: 'The calx is decomposed: the jar holds the gas it gave off, the mercury has run back into the basin. Now the candle test.' },
        notYet: { kid: 'First we need the gas: tap the lens to heat the red powder.', sci: 'No gas collected yet: heat the calx first.' },
        bright: { kid: 'Whoa! The candle blazes far brighter than in ordinary air. This gas makes things burn better than air does!', sci: 'The candle burns far more vigorously than in common air, as Priestley found: the gas supports combustion better than air itself.' },
      },
      panel: {
        kid: [
          'On 1 August 1774, in England, Joseph Priestley heated a red powder with a big lens and the sunshine. The powder was made from mercury, and it floated at the top of a glass jar full of mercury. A gas came out of it and pushed the mercury down.',
          'Then he put a candle into the gas, and it burned with an amazing bright flame. Priestley had found a new kind of air, better than ordinary air for burning and breathing. Today we call it oxygen.',
          'A Swedish chemist, Carl Wilhelm Scheele, had made the same gas a few years before, but his book came out only in 1777. And here in Paris, Lavoisier worked out what the gas does: it is the part of the air that fires need. Mercury is poisonous, so nobody does the experiment this way today; in the picture it is safe to watch.',
        ],
        sci: [
          'Joseph Priestley, 1 August 1774: with a burning lens of 12 inches diameter and 20 inches focal length he heated mercurius calcinatus per se, red mercury(II) oxide, floating on the mercury at the top of a glass vessel filled with mercury and inverted in a basin of mercury. 2 HgO → 2 Hg + O₂: the gas collected and the mercury was pushed down. A candle burned in it with a remarkably vigorous flame. In March 1775 he found that a mouse lived longer in it than in common air, and called it dephlogisticated air.',
          'Carl Wilhelm Scheele had made the same gas in Uppsala in the early 1770s, by heating mercury oxide, saltpetre and other substances, and called it fire air (Feuerluft); his book, Chemische Abhandlung von der Luft und dem Feuer, was delayed until 1777. Priestley described his experiment to Lavoisier in Paris in October 1774. Who discovered oxygen is still argued over; Lavoisier himself wrote that it was discovered almost at the same time by Priestley, Scheele and himself.',
          'Burning lenses were tools of chemistry then: the Academy of Sciences used great ones out of doors, and Lavoisier worked with the new lens of Trudaine de Montigny (1774) in the Jardin de l\'Infante by the Louvre. By 1777 Lavoisier had concluded that the gas is one part of the air: the part that combines with burning bodies and with metals turning to calx. He named it oxygène, "acid maker" (Greek oxys, sharp), believing it to be in every acid; in 1810 Humphry Davy showed that muriatic acid (HCl) holds none. Mercury and its vapour are toxic: this is not an experiment to repeat.',
        ],
      },
    },
    days: {
      label: 'The twelve days',
      title: 'Twelve days of heating mercury in air',
      slider: 'Days of heating',
      board: { day: 'Day {d} of 12', air: 'Air: {v} cubic inches' },
      hints: {
        fire: 'Tap the furnace to light it, or slide the days',
        burning: 'The days go by, watch the red crust and the air',
        taper: 'Tap the first candle to try the air that is left',
        crust: 'Tap the red crust to heat it strongly',
        wait: 'Watch the small jar fill with air',
        taper2: 'Tap the second candle to try that air',
        again: 'Tap the furnace to start again',
      },
      buttons: { fire: 'Light the furnace', stop: 'Put the fire out', again: 'Start again', taper: 'A candle into the air that is left', crust: 'Heat the red crust', taper2: 'A candle into the air from the crust' },
      says: {
        fire: { kid: 'The fire is lit. Lavoisier kept the mercury almost boiling for twelve days and nights.', sci: 'Furnace lit: the mercury is kept just below its boiling point (356.7 °C).' },
        stop: { kid: 'Fire out: the days stop.', sci: 'Furnace out.' },
        done: { kid: 'Twelve days! The red crust stopped growing, and the air in the jar shrank by about a sixth. Something was taken out of the air!', sci: 'Day 12: the calx no longer increases. 50 cubic inches of air are down to between 42 and 43: about 1/6 has gone into the red calx.' },
        early: { kid: 'Not yet: let the twelve days go by first.', sci: 'First complete the twelve days of heating.' },
        out: { kid: 'Pff! The candle went out at once, as if dipped in water. Lavoisier called this leftover air azote, "no life". In English we call it nitrogen.', sci: 'The taper is put out "as if it had been immersed into water": the residue supports neither burning nor breathing. Lavoisier\'s azote, from the Greek a- (not) and zoe (life): nitrogen.' },
        heat: { kid: 'The red crust goes into a small glass retort over a hot flame.', sci: 'The 45 grains of red calx, heated almost red-hot in a small retort.' },
        crust: { kid: 'The red crust is gone! Shiny mercury runs down the tube, and air has come back into the small jar: about as much as the big jar lost.', sci: '41.5 grains of mercury and 7 to 8 cubic inches of gas: as much air as the heating took up. 2 HgO → 2 Hg + O₂.' },
        noCrust: { kid: 'There is no air in the small jar yet: tap the red crust first.', sci: 'Nothing collected yet: heat the calx first.' },
        bright: { kid: 'Look at it blaze! The air from the red crust is the part of the air that fires need. Lavoisier named it oxygen.', sci: '"A taper burned in it with a dazzling splendour" (Kerr\'s translation). Mixed back with the 42 cubic inches of azote, it gave air like the atmosphere again.' },
        again: { kid: 'A fresh flask of mercury and a fresh jar of air: here we go again.', sci: 'Fresh mercury, fresh air: the furnace is lit again.' },
      },
      panel: {
        kid: [
          'Lavoisier put some mercury, a shiny liquid metal, into a glass flask with a very long neck. The neck opened into a big glass jar full of air, standing in a dish of mercury. Then he kept the mercury hot for twelve days and nights.',
          'A red crust grew on the mercury, and the air in the jar shrank: the mercury crept up into the jar. About a sixth of the air was gone! A candle went out in the air that was left, so Lavoisier called it azote, "no life". In French it is still called azote; in English it is nitrogen.',
          'Then he heated the red crust strongly. It turned back into mercury and gave back the missing air, and in that air a candle burned dazzlingly. Air is a mix, and its burning part had been hiding in the red crust. Mercury and its vapour are poisonous, so nobody should try this; in the picture it is safe to watch.',
        ],
        sci: [
          'From the Traité élémentaire de chimie (1789): a matrass of about 36 cubic inches with a long bent neck, its end under a bell glass standing in a trough of mercury; 4 ounces of pure mercury; the fire kept up for 12 days, the mercury always almost at its boiling point. On the second day small red particles appeared; they grew for four or five days, then no more.',
          'The air at the start (reduced to 28 inches of the barometer and 10 °Réaumur): about 50 cubic inches; at the end, between 42 and 43, about 1/6 less (a French cubic inch is about 19.8 cm³). The mercury took up oxygen as red calx, 2 Hg + O₂ → 2 HgO: 45 grains of it. The residue put out a taper and suffocated animals: azote, our nitrogen. Air is in fact 21% oxygen by volume, about a fifth; as Lavoisier noted, the mercury cannot take it all up.',
          'The 45 grains of calx, heated almost red-hot in a small retort, gave 41.5 grains of mercury and 7 to 8 cubic inches of a gas far better than common air for breathing and burning: 2 HgO → 2 Hg + O₂. The weights add up: at half a grain to the cubic inch (Lavoisier\'s own figure) the gas weighed about 3.5 grains. Mixed again with the azote, it gave back air like the atmosphere: analysis and synthesis. Mercury and its vapour are toxic: not an experiment to repeat.',
        ],
      },
    },
    balance: {
      label: 'The great balance',
      title: 'Fire does not destroy weight',
      hints: { heat: 'Tap the sealed flask to heat the tin inside', wait: 'Watch the balance while the flask is away', open: 'Tap the sealed tip of the flask to break it', again: 'Tap the flask for a new one' },
      buttons: { heat: 'Heat the sealed flask', open: 'Break the sealed tip' },
      says: {
        off: { kid: 'Off the pan it goes, so the balance tips. The tin will be heated with nothing able to get in or out.', sci: 'The sealed flask is off its pan: the beam tips toward the weights. Now it is heated on the brazier.' },
        back: { kid: 'Back on its pan, and the balance is level again! Some tin has turned to grey powder, but the flask weighs just the same.', sci: 'Back on the pan: balanced, as before the heating. Part of the tin is now calx, yet the sealed flask weighs the same.' },
        open: { kid: 'Hiss! Air rushed into the flask, and now it is heavier. The tin had taken some of the air inside, and new air came in to fill its place.', sci: 'Air rushes in as the seal breaks, and the flask gains weight: the weight of the air the tin took up, which Lavoisier found equal to the tin\'s own gain.' },
        heatFirst: { kid: 'Heat the tin first: tap the flask.', sci: 'Heat the tin first.' },
        tipFirst: { kid: 'Now tap the sealed tip of the flask.', sci: 'Now break the seal.' },
        fresh: { kid: 'A new sealed flask with shiny new tin.', sci: 'A fresh flask, sealed with its air inside.' },
      },
      panel: {
        kid: [
          'People used to think that burning destroys things, or lets out a mysterious fire stuff called phlogiston. But when a metal burns into a powder, the powder is heavier than the metal was! Lavoisier wanted to know why.',
          'He sealed some tin in a glass flask, so that nothing could get in or out, weighed it, and heated it until some of the tin turned into a grey powder. The whole flask weighed exactly the same. When he broke it open, air rushed in, and only then was it heavier.',
          'So the tin had joined with part of the air inside the flask. Nothing disappears when things burn: it changes into something else. Burning is joining with oxygen.',
        ],
        sci: [
          'Lavoisier\'s memoir on the calcination of tin in closed vessels (Academy of Sciences, 1774, published 1777) repeated an experiment of Robert Boyle\'s. Tin heated in a sealed glass retort turns partly to calx; sealed, the retort and its contents weighed the same before and after.',
          'When the retort was opened, air rushed in and the weight rose by as much as the tin had gained: the metal had taken up a part of the air inside. Calcination is a combination with air, not a loss of phlogiston: Sn + O₂ → SnO₂.',
          'The rule that matter is neither created nor destroyed in a reaction is Lavoisier\'s: "in all the operations of art and nature, nothing is created; an equal quantity of matter exists both before and after the experiment" (Traité, 1789, in Kerr\'s translation). The famous "nothing is lost, nothing is created, everything is transformed" is a later paraphrase of it. With it, and with oxygen, the phlogiston theory fell in the 1780s.',
        ],
      },
    },
    table: {
      label: 'Marie-Anne Lavoisier\'s table',
      hints: { look: 'Tap the drawing to see the next one' },
      buttons: { next: 'Next drawing' },
      pages: [
        { title: 'Drawing I: the burning lens', kid: ['The great lens on its carriage, gathering the sun onto the jar of mercury on its table.'], sci: ['The burning lens and the jar inverted over mercury, the apparatus of the terrace, drawn as an engraving would show it.'] },
        { title: 'Drawing II: the twelve days', kid: ['The furnace, the flask with its long neck, and the bell jar standing in the trough of mercury.'], sci: ['After plate IV, figure 2 of the Traité (1789): the furnace, the matrass and its bent neck, the bell glass over the trough of mercury.'] },
        { title: 'Drawing III: the balance', kid: ['The balance with the sealed flask of tin on one pan and the weights on the other, the brazier beside it.'], sci: ['The balance with the sealed retort of tin and its weights, and the brazier on which it was heated.'] },
      ],
      about: {
        kid: [
          'Marie-Anne Lavoisier was Antoine Lavoisier\'s wife and his partner in the laboratory. She wrote down the measurements, and she learned English so that she could read and translate what other chemists wrote.',
          'She took drawing lessons from a famous painter, Jacques-Louis David, and drew and engraved all thirteen pictures of the apparatus in Lavoisier\'s great chemistry book of 1789.',
        ],
        sci: [
          'Marie-Anne Pierrette Paulze (1758 to 1836) married Antoine Lavoisier in 1771, at thirteen. She kept records in the laboratory notebooks; in two drawings of experiments on human respiration (about 1790) she drew herself at a side table, taking the notes.',
          'She learned English and translated Richard Kirwan\'s Essay on Phlogiston (1788), adding critical notes, studied drawing with Jacques-Louis David, and made the 13 copperplates of the Traité élémentaire de chimie (1789), signed Paulze Lavoisier sculpsit.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'O laboratório de Lavoisier, anos 1770',
    greet: {
      kid: 'Estamos dentro da imagem: o laboratório de Antoine Lavoisier em Paris, nos anos 1770, quando se descobriu do que precisa mesmo o fogo. Lá fora, no terraço, está uma lente gigante para queimar. A história da imagem está no cavalete ao teu lado.',
      sci: 'O laboratório de Lavoisier em Paris nos anos 1770, quando se descobriu o oxigénio e se percebeu a combustão: a lente ustória no terraço, os doze dias na bancada do fundo, a balança junto à janela. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Durante quase cem anos, os químicos acreditaram que as coisas, ao arder, largavam uma substância de fogo chamada flogisto. Lavoisier pesou tudo e descobriu o contrário: o que arde tira alguma coisa ao ar.',
        'A Marie-Anne Lavoisier também trabalhava neste laboratório. Apontava os resultados e desenhava os aparelhos tão bem que os desenhos dela foram para o famoso livro de Lavoisier.',
        'O oxigénio foi descoberto por três pessoas quase ao mesmo tempo: Carl Wilhelm Scheele na Suécia, Joseph Priestley em Inglaterra e Lavoisier aqui em Paris. Foi Lavoisier quem explicou o que ele faz num fogo.',
      ],
      sci: [
        'A teoria do flogisto (Georg Ernst Stahl, início do século XVIII) dizia que um corpo que arde liberta flogisto. Mas um metal que se transforma em cal ao ar ganha peso. A resposta de Lavoisier: combina-se com uma parte do ar, a parte a que chamou oxygène.',
        'Marie-Anne Paulze Lavoisier aprendeu inglês e traduziu o Essay on Phlogiston de Richard Kirwan (1788) com notas críticas, estudou desenho com Jacques-Louis David e desenhou e gravou as 13 estampas do Traité élémentaire de chimie (1789).',
        'Lavoisier foi guilhotinado em Paris a 8 de maio de 1794, durante o Terror, por ter sido cobrador de impostos (fermier général). Tinha 50 anos.',
      ],
    },
    lens: {
      label: 'A grande lente ustória',
      title: '1774: o ar de um pó vermelho',
      hints: { aim: 'Toca na lente para apontares o sol ao pó vermelho', wait: 'Olha o gás a empurrar o mercúrio para baixo', candle: 'Toca na vela para a baixares para dentro do gás', again: 'Toca na lente para tentares outra vez' },
      buttons: { aim: 'Apontar a lente ao sol', candle: 'Baixar a vela para dentro do gás' },
      says: {
        aim: { kid: 'A lente junta a luz do sol num ponto que encandeia, em cima do pó vermelho. Olha para o frasco!', sci: 'A lente concentra o sol na cal vermelha de mercúrio (HgO), a flutuar no topo do frasco de mercúrio.' },
        heating: { kid: 'Ainda está a aquecer: está a sair um gás do pó vermelho.', sci: 'Ainda a aquecer: 2 HgO → 2 Hg + O₂.' },
        caught: { kid: 'O pó vermelho desapareceu, e um gás empurrou o mercúrio para fora do frasco. Agora toca na vela!', sci: 'A cal decompôs-se: o frasco guarda o gás que ela libertou, e o mercúrio voltou para a bacia. Agora o teste da vela.' },
        notYet: { kid: 'Primeiro precisamos do gás: toca na lente para aquecer o pó vermelho.', sci: 'Ainda não há gás recolhido: aquece primeiro a cal.' },
        bright: { kid: 'Uau! A vela arde com muito mais brilho do que no ar normal. Este gás faz as coisas arder melhor do que o ar!', sci: 'A vela arde com muito mais vigor do que no ar comum, como Priestley verificou: o gás alimenta a combustão melhor do que o próprio ar.' },
      },
      panel: {
        kid: [
          'A 1 de agosto de 1774, em Inglaterra, Joseph Priestley aqueceu um pó vermelho com uma lente grande e a luz do sol. O pó era feito de mercúrio e flutuava no topo de um frasco de vidro cheio de mercúrio. Saiu dele um gás, que empurrou o mercúrio para baixo.',
          'Depois pôs uma vela dentro do gás, e ela ardeu com uma chama espantosamente brilhante. Priestley tinha encontrado um ar novo, melhor do que o ar normal para arder e para respirar. Hoje chamamos-lhe oxigénio.',
          'Um químico sueco, Carl Wilhelm Scheele, já tinha feito o mesmo gás uns anos antes, mas o livro dele só saiu em 1777. E aqui em Paris, Lavoisier percebeu o que o gás faz: é a parte do ar de que o fogo precisa. O mercúrio é venenoso, por isso hoje ninguém faz a experiência desta maneira; dentro da imagem podes vê-la em segurança.',
        ],
        sci: [
          'Joseph Priestley, 1 de agosto de 1774: com uma lente ustória de 12 polegadas de diâmetro e 20 polegadas de distância focal, aqueceu mercurius calcinatus per se, óxido de mercúrio(II) vermelho, a flutuar no mercúrio no topo de um frasco de vidro cheio de mercúrio e virado ao contrário numa bacia de mercúrio. 2 HgO → 2 Hg + O₂: o gás juntou-se e o mercúrio foi empurrado para baixo. Uma vela ardeu nele com uma chama notavelmente vigorosa. Em março de 1775 verificou que um rato vivia nele mais tempo do que no ar comum, e chamou-lhe ar desflogisticado.',
          'Carl Wilhelm Scheele já tinha feito o mesmo gás em Uppsala no início dos anos 1770, aquecendo óxido de mercúrio, salitre e outras substâncias, e chamou-lhe ar de fogo (Feuerluft); o livro dele, Chemische Abhandlung von der Luft und dem Feuer, atrasou-se até 1777. Priestley descreveu a experiência a Lavoisier em Paris em outubro de 1774. Quem descobriu o oxigénio ainda se discute; o próprio Lavoisier escreveu que fora descoberto quase ao mesmo tempo por Priestley, por Scheele e por ele.',
          'As lentes ustórias eram então instrumentos de química: a Academia das Ciências usava lentes enormes ao ar livre, e Lavoisier trabalhou com a lente nova de Trudaine de Montigny (1774) no Jardin de l\'Infante, junto ao Louvre. Em 1777 Lavoisier tinha concluído que o gás é uma das partes do ar: a que se combina com os corpos que ardem e com os metais que se transformam em cal. Chamou-lhe oxygène, «gerador de ácidos» (do grego oxys, agudo), por julgar que estava em todos os ácidos; em 1810 Humphry Davy mostrou que o ácido muriático (HCl) não tem nenhum. O mercúrio e o seu vapor são tóxicos: não é uma experiência para repetir.',
        ],
      },
    },
    days: {
      label: 'Os doze dias',
      title: 'Doze dias a aquecer mercúrio no ar',
      slider: 'Dias de aquecimento',
      board: { day: 'Dia {d} de 12', air: 'Ar: {v} polegadas cúbicas' },
      hints: {
        fire: 'Toca no forno para o acenderes, ou faz correr os dias',
        burning: 'Os dias passam, olha a crosta vermelha e o ar',
        taper: 'Toca na primeira vela para experimentares o ar que sobrou',
        crust: 'Toca na crosta vermelha para a aqueceres com força',
        wait: 'Olha o frasco pequeno a encher-se de ar',
        taper2: 'Toca na segunda vela para experimentares esse ar',
        again: 'Toca no forno para recomeçares',
      },
      buttons: { fire: 'Acender o forno', stop: 'Apagar o fogo', again: 'Recomeçar', taper: 'Uma vela no ar que sobrou', crust: 'Aquecer a crosta vermelha', taper2: 'Uma vela no ar da crosta' },
      says: {
        fire: { kid: 'O fogo está aceso. Lavoisier manteve o mercúrio quase a ferver durante doze dias e doze noites.', sci: 'Forno aceso: o mercúrio fica mesmo abaixo do ponto de ebulição (356,7 °C).' },
        stop: { kid: 'Fogo apagado: os dias param.', sci: 'Forno apagado.' },
        done: { kid: 'Doze dias! A crosta vermelha deixou de crescer, e o ar do frasco encolheu cerca de um sexto. Alguma coisa foi tirada ao ar!', sci: 'Dia 12: a cal já não aumenta. As 50 polegadas cúbicas de ar desceram para entre 42 e 43: cerca de 1/6 passou para a cal vermelha.' },
        early: { kid: 'Ainda não: deixa passar primeiro os doze dias.', sci: 'Completa primeiro os doze dias de aquecimento.' },
        out: { kid: 'Pff! A vela apagou-se logo, como se a mergulhassem em água. Lavoisier chamou a este ar que sobrou azote, «sem vida». É por isso que em português se chama azoto!', sci: 'A vela apaga-se «como se tivesse sido mergulhada em água»: o resto não alimenta nem a combustão nem a respiração. O azote de Lavoisier, do grego a- (sem) e zoe (vida): o azoto.' },
        heat: { kid: 'A crosta vermelha vai para uma pequena retorta de vidro sobre uma chama quente.', sci: 'Os 45 grãos de cal vermelha, aquecidos quase ao rubro numa pequena retorta.' },
        crust: { kid: 'A crosta vermelha desapareceu! Escorre mercúrio brilhante pelo tubo, e voltou ar para o frasco pequeno: mais ou menos o que o frasco grande perdeu.', sci: '41,5 grãos de mercúrio e 7 a 8 polegadas cúbicas de gás: tanto ar quanto o aquecimento tinha absorvido. 2 HgO → 2 Hg + O₂.' },
        noCrust: { kid: 'Ainda não há ar no frasco pequeno: toca primeiro na crosta vermelha.', sci: 'Ainda nada recolhido: aquece primeiro a cal.' },
        bright: { kid: 'Olha como arde! O ar da crosta vermelha é a parte do ar de que o fogo precisa. Lavoisier chamou-lhe oxigénio.', sci: '«Uma vela ardeu nele com um brilho deslumbrante», escreveu Lavoisier. Misturado de novo com as 42 polegadas cúbicas de azoto, voltou a dar um ar igual ao da atmosfera.' },
        again: { kid: 'Um frasco novo de mercúrio e um frasco novo de ar: vamos outra vez.', sci: 'Mercúrio novo, ar novo: o forno volta a acender-se.' },
      },
      panel: {
        kid: [
          'Lavoisier pôs um pouco de mercúrio, um metal líquido e brilhante, num balão de vidro com um gargalo muito comprido. O gargalo ia dar a um frasco grande cheio de ar, pousado numa tina de mercúrio. Depois manteve o mercúrio quente durante doze dias e doze noites.',
          'Cresceu uma crosta vermelha no mercúrio, e o ar do frasco encolheu: o mercúrio foi subindo dentro do frasco. Desapareceu cerca de um sexto do ar! Uma vela apagou-se no ar que sobrou, e por isso Lavoisier chamou-lhe azote, «sem vida». Em português ainda se chama azoto.',
          'Depois aqueceu com força a crosta vermelha. Ela voltou a ser mercúrio e devolveu o ar que faltava, e nesse ar uma vela ardeu com um brilho deslumbrante. O ar é uma mistura, e a sua parte que faz arder estava escondida na crosta vermelha. O mercúrio e o seu vapor são venenosos, por isso ninguém deve experimentar isto; dentro da imagem podes ver em segurança.',
        ],
        sci: [
          'Do Traité élémentaire de chimie (1789): um balão (matras) de cerca de 36 polegadas cúbicas com um gargalo comprido e curvado, a ponta debaixo de uma campânula pousada numa tina de mercúrio; 4 onças de mercúrio puro; o fogo mantido 12 dias, o mercúrio sempre quase a ferver. No segundo dia apareceram pequenas partículas vermelhas; cresceram durante quatro ou cinco dias e depois deixaram de crescer.',
          'O ar ao início (reduzido a 28 polegadas de barómetro e 10 °Réaumur): cerca de 50 polegadas cúbicas; no fim, entre 42 e 43, cerca de 1/6 a menos (uma polegada cúbica francesa são cerca de 19,8 cm³). O mercúrio absorveu oxigénio como cal vermelha, 2 Hg + O₂ → 2 HgO: 45 grãos. O resto apagava as velas e asfixiava os animais: o azote, o nosso azoto. Na verdade, o ar tem 21% de oxigénio em volume, cerca de um quinto; como Lavoisier notou, o mercúrio não consegue absorvê-lo todo.',
          'Os 45 grãos de cal, aquecidos quase ao rubro numa pequena retorta, deram 41,5 grãos de mercúrio e 7 a 8 polegadas cúbicas de um gás muito melhor do que o ar comum para respirar e para arder: 2 HgO → 2 Hg + O₂. Os pesos batem certo: a meio grão por polegada cúbica (o valor do próprio Lavoisier), o gás pesava cerca de 3,5 grãos. Misturado de novo com o azoto, voltou a dar um ar igual ao da atmosfera: análise e síntese. O mercúrio e o seu vapor são tóxicos: não é uma experiência para repetir.',
        ],
      },
    },
    balance: {
      label: 'A grande balança',
      title: 'O fogo não destrói o peso',
      hints: { heat: 'Toca no balão selado para aquecer o estanho lá dentro', wait: 'Olha a balança enquanto o balão está fora', open: 'Toca na ponta selada do balão para a partires', again: 'Toca no balão para teres um novo' },
      buttons: { heat: 'Aquecer o balão selado', open: 'Partir a ponta selada' },
      says: {
        off: { kid: 'Sai do prato, e a balança inclina-se. O estanho vai ser aquecido sem nada poder entrar ou sair.', sci: 'O balão selado sai do prato: o travessão inclina-se para os pesos. Agora é aquecido no braseiro.' },
        back: { kid: 'De volta ao prato, e a balança fica outra vez direita! Parte do estanho virou pó cinzento, mas o balão pesa exatamente o mesmo.', sci: 'De volta ao prato: em equilíbrio, como antes do aquecimento. Parte do estanho é agora cal, e mesmo assim o balão selado pesa o mesmo.' },
        open: { kid: 'Fsss! Entrou ar no balão, e agora está mais pesado. O estanho tinha tirado parte do ar lá de dentro, e entrou ar novo para ocupar o lugar.', sci: 'Ao partir o selo, o ar entra de rompante e o balão ganha peso: o peso do ar que o estanho absorveu, que Lavoisier achou igual ao que o próprio estanho ganhou.' },
        heatFirst: { kid: 'Primeiro aquece o estanho: toca no balão.', sci: 'Aquece primeiro o estanho.' },
        tipFirst: { kid: 'Agora toca na ponta selada do balão.', sci: 'Agora parte o selo.' },
        fresh: { kid: 'Um balão novo e selado, com estanho novo e brilhante.', sci: 'Um balão novo, selado com o seu ar lá dentro.' },
      },
      panel: {
        kid: [
          'Antigamente pensava-se que arder destrói as coisas, ou deixa escapar uma misteriosa substância de fogo chamada flogisto. Mas quando um metal arde e fica em pó, o pó pesa mais do que o metal! Lavoisier quis saber porquê.',
          'Selou um pouco de estanho num balão de vidro, para nada poder entrar nem sair, pesou-o e aqueceu-o até parte do estanho virar um pó cinzento. O balão inteiro pesava exatamente o mesmo. Quando o partiu, o ar entrou de rompante, e só então ficou mais pesado.',
          'Ou seja, o estanho tinha-se juntado a uma parte do ar que estava dentro do balão. Nada desaparece quando as coisas ardem: transforma-se noutra coisa. Arder é juntar-se ao oxigénio.',
        ],
        sci: [
          'A memória de Lavoisier sobre a calcinação do estanho em vasos fechados (Academia das Ciências, 1774, publicada em 1777) repetiu uma experiência de Robert Boyle. O estanho aquecido numa retorta de vidro selada transforma-se em parte em cal; selada, a retorta com o que tinha dentro pesava o mesmo antes e depois.',
          'Quando a retorta se abriu, o ar entrou de rompante e o peso subiu tanto quanto o estanho tinha ganho: o metal tinha absorvido uma parte do ar lá dentro. A calcinação é uma combinação com o ar, não uma perda de flogisto: Sn + O₂ → SnO₂.',
          'A regra de que numa reação a matéria não se cria nem se destrói é de Lavoisier: «nada se cria, nem nas operações da arte nem nas da natureza, e pode-se pôr como princípio que em toda a operação há uma quantidade igual de matéria antes e depois» (Traité, 1789). O famoso «nada se perde, nada se cria, tudo se transforma» é uma paráfrase posterior. Com ela, e com o oxigénio, a teoria do flogisto caiu nos anos 1780.',
        ],
      },
    },
    table: {
      label: 'A mesa de Marie-Anne Lavoisier',
      hints: { look: 'Toca no desenho para veres o seguinte' },
      buttons: { next: 'Desenho seguinte' },
      pages: [
        { title: 'Desenho I: a lente ustória', kid: ['A grande lente no seu carro, a juntar o sol no frasco de mercúrio pousado na mesa.'], sci: ['A lente ustória e o frasco virado sobre o mercúrio, o aparelho do terraço, desenhado como uma gravura o mostraria.'] },
        { title: 'Desenho II: os doze dias', kid: ['O forno, o balão com o seu gargalo comprido e a campânula pousada na tina de mercúrio.'], sci: ['Segundo a estampa IV, figura 2 do Traité (1789): o forno, o matras e o seu gargalo curvado, a campânula sobre a tina de mercúrio.'] },
        { title: 'Desenho III: a balança', kid: ['A balança com o balão selado de estanho num prato e os pesos no outro, e o braseiro ao lado.'], sci: ['A balança com a retorta selada de estanho e os seus pesos, e o braseiro em que era aquecida.'] },
      ],
      about: {
        kid: [
          'Marie-Anne Lavoisier era a mulher de Antoine Lavoisier e a sua parceira no laboratório. Apontava as medições, e aprendeu inglês para poder ler e traduzir o que os outros químicos escreviam.',
          'Teve aulas de desenho com um pintor famoso, Jacques-Louis David, e desenhou e gravou todas as treze imagens dos aparelhos do grande livro de química de Lavoisier, de 1789.',
        ],
        sci: [
          'Marie-Anne Pierrette Paulze (1758 a 1836) casou com Antoine Lavoisier em 1771, aos treze anos. Fazia os registos nos cadernos do laboratório; em dois desenhos de experiências sobre a respiração humana (por volta de 1790) desenhou-se a si própria numa mesa ao lado, a tomar notas.',
          'Aprendeu inglês e traduziu o Essay on Phlogiston de Richard Kirwan (1788), com notas críticas, estudou desenho com Jacques-Louis David e fez as 13 chapas de cobre do Traité élémentaire de chimie (1789), assinadas Paulze Lavoisier sculpsit.',
        ],
      },
    },
  },
  pl: {
    title: 'Laboratorium Lavoisiera, lata 70. XVIII wieku',
    greet: {
      kid: 'Jesteśmy w środku obrazka: w laboratorium Antoine\'a Lavoisiera w Paryżu, w latach 70. XVIII wieku, kiedy ludzie odkryli, czego naprawdę potrzebuje ogień. Na tarasie stoi olbrzymia soczewka zapalająca. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'To laboratorium Lavoisiera w Paryżu w latach 70. XVIII wieku, kiedy odkryto tlen i zrozumiano spalanie: soczewka zapalająca na tarasie, dwanaście dni na stole w głębi, waga przy oknie. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Przez prawie sto lat chemicy wierzyli, że to, co się pali, wypuszcza ognistą substancję zwaną flogistonem. Lavoisier wszystko ważył i odkrył coś odwrotnego: to, co się pali, zabiera coś z powietrza.',
        'Marie-Anne Lavoisier też pracowała w tym laboratorium. Zapisywała wyniki i rysowała przyrządy tak pięknie, że jej rysunki trafiły do słynnej książki Lavoisiera.',
        'Tlen odkryły trzy osoby niemal w tym samym czasie: Carl Wilhelm Scheele w Szwecji, Joseph Priestley w Anglii i Lavoisier tutaj, w Paryżu. To Lavoisier wyjaśnił, co tlen robi w ogniu.',
      ],
      sci: [
        'Teoria flogistonu (Georg Ernst Stahl, początek XVIII wieku) głosiła, że palące się ciało oddaje flogiston. A jednak metal zamieniony na powietrzu w zgorzelinę staje się cięższy. Odpowiedź Lavoisiera: łączy się z częścią powietrza, tą, którą nazwał oxygène.',
        'Marie-Anne Paulze Lavoisier nauczyła się angielskiego i przetłumaczyła Essay on Phlogiston Richarda Kirwana (1788) z krytycznymi przypisami, uczyła się rysunku u Jacques\'a-Louisa Davida, a 13 tablic do Traité élémentaire de chimie (1789) sama narysowała i wyryła.',
        'Lavoisier został zgilotynowany w Paryżu 8 maja 1794 roku, w czasie terroru, jako dawny dzierżawca podatków (fermier général). Miał 50 lat.',
      ],
    },
    lens: {
      label: 'Wielka soczewka zapalająca',
      title: '1774: powietrze z czerwonego proszku',
      hints: { aim: 'Dotknij soczewki, żeby skierować słońce na czerwony proszek', wait: 'Patrz, jak gaz spycha rtęć w dół', candle: 'Dotknij świecy, żeby opuścić ją do gazu', again: 'Dotknij soczewki, żeby spróbować jeszcze raz' },
      buttons: { aim: 'Skieruj soczewkę na słońce', candle: 'Opuść świecę do gazu' },
      says: {
        aim: { kid: 'Soczewka zbiera światło słońca w jeden oślepiający punkt na czerwonym proszku. Patrz na słoik!', sci: 'Soczewka skupia słońce na czerwonym tlenku rtęci (HgO), który pływa na szczycie słoja pełnego rtęci.' },
        heating: { kid: 'Jeszcze się grzeje: z czerwonego proszku wydobywa się gaz.', sci: 'Jeszcze się grzeje: 2 HgO → 2 Hg + O₂.' },
        caught: { kid: 'Czerwony proszek zniknął, a gaz wypchnął rtęć ze słoika. Teraz dotknij świecy!', sci: 'Tlenek się rozłożył: słój zawiera wydzielony gaz, a rtęć spłynęła z powrotem do miski. Teraz próba ze świecą.' },
        notYet: { kid: 'Najpierw potrzebny jest gaz: dotknij soczewki, żeby ogrzać czerwony proszek.', sci: 'Nie ma jeszcze gazu: najpierw ogrzej tlenek.' },
        bright: { kid: 'Ojej! Świeca płonie o wiele jaśniej niż w zwykłym powietrzu. W tym gazie wszystko pali się lepiej niż w powietrzu!', sci: 'Świeca płonie o wiele żywiej niż w zwykłym powietrzu, jak stwierdził Priestley: gaz podtrzymuje spalanie lepiej niż samo powietrze.' },
      },
      panel: {
        kid: [
          '1 sierpnia 1774 roku w Anglii Joseph Priestley ogrzał czerwony proszek za pomocą dużej soczewki i słońca. Proszek powstał z rtęci i pływał na szczycie szklanego słoja pełnego rtęci. Wydobył się z niego gaz i zepchnął rtęć w dół.',
          'Potem Priestley włożył do gazu świecę, a ona zapłonęła zdumiewająco jasnym płomieniem. Znalazł nowy rodzaj powietrza, lepszy od zwykłego do palenia i oddychania. Dziś nazywamy go tlenem.',
          'Szwedzki chemik Carl Wilhelm Scheele otrzymał ten sam gaz kilka lat wcześniej, ale jego książka ukazała się dopiero w 1777 roku. A tutaj, w Paryżu, Lavoisier zrozumiał, co ten gaz robi: to ta część powietrza, której potrzebuje ogień. Rtęć jest trująca, więc dziś nikt nie robi tego doświadczenia w ten sposób; w obrazku możesz bezpiecznie popatrzeć.',
        ],
        sci: [
          'Joseph Priestley, 1 sierpnia 1774: soczewką zapalającą o średnicy 12 cali i ogniskowej 20 cali ogrzewał mercurius calcinatus per se, czerwony tlenek rtęci(II), pływający na rtęci u szczytu szklanego naczynia napełnionego rtęcią i odwróconego w misce z rtęcią. 2 HgO → 2 Hg + O₂: gaz się zbierał, a rtęć była spychana w dół. Świeca paliła się w nim niezwykle żywym płomieniem. W marcu 1775 stwierdził, że mysz żyje w nim dłużej niż w zwykłym powietrzu, i nazwał go powietrzem zdeflogistonowanym.',
          'Carl Wilhelm Scheele otrzymał ten sam gaz w Uppsali na początku lat 70. XVIII wieku, ogrzewając tlenek rtęci, saletrę i inne substancje, i nazwał go powietrzem ognistym (Feuerluft); jego książka, Chemische Abhandlung von der Luft und dem Feuer, opóźniła się do 1777 roku. Priestley opisał swoje doświadczenie Lavoisierowi w Paryżu w październiku 1774. Kto odkrył tlen, wciąż jest przedmiotem sporu; sam Lavoisier napisał, że odkryli go niemal jednocześnie Priestley, Scheele i on sam.',
          'Soczewki zapalające były wtedy narzędziem chemii: Akademia Nauk używała wielkich soczewek pod gołym niebem, a Lavoisier pracował z nową soczewką Trudaine\'a de Montigny (1774) w Jardin de l\'Infante przy Luwrze. Do 1777 roku Lavoisier doszedł do wniosku, że gaz jest jedną z części powietrza: tą, która łączy się z palącymi się ciałami i z metalami zmieniającymi się w zgorzelinę. Nazwał go oxygène, „twórca kwasów” (z greckiego oxys, ostry), sądząc, że jest w każdym kwasie; w 1810 roku Humphry Davy pokazał, że kwas solny (HCl) wcale go nie zawiera. Rtęć i jej pary są toksyczne: tego doświadczenia się nie powtarza.',
        ],
      },
    },
    days: {
      label: 'Dwanaście dni',
      title: 'Dwanaście dni ogrzewania rtęci w powietrzu',
      slider: 'Dni ogrzewania',
      board: { day: 'Dzień {d} z 12', air: 'Powietrze: {v} cali sześc.' },
      hints: {
        fire: 'Dotknij pieca, żeby go rozpalić, albo przesuń dni',
        burning: 'Mijają dni, patrz na czerwony nalot i na powietrze',
        taper: 'Dotknij pierwszej świecy, żeby sprawdzić powietrze, które zostało',
        crust: 'Dotknij czerwonego nalotu, żeby go mocno ogrzać',
        wait: 'Patrz, jak mały słoik napełnia się powietrzem',
        taper2: 'Dotknij drugiej świecy, żeby sprawdzić to powietrze',
        again: 'Dotknij pieca, żeby zacząć od nowa',
      },
      buttons: { fire: 'Rozpal piec', stop: 'Zgaś ogień', again: 'Zacznij od nowa', taper: 'Świeca w powietrzu, które zostało', crust: 'Ogrzej czerwony nalot', taper2: 'Świeca w powietrzu z nalotu' },
      says: {
        fire: { kid: 'Ogień płonie. Lavoisier trzymał rtęć prawie we wrzeniu przez dwanaście dni i nocy.', sci: 'Piec rozpalony: rtęć jest trzymana tuż poniżej temperatury wrzenia (356,7 °C).' },
        stop: { kid: 'Ogień zgaszony: dni się zatrzymują.', sci: 'Piec zgaszony.' },
        done: { kid: 'Dwanaście dni! Czerwony nalot przestał rosnąć, a powietrza w słoju ubyło o mniej więcej jedną szóstą. Coś zostało zabrane z powietrza!', sci: 'Dzień 12: tlenku już nie przybywa. Z 50 cali sześciennych powietrza zostało od 42 do 43: około 1/6 przeszło do czerwonego tlenku.' },
        early: { kid: 'Jeszcze nie: najpierw niech minie dwanaście dni.', sci: 'Najpierw dokończ dwanaście dni ogrzewania.' },
        out: { kid: 'Pff! Świeca od razu zgasła, jakby ją zanurzyć w wodzie. Lavoisier nazwał to pozostałe powietrze azote, „bez życia”. Dlatego po polsku nazywa się azot!', sci: 'Świeca gaśnie, „jak gdyby zanurzono ją w wodzie”: reszta nie podtrzymuje ani spalania, ani oddychania. Azote Lavoisiera, od greckiego a- (bez) i zoe (życie): azot.' },
        heat: { kid: 'Czerwony nalot trafia do małej szklanej retorty nad gorącym płomieniem.', sci: '45 granów czerwonego tlenku, ogrzanych niemal do czerwoności w małej retorcie.' },
        crust: { kid: 'Czerwony nalot zniknął! Błyszcząca rtęć spływa rurką, a do małego słoika wróciło powietrze: mniej więcej tyle, ile ubyło z dużego.', sci: '41,5 grana rtęci i 7 do 8 cali sześciennych gazu: tyle powietrza, ile pochłonęło ogrzewanie. 2 HgO → 2 Hg + O₂.' },
        noCrust: { kid: 'W małym słoiku nie ma jeszcze powietrza: najpierw dotknij czerwonego nalotu.', sci: 'Jeszcze nic nie zebrano: najpierw ogrzej tlenek.' },
        bright: { kid: 'Patrz, jak płonie! Powietrze z czerwonego nalotu to ta część powietrza, której potrzebuje ogień. Lavoisier nazwał ją oxygène, a my mówimy tlen.', sci: '„Świeca paliła się w nim z olśniewającym blaskiem”, pisał Lavoisier. Zmieszany z powrotem z 42 calami sześciennymi azotu dał znów powietrze takie jak atmosferyczne.' },
        again: { kid: 'Świeża rtęć w kolbie i świeże powietrze w słoju: zaczynamy jeszcze raz.', sci: 'Świeża rtęć, świeże powietrze: piec znów rozpalony.' },
      },
      panel: {
        kid: [
          'Lavoisier wlał trochę rtęci, błyszczącego płynnego metalu, do szklanej kolby z bardzo długą szyjką. Szyjka kończyła się w dużym szklanym słoju pełnym powietrza, który stał w misie z rtęcią. Potem przez dwanaście dni i nocy trzymał rtęć gorącą.',
          'Na rtęci wyrósł czerwony nalot, a powietrza w słoju ubyło: rtęć wspinała się do środka słoja. Zniknęła mniej więcej jedna szósta powietrza! W powietrzu, które zostało, świeca gasła, więc Lavoisier nazwał je azote, „bez życia”. Po polsku mówimy na nie azot.',
          'Potem mocno ogrzał czerwony nalot. Zamienił się z powrotem w rtęć i oddał brakujące powietrze, a w tym powietrzu świeca płonęła olśniewająco. Powietrze to mieszanina, a jego część, dzięki której coś się pali, ukryła się w czerwonym nalocie. Rtęć i jej pary są trujące, więc nikt nie powinien tego próbować; w obrazku możesz bezpiecznie popatrzeć.',
        ],
        sci: [
          'Z Traité élémentaire de chimie (1789): kolba (matras) o pojemności około 36 cali sześciennych z długą wygiętą szyjką, której koniec znajdował się pod kloszem stojącym w wannie z rtęcią; 4 uncje czystej rtęci; ogień podtrzymywany przez 12 dni, rtęć zawsze prawie we wrzeniu. Drugiego dnia pojawiły się drobne czerwone cząstki; rosły przez cztery lub pięć dni, potem już nie.',
          'Powietrze na początku (sprowadzone do 28 cali barometru i 10 °Réaumura): około 50 cali sześciennych; na końcu od 42 do 43, mniej o około 1/6 (francuski cal sześcienny to około 19,8 cm³). Rtęć pochłonęła tlen jako czerwony tlenek, 2 Hg + O₂ → 2 HgO: 45 granów. Reszta gasiła świecę i dusiła zwierzęta: azote, nasz azot. W rzeczywistości powietrze ma 21% tlenu objętościowo, mniej więcej jedną piątą; jak zauważył Lavoisier, rtęć nie potrafi pochłonąć go całego.',
          '45 granów tlenku ogrzanych niemal do czerwoności w małej retorcie dało 41,5 grana rtęci i 7 do 8 cali sześciennych gazu o wiele lepszego od zwykłego powietrza do oddychania i spalania: 2 HgO → 2 Hg + O₂. Masy się zgadzają: przy pół grana na cal sześcienny (wartość samego Lavoisiera) gaz ważył około 3,5 grana. Zmieszany ponownie z azotem dał znów powietrze takie jak atmosferyczne: analiza i synteza. Rtęć i jej pary są toksyczne: tego doświadczenia się nie powtarza.',
        ],
      },
    },
    balance: {
      label: 'Wielka waga',
      title: 'Ogień nie niszczy masy',
      hints: { heat: 'Dotknij zatopionej kolby, żeby ogrzać cynę w środku', wait: 'Patrz na wagę, kiedy kolby na niej nie ma', open: 'Dotknij zatopionego końca kolby, żeby go odłamać', again: 'Dotknij kolby, żeby wziąć nową' },
      buttons: { heat: 'Ogrzej zatopioną kolbę', open: 'Odłam zatopiony koniec' },
      says: {
        off: { kid: 'Kolba schodzi z szalki, więc waga się przechyla. Cyna będzie ogrzewana, a nic nie może ani wejść, ani wyjść.', sci: 'Zatopiona kolba zdjęta z szalki: belka przechyla się w stronę odważników. Teraz kolba jest ogrzewana na koksowniku.' },
        back: { kid: 'Z powrotem na szalce, i waga znów stoi równo! Część cyny zmieniła się w szary proszek, a kolba waży dokładnie tyle samo.', sci: 'Z powrotem na szalce: równowaga, jak przed ogrzewaniem. Część cyny jest teraz zgorzeliną, a zatopiona kolba waży tyle samo.' },
        open: { kid: 'Pssst! Do kolby wpadło powietrze i teraz jest cięższa. Cyna zabrała część powietrza ze środka, a nowe powietrze weszło na jego miejsce.', sci: 'Po odłamaniu końca powietrze wpada do środka i kolba zyskuje na masie: tyle, ile ważyło powietrze pochłonięte przez cynę, czyli według Lavoisiera tyle, ile przybyło samej cynie.' },
        heatFirst: { kid: 'Najpierw ogrzej cynę: dotknij kolby.', sci: 'Najpierw ogrzej cynę.' },
        tipFirst: { kid: 'Teraz dotknij zatopionego końca kolby.', sci: 'Teraz odłam zatopiony koniec.' },
        fresh: { kid: 'Nowa zatopiona kolba z nową, błyszczącą cyną.', sci: 'Świeża kolba, zatopiona razem z powietrzem w środku.' },
      },
      panel: {
        kid: [
          'Dawniej myślano, że palenie niszczy rzeczy albo wypuszcza tajemniczą ognistą substancję zwaną flogistonem. Ale kiedy metal spali się na proszek, proszek jest cięższy niż metal! Lavoisier chciał wiedzieć dlaczego.',
          'Zamknął trochę cyny w szklanej kolbie i zatopił ją, żeby nic nie mogło wejść ani wyjść, zważył ją i ogrzewał, aż część cyny zmieniła się w szary proszek. Cała kolba ważyła dokładnie tyle samo. Kiedy ją otworzył, wpadło powietrze i dopiero wtedy była cięższa.',
          'Czyli cyna połączyła się z częścią powietrza, które było w kolbie. Kiedy coś się pali, nic nie znika: zmienia się w coś innego. Palenie to łączenie się z tlenem.',
        ],
        sci: [
          'Rozprawa Lavoisiera o prażeniu cyny w zamkniętych naczyniach (Akademia Nauk, 1774, wydana 1777) powtarzała doświadczenie Roberta Boyle\'a. Cyna ogrzewana w zatopionej szklanej retorcie zmienia się częściowo w zgorzelinę; zatopiona retorta z zawartością ważyła tyle samo przed ogrzewaniem i po nim.',
          'Po otwarciu retorty powietrze wpadło do środka, a masa wzrosła o tyle, ile przybyło cynie: metal pochłonął część powietrza ze środka. Prażenie jest łączeniem się z powietrzem, a nie utratą flogistonu: Sn + O₂ → SnO₂.',
          'Zasada, że w reakcji materia ani nie powstaje, ani nie znika, pochodzi od Lavoisiera: „nic się nie tworzy, ani w działaniach sztuki, ani w działaniach natury, i można przyjąć za zasadę, że w każdym działaniu jest równa ilość materii przed nim i po nim” (Traité, 1789). Słynne „nic nie ginie, nic się nie tworzy, wszystko się przekształca” to późniejsza parafraza. Dzięki niej i dzięki tlenowi teoria flogistonu upadła w latach 80. XVIII wieku.',
        ],
      },
    },
    table: {
      label: 'Stół Marie-Anne Lavoisier',
      hints: { look: 'Dotknij rysunku, żeby zobaczyć następny' },
      buttons: { next: 'Następny rysunek' },
      pages: [
        { title: 'Rysunek I: soczewka zapalająca', kid: ['Wielka soczewka na wózku, która zbiera słońce na słoik z rtęcią stojący na stole.'], sci: ['Soczewka zapalająca i słój odwrócony nad rtęcią, przyrząd z tarasu, narysowany tak, jak pokazałaby go rycina.'] },
        { title: 'Rysunek II: dwanaście dni', kid: ['Piec, kolba z długą szyjką i klosz stojący w wannie z rtęcią.'], sci: ['Według tablicy IV, rysunku 2 z Traité (1789): piec, kolba (matras) z wygiętą szyjką, klosz nad wanną z rtęcią.'] },
        { title: 'Rysunek III: waga', kid: ['Waga z zatopioną kolbą z cyną na jednej szalce i odważnikami na drugiej, a obok koksownik.'], sci: ['Waga z zatopioną retortą z cyną i odważnikami oraz koksownik, na którym ją ogrzewano.'] },
      ],
      about: {
        kid: [
          'Marie-Anne Lavoisier była żoną Antoine\'a Lavoisiera i jego wspólniczką w laboratorium. Zapisywała pomiary i nauczyła się angielskiego, żeby czytać i tłumaczyć prace innych chemików.',
          'Brała lekcje rysunku u słynnego malarza Jacques\'a-Louisa Davida i narysowała oraz wyryła wszystkie trzynaście obrazków przyrządów do wielkiej książki chemicznej Lavoisiera z 1789 roku.',
        ],
        sci: [
          'Marie-Anne Pierrette Paulze (1758 do 1836) wyszła za Antoine\'a Lavoisiera w 1771 roku, mając trzynaście lat. Prowadziła zapiski w laboratoryjnych notatnikach; na dwóch rysunkach doświadczeń nad oddychaniem człowieka (około 1790) narysowała samą siebie przy bocznym stoliku, jak notuje.',
          'Nauczyła się angielskiego i przetłumaczyła Essay on Phlogiston Richarda Kirwana (1788), dodając krytyczne przypisy, uczyła się rysunku u Jacques\'a-Louisa Davida i wykonała 13 miedziorytów do Traité élémentaire de chimie (1789), podpisanych Paulze Lavoisier sculpsit.',
        ],
      },
    },
  },
  de: {
    title: 'Lavoisiers Labor, 1770er Jahre',
    greet: {
      kid: 'Wir sind im Bild: im Labor von Antoine Lavoisier in Paris, in den 1770er Jahren, als man herausfand, was ein Feuer wirklich braucht. Draußen auf der Terrasse steht ein riesiges Brennglas. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Lavoisiers Labor in Paris in den 1770er Jahren, als der Sauerstoff entdeckt und die Verbrennung verstanden wurde: das Brennglas auf der Terrasse, die zwölf Tage auf dem hinteren Tisch, die Waage am Fenster. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Fast hundert Jahre lang glaubten die Chemiker, dass Dinge beim Brennen einen Feuerstoff namens Phlogiston abgeben. Lavoisier wog alles und fand das Gegenteil: Was brennt, nimmt etwas aus der Luft.',
        'Marie-Anne Lavoisier arbeitete auch in diesem Labor. Sie schrieb die Ergebnisse auf und zeichnete die Geräte so gut, dass ihre Bilder in Lavoisiers berühmtes Buch kamen.',
        'Den Sauerstoff fanden drei Menschen fast zur gleichen Zeit: Carl Wilhelm Scheele in Schweden, Joseph Priestley in England und Lavoisier hier in Paris. Lavoisier hat erklärt, was er in einem Feuer tut.',
      ],
      sci: [
        'Die Phlogistontheorie (Georg Ernst Stahl, Anfang des 18. Jahrhunderts) besagte, dass ein brennender Körper Phlogiston abgibt. Doch ein Metall, das an der Luft zu Kalk wird, wird schwerer. Lavoisiers Antwort: Es verbindet sich mit einem Teil der Luft, dem Teil, den er oxygène nannte.',
        'Marie-Anne Paulze Lavoisier lernte Englisch und übersetzte Richard Kirwans Essay on Phlogiston (1788) mit kritischen Anmerkungen, lernte Zeichnen bei Jacques-Louis David und zeichnete und stach die 13 Tafeln des Traité élémentaire de chimie (1789).',
        'Lavoisier wurde am 8. Mai 1794 während der Schreckensherrschaft in Paris guillotiniert, als ehemaliger Steuerpächter (fermier général). Er war 50 Jahre alt.',
      ],
    },
    lens: {
      label: 'Das große Brennglas',
      title: '1774: die Luft aus einem roten Pulver',
      hints: { aim: 'Tippe auf das Brennglas, um die Sonne auf das rote Pulver zu richten', wait: 'Schau, wie das Gas das Quecksilber nach unten drückt', candle: 'Tippe auf die Kerze, um sie in das Gas zu senken', again: 'Tippe auf das Brennglas, um es noch einmal zu versuchen' },
      buttons: { aim: 'Das Brennglas auf die Sonne richten', candle: 'Die Kerze in das Gas senken' },
      says: {
        aim: { kid: 'Das Brennglas sammelt das Sonnenlicht in einem gleißenden Punkt auf dem roten Pulver. Schau auf das Glas!', sci: 'Das Brennglas bündelt die Sonne auf dem roten Quecksilberkalk (HgO), der oben im Glas voll Quecksilber schwimmt.' },
        heating: { kid: 'Es wird noch erhitzt: Aus dem roten Pulver kommt ein Gas.', sci: 'Es wird noch erhitzt: 2 HgO → 2 Hg + O₂.' },
        caught: { kid: 'Das rote Pulver ist weg, und ein Gas hat das Quecksilber aus dem Glas gedrückt. Jetzt tippe auf die Kerze!', sci: 'Der Kalk ist zerlegt: Das Glas hält das freigesetzte Gas, das Quecksilber ist in die Schale zurückgeflossen. Jetzt die Kerzenprobe.' },
        notYet: { kid: 'Zuerst brauchen wir das Gas: Tippe auf das Brennglas, um das rote Pulver zu erhitzen.', sci: 'Noch kein Gas gesammelt: Erhitze zuerst den Kalk.' },
        bright: { kid: 'Wow! Die Kerze lodert viel heller als in normaler Luft. In diesem Gas brennt alles besser als in Luft!', sci: 'Die Kerze brennt viel lebhafter als in gewöhnlicher Luft, wie Priestley fand: Das Gas unterhält die Verbrennung besser als die Luft selbst.' },
      },
      panel: {
        kid: [
          'Am 1. August 1774 erhitzte Joseph Priestley in England ein rotes Pulver mit einem großen Brennglas und Sonnenschein. Das Pulver war aus Quecksilber gemacht und schwamm oben in einem Glas voller Quecksilber. Ein Gas kam heraus und drückte das Quecksilber nach unten.',
          'Dann hielt er eine Kerze in das Gas, und sie brannte mit einer erstaunlich hellen Flamme. Priestley hatte eine neue Art Luft gefunden, besser als normale Luft zum Brennen und zum Atmen. Heute nennen wir sie Sauerstoff.',
          'Ein schwedischer Chemiker, Carl Wilhelm Scheele, hatte dasselbe Gas schon ein paar Jahre vorher gemacht, aber sein Buch erschien erst 1777. Und hier in Paris fand Lavoisier heraus, was das Gas tut: Es ist der Teil der Luft, den ein Feuer braucht. Quecksilber ist giftig, deshalb macht heute niemand den Versuch auf diese Weise; im Bild kannst du ihm sicher zuschauen.',
        ],
        sci: [
          'Joseph Priestley, 1. August 1774: Mit einem Brennglas von 12 Zoll Durchmesser und 20 Zoll Brennweite erhitzte er mercurius calcinatus per se, rotes Quecksilber(II)-oxid, das oben in einem mit Quecksilber gefüllten Glasgefäß schwamm, das umgekehrt in einer Schale Quecksilber stand. 2 HgO → 2 Hg + O₂: Das Gas sammelte sich, und das Quecksilber wurde nach unten gedrückt. Eine Kerze brannte darin mit bemerkenswert lebhafter Flamme. Im März 1775 fand er, dass eine Maus darin länger lebte als in gewöhnlicher Luft, und nannte es dephlogistierte Luft.',
          'Carl Wilhelm Scheele hatte dasselbe Gas Anfang der 1770er Jahre in Uppsala hergestellt, durch Erhitzen von Quecksilberoxid, Salpeter und anderen Stoffen, und nannte es Feuerluft; sein Buch, Chemische Abhandlung von der Luft und dem Feuer, verzögerte sich bis 1777. Priestley beschrieb seinen Versuch Lavoisier im Oktober 1774 in Paris. Wer den Sauerstoff entdeckt hat, ist bis heute umstritten; Lavoisier selbst schrieb, er sei fast gleichzeitig von Priestley, Scheele und ihm entdeckt worden.',
          'Brenngläser waren damals Werkzeuge der Chemie: Die Akademie der Wissenschaften benutzte große Linsen unter freiem Himmel, und Lavoisier arbeitete mit dem neuen Brennglas von Trudaine de Montigny (1774) im Jardin de l\'Infante am Louvre. Bis 1777 war Lavoisier zu dem Schluss gekommen, dass das Gas ein Teil der Luft ist: der Teil, der sich mit brennenden Körpern und mit Metallen verbindet, die zu Kalk werden. Er nannte es oxygène, „Säurebildner“ (griechisch oxys, scharf), weil er glaubte, es stecke in jeder Säure; „Sauerstoff“ ist dieselbe Idee auf Deutsch. 1810 zeigte Humphry Davy, dass die Salzsäure (HCl) gar keinen enthält. Quecksilber und sein Dampf sind giftig: Diesen Versuch wiederholt man nicht.',
        ],
      },
    },
    days: {
      label: 'Die zwölf Tage',
      title: 'Zwölf Tage Quecksilber an der Luft erhitzen',
      slider: 'Tage des Erhitzens',
      board: { day: 'Tag {d} von 12', air: 'Luft: {v} Kubikzoll' },
      hints: {
        fire: 'Tippe auf den Ofen, um ihn anzuzünden, oder schiebe die Tage weiter',
        burning: 'Die Tage vergehen, schau auf die rote Kruste und die Luft',
        taper: 'Tippe auf die erste Kerze, um die übrige Luft zu prüfen',
        crust: 'Tippe auf die rote Kruste, um sie stark zu erhitzen',
        wait: 'Schau, wie sich das kleine Glas mit Luft füllt',
        taper2: 'Tippe auf die zweite Kerze, um diese Luft zu prüfen',
        again: 'Tippe auf den Ofen, um neu anzufangen',
      },
      buttons: { fire: 'Den Ofen anzünden', stop: 'Das Feuer löschen', again: 'Neu anfangen', taper: 'Eine Kerze in die übrige Luft', crust: 'Die rote Kruste erhitzen', taper2: 'Eine Kerze in die Luft aus der Kruste' },
      says: {
        fire: { kid: 'Das Feuer brennt. Lavoisier hielt das Quecksilber zwölf Tage und Nächte lang fast am Kochen.', sci: 'Ofen an: Das Quecksilber wird knapp unter seinem Siedepunkt gehalten (356,7 °C).' },
        stop: { kid: 'Feuer aus: Die Tage halten an.', sci: 'Ofen aus.' },
        done: { kid: 'Zwölf Tage! Die rote Kruste wächst nicht mehr, und die Luft im Glas ist um etwa ein Sechstel geschrumpft. Etwas wurde aus der Luft herausgeholt!', sci: 'Tag 12: Der Kalk nimmt nicht mehr zu. Von 50 Kubikzoll Luft sind noch 42 bis 43 übrig: Etwa 1/6 ist in den roten Kalk gegangen.' },
        early: { kid: 'Noch nicht: Lass zuerst die zwölf Tage vergehen.', sci: 'Zuerst die zwölf Tage des Erhitzens abschließen.' },
        out: { kid: 'Pff! Die Kerze ging sofort aus, als hätte man sie in Wasser getaucht. Lavoisier nannte diese übrige Luft azote, „ohne Leben“. Auf Deutsch heißt sie Stickstoff, weil Flammen und Tiere darin ersticken.', sci: 'Die Kerze erlischt, „als hätte man sie in Wasser getaucht“: Der Rest unterhält weder Verbrennung noch Atmung. Lavoisiers azote, von griechisch a- (nicht) und zoe (Leben): der Stickstoff.' },
        heat: { kid: 'Die rote Kruste kommt in eine kleine Glasretorte über einer heißen Flamme.', sci: 'Die 45 Gran roter Kalk, in einer kleinen Retorte fast bis zur Rotglut erhitzt.' },
        crust: { kid: 'Die rote Kruste ist weg! Glänzendes Quecksilber rinnt durch das Rohr, und Luft ist ins kleine Glas zurückgekommen: ungefähr so viel, wie das große Glas verloren hat.', sci: '41,5 Gran Quecksilber und 7 bis 8 Kubikzoll Gas: so viel Luft, wie beim Erhitzen aufgenommen wurde. 2 HgO → 2 Hg + O₂.' },
        noCrust: { kid: 'Im kleinen Glas ist noch keine Luft: Tippe zuerst auf die rote Kruste.', sci: 'Noch nichts gesammelt: Erhitze zuerst den Kalk.' },
        bright: { kid: 'Schau, wie sie lodert! Die Luft aus der roten Kruste ist der Teil der Luft, den Feuer braucht. Lavoisier nannte sie oxygène, wir sagen Sauerstoff.', sci: '„Eine Kerze brannte darin mit blendendem Glanz“, schrieb Lavoisier. Wieder gemischt mit den 42 Kubikzoll Stickstoff ergab es erneut Luft wie die der Atmosphäre.' },
        again: { kid: 'Frisches Quecksilber und frische Luft: Noch einmal von vorn.', sci: 'Frisches Quecksilber, frische Luft: Der Ofen brennt wieder.' },
      },
      panel: {
        kid: [
          'Lavoisier füllte etwas Quecksilber, ein glänzendes flüssiges Metall, in einen Glaskolben mit einem sehr langen Hals. Der Hals endete in einer großen Glasglocke voller Luft, die in einer Wanne mit Quecksilber stand. Dann hielt er das Quecksilber zwölf Tage und Nächte lang heiß.',
          'Auf dem Quecksilber wuchs eine rote Kruste, und die Luft in der Glocke schrumpfte: Das Quecksilber kroch in der Glocke nach oben. Etwa ein Sechstel der Luft war weg! In der übrigen Luft ging eine Kerze aus, deshalb nannte Lavoisier sie azote, „ohne Leben“. Auf Deutsch heißt sie Stickstoff.',
          'Dann erhitzte er die rote Kruste stark. Sie wurde wieder zu Quecksilber und gab die fehlende Luft zurück, und in dieser Luft brannte eine Kerze blendend hell. Luft ist ein Gemisch, und ihr Teil, der Feuer brennen lässt, hatte in der roten Kruste gesteckt. Quecksilber und sein Dampf sind giftig, deshalb sollte das niemand ausprobieren; im Bild kannst du sicher zuschauen.',
        ],
        sci: [
          'Aus dem Traité élémentaire de chimie (1789): ein Kolben (matras) von etwa 36 Kubikzoll mit langem gebogenem Hals, dessen Ende unter einer Glasglocke in einer Quecksilberwanne lag; 4 Unzen reines Quecksilber; das Feuer 12 Tage lang unterhalten, das Quecksilber stets fast am Sieden. Am zweiten Tag erschienen kleine rote Teilchen; sie wuchsen vier oder fünf Tage lang, dann nicht mehr.',
          'Die Luft am Anfang (umgerechnet auf 28 Zoll Barometerstand und 10 °Réaumur): etwa 50 Kubikzoll; am Ende 42 bis 43, etwa 1/6 weniger (ein französischer Kubikzoll sind etwa 19,8 cm³). Das Quecksilber nahm Sauerstoff als roten Kalk auf, 2 Hg + O₂ → 2 HgO: 45 Gran. Der Rest löschte Kerzen und erstickte Tiere: azote, unser Stickstoff. Tatsächlich enthält Luft 21 Volumenprozent Sauerstoff, etwa ein Fünftel; wie Lavoisier bemerkte, kann das Quecksilber nicht alles aufnehmen.',
          'Die 45 Gran Kalk, in einer kleinen Retorte fast bis zur Rotglut erhitzt, gaben 41,5 Gran Quecksilber und 7 bis 8 Kubikzoll eines Gases, das zum Atmen und Brennen viel besser war als gewöhnliche Luft: 2 HgO → 2 Hg + O₂. Die Gewichte gehen auf: Bei einem halben Gran pro Kubikzoll (Lavoisiers eigener Wert) wog das Gas etwa 3,5 Gran. Wieder mit dem Stickstoff gemischt, ergab es Luft wie die der Atmosphäre: Analyse und Synthese. Quecksilber und sein Dampf sind giftig: Diesen Versuch wiederholt man nicht.',
        ],
      },
    },
    balance: {
      label: 'Die große Waage',
      title: 'Feuer vernichtet kein Gewicht',
      hints: { heat: 'Tippe auf den zugeschmolzenen Kolben, um das Zinn darin zu erhitzen', wait: 'Schau auf die Waage, solange der Kolben weg ist', open: 'Tippe auf die zugeschmolzene Spitze des Kolbens, um sie abzubrechen', again: 'Tippe auf den Kolben für einen neuen' },
      buttons: { heat: 'Den zugeschmolzenen Kolben erhitzen', open: 'Die Spitze abbrechen' },
      says: {
        off: { kid: 'Runter von der Schale, und die Waage kippt. Das Zinn wird erhitzt, und nichts kann hinein oder hinaus.', sci: 'Der zugeschmolzene Kolben ist von seiner Schale genommen: Der Balken neigt sich zu den Gewichten. Jetzt wird er auf dem Kohlebecken erhitzt.' },
        back: { kid: 'Zurück auf der Schale, und die Waage steht wieder gerade! Ein Teil des Zinns ist zu grauem Pulver geworden, aber der Kolben wiegt genau gleich viel.', sci: 'Zurück auf der Schale: im Gleichgewicht wie vor dem Erhitzen. Ein Teil des Zinns ist jetzt Kalk, und doch wiegt der zugeschmolzene Kolben gleich viel.' },
        open: { kid: 'Zisch! Luft strömte in den Kolben, und jetzt ist er schwerer. Das Zinn hatte einen Teil der Luft darin genommen, und neue Luft kam herein, um den Platz zu füllen.', sci: 'Luft strömt hinein, als die Spitze bricht, und der Kolben wird schwerer: um das Gewicht der vom Zinn aufgenommenen Luft, das Lavoisier gleich der Gewichtszunahme des Zinns fand.' },
        heatFirst: { kid: 'Erhitze zuerst das Zinn: Tippe auf den Kolben.', sci: 'Erhitze zuerst das Zinn.' },
        tipFirst: { kid: 'Jetzt tippe auf die zugeschmolzene Spitze des Kolbens.', sci: 'Jetzt die Spitze abbrechen.' },
        fresh: { kid: 'Ein neuer zugeschmolzener Kolben mit neuem, glänzendem Zinn.', sci: 'Ein frischer Kolben, mit seiner Luft darin zugeschmolzen.' },
      },
      panel: {
        kid: [
          'Früher dachte man, Brennen vernichtet Dinge oder lässt einen geheimnisvollen Feuerstoff namens Phlogiston entweichen. Aber wenn ein Metall zu Pulver verbrennt, ist das Pulver schwerer als das Metall! Lavoisier wollte wissen, warum.',
          'Er schmolz etwas Zinn in einen Glaskolben ein, sodass nichts hinein oder hinaus konnte, wog ihn und erhitzte ihn, bis ein Teil des Zinns zu grauem Pulver wurde. Der ganze Kolben wog genau gleich viel. Als er ihn aufbrach, strömte Luft hinein, und erst dann war er schwerer.',
          'Das Zinn hatte sich also mit einem Teil der Luft im Kolben verbunden. Wenn etwas brennt, verschwindet nichts: Es wird zu etwas anderem. Brennen heißt, sich mit Sauerstoff zu verbinden.',
        ],
        sci: [
          'Lavoisiers Abhandlung über das Verkalken von Zinn in geschlossenen Gefäßen (Akademie der Wissenschaften, 1774, gedruckt 1777) wiederholte einen Versuch von Robert Boyle. Zinn, das in einer zugeschmolzenen Glasretorte erhitzt wird, wird teilweise zu Kalk; zugeschmolzen wogen die Retorte und ihr Inhalt vor und nach dem Erhitzen gleich viel.',
          'Als die Retorte geöffnet wurde, strömte Luft hinein, und das Gewicht stieg um so viel, wie das Zinn zugenommen hatte: Das Metall hatte einen Teil der Luft darin aufgenommen. Verkalkung ist eine Verbindung mit Luft, kein Verlust von Phlogiston: Sn + O₂ → SnO₂.',
          'Die Regel, dass bei einer Reaktion Materie weder entsteht noch vergeht, stammt von Lavoisier: „Nichts wird erschaffen, weder bei den Arbeiten der Kunst noch bei denen der Natur, und man kann als Grundsatz aufstellen, dass bei jeder Operation vorher und nachher die gleiche Menge Materie vorhanden ist“ (Traité, 1789). Das berühmte „Nichts geht verloren, nichts wird erschaffen, alles verwandelt sich“ ist eine spätere Umschreibung. Mit ihr und mit dem Sauerstoff fiel in den 1780er Jahren die Phlogistontheorie.',
        ],
      },
    },
    table: {
      label: 'Marie-Anne Lavoisiers Tisch',
      hints: { look: 'Tippe auf die Zeichnung, um die nächste zu sehen' },
      buttons: { next: 'Nächste Zeichnung' },
      pages: [
        { title: 'Zeichnung I: das Brennglas', kid: ['Das große Brennglas auf seinem Wagen, das die Sonne auf das Glas mit Quecksilber auf dem Tisch sammelt.'], sci: ['Das Brennglas und das über Quecksilber umgestülpte Glas, das Gerät auf der Terrasse, gezeichnet, wie ein Kupferstich es zeigen würde.'] },
        { title: 'Zeichnung II: die zwölf Tage', kid: ['Der Ofen, der Kolben mit seinem langen Hals und die Glasglocke in der Quecksilberwanne.'], sci: ['Nach Tafel IV, Figur 2 des Traité (1789): der Ofen, der Kolben (matras) mit seinem gebogenen Hals, die Glasglocke über der Quecksilberwanne.'] },
        { title: 'Zeichnung III: die Waage', kid: ['Die Waage mit dem zugeschmolzenen Zinnkolben auf der einen Schale und den Gewichten auf der anderen, daneben das Kohlebecken.'], sci: ['Die Waage mit der zugeschmolzenen Zinnretorte und ihren Gewichten, und das Kohlebecken, auf dem sie erhitzt wurde.'] },
      ],
      about: {
        kid: [
          'Marie-Anne Lavoisier war die Frau von Antoine Lavoisier und seine Partnerin im Labor. Sie schrieb die Messungen auf, und sie lernte Englisch, um lesen und übersetzen zu können, was andere Chemiker schrieben.',
          'Sie nahm Zeichenunterricht bei einem berühmten Maler, Jacques-Louis David, und zeichnete und stach alle dreizehn Bilder der Geräte in Lavoisiers großem Chemiebuch von 1789.',
        ],
        sci: [
          'Marie-Anne Pierrette Paulze (1758 bis 1836) heiratete Antoine Lavoisier 1771, mit dreizehn Jahren. Sie führte Aufzeichnungen in den Laborbüchern; auf zwei Zeichnungen von Versuchen über die menschliche Atmung (um 1790) zeichnete sie sich selbst an einem Seitentisch, wie sie die Notizen macht.',
          'Sie lernte Englisch und übersetzte Richard Kirwans Essay on Phlogiston (1788) mit kritischen Anmerkungen, lernte Zeichnen bei Jacques-Louis David und schuf die 13 Kupferstiche des Traité élémentaire de chimie (1789), signiert Paulze Lavoisier sculpsit.',
        ],
      },
    },
  },
}
