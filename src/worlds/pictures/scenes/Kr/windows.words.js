// The words of krypton's windows room ("Why is there gas in your window?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Kr.js (the easel shows it); the room adds three things to do.
// Sources and checks (2026-11-01): krypton 1.14 ppm and argon 0.934% of dry air (about 8000 times more),
// both by-products of air separation; thermal conductivities from src/data/elements.json (krypton 0.0095,
// argon 0.0177, xenon 0.0057, nitrogen 0.026 W/(m.K)) and prices per kilogram from the same file (argon
// 0.931, krypton 290, xenon 1800: krypton about 300 times argon, xenon about 6 times krypton); molar masses
// 83.8, 39.9, 131.3 and 29.0 (air) and so mean speeds as 1/sqrt(M): 0.59, 0.85, 0.47 of air's, about 270,
// 390, 220 and 460 m/s at 20 C; the gases are single atoms, with no rotation or vibration to store heat in,
// unlike N2 and O2. Low-e coatings: silver layers about 10 nm thick put on by magnetron sputtering in a
// vacuum (the "soft" kind), tin oxide put on hot glass at the float line (the "hard" kind); emissivity about
// 0.04 for silver coatings and 0.84 for plain float glass (EN 673); radiation 4 sigma T^3 / (1/e1 + 1/e2 - 1)
// at 283 K: 3.7 against 0.2 W/(m2.K). Gas filling: through a hole in the spacer, to about 90% (a common
// specification, the rest being air); spacer frames filled with a drying agent (desiccant), an edge seal of
// butyl and a second sealant; the European standard for insulating glass, EN 1279-3, limits the gas
// leakage to 1% a year. The "tall gap" convection correlation (Nusselt number from the Rayleigh number, ISO
// 15099's vertical cavity) is used from memory as the room's model: it puts each gas's best width at about 11
// mm for krypton, 16 for argon, 8 for xenon and 18 for air, near the makers' tables (about 8 to 12 mm for
// krypton, 11 to 16 mm for argon). U-values of about 5.8, 2.8 and 0.6 W/(m2.K) are typical for a single pane,
// a double of plain glass with air and a triple of coated glass with krypton, so about a tenth; the glass's
// inside face is at T_in - U x 0.13 x (T_in - T_out), 0.13 m2.K/W being the standard surface resistance of
// the room's air; the dew point of 20 C air at 50% humidity is about 9.3 C. A thermal camera sees the
// infrared a surface gives off, shown in false colour. The room's colour bands on the spacers (grey for air,
// pale blue-green for argon, teal for krypton) are its own device to tell the gases apart, not a factory
// standard. The giant gap is 45 times the real one and the atoms are drawn far bigger than to scale.

const EN = {
  title: 'The window factory',
  greet: {
    kid: 'We are inside the picture, in a window factory on a snowy evening! On the left a line makes triple windows and fills them with gas. In the corner a giant gap shows what the gas does, and on the right a little test house has three windows. The picture\'s story is on the easel.',
    sci: 'A window factory in winter: on the left a line that coats glass, builds a triple-glazed unit and fills its two gaps through the spacer; at the north-east bench a gap enlarged 45 times to show the atoms; on the east wall a test house with a single, a double and a triple window. The picture\'s story is on the easel.',
  },
  talk: {
    kid: [
      'Krypton has no colour and no smell, and there is only a pinch of it in the air: about one part in a million. A factory has to sort a lot of air to get one bottle of it.',
      'Argon is far cheaper and many good windows use it. Krypton keeps even more heat in, so it is chosen for very thin windows and for the very best ones.',
      'The gas stays sealed in the gaps for years. A little slips out slowly, but a good window loses only about a hundredth of it each year.',
    ],
    sci: [
      'Krypton is 1.14 parts per million of the air, argon 0.934%, about 8000 times more. Both are by-products of the plants that make liquid oxygen and nitrogen. In this data krypton costs about 300 times as much as argon per kilogram.',
      'Heat crosses a gas by conduction: the atoms carry energy as they move. At one temperature the mean speed goes as 1 over the square root of the mass, so krypton atoms (83.8 u) travel at about 0.59 of the speed of air\'s molecules (29 u), argon (39.9 u) at 0.85, xenon (131.3 u) at 0.47. Being single atoms they have no spin or vibration to store heat in either.',
      'The European standard for insulating glass (EN 1279-3) limits the gas lost to 1% a year. That takes dry spacers, a double edge seal and a gas that fills the gaps to about 90% or more.',
    ],
  },
  gases: { air: 'Air', argon: 'Argon', krypton: 'Krypton', xenon: 'Xenon' },
  line: {
    label: 'The glass line',
    labelPress: 'The gas press',
    title: 'Making a triple window',
    signs: { coater: 'Coating chamber', spacers: 'Spacer frames', press: 'Gas press', rack: 'Finished windows' },
    hints: {
      pane: 'Tap the glass pane',
      spacer: 'Tap the spacer frames',
      gas: 'Tap a gas bottle',
      plug: 'Tap the red plug',
      wait: 'Watch the line',
    },
    buttons: {
      pane: 'Coat the glass',
      spacer: 'Add spacers and panes',
      air: 'Fill with air',
      argon: 'Fill with argon',
      krypton: 'Fill with krypton',
      plug: 'Seal the plug',
    },
    board: {
      title: 'Gas in the gaps',
      note: { kid: 'about 90 parts in 100 are gas', sci: 'about 90% gas, the rest air' },
    },
    says: {
      coated: {
        kid: 'The glass rode through the coating chamber. It now has a coating you cannot see, much thinner than a hair, that keeps the heat in. Look for a faint gold shimmer where the light catches it.',
        sci: 'In the chamber a magnetron sputters a stack of thin layers onto the glass in a vacuum, the silver ones only about 10 nm thick: a low-emissivity coating. Seen at a slant it gives a faint gold shimmer.',
      },
      stacked: {
        kid: 'A spacer frame on the coated pane, a second pane, another frame, a third pane: two gaps, each thinner than your finger. A dry powder inside the frames keeps the gaps from misting up.',
        sci: 'Hollow spacer frames, filled with a drying agent so the trapped gas stays dry, hold the three panes 8 to 18 mm apart. An edge seal of butyl and a second sealant will close the unit.',
      },
      air: {
        kid: 'The press pushes air into both gaps. That is what most old double windows have. Air passes heat on nearly three times as fast as krypton.',
        sci: 'Dry air, 0.026 W/(m·K): the baseline, and what most older double windows hold. Its conductivity is nearly 3 times krypton\'s.',
      },
      argon: {
        kid: 'The press pushes argon in through a tiny hole in the spacer. Argon comes from the air and passes heat on about two thirds as fast as air does.',
        sci: 'Argon, 0.0177 W/(m·K), 0.93% of the air and a cheap by-product of air separation: the usual fill. It drives out the air through the hole, and in practice a gap ends up about 90% argon, the rest being air that never quite leaves.',
      },
      krypton: {
        kid: 'Now krypton! The press fills both gaps. Krypton\'s heavy atoms move slowly, so it passes heat on only about a third as fast as air.',
        sci: 'Krypton, 0.0095 W/(m·K), 83.8 u. Dearer than argon, but its gaps can be thinner, so it suits slim triple glazing. The gauge climbs to about 90%, the usual aim, as some air stays behind.',
      },
      filled: {
        kid: 'The gaps are full! Now tap the red plug to seal the hole in the spacer.',
        sci: 'The gaps are at their fill, about 90% gas. Tap the red plug to seal the hole in the spacer before the gas escapes.',
      },
      sealedAir: {
        kid: 'Sealed, and on the rack. Its spacer has a grey band, so nobody mixes up the gases. Plain air is the cheapest and the leakiest for heat.',
        sci: 'Sealed and racked, with a grey band on its spacer. The colours are this room\'s own, to tell the gases apart.',
      },
      sealedArgon: {
        kid: 'Sealed, and on the rack. Its spacer has a pale blue-green band for argon. A good everyday window!',
        sci: 'Sealed and racked, with a pale blue-green band on its spacer for argon. The colours are this room\'s own.',
      },
      sealedKrypton: {
        kid: 'Sealed, and on the rack. Its spacer has a teal band for krypton: the window for the coldest places.',
        sci: 'Sealed and racked, with a teal band on its spacer for krypton. The colours are this room\'s own.',
      },
      paneBusy: {
        kid: 'One window at a time: finish this one first!',
        sci: 'One unit at a time: finish this one first.',
      },
    },
    panel: {
      kid: [
        'A window with three panes has two gaps. Heat crosses a gap through the gas in it, so the gas decides how well the window keeps the warmth in.',
        'Tap the glass to coat it, the spacer frames to build the window, then a gas bottle. The press fills the gaps through a hole in the spacer, and you seal it with the red plug.',
        'Try all three gases: each finished window goes on its own shelf.',
      ],
      sci: [
        'Making a triple-glazed unit: a low-emissivity coating on one pane (silver by magnetron sputtering in a vacuum; tin oxide is the other kind, put on the hot glass as it is made), spacer frames with desiccant, an edge seal, then gas filling through a hole in the spacer.',
        'Filling drives out the air, but never all of it: units are filled to about 90% or more. The gas leaks out slowly; a standard (EN 1279-3) allows 1% a year.',
        'Argon is the usual fill. Krypton, about 300 times dearer per kilogram in this data, is for thin gaps: its best width is about 8 to 12 mm, against about 15 mm for argon.',
      ],
    },
  },
  gap: {
    label: 'The giant gap',
    title: 'Which gas keeps heat in?',
    slider: 'Width of the gap',
    signs: { warm: 'Warm room', cold: 'Cold outside', best: 'best: {mm} mm' },
    hints: { coat: 'Tap a gas bottle, or the cold glass', slide: 'Tap a gas bottle, or slide the width' },
    buttons: { air: 'Air', argon: 'Argon', krypton: 'Krypton', xenon: 'Xenon', coat: 'Coating on or off' },
    meter: {
      title: 'Heat through the gap (15 degrees warmer on one side)',
      conduction: 'Atoms bumping',
      rolling: 'Gas rolling round',
      rays: 'Heat light',
      airMark: 'plain air, bare glass',
      coated: 'coated',
      kid: 'Plain air and bare glass: 1.00. This gap: {x}.',
      sci: 'k = {k} W/(m·K), Nu = {nu}',
      sci2: 'per m² of glass, {dt} K across the gap',
    },
    says: {
      air: {
        kid: 'Air: its molecules dart about fast. Watch them carry the red warmth across to the blue side.',
        sci: 'Air, mean molecular mass 29 u, mean speed about 460 m/s at room temperature, conductivity 0.026 W/(m·K). The speeds on show are to scale with each other.',
      },
      argon: {
        kid: 'Argon atoms are heavier and a little slower. The heat gets across more slowly than in air.',
        sci: 'Argon, 39.9 u: about 390 m/s (0.85 of air\'s), conductivity 0.0177 W/(m·K).',
      },
      krypton: {
        kid: 'Krypton atoms are heavy and amble along. The red warmth hops across the gap much more slowly.',
        sci: 'Krypton, 83.8 u: about 270 m/s (0.59 of air\'s), conductivity 0.0095 W/(m·K), 0.37 of air\'s.',
      },
      xenon: {
        kid: 'Xenon is heavier and slower still, and it keeps heat in even better. But there is almost none in the air, so it costs far too much for windows.',
        sci: 'Xenon, 131.3 u: about 220 m/s (0.47 of air\'s), conductivity 0.0057 W/(m·K). About 0.09 ppm of the air and about 6 times krypton\'s price in this data: too dear for windows.',
      },
      coatOn: {
        kid: 'The coating is on! The red arrows are heat light from the warm side. The coating turns them back, like a mirror for heat. See the meter fall.',
        sci: 'A silver low-emissivity coating (emissivity about 0.04 against 0.84 for plain glass) reflects the infrared: the gap\'s radiation falls from about 3.7 to about 0.2 W/(m²·K).',
      },
      coatOff: {
        kid: 'Without the coating the heat light flies straight across and warms the cold glass. In a plain gap that is the biggest leak of all.',
        sci: 'Bare glass: the infrared crosses freely, about 3.7 W/(m²·K), more than the gas conducts across 12 mm of air (about 2.2).',
      },
      rolling: {
        kid: 'Careful: the gap is wide now, so the gas starts to roll round in loops and carries heat across faster. Narrower is better, up to a point.',
        sci: 'Convection sets in: the Nusselt number rises above 1 as the gas rises on the warm side and falls on the cold side, so a wider gap stops helping.',
      },
    },
    panel: {
      kid: [
        'Heat crosses a gas when its atoms bump into each other and pass the jiggle along. Choose a gas and watch: red atoms carry warmth, blue ones are cold. Heavy atoms move slower and pass it on more slowly.',
        'Slide the width: a wider gap means more atoms to cross, but past a point the gas rolls round in loops and carries the heat. The gold mark on the ruler is each gas\'s best width.',
        'Then tap the cold glass to coat it. Most of the heat in a plain gap does not travel by atoms at all: it is heat light, and the coating bounces it back.',
      ],
      sci: [
        'The model, for 15 K across the gap: conduction k/d; convection through the Nusselt number of a tall gap (from the Rayleigh number: it is 1 until the gas starts to circulate); radiation 4σT³ times the effective emissivity, with 0.84 for glass and 0.04 for a silver coating. The giant gap is 45 times the real one and the atoms are drawn far bigger than to scale; their speeds are right relative to each other.',
        'Conductivities from the element data (krypton 0.0095, argon 0.0177, xenon 0.0057, air 0.026 W/(m·K)). The best widths come out near 11 mm for krypton and 16 mm for argon; makers\' tables say about 8 to 12 mm and 11 to 16 mm.',
        'The coating matters more than the gas: bare glass loses more by radiation (about 56 W/m² for 15 K) than conduction through 12 mm of krypton does (about 12).',
      ],
    },
  },
  house: {
    label: 'The test house',
    title: 'Three windows, one cold night',
    slider: 'Cold outside',
    signs: {
      single: 'One pane',
      double: 'Two panes, air',
      triple: 'Three panes, krypton',
      camera: 'Heat camera',
      thermo: 'Outside {out} °C, inside {in} °C',
    },
    hints: { camera: 'Tap the heat camera', lens: 'Tap the krypton window', slide: 'Slide the cold outside' },
    buttons: { camera: 'Heat camera on or off', lens: 'Lens on the krypton gap' },
    meter: { kid: 'Loses {x} times as much as the krypton window', best: 'The best of the three' },
    legend: {
      title: 'Warmth of the glass, inside',
      kid: 'Dark is cold, yellow is warm. The single pane is much colder than the krypton window, which is nearly as warm as the room.',
      sci: 'Inside face = 20 − U × 0.13 × (20 − T_out). Room air at 20 °C and 50% humidity has a dew point near {dew} °C: glass colder than that mists up.',
    },
    lens: {
      room: 'room',
      outside: 'outside',
      note: { kid: 'Big slow atoms: the warm wave dies out.', sci: 'A drawing of a krypton gap, not to scale: the heat\'s wave weakens as it crosses.' },
    },
    says: {
      camera: {
        kid: 'The heat camera sees warmth, not light. The single pane is far colder than the krypton window, and the cat glows!',
        sci: 'A thermal image of the inside faces, from the model. At −10 °C outside: single glazing about −3 °C, the double about 9 °C, the triple about 18 °C. The cat\'s coat is warmer than the wall.',
      },
      cameraOff: { kid: 'Camera off: back to what we can see.', sci: 'Camera off: back to visible light.' },
      lens: {
        kid: 'A lens on the krypton gap, like the picture\'s close-up: big slow atoms, and the warm wave dies out before it reaches the cold side.',
        sci: 'The lens is a drawing of a krypton gap, atoms not to scale: each slow atom passes on only a little, so the wave of heat weakens across it.',
      },
      lensOff: { kid: 'Lens away.', sci: 'Lens away.' },
    },
    panel: {
      kid: [
        'Three windows in one wall: one pane, two panes with air, and three panes with krypton and coatings. Slide the cold outside and watch how many watts each one lets out.',
        'Tap the heat camera to see how warm the glass is. Tap the krypton window for a close-up lens.',
        'The best window lets out about a tenth of what the single pane does.',
      ],
      sci: [
        'Typical U-values: single glazing about 5.8, double of plain glass with air about 2.8, triple with krypton and coatings about 0.6 W/(m²·K). The heat flow is Q = U × A × ΔT, for a window of 1.1 by 1.35 m and 20 °C inside.',
        'The inside face of the glass is at T_in − U × 0.13 × ΔT, 0.13 m²·K/W being the standard film of air on the inside surface: at −10 °C outside the single pane is near −3 °C and the triple about 18 °C.',
        'Real windows vary with the frame, the edge spacer, the coatings and the gap widths. These are round, typical figures.',
      ],
    },
  },
}

const PT = {
  title: 'A fábrica de janelas',
  greet: {
    kid: 'Estamos dentro da imagem, numa fábrica de janelas numa noite de neve! À esquerda, uma linha faz janelas de vidro triplo e enche-as de gás. No canto, um espaço gigante mostra o que o gás faz, e à direita uma casa de teste tem três janelas. A história da imagem está no cavalete.',
    sci: 'Uma fábrica de janelas no inverno: à esquerda, uma linha que reveste o vidro, monta uma unidade de vidro triplo e enche os seus dois espaços através do espaçador; na bancada a nordeste, um espaço ampliado 45 vezes para se verem os átomos; na parede leste, uma casa de teste com uma janela de vidro simples, uma de vidro duplo e uma de vidro triplo. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'O crípton não tem cor nem cheiro, e há só uma pitada dele no ar: cerca de uma parte em cada milhão. Uma fábrica tem de separar muito ar para obter uma garrafa.',
      'O árgon é muito mais barato e muitas boas janelas usam-no. O crípton guarda ainda mais calor, por isso é escolhido para janelas muito finas e para as melhores de todas.',
      'O gás fica fechado nos espaços durante anos. Um pouco escapa devagar, mas uma boa janela perde só cerca de um centésimo por ano.',
    ],
    sci: [
      'O crípton é 1,14 partes por milhão do ar, o árgon 0,934%, cerca de 8000 vezes mais. Ambos são subprodutos das fábricas que fazem oxigénio e azoto líquidos. Nestes dados, o crípton custa cerca de 300 vezes mais do que o árgon por quilograma.',
      'O calor atravessa um gás por condução: os átomos levam a energia ao moverem-se. À mesma temperatura, a velocidade média é inversamente proporcional à raiz quadrada da massa, por isso os átomos de crípton (83,8 u) andam a cerca de 0,59 da velocidade das moléculas do ar (29 u), o árgon (39,9 u) a 0,85 e o xénon (131,3 u) a 0,47. Sendo átomos isolados, também não têm rotação nem vibração onde guardar calor.',
      'A norma europeia do vidro isolante (EN 1279-3) limita o gás perdido a 1% por ano. Isso exige espaçadores secos, uma dupla selagem da borda e um gás que encha os espaços até cerca de 90% ou mais.',
    ],
  },
  gases: { air: 'Ar', argon: 'Árgon', krypton: 'Crípton', xenon: 'Xénon' },
  line: {
    label: 'A linha do vidro',
    labelPress: 'A prensa de gás',
    title: 'Fazer uma janela tripla',
    signs: { coater: 'Câmara de revestimento', spacers: 'Caixilhos espaçadores', press: 'Prensa de gás', rack: 'Janelas prontas' },
    hints: {
      pane: 'Toca no vidro',
      spacer: 'Toca nos espaçadores',
      gas: 'Toca numa garrafa de gás',
      plug: 'Toca na tampa vermelha',
      wait: 'Vê a linha a trabalhar',
    },
    buttons: {
      pane: 'Revestir o vidro',
      spacer: 'Juntar espaçadores e vidros',
      air: 'Encher com ar',
      argon: 'Encher com árgon',
      krypton: 'Encher com crípton',
      plug: 'Selar a tampa',
    },
    board: {
      title: 'Gás nos espaços',
      note: { kid: 'cerca de 90 em cada 100 são gás', sci: 'cerca de 90% de gás, o resto é ar' },
    },
    says: {
      coated: {
        kid: 'O vidro passou pela câmara de revestimento. Agora tem uma camada que não se vê, muito mais fina do que um cabelo, que guarda o calor. Procura um brilho dourado ténue onde a luz bate.',
        sci: 'Na câmara, um magnetrão deposita no vidro, em vácuo, uma pilha de camadas finas, as de prata com apenas cerca de 10 nm: um revestimento de baixa emissividade. Visto de lado, dá um brilho dourado ténue.',
      },
      stacked: {
        kid: 'Um espaçador sobre o vidro revestido, um segundo vidro, outro espaçador, um terceiro vidro: dois espaços, cada um mais fino do que o teu dedo. Um pó seco dentro dos espaçadores impede que os espaços fiquem embaciados.',
        sci: 'Espaçadores ocos, cheios de um agente secante para o gás ficar seco, mantêm os três vidros a 8 a 18 mm uns dos outros. Uma selagem de butilo e um segundo vedante vão fechar a unidade.',
      },
      air: {
        kid: 'A prensa enche os dois espaços com ar. É o que a maioria das janelas duplas antigas tem. O ar passa o calor quase três vezes mais depressa do que o crípton.',
        sci: 'Ar seco, 0,026 W/(m·K): a referência, e o que a maioria das janelas duplas mais antigas tem. A sua condutividade é quase 3 vezes a do crípton.',
      },
      argon: {
        kid: 'A prensa enche com árgon, por um buraquinho no espaçador. O árgon vem do ar e passa o calor cerca de dois terços tão depressa como o ar.',
        sci: 'Árgon, 0,0177 W/(m·K), 0,93% do ar e um subproduto barato da separação do ar: o enchimento habitual. Expulsa o ar pelo buraco e, na prática, o espaço fica com cerca de 90% de árgon, e o resto é ar que nunca sai de todo.',
      },
      krypton: {
        kid: 'Agora crípton! A prensa enche os dois espaços. Os átomos pesados do crípton movem-se devagar, por isso passa o calor só cerca de um terço tão depressa como o ar.',
        sci: 'Crípton, 0,0095 W/(m·K), 83,8 u. Mais caro do que o árgon, mas os seus espaços podem ser mais finos, por isso serve para vidros triplos esbeltos. O manómetro sobe até cerca de 90%, o objetivo habitual, porque fica sempre algum ar.',
      },
      filled: {
        kid: 'Os espaços estão cheios! Agora toca na tampa vermelha para selar o buraco do espaçador.',
        sci: 'Os espaços estão cheios, com cerca de 90% de gás. Toca na tampa vermelha para selar o buraco do espaçador antes de o gás escapar.',
      },
      sealedAir: {
        kid: 'Selada e na estante. O espaçador tem uma faixa cinzenta, para ninguém trocar os gases. O ar simples é o mais barato e o que mais deixa fugir o calor.',
        sci: 'Selada e na estante, com uma faixa cinzenta no espaçador. As cores são só desta sala, para distinguir os gases.',
      },
      sealedArgon: {
        kid: 'Selada e na estante. O espaçador tem uma faixa azul-esverdeada clara, a do árgon. Uma boa janela para todos os dias!',
        sci: 'Selada e na estante, com uma faixa azul-esverdeada clara no espaçador, a do árgon. As cores são só desta sala.',
      },
      sealedKrypton: {
        kid: 'Selada e na estante. O espaçador tem uma faixa azul-petróleo, a do crípton: a janela para os sítios mais frios.',
        sci: 'Selada e na estante, com uma faixa azul-petróleo no espaçador, a do crípton. As cores são só desta sala.',
      },
      paneBusy: {
        kid: 'Uma janela de cada vez: acaba primeiro esta!',
        sci: 'Uma unidade de cada vez: acaba primeiro esta.',
      },
    },
    panel: {
      kid: [
        'Uma janela com três vidros tem dois espaços. O calor atravessa um espaço pelo gás que lá está, por isso o gás decide quão bem a janela guarda o calor.',
        'Toca no vidro para o revestir, nos espaçadores para montar a janela, e depois numa garrafa de gás. A prensa enche os espaços por um buraco do espaçador, e tu selas com a tampa vermelha.',
        'Experimenta os três gases: cada janela pronta vai para a sua prateleira.',
      ],
      sci: [
        'Fazer uma unidade de vidro triplo: um revestimento de baixa emissividade num vidro (prata por pulverização catódica magnetrão em vácuo; o óxido de estanho é o outro tipo, aplicado no vidro ainda quente quando é fabricado), espaçadores com secante, uma selagem da borda e depois o enchimento com gás por um buraco do espaçador.',
        'O enchimento expulsa o ar, mas nunca todo: as unidades são enchidas até cerca de 90% ou mais. O gás escapa devagar; uma norma (EN 1279-3) permite 1% por ano.',
        'O árgon é o enchimento habitual. O crípton, cerca de 300 vezes mais caro por quilograma nestes dados, é para espaços finos: a sua largura ideal é de cerca de 8 a 12 mm, contra cerca de 15 mm para o árgon.',
      ],
    },
  },
  gap: {
    label: 'O espaço gigante',
    title: 'Que gás guarda o calor?',
    slider: 'Largura do espaço',
    signs: { warm: 'Sala quente', cold: 'Frio lá fora', best: 'ideal: {mm} mm' },
    hints: { coat: 'Toca numa garrafa de gás, ou no vidro frio', slide: 'Toca numa garrafa de gás, ou muda a largura' },
    buttons: { air: 'Ar', argon: 'Árgon', krypton: 'Crípton', xenon: 'Xénon', coat: 'Revestimento ligado ou desligado' },
    meter: {
      title: 'Calor através do espaço (15 graus mais quente de um lado)',
      conduction: 'Átomos a chocar',
      rolling: 'Gás a rodar',
      rays: 'Luz de calor',
      airMark: 'ar simples, vidro sem revestimento',
      coated: 'revestido',
      kid: 'Ar simples e vidro sem revestimento: 1,00. Este espaço: {x}.',
      sci: 'k = {k} W/(m·K), Nu = {nu}',
      sci2: 'por m² de vidro, {dt} K através do espaço',
    },
    says: {
      air: {
        kid: 'Ar: as suas moléculas disparam depressa. Vê como levam o calor vermelho até ao lado azul.',
        sci: 'Ar, massa molecular média 29 u, velocidade média cerca de 460 m/s à temperatura ambiente, condutividade 0,026 W/(m·K). As velocidades mostradas estão à escala umas das outras.',
      },
      argon: {
        kid: 'Os átomos de árgon são mais pesados e um pouco mais lentos. O calor atravessa mais devagar do que no ar.',
        sci: 'Árgon, 39,9 u: cerca de 390 m/s (0,85 do ar), condutividade 0,0177 W/(m·K).',
      },
      krypton: {
        kid: 'Os átomos de crípton são pesados e passeiam devagar. O calor vermelho salta pelo espaço muito mais lentamente.',
        sci: 'Crípton, 83,8 u: cerca de 270 m/s (0,59 do ar), condutividade 0,0095 W/(m·K), 0,37 da do ar.',
      },
      xenon: {
        kid: 'O xénon é ainda mais pesado e lento, e guarda ainda melhor o calor. Mas quase não há no ar, por isso custa demasiado para janelas.',
        sci: 'Xénon, 131,3 u: cerca de 220 m/s (0,47 do ar), condutividade 0,0057 W/(m·K). Cerca de 0,09 ppm do ar e cerca de 6 vezes o preço do crípton nestes dados: caro demais para janelas.',
      },
      coatOn: {
        kid: 'O revestimento está posto! As setas vermelhas são luz de calor do lado quente. O revestimento devolve-as, como um espelho para o calor. Vê o medidor descer.',
        sci: 'Um revestimento de prata de baixa emissividade (cerca de 0,04, contra 0,84 do vidro simples) reflete o infravermelho: a radiação do espaço desce de cerca de 3,7 para cerca de 0,2 W/(m²·K).',
      },
      coatOff: {
        kid: 'Sem o revestimento, a luz de calor atravessa tudo e aquece o vidro frio. Num espaço simples, é a maior fuga de todas.',
        sci: 'Vidro sem revestimento: o infravermelho passa livremente, cerca de 3,7 W/(m²·K), mais do que o gás conduz através de 12 mm de ar (cerca de 2,2).',
      },
      rolling: {
        kid: 'Cuidado: o espaço está largo, por isso o gás começa a rodar em voltas e leva o calor mais depressa. Mais estreito é melhor, até certo ponto.',
        sci: 'Começa a convecção: o número de Nusselt sobe acima de 1 quando o gás sobe do lado quente e desce do lado frio, e um espaço mais largo deixa de ajudar.',
      },
    },
    panel: {
      kid: [
        'O calor atravessa um gás quando os átomos chocam uns com os outros e passam o abanão. Escolhe um gás e observa: os átomos vermelhos levam calor, os azuis estão frios. Os átomos pesados movem-se mais devagar e passam-no mais devagar.',
        'Muda a largura: um espaço mais largo tem mais átomos a atravessar, mas a partir de certo ponto o gás roda em voltas e leva o calor. A marca dourada na régua é a largura ideal de cada gás.',
        'Depois toca no vidro frio para o revestir. A maior parte do calor num espaço simples não viaja por átomos: é luz de calor, e o revestimento devolve-a.',
      ],
      sci: [
        'O modelo, para 15 K através do espaço: condução k/d; convecção pelo número de Nusselt de um espaço alto (a partir do número de Rayleigh: vale 1 até o gás começar a circular); radiação 4σT³ vezes a emissividade efetiva, com 0,84 para o vidro e 0,04 para um revestimento de prata. O espaço gigante é 45 vezes o real e os átomos estão desenhados muito maiores do que à escala; as suas velocidades estão certas umas em relação às outras.',
        'Condutividades dos dados dos elementos (crípton 0,0095, árgon 0,0177, xénon 0,0057, ar 0,026 W/(m·K)). As larguras ideais saem perto de 11 mm para o crípton e 16 mm para o árgon; as tabelas dos fabricantes dizem cerca de 8 a 12 mm e 11 a 16 mm.',
        'O revestimento conta mais do que o gás: o vidro sem revestimento perde mais por radiação (cerca de 56 W/m² para 15 K) do que por condução através de 12 mm de crípton (cerca de 12).',
      ],
    },
  },
  house: {
    label: 'A casa de teste',
    title: 'Três janelas, uma noite fria',
    slider: 'Frio lá fora',
    signs: {
      single: 'Um vidro',
      double: 'Dois vidros, ar',
      triple: 'Três vidros, crípton',
      camera: 'Câmara de calor',
      thermo: 'Fora {out} °C, dentro {in} °C',
    },
    hints: { camera: 'Toca na câmara de calor', lens: 'Toca na janela de crípton', slide: 'Muda o frio lá fora' },
    buttons: { camera: 'Câmara de calor ligada ou desligada', lens: 'Lente no espaço de crípton' },
    meter: { kid: 'Perde {x} vezes mais do que a janela de crípton', best: 'A melhor das três' },
    legend: {
      title: 'Calor do vidro, por dentro',
      kid: 'Escuro é frio, amarelo é quente. O vidro simples é muito mais frio do que a janela de crípton, que está quase tão quente como a sala.',
      sci: 'Face interior = 20 − U × 0,13 × (20 − T_ext). O ar da sala a 20 °C e 50% de humidade tem ponto de orvalho perto de {dew} °C: o vidro mais frio do que isso embacia.',
    },
    lens: {
      room: 'sala',
      outside: 'fora',
      note: { kid: 'Átomos grandes e lentos: a onda de calor desvanece-se.', sci: 'Um desenho de um espaço de crípton, fora de escala: a onda de calor enfraquece ao atravessá-lo.' },
    },
    says: {
      camera: {
        kid: 'A câmara de calor vê o calor, não a luz. O vidro simples está muito mais frio do que a janela de crípton, e o gato brilha!',
        sci: 'Uma imagem térmica das faces interiores, a partir do modelo. Com −10 °C lá fora: vidro simples cerca de −3 °C, o duplo cerca de 9 °C, o triplo cerca de 18 °C. O pelo do gato está mais quente do que a parede.',
      },
      cameraOff: { kid: 'Câmara desligada: voltamos ao que se vê.', sci: 'Câmara desligada: voltamos à luz visível.' },
      lens: {
        kid: 'Uma lente no espaço de crípton, como o pormenor da imagem: átomos grandes e lentos, e a onda de calor desvanece-se antes de chegar ao lado frio.',
        sci: 'A lente é um desenho de um espaço de crípton, átomos fora de escala: cada átomo lento passa só um pouco, por isso a onda de calor enfraquece ao atravessá-lo.',
      },
      lensOff: { kid: 'Lente guardada.', sci: 'Lente guardada.' },
    },
    panel: {
      kid: [
        'Três janelas na mesma parede: um vidro, dois vidros com ar, e três vidros com crípton e revestimentos. Muda o frio lá fora e vê quantos watts deixa sair cada uma.',
        'Toca na câmara de calor para ver quão quente está o vidro. Toca na janela de crípton para uma lente de pormenor.',
        'A melhor janela deixa sair cerca de um décimo do que deixa o vidro simples.',
      ],
      sci: [
        'Valores U típicos: vidro simples cerca de 5,8, duplo de vidro simples com ar cerca de 2,8, triplo com crípton e revestimentos cerca de 0,6 W/(m²·K). O fluxo de calor é Q = U × A × ΔT, para uma janela de 1,1 por 1,35 m e 20 °C dentro.',
        'A face interior do vidro está a T_int − U × 0,13 × ΔT, sendo 0,13 m²·K/W a película de ar normal na superfície interior: com −10 °C lá fora, o vidro simples está perto de −3 °C e o triplo a cerca de 18 °C.',
        'As janelas reais variam com a caixilharia, o espaçador, os revestimentos e a largura dos espaços. Estes são valores típicos, arredondados.',
      ],
    },
  },
}

const PL = {
  title: 'Fabryka okien',
  greet: {
    kid: 'Jesteśmy w obrazku, w fabryce okien w śnieżny wieczór! Po lewej linia robi okna trzyszybowe i napełnia je gazem. W rogu olbrzymia szczelina pokazuje, co robi gaz, a po prawej mały dom testowy ma trzy okna. Historia obrazka stoi na sztalugach.',
    sci: 'Fabryka okien zimą: po lewej linia, która pokrywa szkło powłoką, składa pakiet trzyszybowy i napełnia jego dwie szczeliny przez ramkę; przy stole na północnym wschodzie szczelina powiększona 45 razy, żeby było widać atomy; przy wschodniej ścianie dom testowy z oknem jednoszybowym, dwuszybowym i trzyszybowym. Historia obrazka stoi na sztalugach.',
  },
  talk: {
    kid: [
      'Krypton nie ma koloru ani zapachu, a w powietrzu jest go tylko szczypta: mniej więcej jedna część na milion. Fabryka musi rozdzielić mnóstwo powietrza, żeby dostać jedną butlę.',
      'Argon jest dużo tańszy i wiele dobrych okien go używa. Krypton trzyma jeszcze więcej ciepła, więc wybiera się go do bardzo cienkich okien i do tych najlepszych.',
      'Gaz zostaje zamknięty w szczelinach na lata. Trochę ucieka powoli, ale dobre okno traci go tylko około setnej części rocznie.',
    ],
    sci: [
      'Krypton to 1,14 części na milion powietrza, argon 0,934%, czyli około 8000 razy więcej. Oba są produktami ubocznymi zakładów, które robią ciekły tlen i azot. W tych danych krypton kosztuje około 300 razy więcej niż argon za kilogram.',
      'Ciepło przechodzi przez gaz przez przewodzenie: atomy niosą energię, gdy się poruszają. W tej samej temperaturze średnia prędkość jest odwrotnie proporcjonalna do pierwiastka z masy, więc atomy kryptonu (83,8 u) poruszają się z około 0,59 prędkości cząsteczek powietrza (29 u), argonu (39,9 u) z 0,85, ksenonu (131,3 u) z 0,47. Jako pojedyncze atomy nie mają też obrotów ani drgań, w których mogłyby magazynować ciepło.',
      'Europejska norma szyb zespolonych (EN 1279-3) ogranicza ucieczkę gazu do 1% rocznie. Wymaga to suchych ramek, podwójnego uszczelnienia brzegu i gazu, który wypełnia szczeliny w około 90% lub więcej.',
    ],
  },
  gases: { air: 'Powietrze', argon: 'Argon', krypton: 'Krypton', xenon: 'Ksenon' },
  line: {
    label: 'Linia szkła',
    labelPress: 'Prasa gazowa',
    title: 'Jak się robi okno trzyszybowe',
    signs: { coater: 'Komora powłok', spacers: 'Ramki dystansowe', press: 'Prasa gazowa', rack: 'Gotowe okna' },
    hints: {
      pane: 'Dotknij szyby',
      spacer: 'Dotknij ramek',
      gas: 'Dotknij butli z gazem',
      plug: 'Dotknij czerwonego korka',
      wait: 'Patrz, jak linia pracuje',
    },
    buttons: {
      pane: 'Pokryj szkło',
      spacer: 'Dodaj ramki i szyby',
      air: 'Napełnij powietrzem',
      argon: 'Napełnij argonem',
      krypton: 'Napełnij kryptonem',
      plug: 'Zamknij korek',
    },
    board: {
      title: 'Gaz w szczelinach',
      note: { kid: 'około 90 na 100 to gaz', sci: 'około 90% gazu, reszta to powietrze' },
    },
    says: {
      coated: {
        kid: 'Szyba przejechała przez komorę powłok. Ma teraz warstwę, której nie widać, dużo cieńszą niż włos, która zatrzymuje ciepło. Poszukaj słabego złotego połysku tam, gdzie pada światło.',
        sci: 'W komorze magnetron napyla w próżni stos cienkich warstw, srebrne mają tylko około 10 nm: to powłoka niskoemisyjna. Patrząc pod kątem, widać słaby złoty połysk.',
      },
      stacked: {
        kid: 'Ramka na pokrytej szybie, druga szyba, druga ramka, trzecia szyba: dwie szczeliny, każda cieńsza niż twój palec. Suchy proszek w ramkach nie pozwala, by szczeliny zaparowały.',
        sci: 'Puste ramki dystansowe z środkiem suszącym, by zamknięty gaz był suchy, trzymają trzy szyby w odstępach 8 do 18 mm. Uszczelnienie z butylu i drugi uszczelniacz zamkną pakiet.',
      },
      air: {
        kid: 'Prasa wtłacza powietrze w obie szczeliny. Tak jest w większości starych okien dwuszybowych. Powietrze przewodzi ciepło prawie trzy razy szybciej niż krypton.',
        sci: 'Suche powietrze, 0,026 W/(m·K): punkt odniesienia i to, co mają starsze okna dwuszybowe. Jego przewodność jest prawie 3 razy większa niż kryptonu.',
      },
      argon: {
        kid: 'Prasa wtłacza argon przez maleńki otwór w ramce. Argon pochodzi z powietrza i przewodzi ciepło mniej więcej dwie trzecie tak szybko jak powietrze.',
        sci: 'Argon, 0,0177 W/(m·K), 0,93% powietrza i tani produkt uboczny rozdziału powietrza: zwykłe wypełnienie. Wypiera powietrze przez otwór, a w praktyce szczelina ma około 90% argonu, resztę stanowi powietrze, które nigdy nie wychodzi do końca.',
      },
      krypton: {
        kid: 'Teraz krypton! Prasa napełnia obie szczeliny. Ciężkie atomy kryptonu poruszają się wolno, więc przewodzi ciepło tylko około trzy razy gorzej niż powietrze.',
        sci: 'Krypton, 0,0095 W/(m·K), 83,8 u. Droższy od argonu, ale jego szczeliny mogą być cieńsze, więc pasuje do smukłych szyb trzyszybowych. Wskaźnik rośnie do około 90%, zwykłego celu, bo zawsze zostaje trochę powietrza.',
      },
      filled: {
        kid: 'Szczeliny są pełne! Dotknij czerwonego korka, żeby zamknąć otwór w ramce.',
        sci: 'Szczeliny są napełnione, około 90% gazu. Dotknij czerwonego korka, by zamknąć otwór w ramce, zanim gaz ucieknie.',
      },
      sealedAir: {
        kid: 'Zamknięte i na regale. Ramka ma szary pasek, żeby nikt nie pomylił gazów. Zwykłe powietrze jest najtańsze i najgorzej trzyma ciepło.',
        sci: 'Zamknięte i na regale, z szarym paskiem na ramce. Kolory są tylko tej sali, żeby odróżnić gazy.',
      },
      sealedArgon: {
        kid: 'Zamknięte i na regale. Ramka ma jasny niebieskozielony pasek argonu. Dobre okno na co dzień!',
        sci: 'Zamknięte i na regale, z jasnym niebieskozielonym paskiem argonu na ramce. Kolory są tylko tej sali.',
      },
      sealedKrypton: {
        kid: 'Zamknięte i na regale. Ramka ma morski pasek kryptonu: okno na najzimniejsze miejsca.',
        sci: 'Zamknięte i na regale, z morskim paskiem kryptonu na ramce. Kolory są tylko tej sali.',
      },
      paneBusy: {
        kid: 'Jedno okno naraz: skończ najpierw to!',
        sci: 'Jeden pakiet naraz: skończ najpierw ten.',
      },
    },
    panel: {
      kid: [
        'Okno z trzema szybami ma dwie szczeliny. Ciepło przechodzi przez szczelinę przez gaz, który w niej jest, więc gaz decyduje, jak dobrze okno trzyma ciepło.',
        'Dotknij szyby, żeby ją pokryć, ramek, żeby zbudować okno, a potem butli z gazem. Prasa napełnia szczeliny przez otwór w ramce, a ty zamykasz go czerwonym korkiem.',
        'Wypróbuj wszystkie trzy gazy: każde gotowe okno trafia na swoją półkę.',
      ],
      sci: [
        'Jak się robi pakiet trzyszybowy: powłoka niskoemisyjna na jednej szybie (srebro napylane magnetronowo w próżni; drugi rodzaj to tlenek cyny nanoszony na gorące szkło przy jego produkcji), ramki dystansowe z środkiem suszącym, uszczelnienie brzegu, potem napełnianie gazem przez otwór w ramce.',
        'Napełnianie wypiera powietrze, ale nigdy całe: pakiety napełnia się w około 90% lub więcej. Gaz ucieka powoli; norma (EN 1279-3) dopuszcza 1% rocznie.',
        'Argon to zwykłe wypełnienie. Krypton, w tych danych około 300 razy droższy za kilogram, jest do cienkich szczelin: jego najlepsza szerokość to około 8 do 12 mm, wobec około 15 mm dla argonu.',
      ],
    },
  },
  gap: {
    label: 'Olbrzymia szczelina',
    title: 'Który gaz trzyma ciepło?',
    slider: 'Szerokość szczeliny',
    signs: { warm: 'Ciepły pokój', cold: 'Zimno na zewnątrz', best: 'najlepsza: {mm} mm' },
    hints: { coat: 'Dotknij butli z gazem albo zimnej szyby', slide: 'Dotknij butli z gazem albo zmień szerokość' },
    buttons: { air: 'Powietrze', argon: 'Argon', krypton: 'Krypton', xenon: 'Ksenon', coat: 'Powłoka włącz lub wyłącz' },
    meter: {
      title: 'Ciepło przez szczelinę (z jednej strony cieplej o 15 stopni)',
      conduction: 'Zderzające się atomy',
      rolling: 'Gaz krąży',
      rays: 'Światło ciepła',
      airMark: 'zwykłe powietrze, goła szyba',
      coated: 'z powłoką',
      kid: 'Zwykłe powietrze i goła szyba: 1,00. Ta szczelina: {x}.',
      sci: 'k = {k} W/(m·K), Nu = {nu}',
      sci2: 'na m² szyby, {dt} K przez szczelinę',
    },
    says: {
      air: {
        kid: 'Powietrze: jego cząsteczki śmigają szybko. Patrz, jak niosą czerwone ciepło na niebieską stronę.',
        sci: 'Powietrze, średnia masa cząsteczkowa 29 u, średnia prędkość około 460 m/s w temperaturze pokojowej, przewodność 0,026 W/(m·K). Pokazane prędkości są w skali względem siebie.',
      },
      argon: {
        kid: 'Atomy argonu są cięższe i trochę wolniejsze. Ciepło przechodzi wolniej niż w powietrzu.',
        sci: 'Argon, 39,9 u: około 390 m/s (0,85 prędkości powietrza), przewodność 0,0177 W/(m·K).',
      },
      krypton: {
        kid: 'Atomy kryptonu są ciężkie i człapią wolno. Czerwone ciepło przeskakuje przez szczelinę dużo wolniej.',
        sci: 'Krypton, 83,8 u: około 270 m/s (0,59 prędkości powietrza), przewodność 0,0095 W/(m·K), 0,37 przewodności powietrza.',
      },
      xenon: {
        kid: 'Ksenon jest jeszcze cięższy i wolniejszy, i trzyma ciepło jeszcze lepiej. Ale prawie go nie ma w powietrzu, więc na okna jest za drogi.',
        sci: 'Ksenon, 131,3 u: około 220 m/s (0,47 prędkości powietrza), przewodność 0,0057 W/(m·K). Około 0,09 ppm powietrza i około 6 razy cena kryptonu w tych danych: za drogi na okna.',
      },
      coatOn: {
        kid: 'Powłoka jest! Czerwone strzałki to światło ciepła z ciepłej strony. Powłoka odbija je jak lustro dla ciepła. Zobacz, jak spada miernik.',
        sci: 'Srebrna powłoka niskoemisyjna (emisyjność około 0,04 wobec 0,84 zwykłego szkła) odbija podczerwień: promieniowanie szczeliny spada z około 3,7 do około 0,2 W/(m²·K).',
      },
      coatOff: {
        kid: 'Bez powłoki światło ciepła leci prosto i ogrzewa zimną szybę. W zwykłej szczelinie to największy wyciek.',
        sci: 'Goła szyba: podczerwień przechodzi swobodnie, około 3,7 W/(m²·K), więcej niż gaz przewodzi przez 12 mm powietrza (około 2,2).',
      },
      rolling: {
        kid: 'Uwaga: szczelina jest szeroka, więc gaz zaczyna krążyć w pętlach i niesie ciepło szybciej. Węższa jest lepsza, do pewnej granicy.',
        sci: 'Zaczyna się konwekcja: liczba Nusselta rośnie powyżej 1, gdy gaz unosi się po ciepłej stronie i opada po zimnej, więc szersza szczelina już nie pomaga.',
      },
    },
    panel: {
      kid: [
        'Ciepło przechodzi przez gaz, gdy jego atomy zderzają się i przekazują sobie drganie. Wybierz gaz i patrz: czerwone atomy niosą ciepło, niebieskie są zimne. Ciężkie atomy poruszają się wolniej i wolniej je przekazują.',
        'Zmień szerokość: szersza szczelina to więcej atomów do pokonania, ale od pewnego miejsca gaz krąży w pętlach i niesie ciepło. Złoty znacznik na linijce to najlepsza szerokość każdego gazu.',
        'Potem dotknij zimnej szyby, żeby ją pokryć. Większość ciepła w zwykłej szczelinie wcale nie idzie przez atomy: to światło ciepła, a powłoka je odbija.',
      ],
      sci: [
        'Model, dla 15 K przez szczelinę: przewodzenie k/d; konwekcja przez liczbę Nusselta wysokiej szczeliny (z liczby Rayleigha: równa 1, dopóki gaz nie zacznie krążyć); promieniowanie 4σT³ razy emisyjność efektywna, 0,84 dla szkła i 0,04 dla srebrnej powłoki. Olbrzymia szczelina jest 45 razy większa od prawdziwej, a atomy narysowano znacznie większe niż w skali; ich prędkości są właściwe względem siebie.',
        'Przewodności z danych o pierwiastkach (krypton 0,0095, argon 0,0177, ksenon 0,0057, powietrze 0,026 W/(m·K)). Najlepsze szerokości wychodzą blisko 11 mm dla kryptonu i 16 mm dla argonu; tabele producentów podają około 8 do 12 mm i 11 do 16 mm.',
        'Powłoka znaczy więcej niż gaz: goła szyba traci więcej przez promieniowanie (około 56 W/m² dla 15 K) niż przez przewodzenie przez 12 mm kryptonu (około 12).',
      ],
    },
  },
  house: {
    label: 'Dom testowy',
    title: 'Trzy okna, jedna zimna noc',
    slider: 'Zimno na zewnątrz',
    signs: {
      single: 'Jedna szyba',
      double: 'Dwie szyby, powietrze',
      triple: 'Trzy szyby, krypton',
      camera: 'Kamera ciepła',
      thermo: 'Na zewnątrz {out} °C, w środku {in} °C',
    },
    hints: { camera: 'Dotknij kamery ciepła', lens: 'Dotknij okna z kryptonem', slide: 'Zmień zimno na zewnątrz' },
    buttons: { camera: 'Kamera ciepła włącz lub wyłącz', lens: 'Lupa na szczelinie z kryptonem' },
    meter: { kid: 'Traci {x} razy więcej niż okno z kryptonem', best: 'Najlepsze z trzech' },
    legend: {
      title: 'Ciepło szkła, od środka',
      kid: 'Ciemny to zimno, żółty to ciepło. Jedna szyba jest dużo zimniejsza niż okno z kryptonem, które jest prawie tak ciepłe jak pokój.',
      sci: 'Wewnętrzna powierzchnia = 20 − U × 0,13 × (20 − T_zewn). Powietrze w pokoju 20 °C i 50% wilgotności ma punkt rosy około {dew} °C: zimniejsze szkło paruje.',
    },
    lens: {
      room: 'pokój',
      outside: 'na zewnątrz',
      note: { kid: 'Duże wolne atomy: fala ciepła zanika.', sci: 'Rysunek szczeliny z kryptonem, bez skali: fala ciepła słabnie, gdy ją przechodzi.' },
    },
    says: {
      camera: {
        kid: 'Kamera ciepła widzi ciepło, nie światło. Jedna szyba jest dużo zimniejsza niż okno z kryptonem, a kot świeci!',
        sci: 'Obraz termiczny wewnętrznych powierzchni, z modelu. Przy −10 °C na zewnątrz: jedna szyba około −3 °C, dwie około 9 °C, trzy około 18 °C. Sierść kota jest cieplejsza niż ściana.',
      },
      cameraOff: { kid: 'Kamera wyłączona: wracamy do tego, co widać.', sci: 'Kamera wyłączona: wracamy do światła widzialnego.' },
      lens: {
        kid: 'Lupa na szczelinie z kryptonem, jak przybliżenie na obrazku: duże wolne atomy, a fala ciepła zanika, zanim dotrze na zimną stronę.',
        sci: 'Lupa to rysunek szczeliny z kryptonem, atomy bez skali: każdy wolny atom przekazuje tylko trochę, więc fala ciepła słabnie na jej szerokości.',
      },
      lensOff: { kid: 'Lupa schowana.', sci: 'Lupa schowana.' },
    },
    panel: {
      kid: [
        'Trzy okna w jednej ścianie: jedna szyba, dwie szyby z powietrzem i trzy szyby z kryptonem i powłokami. Zmień zimno na zewnątrz i patrz, ile watów wypuszcza każde z nich.',
        'Dotknij kamery ciepła, żeby zobaczyć, jak ciepłe jest szkło. Dotknij okna z kryptonem, żeby dostać lupę.',
        'Najlepsze okno wypuszcza mniej więcej jedną dziesiątą tego, co jedna szyba.',
      ],
      sci: [
        'Typowe współczynniki U: jedna szyba około 5,8, dwie zwykłe z powietrzem około 2,8, trzy z kryptonem i powłokami około 0,6 W/(m²·K). Strumień ciepła to Q = U × A × ΔT, dla okna 1,1 na 1,35 m i 20 °C w środku.',
        'Wewnętrzna powierzchnia szkła ma T_wewn − U × 0,13 × ΔT, gdzie 0,13 m²·K/W to standardowa warstewka powietrza przy powierzchni wewnętrznej: przy −10 °C na zewnątrz jedna szyba ma blisko −3 °C, a trzy około 18 °C.',
        'Prawdziwe okna zależą od ramy, ramki dystansowej, powłok i szerokości szczelin. To są okrągłe, typowe liczby.',
      ],
    },
  },
}

const DE = {
  title: 'Die Fensterfabrik',
  greet: {
    kid: 'Wir sind im Bild, in einer Fensterfabrik an einem verschneiten Abend! Links baut eine Straße Dreifachfenster und füllt sie mit Gas. In der Ecke zeigt ein riesiger Spalt, was das Gas tut, und rechts hat ein kleines Testhaus drei Fenster. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Eine Fensterfabrik im Winter: links eine Linie, die Glas beschichtet, eine Dreifach-Isolierglaseinheit baut und ihre zwei Spalten durch den Abstandhalter füllt; an der Werkbank im Nordosten ein 45-fach vergrößerter Spalt, in dem man die Atome sieht; an der Ostwand ein Testhaus mit einem einfachen, einem doppelten und einem dreifachen Fenster. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Krypton hat keine Farbe und keinen Geruch, und in der Luft steckt nur eine Prise davon: etwa ein Teil auf eine Million. Eine Fabrik muss viel Luft sortieren, um eine Flasche zu bekommen.',
      'Argon ist viel billiger, und viele gute Fenster nutzen es. Krypton hält noch mehr Wärme drin, deshalb nimmt man es für sehr dünne Fenster und für die allerbesten.',
      'Das Gas bleibt jahrelang in den Spalten eingeschlossen. Ein wenig entweicht langsam, aber ein gutes Fenster verliert nur etwa ein Hundertstel davon im Jahr.',
    ],
    sci: [
      'Krypton macht 1,14 Teile pro Million der Luft aus, Argon 0,934 %, also etwa 8000-mal mehr. Beide fallen als Nebenprodukte der Anlagen an, die flüssigen Sauerstoff und Stickstoff herstellen. In diesen Daten kostet Krypton etwa 300-mal so viel wie Argon pro Kilogramm.',
      'Wärme geht durch ein Gas per Wärmeleitung: Die Atome tragen Energie, während sie sich bewegen. Bei gleicher Temperatur ist die mittlere Geschwindigkeit umgekehrt proportional zur Wurzel der Masse, also fliegen Kryptonatome (83,8 u) mit etwa 0,59 der Geschwindigkeit der Luftmoleküle (29 u), Argon (39,9 u) mit 0,85, Xenon (131,3 u) mit 0,47. Als einzelne Atome haben sie auch keine Rotation und Schwingung, in der sie Wärme speichern könnten.',
      'Die europäische Norm für Isolierglas (EN 1279-3) begrenzt den Gasverlust auf 1 % im Jahr. Dafür braucht es trockene Abstandhalter, eine doppelte Randversiegelung und ein Gas, das die Spalten zu etwa 90 % oder mehr füllt.',
    ],
  },
  gases: { air: 'Luft', argon: 'Argon', krypton: 'Krypton', xenon: 'Xenon' },
  line: {
    label: 'Die Glaslinie',
    labelPress: 'Die Gaspresse',
    title: 'So entsteht ein Dreifachfenster',
    signs: { coater: 'Beschichtungskammer', spacers: 'Abstandhalter', press: 'Gaspresse', rack: 'Fertige Fenster' },
    hints: {
      pane: 'Tippe auf die Glasscheibe',
      spacer: 'Tippe auf die Abstandhalter',
      gas: 'Tippe auf eine Gasflasche',
      plug: 'Tippe auf den roten Stopfen',
      wait: 'Schau der Linie zu',
    },
    buttons: {
      pane: 'Glas beschichten',
      spacer: 'Abstandhalter und Scheiben zufügen',
      air: 'Mit Luft füllen',
      argon: 'Mit Argon füllen',
      krypton: 'Mit Krypton füllen',
      plug: 'Stopfen verschließen',
    },
    board: {
      title: 'Gas in den Spalten',
      note: { kid: 'etwa 90 von 100 sind Gas', sci: 'etwa 90 % Gas, der Rest Luft' },
    },
    says: {
      coated: {
        kid: 'Das Glas ist durch die Beschichtungskammer gefahren. Es hat jetzt eine Schicht, die man nicht sieht, viel dünner als ein Haar, die die Wärme drinnen hält. Such nach einem schwachen goldenen Schimmer, wo das Licht darauf fällt.',
        sci: 'In der Kammer sputtert ein Magnetron im Vakuum einen Stapel dünner Schichten auf das Glas, die Silberschichten nur etwa 10 nm dick: eine Wärmeschutzbeschichtung (Low-E). Schräg gesehen gibt sie einen schwachen goldenen Schimmer.',
      },
      stacked: {
        kid: 'Ein Rahmen auf der beschichteten Scheibe, eine zweite Scheibe, noch ein Rahmen, eine dritte Scheibe: zwei Spalte, jeder dünner als dein Finger. Ein trockenes Pulver in den Rahmen verhindert, dass die Spalte beschlagen.',
        sci: 'Hohle Abstandhalter, mit einem Trockenmittel gefüllt, damit das eingeschlossene Gas trocken bleibt, halten die drei Scheiben 8 bis 18 mm auseinander. Eine Randversiegelung aus Butyl und ein zweiter Dichtstoff schließen die Einheit.',
      },
      air: {
        kid: 'Die Presse drückt Luft in beide Spalte. So sind die meisten alten Doppelfenster. Luft leitet Wärme fast dreimal so schnell wie Krypton.',
        sci: 'Trockene Luft, 0,026 W/(m·K): die Vergleichsbasis und das, was die meisten älteren Doppelfenster enthalten. Ihre Leitfähigkeit ist fast 3-mal die von Krypton.',
      },
      argon: {
        kid: 'Die Presse drückt Argon durch ein winziges Loch im Abstandhalter hinein. Argon kommt aus der Luft und leitet Wärme etwa zu zwei Dritteln so schnell wie Luft.',
        sci: 'Argon, 0,0177 W/(m·K), 0,93 % der Luft und ein billiges Nebenprodukt der Luftzerlegung: die übliche Füllung. Es verdrängt die Luft durch das Loch, und in der Praxis enthält ein Spalt etwa 90 % Argon, der Rest ist Luft, die nie ganz hinausgeht.',
      },
      krypton: {
        kid: 'Jetzt Krypton! Die Presse füllt beide Spalte. Die schweren Kryptonatome bewegen sich langsam, deshalb leitet es Wärme nur etwa ein Drittel so schnell wie Luft.',
        sci: 'Krypton, 0,0095 W/(m·K), 83,8 u. Teurer als Argon, aber seine Spalte können dünner sein, daher passt es zu schlanken Dreifachverglasungen. Die Anzeige steigt auf etwa 90 %, das übliche Ziel, weil immer etwas Luft bleibt.',
      },
      filled: {
        kid: 'Die Spalte sind voll! Tippe jetzt auf den roten Stopfen, um das Loch im Abstandhalter zu verschließen.',
        sci: 'Die Spalte sind gefüllt, etwa 90 % Gas. Tippe auf den roten Stopfen, um das Loch im Abstandhalter zu verschließen, bevor das Gas entweicht.',
      },
      sealedAir: {
        kid: 'Verschlossen und im Regal. Sein Abstandhalter hat ein graues Band, damit niemand die Gase verwechselt. Einfache Luft ist am billigsten und lässt die meiste Wärme durch.',
        sci: 'Verschlossen und im Regal, mit einem grauen Band am Abstandhalter. Die Farben sind nur die dieses Raums, um die Gase zu unterscheiden.',
      },
      sealedArgon: {
        kid: 'Verschlossen und im Regal. Sein Abstandhalter hat ein helles blaugrünes Band für Argon. Ein gutes Fenster für jeden Tag!',
        sci: 'Verschlossen und im Regal, mit einem hellen blaugrünen Band für Argon am Abstandhalter. Die Farben sind nur die dieses Raums.',
      },
      sealedKrypton: {
        kid: 'Verschlossen und im Regal. Sein Abstandhalter hat ein petrolfarbenes Band für Krypton: das Fenster für die kältesten Orte.',
        sci: 'Verschlossen und im Regal, mit einem petrolfarbenen Band für Krypton am Abstandhalter. Die Farben sind nur die dieses Raums.',
      },
      paneBusy: {
        kid: 'Ein Fenster nach dem anderen: Mach erst dieses fertig!',
        sci: 'Eine Einheit nach der anderen: Mach erst diese fertig.',
      },
    },
    panel: {
      kid: [
        'Ein Fenster mit drei Scheiben hat zwei Spalte. Wärme geht durch einen Spalt über das Gas darin, also entscheidet das Gas, wie gut das Fenster die Wärme hält.',
        'Tippe auf das Glas, um es zu beschichten, auf die Abstandhalter, um das Fenster zu bauen, und dann auf eine Gasflasche. Die Presse füllt die Spalte durch ein Loch im Abstandhalter, und du verschließt es mit dem roten Stopfen.',
        'Probiere alle drei Gase: Jedes fertige Fenster kommt auf sein eigenes Regalbrett.',
      ],
      sci: [
        'Bau einer Dreifach-Isolierglaseinheit: eine Low-E-Beschichtung auf einer Scheibe (Silber durch Magnetron-Sputtern im Vakuum; die andere Art ist Zinnoxid, das bei der Herstellung auf das heiße Glas aufgebracht wird), Abstandhalter mit Trockenmittel, eine Randversiegelung, dann die Gasfüllung durch ein Loch im Abstandhalter.',
        'Das Füllen verdrängt die Luft, aber nie ganz: Einheiten werden zu etwa 90 % oder mehr gefüllt. Das Gas entweicht langsam; eine Norm (EN 1279-3) erlaubt 1 % im Jahr.',
        'Argon ist die übliche Füllung. Krypton, in diesen Daten etwa 300-mal teurer pro Kilogramm, ist für dünne Spalte: Seine beste Breite liegt bei etwa 8 bis 12 mm, gegenüber etwa 15 mm bei Argon.',
      ],
    },
  },
  gap: {
    label: 'Der Riesenspalt',
    title: 'Welches Gas hält die Wärme?',
    slider: 'Breite des Spalts',
    signs: { warm: 'Warmer Raum', cold: 'Kalt draußen', best: 'beste: {mm} mm' },
    hints: { coat: 'Tippe auf eine Gasflasche oder das kalte Glas', slide: 'Tippe auf eine Gasflasche oder ändere die Breite' },
    buttons: { air: 'Luft', argon: 'Argon', krypton: 'Krypton', xenon: 'Xenon', coat: 'Beschichtung an oder aus' },
    meter: {
      title: 'Wärme durch den Spalt (auf einer Seite 15 Grad wärmer)',
      conduction: 'Stoßende Atome',
      rolling: 'Gas rollt herum',
      rays: 'Wärmelicht',
      airMark: 'einfache Luft, blankes Glas',
      coated: 'beschichtet',
      kid: 'Einfache Luft und blankes Glas: 1,00. Dieser Spalt: {x}.',
      sci: 'k = {k} W/(m·K), Nu = {nu}',
      sci2: 'pro m² Glas, {dt} K über den Spalt',
    },
    says: {
      air: {
        kid: 'Luft: Ihre Moleküle flitzen schnell. Sieh, wie sie die rote Wärme zur blauen Seite tragen.',
        sci: 'Luft, mittlere Molekülmasse 29 u, mittlere Geschwindigkeit etwa 460 m/s bei Zimmertemperatur, Leitfähigkeit 0,026 W/(m·K). Die gezeigten Geschwindigkeiten stehen im richtigen Verhältnis zueinander.',
      },
      argon: {
        kid: 'Argonatome sind schwerer und etwas langsamer. Die Wärme kommt langsamer hinüber als in Luft.',
        sci: 'Argon, 39,9 u: etwa 390 m/s (0,85 der Luft), Leitfähigkeit 0,0177 W/(m·K).',
      },
      krypton: {
        kid: 'Kryptonatome sind schwer und schlendern langsam. Die rote Wärme hüpft viel langsamer über den Spalt.',
        sci: 'Krypton, 83,8 u: etwa 270 m/s (0,59 der Luft), Leitfähigkeit 0,0095 W/(m·K), 0,37 der von Luft.',
      },
      xenon: {
        kid: 'Xenon ist noch schwerer und langsamer und hält die Wärme noch besser. Aber in der Luft gibt es fast keins, deshalb ist es für Fenster viel zu teuer.',
        sci: 'Xenon, 131,3 u: etwa 220 m/s (0,47 der Luft), Leitfähigkeit 0,0057 W/(m·K). Etwa 0,09 ppm der Luft und in diesen Daten etwa das 6-Fache des Kryptonpreises: zu teuer für Fenster.',
      },
      coatOn: {
        kid: 'Die Beschichtung ist drauf! Die roten Pfeile sind Wärmelicht von der warmen Seite. Die Beschichtung wirft sie zurück, wie ein Spiegel für Wärme. Sieh, wie die Anzeige sinkt.',
        sci: 'Eine Low-E-Beschichtung aus Silber (Emissionsgrad etwa 0,04 gegenüber 0,84 bei normalem Glas) reflektiert das Infrarot: Die Strahlung im Spalt sinkt von etwa 3,7 auf etwa 0,2 W/(m²·K).',
      },
      coatOff: {
        kid: 'Ohne Beschichtung fliegt das Wärmelicht geradewegs hinüber und wärmt das kalte Glas. In einem einfachen Spalt ist das der größte Verlust.',
        sci: 'Blankes Glas: Das Infrarot geht ungehindert hindurch, etwa 3,7 W/(m²·K), mehr als das Gas über 12 mm Luft leitet (etwa 2,2).',
      },
      rolling: {
        kid: 'Vorsicht: Der Spalt ist jetzt breit, deshalb fängt das Gas an, in Schleifen zu kreisen, und trägt die Wärme schneller hinüber. Schmaler ist besser, bis zu einem Punkt.',
        sci: 'Konvektion setzt ein: Die Nusselt-Zahl steigt über 1, wenn das Gas auf der warmen Seite aufsteigt und auf der kalten absinkt, und ein breiterer Spalt hilft nicht mehr.',
      },
    },
    panel: {
      kid: [
        'Wärme geht durch ein Gas, wenn seine Atome gegeneinanderstoßen und das Zittern weitergeben. Wähle ein Gas und schau: Rote Atome tragen Wärme, blaue sind kalt. Schwere Atome sind langsamer und geben sie langsamer weiter.',
        'Ändere die Breite: Ein breiterer Spalt heißt mehr Atome auf dem Weg, aber ab einem Punkt kreist das Gas in Schleifen und trägt die Wärme. Die goldene Marke auf dem Lineal ist die beste Breite jedes Gases.',
        'Tippe dann auf das kalte Glas, um es zu beschichten. Der meiste Wärmeverlust in einem einfachen Spalt läuft gar nicht über Atome: Es ist Wärmelicht, und die Beschichtung wirft es zurück.',
      ],
      sci: [
        'Das Modell, für 15 K über den Spalt: Wärmeleitung k/d; Konvektion über die Nusselt-Zahl eines hohen Spalts (aus der Rayleigh-Zahl: sie ist 1, bis das Gas zu zirkulieren beginnt); Strahlung 4σT³ mal effektiver Emissionsgrad, mit 0,84 für Glas und 0,04 für eine Silberbeschichtung. Der Riesenspalt ist 45-mal so groß wie der echte, und die Atome sind viel größer als maßstäblich gezeichnet; ihre Geschwindigkeiten stimmen im Verhältnis zueinander.',
        'Leitfähigkeiten aus den Elementdaten (Krypton 0,0095, Argon 0,0177, Xenon 0,0057, Luft 0,026 W/(m·K)). Die besten Breiten ergeben sich bei etwa 11 mm für Krypton und 16 mm für Argon; Herstellertabellen nennen etwa 8 bis 12 mm und 11 bis 16 mm.',
        'Die Beschichtung zählt mehr als das Gas: Blankes Glas verliert mehr durch Strahlung (etwa 56 W/m² bei 15 K) als durch Leitung über 12 mm Krypton (etwa 12).',
      ],
    },
  },
  house: {
    label: 'Das Testhaus',
    title: 'Drei Fenster, eine kalte Nacht',
    slider: 'Kälte draußen',
    signs: {
      single: 'Eine Scheibe',
      double: 'Zwei Scheiben, Luft',
      triple: 'Drei Scheiben, Krypton',
      camera: 'Wärmebildkamera',
      thermo: 'Draußen {out} °C, drinnen {in} °C',
    },
    hints: { camera: 'Tippe auf die Wärmebildkamera', lens: 'Tippe auf das Kryptonfenster', slide: 'Ändere die Kälte draußen' },
    buttons: { camera: 'Wärmebildkamera an oder aus', lens: 'Lupe auf den Kryptonspalt' },
    meter: { kid: 'Verliert {x}-mal so viel wie das Kryptonfenster', best: 'Das Beste der drei' },
    legend: {
      title: 'Wärme des Glases, innen',
      kid: 'Dunkel ist kalt, gelb ist warm. Die einfache Scheibe ist viel kälter als das Kryptonfenster, das fast so warm ist wie der Raum.',
      sci: 'Innenfläche = 20 − U × 0,13 × (20 − T_außen). Raumluft mit 20 °C und 50 % Feuchte hat einen Taupunkt nahe {dew} °C: Kälteres Glas beschlägt.',
    },
    lens: {
      room: 'Raum',
      outside: 'draußen',
      note: { kid: 'Große langsame Atome: Die Wärmewelle stirbt ab.', sci: 'Eine Zeichnung eines Kryptonspalts, nicht maßstäblich: Die Wärmewelle wird schwächer, während sie ihn durchquert.' },
    },
    says: {
      camera: {
        kid: 'Die Wärmebildkamera sieht Wärme, kein Licht. Die einfache Scheibe ist viel kälter als das Kryptonfenster, und die Katze leuchtet!',
        sci: 'Ein Wärmebild der Innenflächen, aus dem Modell. Bei −10 °C draußen: einfache Verglasung etwa −3 °C, die doppelte etwa 9 °C, die dreifache etwa 18 °C. Das Fell der Katze ist wärmer als die Wand.',
      },
      cameraOff: { kid: 'Kamera aus: zurück zu dem, was wir sehen.', sci: 'Kamera aus: zurück zum sichtbaren Licht.' },
      lens: {
        kid: 'Eine Lupe auf dem Kryptonspalt, wie der Ausschnitt im Bild: große langsame Atome, und die Wärmewelle stirbt ab, bevor sie die kalte Seite erreicht.',
        sci: 'Die Lupe ist eine Zeichnung eines Kryptonspalts, Atome nicht maßstäblich: Jedes langsame Atom gibt nur wenig weiter, deshalb wird die Wärmewelle über den Spalt schwächer.',
      },
      lensOff: { kid: 'Lupe weg.', sci: 'Lupe weg.' },
    },
    panel: {
      kid: [
        'Drei Fenster in einer Wand: eine Scheibe, zwei Scheiben mit Luft und drei Scheiben mit Krypton und Beschichtungen. Ändere die Kälte draußen und sieh, wie viele Watt jedes hinauslässt.',
        'Tippe auf die Wärmebildkamera, um zu sehen, wie warm das Glas ist. Tippe auf das Kryptonfenster für eine Lupe.',
        'Das beste Fenster lässt etwa ein Zehntel von dem hinaus, was die einfache Scheibe verliert.',
      ],
      sci: [
        'Typische U-Werte: einfache Verglasung etwa 5,8, doppelt aus normalem Glas mit Luft etwa 2,8, dreifach mit Krypton und Beschichtungen etwa 0,6 W/(m²·K). Der Wärmestrom ist Q = U × A × ΔT, für ein Fenster von 1,1 mal 1,35 m und 20 °C innen.',
        'Die Innenfläche des Glases hat T_innen − U × 0,13 × ΔT, wobei 0,13 m²·K/W der übliche Luftfilm an der Innenoberfläche ist: Bei −10 °C draußen liegt die einfache Scheibe nahe −3 °C und die dreifache bei etwa 18 °C.',
        'Echte Fenster hängen von Rahmen, Abstandhalter, Beschichtungen und Spaltbreiten ab. Das sind runde, typische Werte.',
      ],
    },
  },
}

export const WINDOWS_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
