// The words of radon's "Why did a door spoil the experiment?" room, in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Rn.js (the
// easel shows it); the room shows it happening and adds to it. Signs drawn in 3D hold no superscripts; the
// panels (HTML) write cm², s⁻¹ and I₀.
// Facts and where they come from:
// - R. B. Owens, "Thorium radiation", Phil. Mag., October 1899: the radiation of thorium oxide in open vessels
//   inconstant, traced to air currents. Owens was professor of electrical engineering at McGill.
// - E. Rutherford, "A radio-active substance emitted from thorium compounds", Phil. Mag. 49, 1-14, January 1900
//   (the text at web.chemteam.info/Chem-History/Rutherford-half-life.html): "the opening or closing of a door at
//   the end of the room" changed the rate of discharge; "in a closed vessel ... the intensity is found to be
//   practically constant", a steady state "after a few minutes"; parallel plates 4 cm apart; the apparatus of
//   his Fig. 1: air from a gasometer or bellows, thorium oxide in a paper vessel A inside a long tube B, an
//   insulated cylinder C on a battery of 100 volts, an insulated electrode D on a Thomson (quadrant)
//   electrometer; "The emanation passes through a plug of cotton-wool without any loss of its radioactive
//   powers", an ion cannot; "This 'emanation', as it will be termed for shortness"; "The current reaches half its
//   value about one minute after the current of air has stopped"; the current "persisted for over ten minutes";
//   Table III (100 V): 1, 0.69 at 28 s, 0.51 at 62 s, 0.23 at 118 s, 0.14 at 155 s, 0.067 at 210 s, 0.041 at
//   272 s, 0.018 at 360 s.
// - Rutherford and Soddy, Phil. Mag. November 1902 and May 1903, as Rutherford tells it in Radio-activity (1904),
//   sections 165 to 167: the thorium emanation passed a white-hot platinum tube and a tube at solid carbon
//   dioxide temperature unchanged; at liquid-air temperature both emanations condensed; on removing the liquid
//   air "several minutes elapse" before the electrometer moves, then the emanation volatilises suddenly,
//   "especially in the case of radium"; frozen thoron decays at its usual rate; radium emanation condensed in a
//   glass U-tube shows itself by the phosphorescence it excites in the glass; a zinc sulphide screen and
//   willemite in it phosphoresce brilliantly (his Fig. 58); the glow "still appreciable after an interval of
//   several weeks"; condensation "probably about -120 C" for thorium's emanation, "about -150 C" for radium's.
// - Half-lives: Rn-220 (thoron) 55.6 s, Rn-222 3.82 days (src/data/elements.json: 3.8215), Rn-219 (actinon)
//   3.96 s. Dorn, Halle, 1900 (the board's story). Rutherford: born 1871 in New Zealand, at McGill 1898 to 1907
//   (from Cambridge), the nucleus in 1911, the 1908 Nobel Prize in Chemistry "for his investigations into the
//   disintegration of the elements, and the chemistry of radioactive substances". Rutherford and Soddy's theory of
//   radioactive change, 1902 and 1903.
// What the room simplifies, and says so in the Scientist panels: the light spot shows the current directly (the
// real spot drifted, its speed the current); the emanation's time runs 10 times faster; the trap warms in
// seconds, not minutes. The picture shows a gold-leaf electroscope; the room uses the quadrant electrometer of
// the papers, under a bell of the same shape.
export const DRAUGHT_WORDS = {
  en: {
    title: `Rutherford's laboratory, Montreal, 1899`,
    greet: {
      kid: `We are inside the picture: a physics laboratory at McGill University in Montreal, on a snowy winter night in 1899. Ernest Rutherford worked here, and something kept spoiling the measurements. Can you find out what? The picture's story is on the easel beside you.`,
      sci: `The Macdonald Physics Building of McGill University, Montreal, 1899 to 1903: Owens's thorium plates, Rutherford's tube of 1900 and Rutherford and Soddy's liquid-air trap of 1903. The picture's story is on the easel.`,
    },
    talk: {
      kid: [
        `I am radon, and the gas from thorium is radon too: a lighter kind of my atom, called thoron. It lasts about a minute. My kind, from radium, lasts days.`,
        `Ernest Rutherford grew up in New Zealand and came here from Cambridge in 1898, when he was 27. Years later he found the nucleus, the tiny heart of every atom.`,
        `Feel the cold from the corridor? On a winter night every open door sends a draught across the room, and the draught carried the gas away from the plates.`,
      ],
      sci: [
        `One emanation was found in each radioactive family: thoron (Rn-220, thorium series, 55.6 s), radon (Rn-222, uranium series, 3.82 days) and actinon (Rn-219, actinium series, about 4 s). All three are isotopes of element 86.`,
        `Rutherford was Macdonald Professor of Physics at McGill from 1898 to 1907. His Nobel Prize in Chemistry of 1908 was "for his investigations into the disintegration of the elements, and the chemistry of radioactive substances", work done largely in this building.`,
        `The emanation's steady fall, the same fraction lost in each equal time, helped Rutherford and Soddy to their theory of 1902 and 1903: radioactive atoms change into atoms of other elements.`,
      ],
    },
    owens: {
      label: `Owens's plates`,
      title: `The reading that would not keep still`,
      slider: `Window open`,
      sliderFmt: `{p}% open`,
      hints: {
        door: `Tap the door at the end of the room`,
        close: `Tap the door again to close it`,
        lid: `Tap the glass case to lower it over the plates`,
        test: `Now tap the door with the case down`,
        done: `Tap the window or the glass case`,
      },
      buttons: { door: `Open or close the door`, win: `Open or close the window`, lid: `Lower or raise the glass case` },
      says: {
        open: { kid: `The door is open! Cold air rushes in, and look: the teal gas is blown out from between the plates. The light spot drops and wobbles.`, sci: `Door open: the draught sweeps the emanation out from between the plates; the ionisation current falls and flickers with the gusts.` },
        close: { kid: `Door shut. The gas gathers between the plates again, and the light spot climbs back.`, sci: `Door closed: the emanation builds up again towards its steady value.` },
        openCase: { kid: `The door is open, but the plates are inside the glass case. The draught cannot blow the gas away, so the light spot stays steady!`, sci: `With the plates enclosed the draught cannot reach the emanation, and the reading stays constant, as in Rutherford's closed vessel.` },
        caseDown: { kid: `The glass case comes down over the plates. Now try the door!`, sci: `The plates are enclosed: a closed vessel.` },
        caseUp: { kid: `Up goes the case. The plates are open to the air again.`, sci: `Case raised: the plates are open to air currents again.` },
        window: { kid: `The window opens: a gentler draught, and the light spot dips a little.`, sci: `Window open: a weaker air current, a smaller drop.` },
        windowCase: { kid: `The window opens, but the plates are safe inside the glass case.`, sci: `Window open; the enclosed plates do not feel it.` },
        windowShut: { kid: `The window is shut.`, sci: `Window closed.` },
      },
      panel: {
        kid: [
          `In 1899 Robert Owens, a professor here, measured the rays of thorium. The rays make the air between two metal plates carry a tiny electric current, and an electrometer measures it: here a spot of light moves along a scale. But his readings kept jumping about.`,
          `Ernest Rutherford found the reason: even opening a door at the end of the room changed them. Tap the door, open the window, then lower the glass case and try the door again. Thorium gives off a gas, and moving air blows it away from between the plates. Inside a closed case the reading stays steady.`,
        ],
        sci: [
          `R. B. Owens (Phil. Mag., October 1899) found the radiation of thorium oxide in open vessels inconstant and traced it to air currents. Rutherford (Phil. Mag. 49, 1, January 1900) measured the ionisation current between parallel plates 4 cm apart with a Thomson quadrant electrometer: "the opening or closing of a door at the end of the room" changed the rate of discharge considerably, while "in a closed vessel" the intensity was "practically constant", steady after a few minutes.`,
          `The cause: thorium compounds give off a radioactive "emanation" (his word, chosen "for shortness") that ionises the air wherever it is carried. The light spot here shows the current directly; on the real instrument the spot reflected from the needle's mirror drifted along the scale, and the speed of the drift was the current. The emanation's time in this room runs 10 times faster.`,
        ],
      },
    },
    tube: {
      label: `Rutherford's tube`,
      title: `Half in about a minute`,
      slider: `Clock speed`,
      sliderFmt: `{k} times faster`,
      realTime: `real time`,
      labels: { paper: `thorium oxide in paper`, wool: `cotton wool` },
      board: { axisX: `minutes after the air stopped`, axisY: `reading`, mine: `your points`, theirs: `Rutherford, 1900` },
      hints: {
        blow: `Tap the bellows to blow air through the tube`,
        fill: `Watch the gas fill the cylinder`,
        wool: `Tap the cotton wool to take it out`,
        woolBack: `Tap the cotton wool to put it back`,
        stop: `Tap the stopwatch to stop the air`,
        run: `Watch the light spot and the chalkboard`,
        again: `Tap the bellows to fill the tube again`,
      },
      buttons: { blow: `Blow air through`, wool: `Take out or put back the cotton wool`, stop: `Stop the air and start the clock` },
      says: {
        blow: { kid: `Puff, puff! The air carries the gas from the thorium along the tube, through the cotton wool, into the big cylinder. The light spot climbs.`, sci: `Air flows over the thorium oxide; the emanation is carried through the cotton wool into cylinder C, where it ionises the air between C and the electrode D.` },
        woolOut: { kid: `Cotton wool out, and the light spot stays just the same.`, sci: `Plug removed: the current is unchanged.` },
        woolIn: { kid: `Cotton wool back in, and still the same reading! Dust would get stuck in cotton wool, but this goes straight through: it is a gas.`, sci: `Plug back, no loss: "The emanation passes through a plug of cotton-wool without any loss of its radioactive powers." Cotton wool stops dust, and ions too.` },
        stop: { kid: `The air stops and the clock starts. Watch the light spot: does the gas keep its power?`, sci: `Air stopped at t = 0. A point goes on the board every 30 s, the current as a fraction of its value at the stop.` },
        half: { kid: `About one minute: the light spot is down to half!`, sci: `t = 56 s: the current is down to one half.` },
        quarter: { kid: `Two minutes: about a quarter. Every minute it halves again!`, sci: `t = 111 s: one quarter. Equal times, equal fractions: an exponential decay.` },
        eighth: { kid: `Three minutes: an eighth. Half, then half again, then half again.`, sci: `t = 167 s: one eighth.` },
        done: { kid: `Six minutes: almost nothing left. Rutherford could still measure it for over ten minutes.`, sci: `t = 6 min: about 1/90 of the start. Rutherford: the current "persisted for over ten minutes".` },
        running: { kid: `The clock is still running. Watch the light spot fall!`, sci: `The run is still going.` },
        wipe: { kid: `The clock is back at nought and the board is wiped clean. Tap the bellows to start again.`, sci: `Clock reset, board wiped.` },
        empty: { kid: `There is no gas in the cylinder yet. Tap the bellows first.`, sci: `No emanation in C: blow air through first.` },
      },
      panel: {
        kid: [
          `To catch the gas, Rutherford wrapped thorium oxide in paper inside a long tube and blew air through it, into a metal cylinder joined to an electrometer. The gas came through the paper and through a plug of cotton wool, which stops dust. So it was not dust but a gas. He called it an "emanation", something that flows out.`,
          `Then he stopped the air and watched the reading fall: half in about one minute, a quarter after two, an eighth after three. Each half takes the same time; today we call that time the half-life. Your points appear on the chalkboard, and the slider makes the clock run faster or slower.`,
        ],
        sci: [
          `The arrangement of 1900: a slow current of air from a gasometer or bellows passed over thorium oxide in a paper vessel A, inside a long tube B, into an insulated cylinder C on a battery of 100 V, with an insulated electrode D on the electrometer. "The emanation passes through a plug of cotton-wool without any loss of its radioactive powers"; an ion cannot. With the air stopped, "the current reaches half its value about one minute after the current of air has stopped".`,
          `His Table III (100 V): 1 at 0 s, 0.69 at 28 s, 0.51 at 62 s, 0.23 at 118 s, 0.14 at 155 s, 0.067 at 210 s, 0.041 at 272 s, 0.018 at 360 s (yellow on the board). The fall is geometric, I = I₀e^(−λt): this is thoron, Rn-220, half-life 55.6 s (λ = 0.0125 s⁻¹), which the white points follow.`,
        ],
      },
    },
    cold: {
      label: `The cold trap`,
      title: `A gas that freezes`,
      slider: `Days later`,
      sliderFmt: `{n} {days} later, {p}% left`,
      days: { one: `day`, other: `days` },
      card: { one: `{n} day later`, other: `{n} days later` },
      labels: { air: `liquid air` },
      hints: {
        flask: `Tap the flask of liquid air to raise it`,
        send: `Tap the radium tube or the thorium box`,
        watch: `Watch where the gas goes`,
        warm: `Tap the flask to lower it`,
        wait: `Wait while the tube warms up`,
        days: `Move the days slider in the panel`,
        again: `Tap a source to send more gas`,
      },
      buttons: { flask: `Raise or lower the liquid air`, ra: `Send radium's emanation`, th: `Send thorium's emanation` },
      says: {
        up: { kid: `Up comes the flask, and the glass U-tube sits in liquid air, colder than −190 °C.`, sci: `The U-tube is immersed in liquid air, at about −190 °C.` },
        down: { kid: `Down goes the flask, and the U-tube warms up.`, sci: `Liquid air removed: the U-tube warms.` },
        warming: { kid: `The tube is warming up... nothing yet...`, sci: `Warming: the condensed emanation stays put until the trap passes its volatilisation point.` },
        sendRa: { kid: `Squeeze! Radium's gas sets off along the tube.`, sci: `Radium's emanation is swept along by a slow stream of air.` },
        sendTh: { kid: `Squeeze! Thorium's gas sets off along the tube.`, sci: `Thorium's emanation is swept along by a slow stream of air.` },
        trapped: { kid: `The gas froze in the cold U-tube! Nothing comes out at the other end, and the glass glows where the gas is caught.`, sci: `Condensed: no emanation leaves the trap, and its radiation makes the glass phosphoresce.` },
        trappedTh: { kid: `Thorium's gas froze in the cold U-tube! But hurry: frozen or not, half of it fades every minute.`, sci: `Thoron condensed. It decays at the same rate at liquid-air temperature, so do not wait long.` },
        passed: { kid: `The tube was warm, so the gas went straight through to the glass jar, and the screen glows!`, sci: `Not cooled: the emanation passes into the vessel, and the zinc sulphide screen and the willemite phosphoresce.` },
        rush: { kid: `Whoosh! The gas comes out all at once and the screen lights up!`, sci: `Volatilised suddenly: the emanation rushes into the vessel, "especially in the case of radium".` },
        gone: { kid: `Hardly anything came out: thorium's gas faded away while it was frozen.`, sci: `Little left: the thoron decayed in the trap.` },
        thGone: { kid: `Thorium's gas has faded away already. Radium's lasts much longer: try it!`, sci: `The thoron is gone within minutes. Try radium's emanation.` },
        days: { kid: `{n} {days} later, {p}% of radium's gas is left. Half goes every 3.8 days.`, sci: `After {n} {days}: {p}% remains (Rn-222, half-life 3.82 days).` },
        daysTh: { kid: `Thorium's gas would be long gone by then: it lasts only minutes.`, sci: `Thoron would be gone within minutes.` },
        empty: { kid: `There is no gas in the jar yet. Send some first.`, sci: `The vessel is empty.` },
      },
      panel: {
        kid: [
          `In 1903 Rutherford and Frederick Soddy sent the emanation through a tube dipped in liquid air, colder than −190 °C. It froze there, and nothing came out at the other end. When the liquid air was taken away, the tube warmed and the gas came out all at once. So the emanation really is a gas, and it can freeze like one.`,
          `Radium gives off an emanation too: Friedrich Ernst Dorn found it in Halle, in Germany, in 1900. It lasts much longer than thorium's: half of it is gone only after 3.8 days. That gas is radon, the gas of this hall. Its rays make a zinc sulphide screen and the mineral willemite glow.`,
        ],
        sci: [
          `Rutherford and Soddy (Phil. Mag., 1902 and May 1903): thorium's emanation passed a white-hot platinum tube and a tube at the temperature of solid carbon dioxide unchanged; at the temperature of liquid air both emanations condensed. When the liquid air was removed, several minutes passed before the electrometer moved, then the emanation volatilised suddenly, "especially in the case of radium". Frozen thoron decays at its usual rate. Rutherford put the condensation at about −120 °C for thorium's emanation and −150 °C for radium's (Radio-activity, 1904).`,
          `Radium emanation condensed in a glass U-tube shows itself by the phosphorescence it excites in the glass; a zinc sulphide screen and willemite glow brilliantly in it, and the glow is "still appreciable after an interval of several weeks" (Radio-activity, 1904). Dorn reported radium's emanation in 1900: Rn-222, half-life 3.82 days. In this room the trap warms in seconds, not minutes.`,
        ],
      },
    },
  },

  'pt-pt': {
    title: `O laboratório de Rutherford, Montreal, 1899`,
    greet: {
      kid: `Estamos dentro do quadro: um laboratório de física da Universidade McGill, em Montreal, numa noite de inverno com neve, em 1899. Ernest Rutherford trabalhava aqui, e havia qualquer coisa que estragava as medições. Consegues descobrir o quê? A história do quadro está no cavalete ao teu lado.`,
      sci: `O Edifício de Física Macdonald da Universidade McGill, Montreal, 1899 a 1903: as placas de tório de Owens, o tubo de Rutherford de 1900 e a armadilha de ar líquido de Rutherford e Soddy, de 1903. A história do quadro está no cavalete.`,
    },
    talk: {
      kid: [
        `Eu sou o rádon, e o gás do tório também é rádon: uma espécie mais leve do meu átomo, chamada torão. Dura cerca de um minuto. A minha espécie, a que vem do rádio, dura dias.`,
        `Ernest Rutherford cresceu na Nova Zelândia e veio de Cambridge para aqui em 1898, quando tinha 27 anos. Anos mais tarde descobriu o núcleo, o minúsculo coração de todos os átomos.`,
        `Sentes o frio que vem do corredor? Numa noite de inverno, cada porta aberta manda uma corrente de ar pela sala fora, e a corrente de ar levava o gás de entre as placas.`,
      ],
      sci: [
        `Encontrou-se uma emanação em cada família radioativa: o torão (Rn-220, série do tório, 55,6 s), o rádon (Rn-222, série do urânio, 3,82 dias) e o actinão (Rn-219, série do actínio, cerca de 4 s). Os três são isótopos do elemento 86.`,
        `Rutherford foi professor Macdonald de Física na McGill de 1898 a 1907. O seu Prémio Nobel da Química de 1908 foi «pelas suas investigações sobre a desintegração dos elementos e a química das substâncias radioativas», trabalho feito em grande parte neste edifício.`,
        `A descida regular da emanação, a mesma fração perdida em cada intervalo igual de tempo, ajudou Rutherford e Soddy a chegar à sua teoria de 1902 e 1903: os átomos radioativos transformam-se em átomos de outros elementos.`,
      ],
    },
    owens: {
      label: `As placas de Owens`,
      title: `A leitura que não parava quieta`,
      slider: `Janela aberta`,
      sliderFmt: `{p}% aberta`,
      hints: {
        door: `Toca na porta ao fundo da sala`,
        close: `Toca outra vez na porta para a fechares`,
        lid: `Toca na caixa de vidro para a baixares sobre as placas`,
        test: `Agora toca na porta com a caixa em baixo`,
        done: `Toca na janela ou na caixa de vidro`,
      },
      buttons: { door: `Abrir ou fechar a porta`, win: `Abrir ou fechar a janela`, lid: `Baixar ou subir a caixa de vidro` },
      says: {
        open: { kid: `A porta está aberta! O ar frio entra de rompante e, olha: o gás azul-turquesa é soprado de entre as placas. O ponto de luz desce e treme.`, sci: `Porta aberta: a corrente de ar varre a emanação de entre as placas; a corrente de ionização cai e oscila com as rajadas.` },
        close: { kid: `Porta fechada. O gás volta a juntar-se entre as placas e o ponto de luz volta a subir.`, sci: `Porta fechada: a emanação acumula-se de novo até ao seu valor estável.` },
        openCase: { kid: `A porta está aberta, mas as placas estão dentro da caixa de vidro. A corrente de ar não consegue levar o gás, por isso o ponto de luz fica quieto!`, sci: `Com as placas fechadas, a corrente de ar não chega à emanação e a leitura fica constante, como no recipiente fechado de Rutherford.` },
        caseDown: { kid: `A caixa de vidro desce sobre as placas. Agora experimenta a porta!`, sci: `As placas estão fechadas: um recipiente fechado.` },
        caseUp: { kid: `A caixa sobe. As placas voltam a estar abertas ao ar.`, sci: `Caixa levantada: as placas voltam a estar expostas às correntes de ar.` },
        window: { kid: `A janela abre-se: uma corrente de ar mais suave, e o ponto de luz desce um pouco.`, sci: `Janela aberta: uma corrente de ar mais fraca, uma descida menor.` },
        windowCase: { kid: `A janela abre-se, mas as placas estão protegidas dentro da caixa de vidro.`, sci: `Janela aberta; as placas fechadas não a sentem.` },
        windowShut: { kid: `A janela está fechada.`, sci: `Janela fechada.` },
      },
      panel: {
        kid: [
          `Em 1899, Robert Owens, professor aqui, media os raios do tório. Os raios fazem o ar entre duas placas de metal conduzir uma corrente elétrica minúscula, e um eletrómetro mede-a: aqui, um ponto de luz move-se ao longo de uma escala. Mas as leituras dele não paravam de saltar.`,
          `Ernest Rutherford descobriu a razão: até abrir uma porta ao fundo da sala as mudava. Toca na porta, abre a janela, depois baixa a caixa de vidro e experimenta outra vez a porta. O tório solta um gás, e o ar em movimento leva-o de entre as placas. Dentro de uma caixa fechada a leitura fica estável.`,
        ],
        sci: [
          `R. B. Owens (Phil. Mag., outubro de 1899) viu que a radiação do óxido de tório em recipientes abertos era inconstante e atribuiu-a às correntes de ar. Rutherford (Phil. Mag. 49, 1, janeiro de 1900) mediu a corrente de ionização entre placas paralelas a 4 cm uma da outra com um eletrómetro de quadrantes de Thomson: «abrir ou fechar uma porta ao fundo da sala» alterava bastante a velocidade de descarga, enquanto «num recipiente fechado» a intensidade era «praticamente constante», estável ao fim de alguns minutos.`,
          `A causa: os compostos de tório libertam uma «emanação» radioativa (a palavra dele, escolhida «por brevidade») que ioniza o ar para onde quer que seja levada. Aqui, o ponto de luz mostra a corrente diretamente; no instrumento verdadeiro, o ponto refletido pelo espelho da agulha deslizava ao longo da escala, e a velocidade desse deslizar era a corrente. O tempo da emanação nesta sala corre 10 vezes mais depressa.`,
        ],
      },
    },
    tube: {
      label: `O tubo de Rutherford`,
      title: `Metade em cerca de um minuto`,
      slider: `Velocidade do relógio`,
      sliderFmt: `{k} vezes mais depressa`,
      realTime: `tempo real`,
      labels: { paper: `óxido de tório em papel`, wool: `algodão` },
      board: { axisX: `minutos depois de parar o ar`, axisY: `leitura`, mine: `os teus pontos`, theirs: `Rutherford, 1900` },
      hints: {
        blow: `Toca no fole para soprar ar pelo tubo`,
        fill: `Vê o gás encher o cilindro`,
        wool: `Toca no algodão para o tirares`,
        woolBack: `Toca no algodão para o voltares a pôr`,
        stop: `Toca no cronómetro para parar o ar`,
        run: `Observa o ponto de luz e o quadro`,
        again: `Toca no fole para voltar a encher o tubo`,
      },
      buttons: { blow: `Soprar ar pelo tubo`, wool: `Tirar ou voltar a pôr o algodão`, stop: `Parar o ar e pôr o relógio a andar` },
      says: {
        blow: { kid: `Fu, fu! O ar leva o gás do tório ao longo do tubo, através do algodão, até ao cilindro grande. O ponto de luz sobe.`, sci: `O ar passa sobre o óxido de tório; a emanação é levada através do algodão até ao cilindro C, onde ioniza o ar entre C e o elétrodo D.` },
        woolOut: { kid: `Algodão fora, e o ponto de luz fica exatamente igual.`, sci: `Tampão retirado: a corrente não se altera.` },
        woolIn: { kid: `Algodão outra vez lá dentro, e a leitura continua igual! O pó ficaria preso no algodão, mas isto passa direitinho: é um gás.`, sci: `Tampão de volta, sem perda: «A emanação atravessa um tampão de algodão sem qualquer perda dos seus poderes radioativos.» O algodão retém o pó, e também os iões.` },
        stop: { kid: `O ar para e o relógio começa a andar. Observa o ponto de luz: será que o gás guarda a sua força?`, sci: `Ar parado em t = 0. Vai um ponto para o quadro a cada 30 s: a corrente como fração do seu valor no momento da paragem.` },
        half: { kid: `Cerca de um minuto: o ponto de luz desceu para metade!`, sci: `t = 56 s: a corrente desceu para metade.` },
        quarter: { kid: `Dois minutos: cerca de um quarto. A cada minuto volta a cair para metade!`, sci: `t = 111 s: um quarto. Tempos iguais, frações iguais: um decaimento exponencial.` },
        eighth: { kid: `Três minutos: um oitavo. Metade, depois metade outra vez, e outra vez metade.`, sci: `t = 167 s: um oitavo.` },
        done: { kid: `Seis minutos: quase não resta nada. Rutherford ainda a conseguia medir durante mais de dez minutos.`, sci: `t = 6 min: cerca de 1/90 do início. Rutherford: a corrente «persistiu durante mais de dez minutos».` },
        running: { kid: `O relógio ainda está a andar. Vê o ponto de luz a descer!`, sci: `A medição ainda está a decorrer.` },
        wipe: { kid: `O relógio voltou ao zero e o quadro ficou limpo. Toca no fole para recomeçar.`, sci: `Relógio a zero, quadro apagado.` },
        empty: { kid: `Ainda não há gás no cilindro. Toca primeiro no fole.`, sci: `Não há emanação em C: sopra ar primeiro.` },
      },
      panel: {
        kid: [
          `Para apanhar o gás, Rutherford embrulhou óxido de tório em papel dentro de um tubo comprido e soprou ar através dele, para um cilindro de metal ligado a um eletrómetro. O gás passava pelo papel e por um tampão de algodão, que retém o pó. Portanto, não era pó, era um gás. Chamou-lhe «emanação», uma coisa que sai e se espalha.`,
          `Depois parou o ar e viu a leitura descer: metade em cerca de um minuto, um quarto ao fim de dois, um oitavo ao fim de três. Cada metade leva o mesmo tempo; hoje chamamos a esse tempo a meia-vida. Os teus pontos aparecem no quadro, e o controlo deslizante faz o relógio andar mais depressa ou mais devagar.`,
        ],
        sci: [
          `A montagem de 1900: uma corrente lenta de ar, vinda de um gasómetro ou de um fole, passava sobre óxido de tório num recipiente de papel A, dentro de um tubo comprido B, até um cilindro isolado C ligado a uma bateria de 100 V, com um elétrodo isolado D ligado ao eletrómetro. «A emanação atravessa um tampão de algodão sem qualquer perda dos seus poderes radioativos»; um ião não o atravessa. Parado o ar, «a corrente desce para metade do seu valor cerca de um minuto depois de a corrente de ar parar».`,
          `A sua Tabela III (100 V): 1 a 0 s, 0,69 a 28 s, 0,51 a 62 s, 0,23 a 118 s, 0,14 a 155 s, 0,067 a 210 s, 0,041 a 272 s, 0,018 a 360 s (a amarelo no quadro). A descida é geométrica, I = I₀e^(−λt): trata-se do torão, Rn-220, meia-vida 55,6 s (λ = 0,0125 s⁻¹), que os pontos brancos seguem.`,
        ],
      },
    },
    cold: {
      label: `A armadilha fria`,
      title: `Um gás que congela`,
      slider: `Dias depois`,
      sliderFmt: `{n} {days} depois, resta {p}%`,
      days: { one: `dia`, other: `dias` },
      card: { one: `{n} dia depois`, other: `{n} dias depois` },
      labels: { air: `ar líquido` },
      hints: {
        flask: `Toca no frasco de ar líquido para o subires`,
        send: `Toca no tubo de rádio ou na caixa de tório`,
        watch: `Vê para onde vai o gás`,
        warm: `Toca no frasco para o baixares`,
        wait: `Espera enquanto o tubo aquece`,
        days: `Mexe no controlo dos dias no painel`,
        again: `Toca numa fonte para mandar mais gás`,
      },
      buttons: { flask: `Subir ou baixar o ar líquido`, ra: `Mandar a emanação do rádio`, th: `Mandar a emanação do tório` },
      says: {
        up: { kid: `O frasco sobe, e o tubo de vidro em U fica mergulhado em ar líquido, a mais de 190 graus abaixo de zero.`, sci: `O tubo em U fica mergulhado em ar líquido, a cerca de −190 °C.` },
        down: { kid: `O frasco desce, e o tubo em U aquece.`, sci: `Ar líquido retirado: o tubo em U aquece.` },
        warming: { kid: `O tubo está a aquecer... ainda nada...`, sci: `A aquecer: a emanação condensada fica onde está até a armadilha passar o seu ponto de volatilização.` },
        sendRa: { kid: `Aperta! O gás do rádio parte ao longo do tubo.`, sci: `A emanação do rádio é levada por uma corrente lenta de ar.` },
        sendTh: { kid: `Aperta! O gás do tório parte ao longo do tubo.`, sci: `A emanação do tório é levada por uma corrente lenta de ar.` },
        trapped: { kid: `O gás congelou no tubo em U frio! Não sai nada do outro lado, e o vidro brilha onde o gás ficou preso.`, sci: `Condensada: nenhuma emanação sai da armadilha, e a sua radiação faz o vidro fosforescer.` },
        trappedTh: { kid: `O gás do tório congelou no tubo em U frio! Mas despacha-te: congelado ou não, metade dele desaparece a cada minuto.`, sci: `Torão condensado. Decai ao mesmo ritmo à temperatura do ar líquido, por isso não esperes muito.` },
        passed: { kid: `O tubo estava quente, por isso o gás passou direitinho para o frasco de vidro, e o ecrã brilha!`, sci: `Sem arrefecimento: a emanação passa para o recipiente, e o ecrã de sulfureto de zinco e a willemite fosforescem.` },
        rush: { kid: `Zás! O gás sai todo de uma vez e o ecrã acende-se!`, sci: `Volatilizada de repente: a emanação precipita-se para o recipiente, «sobretudo no caso do rádio».` },
        gone: { kid: `Quase não saiu nada: o gás do tório desapareceu enquanto estava congelado.`, sci: `Resta pouco: o torão decaiu na armadilha.` },
        thGone: { kid: `O gás do tório já desapareceu. O do rádio dura muito mais: experimenta-o!`, sci: `O torão desaparece em poucos minutos. Experimenta a emanação do rádio.` },
        days: { kid: `{n} {days} depois, resta {p}% do gás do rádio. Metade desaparece a cada 3,8 dias.`, sci: `Ao fim de {n} {days}: resta {p}% (Rn-222, meia-vida 3,82 dias).` },
        daysTh: { kid: `Nessa altura, o gás do tório já teria desaparecido há muito: dura só minutos.`, sci: `O torão teria desaparecido em poucos minutos.` },
        empty: { kid: `Ainda não há gás no frasco. Manda algum primeiro.`, sci: `O recipiente está vazio.` },
      },
      panel: {
        kid: [
          `Em 1903, Rutherford e Frederick Soddy mandaram a emanação por um tubo mergulhado em ar líquido, a mais de 190 graus abaixo de zero. Congelou lá dentro e não saiu nada do outro lado. Quando tiraram o ar líquido, o tubo aqueceu e o gás saiu todo de uma vez. Portanto, a emanação é mesmo um gás, e pode congelar como um gás.`,
          `O rádio também solta uma emanação: Friedrich Ernst Dorn descobriu-a em Halle, na Alemanha, em 1900. Dura muito mais do que a do tório: só ao fim de 3,8 dias desaparece metade. Esse gás é o rádon, o gás desta sala. Os seus raios fazem brilhar um ecrã de sulfureto de zinco e o mineral willemite.`,
        ],
        sci: [
          `Rutherford e Soddy (Phil. Mag., 1902 e maio de 1903): a emanação do tório atravessava sem alteração um tubo de platina ao rubro branco e um tubo à temperatura do dióxido de carbono sólido; à temperatura do ar líquido, as duas emanações condensavam. Retirado o ar líquido, passavam vários minutos até o eletrómetro se mexer, e depois a emanação volatilizava-se de repente, «sobretudo no caso do rádio». O torão congelado decai ao ritmo habitual. Rutherford situou a condensação a cerca de −120 °C para a emanação do tório e −150 °C para a do rádio (Radio-activity, 1904).`,
          `A emanação do rádio condensada num tubo de vidro em U denuncia-se pela fosforescência que provoca no vidro; um ecrã de sulfureto de zinco e a willemite brilham intensamente nela, e o brilho é «ainda apreciável ao fim de várias semanas» (Radio-activity, 1904). Dorn descreveu a emanação do rádio em 1900: Rn-222, meia-vida 3,82 dias. Nesta sala a armadilha aquece em segundos, não em minutos.`,
        ],
      },
    },
  },

  pl: {
    title: `Laboratorium Rutherforda, Montreal, 1899`,
    greet: {
      kid: `Jesteśmy w środku obrazu: w laboratorium fizyki Uniwersytetu McGill w Montrealu, w śnieżną zimową noc 1899 roku. Pracował tu Ernest Rutherford i coś ciągle psuło pomiary. Odkryjesz co? Historia obrazu jest na sztaludze obok ciebie.`,
      sci: `Budynek Fizyki im. Macdonalda Uniwersytetu McGill, Montreal, lata 1899 do 1903: płytki z torem Owensa, rura Rutherforda z 1900 roku i pułapka z ciekłym powietrzem Rutherforda i Soddy’ego z 1903 roku. Historia obrazu jest na sztaludze.`,
    },
    talk: {
      kid: [
        `Jestem Radon, a gaz z toru to też radon: lżejszy rodzaj mojego atomu, zwany toronem. Wytrzymuje około minuty. Mój rodzaj, ten z radu, wytrzymuje kilka dni.`,
        `Ernest Rutherford dorastał w Nowej Zelandii i przyjechał tu z Cambridge w 1898 roku, mając 27 lat. Wiele lat później odkrył jądro, maleńkie serce każdego atomu.`,
        `Czujesz zimno z korytarza? W zimową noc każde otwarte drzwi puszczają przez salę przeciąg, a przeciąg wywiewał gaz spomiędzy płytek.`,
      ],
      sci: [
        `W każdym szeregu promieniotwórczym znaleziono jedną emanację: toron (Rn-220, szereg torowy, 55,6 s), radon (Rn-222, szereg uranowy, 3,82 dnia) i aktynon (Rn-219, szereg aktynowy, około 4 s). Wszystkie trzy to izotopy pierwiastka 86.`,
        `Rutherford był profesorem fizyki (katedra Macdonalda) na McGill w latach 1898 do 1907. Jego Nagroda Nobla z chemii z 1908 roku była „za badania nad rozpadem pierwiastków i chemią substancji promieniotwórczych”, pracę wykonaną w dużej mierze w tym budynku.`,
        `Równomierny spadek emanacji, ten sam ułamek tracony w każdym równym odcinku czasu, pomógł Rutherfordowi i Soddy’emu dojść do ich teorii z lat 1902 i 1903: atomy promieniotwórcze przemieniają się w atomy innych pierwiastków.`,
      ],
    },
    owens: {
      label: `Płytki Owensa`,
      title: `Odczyt, który nie chciał stać w miejscu`,
      slider: `Otwarte okno`,
      sliderFmt: `otwarte w {p}%`,
      hints: {
        door: `Dotknij drzwi na końcu sali`,
        close: `Dotknij drzwi jeszcze raz, żeby je zamknąć`,
        lid: `Dotknij szklanej osłony, żeby opuścić ją na płytki`,
        test: `Teraz dotknij drzwi przy opuszczonej osłonie`,
        done: `Dotknij okna albo szklanej osłony`,
      },
      buttons: { door: `Otwórz albo zamknij drzwi`, win: `Otwórz albo zamknij okno`, lid: `Opuść albo podnieś szklaną osłonę` },
      says: {
        open: { kid: `Drzwi są otwarte! Wpada zimne powietrze i patrz: turkusowy gaz zostaje wywiany spomiędzy płytek. Plamka światła spada i drży.`, sci: `Drzwi otwarte: przeciąg wymiata emanację spomiędzy płytek; prąd jonizacji spada i waha się z podmuchami.` },
        close: { kid: `Drzwi zamknięte. Gaz znów zbiera się między płytkami, a plamka światła wraca w górę.`, sci: `Drzwi zamknięte: emanacja znów narasta do stałej wartości.` },
        openCase: { kid: `Drzwi są otwarte, ale płytki są pod szklaną osłoną. Przeciąg nie może wywiać gazu, więc plamka światła stoi spokojnie!`, sci: `Gdy płytki są osłonięte, przeciąg nie sięga emanacji i odczyt pozostaje stały, jak w zamkniętym naczyniu Rutherforda.` },
        caseDown: { kid: `Szklana osłona zjeżdża na płytki. Teraz wypróbuj drzwi!`, sci: `Płytki są osłonięte: zamknięte naczynie.` },
        caseUp: { kid: `Osłona idzie w górę. Płytki znów są otwarte na powietrze.`, sci: `Osłona podniesiona: płytki znów są wystawione na ruchy powietrza.` },
        window: { kid: `Okno się otwiera: łagodniejszy przeciąg, a plamka światła trochę opada.`, sci: `Okno otwarte: słabszy ruch powietrza, mniejszy spadek.` },
        windowCase: { kid: `Okno się otwiera, ale płytki są bezpieczne pod szklaną osłoną.`, sci: `Okno otwarte; osłonięte płytki tego nie czują.` },
        windowShut: { kid: `Okno jest zamknięte.`, sci: `Okno zamknięte.` },
      },
      panel: {
        kid: [
          `W 1899 roku Robert Owens, tutejszy profesor, mierzył promienie toru. Promienie sprawiają, że powietrze między dwiema metalowymi płytkami przewodzi maleńki prąd, a elektrometr go mierzy: tutaj plamka światła przesuwa się po skali. Ale jego odczyty ciągle skakały.`,
          `Ernest Rutherford znalazł przyczynę: zmieniało je nawet otwarcie drzwi na końcu sali. Dotknij drzwi, otwórz okno, potem opuść szklaną osłonę i spróbuj drzwi jeszcze raz. Tor wydziela gaz, a poruszające się powietrze wywiewa go spomiędzy płytek. Pod zamkniętą osłoną odczyt jest stały.`,
        ],
        sci: [
          `R. B. Owens (Phil. Mag., październik 1899) stwierdził, że promieniowanie tlenku toru w otwartych naczyniach jest niestałe, i przypisał to ruchom powietrza. Rutherford (Phil. Mag. 49, 1, styczeń 1900) mierzył prąd jonizacji między równoległymi płytkami odległymi o 4 cm elektrometrem kwadrantowym Thomsona: „otwarcie lub zamknięcie drzwi na końcu sali” wyraźnie zmieniało szybkość rozładowania, a „w zamkniętym naczyniu” natężenie było „praktycznie stałe”, ustalone po kilku minutach.`,
          `Przyczyna: związki toru wydzielają promieniotwórczą „emanację” (jego słowo, wybrane „dla zwięzłości”), która jonizuje powietrze wszędzie, dokąd zostanie zaniesiona. Plamka światła pokazuje tu prąd wprost; w prawdziwym przyrządzie plamka odbita od lusterka wskazówki przesuwała się po skali, a szybkość tego przesuwu była miarą prądu. Czas emanacji płynie w tej sali 10 razy szybciej.`,
        ],
      },
    },
    tube: {
      label: `Rura Rutherforda`,
      title: `Połowa w około minutę`,
      slider: `Szybkość zegara`,
      sliderFmt: `{k} razy szybciej`,
      realTime: `czas rzeczywisty`,
      labels: { paper: `tlenek toru w papierze`, wool: `wata` },
      board: { axisX: `minuty od zatrzymania powietrza`, axisY: `odczyt`, mine: `twoje punkty`, theirs: `Rutherford, 1900` },
      hints: {
        blow: `Dotknij miecha, żeby przedmuchać rurę`,
        fill: `Patrz, jak gaz wypełnia cylinder`,
        wool: `Dotknij waty, żeby ją wyjąć`,
        woolBack: `Dotknij waty, żeby ją włożyć z powrotem`,
        stop: `Dotknij stopera, żeby zatrzymać powietrze`,
        run: `Patrz na plamkę światła i na tablicę`,
        again: `Dotknij miecha, żeby znów napełnić rurę`,
      },
      buttons: { blow: `Przedmuchaj powietrzem`, wool: `Wyjmij albo włóż watę`, stop: `Zatrzymaj powietrze i włącz zegar` },
      says: {
        blow: { kid: `Fu, fu! Powietrze niesie gaz z toru wzdłuż rury, przez watę, do dużego cylindra. Plamka światła idzie w górę.`, sci: `Powietrze opływa tlenek toru; emanacja zostaje przeniesiona przez watę do cylindra C, gdzie jonizuje powietrze między C a elektrodą D.` },
        woolOut: { kid: `Wata wyjęta, a plamka światła stoi dokładnie tak samo.`, sci: `Korek wyjęty: prąd bez zmian.` },
        woolIn: { kid: `Wata znowu w środku, a odczyt wciąż ten sam! Pył utknąłby w wacie, a to przechodzi na wylot: to gaz.`, sci: `Korek z powrotem, bez strat: „Emanacja przechodzi przez korek z waty bez żadnej utraty swych właściwości promieniotwórczych.” Wata zatrzymuje pył, a także jony.` },
        stop: { kid: `Powietrze staje, a zegar rusza. Patrz na plamkę światła: czy gaz zachowa swoją moc?`, sci: `Powietrze zatrzymane w chwili t = 0. Co 30 s na tablicy pojawia się punkt: prąd jako ułamek wartości z chwili zatrzymania.` },
        half: { kid: `Około minuty: plamka światła spadła do połowy!`, sci: `t = 56 s: prąd spadł do połowy.` },
        quarter: { kid: `Dwie minuty: około ćwierci. Co minutę znowu spada o połowę!`, sci: `t = 111 s: ćwierć. Równe czasy, równe ułamki: zanik wykładniczy.` },
        eighth: { kid: `Trzy minuty: jedna ósma. Połowa, potem znów połowa i jeszcze raz połowa.`, sci: `t = 167 s: jedna ósma.` },
        done: { kid: `Sześć minut: prawie nic nie zostało. Rutherford potrafił to mierzyć jeszcze przez ponad dziesięć minut.`, sci: `t = 6 min: około 1/90 wartości początkowej. Rutherford: prąd „utrzymywał się przez ponad dziesięć minut”.` },
        running: { kid: `Zegar wciąż chodzi. Patrz, jak plamka światła spada!`, sci: `Pomiar wciąż trwa.` },
        wipe: { kid: `Zegar wrócił do zera, a tablica jest czysta. Dotknij miecha, żeby zacząć od nowa.`, sci: `Zegar wyzerowany, tablica starta.` },
        empty: { kid: `W cylindrze nie ma jeszcze gazu. Najpierw dotknij miecha.`, sci: `W C nie ma emanacji: najpierw przedmuchaj powietrzem.` },
      },
      panel: {
        kid: [
          `Żeby złapać gaz, Rutherford zawinął tlenek toru w papier w długiej rurze i przedmuchiwał ją powietrzem do metalowego cylindra połączonego z elektrometrem. Gaz przechodził przez papier i przez korek z waty, który zatrzymuje pył. Więc to nie był pył, tylko gaz. Nazwał go „emanacją”, czymś, co wypływa.`,
          `Potem zatrzymał powietrze i patrzył, jak odczyt spada: do połowy w około minutę, do ćwierci po dwóch, do jednej ósmej po trzech. Każda połowa trwa tyle samo; dziś ten czas nazywamy okresem półtrwania. Twoje punkty pojawiają się na tablicy, a suwak sprawia, że zegar chodzi szybciej albo wolniej.`,
        ],
        sci: [
          `Układ z 1900 roku: powolny strumień powietrza z gazometru lub miecha przepływał nad tlenkiem toru w papierowym naczyniu A, wewnątrz długiej rury B, do izolowanego cylindra C podłączonego do baterii 100 V, z izolowaną elektrodą D połączoną z elektrometrem. „Emanacja przechodzi przez korek z waty bez żadnej utraty swych właściwości promieniotwórczych”; jon nie przechodzi. Po zatrzymaniu powietrza „prąd spada do połowy wartości po około minucie od zatrzymania przepływu powietrza”.`,
          `Jego Tabela III (100 V): 1 przy 0 s, 0,69 przy 28 s, 0,51 przy 62 s, 0,23 przy 118 s, 0,14 przy 155 s, 0,067 przy 210 s, 0,041 przy 272 s, 0,018 przy 360 s (na żółto na tablicy). Spadek jest geometryczny, I = I₀e^(−λt): to toron, Rn-220, okres półtrwania 55,6 s (λ = 0,0125 s⁻¹), za którym idą białe punkty.`,
        ],
      },
    },
    cold: {
      label: `Zimna pułapka`,
      title: `Gaz, który zamarza`,
      slider: `Dni później`,
      sliderFmt: `po {n} {days}: zostało {p}%`,
      days: { one: `dniu`, other: `dniach` },
      card: { one: `po {n} dniu`, other: `po {n} dniach` },
      labels: { air: `ciekłe powietrze` },
      hints: {
        flask: `Dotknij naczynia z ciekłym powietrzem, żeby je podnieść`,
        send: `Dotknij rurki z radem albo pudełka z torem`,
        watch: `Patrz, dokąd idzie gaz`,
        warm: `Dotknij naczynia, żeby je opuścić`,
        wait: `Poczekaj, aż rurka się ogrzeje`,
        days: `Przesuń suwak dni w panelu`,
        again: `Dotknij źródła, żeby wysłać więcej gazu`,
      },
      buttons: { flask: `Podnieś albo opuść ciekłe powietrze`, ra: `Wyślij emanację radu`, th: `Wyślij emanację toru` },
      says: {
        up: { kid: `Naczynie idzie w górę i szklana rurka w kształcie litery U siedzi w ciekłym powietrzu, zimniejszym niż −190 °C.`, sci: `Rurka U jest zanurzona w ciekłym powietrzu, w około −190 °C.` },
        down: { kid: `Naczynie idzie w dół i rurka U się ogrzewa.`, sci: `Ciekłe powietrze usunięte: rurka U się ogrzewa.` },
        warming: { kid: `Rurka się ogrzewa... jeszcze nic...`, sci: `Ogrzewanie: skroplona emanacja zostaje na miejscu, dopóki pułapka nie przekroczy jej temperatury parowania.` },
        sendRa: { kid: `Ściśnij! Gaz z radu rusza wzdłuż rurki.`, sci: `Emanacja radu jest niesiona powolnym strumieniem powietrza.` },
        sendTh: { kid: `Ściśnij! Gaz z toru rusza wzdłuż rurki.`, sci: `Emanacja toru jest niesiona powolnym strumieniem powietrza.` },
        trapped: { kid: `Gaz zamarzł w zimnej rurce U! Z drugiej strony nic nie wychodzi, a szkło świeci tam, gdzie gaz utknął.`, sci: `Skroplona: żadna emanacja nie opuszcza pułapki, a jej promieniowanie pobudza szkło do fosforescencji.` },
        trappedTh: { kid: `Gaz z toru zamarzł w zimnej rurce U! Ale pospiesz się: zamarznięty czy nie, co minutę znika jego połowa.`, sci: `Toron skroplony. W temperaturze ciekłego powietrza rozpada się w tym samym tempie, więc nie czekaj długo.` },
        passed: { kid: `Rurka była ciepła, więc gaz przeszedł prosto do szklanego słoja i ekran świeci!`, sci: `Bez chłodzenia: emanacja przechodzi do naczynia, a ekran z siarczku cynku i willemit fosforyzują.` },
        rush: { kid: `Szuuu! Gaz wychodzi cały naraz i ekran się rozświetla!`, sci: `Nagle odparowana: emanacja wpada do naczynia, „zwłaszcza w przypadku radu”.` },
        gone: { kid: `Prawie nic nie wyszło: gaz z toru zniknął, kiedy był zamarznięty.`, sci: `Niewiele zostało: toron rozpadł się w pułapce.` },
        thGone: { kid: `Gaz z toru już zniknął. Gaz z radu wytrzymuje dużo dłużej: wypróbuj go!`, sci: `Toron znika w ciągu kilku minut. Wypróbuj emanację radu.` },
        days: { kid: `Po {n} {days} zostało {p}% gazu z radu. Połowa znika co 3,8 dnia.`, sci: `Po {n} {days}: zostało {p}% (Rn-222, okres półtrwania 3,82 dnia).` },
        daysTh: { kid: `Gazu z toru dawno by już nie było: wytrzymuje tylko kilka minut.`, sci: `Toron zniknąłby w ciągu kilku minut.` },
        empty: { kid: `W słoju nie ma jeszcze gazu. Najpierw jakiś wyślij.`, sci: `Naczynie jest puste.` },
      },
      panel: {
        kid: [
          `W 1903 roku Rutherford i Frederick Soddy przepuścili emanację przez rurkę zanurzoną w ciekłym powietrzu, zimniejszym niż −190 °C. Zamarzła tam i z drugiej strony nic nie wyszło. Kiedy zabrali ciekłe powietrze, rurka się ogrzała i gaz wyszedł cały naraz. Więc emanacja naprawdę jest gazem i może zamarznąć jak gaz.`,
          `Rad też wydziela emanację: Friedrich Ernst Dorn odkrył ją w Halle w Niemczech w 1900 roku. Wytrzymuje dużo dłużej niż emanacja toru: połowa znika dopiero po 3,8 dnia. Ten gaz to radon, gaz tej sali. Jego promienie sprawiają, że świeci ekran z siarczku cynku i minerał willemit.`,
        ],
        sci: [
          `Rutherford i Soddy (Phil. Mag., 1902 i maj 1903): emanacja toru przechodziła bez zmian przez rurkę platynową rozgrzaną do białości i przez rurkę w temperaturze stałego dwutlenku węgla; w temperaturze ciekłego powietrza obie emanacje się skraplały. Po usunięciu ciekłego powietrza mijało kilka minut, zanim elektrometr drgnął, a potem emanacja nagle odparowywała, „zwłaszcza w przypadku radu”. Zamrożony toron rozpada się w zwykłym tempie. Rutherford oszacował temperaturę skraplania na około −120 °C dla emanacji toru i −150 °C dla emanacji radu (Radio-activity, 1904).`,
          `Emanacja radu skroplona w szklanej rurce U zdradza się fosforescencją, którą wywołuje w szkle; ekran z siarczku cynku i willemit świecą w niej jasno, a blask jest „wciąż wyraźny po upływie kilku tygodni” (Radio-activity, 1904). Dorn opisał emanację radu w 1900 roku: Rn-222, okres półtrwania 3,82 dnia. W tej sali pułapka ogrzewa się w sekundy, nie w minuty.`,
        ],
      },
    },
  },

  de: {
    title: `Rutherfords Labor, Montreal, 1899`,
    greet: {
      kid: `Wir sind im Bild: in einem Physiklabor der McGill-Universität in Montreal, in einer verschneiten Winternacht im Jahr 1899. Hier arbeitete Ernest Rutherford, und irgendetwas verdarb ständig die Messungen. Findest du heraus, was? Die Geschichte des Bildes steht auf der Staffelei neben dir.`,
      sci: `Das Macdonald-Physikgebäude der McGill-Universität, Montreal, 1899 bis 1903: Owens’ Thoriumplatten, Rutherfords Rohr von 1900 und Rutherfords und Soddys Falle mit flüssiger Luft von 1903. Die Geschichte des Bildes steht auf der Staffelei.`,
    },
    talk: {
      kid: [
        `Ich bin das Radon, und das Gas aus dem Thorium ist auch Radon: eine leichtere Sorte meines Atoms, Thoron genannt. Es hält etwa eine Minute. Meine Sorte, die aus dem Radium, hält Tage.`,
        `Ernest Rutherford wuchs in Neuseeland auf und kam 1898 aus Cambridge hierher, mit 27 Jahren. Jahre später entdeckte er den Atomkern, das winzige Herz jedes Atoms.`,
        `Spürst du die Kälte aus dem Flur? In einer Winternacht schickt jede offene Tür einen Luftzug durch den Raum, und der Luftzug trug das Gas zwischen den Platten fort.`,
      ],
      sci: [
        `In jeder radioaktiven Zerfallsreihe fand man eine Emanation: Thoron (Rn-220, Thoriumreihe, 55,6 s), Radon (Rn-222, Uranreihe, 3,82 Tage) und Actinon (Rn-219, Actiniumreihe, etwa 4 s). Alle drei sind Isotope des Elements 86.`,
        `Rutherford war von 1898 bis 1907 Macdonald-Professor für Physik an der McGill. Sein Nobelpreis für Chemie von 1908 war „für seine Untersuchungen über den Zerfall der Elemente und die Chemie der radioaktiven Stoffe“, Arbeit, die großenteils in diesem Gebäude entstand.`,
        `Der gleichmäßige Abfall der Emanation, in gleichen Zeiten immer derselbe Bruchteil, half Rutherford und Soddy zu ihrer Theorie von 1902 und 1903: Radioaktive Atome wandeln sich in Atome anderer Elemente um.`,
      ],
    },
    owens: {
      label: `Owens’ Platten`,
      title: `Der Messwert, der nicht stillhielt`,
      slider: `Fenster offen`,
      sliderFmt: `{p}% offen`,
      hints: {
        door: `Tippe auf die Tür am Ende des Raums`,
        close: `Tippe noch einmal auf die Tür, um sie zu schließen`,
        lid: `Tippe auf den Glaskasten, um ihn über die Platten zu senken`,
        test: `Tippe jetzt bei gesenktem Kasten auf die Tür`,
        done: `Tippe auf das Fenster oder den Glaskasten`,
      },
      buttons: { door: `Tür öffnen oder schließen`, win: `Fenster öffnen oder schließen`, lid: `Glaskasten senken oder heben` },
      says: {
        open: { kid: `Die Tür ist offen! Kalte Luft strömt herein, und schau: Das türkisfarbene Gas wird zwischen den Platten herausgeblasen. Der Lichtfleck fällt und zittert.`, sci: `Tür offen: Der Luftzug fegt die Emanation zwischen den Platten heraus; der Ionisationsstrom sinkt und schwankt mit den Böen.` },
        close: { kid: `Tür zu. Das Gas sammelt sich wieder zwischen den Platten, und der Lichtfleck steigt zurück.`, sci: `Tür geschlossen: Die Emanation baut sich wieder bis zu ihrem stetigen Wert auf.` },
        openCase: { kid: `Die Tür ist offen, aber die Platten sind im Glaskasten. Der Luftzug kann das Gas nicht wegblasen, also bleibt der Lichtfleck ruhig!`, sci: `Bei eingeschlossenen Platten erreicht der Luftzug die Emanation nicht, und der Messwert bleibt konstant, wie in Rutherfords geschlossenem Gefäß.` },
        caseDown: { kid: `Der Glaskasten senkt sich über die Platten. Probier jetzt die Tür!`, sci: `Die Platten sind eingeschlossen: ein geschlossenes Gefäß.` },
        caseUp: { kid: `Der Kasten geht hoch. Die Platten sind wieder offen zur Luft.`, sci: `Kasten gehoben: Die Platten sind wieder den Luftströmungen ausgesetzt.` },
        window: { kid: `Das Fenster geht auf: ein sanfterer Luftzug, und der Lichtfleck sinkt ein wenig.`, sci: `Fenster offen: eine schwächere Luftströmung, ein kleinerer Abfall.` },
        windowCase: { kid: `Das Fenster geht auf, aber die Platten sind im Glaskasten sicher.`, sci: `Fenster offen; die eingeschlossenen Platten spüren es nicht.` },
        windowShut: { kid: `Das Fenster ist zu.`, sci: `Fenster geschlossen.` },
      },
      panel: {
        kid: [
          `1899 maß Robert Owens, ein Professor hier, die Strahlen des Thoriums. Die Strahlen lassen die Luft zwischen zwei Metallplatten einen winzigen elektrischen Strom leiten, und ein Elektrometer misst ihn: Hier wandert ein Lichtfleck über eine Skala. Aber seine Messwerte sprangen ständig hin und her.`,
          `Ernest Rutherford fand den Grund: Schon das Öffnen einer Tür am Ende des Raums veränderte sie. Tippe auf die Tür, öffne das Fenster, dann senke den Glaskasten und probier die Tür noch einmal. Thorium gibt ein Gas ab, und bewegte Luft bläst es zwischen den Platten weg. In einem geschlossenen Kasten bleibt der Messwert stetig.`,
        ],
        sci: [
          `R. B. Owens (Phil. Mag., Oktober 1899) fand die Strahlung von Thoriumoxid in offenen Gefäßen unbeständig und führte das auf Luftströmungen zurück. Rutherford (Phil. Mag. 49, 1, Januar 1900) maß den Ionisationsstrom zwischen parallelen Platten im Abstand von 4 cm mit einem Thomson-Quadrantenelektrometer: „das Öffnen oder Schließen einer Tür am Ende des Raums“ veränderte die Entladungsgeschwindigkeit deutlich, während die Intensität „in einem geschlossenen Gefäß“ „praktisch konstant“ war, stetig nach wenigen Minuten.`,
          `Die Ursache: Thoriumverbindungen geben eine radioaktive „Emanation“ ab (sein Wort, gewählt „der Kürze halber“), die die Luft ionisiert, wohin sie auch getragen wird. Der Lichtfleck zeigt hier den Strom direkt; am echten Instrument wanderte der vom Spiegel der Nadel zurückgeworfene Fleck über die Skala, und die Geschwindigkeit dieses Wanderns war der Strom. Die Zeit der Emanation läuft in diesem Raum 10-mal schneller.`,
        ],
      },
    },
    tube: {
      label: `Rutherfords Rohr`,
      title: `Die Hälfte in etwa einer Minute`,
      slider: `Tempo der Uhr`,
      sliderFmt: `{k}-mal schneller`,
      realTime: `Echtzeit`,
      labels: { paper: `Thoriumoxid in Papier`, wool: `Watte` },
      board: { axisX: `Minuten nach dem Abstellen der Luft`, axisY: `Messwert`, mine: `deine Punkte`, theirs: `Rutherford, 1900` },
      hints: {
        blow: `Tippe auf den Blasebalg, um Luft durch das Rohr zu blasen`,
        fill: `Schau, wie das Gas den Zylinder füllt`,
        wool: `Tippe auf die Watte, um sie herauszunehmen`,
        woolBack: `Tippe auf die Watte, um sie wieder einzusetzen`,
        stop: `Tippe auf die Stoppuhr, um die Luft abzustellen`,
        run: `Schau auf den Lichtfleck und die Tafel`,
        again: `Tippe auf den Blasebalg, um das Rohr wieder zu füllen`,
      },
      buttons: { blow: `Luft durchblasen`, wool: `Watte herausnehmen oder einsetzen`, stop: `Luft abstellen und Uhr starten` },
      says: {
        blow: { kid: `Puff, puff! Die Luft trägt das Gas aus dem Thorium durch das Rohr, durch die Watte, in den großen Zylinder. Der Lichtfleck steigt.`, sci: `Luft strömt über das Thoriumoxid; die Emanation wird durch die Watte in den Zylinder C getragen, wo sie die Luft zwischen C und der Elektrode D ionisiert.` },
        woolOut: { kid: `Watte raus, und der Lichtfleck bleibt genau gleich.`, sci: `Pfropfen entfernt: Der Strom bleibt unverändert.` },
        woolIn: { kid: `Watte wieder drin, und immer noch derselbe Messwert! Staub würde in der Watte hängen bleiben, aber das hier geht glatt hindurch: Es ist ein Gas.`, sci: `Pfropfen wieder drin, kein Verlust: „Die Emanation geht durch einen Wattepfropfen, ohne etwas von ihrer radioaktiven Kraft zu verlieren.“ Watte hält Staub zurück, und auch Ionen.` },
        stop: { kid: `Die Luft hört auf, und die Uhr läuft los. Schau auf den Lichtfleck: Behält das Gas seine Kraft?`, sci: `Luft abgestellt bei t = 0. Alle 30 s kommt ein Punkt an die Tafel: der Strom als Bruchteil seines Werts beim Abstellen.` },
        half: { kid: `Etwa eine Minute: Der Lichtfleck ist auf die Hälfte gefallen!`, sci: `t = 56 s: Der Strom ist auf die Hälfte gefallen.` },
        quarter: { kid: `Zwei Minuten: etwa ein Viertel. Jede Minute halbiert er sich wieder!`, sci: `t = 111 s: ein Viertel. Gleiche Zeiten, gleiche Bruchteile: ein exponentieller Zerfall.` },
        eighth: { kid: `Drei Minuten: ein Achtel. Die Hälfte, dann wieder die Hälfte, dann noch einmal die Hälfte.`, sci: `t = 167 s: ein Achtel.` },
        done: { kid: `Sechs Minuten: Fast nichts ist mehr übrig. Rutherford konnte es noch über zehn Minuten lang messen.`, sci: `t = 6 min: etwa 1/90 des Anfangs. Rutherford: Der Strom „hielt über zehn Minuten an“.` },
        running: { kid: `Die Uhr läuft noch. Schau, wie der Lichtfleck fällt!`, sci: `Die Messung läuft noch.` },
        wipe: { kid: `Die Uhr steht wieder auf null, und die Tafel ist sauber gewischt. Tippe auf den Blasebalg, um neu anzufangen.`, sci: `Uhr zurückgesetzt, Tafel gewischt.` },
        empty: { kid: `Im Zylinder ist noch kein Gas. Tippe zuerst auf den Blasebalg.`, sci: `Keine Emanation in C: zuerst Luft durchblasen.` },
      },
      panel: {
        kid: [
          `Um das Gas einzufangen, wickelte Rutherford Thoriumoxid in Papier, legte es in ein langes Rohr und blies Luft hindurch, in einen Metallzylinder, der mit einem Elektrometer verbunden war. Das Gas ging durch das Papier und durch einen Wattepfropfen, der Staub zurückhält. Es war also kein Staub, sondern ein Gas. Er nannte es „Emanation“, etwas, das herausströmt.`,
          `Dann stellte er die Luft ab und sah den Messwert fallen: auf die Hälfte in etwa einer Minute, auf ein Viertel nach zwei, auf ein Achtel nach drei. Jede Hälfte dauert gleich lang; heute nennen wir diese Zeit die Halbwertszeit. Deine Punkte erscheinen an der Tafel, und der Schieberegler lässt die Uhr schneller oder langsamer laufen.`,
        ],
        sci: [
          `Der Aufbau von 1900: Ein langsamer Luftstrom aus einem Gasometer oder Blasebalg strich über Thoriumoxid in einem Papiergefäß A, in einem langen Rohr B, in einen isolierten Zylinder C an einer Batterie von 100 V, mit einer isolierten Elektrode D am Elektrometer. „Die Emanation geht durch einen Wattepfropfen, ohne etwas von ihrer radioaktiven Kraft zu verlieren“; ein Ion kann das nicht. Bei abgestellter Luft „sinkt der Strom etwa eine Minute nach dem Abstellen des Luftstroms auf die Hälfte“.`,
          `Seine Tabelle III (100 V): 1 bei 0 s, 0,69 bei 28 s, 0,51 bei 62 s, 0,23 bei 118 s, 0,14 bei 155 s, 0,067 bei 210 s, 0,041 bei 272 s, 0,018 bei 360 s (gelb an der Tafel). Der Abfall ist geometrisch, I = I₀e^(−λt): Das ist Thoron, Rn-220, Halbwertszeit 55,6 s (λ = 0,0125 s⁻¹), dem die weißen Punkte folgen.`,
        ],
      },
    },
    cold: {
      label: `Die Kältefalle`,
      title: `Ein Gas, das gefriert`,
      slider: `Tage später`,
      sliderFmt: `{n} {days} später, {p}% übrig`,
      days: { one: `Tag`, other: `Tage` },
      card: { one: `{n} Tag später`, other: `{n} Tage später` },
      labels: { air: `flüssige Luft` },
      hints: {
        flask: `Tippe auf das Gefäß mit flüssiger Luft, um es anzuheben`,
        send: `Tippe auf das Radiumröhrchen oder die Thoriumkiste`,
        watch: `Schau, wohin das Gas geht`,
        warm: `Tippe auf das Gefäß, um es zu senken`,
        wait: `Warte, bis das Rohr warm wird`,
        days: `Bewege den Tage-Regler im Feld`,
        again: `Tippe auf eine Quelle, um mehr Gas zu schicken`,
      },
      buttons: { flask: `Flüssige Luft heben oder senken`, ra: `Emanation des Radiums schicken`, th: `Emanation des Thoriums schicken` },
      says: {
        up: { kid: `Das Gefäß kommt hoch, und das gläserne U-Rohr steckt in flüssiger Luft, kälter als −190 °C.`, sci: `Das U-Rohr taucht in flüssige Luft, bei etwa −190 °C.` },
        down: { kid: `Das Gefäß geht nach unten, und das U-Rohr wird warm.`, sci: `Flüssige Luft entfernt: Das U-Rohr erwärmt sich.` },
        warming: { kid: `Das Rohr wird warm... noch nichts...`, sci: `Erwärmung: Die kondensierte Emanation bleibt, wo sie ist, bis die Falle ihren Verdampfungspunkt überschreitet.` },
        sendRa: { kid: `Drücken! Das Gas des Radiums macht sich auf den Weg durch das Rohr.`, sci: `Die Emanation des Radiums wird von einem langsamen Luftstrom mitgetragen.` },
        sendTh: { kid: `Drücken! Das Gas des Thoriums macht sich auf den Weg durch das Rohr.`, sci: `Die Emanation des Thoriums wird von einem langsamen Luftstrom mitgetragen.` },
        trapped: { kid: `Das Gas ist im kalten U-Rohr gefroren! Am anderen Ende kommt nichts heraus, und das Glas leuchtet, wo das Gas festsitzt.`, sci: `Kondensiert: Keine Emanation verlässt die Falle, und ihre Strahlung bringt das Glas zum Phosphoreszieren.` },
        trappedTh: { kid: `Das Gas des Thoriums ist im kalten U-Rohr gefroren! Aber beeil dich: Gefroren oder nicht, jede Minute verschwindet die Hälfte.`, sci: `Thoron kondensiert. Es zerfällt bei der Temperatur flüssiger Luft genauso schnell, also warte nicht lange.` },
        passed: { kid: `Das Rohr war warm, also ging das Gas direkt in das Glasgefäß, und der Schirm leuchtet!`, sci: `Nicht gekühlt: Die Emanation gelangt ins Gefäß, und der Zinksulfidschirm und der Willemit phosphoreszieren.` },
        rush: { kid: `Wusch! Das Gas kommt auf einmal heraus, und der Schirm leuchtet auf!`, sci: `Plötzlich verdampft: Die Emanation strömt ins Gefäß, „besonders im Fall des Radiums“.` },
        gone: { kid: `Fast nichts kam heraus: Das Gas des Thoriums ist verschwunden, während es gefroren war.`, sci: `Wenig übrig: Das Thoron ist in der Falle zerfallen.` },
        thGone: { kid: `Das Gas des Thoriums ist schon verschwunden. Das des Radiums hält viel länger: Probier es aus!`, sci: `Das Thoron ist binnen Minuten fort. Probier die Emanation des Radiums.` },
        days: { kid: `{n} {days} später ist noch {p}% vom Gas des Radiums übrig. Alle 3,8 Tage verschwindet die Hälfte.`, sci: `{n} {days} später: {p}% übrig (Rn-222, Halbwertszeit 3,82 Tage).` },
        daysTh: { kid: `Das Gas des Thoriums wäre bis dahin längst fort: Es hält nur Minuten.`, sci: `Thoron wäre binnen Minuten fort.` },
        empty: { kid: `Im Glas ist noch kein Gas. Schick zuerst welches.`, sci: `Das Gefäß ist leer.` },
      },
      panel: {
        kid: [
          `1903 schickten Rutherford und Frederick Soddy die Emanation durch ein Rohr, das in flüssiger Luft steckte, kälter als −190 °C. Dort gefror sie, und am anderen Ende kam nichts heraus. Als sie die flüssige Luft wegnahmen, wurde das Rohr warm, und das Gas kam auf einmal heraus. Die Emanation ist also wirklich ein Gas und kann gefrieren wie eines.`,
          `Auch Radium gibt eine Emanation ab: Friedrich Ernst Dorn fand sie 1900 in Halle in Deutschland. Sie hält viel länger als die des Thoriums: Erst nach 3,8 Tagen ist die Hälfte weg. Dieses Gas ist das Radon, das Gas dieser Halle. Seine Strahlen bringen einen Zinksulfidschirm und das Mineral Willemit zum Leuchten.`,
        ],
        sci: [
          `Rutherford und Soddy (Phil. Mag., 1902 und Mai 1903): Die Emanation des Thoriums ging unverändert durch ein weißglühendes Platinrohr und durch ein Rohr bei der Temperatur festen Kohlendioxids; bei der Temperatur flüssiger Luft kondensierten beide Emanationen. Nach dem Entfernen der flüssigen Luft vergingen einige Minuten, bis sich das Elektrometer rührte, dann verdampfte die Emanation plötzlich, „besonders im Fall des Radiums“. Gefrorenes Thoron zerfällt im gewohnten Tempo. Rutherford setzte die Kondensation bei etwa −120 °C für die Emanation des Thoriums und −150 °C für die des Radiums an (Radio-activity, 1904).`,
          `Radiumemanation, in einem gläsernen U-Rohr kondensiert, verrät sich durch die Phosphoreszenz, die sie im Glas weckt; ein Zinksulfidschirm und Willemit leuchten in ihr hell, und das Leuchten ist „noch nach mehreren Wochen merklich“ (Radio-activity, 1904). Dorn beschrieb die Emanation des Radiums 1900: Rn-222, Halbwertszeit 3,82 Tage. In diesem Raum erwärmt sich die Falle in Sekunden, nicht in Minuten.`,
        ],
      },
    },
  },
}
