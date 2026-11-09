// The words of germanium's fuzz room ("What makes a guitar go fuzzzz?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Ge.js (the easel shows it); the room lets you hear and see it and adds to it.
// Facts: in 1961 Grady Martin played a six-string bass solo on Marty Robbins's "Don't Worry" in a Nashville
// studio; a part of the mixing desk broke (sources say a preamp or a transformer, so the words say only that
// part of the desk broke) and clipped the sound; the engineer Glenn Snoddy and Revis Hobbs patented a
// device that does it on purpose (US 3,213,181, granted 1965) and Gibson sold it from 1962 as the Maestro
// FZ-1 Fuzz-Tone; Keith Richards played one on "(I Can't Get No) Satisfaction" (1965) and the shops sold out;
// the Dallas Arbiter Fuzz Face (1966), played by Jimi Hendrix, began with germanium transistors and later
// ones used silicon. Germanium's band gap is 0.67 eV, silicon's 1.12 eV; a germanium base-emitter junction
// conducts from about 0.2 to 0.3 V, a silicon one from about 0.6 to 0.7 V; a germanium transistor's leakage
// roughly doubles every 10 degrees Celsius and is typically about a thousand times a silicon one's. A
// symmetric clip adds only odd harmonics; a square wave has them at 1/3, 1/5, 1/7 of the fundamental. The
// leakage meters and the changes of sound are a simple model with numbers chosen for show, and the words say so.
// The first transistor (Bell Labs, 1947) was germanium; the first silicon transistor was made in 1954.
const EN = {
  title: 'A Nashville studio, 1961',
  greet: {
    kid: 'We are inside the picture: a recording studio in Nashville, 1961! The guitar stands ready. Tap it and listen. The picture’s story is on the easel beside you.',
    sci: 'A Nashville recording studio, 1961: the live room, the control room behind its window, a guitar, a fuzz pedal and an amplifier. Tap the guitar to record a note. The picture’s story is on the easel.',
  },
  talk: {
    kid: [
      'Inside every transistor there is a little of me: germanium, a shiny grey element that lets electricity through a little, but only a little. That is what makes it so useful.',
      'The very first transistor, in 1947, was made of germanium. Fuzz pedals went on using it long after most other things had switched to silicon.',
      'Guitarists still argue about whether germanium fuzz sounds warmer. Try both pedals on the hot and cold stage and decide for yourself.',
    ],
    sci: [
      'Germanium’s band gap is 0.67 eV, silicon’s 1.12 eV. The smaller gap is why a germanium junction starts to conduct at a lower voltage, and why it leaks more current when it warms.',
      'The first transistor (Bell Labs, 1947) was germanium; the first silicon one came in 1954. Germanium kept a place in fuzz pedals for its sound.',
      'Players say germanium fuzz sounds warmer and rounder. That is the ear’s verdict; the leakage and the gain behind it are physics, and you can watch them here.',
    ],
  },
  desk: {
    label: 'The mixing desk',
    title: 'The broken channel',
    hints: { play: 'Tap the guitar', fault: 'Tap the glowing part on the desk', again: 'Tap the guitar again', mend: 'Tap the part to mend it' },
    buttons: { play: 'Play a note', part: 'Break or mend the part' },
    says: {
      clean: { kid: 'A clean, round note. The needle on the desk swings a little and the wave on the screen is smooth.', sci: 'A clean low note: a smooth wave on the screen, the needle moving gently.' },
      fuzzy: { kid: 'Whoa, what is that?! Rough and buzzy, and the wave has its tops and bottoms cut off flat!', sci: 'The same note through the broken channel: the peaks are clipped flat, top and bottom, and the needle is pinned in the red.' },
      broke: { kid: 'Crack! Something inside the channel went wrong. Now tap the guitar again.', sci: 'The part fails. Tap the guitar to hear the same note again.' },
      mended: { kid: 'Mended: a clean note again.', sci: 'Part replaced: the note is clean again.' },
    },
    screen: { title: 'Channel 5', idle: 'Waiting for a note', clean: 'A smooth wave', fuzzy: 'Cut off flat' },
    panel: {
      kid: [
        'In 1961, in a recording studio in Nashville, the guitarist Grady Martin was playing a solo on a six-string bass guitar for Marty Robbins’s song “Don’t Worry”. A part of the mixing desk broke, and the sound came out rough and buzzy instead of clean. Everyone liked it, so it stayed in the song.',
        'The studio’s engineer, Glenn Snoddy, and Revis Hobbs wondered: could we make that sound on purpose? They built a little box that does it, with germanium transistors inside. Next stop: the pedal, opened up.',
      ],
      sci: [
        'Grady Martin’s six-string bass solo on Marty Robbins’s “Don’t Worry” (1961) went through a channel of the studio’s console that had failed in a way that clipped the signal. Sources disagree about which part it was, a preamp or a transformer, so we say only that part of the desk broke. A clipped signal is a flat-topped wave: its peaks are cut off, top and bottom.',
        'The engineer Glenn Snoddy and Revis Hobbs patented a device that clips a guitar’s signal on purpose (US patent 3,213,181, granted in 1965), and Gibson sold it from 1962 as the Maestro FZ-1 Fuzz-Tone. Its transistors were germanium; the exact types are not given here.',
      ],
    },
  },
  pedal: {
    label: 'Inside the pedal',
    title: 'Inside a fuzz pedal',
    slider: 'Gain',
    hints: { gain: 'Tap the big knob to turn the gain up', look: 'Tap a transistor to look inside', more: 'Tap another transistor, or turn the knob' },
    buttons: { knob: 'Turn the gain up', open: 'Open a transistor', play: 'Hear it' },
    says: {
      low: { kid: 'A small gain: the wave is just bigger, still smooth. Nothing is squashed yet.', sci: 'Low gain: the output is the input made bigger, with no clipping and no new harmonics beyond the guitar’s own.' },
      mid: { kid: 'Now the tops of the wave are getting squashed flat!', sci: 'The peaks reach the limit and are rounded off: the third harmonic rises on the chart.' },
      high: { kid: 'Almost square! See the new bars on the chart? That is the fuzz.', sci: 'Hard clipping: the wave is nearly square, and the odd harmonics are heading for a square wave’s 1/3, 1/5 and 1/7 (dashed).' },
      open: { kid: 'Look inside: germanium atoms in a neat crystal, and a few atoms of another element mixed in on purpose. The card says why germanium switches on early.', sci: 'A germanium crystal, each atom bonded to four neighbours, with a few atoms of other elements (indium, antimony) added to make the p-type and n-type regions. The card compares where germanium and silicon start to conduct.' },
    },
    screen: { title: 'What the pedal does', input: 'in', output: 'out', waves: 'The wave', bars: 'Harmonics: times the note', ideal: 'perfect square' },
    lens: { title: 'Germanium inside', atoms: 'germanium', dopant: 'other atoms mixed in', knee: 'Where it starts to conduct', current: 'current', volts: 'volts, base to emitter', ge: 'germanium', si: 'silicon', geAt: 'about 0.2 to 0.3 V', siAt: 'about 0.6 to 0.7 V' },
    panel: {
      kid: [
        'The pedal’s transistors are amplifiers: they take the guitar’s weak signal and make it bigger. Turn the gain up and they try to make it so big that they run out of room, and the tops and bottoms of the wave get squashed flat. A wave with flat tops is nearly square, and a square wave sounds buzzy. That is fuzz.',
        'Tap a transistor to open it. Inside is a crystal of germanium. A germanium transistor starts working with a smaller push, a lower voltage, than a silicon one does, so it squashes the wave a little more gently.',
      ],
      sci: [
        'Each stage amplifies until the signal meets the limits set by the supply voltage, and the peaks are clipped. A symmetric clip adds only odd harmonics, three, five and seven times the note; a perfect square wave has them at 1/3, 1/5 and 1/7 of the fundamental. The chart shows the harmonics of the wave above, with a perfect square wave dashed.',
        'Germanium’s band gap, 0.67 eV, is smaller than silicon’s, 1.12 eV: a germanium base-emitter junction starts to conduct at about 0.2 to 0.3 V, a silicon one at about 0.6 to 0.7 V. Germanium transistors also have less gain and a softer knee, so the clipping is rounder. The transistors in a real pedal vary; this is a model.',
      ],
    },
  },
  stage: {
    label: 'Hot stage, cold stage',
    title: 'Hot stage, cold stage',
    slider: 'Temperature',
    hints: { heat: 'Tap the stage lights', hear: 'Tap a pedal to hear it', record: 'Tap the gold record on the wall' },
    buttons: { ge: 'Hear the germanium pedal', si: 'Hear the silicon pedal', temp: 'Next temperature' },
    says: {
      cold: { kid: 'A cold hall: both pedals sound just as they were built.', sci: 'A cold hall: little leakage in the germanium transistors, and both pedals sit at the bias they were built for (in this model).' },
      mild: { kid: 'A mild evening. The germanium pedal starts to leak a little current.', sci: 'The germanium transistors’ leakage roughly doubles with every 10 degrees; the model starts to move their bias.' },
      hot: { kid: 'A hot stage under the lights! The germanium pedal leaks a lot and its sound sags and goes soft. The silicon pedal does not change.', sci: 'A hot stage: the germanium leakage is several times what it was, the bias shifts, the gain sags and the clipping turns lopsided. The silicon pedal hardly moves.' },
      ge: { kid: 'The germanium pedal, at this temperature.', sci: 'The germanium pedal at this temperature (model).' },
      si: { kid: 'The silicon pedal. It sounds the same hot or cold.', sci: 'The silicon pedal: its leakage is so small that the bias hardly moves.' },
      record: { kid: 'A gold record! In 1965 Keith Richards played a Fuzz-Tone on “Satisfaction”, and soon the shops had none left. No music here: the song is not ours to play.', sci: 'Keith Richards played a Maestro FZ-1 on “(I Can’t Get No) Satisfaction” (1965), and the shops sold out of Fuzz-Tones. We do not play the song: it is not ours.' },
    },
    screen: { title: 'Two pedals, one stage', ge: 'Germanium', si: 'Silicon', leak: 'Leakage (model)', unit: 'microamps' },
    record: 'Gold record',
    panel: {
      kid: [
        'Germanium transistors have a weakness: when they get warm, a small current leaks through them even when they should be off. Warm up the stage and watch the germanium pedal’s leak meter climb. That moves the transistor’s working point, so the pedal sounds softer and saggier. The silicon pedal hardly leaks at all, so it sounds the same hot or cold.',
        'That is one reason some guitarists love the germanium sound and others do not: it changes with the weather. In 1966 the Fuzz Face came out, and Jimi Hendrix played one. The first ones had germanium transistors; later ones had silicon.',
      ],
      sci: [
        'The leakage (the collector cutoff current) of a germanium transistor roughly doubles with every 10 degrees Celsius, and at room temperature it is typically about a thousand times a silicon one’s, because germanium’s small band gap lets far more electrons jump across thermally. In a fuzz circuit leakage shifts the bias: the gain falls and the clipping turns lopsided. The meters and the sound here come from a simple model with numbers chosen for show; real pedals differ.',
        'That is why germanium fuzz can change between a cold hall and a hot stage. The Dallas Arbiter Fuzz Face (1966), played by Jimi Hendrix, began with germanium transistors; later ones used silicon, which sound steadier. Players describe germanium as warmer: that is their ear’s verdict, not a measurement.',
      ],
    },
  },
}

const PT = {
  title: 'Um estúdio em Nashville, 1961',
  greet: {
    kid: 'Estamos dentro da imagem: um estúdio de gravação em Nashville, 1961! A guitarra está pronta. Toca-lhe e ouve. A história da imagem está no cavalete ao teu lado.',
    sci: 'Um estúdio de gravação em Nashville, 1961: a sala de gravação, a sala de controlo atrás da sua janela, uma guitarra, um pedal de fuzz e um amplificador. Toca na guitarra para gravar uma nota. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'Dentro de cada transístor há um pouco de mim: germânio, um elemento cinzento e brilhante que deixa passar a eletricidade um bocadinho, mas só um bocadinho. É isso que o torna tão útil.',
      'O primeiro transístor de todos, em 1947, era de germânio. Os pedais de fuzz continuaram a usá-lo muito depois de quase tudo o resto ter passado para o silício.',
      'Os guitarristas ainda discutem se o fuzz de germânio soa mais quente. Experimenta os dois pedais no palco quente e frio e decide tu.',
    ],
    sci: [
      'A banda proibida do germânio é de 0,67 eV, a do silício de 1,12 eV. A banda menor é a razão de uma junção de germânio começar a conduzir com uma tensão mais baixa, e de deixar fugir mais corrente quando aquece.',
      'O primeiro transístor (Bell Labs, 1947) era de germânio; o primeiro de silício veio em 1954. O germânio manteve um lugar nos pedais de fuzz pelo seu som.',
      'Os músicos dizem que o fuzz de germânio soa mais quente e mais redondo. Isso é o veredicto do ouvido; a fuga de corrente e o ganho por trás disso são física, e aqui podes vê-los.',
    ],
  },
  desk: {
    label: 'A mesa de mistura',
    title: 'O canal avariado',
    hints: { play: 'Toca na guitarra', fault: 'Toca na peça que brilha na mesa', again: 'Toca outra vez na guitarra', mend: 'Toca na peça para a arranjar' },
    buttons: { play: 'Tocar uma nota', part: 'Estragar ou arranjar a peça' },
    says: {
      clean: { kid: 'Uma nota limpa e redonda. O ponteiro da mesa mexe um pouco e a onda no ecrã é suave.', sci: 'Uma nota grave limpa: uma onda suave no ecrã, o ponteiro a mexer-se devagar.' },
      fuzzy: { kid: 'Uau, o que é isto?! Áspero e zumbido, e a onda tem o cimo e o fundo cortados a direito!', sci: 'A mesma nota pelo canal avariado: os picos ficam cortados a direito, em cima e em baixo, e o ponteiro encosta ao vermelho.' },
      broke: { kid: 'Crac! Algo se estragou dentro do canal. Agora toca outra vez na guitarra.', sci: 'A peça avaria-se. Toca na guitarra para ouvires outra vez a mesma nota.' },
      mended: { kid: 'Arranjado: outra vez uma nota limpa.', sci: 'Peça substituída: a nota volta a ser limpa.' },
    },
    screen: { title: 'Canal 5', idle: 'À espera de uma nota', clean: 'Uma onda suave', fuzzy: 'Cortada a direito' },
    panel: {
      kid: [
        'Em 1961, num estúdio de gravação em Nashville, o guitarrista Grady Martin tocava um solo num baixo de seis cordas para a canção “Don’t Worry”, de Marty Robbins. Avariou-se uma parte da mesa de mistura, e o som saiu áspero e zumbido em vez de limpo. Toda a gente gostou, e ficou na canção.',
        'O engenheiro do estúdio, Glenn Snoddy, e Revis Hobbs pensaram: será que conseguimos fazer aquele som de propósito? Construíram uma caixinha que o faz, com transístores de germânio lá dentro. Próxima paragem: o pedal, aberto.',
      ],
      sci: [
        'O solo de baixo de seis cordas de Grady Martin em “Don’t Worry”, de Marty Robbins (1961), passou por um canal da mesa do estúdio que tinha avariado de maneira a saturar o sinal. As fontes não concordam sobre qual foi a peça, um pré-amplificador ou um transformador, por isso dizemos só que se avariou uma parte da mesa. Um sinal saturado é uma onda de topo achatado: os picos são cortados, em cima e em baixo.',
        'O engenheiro Glenn Snoddy e Revis Hobbs patentearam um dispositivo que satura de propósito o sinal da guitarra (patente norte-americana 3 213 181, concedida em 1965), e a Gibson vendeu-o a partir de 1962 como Maestro FZ-1 Fuzz-Tone. Os seus transístores eram de germânio; os tipos exatos não se dão aqui.',
      ],
    },
  },
  pedal: {
    label: 'Dentro do pedal',
    title: 'Dentro de um pedal de fuzz',
    slider: 'Ganho',
    hints: { gain: 'Toca no botão grande para subir o ganho', look: 'Toca num transístor para espreitar lá dentro', more: 'Toca noutro transístor, ou roda o botão' },
    buttons: { knob: 'Subir o ganho', open: 'Abrir um transístor', play: 'Ouvir' },
    says: {
      low: { kid: 'Um ganho pequeno: a onda só fica maior, ainda suave. Ainda não há nada achatado.', sci: 'Ganho baixo: a saída é a entrada ampliada, sem saturação e sem harmónicos novos além dos da própria guitarra.' },
      mid: { kid: 'Agora o cimo da onda começa a ficar achatado!', sci: 'Os picos chegam ao limite e arredondam-se: o terceiro harmónico sobe no gráfico.' },
      high: { kid: 'Quase quadrada! Vês as barras novas no gráfico? Isso é o fuzz.', sci: 'Saturação forte: a onda é quase quadrada, e os harmónicos ímpares aproximam-se dos de uma onda quadrada, 1/3, 1/5 e 1/7 (a tracejado).' },
      open: { kid: 'Espreita lá dentro: átomos de germânio num cristal arrumado, e alguns átomos de outro elemento misturados de propósito. O cartão diz porque é que o germânio arranca cedo.', sci: 'Um cristal de germânio, cada átomo ligado a quatro vizinhos, com alguns átomos de outros elementos (índio, antimónio) juntos para fazer as regiões de tipo p e de tipo n. O cartão compara onde o germânio e o silício começam a conduzir.' },
    },
    screen: { title: 'O que o pedal faz', input: 'entra', output: 'sai', waves: 'A onda', bars: 'Harmónicos: vezes a nota', ideal: 'quadrada perfeita' },
    lens: { title: 'Germânio lá dentro', atoms: 'germânio', dopant: 'outros átomos misturados', knee: 'Onde começa a conduzir', current: 'corrente', volts: 'volts, da base ao emissor', ge: 'germânio', si: 'silício', geAt: 'cerca de 0,2 a 0,3 V', siAt: 'cerca de 0,6 a 0,7 V' },
    panel: {
      kid: [
        'Os transístores do pedal são amplificadores: pegam no sinal fraco da guitarra e fazem-no maior. Sobe o ganho e tentam fazê-lo tão grande que ficam sem espaço, e o cimo e o fundo da onda ficam achatados. Uma onda de topo plano é quase quadrada, e uma onda quadrada soa a zumbido. Isso é fuzz.',
        'Toca num transístor para o abrir. Lá dentro há um cristal de germânio. Um transístor de germânio começa a funcionar com um empurrão mais pequeno, uma tensão mais baixa, do que um de silício, por isso achata a onda com um pouco mais de suavidade.',
      ],
      sci: [
        'Cada andar amplifica até o sinal chegar aos limites dados pela tensão de alimentação, e os picos são cortados. Uma saturação simétrica só junta harmónicos ímpares, três, cinco e sete vezes a nota; uma onda quadrada perfeita tem-nos a 1/3, 1/5 e 1/7 da fundamental. O gráfico mostra os harmónicos da onda de cima, com uma onda quadrada perfeita a tracejado.',
        'A banda proibida do germânio, 0,67 eV, é menor do que a do silício, 1,12 eV: uma junção base-emissor de germânio começa a conduzir com cerca de 0,2 a 0,3 V, uma de silício com cerca de 0,6 a 0,7 V. Os transístores de germânio têm também menos ganho e um joelho mais suave, por isso a saturação é mais redonda. Os transístores de um pedal verdadeiro variam; isto é um modelo.',
      ],
    },
  },
  stage: {
    label: 'Palco quente, palco frio',
    title: 'Palco quente, palco frio',
    slider: 'Temperatura',
    hints: { heat: 'Toca nas luzes do palco', hear: 'Toca num pedal para o ouvir', record: 'Toca no disco de ouro na parede' },
    buttons: { ge: 'Ouvir o pedal de germânio', si: 'Ouvir o pedal de silício', temp: 'Temperatura seguinte' },
    says: {
      cold: { kid: 'Um salão frio: os dois pedais soam como foram feitos.', sci: 'Um salão frio: pouca fuga de corrente nos transístores de germânio, e os dois pedais estão na polarização para que foram feitos (neste modelo).' },
      mild: { kid: 'Uma noite amena. O pedal de germânio começa a deixar fugir um pouco de corrente.', sci: 'A fuga de corrente dos transístores de germânio duplica, mais ou menos, a cada 10 graus; o modelo começa a mexer-lhes na polarização.' },
      hot: { kid: 'Um palco quente debaixo das luzes! O pedal de germânio deixa fugir muita corrente e o som cai e fica mole. O pedal de silício não muda.', sci: 'Um palco quente: a fuga no germânio é várias vezes o que era, a polarização desloca-se, o ganho cai e a saturação fica assimétrica. O pedal de silício quase não se mexe.' },
      ge: { kid: 'O pedal de germânio, a esta temperatura.', sci: 'O pedal de germânio a esta temperatura (modelo).' },
      si: { kid: 'O pedal de silício. Soa igual, quente ou frio.', sci: 'O pedal de silício: a sua fuga é tão pequena que a polarização quase não se mexe.' },
      record: { kid: 'Um disco de ouro! Em 1965, Keith Richards tocou um Fuzz-Tone em “Satisfaction”, e depressa as lojas ficaram sem nenhum. Aqui não há música: a canção não é nossa para tocar.', sci: 'Keith Richards tocou um Maestro FZ-1 em “(I Can’t Get No) Satisfaction” (1965), e as lojas esgotaram os Fuzz-Tone. Não tocamos a canção: não é nossa.' },
    },
    screen: { title: 'Dois pedais, um palco', ge: 'Germânio', si: 'Silício', leak: 'Fuga de corrente (modelo)', unit: 'microampères' },
    record: 'Disco de ouro',
    panel: {
      kid: [
        'Os transístores de germânio têm uma fraqueza: quando aquecem, deixam passar uma corrente pequena mesmo quando deviam estar desligados. Aquece o palco e vê o medidor de fuga do pedal de germânio a subir. Isso muda o ponto de trabalho do transístor, por isso o pedal soa mais mole e mais caído. O pedal de silício quase não tem fuga, por isso soa igual, quente ou frio.',
        'É uma das razões por que alguns guitarristas adoram o som do germânio e outros não: muda com o tempo. Em 1966 saiu o Fuzz Face, e Jimi Hendrix tocava um. Os primeiros tinham transístores de germânio; os seguintes, de silício.',
      ],
      sci: [
        'A fuga de corrente (a corrente de corte do coletor) de um transístor de germânio duplica, mais ou menos, a cada 10 graus Celsius, e à temperatura ambiente é tipicamente cerca de mil vezes a de um de silício, porque a banda proibida pequena do germânio deixa muitos mais eletrões saltar por agitação térmica. Num circuito de fuzz a fuga desloca a polarização: o ganho cai e a saturação fica assimétrica. Os medidores e o som daqui vêm de um modelo simples com números escolhidos para mostrar; os pedais verdadeiros diferem.',
        'É por isso que o fuzz de germânio pode mudar entre um salão frio e um palco quente. O Dallas Arbiter Fuzz Face (1966), tocado por Jimi Hendrix, começou com transístores de germânio; os seguintes usaram silício, que soa mais estável. Os músicos descrevem o germânio como mais quente: é o veredicto do ouvido deles, não uma medição.',
      ],
    },
  },
}

const PL = {
  title: 'Studio w Nashville, 1961',
  greet: {
    kid: 'Jesteśmy w środku obrazka: studia nagraniowego w Nashville w 1961 roku! Gitara już czeka. Dotknij jej i posłuchaj. Historia obrazka jest na sztalugach obok ciebie.',
    sci: 'Studio nagraniowe w Nashville, 1961: sala nagrań, reżyserka za swoim oknem, gitara, efekt fuzz i wzmacniacz. Dotknij gitary, żeby nagrać dźwięk. Historia obrazka jest na sztalugach.',
  },
  talk: {
    kid: [
      'W każdym tranzystorze jest trochę mnie: germanu, błyszczącego szarego pierwiastka, który przewodzi prąd tylko troszeczkę. I właśnie dlatego jest tak przydatny.',
      'Pierwszy tranzystor na świecie, z 1947 roku, był z germanu. Efekty fuzz używały go jeszcze długo po tym, jak prawie wszystko inne przeszło na krzem.',
      'Gitarzyści wciąż się kłócą, czy germanowy fuzz brzmi cieplej. Wypróbuj oba efekty na gorącej i zimnej scenie i zdecyduj sam.',
    ],
    sci: [
      'Przerwa energetyczna germanu wynosi 0,67 eV, krzemu 1,12 eV. Dlatego złącze germanowe zaczyna przewodzić przy niższym napięciu i dlatego przepuszcza więcej prądu upływu, gdy się nagrzeje.',
      'Pierwszy tranzystor (Bell Labs, 1947) był germanowy; pierwszy krzemowy powstał w 1954 roku. German zachował miejsce w efektach fuzz dzięki swojemu brzmieniu.',
      'Muzycy mówią, że germanowy fuzz brzmi cieplej i okrąglej. To werdykt ucha; upływ prądu i wzmocnienie, które za tym stoją, to fizyka i możesz je tu obserwować.',
    ],
  },
  desk: {
    label: 'Stół mikserski',
    title: 'Zepsuty kanał',
    hints: { play: 'Dotknij gitary', fault: 'Dotknij świecącej części na stole', again: 'Dotknij gitary jeszcze raz', mend: 'Dotknij części, żeby ją naprawić' },
    buttons: { play: 'Zagraj dźwięk', part: 'Zepsuj lub napraw część' },
    says: {
      clean: { kid: 'Czysty, okrągły dźwięk. Wskazówka na stole lekko się rusza, a fala na ekranie jest gładka.', sci: 'Czysty niski dźwięk: gładka fala na ekranie, wskazówka porusza się łagodnie.' },
      fuzzy: { kid: 'Ojej, co to?! Chropowate i brzęczące, a fala ma górę i dół ścięte na płasko!', sci: 'Ten sam dźwięk przez zepsuty kanał: szczyty są ścięte na płasko, u góry i u dołu, a wskazówka stoi na czerwonym.' },
      broke: { kid: 'Trach! Coś w kanale się zepsuło. Teraz dotknij gitary jeszcze raz.', sci: 'Część się psuje. Dotknij gitary, żeby usłyszeć ten sam dźwięk jeszcze raz.' },
      mended: { kid: 'Naprawione: znowu czysty dźwięk.', sci: 'Część wymieniona: dźwięk znów jest czysty.' },
    },
    screen: { title: 'Kanał 5', idle: 'Czekam na dźwięk', clean: 'Gładka fala', fuzzy: 'Ścięta na płasko' },
    panel: {
      kid: [
        'W 1961 roku w studiu nagraniowym w Nashville gitarzysta Grady Martin grał solo na sześciostrunowej gitarze basowej do piosenki Marty’ego Robbinsa „Don’t Worry”. Zepsuła się część stołu mikserskiego i dźwięk wyszedł chropowaty i brzęczący zamiast czystego. Wszystkim się spodobał, więc został w piosence.',
        'Inżynier dźwięku, Glenn Snoddy, i Revis Hobbs pomyśleli: czy da się zrobić taki dźwięk celowo? Zbudowali małe pudełko, które to robi, z tranzystorami z germanu w środku. Następny przystanek: otwarty efekt.',
      ],
      sci: [
        'Solo Grady’ego Martina na sześciostrunowym basie w „Don’t Worry” Marty’ego Robbinsa (1961) przeszło przez kanał konsoli studia, który zepsuł się tak, że obcinał sygnał. Źródła nie zgadzają się, co to była za część, przedwzmacniacz czy transformator, więc mówimy tylko, że zepsuła się część stołu. Obcięty sygnał to fala o płaskich szczytach: jej wierzchołki są ścięte, u góry i u dołu.',
        'Inżynier Glenn Snoddy i Revis Hobbs opatentowali urządzenie, które celowo obcina sygnał gitary (patent USA 3 213 181, przyznany w 1965 roku), a Gibson sprzedawał je od 1962 roku jako Maestro FZ-1 Fuzz-Tone. Jego tranzystory były z germanu; dokładnych typów tu nie podajemy.',
      ],
    },
  },
  pedal: {
    label: 'W środku efektu',
    title: 'W środku efektu fuzz',
    slider: 'Wzmocnienie',
    hints: { gain: 'Dotknij dużego pokrętła, żeby zwiększyć wzmocnienie', look: 'Dotknij tranzystora, żeby zajrzeć do środka', more: 'Dotknij innego tranzystora albo pokrętła' },
    buttons: { knob: 'Zwiększ wzmocnienie', open: 'Otwórz tranzystor', play: 'Posłuchaj' },
    says: {
      low: { kid: 'Małe wzmocnienie: fala jest tylko większa, nadal gładka. Nic jeszcze nie jest spłaszczone.', sci: 'Małe wzmocnienie: wyjście to powiększone wejście, bez obcinania i bez nowych harmonicznych poza własnymi harmonicznymi gitary.' },
      mid: { kid: 'Teraz szczyty fali zaczynają się spłaszczać!', sci: 'Wierzchołki dochodzą do granicy i się zaokrąglają: trzecia harmoniczna rośnie na wykresie.' },
      high: { kid: 'Prawie kwadratowa! Widzisz nowe słupki na wykresie? To właśnie fuzz.', sci: 'Mocne obcinanie: fala jest prawie kwadratowa, a nieparzyste harmoniczne zbliżają się do harmonicznych fali kwadratowej, 1/3, 1/5 i 1/7 (linia przerywana).' },
      open: { kid: 'Zajrzyj do środka: atomy germanu w równym krysztale i kilka atomów innego pierwiastka dodanych celowo. Karta mówi, dlaczego german włącza się wcześnie.', sci: 'Kryształ germanu, każdy atom związany z czterema sąsiadami, z kilkoma atomami innych pierwiastków (indu, antymonu) dodanymi, żeby powstały obszary typu p i n. Karta porównuje, od jakiego napięcia zaczynają przewodzić german i krzem.' },
    },
    screen: { title: 'Co robi efekt', input: 'wejście', output: 'wyjście', waves: 'Fala', bars: 'Harmoniczne: razy nuta', ideal: 'idealny kwadrat' },
    lens: { title: 'German w środku', atoms: 'german', dopant: 'inne atomy dodane', knee: 'Od kiedy przewodzi', current: 'prąd', volts: 'wolty, baza do emitera', ge: 'german', si: 'krzem', geAt: 'około 0,2 do 0,3 V', siAt: 'około 0,6 do 0,7 V' },
    panel: {
      kid: [
        'Tranzystory w efekcie to wzmacniacze: biorą słaby sygnał gitary i robią go większym. Zwiększ wzmocnienie, a będą próbowały zrobić go tak duży, że zabraknie im miejsca, i góra oraz dół fali zostaną spłaszczone. Fala z płaską górą jest prawie kwadratowa, a fala kwadratowa brzmi brzęcząco. To jest fuzz.',
        'Dotknij tranzystora, żeby go otworzyć. W środku jest kryształ germanu. Tranzystor germanowy zaczyna działać przy mniejszym popchnięciu, niższym napięciu, niż krzemowy, więc spłaszcza falę trochę łagodniej.',
      ],
      sci: [
        'Każdy stopień wzmacnia, aż sygnał dojdzie do granic wyznaczonych napięciem zasilania, a wierzchołki zostają obcięte. Symetryczne obcięcie dodaje tylko nieparzyste harmoniczne, trzy, pięć i siedem razy wyższe niż nuta; idealna fala kwadratowa ma je na poziomie 1/3, 1/5 i 1/7 podstawowej. Wykres pokazuje harmoniczne fali powyżej, a idealną falę kwadratową linią przerywaną.',
        'Przerwa energetyczna germanu, 0,67 eV, jest mniejsza niż krzemu, 1,12 eV: złącze baza-emiter z germanu zaczyna przewodzić przy około 0,2 do 0,3 V, krzemowe przy około 0,6 do 0,7 V. Tranzystory germanowe mają też mniejsze wzmocnienie i łagodniejsze kolano, więc obcinanie jest bardziej zaokrąglone. Tranzystory w prawdziwych efektach bywają różne; to jest model.',
      ],
    },
  },
  stage: {
    label: 'Gorąca scena, zimna scena',
    title: 'Gorąca scena, zimna scena',
    slider: 'Temperatura',
    hints: { heat: 'Dotknij świateł sceny', hear: 'Dotknij efektu, żeby go usłyszeć', record: 'Dotknij złotej płyty na ścianie' },
    buttons: { ge: 'Posłuchaj efektu z germanu', si: 'Posłuchaj efektu z krzemu', temp: 'Następna temperatura' },
    says: {
      cold: { kid: 'Zimna sala: oba efekty brzmią tak, jak je zbudowano.', sci: 'Zimna sala: mały upływ prądu w tranzystorach germanowych i oba efekty mają punkt pracy, do jakiego je zbudowano (w tym modelu).' },
      mild: { kid: 'Łagodny wieczór. Efekt z germanu zaczyna przepuszczać trochę prądu.', sci: 'Prąd upływu tranzystorów germanowych z grubsza podwaja się co 10 stopni; model zaczyna przesuwać ich punkt pracy.' },
      hot: { kid: 'Gorąca scena pod światłami! Efekt z germanu przepuszcza dużo prądu, a jego dźwięk opada i miękną. Efekt z krzemu się nie zmienia.', sci: 'Gorąca scena: upływ w germanie jest kilka razy większy niż był, punkt pracy się przesuwa, wzmocnienie spada, a obcinanie robi się niesymetryczne. Efekt z krzemu prawie się nie rusza.' },
      ge: { kid: 'Efekt z germanu przy tej temperaturze.', sci: 'Efekt z germanu przy tej temperaturze (model).' },
      si: { kid: 'Efekt z krzemu. Brzmi tak samo, gorący czy zimny.', sci: 'Efekt z krzemu: jego upływ jest tak mały, że punkt pracy prawie się nie rusza.' },
      record: { kid: 'Złota płyta! W 1965 roku Keith Richards zagrał na Fuzz-Tone w „Satisfaction” i wkrótce sklepy nie miały ani jednego. Tu nie ma muzyki: piosenka nie jest nasza, żeby ją grać.', sci: 'Keith Richards zagrał na Maestro FZ-1 w „(I Can’t Get No) Satisfaction” (1965), a sklepy wyprzedały Fuzz-Tone’y. Nie gramy tej piosenki: nie jest nasza.' },
    },
    screen: { title: 'Dwa efekty, jedna scena', ge: 'German', si: 'Krzem', leak: 'Upływ prądu (model)', unit: 'mikroampery' },
    record: 'Złota płyta',
    panel: {
      kid: [
        'Tranzystory germanowe mają słabość: gdy się nagrzeją, przepuszczają mały prąd nawet wtedy, gdy powinny być wyłączone. Ogrzej scenę i patrz, jak rośnie miernik upływu efektu z germanu. To przesuwa punkt pracy tranzystora, więc efekt brzmi miękko i opadająco. Efekt z krzemu prawie nie ma upływu, więc brzmi tak samo, gorący czy zimny.',
        'To jeden z powodów, dla których jedni gitarzyści kochają brzmienie germanu, a inni nie: zmienia się z pogodą. W 1966 roku pojawił się Fuzz Face i grał na nim Jimi Hendrix. Pierwsze miały tranzystory germanowe, późniejsze krzemowe.',
      ],
      sci: [
        'Prąd upływu (prąd zerowy kolektora) tranzystora germanowego z grubsza podwaja się co 10 stopni Celsjusza, a w temperaturze pokojowej jest zwykle około tysiąc razy większy niż krzemowego, bo mała przerwa energetyczna germanu pozwala znacznie większej liczbie elektronów przeskakiwać dzięki ruchom cieplnym. W układzie fuzz upływ przesuwa punkt pracy: wzmocnienie spada, a obcinanie robi się niesymetryczne. Mierniki i dźwięk tutaj pochodzą z prostego modelu z liczbami dobranymi dla pokazu; prawdziwe efekty się różnią.',
        'Dlatego germanowy fuzz może się zmieniać między zimną salą a gorącą sceną. Dallas Arbiter Fuzz Face (1966), na którym grał Jimi Hendrix, zaczynał z tranzystorami germanowymi; późniejsze miały krzemowe, które brzmią stabilniej. Muzycy opisują german jako cieplejszy: to werdykt ich ucha, nie pomiar.',
      ],
    },
  },
}

const DE = {
  title: 'Ein Studio in Nashville, 1961',
  greet: {
    kid: 'Wir sind mitten im Bild: ein Tonstudio in Nashville, 1961! Die Gitarre steht bereit. Tippe sie an und hör zu. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
    sci: 'Ein Tonstudio in Nashville, 1961: der Aufnahmeraum, der Regieraum hinter seinem Fenster, eine Gitarre, ein Fuzz-Pedal und ein Verstärker. Tippe die Gitarre an, um einen Ton aufzunehmen. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'In jedem Transistor steckt ein bisschen von mir: Germanium, ein glänzendes graues Element, das Strom ein wenig durchlässt, aber nur ein wenig. Das macht es so nützlich.',
      'Der allererste Transistor, 1947, bestand aus Germanium. Fuzz-Pedale benutzten es noch lange, nachdem fast alles andere auf Silicium umgestiegen war.',
      'Gitarristen streiten bis heute, ob Germanium-Fuzz wärmer klingt. Probiere beide Pedale auf der heißen und der kalten Bühne aus und entscheide selbst.',
    ],
    sci: [
      'Die Bandlücke von Germanium beträgt 0,67 eV, die von Silicium 1,12 eV. Darum beginnt ein Germaniumübergang bei einer niedrigeren Spannung zu leiten, und darum lässt er mehr Strom durch, wenn er warm wird.',
      'Der erste Transistor (Bell Labs, 1947) war aus Germanium; der erste aus Silicium kam 1954. Germanium behielt in Fuzz-Pedalen wegen seines Klangs seinen Platz.',
      'Spieler sagen, Germanium-Fuzz klinge wärmer und runder. Das ist das Urteil des Ohrs; der Leckstrom und die Verstärkung dahinter sind Physik, und du kannst sie hier beobachten.',
    ],
  },
  desk: {
    label: 'Das Mischpult',
    title: 'Der defekte Kanal',
    hints: { play: 'Tippe die Gitarre an', fault: 'Tippe das leuchtende Teil am Pult an', again: 'Tippe die Gitarre noch einmal an', mend: 'Tippe das Teil an, um es zu reparieren' },
    buttons: { play: 'Einen Ton spielen', part: 'Das Teil kaputtmachen oder reparieren' },
    says: {
      clean: { kid: 'Ein sauberer, runder Ton. Die Nadel am Pult schwingt ein wenig, und die Welle auf dem Bildschirm ist glatt.', sci: 'Ein sauberer tiefer Ton: eine glatte Welle auf dem Bildschirm, die Nadel bewegt sich sanft.' },
      fuzzy: { kid: 'Huch, was ist das?! Rau und brummig, und die Welle ist oben und unten flach abgeschnitten!', sci: 'Derselbe Ton durch den defekten Kanal: die Spitzen sind flach abgeschnitten, oben und unten, und die Nadel steht im roten Bereich.' },
      broke: { kid: 'Knack! Im Kanal ist etwas kaputtgegangen. Tippe jetzt die Gitarre noch einmal an.', sci: 'Das Teil fällt aus. Tippe die Gitarre an, um denselben Ton noch einmal zu hören.' },
      mended: { kid: 'Repariert: wieder ein sauberer Ton.', sci: 'Teil ersetzt: der Ton ist wieder sauber.' },
    },
    screen: { title: 'Kanal 5', idle: 'Warte auf einen Ton', clean: 'Eine glatte Welle', fuzzy: 'Flach abgeschnitten' },
    panel: {
      kid: [
        '1961 spielte in einem Tonstudio in Nashville der Gitarrist Grady Martin ein Solo auf einer sechssaitigen Bassgitarre für Marty Robbins’ Lied „Don’t Worry“. Ein Teil des Mischpults ging kaputt, und der Klang kam rau und brummig statt sauber heraus. Allen gefiel er, also blieb er im Lied.',
        'Der Toningenieur des Studios, Glenn Snoddy, und Revis Hobbs fragten sich: Können wir diesen Klang mit Absicht machen? Sie bauten einen kleinen Kasten, der es kann, mit Germaniumtransistoren darin. Nächste Station: das aufgeschraubte Pedal.',
      ],
      sci: [
        'Grady Martins Solo auf dem sechssaitigen Bass in Marty Robbins’ „Don’t Worry“ (1961) lief durch einen Kanal der Konsole des Studios, der so ausgefallen war, dass er das Signal beschnitt. Die Quellen sind sich uneinig, welches Teil es war, ein Vorverstärker oder ein Transformator; wir sagen daher nur, dass ein Teil des Pults kaputtging. Ein beschnittenes Signal ist eine Welle mit flachen Spitzen: ihre Gipfel sind abgeschnitten, oben und unten.',
        'Der Toningenieur Glenn Snoddy und Revis Hobbs ließen ein Gerät patentieren, das das Gitarrensignal mit Absicht beschneidet (US-Patent 3 213 181, erteilt 1965), und Gibson verkaufte es ab 1962 als Maestro FZ-1 Fuzz-Tone. Seine Transistoren waren aus Germanium; die genauen Typen nennen wir hier nicht.',
      ],
    },
  },
  pedal: {
    label: 'Im Pedal',
    title: 'Im Inneren eines Fuzz-Pedals',
    slider: 'Verstärkung',
    hints: { gain: 'Tippe den großen Regler an, um die Verstärkung zu erhöhen', look: 'Tippe einen Transistor an, um hineinzuschauen', more: 'Tippe einen anderen Transistor oder den Regler an' },
    buttons: { knob: 'Verstärkung erhöhen', open: 'Einen Transistor öffnen', play: 'Anhören' },
    says: {
      low: { kid: 'Eine kleine Verstärkung: die Welle wird nur größer, bleibt aber glatt. Noch ist nichts platt gedrückt.', sci: 'Geringe Verstärkung: der Ausgang ist der vergrößerte Eingang, ohne Begrenzung und ohne neue Obertöne außer denen der Gitarre selbst.' },
      mid: { kid: 'Jetzt werden die Spitzen der Welle flach gedrückt!', sci: 'Die Gipfel erreichen die Grenze und werden abgerundet: der dritte Oberton wächst im Diagramm.' },
      high: { kid: 'Fast eckig! Siehst du die neuen Balken im Diagramm? Das ist der Fuzz.', sci: 'Harte Begrenzung: die Welle ist fast ein Rechteck, und die ungeraden Obertöne nähern sich denen einer Rechteckwelle, 1/3, 1/5 und 1/7 (gestrichelt).' },
      open: { kid: 'Schau hinein: Germaniumatome in einem ordentlichen Kristall und ein paar Atome eines anderen Elements, mit Absicht beigemischt. Die Karte zeigt, warum Germanium früher anspringt.', sci: 'Ein Germaniumkristall, jedes Atom an vier Nachbarn gebunden, mit ein paar Atomen anderer Elemente (Indium, Antimon), die p- und n-leitende Bereiche erzeugen. Die Karte vergleicht, ab wann Germanium und Silicium leiten.' },
    },
    screen: { title: 'Was das Pedal macht', input: 'rein', output: 'raus', waves: 'Die Welle', bars: 'Obertöne: mal der Ton', ideal: 'ideales Rechteck' },
    lens: { title: 'Germanium im Inneren', atoms: 'Germanium', dopant: 'andere Atome beigemischt', knee: 'Ab wann es leitet', current: 'Strom', volts: 'Volt, Basis zu Emitter', ge: 'Germanium', si: 'Silicium', geAt: 'etwa 0,2 bis 0,3 V', siAt: 'etwa 0,6 bis 0,7 V' },
    panel: {
      kid: [
        'Die Transistoren im Pedal sind Verstärker: Sie nehmen das schwache Signal der Gitarre und machen es größer. Drehst du die Verstärkung hoch, versuchen sie es so groß zu machen, dass ihnen der Platz ausgeht, und die Spitzen oben und unten werden flach gedrückt. Eine Welle mit flachen Spitzen ist fast ein Rechteck, und eine Rechteckwelle klingt brummig. Das ist Fuzz.',
        'Tippe einen Transistor an, um ihn zu öffnen. Darin ist ein Germaniumkristall. Ein Germaniumtransistor beginnt schon bei einem kleineren Anstoß, einer niedrigeren Spannung, zu arbeiten als ein Siliciumtransistor, und drückt die Welle deshalb etwas sanfter platt.',
      ],
      sci: [
        'Jede Stufe verstärkt, bis das Signal an die Grenzen stößt, die die Versorgungsspannung setzt, und die Gipfel werden beschnitten. Eine symmetrische Begrenzung fügt nur ungerade Obertöne hinzu, das Drei-, Fünf- und Siebenfache des Tons; eine ideale Rechteckwelle hat sie bei 1/3, 1/5 und 1/7 der Grundschwingung. Das Diagramm zeigt die Obertöne der Welle darüber, die ideale Rechteckwelle gestrichelt.',
        'Die Bandlücke von Germanium, 0,67 eV, ist kleiner als die von Silicium, 1,12 eV: ein Basis-Emitter-Übergang aus Germanium beginnt bei etwa 0,2 bis 0,3 V zu leiten, einer aus Silicium bei etwa 0,6 bis 0,7 V. Germaniumtransistoren verstärken außerdem weniger und haben ein weicheres Knie, die Begrenzung ist also runder. Die Transistoren eines echten Pedals unterscheiden sich; dies ist ein Modell.',
      ],
    },
  },
  stage: {
    label: 'Heiße Bühne, kalte Bühne',
    title: 'Heiße Bühne, kalte Bühne',
    slider: 'Temperatur',
    hints: { heat: 'Tippe die Bühnenlichter an', hear: 'Tippe ein Pedal an, um es zu hören', record: 'Tippe die goldene Schallplatte an der Wand an' },
    buttons: { ge: 'Das Germaniumpedal hören', si: 'Das Siliciumpedal hören', temp: 'Nächste Temperatur' },
    says: {
      cold: { kid: 'Eine kalte Halle: beide Pedale klingen so, wie sie gebaut wurden.', sci: 'Eine kalte Halle: wenig Leckstrom in den Germaniumtransistoren, und beide Pedale sitzen im Arbeitspunkt, für den sie gebaut wurden (in diesem Modell).' },
      mild: { kid: 'Ein milder Abend. Das Germaniumpedal lässt ein wenig Strom durchsickern.', sci: 'Der Leckstrom der Germaniumtransistoren verdoppelt sich etwa alle 10 Grad; das Modell verschiebt langsam ihren Arbeitspunkt.' },
      hot: { kid: 'Eine heiße Bühne unter den Scheinwerfern! Das Germaniumpedal lässt viel Strom durchsickern, und sein Klang sackt ab und wird weich. Das Siliciumpedal ändert sich nicht.', sci: 'Eine heiße Bühne: der Leckstrom im Germanium ist ein Mehrfaches von vorher, der Arbeitspunkt verschiebt sich, die Verstärkung sackt ab und die Begrenzung wird einseitig. Das Siliciumpedal rührt sich kaum.' },
      ge: { kid: 'Das Germaniumpedal bei dieser Temperatur.', sci: 'Das Germaniumpedal bei dieser Temperatur (Modell).' },
      si: { kid: 'Das Siliciumpedal. Es klingt heiß oder kalt gleich.', sci: 'Das Siliciumpedal: sein Leckstrom ist so klein, dass sich der Arbeitspunkt kaum bewegt.' },
      record: { kid: 'Eine goldene Schallplatte! 1965 spielte Keith Richards bei „Satisfaction“ einen Fuzz-Tone, und bald hatten die Läden keinen mehr. Hier gibt es keine Musik: das Lied gehört nicht uns.', sci: 'Keith Richards spielte auf „(I Can’t Get No) Satisfaction“ (1965) einen Maestro FZ-1, und die Läden waren von Fuzz-Tones leergekauft. Wir spielen das Lied nicht: es gehört nicht uns.' },
    },
    screen: { title: 'Zwei Pedale, eine Bühne', ge: 'Germanium', si: 'Silicium', leak: 'Leckstrom (Modell)', unit: 'Mikroampere' },
    record: 'Goldene Schallplatte',
    panel: {
      kid: [
        'Germaniumtransistoren haben eine Schwäche: wenn sie warm werden, lassen sie einen kleinen Strom durch, auch wenn sie aus sein sollten. Heize die Bühne auf und sieh zu, wie die Leckanzeige des Germaniumpedals steigt. Das verschiebt den Arbeitspunkt des Transistors, und das Pedal klingt weicher und schlaffer. Das Siliciumpedal hat kaum Leckstrom und klingt deshalb heiß oder kalt gleich.',
        'Das ist ein Grund, warum manche Gitarristen den Germaniumklang lieben und andere nicht: er ändert sich mit dem Wetter. 1966 kam das Fuzz Face heraus, und Jimi Hendrix spielte eines. Die ersten hatten Germaniumtransistoren, spätere Silicium.',
      ],
      sci: [
        'Der Leckstrom (der Kollektor-Reststrom) eines Germaniumtransistors verdoppelt sich etwa mit je 10 Grad Celsius, und bei Zimmertemperatur ist er typischerweise etwa tausendmal so groß wie der eines Siliciumtransistors, weil die kleine Bandlücke von Germanium viel mehr Elektronen thermisch hinüberspringen lässt. In einer Fuzz-Schaltung verschiebt der Leckstrom den Arbeitspunkt: die Verstärkung sinkt und die Begrenzung wird einseitig. Die Anzeigen und der Klang hier stammen aus einem einfachen Modell mit Zahlen, die zur Vorführung gewählt sind; echte Pedale unterscheiden sich.',
        'Darum kann sich Germanium-Fuzz zwischen einer kalten Halle und einer heißen Bühne ändern. Das Dallas Arbiter Fuzz Face (1966), das Jimi Hendrix spielte, begann mit Germaniumtransistoren; spätere nutzten Silicium, das stabiler klingt. Spieler beschreiben Germanium als wärmer: das ist das Urteil ihres Ohrs, keine Messung.',
      ],
    },
  },
}

export const FUZZ_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
