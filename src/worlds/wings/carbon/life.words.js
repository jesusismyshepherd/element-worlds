// Every word of the life wing (the garden), in English, European Portuguese, Polish and German, kid
// (Explorer) and sci (Scientist). Signs and labels are 3D text (Latin letters with the Polish and German
// ones, no subscripts); panels and speech are HTML (any character). No em dashes. Prompts read
// "verb: label", so a label takes the case its verb needs.

const groupEN = n => n.toLocaleString('en-GB')
// Portuguese, Polish and German: a space between thousands from 10 000 up (5730, 11 460)
const groupPT = n => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n))
// Polish verbs agree with the number: został 1, zostały 2 to 4 (22 to 24...), zostało 5 and up
const plLeft = n => ({ one: 'Został', few: 'Zostały' })[new Intl.PluralRules('pl').select(n)] ?? 'Zostało'

const EN = {
  back: 'Back to the atrium',
  kicker: 'The carbon of life',
  decimal: '.',
  talkTo: 'Talk to',
  fmt: groupEN,
  years: 'years',
  greeting: {
    kid: "Welcome to my garden! Everything alive in here is built on carbon: the tree, the grass and you too. Let's find out how!",
    sci: 'The carbon of life: photosynthesis, the chains and rings of organic chemistry, carbon-14 dating and the global carbon cycle.',
  },
  light: 'light',
  el: { O: 'Oxygen', C: 'Carbon', H: 'Hydrogen', N: 'Nitrogen', Ca: 'Calcium', P: 'Phosphorus', other: 'Others' },
  personTitle: 'You are 18% carbon',
  boneTag: "Mammoth thigh bone: 1/16 of a living animal's carbon-14",
  tuskTag: 'Mammoth tusk: ivory, a giant tooth',
  jarLabel: 'carbon-14 left',
  cycle: {
    kid: { air: 'Air', plants: 'Plants', animals: 'Animals', ocean: 'Ocean', soil: 'Soil', fossil: 'Coal, oil and gas', fire: 'Burning' },
    sci: {
      air: 'Air: about 900 Gt C', plants: 'Plants: about 450 Gt C', animals: 'Animals: about 2 Gt C', ocean: 'Ocean: about 38 000 Gt C',
      soil: 'Soil: about 1700 Gt C', fossil: 'Fossil fuels: about 1000 Gt C', fire: 'Burning: about 10 Gt C a year',
    },
  },
  say: {
    night: 'Night: no light, no photosynthesis. The tree only breathes out a little CO₂, as you do.',
    day: 'Day again: the leaves take in CO₂ and give out O₂.',
    c14: (h, years, left) => [
      'A living thing again: all its carbon-14. Wind the clock on!',
      `${years} years: half of the carbon-14 has turned into nitrogen. ${left} of 64 left.`,
      `${years} years: a quarter is left.`,
      `${years} years: an eighth is left.`,
      `${years} years: 1/16 left, like the mammoth's bone! It died about 23 000 years ago.`,
      `${years} years: 1/32 left.`,
      `${years} years: 1/64 left. Just one atom of our 64.`,
      `${years} years: 1/128 left. A real sample still has some, but they are very hard to count.`,
      `${years} years: 1/256 left. After about 50 000 years too little is left to measure.`,
    ][h],
  },
  verbs: { night: 'Make it night', day: 'Make it day' },
  ex: {
    tree: {
      label: 'the breathing tree', verb: 'Look at',
      sign: { title: 'The breathing tree', kid: 'In sunlight it breathes in carbon dioxide and gives out oxygen.', sci: 'Photosynthesis: carbon dioxide and water, with light, make glucose and oxygen.' },
      panel: {
        title: 'The breathing tree',
        kid: [
          { p: 'Trees are made mostly of carbon, and they take it from the air! In sunlight their leaves breathe in carbon dioxide (CO₂) and use the energy of the light to join it with water into sugar. The oxygen (O₂) left over goes out into the air: the oxygen you breathe.' },
          { big: 'CO₂ in, O₂ out', small: 'while the sun shines' },
          { p: "Almost all the carbon in a tree's wood came out of the air. Turn the dial to night and see what changes." },
        ],
        sci: [
          { big: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', small: 'photosynthesis, driven by light (ΔG ≈ +2870 kJ per mole of glucose)' },
          { rows: [
            ['Where', 'chloroplasts: chlorophyll absorbs mainly red and blue light'],
            ['Carbon fixation', 'the enzyme RuBisCO adds CO₂ to a five-carbon sugar (the Calvin cycle)'],
            ['The oxygen', 'comes from the water, not from the CO₂ (shown with oxygen-18 in 1941)'],
            ['Scale', 'land plants fix more than 100 billion tonnes of carbon a year'],
          ] },
          { p: 'At night photosynthesis stops, but the tree keeps respiring, as you do: it takes in a little O₂ and gives out CO₂. Over a whole year a growing tree takes in much more CO₂ than it gives out.' },
        ],
      },
    },
    night: {
      label: 'day and night',
      sign: { title: 'Day and night', kid: 'Turn the dial: no light, no photosynthesis.', sci: 'In the dark only respiration goes on.' },
    },
    body: {
      label: 'the carbon in you', verb: 'Fill',
      sign: { title: 'You are 18% carbon', kid: 'What your body is made of, by mass.', sci: 'By mass: O 65, C 18, H 10, N 3, Ca 1.5, P 1 (per cent).' },
      panel: {
        title: 'You are 18% carbon',
        kid: [
          { p: 'Your body is mostly water, so oxygen is the heaviest part of you. But almost a fifth of you is carbon: it is the backbone of your muscles, your skin, your hair and even your DNA.' },
          { big: '18%', small: 'of your mass is carbon' },
          { rows: [['Oxygen', '65%'], ['Carbon', '18%'], ['Hydrogen', '10%'], ['Nitrogen', '3%'], ['Calcium', '1.5%'], ['Phosphorus', '1%'], ['Others', '1.5%']] },
          { p: 'A child of 35 kg holds about 6 kg of carbon: enough for thousands of pencil leads!' },
        ],
        sci: [
          { rows: [['O, oxygen', '65%'], ['C, carbon', '18%'], ['H, hydrogen', '10%'], ['N, nitrogen', '3%'], ['Ca, calcium', '1.5%'], ['P, phosphorus', '1%'], ['others (K, S, Na, Cl, Mg…)', '1.5%']] },
          { p: 'By number of atoms the order changes: hydrogen 62%, oxygen 24%, carbon 12%, nitrogen 1%. Hydrogen atoms are so light that 62% of the atoms make only 10% of the mass.' },
          { p: 'Carbon is in every protein, fat, carbohydrate and nucleic acid: about 13 kg in a 70 kg adult. The figure is filled by volume in these proportions.' },
        ],
      },
    },
    c14: {
      label: 'the carbon-14 clock', verb: 'Wind on 5730 years',
      sign: { title: 'Carbon-14 dating', kid: 'Half of the carbon-14 is gone every 5730 years.', sci: 'Half-life 5730 years; beta decay to nitrogen-14; dates up to about 50 000 years.' },
      panel: {
        title: 'Carbon-14 dating',
        kid: [
          { p: 'All living things take in carbon, and a tiny part of it is radioactive carbon-14. When a plant or an animal dies, it stops taking it in, and its carbon-14 slowly turns into nitrogen. Every 5730 years, half of what is left is gone.' },
          { big: 'about 23 000 years', small: 'this mammoth bone has 1/16 of the carbon-14 of a living animal: 4 halvings' },
          { p: "After about 50 000 years too little is left to measure. That's why carbon dating can't date dinosaurs: they died out 66 million years ago! Rocks are dated with other radioactive clocks, like uranium-lead." },
        ],
        sci: [
          { rows: [
            ['Half-life', '5730 ± 40 years'],
            ['Decay', '¹⁴C → ¹⁴N + e⁻ + ν̄ₑ (beta minus)'],
            ['Made', 'in the upper atmosphere: cosmic-ray neutrons hit nitrogen-14 (n + ¹⁴N → ¹⁴C + p)'],
            ['How much', 'about 1 atom in 10¹² of the carbon in living things'],
            ['Range', 'up to about 50 000 years'],
            ['Method', 'Willard Libby, 1949 (Nobel Prize in Chemistry 1960)'],
          ] },
          { p: 'Age = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) years. Raw ages are calibrated with tree rings, corals and cave formations, because the amount of ¹⁴C in the air has varied; the bomb tests of the 1950s and 1960s nearly doubled it.' },
        ],
      },
    },
    cycle: {
      label: 'the carbon cycle', verb: 'Look at',
      sign: { title: 'The carbon cycle', kid: 'Carbon goes round and round: air, plants, animals, soil.', sci: 'Stores in gigatonnes of carbon (Gt C); flows in Gt C a year.' },
      panel: {
        title: 'The carbon cycle',
        kid: [
          { p: 'The carbon in you was once in the air, then in a plant, maybe even in a dinosaur. Carbon atoms travel round and round:' },
          { list: [
            'Plants take carbon dioxide from the air to grow.',
            'Animals eat plants (and other animals) and take the carbon in.',
            'Plants and animals breathe carbon dioxide back out.',
            'When they die, tiny living things in the soil break them down.',
            'Over millions of years, some of it became coal, oil and gas.',
            'Burning them puts that old carbon back into the air very fast.',
          ] },
          { big: '280 → 420', small: 'parts per million of CO₂ in the air: before factories, and now' },
        ],
        sci: [
          { rows: [
            ['Air', 'about 900 Gt C (CO₂ above 420 ppm; about 280 ppm before 1750)'],
            ['Photosynthesis on land', 'more than 100 Gt C a year; respiration and decay return about as much'],
            ['Ocean', 'exchanges about 80 Gt C a year each way, and takes up about 3 Gt C a year more than it gives back'],
            ['Fossil fuels and cement', 'about 10 Gt C a year'],
            ['Stores', 'soils about 1700 Gt C, plants about 450, fossil fuel reserves about 1000, ocean about 38 000'],
          ] },
          { p: 'The 10 Gt a year from burning is small next to the natural flows, but the natural flows nearly balance and this one does not: about half of it stays in the air, so the CO₂ keeps rising.' },
        ],
      },
    },
    methane: {
      name: 'Methane', formula: 'CH4', label: 'methane', verb: 'Look at',
      panel: {
        title: 'Methane, CH₄',
        kid: [
          { p: 'The simplest molecule of carbon and hydrogen: one carbon holding four hydrogens, pointing to the corners of a tetrahedron.' },
          { big: 'CH₄', small: 'natural gas' },
          { p: 'It is the gas of the kitchen stove, and cows burp lots of it.' },
        ],
        sci: [
          { rows: [['Shape', 'tetrahedral, H–C–H 109.5°, C–H 1.09 Å'], ['Where', 'natural gas, wetlands, cattle, rice fields'], ['Greenhouse gas', 'about 80 times more warming than CO₂ over 20 years (about 28 times over 100 years)']] },
        ],
      },
    },
    ethane: {
      name: 'Ethane', formula: 'C2H6', label: 'ethane', verb: 'Look at',
      panel: {
        title: 'Ethane, C₂H₆',
        kid: [
          { p: 'Two carbons hold hands: that is the start of a chain. Carbon chains can be thousands of atoms long, in fats, plastics and oil.' },
          { big: 'C₂H₆', small: 'two carbons in a chain' },
        ],
        sci: [
          { rows: [['Bond', 'C–C single, 1.53 Å; the two ends turn freely about it'], ['Family', 'the alkanes, CₙH₂ₙ₊₂: methane, ethane, propane, butane and so on'], ['Shown', 'the staggered conformation']] },
        ],
      },
    },
    ethanol: {
      name: 'Ethanol', formula: 'C2H5OH', label: 'ethanol', verb: 'Look at',
      panel: {
        title: 'Ethanol, C₂H₅OH',
        kid: [
          { p: 'A short chain with an OH group at its end: an alcohol. Yeast makes it from sugar, and it is used as a fuel and in hand sanitiser.' },
          { big: 'C₂H₅OH', small: 'two carbons, one OH' },
        ],
        sci: [
          { rows: [['Made by', 'fermentation: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ (yeast)'], ['Boils at', '78 °C'], ['Group', 'the hydroxyl group, –OH, lets it mix with water (hydrogen bonds)']] },
        ],
      },
    },
    benzene: {
      name: 'Benzene', formula: 'C6H6', label: 'benzene', verb: 'Look at',
      panel: {
        title: 'Benzene, C₆H₆',
        kid: [
          { p: 'Six carbons joined in a ring. Carbon makes chains and rings, and with them it builds medicines, dyes and the molecules of life.' },
          { big: 'C₆H₆', small: 'a ring of six carbons' },
        ],
        sci: [
          { rows: [['Shape', 'a flat hexagon, all six C–C bonds 1.39 Å (between single, 1.54, and double, 1.34)'], ['Why', 'six π electrons shared round the ring (aromaticity)'], ['History', 'Kekulé proposed the ring in 1865; he said the idea came to him in a daydream of a snake biting its own tail']] },
          { p: 'The model shows one of the two Kekulé structures, with single and double bonds taking turns; the real molecule is the average of the two.' },
        ],
      },
    },
    glucose: {
      name: 'Glucose', formula: 'C6H12O6', label: 'glucose', verb: 'Look at',
      panel: {
        title: 'Glucose, C₆H₁₂O₆',
        kid: [
          { p: 'The sugar plants make with sunlight. Your cells burn it for energy: it is the fuel of your muscles and your brain.' },
          { big: 'C₆H₁₂O₆', small: 'a ring of five carbons and one oxygen' },
        ],
        sci: [
          { rows: [['Shown', 'β-D-glucopyranose in its chair shape: every OH group, and the CH₂OH, points outward (the most stable form)'], ['Energy', 'about 2800 kJ per mole when burned: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O'], ['Your brain', 'uses about 120 g of glucose a day']] },
        ],
      },
    },
  },
  molSign: { title: 'Chains and rings', kid: 'Carbon holds four hands, so it builds chains and rings.', sci: 'Five molecules, real bond lengths and angles.' },
}

const PT = {
  back: 'Voltar ao átrio',
  kicker: 'O carbono da vida',
  decimal: ',',
  talkTo: 'Falar com',
  fmt: groupPT,
  years: 'anos',
  greeting: {
    kid: 'Bem-vindo ao meu jardim! Tudo o que aqui está vivo é feito de carbono: a árvore, a relva e tu também. Vamos descobrir como!',
    sci: 'O carbono da vida: a fotossíntese, as cadeias e os anéis da química orgânica, a datação por carbono-14 e o ciclo global do carbono.',
  },
  light: 'luz',
  el: { O: 'Oxigénio', C: 'Carbono', H: 'Hidrogénio', N: 'Azoto', Ca: 'Cálcio', P: 'Fósforo', other: 'Outros' },
  personTitle: 'És 18% carbono',
  boneTag: 'Fémur de mamute: 1/16 do carbono-14 de um animal vivo',
  tuskTag: 'Presa de mamute: marfim, um dente gigante',
  jarLabel: 'carbono-14 que resta',
  cycle: {
    kid: { air: 'Ar', plants: 'Plantas', animals: 'Animais', ocean: 'Oceano', soil: 'Solo', fossil: 'Carvão, petróleo e gás', fire: 'Queima' },
    sci: {
      air: 'Ar: cerca de 900 Gt C', plants: 'Plantas: cerca de 450 Gt C', animals: 'Animais: cerca de 2 Gt C', ocean: 'Oceano: cerca de 38 000 Gt C',
      soil: 'Solo: cerca de 1700 Gt C', fossil: 'Combustíveis fósseis: cerca de 1000 Gt C', fire: 'Queima: cerca de 10 Gt C por ano',
    },
  },
  say: {
    night: 'Noite: sem luz, não há fotossíntese. A árvore só expira um pouco de CO₂, como tu.',
    day: 'Outra vez dia: as folhas absorvem CO₂ e libertam O₂.',
    c14: (h, years, left) => [
      'Outra vez um ser vivo: com todo o seu carbono-14. Faz avançar o relógio!',
      `${years} anos: metade do carbono-14 transformou-se em azoto. Restam ${left} de 64.`,
      `${years} anos: resta um quarto.`,
      `${years} anos: resta um oitavo.`,
      `${years} anos: resta 1/16, como no osso de mamute! Morreu há cerca de 23 000 anos.`,
      `${years} anos: resta 1/32.`,
      `${years} anos: resta 1/64. Só um átomo dos nossos 64.`,
      `${years} anos: resta 1/128. Uma amostra verdadeira ainda tem alguns, mas é muito difícil contá-los.`,
      `${years} anos: resta 1/256. Ao fim de cerca de 50 000 anos já resta pouco demais para medir.`,
    ][h],
  },
  verbs: { night: 'Fazer noite', day: 'Fazer dia' },
  ex: {
    tree: {
      label: 'a árvore que respira', verb: 'Ver',
      sign: { title: 'A árvore que respira', kid: 'Com a luz do Sol, inspira dióxido de carbono e expira oxigénio.', sci: 'Fotossíntese: dióxido de carbono e água, com luz, dão glucose e oxigénio.' },
      panel: {
        title: 'A árvore que respira',
        kid: [
          { p: 'As árvores são feitas sobretudo de carbono, e tiram-no do ar! Com a luz do Sol, as folhas inspiram dióxido de carbono (CO₂) e usam a energia da luz para o juntar à água e fazer açúcar. O oxigénio (O₂) que sobra sai para o ar: é o oxigénio que tu respiras.' },
          { big: 'Entra CO₂, sai O₂', small: 'enquanto o Sol brilha' },
          { p: 'Quase todo o carbono da madeira de uma árvore veio do ar. Roda o mostrador para a noite e vê o que muda.' },
        ],
        sci: [
          { big: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', small: 'fotossíntese, movida pela luz (ΔG ≈ +2870 kJ por mole de glucose)' },
          { rows: [
            ['Onde', 'cloroplastos: a clorofila absorve sobretudo luz vermelha e azul'],
            ['Fixação do carbono', 'a enzima RuBisCO junta o CO₂ a um açúcar de cinco carbonos (o ciclo de Calvin)'],
            ['O oxigénio', 'vem da água, não do CO₂ (demonstrado com oxigénio-18 em 1941)'],
            ['Escala', 'as plantas terrestres fixam mais de 100 mil milhões de toneladas de carbono por ano'],
          ] },
          { p: 'À noite a fotossíntese para, mas a árvore continua a respirar, como tu: absorve um pouco de O₂ e liberta CO₂. Ao longo de um ano, uma árvore em crescimento absorve muito mais CO₂ do que liberta.' },
        ],
      },
    },
    night: {
      label: 'o dia e a noite',
      sign: { title: 'Dia e noite', kid: 'Roda o mostrador: sem luz, não há fotossíntese.', sci: 'No escuro só continua a respiração.' },
    },
    body: {
      label: 'o carbono que há em ti', verb: 'Encher',
      sign: { title: 'És 18% carbono', kid: 'De que é feito o teu corpo, em massa.', sci: 'Em massa: O 65, C 18, H 10, N 3, Ca 1,5, P 1 (por cento).' },
      panel: {
        title: 'És 18% carbono',
        kid: [
          { p: 'O teu corpo é sobretudo água, por isso o oxigénio é a parte mais pesada de ti. Mas quase um quinto de ti é carbono: é o esqueleto dos teus músculos, da tua pele, do teu cabelo e até do teu ADN.' },
          { big: '18%', small: 'da tua massa é carbono' },
          { rows: [['Oxigénio', '65%'], ['Carbono', '18%'], ['Hidrogénio', '10%'], ['Azoto', '3%'], ['Cálcio', '1,5%'], ['Fósforo', '1%'], ['Outros', '1,5%']] },
          { p: 'Uma criança de 35 kg tem cerca de 6 kg de carbono: dava para milhares de minas de lápis!' },
        ],
        sci: [
          { rows: [['O, oxigénio', '65%'], ['C, carbono', '18%'], ['H, hidrogénio', '10%'], ['N, azoto', '3%'], ['Ca, cálcio', '1,5%'], ['P, fósforo', '1%'], ['outros (K, S, Na, Cl, Mg…)', '1,5%']] },
          { p: 'Em número de átomos a ordem muda: hidrogénio 62%, oxigénio 24%, carbono 12%, azoto 1%. Os átomos de hidrogénio são tão leves que 62% dos átomos fazem só 10% da massa.' },
          { p: 'O carbono está em todas as proteínas, gorduras, hidratos de carbono e ácidos nucleicos: cerca de 13 kg num adulto de 70 kg. A figura está cheia, em volume, nestas proporções.' },
        ],
      },
    },
    c14: {
      label: 'o relógio do carbono-14', verb: 'Avançar 5730 anos',
      sign: { title: 'Datação por carbono-14', kid: 'A cada 5730 anos desaparece metade do carbono-14.', sci: 'Meia-vida de 5730 anos; decaimento beta para azoto-14; data até cerca de 50 000 anos.' },
      panel: {
        title: 'Datação por carbono-14',
        kid: [
          { p: 'Todos os seres vivos absorvem carbono, e uma pequena parte dele é carbono-14, radioativo. Quando uma planta ou um animal morre, deixa de o absorver, e o seu carbono-14 vai-se transformando em azoto. A cada 5730 anos, desaparece metade do que resta.' },
          { big: 'cerca de 23 000 anos', small: 'este osso de mamute tem 1/16 do carbono-14 de um animal vivo: 4 metades' },
          { p: 'Ao fim de cerca de 50 000 anos já resta muito pouco para medir. É por isso que o carbono-14 não serve para datar dinossauros: extinguiram-se há 66 milhões de anos! As rochas datam-se com outros relógios radioativos, como o urânio-chumbo.' },
        ],
        sci: [
          { rows: [
            ['Meia-vida', '5730 ± 40 anos'],
            ['Decaimento', '¹⁴C → ¹⁴N + e⁻ + ν̄ₑ (beta menos)'],
            ['Origem', 'na alta atmosfera: neutrões dos raios cósmicos atingem o azoto-14 (n + ¹⁴N → ¹⁴C + p)'],
            ['Quantidade', 'cerca de 1 átomo em 10¹² do carbono dos seres vivos'],
            ['Alcance', 'até cerca de 50 000 anos'],
            ['Método', 'Willard Libby, 1949 (Prémio Nobel da Química 1960)'],
          ] },
          { p: 'Idade = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) anos. As idades em bruto são calibradas com anéis de árvores, corais e espeleotemas, porque a quantidade de ¹⁴C no ar variou; os ensaios nucleares dos anos 1950 e 1960 quase a duplicaram.' },
        ],
      },
    },
    cycle: {
      label: 'o ciclo do carbono', verb: 'Ver',
      sign: { title: 'O ciclo do carbono', kid: 'O carbono anda à roda: ar, plantas, animais, solo.', sci: 'Reservatórios em gigatoneladas de carbono (Gt C); fluxos em Gt C por ano.' },
      panel: {
        title: 'O ciclo do carbono',
        kid: [
          { p: 'O carbono que há em ti já esteve no ar, depois numa planta, talvez até num dinossauro. Os átomos de carbono andam à roda:' },
          { list: [
            'As plantas tiram dióxido de carbono do ar para crescer.',
            'Os animais comem plantas (e outros animais) e ficam com o carbono.',
            'Plantas e animais expiram dióxido de carbono de volta para o ar.',
            'Quando morrem, pequenos seres vivos do solo decompõem-nos.',
            'Ao longo de milhões de anos, parte disso transformou-se em carvão, petróleo e gás.',
            'Queimá-los devolve muito depressa esse carbono antigo ao ar.',
          ] },
          { big: '280 → 420', small: 'partes por milhão de CO₂ no ar: antes das fábricas e agora' },
        ],
        sci: [
          { rows: [
            ['Ar', 'cerca de 900 Gt C (CO₂ acima de 420 ppm; cerca de 280 ppm antes de 1750)'],
            ['Fotossíntese em terra', 'mais de 100 Gt C por ano; a respiração e a decomposição devolvem quase o mesmo'],
            ['Oceano', 'troca cerca de 80 Gt C por ano em cada sentido e absorve cerca de 3 Gt C por ano a mais do que devolve'],
            ['Combustíveis fósseis e cimento', 'cerca de 10 Gt C por ano'],
            ['Reservatórios', 'solos cerca de 1700 Gt C, plantas cerca de 450, reservas de combustíveis fósseis cerca de 1000, oceano cerca de 38 000'],
          ] },
          { p: 'As 10 Gt por ano da queima são pouco ao lado dos fluxos naturais, mas os fluxos naturais quase se equilibram e este não: cerca de metade fica no ar, e por isso o CO₂ continua a subir.' },
        ],
      },
    },
    methane: {
      name: 'Metano', formula: 'CH4', label: 'o metano', verb: 'Ver',
      panel: {
        title: 'Metano, CH₄',
        kid: [
          { p: 'A molécula mais simples de carbono e hidrogénio: um carbono a segurar quatro hidrogénios, virados para os cantos de um tetraedro.' },
          { big: 'CH₄', small: 'gás natural' },
          { p: 'É o gás do fogão, e as vacas arrotam muito metano.' },
        ],
        sci: [
          { rows: [['Forma', 'tetraédrica, H–C–H 109,5°, C–H 1,09 Å'], ['Onde', 'gás natural, zonas húmidas, gado, arrozais'], ['Gás com efeito de estufa', 'cerca de 80 vezes mais aquecimento do que o CO₂ em 20 anos (cerca de 28 vezes em 100 anos)']] },
        ],
      },
    },
    ethane: {
      name: 'Etano', formula: 'C2H6', label: 'o etano', verb: 'Ver',
      panel: {
        title: 'Etano, C₂H₆',
        kid: [
          { p: 'Dois carbonos dão as mãos: é o início de uma cadeia. As cadeias de carbono podem ter milhares de átomos, nas gorduras, nos plásticos e no petróleo.' },
          { big: 'C₂H₆', small: 'dois carbonos em cadeia' },
        ],
        sci: [
          { rows: [['Ligação', 'C–C simples, 1,53 Å; as duas pontas rodam livremente em torno dela'], ['Família', 'os alcanos, CₙH₂ₙ₊₂: metano, etano, propano, butano e por aí fora'], ['Aqui', 'a conformação alternada']] },
        ],
      },
    },
    ethanol: {
      name: 'Etanol', formula: 'C2H5OH', label: 'o etanol', verb: 'Ver',
      panel: {
        title: 'Etanol, C₂H₅OH',
        kid: [
          { p: 'Uma cadeia curta com um grupo OH na ponta: um álcool. As leveduras fazem-no a partir do açúcar, e usa-se como combustível e no gel desinfetante.' },
          { big: 'C₂H₅OH', small: 'dois carbonos, um OH' },
        ],
        sci: [
          { rows: [['Feito por', 'fermentação: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ (leveduras)'], ['Ferve a', '78 °C'], ['Grupo', 'o grupo hidroxilo, –OH, deixa-o misturar-se com a água (ligações de hidrogénio)']] },
        ],
      },
    },
    benzene: {
      name: 'Benzeno', formula: 'C6H6', label: 'o benzeno', verb: 'Ver',
      panel: {
        title: 'Benzeno, C₆H₆',
        kid: [
          { p: 'Seis carbonos ligados num anel. O carbono faz cadeias e anéis, e com eles constrói medicamentos, corantes e as moléculas da vida.' },
          { big: 'C₆H₆', small: 'um anel de seis carbonos' },
        ],
        sci: [
          { rows: [['Forma', 'um hexágono plano, as seis ligações C–C com 1,39 Å (entre a simples, 1,54, e a dupla, 1,34)'], ['Porquê', 'seis eletrões π partilhados à volta do anel (aromaticidade)'], ['História', 'Kekulé propôs o anel em 1865; contou que a ideia lhe veio num devaneio com uma cobra a morder a própria cauda']] },
          { p: 'O modelo mostra uma das duas estruturas de Kekulé, com ligações simples e duplas alternadas; a molécula real é a média das duas.' },
        ],
      },
    },
    glucose: {
      name: 'Glucose', formula: 'C6H12O6', label: 'a glucose', verb: 'Ver',
      panel: {
        title: 'Glucose, C₆H₁₂O₆',
        kid: [
          { p: 'O açúcar que as plantas fazem com a luz do Sol. As tuas células queimam-no para ter energia: é o combustível dos teus músculos e do teu cérebro.' },
          { big: 'C₆H₁₂O₆', small: 'um anel de cinco carbonos e um oxigénio' },
        ],
        sci: [
          { rows: [['Aqui', 'β-D-glucopiranose na forma de cadeira: todos os grupos OH, e o CH₂OH, apontam para fora (a forma mais estável)'], ['Energia', 'cerca de 2800 kJ por mole ao ser queimada: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O'], ['O teu cérebro', 'gasta cerca de 120 g de glucose por dia']] },
        ],
      },
    },
  },
  molSign: { title: 'Cadeias e anéis', kid: 'O carbono tem quatro mãos, por isso faz cadeias e anéis.', sci: 'Cinco moléculas, com comprimentos e ângulos de ligação reais.' },
}

const PL = {
  back: 'Powrót do sali: Węgiel',
  kicker: 'Węgiel życia',
  decimal: ',',
  talkTo: 'Porozmawiaj',
  fmt: groupPT,
  years: 'lat',
  greeting: {
    kid: 'Witaj w moim ogrodzie! Wszystko, co tu żyje, jest zbudowane z węgla: drzewo, trawa i ty też. Sprawdźmy, jak to możliwe!',
    sci: 'Węgiel życia: fotosynteza, łańcuchy i pierścienie chemii organicznej, datowanie węglem-14 i globalny obieg węgla.',
  },
  light: 'światło',
  el: { O: 'Tlen', C: 'Węgiel', H: 'Wodór', N: 'Azot', Ca: 'Wapń', P: 'Fosfor', other: 'Inne' },
  personTitle: 'W 18% jesteś węglem',
  boneTag: 'Kość udowa mamuta: 1/16 węgla-14 żywego zwierzęcia',
  tuskTag: 'Cios mamuta: kość słoniowa, olbrzymi ząb',
  jarLabel: 'zostało węgla-14',
  cycle: {
    kid: { air: 'Powietrze', plants: 'Rośliny', animals: 'Zwierzęta', ocean: 'Ocean', soil: 'Gleba', fossil: 'Węgiel kamienny, ropa i gaz', fire: 'Spalanie' },
    sci: {
      air: 'Powietrze: ok. 900 Gt C', plants: 'Rośliny: ok. 450 Gt C', animals: 'Zwierzęta: ok. 2 Gt C', ocean: 'Ocean: ok. 38 000 Gt C',
      soil: 'Gleba: ok. 1700 Gt C', fossil: 'Paliwa kopalne: ok. 1000 Gt C', fire: 'Spalanie: ok. 10 Gt C rocznie',
    },
  },
  say: {
    night: 'Noc: bez światła nie ma fotosyntezy. Drzewo tylko wydycha trochę CO₂, tak jak ty.',
    day: 'Znowu dzień: liście pobierają CO₂ i oddają O₂.',
    c14: (h, years, left) => [
      'Znowu żywa istota: cały jej węgiel-14. Przesuń zegar dalej!',
      `${years} lat: połowa węgla-14 zamieniła się w azot. ${plLeft(left)} ${left} z 64.`,
      `${years} lat: została jedna czwarta.`,
      `${years} lat: została jedna ósma.`,
      `${years} lat: została 1/16, jak w kości mamuta! Mamut umarł około 23 000 lat temu.`,
      `${years} lat: została 1/32.`,
      `${years} lat: została 1/64. Tylko jeden atom z naszych 64.`,
      `${years} lat: została 1/128. Prawdziwa próbka wciąż ma ich trochę, ale bardzo trudno je policzyć.`,
      `${years} lat: została 1/256. Po około 50 000 lat zostaje za mało, żeby to zmierzyć.`,
    ][h],
  },
  verbs: { night: 'Zrób noc', day: 'Zrób dzień' },
  ex: {
    tree: {
      label: 'oddychające drzewo', verb: 'Zobacz',
      sign: { title: 'Oddychające drzewo', kid: 'W słońcu wdycha dwutlenek węgla i wydycha tlen.', sci: 'Fotosynteza: dwutlenek węgla i woda, ze światłem, dają glukozę i tlen.' },
      panel: {
        title: 'Oddychające drzewo',
        kid: [
          { p: 'Drzewa są zbudowane głównie z węgla, a biorą go z powietrza! W słońcu ich liście wdychają dwutlenek węgla (CO₂) i wykorzystują energię światła, żeby połączyć go z wodą w cukier. Tlen (O₂), który zostaje, uchodzi do powietrza: to tlen, którym oddychasz.' },
          { big: 'CO₂ wchodzi, O₂ wychodzi', small: 'kiedy świeci słońce' },
          { p: 'Prawie cały węgiel w drewnie drzewa pochodzi z powietrza. Przekręć pokrętło na noc i zobacz, co się zmieni.' },
        ],
        sci: [
          { big: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', small: 'fotosynteza, napędzana światłem (ΔG ≈ +2870 kJ na mol glukozy)' },
          { rows: [
            ['Gdzie', 'chloroplasty: chlorofil pochłania głównie światło czerwone i niebieskie'],
            ['Wiązanie węgla', 'enzym RuBisCO dołącza CO₂ do cukru o pięciu atomach węgla (cykl Calvina)'],
            ['Tlen', 'pochodzi z wody, a nie z CO₂ (wykazano to za pomocą tlenu-18 w 1941 roku)'],
            ['Skala', 'rośliny lądowe wiążą ponad 100 miliardów ton węgla rocznie'],
          ] },
          { p: 'Nocą fotosynteza ustaje, ale drzewo dalej oddycha, tak jak ty: pobiera trochę O₂ i oddaje CO₂. W ciągu całego roku rosnące drzewo pobiera znacznie więcej CO₂, niż oddaje.' },
        ],
      },
    },
    night: {
      label: 'dzień i noc',
      sign: { title: 'Dzień i noc', kid: 'Przekręć pokrętło: bez światła nie ma fotosyntezy.', sci: 'W ciemności zachodzi tylko oddychanie.' },
    },
    body: {
      label: 'węgiel w tobie', verb: 'Wypełnij',
      sign: { title: 'W 18% jesteś węglem', kid: 'Z czego składa się twoje ciało, według masy.', sci: 'Według masy: O 65, C 18, H 10, N 3, Ca 1,5, P 1 (procent).' },
      panel: {
        title: 'W 18% jesteś węglem',
        kid: [
          { p: 'Twoje ciało to głównie woda, więc tlen jest najcięższą częścią ciebie. Ale prawie jedna piąta ciebie to węgiel: jest szkieletem twoich mięśni, skóry, włosów, a nawet DNA.' },
          { big: '18%', small: 'twojej masy to węgiel' },
          { rows: [['Tlen', '65%'], ['Węgiel', '18%'], ['Wodór', '10%'], ['Azot', '3%'], ['Wapń', '1,5%'], ['Fosfor', '1%'], ['Inne', '1,5%']] },
          { p: 'Dziecko ważące 35 kg ma w sobie około 6 kg węgla: wystarczyłoby na tysiące grafitów do ołówków!' },
        ],
        sci: [
          { rows: [['O, tlen', '65%'], ['C, węgiel', '18%'], ['H, wodór', '10%'], ['N, azot', '3%'], ['Ca, wapń', '1,5%'], ['P, fosfor', '1%'], ['inne (K, S, Na, Cl, Mg…)', '1,5%']] },
          { p: 'Według liczby atomów kolejność się zmienia: wodór 62%, tlen 24%, węgiel 12%, azot 1%. Atomy wodoru są tak lekkie, że 62% atomów daje tylko 10% masy.' },
          { p: 'Węgiel jest w każdym białku, tłuszczu, węglowodanie i kwasie nukleinowym: ok. 13 kg u dorosłego ważącego 70 kg. Postać jest wypełniona objętościowo w tych proporcjach.' },
        ],
      },
    },
    c14: {
      label: 'zegar węgla-14', verb: 'Przesuń o 5730 lat',
      sign: { title: 'Datowanie węglem-14', kid: 'Co 5730 lat znika połowa węgla-14.', sci: 'Czas połowicznego rozpadu 5730 lat; rozpad beta do azotu-14; daty do ok. 50 000 lat.' },
      panel: {
        title: 'Datowanie węglem-14',
        kid: [
          { p: 'Wszystkie żywe istoty pobierają węgiel, a malutka jego część to promieniotwórczy węgiel-14. Kiedy roślina albo zwierzę umiera, przestaje go pobierać, a jego węgiel-14 powoli zamienia się w azot. Co 5730 lat znika połowa tego, co zostało.' },
          { big: 'około 23 000 lat', small: 'ta kość mamuta ma 1/16 węgla-14 żywego zwierzęcia: 4 połowienia' },
          { p: 'Po około 50 000 lat zostaje za mało, żeby to zmierzyć. Dlatego węglem-14 nie da się datować dinozaurów: wymarły 66 milionów lat temu! Skały datuje się innymi promieniotwórczymi zegarami, na przykład uranowo-ołowiowym.' },
        ],
        sci: [
          { rows: [
            ['Czas połowicznego rozpadu', '5730 ± 40 lat'],
            ['Rozpad', '¹⁴C → ¹⁴N + e⁻ + ν̄ₑ (beta minus)'],
            ['Powstaje', 'w górnej atmosferze: neutrony z promieniowania kosmicznego trafiają w azot-14 (n + ¹⁴N → ¹⁴C + p)'],
            ['Ile', 'ok. 1 atom na 10¹² atomów węgla w żywych istotach'],
            ['Zasięg', 'do ok. 50 000 lat'],
            ['Metoda', 'Willard Libby, 1949 (Nagroda Nobla z chemii 1960)'],
          ] },
          { p: 'Wiek = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) lat. Surowe daty kalibruje się słojami drzew, koralowcami i naciekami jaskiniowymi, bo ilość ¹⁴C w powietrzu się zmieniała; próby jądrowe z lat 50. i 60. XX wieku prawie ją podwoiły.' },
        ],
      },
    },
    cycle: {
      label: 'obieg węgla', verb: 'Zobacz',
      sign: { title: 'Obieg węgla', kid: 'Węgiel krąży w kółko: powietrze, rośliny, zwierzęta, gleba.', sci: 'Zasoby w gigatonach węgla (Gt C); przepływy w Gt C rocznie.' },
      panel: {
        title: 'Obieg węgla',
        kid: [
          { p: 'Węgiel, który masz w sobie, był kiedyś w powietrzu, potem w roślinie, może nawet w dinozaurze. Atomy węgla krążą w kółko:' },
          { list: [
            'Rośliny biorą dwutlenek węgla z powietrza, żeby rosnąć.',
            'Zwierzęta jedzą rośliny (i inne zwierzęta) i przejmują ich węgiel.',
            'Rośliny i zwierzęta wydychają dwutlenek węgla z powrotem.',
            'Kiedy umierają, malutkie żywe istoty w glebie je rozkładają.',
            'Przez miliony lat część z nich zamieniła się w węgiel kamienny, ropę naftową i gaz ziemny.',
            'Spalanie ich bardzo szybko oddaje ten stary węgiel do powietrza.',
          ] },
          { big: '280 → 420', small: 'części CO₂ na milion w powietrzu: przed fabrykami i teraz' },
        ],
        sci: [
          { rows: [
            ['Powietrze', 'ok. 900 Gt C (CO₂ powyżej 420 ppm; ok. 280 ppm przed 1750 rokiem)'],
            ['Fotosynteza na lądzie', 'ponad 100 Gt C rocznie; oddychanie i rozkład oddają mniej więcej tyle samo'],
            ['Ocean', 'wymienia ok. 80 Gt C rocznie w każdą stronę i pochłania ok. 3 Gt C rocznie więcej, niż oddaje'],
            ['Paliwa kopalne i cement', 'ok. 10 Gt C rocznie'],
            ['Zasoby', 'gleby ok. 1700 Gt C, rośliny ok. 450, złoża paliw kopalnych ok. 1000, ocean ok. 38 000'],
          ] },
          { p: '10 Gt rocznie ze spalania to mało w porównaniu z naturalnymi przepływami, ale naturalne przepływy prawie się równoważą, a ten nie: mniej więcej połowa zostaje w powietrzu, więc CO₂ wciąż rośnie.' },
        ],
      },
    },
    methane: {
      name: 'Metan', formula: 'CH4', label: 'metan', verb: 'Zobacz',
      panel: {
        title: 'Metan, CH₄',
        kid: [
          { p: 'Najprostsza cząsteczka z węgla i wodoru: jeden atom węgla trzyma cztery atomy wodoru, skierowane do narożników czworościanu.' },
          { big: 'CH₄', small: 'gaz ziemny' },
          { p: 'To gaz z kuchenki, a krowy wybekują go całe mnóstwo.' },
        ],
        sci: [
          { rows: [['Kształt', 'czworościenny, H–C–H 109,5°, C–H 1,09 Å'], ['Gdzie', 'gaz ziemny, mokradła, bydło, pola ryżowe'], ['Gaz cieplarniany', 'ok. 80 razy silniej ogrzewa niż CO₂ w ciągu 20 lat (ok. 28 razy w ciągu 100 lat)']] },
        ],
      },
    },
    ethane: {
      name: 'Etan', formula: 'C2H6', label: 'etan', verb: 'Zobacz',
      panel: {
        title: 'Etan, C₂H₆',
        kid: [
          { p: 'Dwa atomy węgla trzymają się za ręce: to początek łańcucha. Łańcuchy węglowe mogą mieć tysiące atomów, w tłuszczach, plastikach i ropie naftowej.' },
          { big: 'C₂H₆', small: 'dwa atomy węgla w łańcuchu' },
        ],
        sci: [
          { rows: [['Wiązanie', 'pojedyncze C–C, 1,53 Å; oba końce obracają się wokół niego swobodnie'], ['Rodzina', 'alkany, CₙH₂ₙ₊₂: metan, etan, propan, butan i tak dalej'], ['Na modelu', 'konformacja naprzemianległa']] },
        ],
      },
    },
    ethanol: {
      name: 'Etanol', formula: 'C2H5OH', label: 'etanol', verb: 'Zobacz',
      panel: {
        title: 'Etanol, C₂H₅OH',
        kid: [
          { p: 'Krótki łańcuch z grupą OH na końcu: alkohol. Drożdże robią go z cukru, a używa się go jako paliwa i w żelu do dezynfekcji rąk.' },
          { big: 'C₂H₅OH', small: 'dwa atomy węgla, jedno OH' },
        ],
        sci: [
          { rows: [['Powstaje przez', 'fermentację: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ (drożdże)'], ['Wrze w', '78 °C'], ['Grupa', 'grupa hydroksylowa, –OH, pozwala mu mieszać się z wodą (wiązania wodorowe)']] },
        ],
      },
    },
    benzene: {
      name: 'Benzen', formula: 'C6H6', label: 'benzen', verb: 'Zobacz',
      panel: {
        title: 'Benzen, C₆H₆',
        kid: [
          { p: 'Sześć atomów węgla połączonych w pierścień. Węgiel tworzy łańcuchy i pierścienie, a z nich buduje leki, barwniki i cząsteczki życia.' },
          { big: 'C₆H₆', small: 'pierścień z sześciu atomów węgla' },
        ],
        sci: [
          { rows: [['Kształt', 'płaski sześciokąt, wszystkie sześć wiązań C–C po 1,39 Å (między pojedynczym, 1,54, a podwójnym, 1,34)'], ['Dlaczego', 'sześć elektronów π wspólnych dla całego pierścienia (aromatyczność)'], ['Historia', 'Kekulé zaproponował pierścień w 1865 roku; mówił, że pomysł przyszedł mu do głowy, gdy marzył na jawie o wężu gryzącym własny ogon']] },
          { p: 'Model pokazuje jedną z dwóch struktur Kekulégo, z wiązaniami pojedynczymi i podwójnymi na przemian; prawdziwa cząsteczka jest średnią obu.' },
        ],
      },
    },
    glucose: {
      name: 'Glukoza', formula: 'C6H12O6', label: 'glukozę', verb: 'Zobacz',
      panel: {
        title: 'Glukoza, C₆H₁₂O₆',
        kid: [
          { p: 'Cukier, który rośliny wytwarzają dzięki światłu słonecznemu. Twoje komórki spalają go, żeby mieć energię: to paliwo twoich mięśni i mózgu.' },
          { big: 'C₆H₁₂O₆', small: 'pierścień z pięciu atomów węgla i jednego atomu tlenu' },
        ],
        sci: [
          { rows: [['Na modelu', 'β-D-glukopiranoza w konformacji krzesłowej: każda grupa OH, a także CH₂OH, jest skierowana na zewnątrz (najtrwalsza forma)'], ['Energia', 'ok. 2800 kJ na mol przy spalaniu: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O'], ['Twój mózg', 'zużywa ok. 120 g glukozy dziennie']] },
        ],
      },
    },
  },
  molSign: { title: 'Łańcuchy i pierścienie', kid: 'Węgiel ma cztery ręce, więc buduje łańcuchy i pierścienie.', sci: 'Pięć cząsteczek, prawdziwe długości wiązań i kąty.' },
}

const DE = {
  back: 'Zurück zur Halle: Kohlenstoff',
  kicker: 'Der Kohlenstoff des Lebens',
  decimal: ',',
  talkTo: 'Sprich mit',
  fmt: groupPT,
  years: 'Jahre',
  greeting: {
    kid: 'Willkommen in meinem Garten! Alles, was hier drin lebt, ist aus Kohlenstoff gebaut: der Baum, das Gras und du auch. Finden wir heraus, wie!',
    sci: 'Der Kohlenstoff des Lebens: Photosynthese, die Ketten und Ringe der organischen Chemie, die Radiokarbondatierung und der globale Kohlenstoffkreislauf.',
  },
  light: 'Licht',
  el: { O: 'Sauerstoff', C: 'Kohlenstoff', H: 'Wasserstoff', N: 'Stickstoff', Ca: 'Calcium', P: 'Phosphor', other: 'Andere' },
  personTitle: 'Du: 18% Kohlenstoff',
  boneTag: 'Mammut-Oberschenkelknochen: 1/16 des Kohlenstoff-14 eines lebenden Tiers',
  tuskTag: 'Mammut-Stoßzahn: Elfenbein, ein Riesenzahn',
  jarLabel: 'übriger Kohlenstoff-14',
  cycle: {
    kid: { air: 'Luft', plants: 'Pflanzen', animals: 'Tiere', ocean: 'Ozean', soil: 'Boden', fossil: 'Kohle, Öl und Gas', fire: 'Verbrennung' },
    sci: {
      air: 'Luft: etwa 900 Gt C', plants: 'Pflanzen: etwa 450 Gt C', animals: 'Tiere: etwa 2 Gt C', ocean: 'Ozean: etwa 38 000 Gt C',
      soil: 'Boden: etwa 1700 Gt C', fossil: 'Fossile Brennstoffe: etwa 1000 Gt C', fire: 'Verbrennung: etwa 10 Gt C pro Jahr',
    },
  },
  say: {
    night: 'Nacht: kein Licht, keine Photosynthese. Der Baum atmet nur ein wenig CO₂ aus, so wie du.',
    day: 'Wieder Tag: Die Blätter nehmen CO₂ auf und geben O₂ ab.',
    c14: (h, years, left) => [
      'Wieder ein Lebewesen: mit seinem ganzen Kohlenstoff-14. Dreh die Uhr weiter!',
      `${years} Jahre: Die Hälfte des Kohlenstoff-14 ist zu Stickstoff geworden. ${left} von 64 ${left === 1 ? 'ist' : 'sind'} übrig.`,
      `${years} Jahre: Ein Viertel ist übrig.`,
      `${years} Jahre: Ein Achtel ist übrig.`,
      `${years} Jahre: 1/16 ist übrig, wie im Knochen des Mammuts! Das Mammut starb vor etwa 23 000 Jahren.`,
      `${years} Jahre: 1/32 ist übrig.`,
      `${years} Jahre: 1/64 ist übrig. Nur noch ein Atom von unseren 64.`,
      `${years} Jahre: 1/128 ist übrig. Eine echte Probe hat noch einige, aber sie sind sehr schwer zu zählen.`,
      `${years} Jahre: 1/256 ist übrig. Nach etwa 50 000 Jahren ist zu wenig übrig, um es zu messen.`,
    ][h],
  },
  verbs: { night: 'Mach Nacht', day: 'Mach Tag' },
  ex: {
    tree: {
      label: 'den atmenden Baum', verb: 'Betrachte',
      sign: { title: 'Der atmende Baum', kid: 'Im Sonnenlicht atmet er Kohlendioxid ein und Sauerstoff aus.', sci: 'Photosynthese: Kohlendioxid und Wasser ergeben mit Licht Glucose und Sauerstoff.' },
      panel: {
        title: 'Der atmende Baum',
        kid: [
          { p: 'Bäume bestehen größtenteils aus Kohlenstoff, und den holen sie sich aus der Luft! Im Sonnenlicht atmen ihre Blätter Kohlendioxid (CO₂) ein und nutzen die Energie des Lichts, um es mit Wasser zu Zucker zu verbinden. Der übrige Sauerstoff (O₂) geht hinaus in die Luft: Es ist der Sauerstoff, den du atmest.' },
          { big: 'CO₂ rein, O₂ raus', small: 'solange die Sonne scheint' },
          { p: 'Fast der ganze Kohlenstoff im Holz eines Baumes kam aus der Luft. Dreh den Regler auf Nacht und schau, was sich ändert.' },
        ],
        sci: [
          { big: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', small: 'Photosynthese, angetrieben vom Licht (ΔG ≈ +2870 kJ pro Mol Glucose)' },
          { rows: [
            ['Wo', 'Chloroplasten: Chlorophyll absorbiert vor allem rotes und blaues Licht'],
            ['Kohlenstofffixierung', 'das Enzym RuBisCO hängt CO₂ an einen Zucker mit fünf Kohlenstoffatomen (der Calvin-Zyklus)'],
            ['Der Sauerstoff', 'stammt aus dem Wasser, nicht aus dem CO₂ (1941 mit Sauerstoff-18 gezeigt)'],
            ['Größenordnung', 'Landpflanzen binden mehr als 100 Milliarden Tonnen Kohlenstoff im Jahr'],
          ] },
          { p: 'Nachts hört die Photosynthese auf, aber der Baum atmet weiter, wie du: Er nimmt ein wenig O₂ auf und gibt CO₂ ab. Über ein ganzes Jahr nimmt ein wachsender Baum viel mehr CO₂ auf, als er abgibt.' },
        ],
      },
    },
    night: {
      label: 'Tag und Nacht',
      sign: { title: 'Tag und Nacht', kid: 'Dreh den Regler: kein Licht, keine Photosynthese.', sci: 'Im Dunkeln läuft nur die Atmung weiter.' },
    },
    body: {
      label: 'den Kohlenstoff in dir', verb: 'Füll',
      sign: { title: 'Du bist zu 18% Kohlenstoff', kid: 'Woraus dein Körper besteht, nach Masse.', sci: 'Nach Masse: O 65, C 18, H 10, N 3, Ca 1,5, P 1 (Prozent).' },
      panel: {
        title: 'Du bist zu 18% Kohlenstoff',
        kid: [
          { p: 'Dein Körper besteht vor allem aus Wasser, deshalb ist Sauerstoff der schwerste Teil von dir. Aber fast ein Fünftel von dir ist Kohlenstoff: Er ist das Gerüst deiner Muskeln, deiner Haut, deiner Haare und sogar deiner DNA.' },
          { big: '18%', small: 'deiner Masse sind Kohlenstoff' },
          { rows: [['Sauerstoff', '65%'], ['Kohlenstoff', '18%'], ['Wasserstoff', '10%'], ['Stickstoff', '3%'], ['Calcium', '1,5%'], ['Phosphor', '1%'], ['Andere', '1,5%']] },
          { p: 'Ein Kind mit 35 kg enthält etwa 6 kg Kohlenstoff: genug für Tausende Bleistiftminen!' },
        ],
        sci: [
          { rows: [['O, Sauerstoff', '65%'], ['C, Kohlenstoff', '18%'], ['H, Wasserstoff', '10%'], ['N, Stickstoff', '3%'], ['Ca, Calcium', '1,5%'], ['P, Phosphor', '1%'], ['andere (K, S, Na, Cl, Mg…)', '1,5%']] },
          { p: 'Nach Anzahl der Atome ändert sich die Reihenfolge: Wasserstoff 62%, Sauerstoff 24%, Kohlenstoff 12%, Stickstoff 1%. Wasserstoffatome sind so leicht, dass 62% der Atome nur 10% der Masse ausmachen.' },
          { p: 'Kohlenstoff steckt in jedem Protein, Fett und Kohlenhydrat und in jeder Nukleinsäure: etwa 13 kg in einem Erwachsenen mit 70 kg. Die Figur ist nach Volumen in diesen Anteilen gefüllt.' },
        ],
      },
    },
    c14: {
      label: 'die Kohlenstoff-14-Uhr', verb: 'Dreh 5730 Jahre vor',
      sign: { title: 'Radiokarbondatierung', kid: 'Alle 5730 Jahre verschwindet die Hälfte des Kohlenstoff-14.', sci: 'Halbwertszeit 5730 Jahre; Betazerfall zu Stickstoff-14; datiert bis etwa 50 000 Jahre.' },
      panel: {
        title: 'Radiokarbondatierung',
        kid: [
          { p: 'Alle Lebewesen nehmen Kohlenstoff auf, und ein winziger Teil davon ist radioaktiver Kohlenstoff-14. Wenn eine Pflanze oder ein Tier stirbt, nimmt es keinen mehr auf, und sein Kohlenstoff-14 wird langsam zu Stickstoff. Alle 5730 Jahre verschwindet die Hälfte von dem, was noch da ist.' },
          { big: 'etwa 23 000 Jahre', small: 'dieser Mammutknochen hat 1/16 des Kohlenstoff-14 eines lebenden Tiers: 4 Halbierungen' },
          { p: 'Nach etwa 50 000 Jahren ist zu wenig übrig, um es zu messen. Deshalb kann man Dinosaurier nicht mit Kohlenstoff-14 datieren: Sie sind vor 66 Millionen Jahren ausgestorben! Gesteine datiert man mit anderen radioaktiven Uhren, zum Beispiel Uran-Blei.' },
        ],
        sci: [
          { rows: [
            ['Halbwertszeit', '5730 ± 40 Jahre'],
            ['Zerfall', '¹⁴C → ¹⁴N + e⁻ + ν̄ₑ (Beta-minus)'],
            ['Entstehung', 'in der oberen Atmosphäre: Neutronen der kosmischen Strahlung treffen Stickstoff-14 (n + ¹⁴N → ¹⁴C + p)'],
            ['Wie viel', 'etwa 1 Atom von 10¹² des Kohlenstoffs in Lebewesen'],
            ['Reichweite', 'bis etwa 50 000 Jahre'],
            ['Methode', 'Willard Libby, 1949 (Nobelpreis für Chemie 1960)'],
          ] },
          { p: 'Alter = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) Jahre. Rohe Alter werden mit Baumringen, Korallen und Tropfsteinen kalibriert, weil sich die Menge an ¹⁴C in der Luft verändert hat; die Kernwaffentests der 1950er- und 1960er-Jahre haben sie fast verdoppelt.' },
        ],
      },
    },
    cycle: {
      label: 'den Kohlenstoffkreislauf', verb: 'Betrachte',
      sign: { title: 'Kohlenstoffkreislauf', kid: 'Kohlenstoff wandert im Kreis: Luft, Pflanzen, Tiere, Boden.', sci: 'Speicher in Gigatonnen Kohlenstoff (Gt C); Flüsse in Gt C pro Jahr.' },
      panel: {
        title: 'Der Kohlenstoffkreislauf',
        kid: [
          { p: 'Der Kohlenstoff in dir war einmal in der Luft, dann in einer Pflanze, vielleicht sogar in einem Dinosaurier. Kohlenstoffatome wandern immer im Kreis:' },
          { list: [
            'Pflanzen nehmen Kohlendioxid aus der Luft, um zu wachsen.',
            'Tiere fressen Pflanzen (und andere Tiere) und nehmen den Kohlenstoff auf.',
            'Pflanzen und Tiere atmen Kohlendioxid wieder aus.',
            'Wenn sie sterben, zersetzen winzige Lebewesen im Boden sie.',
            'In Millionen von Jahren wurde ein Teil davon zu Kohle, Erdöl und Erdgas.',
            'Ihre Verbrennung bringt diesen alten Kohlenstoff sehr schnell zurück in die Luft.',
          ] },
          { big: '280 → 420', small: 'Teilchen CO₂ pro Million in der Luft: vor den Fabriken und heute' },
        ],
        sci: [
          { rows: [
            ['Luft', 'etwa 900 Gt C (CO₂ über 420 ppm; etwa 280 ppm vor 1750)'],
            ['Photosynthese an Land', 'mehr als 100 Gt C pro Jahr; Atmung und Zersetzung geben etwa ebenso viel zurück'],
            ['Ozean', 'tauscht etwa 80 Gt C pro Jahr in jede Richtung aus und nimmt etwa 3 Gt C pro Jahr mehr auf, als er abgibt'],
            ['Fossile Brennstoffe und Zement', 'etwa 10 Gt C pro Jahr'],
            ['Speicher', 'Böden etwa 1700 Gt C, Pflanzen etwa 450, Vorräte fossiler Brennstoffe etwa 1000, Ozean etwa 38 000'],
          ] },
          { p: 'Die 10 Gt pro Jahr aus der Verbrennung sind wenig neben den natürlichen Flüssen, aber die natürlichen Flüsse gleichen sich fast aus und dieser nicht: Etwa die Hälfte bleibt in der Luft, deshalb steigt das CO₂ weiter.' },
        ],
      },
    },
    methane: {
      name: 'Methan', formula: 'CH4', label: 'Methan', verb: 'Betrachte',
      panel: {
        title: 'Methan, CH₄',
        kid: [
          { p: 'Das einfachste Molekül aus Kohlenstoff und Wasserstoff: ein Kohlenstoffatom, das vier Wasserstoffatome festhält, die zu den Ecken eines Tetraeders zeigen.' },
          { big: 'CH₄', small: 'Erdgas' },
          { p: 'Es ist das Gas im Küchenherd, und Kühe rülpsen jede Menge davon.' },
        ],
        sci: [
          { rows: [['Form', 'tetraedrisch, H–C–H 109,5°, C–H 1,09 Å'], ['Wo', 'Erdgas, Feuchtgebiete, Rinder, Reisfelder'], ['Treibhausgas', 'über 20 Jahre etwa 80-mal stärker wärmend als CO₂ (über 100 Jahre etwa 28-mal)']] },
        ],
      },
    },
    ethane: {
      name: 'Ethan', formula: 'C2H6', label: 'Ethan', verb: 'Betrachte',
      panel: {
        title: 'Ethan, C₂H₆',
        kid: [
          { p: 'Zwei Kohlenstoffatome halten sich an den Händen: Das ist der Anfang einer Kette. Kohlenstoffketten können Tausende Atome lang sein, in Fetten, Kunststoffen und Erdöl.' },
          { big: 'C₂H₆', small: 'zwei Kohlenstoffatome in einer Kette' },
        ],
        sci: [
          { rows: [['Bindung', 'C–C-Einfachbindung, 1,53 Å; die beiden Enden drehen sich frei um sie'], ['Familie', 'die Alkane, CₙH₂ₙ₊₂: Methan, Ethan, Propan, Butan und so weiter'], ['Im Modell', 'die gestaffelte Konformation']] },
        ],
      },
    },
    ethanol: {
      name: 'Ethanol', formula: 'C2H5OH', label: 'Ethanol', verb: 'Betrachte',
      panel: {
        title: 'Ethanol, C₂H₅OH',
        kid: [
          { p: 'Eine kurze Kette mit einer OH-Gruppe am Ende: ein Alkohol. Hefe macht es aus Zucker, und es wird als Treibstoff und in Handdesinfektionsmittel verwendet.' },
          { big: 'C₂H₅OH', small: 'zwei Kohlenstoffatome, ein OH' },
        ],
        sci: [
          { rows: [['Entsteht durch', 'Gärung: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ (Hefe)'], ['Siedet bei', '78 °C'], ['Gruppe', 'die Hydroxygruppe, –OH, macht es mit Wasser mischbar (Wasserstoffbrücken)']] },
        ],
      },
    },
    benzene: {
      name: 'Benzol', formula: 'C6H6', label: 'Benzol', verb: 'Betrachte',
      panel: {
        title: 'Benzol, C₆H₆',
        kid: [
          { p: 'Sechs Kohlenstoffatome, zu einem Ring verbunden. Kohlenstoff bildet Ketten und Ringe, und daraus baut er Medikamente, Farbstoffe und die Moleküle des Lebens.' },
          { big: 'C₆H₆', small: 'ein Ring aus sechs Kohlenstoffatomen' },
        ],
        sci: [
          { rows: [['Form', 'ein flaches Sechseck, alle sechs C–C-Bindungen 1,39 Å (zwischen einfach, 1,54, und doppelt, 1,34)'], ['Warum', 'sechs π-Elektronen, über den ganzen Ring geteilt (Aromatizität)'], ['Geschichte', 'Kekulé schlug den Ring 1865 vor; er erzählte, die Idee sei ihm in einem Tagtraum von einer Schlange gekommen, die sich in den eigenen Schwanz beißt']] },
          { p: 'Das Modell zeigt eine der beiden Kekulé-Strukturen, mit abwechselnden Einfach- und Doppelbindungen; das echte Molekül ist der Mittelwert aus beiden.' },
        ],
      },
    },
    glucose: {
      name: 'Glucose', formula: 'C6H12O6', label: 'Glucose', verb: 'Betrachte',
      panel: {
        title: 'Glucose, C₆H₁₂O₆',
        kid: [
          { p: 'Der Zucker, den Pflanzen mit Sonnenlicht machen. Deine Zellen verbrennen ihn für Energie: Er ist der Treibstoff deiner Muskeln und deines Gehirns.' },
          { big: 'C₆H₁₂O₆', small: 'ein Ring aus fünf Kohlenstoffatomen und einem Sauerstoffatom' },
        ],
        sci: [
          { rows: [['Im Modell', 'β-D-Glucopyranose in der Sesselform: Jede OH-Gruppe und auch das CH₂OH zeigen nach außen (die stabilste Form)'], ['Energie', 'etwa 2800 kJ pro Mol beim Verbrennen: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O'], ['Dein Gehirn', 'verbraucht etwa 120 g Glucose am Tag']] },
        ],
      },
    },
  },
  molSign: { title: 'Ketten und Ringe', kid: 'Kohlenstoff hat vier Hände, deshalb baut er Ketten und Ringe.', sci: 'Fünf Moleküle, echte Bindungslängen und -winkel.' },
}

export const WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
export const wordsFor = lang => WORDS[lang] ?? EN
