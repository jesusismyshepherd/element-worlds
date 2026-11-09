// The words of germanium's fibre room ("How does the internet cross the sea?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Ge.js (the easel shows it). {a}, {lim}, {n1}, {n2}, {thc}, {x}, {r}, {th}, {s}, {rcv},
// {d}, {t}, {rt}, {db}, {left}, {lost} and {z} are filled in by the room with numbers written the
// language's way. The 3D fonts have no subscripts or superscripts: signs say "GeO2" and "10^-120" in
// plain letters; the panels (HTML) may use real ones.
const EN = {
  title: 'The sea floor, 3000 m down',
  greet: {
    kid: 'Brrr! We are on the bottom of the sea, nearly three kilometres down, where the sun has never reached. The little yellow robot is a submarine, and the black cable across the mud carries the internet. The story of this picture is on the easel.',
    sci: 'The abyssal plain at about 3000 m: close to 2 °C, about 300 atmospheres, no sunlight. A research ROV lights a telecom cable lying on the mud. Three stations: the core of a fibre, the layers of the cable with a repeater, and a cable from Portugal to Brazil. The picture’s story is on the easel.',
  },
  talk: {
    kid: [
      'Down here the water is just above freezing, and all the sea above us presses on everything, about 300 times harder than the air around you. The cable is built to take it.',
      'Where does germanium come in? A pinch of it in the middle of each glass thread is what keeps the light from escaping.',
      'Almost all the internet between continents does not go through satellites. It crawls along cables like this one, on the sea floor.',
    ],
    sci: [
      'At 3000 m the pressure is about 300 atmospheres (30 MPa) and the water about 2 °C. Deep-water cable is mostly just laid on the bottom; burying it protects it only in shallow water, where nets and anchors reach.',
      'GeO2 is the usual dopant because it raises the refractive index of silica without adding much loss at 1550 nm, and it goes into the glass the same way silicon does: GeCl4 and SiCl4 burned together in oxygen. Some of the lowest-loss undersea fibres do it the other way round: a pure silica core in fluorine-doped cladding.',
      'More than 95% of intercontinental data travels in submarine cables; satellites carry only a small share.',
    ],
  },
  stay: {
    label: 'Stay inside!',
    title: 'A thread of glass that keeps its light',
    boardTitle: 'Will it stay in?',
    board: {
      kid: 'The beam leans {a} degrees.\nIt may lean up to {lim}.\n{verdict}\nFlashes: {rcv} of {s} arrived',
      sci: 'Angle to the axis {a}° (limit {lim}°)\nn core {n1}, n cladding {n2}\nCritical angle {thc}°\n{verdict}\nPulses: {rcv} of {s} arrived',
    },
    verdict: {
      ok: { kid: 'It stays inside!', sci: 'Guided: total reflection' },
      leak: { kid: 'It leaks out!', sci: 'Not guided: it refracts out' },
    },
    tags: { core: 'core, with germanium', clad: 'pure glass around it' },
    hints: {
      laser: 'Tap the laser',
      bend: 'Tap the glass thread to bend it',
      germ: 'Slide the germanium',
      angle: 'Slide the beam’s angle',
      done: 'Try the sliders',
    },
    sliders: { angle: 'Angle of the beam', ge: 'Germanium in the core', bend: 'Bend of the thread' },
    straight: 'straight',
    radius: 'bend radius {r} m',
    buttons: { laser: 'Send a flash', bend: 'Bend or straighten the thread' },
    says: {
      flash: {
        kid: 'A flash of light! It bounces from wall to wall all along the thread.',
        sci: 'A pulse is launched into the core at {a}° to the axis: it zigzags by total internal reflection.',
      },
      arrived: {
        kid: 'Every flash arrived at the other end. That is how a piece of your video gets across.',
        sci: 'All the pulses reach the far end: every hit on the wall is beyond the critical angle of {thc}°.',
      },
      lost: {
        kid: 'The flash leaked out into the glass around it, and into the sea. A video would stop right here.',
        sci: 'The ray meets the wall at less than the critical angle: it refracts out into the cladding and is lost.',
      },
      bent: {
        kid: 'The thread bends and the light follows it round the curve.',
        sci: 'Bend radius {r} m: the ray still meets the walls beyond the critical angle, so it is guided round the bend.',
      },
      bentLeak: {
        kid: 'Too sharp a bend! The light hits the wall almost head-on and slips out.',
        sci: 'At R = {r} m the ray meets the outer wall at {th}° from the normal, below the critical angle of {thc}°: it leaks out.',
      },
      straight: { kid: 'Straight again.', sci: 'Straight again.' },
      germ: {
        kid: 'With {x} in a hundred germanium the middle is a little slower for light, so now the beam may lean {lim} degrees and still stay in.',
        sci: '{x} mol% GeO2: n core = {n1} against {n2} in the cladding. Critical angle {thc}°, so rays up to {lim}° from the axis are guided.',
      },
      germ0: {
        kid: 'No germanium at all. The middle is now the same glass as the outside, so there is nothing to bounce off. The light just walks out.',
        sci: 'No dopant: core and cladding have the same index, so there is no boundary to reflect from.',
      },
      angle: {
        kid: 'The beam leans {a} degrees. It may lean up to {lim} before it escapes.',
        sci: 'Launch angle {a}° to the axis; the limit is {lim}°.',
      },
      angleLeak: {
        kid: 'The beam leans {a} degrees. That is too much (the limit is {lim}), so it escapes.',
        sci: 'Launch angle {a}° is beyond the limit of {lim}°: it meets the wall at less than the critical angle.',
      },
    },
    panel: {
      kid: [
        'Light goes in straight lines, so how does it follow a bend? Every glass thread is made of two glasses: a middle, called the core, and a layer around it. The core has a pinch of germanium in it, which makes light go a tiny bit slower there.',
        'When light in the slow glass reaches the edge at a shallow angle, it cannot get out. It bounces back, like a ball rolling along a gutter. Try it: send a flash, then lean the beam more and more.',
        'Slide the germanium down to nothing and the light leaks out. Bend the thread too sharply and the same happens. This thread is a giant. A real one is about as thin as a hair, and its glowing middle is about eight times thinner than a hair.',
      ],
      sci: [
        'A telecom fibre: a core about 8 to 9 µm across, doped with a few mol% of germania (GeO₂), inside 125 µm of pure silica cladding. Each mol% of GeO₂ raises the index by about 0.0015, so the core’s n is about 1.449 against 1.444 in the cladding at 1550 nm, a step of about 0.35%.',
        'A ray meets the core-cladding boundary at an angle θ from the normal. Where sin θ > n₂/n₁ it is totally reflected: the critical angle is about 85°, so a ray is guided if it leaves the axis by less than about 5°. A bend changes the angles at the outer wall (try the slider); real fibre shrugs off gentle bends but leaks when it is bent in a circle a few centimetres across.',
        'This is a simplification: the ray picture fits fat (multimode) fibres. A core as thin as 9 µm carries a single mode of the light wave, though the same index step is what guides it. The thread is drawn 8000 times life size, and the beam enters at the angle you set inside the core (from air it would bend at the end face).',
      ],
    },
    tip: 'Tap the laser to send a flash. Slide the angle and the germanium to see what keeps the light in.',
  },
  cable: {
    label: 'The cable cut open',
    title: 'What is inside a sea cable?',
    boardTitle: 'The five layers',
    hints: {
      poly: 'Tap the black plastic jacket',
      steel: 'Tap the steel wires',
      copper: 'Tap the copper tube',
      gel: 'Tap the gel',
      glass: 'Tap the glass fibres',
      repeater: 'Tap the repeater',
      pump: 'Tap the pump laser',
      done: 'Tap any layer, or the pump again',
    },
    layers: {
      poly: {
        name: { kid: 'Plastic jacket', sci: 'Polyethylene sheath' },
        job: 'keeps the sea out, and the electricity in',
        says: {
          kid: 'The black plastic jacket. It keeps the seawater away from the metal inside, and because plastic does not carry electricity, it keeps the electricity in.',
          sci: 'Polyethylene insulation: it seals the cable and insulates the copper power conductor, which runs at thousands of volts.',
        },
      },
      steel: {
        name: { kid: 'Steel wires', sci: 'Steel wires' },
        job: 'give the strength to hang from a ship',
        says: {
          kid: 'Steel wires, twisted round like a rope. They make the cable strong enough to hang from a ship in miles of water.',
          sci: 'Stranded high-tensile steel wires carry the load: laying a cable means hanging kilometres of it from the ship.',
        },
      },
      copper: {
        name: { kid: 'Copper tube', sci: 'Copper tube' },
        job: 'sends power to the repeaters',
        says: {
          kid: 'A copper tube. It carries electricity down the cable to power the repeaters, and it keeps water away from the glass.',
          sci: 'A copper tube carries a steady current, at thousands of volts, to feed the repeaters, and keeps water away from the fibre unit.',
        },
      },
      gel: {
        name: { kid: 'Gel', sci: 'Petroleum jelly' },
        job: 'cushions the glass, blocks water',
        says: {
          kid: 'A soft gel, a bit like petroleum jelly. It cushions the glass and stops water creeping along if the cable ever breaks.',
          sci: 'Petroleum jelly cushions the fibres and stops water running along the cable if it is cut.',
        },
      },
      glass: {
        name: { kid: 'Glass fibres', sci: 'Optical fibres' },
        job: 'carry the light, in pairs',
        says: {
          kid: 'And in the very middle, the glass threads! They come in pairs, one thread for each direction, and the middle of each has germanium in it.',
          sci: 'The fibres, in pairs (one for each direction): a few pairs in a cable, each with a germania-doped core. All the plastic, steel and copper is there to protect them.',
        },
      },
    },
    says: {
      open: {
        kid: 'The repeater opens. A flash of light comes in from the sea floor, weak after its long way.',
        sci: 'Repeater open. The pulse arrives weakened by the 50 to 100 km of fibre behind it.',
      },
      close: { kid: 'Closed again.', sci: 'Closed again.' },
      pumpOn: {
        kid: 'The pump laser shines into a coil of special glass with erbium in it (that is the pink). The weak flash passes through and comes out strong again!',
        sci: 'A pump laser (about 980 nm, infrared and invisible; drawn violet) excites the erbium ions in the doped fibre; the passing signal stimulates them to emit more light at 1550 nm. Gain, with no conversion to electricity.',
      },
      pumpOff: {
        kid: 'Pump off. Now the erbium soaks up the light instead, and the flash comes out even weaker.',
        sci: 'Pump off: the unexcited erbium absorbs the signal, so the pulse leaves weaker than it came.',
      },
    },
    panel: {
      kid: [
        'A sea cable is about as thick as a garden hose (this model is about 60 times bigger). But nearly all of it is there to protect a few hair-thin threads of glass in the very middle.',
        'Tap the layers one after another, from the outside in, and each one slides back so you can see the next.',
        'Light fades as it travels, so every 50 to 100 kilometres the cable has a repeater, a steel barrel with a light amplifier inside. Tap it to open it, then tap its pump laser.',
      ],
      sci: [
        'A typical deep-water cable is about 17 to 25 mm across (this one is drawn about 60 times life size). From the outside: polyethylene; stranded steel wires; a copper tube that carries a steady current to the repeaters; petroleum jelly; and a few pairs of fibres. Makers differ in the order and add tapes and water barriers; near shore the cable gets extra steel armour.',
        'Since the 1990s a repeater amplifies the light itself, in a length of erbium-doped fibre pumped by laser diodes (at 980 nm or 1480 nm), one amplifier for each fibre, powered through the copper. The first transatlantic fibre cable, TAT-8 (1988), still turned the light into electricity and back at each repeater. A repeater is a pressure-proof steel barrel about a metre or two long.',
      ],
    },
    tip: 'Tap the layers from the outside in, then the repeater and its pump.',
    buttons: { layer: 'Peel the next layer', repeater: 'Open or close the repeater', pump: 'Pump on or off' },
  },
  sea: {
    label: 'Across the ocean',
    title: 'From Portugal to Brazil',
    boardTitle: 'Light on the way',
    board: {
      kid: 'Distance: {d} km\nTime: {t} thousandths of a second\nLight left: {left}',
      sci: 'd = {d} km\nt = {t} ms\nLoss {db} dB\nLight left: {left}',
    },
    all: 'all of it',
    oneIn: '1 in {n}',
    zeros: '1 in a 1 with {z} zeros',
    tenTo: '10^-{z}',
    lostWord: { kid: 'lost!', sci: 'lost in the noise' },
    topped: { kid: 'topped up again', sci: 'restored by the repeaters' },
    switch: 'Repeaters',
    map: { portugal: 'PORTUGAL', brazil: 'BRAZIL', africa: 'AFRICA', atlantic: 'ATLANTIC OCEAN' },
    hints: {
      sines: 'Tap Sines',
      switch: 'Tap the switch for the repeaters',
      again: 'Tap Sines again',
      slide: 'Slide the distance',
      done: 'Tap Fortaleza',
    },
    slider: 'Distance along the cable',
    buttons: { sines: 'Send a flash from Sines', repeaters: 'Repeaters on or off', fortaleza: 'Go to Fortaleza' },
    says: {
      start: {
        kid: 'A flash leaves Sines, in Portugal. We slow time down about 400 times so you can watch.',
        sci: 'A pulse leaves Sines. Light in glass goes at about two thirds of c, 204 000 km/s: about 200 km every millisecond. Slowed down about 400 times here.',
      },
      lost: {
        kid: 'The flash faded away after only {d} kilometres, and the cable is thousands long! It needs help along the way.',
        sci: 'At 0.2 dB/km the pulse is down by 60 dB (a millionth) after 300 km: too faint to read. This run is lost at {d} km.',
      },
      faded: {
        kid: 'Nothing arrived at the end.',
        sci: 'Nothing arrives: the signal is gone.',
      },
      on: {
        kid: 'Repeaters on! One every 50 to 100 kilometres tops the light up again.',
        sci: 'Repeaters on (here one every 70 km; real ones 50 to 100 km): each restores the signal, so the loss never adds up to more than one span.',
      },
      off: { kid: 'Repeaters off.', sci: 'Repeaters off.' },
      arrive: {
        kid: 'It made it all the way to Fortaleza, in Brazil, in about {t} thousandths of a second!',
        sci: 'About 6000 km in about {t} ms at 204 000 km/s; there and back is about {rt} ms (the owners of EllaLink quote under 60 ms, equipment included).',
      },
      far: {
        kid: 'All the way to Brazil with no repeaters: only {left} of the light would be left. That is nothing at all.',
        sci: 'Without amplifiers, 6000 km costs {db} dB: {left} of the light would arrive.',
      },
      slide: {
        kid: 'After {d} kilometres without a repeater, {left} of the light is left.',
        sci: 'd = {d} km: {db} dB, so {left} of the light is left without repeaters.',
      },
    },
    panel: {
      kid: [
        'Sines, on the coast of Portugal, is one of the places where cables come out of the sea. From here EllaLink goes under the Atlantic to Fortaleza, in Brazil: about 6000 kilometres of cable, finished in 2021.',
        'Light in glass goes about two thirds as fast as in empty space: about 200 kilometres in every thousandth of a second. So Portugal to Brazil takes about 30 thousandths of a second.',
        'But glass is not perfectly clear. After 15 kilometres half the light is gone, after 100 kilometres only a hundredth is left, and after 300 only one millionth. That is why there are repeaters. Try it!',
      ],
      sci: [
        'EllaLink: Sines (Portugal) to Fortaleza (Brazil), about 6000 km, ready for service in 2021. Light in silica travels at c/n with a group index near 1.468 at 1550 nm: 204 000 km/s, about 200 km per millisecond, so about 29 ms one way. The owners quote under 60 ms for a round trip, equipment included.',
        'Attenuation is about 0.2 dB/km at 1550 nm, near the minimum for silica (which is why that wavelength is used): 3 dB, half the power, after 15 km; 20 dB, a hundredth, after 100 km; 60 dB after 300 km. Without amplifiers 6000 km would cost 1200 dB, a factor of 10⁻¹²⁰. A repeater every 50 to 100 km (60 to 120 on this route) restores the power each time, so the loss never adds up. More than a million kilometres of submarine cable now carry the world’s data between continents.',
      ],
    },
    tip: 'Tap Sines, then the switch, then Sines again. Or slide the distance.',
  },
}

const PT = {
  title: 'O fundo do mar, a 3000 m',
  greet: {
    kid: 'Brrr! Estamos no fundo do mar, quase três quilómetros abaixo da superfície, onde o Sol nunca chegou. O robô amarelo é um pequeno submarino, e o cabo preto que atravessa a lama leva a internet. A história deste quadro está no cavalete.',
    sci: 'A planície abissal, a cerca de 3000 m: perto de 2 °C, cerca de 300 atmosferas, sem luz solar. Um ROV de investigação ilumina um cabo de telecomunicações pousado na lama. Três estações: o núcleo de uma fibra, as camadas do cabo com um repetidor, e um cabo de Portugal ao Brasil. A história do quadro está no cavalete.',
  },
  talk: {
    kid: [
      'Aqui em baixo a água está pouco acima de zero graus, e todo o mar por cima de nós carrega sobre tudo, cerca de 300 vezes mais do que o ar à tua volta. O cabo é feito para aguentar.',
      'Onde entra o germânio? Uma pitada dele no meio de cada fio de vidro é o que impede a luz de escapar.',
      'Quase toda a internet entre continentes não passa por satélites. Anda por cabos como este, no fundo do mar.',
    ],
    sci: [
      'A 3000 m a pressão é de cerca de 300 atmosferas (30 MPa) e a água está a cerca de 2 °C. O cabo de águas profundas é quase sempre só pousado no fundo; enterrá-lo só o protege em águas pouco profundas, onde chegam redes e âncoras.',
      'O GeO2 é o dopante habitual porque aumenta o índice de refração da sílica sem acrescentar muita perda aos 1550 nm, e entra no vidro da mesma maneira que o silício: GeCl4 e SiCl4 queimados juntos em oxigénio. Algumas das fibras submarinas de menor perda fazem o contrário: um núcleo de sílica pura numa bainha dopada com flúor.',
      'Mais de 95% dos dados intercontinentais viajam em cabos submarinos; os satélites levam só uma pequena parte.',
    ],
  },
  stay: {
    label: 'Fica lá dentro!',
    title: 'Um fio de vidro que guarda a sua luz',
    boardTitle: 'Fica lá dentro?',
    board: {
      kid: 'O feixe inclina-se {a} graus.\nPode inclinar-se até {lim}.\n{verdict}\nClarões: chegaram {rcv} de {s}',
      sci: 'Ângulo com o eixo {a}° (limite {lim}°)\nn núcleo {n1}, n bainha {n2}\nÂngulo crítico {thc}°\n{verdict}\nImpulsos: chegaram {rcv} de {s}',
    },
    verdict: {
      ok: { kid: 'Fica lá dentro!', sci: 'Guiado: reflexão total' },
      leak: { kid: 'Foge para fora!', sci: 'Não guiado: refrata para fora' },
    },
    tags: { core: 'núcleo, com germânio', clad: 'vidro puro à volta' },
    hints: {
      laser: 'Toca no laser',
      bend: 'Toca no fio de vidro para o dobrar',
      germ: 'Desliza o germânio',
      angle: 'Desliza o ângulo do feixe',
      done: 'Experimenta os cursores',
    },
    sliders: { angle: 'Ângulo do feixe', ge: 'Germânio no núcleo', bend: 'Curva do fio' },
    straight: 'direito',
    radius: 'raio da curva {r} m',
    buttons: { laser: 'Enviar um clarão', bend: 'Dobrar ou endireitar o fio' },
    says: {
      flash: {
        kid: 'Um clarão de luz! Salta de parede em parede ao longo do fio.',
        sci: 'Lança-se um impulso no núcleo a {a}° do eixo: avança em ziguezague por reflexão interna total.',
      },
      arrived: {
        kid: 'Todos os clarões chegaram ao outro lado. É assim que um bocadinho do teu vídeo passa.',
        sci: 'Todos os impulsos chegam à outra ponta: cada embate na parede está para lá do ângulo crítico de {thc}°.',
      },
      lost: {
        kid: 'O clarão escapou para o vidro à volta e para o mar. O vídeo ficava parado mesmo aqui.',
        sci: 'O raio encontra a parede com menos do que o ângulo crítico: refrata para a bainha e perde-se.',
      },
      bent: {
        kid: 'O fio dobra e a luz segue-o pela curva.',
        sci: 'Raio de curvatura {r} m: o raio ainda encontra as paredes para lá do ângulo crítico, por isso é guiado pela curva.',
      },
      bentLeak: {
        kid: 'Curva demasiado apertada! A luz bate na parede quase de frente e escapa.',
        sci: 'Com R = {r} m o raio encontra a parede exterior a {th}° da normal, abaixo do ângulo crítico de {thc}°: escapa.',
      },
      straight: { kid: 'Outra vez direito.', sci: 'Outra vez direito.' },
      germ: {
        kid: 'Com {x} em cada cem de germânio, o meio fica um pouco mais lento para a luz, e agora o feixe pode inclinar-se {lim} graus e continuar lá dentro.',
        sci: '{x} mol% de GeO2: n do núcleo = {n1} contra {n2} na bainha. Ângulo crítico {thc}°, por isso os raios até {lim}° do eixo são guiados.',
      },
      germ0: {
        kid: 'Nada de germânio. O meio é agora o mesmo vidro que o exterior, por isso não há onde ressaltar. A luz sai a andar.',
        sci: 'Sem dopante: núcleo e bainha têm o mesmo índice, por isso não há fronteira onde refletir.',
      },
      angle: {
        kid: 'O feixe inclina-se {a} graus. Pode inclinar-se até {lim} antes de escapar.',
        sci: 'Ângulo de lançamento {a}° com o eixo; o limite é {lim}°.',
      },
      angleLeak: {
        kid: 'O feixe inclina-se {a} graus. É demais (o limite é {lim}), por isso escapa.',
        sci: 'O ângulo de lançamento de {a}° passa o limite de {lim}°: o raio encontra a parede com menos do que o ângulo crítico.',
      },
    },
    panel: {
      kid: [
        'A luz anda em linha reta, então como segue uma curva? Cada fio de vidro é feito de dois vidros: um meio, chamado núcleo, e uma camada à volta. O núcleo tem uma pitada de germânio, que faz a luz andar um bocadinho mais devagar ali.',
        'Quando a luz que vai no vidro lento chega à beira com um ângulo rasante, não consegue sair. Volta para trás, como uma bola a rolar numa calha. Experimenta: envia um clarão e inclina o feixe cada vez mais.',
        'Desliza o germânio até zero e a luz foge. Dobra o fio demasiado e acontece o mesmo. Este fio é um gigante. Um verdadeiro é fino como um cabelo, e o seu meio luminoso é cerca de oito vezes mais fino do que um cabelo.',
      ],
      sci: [
        'Uma fibra de telecomunicações: um núcleo com cerca de 8 a 9 µm, dopado com alguns por cento molares de germânia (GeO₂), dentro de 125 µm de bainha de sílica pura. Cada mol% de GeO₂ aumenta o índice em cerca de 0,0015, por isso o n do núcleo é cerca de 1,449 contra 1,444 na bainha aos 1550 nm, um degrau de cerca de 0,35%.',
        'Um raio encontra a fronteira núcleo-bainha com um ângulo θ em relação à normal. Onde sen θ > n₂/n₁ há reflexão total: o ângulo crítico é cerca de 85°, por isso um raio é guiado se se afastar do eixo menos de cerca de 5°. Uma curva muda os ângulos na parede exterior (experimenta o cursor); uma fibra verdadeira aguenta curvas suaves mas perde luz se for dobrada num círculo com poucos centímetros de diâmetro.',
        'Isto é uma simplificação: a imagem dos raios serve para fibras grossas (multimodo). Um núcleo de apenas 9 µm leva um único modo da onda de luz, embora seja o mesmo degrau de índice que o guia. O fio está desenhado 8000 vezes maior do que na realidade, e o feixe entra com o ângulo que definires dentro do núcleo (vindo do ar, dobrava na face da ponta).',
      ],
    },
    tip: 'Toca no laser para enviar um clarão. Desliza o ângulo e o germânio para ver o que mantém a luz lá dentro.',
  },
  cable: {
    label: 'O cabo aberto',
    title: 'O que há dentro de um cabo submarino?',
    boardTitle: 'As cinco camadas',
    hints: {
      poly: 'Toca no revestimento de plástico preto',
      steel: 'Toca nos fios de aço',
      copper: 'Toca no tubo de cobre',
      gel: 'Toca no gel',
      glass: 'Toca nas fibras de vidro',
      repeater: 'Toca no repetidor',
      pump: 'Toca no laser de bombeamento',
      done: 'Toca numa camada, ou outra vez no laser',
    },
    layers: {
      poly: {
        name: { kid: 'Revestimento de plástico', sci: 'Bainha de polietileno' },
        job: 'deixa o mar de fora e a eletricidade dentro',
        says: {
          kid: 'O revestimento de plástico preto. Mantém a água do mar longe do metal que está lá dentro e, como o plástico não conduz eletricidade, mantém a eletricidade lá dentro.',
          sci: 'Isolamento de polietileno: veda o cabo e isola o condutor de cobre da alimentação, que trabalha a milhares de volts.',
        },
      },
      steel: {
        name: { kid: 'Fios de aço', sci: 'Fios de aço' },
        job: 'dão a força para pendurar de um navio',
        says: {
          kid: 'Fios de aço, torcidos como uma corda. Dão ao cabo força para ficar pendurado de um navio em quilómetros de água.',
          sci: 'Fios de aço de alta resistência, cableados, suportam a carga: lançar um cabo é pendurar quilómetros dele do navio.',
        },
      },
      copper: {
        name: { kid: 'Tubo de cobre', sci: 'Tubo de cobre' },
        job: 'leva a energia aos repetidores',
        says: {
          kid: 'Um tubo de cobre. Leva eletricidade pelo cabo para alimentar os repetidores e mantém a água longe do vidro.',
          sci: 'Um tubo de cobre leva uma corrente constante, a milhares de volts, para alimentar os repetidores, e mantém a água longe da unidade de fibras.',
        },
      },
      gel: {
        name: { kid: 'Gel', sci: 'Vaselina' },
        job: 'amortece o vidro e trava a água',
        says: {
          kid: 'Um gel mole, um pouco como vaselina. Amortece o vidro e impede a água de se infiltrar se o cabo alguma vez partir.',
          sci: 'A vaselina amortece as fibras e impede a água de correr ao longo do cabo se este for cortado.',
        },
      },
      glass: {
        name: { kid: 'Fibras de vidro', sci: 'Fibras óticas' },
        job: 'levam a luz, aos pares',
        says: {
          kid: 'E mesmo no meio, os fios de vidro! Vêm aos pares, um fio para cada sentido, e o meio de cada um tem germânio.',
          sci: 'As fibras, aos pares (uma para cada sentido): alguns pares num cabo, cada uma com um núcleo dopado com germânia. Todo o plástico, aço e cobre estão lá para as proteger.',
        },
      },
    },
    says: {
      open: {
        kid: 'O repetidor abre-se. Chega um clarão de luz do fundo do mar, fraco depois de tão longo caminho.',
        sci: 'Repetidor aberto. O impulso chega enfraquecido pelos 50 a 100 km de fibra que ficaram para trás.',
      },
      close: { kid: 'Fechado outra vez.', sci: 'Fechado outra vez.' },
      pumpOn: {
        kid: 'O laser de bombeamento ilumina uma espiral de vidro especial com érbio (é o cor-de-rosa). O clarão fraco passa e sai forte outra vez!',
        sci: 'Um laser de bombeamento (cerca de 980 nm, infravermelho e invisível; desenhado a violeta) excita os iões de érbio da fibra dopada; o sinal que passa estimula-os a emitir mais luz aos 1550 nm. Ganho, sem converter em eletricidade.',
      },
      pumpOff: {
        kid: 'Bomba desligada. Agora o érbio absorve a luz, e o clarão sai ainda mais fraco.',
        sci: 'Bomba desligada: o érbio não excitado absorve o sinal, por isso o impulso sai mais fraco do que entrou.',
      },
    },
    panel: {
      kid: [
        'Um cabo submarino é grosso como uma mangueira de jardim (este modelo é cerca de 60 vezes maior). Mas quase tudo nele serve para proteger uns poucos fios de vidro, finos como cabelos, mesmo no meio.',
        'Toca nas camadas uma a seguir à outra, de fora para dentro, e cada uma desliza para trás para veres a seguinte.',
        'A luz vai-se apagando pelo caminho, por isso de 50 em 50 a 100 em 100 quilómetros o cabo tem um repetidor, um barril de aço com um amplificador de luz lá dentro. Toca nele para o abrir e depois toca no laser de bombeamento.',
      ],
      sci: [
        'Um cabo típico de águas profundas tem cerca de 17 a 25 mm de diâmetro (este está desenhado cerca de 60 vezes maior). De fora para dentro: polietileno; fios de aço cableados; um tubo de cobre que leva uma corrente constante aos repetidores; vaselina; e alguns pares de fibras. Os fabricantes diferem na ordem e juntam fitas e barreiras contra a água; perto da costa o cabo leva uma armadura de aço extra.',
        'Desde os anos 1990 o repetidor amplifica a própria luz, num troço de fibra dopada com érbio bombeado por díodos laser (a 980 nm ou 1480 nm), um amplificador por fibra, alimentado pelo cobre. O primeiro cabo de fibra transatlântico, o TAT-8 (1988), ainda transformava a luz em eletricidade e de volta em cada repetidor. Um repetidor é um barril de aço resistente à pressão com um ou dois metros de comprimento.',
      ],
    },
    tip: 'Toca nas camadas de fora para dentro, depois no repetidor e no seu laser de bombeamento.',
    buttons: { layer: 'Descolar a camada seguinte', repeater: 'Abrir ou fechar o repetidor', pump: 'Ligar ou desligar a bomba' },
  },
  sea: {
    label: 'Do outro lado do oceano',
    title: 'De Portugal ao Brasil',
    boardTitle: 'A luz pelo caminho',
    board: {
      kid: 'Distância: {d} km\nTempo: {t} milésimos de segundo\nLuz que sobra: {left}',
      sci: 'd = {d} km\nt = {t} ms\nPerda {db} dB\nLuz que sobra: {left}',
    },
    all: 'toda',
    oneIn: '1 em {n}',
    zeros: '1 em 1 com {z} zeros',
    tenTo: '10^-{z}',
    lostWord: { kid: 'perdida!', sci: 'perdida no ruído' },
    topped: { kid: 'reforçada outra vez', sci: 'restaurada pelos repetidores' },
    switch: 'Repetidores',
    map: { portugal: 'PORTUGAL', brazil: 'BRASIL', africa: 'ÁFRICA', atlantic: 'OCEANO ATLÂNTICO' },
    hints: {
      sines: 'Toca em Sines',
      switch: 'Toca no interruptor dos repetidores',
      again: 'Toca outra vez em Sines',
      slide: 'Desliza a distância',
      done: 'Toca em Fortaleza',
    },
    slider: 'Distância ao longo do cabo',
    buttons: { sines: 'Enviar um clarão de Sines', repeaters: 'Repetidores ligados ou desligados', fortaleza: 'Ir para Fortaleza' },
    says: {
      start: {
        kid: 'Um clarão sai de Sines, em Portugal. Abrandamos o tempo cerca de 400 vezes para poderes ver.',
        sci: 'Um impulso sai de Sines. A luz no vidro anda a cerca de dois terços de c, 204 000 km/s: cerca de 200 km por milissegundo. Aqui abrandado cerca de 400 vezes.',
      },
      lost: {
        kid: 'O clarão apagou-se ao fim de apenas {d} quilómetros, e o cabo tem milhares! Precisa de ajuda pelo caminho.',
        sci: 'A 0,2 dB/km o impulso cai 60 dB (um milionésimo) ao fim de 300 km: demasiado fraco para ler. Esta passagem perde-se aos {d} km.',
      },
      faded: {
        kid: 'Não chegou nada ao fim.',
        sci: 'Nada chega: o sinal desapareceu.',
      },
      on: {
        kid: 'Repetidores ligados! Um de 50 em 50 a 100 em 100 quilómetros volta a reforçar a luz.',
        sci: 'Repetidores ligados (aqui um a cada 70 km; os verdadeiros a cada 50 a 100 km): cada um restaura o sinal, por isso a perda nunca soma mais do que um troço.',
      },
      off: { kid: 'Repetidores desligados.', sci: 'Repetidores desligados.' },
      arrive: {
        kid: 'Chegou até Fortaleza, no Brasil, em cerca de {t} milésimos de segundo!',
        sci: 'Cerca de 6000 km em cerca de {t} ms a 204 000 km/s; ida e volta são cerca de {rt} ms (os donos do EllaLink indicam menos de 60 ms, equipamento incluído).',
      },
      far: {
        kid: 'Até ao Brasil sem repetidores: sobrava só {left} da luz. Isso é nada.',
        sci: 'Sem amplificadores, 6000 km custam {db} dB: chegava {left} da luz.',
      },
      slide: {
        kid: 'Ao fim de {d} quilómetros sem repetidor, sobra {left} da luz.',
        sci: 'd = {d} km: {db} dB, por isso sobra {left} da luz sem repetidores.',
      },
    },
    panel: {
      kid: [
        'Sines, na costa de Portugal, é um dos sítios onde os cabos saem do mar. Daqui o EllaLink segue debaixo do Atlântico até Fortaleza, no Brasil: cerca de 6000 quilómetros de cabo, concluído em 2021.',
        'A luz no vidro anda cerca de dois terços da velocidade que tem no espaço vazio: cerca de 200 quilómetros em cada milésimo de segundo. Por isso de Portugal ao Brasil leva cerca de 30 milésimos de segundo.',
        'Mas o vidro não é perfeitamente transparente. Ao fim de 15 quilómetros já se foi metade da luz, ao fim de 100 quilómetros só sobra um centésimo, e ao fim de 300 só um milionésimo. É por isso que há repetidores. Experimenta!',
      ],
      sci: [
        'EllaLink: Sines (Portugal) a Fortaleza (Brasil), cerca de 6000 km, pronto a servir em 2021. A luz na sílica anda a c/n com um índice de grupo perto de 1,468 aos 1550 nm: 204 000 km/s, cerca de 200 km por milissegundo, por isso cerca de 29 ms num sentido. Os donos indicam menos de 60 ms para a ida e volta, equipamento incluído.',
        'A atenuação é de cerca de 0,2 dB/km aos 1550 nm, perto do mínimo da sílica (e é por isso que se usa esse comprimento de onda): 3 dB, metade da potência, aos 15 km; 20 dB, um centésimo, aos 100 km; 60 dB aos 300 km. Sem amplificadores 6000 km custariam 1200 dB, um fator de 10⁻¹²⁰. Um repetidor a cada 50 a 100 km (60 a 120 neste percurso) restaura a potência de cada vez, por isso a perda nunca se acumula. Mais de um milhão de quilómetros de cabo submarino levam hoje os dados do mundo entre continentes.',
      ],
    },
    tip: 'Toca em Sines, depois no interruptor, depois outra vez em Sines. Ou desliza a distância.',
  },
}

const PL = {
  title: 'Dno morza, 3000 m pod wodą',
  greet: {
    kid: 'Brr! Jesteśmy na dnie morza, prawie trzy kilometry pod wodą, dokąd nigdy nie dotarło Słońce. Mały żółty robot to łódź podwodna, a czarny kabel na mule niesie internet. Historia tego obrazu stoi na sztalugach.',
    sci: 'Równina abisalna na głębokości około 3000 m: blisko 2 °C, około 300 atmosfer, żadnego światła słonecznego. Badawczy ROV oświetla kabel telekomunikacyjny leżący na mule. Trzy stanowiska: rdzeń światłowodu, warstwy kabla ze wzmacniaczem i kabel z Portugalii do Brazylii. Historia obrazu jest na sztalugach.',
  },
  talk: {
    kid: [
      'Tu na dole woda ma tuż ponad zero stopni, a całe morze nad nami przyciska wszystko, jakieś 300 razy mocniej niż powietrze wokół ciebie. Kabel jest zbudowany tak, żeby to wytrzymać.',
      'A gdzie jest german? Szczypta germanu w środku każdej szklanej nitki sprawia, że światło nie ucieka.',
      'Prawie cały internet między kontynentami nie leci przez satelity. Ciągnie się kablami takimi jak ten, po dnie morza.',
    ],
    sci: [
      'Na 3000 m ciśnienie wynosi około 300 atmosfer (30 MPa), a woda ma około 2 °C. Kabel głębinowy najczęściej po prostu leży na dnie; zakopanie chroni go tylko na płyciznach, gdzie sięgają sieci i kotwice.',
      'GeO2 to najczęstsza domieszka, bo podnosi współczynnik załamania krzemionki, nie dodając wiele strat przy 1550 nm, i wchodzi do szkła tak samo jak krzem: GeCl4 i SiCl4 spalane razem w tlenie. Niektóre z najmniej stratnych światłowodów podmorskich robią odwrotnie: rdzeń z czystej krzemionki w płaszczu domieszkowanym fluorem.',
      'Ponad 95% danych między kontynentami płynie kablami podmorskimi; satelity niosą tylko niewielką część.',
    ],
  },
  stay: {
    label: 'Zostań w środku!',
    title: 'Szklana nitka, która trzyma swoje światło',
    boardTitle: 'Czy zostanie w środku?',
    board: {
      kid: 'Wiązka odchyla się o {a} stopni.\nMoże aż o {lim}.\n{verdict}\nBłyski: dotarło {rcv} z {s}',
      sci: 'Kąt do osi {a}° (granica {lim}°)\nn rdzenia {n1}, n płaszcza {n2}\nKąt graniczny {thc}°\n{verdict}\nImpulsy: dotarło {rcv} z {s}',
    },
    verdict: {
      ok: { kid: 'Zostaje w środku!', sci: 'Prowadzone: odbicie całkowite' },
      leak: { kid: 'Ucieka na zewnątrz!', sci: 'Nieprowadzone: załamuje się na zewnątrz' },
    },
    tags: { core: 'rdzeń, z germanem', clad: 'czyste szkło dookoła' },
    hints: {
      laser: 'Dotknij lasera',
      bend: 'Dotknij szklanej nitki, żeby ją wygiąć',
      germ: 'Przesuń german',
      angle: 'Przesuń kąt wiązki',
      done: 'Wypróbuj suwaki',
    },
    sliders: { angle: 'Kąt wiązki', ge: 'German w rdzeniu', bend: 'Wygięcie nitki' },
    straight: 'prosta',
    radius: 'promień łuku {r} m',
    buttons: { laser: 'Wyślij błysk', bend: 'Wygnij lub wyprostuj nitkę' },
    says: {
      flash: {
        kid: 'Błysk światła! Odbija się od ściany do ściany wzdłuż całej nitki.',
        sci: 'Impuls wchodzi w rdzeń pod kątem {a}° do osi: biegnie zygzakiem dzięki całkowitemu wewnętrznemu odbiciu.',
      },
      arrived: {
        kid: 'Wszystkie błyski dotarły na drugi koniec. Tak przechodzi kawałek twojego filmu.',
        sci: 'Wszystkie impulsy docierają na drugi koniec: każde uderzenie w ścianę jest poza kątem granicznym {thc}°.',
      },
      lost: {
        kid: 'Błysk uciekł do szkła dookoła i do morza. Film zatrzymałby się właśnie tu.',
        sci: 'Promień trafia w ścianę pod kątem mniejszym niż kąt graniczny: załamuje się do płaszcza i ginie.',
      },
      bent: {
        kid: 'Nitka się wygina, a światło podąża za nią przez zakręt.',
        sci: 'Promień krzywizny {r} m: promień wciąż trafia w ściany poza kątem granicznym, więc jest prowadzony przez zakręt.',
      },
      bentLeak: {
        kid: 'Za ostry zakręt! Światło uderza w ścianę prawie prosto i wymyka się.',
        sci: 'Przy R = {r} m promień trafia w zewnętrzną ścianę pod kątem {th}° od normalnej, poniżej kąta granicznego {thc}°: wycieka.',
      },
      straight: { kid: 'Znowu prosto.', sci: 'Znowu prosto.' },
      germ: {
        kid: 'Przy {x} na sto germanu środek jest trochę wolniejszy dla światła, więc teraz wiązka może odchylić się o {lim} stopni i nadal zostać w środku.',
        sci: '{x} % mol. GeO2: n rdzenia = {n1} wobec {n2} w płaszczu. Kąt graniczny {thc}°, więc prowadzone są promienie do {lim}° od osi.',
      },
      germ0: {
        kid: 'Zupełnie bez germanu. Środek to teraz to samo szkło co zewnątrz, więc nie ma od czego się odbić. Światło po prostu wychodzi.',
        sci: 'Brak domieszki: rdzeń i płaszcz mają ten sam współczynnik załamania, więc nie ma granicy, od której można się odbić.',
      },
      angle: {
        kid: 'Wiązka odchyla się o {a} stopni. Może aż o {lim}, zanim ucieknie.',
        sci: 'Kąt wprowadzenia {a}° do osi; granica to {lim}°.',
      },
      angleLeak: {
        kid: 'Wiązka odchyla się o {a} stopni. To za dużo (granica to {lim}), więc ucieka.',
        sci: 'Kąt wprowadzenia {a}° przekracza granicę {lim}°: promień trafia w ścianę pod kątem mniejszym niż kąt graniczny.',
      },
    },
    panel: {
      kid: [
        'Światło biegnie po prostych, więc jak podąża za zakrętem? Każda szklana nitka składa się z dwóch szkieł: środka, zwanego rdzeniem, i warstwy dookoła. W rdzeniu jest szczypta germanu, który sprawia, że światło biegnie tam odrobinę wolniej.',
        'Gdy światło w wolnym szkle dociera do brzegu pod płaskim kątem, nie może wyjść. Odbija się z powrotem, jak piłka toczona rynną. Spróbuj: wyślij błysk, a potem odchylaj wiązkę coraz bardziej.',
        'Przesuń german do zera, a światło ucieknie. Wygnij nitkę zbyt mocno, a stanie się to samo. Ta nitka to olbrzym. Prawdziwa jest cienka jak włos, a jej świecący środek jest około osiem razy cieńszy od włosa.',
      ],
      sci: [
        'Światłowód telekomunikacyjny: rdzeń o średnicy około 8 do 9 µm, domieszkowany kilkoma procentami molowymi tlenku germanu (GeO₂), w 125 µm płaszcza z czystej krzemionki. Każdy 1% mol. GeO₂ podnosi współczynnik załamania o około 0,0015, więc n rdzenia wynosi około 1,449 wobec 1,444 w płaszczu przy 1550 nm, skok około 0,35%.',
        'Promień trafia w granicę rdzeń-płaszcz pod kątem θ od normalnej. Gdy sin θ > n₂/n₁, następuje odbicie całkowite: kąt graniczny to około 85°, więc promień jest prowadzony, jeśli odchyla się od osi o mniej niż około 5°. Zakręt zmienia kąty przy ścianie zewnętrznej (spróbuj suwaka); prawdziwy światłowód znosi łagodne zakręty, ale traci światło, gdy się go zegnie w koło o średnicy kilku centymetrów.',
        'To uproszczenie: obraz promieni pasuje do grubych światłowodów (wielomodowych). Rdzeń tak cienki jak 9 µm niesie jeden mod fali świetlnej, choć to ten sam skok współczynnika go prowadzi. Nitka jest narysowana 8000 razy większa niż w życiu, a wiązka wchodzi pod kątem, który ustawisz wewnątrz rdzenia (z powietrza załamałaby się na czole włókna).',
      ],
    },
    tip: 'Dotknij lasera, żeby wysłać błysk. Przesuń kąt i german, żeby zobaczyć, co zatrzymuje światło w środku.',
  },
  cable: {
    label: 'Kabel przecięty',
    title: 'Co jest w kablu podmorskim?',
    boardTitle: 'Pięć warstw',
    hints: {
      poly: 'Dotknij czarnej plastikowej osłony',
      steel: 'Dotknij stalowych drutów',
      copper: 'Dotknij miedzianej rurki',
      gel: 'Dotknij żelu',
      glass: 'Dotknij szklanych włókien',
      repeater: 'Dotknij wzmacniacza',
      pump: 'Dotknij lasera pompującego',
      done: 'Dotknij dowolnej warstwy albo jeszcze raz lasera',
    },
    layers: {
      poly: {
        name: { kid: 'Plastikowa osłona', sci: 'Osłona z polietylenu' },
        job: 'zatrzymuje morze na zewnątrz, a prąd w środku',
        says: {
          kid: 'Czarna plastikowa osłona. Trzyma wodę morską z dala od metalu w środku, a ponieważ plastik nie przewodzi prądu, trzyma prąd w środku.',
          sci: 'Izolacja z polietylenu: uszczelnia kabel i izoluje miedziany przewód zasilający, który pracuje pod napięciem tysięcy woltów.',
        },
      },
      steel: {
        name: { kid: 'Stalowe druty', sci: 'Stalowe druty' },
        job: 'dają siłę, by wisieć na statku',
        says: {
          kid: 'Stalowe druty, skręcone jak lina. Dzięki nim kabel jest dość mocny, by wisieć ze statku w wodzie głębokiej na kilometry.',
          sci: 'Skręcone druty ze stali o wysokiej wytrzymałości przenoszą obciążenie: układanie kabla to zwieszanie kilometrów go ze statku.',
        },
      },
      copper: {
        name: { kid: 'Miedziana rurka', sci: 'Miedziana rurka' },
        job: 'niesie prąd do wzmacniaczy',
        says: {
          kid: 'Miedziana rurka. Niesie prąd wzdłuż kabla do zasilania wzmacniaczy i trzyma wodę z dala od szkła.',
          sci: 'Miedziana rurka niesie stały prąd, pod napięciem tysięcy woltów, do zasilania wzmacniaczy i chroni zespół włókien przed wodą.',
        },
      },
      gel: {
        name: { kid: 'Żel', sci: 'Wazelina' },
        job: 'amortyzuje szkło i blokuje wodę',
        says: {
          kid: 'Miękki żel, trochę jak wazelina. Amortyzuje szkło i nie pozwala wodzie się wsączać, gdyby kabel kiedyś pękł.',
          sci: 'Wazelina amortyzuje włókna i zatrzymuje wodę, która mogłaby biec wzdłuż kabla, gdyby został przecięty.',
        },
      },
      glass: {
        name: { kid: 'Szklane włókna', sci: 'Włókna światłowodowe' },
        job: 'niosą światło, parami',
        says: {
          kid: 'A w samym środku szklane nitki! Są parami, jedna nitka na każdy kierunek, a środek każdej ma german.',
          sci: 'Włókna, parami (jedno na każdy kierunek): kilka par w kablu, każde z rdzeniem domieszkowanym germanem. Cały plastik, stal i miedź są po to, by je chronić.',
        },
      },
    },
    says: {
      open: {
        kid: 'Wzmacniacz się otwiera. Z dna morza nadchodzi błysk światła, słaby po długiej drodze.',
        sci: 'Wzmacniacz otwarty. Impuls dociera osłabiony przez 50 do 100 km włókna za nim.',
      },
      close: { kid: 'Znowu zamknięty.', sci: 'Znowu zamknięty.' },
      pumpOn: {
        kid: 'Laser pompujący świeci w zwój specjalnego szkła z erbem (to ten róż). Słaby błysk przechodzi i wychodzi znów silny!',
        sci: 'Laser pompujący (około 980 nm, podczerwień, niewidoczna; narysowana na fioletowo) wzbudza jony erbu we włóknie domieszkowanym; przechodzący sygnał pobudza je do emisji kolejnego światła o 1550 nm. Wzmocnienie bez zamiany na prąd.',
      },
      pumpOff: {
        kid: 'Pompa wyłączona. Teraz erb pochłania światło i błysk wychodzi jeszcze słabszy.',
        sci: 'Pompa wyłączona: niewzbudzony erb pochłania sygnał, więc impuls wychodzi słabszy, niż wszedł.',
      },
    },
    panel: {
      kid: [
        'Kabel podmorski jest gruby mniej więcej jak wąż ogrodowy (ten model jest około 60 razy większy). Ale prawie całość służy do ochrony kilku cienkich jak włos szklanych nitek w samym środku.',
        'Dotykaj warstw jedna po drugiej, od zewnątrz do środka, a każda zsunie się do tyłu, żebyś zobaczył następną.',
        'Światło słabnie w drodze, więc co 50 do 100 kilometrów kabel ma wzmacniacz, stalową beczkę z wzmacniaczem światła w środku. Dotknij go, żeby go otworzyć, a potem dotknij jego lasera pompującego.',
      ],
      sci: [
        'Typowy kabel głębinowy ma około 17 do 25 mm średnicy (ten jest narysowany około 60 razy większy). Od zewnątrz: polietylen; skręcone druty stalowe; miedziana rurka niosąca stały prąd do wzmacniaczy; wazelina; kilka par włókien. Producenci różnią się kolejnością i dodają taśmy i osłony przed wodą; przy brzegu kabel dostaje dodatkowy stalowy pancerz.',
        'Od lat dziewięćdziesiątych wzmacniacz wzmacnia samo światło, w odcinku włókna domieszkowanego erbem pompowanego diodami laserowymi (980 nm lub 1480 nm), jeden wzmacniacz na każde włókno, zasilany przez miedź. Pierwszy transatlantycki kabel światłowodowy, TAT-8 (1988), w każdym wzmacniaczu jeszcze zamieniał światło na prąd i z powrotem. Wzmacniacz to odporna na ciśnienie stalowa beczka długa na metr czy dwa.',
      ],
    },
    tip: 'Dotykaj warstw od zewnątrz do środka, potem wzmacniacza i jego pompy.',
    buttons: { layer: 'Zdejmij następną warstwę', repeater: 'Otwórz lub zamknij wzmacniacz', pump: 'Włącz lub wyłącz pompę' },
  },
  sea: {
    label: 'Przez ocean',
    title: 'Z Portugalii do Brazylii',
    boardTitle: 'Światło w drodze',
    board: {
      kid: 'Odległość: {d} km\nCzas: {t} tysięcznych sekundy\nZostaje światła: {left}',
      sci: 'd = {d} km\nt = {t} ms\nStrata {db} dB\nZostaje światła: {left}',
    },
    all: 'całe',
    oneIn: '1 na {n}',
    zeros: '1 na 1 z {z} zerami',
    tenTo: '10^-{z}',
    lostWord: { kid: 'stracone!', sci: 'stracone w szumie' },
    topped: { kid: 'znów uzupełnione', sci: 'odtworzone przez wzmacniacze' },
    switch: 'Wzmacniacze',
    map: { portugal: 'PORTUGALIA', brazil: 'BRAZYLIA', africa: 'AFRYKA', atlantic: 'OCEAN ATLANTYCKI' },
    hints: {
      sines: 'Dotknij Sines',
      switch: 'Dotknij przełącznika wzmacniaczy',
      again: 'Dotknij jeszcze raz Sines',
      slide: 'Przesuń odległość',
      done: 'Dotknij Fortalezy',
    },
    slider: 'Odległość wzdłuż kabla',
    buttons: { sines: 'Wyślij błysk z Sines', repeaters: 'Wzmacniacze włączone lub wyłączone', fortaleza: 'Idź do Fortalezy' },
    says: {
      start: {
        kid: 'Błysk wyrusza z Sines w Portugalii. Spowalniamy czas jakieś 400 razy, żebyś mógł patrzeć.',
        sci: 'Impuls wyrusza z Sines. Światło w szkle biegnie z prędkością około dwóch trzecich c, 204 000 km/s: około 200 km na milisekundę. Tu spowolnione około 400 razy.',
      },
      lost: {
        kid: 'Błysk zgasł już po {d} kilometrach, a kabel ma tysiące! Potrzebuje pomocy po drodze.',
        sci: 'Przy 0,2 dB/km impuls słabnie o 60 dB (milionkrotnie) po 300 km: za słaby, by go odczytać. Ten bieg ginie na {d} km.',
      },
      faded: {
        kid: 'Nic nie dotarło do końca.',
        sci: 'Nic nie dociera: sygnał zniknął.',
      },
      on: {
        kid: 'Wzmacniacze włączone! Jeden co 50 do 100 kilometrów znów uzupełnia światło.',
        sci: 'Wzmacniacze włączone (tu jeden co 70 km; prawdziwe co 50 do 100 km): każdy odtwarza sygnał, więc strata nigdy nie sumuje się do więcej niż jednego odcinka.',
      },
      off: { kid: 'Wzmacniacze wyłączone.', sci: 'Wzmacniacze wyłączone.' },
      arrive: {
        kid: 'Dotarł aż do Fortalezy w Brazylii w jakieś {t} tysięcznych sekundy!',
        sci: 'Około 6000 km w około {t} ms przy 204 000 km/s; tam i z powrotem to około {rt} ms (właściciele EllaLink podają poniżej 60 ms, razem ze sprzętem).',
      },
      far: {
        kid: 'Aż do Brazylii bez wzmacniaczy: zostałoby tylko {left} światła. To nic.',
        sci: 'Bez wzmacniaczy 6000 km kosztuje {db} dB: dotarłoby {left} światła.',
      },
      slide: {
        kid: 'Po {d} kilometrach bez wzmacniacza zostaje {left} światła.',
        sci: 'd = {d} km: {db} dB, więc bez wzmacniaczy zostaje {left} światła.',
      },
    },
    panel: {
      kid: [
        'Sines, na wybrzeżu Portugalii, to jedno z miejsc, gdzie kable wychodzą z morza. Stąd EllaLink biegnie pod Atlantykiem do Fortalezy w Brazylii: około 6000 kilometrów kabla, gotowego w 2021 roku.',
        'Światło w szkle biegnie mniej więcej dwie trzecie tak szybko jak w pustej przestrzeni: około 200 kilometrów w każdej tysięcznej sekundy. Z Portugalii do Brazylii to więc około 30 tysięcznych sekundy.',
        'Ale szkło nie jest idealnie przejrzyste. Po 15 kilometrach znika połowa światła, po 100 kilometrach zostaje tylko setna część, a po 300 tylko jedna milionowa. Dlatego są wzmacniacze. Spróbuj!',
      ],
      sci: [
        'EllaLink: Sines (Portugalia) do Fortalezy (Brazylia), około 6000 km, oddany do użytku w 2021 roku. Światło w krzemionce biegnie z prędkością c/n przy współczynniku grupowym około 1,468 przy 1550 nm: 204 000 km/s, około 200 km na milisekundę, czyli około 29 ms w jedną stronę. Właściciele podają poniżej 60 ms w obie strony, razem ze sprzętem.',
        'Tłumienie wynosi około 0,2 dB/km przy 1550 nm, blisko minimum dla krzemionki (dlatego używa się tej długości fali): 3 dB, połowa mocy, po 15 km; 20 dB, setna część, po 100 km; 60 dB po 300 km. Bez wzmacniaczy 6000 km kosztowałoby 1200 dB, czynnik 10⁻¹²⁰. Wzmacniacz co 50 do 100 km (60 do 120 na tej trasie) za każdym razem odtwarza moc, więc strata nigdy się nie sumuje. Ponad milion kilometrów kabli podmorskich niesie dziś dane świata między kontynentami.',
      ],
    },
    tip: 'Dotknij Sines, potem przełącznika, potem jeszcze raz Sines. Albo przesuń odległość.',
  },
}

const DE = {
  title: 'Der Meeresboden, 3000 m tief',
  greet: {
    kid: 'Brrr! Wir sind auf dem Meeresboden, fast drei Kilometer tief, wo nie ein Sonnenstrahl hinkam. Der kleine gelbe Roboter ist ein Tauchboot, und das schwarze Kabel quer über den Schlamm trägt das Internet. Die Geschichte dieses Bildes steht auf der Staffelei.',
    sci: 'Die Tiefseeebene in etwa 3000 m: knapp 2 °C, rund 300 Atmosphären, kein Sonnenlicht. Ein Forschungs-ROV beleuchtet ein Telekommunikationskabel auf dem Schlamm. Drei Stationen: der Kern einer Faser, die Schichten des Kabels mit einem Zwischenverstärker und ein Kabel von Portugal nach Brasilien. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Hier unten ist das Wasser knapp über dem Gefrierpunkt, und das ganze Meer über uns drückt auf alles, etwa 300-mal stärker als die Luft um dich herum. Das Kabel ist dafür gebaut.',
      'Und wo kommt Germanium ins Spiel? Eine Prise davon in der Mitte jedes Glasfadens sorgt dafür, dass das Licht nicht entwischt.',
      'Fast das ganze Internet zwischen den Kontinenten läuft nicht über Satelliten. Es kriecht durch Kabel wie dieses, am Meeresboden.',
    ],
    sci: [
      'In 3000 m Tiefe herrschen etwa 300 Atmosphären (30 MPa) und rund 2 °C. Tiefseekabel werden meist einfach auf den Boden gelegt; eingegraben schützt man sie nur in flachem Wasser, wo Netze und Anker hinreichen.',
      'GeO2 ist der übliche Dotierstoff, weil es die Brechzahl von Quarzglas erhöht, ohne bei 1550 nm viel Verlust hinzuzufügen, und es kommt auf dieselbe Weise ins Glas wie Silizium: GeCl4 und SiCl4 werden gemeinsam in Sauerstoff verbrannt. Manche der verlustärmsten Seekabelfasern machen es umgekehrt: ein Kern aus reinem Quarzglas in einem mit Fluor dotierten Mantel.',
      'Mehr als 95 % der Daten zwischen den Kontinenten laufen durch Seekabel; Satelliten tragen nur einen kleinen Teil.',
    ],
  },
  stay: {
    label: 'Bleib drin!',
    title: 'Ein Glasfaden, der sein Licht behält',
    boardTitle: 'Bleibt es drin?',
    board: {
      kid: 'Der Strahl neigt sich um {a} Grad.\nEr darf sich bis {lim} neigen.\n{verdict}\nBlitze: {rcv} von {s} angekommen',
      sci: 'Winkel zur Achse {a}° (Grenze {lim}°)\nn Kern {n1}, n Mantel {n2}\nGrenzwinkel {thc}°\n{verdict}\nPulse: {rcv} von {s} angekommen',
    },
    verdict: {
      ok: { kid: 'Er bleibt drin!', sci: 'Geführt: Totalreflexion' },
      leak: { kid: 'Er läuft heraus!', sci: 'Nicht geführt: wird nach außen gebrochen' },
    },
    tags: { core: 'Kern, mit Germanium', clad: 'reines Glas drumherum' },
    hints: {
      laser: 'Tippe auf den Laser',
      bend: 'Tippe auf den Glasfaden, um ihn zu biegen',
      germ: 'Schiebe das Germanium',
      angle: 'Schiebe den Winkel des Strahls',
      done: 'Probiere die Regler',
    },
    sliders: { angle: 'Winkel des Strahls', ge: 'Germanium im Kern', bend: 'Biegung des Fadens' },
    straight: 'gerade',
    radius: 'Biegeradius {r} m',
    buttons: { laser: 'Einen Blitz schicken', bend: 'Faden biegen oder gerade machen' },
    says: {
      flash: {
        kid: 'Ein Lichtblitz! Er springt von Wand zu Wand den ganzen Faden entlang.',
        sci: 'Ein Puls wird unter {a}° zur Achse in den Kern geschickt: Er läuft im Zickzack durch Totalreflexion.',
      },
      arrived: {
        kid: 'Alle Blitze sind am anderen Ende angekommen. So kommt ein Stück deines Videos hinüber.',
        sci: 'Alle Pulse erreichen das andere Ende: Jeder Treffer an der Wand liegt jenseits des Grenzwinkels von {thc}°.',
      },
      lost: {
        kid: 'Der Blitz ist ins Glas drumherum und ins Meer entwischt. Ein Video bliebe genau hier stehen.',
        sci: 'Der Strahl trifft die Wand unter weniger als dem Grenzwinkel: Er wird in den Mantel gebrochen und geht verloren.',
      },
      bent: {
        kid: 'Der Faden biegt sich, und das Licht folgt ihm um die Kurve.',
        sci: 'Biegeradius {r} m: Der Strahl trifft die Wände weiter jenseits des Grenzwinkels, also wird er um die Kurve geführt.',
      },
      bentLeak: {
        kid: 'Zu scharfe Kurve! Das Licht trifft die Wand fast frontal und rutscht hinaus.',
        sci: 'Bei R = {r} m trifft der Strahl die äußere Wand unter {th}° zur Normalen, unter dem Grenzwinkel von {thc}°: Er tritt aus.',
      },
      straight: { kid: 'Wieder gerade.', sci: 'Wieder gerade.' },
      germ: {
        kid: 'Mit {x} von hundert Germanium ist die Mitte für das Licht etwas langsamer, und jetzt darf sich der Strahl {lim} Grad neigen und bleibt trotzdem drin.',
        sci: '{x} mol% GeO2: n Kern = {n1} gegen {n2} im Mantel. Grenzwinkel {thc}°, also werden Strahlen bis {lim}° zur Achse geführt.',
      },
      germ0: {
        kid: 'Gar kein Germanium. Die Mitte ist jetzt dasselbe Glas wie außen, also gibt es nichts, wovon er abprallen könnte. Das Licht geht einfach hinaus.',
        sci: 'Kein Dotierstoff: Kern und Mantel haben dieselbe Brechzahl, also gibt es keine Grenze zum Reflektieren.',
      },
      angle: {
        kid: 'Der Strahl neigt sich um {a} Grad. Er darf sich bis {lim} neigen, bevor er entkommt.',
        sci: 'Einkoppelwinkel {a}° zur Achse; die Grenze liegt bei {lim}°.',
      },
      angleLeak: {
        kid: 'Der Strahl neigt sich um {a} Grad. Das ist zu viel (die Grenze ist {lim}), also entkommt er.',
        sci: 'Der Einkoppelwinkel {a}° liegt jenseits der Grenze von {lim}°: Der Strahl trifft die Wand unter weniger als dem Grenzwinkel.',
      },
    },
    panel: {
      kid: [
        'Licht geht geradeaus, wie folgt es dann einer Kurve? Jeder Glasfaden besteht aus zwei Gläsern: einer Mitte, dem Kern, und einer Schicht darum. Im Kern steckt eine Prise Germanium, das das Licht dort ein klein wenig langsamer macht.',
        'Wenn Licht im langsamen Glas flach auf den Rand trifft, kommt es nicht hinaus. Es prallt zurück, wie ein Ball, der in einer Rinne rollt. Probier es aus: Schick einen Blitz und neige den Strahl immer mehr.',
        'Schiebe das Germanium auf null, und das Licht läuft heraus. Biege den Faden zu scharf, und dasselbe passiert. Dieser Faden ist ein Riese. Ein echter ist so dünn wie ein Haar, und seine leuchtende Mitte ist etwa achtmal dünner als ein Haar.',
      ],
      sci: [
        'Eine Telekommunikationsfaser: ein Kern von etwa 8 bis 9 µm Durchmesser, dotiert mit einigen Mol-Prozent Germaniumdioxid (GeO₂), in 125 µm Mantel aus reinem Quarzglas. Jedes Mol-Prozent GeO₂ hebt die Brechzahl um etwa 0,0015, sodass n des Kerns bei 1550 nm etwa 1,449 beträgt gegenüber 1,444 im Mantel, ein Sprung von etwa 0,35 %.',
        'Ein Strahl trifft die Grenze zwischen Kern und Mantel unter einem Winkel θ zur Normalen. Wo sin θ > n₂/n₁ gilt, wird er total reflektiert: Der Grenzwinkel beträgt etwa 85°, also wird ein Strahl geführt, wenn er weniger als etwa 5° von der Achse abweicht. Eine Biegung ändert die Winkel an der äußeren Wand (probiere den Regler); echte Faser verträgt sanfte Biegungen, verliert aber Licht, wenn man sie in einem Kreis von wenigen Zentimetern Durchmesser biegt.',
        'Das ist eine Vereinfachung: Das Strahlenbild passt zu dicken (Multimode-)Fasern. Ein nur 9 µm dünner Kern trägt eine einzige Mode der Lichtwelle, auch wenn derselbe Brechzahlsprung sie führt. Der Faden ist 8000-fach vergrößert gezeichnet, und der Strahl tritt unter dem Winkel ein, den du im Kern einstellst (aus der Luft würde er an der Stirnfläche gebrochen).',
      ],
    },
    tip: 'Tippe auf den Laser, um einen Blitz zu schicken. Schiebe Winkel und Germanium, um zu sehen, was das Licht drinnen hält.',
  },
  cable: {
    label: 'Das aufgeschnittene Kabel',
    title: 'Was steckt in einem Seekabel?',
    boardTitle: 'Die fünf Schichten',
    hints: {
      poly: 'Tippe auf den schwarzen Kunststoffmantel',
      steel: 'Tippe auf die Stahldrähte',
      copper: 'Tippe auf das Kupferrohr',
      gel: 'Tippe auf das Gel',
      glass: 'Tippe auf die Glasfasern',
      repeater: 'Tippe auf den Zwischenverstärker',
      pump: 'Tippe auf den Pumplaser',
      done: 'Tippe auf eine Schicht oder noch einmal auf den Pumplaser',
    },
    layers: {
      poly: {
        name: { kid: 'Kunststoffmantel', sci: 'Polyethylenmantel' },
        job: 'hält das Meer draußen und den Strom drinnen',
        says: {
          kid: 'Der schwarze Kunststoffmantel. Er hält das Meerwasser vom Metall drinnen fern, und weil Kunststoff keinen Strom leitet, hält er den Strom drinnen.',
          sci: 'Polyethylen-Isolierung: Sie dichtet das Kabel ab und isoliert den Kupferleiter der Stromversorgung, der mit Tausenden Volt arbeitet.',
        },
      },
      steel: {
        name: { kid: 'Stahldrähte', sci: 'Stahldrähte' },
        job: 'geben die Kraft, an einem Schiff zu hängen',
        says: {
          kid: 'Stahldrähte, wie ein Seil verdreht. Sie machen das Kabel stark genug, um an einem Schiff in kilometertiefem Wasser zu hängen.',
          sci: 'Verseilte hochfeste Stahldrähte tragen die Last: Ein Kabel zu verlegen heißt, Kilometer davon am Schiff hängen zu lassen.',
        },
      },
      copper: {
        name: { kid: 'Kupferrohr', sci: 'Kupferrohr' },
        job: 'schickt Strom zu den Zwischenverstärkern',
        says: {
          kid: 'Ein Kupferrohr. Es leitet Strom durch das Kabel, um die Zwischenverstärker zu versorgen, und hält das Wasser vom Glas fern.',
          sci: 'Ein Kupferrohr führt einen konstanten Strom bei Tausenden Volt zur Versorgung der Zwischenverstärker und hält Wasser von der Fasereinheit fern.',
        },
      },
      gel: {
        name: { kid: 'Gel', sci: 'Vaseline' },
        job: 'polstert das Glas und sperrt Wasser',
        says: {
          kid: 'Ein weiches Gel, ein bisschen wie Vaseline. Es polstert das Glas und verhindert, dass Wasser entlangkriecht, falls das Kabel je bricht.',
          sci: 'Vaseline polstert die Fasern und verhindert, dass Wasser am Kabel entlangläuft, wenn es durchtrennt wird.',
        },
      },
      glass: {
        name: { kid: 'Glasfasern', sci: 'Optische Fasern' },
        job: 'tragen das Licht, paarweise',
        says: {
          kid: 'Und ganz in der Mitte die Glasfäden! Sie kommen paarweise, ein Faden für jede Richtung, und die Mitte jedes Fadens enthält Germanium.',
          sci: 'Die Fasern, paarweise (eine für jede Richtung): einige Paare in einem Kabel, jede mit einem germaniumdioxid-dotierten Kern. Aller Kunststoff, Stahl und Kupfer ist da, um sie zu schützen.',
        },
      },
    },
    says: {
      open: {
        kid: 'Der Zwischenverstärker öffnet sich. Ein Lichtblitz kommt vom Meeresboden herein, schwach nach dem langen Weg.',
        sci: 'Zwischenverstärker offen. Der Puls kommt abgeschwächt durch die 50 bis 100 km Faser hinter ihm an.',
      },
      close: { kid: 'Wieder zu.', sci: 'Wieder zu.' },
      pumpOn: {
        kid: 'Der Pumplaser leuchtet in eine Spule aus Spezialglas mit Erbium darin (das ist das Rosa). Der schwache Blitz läuft hindurch und kommt wieder stark heraus!',
        sci: 'Ein Pumplaser (etwa 980 nm, infrarot und unsichtbar; violett gezeichnet) regt die Erbiumionen in der dotierten Faser an; das durchlaufende Signal bringt sie dazu, mehr Licht bei 1550 nm auszusenden. Verstärkung, ohne Umwandlung in Strom.',
      },
      pumpOff: {
        kid: 'Pumpe aus. Jetzt schluckt das Erbium das Licht, und der Blitz kommt noch schwächer heraus.',
        sci: 'Pumpe aus: Das nicht angeregte Erbium absorbiert das Signal, also verlässt der Puls die Faser schwächer, als er hineinkam.',
      },
    },
    panel: {
      kid: [
        'Ein Seekabel ist ungefähr so dick wie ein Gartenschlauch (dieses Modell ist etwa 60-mal größer). Aber fast alles daran ist da, um ein paar haardünne Glasfäden ganz in der Mitte zu schützen.',
        'Tippe die Schichten nacheinander an, von außen nach innen, und jede schiebt sich zurück, damit du die nächste siehst.',
        'Licht wird unterwegs schwächer, darum hat das Kabel alle 50 bis 100 Kilometer einen Zwischenverstärker, eine Stahltonne mit einem Lichtverstärker darin. Tippe darauf, um ihn zu öffnen, und dann auf seinen Pumplaser.',
      ],
      sci: [
        'Ein typisches Tiefseekabel ist etwa 17 bis 25 mm dick (dieses ist etwa 60-fach vergrößert gezeichnet). Von außen: Polyethylen; verseilte Stahldrähte; ein Kupferrohr, das einen konstanten Strom zu den Zwischenverstärkern führt; Vaseline; und einige Faserpaare. Die Hersteller unterscheiden sich in der Reihenfolge und fügen Bänder und Wassersperren hinzu; nahe der Küste bekommt das Kabel eine zusätzliche Stahlarmierung.',
        'Seit den 1990er-Jahren verstärkt ein Zwischenverstärker das Licht selbst, in einem Stück erbiumdotierter Faser, gepumpt von Laserdioden (bei 980 nm oder 1480 nm), ein Verstärker je Faser, gespeist über das Kupfer. Das erste transatlantische Glasfaserkabel, TAT-8 (1988), verwandelte das Licht an jedem Zwischenverstärker noch in Strom und zurück. Ein Zwischenverstärker ist eine druckfeste Stahltonne von ein bis zwei Metern Länge.',
      ],
    },
    tip: 'Tippe die Schichten von außen nach innen an, dann den Zwischenverstärker und seine Pumpe.',
    buttons: { layer: 'Nächste Schicht abziehen', repeater: 'Zwischenverstärker öffnen oder schließen', pump: 'Pumpe ein oder aus' },
  },
  sea: {
    label: 'Über den Ozean',
    title: 'Von Portugal nach Brasilien',
    boardTitle: 'Licht auf dem Weg',
    board: {
      kid: 'Entfernung: {d} km\nZeit: {t} Tausendstelsekunden\nLicht übrig: {left}',
      sci: 'd = {d} km\nt = {t} ms\nVerlust {db} dB\nLicht übrig: {left}',
    },
    all: 'alles',
    oneIn: '1 von {n}',
    zeros: '1 von einer 1 mit {z} Nullen',
    tenTo: '10^-{z}',
    lostWord: { kid: 'verloren!', sci: 'im Rauschen verloren' },
    topped: { kid: 'wieder aufgefüllt', sci: 'von den Zwischenverstärkern wiederhergestellt' },
    switch: 'Zwischenverstärker',
    map: { portugal: 'PORTUGAL', brazil: 'BRASILIEN', africa: 'AFRIKA', atlantic: 'ATLANTISCHER OZEAN' },
    hints: {
      sines: 'Tippe auf Sines',
      switch: 'Tippe auf den Schalter für die Zwischenverstärker',
      again: 'Tippe noch einmal auf Sines',
      slide: 'Schiebe die Entfernung',
      done: 'Tippe auf Fortaleza',
    },
    slider: 'Entfernung entlang des Kabels',
    buttons: { sines: 'Einen Blitz von Sines schicken', repeaters: 'Zwischenverstärker an oder aus', fortaleza: 'Nach Fortaleza' },
    says: {
      start: {
        kid: 'Ein Blitz verlässt Sines in Portugal. Wir bremsen die Zeit etwa 400-fach, damit du zuschauen kannst.',
        sci: 'Ein Puls verlässt Sines. Licht im Glas läuft mit etwa zwei Dritteln von c, 204 000 km/s: rund 200 km pro Millisekunde. Hier etwa 400-fach verlangsamt.',
      },
      lost: {
        kid: 'Der Blitz ist schon nach nur {d} Kilometern erloschen, und das Kabel ist Tausende lang! Es braucht Hilfe unterwegs.',
        sci: 'Bei 0,2 dB/km ist der Puls nach 300 km um 60 dB (ein Millionstel) geschwächt: zu schwach zum Lesen. Dieser Lauf geht bei {d} km verloren.',
      },
      faded: {
        kid: 'Am Ende ist nichts angekommen.',
        sci: 'Nichts kommt an: Das Signal ist weg.',
      },
      on: {
        kid: 'Zwischenverstärker an! Einer alle 50 bis 100 Kilometer füllt das Licht wieder auf.',
        sci: 'Zwischenverstärker an (hier einer alle 70 km; echte alle 50 bis 100 km): Jeder stellt das Signal wieder her, sodass der Verlust sich nie zu mehr als einer Strecke summiert.',
      },
      off: { kid: 'Zwischenverstärker aus.', sci: 'Zwischenverstärker aus.' },
      arrive: {
        kid: 'Er hat es bis nach Fortaleza in Brasilien geschafft, in etwa {t} Tausendstelsekunden!',
        sci: 'Etwa 6000 km in etwa {t} ms bei 204 000 km/s; hin und zurück sind es etwa {rt} ms (die Betreiber von EllaLink nennen unter 60 ms, Geräte eingerechnet).',
      },
      far: {
        kid: 'Bis nach Brasilien ohne Zwischenverstärker: Es bliebe nur {left} vom Licht übrig. Das ist gar nichts.',
        sci: 'Ohne Verstärker kosten 6000 km {db} dB: Es käme {left} des Lichts an.',
      },
      slide: {
        kid: 'Nach {d} Kilometern ohne Zwischenverstärker ist {left} vom Licht übrig.',
        sci: 'd = {d} km: {db} dB, also bleibt ohne Zwischenverstärker {left} des Lichts übrig.',
      },
    },
    panel: {
      kid: [
        'Sines, an der Küste Portugals, ist einer der Orte, an denen Kabel aus dem Meer kommen. Von hier läuft EllaLink unter dem Atlantik nach Fortaleza in Brasilien: etwa 6000 Kilometer Kabel, 2021 fertig.',
        'Licht im Glas ist etwa zwei Drittel so schnell wie im leeren Raum: etwa 200 Kilometer in jeder Tausendstelsekunde. Von Portugal nach Brasilien dauert es also etwa 30 Tausendstelsekunden.',
        'Aber Glas ist nicht ganz klar. Nach 15 Kilometern ist die Hälfte des Lichts weg, nach 100 Kilometern bleibt nur ein Hundertstel, und nach 300 nur ein Millionstel. Darum gibt es Zwischenverstärker. Probier es aus!',
      ],
      sci: [
        'EllaLink: Sines (Portugal) nach Fortaleza (Brasilien), etwa 6000 km, 2021 in Betrieb genommen. Licht in Quarzglas läuft mit c/n bei einer Gruppenbrechzahl von etwa 1,468 bei 1550 nm: 204 000 km/s, etwa 200 km pro Millisekunde, also etwa 29 ms in eine Richtung. Die Betreiber nennen unter 60 ms für hin und zurück, Geräte eingerechnet.',
        'Die Dämpfung beträgt etwa 0,2 dB/km bei 1550 nm, nahe dem Minimum von Quarzglas (deshalb nutzt man diese Wellenlänge): 3 dB, die halbe Leistung, nach 15 km; 20 dB, ein Hundertstel, nach 100 km; 60 dB nach 300 km. Ohne Verstärker würden 6000 km 1200 dB kosten, einen Faktor 10⁻¹²⁰. Ein Zwischenverstärker alle 50 bis 100 km (60 bis 120 auf dieser Strecke) stellt die Leistung jedes Mal wieder her, sodass sich der Verlust nie summiert. Über eine Million Kilometer Seekabel tragen heute die Daten der Welt zwischen den Kontinenten.',
      ],
    },
    tip: 'Tippe auf Sines, dann auf den Schalter, dann noch einmal auf Sines. Oder schiebe die Entfernung.',
  },
}

export const FIBRE_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
