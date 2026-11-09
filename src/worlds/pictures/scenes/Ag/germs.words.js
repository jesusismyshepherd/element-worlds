// The words of silver's germs room ("Can a metal fight germs?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Ag.js (the
// easel shows it); the room adds the things to do. Sources, read for this room:
// - The Russian segment's water: J. Steele, M. Wilson, J. Makinen and C. M. Ott, "Antimicrobials for Water
//   Systems in Manned Spaceflight - Past, Present, and Future Applications and Challenges" (NASA NTRS
//   20180004666), read in full: humidity condensate is collected by the SRV-K; it passes a multifiltration bed
//   (activated charcoal, ion exchange resins, a room-temperature catalyst), an in-line conductivity check (under
//   150 microsiemens per cm), a conditioning bed that adds magnesium, calcium and other minerals, and a silver
//   ionizer that adds 0.05 to 0.20 mg/L "for microbial control"; "prior to dispensing ... product water is
//   pasteurized at 85C ... by a regenerative heat exchanger and storage in a heated accumulator". Factors that
//   lower Ag+ (pH, chloride, nitrate, sulfate, organics, plating out on system materials) and the ways
//   microorganisms resist it (enzymatic conversion, binding in the cell wall, efflux) are from the same paper.
//   The US segment uses iodine (1 to 4 ppm); for Orion the dose is 400 ppb silver fluoride, "the maximum
//   consumable limit" of NASA's Human Systems Integration Requirements (MPCV 70024); silver is "essential"
//   for extended exploration missions. (NTRS 20250005545, cited by the design, was not opened.)
//   Flagged: the room's order of steps (breath, condenser, tank, filters, silver, heater, bag) is a teaching
//   order; the tank in the middle is a simplification of the real plumbing, and the real silver ionizer comes
//   before the pasteurising. The "stops at 0.05 mg/L" is the lower end of NASA's dose range used as the
//   room's model threshold, not a measured minimum for any germ. The week-long growth lens is a model: a
//   germ count that doubles once a day (real bacteria can divide in under an hour).
// - The dish: the agar diffusion ("zone of inhibition") test as school and clinical labs do it; the room gives
//   no ring sizes. Copper is antimicrobial too. The plaster and the plastic button are the picture's.
// - The germ: the oligodynamic effect (Nageli, 1893); Ag+ binds thiol (-SH) groups, upsets respiration, makes
//   the membrane leaky and binds DNA (as the board's story says). A rod of about 2 micrometres drawn at 3 m
//   is about 1.5 million times larger. The room's "four ions stop the division, seven stop every machine" and
//   the 50 micrograms per litre line are the room's model.
// - Credé: began routine use of silver nitrate drops at the Leipzig maternity clinic in 1880 (from 1 June
//   1880 per the design's source, Schmidt 2007), published 1881. Rates differ by source: about 10% (9.8% in
//   his own report, 10.8% of 2897 births in Fuchs' 1884 essay) before, 0.1 to 0.5% after. His own paper
//   gives the solution as 1 in 40, about 2.5% (it is usually quoted as 2%); later practice moved to 1% because
//   2% irritates. The words say "about 2%" and "about one baby in ten".
// - Argyria (blue-grey skin from long swallowing of silver) is from the board's story.
export const GERMS_WORDS = {
  en: {
    title: 'Inside the space station',
    greet: {
      kid: 'We are inside the picture, in the Russian part of the International Space Station, going round the Earth! Nothing weighs anything here, so drops and pens float, and velcro shoes keep us on the floor. Look out of the window. The picture\'s story is on the easel.',
      sci: 'Inside the Russian segment of the International Space Station, about 400 km up, one orbit every 92 minutes (the Sun is sped up here). No weight: drops float and velcro shoes hold you down. Three stations: the water machine, a germ dish and a single germ at 1.5 million times its size. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Astronauts drink water made from their own breath, and a pinch of silver keeps it fresh. My silver, working in space!',
        'You cannot see a silver ion, and you cannot see a germ either. That is why this room is a giant model: the germ is as long as a small car.',
        'Silver is not the only metal that fights germs. Copper does too. Try both in the dish.',
        'A pinch of silver in water is safe, but never swallow silver pills or drops from a shop. Too much for too long can turn skin blue-grey.',
      ],
      sci: [
        'The Russian SRV-K turns cabin humidity condensate into drinking water: multifiltration, minerals, a silver ionizer adding 0.05 to 0.20 mg/L, then pasteurising at 85 °C (Steele et al., NASA).',
        'NASA uses iodine in its own segment. For Orion and for missions beyond Earth orbit it chose silver, at up to 400 µg/L, the highest level its requirements allow.',
        'Silver is not invincible: chloride, sulfide and organic matter bind Ag⁺, it plates out on metal pipes, and some bacteria resist it or pump it out.',
        'The germ in station 3 is a rod about 2 µm long drawn 3 m long, about 1.5 million times larger. Argyria, a permanent blue-grey skin, comes from swallowing silver for a long time.',
      ],
    },
    leave: {
      kid: 'Before you go: a tiny pinch of silver in drinking water is safe, but please never swallow silver pills or drops to "stay healthy". Ask a doctor first!',
      sci: 'Before you go: silver is dosed in micrograms per litre and measured. Swallowing silver for a long time can turn skin permanently blue-grey (argyria), so it is not a supplement.',
    },
    water: {
      label: 'Water from breath',
      title: 'The water machine',
      tags: { breath: 'breath', condenser: 'cold plates', tank: 'tank', filters: 'filters', ionizer: 'silver cell', heater: '85 °C', bag: 'drink', lens: 'germs' },
      hints: {
        breath: 'Tap the astronaut\'s breath',
        fill: 'Watch the tank fill',
        filter: 'Tap the filters',
        silver: 'Tap the silver cell',
        heat: 'Tap the heater',
        bag: 'Tap the drinking bag',
        done: 'Slide the silver to zero and watch the germs',
      },
      slider: 'Silver added',
      buttons: { breath: 'Breathe out', filter: 'Run it through the filters', silver: 'Add silver', heat: 'Heat it to 85 °C', bag: 'Fill the drinking bag', reset: 'Start again' },
      rows: { tank: 'Tank', clean: 'Filtered', silver: 'Silver', hot: 'Pasteurised' },
      vals: { empty: 'empty', full: 'full', no: 'not yet', yes: 'yes' },
      lens: { day: 'Day', growing: 'growing', stopped: 'stopped', note: 'a model' },
      says: {
        breath: 'Every breath and every drop of sweat makes the cabin air a little damp. The fan sends it over cold plates, where it turns into drops.',
        filled: 'The tank is full of water that was breath a minute ago. It still smells and has bits in it, so it has to go through the filters.',
        noWater: 'There is no water yet! Breathe out first.',
        filter: 'Charcoal, resin and a catalyst catch the dirt and the smell. Now the water is clear. But clear is not the same as germ-free.',
        silver0: 'No silver: look at the little lens. Any germ that gets in would double and double all week.',
        silverLow: 'A little silver, but not enough yet. The germs are still growing in the lens.',
        silverOk: 'This much silver and the germs in the lens stop growing. The station uses between 0.05 and 0.2 milligrams in a litre.',
        silverMax: 'That is the most the station uses: a very, very small pinch.',
        heat: 'The heater warms the water to 85 degrees to finish off any germs that are left.',
        notYet: 'Not yet! The water must be filtered, have its pinch of silver and be heated first.',
        bag: 'A ball of water floats out of the bag, shaking like jelly. Cheers, astronauts: breath, filters, silver and heat, and now a drink!',
        lookGrowing: 'Day by day the germs double. With no silver (or too little) a week is plenty for a whole crowd.',
        lookStopped: 'The silver ions jam the germs, and the count stays tiny. That is how the water keeps fresh for the crew.',
        lookEmpty: 'The tank is empty, so there is nothing to watch yet.',
        reset: 'The tank is drained and the machine is ready again.',
      },
      panel: {
        kid: [
          'On the space station every drop of water is precious, because it costs a lot to launch. So the Russian water machine collects the damp from the astronauts\' breath and sweat, cools it into drops, cleans it, adds a pinch of silver and heats it. Then it is safe to drink.',
          'Do it in order: tap the breath, then the filters, then the silver cell, then the heater, and last the drinking bag. Then slide the silver to zero and watch the little lens: with no silver, germs would keep growing all week.',
        ],
        sci: [
          'Russian segment, SRV-K (Steele et al., NASA): humidity condensate passes a multifiltration bed (activated charcoal, ion exchange resins, a catalyst), a conductivity check (under 150 µS/cm), a conditioning bed that adds magnesium, calcium and other minerals, and a silver ionizer that adds 0.05 to 0.20 mg/L for microbial control. Before it is dispensed it is pasteurised at 85 °C in a regenerative heat exchanger. The room shows these as a loop round one tank, a teaching simplification.',
          'The lens is a model: germs that double once a day (real bacteria can divide in under an hour). At 0.05 mg/L and above, growth stops in the model, the lower end of the station\'s range. Real water is harder: chloride, nitrate, sulfate and organic matter bind Ag⁺ and lower its effect, silver plates out on metal surfaces, and some bacteria resist it.',
          'NASA\'s own segment uses iodine (1 to 4 ppm), which does not mix with silver and must be removed before drinking on long flights. For Orion NASA chose silver at 400 µg/L, the highest level its requirements allow.',
        ],
      },
    },
    dish: {
      label: 'The germ dish',
      title: 'A dish of germs, made big',
      tags: { silver: 'silver coin', copper: 'copper coin', button: 'plastic button', plaster: 'silver plaster' },
      hours: 'h',
      hints: { place: 'Tap a thing to put it on the jelly', grow: 'Tap the dish to let time pass', ring: 'Tap a clear ring to look closer', more: 'Put another thing on the jelly', done: 'Slide the hours back and forth' },
      slider: 'Time passing',
      buttons: { day: 'Let 6 hours pass', clear: 'Take everything off' },
      rows: { hours: 'Time', placed: 'On the jelly' },
      none: 'nothing',
      says: {
        silver: 'A silver coin on the jelly. Wet silver slowly lets go of silver ions into the jelly. Now wait and see.',
        copper: 'A copper coin. Copper fights germs too, so I wonder what it will do.',
        button: 'A plastic button: it has no metal in it. It is the test that shows what a thing does when it does nothing.',
        plaster: 'A plaster with a silver pad, like the ones for burns and wounds.',
        take: 'Taken off the jelly. The germs will creep back in.',
        firstWait: 'Everything is seeded with germs, tiny dots now. Tap the dish, or slide the time, and they will grow.',
        grown: 'A whole lawn of germs! But look at the clear rings round the metals. And the button has germs right up to its edge.',
        needItem: 'Put a coin or a plaster on the jelly first.',
        ringSilver: 'Silver ions spread out from the coin into the jelly. Close to it there are many, far away only a few.',
        ringCopper: 'Copper ions spread out from the coin the same way, and they fight germs too.',
        ringPlaster: 'The silver pad lets go of silver ions, and the clear ring forms around it.',
        ringButton: 'Nothing comes out of the button, so the germs touch it. That is why it is in the test.',
        ringAny: 'The ring ends where there are too few ions to stop the germs.',
      },
      lens: { silver: 'silver ions', copper: 'copper ions', plaster: 'silver ions', button: 'nothing comes out', enough: 'enough to stop germs', zone: 'clear ring' },
      panel: {
        kid: [
          'This is how scientists test a metal: spread germs all over a jelly in a dish (a Petri dish, here 2 m across), put the things on it and wait. The germs grow into a thick lawn, but where something fights them, a clear ring stays empty.',
          'Tap a thing to put it on the jelly, then tap the dish or slide the time. Silver and copper make a clear ring. The plastic button makes none: the germs grow right up to it. Tap a ring to look closer: the ring ends where the tiny bits spreading into the jelly become too few to stop the germs.',
        ],
        sci: [
          'The agar diffusion test (zone of inhibition): a plate is seeded with bacteria and a sample is laid on the agar. A metal slowly releases ions (Ag⁺, Cu²⁺) that spread through the gel; where their concentration is high enough the lawn cannot grow, and the clear zone ends where it falls below that level.',
          'The room gives no ring sizes: they depend on the dish, the germ, the gel and the hours. The ring opens fast and then slows, as diffusion does, and it only shows once the lawn has grown. Copper is in the dish because it is antimicrobial too; the plastic button is the control, with no ions.',
        ],
      },
    },
    germ: {
      label: 'Inside a germ',
      title: 'One germ, 1.5 million times bigger',
      tags: { ion: 'silver ion' },
      hints: { first: 'Tap a silver ion', more: 'Tap another silver ion', cannot: 'Tap the little bottle on the shelf', done: 'Wash it clean in the panel to start again' },
      slider: 'Silver in the water',
      line: 'stops at about 50',
      buttons: { wash: 'Wash the silver off' },
      board: { count: 'Divisions', dividing: 'Dividing', slowing: 'Slowing down', stopped: 'Cannot divide', machines: 'Machines turning' },
      says: {
        first: 'A silver ion drifts in and grabs a sulfur in the germ\'s skin. The little machine next to it jams. One machine less!',
        second: 'Two machines stopped. The germ divides more slowly.',
        third: 'Three stopped, and the skin starts to leak.',
        fourth: 'Four stopped! The germ has too few machines working to divide. It cannot grow any more.',
        more: 'Another machine jammed, and the leaks get worse.',
        all: 'Every machine is jammed. The germ is stuck.',
        none: 'All the ions are on the germ already.',
        wash: 'The water is washed, the ions let go and the germ starts up again.',
        line: 'Past the line, the silver in the water is enough to jam the machines and stop the germ.',
        under: 'Below the line there is too little silver: the germ goes on dividing.',
      },
      panel: {
        kid: [
          'This is one germ, magnified about a million and a half times: a rod as long as a small car, floating in a ball of water. The turning wheels are its protein machines, they make the energy it needs to live and to split in two. The yellow dots are sulfur, in its skin.',
          'Tap a silver ion floating by. It drifts in, grabs a sulfur and jams the machine next to it. After four ions the germ has too few machines working: its skin leaks and it cannot split in two any more.',
        ],
        sci: [
          'The model: a rod-shaped bacterium about 2 µm long drawn 3 m long (1.5 million times). Ag⁺ binds the thiol (−SH) groups of enzymes and membrane proteins, upsets the cell\'s respiration in its membrane, makes the membrane leaky and binds DNA (Nägeli\'s oligodynamic effect, 1893). The room shows the first steps only; four of seven jammed machines stop division here, by the room\'s own rule.',
          'The slider: tens of micrograms per litre stop many bacteria. In this model the line is 50 µg/L, the lower end of the station\'s 0.05 to 0.20 mg/L. Real values depend on the species, the water and the time: chloride and organic matter bind silver, and some germs pump it out or resist it.',
        ],
      },
    },
    crede: {
      label: 'The old bottle',
      title: 'Credé\'s drops, 1880',
      tag: '1880',
      hint: 'Tap the old bottle',
      says: {
        first: 'This bottle is a model of the kind Credé used. One drop of silver, and a baby\'s eyes were safe.',
        again: 'Credé did not know how silver works. He saw that it did.',
      },
      panel: {
        kid: [
          'In 1880, in Leipzig, the doctor Carl Credé began to put one drop of a weak silver solution into the eyes of every baby just after it was born. Some mothers carried a germ that made babies\' eyes sore and could blind them. Before the drops, about one baby in ten got it. After the drops, hardly any.',
          'Hospitals used drops like his for about a hundred years, until antibiotic ointments took over. (This bottle is a model of such a bottle; no baby is shown here.)',
        ],
        sci: [
          'Credé\'s prophylaxis: from 1 June 1880, in the Leipzig maternity clinic, a drop of silver nitrate solution (about 2%) in each newborn\'s eyes; he published it in 1881. Gonococcal ophthalmia of the newborn fell from about 10% of births (9.8% in his own report) to well under 1% (0.1 to 0.5% in the series that followed).',
          'Silver nitrate drops stayed in use in many countries until antibiotic ointments replaced them, in some from the 1980s. They irritate the eye, so later practice used a weaker solution (1%). Credé did not know the mechanism: binding thiol groups in the germ\'s proteins came later.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Dentro da estação espacial',
    greet: {
      kid: 'Estamos dentro da imagem, na parte russa da Estação Espacial Internacional, a dar voltas à Terra! Aqui nada pesa, por isso as gotas e as canetas flutuam, e os sapatos de velcro prendem-nos ao chão. Espreita pela janela. A história da imagem está no cavalete.',
      sci: 'Dentro do segmento russo da Estação Espacial Internacional, a cerca de 400 km de altitude, uma órbita a cada 92 minutos (aqui o Sol vai mais depressa). Sem peso: as gotas flutuam e os sapatos de velcro seguram-te ao chão. Três estações: a máquina da água, uma placa de micróbios e um único micróbio com 1,5 milhões de vezes o seu tamanho. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Os astronautas bebem água feita da sua própria respiração, e uma pitada de prata mantém-na fresca. A minha prata, a trabalhar no espaço!',
        'Não se vê um ião de prata, nem se vê um micróbio. Por isso esta sala é um modelo gigante: o micróbio é comprido como um carro pequeno.',
        'A prata não é o único metal que combate micróbios. O cobre também. Experimenta os dois na placa.',
        'Uma pitada de prata na água é segura, mas nunca engulas comprimidos ou gotas de prata comprados numa loja. Demasiado, durante demasiado tempo, pode deixar a pele azul-acinzentada.',
      ],
      sci: [
        'O SRV-K russo transforma o condensado da humidade da cabina em água potável: multifiltração, minerais, um ionizador que junta 0,05 a 0,20 mg/L de prata e pasteurização a 85 °C (Steele et al., NASA).',
        'A NASA usa iodo no seu segmento. Para a Orion e para missões para lá da órbita da Terra escolheu a prata, até 400 µg/L, o máximo que os seus requisitos permitem.',
        'A prata não é invencível: o cloreto, o sulfureto e a matéria orgânica ligam-se ao Ag⁺, ela deposita-se nos tubos de metal e algumas bactérias resistem-lhe ou expulsam-na.',
        'O micróbio da estação 3 é um bastonete de cerca de 2 µm desenhado com 3 m, cerca de 1,5 milhões de vezes maior. A argiria, uma pele azul-acinzentada para sempre, vem de engolir prata durante muito tempo.',
      ],
    },
    leave: {
      kid: 'Antes de ires: uma pitadinha de prata na água potável é segura, mas, por favor, nunca engulas comprimidos ou gotas de prata «para ficares saudável». Pergunta primeiro a um médico!',
      sci: 'Antes de ires: a prata é doseada em microgramas por litro e medida. Engolir prata durante muito tempo pode deixar a pele azul-acinzentada para sempre (argiria), por isso não é um suplemento.',
    },
    water: {
      label: 'Água a partir da respiração',
      title: 'A máquina da água',
      tags: { breath: 'respiração', condenser: 'placas frias', tank: 'depósito', filters: 'filtros', ionizer: 'célula de prata', heater: '85 °C', bag: 'beber', lens: 'micróbios' },
      hints: {
        breath: 'Toca na respiração do astronauta',
        fill: 'Vê o depósito encher',
        filter: 'Toca nos filtros',
        silver: 'Toca na célula de prata',
        heat: 'Toca no aquecedor',
        bag: 'Toca no saco de beber',
        done: 'Põe a prata a zero e vê os micróbios',
      },
      slider: 'Prata acrescentada',
      buttons: { breath: 'Expirar', filter: 'Passar pelos filtros', silver: 'Juntar prata', heat: 'Aquecer a 85 °C', bag: 'Encher o saco de beber', reset: 'Recomeçar' },
      rows: { tank: 'Depósito', clean: 'Filtrada', silver: 'Prata', hot: 'Pasteurizada' },
      vals: { empty: 'vazio', full: 'cheio', no: 'ainda não', yes: 'sim' },
      lens: { day: 'Dia', growing: 'a crescer', stopped: 'parados', note: 'um modelo' },
      says: {
        breath: 'Cada respiração e cada gota de suor deixa o ar da cabina um pouco húmido. A ventoinha manda-o por cima de placas frias, onde se transforma em gotas.',
        filled: 'O depósito está cheio de água que há um minuto era respiração. Ainda cheira e tem restos, por isso tem de passar pelos filtros.',
        noWater: 'Ainda não há água! Primeiro, expira.',
        filter: 'O carvão, a resina e um catalisador apanham a sujidade e o cheiro. Agora a água está límpida. Mas límpida não é o mesmo que sem micróbios.',
        silver0: 'Sem prata: olha para a lentezinha. Qualquer micróbio que entrasse duplicava e duplicava durante a semana toda.',
        silverLow: 'Um pouco de prata, mas ainda não chega. Os micróbios continuam a crescer na lente.',
        silverOk: 'Com esta prata, os micróbios da lente deixam de crescer. A estação usa entre 0,05 e 0,2 miligramas num litro.',
        silverMax: 'É o máximo que a estação usa: uma pitada pequeníssima.',
        heat: 'O aquecedor leva a água aos 85 graus para acabar com os micróbios que sobrarem.',
        notYet: 'Ainda não! A água tem de estar filtrada, ter a sua pitada de prata e ser aquecida primeiro.',
        bag: 'Uma bola de água sai do saco, a tremer como gelatina. À saúde, astronautas: respiração, filtros, prata e calor, e agora uma bebida!',
        lookGrowing: 'Dia após dia, os micróbios duplicam. Sem prata (ou com pouca), uma semana chega para uma multidão inteira.',
        lookStopped: 'Os iões de prata encravam os micróbios e a contagem fica minúscula. É assim que a água se mantém fresca para a tripulação.',
        lookEmpty: 'O depósito está vazio, por isso ainda não há nada para ver.',
        reset: 'O depósito está esvaziado e a máquina está pronta outra vez.',
      },
      panel: {
        kid: [
          'Na estação espacial, cada gota de água é preciosa, porque custa muito lançá-la. Por isso a máquina de água russa recolhe a humidade da respiração e do suor dos astronautas, arrefece-a em gotas, limpa-a, acrescenta uma pitada de prata e aquece-a. Depois, já se pode beber.',
          'Faz por ordem: toca na respiração, depois nos filtros, depois na célula de prata, depois no aquecedor e, por fim, no saco de beber. Depois põe a prata a zero e vê a lentezinha: sem prata, os micróbios continuariam a crescer a semana toda.',
        ],
        sci: [
          'Segmento russo, SRV-K (Steele et al., NASA): o condensado da humidade passa por um leito de multifiltração (carvão ativado, resinas de troca iónica, um catalisador), por uma verificação da condutividade (abaixo de 150 µS/cm), por um leito de condicionamento que junta magnésio, cálcio e outros minerais e por um ionizador de prata que junta 0,05 a 0,20 mg/L para controlo microbiano. Antes de ser distribuída, é pasteurizada a 85 °C num permutador de calor regenerativo. A sala mostra tudo isto como um circuito à volta de um só depósito, uma simplificação para ensinar.',
          'A lente é um modelo: micróbios que duplicam uma vez por dia (as bactérias reais podem dividir-se em menos de uma hora). A 0,05 mg/L ou mais, o crescimento pára no modelo, o limite inferior da gama da estação. A água real é mais difícil: o cloreto, o nitrato, o sulfato e a matéria orgânica ligam-se ao Ag⁺ e reduzem o seu efeito, a prata deposita-se nas superfícies de metal e algumas bactérias resistem-lhe.',
          'O segmento da NASA usa iodo (1 a 4 ppm), que não se mistura com a prata e tem de ser retirado antes de beber, em voos longos. Para a Orion, a NASA escolheu a prata a 400 µg/L, o máximo que os seus requisitos permitem.',
        ],
      },
    },
    dish: {
      label: 'A placa de micróbios',
      title: 'Uma placa de micróbios, em ponto grande',
      tags: { silver: 'moeda de prata', copper: 'moeda de cobre', button: 'botão de plástico', plaster: 'penso com prata' },
      hours: 'h',
      hints: { place: 'Toca numa coisa para a pôr na gelatina', grow: 'Toca na placa para o tempo passar', ring: 'Toca num anel limpo para ver melhor', more: 'Põe outra coisa na gelatina', done: 'Desliza as horas para trás e para a frente' },
      slider: 'Tempo a passar',
      buttons: { day: 'Deixar passar 6 horas', clear: 'Tirar tudo' },
      rows: { hours: 'Tempo', placed: 'Na gelatina' },
      none: 'nada',
      says: {
        silver: 'Uma moeda de prata na gelatina. A prata molhada vai largando iões de prata para a gelatina. Agora espera e vê.',
        copper: 'Uma moeda de cobre. O cobre também combate micróbios, por isso estou curioso para ver o que faz.',
        button: 'Um botão de plástico: não tem metal. É o teste que mostra o que acontece quando uma coisa não faz nada.',
        plaster: 'Um penso com uma almofada de prata, como os que se usam em queimaduras e feridas.',
        take: 'Tirado da gelatina. Os micróbios vão voltando a entrar.',
        firstWait: 'Tudo está semeado de micróbios, pontinhos minúsculos por agora. Toca na placa ou desliza o tempo e eles crescem.',
        grown: 'Um tapete inteiro de micróbios! Mas olha para os anéis limpos à volta dos metais. E o botão tem micróbios mesmo até à borda.',
        needItem: 'Põe primeiro uma moeda ou um penso na gelatina.',
        ringSilver: 'Os iões de prata espalham-se da moeda para a gelatina. Perto dela há muitos, longe só alguns.',
        ringCopper: 'Os iões de cobre espalham-se da moeda do mesmo modo, e também combatem micróbios.',
        ringPlaster: 'A almofada de prata larga iões de prata, e o anel limpo forma-se à volta dela.',
        ringButton: 'Do botão não sai nada, por isso os micróbios tocam-lhe. É por isso que está no teste.',
        ringAny: 'O anel acaba onde há iões a menos para travar os micróbios.',
      },
      lens: { silver: 'iões de prata', copper: 'iões de cobre', plaster: 'iões de prata', button: 'não sai nada', enough: 'chega para travar micróbios', zone: 'anel limpo' },
      panel: {
        kid: [
          'É assim que os cientistas testam um metal: espalham micróbios por cima de uma gelatina numa placa (uma placa de Petri, aqui com 2 m de largura), põem as coisas lá em cima e esperam. Os micróbios crescem num tapete espesso, mas onde uma coisa os combate, fica um anel limpo e vazio.',
          'Toca numa coisa para a pôr na gelatina e depois toca na placa ou desliza o tempo. A prata e o cobre fazem um anel limpo. O botão de plástico não faz nenhum: os micróbios crescem mesmo até ele. Toca num anel para ver melhor: o anel acaba onde os bocadinhos que se espalham pela gelatina são poucos demais para travar os micróbios.',
        ],
        sci: [
          'O teste de difusão em ágar (zona de inibição): semeia-se uma placa com bactérias e põe-se uma amostra sobre o ágar. Um metal liberta lentamente iões (Ag⁺, Cu²⁺) que se difundem pelo gel; onde a concentração é suficiente, o tapete não cresce, e a zona limpa acaba onde ela desce abaixo desse nível.',
          'A sala não dá tamanhos de anéis: dependem da placa, do micróbio, do gel e das horas. O anel abre depressa e depois abranda, como a difusão, e só se vê depois de o tapete crescer. O cobre está na placa porque também é antimicrobiano; o botão de plástico é o controlo, sem iões.',
        ],
      },
    },
    germ: {
      label: 'Dentro de um micróbio',
      title: 'Um micróbio, 1,5 milhões de vezes maior',
      tags: { ion: 'ião de prata' },
      hints: { first: 'Toca num ião de prata', more: 'Toca noutro ião de prata', cannot: 'Toca no frasquinho antigo da prateleira', done: 'Lava-o no painel para recomeçar' },
      slider: 'Prata na água',
      line: 'pára por volta de 50',
      buttons: { wash: 'Lavar a prata' },
      board: { count: 'Divisões', dividing: 'A dividir-se', slowing: 'Mais devagar', stopped: 'Não se divide', machines: 'Máquinas a rodar' },
      says: {
        first: 'Um ião de prata chega e agarra um enxofre na pele do micróbio. A maquininha ao lado encrava. Menos uma máquina!',
        second: 'Duas máquinas paradas. O micróbio divide-se mais devagar.',
        third: 'Três paradas, e a pele começa a deixar sair coisas.',
        fourth: 'Quatro paradas! O micróbio tem poucas máquinas a trabalhar para se dividir. Já não consegue crescer.',
        more: 'Mais uma máquina encravada, e as fugas pioram.',
        all: 'Todas as máquinas estão encravadas. O micróbio ficou parado.',
        none: 'Os iões já estão todos no micróbio.',
        wash: 'A água é lavada, os iões soltam-se e o micróbio volta a andar.',
        line: 'Acima da linha, a prata na água chega para encravar as máquinas e parar o micróbio.',
        under: 'Abaixo da linha há prata a menos: o micróbio continua a dividir-se.',
      },
      panel: {
        kid: [
          'Este é um micróbio, ampliado cerca de um milhão e meio de vezes: um bastonete comprido como um carro pequeno, a flutuar numa bola de água. As rodas a rodar são as suas máquinas de proteínas, que fazem a energia de que ele precisa para viver e para se dividir em dois. Os pontos amarelos são enxofre, na pele dele.',
          'Toca num ião de prata que passa a flutuar. Ele entra, agarra um enxofre e encrava a máquina ao lado. Com quatro iões, o micróbio tem poucas máquinas a trabalhar: a pele deixa sair coisas e ele já não se consegue dividir em dois.',
        ],
        sci: [
          'O modelo: uma bactéria em bastonete de cerca de 2 µm desenhada com 3 m (1,5 milhões de vezes). O Ag⁺ liga-se aos grupos tiol (−SH) das enzimas e das proteínas da membrana, perturba a respiração da célula na sua membrana, torna a membrana permeável e liga-se ao ADN (o efeito oligodinâmico de Nägeli, 1893). A sala mostra só os primeiros passos; aqui, quatro das sete máquinas encravadas param a divisão, por regra da própria sala.',
          'O cursor: dezenas de microgramas por litro travam muitas bactérias. Neste modelo, a linha é 50 µg/L, o limite inferior dos 0,05 a 0,20 mg/L da estação. Os valores reais dependem da espécie, da água e do tempo: o cloreto e a matéria orgânica ligam-se à prata, e alguns micróbios expulsam-na ou resistem-lhe.',
        ],
      },
    },
    crede: {
      label: 'O frasco antigo',
      title: 'As gotas de Credé, 1880',
      tag: '1880',
      hint: 'Toca no frasco antigo',
      says: {
        first: 'Este frasco é um modelo do tipo que Credé usava. Uma gota de prata, e os olhos do bebé ficavam a salvo.',
        again: 'Credé não sabia como a prata funciona. Viu que funcionava.',
      },
      panel: {
        kid: [
          'Em 1880, em Leipzig, o médico Carl Credé começou a pôr uma gota de uma solução fraca de prata nos olhos de todos os bebés logo depois de nascerem. Algumas mães tinham um micróbio que deixava os olhos dos bebés inflamados e podia cegá-los. Antes das gotas, cerca de um bebé em dez apanhava-o. Depois das gotas, quase nenhum.',
          'Os hospitais usaram gotas como as dele durante cerca de cem anos, até as pomadas antibióticas tomarem o lugar. (Este frasco é um modelo de um frasco assim; aqui não se mostra nenhum bebé.)',
        ],
        sci: [
          'A profilaxia de Credé: a partir de 1 de junho de 1880, na maternidade de Leipzig, uma gota de solução de nitrato de prata (cerca de 2%) nos olhos de cada recém-nascido; publicou-a em 1881. A oftalmia gonocócica do recém-nascido desceu de cerca de 10% dos partos (9,8% no relatório dele) para bem menos de 1% (0,1 a 0,5% nas séries seguintes).',
          'As gotas de nitrato de prata mantiveram-se em uso em muitos países até as pomadas antibióticas as substituírem, nalguns desde os anos 1980. Irritam o olho, por isso a prática posterior usou uma solução mais fraca (1%). Credé não conhecia o mecanismo: a ligação aos grupos tiol das proteínas do micróbio veio depois.',
        ],
      },
    },
  },
  pl: {
    title: 'Wewnątrz stacji kosmicznej',
    greet: {
      kid: 'Jesteśmy w obrazku, w rosyjskiej części Międzynarodowej Stacji Kosmicznej, i okrążamy Ziemię! Nic tu nie waży, więc krople i długopisy unoszą się w powietrzu, a buty na rzepy trzymają nas przy podłodze. Wyjrzyj przez okno. Historia obrazka stoi na sztalugach.',
      sci: 'Wewnątrz rosyjskiego segmentu Międzynarodowej Stacji Kosmicznej, około 400 km nad Ziemią, jedno okrążenie co 92 minuty (Słońce jest tu przyspieszone). Brak ciężaru: krople unoszą się, a buty na rzepy trzymają cię przy podłodze. Trzy stanowiska: maszyna do wody, szalka z zarazkami i pojedynczy zarazek powiększony 1,5 miliona razy. Historia obrazka stoi na sztalugach.',
    },
    talk: {
      kid: [
        'Astronauci piją wodę zrobioną z własnego oddechu, a szczypta srebra utrzymuje ją świeżą. Moje srebro pracuje w kosmosie!',
        'Jonu srebra nie widać, zarazka też nie. Dlatego ta sala jest wielkim modelem: zarazek jest długi jak mały samochód.',
        'Srebro nie jest jedynym metalem, który walczy z zarazkami. Miedź też. Wypróbuj oba na szalce.',
        'Szczypta srebra w wodzie jest bezpieczna, ale nigdy nie połykaj sklepowych tabletek ani kropli ze srebrem. Za dużo przez zbyt długi czas może zabarwić skórę na niebiesko-szaro.',
      ],
      sci: [
        'Rosyjski SRV-K zamienia skropliny wilgoci z kabiny w wodę pitną: wielostopniowa filtracja, minerały, jonizator dodający 0,05 do 0,20 mg/L srebra i pasteryzacja w 85 °C (Steele i in., NASA).',
        'NASA w swoim segmencie używa jodu. Dla Oriona i misji poza orbitą Ziemi wybrała srebro, do 400 µg/L, czyli najwięcej, na ile pozwalają jej wymagania.',
        'Srebro nie jest niezwyciężone: chlorki, siarczki i materia organiczna wiążą Ag⁺, osadza się ono na metalowych rurach, a niektóre bakterie są na nie odporne albo je wypompowują.',
        'Zarazek na stanowisku 3 to pałeczka długa na około 2 µm, narysowana jako 3 m, czyli około 1,5 miliona razy większa. Argyria, trwałe niebiesko-szare zabarwienie skóry, bierze się z długiego połykania srebra.',
      ],
    },
    leave: {
      kid: 'Zanim pójdziesz: szczypta srebra w wodzie pitnej jest bezpieczna, ale proszę, nigdy nie połykaj tabletek ani kropli ze srebrem „dla zdrowia”. Najpierw zapytaj lekarza!',
      sci: 'Zanim pójdziesz: srebro dozuje się w mikrogramach na litr i mierzy. Długie połykanie srebra może trwale zabarwić skórę na niebiesko-szaro (argyria), więc nie jest suplementem.',
    },
    water: {
      label: 'Woda z oddechu',
      title: 'Maszyna do wody',
      tags: { breath: 'oddech', condenser: 'zimne płyty', tank: 'zbiornik', filters: 'filtry', ionizer: 'komora srebra', heater: '85 °C', bag: 'do picia', lens: 'zarazki' },
      hints: {
        breath: 'Dotknij oddechu astronauty',
        fill: 'Patrz, jak napełnia się zbiornik',
        filter: 'Dotknij filtrów',
        silver: 'Dotknij komory srebra',
        heat: 'Dotknij podgrzewacza',
        bag: 'Dotknij woreczka do picia',
        done: 'Zsuń srebro do zera i patrz na zarazki',
      },
      slider: 'Dodane srebro',
      buttons: { breath: 'Wydech', filter: 'Przepuść przez filtry', silver: 'Dodaj srebro', heat: 'Podgrzej do 85 °C', bag: 'Napełnij woreczek do picia', reset: 'Zacznij od nowa' },
      rows: { tank: 'Zbiornik', clean: 'Przefiltrowana', silver: 'Srebro', hot: 'Spasteryzowana' },
      vals: { empty: 'pusty', full: 'pełny', no: 'jeszcze nie', yes: 'tak' },
      lens: { day: 'Dzień', growing: 'rosną', stopped: 'stoją', note: 'model' },
      says: {
        breath: 'Każdy oddech i każda kropla potu robi powietrze w kabinie trochę wilgotnym. Wentylator pędzi je nad zimne płyty, gdzie zamienia się w krople.',
        filled: 'Zbiornik jest pełen wody, która minutę temu była oddechem. Jeszcze pachnie i ma w sobie paprochy, więc musi przejść przez filtry.',
        noWater: 'Nie ma jeszcze wody! Najpierw zrób wydech.',
        filter: 'Węgiel, żywica i katalizator wyłapują brud i zapach. Teraz woda jest czysta. Ale czysta to nie to samo co bez zarazków.',
        silver0: 'Bez srebra: spójrz na małą lupę. Każdy zarazek, który się tu dostanie, będzie się podwajał i podwajał przez cały tydzień.',
        silverLow: 'Trochę srebra, ale jeszcze za mało. Zarazki w lupie nadal rosną.',
        silverOk: 'Przy tylu srebra zarazki w lupie przestają rosnąć. Stacja używa od 0,05 do 0,2 miligrama na litr.',
        silverMax: 'To najwięcej, ile używa stacja: bardzo, bardzo mała szczypta.',
        heat: 'Podgrzewacz ogrzewa wodę do 85 stopni, żeby dobić zarazki, które jeszcze zostały.',
        notYet: 'Jeszcze nie! Woda musi być najpierw przefiltrowana, dostać szczyptę srebra i zostać podgrzana.',
        bag: 'Z woreczka wypływa kula wody, drżąca jak galaretka. Na zdrowie, astronauci: oddech, filtry, srebro i ciepło, a teraz łyk wody!',
        lookGrowing: 'Z dnia na dzień zarazki się podwajają. Bez srebra (albo z za małą ilością) tydzień wystarczy na cały tłum.',
        lookStopped: 'Jony srebra zacinają zarazki i ich liczba zostaje maleńka. Tak woda zostaje świeża dla załogi.',
        lookEmpty: 'Zbiornik jest pusty, więc nie ma jeszcze na co patrzeć.',
        reset: 'Zbiornik jest opróżniony, a maszyna znowu gotowa.',
      },
      panel: {
        kid: [
          'Na stacji kosmicznej każda kropla wody jest cenna, bo wyniesienie jej w kosmos kosztuje dużo. Dlatego rosyjska maszyna do wody zbiera wilgoć z oddechu i potu astronautów, schładza ją w krople, oczyszcza, dodaje szczyptę srebra i podgrzewa. Wtedy można ją pić.',
          'Zrób to po kolei: dotknij oddechu, potem filtrów, potem komory srebra, potem podgrzewacza i na końcu woreczka do picia. Potem zsuń srebro do zera i patrz na małą lupę: bez srebra zarazki rosłyby przez cały tydzień.',
        ],
        sci: [
          'Segment rosyjski, SRV-K (Steele i in., NASA): skropliny wilgoci przechodzą przez złoże wielofiltracyjne (węgiel aktywny, żywice jonowymienne, katalizator), kontrolę przewodności (poniżej 150 µS/cm), złoże kondycjonujące dodające magnez, wapń i inne minerały oraz jonizator srebra dodający 0,05 do 0,20 mg/L do kontroli mikrobiologicznej. Przed wydaniem woda jest pasteryzowana w 85 °C w regeneracyjnym wymienniku ciepła. Sala pokazuje to jako obieg wokół jednego zbiornika, dla uproszczenia.',
          'Lupa to model: zarazki podwajają się raz na dobę (prawdziwe bakterie mogą dzielić się w mniej niż godzinę). Przy 0,05 mg/L i więcej wzrost w modelu się zatrzymuje, to dolny kraniec zakresu stacji. Prawdziwa woda jest trudniejsza: chlorki, azotany, siarczany i materia organiczna wiążą Ag⁺ i osłabiają jego działanie, srebro osadza się na metalowych powierzchniach, a niektóre bakterie są na nie odporne.',
          'Segment NASA używa jodu (1 do 4 ppm), który nie łączy się ze srebrem i przed piciem w długich lotach trzeba go usuwać. Dla Oriona NASA wybrała srebro w dawce 400 µg/L, czyli najwięcej, na ile pozwalają jej wymagania.',
        ],
      },
    },
    dish: {
      label: 'Szalka z zarazkami',
      title: 'Szalka z zarazkami w dużym rozmiarze',
      tags: { silver: 'srebrna moneta', copper: 'miedziana moneta', button: 'plastikowy guzik', plaster: 'plaster ze srebrem' },
      hours: 'godz.',
      hints: { place: 'Dotknij czegoś, żeby położyć to na galaretce', grow: 'Dotknij szalki, żeby upłynął czas', ring: 'Dotknij czystego kręgu, żeby przyjrzeć się z bliska', more: 'Połóż na galaretce coś jeszcze', done: 'Przesuwaj godziny w tę i z powrotem' },
      slider: 'Upływający czas',
      buttons: { day: 'Niech minie 6 godzin', clear: 'Zdejmij wszystko' },
      rows: { hours: 'Czas', placed: 'Na galaretce' },
      none: 'nic',
      says: {
        silver: 'Srebrna moneta na galaretce. Mokre srebro powoli uwalnia jony srebra do galaretki. Teraz poczekaj i zobacz.',
        copper: 'Miedziana moneta. Miedź też walczy z zarazkami, więc jestem ciekawy, co zrobi.',
        button: 'Plastikowy guzik: nie ma w nim metalu. To próba, która pokazuje, co robi rzecz, która nic nie robi.',
        plaster: 'Plaster z opatrunkiem ze srebra, taki jak na oparzenia i rany.',
        take: 'Zdjęte z galaretki. Zarazki powoli wrócą.',
        firstWait: 'Wszystko jest zasiane zarazkami, na razie to maleńkie kropki. Dotknij szalki albo przesuń czas, a urosną.',
        grown: 'Cały dywan zarazków! Ale spójrz na czyste kręgi wokół metali. A guzik ma zarazki aż do samej krawędzi.',
        needItem: 'Najpierw połóż na galaretce monetę albo plaster.',
        ringSilver: 'Jony srebra rozchodzą się z monety w galaretkę. Blisko niej jest ich dużo, daleko tylko kilka.',
        ringCopper: 'Jony miedzi rozchodzą się z monety tak samo i też walczą z zarazkami.',
        ringPlaster: 'Srebrny opatrunek uwalnia jony srebra i wokół niego powstaje czysty krąg.',
        ringButton: 'Z guzika nic nie wychodzi, więc zarazki go dotykają. Dlatego jest w próbie.',
        ringAny: 'Krąg kończy się tam, gdzie jonów jest za mało, żeby powstrzymać zarazki.',
      },
      lens: { silver: 'jony srebra', copper: 'jony miedzi', plaster: 'jony srebra', button: 'nic nie wychodzi', enough: 'dość, by zatrzymać zarazki', zone: 'czysty krąg' },
      panel: {
        kid: [
          'Tak naukowcy badają metal: rozsmarowują zarazki po galaretce na szalce (szalka Petriego, tu szeroka na 2 m), kładą na niej różne rzeczy i czekają. Zarazki rosną w gęsty dywan, ale tam, gdzie coś z nimi walczy, zostaje czysty, pusty krąg.',
          'Dotknij czegoś, żeby położyć to na galaretce, potem dotknij szalki albo przesuń czas. Srebro i miedź robią czysty krąg. Plastikowy guzik nie robi żadnego: zarazki rosną aż do niego. Dotknij kręgu, żeby przyjrzeć się z bliska: krąg kończy się tam, gdzie drobinki rozchodzące się w galaretce są już za nieliczne, by powstrzymać zarazki.',
        ],
        sci: [
          'Test dyfuzji w agarze (strefa zahamowania wzrostu): płytkę zaszczepia się bakteriami i kładzie na agarze próbkę. Metal powoli uwalnia jony (Ag⁺, Cu²⁺), które rozchodzą się w żelu; tam, gdzie stężenie jest dość duże, dywan nie rośnie, a czysta strefa kończy się tam, gdzie stężenie spada poniżej tego poziomu.',
          'Sala nie podaje rozmiarów kręgów: zależą od szalki, zarazka, żelu i godzin. Krąg otwiera się szybko, a potem zwalnia, jak dyfuzja, i widać go dopiero po wzroście dywanu. Miedź jest na szalce, bo też działa przeciwdrobnoustrojowo; plastikowy guzik jest próbą kontrolną, bez jonów.',
        ],
      },
    },
    germ: {
      label: 'Wewnątrz zarazka',
      title: 'Jeden zarazek, 1,5 miliona razy większy',
      tags: { ion: 'jon srebra' },
      hints: { first: 'Dotknij jonu srebra', more: 'Dotknij następnego jonu srebra', cannot: 'Dotknij starej buteleczki na półce', done: 'Obmyj go w panelu, żeby zacząć od nowa' },
      slider: 'Srebro w wodzie',
      line: 'zatrzymuje od około 50',
      buttons: { wash: 'Zmyj srebro' },
      board: { count: 'Podziały', dividing: 'Dzieli się', slowing: 'Zwalnia', stopped: 'Nie może się dzielić', machines: 'Kręcące się maszyny' },
      says: {
        first: 'Jon srebra podpływa i chwyta siarkę w skórze zarazka. Maleńka maszyna obok się zacina. O jedną maszynę mniej!',
        second: 'Dwie maszyny stanęły. Zarazek dzieli się wolniej.',
        third: 'Trzy stanęły i skóra zaczyna przeciekać.',
        fourth: 'Cztery stanęły! Zarazek ma za mało działających maszyn, żeby się dzielić. Nie może już rosnąć.',
        more: 'Zacięła się kolejna maszyna i przecieki są większe.',
        all: 'Wszystkie maszyny są zacięte. Zarazek stanął.',
        none: 'Wszystkie jony są już na zarazku.',
        wash: 'Woda jest przemyta, jony puszczają i zarazek rusza znowu.',
        line: 'Za kreską srebra w wodzie wystarcza, by zacięły się maszyny i zarazek stanął.',
        under: 'Poniżej kreski srebra jest za mało: zarazek dzieli się dalej.',
      },
      panel: {
        kid: [
          'To jeden zarazek, powiększony około półtora miliona razy: pałeczka długa jak mały samochód, unosząca się w kuli wody. Kręcące się kółka to jego maszyny z białek, wytwarzają energię potrzebną do życia i do podziału na dwa. Żółte kropki to siarka w jego skórze.',
          'Dotknij jonu srebra, który się unosi. Podpłynie, chwyci siarkę i zatnie maszynę obok. Po czterech jonach zarazek ma za mało działających maszyn: skóra przecieka i nie może się już podzielić na dwa.',
        ],
        sci: [
          'Model: bakteria pałeczkowata o długości około 2 µm narysowana jako 3 m (1,5 miliona razy). Ag⁺ wiąże grupy tiolowe (−SH) enzymów i białek błonowych, zaburza oddychanie komórki w jej błonie, rozszczelnia błonę i wiąże DNA (efekt oligodynamiczny Nägelego, 1893). Sala pokazuje tylko pierwsze kroki; cztery z siedmiu zaciętych maszyn zatrzymują tu podział, z reguły samej sali.',
          'Suwak: dziesiątki mikrogramów na litr zatrzymują wiele bakterii. W tym modelu kreska to 50 µg/L, dolny kraniec zakresu stacji 0,05 do 0,20 mg/L. Wartości prawdziwe zależą od gatunku, wody i czasu: chlorki i materia organiczna wiążą srebro, a niektóre zarazki je wypompowują albo są na nie odporne.',
        ],
      },
    },
    crede: {
      label: 'Stara buteleczka',
      title: 'Krople Credégo, 1880',
      tag: '1880',
      hint: 'Dotknij starej buteleczki',
      says: {
        first: 'Ta buteleczka to model takiej, jakiej używał Credé. Jedna kropla srebra i oczy dziecka były bezpieczne.',
        again: 'Credé nie wiedział, jak działa srebro. Widział, że działa.',
      },
      panel: {
        kid: [
          'W 1880 roku w Lipsku lekarz Carl Credé zaczął wkraplać każdemu dziecku zaraz po urodzeniu jedną kroplę słabego roztworu srebra do oczu. Niektóre mamy miały zarazek, który powodował u niemowląt zapalenie oczu i mógł je oślepić. Przed kroplami chorowało około jedno dziecko na dziesięć. Po kroplach prawie żadne.',
          'Szpitale używały takich kropli przez około sto lat, aż zastąpiły je maści z antybiotykiem. (Ta buteleczka to model takiej buteleczki; nie pokazujemy tu żadnego dziecka.)',
        ],
        sci: [
          'Profilaktyka Credégo: od 1 czerwca 1880 roku w lipskiej klinice położniczej kropla roztworu azotanu srebra (około 2%) do oczu każdego noworodka; opublikował ją w 1881. Rzeżączkowe zapalenie oczu noworodków spadło z około 10% porodów (9,8% w jego własnym sprawozdaniu) do wyraźnie poniżej 1% (0,1 do 0,5% w kolejnych seriach).',
          'Krople z azotanem srebra używano w wielu krajach, aż zastąpiły je maści z antybiotykiem, miejscami od lat 80. XX wieku. Podrażniają oko, więc później stosowano słabszy roztwór (1%). Credé nie znał mechanizmu: wiązanie grup tiolowych w białkach zarazka odkryto później.',
        ],
      },
    },
  },
  de: {
    title: 'Im Innern der Raumstation',
    greet: {
      kid: 'Wir sind im Bild, im russischen Teil der Internationalen Raumstation, und kreisen um die Erde! Hier wiegt nichts etwas, deshalb schweben Tropfen und Stifte, und Klettschuhe halten uns am Boden. Schau aus dem Fenster. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Im russischen Segment der Internationalen Raumstation, rund 400 km hoch, ein Umlauf alle 92 Minuten (die Sonne ist hier beschleunigt). Schwerelos: Tropfen schweben, Klettschuhe halten dich am Boden. Drei Stationen: die Wassermaschine, eine Keimschale und ein einzelner Keim in 1,5-millionenfacher Vergrößerung. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Astronauten trinken Wasser, das aus ihrem eigenen Atem gemacht ist, und eine Prise Silber hält es frisch. Mein Silber, im Weltraum bei der Arbeit!',
        'Ein Silberion sieht man nicht, einen Keim auch nicht. Darum ist dieser Raum ein Riesenmodell: Der Keim ist so lang wie ein kleines Auto.',
        'Silber ist nicht das einzige Metall, das Keime bekämpft. Kupfer auch. Probiere beide in der Schale aus.',
        'Eine Prise Silber im Wasser ist sicher, aber schluck nie Silberpillen oder Silbertropfen aus dem Laden. Zu viel über zu lange Zeit kann die Haut blaugrau färben.',
      ],
      sci: [
        'Das russische SRV-K macht aus dem Kondensat der Kabinenfeuchte Trinkwasser: Mehrfachfiltration, Mineralien, ein Ionisator, der 0,05 bis 0,20 mg/L Silber zusetzt, dann Pasteurisieren bei 85 °C (Steele et al., NASA).',
        'Die NASA nimmt in ihrem Segment Jod. Für Orion und für Missionen über die Erdumlaufbahn hinaus wählte sie Silber, bis zu 400 µg/L, den höchsten Wert, den ihre Vorgaben erlauben.',
        'Silber ist nicht unbesiegbar: Chlorid, Sulfid und organische Stoffe binden Ag⁺, es lagert sich an Metallrohren ab, und manche Bakterien sind widerstandsfähig oder pumpen es hinaus.',
        'Der Keim an Station 3 ist ein Stäbchen von etwa 2 µm, auf 3 m gezeichnet, also rund 1,5 Millionen Mal größer. Argyrie, eine dauerhaft blaugraue Haut, kommt vom langen Schlucken von Silber.',
      ],
    },
    leave: {
      kid: 'Bevor du gehst: Eine winzige Prise Silber im Trinkwasser ist sicher, aber schluck bitte nie Silberpillen oder -tropfen, „um gesund zu bleiben“. Frag zuerst einen Arzt!',
      sci: 'Bevor du gehst: Silber wird in Mikrogramm pro Liter dosiert und gemessen. Langes Schlucken von Silber kann die Haut dauerhaft blaugrau färben (Argyrie), es ist also kein Nahrungsergänzungsmittel.',
    },
    water: {
      label: 'Wasser aus dem Atem',
      title: 'Die Wassermaschine',
      tags: { breath: 'Atem', condenser: 'kalte Platten', tank: 'Tank', filters: 'Filter', ionizer: 'Silberzelle', heater: '85 °C', bag: 'Trinken', lens: 'Keime' },
      hints: {
        breath: 'Tippe auf den Atem des Astronauten',
        fill: 'Sieh zu, wie sich der Tank füllt',
        filter: 'Tippe auf die Filter',
        silver: 'Tippe auf die Silberzelle',
        heat: 'Tippe auf den Erhitzer',
        bag: 'Tippe auf den Trinkbeutel',
        done: 'Schiebe das Silber auf null und sieh dir die Keime an',
      },
      slider: 'Zugesetztes Silber',
      buttons: { breath: 'Ausatmen', filter: 'Durch die Filter leiten', silver: 'Silber zugeben', heat: 'Auf 85 °C erhitzen', bag: 'Trinkbeutel füllen', reset: 'Von vorn beginnen' },
      rows: { tank: 'Tank', clean: 'Gefiltert', silver: 'Silber', hot: 'Pasteurisiert' },
      vals: { empty: 'leer', full: 'voll', no: 'noch nicht', yes: 'ja' },
      lens: { day: 'Tag', growing: 'wachsen', stopped: 'gestoppt', note: 'ein Modell' },
      says: {
        breath: 'Jeder Atemzug und jeder Tropfen Schweiß macht die Kabinenluft ein wenig feucht. Der Ventilator schickt sie über kalte Platten, wo sie zu Tropfen wird.',
        filled: 'Der Tank ist voll mit Wasser, das vor einer Minute noch Atem war. Es riecht noch und hat Krümel, darum muss es durch die Filter.',
        noWater: 'Es gibt noch kein Wasser! Atme zuerst aus.',
        filter: 'Kohle, Harz und ein Katalysator fangen Schmutz und Geruch. Jetzt ist das Wasser klar. Aber klar heißt nicht keimfrei.',
        silver0: 'Ohne Silber: Sieh in die kleine Lupe. Jeder Keim, der hineingerät, würde sich eine ganze Woche lang verdoppeln und verdoppeln.',
        silverLow: 'Ein wenig Silber, aber noch nicht genug. Die Keime in der Lupe wachsen weiter.',
        silverOk: 'Mit so viel Silber hören die Keime in der Lupe auf zu wachsen. Die Station nimmt zwischen 0,05 und 0,2 Milligramm in einem Liter.',
        silverMax: 'Das ist das Meiste, was die Station nimmt: eine sehr, sehr kleine Prise.',
        heat: 'Der Erhitzer bringt das Wasser auf 85 Grad, um übrig gebliebene Keime zu erledigen.',
        notYet: 'Noch nicht! Das Wasser muss erst gefiltert werden, seine Prise Silber bekommen und erhitzt werden.',
        bag: 'Eine Wasserkugel schwebt aus dem Beutel und zittert wie Wackelpudding. Prost, Astronauten: Atem, Filter, Silber und Hitze, und jetzt ein Schluck!',
        lookGrowing: 'Tag für Tag verdoppeln sich die Keime. Ohne Silber (oder mit zu wenig) reicht eine Woche für eine ganze Menge.',
        lookStopped: 'Die Silberionen blockieren die Keime, und die Zahl bleibt winzig. So bleibt das Wasser für die Crew frisch.',
        lookEmpty: 'Der Tank ist leer, es gibt also noch nichts zu sehen.',
        reset: 'Der Tank ist geleert und die Maschine wieder bereit.',
      },
      panel: {
        kid: [
          'Auf der Raumstation ist jeder Tropfen Wasser kostbar, denn ihn hochzuschießen kostet viel. Darum sammelt die russische Wassermaschine die Feuchtigkeit aus dem Atem und Schweiß der Astronauten, kühlt sie zu Tropfen, reinigt sie, gibt eine Prise Silber dazu und erhitzt sie. Dann kann man sie trinken.',
          'Mach es der Reihe nach: Tippe auf den Atem, dann auf die Filter, dann auf die Silberzelle, dann auf den Erhitzer und zuletzt auf den Trinkbeutel. Schieb dann das Silber auf null und sieh dir die kleine Lupe an: Ohne Silber würden die Keime die ganze Woche wachsen.',
        ],
        sci: [
          'Russisches Segment, SRV-K (Steele et al., NASA): Das Kondensat der Luftfeuchte durchläuft ein Mehrfachfilterbett (Aktivkohle, Ionenaustauscherharze, ein Katalysator), eine Leitfähigkeitskontrolle (unter 150 µS/cm), ein Konditionierbett, das Magnesium, Calcium und weitere Mineralien zusetzt, und einen Silberionisator, der 0,05 bis 0,20 mg/L zur mikrobiellen Kontrolle zugibt. Vor der Ausgabe wird es bei 85 °C in einem regenerativen Wärmetauscher pasteurisiert. Der Raum zeigt das als Kreislauf um einen einzigen Tank, eine Vereinfachung zum Lernen.',
          'Die Lupe ist ein Modell: Keime, die sich einmal am Tag verdoppeln (echte Bakterien können sich in unter einer Stunde teilen). Ab 0,05 mg/L stoppt im Modell das Wachstum, das untere Ende des Bereichs der Station. Echtes Wasser ist schwieriger: Chlorid, Nitrat, Sulfat und organische Stoffe binden Ag⁺ und mindern seine Wirkung, Silber lagert sich an Metalloberflächen ab, und manche Bakterien sind widerstandsfähig.',
          'Das NASA-Segment nimmt Jod (1 bis 4 ppm), das sich nicht mit Silber verträgt und bei langen Flügen vor dem Trinken entfernt werden muss. Für Orion wählte die NASA Silber mit 400 µg/L, dem höchsten Wert, den ihre Vorgaben erlauben.',
        ],
      },
    },
    dish: {
      label: 'Die Keimschale',
      title: 'Eine Keimschale, ganz groß',
      tags: { silver: 'Silbermünze', copper: 'Kupfermünze', button: 'Plastikknopf', plaster: 'Pflaster mit Silber' },
      hours: 'Std.',
      hints: { place: 'Tippe auf etwas, um es auf das Gelee zu legen', grow: 'Tippe auf die Schale, damit Zeit vergeht', ring: 'Tippe auf einen freien Ring, um genauer hinzusehen', more: 'Leg noch etwas auf das Gelee', done: 'Schiebe die Stunden hin und her' },
      slider: 'Vergehende Zeit',
      buttons: { day: '6 Stunden vergehen lassen', clear: 'Alles herunternehmen' },
      rows: { hours: 'Zeit', placed: 'Auf dem Gelee' },
      none: 'nichts',
      says: {
        silver: 'Eine Silbermünze auf dem Gelee. Nasses Silber gibt langsam Silberionen ins Gelee ab. Jetzt warte und sieh zu.',
        copper: 'Eine Kupfermünze. Kupfer bekämpft auch Keime, ich bin gespannt, was sie tut.',
        button: 'Ein Plastikknopf: Er enthält kein Metall. Er ist der Test, der zeigt, was etwas tut, das nichts tut.',
        plaster: 'Ein Pflaster mit Silberpolster, wie man es für Verbrennungen und Wunden nimmt.',
        take: 'Vom Gelee genommen. Die Keime kriechen langsam zurück.',
        firstWait: 'Alles ist mit Keimen besät, im Moment winzige Punkte. Tippe auf die Schale oder schiebe die Zeit, dann wachsen sie.',
        grown: 'Ein ganzer Keimrasen! Aber sieh die freien Ringe um die Metalle. Und am Knopf sitzen die Keime bis direkt an den Rand.',
        needItem: 'Leg zuerst eine Münze oder ein Pflaster auf das Gelee.',
        ringSilver: 'Silberionen breiten sich von der Münze ins Gelee aus. Nah an ihr sind es viele, weit weg nur wenige.',
        ringCopper: 'Kupferionen breiten sich genauso von der Münze aus und bekämpfen auch Keime.',
        ringPlaster: 'Das Silberpolster gibt Silberionen ab, und der freie Ring bildet sich um es herum.',
        ringButton: 'Aus dem Knopf kommt nichts heraus, darum berühren ihn die Keime. Deshalb ist er im Test.',
        ringAny: 'Der Ring endet dort, wo es zu wenige Ionen gibt, um die Keime zu stoppen.',
      },
      lens: { silver: 'Silberionen', copper: 'Kupferionen', plaster: 'Silberionen', button: 'nichts kommt heraus', enough: 'genug, um Keime zu stoppen', zone: 'freier Ring' },
      panel: {
        kid: [
          'So testen Forscher ein Metall: Sie streichen Keime auf ein Gelee in einer Schale (eine Petrischale, hier 2 m breit), legen die Dinge darauf und warten. Die Keime wachsen zu einem dichten Rasen, aber wo etwas sie bekämpft, bleibt ein freier, leerer Ring.',
          'Tippe auf etwas, um es auf das Gelee zu legen, dann auf die Schale oder schiebe die Zeit. Silber und Kupfer machen einen freien Ring. Der Plastikknopf macht keinen: Die Keime wachsen bis direkt an ihn. Tippe auf einen Ring, um genauer hinzusehen: Der Ring endet dort, wo die winzigen Teilchen, die sich im Gelee ausbreiten, zu wenige sind, um die Keime zu stoppen.',
        ],
        sci: [
          'Der Agardiffusionstest (Hemmhof): Eine Platte wird mit Bakterien beimpft und eine Probe auf den Agar gelegt. Ein Metall gibt langsam Ionen ab (Ag⁺, Cu²⁺), die sich im Gel ausbreiten; wo die Konzentration hoch genug ist, wächst der Rasen nicht, und der freie Hof endet dort, wo sie unter diesen Wert fällt.',
          'Der Raum nennt keine Ringgrößen: Sie hängen von der Schale, dem Keim, dem Gel und den Stunden ab. Der Ring öffnet sich schnell und wird dann langsamer, wie bei der Diffusion, und er zeigt sich erst, wenn der Rasen gewachsen ist. Kupfer liegt in der Schale, weil es auch antimikrobiell wirkt; der Plastikknopf ist die Kontrolle ohne Ionen.',
        ],
      },
    },
    germ: {
      label: 'Im Innern eines Keims',
      title: 'Ein Keim, 1,5 Millionen Mal größer',
      tags: { ion: 'Silberion' },
      hints: { first: 'Tippe auf ein Silberion', more: 'Tippe auf ein weiteres Silberion', cannot: 'Tippe auf das alte Fläschchen im Regal', done: 'Wasche es im Panel ab, um von vorn zu beginnen' },
      slider: 'Silber im Wasser',
      line: 'stoppt ab etwa 50',
      buttons: { wash: 'Silber abwaschen' },
      board: { count: 'Teilungen', dividing: 'Teilt sich', slowing: 'Wird langsamer', stopped: 'Kann sich nicht teilen', machines: 'Maschinen laufen' },
      says: {
        first: 'Ein Silberion schwebt heran und packt einen Schwefel in der Haut des Keims. Die kleine Maschine daneben klemmt. Eine Maschine weniger!',
        second: 'Zwei Maschinen stehen. Der Keim teilt sich langsamer.',
        third: 'Drei stehen, und die Haut beginnt zu lecken.',
        fourth: 'Vier stehen! Der Keim hat zu wenige laufende Maschinen, um sich zu teilen. Er kann nicht mehr wachsen.',
        more: 'Noch eine Maschine klemmt, und die Lecks werden größer.',
        all: 'Alle Maschinen klemmen. Der Keim steht still.',
        none: 'Alle Ionen sind schon am Keim.',
        wash: 'Das Wasser ist gewaschen, die Ionen lassen los, und der Keim läuft wieder an.',
        line: 'Über dem Strich reicht das Silber im Wasser, um die Maschinen zu blockieren und den Keim zu stoppen.',
        under: 'Unter dem Strich ist zu wenig Silber: Der Keim teilt sich weiter.',
      },
      panel: {
        kid: [
          'Das ist ein einziger Keim, etwa anderthalb Millionen Mal vergrößert: ein Stäbchen, so lang wie ein kleines Auto, das in einer Wasserkugel schwebt. Die drehenden Räder sind seine Eiweißmaschinen, sie machen die Energie, die er zum Leben und zum Teilen in zwei braucht. Die gelben Punkte sind Schwefel in seiner Haut.',
          'Tippe auf ein Silberion, das vorbeischwebt. Es treibt hinein, packt einen Schwefel und blockiert die Maschine daneben. Nach vier Ionen laufen zu wenige Maschinen: Die Haut leckt, und der Keim kann sich nicht mehr in zwei teilen.',
        ],
        sci: [
          'Das Modell: ein stäbchenförmiges Bakterium von etwa 2 µm, auf 3 m gezeichnet (1,5 Millionen Mal). Ag⁺ bindet die Thiolgruppen (−SH) von Enzymen und Membranproteinen, stört die Atmung der Zelle in ihrer Membran, macht die Membran undicht und bindet DNA (Nägelis oligodynamischer Effekt, 1893). Der Raum zeigt nur die ersten Schritte; vier von sieben blockierten Maschinen stoppen hier die Teilung, nach der Regel des Raums selbst.',
          'Der Regler: Zehn Mikrogramm pro Liter und mehr stoppen viele Bakterien. In diesem Modell liegt der Strich bei 50 µg/L, dem unteren Ende der 0,05 bis 0,20 mg/L der Station. Echte Werte hängen von Art, Wasser und Zeit ab: Chlorid und organische Stoffe binden Silber, und manche Keime pumpen es hinaus oder sind widerstandsfähig.',
        ],
      },
    },
    crede: {
      label: 'Das alte Fläschchen',
      title: 'Credés Tropfen, 1880',
      tag: '1880',
      hint: 'Tippe auf das alte Fläschchen',
      says: {
        first: 'Dieses Fläschchen ist ein Modell der Art, die Credé benutzte. Ein Tropfen Silber, und die Augen des Babys waren sicher.',
        again: 'Credé wusste nicht, wie Silber wirkt. Er sah, dass es wirkte.',
      },
      panel: {
        kid: [
          '1880 begann der Arzt Carl Credé in Leipzig, jedem Baby gleich nach der Geburt einen Tropfen einer schwachen Silberlösung in die Augen zu träufeln. Manche Mütter trugen einen Keim, der die Augen der Babys entzündete und sie erblinden lassen konnte. Vor den Tropfen bekam ihn etwa jedes zehnte Baby. Nach den Tropfen fast keines.',
          'Krankenhäuser benutzten Tropfen wie seine etwa hundert Jahre lang, bis antibiotische Salben sie ablösten. (Dieses Fläschchen ist ein Modell eines solchen Fläschchens; hier wird kein Baby gezeigt.)',
        ],
        sci: [
          'Credés Prophylaxe: ab dem 1. Juni 1880 in der Leipziger Entbindungsklinik ein Tropfen Silbernitratlösung (etwa 2 %) in die Augen jedes Neugeborenen; er veröffentlichte sie 1881. Die gonokokkenbedingte Augenentzündung der Neugeborenen sank von etwa 10 % der Geburten (9,8 % in seinem eigenen Bericht) auf deutlich unter 1 % (0,1 bis 0,5 % in den folgenden Reihen).',
          'Silbernitrattropfen blieben in vielen Ländern in Gebrauch, bis antibiotische Salben sie ersetzten, teils erst seit den 1980er-Jahren. Sie reizen das Auge, darum nahm man später eine schwächere Lösung (1 %). Credé kannte den Mechanismus nicht: die Bindung an Thiolgruppen in den Eiweißen des Keims wurde später verstanden.',
        ],
      },
    },
  },
}
