// Hydrogen's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls (it has
// no wing and no doorway yet), each a question that makes you walk up, and the story it opens (Explorer and
// Scientist). They add to what other worlds show instead of repeating it: oxygen's water room splits water
// into its hydrogen and oxygen, the Atom Forge has the Sun's p + p and D-T fusion, the Star Forge fuses
// hydrogen inside stars, and the fact file already tells the isotopes and the uses. Pictures:
// public/boards/H/<id>.svg, drawn by tools/boards/H/ (no words in them: the title is drawn in the
// visitor's language). Each picture has a room designed for it (picture-rooms.md).
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'bigbang',
    color: '#ff9e4a',
    title: {
      en: 'What were the very first atoms?',
      'pt-pt': 'Quais foram os primeiros átomos?',
      pl: 'Jakie były pierwsze atomy?',
      de: 'Was waren die allerersten Atome?',
    },
    story: {
      en: {
        kid: [
          '13.8 billion years ago the whole universe was squeezed together and fantastically hot, and then it began to grow and cool: the Big Bang. At first it was far too hot for atoms: just a glowing fog of tiny particles and light, everything bumping into everything.',
          'After about 380,000 years it had cooled enough for each proton to catch an electron and keep it. Those were the first atoms, and almost all of them were hydrogen. The fog cleared and the light flew free. The hydrogen in your glass of water was made back then: it is almost as old as the universe!',
        ],
        sci: [
          'In the first few minutes after the Big Bang, 13.8 billion years ago, neutrons and protons fused into helium-4 and traces of deuterium, helium-3 and lithium-7; the rest stayed single protons. That left about 75% hydrogen and 25% helium by mass (about 92% hydrogen by number of nuclei), the mix still measured in the oldest stars and gas clouds.',
          'For 380,000 years free electrons scattered the light. When the universe had cooled to about 3000 K they joined the nuclei into neutral atoms (recombination), and the light went free; stretched by the expansion into microwaves at 2.7 K, it was found in 1965 by Arno Penzias and Robert Wilson (Nobel Prize in Physics 1978). In 1925 Cecilia Payne showed from the stars’ spectra that they, too, are mostly hydrogen.',
        ],
      },
      'pt-pt': {
        kid: [
          'Há 13,8 mil milhões de anos, todo o universo estava apertado e era quentíssimo, e depois começou a crescer e a arrefecer: o Big Bang. Ao princípio estava quente demais para haver átomos: era só um nevoeiro brilhante de partículas minúsculas e de luz, tudo a chocar com tudo.',
          'Passados cerca de 380 000 anos, tinha arrefecido o suficiente para cada protão apanhar um eletrão e ficar com ele. Foram os primeiros átomos, e quase todos eram de hidrogénio. O nevoeiro desfez-se e a luz voou livre. O hidrogénio do teu copo de água foi feito nessa altura: é quase tão velho como o universo!',
        ],
        sci: [
          'Nos primeiros minutos depois do Big Bang, há 13,8 mil milhões de anos, neutrões e protões fundiram-se em hélio-4 e em vestígios de deutério, hélio-3 e lítio-7; o resto ficou como protões soltos. Ficou cerca de 75% de hidrogénio e 25% de hélio em massa (cerca de 92% de hidrogénio em número de núcleos), a mistura que ainda se mede nas estrelas e nuvens de gás mais antigas.',
          'Durante 380 000 anos, os eletrões livres dispersaram a luz. Quando o universo arrefeceu até cerca de 3000 K, juntaram-se aos núcleos em átomos neutros (a recombinação) e a luz ficou livre; esticada pela expansão até às micro-ondas, a 2,7 K, foi descoberta em 1965 por Arno Penzias e Robert Wilson (Prémio Nobel da Física de 1978). Em 1925, Cecilia Payne mostrou pelos espetros das estrelas que também elas são sobretudo hidrogénio.',
        ],
      },
      pl: {
        kid: [
          '13,8 miliarda lat temu cały wszechświat był ściśnięty i niesamowicie gorący, a potem zaczął rosnąć i stygnąć: to Wielki Wybuch. Na początku było o wiele za gorąco na atomy: była tylko świecąca mgła malutkich cząstek i światła, w której wszystko zderzało się ze wszystkim.',
          'Po około 380 000 lat ostygł na tyle, że każdy proton mógł złapać elektron i go zatrzymać. Tak powstały pierwsze atomy i prawie wszystkie były atomami wodoru. Mgła się rozwiała, a światło poleciało swobodnie. Wodór w twojej szklance wody powstał właśnie wtedy: jest prawie tak stary jak wszechświat!',
        ],
        sci: [
          'W pierwszych minutach po Wielkim Wybuchu, 13,8 miliarda lat temu, neutrony i protony połączyły się w hel-4 oraz śladowe ilości deuteru, helu-3 i litu-7; reszta pozostała pojedynczymi protonami. Zostało około 75% wodoru i 25% helu masowo (około 92% wodoru według liczby jąder), i taką mieszankę wciąż mierzy się w najstarszych gwiazdach i obłokach gazu.',
          'Przez 380 000 lat swobodne elektrony rozpraszały światło. Gdy wszechświat ostygł do około 3000 K, połączyły się z jądrami w obojętne atomy (rekombinacja) i światło stało się wolne; rozciągnięte przez ekspansję do mikrofal o temperaturze 2,7 K, odkryli je w 1965 roku Arno Penzias i Robert Wilson (Nagroda Nobla w dziedzinie fizyki 1978). W 1925 roku Cecilia Payne wykazała na podstawie widm gwiazd, że one również składają się głównie z wodoru.',
        ],
      },
      de: {
        kid: [
          'Vor 13,8 Milliarden Jahren war das ganze Universum zusammengedrängt und unvorstellbar heiß, und dann begann es zu wachsen und abzukühlen: der Urknall. Anfangs war es viel zu heiß für Atome: nur ein leuchtender Nebel aus winzigen Teilchen und Licht, in dem alles gegen alles stieß.',
          'Nach etwa 380.000 Jahren war es so weit abgekühlt, dass jedes Proton ein Elektron einfangen und behalten konnte. Das waren die ersten Atome, und fast alle waren Wasserstoff. Der Nebel lichtete sich, und das Licht flog frei davon. Der Wasserstoff in deinem Glas Wasser ist damals entstanden: Er ist fast so alt wie das Universum!',
        ],
        sci: [
          'In den ersten Minuten nach dem Urknall, vor 13,8 Milliarden Jahren, verschmolzen Neutronen und Protonen zu Helium-4 und zu Spuren von Deuterium, Helium-3 und Lithium-7; der Rest blieb einzelne Protonen. Übrig blieben etwa 75% Wasserstoff und 25% Helium nach Masse (etwa 92% Wasserstoff nach Zahl der Kerne), die Mischung, die man noch heute in den ältesten Sternen und Gaswolken misst.',
          '380.000 Jahre lang streuten freie Elektronen das Licht. Als das Universum auf etwa 3000 K abgekühlt war, verbanden sie sich mit den Kernen zu neutralen Atomen (Rekombination), und das Licht wurde frei; durch die Ausdehnung zu Mikrowellen von 2,7 K gestreckt, wurde es 1965 von Arno Penzias und Robert Wilson entdeckt (Nobelpreis für Physik 1978). 1925 zeigte Cecilia Payne anhand der Sternspektren, dass auch die Sterne größtenteils aus Wasserstoff bestehen.',
        ],
      },
    },
  },
  {
    id: 'airship',
    color: '#6fb6ff',
    title: {
      en: 'How can a gas lift a ship?',
      'pt-pt': 'Como pode um gás erguer um dirigível?',
      pl: 'Jak gaz może unieść statek?',
      de: 'Wie kann Gas ein Schiff heben?',
    },
    story: {
      en: {
        kid: [
          'Hydrogen is the lightest gas of all: the hydrogen in a balloon weighs about 14 times less than the air it pushes aside, so the air pushes the balloon up, as water pushes up a beach ball. In 1783, in Paris, Jacques Charles and Nicolas Robert flew in a silk balloon filled with hydrogen while a huge crowd watched, and floated over the countryside for two hours.',
          'Later, giant airships floated on hydrogen and carried passengers across the Atlantic. But hydrogen burns very easily: in 1937 the airship Hindenburg caught fire as it landed in the United States and burned in about half a minute, though most of the people on board escaped. Since then airships and party balloons have used helium, which lifts almost as well and cannot burn.',
        ],
        sci: [
          'A balloon is pushed up by the weight of the air it displaces (Archimedes). At 20 °C a cubic metre of air weighs about 1.20 kg and one of hydrogen about 0.084 kg, so each cubic metre of hydrogen lifts about 1.1 kg; helium (0.17 kg per cubic metre) lifts about 1.0 kg, some 93% as much. Charles’s balloon of 1 December 1783 was filled with hydrogen made from iron and sulfuric acid, and flew about 36 km from the Tuileries garden.',
          'The Hindenburg (LZ 129, 245 m long) held about 200,000 cubic metres of hydrogen. It had been designed for helium, but the United States, which had nearly all the world’s helium, would not export it. On 6 May 1937 it caught fire while mooring at Lakehurst, New Jersey: 35 of the 97 people on board and one man on the ground died. Hydrogen burns in air at anywhere from 4% to 75% by volume, with a pale flame that is hard to see by day.',
        ],
      },
      'pt-pt': {
        kid: [
          'O hidrogénio é o gás mais leve de todos: o hidrogénio de um balão pesa cerca de 14 vezes menos do que o ar que ele afasta, por isso o ar empurra o balão para cima, como a água empurra uma bola de praia. Em 1783, em Paris, Jacques Charles e Nicolas Robert voaram num balão de seda cheio de hidrogénio, diante de uma multidão enorme, e flutuaram por cima dos campos durante duas horas.',
          'Mais tarde, dirigíveis gigantes flutuavam com hidrogénio e levavam passageiros através do Atlântico. Mas o hidrogénio arde com muita facilidade: em 1937, o dirigível Hindenburg pegou fogo ao aterrar nos Estados Unidos e ardeu em cerca de meio minuto, embora a maior parte das pessoas a bordo tenha escapado. Desde então, os dirigíveis e os balões das festas usam hélio, que levanta quase tanto e não arde.',
        ],
        sci: [
          'Um balão é empurrado para cima pelo peso do ar que desloca (Arquimedes). A 20 °C, um metro cúbico de ar pesa cerca de 1,20 kg e um de hidrogénio cerca de 0,084 kg, por isso cada metro cúbico de hidrogénio levanta cerca de 1,1 kg; o hélio (0,17 kg por metro cúbico) levanta cerca de 1,0 kg, uns 93% disso. O balão de Charles, a 1 de dezembro de 1783, foi cheio com hidrogénio obtido de ferro e ácido sulfúrico e voou cerca de 36 km a partir do jardim das Tulherias.',
          'O Hindenburg (LZ 129, com 245 m de comprimento) levava cerca de 200 000 metros cúbicos de hidrogénio. Tinha sido projetado para hélio, mas os Estados Unidos, que tinham quase todo o hélio do mundo, não o exportavam. A 6 de maio de 1937 pegou fogo ao atracar em Lakehurst, Nova Jérsia: morreram 35 das 97 pessoas a bordo e um homem em terra. O hidrogénio arde no ar em qualquer proporção entre 4% e 75% em volume, com uma chama pálida, difícil de ver de dia.',
        ],
      },
      pl: {
        kid: [
          'Wodór to najlżejszy gaz ze wszystkich: wodór w balonie waży około 14 razy mniej niż powietrze, które balon rozpycha, więc powietrze wypycha balon w górę, tak jak woda wypycha piłkę plażową. W 1783 roku w Paryżu Jacques Charles i Nicolas Robert polecieli jedwabnym balonem napełnionym wodorem na oczach ogromnego tłumu i przez dwie godziny płynęli nad polami.',
          'Później ogromne sterowce unosiły się dzięki wodorowi i przewoziły pasażerów przez Atlantyk. Ale wodór bardzo łatwo się pali: w 1937 roku sterowiec Hindenburg zapalił się podczas lądowania w Stanach Zjednoczonych i spłonął w około pół minuty, choć większość ludzi na pokładzie się uratowała. Od tamtej pory sterowce i balony na przyjęcia napełnia się helem, który unosi prawie tak samo dobrze i nie może się palić.',
        ],
        sci: [
          'Balon wypycha w górę ciężar powietrza, które wypiera (Archimedes). W 20 °C metr sześcienny powietrza waży około 1,20 kg, a wodoru około 0,084 kg, więc każdy metr sześcienny wodoru unosi około 1,1 kg; hel (0,17 kg na metr sześcienny) unosi około 1,0 kg, mniej więcej 93% tego. Balon Charles’a z 1 grudnia 1783 roku napełniono wodorem otrzymanym z żelaza i kwasu siarkowego; przeleciał około 36 km od ogrodu Tuileries.',
          'Hindenburg (LZ 129, długi na 245 m) mieścił około 200 000 metrów sześciennych wodoru. Zaprojektowano go do helu, ale Stany Zjednoczone, które miały prawie cały hel świata, nie chciały go eksportować. 6 maja 1937 roku zapalił się podczas cumowania w Lakehurst w stanie New Jersey: zginęło 35 z 97 osób na pokładzie i jeden człowiek na ziemi. Wodór pali się w powietrzu przy każdym stężeniu od 4% do 75% objętości, bladym płomieniem, trudnym do zobaczenia za dnia.',
        ],
      },
      de: {
        kid: [
          'Wasserstoff ist das leichteste Gas von allen: Der Wasserstoff in einem Ballon wiegt etwa 14-mal weniger als die Luft, die er verdrängt, deshalb drückt die Luft den Ballon nach oben, so wie Wasser einen Wasserball nach oben drückt. 1783 flogen Jacques Charles und Nicolas Robert in Paris vor einer riesigen Menschenmenge in einem Seidenballon voller Wasserstoff und schwebten zwei Stunden lang über das Land.',
          'Später schwebten riesige Luftschiffe mit Wasserstoff und brachten Fahrgäste über den Atlantik. Aber Wasserstoff brennt sehr leicht: 1937 fing das Luftschiff Hindenburg bei der Landung in den USA Feuer und verbrannte in etwa einer halben Minute, doch die meisten Menschen an Bord kamen davon. Seitdem fliegen Luftschiffe und Partyballons mit Helium, das fast genauso gut trägt und nicht brennen kann.',
        ],
        sci: [
          'Ein Ballon wird vom Gewicht der Luft, die er verdrängt, nach oben gedrückt (Archimedes). Bei 20 °C wiegt ein Kubikmeter Luft etwa 1,20 kg und einer Wasserstoff etwa 0,084 kg, also trägt jeder Kubikmeter Wasserstoff etwa 1,1 kg; Helium (0,17 kg pro Kubikmeter) trägt etwa 1,0 kg, rund 93% davon. Charles’ Ballon vom 1. Dezember 1783 wurde mit Wasserstoff aus Eisen und Schwefelsäure gefüllt und flog vom Tuileriengarten aus etwa 36 km weit.',
          'Die Hindenburg (LZ 129, 245 m lang) fasste etwa 200.000 Kubikmeter Wasserstoff. Sie war für Helium gebaut worden, aber die USA, die fast das ganze Helium der Welt hatten, wollten es nicht ausführen. Am 6. Mai 1937 fing sie beim Festmachen in Lakehurst, New Jersey, Feuer: 35 der 97 Menschen an Bord und ein Mann am Boden starben. Wasserstoff brennt in Luft bei jedem Anteil zwischen 4% und 75% (Volumen), mit einer blassen Flamme, die man bei Tag kaum sieht.',
        ],
      },
    },
  },
  {
    id: 'bond',
    color: '#3fe0d0',
    title: {
      en: 'Why can an insect walk on water?',
      'pt-pt': 'Porque é que um inseto anda na água?',
      pl: 'Jak owad może chodzić po wodzie?',
      de: 'Wie läuft ein Insekt übers Wasser?',
    },
    story: {
      en: {
        kid: [
          'About six of every ten atoms in your body are hydrogen, and most of them are in water. In each water molecule the two hydrogens hold tight to their own oxygen, and each also gives a little tug to the oxygen of a neighbouring molecule. That gentle grip is called a hydrogen bond.',
          'Billions of these little tugs make water sticky. They pull its surface tight like a skin, so a pond skater can stand on it without sinking, and they help pull water all the way up a tall tree. Without them water would boil far below zero, and the Earth would have no seas. They even hold the two strands of your DNA together, like the teeth of a zip.',
        ],
        sci: [
          'Oxygen pulls the shared electrons of an O-H bond towards itself (electronegativity 3.44 against hydrogen’s 2.20), so each hydrogen in water carries a small positive charge. A hydrogen bond, O-H···O, is its attraction to a lone pair of a neighbouring oxygen: about 20 kJ/mol, some twenty times weaker than the O-H bond itself (about 460 kJ/mol).',
          'Each molecule can take part in up to four, so liquid water is a network that breaks and re-forms within picoseconds. It gives water its high surface tension (72 mN/m at 25 °C, enough to hold up a pond skater), the cohesion that pulls sap up trees, and a boiling point of 100 °C, where the trend of H2S, H2Se and H2Te points to about −80 °C. In DNA, hydrogen bonds join each base pair, two for A-T and three for G-C, weak enough for the strands to part when a cell copies them.',
        ],
      },
      'pt-pt': {
        kid: [
          'Cerca de seis em cada dez átomos do teu corpo são de hidrogénio, e a maior parte está na água. Em cada molécula de água, os dois hidrogénios agarram-se bem ao seu oxigénio, e cada um dá também um pequeno puxão ao oxigénio de uma molécula vizinha. Esse aperto suave chama-se ligação de hidrogénio.',
          'Milhares de milhões destes pequenos puxões tornam a água pegajosa. Esticam a sua superfície como uma pele, por isso um alfaiate, o inseto que patina na água, consegue estar em cima dela sem se afundar, e ajudam a puxar a água até ao cimo das árvores altas. Sem eles, a água ferveria muito abaixo de zero e a Terra não teria mares. Até seguram as duas cadeias do teu ADN, como os dentes de um fecho de correr.',
        ],
        sci: [
          'O oxigénio puxa para si os eletrões partilhados de uma ligação O-H (eletronegatividade 3,44, contra 2,20 do hidrogénio), por isso cada hidrogénio da água fica com uma pequena carga positiva. Uma ligação de hidrogénio, O-H···O, é a atração desse hidrogénio por um par de eletrões não partilhado de um oxigénio vizinho: cerca de 20 kJ/mol, umas vinte vezes mais fraca do que a própria ligação O-H (cerca de 460 kJ/mol).',
          'Cada molécula pode participar em até quatro, por isso a água líquida é uma rede que se desfaz e se refaz em picossegundos. Isto dá à água a sua grande tensão superficial (72 mN/m a 25 °C, o suficiente para segurar um alfaiate), a coesão que puxa a seiva pelas árvores acima e um ponto de ebulição de 100 °C, quando a tendência do H2S, H2Se e H2Te aponta para cerca de −80 °C. No ADN, ligações de hidrogénio unem cada par de bases, duas no A-T e três no G-C, fracas o suficiente para as cadeias se separarem quando uma célula as copia.',
        ],
      },
      pl: {
        kid: [
          'Około sześciu na każde dziesięć atomów w twoim ciele to wodór, a większość z nich jest w wodzie. W każdej cząsteczce wody dwa atomy wodoru mocno trzymają się swojego tlenu, a każdy z nich lekko ciągnie też tlen sąsiedniej cząsteczki. Ten delikatny uchwyt nazywa się wiązaniem wodorowym.',
          'Miliardy takich małych pociągnięć sprawiają, że woda jest lepka. Napinają jej powierzchnię jak skórkę, więc nartnik może po niej stać i nie tonie, i pomagają wciągać wodę aż na szczyt wysokiego drzewa. Bez nich woda wrzałaby dużo poniżej zera, a Ziemia nie miałaby mórz. Trzymają nawet razem dwie nici twojego DNA, jak ząbki zamka błyskawicznego.',
        ],
        sci: [
          'Tlen przyciąga do siebie wspólne elektrony wiązania O-H (elektroujemność 3,44 wobec 2,20 dla wodoru), więc każdy wodór w wodzie ma mały ładunek dodatni. Wiązanie wodorowe, O-H···O, to przyciąganie tego wodoru przez wolną parę elektronową sąsiedniego tlenu: około 20 kJ/mol, mniej więcej dwadzieścia razy słabsze niż samo wiązanie O-H (około 460 kJ/mol).',
          'Każda cząsteczka może tworzyć do czterech takich wiązań, więc ciekła woda to sieć, która rozpada się i odtwarza w ciągu pikosekund. Daje to wodzie duże napięcie powierzchniowe (72 mN/m w 25 °C, dość, by utrzymać nartnika), spójność, która wciąga sok w górę drzew, i temperaturę wrzenia 100 °C, podczas gdy trend H2S, H2Se i H2Te wskazuje na około −80 °C. W DNA wiązania wodorowe łączą każdą parę zasad, dwa w parze A-T i trzy w G-C, na tyle słabe, że nici rozchodzą się, gdy komórka je kopiuje.',
        ],
      },
      de: {
        kid: [
          'Etwa sechs von zehn Atomen in deinem Körper sind Wasserstoff, und die meisten davon stecken im Wasser. In jedem Wassermolekül halten sich die beiden Wasserstoffatome fest an ihrem Sauerstoff, und jedes zieht außerdem ein bisschen am Sauerstoff eines Nachbarmoleküls. Dieser sanfte Griff heißt Wasserstoffbrücke.',
          'Milliarden dieser kleinen Griffe machen das Wasser klebrig. Sie spannen seine Oberfläche wie eine Haut, sodass ein Wasserläufer darauf stehen kann, ohne unterzugehen, und sie helfen, das Wasser bis in die Spitze eines hohen Baums zu ziehen. Ohne sie würde Wasser weit unter null kochen, und die Erde hätte keine Meere. Sie halten sogar die beiden Stränge deiner DNA zusammen, wie die Zähne eines Reißverschlusses.',
        ],
        sci: [
          'Der Sauerstoff zieht die gemeinsamen Elektronen einer O-H-Bindung zu sich (Elektronegativität 3,44 gegenüber 2,20 beim Wasserstoff), deshalb trägt jedes Wasserstoffatom im Wasser eine kleine positive Ladung. Eine Wasserstoffbrücke, O-H···O, ist seine Anziehung durch ein freies Elektronenpaar eines benachbarten Sauerstoffs: etwa 20 kJ/mol, rund zwanzigmal schwächer als die O-H-Bindung selbst (etwa 460 kJ/mol).',
          'Jedes Molekül kann an bis zu vier davon teilhaben, deshalb ist flüssiges Wasser ein Netz, das innerhalb von Pikosekunden reißt und sich neu knüpft. Es gibt dem Wasser seine hohe Oberflächenspannung (72 mN/m bei 25 °C, genug für einen Wasserläufer), den Zusammenhalt, der den Saft in den Bäumen nach oben zieht, und einen Siedepunkt von 100 °C, wo der Trend von H2S, H2Se und H2Te auf etwa −80 °C deutet. In der DNA verbinden Wasserstoffbrücken jedes Basenpaar, zwei bei A-T und drei bei G-C, schwach genug, dass sich die Stränge trennen, wenn eine Zelle sie kopiert.',
        ],
      },
    },
  },
  {
    id: 'fuel',
    color: '#7ee86a',
    title: {
      en: 'What engine puffs out only water?',
      'pt-pt': 'Que motor só deita água pelo escape?',
      pl: 'Jaki silnik wydmuchuje tylko wodę?',
      de: 'Welcher Motor pustet nur Wasser aus?',
    },
    story: {
      en: {
        kid: [
          'When hydrogen burns with oxygen, the only thing it makes is water. Big rockets use it: the Space Shuttle’s huge orange tank held mostly liquid hydrogen, so cold (−253 °C) that it could freeze the air. Its three main engines roared, and what came out of them was mostly scorching hot steam.',
          'A fuel cell joins hydrogen and oxygen quietly, with no flame, and gives electricity instead of fire. The Apollo astronauts flying to the Moon got their electricity from fuel cells, and drank the water they made. Today some buses, cars and trains run on hydrogen, and from their exhaust pipes drips only water.',
        ],
        sci: [
          '2 H2 + O2 → 2 H2O gives about 286 kJ per mole of hydrogen (to liquid water; 242 kJ to steam): about 142 MJ per kilogram, some three times as much as petrol. But liquid hydrogen weighs only about 71 grams per litre, so its tanks are huge: the Shuttle’s external tank held about 1.5 million litres of it, nearly three times the volume of its liquid oxygen. The Shuttle’s RS-25 engines and the Saturn V’s J-2 upper-stage engines burned liquid hydrogen with liquid oxygen.',
          'In a fuel cell a catalyst splits H2 into protons and electrons at the anode; the electrons go round the outer circuit and do work, the protons cross the electrolyte (in the common PEM type, a membrane), and at the cathode both combine with oxygen into water, at efficiencies of about 40 to 60%. William Grove showed the principle in 1839. Each Apollo service module carried three fuel cells, and the Coradia iLint, the first hydrogen train in passenger service, began running in Lower Saxony, Germany, in 2018.',
        ],
      },
      'pt-pt': {
        kid: [
          'Quando o hidrogénio arde com o oxigénio, a única coisa que faz é água. Os grandes foguetões usam-no: o enorme tanque cor de laranja do vaivém espacial levava sobretudo hidrogénio líquido, tão frio (−253 °C) que podia congelar o ar. Os seus três motores principais rugiam, e o que saía deles era sobretudo vapor de água a escaldar.',
          'Uma pilha de combustível junta o hidrogénio e o oxigénio sem barulho e sem chama, e dá eletricidade em vez de fogo. Os astronautas da Apollo que voaram até à Lua tinham eletricidade de pilhas de combustível e bebiam a água que elas faziam. Hoje há autocarros, carros e comboios a hidrogénio, e do tubo de escape só lhes pinga água.',
        ],
        sci: [
          '2 H2 + O2 → 2 H2O liberta cerca de 286 kJ por mole de hidrogénio (até água líquida; 242 kJ até vapor): cerca de 142 MJ por quilograma, umas três vezes mais do que a gasolina. Mas o hidrogénio líquido pesa só cerca de 71 gramas por litro, por isso os tanques são enormes: o tanque externo do vaivém levava cerca de 1,5 milhões de litros, quase três vezes o volume do seu oxigénio líquido. Os motores RS-25 do vaivém e os J-2 dos andares superiores do Saturno V queimavam hidrogénio líquido com oxigénio líquido.',
          'Numa pilha de combustível, um catalisador separa o H2 em protões e eletrões no ânodo; os eletrões dão a volta pelo circuito exterior e fazem trabalho, os protões atravessam o eletrólito (no tipo PEM, o mais comum, uma membrana) e no cátodo juntam-se ao oxigénio e formam água, com rendimentos de cerca de 40 a 60%. William Grove mostrou o princípio em 1839. Cada módulo de serviço da Apollo levava três pilhas de combustível, e o Coradia iLint, o primeiro comboio a hidrogénio com passageiros, começou a circular na Baixa Saxónia, na Alemanha, em 2018.',
        ],
      },
      pl: {
        kid: [
          'Kiedy wodór pali się z tlenem, powstaje z tego tylko woda. Używają go wielkie rakiety: ogromny pomarańczowy zbiornik promu kosmicznego mieścił głównie ciekły wodór, tak zimny (−253 °C), że mógłby zamrozić powietrze. Trzy główne silniki ryczały, a wylatywała z nich głównie gorąca para wodna.',
          'Ogniwo paliwowe łączy wodór z tlenem po cichu, bez płomienia, i zamiast ognia daje prąd. Astronauci programu Apollo, lecąc na Księżyc, mieli prąd z ogniw paliwowych i pili wodę, którą one wytwarzały. Dziś niektóre autobusy, samochody i pociągi jeżdżą na wodór, a z ich rury wydechowej kapie tylko woda.',
        ],
        sci: [
          '2 H2 + O2 → 2 H2O daje około 286 kJ na mol wodoru (do ciekłej wody; 242 kJ do pary): około 142 MJ na kilogram, mniej więcej trzy razy więcej niż benzyna. Ale ciekły wodór waży tylko około 71 gramów na litr, więc jego zbiorniki są ogromne: zewnętrzny zbiornik promu mieścił około 1,5 miliona litrów wodoru, prawie trzy razy więcej niż ciekłego tlenu. Silniki RS-25 promu i silniki J-2 górnych stopni rakiety Saturn V spalały ciekły wodór w ciekłym tlenie.',
          'W ogniwie paliwowym katalizator rozdziela H2 na protony i elektrony na anodzie; elektrony płyną zewnętrznym obwodem i wykonują pracę, protony przechodzą przez elektrolit (w najczęstszym typie, PEM, przez membranę), a na katodzie łączą się z tlenem w wodę, ze sprawnością około 40 do 60%. William Grove pokazał tę zasadę w 1839 roku. Każdy moduł serwisowy Apollo miał trzy ogniwa paliwowe, a Coradia iLint, pierwszy pociąg wodorowy w ruchu pasażerskim, zaczął jeździć w Dolnej Saksonii w Niemczech w 2018 roku.',
        ],
      },
      de: {
        kid: [
          'Wenn Wasserstoff mit Sauerstoff verbrennt, entsteht dabei nur Wasser. Große Raketen nutzen das: Der riesige orange Tank des Spaceshuttles war vor allem mit flüssigem Wasserstoff gefüllt, so kalt (−253 °C), dass er die Luft gefrieren lassen konnte. Seine drei Haupttriebwerke donnerten, und heraus kam vor allem glühend heißer Wasserdampf.',
          'Eine Brennstoffzelle verbindet Wasserstoff und Sauerstoff leise, ohne Flamme, und gibt statt Feuer Strom. Die Apollo-Astronauten bekamen auf dem Flug zum Mond ihren Strom aus Brennstoffzellen und tranken das Wasser, das dabei entstand. Heute fahren manche Busse, Autos und Züge mit Wasserstoff, und aus ihrem Auspuff tropft nur Wasser.',
        ],
        sci: [
          '2 H2 + O2 → 2 H2O liefert etwa 286 kJ pro Mol Wasserstoff (zu flüssigem Wasser; 242 kJ zu Dampf): etwa 142 MJ pro Kilogramm, rund dreimal so viel wie Benzin. Aber flüssiger Wasserstoff wiegt nur etwa 71 Gramm pro Liter, deshalb sind seine Tanks riesig: Der Außentank des Shuttles fasste etwa 1,5 Millionen Liter davon, fast das Dreifache seines flüssigen Sauerstoffs. Die RS-25-Triebwerke des Shuttles und die J-2-Triebwerke der Oberstufen der Saturn V verbrannten flüssigen Wasserstoff mit flüssigem Sauerstoff.',
          'In einer Brennstoffzelle spaltet ein Katalysator an der Anode H2 in Protonen und Elektronen; die Elektronen fließen durch den äußeren Stromkreis und verrichten Arbeit, die Protonen wandern durch den Elektrolyten (beim häufigsten Typ, PEM, eine Membran), und an der Kathode verbinden sich beide mit Sauerstoff zu Wasser, mit Wirkungsgraden von etwa 40 bis 60%. William Grove zeigte das Prinzip 1839. Jedes Apollo-Servicemodul hatte drei Brennstoffzellen, und der Coradia iLint, der erste Wasserstoffzug im Personenverkehr, fuhr 2018 in Niedersachsen los.',
        ],
      },
    },
  },
  {
    id: 'cavendish',
    color: '#ffd166',
    title: {
      en: 'A fire that makes water?',
      'pt-pt': 'Um fogo que faz água?',
      pl: 'Ogień, który robi wodę?',
      de: 'Ein Feuer, das Wasser macht?',
    },
    story: {
      en: {
        kid: [
          'In 1766 a very shy English scientist, Henry Cavendish, dropped bits of zinc and iron into acid and caught the bubbles in bottles standing upside down in water. The gas was much lighter than air, and near a flame it went pop! He called it “inflammable air”.',
          'Years later, in 1781, he set the gas mixed with air alight inside a closed glass vessel with an electric spark, and dew appeared on the glass: water! In Paris Antoine Lavoisier understood what it meant: water is not an element, it is made of this gas and oxygen. He gave the gas its name: hydrogène, the water maker.',
        ],
        sci: [
          'Cavendish’s first paper on “factitious airs” (1766) showed that zinc, iron and tin dissolving in dilute sulfuric or hydrochloric acid all give one and the same gas, which he collected over water and weighed: it was far lighter than common air. Like most chemists of his day he explained burning with phlogiston, and he took the gas for phlogiston itself, set free from the metal.',
          'In 1781 he exploded mixtures of it and air with an electric spark in a sealed glass globe: about two volumes of inflammable air used up one of oxygen, and the dew was pure water (published 1784). James Watt came to a similar idea, and Lavoisier and Pierre-Simon Laplace made water from the two gases in Paris in June 1783: for Lavoisier water was a compound. The new chemical names of 1787 called the gas hydrogène, from the Greek for water and for to produce.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em 1766, um cientista inglês muito tímido, Henry Cavendish, deitou bocadinhos de zinco e de ferro em ácido e apanhou as bolhas em garrafas viradas ao contrário dentro de água. O gás era muito mais leve do que o ar e, perto de uma chama, fazia pum! Chamou-lhe «ar inflamável».',
          'Anos depois, em 1781, acendeu o gás misturado com ar dentro de um recipiente de vidro fechado, com uma faísca elétrica, e apareceu orvalho no vidro: água! Em Paris, Antoine Lavoisier percebeu o que isso queria dizer: a água não é um elemento, é feita deste gás e de oxigénio. Foi ele quem deu nome ao gás: hydrogène, o que faz água.',
        ],
        sci: [
          'O primeiro artigo de Cavendish sobre os «ares factícios» (1766) mostrou que o zinco, o ferro e o estanho, ao dissolverem-se em ácido sulfúrico ou clorídrico diluído, dão todos o mesmo gás, que ele recolheu sobre água e pesou: era muito mais leve do que o ar comum. Como quase todos os químicos do seu tempo, explicava a combustão pelo flogisto, e tomou o gás pelo próprio flogisto, libertado do metal.',
          'Em 1781 fez explodir misturas do gás com ar, com uma faísca elétrica, num globo de vidro fechado: cerca de dois volumes de ar inflamável gastavam um de oxigénio, e o orvalho era água pura (publicado em 1784). James Watt chegou a uma ideia parecida, e Lavoisier e Pierre-Simon Laplace fizeram água a partir dos dois gases em Paris, em junho de 1783: para Lavoisier, a água era um composto. Os novos nomes químicos de 1787 chamaram ao gás hydrogène, do grego para água e para gerar.',
        ],
      },
      pl: {
        kid: [
          'W 1766 roku bardzo nieśmiały angielski uczony, Henry Cavendish, wrzucał kawałki cynku i żelaza do kwasu i łapał bąbelki do butelek odwróconych do góry dnem w wodzie. Gaz był dużo lżejszy od powietrza, a przy płomieniu robił pyk! Nazwał go „palnym powietrzem”.',
          'Wiele lat później, w 1781 roku, zapalił ten gaz zmieszany z powietrzem w zamkniętym szklanym naczyniu iskrą elektryczną i na szkle pojawiła się rosa: woda! W Paryżu Antoine Lavoisier zrozumiał, co to znaczy: woda nie jest pierwiastkiem, tylko składa się z tego gazu i tlenu. To on nadał gazowi nazwę: hydrogène, czyli „twórca wody”.',
        ],
        sci: [
          'Pierwsza praca Cavendisha o „sztucznych powietrzach” (1766) pokazała, że cynk, żelazo i cyna, rozpuszczając się w rozcieńczonym kwasie siarkowym lub solnym, dają ten sam gaz, który zbierał nad wodą i ważył: był dużo lżejszy od zwykłego powietrza. Jak większość chemików swoich czasów tłumaczył spalanie flogistonem i uznał ten gaz za sam flogiston, uwolniony z metalu.',
          'W 1781 roku odpalał iskrą elektryczną mieszaniny tego gazu z powietrzem w zamkniętej szklanej kuli: około dwie objętości palnego powietrza zużywały jedną objętość tlenu, a rosa była czystą wodą (opublikował to w 1784 roku). James Watt doszedł do podobnej myśli, a Lavoisier i Pierre-Simon Laplace otrzymali wodę z tych dwóch gazów w Paryżu w czerwcu 1783 roku: dla Lavoisiera woda była związkiem. Nowe nazwy chemiczne z 1787 roku nazwały ten gaz hydrogène, od greckich słów oznaczających wodę i wytwarzanie.',
        ],
      },
      de: {
        kid: [
          '1766 warf ein sehr schüchterner englischer Forscher, Henry Cavendish, Stückchen Zink und Eisen in Säure und fing die Bläschen in Flaschen auf, die kopfüber im Wasser standen. Das Gas war viel leichter als Luft, und an einer Flamme machte es plopp! Er nannte es „brennbare Luft“.',
          'Jahre später, 1781, zündete er das Gas gemischt mit Luft in einem geschlossenen Glasgefäß mit einem elektrischen Funken, und auf dem Glas erschien Tau: Wasser! In Paris verstand Antoine Lavoisier, was das bedeutete: Wasser ist kein Element, sondern besteht aus diesem Gas und Sauerstoff. Er gab dem Gas seinen Namen: hydrogène, der Wassermacher.',
        ],
        sci: [
          'Cavendishs erste Arbeit über „künstliche Luftarten“ (1766) zeigte, dass Zink, Eisen und Zinn in verdünnter Schwefel- oder Salzsäure alle dasselbe Gas geben, das er über Wasser auffing und wog: Es war viel leichter als gewöhnliche Luft. Wie die meisten Chemiker seiner Zeit erklärte er das Brennen mit dem Phlogiston und hielt das Gas für das Phlogiston selbst, aus dem Metall befreit.',
          '1781 brachte er Gemische aus dem Gas und Luft in einer verschlossenen Glaskugel mit einem elektrischen Funken zur Explosion: Etwa zwei Volumen brennbare Luft verbrauchten eines Sauerstoff, und der Tau war reines Wasser (veröffentlicht 1784). James Watt kam auf einen ähnlichen Gedanken, und Lavoisier und Pierre-Simon Laplace machten im Juni 1783 in Paris Wasser aus den beiden Gasen: Für Lavoisier war Wasser eine Verbindung. Die neuen chemischen Namen von 1787 nannten das Gas hydrogène, nach den griechischen Wörtern für Wasser und erzeugen.',
        ],
      },
    },
  },
  {
    id: 'jupiter',
    color: '#ff7062',
    title: {
      en: 'What is inside Jupiter?',
      'pt-pt': 'O que há dentro de Júpiter?',
      pl: 'Co jest w środku Jowisza?',
      de: 'Was steckt im Jupiter?',
    },
    story: {
      en: {
        kid: [
          'Jupiter, the biggest planet, is made mostly of hydrogen, like the Sun. It has no ground to stand on: under its stripy clouds the hydrogen gets thicker and thicker, squeezed by the weight of all the gas above it, until it is more like a liquid than a gas.',
          'Deeper still, at millions of times the pressure of the air around you, hydrogen turns into a strange liquid metal that carries electricity. As Jupiter spins, this deep sea of metal makes the strongest magnetic field of any planet, and lights up glowing auroras over its poles.',
        ],
        sci: [
          'Jupiter (318 Earth masses) is about three quarters hydrogen and a quarter helium by mass. Below the clouds the hydrogen is a hot fluid, past its critical point, that grows denser with depth; at around 1 to 2 million bar and several thousand kelvin it is thought to become a liquid metal, its electrons no longer bound to single protons. Eugene Wigner and Hillard Huntington predicted metallic hydrogen in 1935, and in 1996 shock experiments at Livermore made fluid hydrogen conduct like a metal at about 1.4 million bar and 3000 K.',
          'Currents in that conducting layer drive Jupiter’s dynamo: its magnetic moment is about 20,000 times Earth’s, and its magnetosphere, if we could see it, would look bigger than the full Moon in our sky. The Galileo probe parachuted about 150 km down into the clouds in 1995 and measured about 22 bar before it fell silent; the Juno orbiter, there since 2016, has found that the core is not a small solid ball but dilute, mixed far out into the hydrogen.',
        ],
      },
      'pt-pt': {
        kid: [
          'Júpiter, o maior planeta, é feito sobretudo de hidrogénio, como o Sol. Não tem chão onde se possa estar: por baixo das nuvens às riscas, o hidrogénio fica cada vez mais espesso, apertado pelo peso de todo o gás que tem por cima, até ser mais parecido com um líquido do que com um gás.',
          'Ainda mais fundo, a milhões de vezes a pressão do ar à tua volta, o hidrogénio transforma-se num estranho metal líquido que conduz eletricidade. Enquanto Júpiter gira, este mar fundo de metal faz o campo magnético mais forte de todos os planetas e acende auroras brilhantes sobre os seus polos.',
        ],
        sci: [
          'Júpiter (318 massas terrestres) é cerca de três quartos hidrogénio e um quarto hélio, em massa. Por baixo das nuvens, o hidrogénio é um fluido quente, acima do seu ponto crítico, que fica mais denso com a profundidade; por volta de 1 a 2 milhões de bar e vários milhares de kelvin, pensa-se que se torna um metal líquido, com os eletrões já não presos a protões isolados. Eugene Wigner e Hillard Huntington previram o hidrogénio metálico em 1935, e em 1996 experiências de choque em Livermore puseram hidrogénio fluido a conduzir como um metal a cerca de 1,4 milhões de bar e 3000 K.',
          'As correntes nessa camada condutora alimentam o dínamo de Júpiter: o seu momento magnético é cerca de 20 000 vezes o da Terra, e a sua magnetosfera, se a pudéssemos ver, pareceria maior do que a Lua cheia no nosso céu. A sonda Galileo desceu de paraquedas cerca de 150 km nas nuvens em 1995 e mediu cerca de 22 bar antes de se calar; a Juno, em órbita desde 2016, descobriu que o núcleo não é uma pequena bola sólida, mas difuso, misturado com o hidrogénio até muito longe.',
        ],
      },
      pl: {
        kid: [
          'Jowisz, największa planeta, składa się głównie z wodoru, tak jak Słońce. Nie ma gruntu, na którym można by stanąć: pod jego pasiastymi chmurami wodór robi się coraz gęstszy, ściskany ciężarem całego gazu nad nim, aż staje się bardziej podobny do cieczy niż do gazu.',
          'Jeszcze głębiej, pod ciśnieniem milionów razy większym niż ciśnienie powietrza wokół ciebie, wodór zamienia się w dziwny ciekły metal, który przewodzi prąd. Gdy Jowisz się obraca, to głębokie morze metalu wytwarza najsilniejsze pole magnetyczne ze wszystkich planet i zapala świecące zorze nad jego biegunami.',
        ],
        sci: [
          'Jowisz (318 mas Ziemi) to masowo mniej więcej w trzech czwartych wodór i w jednej czwartej hel. Pod chmurami wodór jest gorącym płynem powyżej punktu krytycznego, coraz gęstszym w głąb; przy około 1 do 2 milionów barów i kilku tysiącach kelwinów ma się zmieniać w ciekły metal, którego elektrony nie są już związane z pojedynczymi protonami. Eugene Wigner i Hillard Huntington przewidzieli metaliczny wodór w 1935 roku, a w 1996 roku w doświadczeniach z falą uderzeniową w Livermore płynny wodór przewodził prąd jak metal przy około 1,4 miliona barów i 3000 K.',
          'Prądy w tej przewodzącej warstwie napędzają dynamo Jowisza: jego moment magnetyczny jest około 20 000 razy większy niż Ziemi, a jego magnetosfera, gdybyśmy mogli ją zobaczyć, wyglądałaby na naszym niebie na większą niż Księżyc w pełni. Sonda Galileo opadła na spadochronie około 150 km w głąb chmur w 1995 roku i zmierzyła około 22 barów, zanim umilkła; sonda Juno, krążąca tam od 2016 roku, odkryła, że jądro nie jest małą twardą kulą, ale jest rozmyte i daleko wymieszane z wodorem.',
        ],
      },
      de: {
        kid: [
          'Jupiter, der größte Planet, besteht größtenteils aus Wasserstoff, wie die Sonne. Er hat keinen Boden, auf dem man stehen könnte: Unter seinen gestreiften Wolken wird der Wasserstoff immer dichter, zusammengepresst vom Gewicht des ganzen Gases darüber, bis er eher einer Flüssigkeit gleicht als einem Gas.',
          'Noch tiefer, beim Millionenfachen des Luftdrucks um dich herum, wird Wasserstoff zu einem seltsamen flüssigen Metall, das Strom leitet. Während Jupiter sich dreht, macht dieses tiefe Metallmeer das stärkste Magnetfeld aller Planeten und lässt über seinen Polen leuchtende Polarlichter aufflammen.',
        ],
        sci: [
          'Jupiter (318 Erdmassen) besteht nach Masse etwa zu drei Vierteln aus Wasserstoff und zu einem Viertel aus Helium. Unter den Wolken ist der Wasserstoff ein heißes Fluid jenseits seines kritischen Punkts, das mit der Tiefe dichter wird; bei etwa 1 bis 2 Millionen bar und mehreren tausend Kelvin wird er vermutlich zu einem flüssigen Metall, dessen Elektronen nicht mehr an einzelne Protonen gebunden sind. Eugene Wigner und Hillard Huntington sagten metallischen Wasserstoff 1935 voraus, und 1996 brachten Stoßwellenversuche in Livermore flüssigen Wasserstoff bei etwa 1,4 Millionen bar und 3000 K dazu, wie ein Metall zu leiten.',
          'Ströme in dieser leitenden Schicht treiben Jupiters Dynamo an: Sein magnetisches Moment ist etwa 20.000-mal so groß wie das der Erde, und seine Magnetosphäre würde an unserem Himmel größer als der Vollmond aussehen, wenn wir sie sehen könnten. Die Galileo-Sonde sank 1995 am Fallschirm etwa 150 km tief in die Wolken und maß etwa 22 bar, bevor sie verstummte; die Raumsonde Juno, seit 2016 dort im Orbit, fand heraus, dass der Kern keine kleine feste Kugel ist, sondern verdünnt und weit hinaus mit dem Wasserstoff vermischt.',
        ],
      },
    },
  },
  {
    id: 'radio',
    color: '#c47cff',
    title: {
      en: 'How would you write to aliens?',
      'pt-pt': 'Como escreverias a extraterrestres?',
      pl: 'Jak napisać list do kosmitów?',
      de: 'Wie schreibt man Außerirdischen?',
    },
    story: {
      en: {
        kid: [
          'The dark space between the stars holds thin, cold clouds of hydrogen. Now and then the electron of a hydrogen atom flips over, like a spinning top turning upside down, and the atom sends out a faint radio whisper, always exactly 21 centimetres long. One atom does it only about once in ten million years, but there are so many of them that radio telescopes hear the whisper everywhere, and used it to draw the first map of our galaxy’s spiral arms.',
          'Because every hydrogen atom in the universe whispers the same, scientists used it to write to aliens. Pioneer 10 and 11, launched in 1972 and 1973 and now heading out of the solar system, carry golden plaques with a drawing of that hydrogen flip as their ruler: the woman drawn on them is 8 of those 21 centimetres tall.',
        ],
        sci: [
          'Hydrogen’s ground state is split in two by the magnetic interaction of the electron’s and the proton’s spins (hyperfine structure). A flip from parallel to antiparallel spins gives a photon of 1420.406 MHz, 21.1 cm; a lone atom waits about 11 million years for it, but the Milky Way’s atomic gas holds so many atoms that the line is bright. Hendrik van de Hulst predicted it in 1944, and Harold Ewen and Edward Purcell detected it at Harvard in 1951.',
          'Radio waves pass through the dust that hides visible light, and the line’s Doppler shift gives each cloud’s speed along the line of sight: from these, Dutch and Australian astronomers mapped the Milky Way’s spiral arms in the 1950s. On the Pioneer plaques the hyperfine transition sets the units, 21 cm of length and 0.7 ns of time; the woman’s height is written in binary as 8 units, about 168 cm. SETI listens near 1420 MHz too, in the quiet “water hole” between the lines of H and OH.',
        ],
      },
      'pt-pt': {
        kid: [
          'O espaço escuro entre as estrelas tem nuvens finas e frias de hidrogénio. De vez em quando, o eletrão de um átomo de hidrogénio vira-se ao contrário, como um pião que fica de pernas para o ar, e o átomo solta um sussurro de rádio fraquinho, sempre com exatamente 21 centímetros. Um átomo só faz isto cerca de uma vez em dez milhões de anos, mas há tantos que os radiotelescópios ouvem esse sussurro por todo o lado, e foi com ele que se desenhou o primeiro mapa dos braços em espiral da nossa galáxia.',
          'Como todos os átomos de hidrogénio do universo sussurram da mesma maneira, os cientistas usaram-no para escrever a extraterrestres. As sondas Pioneer 10 e 11, lançadas em 1972 e 1973 e agora a caminho da saída do sistema solar, levam placas douradas com um desenho dessa volta do hidrogénio como régua: a mulher desenhada nelas mede 8 desses 21 centímetros.',
        ],
        sci: [
          'O estado fundamental do hidrogénio divide-se em dois pela interação magnética entre os spins do eletrão e do protão (estrutura hiperfina). Uma inversão de spins paralelos para antiparalelos emite um fotão de 1420,406 MHz, 21,1 cm; um átomo isolado espera cerca de 11 milhões de anos por ela, mas o gás atómico da Via Láctea tem tantos átomos que a risca é forte. Hendrik van de Hulst previu-a em 1944, e Harold Ewen e Edward Purcell detetaram-na em Harvard em 1951.',
          'As ondas de rádio atravessam a poeira que esconde a luz visível, e o desvio de Doppler da risca dá a velocidade de cada nuvem ao longo da linha de visão: com isso, astrónomos neerlandeses e australianos traçaram os braços em espiral da Via Láctea nos anos 1950. Nas placas das Pioneer, a transição hiperfina define as unidades, 21 cm de comprimento e 0,7 ns de tempo; a altura da mulher está escrita em binário como 8 unidades, cerca de 168 cm. O SETI também escuta perto dos 1420 MHz, no sossegado «buraco de água» entre as riscas do H e do OH.',
        ],
      },
      pl: {
        kid: [
          'W ciemnej przestrzeni między gwiazdami są cienkie, zimne obłoki wodoru. Od czasu do czasu elektron atomu wodoru przewraca się, jak bączek, który staje do góry nogami, a atom wysyła słaby radiowy szept, zawsze o długości dokładnie 21 centymetrów. Jeden atom robi to tylko mniej więcej raz na dziesięć milionów lat, ale jest ich tak wiele, że radioteleskopy słyszą ten szept wszędzie, i właśnie dzięki niemu narysowano pierwszą mapę ramion spiralnych naszej Galaktyki.',
          'Ponieważ każdy atom wodoru we wszechświecie szepcze tak samo, naukowcy użyli go, żeby napisać do kosmitów. Sondy Pioneer 10 i 11, wystrzelone w 1972 i 1973 roku, które teraz opuszczają Układ Słoneczny, wiozą złote tabliczki z rysunkiem tego przewrotu wodoru jako miarką: narysowana na nich kobieta ma wzrost 8 takich 21-centymetrowych odcinków.',
        ],
        sci: [
          'Stan podstawowy wodoru jest rozszczepiony na dwa przez magnetyczne oddziaływanie spinów elektronu i protonu (struktura nadsubtelna). Przejście od spinów równoległych do antyrównoległych daje foton o częstotliwości 1420,406 MHz, 21,1 cm; samotny atom czeka na nie około 11 milionów lat, ale gaz atomowy Drogi Mlecznej zawiera tyle atomów, że linia jest silna. Hendrik van de Hulst przewidział ją w 1944 roku, a Harold Ewen i Edward Purcell wykryli ją na Harvardzie w 1951 roku.',
          'Fale radiowe przechodzą przez pył, który zasłania światło widzialne, a przesunięcie Dopplera linii daje prędkość każdego obłoku wzdłuż linii widzenia: na tej podstawie astronomowie holenderscy i australijscy wyznaczyli w latach 50. XX wieku ramiona spiralne Drogi Mlecznej. Na tabliczkach Pioneerów przejście nadsubtelne wyznacza jednostki: 21 cm długości i 0,7 ns czasu; wzrost kobiety zapisano dwójkowo jako 8 jednostek, około 168 cm. SETI też nasłuchuje blisko 1420 MHz, w cichej „dziurze wodnej” między liniami H i OH.',
        ],
      },
      de: {
        kid: [
          'Der dunkle Raum zwischen den Sternen enthält dünne, kalte Wolken aus Wasserstoff. Ab und zu klappt das Elektron eines Wasserstoffatoms um, wie ein Kreisel, der sich auf den Kopf stellt, und das Atom sendet ein leises Radioflüstern aus, immer genau 21 Zentimeter lang. Ein Atom tut das nur etwa einmal in zehn Millionen Jahren, aber es gibt so viele davon, dass Radioteleskope das Flüstern überall hören, und damit wurde die erste Karte der Spiralarme unserer Galaxis gezeichnet.',
          'Weil jedes Wasserstoffatom im Universum gleich flüstert, haben Forscher damit an Außerirdische geschrieben. Pioneer 10 und 11, 1972 und 1973 gestartet und jetzt auf dem Weg aus dem Sonnensystem, tragen goldene Plaketten mit einer Zeichnung dieses Umklappens als Lineal: Die Frau darauf ist 8 dieser 21 Zentimeter groß.',
        ],
        sci: [
          'Der Grundzustand des Wasserstoffs ist durch die magnetische Wechselwirkung der Spins von Elektron und Proton zweigeteilt (Hyperfeinstruktur). Ein Umklappen von parallelen zu antiparallelen Spins sendet ein Photon von 1420,406 MHz aus, 21,1 cm; ein einzelnes Atom wartet darauf im Mittel etwa 11 Millionen Jahre, aber das atomare Gas der Milchstraße enthält so viele Atome, dass die Linie hell ist. Hendrik van de Hulst sagte sie 1944 voraus, und Harold Ewen und Edward Purcell wiesen sie 1951 in Harvard nach.',
          'Radiowellen durchdringen den Staub, der das sichtbare Licht verbirgt, und die Dopplerverschiebung der Linie gibt die Geschwindigkeit jeder Wolke entlang der Sichtlinie: Daraus zeichneten niederländische und australische Astronomen in den 1950er-Jahren die Spiralarme der Milchstraße. Auf den Pioneer-Plaketten legt der Hyperfeinübergang die Einheiten fest, 21 cm für die Länge und 0,7 ns für die Zeit; die Größe der Frau steht in Binärschrift als 8 Einheiten da, etwa 168 cm. Auch SETI lauscht nahe 1420 MHz, im ruhigen „Wasserloch“ zwischen den Linien von H und OH.',
        ],
      },
    },
  },
]
