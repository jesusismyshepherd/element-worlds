// Carbon's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls, each
// a question that makes you walk up, and the story it opens (Explorer and Scientist). The picture is
// public/boards/C/<id>.svg (no words in it: the title is drawn in the visitor's language). `wing` links
// the story to one of the element's wings.
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'twins',
    color: '#7fd4ff',
    wing: 'allotropes',
    title: {
      en: 'A diamond and a pencil: twins?',
      'pt-pt': 'Um diamante e um lápis: gémeos?',
      pl: 'Diament i ołówek: bliźniaki?',
      de: 'Diamant und Bleistift: Zwillinge?',
    },
    story: {
      en: {
        kid: [
          'Yes! Both are pure carbon. In a diamond every atom holds four neighbours tightly in every direction, so it is the hardest natural material on Earth.',
          'In the grey graphite of a pencil the atoms make flat sheets that slide over each other. That is why a pencil leaves a mark: thin sheets of carbon rub off onto the paper.',
        ],
        sci: [
          'Diamond: every atom sp3-bonded to four others in a tetrahedral network (C-C 154 pm), the hardest natural material (10 on the Mohs scale) and an electrical insulator.',
          'Graphite: sp2 sheets of hexagons (C-C 142 pm) stacked 335 pm apart and held only by weak van der Waals forces, so the layers slide; it is soft, a lubricant, and conducts electricity along the sheets.',
        ],
      },
      'pt-pt': {
        kid: [
          'Sim! Os dois são carbono puro. Num diamante, cada átomo segura com força quatro vizinhos, em todas as direções, e por isso o diamante é o material natural mais duro da Terra.',
          'Na grafite cinzenta de um lápis, os átomos formam folhas planas que deslizam umas sobre as outras. É por isso que o lápis deixa um risco: folhas finas de carbono soltam-se e ficam no papel.',
        ],
        sci: [
          'Diamante: cada átomo, com hibridação sp3, ligado a outros quatro numa rede tetraédrica (C-C 154 pm); o material natural mais duro (10 na escala de Mohs) e um isolador elétrico.',
          'Grafite: folhas sp2 de hexágonos (C-C 142 pm) empilhadas a 335 pm umas das outras e unidas só por fracas forças de van der Waals, por isso as camadas deslizam; é macia, serve de lubrificante e conduz a eletricidade ao longo das folhas.',
        ],
      },
      pl: {
        kid: [
          'Tak! Oba to czysty węgiel. W diamencie każdy atom mocno trzyma czterech sąsiadów we wszystkich kierunkach, dlatego diament jest najtwardszym naturalnym materiałem na Ziemi.',
          'W szarym graficie ołówka atomy tworzą płaskie warstwy, które ślizgają się po sobie. Dlatego ołówek zostawia ślad: cienkie warstwy węgla ścierają się i zostają na papierze.',
        ],
        sci: [
          'Diament: każdy atom w hybrydyzacji sp3 związany z czterema innymi w sieci tetraedrycznej (C-C 154 pm); najtwardszy naturalny materiał (10 w skali Mohsa) i izolator elektryczny.',
          'Grafit: warstwy sześciokątów sp2 (C-C 142 pm) ułożone w stos co 335 pm i utrzymywane tylko przez słabe siły van der Waalsa, więc warstwy się ślizgają; jest miękki, służy jako smar i przewodzi prąd wzdłuż warstw.',
        ],
      },
      de: {
        kid: [
          'Ja! Beide sind reiner Kohlenstoff. In einem Diamanten hält jedes Atom vier Nachbarn ganz fest, in alle Richtungen, deshalb ist er das härteste natürliche Material der Erde.',
          'Im grauen Graphit eines Bleistifts bilden die Atome flache Schichten, die übereinander gleiten. Deshalb hinterlässt ein Bleistift einen Strich: Dünne Schichten Kohlenstoff reiben sich ab und bleiben auf dem Papier.',
        ],
        sci: [
          'Diamant: jedes Atom sp3-hybridisiert an vier andere gebunden, in einem tetraedrischen Netzwerk (C-C 154 pm); das härteste natürliche Material (10 auf der Mohs-Skala) und ein elektrischer Isolator.',
          'Graphit: sp2-Schichten aus Sechsecken (C-C 142 pm), im Abstand von 335 pm gestapelt und nur von schwachen Van-der-Waals-Kräften gehalten, deshalb gleiten die Schichten; er ist weich, ein Schmiermittel und leitet Strom entlang der Schichten.',
        ],
      },
    },
  },
  {
    id: 'you',
    color: '#ff9fb2',
    wing: 'life',
    title: {
      en: 'What are you made of?',
      'pt-pt': 'De que é feito o teu corpo?',
      pl: 'Z czego się składasz?',
      de: 'Woraus bestehst du?',
    },
    story: {
      en: {
        kid: [
          'About 18% of your weight is carbon. Only oxygen weighs more in you, because you are mostly water.',
          'Your muscles, hair, skin and even your DNA are long chains and rings of carbon atoms holding hands. No other element builds chains that long and that strong.',
        ],
        sci: [
          'By mass the human body is about 65% oxygen, 18% carbon, 10% hydrogen and 3% nitrogen.',
          'Proteins, fats, sugars and nucleic acids all have carbon skeletons: carbon forms four stable covalent bonds, including to itself, so it can build chains, branches and rings of almost any length.',
        ],
      },
      'pt-pt': {
        kid: [
          'Cerca de 18% do teu peso é carbono. Só o oxigénio pesa mais em ti, porque o teu corpo é sobretudo água.',
          'Os teus músculos, o teu cabelo, a tua pele e até o teu ADN são longas cadeias e anéis de átomos de carbono de mãos dadas. Nenhum outro elemento constrói cadeias tão longas e tão fortes.',
        ],
        sci: [
          'Em massa, o corpo humano tem cerca de 65% de oxigénio, 18% de carbono, 10% de hidrogénio e 3% de azoto.',
          'Proteínas, gorduras, açúcares e ácidos nucleicos têm todos esqueletos de carbono: o carbono forma quatro ligações covalentes estáveis, também consigo próprio, e por isso pode construir cadeias, ramificações e anéis de quase qualquer comprimento.',
        ],
      },
      pl: {
        kid: [
          'Około 18% twojej wagi to węgiel. Tylko tlen waży w tobie więcej, bo składasz się głównie z wody.',
          'Twoje mięśnie, włosy, skóra, a nawet DNA to długie łańcuchy i pierścienie atomów węgla, które trzymają się za ręce. Żaden inny pierwiastek nie buduje tak długich i tak mocnych łańcuchów.',
        ],
        sci: [
          'Pod względem masy ciało człowieka to około 65% tlenu, 18% węgla, 10% wodoru i 3% azotu.',
          'Białka, tłuszcze, cukry i kwasy nukleinowe mają szkielety węglowe: węgiel tworzy cztery trwałe wiązania kowalencyjne, także z samym sobą, więc może budować łańcuchy, rozgałęzienia i pierścienie niemal dowolnej długości.',
        ],
      },
      de: {
        kid: [
          'Etwa 18% deines Gewichts sind Kohlenstoff. Nur Sauerstoff wiegt in dir mehr, weil du vor allem aus Wasser bestehst.',
          'Deine Muskeln, deine Haare, deine Haut und sogar deine DNA sind lange Ketten und Ringe aus Kohlenstoffatomen, die sich an den Händen halten. Kein anderes Element baut so lange und so starke Ketten.',
        ],
        sci: [
          'Nach Masse besteht der menschliche Körper zu etwa 65% aus Sauerstoff, zu 18% aus Kohlenstoff, zu 10% aus Wasserstoff und zu 3% aus Stickstoff.',
          'Proteine, Fette, Zucker und Nukleinsäuren haben alle ein Kohlenstoffgerüst: Kohlenstoff bildet vier stabile kovalente Bindungen, auch mit sich selbst, und kann so Ketten, Verzweigungen und Ringe fast jeder Länge bauen.',
        ],
      },
    },
  },
  {
    id: 'leaf',
    color: '#8be37a',
    wing: 'life',
    title: {
      en: 'Plants eat air!',
      'pt-pt': 'As plantas comem ar!',
      pl: 'Rośliny jedzą powietrze!',
      de: 'Pflanzen essen Luft!',
    },
    story: {
      en: {
        kid: [
          'A tree is built mostly out of air. Its leaves take in carbon dioxide, and with the energy of sunlight they keep the carbon to make sugar and wood and let the oxygen go.',
          'Almost half the weight of a dry log is carbon that once floated in the air.',
        ],
        sci: [
          'Photosynthesis: 6 CO2 + 6 H2O + light → C6H12O6 + 6 O2. The carbon is fixed by the enzyme RuBisCO, often called the most abundant protein on Earth.',
          'Dry wood is about 50% carbon by mass, nearly all of it taken from atmospheric CO2.',
        ],
      },
      'pt-pt': {
        kid: [
          'Uma árvore é feita sobretudo de ar. As folhas absorvem dióxido de carbono e, com a energia da luz do Sol, ficam com o carbono para fazer açúcar e madeira e deixam o oxigénio sair.',
          'Quase metade do peso de um tronco seco é carbono que, em tempos, andou a flutuar no ar.',
        ],
        sci: [
          'Fotossíntese: 6 CO2 + 6 H2O + luz → C6H12O6 + 6 O2. O carbono é fixado pela enzima RuBisCO, muitas vezes apontada como a proteína mais abundante da Terra.',
          'A madeira seca tem cerca de 50% de carbono em massa, quase todo retirado do CO2 da atmosfera.',
        ],
      },
      pl: {
        kid: [
          'Drzewo jest zbudowane głównie z powietrza. Jego liście pobierają dwutlenek węgla i dzięki energii światła słonecznego zatrzymują węgiel, żeby zrobić z niego cukier i drewno, a tlen wypuszczają.',
          'Prawie połowa wagi suchego polana to węgiel, który kiedyś unosił się w powietrzu.',
        ],
        sci: [
          'Fotosynteza: 6 CO2 + 6 H2O + światło → C6H12O6 + 6 O2. Węgiel jest wiązany przez enzym RuBisCO, często nazywany najpowszechniejszym białkiem na Ziemi.',
          'Suche drewno zawiera około 50% węgla (masowo), prawie w całości pobranego z atmosferycznego CO2.',
        ],
      },
      de: {
        kid: [
          'Ein Baum ist vor allem aus Luft gebaut. Seine Blätter nehmen Kohlenstoffdioxid auf, und mit der Energie des Sonnenlichts behalten sie den Kohlenstoff, machen daraus Zucker und Holz und lassen den Sauerstoff frei.',
          'Fast die Hälfte des Gewichts eines trockenen Holzscheits ist Kohlenstoff, der einmal in der Luft geschwebt ist.',
        ],
        sci: [
          'Fotosynthese: 6 CO2 + 6 H2O + Licht → C6H12O6 + 6 O2. Der Kohlenstoff wird vom Enzym RuBisCO fixiert, das oft als das häufigste Protein der Erde bezeichnet wird.',
          'Trockenes Holz besteht nach Masse zu etwa 50% aus Kohlenstoff, der fast ganz aus dem CO2 der Atmosphäre stammt.',
        ],
      },
    },
  },
  {
    id: 'stars',
    color: '#ffb347',
    title: {
      en: 'Made inside a giant star',
      'pt-pt': 'Feito dentro de uma estrela gigante',
      pl: 'Zrodzony w olbrzymiej gwieździe',
      de: 'Entstanden in einem Riesenstern',
    },
    story: {
      en: {
        kid: [
          'Every carbon atom was cooked inside an old giant star, where three helium atoms crashed together and became one carbon atom.',
          'When those stars puffed away their outer layers, the carbon drifted through space and ended up in the Sun, the Earth and you.',
        ],
        sci: [
          'Carbon-12 forms in the helium-burning cores of red giants by the triple-alpha process: 4He + 4He ⇌ 8Be, then 8Be + 4He → 12C, through the Hoyle resonance of carbon-12 at 7.65 MeV.',
          'Stellar winds and planetary nebulae spread the carbon into the interstellar medium, where new stars and planets form.',
        ],
      },
      'pt-pt': {
        kid: [
          'Cada átomo de carbono foi cozinhado dentro de uma velha estrela gigante, onde três átomos de hélio chocaram uns com os outros e se tornaram um só átomo de carbono.',
          'Quando essas estrelas sopraram para longe as suas camadas de fora, o carbono andou à deriva pelo espaço e foi parar ao Sol, à Terra e a ti.',
        ],
        sci: [
          'O carbono-12 forma-se nos núcleos das gigantes vermelhas, onde se dá a queima do hélio, pelo processo triplo-alfa: 4He + 4He ⇌ 8Be, depois 8Be + 4He → 12C, através da ressonância de Hoyle do carbono-12 a 7,65 MeV.',
          'Os ventos estelares e as nebulosas planetárias espalham o carbono pelo meio interestelar, onde se formam novas estrelas e novos planetas.',
        ],
      },
      pl: {
        kid: [
          'Każdy atom węgla upiekł się we wnętrzu starej olbrzymiej gwiazdy, gdzie trzy atomy helu zderzyły się ze sobą i stały się jednym atomem węgla.',
          'Kiedy te gwiazdy zdmuchnęły swoje zewnętrzne warstwy, węgiel dryfował przez kosmos i trafił do Słońca, do Ziemi i do ciebie.',
        ],
        sci: [
          'Węgiel-12 powstaje w jądrach czerwonych olbrzymów, w których spala się hel, w procesie potrójnej alfa: 4He + 4He ⇌ 8Be, a następnie 8Be + 4He → 12C, poprzez rezonans Hoyle’a węgla-12 o energii 7,65 MeV.',
          'Wiatry gwiazdowe i mgławice planetarne rozprowadzają węgiel w ośrodku międzygwiazdowym, gdzie powstają nowe gwiazdy i planety.',
        ],
      },
      de: {
        kid: [
          'Jedes Kohlenstoffatom wurde im Inneren eines alten Riesensterns gekocht, wo drei Heliumatome zusammenkrachten und zu einem einzigen Kohlenstoffatom wurden.',
          'Als diese Sterne ihre äußeren Schichten wegpusteten, trieb der Kohlenstoff durchs All und landete in der Sonne, in der Erde und in dir.',
        ],
        sci: [
          'Kohlenstoff-12 entsteht in den heliumbrennenden Kernen Roter Riesen durch den Drei-Alpha-Prozess: 4He + 4He ⇌ 8Be, dann 8Be + 4He → 12C, über die Hoyle-Resonanz von Kohlenstoff-12 bei 7,65 MeV.',
          'Sternwinde und planetarische Nebel verteilen den Kohlenstoff im interstellaren Medium, wo neue Sterne und Planeten entstehen.',
        ],
      },
    },
  },
  {
    id: 'clock',
    color: '#e8c07a',
    title: {
      en: 'A clock inside every bone',
      'pt-pt': 'Um relógio dentro de cada osso',
      pl: 'Zegar w każdej kości',
      de: 'Eine Uhr in jedem Knochen',
    },
    story: {
      en: {
        kid: [
          'A few carbon atoms in every living thing are carbon-14, a kind that slowly disappears. While you live, you keep taking in new ones with your food.',
          'After death no new ones come in, and half of them are gone every 5730 years. Count what is left and you know how old a bone, a piece of wood or a mummy is.',
        ],
        sci: [
          '14C (half-life 5730 years) is made by cosmic rays in the upper atmosphere, so living things carry about 1.2 atoms of 14C per trillion carbon atoms.',
          'After death the 14C decays; accelerator mass spectrometry counts the remaining atoms and dates samples back to about 50 000 years (Willard Libby, Nobel Prize in Chemistry 1960).',
        ],
      },
      'pt-pt': {
        kid: [
          'Em todos os seres vivos, alguns átomos de carbono são carbono-14, um tipo que vai desaparecendo devagar. Enquanto vives, continuas a receber átomos novos com a comida.',
          'Depois da morte já não entram átomos novos, e metade deles desaparece a cada 5730 anos. Conta os que restam e ficas a saber a idade de um osso, de um pedaço de madeira ou de uma múmia.',
        ],
        sci: [
          'O 14C (meia-vida de 5730 anos) é produzido pelos raios cósmicos na alta atmosfera, por isso os seres vivos têm cerca de 1,2 átomos de 14C por cada bilião de átomos de carbono.',
          'Depois da morte o 14C decai; a espectrometria de massa com acelerador conta os átomos que restam e data amostras até cerca de 50 000 anos (Willard Libby, Prémio Nobel da Química de 1960).',
        ],
      },
      pl: {
        kid: [
          'Kilka atomów węgla w każdej żywej istocie to węgiel-14, rodzaj, który powoli znika. Dopóki żyjesz, wciąż pobierasz nowe razem z jedzeniem.',
          'Po śmierci nowe już nie przybywają, a co 5730 lat znika połowa z nich. Policz, ile zostało, a będziesz wiedzieć, ile lat ma kość, kawałek drewna albo mumia.',
        ],
        sci: [
          '14C (okres półtrwania 5730 lat) powstaje pod wpływem promieniowania kosmicznego w górnych warstwach atmosfery, więc organizmy żywe zawierają około 1,2 atomu 14C na bilion atomów węgla.',
          'Po śmierci 14C się rozpada; akceleratorowa spektrometria mas liczy pozostałe atomy i pozwala datować próbki do około 50 000 lat wstecz (Willard Libby, Nagroda Nobla w dziedzinie chemii 1960).',
        ],
      },
      de: {
        kid: [
          'Ein paar Kohlenstoffatome in jedem Lebewesen sind Kohlenstoff-14, eine Sorte, die langsam verschwindet. Solange du lebst, nimmst du mit dem Essen immer neue auf.',
          'Nach dem Tod kommen keine neuen mehr dazu, und alle 5730 Jahre verschwindet die Hälfte. Zähl, was übrig ist, und du weißt, wie alt ein Knochen, ein Stück Holz oder eine Mumie ist.',
        ],
        sci: [
          '14C (Halbwertszeit 5730 Jahre) entsteht durch kosmische Strahlung in der oberen Atmosphäre, deshalb tragen Lebewesen etwa 1,2 Atome 14C pro Billion Kohlenstoffatome in sich.',
          'Nach dem Tod zerfällt das 14C; die Beschleuniger-Massenspektrometrie zählt die verbliebenen Atome und datiert Proben bis etwa 50 000 Jahre zurück (Willard Libby, Nobelpreis für Chemie 1960).',
        ],
      },
    },
  },
  {
    id: 'football',
    color: '#c3a6ff',
    wing: 'allotropes',
    title: {
      en: 'A molecule shaped like a football',
      'pt-pt': 'Uma molécula em forma de bola de futebol',
      pl: 'Cząsteczka w kształcie piłki nożnej',
      de: 'Ein Molekül in Form eines Fußballs',
    },
    story: {
      en: {
        kid: [
          'In 1985 scientists found 60 carbon atoms joined into a perfect hollow ball, with the same pattern of pentagons and hexagons as a football. They called it the buckyball.',
          'Rolled up, a sheet of carbon makes a tube tens of thousands of times thinner than a hair, and stronger than steel.',
        ],
        sci: [
          'C60 (buckminsterfullerene): 60 atoms at the corners of a truncated icosahedron, 12 pentagons and 20 hexagons, about 0.7 nm across; Kroto, Curl and Smalley, Nobel Prize in Chemistry 1996.',
          'Carbon nanotubes, rolled-up graphene about 1 nm wide, are among the stiffest and strongest materials ever measured.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em 1985, os cientistas descobriram 60 átomos de carbono unidos numa bola oca perfeita, com o mesmo padrão de pentágonos e hexágonos de uma bola de futebol. Chamaram-lhe buckyball.',
          'Enrolada, uma folha de carbono forma um tubo dezenas de milhares de vezes mais fino do que um cabelo, e mais forte do que o aço.',
        ],
        sci: [
          'C60 (buckminsterfulereno): 60 átomos nos vértices de um icosaedro truncado, 12 pentágonos e 20 hexágonos, com cerca de 0,7 nm de diâmetro; Kroto, Curl e Smalley, Prémio Nobel da Química de 1996.',
          'Os nanotubos de carbono, grafeno enrolado com cerca de 1 nm de largura, estão entre os materiais mais rígidos e mais resistentes alguma vez medidos.',
        ],
      },
      pl: {
        kid: [
          'W 1985 roku naukowcy odkryli 60 atomów węgla połączonych w idealną kulę, pustą w środku, z takim samym wzorem pięciokątów i sześciokątów jak na piłce nożnej. Nazwali ją buckyball.',
          'Zwinięta warstwa węgla tworzy rurkę dziesiątki tysięcy razy cieńszą od włosa i mocniejszą od stali.',
        ],
        sci: [
          'C60 (buckminsterfuleren): 60 atomów w wierzchołkach dwudziestościanu ściętego, 12 pięciokątów i 20 sześciokątów, średnica około 0,7 nm; Kroto, Curl i Smalley, Nagroda Nobla w dziedzinie chemii 1996.',
          'Nanorurki węglowe, zwinięty grafen o szerokości około 1 nm, należą do najsztywniejszych i najwytrzymalszych materiałów, jakie kiedykolwiek zmierzono.',
        ],
      },
      de: {
        kid: [
          '1985 entdeckten Forscher 60 Kohlenstoffatome, die zu einem perfekten hohlen Ball verbunden waren, mit demselben Muster aus Fünfecken und Sechsecken wie ein Fußball. Sie nannten ihn Buckyball.',
          'Zusammengerollt wird eine Kohlenstoffschicht zu einer Röhre, zehntausende Male dünner als ein Haar und fester als Stahl.',
        ],
        sci: [
          'C60 (Buckminsterfulleren): 60 Atome an den Ecken eines Ikosaederstumpfs, 12 Fünfecke und 20 Sechsecke, etwa 0,7 nm im Durchmesser; Kroto, Curl und Smalley, Nobelpreis für Chemie 1996.',
          'Kohlenstoffnanoröhren, aufgerolltes Graphen von etwa 1 nm Breite, gehören zu den steifsten und festesten Materialien, die je gemessen wurden.',
        ],
      },
    },
  },
  {
    id: 'sky',
    color: '#ff8a5c',
    title: {
      en: 'The carbon in the sky',
      'pt-pt': 'O carbono no céu',
      pl: 'Węgiel na niebie',
      de: 'Der Kohlenstoff am Himmel',
    },
    story: {
      en: {
        kid: [
          'Coal, oil and gas are made from plants and tiny sea creatures that lived millions of years ago, so they are full of carbon.',
          'Burning them puts that carbon back into the air as carbon dioxide, which keeps heat in like a blanket and is warming the Earth.',
        ],
        sci: [
          'Atmospheric CO2 has risen from about 280 ppm before the industrial age to more than 420 ppm, mostly from burning fossil fuels.',
          'CO2 absorbs the infrared light the Earth gives off (strongly around 15 µm), which makes it the main human-made driver of global warming.',
        ],
      },
      'pt-pt': {
        kid: [
          'O carvão, o petróleo e o gás são feitos de plantas e de seres marinhos minúsculos que viveram há milhões de anos, por isso estão cheios de carbono.',
          'Quando os queimamos, esse carbono volta ao ar como dióxido de carbono, que segura o calor como um cobertor e está a aquecer a Terra.',
        ],
        sci: [
          'O CO2 da atmosfera subiu de cerca de 280 ppm, antes da era industrial, para mais de 420 ppm, sobretudo devido à queima de combustíveis fósseis.',
          'O CO2 absorve a luz infravermelha que a Terra emite (fortemente por volta dos 15 µm), o que faz dele o principal fator de origem humana do aquecimento global.',
        ],
      },
      pl: {
        kid: [
          'Węgiel kamienny, ropa i gaz powstały z roślin i malutkich morskich stworzeń, które żyły miliony lat temu, więc są pełne węgla.',
          'Kiedy je spalamy, ten węgiel wraca do powietrza jako dwutlenek węgla, który zatrzymuje ciepło jak koc i ogrzewa Ziemię.',
        ],
        sci: [
          'Stężenie CO2 w atmosferze wzrosło z około 280 ppm przed epoką przemysłową do ponad 420 ppm, głównie przez spalanie paliw kopalnych.',
          'CO2 pochłania promieniowanie podczerwone wysyłane przez Ziemię (silnie w okolicy 15 µm), co czyni go głównym antropogenicznym czynnikiem globalnego ocieplenia.',
        ],
      },
      de: {
        kid: [
          'Kohle, Erdöl und Erdgas sind aus Pflanzen und winzigen Meerestieren entstanden, die vor Millionen von Jahren lebten, deshalb stecken sie voller Kohlenstoff.',
          'Wenn wir sie verbrennen, kommt dieser Kohlenstoff als Kohlenstoffdioxid zurück in die Luft, das die Wärme festhält wie eine Decke und die Erde erwärmt.',
        ],
        sci: [
          'Das CO2 in der Atmosphäre ist von etwa 280 ppm vor dem Industriezeitalter auf mehr als 420 ppm gestiegen, vor allem durch das Verbrennen fossiler Brennstoffe.',
          'CO2 absorbiert das Infrarotlicht, das die Erde abstrahlt (stark um 15 µm), und ist dadurch der wichtigste vom Menschen verursachte Treiber der Erderwärmung.',
        ],
      },
    },
  },
]
