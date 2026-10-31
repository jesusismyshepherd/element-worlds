// The words of oxygen's bathhouse by the frozen lake ("Water is mostly oxygen"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/O.js (the easel shows it). Each step is done by tapping its thing: `hints` are what the
// prompt shows as the next step, `verbs` the panels' buttons that do the same; `signs` are drawn in 3D
// (plain text: no subscripts, no Greek letters). Numbers in `says` are for the four amounts the balance
// takes apart (a glass 0.25 L, a bucket 10 L, the bath 150 L, an Olympic pool 2500 m³, at 1 kg per litre).
// Sources: masses from H 1.008, O 15.999 (H2O 18.015 g/mol); gases at 20 °C and 1 atm (24.06 L/mol); ice
// 0.917 g/cm³ and water 0.9998 g/cm³ at 0 °C; water densest at 3.98 °C; the stream bent by induced charge
// (Ziaei-Moayyed, Goodman and Williams, J. Chem. Educ. 77, 1520, 2000); Volta's letter of 20 March 1800,
// Nicholson and Carlisle's account in Nicholson's Journal, July 1800.
const EN = {
  title: 'The bathhouse by the lake',
  greet: {
    kid: "Welcome to the bathhouse by the frozen lake! I am oxygen, and almost all the water here is me: nearly nine tenths of its weight. Take the bath apart on the great balance, meet the bent water molecule, and find out why the ice floats on the lake. The picture's story is on the easel.",
    sci: "Welcome. In H₂O, 16.00 of every 18.02 g is oxygen: 88.8% by mass. Three things to try: the bath taken apart and weighed, the bent and polar molecule, and the lake, which freezes from the top because water is densest at about 4 °C. The picture's story is on the easel.",
  },
  talk: {
    kid: [
      'One drop of water holds more than a thousand billion billion water molecules, and every one of them has an oxygen atom in the middle.',
      'In this room water comes three ways: ice on the lake, liquid in the bath, and the white mist over the bath, tiny droplets of water that had gone off into the air as a gas.',
      'I am heavy for a small atom: one oxygen atom weighs as much as sixteen hydrogen atoms. That is why water is mostly me.',
    ],
    sci: [
      'H₂O: 2 × 1.008 + 16.00 = 18.02 g/mol. A drop of 0.05 mL holds about 1.7 × 10²¹ molecules.',
      'Water is densest at 3.98 °C (0.99997 g/cm³). Ice at 0 °C is 0.917 g/cm³, so it floats with about 92% of it under fresh water.',
      'The O–H bond is 0.96 Å long. Oxygen (electronegativity 3.44) and hydrogen (2.20) make each bond polar, and the bent shape adds the two up: a dipole moment of 1.85 D.',
    ],
  },
  balance: {
    label: 'The great balance',
    title: 'Take the water apart',
    amount: 'How much water',
    amounts: { glass: 'A glass', bucket: 'A bucket', bath: 'The bath', pool: 'An Olympic pool' },
    plate: '{what}: {litres} of water',
    million: '{n} million',
    litre: 'L',
    ml: 'mL',
    signs: { oxygen: 'oxygen', hydrogen: 'hydrogen', gas: '{v} as gas', pile: "Volta's pile", water: 'water' },
    verbs: { split: 'Take the water apart', back: 'Put it back together', on: 'Connect the battery', off: 'Disconnect the battery', empty: 'Empty the tubes' },
    hints: { bath: 'Tap the bath', watch: 'Watch the balance', volt: 'Tap the battery by the bath', running: 'Watch the bubbles', back: 'Tap the balance to put the water back', empty: 'Tap the glass tubes to empty them' },
    rows: { water: 'Water', oxygen: 'Oxygen in it', hydrogen: 'Hydrogen in it', o2gas: 'The oxygen as a gas (20 °C)', h2gas: 'The hydrogen as a gas (20 °C)' },
    says: {
      split: {
        kid: 'Whoosh! The water comes apart into oxygen and hydrogen. Look at the balance: the oxygen is so much heavier that its pan sinks right down.',
        sci: 'H₂O split into its elements: 88.8% of the mass is oxygen, 11.2% hydrogen. The hydrogen fills two globes, the oxygen one (2 H₂ for every O₂), and still the oxygen weighs eight times more.',
      },
      back: {
        kid: 'Back together, and back into the bath. When hydrogen and oxygen really join up, they do it with a bang and a lot of heat: that is how some rockets fly.',
        sci: '2 H₂ + O₂ → 2 H₂O releases 286 kJ per mole of liquid water, exactly what splitting it took. Hydrogen and liquid oxygen drove the Space Shuttle\'s main engines.',
      },
      first: { kid: 'First tap the bath to take its water apart.', sci: 'Nothing on the pans yet: split the water first (the bath).' },
      amounts: {
        glass: { kid: 'A glass of water: 222 grams of oxygen and only 28 grams of hydrogen.', sci: '0.25 L: 222 g O and 28 g H; as gases, 167 L of O₂ and 334 L of H₂.' },
        bucket: { kid: 'A bucket of water: almost 9 kilograms of oxygen and about 1 kilogram of hydrogen.', sci: '10 L: 8.9 kg O and 1.1 kg H; as gases, 6.7 m³ of O₂ and 13 m³ of H₂.' },
        bath: { kid: 'The whole bath: about 133 kilograms of oxygen, about as heavy as two grown-ups, and 17 kilograms of hydrogen.', sci: '150 L: 133 kg O and 17 kg H; as gases, 100 m³ of O₂ and 200 m³ of H₂ (balls 5.8 and 7.3 m across).' },
        pool: { kid: 'A whole Olympic swimming pool: about 2220 tonnes of oxygen! That is as heavy as more than 300 elephants.', sci: '2500 m³: 2220 t O and 280 t H; as gases, 1.7 million m³ of O₂ and 3.3 million m³ of H₂.' },
      },
      on: {
        kid: 'The battery pushes electricity through the water. Bubbles! Hydrogen comes off the wire on the minus side, oxygen off the one on the plus side.',
        sci: 'Cathode (−): 4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻. Anode (+): 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. A little sulfuric acid or sodium sulfate in the water carries the current; pure water barely conducts.',
      },
      full: {
        kid: 'Look at the tubes: twice as much hydrogen as oxygen! Every water molecule has two hydrogens for its one oxygen.',
        sci: '2 H₂O → 2 H₂ + O₂: two volumes of hydrogen for one of oxygen. Equal volumes of gas hold equal numbers of molecules (Avogadro, 1811).',
      },
      off: { kid: 'Battery off: no more bubbles.', sci: 'Circuit open: the electrolysis stops.' },
      empty: { kid: 'Psst! The taps let the gas out, and the tubes fill with water again.', sci: 'Stopcocks opened: the gases escape and the electrolyte refills the tubes.' },
      emptyFirst: { kid: 'The tubes are full of gas. Tap the glass tubes to empty them first.', sci: 'Both tubes are full: empty them first (the glass tubes).' },
    },
    panel: {
      kid: [
        'Water is made of oxygen and hydrogen, and oxygen is much heavier: almost nine tenths of the weight of water is oxygen. Tap the bath and watch its water come apart, the oxygen onto one pan and the hydrogen onto the other.',
        'As gases, the hydrogen takes twice the room of the oxygen (two globes against one), but it weighs eight times less. Slide to take apart a glass, a bucket, the bath or a whole swimming pool. The battery by the bath splits water for real, a little at a time.',
      ],
      sci: [
        'Mass fractions in H₂O: oxygen 15.999/18.015 = 88.8%, hydrogen 11.2%. A 150 L bath (about 150 kg) holds about 133 kg of oxygen and 17 kg of hydrogen.',
        'As gases at 20 °C and 1 atm (24.06 L/mol), its 8330 mol of water give about 200 m³ of H₂ and 100 m³ of O₂: twice the volume, an eighth of the mass. Splitting it all takes at least 286 kJ per mole, about 660 kWh. The globes stand for closed vessels: in the open air a hydrogen balloon would float away.',
      ],
    },
    historyTitle: 'The first to split water with a battery',
    history: {
      kid: [
        "In 1800 Alessandro Volta built the first battery: a pile of copper and zinc discs with salty cardboard between them. Only weeks later, in London, William Nicholson and Anthony Carlisle put two wires from such a pile into water and saw bubbles of hydrogen and oxygen. They were the first to split water with a battery.",
      ],
      sci: [
        "Volta described his pile in a letter of 20 March 1800. Before it was read at the Royal Society, William Nicholson and Anthony Carlisle had built one in London and split water with it; their account appeared in Nicholson's Journal in July 1800. Paets van Troostwijk and Deiman had already split water with sparks from a friction machine in 1789. The glass apparatus with three tubes is Hofmann's, from 1866.",
      ],
    },
  },
  molecule: {
    label: 'The bent molecule',
    title: 'A bent molecule',
    signs: { scale: 'water, 2 billion times bigger', angle: '{a}°', wool: 'wool', salt: 'salt' },
    verbs: { charges: 'Show its charges', hide: 'Hide its charges', balloon: 'Rub the balloon on the wool', back: 'Put the balloon back', salt: 'Drop in some salt' },
    hints: { model: 'Tap the big molecule', balloon: 'Tap the balloon', salt: 'Tap the salt', any: 'Tap the molecule, the balloon or the salt', wait: 'Watch' },
    says: {
      charges: {
        kid: 'Oxygen pulls the electrons it shares with the hydrogens a little closer to itself. So the oxygen end is a tiny bit negative and the hydrogen ends a tiny bit positive. And the molecule is bent, like a boomerang, at 104.5 degrees.',
        sci: 'O (electronegativity 3.44) draws the bonding electrons from H (2.20): a partial charge δ− on O and δ+ on each H. The bonds meet at 104.5°, less than the tetrahedral 109.5° because O\'s two lone pairs push them together, so the bond dipoles add up: 1.85 D.',
      },
      hide: { kid: 'Charges hidden. They are always there, though!', sci: 'Charges hidden; the dipole stays.' },
      rub: { kid: 'Rub, rub, rub! The balloon takes tiny bits of electric charge from the wool. Now it is charged.', sci: 'Rubber on wool: electrons pass to the balloon, which charges negatively.' },
      bend: {
        kid: 'The stream bends towards the balloon! The charged balloon pulls the opposite kind of charge into the water as it leaves the tap, and opposite charges attract.',
        sci: 'The stream bends: the negative balloon induces a positive charge in the water where it leaves the tap, and the charged stream is attracted. Many books credit the dipoles turning, but a dipole feels almost no pull in so gentle a field; the induced charge does it (Ziaei-Moayyed, Goodman and Williams, 2000).',
      },
      back: { kid: 'Balloon back on its string. Its charge slowly leaks away into the air.', sci: 'The balloon\'s charge leaks away, faster in damp air.' },
      salt: {
        kid: 'A grain of salt falls in. Watch: water molecules turn their red oxygen sides to the sodium and their white hydrogen sides to the chloride, and pull them away one by one.',
        sci: 'NaCl → Na⁺(aq) + Cl⁻(aq). Each ion gets a hydration shell of about six waters: oxygen inward round Na⁺, hydrogen inward round Cl⁻. Water\'s permittivity (εr ≈ 80) weakens the ions\' pull on each other about eighty times.',
      },
      done: {
        kid: 'All gone! The salt is still there, but in pieces far too small to see, each one wrapped in water.',
        sci: 'Fully dissolved, the ions hydrated. A litre of water takes up to about 360 g of salt at 20 °C.',
      },
    },
    panel: {
      kid: [
        'A water molecule is one oxygen holding two hydrogens, and it is bent. Oxygen pulls the shared electrons towards itself, so the molecule has a slightly negative end (the oxygen) and two slightly positive ends (the hydrogens). Here they are drawn about two billion times bigger: walk among them.',
        'Those charged ends make water good at pulling things apart: tap the salt and watch. And water lets electric charge move through it, so a charged balloon can pull its stream sideways.',
      ],
      sci: [
        'H₂O is bent (104.5°) and polar: oxygen\'s greater electronegativity gives it a partial negative charge and each hydrogen a partial positive one; dipole moment 1.85 D. Its high permittivity (εr ≈ 80 at 20 °C) and its hydrogen bonds make it an outstanding solvent for ions.',
        'The bending stream is a classic demonstration, but its cause is charge, not dipoles turning: the charged balloon draws charge of the opposite sign into the stream as it forms, which water, carrying ions, takes up readily. Kelvin used the same effect in his water dropper of 1867.',
      ],
    },
  },
  ice: {
    label: 'The frozen lake',
    title: 'Why ice floats',
    air: 'Air over the lake',
    rows: { air: 'Air', ice: 'Ice', top: 'Water at the top', bottom: 'Water at the bottom', none: 'none' },
    signs: { model: 'water, magnified', more: '9% more room', ice: '{cm} cm of ice' },
    verbs: { later: 'A few weeks later', freeze: 'Freeze the model', melt: 'Melt the model' },
    hints: { thermo: 'Tap the thermometer outside', freeze: 'Tap the model to freeze it', melt: 'Tap the model to melt it', any: 'Tap the thermometer or the model' },
    says: {
      warm: { kid: 'Autumn. The cold air cools the lake from the top, and the cooled water is heavier, so it sinks. The whole lake gets colder.', sci: 'Above 4 °C cooler water is denser: the surface water sinks and the lake mixes from top to bottom.' },
      four: { kid: 'Now the whole lake is about 4 °C. Water is heaviest at 4 °C, so this water fills the bottom.', sci: 'At about 4 °C water reaches its greatest density (0.99997 g/cm³ at 3.98 °C): the whole lake is mixed to it.' },
      cold: { kid: 'Colder than 4 °C, water gets lighter again! So the coldest water stays on top and does not sink.', sci: 'Below 3.98 °C the density falls again: the colder water stays at the surface, over the 4 °C water.' },
      ice: { kid: 'The top freezes. Ice is lighter than water, so it floats and covers the lake like a lid.', sci: 'Ice forms at the surface and floats (0.917 g/cm³), insulating the water below.' },
      deep: { kid: 'The ice grows thicker, but under it the fish stay in the 4 °C water near the bottom, all winter long.', sci: 'Under the ice: 0 °C against the ice, about 4 °C near the bottom. Ice and snow slow the freezing, so a deep lake does not freeze to the bottom.' },
      spring: { kid: 'Spring! The ice melts and the lake warms up again.', sci: 'Spring: the ice melts and the lake mixes again.' },
      freeze: {
        kid: 'Freeze! In ice every molecule holds four neighbours, in rings of six with big empty holes. That takes more room: ice takes about 9% more space than its water, so it is lighter and floats. And rings of six are why snowflakes have six arms!',
        sci: 'Ice Ih: each O hydrogen-bonded to four others in a tetrahedron (O–O 2.76 Å), puckered six-membered rings with open channels along the c axis. 0.917 g/cm³ against 0.9998 for water at 0 °C: 9% more volume. Snow crystals take their six-fold symmetry from this lattice.',
      },
      melt: { kid: 'Melted: the rings break, the molecules crowd closer and fill the holes, and the same water fits in less room.', sci: 'On melting the open network partly collapses and molecules move into its cavities: the density rises to 0.9998 g/cm³.' },
    },
    panel: {
      kid: [
        'Most things get heavier as they get colder, and water does too, but only down to about 4 °C. Colder than that it gets lighter again, and ice is lighter still. So lakes freeze from the top down, and the ice floats on them like a lid.',
        'Slide the air\'s temperature through a winter (or tap the thermometer outside the window) and watch the lake and its fish. Then tap the model by the window to see the molecules inside ice.',
      ],
      sci: [
        'Water\'s density peaks at 3.98 °C. In autumn the cooling surface water sinks until the whole lake is near 4 °C; below that, colder and lighter water stays on top, so ice forms at the surface. It floats because ice Ih (0.917 g/cm³) is about 8% less dense than water: the same mass takes 9% more room.',
        'The ice and its snow insulate the lake: under them the water stays near 0 °C at the top and about 4 °C at the bottom, where many fish spend the winter. If ice sank, lakes would fill with ice from the bottom up.',
      ],
    },
  },
}

const PT = {
  title: 'O balneário junto ao lago',
  greet: {
    kid: 'Bem-vindo ao balneário junto ao lago gelado! Eu sou o oxigénio, e quase toda a água daqui sou eu: quase nove décimos do seu peso. Separa a água da banheira na grande balança, conhece a molécula de água dobrada e descobre porque é que o gelo flutua no lago. A história da imagem está no cavalete.',
    sci: 'Bem-vindo. No H₂O, 16,00 de cada 18,02 g são oxigénio: 88,8% em massa. Três coisas para experimentar: a água da banheira separada e pesada, a molécula angular e polar, e o lago, que gela por cima porque a água é mais densa a cerca de 4 °C. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'Uma só gota de água tem mais de mil milhões de milhões de milhões de moléculas de água, e cada uma tem um átomo de oxigénio no meio.',
      'Nesta sala a água aparece de três maneiras: gelo no lago, líquido na banheira, e a névoa branca por cima da banheira, gotinhas de água que tinha ido para o ar como gás.',
      'Sou pesado para um átomo pequeno: um átomo de oxigénio pesa tanto como dezasseis átomos de hidrogénio. É por isso que a água é quase toda eu.',
    ],
    sci: [
      'H₂O: 2 × 1,008 + 16,00 = 18,02 g/mol. Uma gota de 0,05 mL tem cerca de 1,7 × 10²¹ moléculas.',
      'A água é mais densa a 3,98 °C (0,99997 g/cm³). O gelo a 0 °C tem 0,917 g/cm³, por isso flutua com cerca de 92% dele debaixo de água doce.',
      'A ligação O–H tem 0,96 Å. O oxigénio (eletronegatividade 3,44) e o hidrogénio (2,20) tornam cada ligação polar, e a forma angular soma as duas: um momento dipolar de 1,85 D.',
    ],
  },
  balance: {
    label: 'A grande balança',
    title: 'Separa a água',
    amount: 'Quanta água',
    amounts: { glass: 'Um copo', bucket: 'Um balde', bath: 'A banheira', pool: 'Uma piscina olímpica' },
    plate: '{what}: {litres} de água',
    million: '{n} milhões',
    litre: 'L',
    ml: 'mL',
    signs: { oxygen: 'oxigénio', hydrogen: 'hidrogénio', gas: '{v} em gás', pile: 'pilha de Volta', water: 'água' },
    verbs: { split: 'Separar a água', back: 'Voltar a juntar', on: 'Ligar a pilha', off: 'Desligar a pilha', empty: 'Esvaziar os tubos' },
    hints: { bath: 'Toca na banheira', watch: 'Observa a balança', volt: 'Toca na pilha ao lado da banheira', running: 'Observa as bolhas', back: 'Toca na balança para devolver a água', empty: 'Toca nos tubos de vidro para os esvaziar' },
    rows: { water: 'Água', oxygen: 'Oxigénio nela', hydrogen: 'Hidrogénio nela', o2gas: 'O oxigénio em gás (20 °C)', h2gas: 'O hidrogénio em gás (20 °C)' },
    says: {
      split: {
        kid: 'Zás! A água separa-se em oxigénio e hidrogénio. Olha para a balança: o oxigénio é tão mais pesado que o seu prato desce logo.',
        sci: 'H₂O separado nos seus elementos: 88,8% da massa é oxigénio, 11,2% hidrogénio. O hidrogénio enche dois globos, o oxigénio um (2 H₂ por cada O₂), e mesmo assim o oxigénio pesa oito vezes mais.',
      },
      back: {
        kid: 'Juntos outra vez, e de volta à banheira. Quando o hidrogénio e o oxigénio se juntam a sério, fazem-no com um estrondo e muito calor: é assim que alguns foguetões voam.',
        sci: '2 H₂ + O₂ → 2 H₂O liberta 286 kJ por mole de água líquida, exatamente o que custou separá-la. Hidrogénio e oxigénio líquido moviam os motores principais do vaivém espacial.',
      },
      first: { kid: 'Primeiro toca na banheira para separar a sua água.', sci: 'Ainda não há nada nos pratos: separa primeiro a água (a banheira).' },
      amounts: {
        glass: { kid: 'Um copo de água: 222 gramas de oxigénio e só 28 gramas de hidrogénio.', sci: '0,25 L: 222 g de O e 28 g de H; em gás, 167 L de O₂ e 334 L de H₂.' },
        bucket: { kid: 'Um balde de água: quase 9 quilogramas de oxigénio e cerca de 1 quilograma de hidrogénio.', sci: '10 L: 8,9 kg de O e 1,1 kg de H; em gás, 6,7 m³ de O₂ e 13 m³ de H₂.' },
        bath: { kid: 'A banheira inteira: cerca de 133 quilogramas de oxigénio, mais ou menos o peso de dois adultos, e 17 quilogramas de hidrogénio.', sci: '150 L: 133 kg de O e 17 kg de H; em gás, 100 m³ de O₂ e 200 m³ de H₂ (bolas com 5,8 e 7,3 m de diâmetro).' },
        pool: { kid: 'Uma piscina olímpica inteira: cerca de 2220 toneladas de oxigénio! Pesa tanto como mais de 300 elefantes.', sci: '2500 m³: 2220 t de O e 280 t de H; em gás, 1,7 milhões de m³ de O₂ e 3,3 milhões de m³ de H₂.' },
      },
      on: {
        kid: 'A pilha empurra eletricidade através da água. Bolhas! O hidrogénio sai do fio do lado do menos, o oxigénio do fio do lado do mais.',
        sci: 'Cátodo (−): 4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻. Ânodo (+): 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. Um pouco de ácido sulfúrico ou de sulfato de sódio na água conduz a corrente; a água pura quase não conduz.',
      },
      full: {
        kid: 'Olha para os tubos: o dobro do hidrogénio em relação ao oxigénio! Cada molécula de água tem dois hidrogénios para um só oxigénio.',
        sci: '2 H₂O → 2 H₂ + O₂: dois volumes de hidrogénio para um de oxigénio. Volumes iguais de gás têm o mesmo número de moléculas (Avogadro, 1811).',
      },
      off: { kid: 'Pilha desligada: acabaram-se as bolhas.', sci: 'Circuito aberto: a eletrólise para.' },
      empty: { kid: 'Pssst! As torneiras deixam sair o gás, e os tubos voltam a encher-se de água.', sci: 'Torneiras abertas: os gases escapam e o eletrólito volta a encher os tubos.' },
      emptyFirst: { kid: 'Os tubos estão cheios de gás. Toca primeiro nos tubos de vidro para os esvaziar.', sci: 'Os dois tubos estão cheios: esvazia-os primeiro (os tubos de vidro).' },
    },
    panel: {
      kid: [
        'A água é feita de oxigénio e hidrogénio, e o oxigénio é muito mais pesado: quase nove décimos do peso da água são oxigénio. Toca na banheira e vê a sua água separar-se, o oxigénio para um prato e o hidrogénio para o outro.',
        'Em gás, o hidrogénio ocupa o dobro do espaço do oxigénio (dois globos contra um), mas pesa oito vezes menos. Mexe no seletor para separar um copo, um balde, a banheira ou uma piscina inteira. A pilha ao lado da banheira separa água a sério, um pouco de cada vez.',
      ],
      sci: [
        'Frações mássicas no H₂O: oxigénio 15,999/18,015 = 88,8%, hidrogénio 11,2%. Uma banheira de 150 L (cerca de 150 kg) tem cerca de 133 kg de oxigénio e 17 kg de hidrogénio.',
        'Em gás a 20 °C e 1 atm (24,06 L/mol), as suas 8330 mol de água dão cerca de 200 m³ de H₂ e 100 m³ de O₂: o dobro do volume, um oitavo da massa. Separar tudo custa pelo menos 286 kJ por mole, cerca de 660 kWh. Os globos representam recipientes fechados: ao ar livre, um balão de hidrogénio subiria pelos ares.',
      ],
    },
    historyTitle: 'Os primeiros a separar a água com uma pilha',
    history: {
      kid: [
        'Em 1800, Alessandro Volta construiu a primeira pilha: uma coluna de discos de cobre e de zinco com cartão salgado entre eles. Poucas semanas depois, em Londres, William Nicholson e Anthony Carlisle meteram dois fios de uma pilha dessas em água e viram bolhas de hidrogénio e de oxigénio. Foram os primeiros a separar a água com uma pilha.',
      ],
      sci: [
        "Volta descreveu a sua pilha numa carta de 20 de março de 1800. Antes de ela ser lida na Royal Society, William Nicholson e Anthony Carlisle já tinham construído uma em Londres e separado água com ela; o seu relato saiu no Nicholson's Journal em julho de 1800. Paets van Troostwijk e Deiman já tinham separado água com faíscas de uma máquina de fricção em 1789. O aparelho de vidro de três tubos é o de Hofmann, de 1866.",
      ],
    },
  },
  molecule: {
    label: 'A molécula dobrada',
    title: 'Uma molécula dobrada',
    signs: { scale: 'água, 2 mil milhões de vezes maior', angle: '{a}°', wool: 'lã', salt: 'sal' },
    verbs: { charges: 'Mostrar as cargas', hide: 'Esconder as cargas', balloon: 'Esfregar o balão na lã', back: 'Pôr o balão no lugar', salt: 'Deitar um pouco de sal' },
    hints: { model: 'Toca na molécula grande', balloon: 'Toca no balão', salt: 'Toca no sal', any: 'Toca na molécula, no balão ou no sal', wait: 'Observa' },
    says: {
      charges: {
        kid: 'O oxigénio puxa um bocadinho para si os eletrões que partilha com os hidrogénios. Por isso a ponta do oxigénio fica um nadinha negativa e as pontas dos hidrogénios um nadinha positivas. E a molécula é dobrada, como um bumerangue, a 104,5 graus.',
        sci: 'O O (eletronegatividade 3,44) atrai os eletrões da ligação para longe do H (2,20): uma carga parcial δ− no O e δ+ em cada H. As ligações fazem 104,5°, menos do que os 109,5° do tetraedro porque os dois pares não ligantes do O as aproximam, e por isso os dipolos das ligações somam-se: 1,85 D.',
      },
      hide: { kid: 'Cargas escondidas. Mas continuam lá!', sci: 'Cargas escondidas; o dipolo mantém-se.' },
      rub: { kid: 'Esfrega, esfrega, esfrega! O balão tira bocadinhos de carga elétrica à lã. Agora está carregado.', sci: 'Borracha em lã: passam eletrões para o balão, que fica com carga negativa.' },
      bend: {
        kid: 'O fio de água dobra-se para o balão! O balão carregado puxa o tipo de carga oposto para a água quando ela sai da torneira, e cargas opostas atraem-se.',
        sci: 'O fio dobra-se: o balão negativo induz uma carga positiva na água onde ela sai da torneira, e o fio carregado é atraído. Muitos livros dizem que são os dipolos a rodar, mas um dipolo quase não sente força num campo tão suave; quem o faz é a carga induzida (Ziaei-Moayyed, Goodman e Williams, 2000).',
      },
      back: { kid: 'O balão volta para o seu fio. A carga dele vai-se escapando devagar para o ar.', sci: 'A carga do balão escapa-se, mais depressa com o ar húmido.' },
      salt: {
        kid: 'Cai um grão de sal. Olha: as moléculas de água viram o lado vermelho do oxigénio para o sódio e o lado branco dos hidrogénios para o cloreto, e levam-nos um a um.',
        sci: 'NaCl → Na⁺(aq) + Cl⁻(aq). Cada ião ganha uma camada de hidratação de cerca de seis moléculas de água: o oxigénio virado para dentro à volta do Na⁺, o hidrogénio virado para dentro à volta do Cl⁻. A permitividade da água (εr ≈ 80) enfraquece a atração entre os iões cerca de oitenta vezes.',
      },
      done: {
        kid: 'Desapareceu! O sal continua lá, mas em pedaços pequenos demais para se verem, cada um embrulhado em água.',
        sci: 'Totalmente dissolvido, com os iões hidratados. Um litro de água aceita até cerca de 360 g de sal a 20 °C.',
      },
    },
    panel: {
      kid: [
        'Uma molécula de água é um oxigénio a segurar dois hidrogénios, e é dobrada. O oxigénio puxa para si os eletrões partilhados, por isso a molécula tem uma ponta um pouco negativa (o oxigénio) e duas pontas um pouco positivas (os hidrogénios). Aqui estão desenhadas cerca de dois mil milhões de vezes maiores: anda no meio delas.',
        'Essas pontas com carga tornam a água boa a separar coisas: toca no sal e vê. E a água deixa a carga elétrica mover-se através dela, por isso um balão carregado consegue puxar o seu fio para o lado.',
      ],
      sci: [
        'O H₂O é angular (104,5°) e polar: a maior eletronegatividade do oxigénio dá-lhe uma carga parcial negativa e a cada hidrogénio uma positiva; momento dipolar 1,85 D. A sua elevada permitividade (εr ≈ 80 a 20 °C) e as suas ligações de hidrogénio fazem dela um solvente excelente para iões.',
        'O fio de água que se dobra é uma demonstração clássica, mas a causa é a carga, não os dipolos a rodar: o balão carregado puxa carga de sinal oposto para o fio quando ele se forma, e a água, que tem iões, aceita-a facilmente. Kelvin usou o mesmo efeito no seu gerador de gotas de água de 1867.',
      ],
    },
  },
  ice: {
    label: 'O lago gelado',
    title: 'Porque é que o gelo flutua',
    air: 'Ar sobre o lago',
    rows: { air: 'Ar', ice: 'Gelo', top: 'Água em cima', bottom: 'Água no fundo', none: 'nenhum' },
    signs: { model: 'água, ampliada', more: '9% mais espaço', ice: '{cm} cm de gelo' },
    verbs: { later: 'Umas semanas depois', freeze: 'Congelar o modelo', melt: 'Derreter o modelo' },
    hints: { thermo: 'Toca no termómetro lá fora', freeze: 'Toca no modelo para o congelar', melt: 'Toca no modelo para o derreter', any: 'Toca no termómetro ou no modelo' },
    says: {
      warm: { kid: 'Outono. O ar frio arrefece o lago por cima, e a água arrefecida fica mais pesada, por isso afunda. O lago inteiro vai ficando mais frio.', sci: 'Acima de 4 °C a água mais fria é mais densa: a água da superfície afunda e o lago mistura-se de cima a baixo.' },
      four: { kid: 'Agora o lago inteiro está a cerca de 4 °C. A água é mais pesada a 4 °C, por isso esta água enche o fundo.', sci: 'A cerca de 4 °C a água atinge a sua maior densidade (0,99997 g/cm³ a 3,98 °C): o lago inteiro mistura-se até lá.' },
      cold: { kid: 'Abaixo de 4 °C, a água volta a ficar mais leve! Por isso a água mais fria fica em cima e não afunda.', sci: 'Abaixo de 3,98 °C a densidade volta a descer: a água mais fria fica à superfície, por cima da água a 4 °C.' },
      ice: { kid: 'A parte de cima gela. O gelo é mais leve do que a água, por isso flutua e tapa o lago como uma tampa.', sci: 'O gelo forma-se à superfície e flutua (0,917 g/cm³), isolando a água de baixo.' },
      deep: { kid: 'O gelo fica mais grosso, mas por baixo dele os peixes ficam na água a 4 °C perto do fundo, o inverno inteiro.', sci: 'Debaixo do gelo: 0 °C junto ao gelo, cerca de 4 °C perto do fundo. O gelo e a neve abrandam o congelamento, por isso um lago fundo não gela até ao fundo.' },
      spring: { kid: 'Primavera! O gelo derrete e o lago volta a aquecer.', sci: 'Primavera: o gelo derrete e o lago volta a misturar-se.' },
      freeze: {
        kid: 'Congela! No gelo cada molécula segura quatro vizinhas, em anéis de seis com grandes buracos vazios. Isso ocupa mais espaço: o gelo ocupa cerca de 9% mais do que a sua água, por isso é mais leve e flutua. E os anéis de seis são a razão de os flocos de neve terem seis braços!',
        sci: 'Gelo Ih: cada O ligado por pontes de hidrogénio a quatro outros num tetraedro (O–O 2,76 Å), anéis de seis enrugados com canais abertos ao longo do eixo c. 0,917 g/cm³ contra 0,9998 da água a 0 °C: 9% mais volume. Os cristais de neve tiram desta rede a sua simetria de seis.',
      },
      melt: { kid: 'Derreteu: os anéis partem-se, as moléculas apertam-se e enchem os buracos, e a mesma água cabe em menos espaço.', sci: 'Ao fundir, a rede aberta desaba em parte e as moléculas entram nas suas cavidades: a densidade sobe para 0,9998 g/cm³.' },
    },
    panel: {
      kid: [
        'A maior parte das coisas fica mais pesada quando arrefece, e a água também, mas só até cerca de 4 °C. Mais fria do que isso volta a ficar mais leve, e o gelo é mais leve ainda. Por isso os lagos gelam de cima para baixo, e o gelo flutua neles como uma tampa.',
        'Mexe na temperatura do ar ao longo de um inverno (ou toca no termómetro do lado de fora da janela) e observa o lago e os seus peixes. Depois toca no modelo junto à janela para veres as moléculas dentro do gelo.',
      ],
      sci: [
        'A densidade da água é máxima a 3,98 °C. No outono a água da superfície, ao arrefecer, afunda até o lago inteiro estar perto de 4 °C; abaixo disso, a água mais fria e mais leve fica em cima, e o gelo forma-se à superfície. Flutua porque o gelo Ih (0,917 g/cm³) é cerca de 8% menos denso do que a água: a mesma massa ocupa mais 9% de espaço.',
        'O gelo e a sua neve isolam o lago: por baixo deles a água fica perto de 0 °C em cima e a cerca de 4 °C no fundo, onde muitos peixes passam o inverno. Se o gelo afundasse, os lagos encher-se-iam de gelo de baixo para cima.',
      ],
    },
  },
}

const PL = {
  title: 'Łaźnia nad jeziorem',
  greet: {
    kid: 'Cześć! Jestem Tlen. Witaj w łaźni nad zamarzniętym jeziorem! Prawie cała woda tutaj to ja: prawie dziewięć dziesiątych jej wagi. Rozłóż wodę z wanny na wielkiej wadze, poznaj wygiętą cząsteczkę wody i sprawdź, dlaczego lód pływa po jeziorze. Historia obrazka jest na sztaludze.',
    sci: 'Cześć! Jestem Tlen. W H₂O 16,00 z każdych 18,02 g to tlen: 88,8% masy. Trzy rzeczy do wypróbowania: woda z wanny rozłożona i zważona, wygięta i polarna cząsteczka oraz jezioro, które zamarza od góry, bo woda ma największą gęstość w około 4 °C. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Jedna kropla wody zawiera ponad tysiąc trylionów cząsteczek wody, a każda ma w środku atom tlenu.',
      'W tej sali woda występuje na trzy sposoby: lód na jeziorze, ciecz w wannie i biała mgiełka nad wanną, czyli malutkie kropelki wody, która uleciała w powietrze jako gaz.',
      'Jak na mały atom jestem ciężki: jeden atom tlenu waży tyle, co szesnaście atomów wodoru. Dlatego woda to głównie ja.',
    ],
    sci: [
      'H₂O: 2 × 1,008 + 16,00 = 18,02 g/mol. Kropla o objętości 0,05 ml zawiera około 1,7 × 10²¹ cząsteczek.',
      'Woda ma największą gęstość w 3,98 °C (0,99997 g/cm³). Lód w 0 °C ma 0,917 g/cm³, więc pływa, mając około 92% objętości pod powierzchnią słodkiej wody.',
      'Wiązanie O–H ma długość 0,96 Å. Tlen (elektroujemność 3,44) i wodór (2,20) sprawiają, że każde wiązanie jest polarne, a kątowy kształt sumuje oba: moment dipolowy 1,85 D.',
    ],
  },
  balance: {
    label: 'Wielka waga',
    title: 'Rozłóż wodę',
    amount: 'Ile wody',
    amounts: { glass: 'Szklanka', bucket: 'Wiadro', bath: 'Wanna', pool: 'Basen olimpijski' },
    plate: '{what}: {litres} wody',
    million: '{n} mln',
    litre: 'l',
    ml: 'ml',
    signs: { oxygen: 'tlen', hydrogen: 'wodór', gas: '{v} jako gaz', pile: 'stos Volty', water: 'woda' },
    verbs: { split: 'Rozłóż wodę', back: 'Złóż ją z powrotem', on: 'Podłącz baterię', off: 'Odłącz baterię', empty: 'Opróżnij rurki' },
    hints: { bath: 'Dotknij wanny', watch: 'Patrz na wagę', volt: 'Dotknij baterii przy wannie', running: 'Patrz na bąbelki', back: 'Dotknij wagi, żeby oddać wodę', empty: 'Dotknij szklanych rurek, żeby je opróżnić' },
    rows: { water: 'Woda', oxygen: 'Tlen w niej', hydrogen: 'Wodór w niej', o2gas: 'Tlen jako gaz (20 °C)', h2gas: 'Wodór jako gaz (20 °C)' },
    says: {
      split: {
        kid: 'Wiuuu! Woda rozpada się na tlen i wodór. Spójrz na wagę: tlen jest o tyle cięższy, że jego szalka opada aż na dół.',
        sci: 'H₂O rozłożona na pierwiastki: 88,8% masy to tlen, 11,2% wodór. Wodór wypełnia dwie kule, tlen jedną (2 H₂ na każdą O₂), a mimo to tlen waży osiem razy więcej.',
      },
      back: {
        kid: 'Znowu razem i z powrotem w wannie. Kiedy wodór i tlen naprawdę się łączą, robią to z hukiem i z mnóstwem ciepła: tak latają niektóre rakiety.',
        sci: '2 H₂ + O₂ → 2 H₂O uwalnia 286 kJ na mol ciekłej wody, dokładnie tyle, ile kosztował rozkład. Wodór i ciekły tlen napędzały główne silniki promu kosmicznego.',
      },
      first: { kid: 'Najpierw dotknij wanny, żeby rozłożyć jej wodę.', sci: 'Na szalkach jeszcze nic nie ma: najpierw rozłóż wodę (wanna).' },
      amounts: {
        glass: { kid: 'Szklanka wody: 222 gramy tlenu i tylko 28 gramów wodoru.', sci: '0,25 l: 222 g O i 28 g H; jako gazy 167 l O₂ i 334 l H₂.' },
        bucket: { kid: 'Wiadro wody: prawie 9 kilogramów tlenu i około 1 kilograma wodoru.', sci: '10 l: 8,9 kg O i 1,1 kg H; jako gazy 6,7 m³ O₂ i 13 m³ H₂.' },
        bath: { kid: 'Cała wanna: około 133 kilogramów tlenu, mniej więcej tyle, ile waży dwoje dorosłych, i 17 kilogramów wodoru.', sci: '150 l: 133 kg O i 17 kg H; jako gazy 100 m³ O₂ i 200 m³ H₂ (kule o średnicy 5,8 i 7,3 m).' },
        pool: { kid: 'Cały basen olimpijski: około 2220 ton tlenu! To tyle, ile waży ponad 300 słoni.', sci: '2500 m³: 2220 t O i 280 t H; jako gazy 1,7 mln m³ O₂ i 3,3 mln m³ H₂.' },
      },
      on: {
        kid: 'Bateria przepycha prąd przez wodę. Bąbelki! Wodór wydziela się na drucie po stronie minusa, tlen na drucie po stronie plusa.',
        sci: 'Katoda (−): 4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻. Anoda (+): 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. Odrobina kwasu siarkowego albo siarczanu sodu w wodzie przewodzi prąd; czysta woda prawie nie przewodzi.',
      },
      full: {
        kid: 'Spójrz na rurki: wodoru jest dwa razy więcej niż tlenu! Każda cząsteczka wody ma dwa wodory na jeden tlen.',
        sci: '2 H₂O → 2 H₂ + O₂: dwie objętości wodoru na jedną tlenu. Równe objętości gazu zawierają tyle samo cząsteczek (Avogadro, 1811).',
      },
      off: { kid: 'Bateria odłączona: koniec bąbelków.', sci: 'Obwód otwarty: elektroliza się zatrzymuje.' },
      empty: { kid: 'Pssst! Kraniki wypuszczają gaz, a rurki znowu napełniają się wodą.', sci: 'Kraniki otwarte: gazy uchodzą, a elektrolit znowu wypełnia rurki.' },
      emptyFirst: { kid: 'Rurki są pełne gazu. Najpierw dotknij szklanych rurek, żeby je opróżnić.', sci: 'Obie rurki są pełne: najpierw je opróżnij (szklane rurki).' },
    },
    panel: {
      kid: [
        'Woda składa się z tlenu i wodoru, a tlen jest dużo cięższy: prawie dziewięć dziesiątych wagi wody to tlen. Dotknij wanny i patrz, jak jej woda się rozkłada: tlen na jedną szalkę, wodór na drugą.',
        'Jako gaz wodór zajmuje dwa razy więcej miejsca niż tlen (dwie kule przeciw jednej), ale waży osiem razy mniej. Przesuń suwak, żeby rozłożyć szklankę, wiadro, wannę albo cały basen. Bateria przy wannie rozkłada wodę naprawdę, po trochu.',
      ],
      sci: [
        'Udziały masowe w H₂O: tlen 15,999/18,015 = 88,8%, wodór 11,2%. Wanna o pojemności 150 l (około 150 kg) zawiera około 133 kg tlenu i 17 kg wodoru.',
        'Jako gazy w 20 °C i pod ciśnieniem 1 atm (24,06 l/mol) jej 8330 mol wody daje około 200 m³ H₂ i 100 m³ O₂: dwa razy większą objętość i jedną ósmą masy. Rozłożenie całości wymaga co najmniej 286 kJ na mol, czyli około 660 kWh. Kule oznaczają zamknięte naczynia: na wolnym powietrzu balon z wodorem by odleciał.',
      ],
    },
    historyTitle: 'Pierwsi, którzy rozłożyli wodę baterią',
    history: {
      kid: [
        'W 1800 roku Alessandro Volta zbudował pierwszą baterię: stos krążków z miedzi i cynku przełożonych słonym kartonem. Zaledwie kilka tygodni później w Londynie William Nicholson i Anthony Carlisle włożyli do wody dwa druty od takiego stosu i zobaczyli bąbelki wodoru i tlenu. Byli pierwszymi, którzy rozłożyli wodę baterią.',
      ],
      sci: [
        "Volta opisał swój stos w liście z 20 marca 1800 roku. Zanim list odczytano w Royal Society, William Nicholson i Anthony Carlisle zbudowali taki stos w Londynie i rozłożyli nim wodę; ich relacja ukazała się w Nicholson's Journal w lipcu 1800 roku. Paets van Troostwijk i Deiman rozłożyli wodę już w 1789 roku iskrami z maszyny elektrostatycznej. Szklany aparat z trzema rurkami to aparat Hofmanna z 1866 roku.",
      ],
    },
  },
  molecule: {
    label: 'Wygięta cząsteczka',
    title: 'Wygięta cząsteczka',
    signs: { scale: 'woda, 2 miliardy razy większa', angle: '{a}°', wool: 'wełna', salt: 'sól' },
    verbs: { charges: 'Pokaż ładunki', hide: 'Ukryj ładunki', balloon: 'Potrzyj balon o wełnę', back: 'Odłóż balon', salt: 'Wsyp trochę soli' },
    hints: { model: 'Dotknij dużej cząsteczki', balloon: 'Dotknij balonu', salt: 'Dotknij soli', any: 'Dotknij cząsteczki, balonu albo soli', wait: 'Patrz' },
    says: {
      charges: {
        kid: 'Tlen przyciąga elektrony, które dzieli z wodorami, trochę bliżej siebie. Dlatego koniec z tlenem jest odrobinę ujemny, a końce z wodorami odrobinę dodatnie. A cząsteczka jest wygięta jak bumerang, pod kątem 104,5 stopnia.',
        sci: 'O (elektroujemność 3,44) odciąga elektrony wiązania od H (2,20): cząstkowy ładunek δ− na O i δ+ na każdym H. Wiązania tworzą kąt 104,5°, mniejszy niż tetraedryczny 109,5°, bo dwie wolne pary elektronowe O je ściskają, więc dipole wiązań się sumują: 1,85 D.',
      },
      hide: { kid: 'Ładunki ukryte. Ale one zawsze tam są!', sci: 'Ładunki ukryte; dipol zostaje.' },
      rub: { kid: 'Trzyj, trzyj, trzyj! Balon zabiera wełnie malutkie kawałki ładunku elektrycznego. Teraz jest naładowany.', sci: 'Guma o wełnę: elektrony przechodzą na balon, który ładuje się ujemnie.' },
      bend: {
        kid: 'Strumień wygina się w stronę balonu! Naładowany balon przyciąga do wody ładunek przeciwnego rodzaju, kiedy wypływa ona z kranu, a przeciwne ładunki się przyciągają.',
        sci: 'Strumień się wygina: ujemny balon indukuje dodatni ładunek w wodzie tam, gdzie wypływa z kranu, a naładowany strumień jest przyciągany. Wiele książek przypisuje to obracaniu się dipoli, ale w tak łagodnym polu dipol prawie nie czuje siły; robi to ładunek indukowany (Ziaei-Moayyed, Goodman i Williams, 2000).',
      },
      back: { kid: 'Balon wraca na swój sznurek. Jego ładunek powoli ucieka do powietrza.', sci: 'Ładunek balonu uchodzi, szybciej w wilgotnym powietrzu.' },
      salt: {
        kid: 'Wpada ziarenko soli. Patrz: cząsteczki wody obracają czerwone, tlenowe strony do sodu, a białe, wodorowe strony do chlorku, i odciągają je po kolei.',
        sci: 'NaCl → Na⁺(aq) + Cl⁻(aq). Każdy jon dostaje otoczkę hydratacyjną z około sześciu cząsteczek wody: tlenem do środka wokół Na⁺, wodorem do środka wokół Cl⁻. Przenikalność elektryczna wody (εr ≈ 80) osłabia przyciąganie jonów około osiemdziesiąt razy.',
      },
      done: {
        kid: 'Zniknęła! Sól nadal tam jest, ale w kawałkach o wiele za małych, żeby je zobaczyć, a każdy jest otulony wodą.',
        sci: 'Całkowicie rozpuszczona, jony uwodnione. Litr wody przyjmuje do około 360 g soli w 20 °C.',
      },
    },
    panel: {
      kid: [
        'Cząsteczka wody to jeden tlen, który trzyma dwa wodory, i jest ona wygięta. Tlen przyciąga wspólne elektrony do siebie, więc cząsteczka ma jeden lekko ujemny koniec (tlen) i dwa lekko dodatnie (wodory). Tutaj są narysowane mniej więcej dwa miliardy razy większe: przejdź się między nimi.',
        'Te naładowane końce sprawiają, że woda świetnie rozdziela różne rzeczy: dotknij soli i patrz. A woda pozwala ładunkom elektrycznym poruszać się przez siebie, więc naładowany balon potrafi przyciągnąć jej strumień w bok.',
      ],
      sci: [
        'H₂O jest wygięta (104,5°) i polarna: większa elektroujemność tlenu daje mu cząstkowy ładunek ujemny, a każdemu wodorowi dodatni; moment dipolowy 1,85 D. Wysoka przenikalność elektryczna (εr ≈ 80 w 20 °C) i wiązania wodorowe czynią ją znakomitym rozpuszczalnikiem jonów.',
        'Wyginający się strumień to klasyczny pokaz, ale jego przyczyną jest ładunek, a nie obracające się dipole: naładowany balon wciąga ładunek przeciwnego znaku do formującego się strumienia, a woda, która zawiera jony, łatwo go przyjmuje. Kelvin wykorzystał ten sam efekt w swoim kroplowym generatorze z 1867 roku.',
      ],
    },
  },
  ice: {
    label: 'Zamarznięte jezioro',
    title: 'Dlaczego lód pływa',
    air: 'Powietrze nad jeziorem',
    rows: { air: 'Powietrze', ice: 'Lód', top: 'Woda na górze', bottom: 'Woda przy dnie', none: 'brak' },
    signs: { model: 'woda, powiększona', more: '9% więcej miejsca', ice: '{cm} cm lodu' },
    verbs: { later: 'Kilka tygodni później', freeze: 'Zamroź model', melt: 'Roztop model' },
    hints: { thermo: 'Dotknij termometru za oknem', freeze: 'Dotknij modelu, żeby go zamrozić', melt: 'Dotknij modelu, żeby go roztopić', any: 'Dotknij termometru albo modelu' },
    says: {
      warm: { kid: 'Jesień. Zimne powietrze chłodzi jezioro od góry, a schłodzona woda jest cięższa, więc opada. Całe jezioro robi się coraz zimniejsze.', sci: 'Powyżej 4 °C chłodniejsza woda jest gęstsza: woda z powierzchni opada i jezioro miesza się od góry do dołu.' },
      four: { kid: 'Teraz całe jezioro ma około 4 °C. Woda jest najcięższa w 4 °C, więc ta woda wypełnia dno.', sci: 'W około 4 °C woda osiąga największą gęstość (0,99997 g/cm³ w 3,98 °C): całe jezioro miesza się do tej temperatury.' },
      cold: { kid: 'Poniżej 4 °C woda znowu robi się lżejsza! Dlatego najzimniejsza woda zostaje na górze i nie opada.', sci: 'Poniżej 3,98 °C gęstość znowu spada: zimniejsza woda zostaje przy powierzchni, nad wodą o temperaturze 4 °C.' },
      ice: { kid: 'Góra zamarza. Lód jest lżejszy od wody, więc pływa i przykrywa jezioro jak pokrywka.', sci: 'Lód tworzy się na powierzchni i pływa (0,917 g/cm³), izolując wodę pod spodem.' },
      deep: { kid: 'Lód grubieje, ale pod nim ryby zostają w wodzie o temperaturze 4 °C przy dnie, przez całą zimę.', sci: 'Pod lodem: 0 °C przy lodzie, około 4 °C przy dnie. Lód i śnieg spowalniają zamarzanie, więc głębokie jezioro nie zamarza do dna.' },
      spring: { kid: 'Wiosna! Lód się topi, a jezioro znowu się ogrzewa.', sci: 'Wiosna: lód się topi, a jezioro znowu się miesza.' },
      freeze: {
        kid: 'Zamarza! W lodzie każda cząsteczka trzyma czterech sąsiadów, w pierścieniach po sześć z dużymi pustymi dziurami. To zajmuje więcej miejsca: lód zajmuje około 9% więcej niż jego woda, więc jest lżejszy i pływa. A pierścienie po sześć to powód, dla którego płatki śniegu mają sześć ramion!',
        sci: 'Lód Ih: każdy O połączony wiązaniami wodorowymi z czterema innymi w tetraedrze (O–O 2,76 Å), pofałdowane pierścienie sześcioczłonowe z otwartymi kanałami wzdłuż osi c. 0,917 g/cm³ wobec 0,9998 dla wody w 0 °C: o 9% większa objętość. Kryształy śniegu biorą swoją sześciokrotną symetrię z tej sieci.',
      },
      melt: { kid: 'Roztopiony: pierścienie się rozpadają, cząsteczki ściskają się i wypełniają dziury, a ta sama woda mieści się w mniejszej przestrzeni.', sci: 'Przy topnieniu otwarta sieć częściowo się zapada, a cząsteczki wchodzą w jej wnęki: gęstość rośnie do 0,9998 g/cm³.' },
    },
    panel: {
      kid: [
        'Większość rzeczy robi się cięższa, kiedy stygnie, i woda też, ale tylko do około 4 °C. Zimniejsza znowu robi się lżejsza, a lód jest jeszcze lżejszy. Dlatego jeziora zamarzają od góry, a lód pływa po nich jak pokrywka.',
        'Przesuwaj temperaturę powietrza przez całą zimę (albo dotknij termometru za oknem) i patrz na jezioro i jego ryby. Potem dotknij modelu przy oknie, żeby zobaczyć cząsteczki w lodzie.',
      ],
      sci: [
        'Gęstość wody jest największa w 3,98 °C. Jesienią stygnąca woda powierzchniowa opada, aż całe jezioro ma blisko 4 °C; poniżej tej temperatury zimniejsza i lżejsza woda zostaje na górze, więc lód tworzy się na powierzchni. Pływa, bo lód Ih (0,917 g/cm³) ma o około 8% mniejszą gęstość niż woda: ta sama masa zajmuje o 9% więcej miejsca.',
        'Lód i jego śnieg izolują jezioro: pod nimi woda ma blisko 0 °C na górze i około 4 °C przy dnie, gdzie wiele ryb spędza zimę. Gdyby lód tonął, jeziora wypełniałyby się lodem od dna.',
      ],
    },
  },
}

const DE = {
  title: 'Das Badehaus am See',
  greet: {
    kid: 'Hallo! Ich bin der Sauerstoff. Willkommen im Badehaus am zugefrorenen See! Fast alles Wasser hier bin ich: fast neun Zehntel seines Gewichts. Nimm das Badewasser auf der großen Waage auseinander, lerne das gewinkelte Wassermolekül kennen und finde heraus, warum das Eis auf dem See schwimmt. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Hallo! Ich bin der Sauerstoff. In H₂O sind 16,00 von je 18,02 g Sauerstoff: 88,8% der Masse. Drei Dinge zum Ausprobieren: das Badewasser zerlegt und gewogen, das gewinkelte, polare Molekül und der See, der von oben zufriert, weil Wasser bei etwa 4 °C am dichtesten ist. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Ein einziger Tropfen Wasser enthält mehr als tausend Trillionen Wassermoleküle, und jedes hat ein Sauerstoffatom in der Mitte.',
      'In diesem Raum gibt es Wasser auf drei Arten: Eis auf dem See, flüssig in der Wanne und den weißen Dunst über der Wanne, winzige Tröpfchen aus Wasser, das als Gas in die Luft gegangen war.',
      'Für ein kleines Atom bin ich schwer: Ein Sauerstoffatom wiegt so viel wie sechzehn Wasserstoffatome. Darum ist Wasser größtenteils ich.',
    ],
    sci: [
      'H₂O: 2 × 1,008 + 16,00 = 18,02 g/mol. Ein Tropfen von 0,05 ml enthält etwa 1,7 × 10²¹ Moleküle.',
      'Wasser ist bei 3,98 °C am dichtesten (0,99997 g/cm³). Eis hat bei 0 °C 0,917 g/cm³ und schwimmt deshalb mit etwa 92% unter der Oberfläche von Süßwasser.',
      'Die O–H-Bindung ist 0,96 Å lang. Sauerstoff (Elektronegativität 3,44) und Wasserstoff (2,20) machen jede Bindung polar, und die gewinkelte Form addiert beide: ein Dipolmoment von 1,85 D.',
    ],
  },
  balance: {
    label: 'Die große Waage',
    title: 'Nimm das Wasser auseinander',
    amount: 'Wie viel Wasser',
    amounts: { glass: 'Ein Glas', bucket: 'Ein Eimer', bath: 'Die Badewanne', pool: 'Ein olympisches Becken' },
    plate: '{what}: {litres} Wasser',
    million: '{n} Mio.',
    litre: 'l',
    ml: 'ml',
    signs: { oxygen: 'Sauerstoff', hydrogen: 'Wasserstoff', gas: '{v} als Gas', pile: 'Voltasche Säule', water: 'Wasser' },
    verbs: { split: 'Wasser zerlegen', back: 'Wieder zusammensetzen', on: 'Batterie anschließen', off: 'Batterie abklemmen', empty: 'Röhren leeren' },
    hints: { bath: 'Tipp die Badewanne an', watch: 'Schau auf die Waage', volt: 'Tipp die Batterie neben der Wanne an', running: 'Schau auf die Bläschen', back: 'Tipp die Waage an, um das Wasser zurückzugeben', empty: 'Tipp die Glasröhren an, um sie zu leeren' },
    rows: { water: 'Wasser', oxygen: 'Sauerstoff darin', hydrogen: 'Wasserstoff darin', o2gas: 'Der Sauerstoff als Gas (20 °C)', h2gas: 'Der Wasserstoff als Gas (20 °C)' },
    says: {
      split: {
        kid: 'Wusch! Das Wasser zerfällt in Sauerstoff und Wasserstoff. Schau auf die Waage: Der Sauerstoff ist so viel schwerer, dass seine Schale ganz nach unten sinkt.',
        sci: 'H₂O in seine Elemente zerlegt: 88,8% der Masse ist Sauerstoff, 11,2% Wasserstoff. Der Wasserstoff füllt zwei Kugeln, der Sauerstoff eine (2 H₂ auf jedes O₂), und trotzdem wiegt der Sauerstoff achtmal so viel.',
      },
      back: {
        kid: 'Wieder zusammen und zurück in die Wanne. Wenn Wasserstoff und Sauerstoff sich wirklich verbinden, tun sie es mit einem Knall und viel Wärme: So fliegen manche Raketen.',
        sci: '2 H₂ + O₂ → 2 H₂O setzt 286 kJ pro Mol flüssiges Wasser frei, genau so viel, wie die Zerlegung gekostet hat. Wasserstoff und flüssiger Sauerstoff trieben die Haupttriebwerke des Space Shuttle an.',
      },
      first: { kid: 'Tipp zuerst die Badewanne an, um ihr Wasser zu zerlegen.', sci: 'Noch nichts auf den Schalen: zuerst das Wasser zerlegen (die Badewanne).' },
      amounts: {
        glass: { kid: 'Ein Glas Wasser: 222 Gramm Sauerstoff und nur 28 Gramm Wasserstoff.', sci: '0,25 l: 222 g O und 28 g H; als Gase 167 l O₂ und 334 l H₂.' },
        bucket: { kid: 'Ein Eimer Wasser: fast 9 Kilogramm Sauerstoff und etwa 1 Kilogramm Wasserstoff.', sci: '10 l: 8,9 kg O und 1,1 kg H; als Gase 6,7 m³ O₂ und 13 m³ H₂.' },
        bath: { kid: 'Die ganze Badewanne: etwa 133 Kilogramm Sauerstoff, ungefähr so schwer wie zwei Erwachsene, und 17 Kilogramm Wasserstoff.', sci: '150 l: 133 kg O und 17 kg H; als Gase 100 m³ O₂ und 200 m³ H₂ (Kugeln von 5,8 und 7,3 m Durchmesser).' },
        pool: { kid: 'Ein ganzes olympisches Schwimmbecken: etwa 2220 Tonnen Sauerstoff! So schwer wie mehr als 300 Elefanten.', sci: '2500 m³: 2220 t O und 280 t H; als Gase 1,7 Mio. m³ O₂ und 3,3 Mio. m³ H₂.' },
      },
      on: {
        kid: 'Die Batterie drückt Strom durch das Wasser. Bläschen! Wasserstoff kommt am Draht auf der Minusseite heraus, Sauerstoff am Draht auf der Plusseite.',
        sci: 'Kathode (−): 4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻. Anode (+): 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. Etwas Schwefelsäure oder Natriumsulfat im Wasser leitet den Strom; reines Wasser leitet kaum.',
      },
      full: {
        kid: 'Schau auf die Röhren: doppelt so viel Wasserstoff wie Sauerstoff! Jedes Wassermolekül hat zwei Wasserstoffe auf einen Sauerstoff.',
        sci: '2 H₂O → 2 H₂ + O₂: zwei Volumen Wasserstoff auf eines Sauerstoff. Gleiche Gasvolumen enthalten gleich viele Moleküle (Avogadro, 1811).',
      },
      off: { kid: 'Batterie aus: keine Bläschen mehr.', sci: 'Stromkreis offen: Die Elektrolyse hört auf.' },
      empty: { kid: 'Pssst! Die Hähne lassen das Gas hinaus, und die Röhren füllen sich wieder mit Wasser.', sci: 'Hähne geöffnet: Die Gase entweichen, und der Elektrolyt füllt die Röhren wieder.' },
      emptyFirst: { kid: 'Die Röhren sind voller Gas. Tipp zuerst die Glasröhren an, um sie zu leeren.', sci: 'Beide Röhren sind voll: zuerst leeren (die Glasröhren).' },
    },
    panel: {
      kid: [
        'Wasser besteht aus Sauerstoff und Wasserstoff, und Sauerstoff ist viel schwerer: Fast neun Zehntel des Gewichts von Wasser sind Sauerstoff. Tipp die Badewanne an und schau, wie ihr Wasser auseinandergeht, der Sauerstoff auf die eine Schale, der Wasserstoff auf die andere.',
        'Als Gas braucht der Wasserstoff doppelt so viel Platz wie der Sauerstoff (zwei Kugeln gegen eine), aber er wiegt achtmal weniger. Schieb den Regler, um ein Glas, einen Eimer, die Badewanne oder ein ganzes Schwimmbecken zu zerlegen. Die Batterie neben der Wanne zerlegt Wasser wirklich, immer ein bisschen.',
      ],
      sci: [
        'Massenanteile in H₂O: Sauerstoff 15,999/18,015 = 88,8%, Wasserstoff 11,2%. Eine Wanne mit 150 l (etwa 150 kg) enthält etwa 133 kg Sauerstoff und 17 kg Wasserstoff.',
        'Als Gase bei 20 °C und 1 atm (24,06 l/mol) ergeben ihre 8330 mol Wasser etwa 200 m³ H₂ und 100 m³ O₂: das doppelte Volumen, ein Achtel der Masse. Alles zu zerlegen braucht mindestens 286 kJ pro Mol, etwa 660 kWh. Die Kugeln stehen für geschlossene Gefäße: An der freien Luft würde ein Wasserstoffballon davonfliegen.',
      ],
    },
    historyTitle: 'Die Ersten, die Wasser mit einer Batterie zerlegten',
    history: {
      kid: [
        'Im Jahr 1800 baute Alessandro Volta die erste Batterie: einen Stapel aus Kupfer- und Zinkscheiben mit salziger Pappe dazwischen. Nur wenige Wochen später steckten William Nicholson und Anthony Carlisle in London zwei Drähte von so einer Säule in Wasser und sahen Bläschen aus Wasserstoff und Sauerstoff. Sie waren die Ersten, die Wasser mit einer Batterie zerlegten.',
      ],
      sci: [
        "Volta beschrieb seine Säule in einem Brief vom 20. März 1800. Noch bevor er in der Royal Society verlesen wurde, hatten William Nicholson und Anthony Carlisle in London eine gebaut und damit Wasser zerlegt; ihr Bericht erschien im Juli 1800 in Nicholson's Journal. Paets van Troostwijk und Deiman hatten Wasser schon 1789 mit Funken einer Reibungselektrisiermaschine zerlegt. Der gläserne Apparat mit drei Röhren ist der von Hofmann aus dem Jahr 1866.",
      ],
    },
  },
  molecule: {
    label: 'Das gewinkelte Molekül',
    title: 'Ein gewinkeltes Molekül',
    signs: { scale: 'Wasser, 2 Milliarden Mal größer', angle: '{a}°', wool: 'Wolle', salt: 'Salz' },
    verbs: { charges: 'Ladungen zeigen', hide: 'Ladungen verbergen', balloon: 'Den Ballon an der Wolle reiben', back: 'Den Ballon zurückbringen', salt: 'Etwas Salz hineingeben' },
    hints: { model: 'Tipp das große Molekül an', balloon: 'Tipp den Ballon an', salt: 'Tipp das Salz an', any: 'Tipp das Molekül, den Ballon oder das Salz an', wait: 'Schau zu' },
    says: {
      charges: {
        kid: 'Der Sauerstoff zieht die Elektronen, die er mit den Wasserstoffen teilt, ein bisschen näher zu sich. Darum ist das Sauerstoff-Ende ein winziges bisschen negativ und die Wasserstoff-Enden ein winziges bisschen positiv. Und das Molekül ist gewinkelt, wie ein Bumerang, mit 104,5 Grad.',
        sci: 'O (Elektronegativität 3,44) zieht die Bindungselektronen vom H (2,20) weg: eine Partialladung δ− am O und δ+ an jedem H. Die Bindungen schließen 104,5° ein, weniger als die tetraedrischen 109,5°, weil die zwei freien Elektronenpaare des O sie zusammendrücken, und so addieren sich die Bindungsdipole: 1,85 D.',
      },
      hide: { kid: 'Ladungen versteckt. Sie sind aber immer da!', sci: 'Ladungen verborgen; der Dipol bleibt.' },
      rub: { kid: 'Reiben, reiben, reiben! Der Ballon nimmt der Wolle winzige Stückchen elektrischer Ladung weg. Jetzt ist er geladen.', sci: 'Gummi an Wolle: Elektronen gehen auf den Ballon über, der sich negativ auflädt.' },
      bend: {
        kid: 'Der Wasserstrahl biegt sich zum Ballon hin! Der geladene Ballon zieht die entgegengesetzte Ladung ins Wasser, wenn es aus dem Hahn kommt, und entgegengesetzte Ladungen ziehen sich an.',
        sci: 'Der Strahl biegt sich: Der negative Ballon influenziert eine positive Ladung im Wasser dort, wo es den Hahn verlässt, und der geladene Strahl wird angezogen. Viele Bücher schreiben es den sich drehenden Dipolen zu, aber ein Dipol spürt in einem so sanften Feld fast keine Kraft; die influenzierte Ladung macht es (Ziaei-Moayyed, Goodman und Williams, 2000).',
      },
      back: { kid: 'Der Ballon ist zurück an seiner Schnur. Seine Ladung entweicht langsam in die Luft.', sci: 'Die Ladung des Ballons fließt ab, in feuchter Luft schneller.' },
      salt: {
        kid: 'Ein Salzkorn fällt hinein. Schau: Die Wassermoleküle drehen ihre rote Sauerstoffseite zum Natrium und ihre weißen Wasserstoffseiten zum Chlorid und ziehen sie eins nach dem anderen weg.',
        sci: 'NaCl → Na⁺(aq) + Cl⁻(aq). Jedes Ion bekommt eine Hydrathülle aus etwa sechs Wassermolekülen: Sauerstoff nach innen um Na⁺, Wasserstoff nach innen um Cl⁻. Die Permittivität des Wassers (εr ≈ 80) schwächt die Anziehung der Ionen etwa um das Achtzigfache.',
      },
      done: {
        kid: 'Alles weg! Das Salz ist noch da, aber in Stückchen, die viel zu klein zum Sehen sind, jedes in Wasser eingehüllt.',
        sci: 'Vollständig gelöst, die Ionen hydratisiert. Ein Liter Wasser nimmt bei 20 °C bis zu etwa 360 g Salz auf.',
      },
    },
    panel: {
      kid: [
        'Ein Wassermolekül ist ein Sauerstoff, der zwei Wasserstoffe festhält, und es ist gewinkelt. Der Sauerstoff zieht die gemeinsamen Elektronen zu sich, darum hat das Molekül ein leicht negatives Ende (den Sauerstoff) und zwei leicht positive Enden (die Wasserstoffe). Hier sind sie etwa zwei Milliarden Mal größer gezeichnet: Geh zwischen ihnen herum.',
        'Diese geladenen Enden machen Wasser gut darin, Dinge auseinanderzuziehen: Tipp das Salz an und schau. Und Wasser lässt elektrische Ladung durch sich wandern, darum kann ein geladener Ballon seinen Strahl zur Seite ziehen.',
      ],
      sci: [
        'H₂O ist gewinkelt (104,5°) und polar: Die höhere Elektronegativität des Sauerstoffs gibt ihm eine negative Partialladung und jedem Wasserstoff eine positive; Dipolmoment 1,85 D. Seine hohe Permittivität (εr ≈ 80 bei 20 °C) und seine Wasserstoffbrücken machen es zu einem hervorragenden Lösungsmittel für Ionen.',
        'Der sich biegende Strahl ist ein klassischer Versuch, doch seine Ursache ist Ladung, nicht sich drehende Dipole: Der geladene Ballon zieht Ladung des entgegengesetzten Vorzeichens in den Strahl, während er entsteht, und Wasser, das Ionen enthält, nimmt sie leicht auf. Kelvin nutzte denselben Effekt 1867 in seinem Wassertropfengenerator.',
      ],
    },
  },
  ice: {
    label: 'Der zugefrorene See',
    title: 'Warum Eis schwimmt',
    air: 'Luft über dem See',
    rows: { air: 'Luft', ice: 'Eis', top: 'Wasser oben', bottom: 'Wasser am Grund', none: 'keins' },
    signs: { model: 'Wasser, vergrößert', more: '9% mehr Platz', ice: '{cm} cm Eis' },
    verbs: { later: 'Ein paar Wochen später', freeze: 'Modell gefrieren', melt: 'Modell schmelzen' },
    hints: { thermo: 'Tipp das Thermometer draußen an', freeze: 'Tipp das Modell an, um es zu gefrieren', melt: 'Tipp das Modell an, um es zu schmelzen', any: 'Tipp das Thermometer oder das Modell an' },
    says: {
      warm: { kid: 'Herbst. Die kalte Luft kühlt den See von oben, und das abgekühlte Wasser ist schwerer, also sinkt es. Der ganze See wird kälter.', sci: 'Über 4 °C ist kühleres Wasser dichter: Das Oberflächenwasser sinkt, und der See mischt sich von oben bis unten.' },
      four: { kid: 'Jetzt hat der ganze See etwa 4 °C. Wasser ist bei 4 °C am schwersten, darum füllt dieses Wasser den Grund.', sci: 'Bei etwa 4 °C erreicht Wasser seine größte Dichte (0,99997 g/cm³ bei 3,98 °C): Der ganze See mischt sich bis dahin durch.' },
      cold: { kid: 'Kälter als 4 °C wird Wasser wieder leichter! Darum bleibt das kälteste Wasser oben und sinkt nicht.', sci: 'Unter 3,98 °C sinkt die Dichte wieder: Das kältere Wasser bleibt an der Oberfläche, über dem 4 °C warmen Wasser.' },
      ice: { kid: 'Oben friert es zu. Eis ist leichter als Wasser, darum schwimmt es und deckt den See zu wie ein Deckel.', sci: 'Eis bildet sich an der Oberfläche und schwimmt (0,917 g/cm³); es isoliert das Wasser darunter.' },
      deep: { kid: 'Das Eis wird dicker, aber darunter bleiben die Fische im 4 °C warmen Wasser am Grund, den ganzen Winter lang.', sci: 'Unter dem Eis: 0 °C am Eis, etwa 4 °C nahe am Grund. Eis und Schnee bremsen das Gefrieren, darum friert ein tiefer See nicht bis zum Grund zu.' },
      spring: { kid: 'Frühling! Das Eis schmilzt, und der See wird wieder wärmer.', sci: 'Frühling: Das Eis schmilzt, und der See mischt sich wieder.' },
      freeze: {
        kid: 'Gefroren! Im Eis hält jedes Molekül vier Nachbarn fest, in Sechserringen mit großen leeren Löchern. Das braucht mehr Platz: Eis braucht etwa 9% mehr Raum als sein Wasser, darum ist es leichter und schwimmt. Und die Sechserringe sind der Grund, warum Schneeflocken sechs Arme haben!',
        sci: 'Eis Ih: jedes O über Wasserstoffbrücken mit vier anderen in einem Tetraeder verbunden (O–O 2,76 Å), gewellte Sechsringe mit offenen Kanälen entlang der c-Achse. 0,917 g/cm³ gegen 0,9998 für Wasser bei 0 °C: 9% mehr Volumen. Schneekristalle haben ihre sechszählige Symmetrie von diesem Gitter.',
      },
      melt: { kid: 'Geschmolzen: Die Ringe brechen auf, die Moleküle rücken zusammen und füllen die Löcher, und dasselbe Wasser passt in weniger Raum.', sci: 'Beim Schmelzen bricht das offene Netz teilweise zusammen, und Moleküle rücken in seine Hohlräume: Die Dichte steigt auf 0,9998 g/cm³.' },
    },
    panel: {
      kid: [
        'Die meisten Dinge werden schwerer, wenn sie kälter werden, und Wasser auch, aber nur bis etwa 4 °C. Noch kälter wird es wieder leichter, und Eis ist noch leichter. Darum frieren Seen von oben zu, und das Eis schwimmt darauf wie ein Deckel.',
        'Schieb die Lufttemperatur durch einen Winter (oder tipp das Thermometer vor dem Fenster an) und schau dir den See und seine Fische an. Dann tipp das Modell am Fenster an, um die Moleküle im Eis zu sehen.',
      ],
      sci: [
        'Die Dichte von Wasser ist bei 3,98 °C am größten. Im Herbst sinkt das abkühlende Oberflächenwasser, bis der ganze See nahe 4 °C hat; darunter bleibt das kältere, leichtere Wasser oben, und Eis bildet sich an der Oberfläche. Es schwimmt, weil Eis Ih (0,917 g/cm³) etwa 8% weniger dicht ist als Wasser: Dieselbe Masse braucht 9% mehr Raum.',
        'Eis und Schnee isolieren den See: Darunter bleibt das Wasser oben nahe 0 °C und am Grund bei etwa 4 °C, wo viele Fische den Winter verbringen. Würde Eis sinken, füllten sich Seen von unten her mit Eis.',
      ],
    },
  },
}

export const WATER_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
