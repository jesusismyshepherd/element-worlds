// Silver's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls (silver has
// no wing and no Periodic Videos room yet, so no doorway), each a question that makes you walk up, and the story
// it opens (Explorer and Scientist). They tell what the hall's stations only name (the mirror, photography,
// cloud seeding, silver against germs, coins) and leave out what the hall already shows: refining in a furnace
// (the verse stone, Psalm 12:6) and the whitest, shiniest metal (the specimen case). Pictures:
// public/boards/Ag/<id>.svg, drawn by tools/boards/Ag/ (no words in them: the title is drawn in the visitor's
// language). Each picture has a room designed for it: docs/agents/designs/Ag_rooms.md (picture-rooms.md).
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'medal',
    color: '#ffcf4d',
    title: {
      en: 'Is a gold medal made of gold?',
      'pt-pt': 'Uma medalha de ouro é de ouro?',
      pl: 'Czy złoty medal jest ze złota?',
      de: 'Ist eine Goldmedaille aus Gold?',
    },
    story: {
      en: {
        kid: [
          'Not really! An Olympic gold medal is mostly silver. At the Paris Games of 2024 each gold medal weighed 529 g, but only 6 g of it was gold: a thin golden skin over silver. The silver medal was silver all the way through, and every medal had a little piece of the Eiffel Tower’s iron set in the middle.',
          'At the first modern Olympics, in Athens in 1896, the winners did not get gold at all. They got a silver medal and an olive branch, and the runners-up a copper medal. The last medals of solid gold were given out in 1912.',
        ],
        sci: [
          'The Olympic rules ask for first- and second-place medals of silver at least 925 parts in 1000 fine, the gold medal gilded with at least 6 g of pure gold. The Paris 2024 medals, 85 mm across and 9.2 mm thick, were struck by the Monnaie de Paris: gold 529 g (about 505 g of silver and 6 g of gold), silver 525 g, bronze 455 g (copper and zinc), each set with an 18 g hexagon of puddled iron taken from the Eiffel Tower.',
          'Gilding is usually done by electroplating: the medal hangs as the cathode in a bath of a gold salt, and the current lays gold atoms on it, a layer a few hundredths of a millimetre thick. In 1896 the winners’ silver medals, designed by Jules-Clément Chaplain, were struck at the Monnaie de Paris too. Solid gold medals were last awarded at Stockholm in 1912; one of 529 g would now cost tens of thousands of euros.',
        ],
      },
      'pt-pt': {
        kid: [
          'Nem por isso! Uma medalha de ouro olímpica é quase toda de prata. Nos Jogos de Paris de 2024, cada medalha de ouro pesava 529 g, mas só 6 g eram de ouro: uma pele dourada e fininha por cima da prata. A medalha de prata era de prata de uma ponta à outra, e todas as medalhas tinham no meio um pedacinho do ferro da Torre Eiffel.',
          'Nos primeiros Jogos Olímpicos modernos, em Atenas, em 1896, os vencedores nem sequer receberam ouro. Ganharam uma medalha de prata e um ramo de oliveira, e os segundos classificados uma medalha de cobre. As últimas medalhas de ouro maciço foram entregues em 1912.',
        ],
        sci: [
          'As regras olímpicas pedem que as medalhas de primeiro e de segundo lugar sejam de prata com pelo menos 925 partes em 1000, e que a de ouro seja dourada com pelo menos 6 g de ouro puro. As medalhas de Paris 2024, com 85 mm de diâmetro e 9,2 mm de espessura, foram cunhadas pela Monnaie de Paris: ouro 529 g (cerca de 505 g de prata e 6 g de ouro), prata 525 g, bronze 455 g (cobre e zinco), cada uma com um hexágono de 18 g de ferro pudelado retirado da Torre Eiffel.',
          'Hoje o ouro aplica-se normalmente por eletrodeposição: a medalha fica pendurada como cátodo num banho de um sal de ouro, e a corrente deposita nela átomos de ouro, numa camada com alguns centésimos de milímetro. Em 1896, as medalhas de prata dos vencedores, desenhadas por Jules-Clément Chaplain, também foram cunhadas na Monnaie de Paris. As últimas medalhas de ouro maciço foram entregues em Estocolmo, em 1912; uma de 529 g custaria hoje dezenas de milhares de euros.',
        ],
      },
      pl: {
        kid: [
          'Nie bardzo! Olimpijski złoty medal jest prawie cały ze srebra. Na igrzyskach w Paryżu w 2024 roku każdy złoty medal ważył 529 g, ale złota było w nim tylko 6 g: cienka złota skórka na srebrze. Srebrny medal był ze srebra na wylot, a w środku każdego medalu tkwił kawałeczek żelaza z wieży Eiffla.',
          'Na pierwszych nowożytnych igrzyskach olimpijskich, w Atenach w 1896 roku, zwycięzcy w ogóle nie dostali złota. Dostali srebrny medal i gałązkę oliwną, a zdobywcy drugich miejsc medal z miedzi. Ostatnie medale z litego złota rozdano w 1912 roku.',
        ],
        sci: [
          'Przepisy olimpijskie wymagają, by medale za pierwsze i drugie miejsce były ze srebra próby co najmniej 925, a złoty medal był pozłocony co najmniej 6 g czystego złota. Medale z Paryża 2024, o średnicy 85 mm i grubości 9,2 mm, wybiła Monnaie de Paris: złoty 529 g (około 505 g srebra i 6 g złota), srebrny 525 g, brązowy 455 g (miedź i cynk), a w każdy wprawiono sześciokąt z 18 g żelaza pudlarskiego z wieży Eiffla.',
          'Złoci się zwykle galwanicznie: medal wisi jako katoda w kąpieli z solą złota, a prąd osadza na nim atomy złota, warstwą grubości kilku setnych milimetra. W 1896 roku srebrne medale dla zwycięzców, zaprojektowane przez Jules’a-Clémenta Chaplaina, również wybiła Monnaie de Paris. Medale z litego złota rozdano ostatni raz w Sztokholmie w 1912 roku; taki medal o masie 529 g kosztowałby dziś dziesiątki tysięcy euro.',
        ],
      },
      de: {
        kid: [
          'Nicht wirklich! Eine olympische Goldmedaille ist fast ganz aus Silber. Bei den Spielen in Paris 2024 wog jede Goldmedaille 529 g, aber nur 6 g davon waren Gold: eine dünne goldene Haut über dem Silber. Die Silbermedaille war durch und durch aus Silber, und in der Mitte jeder Medaille saß ein Stückchen Eisen vom Eiffelturm.',
          'Bei den ersten Olympischen Spielen der Neuzeit, 1896 in Athen, bekamen die Sieger gar kein Gold. Sie erhielten eine Silbermedaille und einen Olivenzweig, die Zweiten eine Kupfermedaille. Die letzten Medaillen aus massivem Gold wurden 1912 verliehen.',
        ],
        sci: [
          'Die olympischen Regeln verlangen Medaillen für Platz eins und zwei aus Silber mit mindestens 925 Tausendteilen, die Goldmedaille vergoldet mit mindestens 6 g reinem Gold. Die Medaillen von Paris 2024, 85 mm im Durchmesser und 9,2 mm dick, prägte die Monnaie de Paris: Gold 529 g (etwa 505 g Silber und 6 g Gold), Silber 525 g, Bronze 455 g (Kupfer und Zink), jede mit einem 18 g schweren Sechseck aus Puddeleisen vom Eiffelturm.',
          'Vergoldet wird meist galvanisch: Die Medaille hängt als Kathode in einem Bad aus einem Goldsalz, und der Strom legt Goldatome auf sie, eine Schicht von einigen Hundertstelmillimetern. 1896 wurden die Silbermedaillen der Sieger, entworfen von Jules-Clément Chaplain, ebenfalls in der Monnaie de Paris geprägt. Medaillen aus massivem Gold gab es zuletzt 1912 in Stockholm; eine von 529 g würde heute Zehntausende Euro kosten.',
        ],
      },
    },
  },
  {
    id: 'mirror',
    color: '#b48cff',
    title: {
      en: 'What is behind a mirror?',
      'pt-pt': 'O que há atrás de um espelho?',
      pl: 'Co kryje się za lustrem?',
      de: 'Was ist hinter einem Spiegel?',
    },
    story: {
      en: {
        kid: [
          'A layer of silver, hundreds of times thinner than a hair! Silver bounces back more light than any other metal, so it makes the brightest mirrors. In 1835 the chemist Justus von Liebig found how to make silver come out of a clear liquid and coat glass, and mirrors became cheaper and brighter than ever.',
          'Astronomers loved it: a glass telescope mirror with silver on it could get a fresh shiny skin whenever it went dull. The great telescope on Mount Wilson, in California, has a mirror 2.5 m across that was silvered twice a year, and all the silver on it would have made a cube smaller than a sugar cube. With it, in 1923, Edwin Hubble found a star that showed the Andromeda nebula is a whole galaxy, far beyond our own.',
        ],
        sci: [
          'Silver reflects about 95 to 98% of visible light, more than any other metal (aluminium about 90%), though it weakens in the violet and below about 320 nm reflects ultraviolet poorly. Liebig’s silvering (1835) reduces silver nitrate dissolved in ammonia with an aldehyde or a sugar, the reaction of Tollens’ test; before it, mirrors were backed with an amalgam of tin and mercury, which poisoned the mirror makers.',
          'Steinheil (1856) and Foucault (1857) silvered the front of figured glass, replacing speculum metal, which reflected about 60% and had to be refigured whenever it tarnished. The 100-inch (2.5 m) Hooker telescope of 1917 was resilvered about twice a year, with some 1.4 kg of silver nitrate per coat, until John Strong aluminised it in 1935: Hubble’s Cepheid in Andromeda (1923) and his law of receding galaxies (1929) came through silver. Since 2004 the Gemini telescopes’ 8.1 m mirrors are silvered again, under a protective layer, for silver’s low emissivity in the infrared.',
        ],
      },
      'pt-pt': {
        kid: [
          'Uma camada de prata, centenas de vezes mais fina do que um cabelo! A prata devolve mais luz do que qualquer outro metal, por isso faz os espelhos mais brilhantes. Em 1835, o químico Justus von Liebig descobriu como fazer a prata sair de um líquido transparente e cobrir o vidro, e os espelhos ficaram mais baratos e brilhantes do que nunca.',
          'Os astrónomos adoraram: um espelho de telescópio de vidro, com prata por cima, podia ganhar uma pele nova e brilhante sempre que ficava baço. O grande telescópio do Monte Wilson, na Califórnia, tem um espelho com 2,5 m de diâmetro que era prateado duas vezes por ano, e toda a prata que tinha faria um cubo mais pequeno do que um torrão de açúcar. Com ele, em 1923, Edwin Hubble encontrou uma estrela que mostrou que a nebulosa de Andrómeda é uma galáxia inteira, muito para lá da nossa.',
        ],
        sci: [
          'A prata reflete cerca de 95 a 98% da luz visível, mais do que qualquer outro metal (o alumínio, cerca de 90%), embora enfraqueça no violeta e, abaixo de cerca de 320 nm, reflita mal o ultravioleta. A prateação de Liebig (1835) reduz nitrato de prata dissolvido em amoníaco com um aldeído ou um açúcar, a reação do teste de Tollens; antes dela, os espelhos levavam por trás uma amálgama de estanho e mercúrio, que envenenava os espelheiros.',
          'Steinheil (1856) e Foucault (1857) pratearam a frente de vidro já polido na forma certa, em vez da liga de espéculo, que refletia cerca de 60% e tinha de ser polida de novo sempre que escurecia. O telescópio Hooker de 100 polegadas (2,5 m), de 1917, era prateado de novo cerca de duas vezes por ano, com uns 1,4 kg de nitrato de prata por camada, até John Strong o aluminizar em 1935: a cefeida de Hubble em Andrómeda (1923) e a sua lei das galáxias que se afastam (1929) chegaram através da prata. Desde 2004, os espelhos de 8,1 m dos telescópios Gemini voltaram a ser prateados, sob uma camada protetora, pela baixa emissividade da prata no infravermelho.',
        ],
      },
      pl: {
        kid: [
          'Warstwa srebra, setki razy cieńsza od włosa! Srebro odbija więcej światła niż jakikolwiek inny metal, dlatego daje najjaśniejsze lustra. W 1835 roku chemik Justus von Liebig odkrył, jak sprawić, by srebro wydzieliło się z przezroczystego płynu i pokryło szkło, i lustra stały się tańsze i jaśniejsze niż kiedykolwiek.',
          'Astronomowie byli zachwyceni: szklane zwierciadło teleskopu pokryte srebrem mogło dostać nową, lśniącą skórkę za każdym razem, gdy zmatowiało. Wielki teleskop na Mount Wilson w Kalifornii ma zwierciadło o średnicy 2,5 m, które srebrzono dwa razy w roku, a całe srebro na nim dałoby sześcian mniejszy od kostki cukru. Dzięki niemu w 1923 roku Edwin Hubble wypatrzył gwiazdę, która pokazała, że mgławica Andromedy to cała galaktyka, daleko poza naszą.',
        ],
        sci: [
          'Srebro odbija od 95 do 98% światła widzialnego, więcej niż jakikolwiek inny metal (glin około 90%), choć słabnie w fiolecie, a poniżej około 320 nm słabo odbija nadfiolet. Srebrzenie Liebiga (1835) polega na redukcji azotanu srebra rozpuszczonego w amoniaku aldehydem lub cukrem, tak jak w próbie Tollensa; wcześniej lustra pokrywano od spodu amalgamatem cyny i rtęci, który truł lustrzarzy.',
          'Steinheil (1856) i Foucault (1857) posrebrzyli przód oszlifowanego szkła, zastępując stop zwierciadlany, który odbijał około 60% światła i trzeba go było szlifować na nowo, ilekroć zmatowiał. Teleskop Hookera o średnicy 100 cali (2,5 m) z 1917 roku srebrzono mniej więcej dwa razy w roku, zużywając na każdą warstwę około 1,4 kg azotanu srebra, aż w 1935 roku John Strong pokrył go glinem: cefeida Hubble’a w Andromedzie (1923) i jego prawo oddalających się galaktyk (1929) przyszły przez srebro. Od 2004 roku 8,1-metrowe zwierciadła teleskopów Gemini znów są srebrzone, pod warstwą ochronną, bo srebro słabo promieniuje w podczerwieni.',
        ],
      },
      de: {
        kid: [
          'Eine Schicht Silber, hunderte Male dünner als ein Haar! Silber wirft mehr Licht zurück als jedes andere Metall, darum macht es die hellsten Spiegel. 1835 fand der Chemiker Justus von Liebig heraus, wie man Silber aus einer klaren Flüssigkeit auf Glas abscheiden lässt, und Spiegel wurden billiger und heller als je zuvor.',
          'Astronomen liebten das: Ein gläserner Teleskopspiegel mit Silber darauf bekam eine frische, glänzende Haut, sobald er matt wurde. Das große Teleskop auf dem Mount Wilson in Kalifornien hat einen Spiegel von 2,5 m Durchmesser, der zweimal im Jahr versilbert wurde, und alles Silber darauf hätte einen Würfel ergeben, kleiner als ein Stück Würfelzucker. Mit ihm entdeckte Edwin Hubble 1923 einen Stern, der zeigte, dass der Andromedanebel eine ganze Galaxie ist, weit jenseits unserer eigenen.',
        ],
        sci: [
          'Silber reflektiert etwa 95 bis 98% des sichtbaren Lichts, mehr als jedes andere Metall (Aluminium etwa 90%), wird aber im Violetten schwächer und reflektiert unterhalb von etwa 320 nm Ultraviolett schlecht. Liebigs Versilberung (1835) reduziert in Ammoniak gelöstes Silbernitrat mit einem Aldehyd oder einem Zucker, die Reaktion der Tollensprobe; davor wurden Spiegel mit einem Amalgam aus Zinn und Quecksilber belegt, das die Spiegelmacher vergiftete.',
          'Steinheil (1856) und Foucault (1857) versilberten die Vorderseite geschliffener Glasspiegel und ersetzten damit Spiegelmetall, das etwa 60% reflektierte und nach jedem Anlaufen neu geschliffen werden musste. Das 100-Zoll-Hooker-Teleskop (2,5 m) von 1917 wurde etwa zweimal im Jahr neu versilbert, mit rund 1,4 kg Silbernitrat pro Schicht, bis John Strong es 1935 aluminisierte: Hubbles Cepheide in Andromeda (1923) und sein Gesetz der fliehenden Galaxien (1929) kamen durch Silber. Seit 2004 tragen die 8,1-m-Spiegel der Gemini-Teleskope wieder Silber unter einer Schutzschicht, wegen seiner geringen Emissivität im Infraroten.',
        ],
      },
    },
  },
  {
    id: 'germs',
    color: '#5fe08a',
    title: {
      en: 'Can a metal fight germs?',
      'pt-pt': 'Um metal pode combater micróbios?',
      pl: 'Czy metal może walczyć z zarazkami?',
      de: 'Kann ein Metall Keime bekämpfen?',
    },
    story: {
      en: {
        kid: [
          'Silver can! Wet silver slowly lets go of tiny charged bits called silver ions. They grab the sulfur in a germ’s proteins and jam its machinery, so the germ cannot grow. That is why some bandages and burn creams have a little silver in them.',
          'In 1880 a doctor in Leipzig, Carl Credé, began putting one drop of a silver solution into every newborn baby’s eyes. An eye infection that had blinded many babies almost disappeared: his drops saved the sight of millions. Today, on the space station, the Russian water machine turns the damp air of the astronauts’ breath into drinking water and keeps it clean with a pinch of silver.',
        ],
        sci: [
          'Nägeli named it the oligodynamic effect (1893): silver slowly releases Ag+, which binds the thiol (−SH) groups of enzymes and membrane proteins, upsets the cell’s respiration and binds its DNA; tens to hundreds of micrograms per litre stop many bacteria. Silver sulfadiazine cream (1968) and silver dressings are used on burns and wounds; swallowing silver for a long time can turn the skin permanently blue-grey (argyria), so silver is not a supplement.',
          'Credé’s prophylaxis (Leipzig, from June 1880, published 1881): a drop of 2% silver nitrate in each newborn’s eyes cut gonococcal ophthalmia from about one birth in ten to almost none, and it stayed in use until antibiotic ointments replaced it in the 1980s. In the Russian segment of the ISS, water recovered from cabin humidity gets 0.05 to 0.2 mg/L of silver and is pasteurised; NASA, which uses iodine, is testing silver for missions beyond Earth orbit.',
        ],
      },
      'pt-pt': {
        kid: [
          'A prata consegue! Molhada, a prata vai largando umas partículas minúsculas com carga elétrica, os iões de prata. Eles agarram-se ao enxofre das proteínas de um micróbio e encravam-lhe as máquinas, e o micróbio deixa de conseguir crescer. É por isso que alguns pensos e cremes para queimaduras têm um pouco de prata.',
          'Em 1880, um médico de Leipzig, Carl Credé, começou a pôr uma gota de uma solução de prata nos olhos de todos os bebés recém-nascidos. Uma infeção dos olhos que tinha cegado muitos bebés quase desapareceu: as gotas dele salvaram a vista a milhões de pessoas. Hoje, na estação espacial, a máquina de água russa transforma o ar húmido da respiração dos astronautas em água para beber e mantém-na limpa com uma pitada de prata.',
        ],
        sci: [
          'Nägeli chamou-lhe efeito oligodinâmico (1893): a prata liberta lentamente Ag+, que se liga aos grupos tiol (−SH) das enzimas e das proteínas da membrana, perturba a respiração da célula e liga-se ao seu ADN; dezenas a centenas de microgramas por litro travam muitas bactérias. O creme de sulfadiazina de prata (1968) e os pensos com prata usam-se em queimaduras e feridas; engolir prata durante muito tempo pode deixar a pele azul-acinzentada para sempre (argiria), por isso a prata não é um suplemento.',
          'A profilaxia de Credé (Leipzig, a partir de junho de 1880, publicada em 1881): uma gota de nitrato de prata a 2% em cada olho do recém-nascido fez a oftalmia gonocócica descer de cerca de um parto em cada dez para quase nenhum, e usou-se até as pomadas antibióticas a substituírem, nos anos 1980. No segmento russo da ISS, a água recuperada da humidade da cabina recebe 0,05 a 0,2 mg/L de prata e é pasteurizada; a NASA, que usa iodo, está a testar a prata para missões para lá da órbita da Terra.',
        ],
      },
      pl: {
        kid: [
          'Srebro potrafi! Mokre srebro powoli uwalnia malutkie naładowane drobinki, jony srebra. Chwytają one siarkę w białkach zarazka i zacinają jego maszynerię, więc zarazek nie może rosnąć. Dlatego niektóre plastry i kremy na oparzenia zawierają odrobinę srebra.',
          'W 1880 roku lekarz z Lipska, Carl Credé, zaczął zakraplać każdemu nowo narodzonemu dziecku do oczu kroplę roztworu srebra. Zakażenie oczu, przez które wiele niemowląt traciło wzrok, prawie zniknęło: jego krople uratowały wzrok milionom ludzi. Dziś na stacji kosmicznej rosyjska maszyna zmienia wilgotne powietrze z oddechu astronautów w wodę do picia i utrzymuje ją w czystości szczyptą srebra.',
        ],
        sci: [
          'Nägeli nazwał to efektem oligodynamicznym (1893): srebro powoli uwalnia Ag+, który wiąże grupy tiolowe (−SH) enzymów i białek błony, zaburza oddychanie komórki i wiąże jej DNA; dziesiątki do setek mikrogramów na litr powstrzymują wiele bakterii. Krem z sulfadiazyną srebra (1968) i opatrunki ze srebrem stosuje się na oparzenia i rany; połykanie srebra przez długi czas może na stałe zabarwić skórę na niebieskoszaro (argyria), więc srebro nie jest suplementem.',
          'Profilaktyka Credégo (Lipsk, od czerwca 1880 roku, opisana w 1881): kropla 2-procentowego azotanu srebra do każdego oka noworodka zmniejszyła rzeżączkowe zapalenie spojówek z mniej więcej jednego porodu na dziesięć prawie do zera i stosowano ją, dopóki w latach 80. XX wieku nie zastąpiły jej maści z antybiotykami. W rosyjskim segmencie ISS woda odzyskana z wilgoci w kabinie dostaje od 0,05 do 0,2 mg/l srebra i jest pasteryzowana; NASA, która używa jodu, testuje srebro na misje poza orbitą Ziemi.',
        ],
      },
      de: {
        kid: [
          'Silber kann das! Nasses Silber gibt langsam winzige geladene Teilchen ab, Silberionen. Sie packen den Schwefel in den Eiweißen eines Keims und blockieren seine Maschinen, sodass der Keim nicht wachsen kann. Deshalb steckt in manchen Pflastern und Brandsalben ein wenig Silber.',
          'Ab 1880 gab ein Arzt in Leipzig, Carl Credé, jedem neugeborenen Baby einen Tropfen einer Silberlösung in die Augen. Eine Augenentzündung, die viele Babys blind gemacht hatte, verschwand fast ganz: Seine Tropfen retteten Millionen Menschen das Augenlicht. Heute verwandelt auf der Raumstation die russische Wassermaschine die feuchte Atemluft der Astronauten in Trinkwasser und hält es mit einer Prise Silber sauber.',
        ],
        sci: [
          'Nägeli nannte es den oligodynamischen Effekt (1893): Silber gibt langsam Ag+ ab, das die Thiolgruppen (−SH) von Enzymen und Membranproteinen bindet, die Atmung der Zelle stört und an ihre DNA bindet; Dutzende bis Hunderte Mikrogramm pro Liter hemmen viele Bakterien. Silbersulfadiazin-Creme (1968) und Silberverbände werden bei Verbrennungen und Wunden verwendet; wer lange Zeit Silber schluckt, kann eine dauerhaft blaugraue Haut bekommen (Argyrie), darum ist Silber kein Nahrungsergänzungsmittel.',
          'Die Credésche Prophylaxe (Leipzig, ab Juni 1880, veröffentlicht 1881): Ein Tropfen 2-prozentiger Silbernitratlösung in jedes Auge des Neugeborenen senkte die Gonoblennorrhö von etwa einer von zehn Geburten fast auf null; sie blieb in Gebrauch, bis Antibiotika-Salben sie in den 1980er-Jahren ablösten. Im russischen Segment der ISS erhält das aus der Kabinenfeuchte gewonnene Wasser 0,05 bis 0,2 mg/l Silber und wird pasteurisiert; die NASA, die Iod verwendet, testet Silber für Missionen jenseits der Erdumlaufbahn.',
        ],
      },
    },
  },
  {
    id: 'wire',
    color: '#ff9f43',
    title: {
      en: 'Can a rock grow silver hair?',
      'pt-pt': 'Uma pedra com cabelos de prata?',
      pl: 'Czy skała może mieć srebrne włosy?',
      de: 'Können Steine Silberhaare haben?',
    },
    story: {
      en: {
        kid: [
          'In Kongsberg, in Norway, silver sometimes grows out of the rock in curls, like hair or wire. The story goes that in 1623 two children, Helga and Jacob, were looking after cattle when their ox butted a rock with its horns, and something shone: silver! The next year the king came and founded a town there, Kongsberg, the King’s Mountain.',
          'Miners worked there for 335 years. They cracked the hard rock with fires and dug down more than 1000 m. Down in the rock, silver hides in a black mineral, silver sulfide. Scientists can make silver hair grow out of it in a flame: the silver creeps through the solid black crystal to the root of the wire and pushes it out from below, like toothpaste from a tube.',
        ],
        sci: [
          'Kongsberg’s veins formed about 265 million years ago, when brines at 200 to 300 °C rose through cracks in the gneiss. Kongsberg Sølvverk mined them from 1623 to 1958, about 1350 tonnes of silver in all; the King’s Mine reached 1068 m down, its bottom some 500 m below sea level, and its galleries were cut by fire-setting until 1890, the last use of it in European mining, which left their walls smoothly rounded.',
          'Wire silver grows on silver sulfide (Ag2S). Above about 177 °C acanthite turns into argentite, one of the fastest ion conductors known: Ag+ ions run through the solid to where it touches the wire and become metal there, so the wire is built at its base and pushed out (in a flame, at 450 to 700 °C, by millimetres in half an hour). Whether Kongsberg’s wires grew hot, or slowly and cool as groundwater altered the sulfide, is still debated.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em Kongsberg, na Noruega, a prata às vezes cresce da rocha em caracóis, como cabelo ou arame. Conta-se que em 1623 duas crianças, a Helga e o Jacob, andavam a guardar o gado quando o boi deles marrou numa rocha com os chifres, e alguma coisa brilhou: prata! No ano seguinte, o rei veio e fundou ali uma vila, Kongsberg, a Montanha do Rei.',
          'Os mineiros trabalharam lá durante 335 anos. Partiam a rocha dura com fogueiras e escavaram mais de 1000 m para baixo. Lá dentro da rocha, a prata esconde-se num mineral negro, o sulfureto de prata. Os cientistas conseguem fazer crescer cabelos de prata a partir dele numa chama: a prata desliza através do cristal negro, que é sólido, até à raiz do fio e empurra-o para fora por baixo, como a pasta de dentes sai do tubo.',
        ],
        sci: [
          'Os filões de Kongsberg formaram-se há cerca de 265 milhões de anos, quando salmouras a 200 a 300 °C subiram por fendas no gnaisse. A Kongsberg Sølvverk explorou-os de 1623 a 1958, cerca de 1350 toneladas de prata ao todo; a Mina do Rei chegou aos 1068 m de profundidade, com o fundo uns 500 m abaixo do nível do mar, e as suas galerias foram abertas com fogueiras contra a rocha até 1890, o último uso desta técnica nas minas da Europa, que deixou as paredes lisas e arredondadas.',
          'A prata em fio cresce sobre sulfureto de prata (Ag2S). Acima de cerca de 177 °C, a acantite transforma-se em argentite, um dos condutores de iões mais rápidos que se conhecem: os iões Ag+ atravessam o sólido até onde ele toca o fio e aí tornam-se metal, por isso o fio é construído pela base e empurrado para fora (numa chama, a 450 a 700 °C, cresce milímetros em meia hora). Se os fios de Kongsberg cresceram a quente, ou lentamente e a frio enquanto a água subterrânea alterava o sulfureto, ainda se discute.',
        ],
      },
      pl: {
        kid: [
          'W Kongsbergu w Norwegii srebro czasem wyrasta ze skały w loczkach, jak włosy albo drut. Podobno w 1623 roku dwoje dzieci, Helga i Jacob, pasło bydło, kiedy ich wół uderzył rogami w skałę i coś zalśniło: srebro! Rok później przybył król i założył tam miasto Kongsberg, czyli Królewską Górę.',
          'Górnicy pracowali tam przez 335 lat. Kruszyli twardą skałę ogniem i dokopali się na ponad 1000 m w głąb. W głębi skały srebro chowa się w czarnym minerale, siarczku srebra. Naukowcy potrafią sprawić, że w płomieniu wyrastają z niego srebrne włosy: srebro przesącza się przez twardy czarny kryształ aż do korzenia drucika i wypycha go od dołu, jak pastę z tubki.',
        ],
        sci: [
          'Żyły kruszcowe Kongsbergu powstały około 265 milionów lat temu, gdy solanki o temperaturze od 200 do 300 °C wnikały w szczeliny gnejsu. Kongsberg Sølvverk wydobywał z nich srebro od 1623 do 1958 roku, łącznie około 1350 ton; Kopalnia Królewska sięgnęła 1068 m w głąb, jej dno leży około 500 m poniżej poziomu morza, a chodniki drążono metodą ogniową aż do 1890 roku (było to jej ostatnie użycie w europejskim górnictwie), dzięki czemu ich ściany są gładkie i zaokrąglone.',
          'Srebro drucikowe rośnie na siarczku srebra (Ag2S). Powyżej około 177 °C akantyt przechodzi w argentyt, jeden z najszybszych znanych przewodników jonów: jony Ag+ biegną przez ciało stałe do miejsca, w którym styka się ono z drucikiem, i tam stają się metalem, więc drucik przyrasta od podstawy i jest wypychany (w płomieniu, w temperaturze od 450 do 700 °C, o milimetry w pół godziny). Czy druciki z Kongsbergu rosły na gorąco, czy powoli i na zimno, gdy wody podziemne przeobrażały siarczek, wciąż jest przedmiotem sporu.',
        ],
      },
      de: {
        kid: [
          'In Kongsberg in Norwegen wächst Silber manchmal in Locken aus dem Gestein, wie Haare oder Draht. Man erzählt, dass 1623 zwei Kinder, Helga und Jacob, Vieh hüteten, als ihr Ochse mit den Hörnern gegen einen Felsen stieß, und etwas glänzte: Silber! Im Jahr darauf kam der König und gründete dort eine Stadt, Kongsberg, den „Berg des Königs“.',
          'Bergleute arbeiteten dort 335 Jahre lang. Sie machten das harte Gestein mit Feuer mürbe und gruben mehr als 1000 m tief. Im Gestein versteckt sich das Silber in einem schwarzen Mineral, dem Silbersulfid. Forscher können in einer Flamme Silberhaare daraus wachsen lassen: Das Silber kriecht durch den festen schwarzen Kristall bis zur Wurzel des Drahtes und schiebt ihn von unten hinaus, wie Zahnpasta aus der Tube.',
        ],
        sci: [
          'Die Erzgänge von Kongsberg entstanden vor etwa 265 Millionen Jahren, als 200 bis 300 °C heiße Solen durch Klüfte im Gneis aufstiegen. Kongsberg Sølvverk baute sie von 1623 bis 1958 ab, insgesamt etwa 1350 Tonnen Silber; die Königsgrube reichte 1068 m tief, ihr Grund liegt rund 500 m unter dem Meeresspiegel, und ihre Strecken wurden bis 1890 durch Feuersetzen vorgetrieben, der letzte Einsatz dieser Technik im europäischen Bergbau, der ihre Wände glatt und rund werden ließ.',
          'Drahtsilber wächst auf Silbersulfid (Ag2S). Oberhalb von etwa 177 °C wird Akanthit zu Argentit, einem der schnellsten bekannten Ionenleiter: Ag+-Ionen wandern durch den Feststoff bis dorthin, wo er den Draht berührt, und werden dort zu Metall, sodass der Draht an seiner Basis wächst und hinausgeschoben wird (in einer Flamme, bei 450 bis 700 °C, um Millimeter in einer halben Stunde). Ob die Drähte von Kongsberg heiß wuchsen oder langsam und kühl, während Grundwasser das Sulfid veränderte, ist noch umstritten.',
        ],
      },
    },
  },
  {
    id: 'snow',
    color: '#5fd3ff',
    title: {
      en: 'Can people make it snow?',
      'pt-pt': 'Será possível fazer nevar?',
      pl: 'Czy ludzie potrafią zrobić śnieg?',
      de: 'Können Menschen Schnee machen?',
    },
    story: {
      en: {
        kid: [
          'In July 1946 Vincent Schaefer was making clouds in a freezer. His breath made a cloud of tiny water droplets that stayed liquid even below freezing. When he dropped in a lump of dry ice, millions of ice crystals suddenly sparkled in his lamp’s beam! That November he flew over Mount Greylock, in the USA, sprinkled dry ice into a real cloud, and streamers of snow fell from it, though they vanished in the air before reaching the ground.',
          'The next day his friend Bernard Vonnegut found something even better: silver iodide. Its crystals are built almost exactly like ice, so water molecules line up on them as if they were ice, and a snowflake starts to grow. Today planes and burners on the ground send silver iodide smoke into clouds in many countries, but how much extra rain or snow it really brings is still being studied.',
        ],
        sci: [
          'Cloud droplets can stay liquid far below 0 °C, down to about −38 °C, until something starts an ice crystal. In Schaefer’s freezer at the General Electric laboratory (July 1946), dry ice at −78 °C made ice crystals by the million; on 13 November 1946 he dropped a few kilograms of crushed dry ice into a supercooled altocumulus at about 4300 m and −18.5 °C, and snow fell from its base.',
          'On 14 November Bernard Vonnegut found that silver iodide starts ice from a few degrees below zero: the layers of its hexagonal crystal (a = 4.59 Å) match those of ice (4.52 Å) within about 2%. In a cloud the new crystals grow at the expense of the droplets (the Bergeron process) until they fall. Seeding is used in China, the USA and elsewhere; field studies such as SNOWIE (Idaho, 2017) have watched seeded snow form, but the total gain is small and hard to measure.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em julho de 1946, Vincent Schaefer andava a fazer nuvens dentro de uma arca congeladora. O bafo dele formava uma nuvem de gotinhas de água que ficavam líquidas mesmo abaixo de zero. Quando deitou lá dentro um pedaço de gelo seco, de repente milhões de cristais de gelo cintilaram no feixe da lanterna! Em novembro, voou sobre o monte Greylock, nos EUA, espalhou gelo seco numa nuvem verdadeira, e caíram dela fitas de neve, que se desfizeram no ar antes de chegarem ao chão.',
          'No dia seguinte, o amigo dele Bernard Vonnegut descobriu uma coisa ainda melhor: o iodeto de prata. Os cristais dele são construídos quase exatamente como os do gelo, por isso as moléculas de água alinham-se neles como se fossem gelo, e um floco de neve começa a crescer. Hoje, aviões e queimadores no chão lançam fumo de iodeto de prata para as nuvens em muitos países, mas quanta chuva ou neve a mais isso traz de verdade ainda está a ser estudado.',
        ],
        sci: [
          'As gotas das nuvens podem ficar líquidas muito abaixo de 0 °C, até cerca de −38 °C, enquanto nada fizer começar um cristal de gelo. Na arca de Schaefer, no laboratório da General Electric (julho de 1946), o gelo seco a −78 °C fazia cristais de gelo aos milhões; a 13 de novembro de 1946, ele largou uns quilos de gelo seco esmagado num altocúmulo sobrearrefecido a cerca de 4300 m e −18,5 °C, e caiu neve da sua base.',
          'A 14 de novembro, Bernard Vonnegut descobriu que o iodeto de prata faz nascer gelo logo a poucos graus abaixo de zero: as camadas do seu cristal hexagonal (a = 4,59 Å) coincidem com as do gelo (4,52 Å) com uma diferença de cerca de 2%. Numa nuvem, os cristais novos crescem à custa das gotas (o processo de Bergeron) até caírem. A sementeira de nuvens usa-se na China, nos EUA e noutros países; estudos de campo como o SNOWIE (Idaho, 2017) viram formar-se neve semeada, mas o ganho total é pequeno e difícil de medir.',
        ],
      },
      pl: {
        kid: [
          'W lipcu 1946 roku Vincent Schaefer robił chmury w zamrażarce. Jego oddech tworzył chmurkę kropelek wody, które zostawały płynne nawet poniżej zera. Kiedy wrzucił do środka kawałek suchego lodu, nagle w świetle lampy zamigotały miliony kryształków lodu! W listopadzie przeleciał samolotem nad górą Greylock w USA, rozsypał suchy lód w prawdziwej chmurze i spadły z niej smugi śniegu, które jednak rozpłynęły się w powietrzu, zanim doleciały do ziemi.',
          'Następnego dnia jego kolega Bernard Vonnegut znalazł coś jeszcze lepszego: jodek srebra. Jego kryształy są zbudowane prawie dokładnie tak jak lód, więc cząsteczki wody układają się na nich, jakby to był lód, i zaczyna rosnąć płatek śniegu. Dziś w wielu krajach samoloty i palniki na ziemi wpuszczają w chmury dym z jodku srebra, ale ile dodatkowego deszczu czy śniegu to naprawdę daje, wciąż się bada.',
        ],
        sci: [
          'Kropelki w chmurach mogą pozostać ciekłe dużo poniżej 0 °C, aż do około −38 °C, dopóki coś nie zapoczątkuje kryształu lodu. W zamrażarce Schaefera w laboratorium General Electric (lipiec 1946) suchy lód o temperaturze −78 °C wytwarzał kryształki lodu milionami; 13 listopada 1946 roku Schaefer zrzucił kilka kilogramów kruszonego suchego lodu do przechłodzonej chmury altocumulus na wysokości około 4300 m, w temperaturze −18,5 °C, i z jej podstawy spadł śnieg.',
          '14 listopada Bernard Vonnegut odkrył, że jodek srebra zapoczątkowuje lód już kilka stopni poniżej zera: warstwy jego heksagonalnego kryształu (a = 4,59 Å) pasują do warstw lodu (4,52 Å) z dokładnością do około 2%. W chmurze nowe kryształki rosną kosztem kropelek (proces Bergerona), aż zaczną spadać. Zasiewanie chmur stosuje się w Chinach, USA i gdzie indziej; badania terenowe, takie jak SNOWIE (Idaho, 2017), pokazały powstawanie śniegu z zasiewu, ale całkowity zysk jest mały i trudny do zmierzenia.',
        ],
      },
      de: {
        kid: [
          'Im Juli 1946 machte Vincent Schaefer Wolken in einer Tiefkühltruhe. Sein Atem bildete eine Wolke aus winzigen Wassertröpfchen, die sogar unter null flüssig blieben. Als er ein Stück Trockeneis hineinwarf, funkelten plötzlich Millionen Eiskristalle im Strahl seiner Lampe! Im November flog er über den Mount Greylock in den USA, streute Trockeneis in eine echte Wolke, und Schneeschleier fielen aus ihr, die sich allerdings in der Luft auflösten, bevor sie den Boden erreichten.',
          'Am nächsten Tag fand sein Kollege Bernard Vonnegut etwas noch Besseres: Silberiodid. Seine Kristalle sind fast genau so gebaut wie Eis, darum reihen sich Wassermoleküle daran auf, als wäre es Eis, und eine Schneeflocke beginnt zu wachsen. Heute bringen Flugzeuge und Brenner am Boden in vielen Ländern Silberiodid-Rauch in die Wolken, aber wie viel Regen oder Schnee das wirklich zusätzlich bringt, wird noch erforscht.',
        ],
        sci: [
          'Wolkentröpfchen können weit unter 0 °C flüssig bleiben, bis etwa −38 °C, solange nichts einen Eiskristall anstößt. In Schaefers Truhe im Labor von General Electric (Juli 1946) erzeugte Trockeneis von −78 °C Eiskristalle zu Millionen; am 13. November 1946 warf er einige Kilogramm zerstoßenes Trockeneis in einen unterkühlten Altocumulus in etwa 4300 m Höhe bei −18,5 °C, und aus seiner Unterseite fiel Schnee.',
          'Am 14. November entdeckte Bernard Vonnegut, dass Silberiodid schon wenige Grad unter null Eis entstehen lässt: Die Schichten seines hexagonalen Kristalls (a = 4,59 Å) passen auf etwa 2% genau zu denen des Eises (4,52 Å). In der Wolke wachsen die neuen Kristalle auf Kosten der Tröpfchen (Bergeron-Prozess), bis sie fallen. Wolkenimpfen wird in China, den USA und anderswo betrieben; Feldstudien wie SNOWIE (Idaho, 2017) haben beobachtet, wie Impfschnee entsteht, doch der Gesamtgewinn ist klein und schwer zu messen.',
        ],
      },
    },
  },
  {
    id: 'photo',
    color: '#ff5f6d',
    title: {
      en: 'How were photos made before phones?',
      'pt-pt': 'Como se tiravam fotos sem telemóvel?',
      pl: 'Jak robiono zdjęcia bez telefonów?',
      de: 'Wie entstanden Fotos ohne Handy?',
    },
    story: {
      en: {
        kid: [
          'With silver! In 1839 Louis Daguerre showed the world pictures made on plates of polished silver. Later, films and photo paper were coated with tiny crystals of a silver salt. Where light touched a crystal, it made a few atoms of silver, far too few to see: a hidden picture.',
          'In a darkroom, lit only by a red lamp that the paper cannot see, the photographer slides the paper into a bath called the developer, and slowly the picture appears: every crystal that light touched turns into a grain of black silver. Another bath washes the rest away. The dark parts of an old black-and-white photo are made of silver!',
        ],
        sci: [
          'In a film or paper, crystals of silver bromide a fraction of a micrometre across sit in gelatin. A photon frees an electron, which is caught at a defect and turns a mobile Ag+ ion into a silver atom; once about four atoms gather, the grain is developable: the latent image (Gurney and Mott, 1938). The developer, a reducing agent, then turns the whole grain, billions of Ag+ ions, into silver: a gain of about a billion.',
          'The fixer, sodium thiosulfate (“hypo”, introduced by John Herschel in 1839), dissolves the unexposed silver bromide as a complex, so the picture no longer darkens in light. Paper is sensitive mainly to blue light, so a red or amber safelight does not fog it. Daguerre’s plates were silvered copper made sensitive with iodine vapour and developed with mercury vapour; Talbot’s calotype (1841) gave a paper negative from which any number of prints could be made.',
        ],
      },
      'pt-pt': {
        kid: [
          'Com prata! Em 1839, Louis Daguerre mostrou ao mundo imagens feitas em placas de prata polida. Mais tarde, os rolos e o papel fotográfico passaram a ser cobertos de cristais minúsculos de um sal de prata. Onde a luz tocava num cristal, fazia aparecer uns poucos átomos de prata, muito poucos para se verem: uma imagem escondida.',
          'Numa câmara escura, iluminada só por uma lâmpada vermelha que o papel não vê, o fotógrafo mergulha o papel num banho chamado revelador, e a imagem aparece devagarinho: cada cristal tocado pela luz transforma-se num grão de prata negra. Outro banho leva o resto. As partes escuras de uma fotografia antiga a preto e branco são feitas de prata!',
        ],
        sci: [
          'Num rolo ou num papel, cristais de brometo de prata com uma fração de micrómetro estão presos em gelatina. Um fotão liberta um eletrão, que fica preso num defeito e transforma um ião Ag+ móvel num átomo de prata; quando se juntam uns quatro átomos, o grão fica revelável: é a imagem latente (Gurney e Mott, 1938). O revelador, um redutor, transforma depois o grão inteiro, milhares de milhões de iões Ag+, em prata: um ganho de cerca de mil milhões.',
          'O fixador, tiossulfato de sódio («hipo», introduzido por John Herschel em 1839), dissolve sob a forma de um complexo o brometo de prata que não foi exposto, e a imagem deixa de escurecer à luz. O papel é sensível sobretudo à luz azul, por isso uma luz de segurança vermelha ou âmbar não o vela. As placas de Daguerre eram de cobre prateado, sensibilizadas com vapor de iodo e reveladas com vapor de mercúrio; o calótipo de Talbot (1841) dava um negativo em papel do qual se podiam fazer quantas cópias se quisesse.',
        ],
      },
      pl: {
        kid: [
          'Za pomocą srebra! W 1839 roku Louis Daguerre pokazał światu obrazy utrwalone na płytkach z polerowanego srebra. Później klisze i papier fotograficzny pokrywano malutkimi kryształkami soli srebra. Tam, gdzie światło dotknęło kryształka, powstawało kilka atomów srebra, o wiele za mało, żeby je zobaczyć: ukryty obraz.',
          'W ciemni, oświetlonej tylko czerwoną lampą, której papier nie widzi, fotograf wkłada papier do kąpieli zwanej wywoływaczem i obraz powoli się pojawia: każdy kryształek, którego dotknęło światło, zmienia się w ziarenko czarnego srebra. Druga kąpiel wypłukuje resztę. Ciemne części starego czarno-białego zdjęcia są zrobione ze srebra!',
        ],
        sci: [
          'W kliszy lub papierze kryształki bromku srebra o rozmiarach ułamka mikrometra tkwią w żelatynie. Foton uwalnia elektron, który zostaje złapany na defekcie i zamienia ruchliwy jon Ag+ w atom srebra; gdy zbiorą się około czterech atomów, ziarno daje się wywołać: to obraz utajony (Gurney i Mott, 1938). Wywoływacz, czyli reduktor, zamienia potem w srebro całe ziarno, miliardy jonów Ag+: wzmocnienie około miliarda razy.',
          'Utrwalacz, tiosiarczan sodu („hypo”, wprowadzony przez Johna Herschela w 1839 roku), rozpuszcza nienaświetlony bromek srebra w postaci kompleksu, więc obraz już nie ciemnieje na świetle. Papier jest czuły głównie na światło niebieskie, dlatego czerwone lub bursztynowe światło ciemniowe go nie zaświetla. Płytki Daguerre’a były z posrebrzanej miedzi, uczulane parą jodu i wywoływane parą rtęci; kalotypia Talbota (1841) dawała papierowy negatyw, z którego można było zrobić dowolnie wiele odbitek.',
        ],
      },
      de: {
        kid: [
          'Mit Silber! 1839 zeigte Louis Daguerre der Welt Bilder auf Platten aus poliertem Silber. Später wurden Filme und Fotopapier mit winzigen Kristallen eines Silbersalzes beschichtet. Wo Licht einen Kristall traf, entstanden ein paar Silberatome, viel zu wenige, um sie zu sehen: ein verstecktes Bild.',
          'In der Dunkelkammer, die nur eine rote Lampe beleuchtet, die das Papier nicht sieht, legt der Fotograf das Papier in ein Bad namens Entwickler, und langsam erscheint das Bild: Jeder Kristall, den Licht getroffen hat, wird zu einem Korn aus schwarzem Silber. Ein weiteres Bad wäscht den Rest heraus. Die dunklen Stellen eines alten Schwarz-Weiß-Fotos sind aus Silber!',
        ],
        sci: [
          'In Film oder Papier stecken Silberbromidkristalle von Bruchteilen eines Mikrometers in Gelatine. Ein Photon setzt ein Elektron frei, das an einem Fehler gefangen wird und ein bewegliches Ag+-Ion zu einem Silberatom macht; sobald sich etwa vier Atome sammeln, ist das Korn entwickelbar: das latente Bild (Gurney und Mott, 1938). Der Entwickler, ein Reduktionsmittel, macht dann das ganze Korn, Milliarden Ag+-Ionen, zu Silber: eine Verstärkung um etwa das Milliardenfache.',
          'Das Fixierbad, Natriumthiosulfat („Fixiersalz“, 1839 von John Herschel eingeführt), löst das unbelichtete Silberbromid als Komplex, sodass das Bild im Licht nicht mehr nachdunkelt. Papier ist vor allem für blaues Licht empfindlich, darum verschleiert es eine rote oder bernsteinfarbene Dunkelkammerleuchte nicht. Daguerres Platten waren versilbertes Kupfer, mit Ioddampf lichtempfindlich gemacht und mit Quecksilberdampf entwickelt; Talbots Kalotypie (1841) lieferte ein Papiernegativ, von dem sich beliebig viele Abzüge machen ließen.',
        ],
      },
    },
  },
  {
    id: 'dollar',
    color: '#36c9b5',
    title: {
      en: 'Why is a dollar called a dollar?',
      'pt-pt': 'Porque se chama dólar ao dólar?',
      pl: 'Skąd dolar ma swoją nazwę?',
      de: 'Warum heißt der Dollar Dollar?',
    },
    story: {
      en: {
        kid: [
          'Because of silver! About 500 years ago, miners found lots of silver in a valley in Bohemia, in today’s Czechia, called Joachimsthal: St Joachim’s valley. From 1520 big silver coins were made there, called Joachimsthalers, soon just thalers. People all over Europe trusted them, and the name changed from language to language: tolar, talar, daler, dollar!',
          'Later Spain made even more big silver coins, from the mines of Mexico and the silver mountain of Potosí, in Bolivia: pieces of eight, each worth eight reales, the treasure pirates dreamed of. People cut them into eight bits to make change. When the USA made its own dollar in 1792, it copied them, and Americans still call a quarter of a dollar “two bits”.',
        ],
        sci: [
          'Silver found in 1516 made Joachimsthal (Jáchymov) the second town of Bohemia by 1533. On 9 January 1520 the Bohemian Diet let the Schlick counts strike large coins of about 93% silver, the Joachimsthaler Guldengroschen, and some 12 million thalers from the Ore Mountains spread through Europe by the mid-1500s. The Dutch daler went to New Amsterdam, and dollar became the English word for any big silver coin. Three centuries later Jáchymov’s pitchblende gave Marie and Pierre Curie their polonium and radium.',
          'Spain’s piece of eight, first authorised in 1497 and fixed in 1537 at 27.47 g of 93% silver, was struck in Mexico City from the 1530s and in Potosí from the 1570s, from the silver of Zacatecas, Guanajuato and Potosí’s Cerro Rico, and became the first world currency, carried to China by the Manila galleons. In the English colonies it was the Spanish dollar, cut into bits for change; the US Coinage Act of 1792 based the dollar on it (24.06 g of pure silver), and Spanish dollars stayed legal tender in the USA until 1857.',
        ],
      },
      'pt-pt': {
        kid: [
          'Por causa da prata! Há cerca de 500 anos, uns mineiros encontraram muita prata num vale da Boémia, na atual Chéquia, chamado Joachimsthal: o vale de São Joaquim. A partir de 1520 fizeram-se lá grandes moedas de prata, os joachimsthaler, que depressa passaram a chamar-se táleres. As pessoas de toda a Europa confiavam nelas, e o nome foi mudando de língua para língua: tolar, talar, daler, dólar!',
          'Mais tarde, Espanha fez ainda mais moedas grandes de prata, com a prata das minas do México e da montanha de prata de Potosí, na Bolívia: as peças de oito, cada uma a valer oito reales, o tesouro com que os piratas sonhavam. As pessoas cortavam-nas em oito bocados para fazer trocos. Quando os EUA fizeram o seu próprio dólar, em 1792, copiaram-nas, e os americanos ainda chamam «two bits», dois bocados, a um quarto de dólar.',
        ],
        sci: [
          'A prata encontrada em 1516 fez de Joachimsthal (Jáchymov) a segunda cidade da Boémia em 1533. A 9 de janeiro de 1520, a Dieta da Boémia deixou os condes Schlick cunhar moedas grandes com cerca de 93% de prata, os Joachimsthaler Guldengroschen, e em meados do século XVI uns 12 milhões de táleres dos Montes Metalíferos espalhavam-se pela Europa. O daler holandês chegou a Nova Amesterdão, e dollar tornou-se a palavra inglesa para qualquer moeda grande de prata. Três séculos depois, a pechblenda de Jáchymov deu a Marie e Pierre Curie o seu polónio e o seu rádio.',
          'A peça de oito espanhola, autorizada em 1497 e fixada em 1537 em 27,47 g de prata a 93%, foi cunhada na Cidade do México a partir da década de 1530 e em Potosí a partir da década de 1570, com a prata de Zacatecas, de Guanajuato e do Cerro Rico de Potosí, e tornou-se a primeira moeda mundial, levada até à China pelos galeões de Manila. Nas colónias inglesas era o dólar espanhol, cortado em bocados para trocos; a Lei da Moeda dos EUA de 1792 baseou nele o dólar (24,06 g de prata pura), e os dólares espanhóis tiveram curso legal nos EUA até 1857.',
        ],
      },
      pl: {
        kid: [
          'Przez srebro! Około 500 lat temu górnicy znaleźli mnóstwo srebra w czeskiej dolinie nazywanej Joachimsthal, czyli Doliną Świętego Joachima. Od 1520 roku bito tam duże srebrne monety, joachimstalery, które wkrótce nazwano po prostu talarami. Ludzie w całej Europie im ufali, a nazwa zmieniała się od języka do języka: tolar, talar, daler, dolar!',
          'Później Hiszpania biła jeszcze więcej dużych srebrnych monet, ze srebra z kopalń Meksyku i ze srebrnej góry Potosí w Boliwii: monety warte osiem reali, tak zwane „pieces of eight”, skarb, o którym marzyli piraci. Ludzie cięli je na osiem kawałków, żeby mieć drobne. Kiedy w 1792 roku USA stworzyły własnego dolara, wzorowały się na nich, a Amerykanie do dziś nazywają ćwierć dolara „two bits”, czyli dwa kawałki.',
        ],
        sci: [
          'Srebro znalezione w 1516 roku sprawiło, że do 1533 roku Joachimsthal (Jáchymov) stał się drugim miastem Czech. 9 stycznia 1520 roku sejm czeski pozwolił hrabiom Schlickom bić duże monety zawierające około 93% srebra, Joachimsthaler Guldengroschen, i do połowy XVI wieku po Europie rozeszło się około 12 milionów talarów z Rudaw. Holenderski daler dotarł do Nowego Amsterdamu, a dollar stał się angielskim słowem na każdą dużą srebrną monetę. Trzy stulecia później blenda smolista z Jáchymova dała Marii Skłodowskiej-Curie i Piotrowi Curie ich polon i rad.',
          'Hiszpańska moneta ośmiorealowa, wprowadzona w 1497 roku i ustalona w 1537 roku na 27,47 g srebra o zawartości 93%, była bita w mieście Meksyk od lat 30. XVI wieku i w Potosí od lat 70. XVI wieku, ze srebra z Zacatecas, Guanajuato i Cerro Rico w Potosí, i stała się pierwszą walutą światową, docierającą do Chin na galeonach z Manili. W angielskich koloniach był to dolar hiszpański, cięty na kawałki na drobne; amerykańska ustawa monetarna z 1792 roku oparła na nim dolara (24,06 g czystego srebra), a hiszpańskie dolary były w USA prawnym środkiem płatniczym do 1857 roku.',
        ],
      },
      de: {
        kid: [
          'Wegen des Silbers! Vor etwa 500 Jahren fanden Bergleute viel Silber in einem Tal in Böhmen, im heutigen Tschechien, das Joachimsthal hieß: das Tal des heiligen Joachim. Ab 1520 wurden dort große Silbermünzen geprägt, die Joachimsthaler, bald einfach Taler genannt. Menschen in ganz Europa vertrauten ihnen, und der Name wanderte von Sprache zu Sprache: Tolar, Talar, Daler, Dollar!',
          'Später prägte Spanien noch viel mehr große Silbermünzen, aus dem Silber der Minen Mexikos und des Silberbergs von Potosí in Bolivien: die Achterstücke, jedes acht Reales wert, der Schatz, von dem Piraten träumten. Man schnitt sie in acht Stücke, um Wechselgeld zu haben. Als die USA 1792 ihren eigenen Dollar schufen, ahmten sie sie nach, und Amerikaner nennen einen Vierteldollar noch heute „two bits“, zwei Stücke.',
        ],
        sci: [
          'Das 1516 gefundene Silber machte Joachimsthal (Jáchymov) bis 1533 zur zweitgrößten Stadt Böhmens. Am 9. Januar 1520 erlaubte der böhmische Landtag den Grafen Schlick, große Münzen mit etwa 93% Silber zu prägen, die Joachimsthaler Guldengroschen, und bis zur Mitte des 16. Jahrhunderts verbreiteten sich etwa 12 Millionen Taler aus dem Erzgebirge über Europa. Der niederländische Daler kam nach Nieuw Amsterdam, und dollar wurde das englische Wort für jede große Silbermünze. Drei Jahrhunderte später lieferte die Pechblende von Jáchymov Marie und Pierre Curie ihr Polonium und Radium.',
          'Das spanische Achterstück, 1497 eingeführt und 1537 auf 27,47 g Silber von 93% festgelegt, wurde ab den 1530er-Jahren in Mexiko-Stadt und ab den 1570er-Jahren in Potosí geprägt, aus dem Silber von Zacatecas, Guanajuato und dem Cerro Rico von Potosí, und wurde die erste Weltwährung, die mit den Manila-Galeonen bis nach China gelangte. In den englischen Kolonien hieß es Spanish dollar und wurde für Wechselgeld in Stücke geschnitten; das US-Münzgesetz von 1792 legte den Dollar danach fest (24,06 g reines Silber), und spanische Dollars blieben in den USA bis 1857 gesetzliches Zahlungsmittel.',
        ],
      },
    },
  },
]
