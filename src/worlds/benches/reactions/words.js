// The Reactions bench's words, in every language (i18n/langs.js: en, pt-pt, pl, de; a missing one falls back
// to English) and at both depths (kid: Explorer, sci: Scientist). The bench's title is the locale files'
// bench.reactions.title; everything else the bench and its HUD say is here. No em dashes in our own words.
// A text is a string, a function of its values, or { kid, sci } of those; say() picks and fills it.
import { tagOf } from '../../../i18n/langs.js'

const EN = {
  side: { L: { kid: 'Before', sci: 'Reactants' }, R: { kid: 'After', sci: 'Products' } },
  mol: {
    H2: 'hydrogen', O2: 'oxygen', N2: 'nitrogen', Cl2: 'chlorine', H2O: 'water', CO2: 'carbon dioxide', CH4: 'methane',
    NH3: 'ammonia', Na: 'sodium', NaCl: { kid: 'salt', sci: 'sodium chloride' }, Fe: 'iron', Fe2O3: { kid: 'rust', sci: 'iron(III) oxide' },
    CaO: { kid: 'quicklime', sci: 'calcium oxide' }, CaCO3: { kid: 'limestone', sci: 'calcium carbonate' }, C2H5OH: 'ethanol', C6H12O6: 'glucose',
  },
  list: 'Reactions',
  found: v => `${v.n} of ${v.total} done`,
  help: { kid: 'Tap a molecule to add one more. The − takes one away.', sci: 'Tap a molecule to raise its coefficient; − lowers it.' },
  goal: { kid: 'Make both sides the same: count each kind of atom.', sci: 'Balance it: as many atoms of each element on both sides.' },
  off: { kid: v => `${v.name}: ${v.left} before, ${v.right} after.`, sci: v => `${v.sym}: ${v.left} on the left, ${v.right} on the right.` },
  balanced: { kid: 'Both sides match! Tap the arrow to make it happen.', sci: 'Balanced. Tap the arrow to run it.' },
  lowest: {
    kid: v => `That works, but you can do it with fewer: every number divides by ${v.d}.`,
    sci: v => `Balanced, but every coefficient divides by ${v.d}: chemists write the smallest whole numbers.`,
  },
  needs: {
    light: { kid: 'Plants need light: switch on the sun lamp (tap it).', sci: 'Endothermic: it needs light. Switch on the lamp.' },
    heat: { kid: 'Limestone needs great heat: light the flame (tap the burner).', sci: 'Endothermic: it needs heat. Light the burner.' },
    power: { kid: 'Water needs electricity to split: connect the battery (tap it).', sci: 'Endothermic: it needs electrical work. Connect the battery.' },
  },
  source: {
    light: { off: 'Switch on the sun lamp', on: 'Sun lamp on' },
    heat: { off: 'Light the flame', on: 'Flame on' },
    power: { off: 'Connect the battery', on: 'Battery on' },
  },
  from: { light: 'the light', heat: 'the flame', power: 'the electricity' },
  run: 'Run it',
  again: 'Again',
  next: 'Next',
  running: { kid: 'The hands let go... and the very same atoms join up again!', sci: 'Bonds break, the atoms rearrange, new bonds form: no atom lost, none made.' },
  gave: {
    kid: v => `It gave out ${v.kJ} kJ of heat and light: enough to boil ${v.litres} litres of cold water!`,
    sci: v => `ΔH = ${v.dH} kJ for the equation as written: exothermic.${v.water ? ` Water counted as ${v.water}.` : ''}`,
  },
  took: {
    kid: v => `It took in ${v.kJ} kJ from ${v.from}, as much as boiling ${v.litres} litres of cold water takes. Now it is stored in the new molecules.`,
    sci: v => `ΔH = ${v.dH} kJ for the equation as written: endothermic, taken in from ${v.from}.`,
  },
  water: { label: 'Water as', l: 'liquid', g: 'vapour' },
  full: 'The bench is full: take some away first.',
  most: 'Nine is the most here.',
  locked: 'Tap Again to change the numbers.',
  made: { kid: v => `You did it: ${v.name}!`, sci: v => `Balanced and run: ${v.name}` },
  together: 'Balancing with: ',
  atoms: 'Atoms',
  reactions: {
    hydrogen: {
      name: 'Hydrogen burning',
      tag: { kid: 'The rocket', sci: 'Rocket engines: liquid hydrogen and liquid oxygen' },
      fact: {
        kid: 'Big rockets burn hydrogen with oxygen. What shoots out of the engine is only water, as very hot steam!',
        sci: "The Space Shuttle's main engines burned liquid hydrogen with liquid oxygen; the exhaust is water vapour. Per kilogram, hydrogen gives more energy than any other chemical fuel: 142 MJ/kg.",
      },
    },
    water: {
      name: 'Splitting water',
      tag: { kid: 'Electricity pulls it apart', sci: 'Electrolysis of water' },
      fact: {
        kid: 'Electricity can pull water apart into hydrogen and oxygen: the rocket backwards. It takes in exactly the energy that burning the hydrogen gives out.',
        sci: 'ΔH = +571.7 kJ, of which at least ΔG = +474.3 kJ must come as electrical work: at least 1.23 V across the cell. With electricity from wind or sun it makes green hydrogen.',
      },
    },
    methane: {
      name: 'Methane burning',
      tag: { kid: 'The gas stove', sci: 'Combustion of natural gas' },
      fact: {
        kid: 'The blue flame of a gas stove is methane joining with oxygen. It makes carbon dioxide, water and lots of heat for cooking.',
        sci: 'Natural gas is mostly methane. ΔcH° = −890.3 kJ/mol with liquid water (the higher heating value), −802.3 kJ/mol with water vapour (the lower one).',
      },
    },
    salt: {
      name: 'Making salt',
      tag: { kid: 'A metal meets a poison gas', sci: 'Synthesis of sodium chloride' },
      fact: {
        kid: 'Sodium is a soft, shiny metal and chlorine a poisonous green gas. Together they burn with a bright yellow flame and become the salt on your food!',
        sci: "Each sodium atom gives an electron to a chlorine atom: Na⁺ and Cl⁻ in a crystal lattice, so one pair stands for the formula unit. The yellow is sodium's light at 589 nm.",
      },
    },
    ammonia: {
      name: 'Making ammonia',
      tag: { kid: 'Food from the air', sci: 'The Haber-Bosch process' },
      fact: {
        kid: 'Plants need nitrogen, and the air is full of it, but its two atoms hold on very tight. Factories join it with hydrogen to make fertiliser, which grows food for billions of people.',
        sci: 'Fritz Haber (1909) and Carl Bosch: an iron catalyst, about 400 to 450 °C and 150 to 300 bar. Its fertiliser grows the food of about half of humanity.',
      },
    },
    limestone: {
      name: 'Heating limestone',
      tag: { kid: 'Making lime for cement', sci: 'Thermal decomposition of calcium carbonate' },
      fact: {
        kid: 'Limestone, chalk and seashells are calcium carbonate. Heat them hot enough and they let go of carbon dioxide, leaving quicklime, used to make cement.',
        sci: "In a lime kiln at about 900 °C; ΔH = +178.3 kJ/mol. Making cement releases this CO₂, and more from the fuel: about 8% of the world's CO₂ emissions.",
      },
    },
    rust: {
      name: 'Rusting iron',
      tag: { kid: 'A very slow fire', sci: 'Oxidation of iron' },
      fact: {
        kid: 'Rust is iron joined with oxygen. It gives out heat too, but so slowly that you never feel it (here it is sped up). Hand warmers rust iron powder fast to warm your hands!',
        sci: 'Modelled as dry haematite, Fe₂O₃ (ΔfH° = −825.5 kJ/mol); real rust also holds water, Fe₂O₃·nH₂O, and needs water and air to form. Hand warmers rust iron powder fast, with salt and water.',
      },
    },
    ethanol: {
      name: 'Ethanol burning',
      tag: { kid: 'The spirit burner', sci: 'A fuel from plants (bioethanol)' },
      fact: {
        kid: 'Ethanol is a liquid fuel made from plants like sugar cane. It burns with a soft blue flame in spirit burners, and some cars run on it.',
        sci: 'ΔcH° = −1367.6 kJ/mol with liquid water (Chao and Rossini, 1965). In Brazil most cars sold can run on ethanol from sugar cane.',
      },
    },
    photosynthesis: {
      name: 'Photosynthesis',
      tag: { kid: 'How a leaf makes sugar', sci: 'The overall equation' },
      fact: {
        kid: 'A leaf takes carbon dioxide from the air and water from the soil, and with the energy of sunlight makes sugar (glucose) and the oxygen we breathe.',
        sci: 'ΔH = +2803 kJ, stored in the glucose. The oxygen given off comes from the water (oxygen-18, Ruben and Kamen, 1941): written truly, 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O.',
      },
    },
    respiration: {
      name: 'Respiration',
      tag: { kid: 'How your body gets energy', sci: 'Cellular respiration, the overall equation' },
      fact: {
        kid: 'Your cells burn sugar slowly with the oxygen you breathe in. The energy keeps you warm and moving, and you breathe out carbon dioxide and water: photosynthesis backwards!',
        sci: 'In the mitochondria, in many small steps. About a third of the 2803 kJ is kept as ATP (about 30 ATP per glucose); the rest warms the body.',
      },
    },
  },
}

const PT = {
  side: { L: { kid: 'Antes', sci: 'Reagentes' }, R: { kid: 'Depois', sci: 'Produtos' } },
  mol: {
    H2: 'hidrogénio', O2: 'oxigénio', N2: 'azoto', Cl2: 'cloro', H2O: 'água', CO2: 'dióxido de carbono', CH4: 'metano',
    NH3: 'amoníaco', Na: 'sódio', NaCl: { kid: 'sal', sci: 'cloreto de sódio' }, Fe: 'ferro', Fe2O3: { kid: 'ferrugem', sci: 'óxido de ferro(III)' },
    CaO: { kid: 'cal viva', sci: 'óxido de cálcio' }, CaCO3: { kid: 'calcário', sci: 'carbonato de cálcio' }, C2H5OH: 'etanol', C6H12O6: 'glicose',
  },
  list: 'Reações',
  found: v => `${v.n} de ${v.total} feitas`,
  help: { kid: 'Toca numa molécula para juntar mais uma. O − tira uma.', sci: 'Toca numa molécula para subir o seu coeficiente; o − baixa-o.' },
  goal: { kid: 'Põe os dois lados iguais: conta cada tipo de átomo.', sci: 'Acerta a equação: o mesmo número de átomos de cada elemento dos dois lados.' },
  off: { kid: v => `${v.name}: ${v.left} antes, ${v.right} depois.`, sci: v => `${v.sym}: ${v.left} à esquerda, ${v.right} à direita.` },
  balanced: { kid: 'Os dois lados batem certo! Toca na seta para a reação acontecer.', sci: 'Acertada. Toca na seta para a fazer.' },
  lowest: {
    kid: v => `Assim também dá, mas podes usar menos: todos os números se dividem por ${v.d}.`,
    sci: v => `Acertada, mas todos os coeficientes se dividem por ${v.d}: os químicos escrevem os menores números inteiros.`,
  },
  needs: {
    light: { kid: 'As plantas precisam de luz: acende a lâmpada do sol (toca nela).', sci: 'Endotérmica: precisa de luz. Acende a lâmpada.' },
    heat: { kid: 'O calcário precisa de muito calor: acende a chama (toca no queimador).', sci: 'Endotérmica: precisa de calor. Acende o queimador.' },
    power: { kid: 'A água precisa de eletricidade para se separar: liga a pilha (toca nela).', sci: 'Endotérmica: precisa de trabalho elétrico. Liga a pilha.' },
  },
  source: {
    light: { off: 'Acender a lâmpada do sol', on: 'Lâmpada acesa' },
    heat: { off: 'Acender a chama', on: 'Chama acesa' },
    power: { off: 'Ligar a pilha', on: 'Pilha ligada' },
  },
  from: { light: 'da luz', heat: 'da chama', power: 'da eletricidade' },
  run: 'Fazer a reação',
  again: 'Outra vez',
  next: 'Seguinte',
  running: { kid: 'As mãos largam-se... e os mesmíssimos átomos juntam-se de novo!', sci: 'Quebram-se ligações, os átomos reorganizam-se, formam-se ligações novas: nenhum átomo se perde, nenhum se cria.' },
  gave: {
    kid: v => `Libertou ${v.kJ} kJ de calor e luz: dá para ferver ${v.litres} litros de água fria!`,
    sci: v => `ΔH = ${v.dH} kJ para a equação como está escrita: exotérmica.${v.water ? ` Água contada como ${v.water}.` : ''}`,
  },
  took: {
    kid: v => `Absorveu ${v.kJ} kJ ${v.from}, tanto como é preciso para ferver ${v.litres} litros de água fria. Agora está guardado nas moléculas novas.`,
    sci: v => `ΔH = ${v.dH} kJ para a equação como está escrita: endotérmica, absorvida ${v.from}.`,
  },
  water: { label: 'Água como', l: 'líquido', g: 'vapor' },
  full: 'A bancada está cheia: tira algumas primeiro.',
  most: 'Nove é o máximo aqui.',
  locked: 'Toca em Outra vez para mudar os números.',
  made: { kid: v => `Conseguiste: ${v.name}!`, sci: v => `Acertada e feita: ${v.name}` },
  together: 'A acertar com: ',
  atoms: 'Átomos',
  reactions: {
    hydrogen: {
      name: 'Hidrogénio a arder',
      tag: { kid: 'O foguetão', sci: 'Motores de foguetão: hidrogénio líquido e oxigénio líquido' },
      fact: {
        kid: 'Os foguetões grandes queimam hidrogénio com oxigénio. O que sai do motor é só água, em vapor muito quente!',
        sci: 'Os motores principais do vaivém espacial queimavam hidrogénio líquido com oxigénio líquido; o escape é vapor de água. Por quilograma, o hidrogénio dá mais energia do que qualquer outro combustível químico: 142 MJ/kg.',
      },
    },
    water: {
      name: 'Separar a água',
      tag: { kid: 'A eletricidade separa-a', sci: 'Eletrólise da água' },
      fact: {
        kid: 'A eletricidade consegue separar a água em hidrogénio e oxigénio: o foguetão ao contrário. Absorve exatamente a energia que o hidrogénio liberta a arder.',
        sci: 'ΔH = +571,7 kJ, dos quais pelo menos ΔG = +474,3 kJ têm de vir como trabalho elétrico: pelo menos 1,23 V na célula. Com eletricidade do vento ou do sol faz hidrogénio verde.',
      },
    },
    methane: {
      name: 'Metano a arder',
      tag: { kid: 'O fogão a gás', sci: 'Combustão do gás natural' },
      fact: {
        kid: 'A chama azul de um fogão a gás é o metano a juntar-se ao oxigénio. Faz dióxido de carbono, água e muito calor para cozinhar.',
        sci: 'O gás natural é sobretudo metano. ΔcH° = −890,3 kJ/mol com água líquida (o poder calorífico superior), −802,3 kJ/mol com vapor de água (o inferior).',
      },
    },
    salt: {
      name: 'Fazer sal',
      tag: { kid: 'Um metal encontra um gás venenoso', sci: 'Síntese do cloreto de sódio' },
      fact: {
        kid: 'O sódio é um metal mole e brilhante e o cloro um gás verde venenoso. Juntos ardem com uma chama amarela forte e tornam-se o sal da tua comida!',
        sci: 'Cada átomo de sódio dá um eletrão a um átomo de cloro: Na⁺ e Cl⁻ numa rede cristalina, por isso um par representa a unidade de fórmula. O amarelo é a luz do sódio a 589 nm.',
      },
    },
    ammonia: {
      name: 'Fazer amoníaco',
      tag: { kid: 'Comida a partir do ar', sci: 'O processo de Haber-Bosch' },
      fact: {
        kid: 'As plantas precisam de azoto, e o ar está cheio dele, mas os seus dois átomos agarram-se com muita força. As fábricas juntam-no ao hidrogénio para fazer adubo, que faz crescer comida para milhares de milhões de pessoas.',
        sci: 'Fritz Haber (1909) e Carl Bosch: um catalisador de ferro, cerca de 400 a 450 °C e 150 a 300 bar. O seu adubo faz crescer a comida de cerca de metade da humanidade.',
      },
    },
    limestone: {
      name: 'Aquecer calcário',
      tag: { kid: 'Fazer cal para o cimento', sci: 'Decomposição térmica do carbonato de cálcio' },
      fact: {
        kid: 'O calcário, o giz e as conchas são carbonato de cálcio. Aquecidos com força suficiente largam dióxido de carbono e fica a cal viva, usada para fazer cimento.',
        sci: 'Num forno de cal a cerca de 900 °C; ΔH = +178,3 kJ/mol. Fazer cimento liberta este CO₂, e mais do combustível: cerca de 8% das emissões de CO₂ do mundo.',
      },
    },
    rust: {
      name: 'Ferro a enferrujar',
      tag: { kid: 'Um fogo muito lento', sci: 'Oxidação do ferro' },
      fact: {
        kid: 'A ferrugem é ferro junto com oxigénio. Também liberta calor, mas tão devagar que nunca o sentes (aqui está acelerado). Os aquecedores de mãos enferrujam pó de ferro depressa para te aquecer as mãos!',
        sci: 'Modelada como hematite seca, Fe₂O₃ (ΔfH° = −825,5 kJ/mol); a ferrugem verdadeira também tem água, Fe₂O₃·nH₂O, e precisa de água e ar para se formar. Os aquecedores de mãos enferrujam pó de ferro depressa, com sal e água.',
      },
    },
    ethanol: {
      name: 'Etanol a arder',
      tag: { kid: 'A lamparina de álcool', sci: 'Um combustível das plantas (bioetanol)' },
      fact: {
        kid: 'O etanol é um combustível líquido feito de plantas como a cana-de-açúcar. Arde com uma chama azul suave nas lamparinas, e há carros que andam com ele.',
        sci: 'ΔcH° = −1367,6 kJ/mol com água líquida (Chao e Rossini, 1965). No Brasil a maior parte dos carros vendidos pode andar com etanol da cana-de-açúcar.',
      },
    },
    photosynthesis: {
      name: 'Fotossíntese',
      tag: { kid: 'Como uma folha faz açúcar', sci: 'A equação global' },
      fact: {
        kid: 'Uma folha tira dióxido de carbono do ar e água da terra e, com a energia da luz do sol, faz açúcar (glicose) e o oxigénio que respiramos.',
        sci: 'ΔH = +2803 kJ, guardados na glicose. O oxigénio libertado vem da água (oxigénio-18, Ruben e Kamen, 1941): escrita a sério, 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O.',
      },
    },
    respiration: {
      name: 'Respiração celular',
      tag: { kid: 'Como o teu corpo ganha energia', sci: 'Respiração celular, a equação global' },
      fact: {
        kid: 'As tuas células queimam açúcar devagar com o oxigénio que respiras. A energia mantém-te quente e a mexer, e expiras dióxido de carbono e água: é a fotossíntese ao contrário!',
        sci: 'Nas mitocôndrias, em muitos passos pequenos. Cerca de um terço dos 2803 kJ fica guardado como ATP (cerca de 30 ATP por glicose); o resto aquece o corpo.',
      },
    },
  },
}

const PL = {
  side: { L: { kid: 'Przed', sci: 'Substraty' }, R: { kid: 'Po', sci: 'Produkty' } },
  mol: {
    H2: 'wodór', O2: 'tlen', N2: 'azot', Cl2: 'chlor', H2O: 'woda', CO2: 'dwutlenek węgla', CH4: 'metan',
    NH3: 'amoniak', Na: 'sód', NaCl: { kid: 'sól', sci: 'chlorek sodu' }, Fe: 'żelazo', Fe2O3: { kid: 'rdza', sci: 'tlenek żelaza(III)' },
    CaO: { kid: 'wapno palone', sci: 'tlenek wapnia' }, CaCO3: { kid: 'wapień', sci: 'węglan wapnia' }, C2H5OH: 'etanol', C6H12O6: 'glukoza',
  },
  list: 'Reakcje',
  found: v => `Zrobione: ${v.n} z ${v.total}`,
  help: { kid: 'Dotknij cząsteczki, żeby dodać jeszcze jedną. Znak − zabiera jedną.', sci: 'Dotknij cząsteczki, żeby zwiększyć jej współczynnik; − go zmniejsza.' },
  goal: { kid: 'Zrób obie strony takie same: policz każdy rodzaj atomów.', sci: 'Uzgodnij równanie: tyle samo atomów każdego pierwiastka po obu stronach.' },
  off: { kid: v => `${v.name}: przed ${v.left}, po ${v.right}.`, sci: v => `${v.sym}: po lewej ${v.left}, po prawej ${v.right}.` },
  balanced: { kid: 'Obie strony się zgadzają! Dotknij strzałki, żeby reakcja zaszła.', sci: 'Uzgodnione. Dotknij strzałki, żeby przeprowadzić reakcję.' },
  lowest: {
    kid: v => `Tak też działa, ale da się mniejszą liczbą: każda liczba dzieli się przez ${v.d}.`,
    sci: v => `Uzgodnione, ale każdy współczynnik dzieli się przez ${v.d}: chemicy piszą najmniejsze liczby całkowite.`,
  },
  needs: {
    light: { kid: 'Rośliny potrzebują światła: włącz lampę słoneczną (dotknij jej).', sci: 'Reakcja endotermiczna: potrzebuje światła. Włącz lampę.' },
    heat: { kid: 'Wapień potrzebuje wielkiego żaru: zapal płomień (dotknij palnika).', sci: 'Reakcja endotermiczna: potrzebuje ciepła. Zapal palnik.' },
    power: { kid: 'Woda potrzebuje prądu, żeby się rozdzielić: podłącz baterię (dotknij jej).', sci: 'Reakcja endotermiczna: potrzebuje pracy elektrycznej. Podłącz baterię.' },
  },
  source: {
    light: { off: 'Włącz lampę słoneczną', on: 'Lampa włączona' },
    heat: { off: 'Zapal płomień', on: 'Płomień się pali' },
    power: { off: 'Podłącz baterię', on: 'Bateria podłączona' },
  },
  from: { light: 'ze światła', heat: 'z płomienia', power: 'z prądu' },
  run: 'Przeprowadź reakcję',
  again: 'Jeszcze raz',
  next: 'Następna',
  running: { kid: 'Ręce się puszczają... i te same atomy łączą się na nowo!', sci: 'Wiązania pękają, atomy się przegrupowują, powstają nowe wiązania: żaden atom nie znika, żaden nie powstaje.' },
  gave: {
    kid: v => `Wydzieliła ${v.kJ} kJ ciepła i światła: tyle, żeby zagotować ${v.litres} litra zimnej wody!`,
    sci: v => `ΔH = ${v.dH} kJ dla równania w tej postaci: reakcja egzotermiczna.${v.water ? ` Woda liczona jako ${v.water}.` : ''}`,
  },
  took: {
    kid: v => `Pochłonęła ${v.kJ} kJ ${v.from}, tyle, ile trzeba, żeby zagotować ${v.litres} litra zimnej wody. Teraz ta energia jest zamknięta w nowych cząsteczkach.`,
    sci: v => `ΔH = ${v.dH} kJ dla równania w tej postaci: reakcja endotermiczna, energia ${v.from}.`,
  },
  water: { label: 'Woda jako', l: 'ciecz', g: 'para' },
  full: 'Stół jest pełny: najpierw coś zabierz.',
  most: 'Dziewięć to tutaj najwięcej.',
  locked: 'Dotknij „Jeszcze raz”, żeby zmienić liczby.',
  made: { kid: v => `Udało się: ${v.name}!`, sci: v => `Uzgodniona i przeprowadzona: ${v.name}` },
  together: 'Uzgadniamy razem: ',
  atoms: 'Atomy',
  reactions: {
    hydrogen: {
      name: 'Spalanie wodoru',
      tag: { kid: 'Rakieta', sci: 'Silniki rakietowe: ciekły wodór i ciekły tlen' },
      fact: {
        kid: 'Wielkie rakiety spalają wodór z tlenem. Z silnika wylatuje tylko woda, jako bardzo gorąca para!',
        sci: 'Główne silniki promu kosmicznego spalały ciekły wodór z ciekłym tlenem; spaliny to para wodna. Na kilogram wodór daje więcej energii niż jakiekolwiek inne paliwo chemiczne: 142 MJ/kg.',
      },
    },
    water: {
      name: 'Rozkład wody',
      tag: { kid: 'Prąd ją rozdziela', sci: 'Elektroliza wody' },
      fact: {
        kid: 'Prąd potrafi rozdzielić wodę na wodór i tlen: to rakieta na odwrót. Pochłania dokładnie tyle energii, ile wydziela spalanie wodoru.',
        sci: 'ΔH = +571,7 kJ, z czego co najmniej ΔG = +474,3 kJ musi przyjść jako praca elektryczna: co najmniej 1,23 V na ogniwie. Z prądem z wiatru lub słońca daje zielony wodór.',
      },
    },
    methane: {
      name: 'Spalanie metanu',
      tag: { kid: 'Kuchenka gazowa', sci: 'Spalanie gazu ziemnego' },
      fact: {
        kid: 'Niebieski płomień kuchenki gazowej to metan łączący się z tlenem. Powstaje dwutlenek węgla, woda i mnóstwo ciepła do gotowania.',
        sci: 'Gaz ziemny to głównie metan. ΔcH° = −890,3 kJ/mol z wodą ciekłą (ciepło spalania), −802,3 kJ/mol z parą wodną (wartość opałowa).',
      },
    },
    salt: {
      name: 'Robienie soli',
      tag: { kid: 'Metal spotyka trujący gaz', sci: 'Synteza chlorku sodu' },
      fact: {
        kid: 'Sód to miękki, błyszczący metal, a chlor to trujący zielony gaz. Razem płoną jasnożółtym płomieniem i stają się solą z twojego jedzenia!',
        sci: 'Każdy atom sodu oddaje elektron atomowi chloru: Na⁺ i Cl⁻ w sieci krystalicznej, więc jedna para oznacza jednostkę wzorową. Żółte światło to linia sodu przy 589 nm.',
      },
    },
    ammonia: {
      name: 'Synteza amoniaku',
      tag: { kid: 'Jedzenie z powietrza', sci: 'Proces Habera-Boscha' },
      fact: {
        kid: 'Rośliny potrzebują azotu, a powietrze jest go pełne, ale jego dwa atomy trzymają się bardzo mocno. Fabryki łączą go z wodorem w nawóz, dzięki któremu rośnie jedzenie dla miliardów ludzi.',
        sci: 'Fritz Haber (1909) i Carl Bosch: katalizator żelazowy, około 400 do 450 °C i 150 do 300 barów. Dzięki temu nawozowi rośnie jedzenie dla mniej więcej połowy ludzkości.',
      },
    },
    limestone: {
      name: 'Prażenie wapienia',
      tag: { kid: 'Wapno do cementu', sci: 'Rozkład termiczny węglanu wapnia' },
      fact: {
        kid: 'Wapień, kreda i muszle to węglan wapnia. Mocno rozgrzane oddają dwutlenek węgla i zostaje wapno palone, z którego robi się cement.',
        sci: 'W piecu wapienniczym w około 900 °C; ΔH = +178,3 kJ/mol. Produkcja cementu uwalnia ten CO₂, i jeszcze więcej z paliwa: około 8% światowej emisji CO₂.',
      },
    },
    rust: {
      name: 'Rdzewienie żelaza',
      tag: { kid: 'Bardzo powolny ogień', sci: 'Utlenianie żelaza' },
      fact: {
        kid: 'Rdza to żelazo połączone z tlenem. Też wydziela ciepło, ale tak powoli, że go nie czujesz (tu jest przyspieszone). Ogrzewacze do rąk szybko rdzewieją żelazny proszek, żeby ogrzać ci dłonie!',
        sci: 'Model: suchy hematyt, Fe₂O₃ (ΔfH° = −825,5 kJ/mol); prawdziwa rdza zawiera też wodę, Fe₂O₃·nH₂O, i do powstania potrzebuje wody i powietrza. Ogrzewacze do rąk szybko utleniają żelazny proszek, z solą i wodą.',
      },
    },
    ethanol: {
      name: 'Spalanie etanolu',
      tag: { kid: 'Palnik spirytusowy', sci: 'Paliwo z roślin (bioetanol)' },
      fact: {
        kid: 'Etanol to ciekłe paliwo z roślin, na przykład z trzciny cukrowej. Pali się łagodnym niebieskim płomieniem w palnikach spirytusowych, a niektóre samochody na nim jeżdżą.',
        sci: 'ΔcH° = −1367,6 kJ/mol z wodą ciekłą (Chao i Rossini, 1965). W Brazylii większość sprzedawanych samochodów może jeździć na etanolu z trzciny cukrowej.',
      },
    },
    photosynthesis: {
      name: 'Fotosynteza',
      tag: { kid: 'Jak liść robi cukier', sci: 'Równanie sumaryczne' },
      fact: {
        kid: 'Liść bierze dwutlenek węgla z powietrza i wodę z ziemi, a dzięki energii światła słonecznego robi cukier (glukozę) i tlen, którym oddychamy.',
        sci: 'ΔH = +2803 kJ, zmagazynowane w glukozie. Wydzielany tlen pochodzi z wody (tlen-18, Ruben i Kamen, 1941): naprawdę to 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O.',
      },
    },
    respiration: {
      name: 'Oddychanie komórkowe',
      tag: { kid: 'Skąd twoje ciało ma energię', sci: 'Oddychanie komórkowe, równanie sumaryczne' },
      fact: {
        kid: 'Twoje komórki powoli spalają cukier z tlenem, którym oddychasz. Energia grzeje cię i daje siłę do ruchu, a wydychasz dwutlenek węgla i wodę: to fotosynteza na odwrót!',
        sci: 'W mitochondriach, w wielu małych krokach. Około jednej trzeciej z 2803 kJ zostaje zachowane jako ATP (około 30 ATP na glukozę); reszta ogrzewa ciało.',
      },
    },
  },
}

const DE = {
  side: { L: { kid: 'Vorher', sci: 'Edukte' }, R: { kid: 'Nachher', sci: 'Produkte' } },
  mol: {
    H2: 'Wasserstoff', O2: 'Sauerstoff', N2: 'Stickstoff', Cl2: 'Chlor', H2O: 'Wasser', CO2: 'Kohlenstoffdioxid', CH4: 'Methan',
    NH3: 'Ammoniak', Na: 'Natrium', NaCl: { kid: 'Salz', sci: 'Natriumchlorid' }, Fe: 'Eisen', Fe2O3: { kid: 'Rost', sci: 'Eisen(III)-oxid' },
    CaO: { kid: 'Branntkalk', sci: 'Calciumoxid' }, CaCO3: { kid: 'Kalkstein', sci: 'Calciumcarbonat' }, C2H5OH: 'Ethanol', C6H12O6: 'Glucose',
  },
  list: 'Reaktionen',
  found: v => `${v.n} von ${v.total} geschafft`,
  help: { kid: 'Tippe auf ein Molekül, um noch eins dazuzutun. Das − nimmt eins weg.', sci: 'Tippe auf ein Molekül, um seinen Koeffizienten zu erhöhen; − senkt ihn.' },
  goal: { kid: 'Mach beide Seiten gleich: zähl jede Sorte Atome.', sci: 'Gleiche die Gleichung aus: gleich viele Atome jedes Elements auf beiden Seiten.' },
  off: { kid: v => `${v.name}: vorher ${v.left}, nachher ${v.right}.`, sci: v => `${v.sym}: links ${v.left}, rechts ${v.right}.` },
  balanced: { kid: 'Beide Seiten stimmen! Tippe auf den Pfeil, damit es passiert.', sci: 'Ausgeglichen. Tippe auf den Pfeil, um sie ablaufen zu lassen.' },
  lowest: {
    kid: v => `So geht es auch, aber es geht mit weniger: jede Zahl lässt sich durch ${v.d} teilen.`,
    sci: v => `Ausgeglichen, aber jeder Koeffizient ist durch ${v.d} teilbar: Chemiker schreiben die kleinsten ganzen Zahlen.`,
  },
  needs: {
    light: { kid: 'Pflanzen brauchen Licht: schalte die Sonnenlampe ein (tippe sie an).', sci: 'Endotherm: sie braucht Licht. Schalte die Lampe ein.' },
    heat: { kid: 'Kalkstein braucht große Hitze: zünde die Flamme an (tippe auf den Brenner).', sci: 'Endotherm: sie braucht Wärme. Zünde den Brenner an.' },
    power: { kid: 'Wasser braucht Strom, um sich zu spalten: schließ die Batterie an (tippe sie an).', sci: 'Endotherm: sie braucht elektrische Arbeit. Schließ die Batterie an.' },
  },
  source: {
    light: { off: 'Sonnenlampe einschalten', on: 'Sonnenlampe an' },
    heat: { off: 'Flamme anzünden', on: 'Flamme brennt' },
    power: { off: 'Batterie anschließen', on: 'Batterie angeschlossen' },
  },
  from: { light: 'aus dem Licht', heat: 'aus der Flamme', power: 'aus dem Strom' },
  run: 'Ablaufen lassen',
  again: 'Noch mal',
  next: 'Weiter',
  running: { kid: 'Die Hände lassen los... und genau dieselben Atome fassen sich neu an!', sci: 'Bindungen brechen, die Atome ordnen sich um, neue Bindungen entstehen: kein Atom geht verloren, keins entsteht.' },
  gave: {
    kid: v => `Sie hat ${v.kJ} kJ Wärme und Licht abgegeben: genug, um ${v.litres} Liter kaltes Wasser zum Kochen zu bringen!`,
    sci: v => `ΔH = ${v.dH} kJ für die Gleichung, wie sie dasteht: exotherm.${v.water ? ` Wasser gezählt als ${v.water}.` : ''}`,
  },
  took: {
    kid: v => `Sie hat ${v.kJ} kJ ${v.from} aufgenommen, so viel, wie man braucht, um ${v.litres} Liter kaltes Wasser zum Kochen zu bringen. Jetzt steckt die Energie in den neuen Molekülen.`,
    sci: v => `ΔH = ${v.dH} kJ für die Gleichung, wie sie dasteht: endotherm, aufgenommen ${v.from}.`,
  },
  water: { label: 'Wasser als', l: 'Flüssigkeit', g: 'Dampf' },
  full: 'Der Tisch ist voll: nimm erst etwas weg.',
  most: 'Neun ist hier das Höchste.',
  locked: 'Tippe auf „Noch mal“, um die Zahlen zu ändern.',
  made: { kid: v => `Geschafft: ${v.name}!`, sci: v => `Ausgeglichen und abgelaufen: ${v.name}` },
  together: 'Wir gleichen zusammen aus: ',
  atoms: 'Atome',
  reactions: {
    hydrogen: {
      name: 'Wasserstoff verbrennt',
      tag: { kid: 'Die Rakete', sci: 'Raketentriebwerke: flüssiger Wasserstoff und flüssiger Sauerstoff' },
      fact: {
        kid: 'Große Raketen verbrennen Wasserstoff mit Sauerstoff. Was aus dem Triebwerk schießt, ist nur Wasser, als sehr heißer Dampf!',
        sci: 'Die Haupttriebwerke des Space Shuttle verbrannten flüssigen Wasserstoff mit flüssigem Sauerstoff; der Abgasstrahl ist Wasserdampf. Pro Kilogramm liefert Wasserstoff mehr Energie als jeder andere chemische Brennstoff: 142 MJ/kg.',
      },
    },
    water: {
      name: 'Wasser spalten',
      tag: { kid: 'Strom zerlegt es', sci: 'Elektrolyse von Wasser' },
      fact: {
        kid: 'Strom kann Wasser in Wasserstoff und Sauerstoff zerlegen: die Rakete rückwärts. Es nimmt genau so viel Energie auf, wie das Verbrennen des Wasserstoffs abgibt.',
        sci: 'ΔH = +571,7 kJ, davon müssen mindestens ΔG = +474,3 kJ als elektrische Arbeit kommen: mindestens 1,23 V an der Zelle. Mit Strom aus Wind oder Sonne entsteht grüner Wasserstoff.',
      },
    },
    methane: {
      name: 'Methan verbrennt',
      tag: { kid: 'Der Gasherd', sci: 'Verbrennung von Erdgas' },
      fact: {
        kid: 'Die blaue Flamme am Gasherd ist Methan, das sich mit Sauerstoff verbindet. Dabei entstehen Kohlenstoffdioxid, Wasser und viel Wärme zum Kochen.',
        sci: 'Erdgas ist größtenteils Methan. ΔcH° = −890,3 kJ/mol mit flüssigem Wasser (Brennwert), −802,3 kJ/mol mit Wasserdampf (Heizwert).',
      },
    },
    salt: {
      name: 'Salz machen',
      tag: { kid: 'Ein Metall trifft ein Giftgas', sci: 'Synthese von Natriumchlorid' },
      fact: {
        kid: 'Natrium ist ein weiches, glänzendes Metall und Chlor ein giftiges grünes Gas. Zusammen brennen sie mit hellgelber Flamme und werden zu dem Salz auf deinem Essen!',
        sci: 'Jedes Natriumatom gibt einem Chloratom ein Elektron: Na⁺ und Cl⁻ in einem Ionengitter, also steht ein Paar für die Formeleinheit. Das Gelb ist das Licht des Natriums bei 589 nm.',
      },
    },
    ammonia: {
      name: 'Ammoniak herstellen',
      tag: { kid: 'Essen aus der Luft', sci: 'Das Haber-Bosch-Verfahren' },
      fact: {
        kid: 'Pflanzen brauchen Stickstoff, und die Luft ist voll davon, aber seine zwei Atome halten sich ganz fest. Fabriken verbinden ihn mit Wasserstoff zu Dünger, der Essen für Milliarden Menschen wachsen lässt.',
        sci: 'Fritz Haber (1909) und Carl Bosch: ein Eisenkatalysator, etwa 400 bis 450 °C und 150 bis 300 bar. Mit seinem Dünger wächst die Nahrung für etwa die Hälfte der Menschheit.',
      },
    },
    limestone: {
      name: 'Kalkstein brennen',
      tag: { kid: 'Kalk für Zement', sci: 'Thermische Zersetzung von Calciumcarbonat' },
      fact: {
        kid: 'Kalkstein, Kreide und Muscheln sind Calciumcarbonat. Werden sie heiß genug, lassen sie Kohlenstoffdioxid los, und übrig bleibt Branntkalk, aus dem man Zement macht.',
        sci: 'Im Kalkofen bei etwa 900 °C; ΔH = +178,3 kJ/mol. Die Zementherstellung setzt dieses CO₂ frei, und noch mehr aus dem Brennstoff: etwa 8 % des weltweiten CO₂-Ausstoßes.',
      },
    },
    rust: {
      name: 'Eisen rostet',
      tag: { kid: 'Ein ganz langsames Feuer', sci: 'Oxidation von Eisen' },
      fact: {
        kid: 'Rost ist Eisen, das sich mit Sauerstoff verbunden hat. Dabei wird auch Wärme frei, aber so langsam, dass du nichts merkst (hier geht es schneller). Taschenwärmer lassen Eisenpulver schnell rosten, um deine Hände zu wärmen!',
        sci: 'Als trockener Hämatit, Fe₂O₃, gerechnet (ΔfH° = −825,5 kJ/mol); echter Rost enthält auch Wasser, Fe₂O₃·nH₂O, und braucht Wasser und Luft, um zu entstehen. Taschenwärmer oxidieren Eisenpulver schnell, mit Salz und Wasser.',
      },
    },
    ethanol: {
      name: 'Ethanol verbrennt',
      tag: { kid: 'Der Spiritusbrenner', sci: 'Ein Treibstoff aus Pflanzen (Bioethanol)' },
      fact: {
        kid: 'Ethanol ist ein flüssiger Brennstoff aus Pflanzen wie Zuckerrohr. Es brennt mit sanfter blauer Flamme im Spiritusbrenner, und manche Autos fahren damit.',
        sci: 'ΔcH° = −1367,6 kJ/mol mit flüssigem Wasser (Chao und Rossini, 1965). In Brasilien können die meisten verkauften Autos mit Ethanol aus Zuckerrohr fahren.',
      },
    },
    photosynthesis: {
      name: 'Photosynthese',
      tag: { kid: 'Wie ein Blatt Zucker macht', sci: 'Die Gesamtgleichung' },
      fact: {
        kid: 'Ein Blatt nimmt Kohlenstoffdioxid aus der Luft und Wasser aus dem Boden und macht mit der Energie des Sonnenlichts Zucker (Glucose) und den Sauerstoff, den wir atmen.',
        sci: 'ΔH = +2803 kJ, gespeichert in der Glucose. Der frei werdende Sauerstoff stammt aus dem Wasser (Sauerstoff-18, Ruben und Kamen, 1941): genau geschrieben 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O.',
      },
    },
    respiration: {
      name: 'Zellatmung',
      tag: { kid: 'Woher dein Körper Energie hat', sci: 'Zellatmung, die Gesamtgleichung' },
      fact: {
        kid: 'Deine Zellen verbrennen Zucker langsam mit dem Sauerstoff, den du einatmest. Die Energie hält dich warm und in Bewegung, und du atmest Kohlenstoffdioxid und Wasser aus: die Photosynthese rückwärts!',
        sci: 'In den Mitochondrien, in vielen kleinen Schritten. Etwa ein Drittel der 2803 kJ wird als ATP gespeichert (etwa 30 ATP pro Glucose); der Rest wärmt den Körper.',
      },
    },
  },
}

export const WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }

const dig = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)

/** A text in the language (English when missing) at the depth ('explorer' or 'scientist'), filled with v. */
export function say(lang, level, path, v = {}) {
  let x = dig(WORDS[lang], path)
  if (x == null) x = dig(EN, path)
  if (x && typeof x === 'object' && ('kid' in x || 'sci' in x)) x = level === 'scientist' ? x.sci ?? x.kid : x.kid ?? x.sci
  return typeof x === 'function' ? x(v) : x ?? ''
}

/** A number in the language's way (a decimal comma but in English, a real minus sign); `plus` writes + too. */
export function num(x, lang, { digits = 0, plus = false } = {}) {
  const s = new Intl.NumberFormat(tagOf(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: 'min2' }).format(Math.abs(x))
  return `${x < 0 ? '−' : plus && x > 0 ? '+' : ''}${s}`
}

/** A molecule's name (Explorer's word or the Scientist's). */
export const molName = (f, lang, level) => say(lang, level, `mol.${f}`)
