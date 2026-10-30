// Sodium's picture boards in its hall (docs/knowledge/hall-boards.md): a doorway into its Periodic Videos
// lab, then six pictures on the walls, each a question that makes you walk up, and the story it opens
// (Explorer and Scientist). They add to the lab (cutting sodium, sodium in water, the salt window and the
// salt lamp are there) instead of repeating it. Pictures: public/boards/Na/<id>.svg, drawn by
// tools/boards/Na/ (no words in them: the title is drawn in the visitor's language).
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  { id: 'doors', color: '#ffb21e', doors: ['videos'] },
  {
    id: 'nerves',
    color: '#ff6fa8',
    title: {
      en: 'How does your brain send a message?',
      'pt-pt': 'Como é que o teu cérebro manda mensagens?',
      pl: 'Jak twój mózg wysyła wiadomości?',
      de: 'Wie schickt dein Gehirn Nachrichten?',
    },
    story: {
      en: {
        kid: [
          'Every time you think, move or feel something, your nerves send electric messages, and sodium makes them go. When a nerve fires, tiny gates open in it, sodium rushes in and the signal races along the nerve: in your fastest nerves at up to about 120 metres a second, faster than a racing car.',
          'Afterwards little pumps push the sodium back out, ready for the next message. Your body keeps its salt in balance; tears and sweat take a little of it out with them, and that is why they taste salty.',
        ],
        sci: [
          'An action potential: voltage-gated Na+ channels open, Na+ floods into the nerve cell and the inside swings from about −70 mV to about +30 mV in about a millisecond; then K+ flows out and the cell resets. Hodgkin and Huxley worked this out on the squid giant axon (Nobel Prize in Physiology or Medicine 1963). Myelinated fibres conduct at up to about 120 m/s.',
          'The Na+/K+-ATPase keeps the gradients: for each ATP it pumps 3 Na+ out and 2 K+ in (Jens Christian Skou, Nobel Prize in Chemistry 1997), and it uses a large share of the body’s energy at rest. Na+ is the main cation outside the cells, about 140 mmol/L in blood plasma; tears carry about as much, sweat less.',
        ],
      },
      'pt-pt': {
        kid: [
          'Sempre que pensas, te mexes ou sentes alguma coisa, os teus nervos enviam mensagens elétricas, e é o sódio que as põe a andar. Quando um nervo dispara, abrem-se nele umas portinhas minúsculas, o sódio entra a correr e o sinal corre ao longo do nervo: nos teus nervos mais rápidos, até cerca de 120 metros por segundo, mais depressa do que um carro de corrida.',
          'Depois, umas pequenas bombas empurram o sódio outra vez para fora, prontas para a mensagem seguinte. O teu corpo mantém o sal em equilíbrio; as lágrimas e o suor levam um pouco dele consigo, e é por isso que sabem a sal.',
        ],
        sci: [
          'Um potencial de ação: abrem-se canais de Na+ dependentes da voltagem, o Na+ entra em massa na célula nervosa e o interior passa de cerca de −70 mV para cerca de +30 mV em cerca de um milissegundo; depois sai K+ e a célula volta ao repouso. Hodgkin e Huxley descobriram-no no axónio gigante da lula (Prémio Nobel da Fisiologia ou Medicina de 1963). As fibras mielinizadas conduzem até cerca de 120 m/s.',
          'A Na+/K+-ATPase mantém os gradientes: por cada ATP bombeia 3 Na+ para fora e 2 K+ para dentro (Jens Christian Skou, Prémio Nobel da Química de 1997) e gasta uma grande parte da energia do corpo em repouso. O Na+ é o principal catião fora das células, cerca de 140 mmol/L no plasma sanguíneo; as lágrimas têm mais ou menos o mesmo, o suor menos.',
        ],
      },
      pl: {
        kid: [
          'Za każdym razem, gdy myślisz, ruszasz się albo coś czujesz, twoje nerwy wysyłają elektryczne wiadomości, a napędza je sód. Kiedy nerw „strzela”, otwierają się w nim malutkie bramki, sód wpada do środka i sygnał pędzi wzdłuż nerwu: w najszybszych nerwach nawet około 120 metrów na sekundę, szybciej niż samochód wyścigowy.',
          'Potem małe pompy wypychają sód z powrotem, gotowe na następną wiadomość. Twoje ciało pilnuje, żeby soli było w sam raz; łzy i pot wynoszą jej trochę ze sobą i dlatego są słone.',
        ],
        sci: [
          'Potencjał czynnościowy: otwierają się bramkowane napięciem kanały Na+, Na+ wlewa się do komórki nerwowej, a potencjał wnętrza w około milisekundę zmienia się z około −70 mV do około +30 mV; potem K+ wypływa i komórka wraca do spoczynku. Hodgkin i Huxley odkryli to na olbrzymim aksonie kałamarnicy (Nagroda Nobla w dziedzinie fizjologii lub medycyny 1963). Włókna z osłonką mielinową przewodzą z prędkością do około 120 m/s.',
          'Na+/K+-ATPaza utrzymuje gradienty: na każdą cząsteczkę ATP wypompowuje 3 Na+ na zewnątrz i wpompowuje 2 K+ do środka (Jens Christian Skou, Nagroda Nobla w dziedzinie chemii 1997) i zużywa dużą część energii ciała w spoczynku. Na+ to główny kation poza komórkami, około 140 mmol/l w osoczu krwi; łzy zawierają mniej więcej tyle samo, pot mniej.',
        ],
      },
      de: {
        kid: [
          'Jedes Mal, wenn du denkst, dich bewegst oder etwas fühlst, schicken deine Nerven elektrische Nachrichten, und das Natrium bringt sie in Gang. Wenn ein Nerv feuert, öffnen sich in ihm winzige Tore, das Natrium strömt hinein, und das Signal rast den Nerv entlang: in deinen schnellsten Nerven mit bis zu etwa 120 Metern pro Sekunde, schneller als ein Rennwagen.',
          'Danach pumpen kleine Pumpen das Natrium wieder hinaus, bereit für die nächste Nachricht. Dein Körper hält sein Salz im Gleichgewicht; Tränen und Schweiß nehmen ein wenig davon mit, deshalb schmecken sie salzig.',
        ],
        sci: [
          'Ein Aktionspotenzial: Spannungsgesteuerte Na+-Kanäle öffnen sich, Na+ strömt in die Nervenzelle, und das Innere springt in etwa einer Millisekunde von etwa −70 mV auf etwa +30 mV; dann strömt K+ hinaus, und die Zelle erholt sich. Hodgkin und Huxley fanden das am Riesenaxon des Tintenfischs heraus (Nobelpreis für Physiologie oder Medizin 1963). Myelinisierte Fasern leiten mit bis zu etwa 120 m/s.',
          'Die Na+/K+-ATPase hält die Gradienten aufrecht: Pro ATP pumpt sie 3 Na+ hinaus und 2 K+ hinein (Jens Christian Skou, Nobelpreis für Chemie 1997), und sie verbraucht einen großen Teil der Energie des Körpers in Ruhe. Na+ ist das wichtigste Kation außerhalb der Zellen, etwa 140 mmol/l im Blutplasma; Tränen enthalten etwa gleich viel, Schweiß weniger.',
        ],
      },
    },
  },
  {
    id: 'salt',
    color: '#3fd6c6',
    title: {
      en: 'Why is the sea salty?',
      'pt-pt': 'Porque é que o mar é salgado?',
      pl: 'Dlaczego morze jest słone?',
      de: 'Warum ist das Meer salzig?',
    },
    story: {
      en: {
        kid: [
          'For millions of years rain has washed tiny bits of salt out of rocks, and rivers have carried them to the sea; volcanoes added more. The sun lifts the water back into the sky, but the salt stays behind.',
          'In Aveiro, in Portugal, people make salt the same way. They let seawater into shallow pools, the sun and the wind dry it up, and salt workers called marnotos rake the salt into shining white heaps. Aveiro’s salt was already written about in the year 959.',
        ],
        sci: [
          'Seawater holds about 35 g of dissolved salts per kilogram, mostly Na+ and Cl− (about 10.8 g of sodium per litre). The sodium was weathered out of rocks such as feldspars and carried by rivers; much of the chloride came from volcanic gases over Earth’s history. Evaporation takes the water and leaves the ions.',
          'In a salt pan the brine flows from pond to pond and grows saltier: calcium carbonate and gypsum come out first, and sodium chloride crystallises once about nine tenths of the water has gone. Aveiro’s salinas, named in a document of 959, still make sea salt and flor de sal, the fine crust skimmed off the surface on hot, windy days.',
        ],
      },
      'pt-pt': {
        kid: [
          'Durante milhões de anos, a chuva foi tirando bocadinhos de sal às rochas e os rios levaram-nos para o mar; os vulcões juntaram mais. O Sol leva a água de volta para o céu, mas o sal fica para trás.',
          'Em Aveiro, em Portugal, faz-se sal da mesma maneira. Deixa-se entrar água do mar em tanques pouco fundos, o sol e o vento secam-na, e os marnotos puxam o sal com o rodo para montes brancos e brilhantes. O sal de Aveiro já aparece escrito num documento do ano 959.',
        ],
        sci: [
          'A água do mar tem cerca de 35 g de sais dissolvidos por quilograma, sobretudo Na+ e Cl− (cerca de 10,8 g de sódio por litro). O sódio veio da meteorização de rochas como os feldspatos e foi trazido pelos rios; grande parte do cloreto veio dos gases vulcânicos ao longo da história da Terra. A evaporação leva a água e deixa os iões.',
          'Numa salina, a salmoura passa de tanque em tanque e fica cada vez mais salgada: primeiro depositam-se o carbonato de cálcio e o gesso, e o cloreto de sódio cristaliza quando já se evaporaram cerca de nove décimos da água. As salinas de Aveiro, referidas num documento de 959, ainda produzem sal marinho e flor de sal, a crosta fina recolhida à superfície nos dias quentes e de vento.',
        ],
      },
      pl: {
        kid: [
          'Przez miliony lat deszcz wypłukiwał ze skał odrobiny soli, a rzeki niosły je do morza; wulkany dodały jeszcze więcej. Słońce zabiera wodę z powrotem do nieba, ale sól zostaje.',
          'W Aveiro, w Portugalii, ludzie robią sól w ten sam sposób. Wpuszczają morską wodę do płytkich basenów, słońce i wiatr ją osuszają, a pracownicy salin, zwani marnotos, zgarniają sól grabiami w lśniące białe kopce. O soli z Aveiro pisano już w 959 roku.',
        ],
        sci: [
          'Woda morska zawiera około 35 g rozpuszczonych soli na kilogram, głównie Na+ i Cl− (około 10,8 g sodu na litr). Sód pochodzi z wietrzenia skał, takich jak skalenie, i przyniosły go rzeki; duża część chlorków pochodzi z gazów wulkanicznych z całej historii Ziemi. Parowanie zabiera wodę i zostawia jony.',
          'W salinie solanka przepływa z basenu do basenu i staje się coraz bardziej słona: najpierw wytrąca się węglan wapnia i gips, a chlorek sodu krystalizuje, gdy odparuje około dziewięciu dziesiątych wody. Saliny w Aveiro, wymienione w dokumencie z 959 roku, wciąż dają sól morską i flor de sal, cienką skorupkę zbieraną z powierzchni w gorące, wietrzne dni.',
        ],
      },
      de: {
        kid: [
          'Seit Millionen von Jahren wäscht der Regen winzige Mengen Salz aus den Gesteinen, und Flüsse tragen sie ins Meer; Vulkane haben noch mehr dazugegeben. Die Sonne hebt das Wasser zurück in den Himmel, aber das Salz bleibt zurück.',
          'In Aveiro, in Portugal, machen die Menschen Salz auf dieselbe Weise. Sie lassen Meerwasser in flache Becken, Sonne und Wind trocknen es, und Salzarbeiter, die Marnotos, rechen das Salz zu glänzenden weißen Haufen. Über das Salz von Aveiro wurde schon im Jahr 959 geschrieben.',
        ],
        sci: [
          'Meerwasser enthält etwa 35 g gelöste Salze pro Kilogramm, vor allem Na+ und Cl− (etwa 10,8 g Natrium pro Liter). Das Natrium wurde aus Gesteinen wie Feldspäten verwittert und von Flüssen herangetragen; ein großer Teil des Chlorids stammt aus vulkanischen Gasen der Erdgeschichte. Die Verdunstung nimmt das Wasser und lässt die Ionen zurück.',
          'In einer Saline fließt die Sole von Becken zu Becken und wird immer salziger: Zuerst fallen Calciumcarbonat und Gips aus, und Natriumchlorid kristallisiert, wenn etwa neun Zehntel des Wassers verdunstet sind. Die Salinen von Aveiro, in einer Urkunde von 959 genannt, liefern noch heute Meersalz und Flor de Sal, die feine Kruste, die an heißen, windigen Tagen von der Oberfläche abgeschöpft wird.',
        ],
      },
    },
  },
  {
    id: 'davy',
    color: '#b388ff',
    title: {
      en: '1807: a metal nobody had ever seen',
      'pt-pt': '1807: um metal que ninguém tinha visto',
      pl: '1807: metal, którego nikt nie widział',
      de: '1807: ein Metall, das niemand kannte',
    },
    story: {
      en: {
        kid: [
          'Sodium hides so well in salt and soda that no fire could ever get it out. In 1807 Humphry Davy, aged 28, tried something new: a huge battery made of hundreds of metal plates.',
          'He sent its current through a little damp caustic soda. Tiny shiny beads, like drops of mercury, popped out of it, and some burst into bright flames. Electricity had pulled out a brand new metal.',
        ],
        sci: [
          'Davy electrolysed slightly moist sodium hydroxide with the voltaic batteries of the Royal Institution in London: on the negative side, globules with the lustre of mercury appeared, some burning as they formed. Sodium came days after potassium, made the same way, but it needed a stronger current; he announced both in November 1807.',
          'In 1808 he isolated magnesium, calcium, strontium and barium by electrolysis too. Sodium is still made with electricity: a Downs cell (1924) electrolyses molten sodium chloride mixed with calcium chloride (the mixture melts near 600 °C instead of 801 °C), giving sodium at one electrode and chlorine at the other.',
        ],
      },
      'pt-pt': {
        kid: [
          'O sódio esconde-se tão bem no sal e na soda que nenhum fogo o conseguia tirar de lá. Em 1807, Humphry Davy, com 28 anos, experimentou uma coisa nova: uma pilha enorme, feita de centenas de placas de metal.',
          'Fez passar a corrente por um pouco de soda cáustica húmida. Saltaram de lá umas bolinhas brilhantes, como gotas de mercúrio, e algumas pegaram fogo com chamas vivas. A eletricidade tinha arrancado um metal novinho em folha.',
        ],
        sci: [
          'Davy fez a eletrólise de hidróxido de sódio ligeiramente húmido com as pilhas de Volta da Royal Institution, em Londres: do lado negativo apareceram glóbulos com o brilho do mercúrio, alguns a arder à medida que se formavam. O sódio veio dias depois do potássio, obtido da mesma maneira, mas precisou de uma corrente mais forte; anunciou os dois em novembro de 1807.',
          'Em 1808 isolou também, por eletrólise, o magnésio, o cálcio, o estrôncio e o bário. O sódio ainda se faz com eletricidade: uma célula de Downs (1924) faz a eletrólise do cloreto de sódio fundido misturado com cloreto de cálcio (a mistura funde perto dos 600 °C em vez de 801 °C) e dá sódio num elétrodo e cloro no outro.',
        ],
      },
      pl: {
        kid: [
          'Sód tak dobrze chowa się w soli i w sodzie, że żaden ogień nie potrafił go wydobyć. W 1807 roku 28-letni Humphry Davy spróbował czegoś nowego: ogromnej baterii z setek metalowych płytek.',
          'Przepuścił jej prąd przez odrobinę wilgotnej sody kaustycznej. Wyskoczyły z niej malutkie błyszczące kuleczki, jak krople rtęci, a niektóre zapaliły się jasnym płomieniem. Prąd wydobył zupełnie nowy metal.',
        ],
        sci: [
          'Davy przeprowadził elektrolizę lekko wilgotnego wodorotlenku sodu za pomocą stosów Volty w Royal Institution w Londynie: po stronie ujemnej pojawiły się kuleczki o połysku rtęci, a niektóre paliły się już w chwili powstania. Sód otrzymał kilka dni po potasie, tą samą metodą, ale potrzebował do tego silniejszego prądu; oba odkrycia ogłosił w listopadzie 1807 roku.',
          'W 1808 roku również elektrolitycznie wyodrębnił magnez, wapń, stront i bar. Sód wciąż otrzymuje się prądem: elektrolizer Downsa (1924) rozkłada stopiony chlorek sodu zmieszany z chlorkiem wapnia (mieszanina topi się w około 600 °C zamiast w 801 °C); na jednej elektrodzie powstaje sód, na drugiej chlor.',
        ],
      },
      de: {
        kid: [
          'Natrium versteckt sich so gut in Salz und Soda, dass kein Feuer es je herausholen konnte. 1807 probierte der 28-jährige Humphry Davy etwas Neues: eine riesige Batterie aus Hunderten von Metallplatten.',
          'Er schickte ihren Strom durch ein wenig feuchtes Ätznatron. Winzige glänzende Kügelchen, wie Quecksilbertropfen, kamen daraus hervor, und manche gingen mit hellen Flammen in Feuer auf. Der Strom hatte ein ganz neues Metall herausgeholt.',
        ],
        sci: [
          'Davy elektrolysierte leicht feuchtes Natriumhydroxid mit den Voltaschen Batterien der Royal Institution in London: Auf der negativen Seite erschienen Kügelchen mit dem Glanz von Quecksilber, von denen manche schon beim Entstehen brannten. Natrium kam wenige Tage nach Kalium, auf dieselbe Weise, brauchte aber einen stärkeren Strom; beide gab er im November 1807 bekannt.',
          '1808 isolierte er auch Magnesium, Calcium, Strontium und Barium durch Elektrolyse. Natrium wird noch heute mit Strom hergestellt: Eine Downs-Zelle (1924) elektrolysiert geschmolzenes Natriumchlorid, gemischt mit Calciumchlorid (die Mischung schmilzt schon bei etwa 600 °C statt bei 801 °C); an einer Elektrode entsteht Natrium, an der anderen Chlor.',
        ],
      },
    },
  },
  {
    id: 'lamps',
    color: '#ffc83d',
    title: {
      en: 'Why were old street lights yellow?',
      'pt-pt': 'Porque eram amarelos os velhos candeeiros?',
      pl: 'Dlaczego stare latarnie świeciły na żółto?',
      de: 'Warum leuchteten alte Straßenlampen gelb?',
    },
    story: {
      en: {
        kid: [
          'Many old street lamps held a little sodium. Switched on, they glowed pink at first; then, as the sodium warmed up and turned into a gas, they shone a bright yellow.',
          'Their light was just one colour, so under them colours disappeared: a red car, a green tree and a blue ball all turned into shades of yellow and grey. Look at the two streets in the picture!',
        ],
        sci: [
          'A low-pressure sodium lamp puts nearly all its visible light into the sodium D lines at 589.0 and 589.6 nm, close to the eye’s peak sensitivity, which made it the most efficient lamp of its day (up to about 200 lumens per watt). The first ones lit a road between Beek and Geleen, in the Netherlands, in 1932.',
          'Light of one wavelength renders no colour at all: a surface only looks lighter or darker, by how much 589 nm light it reflects. High-pressure sodium lamps, with broader, pinkish-gold light, and now white LEDs have replaced them; astronomers liked them, because one narrow line is easy to filter out of a telescope’s view.',
        ],
      },
      'pt-pt': {
        kid: [
          'Muitos candeeiros de rua antigos tinham lá dentro um pouco de sódio. Quando se acendiam, brilhavam primeiro cor-de-rosa; depois, à medida que o sódio aquecia e se transformava em gás, davam uma luz amarela forte.',
          'A luz deles era de uma só cor, por isso, debaixo deles, as cores desapareciam: um carro vermelho, uma árvore verde e uma bola azul ficavam todos em tons de amarelo e cinzento. Olha para as duas ruas da imagem!',
        ],
        sci: [
          'Uma lâmpada de sódio de baixa pressão emite quase toda a sua luz visível nas riscas D do sódio, a 589,0 e 589,6 nm, perto do máximo de sensibilidade do olho, o que fez dela a lâmpada mais eficiente do seu tempo (até cerca de 200 lúmenes por watt). As primeiras iluminaram uma estrada entre Beek e Geleen, nos Países Baixos, em 1932.',
          'A luz de um só comprimento de onda não reproduz cor nenhuma: uma superfície só parece mais clara ou mais escura, conforme a quantidade de luz de 589 nm que reflete. As lâmpadas de sódio de alta pressão, de luz mais larga e dourado-rosada, e agora os LED brancos substituíram-nas; os astrónomos gostavam delas, porque uma só risca estreita é fácil de filtrar da vista de um telescópio.',
        ],
      },
      pl: {
        kid: [
          'W wielu starych latarniach ulicznych była odrobina sodu. Po włączeniu najpierw świeciły na różowo, a potem, gdy sód się nagrzał i zamienił w gaz, jasno na żółto.',
          'Ich światło miało tylko jeden kolor, więc kolory pod nimi znikały: czerwony samochód, zielone drzewo i niebieska piłka wyglądały jak odcienie żółci i szarości. Popatrz na dwie ulice na obrazku!',
        ],
        sci: [
          'Niskoprężna lampa sodowa wysyła prawie całe swoje światło widzialne w liniach D sodu, przy 589,0 i 589,6 nm, blisko maksimum czułości oka, dzięki czemu była najwydajniejszą lampą swoich czasów (do około 200 lumenów na wat). Pierwsze oświetliły w 1932 roku drogę między Beek a Geleen w Holandii.',
          'Światło o jednej długości fali w ogóle nie oddaje barw: powierzchnia wydaje się tylko jaśniejsza lub ciemniejsza, zależnie od tego, ile światła 589 nm odbija. Zastąpiły je wysokoprężne lampy sodowe o szerszym, różowozłotym świetle, a teraz białe diody LED; astronomowie je lubili, bo jedną wąską linię łatwo odfiltrować z obrazu teleskopu.',
        ],
      },
      de: {
        kid: [
          'Viele alte Straßenlampen enthielten ein wenig Natrium. Eingeschaltet leuchteten sie zuerst rosa; dann, als das Natrium warm wurde und zu Gas wurde, strahlten sie hellgelb.',
          'Ihr Licht hatte nur eine Farbe, deshalb verschwanden darunter die Farben: Ein rotes Auto, ein grüner Baum und ein blauer Ball sahen alle wie Gelb- und Grautöne aus. Schau dir die zwei Straßen auf dem Bild an!',
        ],
        sci: [
          'Eine Natriumdampf-Niederdrucklampe strahlt fast ihr ganzes sichtbares Licht in den Natrium-D-Linien bei 589,0 und 589,6 nm ab, nahe der größten Empfindlichkeit des Auges; das machte sie zur effizientesten Lampe ihrer Zeit (bis zu etwa 200 Lumen pro Watt). Die ersten beleuchteten 1932 eine Straße zwischen Beek und Geleen in den Niederlanden.',
          'Licht einer einzigen Wellenlänge gibt überhaupt keine Farben wieder: Eine Fläche wirkt nur heller oder dunkler, je nachdem, wie viel Licht von 589 nm sie zurückwirft. Natriumdampf-Hochdrucklampen mit breiterem, rosagoldenem Licht und heute weiße LEDs haben sie ersetzt; Astronomen mochten sie, weil sich eine einzige schmale Linie leicht aus dem Bild eines Teleskops herausfiltern lässt.',
        ],
      },
    },
  },
  {
    id: 'space',
    color: '#6f8cff',
    title: {
      en: 'Sodium 90 km above your head',
      'pt-pt': 'Sódio a 90 km por cima da tua cabeça',
      pl: 'Sód 90 km nad twoją głową',
      de: 'Natrium 90 km über deinem Kopf',
    },
    story: {
      en: {
        kid: [
          'About 90 km above you there is a thin layer of sodium atoms. They come from shooting stars: every day tonnes of space dust burn up high in the sky and leave their sodium behind.',
          'Astronomers shine yellow-orange lasers up at it. The sodium glows and makes a pretend star, which helps big telescopes take the twinkle out of their pictures. In 1997 comet Hale-Bopp even grew a tail made of sodium!',
        ],
        sci: [
          'The mesospheric sodium layer lies between about 80 and 105 km, peaking near 90 km, with only a few thousand atoms per cubic centimetre. It is fed by meteors burning up (tens of tonnes of dust a day; estimates vary), and Vesto Slipher first saw it in 1929, as the D lines in the glow of the night sky.',
          'Laser guide stars: a 589 nm laser excites the sodium atoms into an artificial star, and adaptive optics use its distortion to reshape a deformable mirror hundreds of times a second. In April 1997 comet Hale-Bopp showed a third, straight tail of neutral sodium atoms, about 6 degrees long, pushed out by the pressure of the sunlight they scatter.',
        ],
      },
      'pt-pt': {
        kid: [
          'Cerca de 90 km acima de ti há uma camada fina de átomos de sódio. Vêm das estrelas cadentes: todos os dias, toneladas de poeira do espaço ardem lá no alto e deixam lá o seu sódio.',
          'Os astrónomos apontam-lhe lasers amarelo-alaranjados. O sódio brilha e faz uma estrela a fingir, que ajuda os grandes telescópios a tirar a cintilação das suas imagens. Em 1997, o cometa Hale-Bopp até ganhou uma cauda feita de sódio!',
        ],
        sci: [
          'A camada de sódio da mesosfera fica entre cerca de 80 e 105 km, com o máximo perto dos 90 km e apenas alguns milhares de átomos por centímetro cúbico. É alimentada pelos meteoros que ali ardem (dezenas de toneladas de poeira por dia; as estimativas variam), e Vesto Slipher viu-a pela primeira vez em 1929, como as riscas D no brilho do céu noturno.',
          'Estrelas-guia laser: um laser de 589 nm excita os átomos de sódio e cria uma estrela artificial, e a ótica adaptativa usa a sua distorção para deformar um espelho flexível centenas de vezes por segundo. Em abril de 1997, o cometa Hale-Bopp mostrou uma terceira cauda, reta, de átomos neutros de sódio, com cerca de 6 graus de comprimento, empurrada pela pressão da luz do Sol que esses átomos dispersam.',
        ],
      },
      pl: {
        kid: [
          'Około 90 km nad tobą jest cienka warstwa atomów sodu. Biorą się ze spadających gwiazd: każdego dnia tony kosmicznego pyłu spalają się wysoko na niebie i zostawiają tam swój sód.',
          'Astronomowie świecą w nią żółto-pomarańczowymi laserami. Sód świeci i tworzy udawaną gwiazdę, która pomaga wielkim teleskopom usunąć migotanie z ich zdjęć. W 1997 roku kometa Hale-Bopp miała nawet ogon z sodu!',
        ],
        sci: [
          'Mezosferyczna warstwa sodu leży na wysokości od około 80 do 105 km, z maksimum blisko 90 km, i ma tylko kilka tysięcy atomów na centymetr sześcienny. Zasilają ją spalające się meteory (dziesiątki ton pyłu dziennie; szacunki się różnią), a po raz pierwszy zauważył ją w 1929 roku Vesto Slipher, jako linie D w poświacie nocnego nieba.',
          'Laserowe gwiazdy prowadzące: laser 589 nm wzbudza atomy sodu, tworząc sztuczną gwiazdę, a optyka adaptatywna na podstawie jej zniekształceń setki razy na sekundę zmienia kształt odkształcalnego lustra. W kwietniu 1997 roku kometa Hale-Bopp pokazała trzeci, prosty ogon z obojętnych atomów sodu, długi na około 6 stopni, wypychany ciśnieniem światła słonecznego, które te atomy rozpraszają.',
        ],
      },
      de: {
        kid: [
          'Etwa 90 km über dir gibt es eine dünne Schicht aus Natriumatomen. Sie kommen von Sternschnuppen: Jeden Tag verglühen dort oben Tonnen von Weltraumstaub und lassen ihr Natrium zurück.',
          'Astronomen richten gelb-orange Laser darauf. Das Natrium leuchtet und macht einen künstlichen Stern, der großen Teleskopen hilft, das Funkeln aus ihren Bildern zu nehmen. 1997 bekam der Komet Hale-Bopp sogar einen Schweif aus Natrium!',
        ],
        sci: [
          'Die Natriumschicht der Mesosphäre liegt zwischen etwa 80 und 105 km, mit dem Maximum nahe 90 km, und hat nur einige tausend Atome pro Kubikzentimeter. Sie wird von verglühenden Meteoren gespeist (Dutzende Tonnen Staub pro Tag; die Schätzungen schwanken), und Vesto Slipher sah sie 1929 zum ersten Mal, als D-Linien im Leuchten des Nachthimmels.',
          'Laserleitsterne: Ein Laser mit 589 nm regt die Natriumatome zu einem künstlichen Stern an, und die adaptive Optik verformt anhand seiner Verzerrung hunderte Male pro Sekunde einen verformbaren Spiegel. Im April 1997 zeigte der Komet Hale-Bopp einen dritten, geraden Schweif aus neutralen Natriumatomen, etwa 6 Grad lang, weggedrückt vom Druck des Sonnenlichts, das sie streuen.',
        ],
      },
    },
  },
  {
    id: 'kitchen',
    color: '#ff9e5e',
    title: {
      en: 'What makes a cake rise?',
      'pt-pt': 'O que faz um bolo crescer?',
      pl: 'Dlaczego ciasto rośnie?',
      de: 'Warum geht ein Kuchen auf?',
    },
    story: {
      en: {
        kid: [
          'Baking soda is a powder with sodium in it: sodium bicarbonate. Mix it with something sour, like yoghurt or lemon juice, and it fizzes out bubbles of carbon dioxide gas.',
          'In a cake batter the bubbles get trapped, and the oven’s heat makes them grow, so the cake puffs up light and soft. Try it: drop a spoonful of baking soda into a glass of vinegar, over the sink!',
        ],
        sci: [
          'Sodium bicarbonate, NaHCO3, reacts with acids: HCO3− + H+ → H2O + CO2. Baking powder is baking soda already mixed with a dry acid (such as cream of tartar) and starch, so water alone starts it. Heat also breaks NaHCO3 down above about 80 °C: 2 NaHCO3 → Na2CO3 + H2O + CO2.',
          'The CO2 bubbles expand in the oven while the starch and proteins set around them into a sponge. Too much soda leaves sodium carbonate, which tastes soapy. The kitchen’s other sodium is salt: the WHO advises adults to eat less than 5 g of salt a day (under 2 g of sodium).',
        ],
      },
      'pt-pt': {
        kid: [
          'O bicarbonato de sódio, que se usa na cozinha, é um pó com sódio. Mistura-o com uma coisa ácida, como iogurte ou sumo de limão, e ele faz bolhas de dióxido de carbono.',
          'Na massa de um bolo, as bolhas ficam presas e o calor do forno fá-las crescer, por isso o bolo fica fofo e leve. Experimenta: deita uma colher de bicarbonato num copo de vinagre, por cima do lava-loiça!',
        ],
        sci: [
          'O bicarbonato de sódio, NaHCO3, reage com ácidos: HCO3− + H+ → H2O + CO2. O fermento em pó é bicarbonato já misturado com um ácido seco (como o cremor tártaro) e amido, por isso basta a água para começar. O calor também decompõe o NaHCO3 acima de cerca de 80 °C: 2 NaHCO3 → Na2CO3 + H2O + CO2.',
          'As bolhas de CO2 dilatam no forno enquanto o amido e as proteínas solidificam à volta delas numa esponja. Bicarbonato a mais deixa carbonato de sódio, que sabe a sabão. O outro sódio da cozinha é o sal: a OMS aconselha os adultos a comer menos de 5 g de sal por dia (menos de 2 g de sódio).',
        ],
      },
      pl: {
        kid: [
          'Soda oczyszczona to proszek, w którym jest sód: wodorowęglan sodu. Zmieszaj ją z czymś kwaśnym, na przykład z jogurtem albo sokiem z cytryny, a zacznie musować bąbelkami dwutlenku węgla.',
          'W cieście bąbelki zostają uwięzione, a ciepło piekarnika sprawia, że rosną, więc ciasto staje się puszyste i lekkie. Spróbuj: wsyp łyżeczkę sody do szklanki octu, nad zlewem!',
        ],
        sci: [
          'Wodorowęglan sodu, NaHCO3, reaguje z kwasami: HCO3− + H+ → H2O + CO2. Proszek do pieczenia to soda zmieszana już z suchym kwasem (na przykład kamieniem winnym) i skrobią, więc wystarczy woda, żeby zaczął działać. Ciepło też rozkłada NaHCO3 powyżej około 80 °C: 2 NaHCO3 → Na2CO3 + H2O + CO2.',
          'Pęcherzyki CO2 rozszerzają się w piekarniku, a skrobia i białka tężeją wokół nich w gąbkę. Za dużo sody zostawia węglan sodu, który ma mydlany smak. Drugi sód w kuchni to sól: WHO zaleca, żeby dorośli jedli mniej niż 5 g soli dziennie (poniżej 2 g sodu).',
        ],
      },
      de: {
        kid: [
          'Natron ist ein Pulver mit Natrium darin: Natriumhydrogencarbonat. Misch es mit etwas Saurem, wie Joghurt oder Zitronensaft, und es sprudelt Bläschen aus Kohlenstoffdioxid.',
          'Im Kuchenteig bleiben die Bläschen gefangen, und die Hitze des Ofens lässt sie wachsen, so wird der Kuchen locker und luftig. Probier es aus: Gib einen Löffel Natron in ein Glas Essig, über dem Spülbecken!',
        ],
        sci: [
          'Natriumhydrogencarbonat, NaHCO3, reagiert mit Säuren: HCO3− + H+ → H2O + CO2. Backpulver ist Natron, das schon mit einer trockenen Säure (etwa Weinstein) und Stärke gemischt ist, deshalb genügt Wasser, um es zu starten. Hitze zersetzt NaHCO3 außerdem oberhalb von etwa 80 °C: 2 NaHCO3 → Na2CO3 + H2O + CO2.',
          'Die CO2-Bläschen dehnen sich im Ofen aus, während Stärke und Eiweiße um sie herum zu einem Schwamm fest werden. Zu viel Natron hinterlässt Natriumcarbonat, das seifig schmeckt. Das andere Natrium der Küche ist Salz: Die WHO rät Erwachsenen, weniger als 5 g Salz am Tag zu essen (unter 2 g Natrium).',
        ],
      },
    },
  },
]
