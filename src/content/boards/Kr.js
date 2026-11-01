// Krypton's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls (its
// Periodic Videos room is still to come, so no doorway yet), each a question that makes you walk up, and the
// story it opens (Explorer and Scientist). They add to the noble gases' neon sign workshop (the filling bench,
// radon's box, the name in neon, the spectroscope, the energy ladder, the history board, the balloons)
// instead of repeating it; `hidden` links to it. Pictures: public/boards/Kr/<id>.svg, drawn by tools/boards/Kr/
// (no words in them: the title is drawn in the visitor's language). Each picture has a room designed for it
// (picture-rooms.md).
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'hidden',
    color: '#a58cff',
    wing: 'signs',
    title: {
      en: 'What was hiding in the air?',
      'pt-pt': 'O que se escondia no ar?',
      pl: 'Co ukrywało się w powietrzu?',
      de: 'Was versteckte sich in der Luft?',
    },
    story: {
      en: {
        kid: [
          'Every breath you take holds a tiny bit of krypton: about one particle of air in a million. For a long time nobody knew it was there. In May 1898, in London, William Ramsay and Morris Travers were given three quarters of a litre of liquid air, colder than −190 °C, from a brand-new machine, and let it boil away almost completely.',
          'Nitrogen and oxygen turn to gas at lower temperatures than krypton, so they boiled away first. In the very last drops a heavier gas was waiting. In a glass tube with electricity it glowed with a bright yellow line and a bright green line that nobody had ever seen: a new element! They named it krypton, from the Greek kryptos, hidden.',
        ],
        sci: [
          'Krypton makes up 1.14 ppm of dry air by volume: a cubic metre of air holds about 1 cm³ of it. It boils at −153.2 °C, far above nitrogen (−195.8 °C), argon (−185.9 °C) and oxygen (−183.0 °C), so as liquid air evaporates it gathers in the last fraction. William Hampson, whose new liquefier made liquid air in quantity, supplied Ramsay and Travers with about 750 cm³ of it in May 1898.',
          'At University College London Travers kept the gas from the last 10 cm³ of the liquid, removed the oxygen and nitrogen, and put the rest in a vacuum tube: at the end of May its spectrum showed a yellow and a green line that belonged to no known element. Neon followed in June and xenon in July, all from liquid air, and Ramsay received the Nobel Prize in Chemistry in 1904. Krypton is still won the same way, as a by-product of large air-separation plants.',
        ],
      },
      'pt-pt': {
        kid: [
          'Cada vez que respiras, apanhas um bocadinho de crípton: cerca de uma partícula de ar em cada milhão. Durante muito tempo, ninguém sabia que ele lá estava. Em maio de 1898, em Londres, William Ramsay e Morris Travers receberam três quartos de litro de ar líquido, a menos de −190 °C, feito por uma máquina novinha em folha, e deixaram-no ferver quase todo.',
          'O azoto e o oxigénio passam a gás a temperaturas mais baixas do que o crípton, por isso foram-se embora primeiro. Nas últimas gotas esperava um gás mais pesado. Num tubo de vidro com eletricidade, brilhou com uma risca amarela e uma risca verde que ninguém tinha visto: um elemento novo! Chamaram-lhe crípton, do grego kryptos, escondido.',
        ],
        sci: [
          'O crípton é 1,14 ppm, em volume, do ar seco: um metro cúbico de ar tem cerca de 1 cm³ dele. Ferve a −153,2 °C, muito acima do azoto (−195,8 °C), do árgon (−185,9 °C) e do oxigénio (−183,0 °C), por isso, quando o ar líquido se evapora, acumula-se na última fração. William Hampson, cujo novo liquefator fazia ar líquido em quantidade, deu a Ramsay e Travers cerca de 750 cm³ dele em maio de 1898.',
          'Na University College London, Travers guardou o gás dos últimos 10 cm³ do líquido, retirou o oxigénio e o azoto e pôs o resto num tubo de vácuo: no fim de maio, o seu espetro mostrou uma risca amarela e uma verde que não pertenciam a nenhum elemento conhecido. O néon veio em junho e o xénon em julho, todos do ar líquido, e Ramsay recebeu o Prémio Nobel da Química em 1904. O crípton ainda se obtém assim, como subproduto das grandes fábricas de separação do ar.',
        ],
      },
      pl: {
        kid: [
          'W każdym twoim oddechu jest odrobina kryptonu: mniej więcej jedna cząstka powietrza na milion. Przez długi czas nikt nie wiedział, że tam jest. W maju 1898 roku w Londynie William Ramsay i Morris Travers dostali trzy czwarte litra ciekłego powietrza, zimniejszego niż −190 °C, z zupełnie nowej maszyny, i pozwolili mu prawie całkiem wyparować.',
          'Azot i tlen zamieniają się w gaz w niższej temperaturze niż krypton, więc uciekły pierwsze. W ostatnich kroplach czekał cięższy gaz. W szklanej rurce, przez którą płynął prąd, zaświecił jasną żółtą i jasną zieloną linią, jakich nikt wcześniej nie widział: nowy pierwiastek! Nazwali go kryptonem, od greckiego kryptos, czyli ukryty.',
        ],
        sci: [
          'Krypton stanowi 1,14 ppm objętości suchego powietrza: metr sześcienny powietrza zawiera go około 1 cm³. Wrze w −153,2 °C, znacznie wyżej niż azot (−195,8 °C), argon (−185,9 °C) i tlen (−183,0 °C), więc gdy ciekłe powietrze paruje, gromadzi się w ostatniej frakcji. William Hampson, którego nowy skraplacz wytwarzał ciekłe powietrze w dużych ilościach, dostarczył Ramsayowi i Traversowi w maju 1898 roku około 750 cm³ tej cieczy.',
          'W University College London Travers zachował gaz z ostatnich 10 cm³ cieczy, usunął tlen i azot, a resztę umieścił w rurce próżniowej: pod koniec maja jej widmo pokazało linię żółtą i zieloną, które nie należały do żadnego znanego pierwiastka. W czerwcu przyszedł neon, a w lipcu ksenon, wszystkie z ciekłego powietrza, a Ramsay otrzymał w 1904 roku Nagrodę Nobla w dziedzinie chemii. Krypton wciąż otrzymuje się tak samo, jako produkt uboczny dużych instalacji rozdziału powietrza.',
        ],
      },
      de: {
        kid: [
          'In jedem Atemzug steckt ein winziges bisschen Krypton: etwa ein Teilchen Luft von einer Million. Lange wusste niemand, dass es da ist. Im Mai 1898 bekamen William Ramsay und Morris Travers in London einen Dreiviertelliter flüssige Luft, kälter als −190 °C, aus einer brandneuen Maschine und ließen sie fast vollständig verkochen.',
          'Stickstoff und Sauerstoff werden schon bei tieferen Temperaturen gasförmig als Krypton, deshalb entwichen sie zuerst. In den allerletzten Tropfen wartete ein schwereres Gas. In einer Glasröhre mit Strom leuchtete es mit einer hellen gelben und einer hellen grünen Linie, die noch nie jemand gesehen hatte: ein neues Element! Sie nannten es Krypton, nach dem griechischen kryptos, verborgen.',
        ],
        sci: [
          'Krypton macht 1,14 ppm (Volumen) der trockenen Luft aus: Ein Kubikmeter Luft enthält etwa 1 cm³ davon. Es siedet bei −153,2 °C, weit über Stickstoff (−195,8 °C), Argon (−185,9 °C) und Sauerstoff (−183,0 °C), deshalb sammelt es sich beim Verdampfen flüssiger Luft im letzten Rest. William Hampson, dessen neue Verflüssigungsmaschine flüssige Luft in Mengen herstellte, lieferte Ramsay und Travers im Mai 1898 etwa 750 cm³ davon.',
          'Am University College London behielt Travers das Gas aus den letzten 10 cm³ der Flüssigkeit, entfernte Sauerstoff und Stickstoff und füllte den Rest in eine Vakuumröhre: Ende Mai zeigte ihr Spektrum eine gelbe und eine grüne Linie, die zu keinem bekannten Element gehörten. Neon folgte im Juni und Xenon im Juli, alle aus flüssiger Luft, und Ramsay erhielt 1904 den Nobelpreis für Chemie. Krypton wird noch heute so gewonnen, als Nebenprodukt großer Luftzerlegungsanlagen.',
        ],
      },
    },
  },
  {
    id: 'metre',
    color: '#ff7a3c',
    title: {
      en: 'How long is a metre, really?',
      'pt-pt': 'Quanto mede, afinal, um metro?',
      pl: 'Ile naprawdę mierzy metr?',
      de: 'Wie lang ist ein Meter wirklich?',
    },
    story: {
      en: {
        kid: [
          'To measure anything, everyone has to agree how long a metre is. For seventy years the answer was a metal bar kept in a vault near Paris: a metre was the distance between two fine lines scratched on it. But a bar can be damaged or lost, and it grows and shrinks a little when it warms or cools.',
          'So in 1960 scientists chose light instead. Krypton-86 glows with an orange-red light whose waves all have exactly the same length, and a metre became 1,650,763.73 of those waves. Anyone, anywhere, with a krypton lamp could make a perfect metre. In 1983 it changed again: now a metre is how far light travels in a tiny fraction of a second.',
        ],
        sci: [
          'From 1889 the metre was the distance, at 0 °C, between two lines on the International Prototype, a bar of platinum-iridium with an X-shaped section kept at the BIPM in Sèvres. In 1960 the 11th General Conference on Weights and Measures defined it instead as 1,650,763.73 wavelengths, in vacuum, of the radiation of krypton-86 between its levels 2p10 and 5d5: an orange-red line at 605.78 nm.',
          'The light came from a hot-cathode lamp whose capillary sat in a bath at the triple point of nitrogen (about 63 K), so the atoms moved slowly and the line stayed sharp; krypton-86 has no nuclear spin, so the line does not split. Interferometers compared lengths with it to about 4 parts in a billion. In 1983 the metre became the distance light travels in vacuum in 1/299,792,458 of a second.',
        ],
      },
      'pt-pt': {
        kid: [
          'Para medir seja o que for, toda a gente tem de concordar quanto mede um metro. Durante setenta anos, a resposta foi uma barra de metal guardada num cofre perto de Paris: um metro era a distância entre dois risquinhos finos gravados nela. Mas uma barra pode estragar-se ou perder-se, e cresce e encolhe um pouco quando aquece ou arrefece.',
          'Por isso, em 1960, os cientistas escolheram a luz. O crípton-86 brilha com uma luz laranja-avermelhada cujas ondas têm todas exatamente o mesmo comprimento, e um metro passou a ser 1 650 763,73 dessas ondas. Qualquer pessoa, em qualquer lugar, com uma lâmpada de crípton, podia fazer um metro perfeito. Em 1983 mudou outra vez: agora um metro é a distância que a luz percorre numa fração minúscula de segundo.',
        ],
        sci: [
          'A partir de 1889, o metro foi a distância, a 0 °C, entre dois traços do Protótipo Internacional, uma barra de platina e irídio com secção em X guardada no BIPM, em Sèvres. Em 1960, a 11.ª Conferência Geral de Pesos e Medidas definiu-o antes como 1 650 763,73 comprimentos de onda, no vazio, da radiação do crípton-86 entre os níveis 2p10 e 5d5: uma risca laranja-avermelhada a 605,78 nm.',
          'A luz vinha de uma lâmpada de cátodo quente cujo capilar ficava num banho ao ponto triplo do azoto (cerca de 63 K), para os átomos se moverem devagar e a risca ficar fina; o crípton-86 não tem spin nuclear, por isso a risca não se desdobra. Os interferómetros comparavam comprimentos com ela até cerca de 4 partes em mil milhões. Em 1983, o metro passou a ser a distância que a luz percorre no vazio em 1/299 792 458 de segundo.',
        ],
      },
      pl: {
        kid: [
          'Żeby cokolwiek zmierzyć, wszyscy muszą się zgodzić, ile wynosi metr. Przez siedemdziesiąt lat odpowiedzią był metalowy pręt przechowywany w skarbcu pod Paryżem: metr to była odległość między dwiema cienkimi kreskami wyrytymi na nim. Ale pręt można uszkodzić albo zgubić, a do tego trochę się wydłuża i skraca, gdy się ogrzewa lub stygnie.',
          'Dlatego w 1960 roku naukowcy wybrali światło. Krypton-86 świeci pomarańczowoczerwonym światłem, którego fale mają dokładnie taką samą długość, i metr stał się 1 650 763,73 takich fal. Każdy, w dowolnym miejscu, z lampą kryptonową mógł odtworzyć idealny metr. W 1983 roku znów to zmieniono: teraz metr to droga, jaką światło pokonuje w maleńkim ułamku sekundy.',
        ],
        sci: [
          'Od 1889 roku metr był odległością, w 0 °C, między dwiema kreskami na Międzynarodowym Prototypie, pręcie z platyny i irydu o przekroju w kształcie litery X, przechowywanym w BIPM w Sèvres. W 1960 roku 11. Generalna Konferencja Miar zdefiniowała go jako 1 650 763,73 długości fali, w próżni, promieniowania kryptonu-86 między poziomami 2p10 i 5d5: pomarańczowoczerwonej linii 605,78 nm.',
          'Światło pochodziło z lampy z gorącą katodą, której kapilara była zanurzona w kąpieli o temperaturze punktu potrójnego azotu (około 63 K), żeby atomy poruszały się powoli, a linia była ostra; krypton-86 nie ma spinu jądrowego, więc linia się nie rozszczepia. Interferometry porównywały z nią długości z dokładnością do około 4 części na miliard. W 1983 roku metr stał się drogą, jaką światło przebywa w próżni w czasie 1/299 792 458 sekundy.',
        ],
      },
      de: {
        kid: [
          'Um irgendetwas zu messen, müssen sich alle einig sein, wie lang ein Meter ist. Siebzig Jahre lang war die Antwort ein Metallstab in einem Tresor bei Paris: Ein Meter war der Abstand zwischen zwei feinen Strichen, die darauf eingeritzt waren. Aber ein Stab kann beschädigt werden oder verloren gehen, und er wird ein wenig länger und kürzer, wenn er sich erwärmt oder abkühlt.',
          'Deshalb wählten Forscher 1960 stattdessen das Licht. Krypton-86 leuchtet orangerot, und alle seine Lichtwellen sind genau gleich lang; ein Meter wurde zu 1 650 763,73 dieser Wellen. Jeder überall mit einer Kryptonlampe konnte nun einen perfekten Meter herstellen. 1983 änderte er sich noch einmal: Jetzt ist ein Meter die Strecke, die Licht in einem winzigen Bruchteil einer Sekunde zurücklegt.',
        ],
        sci: [
          'Ab 1889 war der Meter der Abstand, bei 0 °C, zwischen zwei Strichen auf dem Internationalen Prototyp, einem Stab aus Platin-Iridium mit X-förmigem Querschnitt, aufbewahrt beim BIPM in Sèvres. 1960 legte ihn die 11. Generalkonferenz für Maß und Gewicht stattdessen als 1 650 763,73 Wellenlängen, im Vakuum, der Strahlung von Krypton-86 zwischen den Niveaus 2p10 und 5d5 fest: einer orangeroten Linie bei 605,78 nm.',
          'Das Licht kam aus einer Lampe mit Glühkathode, deren Kapillare in einem Bad am Tripelpunkt des Stickstoffs (etwa 63 K) saß, damit sich die Atome langsam bewegten und die Linie scharf blieb; Krypton-86 hat keinen Kernspin, deshalb spaltet die Linie nicht auf. Interferometer verglichen Längen damit auf etwa 4 Milliardstel genau. 1983 wurde der Meter zur Strecke, die Licht im Vakuum in 1/299 792 458 Sekunde zurücklegt.',
        ],
      },
    },
  },
  {
    id: 'windows',
    color: '#ffc24a',
    title: {
      en: 'Why is there gas in your window?',
      'pt-pt': 'Porque há gás nas janelas?',
      pl: 'Dlaczego w oknie jest gaz?',
      de: 'Warum ist Gas im Fenster?',
    },
    story: {
      en: {
        kid: [
          'On a freezing night a house loses heat through its windows much faster than through its thick walls. So many new windows have two or three panes of glass with narrow gaps between them, sealed shut. The gaps are not filled with air: in the best windows they are filled with krypton.',
          'Heat crosses a gas when its particles bump into each other and pass the jiggle along. Krypton atoms are heavy and slow, so they pass heat on only about a third as well as air does. The invisible krypton blanket keeps the warmth in and the cold out, even in a gap thinner than your finger.',
        ],
        sci: [
          'In a sealed glazing unit heat crosses each gap by conduction through the gas, by convection if the gas starts to circulate, and by infrared radiation. An invisible low-emissivity coating of silver or tin oxide on the glass stops most of the radiation, and the gas sets the rest: krypton conducts heat at about 0.0095 W/(m·K), argon at 0.0177 and air at about 0.026, since its heavy atoms move slowly and carry energy across the gap slowly.',
          'A wider gap conducts less but lets the gas begin to circulate, so each gas has a best width, narrowest for krypton (roughly 8 to 12 mm, against about 15 mm for argon). Krypton thus makes slim triple glazing as good as thicker units filled with argon, and a triple-glazed, krypton-filled window with coated panes loses about a tenth as much heat as a single pane. It costs far more, being about 8000 times rarer in air than argon.',
        ],
      },
      'pt-pt': {
        kid: [
          'Numa noite gelada, uma casa perde calor pelas janelas muito mais depressa do que pelas paredes grossas. Por isso, muitas janelas novas têm dois ou três vidros com espaços estreitos entre eles, bem fechados. Esses espaços não estão cheios de ar: nas melhores janelas estão cheios de crípton.',
          'O calor atravessa um gás quando as suas partículas chocam umas com as outras e passam o abanão à seguinte. Os átomos de crípton são pesados e lentos, por isso passam o calor só cerca de um terço tão bem como o ar. Este cobertor invisível de crípton mantém o calor dentro de casa e o frio lá fora, mesmo num espaço mais fino do que o teu dedo.',
        ],
        sci: [
          'Numa unidade de vidro selada, o calor atravessa cada espaço por condução através do gás, por convecção se o gás começar a circular, e por radiação infravermelha. Um revestimento invisível de baixa emissividade, de prata ou de óxido de estanho, trava a maior parte da radiação, e o gás decide o resto: o crípton conduz o calor a cerca de 0,0095 W/(m·K), o árgon a 0,0177 e o ar a cerca de 0,026, porque os seus átomos pesados se movem devagar e levam a energia através do espaço devagar.',
          'Um espaço mais largo conduz menos, mas deixa o gás começar a circular, por isso cada gás tem uma largura ideal, a mais estreita para o crípton (cerca de 8 a 12 mm, contra uns 15 mm para o árgon). Assim, o crípton faz vidros triplos finos tão bons como unidades mais grossas cheias de árgon, e uma janela de vidro triplo com crípton e vidros revestidos perde cerca de um décimo do calor de um vidro simples. Custa muito mais, porque é cerca de 8000 vezes mais raro no ar do que o árgon.',
        ],
      },
      pl: {
        kid: [
          'W mroźną noc dom traci ciepło przez okna dużo szybciej niż przez grube ściany. Dlatego wiele nowych okien ma dwie albo trzy szyby z wąskimi, szczelnie zamkniętymi szczelinami między nimi. W tych szczelinach nie ma powietrza: w najlepszych oknach jest krypton.',
          'Ciepło przechodzi przez gaz, gdy jego cząstki zderzają się ze sobą i przekazują sobie drganie. Atomy kryptonu są ciężkie i powolne, więc przewodzą ciepło mniej więcej trzy razy gorzej niż powietrze. Niewidzialna kołderka z kryptonu trzyma ciepło w środku, a zimno na zewnątrz, nawet w szczelinie cieńszej niż twój palec.',
        ],
        sci: [
          'W szczelnej szybie zespolonej ciepło przechodzi przez każdą szczelinę przez przewodzenie w gazie, przez konwekcję, jeśli gaz zacznie krążyć, i przez promieniowanie podczerwone. Niewidoczna powłoka niskoemisyjna ze srebra lub tlenku cyny na szkle zatrzymuje większość promieniowania, a o reszcie decyduje gaz: przewodność cieplna kryptonu to około 0,0095 W/(m·K), argonu 0,0177, a powietrza około 0,026, bo ciężkie atomy kryptonu poruszają się powoli i powoli przenoszą energię przez szczelinę.',
          'Szersza szczelina przewodzi mniej, ale pozwala gazowi zacząć krążyć, więc każdy gaz ma najlepszą szerokość, najmniejszą dla kryptonu (mniej więcej 8 do 12 mm, wobec około 15 mm dla argonu). Dzięki temu krypton pozwala zrobić cienkie szyby trzyszybowe tak dobre jak grubsze pakiety wypełnione argonem, a okno trzyszybowe z kryptonem i powlekanymi szybami traci około jednej dziesiątej ciepła, które traci pojedyncza szyba. Kosztuje dużo więcej, bo w powietrzu jest go około 8000 razy mniej niż argonu.',
        ],
      },
      de: {
        kid: [
          'In einer eiskalten Nacht verliert ein Haus durch seine Fenster viel schneller Wärme als durch seine dicken Wände. Deshalb haben viele neue Fenster zwei oder drei Glasscheiben mit schmalen, dicht verschlossenen Spalten dazwischen. In den Spalten ist keine Luft: In den besten Fenstern ist dort Krypton.',
          'Wärme wandert durch ein Gas, wenn seine Teilchen gegeneinanderstoßen und das Zittern weitergeben. Kryptonatome sind schwer und langsam, deshalb leiten sie Wärme nur etwa ein Drittel so gut wie Luft. Die unsichtbare Kryptondecke hält die Wärme drinnen und die Kälte draußen, sogar in einem Spalt, der dünner ist als dein Finger.',
        ],
        sci: [
          'In einer versiegelten Isolierglaseinheit gelangt Wärme durch jeden Spalt durch Wärmeleitung im Gas, durch Konvektion, wenn das Gas zu zirkulieren beginnt, und durch Infrarotstrahlung. Eine unsichtbare Wärmeschutzbeschichtung aus Silber oder Zinnoxid auf dem Glas hält den Großteil der Strahlung auf, das Gas bestimmt den Rest: Krypton leitet Wärme mit etwa 0,0095 W/(m·K), Argon mit 0,0177 und Luft mit etwa 0,026, weil seine schweren Atome sich langsam bewegen und Energie nur langsam über den Spalt tragen.',
          'Ein breiterer Spalt leitet weniger, lässt das Gas aber zirkulieren, deshalb hat jedes Gas eine beste Breite, am schmalsten für Krypton (etwa 8 bis 12 mm, gegenüber rund 15 mm für Argon). So macht Krypton schlanke Dreifachverglasungen so gut wie dickere, mit Argon gefüllte, und ein dreifach verglastes Fenster mit Krypton und beschichteten Scheiben verliert etwa ein Zehntel so viel Wärme wie eine Einfachscheibe. Es kostet viel mehr, denn es ist in der Luft etwa 8000-mal seltener als Argon.',
        ],
      },
    },
  },
  {
    id: 'thruster',
    color: '#4fa3ff',
    title: {
      en: 'What pushes a satellite along?',
      'pt-pt': 'O que empurra um satélite?',
      pl: 'Co popycha satelitę?',
      de: 'Was schiebt einen Satelliten an?',
    },
    story: {
      en: {
        kid: [
          'Thousands of internet satellites circle the Earth, and thousands of them carry a little engine that runs on krypton. It burns nothing. Electricity from the solar panels knocks an electron off each krypton atom, and an electric push flings the atoms out of the back at more than 50,000 kilometres an hour, in a soft blue-violet glow.',
          'The push is gentle, about the weight of a coin resting on your hand, but in space nothing slows the satellite down, so the pushes add up. The satellites use them to climb to their working height after launch, to step out of the way of space junk, and at the end of their lives to drop back and burn up in the air.',
        ],
        sci: [
          'A Hall-effect thruster is a ring-shaped channel with a magnetic field across it. Electrons from a cathode are caught circling round the ring (the Hall current) and ionise the propellant atoms that flow in; the ions, too heavy for the field to hold, are accelerated out by an electric field of a few hundred volts, and the cathode sends electrons after them so the beam stays neutral. The exhaust leaves at about 15 to 20 km/s, four or five times faster than from the best chemical rockets, so little propellant is needed.',
          'Xenon, heavy and easy to ionise, was the usual propellant, but it is only 0.09 ppm of air and costly. Krypton is about thirteen times more plentiful and much cheaper, for a little less thrust per watt (its first ionisation energy is 14.0 eV against xenon’s 12.1 eV). SpaceX’s Starlink satellites, launched by the thousand since 2019, were the first to fly krypton Hall thrusters in such numbers, each about 70 mN at about 16 km/s; the larger satellites launched from 2023 use argon.',
        ],
      },
      'pt-pt': {
        kid: [
          'Há milhares de satélites de internet à volta da Terra, e milhares deles levam um pequeno motor que funciona com crípton. Não queima nada. A eletricidade dos painéis solares arranca um eletrão a cada átomo de crípton, e um empurrão elétrico atira os átomos pela parte de trás a mais de 50 000 quilómetros por hora, num brilho suave azul-violeta.',
          'O empurrão é suave, mais ou menos o peso de uma moeda pousada na tua mão, mas no espaço nada trava o satélite, por isso os empurrões vão-se somando. Os satélites usam-nos para subir até à altura de trabalho depois do lançamento, para se desviarem do lixo espacial e, no fim da vida, para descerem e arderem no ar.',
        ],
        sci: [
          'Um propulsor de efeito Hall é um canal em forma de anel atravessado por um campo magnético. Os eletrões de um cátodo ficam presos a girar à volta do anel (a corrente de Hall) e ionizam os átomos de propelente que entram; os iões, pesados demais para o campo os segurar, são acelerados para fora por um campo elétrico de algumas centenas de volts, e o cátodo manda eletrões atrás deles para o feixe ficar neutro. O jato sai a cerca de 15 a 20 km/s, quatro ou cinco vezes mais depressa do que nos melhores foguetões químicos, por isso é preciso pouco propelente.',
          'O xénon, pesado e fácil de ionizar, era o propelente habitual, mas é só 0,09 ppm do ar e caro. O crípton é cerca de treze vezes mais abundante e muito mais barato, com um pouco menos de força por watt (a sua primeira energia de ionização é de 14,0 eV, contra 12,1 eV do xénon). Os satélites Starlink da SpaceX, lançados aos milhares desde 2019, foram os primeiros a voar com propulsores Hall de crípton em tal número, cada um com cerca de 70 mN a cerca de 16 km/s; os satélites maiores lançados desde 2023 usam árgon.',
        ],
      },
      pl: {
        kid: [
          'Wokół Ziemi krążą tysiące satelitów internetowych, a tysiące z nich mają mały silnik na krypton. Niczego nie spala. Prąd z paneli słonecznych odrywa od każdego atomu kryptonu elektron, a elektryczne pchnięcie wyrzuca atomy z tyłu z prędkością ponad 50 000 kilometrów na godzinę, w łagodnej niebieskofioletowej poświacie.',
          'Pchnięcie jest delikatne, mniej więcej jak ciężar monety leżącej na twojej dłoni, ale w kosmosie nic nie hamuje satelity, więc pchnięcia się sumują. Satelity używają ich, żeby po starcie wznieść się na swoją wysokość roboczą, żeby usunąć się z drogi kosmicznym śmieciom, a pod koniec życia, żeby opaść i spłonąć w powietrzu.',
        ],
        sci: [
          'Silnik z efektem Halla to kanał w kształcie pierścienia z poprzecznym polem magnetycznym. Elektrony z katody zostają uwięzione i krążą wokół pierścienia (prąd Halla), jonizując wpływające atomy paliwa; jony, zbyt ciężkie, by pole je utrzymało, są przyspieszane na zewnątrz polem elektrycznym o napięciu kilkuset woltów, a katoda wysyła za nimi elektrony, żeby wiązka pozostała obojętna. Strumień wylatuje z prędkością około 15 do 20 km/s, cztery do pięciu razy szybciej niż z najlepszych rakiet chemicznych, więc potrzeba niewiele paliwa.',
          'Ksenon, ciężki i łatwy do zjonizowania, był zwykłym paliwem, ale stanowi tylko 0,09 ppm powietrza i jest drogi. Kryptonu jest około trzynastu razy więcej i jest dużo tańszy, za cenę nieco mniejszego ciągu na wat (jego pierwsza energia jonizacji to 14,0 eV, wobec 12,1 eV ksenonu). Satelity Starlink firmy SpaceX, wynoszone tysiącami od 2019 roku, jako pierwsze latały z kryptonowymi silnikami Halla w takiej liczbie, każdy o ciągu około 70 mN przy około 16 km/s; większe satelity wynoszone od 2023 roku używają argonu.',
        ],
      },
      de: {
        kid: [
          'Tausende Internetsatelliten kreisen um die Erde, und Tausende von ihnen haben ein kleines Triebwerk, das mit Krypton läuft. Es verbrennt nichts. Strom aus den Solarpaneelen schlägt jedem Kryptonatom ein Elektron ab, und ein elektrischer Schub schleudert die Atome hinten hinaus, mit mehr als 50 000 Kilometern pro Stunde, in einem sanften blauvioletten Leuchten.',
          'Der Schub ist sanft, etwa so stark wie das Gewicht einer Münze auf deiner Hand, aber im All bremst nichts den Satelliten, deshalb summieren sich die Stöße. Die Satelliten nutzen sie, um nach dem Start auf ihre Arbeitshöhe zu steigen, um Weltraumschrott auszuweichen und am Ende ihres Lebens, um zurückzusinken und in der Luft zu verglühen.',
        ],
        sci: [
          'Ein Hall-Effekt-Triebwerk ist ein ringförmiger Kanal mit einem Magnetfeld quer hindurch. Elektronen aus einer Kathode werden darin gefangen, kreisen um den Ring (der Hall-Strom) und ionisieren die einströmenden Treibstoffatome; die Ionen, zu schwer, als dass das Feld sie halten könnte, werden von einem elektrischen Feld von einigen hundert Volt hinausbeschleunigt, und die Kathode schickt ihnen Elektronen hinterher, damit der Strahl neutral bleibt. Der Strahl verlässt das Triebwerk mit etwa 15 bis 20 km/s, vier- bis fünfmal schneller als bei den besten chemischen Raketen, deshalb braucht es wenig Treibstoff.',
          'Xenon, schwer und leicht zu ionisieren, war der übliche Treibstoff, aber es macht nur 0,09 ppm der Luft aus und ist teuer. Krypton ist etwa dreizehnmal häufiger und viel billiger, bei etwas weniger Schub pro Watt (seine erste Ionisierungsenergie beträgt 14,0 eV gegenüber 12,1 eV beim Xenon). Die Starlink-Satelliten von SpaceX, seit 2019 zu Tausenden gestartet, flogen als erste Krypton-Hall-Triebwerke in solcher Zahl, jedes mit etwa 70 mN bei etwa 16 km/s; die größeren Satelliten, die seit 2023 starten, nutzen Argon.',
        ],
      },
    },
  },
  {
    id: 'water',
    color: '#35d3c0',
    title: {
      en: 'Water a million years old?',
      'pt-pt': 'Água com um milhão de anos?',
      pl: 'Woda sprzed miliona lat?',
      de: 'Wasser, eine Million Jahre alt?',
    },
    story: {
      en: {
        kid: [
          'Deep under the Sahara Desert lies a huge hidden sea: water soaked into sandstone, like water in a sponge. It fell as rain long ago, when the Sahara was green, and has been creeping north through the rock ever since, a metre or two a year. Today people in Egypt and Libya pump it up to drink and to water their fields. But how old is it?',
          'Krypton can tell. High in the air, cosmic rays make a rare kind of krypton, krypton-81, and rain carries a little of it underground. Down there no more is made, and the krypton-81 slowly disappears: every 229,000 years half of what is left is gone. In 2004 scientists caught single atoms of it with lasers and found that some of this water fell as rain about a million years ago.',
        ],
        sci: [
          'Krypton-81 (half-life 229,000 years) forms in the upper atmosphere when cosmic rays strike krypton-80 (neutron capture) and heavier krypton isotopes (spallation); fewer than one krypton atom in a trillion is krypton-81. Its level in the air has stayed nearly steady, it neither reacts with rock nor sticks to it, and almost none is made underground, so it is a near-ideal clock for water and ice from about 50,000 to a million years old.',
          'Counting such rare atoms needed a new method, Atom Trap Trace Analysis, built at Argonne National Laboratory by Zheng-Tian Lu’s group: lasers tuned to krypton-81 alone slow and catch its atoms in a magneto-optical trap, and each one is seen by the light it scatters. In 2004 Neil Sturchio and colleagues degassed thousands of litres of water from deep wells in Egypt’s Western Desert and found ages from about 200,000 to 1 million years in the Nubian Sandstone Aquifer. In 2014 the same clock dated 120,000-year-old ice at Taylor Glacier, Antarctica.',
        ],
      },
      'pt-pt': {
        kid: [
          'Muito abaixo do deserto do Sara há um enorme mar escondido: água entranhada no arenito, como água numa esponja. Caiu como chuva há muito tempo, quando o Sara era verde, e desde então anda devagarinho para norte através da rocha, um ou dois metros por ano. Hoje, no Egito e na Líbia, as pessoas bombeiam-na para beber e regar os campos. Mas que idade terá?',
          'O crípton sabe dizer. Lá no alto, os raios cósmicos fazem um tipo raro de crípton, o crípton-81, e a chuva leva um pouco dele para debaixo da terra. Lá em baixo já não se faz mais, e o crípton-81 vai desaparecendo devagar: a cada 229 000 anos desaparece metade do que restava. Em 2004, cientistas apanharam átomos dele, um a um, com lasers e descobriram que parte desta água caiu como chuva há cerca de um milhão de anos.',
        ],
        sci: [
          'O crípton-81 (meia-vida de 229 000 anos) forma-se na alta atmosfera quando os raios cósmicos atingem o crípton-80 (captura de neutrões) e isótopos de crípton mais pesados (espalação); menos de um átomo de crípton em cada bilião é crípton-81. O seu nível no ar manteve-se quase constante, não reage com a rocha nem se agarra a ela, e quase nenhum se forma no subsolo, por isso é um relógio quase ideal para água e gelo com cerca de 50 000 a um milhão de anos.',
          'Contar átomos tão raros exigiu um método novo, a Atom Trap Trace Analysis, criada no Argonne National Laboratory pelo grupo de Zheng-Tian Lu: lasers afinados só para o crípton-81 travam e prendem os seus átomos numa armadilha magneto-ótica, e cada um é visto pela luz que espalha. Em 2004, Neil Sturchio e colegas extraíram os gases de milhares de litros de água de poços profundos do Deserto Ocidental do Egito e encontraram idades de cerca de 200 000 a 1 milhão de anos no Aquífero de Arenito Núbio. Em 2014, o mesmo relógio datou gelo com 120 000 anos no glaciar Taylor, na Antártida.',
        ],
      },
      pl: {
        kid: [
          'Głęboko pod Saharą leży ogromne ukryte morze: woda wsiąknięta w piaskowiec jak woda w gąbkę. Spadła jako deszcz dawno temu, kiedy Sahara była zielona, i od tamtej pory powoli płynie przez skałę na północ, metr lub dwa na rok. Dziś ludzie w Egipcie i Libii wypompowują ją, żeby ją pić i podlewać pola. Ale ile ona ma lat?',
          'Krypton potrafi to powiedzieć. Wysoko w powietrzu promienie kosmiczne tworzą rzadki rodzaj kryptonu, krypton-81, a deszcz zanosi trochę go pod ziemię. Tam już nie powstaje nowy, a krypton-81 powoli znika: co 229 000 lat znika połowa tego, co zostało. W 2004 roku naukowcy złapali laserami pojedyncze jego atomy i odkryli, że część tej wody spadła jako deszcz około miliona lat temu.',
        ],
        sci: [
          'Krypton-81 (okres półtrwania 229 000 lat) powstaje w górnej atmosferze, gdy promienie kosmiczne trafiają w krypton-80 (wychwyt neutronu) i cięższe izotopy kryptonu (spalacja); mniej niż jeden atom kryptonu na bilion to krypton-81. Jego zawartość w powietrzu jest prawie stała, nie reaguje ze skałą ani do niej nie przywiera i prawie wcale nie powstaje pod ziemią, więc jest niemal idealnym zegarem dla wody i lodu w wieku od około 50 000 do miliona lat.',
          'Liczenie tak rzadkich atomów wymagało nowej metody, Atom Trap Trace Analysis, zbudowanej w Argonne National Laboratory przez grupę, którą kierował Zheng-Tian Lu: lasery dostrojone tylko do kryptonu-81 spowalniają i łapią jego atomy w pułapce magnetooptycznej, a każdy z nich widać po świetle, które rozprasza. W 2004 roku Neil Sturchio i współpracownicy odgazowali tysiące litrów wody z głębokich studni na Pustyni Zachodniej w Egipcie i znaleźli w Nubijskim Systemie Wodonośnym wodę w wieku od około 200 000 do miliona lat. W 2014 roku ten sam zegar wyznaczył wiek lodu z Lodowca Taylora na Antarktydzie na 120 000 lat.',
        ],
      },
      de: {
        kid: [
          'Tief unter der Sahara liegt ein riesiges verborgenes Meer: Wasser, das sich in Sandstein gesogen hat wie Wasser in einen Schwamm. Es fiel vor langer Zeit als Regen, als die Sahara grün war, und kriecht seitdem durch das Gestein nach Norden, ein oder zwei Meter im Jahr. Heute pumpen Menschen in Ägypten und Libyen es herauf, um es zu trinken und ihre Felder zu bewässern. Aber wie alt ist es?',
          'Krypton kann es verraten. Hoch oben in der Luft erzeugt die kosmische Strahlung eine seltene Sorte Krypton, Krypton-81, und der Regen trägt ein wenig davon in den Boden. Dort unten entsteht kein neues mehr, und das Krypton-81 verschwindet langsam: Alle 229 000 Jahre ist die Hälfte des Restes weg. 2004 fingen Forscher einzelne Atome davon mit Lasern ein und fanden heraus, dass ein Teil dieses Wassers vor etwa einer Million Jahren als Regen fiel.',
        ],
        sci: [
          'Krypton-81 (Halbwertszeit 229 000 Jahre) entsteht in der oberen Atmosphäre, wenn kosmische Strahlung Krypton-80 (Neutroneneinfang) und schwerere Kryptonisotope (Spallation) trifft; weniger als eines von einer Billion Kryptonatomen ist Krypton-81. Sein Anteil in der Luft ist fast gleich geblieben, es reagiert nicht mit dem Gestein und haftet nicht daran, und unter der Erde entsteht fast keines, deshalb ist es eine nahezu ideale Uhr für Wasser und Eis von etwa 50 000 bis zu einer Million Jahren.',
          'Um so seltene Atome zu zählen, brauchte es eine neue Methode, die Atom Trap Trace Analysis, gebaut am Argonne National Laboratory von der Gruppe um Zheng-Tian Lu: Laser, die nur auf Krypton-81 abgestimmt sind, bremsen seine Atome und fangen sie in einer magneto-optischen Falle, und jedes verrät sich durch das Licht, das es streut. 2004 entgasten Neil Sturchio und Kollegen Tausende Liter Wasser aus tiefen Brunnen in Ägyptens Westlicher Wüste und fanden im Nubischen Sandstein-Aquifer Alter von etwa 200 000 bis 1 Million Jahren. 2014 datierte dieselbe Uhr 120 000 Jahre altes Eis am Taylor-Gletscher in der Antarktis.',
        ],
      },
    },
  },
  {
    id: 'hands',
    color: '#ff5fb0',
    title: {
      en: 'Can a noble gas hold hands?',
      'pt-pt': 'Um gás nobre pode dar a mão?',
      pl: 'Czy gaz szlachetny poda rękę?',
      de: 'Kann ein Edelgas Hände halten?',
    },
    story: {
      en: {
        kid: [
          'Krypton has no hands: its outer shell of electrons is full, so it hardly ever joins another atom. But fluorine is the greediest atom of all. In 1963 chemists cooled krypton and fluorine far below freezing and zapped them with electric sparks or ultraviolet light, and got colourless crystals: krypton difluoride, one krypton holding a fluorine on each side.',
          'The hold is weak: at room temperature the crystals slowly fall apart, and on the way they are fierce enough to attack even gold. Krypton and fluorine can also hold hands for just a few billionths of a second: zapped with electricity they join, then spring apart with a flash of ultraviolet light. That flash makes a powerful laser, which has printed the tiny patterns of computer chips.',
        ],
        sci: [
          'Krypton difluoride, KrF2, was first made in 1963 (one early report took it for KrF4), by an electric discharge through krypton and fluorine or ultraviolet light on them at low temperature, a year after the first xenon compounds. The linear F-Kr-F molecule is held by a three-centre, four-electron bond. The colourless solid decomposes by about 10% an hour at room temperature and keeps at −78 °C.',
          'It is among the strongest oxidising agents known: it takes gold to its +5 state, 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr. The excimer KrF* exists only excited: in a discharge through krypton with a little fluorine it forms, lives a few nanoseconds and comes apart as it emits at 248 nm, its ground state being repulsive. KrF lasers printed chips of the 250 to 130 nm generations around 2000, and the Nike laser at the US Naval Research Laboratory uses one for fusion research.',
        ],
      },
      'pt-pt': {
        kid: [
          'O crípton não tem mãos: a sua camada de eletrões de fora está cheia, por isso quase nunca se junta a outro átomo. Mas o flúor é o átomo mais guloso de todos. Em 1963, uns químicos arrefeceram crípton e flúor muito abaixo de zero, deram-lhes faíscas elétricas ou luz ultravioleta e obtiveram cristais incolores: difluoreto de crípton, um crípton a segurar um flúor de cada lado.',
          'O aperto é fraco: à temperatura ambiente, os cristais desfazem-se aos poucos e, pelo caminho, são tão ferozes que atacam até o ouro. O crípton e o flúor também podem dar as mãos só por uns mil-milionésimos de segundo: com uma descarga elétrica juntam-se e depois separam-se de repente com um clarão de luz ultravioleta. Esse clarão faz um laser poderoso, que já imprimiu os desenhos minúsculos dos chips de computador.',
        ],
        sci: [
          'O difluoreto de crípton, KrF2, foi feito pela primeira vez em 1963 (um dos primeiros relatos tomou-o por KrF4), com uma descarga elétrica através de crípton e flúor ou com luz ultravioleta sobre eles, a baixa temperatura, um ano depois dos primeiros compostos de xénon. A molécula linear F-Kr-F é mantida por uma ligação de três centros e quatro eletrões. O sólido incolor decompõe-se cerca de 10% por hora à temperatura ambiente e conserva-se a −78 °C.',
          'Está entre os oxidantes mais fortes que se conhecem: leva o ouro ao estado +5, 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr. O excímero KrF* só existe excitado: numa descarga através de crípton com um pouco de flúor forma-se, vive alguns nanossegundos e desfaz-se ao emitir a 248 nm, porque o seu estado fundamental é repulsivo. Os lasers de KrF imprimiram chips das gerações de 250 a 130 nm por volta de 2000, e o laser Nike, do US Naval Research Laboratory, usa um para investigar a fusão.',
        ],
      },
      pl: {
        kid: [
          'Krypton nie ma rąk: jego zewnętrzna powłoka elektronowa jest pełna, więc prawie nigdy nie łączy się z innym atomem. Ale fluor jest najbardziej łakomym atomem ze wszystkich. W 1963 roku chemicy ochłodzili krypton i fluor głęboko poniżej zera, potraktowali je iskrami elektrycznymi albo światłem ultrafioletowym i dostali bezbarwne kryształy: difluorek kryptonu, w którym jeden krypton trzyma po jednym fluorze z każdej strony.',
          'Ten uścisk jest słaby: w temperaturze pokojowej kryształy powoli się rozpadają, a przy tym są tak gwałtowne, że atakują nawet złoto. Krypton i fluor potrafią też podać sobie ręce tylko na kilka miliardowych części sekundy: pobudzone prądem łączą się, a potem odskakują od siebie z błyskiem światła ultrafioletowego. Ten błysk daje potężny laser, którym drukowano maleńkie wzory chipów komputerowych.',
        ],
        sci: [
          'Difluorek kryptonu, KrF2, otrzymano po raz pierwszy w 1963 roku (jeden z pierwszych raportów wziął go za KrF4) przez wyładowanie elektryczne w mieszaninie kryptonu i fluoru albo przez jej naświetlanie ultrafioletem w niskiej temperaturze, rok po pierwszych związkach ksenonu. Liniową cząsteczkę F-Kr-F utrzymuje wiązanie trójcentrowe czteroelektronowe. Bezbarwne ciało stałe rozkłada się w temperaturze pokojowej o około 10% na godzinę, a w −78 °C można je przechowywać.',
          'Należy do najsilniejszych znanych utleniaczy: utlenia złoto do stopnia +5, 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr. Ekscymer KrF* istnieje tylko w stanie wzbudzonym: powstaje w wyładowaniu w kryptonie z domieszką fluoru, żyje kilka nanosekund i rozpada się, emitując światło 248 nm, bo jego stan podstawowy jest odpychający. Lasery KrF drukowały około 2000 roku chipy generacji od 250 do 130 nm, a laser Nike w US Naval Research Laboratory służy do badań nad fuzją.',
        ],
      },
      de: {
        kid: [
          'Krypton hat keine Hände: Seine äußere Elektronenschale ist voll, deshalb verbindet es sich fast nie mit einem anderen Atom. Aber Fluor ist das gierigste Atom von allen. 1963 kühlten Chemiker Krypton und Fluor weit unter null, beschossen sie mit elektrischen Funken oder ultraviolettem Licht und bekamen farblose Kristalle: Kryptondifluorid, ein Krypton, das an jeder Seite ein Fluor hält.',
          'Der Griff ist schwach: Bei Zimmertemperatur zerfallen die Kristalle langsam, und dabei sind sie so wild, dass sie sogar Gold angreifen. Krypton und Fluor können sich auch nur für ein paar milliardstel Sekunden die Hände halten: Mit Strom angeregt verbinden sie sich und springen dann mit einem Blitz aus ultraviolettem Licht wieder auseinander. Dieser Blitz ergibt einen starken Laser, mit dem die winzigen Muster von Computerchips gedruckt wurden.',
        ],
        sci: [
          'Kryptondifluorid, KrF2, wurde 1963 zum ersten Mal hergestellt (ein früher Bericht hielt es für KrF4), durch eine elektrische Entladung durch Krypton und Fluor oder durch UV-Licht darauf, bei tiefer Temperatur, ein Jahr nach den ersten Xenonverbindungen. Das lineare F-Kr-F-Molekül hält eine Drei-Zentren-vier-Elektronen-Bindung zusammen. Der farblose Feststoff zerfällt bei Zimmertemperatur um etwa 10% pro Stunde und hält sich bei −78 °C.',
          'Es gehört zu den stärksten bekannten Oxidationsmitteln: Es bringt Gold in die Oxidationsstufe +5, 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr. Das Excimer KrF* gibt es nur angeregt: In einer Entladung durch Krypton mit etwas Fluor bildet es sich, lebt einige Nanosekunden und zerfällt, während es bei 248 nm strahlt, denn sein Grundzustand ist abstoßend. KrF-Laser belichteten um das Jahr 2000 Chips der Generationen von 250 bis 130 nm, und der Nike-Laser des US Naval Research Laboratory nutzt einen für die Fusionsforschung.',
        ],
      },
    },
  },
  {
    id: 'kryptonite',
    color: '#5cf27a',
    title: {
      en: 'Is kryptonite real?',
      'pt-pt': 'A kryptonite existe mesmo?',
      pl: 'Czy kryptonit istnieje?',
      de: 'Gibt es Kryptonit wirklich?',
    },
    story: {
      en: {
        kid: [
          'In the stories, Superman comes from a planet called Krypton, and a glowing green rock from it, kryptonite, takes his powers away. Both are made up: the writers borrowed the element’s name, and kryptonite first appeared in a radio show in 1943. Real krypton is no rock: it is an invisible gas that freezes into white crystals only below −157 °C, and the little in the air you breathe is harmless.',
          'Then, in 2007, a scientist at a museum in London studied a new mineral from a valley in Serbia and got a surprise: its chemical recipe, sodium lithium boron silicate hydroxide, was almost word for word the one written on a case of kryptonite in a Superman film of 2006. The real mineral, jadarite, is white, not green, harms no one, and holds lithium for batteries.',
        ],
        sci: [
          'Superman first appeared in 1938; kryptonite was introduced in the radio serial The Adventures of Superman in June 1943 and reached the comics in 1949. Krypton is harmless at its 1.14 ppm in air, but breathed in quantity it acts on the brain as nitrogen does on deep divers: its narcotic potency is about seven times that of air, and half krypton and half air would affect you about as much as air at four times normal pressure, as at a depth of 30 m.',
          'Jadarite, LiNaSiB3O7(OH), was found by Rio Tinto geologists exploring for borates in the Jadar basin near Loznica, Serbia, and described in 2007 by Chris Stanley of the Natural History Museum, London, with Canada’s National Research Council. The case in Superman Returns (2006) was labelled “sodium lithium boron silicate hydroxide with fluorine”; jadarite has no fluorine, is a white, earthy mineral and is not radioactive. The deposit is one of Europe’s largest stores of lithium.',
        ],
      },
      'pt-pt': {
        kid: [
          'Nas histórias, o Super-Homem vem de um planeta chamado Krypton, e uma rocha verde e brilhante desse planeta, a kryptonite, tira-lhe os poderes. As duas coisas são inventadas: os autores foram buscar o nome ao elemento, e a kryptonite apareceu pela primeira vez num programa de rádio, em 1943. O crípton verdadeiro não é uma rocha: é um gás invisível que só congela em cristais brancos abaixo de −157 °C, e o pouco que há no ar que respiras não faz mal nenhum.',
          'Depois, em 2007, um cientista de um museu de Londres estudou um mineral novo de um vale da Sérvia e teve uma surpresa: a sua receita química, silicato hidróxido de sódio, lítio e boro, era quase palavra por palavra a que estava escrita numa caixa de kryptonite num filme do Super-Homem de 2006. O mineral verdadeiro, a jadarite, é branco e não verde, não faz mal a ninguém e tem lítio para baterias.',
        ],
        sci: [
          'O Super-Homem apareceu em 1938; a kryptonite surgiu na série de rádio The Adventures of Superman em junho de 1943 e chegou à banda desenhada em 1949. O crípton é inofensivo a 1,14 ppm no ar, mas respirado em quantidade atua no cérebro como o azoto nos mergulhadores em profundidade: o seu poder narcótico é cerca de sete vezes o do ar, e metade crípton e metade ar fariam tanto efeito como ar a quatro vezes a pressão normal, como a 30 m de profundidade.',
          'A jadarite, LiNaSiB3O7(OH), foi encontrada por geólogos da Rio Tinto à procura de boratos na bacia do Jadar, perto de Loznica, na Sérvia, e descrita em 2007 por Chris Stanley, do Natural History Museum de Londres, com o National Research Council do Canadá. A caixa de Superman Returns (2006) dizia «sodium lithium boron silicate hydroxide with fluorine»; a jadarite não tem flúor, é um mineral branco e terroso e não é radioativa. O jazigo é uma das maiores reservas de lítio da Europa.',
        ],
      },
      pl: {
        kid: [
          'W opowieściach Superman pochodzi z planety Krypton, a świecąca zielona skała z tej planety, kryptonit, odbiera mu moce. Jedno i drugie zmyślono: autorzy pożyczyli nazwę pierwiastka, a kryptonit pojawił się po raz pierwszy w audycji radiowej w 1943 roku. Prawdziwy krypton nie jest skałą: to niewidzialny gaz, który zamarza w białe kryształy dopiero poniżej −157 °C, a odrobina w powietrzu, którym oddychasz, jest zupełnie nieszkodliwa.',
          'A potem, w 2007 roku, naukowiec z muzeum w Londynie badał nowy minerał z pewnej doliny w Serbii i przeżył niespodziankę: jego przepis chemiczny, wodorotlenokrzemian sodu, litu i boru, był prawie słowo w słowo taki jak napis na pudełku z kryptonitem w filmie o Supermanie z 2006 roku. Prawdziwy minerał, jadaryt, jest biały, a nie zielony, nikomu nie szkodzi i zawiera lit do baterii.',
        ],
        sci: [
          'Superman pojawił się po raz pierwszy w 1938 roku; kryptonit wprowadzono w serialu radiowym The Adventures of Superman w czerwcu 1943 roku, a do komiksów trafił w 1949 roku. Krypton jest nieszkodliwy przy swoich 1,14 ppm w powietrzu, ale wdychany w dużej ilości działa na mózg tak jak azot na nurków schodzących głęboko: jego siła narkotyczna jest około siedmiu razy większa niż powietrza, a mieszanina pół na pół kryptonu i powietrza działałaby mniej więcej tak jak powietrze pod ciśnieniem cztery razy większym od normalnego, czyli na głębokości 30 m.',
          'Jadaryt, LiNaSiB3O7(OH), znaleźli geolodzy firmy Rio Tinto, szukający boranów w dolinie Jadaru koło Loznicy w Serbii, a opisał go w 2007 roku Chris Stanley z Natural History Museum w Londynie wraz z kanadyjską National Research Council. Pudełko w filmie Superman Returns (2006) miało napis „sodium lithium boron silicate hydroxide with fluorine”; jadaryt nie zawiera fluoru, jest białym, ziemistym minerałem i nie jest promieniotwórczy. Złoże należy do największych zasobów litu w Europie.',
        ],
      },
      de: {
        kid: [
          'In den Geschichten kommt Superman von einem Planeten namens Krypton, und ein grün leuchtender Stein von dort, das Kryptonit, raubt ihm seine Kräfte. Beides ist erfunden: Die Autoren liehen sich den Namen des Elements, und Kryptonit tauchte zum ersten Mal 1943 in einer Radiosendung auf. Echtes Krypton ist kein Stein: Es ist ein unsichtbares Gas, das erst unter −157 °C zu weißen Kristallen gefriert, und das bisschen in der Luft, die du atmest, ist harmlos.',
          'Dann, 2007, untersuchte ein Forscher an einem Museum in London ein neues Mineral aus einem Tal in Serbien und erlebte eine Überraschung: Sein chemisches Rezept, Natrium-Lithium-Bor-Silikat-Hydroxid, stand fast Wort für Wort auf einer Kryptonit-Kiste in einem Superman-Film von 2006. Das echte Mineral, Jadarit, ist weiß, nicht grün, schadet niemandem und enthält Lithium für Batterien.',
        ],
        sci: [
          'Superman erschien zum ersten Mal 1938; Kryptonit kam im Juni 1943 in der Radioserie The Adventures of Superman hinzu und erreichte die Comics 1949. Bei seinen 1,14 ppm in der Luft ist Krypton harmlos, aber in größerer Menge eingeatmet wirkt es auf das Gehirn wie Stickstoff auf Tieftaucher: Seine narkotische Wirkung ist etwa siebenmal so stark wie die von Luft, und halb Krypton, halb Luft wirkte etwa so wie Luft beim Vierfachen des normalen Drucks, wie in 30 m Tiefe.',
          'Jadarit, LiNaSiB3O7(OH), wurde von Geologen von Rio Tinto bei der Suche nach Boraten im Jadar-Becken bei Loznica in Serbien gefunden und 2007 von Chris Stanley vom Natural History Museum in London zusammen mit dem kanadischen National Research Council beschrieben. Die Kiste in Superman Returns (2006) trug die Aufschrift „sodium lithium boron silicate hydroxide with fluorine“; Jadarit enthält kein Fluor, ist ein weißes, erdiges Mineral und nicht radioaktiv. Die Lagerstätte gehört zu den größten Lithiumvorkommen Europas.',
        ],
      },
    },
  },
]
