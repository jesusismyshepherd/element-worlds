// Germanium's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls, each a
// question that makes you walk up, and the story it opens (Explorer and Scientist). Germanium has no wing
// yet; the pictures leave alone what is told elsewhere: its Atomling's flag (named after Germany), and
// silicon's 'valley' (germanium was the first transistors' material and why silicon won: 'transistor' here
// is the 1947 device itself, not that race). Pictures: public/boards/Ge/<id>.svg, drawn by tools/boards/Ge/
// (no words in them: the title is drawn in the visitor's language). Each picture has a room designed for it
// (docs/agents/designs/Ge_rooms.md).
// Sources: Mendeleev, J. Russ. Chem. Soc. 3 (1871) and Winkler, Ber. 19, 210 (1886) as tabled in the
// Wikipedia article "Germanium"; Riordan and Hoddeson, Crystal Fire (1997) and the Computer History Museum
// on the point-contact transistor; Wien's law; GERDA, Phys. Rev. Lett. 125, 252502 (2020); LEGEND-200 at
// the Laboratori Nazionali del Gran Sasso; TeleGeography's submarine cable map; the Mars Exploration Rovers'
// GaInP/GaAs/Ge cells; Maestro FZ-1 (Gibson, 1962; Snoddy and Hobbs, US patent 3,213,181).
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'predicted',
    color: '#ffb347',
    title: {
      en: 'Can you predict a new element?',
      'pt-pt': 'É possível prever um elemento novo?',
      pl: 'Czy można przewidzieć pierwiastek?',
      de: 'Kann man ein Element vorhersagen?',
    },
    story: {
      en: {
        kid: [
          'In 1869 Dmitri Mendeleev, in Russia, laid out all the elements known then in a table, by the weight of their atoms and by how they behave. Where no known element fitted, he left a gap and said: something belongs here that nobody has found yet. Under silicon was one such gap. He called the missing element eka-silicon, “one after silicon”, and in 1871 he described it: grey, its atom about 72 times as heavy as a hydrogen atom, about five and a half times as heavy as water.',
          'Fifteen years later, in 1886, the chemist Clemens Winkler in Freiberg, Germany, studied a new silver mineral, and his sums came to only about 93 parts out of 100: something was missing. It was a new element, and he named it germanium after his country. It was almost exactly what Mendeleev had described, and after that people trusted the periodic table.',
        ],
        sci: [
          'Mendeleev placed eka-silicon from its neighbours, silicon above, tin below and arsenic beside it (on its other side was another gap, eka-aluminium), and in 1871 predicted an atomic weight of 72, a density of 5.5 g/cm³, a high melting point, a dirty grey colour, a dioxide EsO2 of density 4.7 and a volatile tetrachloride EsCl4 boiling below 100 °C, of density 1.9. His eka-aluminium (gallium, 1875) and eka-boron (scandium, 1879) were found first.',
          'In 1885 a new silver mineral, argyrodite (Ag8GeS6), turned up in the Himmelsfürst mine near Freiberg. Clemens Winkler at the Freiberg Bergakademie found that his analysis added up to only about 93%, and on 6 February 1886 announced the missing element; he first thought of calling it neptunium. His germanium: atomic weight 72.3 (today 72.63), density 5.35 g/cm³, GeO2 of density 4.7, GeCl4 boiling at 86 °C with density 1.9. No other prediction of the table came true in so much detail.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em 1869, Dmitri Mendeleev, na Rússia, arrumou todos os elementos conhecidos na altura numa tabela, pelo peso dos seus átomos e pela maneira como se comportam. Onde nenhum elemento conhecido cabia, deixou um espaço vazio e disse: aqui há um elemento que ainda ninguém encontrou. Por baixo do silício havia um desses espaços. Chamou ao elemento em falta eka-silício, “o que vem a seguir ao silício”, e em 1871 descreveu-o: cinzento, com um átomo cerca de 72 vezes mais pesado do que um átomo de hidrogénio, cerca de cinco vezes e meia mais pesado do que a água.',
          'Quinze anos depois, em 1886, o químico Clemens Winkler, em Freiberg, na Alemanha, estudou um mineral de prata novo, e as suas contas só davam cerca de 93 partes em 100: faltava alguma coisa. Era um elemento novo, e deu-lhe o nome de germânio, em honra do seu país. Era quase exatamente o que Mendeleev tinha descrito, e a partir daí as pessoas passaram a confiar na tabela periódica.',
        ],
        sci: [
          'Mendeleev situou o eka-silício pelos vizinhos, o silício por cima, o estanho por baixo e o arsénio ao lado (do outro lado havia outro espaço vazio, o eka-alumínio), e em 1871 previu uma massa atómica de 72, uma densidade de 5,5 g/cm³, um ponto de fusão elevado, uma cor cinzento-sujo, um dióxido EsO2 de densidade 4,7 e um tetracloreto volátil EsCl4 a ferver abaixo de 100 °C, de densidade 1,9. O seu eka-alumínio (gálio, 1875) e o eka-boro (escândio, 1879) foram encontrados primeiro.',
          'Em 1885 apareceu um mineral de prata novo, a argirodite (Ag8GeS6), na mina Himmelsfürst, perto de Freiberg. Clemens Winkler, na Bergakademie de Freiberg, viu que a sua análise só somava cerca de 93% e, a 6 de fevereiro de 1886, anunciou o elemento em falta; primeiro pensou chamar-lhe netúnio. O seu germânio: massa atómica 72,3 (hoje 72,63), densidade 5,35 g/cm³, GeO2 de densidade 4,7, GeCl4 a ferver a 86 °C, com densidade 1,9. Nenhuma outra previsão da tabela se confirmou com tanto pormenor.',
        ],
      },
      pl: {
        kid: [
          'W 1869 roku Dmitrij Mendelejew w Rosji ułożył wszystkie znane wtedy pierwiastki w tabelę, według masy ich atomów i tego, jak się zachowują. Tam, gdzie nie pasował żaden znany pierwiastek, zostawił puste miejsce i powiedział: tu jest coś, czego jeszcze nikt nie znalazł. Pod krzemem była jedna taka luka. Brakujący pierwiastek nazwał ekakrzemem, „tym po krzemie”, i w 1871 roku go opisał: szary, z atomem około 72 razy cięższym od atomu wodoru, około pięć i pół raza cięższy od wody.',
          'Piętnaście lat później, w 1886 roku, chemik Clemens Winkler we Freibergu w Niemczech badał nowy minerał srebra, a jego rachunki dawały tylko około 93 części na 100: czegoś brakowało. Był to nowy pierwiastek, który nazwał germanem na cześć swojego kraju. Był prawie dokładnie taki, jak opisał go Mendelejew, i od tej pory ludzie zaufali układowi okresowemu.',
        ],
        sci: [
          'Mendelejew umieścił ekakrzem według jego sąsiadów, krzemu nad nim, cyny pod nim i arsenu obok (po drugiej stronie była kolejna luka, ekaglin), i w 1871 roku przewidział masę atomową 72, gęstość 5,5 g/cm³, wysoką temperaturę topnienia, brudnoszary kolor, dwutlenek EsO2 o gęstości 4,7 i lotny czterochlorek EsCl4 wrzący poniżej 100 °C, o gęstości 1,9. Jego ekaglin (gal, 1875) i ekabor (skand, 1879) odkryto wcześniej.',
          'W 1885 roku w kopalni Himmelsfürst koło Freibergu pojawił się nowy minerał srebra, argyrodyt (Ag8GeS6). Clemens Winkler z Bergakademie we Freibergu stwierdził, że jego analiza sumuje się tylko do około 93%, i 6 lutego 1886 roku ogłosił odkrycie brakującego pierwiastka; najpierw chciał go nazwać neptunem. Jego german: masa atomowa 72,3 (dziś 72,63), gęstość 5,35 g/cm³, GeO2 o gęstości 4,7, GeCl4 wrzący w 86 °C, o gęstości 1,9. Żadne inne przewidywanie układu okresowego nie sprawdziło się tak szczegółowo.',
        ],
      },
      de: {
        kid: [
          '1869 ordnete Dmitri Mendelejew in Russland alle damals bekannten Elemente in einer Tabelle, nach dem Gewicht ihrer Atome und danach, wie sie sich verhalten. Wo kein bekanntes Element hinpasste, ließ er eine Lücke und sagte: Hier gehört etwas hin, das noch niemand gefunden hat. Unter dem Silicium war so eine Lücke. Das fehlende Element nannte er Eka-Silicium, „das nach dem Silicium“, und 1871 beschrieb er es: grau, sein Atom etwa 72-mal so schwer wie ein Wasserstoffatom, etwa fünfeinhalbmal so schwer wie Wasser.',
          'Fünfzehn Jahre später, 1886, untersuchte der Chemiker Clemens Winkler in Freiberg in Deutschland ein neues Silbermineral, und seine Rechnung ergab nur etwa 93 von 100 Teilen: Es fehlte etwas. Es war ein neues Element, und er nannte es nach seinem Land Germanium. Es war fast genau so, wie Mendelejew es beschrieben hatte, und von da an vertrauten die Leute dem Periodensystem.',
        ],
        sci: [
          'Mendelejew bestimmte das Eka-Silicium aus seinen Nachbarn, Silicium darüber, Zinn darunter und Arsen daneben (auf der anderen Seite war eine weitere Lücke, das Eka-Aluminium), und sagte 1871 eine Atommasse von 72 voraus, eine Dichte von 5,5 g/cm³, einen hohen Schmelzpunkt, eine schmutzig graue Farbe, ein Dioxid EsO2 der Dichte 4,7 und ein flüchtiges Tetrachlorid EsCl4, das unter 100 °C siedet, mit der Dichte 1,9. Sein Eka-Aluminium (Gallium, 1875) und Eka-Bor (Scandium, 1879) wurden zuerst gefunden.',
          '1885 tauchte in der Grube Himmelsfürst bei Freiberg ein neues Silbermineral auf, der Argyrodit (Ag8GeS6). Clemens Winkler an der Bergakademie Freiberg stellte fest, dass seine Analyse nur etwa 93% ergab, und gab am 6. Februar 1886 das fehlende Element bekannt; zuerst wollte er es Neptunium nennen. Sein Germanium: Atommasse 72,3 (heute 72,63), Dichte 5,35 g/cm³, GeO2 der Dichte 4,7, GeCl4 siedet bei 86 °C, Dichte 1,9. Keine andere Vorhersage des Periodensystems traf so genau ein.',
        ],
      },
    },
  },
  {
    id: 'transistor',
    color: '#6fd0ff',
    title: {
      en: 'How was the first transistor made?',
      'pt-pt': 'Como se fez o primeiro transístor?',
      pl: 'Jak zrobiono pierwszy tranzystor?',
      de: 'Wie entstand der erste Transistor?',
    },
    story: {
      en: {
        kid: [
          'Before 1947, radios and the very first computers ran on vacuum tubes: glass bulbs that glowed hot like little lamps, used a lot of electricity and burned out. At Bell Labs in America, John Bardeen and Walter Brattain looked for something small and solid that could do a tube’s job: take a weak electric signal and make it strong.',
          'In December 1947 they pressed two tiny points of gold, closer together than the thickness of a sheet of paper, onto a little block of germanium, held down by a spring. A small current into one point controlled a much bigger current through the other. They spoke into a microphone and heard their voices come out louder in the headphones. It was the first transistor, the great-great-grandparent of the tiny switches in every computer and phone.',
        ],
        sci: [
          'The point-contact transistor: Brattain wrapped gold foil round the edge of a polystyrene triangle, slit it at the tip with a razor blade, and pressed the two contacts, about 50 µm apart, onto a slab of n-type germanium on a metal base with a spring. Current into one contact, the emitter, injects holes into a thin layer at the germanium’s surface; collected at the other contact, they change its current, so a small signal at the emitter makes a larger one at the collector.',
          'It first gave power gain on 16 December 1947 and amplified speech for Bell Labs’ managers on 23 December; the public heard of it on 30 June 1948, by a name John R. Pierce made from “transfer resistor”. William Shockley’s junction transistor followed (its theory in 1948, the first one working in 1951), and the three men shared the 1956 Nobel Prize in Physics. Germanium was chosen because during the war people had learnt to make it purer than any other semiconductor, for radar detectors.',
        ],
      },
      'pt-pt': {
        kid: [
          'Antes de 1947, os rádios e os primeiros computadores funcionavam com válvulas: lâmpadas de vidro que ficavam quentes e acesas como pequenos candeeiros, gastavam muita eletricidade e fundiam-se. Nos Bell Labs, nos Estados Unidos, John Bardeen e Walter Brattain procuravam uma coisa pequena e sólida que fizesse o trabalho de uma válvula: pegar num sinal elétrico fraco e torná-lo forte.',
          'Em dezembro de 1947 encostaram duas pontinhas de ouro, mais próximas uma da outra do que a espessura de uma folha de papel, a um pequeno bloco de germânio, apertadas por uma mola. Uma corrente pequena numa das pontas controlava uma corrente muito maior na outra. Falaram para um microfone e ouviram as suas vozes mais altas nos auscultadores. Era o primeiro transístor, o trisavô dos minúsculos interruptores de todos os computadores e telemóveis.',
        ],
        sci: [
          'O transístor de contacto pontual: Brattain enrolou folha de ouro à volta da aresta de um triângulo de poliestireno, cortou-a na ponta com uma lâmina de barbear e apertou os dois contactos, a cerca de 50 µm um do outro, com uma mola contra uma placa de germânio do tipo n assente numa base de metal. A corrente num contacto, o emissor, injeta lacunas numa camada fina à superfície do germânio; recolhidas no outro contacto, alteram a sua corrente, e assim um sinal pequeno no emissor dá um sinal maior no coletor.',
          'Deu ganho de potência pela primeira vez a 16 de dezembro de 1947 e amplificou a fala diante dos diretores dos Bell Labs a 23 de dezembro; o público soube dele a 30 de junho de 1948, com um nome que John R. Pierce tirou de “transfer resistor”. Seguiu-se o transístor de junção de William Shockley (a teoria em 1948, o primeiro a funcionar em 1951), e os três partilharam o Prémio Nobel da Física de 1956. Escolheu-se o germânio porque durante a guerra se tinha aprendido a fazê-lo mais puro do que qualquer outro semicondutor, para os detetores de radar.',
        ],
      },
      pl: {
        kid: [
          'Przed 1947 rokiem radia i pierwsze komputery działały na lampach elektronowych: szklanych bańkach, które świeciły i grzały się jak małe lampki, zużywały dużo prądu i się przepalały. W Bell Labs w Ameryce John Bardeen i Walter Brattain szukali czegoś małego i litego, co zrobiłoby to samo co lampa: wzięło słaby sygnał elektryczny i zrobiło z niego silny.',
          'W grudniu 1947 roku przycisnęli dwa malutkie złote ostrza, bliżej siebie niż grubość kartki papieru, do małego bloczka germanu, dociskając je sprężynką. Mały prąd płynący przez jedno ostrze sterował dużo większym prądem w drugim. Mówili do mikrofonu i słyszeli w słuchawkach swoje głosy głośniej. To był pierwszy tranzystor, prapradziadek malutkich przełączników w każdym komputerze i telefonie.',
        ],
        sci: [
          'Tranzystor ostrzowy: Brattain owinął złotą folią krawędź trójkąta z polistyrenu, przeciął ją na czubku żyletką i sprężyną docisnął oba styki, odległe o około 50 µm, do płytki germanu typu n na metalowej podstawie. Prąd płynący do jednego styku, emitera, wstrzykuje dziury do cienkiej warstwy przy powierzchni germanu; zebrane przy drugim styku zmieniają jego prąd, więc mały sygnał na emiterze daje większy na kolektorze.',
          'Pierwsze wzmocnienie mocy dał 16 grudnia 1947 roku, a 23 grudnia wzmocnił mowę przed kierownictwem Bell Labs; świat usłyszał o nim 30 czerwca 1948 roku, pod nazwą, którą John R. Pierce utworzył od „transfer resistor”. Potem przyszedł tranzystor złączowy Williama Shockleya (teoria w 1948 roku, pierwszy działający w 1951), a trzej badacze dostali w 1956 roku Nagrodę Nobla z fizyki. Wybrano german, bo w czasie wojny nauczono się robić go czystszym niż jakikolwiek inny półprzewodnik, do detektorów radarowych.',
        ],
      },
      de: {
        kid: [
          'Vor 1947 liefen Radios und die allerersten Computer mit Elektronenröhren: Glaskolben, die heiß glühten wie kleine Lampen, viel Strom brauchten und durchbrannten. In den Bell Labs in Amerika suchten John Bardeen und Walter Brattain etwas Kleines, Festes, das die Arbeit einer Röhre tun konnte: ein schwaches elektrisches Signal nehmen und stark machen.',
          'Im Dezember 1947 drückten sie zwei winzige Goldspitzen, näher beieinander als ein Blatt Papier dick ist, auf ein kleines Stück Germanium, festgehalten von einer Feder. Ein kleiner Strom in die eine Spitze steuerte einen viel größeren Strom durch die andere. Sie sprachen in ein Mikrofon und hörten ihre Stimmen lauter im Kopfhörer. Das war der erste Transistor, der Ururgroßvater der winzigen Schalter in jedem Computer und Handy.',
        ],
        sci: [
          'Der Spitzentransistor: Brattain wickelte Goldfolie um die Kante eines Dreiecks aus Polystyrol, schlitzte sie an der Spitze mit einer Rasierklinge auf und drückte die beiden Kontakte, etwa 50 µm voneinander entfernt, mit einer Feder auf ein Plättchen aus n-leitendem Germanium auf einem Metallsockel. Strom in den einen Kontakt, den Emitter, bringt Löcher in eine dünne Schicht an der Oberfläche des Germaniums; am anderen Kontakt gesammelt, ändern sie dessen Strom, sodass ein kleines Signal am Emitter ein größeres am Kollektor ergibt.',
          'Zum ersten Mal verstärkte er die Leistung am 16. Dezember 1947, und am 23. Dezember verstärkte er Sprache vor der Leitung der Bell Labs; die Öffentlichkeit erfuhr am 30. Juni 1948 von ihm, unter einem Namen, den John R. Pierce aus „transfer resistor“ bildete. Es folgte William Shockleys Flächentransistor (die Theorie 1948, der erste funktionierende 1951), und die drei teilten sich den Physik-Nobelpreis 1956. Man nahm Germanium, weil man im Krieg gelernt hatte, es für Radardetektoren reiner herzustellen als jeden anderen Halbleiter.',
        ],
      },
    },
  },
  {
    id: 'heat',
    color: '#ff6a3c',
    title: {
      en: 'How can a camera see heat?',
      'pt-pt': 'Como é que uma câmara vê o calor?',
      pl: 'Jak kamera może zobaczyć ciepło?',
      de: 'Wie kann eine Kamera Wärme sehen?',
    },
    story: {
      en: {
        kid: [
          'Everything warm gives off a light our eyes cannot see: infrared. You glow with it, a cat glows, a cup of hot cocoa glows. A thermal camera sees that glow and shows it as colours: warm things yellow and orange, cold things dark blue and purple. Firefighters use one to find people in a room full of smoke, and rescuers to find a lost walker on a dark mountain.',
          'But its lens cannot be made of glass, because glass stops that infrared like a wall. So the lens is made of germanium. To your eyes a germanium lens looks like a dark grey mirror, and you cannot see through it at all; to infrared it is as clear as a window.',
        ],
        sci: [
          'Everything radiates by its temperature; a body at 37 °C (310 K) shines most strongly near 9.3 µm (Wien’s law: 2898 µm·K divided by the temperature). Thermal cameras work from about 8 to 14 µm, where warm things shine brightly and the air lets the light through; behind the lens a grid of tiny sensors, a microbolometer, warms by how much each point sends. Ordinary glass absorbs infrared beyond a few micrometres.',
          'Germanium’s band gap of 0.67 eV makes it absorb visible light (photons of 1.6 to 3.3 eV) and pass infrared from about 2 to 14 µm, whose photons carry too little energy to be absorbed. Its refractive index of about 4.0 bends infrared strongly, so its lenses can be thin, but a bare surface reflects about 36% of the light, (n − 1)²/(n + 1)²: germanium lenses are coated against reflection, the outer face often with hard diamond-like carbon.',
        ],
      },
      'pt-pt': {
        kid: [
          'Tudo o que está quente emite uma luz que os nossos olhos não conseguem ver: o infravermelho. Tu brilhas com ela, um gato brilha, uma caneca de chocolate quente brilha. Uma câmara térmica vê esse brilho e mostra-o em cores: as coisas quentes em amarelo e laranja, as frias em azul-escuro e roxo. Os bombeiros usam uma para encontrar pessoas numa sala cheia de fumo, e as equipas de salvamento para encontrar um caminhante perdido numa montanha às escuras.',
          'Mas a lente não pode ser de vidro, porque o vidro trava esse infravermelho como uma parede. Por isso a lente é feita de germânio. Aos teus olhos, uma lente de germânio parece um espelho cinzento-escuro, e não se vê nada através dela; para o infravermelho, é transparente como uma janela.',
        ],
        sci: [
          'Tudo emite radiação conforme a sua temperatura; um corpo a 37 °C (310 K) brilha com mais força perto de 9,3 µm (lei de Wien: 2898 µm·K a dividir pela temperatura). As câmaras térmicas trabalham entre cerca de 8 e 14 µm, onde as coisas quentes brilham muito e o ar deixa passar a luz; atrás da lente, uma grelha de sensores minúsculos, um microbolómetro, aquece conforme o que cada ponto envia. O vidro comum absorve o infravermelho para além de alguns micrómetros.',
          'A banda proibida do germânio, de 0,67 eV, faz com que absorva a luz visível (fotões de 1,6 a 3,3 eV) e deixe passar o infravermelho de cerca de 2 a 14 µm, cujos fotões trazem energia a menos para serem absorvidos. O seu índice de refração, de cerca de 4,0, desvia muito o infravermelho, e por isso as lentes podem ser finas, mas uma superfície nua reflete cerca de 36% da luz, (n − 1)²/(n + 1)²: as lentes de germânio levam revestimentos antirreflexo, a face de fora muitas vezes de carbono duro tipo diamante.',
        ],
      },
      pl: {
        kid: [
          'Wszystko, co ciepłe, wysyła światło, którego nasze oczy nie widzą: podczerwień. Ty nią świecisz, kot świeci, kubek gorącego kakao świeci. Kamera termowizyjna widzi to świecenie i pokazuje je w kolorach: ciepłe rzeczy na żółto i pomarańczowo, zimne na ciemnoniebiesko i fioletowo. Strażacy używają jej, żeby znaleźć ludzi w pokoju pełnym dymu, a ratownicy, żeby odnaleźć zagubionego wędrowca w ciemnych górach.',
          'Ale jej soczewki nie można zrobić ze szkła, bo szkło zatrzymuje podczerwień jak ściana. Dlatego soczewka jest z germanu. Dla twoich oczu soczewka z germanu wygląda jak ciemnoszare lustro i nic przez nią nie widać, a dla podczerwieni jest przezroczysta jak okno.',
        ],
        sci: [
          'Wszystko promieniuje zależnie od swojej temperatury; ciało o temperaturze 37 °C (310 K) świeci najsilniej w pobliżu 9,3 µm (prawo Wiena: 2898 µm·K podzielone przez temperaturę). Kamery termowizyjne pracują w zakresie od około 8 do 14 µm, gdzie ciepłe rzeczy świecą jasno, a powietrze przepuszcza światło; za soczewką siatka malutkich czujników, mikrobolometr, nagrzewa się zależnie od tego, ile wysyła każdy punkt. Zwykłe szkło pochłania podczerwień dłuższą niż kilka mikrometrów.',
          'Przerwa energetyczna germanu, 0,67 eV, sprawia, że pochłania on światło widzialne (fotony od 1,6 do 3,3 eV), a przepuszcza podczerwień od około 2 do 14 µm, której fotony niosą za mało energii, żeby zostać pochłonięte. Jego współczynnik załamania, około 4,0, mocno ugina podczerwień, więc soczewki mogą być cienkie, ale goła powierzchnia odbija około 36% światła, (n − 1)²/(n + 1)²: soczewki z germanu pokrywa się warstwami przeciwodblaskowymi, zewnętrzną często z twardego węgla diamentopodobnego.',
        ],
      },
      de: {
        kid: [
          'Alles, was warm ist, gibt ein Licht ab, das unsere Augen nicht sehen: Infrarot. Du leuchtest damit, eine Katze leuchtet, eine Tasse heißer Kakao leuchtet. Eine Wärmebildkamera sieht dieses Leuchten und zeigt es in Farben: Warmes gelb und orange, Kaltes dunkelblau und lila. Die Feuerwehr findet damit Menschen in einem Raum voller Rauch, und die Bergwacht einen verirrten Wanderer auf einem dunklen Berg.',
          'Aber ihre Linse kann nicht aus Glas sein, denn Glas hält dieses Infrarot auf wie eine Wand. Deshalb ist die Linse aus Germanium. Für deine Augen sieht eine Germaniumlinse aus wie ein dunkelgrauer Spiegel, und du kannst überhaupt nicht hindurchsehen; für Infrarot ist sie so klar wie ein Fenster.',
        ],
        sci: [
          'Alles strahlt nach seiner Temperatur; ein Körper mit 37 °C (310 K) leuchtet am stärksten bei etwa 9,3 µm (Wiensches Gesetz: 2898 µm·K geteilt durch die Temperatur). Wärmebildkameras arbeiten bei etwa 8 bis 14 µm, wo Warmes hell leuchtet und die Luft das Licht durchlässt; hinter der Linse erwärmt sich ein Gitter winziger Sensoren, ein Mikrobolometer, je nachdem, wie viel jeder Punkt schickt. Gewöhnliches Glas schluckt Infrarot jenseits weniger Mikrometer.',
          'Die Bandlücke des Germaniums von 0,67 eV lässt es sichtbares Licht schlucken (Photonen von 1,6 bis 3,3 eV) und Infrarot von etwa 2 bis 14 µm durchlassen, dessen Photonen zu wenig Energie tragen, um geschluckt zu werden. Seine Brechzahl von etwa 4,0 bricht Infrarot stark, sodass seine Linsen dünn sein können, aber eine blanke Fläche spiegelt etwa 36% des Lichts, (n − 1)²/(n + 1)²: Germaniumlinsen werden entspiegelt, die Außenseite oft mit hartem diamantartigem Kohlenstoff.',
        ],
      },
    },
  },
  {
    id: 'fuzz',
    color: '#ff4fd8',
    title: {
      en: 'What makes a guitar go fuzzzz?',
      'pt-pt': 'Como é que a guitarra faz fuzzzz?',
      pl: 'Co sprawia, że gitara robi fuzzzz?',
      de: 'Was macht die Gitarre so fuzzig?',
    },
    story: {
      en: {
        kid: [
          'In 1961, in a recording studio in Nashville, part of the mixing desk broke while a guitar was being recorded. Instead of a clean note, out came a rough, buzzy, fuzzy sound. Everyone liked it so much that they kept it in the song, and soon people wanted to make that sound on purpose.',
          'So in 1962 a little box for the floor came out, the Fuzz-Tone, with germanium transistors inside. They push the guitar’s signal so hard that the tops of its waves are squashed flat: smooth waves become almost square, and that is what fuzz sounds like. In 1965 the Rolling Stones used one on “Satisfaction”, and every band wanted one. Many guitarists still say germanium fuzz sounds the warmest.',
        ],
        sci: [
          'A guitar’s pickup gives a signal of a fraction of a volt. Grady Martin’s fuzzy six-string bass on Marty Robbins’s “Don’t Worry” (1961) came from a faulty channel of the studio’s console; the engineer Glenn Snoddy and Revis Hobbs then built the Maestro FZ-1 Fuzz-Tone (Gibson, 1962), whose germanium transistors amplify the signal until it clips: the peaks of the wave are cut off, which adds strong odd harmonics, three, five, seven times the note, heard as fuzz.',
          'Germanium transistors switch on at a lower voltage than silicon ones (about 0.2 to 0.3 V across the base and emitter, against about 0.6 to 0.7 V), have less gain and leak more current as they warm. So pedals like the Dallas Arbiter Fuzz Face (1966), which Jimi Hendrix played, clip more gently, and their sound changes with the temperature of the stage; many players hear them as rounder. Keith Richards’s FZ-1 on “Satisfaction” (1965) sold out every Fuzz-Tone in the shops.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em 1961, num estúdio de gravação em Nashville, avariou-se uma parte da mesa de mistura enquanto se gravava uma guitarra. Em vez de uma nota limpa, saiu um som áspero, zumbido, todo “fuzz”. Toda a gente gostou tanto que o deixaram ficar na canção, e depressa se quis fazer aquele som de propósito.',
          'Por isso, em 1962, apareceu uma caixinha para pôr no chão, o Fuzz-Tone, com transístores de germânio lá dentro. Empurram o sinal da guitarra com tanta força que o cimo das suas ondas fica achatado: as ondas suaves ficam quase quadradas, e é assim que soa o fuzz. Em 1965, os Rolling Stones usaram um em “Satisfaction”, e todas as bandas quiseram um. Muitos guitarristas ainda dizem que o fuzz de germânio é o mais quente.',
        ],
        sci: [
          'O captador de uma guitarra dá um sinal de uma fração de volt. O baixo de seis cordas cheio de fuzz de Grady Martin em “Don’t Worry”, de Marty Robbins (1961), veio de um canal avariado da mesa do estúdio; o engenheiro Glenn Snoddy e Revis Hobbs construíram depois o Maestro FZ-1 Fuzz-Tone (Gibson, 1962), cujos transístores de germânio amplificam o sinal até ele saturar: os picos da onda são cortados, o que lhe junta harmónicos ímpares fortes, de três, cinco e sete vezes a nota, que se ouvem como fuzz.',
          'Os transístores de germânio começam a conduzir com uma tensão menor do que os de silício (cerca de 0,2 a 0,3 V entre a base e o emissor, contra cerca de 0,6 a 0,7 V), têm menos ganho e deixam fugir mais corrente quando aquecem. Por isso pedais como o Dallas Arbiter Fuzz Face (1966), que Jimi Hendrix tocava, saturam com mais suavidade, e o seu som muda com a temperatura do palco; muitos músicos ouvem-nos mais redondos. O FZ-1 de Keith Richards em “Satisfaction” (1965) esgotou todos os Fuzz-Tone das lojas.',
        ],
      },
      pl: {
        kid: [
          'W 1961 roku w studiu nagraniowym w Nashville, w trakcie nagrywania gitary, zepsuła się część stołu mikserskiego. Zamiast czystego dźwięku wyszło coś chropowatego, brzęczącego, takiego „fuzz”. Wszystkim tak się to spodobało, że zostawili to w piosence, a wkrótce ludzie chcieli robić taki dźwięk celowo.',
          'Dlatego w 1962 roku pojawiło się małe pudełko do postawienia na podłodze, Fuzz-Tone, z tranzystorami z germanu w środku. Pchają sygnał gitary tak mocno, że wierzchołki jego fal zostają spłaszczone: gładkie fale robią się prawie kwadratowe i właśnie tak brzmi fuzz. W 1965 roku Rolling Stonesi użyli go w „Satisfaction” i każdy zespół chciał taki mieć. Wielu gitarzystów do dziś mówi, że germanowy fuzz brzmi najcieplej.',
        ],
        sci: [
          'Przetwornik gitary daje sygnał o napięciu ułamka wolta. Pełen przesteru sześciostrunowy bas Grady’ego Martina w „Don’t Worry” Marty’ego Robbinsa (1961) wziął się z uszkodzonego kanału konsoli w studiu; inżynier Glenn Snoddy i Revis Hobbs zbudowali potem Maestro FZ-1 Fuzz-Tone (Gibson, 1962), którego tranzystory z germanu wzmacniają sygnał, aż zacznie się obcinać: wierzchołki fali zostają ścięte, co dodaje silne nieparzyste harmoniczne, o trzy, pięć i siedem razy wyższej częstotliwości niż nuta, słyszane jako fuzz.',
          'Tranzystory germanowe zaczynają przewodzić przy niższym napięciu niż krzemowe (około 0,2 do 0,3 V między bazą a emiterem, wobec około 0,6 do 0,7 V), mają mniejsze wzmocnienie i po ogrzaniu przepuszczają więcej prądu upływu. Dlatego efekty takie jak Dallas Arbiter Fuzz Face (1966), na którym grał Jimi Hendrix, obcinają łagodniej, a ich brzmienie zmienia się z temperaturą na scenie; wielu muzyków słyszy je jako okrąglejsze. FZ-1 Keitha Richardsa w „Satisfaction” (1965) sprawił, że ze sklepów zniknęły wszystkie Fuzz-Tone’y.',
        ],
      },
      de: {
        kid: [
          '1961 ging in einem Tonstudio in Nashville ein Teil des Mischpults kaputt, während gerade eine Gitarre aufgenommen wurde. Statt eines sauberen Tons kam ein rauer, brummender, fuzziger Klang heraus. Er gefiel allen so gut, dass sie ihn im Lied ließen, und bald wollten die Leute diesen Klang absichtlich machen.',
          'Also kam 1962 ein kleiner Kasten für den Boden heraus, der Fuzz-Tone, mit Transistoren aus Germanium darin. Sie treiben das Signal der Gitarre so stark an, dass die Spitzen seiner Wellen platt gedrückt werden: Aus weichen Wellen werden fast eckige, und genau so klingt Fuzz. 1965 spielten die Rolling Stones damit „Satisfaction“, und jede Band wollte einen. Viele Gitarristen sagen bis heute, dass Germanium-Fuzz am wärmsten klingt.',
        ],
        sci: [
          'Der Tonabnehmer einer Gitarre liefert ein Signal von einem Bruchteil eines Volts. Grady Martins verzerrter sechssaitiger Bass in Marty Robbins’ „Don’t Worry“ (1961) kam von einem defekten Kanal des Studiopults; der Tontechniker Glenn Snoddy und Revis Hobbs bauten danach den Maestro FZ-1 Fuzz-Tone (Gibson, 1962), dessen Germaniumtransistoren das Signal verstärken, bis es übersteuert: Die Spitzen der Welle werden abgeschnitten, was starke ungerade Obertöne hinzufügt, mit drei-, fünf- und siebenfacher Frequenz des Tons, die man als Fuzz hört.',
          'Germaniumtransistoren schalten bei einer niedrigeren Spannung durch als solche aus Silicium (etwa 0,2 bis 0,3 V zwischen Basis und Emitter gegenüber etwa 0,6 bis 0,7 V), verstärken weniger und lassen mehr Leckstrom durch, wenn sie warm werden. Darum übersteuern Pedale wie das Dallas Arbiter Fuzz Face (1966), das Jimi Hendrix spielte, sanfter, und ihr Klang ändert sich mit der Temperatur auf der Bühne; viele Musiker hören sie als runder. Keith Richards’ FZ-1 auf „Satisfaction“ (1965) ließ jeden Fuzz-Tone in den Läden ausverkaufen.',
        ],
      },
    },
  },
  {
    id: 'deep',
    color: '#8a8cff',
    title: {
      en: 'Why hide a crystal under a mountain?',
      'pt-pt': 'Um cristal escondido numa montanha?',
      pl: 'Po co chować kryształ pod górą?',
      de: 'Warum ein Kristall unter einem Berg?',
    },
    story: {
      en: {
        kid: [
          'Germanium can be made purer than almost anything else on Earth: in the best crystals fewer than one atom in a million million is not germanium. A crystal that pure, kept very cold, feels the tiniest jolt of energy every time a ray or a particle hits one of its atoms, and tells exactly how big it was. People use such detectors to check food and water for radioactivity, and to search for things nobody has ever seen.',
          'One kind of germanium atom, germanium-76, breaks apart very, very slowly: for half of them to break would take more than a hundred billion times as long as the universe has existed. Physicists hope that once in a while one breaks in a rare new way, which could help explain why the universe is made of matter. So they hang germanium crystals deep under a mountain in Italy, where the rock keeps out the particles raining from space, and they wait.',
        ],
        sci: [
          'High-purity germanium (HPGe) crystals, with net impurities near 10¹⁰ per cm³ (about one in 10¹² atoms), are made into diodes of up to a few kilograms. Cooled to about 90 K, a gamma ray absorbed in one frees one electron-hole pair for every 3 eV it carries, and the charge collected gives its energy to about 0.15% at 1.33 MeV: the sharpest gamma-ray spectra there are, used to measure radioactivity in food (after Chernobyl and Fukushima), at borders, and in searches for dark matter.',
          'Germanium-76, 7.75% of natural germanium, decays by double-beta decay to selenium-76, two neutrons becoming two protons at once, with two electrons and two antineutrinos, half-life about 1.9 × 10²¹ years. GERDA and now LEGEND-200, under about 1400 m of rock at the Laboratori Nazionali del Gran Sasso, run detectors enriched to about 90% germanium-76, bare in liquid argon at −186 °C, looking for the decay with no neutrinos; GERDA showed its half-life is longer than 1.8 × 10²⁶ years (2020). Seen, it would mean the neutrino is its own antiparticle, a clue to why matter outlived antimatter.',
        ],
      },
      'pt-pt': {
        kid: [
          'O germânio pode ficar mais puro do que quase tudo o resto na Terra: nos melhores cristais, menos de um átomo em cada milhão de milhões não é de germânio. Um cristal assim tão puro, mantido muito frio, sente o mais pequeno abanão de energia sempre que um raio ou uma partícula bate num dos seus átomos, e diz exatamente quão grande foi. Usam-se detetores destes para ver se há radioatividade na comida e na água, e para procurar coisas que ninguém viu até hoje.',
          'Um tipo de átomo de germânio, o germânio-76, desfaz-se muito, muito devagar: para metade deles se desfazer seria preciso mais de cem mil milhões de vezes o tempo que o Universo já existe. Os físicos esperam que, de vez em quando, um deles se desfaça de uma maneira rara e nova, que poderia ajudar a explicar porque é que o Universo é feito de matéria. Por isso penduram cristais de germânio muito fundo debaixo de uma montanha em Itália, onde a rocha não deixa entrar as partículas que chovem do espaço, e esperam.',
        ],
        sci: [
          'Os cristais de germânio de alta pureza (HPGe), com impurezas líquidas perto de 10¹⁰ por cm³ (cerca de uma em 10¹² átomos), fazem-se em díodos de até alguns quilogramas. Arrefecido a cerca de 90 K, um raio gama absorvido num deles liberta um par eletrão-lacuna por cada 3 eV que traz, e a carga recolhida dá a sua energia com cerca de 0,15% de erro a 1,33 MeV: os espetros de raios gama mais nítidos que há, usados para medir a radioatividade nos alimentos (depois de Chernobil e de Fukushima), nas fronteiras e na procura da matéria escura.',
          'O germânio-76, 7,75% do germânio natural, sofre decaimento beta duplo para selénio-76, dois neutrões a tornarem-se dois protões ao mesmo tempo, com dois eletrões e dois antineutrinos, com meia-vida de cerca de 1,9 × 10²¹ anos. O GERDA e agora o LEGEND-200, debaixo de cerca de 1400 m de rocha nos Laboratori Nazionali del Gran Sasso, usam detetores enriquecidos a cerca de 90% em germânio-76, nus em árgon líquido a −186 °C, à procura do decaimento sem neutrinos; o GERDA mostrou que a sua meia-vida é maior do que 1,8 × 10²⁶ anos (2020). Se for visto, quer dizer que o neutrino é a sua própria antipartícula, uma pista para perceber porque é que a matéria sobreviveu à antimatéria.',
        ],
      },
      pl: {
        kid: [
          'German można oczyścić bardziej niż prawie cokolwiek innego na Ziemi: w najlepszych kryształach mniej niż jeden atom na milion milionów nie jest germanem. Tak czysty kryształ, trzymany w dużym zimnie, czuje najmniejsze szturchnięcie energii za każdym razem, gdy promień albo cząstka uderzy w jeden z jego atomów, i mówi dokładnie, jak duże było. Takich detektorów używa się, żeby sprawdzać, czy w jedzeniu i wodzie nie ma promieniotwórczości, i żeby szukać rzeczy, których nikt jeszcze nie widział.',
          'Jeden rodzaj atomów germanu, german-76, rozpada się bardzo, bardzo powoli: na rozpad połowy z nich trzeba by ponad sto miliardów razy więcej czasu, niż istnieje Wszechświat. Fizycy mają nadzieję, że raz na jakiś czas któryś rozpadnie się w rzadki, nowy sposób, co mogłoby pomóc wyjaśnić, dlaczego Wszechświat jest zbudowany z materii. Dlatego wieszają kryształy germanu głęboko pod górą we Włoszech, gdzie skała zatrzymuje cząstki spadające z kosmosu, i czekają.',
        ],
        sci: [
          'Z kryształów germanu o wysokiej czystości (HPGe), z wypadkową ilością domieszek około 10¹⁰ na cm³ (mniej więcej jedna na 10¹² atomów), robi się diody ważące do kilku kilogramów. Po schłodzeniu do około 90 K promień gamma pochłonięty w takiej diodzie uwalnia jedną parę elektron-dziura na każde 3 eV swojej energii, a zebrany ładunek podaje tę energię z dokładnością około 0,15% przy 1,33 MeV: to najostrzejsze widma promieniowania gamma, jakie istnieją, używane do pomiarów promieniotwórczości żywności (po Czarnobylu i Fukushimie), na granicach i w poszukiwaniach ciemnej materii.',
          'German-76, 7,75% naturalnego germanu, ulega podwójnemu rozpadowi beta do selenu-76: dwa neutrony naraz stają się dwoma protonami, z dwoma elektronami i dwoma antyneutrinami, a czas połowicznego rozpadu wynosi około 1,9 × 10²¹ lat. GERDA, a teraz LEGEND-200, pod około 1400 m skały w Laboratori Nazionali del Gran Sasso, używają detektorów wzbogaconych do około 90% germanu-76, gołych, zanurzonych w ciekłym argonie o temperaturze −186 °C, i szukają rozpadu bez neutrin; GERDA wykazała, że jego czas połowicznego rozpadu przekracza 1,8 × 10²⁶ lat (2020). Gdyby go zobaczono, znaczyłoby to, że neutrino jest swoją własną antycząstką: wskazówka, dlaczego materia przetrwała antymaterię.',
        ],
      },
      de: {
        kid: [
          'Germanium kann man reiner machen als fast alles andere auf der Erde: In den besten Kristallen ist weniger als ein Atom unter einer Million Millionen kein Germanium. Ein so reiner Kristall, sehr kalt gehalten, spürt den winzigsten Stoß Energie, jedes Mal wenn ein Strahl oder ein Teilchen eines seiner Atome trifft, und sagt genau, wie groß er war. Mit solchen Detektoren prüft man Essen und Wasser auf Radioaktivität und sucht nach Dingen, die noch nie jemand gesehen hat.',
          'Eine Sorte Germaniumatome, Germanium-76, zerfällt sehr, sehr langsam: Bis die Hälfte von ihnen zerfallen ist, dauert es mehr als hundert Milliarden Mal so lange, wie es das Universum schon gibt. Physiker hoffen, dass ab und zu eines auf eine seltene, neue Art zerfällt, die erklären helfen könnte, warum das Universum aus Materie besteht. Darum hängen sie Germaniumkristalle tief unter einen Berg in Italien, wo der Fels die Teilchen abhält, die aus dem All herunterregnen, und warten.',
        ],
        sci: [
          'Aus hochreinen Germaniumkristallen (HPGe), mit netto etwa 10¹⁰ Fremdatomen pro cm³ (etwa eines unter 10¹² Atomen), macht man Dioden von bis zu einigen Kilogramm. Auf etwa 90 K gekühlt, setzt ein darin absorbierter Gammastrahl für je 3 eV seiner Energie ein Elektron-Loch-Paar frei, und die gesammelte Ladung gibt seine Energie bei 1,33 MeV auf etwa 0,15% genau an: die schärfsten Gammaspektren, die es gibt, genutzt für Radioaktivität in Lebensmitteln (nach Tschernobyl und Fukushima), an Grenzen und bei der Suche nach Dunkler Materie.',
          'Germanium-76, 7,75% des natürlichen Germaniums, zerfällt durch doppelten Betazerfall zu Selen-76, zwei Neutronen werden auf einmal zu zwei Protonen, mit zwei Elektronen und zwei Antineutrinos, Halbwertszeit etwa 1,9 × 10²¹ Jahre. GERDA und heute LEGEND-200, unter etwa 1400 m Fels in den Laboratori Nazionali del Gran Sasso, betreiben Detektoren, die auf etwa 90% Germanium-76 angereichert sind, nackt in flüssigem Argon bei −186 °C, und suchen den Zerfall ohne Neutrinos; GERDA zeigte, dass seine Halbwertszeit länger als 1,8 × 10²⁶ Jahre ist (2020). Würde man ihn sehen, wäre das Neutrino sein eigenes Antiteilchen: ein Hinweis darauf, warum die Materie die Antimaterie überlebte.',
        ],
      },
    },
  },
  {
    id: 'fibre',
    color: '#3ce0c8',
    title: {
      en: 'How does the internet cross the sea?',
      'pt-pt': 'Como atravessa a internet o mar?',
      pl: 'Jak internet przechodzi przez morze?',
      de: 'Wie kommt das Internet übers Meer?',
    },
    story: {
      en: {
        kid: [
          'When you watch a video from another continent, it almost certainly travelled under the sea: along cables lying on the ocean floor, with threads of glass inside them thinner than a hair. Light flashes on and off through those threads billions of times a second, and every flash is a tiny piece of your video.',
          'How does the light stay inside a thread that bends and curls for thousands of kilometres? The middle of each thread has a pinch of germanium in its glass. That makes light go a little slower in the middle than in the glass around it, and whenever the light reaches the edge it bounces back into the middle, again and again, like a ball rolling down a long pipe.',
        ],
        sci: [
          'A telecom fibre is 125 µm of pure silica cladding round a core about 8 to 9 µm across, doped with a few percent germania (GeO2), which raises the core’s refractive index by about 0.35%. Light travelling along the core meets the boundary at grazing angles, beyond the critical angle of about 85°, and is totally internally reflected, so it stays in the core however the fibre bends (within reason).',
          'At 1550 nm the loss is only about 0.2 dB per kilometre: after 15 km half the light is still there. More than a million kilometres of submarine cables carry almost all the data between continents; about every 50 to 100 km a repeater on the sea floor amplifies the light in a length of erbium-doped fibre, without turning it into electricity. The first transatlantic fibre cable, TAT-8, was laid in 1988.',
        ],
      },
      'pt-pt': {
        kid: [
          'Quando vês um vídeo de outro continente, ele quase de certeza viajou debaixo do mar: por cabos deitados no fundo do oceano, com fios de vidro lá dentro mais finos do que um cabelo. A luz acende e apaga por esses fios milhares de milhões de vezes por segundo, e cada clarão é um pedacinho do teu vídeo.',
          'Como é que a luz fica dentro de um fio que se dobra e enrola ao longo de milhares de quilómetros? O meio de cada fio tem uma pitada de germânio no vidro. Isso faz a luz andar um pouco mais devagar no meio do que no vidro à volta, e sempre que a luz chega à beira volta para o meio, vezes sem conta, como uma bola a rolar por um tubo comprido.',
        ],
        sci: [
          'Uma fibra de telecomunicações tem 125 µm de bainha de sílica pura à volta de um núcleo com cerca de 8 a 9 µm, dopado com alguns por cento de germânia (GeO2), que aumenta o índice de refração do núcleo em cerca de 0,35%. A luz que segue pelo núcleo encontra a fronteira em ângulos rasantes, para lá do ângulo crítico de cerca de 85°, e sofre reflexão total, por isso fica no núcleo por mais que a fibra se dobre (dentro do razoável).',
          'A 1550 nm a perda é só de cerca de 0,2 dB por quilómetro: ao fim de 15 km ainda lá está metade da luz. Mais de um milhão de quilómetros de cabos submarinos levam quase todos os dados entre continentes; a cada 50 a 100 km, mais ou menos, um repetidor no fundo do mar amplifica a luz num troço de fibra dopada com érbio, sem a transformar em eletricidade. O primeiro cabo de fibra transatlântico, o TAT-8, foi lançado em 1988.',
        ],
      },
      pl: {
        kid: [
          'Kiedy oglądasz film z innego kontynentu, prawie na pewno przypłynął pod morzem: kablami leżącymi na dnie oceanu, w których są szklane nitki cieńsze od włosa. Światło miga w tych nitkach miliardy razy na sekundę, a każde mignięcie to malutki kawałek twojego filmu.',
          'Jak światło zostaje w nitce, która wygina się i skręca przez tysiące kilometrów? Środek każdej nitki ma w szkle szczyptę germanu. Przez to światło biegnie w środku trochę wolniej niż w szkle dookoła, a gdy tylko dotrze do brzegu, odbija się z powrotem do środka, raz za razem, jak piłka tocząca się w długiej rurze.',
        ],
        sci: [
          'Światłowód telekomunikacyjny to 125 µm płaszcza z czystej krzemionki wokół rdzenia o średnicy około 8 do 9 µm, domieszkowanego kilkoma procentami tlenku germanu (GeO2), który podnosi współczynnik załamania rdzenia o około 0,35%. Światło biegnące rdzeniem trafia na granicę pod bardzo płaskim kątem, większym od kąta granicznego około 85°, i ulega całkowitemu wewnętrznemu odbiciu, więc zostaje w rdzeniu, jakkolwiek światłowód się wygina (w rozsądnych granicach).',
          'Przy 1550 nm strata wynosi tylko około 0,2 dB na kilometr: po 15 km wciąż zostaje połowa światła. Ponad milion kilometrów kabli podmorskich przenosi prawie wszystkie dane między kontynentami; mniej więcej co 50 do 100 km wzmacniacz na dnie morza wzmacnia światło w odcinku światłowodu domieszkowanego erbem, nie zamieniając go w prąd. Pierwszy transatlantycki kabel światłowodowy, TAT-8, położono w 1988 roku.',
        ],
      },
      de: {
        kid: [
          'Wenn du ein Video von einem anderen Kontinent schaust, ist es fast sicher unter dem Meer gereist: durch Kabel auf dem Meeresboden, mit Fäden aus Glas darin, dünner als ein Haar. Licht blinkt durch diese Fäden Milliarden Mal in der Sekunde an und aus, und jedes Blinken ist ein winziges Stück deines Videos.',
          'Wie bleibt das Licht in einem Faden, der sich über Tausende Kilometer biegt und windet? Die Mitte jedes Fadens hat eine Prise Germanium im Glas. Dadurch ist das Licht in der Mitte ein bisschen langsamer als im Glas drumherum, und immer wenn es an den Rand kommt, prallt es zurück in die Mitte, wieder und wieder, wie ein Ball, der durch ein langes Rohr rollt.',
        ],
        sci: [
          'Eine Glasfaser für die Telekommunikation besteht aus 125 µm Mantel aus reinem Quarzglas um einen Kern von etwa 8 bis 9 µm, dotiert mit einigen Prozent Germaniumdioxid (GeO2), das die Brechzahl des Kerns um etwa 0,35% erhöht. Licht, das durch den Kern läuft, trifft unter streifenden Winkeln auf die Grenze, jenseits des Grenzwinkels von etwa 85°, und wird totalreflektiert, sodass es im Kern bleibt, wie auch immer sich die Faser biegt (in Grenzen).',
          'Bei 1550 nm beträgt der Verlust nur etwa 0,2 dB pro Kilometer: Nach 15 km ist noch die Hälfte des Lichts da. Mehr als eine Million Kilometer Seekabel tragen fast alle Daten zwischen den Kontinenten; etwa alle 50 bis 100 km verstärkt ein Zwischenverstärker auf dem Meeresboden das Licht in einem Stück erbiumdotierter Faser, ohne es in Strom zu verwandeln. Das erste transatlantische Glasfaserkabel, TAT-8, wurde 1988 verlegt.',
        ],
      },
    },
  },
  {
    id: 'space',
    color: '#ffd24d',
    title: {
      en: 'How do satellites catch sunlight?',
      'pt-pt': 'Como apanham os satélites o Sol?',
      pl: 'Jak satelity łapią światło Słońca?',
      de: 'Wie fangen Satelliten Sonnenlicht?',
    },
    story: {
      en: {
        kid: [
          'Satellites and space probes make their electricity from sunlight, and up there every bit of it counts. Sunlight is a mix of all the colours, and infrared too, which we cannot see. A plain solar cell catches only part of that mix; the rest passes through it or just warms it up.',
          'So the solar cells on many satellites are a sandwich: three thin layers stacked on a slice of germanium. The top layer catches blue and green light, the middle one red light, and the germanium at the bottom catches the infrared that slipped through the other two. Together they turn about three tenths of the sunlight into electricity. The rovers Spirit and Opportunity drove across Mars on cells like these.',
        ],
        sci: [
          'A triple-junction cell: gallium indium phosphide (band gap about 1.9 eV) over gallium indium arsenide (about 1.4 eV) over germanium (0.67 eV), grown as one crystal on a germanium wafer about 0.15 mm thick, whose atoms are spaced (0.5658 nm) almost exactly like gallium arsenide’s (0.5653 nm). Each junction absorbs the photons above its gap and passes the rest down: the top one light shorter than about 650 nm, the middle one to about 890 nm, the germanium to about 1800 nm.',
          'The three are joined in series by thin tunnel junctions, so their voltages add, to about 2.6 V a cell, and each photon’s energy is used closer to its full value. Such cells turn about 30% of the sunlight in space (1361 W/m² at the Earth’s distance) into electricity, stand radiation better than silicon, and power most of today’s satellites; Spirit and Opportunity (2004) drove on GaInP/GaAs/Ge cells.',
        ],
      },
      'pt-pt': {
        kid: [
          'Os satélites e as sondas espaciais fazem a sua eletricidade com a luz do Sol, e lá em cima cada bocadinho conta. A luz do Sol é uma mistura de todas as cores, e de infravermelho também, que não conseguimos ver. Uma célula solar simples só apanha uma parte dessa mistura; o resto atravessa-a ou só a aquece.',
          'Por isso, as células solares de muitos satélites são uma sanduíche: três camadas finas empilhadas sobre uma fatia de germânio. A camada de cima apanha a luz azul e verde, a do meio a luz vermelha, e o germânio no fundo apanha o infravermelho que escapou às outras duas. Juntas, transformam cerca de três décimos da luz do Sol em eletricidade. Os robôs Spirit e Opportunity andaram por Marte com células assim.',
        ],
        sci: [
          'Uma célula de tripla junção: fosfeto de gálio e índio (banda proibida de cerca de 1,9 eV) sobre arseneto de gálio e índio (cerca de 1,4 eV) sobre germânio (0,67 eV), crescidos como um só cristal numa bolacha de germânio com cerca de 0,15 mm de espessura, cujos átomos estão espaçados (0,5658 nm) quase exatamente como os do arseneto de gálio (0,5653 nm). Cada junção absorve os fotões acima da sua banda proibida e deixa passar o resto para baixo: a de cima a luz abaixo de cerca de 650 nm, a do meio até cerca de 890 nm, o germânio até cerca de 1800 nm.',
          'As três estão ligadas em série por junções de túnel finas, por isso as tensões somam-se, até cerca de 2,6 V por célula, e a energia de cada fotão é aproveitada mais perto do seu valor total. Estas células transformam cerca de 30% da luz do Sol no espaço (1361 W/m² à distância da Terra) em eletricidade, resistem melhor à radiação do que o silício e alimentam a maior parte dos satélites de hoje; o Spirit e o Opportunity (2004) andavam com células de GaInP/GaAs/Ge.',
        ],
      },
      pl: {
        kid: [
          'Satelity i sondy kosmiczne robią prąd ze światła słonecznego, a tam w górze liczy się każda jego odrobina. Światło słoneczne to mieszanka wszystkich kolorów, a do tego podczerwieni, której nie widzimy. Zwykłe ogniwo słoneczne łapie tylko część tej mieszanki; reszta przez nie przechodzi albo tylko je ogrzewa.',
          'Dlatego ogniwa słoneczne wielu satelitów to kanapka: trzy cienkie warstwy ułożone na plasterku germanu. Górna warstwa łapie światło niebieskie i zielone, środkowa czerwone, a german na dole łapie podczerwień, która prześlizgnęła się przez dwie pozostałe. Razem zamieniają w prąd około trzech dziesiątych światła słonecznego. Łaziki Spirit i Opportunity jeździły po Marsie właśnie na takich ogniwach.',
        ],
        sci: [
          'Ogniwo trójzłączowe: fosforek galu i indu (przerwa energetyczna około 1,9 eV) na arsenku galu i indu (około 1,4 eV) na germanie (0,67 eV), wyhodowane jako jeden kryształ na płytce germanu grubości około 0,15 mm, której atomy są rozmieszczone (0,5658 nm) prawie dokładnie tak jak w arsenku galu (0,5653 nm). Każde złącze pochłania fotony o energii powyżej swojej przerwy, a resztę przepuszcza w dół: górne światło krótsze niż około 650 nm, środkowe do około 890 nm, german do około 1800 nm.',
          'Wszystkie trzy są połączone szeregowo cienkimi złączami tunelowymi, więc ich napięcia się sumują, do około 2,6 V na ogniwo, a energia każdego fotonu jest wykorzystana bliżej jej pełnej wartości. Takie ogniwa zamieniają w prąd około 30% światła słonecznego w kosmosie (1361 W/m² w odległości Ziemi), lepiej niż krzem znoszą promieniowanie i zasilają większość dzisiejszych satelitów; Spirit i Opportunity (2004) jeździły na ogniwach GaInP/GaAs/Ge.',
        ],
      },
      de: {
        kid: [
          'Satelliten und Raumsonden machen ihren Strom aus Sonnenlicht, und da oben zählt jedes bisschen davon. Sonnenlicht ist eine Mischung aus allen Farben und dazu Infrarot, das wir nicht sehen. Eine einfache Solarzelle fängt nur einen Teil dieser Mischung; der Rest geht durch sie hindurch oder wärmt sie nur.',
          'Deshalb sind die Solarzellen vieler Satelliten ein Sandwich: drei dünne Schichten, gestapelt auf eine Scheibe Germanium. Die obere Schicht fängt blaues und grünes Licht, die mittlere rotes, und das Germanium unten fängt das Infrarot, das durch die beiden anderen geschlüpft ist. Zusammen machen sie aus etwa drei Zehnteln des Sonnenlichts Strom. Die Rover Spirit und Opportunity fuhren mit solchen Zellen über den Mars.',
        ],
        sci: [
          'Eine Dreifachzelle: Gallium-Indium-Phosphid (Bandlücke etwa 1,9 eV) über Gallium-Indium-Arsenid (etwa 1,4 eV) über Germanium (0,67 eV), als ein einziger Kristall auf einer etwa 0,15 mm dicken Germaniumscheibe gewachsen, deren Atome fast genau so weit auseinander sitzen (0,5658 nm) wie die von Galliumarsenid (0,5653 nm). Jeder Übergang schluckt die Photonen über seiner Bandlücke und lässt den Rest nach unten durch: der obere Licht unter etwa 650 nm, der mittlere bis etwa 890 nm, das Germanium bis etwa 1800 nm.',
          'Die drei sind durch dünne Tunnelübergänge in Reihe geschaltet, sodass sich ihre Spannungen addieren, auf etwa 2,6 V pro Zelle, und die Energie jedes Photons näher an ihrem vollen Wert genutzt wird. Solche Zellen machen aus etwa 30% des Sonnenlichts im All (1361 W/m² im Abstand der Erde) Strom, halten Strahlung besser aus als Silicium und versorgen die meisten heutigen Satelliten; Spirit und Opportunity (2004) fuhren mit GaInP/GaAs/Ge-Zellen.',
        ],
      },
    },
  },
]
