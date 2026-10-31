// The words of iron's tower room ("How do you build a tower of iron?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Fe.js (the easel shows it); the room adds the things to do.
// Sources: the tower's operator (toureiffel.paris: "Origins and construction", "Why does the Eiffel Tower
// change size?", "Painting and colour of the Eiffel Tower", Bertrand Lemoine's "The construction of the
// Eiffel Tower: an exemplary project"): 18,038 pieces, 2,500,000 rivets, two thirds of them set by machine in
// the Levallois-Perret workshop and one third on site, by teams of four (one heats, one holds, one shapes the
// head, one strikes with a sledgehammer); 7300 t of puddled iron from Pompey; built January 1887 to 31 March
// 1889; 312 m then, 330 m with today's antennas; the sun bending the tower away from it, its top tracing "a
// more or less circular curve measuring approximately 15 centimeters in diameter" over a clear day (and "a
// few millimeters"/"a few centimeters" a year on two lines of the same page, so the room gives no single
// yearly figure); about 60 t of paint, about 50 painters, 250,000 m², every 7 years on average since 1892,
// shaded darkest at the base and lightest at the top for an impression of uniformity; "Eiffel Tower brown"
// in three tones from 1968 to 2019, the yellow-brown of 1907 again since the 20th campaign (2019 to 2024).
// Hot riveting: Collette (VUB, 2013) and McQueen (Concordia, 2009): rivets driven at a cherry red, about 900
// to 1000 °C, shrinking about 1% as they cool, the shank's tension reaching about its yield stress, the
// plates clamped. Iron's expansion: about 12 µm per metre per kelvin (11.8 for pure iron at 25 °C).
// The Protest against the tower in Le Temps, 14 February 1887 (Garnier, Gounod, Maupassant among others).

const EN = {
  title: 'The Eiffel Tower, 115 m up',
  greet: {
    kid: 'We are inside the picture, on the Eiffel Tower, 115 m above Paris! Everything round us is iron. On the left, help the rivet gang set a red-hot rivet; in front, watch a model of the tower lean away from the sun; on the right, paint it. The picture\'s story is on the easel.',
    sci: 'The second floor of the Eiffel Tower, 115 m up, among the puddled-iron lattice of its north legs. On the left, a hot rivet set by a team of four; in front, a 1:100 model that bends away from the sun; on the right, the paint and its three shades. The picture\'s story is on the easel.',
  },
  talk: {
    kid: [
      'The tower weighs about 7300 tonnes, but it is mostly air. Melt all its iron into a slab as wide as its base, and the slab would be only about 6 cm thick!',
      'In 1887, before it was built, a group of famous artists signed a letter in a newspaper calling it useless and monstrous. Today it is the picture everyone draws for Paris.',
      'Iron and air and rain make rust. The paint is what keeps this tower standing, so painters climb all over it, about every seven years.',
    ],
    sci: [
      '7300 t of iron over a base 125 m square: melted into a slab at about 7.8 g/cm³, it would be about 6 cm thick. The lattice puts the iron only where the loads run.',
      'The artists\' "Protest against the tower of Monsieur Eiffel" appeared in Le Temps on 14 February 1887, signed among others by the architect Charles Garnier, the composer Charles Gounod and the writer Guy de Maupassant.',
      'Puddled iron: pig iron stirred in a furnace until nearly all its carbon had burned out, leaving a tough wrought iron, threaded with slag, with well under 0.1% carbon. It came from the Dupont et Fould works at Pompey, in Lorraine.',
    ],
  },
  rivet: {
    label: 'The rivet gang',
    title: 'Set a red-hot rivet',
    slider: 'Rivet temperature',
    hints: {
      heat: 'Tap the forge to pump the bellows',
      toss: 'Tap the glowing rivet to toss it',
      push: 'Tap the plates to push the rivet in',
      hammer: 'Tap the hammer to form the head',
      watch: 'Watch',
      cool: 'Watch it cool and clamp',
      again: 'Tap the forge for a new rivet',
    },
    buttons: { heat: 'Pump the bellows', toss: 'Toss the rivet', push: 'Push it through', hammer: 'Strike', fresh: 'A new rivet' },
    gauge: {
      title: 'The rivet',
      temp: 'Temperature',
      length: 'Longer than cold',
      gap: 'Gap between the plates',
      squeeze: 'Squeeze',
      none: 'none',
      bigger: 'the gap drawn 100 times bigger',
      done: 'Rivets set: {n}',
    },
    lens: { atoms: 'Iron atoms', hot: 'jiggling hard, further apart', cold: 'calm, closer together' },
    says: {
      puff: { kid: 'Puff! The coals glow brighter and the rivet gets hotter.', sci: 'Air from the bellows makes the fire burn faster and hotter: the rivet climbs towards about 1000 °C.' },
      red: { kid: 'Dark red: not hot enough yet. Pump again!', sci: 'Dull red, about 700 °C: still too stiff to be forged into a good head.' },
      ready: { kid: 'Cherry red to orange: just right! Tap the rivet to toss it.', sci: 'Cherry red to orange, about 900 to 1000 °C: soft enough to forge. Riveters judged it by eye.' },
      hottest: { kid: 'Hot enough! Any hotter and the iron would start to spoil.', sci: 'Hot enough. Far hotter, towards 1400 °C, the iron is "burnt": its grain boundaries oxidise and it turns brittle.' },
      tooCold: { kid: 'Too cold! A cold rivet will not squash into a good head. Heat it first.', sci: 'Below a red heat the iron is too stiff to be upset into the hole and to form a head.' },
      toss: { kid: 'Whoosh! The heater throws the red-hot rivet, and the catcher catches it in his cone.', sci: 'The heater takes it out with tongs, knocks off the scale and throws it; the catcher catches it in a cone-shaped can.' },
      push: { kid: 'In it goes, through both holes! The holder presses a heavy bar against its head from below.', sci: 'Into the hole, tail up; the holder-on braces the dolly bar against the factory head.' },
      blow: { kid: 'Bang!', sci: 'Each blow upsets the shank to fill the hole.' },
      head: { kid: 'A new round head! Now watch: as the rivet cools it shrinks, and it pulls the plates tightly together.', sci: 'The second head is formed. Cooling from red heat, the shank shortens by about 1%, but the heads hold it: it is stretched like a spring and clamps the plates.' },
      cold: { kid: 'Cold and tight! The plates are squeezed so hard that they cannot slip. Only about 2.5 million more to go!', sci: 'Cold: the shank\'s tension is near its yield stress, the plates clamped, so friction between them carries much of the load. One of 2.5 million.' },
      warm: { kid: 'Warm it again and the rivet grows longer: the squeeze lets go!', sci: 'Heated again, the shank lengthens and the clamp relaxes.' },
      busy: { kid: 'Wait, the rivet is on its way!', sci: 'The rivet is moving: wait for it.' },
      notYet: { kid: 'First the rivet must be hot, and then in the catcher\'s cone.', sci: 'The rivet must be heated and caught first.' },
    },
    panel: {
      kid: [
        'Every one of the tower\'s 2.5 million rivets was put in red-hot by a team of four: one heated it in a little forge, one held it in place, one shaped its new head, and one struck it with a heavy sledgehammer. Two thirds were done by machines in the workshop; one third up on the tower.',
        'Why hot? A hot rivet is soft, so it squashes to fill its hole and makes a new head. And as it cools it shrinks, by about a hundredth of its length, pulling the iron plates together more tightly than any bolt. Tap the forge, the rivet, the plates and the hammer, or use the slider.',
      ],
      sci: [
        'The 18,038 pieces were cut and drilled in Eiffel\'s workshop at Levallois-Perret, pre-assembled with bolts, and two thirds of the 2.5 million rivets were driven there by machine. On the tower each bolt was replaced by a hot rivet, set by a team of four: one to heat it, one to hold it in place, one to shape the head, and one to strike it with a sledgehammer (the operator\'s account).',
        'Driven at a cherry red, about 900 to 1000 °C, the shank is upset to fill the hole and a second head is formed. Cooling, it shortens by about 1% (iron expands by about 12 µm per metre per degree, a little more when hot), but the heads hold it: the shank ends in tension near its yield stress and clamps the plates. The gauge draws the gap many times bigger.',
      ],
    },
  },
  sun: {
    label: 'The model in the sun',
    title: 'Why the top leans away from the sun',
    time: 'Time of day',
    temp: 'Temperature of the iron',
    hints: { day: 'Tap the model to run a whole day', watch: 'Watch the top of the model', temp: 'Tap the thermometer for winter or summer' },
    buttons: { day: 'Run a whole day', cold: 'Winter: 0 °C', mild: 'Spring: 15 °C', hot: 'Summer sun: 40 °C' },
    board: {
      title: 'Paris, 21 June',
      moved: 'The real top has moved {d}',
      straight: 'The real top stands straight',
      loop: 'loop about 15 cm across',
      taller: 'Iron at {t}: {d} taller than at 15 °C',
      shorter: 'Iron at {t}: {d} shorter than at 15 °C',
      same: 'Iron at 15 °C',
      exag: 'model 1:100, bending drawn 200 times bigger',
      north: 'N',
    },
    says: {
      day: { kid: 'Sunrise! Watch the top: it leans away from the sun as the sun goes round the sky.', sci: 'The sun warms one face; that face lengthens more than the shaded ones, so the tower bends away from the sun.' },
      dayEnd: { kid: 'Sunset! Over the day the top drew a loop about 15 cm across. At night all the iron cools to the same temperature, and the tower stands straight again.', sci: 'Over a clear day the summit traces a roughly circular curve about 15 cm across (the operator\'s figure); overnight, with the faces at one temperature again, it comes back.' },
      night: { kid: 'Night: no sun on any side, so the tower stands straight.', sci: 'No direct sun: the faces even out in temperature and the bending goes.' },
      cold: { kid: 'Cold iron: the whole tower is a little shorter.', sci: 'At 0 °C, 15 degrees below the reference: about 5.4 cm shorter.' },
      mild: { kid: 'Mild: the tower is its usual height.', sci: 'The reference: 15 °C.' },
      hot: { kid: 'Hot iron: the whole tower is a little taller, about 3.6 mm for every degree!', sci: 'At 40 °C, 25 degrees above the reference: 300 m × 12 µm/m per degree × 25 = about 9 cm taller.' },
      busy: { kid: 'Wait, the day is still going!', sci: 'The day is still running.' },
    },
    panel: {
      kid: [
        'Iron gets a tiny bit longer when it warms up. When the sun shines on one side of the tower, that side warms and stretches more than the shady sides, so the whole tower bends, very slightly, away from the sun. As the sun goes round, the top draws a loop about 15 cm across.',
        'The model shows that bending 200 times bigger, so you can see it. And if all the tower\'s iron warms by one degree, the tower grows by about 3.6 mm. Try the thermometer, the time slider, or tap the model for a whole day.',
      ],
      sci: [
        'Iron\'s coefficient of linear expansion is about 12 µm per metre per kelvin, so about 300 m of it lengthens by about 3.6 mm per kelvin. How much the real tower changes over a year depends on how warm its iron gets: sources range from a few millimetres to about 15 cm, so the slider shows only what an even warming would do.',
        'Sunlight heats one face more than the others, and the difference bends the tower away from the Sun: over a clear day the summit traces a roughly circular curve about 15 cm across (the operator\'s figure). Here the sun stands where it does over Paris on 21 June (summer time), and the model, 1:100, bends 200 times more than to scale.',
      ],
    },
  },
  paint: {
    label: 'The painters',
    title: 'Paint the tower',
    pots: { dark: 'Dark', mid: 'Middle', light: 'Light' },
    bands: { bottom: 'the bottom', middle: 'the middle', top: 'the top' },
    hints: { pot: 'Tap a paint pot', band: 'Tap a part of the model to paint it', rust: 'Tap the bare girder end' },
    buttons: { dark: 'Dark paint', mid: 'Middle paint', light: 'Light paint', bottom: 'Paint the bottom', middle: 'Paint the middle', top: 'Paint the top', strip: 'Back to bare primer' },
    view: {
      title: 'Seen from the foot of the tower',
      bare: 'Still bare primer',
      part: 'Painted: {n} of 3',
      even: 'It looks one even colour!',
      topDark: 'The top looks darker',
      uneven: 'It looks patchy',
      real: 'The real tower: about 60 t of paint, by hand, about every 7 years',
    },
    says: {
      pot: { kid: 'Paint on the brush: {shade}. Now tap a part of the model.', sci: 'On the brush: {shade}. Now a band of the model.' },
      noPot: { kid: 'First dip the brush: tap a paint pot!', sci: 'Choose a shade first.' },
      painted: { kid: 'Painted {band}!', sci: 'Painted: {band}.' },
      even: { kid: 'Look at the view from the foot: the whole tower looks one colour, even though the top is painted lightest! Against the bright sky, the top would look darker.', sci: 'Graded darkest at the base, lightest at the top: from the foot, against the bright sky, it reads as one even colour. This is why the real tower is shaded.' },
      topDark: { kid: 'All one colour, but from the foot the top looks darker against the bright sky! Try light paint at the top.', sci: 'One shade all over: seen against the sky the upper parts read darker. Grade it: dark at the base, light at the top.' },
      uneven: { kid: 'Hmm, it looks patchy from the foot. Try dark at the bottom, middle in the middle and light at the top.', sci: 'Uneven from the foot: grade it darkest at the base.' },
      strip: { kid: 'Back to bare primer: start again!', sci: 'Stripped to the primer.' },
      rust: { kid: 'Bare iron with no paint: rust has started already. That is why the painters never stop.', sci: 'Unpainted wrought iron rusts in rain and city air; the paint is the barrier, renewed every 7 years or so, the cycle Eiffel set himself.' },
      busy: { kid: 'Wait, the brush is still painting!', sci: 'Still painting.' },
    },
    panel: {
      kid: [
        'Paint keeps the rain and the air away from the iron, so the whole tower is repainted about every seven years, by hand, with brushes: about 60 tonnes of paint! The painters are roped on like mountain climbers.',
        'The colour is not the same all the way up: darkest at the bottom, lightest at the top. From the ground, against the bright sky, that makes the tower look evenly coloured. Tap a pot, then a part of the model, and look at the view from the foot.',
      ],
      sci: [
        'Repainted on average every 7 years since 1892, a cycle Eiffel set: about 60 t of paint over 250,000 m², by about 50 painters with brushes, roped on with climbing gear. The 20th campaign, begun in 2019, stripped some parts down to the iron for the first time.',
        'The paint is shaded darkest at the base and lightest at the top, for an impression of uniformity against the sky. From 1968 to 2019 the colour was "Eiffel Tower brown" in three tones; the 20th campaign brought back the yellow-brown Eiffel chose in 1907. The model\'s three pots are shades of that yellow-brown.',
      ],
    },
  },
}
const PT = {
  title: 'A Torre Eiffel, a 115 m de altura',
  greet: {
    kid: 'Estamos dentro da imagem, na Torre Eiffel, 115 m acima de Paris! Tudo à nossa volta é ferro. À esquerda, ajuda a equipa dos rebites a pôr um rebite em brasa; à frente, vê um modelo da torre a inclinar-se para longe do Sol; à direita, pinta-o. A história da imagem está no cavalete.',
    sci: 'O segundo andar da Torre Eiffel, a 115 m de altura, entre a treliça de ferro pudelado das suas pernas norte. À esquerda, um rebite quente posto por uma equipa de quatro; à frente, um modelo à escala 1:100 que se curva para longe do Sol; à direita, a tinta e os seus três tons. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'A torre pesa cerca de 7300 toneladas, mas é quase toda ar. Se derretesses todo o seu ferro numa placa tão larga como a base, a placa teria só uns 6 cm de espessura!',
      'Em 1887, antes de a torre estar construída, um grupo de artistas famosos assinou uma carta num jornal a chamar-lhe inútil e monstruosa. Hoje é o desenho que toda a gente faz para Paris.',
      'Ferro, ar e chuva fazem ferrugem. É a tinta que mantém esta torre de pé, por isso há pintores que trepam por ela toda, mais ou menos de sete em sete anos.',
    ],
    sci: [
      '7300 t de ferro sobre uma base de 125 m de lado: derretido numa placa a cerca de 7,8 g/cm³, teria cerca de 6 cm de espessura. A treliça põe o ferro só onde passam as cargas.',
      'O «Protesto dos artistas contra a torre do senhor Eiffel» saiu no jornal Le Temps a 14 de fevereiro de 1887, assinado, entre outros, pelo arquiteto Charles Garnier, pelo compositor Charles Gounod e pelo escritor Guy de Maupassant.',
      'Ferro pudelado: ferro-gusa mexido num forno até quase todo o carbono arder, deixando um ferro forjado tenaz, com fios de escória e bem menos de 0,1% de carbono. Veio das forjas Dupont et Fould, em Pompey, na Lorena.',
    ],
  },
  rivet: {
    label: 'A equipa dos rebites',
    title: 'Põe um rebite em brasa',
    slider: 'Temperatura do rebite',
    hints: {
      heat: 'Toca na forja para dar ao fole',
      toss: 'Toca no rebite incandescente para o atirar',
      push: 'Toca nas chapas para meter o rebite',
      hammer: 'Toca no martelo para fazer a cabeça',
      watch: 'Observa',
      cool: 'Vê-o arrefecer e apertar',
      again: 'Toca na forja para um rebite novo',
    },
    buttons: { heat: 'Dar ao fole', toss: 'Atirar o rebite', push: 'Metê-lo no furo', hammer: 'Bater', fresh: 'Um rebite novo' },
    gauge: {
      title: 'O rebite',
      temp: 'Temperatura',
      length: 'Mais comprido do que frio',
      gap: 'Folga entre as chapas',
      squeeze: 'Aperto',
      none: 'nenhuma',
      bigger: 'a folga desenhada 100 vezes maior',
      done: 'Rebites postos: {n}',
    },
    lens: { atoms: 'Átomos de ferro', hot: 'a tremer muito, mais afastados', cold: 'calmos, mais juntos' },
    says: {
      puff: { kid: 'Fuuu! As brasas brilham mais e o rebite aquece.', sci: 'O ar do fole faz o fogo arder mais depressa e mais quente: o rebite sobe para cerca de 1000 °C.' },
      red: { kid: 'Vermelho-escuro: ainda não está quente que chegue. Dá outra vez ao fole!', sci: 'Vermelho-escuro, cerca de 700 °C: ainda demasiado rígido para forjar uma boa cabeça.' },
      ready: { kid: 'Vermelho-cereja a laranja: no ponto! Toca no rebite para o atirar.', sci: 'Vermelho-cereja a laranja, cerca de 900 a 1000 °C: macio que chegue para forjar. Os rebitadores avaliavam-no a olho.' },
      hottest: { kid: 'Já está quente que chegue! Mais quente e o ferro começava a estragar-se.', sci: 'Quente que chegue. Muito mais quente, a caminho dos 1400 °C, o ferro fica «queimado»: as fronteiras dos grãos oxidam e ele fica quebradiço.' },
      tooCold: { kid: 'Frio demais! Um rebite frio não se esmaga numa boa cabeça. Aquece-o primeiro.', sci: 'Abaixo do vermelho, o ferro está rígido demais para encher o furo e formar uma cabeça.' },
      toss: { kid: 'Zás! O aquecedor atira o rebite em brasa e o apanhador apanha-o no seu cone.', sci: 'O aquecedor tira-o com uma tenaz, sacode a carepa e atira-o; o apanhador apanha-o numa lata em forma de cone.' },
      push: { kid: 'Lá vai ele, pelos dois furos! O segurador encosta uma barra pesada à cabeça, por baixo.', sci: 'Para dentro do furo, com a ponta para cima; o segurador apoia a contra-estampa na cabeça de fábrica.' },
      blow: { kid: 'Pum!', sci: 'Cada pancada recalca a haste para encher o furo.' },
      head: { kid: 'Uma cabeça redonda nova! Agora repara: ao arrefecer, o rebite encolhe e aperta bem as chapas uma contra a outra.', sci: 'A segunda cabeça está feita. Ao arrefecer desde o rubro, a haste encurta cerca de 1%, mas as cabeças seguram-na: fica esticada como uma mola e aperta as chapas.' },
      cold: { kid: 'Frio e apertado! As chapas estão tão apertadas que não conseguem escorregar. Só faltam mais uns 2,5 milhões!', sci: 'Frio: a tração na haste está perto da tensão de cedência, as chapas apertadas, e o atrito entre elas suporta boa parte da carga. Um de 2,5 milhões.' },
      warm: { kid: 'Aquece-o outra vez e o rebite fica mais comprido: o aperto solta-se!', sci: 'Aquecida de novo, a haste alonga-se e o aperto alivia.' },
      busy: { kid: 'Espera, o rebite vai a caminho!', sci: 'O rebite está em movimento: espera.' },
      notYet: { kid: 'Primeiro o rebite tem de estar quente, e depois no cone do apanhador.', sci: 'Primeiro é preciso aquecer o rebite e apanhá-lo.' },
    },
    panel: {
      kid: [
        'Cada um dos 2,5 milhões de rebites da torre foi posto em brasa por uma equipa de quatro: um aquecia-o numa pequena forja, outro segurava-o no lugar, outro dava forma à cabeça nova e outro batia com uma marreta pesada. Dois terços foram postos por máquinas na oficina; um terço lá em cima, na torre.',
        'Porquê quente? Um rebite quente é macio, por isso esmaga-se, enche o furo e faz uma cabeça nova. E ao arrefecer encolhe, cerca de um centésimo do comprimento, e aperta as chapas de ferro mais do que qualquer parafuso. Toca na forja, no rebite, nas chapas e no martelo, ou usa o cursor.',
      ],
      sci: [
        'As 18 038 peças foram cortadas e furadas na oficina de Eiffel em Levallois-Perret, pré-montadas com parafusos, e dois terços dos 2,5 milhões de rebites foram lá postos à máquina. Na torre, cada parafuso era trocado por um rebite quente, posto por uma equipa de quatro: um para o aquecer, um para o segurar no lugar, um para dar forma à cabeça e um para bater com a marreta (segundo a empresa que explora a torre).',
        'Batido ao rubro-cereja, cerca de 900 a 1000 °C, o rebite é recalcado até encher o furo e forma-se uma segunda cabeça. Ao arrefecer encurta cerca de 1% (o ferro dilata cerca de 12 µm por metro por grau, um pouco mais quando quente), mas as cabeças seguram-no: a haste fica em tração perto da tensão de cedência e aperta as chapas. O mostrador desenha a folga muitas vezes maior.',
      ],
    },
  },
  sun: {
    label: 'O modelo ao sol',
    title: 'Porque é que o topo se afasta do Sol',
    time: 'Hora do dia',
    temp: 'Temperatura do ferro',
    hints: { day: 'Toca no modelo para correr um dia inteiro', watch: 'Observa o topo do modelo', temp: 'Toca no termómetro para inverno ou verão' },
    buttons: { day: 'Correr um dia inteiro', cold: 'Inverno: 0 °C', mild: 'Primavera: 15 °C', hot: 'Sol de verão: 40 °C' },
    board: {
      title: 'Paris, 21 de junho',
      moved: 'O topo verdadeiro moveu-se {d}',
      straight: 'O topo verdadeiro está direito',
      loop: 'volta de cerca de 15 cm',
      taller: 'Ferro a {t}: {d} mais alto do que a 15 °C',
      shorter: 'Ferro a {t}: {d} mais baixo do que a 15 °C',
      same: 'Ferro a 15 °C',
      exag: 'modelo 1:100, curvatura 200 vezes maior',
      north: 'N',
    },
    says: {
      day: { kid: 'Nascer do sol! Repara no topo: inclina-se para longe do Sol enquanto o Sol dá a volta ao céu.', sci: 'O Sol aquece uma face; essa face alonga-se mais do que as que estão à sombra, e a torre curva-se para longe do Sol.' },
      dayEnd: { kid: 'Pôr do sol! Ao longo do dia, o topo desenhou uma volta com cerca de 15 cm. À noite, o ferro todo arrefece até à mesma temperatura, e a torre fica direita outra vez.', sci: 'Num dia limpo, o topo descreve uma curva mais ou menos circular com cerca de 15 cm (o número da empresa que explora a torre); durante a noite, com as faces de novo à mesma temperatura, volta ao lugar.' },
      night: { kid: 'Noite: não há sol em nenhum dos lados, por isso a torre fica direita.', sci: 'Sem sol direto, as faces igualam a temperatura e a curvatura desaparece.' },
      cold: { kid: 'Ferro frio: a torre inteira fica um bocadinho mais baixa.', sci: 'A 0 °C, 15 graus abaixo da referência: cerca de 5,4 cm mais baixa.' },
      mild: { kid: 'Ameno: a torre tem a altura de sempre.', sci: 'A referência: 15 °C.' },
      hot: { kid: 'Ferro quente: a torre inteira fica um bocadinho mais alta, cerca de 3,6 mm por cada grau!', sci: 'A 40 °C, 25 graus acima da referência: 300 m × 12 µm/m por grau × 25 = cerca de 9 cm mais alta.' },
      busy: { kid: 'Espera, o dia ainda não acabou!', sci: 'O dia ainda está a correr.' },
    },
    panel: {
      kid: [
        'O ferro fica um bocadinho mais comprido quando aquece. Quando o Sol bate num lado da torre, esse lado aquece e estica mais do que os lados à sombra, por isso a torre inteira curva-se, muito pouquinho, para longe do Sol. Enquanto o Sol dá a volta, o topo desenha uma volta com cerca de 15 cm.',
        'O modelo mostra essa curvatura 200 vezes maior, para a conseguires ver. E se todo o ferro da torre aquecer um grau, a torre cresce cerca de 3,6 mm. Experimenta o termómetro, o cursor da hora, ou toca no modelo para um dia inteiro.',
      ],
      sci: [
        'O coeficiente de dilatação linear do ferro é cerca de 12 µm por metro por kelvin, por isso cerca de 300 m de ferro alongam-se cerca de 3,6 mm por kelvin. Quanto muda a torre verdadeira ao longo de um ano depende de quanto aquece o seu ferro: as fontes vão de alguns milímetros a cerca de 15 cm, por isso o cursor mostra só o que faria um aquecimento por igual.',
        'A luz do Sol aquece uma face mais do que as outras, e a diferença curva a torre para longe do Sol: num dia limpo, o topo descreve uma curva mais ou menos circular com cerca de 15 cm (o número da empresa que explora a torre). Aqui o Sol está onde está sobre Paris a 21 de junho (hora de verão), e o modelo, à escala 1:100, curva-se 200 vezes mais do que à escala.',
      ],
    },
  },
  paint: {
    label: 'Os pintores',
    title: 'Pinta a torre',
    pots: { dark: 'Escuro', mid: 'Médio', light: 'Claro' },
    bands: { bottom: 'a parte de baixo', middle: 'o meio', top: 'o topo' },
    hints: { pot: 'Toca numa lata de tinta', band: 'Toca numa parte do modelo para a pintar', rust: 'Toca na ponta da viga sem tinta' },
    buttons: { dark: 'Tinta escura', mid: 'Tinta média', light: 'Tinta clara', bottom: 'Pintar em baixo', middle: 'Pintar o meio', top: 'Pintar o topo', strip: 'Voltar ao primário' },
    view: {
      title: 'Vista do pé da torre',
      bare: 'Ainda só com primário',
      part: 'Pintado: {n} de 3',
      even: 'Parece toda da mesma cor!',
      topDark: 'O topo parece mais escuro',
      uneven: 'Parece manchada',
      real: 'A torre verdadeira: cerca de 60 t de tinta, à mão, mais ou menos de 7 em 7 anos',
    },
    says: {
      pot: { kid: 'Tinta no pincel: {shade}. Agora toca numa parte do modelo.', sci: 'No pincel: {shade}. Agora uma faixa do modelo.' },
      noPot: { kid: 'Primeiro molha o pincel: toca numa lata de tinta!', sci: 'Escolhe primeiro um tom.' },
      painted: { kid: 'Pintado: {band}!', sci: 'Pintado: {band}.' },
      even: { kid: 'Olha para a vista do pé da torre: a torre toda parece da mesma cor, apesar de o topo estar pintado mais claro! Contra o céu claro, o topo pareceria mais escuro.', sci: 'Graduada, mais escura na base e mais clara no topo: vista do pé, contra o céu claro, parece de uma só cor. É por isso que a torre verdadeira é pintada em tons.' },
      topDark: { kid: 'Tudo da mesma cor, mas vista do pé o topo parece mais escuro contra o céu claro! Experimenta tinta clara lá em cima.', sci: 'Um só tom em toda a torre: contra o céu, as partes de cima parecem mais escuras. Gradua: escuro na base, claro no topo.' },
      uneven: { kid: 'Hum, vista do pé parece manchada. Experimenta escuro em baixo, médio no meio e claro no topo.', sci: 'Irregular vista do pé: gradua-a, mais escura na base.' },
      strip: { kid: 'De volta ao primário: começa outra vez!', sci: 'Decapada até ao primário.' },
      rust: { kid: 'Ferro nu, sem tinta: a ferrugem já começou. É por isso que os pintores nunca param.', sci: 'O ferro forjado sem tinta enferruja com a chuva e o ar da cidade; a tinta é a barreira, renovada mais ou menos de 7 em 7 anos, o ciclo que o próprio Eiffel definiu.' },
      busy: { kid: 'Espera, o pincel ainda está a pintar!', sci: 'Ainda a pintar.' },
    },
    panel: {
      kid: [
        'A tinta afasta a chuva e o ar do ferro, por isso a torre inteira é pintada de novo mais ou menos de sete em sete anos, à mão, com pincéis: cerca de 60 toneladas de tinta! Os pintores andam presos por cordas, como alpinistas.',
        'A cor não é igual de cima a baixo: mais escura em baixo, mais clara no topo. Vista do chão, contra o céu claro, isso faz a torre parecer toda da mesma cor. Toca numa lata, depois numa parte do modelo, e olha para a vista do pé da torre.',
      ],
      sci: [
        'Pintada de novo, em média, de 7 em 7 anos desde 1892, um ciclo definido por Eiffel: cerca de 60 t de tinta em 250 000 m², por cerca de 50 pintores com pincéis, presos com equipamento de escalada. A 20.ª campanha, começada em 2019, decapou algumas partes até ao ferro pela primeira vez.',
        'A tinta é graduada, mais escura na base e mais clara no topo, para dar uma impressão de uniformidade contra o céu. De 1968 a 2019 a cor foi o «castanho Torre Eiffel», em três tons; a 20.ª campanha trouxe de volta o castanho-amarelado que Eiffel escolheu em 1907. As três latas do modelo são tons desse castanho-amarelado.',
      ],
    },
  },
}

const PL = {
  title: 'Wieża Eiffla, 115 m nad ziemią',
  greet: {
    kid: 'Jesteśmy w środku obrazka, na wieży Eiffla, 115 m nad Paryżem! Wszystko wokół nas jest z żelaza. Po lewej pomóż brygadzie nitowników osadzić rozżarzony nit; na wprost zobacz, jak model wieży odchyla się od słońca; po prawej pomaluj go. Historia obrazka jest na sztaludze.',
    sci: 'Drugie piętro wieży Eiffla, 115 m nad ziemią, wśród kratownicy z żelaza pudlarskiego jej północnych nóg. Po lewej gorący nit osadzany przez czteroosobową brygadę; na wprost model w skali 1:100, który wygina się od słońca; po prawej farba i jej trzy odcienie. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Wieża waży około 7300 ton, ale to głównie powietrze. Gdyby przetopić całe jej żelazo na płytę szeroką jak jej podstawa, płyta miałaby tylko około 6 cm grubości!',
      'W 1887 roku, zanim wieżę zbudowano, grupa sławnych artystów podpisała w gazecie list, który nazywał ją bezużyteczną i potworną. Dziś każdy ją rysuje, gdy myśli o Paryżu.',
      'Żelazo, powietrze i deszcz dają rdzę. To farba utrzymuje tę wieżę, więc malarze wspinają się po niej mniej więcej co siedem lat.',
    ],
    sci: [
      '7300 t żelaza nad kwadratową podstawą o boku 125 m: przetopione na płytę o gęstości około 7,8 g/cm³ miałoby około 6 cm grubości. Kratownica umieszcza żelazo tylko tam, gdzie biegną obciążenia.',
      '„Protest artystów przeciwko wieży pana Eiffla” ukazał się w dzienniku Le Temps 14 lutego 1887 roku; podpisali go między innymi architekt Charles Garnier, kompozytor Charles Gounod i pisarz Guy de Maupassant.',
      'Żelazo pudlarskie: surówkę mieszano w piecu, aż wypalił się z niej prawie cały węgiel, i zostawało ciągliwe żelazo zgrzewne z włóknami żużla, z dużo mniej niż 0,1% węgla. Pochodziło z zakładów Dupont et Fould w Pompey w Lotaryngii.',
    ],
  },
  rivet: {
    label: 'Brygada nitowników',
    title: 'Osadź rozżarzony nit',
    slider: 'Temperatura nitu',
    hints: {
      heat: 'Stuknij palenisko, żeby poruszyć miechem',
      toss: 'Stuknij świecący nit, żeby go rzucić',
      push: 'Stuknij blachy, żeby wsunąć nit',
      hammer: 'Stuknij młot, żeby zrobić łeb',
      watch: 'Patrz',
      cool: 'Patrz, jak stygnie i ściska',
      again: 'Stuknij palenisko po nowy nit',
    },
    buttons: { heat: 'Porusz miechem', toss: 'Rzuć nit', push: 'Wsuń go w otwór', hammer: 'Uderz', fresh: 'Nowy nit' },
    gauge: {
      title: 'Nit',
      temp: 'Temperatura',
      length: 'Dłuższy niż zimny',
      gap: 'Szczelina między blachami',
      squeeze: 'Ścisk',
      none: 'brak',
      bigger: 'szczelina narysowana 100 razy większa',
      done: 'Osadzone nity: {n}',
    },
    lens: { atoms: 'Atomy żelaza', hot: 'drgają mocno, dalej od siebie', cold: 'spokojne, bliżej siebie' },
    says: {
      puff: { kid: 'Fuuu! Węgle świecą jaśniej, a nit robi się gorętszy.', sci: 'Powietrze z miecha sprawia, że ogień pali się szybciej i goręcej: nit nagrzewa się do około 1000 °C.' },
      red: { kid: 'Ciemnoczerwony: jeszcze za zimny. Porusz miechem jeszcze raz!', sci: 'Ciemna czerwień, około 700 °C: wciąż za sztywny, żeby wykuć dobry łeb.' },
      ready: { kid: 'Od wiśniowego do pomarańczowego: w sam raz! Stuknij nit, żeby go rzucić.', sci: 'Od wiśniowej czerwieni do pomarańczu, około 900 do 1000 °C: dość miękki, żeby go kuć. Nitownicy oceniali to na oko.' },
      hottest: { kid: 'Wystarczająco gorący! Jeszcze goręcej i żelazo zaczęłoby się psuć.', sci: 'Wystarczy. Dużo goręcej, w stronę 1400 °C, żelazo jest „przepalone”: granice ziaren się utleniają i staje się kruche.' },
      tooCold: { kid: 'Za zimny! Zimnego nitu nie da się rozklepać w dobry łeb. Najpierw go rozgrzej.', sci: 'Poniżej czerwonego żaru żelazo jest za sztywne, żeby wypełnić otwór i utworzyć łeb.' },
      toss: { kid: 'Fiuu! Podgrzewacz rzuca rozżarzony nit, a łapacz łapie go do swojego lejka.', sci: 'Podgrzewacz wyjmuje go szczypcami, strąca zgorzelinę i rzuca; łapacz łapie go do puszki w kształcie lejka.' },
      push: { kid: 'Wchodzi przez oba otwory! Przytrzymujący dociska od spodu ciężki pręt do jego łba.', sci: 'Do otworu, końcem do góry; przytrzymujący opiera przytrzymywacz o łeb fabryczny.' },
      blow: { kid: 'Bum!', sci: 'Każde uderzenie spęcza trzon, żeby wypełnił otwór.' },
      head: { kid: 'Nowy okrągły łeb! A teraz patrz: stygnąc, nit się kurczy i mocno ściąga blachy.', sci: 'Drugi łeb gotowy. Stygnąc od czerwonego żaru, trzon skraca się o około 1%, ale łby go trzymają: zostaje rozciągnięty jak sprężyna i ściska blachy.' },
      cold: { kid: 'Zimny i ciasny! Blachy są ściśnięte tak mocno, że nie mogą się przesunąć. Zostało tylko jakieś 2,5 miliona!', sci: 'Zimny: naprężenie w trzonie jest bliskie granicy plastyczności, blachy są ściśnięte, więc tarcie między nimi przenosi dużą część obciążenia. Jeden z 2,5 miliona.' },
      warm: { kid: 'Rozgrzej go znowu, a nit się wydłuży: ścisk puszcza!', sci: 'Ponownie nagrzany trzon się wydłuża i docisk słabnie.' },
      busy: { kid: 'Czekaj, nit jest w drodze!', sci: 'Nit jest w ruchu: poczekaj.' },
      notYet: { kid: 'Najpierw nit musi być gorący, a potem w lejku łapacza.', sci: 'Najpierw trzeba rozgrzać nit i go złapać.' },
    },
    panel: {
      kid: [
        'Każdy z 2,5 miliona nitów wieży osadzano rozżarzony, w czteroosobowej brygadzie: jeden grzał nit w małym palenisku, drugi przytrzymywał go na miejscu, trzeci kształtował nowy łeb, a czwarty uderzał ciężkim młotem. Dwie trzecie osadziły maszyny w warsztacie, jedną trzecią osadzono na wieży.',
        'Dlaczego na gorąco? Gorący nit jest miękki, więc daje się rozklepać, wypełnia otwór i tworzy nowy łeb. A stygnąc, kurczy się o około jedną setną długości i ściąga żelazne blachy mocniej niż jakakolwiek śruba. Stuknij palenisko, nit, blachy i młot albo użyj suwaka.',
      ],
      sci: [
        'Wszystkie 18 038 części wycięto i nawiercono w warsztacie Eiffla w Levallois-Perret, wstępnie złożono na śruby, a dwie trzecie z 2,5 miliona nitów osadzono tam maszynowo. Na wieży każdą śrubę zastępowano gorącym nitem, osadzanym przez czteroosobową brygadę: jeden go grzał, drugi przytrzymywał, trzeci kształtował łeb, a czwarty uderzał młotem dwuręcznym (według operatora wieży).',
        'Osadzany w wiśniowym żarze, około 900 do 1000 °C, trzon jest spęczany, aż wypełni otwór, i powstaje drugi łeb. Stygnąc, skraca się o około 1% (żelazo rozszerza się o około 12 µm na metr na stopień, nieco więcej na gorąco), ale łby go trzymają: trzon zostaje rozciągnięty blisko granicy plastyczności i ściska blachy. Wskaźnik rysuje szczelinę wiele razy większą.',
      ],
    },
  },
  sun: {
    label: 'Model w słońcu',
    title: 'Dlaczego szczyt odchyla się od słońca',
    time: 'Pora dnia',
    temp: 'Temperatura żelaza',
    hints: { day: 'Stuknij model, żeby przewinąć cały dzień', watch: 'Patrz na szczyt modelu', temp: 'Stuknij termometr: zima albo lato' },
    buttons: { day: 'Cały dzień', cold: 'Zima: 0 °C', mild: 'Wiosna: 15 °C', hot: 'Letnie słońce: 40 °C' },
    board: {
      title: 'Paryż, 21 czerwca',
      moved: 'Prawdziwy szczyt przesunął się o {d}',
      straight: 'Prawdziwy szczyt stoi prosto',
      loop: 'pętla o średnicy około 15 cm',
      taller: 'Żelazo w {t}: wieża o {d} wyższa niż w 15 °C',
      shorter: 'Żelazo w {t}: wieża o {d} niższa niż w 15 °C',
      same: 'Żelazo w 15 °C',
      exag: 'model 1:100, wygięcie 200 razy większe',
      north: 'Pn',
    },
    says: {
      day: { kid: 'Wschód słońca! Patrz na szczyt: odchyla się od słońca, gdy słońce wędruje po niebie.', sci: 'Słońce ogrzewa jedną ścianę; wydłuża się ona bardziej niż ściany w cieniu, więc wieża wygina się od słońca.' },
      dayEnd: { kid: 'Zachód słońca! W ciągu dnia szczyt zatoczył pętlę o średnicy około 15 cm. W nocy całe żelazo stygnie do jednej temperatury i wieża znów stoi prosto.', sci: 'W pogodny dzień szczyt zatacza mniej więcej kołową krzywą o średnicy około 15 cm (dane operatora wieży); w nocy, gdy ściany mają znów jedną temperaturę, wraca na miejsce.' },
      night: { kid: 'Noc: słońce nie świeci na żadną stronę, więc wieża stoi prosto.', sci: 'Bez bezpośredniego słońca temperatury ścian się wyrównują i wygięcie znika.' },
      cold: { kid: 'Zimne żelazo: cała wieża jest odrobinę niższa.', sci: 'W 0 °C, 15 stopni poniżej odniesienia: około 5,4 cm niżej.' },
      mild: { kid: 'Łagodnie: wieża ma swoją zwykłą wysokość.', sci: 'Odniesienie: 15 °C.' },
      hot: { kid: 'Gorące żelazo: cała wieża jest odrobinę wyższa, o około 3,6 mm na każdy stopień!', sci: 'W 40 °C, 25 stopni powyżej odniesienia: 300 m × 12 µm/m na stopień × 25 = około 9 cm wyżej.' },
      busy: { kid: 'Czekaj, dzień jeszcze trwa!', sci: 'Dzień jeszcze trwa.' },
    },
    panel: {
      kid: [
        'Żelazo odrobinę się wydłuża, gdy się nagrzewa. Gdy słońce świeci na jedną stronę wieży, ta strona nagrzewa się i wydłuża bardziej niż strony w cieniu, więc cała wieża wygina się, bardzo lekko, od słońca. Gdy słońce wędruje, szczyt zatacza pętlę o średnicy około 15 cm.',
        'Model pokazuje to wygięcie 200 razy większe, żeby było je widać. A gdy całe żelazo wieży ogrzeje się o jeden stopień, wieża urośnie o około 3,6 mm. Wypróbuj termometr, suwak pory dnia albo stuknij model, żeby przewinąć cały dzień.',
      ],
      sci: [
        'Współczynnik rozszerzalności liniowej żelaza wynosi około 12 µm na metr na kelwin, więc około 300 m żelaza wydłuża się o około 3,6 mm na kelwin. To, jak bardzo zmienia się prawdziwa wieża w ciągu roku, zależy od tego, jak bardzo nagrzewa się jej żelazo: źródła podają od kilku milimetrów do około 15 cm, więc suwak pokazuje tylko, co dałoby równomierne ogrzanie.',
        'Światło słoneczne ogrzewa jedną ścianę bardziej niż pozostałe, a różnica wygina wieżę od Słońca: w pogodny dzień szczyt zatacza mniej więcej kołową krzywą o średnicy około 15 cm (dane operatora wieży). Tu słońce stoi tam, gdzie nad Paryżem 21 czerwca (czas letni), a model w skali 1:100 wygina się 200 razy bardziej niż w skali.',
      ],
    },
  },
  paint: {
    label: 'Malarze',
    title: 'Pomaluj wieżę',
    pots: { dark: 'Ciemna', mid: 'Średnia', light: 'Jasna' },
    bands: { bottom: 'dół', middle: 'środek', top: 'góra' },
    hints: { pot: 'Stuknij puszkę z farbą', band: 'Stuknij część modelu, żeby ją pomalować', rust: 'Stuknij goły koniec belki' },
    buttons: { dark: 'Ciemna farba', mid: 'Średnia farba', light: 'Jasna farba', bottom: 'Pomaluj dół', middle: 'Pomaluj środek', top: 'Pomaluj górę', strip: 'Z powrotem do podkładu' },
    view: {
      title: 'Widok spod wieży',
      bare: 'Na razie sam podkład',
      part: 'Pomalowane: {n} z 3',
      even: 'Wygląda na jeden równy kolor!',
      topDark: 'Góra wygląda na ciemniejszą',
      uneven: 'Wygląda na łaciatą',
      real: 'Prawdziwa wieża: około 60 t farby, ręcznie, mniej więcej co 7 lat',
    },
    says: {
      pot: { kid: 'Farba na pędzlu: {shade}. Teraz stuknij część modelu.', sci: 'Na pędzlu: {shade}. Teraz pas modelu.' },
      noPot: { kid: 'Najpierw zamocz pędzel: stuknij puszkę z farbą!', sci: 'Najpierw wybierz odcień.' },
      painted: { kid: 'Pomalowane: {band}!', sci: 'Pomalowane: {band}.' },
      even: { kid: 'Spójrz na widok spod wieży: cała wieża wygląda na jeden kolor, chociaż góra jest pomalowana najjaśniej! Na tle jasnego nieba góra wyglądałaby na ciemniejszą.', sci: 'Cieniowana, najciemniejsza u podstawy, najjaśniejsza u góry: spod wieży, na tle jasnego nieba, wygląda na jeden równy kolor. Dlatego prawdziwą wieżę maluje się w odcieniach.' },
      topDark: { kid: 'Wszystko jednym kolorem, ale spod wieży góra wygląda na ciemniejszą na tle jasnego nieba! Spróbuj jasnej farby na górze.', sci: 'Jeden odcień na całości: na tle nieba górne części wyglądają na ciemniejsze. Cieniuj: ciemno u podstawy, jasno u góry.' },
      uneven: { kid: 'Hmm, spod wieży wygląda na łaciatą. Spróbuj ciemnej na dole, średniej w środku i jasnej na górze.', sci: 'Nierówno spod wieży: cieniuj, najciemniej u podstawy.' },
      strip: { kid: 'Z powrotem do podkładu: zacznij od nowa!', sci: 'Zdarta do podkładu.' },
      rust: { kid: 'Gołe żelazo bez farby: rdza już się zaczęła. Dlatego malarze nigdy nie przestają.', sci: 'Niemalowane żelazo zgrzewne rdzewieje od deszczu i miejskiego powietrza; farba jest barierą, odnawianą mniej więcej co 7 lat, w cyklu ustalonym przez samego Eiffla.' },
      busy: { kid: 'Czekaj, pędzel jeszcze maluje!', sci: 'Jeszcze maluje.' },
    },
    panel: {
      kid: [
        'Farba chroni żelazo przed deszczem i powietrzem, więc całą wieżę maluje się od nowa mniej więcej co siedem lat, ręcznie, pędzlami: około 60 ton farby! Malarze są przypięci linami jak alpiniści.',
        'Kolor nie jest taki sam na całej wysokości: najciemniejszy na dole, najjaśniejszy na górze. Z ziemi, na tle jasnego nieba, dzięki temu wieża wygląda na równo pomalowaną. Stuknij puszkę, potem część modelu, i spójrz na widok spod wieży.',
      ],
      sci: [
        'Malowana od nowa średnio co 7 lat od 1892 roku, w cyklu ustalonym przez Eiffla: około 60 t farby na 250 000 m², przez około 50 malarzy z pędzlami, przypiętych sprzętem wspinaczkowym. Dwudziesta kampania, rozpoczęta w 2019 roku, po raz pierwszy zdarła niektóre części aż do żelaza.',
        'Farba jest cieniowana, najciemniejsza u podstawy i najjaśniejsza u góry, żeby wieża na tle nieba wyglądała jednolicie. Od 1968 do 2019 roku kolorem był „brąz wieży Eiffla” w trzech odcieniach; dwudziesta kampania przywróciła żółtobrązowy kolor, który Eiffel wybrał w 1907 roku. Trzy puszki przy modelu to odcienie tego żółtego brązu.',
      ],
    },
  },
}

const DE = {
  title: 'Der Eiffelturm, 115 m hoch',
  greet: {
    kid: 'Wir sind im Bild, auf dem Eiffelturm, 115 m über Paris! Alles um uns herum ist aus Eisen. Links hilfst du der Nietkolonne, eine glühende Niete zu setzen; vorne siehst du, wie sich ein Modell des Turms von der Sonne wegneigt; rechts streichst du es an. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Die zweite Etage des Eiffelturms, 115 m hoch, zwischen dem Fachwerk aus Puddeleisen seiner Nordpfeiler. Links eine heiße Niete, gesetzt von einer Kolonne zu viert; vorne ein Modell im Maßstab 1:100, das sich von der Sonne wegbiegt; rechts die Farbe und ihre drei Töne. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Der Turm wiegt etwa 7300 Tonnen, aber er besteht fast nur aus Luft. Würde man sein ganzes Eisen zu einer Platte so breit wie sein Fuß schmelzen, wäre sie nur etwa 6 cm dick!',
      '1887, bevor er gebaut war, unterschrieb eine Gruppe berühmter Künstler einen Brief in einer Zeitung, der ihn nutzlos und monströs nannte. Heute malt ihn jeder, der an Paris denkt.',
      'Eisen, Luft und Regen machen Rost. Die Farbe hält diesen Turm am Leben, deshalb klettern etwa alle sieben Jahre Maler auf ihm herum.',
    ],
    sci: [
      '7300 t Eisen über einem Fuß von 125 m im Quadrat: zu einer Platte mit etwa 7,8 g/cm³ geschmolzen, wäre sie etwa 6 cm dick. Das Fachwerk setzt das Eisen nur dorthin, wo die Lasten laufen.',
      'Der „Protest der Künstler gegen den Turm des Herrn Eiffel“ erschien am 14. Februar 1887 in der Zeitung Le Temps, unterschrieben unter anderem vom Architekten Charles Garnier, vom Komponisten Charles Gounod und vom Schriftsteller Guy de Maupassant.',
      'Puddeleisen: Roheisen, im Ofen gerührt, bis fast sein ganzer Kohlenstoff verbrannt war; übrig blieb ein zähes Schmiedeeisen mit Schlackenfäden und weit unter 0,1% Kohlenstoff. Es kam aus den Werken Dupont et Fould in Pompey in Lothringen.',
    ],
  },
  rivet: {
    label: 'Die Nietkolonne',
    title: 'Setz eine glühende Niete',
    slider: 'Temperatur der Niete',
    hints: {
      heat: 'Tippe auf die Esse, um den Blasebalg zu drücken',
      toss: 'Tippe auf die glühende Niete, um sie zu werfen',
      push: 'Tippe auf die Bleche, um die Niete hineinzustecken',
      hammer: 'Tippe auf den Hammer, um den Kopf zu formen',
      watch: 'Schau zu',
      cool: 'Schau, wie sie abkühlt und zieht',
      again: 'Tippe auf die Esse für eine neue Niete',
    },
    buttons: { heat: 'Blasebalg drücken', toss: 'Niete werfen', push: 'Hineinstecken', hammer: 'Zuschlagen', fresh: 'Neue Niete' },
    gauge: {
      title: 'Die Niete',
      temp: 'Temperatur',
      length: 'Länger als kalt',
      gap: 'Spalt zwischen den Blechen',
      squeeze: 'Klemmkraft',
      none: 'keiner',
      bigger: 'Spalt 100-mal größer gezeichnet',
      done: 'Gesetzte Nieten: {n}',
    },
    lens: { atoms: 'Eisenatome', hot: 'zittern stark, weiter auseinander', cold: 'ruhig, näher beisammen' },
    says: {
      puff: { kid: 'Puff! Die Kohlen glühen heller und die Niete wird heißer.', sci: 'Die Luft aus dem Blasebalg lässt das Feuer schneller und heißer brennen: Die Niete steigt auf etwa 1000 °C.' },
      red: { kid: 'Dunkelrot: noch nicht heiß genug. Noch mal drücken!', sci: 'Dunkelrot, etwa 700 °C: noch zu steif, um einen guten Kopf zu schmieden.' },
      ready: { kid: 'Kirschrot bis orange: genau richtig! Tippe auf die Niete, um sie zu werfen.', sci: 'Kirschrot bis orange, etwa 900 bis 1000 °C: weich genug zum Schmieden. Die Nieter beurteilten das nach Augenmaß.' },
      hottest: { kid: 'Heiß genug! Noch heißer, und das Eisen würde verderben.', sci: 'Heiß genug. Viel heißer, gegen 1400 °C, ist das Eisen „verbrannt“: Seine Korngrenzen oxidieren und es wird spröde.' },
      tooCold: { kid: 'Zu kalt! Eine kalte Niete lässt sich nicht zu einem guten Kopf quetschen. Erst heiß machen.', sci: 'Unter Rotglut ist das Eisen zu steif, um das Loch zu füllen und einen Kopf zu bilden.' },
      toss: { kid: 'Zisch! Der Wärmer wirft die glühende Niete, und der Fänger fängt sie mit seinem Trichter.', sci: 'Der Wärmer nimmt sie mit der Zange heraus, klopft den Zunder ab und wirft sie; der Fänger fängt sie in einer trichterförmigen Dose.' },
      push: { kid: 'Hinein, durch beide Löcher! Der Vorhalter drückt von unten eine schwere Stange gegen ihren Kopf.', sci: 'Ins Loch, das Ende nach oben; der Vorhalter stemmt den Gegenhalter gegen den Setzkopf.' },
      blow: { kid: 'Bumm!', sci: 'Jeder Schlag staucht den Schaft, bis er das Loch füllt.' },
      head: { kid: 'Ein neuer runder Kopf! Jetzt schau: Beim Abkühlen schrumpft die Niete und zieht die Bleche fest zusammen.', sci: 'Der Schließkopf ist geformt. Beim Abkühlen aus der Rotglut wird der Schaft um etwa 1% kürzer, aber die Köpfe halten ihn: Er wird wie eine Feder gespannt und presst die Bleche zusammen.' },
      cold: { kid: 'Kalt und fest! Die Bleche sind so stark zusammengepresst, dass sie nicht rutschen können. Nur noch etwa 2,5 Millionen!', sci: 'Kalt: Die Zugspannung im Schaft liegt nahe der Streckgrenze, die Bleche sind verspannt, und die Reibung zwischen ihnen trägt einen großen Teil der Last. Eine von 2,5 Millionen.' },
      warm: { kid: 'Mach sie wieder warm, und die Niete wird länger: Die Klemmkraft lässt nach!', sci: 'Wieder erwärmt, längt sich der Schaft und die Verspannung lässt nach.' },
      busy: { kid: 'Warte, die Niete ist unterwegs!', sci: 'Die Niete bewegt sich: warte.' },
      notYet: { kid: 'Erst muss die Niete heiß sein und dann im Trichter des Fängers.', sci: 'Die Niete muss erst erhitzt und gefangen werden.' },
    },
    panel: {
      kid: [
        'Jede der 2,5 Millionen Nieten des Turms wurde glühend gesetzt, von einer Kolonne zu viert: einer machte sie in einer kleinen Esse heiß, einer hielt sie fest, einer formte den neuen Kopf, und einer schlug mit einem schweren Vorschlaghammer zu. Zwei Drittel setzten Maschinen in der Werkstatt, ein Drittel wurde oben am Turm gesetzt.',
        'Warum heiß? Eine heiße Niete ist weich, also lässt sie sich quetschen, füllt ihr Loch und bekommt einen neuen Kopf. Und beim Abkühlen schrumpft sie, um etwa ein Hundertstel ihrer Länge, und zieht die Eisenbleche fester zusammen als jede Schraube. Tippe auf die Esse, die Niete, die Bleche und den Hammer, oder nimm den Schieber.',
      ],
      sci: [
        'Die 18.038 Teile wurden in Eiffels Werkstatt in Levallois-Perret zugeschnitten und gebohrt, mit Schrauben vormontiert, und zwei Drittel der 2,5 Millionen Nieten wurden dort maschinell gesetzt. Am Turm wurde jede Schraube durch eine heiße Niete ersetzt, gesetzt von einer Kolonne zu viert: einer zum Erhitzen, einer zum Festhalten, einer zum Formen des Kopfes und einer zum Zuschlagen mit dem Vorschlaghammer (nach Angaben der Betreibergesellschaft).',
        'In Kirschrotglut gesetzt, etwa 900 bis 1000 °C, wird der Schaft gestaucht, bis er das Loch füllt, und ein Schließkopf geformt. Beim Abkühlen wird er um etwa 1% kürzer (Eisen dehnt sich um etwa 12 µm pro Meter und Grad, heiß etwas mehr), aber die Köpfe halten ihn: Der Schaft steht unter Zug nahe der Streckgrenze und presst die Bleche zusammen. Die Anzeige zeichnet den Spalt viel größer.',
      ],
    },
  },
  sun: {
    label: 'Das Modell in der Sonne',
    title: 'Warum sich die Spitze von der Sonne wegneigt',
    time: 'Tageszeit',
    temp: 'Temperatur des Eisens',
    hints: { day: 'Tippe auf das Modell für einen ganzen Tag', watch: 'Schau auf die Spitze des Modells', temp: 'Tippe auf das Thermometer für Winter oder Sommer' },
    buttons: { day: 'Einen ganzen Tag', cold: 'Winter: 0 °C', mild: 'Frühling: 15 °C', hot: 'Sommersonne: 40 °C' },
    board: {
      title: 'Paris, 21. Juni',
      moved: 'Die echte Spitze hat sich um {d} bewegt',
      straight: 'Die echte Spitze steht gerade',
      loop: 'Schleife von etwa 15 cm',
      taller: 'Eisen bei {t}: {d} höher als bei 15 °C',
      shorter: 'Eisen bei {t}: {d} niedriger als bei 15 °C',
      same: 'Eisen bei 15 °C',
      exag: 'Modell 1:100, Biegung 200-mal größer gezeichnet',
      north: 'N',
    },
    says: {
      day: { kid: 'Sonnenaufgang! Schau auf die Spitze: Sie neigt sich von der Sonne weg, während die Sonne über den Himmel zieht.', sci: 'Die Sonne erwärmt eine Seite; diese Seite längt sich stärker als die schattigen, also biegt sich der Turm von der Sonne weg.' },
      dayEnd: { kid: 'Sonnenuntergang! Im Lauf des Tages hat die Spitze eine Schleife von etwa 15 cm gezeichnet. Nachts kühlt das ganze Eisen auf dieselbe Temperatur ab, und der Turm steht wieder gerade.', sci: 'An einem klaren Tag beschreibt die Spitze eine mehr oder weniger kreisförmige Kurve von etwa 15 cm (die Angabe der Betreibergesellschaft); über Nacht, wenn die Seiten wieder gleich warm sind, kehrt sie zurück.' },
      night: { kid: 'Nacht: Keine Seite bekommt Sonne, also steht der Turm gerade.', sci: 'Ohne direkte Sonne gleichen sich die Temperaturen der Seiten an, und die Biegung verschwindet.' },
      cold: { kid: 'Kaltes Eisen: Der ganze Turm ist ein bisschen niedriger.', sci: 'Bei 0 °C, 15 Grad unter dem Bezugswert: etwa 5,4 cm niedriger.' },
      mild: { kid: 'Mild: Der Turm hat seine gewohnte Höhe.', sci: 'Der Bezugswert: 15 °C.' },
      hot: { kid: 'Heißes Eisen: Der ganze Turm ist ein bisschen höher, etwa 3,6 mm für jedes Grad!', sci: 'Bei 40 °C, 25 Grad über dem Bezugswert: 300 m × 12 µm/m pro Grad × 25 = etwa 9 cm höher.' },
      busy: { kid: 'Warte, der Tag läuft noch!', sci: 'Der Tag läuft noch.' },
    },
    panel: {
      kid: [
        'Eisen wird ein winziges bisschen länger, wenn es warm wird. Wenn die Sonne auf eine Seite des Turms scheint, wird diese Seite wärmer und dehnt sich mehr als die schattigen Seiten, also biegt sich der ganze Turm, ganz leicht, von der Sonne weg. Während die Sonne wandert, zeichnet die Spitze eine Schleife von etwa 15 cm.',
        'Das Modell zeigt diese Biegung 200-mal größer, damit du sie sehen kannst. Und wenn das ganze Eisen des Turms um ein Grad wärmer wird, wächst der Turm um etwa 3,6 mm. Probier das Thermometer, den Schieber für die Tageszeit, oder tippe auf das Modell für einen ganzen Tag.',
      ],
      sci: [
        'Der lineare Ausdehnungskoeffizient von Eisen beträgt etwa 12 µm pro Meter und Kelvin, also längen sich etwa 300 m Eisen um etwa 3,6 mm pro Kelvin. Wie sehr sich der echte Turm im Lauf eines Jahres ändert, hängt davon ab, wie warm sein Eisen wird: Die Quellen reichen von einigen Millimetern bis etwa 15 cm, deshalb zeigt der Schieber nur, was eine gleichmäßige Erwärmung bewirken würde.',
        'Sonnenlicht erwärmt eine Seite stärker als die anderen, und der Unterschied biegt den Turm von der Sonne weg: An einem klaren Tag beschreibt die Spitze eine mehr oder weniger kreisförmige Kurve von etwa 15 cm (die Angabe der Betreibergesellschaft). Hier steht die Sonne dort, wo sie am 21. Juni über Paris steht (Sommerzeit), und das Modell im Maßstab 1:100 biegt sich 200-mal stärker als maßstabsgetreu.',
      ],
    },
  },
  paint: {
    label: 'Die Maler',
    title: 'Streich den Turm an',
    pots: { dark: 'Dunkel', mid: 'Mittel', light: 'Hell' },
    bands: { bottom: 'unten', middle: 'die Mitte', top: 'oben' },
    hints: { pot: 'Tippe auf einen Farbtopf', band: 'Tippe auf einen Teil des Modells, um ihn zu streichen', rust: 'Tippe auf das blanke Trägerende' },
    buttons: { dark: 'Dunkle Farbe', mid: 'Mittlere Farbe', light: 'Helle Farbe', bottom: 'Unten streichen', middle: 'Mitte streichen', top: 'Oben streichen', strip: 'Zurück zur Grundierung' },
    view: {
      title: 'Vom Fuß des Turms aus gesehen',
      bare: 'Noch nackte Grundierung',
      part: 'Gestrichen: {n} von 3',
      even: 'Er wirkt wie aus einer Farbe!',
      topDark: 'Oben wirkt er dunkler',
      uneven: 'Er wirkt fleckig',
      real: 'Der echte Turm: etwa 60 t Farbe, von Hand, etwa alle 7 Jahre',
    },
    says: {
      pot: { kid: 'Farbe am Pinsel: {shade}. Jetzt tippe auf einen Teil des Modells.', sci: 'Am Pinsel: {shade}. Jetzt ein Abschnitt des Modells.' },
      noPot: { kid: 'Tauch zuerst den Pinsel ein: Tippe auf einen Farbtopf!', sci: 'Wähle zuerst einen Ton.' },
      painted: { kid: 'Gestrichen: {band}!', sci: 'Gestrichen: {band}.' },
      even: { kid: 'Schau auf die Ansicht vom Fuß: Der ganze Turm wirkt wie aus einer Farbe, obwohl die Spitze am hellsten gestrichen ist! Vor dem hellen Himmel würde die Spitze dunkler wirken.', sci: 'Abgestuft, unten am dunkelsten, oben am hellsten: Vom Fuß aus, vor dem hellen Himmel, wirkt er einfarbig. Deshalb ist der echte Turm abgestuft gestrichen.' },
      topDark: { kid: 'Alles in einer Farbe, aber vom Fuß aus wirkt die Spitze vor dem hellen Himmel dunkler! Probier helle Farbe oben.', sci: 'Ein Ton überall: Vor dem Himmel wirken die oberen Teile dunkler. Abstufen: unten dunkel, oben hell.' },
      uneven: { kid: 'Hm, vom Fuß aus wirkt er fleckig. Probier dunkel unten, mittel in der Mitte und hell oben.', sci: 'Vom Fuß aus ungleichmäßig: unten am dunkelsten abstufen.' },
      strip: { kid: 'Zurück zur Grundierung: noch mal von vorn!', sci: 'Bis zur Grundierung abgebeizt.' },
      rust: { kid: 'Blankes Eisen ohne Farbe: Der Rost hat schon angefangen. Deshalb hören die Maler nie auf.', sci: 'Ungestrichenes Schmiedeeisen rostet in Regen und Stadtluft; die Farbe ist die Schutzschicht, etwa alle 7 Jahre erneuert, in dem Rhythmus, den Eiffel selbst festlegte.' },
      busy: { kid: 'Warte, der Pinsel streicht noch!', sci: 'Es wird noch gestrichen.' },
    },
    panel: {
      kid: [
        'Die Farbe hält Regen und Luft vom Eisen fern, deshalb wird der ganze Turm etwa alle sieben Jahre neu gestrichen, von Hand, mit Pinseln: etwa 60 Tonnen Farbe! Die Maler sind angeseilt wie Bergsteiger.',
        'Die Farbe ist nicht überall gleich: unten am dunkelsten, oben am hellsten. Vom Boden aus, vor dem hellen Himmel, wirkt der Turm dadurch gleichmäßig gefärbt. Tippe auf einen Topf, dann auf einen Teil des Modells, und schau auf die Ansicht vom Fuß.',
      ],
      sci: [
        'Seit 1892 im Schnitt alle 7 Jahre neu gestrichen, in einem Rhythmus, den Eiffel festlegte: etwa 60 t Farbe auf 250.000 m², von etwa 50 Malern mit Pinseln, mit Kletterausrüstung gesichert. Die 20. Kampagne, 2019 begonnen, hat zum ersten Mal einige Teile bis aufs Eisen abgebeizt.',
        'Die Farbe ist abgestuft, unten am dunkelsten und oben am hellsten, damit der Turm vor dem Himmel gleichmäßig wirkt. Von 1968 bis 2019 war die Farbe „Eiffelturm-Braun“ in drei Tönen; die 20. Kampagne brachte das Gelbbraun zurück, das Eiffel 1907 gewählt hatte. Die drei Töpfe am Modell sind Töne dieses Gelbbrauns.',
      ],
    },
  },
}

export const TOWER_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
