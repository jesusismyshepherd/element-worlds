// Silicon's picture boards in its hall (docs/knowledge/hall-boards.md): a doorway into its Periodic Videos
// lab, then six pictures on the walls, each a question that makes you walk up, and the story it opens
// (Explorer and Scientist). They add to the lab (the polycrystalline lump and sand, the chip line, the wafer
// and its rainbow, the silicon nitride turbocharger and the silicate minerals are there) instead of
// repeating it. Pictures: public/boards/Si/<id>.svg, drawn by tools/boards/Si/ (no words in them: the title
// is drawn in the visitor's language).
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  { id: 'doors', color: '#7fb4ff', doors: ['videos'] },
  {
    id: 'diatoms',
    color: '#46e0a0',
    title: {
      en: 'Who lives in a house made of glass?',
      'pt-pt': 'Quem vive numa casa de vidro?',
      pl: 'Kto mieszka w szklanym domku?',
      de: 'Wer wohnt in einem Haus aus Glas?',
    },
    story: {
      en: {
        kid: [
          'In every sea and lake float diatoms: tiny algae, each just one cell, too small to see without a microscope. Each one builds itself a shell of glass from the silicon in the water, in two halves that fit together like a box and its lid, full of tiny holes in beautiful patterns: circles, stars, little boats.',
          'Like plants, diatoms use sunlight to make their food, and they give off oxygen: scientists think they make about a fifth of all the oxygen made on Earth. When they die, their shells sink and pile up into a soft white rock, diatomaceous earth, that people use to filter swimming pools and drinks.',
        ],
        sci: [
          'Diatoms are single-celled algae, mostly about 2 to 200 µm across, inside a cell wall called a frustule: two overlapping valves of hydrated amorphous silica (SiO2·nH2O), like the two halves of a Petri dish, built from the silicic acid, Si(OH)4, they take up from the water. Each new half grows inside the old one, so as the cells divide their average size shrinks, until sexual reproduction makes full-sized cells again.',
          'They are thought to do about a fifth of the photosynthesis on Earth, and so to make about a fifth of its oxygen each year (estimates vary). Their fossil frustules form diatomite (kieselguhr), used in filters and as a mild abrasive; in 1867 Alfred Nobel soaked nitroglycerine into it and patented dynamite. Land plants use silica too: the stinging hairs of a nettle end in brittle silica tips that snap off in your skin.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em todos os mares e lagos flutuam diatomáceas: algas minúsculas, cada uma com uma só célula, pequenas demais para se verem sem microscópio. Cada uma constrói para si uma casca de vidro com o silício da água, em duas metades que encaixam como uma caixa e a sua tampa, cheias de buraquinhos em padrões lindíssimos: círculos, estrelas, barquinhos.',
          'Tal como as plantas, as diatomáceas usam a luz do Sol para fazer o seu alimento e libertam oxigénio: os cientistas pensam que fazem cerca de um quinto de todo o oxigénio produzido na Terra. Quando morrem, as cascas afundam-se e acumulam-se numa rocha branca e macia, a terra de diatomáceas, que se usa para filtrar piscinas e bebidas.',
        ],
        sci: [
          'As diatomáceas são algas unicelulares, quase todas com cerca de 2 a 200 µm, dentro de uma parede celular chamada frústula: duas valvas sobrepostas de sílica amorfa hidratada (SiO2·nH2O), como as duas metades de uma caixa de Petri, feitas com o ácido silícico, Si(OH)4, que tiram da água. Cada metade nova cresce dentro da antiga, por isso, à medida que as células se dividem, o seu tamanho médio diminui, até que a reprodução sexuada volta a dar células do tamanho máximo.',
          'Pensa-se que fazem cerca de um quinto da fotossíntese da Terra e, com ela, cerca de um quinto do oxigénio produzido em cada ano (as estimativas variam). As frústulas fósseis formam a diatomite (kieselguhr), usada em filtros e como abrasivo suave; em 1867, Alfred Nobel embebeu-a em nitroglicerina e patenteou a dinamite. As plantas terrestres também usam sílica: os pelos urticantes da urtiga acabam em pontas frágeis de sílica que se partem dentro da pele.',
        ],
      },
      pl: {
        kid: [
          'W każdym morzu i jeziorze unoszą się okrzemki: malutkie glony, każdy z jednej komórki, zbyt mały, żeby go zobaczyć bez mikroskopu. Każda okrzemka buduje sobie szklaną skorupkę z krzemu z wody, z dwóch połówek, które pasują do siebie jak pudełko i wieczko, pełną malutkich dziurek w pięknych wzorach: kółkach, gwiazdach, łódeczkach.',
          'Tak jak rośliny, okrzemki wytwarzają pokarm dzięki światłu słonecznemu i wydzielają tlen: naukowcy uważają, że wytwarzają około jednej piątej całego tlenu powstającego na Ziemi. Kiedy giną, ich skorupki opadają na dno i układają się w miękką białą skałę, ziemię okrzemkową, której używa się do filtrowania basenów i napojów.',
        ],
        sci: [
          'Okrzemki to jednokomórkowe glony, przeważnie o średnicy od około 2 do 200 µm, zamknięte w ścianie komórkowej zwanej pancerzykiem (frustulą): dwóch zachodzących na siebie skorupkach z uwodnionej bezpostaciowej krzemionki (SiO2·nH2O), jak dwie połówki szalki Petriego, zbudowanych z kwasu krzemowego, Si(OH)4, pobieranego z wody. Każda nowa połówka rośnie wewnątrz starej, więc w miarę podziałów średni rozmiar komórek maleje, aż rozmnażanie płciowe znów da komórki pełnej wielkości.',
          'Uważa się, że odpowiadają za około jedną piątą fotosyntezy na Ziemi, a więc i za około jedną piątą tlenu wytwarzanego co roku (szacunki się różnią). Z ich skamieniałych pancerzyków powstaje diatomit (ziemia okrzemkowa), używany w filtrach i jako delikatny środek ścierny; w 1867 roku Alfred Nobel nasączył go nitrogliceryną i opatentował dynamit. Rośliny lądowe też używają krzemionki: włoski parzące pokrzywy kończą się kruchymi krzemionkowymi czubkami, które odłamują się w skórze.',
        ],
      },
      de: {
        kid: [
          'In jedem Meer und jedem See schweben Kieselalgen: winzige Algen, jede nur eine einzige Zelle, zu klein, um sie ohne Mikroskop zu sehen. Jede baut sich aus dem Silicium im Wasser eine Schale aus Glas, aus zwei Hälften, die wie eine Schachtel und ihr Deckel ineinanderpassen, voller winziger Löcher in wunderschönen Mustern: Kreise, Sterne, kleine Boote.',
          'Wie Pflanzen machen Kieselalgen mit Sonnenlicht ihre Nahrung und geben dabei Sauerstoff ab: Forscher glauben, dass sie etwa ein Fünftel des ganzen Sauerstoffs machen, der auf der Erde entsteht. Wenn sie sterben, sinken ihre Schalen ab und häufen sich zu einem weichen weißen Gestein an, der Kieselgur, mit der man Schwimmbäder und Getränke filtert.',
        ],
        sci: [
          'Kieselalgen (Diatomeen) sind einzellige Algen, meist etwa 2 bis 200 µm groß, in einer Zellwand namens Frustel: zwei übereinandergreifende Schalen aus wasserhaltigem amorphem Siliciumdioxid (SiO2·nH2O), wie die zwei Hälften einer Petrischale, gebaut aus der Kieselsäure, Si(OH)4, die sie aus dem Wasser aufnehmen. Jede neue Hälfte wächst in der alten, deshalb wird ihre mittlere Größe mit den Teilungen immer kleiner, bis geschlechtliche Fortpflanzung wieder Zellen voller Größe hervorbringt.',
          'Man nimmt an, dass sie etwa ein Fünftel der Photosynthese der Erde leisten und damit etwa ein Fünftel des jährlich gebildeten Sauerstoffs (die Schätzungen schwanken). Ihre fossilen Schalen bilden Kieselgur (Diatomit), die in Filtern und als mildes Schleifmittel dient; 1867 tränkte Alfred Nobel sie mit Nitroglycerin und ließ sich das Dynamit patentieren. Auch Landpflanzen nutzen Siliciumdioxid: Die Brennhaare der Brennnessel enden in spröden Spitzen aus Siliciumdioxid, die in der Haut abbrechen.',
        ],
      },
    },
  },
  {
    id: 'solar',
    color: '#ffc23d',
    title: {
      en: 'How does sunlight become electricity?',
      'pt-pt': 'Como se faz eletricidade com o Sol?',
      pl: 'Jak słońce daje nam prąd?',
      de: 'Wie wird aus Sonnenlicht Strom?',
    },
    story: {
      en: {
        kid: [
          'A solar panel is made of thin slices of silicon. Each slice has two layers: one with a pinch of phosphorus mixed in, the other with a pinch of boron. When sunlight hits the silicon it knocks electrons loose, and the border between the two layers pushes them all the same way, out into the wires: electricity, with no moving parts and no noise.',
          'In 1958 a satellite the size of a grapefruit, Vanguard 1, ran its radio on six little silicon solar cells. The radio went quiet in 1964, but Vanguard 1 is still up there: the oldest human-made object in orbit.',
        ],
        sci: [
          'A silicon cell is a p-n junction: a thin layer doped with phosphorus (n-type) on silicon doped with boron (p-type). A photon with more energy than silicon’s band gap, 1.12 eV (light shorter than about 1100 nm), lifts an electron into the conduction band; the junction’s built-in electric field separates the electron from the hole it left, and each cell gives about 0.6 V. Energy above the gap is lost as heat, which limits a silicon cell to about 29%.',
          'Daryl Chapin, Calvin Fuller and Gerald Pearson made the first practical silicon solar cell at Bell Labs in 1954, about 6% efficient; Vanguard 1 (1958) was the first satellite powered by solar cells. Today’s panels turn about 20 to 23% of the sunlight into electricity, and crystalline silicon makes up more than nine in ten of the panels made.',
        ],
      },
      'pt-pt': {
        kid: [
          'Um painel solar é feito de fatias finas de silício. Cada fatia tem duas camadas: uma com uma pitada de fósforo misturada, a outra com uma pitada de boro. Quando a luz do Sol bate no silício, solta eletrões, e a fronteira entre as duas camadas empurra-os todos para o mesmo lado, para os fios: eletricidade, sem peças a mexer e sem barulho.',
          'Em 1958, um satélite do tamanho de uma toranja, o Vanguard 1, alimentava o seu rádio com seis pequenas células solares de silício. O rádio calou-se em 1964, mas o Vanguard 1 continua lá em cima: é o objeto feito pelo ser humano que está há mais tempo em órbita.',
        ],
        sci: [
          'Uma célula de silício é uma junção p-n: uma camada fina dopada com fósforo (tipo n) sobre silício dopado com boro (tipo p). Um fotão com mais energia do que a banda proibida do silício, 1,12 eV (luz de comprimento de onda inferior a cerca de 1100 nm), faz subir um eletrão para a banda de condução; o campo elétrico interno da junção separa o eletrão da lacuna que ele deixou, e cada célula dá cerca de 0,6 V. A energia acima da banda proibida perde-se em calor, o que limita uma célula de silício a cerca de 29%.',
          'Daryl Chapin, Calvin Fuller e Gerald Pearson fizeram a primeira célula solar de silício prática nos Bell Labs em 1954, com cerca de 6% de eficiência; o Vanguard 1 (1958) foi o primeiro satélite alimentado por células solares. Os painéis de hoje transformam cerca de 20 a 23% da luz do Sol em eletricidade, e o silício cristalino representa mais de nove em cada dez painéis fabricados.',
        ],
      },
      pl: {
        kid: [
          'Panel słoneczny jest zbudowany z cienkich plasterków krzemu. Każdy plasterek ma dwie warstwy: w jednej jest szczypta fosforu, w drugiej szczypta boru. Kiedy światło słoneczne pada na krzem, wybija z niego elektrony, a granica między warstwami popycha je wszystkie w tę samą stronę, do przewodów: to prąd, bez ruchomych części i bez hałasu.',
          'W 1958 roku satelita wielkości grejpfruta, Vanguard 1, zasilał swoje radio z sześciu małych krzemowych ogniw słonecznych. Radio ucichło w 1964 roku, ale Vanguard 1 wciąż tam krąży: to najstarszy zbudowany przez ludzi obiekt na orbicie.',
        ],
        sci: [
          'Ogniwo krzemowe to złącze p-n: cienka warstwa domieszkowana fosforem (typ n) na krzemie domieszkowanym borem (typ p). Foton o energii większej niż przerwa energetyczna krzemu, 1,12 eV (światło o długości fali krótszej niż około 1100 nm), przenosi elektron do pasma przewodnictwa; wbudowane pole elektryczne złącza oddziela elektron od dziury, którą zostawił, a każde ogniwo daje około 0,6 V. Energia powyżej przerwy zamienia się w ciepło, co ogranicza sprawność ogniwa krzemowego do około 29%.',
          'Daryl Chapin, Calvin Fuller i Gerald Pearson zbudowali pierwsze praktyczne krzemowe ogniwo słoneczne w Bell Labs w 1954 roku, o sprawności około 6%; Vanguard 1 (1958) był pierwszym satelitą zasilanym ogniwami słonecznymi. Dzisiejsze panele zamieniają w prąd około 20 do 23% światła słonecznego, a krzem krystaliczny to ponad dziewięć na dziesięć produkowanych paneli.',
        ],
      },
      de: {
        kid: [
          'Ein Solarmodul besteht aus dünnen Scheiben aus Silicium. Jede Scheibe hat zwei Schichten: In der einen ist eine Prise Phosphor, in der anderen eine Prise Bor. Wenn Sonnenlicht auf das Silicium fällt, schlägt es Elektronen los, und die Grenze zwischen den beiden Schichten schiebt sie alle in dieselbe Richtung, hinaus in die Drähte: Strom, ohne bewegliche Teile und ohne Lärm.',
          '1958 betrieb ein Satellit so groß wie eine Grapefruit, Vanguard 1, sein Funkgerät mit sechs kleinen Solarzellen aus Silicium. Das Funkgerät verstummte 1964, aber Vanguard 1 ist immer noch da oben: das älteste von Menschen gebaute Objekt in einer Umlaufbahn.',
        ],
        sci: [
          'Eine Siliciumzelle ist ein p-n-Übergang: eine dünne, mit Phosphor dotierte Schicht (n-Typ) auf mit Bor dotiertem Silicium (p-Typ). Ein Photon mit mehr Energie als die Bandlücke des Siliciums, 1,12 eV (Licht mit einer Wellenlänge unter etwa 1100 nm), hebt ein Elektron ins Leitungsband; das eingebaute elektrische Feld des Übergangs trennt das Elektron von dem Loch, das es zurückgelassen hat, und jede Zelle liefert etwa 0,6 V. Energie über der Bandlücke geht als Wärme verloren, deshalb schafft eine Siliciumzelle höchstens etwa 29%.',
          'Daryl Chapin, Calvin Fuller und Gerald Pearson bauten 1954 in den Bell Labs die erste brauchbare Solarzelle aus Silicium, mit etwa 6% Wirkungsgrad; Vanguard 1 (1958) war der erste Satellit, der mit Solarzellen betrieben wurde. Heutige Module wandeln etwa 20 bis 23% des Sonnenlichts in Strom um, und kristallines Silicium macht mehr als neun von zehn der hergestellten Module aus.',
        ],
      },
    },
  },
  {
    id: 'glass',
    color: '#ff8f4a',
    title: {
      en: 'How does sand turn into glass?',
      'pt-pt': 'Como se faz vidro com areia?',
      pl: 'Jak piasek zmienia się w szkło?',
      de: 'Wie wird aus Sand Glas?',
    },
    story: {
      en: {
        kid: [
          'Glass is made mostly from sand. Mix sand with a little soda and limestone, heat it in a furnace hotter than lava, and it melts into a glowing, gooey liquid that glassblowers can blow into bubbles, bottles and vases. People have been making glass for more than 4000 years.',
          'But sand is not see-through, so why is glass? A heap of sand is millions of tiny grains, and all their edges bounce the light about, as snow does: that is why both look white. Melted and cooled, the glass becomes one piece with no edges inside, so light goes straight through, as it does through clear ice. Look at the edge of a window pane: its green tint comes from a trace of iron.',
        ],
        sci: [
          'Window glass is soda-lime glass: about 72% silica (SiO2), 14% sodium oxide and 9% lime (CaO). Pure silica melts only above about 1700 °C; soda (Na2CO3) lets the batch melt at about 1500 °C, and lime keeps the glass from dissolving in water. Cooled quickly, the melt sets as a disordered network of SiO4 tetrahedra, with no crystal order. Glassblowing was invented on the eastern Mediterranean coast in the 1st century BC.',
          'Glass is clear because the network has no grain boundaries to scatter light, and its electrons need about 9 eV to be excited, far more than a photon of visible light carries (1.6 to 3.3 eV). Made pure enough, silica carries light a very long way: in today’s optical fibres half of it is still there after about 15 km. Charles Kao proposed glass fibres for communication in 1966 (Nobel Prize in Physics 2009).',
        ],
      },
      'pt-pt': {
        kid: [
          'O vidro faz-se sobretudo com areia. Mistura-se a areia com um pouco de soda e de calcário, aquece-se num forno mais quente do que a lava, e ela derrete num líquido viscoso e incandescente que os vidreiros sopram em bolhas, garrafas e jarras. As pessoas fazem vidro há mais de 4000 anos.',
          'Mas a areia não é transparente; então porque é que o vidro é? Um monte de areia são milhões de grãozinhos, e todas as suas arestas espalham a luz, como faz a neve: é por isso que as duas parecem brancas. Derretido e arrefecido, o vidro fica uma peça só, sem arestas lá dentro, e a luz passa a direito, como através do gelo transparente. Olha para a aresta do vidro de uma janela: o tom verde vem de um bocadinho de ferro.',
        ],
        sci: [
          'O vidro das janelas é vidro sodocálcico: cerca de 72% de sílica (SiO2), 14% de óxido de sódio e 9% de cal (CaO). A sílica pura só funde acima de cerca de 1700 °C; a soda (Na2CO3) deixa a mistura fundir a cerca de 1500 °C, e a cal impede o vidro de se dissolver na água. Arrefecido depressa, o banho solidifica numa rede desordenada de tetraedros SiO4, sem ordem cristalina. O sopro de vidro foi inventado na costa oriental do Mediterrâneo, no século I a.C.',
          'O vidro é transparente porque a rede não tem fronteiras de grão que espalhem a luz e os seus eletrões precisam de cerca de 9 eV para serem excitados, muito mais do que traz um fotão de luz visível (1,6 a 3,3 eV). Com pureza suficiente, a sílica leva a luz muito longe: nas fibras óticas de hoje, metade da luz ainda lá está ao fim de cerca de 15 km. Charles Kao propôs as fibras de vidro para as comunicações em 1966 (Prémio Nobel da Física de 2009).',
        ],
      },
      pl: {
        kid: [
          'Szkło robi się głównie z piasku. Miesza się piasek z odrobiną sody i wapienia, ogrzewa w piecu gorętszym niż lawa, a on topi się w świecącą, ciągnącą się ciecz, z której hutnicy wydmuchują bańki, butelki i wazony. Ludzie robią szkło od ponad 4000 lat.',
          'Ale piasek nie jest przezroczysty, więc dlaczego szkło jest? Kupka piasku to miliony malutkich ziarenek, a wszystkie ich krawędzie rozpraszają światło, tak jak śnieg: dlatego jedno i drugie wygląda na białe. Stopione i ostudzone szkło staje się jednym kawałkiem bez krawędzi w środku, więc światło przechodzi przez nie na wprost, jak przez czysty lód. Popatrz na brzeg szyby w oknie: jej zielony odcień to ślad żelaza.',
        ],
        sci: [
          'Szkło okienne to szkło sodowo-wapniowe: około 72% krzemionki (SiO2), 14% tlenku sodu i 9% wapna (CaO). Czysta krzemionka topi się dopiero powyżej około 1700 °C; soda (Na2CO3) pozwala stopić zestaw w około 1500 °C, a wapno chroni szkło przed rozpuszczaniem się w wodzie. Szybko schłodzony stop zastyga w nieuporządkowaną sieć tetraedrów SiO4, bez uporządkowania kryształu. Dmuchanie szkła wynaleziono na wschodnim wybrzeżu Morza Śródziemnego w I wieku p.n.e.',
          'Szkło jest przezroczyste, bo sieć nie ma granic ziaren, które rozpraszałyby światło, a jej elektrony potrzebują do wzbudzenia około 9 eV, znacznie więcej, niż niesie foton światła widzialnego (1,6 do 3,3 eV). Dostatecznie czysta krzemionka przewodzi światło bardzo daleko: w dzisiejszych światłowodach połowa światła zostaje jeszcze po około 15 km. Charles Kao zaproponował szklane włókna do łączności w 1966 roku (Nagroda Nobla w dziedzinie fizyki 2009).',
        ],
      },
      de: {
        kid: [
          'Glas wird vor allem aus Sand gemacht. Man mischt Sand mit etwas Soda und Kalkstein, erhitzt ihn in einem Ofen, heißer als Lava, und er schmilzt zu einer glühenden, zähen Flüssigkeit, die Glasbläser zu Blasen, Flaschen und Vasen blasen. Menschen machen schon seit mehr als 4000 Jahren Glas.',
          'Aber Sand ist nicht durchsichtig, warum also Glas? Ein Sandhaufen besteht aus Millionen winziger Körner, und all ihre Kanten werfen das Licht hin und her, wie Schnee: Deshalb sehen beide weiß aus. Geschmolzen und abgekühlt wird Glas zu einem einzigen Stück ohne Kanten im Inneren, und das Licht geht geradewegs hindurch, wie durch klares Eis. Schau dir die Kante einer Fensterscheibe an: Ihr grüner Schimmer kommt von einer Spur Eisen.',
        ],
        sci: [
          'Fensterglas ist Kalk-Natron-Glas: etwa 72% Siliciumdioxid (SiO2), 14% Natriumoxid und 9% Kalk (CaO). Reines Siliciumdioxid schmilzt erst über etwa 1700 °C; Soda (Na2CO3) lässt das Gemenge bei etwa 1500 °C schmelzen, und der Kalk verhindert, dass sich das Glas in Wasser löst. Schnell abgekühlt erstarrt die Schmelze zu einem ungeordneten Netzwerk aus SiO4-Tetraedern, ohne Kristallordnung. Das Glasblasen wurde im 1. Jahrhundert v. Chr. an der Ostküste des Mittelmeers erfunden.',
          'Glas ist durchsichtig, weil das Netzwerk keine Korngrenzen hat, die Licht streuen, und weil seine Elektronen etwa 9 eV brauchen, um angeregt zu werden, viel mehr, als ein Photon sichtbaren Lichts trägt (1,6 bis 3,3 eV). Rein genug leitet Siliciumdioxid das Licht sehr weit: In heutigen Glasfasern ist nach etwa 15 km noch die Hälfte davon da. Charles Kao schlug 1966 Glasfasern für die Nachrichtenübertragung vor (Nobelpreis für Physik 2009).',
        ],
      },
    },
  },
  {
    id: 'earth',
    color: '#a6d64a',
    title: {
      en: 'What are the Earth and Moon made of?',
      'pt-pt': 'De que são feitas a Terra e a Lua?',
      pl: 'Z czego są Ziemia i Księżyc?',
      de: 'Woraus bestehen Erde und Mond?',
    },
    story: {
      en: {
        kid: [
          'Under your feet is a thin crust of rock, and under that the mantle: hot rock almost 3000 km deep. Nearly all of it is made of silicates, silicon and oxygen joined with magnesium and iron, and much of it is a green mineral called olivine. Volcanoes sometimes bring some up: Hawaii has a beach of green sand made of olivine, and the green gem peridot is olivine too.',
          'The Moon is made of the same kind of rock; astronauts brought 382 kg of it back to Earth. And the silicon itself? It was made long ago inside giant stars, which exploded and scattered it into space, into the cloud of gas and dust that the Sun and its planets grew from.',
        ],
        sci: [
          'Silicon is about 15% of the whole Earth’s mass, nearly all of it in silicates. The upper mantle is mostly peridotite, rich in olivine, (Mg,Fe)2SiO4; between about 410 and 660 km down the pressure packs it into denser forms, wadsleyite and ringwoodite, and below 660 km into bridgmanite, (Mg,Fe)SiO3, the most abundant mineral on Earth (named only in 2014).',
          'The six Apollo landings (1969 to 1972) brought back 382 kg of Moon rock: basalts from the dark maria and anorthosite, mostly feldspar, from the bright highlands. Their oxygen isotopes match Earth’s almost exactly, one clue that the Moon formed after a giant impact. The silicon was made in massive stars by oxygen burning (16O + 16O → 28Si + 4He, at about 2 billion K) and spread by supernovae.',
        ],
      },
      'pt-pt': {
        kid: [
          'Debaixo dos teus pés há uma crosta fina de rocha e, por baixo dela, o manto: rocha quente com quase 3000 km de profundidade. Quase todo é feito de silicatos, silício e oxigénio unidos ao magnésio e ao ferro, e grande parte é um mineral verde chamado olivina. Às vezes os vulcões trazem um pouco para cima: no Havai há uma praia de areia verde feita de olivina, e a pedra preciosa verde chamada peridoto também é olivina.',
          'A Lua é feita do mesmo tipo de rocha; os astronautas trouxeram 382 kg dela para a Terra. E o próprio silício? Foi feito há muito tempo dentro de estrelas gigantes, que explodiram e o espalharam pelo espaço, na nuvem de gás e poeira de onde nasceram o Sol e os seus planetas.',
        ],
        sci: [
          'O silício é cerca de 15% da massa da Terra inteira, quase todo em silicatos. O manto superior é sobretudo peridotito, rico em olivina, (Mg,Fe)2SiO4; entre cerca de 410 e 660 km de profundidade, a pressão compacta-a em formas mais densas, a wadsleyite e a ringwoodite, e abaixo dos 660 km em bridgmanite, (Mg,Fe)SiO3, o mineral mais abundante da Terra (só recebeu nome em 2014).',
          'As seis alunagens Apollo (1969 a 1972) trouxeram 382 kg de rocha lunar: basaltos dos mares escuros e anortosito, quase todo feldspato, das terras altas claras. Os seus isótopos de oxigénio coincidem quase exatamente com os da Terra, uma pista de que a Lua se formou depois de um impacto gigante. O silício foi feito em estrelas de grande massa pela queima do oxigénio (16O + 16O → 28Si + 4He, a cerca de 2 mil milhões de K) e espalhado pelas supernovas.',
        ],
      },
      pl: {
        kid: [
          'Pod twoimi stopami jest cienka skorupa skalna, a pod nią płaszcz: gorąca skała sięgająca prawie 3000 km w głąb. Prawie cały jest zbudowany z krzemianów, czyli krzemu i tlenu połączonych z magnezem i żelazem, a duża jego część to zielony minerał zwany oliwinem. Wulkany czasem wynoszą go na powierzchnię: na Hawajach jest plaża z zielonego piasku z oliwinu, a zielony kamień szlachetny perydot to też oliwin.',
          'Księżyc jest zbudowany z tego samego rodzaju skał; astronauci przywieźli ich na Ziemię 382 kg. A sam krzem? Powstał dawno temu we wnętrzu olbrzymich gwiazd, które wybuchły i rozrzuciły go w kosmosie, w obłoku gazu i pyłu, z którego narodziły się Słońce i jego planety.',
        ],
        sci: [
          'Krzem stanowi około 15% masy całej Ziemi, prawie w całości w krzemianach. Górny płaszcz to głównie perydotyt, bogaty w oliwin, (Mg,Fe)2SiO4; na głębokości od około 410 do 660 km ciśnienie zagęszcza go w gęstsze odmiany, wadsleyit i ringwoodyt, a poniżej 660 km w bridgmanit, (Mg,Fe)SiO3, najpowszechniejszy minerał na Ziemi (nazwany dopiero w 2014 roku).',
          'Sześć lądowań Apollo (od 1969 do 1972 roku) przywiozło 382 kg skał księżycowych: bazalty z ciemnych mórz i anortozyt, głównie skaleń, z jasnych wyżyn. Ich izotopy tlenu niemal dokładnie zgadzają się z ziemskimi, co jest jedną ze wskazówek, że Księżyc powstał po gigantycznym zderzeniu. Krzem powstał w masywnych gwiazdach w spalaniu tlenu (16O + 16O → 28Si + 4He, w około 2 miliardach K) i rozniosły go supernowe.',
        ],
      },
      de: {
        kid: [
          'Unter deinen Füßen liegt eine dünne Kruste aus Gestein und darunter der Mantel: heißes Gestein, fast 3000 km tief. Fast alles davon besteht aus Silikaten, Silicium und Sauerstoff, verbunden mit Magnesium und Eisen, und vieles davon ist ein grünes Mineral namens Olivin. Vulkane bringen manchmal etwas davon herauf: Auf Hawaii gibt es einen Strand aus grünem Olivinsand, und der grüne Edelstein Peridot ist auch Olivin.',
          'Der Mond besteht aus derselben Art Gestein; Astronauten haben 382 kg davon zur Erde gebracht. Und das Silicium selbst? Es entstand vor langer Zeit in riesigen Sternen, die explodierten und es im Weltraum verstreuten, in die Wolke aus Gas und Staub, aus der die Sonne und ihre Planeten entstanden.',
        ],
        sci: [
          'Silicium macht etwa 15% der Masse der ganzen Erde aus, fast alles in Silikaten. Der obere Mantel besteht vor allem aus Peridotit, reich an Olivin, (Mg,Fe)2SiO4; zwischen etwa 410 und 660 km Tiefe presst der Druck ihn in dichtere Formen, Wadsleyit und Ringwoodit, und unterhalb von 660 km in Bridgmanit, (Mg,Fe)SiO3, das häufigste Mineral der Erde (erst 2014 benannt).',
          'Die sechs Apollo-Landungen (1969 bis 1972) brachten 382 kg Mondgestein mit: Basalte aus den dunklen Maria und Anorthosit, vor allem Feldspat, aus dem hellen Hochland. Ihre Sauerstoffisotope stimmen fast genau mit denen der Erde überein, ein Hinweis darauf, dass der Mond nach einem gewaltigen Einschlag entstand. Das Silicium entstand in massereichen Sternen beim Sauerstoffbrennen (16O + 16O → 28Si + 4He, bei etwa 2 Milliarden K) und wurde von Supernovae verteilt.',
        ],
      },
    },
  },
  {
    id: 'valley',
    color: '#a48cff',
    title: {
      en: 'Why is a valley named after silicon?',
      'pt-pt': 'Porque tem um vale o nome do silício?',
      pl: 'Dlaczego dolina ma nazwę od krzemu?',
      de: 'Warum heißt ein Tal nach Silicium?',
    },
    story: {
      en: {
        kid: [
          'In 1824 silicon was just a brown powder in Jöns Jacob Berzelius’s laboratory in Sweden. More than a hundred years later, people found that very pure silicon makes wonderful tiny electric switches, transistors, and that many of them can be made together on one small chip.',
          'South of San Francisco, in California, there was a valley full of apricot, plum and cherry orchards. From the 1950s so many companies making silicon chips grew up there that in 1971 a journalist called it Silicon Valley, and the name stuck. That same year a company there put a computer’s whole brain on one chip, with 2300 transistors; the chip in a phone today has billions.',
        ],
        sci: [
          'The Santa Clara Valley was called the Valley of Heart’s Delight for its orchards. In 1956 William Shockley, who shared the Nobel Prize for the transistor, opened a laboratory in Mountain View to make silicon transistors; in 1957 eight of his engineers left to found Fairchild Semiconductor, where Robert Noyce made the planar silicon integrated circuit (1959). Fairchild’s people went on to found dozens of companies, Intel among them (Noyce and Gordon Moore, 1968).',
          'The journalist Don Hoefler gave the region its name in a series of articles, “Silicon Valley U.S.A.”, in Electronic News on 11 January 1971. That November Intel’s 4004, the first microprocessor sold as one chip, packed 2300 transistors; today’s processors hold tens of billions. Silicon beat germanium, the first transistors’ material, because it works at higher temperatures and grows its own stable, insulating skin of oxide, SiO2.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em 1824, o silício era apenas um pó castanho no laboratório de Jöns Jacob Berzelius, na Suécia. Mais de cem anos depois, descobriu-se que o silício muito puro dá uns interruptores elétricos minúsculos fantásticos, os transístores, e que se podem fazer muitos juntos num só chip pequenino.',
          'A sul de São Francisco, na Califórnia, havia um vale cheio de pomares de alperces, ameixas e cerejas. A partir dos anos 1950 cresceram lá tantas empresas de chips de silício que, em 1971, um jornalista lhe chamou Silicon Valley (Vale do Silício), e o nome pegou. Nesse mesmo ano, uma empresa de lá pôs o cérebro inteiro de um computador num só chip, com 2300 transístores; o chip de um telemóvel de hoje tem milhares de milhões.',
        ],
        sci: [
          'O vale de Santa Clara chamava-se «Valley of Heart’s Delight» por causa dos pomares. Em 1956, William Shockley, que partilhou o Prémio Nobel pelo transístor, abriu um laboratório em Mountain View para fazer transístores de silício; em 1957, oito dos seus engenheiros saíram para fundar a Fairchild Semiconductor, onde Robert Noyce fez o circuito integrado planar de silício (1959). Gente da Fairchild fundou depois dezenas de empresas, entre elas a Intel (Noyce e Gordon Moore, 1968).',
          'O jornalista Don Hoefler deu nome à região numa série de artigos, «Silicon Valley U.S.A.», na Electronic News de 11 de janeiro de 1971. Em novembro desse ano, o 4004 da Intel, o primeiro microprocessador vendido num só chip, tinha 2300 transístores; os processadores de hoje têm dezenas de milhares de milhões. O silício venceu o germânio, o material dos primeiros transístores, porque funciona a temperaturas mais altas e cria na sua superfície uma pele de óxido, SiO2, estável e isolante.',
        ],
      },
      pl: {
        kid: [
          'W 1824 roku krzem był tylko brązowym proszkiem w laboratorium Jönsa Jacoba Berzeliusa w Szwecji. Ponad sto lat później okazało się, że bardzo czysty krzem świetnie nadaje się na malutkie elektryczne przełączniki, tranzystory, i że wiele z nich można zrobić razem w jednym małym układzie scalonym.',
          'Na południe od San Francisco, w Kalifornii, była dolina pełna sadów moreli, śliwek i czereśni. Od lat 50. XX wieku wyrosło tam tyle firm produkujących krzemowe układy scalone, że w 1971 roku pewien dziennikarz nazwał ją Doliną Krzemową (Silicon Valley), i ta nazwa przylgnęła. W tym samym roku tamtejsza firma zmieściła cały mózg komputera w jednym układzie scalonym, z 2300 tranzystorami; układ w dzisiejszym telefonie ma ich miliardy.',
        ],
        sci: [
          'Dolinę Santa Clara nazywano z powodu sadów „Valley of Heart’s Delight”. W 1956 roku William Shockley, współlaureat Nagrody Nobla za tranzystor, otworzył w Mountain View laboratorium, które miało produkować tranzystory krzemowe; w 1957 roku ośmiu jego inżynierów odeszło i założyło Fairchild Semiconductor, gdzie Robert Noyce opracował planarny krzemowy układ scalony (1959). Ludzie z Fairchild założyli potem dziesiątki firm, wśród nich Intel (Noyce i Gordon Moore, 1968).',
          'Dziennikarz Don Hoefler nadał regionowi nazwę w serii artykułów „Silicon Valley U.S.A.” w „Electronic News” 11 stycznia 1971 roku. W listopadzie tego roku Intel 4004, pierwszy mikroprocesor sprzedawany jako jeden układ scalony, mieścił 2300 tranzystorów; dzisiejsze procesory mają ich dziesiątki miliardów. Krzem wygrał z germanem, materiałem pierwszych tranzystorów, bo działa w wyższych temperaturach i sam wytwarza na powierzchni trwałą, izolującą warstwę tlenku, SiO2.',
        ],
      },
      de: {
        kid: [
          '1824 war Silicium nur ein braunes Pulver im Labor von Jöns Jacob Berzelius in Schweden. Mehr als hundert Jahre später fand man heraus, dass sehr reines Silicium wunderbare winzige elektrische Schalter ergibt, Transistoren, und dass man viele davon zusammen auf einem kleinen Chip herstellen kann.',
          'Südlich von San Francisco, in Kalifornien, lag ein Tal voller Obstgärten mit Aprikosen, Pflaumen und Kirschen. Ab den 1950er-Jahren wuchsen dort so viele Firmen für Siliciumchips heran, dass ein Journalist es 1971 Silicon Valley nannte, und der Name blieb. Im selben Jahr brachte eine Firma von dort das ganze Gehirn eines Computers auf einen einzigen Chip, mit 2300 Transistoren; der Chip in einem Handy hat heute Milliarden.',
        ],
        sci: [
          'Das Santa Clara Valley hieß wegen seiner Obstgärten „Valley of Heart’s Delight“. 1956 eröffnete William Shockley, der für den Transistor den Nobelpreis mit erhielt, in Mountain View ein Labor, um Siliciumtransistoren herzustellen; 1957 gingen acht seiner Ingenieure und gründeten Fairchild Semiconductor, wo Robert Noyce den planaren integrierten Schaltkreis aus Silicium entwickelte (1959). Leute von Fairchild gründeten später Dutzende Firmen, darunter Intel (Noyce und Gordon Moore, 1968).',
          'Der Journalist Don Hoefler gab der Gegend ihren Namen in einer Artikelserie, „Silicon Valley U.S.A.“, in den Electronic News vom 11. Januar 1971. Im November desselben Jahres hatte Intels 4004, der erste Mikroprozessor, der als ein einziger Chip verkauft wurde, 2300 Transistoren; heutige Prozessoren haben Dutzende Milliarden. Silicium setzte sich gegen Germanium durch, das Material der ersten Transistoren, weil es bei höheren Temperaturen arbeitet und auf seiner Oberfläche eine eigene stabile, isolierende Oxidhaut bildet, SiO2.',
        ],
      },
    },
  },
  {
    id: 'silicone',
    color: '#ff6fa8',
    title: {
      en: 'Is your cake mould made of silicon?',
      'pt-pt': 'A tua forma de bolos é de silício?',
      pl: 'Czy twoja foremka jest z krzemu?',
      de: 'Ist deine Backform aus Silicium?',
    },
    story: {
      en: {
        kid: [
          'Not quite! Silicon is hard and shiny and snaps like glass. A bendy cake mould is made of silicone, with an e on the end: long chains of silicon, oxygen, silicon, oxygen, with little bits of carbon and hydrogen sticking out at the sides. The chains wiggle and slide past each other, so silicone bends and stretches, and it does not melt in a hot oven or crack in the freezer.',
          'Silicone also makes swimming caps, the seal round the bath, soft phone cases and a famous toy putty that bounces like a ball, stretches like chewing gum and snaps if you pull it fast. That putty was found by accident in 1943, by an engineer trying to make rubber.',
        ],
        sci: [
          'Most silicones are polydimethylsiloxane, -[Si(CH3)2-O]n-: a backbone of alternating silicon and oxygen, with two methyl groups on each silicon. Long Si-O bonds (about 164 pm) and wide Si-O-Si angles (about 143°) make the chain very flexible, and the strong Si-O bond makes it stable: it stays rubbery from its glass transition near −125 °C to well over 200 °C.',
          'Frederic Kipping named them silicones in 1901, thinking they were like ketones (R2C=O); they are not, since silicon makes no stable double bond to oxygen like that, but the name stuck. They are made by the direct process (Rochow and Müller, early 1940s): silicon and chloromethane over copper at about 300 °C give (CH3)2SiCl2, which water turns into the chains. Bouncing putty (1943) is silicone oil cross-linked by boric acid; its bonds break and re-form, so it flows when left, bounces when thrown and snaps when pulled fast.',
        ],
      },
      'pt-pt': {
        kid: [
          'Não exatamente! O silício é duro, brilhante e parte-se como vidro. Uma forma de bolos que dobra é feita de silicone, uma palavra parecida mas outra coisa: cadeias compridas de silício, oxigénio, silício, oxigénio, com pedacinhos de carbono e hidrogénio espetados dos lados. As cadeias mexem-se e deslizam umas sobre as outras, por isso o silicone dobra e estica, e não derrete no forno quente nem racha no congelador.',
          'Também se fazem de silicone toucas de natação, o vedante à volta da banheira, capas macias de telemóvel e uma famosa massa de brincar que salta como uma bola, estica como pastilha elástica e parte-se se a puxares depressa. Essa massa foi descoberta por acaso em 1943, por um engenheiro que tentava fazer borracha.',
        ],
        sci: [
          'A maior parte dos silicones é polidimetilsiloxano, -[Si(CH3)2-O]n-: um esqueleto de silício e oxigénio alternados, com dois grupos metilo em cada silício. As ligações Si-O compridas (cerca de 164 pm) e os ângulos Si-O-Si largos (cerca de 143°) tornam a cadeia muito flexível, e a ligação Si-O forte torna-a estável: continua elástica desde a sua transição vítrea, perto de −125 °C, até bem acima de 200 °C.',
          'Frederic Kipping chamou-lhes silicones em 1901, julgando que eram parecidos com as cetonas (R2C=O); não são, porque o silício não faz assim uma ligação dupla estável com o oxigénio, mas o nome ficou. Fazem-se pelo processo direto (Rochow e Müller, início dos anos 1940): silício e clorometano sobre cobre a cerca de 300 °C dão (CH3)2SiCl2, que a água transforma nas cadeias. A massa saltitona (1943) é óleo de silicone reticulado com ácido bórico; as suas ligações partem-se e voltam a formar-se, por isso escorre quando a deixas, salta quando a atiras e parte-se quando a puxas depressa.',
        ],
      },
      pl: {
        kid: [
          'Niezupełnie! Krzem jest twardy, błyszczący i pęka jak szkło. Giętka foremka do ciasta jest z silikonu, a to coś innego: z długich łańcuchów krzem, tlen, krzem, tlen, z malutkimi kawałkami węgla i wodoru sterczącymi na boki. Łańcuchy wiją się i przesuwają po sobie, więc silikon się wygina i rozciąga, a w gorącym piekarniku się nie topi i w zamrażarce nie pęka.',
          'Z silikonu robi się też czepki pływackie, uszczelnienie wokół wanny, miękkie etui na telefony i słynną masę do zabawy, która odbija się jak piłka, rozciąga jak guma do żucia i pęka, jeśli szybko ją pociągniesz. Tę masę odkrył przypadkiem w 1943 roku inżynier, który próbował zrobić gumę.',
        ],
        sci: [
          'Większość silikonów to polidimetylosiloksan, -[Si(CH3)2-O]n-: szkielet z naprzemiennych atomów krzemu i tlenu, z dwiema grupami metylowymi na każdym krzemie. Długie wiązania Si-O (około 164 pm) i szerokie kąty Si-O-Si (około 143°) sprawiają, że łańcuch jest bardzo giętki, a mocne wiązanie Si-O czyni go trwałym: pozostaje elastyczny od temperatury zeszklenia blisko −125 °C do znacznie powyżej 200 °C.',
          'Frederic Kipping nazwał je silikonami w 1901 roku, sądząc, że przypominają ketony (R2C=O); nie przypominają, bo krzem nie tworzy z tlenem takiego trwałego wiązania podwójnego, ale nazwa została. Produkuje się je metodą bezpośrednią (Rochow i Müller, początek lat 40. XX wieku): krzem i chlorometan nad miedzią w około 300 °C dają (CH3)2SiCl2, który woda zamienia w łańcuchy. Skacząca masa (1943) to olej silikonowy usieciowany kwasem borowym; jej wiązania pękają i tworzą się na nowo, więc pozostawiona płynie, rzucona odbija się, a szybko pociągnięta pęka.',
        ],
      },
      de: {
        kid: [
          'Nicht ganz! Silicium ist hart und glänzend und zerbricht wie Glas. Eine biegsame Backform ist aus Silikon, und das ist etwas anderes: lange Ketten aus Silicium, Sauerstoff, Silicium, Sauerstoff, an deren Seiten kleine Stücke aus Kohlenstoff und Wasserstoff abstehen. Die Ketten schlängeln sich und gleiten aneinander vorbei, deshalb biegt und dehnt sich Silikon, und es schmilzt nicht im heißen Ofen und bricht nicht im Gefrierfach.',
          'Aus Silikon sind auch Badekappen, die Fuge rund um die Badewanne, weiche Handyhüllen und eine berühmte Spielknete, die wie ein Ball springt, sich wie Kaugummi zieht und reißt, wenn du schnell daran ziehst. Diese Knete wurde 1943 durch Zufall entdeckt, von einem Ingenieur, der Gummi herstellen wollte.',
        ],
        sci: [
          'Die meisten Silikone sind Polydimethylsiloxan, -[Si(CH3)2-O]n-: ein Rückgrat aus abwechselnd Silicium und Sauerstoff, mit zwei Methylgruppen an jedem Silicium. Lange Si-O-Bindungen (etwa 164 pm) und weite Si-O-Si-Winkel (etwa 143°) machen die Kette sehr beweglich, und die starke Si-O-Bindung macht sie beständig: Sie bleibt gummiartig von ihrem Glasübergang bei etwa −125 °C bis weit über 200 °C.',
          'Frederic Kipping nannte sie 1901 Silikone, weil er sie für Verwandte der Ketone (R2C=O) hielt; das sind sie nicht, denn Silicium bildet mit Sauerstoff keine solche stabile Doppelbindung, aber der Name blieb. Hergestellt werden sie mit der Müller-Rochow-Synthese (Anfang der 1940er-Jahre): Silicium und Chlormethan ergeben über Kupfer bei etwa 300 °C (CH3)2SiCl2, das Wasser zu den Ketten umsetzt. Hüpfknete (1943) ist Silikonöl, mit Borsäure vernetzt; ihre Bindungen brechen und bilden sich neu, deshalb fließt sie, wenn man sie liegen lässt, springt, wenn man sie wirft, und reißt, wenn man schnell zieht.',
        ],
      },
    },
  },
]
