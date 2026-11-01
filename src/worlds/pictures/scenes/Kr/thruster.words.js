// The words of krypton's thruster room ("What pushes a satellite along?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Kr.js (the easel shows it); the room lets you work the engine and adds to it.
// Facts and where they come from (checked 2026-11-01):
// - Hall-effect thrusters: electrons trapped by a radial magnetic field circle the channel (the Hall
//   current), ionise the propellant, and the ions are accelerated by the axial electric field; a cathode
//   neutralises the beam (so the satellite does not charge up and pull the ions back). Exhaust speeds
//   of about 15 to 20 km/s are typical (the board's figure).
// - The ion speed in the room is the ideal v = sqrt(2 e V / m) for a singly charged ion: krypton at 300 V
//   26.3 km/s, xenon 21.0, argon 38.1 (masses from elements.json). A real engine's effective exhaust speed
//   is lower (neutral atoms escape, the beam spreads, not all the volts act): about 15 to 20 km/s.
// - Starlink: the first satellites (2019 on) used krypton Hall thrusters; the V2 Mini (2023) uses argon,
//   which SpaceX said gives 2.4 times the thrust and 1.5 times the specific impulse of the older thruster
//   (170 mN for argon, so about 70 mN and about 16 km/s for krypton: worked out, not published directly;
//   the words say "about"). First satellites about 260 kg (SpaceX), a flat body about 3 m wide and one solar
//   wing about 8 m (published sizes vary a little: "about"). Working height 550 km (shell 1), released low,
//   at roughly 300 km, so that a failed satellite falls back soon.
// - Orbit at 550 km: speed 7.6 km/s, one turn in about 95 minutes (calculated). From 300 to 550 km the
//   speed needed falls by 140 m/s; at 70 mN and 260 kg that is 6 days of firing nonstop (calculated; a real
//   climb takes weeks to months because the engine fires part of the time and drag pulls at low height),
//   so the slider's 90 days are an illustration.
// - 70 mN pushes with the weight of 7.1 g; a one-euro coin weighs 7.5 g.
// - Air: argon 9340 ppm, krypton 1.14 ppm, xenon 0.087 ppm (by volume); prices per kg from elements.json
//   (US dollars, list prices: Ar 0.931, Kr 290, Xe 1800); first ionisation energies 15.76, 14.00, 12.13 eV.
// Placeholders: {v} volts, {n} number, {h} height, {g} grams, {gas} a gas's name, {push}, {speed}.
export const THRUSTER_WORDS = {
  "en": {
    "title": "A platform in orbit",
    "greet": {
      "kid": "We are inside the picture: a docking platform about 550 kilometres above the Earth. The ground below is the real Earth, and every hour and a half the Sun rises over the edge. The picture's story is on the easel beside you.",
      "sci": "A docking platform in low Earth orbit, 550 km up: the altitude of Starlink's first shell, with a period of about 95 minutes and a speed of 7.6 km/s, so the Sun rises about every 95 minutes (here sped up). The picture's story is on the easel."
    },
    "talk": {
      "kid": [
        "Out here there is almost no air, so a push never stops working. A tiny push, kept up for days, can move a whole satellite.",
        "See the little lights crossing the sky? Some are satellites, and some are a whole row of sisters, flying one behind the other.",
        "I am krypton. I was found in 1898, hidden in the air. Now I help push satellites along."
      ],
      "sci": [
        "In vacuum a small thrust acts without drag, so a satellite's speed changes by thrust over mass, second after second: 70 mN on 260 kg adds about 2.7 mm/s every 10 seconds.",
        "The lights crossing the sky are satellites seen by sunlight. A string of equally spaced ones is a batch of Starlinks not yet spread out along their orbit.",
        "Krypton was isolated by William Ramsay and Morris Travers in 1898, from liquid air. Its first ionisation energy, 14.0 eV, is low enough for a Hall thruster to use it."
      ]
    },
    "engine": {
      "label": "The krypton engine",
      "title": "Open the engine",
      "signs": {
        "valve": "Gas valve",
        "magnets": "Magnets",
        "cathode": "Cathode",
        "anode": "Anode"
      },
      "slider": "Voltage",
      "volts": "{v} volts",
      "hints": {
        "valve": "Tap the gas valve",
        "magnet": "Tap the magnets",
        "volts": "Press E and raise the voltage",
        "off": "Tap the cathode to switch it off",
        "on": "Tap the cathode to switch it on"
      },
      "buttons": {
        "valve": "Gas on or off",
        "magnet": "Magnets on or off",
        "cathode": "Cathode on or off"
      },
      "readout": {
        "speed": "Ion speed",
        "push": "Push",
        "charge": "Satellite charge",
        "km": "{n} km/s",
        "mn": "{n} mN",
        "coin": "like a coin: {g} g",
        "ok": "fine",
        "high": "too much!",
        "none": "no ions yet"
      },
      "says": {
        "valveOn": {
          "kid": "The valve is open: krypton atoms drift in from the back of the ring. They are just gas, so nothing pushes yet.",
          "sci": "Propellant flows to the anode, a ring with small holes that spreads the gas round the channel. Neutral atoms drift slowly up the channel."
        },
        "valveOff": {
          "kid": "Valve shut: no more atoms come in.",
          "sci": "Valve closed: the flow stops and the channel empties."
        },
        "magnetOn": {
          "kid": "The magnets make a field across the channel. Electrons are tiny and light, so the field catches them and they whirl round and round the ring.",
          "sci": "A radial magnetic field crosses the channel. Electrons are trapped by it and drift round the ring: the Hall current."
        },
        "magnetOff": {
          "kid": "Magnets off: the electrons are not held any more.",
          "sci": "Field off: the electrons are no longer trapped, and no Hall current builds up."
        },
        "flow": {
          "kid": "Look! Atoms hit the whirling electrons, lose one of their own, and become ions. The electric push flings the ions out of the back. That is the push on the satellite.",
          "sci": "Atoms that cross the Hall current are ionised (Kr -> Kr+ + e−) and the axial electric field accelerates the ions out. The reaction on the thruster is the thrust."
        },
        "needGas": {
          "kid": "There are no atoms to push yet. Open the gas valve.",
          "sci": "No propellant in the channel: open the valve."
        },
        "needMagnet": {
          "kid": "Atoms come in, but nothing catches the electrons yet. Switch the magnets on.",
          "sci": "No magnetic field: the electrons are not trapped, so the gas is not ionised."
        },
        "cathodeOff": {
          "kid": "Cathode off! The ions leave but no electrons follow, so the satellite fills up with electric charge. It pulls the ions back, and the push dies away.",
          "sci": "Cathode off: the beam leaves positive and the spacecraft charges negative. Its potential pulls the ions back and the thrust collapses."
        },
        "cathodeOn": {
          "kid": "Cathode on: it sends electrons after the ions. The charge drains away and the plume runs again.",
          "sci": "Cathode on: it emits electrons into the beam, neutralising it. The charge drains and the thrust returns."
        }
      },
      "panel": {
        "kid": [
          "This is a Hall thruster, cut in half. Gas goes in at the back. Magnets catch whirling electrons. When a krypton atom meets an electron, it becomes an ion, and an electric push throws the ions out of the back at over 50,000 kilometres an hour.",
          "The cathode sends electrons out after the ions. Without it the satellite would fill up with charge and pull its own ions back. Nothing is burned: it is just electricity pushing atoms."
        ],
        "sci": [
          "A Hall-effect thruster is an annular channel with a radial magnetic field and an axial electric field of a few hundred volts between the anode (at the closed end, which also feeds the gas) and a cathode outside. Electrons from the cathode are held in the channel by the field and drift round it (the Hall current); they ionise the propellant atoms, and the heavy ions are accelerated out by the electric field.",
          "A singly charged ion falls through V volts and leaves at v = sqrt(2eV/m): for krypton (83.8 u) at 300 V, 26.3 km/s. The engine's effective exhaust speed is lower, about 15 to 20 km/s, because some atoms escape unionised and the beam spreads sideways. The cathode also emits electrons into the beam: without that, the spacecraft would charge up and pull the ions back. In this model the push is 70 mN at 300 V with krypton, and falls as the square root of the voltage for the same gas flow."
        ]
      }
    },
    "sat": {
      "label": "The satellite",
      "title": "Climb to work",
      "signs": {
        "thruster": "Thruster",
        "junk": "Space junk",
        "end": "The end",
        "scale": "Its push",
        "globe": "Orbit (heights exaggerated)"
      },
      "slider": "Days since launch",
      "days": "day {n}: {h} km high",
      "scale": {
        "push": "{n} mN",
        "coin": "a coin: {g} g"
      },
      "hints": {
        "push": "Tap the thruster",
        "junk": "Tap the space junk",
        "end": "Tap the red button",
        "more": "Slide the days in the panel"
      },
      "buttons": {
        "push": "Fire the thruster",
        "junk": "Warn of the junk",
        "end": "The end of its life"
      },
      "says": {
        "push": {
          "kid": "A tiny push: about as heavy as one coin. It does not sound like much, but nothing slows the satellite down out here, so the pushes add up.",
          "sci": "About 70 mN, the weight of 7 g: a one-euro coin. With nothing to slow it down, 70 mN on about 260 kg adds 0.27 mm/s every second, 23 m/s a day if it fired all day."
        },
        "junk": {
          "kid": "Space junk is coming! The satellite fires its engine and steps out of the way. Phew.",
          "sci": "A piece of debris on a close pass: the satellite fires and shifts its orbit by a few metres so that the two miss each other."
        },
        "junkWait": {
          "kid": "The junk is already on its way, wait a moment.",
          "sci": "The avoidance manoeuvre is running: wait for it."
        },
        "end": {
          "kid": "The end of its life: the satellite lowers itself on purpose, drops into the air and burns up like a shooting star. Nothing is left in space. A new one will take its place.",
          "sci": "Deorbit: the satellite lowers its orbit with its thruster until the thin upper air drags it down, and it burns up on re-entry rather than staying as junk."
        },
        "endWait": {
          "kid": "It is on its way down, wait a moment.",
          "sci": "Re-entry under way: wait for it."
        },
        "days": {
          "kid": "Day by day the little pushes lift the orbit, from where the rocket left the satellite up to its working height.",
          "sci": "Low-thrust orbit raising: the orbit climbs almost linearly. Here from 300 km to 550 km over 90 days, an illustration: real climbs take weeks to months."
        }
      },
      "panel": {
        "kid": [
          "An internet satellite is a flat box about 3 metres wide with one solar wing about 8 metres long. The rocket leaves it low, about 300 kilometres up. Its engine then pushes it, a little every day, up to its working height of 550 kilometres.",
          "The same little engine moves it out of the way of space junk, and at the end of its life lowers it until it burns up in the air. Slide the days to watch the orbit climb: the globe is not to scale, the heights are made bigger."
        ],
        "sci": [
          "Starlink satellites are released low, at roughly 300 km, so that one that fails falls back soon; the working orbit is at 550 km, where the speed is 7.6 km/s and a turn takes about 95 minutes. The first production satellites weighed about 260 kg, with a flat body about 3 m wide and one solar wing about 8 m long (sizes vary a little with version).",
          "Climbing from 300 to 550 km needs 140 m/s less speed, which a low-thrust engine achieves by pushing along the orbit, so the orbit spirals up. At 70 mN on 260 kg that is about 6 days of firing nonstop; a real climb takes weeks to months, because the engine fires part of the time and drag at low height pulls back. The thrust is worked out from SpaceX's statement that the 2023 argon thruster gives 2.4 times the thrust of the older krypton one (170 mN), so about 70 mN: approximate."
        ]
      }
    },
    "fuel": {
      "label": "The propellants",
      "title": "Pick a propellant",
      "signs": {
        "rack": "Tap a bottle"
      },
      "hints": {
        "pick": "Tap a bottle",
        "other": "Tap another bottle"
      },
      "buttons": {
        "Xe": "Xenon",
        "Kr": "Krypton",
        "Ar": "Argon"
      },
      "board": {
        "head": {
          "kid": "The three gases compared",
          "sci": "Hall-thruster propellants compared"
        },
        "rows": {
          "air": {
            "kid": "In the air: 1 atom in",
            "sci": "Share of air (ppm)"
          },
          "price": {
            "kid": "Price of a kilogram ($)",
            "sci": "Price per kg (US $, list)"
          },
          "mass": {
            "kid": "How heavy is one atom",
            "sci": "Atomic mass (u)"
          },
          "ion": {
            "kid": "Energy to take an electron off (eV)",
            "sci": "First ionisation energy (eV)"
          },
          "speed": {
            "kid": "Speed of the ions at 300 volts (km/s)",
            "sci": "Ion speed at 300 V (km/s)"
          },
          "push": {
            "kid": "Push for the same electricity (krypton = 1)",
            "sci": "Thrust per watt (krypton = 1)"
          }
        }
      },
      "says": {
        "Xe": {
          "kid": "Xenon: the heavy atom that gives the most push for the electricity. But there is hardly any in the air, and it costs a fortune.",
          "sci": "Xenon: 131 u, ionises at 12.1 eV and gives the most thrust per watt, but it is 0.087 ppm of air and costs about $1800 a kilogram."
        },
        "Kr": {
          "kid": "Krypton: a little less push than xenon, but there is about thirteen times more of it, so it costs much less. This is what the first Starlinks used.",
          "sci": "Krypton: 83.8 u, 14.0 eV. About 20% less thrust per watt than xenon, but 13 times more plentiful (1.14 ppm) and about $290 a kilogram. The first Starlinks flew it."
        },
        "Ar": {
          "kid": "Argon: nearly one atom in a hundred of the air is argon, and it costs hardly anything. Its atoms are light, so it pushes less for the electricity: you need more power. The newer Starlinks use it.",
          "sci": "Argon: 39.9 u, 15.8 eV. 0.93% of air, under $1 a kilogram. A light ion leaves faster (38 km/s at 300 V) so the thrust per watt is lower; the 2023 Starlink V2 Mini uses it with a more powerful supply."
        }
      },
      "panel": {
        "kid": [
          "Which gas should the engine use? Heavy atoms give a bigger push for the same electricity, and they are easier to knock an electron off. Xenon is the best at that, but there is very little of it in the air, so it is very expensive.",
          "Krypton is a good middle: a bit less push, but much cheaper. Argon is everywhere and nearly free, but its atoms are light, so a satellite needs more electricity to get the same push. Tap a bottle: the engine here changes its gas."
        ],
        "sci": [
          "For the same accelerating voltage a heavier ion leaves slower, and for the same power the thrust is F = 2 eta P / v, so it is larger: relative to krypton, xenon gives 1.25 and argon 0.69 (ideal; real efficiencies differ a little). Lighter atoms also need more energy to ionise (12.1, 14.0, 15.8 eV for Xe, Kr, Ar), which costs a little more of each ion's energy.",
          "Xenon is 0.087 ppm of air, krypton 1.14 ppm, argon 9340 ppm, and the prices follow: about $1800, $290 and $0.93 a kilogram (list prices, which move). SpaceX's first Starlinks used krypton; the larger V2 Mini (2023) uses argon, which it described as 2.4 times the thrust and 1.5 times the specific impulse of the earlier thruster. Tap a bottle: the engine changes its gas, and so do its plume and push."
        ]
      }
    }
  },
  "pt-pt": {
    "title": "Uma plataforma em órbita",
    "greet": {
      "kid": "Estamos dentro da imagem: uma plataforma de acoplagem a cerca de 550 quilómetros acima da Terra. O chão lá em baixo é a Terra verdadeira, e de hora e meia em hora e meia o Sol nasce por cima do horizonte. A história da imagem está no cavalete ao teu lado.",
      "sci": "Uma plataforma de acoplagem em órbita terrestre baixa, a 550 km de altitude: a altura da primeira camada da Starlink, com um período de cerca de 95 minutos e uma velocidade de 7,6 km/s, pelo que o Sol nasce de 95 em 95 minutos (aqui acelerado). A história da imagem está no cavalete."
    },
    "talk": {
      "kid": [
        "Aqui fora quase não há ar, por isso um empurrão nunca deixa de funcionar. Um empurrão minúsculo, mantido durante dias, pode mover um satélite inteiro.",
        "Vês as luzinhas a atravessar o céu? Umas são satélites, outras são uma fila inteira de irmãos, a voar uns atrás dos outros.",
        "Eu sou o crípton. Fui descoberto em 1898, escondido no ar. Agora ajudo a empurrar satélites."
      ],
      "sci": [
        "No vácuo, uma força pequena atua sem resistência, por isso a velocidade de um satélite muda segundo após segundo na razão da força pela massa: 70 mN sobre 260 kg acrescentam cerca de 2,7 mm/s de 10 em 10 segundos.",
        "As luzes que atravessam o céu são satélites vistos pela luz do Sol. Uma fila de pontos igualmente espaçados é um lote de Starlinks que ainda não se dispersou ao longo da órbita.",
        "O crípton foi isolado por William Ramsay e Morris Travers em 1898, a partir de ar líquido. A sua primeira energia de ionização, 14,0 eV, é baixa o suficiente para um propulsor de efeito Hall o usar."
      ]
    },
    "engine": {
      "label": "O motor de crípton",
      "title": "Abre o motor",
      "signs": {
        "valve": "Válvula do gás",
        "magnets": "Ímanes",
        "cathode": "Cátodo",
        "anode": "Ânodo"
      },
      "slider": "Tensão",
      "volts": "{v} volts",
      "hints": {
        "valve": "Toca na válvula do gás",
        "magnet": "Toca nos ímanes",
        "volts": "Prime E e aumenta a tensão",
        "off": "Toca no cátodo para o desligar",
        "on": "Toca no cátodo para o ligar"
      },
      "buttons": {
        "valve": "Gás ligado ou desligado",
        "magnet": "Ímanes ligados ou desligados",
        "cathode": "Cátodo ligado ou desligado"
      },
      "readout": {
        "speed": "Velocidade dos iões",
        "push": "Empurrão",
        "charge": "Carga do satélite",
        "km": "{n} km/s",
        "mn": "{n} mN",
        "coin": "como uma moeda: {g} g",
        "ok": "normal",
        "high": "demasiada!",
        "none": "ainda sem iões"
      },
      "says": {
        "valveOn": {
          "kid": "A válvula está aberta: átomos de crípton entram pelo fundo do anel. São só gás, por isso ainda nada empurra.",
          "sci": "O propelente flui para o ânodo, um anel com pequenos furos que reparte o gás pelo canal. Os átomos neutros sobem devagar pelo canal."
        },
        "valveOff": {
          "kid": "Válvula fechada: já não entram mais átomos.",
          "sci": "Válvula fechada: o fluxo pára e o canal esvazia-se."
        },
        "magnetOn": {
          "kid": "Os ímanes criam um campo através do canal. Os eletrões são minúsculos e leves, por isso o campo apanha-os e eles giram, giram à volta do anel.",
          "sci": "Um campo magnético radial atravessa o canal. Os eletrões ficam presos nele e derivam à volta do anel: a corrente de Hall."
        },
        "magnetOff": {
          "kid": "Ímanes desligados: os eletrões já não ficam presos.",
          "sci": "Campo desligado: os eletrões já não ficam presos e não se forma corrente de Hall."
        },
        "flow": {
          "kid": "Olha! Os átomos chocam com os eletrões que giram, perdem um dos seus e tornam-se iões. O empurrão elétrico atira os iões pela parte de trás. É esse o empurrão no satélite.",
          "sci": "Os átomos que atravessam a corrente de Hall são ionizados (Kr -> Kr+ + e−) e o campo elétrico axial acelera os iões para fora. A reação sobre o propulsor é a força de propulsão."
        },
        "needGas": {
          "kid": "Ainda não há átomos para empurrar. Abre a válvula do gás.",
          "sci": "Não há propelente no canal: abre a válvula."
        },
        "needMagnet": {
          "kid": "Entram átomos, mas ainda nada apanha os eletrões. Liga os ímanes.",
          "sci": "Sem campo magnético: os eletrões não ficam presos, por isso o gás não é ionizado."
        },
        "cathodeOff": {
          "kid": "Cátodo desligado! Os iões saem, mas nenhum eletrão os segue, e o satélite enche-se de carga elétrica. Ele puxa os iões de volta e o empurrão desaparece.",
          "sci": "Cátodo desligado: o feixe sai positivo e a nave fica carregada negativamente. O seu potencial puxa os iões de volta e a força de propulsão colapsa."
        },
        "cathodeOn": {
          "kid": "Cátodo ligado: manda eletrões atrás dos iões. A carga escoa-se e o jato volta a correr.",
          "sci": "Cátodo ligado: emite eletrões para o feixe, neutralizando-o. A carga escoa-se e a força de propulsão regressa."
        }
      },
      "panel": {
        "kid": [
          "Isto é um propulsor de efeito Hall, cortado ao meio. O gás entra por trás. Os ímanes prendem eletrões que giram. Quando um átomo de crípton encontra um eletrão, torna-se um ião, e um empurrão elétrico atira os iões pela parte de trás a mais de 50 000 quilómetros por hora.",
          "O cátodo manda eletrões atrás dos iões. Sem ele, o satélite encher-se-ia de carga e puxaria de volta os seus próprios iões. Nada é queimado: é só eletricidade a empurrar átomos."
        ],
        "sci": [
          "Um propulsor de efeito Hall é um canal anular com um campo magnético radial e um campo elétrico axial de algumas centenas de volts entre o ânodo (na extremidade fechada, que também fornece o gás) e um cátodo no exterior. Os eletrões do cátodo ficam retidos no canal pelo campo e derivam à volta dele (a corrente de Hall); ionizam os átomos de propelente, e os iões, pesados, são acelerados para fora pelo campo elétrico.",
          "Um ião com uma carga cai através de V volts e sai com v = sqrt(2eV/m): para o crípton (83,8 u) a 300 V, 26,3 km/s. A velocidade de escape efetiva do motor é menor, cerca de 15 a 20 km/s, porque alguns átomos escapam sem ser ionizados e o feixe abre para os lados. O cátodo também emite eletrões para o feixe: sem isso, a nave carregar-se-ia e puxaria os iões de volta. Neste modelo a força é de 70 mN a 300 V com crípton, e diminui com a raiz quadrada da tensão para o mesmo caudal de gás."
        ]
      }
    },
    "sat": {
      "label": "O satélite",
      "title": "Sobe até ao trabalho",
      "signs": {
        "thruster": "Propulsor",
        "junk": "Lixo espacial",
        "end": "O fim",
        "scale": "O seu empurrão",
        "globe": "Órbita (alturas exageradas)"
      },
      "slider": "Dias desde o lançamento",
      "days": "dia {n}: {h} km de altura",
      "scale": {
        "push": "{n} mN",
        "coin": "uma moeda: {g} g"
      },
      "hints": {
        "push": "Toca no propulsor",
        "junk": "Toca no lixo espacial",
        "end": "Toca no botão vermelho",
        "more": "Desliza os dias no painel"
      },
      "buttons": {
        "push": "Ligar o propulsor",
        "junk": "Avisar do lixo",
        "end": "O fim da vida"
      },
      "says": {
        "push": {
          "kid": "Um empurrão minúsculo: pesa tanto como uma moeda. Não parece muito, mas aqui nada trava o satélite, por isso os empurrões vão-se somando.",
          "sci": "Cerca de 70 mN, o peso de 7 g: uma moeda de um euro. Sem nada que o trave, 70 mN sobre cerca de 260 kg acrescentam 0,27 mm/s em cada segundo, 23 m/s por dia se disparasse o dia inteiro."
        },
        "junk": {
          "kid": "Vem aí lixo espacial! O satélite liga o motor e desvia-se. Ufa.",
          "sci": "Um fragmento numa passagem próxima: o satélite dispara e desloca a sua órbita alguns metros para que os dois não se cruzem."
        },
        "junkWait": {
          "kid": "O lixo já vem a caminho, espera um momento.",
          "sci": "A manobra de desvio está em curso: espera que acabe."
        },
        "end": {
          "kid": "O fim da vida: o satélite baixa-se de propósito, cai para o ar e arde como uma estrela cadente. Não fica nada no espaço. Um novo vai ocupar o lugar.",
          "sci": "Desorbitação: o satélite baixa a sua órbita com o propulsor até o ar rarefeito das camadas altas o travar, e arde na reentrada em vez de ficar como lixo."
        },
        "endWait": {
          "kid": "Já vai a cair, espera um momento.",
          "sci": "Reentrada em curso: espera que acabe."
        },
        "days": {
          "kid": "Dia após dia, os pequenos empurrões vão subindo a órbita, desde onde o foguetão deixou o satélite até à sua altura de trabalho.",
          "sci": "Subida de órbita com propulsão fraca: a órbita sobe quase linearmente. Aqui, de 300 km a 550 km em 90 dias, uma ilustração: as subidas reais demoram semanas a meses."
        }
      },
      "panel": {
        "kid": [
          "Um satélite de internet é uma caixa plana com cerca de 3 metros de largura e uma asa solar com cerca de 8 metros de comprimento. O foguetão deixa-o em baixo, a cerca de 300 quilómetros de altura. O motor empurra-o então, um pouco todos os dias, até à sua altura de trabalho, 550 quilómetros.",
          "O mesmo motorzinho desvia-o do lixo espacial e, no fim da vida, baixa-o até arder no ar. Desliza os dias para ver a órbita subir: o globo não está à escala, as alturas foram aumentadas."
        ],
        "sci": [
          "Os satélites Starlink são largados em baixo, a cerca de 300 km, para que um que falhe volte a cair depressa; a órbita de trabalho está a 550 km, onde a velocidade é de 7,6 km/s e uma volta demora cerca de 95 minutos. Os primeiros satélites de produção pesavam cerca de 260 kg, com um corpo plano de cerca de 3 m de largura e uma asa solar de cerca de 8 m de comprimento (as medidas variam um pouco com a versão).",
          "Subir de 300 para 550 km exige menos 140 m/s de velocidade, o que um motor de propulsão fraca consegue empurrando ao longo da órbita, de modo que a órbita sobe em espiral. A 70 mN sobre 260 kg isso dá cerca de 6 dias de disparo contínuo; uma subida real demora semanas a meses, porque o motor dispara só parte do tempo e a resistência do ar a baixa altura puxa para trás. A força foi calculada a partir da afirmação da SpaceX de que o propulsor de árgon de 2023 dá 2,4 vezes a força do antigo, de crípton (170 mN), ou seja, cerca de 70 mN: aproximado."
        ]
      }
    },
    "fuel": {
      "label": "Os propelentes",
      "title": "Escolhe um propelente",
      "signs": {
        "rack": "Toca numa garrafa"
      },
      "hints": {
        "pick": "Toca numa garrafa",
        "other": "Toca noutra garrafa"
      },
      "buttons": {
        "Xe": "Xénon",
        "Kr": "Crípton",
        "Ar": "Árgon"
      },
      "board": {
        "head": {
          "kid": "Os três gases comparados",
          "sci": "Propelentes de propulsores Hall comparados"
        },
        "rows": {
          "air": {
            "kid": "No ar: 1 átomo em",
            "sci": "Parte do ar (ppm)"
          },
          "price": {
            "kid": "Preço de um quilograma ($)",
            "sci": "Preço por kg (US $, tabela)"
          },
          "mass": {
            "kid": "Quanto pesa um átomo",
            "sci": "Massa atómica (u)"
          },
          "ion": {
            "kid": "Energia para tirar um eletrão (eV)",
            "sci": "Primeira energia de ionização (eV)"
          },
          "speed": {
            "kid": "Velocidade dos iões a 300 volts (km/s)",
            "sci": "Velocidade dos iões a 300 V (km/s)"
          },
          "push": {
            "kid": "Empurrão com a mesma eletricidade (crípton = 1)",
            "sci": "Força por watt (crípton = 1)"
          }
        }
      },
      "says": {
        "Xe": {
          "kid": "Xénon: o átomo pesado que dá mais empurrão para a mesma eletricidade. Mas quase não há no ar, e custa uma fortuna.",
          "sci": "Xénon: 131 u, ioniza-se a 12,1 eV e dá a maior força por watt, mas é 0,087 ppm do ar e custa cerca de 1800 $ por quilograma."
        },
        "Kr": {
          "kid": "Crípton: um pouco menos de empurrão do que o xénon, mas há cerca de treze vezes mais, por isso custa muito menos. Foi o que usaram os primeiros Starlink.",
          "sci": "Crípton: 83,8 u, 14,0 eV. Cerca de 20% menos força por watt do que o xénon, mas 13 vezes mais abundante (1,14 ppm) e cerca de 290 $ por quilograma. Os primeiros Starlink usaram-no."
        },
        "Ar": {
          "kid": "Árgon: quase um átomo em cada cem do ar é árgon, e custa quase nada. Os seus átomos são leves, por isso empurra menos para a mesma eletricidade: é preciso mais potência. Os Starlink mais recentes usam-no.",
          "sci": "Árgon: 39,9 u, 15,8 eV. 0,93% do ar, menos de 1 $ por quilograma. Um ião leve sai mais depressa (38 km/s a 300 V), pelo que a força por watt é menor; o Starlink V2 Mini de 2023 usa-o, com uma alimentação mais potente."
        }
      },
      "panel": {
        "kid": [
          "Que gás deve o motor usar? Os átomos pesados dão mais empurrão para a mesma eletricidade, e é mais fácil tirar-lhes um eletrão. O xénon é o melhor nisso, mas há muito pouco no ar, por isso é caríssimo.",
          "O crípton é um bom meio-termo: um pouco menos de empurrão, mas muito mais barato. O árgon está em toda a parte e é quase de graça, mas os seus átomos são leves, por isso o satélite precisa de mais eletricidade para o mesmo empurrão. Toca numa garrafa: o motor aqui muda de gás."
        ],
        "sci": [
          "Para a mesma tensão de aceleração, um ião mais pesado sai mais devagar, e para a mesma potência a força é F = 2 eta P / v, por isso é maior: em relação ao crípton, o xénon dá 1,25 e o árgon 0,69 (ideal; as eficiências reais diferem um pouco). Os átomos mais leves também precisam de mais energia para serem ionizados (12,1; 14,0; 15,8 eV para Xe, Kr, Ar), o que gasta um pouco mais da energia de cada ião.",
          "O xénon é 0,087 ppm do ar, o crípton 1,14 ppm, o árgon 9340 ppm, e os preços seguem-se: cerca de 1800 $, 290 $ e 0,93 $ por quilograma (preços de tabela, que mudam). Os primeiros Starlink da SpaceX usaram crípton; o V2 Mini, maior (2023), usa árgon, que a empresa descreveu como 2,4 vezes a força e 1,5 vezes o impulso específico do propulsor anterior. Toca numa garrafa: o motor muda de gás, e também o seu jato e o empurrão."
        ]
      }
    }
  },
  "pl": {
    "title": "Platforma na orbicie",
    "greet": {
      "kid": "Jesteśmy w obrazie: platforma dokująca około 550 kilometrów nad Ziemią. Ziemia pod nami jest prawdziwa, a co półtorej godziny nad krawędzią wschodzi Słońce. Historia obrazu jest na sztalugach obok ciebie.",
      "sci": "Platforma dokująca na niskiej orbicie okołoziemskiej, na wysokości 550 km: tyle co pierwsza powłoka Starlinka, okres około 95 minut i prędkość 7,6 km/s, więc Słońce wschodzi mniej więcej co 95 minut (tu przyspieszone). Historia obrazu jest na sztalugach."
    },
    "talk": {
      "kid": [
        "Tu na górze prawie nie ma powietrza, więc pchnięcie nigdy nie przestaje działać. Maleńkie pchnięcie, powtarzane przez wiele dni, potrafi poruszyć całego satelitę.",
        "Widzisz światełka przesuwające się po niebie? Niektóre to satelity, a inne to cały rząd sióstr, lecących jedna za drugą.",
        "Jestem krypton. Odkryto mnie w 1898 roku, ukrytego w powietrzu. Teraz pomagam popychać satelity."
      ],
      "sci": [
        "W próżni mała siła działa bez oporu, więc prędkość satelity zmienia się sekunda po sekundzie o siłę podzieloną przez masę: 70 mN na 260 kg dodaje około 2,7 mm/s co 10 sekund.",
        "Światełka przesuwające się po niebie to satelity widoczne w świetle Słońca. Rząd równo rozmieszczonych punktów to partia Starlinków, które jeszcze się nie rozproszyły wzdłuż orbity.",
        "Krypton wyodrębnili William Ramsay i Morris Travers w 1898 roku z ciekłego powietrza. Jego pierwsza energia jonizacji, 14,0 eV, jest wystarczająco niska, by mógł go używać silnik z efektem Halla."
      ]
    },
    "engine": {
      "label": "Silnik na krypton",
      "title": "Otwórz silnik",
      "signs": {
        "valve": "Zawór gazu",
        "magnets": "Magnesy",
        "cathode": "Katoda",
        "anode": "Anoda"
      },
      "slider": "Napięcie",
      "volts": "{v} woltów",
      "hints": {
        "valve": "Dotknij zaworu gazu",
        "magnet": "Dotknij magnesów",
        "volts": "Naciśnij E i zwiększ napięcie",
        "off": "Dotknij katody, żeby ją wyłączyć",
        "on": "Dotknij katody, żeby ją włączyć"
      },
      "buttons": {
        "valve": "Gaz włączony lub wyłączony",
        "magnet": "Magnesy włączone lub wyłączone",
        "cathode": "Katoda włączona lub wyłączona"
      },
      "readout": {
        "speed": "Prędkość jonów",
        "push": "Ciąg",
        "charge": "Ładunek satelity",
        "km": "{n} km/s",
        "mn": "{n} mN",
        "coin": "jak moneta: {g} g",
        "ok": "w normie",
        "high": "za dużo!",
        "none": "jeszcze bez jonów"
      },
      "says": {
        "valveOn": {
          "kid": "Zawór otwarty: atomy kryptonu wpływają od tyłu pierścienia. To tylko gaz, więc jeszcze nic nie pcha.",
          "sci": "Paliwo płynie do anody, pierścienia z małymi otworami, który rozprowadza gaz po kanale. Obojętne atomy dryfują powoli w górę kanału."
        },
        "valveOff": {
          "kid": "Zawór zamknięty: nie wpływają już nowe atomy.",
          "sci": "Zawór zamknięty: przepływ ustaje, a kanał się opróżnia."
        },
        "magnetOn": {
          "kid": "Magnesy tworzą pole w poprzek kanału. Elektrony są maleńkie i lekkie, więc pole je łapie, a one krążą i krążą wokół pierścienia.",
          "sci": "Promieniowe pole magnetyczne przecina kanał. Elektrony zostają w nim uwięzione i dryfują wokół pierścienia: to prąd Halla."
        },
        "magnetOff": {
          "kid": "Magnesy wyłączone: elektrony nie są już trzymane.",
          "sci": "Pole wyłączone: elektrony nie są już uwięzione i prąd Halla nie powstaje."
        },
        "flow": {
          "kid": "Patrz! Atomy trafiają w krążące elektrony, tracą jeden własny i stają się jonami. Elektryczne pchnięcie wyrzuca jony z tyłu. To jest pchnięcie satelity.",
          "sci": "Atomy przechodzące przez prąd Halla ulegają jonizacji (Kr -> Kr+ + e−), a osiowe pole elektryczne przyspiesza jony na zewnątrz. Reakcja na silnik to ciąg."
        },
        "needGas": {
          "kid": "Nie ma jeszcze atomów do popchnięcia. Otwórz zawór gazu.",
          "sci": "Brak paliwa w kanale: otwórz zawór."
        },
        "needMagnet": {
          "kid": "Atomy wpływają, ale nic jeszcze nie łapie elektronów. Włącz magnesy.",
          "sci": "Brak pola magnetycznego: elektrony nie są uwięzione, więc gaz nie ulega jonizacji."
        },
        "cathodeOff": {
          "kid": "Katoda wyłączona! Jony odlatują, ale nie podążają za nimi elektrony, więc satelita napełnia się ładunkiem elektrycznym. Przyciąga jony z powrotem i ciąg zanika.",
          "sci": "Katoda wyłączona: wiązka odlatuje dodatnia, a statek ładuje się ujemnie. Jego potencjał przyciąga jony z powrotem i ciąg załamuje się."
        },
        "cathodeOn": {
          "kid": "Katoda włączona: wysyła elektrony za jonami. Ładunek spływa i strumień znów płynie.",
          "sci": "Katoda włączona: emituje elektrony do wiązki i ją neutralizuje. Ładunek spływa, a ciąg wraca."
        }
      },
      "panel": {
        "kid": [
          "To silnik z efektem Halla, przecięty na pół. Gaz wchodzi od tyłu. Magnesy łapią krążące elektrony. Gdy atom kryptonu spotka elektron, staje się jonem, a elektryczne pchnięcie wyrzuca jony z tyłu z prędkością ponad 50 000 kilometrów na godzinę.",
          "Katoda wysyła elektrony za jonami. Bez niej satelita napełniłby się ładunkiem i przyciągał własne jony z powrotem. Nic się tu nie pali: to tylko prąd popychający atomy."
        ],
        "sci": [
          "Silnik z efektem Halla to pierścieniowy kanał z promieniowym polem magnetycznym i osiowym polem elektrycznym o napięciu kilkuset woltów między anodą (na zamkniętym końcu, która też doprowadza gaz) a katodą na zewnątrz. Elektrony z katody są zatrzymywane w kanale przez pole i dryfują wokół niego (prąd Halla); jonizują atomy paliwa, a ciężkie jony są wyrzucane przez pole elektryczne.",
          "Jon o pojedynczym ładunku przebiega napięcie V woltów i wylatuje z prędkością v = sqrt(2eV/m): dla kryptonu (83,8 u) przy 300 V to 26,3 km/s. Efektywna prędkość strumienia silnika jest mniejsza, około 15 do 20 km/s, bo część atomów ucieka niezjonizowana, a wiązka rozszerza się na boki. Katoda wysyła też elektrony do wiązki: bez tego statek by się naładował i przyciągał jony z powrotem. W tym modelu ciąg wynosi 70 mN przy 300 V dla kryptonu i maleje jak pierwiastek z napięcia przy tym samym przepływie gazu."
        ]
      }
    },
    "sat": {
      "label": "Satelita",
      "title": "Wspinaczka do pracy",
      "signs": {
        "thruster": "Silnik",
        "junk": "Kosmiczne śmieci",
        "end": "Koniec",
        "scale": "Jego ciąg",
        "globe": "Orbita (wysokości przesadzone)"
      },
      "slider": "Dni od startu",
      "days": "dzień {n}: {h} km wysokości",
      "scale": {
        "push": "{n} mN",
        "coin": "moneta: {g} g"
      },
      "hints": {
        "push": "Dotknij silnika",
        "junk": "Dotknij kosmicznych śmieci",
        "end": "Dotknij czerwonego przycisku",
        "more": "Przesuń dni w panelu"
      },
      "buttons": {
        "push": "Odpal silnik",
        "junk": "Ostrzeż o śmieciach",
        "end": "Koniec jego życia"
      },
      "says": {
        "push": {
          "kid": "Maleńkie pchnięcie: waży tyle co jedna moneta. Nie brzmi to jak dużo, ale tu nic nie hamuje satelity, więc pchnięcia się sumują.",
          "sci": "Około 70 mN, ciężar 7 g: moneta jednoeurowa. Gdy nic nie hamuje, 70 mN na około 260 kg dodaje 0,27 mm/s co sekundę, 23 m/s na dobę, gdyby silnik pracował cały dzień."
        },
        "junk": {
          "kid": "Nadlatują kosmiczne śmieci! Satelita odpala silnik i schodzi im z drogi. Uff.",
          "sci": "Szczątek na bliskim przelocie: satelita odpala silnik i przesuwa orbitę o kilka metrów, tak by się minęły."
        },
        "junkWait": {
          "kid": "Śmieci już lecą, poczekaj chwilę.",
          "sci": "Manewr unikowy trwa: poczekaj, aż się skończy."
        },
        "end": {
          "kid": "Koniec życia: satelita celowo się obniża, wpada w powietrze i spala się jak spadająca gwiazda. W kosmosie nic nie zostaje. Na jego miejsce przyjdzie nowy.",
          "sci": "Deorbitacja: satelita obniża orbitę silnikiem, aż rzadkie górne powietrze zahamuje go całkiem i spala się przy wejściu w atmosferę, zamiast zostać jako śmieć."
        },
        "endWait": {
          "kid": "Już spada, poczekaj chwilę.",
          "sci": "Wejście w atmosferę trwa: poczekaj, aż się skończy."
        },
        "days": {
          "kid": "Dzień po dniu maleńkie pchnięcia podnoszą orbitę, od miejsca, gdzie rakieta zostawiła satelitę, aż do jego wysokości roboczej.",
          "sci": "Podnoszenie orbity małym ciągiem: orbita rośnie niemal liniowo. Tu od 300 km do 550 km w 90 dni, to ilustracja: prawdziwe wznoszenie trwa tygodnie lub miesiące."
        }
      },
      "panel": {
        "kid": [
          "Internetowy satelita to płaskie pudło szerokie na około 3 metry z jednym skrzydłem słonecznym długim na około 8 metrów. Rakieta zostawia go nisko, około 300 kilometrów nad Ziemią. Silnik popycha go potem, trochę każdego dnia, aż do wysokości roboczej 550 kilometrów.",
          "Ten sam mały silnik usuwa go z drogi kosmicznym śmieciom, a pod koniec życia obniża, aż spali się w powietrzu. Przesuń dni, żeby zobaczyć, jak orbita rośnie: globus nie jest w skali, wysokości są powiększone."
        ],
        "sci": [
          "Satelity Starlink są wypuszczane nisko, około 300 km, żeby ten, który zawiedzie, szybko spadł z powrotem; orbita robocza jest na 550 km, gdzie prędkość wynosi 7,6 km/s, a jedno okrążenie trwa około 95 minut. Pierwsze satelity produkcyjne ważyły około 260 kg, z płaskim korpusem szerokim na około 3 m i jednym skrzydłem słonecznym długim na około 8 m (wymiary różnią się nieco między wersjami).",
          "Wzniesienie z 300 do 550 km wymaga prędkości mniejszej o 140 m/s, co silnik o małym ciągu osiąga, pchając wzdłuż orbity, więc orbita wznosi się spiralnie. Przy 70 mN na 260 kg to około 6 dni nieprzerwanej pracy; prawdziwe wznoszenie trwa tygodnie lub miesiące, bo silnik pracuje tylko część czasu, a opór powietrza na małej wysokości ciągnie w tył. Ciąg wyliczono z oświadczenia SpaceX, że argonowy silnik z 2023 roku daje 2,4 raza większy ciąg niż dawny kryptonowy (170 mN), czyli około 70 mN: wartość przybliżona."
        ]
      }
    },
    "fuel": {
      "label": "Paliwa",
      "title": "Wybierz paliwo",
      "signs": {
        "rack": "Dotknij butli"
      },
      "hints": {
        "pick": "Dotknij butli",
        "other": "Dotknij innej butli"
      },
      "buttons": {
        "Xe": "Ksenon",
        "Kr": "Krypton",
        "Ar": "Argon"
      },
      "board": {
        "head": {
          "kid": "Trzy gazy porównane",
          "sci": "Paliwa silników Halla porównane"
        },
        "rows": {
          "air": {
            "kid": "W powietrzu: 1 atom na",
            "sci": "Udział w powietrzu (ppm)"
          },
          "price": {
            "kid": "Cena kilograma ($)",
            "sci": "Cena za kg (US $, cennikowa)"
          },
          "mass": {
            "kid": "Jak ciężki jest atom",
            "sci": "Masa atomowa (u)"
          },
          "ion": {
            "kid": "Energia do oderwania elektronu (eV)",
            "sci": "Pierwsza energia jonizacji (eV)"
          },
          "speed": {
            "kid": "Prędkość jonów przy 300 woltach (km/s)",
            "sci": "Prędkość jonów przy 300 V (km/s)"
          },
          "push": {
            "kid": "Ciąg przy tej samej energii (krypton = 1)",
            "sci": "Ciąg na wat (krypton = 1)"
          }
        }
      },
      "says": {
        "Xe": {
          "kid": "Ksenon: ciężki atom, który daje najwięcej ciągu z tej samej energii. Ale w powietrzu prawie go nie ma i kosztuje fortunę.",
          "sci": "Ksenon: 131 u, jonizuje się przy 12,1 eV i daje największy ciąg na wat, ale to 0,087 ppm powietrza i kosztuje około 1800 $ za kilogram."
        },
        "Kr": {
          "kid": "Krypton: trochę mniej ciągu niż ksenon, ale jest go około trzynaście razy więcej, więc kosztuje dużo mniej. Tego używały pierwsze Starlinki.",
          "sci": "Krypton: 83,8 u, 14,0 eV. Około 20% mniej ciągu na wat niż ksenon, ale 13 razy go więcej (1,14 ppm) i kosztuje około 290 $ za kilogram. Latały na nim pierwsze Starlinki."
        },
        "Ar": {
          "kid": "Argon: prawie jeden atom na sto w powietrzu to argon i kosztuje grosze. Jego atomy są lekkie, więc z tej samej energii daje mniejszy ciąg: potrzeba więcej mocy. Używają go nowsze Starlinki.",
          "sci": "Argon: 39,9 u, 15,8 eV. 0,93% powietrza, mniej niż 1 $ za kilogram. Lekki jon wylatuje szybciej (38 km/s przy 300 V), więc ciąg na wat jest mniejszy; używa go Starlink V2 Mini z 2023 roku, z mocniejszym zasilaniem."
        }
      },
      "panel": {
        "kid": [
          "Którego gazu powinien używać silnik? Ciężkie atomy dają większy ciąg z tej samej energii i łatwiej od nich oderwać elektron. Ksenon jest w tym najlepszy, ale w powietrzu jest go bardzo mało, więc jest bardzo drogi.",
          "Krypton to dobry środek: trochę mniej ciągu, ale dużo taniej. Argon jest wszędzie i prawie za darmo, ale jego atomy są lekkie, więc satelita potrzebuje więcej energii na ten sam ciąg. Dotknij butli: silnik tutaj zmienia gaz."
        ],
        "sci": [
          "Przy tym samym napięciu przyspieszającym cięższy jon wylatuje wolniej, a przy tej samej mocy ciąg wynosi F = 2 eta P / v, więc jest większy: względem kryptonu ksenon daje 1,25, a argon 0,69 (wartości idealne; rzeczywiste sprawności różnią się nieco). Lżejsze atomy wymagają też więcej energii do jonizacji (12,1; 14,0; 15,8 eV dla Xe, Kr, Ar), co zabiera trochę więcej z energii każdego jonu.",
          "Ksenon to 0,087 ppm powietrza, krypton 1,14 ppm, argon 9340 ppm, a ceny idą za tym: około 1800 $, 290 $ i 0,93 $ za kilogram (ceny cennikowe, które się zmieniają). Pierwsze Starlinki SpaceX używały kryptonu; większy V2 Mini (2023) używa argonu, który firma opisała jako 2,4 raza większy ciąg i 1,5 raza większy impuls właściwy niż we wcześniejszym silniku. Dotknij butli: silnik zmienia gaz, a razem z nim strumień i ciąg."
        ]
      }
    }
  },
  "de": {
    "title": "Eine Plattform im Orbit",
    "greet": {
      "kid": "Wir sind im Bild: eine Andockplattform rund 550 Kilometer über der Erde. Der Boden unter uns ist die echte Erde, und alle anderthalb Stunden geht über dem Rand die Sonne auf. Die Geschichte des Bildes steht auf der Staffelei neben dir.",
      "sci": "Eine Andockplattform im niedrigen Erdorbit, 550 km hoch: die Höhe der ersten Starlink-Schale, mit einer Umlaufzeit von etwa 95 Minuten und 7,6 km/s, sodass die Sonne etwa alle 95 Minuten aufgeht (hier beschleunigt). Die Geschichte des Bildes steht auf der Staffelei."
    },
    "talk": {
      "kid": [
        "Hier draußen gibt es fast keine Luft, deshalb hört ein Schub nie auf zu wirken. Ein winziger Schub, tagelang durchgehalten, kann einen ganzen Satelliten bewegen.",
        "Siehst du die kleinen Lichter am Himmel? Manche sind Satelliten, und manche sind eine ganze Reihe von Schwestern, die hintereinander fliegen.",
        "Ich bin Krypton. Ich wurde 1898 entdeckt, versteckt in der Luft. Heute helfe ich, Satelliten anzuschieben."
      ],
      "sci": [
        "Im Vakuum wirkt ein kleiner Schub ohne Widerstand, deshalb ändert sich die Geschwindigkeit eines Satelliten Sekunde um Sekunde um Schub geteilt durch Masse: 70 mN auf 260 kg bringen etwa 2,7 mm/s alle 10 Sekunden.",
        "Die Lichter am Himmel sind Satelliten im Sonnenlicht. Eine Kette gleich weit entfernter Punkte ist eine Gruppe Starlinks, die sich noch nicht entlang ihrer Bahn verteilt hat.",
        "Krypton wurde 1898 von William Ramsay und Morris Travers aus flüssiger Luft isoliert. Seine erste Ionisierungsenergie von 14,0 eV ist niedrig genug, damit ein Hall-Triebwerk es nutzen kann."
      ]
    },
    "engine": {
      "label": "Das Kryptontriebwerk",
      "title": "Öffne das Triebwerk",
      "signs": {
        "valve": "Gasventil",
        "magnets": "Magnete",
        "cathode": "Kathode",
        "anode": "Anode"
      },
      "slider": "Spannung",
      "volts": "{v} Volt",
      "hints": {
        "valve": "Tippe auf das Gasventil",
        "magnet": "Tippe auf die Magnete",
        "volts": "Drücke E und erhöhe die Spannung",
        "off": "Tippe auf die Kathode, um sie auszuschalten",
        "on": "Tippe auf die Kathode, um sie einzuschalten"
      },
      "buttons": {
        "valve": "Gas an oder aus",
        "magnet": "Magnete an oder aus",
        "cathode": "Kathode an oder aus"
      },
      "readout": {
        "speed": "Ionengeschwindigkeit",
        "push": "Schub",
        "charge": "Ladung des Satelliten",
        "km": "{n} km/s",
        "mn": "{n} mN",
        "coin": "wie eine Münze: {g} g",
        "ok": "in Ordnung",
        "high": "zu viel!",
        "none": "noch keine Ionen"
      },
      "says": {
        "valveOn": {
          "kid": "Das Ventil ist offen: Kryptonatome strömen am hinteren Ende in den Ring. Sie sind nur Gas, deshalb schiebt noch nichts.",
          "sci": "Treibstoff strömt zur Anode, einem Ring mit kleinen Löchern, der das Gas im Kanal verteilt. Neutrale Atome treiben langsam den Kanal hinauf."
        },
        "valveOff": {
          "kid": "Ventil zu: es kommen keine Atome mehr nach.",
          "sci": "Ventil geschlossen: der Fluss stoppt und der Kanal leert sich."
        },
        "magnetOn": {
          "kid": "Die Magnete erzeugen ein Feld quer durch den Kanal. Elektronen sind winzig und leicht, deshalb fängt das Feld sie ein, und sie wirbeln rund und rund um den Ring.",
          "sci": "Ein radiales Magnetfeld durchquert den Kanal. Elektronen werden darin gefangen und driften um den Ring: der Hall-Strom."
        },
        "magnetOff": {
          "kid": "Magnete aus: die Elektronen werden nicht mehr festgehalten.",
          "sci": "Feld aus: die Elektronen sind nicht mehr gefangen, und es baut sich kein Hall-Strom auf."
        },
        "flow": {
          "kid": "Schau! Atome stoßen auf die wirbelnden Elektronen, verlieren eines ihrer eigenen und werden zu Ionen. Der elektrische Schub schleudert die Ionen hinten hinaus. Das ist der Schub für den Satelliten.",
          "sci": "Atome, die den Hall-Strom kreuzen, werden ionisiert (Kr -> Kr+ + e−), und das axiale elektrische Feld beschleunigt die Ionen hinaus. Die Rückwirkung auf das Triebwerk ist der Schub."
        },
        "needGas": {
          "kid": "Es gibt noch keine Atome zum Anschieben. Öffne das Gasventil.",
          "sci": "Kein Treibstoff im Kanal: öffne das Ventil."
        },
        "needMagnet": {
          "kid": "Atome kommen herein, aber nichts fängt die Elektronen ein. Schalte die Magnete ein.",
          "sci": "Kein Magnetfeld: die Elektronen sind nicht gefangen, das Gas wird also nicht ionisiert."
        },
        "cathodeOff": {
          "kid": "Kathode aus! Die Ionen fliegen davon, aber keine Elektronen folgen, und der Satellit lädt sich elektrisch auf. Er zieht die Ionen zurück, und der Schub erlischt.",
          "sci": "Kathode aus: der Strahl verlässt das Triebwerk positiv, und das Raumfahrzeug lädt sich negativ auf. Sein Potenzial zieht die Ionen zurück, und der Schub bricht zusammen."
        },
        "cathodeOn": {
          "kid": "Kathode an: sie schickt Elektronen hinter den Ionen her. Die Ladung fließt ab, und der Strahl läuft wieder.",
          "sci": "Kathode an: sie gibt Elektronen in den Strahl ab und neutralisiert ihn. Die Ladung fließt ab, und der Schub kehrt zurück."
        }
      },
      "panel": {
        "kid": [
          "Das ist ein Hall-Triebwerk, in der Mitte durchgeschnitten. Hinten strömt Gas hinein. Magnete fangen wirbelnde Elektronen. Trifft ein Kryptonatom auf ein Elektron, wird es zum Ion, und ein elektrischer Schub schleudert die Ionen hinten mit über 50 000 Kilometern pro Stunde hinaus.",
          "Die Kathode schickt Elektronen hinter den Ionen her. Ohne sie würde sich der Satellit aufladen und seine eigenen Ionen zurückziehen. Nichts wird verbrannt: Es ist nur Strom, der Atome anschiebt."
        ],
        "sci": [
          "Ein Hall-Effekt-Triebwerk ist ein ringförmiger Kanal mit einem radialen Magnetfeld und einem axialen elektrischen Feld von einigen hundert Volt zwischen der Anode (am geschlossenen Ende, die auch das Gas zuführt) und einer Kathode außerhalb. Elektronen aus der Kathode werden vom Feld im Kanal gehalten und driften um ihn herum (der Hall-Strom); sie ionisieren die Treibstoffatome, und die schweren Ionen werden vom elektrischen Feld hinausbeschleunigt.",
          "Ein einfach geladenes Ion durchfällt V Volt und verlässt das Triebwerk mit v = sqrt(2eV/m): für Krypton (83,8 u) bei 300 V sind das 26,3 km/s. Die effektive Austrittsgeschwindigkeit des Triebwerks ist geringer, etwa 15 bis 20 km/s, weil manche Atome nicht ionisiert entweichen und sich der Strahl seitlich aufweitet. Die Kathode gibt auch Elektronen in den Strahl ab: ohne sie würde sich das Raumfahrzeug aufladen und die Ionen zurückziehen. In diesem Modell beträgt der Schub 70 mN bei 300 V mit Krypton und sinkt bei gleichem Gasfluss mit der Wurzel der Spannung."
        ]
      }
    },
    "sat": {
      "label": "Der Satellit",
      "title": "Der Aufstieg zur Arbeit",
      "signs": {
        "thruster": "Triebwerk",
        "junk": "Weltraumschrott",
        "end": "Das Ende",
        "scale": "Sein Schub",
        "globe": "Bahn (Höhen übertrieben)"
      },
      "slider": "Tage seit dem Start",
      "days": "Tag {n}: {h} km hoch",
      "scale": {
        "push": "{n} mN",
        "coin": "eine Münze: {g} g"
      },
      "hints": {
        "push": "Tippe auf das Triebwerk",
        "junk": "Tippe auf den Weltraumschrott",
        "end": "Tippe auf den roten Knopf",
        "more": "Schiebe die Tage im Panel"
      },
      "buttons": {
        "push": "Triebwerk zünden",
        "junk": "Vor dem Schrott warnen",
        "end": "Das Ende seines Lebens"
      },
      "says": {
        "push": {
          "kid": "Ein winziger Schub: etwa so schwer wie eine Münze. Das klingt nach wenig, aber hier bremst nichts den Satelliten, deshalb summieren sich die Stöße.",
          "sci": "Etwa 70 mN, das Gewicht von 7 g: eine Ein-Euro-Münze. Wenn nichts bremst, bringen 70 mN auf etwa 260 kg jede Sekunde 0,27 mm/s, 23 m/s pro Tag, wenn es den ganzen Tag zündete."
        },
        "junk": {
          "kid": "Weltraumschrott kommt! Der Satellit zündet sein Triebwerk und weicht aus. Puh.",
          "sci": "Ein Trümmerteil auf naher Vorbeiflugbahn: der Satellit zündet und verschiebt seine Bahn um einige Meter, damit die beiden aneinander vorbeifliegen."
        },
        "junkWait": {
          "kid": "Der Schrott ist schon unterwegs, warte einen Moment.",
          "sci": "Das Ausweichmanöver läuft: warte, bis es vorbei ist."
        },
        "end": {
          "kid": "Das Ende seines Lebens: der Satellit senkt sich absichtlich ab, fällt in die Luft und verglüht wie eine Sternschnuppe. Im All bleibt nichts zurück. Ein neuer nimmt seinen Platz ein.",
          "sci": "Deorbit: der Satellit senkt seine Bahn mit dem Triebwerk, bis die dünne obere Luft ihn abbremst, und verglüht beim Wiedereintritt, statt als Schrott zu bleiben."
        },
        "endWait": {
          "kid": "Er fällt schon, warte einen Moment.",
          "sci": "Wiedereintritt läuft: warte, bis er vorbei ist."
        },
        "days": {
          "kid": "Tag für Tag heben die kleinen Schübe die Bahn an, von dort, wo die Rakete den Satelliten verlassen hat, bis zu seiner Arbeitshöhe.",
          "sci": "Bahnanhebung mit geringem Schub: die Bahn steigt fast linear. Hier von 300 km auf 550 km in 90 Tagen, eine Veranschaulichung: echte Aufstiege dauern Wochen bis Monate."
        }
      },
      "panel": {
        "kid": [
          "Ein Internetsatellit ist eine flache Box, etwa 3 Meter breit, mit einem Solarflügel von etwa 8 Metern Länge. Die Rakete lässt ihn tief zurück, etwa 300 Kilometer hoch. Sein Triebwerk schiebt ihn dann, jeden Tag ein bisschen, auf seine Arbeitshöhe von 550 Kilometern.",
          "Dasselbe kleine Triebwerk bringt ihn aus dem Weg von Weltraumschrott und senkt ihn am Ende seines Lebens, bis er in der Luft verglüht. Schiebe die Tage, um die Bahn steigen zu sehen: der Globus ist nicht maßstäblich, die Höhen sind vergrößert."
        ],
        "sci": [
          "Starlink-Satelliten werden tief ausgesetzt, bei etwa 300 km, damit einer, der ausfällt, bald zurückfällt; die Arbeitsbahn liegt bei 550 km, wo die Geschwindigkeit 7,6 km/s beträgt und ein Umlauf etwa 95 Minuten dauert. Die ersten Serien-Satelliten wogen etwa 260 kg, mit einem flachen Körper von etwa 3 m Breite und einem Solarflügel von etwa 8 m Länge (die Maße schwanken je nach Version etwas).",
          "Der Aufstieg von 300 auf 550 km verlangt 140 m/s weniger Geschwindigkeit, was ein Triebwerk mit geringem Schub erreicht, indem es entlang der Bahn schiebt, sodass die Bahn spiralförmig steigt. Bei 70 mN auf 260 kg sind das etwa 6 Tage Dauerfeuer; ein echter Aufstieg dauert Wochen bis Monate, weil das Triebwerk nur einen Teil der Zeit zündet und der Luftwiderstand in geringer Höhe zurückzieht. Der Schub ist aus der Aussage von SpaceX berechnet, dass das Argon-Triebwerk von 2023 den 2,4-fachen Schub des älteren Krypton-Triebwerks liefert (170 mN), also etwa 70 mN: ungefähr."
        ]
      }
    },
    "fuel": {
      "label": "Die Treibstoffe",
      "title": "Wähle einen Treibstoff",
      "signs": {
        "rack": "Tippe auf eine Flasche"
      },
      "hints": {
        "pick": "Tippe auf eine Flasche",
        "other": "Tippe auf eine andere Flasche"
      },
      "buttons": {
        "Xe": "Xenon",
        "Kr": "Krypton",
        "Ar": "Argon"
      },
      "board": {
        "head": {
          "kid": "Die drei Gase im Vergleich",
          "sci": "Treibstoffe für Hall-Triebwerke im Vergleich"
        },
        "rows": {
          "air": {
            "kid": "In der Luft: 1 Atom unter",
            "sci": "Anteil an der Luft (ppm)"
          },
          "price": {
            "kid": "Preis für ein Kilogramm ($)",
            "sci": "Preis pro kg (US $, Liste)"
          },
          "mass": {
            "kid": "Wie schwer ein Atom ist",
            "sci": "Atommasse (u)"
          },
          "ion": {
            "kid": "Energie, um ein Elektron abzulösen (eV)",
            "sci": "Erste Ionisierungsenergie (eV)"
          },
          "speed": {
            "kid": "Geschwindigkeit der Ionen bei 300 Volt (km/s)",
            "sci": "Ionengeschwindigkeit bei 300 V (km/s)"
          },
          "push": {
            "kid": "Schub bei gleichem Strom (Krypton = 1)",
            "sci": "Schub pro Watt (Krypton = 1)"
          }
        }
      },
      "says": {
        "Xe": {
          "kid": "Xenon: das schwere Atom, das für den Strom den meisten Schub gibt. Aber in der Luft gibt es kaum welches, und es kostet ein Vermögen.",
          "sci": "Xenon: 131 u, ionisiert bei 12,1 eV und gibt den meisten Schub pro Watt, macht aber nur 0,087 ppm der Luft aus und kostet etwa 1800 $ pro Kilogramm."
        },
        "Kr": {
          "kid": "Krypton: etwas weniger Schub als Xenon, aber es gibt etwa dreizehnmal mehr davon, deshalb kostet es viel weniger. Das nutzten die ersten Starlinks.",
          "sci": "Krypton: 83,8 u, 14,0 eV. Etwa 20 % weniger Schub pro Watt als Xenon, aber 13-mal häufiger (1,14 ppm) und etwa 290 $ pro Kilogramm. Die ersten Starlinks flogen damit."
        },
        "Ar": {
          "kid": "Argon: fast jedes hundertste Atom der Luft ist Argon, und es kostet fast nichts. Seine Atome sind leicht, deshalb schiebt es für den Strom weniger: man braucht mehr Leistung. Die neueren Starlinks nutzen es.",
          "sci": "Argon: 39,9 u, 15,8 eV. 0,93 % der Luft, unter 1 $ pro Kilogramm. Ein leichtes Ion fliegt schneller hinaus (38 km/s bei 300 V), der Schub pro Watt ist also geringer; der Starlink V2 Mini von 2023 nutzt es mit einer stärkeren Stromversorgung."
        }
      },
      "panel": {
        "kid": [
          "Welches Gas soll das Triebwerk nutzen? Schwere Atome geben für denselben Strom mehr Schub, und man kann ihnen leichter ein Elektron abschlagen. Xenon ist darin am besten, aber es gibt sehr wenig davon in der Luft, deshalb ist es sehr teuer.",
          "Krypton ist ein guter Mittelweg: etwas weniger Schub, aber viel billiger. Argon ist überall und fast gratis, aber seine Atome sind leicht, deshalb braucht ein Satellit mehr Strom für denselben Schub. Tippe auf eine Flasche: das Triebwerk hier wechselt sein Gas."
        ],
        "sci": [
          "Bei gleicher Beschleunigungsspannung verlässt ein schwereres Ion das Triebwerk langsamer, und bei gleicher Leistung ist der Schub F = 2 eta P / v, also größer: im Verhältnis zu Krypton gibt Xenon 1,25 und Argon 0,69 (ideal; echte Wirkungsgrade weichen etwas ab). Leichtere Atome brauchen außerdem mehr Energie zur Ionisierung (12,1; 14,0; 15,8 eV für Xe, Kr, Ar), was etwas mehr von der Energie jedes Ions kostet.",
          "Xenon macht 0,087 ppm der Luft aus, Krypton 1,14 ppm, Argon 9340 ppm, und die Preise folgen: etwa 1800 $, 290 $ und 0,93 $ pro Kilogramm (Listenpreise, die sich ändern). Die ersten Starlinks von SpaceX nutzten Krypton; der größere V2 Mini (2023) nutzt Argon, was das Unternehmen als 2,4-fachen Schub und 1,5-fachen spezifischen Impuls des früheren Triebwerks beschrieb. Tippe auf eine Flasche: das Triebwerk wechselt sein Gas, und mit ihm Strahl und Schub."
        ]
      }
    }
  }
}
