// The words of oxygen's magnet room ("Oxygen that sticks to a magnet"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/O.js (the easel shows it); oxygen's air wing already pours liquid oxygen and nitrogen
// between a horseshoe magnet's poles and shows O2's Lewis picture, so this room goes on from there.
// Sources (checked 2026-10-30): boiling points, density and colour of liquid oxygen, and liquid air
// (boils near 78.8 K, −194.35 °C, nitrogen first), as Wikipedia's "Liquid oxygen" and "Liquid air";
// the dew point of air at 1 atm, 81.6 K (about −191.5 °C); Cailletet and Pictet announced to the Paris
// Academy of Sciences on 24 December 1877 (Cailletet a fog, Pictet a cascade of sulfur dioxide and carbon
// dioxide); Wróblewski and Olszewski, Kraków 1883: sources give 29 March, 5 April or 9 April for oxygen, so
// the words say "spring 1883"; nitrogen 13 April 1883; Linde's machine, Munich, May 1895, about 3 litres
// of liquid air an hour; Hampson's patent 23 May 1895, Linde's 5 June 1895; critical temperatures O2
// 154.6 K, N2 126.2 K. Carbon dioxide's frost point in air (0.04%) is an estimate from its vapour
// pressure (about −140 °C at 1 atm): the words say only "below about −130 °C". Water's susceptibility
// −9.05 × 10⁻⁶ (SI) and the frog in the 32 mm bore of a Bitter magnet at about 16 T, Nijmegen
// (Wikipedia "Diamagnetism"); Berry and Geim, European Journal of Physics 1997; Ig Nobel Prize in Physics
// 2000 (Geim and Berry); Nobel Prize in Physics 2010 (Geim and Novoselov, graphene). Liquid oxygen's
// susceptibility, about +3.5 × 10⁻³ (SI), from its molar susceptibility (+7699 × 10⁻⁶ cm³/mol, CGS, at
// 90 K) and density. The F-1: LOX and RP-1 at a mixture ratio of 2.27, five engines burning 12 890 kg/s
// (Wikipedia "Rocketdyne F-1"); kerosene's stoichiometric ratio about 3.4; best specific impulse near 2.3
// to 2.6. Goddard, 16 March 1926, Auburn, Massachusetts: gasoline and LOX, 2.5 s, 41 ft (12.5 m) high,
// 184 ft (56 m) away (most sources).

const EN = {
  title: 'The liquid oxygen lab',
  greet: {
    kid: 'We are inside the picture, in a very cold laboratory! On the left a machine turns air into a liquid. On the right a big magnet: who sticks and who floats? Through the doors a rocket engine waits for its oxygen. The picture\'s story is on the easel.',
    sci: 'A cryogenics laboratory: on the left a Linde-style liquefier and a column that separates liquid air; on the right an electromagnet for paramagnetic oxygen and diamagnetic water, and a model of the Nijmegen magnet that floated a frog; outside, a kerosene and liquid oxygen engine on its test stand. The picture\'s story is on the easel.',
  },
  talk: {
    kid: [
      'Oxygen gas has no colour at all. But in liquid oxygen the molecules are packed so close that pairs of them soak up a little red and yellow light, and what is left looks pale blue.',
      'One litre of liquid oxygen boils into about 860 litres of oxygen gas. That is why hospitals and rockets keep their oxygen as a liquid.',
      'Careful in here: liquid oxygen is so cold that it freezes skin at once, and it makes things like oil, wood or cloth burn fiercely.',
    ],
    sci: [
      'Liquid O2 is pale blue because pairs of colliding molecules absorb red light near 630 nm: one photon lifts both molecules into their excited singlet state at once.',
      'Liquid oxygen boils at 90.2 K (−183.0 °C) with a density of 1.141 g/cm³; a litre gives about 860 litres of gas at room temperature.',
      'Argon, 0.93% of the air, boils at 87.3 K (−185.8 °C), between oxygen and nitrogen: air separation plants draw it off from the middle of the column.',
    ],
  },
  air: {
    label: 'The liquid air machine',
    title: 'Making liquid air',
    slider: 'Coldest point in the machine',
    signs: { machine: 'Liquid air machine', column: 'Separating column', lox: 'Liquid oxygen' },
    hints: {
      run: 'Tap the machine to start it',
      cooling: 'Watch the thermometer',
      column: 'Tap the column to separate the liquid air',
      wait: 'Watch the column',
      lox: 'Tap the oxygen flask',
    },
    buttons: { run: 'Run the machine', off: 'Switch it off', column: 'Separate it', lox: 'The oxygen flask' },
    board: {
      title: 'Coldest point',
      water: 'water freezes',
      co2: 'pure dry ice',
      o2: 'oxygen boils',
      ar: 'argon boils',
      air: 'liquid air',
      n2: 'nitrogen boils',
      share: 'oxygen in the liquid: {p}%',
    },
    says: {
      start: { kid: 'The machine is running! Squeeze, cool, let it expand: each round the air comes out a little colder.', sci: 'Running: compression, cooling, then expansion through a valve (the Joule-Thomson effect); the cold returning gas precools the air coming in.' },
      frost: { kid: 'Below 0 °C: the water in the air freezes into frost on the cold pipes.', sci: 'Below 0 °C water vapour deposits as frost. Real plants dry the air first, so ice cannot block them.' },
      dryIce: { kid: 'Now the carbon dioxide freezes into a fine snow of dry ice.', sci: 'Carbon dioxide deposits as dry ice. Pure CO2 does so at −78.5 °C, but at 0.04% of the air it waits until below about −130 °C.' },
      notYet: { kid: 'Colder than −183 °C and still no drops? In air the oxygen is mixed with lots of nitrogen, so it must get a little colder still.', sci: 'Below oxygen\'s boiling point, but oxygen is only 21% of the mixture: at normal pressure air begins to condense near −191 °C.' },
      drops: { kid: 'Drip! The air has turned into a liquid, pale blue from its oxygen. The first drops are extra rich in oxygen, which turns liquid more easily than nitrogen.', sci: 'Condensing: the first liquid is richer in oxygen than the air, since oxygen is less volatile. By about −194 °C all of the air is liquid.' },
      warm: { kid: 'Switched off: the machine warms up again.', sci: 'Off: the cold box warms toward room temperature.' },
      boiled: { kid: 'Too warm now: the liquid air boils away and becomes air again.', sci: 'Above its boiling range the liquid air evaporates.' },
      noLiquid: { kid: 'There is no liquid air yet. Make the machine colder first: tap it, or use the slider!', sci: 'No liquid in the column yet: cool the machine below about −191 °C.' },
      sep: { kid: 'Into the column! Warmed a little from below, the nitrogen boils away first: up it goes, out of the top.', sci: 'Distillation: nitrogen (77 K) is the more volatile and rises as vapour; oxygen (90 K) runs down and collects at the bottom.' },
      sepDone: { kid: 'Only the oxygen is left: pale blue liquid oxygen! This is how oxygen is made for hospitals, steelworks and rockets.', sci: 'The bottom product is liquid oxygen, typically 99.5% pure or more; nitrogen leaves as gas from the top.' },
      lox: { kid: 'Liquid oxygen, −183 °C. Now try it on the big magnet across the hall!', sci: 'LOX at 90 K, 1.141 g/cm³. Try it on the electromagnet across the hall.' },
      loxEmpty: { kid: 'This flask is waiting for oxygen. Make liquid air, then tap the column to separate it.', sci: 'Empty: separate liquid air in the column first.' },
    },
    panel: {
      kid: [
        'Air is a mix of gases: mostly nitrogen, about one fifth oxygen, and a little water vapour and carbon dioxide. This machine squeezes the air, cools it, and lets it rush out through a tiny valve, which makes it colder still. The cold air coming back cools the air going in, so round after round it gets colder, until the air drips out as a liquid.',
        'On the way down the water freezes out first, as frost, then the carbon dioxide, as dry ice. On its own, oxygen turns liquid at −183 °C and nitrogen at −196 °C; mixed as air they turn liquid a little below −190 °C. Warm the liquid air gently and the nitrogen boils away first, while the oxygen stays. That is how oxygen is made for hospitals, steelworks and rockets.',
      ],
      sci: [
        'A Hampson-Linde cycle: compress the air, remove the heat of compression, expand it through a valve (Joule-Thomson cooling), and send the cold expanded gas back through a counterflow heat exchanger to precool the incoming air, until part of it liquefies. Carl von Linde\'s machine in Munich made about 3 litres of liquid air an hour in May 1895; William Hampson had filed a patent for the same cycle in England two weeks earlier.',
        'Water and carbon dioxide would freeze and block the exchangers, so plants remove them first. Pure CO2 sublimes at −78.5 °C, but at 0.04% of the air it freezes out only below about −130 °C. At normal pressure liquid air forms between about −191 and −194 °C. Oxygen boils at 90.2 K (−183.0 °C), argon at 87.3 K, nitrogen at 77.4 K (−195.8 °C): in a distillation column the nitrogen rises and nearly pure liquid oxygen collects at the bottom.',
      ],
    },
  },
  firsts: {
    label: 'Who was first?',
    title: 'The race to liquid oxygen',
    hints: { tap: 'Tap a glass tube to hear its story' },
    buttons: { a: '1877: a mist', b: '1883: a liquid', c: '1895: by the litre' },
    says: {
      a: { kid: '1877. In France, Louis Cailletet squeezed oxygen hard, cooled it, then let it go all at once. For a moment a mist of tiny drops appeared in his tube, and then it was gone. In Geneva, Raoul Pictet managed it in the same weeks.', sci: 'December 1877: Louis Cailletet released cold, compressed oxygen and saw a fleeting fog of droplets; Raoul Pictet in Geneva, cooling with a cascade of sulfur dioxide and carbon dioxide, saw a jet of liquid as the pressure was let go. Both were announced at the Paris Academy of Sciences on 24 December 1877.' },
      b: { kid: '1883. In Kraków, Zygmunt Wróblewski and Karol Olszewski were the first to make liquid oxygen that stayed in their tube: a real liquid you could see, with its own surface. Days later they liquefied nitrogen too.', sci: 'Spring 1883, Jagiellonian University, Kraków: Wróblewski and Olszewski cooled oxygen with liquid ethylene boiling under reduced pressure, below oxygen\'s critical temperature (−118.6 °C), and saw it as a liquid with a meniscus: the first measurable quantity. Nitrogen followed on 13 April 1883.' },
      c: { kid: '1895. In Munich, Carl von Linde built a machine that made liquid air not drop by drop but by the litre: about 3 litres an hour. Machines like his still make our oxygen today.', sci: 'May 1895, Munich: Linde\'s continuous liquefier, Joule-Thomson expansion with a counterflow heat exchanger, made about 3 litres of liquid air an hour. William Hampson had filed a patent for the same cycle two weeks earlier, on 23 May 1895.' },
    },
    panel: {
      kid: [
        'For a long time people thought that oxygen, nitrogen and hydrogen could never be made liquid, and called them the permanent gases. Squeezing alone never worked: a gas must first be cooled below its own special temperature (for oxygen −119 °C) before any squeeze can turn it into a liquid.',
        'The race was won step by step: a mist in 1877, a real liquid in Kraków in 1883, and machines making it by the litre from 1895.',
      ],
      sci: [
        'The permanent gases resisted because each has a critical temperature above which no pressure liquefies it (Thomas Andrews, 1869): 154.6 K (−118.6 °C) for oxygen, 126.2 K (−147.0 °C) for nitrogen.',
        'Cailletet and Pictet (December 1877) got fleeting fogs and jets; Wróblewski and Olszewski (Kraków, 1883) held liquid oxygen at rest in a tube; Linde (1895) made liquid air in quantity. The vacuum flask James Dewar invented in 1892 is what keeps such liquids cold.',
      ],
    },
  },
  magnet: {
    label: 'The big electromagnet',
    title: 'Who sticks, who floats?',
    slider: 'Magnetic field',
    tags: { lox: 'liquid oxygen', ln2: 'liquid nitrogen', water: 'water' },
    hints: { pick: 'Tap the oxygen, the nitrogen or the water', watch: 'Watch the poles', water: 'Tap the water to take it back' },
    buttons: { lox: 'Liquid oxygen', ln2: 'Liquid nitrogen', water: 'Water' },
    board: {
      title: 'Magnetic field',
      off: 'switched off',
      pulled: 'pulled in',
      pushed: 'pushed away, a tiny bit',
      lox: 'Liquid oxygen',
      ln2: 'Liquid nitrogen',
      water: 'Water',
      para: 'paramagnetic',
      dia: 'diamagnetic',
      hold: 'holds up {h} cm of liquid',
      dip: 'dip in its surface: {d} mm',
      mo: 'O2: the outer orbitals',
      unpaired: 'two unpaired electrons',
    },
    lens: { title: 'Water surface, magnified', dip: 'dip: {d} mm', scale: '1 mm', empty: 'Tap the water' },
    says: {
      lox: { kid: 'Liquid oxygen jumps to the poles and hangs between them like a little bridge! The magnet pulls it in.', sci: 'Paramagnetic: liquid O2 (χ ≈ +3.5 × 10⁻³) is drawn into the strongest field and bridges the gap. At {b} T the pull equals the weight of {h} cm of liquid.' },
      loxWeak: { kid: 'The field is too weak: the oxygen falls straight through. Turn the magnet up!', sci: 'Too weak a field: the magnetic pull loses to gravity, and the LOX runs through the gap.' },
      loxFall: { kid: 'You turned the field down: the bridge of oxygen falls!', sci: 'Field reduced: the magnetic pressure no longer holds the liquid, and it drops.' },
      ln2: { kid: 'Liquid nitrogen pours straight through. The magnet does not pull it at all.', sci: 'N2 has all its electrons paired: it is diamagnetic, pushed away only very weakly, so it pours through and boils at 77 K.' },
      water: { kid: 'Water is pushed away! The screen shows the dip the magnet presses into its surface: {d} mm deep. Turn the field up and watch it grow.', sci: 'Diamagnetic: χ = −9.05 × 10⁻⁶. The field pushes the water out of the gap, a dip of {d} mm at {b} T (the Moses effect), growing with B².' },
      waterBack: { kid: 'The water goes back to its place.', sci: 'Dish withdrawn.' },
      boiled: { kid: 'The oxygen bridge has boiled away into the air.', sci: 'Evaporated: each litre of liquid becomes about 860 litres of gas.' },
    },
    panel: {
      kid: [
        'This magnet is coils of copper wire wound round iron. The slider sends more electricity through them, and the field between the poles grows stronger.',
        'Liquid oxygen is pulled into the field and hangs there. Liquid nitrogen is not pulled, so it falls through. And water? The magnet pushes it away, very gently: everything is pushed away a little like this, but in oxygen the pull wins, hundreds of times stronger.',
      ],
      sci: [
        'O2 is paramagnetic: its ground state is a triplet, with two unpaired electrons, one in each of the two π* orbitals, their spins parallel. The Lewis picture, every electron paired, cannot show this; molecular orbital theory predicts it. The unpaired spins line up with the field, so the liquid is drawn to where the field is strongest. Its susceptibility, about +3.5 × 10⁻³, is roughly 400 times water\'s, and opposite in sign.',
        'Diamagnetism is universal: a field induces currents in every electron cloud that oppose it (Lenz\'s law), so all matter is weakly repelled; it shows wherever no unpaired electrons outweigh it. For water, χ = −9.05 × 10⁻⁶: the dip in its surface is h = |χ|B²/(2μ0ρg), under a millimetre at 1.5 T. Liquid nitrogen is diamagnetic too.',
      ],
    },
  },
  frog: {
    label: 'The floating frog',
    title: 'The frog that flew',
    note: 'Model: the real hole is 3.2 cm wide',
    display: 'field',
    hints: { on: 'Tap the big magnet to switch it on', off: 'Tap the magnet to switch it off', wait: 'Watch the frog' },
    buttons: { on: 'Switch on: 16 tesla', off: 'Switch off' },
    says: {
      on: { kid: 'Switching on: 16 tesla, hundreds of thousands of times stronger than the Earth\'s own magnetism!', sci: 'Ramping up to about 16 T (a Bitter magnet, water-cooled copper plates).' },
      float: { kid: 'The frog floats! A frog is mostly water, and this enormous magnet pushes water away hard enough to hold it up. It was alive, and not hurt at all.', sci: 'Levitation: B·dB/dz must reach μ0ρg/|χ|, about 1400 T²/m for water. The frog floats near the top of the coil, where the field falls off fastest. It was unharmed.' },
      off: { kid: 'Switching off: the frog sinks gently back to its cushion.', sci: 'Field down: below the levitation condition the frog settles.' },
      landed: { kid: 'Back on its cushion, safe and sound.', sci: 'Landed.' },
    },
    panel: {
      kid: [
        'A magnet pushes water away, ever so slightly, and a frog is mostly water. So with a magnet strong enough, a frog can float! In 1997, at Nijmegen in the Netherlands, Andre Geim floated a living frog in a magnet of about 16 tesla. It was not hurt.',
        'For this, he and Michael Berry won an Ig Nobel Prize in 2000, a prize for research that makes people laugh, and then think. In 2010 Andre Geim won a real Nobel Prize in Physics, for graphene: sheets of carbon one atom thick. He was the first person to win both.',
      ],
      sci: [
        'A live frog levitated in the 32 mm vertical bore of a Bitter solenoid at about 16 T, at the Nijmegen High Field Magnet Laboratory (Berry and Geim, "Of flying frogs and levitrons", European Journal of Physics, 1997). A diamagnet floats where B·dB/dz = μ0ρg/|χ|, about 1400 T²/m for water, and it can float stably, which Earnshaw\'s theorem forbids for ordinary magnets on their own.',
        'Andre Geim and Michael Berry shared the 2000 Ig Nobel Prize in Physics for it; Geim shared the 2010 Nobel Prize in Physics with Konstantin Novoselov, for graphene. The model here is about ten times real size.',
      ],
    },
  },
  rocket: {
    label: 'The rocket engine',
    title: 'Fire the engine',
    slider: 'Oxygen for each kilogram of kerosene',
    tanks: { fuel: 'KEROSENE', lox: 'LOX' },
    hints: {
      fire: 'Tap the engine to fire it',
      burning: 'Listen to it roar',
      more: 'Tap the LOX tank for more oxygen',
      less: 'Tap the kerosene tank for less oxygen',
    },
    buttons: { fire: 'Fire!', more: 'More oxygen', less: 'Less oxygen' },
    board: {
      title: 'The mix',
      per: 'kg of oxygen for 1 kg of kerosene',
      push: 'push',
      lean: 'too little oxygen',
      good: 'just right',
      rich: 'too much oxygen',
      stoich: 'burns it all',
      f1: 'Saturn V',
    },
    says: {
      lean: { kid: 'Sooty and weak! Without enough oxygen much of the kerosene cannot burn, and it turns into black smoke. Give it more oxygen!', sci: 'Fuel-rich at {m}: incomplete combustion, soot and carbon monoxide, a cool, smoky, weak flame.' },
      ok: { kid: 'Better: more oxygen, more fire! But it is not the best mix yet.', sci: 'At {m} the specific impulse is still short of its peak.' },
      good: { kid: 'What a roar! At this mix the flame is bright and clear, with shining knots of light in it, and the push is the strongest.', sci: 'Near the best mix ({m}): the highest specific impulse. The bright knots are shock waves in the supersonic exhaust (shock diamonds).' },
      rich: { kid: 'Too much oxygen! The push drops again, and hot oxygen starts to burn the engine\'s own metal: see the nozzle glow. Engines run a little short of oxygen on purpose.', sci: 'Oxidiser-rich at {m}: towards and past the stoichiometric ratio (about 3.4) the specific impulse falls, and hot oxygen-rich gas attacks the walls.' },
      more: { kid: 'More oxygen: {m} kg for each kilogram of kerosene.', sci: 'Mixture ratio O/F = {m}.' },
      less: { kid: 'Less oxygen: {m} kg for each kilogram of kerosene.', sci: 'Mixture ratio O/F = {m}.' },
      goddard: { kid: 'Robert Goddard built the first rocket to burn liquid fuel: petrol and liquid oxygen. On 16 March 1926, on his aunt\'s farm in Auburn, USA, it flew for 2.5 seconds and rose 12.5 metres. Small, but every big rocket since began there.', sci: '16 March 1926, Auburn, Massachusetts: Goddard\'s rocket burned gasoline with liquid oxygen, its motor at the top fed by pipes from tanks below. It flew 2.5 s, rising about 12.5 m (41 ft) and landing 56 m (184 ft) away.' },
    },
    panel: {
      kid: [
        'Fire needs oxygen. Down here the air has plenty, but space has no air at all. So a rocket carries its own oxygen, as a liquid, which takes about 860 times less room than the gas.',
        'This engine burns kerosene with liquid oxygen. With too little oxygen the flame is sooty and weak; with too much, the engine itself starts to burn. The best mix is about 2.3 to 2.6 kilograms of oxygen for every kilogram of kerosene. The first stage of the Saturn V, the rocket that took astronauts to the Moon, burned about 13 tonnes of kerosene and liquid oxygen every second!',
      ],
      sci: [
        'Liquid oxygen (LOX, 90 K) is the oxidiser; RP-1, a refined kerosene, the fuel. Burning all of the kerosene would take about 3.4 kg of oxygen per kilogram, but engines run fuel-rich, at an oxidiser-to-fuel mass ratio of about 2.3 to 2.6, where specific impulse peaks: lighter exhaust molecules (CO and H2 among the CO2 and H2O) leave faster, and the chamber runs cooler.',
        'The Saturn V\'s first stage had five F-1 engines at a mixture ratio of 2.27, together burning about 12.9 tonnes of propellant a second. Robert Goddard flew the first liquid-propellant rocket, gasoline and liquid oxygen, on 16 March 1926 at Auburn, Massachusetts.',
      ],
    },
  },
}

const PT = {
  title: 'O laboratório do oxigénio líquido',
  greet: {
    kid: 'Estamos dentro da imagem, num laboratório muito frio! À esquerda, uma máquina transforma o ar num líquido. À direita, um grande íman: quem se agarra e quem flutua? Pelas portas, um motor de foguetão espera pelo seu oxigénio. A história da imagem está no cavalete.',
    sci: 'Um laboratório de criogenia: à esquerda, um liquefator ao estilo de Linde e uma coluna que separa o ar líquido; à direita, um eletroíman para o oxigénio paramagnético e a água diamagnética, e um modelo do íman de Nijmegen que pôs uma rã a flutuar; lá fora, um motor de querosene e oxigénio líquido no seu banco de ensaios. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'O oxigénio gasoso não tem cor nenhuma. Mas no oxigénio líquido as moléculas estão tão juntas que, aos pares, absorvem um pouco de luz vermelha e amarela, e o que sobra parece azul-claro.',
      'Um litro de oxigénio líquido ferve e dá cerca de 860 litros de oxigénio gasoso. É por isso que os hospitais e os foguetões guardam o oxigénio em líquido.',
      'Cuidado aqui dentro: o oxigénio líquido é tão frio que congela a pele num instante, e faz coisas como óleo, madeira ou pano arder com uma força enorme.',
    ],
    sci: [
      'O O2 líquido é azul-claro porque pares de moléculas em colisão absorvem luz vermelha perto dos 630 nm: um só fotão leva as duas moléculas ao seu estado singuleto excitado ao mesmo tempo.',
      'O oxigénio líquido ferve a 90,2 K (−183,0 °C) e tem uma densidade de 1,141 g/cm³; um litro dá cerca de 860 litros de gás à temperatura ambiente.',
      'O árgon, 0,93% do ar, ferve a 87,3 K (−185,8 °C), entre o oxigénio e o azoto: as fábricas de separação do ar retiram-no do meio da coluna.',
    ],
  },
  air: {
    label: 'A máquina do ar líquido',
    title: 'Fazer ar líquido',
    slider: 'Ponto mais frio da máquina',
    signs: { machine: 'Máquina de ar líquido', column: 'Coluna de separação', lox: 'Oxigénio líquido' },
    hints: {
      run: 'Toca na máquina para a ligar',
      cooling: 'Observa o termómetro',
      column: 'Toca na coluna para separar o ar líquido',
      wait: 'Observa a coluna',
      lox: 'Toca no frasco de oxigénio',
    },
    buttons: { run: 'Ligar a máquina', off: 'Desligar', column: 'Separar', lox: 'O frasco de oxigénio' },
    board: {
      title: 'Ponto mais frio',
      water: 'a água congela',
      co2: 'gelo seco puro',
      o2: 'o oxigénio ferve',
      ar: 'o árgon ferve',
      air: 'ar líquido',
      n2: 'o azoto ferve',
      share: 'oxigénio no líquido: {p}%',
    },
    says: {
      start: { kid: 'A máquina está a trabalhar! Apertar, arrefecer, deixar expandir: a cada volta o ar sai um pouco mais frio.', sci: 'Em funcionamento: compressão, arrefecimento e expansão por uma válvula (o efeito Joule-Thomson); o gás frio que volta pré-arrefece o ar que entra.' },
      frost: { kid: 'Abaixo de 0 °C: a água do ar congela e faz geada nos tubos frios.', sci: 'Abaixo de 0 °C o vapor de água deposita-se como geada. As fábricas a sério secam o ar primeiro, para o gelo não as entupir.' },
      dryIce: { kid: 'Agora o dióxido de carbono congela e faz uma neve fininha de gelo seco.', sci: 'O dióxido de carbono deposita-se como gelo seco. O CO2 puro fá-lo a −78,5 °C, mas sendo 0,04% do ar só congela abaixo de cerca de −130 °C.' },
      notYet: { kid: 'Mais frio do que −183 °C e ainda nenhuma gota? No ar, o oxigénio está misturado com muito azoto, por isso tem de ficar ainda um pouco mais frio.', sci: 'Abaixo do ponto de ebulição do oxigénio, mas o oxigénio é só 21% da mistura: à pressão normal o ar começa a condensar perto de −191 °C.' },
      drops: { kid: 'Pinga! O ar tornou-se líquido, azul-claro por causa do seu oxigénio. As primeiras gotas são extra ricas em oxigénio, que fica líquido mais facilmente do que o azoto.', sci: 'A condensar: o primeiro líquido é mais rico em oxigénio do que o ar, porque o oxigénio é menos volátil. Por volta de −194 °C todo o ar está líquido.' },
      warm: { kid: 'Desligada: a máquina volta a aquecer.', sci: 'Desligada: a caixa fria aquece até à temperatura ambiente.' },
      boiled: { kid: 'Agora está quente demais: o ar líquido ferve e volta a ser ar.', sci: 'Acima do seu intervalo de ebulição, o ar líquido evapora-se.' },
      noLiquid: { kid: 'Ainda não há ar líquido. Primeiro arrefece mais a máquina: toca nela, ou usa o cursor!', sci: 'Ainda não há líquido na coluna: arrefece a máquina abaixo de cerca de −191 °C.' },
      sep: { kid: 'Para a coluna! Aquecido um pouco por baixo, o azoto ferve primeiro: lá vai ele para cima, a sair pelo topo.', sci: 'Destilação: o azoto (77 K) é o mais volátil e sobe como vapor; o oxigénio (90 K) desce e junta-se no fundo.' },
      sepDone: { kid: 'Só ficou o oxigénio: oxigénio líquido azul-claro! É assim que se faz o oxigénio para os hospitais, as siderurgias e os foguetões.', sci: 'O produto do fundo é oxigénio líquido, normalmente com 99,5% de pureza ou mais; o azoto sai como gás pelo topo.' },
      lox: { kid: 'Oxigénio líquido, −183 °C. Agora experimenta-o no grande íman do outro lado do laboratório!', sci: 'LOX a 90 K, 1,141 g/cm³. Experimenta-o no eletroíman do outro lado do laboratório.' },
      loxEmpty: { kid: 'Este frasco está à espera de oxigénio. Faz ar líquido e depois toca na coluna para o separar.', sci: 'Vazio: separa primeiro o ar líquido na coluna.' },
    },
    panel: {
      kid: [
        'O ar é uma mistura de gases: sobretudo azoto, cerca de um quinto de oxigénio, e um pouco de vapor de água e de dióxido de carbono. Esta máquina aperta o ar, arrefece-o e deixa-o sair de repente por uma válvula pequenina, o que o deixa ainda mais frio. O ar frio que volta arrefece o ar que entra, e assim, volta após volta, fica cada vez mais frio, até o ar sair a pingar, líquido.',
        'Pelo caminho, primeiro a água congela, em geada, depois o dióxido de carbono, em gelo seco. Sozinho, o oxigénio fica líquido a −183 °C e o azoto a −196 °C; misturados, como no ar, ficam líquidos um pouco abaixo de −190 °C. Aquece o ar líquido devagar e o azoto ferve primeiro, enquanto o oxigénio fica. É assim que se faz o oxigénio para os hospitais, as siderurgias e os foguetões.',
      ],
      sci: [
        'Um ciclo de Hampson-Linde: comprime-se o ar, retira-se o calor da compressão, expande-se por uma válvula (arrefecimento de Joule-Thomson) e manda-se o gás frio expandido de volta por um permutador de calor em contracorrente para pré-arrefecer o ar que entra, até parte dele liquefazer. A máquina de Carl von Linde, em Munique, fazia cerca de 3 litros de ar líquido por hora em maio de 1895; William Hampson tinha registado uma patente do mesmo ciclo em Inglaterra duas semanas antes.',
        'A água e o dióxido de carbono congelariam e entupiriam os permutadores, por isso as fábricas retiram-nos primeiro. O CO2 puro sublima a −78,5 °C, mas sendo 0,04% do ar só congela abaixo de cerca de −130 °C. À pressão normal o ar líquido forma-se entre cerca de −191 e −194 °C. O oxigénio ferve a 90,2 K (−183,0 °C), o árgon a 87,3 K, o azoto a 77,4 K (−195,8 °C): numa coluna de destilação o azoto sobe e o oxigénio líquido, quase puro, junta-se no fundo.',
      ],
    },
  },
  firsts: {
    label: 'Quem foi o primeiro?',
    title: 'A corrida ao oxigénio líquido',
    hints: { tap: 'Toca num tubo de vidro para ouvir a sua história' },
    buttons: { a: '1877: uma névoa', b: '1883: um líquido', c: '1895: aos litros' },
    says: {
      a: { kid: '1877. Em França, Louis Cailletet apertou muito o oxigénio, arrefeceu-o e depois soltou-o de uma só vez. Por um instante apareceu no tubo uma névoa de gotinhas, e logo desapareceu. Em Genebra, Raoul Pictet conseguiu-o nas mesmas semanas.', sci: 'Dezembro de 1877: Louis Cailletet soltou oxigénio frio e comprimido e viu um nevoeiro fugaz de gotículas; Raoul Pictet, em Genebra, arrefecendo com uma cascata de dióxido de enxofre e dióxido de carbono, viu um jato de líquido ao soltar a pressão. Os dois foram anunciados na Academia das Ciências de Paris a 24 de dezembro de 1877.' },
      b: { kid: '1883. Em Cracóvia, Zygmunt Wróblewski e Karol Olszewski foram os primeiros a fazer oxigénio líquido que ficava no tubo: um líquido a sério, que se podia ver, com a sua superfície. Dias depois liquefizeram também o azoto.', sci: 'Primavera de 1883, Universidade Jaguelónica, Cracóvia: Wróblewski e Olszewski arrefeceram o oxigénio com etileno líquido a ferver a pressão reduzida, abaixo da temperatura crítica do oxigénio (−118,6 °C), e viram-no como um líquido com menisco: a primeira quantidade mensurável. O azoto seguiu-se a 13 de abril de 1883.' },
      c: { kid: '1895. Em Munique, Carl von Linde construiu uma máquina que fazia ar líquido não gota a gota, mas aos litros: cerca de 3 litros por hora. Máquinas como a dele ainda hoje fazem o nosso oxigénio.', sci: 'Maio de 1895, Munique: o liquefator contínuo de Linde, expansão de Joule-Thomson com um permutador de calor em contracorrente, fazia cerca de 3 litros de ar líquido por hora. William Hampson tinha registado uma patente do mesmo ciclo duas semanas antes, a 23 de maio de 1895.' },
    },
    panel: {
      kid: [
        'Durante muito tempo pensou-se que o oxigénio, o azoto e o hidrogénio nunca poderiam ficar líquidos, e chamavam-lhes os gases permanentes. Só apertar nunca resultava: primeiro é preciso arrefecer o gás abaixo de uma temperatura especial só sua (para o oxigénio, −119 °C), e só então o aperto o transforma num líquido.',
        'A corrida ganhou-se passo a passo: uma névoa em 1877, um líquido a sério em Cracóvia em 1883, e máquinas a fazê-lo aos litros a partir de 1895.',
      ],
      sci: [
        'Os gases permanentes resistiam porque cada um tem uma temperatura crítica acima da qual nenhuma pressão o liquefaz (Thomas Andrews, 1869): 154,6 K (−118,6 °C) para o oxigénio, 126,2 K (−147,0 °C) para o azoto.',
        'Cailletet e Pictet (dezembro de 1877) obtiveram nevoeiros e jatos fugazes; Wróblewski e Olszewski (Cracóvia, 1883) tiveram oxigénio líquido em repouso num tubo; Linde (1895) fez ar líquido em quantidade. O vaso de vácuo que James Dewar inventou em 1892 é o que mantém estes líquidos frios.',
      ],
    },
  },
  magnet: {
    label: 'O grande eletroíman',
    title: 'Quem se agarra, quem flutua?',
    slider: 'Campo magnético',
    tags: { lox: 'oxigénio líquido', ln2: 'azoto líquido', water: 'água' },
    hints: { pick: 'Toca no oxigénio, no azoto ou na água', watch: 'Observa os polos', water: 'Toca na água para a tirar' },
    buttons: { lox: 'Oxigénio líquido', ln2: 'Azoto líquido', water: 'Água' },
    board: {
      title: 'Campo magnético',
      off: 'desligado',
      pulled: 'puxado',
      pushed: 'empurrada, só um bocadinho',
      lox: 'Oxigénio líquido',
      ln2: 'Azoto líquido',
      water: 'Água',
      para: 'paramagnético',
      dia: 'diamagnética',
      hold: 'segura {h} cm de líquido',
      dip: 'cova na superfície: {d} mm',
      mo: 'O2: as orbitais exteriores',
      unpaired: 'dois eletrões desemparelhados',
    },
    lens: { title: 'Superfície da água, ampliada', dip: 'cova: {d} mm', scale: '1 mm', empty: 'Toca na água' },
    says: {
      lox: { kid: 'O oxigénio líquido salta para os polos e fica pendurado entre eles como uma pontezinha! O íman puxa-o.', sci: 'Paramagnético: o O2 líquido (χ ≈ +3,5 × 10⁻³) é atraído para o campo mais forte e faz uma ponte no entreferro. A {b} T a força iguala o peso de {h} cm de líquido.' },
      loxWeak: { kid: 'O campo está fraco demais: o oxigénio cai direitinho. Aumenta o íman!', sci: 'Com um campo fraco demais, a atração magnética perde para a gravidade e o LOX passa pelo entreferro.' },
      loxFall: { kid: 'Baixaste o campo: a ponte de oxigénio cai!', sci: 'Campo reduzido: a pressão magnética já não segura o líquido, que cai.' },
      ln2: { kid: 'O azoto líquido passa direitinho. O íman não o puxa nada.', sci: 'O N2 tem todos os eletrões emparelhados: é diamagnético, empurrado só muito fracamente, por isso passa e ferve a 77 K.' },
      water: { kid: 'A água é empurrada! O ecrã mostra a cova que o íman faz na superfície: {d} mm de fundo. Aumenta o campo e vê-a crescer.', sci: 'Diamagnética: χ = −9,05 × 10⁻⁶. O campo empurra a água para fora do entreferro, uma cova de {d} mm a {b} T (o efeito Moisés), que cresce com B².' },
      waterBack: { kid: 'A água volta para o seu lugar.', sci: 'Prato retirado.' },
      boiled: { kid: 'A ponte de oxigénio evaporou-se no ar.', sci: 'Evaporou: cada litro de líquido dá cerca de 860 litros de gás.' },
    },
    panel: {
      kid: [
        'Este íman é feito de bobinas de fio de cobre enroladas em ferro. O cursor faz passar mais eletricidade por elas, e o campo entre os polos fica mais forte.',
        'O oxigénio líquido é puxado para o campo e fica lá pendurado. O azoto líquido não é puxado, por isso cai. E a água? O íman empurra-a, muito ao de leve: tudo é empurrado um bocadinho assim, mas no oxigénio a atração ganha, centenas de vezes mais forte.',
      ],
      sci: [
        'O O2 é paramagnético: o seu estado fundamental é um tripleto, com dois eletrões desemparelhados, um em cada uma das duas orbitais π*, com spins paralelos. A estrutura de Lewis, com todos os eletrões emparelhados, não o consegue mostrar; a teoria das orbitais moleculares prevê-o. Os spins desemparelhados alinham-se com o campo, por isso o líquido é atraído para onde o campo é mais forte. A sua suscetibilidade, cerca de +3,5 × 10⁻³, é aproximadamente 400 vezes a da água, e de sinal contrário.',
        'O diamagnetismo é universal: um campo induz em cada nuvem eletrónica correntes que se lhe opõem (lei de Lenz), por isso toda a matéria é fracamente repelida; nota-se sempre que não há eletrões desemparelhados a sobrepor-se. Para a água, χ = −9,05 × 10⁻⁶: a cova na superfície é h = |χ|B²/(2μ0ρg), menos de um milímetro a 1,5 T. O azoto líquido também é diamagnético.',
      ],
    },
  },
  frog: {
    label: 'A rã que flutua',
    title: 'A rã que voou',
    note: 'Modelo: o buraco verdadeiro tem 3,2 cm',
    display: 'campo',
    hints: { on: 'Toca no grande íman para o ligar', off: 'Toca no íman para o desligar', wait: 'Observa a rã' },
    buttons: { on: 'Ligar: 16 tesla', off: 'Desligar' },
    says: {
      on: { kid: 'A ligar: 16 tesla, centenas de milhares de vezes mais forte do que o magnetismo da própria Terra!', sci: 'A subir até cerca de 16 T (um íman de Bitter, placas de cobre arrefecidas a água).' },
      float: { kid: 'A rã flutua! Uma rã é feita sobretudo de água, e este íman enorme empurra a água com força suficiente para a segurar no ar. Estava viva, e não se magoou nada.', sci: 'Levitação: B·dB/dz tem de chegar a μ0ρg/|χ|, cerca de 1400 T²/m para a água. A rã flutua perto do topo da bobina, onde o campo diminui mais depressa. Não sofreu nenhum dano.' },
      off: { kid: 'A desligar: a rã desce devagarinho até à sua almofada.', sci: 'Campo a descer: abaixo da condição de levitação, a rã pousa.' },
      landed: { kid: 'De volta à almofada, sã e salva.', sci: 'Pousou.' },
    },
    panel: {
      kid: [
        'Um íman empurra a água, muito ao de leve, e uma rã é feita sobretudo de água. Por isso, com um íman forte que chegue, uma rã pode flutuar! Em 1997, em Nijmegen, nos Países Baixos, Andre Geim pôs uma rã viva a flutuar num íman de cerca de 16 tesla. Ela não se magoou.',
        'Por isso, ele e Michael Berry ganharam um Prémio Ig Nobel em 2000, um prémio para investigação que primeiro faz rir e depois faz pensar. Em 2010 Andre Geim ganhou um Prémio Nobel da Física a sério, pelo grafeno: folhas de carbono com um só átomo de espessura. Foi a primeira pessoa a ganhar os dois.',
      ],
      sci: [
        'Uma rã viva levitou no furo vertical de 32 mm de um solenoide de Bitter a cerca de 16 T, no Laboratório de Campos Magnéticos Intensos de Nijmegen (Berry e Geim, "Of flying frogs and levitrons", European Journal of Physics, 1997). Um diamagnético flutua onde B·dB/dz = μ0ρg/|χ|, cerca de 1400 T²/m para a água, e pode flutuar de forma estável, o que o teorema de Earnshaw proíbe aos ímanes comuns sozinhos.',
        'Andre Geim e Michael Berry partilharam por isso o Prémio Ig Nobel da Física de 2000; Geim partilhou o Prémio Nobel da Física de 2010 com Konstantin Novoselov, pelo grafeno. O modelo aqui tem cerca de dez vezes o tamanho real.',
      ],
    },
  },
  rocket: {
    label: 'O motor de foguetão',
    title: 'Acende o motor',
    slider: 'Oxigénio por cada quilograma de querosene',
    tanks: { fuel: 'QUEROSENE', lox: 'LOX' },
    hints: {
      fire: 'Toca no motor para o acender',
      burning: 'Ouve-o rugir',
      more: 'Toca no tanque de LOX para mais oxigénio',
      less: 'Toca no tanque de querosene para menos oxigénio',
    },
    buttons: { fire: 'Acender!', more: 'Mais oxigénio', less: 'Menos oxigénio' },
    board: {
      title: 'A mistura',
      per: 'kg de oxigénio por 1 kg de querosene',
      push: 'impulso',
      lean: 'oxigénio a menos',
      good: 'mesmo bem',
      rich: 'oxigénio a mais',
      stoich: 'queima tudo',
      f1: 'Saturn V',
    },
    says: {
      lean: { kid: 'Fuliginoso e fraco! Sem oxigénio suficiente, muito do querosene não consegue arder e transforma-se em fumo negro. Dá-lhe mais oxigénio!', sci: 'Rico em combustível a {m}: combustão incompleta, fuligem e monóxido de carbono, uma chama fria, fumarenta e fraca.' },
      ok: { kid: 'Melhor: mais oxigénio, mais fogo! Mas ainda não é a melhor mistura.', sci: 'A {m} o impulso específico ainda não chegou ao máximo.' },
      good: { kid: 'Que rugido! Com esta mistura a chama é brilhante e limpa, com nós de luz a brilhar lá dentro, e o impulso é o mais forte.', sci: 'Perto da melhor mistura ({m}): o impulso específico mais alto. Os nós brilhantes são ondas de choque no escape supersónico (diamantes de choque).' },
      rich: { kid: 'Oxigénio a mais! O impulso volta a baixar, e o oxigénio quente começa a queimar o próprio metal do motor: vê o bocal a brilhar. Os motores trabalham de propósito com um pouco menos de oxigénio.', sci: 'Rico em oxidante a {m}: perto e para lá da razão estequiométrica (cerca de 3,4) o impulso específico desce, e o gás quente rico em oxigénio ataca as paredes.' },
      more: { kid: 'Mais oxigénio: {m} kg por cada quilograma de querosene.', sci: 'Razão de mistura O/F = {m}.' },
      less: { kid: 'Menos oxigénio: {m} kg por cada quilograma de querosene.', sci: 'Razão de mistura O/F = {m}.' },
      goddard: { kid: 'Robert Goddard construiu o primeiro foguetão a queimar combustível líquido: gasolina e oxigénio líquido. A 16 de março de 1926, na quinta da tia, em Auburn, nos EUA, voou 2,5 segundos e subiu 12,5 metros. Pequenino, mas todos os grandes foguetões começaram ali.', sci: '16 de março de 1926, Auburn, Massachusetts: o foguetão de Goddard queimava gasolina com oxigénio líquido, com o motor em cima, alimentado por tubos a partir dos tanques em baixo. Voou 2,5 s, subiu cerca de 12,5 m (41 pés) e caiu a 56 m (184 pés).' },
    },
    panel: {
      kid: [
        'O fogo precisa de oxigénio. Cá em baixo o ar tem muito, mas no espaço não há ar nenhum. Por isso um foguetão leva o seu próprio oxigénio, em líquido, que ocupa cerca de 860 vezes menos espaço do que o gás.',
        'Este motor queima querosene com oxigénio líquido. Com oxigénio a menos, a chama é fuliginosa e fraca; com oxigénio a mais, é o próprio motor que começa a arder. A melhor mistura é de cerca de 2,3 a 2,6 quilogramas de oxigénio por cada quilograma de querosene. O primeiro andar do Saturn V, o foguetão que levou astronautas à Lua, queimava cerca de 13 toneladas de querosene e oxigénio líquido por segundo!',
      ],
      sci: [
        'O oxigénio líquido (LOX, 90 K) é o oxidante; o RP-1, um querosene refinado, o combustível. Queimar todo o querosene exigiria cerca de 3,4 kg de oxigénio por quilograma, mas os motores trabalham ricos em combustível, com uma razão mássica oxidante/combustível de cerca de 2,3 a 2,6, onde o impulso específico é máximo: moléculas de escape mais leves (CO e H2 entre o CO2 e a H2O) saem mais depressa, e a câmara fica mais fria.',
        'O primeiro andar do Saturn V tinha cinco motores F-1 com uma razão de mistura de 2,27, que juntos queimavam cerca de 12,9 toneladas de propelente por segundo. Robert Goddard lançou o primeiro foguetão de propelente líquido, gasolina e oxigénio líquido, a 16 de março de 1926 em Auburn, Massachusetts.',
      ],
    },
  },
}

const PL = {
  title: 'Laboratorium ciekłego tlenu',
  greet: {
    kid: 'Jesteśmy w środku obrazka, w bardzo zimnym laboratorium! Po lewej maszyna zamienia powietrze w ciecz. Po prawej wielki magnes: kto się przyczepi, a kto przeleci? Za drzwiami silnik rakietowy czeka na swój tlen. Historia obrazka jest na sztaludze.',
    sci: 'To laboratorium kriogeniczne: po lewej skraplarka w stylu Lindego i kolumna, która rozdziela ciekłe powietrze; po prawej elektromagnes dla paramagnetycznego tlenu i diamagnetycznej wody oraz model magnesu z Nijmegen, w którym unosiła się żaba; na zewnątrz silnik na naftę lotniczą i ciekły tlen na stanowisku testowym. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Gazowy tlen nie ma żadnego koloru. Ale w ciekłym tlenie cząsteczki są tak ściśnięte, że parami pochłaniają trochę czerwonego i żółtego światła, a to, co zostaje, wygląda na bladoniebieskie.',
      'Z jednego litra ciekłego tlenu robi się około 860 litrów tlenu w postaci gazu. Dlatego szpitale i rakiety trzymają tlen jako ciecz.',
      'Uwaga tutaj: ciekły tlen jest tak zimny, że od razu zamraża skórę, a olej, drewno czy tkanina płoną w nim gwałtownie.',
    ],
    sci: [
      'Ciekły O2 jest bladoniebieski, bo pary zderzających się cząsteczek pochłaniają czerwone światło w pobliżu 630 nm: jeden foton przenosi obie cząsteczki naraz do wzbudzonego stanu singletowego.',
      'Ciekły tlen wrze w 90,2 K (−183,0 °C), a jego gęstość to 1,141 g/cm³; z litra powstaje około 860 litrów gazu w temperaturze pokojowej.',
      'Argon, 0,93% powietrza, wrze w 87,3 K (−185,8 °C), między tlenem a azotem: zakłady rozdziału powietrza odbierają go ze środka kolumny.',
    ],
  },
  air: {
    label: 'Maszyna do ciekłego powietrza',
    title: 'Robimy ciekłe powietrze',
    slider: 'Najzimniejsze miejsce w maszynie',
    signs: { machine: 'Maszyna do ciekłego powietrza', column: 'Kolumna rozdzielcza', lox: 'Ciekły tlen' },
    hints: {
      run: 'Stuknij w maszynę, żeby ją uruchomić',
      cooling: 'Patrz na termometr',
      column: 'Stuknij w kolumnę, żeby rozdzielić ciekłe powietrze',
      wait: 'Patrz na kolumnę',
      lox: 'Stuknij w naczynie z tlenem',
    },
    buttons: { run: 'Uruchom maszynę', off: 'Wyłącz', column: 'Rozdziel', lox: 'Naczynie z tlenem' },
    board: {
      title: 'Najzimniejsze miejsce',
      water: 'woda zamarza',
      co2: 'czysty suchy lód',
      o2: 'tlen wrze',
      ar: 'argon wrze',
      air: 'ciekłe powietrze',
      n2: 'azot wrze',
      share: 'tlenu w cieczy: {p}%',
    },
    says: {
      start: { kid: 'Maszyna pracuje! Ścisnąć, schłodzić, rozprężyć: z każdym obiegiem powietrze wychodzi trochę zimniejsze.', sci: 'Praca: sprężanie, chłodzenie, a potem rozprężanie przez zawór (efekt Joule\'a-Thomsona); zimny gaz wracający wstępnie chłodzi powietrze, które wchodzi.' },
      frost: { kid: 'Poniżej 0 °C: woda z powietrza zamarza w szron na zimnych rurach.', sci: 'Poniżej 0 °C para wodna osiada jako szron. Prawdziwe zakłady najpierw osuszają powietrze, żeby lód ich nie zatkał.' },
      dryIce: { kid: 'Teraz dwutlenek węgla zamarza w drobny śnieg suchego lodu.', sci: 'Dwutlenek węgla osiada jako suchy lód. Czysty CO2 robi to w −78,5 °C, ale jako 0,04% powietrza czeka aż do temperatur poniżej około −130 °C.' },
      notYet: { kid: 'Zimniej niż −183 °C i wciąż ani kropli? W powietrzu tlen jest wymieszany z dużą ilością azotu, więc musi być jeszcze trochę zimniej.', sci: 'Poniżej temperatury wrzenia tlenu, ale tlen to tylko 21% mieszaniny: pod zwykłym ciśnieniem powietrze zaczyna się skraplać w pobliżu −191 °C.' },
      drops: { kid: 'Kap! Powietrze zamieniło się w ciecz, bladoniebieską od tlenu. Pierwsze krople są wyjątkowo bogate w tlen, bo tlen skrapla się łatwiej niż azot.', sci: 'Skraplanie: pierwsza ciecz jest bogatsza w tlen niż powietrze, bo tlen jest mniej lotny. Około −194 °C całe powietrze jest już ciekłe.' },
      warm: { kid: 'Wyłączona: maszyna znowu się ogrzewa.', sci: 'Wyłączona: zimna skrzynia ogrzewa się do temperatury pokojowej.' },
      boiled: { kid: 'Teraz jest za ciepło: ciekłe powietrze wyparowuje i znowu staje się powietrzem.', sci: 'Powyżej zakresu wrzenia ciekłe powietrze odparowuje.' },
      noLiquid: { kid: 'Nie ma jeszcze ciekłego powietrza. Najpierw bardziej schłodź maszynę: stuknij w nią albo użyj suwaka!', sci: 'W kolumnie nie ma jeszcze cieczy: schłodź maszynę poniżej około −191 °C.' },
      sep: { kid: 'Do kolumny! Lekko ogrzany od dołu azot wyparowuje pierwszy: leci w górę i uchodzi górą.', sci: 'Destylacja: azot (77 K) jest bardziej lotny i unosi się jako para; tlen (90 K) spływa w dół i zbiera się na dnie.' },
      sepDone: { kid: 'Został tylko tlen: bladoniebieski ciekły tlen! Tak się robi tlen dla szpitali, hut i rakiet.', sci: 'Produkt dolny to ciekły tlen, zwykle o czystości 99,5% lub wyższej; azot uchodzi górą jako gaz.' },
      lox: { kid: 'Ciekły tlen, −183 °C. Teraz wypróbuj go na wielkim magnesie po drugiej stronie laboratorium!', sci: 'LOX w 90 K, 1,141 g/cm³. Wypróbuj go na elektromagnesie po drugiej stronie laboratorium.' },
      loxEmpty: { kid: 'To naczynie czeka na tlen. Zrób ciekłe powietrze, a potem stuknij w kolumnę, żeby je rozdzielić.', sci: 'Puste: najpierw rozdziel ciekłe powietrze w kolumnie.' },
    },
    panel: {
      kid: [
        'Powietrze to mieszanina gazów: głównie azot, około jednej piątej tlenu i trochę pary wodnej i dwutlenku węgla. Ta maszyna ściska powietrze, chłodzi je i wypuszcza przez malutki zawór, co jeszcze bardziej je ochładza. Zimne powietrze, które wraca, chłodzi powietrze, które wchodzi, więc obieg za obiegiem robi się coraz zimniej, aż powietrze zaczyna kapać jako ciecz.',
        'Po drodze najpierw zamarza woda, jako szron, potem dwutlenek węgla, jako suchy lód. Sam tlen skrapla się w −183 °C, a azot w −196 °C; wymieszane jak w powietrzu skraplają się trochę poniżej −190 °C. Ogrzej ciekłe powietrze delikatnie, a azot wyparuje pierwszy, tlen zostanie. Tak się robi tlen dla szpitali, hut i rakiet.',
      ],
      sci: [
        'Cykl Hampsona-Lindego: sprężyć powietrze, odebrać ciepło sprężania, rozprężyć je przez zawór (chłodzenie Joule\'a-Thomsona) i zawrócić zimny, rozprężony gaz przez przeciwprądowy wymiennik ciepła, żeby wstępnie chłodził wchodzące powietrze, aż część się skropli. Maszyna Carla von Lindego w Monachium dawała w maju 1895 roku około 3 litrów ciekłego powietrza na godzinę; William Hampson zgłosił patent na ten sam cykl w Anglii dwa tygodnie wcześniej.',
        'Woda i dwutlenek węgla zamarzłyby i zatkały wymienniki, więc zakłady usuwają je najpierw. Czysty CO2 sublimuje w −78,5 °C, ale jako 0,04% powietrza wymarza dopiero poniżej około −130 °C. Pod zwykłym ciśnieniem ciekłe powietrze powstaje między około −191 a −194 °C. Tlen wrze w 90,2 K (−183,0 °C), argon w 87,3 K, azot w 77,4 K (−195,8 °C): w kolumnie destylacyjnej azot idzie w górę, a prawie czysty ciekły tlen zbiera się na dnie.',
      ],
    },
  },
  firsts: {
    label: 'Kto był pierwszy?',
    title: 'Wyścig po ciekły tlen',
    hints: { tap: 'Stuknij w szklaną rurkę, żeby usłyszeć jej historię' },
    buttons: { a: '1877: mgiełka', b: '1883: ciecz', c: '1895: na litry' },
    says: {
      a: { kid: '1877. We Francji Louis Cailletet mocno ścisnął tlen, schłodził go, a potem wypuścił naraz. Na chwilę w rurce pojawiła się mgiełka malutkich kropelek i zaraz zniknęła. W Genewie Raoul Pictet dokonał tego w tych samych tygodniach.', sci: 'Grudzień 1877: Louis Cailletet rozprężył zimny, sprężony tlen i zobaczył ulotną mgłę kropelek; Raoul Pictet w Genewie, chłodząc kaskadą dwutlenku siarki i dwutlenku węgla, zobaczył strugę cieczy przy zwolnieniu ciśnienia. Oba wyniki ogłoszono w Paryskiej Akademii Nauk 24 grudnia 1877 roku.' },
      b: { kid: '1883. W Krakowie Zygmunt Wróblewski i Karol Olszewski jako pierwsi na świecie zrobili ciekły tlen, który został w ich rurce: prawdziwą ciecz, którą można było zobaczyć, z własną powierzchnią. To polskie odkrycie! Kilka dni później skroplili też azot.', sci: 'Wiosna 1883, Uniwersytet Jagielloński w Krakowie: Wróblewski i Olszewski schłodzili tlen ciekłym etylenem wrzącym pod obniżonym ciśnieniem, poniżej temperatury krytycznej tlenu (−118,6 °C), i zobaczyli go jako ciecz z menisku: pierwszą mierzalną ilość na świecie, polski sukces. Azot skroplili 13 kwietnia 1883 roku.' },
      c: { kid: '1895. W Monachium Carl von Linde zbudował maszynę, która robiła ciekłe powietrze nie kropla po kropli, ale na litry: około 3 litrów na godzinę. Maszyny podobne do jego wciąż robią nasz tlen.', sci: 'Maj 1895, Monachium: ciągła skraplarka Lindego, rozprężanie Joule\'a-Thomsona z przeciwprądowym wymiennikiem ciepła, dawała około 3 litrów ciekłego powietrza na godzinę. William Hampson zgłosił patent na ten sam cykl dwa tygodnie wcześniej, 23 maja 1895 roku.' },
    },
    panel: {
      kid: [
        'Przez długi czas myślano, że tlenu, azotu i wodoru nigdy nie da się skroplić, i nazywano je gazami trwałymi. Samo ściskanie nigdy nie działało: gaz trzeba najpierw schłodzić poniżej jego własnej, szczególnej temperatury (dla tlenu −119 °C), dopiero wtedy ściśnięcie zamieni go w ciecz.',
        'Wyścig wygrywano krok po kroku: mgiełka w 1877 roku, prawdziwa ciecz w Krakowie w 1883 roku, dzięki Polakom, i maszyny robiące ją na litry od 1895 roku.',
      ],
      sci: [
        'Gazy trwałe opierały się, bo każdy ma temperaturę krytyczną, powyżej której żadne ciśnienie go nie skropli (Thomas Andrews, 1869): 154,6 K (−118,6 °C) dla tlenu, 126,2 K (−147,0 °C) dla azotu.',
        'Cailletet i Pictet (grudzień 1877) uzyskali ulotne mgły i strugi; Wróblewski i Olszewski (Kraków, 1883) jako pierwsi utrzymali ciekły tlen w spoczynku w rurce; Linde (1895) wytwarzał ciekłe powietrze w dużych ilościach. Naczynie próżniowe, które James Dewar wynalazł w 1892 roku, utrzymuje takie ciecze w zimnie.',
      ],
    },
  },
  magnet: {
    label: 'Wielki elektromagnes',
    title: 'Kto się przyczepi, kto przeleci?',
    slider: 'Pole magnetyczne',
    tags: { lox: 'ciekły tlen', ln2: 'ciekły azot', water: 'woda' },
    hints: { pick: 'Stuknij w tlen, azot albo wodę', watch: 'Patrz na bieguny', water: 'Stuknij w wodę, żeby ją zabrać' },
    buttons: { lox: 'Ciekły tlen', ln2: 'Ciekły azot', water: 'Woda' },
    board: {
      title: 'Pole magnetyczne',
      off: 'wyłączone',
      pulled: 'wciągany',
      pushed: 'odpychana, troszeczkę',
      lox: 'Ciekły tlen',
      ln2: 'Ciekły azot',
      water: 'Woda',
      para: 'paramagnetyk',
      dia: 'diamagnetyk',
      hold: 'utrzyma {h} cm cieczy',
      dip: 'wgłębienie w powierzchni: {d} mm',
      mo: 'O2: zewnętrzne orbitale',
      unpaired: 'dwa niesparowane elektrony',
    },
    lens: { title: 'Powierzchnia wody w powiększeniu', dip: 'wgłębienie: {d} mm', scale: '1 mm', empty: 'Stuknij w wodę' },
    says: {
      lox: { kid: 'Ciekły tlen skacze do biegunów i wisi między nimi jak mały mostek! Magnes go wciąga.', sci: 'Paramagnetyk: ciekły O2 (χ ≈ +3,5 × 10⁻³) jest wciągany w najsilniejsze pole i tworzy mostek w szczelinie. Przy {b} T siła równa się ciężarowi {h} cm cieczy.' },
      loxWeak: { kid: 'Pole jest za słabe: tlen przelatuje na wylot. Podkręć magnes!', sci: 'Przy zbyt słabym polu przyciąganie magnetyczne przegrywa z grawitacją i LOX przelatuje przez szczelinę.' },
      loxFall: { kid: 'Pole jest teraz za słabe: mostek z tlenu spada!', sci: 'Pole zmniejszone: ciśnienie magnetyczne nie utrzymuje już cieczy, która spada.' },
      ln2: { kid: 'Ciekły azot przelatuje prosto w dół. Magnes wcale go nie przyciąga.', sci: 'N2 ma wszystkie elektrony sparowane: jest diamagnetykiem, odpychanym tylko bardzo słabo, więc przelatuje i wrze w 77 K.' },
      water: { kid: 'Woda jest odpychana! Ekran pokazuje wgłębienie, które magnes wciska w jej powierzchnię: {d} mm. Podkręć pole i zobacz, jak rośnie.', sci: 'Diamagnetyk: χ = −9,05 × 10⁻⁶. Pole wypycha wodę ze szczeliny, wgłębienie {d} mm przy {b} T (efekt Mojżesza), rosnące jak B².' },
      waterBack: { kid: 'Woda wraca na swoje miejsce.', sci: 'Naczynie odsunięte.' },
      boiled: { kid: 'Mostek z tlenu wyparował w powietrze.', sci: 'Odparował: każdy litr cieczy daje około 860 litrów gazu.' },
    },
    panel: {
      kid: [
        'Ten magnes to zwoje miedzianego drutu nawinięte na żelazo. Suwak puszcza przez nie więcej prądu, a pole między biegunami staje się silniejsze.',
        'Ciekły tlen jest wciągany w pole i tam wisi. Ciekły azot nie jest wciągany, więc przelatuje. A woda? Magnes ją odpycha, bardzo delikatnie: wszystko jest tak odrobinę odpychane, ale w tlenie wygrywa przyciąganie, setki razy silniejsze.',
      ],
      sci: [
        'O2 jest paramagnetykiem: jego stan podstawowy to tryplet z dwoma niesparowanymi elektronami, po jednym na każdym z dwóch orbitali π*, o równoległych spinach. Wzór Lewisa, w którym wszystkie elektrony są sparowane, tego nie pokazuje; przewiduje to teoria orbitali molekularnych. Niesparowane spiny ustawiają się zgodnie z polem, więc ciecz jest wciągana tam, gdzie pole jest najsilniejsze. Jej podatność, około +3,5 × 10⁻³, jest mniej więcej 400 razy większa niż wody i ma przeciwny znak.',
        'Diamagnetyzm jest powszechny: pole indukuje w każdej chmurze elektronowej prądy, które mu się przeciwstawiają (reguła Lenza), więc cała materia jest słabo odpychana; widać to wszędzie tam, gdzie nie przeważają niesparowane elektrony. Dla wody χ = −9,05 × 10⁻⁶: wgłębienie w powierzchni to h = |χ|B²/(2μ0ρg), poniżej milimetra przy 1,5 T. Ciekły azot też jest diamagnetykiem.',
      ],
    },
  },
  frog: {
    label: 'Lewitująca żaba',
    title: 'Żaba, która latała',
    note: 'Model: prawdziwy otwór ma 3,2 cm',
    display: 'pole',
    hints: { on: 'Stuknij w wielki magnes, żeby go włączyć', off: 'Stuknij w magnes, żeby go wyłączyć', wait: 'Patrz na żabę' },
    buttons: { on: 'Włącz: 16 tesli', off: 'Wyłącz' },
    says: {
      on: { kid: 'Włączam: 16 tesli, setki tysięcy razy silniej niż magnetyzm samej Ziemi!', sci: 'Narastanie do około 16 T (magnes Bittera, chłodzone wodą miedziane płyty).' },
      float: { kid: 'Żaba unosi się w powietrzu! Żaba to głównie woda, a ten ogromny magnes odpycha wodę tak mocno, że ją utrzymuje. Była żywa i nic jej się nie stało.', sci: 'Lewitacja: B·dB/dz musi osiągnąć μ0ρg/|χ|, około 1400 T²/m dla wody. Żaba unosi się blisko górnego końca cewki, gdzie pole maleje najszybciej. Nie stała jej się krzywda.' },
      off: { kid: 'Wyłączam: żaba łagodnie opada na swoją poduszkę.', sci: 'Pole maleje: poniżej warunku lewitacji żaba osiada.' },
      landed: { kid: 'Z powrotem na poduszce, cała i zdrowa.', sci: 'Wylądowała.' },
    },
    panel: {
      kid: [
        'Magnes odpycha wodę, bardzo słabiutko, a żaba to głównie woda. Więc z dość silnym magnesem żaba może się unosić! W 1997 roku w Nijmegen w Holandii Andre Geim sprawił, że żywa żaba unosiła się w magnesie o polu około 16 tesli. Nic jej się nie stało.',
        'Za to on i Michael Berry dostali w 2000 roku Nagrodę Ig Nobla, nagrodę za badania, które najpierw śmieszą, a potem dają do myślenia. W 2010 roku Andre Geim dostał prawdziwą Nagrodę Nobla z fizyki, za grafen: warstwy węgla grube na jeden atom. Był pierwszym człowiekiem, który zdobył obie.',
      ],
      sci: [
        'Żywa żaba lewitowała w pionowym otworze o średnicy 32 mm solenoidu Bittera przy około 16 T w Laboratorium Silnych Pól Magnetycznych w Nijmegen (Berry i Geim, „Of flying frogs and levitrons”, European Journal of Physics, 1997). Diamagnetyk unosi się tam, gdzie B·dB/dz = μ0ρg/|χ|, około 1400 T²/m dla wody, i może unosić się stabilnie, czego twierdzenie Earnshawa zabrania zwykłym magnesom samym w sobie.',
        'Andre Geim i Michael Berry podzielili się za to Nagrodą Ig Nobla z fizyki w 2000 roku; Geim dostał Nagrodę Nobla z fizyki w 2010 roku razem z Konstantinem Novoselovem, za grafen. Model jest tu około dziesięć razy większy niż w rzeczywistości.',
      ],
    },
  },
  rocket: {
    label: 'Silnik rakietowy',
    title: 'Odpal silnik',
    slider: 'Tlen na każdy kilogram nafty lotniczej',
    tanks: { fuel: 'NAFTA', lox: 'LOX' },
    hints: {
      fire: 'Stuknij w silnik, żeby go odpalić',
      burning: 'Posłuchaj, jak ryczy',
      more: 'Stuknij w zbiornik LOX, żeby dać więcej tlenu',
      less: 'Stuknij w zbiornik nafty, żeby dać mniej tlenu',
    },
    buttons: { fire: 'Ognia!', more: 'Więcej tlenu', less: 'Mniej tlenu' },
    board: {
      title: 'Mieszanka',
      per: 'kg tlenu na 1 kg nafty',
      push: 'ciąg',
      lean: 'za mało tlenu',
      good: 'w sam raz',
      rich: 'za dużo tlenu',
      stoich: 'spala wszystko',
      f1: 'Saturn V',
    },
    says: {
      lean: { kid: 'Kopci i jest słaby! Bez dość tlenu duża część nafty nie może się spalić i zamienia się w czarny dym. Daj mu więcej tlenu!', sci: 'Mieszanka bogata w paliwo przy {m}: niepełne spalanie, sadza i tlenek węgla, chłodny, dymiący, słaby płomień.' },
      ok: { kid: 'Lepiej: więcej tlenu, więcej ognia! Ale to jeszcze nie najlepsza mieszanka.', sci: 'Przy {m} impuls właściwy jeszcze nie osiągnął maksimum.' },
      good: { kid: 'Ale ryk! Przy tej mieszance płomień jest jasny i czysty, z błyszczącymi węzłami światła w środku, a ciąg jest największy.', sci: 'Blisko najlepszej mieszanki ({m}): najwyższy impuls właściwy. Jasne węzły to fale uderzeniowe w naddźwiękowym wylocie (diamenty uderzeniowe).' },
      rich: { kid: 'Za dużo tlenu! Ciąg znowu spada, a gorący tlen zaczyna palić metal samego silnika: zobacz, jak żarzy się dysza. Silniki celowo pracują z odrobiną za mało tlenu.', sci: 'Mieszanka bogata w utleniacz przy {m}: w pobliżu i powyżej stosunku stechiometrycznego (około 3,4) impuls właściwy spada, a gorący, bogaty w tlen gaz atakuje ścianki.' },
      more: { kid: 'Więcej tlenu: {m} kg na każdy kilogram nafty.', sci: 'Stosunek mieszanki O/F = {m}.' },
      less: { kid: 'Mniej tlenu: {m} kg na każdy kilogram nafty.', sci: 'Stosunek mieszanki O/F = {m}.' },
      goddard: { kid: 'Robert Goddard zbudował pierwszą rakietę na paliwo ciekłe: benzynę i ciekły tlen. 16 marca 1926 roku, na farmie swojej ciotki w Auburn w USA, leciała 2,5 sekundy i wzniosła się na 12,5 metra. Malutka, ale od niej zaczęły się wszystkie wielkie rakiety.', sci: '16 marca 1926, Auburn w Massachusetts: rakieta Goddarda spalała benzynę z ciekłym tlenem, z silnikiem na górze zasilanym rurkami ze zbiorników na dole. Leciała 2,5 s, wzniosła się na około 12,5 m (41 stóp) i spadła 56 m (184 stopy) dalej.' },
    },
    panel: {
      kid: [
        'Ogień potrzebuje tlenu. Tu na dole w powietrzu jest go mnóstwo, ale w kosmosie nie ma powietrza wcale. Dlatego rakieta zabiera własny tlen, jako ciecz, która zajmuje około 860 razy mniej miejsca niż gaz.',
        'Ten silnik spala naftę lotniczą z ciekłym tlenem. Przy za małej ilości tlenu płomień kopci i jest słaby; przy za dużej zaczyna płonąć sam silnik. Najlepsza mieszanka to około 2,3 do 2,6 kilograma tlenu na każdy kilogram nafty. Pierwszy stopień Saturna V, rakiety, która zabrała astronautów na Księżyc, spalał co sekundę około 13 ton nafty i ciekłego tlenu!',
      ],
      sci: [
        'Ciekły tlen (LOX, 90 K) to utleniacz; RP-1, oczyszczona nafta lotnicza, to paliwo. Spalenie całej nafty wymagałoby około 3,4 kg tlenu na kilogram, ale silniki pracują na mieszance bogatej w paliwo, przy masowym stosunku utleniacza do paliwa około 2,3 do 2,6, gdzie impuls właściwy jest największy: lżejsze cząsteczki spalin (CO i H2 wśród CO2 i H2O) uchodzą szybciej, a komora pracuje chłodniej.',
        'Pierwszy stopień Saturna V miał pięć silników F-1 o stosunku mieszanki 2,27, które razem spalały około 12,9 tony materiałów pędnych na sekundę. Robert Goddard wystrzelił pierwszą rakietę na ciekłe materiały pędne, benzynę i ciekły tlen, 16 marca 1926 roku w Auburn w Massachusetts.',
      ],
    },
  },
}

const DE = {
  title: 'Das Labor für flüssigen Sauerstoff',
  greet: {
    kid: 'Wir sind im Bild, in einem sehr kalten Labor! Links macht eine Maschine aus Luft eine Flüssigkeit. Rechts steht ein großer Magnet: Wer bleibt hängen, wer fällt durch? Hinter den Toren wartet ein Raketentriebwerk auf seinen Sauerstoff. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Ein Kryotechniklabor: links ein Verflüssiger nach Linde und eine Kolonne, die flüssige Luft trennt; rechts ein Elektromagnet für paramagnetischen Sauerstoff und diamagnetisches Wasser, und ein Modell des Magneten von Nijmegen, in dem ein Frosch schwebte; draußen ein Triebwerk für Kerosin und flüssigen Sauerstoff auf seinem Prüfstand. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Sauerstoffgas hat überhaupt keine Farbe. Aber im flüssigen Sauerstoff sind die Moleküle so dicht gepackt, dass immer zwei zusammen etwas rotes und gelbes Licht schlucken, und was übrig bleibt, sieht hellblau aus.',
      'Aus einem Liter flüssigem Sauerstoff werden beim Verdampfen etwa 860 Liter Sauerstoffgas. Darum bewahren Krankenhäuser und Raketen ihren Sauerstoff flüssig auf.',
      'Vorsicht hier drin: Flüssiger Sauerstoff ist so kalt, dass er Haut sofort erfrieren lässt, und Dinge wie Öl, Holz oder Stoff brennen darin heftig.',
    ],
    sci: [
      'Flüssiges O2 ist hellblau, weil Paare zusammenstoßender Moleküle rotes Licht um 630 nm absorbieren: Ein einziges Photon hebt beide Moleküle zugleich in ihren angeregten Singulettzustand.',
      'Flüssiger Sauerstoff siedet bei 90,2 K (−183,0 °C) und hat eine Dichte von 1,141 g/cm³; ein Liter ergibt bei Raumtemperatur etwa 860 Liter Gas.',
      'Argon, 0,93 % der Luft, siedet bei 87,3 K (−185,8 °C), zwischen Sauerstoff und Stickstoff: Luftzerlegungsanlagen ziehen es aus der Mitte der Kolonne ab.',
    ],
  },
  air: {
    label: 'Die Maschine für flüssige Luft',
    title: 'Flüssige Luft machen',
    slider: 'Kältester Punkt der Maschine',
    signs: { machine: 'Luftverflüssiger', column: 'Trennkolonne', lox: 'Flüssiger Sauerstoff' },
    hints: {
      run: 'Tipp die Maschine an, um sie zu starten',
      cooling: 'Schau aufs Thermometer',
      column: 'Tipp die Kolonne an, um die flüssige Luft zu trennen',
      wait: 'Schau auf die Kolonne',
      lox: 'Tipp die Sauerstoffflasche an',
    },
    buttons: { run: 'Maschine starten', off: 'Ausschalten', column: 'Trennen', lox: 'Die Sauerstoffflasche' },
    board: {
      title: 'Kältester Punkt',
      water: 'Wasser gefriert',
      co2: 'reines Trockeneis',
      o2: 'Sauerstoff siedet',
      ar: 'Argon siedet',
      air: 'flüssige Luft',
      n2: 'Stickstoff siedet',
      share: 'Sauerstoff in der Flüssigkeit: {p} %',
    },
    says: {
      start: { kid: 'Die Maschine läuft! Zusammenpressen, kühlen, ausdehnen lassen: Mit jeder Runde kommt die Luft ein bisschen kälter heraus.', sci: 'In Betrieb: Verdichten, Kühlen, dann Entspannen durch ein Ventil (der Joule-Thomson-Effekt); das kalte rückströmende Gas kühlt die einströmende Luft vor.' },
      frost: { kid: 'Unter 0 °C: Das Wasser in der Luft gefriert zu Reif an den kalten Rohren.', sci: 'Unter 0 °C schlägt sich der Wasserdampf als Reif nieder. Echte Anlagen trocknen die Luft vorher, damit Eis sie nicht verstopft.' },
      dryIce: { kid: 'Jetzt gefriert das Kohlenstoffdioxid zu feinem Trockeneisschnee.', sci: 'Kohlenstoffdioxid schlägt sich als Trockeneis nieder. Reines CO2 tut das bei −78,5 °C, aber mit 0,04 % der Luft erst unter etwa −130 °C.' },
      notYet: { kid: 'Kälter als −183 °C und immer noch kein Tropfen? In der Luft ist der Sauerstoff mit viel Stickstoff gemischt, deshalb muss es noch ein bisschen kälter werden.', sci: 'Unter dem Siedepunkt des Sauerstoffs, aber Sauerstoff ist nur 21 % des Gemischs: Bei Normaldruck beginnt Luft um −191 °C zu kondensieren.' },
      drops: { kid: 'Tropf! Die Luft ist flüssig geworden, hellblau von ihrem Sauerstoff. Die ersten Tropfen sind besonders reich an Sauerstoff, der leichter flüssig wird als Stickstoff.', sci: 'Kondensation: Die erste Flüssigkeit ist sauerstoffreicher als die Luft, weil Sauerstoff weniger flüchtig ist. Bei etwa −194 °C ist die ganze Luft flüssig.' },
      warm: { kid: 'Ausgeschaltet: Die Maschine wird wieder warm.', sci: 'Aus: Der Kaltkasten erwärmt sich auf Raumtemperatur.' },
      boiled: { kid: 'Jetzt ist es zu warm: Die flüssige Luft verdampft und wird wieder zu Luft.', sci: 'Oberhalb ihres Siedebereichs verdampft die flüssige Luft.' },
      noLiquid: { kid: 'Es gibt noch keine flüssige Luft. Mach die Maschine erst kälter: Tipp sie an oder nimm den Schieberegler!', sci: 'Noch keine Flüssigkeit in der Kolonne: Kühl die Maschine unter etwa −191 °C.' },
      sep: { kid: 'Ab in die Kolonne! Von unten etwas erwärmt, verdampft der Stickstoff zuerst: Er steigt nach oben und entweicht oben hinaus.', sci: 'Destillation: Stickstoff (77 K) ist flüchtiger und steigt als Dampf auf; Sauerstoff (90 K) läuft nach unten und sammelt sich am Boden.' },
      sepDone: { kid: 'Nur der Sauerstoff ist übrig: hellblauer flüssiger Sauerstoff! So wird Sauerstoff für Krankenhäuser, Stahlwerke und Raketen gemacht.', sci: 'Das Sumpfprodukt ist flüssiger Sauerstoff, meist 99,5 % rein oder mehr; der Stickstoff geht oben als Gas ab.' },
      lox: { kid: 'Flüssiger Sauerstoff, −183 °C. Probier ihn jetzt am großen Magneten auf der anderen Seite der Halle aus!', sci: 'LOX bei 90 K, 1,141 g/cm³. Probier ihn am Elektromagneten auf der anderen Seite der Halle aus.' },
      loxEmpty: { kid: 'Diese Flasche wartet auf Sauerstoff. Mach flüssige Luft und tipp dann die Kolonne an, um sie zu trennen.', sci: 'Leer: Trenn zuerst flüssige Luft in der Kolonne.' },
    },
    panel: {
      kid: [
        'Luft ist ein Gemisch aus Gasen: vor allem Stickstoff, etwa ein Fünftel Sauerstoff und ein wenig Wasserdampf und Kohlenstoffdioxid. Diese Maschine presst die Luft zusammen, kühlt sie und lässt sie durch ein winziges Ventil hinausströmen, wodurch sie noch kälter wird. Die kalte Luft, die zurückkommt, kühlt die Luft, die hineingeht, und so wird es Runde um Runde kälter, bis die Luft flüssig heraustropft.',
        'Unterwegs friert zuerst das Wasser aus, als Reif, dann das Kohlenstoffdioxid, als Trockeneis. Allein wird Sauerstoff bei −183 °C flüssig und Stickstoff bei −196 °C; gemischt wie in der Luft werden sie knapp unter −190 °C flüssig. Erwärm die flüssige Luft sanft, dann verdampft zuerst der Stickstoff, und der Sauerstoff bleibt. So wird Sauerstoff für Krankenhäuser, Stahlwerke und Raketen gemacht.',
      ],
      sci: [
        'Ein Hampson-Linde-Prozess: Luft verdichten, die Verdichtungswärme abführen, durch ein Ventil entspannen (Joule-Thomson-Kühlung) und das kalte entspannte Gas durch einen Gegenstrom-Wärmetauscher zurückschicken, um die einströmende Luft vorzukühlen, bis ein Teil verflüssigt. Carl von Lindes Maschine in München lieferte im Mai 1895 etwa 3 Liter flüssige Luft pro Stunde; William Hampson hatte zwei Wochen vorher in England ein Patent auf denselben Prozess angemeldet.',
        'Wasser und Kohlenstoffdioxid würden gefrieren und die Wärmetauscher verstopfen, darum entfernen Anlagen sie zuerst. Reines CO2 sublimiert bei −78,5 °C, aber mit 0,04 % der Luft friert es erst unter etwa −130 °C aus. Bei Normaldruck bildet sich flüssige Luft zwischen etwa −191 und −194 °C. Sauerstoff siedet bei 90,2 K (−183,0 °C), Argon bei 87,3 K, Stickstoff bei 77,4 K (−195,8 °C): In einer Destillationskolonne steigt der Stickstoff auf, und fast reiner flüssiger Sauerstoff sammelt sich am Boden.',
      ],
    },
  },
  firsts: {
    label: 'Wer war zuerst?',
    title: 'Das Rennen um flüssigen Sauerstoff',
    hints: { tap: 'Tipp ein Glasrohr an, um seine Geschichte zu hören' },
    buttons: { a: '1877: ein Nebel', b: '1883: eine Flüssigkeit', c: '1895: literweise' },
    says: {
      a: { kid: '1877. In Frankreich presste Louis Cailletet Sauerstoff stark zusammen, kühlte ihn und ließ ihn dann auf einmal los. Für einen Augenblick erschien in seinem Rohr ein Nebel aus winzigen Tröpfchen, dann war er weg. In Genf schaffte es Raoul Pictet in denselben Wochen.', sci: 'Dezember 1877: Louis Cailletet entspannte kalten, verdichteten Sauerstoff und sah einen flüchtigen Tröpfchennebel; Raoul Pictet in Genf, der mit einer Kaskade aus Schwefeldioxid und Kohlenstoffdioxid kühlte, sah beim Ablassen des Drucks einen Flüssigkeitsstrahl. Beides wurde am 24. Dezember 1877 in der Pariser Akademie der Wissenschaften bekanntgegeben.' },
      b: { kid: '1883. In Krakau machten Zygmunt Wróblewski und Karol Olszewski als Erste flüssigen Sauerstoff, der in ihrem Rohr blieb: eine echte Flüssigkeit, die man sehen konnte, mit eigener Oberfläche. Ein paar Tage später verflüssigten sie auch Stickstoff.', sci: 'Frühjahr 1883, Jagiellonen-Universität Krakau: Wróblewski und Olszewski kühlten Sauerstoff mit flüssigem Ethylen, das unter vermindertem Druck siedete, unter die kritische Temperatur des Sauerstoffs (−118,6 °C) und sahen ihn als Flüssigkeit mit Meniskus: die erste messbare Menge. Stickstoff folgte am 13. April 1883.' },
      c: { kid: '1895. In München baute Carl von Linde eine Maschine, die flüssige Luft nicht tropfenweise machte, sondern literweise: etwa 3 Liter pro Stunde. Maschinen wie seine machen bis heute unseren Sauerstoff.', sci: 'Mai 1895, München: Lindes kontinuierlicher Verflüssiger, Joule-Thomson-Entspannung mit Gegenstrom-Wärmetauscher, lieferte etwa 3 Liter flüssige Luft pro Stunde. William Hampson hatte zwei Wochen vorher, am 23. Mai 1895, ein Patent auf denselben Prozess angemeldet.' },
    },
    panel: {
      kid: [
        'Lange dachte man, Sauerstoff, Stickstoff und Wasserstoff könne man niemals flüssig machen, und nannte sie die permanenten Gase. Nur Zusammenpressen half nie: Ein Gas muss zuerst unter seine ganz eigene Temperatur gekühlt werden (beim Sauerstoff −119 °C), erst dann macht Pressen eine Flüssigkeit daraus.',
        'Das Rennen wurde Schritt für Schritt gewonnen: ein Nebel 1877, eine echte Flüssigkeit in Krakau 1883 und Maschinen, die sie ab 1895 literweise machten.',
      ],
      sci: [
        'Die permanenten Gase widerstanden, weil jedes eine kritische Temperatur hat, oberhalb der kein Druck es verflüssigt (Thomas Andrews, 1869): 154,6 K (−118,6 °C) für Sauerstoff, 126,2 K (−147,0 °C) für Stickstoff.',
        'Cailletet und Pictet (Dezember 1877) erhielten flüchtige Nebel und Strahlen; Wróblewski und Olszewski (Krakau, 1883) hielten flüssigen Sauerstoff ruhend in einem Rohr; Linde (1895) machte flüssige Luft in Mengen. Das Vakuumgefäß, das James Dewar 1892 erfand, hält solche Flüssigkeiten kalt.',
      ],
    },
  },
  magnet: {
    label: 'Der große Elektromagnet',
    title: 'Wer bleibt hängen, wer fällt durch?',
    slider: 'Magnetfeld',
    tags: { lox: 'flüssiger Sauerstoff', ln2: 'flüssiger Stickstoff', water: 'Wasser' },
    hints: { pick: 'Tipp den Sauerstoff, den Stickstoff oder das Wasser an', watch: 'Schau auf die Pole', water: 'Tipp das Wasser an, um es zurückzuholen' },
    buttons: { lox: 'Flüssiger Sauerstoff', ln2: 'Flüssiger Stickstoff', water: 'Wasser' },
    board: {
      title: 'Magnetfeld',
      off: 'ausgeschaltet',
      pulled: 'hineingezogen',
      pushed: 'weggedrückt, ganz wenig',
      lox: 'Flüssiger Sauerstoff',
      ln2: 'Flüssiger Stickstoff',
      water: 'Wasser',
      para: 'paramagnetisch',
      dia: 'diamagnetisch',
      hold: 'trägt {h} cm Flüssigkeit',
      dip: 'Delle in der Oberfläche: {d} mm',
      mo: 'O2: die äußeren Orbitale',
      unpaired: 'zwei ungepaarte Elektronen',
    },
    lens: { title: 'Wasseroberfläche, vergrößert', dip: 'Delle: {d} mm', scale: '1 mm', empty: 'Tipp das Wasser an' },
    says: {
      lox: { kid: 'Der flüssige Sauerstoff springt zu den Polen und hängt dazwischen wie eine kleine Brücke! Der Magnet zieht ihn an.', sci: 'Paramagnetisch: Flüssiges O2 (χ ≈ +3,5 × 10⁻³) wird ins stärkste Feld gezogen und überbrückt den Spalt. Bei {b} T entspricht die Kraft dem Gewicht von {h} cm Flüssigkeit.' },
      loxWeak: { kid: 'Das Feld ist zu schwach: Der Sauerstoff fällt einfach durch. Dreh den Magneten auf!', sci: 'Bei zu schwachem Feld verliert die magnetische Anziehung gegen die Schwerkraft, und der LOX läuft durch den Spalt.' },
      loxFall: { kid: 'Du hast das Feld heruntergedreht: Die Sauerstoffbrücke fällt!', sci: 'Feld verringert: Der magnetische Druck hält die Flüssigkeit nicht mehr, sie fällt.' },
      ln2: { kid: 'Flüssiger Stickstoff fließt glatt hindurch. Der Magnet zieht ihn überhaupt nicht an.', sci: 'N2 hat alle Elektronen gepaart: Es ist diamagnetisch, wird nur sehr schwach abgestoßen, fließt also durch und siedet bei 77 K.' },
      water: { kid: 'Wasser wird weggedrückt! Der Bildschirm zeigt die Delle, die der Magnet in seine Oberfläche drückt: {d} mm tief. Dreh das Feld auf und sieh zu, wie sie wächst.', sci: 'Diamagnetisch: χ = −9,05 × 10⁻⁶. Das Feld drückt das Wasser aus dem Spalt, eine Delle von {d} mm bei {b} T (der Moses-Effekt), wachsend mit B².' },
      waterBack: { kid: 'Das Wasser geht zurück an seinen Platz.', sci: 'Schale zurückgezogen.' },
      boiled: { kid: 'Die Sauerstoffbrücke ist in die Luft verdampft.', sci: 'Verdampft: Jeder Liter Flüssigkeit wird zu etwa 860 Litern Gas.' },
    },
    panel: {
      kid: [
        'Dieser Magnet besteht aus Spulen aus Kupferdraht, um Eisen gewickelt. Der Schieberegler schickt mehr Strom hindurch, und das Feld zwischen den Polen wird stärker.',
        'Flüssiger Sauerstoff wird ins Feld gezogen und hängt dort. Flüssiger Stickstoff wird nicht angezogen und fällt durch. Und Wasser? Der Magnet drückt es weg, ganz sanft: Alles wird ein bisschen so weggedrückt, aber beim Sauerstoff gewinnt die Anziehung, Hunderte Male stärker.',
      ],
      sci: [
        'O2 ist paramagnetisch: Sein Grundzustand ist ein Triplett mit zwei ungepaarten Elektronen, je eines in den beiden π*-Orbitalen, mit parallelen Spins. Die Lewis-Formel, in der alle Elektronen gepaart sind, kann das nicht zeigen; die Molekülorbitaltheorie sagt es voraus. Die ungepaarten Spins richten sich nach dem Feld aus, deshalb wird die Flüssigkeit dorthin gezogen, wo das Feld am stärksten ist. Ihre Suszeptibilität, etwa +3,5 × 10⁻³, ist rund 400-mal so groß wie die von Wasser, mit umgekehrtem Vorzeichen.',
        'Diamagnetismus ist universell: Ein Feld induziert in jeder Elektronenwolke Ströme, die ihm entgegenwirken (lenzsche Regel), deshalb wird alle Materie schwach abgestoßen; man sieht es überall, wo ihn keine ungepaarten Elektronen überwiegen. Für Wasser ist χ = −9,05 × 10⁻⁶: Die Delle in der Oberfläche ist h = |χ|B²/(2μ0ρg), unter einem Millimeter bei 1,5 T. Flüssiger Stickstoff ist auch diamagnetisch.',
      ],
    },
  },
  frog: {
    label: 'Der schwebende Frosch',
    title: 'Der Frosch, der flog',
    note: 'Modell: Das echte Loch ist 3,2 cm weit',
    display: 'Feld',
    hints: { on: 'Tipp den großen Magneten an, um ihn einzuschalten', off: 'Tipp den Magneten an, um ihn auszuschalten', wait: 'Schau auf den Frosch' },
    buttons: { on: 'Einschalten: 16 Tesla', off: 'Ausschalten' },
    says: {
      on: { kid: 'Einschalten: 16 Tesla, Hunderttausende Male stärker als der Magnetismus der Erde selbst!', sci: 'Hochfahren auf etwa 16 T (ein Bitter-Magnet aus wassergekühlten Kupferplatten).' },
      float: { kid: 'Der Frosch schwebt! Ein Frosch besteht vor allem aus Wasser, und dieser riesige Magnet drückt Wasser so stark weg, dass er ihn tragen kann. Er war lebendig und überhaupt nicht verletzt.', sci: 'Schweben: B·dB/dz muss μ0ρg/|χ| erreichen, etwa 1400 T²/m für Wasser. Der Frosch schwebt nahe dem oberen Ende der Spule, wo das Feld am schnellsten abfällt. Er blieb unversehrt.' },
      off: { kid: 'Ausschalten: Der Frosch sinkt sanft zurück auf sein Kissen.', sci: 'Feld fährt herunter: Unterhalb der Schwebebedingung setzt der Frosch auf.' },
      landed: { kid: 'Zurück auf dem Kissen, gesund und munter.', sci: 'Gelandet.' },
    },
    panel: {
      kid: [
        'Ein Magnet drückt Wasser weg, ganz, ganz schwach, und ein Frosch besteht vor allem aus Wasser. Mit einem Magneten, der stark genug ist, kann ein Frosch also schweben! 1997 ließ Andre Geim in Nijmegen in den Niederlanden einen lebenden Frosch in einem Magneten von etwa 16 Tesla schweben. Er wurde nicht verletzt.',
        'Dafür bekamen er und Michael Berry im Jahr 2000 den Ig-Nobelpreis, einen Preis für Forschung, die erst zum Lachen und dann zum Nachdenken bringt. 2010 bekam Andre Geim einen echten Nobelpreis für Physik, für Graphen: Kohlenstoffschichten, nur ein Atom dick. Er war der Erste, der beide gewann.',
      ],
      sci: [
        'Ein lebender Frosch schwebte in der 32-mm-Bohrung eines senkrechten Bitter-Solenoids bei etwa 16 T im Hochfeld-Magnetlabor Nijmegen (Berry und Geim, „Of flying frogs and levitrons“, European Journal of Physics, 1997). Ein Diamagnet schwebt dort, wo B·dB/dz = μ0ρg/|χ|, etwa 1400 T²/m für Wasser, und er kann stabil schweben, was das Earnshaw-Theorem gewöhnlichen Magneten allein verbietet.',
        'Andre Geim und Michael Berry teilten sich dafür den Ig-Nobelpreis für Physik 2000; Geim teilte sich den Nobelpreis für Physik 2010 mit Konstantin Novoselov, für Graphen. Das Modell hier ist etwa zehnmal so groß wie das Original.',
      ],
    },
  },
  rocket: {
    label: 'Das Raketentriebwerk',
    title: 'Zünde das Triebwerk',
    slider: 'Sauerstoff je Kilogramm Kerosin',
    tanks: { fuel: 'KEROSIN', lox: 'LOX' },
    hints: {
      fire: 'Tipp das Triebwerk an, um es zu zünden',
      burning: 'Hör, wie es brüllt',
      more: 'Tipp den LOX-Tank an für mehr Sauerstoff',
      less: 'Tipp den Kerosintank an für weniger Sauerstoff',
    },
    buttons: { fire: 'Zünden!', more: 'Mehr Sauerstoff', less: 'Weniger Sauerstoff' },
    board: {
      title: 'Die Mischung',
      per: 'kg Sauerstoff je 1 kg Kerosin',
      push: 'Schub',
      lean: 'zu wenig Sauerstoff',
      good: 'genau richtig',
      rich: 'zu viel Sauerstoff',
      stoich: 'verbrennt alles',
      f1: 'Saturn V',
    },
    says: {
      lean: { kid: 'Rußig und schwach! Ohne genug Sauerstoff kann ein großer Teil des Kerosins nicht verbrennen und wird zu schwarzem Rauch. Gib ihm mehr Sauerstoff!', sci: 'Brennstoffreich bei {m}: unvollständige Verbrennung, Ruß und Kohlenstoffmonoxid, eine kühle, rauchige, schwache Flamme.' },
      ok: { kid: 'Besser: mehr Sauerstoff, mehr Feuer! Aber es ist noch nicht die beste Mischung.', sci: 'Bei {m} hat der spezifische Impuls sein Maximum noch nicht erreicht.' },
      good: { kid: 'Was für ein Brüllen! Bei dieser Mischung ist die Flamme hell und klar, mit leuchtenden Lichtknoten darin, und der Schub ist am stärksten.', sci: 'Nahe der besten Mischung ({m}): der höchste spezifische Impuls. Die hellen Knoten sind Stoßwellen im Überschallstrahl (Schockdiamanten).' },
      rich: { kid: 'Zu viel Sauerstoff! Der Schub sinkt wieder, und heißer Sauerstoff fängt an, das Metall des Triebwerks selbst zu verbrennen: Sieh, wie die Düse glüht. Triebwerke laufen absichtlich mit etwas zu wenig Sauerstoff.', sci: 'Oxidatorreich bei {m}: in der Nähe und jenseits des stöchiometrischen Verhältnisses (etwa 3,4) fällt der spezifische Impuls, und heißes, sauerstoffreiches Gas greift die Wände an.' },
      more: { kid: 'Mehr Sauerstoff: {m} kg für jedes Kilogramm Kerosin.', sci: 'Mischungsverhältnis O/F = {m}.' },
      less: { kid: 'Weniger Sauerstoff: {m} kg für jedes Kilogramm Kerosin.', sci: 'Mischungsverhältnis O/F = {m}.' },
      goddard: { kid: 'Robert Goddard baute die erste Rakete, die flüssigen Treibstoff verbrannte: Benzin und flüssigen Sauerstoff. Am 16. März 1926 flog sie auf der Farm seiner Tante in Auburn, USA, 2,5 Sekunden lang und stieg 12,5 Meter hoch. Klein, aber dort fingen alle großen Raketen an.', sci: '16. März 1926, Auburn, Massachusetts: Goddards Rakete verbrannte Benzin mit flüssigem Sauerstoff, das Triebwerk oben, gespeist über Rohre aus den Tanks darunter. Sie flog 2,5 s, stieg etwa 12,5 m (41 Fuß) und landete 56 m (184 Fuß) entfernt.' },
    },
    panel: {
      kid: [
        'Feuer braucht Sauerstoff. Hier unten hat die Luft genug davon, aber im Weltraum gibt es überhaupt keine Luft. Darum nimmt eine Rakete ihren eigenen Sauerstoff mit, flüssig, denn so braucht er etwa 860-mal weniger Platz als das Gas.',
        'Dieses Triebwerk verbrennt Kerosin mit flüssigem Sauerstoff. Mit zu wenig Sauerstoff ist die Flamme rußig und schwach; mit zu viel fängt das Triebwerk selbst an zu brennen. Die beste Mischung sind etwa 2,3 bis 2,6 Kilogramm Sauerstoff für jedes Kilogramm Kerosin. Die erste Stufe der Saturn V, der Rakete, die Astronauten zum Mond brachte, verbrannte jede Sekunde etwa 13 Tonnen Kerosin und flüssigen Sauerstoff!',
      ],
      sci: [
        'Flüssiger Sauerstoff (LOX, 90 K) ist der Oxidator; RP-1, ein raffiniertes Kerosin, der Brennstoff. Um das ganze Kerosin zu verbrennen, bräuchte man etwa 3,4 kg Sauerstoff je Kilogramm, doch Triebwerke laufen brennstoffreich, bei einem Massenverhältnis von Oxidator zu Brennstoff von etwa 2,3 bis 2,6, wo der spezifische Impuls am höchsten ist: Leichtere Abgasmoleküle (CO und H2 zwischen CO2 und H2O) strömen schneller aus, und die Brennkammer bleibt kühler.',
        'Die erste Stufe der Saturn V hatte fünf F-1-Triebwerke mit einem Mischungsverhältnis von 2,27, die zusammen etwa 12,9 Tonnen Treibstoff pro Sekunde verbrannten. Robert Goddard startete am 16. März 1926 in Auburn, Massachusetts, die erste Rakete mit flüssigen Treibstoffen, Benzin und flüssigem Sauerstoff.',
      ],
    },
  },
}

export const MAGNET_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
