// The words of hydrogen's fuel room ("What engine puffs out only water?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/H.js (the easel shows it). Oxygen's magnet room already fires a rocket engine and
// oxygen's water room splits water, so this room is about joining them again: the fuel cell, the bus, the
// train, and hydrogen in spaceflight.
// Sources (checked 2026-10-31): 2 H2 + O2 -> 2 H2O, 285.8 kJ per mole of liquid water and 241.8 to vapour
// (142 and 120 MJ/kg), ΔG = −237.1 kJ/mol (1.23 V), 1.48 V for the whole enthalpy; petrol about 46 MJ/kg;
// hydrogen at 700 bar about 40 g/L, liquid 71 g/L; PEM cells at 60 to 80 °C, 0.6 to 0.8 V under load,
// efficiency 40 to 60% (the board's figure); Grove 1839; Gemini 5 (August 1965) flew General Electric's
// PEM cells, the first fuel cells in space. Buses: 350 bar (cars 700), a 12 m bus carries about 35 to
// 38 kg (Solaris Urbino 12 hydrogen: 37.5 kg), and the JIVE projects' fleets averaged 8.05 (JIVE 1) and
// 7.49 kg per 100 km (JIVE 2), so the room uses 8. 1 kg of H2 gives 8.94 kg of water. Coradia iLint
// (Alstom): passenger service from September 2018, Cuxhaven, Bremerhaven, Bremervörde, Buxtehude (the
// words give the month, not the day); a fuel cell module and hydrogen tanks on each car's roof, lithium-ion
// batteries below, 140 km/h; 14 trains and the Linde filling station at Bremervörde, regular service from
// August 2022 (Railway Gazette). Space Shuttle: RS-25 start 6.6 s before the boosters, mixture ratio about
// 6:1 (stoichiometric 7.9), the sound suppression water; external tank about 1.5 million litres of liquid
// hydrogen (the board). Apollo: three Pratt & Whitney fuel cells of Bacon's alkaline type in the service
// module, 31 cells each, 27 to 31 V, normally 563 to 1420 W, about 83% potassium hydroxide at about 400 °F
// (204 °C); fuel cell water was the command module's drinking water, any surplus dumped overboard; the
// first command modules' water held excess hydrogen, and from Apollo 12 a palladium-silver separator took it
// out (NASA TN D-7291, "Apollo Experience Report: Potable Water System"). Not said, as sources disagree or
// are informal: the astronauts' complaints about the gas, the iLint's range.

const EN = {
  title: 'The hydrogen station',
  greet: {
    kid: "We are inside the picture, at a hydrogen filling station! On the left a giant fuel cell, cut open so you can see inside. On the right a bus that runs on hydrogen, and behind it a hydrogen train. In the glass case: hydrogen in space. The picture's story is on the easel.",
    sci: "A hydrogen filling station at dusk beside a railway in Lower Saxony. On the left a proton exchange membrane fuel cell, cut open and hugely enlarged; on the right a 350 bar pump and a fuel cell bus; behind them a Coradia iLint, the hydrogen train; in the case, hydrogen in spaceflight: the Space Shuttle's main engines and Apollo's alkaline fuel cells. The picture's story is on the easel.",
  },
  talk: {
    kid: [
      'I am the smallest and lightest atom of all: one proton and one electron. Hydrogen is so light that a whole tank of this bus, enough for over 400 km, weighs about as much as a ten-year-old!',
      'When I join with oxygen, I become water. That is all: no smoke, no soot. That is why the bus only drips.',
      'To fit enough of me in a tank, I must be squeezed very hard: in this bus to about 350 times the pressure of the air around you. Cars squeeze me even harder, 700 times.',
    ],
    sci: [
      'Per kilogram, hydrogen holds about 142 MJ (120 MJ if the water leaves as vapour), some three times as much as petrol. Per litre it is the other way round: even at 700 bar a litre holds only about 40 g.',
      "A fuel cell is not a heat engine, so the Carnot limit does not apply: it turns the reaction's Gibbs energy (237 kJ/mol, 1.23 V per cell) directly into electricity. Losses at the electrodes bring a working cell down to 0.6 to 0.8 V.",
      'Most hydrogen today is still made from natural gas, which releases carbon dioxide. Made from water with electricity from wind or sunlight, it is called green hydrogen.',
    ],
  },
  cell: {
    label: 'The giant fuel cell',
    title: 'Inside a fuel cell',
    slider: { kid: 'The road', sci: 'Load (current density)' },
    road: { flat: 'flat road', gentle: 'gentle hill', steep: 'steep hill' },
    signs: { h2: 'Hydrogen', membrane: 'Membrane', air: 'Air', platinum: 'platinum', water: 'water', anode: 'anode (−)', cathode: 'cathode (+)', meter: 'electricity' },
    hints: { h2: 'Tap the hydrogen bottle', air: 'Tap the air intake', run: 'Try a steep hill' },
    buttons: { h2: 'Hydrogen valve', air: 'Air intake' },
    says: {
      h2On: { kid: 'Hydrogen flows in: lots of little H₂ molecules. But nothing happens yet: on the other side there is no oxygen to take them. Tap the air intake!', sci: 'H₂ fills the anode channel. With no oxygen at the cathode there is no reaction and no current.' },
      airOn: { kid: 'Air blows in, and its oxygen waits on the right. Now it needs hydrogen: tap the bottle!', sci: 'Air fills the cathode channel. With no hydrogen at the anode, nothing reacts.' },
      both: { kid: 'Both gases are in. Watch the platinum!', sci: 'Fuel and oxidant both present: the reaction starts.' },
      go: { kid: 'It works! At the platinum each hydrogen molecule splits. Its two protons slip through the green membrane; its two electrons cannot, so they run round the wire and light the bulb. On the far side they all meet oxygen and make water.', sci: 'Anode: H₂ → 2 H⁺ + 2 e⁻ on platinum. The membrane conducts protons only, so the electrons take the outer circuit, through the load. Cathode: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O.' },
      h2Off: { kid: 'Hydrogen off: the cell uses up what is left, then the bulb goes out.', sci: 'Fuel closed: the H₂ left in the channel is used up, then the current stops.' },
      airOff: { kid: 'Air off: once the last oxygen is used up, everything stops.', sci: 'Air closed: once the O₂ in the channel is used, the reaction stops.' },
      steep: { kid: 'Up a steep hill the motor needs more electricity: more hydrogen splits every second, the bulb shines brighter and more water drips out.', sci: 'Higher current density: more H₂ used per second (two electrons each), more water, and a lower cell voltage (resistance and electrode losses), so a little less efficiency.' },
      flat: { kid: 'On a flat road the bus needs less: the fuel cell slows down and saves hydrogen.', sci: 'Light load: a small current, a higher cell voltage, the best efficiency.' },
    },
    panel: {
      kid: [
        "A fuel cell joins hydrogen and oxygen without any flame. Hydrogen comes in on the left, air on the right, and in the middle is a thin sheet of a special plastic, the membrane, which lets only the hydrogen's protons through.",
        'The electrons are left behind, so they take the long way round, through the wire, and on their way they light the bulb (in the bus they turn the motor). On the right, protons, electrons and oxygen meet and make water: the only thing that comes out.',
      ],
      sci: [
        'A proton exchange membrane (PEM) fuel cell. At the anode, platinum on carbon splits H₂ into protons and electrons; the membrane, a wet sulfonated fluoropolymer such as Nafion, often thinner than paper, conducts only protons; at the cathode, oxygen from the air takes the protons and the electrons from the outer circuit: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O. It works at about 60 to 80 °C.',
        "One cell gives at most 1.23 V (ΔG = −237 kJ/mol); under load 0.6 to 0.8 V, so vehicles stack hundreds of cells. Efficiency is about 40 to 60%; the rest becomes heat. William Grove showed the principle in 1839; the first fuel cells in space were General Electric's PEM cells on Gemini 5, in 1965.",
      ],
    },
  },
  bus: {
    label: 'The hydrogen bus',
    title: 'Fill up, drive, count the water',
    slider: 'Next trip',
    signs: { measure: 'Water from the bus', rule: '1 kg of hydrogen makes 9 litres of water' },
    hints: { fill: 'Tap the nozzle to fill up', drive: 'Tap the bus to drive', away: 'Watch the road', filling: 'Watch the pressure', pouring: 'Watch the flowers', empty: 'Tap the measure to empty it' },
    buttons: { fill: 'Fill up', drive: 'Drive', empty: 'Empty the measure' },
    board: { title: 'Hydrogen', pressure: 'tank pressure', tank: 'In the tank', next: 'Next trip', driving: 'Driving', uses: 'uses {kg} kg of hydrogen', makes: 'makes {l} L of water', last: 'Last trip: {km} km · {kg} kg · {l} L', sci: '8 kg per 100 km · 1 kg H₂ gives 8.9 kg H₂O' },
    says: {
      fill: { kid: "Click! The nozzle locks on and hydrogen rushes into the tanks on the roof, squeezed to 350 times the air's pressure. Cars squeeze theirs even harder, to 700.", sci: 'Filling to 350 bar, the usual pressure for buses (cars use 700 bar): about 35 kg of H₂ in carbon-fibre tanks on the roof.' },
      filled: { kid: 'Full! 35 kg of hydrogen. Now tap the bus to go for a drive.', sci: 'Full: 35 kg at 350 bar. Choose a trip with the slider, then tap the bus.' },
      full: { kid: 'The tank is already full. Tap the bus to drive!', sci: 'Tank full (35 kg, 350 bar).' },
      low: { kid: 'Not enough hydrogen for {km} km: only {kg} kg left. Tap the nozzle to fill up, or choose a shorter trip.', sci: '{kg} kg of H₂ is not enough for {km} km at about 8 kg per 100 km: refuel, or shorten the trip.' },
      overflow: { kid: 'The measure would overflow! Tap it to give the water to the flowers first.', sci: 'The measure holds 300 L: empty it first.' },
      drive: { kid: 'Off it goes, quiet as a whisper: the motor is electric, and the fuel cell makes the electricity. Watch what drips out!', sci: 'The fuel cell feeds an electric motor; a battery helps when it speeds up and stores energy when it brakes. The only exhaust is water, as vapour and drops.' },
      back: { kid: 'Back after {km} km! It used {kg} kg of hydrogen and made {l} litres of water. Look at the measure!', sci: "{km} km: {kg} kg of H₂ used, {l} L of water made, 9 times the hydrogen's mass." },
      pour: { kid: 'For the flowers: {l} litres of clean water, made from {kg} kg of hydrogen and oxygen from the air.', sci: '{l} L of water from {kg} kg of H₂. Fuel cell water is very pure, close to distilled water.' },
      pourEmpty: { kid: 'The measure is empty. Drive the bus to fill it!', sci: 'Empty: drive a trip first.' },
    },
    panel: {
      kid: [
        'This bus has no diesel engine. On its roof are tanks of hydrogen, and inside a fuel cell turns it into electricity for the motor. Filling up takes a few minutes.',
        "For every kilogram of hydrogen it uses, the bus makes 9 litres of water. That much, because the water's oxygen comes from the air: an oxygen atom weighs as much as 16 hydrogen atoms. About 8 kg of hydrogen take the bus 100 km and make about 72 litres of water. Here we catch it in the measure; on the road it drips away or floats off as vapour.",
      ],
      sci: [
        "A 12 m fuel cell bus carries about 35 kg of H₂ at 350 bar in carbon-fibre tanks on its roof and uses about 7 to 9 kg per 100 km (Europe's JIVE projects averaged about 7.5 to 8). A battery works with the fuel cell: it takes back energy when braking and helps when accelerating.",
        '2 H₂ + O₂ → 2 H₂O: 4 g of hydrogen and 32 g of oxygen make 36 g of water, so 1 kg of H₂ gives about 9 kg (8.9 kg) of water. At 8 kg per 100 km that is about 72 L per 100 km, most of it leaving as vapour. Fuel cell water is very pure, close to distilled water.',
      ],
    },
  },
  train: {
    label: 'The hydrogen train',
    title: 'The Coradia iLint',
    signs: { tanks: 'Hydrogen tanks', cell: 'Fuel cell', battery: 'Batteries' },
    hints: { open: 'Tap the train to look inside', close: 'Tap the train to close its roof' },
    buttons: { open: 'Look inside', close: 'Close the roof' },
    says: {
      open: { kid: "Look at its roof: tanks of hydrogen and a fuel cell, like the bus's but bigger. Under the floor, batteries. And no wires above the track: the train makes its own electricity.", sci: 'Each car has hydrogen tanks and a fuel cell module on its roof and lithium-ion batteries under the floor, which store braking energy; electric motors drive it, up to 140 km/h. The only emission is water.' },
      close: { kid: 'Roof closed.', sci: 'Fairing closed.' },
    },
    panel: {
      kid: [
        'The Coradia iLint was the first train in the world to carry passengers using hydrogen. Since 2018 it has run in Lower Saxony, in northern Germany, on lines with no electric wires above the track, where only diesel trains could run before.',
        'Only water comes out of it, and it is much quieter than a diesel train.',
      ],
      sci: [
        "Alstom's Coradia iLint entered passenger service in September 2018 between Cuxhaven, Bremerhaven, Bremervörde and Buxtehude, a line without electrification. In 2022 a fleet of 14 took over the line, filled at Bremervörde at the first hydrogen filling station for passenger trains.",
        'Each of its two cars has a fuel cell module and hydrogen tanks on the roof and lithium-ion batteries below; the batteries store braking energy and help when accelerating. Top speed 140 km/h.',
      ],
    },
  },
  space: {
    label: 'Hydrogen in space',
    title: 'Hydrogen in space',
    signs: { plate: 'Hydrogen in space', shuttle: 'Space Shuttle (model)', cell: 'Apollo fuel cell, real size', csm: 'Apollo spacecraft (model)', bag: 'drinking water' },
    hints: { shuttle: 'Tap the Shuttle', cell: 'Tap the Apollo fuel cell', bag: 'Tap the water bag', any: 'Tap the Shuttle, the fuel cell or the bag' },
    buttons: { shuttle: "Start the Shuttle's engines", cell: 'Run the fuel cell', bag: 'Look at the water' },
    says: {
      shuttle: { kid: 'Main engine start! Its three engines burn liquid hydrogen with liquid oxygen. The flames are pale blue, almost invisible, and the clouds are steam: water!', sci: "RS-25 start, 6.6 s before the boosters: liquid hydrogen and liquid oxygen at about 6 to 1 by mass, rich in fuel, so the exhaust is mostly superheated steam with some unburnt hydrogen. Much of the great white cloud was the pad's sound suppression water, turned to steam." },
      cell: { kid: "The fuel cell hums: hydrogen and oxygen from the spacecraft's tanks make electricity and water. The water goes up to the astronauts.", sci: "One of three Pratt & Whitney alkaline fuel cells: 31 cells in series, about 27 to 31 V, normally up to about 1.4 kW each, running at about 200 °C on concentrated potassium hydroxide. The water it made was piped to the command module's drinking water tank." },
      bag: { kid: 'Look at the bubbles! The water of the first Apollo flights had hydrogen gas in it. Hydrogen is not poisonous, but a drink full of bubbles is not nice, so from Apollo 12 on a separator took the gas out.', sci: "The first command modules' water carried excess hydrogen gas. From Apollo 12 a separator, palladium-silver tubes through which hydrogen diffuses, took it out and vented it to space." },
      bagEmpty: { kid: 'The bag is empty. Tap the fuel cell to make some water!', sci: 'Empty: run the fuel cell first.' },
    },
    panel: {
      kid: [
        "Hydrogen is the lightest fuel of all, so rockets love it. The Space Shuttle's big orange tank held liquid hydrogen at −253 °C, and its three main engines burned it with liquid oxygen. What came out was mostly steam.",
        "Apollo's mother ship, which carried the astronauts to the Moon and back, got its electricity from three fuel cells, which joined hydrogen and oxygen quietly. The water they made was the astronauts' drinking water, more than they could drink; the rest was let out into space.",
      ],
      sci: [
        "The Shuttle's three RS-25 main engines burned liquid hydrogen and liquid oxygen from the external tank; its two boosters burned solid propellant. Per kilogram, hydrogen gives more energy than any other chemical fuel, but it is bulky: liquid hydrogen weighs only about 71 g per litre.",
        "Each Apollo service module carried three Pratt & Whitney fuel cells of Francis Thomas Bacon's design: alkaline cells, in which hydroxide ions (OH⁻) cross the electrolyte instead of protons, so the water forms on the hydrogen side. Fed from cryogenic tanks, they powered the spacecraft and made its drinking water; any surplus was dumped overboard.",
      ],
    },
  },
}

const PT = {
  title: 'A estação de hidrogénio',
  greet: {
    kid: 'Estamos dentro da imagem, num posto de abastecimento de hidrogénio! À esquerda, uma pilha de combustível gigante, aberta para se ver por dentro. À direita, um autocarro que anda a hidrogénio e, atrás dele, um comboio a hidrogénio. Na vitrine: o hidrogénio no espaço. A história da imagem está no cavalete.',
    sci: 'Um posto de abastecimento de hidrogénio ao anoitecer, junto a uma linha de comboio na Baixa Saxónia. À esquerda, uma pilha de combustível de membrana de troca de protões, aberta e muito ampliada; à direita, uma bomba de 350 bar e um autocarro com pilha de combustível; atrás, um Coradia iLint, o comboio a hidrogénio; na vitrine, o hidrogénio nos voos espaciais: os motores principais do vaivém espacial e as pilhas de combustível alcalinas da Apollo. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'Sou o átomo mais pequeno e mais leve de todos: um protão e um eletrão. O hidrogénio é tão leve que um depósito inteiro deste autocarro, que chega para mais de 400 km, pesa mais ou menos o mesmo que uma criança de dez anos!',
      'Quando me junto ao oxigénio, transformo-me em água. Só isso: nem fumo, nem fuligem. É por isso que do autocarro só pinga água.',
      'Para caber bastante de mim num depósito, tenho de ser muito apertado: neste autocarro, a cerca de 350 vezes a pressão do ar à tua volta. Os carros apertam-me ainda mais, 700 vezes.',
    ],
    sci: [
      'Por quilograma, o hidrogénio guarda cerca de 142 MJ (120 MJ se a água sair como vapor), umas três vezes mais do que a gasolina. Por litro é ao contrário: mesmo a 700 bar, um litro tem só cerca de 40 g.',
      'Uma pilha de combustível não é uma máquina térmica, por isso o limite de Carnot não se aplica: transforma a energia de Gibbs da reação (237 kJ/mol, 1,23 V por célula) diretamente em eletricidade. As perdas nos elétrodos baixam uma célula em funcionamento para 0,6 a 0,8 V.',
      'A maior parte do hidrogénio ainda é feita hoje a partir de gás natural, o que liberta dióxido de carbono. Feito a partir da água com eletricidade do vento ou do sol, chama-se hidrogénio verde.',
    ],
  },
  cell: {
    label: 'A pilha de combustível gigante',
    title: 'Dentro de uma pilha de combustível',
    slider: { kid: 'A estrada', sci: 'Carga (densidade de corrente)' },
    road: { flat: 'estrada plana', gentle: 'subida suave', steep: 'subida íngreme' },
    signs: { h2: 'Hidrogénio', membrane: 'Membrana', air: 'Ar', platinum: 'platina', water: 'água', anode: 'ânodo (−)', cathode: 'cátodo (+)', meter: 'eletricidade' },
    hints: { h2: 'Toca na garrafa de hidrogénio', air: 'Toca na entrada de ar', run: 'Experimenta uma subida íngreme' },
    buttons: { h2: 'Válvula do hidrogénio', air: 'Entrada de ar' },
    says: {
      h2On: { kid: 'Entra hidrogénio: muitas moléculas pequeninas de H₂. Mas ainda não acontece nada: do outro lado não há oxigénio para as receber. Toca na entrada de ar!', sci: 'O H₂ enche o canal do ânodo. Sem oxigénio no cátodo não há reação nem corrente.' },
      airOn: { kid: 'Entra ar, e o seu oxigénio fica à espera do lado direito. Agora falta o hidrogénio: toca na garrafa!', sci: 'O ar enche o canal do cátodo. Sem hidrogénio no ânodo, nada reage.' },
      both: { kid: 'Já entraram os dois gases. Olha para a platina!', sci: 'Combustível e oxidante presentes: a reação começa.' },
      go: { kid: 'Funciona! Na platina, cada molécula de hidrogénio parte-se. Os seus dois protões passam pela membrana verde; os dois eletrões não passam, por isso dão a volta pelo fio e acendem a lâmpada. Do outro lado, juntam-se todos ao oxigénio e fazem água.', sci: 'Ânodo: H₂ → 2 H⁺ + 2 e⁻ na platina. A membrana só conduz protões, por isso os eletrões seguem pelo circuito exterior, através da carga. Cátodo: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O.' },
      h2Off: { kid: 'Hidrogénio fechado: a pilha gasta o que sobra e depois a lâmpada apaga-se.', sci: 'Combustível fechado: o H₂ que resta no canal é gasto e depois a corrente para.' },
      airOff: { kid: 'Ar fechado: quando se gastar o último oxigénio, tudo para.', sci: 'Ar fechado: gasto o O₂ do canal, a reação para.' },
      steep: { kid: 'Numa subida íngreme, o motor precisa de mais eletricidade: parte-se mais hidrogénio por segundo, a lâmpada brilha mais e pinga mais água.', sci: 'Maior densidade de corrente: mais H₂ gasto por segundo (dois eletrões cada), mais água e uma tensão mais baixa na célula (resistência e perdas nos elétrodos), por isso um rendimento um pouco menor.' },
      flat: { kid: 'Numa estrada plana, o autocarro precisa de menos: a pilha abranda e poupa hidrogénio.', sci: 'Carga leve: pouca corrente, tensão da célula mais alta, o melhor rendimento.' },
    },
    panel: {
      kid: [
        'Uma pilha de combustível junta hidrogénio e oxigénio sem chama nenhuma. O hidrogénio entra pela esquerda, o ar pela direita, e no meio há uma folha fina de um plástico especial, a membrana, que só deixa passar os protões do hidrogénio.',
        'Os eletrões ficam para trás, por isso dão a volta grande, pelo fio, e pelo caminho acendem a lâmpada (no autocarro, fazem andar o motor). Do lado direito, protões, eletrões e oxigénio encontram-se e fazem água: a única coisa que sai.',
      ],
      sci: [
        'Uma pilha de combustível de membrana de troca de protões (PEM). No ânodo, platina sobre carbono separa o H₂ em protões e eletrões; a membrana, um fluoropolímero sulfonado húmido como o Nafion, muitas vezes mais fino do que o papel, só conduz protões; no cátodo, o oxigénio do ar recebe os protões e os eletrões do circuito exterior: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O. Funciona a cerca de 60 a 80 °C.',
        'Uma célula dá no máximo 1,23 V (ΔG = −237 kJ/mol); com carga, 0,6 a 0,8 V, por isso os veículos empilham centenas de células. O rendimento é de cerca de 40 a 60%; o resto vira calor. William Grove mostrou o princípio em 1839; as primeiras pilhas de combustível no espaço foram as pilhas PEM da General Electric na Gemini 5, em 1965.',
      ],
    },
  },
  bus: {
    label: 'O autocarro a hidrogénio',
    title: 'Atestar, andar, contar a água',
    slider: 'Próxima viagem',
    signs: { measure: 'Água do autocarro', rule: '1 kg de hidrogénio faz 9 litros de água' },
    hints: { fill: 'Toca na pistola para atestar', drive: 'Toca no autocarro para andar', away: 'Observa a estrada', filling: 'Observa a pressão', pouring: 'Observa as flores', empty: 'Toca no medidor para o esvaziar' },
    buttons: { fill: 'Atestar', drive: 'Andar', empty: 'Esvaziar o medidor' },
    board: { title: 'Hidrogénio', pressure: 'pressão no depósito', tank: 'No depósito', next: 'Próxima viagem', driving: 'A andar', uses: 'gasta {kg} kg de hidrogénio', makes: 'faz {l} L de água', last: 'Última viagem: {km} km · {kg} kg · {l} L', sci: '8 kg por 100 km · 1 kg de H₂ dá 8,9 kg de H₂O' },
    says: {
      fill: { kid: 'Clique! A pistola encaixa e o hidrogénio entra a correr nos depósitos do tejadilho, apertado a 350 vezes a pressão do ar. Os carros apertam o deles ainda mais, a 700.', sci: 'A abastecer a 350 bar, a pressão habitual dos autocarros (os carros usam 700 bar): cerca de 35 kg de H₂ em depósitos de fibra de carbono no tejadilho.' },
      filled: { kid: 'Cheio! 35 kg de hidrogénio. Agora toca no autocarro para dar uma volta.', sci: 'Cheio: 35 kg a 350 bar. Escolhe uma viagem no cursor e toca no autocarro.' },
      full: { kid: 'O depósito já está cheio. Toca no autocarro para andar!', sci: 'Depósito cheio (35 kg, 350 bar).' },
      low: { kid: 'Não há hidrogénio que chegue para {km} km: só restam {kg} kg. Toca na pistola para atestar, ou escolhe uma viagem mais curta.', sci: '{kg} kg de H₂ não chegam para {km} km, a cerca de 8 kg por 100 km: abastece ou encurta a viagem.' },
      overflow: { kid: 'O medidor ia transbordar! Toca nele para dar primeiro a água às flores.', sci: 'O medidor leva 300 L: esvazia-o primeiro.' },
      drive: { kid: 'Lá vai ele, silencioso como um sussurro: o motor é elétrico e é a pilha de combustível que faz a eletricidade. Olha para o que pinga!', sci: 'A pilha de combustível alimenta um motor elétrico; uma bateria ajuda quando acelera e guarda energia quando trava. O único escape é água, em vapor e em gotas.' },
      back: { kid: 'De volta, depois de {km} km! Gastou {kg} kg de hidrogénio e fez {l} litros de água. Olha para o medidor!', sci: '{km} km: {kg} kg de H₂ gastos, {l} L de água feitos, 9 vezes a massa do hidrogénio.' },
      pour: { kid: 'Para as flores: {l} litros de água limpa, feita de {kg} kg de hidrogénio e do oxigénio do ar.', sci: '{l} L de água a partir de {kg} kg de H₂. A água de uma pilha de combustível é muito pura, quase como água destilada.' },
      pourEmpty: { kid: 'O medidor está vazio. Põe o autocarro a andar para o encher!', sci: 'Vazio: faz primeiro uma viagem.' },
    },
    panel: {
      kid: [
        'Este autocarro não tem motor a gasóleo. No tejadilho tem depósitos de hidrogénio, e lá dentro uma pilha de combustível transforma-o em eletricidade para o motor. Atestar leva poucos minutos.',
        'Por cada quilograma de hidrogénio que gasta, o autocarro faz 9 litros de água. Tanto assim porque o oxigénio da água vem do ar: um átomo de oxigénio pesa tanto como 16 átomos de hidrogénio. Cerca de 8 kg de hidrogénio levam o autocarro a 100 km e fazem cerca de 72 litros de água. Aqui apanhamo-la no medidor; na estrada, pinga ou vai-se embora em vapor.',
      ],
      sci: [
        'Um autocarro de 12 m com pilha de combustível leva cerca de 35 kg de H₂ a 350 bar em depósitos de fibra de carbono no tejadilho e gasta cerca de 7 a 9 kg por 100 km (nos projetos europeus JIVE, em média cerca de 7,5 a 8). Uma bateria trabalha com a pilha: recupera energia nas travagens e ajuda nas acelerações.',
        '2 H₂ + O₂ → 2 H₂O: 4 g de hidrogénio e 32 g de oxigénio fazem 36 g de água, por isso 1 kg de H₂ dá cerca de 9 kg (8,9 kg) de água. A 8 kg por 100 km são cerca de 72 L por 100 km, quase tudo em vapor. A água de uma pilha de combustível é muito pura, quase como água destilada.',
      ],
    },
  },
  train: {
    label: 'O comboio a hidrogénio',
    title: 'O Coradia iLint',
    signs: { tanks: 'Depósitos de hidrogénio', cell: 'Pilha de combustível', battery: 'Baterias' },
    hints: { open: 'Toca no comboio para ver por dentro', close: 'Toca no comboio para fechar o tejadilho' },
    buttons: { open: 'Ver por dentro', close: 'Fechar o tejadilho' },
    says: {
      open: { kid: 'Olha para o tejadilho: depósitos de hidrogénio e uma pilha de combustível, como os do autocarro, mas maiores. Debaixo do chão, baterias. E não há fios por cima da linha: o comboio faz a sua própria eletricidade.', sci: 'Cada carruagem tem depósitos de hidrogénio e um módulo de pilha de combustível no tejadilho, e baterias de iões de lítio debaixo do chão, que guardam a energia das travagens; motores elétricos levam-no até 140 km/h. A única emissão é água.' },
      close: { kid: 'Tejadilho fechado.', sci: 'Carenagem fechada.' },
    },
    panel: {
      kid: [
        'O Coradia iLint foi o primeiro comboio do mundo a levar passageiros com hidrogénio. Desde 2018 anda na Baixa Saxónia, no norte da Alemanha, em linhas sem fios elétricos por cima da via, onde antes só podiam andar comboios a gasóleo.',
        'Dele só sai água, e é muito mais silencioso do que um comboio a gasóleo.',
      ],
      sci: [
        'O Coradia iLint da Alstom começou a levar passageiros em setembro de 2018 entre Cuxhaven, Bremerhaven, Bremervörde e Buxtehude, uma linha sem eletrificação. Em 2022 uma frota de 14 ficou com a linha, abastecida em Bremervörde, no primeiro posto de hidrogénio para comboios de passageiros.',
        'Cada uma das suas duas carruagens tem um módulo de pilha de combustível e depósitos de hidrogénio no tejadilho, e baterias de iões de lítio por baixo; as baterias guardam a energia das travagens e ajudam nas acelerações. Velocidade máxima: 140 km/h.',
      ],
    },
  },
  space: {
    label: 'O hidrogénio no espaço',
    title: 'O hidrogénio no espaço',
    signs: { plate: 'O hidrogénio no espaço', shuttle: 'Vaivém espacial (modelo)', cell: 'Pilha da Apollo, tamanho real', csm: 'Nave Apollo (modelo)', bag: 'água para beber' },
    hints: { shuttle: 'Toca no vaivém', cell: 'Toca na pilha da Apollo', bag: 'Toca no saco de água', any: 'Toca no vaivém, na pilha ou no saco' },
    buttons: { shuttle: 'Ligar os motores do vaivém', cell: 'Pôr a pilha a funcionar', bag: 'Ver a água' },
    says: {
      shuttle: { kid: 'Motores principais a ligar! Os seus três motores queimam hidrogénio líquido com oxigénio líquido. As chamas são azul-claras, quase invisíveis, e as nuvens são vapor: água!', sci: 'Arranque dos RS-25, 6,6 s antes dos propulsores: hidrogénio e oxigénio líquidos a cerca de 6 para 1 em massa, ricos em combustível, por isso o escape é sobretudo vapor de água sobreaquecido com algum hidrogénio por queimar. Grande parte da nuvem branca era a água do sistema de supressão de som da plataforma, transformada em vapor.' },
      cell: { kid: 'A pilha zune: hidrogénio e oxigénio dos depósitos da nave fazem eletricidade e água. A água sobe até aos astronautas.', sci: 'Uma das três pilhas de combustível alcalinas da Pratt & Whitney: 31 células em série, cerca de 27 a 31 V, normalmente até cerca de 1,4 kW cada, a funcionar a cerca de 200 °C com hidróxido de potássio concentrado. A água que fazia seguia por um tubo até ao depósito de água potável do módulo de comando.' },
      bag: { kid: 'Olha para as bolhas! A água dos primeiros voos Apollo tinha hidrogénio gasoso. O hidrogénio não é venenoso, mas uma bebida cheia de bolhas não é agradável, por isso, a partir da Apollo 12, um separador tirava o gás.', sci: 'A água dos primeiros módulos de comando trazia hidrogénio gasoso a mais. A partir da Apollo 12, um separador de tubos de paládio e prata, através dos quais o hidrogénio se difunde, retirava-o e lançava-o para o espaço.' },
      bagEmpty: { kid: 'O saco está vazio. Toca na pilha para fazer água!', sci: 'Vazio: põe primeiro a pilha a funcionar.' },
    },
    panel: {
      kid: [
        'O hidrogénio é o combustível mais leve de todos, por isso os foguetões adoram-no. O grande tanque cor de laranja do vaivém espacial levava hidrogénio líquido a −253 °C, e os seus três motores principais queimavam-no com oxigénio líquido. O que saía era sobretudo vapor.',
        'A nave-mãe da Apollo, que levou os astronautas à Lua e os trouxe de volta, tinha eletricidade de três pilhas de combustível, que juntavam hidrogénio e oxigénio sem barulho. A água que faziam era a água que os astronautas bebiam, mais do que conseguiam beber; o resto era deitado fora, para o espaço.',
      ],
      sci: [
        'Os três motores principais RS-25 do vaivém queimavam hidrogénio e oxigénio líquidos do tanque externo; os dois propulsores laterais queimavam propergol sólido. Por quilograma, o hidrogénio dá mais energia do que qualquer outro combustível químico, mas ocupa muito espaço: o hidrogénio líquido pesa só cerca de 71 g por litro.',
        'Cada módulo de serviço Apollo levava três pilhas de combustível da Pratt & Whitney, do tipo criado por Francis Thomas Bacon: pilhas alcalinas, em que são os iões hidróxido (OH⁻), e não os protões, que atravessam o eletrólito, por isso a água forma-se do lado do hidrogénio. Alimentadas por depósitos criogénicos, davam eletricidade à nave e a sua água potável; o excesso era despejado para fora.',
      ],
    },
  },
}

const PL = {
  title: 'Stacja wodorowa',
  greet: {
    kid: 'Jesteśmy w środku obrazka, na stacji tankowania wodoru! Po lewej olbrzymie ogniwo paliwowe, przecięte, żeby było widać, co jest w środku. Po prawej autobus, który jeździ na wodór, a za nim pociąg wodorowy. W gablocie: wodór w kosmosie. Historia obrazka jest na sztaludze.',
    sci: 'Stacja tankowania wodoru o zmierzchu, przy linii kolejowej w Dolnej Saksonii. Po lewej ogniwo paliwowe z membraną protonowymienną, przecięte i ogromnie powiększone; po prawej dystrybutor 350 bar i autobus z ogniwem paliwowym; za nimi Coradia iLint, pociąg wodorowy; w gablocie wodór w lotach kosmicznych: silniki główne promu kosmicznego i alkaliczne ogniwa paliwowe Apollo. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Jestem najmniejszym i najlżejszym atomem ze wszystkich: jeden proton i jeden elektron. Wodór jest tak lekki, że cały zbiornik tego autobusu, wystarczający na ponad 400 km, waży mniej więcej tyle co dziesięcioletnie dziecko!',
      'Kiedy łączę się z tlenem, staję się wodą. I tyle: ani dymu, ani sadzy. Dlatego z autobusu tylko kapie.',
      'Żeby zmieściło się mnie dużo w zbiorniku, trzeba mnie mocno ścisnąć: w tym autobusie do ciśnienia około 350 razy większego niż ciśnienie powietrza wokół ciebie. Samochody ściskają mnie jeszcze mocniej, 700 razy.',
    ],
    sci: [
      'Kilogram wodoru zawiera około 142 MJ (120 MJ, jeśli woda uchodzi jako para), mniej więcej trzy razy więcej niż benzyna. Na litr jest odwrotnie: nawet pod ciśnieniem 700 bar litr zawiera tylko około 40 g wodoru.',
      'Ogniwo paliwowe nie jest silnikiem cieplnym, więc nie obowiązuje go granica Carnota: zamienia energię swobodną Gibbsa reakcji (237 kJ/mol, 1,23 V na ogniwo) bezpośrednio w prąd. Straty na elektrodach obniżają napięcie pracującego ogniwa do 0,6 do 0,8 V.',
      'Większość wodoru wciąż powstaje dziś z gazu ziemnego, co uwalnia dwutlenek węgla. Wodór otrzymany z wody za pomocą prądu z wiatru lub słońca nazywa się zielonym wodorem.',
    ],
  },
  cell: {
    label: 'Olbrzymie ogniwo paliwowe',
    title: 'Wnętrze ogniwa paliwowego',
    slider: { kid: 'Droga', sci: 'Obciążenie (gęstość prądu)' },
    road: { flat: 'płaska droga', gentle: 'łagodne wzniesienie', steep: 'strome wzniesienie' },
    signs: { h2: 'Wodór', membrane: 'Membrana', air: 'Powietrze', platinum: 'platyna', water: 'woda', anode: 'anoda (−)', cathode: 'katoda (+)', meter: 'prąd' },
    hints: { h2: 'Stuknij w butlę z wodorem', air: 'Stuknij we wlot powietrza', run: 'Spróbuj stromego wzniesienia' },
    buttons: { h2: 'Zawór wodoru', air: 'Wlot powietrza' },
    says: {
      h2On: { kid: 'Wpływa wodór: mnóstwo małych cząsteczek H₂. Ale jeszcze nic się nie dzieje: po drugiej stronie nie ma tlenu, który by je przyjął. Stuknij we wlot powietrza!', sci: 'H₂ wypełnia kanał anody. Bez tlenu na katodzie nie ma reakcji ani prądu.' },
      airOn: { kid: 'Wpływa powietrze, a jego tlen czeka po prawej. Teraz brakuje wodoru: stuknij w butlę!', sci: 'Powietrze wypełnia kanał katody. Bez wodoru na anodzie nic nie reaguje.' },
      both: { kid: 'Oba gazy są w środku. Patrz na platynę!', sci: 'Paliwo i utleniacz są obecne: reakcja się zaczyna.' },
      go: { kid: 'Działa! Na platynie każda cząsteczka wodoru się rozpada. Jej dwa protony przechodzą przez zieloną membranę; dwa elektrony nie mogą, więc biegną dookoła przewodem i zapalają żarówkę. Po drugiej stronie wszystkie spotykają się z tlenem i powstaje woda.', sci: 'Anoda: H₂ → 2 H⁺ + 2 e⁻ na platynie. Membrana przewodzi tylko protony, więc elektrony płyną obwodem zewnętrznym, przez odbiornik. Katoda: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O.' },
      h2Off: { kid: 'Wodór zakręcony: ogniwo zużywa to, co zostało, a potem żarówka gaśnie.', sci: 'Dopływ paliwa zamknięty: H₂ pozostały w kanale zostaje zużyty, potem prąd ustaje.' },
      airOff: { kid: 'Powietrze zakręcone: kiedy zużyje się ostatni tlen, wszystko staje.', sci: 'Dopływ powietrza zamknięty: po zużyciu O₂ w kanale reakcja ustaje.' },
      steep: { kid: 'Pod stromą górę silnik potrzebuje więcej prądu: co sekundę rozpada się więcej wodoru, żarówka świeci jaśniej i kapie więcej wody.', sci: 'Większa gęstość prądu: więcej H₂ zużywanego na sekundę (po dwa elektrony z cząsteczki), więcej wody i niższe napięcie ogniwa (opór i straty na elektrodach), a więc nieco mniejsza sprawność.' },
      flat: { kid: 'Na płaskiej drodze autobus potrzebuje mniej: ogniwo zwalnia i oszczędza wodór.', sci: 'Małe obciążenie: mały prąd, wyższe napięcie ogniwa, najlepsza sprawność.' },
    },
    panel: {
      kid: [
        'Ogniwo paliwowe łączy wodór z tlenem bez żadnego płomienia. Wodór wpływa z lewej, powietrze z prawej, a pośrodku jest cienka warstwa specjalnego plastiku, membrana, która przepuszcza tylko protony wodoru.',
        'Elektrony zostają, więc idą dookoła, przewodem, i po drodze zapalają żarówkę (w autobusie kręcą silnikiem). Po prawej stronie protony, elektrony i tlen spotykają się i powstaje woda: jedyne, co wychodzi z ogniwa.',
      ],
      sci: [
        'Ogniwo paliwowe z membraną protonowymienną (PEM). Na anodzie platyna na węglu rozdziela H₂ na protony i elektrony; membrana, wilgotny sulfonowany fluoropolimer, taki jak Nafion, często cieńsza od kartki papieru, przewodzi tylko protony; na katodzie tlen z powietrza przyjmuje protony i elektrony z obwodu zewnętrznego: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O. Pracuje w temperaturze około 60 do 80 °C.',
        'Jedno ogniwo daje najwyżej 1,23 V (ΔG = −237 kJ/mol); pod obciążeniem od 0,6 do 0,8 V, dlatego pojazdy mają stosy złożone z setek ogniw. Sprawność wynosi około 40 do 60%; reszta zamienia się w ciepło. William Grove pokazał tę zasadę w 1839 roku; pierwsze ogniwa paliwowe w kosmosie to ogniwa PEM firmy General Electric na pokładzie Gemini 5 w 1965 roku.',
      ],
    },
  },
  bus: {
    label: 'Autobus wodorowy',
    title: 'Zatankuj, jedź, policz wodę',
    slider: 'Następna trasa',
    signs: { measure: 'Woda z autobusu', rule: '1 kg wodoru daje 9 litrów wody' },
    hints: { fill: 'Stuknij w pistolet, żeby zatankować', drive: 'Stuknij w autobus, żeby pojechał', away: 'Patrz na drogę', filling: 'Patrz na ciśnienie', pouring: 'Patrz na kwiatki', empty: 'Stuknij w miarkę, żeby ją opróżnić' },
    buttons: { fill: 'Zatankuj', drive: 'Jedź', empty: 'Opróżnij miarkę' },
    board: { title: 'Wodór', pressure: 'ciśnienie w zbiorniku', tank: 'W zbiorniku', next: 'Następna trasa', driving: 'W drodze', uses: 'zużyje {kg} kg wodoru', makes: 'da {l} L wody', last: 'Ostatnia trasa: {km} km · {kg} kg · {l} L', sci: '8 kg na 100 km · 1 kg H₂ daje 8,9 kg H₂O' },
    says: {
      fill: { kid: 'Klik! Pistolet się zatrzaskuje i wodór wpada do zbiorników na dachu, ściśnięty do ciśnienia 350 razy większego niż ciśnienie powietrza. Samochody ściskają swój jeszcze mocniej, do 700.', sci: 'Tankowanie do 350 bar, zwykłego ciśnienia dla autobusów (samochody używają 700 bar): około 35 kg H₂ w zbiornikach z włókna węglowego na dachu.' },
      filled: { kid: 'Pełny! 35 kg wodoru. Teraz stuknij w autobus i jedziemy.', sci: 'Pełny: 35 kg pod ciśnieniem 350 bar. Wybierz trasę suwakiem i stuknij w autobus.' },
      full: { kid: 'Zbiornik jest już pełny. Stuknij w autobus, żeby pojechał!', sci: 'Zbiornik pełny (35 kg, 350 bar).' },
      low: { kid: 'Za mało wodoru na {km} km: zostało tylko {kg} kg. Stuknij w pistolet, żeby zatankować, albo wybierz krótszą trasę.', sci: '{kg} kg H₂ nie wystarczy na {km} km przy zużyciu około 8 kg na 100 km: zatankuj albo skróć trasę.' },
      overflow: { kid: 'Miarka by się przelała! Najpierw stuknij w nią i podlej kwiatki.', sci: 'Miarka mieści 300 L: najpierw ją opróżnij.' },
      drive: { kid: 'Rusza, cichutko jak szept: silnik jest elektryczny, a prąd robi ogniwo paliwowe. Zobacz, co kapie!', sci: 'Ogniwo paliwowe zasila silnik elektryczny; akumulator pomaga przy przyspieszaniu i magazynuje energię przy hamowaniu. Jedyne spaliny to woda, jako para i krople.' },
      back: { kid: 'Wrócił po {km} km! Zużył {kg} kg wodoru i zrobił {l} L wody. Zobacz miarkę!', sci: '{km} km: zużyto {kg} kg H₂, powstało {l} L wody, 9 razy więcej niż masa wodoru.' },
      pour: { kid: 'Dla kwiatków: {l} L czystej wody, zrobionej z {kg} kg wodoru i tlenu z powietrza.', sci: '{l} L wody z {kg} kg H₂. Woda z ogniwa paliwowego jest bardzo czysta, prawie jak woda destylowana.' },
      pourEmpty: { kid: 'Miarka jest pusta. Wyślij autobus w trasę, żeby ją napełnić!', sci: 'Pusta: najpierw przejedź trasę.' },
    },
    panel: {
      kid: [
        'Ten autobus nie ma silnika Diesla. Na dachu ma zbiorniki z wodorem, a w środku ogniwo paliwowe zamienia wodór w prąd dla silnika. Tankowanie trwa kilka minut.',
        'Z każdego kilograma wodoru autobus robi 9 litrów wody. Aż tyle, bo tlen do tej wody pochodzi z powietrza: atom tlenu waży tyle co 16 atomów wodoru. Około 8 kg wodoru wystarcza autobusowi na 100 km i daje około 72 litry wody. Tutaj łapiemy ją do miarki; na drodze woda kapie albo ulatuje jako para.',
      ],
      sci: [
        'Dwunastometrowy autobus z ogniwem paliwowym wiezie około 35 kg H₂ pod ciśnieniem 350 bar w zbiornikach z włókna węglowego na dachu i zużywa około 7 do 9 kg na 100 km (w europejskich projektach JIVE średnio około 7,5 do 8). Ogniwu pomaga akumulator: odzyskuje energię przy hamowaniu i wspiera przyspieszanie.',
        '2 H₂ + O₂ → 2 H₂O: 4 g wodoru i 32 g tlenu dają 36 g wody, więc 1 kg H₂ daje około 9 kg (8,9 kg) wody. Przy 8 kg na 100 km to około 72 L na 100 km, w większości jako para. Woda z ogniwa paliwowego jest bardzo czysta, prawie jak woda destylowana.',
      ],
    },
  },
  train: {
    label: 'Pociąg wodorowy',
    title: 'Coradia iLint',
    signs: { tanks: 'Zbiorniki wodoru', cell: 'Ogniwo paliwowe', battery: 'Akumulatory' },
    hints: { open: 'Stuknij w pociąg, żeby zajrzeć do środka', close: 'Stuknij w pociąg, żeby zamknąć dach' },
    buttons: { open: 'Zajrzyj do środka', close: 'Zamknij dach' },
    says: {
      open: { kid: 'Spójrz na dach: zbiorniki z wodorem i ogniwo paliwowe, jak w autobusie, tylko większe. Pod podłogą akumulatory. I żadnych przewodów nad torami: pociąg sam robi sobie prąd.', sci: 'Każdy wagon ma na dachu zbiorniki wodoru i moduł ogniwa paliwowego, a pod podłogą akumulatory litowo-jonowe, które magazynują energię z hamowania; napędzają go silniki elektryczne, do 140 km/h. Jedyna emisja to woda.' },
      close: { kid: 'Dach zamknięty.', sci: 'Osłona zamknięta.' },
    },
    panel: {
      kid: [
        'Coradia iLint był pierwszym pociągiem na świecie, który woził pasażerów dzięki wodorowi. Od 2018 roku jeździ w Dolnej Saksonii, na północy Niemiec, po liniach bez przewodów elektrycznych nad torami, gdzie wcześniej mogły jeździć tylko pociągi spalinowe.',
        'Wychodzi z niego tylko woda, a jest dużo cichszy od pociągu spalinowego.',
      ],
      sci: [
        'Coradia iLint firmy Alstom zaczął wozić pasażerów we wrześniu 2018 roku na niezelektryfikowanej linii z Cuxhaven przez Bremerhaven i Bremervörde do Buxtehude. W 2022 roku linię przejęła flota 14 takich pociągów, tankowanych w Bremervörde, na pierwszej stacji wodorowej dla pociągów pasażerskich.',
        'Każdy z jego dwóch wagonów ma na dachu moduł ogniwa paliwowego i zbiorniki wodoru, a pod spodem akumulatory litowo-jonowe; akumulatory magazynują energię z hamowania i pomagają przy przyspieszaniu. Prędkość maksymalna: 140 km/h.',
      ],
    },
  },
  space: {
    label: 'Wodór w kosmosie',
    title: 'Wodór w kosmosie',
    signs: { plate: 'Wodór w kosmosie', shuttle: 'Prom kosmiczny (model)', cell: 'Ogniwo Apollo, naturalna wielkość', csm: 'Statek Apollo (model)', bag: 'woda do picia' },
    hints: { shuttle: 'Stuknij w prom', cell: 'Stuknij w ogniwo Apollo', bag: 'Stuknij w woreczek z wodą', any: 'Stuknij w prom, w ogniwo albo w woreczek' },
    buttons: { shuttle: 'Uruchom silniki promu', cell: 'Uruchom ogniwo', bag: 'Obejrzyj wodę' },
    says: {
      shuttle: { kid: 'Start silników głównych! Trzy silniki spalają ciekły wodór z ciekłym tlenem. Płomienie są bladoniebieskie, prawie niewidoczne, a chmury to para: woda!', sci: 'Zapłon RS-25, 6,6 s przed rakietami pomocniczymi: ciekły wodór i ciekły tlen w stosunku masowym około 6 do 1, z nadmiarem paliwa, więc spaliny to głównie przegrzana para wodna z odrobiną niespalonego wodoru. Dużą część białej chmury tworzyła woda z instalacji tłumienia dźwięku na stanowisku startowym, zamieniona w parę.' },
      cell: { kid: 'Ogniwo szumi: wodór i tlen ze zbiorników statku dają prąd i wodę. Woda płynie do astronautów.', sci: 'Jedno z trzech alkalicznych ogniw paliwowych Pratt & Whitney: 31 ogniw połączonych szeregowo, około 27 do 31 V, zwykle do około 1,4 kW każde, pracujące w temperaturze około 200 °C ze stężonym wodorotlenkiem potasu. Powstająca woda płynęła rurką do zbiornika wody pitnej w module dowodzenia.' },
      bag: { kid: 'Zobacz bąbelki! Woda z pierwszych lotów Apollo zawierała wodór. Wodór nie jest trujący, ale napój pełen bąbelków nie jest przyjemny, więc od Apollo 12 gaz usuwał separator.', sci: 'Woda w pierwszych modułach dowodzenia zawierała nadmiar wodoru. Od Apollo 12 separator z rurek ze stopu palladu i srebra, przez które wodór dyfunduje, usuwał go i wypuszczał w kosmos.' },
      bagEmpty: { kid: 'Woreczek jest pusty. Stuknij w ogniwo, żeby zrobić wodę!', sci: 'Pusty: najpierw uruchom ogniwo.' },
    },
    panel: {
      kid: [
        'Wodór to najlżejsze paliwo ze wszystkich, więc rakiety go uwielbiają. Wielki pomarańczowy zbiornik promu kosmicznego mieścił ciekły wodór o temperaturze −253 °C, a trzy silniki główne spalały go z ciekłym tlenem. Wylatywała z nich głównie para wodna.',
        'Statek macierzysty Apollo, który zawoził astronautów na Księżyc i z powrotem, miał prąd z trzech ogniw paliwowych, które cicho łączyły wodór z tlenem. Woda, którą robiły, była wodą do picia dla astronautów, i to więcej, niż mogli wypić; resztę wypuszczano w kosmos.',
      ],
      sci: [
        'Trzy silniki główne RS-25 promu spalały ciekły wodór i ciekły tlen z zewnętrznego zbiornika; dwie rakiety pomocnicze spalały paliwo stałe. Na kilogram wodór daje więcej energii niż jakiekolwiek inne paliwo chemiczne, ale zajmuje dużo miejsca: ciekły wodór waży tylko około 71 g na litr.',
        'Każdy moduł serwisowy Apollo miał trzy ogniwa paliwowe Pratt & Whitney według konstrukcji Francisa Thomasa Bacona: ogniwa alkaliczne, w których przez elektrolit przechodzą jony wodorotlenkowe (OH⁻), a nie protony, więc woda powstaje po stronie wodoru. Zasilane ze zbiorników kriogenicznych, dawały statkowi prąd i wodę pitną; nadmiar wyrzucano na zewnątrz.',
      ],
    },
  },
}

const DE = {
  title: 'Die Wasserstofftankstelle',
  greet: {
    kid: 'Wir sind im Bild, an einer Wasserstofftankstelle! Links eine riesige Brennstoffzelle, aufgeschnitten, damit du hineinschauen kannst. Rechts ein Bus, der mit Wasserstoff fährt, und dahinter ein Wasserstoffzug. In der Vitrine: Wasserstoff im Weltraum. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Eine Wasserstofftankstelle in der Abenddämmerung an einer Bahnstrecke in Niedersachsen. Links eine Protonenaustauschmembran-Brennstoffzelle, aufgeschnitten und stark vergrößert; rechts eine 350-bar-Zapfsäule und ein Brennstoffzellenbus; dahinter ein Coradia iLint, der Wasserstoffzug; in der Vitrine Wasserstoff in der Raumfahrt: die Haupttriebwerke des Spaceshuttles und die alkalischen Brennstoffzellen von Apollo. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Ich bin das kleinste und leichteste Atom von allen: ein Proton und ein Elektron. Wasserstoff ist so leicht, dass ein ganzer Tank dieses Busses, genug für über 400 km, ungefähr so viel wiegt wie ein zehnjähriges Kind!',
      'Wenn ich mich mit Sauerstoff verbinde, werde ich zu Wasser. Das ist alles: kein Rauch, kein Ruß. Darum tropft aus dem Bus nur Wasser.',
      'Damit genug von mir in einen Tank passt, muss ich kräftig zusammengepresst werden: in diesem Bus auf etwa das 350-Fache des Luftdrucks um dich herum. Autos pressen mich noch stärker, auf das 700-Fache.',
    ],
    sci: [
      'Pro Kilogramm enthält Wasserstoff etwa 142 MJ (120 MJ, wenn das Wasser als Dampf entweicht), rund dreimal so viel wie Benzin. Pro Liter ist es umgekehrt: Selbst bei 700 bar enthält ein Liter nur etwa 40 g.',
      'Eine Brennstoffzelle ist keine Wärmekraftmaschine, daher gilt die Carnot-Grenze nicht: Sie wandelt die Gibbs-Energie der Reaktion (237 kJ/mol, 1,23 V pro Zelle) direkt in Strom um. Verluste an den Elektroden senken die Spannung einer arbeitenden Zelle auf 0,6 bis 0,8 V.',
      'Der meiste Wasserstoff wird heute noch aus Erdgas hergestellt, wobei Kohlendioxid entsteht. Wird er mit Strom aus Wind oder Sonne aus Wasser gewonnen, heißt er grüner Wasserstoff.',
    ],
  },
  cell: {
    label: 'Die riesige Brennstoffzelle',
    title: 'In einer Brennstoffzelle',
    slider: { kid: 'Die Straße', sci: 'Last (Stromdichte)' },
    road: { flat: 'flache Straße', gentle: 'sanfter Anstieg', steep: 'steiler Berg' },
    signs: { h2: 'Wasserstoff', membrane: 'Membran', air: 'Luft', platinum: 'Platin', water: 'Wasser', anode: 'Anode (−)', cathode: 'Kathode (+)', meter: 'Strom' },
    hints: { h2: 'Tippe auf die Wasserstoffflasche', air: 'Tippe auf den Lufteinlass', run: 'Probier einen steilen Berg' },
    buttons: { h2: 'Wasserstoffventil', air: 'Lufteinlass' },
    says: {
      h2On: { kid: 'Wasserstoff strömt herein: viele kleine H₂-Moleküle. Aber noch passiert nichts: Auf der anderen Seite ist kein Sauerstoff, der sie aufnimmt. Tippe auf den Lufteinlass!', sci: 'H₂ füllt den Anodenkanal. Ohne Sauerstoff an der Kathode gibt es keine Reaktion und keinen Strom.' },
      airOn: { kid: 'Luft strömt herein, und ihr Sauerstoff wartet rechts. Jetzt fehlt der Wasserstoff: Tippe auf die Flasche!', sci: 'Luft füllt den Kathodenkanal. Ohne Wasserstoff an der Anode reagiert nichts.' },
      both: { kid: 'Beide Gase sind drin. Schau auf das Platin!', sci: 'Brennstoff und Oxidationsmittel sind da: Die Reaktion beginnt.' },
      go: { kid: 'Es klappt! Am Platin zerfällt jedes Wasserstoffmolekül. Seine zwei Protonen schlüpfen durch die grüne Membran; seine zwei Elektronen können das nicht, also laufen sie außen herum durch den Draht und bringen die Lampe zum Leuchten. Auf der anderen Seite treffen sich alle mit dem Sauerstoff und werden zu Wasser.', sci: 'Anode: H₂ → 2 H⁺ + 2 e⁻ am Platin. Die Membran leitet nur Protonen, also nehmen die Elektronen den äußeren Stromkreis, durch den Verbraucher. Kathode: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O.' },
      h2Off: { kid: 'Wasserstoff zu: Die Zelle verbraucht, was noch da ist, dann geht die Lampe aus.', sci: 'Brennstoff geschlossen: Das restliche H₂ im Kanal wird verbraucht, dann endet der Strom.' },
      airOff: { kid: 'Luft zu: Sobald der letzte Sauerstoff verbraucht ist, steht alles still.', sci: 'Luft geschlossen: Ist das O₂ im Kanal verbraucht, endet die Reaktion.' },
      steep: { kid: 'Einen steilen Berg hinauf braucht der Motor mehr Strom: Jede Sekunde zerfällt mehr Wasserstoff, die Lampe leuchtet heller und es tropft mehr Wasser.', sci: 'Höhere Stromdichte: mehr H₂ pro Sekunde (je zwei Elektronen), mehr Wasser und eine niedrigere Zellspannung (Widerstand und Elektrodenverluste), also etwas weniger Wirkungsgrad.' },
      flat: { kid: 'Auf flacher Straße braucht der Bus weniger: Die Brennstoffzelle arbeitet langsamer und spart Wasserstoff.', sci: 'Geringe Last: wenig Strom, eine höhere Zellspannung, der beste Wirkungsgrad.' },
    },
    panel: {
      kid: [
        'Eine Brennstoffzelle verbindet Wasserstoff und Sauerstoff ganz ohne Flamme. Der Wasserstoff kommt links herein, die Luft rechts, und in der Mitte ist eine dünne Folie aus einem besonderen Kunststoff, die Membran, die nur die Protonen des Wasserstoffs durchlässt.',
        'Die Elektronen bleiben zurück und nehmen deshalb den langen Weg außen herum, durch den Draht, und unterwegs bringen sie die Lampe zum Leuchten (im Bus treiben sie den Motor an). Rechts treffen sich Protonen, Elektronen und Sauerstoff und werden zu Wasser: das Einzige, was herauskommt.',
      ],
      sci: [
        'Eine Protonenaustauschmembran-Brennstoffzelle (PEM). An der Anode spaltet Platin auf Kohlenstoff H₂ in Protonen und Elektronen; die Membran, ein feuchtes sulfoniertes Fluorpolymer wie Nafion, oft dünner als Papier, leitet nur Protonen; an der Kathode nimmt der Sauerstoff der Luft die Protonen und die Elektronen aus dem äußeren Stromkreis auf: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O. Sie arbeitet bei etwa 60 bis 80 °C.',
        'Eine Zelle liefert höchstens 1,23 V (ΔG = −237 kJ/mol); unter Last 0,6 bis 0,8 V, darum stapeln Fahrzeuge Hunderte von Zellen. Der Wirkungsgrad liegt bei etwa 40 bis 60%; der Rest wird Wärme. William Grove zeigte das Prinzip 1839; die ersten Brennstoffzellen im Weltraum waren die PEM-Zellen von General Electric an Bord von Gemini 5, 1965.',
      ],
    },
  },
  bus: {
    label: 'Der Wasserstoffbus',
    title: 'Tanken, fahren, Wasser zählen',
    slider: 'Nächste Fahrt',
    signs: { measure: 'Wasser aus dem Bus', rule: '1 kg Wasserstoff ergibt 9 Liter Wasser' },
    hints: { fill: 'Tippe auf die Zapfpistole zum Tanken', drive: 'Tippe auf den Bus, damit er fährt', away: 'Schau auf die Straße', filling: 'Schau auf den Druck', pouring: 'Schau auf die Blumen', empty: 'Tippe auf das Messglas, um es zu leeren' },
    buttons: { fill: 'Volltanken', drive: 'Losfahren', empty: 'Messglas leeren' },
    board: { title: 'Wasserstoff', pressure: 'Druck im Tank', tank: 'Im Tank', next: 'Nächste Fahrt', driving: 'Unterwegs', uses: 'braucht {kg} kg Wasserstoff', makes: 'macht {l} L Wasser', last: 'Letzte Fahrt: {km} km · {kg} kg · {l} L', sci: '8 kg pro 100 km · 1 kg H₂ ergibt 8,9 kg H₂O' },
    says: {
      fill: { kid: 'Klick! Die Zapfpistole rastet ein und der Wasserstoff strömt in die Tanks auf dem Dach, zusammengepresst auf das 350-Fache des Luftdrucks. Autos pressen ihren noch stärker, auf das 700-Fache.', sci: 'Betankung auf 350 bar, den üblichen Druck für Busse (Autos nutzen 700 bar): etwa 35 kg H₂ in Kohlefasertanks auf dem Dach.' },
      filled: { kid: 'Voll! 35 kg Wasserstoff. Jetzt tippe auf den Bus für eine Fahrt.', sci: 'Voll: 35 kg bei 350 bar. Wähle mit dem Regler eine Fahrt, dann tippe auf den Bus.' },
      full: { kid: 'Der Tank ist schon voll. Tippe auf den Bus, damit er fährt!', sci: 'Tank voll (35 kg, 350 bar).' },
      low: { kid: 'Zu wenig Wasserstoff für {km} km: nur noch {kg} kg. Tippe auf die Zapfpistole zum Tanken oder wähle eine kürzere Fahrt.', sci: '{kg} kg H₂ reichen nicht für {km} km bei etwa 8 kg pro 100 km: tanken oder die Fahrt verkürzen.' },
      overflow: { kid: 'Das Messglas würde überlaufen! Tippe zuerst darauf und gib das Wasser den Blumen.', sci: 'Das Messglas fasst 300 L: zuerst leeren.' },
      drive: { kid: 'Los geht es, leise wie ein Flüstern: Der Motor ist elektrisch, und den Strom macht die Brennstoffzelle. Schau, was heraustropft!', sci: 'Die Brennstoffzelle speist einen Elektromotor; eine Batterie hilft beim Beschleunigen und speichert Energie beim Bremsen. Das einzige Abgas ist Wasser, als Dampf und Tropfen.' },
      back: { kid: 'Zurück nach {km} km! Er hat {kg} kg Wasserstoff verbraucht und {l} Liter Wasser gemacht. Schau auf das Messglas!', sci: '{km} km: {kg} kg H₂ verbraucht, {l} L Wasser entstanden, das 9-Fache der Masse des Wasserstoffs.' },
      pour: { kid: 'Für die Blumen: {l} Liter sauberes Wasser, gemacht aus {kg} kg Wasserstoff und Sauerstoff aus der Luft.', sci: '{l} L Wasser aus {kg} kg H₂. Wasser aus einer Brennstoffzelle ist sehr rein, fast wie destilliertes Wasser.' },
      pourEmpty: { kid: 'Das Messglas ist leer. Lass den Bus fahren, um es zu füllen!', sci: 'Leer: zuerst eine Fahrt machen.' },
    },
    panel: {
      kid: [
        'Dieser Bus hat keinen Dieselmotor. Auf seinem Dach sind Tanks mit Wasserstoff, und innen macht eine Brennstoffzelle daraus Strom für den Motor. Tanken dauert nur ein paar Minuten.',
        'Für jedes Kilogramm Wasserstoff, das er verbraucht, macht der Bus 9 Liter Wasser. So viel, weil der Sauerstoff im Wasser aus der Luft kommt: Ein Sauerstoffatom wiegt so viel wie 16 Wasserstoffatome. Etwa 8 kg Wasserstoff bringen den Bus 100 km weit und ergeben etwa 72 Liter Wasser. Hier fangen wir es im Messglas auf; auf der Straße tropft es weg oder verfliegt als Dampf.',
      ],
      sci: [
        'Ein 12 m langer Brennstoffzellenbus trägt etwa 35 kg H₂ bei 350 bar in Kohlefasertanks auf dem Dach und braucht etwa 7 bis 9 kg pro 100 km (in den europäischen JIVE-Projekten im Mittel etwa 7,5 bis 8). Eine Batterie arbeitet mit der Brennstoffzelle zusammen: Sie nimmt beim Bremsen Energie zurück und hilft beim Beschleunigen.',
        '2 H₂ + O₂ → 2 H₂O: 4 g Wasserstoff und 32 g Sauerstoff ergeben 36 g Wasser, also gibt 1 kg H₂ etwa 9 kg (8,9 kg) Wasser. Bei 8 kg pro 100 km sind das etwa 72 L pro 100 km, das meiste als Dampf. Wasser aus einer Brennstoffzelle ist sehr rein, fast wie destilliertes Wasser.',
      ],
    },
  },
  train: {
    label: 'Der Wasserstoffzug',
    title: 'Der Coradia iLint',
    signs: { tanks: 'Wasserstofftanks', cell: 'Brennstoffzelle', battery: 'Batterien' },
    hints: { open: 'Tippe auf den Zug, um hineinzuschauen', close: 'Tippe auf den Zug, um das Dach zu schließen' },
    buttons: { open: 'Hineinschauen', close: 'Dach schließen' },
    says: {
      open: { kid: 'Schau auf sein Dach: Tanks mit Wasserstoff und eine Brennstoffzelle, wie beim Bus, nur größer. Unter dem Boden Batterien. Und über den Gleisen hängen keine Drähte: Der Zug macht seinen Strom selbst.', sci: 'Jeder Wagen hat Wasserstofftanks und ein Brennstoffzellenmodul auf dem Dach und Lithium-Ionen-Batterien unter dem Boden, die Bremsenergie speichern; Elektromotoren treiben ihn an, bis 140 km/h. Die einzige Emission ist Wasser.' },
      close: { kid: 'Dach zu.', sci: 'Verkleidung geschlossen.' },
    },
    panel: {
      kid: [
        'Der Coradia iLint war der erste Zug der Welt, der Fahrgäste mit Wasserstoff beförderte. Seit 2018 fährt er in Niedersachsen, im Norden Deutschlands, auf Strecken ohne Oberleitung, wo vorher nur Dieselzüge fahren konnten.',
        'Aus ihm kommt nur Wasser, und er ist viel leiser als ein Dieselzug.',
      ],
      sci: [
        'Alstoms Coradia iLint nahm im September 2018 den Fahrgastbetrieb zwischen Cuxhaven, Bremerhaven, Bremervörde und Buxtehude auf, einer Strecke ohne Elektrifizierung. 2022 übernahm eine Flotte von 14 Zügen die Strecke, betankt in Bremervörde an der ersten Wasserstofftankstelle für Personenzüge.',
        'Jeder seiner zwei Wagen hat ein Brennstoffzellenmodul und Wasserstofftanks auf dem Dach und Lithium-Ionen-Batterien darunter; die Batterien speichern Bremsenergie und helfen beim Beschleunigen. Höchstgeschwindigkeit 140 km/h.',
      ],
    },
  },
  space: {
    label: 'Wasserstoff im Weltraum',
    title: 'Wasserstoff im Weltraum',
    signs: { plate: 'Wasserstoff im Weltraum', shuttle: 'Spaceshuttle (Modell)', cell: 'Apollo-Brennstoffzelle, echte Größe', csm: 'Apollo-Raumschiff (Modell)', bag: 'Trinkwasser' },
    hints: { shuttle: 'Tippe auf das Shuttle', cell: 'Tippe auf die Apollo-Brennstoffzelle', bag: 'Tippe auf den Wasserbeutel', any: 'Tippe auf das Shuttle, die Brennstoffzelle oder den Beutel' },
    buttons: { shuttle: 'Shuttle-Triebwerke starten', cell: 'Brennstoffzelle laufen lassen', bag: 'Das Wasser ansehen' },
    says: {
      shuttle: { kid: 'Haupttriebwerke an! Die drei Triebwerke verbrennen flüssigen Wasserstoff mit flüssigem Sauerstoff. Die Flammen sind hellblau, fast unsichtbar, und die Wolken sind Dampf: Wasser!', sci: 'Zündung der RS-25, 6,6 s vor den Feststoffboostern: flüssiger Wasserstoff und flüssiger Sauerstoff im Massenverhältnis von etwa 6 zu 1, brennstoffreich, daher ist das Abgas vor allem überhitzter Wasserdampf mit etwas unverbranntem Wasserstoff. Ein großer Teil der weißen Wolke war das Wasser der Schallunterdrückungsanlage der Startrampe, zu Dampf geworden.' },
      cell: { kid: 'Die Brennstoffzelle summt: Wasserstoff und Sauerstoff aus den Tanks des Raumschiffs machen Strom und Wasser. Das Wasser fließt hinauf zu den Astronauten.', sci: 'Eine der drei alkalischen Brennstoffzellen von Pratt & Whitney: 31 Zellen in Reihe, etwa 27 bis 31 V, normalerweise bis etwa 1,4 kW je Einheit, betrieben bei etwa 200 °C mit konzentrierter Kalilauge. Das entstehende Wasser floss in den Trinkwassertank der Kommandokapsel.' },
      bag: { kid: 'Schau, die Bläschen! Das Wasser der ersten Apollo-Flüge enthielt Wasserstoffgas. Wasserstoff ist nicht giftig, aber ein Getränk voller Bläschen ist nicht schön, darum holte ab Apollo 12 ein Abscheider das Gas heraus.', sci: 'Das Wasser der ersten Kommandokapseln enthielt zu viel Wasserstoffgas. Ab Apollo 12 entfernte es ein Abscheider aus Palladium-Silber-Röhrchen, durch die Wasserstoff diffundiert, und ließ es ins All ab.' },
      bagEmpty: { kid: 'Der Beutel ist leer. Tippe auf die Brennstoffzelle, um Wasser zu machen!', sci: 'Leer: zuerst die Brennstoffzelle laufen lassen.' },
    },
    panel: {
      kid: [
        'Wasserstoff ist der leichteste Treibstoff von allen, darum lieben Raketen ihn. Der große orange Tank des Spaceshuttles enthielt flüssigen Wasserstoff bei −253 °C, und seine drei Haupttriebwerke verbrannten ihn mit flüssigem Sauerstoff. Heraus kam vor allem Dampf.',
        'Das Apollo-Mutterschiff, das die Astronauten zum Mond und zurück brachte, bekam seinen Strom aus drei Brennstoffzellen, die Wasserstoff und Sauerstoff leise verbanden. Das Wasser, das sie machten, war das Trinkwasser der Astronauten, mehr, als sie trinken konnten; der Rest wurde ins All abgelassen.',
      ],
      sci: [
        'Die drei RS-25-Haupttriebwerke des Shuttles verbrannten flüssigen Wasserstoff und flüssigen Sauerstoff aus dem Außentank; die zwei Booster verbrannten Festtreibstoff. Pro Kilogramm liefert Wasserstoff mehr Energie als jeder andere chemische Brennstoff, aber er braucht viel Platz: Flüssiger Wasserstoff wiegt nur etwa 71 g pro Liter.',
        'Jedes Apollo-Servicemodul trug drei Brennstoffzellen von Pratt & Whitney nach der Bauart von Francis Thomas Bacon: alkalische Zellen, in denen Hydroxid-Ionen (OH⁻) statt Protonen den Elektrolyten durchqueren, sodass das Wasser auf der Wasserstoffseite entsteht. Aus Kryotanks gespeist, versorgten sie das Raumschiff mit Strom und Trinkwasser; der Überschuss wurde abgelassen.',
      ],
    },
  },
}

export const FUEL_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
