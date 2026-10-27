// Every word of the life wing (the garden), in English and European Portuguese, kid (Explorer) and sci
// (Scientist). Signs and labels are 3D text (Latin letters only, no subscripts); panels and speech are
// HTML (any character). No em dashes.

const groupEN = n => n.toLocaleString('en-GB')
const groupPT = n => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n))

const EN = {
  back: 'Back to the atrium',
  kicker: 'The carbon of life',
  decimal: '.',
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

export const WORDS = { en: EN, 'pt-pt': PT }
export const wordsFor = lang => WORDS[lang] ?? (String(lang).startsWith('pt') ? PT : EN)
