// The words of germanium's "Can you predict a new element?" room, in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Ge.js (the
// easel shows it); the room shows it happening and adds to it. 3D signs hold no subscript digits ("EsO2",
// "g/cm3"); the panels and the Atomling's speech (HTML) write cm³.
// Facts and where they come from:
// - Mendeleev's table of 1869 and its form of 1871 ("The periodic law of the chemical elements", Zhurnal Russkogo
//   Khimicheskogo Obshchestva 3, 1871; Annalen der Chemie, Supplementband 8, 1871): the elements ordered by atomic
//   weight and behaviour, a place left empty where none fitted, the prefix eka ("one" in Sanskrit) for the
//   elements he predicted: eka-boron, eka-aluminium, eka-silicon. 63 elements were known in 1869 (the usual figure;
//   the wall shows 27 of them, the main families from hydrogen to iodine as the picture draws them, and leaves out
//   the middle block of metals). The story that he wrote the elements on cards and played "patience" with them is
//   the usual one, told as a story. Tellurium and iodine: placed by behaviour against the weights (Te 127.6, I
//   126.9); Moseley's atomic numbers, 1913.
// - Eka-silicon as predicted in 1871 (as tabled in the Wikipedia articles "Germanium" and "Mendeleev's predicted
//   elements"): atomic weight 72, density 5.5 g/cm3, atomic volume 13, high melting point, dirty grey, dioxide EsO2
//   of density 4.7, chloride EsCl4 boiling under 100 C of density 1.9. "Es" is the symbol he used; einsteinium's
//   today. How he reasoned: from the properties of the neighbours, not from one plain average (the halfway of
//   silicon 28.1 and tin 118.7 is 73.4).
// - Winkler: argyrodite, Ag8GeS6, found in 1885 in the Himmelsfurst mine near Freiberg; Clemens Winkler, Freiberg
//   Bergakademie, announced germanium in 1886 (Ber. Dtsch. Chem. Ges. 19, 210), named after Germany, neptunium
//   first thought of. By the formula the ore is 76.5 % silver, 17.1 % sulfur and 6.4 % germanium (atomic masses
//   of src/data/elements.json); his own analyses added up to about 93 %, so about 7 % was missing. His figures
//   as usually tabled: atomic weight 72.3 (72.32; today 72.63), density 5.35 g/cm3 (today 5.32; other sources
//   quote 5.47 for his own measurement), GeO2 4.70, GeCl4 boiling at 86 C, density 1.89 (1.887).
// - Gallium: Paul-Emile Lecoq de Boisbaudran, Paris, 1875 (eka-aluminium). Scandium: Lars Fredrik Nilson,
//   Uppsala, 1879 (eka-boron).
// What the room simplifies, and says so: the wall is a corner of the table; the ledger's coins carry the
// neighbours' present-day numbers, not the figures Mendeleev had; the grinding and weighing are shown, not timed.
export const PREDICTED_WORDS = {
  en: {
    title: `A gap in the table`,
    greet: {
      kid: `We are inside the picture, in two places at once. This is Dmitri Mendeleev's study in St Petersburg on a winter night, about 1870. Through the glass screen is a laboratory in Freiberg, in Germany, in 1886. Mendeleev dared to write down what a missing element would be like. Fifteen years later, I turned up. The picture's story is on the easel.`,
      sci: `Two places, fifteen years apart: Dmitri Mendeleev's study in St Petersburg about 1871 (his table and the prediction of eka-silicon) and, behind the glazed screen, Clemens Winkler's bench at the Freiberg Bergakademie in 1886. The picture's story is on the easel.`,
    },
    talk: {
      kid: [
        `I am germanium, element number 32. Before anyone had seen me, Mendeleev had written down what I would be like. That is why people began to trust the periodic table.`,
        `Mendeleev called me eka-silicon, "one after silicon". The word "eka" means "one" in Sanskrit, an old language of India.`,
        `Clemens Winkler found me in 1886, in a silver ore from a mine near Freiberg, and named me after his country, Germany. First he had thought of calling me neptunium.`,
      ],
      sci: [
        `Germanium, Z = 32, atomic mass 72.63. Mendeleev's eka-silicon (1871) was predicted at 72; Winkler's germanium (1886) was measured at 72.3.`,
        `"Eka" is Sanskrit for "one": eka-silicon is "one after silicon". He used the same prefix for eka-aluminium (gallium, Lecoq de Boisbaudran, 1875) and eka-boron (scandium, Nilson, 1879).`,
        `The ore was argyrodite, Ag8GeS6, found in 1885 in the Himmelsfürst mine near Freiberg. Winkler announced the new element in 1886 and named it after Germany; neptunium was his first thought.`,
      ],
    },
    signs: {
      freiberg: `Freiberg 1886`,
      petersburg: `St Petersburg 1871`,
      board: `A corner of Mendeleev's table`,
      ekaAl: `eka-aluminium`,
      ekaSi: `eka-silicon`,
    },
    s1: {
      label: `The patience game`,
      title: `Mendeleev's game of patience`,
      slider: `Cards dealt`,
      sliderFmt: `{n} of {total}`,
      hints: {
        start: `Tap the heap of cards`,
        more: `Tap the heap to deal the next card`,
        gap: `Tap the empty card under silicon`,
        done: `Tap any card to meet it`,
      },
      buttons: { deal: `Deal the next card`, gap: `The empty card under silicon`, reset: `Gather the cards again` },
      says: {
        first: {
          kid: `Here we go. The story says that Mendeleev wrote every element on a card and played patience with them, the lightest first. Keep dealing and watch the columns appear.`,
          sci: `The story goes that Mendeleev wrote each element on a card and arranged them like a game of patience (1869). The cards go in order of atomic weight, and a new row begins whenever the behaviour repeats.`,
        },
        skip: {
          kid: `Stop! After calcium comes arsenic, but arsenic behaves like phosphorus, so it goes under phosphorus. The two places beside it stay empty. Mendeleev did not squeeze anything in. He left gaps.`,
          sci: `After calcium (40) comes arsenic (75): between them the real table has a middle block of metals that this wall leaves out. Arsenic goes by its chemistry under phosphorus, and the two places beside it stay empty: Mendeleev left them open instead of forcing a known element in.`,
        },
        swap: {
          kid: `Careful: iodine is a little lighter than tellurium, but it behaves like chlorine and bromine. So iodine goes in their column, and tellurium, which comes next, goes under selenium. Mendeleev trusted how elements behave more than how much they weigh.`,
          sci: `By weight iodine (126.9) comes before tellurium (127.6), but by chemistry tellurium belongs under selenium and iodine under bromine. Mendeleev went by behaviour; he suspected tellurium's weight was wrong. It was not: atomic number, not weight, sets the order, as Moseley showed in 1913.`,
        },
        done: {
          kid: `All 27 are dealt! Look: two cards are missing, one under aluminium and one under silicon. Tap the empty card under silicon.`,
          sci: `All 27 dealt. Two places stay empty, under aluminium and under silicon, and Mendeleev wrote in 1871 that elements would be found to fill them. Tap the empty card under silicon.`,
        },
        gapSi: {
          kid: `Mendeleev said: something belongs here that nobody has found yet. He called it eka-silicon, "one after silicon", and he even described it. Go to the writing table and see how.`,
          sci: `Eka-silicon (eka: Sanskrit, "one"), Mendeleev's name for the element under silicon. In 1871 he published its properties. The next station shows how he worked them out from its neighbours.`,
        },
        gapAl: {
          kid: `This gap, under aluminium, was his eka-aluminium. It was found first, in 1875, and it is called gallium.`,
          sci: `Eka-aluminium: gallium, found in 1875 by Lecoq de Boisbaudran in Paris. A third gap, eka-boron, lies in the middle block this wall leaves out: scandium, 1879.`,
        },
        card: {
          kid: `{name}. Its atom is about {w} times as heavy as a hydrogen atom. It stands in column {col}.`,
          sci: `{name}: atomic weight {w}, column {col}.`,
        },
      },
      panel: {
        kid: [
          `In 1869 Dmitri Mendeleev put the elements in order of how heavy their atoms are. Whenever an element behaved like one before it, he began a new row, so that elements that behave alike stood in the same column. Deal the cards and watch the columns appear.`,
          `Here you have 27 of them, a corner of his table. Notice that arsenic and iodine go where they behave, not where their weight would put them, and that where nothing fitted, he left a gap.`,
        ],
        sci: [
          `Mendeleev's table of 1869 and its form of 1871 ordered the 63 elements then known by atomic weight and chemical behaviour (valency, the formulas of oxides and hydrides): a column is a group, here I to VII (the noble gases were not yet known). This wall is a corner of it, hydrogen to iodine, 27 cards; the middle block of metals is left out.`,
          `Where weight and behaviour disagreed (tellurium and iodine) behaviour won. Where no known element fitted he left a place empty and predicted what would fill it: in 1871 he described eka-boron, eka-aluminium and eka-silicon.`,
        ],
      },
    },
    s2: {
      label: `Predict it`,
      title: `How to predict an element`,
      slider: `Lines written`,
      sliderFmt: `{n} of {total}`,
      hints: {
        neigh: `Tap the cards around the empty one`,
        quill: `Tap the quill to write the next line`,
        done: `Slide the lines or tap the quill`,
      },
      buttons: { si: `Silicon's numbers`, as: `Arsenic's numbers`, sn: `Tin's numbers`, quill: `Write the next line`, reset: `Start again` },
      says: {
        coinSi: {
          kid: `Silicon, above the gap: an atom of weight {w}, and {d} times as heavy as water. Its numbers go into the ledger.`,
          sci: `{name}, above the gap: atomic weight {w}, density {d} g/cm³. Its numbers go into the ledger.`,
        },
        coinAs: {
          kid: `Arsenic, beside the gap: weight {w}, and {d} times as heavy as water. Into the ledger it goes.`,
          sci: `{name}, beside the gap: atomic weight {w}, density {d} g/cm³.`,
        },
        coinSn: {
          kid: `Tin, below the gap: weight {w}, and {d} times as heavy as water. Into the ledger it goes.`,
          sci: `{name}, below the gap: atomic weight {w}, density {d} g/cm³.`,
        },
        between: {
          kid: `Silicon is about 28 and tin about 119. Halfway between them is about 73, and arsenic next door is 75. So the missing atom should weigh about 73. Mendeleev wrote 72.`,
          sci: `Halfway between Si (28.1) and Sn (118.7) is 73.4, with As (74.9) beside it. Mendeleev wrote 72. He did not take one plain average: he reasoned from all the neighbours' properties, their atomic volumes and the formulas of their compounds.`,
        },
        early: {
          kid: `First tap the three cards around the empty one: silicon, arsenic and tin.`,
          sci: `Collect the neighbours' numbers first: silicon, arsenic and tin.`,
        },
        line1: { kid: `First line: the weight of its atom, 72.`, sci: `Atomic weight 72.` },
        line2: { kid: `Second: 5.5 times as heavy as water, for the same size.`, sci: `Density 5.5 g/cm³ (atomic volume 13).` },
        line3: { kid: `Third: it will melt only in a very hot fire.`, sci: `Melting point high (refractory).` },
        line4: { kid: `Fourth: a dirty grey, not a shiny metal.`, sci: `Colour dirty grey.` },
        line5: { kid: `Fifth: its oxide, EsO2 ("Es" is the short name he gave it), is 4.7 times as heavy as water.`, sci: `Dioxide EsO2, density 4.7, feebly basic ("Es" is the symbol he used; today it belongs to einsteinium).` },
        line6: { kid: `Sixth: with chlorine it makes a liquid that boils below 100 °C.`, sci: `Tetrachloride EsCl4, boiling below 100 °C.` },
        done: {
          kid: `All written, for an element nobody had ever seen. Mendeleev wrote this in 1871. Now go through the glass screen to Freiberg and see what happened next.`,
          sci: `The prediction of 1871 is complete, the chloride's density 1.9 included. Through the glazed screen, Winkler's bench of 1886.`,
        },
      },
      card: {
        head: `Eka-silicon`,
        rows: [
          [`Atomic weight`, `72`],
          [`Density`, `5.5 g/cm3`],
          [`Melting point`, `high`],
          [`Colour`, `dirty grey`],
          [`Oxide EsO2`, `density 4.7`],
          [`Chloride EsCl4`, `boils under 100 °C`],
          [`Chloride density`, `1.9`],
        ],
        seal: `Predicted 1871`,
      },
      ledger: { head: `Notes`, weight: `weight`, density: `density`, between: { kid: `halfway`, sci: `halfway, Si to Sn` }, wrote: `Mendeleev wrote` },
      panel: {
        kid: [
          `Mendeleev looked at the neighbours of the empty place: silicon above it, tin below it, arsenic beside it, and another empty place on its other side. Elements change step by step along a row and down a column, so he could work out what the missing one must be like. Tap the cards and watch their numbers go into the notes.`,
          `Then the quill writes his prediction, line by line. Remember: nobody had ever seen this element.`,
        ],
        sci: [
          `From its neighbours: in 1871 Mendeleev compared the elements around a gap (above and below it in its group, on each side in its row) for atomic weight, density, atomic volume and the formulas and properties of their compounds, and looked for the values the missing element must have. The halfway of the vertical neighbours' weights is 73.4 (Si 28.1, Sn 118.7); he wrote 72. The ledger's numbers are today's, not the figures he had.`,
          `His eka-silicon: atomic weight 72, density 5.5 g/cm³, atomic volume 13, a high melting point, dirty grey, a dioxide EsO2 of density 4.7 and a volatile chloride EsCl4 boiling below 100 °C of density 1.9. (Es was his symbol; it is einsteinium's today.)`,
        ],
      },
    },
    s3: {
      label: `Winkler's bench`,
      title: `The missing 7 per cent`,
      slider: `Year`,
      sliderFmt: `{y}`,
      hints: {
        lump: `Tap the lump of argyrodite`,
        dish: `Tap the silver or the sulfur dish`,
        ag: `Tap the silver dish`,
        s: `Tap the sulfur dish`,
        gap: `Tap the glowing gap in the chart`,
        done: `Slide the years or tap a card on the wall`,
      },
      buttons: { lump: `Grind and weigh the lump`, ag: `Take out the silver`, s: `Take out the sulfur`, ge: `Look for what is missing`, reset: `Start again` },
      says: {
        early: {
          kid: `One step at a time: grind the lump, take out the silver and the sulfur, then look for the rest.`,
          sci: `In order: grind the lump, determine the silver and the sulfur, then see what is left.`,
        },
        lump: {
          kid: `In 1885 a new silver ore turned up in a mine near Freiberg. It is called argyrodite. Clemens Winkler, a chemist, was asked to analyse it. First the lump is ground to a powder and weighed: here it is 100 parts.`,
          sci: `Argyrodite, Ag8GeS6, from the Himmelsfürst mine near Freiberg (1885). Winkler ground and weighed a sample (here 100 parts).`,
        },
        ag: { kid: `Silver first: the chart climbs to about three quarters of the lump.`, sci: `Silver: 76.5 % by the formula Ag8GeS6.` },
        s: { kid: `Then the sulfur: about one sixth.`, sci: `Sulfur: 17.1 % by the formula.` },
        missing: {
          kid: `Add them up: only about 93 out of 100. The other 7 or so are missing! Winkler checked his work again and again. Something in the ore was neither silver nor sulfur.`,
          sci: `Silver and sulfur account for about 93 %, so about 7 % is missing; Winkler's own analyses added up to about 93 % too. Something else had to be in the ore.`,
        },
        found: {
          kid: `He found it: first a white powder, then a grey bead of a new element, almost exactly what Mendeleev had described. Winkler named it germanium, after Germany.`,
          sci: `Winkler separated the missing element as germanium sulfide, a white powder, and made the element from it: a grey, metallic-looking solid. He named it germanium, after Germany (neptunium was his first thought).`,
        },
        compare: {
          kid: `Look at the board: what Mendeleev guessed in 1871 and what Winkler found in 1886. Every line fits.`,
          sci: `The prediction of 1871 against Winkler's figures of 1886: every line agrees or comes close (atomic weight 72 and 72.3; density 5.5 and 5.35).`,
        },
        y1871: {
          kid: `1871: Mendeleev writes down three predictions, eka-boron, eka-aluminium and eka-silicon. Three empty places.`,
          sci: `1871: Mendeleev publishes the properties of eka-boron, eka-aluminium and eka-silicon.`,
        },
        y1875: {
          kid: `1875: in Paris, Lecoq de Boisbaudran finds a new metal and calls it gallium. It is eka-aluminium!`,
          sci: `1875: Paul-Émile Lecoq de Boisbaudran discovers gallium in Paris: Mendeleev's eka-aluminium.`,
        },
        y1879: {
          kid: `1879: in Sweden, Lars Fredrik Nilson finds scandium. It is eka-boron!`,
          sci: `1879: Lars Fredrik Nilson (Uppsala) discovers scandium: eka-boron.`,
        },
        y1886: {
          kid: `1886: Winkler finds germanium, eka-silicon. All three gaps are filled.`,
          sci: `1886: Winkler announces germanium, eka-silicon: the third of the 1871 predictions is found.`,
        },
      },
      chart: { head: `Parts out of 100`, missing: `missing`, found: `germanium` },
      compare: {
        head: `Predicted and found`,
        cols: [`Mendeleev 1871`, `Winkler 1886`],
        rows: [
          [`Atomic weight`, `72`, `72.3`, `72.3`],
          [`Density, g/cm3`, `5.5`, `5.35`, `5.35`],
          [`Colour`, `dirty grey`, `grey`, `grey`],
          [`Oxide density`, `4.7`, `4.7`, `4.70`],
          [`Chloride boils`, `under 100 °C`, `86 °C`, `86 °C`],
          [`Chloride density`, `1.9`, `1.9`, `1.89`],
        ],
      },
      rail: { head: `Three gaps, three finds`, t1871: `Mendeleev's table`, eka: [`eka-aluminium`, `eka-boron`, `eka-silicon`] },
      panel: {
        kid: [
          `This is Winkler's ore, argyrodite: a dark, silvery lump with silver and sulfur in it. Grind it, take out the silver, take out the sulfur, and the chart stops at about 93 out of 100. Winkler checked his work again and again, and about seven parts were always missing. Then he found them: a new element.`,
          `Slide the years on the wall and watch all three of Mendeleev's gaps fill, one by one. Tap a card on the wall to jump to its year.`,
        ],
        sci: [
          `Argyrodite, Ag8GeS6, is 76.5 % silver, 17.1 % sulfur and 6.4 % germanium by mass (from the atomic masses). Winkler's own analyses of the ore added up to only about 93 %, so about 7 % was missing; he separated the germanium as a white sulfide and made the element from it.`,
          `The comparison uses Winkler's figures of 1886 (Ber. Dtsch. Chem. Ges. 19, 210) as they are usually tabled: atomic weight 72.3 (today 72.63), density 5.35 g/cm³ (today 5.32), GeO2 density 4.70, GeCl4 boiling at 86 °C with density 1.89. Gallium (1875) and scandium (1879) were found first; germanium (1886) was the third of Mendeleev's predictions.`,
        ],
      },
    },
  },
  'pt-pt': {
    title: `Um espaço vazio na tabela`,
    greet: {
      kid: `Estamos dentro da imagem, em dois lugares ao mesmo tempo. Este é o gabinete de Dmitri Mendeleev, em São Petersburgo, numa noite de inverno, por volta de 1870. Do outro lado do vidro fica um laboratório em Freiberg, na Alemanha, em 1886. Mendeleev teve a coragem de escrever como seria um elemento que faltava. Quinze anos depois, apareci eu. A história da imagem está no cavalete.`,
      sci: `Dois lugares, com quinze anos de diferença: o gabinete de Dmitri Mendeleev em São Petersburgo por volta de 1871 (a sua tabela e a previsão do eka-silício) e, atrás do tabique envidraçado, a bancada de Clemens Winkler na Bergakademie de Freiberg, em 1886. A história da imagem está no cavalete.`,
    },
    talk: {
      kid: [
        `Sou o germânio, o elemento número 32. Antes de alguém me ter visto, Mendeleev já tinha escrito como eu seria. Foi por isso que as pessoas começaram a confiar na tabela periódica.`,
        `Mendeleev chamou-me eka-silício, "o que vem a seguir ao silício". A palavra "eka" quer dizer "um" em sânscrito, uma língua antiga da Índia.`,
        `Clemens Winkler encontrou-me em 1886, num minério de prata de uma mina perto de Freiberg, e deu-me o nome do seu país, a Alemanha. Primeiro tinha pensado chamar-me netúnio.`,
      ],
      sci: [
        `Germânio, Z = 32, massa atómica 72,63. O eka-silício de Mendeleev (1871) foi previsto com 72; o germânio de Winkler (1886) foi medido com 72,3.`,
        `"Eka" é "um" em sânscrito: eka-silício é "o que vem a seguir ao silício". Usou o mesmo prefixo para o eka-alumínio (gálio, Lecoq de Boisbaudran, 1875) e para o eka-boro (escândio, Nilson, 1879).`,
        `O minério era a argirodite, Ag8GeS6, encontrada em 1885 na mina Himmelsfürst, perto de Freiberg. Winkler anunciou o novo elemento em 1886 e deu-lhe o nome da Alemanha; netúnio foi a sua primeira ideia.`,
      ],
    },
    signs: {
      freiberg: `Freiberg 1886`,
      petersburg: `São Petersburgo 1871`,
      board: `Um canto da tabela de Mendeleev`,
      ekaAl: `eka-alumínio`,
      ekaSi: `eka-silício`,
    },
    s1: {
      label: `O jogo da paciência`,
      title: `O jogo de paciência de Mendeleev`,
      slider: `Cartas dadas`,
      sliderFmt: `{n} de {total}`,
      hints: {
        start: `Toca no monte de cartas`,
        more: `Toca no monte para dar a carta seguinte`,
        gap: `Toca na carta vazia por baixo do silício`,
        done: `Toca numa carta para a conhecer`,
      },
      buttons: { deal: `Dar a carta seguinte`, gap: `A carta vazia por baixo do silício`, reset: `Juntar as cartas outra vez` },
      says: {
        first: {
          kid: `Vamos a isso. Conta-se que Mendeleev escreveu cada elemento numa carta e jogou paciência com elas, começando pelo mais leve. Continua a dar cartas e vê as colunas a aparecer.`,
          sci: `Conta-se que Mendeleev escreveu cada elemento numa carta e as dispôs como num jogo de paciência (1869). As cartas seguem a ordem do peso atómico, e começa uma linha nova sempre que o comportamento se repete.`,
        },
        skip: {
          kid: `Pára! Depois do cálcio vem o arsénio, mas o arsénio comporta-se como o fósforo, por isso vai para baixo do fósforo. Os dois lugares ao lado ficam vazios. Mendeleev não meteu nada à força. Deixou espaços.`,
          sci: `Depois do cálcio (40) vem o arsénio (75): entre eles a tabela verdadeira tem um bloco central de metais, que esta parede deixa de fora. O arsénio vai, pela sua química, para baixo do fósforo, e os dois lugares ao lado ficam vazios: Mendeleev deixou-os em aberto em vez de lá enfiar um elemento conhecido.`,
        },
        swap: {
          kid: `Atenção: o iodo é um pouco mais leve do que o telúrio, mas comporta-se como o cloro e o bromo. Por isso o iodo vai para a coluna deles, e o telúrio, que vem a seguir, vai para baixo do selénio. Mendeleev confiava mais no comportamento dos elementos do que no seu peso.`,
          sci: `Pelo peso, o iodo (126,9) vem antes do telúrio (127,6), mas pela química o telúrio pertence por baixo do selénio e o iodo por baixo do bromo. Mendeleev seguiu o comportamento; suspeitava que o peso do telúrio estivesse errado. Não estava: é o número atómico, e não o peso, que dá a ordem, como Moseley mostrou em 1913.`,
        },
        done: {
          kid: `Estão dadas as 27 cartas! Repara: faltam duas, uma por baixo do alumínio e outra por baixo do silício. Toca na carta vazia por baixo do silício.`,
          sci: `As 27 cartas estão dadas. Ficam dois lugares vazios, por baixo do alumínio e por baixo do silício, e Mendeleev escreveu em 1871 que se haveriam de encontrar elementos para os preencher. Toca na carta vazia por baixo do silício.`,
        },
        gapSi: {
          kid: `Mendeleev disse: aqui pertence uma coisa que ninguém encontrou ainda. Chamou-lhe eka-silício, "o que vem a seguir ao silício", e até a descreveu. Vai à mesa de escrever e vê como.`,
          sci: `Eka-silício (eka: sânscrito, "um"), o nome que Mendeleev deu ao elemento por baixo do silício. Em 1871 publicou as suas propriedades. A estação seguinte mostra como as deduziu a partir dos vizinhos.`,
        },
        gapAl: {
          kid: `Este espaço, por baixo do alumínio, era o seu eka-alumínio. Foi encontrado primeiro, em 1875, e chama-se gálio.`,
          sci: `Eka-alumínio: o gálio, encontrado em 1875 por Lecoq de Boisbaudran, em Paris. Um terceiro espaço, o do eka-boro, fica no bloco central que esta parede deixa de fora: o escândio, 1879.`,
        },
        card: {
          kid: `{name}. O seu átomo é cerca de {w} vezes mais pesado do que um átomo de hidrogénio. Está na coluna {col}.`,
          sci: `{name}: peso atómico {w}, coluna {col}.`,
        },
      },
      panel: {
        kid: [
          `Em 1869, Dmitri Mendeleev pôs os elementos por ordem do peso dos seus átomos. Sempre que um elemento se comportava como um anterior, começava uma linha nova, de modo que os elementos parecidos ficavam na mesma coluna. Dá as cartas e vê as colunas a aparecer.`,
          `Aqui tens 27 delas, um canto da tabela dele. Repara que o arsénio e o iodo vão para onde se comportam, e não para onde o peso os poria, e que onde nada servia ele deixou um espaço vazio.`,
        ],
        sci: [
          `A tabela de Mendeleev de 1869 e a sua forma de 1871 ordenavam os 63 elementos então conhecidos pelo peso atómico e pelo comportamento químico (valência, fórmulas dos óxidos e dos hidretos): uma coluna é um grupo, aqui de I a VII (os gases nobres ainda não eram conhecidos). Esta parede é um canto dela, do hidrogénio ao iodo, 27 cartas; o bloco central de metais fica de fora.`,
          `Onde o peso e o comportamento discordavam (telúrio e iodo) ganhou o comportamento. Onde nenhum elemento conhecido servia, deixou um lugar vazio e previu o que o preencheria: em 1871 descreveu o eka-boro, o eka-alumínio e o eka-silício.`,
        ],
      },
    },
    s2: {
      label: `Prever`,
      title: `Como se prevê um elemento`,
      slider: `Linhas escritas`,
      sliderFmt: `{n} de {total}`,
      hints: {
        neigh: `Toca nas cartas à volta da vazia`,
        quill: `Toca na pena para escrever a linha seguinte`,
        done: `Desliza as linhas ou toca na pena`,
      },
      buttons: { si: `Os números do silício`, as: `Os números do arsénio`, sn: `Os números do estanho`, quill: `Escrever a linha seguinte`, reset: `Recomeçar` },
      says: {
        coinSi: {
          kid: `O silício, por cima do espaço: um átomo de peso {w}, e {d} vezes mais pesado do que a água. Os seus números vão para as notas.`,
          sci: `{name}, por cima do espaço: peso atómico {w}, densidade {d} g/cm³. Os seus números vão para as notas.`,
        },
        coinAs: {
          kid: `O arsénio, ao lado do espaço: peso {w}, e {d} vezes mais pesado do que a água. Vai para as notas.`,
          sci: `{name}, ao lado do espaço: peso atómico {w}, densidade {d} g/cm³.`,
        },
        coinSn: {
          kid: `O estanho, por baixo do espaço: peso {w}, e {d} vezes mais pesado do que a água. Vai para as notas.`,
          sci: `{name}, por baixo do espaço: peso atómico {w}, densidade {d} g/cm³.`,
        },
        between: {
          kid: `O silício pesa cerca de 28 e o estanho cerca de 119. A meio caminho fica cerca de 73, e o arsénio, ali ao lado, tem 75. Por isso o átomo que falta deve pesar cerca de 73. Mendeleev escreveu 72.`,
          sci: `A meio caminho entre o Si (28,1) e o Sn (118,7) fica 73,4, com o As (74,9) ao lado. Mendeleev escreveu 72. Não tirou uma simples média: raciocinou a partir das propriedades de todos os vizinhos, dos seus volumes atómicos e das fórmulas dos seus compostos.`,
        },
        early: {
          kid: `Primeiro toca nas três cartas à volta da vazia: silício, arsénio e estanho.`,
          sci: `Recolhe primeiro os números dos vizinhos: silício, arsénio e estanho.`,
        },
        line1: { kid: `Primeira linha: o peso do seu átomo, 72.`, sci: `Peso atómico 72.` },
        line2: { kid: `Segunda: 5,5 vezes mais pesado do que a água, para o mesmo tamanho.`, sci: `Densidade 5,5 g/cm³ (volume atómico 13).` },
        line3: { kid: `Terceira: só derrete num fogo muito quente.`, sci: `Ponto de fusão elevado (refratário).` },
        line4: { kid: `Quarta: um cinzento sujo, não um metal brilhante.`, sci: `Cor cinzento-sujo.` },
        line5: { kid: `Quinta: o seu óxido, EsO2 ("Es" é o nome curto que ele lhe deu), é 4,7 vezes mais pesado do que a água.`, sci: `Dióxido EsO2, densidade 4,7, fracamente básico ("Es" é o símbolo que usou; hoje pertence ao einsténio).` },
        line6: { kid: `Sexta: com o cloro faz um líquido que ferve abaixo dos 100 °C.`, sci: `Tetracloreto EsCl4, a ferver abaixo de 100 °C.` },
        done: {
          kid: `Está tudo escrito, para um elemento que ninguém tinha visto. Mendeleev escreveu isto em 1871. Agora atravessa o tabique de vidro até Freiberg e vê o que aconteceu a seguir.`,
          sci: `A previsão de 1871 está completa, com a densidade 1,9 do cloreto. Através do tabique envidraçado, a bancada de Winkler em 1886.`,
        },
      },
      card: {
        head: `Eka-silício`,
        rows: [
          [`Peso atómico`, `72`],
          [`Densidade`, `5,5 g/cm3`],
          [`Ponto de fusão`, `elevado`],
          [`Cor`, `cinzento-sujo`],
          [`Óxido EsO2`, `densidade 4,7`],
          [`Cloreto EsCl4`, `ferve abaixo de 100 °C`],
          [`Densidade do cloreto`, `1,9`],
        ],
        seal: `Previsto em 1871`,
      },
      ledger: { head: `Notas`, weight: `peso`, density: `densidade`, between: { kid: `a meio`, sci: `a meio, de Si a Sn` }, wrote: `Mendeleev escreveu` },
      panel: {
        kid: [
          `Mendeleev olhou para os vizinhos do lugar vazio: o silício por cima, o estanho por baixo, o arsénio ao lado, e outro lugar vazio do outro lado. Os elementos mudam passo a passo ao longo de uma linha e ao longo de uma coluna, por isso ele pôde deduzir como devia ser o que faltava. Toca nas cartas e vê os números delas a irem para as notas.`,
          `Depois a pena escreve a previsão dele, linha a linha. Lembra-te: ninguém tinha visto este elemento.`,
        ],
        sci: [
          `A partir dos vizinhos: em 1871, Mendeleev comparou os elementos à volta de um espaço (acima e abaixo dele no seu grupo, de cada lado na sua linha) quanto ao peso atómico, à densidade, ao volume atómico e às fórmulas e propriedades dos seus compostos, e procurou os valores que o elemento em falta devia ter. A meio dos pesos dos vizinhos verticais fica 73,4 (Si 28,1, Sn 118,7); ele escreveu 72. Os números das notas são os de hoje, não os que ele tinha.`,
          `O seu eka-silício: peso atómico 72, densidade 5,5 g/cm³, volume atómico 13, ponto de fusão elevado, cinzento-sujo, um dióxido EsO2 de densidade 4,7 e um cloreto volátil EsCl4 a ferver abaixo de 100 °C, de densidade 1,9. (Es era o símbolo dele; hoje é o do einsténio.)`,
        ],
      },
    },
    s3: {
      label: `A bancada de Winkler`,
      title: `Os 7 por cento que faltavam`,
      slider: `Ano`,
      sliderFmt: `{y}`,
      hints: {
        lump: `Toca no bocado de argirodite`,
        dish: `Toca no prato da prata ou no do enxofre`,
        ag: `Toca no prato da prata`,
        s: `Toca no prato do enxofre`,
        gap: `Toca no espaço a brilhar no gráfico`,
        done: `Desliza os anos ou toca numa carta na parede`,
      },
      buttons: { lump: `Moer e pesar o bocado`, ag: `Tirar a prata`, s: `Tirar o enxofre`, ge: `Procurar o que falta`, reset: `Recomeçar` },
      says: {
        early: {
          kid: `Um passo de cada vez: mói o bocado, tira a prata e o enxofre, e depois procura o resto.`,
          sci: `Por ordem: moer o bocado, determinar a prata e o enxofre, e ver depois o que sobra.`,
        },
        lump: {
          kid: `Em 1885 apareceu um minério de prata novo numa mina perto de Freiberg. Chama-se argirodite. Pediram ao químico Clemens Winkler que o analisasse. Primeiro o bocado é moído até ficar em pó e pesado: aqui são 100 partes.`,
          sci: `Argirodite, Ag8GeS6, da mina Himmelsfürst, perto de Freiberg (1885). Winkler moeu e pesou uma amostra (aqui, 100 partes).`,
        },
        ag: { kid: `Primeiro a prata: o gráfico sobe até cerca de três quartos do bocado.`, sci: `Prata: 76,5 % pela fórmula Ag8GeS6.` },
        s: { kid: `Depois o enxofre: cerca de um sexto.`, sci: `Enxofre: 17,1 % pela fórmula.` },
        missing: {
          kid: `Soma tudo: só cerca de 93 em 100. Faltam os outros 7, mais ou menos! Winkler verificou o seu trabalho vezes sem conta. Havia no minério uma coisa que não era prata nem enxofre.`,
          sci: `A prata e o enxofre explicam cerca de 93 %, por isso falta cerca de 7 %; as próprias análises de Winkler também somavam cerca de 93 %. Havia mais alguma coisa no minério.`,
        },
        found: {
          kid: `Encontrou-o: primeiro um pó branco, depois uma bolinha cinzenta de um elemento novo, quase exatamente o que Mendeleev tinha descrito. Winkler chamou-lhe germânio, por causa da Alemanha.`,
          sci: `Winkler separou o elemento em falta como sulfureto de germânio, um pó branco, e obteve dele o elemento: um sólido cinzento, de aspeto metálico. Deu-lhe o nome de germânio, por causa da Alemanha (netúnio foi a primeira ideia).`,
        },
        compare: {
          kid: `Olha para o quadro: o que Mendeleev adivinhou em 1871 e o que Winkler encontrou em 1886. Todas as linhas batem certo.`,
          sci: `A previsão de 1871 face aos valores de Winkler de 1886: todas as linhas concordam ou ficam perto (peso atómico 72 e 72,3; densidade 5,5 e 5,35).`,
        },
        y1871: {
          kid: `1871: Mendeleev escreve três previsões, eka-boro, eka-alumínio e eka-silício. Três lugares vazios.`,
          sci: `1871: Mendeleev publica as propriedades do eka-boro, do eka-alumínio e do eka-silício.`,
        },
        y1875: {
          kid: `1875: em Paris, Lecoq de Boisbaudran descobre um metal novo e chama-lhe gálio. É o eka-alumínio!`,
          sci: `1875: Paul-Émile Lecoq de Boisbaudran descobre o gálio em Paris: o eka-alumínio de Mendeleev.`,
        },
        y1879: {
          kid: `1879: na Suécia, Lars Fredrik Nilson descobre o escândio. É o eka-boro!`,
          sci: `1879: Lars Fredrik Nilson (Uppsala) descobre o escândio: o eka-boro.`,
        },
        y1886: {
          kid: `1886: Winkler descobre o germânio, o eka-silício. Os três espaços estão preenchidos.`,
          sci: `1886: Winkler anuncia o germânio, o eka-silício: encontra-se a terceira das previsões de 1871.`,
        },
      },
      chart: { head: `Partes em 100`, missing: `falta`, found: `germânio` },
      compare: {
        head: `Previsto e encontrado`,
        cols: [`Mendeleev 1871`, `Winkler 1886`],
        rows: [
          [`Peso atómico`, `72`, `72,3`, `72,3`],
          [`Densidade, g/cm3`, `5,5`, `5,35`, `5,35`],
          [`Cor`, `cinzento-sujo`, `cinzento`, `cinzento`],
          [`Densidade do óxido`, `4,7`, `4,7`, `4,70`],
          [`Cloreto ferve a`, `menos de 100 °C`, `86 °C`, `86 °C`],
          [`Densidade do cloreto`, `1,9`, `1,9`, `1,89`],
        ],
      },
      rail: { head: `Três espaços, três descobertas`, t1871: `Tabela de Mendeleev`, eka: [`eka-alumínio`, `eka-boro`, `eka-silício`] },
      panel: {
        kid: [
          `Este é o minério de Winkler, a argirodite: um bocado escuro e prateado, com prata e enxofre lá dentro. Mói-o, tira a prata, tira o enxofre, e o gráfico pára em cerca de 93 em 100. Winkler verificou o trabalho vezes sem conta, e faltavam sempre cerca de sete partes. Depois encontrou-as: um elemento novo.`,
          `Desliza os anos na parede e vê os três espaços de Mendeleev a encherem-se, um a um. Toca numa carta da parede para saltares para o ano dela.`,
        ],
        sci: [
          `A argirodite, Ag8GeS6, tem 76,5 % de prata, 17,1 % de enxofre e 6,4 % de germânio em massa (a partir das massas atómicas). As próprias análises de Winkler ao minério somavam só cerca de 93 %, por isso faltava cerca de 7 %; separou o germânio como sulfureto branco e obteve dele o elemento.`,
          `A comparação usa os valores de Winkler de 1886 (Ber. Dtsch. Chem. Ges. 19, 210), tal como costumam ser tabelados: peso atómico 72,3 (hoje 72,63), densidade 5,35 g/cm³ (hoje 5,32), densidade do GeO2 4,70, GeCl4 a ferver a 86 °C com densidade 1,89. O gálio (1875) e o escândio (1879) foram encontrados primeiro; o germânio (1886) foi a terceira das previsões de Mendeleev.`,
        ],
      },
    },
  },
  pl: {
    title: `Luka w układzie`,
    greet: {
      kid: `Jesteśmy wewnątrz obrazu, w dwóch miejscach naraz. To gabinet Dmitrija Mendelejewa w Petersburgu, zimowa noc około 1870 roku. Za szklaną ścianką jest laboratorium we Freibergu w Niemczech, w 1886 roku. Mendelejew odważył się zapisać, jaki będzie brakujący pierwiastek. Piętnaście lat później pojawiłem się ja. Historia obrazu jest na sztalugach.`,
      sci: `Dwa miejsca, między którymi jest piętnaście lat: gabinet Dmitrija Mendelejewa w Petersburgu około 1871 roku (jego układ i przewidywanie ekakrzemu) oraz, za przeszkloną ścianką, stół Clemensa Winklera w Bergakademie we Freibergu w 1886 roku. Historia obrazu jest na sztalugach.`,
    },
    talk: {
      kid: [
        `Jestem german, pierwiastek numer 32. Zanim ktokolwiek mnie zobaczył, Mendelejew zapisał, jaki będę. Dzięki temu ludzie zaczęli ufać układowi okresowemu.`,
        `Mendelejew nazwał mnie ekakrzemem, „tym po krzemie”. Słowo „eka” znaczy „jeden” w sanskrycie, dawnym języku Indii.`,
        `Clemens Winkler znalazł mnie w 1886 roku w rudzie srebra z kopalni koło Freibergu i nazwał mnie od swojego kraju, Niemiec. Najpierw myślał o nazwie neptun.`,
      ],
      sci: [
        `German, Z = 32, masa atomowa 72,63. Ekakrzem Mendelejewa (1871) miał mieć 72; german Winklera (1886) zmierzono jako 72,3.`,
        `„Eka” to w sanskrycie „jeden”: ekakrzem to „ten po krzemie”. Tego samego przedrostka użył dla ekaglinu (gal, Lecoq de Boisbaudran, 1875) i ekaboru (skand, Nilson, 1879).`,
        `Rudą był argyrodyt, Ag8GeS6, znaleziony w 1885 roku w kopalni Himmelsfürst koło Freibergu. Winkler ogłosił nowy pierwiastek w 1886 roku i nazwał go od Niemiec; najpierw myślał o neptunie.`,
      ],
    },
    signs: {
      freiberg: `Freiberg 1886`,
      petersburg: `Petersburg 1871`,
      board: `Fragment układu Mendelejewa`,
      ekaAl: `ekaglin`,
      ekaSi: `ekakrzem`,
    },
    s1: {
      label: `Pasjans`,
      title: `Pasjans Mendelejewa`,
      slider: `Rozdane karty`,
      sliderFmt: `{n} z {total}`,
      hints: {
        start: `Dotknij stosu kart`,
        more: `Dotknij stosu, by rozdać następną kartę`,
        gap: `Dotknij pustej karty pod krzemem`,
        done: `Dotknij dowolnej karty, by ją poznać`,
      },
      buttons: { deal: `Rozdaj następną kartę`, gap: `Pusta karta pod krzemem`, reset: `Zbierz karty z powrotem` },
      says: {
        first: {
          kid: `No to zaczynamy. Podobno Mendelejew zapisał każdy pierwiastek na karcie i układał z nich pasjansa, od najlżejszego. Rozdawaj dalej i patrz, jak pojawiają się kolumny.`,
          sci: `Podobno Mendelejew zapisał każdy pierwiastek na karcie i układał je jak pasjansa (1869). Karty idą według masy atomowej, a nowy rząd zaczyna się, gdy powtarza się zachowanie.`,
        },
        skip: {
          kid: `Stop! Po wapniu jest arsen, ale arsen zachowuje się jak fosfor, więc idzie pod fosfor. Dwa miejsca obok zostają puste. Mendelejew niczego nie wciskał na siłę. Zostawił luki.`,
          sci: `Po wapniu (40) jest arsen (75): między nimi prawdziwy układ ma środkowy blok metali, którego ta ściana nie pokazuje. Arsen idzie według swojej chemii pod fosfor, a dwa miejsca obok zostają puste: Mendelejew zostawił je otwarte, zamiast wciskać tam znany pierwiastek.`,
        },
        swap: {
          kid: `Uwaga: jod jest trochę lżejszy od telluru, ale zachowuje się jak chlor i brom. Dlatego jod idzie do ich kolumny, a tellur, który jest następny, idzie pod selen. Mendelejew bardziej ufał temu, jak pierwiastki się zachowują, niż temu, ile ważą.`,
          sci: `Według masy jod (126,9) jest przed tellurem (127,6), ale według chemii tellur należy pod selen, a jod pod brom. Mendelejew poszedł za zachowaniem; podejrzewał, że masa telluru jest błędna. Nie była: kolejność wyznacza liczba atomowa, nie masa, co pokazał Moseley w 1913 roku.`,
        },
        done: {
          kid: `Wszystkie 27 kart rozdane! Spójrz: brakuje dwóch, jednej pod glinem i jednej pod krzemem. Dotknij pustej karty pod krzemem.`,
          sci: `Rozdano wszystkie 27 kart. Dwa miejsca zostają puste, pod glinem i pod krzemem, a Mendelejew napisał w 1871 roku, że znajdą się pierwiastki, które je wypełnią. Dotknij pustej karty pod krzemem.`,
        },
        gapSi: {
          kid: `Mendelejew powiedział: tu jest coś, czego jeszcze nikt nie znalazł. Nazwał to ekakrzemem, „tym po krzemie”, i nawet to opisał. Podejdź do biurka i zobacz jak.`,
          sci: `Ekakrzem (eka: sanskryt, „jeden”), nazwa Mendelejewa dla pierwiastka pod krzemem. W 1871 roku opublikował jego właściwości. Następne stanowisko pokazuje, jak wyprowadził je z sąsiadów.`,
        },
        gapAl: {
          kid: `Ta luka, pod glinem, to był jego ekaglin. Znaleziono go pierwszy, w 1875 roku, i nazywa się gal.`,
          sci: `Ekaglin: gal, znaleziony w 1875 roku przez Lecoqa de Boisbaudrana w Paryżu. Trzecia luka, ekaboru, leży w środkowym bloku, którego ta ściana nie pokazuje: skand, 1879.`,
        },
        card: {
          kid: `{name}. Jego atom jest około {w} razy cięższy od atomu wodoru. Stoi w kolumnie {col}.`,
          sci: `{name}: masa atomowa {w}, kolumna {col}.`,
        },
      },
      panel: {
        kid: [
          `W 1869 roku Dmitrij Mendelejew ułożył pierwiastki według tego, jak ciężkie są ich atomy. Gdy jakiś pierwiastek zachowywał się jak jeden z wcześniejszych, zaczynał nowy rząd, tak że podobne pierwiastki stały w jednej kolumnie. Rozdawaj karty i patrz, jak pojawiają się kolumny.`,
          `Masz tu 27 z nich, fragment jego układu. Zauważ, że arsen i jod idą tam, gdzie się zachowują, a nie tam, gdzie wskazuje ich masa, i że tam, gdzie nic nie pasowało, zostawił lukę.`,
        ],
        sci: [
          `Układ Mendelejewa z 1869 roku i jego postać z 1871 roku porządkowały 63 znane wtedy pierwiastki według masy atomowej i zachowania chemicznego (wartościowość, wzory tlenków i wodorków): kolumna to grupa, tu od I do VII (gazy szlachetne nie były jeszcze znane). Ta ściana to jego fragment, od wodoru do jodu, 27 kart; środkowy blok metali pominięto.`,
          `Tam, gdzie masa i zachowanie się różniły (tellur i jod), wygrało zachowanie. Tam, gdzie żaden znany pierwiastek nie pasował, zostawiał puste miejsce i przewidywał, co je wypełni: w 1871 roku opisał ekabor, ekaglin i ekakrzem.`,
        ],
      },
    },
    s2: {
      label: `Przewidź to`,
      title: `Jak przewidzieć pierwiastek`,
      slider: `Zapisane wiersze`,
      sliderFmt: `{n} z {total}`,
      hints: {
        neigh: `Dotknij kart wokół pustej`,
        quill: `Dotknij pióra, by zapisać następny wiersz`,
        done: `Przesuń wiersze albo dotknij pióra`,
      },
      buttons: { si: `Liczby krzemu`, as: `Liczby arsenu`, sn: `Liczby cyny`, quill: `Zapisz następny wiersz`, reset: `Od nowa` },
      says: {
        coinSi: {
          kid: `Krzem, nad luką: atom o masie {w} i {d} razy cięższy od wody. Jego liczby trafiają do notatek.`,
          sci: `{name}, nad luką: masa atomowa {w}, gęstość {d} g/cm³. Jego liczby trafiają do notatek.`,
        },
        coinAs: {
          kid: `Arsen, obok luki: masa {w} i {d} razy cięższy od wody. Trafia do notatek.`,
          sci: `{name}, obok luki: masa atomowa {w}, gęstość {d} g/cm³.`,
        },
        coinSn: {
          kid: `Cyna, pod luką: masa {w} i {d} razy cięższa od wody. Trafia do notatek.`,
          sci: `{name}, pod luką: masa atomowa {w}, gęstość {d} g/cm³.`,
        },
        between: {
          kid: `Krzem waży około 28, a cyna około 119. W połowie drogi jest około 73, a arsen obok ma 75. Brakujący atom powinien więc ważyć około 73. Mendelejew napisał 72.`,
          sci: `W połowie między Si (28,1) a Sn (118,7) jest 73,4, a obok stoi As (74,9). Mendelejew napisał 72. Nie wziął zwykłej średniej: rozumował z właściwości wszystkich sąsiadów, ich objętości atomowych i wzorów ich związków.`,
        },
        early: {
          kid: `Najpierw dotknij trzech kart wokół pustej: krzemu, arsenu i cyny.`,
          sci: `Najpierw zbierz liczby sąsiadów: krzemu, arsenu i cyny.`,
        },
        line1: { kid: `Pierwszy wiersz: masa jego atomu, 72.`, sci: `Masa atomowa 72.` },
        line2: { kid: `Drugi: 5,5 razy cięższy od wody, przy tej samej objętości.`, sci: `Gęstość 5,5 g/cm³ (objętość atomowa 13).` },
        line3: { kid: `Trzeci: stopi się dopiero w bardzo gorącym ogniu.`, sci: `Wysoka temperatura topnienia (trudno topliwy).` },
        line4: { kid: `Czwarty: brudnoszary, nie błyszczący metal.`, sci: `Kolor brudnoszary.` },
        line5: { kid: `Piąty: jego tlenek, EsO2 („Es” to krótka nazwa, którą mu dał), jest 4,7 razy cięższy od wody.`, sci: `Dwutlenek EsO2, gęstość 4,7, słabo zasadowy („Es” to jego symbol; dziś należy do einsteinu).` },
        line6: { kid: `Szósty: z chlorem tworzy ciecz, która wrze poniżej 100 °C.`, sci: `Czterochlorek EsCl4, wrzący poniżej 100 °C.` },
        done: {
          kid: `Wszystko zapisane, dla pierwiastka, którego nikt nigdy nie widział. Mendelejew napisał to w 1871 roku. Teraz przejdź przez szklaną ściankę do Freibergu i zobacz, co było dalej.`,
          sci: `Przewidywanie z 1871 roku jest kompletne, z gęstością chlorku 1,9. Za przeszkloną ścianką stół Winklera z 1886 roku.`,
        },
      },
      card: {
        head: `Ekakrzem`,
        rows: [
          [`Masa atomowa`, `72`],
          [`Gęstość`, `5,5 g/cm3`],
          [`Temp. topnienia`, `wysoka`],
          [`Kolor`, `brudnoszary`],
          [`Tlenek EsO2`, `gęstość 4,7`],
          [`Chlorek EsCl4`, `wrze poniżej 100 °C`],
          [`Gęstość chlorku`, `1,9`],
        ],
        seal: `Przewidziany w 1871`,
      },
      ledger: { head: `Notatki`, weight: `masa`, density: `gęstość`, between: { kid: `w połowie`, sci: `w połowie, od Si do Sn` }, wrote: `Mendelejew napisał` },
      panel: {
        kid: [
          `Mendelejew patrzył na sąsiadów pustego miejsca: krzem nad nim, cynę pod nim, arsen obok i drugie puste miejsce po drugiej stronie. Pierwiastki zmieniają się krok po kroku wzdłuż rzędu i w dół kolumny, więc mógł wyliczyć, jaki musi być brakujący. Dotykaj kart i patrz, jak ich liczby trafiają do notatek.`,
          `Potem pióro zapisuje jego przewidywanie, wiersz po wierszu. Pamiętaj: nikt nigdy nie widział tego pierwiastka.`,
        ],
        sci: [
          `Z sąsiadów: w 1871 roku Mendelejew porównywał pierwiastki wokół luki (nad nią i pod nią w grupie, po obu stronach w rzędzie) pod względem masy atomowej, gęstości, objętości atomowej oraz wzorów i właściwości ich związków i szukał wartości, jakie musi mieć brakujący pierwiastek. Połowa mas sąsiadów w pionie to 73,4 (Si 28,1, Sn 118,7); napisał 72. Liczby w notatkach są dzisiejsze, nie te, które miał.`,
          `Jego ekakrzem: masa atomowa 72, gęstość 5,5 g/cm³, objętość atomowa 13, wysoka temperatura topnienia, brudnoszary, dwutlenek EsO2 o gęstości 4,7 i lotny chlorek EsCl4 wrzący poniżej 100 °C, o gęstości 1,9. (Es było jego symbolem; dziś to symbol einsteinu.)`,
        ],
      },
    },
    s3: {
      label: `Stół Winklera`,
      title: `Brakujące 7 procent`,
      slider: `Rok`,
      sliderFmt: `{y}`,
      hints: {
        lump: `Dotknij bryłki argyrodytu`,
        dish: `Dotknij miseczki ze srebrem lub z siarką`,
        ag: `Dotknij miseczki ze srebrem`,
        s: `Dotknij miseczki z siarką`,
        gap: `Dotknij świecącej luki na wykresie`,
        done: `Przesuń lata albo dotknij karty na ścianie`,
      },
      buttons: { lump: `Zetrzyj i zważ bryłkę`, ag: `Wydziel srebro`, s: `Wydziel siarkę`, ge: `Poszukaj tego, czego brakuje`, reset: `Od nowa` },
      says: {
        early: {
          kid: `Po kolei: zetrzyj bryłkę, wydziel srebro i siarkę, a potem poszukaj reszty.`,
          sci: `Po kolei: utrzeć bryłkę, oznaczyć srebro i siarkę, a potem zobaczyć, co zostaje.`,
        },
        lump: {
          kid: `W 1885 roku w kopalni koło Freibergu znaleziono nową rudę srebra. Nazywa się argyrodyt. Chemika Clemensa Winklera poproszono, by ją zbadał. Najpierw bryłkę ściera się na proszek i waży: tu to 100 części.`,
          sci: `Argyrodyt, Ag8GeS6, z kopalni Himmelsfürst koło Freibergu (1885). Winkler utarł i zważył próbkę (tu 100 części).`,
        },
        ag: { kid: `Najpierw srebro: wykres wspina się do około trzech czwartych bryłki.`, sci: `Srebro: 76,5 % według wzoru Ag8GeS6.` },
        s: { kid: `Potem siarka: około jedna szósta.`, sci: `Siarka: 17,1 % według wzoru.` },
        missing: {
          kid: `Dodaj: tylko około 93 na 100. Brakuje mniej więcej tych 7! Winkler sprawdzał swoją pracę raz po raz. W rudzie było coś, co nie było ani srebrem, ani siarką.`,
          sci: `Srebro i siarka dają około 93 %, więc brakuje około 7 %; własne analizy Winklera też sumowały się do około 93 %. W rudzie musiało być coś jeszcze.`,
        },
        found: {
          kid: `Znalazł to: najpierw biały proszek, potem szara kuleczka nowego pierwiastka, prawie dokładnie taka, jak opisał Mendelejew. Winkler nazwał go germanem, od Niemiec.`,
          sci: `Winkler wydzielił brakujący pierwiastek jako siarczek germanu, biały proszek, i otrzymał z niego pierwiastek: szare ciało stałe o wyglądzie metalu. Nazwał go germanem, od Niemiec (najpierw myślał o neptunie).`,
        },
        compare: {
          kid: `Spójrz na tablicę: co Mendelejew zgadł w 1871 roku, a co znalazł Winkler w 1886. Każdy wiersz pasuje.`,
          sci: `Przewidywanie z 1871 roku wobec liczb Winklera z 1886: każdy wiersz zgadza się albo jest bliski (masa atomowa 72 i 72,3; gęstość 5,5 i 5,35).`,
        },
        y1871: {
          kid: `1871: Mendelejew zapisuje trzy przewidywania: ekabor, ekaglin i ekakrzem. Trzy puste miejsca.`,
          sci: `1871: Mendelejew publikuje właściwości ekaboru, ekaglinu i ekakrzemu.`,
        },
        y1875: {
          kid: `1875: w Paryżu Lecoq de Boisbaudran znajduje nowy metal i nazywa go galem. To ekaglin!`,
          sci: `1875: Paul-Émile Lecoq de Boisbaudran odkrywa gal w Paryżu: ekaglin Mendelejewa.`,
        },
        y1879: {
          kid: `1879: w Szwecji Lars Fredrik Nilson znajduje skand. To ekabor!`,
          sci: `1879: Lars Fredrik Nilson (Uppsala) odkrywa skand: ekabor.`,
        },
        y1886: {
          kid: `1886: Winkler znajduje german, ekakrzem. Wszystkie trzy luki są wypełnione.`,
          sci: `1886: Winkler ogłasza german, ekakrzem: trzecie z przewidywań z 1871 roku się sprawdza.`,
        },
      },
      chart: { head: `Części na 100`, missing: `brakuje`, found: `german` },
      compare: {
        head: `Przewidziane i znalezione`,
        cols: [`Mendelejew 1871`, `Winkler 1886`],
        rows: [
          [`Masa atomowa`, `72`, `72,3`, `72,3`],
          [`Gęstość, g/cm3`, `5,5`, `5,35`, `5,35`],
          [`Kolor`, `brudnoszary`, `szary`, `szary`],
          [`Gęstość tlenku`, `4,7`, `4,7`, `4,70`],
          [`Chlorek wrze w`, `poniżej 100 °C`, `86 °C`, `86 °C`],
          [`Gęstość chlorku`, `1,9`, `1,9`, `1,89`],
        ],
      },
      rail: { head: `Trzy luki, trzy odkrycia`, t1871: `Układ Mendelejewa`, eka: [`ekaglin`, `ekabor`, `ekakrzem`] },
      panel: {
        kid: [
          `To ruda Winklera, argyrodyt: ciemna, srebrzysta bryłka, w której jest srebro i siarka. Zetrzyj ją, wydziel srebro, wydziel siarkę, a wykres zatrzyma się na około 93 na 100. Winkler sprawdzał swoją pracę raz po raz i zawsze brakowało około siedmiu części. Potem je znalazł: nowy pierwiastek.`,
          `Przesuwaj lata na ścianie i patrz, jak wszystkie trzy luki Mendelejewa wypełniają się jedna po drugiej. Dotknij karty na ścianie, by przeskoczyć do jej roku.`,
        ],
        sci: [
          `Argyrodyt, Ag8GeS6, to 76,5 % srebra, 17,1 % siarki i 6,4 % germanu wagowo (z mas atomowych). Własne analizy rudy Winklera sumowały się tylko do około 93 %, więc brakowało około 7 %; wydzielił german jako biały siarczek i otrzymał z niego pierwiastek.`,
          `Porównanie opiera się na liczbach Winklera z 1886 roku (Ber. Dtsch. Chem. Ges. 19, 210), tak jak zwykle się je zestawia: masa atomowa 72,3 (dziś 72,63), gęstość 5,35 g/cm³ (dziś 5,32), gęstość GeO2 4,70, GeCl4 wrzący w 86 °C o gęstości 1,89. Gal (1875) i skand (1879) znaleziono wcześniej; german (1886) był trzecim z przewidywań Mendelejewa.`,
        ],
      },
    },
  },
  de: {
    title: `Eine Lücke in der Tabelle`,
    greet: {
      kid: `Wir sind im Bild, an zwei Orten zugleich. Das ist Dmitri Mendelejews Arbeitszimmer in Sankt Petersburg in einer Winternacht, um 1870. Hinter der Glaswand liegt ein Labor in Freiberg in Deutschland, im Jahr 1886. Mendelejew traute sich aufzuschreiben, wie ein fehlendes Element sein würde. Fünfzehn Jahre später tauchte ich auf. Die Geschichte des Bildes steht auf der Staffelei.`,
      sci: `Zwei Orte, fünfzehn Jahre auseinander: Dmitri Mendelejews Arbeitszimmer in Sankt Petersburg um 1871 (seine Tabelle und die Vorhersage von Eka-Silicium) und, hinter der Glaswand, Clemens Winklers Labortisch an der Bergakademie Freiberg im Jahr 1886. Die Geschichte des Bildes steht auf der Staffelei.`,
    },
    talk: {
      kid: [
        `Ich bin Germanium, das Element Nummer 32. Bevor mich jemand gesehen hatte, hatte Mendelejew schon aufgeschrieben, wie ich sein würde. Deshalb begannen die Leute, dem Periodensystem zu vertrauen.`,
        `Mendelejew nannte mich Eka-Silicium, „das nach dem Silicium“. Das Wort „Eka“ heißt auf Sanskrit „eins“, einer alten Sprache Indiens.`,
        `Clemens Winkler fand mich 1886 in einem Silbererz aus einer Grube bei Freiberg und nannte mich nach seinem Land, Deutschland. Zuerst hatte er an Neptunium gedacht.`,
      ],
      sci: [
        `Germanium, Z = 32, Atommasse 72,63. Mendelejews Eka-Silicium (1871) wurde mit 72 vorhergesagt; Winklers Germanium (1886) wurde mit 72,3 gemessen.`,
        `„Eka“ ist Sanskrit für „eins“: Eka-Silicium ist „das eine nach dem Silicium“. Dieselbe Vorsilbe benutzte er für Eka-Aluminium (Gallium, Lecoq de Boisbaudran, 1875) und Eka-Bor (Scandium, Nilson, 1879).`,
        `Das Erz war Argyrodit, Ag8GeS6, 1885 in der Grube Himmelsfürst bei Freiberg gefunden. Winkler gab das neue Element 1886 bekannt und nannte es nach Deutschland; Neptunium war sein erster Gedanke.`,
      ],
    },
    signs: {
      freiberg: `Freiberg 1886`,
      petersburg: `Sankt Petersburg 1871`,
      board: `Ein Stück von Mendelejews Tabelle`,
      ekaAl: `Eka-Aluminium`,
      ekaSi: `Eka-Silicium`,
    },
    s1: {
      label: `Das Patience-Spiel`,
      title: `Mendelejews Patience`,
      slider: `Ausgeteilte Karten`,
      sliderFmt: `{n} von {total}`,
      hints: {
        start: `Tippe auf den Kartenstapel`,
        more: `Tippe auf den Stapel, um die nächste Karte auszuteilen`,
        gap: `Tippe auf die leere Karte unter dem Silicium`,
        done: `Tippe auf eine Karte, um sie kennenzulernen`,
      },
      buttons: { deal: `Nächste Karte austeilen`, gap: `Die leere Karte unter dem Silicium`, reset: `Karten wieder einsammeln` },
      says: {
        first: {
          kid: `Los geht's. Es heißt, Mendelejew habe jedes Element auf eine Karte geschrieben und damit Patience gelegt, das leichteste zuerst. Teile weiter aus und sieh zu, wie die Spalten entstehen.`,
          sci: `Der Überlieferung nach schrieb Mendelejew jedes Element auf eine Karte und legte sie wie eine Patience (1869). Die Karten gehen nach Atomgewicht, und eine neue Reihe beginnt, wenn sich das Verhalten wiederholt.`,
        },
        skip: {
          kid: `Halt! Nach dem Calcium kommt das Arsen, aber Arsen verhält sich wie Phosphor, also kommt es unter den Phosphor. Die zwei Plätze daneben bleiben leer. Mendelejew hat nichts hineingezwängt. Er ließ Lücken.`,
          sci: `Nach Calcium (40) kommt Arsen (75): dazwischen hat die wirkliche Tabelle einen mittleren Block von Metallen, den diese Wand weglässt. Arsen kommt nach seiner Chemie unter den Phosphor, und die zwei Plätze daneben bleiben leer: Mendelejew ließ sie offen, statt ein bekanntes Element hineinzuzwängen.`,
        },
        swap: {
          kid: `Vorsicht: Iod ist etwas leichter als Tellur, aber es verhält sich wie Chlor und Brom. Also kommt das Iod in deren Spalte, und das Tellur, das als Nächstes kommt, unter das Selen. Mendelejew vertraute dem Verhalten der Elemente mehr als ihrem Gewicht.`,
          sci: `Nach dem Gewicht steht Iod (126,9) vor Tellur (127,6), aber nach der Chemie gehört Tellur unter Selen und Iod unter Brom. Mendelejew folgte dem Verhalten; er vermutete, das Gewicht des Tellurs sei falsch. Das war es nicht: die Ordnungszahl, nicht das Gewicht, bestimmt die Reihenfolge, wie Moseley 1913 zeigte.`,
        },
        done: {
          kid: `Alle 27 Karten sind ausgeteilt! Schau: Zwei fehlen, eine unter dem Aluminium und eine unter dem Silicium. Tippe auf die leere Karte unter dem Silicium.`,
          sci: `Alle 27 Karten sind ausgeteilt. Zwei Plätze bleiben leer, unter Aluminium und unter Silicium, und Mendelejew schrieb 1871, man werde Elemente finden, die sie füllen. Tippe auf die leere Karte unter dem Silicium.`,
        },
        gapSi: {
          kid: `Mendelejew sagte: Hier gehört etwas hin, das noch niemand gefunden hat. Er nannte es Eka-Silicium, „das nach dem Silicium“, und beschrieb es sogar. Geh zum Schreibtisch und sieh, wie.`,
          sci: `Eka-Silicium (Eka: Sanskrit, „eins“), Mendelejews Name für das Element unter dem Silicium. 1871 veröffentlichte er seine Eigenschaften. Die nächste Station zeigt, wie er sie aus den Nachbarn herleitete.`,
        },
        gapAl: {
          kid: `Diese Lücke unter dem Aluminium war sein Eka-Aluminium. Es wurde zuerst gefunden, 1875, und heißt Gallium.`,
          sci: `Eka-Aluminium: Gallium, 1875 von Lecoq de Boisbaudran in Paris gefunden. Eine dritte Lücke, Eka-Bor, liegt im mittleren Block, den diese Wand weglässt: Scandium, 1879.`,
        },
        card: {
          kid: `{name}. Sein Atom ist etwa {w}-mal so schwer wie ein Wasserstoffatom. Es steht in Spalte {col}.`,
          sci: `{name}: Atomgewicht {w}, Spalte {col}.`,
        },
      },
      panel: {
        kid: [
          `1869 ordnete Dmitri Mendelejew die Elemente danach, wie schwer ihre Atome sind. Wenn sich ein Element wie ein früheres verhielt, begann er eine neue Reihe, sodass ähnliche Elemente in derselben Spalte standen. Teile die Karten aus und sieh zu, wie die Spalten entstehen.`,
          `Hier hast du 27 davon, ein Stück seiner Tabelle. Beachte, dass Arsen und Iod dorthin kommen, wo sie sich verhalten, und nicht dorthin, wo ihr Gewicht sie hinsetzen würde, und dass er dort, wo nichts passte, eine Lücke ließ.`,
        ],
        sci: [
          `Mendelejews Tabelle von 1869 und ihre Form von 1871 ordneten die damals bekannten 63 Elemente nach Atomgewicht und chemischem Verhalten (Wertigkeit, Formeln der Oxide und Hydride): Eine Spalte ist eine Gruppe, hier I bis VII (die Edelgase waren noch nicht bekannt). Diese Wand ist ein Ausschnitt, von Wasserstoff bis Iod, 27 Karten; der mittlere Block der Metalle fehlt.`,
          `Wo Gewicht und Verhalten sich widersprachen (Tellur und Iod), gewann das Verhalten. Wo kein bekanntes Element passte, ließ er einen Platz leer und sagte voraus, was ihn füllen würde: 1871 beschrieb er Eka-Bor, Eka-Aluminium und Eka-Silicium.`,
        ],
      },
    },
    s2: {
      label: `Vorhersagen`,
      title: `Wie man ein Element vorhersagt`,
      slider: `Geschriebene Zeilen`,
      sliderFmt: `{n} von {total}`,
      hints: {
        neigh: `Tippe auf die Karten rund um die leere`,
        quill: `Tippe auf die Feder, um die nächste Zeile zu schreiben`,
        done: `Schiebe die Zeilen oder tippe auf die Feder`,
      },
      buttons: { si: `Die Zahlen des Siliciums`, as: `Die Zahlen des Arsens`, sn: `Die Zahlen des Zinns`, quill: `Nächste Zeile schreiben`, reset: `Von vorn` },
      says: {
        coinSi: {
          kid: `Silicium, über der Lücke: ein Atom vom Gewicht {w}, und {d}-mal so schwer wie Wasser. Seine Zahlen kommen in die Notizen.`,
          sci: `{name}, über der Lücke: Atomgewicht {w}, Dichte {d} g/cm³. Seine Zahlen kommen in die Notizen.`,
        },
        coinAs: {
          kid: `Arsen, neben der Lücke: Gewicht {w}, und {d}-mal so schwer wie Wasser. Es kommt in die Notizen.`,
          sci: `{name}, neben der Lücke: Atomgewicht {w}, Dichte {d} g/cm³.`,
        },
        coinSn: {
          kid: `Zinn, unter der Lücke: Gewicht {w}, und {d}-mal so schwer wie Wasser. Es kommt in die Notizen.`,
          sci: `{name}, unter der Lücke: Atomgewicht {w}, Dichte {d} g/cm³.`,
        },
        between: {
          kid: `Silicium wiegt etwa 28 und Zinn etwa 119. Genau dazwischen liegt etwa 73, und das Arsen nebenan hat 75. Das fehlende Atom sollte also etwa 73 wiegen. Mendelejew schrieb 72.`,
          sci: `Genau zwischen Si (28,1) und Sn (118,7) liegt 73,4, mit As (74,9) daneben. Mendelejew schrieb 72. Er nahm keinen einfachen Mittelwert: Er schloss aus den Eigenschaften aller Nachbarn, ihren Atomvolumina und den Formeln ihrer Verbindungen.`,
        },
        early: {
          kid: `Tippe zuerst auf die drei Karten rund um die leere: Silicium, Arsen und Zinn.`,
          sci: `Sammle zuerst die Zahlen der Nachbarn: Silicium, Arsen und Zinn.`,
        },
        line1: { kid: `Erste Zeile: das Gewicht seines Atoms, 72.`, sci: `Atomgewicht 72.` },
        line2: { kid: `Zweite: 5,5-mal so schwer wie Wasser, bei gleicher Größe.`, sci: `Dichte 5,5 g/cm³ (Atomvolumen 13).` },
        line3: { kid: `Dritte: Es schmilzt erst in einem sehr heißen Feuer.`, sci: `Hoher Schmelzpunkt (schwer schmelzbar).` },
        line4: { kid: `Vierte: ein schmutziges Grau, kein glänzendes Metall.`, sci: `Farbe schmutziggrau.` },
        line5: { kid: `Fünfte: Sein Oxid, EsO2 („Es“ ist der Kurzname, den er ihm gab), ist 4,7-mal so schwer wie Wasser.`, sci: `Dioxid EsO2, Dichte 4,7, schwach basisch („Es“ war sein Symbol; heute gehört es dem Einsteinium).` },
        line6: { kid: `Sechste: Mit Chlor bildet es eine Flüssigkeit, die unter 100 °C siedet.`, sci: `Tetrachlorid EsCl4, siedet unter 100 °C.` },
        done: {
          kid: `Alles geschrieben, für ein Element, das noch nie jemand gesehen hatte. Mendelejew schrieb das 1871. Geh jetzt durch die Glaswand nach Freiberg und sieh, was danach geschah.`,
          sci: `Die Vorhersage von 1871 ist vollständig, mit der Dichte 1,9 des Chlorids. Durch die Glaswand: Winklers Labortisch von 1886.`,
        },
      },
      card: {
        head: `Eka-Silicium`,
        rows: [
          [`Atomgewicht`, `72`],
          [`Dichte`, `5,5 g/cm3`],
          [`Schmelzpunkt`, `hoch`],
          [`Farbe`, `schmutziggrau`],
          [`Oxid EsO2`, `Dichte 4,7`],
          [`Chlorid EsCl4`, `siedet unter 100 °C`],
          [`Dichte des Chlorids`, `1,9`],
        ],
        seal: `Vorhergesagt 1871`,
      },
      ledger: { head: `Notizen`, weight: `Gewicht`, density: `Dichte`, between: { kid: `genau dazwischen`, sci: `Mitte von Si und Sn` }, wrote: `Mendelejew schrieb` },
      panel: {
        kid: [
          `Mendelejew schaute auf die Nachbarn des leeren Platzes: Silicium darüber, Zinn darunter, Arsen daneben und auf der anderen Seite noch einen leeren Platz. Elemente ändern sich Schritt für Schritt entlang einer Reihe und eine Spalte hinab, also konnte er ausrechnen, wie das fehlende sein musste. Tippe auf die Karten und sieh, wie ihre Zahlen in die Notizen wandern.`,
          `Dann schreibt die Feder seine Vorhersage, Zeile für Zeile. Denk daran: Niemand hatte dieses Element je gesehen.`,
        ],
        sci: [
          `Aus den Nachbarn: 1871 verglich Mendelejew die Elemente rund um eine Lücke (darüber und darunter in ihrer Gruppe, zu beiden Seiten in ihrer Reihe) nach Atomgewicht, Dichte, Atomvolumen sowie den Formeln und Eigenschaften ihrer Verbindungen und suchte die Werte, die das fehlende Element haben musste. Die Mitte der Gewichte der senkrechten Nachbarn ist 73,4 (Si 28,1, Sn 118,7); er schrieb 72. Die Zahlen in den Notizen sind die heutigen, nicht die, die er hatte.`,
          `Sein Eka-Silicium: Atomgewicht 72, Dichte 5,5 g/cm³, Atomvolumen 13, hoher Schmelzpunkt, schmutziggrau, ein Dioxid EsO2 der Dichte 4,7 und ein flüchtiges Chlorid EsCl4, das unter 100 °C siedet, Dichte 1,9. (Es war sein Symbol; heute ist es das des Einsteiniums.)`,
        ],
      },
    },
    s3: {
      label: `Winklers Labortisch`,
      title: `Die fehlenden 7 Prozent`,
      slider: `Jahr`,
      sliderFmt: `{y}`,
      hints: {
        lump: `Tippe auf den Brocken Argyrodit`,
        dish: `Tippe auf die Schale mit Silber oder Schwefel`,
        ag: `Tippe auf die Silberschale`,
        s: `Tippe auf die Schwefelschale`,
        gap: `Tippe auf die leuchtende Lücke im Diagramm`,
        done: `Schiebe die Jahre oder tippe auf eine Karte an der Wand`,
      },
      buttons: { lump: `Brocken mahlen und wiegen`, ag: `Das Silber herausnehmen`, s: `Den Schwefel herausnehmen`, ge: `Nach dem Fehlenden suchen`, reset: `Von vorn` },
      says: {
        early: {
          kid: `Eins nach dem anderen: Mahle den Brocken, nimm Silber und Schwefel heraus, dann suche den Rest.`,
          sci: `Der Reihe nach: den Brocken mahlen, Silber und Schwefel bestimmen, dann sehen, was übrig bleibt.`,
        },
        lump: {
          kid: `1885 tauchte in einer Grube bei Freiberg ein neues Silbererz auf. Es heißt Argyrodit. Der Chemiker Clemens Winkler sollte es untersuchen. Zuerst wird der Brocken zu Pulver gemahlen und gewogen: Hier sind es 100 Teile.`,
          sci: `Argyrodit, Ag8GeS6, aus der Grube Himmelsfürst bei Freiberg (1885). Winkler mahlte und wog eine Probe (hier 100 Teile).`,
        },
        ag: { kid: `Zuerst das Silber: Das Diagramm steigt bis etwa drei Viertel des Brockens.`, sci: `Silber: 76,5 % nach der Formel Ag8GeS6.` },
        s: { kid: `Dann der Schwefel: etwa ein Sechstel.`, sci: `Schwefel: 17,1 % nach der Formel.` },
        missing: {
          kid: `Zähl zusammen: nur etwa 93 von 100. Die übrigen etwa 7 fehlen! Winkler prüfte seine Arbeit immer wieder. Im Erz steckte etwas, das weder Silber noch Schwefel war.`,
          sci: `Silber und Schwefel machen etwa 93 % aus, also fehlen etwa 7 %; auch Winklers eigene Analysen ergaben nur etwa 93 %. Es musste noch etwas anderes im Erz sein.`,
        },
        found: {
          kid: `Er fand es: zuerst ein weißes Pulver, dann ein graues Kügelchen eines neuen Elements, fast genau so, wie Mendelejew es beschrieben hatte. Winkler nannte es Germanium, nach Deutschland.`,
          sci: `Winkler trennte das fehlende Element als Germaniumsulfid ab, ein weißes Pulver, und stellte daraus das Element her: einen grauen, metallisch aussehenden Feststoff. Er nannte es Germanium, nach Deutschland (Neptunium war sein erster Gedanke).`,
        },
        compare: {
          kid: `Schau auf die Tafel: was Mendelejew 1871 erraten hat und was Winkler 1886 fand. Jede Zeile stimmt.`,
          sci: `Die Vorhersage von 1871 gegen Winklers Zahlen von 1886: Jede Zeile stimmt oder kommt nahe (Atomgewicht 72 und 72,3; Dichte 5,5 und 5,35).`,
        },
        y1871: {
          kid: `1871: Mendelejew schreibt drei Vorhersagen auf: Eka-Bor, Eka-Aluminium und Eka-Silicium. Drei leere Plätze.`,
          sci: `1871: Mendelejew veröffentlicht die Eigenschaften von Eka-Bor, Eka-Aluminium und Eka-Silicium.`,
        },
        y1875: {
          kid: `1875: In Paris findet Lecoq de Boisbaudran ein neues Metall und nennt es Gallium. Es ist das Eka-Aluminium!`,
          sci: `1875: Paul-Émile Lecoq de Boisbaudran entdeckt in Paris das Gallium: Mendelejews Eka-Aluminium.`,
        },
        y1879: {
          kid: `1879: In Schweden findet Lars Fredrik Nilson das Scandium. Es ist das Eka-Bor!`,
          sci: `1879: Lars Fredrik Nilson (Uppsala) entdeckt das Scandium: Eka-Bor.`,
        },
        y1886: {
          kid: `1886: Winkler findet das Germanium, das Eka-Silicium. Alle drei Lücken sind gefüllt.`,
          sci: `1886: Winkler gibt das Germanium bekannt, das Eka-Silicium: Die dritte der Vorhersagen von 1871 ist gefunden.`,
        },
      },
      chart: { head: `Teile von 100`, missing: `fehlt`, found: `Germanium` },
      compare: {
        head: `Vorhergesagt und gefunden`,
        cols: [`Mendelejew 1871`, `Winkler 1886`],
        rows: [
          [`Atomgewicht`, `72`, `72,3`, `72,3`],
          [`Dichte, g/cm3`, `5,5`, `5,35`, `5,35`],
          [`Farbe`, `schmutziggrau`, `grau`, `grau`],
          [`Dichte des Oxids`, `4,7`, `4,7`, `4,70`],
          [`Chlorid siedet bei`, `unter 100 °C`, `86 °C`, `86 °C`],
          [`Dichte des Chlorids`, `1,9`, `1,9`, `1,89`],
        ],
      },
      rail: { head: `Drei Lücken, drei Funde`, t1871: `Mendelejews Tabelle`, eka: [`Eka-Aluminium`, `Eka-Bor`, `Eka-Silicium`] },
      panel: {
        kid: [
          `Das ist Winklers Erz, der Argyrodit: ein dunkler, silbriger Brocken, in dem Silber und Schwefel stecken. Mahle ihn, nimm das Silber heraus, nimm den Schwefel heraus, und das Diagramm hört bei etwa 93 von 100 auf. Winkler prüfte seine Arbeit immer wieder, und immer fehlten etwa sieben Teile. Dann fand er sie: ein neues Element.`,
          `Schiebe die Jahre an der Wand und sieh zu, wie sich alle drei Lücken Mendelejews füllen, eine nach der anderen. Tippe auf eine Karte an der Wand, um zu ihrem Jahr zu springen.`,
        ],
        sci: [
          `Argyrodit, Ag8GeS6, besteht aus 76,5 % Silber, 17,1 % Schwefel und 6,4 % Germanium (Massenanteile aus den Atommassen). Winklers eigene Analysen des Erzes ergaben nur etwa 93 %, also fehlten etwa 7 %; er trennte das Germanium als weißes Sulfid ab und stellte daraus das Element her.`,
          `Der Vergleich benutzt Winklers Zahlen von 1886 (Ber. Dtsch. Chem. Ges. 19, 210), wie sie üblicherweise zusammengestellt werden: Atomgewicht 72,3 (heute 72,63), Dichte 5,35 g/cm³ (heute 5,32), Dichte von GeO2 4,70, GeCl4 siedet bei 86 °C, Dichte 1,89. Gallium (1875) und Scandium (1879) wurden zuerst gefunden; Germanium (1886) war die dritte von Mendelejews Vorhersagen.`,
        ],
      },
    },
  },
}
