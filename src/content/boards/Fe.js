// Iron's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls, each a
// question that makes you walk up, and the story it opens (Explorer and Scientist). They leave to other
// worlds what those already show: rust as slow burning (oxygen's fire wing), haemoglobin carrying oxygen
// (oxygen's breath room), the banded iron formations (oxygen's first room), the Earth cut open to its
// core (silicon's earth room), the aurora (oxygen's aurora room), stars burning to iron (the Star Forge).
// Pictures: public/boards/Fe/<id>.svg, drawn by tools/boards/Fe/ (no words in them: the title is drawn in
// the visitor's language). Each text: { en, 'pt-pt', pl, de }; a title is one string, a story
// { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'meteorite',
    color: '#9a8cff',
    title: {
      en: 'A dagger from outer space?',
      'pt-pt': 'Um punhal vindo do espaço?',
      pl: 'Sztylet z kosmosu?',
      de: 'Ein Dolch aus dem Weltall?',
    },
    story: {
      en: {
        kid: [
          'Long before people could get iron out of rocks, iron fell from the sky. Iron meteorites are pieces of the iron hearts of small planets that broke apart in space. When the young pharaoh Tutankhamun was buried, about 3300 years ago, a dagger of this sky iron, with a golden handle, was wrapped up with him.',
          'Cut an iron meteorite, polish it and dip it in a little acid, and a criss-cross pattern of crystals appears. It grew while the iron cooled very, very slowly, over millions of years, deep inside its little planet; no lab on Earth can wait that long. The biggest iron meteorite, Hoba in Namibia, weighs about 60 tonnes and still lies where it landed.',
        ],
        sci: [
          'Iron meteorites are fragments of the metal cores of asteroids that melted and separated into core and mantle, then broke up in collisions: iron alloyed with nickel, usually 5 to 12%. Tutankhamun’s iron dagger, found by Howard Carter’s team in 1925, holds about 10.8% nickel and 0.58% cobalt by X-ray fluorescence (Comelli and colleagues, 2016): it is meteoritic, like the beads from Gerzeh, over 5000 years old. Iron smelted from ore has hardly any nickel.',
          'Etched with dilute nitric acid, an octahedrite such as Gibeon shows the Widmanstätten pattern (described in 1808): plates of kamacite (about 5 to 7% Ni) grown along the octahedral planes of taenite (20% Ni and more) while the core cooled by some tens to hundreds of degrees per million years. Hoba (found in 1920, about 60 t, about 16% Ni) is an ataxite, too rich in nickel to show the pattern.',
        ],
      },
      'pt-pt': {
        kid: [
          'Muito antes de as pessoas saberem tirar ferro das rochas, o ferro caía do céu. Os meteoritos de ferro são pedaços dos corações de ferro de pequenos planetas que se desfizeram no espaço. Quando o jovem faraó Tutankhamon foi sepultado, há cerca de 3300 anos, puseram-lhe entre as faixas um punhal deste ferro do céu, com cabo de ouro.',
          'Corta um meteorito de ferro, pule-o e mergulha-o num pouco de ácido, e aparece um padrão de cristais cruzados. Cresceu enquanto o ferro arrefecia muito, muito devagar, ao longo de milhões de anos, no interior do seu pequeno planeta; nenhum laboratório da Terra consegue esperar tanto. O maior meteorito de ferro, o Hoba, na Namíbia, pesa cerca de 60 toneladas e continua onde caiu.',
        ],
        sci: [
          'Os meteoritos de ferro são fragmentos dos núcleos metálicos de asteroides que fundiram e se separaram em núcleo e manto, e depois se partiram em colisões: ferro em liga com níquel, normalmente 5 a 12%. O punhal de ferro de Tutankhamon, encontrado pela equipa de Howard Carter em 1925, tem cerca de 10,8% de níquel e 0,58% de cobalto, medidos por fluorescência de raios X (Comelli e colegas, 2016): é meteorítico, como as contas de Gerzeh, com mais de 5000 anos. O ferro obtido do minério quase não tem níquel.',
          'Atacado com ácido nítrico diluído, um octaedrito como o Gibeon mostra o padrão de Widmanstätten (descrito em 1808): placas de camacite (cerca de 5 a 7% de Ni) que cresceram ao longo dos planos octaédricos da taenite (20% de Ni ou mais) enquanto o núcleo arrefecia algumas dezenas a centenas de graus por milhão de anos. O Hoba (encontrado em 1920, cerca de 60 t, cerca de 16% de Ni) é um ataxito, demasiado rico em níquel para mostrar o padrão.',
        ],
      },
      pl: {
        kid: [
          'Dawno zanim ludzie nauczyli się wydobywać żelazo ze skał, żelazo spadało z nieba. Meteoryty żelazne to kawałki żelaznych serc małych planet, które rozpadły się w kosmosie. Kiedy chowano młodego faraona Tutanchamona, około 3300 lat temu, owinięto go razem ze sztyletem z tego niebiańskiego żelaza, ze złotą rękojeścią.',
          'Przetnij meteoryt żelazny, wypoleruj go i zanurz w odrobinie kwasu, a pojawi się wzór skrzyżowanych kryształów. Wyrósł, gdy żelazo stygło bardzo, bardzo powoli, przez miliony lat, głęboko we wnętrzu małej planety; żadne laboratorium na Ziemi nie może czekać tak długo. Największy meteoryt żelazny, Hoba w Namibii, waży około 60 ton i wciąż leży tam, gdzie spadł.',
        ],
        sci: [
          'Meteoryty żelazne to fragmenty metalicznych jąder planetoid, które się stopiły i rozdzieliły na jądro i płaszcz, a potem rozbiły w zderzeniach: żelazo stopione z niklem, zwykle 5 do 12%. Żelazny sztylet Tutanchamona, znaleziony przez zespół Howarda Cartera w 1925 roku, zawiera według fluorescencji rentgenowskiej około 10,8% niklu i 0,58% kobaltu (Comelli i współpracownicy, 2016): jest meteorytowy, jak paciorki z Gerzeh sprzed ponad 5000 lat. Żelazo wytopione z rudy prawie nie zawiera niklu.',
          'Wytrawiony rozcieńczonym kwasem azotowym oktaedryt, taki jak Gibeon, pokazuje figury Widmanstättena (opisane w 1808 roku): płytki kamacytu (około 5 do 7% Ni) wyrosłe wzdłuż płaszczyzn oktaedru w taenicie (20% Ni i więcej), gdy jądro stygło o kilkadziesiąt do kilkuset stopni na milion lat. Hoba (znaleziony w 1920 roku, około 60 t, około 16% Ni) to ataksyt, zbyt bogaty w nikiel, by pokazać ten wzór.',
        ],
      },
      de: {
        kid: [
          'Lange bevor die Menschen Eisen aus Gestein gewinnen konnten, fiel Eisen vom Himmel. Eisenmeteoriten sind Stücke der eisernen Herzen kleiner Planeten, die im Weltall zerbrochen sind. Als der junge Pharao Tutanchamun vor etwa 3300 Jahren begraben wurde, wickelte man einen Dolch aus diesem Himmelseisen, mit einem goldenen Griff, mit ihm ein.',
          'Schneide einen Eisenmeteoriten auf, poliere ihn und tauche ihn in ein wenig Säure, dann erscheint ein Muster aus gekreuzten Kristallen. Es wuchs, während das Eisen sehr, sehr langsam abkühlte, über Millionen von Jahren, tief im Inneren seines kleinen Planeten; kein Labor der Erde kann so lange warten. Der größte Eisenmeteorit, Hoba in Namibia, wiegt etwa 60 Tonnen und liegt noch dort, wo er gelandet ist.',
        ],
        sci: [
          'Eisenmeteoriten sind Bruchstücke der Metallkerne von Asteroiden, die geschmolzen waren und sich in Kern und Mantel getrennt hatten, bevor sie bei Zusammenstößen zerbrachen: Eisen, legiert mit Nickel, meist 5 bis 12%. Tutanchamuns Eisendolch, 1925 von Howard Carters Team gefunden, enthält laut Röntgenfluoreszenz etwa 10,8% Nickel und 0,58% Cobalt (Comelli und Kollegen, 2016): Er ist meteoritisch, wie die über 5000 Jahre alten Perlen aus Gerzeh. Aus Erz verhüttetes Eisen enthält kaum Nickel.',
          'Mit verdünnter Salpetersäure geätzt, zeigt ein Oktaedrit wie Gibeon die Widmanstätten-Figuren (1808 beschrieben): Platten aus Kamacit (etwa 5 bis 7% Ni), gewachsen entlang der Oktaederebenen des Taenits (20% Ni und mehr), während der Kern um einige zehn bis hundert Grad pro Million Jahre abkühlte. Hoba (1920 gefunden, etwa 60 t, etwa 16% Ni) ist ein Ataxit, zu nickelreich, um das Muster zu zeigen.',
        ],
      },
    },
  },
  {
    id: 'compass',
    color: '#3fd6c6',
    title: {
      en: 'Why does a compass point north?',
      'pt-pt': 'Porque aponta a bússola para norte?',
      pl: 'Dlaczego kompas wskazuje północ?',
      de: 'Warum zeigt der Kompass nach Norden?',
    },
    story: {
      en: {
        kid: [
          'A compass needle is a tiny magnet, and the whole Earth is a giant one. About 2900 km under your feet lies the outer core, an ocean of liquid iron thousands of degrees hot. As the Earth spins, the liquid iron swirls, and moving metal makes electric currents; the currents make the magnetism that turns every compass needle.',
          'Sailors in China were already steering by compass more than 900 years ago. But the magnetic north pole wanders: it is moving from Canada towards Siberia, tens of kilometres a year. And every so often the whole field flips over, so a compass would point south! The last flip was about 780,000 years ago.',
        ],
        sci: [
          'The outer core, from about 2890 to 5150 km deep, is a liquid iron-nickel alloy with some lighter elements. Heat leaving the core, and the solid inner core slowly growing, drive convection; the Earth’s rotation twists the flow into columns, and the moving conductor keeps the field going as a self-sustaining dynamo, the geodynamo. At the surface the field is about 25 to 65 µT.',
          'Shen Kuo described the magnetic needle and its declination in 1088; William Gilbert’s De Magnete (1600) showed, with a lodestone ball, his terrella, that the Earth itself is a great magnet. Lava cooling at mid-ocean ridges locks the field’s direction into its magnetite grains, so the sea floor carries stripes of normal and reversed polarity (Vine and Matthews, 1963); the last reversal, the Brunhes-Matuyama, was about 780,000 years ago. The north magnetic pole sped up to 50 to 60 km a year around 2000 and has slowed since.',
        ],
      },
      'pt-pt': {
        kid: [
          'A agulha de uma bússola é um pequeno íman, e a Terra inteira é um íman gigante. Cerca de 2900 km debaixo dos teus pés fica o núcleo externo, um oceano de ferro líquido a milhares de graus. Como a Terra gira, o ferro líquido rodopia, e metal em movimento faz correntes elétricas; são essas correntes que fazem o magnetismo que roda as agulhas de todas as bússolas.',
          'Na China, os marinheiros já se guiavam pela bússola há mais de 900 anos. Mas o polo norte magnético anda a passear: está a mudar-se do Canadá para a Sibéria, dezenas de quilómetros por ano. E, de vez em quando, o campo inteiro vira-se ao contrário, e a bússola apontaria para sul! A última vez foi há cerca de 780 mil anos.',
        ],
        sci: [
          'O núcleo externo, entre cerca de 2890 e 5150 km de profundidade, é uma liga líquida de ferro e níquel com alguns elementos mais leves. O calor que sai do núcleo e o lento crescimento do núcleo interno sólido alimentam a convecção; a rotação da Terra torce o escoamento em colunas, e o condutor em movimento mantém o campo como um dínamo autossustentado, o geodínamo. À superfície, o campo tem cerca de 25 a 65 µT.',
          'Shen Kuo descreveu a agulha magnética e a sua declinação em 1088; o De Magnete de William Gilbert (1600) mostrou, com uma bola de pedra-íman, a sua terrella, que a própria Terra é um grande íman. A lava que arrefece nas dorsais oceânicas fixa a direção do campo nos seus grãos de magnetite, por isso o fundo do mar tem faixas de polaridade normal e invertida (Vine e Matthews, 1963); a última inversão, a de Brunhes-Matuyama, foi há cerca de 780 mil anos. O polo norte magnético acelerou para 50 a 60 km por ano por volta de 2000 e desde então abrandou.',
        ],
      },
      pl: {
        kid: [
          'Igła kompasu to malutki magnes, a cała Ziemia to magnes olbrzymi. Około 2900 km pod twoimi stopami leży jądro zewnętrzne, ocean ciekłego żelaza o temperaturze tysięcy stopni. Ziemia się obraca, ciekłe żelazo wiruje, a poruszający się metal wytwarza prądy elektryczne; to one tworzą magnetyzm, który obraca igłę każdego kompasu.',
          'Żeglarze w Chinach kierowali się kompasem już ponad 900 lat temu. Ale północny biegun magnetyczny wędruje: przesuwa się z Kanady w stronę Syberii, o dziesiątki kilometrów rocznie. A co jakiś czas całe pole się odwraca i kompas wskazywałby południe! Ostatnio stało się to około 780 tysięcy lat temu.',
        ],
        sci: [
          'Jądro zewnętrzne, na głębokości od około 2890 do 5150 km, to ciekły stop żelaza i niklu z domieszką lżejszych pierwiastków. Ciepło uciekające z jądra i powolny wzrost stałego jądra wewnętrznego napędzają konwekcję; obrót Ziemi skręca przepływ w kolumny, a poruszający się przewodnik podtrzymuje pole jako samowzbudne dynamo, geodynamo. Na powierzchni pole ma około 25 do 65 µT.',
          'Shen Kuo opisał igłę magnetyczną i jej deklinację w 1088 roku; William Gilbert w De Magnete (1600) pokazał na kuli z kamienia magnetycznego, swojej terelli, że sama Ziemia jest wielkim magnesem. Lawa stygnąca w grzbietach śródoceanicznych utrwala kierunek pola w ziarnach magnetytu, więc dno morza nosi pasy o normalnej i odwróconej biegunowości (Vine i Matthews, 1963); ostatnie odwrócenie, Brunhes-Matuyama, nastąpiło około 780 tysięcy lat temu. Północny biegun magnetyczny przyspieszył około 2000 roku do 50 do 60 km rocznie, a potem zwolnił.',
        ],
      },
      de: {
        kid: [
          'Eine Kompassnadel ist ein winziger Magnet, und die ganze Erde ist ein riesiger. Etwa 2900 km unter deinen Füßen liegt der äußere Kern, ein Ozean aus flüssigem Eisen, Tausende Grad heiß. Weil sich die Erde dreht, wirbelt das flüssige Eisen, und bewegtes Metall erzeugt elektrische Ströme; diese Ströme machen den Magnetismus, der jede Kompassnadel dreht.',
          'Seeleute in China steuerten schon vor mehr als 900 Jahren mit dem Kompass. Aber der magnetische Nordpol wandert: Er zieht von Kanada in Richtung Sibirien, Dutzende Kilometer im Jahr. Und hin und wieder dreht sich das ganze Feld um, dann würde ein Kompass nach Süden zeigen! Das letzte Mal geschah das vor etwa 780.000 Jahren.',
        ],
        sci: [
          'Der äußere Kern, in etwa 2890 bis 5150 km Tiefe, ist eine flüssige Eisen-Nickel-Legierung mit einigen leichteren Elementen. Die Wärme, die den Kern verlässt, und das langsame Wachsen des festen inneren Kerns treiben Konvektion an; die Erddrehung verdrillt die Strömung zu Säulen, und der bewegte Leiter erhält das Feld als selbsterregter Dynamo, der Geodynamo. An der Oberfläche beträgt das Feld etwa 25 bis 65 µT.',
          'Shen Kuo beschrieb 1088 die Magnetnadel und ihre Missweisung; William Gilberts De Magnete (1600) zeigte mit einer Kugel aus Magneteisenstein, seiner Terrella, dass die Erde selbst ein großer Magnet ist. Lava, die an den mittelozeanischen Rücken erkaltet, hält die Richtung des Feldes in ihren Magnetitkörnern fest, deshalb trägt der Meeresboden Streifen normaler und umgekehrter Polarität (Vine und Matthews, 1963); die letzte Umpolung, die Brunhes-Matuyama-Umkehr, war vor etwa 780.000 Jahren. Der magnetische Nordpol beschleunigte um das Jahr 2000 auf 50 bis 60 km pro Jahr und ist seitdem langsamer geworden.',
        ],
      },
    },
  },
  {
    id: 'smith',
    color: '#ff5a4e',
    title: {
      en: 'How did people get iron from rock?',
      'pt-pt': 'Como se tirava ferro das pedras?',
      pl: 'Jak wydobywano żelazo ze skał?',
      de: 'Wie holte man Eisen aus Stein?',
    },
    story: {
      en: {
        kid: [
          'About 3200 years ago people learned to get iron out of reddish rocks, iron ore. They built a clay furnace, filled it with charcoal and crushed ore, and pumped air in with bellows for hours. It grew hotter than 1200 °C, still not hot enough to melt iron, and at the bottom grew a glowing, spongy lump of iron full of glassy waste: a bloom.',
          'The smith hammered the hot bloom again and again to squeeze the waste out. Iron kept long in hot charcoal soaks up a little carbon and becomes steel, and red-hot steel plunged into water turns very hard. Iron ore is found almost everywhere, unlike the tin needed for bronze, so iron tools spread far and wide: the Iron Age.',
        ],
        sci: [
          'A bloomery reduces the ore without melting the metal: charcoal burns to carbon monoxide, which strips the oxygen from hematite or goethite step by step (Fe2O3 → Fe3O4 → FeO → Fe) at about 1100 to 1300 °C, well below iron’s melting point of 1538 °C. Silica and some iron oxide form a runny fayalite slag (Fe2SiO4) that drains away; the bloom, porous iron with slag trapped in it, is hammered hot into wrought iron.',
          'Iron smelting spread through Anatolia and the Near East in the 2nd millennium BC, and the Iron Age began around 1200 BC. Carburising a blade in charcoal, then quenching it from above about 800 °C, traps carbon in hard martensite; smiths today check with a magnet, since hot steel stops being attracted near 770 °C, iron’s Curie point. Cast iron, from furnaces hot enough to melt iron with about 4% carbon, was made in China by the 5th century BC; blast furnaces reached Europe in the Middle Ages.',
        ],
      },
      'pt-pt': {
        kid: [
          'Há cerca de 3200 anos, as pessoas aprenderam a tirar ferro de pedras avermelhadas, o minério de ferro. Construíam um forno de barro, enchiam-no de carvão de lenha e minério esmagado e sopravam-lhe ar com foles durante horas. Ficava a mais de 1200 °C, mas nem assim chegava para derreter o ferro, e no fundo crescia um bloco esponjoso de ferro em brasa, cheio de restos vidrados: a lupa.',
          'O ferreiro martelava a lupa quente vezes sem conta para espremer os restos. O ferro que fica muito tempo no carvão em brasa absorve um pouco de carbono e torna-se aço, e o aço em brasa mergulhado em água fica duríssimo. Há minério de ferro em quase todo o lado, ao contrário do estanho de que o bronze precisa, por isso as ferramentas de ferro espalharam-se por toda a parte: a Idade do Ferro.',
        ],
        sci: [
          'Um forno de redução direta reduz o minério sem fundir o metal: o carvão arde e dá monóxido de carbono, que tira o oxigénio à hematite ou à goethite passo a passo (Fe2O3 → Fe3O4 → FeO → Fe) a cerca de 1100 a 1300 °C, bem abaixo do ponto de fusão do ferro, 1538 °C. A sílica e algum óxido de ferro formam uma escória fluida de faialite (Fe2SiO4) que escorre; a lupa, ferro poroso com escória presa, é martelada a quente até dar ferro forjado.',
          'A redução do ferro espalhou-se pela Anatólia e pelo Próximo Oriente no 2.º milénio a.C., e a Idade do Ferro começou por volta de 1200 a.C. Cementar uma lâmina em carvão e depois temperá-la a partir de mais de cerca de 800 °C prende o carbono na martensite, dura; os ferreiros de hoje confirmam com um íman, porque o aço quente deixa de ser atraído perto dos 770 °C, a temperatura de Curie do ferro. O ferro fundido, de fornos tão quentes que derretem ferro com cerca de 4% de carbono, já se fazia na China no século V a.C.; os altos-fornos chegaram à Europa na Idade Média.',
        ],
      },
      pl: {
        kid: [
          'Około 3200 lat temu ludzie nauczyli się wydobywać żelazo z czerwonawych skał, rudy żelaza. Budowali gliniany piec, napełniali go węglem drzewnym i pokruszoną rudą i godzinami wdmuchiwali powietrze miechami. Robiło się goręcej niż 1200 °C, ale wciąż za mało, żeby stopić żelazo, a na dnie rosła żarząca się, gąbczasta bryła żelaza pełna szklistych odpadów: łupka.',
          'Kowal kuł gorącą łupkę raz za razem, żeby wycisnąć z niej odpady. Żelazo trzymane długo w rozżarzonym węglu drzewnym wchłania odrobinę węgla i staje się stalą, a rozżarzona stal wrzucona do wody robi się bardzo twarda. Rudę żelaza można znaleźć prawie wszędzie, w przeciwieństwie do cyny potrzebnej do brązu, więc żelazne narzędzia rozeszły się daleko i szeroko: tak zaczęła się epoka żelaza.',
        ],
        sci: [
          'Dymarka redukuje rudę, nie topiąc metalu: węgiel drzewny spala się do tlenku węgla, który krok po kroku odbiera tlen hematytowi lub getytowi (Fe2O3 → Fe3O4 → FeO → Fe) w około 1100 do 1300 °C, znacznie poniżej temperatury topnienia żelaza, 1538 °C. Krzemionka i część tlenku żelaza tworzą płynny żużel fajalitowy (Fe2SiO4), który spływa; łupkę, porowate żelazo z uwięzionym żużlem, kuje się na gorąco w żelazo zgrzewne.',
          'Wytop żelaza rozpowszechnił się w Anatolii i na Bliskim Wschodzie w II tysiącleciu p.n.e., a epoka żelaza zaczęła się około 1200 roku p.n.e. Nawęglanie ostrza w węglu drzewnym i hartowanie go od temperatury powyżej około 800 °C zamyka węgiel w twardym martenzycie; dzisiejsi kowale sprawdzają to magnesem, bo gorąca stal przestaje być przyciągana w pobliżu 770 °C, temperatury Curie żelaza. Żeliwo, z pieców tak gorących, że topią żelazo z około 4% węgla, wytwarzano w Chinach już w V wieku p.n.e.; wielkie piece dotarły do Europy w średniowieczu.',
        ],
      },
      de: {
        kid: [
          'Vor etwa 3200 Jahren lernten die Menschen, Eisen aus rötlichen Steinen zu holen, aus Eisenerz. Sie bauten einen Ofen aus Lehm, füllten ihn mit Holzkohle und zerkleinertem Erz und bliesen stundenlang mit Blasebälgen Luft hinein. Es wurde heißer als 1200 °C, aber immer noch nicht heiß genug, um Eisen zu schmelzen, und unten wuchs ein glühender, schwammiger Klumpen Eisen voller glasiger Abfälle: eine Luppe.',
          'Der Schmied hämmerte die heiße Luppe immer wieder, um die Abfälle herauszuquetschen. Eisen, das lange in glühender Holzkohle liegt, nimmt ein wenig Kohlenstoff auf und wird zu Stahl, und rotglühender Stahl, in Wasser getaucht, wird sehr hart. Eisenerz gibt es fast überall, anders als das Zinn, das man für Bronze braucht, deshalb verbreiteten sich Werkzeuge aus Eisen weit und breit: die Eisenzeit.',
        ],
        sci: [
          'Ein Rennofen reduziert das Erz, ohne das Metall zu schmelzen: Holzkohle verbrennt zu Kohlenmonoxid, das dem Hämatit oder Goethit Schritt für Schritt den Sauerstoff entzieht (Fe2O3 → Fe3O4 → FeO → Fe), bei etwa 1100 bis 1300 °C, weit unter dem Schmelzpunkt des Eisens von 1538 °C. Kieselsäure und etwas Eisenoxid bilden eine dünnflüssige Fayalitschlacke (Fe2SiO4), die abfließt; die Luppe, poröses Eisen mit eingeschlossener Schlacke, wird heiß zu Schmiedeeisen ausgeschmiedet.',
          'Die Eisenverhüttung verbreitete sich im 2. Jahrtausend v. Chr. in Anatolien und im Nahen Osten, und die Eisenzeit begann um 1200 v. Chr. Eine Klinge in Holzkohle aufkohlen und dann von über etwa 800 °C abschrecken: Das hält den Kohlenstoff im harten Martensit fest; heutige Schmiede prüfen es mit einem Magneten, denn heißer Stahl wird nahe 770 °C, dem Curie-Punkt des Eisens, nicht mehr angezogen. Gusseisen, aus Öfen, die heiß genug sind, um Eisen mit etwa 4% Kohlenstoff zu schmelzen, machte man in China schon im 5. Jahrhundert v. Chr.; Hochöfen kamen im Mittelalter nach Europa.',
        ],
      },
    },
  },
  {
    id: 'cereal',
    color: '#8bd65a',
    title: {
      en: 'Can a magnet pull iron from cereal?',
      'pt-pt': 'Um íman tira ferro dos cereais?',
      pl: 'Magnes wyciągnie żelazo z płatków?',
      de: 'Holt ein Magnet Eisen aus Cornflakes?',
    },
    story: {
      en: {
        kid: [
          'Many breakfast cereals have real iron added to them: a fine powder of iron metal. Crush some flakes in water, stir slowly with a strong magnet, and tiny black specks gather on it. In your stomach, acid dissolves them, and your body takes the iron in.',
          'You need iron to make your red blood. A grown-up’s whole body holds only about 4 grams, about as much as one nail, and it uses it again and again. Meat, lentils, beans, eggs and green vegetables have iron too, and a glass of orange juice helps you take in the iron from plants.',
        ],
        sci: [
          'Fortified cereals and flours often carry elemental iron powder (reduced, electrolytic or carbonyl iron), which a magnet pulls out; others use salts such as ferrous sulfate or fumarate. Stomach acid dissolves the metal: Fe + 2 H+ → Fe2+ + H2. Children of 9 to 13 need about 8 mg of iron a day (the US recommendation); men 8 mg, women 18 mg before menopause.',
          'The gut takes in only 1 to 2 mg a day, as Fe2+, through the lining of the duodenum; haem iron from meat is absorbed far better than plant iron, vitamin C helps (it keeps the iron as soluble Fe2+), while tea, the phytates in bran and calcium hold it back. Macrophages recycle about 20 to 25 mg a day from worn-out red cells, and the hormone hepcidin sets how much is let in. Iron deficiency is the most common nutritional disorder in the world.',
        ],
      },
      'pt-pt': {
        kid: [
          'Muitos cereais de pequeno-almoço têm ferro a sério acrescentado: um pó fininho de ferro metálico. Esmaga uns flocos em água, mexe devagar com um íman forte, e juntam-se nele uns pontinhos pretos. No estômago, o ácido dissolve-os e o teu corpo absorve o ferro.',
          'Precisas de ferro para fazer o teu sangue vermelho. O corpo inteiro de um adulto tem só cerca de 4 gramas, mais ou menos o que há num prego, e usa-o vezes sem conta. A carne, as lentilhas, o feijão, os ovos e os legumes verdes também têm ferro, e um copo de sumo de laranja ajuda-te a absorver o ferro das plantas.',
        ],
        sci: [
          'Os cereais e as farinhas fortificados levam muitas vezes ferro elementar em pó (ferro reduzido, eletrolítico ou carbonilo), que um íman consegue tirar; outros usam sais como o sulfato ou o fumarato ferroso. O ácido do estômago dissolve o metal: Fe + 2 H+ → Fe2+ + H2. As crianças dos 9 aos 13 anos precisam de cerca de 8 mg de ferro por dia (recomendação dos EUA); os homens 8 mg, as mulheres 18 mg antes da menopausa.',
          'O intestino absorve só 1 a 2 mg por dia, como Fe2+, através da parede do duodeno; o ferro heme da carne é muito mais bem absorvido do que o ferro das plantas, a vitamina C ajuda (mantém o ferro como Fe2+ solúvel), e o chá, os fitatos do farelo e o cálcio travam-no. Os macrófagos reciclam cerca de 20 a 25 mg por dia dos glóbulos vermelhos gastos, e a hormona hepcidina decide quanto entra. A falta de ferro é a carência nutricional mais comum do mundo.',
        ],
      },
      pl: {
        kid: [
          'Do wielu płatków śniadaniowych dodaje się prawdziwe żelazo: drobny proszek z metalicznego żelaza. Rozgnieć trochę płatków w wodzie, powoli mieszaj silnym magnesem, a zbiorą się na nim malutkie czarne drobinki. W żołądku kwas je rozpuszcza, a twoje ciało wchłania żelazo.',
          'Żelazo jest ci potrzebne, żeby robić czerwoną krew. Całe ciało dorosłego ma go tylko około 4 gramów, mniej więcej tyle, ile jest w jednym gwoździu, i używa go wciąż od nowa. Mięso, soczewica, fasola, jajka i zielone warzywa też mają żelazo, a szklanka soku pomarańczowego pomaga wchłonąć żelazo z roślin.',
        ],
        sci: [
          'Wzbogacane płatki i mąki często zawierają proszek żelaza pierwiastkowego (żelazo redukowane, elektrolityczne lub karbonylkowe), które magnes potrafi wyciągnąć; inne mają sole, na przykład siarczan lub fumaran żelaza(II). Kwas żołądkowy rozpuszcza metal: Fe + 2 H+ → Fe2+ + H2. Dzieci w wieku od 9 do 13 lat potrzebują około 8 mg żelaza dziennie (zalecenie amerykańskie); mężczyźni 8 mg, kobiety przed menopauzą 18 mg.',
          'Jelito wchłania tylko 1 do 2 mg dziennie, jako Fe2+, przez ścianę dwunastnicy; żelazo hemowe z mięsa wchłania się dużo lepiej niż żelazo z roślin, witamina C pomaga (utrzymuje żelazo jako rozpuszczalne Fe2+), a herbata, fityniany z otrębów i wapń je hamują. Makrofagi odzyskują około 20 do 25 mg dziennie ze zużytych czerwonych krwinek, a hormon hepcydyna decyduje, ile go wpuścić. Niedobór żelaza to najczęstsze zaburzenie odżywiania na świecie.',
        ],
      },
      de: {
        kid: [
          'Vielen Frühstücksflocken wird echtes Eisen zugesetzt: ein feines Pulver aus metallischem Eisen. Zerdrück ein paar Flocken in Wasser, rühr langsam mit einem starken Magneten, und winzige schwarze Krümel sammeln sich daran. In deinem Magen löst die Säure sie auf, und dein Körper nimmt das Eisen auf.',
          'Du brauchst Eisen, um dein rotes Blut zu machen. Der ganze Körper eines Erwachsenen enthält nur etwa 4 Gramm, ungefähr so viel wie ein Nagel, und benutzt es immer wieder. Fleisch, Linsen, Bohnen, Eier und grünes Gemüse enthalten auch Eisen, und ein Glas Orangensaft hilft dir, das Eisen aus Pflanzen aufzunehmen.',
        ],
        sci: [
          'Angereicherte Flocken und Mehle enthalten oft elementares Eisenpulver (reduziertes, elektrolytisches oder Carbonyleisen), das ein Magnet herausziehen kann; andere enthalten Salze wie Eisen(II)-sulfat oder -fumarat. Die Magensäure löst das Metall: Fe + 2 H+ → Fe2+ + H2. Kinder von 9 bis 13 Jahren brauchen etwa 8 mg Eisen am Tag (US-Empfehlung); Männer 8 mg, Frauen vor den Wechseljahren 18 mg.',
          'Der Darm nimmt nur 1 bis 2 mg am Tag auf, als Fe2+, durch die Wand des Zwölffingerdarms; Häm-Eisen aus Fleisch wird viel besser aufgenommen als Eisen aus Pflanzen, Vitamin C hilft (es hält das Eisen als lösliches Fe2+), während Tee, die Phytate der Kleie und Calcium es bremsen. Makrophagen holen etwa 20 bis 25 mg am Tag aus verbrauchten roten Blutkörperchen zurück, und das Hormon Hepcidin bestimmt, wie viel hereinkommt. Eisenmangel ist die häufigste Mangelernährung der Welt.',
        ],
      },
    },
  },
  {
    id: 'tower',
    color: '#ffc83d',
    title: {
      en: 'How do you build a tower of iron?',
      'pt-pt': 'Como se constrói uma torre de ferro?',
      pl: 'Jak zbudować wieżę z żelaza?',
      de: 'Wie baut man einen Turm aus Eisen?',
    },
    story: {
      en: {
        kid: [
          'The Eiffel Tower in Paris was built in just over two years, for the World’s Fair of 1889: 18,038 iron pieces joined by about 2.5 million rivets. Each rivet was heated red-hot and hammered flat; as it cooled it shrank and pulled the pieces tightly together.',
          'Iron stretches a little when it warms. On a sunny day the side facing the sun stretches more than the shady side, so the top of the tower leans gently away from the sun and, over the day, traces a loop about 15 cm across. To keep rust away, the whole tower is repainted by hand about every seven years, with about 60 tonnes of paint.',
        ],
        sci: [
          'Gustave Eiffel’s company built it from January 1887 to March 1889, to a design by the engineers Maurice Koechlin and Émile Nouguier with the architect Stephen Sauvestre: about 7300 tonnes of puddled iron, a wrought iron very low in carbon, from the Pompey works in Lorraine; 312 m tall in 1889, 330 m with today’s antennas. Hot rivets contract as they cool and clamp the plates together; the open lattice keeps the weight down and lets the wind through.',
          'Iron expands by about 12 µm per metre for each degree, so 300 m of it lengthens by about 3.6 mm per degree warmer. Sunlight warms one face more than the others, so the tower bends away from the Sun, its top tracing a loop about 15 cm across on a clear day. The paint, about 60 t every 7 years or so, is shaded from darkest at the bottom to lightest at the top, so the tower looks evenly coloured against the sky: "Eiffel Tower brown" from 1968 to 2019, the yellow-brown of 1907 again since.',
        ],
      },
      'pt-pt': {
        kid: [
          'A Torre Eiffel, em Paris, foi construída em pouco mais de dois anos, para a Exposição Universal de 1889: 18 038 peças de ferro unidas por cerca de 2,5 milhões de rebites. Cada rebite era aquecido até ficar em brasa e martelado; ao arrefecer encolhia e apertava bem as peças umas contra as outras.',
          'O ferro estica um bocadinho quando aquece. Num dia de sol, o lado virado para o Sol estica mais do que o lado à sombra, por isso o topo da torre inclina-se devagarinho para longe do Sol e, ao longo do dia, desenha uma volta com cerca de 15 cm. Para afastar a ferrugem, a torre inteira é pintada à mão mais ou menos de sete em sete anos, com cerca de 60 toneladas de tinta.',
        ],
        sci: [
          'A empresa de Gustave Eiffel construiu-a de janeiro de 1887 a março de 1889, segundo um projeto dos engenheiros Maurice Koechlin e Émile Nouguier e do arquiteto Stephen Sauvestre: cerca de 7300 toneladas de ferro pudelado, um ferro forjado com muito pouco carbono, das forjas de Pompey, na Lorena; 312 m de altura em 1889, 330 m com as antenas de hoje. Os rebites quentes contraem ao arrefecer e apertam as chapas umas contra as outras; a treliça aberta mantém o peso baixo e deixa passar o vento.',
          'O ferro dilata cerca de 12 µm por metro por cada grau, por isso 300 m de ferro alongam-se cerca de 3,6 mm por cada grau a mais. A luz do Sol aquece uma face mais do que as outras, e a torre curva-se para longe do Sol, com o topo a desenhar uma volta de cerca de 15 cm num dia limpo. A tinta, cerca de 60 t mais ou menos de sete em sete anos, vai do tom mais escuro em baixo ao mais claro no topo, para que a torre pareça de uma só cor contra o céu: "castanho Torre Eiffel" de 1968 a 2019, e desde então de novo o castanho-amarelado de 1907.',
        ],
      },
      pl: {
        kid: [
          'Wieżę Eiffla w Paryżu zbudowano w nieco ponad dwa lata, na wystawę światową w 1889 roku: 18 038 żelaznych części połączonych za pomocą około 2,5 miliona nitów. Każdy nit rozgrzewano do czerwoności i rozklepywano młotkiem; stygnąc, kurczył się i mocno ściągał części ze sobą.',
          'Żelazo odrobinę się wydłuża, gdy się nagrzewa. W słoneczny dzień strona zwrócona do słońca wydłuża się bardziej niż strona w cieniu, więc szczyt wieży lekko odchyla się od słońca i w ciągu dnia zatacza pętlę o średnicy około 15 cm. Żeby nie dopuścić rdzy, całą wieżę maluje się ręcznie mniej więcej co siedem lat, zużywając około 60 ton farby.',
        ],
        sci: [
          'Firma Gustave’a Eiffla budowała ją od stycznia 1887 do marca 1889 roku według projektu inżynierów Maurice’a Koechlina i Émile’a Nouguiera oraz architekta Stephena Sauvestre’a: około 7300 ton żelaza pudlarskiego, czyli żelaza zgrzewnego o bardzo małej zawartości węgla, z zakładów w Pompey w Lotaryngii; w 1889 roku miała 312 m wysokości, dziś z antenami 330 m. Gorące nity kurczą się, stygnąc, i zaciskają blachy; ażurowa kratownica utrzymuje mały ciężar i przepuszcza wiatr.',
          'Żelazo wydłuża się o około 12 µm na metr na każdy stopień, więc 300 m żelaza wydłuża się o około 3,6 mm na każdy stopień cieplej. Słońce nagrzewa jedną ścianę bardziej niż pozostałe, więc wieża wygina się od słońca, a jej szczyt w pogodny dzień zatacza pętlę o średnicy około 15 cm. Farba, około 60 t mniej więcej co 7 lat, przechodzi od najciemniejszego odcienia na dole do najjaśniejszego na górze, żeby wieża na tle nieba wyglądała na jednolicie pomalowaną: „brąz wieży Eiffla” od 1968 do 2019 roku, a od tamtej pory znów żółtobrązowy kolor z 1907 roku.',
        ],
      },
      de: {
        kid: [
          'Der Eiffelturm in Paris wurde in gut zwei Jahren gebaut, für die Weltausstellung von 1889: 18.038 Eisenteile, verbunden durch etwa 2,5 Millionen Nieten. Jede Niete wurde rotglühend gemacht und flach gehämmert; beim Abkühlen schrumpfte sie und zog die Teile fest zusammen.',
          'Eisen dehnt sich ein wenig aus, wenn es warm wird. An einem sonnigen Tag dehnt sich die Seite, die zur Sonne zeigt, mehr als die Schattenseite, deshalb neigt sich die Spitze des Turms sanft von der Sonne weg und zeichnet im Lauf des Tages eine Schleife von etwa 15 cm. Gegen Rost wird der ganze Turm etwa alle sieben Jahre von Hand neu gestrichen, mit etwa 60 Tonnen Farbe.',
        ],
        sci: [
          'Gustave Eiffels Firma baute ihn von Januar 1887 bis März 1889 nach einem Entwurf der Ingenieure Maurice Koechlin und Émile Nouguier und des Architekten Stephen Sauvestre: etwa 7300 Tonnen Puddeleisen, ein Schmiedeeisen mit sehr wenig Kohlenstoff, aus den Werken von Pompey in Lothringen; 1889 war er 312 m hoch, mit den heutigen Antennen 330 m. Heiße Nieten ziehen sich beim Abkühlen zusammen und pressen die Bleche aneinander; das offene Fachwerk hält das Gewicht klein und lässt den Wind hindurch.',
          'Eisen dehnt sich um etwa 12 µm pro Meter und Grad aus, also werden 300 m Eisen pro Grad Erwärmung um etwa 3,6 mm länger. Das Sonnenlicht erwärmt eine Seite stärker als die anderen, so biegt sich der Turm von der Sonne weg, und seine Spitze zeichnet an einem klaren Tag eine Schleife von etwa 15 cm. Die Farbe, etwa 60 t ungefähr alle 7 Jahre, geht von unten am dunkelsten bis oben am hellsten, damit der Turm vor dem Himmel gleichmäßig gefärbt wirkt: von 1968 bis 2019 „Eiffelturm-Braun“, seitdem wieder das Gelbbraun von 1907.',
        ],
      },
    },
  },
  {
    id: 'mars',
    color: '#ff7a45',
    title: {
      en: 'Why is Mars red?',
      'pt-pt': 'Porque é que Marte é vermelho?',
      pl: 'Dlaczego Mars jest czerwony?',
      de: 'Warum ist der Mars rot?',
    },
    story: {
      en: {
        kid: [
          'Mars is red because it is rusty! Its dust, and the outside of its rocks, hold iron that joined with oxygen long ago, the same red-brown as rust on an old bike. The wind spreads the fine red dust all over the planet, but scrape a rock and inside it is dark grey.',
          'In 2004 the rover Opportunity found little round pebbles of an iron mineral, hematite, which the scientists nicknamed blueberries. On Earth, pebbles like these form in water, so Mars was once wet. And on Mars the daytime sky is a pale butterscotch colour, while the sunsets are blue!',
        ],
        sci: [
          'The colour comes mostly from fine ferric (Fe3+) oxides in the dust, coating darker basalt rich in iron(II) minerals such as olivine and pyroxene; Mars’s mantle holds about twice as much iron oxide as Earth’s. A study in 2025 suggests much of the dust is ferrihydrite, an iron oxide that forms with cool water, so the rusting may date from a wetter time.',
          'Opportunity landed at Meridiani Planum in January 2004, a site chosen because an orbiter had seen grey hematite there. It found hematite spherules a few millimetres across weathering out of sandstone, and jarosite, which forms only with acidic water; its Mössbauer spectrometer told the iron minerals apart through the nuclei of iron-57. The sunsets are blue because the dust grains scatter blue light forwards, close to the direction of the Sun (Curiosity filmed one in 2015).',
        ],
      },
      'pt-pt': {
        kid: [
          'Marte é vermelho porque está enferrujado! A sua poeira, e a parte de fora das suas rochas, têm ferro que se juntou ao oxigénio há muito tempo, com o mesmo castanho-avermelhado da ferrugem de uma bicicleta velha. O vento espalha a poeira vermelha e fina por todo o planeta, mas raspa uma rocha e por dentro é cinzenta-escura.',
          'Em 2004, o robô Opportunity encontrou pedrinhas redondas de um mineral de ferro, a hematite, a que os cientistas chamaram mirtilos. Na Terra, pedrinhas assim formam-se na água, por isso Marte já foi molhado. E em Marte o céu de dia é cor de caramelo claro, enquanto o pôr do sol é azul!',
        ],
        sci: [
          'A cor vem sobretudo de óxidos férricos (Fe3+) finos na poeira, a cobrir um basalto mais escuro, rico em minerais de ferro(II) como a olivina e a piroxena; o manto de Marte tem cerca do dobro do óxido de ferro do manto da Terra. Um estudo de 2025 sugere que grande parte da poeira é ferridrite, um óxido de ferro que se forma com água fria, por isso a ferrugem pode vir de um tempo mais húmido.',
          'O Opportunity aterrou em Meridiani Planum em janeiro de 2004, um local escolhido porque uma sonda em órbita tinha visto lá hematite cinzenta. Encontrou esférulas de hematite com alguns milímetros a soltarem-se do arenito, e jarosite, que só se forma com água ácida; o seu espetrómetro de Mössbauer distinguiu os minerais de ferro através dos núcleos de ferro-57. O pôr do sol é azul porque os grãos de poeira espalham a luz azul para a frente, perto da direção do Sol (o Curiosity filmou um em 2015).',
        ],
      },
      pl: {
        kid: [
          'Mars jest czerwony, bo jest zardzewiały! Jego pył i wierzch jego skał zawierają żelazo, które dawno temu połączyło się z tlenem, rudobrązowe jak rdza na starym rowerze. Wiatr roznosi drobny czerwony pył po całej planecie, ale zeskrob skałę, a w środku okaże się ciemnoszara.',
          'W 2004 roku łazik Opportunity znalazł małe okrągłe kamyki z minerału żelaza, hematytu, które naukowcy nazwali jagodami. Na Ziemi takie kamyki powstają w wodzie, więc na Marsie kiedyś była woda. A na Marsie niebo w dzień ma kolor jasnego karmelu, za to zachody słońca są niebieskie!',
        ],
        sci: [
          'Kolor pochodzi głównie od drobnych tlenków żelaza(III) (Fe3+) w pyle, pokrywających ciemniejszy bazalt bogaty w minerały żelaza(II), takie jak oliwin i piroksen; płaszcz Marsa zawiera mniej więcej dwa razy więcej tlenku żelaza niż płaszcz Ziemi. Badanie z 2025 roku sugeruje, że duża część pyłu to ferrihydryt, tlenek żelaza powstający w chłodnej wodzie, więc rdzewienie może pochodzić z czasów, gdy było wilgotniej.',
          'Opportunity wylądował na Meridiani Planum w styczniu 2004 roku, w miejscu wybranym, bo sonda z orbity zobaczyła tam szary hematyt. Znalazł kuleczki hematytu o średnicy kilku milimetrów, wymywane z piaskowca, oraz jarosyt, który powstaje tylko w kwaśnej wodzie; jego spektrometr mössbauerowski rozróżniał minerały żelaza dzięki jądrom żelaza-57. Zachody słońca są niebieskie, bo ziarna pyłu rozpraszają niebieskie światło do przodu, blisko kierunku Słońca (Curiosity sfilmował jeden w 2015 roku).',
        ],
      },
      de: {
        kid: [
          'Der Mars ist rot, weil er rostig ist! Sein Staub und die Außenseite seiner Steine enthalten Eisen, das sich vor langer Zeit mit Sauerstoff verbunden hat, im selben Rotbraun wie Rost an einem alten Fahrrad. Der Wind verteilt den feinen roten Staub über den ganzen Planeten, aber kratz an einem Stein, und innen ist er dunkelgrau.',
          'Im Jahr 2004 fand der Rover Opportunity kleine runde Kügelchen aus einem Eisenmineral, Hämatit, die die Forscher Blaubeeren nannten. Auf der Erde entstehen solche Kügelchen im Wasser, also war der Mars einmal nass. Und auf dem Mars ist der Himmel am Tag hell karamellfarben, während die Sonnenuntergänge blau sind!',
        ],
        sci: [
          'Die Farbe kommt vor allem von feinen Eisen(III)-oxiden (Fe3+) im Staub, die dunkleren Basalt voller Eisen(II)-Minerale wie Olivin und Pyroxen überziehen; der Marsmantel enthält etwa doppelt so viel Eisenoxid wie der Erdmantel. Eine Studie von 2025 legt nahe, dass ein großer Teil des Staubs Ferrihydrit ist, ein Eisenoxid, das sich mit kühlem Wasser bildet; das Rosten könnte also aus einer feuchteren Zeit stammen.',
          'Opportunity landete im Januar 2004 auf Meridiani Planum, einem Ort, der gewählt wurde, weil eine Sonde aus der Umlaufbahn dort grauen Hämatit gesehen hatte. Er fand Hämatitkügelchen von einigen Millimetern, die aus Sandstein herauswitterten, und Jarosit, der sich nur in saurem Wasser bildet; sein Mößbauer-Spektrometer unterschied die Eisenminerale über die Kerne von Eisen-57. Die Sonnenuntergänge sind blau, weil die Staubkörner blaues Licht nach vorn streuen, nahe der Richtung der Sonne (Curiosity filmte einen im Jahr 2015).',
        ],
      },
    },
  },
  {
    id: 'rails',
    color: '#5aa9ff',
    title: {
      en: 'How do you weld a railway track?',
      'pt-pt': 'Como se solda uma linha de comboio?',
      pl: 'Jak spawa się szyny kolejowe?',
      de: 'Wie schweißt man Bahnschienen?',
    },
    story: {
      en: {
        kid: [
          'Modern railway tracks are welded into one long rail, kilometres long, so trains glide along without the old clickety-clack. Out on the line, workers join two rails with a special fire: a powder of rust and aluminium called thermite. Lit with a very hot spark, it blazes up hotter than 2000 °C.',
          'The aluminium snatches the oxygen away from the rust. What is left is pure iron, so hot that it is liquid! It pours down into a mould around the gap between the two rails, cools, and the two rails become one. The leftover aluminium oxide floats on top like a crust and is knocked off.',
        ],
        sci: [
          'Thermite was discovered by Hans Goldschmidt in 1893 and patented in 1895: Fe2O3 + 2 Al → 2 Fe + Al2O3, releasing about 4 kJ per gram of mixture, its products reaching about 2500 °C. Aluminium binds oxygen much more strongly than iron does (aluminium oxide is far more stable), and that drives the reaction. Its first commercial use was welding tram rails in Essen, in 1899.',
          'For a rail weld, a crucible over the gap holds thermite with additions (carbon, manganese and others) so that the poured metal is a steel matching the rail. The dense molten steel sinks and runs out through the crucible’s bottom into a preheated sand mould round the gap, while the much lighter alumina slag floats; the excess is sheared off and ground to the rail’s shape. Continuous welded rail is laid at a chosen neutral temperature so it neither buckles in summer heat nor pulls apart in winter cold.',
        ],
      },
      'pt-pt': {
        kid: [
          'As linhas de comboio modernas são soldadas num só carril comprido, com quilómetros, para os comboios deslizarem sem o antigo pouca-terra, pouca-terra. Na linha, os trabalhadores juntam dois carris com um fogo especial: um pó de ferrugem e alumínio chamado termite. Aceso com uma faísca muito quente, arde a mais de 2000 °C.',
          'O alumínio arranca o oxigénio à ferrugem. O que sobra é ferro puro, tão quente que está líquido! Escorre para um molde à volta do espaço entre os dois carris, arrefece, e os dois carris passam a ser um só. O óxido de alumínio que sobra flutua por cima como uma crosta e é partido e tirado.',
        ],
        sci: [
          'A termite foi descoberta por Hans Goldschmidt em 1893 e patenteada em 1895: Fe2O3 + 2 Al → 2 Fe + Al2O3, liberta cerca de 4 kJ por grama de mistura, e os produtos chegam a cerca de 2500 °C. O alumínio liga-se ao oxigénio com muito mais força do que o ferro (o óxido de alumínio é muito mais estável), e é isso que move a reação. A primeira aplicação comercial foi soldar carris de elétrico em Essen, em 1899.',
          'Numa soldadura de carril, um cadinho sobre o espaço leva termite com aditivos (carbono, manganês e outros), para que o metal vazado seja um aço igual ao do carril. O aço fundido, denso, afunda-se e escoa por baixo do cadinho para um molde de areia pré-aquecido à volta do espaço, enquanto a escória de alumina, muito mais leve, flutua; o excesso é cortado e esmerilado até ao perfil do carril. O carril soldado contínuo é assente a uma temperatura neutra escolhida, para não encurvar com o calor do verão nem se separar com o frio do inverno.',
        ],
      },
      pl: {
        kid: [
          'Nowoczesne tory spawa się w jedną długą szynę, długą na kilometry, żeby pociągi sunęły bez dawnego stukotu kół. Na torach robotnicy łączą dwie szyny specjalnym ogniem: proszkiem z rdzy i glinu, czyli aluminium, zwanym termitem. Zapalony bardzo gorącą iskrą, rozpala się do ponad 2000 °C.',
          'Glin wyrywa rdzy tlen. Zostaje czyste żelazo, tak gorące, że jest płynne! Spływa do formy wokół szczeliny między dwiema szynami, stygnie i dwie szyny stają się jedną. Pozostały tlenek glinu pływa na wierzchu jak skorupa i się go odbija.',
        ],
        sci: [
          'Termit odkrył Hans Goldschmidt w 1893 roku i opatentował w 1895: Fe2O3 + 2 Al → 2 Fe + Al2O3, reakcja wydziela około 4 kJ na gram mieszaniny, a produkty osiągają około 2500 °C. Glin wiąże tlen dużo silniej niż żelazo (tlenek glinu jest znacznie trwalszy) i to napędza reakcję. Pierwszym zastosowaniem handlowym było spawanie szyn tramwajowych w Essen w 1899 roku.',
          'Przy spawaniu szyn tygiel nad szczeliną zawiera termit z dodatkami (węgiel, mangan i inne), żeby wylany metal był stalą taką jak w szynie. Gęsta, płynna stal opada i wypływa dnem tygla do podgrzanej formy z piasku wokół szczeliny, a znacznie lżejszy żużel z tlenku glinu pływa na wierzchu; nadmiar się ścina i szlifuje do profilu szyny. Szyny bezstykowe układa się w wybranej temperaturze neutralnej, żeby latem nie wyboczyły się od upału, a zimą nie rozerwały od mrozu.',
        ],
      },
      de: {
        kid: [
          'Moderne Bahngleise werden zu einer einzigen langen Schiene verschweißt, kilometerlang, damit die Züge ohne das alte Tackatack dahingleiten. Draußen an der Strecke verbinden Arbeiter zwei Schienen mit einem besonderen Feuer: einem Pulver aus Rost und Aluminium, Thermit genannt. Mit einem sehr heißen Funken gezündet, lodert es heißer als 2000 °C auf.',
          'Das Aluminium schnappt dem Rost den Sauerstoff weg. Übrig bleibt reines Eisen, so heiß, dass es flüssig ist! Es fließt in eine Form um die Lücke zwischen den beiden Schienen, kühlt ab, und die zwei Schienen werden eins. Das übrige Aluminiumoxid schwimmt wie eine Kruste obenauf und wird abgeschlagen.',
        ],
        sci: [
          'Thermit wurde 1893 von Hans Goldschmidt entdeckt und 1895 patentiert: Fe2O3 + 2 Al → 2 Fe + Al2O3, die Reaktion setzt etwa 4 kJ pro Gramm Gemisch frei, und die Produkte erreichen etwa 2500 °C. Aluminium bindet Sauerstoff viel fester als Eisen (Aluminiumoxid ist viel stabiler), das treibt die Reaktion an. Die erste kommerzielle Anwendung war 1899 das Schweißen von Straßenbahnschienen in Essen.',
          'Für eine Schienenschweißung enthält ein Tiegel über der Lücke Thermit mit Zusätzen (Kohlenstoff, Mangan und andere), damit das gegossene Metall ein Stahl wie der der Schiene ist. Der dichte, flüssige Stahl sinkt nach unten und läuft durch den Boden des Tiegels in eine vorgewärmte Sandform um die Lücke, während die viel leichtere Tonerdeschlacke obenauf schwimmt; der Überstand wird abgeschert und auf das Schienenprofil geschliffen. Lückenlos verschweißte Gleise werden bei einer gewählten Neutraltemperatur verlegt, damit sie sich weder in der Sommerhitze verwerfen noch in der Winterkälte auseinanderreißen.',
        ],
      },
    },
  },
]
