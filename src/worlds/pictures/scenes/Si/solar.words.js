// The words of silicon's solar room ("How does sunlight become electricity?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Si.js (the easel shows it). {light}, {power}, {v}, {n}, {e}: numbers filled in.
// Facts: photon energies E = 1240 / wavelength (eV, nm); silicon's band gap 1.12 eV; Vanguard 1 from the
// US Naval Research Laboratory and NASA (sources give 15 to 16.5 cm and 1.46 to 1.6 kg: "about").
export const SOLAR_WORDS = {
  en: {
    title: 'The sunny hill',
    greet: {
      kid: 'We are inside the picture! Here are the solar panel, the bulb and the sun. You can move the sun, look inside a solar cell and launch a satellite. The story of this picture is on the easel.',
      sci: 'The picture\'s hilltop: a silicon solar panel wired to a bulb, one solar cell cut open and made giant, and Vanguard 1, the first satellite to run on sunlight. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Sunlight is made of tiny packets of light called photons. A solar cell catches them.',
        'A solar panel has no moving parts. It just sits in the sun and quietly makes electricity.',
        'Each solar cell gives only a small push, so a panel joins many of them in a row.',
      ],
      sci: [
        'Silicon is a semiconductor: its band gap, 1.12 eV, lies between a metal\'s (none) and glass\'s (about 9 eV).',
        'A panel joins its cells in series: 60 cells of about 0.6 V each give a few tens of volts.',
        'Solar-grade silicon is purified to at least 99.9999%; crystalline silicon makes more than nine in ten panels.',
      ],
    },
    panel: {
      label: 'The panel and the sun',
      move: 'Move the sun on',
      title: 'Light in, electricity out',
      meter: 'The meter',
      light: 'Sunlight: {v} W/m²',
      power: 'Electricity: {v} W/m²',
      volt: 'Each cell: {v} V',
      time: 'Time of day',
      cloudOn: 'Bring a cloud',
      cloudOff: 'Clear the sky',
      says: {
        morning: { kid: 'Good morning! The sun is low and shines on the panel from the side, so the bulb is still dim.', sci: 'Morning: the light strikes the panel at a slant and crosses more air. {light} W/m² falls on it; it gives {power} W/m².' },
        noon: { kid: 'Midday! The sun shines almost straight at the panel, and the bulb is at its brightest.', sci: 'Midday: the sun is 58° up, almost face-on to the panel. {light} W/m² falls on it; at 21% it gives {power} W/m².' },
        afternoon: { kid: 'Afternoon. The sun is going down, and the panel makes a little less.', sci: 'Afternoon: {light} W/m² on the panel, {power} W/m² of electricity.' },
        evening: { kid: 'Evening: the sun is near the hills. Slanting light gives the panel only a little.', sci: 'Evening: the light comes in slanting and through far more air. {light} W/m²; {power} W/m².' },
        night: { kid: 'Night! No sunlight, no electricity. Homes with solar panels now use a battery or the grid.', sci: 'Night: 0 W/m². After sunset solar power needs storage, such as batteries, or the grid.' },
        cloud: { kid: 'A cloud covers the sun: look how the bulb dims!', sci: 'A thick cloud: here the light on the panel falls to a fifth, and the power with it.' },
        clear: { kid: 'The cloud has gone. Full sunshine again!', sci: 'Clear sky: the direct light is back.' },
      },
      panel: {
        kid: [
          'Move the sun across the sky and watch the meter and the bulb. The panel makes the most electricity when the sun shines straight at it. Slanting light is spread thinner over the panel, and a low sun also has to shine through much more air.',
          'In full sunshine, a square metre facing the sun gets about 1000 watts of light, as much power as ten bright old 100-watt bulbs. Today\'s panels turn about a fifth of it into electricity. That is why a house needs many panels on its roof.',
        ],
        sci: [
          'In full sun under a clear sky, about 1000 W falls on each square metre facing the sun (the standard test light for panels). On a tilted panel only the part along its normal counts: the light on it is the full light times the cosine of the angle between the sun and the panel\'s face. A low sun also crosses more air (at 30° up, twice as much as overhead), which scatters and absorbs part of it.',
          'Today\'s silicon panels turn about 20 to 23% of the light into electricity; this one 21%. A cell\'s voltage hardly changes with the light (about 0.6 V, falling only slowly as the light dims); the current follows the light, and so does the power. This panel is tilted 40° to face the midday sun.',
        ],
      },
    },
    cell: {
      label: 'Inside a solar cell',
      fire: { red: 'Fire a red photon', green: 'Fire a green photon', blue: 'Fire a blue photon', ir: 'Fire an infrared photon' },
      colors: {
        red: { kid: 'Red', sci: 'Red, 650 nm' },
        green: { kid: 'Green', sci: 'Green, 530 nm' },
        blue: { kid: 'Blue', sci: 'Blue, 450 nm' },
        ir: { kid: 'Infrared', sci: 'Infrared, 1300 nm' },
      },
      title: 'Photons, electrons and holes',
      count: 'Photons: {n}   Electrons freed: {e}',
      legend: {
        title: 'Inside the cell',
        si: 'silicon',
        p: 'phosphorus: one electron extra',
        b: 'boron: one electron short',
        electron: 'free electron',
        hole: 'hole',
        n: 'top layer: n',
        pl: 'bottom layer: p',
      },
      says: {
        red: { kid: 'Red light! It knocks an electron loose, and the border pushes it up into the wire. Round it goes, lighting the little bulb!', sci: 'Red, 650 nm: 1.91 eV, more than the 1.12 eV gap. One electron freed; the other 0.79 eV becomes heat.' },
        green: { kid: 'Green light frees an electron too, and warms the silicon a little.', sci: 'Green, 530 nm: 2.34 eV. One electron; the extra 1.22 eV becomes heat.' },
        blue: { kid: 'Blue light has the most energy, but it still frees just one electron. The rest turns into heat: see the warm glow?', sci: 'Blue, 450 nm: 2.76 eV. Still one electron; 1.64 eV, well over half, is lost as heat.' },
        ir: { kid: 'The infrared went straight through! It is too weak to knock an electron loose.', sci: 'Infrared, 1300 nm: 0.95 eV, less than the 1.12 eV gap. Silicon is transparent to it.' },
      },
      panel: {
        kid: [
          'Here is one solar cell, made giant. The top layer has a few phosphorus atoms mixed into the silicon: each brings one electron more than it needs, free to wander. The bottom layer has boron atoms: each is one electron short, and the gap it leaves is called a hole. Where the two layers meet, a border pushes electrons up and holes down.',
          'Light comes in tiny packets called photons. Fire one: if it has enough energy, it knocks an electron loose. The border pushes the electron up into the wire; it goes round through the bulb and comes back from below to fill a hole. Infrared is too weak and goes straight through. Blue has more energy than it needs, and the extra turns into heat.',
        ],
        sci: [
          'Phosphorus has five valence electrons, one more than silicon\'s four, and donates one (n-type); boron has three and accepts one, leaving a hole (p-type). Where the layers meet, electrons and holes have crossed and cancelled, leaving the fixed P+ and B− ions: a depletion region whose built-in electric field drives electrons toward the n side and holes toward the p side.',
          'A photon above the band gap, 1.12 eV (shorter than about 1100 nm), lifts an electron into the conduction band; the field separates the pair, and the electron does work in the outer circuit before it recombines with a hole at the back contact. The excess energy is lost as heat within about a picosecond, and longer wavelengths pass through: these losses, with some unavoidable recombination, limit a silicon cell to about 29%. Not to scale: blue is absorbed within about half a micrometre, red within a few micrometres, and the top layer is under a micrometre thick on a wafer about 0.17 mm thick.',
        ],
      },
    },
    vanguard: {
      label: 'Vanguard 1',
      launch: 'Launch it',
      listen: 'Listen to its radio',
      again: 'Launch it again',
      real: 'Real size, beside a grapefruit',
      title: 'The grapefruit satellite',
      says: {
        launch: { kid: 'Three, two, one... liftoff! Watch it climb to the Earth up there.', sci: '17 March 1958, Cape Canaveral: a three-stage Vanguard rocket lifts off.' },
        orbit: { kid: 'It is in orbit! Hear the beeps? Its radio runs on sunlight from six little solar cells.', sci: 'In orbit, 654 by 3969 km above the Earth, once round every 134 minutes. The beacon at 108.03 MHz runs on six solar cells.' },
        listen: { kid: 'Beep, beep: that is its radio. It kept going on sunlight for six years, until 1964.', sci: 'The solar-powered beacon (5 mW) was heard until May 1964; the battery-powered transmitter (10 mW) fell silent after about 20 days.' },
      },
      panel: {
        kid: [
          'Vanguard 1 is a ball of aluminium about 16 cm across, with six thin aerials and six little silicon solar cells on its body. It weighs about one and a half kilograms. It was so small that a Soviet leader made fun of it and called it the grapefruit satellite. See it at real size beside the launch pad.',
          'It went up on 17 March 1958, the first satellite to run on sunlight. Its battery radio went quiet within a few weeks, but the solar radio kept beeping until 1964. Vanguard 1 is still up there today, the oldest human-made thing in orbit, and scientists think it will stay up for about 240 years in all.',
        ],
        sci: [
          'Built by the US Naval Research Laboratory: an aluminium sphere about 16 cm across and about 1.5 kg, with six 30 cm aerials. A 10 mW, 108 MHz transmitter ran on a mercury battery and fell silent after about 20 days; a 5 mW, 108.03 MHz beacon ran on six silicon solar cells and was heard until May 1964. It was the fourth satellite, after Sputnik 1 and 2 and Explorer 1, and the first with solar power.',
          'Its first orbit was 654 by 3969 km, inclined 34.25°, once round every 134 minutes. Tracking that orbit showed that the Earth is very slightly pear-shaped. Vanguard 1 and its third stage are the oldest human-made objects still in orbit; it is expected to stay up for about 240 years in all.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A colina do sol',
    greet: {
      kid: 'Estamos dentro da imagem! Aqui estão o painel solar, a lâmpada e o Sol. Podes mover o Sol, espreitar dentro de uma célula solar e lançar um satélite. A história desta imagem está no cavalete.',
      sci: 'O alto da colina da imagem: um painel solar de silício ligado a uma lâmpada, uma célula solar aberta e em ponto gigante, e o Vanguard 1, o primeiro satélite a funcionar com a luz do Sol. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'A luz do Sol é feita de pacotinhos de luz chamados fotões. Uma célula solar apanha-os.',
        'Um painel solar não tem peças a mexer. Fica ao sol e faz eletricidade em silêncio.',
        'Cada célula solar dá só um empurrãozinho, por isso um painel liga muitas em fila.',
      ],
      sci: [
        'O silício é um semicondutor: a sua banda proibida, 1,12 eV, fica entre a de um metal (nenhuma) e a do vidro (cerca de 9 eV).',
        'Um painel liga as células em série: 60 células de cerca de 0,6 V cada dão algumas dezenas de volts.',
        'O silício de qualidade solar é purificado a pelo menos 99,9999%; o silício cristalino representa mais de nove em cada dez painéis.',
      ],
    },
    panel: {
      label: 'O painel e o Sol',
      move: 'Mover o Sol',
      title: 'Entra luz, sai eletricidade',
      meter: 'O medidor',
      light: 'Luz do Sol: {v} W/m²',
      power: 'Eletricidade: {v} W/m²',
      volt: 'Cada célula: {v} V',
      time: 'Hora do dia',
      cloudOn: 'Trazer uma nuvem',
      cloudOff: 'Limpar o céu',
      says: {
        morning: { kid: 'Bom dia! O Sol está baixo e bate no painel de lado, por isso a lâmpada ainda está fraquinha.', sci: 'Manhã: a luz chega ao painel inclinada e atravessa mais ar. Recebe {light} W/m² e dá {power} W/m².' },
        noon: { kid: 'Meio-dia! O Sol bate quase a direito no painel, e a lâmpada está no máximo.', sci: 'Meio-dia: o Sol está a 58° de altura, quase de frente para o painel. Recebe {light} W/m²; a 21%, dá {power} W/m².' },
        afternoon: { kid: 'Tarde. O Sol está a descer, e o painel faz um pouco menos.', sci: 'Tarde: {light} W/m² no painel, {power} W/m² de eletricidade.' },
        evening: { kid: 'Fim da tarde: o Sol está perto dos montes. A luz inclinada dá muito pouco ao painel.', sci: 'Fim da tarde: a luz chega inclinada e atravessa muito mais ar. {light} W/m²; {power} W/m².' },
        night: { kid: 'Noite! Sem luz do Sol, não há eletricidade. As casas com painéis solares usam agora uma bateria ou a rede.', sci: 'Noite: 0 W/m². Depois do pôr do Sol, a energia solar precisa de armazenamento, como baterias, ou da rede.' },
        cloud: { kid: 'Uma nuvem tapa o Sol: olha como a lâmpada enfraquece!', sci: 'Uma nuvem espessa: aqui a luz no painel desce para um quinto, e a potência com ela.' },
        clear: { kid: 'A nuvem foi-se embora. Sol em cheio outra vez!', sci: 'Céu limpo: a luz direta voltou.' },
      },
      panel: {
        kid: [
          'Move o Sol pelo céu e vê o medidor e a lâmpada. O painel faz mais eletricidade quando o Sol bate a direito nele. A luz inclinada espalha-se mais fina pelo painel, e um Sol baixo ainda tem de atravessar muito mais ar.',
          'Com sol em cheio, um metro quadrado virado para o Sol recebe cerca de 1000 watts de luz, tanta potência como dez lâmpadas antigas de 100 watts. Os painéis de hoje transformam cerca de um quinto disso em eletricidade. É por isso que uma casa precisa de muitos painéis no telhado.',
        ],
        sci: [
          'Com sol em cheio e céu limpo, chegam cerca de 1000 W a cada metro quadrado virado para o Sol (a luz-padrão com que se testam os painéis). Num painel inclinado só conta a parte ao longo da sua normal: a luz que recebe é a luz total vezes o cosseno do ângulo entre o Sol e a face do painel. Um Sol baixo também atravessa mais ar (a 30° de altura, o dobro do que na vertical), que dispersa e absorve parte da luz.',
          'Os painéis de silício de hoje transformam cerca de 20 a 23% da luz em eletricidade; este, 21%. A tensão de uma célula quase não muda com a luz (cerca de 0,6 V, que só desce devagar quando a luz enfraquece); a corrente acompanha a luz, e a potência também. Este painel está inclinado a 40°, virado para o Sol do meio-dia.',
        ],
      },
    },
    cell: {
      label: 'Dentro de uma célula solar',
      fire: { red: 'Disparar um fotão vermelho', green: 'Disparar um fotão verde', blue: 'Disparar um fotão azul', ir: 'Disparar um fotão infravermelho' },
      colors: {
        red: { kid: 'Vermelho', sci: 'Vermelho, 650 nm' },
        green: { kid: 'Verde', sci: 'Verde, 530 nm' },
        blue: { kid: 'Azul', sci: 'Azul, 450 nm' },
        ir: { kid: 'Infravermelho', sci: 'Infravermelho, 1300 nm' },
      },
      title: 'Fotões, eletrões e lacunas',
      count: 'Fotões: {n}   Eletrões soltos: {e}',
      legend: {
        title: 'Dentro da célula',
        si: 'silício',
        p: 'fósforo: um eletrão a mais',
        b: 'boro: um eletrão a menos',
        electron: 'eletrão livre',
        hole: 'lacuna',
        n: 'camada de cima: n',
        pl: 'camada de baixo: p',
      },
      says: {
        red: { kid: 'Luz vermelha! Solta um eletrão, e a fronteira empurra-o para cima, para o fio. Lá vai ele à volta, a acender a lampadazinha!', sci: 'Vermelho, 650 nm: 1,91 eV, mais do que a banda proibida de 1,12 eV. Um eletrão solto; os outros 0,79 eV passam a calor.' },
        green: { kid: 'A luz verde também solta um eletrão, e aquece um bocadinho o silício.', sci: 'Verde, 530 nm: 2,34 eV. Um eletrão; os 1,22 eV a mais passam a calor.' },
        blue: { kid: 'A luz azul tem mais energia, mas mesmo assim só solta um eletrão. O resto vira calor: vês o brilho quente?', sci: 'Azul, 450 nm: 2,76 eV. Continua a ser um eletrão; 1,64 eV, bem mais de metade, perdem-se em calor.' },
        ir: { kid: 'O infravermelho passou a direito! É fraco demais para soltar um eletrão.', sci: 'Infravermelho, 1300 nm: 0,95 eV, menos do que a banda proibida de 1,12 eV. O silício é transparente para ele.' },
      },
      panel: {
        kid: [
          'Aqui está uma célula solar, em ponto gigante. A camada de cima tem alguns átomos de fósforo misturados no silício: cada um traz um eletrão a mais do que precisa, livre para passear. A camada de baixo tem átomos de boro: a cada um falta um eletrão, e o buraco que fica chama-se lacuna. Onde as duas camadas se encontram, uma fronteira empurra os eletrões para cima e as lacunas para baixo.',
          'A luz vem em pacotinhos chamados fotões. Dispara um: se tiver energia suficiente, solta um eletrão. A fronteira empurra o eletrão para cima, para o fio; ele dá a volta pela lâmpada e volta por baixo para tapar uma lacuna. O infravermelho é fraco demais e passa a direito. O azul tem mais energia do que precisa, e o que sobra vira calor.',
        ],
        sci: [
          'O fósforo tem cinco eletrões de valência, mais um do que os quatro do silício, e cede um (tipo n); o boro tem três e aceita um, deixando uma lacuna (tipo p). Onde as camadas se encontram, eletrões e lacunas atravessaram e anularam-se, deixando os iões fixos P+ e B−: uma zona de depleção cujo campo elétrico interno leva os eletrões para o lado n e as lacunas para o lado p.',
          'Um fotão acima da banda proibida, 1,12 eV (comprimento de onda inferior a cerca de 1100 nm), faz subir um eletrão para a banda de condução; o campo separa o par, e o eletrão trabalha no circuito exterior antes de se recombinar com uma lacuna no contacto de trás. A energia a mais perde-se em calor em cerca de um picossegundo, e os comprimentos de onda maiores atravessam: estas perdas, com alguma recombinação inevitável, limitam uma célula de silício a cerca de 29%. Fora de escala: o azul é absorvido em cerca de meio micrómetro, o vermelho em alguns micrómetros, e a camada de cima tem menos de um micrómetro numa bolacha com cerca de 0,17 mm.',
        ],
      },
    },
    vanguard: {
      label: 'O Vanguard 1',
      launch: 'Lançar',
      listen: 'Ouvir o rádio',
      again: 'Lançar outra vez',
      real: 'Tamanho real, ao lado de uma toranja',
      title: 'O satélite toranja',
      says: {
        launch: { kid: 'Três, dois, um... descolagem! Vê-o subir até à Terra lá em cima.', sci: '17 de março de 1958, Cabo Canaveral: um foguetão Vanguard de três andares descola.' },
        orbit: { kid: 'Está em órbita! Ouves os bipes? O rádio dele funciona com a luz do Sol de seis pequenas células solares.', sci: 'Em órbita, entre 654 e 3969 km acima da Terra, uma volta a cada 134 minutos. O emissor de 108,03 MHz funciona com seis células solares.' },
        listen: { kid: 'Bip, bip: é o rádio dele. Continuou a funcionar com a luz do Sol durante seis anos, até 1964.', sci: 'O emissor solar (5 mW) ouviu-se até maio de 1964; o emissor a pilha (10 mW) calou-se ao fim de cerca de 20 dias.' },
      },
      panel: {
        kid: [
          'O Vanguard 1 é uma bola de alumínio com cerca de 16 cm, com seis antenas finas e seis pequenas células solares de silício no corpo. Pesa cerca de quilo e meio. Era tão pequeno que um líder soviético fez troça dele e lhe chamou o satélite toranja. Vê-o em tamanho real ao lado da rampa de lançamento.',
          'Subiu a 17 de março de 1958, o primeiro satélite a funcionar com a luz do Sol. O rádio a pilha calou-se em poucas semanas, mas o rádio solar continuou a apitar até 1964. O Vanguard 1 ainda lá está hoje, a coisa feita pelo ser humano há mais tempo em órbita, e os cientistas pensam que vai ficar lá em cima cerca de 240 anos ao todo.',
        ],
        sci: [
          'Construído pelo Laboratório de Investigação Naval dos EUA: uma esfera de alumínio com cerca de 16 cm e cerca de 1,5 kg, com seis antenas de 30 cm. Um emissor de 10 mW e 108 MHz funcionava com uma pilha de mercúrio e calou-se ao fim de cerca de 20 dias; um emissor de 5 mW e 108,03 MHz funcionava com seis células solares de silício e ouviu-se até maio de 1964. Foi o quarto satélite, depois do Sputnik 1 e 2 e do Explorer 1, e o primeiro com energia solar.',
          'A primeira órbita foi de 654 por 3969 km, com inclinação de 34,25°, uma volta a cada 134 minutos. Seguir essa órbita mostrou que a Terra tem uma forma muito ligeiramente de pera. O Vanguard 1 e o seu terceiro andar são os objetos feitos pelo ser humano há mais tempo em órbita; espera-se que fique lá em cima cerca de 240 anos ao todo.',
        ],
      },
    },
  },
  pl: {
    title: 'Słoneczne wzgórze',
    greet: {
      kid: 'Jesteśmy w środku obrazka! Tu są panel słoneczny, żarówka i słońce. Możesz przesuwać słońce, zajrzeć do środka ogniwa słonecznego i wystrzelić satelitę. Historia tego obrazka jest na sztaludze.',
      sci: 'Szczyt wzgórza z obrazka: krzemowy panel słoneczny połączony z żarówką, jedno ogniwo słoneczne rozcięte i powiększone do olbrzymich rozmiarów oraz Vanguard 1, pierwszy satelita zasilany światłem słonecznym. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Światło słoneczne składa się z malutkich porcji światła, zwanych fotonami. Ogniwo słoneczne je łapie.',
        'Panel słoneczny nie ma ruchomych części. Po prostu stoi w słońcu i po cichu robi prąd.',
        'Każde ogniwo popycha elektrony tylko troszkę, więc panel łączy ich wiele w rzędzie.',
      ],
      sci: [
        'Krzem jest półprzewodnikiem: jego przerwa energetyczna, 1,12 eV, leży między przerwą metalu (brak) a szkła (około 9 eV).',
        'Panel łączy ogniwa szeregowo: 60 ogniw po około 0,6 V daje kilkadziesiąt woltów.',
        'Krzem do ogniw oczyszcza się do co najmniej 99,9999%; krzem krystaliczny to ponad dziewięć na dziesięć paneli.',
      ],
    },
    panel: {
      label: 'Panel i słońce',
      move: 'Przesuń słońce dalej',
      title: 'Światło wchodzi, prąd wychodzi',
      meter: 'Miernik',
      light: 'Światło: {v} W/m²',
      power: 'Prąd: {v} W/m²',
      volt: 'Jedno ogniwo: {v} V',
      time: 'Pora dnia',
      cloudOn: 'Przywołaj chmurę',
      cloudOff: 'Oczyść niebo',
      says: {
        morning: { kid: 'Dzień dobry! Słońce jest nisko i świeci na panel z boku, więc żarówka jeszcze słabo świeci.', sci: 'Rano: światło pada na panel ukośnie i przechodzi przez więcej powietrza. Pada na niego {light} W/m²; daje {power} W/m².' },
        noon: { kid: 'Południe! Słońce świeci prawie prosto na panel, a żarówka świeci najjaśniej.', sci: 'Południe: słońce jest 58° nad horyzontem, prawie na wprost panelu. Pada {light} W/m²; przy 21% panel daje {power} W/m².' },
        afternoon: { kid: 'Popołudnie. Słońce się obniża, a panel robi trochę mniej.', sci: 'Popołudnie: {light} W/m² na panelu, {power} W/m² prądu.' },
        evening: { kid: 'Wieczór: słońce jest blisko wzgórz. Ukośne światło daje panelowi niewiele.', sci: 'Wieczór: światło pada ukośnie i przechodzi przez dużo więcej powietrza. {light} W/m²; {power} W/m².' },
        night: { kid: 'Noc! Bez światła słonecznego nie ma prądu. Domy z panelami korzystają teraz z akumulatora albo z sieci.', sci: 'Noc: 0 W/m². Po zachodzie słońca energia słoneczna wymaga magazynu, na przykład akumulatorów, albo sieci.' },
        cloud: { kid: 'Chmura zasłania słońce: zobacz, jak żarówka przygasa!', sci: 'Gęsta chmura: tutaj światło na panelu spada do jednej piątej, a moc razem z nim.' },
        clear: { kid: 'Chmura odpłynęła. Znowu pełne słońce!', sci: 'Czyste niebo: światło bezpośrednie wróciło.' },
      },
      panel: {
        kid: [
          'Przesuwaj słońce po niebie i patrz na miernik i żarówkę. Panel robi najwięcej prądu, kiedy słońce świeci prosto na niego. Ukośne światło rozkłada się cieniej na panelu, a niskie słońce musi jeszcze przejść przez dużo więcej powietrza.',
          'W pełnym słońcu metr kwadratowy zwrócony do słońca dostaje około 1000 watów światła, tyle mocy co dziesięć jasnych starych żarówek po 100 watów. Dzisiejsze panele zamieniają w prąd około jednej piątej. Dlatego dom potrzebuje wielu paneli na dachu.',
        ],
        sci: [
          'W pełnym słońcu przy czystym niebie na każdy metr kwadratowy zwrócony do słońca pada około 1000 W (standardowe światło, w którym testuje się panele). Na pochylony panel liczy się tylko składowa wzdłuż jego normalnej: światło na panelu to pełne światło razy cosinus kąta między słońcem a powierzchnią panelu. Niskie słońce przechodzi też przez więcej powietrza (przy 30° nad horyzontem dwa razy więcej niż w zenicie), które rozprasza i pochłania część światła.',
          'Dzisiejsze panele krzemowe zamieniają w prąd około 20 do 23% światła; ten 21%. Napięcie ogniwa prawie nie zależy od światła (około 0,6 V, maleje tylko powoli, gdy światło słabnie); prąd podąża za światłem, a z nim moc. Ten panel jest pochylony pod kątem 40°, w stronę słońca w południe.',
        ],
      },
    },
    cell: {
      label: 'Wnętrze ogniwa słonecznego',
      fire: { red: 'Wystrzel czerwony foton', green: 'Wystrzel zielony foton', blue: 'Wystrzel niebieski foton', ir: 'Wystrzel foton podczerwieni' },
      colors: {
        red: { kid: 'Czerwony', sci: 'Czerwony, 650 nm' },
        green: { kid: 'Zielony', sci: 'Zielony, 530 nm' },
        blue: { kid: 'Niebieski', sci: 'Niebieski, 450 nm' },
        ir: { kid: 'Podczerwień', sci: 'Podczerwień, 1300 nm' },
      },
      title: 'Fotony, elektrony i dziury',
      count: 'Fotony: {n}   Uwolnione elektrony: {e}',
      legend: {
        title: 'Wnętrze ogniwa',
        si: 'krzem',
        p: 'fosfor: jeden elektron za dużo',
        b: 'bor: brakuje jednego elektronu',
        electron: 'swobodny elektron',
        hole: 'dziura',
        n: 'górna warstwa: n',
        pl: 'dolna warstwa: p',
      },
      says: {
        red: { kid: 'Czerwone światło! Wybija elektron, a granica popycha go w górę, do przewodu. Elektron obiega obwód i zapala małą żarówkę!', sci: 'Czerwony, 650 nm: 1,91 eV, więcej niż przerwa 1,12 eV. Jeden uwolniony elektron; pozostałe 0,79 eV zamienia się w ciepło.' },
        green: { kid: 'Zielone światło też uwalnia elektron i trochę ogrzewa krzem.', sci: 'Zielony, 530 nm: 2,34 eV. Jeden elektron; nadwyżka 1,22 eV zamienia się w ciepło.' },
        blue: { kid: 'Niebieskie światło ma najwięcej energii, ale i tak uwalnia tylko jeden elektron. Reszta zamienia się w ciepło: widzisz ciepły blask?', sci: 'Niebieski, 450 nm: 2,76 eV. Nadal jeden elektron; 1,64 eV, wyraźnie ponad połowa, idzie na ciepło.' },
        ir: { kid: 'Podczerwień przeszła na wylot! Jest za słaba, żeby wybić elektron.', sci: 'Podczerwień, 1300 nm: 0,95 eV, mniej niż przerwa 1,12 eV. Krzem jest dla niej przezroczysty.' },
      },
      panel: {
        kid: [
          'Oto jedno ogniwo słoneczne, powiększone do olbrzymich rozmiarów. W górnej warstwie do krzemu domieszano trochę atomów fosforu: każdy przynosi o jeden elektron więcej, niż potrzebuje, i ten elektron może swobodnie wędrować. W dolnej warstwie są atomy boru: każdemu brakuje jednego elektronu, a puste miejsce nazywa się dziurą. Tam, gdzie warstwy się spotykają, granica popycha elektrony w górę, a dziury w dół.',
          'Światło przychodzi w malutkich porcjach, zwanych fotonami. Wystrzel jeden: jeśli ma dość energii, wybije elektron. Granica popycha elektron w górę, do przewodu; elektron obiega obwód przez żarówkę i wraca od dołu, żeby wypełnić dziurę. Podczerwień jest za słaba i przechodzi na wylot. Niebieskie światło ma więcej energii, niż trzeba, a nadwyżka zamienia się w ciepło.',
        ],
        sci: [
          'Fosfor ma pięć elektronów walencyjnych, o jeden więcej niż cztery elektrony krzemu, i oddaje jeden (typ n); bor ma trzy i przyjmuje jeden, zostawiając dziurę (typ p). Tam, gdzie warstwy się stykają, elektrony i dziury przeszły na drugą stronę i się zneutralizowały, zostawiając nieruchome jony P+ i B−: warstwę zubożoną, której wbudowane pole elektryczne pcha elektrony w stronę n, a dziury w stronę p.',
          'Foton o energii powyżej przerwy, 1,12 eV (krótszy niż około 1100 nm), przenosi elektron do pasma przewodnictwa; pole rozdziela parę, a elektron wykonuje pracę w obwodzie zewnętrznym, zanim zrekombinuje z dziurą przy tylnym kontakcie. Nadwyżka energii zamienia się w ciepło w ciągu około pikosekundy, a dłuższe fale przechodzą na wylot: te straty, wraz z nieuniknioną częścią rekombinacji, ograniczają sprawność ogniwa krzemowego do około 29%. Nie w skali: niebieskie światło jest pochłaniane w około pół mikrometra, czerwone w kilku mikrometrach, a górna warstwa ma poniżej mikrometra grubości na płytce grubej na około 0,17 mm.',
        ],
      },
    },
    vanguard: {
      label: 'Vanguard 1',
      launch: 'Wystrzel go',
      listen: 'Posłuchaj jego radia',
      again: 'Wystrzel go jeszcze raz',
      real: 'Prawdziwa wielkość, obok grejpfruta',
      title: 'Satelita grejpfrut',
      says: {
        launch: { kid: 'Trzy, dwa, jeden... start! Patrz, jak leci do Ziemi tam w górze.', sci: '17 marca 1958, Przylądek Canaveral: startuje trzystopniowa rakieta Vanguard.' },
        orbit: { kid: 'Jest na orbicie! Słyszysz piszczenie? Jego radio działa na światło słoneczne z sześciu małych ogniw.', sci: 'Na orbicie, od 654 do 3969 km nad Ziemią, jedno okrążenie co 134 minuty. Nadajnik 108,03 MHz zasilają ogniwa słoneczne.' },
        listen: { kid: 'Pip, pip: to jego radio. Działało na światło słoneczne przez sześć lat, aż do 1964 roku.', sci: 'Nadajnik słoneczny (5 mW) było słychać do maja 1964; nadajnik na baterię (10 mW) zamilkł po około 20 dniach.' },
      },
      panel: {
        kid: [
          'Vanguard 1 to aluminiowa kula o średnicy około 16 cm, z sześcioma cienkimi antenami i sześcioma małymi krzemowymi ogniwami słonecznymi. Waży około półtora kilograma. Był tak mały, że pewien radziecki przywódca nabijał się z niego i nazwał go satelitą grejpfrutem. Zobacz go w prawdziwej wielkości obok wyrzutni.',
          'Poleciał 17 marca 1958 roku jako pierwszy satelita zasilany światłem słonecznym. Radio na baterię zamilkło po kilku tygodniach, ale radio słoneczne piszczało aż do 1964 roku. Vanguard 1 wciąż tam jest, to najstarsza zbudowana przez ludzi rzecz na orbicie, a naukowcy sądzą, że zostanie tam w sumie około 240 lat.',
        ],
        sci: [
          'Zbudowany przez Laboratorium Badawcze Marynarki Wojennej USA: aluminiowa kula o średnicy około 16 cm i masie około 1,5 kg, z sześcioma antenami po 30 cm. Nadajnik 10 mW na 108 MHz zasilała bateria rtęciowa; zamilkł po około 20 dniach. Nadajnik 5 mW na 108,03 MHz zasilało sześć krzemowych ogniw słonecznych; było go słychać do maja 1964. Był czwartym satelitą, po Sputnikach 1 i 2 oraz Explorerze 1, i pierwszym z zasilaniem słonecznym.',
          'Jego pierwsza orbita miała 654 na 3969 km, nachylenie 34,25°, jedno okrążenie co 134 minuty. Śledzenie tej orbity pokazało, że Ziemia ma bardzo lekko gruszkowaty kształt. Vanguard 1 i jego trzeci stopień to najstarsze zbudowane przez ludzi obiekty, które wciąż są na orbicie; ma tam pozostać w sumie około 240 lat.',
        ],
      },
    },
  },
  de: {
    title: 'Der Sonnenhügel',
    greet: {
      kid: 'Wir sind im Bild! Hier sind das Solarmodul, die Glühbirne und die Sonne. Du kannst die Sonne bewegen, in eine Solarzelle hineinschauen und einen Satelliten starten. Die Geschichte dieses Bildes steht auf der Staffelei.',
      sci: 'Die Hügelkuppe aus dem Bild: ein Solarmodul aus Silicium, verbunden mit einer Glühbirne, eine aufgeschnittene, riesig vergrößerte Solarzelle und Vanguard 1, der erste Satellit, der mit Sonnenlicht lief. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Sonnenlicht besteht aus winzigen Lichtpäckchen, den Photonen. Eine Solarzelle fängt sie ein.',
        'Ein Solarmodul hat keine beweglichen Teile. Es steht einfach in der Sonne und macht leise Strom.',
        'Jede Solarzelle gibt nur einen kleinen Schubs, darum schaltet ein Modul viele hintereinander.',
      ],
      sci: [
        'Silicium ist ein Halbleiter: Seine Bandlücke, 1,12 eV, liegt zwischen der eines Metalls (keine) und der von Glas (etwa 9 eV).',
        'Ein Modul schaltet seine Zellen in Reihe: 60 Zellen mit je etwa 0,6 V ergeben einige zehn Volt.',
        'Solarsilicium wird auf mindestens 99,9999% gereinigt; kristallines Silicium macht mehr als neun von zehn Modulen aus.',
      ],
    },
    panel: {
      label: 'Das Modul und die Sonne',
      move: 'Lass die Sonne weiterziehen',
      title: 'Licht hinein, Strom heraus',
      meter: 'Das Messgerät',
      light: 'Sonnenlicht: {v} W/m²',
      power: 'Strom: {v} W/m²',
      volt: 'Jede Zelle: {v} V',
      time: 'Tageszeit',
      cloudOn: 'Hol eine Wolke',
      cloudOff: 'Mach den Himmel frei',
      says: {
        morning: { kid: 'Guten Morgen! Die Sonne steht tief und scheint von der Seite auf das Modul, darum leuchtet die Birne noch schwach.', sci: 'Morgen: Das Licht trifft schräg auf das Modul und durchquert mehr Luft. Es empfängt {light} W/m² und liefert {power} W/m².' },
        noon: { kid: 'Mittag! Die Sonne scheint fast gerade auf das Modul, und die Birne leuchtet am hellsten.', sci: 'Mittag: Die Sonne steht 58° hoch, fast frontal zum Modul. Es empfängt {light} W/m²; bei 21% liefert es {power} W/m².' },
        afternoon: { kid: 'Nachmittag. Die Sonne sinkt, und das Modul macht etwas weniger.', sci: 'Nachmittag: {light} W/m² auf dem Modul, {power} W/m² Strom.' },
        evening: { kid: 'Abend: Die Sonne steht nah an den Hügeln. Schräges Licht gibt dem Modul nur wenig.', sci: 'Abend: Das Licht fällt schräg ein und durch viel mehr Luft. {light} W/m²; {power} W/m².' },
        night: { kid: 'Nacht! Kein Sonnenlicht, kein Strom. Häuser mit Solarmodulen nehmen jetzt einen Akku oder das Stromnetz.', sci: 'Nacht: 0 W/m². Nach Sonnenuntergang braucht Solarstrom einen Speicher, etwa Akkus, oder das Netz.' },
        cloud: { kid: 'Eine Wolke verdeckt die Sonne: Schau, wie die Birne schwächer wird!', sci: 'Eine dicke Wolke: Hier sinkt das Licht auf dem Modul auf ein Fünftel, und die Leistung mit ihm.' },
        clear: { kid: 'Die Wolke ist weg. Wieder volle Sonne!', sci: 'Klarer Himmel: Das direkte Licht ist zurück.' },
      },
      panel: {
        kid: [
          'Bewege die Sonne über den Himmel und schau auf das Messgerät und die Birne. Das Modul macht am meisten Strom, wenn die Sonne gerade darauf scheint. Schräges Licht verteilt sich dünner auf dem Modul, und eine tiefe Sonne muss außerdem durch viel mehr Luft scheinen.',
          'In voller Sonne bekommt ein Quadratmeter, der zur Sonne zeigt, etwa 1000 Watt Licht, so viel Leistung wie zehn helle alte 100-Watt-Birnen. Heutige Module machen aus etwa einem Fünftel davon Strom. Darum braucht ein Haus viele Module auf dem Dach.',
        ],
        sci: [
          'In voller Sonne bei klarem Himmel fallen etwa 1000 W auf jeden Quadratmeter, der zur Sonne zeigt (das Normlicht, mit dem Module geprüft werden). Auf einem geneigten Modul zählt nur der Anteil entlang seiner Normalen: Das Licht auf ihm ist das volle Licht mal dem Kosinus des Winkels zwischen Sonne und Modulfläche. Eine tiefe Sonne durchquert außerdem mehr Luft (bei 30° Höhe doppelt so viel wie im Zenit), die einen Teil davon streut und absorbiert.',
          'Heutige Siliciummodule wandeln etwa 20 bis 23% des Lichts in Strom um; dieses 21%. Die Spannung einer Zelle ändert sich mit dem Licht kaum (etwa 0,6 V, die nur langsam sinken, wenn das Licht schwächer wird); der Strom folgt dem Licht, und mit ihm die Leistung. Dieses Modul ist um 40° geneigt, zur Mittagssonne hin.',
        ],
      },
    },
    cell: {
      label: 'In einer Solarzelle',
      fire: { red: 'Schieß ein rotes Photon', green: 'Schieß ein grünes Photon', blue: 'Schieß ein blaues Photon', ir: 'Schieß ein Infrarot-Photon' },
      colors: {
        red: { kid: 'Rot', sci: 'Rot, 650 nm' },
        green: { kid: 'Grün', sci: 'Grün, 530 nm' },
        blue: { kid: 'Blau', sci: 'Blau, 450 nm' },
        ir: { kid: 'Infrarot', sci: 'Infrarot, 1300 nm' },
      },
      title: 'Photonen, Elektronen und Löcher',
      count: 'Photonen: {n}   Befreite Elektronen: {e}',
      legend: {
        title: 'In der Zelle',
        si: 'Silicium',
        p: 'Phosphor: ein Elektron zu viel',
        b: 'Bor: ein Elektron zu wenig',
        electron: 'freies Elektron',
        hole: 'Loch',
        n: 'obere Schicht: n',
        pl: 'untere Schicht: p',
      },
      says: {
        red: { kid: 'Rotes Licht! Es schlägt ein Elektron los, und die Grenze schiebt es nach oben in den Draht. Rundherum geht es und lässt die kleine Birne leuchten!', sci: 'Rot, 650 nm: 1,91 eV, mehr als die Bandlücke von 1,12 eV. Ein Elektron befreit; die übrigen 0,79 eV werden zu Wärme.' },
        green: { kid: 'Grünes Licht befreit auch ein Elektron und wärmt das Silicium ein bisschen.', sci: 'Grün, 530 nm: 2,34 eV. Ein Elektron; die überschüssigen 1,22 eV werden zu Wärme.' },
        blue: { kid: 'Blaues Licht hat am meisten Energie, aber es befreit trotzdem nur ein Elektron. Der Rest wird zu Wärme: Siehst du das warme Leuchten?', sci: 'Blau, 450 nm: 2,76 eV. Immer noch ein Elektron; 1,64 eV, deutlich mehr als die Hälfte, gehen als Wärme verloren.' },
        ir: { kid: 'Das Infrarot ist glatt durchgegangen! Es ist zu schwach, um ein Elektron loszuschlagen.', sci: 'Infrarot, 1300 nm: 0,95 eV, weniger als die Bandlücke von 1,12 eV. Silicium ist dafür durchsichtig.' },
      },
      panel: {
        kid: [
          'Hier ist eine Solarzelle, riesig vergrößert. In der oberen Schicht sind ein paar Phosphoratome ins Silicium gemischt: Jedes bringt ein Elektron mehr mit, als es braucht, und das kann frei herumwandern. In der unteren Schicht sind Boratome: Jedem fehlt ein Elektron, und die Lücke, die es lässt, heißt Loch. Wo die beiden Schichten sich treffen, schiebt eine Grenze die Elektronen nach oben und die Löcher nach unten.',
          'Licht kommt in winzigen Päckchen, den Photonen. Schieß eins: Wenn es genug Energie hat, schlägt es ein Elektron los. Die Grenze schiebt das Elektron nach oben in den Draht; es läuft durch die Birne herum und kommt von unten zurück, um ein Loch zu füllen. Infrarot ist zu schwach und geht glatt durch. Blau hat mehr Energie als nötig, und der Überschuss wird zu Wärme.',
        ],
        sci: [
          'Phosphor hat fünf Valenzelektronen, eines mehr als die vier des Siliciums, und gibt eines ab (n-Typ); Bor hat drei und nimmt eines auf, wobei ein Loch bleibt (p-Typ). Wo die Schichten sich berühren, sind Elektronen und Löcher hinübergewandert und haben sich ausgeglichen; zurück bleiben die festen Ionen P+ und B−: eine Raumladungszone, deren eingebautes elektrisches Feld Elektronen zur n-Seite und Löcher zur p-Seite treibt.',
          'Ein Photon über der Bandlücke, 1,12 eV (kürzer als etwa 1100 nm), hebt ein Elektron ins Leitungsband; das Feld trennt das Paar, und das Elektron verrichtet im äußeren Stromkreis Arbeit, bevor es am Rückkontakt mit einem Loch rekombiniert. Die überschüssige Energie geht innerhalb von etwa einer Pikosekunde als Wärme verloren, und längere Wellen gehen hindurch: Diese Verluste begrenzen eine Siliciumzelle, zusammen mit unvermeidlicher Rekombination, auf etwa 29%. Nicht maßstabsgetreu: Blau wird innerhalb von etwa einem halben Mikrometer absorbiert, Rot innerhalb weniger Mikrometer, und die obere Schicht ist dünner als ein Mikrometer auf einer etwa 0,17 mm dicken Scheibe.',
        ],
      },
    },
    vanguard: {
      label: 'Vanguard 1',
      launch: 'Starte ihn',
      listen: 'Hör seinen Funk',
      again: 'Starte ihn noch einmal',
      real: 'Echte Größe, neben einer Grapefruit',
      title: 'Der Grapefruit-Satellit',
      says: {
        launch: { kid: 'Drei, zwei, eins... Start! Schau, wie er zur Erde da oben hinaufsteigt.', sci: '17. März 1958, Cape Canaveral: Eine dreistufige Vanguard-Rakete hebt ab.' },
        orbit: { kid: 'Er ist in der Umlaufbahn! Hörst du das Piepen? Sein Funkgerät läuft mit Sonnenlicht aus sechs kleinen Solarzellen.', sci: 'In der Umlaufbahn, 654 bis 3969 km über der Erde, eine Runde alle 134 Minuten. Der Sender auf 108,03 MHz läuft mit sechs Solarzellen.' },
        listen: { kid: 'Piep, piep: Das ist sein Funkgerät. Es lief sechs Jahre lang mit Sonnenlicht, bis 1964.', sci: 'Der solarbetriebene Sender (5 mW) war bis Mai 1964 zu hören; der batteriebetriebene (10 mW) verstummte nach etwa 20 Tagen.' },
      },
      panel: {
        kid: [
          'Vanguard 1 ist eine Kugel aus Aluminium, etwa 16 cm groß, mit sechs dünnen Antennen und sechs kleinen Solarzellen aus Silicium auf seinem Körper. Er wiegt etwa eineinhalb Kilogramm. Er war so klein, dass ein sowjetischer Staatschef sich über ihn lustig machte und ihn den Grapefruit-Satelliten nannte. Sieh ihn dir in echter Größe neben der Startrampe an.',
          'Er flog am 17. März 1958 los, als erster Satellit, der mit Sonnenlicht lief. Sein Batteriefunk verstummte nach wenigen Wochen, aber der Solarfunk piepte bis 1964 weiter. Vanguard 1 ist heute noch da oben, das älteste von Menschen gebaute Ding in einer Umlaufbahn, und Forschende glauben, dass er insgesamt etwa 240 Jahre oben bleibt.',
        ],
        sci: [
          'Gebaut vom Forschungslabor der US-Marine (Naval Research Laboratory): eine Aluminiumkugel von etwa 16 cm und etwa 1,5 kg mit sechs 30 cm langen Antennen. Ein 10-mW-Sender auf 108 MHz lief mit einer Quecksilberbatterie und verstummte nach etwa 20 Tagen; ein 5-mW-Sender auf 108,03 MHz lief mit sechs Solarzellen aus Silicium und war bis Mai 1964 zu hören. Er war der vierte Satellit, nach Sputnik 1 und 2 und Explorer 1, und der erste mit Solarstrom.',
          'Seine erste Umlaufbahn lag bei 654 mal 3969 km, mit 34,25° Bahnneigung, eine Runde alle 134 Minuten. Die Verfolgung dieser Bahn zeigte, dass die Erde ganz leicht birnenförmig ist. Vanguard 1 und seine dritte Stufe sind die ältesten von Menschen gebauten Objekte, die noch im Orbit sind; er soll insgesamt etwa 240 Jahre oben bleiben.',
        ],
      },
    },
  },
}
