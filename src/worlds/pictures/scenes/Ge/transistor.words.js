// The words of germanium's transistor room ("How was the first transistor made?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Ge.js (the easel shows it); the room is Bell Labs at Murray Hill on a snowy evening in
// December 1947 and adds the things to do: build the device (gold foil, razor, spring), speak through it
// (a microphone, a battery, headphones, a scope), and set a tube radio beside a pocket radio.
// Sources: Riordan and Hoddeson, Crystal Fire (1997); Computer History Museum, "1947: Invention of the
// Point-Contact Transistor" (polystyrene wedge, gold foil, razor slit, contacts about 50 micrometres apart,
// the first power gain on 16 December 1947, speech on 23 December); the announcement of 30 June 1948; the name
// from John R. Pierce's "transfer resistor"; the Nobel Prize in Physics 1956 (Bardeen, Brattain, Shockley).
// Doubtful, said with "about": the gap (often "two thousandths of an inch"), a tube set's warm-up (about
// half a minute) and power (about 40 W for a five-tube table set; heaters of about 2 W each, 6.3 V at 0.3 A),
// the Regency TR-1 (1954, four germanium transistors made by Texas Instruments; its width about 13 cm and
// "under a watt" are rounded). The spring is often said to be a bent paper clip: the room never claims it.
// No gain figure anywhere: sources differ, so the waves are drawn and no number is given. No words are put
// in the mouths of Bardeen, Brattain, Shockley or Pierce.
const S = (kid, sci) => ({ kid, sci })

export const TRANSISTOR_WORDS = {
  en: {
    title: 'Bell Labs, December 1947',
    greet: S(
      "We are inside the picture: a laboratory at Bell Labs in New Jersey, on a snowy evening just before Christmas 1947. Two scientists here are about to show that a small crystal can do the job of a glowing glass tube. The picture's story is on the easel.",
      "Bell Telephone Laboratories, Murray Hill, New Jersey, a snowy evening in December 1947: deal benches, a tube oscilloscope, racks of tube amplifiers, and on the bench the point-contact transistor. The picture's story is on the easel.",
    ),
    talk: {
      kid: [
        'John Bardeen and Walter Brattain worked in a team led by William Shockley. Bardeen was the one who worked out, with pencil and paper, what happens at the surface of a crystal. Brattain was the one with the clever hands.',
        'Why two points of gold, so close together? The first point sends a little electricity into the crystal, and it reaches the second point, which carries a much bigger current. That only works when the points are closer than the thickness of a sheet of paper.',
        'The name "transistor" came from a colleague, John Pierce, who put together "transfer" and "resistor".',
        'They used germanium because, during the war, people had learned to make it purer than any other crystal like it, for radar. Germanium is still used today, for lenses in cameras that see heat.',
      ],
      sci: [
        "Bardeen (theory) and Brattain (experiment) worked in Shockley's solid-state physics group. Bardeen's idea of surface states, electrons trapped at the germanium's surface, explained why a field alone had not worked; the point-contact device grew out of those experiments.",
        'The gain: holes injected at the emitter contact travel the roughly 50 µm to the collector contact, where they raise its current far more than the emitter current changed. Brattain and Bardeen saw it on 16 December 1947 and showed it to Bell Labs managers on 23 December.',
        'The public heard of it on 30 June 1948. John R. Pierce had proposed the name, from "transfer resistor"; Bell Labs staff chose it in a ballot. Bardeen, Brattain and Shockley shared the 1956 Nobel Prize in Physics.',
        "Germanium came first because wartime work on radar detectors had taught how to make it purer than any other semiconductor. Why silicon won in the end is told in silicon's valley room.",
      ],
    },
    calendar: 'DECEMBER 1947',
    tags: { foil: 'gold foil', razor: 'razor blade', spring: 'spring', ge: 'germanium', base: 'metal base', mic: 'microphone', battery: 'battery', phones: 'headphones', scope: 'oscilloscope', tube: 'tube radio', pocket: 'pocket radio' },
    lens: {
      title: S('Through the magnifying glass', 'Magnified view'),
      caption: {
        plastic: S('A plastic triangle, up close', 'The polystyrene wedge, magnified'),
        foil: S('Gold foil wrapped over the tip: one long strip', 'Foil over the edge: one continuous contact'),
        gap: S('The slit: two gold points, close together', 'Two contacts about 50 µm apart'),
        one: S('Pressed down: only one point', 'One contact: no separate emitter and collector'),
        two: S('Two gold points on the germanium', 'Emitter and collector on n-type germanium'),
      },
      gap: S('about 50 µm', '50 µm'),
      paper: S('a sheet of paper', 'paper, about 100 µm'),
      emitter: S('first point', 'emitter'),
      collector: S('second point', 'collector'),
      ge: S('germanium', 'n-type germanium'),
      holes: S('holes', 'holes (+)'),
      in: S('small signal in', 'signal in'),
      out: S('big signal out', 'signal out'),
      note: S('Not to scale: the atoms are much, much smaller.', 'Not to scale: the gap is about 200 000 bond lengths (0.245 nm) wide.'),
    },
    build: {
      label: 'Build it',
      title: 'The first transistor',
      hints: { foil: 'Tap the gold foil', razor: 'Tap the razor blade', spring: 'Tap the spring', lift: 'Tap the spring to lift it', done: 'Tap the spring to take it off again' },
      buttons: { foil: 'Wrap the foil', razor: 'Cut the slit', spring: 'Press with the spring', lift: 'Lift the spring', again: 'Start again' },
      says: {
        foil: S(
          'The gold foil goes round the plastic triangle: down one side, over the tip and up the other. Gold carries electricity well and is soft enough to shape.',
          'Gold foil wrapped over the edge of the polystyrene wedge: gold conducts well, does not tarnish, and foil this thin can be cut with a razor.',
        ),
        razor: S(
          'Snip! One cut at the very tip makes two gold points only about 50 micrometres apart. A sheet of paper is about twice that thick. Look in the magnifying glass.',
          'A razor blade slits the foil at the edge: two contacts about 50 µm apart (often given as 0.002 inch), half a sheet of paper. The lens shows the gap beside a paper edge at one scale.',
        ),
        spring: S(
          'The spring pushes the two points gently onto the germanium. It is built! Next, make it louder.',
          'The spring presses both contacts onto an n-type germanium slab on a metal base, the base being the third terminal. This is the point-contact transistor.',
        ),
        one: S(
          'Pressed with only one point! The foil has to be cut in two first, or the trick cannot work. Tap the spring to lift it, then cut the slit.',
          'Pressed before the slit: a single contact, no separate emitter and collector, so no gain. Lift the spring, slit the foil, press again.',
        ),
        needFoil: S('The foil first: tap the gold foil.', 'No foil yet: wrap the wedge first.'),
        needLift: S('The blade cannot reach while the spring presses. Tap the spring to lift it first.', 'Lift the spring first: the wedge is pressed down.'),
        lifted: S('Lifted.', 'Spring lifted.'),
        again: S('Everything is back on the bench. Build it again!', 'Reset to the start.'),
        already: S('That step is done already. The panel can start again.', 'Already done; the panel can reset the bench.'),
      },
      panel: {
        kid: [
          'This is the first transistor, made small enough to hold in your hand and shown here much bigger. A triangle of clear plastic is wrapped in gold foil. A razor cuts the foil at the tip, so two gold points are left very close together, and a spring presses them onto a block of germanium.',
          'Why two points? A small current goes in at one point. Its effect crosses the crystal to the second point, which carries a much bigger current. That is how a signal gets stronger.',
          'Do the steps in order: foil, razor, spring. If you press before cutting, the two points are still one!',
        ],
        sci: [
          'Bell Labs, December 1947: gold foil is wrapped over the edge of a polystyrene wedge and slit at the tip with a razor blade; a spring presses the two foil edges, about 50 µm apart, onto a slab of n-type germanium on a metal base.',
          'Three terminals: the two foil contacts are the emitter and the collector, the metal base is the base. With no slit there is one contact, which can only rectify, like a diode.',
          'Sources: Riordan and Hoddeson, Crystal Fire (1997); Computer History Museum, "1947: Invention of the Point-Contact Transistor". The spring is sometimes said to be a bent paper clip; accounts differ, so here it is only a spring.',
        ],
      },
    },
    amp: {
      label: 'Make it louder',
      title: 'Amplifying a voice',
      hints: { build: 'Build the transistor first', mic: 'Tap the microphone and say hello', battery: 'Tap the battery switch', play: 'Slide the current, or say hello again' },
      slider: 'Current into the first point',
      levels: { none: 'none', low: 'a trickle', mid: 'a steady stream', high: 'a strong stream' },
      buttons: { mic: 'Speak into the microphone', on: 'Switch the battery on', off: 'Switch the battery off' },
      scope: { in: S('voice in', 'in (emitter)'), out: S('sound out', 'out (collector)') },
      says: {
        needBuild: S('There is no transistor yet. Build it on the bench first!', 'Nothing to amplify yet: build the point-contact transistor first.'),
        onePoint: S(
          'Only one point! Both ends of the circuit touch the same spot, so nothing gets louder. Lift the spring, cut the slit and try again.',
          'A single contact: no separate emitter and collector, no gain. Lift, slit, press again.',
        ),
        mic: S(
          'Hello! The microphone turns your voice into a small wobbling electric current, and the screen draws it: a small wave. Now switch the battery on.',
          'The microphone turns sound into a small varying voltage at the emitter, the top trace. The collector battery is still off, so nothing comes out.',
        ),
        micOn: S(
          'Listen: the wave that comes out is much bigger! The same voice, louder.',
          "The collector trace follows the emitter's but larger: a small change of emitter current controls a larger change of collector current in a circuit of much higher resistance, so the output has more power.",
        ),
        on: S(
          'Battery on! It pulls hard on the second point, and the first point decides how hard. Say hello again.',
          'The battery biases the collector in the reverse direction; holes arriving there change its current, so the collector now follows the emitter.',
        ),
        off: S('Battery off: nothing pulls on the second point, so no louder sound.', 'Collector battery off: no bias, no gain.'),
        louder: S('More current into the first point: more holes cross the crystal, and the sound gets louder.', 'Larger emitter current: more holes injected, a larger collector response.'),
        quieter: S('Less current into the first point: fewer holes cross, so it is quieter.', 'Smaller emitter current: fewer holes reach the collector.'),
        none: S('No current at all: nothing crosses and nothing comes out.', 'Zero emitter current: no injected holes.'),
      },
      panel: {
        kid: [
          "Speak into the microphone and the electricity from it wobbles like your voice. That small wobble goes into the first gold point. The battery on the right tries to push a current through the second point, and the crystal lets the first point's wobble control it. A wobble in a big current is a big wobble, so the headphones are louder.",
          'The magnifying glass shows how: the first point pushes pink "holes" into the germanium. A hole is a place where an electron is missing, and it acts like a positive charge. The holes drift to the second point and make its current bigger. The more current you put into the first point, the more holes there are.',
          'Before this, only a glass tube could do this job. Try the next station.',
        ],
        sci: [
          'Circuit: the microphone drives the emitter contact; the collector contact is biased in the reverse direction by a battery in series with the headphones. The base is the metal mount of the germanium.',
          'Mechanism: holes injected at the emitter reach the collector through the thin surface layer of the n-type germanium, about 50 µm away; their arrival raises the collector current by more than the emitter current changed, in a circuit of higher resistance, so the output signal has more power than the input. The traces show this and no number is given: sources differ on the gain of the device of December 1947.',
          "First power gain: 16 December 1947. Speech amplified for Bell Labs' managers: 23 December (Riordan and Hoddeson). Where the voice trace is drawn, it is a model's speech, not a recording.",
        ],
      },
    },
    radio: {
      label: 'A tube or a crystal?',
      title: 'Tube radio against pocket radio',
      hints: { tube: 'Tap the tube radio', pocket: 'Tap the pocket radio', done: 'Tap a radio again to switch it off' },
      buttons: { tube: 'Switch the tube radio on', tubeOff: 'Switch the tube radio off', pocket: 'Switch the pocket radio on', pocketOff: 'Switch the pocket radio off' },
      says: {
        tube: S(
          'The tube radio hums while its tubes warm up, and they glow orange. Only when they are hot enough does it play. Wait for it!',
          'A tube set must heat its cathodes before the tubes conduct: about half a minute, shown here sped up. A typical heater takes about 2 W (6.3 V at 0.3 A).',
        ),
        ready: S('Now it plays! That took a while, and the tubes are hot.', 'The cathodes are at working temperature: the set plays.'),
        tubeOff: S('Off. The tubes cool down.', 'Off: the heaters cool.'),
        pocket: S(
          'The pocket radio plays at once: no glow and no waiting. Inside are only four transistors.',
          'A transistor needs no heater and works as soon as it has power. The Regency TR-1 of 1954, the first transistor radio sold, had four germanium transistors made by Texas Instruments.',
        ),
        pocketOff: S('Off. It was quiet and cool all along.', 'Off.'),
        both: S(
          'You tried both! Tubes were bigger, hotter and slow to start. Transistors do the same job in a pocket.',
          'Same job, different device: a transistor is smaller, cooler, needs no warm-up and uses far less power. Germanium ones misbehave when they get warm, which is part of why silicon later won.',
        ),
      },
      board: {
        title: S('Which is better?', 'Tube against transistor'),
        unknown: '?',
        sped: S('sped up', 'sped up'),
        rows: [
          { label: S('Size', 'Width'), tube: S('as big as a bread bin', 'about 40 cm, a table set'), pocket: S('fits a pocket', 'about 13 cm, the TR-1') },
          { label: S('Power', 'Power'), tube: S('like a bright lamp, about 40 W', 'about 40 W'), pocket: S('under 1 W', 'under 1 W') },
          { label: S('Ready in', 'Warm-up'), tube: S('about half a minute', 'about 30 s'), pocket: S('at once', 'none') },
          { label: S('Inside', 'Inside'), tube: S('5 glass tubes', '5 tubes'), pocket: S('4 transistors', '4 germanium transistors') },
          { label: S('Heaters', 'Heaters'), tube: S('5 small ovens', 'about 10 W in all'), pocket: S('none', 'none'), sci: true },
        ],
      },
      panel: {
        kid: [
          'Before the transistor, a radio needed vacuum tubes. A tube is a glass bulb with a tiny heater inside, a little like a light bulb. It has to glow for a while before it works, and it gets hot and uses a lot of electricity. A transistor does the same job and is small, cool and ready at once.',
          'In 1954 the first pocket radio went on sale. It had four germanium transistors. Tap each radio and the board fills in.',
        ],
        sci: [
          'Vacuum tube: a heated cathode gives off electrons, a grid controls the current to the anode. The heater must reach working temperature (about half a minute is a rough figure for a table set), and the heaters of a five-tube set alone take about 10 W. A transistor controls a current inside a solid, with no heater.',
          'The Regency TR-1 (1954), the first transistor radio sold, used four germanium transistors made by Texas Instruments. Figures on the board are rounded: a typical five-tube table set, and "under 1 W" for the TR-1.',
        ],
      },
    },
  },

  'pt-pt': {
    title: 'Bell Labs, dezembro de 1947',
    greet: S(
      'Estamos dentro da imagem: um laboratório dos Bell Labs, em Nova Jérsia, numa noite de neve mesmo antes do Natal de 1947. Dois cientistas daqui estão prestes a mostrar que um pequeno cristal faz o trabalho de uma válvula de vidro incandescente. A história da imagem está no cavalete.',
      'Bell Telephone Laboratories, Murray Hill, Nova Jérsia, uma noite de neve em dezembro de 1947: bancadas de pinho, um osciloscópio de válvulas, bastidores de amplificadores de válvulas e, em cima da bancada, o transístor de contacto pontual. A história da imagem está no cavalete.',
    ),
    talk: {
      kid: [
        'John Bardeen e Walter Brattain trabalhavam numa equipa chefiada por William Shockley. Bardeen era quem descobria, com lápis e papel, o que se passa à superfície de um cristal. Brattain era o das mãos habilidosas.',
        'Porque é que há duas pontas de ouro tão juntas? A primeira ponta manda um pouco de eletricidade para dentro do cristal, que chega à segunda ponta, onde passa uma corrente muito maior. Isto só funciona quando as pontas estão mais perto uma da outra do que a espessura de uma folha de papel.',
        'O nome “transístor” veio de um colega, John Pierce, que juntou “transfer” e “resistor”.',
        'Usaram germânio porque, durante a guerra, se aprendeu a fazê-lo mais puro do que qualquer outro cristal parecido, para o radar. Ainda hoje se usa germânio, nas lentes das câmaras que veem o calor.',
      ],
      sci: [
        'Bardeen (teoria) e Brattain (experiência) trabalhavam no grupo de física do estado sólido de Shockley. A ideia de Bardeen dos estados de superfície, eletrões presos à superfície do germânio, explicou porque é que um campo sozinho não tinha funcionado; o dispositivo de contacto pontual nasceu dessas experiências.',
        'O ganho: as lacunas injetadas no contacto do emissor percorrem os cerca de 50 µm até ao contacto do coletor, onde aumentam a corrente muito mais do que a do emissor tinha mudado. Brattain e Bardeen viram-no a 16 de dezembro de 1947 e mostraram-no aos diretores dos Bell Labs a 23 de dezembro.',
        'O público soube dele a 30 de junho de 1948. John R. Pierce propusera o nome, a partir de “transfer resistor”; o pessoal dos Bell Labs escolheu-o numa votação. Bardeen, Brattain e Shockley partilharam o Prémio Nobel da Física de 1956.',
        'O germânio veio primeiro porque o trabalho de guerra em detetores de radar ensinara a fazê-lo mais puro do que qualquer outro semicondutor. Porque é que o silício acabou por ganhar conta-se na sala do vale, no salão do silício.',
      ],
    },
    calendar: 'DEZEMBRO DE 1947',
    tags: { foil: 'folha de ouro', razor: 'lâmina', spring: 'mola', ge: 'germânio', base: 'base de metal', mic: 'microfone', battery: 'pilha', phones: 'auscultadores', scope: 'osciloscópio', tube: 'rádio de válvulas', pocket: 'rádio de bolso' },
    lens: {
      title: S('Pela lupa', 'Vista ampliada'),
      caption: {
        plastic: S('Um triângulo de plástico, bem de perto', 'A cunha de poliestireno, ampliada'),
        foil: S('Folha de ouro à volta da ponta: uma tira comprida', 'Folha sobre a aresta: um contacto contínuo'),
        gap: S('O corte: duas pontas de ouro, muito juntas', 'Dois contactos a cerca de 50 µm um do outro'),
        one: S('Apertado: só uma ponta', 'Um contacto: sem emissor e coletor separados'),
        two: S('Duas pontas de ouro no germânio', 'Emissor e coletor em germânio do tipo n'),
      },
      gap: S('cerca de 50 µm', '50 µm'),
      paper: S('uma folha de papel', 'papel, cerca de 100 µm'),
      emitter: S('primeira ponta', 'emissor'),
      collector: S('segunda ponta', 'coletor'),
      ge: S('germânio', 'germânio do tipo n'),
      holes: S('lacunas', 'lacunas (+)'),
      in: S('sinal pequeno à entrada', 'sinal à entrada'),
      out: S('sinal grande à saída', 'sinal à saída'),
      note: S('Fora de escala: os átomos são muito, muito mais pequenos.', 'Fora de escala: o intervalo mede cerca de 200 000 comprimentos de ligação (0,245 nm).'),
    },
    build: {
      label: 'Constrói-o',
      title: 'O primeiro transístor',
      hints: { foil: 'Toca na folha de ouro', razor: 'Toca na lâmina', spring: 'Toca na mola', lift: 'Toca na mola para a levantar', done: 'Toca na mola para a tirar outra vez' },
      buttons: { foil: 'Enrolar a folha', razor: 'Fazer o corte', spring: 'Apertar com a mola', lift: 'Levantar a mola', again: 'Recomeçar' },
      says: {
        foil: S(
          'A folha de ouro dá a volta ao triângulo de plástico: desce por um lado, passa pela ponta e sobe pelo outro. O ouro conduz bem a eletricidade e é macio o bastante para se moldar.',
          'Folha de ouro enrolada sobre a aresta da cunha de poliestireno: o ouro conduz bem, não escurece, e uma folha tão fina corta-se com uma lâmina.',
        ),
        razor: S(
          'Zás! Um corte mesmo na ponta deixa duas pontas de ouro a apenas cerca de 50 micrómetros uma da outra. Uma folha de papel tem cerca do dobro. Olha pela lupa.',
          'Uma lâmina de barbear corta a folha na aresta: dois contactos a cerca de 50 µm um do outro (muitas vezes dado como 0,002 polegadas), metade de uma folha de papel. A lente mostra o intervalo ao lado do bordo de uma folha, à mesma escala.',
        ),
        spring: S(
          'A mola encosta as duas pontas ao germânio, com suavidade. Está construído! Agora, torna-o mais forte.',
          'A mola aperta os dois contactos contra uma placa de germânio do tipo n sobre uma base de metal, que é o terceiro terminal. É o transístor de contacto pontual.',
        ),
        one: S(
          'Apertado com uma só ponta! A folha tem de estar cortada em duas primeiro, senão o truque não funciona. Toca na mola para a levantar e faz o corte.',
          'Apertado antes do corte: um único contacto, sem emissor e coletor separados, logo sem ganho. Levanta a mola, corta a folha, aperta de novo.',
        ),
        needFoil: S('Primeiro a folha: toca na folha de ouro.', 'Ainda sem folha: enrola primeiro a cunha.'),
        needLift: S('A lâmina não chega lá enquanto a mola aperta. Toca na mola para a levantar primeiro.', 'Levanta primeiro a mola: a cunha está apertada.'),
        lifted: S('Levantada.', 'Mola levantada.'),
        again: S('Está tudo outra vez na bancada. Constrói-o de novo!', 'Voltou ao princípio.'),
        already: S('Esse passo já está feito. O painel pode recomeçar.', 'Já feito; o painel pode repor a bancada.'),
      },
      panel: {
        kid: [
          'Este é o primeiro transístor, pequeno o bastante para caber na mão e mostrado aqui muito maior. Um triângulo de plástico transparente está envolvido em folha de ouro. Uma lâmina corta a folha na ponta, e ficam duas pontas de ouro muito juntas, que uma mola aperta contra um bloco de germânio.',
          'Porquê duas pontas? Entra uma corrente pequena numa ponta. O seu efeito atravessa o cristal até à segunda ponta, que leva uma corrente muito maior. É assim que um sinal fica mais forte.',
          'Faz os passos por ordem: folha, lâmina, mola. Se apertares antes de cortar, as duas pontas ainda são uma só!',
        ],
        sci: [
          'Bell Labs, dezembro de 1947: folha de ouro enrolada sobre a aresta de uma cunha de poliestireno e cortada na ponta com uma lâmina de barbear; uma mola aperta as duas arestas da folha, a cerca de 50 µm uma da outra, contra uma placa de germânio do tipo n sobre uma base de metal.',
          'Três terminais: os dois contactos da folha são o emissor e o coletor, a base de metal é a base. Sem o corte há um só contacto, que só pode retificar, como um díodo.',
          'Fontes: Riordan e Hoddeson, Crystal Fire (1997); Computer History Museum, “1947: Invention of the Point-Contact Transistor”. Diz-se por vezes que a mola era um clipe dobrado; os relatos divergem, por isso aqui é só uma mola.',
        ],
      },
    },
    amp: {
      label: 'Torna-o mais forte',
      title: 'Amplificar uma voz',
      hints: { build: 'Constrói primeiro o transístor', mic: 'Toca no microfone e diz olá', battery: 'Toca no interruptor da pilha', play: 'Mexe na corrente, ou diz olá outra vez' },
      slider: 'Corrente na primeira ponta',
      levels: { none: 'nenhuma', low: 'um fio', mid: 'um fluxo constante', high: 'um fluxo forte' },
      buttons: { mic: 'Falar para o microfone', on: 'Ligar a pilha', off: 'Desligar a pilha' },
      scope: { in: S('voz à entrada', 'entrada (emissor)'), out: S('som à saída', 'saída (coletor)') },
      says: {
        needBuild: S('Ainda não há transístor. Constrói-o primeiro na bancada!', 'Nada para amplificar ainda: constrói primeiro o transístor de contacto pontual.'),
        onePoint: S(
          'Só uma ponta! As duas pontas do circuito tocam no mesmo sítio, por isso nada fica mais forte. Levanta a mola, faz o corte e tenta outra vez.',
          'Um único contacto: sem emissor e coletor separados, sem ganho. Levanta, corta, aperta de novo.',
        ),
        mic: S(
          'Olá! O microfone transforma a tua voz numa pequena corrente elétrica que oscila, e o ecrã desenha-a: uma onda pequena. Agora liga a pilha.',
          'O microfone transforma o som numa pequena tensão variável no emissor, o traço de cima. A pilha do coletor ainda está desligada, por isso nada sai.',
        ),
        micOn: S(
          'Ouve: a onda que sai é muito maior! A mesma voz, mais forte.',
          'O traço do coletor segue o do emissor, mas maior: uma pequena variação da corrente do emissor controla uma variação maior da corrente do coletor, num circuito de resistência muito mais alta, e por isso a saída tem mais potência.',
        ),
        on: S(
          'Pilha ligada! Puxa com força a segunda ponta, e é a primeira que decide com que força. Diz olá outra vez.',
          'A pilha polariza o coletor em sentido inverso; as lacunas que lá chegam mudam a sua corrente, e por isso o coletor passa a seguir o emissor.',
        ),
        off: S('Pilha desligada: nada puxa a segunda ponta, por isso o som não fica mais forte.', 'Pilha do coletor desligada: sem polarização, sem ganho.'),
        louder: S('Mais corrente na primeira ponta: mais lacunas atravessam o cristal, e o som fica mais forte.', 'Corrente de emissor maior: mais lacunas injetadas, uma resposta maior do coletor.'),
        quieter: S('Menos corrente na primeira ponta: menos lacunas atravessam, por isso é mais fraco.', 'Corrente de emissor menor: menos lacunas chegam ao coletor.'),
        none: S('Nenhuma corrente: nada atravessa e nada sai.', 'Corrente de emissor nula: sem lacunas injetadas.'),
      },
      panel: {
        kid: [
          'Fala para o microfone e a eletricidade que sai dele oscila como a tua voz. Essa pequena oscilação entra na primeira ponta de ouro. A pilha da direita tenta empurrar uma corrente pela segunda ponta, e o cristal deixa que a oscilação da primeira a controle. Uma oscilação numa corrente grande é uma oscilação grande, e por isso os auscultadores soam mais forte.',
          'A lupa mostra como: a primeira ponta empurra “lacunas” cor-de-rosa para dentro do germânio. Uma lacuna é um sítio onde falta um eletrão, e comporta-se como uma carga positiva. As lacunas vão à deriva até à segunda ponta e aumentam a sua corrente. Quanta mais corrente puseres na primeira ponta, mais lacunas há.',
          'Antes disto, só uma válvula de vidro fazia este trabalho. Experimenta a estação seguinte.',
        ],
        sci: [
          'Circuito: o microfone excita o contacto do emissor; o contacto do coletor é polarizado em sentido inverso por uma pilha em série com os auscultadores. A base é o suporte de metal do germânio.',
          'Mecanismo: as lacunas injetadas no emissor chegam ao coletor, a cerca de 50 µm, pela camada fina à superfície do germânio do tipo n; a sua chegada aumenta a corrente do coletor mais do que a do emissor mudou, num circuito de resistência mais alta, e por isso o sinal de saída tem mais potência do que o de entrada. Os traços mostram isto e não se dá número nenhum: as fontes divergem quanto ao ganho do dispositivo de dezembro de 1947.',
          'Primeiro ganho de potência: 16 de dezembro de 1947. Fala amplificada diante dos diretores dos Bell Labs: 23 de dezembro (Riordan e Hoddeson). O traço da voz é a fala de um modelo, não uma gravação.',
        ],
      },
    },
    radio: {
      label: 'Válvula ou cristal?',
      title: 'Rádio de válvulas contra rádio de bolso',
      hints: { tube: 'Toca no rádio de válvulas', pocket: 'Toca no rádio de bolso', done: 'Toca num rádio outra vez para o desligar' },
      buttons: { tube: 'Ligar o rádio de válvulas', tubeOff: 'Desligar o rádio de válvulas', pocket: 'Ligar o rádio de bolso', pocketOff: 'Desligar o rádio de bolso' },
      says: {
        tube: S(
          'O rádio de válvulas zumbe enquanto as válvulas aquecem, e ficam laranja. Só toca quando estão quentes o bastante. Espera por ele!',
          'Um aparelho de válvulas tem de aquecer os cátodos antes de as válvulas conduzirem: cerca de meio minuto, mostrado aqui acelerado. Um aquecedor típico gasta cerca de 2 W (6,3 V a 0,3 A).',
        ),
        ready: S('Agora toca! Demorou, e as válvulas estão quentes.', 'Os cátodos estão à temperatura de trabalho: o aparelho toca.'),
        tubeOff: S('Desligado. As válvulas arrefecem.', 'Desligado: os aquecedores arrefecem.'),
        pocket: S(
          'O rádio de bolso toca logo: sem brilho e sem espera. Lá dentro só há quatro transístores.',
          'Um transístor não precisa de aquecedor e funciona assim que tem energia. O Regency TR-1 de 1954, o primeiro rádio de transístores vendido, tinha quatro transístores de germânio feitos pela Texas Instruments.',
        ),
        pocketOff: S('Desligado. Esteve sempre calado e frio.', 'Desligado.'),
        both: S(
          'Experimentaste os dois! As válvulas eram maiores, mais quentes e lentas a arrancar. Os transístores fazem o mesmo trabalho num bolso.',
          'O mesmo trabalho, outro dispositivo: um transístor é mais pequeno, mais frio, não precisa de aquecer e gasta muito menos. Os de germânio portam-se mal quando aquecem, o que explica em parte porque o silício acabou por ganhar.',
        ),
      },
      board: {
        title: S('Qual é melhor?', 'Válvula contra transístor'),
        unknown: '?',
        sped: S('acelerado', 'acelerado'),
        rows: [
          { label: S('Tamanho', 'Largura'), tube: S('grande como uma caixa do pão', 'cerca de 40 cm, um aparelho de mesa'), pocket: S('cabe num bolso', 'cerca de 13 cm, o TR-1') },
          { label: S('Potência', 'Potência'), tube: S('como um candeeiro forte, cerca de 40 W', 'cerca de 40 W'), pocket: S('menos de 1 W', 'menos de 1 W') },
          { label: S('Pronto em', 'Aquecimento'), tube: S('cerca de meio minuto', 'cerca de 30 s'), pocket: S('logo', 'nenhum') },
          { label: S('Lá dentro', 'Lá dentro'), tube: S('5 válvulas de vidro', '5 válvulas'), pocket: S('4 transístores', '4 transístores de germânio') },
          { label: S('Aquecedores', 'Aquecedores'), tube: S('5 forninhos', 'cerca de 10 W no total'), pocket: S('nenhum', 'nenhum'), sci: true },
        ],
      },
      panel: {
        kid: [
          'Antes do transístor, um rádio precisava de válvulas. Uma válvula é uma ampola de vidro com um pequeno aquecedor lá dentro, um pouco como uma lâmpada. Tem de brilhar durante algum tempo antes de funcionar, e fica quente e gasta muita eletricidade. Um transístor faz o mesmo trabalho e é pequeno, frio e fica pronto logo.',
          'Em 1954 começou a vender-se o primeiro rádio de bolso. Tinha quatro transístores de germânio. Toca em cada rádio e o quadro vai-se preenchendo.',
        ],
        sci: [
          'Válvula termiónica: um cátodo aquecido emite eletrões, uma grelha controla a corrente para o ânodo. O aquecedor tem de atingir a temperatura de trabalho (cerca de meio minuto é um valor aproximado para um aparelho de mesa), e só os aquecedores de um aparelho de cinco válvulas gastam cerca de 10 W. Um transístor controla uma corrente dentro de um sólido, sem aquecedor.',
          'O Regency TR-1 (1954), o primeiro rádio de transístores vendido, usava quatro transístores de germânio feitos pela Texas Instruments. Os valores do quadro são arredondados: um aparelho de mesa típico de cinco válvulas e “menos de 1 W” para o TR-1.',
        ],
      },
    },
  },

  pl: {
    title: 'Bell Labs, grudzień 1947',
    greet: S(
      'Jesteśmy w środku obrazka: w laboratorium Bell Labs w New Jersey, w śnieżny wieczór tuż przed Bożym Narodzeniem 1947 roku. Dwaj naukowcy zaraz pokażą, że mały kryształ potrafi wykonać pracę świecącej szklanej lampy. Historia obrazka jest na sztalugach.',
      'Bell Telephone Laboratories, Murray Hill, New Jersey, śnieżny wieczór w grudniu 1947 roku: sosnowe stoły, oscyloskop lampowy, stojaki ze wzmacniaczami lampowymi, a na stole tranzystor ostrzowy. Historia obrazka jest na sztalugach.',
    ),
    talk: {
      kid: [
        'John Bardeen i Walter Brattain pracowali w zespole kierowanym przez Williama Shockleya. Bardeen był tym, który ołówkiem na papierze wyliczał, co dzieje się na powierzchni kryształu. Brattain był tym ze zręcznymi rękami.',
        'Czemu dwa złote ostrza tak blisko siebie? Pierwsze wprowadza trochę prądu do kryształu, a to dociera do drugiego, w którym płynie dużo większy prąd. Działa to tylko wtedy, gdy ostrza są bliżej siebie niż grubość kartki papieru.',
        'Nazwę „tranzystor” wymyślił kolega, John Pierce, który połączył „transfer” i „resistor”.',
        'Użyli germanu, bo w czasie wojny nauczono się robić go czystszym niż jakikolwiek inny podobny kryształ, na potrzeby radarów. German używa się do dziś, na przykład w soczewkach kamer, które widzą ciepło.',
      ],
      sci: [
        'Bardeen (teoria) i Brattain (doświadczenie) pracowali w grupie fizyki ciała stałego Shockleya. Pomysł Bardeena o stanach powierzchniowych, elektronach uwięzionych na powierzchni germanu, wyjaśnił, czemu samo pole nie działało; z tych doświadczeń wyrósł przyrząd ostrzowy.',
        'Wzmocnienie: dziury wstrzyknięte w styku emitera wędrują około 50 µm do styku kolektora i zwiększają jego prąd znacznie bardziej, niż zmienił się prąd emitera. Brattain i Bardeen zobaczyli to 16 grudnia 1947 roku, a 23 grudnia pokazali kierownictwu Bell Labs.',
        'Publicznie ogłoszono go 30 czerwca 1948 roku. Nazwę zaproponował John R. Pierce, od „transfer resistor”; pracownicy Bell Labs wybrali ją w głosowaniu. Bardeen, Brattain i Shockley dostali razem Nagrodę Nobla z fizyki w 1956 roku.',
        'German był pierwszy, bo praca nad detektorami radarowymi w czasie wojny nauczyła, jak robić go czystszym niż jakikolwiek inny półprzewodnik. Czemu w końcu wygrał krzem, opowiada pokój doliny w sali krzemu.',
      ],
    },
    calendar: 'GRUDZIEŃ 1947',
    tags: { foil: 'złota folia', razor: 'żyletka', spring: 'sprężyna', ge: 'german', base: 'metalowa podstawa', mic: 'mikrofon', battery: 'bateria', phones: 'słuchawki', scope: 'oscyloskop', tube: 'radio lampowe', pocket: 'radio kieszonkowe' },
    lens: {
      title: S('Przez lupę', 'Widok z powiększeniem'),
      caption: {
        plastic: S('Plastikowy trójkąt z bliska', 'Klin z polistyrenu, powiększony'),
        foil: S('Złota folia owinięta wokół czubka: jeden długi pasek', 'Folia na krawędzi: jeden ciągły styk'),
        gap: S('Nacięcie: dwa złote ostrza, blisko siebie', 'Dwa styki w odległości około 50 µm'),
        one: S('Przyciśnięte: tylko jedno ostrze', 'Jeden styk: bez osobnego emitera i kolektora'),
        two: S('Dwa złote ostrza na germanie', 'Emiter i kolektor na germanie typu n'),
      },
      gap: S('około 50 µm', '50 µm'),
      paper: S('kartka papieru', 'papier, około 100 µm'),
      emitter: S('pierwsze ostrze', 'emiter'),
      collector: S('drugie ostrze', 'kolektor'),
      ge: S('german', 'german typu n'),
      holes: S('dziury', 'dziury (+)'),
      in: S('mały sygnał na wejściu', 'sygnał na wejściu'),
      out: S('duży sygnał na wyjściu', 'sygnał na wyjściu'),
      note: S('Bez skali: atomy są znacznie, znacznie mniejsze.', 'Bez skali: odstęp to około 200 000 długości wiązania (0,245 nm).'),
    },
    build: {
      label: 'Zbuduj go',
      title: 'Pierwszy tranzystor',
      hints: { foil: 'Dotknij złotej folii', razor: 'Dotknij żyletki', spring: 'Dotknij sprężyny', lift: 'Dotknij sprężyny, żeby ją podnieść', done: 'Dotknij sprężyny, żeby ją zdjąć' },
      buttons: { foil: 'Owiń folię', razor: 'Zrób nacięcie', spring: 'Dociśnij sprężyną', lift: 'Podnieś sprężynę', again: 'Zacznij od nowa' },
      says: {
        foil: S(
          'Złota folia obejmuje plastikowy trójkąt: w dół jednym bokiem, przez czubek i w górę drugim. Złoto dobrze przewodzi prąd i jest dość miękkie, żeby je kształtować.',
          'Złota folia owinięta na krawędzi klina z polistyrenu: złoto dobrze przewodzi, nie matowieje, a tak cienką folię da się przeciąć żyletką.',
        ),
        razor: S(
          'Cyk! Jedno cięcie na samym czubku daje dwa złote ostrza oddalone tylko o około 50 mikrometrów. Kartka papieru jest mniej więcej dwa razy grubsza. Spójrz przez lupę.',
          'Żyletka nacina folię na krawędzi: dwa styki w odległości około 50 µm (często podawane jako 0,002 cala), połowa grubości kartki papieru. Soczewka pokazuje szczelinę obok krawędzi kartki w tej samej skali.',
        ),
        spring: S(
          'Sprężyna delikatnie dociska oba ostrza do germanu. Gotowe! Teraz zrób, żeby było głośniej.',
          'Sprężyna dociska oba styki do płytki germanu typu n na metalowej podstawie, która jest trzecim wyprowadzeniem. To tranzystor ostrzowy.',
        ),
        one: S(
          'Dociśnięte tylko jednym ostrzem! Folię trzeba najpierw przeciąć na dwie części, inaczej sztuczka nie zadziała. Dotknij sprężyny, żeby ją podnieść, i zrób nacięcie.',
          'Docisk przed nacięciem: jeden styk, brak osobnego emitera i kolektora, więc brak wzmocnienia. Podnieś sprężynę, nacięj folię, dociśnij znów.',
        ),
        needFoil: S('Najpierw folia: dotknij złotej folii.', 'Jeszcze bez folii: najpierw owiń klin.'),
        needLift: S('Żyletka nie sięgnie, kiedy sprężyna dociska. Najpierw dotknij sprężyny, żeby ją podnieść.', 'Najpierw podnieś sprężynę: klin jest dociśnięty.'),
        lifted: S('Podniesiona.', 'Sprężyna podniesiona.'),
        again: S('Wszystko znów leży na stole. Zbuduj go jeszcze raz!', 'Powrót do początku.'),
        already: S('Ten krok jest już zrobiony. Panel może zacząć od nowa.', 'Już zrobione; panel może przywrócić stół.'),
      },
      panel: {
        kid: [
          'To pierwszy tranzystor, na tyle mały, że mieścił się w dłoni, a tu pokazany dużo większy. Trójkąt z przezroczystego plastiku jest owinięty złotą folią. Żyletka przecina folię na czubku, więc zostają dwa złote ostrza bardzo blisko siebie, a sprężyna dociska je do bloczka germanu.',
          'Czemu dwa ostrza? Przez jedno wpływa niewielki prąd. Jego skutek przechodzi przez kryształ do drugiego, w którym płynie dużo większy prąd. Tak sygnał staje się silniejszy.',
          'Rób kroki po kolei: folia, żyletka, sprężyna. Jeśli dociśniesz przed cięciem, dwa ostrza to wciąż jedno!',
        ],
        sci: [
          'Bell Labs, grudzień 1947: złota folia owinięta na krawędzi klina z polistyrenu i nacięta na czubku żyletką; sprężyna dociska oba brzegi folii, oddalone o około 50 µm, do płytki germanu typu n na metalowej podstawie.',
          'Trzy wyprowadzenia: dwa styki z folii to emiter i kolektor, metalowa podstawa to baza. Bez nacięcia jest jeden styk, który może tylko prostować, jak dioda.',
          'Źródła: Riordan i Hoddeson, Crystal Fire (1997); Computer History Museum, „1947: Invention of the Point-Contact Transistor”. Czasem mówi się, że sprężyną był wygięty spinacz; relacje się różnią, więc tu jest to zwykła sprężyna.',
        ],
      },
    },
    amp: {
      label: 'Zrób, żeby było głośniej',
      title: 'Wzmacnianie głosu',
      hints: { build: 'Najpierw zbuduj tranzystor', mic: 'Dotknij mikrofonu i powiedz cześć', battery: 'Dotknij wyłącznika baterii', play: 'Przesuń prąd albo powiedz cześć jeszcze raz' },
      slider: 'Prąd w pierwszym ostrzu',
      levels: { none: 'żaden', low: 'strużka', mid: 'równy strumień', high: 'mocny strumień' },
      buttons: { mic: 'Mów do mikrofonu', on: 'Włącz baterię', off: 'Wyłącz baterię' },
      scope: { in: S('głos na wejściu', 'wejście (emiter)'), out: S('dźwięk na wyjściu', 'wyjście (kolektor)') },
      says: {
        needBuild: S('Nie ma jeszcze tranzystora. Najpierw zbuduj go na stole!', 'Na razie nic do wzmocnienia: najpierw zbuduj tranzystor ostrzowy.'),
        onePoint: S(
          'Tylko jedno ostrze! Oba końce obwodu dotykają tego samego miejsca, więc nic nie robi się głośniejsze. Podnieś sprężynę, zrób nacięcie i spróbuj jeszcze raz.',
          'Jeden styk: brak osobnego emitera i kolektora, brak wzmocnienia. Podnieś, nacięj, dociśnij znów.',
        ),
        mic: S(
          'Cześć! Mikrofon zamienia twój głos na mały, drgający prąd elektryczny, a ekran go rysuje: mała fala. Teraz włącz baterię.',
          'Mikrofon zamienia dźwięk na małe zmienne napięcie na emiterze, górny ślad. Bateria kolektora jest jeszcze wyłączona, więc nic nie wychodzi.',
        ),
        micOn: S(
          'Posłuchaj: fala, która wychodzi, jest dużo większa! Ten sam głos, głośniej.',
          'Ślad kolektora podąża za śladem emitera, ale jest większy: mała zmiana prądu emitera steruje większą zmianą prądu kolektora w obwodzie o dużo większym oporze, więc wyjście ma więcej mocy.',
        ),
        on: S(
          'Bateria włączona! Mocno ciągnie za drugie ostrze, a to pierwsze decyduje, jak mocno. Powiedz cześć jeszcze raz.',
          'Bateria polaryzuje kolektor w kierunku zaporowym; docierające tam dziury zmieniają jego prąd, więc kolektor podąża teraz za emiterem.',
        ),
        off: S('Bateria wyłączona: nic nie ciągnie drugiego ostrza, więc dźwięk nie jest głośniejszy.', 'Bateria kolektora wyłączona: brak polaryzacji, brak wzmocnienia.'),
        louder: S('Więcej prądu w pierwszym ostrzu: więcej dziur przechodzi przez kryształ i dźwięk jest głośniejszy.', 'Większy prąd emitera: więcej wstrzykniętych dziur, większa odpowiedź kolektora.'),
        quieter: S('Mniej prądu w pierwszym ostrzu: mniej dziur przechodzi, więc jest ciszej.', 'Mniejszy prąd emitera: mniej dziur dociera do kolektora.'),
        none: S('Żadnego prądu: nic nie przechodzi i nic nie wychodzi.', 'Zerowy prąd emitera: brak wstrzykiwanych dziur.'),
      },
      panel: {
        kid: [
          'Mów do mikrofonu, a prąd z niego drga jak twój głos. To małe drganie wpływa do pierwszego złotego ostrza. Bateria po prawej próbuje wepchnąć prąd przez drugie ostrze, a kryształ pozwala, by drganie z pierwszego nim sterowało. Drganie w dużym prądzie to duże drganie, więc słuchawki grają głośniej.',
          'Lupa pokazuje jak: pierwsze ostrze wpycha różowe „dziury” w german. Dziura to miejsce, w którym brakuje elektronu, i zachowuje się jak ładunek dodatni. Dziury dryfują do drugiego ostrza i zwiększają jego prąd. Im więcej prądu dasz do pierwszego ostrza, tym więcej jest dziur.',
          'Przedtem tę pracę mogła wykonać tylko szklana lampa. Wypróbuj następne stanowisko.',
        ],
        sci: [
          'Obwód: mikrofon wysterowuje styk emitera; styk kolektora jest spolaryzowany zaporowo przez baterię połączoną szeregowo ze słuchawkami. Baza to metalowe mocowanie germanu.',
          'Mechanizm: dziury wstrzyknięte w emiterze docierają do kolektora, oddalonego o około 50 µm, przez cienką warstwę przypowierzchniową germanu typu n; ich przybycie zwiększa prąd kolektora bardziej, niż zmienił się prąd emitera, w obwodzie o większym oporze, więc sygnał wyjściowy ma więcej mocy niż wejściowy. Ślady to pokazują, a liczby nie podano: źródła różnią się co do wzmocnienia przyrządu z grudnia 1947 roku.',
          'Pierwsze wzmocnienie mocy: 16 grudnia 1947 roku. Wzmocniona mowa przed kierownictwem Bell Labs: 23 grudnia (Riordan i Hoddeson). Ślad głosu to mowa modelu, nie nagranie.',
        ],
      },
    },
    radio: {
      label: 'Lampa czy kryształ?',
      title: 'Radio lampowe i radio kieszonkowe',
      hints: { tube: 'Dotknij radia lampowego', pocket: 'Dotknij radia kieszonkowego', done: 'Dotknij radia jeszcze raz, żeby je wyłączyć' },
      buttons: { tube: 'Włącz radio lampowe', tubeOff: 'Wyłącz radio lampowe', pocket: 'Włącz radio kieszonkowe', pocketOff: 'Wyłącz radio kieszonkowe' },
      says: {
        tube: S(
          'Radio lampowe buczy, gdy lampy się nagrzewają, i świecą na pomarańczowo. Gra dopiero, kiedy są dość gorące. Poczekaj!',
          'Odbiornik lampowy musi najpierw nagrzać katody, zanim lampy zaczną przewodzić: około pół minuty, tu przyspieszone. Typowy żarnik pobiera około 2 W (6,3 V przy 0,3 A).',
        ),
        ready: S('Teraz gra! Trochę to trwało, a lampy są gorące.', 'Katody osiągnęły temperaturę pracy: odbiornik gra.'),
        tubeOff: S('Wyłączone. Lampy stygną.', 'Wyłączone: żarniki stygną.'),
        pocket: S(
          'Radio kieszonkowe gra od razu: bez świecenia i bez czekania. W środku są tylko cztery tranzystory.',
          'Tranzystor nie potrzebuje żarnika i działa, gdy tylko dostanie zasilanie. Regency TR-1 z 1954 roku, pierwsze sprzedawane radio tranzystorowe, miało cztery germanowe tranzystory wyprodukowane przez Texas Instruments.',
        ),
        pocketOff: S('Wyłączone. Przez cały czas było ciche i chłodne.', 'Wyłączone.'),
        both: S(
          'Wypróbowałeś oba! Lampy były większe, gorętsze i wolno startowały. Tranzystory robią to samo w kieszeni.',
          'Ta sama praca, inny przyrząd: tranzystor jest mniejszy, chłodniejszy, nie wymaga rozgrzewania i zużywa dużo mniej mocy. Germanowe zachowują się gorzej, gdy się nagrzeją, co jest częścią powodu, dla którego później wygrał krzem.',
        ),
      },
      board: {
        title: S('Co jest lepsze?', 'Lampa kontra tranzystor'),
        unknown: '?',
        sped: S('przyspieszone', 'przyspieszone'),
        rows: [
          { label: S('Rozmiar', 'Szerokość'), tube: S('duże jak chlebak', 'około 40 cm, odbiornik stołowy'), pocket: S('mieści się w kieszeni', 'około 13 cm, TR-1') },
          { label: S('Moc', 'Moc'), tube: S('jak jasna lampa, około 40 W', 'około 40 W'), pocket: S('poniżej 1 W', 'poniżej 1 W') },
          { label: S('Gotowe po', 'Rozgrzewanie'), tube: S('około pół minuty', 'około 30 s'), pocket: S('od razu', 'brak') },
          { label: S('W środku', 'W środku'), tube: S('5 szklanych lamp', '5 lamp'), pocket: S('4 tranzystory', '4 germanowe tranzystory') },
          { label: S('Żarniki', 'Żarniki'), tube: S('5 małych piecyków', 'około 10 W razem'), pocket: S('brak', 'brak'), sci: true },
        ],
      },
      panel: {
        kid: [
          'Przed tranzystorem radio potrzebowało lamp próżniowych. Lampa to szklana bańka z małym grzejnikiem w środku, trochę jak żarówka. Musi świecić przez jakiś czas, zanim zacznie działać, nagrzewa się i zużywa dużo prądu. Tranzystor robi to samo i jest mały, chłodny i od razu gotowy.',
          'W 1954 roku do sprzedaży trafiło pierwsze radio kieszonkowe. Miało cztery germanowe tranzystory. Dotknij każdego radia, a tablica się wypełni.',
        ],
        sci: [
          'Lampa próżniowa: rozgrzana katoda emituje elektrony, siatka steruje prądem do anody. Żarnik musi osiągnąć temperaturę pracy (około pół minuty to przybliżona wartość dla odbiornika stołowego), a same żarniki pięciolampowego odbiornika pobierają około 10 W. Tranzystor steruje prądem wewnątrz ciała stałego, bez żarnika.',
          'Regency TR-1 (1954), pierwsze sprzedawane radio tranzystorowe, miało cztery germanowe tranzystory wyprodukowane przez Texas Instruments. Wartości na tablicy są zaokrąglone: typowy pięciolampowy odbiornik stołowy i „poniżej 1 W” dla TR-1.',
        ],
      },
    },
  },

  de: {
    title: 'Bell Labs, Dezember 1947',
    greet: S(
      'Wir sind im Bild: in einem Labor der Bell Labs in New Jersey, an einem verschneiten Abend kurz vor Weihnachten 1947. Zwei Forscher hier wollen gleich zeigen, dass ein kleiner Kristall die Arbeit einer glühenden Glasröhre tun kann. Die Geschichte des Bildes steht auf der Staffelei.',
      'Bell Telephone Laboratories, Murray Hill, New Jersey, ein verschneiter Abend im Dezember 1947: Werkbänke aus Kiefernholz, ein Röhren-Oszilloskop, Gestelle mit Röhrenverstärkern und auf der Werkbank der Spitzentransistor. Die Geschichte des Bildes steht auf der Staffelei.',
    ),
    talk: {
      kid: [
        'John Bardeen und Walter Brattain arbeiteten in einer Gruppe unter William Shockley. Bardeen war der, der mit Bleistift und Papier ausrechnete, was an der Oberfläche eines Kristalls geschieht. Brattain war der mit den geschickten Händen.',
        'Warum zwei Goldspitzen so dicht beieinander? Die erste schickt ein wenig Strom in den Kristall, und der erreicht die zweite, in der ein viel größerer Strom fließt. Das klappt nur, wenn die Spitzen näher beieinander sind als ein Blatt Papier dick ist.',
        'Den Namen „Transistor“ erfand ein Kollege, John Pierce, aus „transfer“ und „resistor“.',
        'Sie nahmen Germanium, weil man im Krieg gelernt hatte, es für Radar reiner zu machen als jeden ähnlichen Kristall. Germanium wird noch heute benutzt, zum Beispiel für Linsen von Kameras, die Wärme sehen.',
      ],
      sci: [
        'Bardeen (Theorie) und Brattain (Experiment) arbeiteten in Shockleys Festkörperphysik-Gruppe. Bardeens Idee der Oberflächenzustände, Elektronen, die an der Germaniumoberfläche gefangen sind, erklärte, warum ein Feld allein nicht gewirkt hatte; aus diesen Versuchen entstand der Spitzentransistor.',
        'Die Verstärkung: Am Emitterkontakt eingebrachte Löcher wandern die etwa 50 µm zum Kollektorkontakt und erhöhen dessen Strom viel stärker, als sich der Emitterstrom geändert hat. Brattain und Bardeen sahen das am 16. Dezember 1947 und zeigten es am 23. Dezember der Leitung der Bell Labs.',
        'Die Öffentlichkeit erfuhr am 30. Juni 1948 davon. John R. Pierce hatte den Namen vorgeschlagen, aus „transfer resistor“; die Mitarbeiter der Bell Labs wählten ihn in einer Abstimmung. Bardeen, Brattain und Shockley teilten sich 1956 den Nobelpreis für Physik.',
        'Germanium kam zuerst, weil die Arbeit an Radardetektoren im Krieg gelehrt hatte, es reiner herzustellen als jeden anderen Halbleiter. Warum am Ende Silicium gewann, erzählt der Raum des Tals in der Halle des Siliciums.',
      ],
    },
    calendar: 'DEZEMBER 1947',
    tags: { foil: 'Goldfolie', razor: 'Rasierklinge', spring: 'Feder', ge: 'Germanium', base: 'Metallsockel', mic: 'Mikrofon', battery: 'Batterie', phones: 'Kopfhörer', scope: 'Oszilloskop', tube: 'Röhrenradio', pocket: 'Taschenradio' },
    lens: {
      title: S('Durch die Lupe', 'Vergrößerte Ansicht'),
      caption: {
        plastic: S('Ein Plastikdreieck, ganz nah', 'Der Polystyrolkeil, vergrößert'),
        foil: S('Goldfolie um die Spitze gewickelt: ein langer Streifen', 'Folie über der Kante: ein durchgehender Kontakt'),
        gap: S('Der Schlitz: zwei Goldspitzen, dicht beieinander', 'Zwei Kontakte, etwa 50 µm voneinander entfernt'),
        one: S('Angedrückt: nur eine Spitze', 'Ein Kontakt: kein getrennter Emitter und Kollektor'),
        two: S('Zwei Goldspitzen auf dem Germanium', 'Emitter und Kollektor auf n-leitendem Germanium'),
      },
      gap: S('etwa 50 µm', '50 µm'),
      paper: S('ein Blatt Papier', 'Papier, etwa 100 µm'),
      emitter: S('erste Spitze', 'Emitter'),
      collector: S('zweite Spitze', 'Kollektor'),
      ge: S('Germanium', 'n-leitendes Germanium'),
      holes: S('Löcher', 'Löcher (+)'),
      in: S('kleines Signal hinein', 'Signal hinein'),
      out: S('großes Signal heraus', 'Signal heraus'),
      note: S('Nicht maßstabsgetreu: die Atome sind viel, viel kleiner.', 'Nicht maßstabsgetreu: der Abstand misst etwa 200 000 Bindungslängen (0,245 nm).'),
    },
    build: {
      label: 'Bau ihn',
      title: 'Der erste Transistor',
      hints: { foil: 'Tippe auf die Goldfolie', razor: 'Tippe auf die Rasierklinge', spring: 'Tippe auf die Feder', lift: 'Tippe auf die Feder, um sie zu heben', done: 'Tippe auf die Feder, um sie wieder abzunehmen' },
      buttons: { foil: 'Folie wickeln', razor: 'Schlitz schneiden', spring: 'Mit der Feder andrücken', lift: 'Feder heben', again: 'Von vorn beginnen' },
      says: {
        foil: S(
          'Die Goldfolie legt sich um das Plastikdreieck: an einer Seite hinunter, über die Spitze und an der anderen hinauf. Gold leitet Strom gut und ist weich genug, um es zu formen.',
          'Goldfolie über die Kante des Polystyrolkeils gewickelt: Gold leitet gut, läuft nicht an, und so dünne Folie lässt sich mit einer Rasierklinge schneiden.',
        ),
        razor: S(
          'Schnitt! Ein Schnitt genau an der Spitze ergibt zwei Goldspitzen, nur etwa 50 Mikrometer voneinander entfernt. Ein Blatt Papier ist etwa doppelt so dick. Schau durch die Lupe.',
          'Eine Rasierklinge schlitzt die Folie an der Kante: zwei Kontakte, etwa 50 µm auseinander (oft mit 0,002 Zoll angegeben), eine halbe Papierdicke. Die Linse zeigt den Spalt neben einer Papierkante im selben Maßstab.',
        ),
        spring: S(
          'Die Feder drückt die beiden Spitzen sanft auf das Germanium. Er ist gebaut! Als Nächstes: lauter machen.',
          'Die Feder drückt beide Kontakte auf ein Plättchen aus n-leitendem Germanium auf einem Metallsockel, der der dritte Anschluss ist. Das ist der Spitzentransistor.',
        ),
        one: S(
          'Mit nur einer Spitze angedrückt! Die Folie muss zuerst in zwei Teile geschnitten sein, sonst klappt der Trick nicht. Tippe auf die Feder, um sie zu heben, und schneide den Schlitz.',
          'Vor dem Schlitz angedrückt: ein einziger Kontakt, kein getrennter Emitter und Kollektor, also keine Verstärkung. Feder heben, Folie schlitzen, wieder andrücken.',
        ),
        needFoil: S('Zuerst die Folie: tippe auf die Goldfolie.', 'Noch keine Folie: wickle zuerst den Keil.'),
        needLift: S('Die Klinge kommt nicht hin, solange die Feder drückt. Tippe zuerst auf die Feder, um sie zu heben.', 'Hebe zuerst die Feder: der Keil ist angedrückt.'),
        lifted: S('Gehoben.', 'Feder gehoben.'),
        again: S('Alles liegt wieder auf der Werkbank. Bau ihn noch einmal!', 'Zurück auf Anfang.'),
        already: S('Dieser Schritt ist schon getan. Das Fenster kann von vorn beginnen.', 'Schon getan; das Fenster kann die Werkbank zurücksetzen.'),
      },
      panel: {
        kid: [
          'Das ist der erste Transistor, klein genug, um ihn in der Hand zu halten, hier viel größer gezeigt. Ein Dreieck aus klarem Plastik ist in Goldfolie gewickelt. Eine Rasierklinge schneidet die Folie an der Spitze durch, sodass zwei Goldspitzen ganz dicht beieinander bleiben, und eine Feder drückt sie auf einen Block aus Germanium.',
          'Warum zwei Spitzen? An einer Spitze fließt ein kleiner Strom hinein. Seine Wirkung geht durch den Kristall zur zweiten Spitze, in der ein viel größerer Strom fließt. So wird ein Signal stärker.',
          'Mach die Schritte der Reihe nach: Folie, Klinge, Feder. Wenn du vor dem Schneiden andrückst, sind die zwei Spitzen noch eine!',
        ],
        sci: [
          'Bell Labs, Dezember 1947: Goldfolie wird über die Kante eines Polystyrolkeils gewickelt und an der Spitze mit einer Rasierklinge geschlitzt; eine Feder drückt die beiden Folienkanten, etwa 50 µm auseinander, auf ein Plättchen aus n-leitendem Germanium auf einem Metallsockel.',
          'Drei Anschlüsse: die zwei Folienkontakte sind Emitter und Kollektor, der Metallsockel ist die Basis. Ohne Schlitz gibt es einen Kontakt, der nur gleichrichten kann, wie eine Diode.',
          'Quellen: Riordan und Hoddeson, Crystal Fire (1997); Computer History Museum, „1947: Invention of the Point-Contact Transistor“. Manchmal heißt es, die Feder sei eine gebogene Büroklammer gewesen; die Berichte weichen ab, deshalb ist es hier nur eine Feder.',
        ],
      },
    },
    amp: {
      label: 'Lauter machen',
      title: 'Eine Stimme verstärken',
      hints: { build: 'Bau zuerst den Transistor', mic: 'Tippe auf das Mikrofon und sag hallo', battery: 'Tippe auf den Schalter der Batterie', play: 'Schiebe den Strom oder sag noch einmal hallo' },
      slider: 'Strom in der ersten Spitze',
      levels: { none: 'keiner', low: 'ein Rinnsal', mid: 'ein steter Strom', high: 'ein starker Strom' },
      buttons: { mic: 'Ins Mikrofon sprechen', on: 'Batterie einschalten', off: 'Batterie ausschalten' },
      scope: { in: S('Stimme hinein', 'Eingang (Emitter)'), out: S('Ton heraus', 'Ausgang (Kollektor)') },
      says: {
        needBuild: S('Es gibt noch keinen Transistor. Bau ihn zuerst auf der Werkbank!', 'Noch nichts zu verstärken: bau zuerst den Spitzentransistor.'),
        onePoint: S(
          'Nur eine Spitze! Beide Enden des Stromkreises berühren dieselbe Stelle, also wird nichts lauter. Hebe die Feder, schneide den Schlitz und versuche es noch einmal.',
          'Ein einziger Kontakt: kein getrennter Emitter und Kollektor, keine Verstärkung. Heben, schlitzen, wieder andrücken.',
        ),
        mic: S(
          'Hallo! Das Mikrofon macht aus deiner Stimme einen kleinen, wackelnden elektrischen Strom, und der Bildschirm zeichnet ihn: eine kleine Welle. Schalte jetzt die Batterie ein.',
          'Das Mikrofon macht aus Schall eine kleine veränderliche Spannung am Emitter, die obere Spur. Die Kollektorbatterie ist noch aus, also kommt nichts heraus.',
        ),
        micOn: S(
          'Hör zu: Die Welle, die herauskommt, ist viel größer! Dieselbe Stimme, lauter.',
          'Die Kollektorspur folgt der des Emitters, aber größer: Eine kleine Änderung des Emitterstroms steuert eine größere Änderung des Kollektorstroms in einem Kreis mit viel höherem Widerstand, der Ausgang hat also mehr Leistung.',
        ),
        on: S(
          'Batterie an! Sie zieht kräftig an der zweiten Spitze, und die erste bestimmt, wie kräftig. Sag noch einmal hallo.',
          'Die Batterie spannt den Kollektor in Sperrrichtung vor; die dort ankommenden Löcher ändern seinen Strom, sodass der Kollektor nun dem Emitter folgt.',
        ),
        off: S('Batterie aus: nichts zieht an der zweiten Spitze, also wird es nicht lauter.', 'Kollektorbatterie aus: keine Vorspannung, keine Verstärkung.'),
        louder: S('Mehr Strom in der ersten Spitze: mehr Löcher wandern durch den Kristall, und es wird lauter.', 'Größerer Emitterstrom: mehr eingebrachte Löcher, eine größere Antwort des Kollektors.'),
        quieter: S('Weniger Strom in der ersten Spitze: weniger Löcher wandern, also ist es leiser.', 'Kleinerer Emitterstrom: weniger Löcher erreichen den Kollektor.'),
        none: S('Gar kein Strom: nichts wandert und nichts kommt heraus.', 'Emitterstrom null: keine eingebrachten Löcher.'),
      },
      panel: {
        kid: [
          'Sprich ins Mikrofon, und der Strom daraus wackelt wie deine Stimme. Dieses kleine Wackeln geht in die erste Goldspitze. Die Batterie rechts will einen Strom durch die zweite Spitze schieben, und der Kristall lässt das Wackeln der ersten ihn steuern. Ein Wackeln in einem großen Strom ist ein großes Wackeln, darum sind die Kopfhörer lauter.',
          'Die Lupe zeigt, wie: Die erste Spitze schiebt rosa „Löcher“ ins Germanium. Ein Loch ist eine Stelle, an der ein Elektron fehlt, und es verhält sich wie eine positive Ladung. Die Löcher treiben zur zweiten Spitze und machen ihren Strom größer. Je mehr Strom du in die erste Spitze gibst, desto mehr Löcher gibt es.',
          'Vorher konnte nur eine Glasröhre diese Arbeit tun. Probiere die nächste Station.',
        ],
        sci: [
          'Schaltung: Das Mikrofon steuert den Emitterkontakt; der Kollektorkontakt wird von einer Batterie in Reihe mit den Kopfhörern in Sperrrichtung vorgespannt. Die Basis ist die Metallfassung des Germaniums.',
          'Mechanismus: Am Emitter eingebrachte Löcher erreichen den Kollektor, etwa 50 µm entfernt, durch die dünne Oberflächenschicht des n-leitenden Germaniums; ihre Ankunft erhöht den Kollektorstrom stärker, als sich der Emitterstrom geändert hat, in einem Kreis mit höherem Widerstand, sodass das Ausgangssignal mehr Leistung hat als das Eingangssignal. Die Spuren zeigen das, eine Zahl wird nicht genannt: Die Quellen weichen bei der Verstärkung des Geräts vom Dezember 1947 ab.',
          'Erste Leistungsverstärkung: 16. Dezember 1947. Sprache verstärkt vor der Leitung der Bell Labs: 23. Dezember (Riordan und Hoddeson). Die Stimmspur ist die Sprache eines Modells, keine Aufnahme.',
        ],
      },
    },
    radio: {
      label: 'Röhre oder Kristall?',
      title: 'Röhrenradio gegen Taschenradio',
      hints: { tube: 'Tippe auf das Röhrenradio', pocket: 'Tippe auf das Taschenradio', done: 'Tippe noch einmal auf ein Radio, um es auszuschalten' },
      buttons: { tube: 'Röhrenradio einschalten', tubeOff: 'Röhrenradio ausschalten', pocket: 'Taschenradio einschalten', pocketOff: 'Taschenradio ausschalten' },
      says: {
        tube: S(
          'Das Röhrenradio brummt, während die Röhren warm werden, und sie glühen orange. Erst wenn sie heiß genug sind, spielt es. Warte darauf!',
          'Ein Röhrengerät muss erst die Kathoden heizen, ehe die Röhren leiten: etwa eine halbe Minute, hier beschleunigt. Eine typische Heizung braucht etwa 2 W (6,3 V bei 0,3 A).',
        ),
        ready: S('Jetzt spielt es! Das dauerte eine Weile, und die Röhren sind heiß.', 'Die Kathoden haben Betriebstemperatur: das Gerät spielt.'),
        tubeOff: S('Aus. Die Röhren kühlen ab.', 'Aus: die Heizungen kühlen ab.'),
        pocket: S(
          'Das Taschenradio spielt sofort: kein Glühen und kein Warten. Darin sind nur vier Transistoren.',
          'Ein Transistor braucht keine Heizung und arbeitet, sobald er Strom hat. Das Regency TR-1 von 1954, das erste verkaufte Transistorradio, hatte vier Germanium-Transistoren von Texas Instruments.',
        ),
        pocketOff: S('Aus. Es war die ganze Zeit leise und kühl.', 'Aus.'),
        both: S(
          'Du hast beide probiert! Röhren waren größer, heißer und langsam beim Start. Transistoren tun dieselbe Arbeit in einer Tasche.',
          'Dieselbe Aufgabe, ein anderes Bauteil: Ein Transistor ist kleiner, kühler, braucht kein Aufwärmen und verbraucht viel weniger Leistung. Die aus Germanium verhalten sich schlecht, wenn sie warm werden, was zum Teil erklärt, warum später Silicium gewann.',
        ),
      },
      board: {
        title: S('Was ist besser?', 'Röhre gegen Transistor'),
        unknown: '?',
        sped: S('beschleunigt', 'beschleunigt'),
        rows: [
          { label: S('Größe', 'Breite'), tube: S('so groß wie ein Brotkasten', 'etwa 40 cm, ein Tischgerät'), pocket: S('passt in die Tasche', 'etwa 13 cm, das TR-1') },
          { label: S('Leistung', 'Leistung'), tube: S('wie eine helle Lampe, etwa 40 W', 'etwa 40 W'), pocket: S('unter 1 W', 'unter 1 W') },
          { label: S('Bereit nach', 'Aufwärmen'), tube: S('etwa einer halben Minute', 'etwa 30 s'), pocket: S('sofort', 'keins') },
          { label: S('Darin', 'Darin'), tube: S('5 Glasröhren', '5 Röhren'), pocket: S('4 Transistoren', '4 Germanium-Transistoren') },
          { label: S('Heizungen', 'Heizungen'), tube: S('5 kleine Öfen', 'etwa 10 W insgesamt'), pocket: S('keine', 'keine'), sci: true },
        ],
      },
      panel: {
        kid: [
          'Vor dem Transistor brauchte ein Radio Elektronenröhren. Eine Röhre ist ein Glaskolben mit einer winzigen Heizung darin, ein bisschen wie eine Glühbirne. Sie muss eine Weile glühen, ehe sie arbeitet, und sie wird heiß und braucht viel Strom. Ein Transistor tut dieselbe Arbeit und ist klein, kühl und sofort bereit.',
          '1954 kam das erste Taschenradio in den Handel. Es hatte vier Germanium-Transistoren. Tippe auf jedes Radio, und die Tafel füllt sich.',
        ],
        sci: [
          'Elektronenröhre: Eine geheizte Kathode gibt Elektronen ab, ein Gitter steuert den Strom zur Anode. Die Heizung muss Betriebstemperatur erreichen (etwa eine halbe Minute ist ein grober Wert für ein Tischgerät), und allein die Heizungen eines Fünfröhrengeräts brauchen etwa 10 W. Ein Transistor steuert einen Strom im Inneren eines Festkörpers, ohne Heizung.',
          'Das Regency TR-1 (1954), das erste verkaufte Transistorradio, hatte vier Germanium-Transistoren von Texas Instruments. Die Werte auf der Tafel sind gerundet: ein typisches Fünfröhren-Tischgerät und „unter 1 W“ für das TR-1.',
        ],
      },
    },
  },
}
