// The words of carbon's picture "What are you made of?" as a room (you.js), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/C.js (the easel shows it). Each step is done by tapping its thing: `hints` are what the
// prompt shows as the next step, `verbs` the panels' buttons that do the same; `signs` are drawn in 3D (plain
// text, no subscripts). `{v}` and `{g}` are numbers filled in by the room, written the language's way.
// Facts: the body's mass fractions as the hall's board gives them (65, 18, 10, 3, 1.5, 1 per cent); a
// grown-up breathes out about 1 kg of carbon dioxide a day, about a quarter of a kilogram of carbon.
const EN = {
  title: 'Inside you',
  greet: {
    kid: "Hi, I'm carbon! Step in: we are inside a body, and it is yours. Almost a fifth of your weight is me. Here are the recipe of you, your DNA, and how your food becomes you. The picture's story is on the easel.",
    sci: "Hello. We are inside the body, shrunk smaller than a cell. By mass you are about 65% oxygen, 18% carbon, 10% hydrogen and 3% nitrogen. Three stations: the recipe, the DNA that carries it, and how food's carbon becomes you or leaves in your breath. The picture's story is on the easel.",
  },
  talk: {
    kid: [
      'Count atoms instead of weighing them, and hydrogen wins: almost two out of every three atoms in you are hydrogen. They are just very light.',
      'Every carbon atom in you was once in the air, as carbon dioxide. A plant caught it, and you ate the plant, or an animal that ate plants.',
      'I can hold four hands at once, and I can hold hands with other carbon atoms. That is how I build the long chains and rings that make you.',
    ],
    sci: [
      'By number of atoms the body is about 62% hydrogen, 24% oxygen, 12% carbon and 1% nitrogen: hydrogen is the lightest atom and the commonest.',
      'Your carbon came from carbon dioxide in the air, fixed by photosynthesis, and you breathe it out again as carbon dioxide: a body exchanges its carbon with food and air all the time.',
      'Carbon forms four covalent bonds and strong C–C bonds (about 350 kJ/mol), so it builds chains, branches and rings of almost any size: the skeleton of every molecule of life.',
    ],
  },
  recipe: {
    label: 'The recipe of you',
    title: 'What are you made of?',
    signs: { O: 'oxygen', C: 'carbon', H: 'hydrogen', N: 'nitrogen', Ca: 'calcium', P: 'phosphorus', rest: 'the rest' },
    kg: '{v} kg',
    weight: 'Your weight',
    where: 'Where in you: {el}',
    found: 'In a body of {v} kg',
    hints: { jar: 'Tap a jar to see where it is in you', more: 'Tap another jar, or the scale' },
    says: {
      O: {
        kid: 'Oxygen is the heaviest part of you, because you are mostly water and almost all of water’s weight is oxygen. Look: the water glows all through you.',
        sci: 'About 65% by mass, mostly in water: some 60% of an adult’s mass is water, and 16 of every 18 g of water are oxygen (89%). The rest is in proteins, fats, sugars, DNA and the phosphate of bone.',
      },
      C: {
        kid: 'Carbon is in every part of you that is not water: your muscles, skin, hair, brain and fat. I am the backbone of them all!',
        sci: 'About 18% by mass, more in a body with more fat: fat is about 77% carbon, protein about half. Water holds none, yet every molecule of life is built on a carbon skeleton.',
      },
      H: {
        kid: 'Hydrogen is in your water and in every molecule of life. It is so light that it is only a tenth of your weight, but nearly two out of three atoms in you are hydrogen!',
        sci: 'About 10% by mass but about 62% of all the atoms: water carries two H for each O (11% of its mass), and every organic molecule is covered in C–H bonds.',
      },
      N: {
        kid: 'Nitrogen is in every protein: your muscles, your skin, your hair. It is in the letters of your DNA too.',
        sci: 'About 3% by mass: proteins are about 16% nitrogen (every amino acid has an amino group), and the four DNA bases are rings of carbon and nitrogen.',
      },
      Ca: {
        kid: 'Calcium makes your bones and teeth hard. Almost all your calcium is in them: about a kilogram in a grown-up!',
        sci: 'About 1.5% by mass, roughly 1 kg in an adult, 99% of it in bones and teeth as hydroxyapatite, Ca₁₀(PO₄)₆(OH)₂. The last 1% carries signals: muscles contract, nerves pass on messages, blood clots.',
      },
      P: {
        kid: 'Phosphorus is in your bones too, beside the calcium. It also holds your DNA together and carries the energy in every cell.',
        sci: 'About 1% by mass, some 85% of it in bone mineral; the rest is in every cell: the phosphate backbone of DNA and RNA, ATP, and the phospholipids of cell membranes.',
      },
      rest: {
        kid: 'The last little bit: iron in your blood, which carries oxygen round you; sulfur in your hair; salt (sodium and chlorine) in your blood and sweat; potassium inside your cells.',
        sci: 'About 1.5% together: potassium (mostly inside cells) and sulfur (in cysteine and methionine; hair keratin is rich in it), a few tenths of a per cent each; sodium and chlorine (outside cells), under 0.2% each; magnesium; and iron, only 3 to 4 g, about two thirds of it in haemoglobin.',
      },
    },
    panel: {
      kid: [
        'These jars hold you, taken apart into your elements. Each jar is just big enough for the share of someone who weighs 80 kg, so the biggest jars are the elements you have most of.',
        'Slide your weight to see how much of each there is in you. Tap a jar, and the glass figure shows where in your body that element is.',
      ],
      sci: [
        'By mass: oxygen about 65%, carbon 18%, hydrogen 10%, nitrogen 3%, calcium 1.5%, phosphorus 1%; potassium, sulfur, sodium, chlorine and magnesium make up most of the rest, with traces of iron, zinc, copper, iodine and others. Each jar’s volume is in proportion to its element’s share; the slider fills them for your mass.',
        'The figures differ from person to person: more fat means more carbon and hydrogen, more water more oxygen. And a body is not a mixture of elements but of molecules: the oxygen is mostly in water, the carbon in proteins, fats, sugars and nucleic acids.',
      ],
    },
  },
  dna: {
    label: 'The DNA zipper',
    title: 'Your DNA',
    signs: { pairs: 'Partners', zipper: 'zipper' },
    verbs: { unzip: 'Unzip and copy', away: 'Send the copy away', carbon: 'A carbon’s four hands' },
    hints: { unzip: 'Tap the zipper to unzip the DNA', watch: 'Watch each half build its partner', away: 'Tap the DNA to send the copy away', carbon: 'Tap a grey carbon in a sugar ring' },
    says: {
      unzip: {
        kid: 'Zzzip! The zipper splits the letters apart, and each half grabs new pieces floating by: A always takes T, and G always takes C.',
        sci: 'Helicase unwinds the helix and separates the base pairs; DNA polymerase pairs each exposed base with its complement (A with T, G with C) and links the new strand from its 5′ end to its 3′ end.',
      },
      copied: {
        kid: 'Two DNAs, exactly the same! Each has one old half and one new half. That is how every new cell gets its own copy.',
        sci: 'Semi-conservative replication (Meselson and Stahl, 1958): each daughter helix keeps one parent strand. With proofreading and repair, about one mistake in a billion letters, or fewer.',
      },
      away: {
        kid: 'Off it goes, to a new cell! The other copy stays here.',
        sci: 'When the cell divides, the two copies separate: each daughter cell receives one complete set.',
      },
      C1: {
        kid: 'This carbon holds four hands: two in the sugar ring, one holding a letter of the DNA, and one holding a little hydrogen.',
        sci: 'C1′: bonded to O4′ and C2′ in the ring, to a nitrogen of the base (the glycosidic bond) and to one hydrogen. Four bonds, pointing to the corners of a tetrahedron.',
      },
      C2: {
        kid: 'Two hands in the ring, and two little hydrogens. In other sugars an oxygen sits here: DNA’s sugar has none, so it is called deoxyribose, “without oxygen”.',
        sci: 'C2′: bonded to C1′, C3′ and two hydrogens. Ribose, in RNA, carries an OH group here; its absence is the “deoxy” in deoxyribonucleic acid.',
      },
      C3: {
        kid: 'Two hands in the ring, one holding the oxygen that links to the next phosphate in the chain, and one hydrogen.',
        sci: 'C3′: bonded to C2′, C4′, one hydrogen and O3′, which joins through a phosphate to the next nucleotide (its 3′ side).',
      },
      C4: {
        kid: 'Two hands in the ring, one holding the carbon just outside the ring, and one hydrogen.',
        sci: 'C4′: bonded to C3′, the ring oxygen O4′, C5′ and one hydrogen.',
      },
      C5: {
        kid: 'This carbon sits just outside the ring: one hand to the ring, one to the oxygen that leads to the phosphate, and two hydrogens.',
        sci: 'C5′, outside the ring: bonded to C4′, two hydrogens and O5′, which is joined to a phosphate (its 5′ side).',
      },
    },
    panel: {
      kid: [
        'DNA is a very long ladder, twisted into a spiral. Its two sides are sugars and phosphates, and each sugar is a little ring of four carbons and an oxygen. The rungs are pairs of letters: A always holds T, and G always holds C.',
        'When a cell divides, it copies its DNA: the ladder unzips down the middle, and each half builds its missing partner. Tap the zipper to try it, and tap a grey carbon in a sugar ring to see its four hands.',
        'The DNA in just one of your cells has more than 6 billion letters, and stretched out it would be about 2 metres long!',
      ],
      sci: [
        'Deoxyribonucleic acid: two antiparallel strands of deoxyribose (C₅H₁₀O₄) and phosphate, joined by phosphodiester bonds and wound into a right-handed double helix 2 nm wide, 0.34 nm per base pair and about 10.5 pairs a turn (Watson and Crick, 1953, from the X-ray work of Franklin, Gosling and Wilkins).',
        'The bases pair by hydrogen bonds, A with T by two and G with C by three; a purine (A, G) always faces a pyrimidine (T, C), so every rung has the same width. Each nucleotide carries nine or ten carbon atoms: five in its sugar, four or five in its base.',
        'A human cell holds two sets of about 3.1 billion base pairs each, some 2 m of DNA. Copying them all takes the cell several hours.',
      ],
    },
  },
  food: {
    label: 'Your food becomes you',
    title: 'From bread to you',
    signs: { glucose: 'glucose', amino: 'amino acids', mito: 'mitochondrion', ribo: 'ribosome', cloud: 'your breath' },
    move: 'How hard you move',
    moves: { rest: 'resting', walk: 'walking', run: 'running' },
    perMin: '{g} g of carbon a minute',
    verbs: { bread: 'Eat the bread', glucose: 'Burn a glucose', amino: 'Build a protein', breathe: 'Breathe out', slice: 'Another slice' },
    hints: {
      bread: 'Tap the bread',
      wait: 'Watch your body break it down',
      choose: 'Tap a glucose ring, or the amino acids',
      breathe: 'Tap your breath to breathe out',
      slice: 'Tap the plate for another slice',
    },
    says: {
      bread: {
        kid: 'Chomp! Your body breaks the bread down: its starch into glucose, sugar rings with six carbons, and its proteins into amino acids.',
        sci: 'Amylase, in saliva and from the pancreas, cuts starch into maltose, and enzymes of the gut finish it into glucose; proteases cut the bread’s proteins, mostly gluten, into amino acids. The blood brings both to every cell.',
      },
      glucose: {
        kid: 'In goes the glucose, to the cell’s power station: the mitochondrion.',
        sci: 'Glycolysis splits glucose into two pyruvates in the cytosol; the mitochondria oxidise them in the citric acid cycle.',
      },
      burned: {
        kid: 'Its six carbons leave as six carbon dioxide molecules, and the cell gets the energy to move you. The carbon dioxide goes to your lungs and out in your breath!',
        sci: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, about 2800 kJ per mole, of which the cell keeps a good part as some 30 ATP. The CO₂ goes into the blood and leaves through the lungs.',
      },
      amino: {
        kid: 'The amino acids go to the ribosome, the cell’s little builder, which strings them into a chain.',
        sci: 'The ribosome reads a messenger RNA and joins the amino acids by peptide bonds, in the order the gene spells out.',
      },
      built: {
        kid: 'A new protein! Its backbone is a chain of carbon and nitrogen. Now that carbon is part of you: a muscle, a hair, a bit of skin.',
        sci: 'A polypeptide: a backbone of N–C–C repeats, with a side chain on each alpha carbon. An adult makes and breaks down a few hundred grams of its own protein every day.',
      },
      breathe: {
        kid: 'Whoosh! Every breath out carries carbon away. A grown-up breathes out about a quarter of a kilogram of carbon every day.',
        sci: 'An adult breathes out about 1 kg of CO₂ a day, and 12/44 of its mass is carbon: about a quarter of a kilogram, about as much as comes in with food.',
      },
      slice: { kid: 'Here is another slice.', sci: 'Another slice of bread.' },
      first: { kid: 'First tap the bread, so your body can break it down.', sci: 'Nothing digested yet: start with the bread.' },
      empty: { kid: 'No glucose left: tap the plate for another slice.', sci: 'All the glucose is used: another slice first.' },
      noAmino: { kid: 'Those amino acids are already part of you. Tap a glucose ring, or the plate for another slice.', sci: 'The amino acids are built in; another slice brings more.' },
      waiting: { kid: 'First use the glucose and the amino acids that are waiting.', sci: 'Use what is waiting first: glucose and amino acids.' },
    },
    panel: {
      kid: [
        'You are made of what you eat. Bread is mostly starch: long chains of glucose, and each glucose has six carbon atoms, five of them in a ring with an oxygen. Your body breaks the bread down into glucose and amino acids, and your blood carries them to your cells.',
        'Inside a cell, the carbon goes one of two ways. Burned for energy, it leaves as carbon dioxide and you breathe it out. Built into you, it becomes part of a new protein. Tap a glucose ring or the amino acids to choose. Slide how hard you move: the harder you work, the more carbon you breathe out.',
      ],
      sci: [
        'White bread is about two fifths starch (amylose and amylopectin, chains of glucose) and a tenth protein. Digested into glucose and amino acids, they reach the cells by the blood. Glucose is oxidised to CO₂ by glycolysis, the citric acid cycle and the respiratory chain (about 30 ATP per glucose), or stored as glycogen and fat; amino acids are built into proteins.',
        'At rest an adult breathes out about 0.2 L of CO₂ a minute, carrying about 0.1 g of carbon; walking about four times as much, running about ten times. Over a day that is about 1 kg of CO₂: the carbon you eat leaves mostly in your breath.',
      ],
    },
  },
}

const PT = {
  title: 'Dentro de ti',
  greet: {
    kid: 'Olá, eu sou o carbono! Entra: estamos dentro de um corpo, e é o teu. Quase um quinto do teu peso sou eu. Aqui estão a tua receita, o teu ADN e a maneira como a comida se transforma em ti. A história da imagem está no cavalete.',
    sci: 'Olá. Estamos dentro do corpo, encolhidos até ficarmos mais pequenos do que uma célula. Em massa és cerca de 65% oxigénio, 18% carbono, 10% hidrogénio e 3% azoto. Três estações: a receita, o ADN que a guarda e a maneira como o carbono da comida passa a fazer parte de ti ou sai na tua respiração. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'Conta os átomos em vez de os pesar, e o hidrogénio ganha: quase dois em cada três átomos do teu corpo são de hidrogénio. Só que são muito leves.',
      'Cada átomo de carbono que tens já esteve no ar, como dióxido de carbono. Uma planta apanhou-o, e tu comeste a planta, ou um animal que comeu plantas.',
      'Consigo dar quatro mãos ao mesmo tempo, e consigo dar a mão a outros átomos de carbono. É assim que construo as longas cadeias e os anéis de que o teu corpo é feito.',
    ],
    sci: [
      'Em número de átomos, o corpo é cerca de 62% hidrogénio, 24% oxigénio, 12% carbono e 1% azoto: o hidrogénio é o átomo mais leve e o mais comum.',
      'O teu carbono veio do dióxido de carbono do ar, fixado pela fotossíntese, e voltas a expirá-lo como dióxido de carbono: um corpo troca o seu carbono com a comida e o ar a toda a hora.',
      'O carbono forma quatro ligações covalentes e ligações C–C fortes (cerca de 350 kJ/mol), por isso constrói cadeias, ramificações e anéis de quase qualquer tamanho: o esqueleto de todas as moléculas da vida.',
    ],
  },
  recipe: {
    label: 'A tua receita',
    title: 'De que é feito o teu corpo?',
    signs: { O: 'oxigénio', C: 'carbono', H: 'hidrogénio', N: 'azoto', Ca: 'cálcio', P: 'fósforo', rest: 'o resto' },
    kg: '{v} kg',
    weight: 'O teu peso',
    where: 'Onde está em ti: {el}',
    found: 'Num corpo de {v} kg',
    hints: { jar: 'Toca num frasco para veres onde está em ti', more: 'Toca noutro frasco, ou na balança' },
    says: {
      O: {
        kid: 'O oxigénio é a parte mais pesada de ti, porque és sobretudo água e quase todo o peso da água é oxigénio. Olha: a água brilha por todo o teu corpo.',
        sci: 'Cerca de 65% da massa, sobretudo na água: uns 60% da massa de um adulto são água, e em cada 18 g de água 16 são oxigénio (89%). O resto está nas proteínas, nas gorduras, nos açúcares, no ADN e no fosfato dos ossos.',
      },
      C: {
        kid: 'O carbono está em todas as partes de ti que não são água: músculos, pele, cabelo, cérebro e gordura. Eu sou o esqueleto de todas elas!',
        sci: 'Cerca de 18% da massa, mais num corpo com mais gordura: a gordura tem cerca de 77% de carbono, as proteínas cerca de metade. A água não tem nenhum, mas todas as moléculas da vida são construídas sobre um esqueleto de carbono.',
      },
      H: {
        kid: 'O hidrogénio está na tua água e em todas as moléculas da vida. É tão leve que é só um décimo do teu peso, mas quase dois em cada três átomos do teu corpo são de hidrogénio!',
        sci: 'Cerca de 10% da massa, mas cerca de 62% de todos os átomos: a água leva dois H por cada O (11% da sua massa), e todas as moléculas orgânicas estão cobertas de ligações C–H.',
      },
      N: {
        kid: 'O azoto está em todas as proteínas: nos teus músculos, na tua pele, no teu cabelo. Também está nas letras do teu ADN.',
        sci: 'Cerca de 3% da massa: as proteínas têm cerca de 16% de azoto (todos os aminoácidos têm um grupo amino), e as quatro bases do ADN são anéis de carbono e azoto.',
      },
      Ca: {
        kid: 'O cálcio torna os teus ossos e os teus dentes duros. Quase todo o teu cálcio está lá: cerca de um quilograma num adulto!',
        sci: 'Cerca de 1,5% da massa, à volta de 1 kg num adulto, 99% nos ossos e nos dentes, como hidroxiapatite, Ca₁₀(PO₄)₆(OH)₂. O último 1% leva sinais: os músculos contraem-se, os nervos passam mensagens, o sangue coagula.',
      },
      P: {
        kid: 'O fósforo também está nos teus ossos, ao lado do cálcio. E segura o teu ADN e transporta a energia em todas as células.',
        sci: 'Cerca de 1% da massa, uns 85% no mineral dos ossos; o resto está em todas as células: no esqueleto de fosfatos do ADN e do ARN, no ATP e nos fosfolípidos das membranas.',
      },
      rest: {
        kid: 'O último bocadinho: ferro no teu sangue, que leva o oxigénio pelo corpo; enxofre no teu cabelo; sal (sódio e cloro) no sangue e no suor; potássio dentro das células.',
        sci: 'Cerca de 1,5% ao todo: potássio (sobretudo dentro das células) e enxofre (na cisteína e na metionina; a queratina do cabelo é rica nele), umas décimas de por cento cada; sódio e cloro (fora das células), menos de 0,2% cada; magnésio; e ferro, só 3 a 4 g, cerca de dois terços na hemoglobina.',
      },
    },
    panel: {
      kid: [
        'Estes frascos guardam o teu corpo, separado nos seus elementos. Cada frasco tem o tamanho certo para a parte de alguém que pesa 80 kg, por isso os frascos maiores são os elementos de que tens mais.',
        'Desliza o teu peso para veres quanto há de cada um em ti. Toca num frasco, e a figura de vidro mostra onde está esse elemento no teu corpo.',
      ],
      sci: [
        'Em massa: oxigénio cerca de 65%, carbono 18%, hidrogénio 10%, azoto 3%, cálcio 1,5%, fósforo 1%; potássio, enxofre, sódio, cloro e magnésio fazem quase todo o resto, com vestígios de ferro, zinco, cobre, iodo e outros. O volume de cada frasco é proporcional à parte do seu elemento; o cursor enche-os para a tua massa.',
        'Os números variam de pessoa para pessoa: mais gordura quer dizer mais carbono e hidrogénio, mais água mais oxigénio. E um corpo não é uma mistura de elementos, mas de moléculas: o oxigénio está sobretudo na água, o carbono nas proteínas, nas gorduras, nos açúcares e nos ácidos nucleicos.',
      ],
    },
  },
  dna: {
    label: 'O fecho do ADN',
    title: 'O teu ADN',
    signs: { pairs: 'Pares', zipper: 'fecho' },
    verbs: { unzip: 'Abrir e copiar', away: 'Mandar a cópia embora', carbon: 'As quatro mãos de um carbono' },
    hints: { unzip: 'Toca no fecho para abrir o ADN', watch: 'Vê cada metade construir o seu par', away: 'Toca no ADN para mandar a cópia embora', carbon: 'Toca num carbono cinzento de um anel de açúcar' },
    says: {
      unzip: {
        kid: 'Zzzip! O fecho separa as letras, e cada metade agarra peças novas que andam por ali: o A fica sempre com o T, e o G sempre com o C.',
        sci: 'A helicase desenrola a hélice e separa os pares de bases; a ADN polimerase junta a cada base exposta a sua complementar (A com T, G com C) e liga a cadeia nova da extremidade 5′ para a 3′.',
      },
      copied: {
        kid: 'Dois ADN, exatamente iguais! Cada um tem uma metade velha e uma metade nova. É assim que cada célula nova recebe a sua cópia.',
        sci: 'Replicação semiconservativa (Meselson e Stahl, 1958): cada hélice filha guarda uma cadeia da mãe. Com a revisão e a reparação, cerca de um erro em mil milhões de letras, ou menos.',
      },
      away: {
        kid: 'Lá vai ela, para uma célula nova! A outra cópia fica aqui.',
        sci: 'Quando a célula se divide, as duas cópias separam-se: cada célula filha recebe um conjunto completo.',
      },
      C1: {
        kid: 'Este carbono dá quatro mãos: duas no anel de açúcar, uma a segurar uma letra do ADN, e uma a segurar um pequeno hidrogénio.',
        sci: 'C1′: ligado a O4′ e a C2′ no anel, a um azoto da base (a ligação glicosídica) e a um hidrogénio. Quatro ligações, apontadas para os vértices de um tetraedro.',
      },
      C2: {
        kid: 'Duas mãos no anel e dois pequenos hidrogénios. Noutros açúcares está aqui um oxigénio: o açúcar do ADN não tem, por isso chama-se desoxirribose, “sem oxigénio”.',
        sci: 'C2′: ligado a C1′, a C3′ e a dois hidrogénios. A ribose, no ARN, tem aqui um grupo OH; é a sua falta que dá o “desoxi” do ácido desoxirribonucleico.',
      },
      C3: {
        kid: 'Duas mãos no anel, uma a segurar o oxigénio que liga ao fosfato seguinte da cadeia, e um hidrogénio.',
        sci: 'C3′: ligado a C2′, a C4′, a um hidrogénio e a O3′, que se junta por um fosfato ao nucleótido seguinte (o seu lado 3′).',
      },
      C4: {
        kid: 'Duas mãos no anel, uma a segurar o carbono que fica mesmo fora do anel, e um hidrogénio.',
        sci: 'C4′: ligado a C3′, ao oxigénio do anel O4′, a C5′ e a um hidrogénio.',
      },
      C5: {
        kid: 'Este carbono fica mesmo fora do anel: uma mão para o anel, uma para o oxigénio que leva ao fosfato, e dois hidrogénios.',
        sci: 'C5′, fora do anel: ligado a C4′, a dois hidrogénios e a O5′, que se liga a um fosfato (o seu lado 5′).',
      },
    },
    panel: {
      kid: [
        'O ADN é uma escada muito comprida, torcida em espiral. Os dois lados são açúcares e fosfatos, e cada açúcar é um pequeno anel de quatro carbonos e um oxigénio. Os degraus são pares de letras: o A segura sempre o T, e o G segura sempre o C.',
        'Quando uma célula se divide, copia o seu ADN: a escada abre-se ao meio, e cada metade constrói o par que lhe falta. Toca no fecho para experimentar, e toca num carbono cinzento de um anel de açúcar para veres as suas quatro mãos.',
        'O ADN de uma só das tuas células tem mais de 6 mil milhões de letras, e esticado teria cerca de 2 metros!',
      ],
      sci: [
        'Ácido desoxirribonucleico: duas cadeias antiparalelas de desoxirribose (C₅H₁₀O₄) e fosfato, unidas por ligações fosfodiéster e enroladas numa dupla hélice direita com 2 nm de largura, 0,34 nm por par de bases e cerca de 10,5 pares por volta (Watson e Crick, 1953, a partir do trabalho de raios X de Franklin, Gosling e Wilkins).',
        'As bases emparelham por ligações de hidrogénio, A com T por duas e G com C por três; uma purina (A, G) fica sempre em frente a uma pirimidina (T, C), por isso todos os degraus têm a mesma largura. Cada nucleótido tem nove ou dez átomos de carbono: cinco no açúcar, quatro ou cinco na base.',
        'Uma célula humana tem dois conjuntos de cerca de 3,1 mil milhões de pares de bases cada, uns 2 m de ADN. Copiá-los todos leva à célula várias horas.',
      ],
    },
  },
  food: {
    label: 'A comida transforma-se em ti',
    title: 'Do pão até ti',
    signs: { glucose: 'glucose', amino: 'aminoácidos', mito: 'mitocôndria', ribo: 'ribossoma', cloud: 'a tua respiração' },
    move: 'Quanto te mexes',
    moves: { rest: 'em repouso', walk: 'a andar', run: 'a correr' },
    perMin: '{g} g de carbono por minuto',
    verbs: { bread: 'Comer o pão', glucose: 'Queimar uma glucose', amino: 'Construir uma proteína', breathe: 'Expirar', slice: 'Outra fatia' },
    hints: {
      bread: 'Toca no pão',
      wait: 'Vê o teu corpo a desfazê-lo',
      choose: 'Toca num anel de glucose, ou nos aminoácidos',
      breathe: 'Toca na tua respiração para expirar',
      slice: 'Toca no prato para outra fatia',
    },
    says: {
      bread: {
        kid: 'Nham! O teu corpo desfaz o pão: o amido em glucose, anéis de açúcar com seis carbonos, e as proteínas em aminoácidos.',
        sci: 'A amilase, da saliva e do pâncreas, corta o amido em maltose, e as enzimas do intestino acabam o trabalho até à glucose; as proteases cortam as proteínas do pão, sobretudo o glúten, em aminoácidos. O sangue leva ambos a todas as células.',
      },
      glucose: {
        kid: 'Lá vai a glucose, para a central de energia da célula: a mitocôndria.',
        sci: 'A glicólise parte a glucose em dois piruvatos no citosol; as mitocôndrias oxidam-nos no ciclo do ácido cítrico.',
      },
      burned: {
        kid: 'Os seus seis carbonos saem como seis moléculas de dióxido de carbono, e a célula ganha energia para te mexeres. O dióxido de carbono vai até aos pulmões e sai na tua respiração!',
        sci: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, cerca de 2800 kJ por mole, dos quais a célula guarda boa parte em umas 30 moléculas de ATP. O CO₂ passa para o sangue e sai pelos pulmões.',
      },
      amino: {
        kid: 'Os aminoácidos vão para o ribossoma, o pequeno construtor da célula, que os enfia numa cadeia.',
        sci: 'O ribossoma lê um ARN mensageiro e junta os aminoácidos por ligações peptídicas, pela ordem que o gene indica.',
      },
      built: {
        kid: 'Uma proteína nova! A sua espinha é uma cadeia de carbono e azoto. Agora esse carbono faz parte de ti: um músculo, um cabelo, um bocadinho de pele.',
        sci: 'Um polipéptido: um esqueleto de unidades N–C–C, com uma cadeia lateral em cada carbono alfa. Um adulto faz e desfaz umas centenas de gramas das suas próprias proteínas todos os dias.',
      },
      breathe: {
        kid: 'Fuuu! Cada vez que expiras levas carbono contigo. Um adulto expira cerca de um quarto de quilograma de carbono por dia.',
        sci: 'Um adulto expira cerca de 1 kg de CO₂ por dia, e 12/44 da sua massa é carbono: cerca de um quarto de quilograma, mais ou menos o que entra com a comida.',
      },
      slice: { kid: 'Aqui está outra fatia.', sci: 'Outra fatia de pão.' },
      first: { kid: 'Primeiro toca no pão, para o teu corpo o desfazer.', sci: 'Ainda nada foi digerido: começa pelo pão.' },
      empty: { kid: 'Já não há glucose: toca no prato para outra fatia.', sci: 'A glucose foi toda usada: primeiro outra fatia.' },
      noAmino: { kid: 'Esses aminoácidos já fazem parte de ti. Toca num anel de glucose, ou no prato para outra fatia.', sci: 'Os aminoácidos já foram usados; outra fatia traz mais.' },
      waiting: { kid: 'Primeiro usa a glucose e os aminoácidos que estão à espera.', sci: 'Usa primeiro o que está à espera: glucose e aminoácidos.' },
    },
    panel: {
      kid: [
        'O teu corpo é feito daquilo que comes. O pão é sobretudo amido: longas cadeias de glucose, e cada glucose tem seis átomos de carbono, cinco deles num anel com um oxigénio. O teu corpo desfaz o pão em glucose e aminoácidos, e o sangue leva-os até às tuas células.',
        'Dentro de uma célula, o carbono segue um de dois caminhos. Queimado para dar energia, sai como dióxido de carbono e tu expira-lo. Construído em ti, passa a fazer parte de uma proteína nova. Toca num anel de glucose ou nos aminoácidos para escolher. Desliza quanto te mexes: quanto mais te esforças, mais carbono expiras.',
      ],
      sci: [
        'O pão branco tem cerca de dois quintos de amido (amilose e amilopectina, cadeias de glucose) e um décimo de proteína. Digeridos em glucose e aminoácidos, chegam às células pelo sangue. A glucose é oxidada a CO₂ pela glicólise, pelo ciclo do ácido cítrico e pela cadeia respiratória (cerca de 30 ATP por glucose), ou guardada como glicogénio e gordura; os aminoácidos são incorporados em proteínas.',
        'Em repouso, um adulto expira cerca de 0,2 L de CO₂ por minuto, com cerca de 0,1 g de carbono; a andar, cerca de quatro vezes mais, a correr cerca de dez vezes. Num dia são cerca de 1 kg de CO₂: o carbono que comes sai sobretudo na tua respiração.',
      ],
    },
  },
}

const PL = {
  title: 'W twoim ciele',
  greet: {
    kid: 'Cześć! Jestem Węgiel. Wejdź: jesteśmy w środku ciała, i to twojego. Prawie jedna piąta twojej wagi to ja. Tu jest przepis na ciebie, twoje DNA i to, jak jedzenie staje się tobą. Historia obrazka jest na sztaludze.',
    sci: 'Cześć! Jestem Węgiel. Jesteśmy w ciele, zmniejszeni tak, że jesteśmy mniejsi od komórki. Pod względem masy składasz się w około 65% z tlenu, w 18% z węgla, w 10% z wodoru i w 3% z azotu. Trzy stanowiska: przepis, DNA, które go przechowuje, i to, jak węgiel z jedzenia staje się tobą albo odchodzi z oddechem. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Policz atomy zamiast je ważyć, a wygra wodór: prawie dwa na każde trzy atomy w tobie to wodór. Tylko że są bardzo lekkie.',
      'Każdy atom węgla w tobie był kiedyś w powietrzu, jako dwutlenek węgla. Złapała go roślina, a potem trafił do ciebie w jedzeniu: w roślinie albo w zwierzęciu, które jadło rośliny.',
      'Mogę trzymać cztery ręce naraz i mogę trzymać się za ręce z innymi atomami węgla. Tak buduję długie łańcuchy i pierścienie, z których się składasz.',
    ],
    sci: [
      'Pod względem liczby atomów ciało to około 62% wodoru, 24% tlenu, 12% węgla i 1% azotu: wodór jest najlżejszym i najczęstszym atomem.',
      'Twój węgiel pochodzi z dwutlenku węgla z powietrza, związanego w fotosyntezie, i wydychasz go z powrotem jako dwutlenek węgla: ciało cały czas wymienia swój węgiel z jedzeniem i powietrzem.',
      'Węgiel tworzy cztery wiązania kowalencyjne i mocne wiązania C–C (około 350 kJ/mol), więc buduje łańcuchy, rozgałęzienia i pierścienie niemal dowolnej wielkości: szkielet każdej cząsteczki życia.',
    ],
  },
  recipe: {
    label: 'Przepis na ciebie',
    title: 'Z czego się składasz?',
    signs: { O: 'tlen', C: 'węgiel', H: 'wodór', N: 'azot', Ca: 'wapń', P: 'fosfor', rest: 'reszta' },
    kg: '{v} kg',
    weight: 'Twoja waga',
    where: 'Gdzie w tobie: {el}',
    found: 'W ciele o wadze {v} kg',
    hints: { jar: 'Dotknij słoika, żeby zobaczyć, gdzie to jest w tobie', more: 'Dotknij innego słoika albo wagi' },
    says: {
      O: {
        kid: 'Tlen to najcięższa część ciebie, bo składasz się głównie z wody, a prawie cała waga wody to tlen. Popatrz: woda świeci w całym ciele.',
        sci: 'Około 65% masy, głównie w wodzie: około 60% masy dorosłego to woda, a z każdych 18 g wody 16 g to tlen (89%). Reszta jest w białkach, tłuszczach, cukrach, DNA i fosforanach kości.',
      },
      C: {
        kid: 'Węgiel jest w każdej części ciebie, która nie jest wodą: w mięśniach, skórze, włosach, mózgu i tłuszczu. Jestem szkieletem ich wszystkich!',
        sci: 'Około 18% masy, więcej w ciele z większą ilością tłuszczu: tłuszcz to w około 77% węgiel, białko mniej więcej w połowie. W wodzie nie ma go wcale, a jednak każda cząsteczka życia jest zbudowana na węglowym szkielecie.',
      },
      H: {
        kid: 'Wodór jest w twojej wodzie i w każdej cząsteczce życia. Jest tak lekki, że to tylko jedna dziesiąta twojej wagi, ale prawie dwa na trzy atomy w tobie to wodór!',
        sci: 'Około 10% masy, ale około 62% wszystkich atomów: woda ma dwa H na każdy O (11% jej masy), a każda cząsteczka organiczna jest pokryta wiązaniami C–H.',
      },
      N: {
        kid: 'Azot jest w każdym białku: w twoich mięśniach, skórze i włosach. Jest też w literach twojego DNA.',
        sci: 'Około 3% masy: białka zawierają około 16% azotu (każdy aminokwas ma grupę aminową), a cztery zasady DNA to pierścienie z węgla i azotu.',
      },
      Ca: {
        kid: 'Wapń sprawia, że twoje kości i zęby są twarde. Prawie cały twój wapń jest właśnie tam: u dorosłego około kilograma!',
        sci: 'Około 1,5% masy, u dorosłego mniej więcej 1 kg, z czego 99% w kościach i zębach jako hydroksyapatyt, Ca₁₀(PO₄)₆(OH)₂. Ostatni 1% przenosi sygnały: mięśnie się kurczą, nerwy przekazują wiadomości, krew krzepnie.',
      },
      P: {
        kid: 'Fosfor też jest w twoich kościach, obok wapnia. Trzyma też razem twoje DNA i przenosi energię w każdej komórce.',
        sci: 'Około 1% masy, z czego około 85% w minerale kości; reszta jest w każdej komórce: w fosforanowym szkielecie DNA i RNA, w ATP i w fosfolipidach błon komórkowych.',
      },
      rest: {
        kid: 'Ostatni maleńki kawałek: żelazo we krwi, które roznosi tlen po ciele; siarka we włosach; sól (sód i chlor) we krwi i w pocie; potas w środku komórek.',
        sci: 'Razem około 1,5%: potas (głównie wewnątrz komórek) i siarka (w cysteinie i metioninie; keratyna włosów jest w nią bogata), po kilka dziesiątych procenta; sód i chlor (poza komórkami), każdy poniżej 0,2%; magnez; i żelazo, tylko 3 do 4 g, z czego około dwóch trzecich w hemoglobinie.',
      },
    },
    panel: {
      kid: [
        'Te słoiki zawierają twoje ciało rozłożone na pierwiastki. Każdy słoik jest dokładnie tak duży, żeby pomieścić porcję kogoś, kto waży 80 kg, więc największe słoiki to pierwiastki, których masz najwięcej.',
        'Przesuń swoją wagę, żeby zobaczyć, ile jest w tobie każdego z nich. Dotknij słoika, a szklana postać pokaże, gdzie w twoim ciele jest ten pierwiastek.',
      ],
      sci: [
        'Pod względem masy: tlen około 65%, węgiel 18%, wodór 10%, azot 3%, wapń 1,5%, fosfor 1%; potas, siarka, sód, chlor i magnez to większość reszty, do tego śladowe ilości żelaza, cynku, miedzi, jodu i innych. Objętość każdego słoika jest proporcjonalna do udziału jego pierwiastka; suwak napełnia je dla twojej masy.',
        'Te liczby różnią się u różnych ludzi: więcej tłuszczu to więcej węgla i wodoru, więcej wody to więcej tlenu. A ciało nie jest mieszaniną pierwiastków, tylko cząsteczek: tlen jest głównie w wodzie, węgiel w białkach, tłuszczach, cukrach i kwasach nukleinowych.',
      ],
    },
  },
  dna: {
    label: 'Zamek błyskawiczny DNA',
    title: 'Twoje DNA',
    signs: { pairs: 'Pary', zipper: 'zamek' },
    verbs: { unzip: 'Rozepnij i skopiuj', away: 'Wyślij kopię dalej', carbon: 'Cztery ręce węgla' },
    hints: { unzip: 'Dotknij zamka, żeby rozpiąć DNA', watch: 'Patrz, jak każda połówka buduje swoją parę', away: 'Dotknij DNA, żeby wysłać kopię dalej', carbon: 'Dotknij szarego węgla w pierścieniu cukru' },
    says: {
      unzip: {
        kid: 'Zzzip! Zamek rozdziela litery, a każda połówka łapie nowe kawałki, które przepływają obok: A zawsze bierze T, a G zawsze bierze C.',
        sci: 'Helikaza rozplata helisę i rozdziela pary zasad; polimeraza DNA dobiera do każdej odsłoniętej zasady jej komplementarną (A z T, G z C) i łączy nową nić od końca 5′ do końca 3′.',
      },
      copied: {
        kid: 'Dwa DNA, dokładnie takie same! Każde ma jedną starą i jedną nową połówkę. Tak każda nowa komórka dostaje swoją kopię.',
        sci: 'Replikacja semikonserwatywna (Meselson i Stahl, 1958): każda helisa potomna zachowuje jedną nić rodzicielską. Dzięki korekcie i naprawie zdarza się około jednego błędu na miliard liter albo mniej.',
      },
      away: {
        kid: 'Leci do nowej komórki! Druga kopia zostaje tutaj.',
        sci: 'Gdy komórka się dzieli, obie kopie się rozdzielają: każda komórka potomna dostaje jeden pełny komplet.',
      },
      C1: {
        kid: 'Ten węgiel trzyma cztery ręce: dwie w pierścieniu cukru, jedną trzyma literę DNA, a jedną mały wodór.',
        sci: 'C1′: związany z O4′ i C2′ w pierścieniu, z azotem zasady (wiązanie glikozydowe) i z jednym wodorem. Cztery wiązania skierowane do narożników czworościanu.',
      },
      C2: {
        kid: 'Dwie ręce w pierścieniu i dwa małe wodory. W innych cukrach siedzi tu tlen: cukier DNA go nie ma, dlatego nazywa się deoksyryboza, czyli „bez tlenu”.',
        sci: 'C2′: związany z C1′, C3′ i dwoma wodorami. Ryboza w RNA ma tu grupę OH; jej brak to „deoksy” w nazwie kwasu deoksyrybonukleinowego.',
      },
      C3: {
        kid: 'Dwie ręce w pierścieniu, jedna trzyma tlen, który łączy się z następnym fosforanem w łańcuchu, i jeden wodór.',
        sci: 'C3′: związany z C2′, C4′, jednym wodorem i O3′, który przez fosforan łączy się z następnym nukleotydem (jego strona 3′).',
      },
      C4: {
        kid: 'Dwie ręce w pierścieniu, jedna trzyma węgiel tuż za pierścieniem, i jeden wodór.',
        sci: 'C4′: związany z C3′, z tlenem pierścienia O4′, z C5′ i z jednym wodorem.',
      },
      C5: {
        kid: 'Ten węgiel siedzi tuż za pierścieniem: jedna ręka do pierścienia, jedna do tlenu, który prowadzi do fosforanu, i dwa wodory.',
        sci: 'C5′, poza pierścieniem: związany z C4′, dwoma wodorami i O5′, który jest połączony z fosforanem (jego strona 5′).',
      },
    },
    panel: {
      kid: [
        'DNA to bardzo długa drabina skręcona w spiralę. Jej dwa boki to cukry i fosforany, a każdy cukier to mały pierścień z czterech węgli i jednego tlenu. Szczeble to pary liter: A zawsze trzyma T, a G zawsze trzyma C.',
        'Gdy komórka się dzieli, kopiuje swoje DNA: drabina rozpina się na środku, a każda połówka buduje brakującą parę. Dotknij zamka, żeby spróbować, i dotknij szarego węgla w pierścieniu cukru, żeby zobaczyć jego cztery ręce.',
        'DNA w jednej tylko twojej komórce ma ponad 6 miliardów liter, a rozciągnięte miałoby około 2 metrów długości!',
      ],
      sci: [
        'Kwas deoksyrybonukleinowy: dwie antyrównoległe nici z deoksyrybozy (C₅H₁₀O₄) i fosforanu, połączone wiązaniami fosfodiestrowymi i zwinięte w prawoskrętną podwójną helisę o szerokości 2 nm, 0,34 nm na parę zasad i około 10,5 pary na skręt (Watson i Crick, 1953, na podstawie badań rentgenowskich Franklin, Goslinga i Wilkinsa).',
        'Zasady łączą się w pary wiązaniami wodorowymi, A z T dwoma, a G z C trzema; puryna (A, G) zawsze stoi naprzeciw pirymidyny (T, C), więc każdy szczebel ma tę samą szerokość. Każdy nukleotyd ma dziewięć albo dziesięć atomów węgla: pięć w cukrze, cztery albo pięć w zasadzie.',
        'Komórka człowieka ma dwa komplety po około 3,1 miliarda par zasad, razem około 2 m DNA. Skopiowanie ich wszystkich zajmuje komórce kilka godzin.',
      ],
    },
  },
  food: {
    label: 'Jedzenie staje się tobą',
    title: 'Od chleba do ciebie',
    signs: { glucose: 'glukoza', amino: 'aminokwasy', mito: 'mitochondrium', ribo: 'rybosom', cloud: 'twój oddech' },
    move: 'Jak mocno się ruszasz',
    moves: { rest: 'odpoczynek', walk: 'marsz', run: 'bieg' },
    perMin: '{g} g węgla na minutę',
    verbs: { bread: 'Zjedz chleb', glucose: 'Spal glukozę', amino: 'Zbuduj białko', breathe: 'Zrób wydech', slice: 'Następna kromka' },
    hints: {
      bread: 'Dotknij chleba',
      wait: 'Patrz, jak ciało go rozkłada',
      choose: 'Dotknij pierścienia glukozy albo aminokwasów',
      breathe: 'Dotknij oddechu, żeby zrobić wydech',
      slice: 'Dotknij talerza, żeby dostać następną kromkę',
    },
    says: {
      bread: {
        kid: 'Mniam! Twoje ciało rozkłada chleb: skrobię na glukozę, cukrowe pierścienie z sześcioma węglami, a białka na aminokwasy.',
        sci: 'Amylaza ze śliny i z trzustki tnie skrobię na maltozę, a enzymy jelita kończą pracę aż do glukozy; proteazy tną białka chleba, głównie gluten, na aminokwasy. Krew zanosi jedno i drugie do każdej komórki.',
      },
      glucose: {
        kid: 'Glukoza wchodzi do elektrowni komórki: do mitochondrium.',
        sci: 'Glikoliza rozkłada glukozę w cytozolu na dwa pirogroniany; mitochondria utleniają je w cyklu kwasu cytrynowego.',
      },
      burned: {
        kid: 'Jej sześć węgli wychodzi jako sześć cząsteczek dwutlenku węgla, a komórka dostaje energię, żeby cię poruszać. Dwutlenek węgla idzie do płuc i wychodzi z twoim oddechem!',
        sci: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, około 2800 kJ na mol, z czego komórka zachowuje sporą część w postaci około 30 ATP. CO₂ przechodzi do krwi i wychodzi przez płuca.',
      },
      amino: {
        kid: 'Aminokwasy idą do rybosomu, małego budowniczego komórki, który nawleka je na łańcuch.',
        sci: 'Rybosom odczytuje informacyjny RNA i łączy aminokwasy wiązaniami peptydowymi w kolejności zapisanej w genie.',
      },
      built: {
        kid: 'Nowe białko! Jego szkielet to łańcuch z węgla i azotu. Teraz ten węgiel jest częścią ciebie: mięśnia, włosa, kawałka skóry.',
        sci: 'Polipeptyd: szkielet z powtarzających się jednostek N–C–C, z łańcuchem bocznym na każdym węglu alfa. Dorosły człowiek każdego dnia tworzy i rozkłada kilkaset gramów własnych białek.',
      },
      breathe: {
        kid: 'Fuuu! Każdy wydech zabiera węgiel. Dorosły wydycha codziennie około ćwierć kilograma węgla.',
        sci: 'Dorosły wydycha dziennie około 1 kg CO₂, a 12/44 jego masy to węgiel: około ćwierć kilograma, mniej więcej tyle, ile przychodzi z jedzeniem.',
      },
      slice: { kid: 'Proszę, następna kromka.', sci: 'Następna kromka chleba.' },
      first: { kid: 'Najpierw dotknij chleba, żeby twoje ciało mogło go rozłożyć.', sci: 'Nic jeszcze nie jest strawione: zacznij od chleba.' },
      empty: { kid: 'Nie ma już glukozy: dotknij talerza, żeby dostać następną kromkę.', sci: 'Cała glukoza zużyta: najpierw następna kromka.' },
      noAmino: { kid: 'Te aminokwasy są już częścią ciebie. Dotknij pierścienia glukozy albo talerza, żeby dostać następną kromkę.', sci: 'Aminokwasy są już wbudowane; następna kromka przyniesie więcej.' },
      waiting: { kid: 'Najpierw zużyj glukozę i aminokwasy, które czekają.', sci: 'Najpierw zużyj to, co czeka: glukozę i aminokwasy.' },
    },
    panel: {
      kid: [
        'Składasz się z tego, co jesz. Chleb to głównie skrobia: długie łańcuchy glukozy, a każda glukoza ma sześć atomów węgla, pięć z nich w pierścieniu z jednym tlenem. Twoje ciało rozkłada chleb na glukozę i aminokwasy, a krew zanosi je do twoich komórek.',
        'W komórce węgiel idzie jedną z dwóch dróg. Spalony dla energii, wychodzi jako dwutlenek węgla i go wydychasz. Wbudowany w ciebie, staje się częścią nowego białka. Dotknij pierścienia glukozy albo aminokwasów, żeby wybrać. Przesuń, jak mocno się ruszasz: im bardziej się wysilasz, tym więcej węgla wydychasz.',
      ],
      sci: [
        'Biały chleb to w około dwóch piątych skrobia (amyloza i amylopektyna, łańcuchy glukozy) i w jednej dziesiątej białko. Strawione do glukozy i aminokwasów, docierają do komórek z krwią. Glukoza jest utleniana do CO₂ w glikolizie, cyklu kwasu cytrynowego i łańcuchu oddechowym (około 30 ATP na glukozę) albo magazynowana jako glikogen i tłuszcz; aminokwasy są wbudowywane w białka.',
        'W spoczynku dorosły wydycha około 0,2 l CO₂ na minutę, z około 0,1 g węgla; w marszu około cztery razy więcej, w biegu około dziesięć razy. Przez dzień to około 1 kg CO₂: węgiel, który jesz, wychodzi głównie z oddechem.',
      ],
    },
  },
}

const DE = {
  title: 'In deinem Körper',
  greet: {
    kid: 'Hallo! Ich bin der Kohlenstoff. Komm rein: Wir sind in einem Körper, und zwar in deinem. Fast ein Fünftel deines Gewichts bin ich. Hier sind das Rezept für dich, deine DNA und wie dein Essen zu dir wird. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Hallo! Ich bin der Kohlenstoff. Wir sind im Körper, geschrumpft, bis wir kleiner sind als eine Zelle. Nach Masse bestehst du zu etwa 65% aus Sauerstoff, zu 18% aus Kohlenstoff, zu 10% aus Wasserstoff und zu 3% aus Stickstoff. Drei Stationen: das Rezept, die DNA, die es trägt, und wie der Kohlenstoff aus dem Essen zu dir wird oder mit deinem Atem geht. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Zähl die Atome, statt sie zu wiegen, und der Wasserstoff gewinnt: Fast zwei von drei Atomen in dir sind Wasserstoff. Sie sind nur sehr leicht.',
      'Jedes Kohlenstoffatom in dir war einmal in der Luft, als Kohlenstoffdioxid. Eine Pflanze hat es eingefangen, und du hast die Pflanze gegessen, oder ein Tier, das Pflanzen gefressen hat.',
      'Ich kann vier Hände auf einmal halten, und ich kann anderen Kohlenstoffatomen die Hand geben. So baue ich die langen Ketten und Ringe, aus denen du bestehst.',
    ],
    sci: [
      'Nach Anzahl der Atome besteht der Körper zu etwa 62% aus Wasserstoff, 24% aus Sauerstoff, 12% aus Kohlenstoff und 1% aus Stickstoff: Wasserstoff ist das leichteste und häufigste Atom.',
      'Dein Kohlenstoff stammt aus dem Kohlenstoffdioxid der Luft, gebunden durch Photosynthese, und du atmest ihn als Kohlenstoffdioxid wieder aus: Ein Körper tauscht seinen Kohlenstoff ständig mit Nahrung und Luft aus.',
      'Kohlenstoff bildet vier kovalente Bindungen und starke C–C-Bindungen (etwa 350 kJ/mol), deshalb baut er Ketten, Verzweigungen und Ringe fast jeder Größe: das Gerüst jedes Moleküls des Lebens.',
    ],
  },
  recipe: {
    label: 'Das Rezept für dich',
    title: 'Woraus bestehst du?',
    signs: { O: 'Sauerstoff', C: 'Kohlenstoff', H: 'Wasserstoff', N: 'Stickstoff', Ca: 'Calcium', P: 'Phosphor', rest: 'der Rest' },
    kg: '{v} kg',
    weight: 'Dein Gewicht',
    where: 'Wo in dir: {el}',
    found: 'In einem Körper von {v} kg',
    hints: { jar: 'Tippe auf ein Glas, um zu sehen, wo es in dir steckt', more: 'Tippe auf ein anderes Glas oder auf die Waage' },
    says: {
      O: {
        kid: 'Sauerstoff ist der schwerste Teil von dir, denn du bestehst vor allem aus Wasser, und fast das ganze Gewicht von Wasser ist Sauerstoff. Schau: Das Wasser leuchtet überall in dir.',
        sci: 'Etwa 65% der Masse, vor allem im Wasser: Rund 60% der Masse eines Erwachsenen sind Wasser, und von 18 g Wasser sind 16 g Sauerstoff (89%). Der Rest steckt in Proteinen, Fetten, Zuckern, in der DNA und im Phosphat der Knochen.',
      },
      C: {
        kid: 'Kohlenstoff ist in jedem Teil von dir, der kein Wasser ist: in Muskeln, Haut, Haaren, Gehirn und Fett. Ich bin das Gerüst von allen!',
        sci: 'Etwa 18% der Masse, mehr in einem Körper mit mehr Fett: Fett besteht zu etwa 77% aus Kohlenstoff, Protein etwa zur Hälfte. Wasser enthält keinen, und doch ist jedes Molekül des Lebens auf einem Kohlenstoffgerüst gebaut.',
      },
      H: {
        kid: 'Wasserstoff ist in deinem Wasser und in jedem Molekül des Lebens. Er ist so leicht, dass er nur ein Zehntel deines Gewichts ausmacht, aber fast zwei von drei Atomen in dir sind Wasserstoff!',
        sci: 'Etwa 10% der Masse, aber etwa 62% aller Atome: Wasser trägt zwei H auf jedes O (11% seiner Masse), und jedes organische Molekül ist mit C–H-Bindungen bedeckt.',
      },
      N: {
        kid: 'Stickstoff steckt in jedem Protein: in deinen Muskeln, deiner Haut, deinen Haaren. Er ist auch in den Buchstaben deiner DNA.',
        sci: 'Etwa 3% der Masse: Proteine bestehen zu etwa 16% aus Stickstoff (jede Aminosäure hat eine Aminogruppe), und die vier Basen der DNA sind Ringe aus Kohlenstoff und Stickstoff.',
      },
      Ca: {
        kid: 'Calcium macht deine Knochen und Zähne hart. Fast dein ganzes Calcium steckt darin: etwa ein Kilogramm bei einem Erwachsenen!',
        sci: 'Etwa 1,5% der Masse, rund 1 kg bei einem Erwachsenen, davon 99% in Knochen und Zähnen als Hydroxylapatit, Ca₁₀(PO₄)₆(OH)₂. Das letzte 1% trägt Signale: Muskeln ziehen sich zusammen, Nerven geben Nachrichten weiter, Blut gerinnt.',
      },
      P: {
        kid: 'Phosphor ist auch in deinen Knochen, neben dem Calcium. Außerdem hält er deine DNA zusammen und trägt die Energie in jeder Zelle.',
        sci: 'Etwa 1% der Masse, davon rund 85% im Knochenmineral; der Rest steckt in jeder Zelle: im Phosphatrückgrat von DNA und RNA, im ATP und in den Phospholipiden der Zellmembranen.',
      },
      rest: {
        kid: 'Das letzte kleine Stück: Eisen in deinem Blut, das den Sauerstoff durch dich trägt; Schwefel in deinen Haaren; Salz (Natrium und Chlor) in Blut und Schweiß; Kalium in deinen Zellen.',
        sci: 'Zusammen etwa 1,5%: Kalium (vor allem in den Zellen) und Schwefel (in Cystein und Methionin; Haarkeratin ist reich daran), je einige Zehntelprozent; Natrium und Chlor (außerhalb der Zellen), je unter 0,2%; Magnesium; und Eisen, nur 3 bis 4 g, etwa zwei Drittel davon im Hämoglobin.',
      },
    },
    panel: {
      kid: [
        'Diese Gläser enthalten deinen Körper, zerlegt in seine Elemente. Jedes Glas ist genau so groß, dass der Anteil von jemandem hineinpasst, der 80 kg wiegt, also sind die größten Gläser die Elemente, von denen du am meisten hast.',
        'Schieb dein Gewicht, um zu sehen, wie viel von jedem in dir steckt. Tippe auf ein Glas, und die gläserne Figur zeigt, wo in deinem Körper dieses Element ist.',
      ],
      sci: [
        'Nach Masse: Sauerstoff etwa 65%, Kohlenstoff 18%, Wasserstoff 10%, Stickstoff 3%, Calcium 1,5%, Phosphor 1%; Kalium, Schwefel, Natrium, Chlor und Magnesium machen den Großteil des Rests aus, dazu Spuren von Eisen, Zink, Kupfer, Iod und anderen. Das Volumen jedes Glases entspricht dem Anteil seines Elements; der Schieberegler füllt sie für deine Masse.',
        'Die Zahlen sind von Mensch zu Mensch verschieden: Mehr Fett heißt mehr Kohlenstoff und Wasserstoff, mehr Wasser mehr Sauerstoff. Und ein Körper ist keine Mischung aus Elementen, sondern aus Molekülen: Der Sauerstoff steckt vor allem im Wasser, der Kohlenstoff in Proteinen, Fetten, Zuckern und Nukleinsäuren.',
      ],
    },
  },
  dna: {
    label: 'Der DNA-Reißverschluss',
    title: 'Deine DNA',
    signs: { pairs: 'Paare', zipper: 'Reißverschluss' },
    verbs: { unzip: 'Öffnen und kopieren', away: 'Kopie losschicken', carbon: 'Die vier Hände eines Kohlenstoffs' },
    hints: { unzip: 'Tippe auf den Reißverschluss, um die DNA zu öffnen', watch: 'Schau, wie jede Hälfte ihren Partner baut', away: 'Tippe auf die DNA, um die Kopie loszuschicken', carbon: 'Tippe auf einen grauen Kohlenstoff in einem Zuckerring' },
    says: {
      unzip: {
        kid: 'Rrratsch! Der Reißverschluss trennt die Buchstaben, und jede Hälfte schnappt sich neue Stücke, die vorbeischweben: A nimmt immer T, und G nimmt immer C.',
        sci: 'Die Helikase entwindet die Helix und trennt die Basenpaare; die DNA-Polymerase paart jede freie Base mit ihrer komplementären (A mit T, G mit C) und verknüpft den neuen Strang vom 5′-Ende zum 3′-Ende.',
      },
      copied: {
        kid: 'Zwei DNAs, genau gleich! Jede hat eine alte und eine neue Hälfte. So bekommt jede neue Zelle ihre eigene Kopie.',
        sci: 'Semikonservative Replikation (Meselson und Stahl, 1958): Jede Tochterhelix behält einen Elternstrang. Mit Korrekturlesen und Reparatur etwa ein Fehler auf eine Milliarde Buchstaben oder weniger.',
      },
      away: {
        kid: 'Ab geht sie, in eine neue Zelle! Die andere Kopie bleibt hier.',
        sci: 'Wenn sich die Zelle teilt, trennen sich die beiden Kopien: Jede Tochterzelle bekommt einen vollständigen Satz.',
      },
      C1: {
        kid: 'Dieser Kohlenstoff hält vier Hände: zwei im Zuckerring, eine hält einen Buchstaben der DNA und eine einen kleinen Wasserstoff.',
        sci: 'C1′: gebunden an O4′ und C2′ im Ring, an einen Stickstoff der Base (die glykosidische Bindung) und an ein Wasserstoffatom. Vier Bindungen, die zu den Ecken eines Tetraeders zeigen.',
      },
      C2: {
        kid: 'Zwei Hände im Ring und zwei kleine Wasserstoffe. In anderen Zuckern sitzt hier ein Sauerstoff: Der Zucker der DNA hat keinen, deshalb heißt er Desoxyribose, „ohne Sauerstoff“.',
        sci: 'C2′: gebunden an C1′, C3′ und zwei Wasserstoffatome. Ribose in der RNA trägt hier eine OH-Gruppe; ihr Fehlen ist das „Desoxy“ in Desoxyribonukleinsäure.',
      },
      C3: {
        kid: 'Zwei Hände im Ring, eine hält den Sauerstoff, der zum nächsten Phosphat in der Kette führt, und ein Wasserstoff.',
        sci: 'C3′: gebunden an C2′, C4′, ein Wasserstoffatom und O3′, das über ein Phosphat mit dem nächsten Nukleotid verbunden ist (seine 3′-Seite).',
      },
      C4: {
        kid: 'Zwei Hände im Ring, eine hält den Kohlenstoff gleich außerhalb des Rings, und ein Wasserstoff.',
        sci: 'C4′: gebunden an C3′, an den Ringsauerstoff O4′, an C5′ und an ein Wasserstoffatom.',
      },
      C5: {
        kid: 'Dieser Kohlenstoff sitzt gleich außerhalb des Rings: eine Hand zum Ring, eine zum Sauerstoff, der zum Phosphat führt, und zwei Wasserstoffe.',
        sci: 'C5′, außerhalb des Rings: gebunden an C4′, zwei Wasserstoffatome und O5′, das mit einem Phosphat verbunden ist (seine 5′-Seite).',
      },
    },
    panel: {
      kid: [
        'DNA ist eine sehr lange Leiter, zu einer Spirale gedreht. Ihre zwei Seiten sind Zucker und Phosphate, und jeder Zucker ist ein kleiner Ring aus vier Kohlenstoffen und einem Sauerstoff. Die Sprossen sind Buchstabenpaare: A hält immer T, und G hält immer C.',
        'Wenn sich eine Zelle teilt, kopiert sie ihre DNA: Die Leiter öffnet sich in der Mitte, und jede Hälfte baut ihren fehlenden Partner. Tippe auf den Reißverschluss, um es auszuprobieren, und tippe auf einen grauen Kohlenstoff in einem Zuckerring, um seine vier Hände zu sehen.',
        'Die DNA in nur einer deiner Zellen hat mehr als 6 Milliarden Buchstaben, und ausgestreckt wäre sie etwa 2 Meter lang!',
      ],
      sci: [
        'Desoxyribonukleinsäure: zwei antiparallele Stränge aus Desoxyribose (C₅H₁₀O₄) und Phosphat, verbunden durch Phosphodiesterbindungen und zu einer rechtsgängigen Doppelhelix gewunden, 2 nm breit, 0,34 nm pro Basenpaar und etwa 10,5 Paare pro Windung (Watson und Crick, 1953, nach den Röntgenaufnahmen von Franklin, Gosling und Wilkins).',
        'Die Basen paaren sich über Wasserstoffbrücken, A mit T über zwei und G mit C über drei; ein Purin (A, G) steht immer einem Pyrimidin (T, C) gegenüber, deshalb ist jede Sprosse gleich breit. Jedes Nukleotid trägt neun oder zehn Kohlenstoffatome: fünf im Zucker, vier oder fünf in der Base.',
        'Eine menschliche Zelle enthält zwei Sätze von je etwa 3,1 Milliarden Basenpaaren, rund 2 m DNA. Sie alle zu kopieren, dauert für die Zelle mehrere Stunden.',
      ],
    },
  },
  food: {
    label: 'Dein Essen wird zu dir',
    title: 'Vom Brot zu dir',
    signs: { glucose: 'Glucose', amino: 'Aminosäuren', mito: 'Mitochondrium', ribo: 'Ribosom', cloud: 'dein Atem' },
    move: 'Wie sehr du dich bewegst',
    moves: { rest: 'in Ruhe', walk: 'beim Gehen', run: 'beim Laufen' },
    perMin: '{g} g Kohlenstoff pro Minute',
    verbs: { bread: 'Das Brot essen', glucose: 'Eine Glucose verbrennen', amino: 'Ein Protein bauen', breathe: 'Ausatmen', slice: 'Noch eine Scheibe' },
    hints: {
      bread: 'Tippe auf das Brot',
      wait: 'Schau, wie dein Körper es zerlegt',
      choose: 'Tippe auf einen Glucosering oder auf die Aminosäuren',
      breathe: 'Tippe auf deinen Atem, um auszuatmen',
      slice: 'Tippe auf den Teller für noch eine Scheibe',
    },
    says: {
      bread: {
        kid: 'Mampf! Dein Körper zerlegt das Brot: die Stärke in Glucose, Zuckerringe mit sechs Kohlenstoffen, und die Proteine in Aminosäuren.',
        sci: 'Amylase aus Speichel und Bauchspeicheldrüse zerschneidet Stärke in Maltose, Enzyme des Darms machen daraus Glucose; Proteasen zerlegen die Proteine des Brots, vor allem Gluten, in Aminosäuren. Das Blut bringt beides zu jeder Zelle.',
      },
      glucose: {
        kid: 'Rein mit der Glucose, ins Kraftwerk der Zelle: das Mitochondrium.',
        sci: 'Die Glykolyse spaltet Glucose im Cytosol in zwei Pyruvate; die Mitochondrien oxidieren sie im Citratzyklus.',
      },
      burned: {
        kid: 'Ihre sechs Kohlenstoffe gehen als sechs Kohlenstoffdioxid-Moleküle, und die Zelle bekommt die Energie, um dich zu bewegen. Das Kohlenstoffdioxid geht zu deiner Lunge und mit deinem Atem hinaus!',
        sci: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, etwa 2800 kJ pro Mol, von denen die Zelle einen guten Teil in rund 30 ATP festhält. Das CO₂ geht ins Blut und verlässt den Körper über die Lunge.',
      },
      amino: {
        kid: 'Die Aminosäuren gehen zum Ribosom, dem kleinen Baumeister der Zelle, der sie zu einer Kette auffädelt.',
        sci: 'Das Ribosom liest eine Boten-RNA und verknüpft die Aminosäuren durch Peptidbindungen in der Reihenfolge, die das Gen vorgibt.',
      },
      built: {
        kid: 'Ein neues Protein! Sein Rückgrat ist eine Kette aus Kohlenstoff und Stickstoff. Jetzt ist dieser Kohlenstoff ein Teil von dir: ein Muskel, ein Haar, ein Stückchen Haut.',
        sci: 'Ein Polypeptid: ein Rückgrat aus N–C–C-Einheiten, mit einer Seitenkette an jedem Alpha-Kohlenstoff. Ein Erwachsener baut jeden Tag einige hundert Gramm seiner eigenen Proteine auf und ab.',
      },
      breathe: {
        kid: 'Fuuu! Jeder Atemzug trägt Kohlenstoff hinaus. Ein Erwachsener atmet jeden Tag etwa ein Viertelkilo Kohlenstoff aus.',
        sci: 'Ein Erwachsener atmet pro Tag etwa 1 kg CO₂ aus, und 12/44 seiner Masse sind Kohlenstoff: etwa ein Viertelkilogramm, ungefähr so viel, wie mit der Nahrung hereinkommt.',
      },
      slice: { kid: 'Hier ist noch eine Scheibe.', sci: 'Noch eine Scheibe Brot.' },
      first: { kid: 'Tippe zuerst auf das Brot, damit dein Körper es zerlegen kann.', sci: 'Noch nichts verdaut: Fang mit dem Brot an.' },
      empty: { kid: 'Keine Glucose mehr: Tippe auf den Teller für noch eine Scheibe.', sci: 'Die ganze Glucose ist verbraucht: zuerst noch eine Scheibe.' },
      noAmino: { kid: 'Diese Aminosäuren sind schon ein Teil von dir. Tippe auf einen Glucosering oder auf den Teller für noch eine Scheibe.', sci: 'Die Aminosäuren sind eingebaut; noch eine Scheibe bringt neue.' },
      waiting: { kid: 'Nimm zuerst die Glucose und die Aminosäuren, die schon warten.', sci: 'Zuerst das verbrauchen, was wartet: Glucose und Aminosäuren.' },
    },
    panel: {
      kid: [
        'Du bestehst aus dem, was du isst. Brot ist vor allem Stärke: lange Ketten aus Glucose, und jede Glucose hat sechs Kohlenstoffatome, fünf davon in einem Ring mit einem Sauerstoff. Dein Körper zerlegt das Brot in Glucose und Aminosäuren, und dein Blut bringt sie zu deinen Zellen.',
        'In einer Zelle geht der Kohlenstoff einen von zwei Wegen. Für Energie verbrannt, verlässt er dich als Kohlenstoffdioxid, und du atmest ihn aus. In dich eingebaut, wird er Teil eines neuen Proteins. Tippe auf einen Glucosering oder auf die Aminosäuren, um zu wählen. Schieb, wie sehr du dich bewegst: Je mehr du dich anstrengst, desto mehr Kohlenstoff atmest du aus.',
      ],
      sci: [
        'Weißbrot besteht zu etwa zwei Fünfteln aus Stärke (Amylose und Amylopektin, Ketten aus Glucose) und zu einem Zehntel aus Protein. Verdaut zu Glucose und Aminosäuren, erreichen sie die Zellen über das Blut. Glucose wird durch Glykolyse, Citratzyklus und Atmungskette zu CO₂ oxidiert (etwa 30 ATP pro Glucose) oder als Glykogen und Fett gespeichert; Aminosäuren werden in Proteine eingebaut.',
        'In Ruhe atmet ein Erwachsener pro Minute etwa 0,2 L CO₂ aus, mit etwa 0,1 g Kohlenstoff; beim Gehen etwa viermal so viel, beim Laufen etwa zehnmal. Über einen Tag sind das etwa 1 kg CO₂: Der Kohlenstoff, den du isst, verlässt dich vor allem mit dem Atem.',
      ],
    },
  },
}

export const YOU_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
