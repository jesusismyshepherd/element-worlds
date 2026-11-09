// The words of radon's cave room ("Do caves breathe in and out?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Rn.js (the
// easel shows it). Facts and sources:
// - Postojna: A. Gregorič, A. Zidanšek, J. Vaupotič, Nat. Hazards Earth Syst. Sci. 11, 1523 (2011): radon in the
//   Great Mountain hall, about 2 km from the tourist entrance, July 2005 to October 2009, from about 200 Bq/m3
//   in winter to about 3 kBq/m3 in summer (lowest monthly mean March, 600; highest June, 2500); cave air 9 to
//   10 C all year; the chimney effect: in the cold, warm cave air leaves upward through cracks and the
//   entrance draws fresh air; in summer ventilation minimal or reversed, from higher openings to lower; the
//   radon followed the outside temperature 4 days (114 h) later; below a daily -6 C it rose again, presumably
//   because ice and snow covered the small breathing holes; no forced ventilation.
// - Chifley Cave, Jenolan, Australia: C. L. Waring et al., J. Cave Karst Stud. 83, 1-19 (2021): the soil above
//   as the source of the cave's radon (radon, d13C of CO2 and N2O as tracers); the summer draught, top to
//   bottom, draws air slowly in through cracks and fissures; proposed: airtight doors shut when the outside is
//   warmer than the cave, open when colder; where the radon comes from inside, shutting traps it.
// - ICRP Publication 137 (2017): 6 mSv per mJ h m-3 for tourist caves and physically active indoor work,
//   1.3e-5 mSv per Bq h m-3 with an equilibrium factor of 0.4 (ICRP's letter to the European Commission).
// - Directive 2013/59/Euratom: occupational dose limit 20 mSv a year (Art. 9); workplace radon reference level
//   for the annual average not above 300 Bq/m3 (Art. 54).
// - Rn-222 half-life 3.82 days.
// The monitor, the doors' effects and the guide's numbers come from the room's own model (cave.js), tuned to
// Postojna's figures; the words say so. {v}, {d} and {h} are numbers filled in by the room.
export const CAVE_WORDS = {
  en: {
    title: 'The breathing cave',
    greet: {
      kid: 'Welcome to a cave on a winter night! Caves breathe, and the little teal dots floating about are me, radon, breathed out by the rock. Try the three stations. The picture\'s story is on the easel.',
      sci: 'A limestone show cave on a winter night. The teal motes are radon atoms; how many float here follows the monitor\'s reading. Three stations: the cave\'s breath, its doors and a guide\'s year. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'The rock all around holds a tiny bit of uranium. As it slowly changes, it makes me, radon, a gas that seeps into the cave\'s air.',
        'A cave stays about the same temperature all year, cool like a cellar. It is the air outside that changes, and that makes the cave breathe.',
        'Show caves measure me all the time. That is how they keep their guides and visitors safe.',
      ],
      sci: [
        'Radon-222 comes from radium-226 in the rock and in the soil above. With a half-life of 3.82 days it has time to collect in still cave air.',
        'Postojna\'s air stays at 9 to 10 °C all year. The draught depends on the difference from the outside air, not on the calendar.',
        'Show caves are workplaces: their radon is monitored and the guides\' hours are planned so that their dose stays within the limit.',
      ],
    },
    breath: {
      label: 'The cave\'s breath',
      verbSign: 'Tap the season sign',
      verbPuff: 'Tap the smoke puffer',
      verbSlide: 'Drag the outside temperature',
      title: 'How a cave breathes',
      slider: 'Temperature outside',
      tip: 'Tap the season sign or the smoke puffer, or drag the temperature.',
      buttons: { winter: 'Winter, −5 °C', summer: 'Summer, 25 °C', puff: 'Puff some smoke' },
      sign: { winter: 'WINTER', summer: 'SUMMER' },
      board: {
        title: 'Cave air: radon',
        outside: 'outside',
        cave: 'cave',
        what: { kid: 'radon atoms breaking apart each second in a cubic metre of air', sci: 'radon-222 activity concentration' },
        winter: 'winter, about 200',
        summer: 'summer, about 3000',
        eu: 'EU workplaces 300',
        trace: 'the last 40 seconds (sped up: days in a real cave)',
      },
      says: {
        winter: {
          kid: 'Winter! The cave is warmer than the frosty air, so its air rises out of the top and cold air flows in at the bottom. The radon is swept away.',
          sci: 'Colder outside than the cave\'s 10 °C: the warm, light cave air rises out of the upper opening and draws cold air in at the bottom. The draught flushes the radon out.',
        },
        summer: {
          kid: 'Summer! Now the cave is the cool place. Its cold, heavy air slides out at the bottom, and a little air from the soil seeps in through cracks. Radon builds up.',
          sci: 'Warmer outside: the cold, dense cave air drains out of the lower entrance. The draught is weak, and it draws soil air, rich in radon, in through the ceiling\'s cracks.',
        },
        still: {
          kid: 'About as warm outside as inside: the air stands still and the cave hardly breathes at all.',
          sci: 'Near the cave\'s own temperature the chimney effect stops: no draught, and radon collects.',
        },
        snow: {
          kid: 'So cold that snow and ice are covering the openings up on the slope! The cave can hardly breathe out, and the radon climbs again.',
          sci: 'Below about −6 °C Postojna\'s radon rose again; the researchers suppose that ice and snow covered the small breathing holes above the cave.',
        },
        puffWinter: {
          kid: 'Look, the smoke drifts toward the stairs and up: the cave is breathing out at the top.',
          sci: 'The smoke drifts toward the passage: the draught runs up and out of the top opening.',
        },
        puffSummer: {
          kid: 'The smoke drifts toward the bottom door: the cave\'s cold air is sliding out that way.',
          sci: 'The smoke drifts toward the lower entrance: the draught has turned and runs down and out.',
        },
        puffStill: {
          kid: 'The smoke just hangs there. No draught today.',
          sci: 'The smoke hangs: with almost no temperature difference there is almost no draught.',
        },
      },
      panel: {
        kid: [
          'A cave keeps about the same temperature all year, around 10 °C. Outside, the air is much colder in winter and warmer in summer. Warm air is light and rises; cold air is heavy and sinks. A cave with one opening at the bottom and another high up works like a chimney.',
          'In winter the cave\'s air rises out of the top and fresh air comes in at the bottom, sweeping the radon out. In summer it turns round: the cave\'s cold air slides slowly out of the bottom and air seeps in through the soil and cracks above, bringing radon. In Postojna Cave in Slovenia there was about 15 times more radon in summer than in winter.',
        ],
        sci: [
          'The chimney effect: the cave\'s air, at a nearly steady 9 to 10 °C in Postojna, is lighter than colder outside air and heavier than warmer air. With openings at two heights the difference drives a draught that grows with the temperature difference. In winter it rises out of the upper openings and cracks and draws outside air in at the lower entrance; in summer it is weak or reversed, from the higher openings to the lower.',
          'Monitoring in Postojna\'s Great Mountain hall from July 2005 to October 2009 (Gregorič, Zidanšek and Vaupotič, 2011) found about 200 Bq/m³ in winter and about 3000 Bq/m³ in summer. The radon there, about 2 km from the entrance, followed the outside temperature four days later. Some caves show the reverse pattern or none. The monitor in this room follows a simple model of this made-up cave, sped up.',
        ],
      },
    },
    doors: {
      label: 'The doors',
      verbBottom: 'Tap the bottom door',
      verbTop: 'Tap the top door',
      verbAuto: 'Tap the auto button',
      title: 'Steering the breath',
      tip: 'Tap a door or its button, or the auto button. Try it in both seasons.',
      buttons: {
        bottom: 'bottom door',
        top: 'top door',
        auto: 'auto',
        panelBottom: 'Open or shut the bottom door',
        panelTop: 'Open or shut the top door',
        panelAuto: 'Auto on or off',
      },
      board: {
        outside: 'outside',
        cave: 'cave',
        open: 'open',
        shut: 'shut',
        auto: 'auto',
        on: 'on',
        off: 'off',
        rule: 'open when colder outside, shut when warmer',
      },
      says: {
        botOpen: { kid: 'Bottom door open: the cave can breathe through it again.', sci: 'Lower door open: the draught can pass again.' },
        botShutWinter: {
          kid: 'Bottom door shut in winter: no fresh air can come in, so the cave stops breathing out. Watch the radon climb.',
          sci: 'Lower door shut in winter: the chimney draught has no inlet, the flushing stops and radon builds up.',
        },
        botShutSummer: {
          kid: 'Bottom door shut in summer: the cold air stays in, nothing is sucked in through the soil, and the radon goes down. Clever!',
          sci: 'Lower door shut in summer: the cold air can no longer drain out, so no soil air is drawn in through the cracks, and radon falls toward what the rock alone gives.',
        },
        topOpen: { kid: 'Top door open again.', sci: 'Upper door open: the main way out at the top is clear.' },
        topShutWinter: {
          kid: 'Top door shut in winter: the warm air can only squeeze out through small cracks, so the cave breathes less and the radon climbs.',
          sci: 'Upper door shut in winter: the warm air leaves only through the cracks, the draught weakens and radon rises, much as snow over Postojna\'s breathing holes did.',
        },
        topShutSummer: {
          kid: 'Oh! Shutting the top in summer made it worse. Now all the air the cave pulls in has to come through the soil, and it brings radon. Try the bottom door instead.',
          sci: 'Upper door shut in summer: the draining cave air is now replaced only through the soil cracks, so more radon-rich soil air comes in. The lower door is the one to shut.',
        },
        autoOn: {
          kid: 'Auto! The doors open when it is colder outside than in the cave, and shut when it is warmer. Change the temperature and watch.',
          sci: 'Automatic: open when the outside is colder than the cave, shut when it is warmer, the rule proposed for Chifley Cave at Jenolan, Australia.',
        },
        autoOff: { kid: 'Auto off: the doors stay as they are now.', sci: 'Automatic control off: the doors keep their present state.' },
        autoOpens: {
          kid: 'Colder outside now: the doors open by themselves to let the cave breathe out.',
          sci: 'Outside below the cave\'s temperature: the doors open and the winter draught flushes the cave.',
        },
        autoShuts: {
          kid: 'Warmer outside now: the doors shut by themselves to keep the soil air out.',
          sci: 'Outside above the cave\'s temperature: the doors shut, so no soil air is drawn in.',
        },
      },
      panel: {
        kid: [
          'Show caves often have doors at their entrances. A cave breathes in at one opening and out at another, so a door can change how it breathes.',
          'In winter, open doors let the draught sweep the radon away. In summer, the cave\'s cold air sliding out at the bottom pulls air in through cracks in the soil above, and that air carries radon; shutting the bottom door stops it. So: open when it is colder outside, shut when it is warmer. Cave scientists in Australia suggested just that.',
        ],
        sci: [
          'Waring and colleagues (Journal of Cave and Karst Studies, 2021) traced the radon of Chifley Cave, at Jenolan in Australia, to the soil above it, using radon, the carbon isotopes of carbon dioxide and nitrous oxide as tracers. The summer draught, top to bottom, draws soil air slowly in through cracks and fissures; the winter draught flushes the cave with outside air.',
          'They proposed airtight doors kept shut when the outside is warmer than the cave and opened when it is colder: a passive way to lower radon without forcing air through the cave and drying its formations. Where the radon comes from inside the cave, shutting doors traps it instead, so what works depends on the cave. The effects here are this room\'s model.',
        ],
      },
    },
    guide: {
      label: 'The guide\'s year',
      verbGuide: 'Tap the guide',
      verbTicket: 'Tap the visitor\'s ticket',
      verbMonths: 'Tap the months',
      title: 'A guide\'s year underground',
      slider: 'Her hours in the cave each week',
      tip: 'Tap the guide, the ticket or the months, or drag her hours.',
      buttons: { badge: 'Show her badge', ticket: 'A visitor\'s tour', plan: 'More hours in winter' },
      badgeCap: { kid: 'my radon badge', sci: 'a personal radon detector' },
      ticket: { title: 'CAVE TOUR', line: 'one visitor' },
      monthLetters: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      board: {
        title: 'The guide\'s year',
        hours: '{h} h a week',
        planOn: 'more cave hours in winter',
        planOff: 'the same hours all year',
        months: { kid: 'radon in the cave, month by month', sci: 'monthly mean radon, with the doors as they are now' },
        radonKey: 'radon',
        hoursKey: 'her hours',
        tapMonths: 'tap the months to plan',
        limit: { kid: 'the limit', sci: 'EU limit 20 mSv' },
        year: 'her year',
        visit: 'a visit',
        icrp: 'ICRP 137: 13 µSv for an hour in 1000 Bq/m³',
      },
      says: {
        badge: {
          kid: 'This is my radon badge. It shows how much radon I breathe at work, so we can plan my hours.',
          sci: 'A personal radon detector, worn at work. With the monitors\' readings it gives the dose that the cave\'s plan keeps within the limit.',
        },
        ticket: {
          kid: 'A visitor\'s tour, an hour and a half in summer: only {v} mSv. A tiny sliver next to a guide\'s year.',
          sci: 'One 1.5-hour visit in July at this cave\'s radon: about {v} mSv, a sliver beside the worker limit.',
        },
        planOn: {
          kid: 'More of her cave hours in winter, when the radon is low, and other work outside in summer: her year drops to {d} mSv.',
          sci: 'Hours moved from May to September into the low-radon months, the same total: {d} mSv a year.',
        },
        planOff: { kid: 'The same hours every month again: {d} mSv for her year.', sci: 'Even hours all year: {d} mSv.' },
        over: {
          kid: 'That is too many hours! The cave\'s planner would never let a guide go over the limit. Fewer hours, more of them in winter, or the doors on auto.',
          sci: 'Above 20 mSv a year: the plan would not allow it. Fewer hours, a winter-weighted plan or lower radon would.',
        },
      },
      panel: {
        kid: [
          'Guides spend many hours in the cave, so they breathe more radon than visitors. That is why show caves measure the air and plan how long each guide works underground, keeping well under the limit.',
          'Drag her hours each week. Her year is worked out from the cave\'s radon each month, and summer months count more. Tap the months to move her cave hours into winter, and try the doors on auto. A visitor\'s tour adds only a sliver.',
        ],
        sci: [
          'Dose = radon × hours × dose coefficient. ICRP Publication 137 (2017) recommends 6 mSv per mJ·h/m³ for tourist caves, about 1.3 × 10⁻⁵ mSv per Bq·h/m³ with the usual equilibrium factor of 0.4. The EU\'s limit for workers is 20 mSv a year, and its reference level for radon in workplaces is normally at most 300 Bq/m³ as an annual average (Directive 2013/59/Euratom).',
          'The board uses this model cave\'s monthly radon, with the doors as they are now, and 46 working weeks. Caves are usually far above 300 Bq/m³, so guides\' doses are assessed and planned: fewer hours, more of them in the low-radon season. A cave\'s own equilibrium factor and aerosol can change the coefficient.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A gruta que respira',
    greet: {
      kid: 'Bem-vindo a uma gruta numa noite de inverno! As grutas respiram, e os pontinhos azul-turquesa que flutuam por aí sou eu, o rádon, soltado pela rocha. Experimenta os três postos. A história da imagem está no cavalete.',
      sci: 'Uma gruta turística de calcário numa noite de inverno. Os pontinhos azul-turquesa são átomos de rádon; quantos flutuam aqui segue a leitura do monitor. Três postos: a respiração da gruta, as portas e o ano de uma guia. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'A rocha à nossa volta tem um bocadinho de urânio. Enquanto se transforma devagar, faz-me a mim, o rádon, um gás que se infiltra no ar da gruta.',
        'Uma gruta fica mais ou menos à mesma temperatura o ano inteiro, fresca como uma cave. O que muda é o ar lá de fora, e é isso que faz a gruta respirar.',
        'As grutas turísticas medem-me o tempo todo. É assim que mantêm os guias e os visitantes em segurança.',
      ],
      sci: [
        'O rádon-222 vem do rádio-226 da rocha e do solo por cima. Com uma meia-vida de 3,82 dias, tem tempo para se acumular no ar parado da gruta.',
        'O ar de Postojna fica entre 9 e 10 °C o ano inteiro. A corrente de ar depende da diferença para o ar exterior, não do calendário.',
        'As grutas turísticas são locais de trabalho: o rádon é vigiado e as horas dos guias são planeadas para que a dose fique dentro do limite.',
      ],
    },
    breath: {
      label: 'A respiração da gruta',
      verbSign: 'Toca na placa da estação',
      verbPuff: 'Toca na pera de fumo',
      verbSlide: 'Arrasta a temperatura lá fora',
      title: 'Como respira uma gruta',
      slider: 'Temperatura lá fora',
      tip: 'Toca na placa da estação ou na pera de fumo, ou arrasta a temperatura.',
      buttons: { winter: 'Inverno, −5 °C', summer: 'Verão, 25 °C', puff: 'Soltar um pouco de fumo' },
      sign: { winter: 'INVERNO', summer: 'VERÃO' },
      board: {
        title: 'Ar da gruta: rádon',
        outside: 'lá fora',
        cave: 'gruta',
        what: { kid: 'átomos de rádon que se desfazem por segundo num metro cúbico de ar', sci: 'concentração de atividade do rádon-222' },
        winter: 'inverno, cerca de 200',
        summer: 'verão, cerca de 3000',
        eu: 'trabalho na UE 300',
        trace: 'os últimos 40 segundos (acelerado: numa gruta a sério são dias)',
      },
      says: {
        winter: {
          kid: 'Inverno! A gruta está mais quente do que o ar gelado, por isso o ar dela sobe e sai por cima, e entra ar frio por baixo. O rádon vai embora.',
          sci: 'Mais frio lá fora do que os 10 °C da gruta: o ar da gruta, quente e leve, sobe e sai pela abertura de cima e puxa ar frio pela de baixo. A corrente de ar leva o rádon.',
        },
        summer: {
          kid: 'Verão! Agora a gruta é o sítio fresco. O ar frio e pesado dela escorre por baixo, e entra um pouco de ar do solo pelas fendas. O rádon acumula-se.',
          sci: 'Mais quente lá fora: o ar frio e denso da gruta escorre pela entrada de baixo. A corrente é fraca e puxa ar do solo, rico em rádon, pelas fendas do teto.',
        },
        still: {
          kid: 'Quase tão quente lá fora como cá dentro: o ar fica parado e a gruta quase não respira.',
          sci: 'Perto da temperatura da própria gruta, o efeito chaminé para: sem corrente de ar, o rádon acumula-se.',
        },
        snow: {
          kid: 'Tanto frio que a neve e o gelo estão a tapar as aberturas lá em cima na encosta! A gruta mal consegue expirar, e o rádon volta a subir.',
          sci: 'Abaixo de cerca de −6 °C, o rádon de Postojna voltou a subir; os investigadores supõem que o gelo e a neve taparam os pequenos respiradouros por cima da gruta.',
        },
        puffWinter: {
          kid: 'Olha, o fumo vai para as escadas e para cima: a gruta está a expirar lá em cima.',
          sci: 'O fumo desvia-se para a passagem: a corrente sobe e sai pela abertura de cima.',
        },
        puffSummer: {
          kid: 'O fumo vai para a porta de baixo: o ar frio da gruta está a escorrer por ali.',
          sci: 'O fumo desvia-se para a entrada de baixo: a corrente inverteu-se e desce para sair.',
        },
        puffStill: {
          kid: 'O fumo fica ali parado. Hoje não há corrente de ar.',
          sci: 'O fumo fica parado: quase sem diferença de temperatura, quase não há corrente.',
        },
      },
      panel: {
        kid: [
          'Uma gruta fica mais ou menos à mesma temperatura o ano inteiro, perto de 10 °C. Lá fora, o ar é muito mais frio no inverno e mais quente no verão. O ar quente é leve e sobe; o ar frio é pesado e desce. Uma gruta com uma abertura em baixo e outra lá em cima funciona como uma chaminé.',
          'No inverno, o ar da gruta sai por cima e entra ar fresco por baixo, que varre o rádon. No verão é ao contrário: o ar frio da gruta escorre devagar por baixo e entra ar pelo solo e pelas fendas lá de cima, que traz rádon. Na gruta de Postojna, na Eslovénia, havia cerca de 15 vezes mais rádon no verão do que no inverno.',
        ],
        sci: [
          'O efeito chaminé: o ar da gruta, quase sempre entre 9 e 10 °C em Postojna, é mais leve do que o ar exterior mais frio e mais pesado do que o mais quente. Com aberturas a duas alturas, a diferença cria uma corrente de ar que cresce com a diferença de temperatura. No inverno sobe e sai pelas aberturas e fendas de cima e puxa ar exterior pela entrada de baixo; no verão é fraca ou inverte-se, das aberturas mais altas para as mais baixas.',
          'A monitorização na sala da Grande Montanha de Postojna, de julho de 2005 a outubro de 2009 (Gregorič, Zidanšek e Vaupotič, 2011), mediu cerca de 200 Bq/m³ no inverno e cerca de 3000 Bq/m³ no verão. Ali, a cerca de 2 km da entrada, o rádon seguia a temperatura exterior quatro dias depois. Algumas grutas mostram o padrão inverso ou nenhum. O monitor desta sala segue um modelo simples desta gruta inventada, acelerado.',
        ],
      },
    },
    doors: {
      label: 'As portas',
      verbBottom: 'Toca na porta de baixo',
      verbTop: 'Toca na porta de cima',
      verbAuto: 'Toca no botão automático',
      title: 'Comandar a respiração',
      tip: 'Toca numa porta ou no botão dela, ou no botão automático. Experimenta nas duas estações.',
      buttons: {
        bottom: 'porta de baixo',
        top: 'porta de cima',
        auto: 'automático',
        panelBottom: 'Abrir ou fechar a porta de baixo',
        panelTop: 'Abrir ou fechar a porta de cima',
        panelAuto: 'Automático ligado ou desligado',
      },
      board: {
        outside: 'lá fora',
        cave: 'gruta',
        open: 'aberta',
        shut: 'fechada',
        auto: 'automático',
        on: 'ligado',
        off: 'desligado',
        rule: 'aberta com mais frio lá fora, fechada com mais calor',
      },
      says: {
        botOpen: { kid: 'Porta de baixo aberta: a gruta pode voltar a respirar por ali.', sci: 'Porta de baixo aberta: a corrente de ar volta a passar.' },
        botShutWinter: {
          kid: 'Porta de baixo fechada no inverno: não entra ar fresco, por isso a gruta deixa de expirar. Vê o rádon a subir.',
          sci: 'Porta de baixo fechada no inverno: a corrente da chaminé fica sem entrada, a renovação do ar para e o rádon acumula-se.',
        },
        botShutSummer: {
          kid: 'Porta de baixo fechada no verão: o ar frio fica cá dentro, nada é aspirado pelo solo, e o rádon desce. Boa ideia!',
          sci: 'Porta de baixo fechada no verão: o ar frio já não consegue escorrer, por isso não se puxa ar do solo pelas fendas, e o rádon desce para o que a rocha sozinha dá.',
        },
        topOpen: { kid: 'Porta de cima aberta outra vez.', sci: 'Porta de cima aberta: a saída principal lá em cima está livre.' },
        topShutWinter: {
          kid: 'Porta de cima fechada no inverno: o ar quente só consegue escapar por fendas pequeninas, por isso a gruta respira menos e o rádon sobe.',
          sci: 'Porta de cima fechada no inverno: o ar quente sai só pelas fendas, a corrente enfraquece e o rádon sobe, tal como fazia a neve sobre os respiradouros de Postojna.',
        },
        topShutSummer: {
          kid: 'Ah! Fechar a de cima no verão piorou as coisas. Agora todo o ar que a gruta puxa tem de vir pelo solo, e traz rádon. Experimenta antes a porta de baixo.',
          sci: 'Porta de cima fechada no verão: o ar que escorre da gruta passa a ser substituído só pelas fendas do solo, por isso entra mais ar do solo, rico em rádon. A porta a fechar é a de baixo.',
        },
        autoOn: {
          kid: 'Automático! As portas abrem quando está mais frio lá fora do que na gruta, e fecham quando está mais quente. Muda a temperatura e vê.',
          sci: 'Automático: abertas quando o exterior está mais frio do que a gruta, fechadas quando está mais quente, a regra proposta para a gruta Chifley, em Jenolan, na Austrália.',
        },
        autoOff: { kid: 'Automático desligado: as portas ficam como estão.', sci: 'Controlo automático desligado: as portas mantêm o estado atual.' },
        autoOpens: {
          kid: 'Agora está mais frio lá fora: as portas abrem-se sozinhas para a gruta poder expirar.',
          sci: 'Exterior abaixo da temperatura da gruta: as portas abrem-se e a corrente de inverno renova o ar da gruta.',
        },
        autoShuts: {
          kid: 'Agora está mais quente lá fora: as portas fecham-se sozinhas para o ar do solo não entrar.',
          sci: 'Exterior acima da temperatura da gruta: as portas fecham-se, e não se puxa ar do solo.',
        },
      },
      panel: {
        kid: [
          'As grutas turísticas têm muitas vezes portas nas entradas. Uma gruta inspira por uma abertura e expira por outra, por isso uma porta pode mudar a maneira como ela respira.',
          'No inverno, as portas abertas deixam a corrente de ar varrer o rádon. No verão, o ar frio da gruta, a escorrer por baixo, puxa ar pelas fendas do solo lá de cima, e esse ar traz rádon; fechar a porta de baixo trava isso. Portanto: abertas quando está mais frio lá fora, fechadas quando está mais quente. Foi isto mesmo que sugeriram cientistas de grutas na Austrália.',
        ],
        sci: [
          'Waring e colegas (Journal of Cave and Karst Studies, 2021) mostraram que o rádon da gruta Chifley, em Jenolan, na Austrália, vem do solo por cima dela, usando como traçadores o rádon, os isótopos de carbono do dióxido de carbono e o óxido nitroso. A corrente de verão, de cima para baixo, puxa devagar ar do solo por fendas e fissuras; a de inverno renova a gruta com ar exterior.',
          'Propuseram portas estanques fechadas quando o exterior está mais quente do que a gruta e abertas quando está mais frio: uma maneira passiva de baixar o rádon sem forçar ar pela gruta nem secar as formações. Onde o rádon vem do interior da gruta, fechar as portas prende-o, por isso o que resulta depende da gruta. Os efeitos aqui são do modelo desta sala.',
        ],
      },
    },
    guide: {
      label: 'O ano da guia',
      verbGuide: 'Toca na guia',
      verbTicket: 'Toca no bilhete do visitante',
      verbMonths: 'Toca nos meses',
      title: 'O ano de uma guia debaixo da terra',
      slider: 'As horas dela na gruta por semana',
      tip: 'Toca na guia, no bilhete ou nos meses, ou arrasta as horas dela.',
      buttons: { badge: 'Mostrar o crachá dela', ticket: 'A visita de um turista', plan: 'Mais horas no inverno' },
      badgeCap: { kid: 'o meu crachá de rádon', sci: 'um detetor pessoal de rádon' },
      ticket: { title: 'VISITA À GRUTA', line: 'um visitante' },
      monthLetters: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      board: {
        title: 'O ano da guia',
        hours: '{h} h por semana',
        planOn: 'mais horas na gruta no inverno',
        planOff: 'as mesmas horas o ano todo',
        months: { kid: 'rádon na gruta, mês a mês', sci: 'rádon médio de cada mês, com as portas como estão' },
        radonKey: 'rádon',
        hoursKey: 'as horas dela',
        tapMonths: 'toca nos meses para planear',
        limit: { kid: 'o limite', sci: 'limite da UE 20 mSv' },
        year: 'o ano dela',
        visit: 'uma visita',
        icrp: 'ICRP 137: 13 µSv por uma hora a 1000 Bq/m³',
      },
      says: {
        badge: {
          kid: 'Este é o meu crachá de rádon. Mostra quanto rádon respiro no trabalho, para planearmos as minhas horas.',
          sci: 'Um detetor pessoal de rádon, usado no trabalho. Com as leituras dos monitores, dá a dose que o plano da gruta mantém dentro do limite.',
        },
        ticket: {
          kid: 'A visita de um turista, uma hora e meia no verão: só {v} mSv. Uma lasquinha ao lado do ano de uma guia.',
          sci: 'Uma visita de 1,5 h em julho com o rádon desta gruta: cerca de {v} mSv, uma lasca ao lado do limite dos trabalhadores.',
        },
        planOn: {
          kid: 'Mais horas dela na gruta no inverno, quando há pouco rádon, e outro trabalho cá fora no verão: o ano dela desce para {d} mSv.',
          sci: 'Horas passadas de maio a setembro para os meses com pouco rádon, com o mesmo total: {d} mSv por ano.',
        },
        planOff: { kid: 'As mesmas horas todos os meses outra vez: {d} mSv no ano dela.', sci: 'Horas iguais o ano todo: {d} mSv.' },
        over: {
          kid: 'Isso são horas a mais! Quem planeia a gruta nunca deixaria uma guia passar do limite. Menos horas, mais no inverno, ou as portas em automático.',
          sci: 'Acima de 20 mSv por ano: o plano não o permitiria. Menos horas, um plano com mais inverno ou menos rádon resolveriam.',
        },
      },
      panel: {
        kid: [
          'Os guias passam muitas horas na gruta, por isso respiram mais rádon do que os visitantes. É por isso que as grutas turísticas medem o ar e planeiam quanto tempo cada guia trabalha lá dentro, bem abaixo do limite.',
          'Arrasta as horas dela por semana. O ano dela é calculado a partir do rádon da gruta em cada mês, e os meses de verão contam mais. Toca nos meses para passar as horas dela na gruta para o inverno, e experimenta as portas em automático. A visita de um turista acrescenta só uma lasquinha.',
        ],
        sci: [
          'Dose = rádon × horas × coeficiente de dose. A Publicação 137 da ICRP (2017) recomenda 6 mSv por mJ·h/m³ para grutas turísticas, cerca de 1,3 × 10⁻⁵ mSv por Bq·h/m³ com o fator de equilíbrio habitual de 0,4. O limite da UE para trabalhadores é de 20 mSv por ano, e o nível de referência para o rádon nos locais de trabalho é, em regra, no máximo 300 Bq/m³ em média anual (Diretiva 2013/59/Euratom).',
          'O quadro usa o rádon mensal desta gruta-modelo, com as portas como estão, e 46 semanas de trabalho. As grutas costumam estar muito acima de 300 Bq/m³, por isso as doses dos guias são avaliadas e planeadas: menos horas, mais delas na estação com pouco rádon. O fator de equilíbrio e o aerossol de cada gruta podem mudar o coeficiente.',
        ],
      },
    },
  },
  pl: {
    title: 'Oddychająca jaskinia',
    greet: {
      kid: 'Witaj w jaskini w zimową noc! Jaskinie oddychają, a małe turkusowe kropki, które tu fruwają, to ja, radon, wydychany przez skałę. Wypróbuj trzy stanowiska. Historia obrazka jest na sztalugach.',
      sci: 'Wapienna jaskinia turystyczna w zimową noc. Turkusowe drobinki to atomy radonu; ile ich tu się unosi, zależy od odczytu monitora. Trzy stanowiska: oddech jaskini, jej drzwi i rok przewodniczki. Historia obrazka jest na sztalugach.',
    },
    talk: {
      kid: [
        'Skała dookoła zawiera odrobinę uranu. Gdy ten powoli się przemienia, powstaję ja, radon, gaz, który przesącza się do powietrza jaskini.',
        'W jaskini przez cały rok jest mniej więcej tak samo, chłodno jak w piwnicy. Zmienia się powietrze na zewnątrz i to sprawia, że jaskinia oddycha.',
        'Jaskinie turystyczne cały czas mnie mierzą. Tak dbają o bezpieczeństwo przewodników i zwiedzających.',
      ],
      sci: [
        'Radon-222 powstaje z radu-226 w skale i w glebie nad jaskinią. Przy okresie półtrwania 3,82 dnia zdąży się nagromadzić w nieruchomym powietrzu jaskini.',
        'Powietrze w Postojnej ma przez cały rok od 9 do 10 °C. Ciąg zależy od różnicy względem powietrza na zewnątrz, a nie od kalendarza.',
        'Jaskinie turystyczne są miejscami pracy: radon jest w nich monitorowany, a godziny przewodników planuje się tak, by dawka mieściła się w limicie.',
      ],
    },
    breath: {
      label: 'Oddech jaskini',
      verbSign: 'Dotknij znaku pory roku',
      verbPuff: 'Dotknij gruszki z dymem',
      verbSlide: 'Przeciągnij temperaturę na zewnątrz',
      title: 'Jak oddycha jaskinia',
      slider: 'Temperatura na zewnątrz',
      tip: 'Dotknij znaku pory roku albo gruszki z dymem, albo przeciągnij temperaturę.',
      buttons: { winter: 'Zima, −5 °C', summer: 'Lato, 25 °C', puff: 'Wypuść trochę dymu' },
      sign: { winter: 'ZIMA', summer: 'LATO' },
      board: {
        title: 'Powietrze jaskini: radon',
        outside: 'na zewnątrz',
        cave: 'jaskinia',
        what: { kid: 'tyle atomów radonu rozpada się co sekundę w metrze sześciennym powietrza', sci: 'stężenie promieniotwórcze radonu-222' },
        winter: 'zima, około 200',
        summer: 'lato, około 3000',
        eu: 'praca w UE 300',
        trace: 'ostatnie 40 sekund (przyspieszone: w prawdziwej jaskini to dni)',
      },
      says: {
        winter: {
          kid: 'Zima! W jaskini jest cieplej niż na mroźnym dworze, więc jej powietrze uchodzi górą, a dołem wpływa zimne. Radon zostaje wywiany.',
          sci: 'Na zewnątrz zimniej niż 10 °C w jaskini: ciepłe, lekkie powietrze jaskini uchodzi górnym otworem i zasysa zimne powietrze dołem. Ciąg wymiata radon.',
        },
        summer: {
          kid: 'Lato! Teraz to jaskinia jest chłodnym miejscem. Jej zimne, ciężkie powietrze wysuwa się dołem, a przez szczeliny sączy się trochę powietrza z gleby. Radon się gromadzi.',
          sci: 'Na zewnątrz cieplej: zimne, gęste powietrze jaskini spływa dolnym wejściem. Ciąg jest słaby i zasysa przez szczeliny w stropie powietrze glebowe, bogate w radon.',
        },
        still: {
          kid: 'Na zewnątrz prawie tak samo ciepło jak w środku: powietrze stoi i jaskinia prawie nie oddycha.',
          sci: 'Przy temperaturze zbliżonej do temperatury jaskini efekt kominowy ustaje: nie ma ciągu, a radon się gromadzi.',
        },
        snow: {
          kid: 'Taki mróz, że śnieg i lód zakrywają otwory na zboczu! Jaskinia prawie nie może wydychać i radonu znowu przybywa.',
          sci: 'Poniżej około −6 °C radonu w Postojnej znowu przybywało; badacze przypuszczają, że lód i śnieg zakrywały małe otwory oddechowe nad jaskinią.',
        },
        puffWinter: {
          kid: 'Zobacz, dym płynie w stronę schodów i do góry: jaskinia wydycha górą.',
          sci: 'Dym znosi w stronę korytarza: ciąg biegnie w górę i wychodzi górnym otworem.',
        },
        puffSummer: {
          kid: 'Dym płynie w stronę dolnych drzwi: tamtędy wysuwa się zimne powietrze jaskini.',
          sci: 'Dym znosi w stronę dolnego wejścia: ciąg się odwrócił i biegnie w dół, na zewnątrz.',
        },
        puffStill: {
          kid: 'Dym po prostu wisi w miejscu. Dziś nie ma ciągu.',
          sci: 'Dym wisi: przy prawie zerowej różnicy temperatur prawie nie ma ciągu.',
        },
      },
      panel: {
        kid: [
          'W jaskini przez cały rok jest mniej więcej tak samo, około 10 °C. Na zewnątrz zimą jest dużo zimniej, a latem cieplej. Ciepłe powietrze jest lekkie i się unosi; zimne jest ciężkie i opada. Jaskinia z jednym otworem na dole i drugim wysoko działa jak komin.',
          'Zimą powietrze jaskini uchodzi górą, a dołem wpływa świeże i wymiata radon. Latem jest odwrotnie: zimne powietrze jaskini powoli wysuwa się dołem, a przez glebę i szczeliny nad jaskinią sączy się powietrze, które przynosi radon. W jaskini Postojna w Słowenii latem było około 15 razy więcej radonu niż zimą.',
        ],
        sci: [
          'Efekt kominowy: powietrze jaskini, w Postojnej niemal stale od 9 do 10 °C, jest lżejsze od zimniejszego powietrza zewnętrznego i cięższe od cieplejszego. Przy otworach na dwóch wysokościach ta różnica napędza ciąg, który rośnie z różnicą temperatur. Zimą powietrze uchodzi górnymi otworami i szczelinami i zasysa powietrze z zewnątrz dolnym wejściem; latem ciąg jest słaby albo odwrócony, od wyższych otworów do niższych.',
          'Monitoring w sali Wielkiej Góry w Postojnej od lipca 2005 do października 2009 (Gregorič, Zidanšek i Vaupotič, 2011) wykazał około 200 Bq/m³ zimą i około 3000 Bq/m³ latem. Radon w tym miejscu, około 2 km od wejścia, podążał za temperaturą na zewnątrz z czterodniowym opóźnieniem. Niektóre jaskinie mają odwrotny wzorzec albo żaden. Monitor w tej sali podąża za prostym modelem tej zmyślonej jaskini, przyspieszonym.',
        ],
      },
    },
    doors: {
      label: 'Drzwi',
      verbBottom: 'Dotknij dolnych drzwi',
      verbTop: 'Dotknij górnych drzwi',
      verbAuto: 'Dotknij przycisku auto',
      title: 'Sterowanie oddechem',
      tip: 'Dotknij drzwi albo ich przycisku, albo przycisku auto. Spróbuj w obu porach roku.',
      buttons: {
        bottom: 'dolne drzwi',
        top: 'górne drzwi',
        auto: 'auto',
        panelBottom: 'Otwórz lub zamknij dolne drzwi',
        panelTop: 'Otwórz lub zamknij górne drzwi',
        panelAuto: 'Auto: włącz lub wyłącz',
      },
      board: {
        outside: 'na zewnątrz',
        cave: 'jaskinia',
        open: 'otwarte',
        shut: 'zamknięte',
        auto: 'auto',
        on: 'wł.',
        off: 'wył.',
        rule: 'otwarte, gdy na zewnątrz zimniej, zamknięte, gdy cieplej',
      },
      says: {
        botOpen: { kid: 'Dolne drzwi otwarte: jaskinia znowu może przez nie oddychać.', sci: 'Dolne drzwi otwarte: ciąg znów może przejść.' },
        botShutWinter: {
          kid: 'Dolne drzwi zamknięte zimą: świeże powietrze nie może wejść, więc jaskinia przestaje wydychać. Patrz, jak przybywa radonu.',
          sci: 'Dolne drzwi zamknięte zimą: ciąg kominowy nie ma wlotu, przewietrzanie ustaje i radon się gromadzi.',
        },
        botShutSummer: {
          kid: 'Dolne drzwi zamknięte latem: zimne powietrze zostaje w środku, nic nie jest zasysane przez glebę, a radonu ubywa. Sprytne!',
          sci: 'Dolne drzwi zamknięte latem: zimne powietrze nie może już spływać, więc przez szczeliny nie jest zasysane powietrze glebowe, a radon spada do poziomu, jaki daje sama skała.',
        },
        topOpen: { kid: 'Górne drzwi znowu otwarte.', sci: 'Górne drzwi otwarte: główne wyjście u góry jest wolne.' },
        topShutWinter: {
          kid: 'Górne drzwi zamknięte zimą: ciepłe powietrze może uciekać tylko małymi szczelinami, więc jaskinia oddycha słabiej i radonu przybywa.',
          sci: 'Górne drzwi zamknięte zimą: ciepłe powietrze uchodzi tylko szczelinami, ciąg słabnie i radon rośnie, podobnie jak wtedy, gdy śnieg zakrywał otwory oddechowe Postojnej.',
        },
        topShutSummer: {
          kid: 'Ojej! Zamknięcie górnych drzwi latem tylko pogorszyło sprawę. Teraz całe powietrze, które jaskinia zasysa, musi przejść przez glebę, a ono niesie radon. Spróbuj raczej dolnych drzwi.',
          sci: 'Górne drzwi zamknięte latem: spływające powietrze jaskini jest teraz zastępowane tylko przez szczeliny w glebie, więc wchodzi więcej bogatego w radon powietrza glebowego. Zamykać trzeba dolne drzwi.',
        },
        autoOn: {
          kid: 'Auto! Drzwi otwierają się, gdy na zewnątrz jest zimniej niż w jaskini, i zamykają, gdy jest cieplej. Zmień temperaturę i patrz.',
          sci: 'Tryb automatyczny: otwarte, gdy na zewnątrz jest zimniej niż w jaskini, zamknięte, gdy cieplej, czyli zasada zaproponowana dla jaskini Chifley w Jenolan w Australii.',
        },
        autoOff: { kid: 'Auto wyłączone: drzwi zostają tak, jak są.', sci: 'Sterowanie automatyczne wyłączone: drzwi zachowują obecny stan.' },
        autoOpens: {
          kid: 'Teraz na zewnątrz jest zimniej: drzwi same się otwierają, żeby jaskinia mogła wydychać.',
          sci: 'Na zewnątrz poniżej temperatury jaskini: drzwi się otwierają, a zimowy ciąg przewietrza jaskinię.',
        },
        autoShuts: {
          kid: 'Teraz na zewnątrz jest cieplej: drzwi same się zamykają, żeby powietrze z gleby nie wchodziło.',
          sci: 'Na zewnątrz powyżej temperatury jaskini: drzwi się zamykają, więc powietrze glebowe nie jest zasysane.',
        },
      },
      panel: {
        kid: [
          'Jaskinie turystyczne często mają drzwi przy wejściach. Jaskinia wdycha jednym otworem, a wydycha drugim, więc drzwi mogą zmienić to, jak oddycha.',
          'Zimą otwarte drzwi pozwalają ciągowi wymieść radon. Latem zimne powietrze jaskini, wysuwając się dołem, zasysa powietrze przez szczeliny w glebie nad jaskinią, a to powietrze niesie radon; zamknięcie dolnych drzwi to zatrzymuje. Czyli: otwarte, gdy na zewnątrz jest zimniej, zamknięte, gdy cieplej. Dokładnie to zaproponowali badacze jaskiń z Australii.',
        ],
        sci: [
          'Waring i współpracownicy (Journal of Cave and Karst Studies, 2021) wykazali, że radon w jaskini Chifley w Jenolan w Australii pochodzi z gleby nad nią, używając jako znaczników radonu, izotopów węgla w dwutlenku węgla i podtlenku azotu. Letni ciąg, z góry na dół, powoli zasysa powietrze glebowe przez pęknięcia i szczeliny; zimowy przewietrza jaskinię powietrzem z zewnątrz.',
          'Zaproponowali szczelne drzwi zamknięte, gdy na zewnątrz jest cieplej niż w jaskini, i otwarte, gdy jest zimniej: bierny sposób na obniżenie radonu bez przetłaczania powietrza przez jaskinię i wysuszania jej nacieków. Tam, gdzie radon pochodzi z wnętrza jaskini, zamknięte drzwi go zatrzymują, więc to, co działa, zależy od jaskini. Efekty w tej sali pochodzą z jej modelu.',
        ],
      },
    },
    guide: {
      label: 'Rok przewodniczki',
      verbGuide: 'Dotknij przewodniczki',
      verbTicket: 'Dotknij biletu zwiedzającego',
      verbMonths: 'Dotknij miesięcy',
      title: 'Rok przewodniczki pod ziemią',
      slider: 'Jej godziny w jaskini w tygodniu',
      tip: 'Dotknij przewodniczki, biletu albo miesięcy, albo przeciągnij jej godziny.',
      buttons: { badge: 'Pokaż jej plakietkę', ticket: 'Wycieczka zwiedzającego', plan: 'Więcej godzin zimą' },
      badgeCap: { kid: 'moja plakietka na radon', sci: 'osobisty detektor radonu' },
      ticket: { title: 'ZWIEDZANIE JASKINI', line: 'jeden zwiedzający' },
      monthLetters: ['S', 'L', 'M', 'K', 'M', 'C', 'L', 'S', 'W', 'P', 'L', 'G'],
      board: {
        title: 'Rok przewodniczki',
        hours: '{h} h tygodniowo',
        planOn: 'więcej godzin w jaskini zimą',
        planOff: 'te same godziny przez cały rok',
        months: { kid: 'radon w jaskini, miesiąc po miesiącu', sci: 'średni radon w każdym miesiącu, przy obecnym stanie drzwi' },
        radonKey: 'radon',
        hoursKey: 'jej godziny',
        tapMonths: 'dotknij miesięcy, by zaplanować',
        limit: { kid: 'limit', sci: 'limit UE 20 mSv' },
        year: 'jej rok',
        visit: 'wizyta',
        icrp: 'ICRP 137: 13 µSv za godzinę przy 1000 Bq/m³',
      },
      says: {
        badge: {
          kid: 'To moja plakietka na radon. Pokazuje, ile radonu wdycham w pracy, żebyśmy mogli zaplanować moje godziny.',
          sci: 'Osobisty detektor radonu, noszony w pracy. Razem z odczytami monitorów daje dawkę, którą plan jaskini utrzymuje w limicie.',
        },
        ticket: {
          kid: 'Wycieczka zwiedzającego, półtorej godziny latem: tylko {v} mSv. Malutki okruszek obok roku przewodniczki.',
          sci: 'Jedna półtoragodzinna wizyta w lipcu przy radonie tej jaskini: około {v} mSv, okruch wobec limitu dla pracowników.',
        },
        planOn: {
          kid: 'Więcej jej godzin w jaskini zimą, gdy radonu jest mało, a latem inna praca na zewnątrz: jej rok spada do {d} mSv.',
          sci: 'Godziny przeniesione z maja do września na miesiące z małym radonem, przy tej samej sumie: {d} mSv rocznie.',
        },
        planOff: { kid: 'Znowu te same godziny co miesiąc: {d} mSv w jej roku.', sci: 'Równe godziny przez cały rok: {d} mSv.' },
        over: {
          kid: 'To za dużo godzin! Planista jaskini nigdy nie pozwoliłby przewodniczce przekroczyć limitu. Mniej godzin, więcej zimą albo drzwi na auto.',
          sci: 'Powyżej 20 mSv rocznie: plan by na to nie pozwolił. Pomogłyby mniej godzin, plan z przewagą zimy albo niższy radon.',
        },
      },
      panel: {
        kid: [
          'Przewodnicy spędzają w jaskini wiele godzin, więc wdychają więcej radonu niż zwiedzający. Dlatego jaskinie turystyczne mierzą powietrze i planują, jak długo każdy przewodnik pracuje pod ziemią, tak by zostać daleko poniżej limitu.',
          'Przeciągnij jej godziny w tygodniu. Jej rok liczy się z radonu w jaskini w każdym miesiącu, a miesiące letnie ważą więcej. Dotknij miesięcy, by przenieść jej godziny w jaskini na zimę, i wypróbuj drzwi na auto. Wycieczka zwiedzającego dodaje tylko okruszek.',
        ],
        sci: [
          'Dawka = radon × godziny × współczynnik dawki. Publikacja ICRP 137 (2017) zaleca 6 mSv na mJ·h/m³ dla jaskiń turystycznych, około 1,3 × 10⁻⁵ mSv na Bq·h/m³ przy zwykłym współczynniku równowagi 0,4. Limit UE dla pracowników to 20 mSv rocznie, a poziom referencyjny radonu w miejscach pracy wynosi zwykle najwyżej 300 Bq/m³ średnio w roku (dyrektywa 2013/59/Euratom).',
          'Tablica używa miesięcznego radonu tej modelowej jaskini, przy obecnym stanie drzwi, i 46 tygodni pracy. Jaskinie są zwykle znacznie powyżej 300 Bq/m³, więc dawki przewodników ocenia się i planuje: mniej godzin, więcej z nich w porze małego radonu. Własny współczynnik równowagi i aerozol jaskini mogą zmienić współczynnik dawki.',
        ],
      },
    },
  },
  de: {
    title: 'Die atmende Höhle',
    greet: {
      kid: 'Willkommen in einer Höhle in einer Winternacht! Höhlen atmen, und die kleinen türkisen Punkte, die hier herumschweben, bin ich, das Radon, ausgeatmet vom Gestein. Probier die drei Stationen aus. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Eine Schauhöhle aus Kalkstein in einer Winternacht. Die türkisen Pünktchen sind Radonatome; wie viele hier schweben, folgt der Anzeige des Messgeräts. Drei Stationen: der Atem der Höhle, ihre Türen und das Jahr einer Führerin. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Das Gestein ringsum enthält ein klein wenig Uran. Während es sich langsam umwandelt, entstehe ich, das Radon, ein Gas, das in die Höhlenluft sickert.',
        'In einer Höhle ist es das ganze Jahr ungefähr gleich warm, kühl wie in einem Keller. Was sich ändert, ist die Luft draußen, und das lässt die Höhle atmen.',
        'Schauhöhlen messen mich die ganze Zeit. So sorgen sie dafür, dass ihre Führer und Besucher sicher sind.',
      ],
      sci: [
        'Radon-222 entsteht aus Radium-226 im Gestein und im Boden darüber. Mit einer Halbwertszeit von 3,82 Tagen hat es Zeit, sich in der stillen Höhlenluft anzusammeln.',
        'Die Luft in Postojna hat das ganze Jahr 9 bis 10 °C. Der Luftzug hängt vom Unterschied zur Außenluft ab, nicht vom Kalender.',
        'Schauhöhlen sind Arbeitsplätze: Ihr Radon wird überwacht, und die Stunden der Führer werden so geplant, dass ihre Dosis unter dem Grenzwert bleibt.',
      ],
    },
    breath: {
      label: 'Der Atem der Höhle',
      verbSign: 'Tippe auf das Jahreszeitenschild',
      verbPuff: 'Tippe auf die Rauchpumpe',
      verbSlide: 'Ziehe die Außentemperatur',
      title: 'Wie eine Höhle atmet',
      slider: 'Temperatur draußen',
      tip: 'Tippe auf das Jahreszeitenschild oder die Rauchpumpe, oder ziehe die Temperatur.',
      buttons: { winter: 'Winter, −5 °C', summer: 'Sommer, 25 °C', puff: 'Etwas Rauch ausstoßen' },
      sign: { winter: 'WINTER', summer: 'SOMMER' },
      board: {
        title: 'Höhlenluft: Radon',
        outside: 'draußen',
        cave: 'Höhle',
        what: { kid: 'so viele Radonatome zerfallen jede Sekunde in einem Kubikmeter Luft', sci: 'Aktivitätskonzentration von Radon-222' },
        winter: 'Winter, etwa 200',
        summer: 'Sommer, etwa 3000',
        eu: 'EU-Arbeitsplätze 300',
        trace: 'die letzten 40 Sekunden (beschleunigt: in einer echten Höhle Tage)',
      },
      says: {
        winter: {
          kid: 'Winter! Die Höhle ist wärmer als die frostige Luft draußen, also steigt ihre Luft oben hinaus, und unten strömt kalte Luft herein. Das Radon wird fortgeweht.',
          sci: 'Draußen kälter als die 10 °C der Höhle: Die warme, leichte Höhlenluft steigt durch die obere Öffnung hinaus und saugt unten kalte Luft herein. Der Luftzug spült das Radon heraus.',
        },
        summer: {
          kid: 'Sommer! Jetzt ist die Höhle der kühle Ort. Ihre kalte, schwere Luft gleitet unten hinaus, und durch Risse sickert etwas Luft aus dem Boden herein. Das Radon sammelt sich an.',
          sci: 'Draußen wärmer: Die kalte, dichte Höhlenluft fließt durch den unteren Eingang ab. Der Luftzug ist schwach und zieht radonreiche Bodenluft durch die Risse der Decke herein.',
        },
        still: {
          kid: 'Draußen fast so warm wie drinnen: Die Luft steht still, und die Höhle atmet kaum.',
          sci: 'Nahe der Höhlentemperatur hört der Kamineffekt auf: kein Luftzug, und das Radon sammelt sich an.',
        },
        snow: {
          kid: 'So kalt, dass Schnee und Eis die Öffnungen oben am Hang zudecken! Die Höhle kann kaum noch ausatmen, und das Radon steigt wieder.',
          sci: 'Unter etwa −6 °C stieg das Radon in Postojna wieder an; die Forscher vermuten, dass Eis und Schnee die kleinen Atemlöcher über der Höhle bedeckten.',
        },
        puffWinter: {
          kid: 'Schau, der Rauch zieht zur Treppe und nach oben: Die Höhle atmet oben aus.',
          sci: 'Der Rauch treibt zum Gang: Der Luftzug läuft nach oben und durch die obere Öffnung hinaus.',
        },
        puffSummer: {
          kid: 'Der Rauch zieht zur unteren Tür: Dort gleitet die kalte Höhlenluft hinaus.',
          sci: 'Der Rauch treibt zum unteren Eingang: Der Luftzug hat sich umgekehrt und läuft nach unten hinaus.',
        },
        puffStill: {
          kid: 'Der Rauch hängt einfach in der Luft. Heute gibt es keinen Luftzug.',
          sci: 'Der Rauch hängt: Ohne nennenswerten Temperaturunterschied gibt es kaum einen Luftzug.',
        },
      },
      panel: {
        kid: [
          'In einer Höhle ist es das ganze Jahr ungefähr gleich warm, etwa 10 °C. Draußen ist die Luft im Winter viel kälter und im Sommer wärmer. Warme Luft ist leicht und steigt; kalte Luft ist schwer und sinkt. Eine Höhle mit einer Öffnung unten und einer weit oben wirkt wie ein Kamin.',
          'Im Winter steigt die Höhlenluft oben hinaus, und unten kommt frische Luft herein, die das Radon hinausfegt. Im Sommer dreht es sich um: Die kalte Höhlenluft gleitet langsam unten hinaus, und durch den Boden und die Risse darüber sickert Luft herein, die Radon mitbringt. In der Höhle von Postojna in Slowenien gab es im Sommer etwa 15-mal so viel Radon wie im Winter.',
        ],
        sci: [
          'Der Kamineffekt: Die Höhlenluft, in Postojna fast immer 9 bis 10 °C, ist leichter als kältere Außenluft und schwerer als wärmere. Mit Öffnungen in zwei Höhen treibt der Unterschied einen Luftzug an, der mit dem Temperaturunterschied wächst. Im Winter steigt er durch die oberen Öffnungen und Risse hinaus und saugt am unteren Eingang Außenluft an; im Sommer ist er schwach oder umgekehrt, von den höheren Öffnungen zu den tieferen.',
          'Messungen in der Halle des Großen Bergs in Postojna von Juli 2005 bis Oktober 2009 (Gregorič, Zidanšek und Vaupotič, 2011) ergaben im Winter etwa 200 Bq/m³ und im Sommer etwa 3000 Bq/m³. Das Radon dort, etwa 2 km vom Eingang entfernt, folgte der Außentemperatur mit vier Tagen Verzögerung. Manche Höhlen zeigen das umgekehrte Muster oder gar keines. Das Messgerät in diesem Raum folgt einem einfachen Modell dieser erfundenen Höhle, beschleunigt.',
        ],
      },
    },
    doors: {
      label: 'Die Türen',
      verbBottom: 'Tippe auf die untere Tür',
      verbTop: 'Tippe auf die obere Tür',
      verbAuto: 'Tippe auf den Auto-Knopf',
      title: 'Den Atem steuern',
      tip: 'Tippe auf eine Tür oder ihren Knopf, oder auf den Auto-Knopf. Probier es in beiden Jahreszeiten.',
      buttons: {
        bottom: 'untere Tür',
        top: 'obere Tür',
        auto: 'Auto',
        panelBottom: 'Untere Tür öffnen oder schließen',
        panelTop: 'Obere Tür öffnen oder schließen',
        panelAuto: 'Automatik an oder aus',
      },
      board: {
        outside: 'draußen',
        cave: 'Höhle',
        open: 'offen',
        shut: 'zu',
        auto: 'Automatik',
        on: 'an',
        off: 'aus',
        rule: 'offen, wenn es draußen kälter ist, zu, wenn wärmer',
      },
      says: {
        botOpen: { kid: 'Untere Tür offen: Die Höhle kann wieder durch sie atmen.', sci: 'Untere Tür offen: Der Luftzug kann wieder hindurch.' },
        botShutWinter: {
          kid: 'Untere Tür zu im Winter: Keine frische Luft kann herein, also hört die Höhle auf auszuatmen. Schau, wie das Radon steigt.',
          sci: 'Untere Tür im Winter geschlossen: Der Kaminzug hat keinen Einlass, die Spülung stoppt, und Radon reichert sich an.',
        },
        botShutSummer: {
          kid: 'Untere Tür zu im Sommer: Die kalte Luft bleibt drin, nichts wird durch den Boden angesaugt, und das Radon sinkt. Schlau!',
          sci: 'Untere Tür im Sommer geschlossen: Die kalte Luft kann nicht mehr abfließen, also wird keine Bodenluft durch die Risse angesaugt, und das Radon sinkt auf das, was das Gestein allein liefert.',
        },
        topOpen: { kid: 'Obere Tür wieder offen.', sci: 'Obere Tür offen: Der Hauptweg oben hinaus ist frei.' },
        topShutWinter: {
          kid: 'Obere Tür zu im Winter: Die warme Luft kann nur durch kleine Risse entweichen, also atmet die Höhle weniger, und das Radon steigt.',
          sci: 'Obere Tür im Winter geschlossen: Die warme Luft entweicht nur durch die Risse, der Luftzug wird schwächer, und das Radon steigt, ähnlich wie bei Schnee über den Atemlöchern von Postojna.',
        },
        topShutSummer: {
          kid: 'Oh! Die obere Tür im Sommer zu schließen hat es schlimmer gemacht. Jetzt muss alle Luft, die die Höhle ansaugt, durch den Boden kommen, und sie bringt Radon mit. Probier lieber die untere Tür.',
          sci: 'Obere Tür im Sommer geschlossen: Die abfließende Höhlenluft wird jetzt nur noch durch die Bodenrisse ersetzt, also strömt mehr radonreiche Bodenluft herein. Schließen sollte man die untere Tür.',
        },
        autoOn: {
          kid: 'Automatik! Die Türen gehen auf, wenn es draußen kälter ist als in der Höhle, und zu, wenn es wärmer ist. Ändere die Temperatur und schau zu.',
          sci: 'Automatik: offen, wenn es draußen kälter ist als in der Höhle, zu, wenn es wärmer ist, die für die Chifley-Höhle in Jenolan, Australien, vorgeschlagene Regel.',
        },
        autoOff: { kid: 'Automatik aus: Die Türen bleiben, wie sie sind.', sci: 'Automatische Steuerung aus: Die Türen behalten ihren jetzigen Zustand.' },
        autoOpens: {
          kid: 'Jetzt ist es draußen kälter: Die Türen gehen von selbst auf, damit die Höhle ausatmen kann.',
          sci: 'Außen unter der Höhlentemperatur: Die Türen öffnen sich, und der Winterzug spült die Höhle.',
        },
        autoShuts: {
          kid: 'Jetzt ist es draußen wärmer: Die Türen gehen von selbst zu, damit die Bodenluft draußen bleibt.',
          sci: 'Außen über der Höhlentemperatur: Die Türen schließen sich, also wird keine Bodenluft angesaugt.',
        },
      },
      panel: {
        kid: [
          'Schauhöhlen haben oft Türen an ihren Eingängen. Eine Höhle atmet durch eine Öffnung ein und durch eine andere aus, also kann eine Tür ändern, wie sie atmet.',
          'Im Winter lassen offene Türen den Luftzug das Radon hinausfegen. Im Sommer zieht die kalte Höhlenluft, die unten hinausgleitet, Luft durch Risse im Boden darüber herein, und diese Luft bringt Radon mit; eine geschlossene untere Tür stoppt das. Also: offen, wenn es draußen kälter ist, zu, wenn es wärmer ist. Genau das haben Höhlenforscher in Australien vorgeschlagen.',
        ],
        sci: [
          'Waring und Kollegen (Journal of Cave and Karst Studies, 2021) führten das Radon der Chifley-Höhle in Jenolan, Australien, auf den Boden darüber zurück, mit Radon, den Kohlenstoffisotopen des Kohlendioxids und Lachgas als Tracern. Der Sommerzug, von oben nach unten, saugt Bodenluft langsam durch Risse und Spalten an; der Winterzug spült die Höhle mit Außenluft.',
          'Sie schlugen luftdichte Türen vor, die geschlossen bleiben, wenn es draußen wärmer ist als in der Höhle, und offen, wenn es kälter ist: ein passiver Weg, das Radon zu senken, ohne Luft durch die Höhle zu pressen und ihre Tropfsteine auszutrocknen. Wo das Radon aus der Höhle selbst stammt, sperren geschlossene Türen es dagegen ein; was hilft, hängt also von der Höhle ab. Die Effekte hier stammen aus dem Modell dieses Raums.',
        ],
      },
    },
    guide: {
      label: 'Das Jahr der Führerin',
      verbGuide: 'Tippe auf die Führerin',
      verbTicket: 'Tippe auf die Eintrittskarte',
      verbMonths: 'Tippe auf die Monate',
      title: 'Das Jahr einer Höhlenführerin unter Tage',
      slider: 'Ihre Stunden in der Höhle pro Woche',
      tip: 'Tippe auf die Führerin, die Eintrittskarte oder die Monate, oder ziehe ihre Stunden.',
      buttons: { badge: 'Ihre Plakette zeigen', ticket: 'Eine Besucherführung', plan: 'Mehr Stunden im Winter' },
      badgeCap: { kid: 'meine Radon-Plakette', sci: 'ein persönlicher Radondetektor' },
      ticket: { title: 'HÖHLENFÜHRUNG', line: 'ein Besucher' },
      monthLetters: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      board: {
        title: 'Das Jahr der Führerin',
        hours: '{h} h pro Woche',
        planOn: 'mehr Höhlenstunden im Winter',
        planOff: 'jeden Monat gleich viele Stunden',
        months: { kid: 'Radon in der Höhle, Monat für Monat', sci: 'Monatsmittel des Radons, mit den Türen wie jetzt' },
        radonKey: 'Radon',
        hoursKey: 'ihre Stunden',
        tapMonths: 'tippe auf die Monate, um zu planen',
        limit: { kid: 'der Grenzwert', sci: 'EU-Grenzwert 20 mSv' },
        year: 'ihr Jahr',
        visit: 'ein Besuch',
        icrp: 'ICRP 137: 13 µSv für eine Stunde bei 1000 Bq/m³',
      },
      says: {
        badge: {
          kid: 'Das ist meine Radon-Plakette. Sie zeigt, wie viel Radon ich bei der Arbeit einatme, damit wir meine Stunden planen können.',
          sci: 'Ein persönlicher Radondetektor, bei der Arbeit getragen. Zusammen mit den Messwerten ergibt er die Dosis, die der Plan der Höhle unter dem Grenzwert hält.',
        },
        ticket: {
          kid: 'Eine Besucherführung, anderthalb Stunden im Sommer: nur {v} mSv. Ein winziger Splitter neben dem Jahr einer Führerin.',
          sci: 'Ein Besuch von 1,5 h im Juli beim Radon dieser Höhle: etwa {v} mSv, ein Splitter neben dem Grenzwert für Beschäftigte.',
        },
        planOn: {
          kid: 'Mehr ihrer Höhlenstunden im Winter, wenn wenig Radon da ist, und im Sommer andere Arbeit draußen: Ihr Jahr sinkt auf {d} mSv.',
          sci: 'Stunden von Mai bis September in die radonarmen Monate verlegt, bei gleicher Summe: {d} mSv im Jahr.',
        },
        planOff: { kid: 'Wieder jeden Monat gleich viele Stunden: {d} mSv für ihr Jahr.', sci: 'Gleichmäßige Stunden übers Jahr: {d} mSv.' },
        over: {
          kid: 'Das sind zu viele Stunden! Wer die Höhle plant, würde eine Führerin nie über den Grenzwert lassen. Weniger Stunden, mehr davon im Winter, oder die Türen auf Automatik.',
          sci: 'Über 20 mSv im Jahr: Der Plan würde das nicht zulassen. Weniger Stunden, ein Plan mit mehr Winter oder weniger Radon würden helfen.',
        },
      },
      panel: {
        kid: [
          'Führer verbringen viele Stunden in der Höhle, also atmen sie mehr Radon ein als Besucher. Darum messen Schauhöhlen die Luft und planen, wie lange jeder Führer unter Tage arbeitet, deutlich unter dem Grenzwert.',
          'Ziehe ihre Stunden pro Woche. Ihr Jahr wird aus dem Radon der Höhle in jedem Monat berechnet, und Sommermonate zählen mehr. Tippe auf die Monate, um ihre Höhlenstunden in den Winter zu verlegen, und probier die Türen auf Automatik. Eine Besucherführung fügt nur einen Splitter hinzu.',
        ],
        sci: [
          'Dosis = Radon × Stunden × Dosiskoeffizient. Die ICRP-Veröffentlichung 137 (2017) empfiehlt für Schauhöhlen 6 mSv pro mJ·h/m³, etwa 1,3 × 10⁻⁵ mSv pro Bq·h/m³ beim üblichen Gleichgewichtsfaktor von 0,4. Der EU-Grenzwert für Beschäftigte liegt bei 20 mSv im Jahr, und der Referenzwert für Radon an Arbeitsplätzen in der Regel bei höchstens 300 Bq/m³ im Jahresmittel (Richtlinie 2013/59/Euratom).',
          'Die Tafel nutzt das monatliche Radon dieser Modellhöhle, mit den Türen wie jetzt, und 46 Arbeitswochen. Höhlen liegen meist weit über 300 Bq/m³, also werden die Dosen der Führer ermittelt und geplant: weniger Stunden, mehr davon in der radonarmen Zeit. Der eigene Gleichgewichtsfaktor und das Aerosol einer Höhle können den Koeffizienten ändern.',
        ],
      },
    },
  },
}
