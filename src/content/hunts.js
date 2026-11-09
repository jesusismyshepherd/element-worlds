// The treasure hunts' words (src/game/hunts.js has the tracks and their places; docs/knowledge/hunts.md):
// each track's title and what it is about, and for each clue its riddle (Explorer: friendly, with a
// nudge; Scientist: a date, a number or a term) and what the place shows once it is found (one or two
// sentences, true, checked against the game's own words: the boards in src/content/boards/, the elements'
// words in src/content/<Symbol>.js, the data in src/data/elements.json). A riddle names the thing, never
// the element (hunts.test.js checks it with the quiz's mask, in every language). Loaded with the hunts'
// HUD, on demand. Each text: { en, 'pt-pt', pl, de }, each { kid, sci }.
export const TRACK_WORDS = {
  discoverers: {
    title: { en: 'Discoverers', 'pt-pt': 'Descobridores', pl: 'Odkrywcy', de: 'Entdecker' },
    about: {
      en: {
        kid: 'Who found what, and when: from a pharaoh’s dagger that fell from the sky to the valley of computer chips, in the order it happened.',
        sci: 'Seven discoveries in the order they were made, from the 14th century BC to 1971: who found what, and how.',
      },
      'pt-pt': {
        kid: 'Quem descobriu o quê, e quando: do punhal de um faraó, feito de um metal caído do céu, ao vale dos chips de computador, pela ordem em que aconteceu.',
        sci: 'Sete descobertas pela ordem em que foram feitas, do século XIV a.C. a 1971: quem descobriu o quê, e como.',
      },
      pl: {
        kid: 'Kto co odkrył i kiedy: od sztyletu faraona z metalu, który spadł z nieba, aż do doliny chipów komputerowych, po kolei, tak jak to się działo.',
        sci: 'Siedem odkryć w kolejności, w jakiej ich dokonano, od XIV wieku p.n.e. do 1971 roku: kto co odkrył i jak.',
      },
      de: {
        kid: 'Wer hat was entdeckt, und wann: vom Dolch eines Pharaos aus Metall, das vom Himmel fiel, bis zum Tal der Computerchips, in der Reihenfolge, in der es geschah.',
        sci: 'Sieben Entdeckungen in der Reihenfolge, in der sie gemacht wurden, vom 14. Jahrhundert v. Chr. bis 1971: wer was fand, und wie.',
      },
    },
  },
  home: {
    title: { en: 'At home', 'pt-pt': 'Em casa', pl: 'W domu', de: 'Zu Hause' },
    about: {
      en: {
        kid: 'Where you meet the elements at home: from the breakfast table to the bathroom.',
        sci: 'Seven elements in everyday things, from breakfast cereal to toothpaste.',
      },
      'pt-pt': {
        kid: 'Onde encontras os elementos em casa: da mesa do pequeno-almoço à casa de banho.',
        sci: 'Sete elementos em coisas do dia a dia, dos cereais do pequeno-almoço à pasta de dentes.',
      },
      pl: {
        kid: 'Gdzie spotykasz pierwiastki w domu: od stołu przy śniadaniu aż po łazienkę.',
        sci: 'Siedem pierwiastków w codziennych rzeczach, od płatków śniadaniowych po pastę do zębów.',
      },
      de: {
        kid: 'Wo dir die Elemente zu Hause begegnen: vom Frühstückstisch bis ins Badezimmer.',
        sci: 'Sieben Elemente in Alltagsdingen, von den Frühstücksflocken bis zur Zahnpasta.',
      },
    },
  },
  records: {
    title: { en: 'Records', 'pt-pt': 'Recordes', pl: 'Rekordy', de: 'Rekorde' },
    about: {
      en: {
        kid: 'The most of everything: the lightest, the coldest, the hardest, the densest and the heaviest, from element 1 to element 118.',
        sci: 'The table’s extremes from Z = 1 to Z = 118: the lightest atom, the lowest boiling point, the hardest material, the most abundant, the densest, the liquid metal, the heaviest made.',
      },
      'pt-pt': {
        kid: 'O mais de tudo: o mais leve, o mais frio, o mais duro, o mais denso e o mais pesado, do elemento 1 ao elemento 118.',
        sci: 'Os extremos da tabela, de Z = 1 a Z = 118: o átomo mais leve, o ponto de ebulição mais baixo, o material mais duro, o mais abundante, o mais denso, o metal líquido, o mais pesado alguma vez feito.',
      },
      pl: {
        kid: 'Wszystko, co naj: najlżejszy, najzimniejszy, najtwardszy, najgęstszy i najcięższy, od pierwiastka 1 do pierwiastka 118.',
        sci: 'Skrajności układu okresowego od Z = 1 do Z = 118: najlżejszy atom, najniższa temperatura wrzenia, najtwardszy materiał, najpowszechniejszy pierwiastek, najgęstszy, ciekły metal i najcięższy, jaki kiedykolwiek wytworzono.',
      },
      de: {
        kid: 'Das Meiste von allem: das Leichteste, das Kälteste, das Härteste, das Dichteste und das Schwerste, von Element 1 bis Element 118.',
        sci: 'Die Extreme des Periodensystems von Z = 1 bis Z = 118: das leichteste Atom, der tiefste Siedepunkt, das härteste Material, das häufigste, das dichteste, das flüssige Metall, das schwerste je hergestellte.',
      },
    },
  },
}

/** Each clue's words, by '<track>.<clue>': its riddle and what the place shows. */
export const CLUE_WORDS = {
  // ---- Discoverers: who found what, and when (in the order it happened) ----
  'discoverers.meteorite': {
    riddle: {
      en: {
        kid: 'About 3300 years ago a young pharaoh of Egypt was buried with a dagger made of metal that fell from the sky. Find the picture of the sky dagger! A nudge: nails are made of this metal, and your blood needs it to be red.',
        sci: 'In the 14th century BC a blade holding 10.8% nickel and 0.58% cobalt was buried with Tutankhamun. Where did its metal come from? Find the picture.',
      },
      'pt-pt': {
        kid: 'Há cerca de 3300 anos, um jovem faraó do Egito foi sepultado com um punhal feito de um metal que caiu do céu. Encontra o quadro do punhal do céu! Um empurrãozinho: os pregos são feitos deste metal, e o teu sangue precisa dele para ser vermelho.',
        sci: 'No século XIV a.C., uma lâmina com 10,8% de níquel e 0,58% de cobalto foi sepultada com Tutankhamon. De onde veio o seu metal? Encontra o quadro.',
      },
      pl: {
        kid: 'Około 3300 lat temu młody faraon Egiptu został pochowany ze sztyletem z metalu, który spadł z nieba. Znajdź obraz niebiańskiego sztyletu! Mała pomoc: z tego metalu robi się gwoździe, a twoja krew potrzebuje go, żeby być czerwona.',
        sci: 'W XIV wieku p.n.e. razem z Tutanchamonem pochowano ostrze zawierające 10,8% niklu i 0,58% kobaltu. Skąd pochodził jego metal? Znajdź obraz.',
      },
      de: {
        kid: 'Vor etwa 3300 Jahren wurde ein junger Pharao in Ägypten mit einem Dolch begraben, dessen Metall vom Himmel gefallen war. Finde das Bild vom Himmelsdolch! Kleiner Schubs: Nägel sind aus diesem Metall, und dein Blut braucht es, um rot zu sein.',
        sci: 'Im 14. Jahrhundert v. Chr. wurde mit Tutanchamun eine Klinge mit 10,8% Nickel und 0,58% Cobalt begraben. Woher kam ihr Metall? Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'Tutankhamun’s dagger is iron from a meteorite, a piece of the iron heart of a little planet that broke apart in space. People had iron from the sky long before they could get it out of rocks.',
        sci: 'Iron meteorites are pieces of asteroid cores, iron alloyed with usually 5 to 12% nickel; X-ray fluorescence (2016) found 10.8% in the dagger, so it is meteoritic. Iron smelted from ore has hardly any nickel.',
      },
      'pt-pt': {
        kid: 'O punhal de Tutankhamon é de ferro de um meteorito, um pedaço do coração de ferro de um pequeno planeta que se desfez no espaço. As pessoas tiveram ferro do céu muito antes de o saberem tirar das rochas.',
        sci: 'Os meteoritos de ferro são pedaços de núcleos de asteroides, ferro em liga com 5 a 12% de níquel, em geral; a fluorescência de raios X (2016) encontrou 10,8% no punhal, por isso é meteorítico. O ferro obtido do minério quase não tem níquel.',
      },
      pl: {
        kid: 'Sztylet Tutanchamona jest z żelaza z meteorytu, kawałka żelaznego serca małej planety, która rozpadła się w kosmosie. Ludzie mieli żelazo z nieba długo przedtem, zanim nauczyli się wydobywać je ze skał.',
        sci: 'Meteoryty żelazne to kawałki jąder planetoid: żelazo stopione zwykle z 5 do 12% niklu. Fluorescencja rentgenowska (2016) wykazała w sztylecie 10,8% niklu, więc jest on meteorytowy. Żelazo wytopione z rudy prawie nie zawiera niklu.',
      },
      de: {
        kid: 'Der Dolch des Tutanchamun ist aus Eisen von einem Meteoriten, einem Stück vom Eisenherz eines kleinen Planeten, der im All zerbrochen ist. Die Menschen hatten Eisen vom Himmel, lange bevor sie es aus Gestein gewinnen konnten.',
        sci: 'Eisenmeteoriten sind Bruchstücke von Asteroidenkernen, Eisen meist mit 5 bis 12% Nickel legiert; die Röntgenfluoreszenz (2016) fand im Dolch 10,8%, also ist er meteoritisch. Aus Erz verhüttetes Eisen enthält kaum Nickel.',
      },
    },
  },
  'discoverers.cavendish': {
    riddle: {
      en: {
        kid: 'In 1766 a very shy English scientist dropped bits of zinc into acid and caught the bubbles in upside-down bottles. The gas was much lighter than air, and near a flame it went pop! Find the picture of his fire that makes water. A nudge: it is the lightest gas of all.',
        sci: '1766: zinc, iron or tin in dilute acid all give one “inflammable air”, far lighter than common air; in 1781 an electric spark turns it and air into dew. Find the picture of the experiment.',
      },
      'pt-pt': {
        kid: 'Em 1766, um cientista inglês muito tímido deitou pedacinhos de zinco em ácido e apanhou as bolhas em garrafas viradas ao contrário. O gás era muito mais leve do que o ar e, perto de uma chama, fazia pum! Encontra o quadro do seu fogo que faz água. Um empurrãozinho: é o gás mais leve de todos.',
        sci: '1766: zinco, ferro ou estanho em ácido diluído dão todos o mesmo «ar inflamável», muito mais leve do que o ar comum; em 1781, uma faísca elétrica transforma-o, com ar, em orvalho. Encontra o quadro da experiência.',
      },
      pl: {
        kid: 'W 1766 roku bardzo nieśmiały angielski uczony wrzucał kawałki cynku do kwasu i łapał bąbelki do odwróconych do góry dnem butelek. Gaz był dużo lżejszy od powietrza, a przy płomieniu robił pyk! Znajdź obraz jego ognia, z którego powstaje woda. Mała pomoc: to najlżejszy gaz ze wszystkich.',
        sci: '1766: cynk, żelazo lub cyna w rozcieńczonym kwasie dają to samo „palne powietrze”, dużo lżejsze od zwykłego powietrza; w 1781 roku iskra elektryczna zamienia je razem z powietrzem w rosę. Znajdź obraz tego doświadczenia.',
      },
      de: {
        kid: 'Im Jahr 1766 warf ein sehr schüchterner englischer Forscher Zinkstückchen in Säure und fing die Bläschen in umgedrehten Flaschen auf. Das Gas war viel leichter als Luft, und an einer Flamme machte es plopp! Finde das Bild von seinem Feuer, das Wasser macht. Kleiner Schubs: Es ist das leichteste Gas von allen.',
        sci: '1766: Zink, Eisen oder Zinn in verdünnter Säure geben alle dieselbe „brennbare Luft“, viel leichter als gewöhnliche Luft; 1781 verwandelt ein elektrischer Funke sie zusammen mit Luft in Tau. Finde das Bild des Versuchs.',
      },
    },
    found: {
      en: {
        kid: 'Henry Cavendish lit his gas mixed with air inside a closed glass vessel, and dew appeared: water! In Paris Antoine Lavoisier understood that water is made of this gas and oxygen, and named it hydrogène, the water maker.',
        sci: 'In 1781 Cavendish found that about two volumes of inflammable air use up one of oxygen and leave pure water (published 1784). Lavoisier took water for a compound, and the new chemical names of 1787 called the gas hydrogène, from the Greek for water and for to produce.',
      },
      'pt-pt': {
        kid: 'Henry Cavendish acendeu o seu gás misturado com ar dentro de um recipiente de vidro fechado, e apareceu orvalho: água! Em Paris, Antoine Lavoisier percebeu que a água é feita deste gás e de oxigénio, e deu-lhe o nome de hydrogène, o que faz a água.',
        sci: 'Em 1781, Cavendish verificou que cerca de dois volumes de ar inflamável gastam um de oxigénio e deixam água pura (publicado em 1784). Lavoisier viu na água um composto, e a nova nomenclatura química de 1787 chamou ao gás hydrogène, do grego para água e para produzir.',
      },
      pl: {
        kid: 'Henry Cavendish podpalił swój gaz zmieszany z powietrzem w zamkniętym szklanym naczyniu i pojawiła się rosa: woda! W Paryżu Antoine Lavoisier zrozumiał, że woda składa się z tego gazu i z tlenu, i nazwał go hydrogène, czyli „wytwarzający wodę”.',
        sci: 'W 1781 roku Cavendish stwierdził, że mniej więcej dwie objętości palnego powietrza zużywają jedną objętość tlenu i zostaje czysta woda (opublikowane w 1784 roku). Lavoisier uznał wodę za związek, a nowe nazwy chemiczne z 1787 roku nazwały ten gaz hydrogène, od greckich słów „woda” i „wytwarzać”.',
      },
      de: {
        kid: 'Henry Cavendish zündete sein Gas, mit Luft gemischt, in einem geschlossenen Glasgefäß an, und Tau erschien: Wasser! In Paris verstand Antoine Lavoisier, dass Wasser aus diesem Gas und Sauerstoff besteht, und nannte es hydrogène, den Wasserbildner.',
        sci: '1781 fand Cavendish, dass etwa zwei Raumteile brennbare Luft einen Teil Sauerstoff verbrauchen und reines Wasser zurücklassen (veröffentlicht 1784). Lavoisier sah im Wasser eine Verbindung, und die neuen chemischen Namen von 1787 nannten das Gas hydrogène, nach dem Griechischen für Wasser und erzeugen.',
      },
    },
  },
  'discoverers.priestley': {
    riddle: {
      en: {
        kid: 'In 1774 an English scientist heated a red powder with sunlight focused by a lens, and out came a brand-new gas. Who was he, and who in Sweden found it at almost the same time? It is all in the fact file. A nudge: you breathe it in all day long.',
        sci: '1774: mercurius calcinatus, the red calx of mercury, heated with a burning lens gives “dephlogisticated air”; a Swedish apothecary had made “fire air” first but published only in 1777. Find both names in the fact file.',
      },
      'pt-pt': {
        kid: 'Em 1774, um cientista inglês aqueceu um pó vermelho com a luz do Sol concentrada por uma lente, e saiu dali um gás novinho em folha. Quem era ele, e quem o descobriu na Suécia quase ao mesmo tempo? Está tudo na ficha técnica. Um empurrãozinho: respira-lo o dia todo.',
        sci: '1774: o mercurius calcinatus, a cal vermelha do mercúrio, aquecido com uma lente ustória, dá «ar desflogisticado»; um boticário sueco tinha feito «ar de fogo» antes, mas só publicou em 1777. Encontra os dois nomes na ficha técnica.',
      },
      pl: {
        kid: 'W 1774 roku angielski uczony podgrzał czerwony proszek światłem słonecznym skupionym przez soczewkę i wydobył się z niego zupełnie nowy gaz. Kim był i kto w Szwecji odkrył ten gaz prawie w tym samym czasie? Wszystko jest w metryczce. Mała pomoc: wdychasz go przez cały dzień.',
        sci: '1774: mercurius calcinatus, czerwony proszek z rtęci, ogrzewany soczewką skupiającą daje „zdeflogistonowane powietrze”; pewien szwedzki aptekarz otrzymał wcześniej „powietrze ogniste”, ale opublikował to dopiero w 1777 roku. Znajdź oba nazwiska w metryczce.',
      },
      de: {
        kid: 'Im Jahr 1774 erhitzte ein englischer Forscher ein rotes Pulver mit Sonnenlicht, das eine Linse bündelte, und heraus kam ein ganz neues Gas. Wer war er, und wer in Schweden fand es fast zur selben Zeit? Alles steht im Steckbrief. Kleiner Schubs: Du atmest es den ganzen Tag ein.',
        sci: '1774: roter Quecksilberkalk, mit einem Brennglas erhitzt, gibt „dephlogistierte Luft“; ein schwedischer Apotheker hatte vorher „Feuerluft“ hergestellt, veröffentlichte aber erst 1777. Finde beide Namen im Steckbrief.',
      },
    },
    found: {
      en: {
        kid: 'Joseph Priestley made it in England in 1774, and Carl Wilhelm Scheele found it in Sweden at almost the same time: two discoverers for one element! Soon after, Antoine Lavoisier showed that burning is joining with oxygen.',
        sci: 'Scheele made “fire air” around 1771 to 1772 but published in 1777; Priestley isolated it in 1774 by heating HgO. Lavoisier then explained combustion as combination with oxygen, which ended the phlogiston theory.',
      },
      'pt-pt': {
        kid: 'Joseph Priestley obteve-o em Inglaterra em 1774, e Carl Wilhelm Scheele descobriu-o na Suécia quase ao mesmo tempo: dois descobridores para um só elemento! Pouco depois, Antoine Lavoisier mostrou que arder é juntar-se ao oxigénio.',
        sci: 'Scheele obteve o «ar de fogo» por volta de 1771 a 1772, mas só publicou em 1777; Priestley isolou-o em 1774 aquecendo HgO. Lavoisier explicou depois a combustão como combinação com o oxigénio, o que acabou com a teoria do flogisto.',
      },
      pl: {
        kid: 'Joseph Priestley otrzymał go w Anglii w 1774 roku, a Carl Wilhelm Scheele odkrył go w Szwecji prawie w tym samym czasie: dwóch odkrywców jednego pierwiastka! Wkrótce potem Antoine Lavoisier pokazał, że palenie się to łączenie z tlenem.',
        sci: 'Scheele otrzymał „powietrze ogniste” około 1771 lub 1772 roku, ale opublikował to dopiero w 1777; Priestley wyodrębnił je w 1774 roku, ogrzewając HgO. Lavoisier wyjaśnił potem spalanie jako łączenie się z tlenem, co położyło kres teorii flogistonu.',
      },
      de: {
        kid: 'Joseph Priestley stellte es 1774 in England her, und Carl Wilhelm Scheele fand es fast zur selben Zeit in Schweden: zwei Entdecker für ein Element! Bald danach zeigte Antoine Lavoisier, dass Verbrennen eine Verbindung mit Sauerstoff ist.',
        sci: 'Scheele stellte um 1771 bis 1772 „Feuerluft“ her, veröffentlichte aber erst 1777; Priestley gewann das Gas 1774 durch Erhitzen von HgO. Lavoisier erklärte danach die Verbrennung als Verbindung mit Sauerstoff und beendete so die Phlogistontheorie.',
      },
    },
  },
  'discoverers.davy': {
    riddle: {
      en: {
        kid: 'In 1807 a young scientist sent the current of a huge battery through a little damp caustic soda. Tiny shiny beads of a brand-new metal popped out, and some burst into flames! Find the picture. A nudge: this metal hides in the salt on your table.',
        sci: 'November 1807: moist hydroxide, electrolysed with the voltaic batteries of the Royal Institution, gives globules with the lustre of mercury, days after the same method freed the metal below it in its group. Find the picture.',
      },
      'pt-pt': {
        kid: 'Em 1807, um jovem cientista fez passar a corrente de uma pilha enorme por um pouco de soda cáustica húmida. Saltaram umas bolinhas brilhantes de um metal novinho em folha, e algumas pegaram fogo! Encontra o quadro. Um empurrãozinho: este metal esconde-se no sal da tua mesa.',
        sci: 'Novembro de 1807: o hidróxido húmido, eletrolisado com as pilhas voltaicas da Royal Institution, dá glóbulos com o brilho do mercúrio, dias depois de o mesmo método ter libertado o metal que está por baixo dele no seu grupo. Encontra o quadro.',
      },
      pl: {
        kid: 'W 1807 roku młody uczony przepuścił prąd z ogromnej baterii przez odrobinę wilgotnego, żrącego proszku. Wyskoczyły z niego malutkie błyszczące kuleczki zupełnie nowego metalu, a niektóre stanęły w płomieniach! Znajdź obraz. Mała pomoc: ten metal ukrywa się w soli na twoim stole.',
        sci: 'Listopad 1807: wilgotny wodorotlenek, poddany elektrolizie za pomocą baterii Volty z Royal Institution, daje kuleczki o połysku rtęci, kilka dni po tym, jak ta sama metoda uwolniła metal leżący pod nim w jego grupie. Znajdź obraz.',
      },
      de: {
        kid: 'Im Jahr 1807 schickte ein junger Forscher den Strom einer riesigen Batterie durch ein wenig feuchte, ätzende Lauge. Winzige glänzende Kügelchen eines ganz neuen Metalls sprangen heraus, und manche gingen in Flammen auf! Finde das Bild. Kleiner Schubs: Dieses Metall versteckt sich im Salz auf deinem Tisch.',
        sci: 'November 1807: feuchtes Hydroxid, mit den voltaschen Batterien der Royal Institution elektrolysiert, gibt Kügelchen mit dem Glanz von Quecksilber, Tage nachdem dieselbe Methode das Metall unter ihm in seiner Gruppe befreit hatte. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'Humphry Davy was 28. Electricity pulled sodium out of caustic soda, a metal that no fire had ever set free. It is so eager to react that it is kept under oil.',
        sci: 'Davy announced potassium and then sodium in November 1807, and in 1808 isolated magnesium, calcium, strontium and barium the same way. Sodium is still made by electrolysis, in Downs cells, from molten NaCl mixed with CaCl2.',
      },
      'pt-pt': {
        kid: 'Humphry Davy tinha 28 anos. A eletricidade tirou o sódio da soda cáustica, um metal que nenhum fogo tinha conseguido libertar. Reage com tanta vontade que é guardado debaixo de óleo.',
        sci: 'Davy anunciou o potássio e depois o sódio em novembro de 1807 e, em 1808, isolou da mesma maneira o magnésio, o cálcio, o estrôncio e o bário. O sódio ainda se faz por eletrólise, em células de Downs, a partir de NaCl fundido misturado com CaCl2.',
      },
      pl: {
        kid: 'Humphry Davy miał 28 lat. Elektryczność wyciągnęła z sody kaustycznej sód, metal, którego żaden ogień nie potrafił uwolnić. Tak chętnie reaguje, że przechowuje się go pod olejem.',
        sci: 'Davy ogłosił odkrycie potasu, a potem sodu w listopadzie 1807 roku, a w 1808 roku tą samą metodą otrzymał magnez, wapń, stront i bar. Sód wciąż wytwarza się elektrolizą, w ogniwach Downsa, ze stopionego NaCl zmieszanego z CaCl2.',
      },
      de: {
        kid: 'Humphry Davy war 28. Der Strom holte Natrium aus dem Ätznatron, ein Metall, das kein Feuer je befreit hatte. Es reagiert so gern, dass man es unter Öl aufbewahrt.',
        sci: 'Davy gab im November 1807 Kalium und dann Natrium bekannt und gewann 1808 auf dieselbe Weise Magnesium, Calcium, Strontium und Barium. Natrium wird noch heute durch Elektrolyse hergestellt, in Downs-Zellen, aus geschmolzenem NaCl mit CaCl2.',
      },
    },
  },
  'discoverers.hidden': {
    riddle: {
      en: {
        kid: 'In 1898 two scientists in London let some very cold liquid air boil away. In the very last drops a gas was waiting that had been hiding in the air all along! Find where it was hiding. A nudge: its name means “hidden”.',
        sci: 'May 1898: from the last 10 cm³ of about 750 cm³ of evaporating liquid air, a gas whose spectrum shows a yellow and a green line of no known element. Find the picture.',
      },
      'pt-pt': {
        kid: 'Em 1898, dois cientistas em Londres deixaram ferver um pouco de ar líquido muito frio. Nas últimas gotas esperava-os um gás que tinha estado escondido no ar desde sempre! Encontra onde se escondia. Um empurrãozinho: o seu nome quer dizer «escondido».',
        sci: 'Maio de 1898: dos últimos 10 cm³ de cerca de 750 cm³ de ar líquido a evaporar sai um gás cujo espetro mostra uma risca amarela e uma verde de nenhum elemento conhecido. Encontra o quadro.',
      },
      pl: {
        kid: 'W 1898 roku dwóch uczonych w Londynie pozwoliło, żeby bardzo zimne ciekłe powietrze wyparowało. W ostatnich kroplach czekał gaz, który od zawsze ukrywał się w powietrzu! Znajdź miejsce, gdzie się ukrywał. Mała pomoc: jego nazwa znaczy „ukryty”.',
        sci: 'Maj 1898: z ostatnich 10 cm³ z około 750 cm³ parującego ciekłego powietrza gaz, którego widmo pokazuje żółtą i zieloną linię nienależącą do żadnego znanego pierwiastka. Znajdź obraz.',
      },
      de: {
        kid: 'Im Jahr 1898 ließen zwei Forscher in London etwas sehr kalte flüssige Luft verdampfen. In den allerletzten Tropfen wartete ein Gas, das sich die ganze Zeit in der Luft versteckt hatte! Finde, wo es sich versteckte. Kleiner Schubs: Sein Name bedeutet „verborgen“.',
        sci: 'Mai 1898: aus den letzten 10 cm³ von etwa 750 cm³ verdampfender flüssiger Luft ein Gas, dessen Spektrum eine gelbe und eine grüne Linie keines bekannten Elements zeigt. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'William Ramsay and Morris Travers found krypton in the last drops of liquid air: it turns into a gas at a higher temperature than nitrogen and oxygen, so it stayed behind. They named it from the Greek kryptos, hidden.',
        sci: 'Krypton boils at −153.2 °C, far above nitrogen, argon and oxygen, so it gathers in the last fraction of liquid air (it is 1.14 ppm of dry air). Neon followed in June 1898 and xenon in July; Ramsay won the Nobel Prize in Chemistry in 1904.',
      },
      'pt-pt': {
        kid: 'William Ramsay e Morris Travers encontraram o crípton nas últimas gotas de ar líquido: passa a gás a uma temperatura mais alta do que o azoto e o oxigénio, por isso ficou para trás. Deram-lhe o nome a partir do grego kryptos, escondido.',
        sci: 'O crípton ferve a −153,2 °C, muito acima do azoto, do árgon e do oxigénio, por isso junta-se na última fração do ar líquido (é 1,14 ppm do ar seco). O néon veio em junho de 1898 e o xénon em julho; Ramsay recebeu o Prémio Nobel da Química em 1904.',
      },
      pl: {
        kid: 'William Ramsay i Morris Travers znaleźli krypton w ostatnich kroplach ciekłego powietrza: zamienia się w gaz w wyższej temperaturze niż azot i tlen, więc został na końcu. Nazwali go od greckiego słowa kryptos, ukryty.',
        sci: 'Krypton wrze w temperaturze −153,2 °C, dużo wyższej niż azot, argon i tlen, więc zbiera się w ostatniej frakcji ciekłego powietrza (stanowi 1,14 ppm suchego powietrza). Neon odkryto w czerwcu 1898 roku, a ksenon w lipcu; Ramsay otrzymał Nagrodę Nobla w dziedzinie chemii w 1904 roku.',
      },
      de: {
        kid: 'William Ramsay und Morris Travers fanden das Krypton in den letzten Tropfen flüssiger Luft: Es wird erst bei einer höheren Temperatur gasförmig als Stickstoff und Sauerstoff, deshalb blieb es übrig. Sie benannten es nach dem griechischen kryptos, verborgen.',
        sci: 'Krypton siedet bei −153,2 °C, weit über Stickstoff, Argon und Sauerstoff, deshalb sammelt es sich im letzten Rest der flüssigen Luft (es macht 1,14 ppm trockener Luft aus). Neon folgte im Juni 1898, Xenon im Juli; Ramsay erhielt 1904 den Nobelpreis für Chemie.',
      },
    },
  },
  'discoverers.clock': {
    riddle: {
      en: {
        kid: 'A clock is ticking inside every bone, every old log and every mummy. Count what is left of it and you know how old they are! Find the clock. A nudge: every living thing is built of this element, and so is the tip of your pencil.',
        sci: '1949: an isotope made by cosmic rays, about 1.2 atoms in every trillion atoms of this element in living things, becomes a calendar (Willard Libby, Nobel Prize in Chemistry 1960). Find the picture.',
      },
      'pt-pt': {
        kid: 'Há um relógio a fazer tiquetaque dentro de cada osso, de cada tronco velho e de cada múmia. Conta o que resta dele e ficas a saber a sua idade! Encontra o relógio. Um empurrãozinho: todos os seres vivos são feitos deste elemento, e a ponta do teu lápis também.',
        sci: '1949: um isótopo produzido pelos raios cósmicos, cerca de 1,2 átomos em cada bilião de átomos deste elemento nos seres vivos, torna-se um calendário (Willard Libby, Prémio Nobel da Química de 1960). Encontra o quadro.',
      },
      pl: {
        kid: 'W każdej kości, w każdym starym pniu i w każdej mumii tyka zegar. Policz, ile z niego zostało, a będziesz wiedzieć, ile mają lat! Znajdź ten zegar. Mała pomoc: z tego pierwiastka zbudowane jest wszystko, co żyje, a także grafit w twoim ołówku.',
        sci: '1949: izotop wytwarzany przez promieniowanie kosmiczne, około 1,2 atomu na każdy bilion atomów tego pierwiastka w organizmach żywych, staje się kalendarzem (Willard Libby, Nagroda Nobla w dziedzinie chemii 1960). Znajdź obraz.',
      },
      de: {
        kid: 'In jedem Knochen, jedem alten Baumstamm und jeder Mumie tickt eine Uhr. Zähl, was von ihr übrig ist, und du weißt, wie alt sie sind! Finde die Uhr. Kleiner Schubs: Alles Lebendige ist aus diesem Element gebaut, und die Spitze deines Bleistifts auch.',
        sci: '1949: Ein Isotop, das die kosmische Strahlung erzeugt, etwa 1,2 Atome auf jede Billion Atome dieses Elements in Lebewesen, wird zum Kalender (Willard Libby, Nobelpreis für Chemie 1960). Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'A few carbon atoms in every living thing are carbon-14. After death no new ones come in, and half of them are gone every 5730 years: count what is left and you know how old a bone or a mummy is.',
        sci: 'Carbon-14 (half-life 5730 years) is made by cosmic rays in the upper atmosphere and decays after death; accelerator mass spectrometry counts the atoms left and dates samples back to about 50 000 years.',
      },
      'pt-pt': {
        kid: 'Alguns átomos de carbono de todos os seres vivos são carbono-14. Depois da morte não entram novos, e metade deles desaparece a cada 5730 anos: conta o que resta e ficas a saber a idade de um osso ou de uma múmia.',
        sci: 'O carbono-14 (meia-vida de 5730 anos) forma-se com os raios cósmicos na alta atmosfera e decai depois da morte; a espetrometria de massa com acelerador conta os átomos que restam e data amostras até cerca de 50 000 anos.',
      },
      pl: {
        kid: 'Kilka atomów węgla w każdej żywej istocie to węgiel-14. Po śmierci nie przybywa nowych, a co 5730 lat znika połowa z nich: policz, ile zostało, a będziesz wiedzieć, ile lat ma kość albo mumia.',
        sci: 'Węgiel-14 (okres półtrwania 5730 lat) powstaje pod działaniem promieniowania kosmicznego w górnej atmosferze i rozpada się po śmierci organizmu; akceleratorowa spektrometria mas liczy pozostałe atomy i pozwala datować próbki sprzed około 50 000 lat.',
      },
      de: {
        kid: 'Ein paar Kohlenstoffatome in jedem Lebewesen sind Kohlenstoff-14. Nach dem Tod kommen keine neuen dazu, und alle 5730 Jahre ist die Hälfte davon weg: Zähl, was übrig ist, und du weißt, wie alt ein Knochen oder eine Mumie ist.',
        sci: 'Kohlenstoff-14 (Halbwertszeit 5730 Jahre) entsteht durch kosmische Strahlung in der oberen Atmosphäre und zerfällt nach dem Tod; die Beschleuniger-Massenspektrometrie zählt die übrigen Atome und datiert Proben bis etwa 50 000 Jahre zurück.',
      },
    },
  },
  'discoverers.valley': {
    riddle: {
      en: {
        kid: 'In 1971 a valley in California, once full of apricot, plum and cherry trees, got a new name, after the element in every computer chip. Find the valley! A nudge: it is made from sand.',
        sci: '11 January 1971: a journalist names a region after the material of the planar integrated circuit (1959); that November a chip made there packs a computer’s processor into 2300 transistors. Find the picture.',
      },
      'pt-pt': {
        kid: 'Em 1971, um vale da Califórnia, antes cheio de damasqueiros, ameixeiras e cerejeiras, ganhou um nome novo, o do elemento que está em todos os chips de computador. Encontra o vale! Um empurrãozinho: faz-se a partir da areia.',
        sci: '11 de janeiro de 1971: um jornalista dá a uma região o nome do material do circuito integrado planar (1959); em novembro desse ano, um chip feito ali põe o processador de um computador em 2300 transístores. Encontra o quadro.',
      },
      pl: {
        kid: 'W 1971 roku dolina w Kalifornii, kiedyś pełna moreli, śliw i czereśni, dostała nową nazwę: od pierwiastka, który jest w każdym chipie komputerowym. Znajdź tę dolinę! Mała pomoc: robi się go z piasku.',
        sci: '11 stycznia 1971: dziennikarz nazywa region od materiału planarnego układu scalonego (1959); w listopadzie tego roku zrobiony tam chip mieści procesor komputera w 2300 tranzystorach. Znajdź obraz.',
      },
      de: {
        kid: 'Im Jahr 1971 bekam ein Tal in Kalifornien, einst voller Aprikosen-, Pflaumen- und Kirschbäume, einen neuen Namen, nach dem Element in jedem Computerchip. Finde das Tal! Kleiner Schubs: Man macht es aus Sand.',
        sci: '11. Januar 1971: Ein Journalist benennt eine Gegend nach dem Material des planaren integrierten Schaltkreises (1959); im November desselben Jahres bringt ein Chip von dort den Prozessor eines Computers in 2300 Transistoren unter. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'In 1824 Jöns Jacob Berzelius made silicon as a brown powder in Sweden. Much later people found that pure silicon makes tiny electric switches, and so many companies made silicon chips in that valley that it became Silicon Valley.',
        sci: 'Berzelius isolated silicon in 1824. Shockley’s laboratory (1956), Fairchild Semiconductor (1957) and Noyce’s planar integrated circuit (1959) grew an industry there; Don Hoefler named it in Electronic News in 1971, and Intel’s 4004 came that same year.',
      },
      'pt-pt': {
        kid: 'Em 1824, Jöns Jacob Berzelius obteve silício, um pó castanho, na Suécia. Muito mais tarde descobriu-se que o silício puro dá interruptores elétricos minúsculos, e tantas empresas fizeram chips de silício naquele vale que ele passou a chamar-se Silicon Valley.',
        sci: 'Berzelius isolou o silício em 1824. O laboratório de Shockley (1956), a Fairchild Semiconductor (1957) e o circuito integrado planar de Noyce (1959) fizeram ali nascer uma indústria; Don Hoefler deu-lhe o nome na Electronic News em 1971, e o 4004 da Intel chegou nesse mesmo ano.',
      },
      pl: {
        kid: 'W 1824 roku Jöns Jacob Berzelius otrzymał w Szwecji krzem w postaci brązowego proszku. Dużo później okazało się, że z czystego krzemu można robić malutkie przełączniki elektryczne, a w tej dolinie tyle firm robiło krzemowe chipy, że nazwano ją Doliną Krzemową.',
        sci: 'Berzelius wyodrębnił krzem w 1824 roku. Laboratorium Shockleya (1956), Fairchild Semiconductor (1957) i planarny układ scalony Noyce’a (1959) stworzyły tam przemysł; Don Hoefler nadał regionowi nazwę w „Electronic News” w 1971 roku, a w tym samym roku pojawił się Intel 4004.',
      },
      de: {
        kid: 'Im Jahr 1824 stellte Jöns Jacob Berzelius in Schweden Silicium als braunes Pulver her. Viel später fand man heraus, dass reines Silicium winzige elektrische Schalter ergibt, und so viele Firmen machten in dem Tal Siliciumchips, dass es Silicon Valley hieß.',
        sci: 'Berzelius stellte Silicium 1824 dar. Shockleys Labor (1956), Fairchild Semiconductor (1957) und Noyces planarer integrierter Schaltkreis (1959) ließen dort eine Industrie wachsen; Don Hoefler gab der Gegend 1971 in Electronic News ihren Namen, und im selben Jahr kam Intels 4004.',
      },
    },
  },

  // ---- At home: where you meet the elements, from the breakfast table to the bathroom ----
  'home.cereal': {
    riddle: {
      en: {
        kid: 'Breakfast time! A strong magnet can pull tiny black specks of a metal out of some cereals. Find the picture! A nudge: your blood needs this metal to be red.',
        sci: 'Fortified flakes carry it as a fine powder, reduced, electrolytic or carbonyl, which a magnet pulls out and stomach acid turns into a 2+ ion. Find the picture.',
      },
      'pt-pt': {
        kid: 'Hora do pequeno-almoço! Um íman forte consegue tirar de alguns cereais uns pontinhos pretos de um metal. Encontra o quadro! Um empurrãozinho: o teu sangue precisa deste metal para ser vermelho.',
        sci: 'Os flocos enriquecidos levam-no como um pó fino, reduzido, eletrolítico ou carbonilo, que um íman puxa e o ácido do estômago transforma num ião 2+. Encontra o quadro.',
      },
      pl: {
        kid: 'Pora na śniadanie! Silny magnes potrafi wyciągnąć z niektórych płatków malutkie czarne drobinki pewnego metalu. Znajdź obraz! Mała pomoc: twoja krew potrzebuje tego metalu, żeby być czerwona.',
        sci: 'Wzbogacane płatki zawierają go w postaci drobnego proszku, redukowanego, elektrolitycznego lub karbonylkowego, który przyciąga magnes, a kwas żołądkowy zamienia w jon 2+. Znajdź obraz.',
      },
      de: {
        kid: 'Frühstückszeit! Ein starker Magnet kann aus manchen Frühstücksflocken winzige schwarze Pünktchen eines Metalls ziehen. Finde das Bild! Kleiner Schubs: Dein Blut braucht dieses Metall, um rot zu sein.',
        sci: 'Angereicherte Flocken enthalten es als feines Pulver, reduziert, elektrolytisch oder als Carbonylpulver, das ein Magnet herauszieht und die Magensäure in ein 2+-Ion verwandelt. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'Many breakfast cereals have real iron powder added. Your stomach’s acid dissolves it, and your body uses the iron to make red blood. A grown-up’s whole body holds only about 4 grams, as much as one nail.',
        sci: 'In the stomach Fe + 2 H+ → Fe2+ + H2. The gut takes in only 1 to 2 mg a day, and children of 9 to 13 need about 8 mg a day (the US recommendation); iron deficiency is the world’s most common nutritional disorder.',
      },
      'pt-pt': {
        kid: 'Muitos cereais de pequeno-almoço levam pó de ferro verdadeiro. O ácido do teu estômago dissolve-o, e o teu corpo usa o ferro para fazer sangue vermelho. O corpo inteiro de um adulto tem só cerca de 4 gramas, tanto como um prego.',
        sci: 'No estômago, Fe + 2 H+ → Fe2+ + H2. O intestino absorve só 1 a 2 mg por dia, e as crianças dos 9 aos 13 anos precisam de cerca de 8 mg por dia (a recomendação dos EUA); a falta de ferro é a carência nutricional mais comum do mundo.',
      },
      pl: {
        kid: 'Do wielu płatków śniadaniowych dodaje się prawdziwy proszek żelaza. Kwas w twoim żołądku go rozpuszcza, a twoje ciało wykorzystuje żelazo do wytwarzania czerwonej krwi. W całym ciele dorosłego są tylko około 4 gramy żelaza, tyle co w jednym gwoździu.',
        sci: 'W żołądku Fe + 2 H+ → Fe2+ + H2. Jelito wchłania tylko 1 do 2 mg dziennie, a dzieci w wieku od 9 do 13 lat potrzebują około 8 mg dziennie (zalecenie amerykańskie); niedobór żelaza to najczęstsze zaburzenie żywieniowe na świecie.',
      },
      de: {
        kid: 'Vielen Frühstücksflocken wird echtes Eisenpulver zugesetzt. Deine Magensäure löst es auf, und dein Körper macht aus dem Eisen rotes Blut. Der ganze Körper eines Erwachsenen enthält nur etwa 4 Gramm davon, so viel wie ein Nagel.',
        sci: 'Im Magen: Fe + 2 H+ → Fe2+ + H2. Der Darm nimmt nur 1 bis 2 mg am Tag auf, und Kinder von 9 bis 13 brauchen etwa 8 mg am Tag (die US-Empfehlung); Eisenmangel ist die häufigste Mangelerscheinung der Welt.',
      },
    },
  },
  'home.salt': {
    riddle: {
      en: {
        kid: 'On the table: the salt shaker. Salt is made of two elements, and one of them is a soft, shiny metal! Find the picture that shows why the sea is salty.',
        sci: 'Seawater holds about 35 g of dissolved salts per kilogram, about 10.8 g of this metal per litre. Find the picture of the salt pans.',
      },
      'pt-pt': {
        kid: 'Na mesa: o saleiro. O sal é feito de dois elementos, e um deles é um metal mole e brilhante! Encontra o quadro que mostra porque é que o mar é salgado.',
        sci: 'A água do mar tem cerca de 35 g de sais dissolvidos por quilograma, cerca de 10,8 g deste metal por litro. Encontra o quadro das salinas.',
      },
      pl: {
        kid: 'Na stole: solniczka. Sól składa się z dwóch pierwiastków, a jeden z nich to miękki, błyszczący metal! Znajdź obraz, który pokazuje, dlaczego morze jest słone.',
        sci: 'Woda morska zawiera około 35 g rozpuszczonych soli na kilogram, w tym około 10,8 g tego metalu na litr. Znajdź obraz z salinami.',
      },
      de: {
        kid: 'Auf dem Tisch: der Salzstreuer. Salz besteht aus zwei Elementen, und eines davon ist ein weiches, glänzendes Metall! Finde das Bild, das zeigt, warum das Meer salzig ist.',
        sci: 'Meerwasser enthält etwa 35 g gelöste Salze pro Kilogramm, darunter etwa 10,8 g dieses Metalls pro Liter. Finde das Bild der Salzgärten.',
      },
    },
    found: {
      en: {
        kid: 'Rain washes tiny bits of salt out of rocks, and rivers carry them to the sea. The sun lifts the water back into the sky, but the salt stays. In Aveiro, in Portugal, people still dry seawater in shallow pools to make salt.',
        sci: 'The sodium was weathered out of rocks such as feldspars, and much of the chloride came from volcanic gases. In a salt pan NaCl crystallises once about nine tenths of the water has gone; Aveiro’s salinas are named in a document of 959.',
      },
      'pt-pt': {
        kid: 'A chuva lava pedacinhos de sal das rochas, e os rios levam-nos até ao mar. O Sol leva a água de volta para o céu, mas o sal fica. Em Aveiro, em Portugal, ainda se seca água do mar em tanques pouco fundos para fazer sal.',
        sci: 'O sódio saiu de rochas como os feldspatos pela meteorização, e grande parte do cloreto veio de gases vulcânicos. Numa salina, o NaCl cristaliza quando já se evaporaram cerca de nove décimos da água; as salinas de Aveiro aparecem num documento de 959.',
      },
      pl: {
        kid: 'Deszcz wypłukuje ze skał drobinki soli, a rzeki niosą je do morza. Słońce unosi wodę z powrotem do nieba, ale sól zostaje. W Aveiro, w Portugalii, ludzie wciąż suszą wodę morską w płytkich basenach, żeby zrobić sól.',
        sci: 'Sód został wypłukany ze skał takich jak skalenie, a duża część chlorków pochodzi z gazów wulkanicznych. W salinie NaCl krystalizuje, gdy odparuje około dziewięciu dziesiątych wody; saliny w Aveiro wspomina dokument z 959 roku.',
      },
      de: {
        kid: 'Regen wäscht winzige Salzkrümel aus dem Gestein, und Flüsse tragen sie ins Meer. Die Sonne hebt das Wasser zurück in den Himmel, aber das Salz bleibt. In Aveiro, in Portugal, trocknen Menschen noch heute Meerwasser in flachen Becken, um Salz zu gewinnen.',
        sci: 'Das Natrium wurde aus Gesteinen wie Feldspäten verwittert, ein Großteil des Chlorids stammt aus vulkanischen Gasen. In einem Salzgarten kristallisiert NaCl, wenn etwa neun Zehntel des Wassers verdunstet sind; Aveiros Salinen werden in einem Dokument von 959 erwähnt.',
      },
    },
  },
  'home.foil': {
    riddle: {
      en: {
        kid: 'The shiny foil that wraps your sandwich and the can of your drink are made of one light metal. Find what it is for! A nudge: no metal is more common in the rocks of the Earth’s crust.',
        sci: '8.2% of the Earth’s crust by mass, more than any other metal, yet set free only by electrolysis, at about 13 to 15 kWh per kilogram. Find what it is for.',
      },
      'pt-pt': {
        kid: 'A folha brilhante que embrulha a tua sandes e a lata da tua bebida são feitas de um só metal leve. Descobre para que serve! Um empurrãozinho: não há metal mais comum nas rochas da crosta terrestre.',
        sci: '8,2% da massa da crosta terrestre, mais do que qualquer outro metal, e no entanto só se liberta por eletrólise, a cerca de 13 a 15 kWh por quilograma. Descobre para que serve.',
      },
      pl: {
        kid: 'Błyszcząca folia, w którą zawijasz kanapkę, i puszka po napoju są zrobione z jednego lekkiego metalu. Sprawdź, do czego służy! Mała pomoc: żaden metal nie występuje częściej w skałach skorupy ziemskiej.',
        sci: '8,2% masy skorupy ziemskiej, więcej niż jakikolwiek inny metal, a jednak uwalnia się go tylko elektrolizą, przy około 13 do 15 kWh na kilogram. Sprawdź, do czego służy.',
      },
      de: {
        kid: 'Die glänzende Folie um dein Pausenbrot und die Dose deines Getränks sind aus einem leichten Metall. Finde heraus, wofür es verwendet wird! Kleiner Schubs: Kein Metall ist in den Gesteinen der Erdkruste häufiger.',
        sci: '8,2% der Masse der Erdkruste, mehr als jedes andere Metall, und doch nur durch Elektrolyse zu gewinnen, mit etwa 13 bis 15 kWh pro Kilogramm. Finde heraus, wofür es verwendet wird.',
      },
    },
    found: {
      en: {
        kid: 'Aluminium makes drink cans and kitchen foil, and planes, bikes and ladders: light and strong, and it doesn’t rust. Recycling a can saves about 95% of the energy needed to make a new one.',
        sci: 'Packaging (cans, foil, aseptic cartons) and transport are its big uses, and overhead power lines: kilogram for kilogram it conducts about twice as well as copper. Recycling needs about 5% of the energy of making it new.',
      },
      'pt-pt': {
        kid: 'O alumínio faz latas de bebidas e folha de cozinha, e também aviões, bicicletas e escadas: é leve, forte e não enferruja. Reciclar uma lata poupa cerca de 95% da energia precisa para fazer uma nova.',
        sci: 'As embalagens (latas, folha, embalagens asséticas) e os transportes são os seus grandes usos, e as linhas elétricas aéreas: quilograma a quilograma conduz cerca do dobro do cobre. Reciclar gasta cerca de 5% da energia de o produzir de novo.',
      },
      pl: {
        kid: 'Z glinu, czyli aluminium, robi się puszki na napoje i folię kuchenną, a także samoloty, rowery i drabiny: jest lekki, mocny i nie rdzewieje. Przetopienie puszki oszczędza około 95% energii potrzebnej do zrobienia nowej.',
        sci: 'Opakowania (puszki, folia, kartony aseptyczne) i transport to jego główne zastosowania, a także napowietrzne linie energetyczne: kilogram w kilogram przewodzi prąd mniej więcej dwa razy lepiej niż miedź. Recykling wymaga około 5% energii potrzebnej do wytworzenia nowego metalu.',
      },
      de: {
        kid: 'Aus Aluminium macht man Getränkedosen und Alufolie, aber auch Flugzeuge, Fahrräder und Leitern: leicht und stark, und es rostet nicht. Eine Dose zu recyceln spart etwa 95% der Energie, die eine neue kosten würde.',
        sci: 'Verpackungen (Dosen, Folie, aseptische Kartons) und der Verkehr sind seine großen Verwendungen, dazu Freileitungen: Kilogramm für Kilogramm leitet es etwa doppelt so gut wie Kupfer. Recycling braucht etwa 5% der Energie einer Neuherstellung.',
      },
    },
  },
  'home.mould': {
    riddle: {
      en: {
        kid: 'A bendy cake mould that goes into a hot oven and never melts: is it made of an element? Find the picture! A nudge: take the element’s name and put an e on the end.',
        sci: 'Polydimethylsiloxane: rubbery from its glass transition near −125 °C to well over 200 °C, named in 1901 by Frederic Kipping, who took it for a kind of ketone. Find the picture.',
      },
      'pt-pt': {
        kid: 'Uma forma de bolos que dobra, vai ao forno quente e nunca derrete: é feita de um elemento? Encontra o quadro! Um empurrãozinho: o material chama-se quase como o elemento.',
        sci: 'Polidimetilsiloxano: elástico desde a transição vítrea, perto de −125 °C, até bem acima de 200 °C; deu-lhe o nome em 1901 Frederic Kipping, que o julgou parecido com uma cetona. Encontra o quadro.',
      },
      pl: {
        kid: 'Giętka forma do ciasta, która wchodzi do gorącego piekarnika i nigdy się nie topi: czy jest zrobiona z pierwiastka? Znajdź obraz! Mała pomoc: ten sam pierwiastek jest w piasku i w każdym chipie komputerowym.',
        sci: 'Polidimetylosiloksan: elastyczny od temperatury zeszklenia w pobliżu −125 °C do znacznie ponad 200 °C, nazwany w 1901 roku przez Frederica Kippinga, który uważał go za rodzaj ketonu. Znajdź obraz.',
      },
      de: {
        kid: 'Eine biegsame Kuchenform, die in den heißen Ofen kommt und nie schmilzt: Ist sie aus einem Element? Finde das Bild! Kleiner Schubs: Das Material heißt fast so wie das Element.',
        sci: 'Polydimethylsiloxan: gummiartig vom Glasübergang bei etwa −125 °C bis weit über 200 °C, 1901 von Frederic Kipping benannt, der es für eine Art Keton hielt. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'Not quite silicon: a bendy mould is silicone, long chains of silicon and oxygen that wiggle and slide, so it bends and stretches and survives both the oven and the freezer. Silicon itself is hard and snaps like glass.',
        sci: 'PDMS, -[Si(CH3)2-O]n-: long Si-O bonds (about 164 pm) and wide Si-O-Si angles (about 143°) make the chain flexible, and the strong Si-O bond makes it stable. It is made by the direct process of Rochow and Müller.',
      },
      'pt-pt': {
        kid: 'Não é bem silício: uma forma que dobra é de silicone, longas cadeias de silício e oxigénio que se torcem e deslizam, por isso dobra, estica e aguenta o forno e o congelador. O silício em si é duro e parte-se como vidro.',
        sci: 'PDMS, -[Si(CH3)2-O]n-: as ligações Si-O longas (cerca de 164 pm) e os ângulos Si-O-Si abertos (cerca de 143°) tornam a cadeia flexível, e a ligação Si-O forte torna-a estável. Faz-se pelo processo direto de Rochow e Müller.',
      },
      pl: {
        kid: 'To nie całkiem krzem: giętka forma jest z silikonu, długich łańcuchów krzemu i tlenu, które się wyginają i ślizgają, więc silikon się zgina, rozciąga i wytrzymuje i piekarnik, i zamrażarkę. Sam krzem jest twardy i pęka jak szkło.',
        sci: 'PDMS, -[Si(CH3)2-O]n-: długie wiązania Si-O (około 164 pm) i szerokie kąty Si-O-Si (około 143°) sprawiają, że łańcuch jest giętki, a mocne wiązanie Si-O czyni go trwałym. Wytwarza się go metodą bezpośrednią Rochowa i Müllera.',
      },
      de: {
        kid: 'Nicht ganz Silicium: Eine biegsame Form ist aus Silikon, langen Ketten aus Silicium und Sauerstoff, die sich winden und gleiten, deshalb biegt und dehnt sie sich und hält Ofen und Gefrierschrank aus. Silicium selbst ist hart und zerbricht wie Glas.',
        sci: 'PDMS, -[Si(CH3)2-O]n-: Lange Si-O-Bindungen (etwa 164 pm) und weite Si-O-Si-Winkel (etwa 143°) machen die Kette beweglich, die starke Si-O-Bindung macht sie beständig. Hergestellt wird es im Direktverfahren nach Rochow und Müller.',
      },
    },
  },
  'home.pencil': {
    riddle: {
      en: {
        kid: 'On your desk: the grey tip of your pencil. Its secret twin is the hardest natural material on Earth, a sparkling diamond! Find the picture of the twins. A nudge: every living thing is built of this element.',
        sci: 'One element, two materials: a tetrahedral sp3 network at 10 on the Mohs scale, and sp2 sheets 335 pm apart that slide off onto paper. Find the picture.',
      },
      'pt-pt': {
        kid: 'Na tua secretária: a ponta cinzenta do teu lápis. O seu gémeo secreto é o material natural mais duro da Terra, um diamante a brilhar! Encontra o quadro dos gémeos. Um empurrãozinho: todos os seres vivos são feitos deste elemento.',
        sci: 'Um elemento, dois materiais: uma rede tetraédrica sp3 com 10 na escala de Mohs, e folhas sp2 a 335 pm umas das outras que deslizam para o papel. Encontra o quadro.',
      },
      pl: {
        kid: 'Na twoim biurku: szary grafit w ołówku. Jego tajemny bliźniak to najtwardszy naturalny materiał na Ziemi, błyszczący diament! Znajdź obraz bliźniaków. Mała pomoc: z tego pierwiastka zbudowane jest wszystko, co żyje.',
        sci: 'Jeden pierwiastek, dwa materiały: tetraedryczna sieć sp3 o twardości 10 w skali Mohsa i warstwy sp2 oddalone o 335 pm, które zsuwają się na papier. Znajdź obraz.',
      },
      de: {
        kid: 'Auf deinem Schreibtisch: die graue Spitze deines Bleistifts. Ihr geheimer Zwilling ist das härteste natürliche Material der Erde, ein funkelnder Diamant! Finde das Bild der Zwillinge. Kleiner Schubs: Alles Lebendige ist aus diesem Element gebaut.',
        sci: 'Ein Element, zwei Materialien: ein tetraedrisches sp3-Netz mit Härte 10 auf der Mohs-Skala und sp2-Schichten im Abstand von 335 pm, die aufs Papier gleiten. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'Both are pure carbon. In a diamond every atom holds four neighbours tightly in every direction; in the graphite of a pencil the atoms make flat sheets that slide, so thin sheets rub off onto the paper.',
        sci: 'Diamond: C-C 154 pm, an electrical insulator. Graphite: sheets of hexagons (C-C 142 pm) held together only by weak van der Waals forces, a soft lubricant that conducts along the sheets.',
      },
      'pt-pt': {
        kid: 'Os dois são carbono puro. Num diamante, cada átomo agarra com força quatro vizinhos em todas as direções; na grafite de um lápis, os átomos formam folhas planas que deslizam, por isso folhas finas ficam no papel.',
        sci: 'Diamante: C-C 154 pm, um isolador elétrico. Grafite: folhas de hexágonos (C-C 142 pm) unidas só por forças de van der Waals fracas, um lubrificante macio que conduz ao longo das folhas.',
      },
      pl: {
        kid: 'Oba to czysty węgiel. W diamencie każdy atom mocno trzyma czterech sąsiadów we wszystkich kierunkach; w graficie ołówka atomy tworzą płaskie warstwy, które się ślizgają, więc cienkie warstwy zostają na papierze.',
        sci: 'Diament: C-C 154 pm, izolator elektryczny. Grafit: warstwy sześciokątów (C-C 142 pm) połączone tylko słabymi siłami van der Waalsa, miękki smar, który przewodzi prąd wzdłuż warstw.',
      },
      de: {
        kid: 'Beide sind reiner Kohlenstoff. Im Diamanten hält jedes Atom vier Nachbarn fest in alle Richtungen; im Graphit eines Bleistifts bilden die Atome flache Schichten, die gleiten, deshalb bleiben dünne Schichten auf dem Papier.',
        sci: 'Diamant: C-C 154 pm, ein elektrischer Isolator. Graphit: Sechseckschichten (C-C 142 pm), die nur schwache Van-der-Waals-Kräfte zusammenhalten, ein weiches Schmiermittel, das entlang der Schichten leitet.',
      },
    },
  },
  'home.window': {
    riddle: {
      en: {
        kid: 'On a freezing night, the best windows keep the warmth in with an invisible gas sealed between their panes of glass. Find the picture! A nudge: a heavy noble gas that hid in the air until 1898.',
        sci: 'Sealed between panes, a gas that conducts heat at about 0.0095 W/(m·K), against about 0.026 for air, with its best gap at about 8 to 12 mm. Find the picture.',
      },
      'pt-pt': {
        kid: 'Numa noite gelada, as melhores janelas guardam o calor com um gás invisível fechado entre os seus vidros. Encontra o quadro! Um empurrãozinho: um gás nobre pesado que se escondeu no ar até 1898.',
        sci: 'Fechado entre vidros, um gás que conduz o calor a cerca de 0,0095 W/(m·K), contra cerca de 0,026 do ar, com o melhor intervalo a cerca de 8 a 12 mm. Encontra o quadro.',
      },
      pl: {
        kid: 'W mroźną noc najlepsze okna zatrzymują ciepło dzięki niewidzialnemu gazowi zamkniętemu między szybami. Znajdź obraz! Mała pomoc: ciężki gaz szlachetny, który do 1898 roku ukrywał się w powietrzu.',
        sci: 'Zamknięty między szybami gaz przewodzi ciepło na poziomie około 0,0095 W/(m·K), wobec około 0,026 dla powietrza, a najlepsza szczelina ma około 8 do 12 mm. Znajdź obraz.',
      },
      de: {
        kid: 'In einer eiskalten Nacht halten die besten Fenster die Wärme mit einem unsichtbaren Gas drinnen, das zwischen ihren Scheiben eingeschlossen ist. Finde das Bild! Kleiner Schubs: ein schweres Edelgas, das sich bis 1898 in der Luft versteckte.',
        sci: 'Zwischen Scheiben eingeschlossen, ein Gas mit einer Wärmeleitfähigkeit von etwa 0,0095 W/(m·K), gegen etwa 0,026 für Luft, mit dem besten Abstand bei etwa 8 bis 12 mm. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: 'Krypton atoms are heavy and slow, so they pass heat along only about a third as well as air does. An invisible krypton blanket between the panes keeps the warmth in and the cold out.',
        sci: 'A low-emissivity coating stops most of the infrared and the gas sets the rest: krypton 0.0095, argon 0.0177, air about 0.026 W/(m·K). A triple-glazed krypton window with coated panes loses about a tenth as much heat as a single pane.',
      },
      'pt-pt': {
        kid: 'Os átomos de crípton são pesados e lentos, por isso passam o calor só cerca de um terço tão bem como o ar. Um cobertor invisível de crípton entre os vidros guarda o calor dentro e o frio fora.',
        sci: 'Um revestimento de baixa emissividade trava a maior parte do infravermelho, e o gás decide o resto: crípton 0,0095, árgon 0,0177, ar cerca de 0,026 W/(m·K). Uma janela tripla com crípton e vidros revestidos perde cerca de um décimo do calor de um vidro simples.',
      },
      pl: {
        kid: 'Atomy kryptonu są ciężkie i powolne, więc przekazują ciepło tylko mniej więcej w jednej trzeciej tak dobrze jak powietrze. Niewidzialny kryptonowy kocyk między szybami trzyma ciepło w środku, a zimno na zewnątrz.',
        sci: 'Powłoka niskoemisyjna zatrzymuje większość podczerwieni, a resztę ustala gaz: krypton 0,0095, argon 0,0177, powietrze około 0,026 W/(m·K). Okno z potrójną szybą, kryptonem i powlekanymi szybami traci około jednej dziesiątej ciepła, które traci pojedyncza szyba.',
      },
      de: {
        kid: 'Kryptonatome sind schwer und langsam, deshalb geben sie Wärme nur etwa ein Drittel so gut weiter wie Luft. Eine unsichtbare Kryptondecke zwischen den Scheiben hält die Wärme drinnen und die Kälte draußen.',
        sci: 'Eine Low-E-Beschichtung hält das meiste Infrarot auf, den Rest bestimmt das Gas: Krypton 0,0095, Argon 0,0177, Luft etwa 0,026 W/(m·K). Ein dreifach verglastes Kryptonfenster mit beschichteten Scheiben verliert etwa ein Zehntel der Wärme einer Einfachscheibe.',
      },
    },
  },
  'home.toothpaste': {
    riddle: {
      en: {
        kid: 'In the bathroom: your toothpaste makes your teeth stronger against holes with the help of an element. Find what it is for! A nudge: it is also in the coating of non-stick frying pans.',
        sci: 'In toothpaste it turns the hydroxyapatite of tooth enamel towards a more acid-resistant apatite; in the kitchen it coats non-stick pans as PTFE. Find what it is for.',
      },
      'pt-pt': {
        kid: 'Na casa de banho: a tua pasta de dentes torna os dentes mais fortes contra as cáries com a ajuda de um elemento. Descobre para que serve! Um empurrãozinho: também está no revestimento das frigideiras antiaderentes.',
        sci: 'Na pasta de dentes, faz passar a hidroxiapatite do esmalte dentário a uma apatite mais resistente aos ácidos; na cozinha, reveste as frigideiras antiaderentes como PTFE. Descobre para que serve.',
      },
      pl: {
        kid: 'W łazience: twoja pasta do zębów wzmacnia zęby przeciw dziurom dzięki pewnemu pierwiastkowi. Sprawdź, do czego służy! Mała pomoc: jest też w powłoce patelni nieprzywierających.',
        sci: 'W paście do zębów przekształca hydroksyapatyt szkliwa w apatyt bardziej odporny na kwasy; w kuchni pokrywa patelnie nieprzywierające jako PTFE. Sprawdź, do czego służy.',
      },
      de: {
        kid: 'Im Badezimmer: Deine Zahnpasta macht deine Zähne mit Hilfe eines Elements stärker gegen Löcher. Finde heraus, wofür es verwendet wird! Kleiner Schubs: Es steckt auch in der Beschichtung von Antihaft-Pfannen.',
        sci: 'In der Zahnpasta verwandelt es den Hydroxylapatit des Zahnschmelzes in einen säurefesteren Apatit; in der Küche beschichtet es Antihaft-Pfannen als PTFE. Finde heraus, wofür es verwendet wird.',
      },
    },
    found: {
      en: {
        kid: 'Fluorine, as fluoride in toothpaste, makes the enamel of your teeth stronger against cavities. Non-stick pans are coated with Teflon, a plastic full of fluorine.',
        sci: 'Fluoride turns hydroxyapatite towards fluorapatite. PTFE (Teflon) was found by accident by Roy Plunkett in 1938, and about a fifth of medicines contain fluorine.',
      },
      'pt-pt': {
        kid: 'O flúor, como fluoreto na pasta de dentes, torna o esmalte dos teus dentes mais forte contra as cáries. As frigideiras antiaderentes são revestidas de Teflon, um plástico cheio de flúor.',
        sci: 'O fluoreto faz passar a hidroxiapatite a fluorapatite. O PTFE (Teflon) foi descoberto por acaso por Roy Plunkett em 1938, e cerca de um quinto dos medicamentos contém flúor.',
      },
      pl: {
        kid: 'Fluor, jako fluorek w paście do zębów, wzmacnia szkliwo twoich zębów przeciw próchnicy. Patelnie nieprzywierające pokrywa się teflonem, tworzywem pełnym fluoru.',
        sci: 'Fluorek przekształca hydroksyapatyt w fluoroapatyt. PTFE (teflon) odkrył przypadkiem Roy Plunkett w 1938 roku, a fluor zawiera mniej więcej co piąty lek.',
      },
      de: {
        kid: 'Fluor, als Fluorid in der Zahnpasta, macht den Schmelz deiner Zähne stärker gegen Karies. Antihaft-Pfannen sind mit Teflon beschichtet, einem Kunststoff voller Fluor.',
        sci: 'Fluorid wandelt Hydroxylapatit in Fluorapatit um. PTFE (Teflon) fand Roy Plunkett 1938 durch Zufall, und etwa jedes fünfte Medikament enthält Fluor.',
      },
    },
  },

  // ---- Records: the most of everything, from element 1 to element 118 ----
  'records.lightest': {
    riddle: {
      en: {
        kid: 'The lightest atom of all, and the commonest in the whole universe: it was made just after the Big Bang. Find the picture of the very first atoms!',
        sci: '1.008 u, the lightest atom: about 92% of the nuclei made in the first minutes after the Big Bang. Find the picture.',
      },
      'pt-pt': {
        kid: 'O átomo mais leve de todos, e o mais comum em todo o Universo: foi feito logo a seguir ao Big Bang. Encontra o quadro dos primeiríssimos átomos!',
        sci: '1,008 u, o átomo mais leve: cerca de 92% dos núcleos feitos nos primeiros minutos depois do Big Bang. Encontra o quadro.',
      },
      pl: {
        kid: 'Najlżejszy atom ze wszystkich i najczęstszy w całym Wszechświecie: powstał zaraz po Wielkim Wybuchu. Znajdź obraz z pierwszymi atomami!',
        sci: '1,008 u, najlżejszy atom: około 92% jąder powstałych w pierwszych minutach po Wielkim Wybuchu. Znajdź obraz.',
      },
      de: {
        kid: 'Das leichteste Atom von allen und das häufigste im ganzen Universum: Es entstand gleich nach dem Urknall. Finde das Bild der allerersten Atome!',
        sci: '1,008 u, das leichteste Atom: etwa 92% der Kerne, die in den ersten Minuten nach dem Urknall entstanden. Finde das Bild.',
      },
    },
    found: {
      en: {
        kid: '380,000 years after the Big Bang the universe had cooled enough for each proton to catch an electron: the first atoms, and almost all of them were hydrogen. The hydrogen in your glass of water was made back then!',
        sci: 'Big Bang nucleosynthesis left about 75% hydrogen and 25% helium by mass. At recombination, about 380,000 years later and near 3000 K, neutral atoms formed and the light went free: we see it now as the 2.7 K microwave background.',
      },
      'pt-pt': {
        kid: '380 mil anos depois do Big Bang, o Universo já tinha arrefecido o suficiente para cada protão apanhar um eletrão: os primeiros átomos, e quase todos eram hidrogénio. O hidrogénio do teu copo de água foi feito nessa altura!',
        sci: 'A nucleossíntese do Big Bang deixou cerca de 75% de hidrogénio e 25% de hélio em massa. Na recombinação, cerca de 380 mil anos depois e perto de 3000 K, formaram-se átomos neutros e a luz ficou livre: vemo-la hoje como a radiação de fundo de micro-ondas a 2,7 K.',
      },
      pl: {
        kid: '380 tysięcy lat po Wielkim Wybuchu Wszechświat ostygł na tyle, że każdy proton mógł złapać elektron: tak powstały pierwsze atomy, prawie wszystkie były wodorem. Wodór w twojej szklance wody powstał właśnie wtedy!',
        sci: 'Nukleosynteza Wielkiego Wybuchu zostawiła około 75% wodoru i 25% helu (masowo). W epoce rekombinacji, około 380 tysięcy lat później i przy około 3000 K, powstały obojętne atomy, a światło się uwolniło: widzimy je dziś jako mikrofalowe promieniowanie tła o temperaturze 2,7 K.',
      },
      de: {
        kid: '380 000 Jahre nach dem Urknall war das Universum so weit abgekühlt, dass jedes Proton ein Elektron einfangen konnte: die ersten Atome, und fast alle waren Wasserstoff. Der Wasserstoff in deinem Glas Wasser ist damals entstanden!',
        sci: 'Die Nukleosynthese des Urknalls hinterließ etwa 75% Wasserstoff und 25% Helium (nach Masse). Bei der Rekombination, etwa 380 000 Jahre später und bei rund 3000 K, entstanden neutrale Atome, und das Licht wurde frei: Wir sehen es heute als 2,7-K-Mikrowellenhintergrund.',
      },
    },
  },
  'records.coldest': {
    riddle: {
      en: {
        kid: 'The hardest of all things to turn into a liquid: it boils at about −269 °C, colder than anything else. Find out what it is like at room temperature! A nudge: it makes party balloons float.',
        sci: 'The lowest boiling point of all, 4.22 K; at one atmosphere it never solidifies, not even at absolute zero. Find the station on its state.',
      },
      'pt-pt': {
        kid: 'A coisa mais difícil de todas de transformar em líquido: ferve a cerca de −269 °C, mais frio do que tudo o resto. Descobre como é à temperatura ambiente! Um empurrãozinho: faz flutuar os balões das festas.',
        sci: 'O ponto de ebulição mais baixo de todos, 4,22 K; a uma atmosfera nunca solidifica, nem no zero absoluto. Encontra o painel sobre o seu estado.',
      },
      pl: {
        kid: 'To, co najtrudniej ze wszystkiego zamienić w ciecz: wrze w temperaturze około −269 °C, zimniejszej niż cokolwiek innego. Sprawdź, jaki jest w temperaturze pokojowej! Mała pomoc: dzięki niemu balony na przyjęciach unoszą się w górę.',
        sci: 'Najniższa temperatura wrzenia ze wszystkich, 4,22 K; pod ciśnieniem jednej atmosfery nigdy nie krzepnie, nawet w zerze absolutnym. Znajdź tablicę o jego stanie skupienia.',
      },
      de: {
        kid: 'Das, was sich am allerschwersten in eine Flüssigkeit verwandeln lässt: Es siedet bei etwa −269 °C, kälter als alles andere. Finde heraus, wie es bei Raumtemperatur ist! Kleiner Schubs: Es lässt Partyballons schweben.',
        sci: 'Der tiefste Siedepunkt von allen, 4,22 K; bei einer Atmosphäre wird es nie fest, nicht einmal am absoluten Nullpunkt. Finde die Station zu seinem Zustand.',
      },
    },
    found: {
      en: {
        kid: 'Helium turns liquid only at −269 °C, just 4 degrees above the coldest temperature possible, and it never freezes unless it is squeezed hard. A little colder still, liquid helium climbs up the walls of its cup!',
        sci: 'Helium-4 boils at 4.22 K and at 1 atm stays liquid down to absolute zero; it solidifies only above about 25 atm. Below 2.17 K, the lambda point, it becomes a superfluid with zero viscosity.',
      },
      'pt-pt': {
        kid: 'O hélio só passa a líquido a −269 °C, apenas 4 graus acima da temperatura mais fria possível, e nunca congela, a não ser que o apertem com muita força. Um pouco mais frio ainda, o hélio líquido trepa pelas paredes do copo!',
        sci: 'O hélio-4 ferve a 4,22 K e, a 1 atm, continua líquido até ao zero absoluto; só solidifica acima de cerca de 25 atm. Abaixo de 2,17 K, o ponto lambda, torna-se um superfluido com viscosidade nula.',
      },
      pl: {
        kid: 'Hel staje się cieczą dopiero w temperaturze −269 °C, zaledwie 4 stopnie powyżej najniższej możliwej temperatury, i nigdy nie zamarza, chyba że mocno się go ściśnie. Trochę zimniej ciekły hel wspina się po ściankach kubka!',
        sci: 'Hel-4 wrze w temperaturze 4,22 K i pod ciśnieniem 1 atm pozostaje ciekły aż do zera absolutnego; krzepnie dopiero powyżej około 25 atm. Poniżej 2,17 K, w punkcie lambda, staje się nadciekły, o zerowej lepkości.',
      },
      de: {
        kid: 'Helium wird erst bei −269 °C flüssig, nur 4 Grad über der kältesten möglichen Temperatur, und es gefriert nie, außer man drückt es kräftig zusammen. Noch ein bisschen kälter, und flüssiges Helium klettert an den Wänden seines Bechers hoch!',
        sci: 'Helium-4 siedet bei 4,22 K und bleibt bei 1 atm bis zum absoluten Nullpunkt flüssig; fest wird es erst oberhalb von etwa 25 atm. Unter 2,17 K, dem Lambdapunkt, wird es suprafluid, ohne jede Viskosität.',
      },
    },
  },
  'records.hardest': {
    riddle: {
      en: {
        kid: 'The hardest natural material on Earth! Find the gallery where it shines, next to its soft grey twin. A nudge: it is made of the same atoms as your pencil.',
        sci: '10 on the Mohs scale, a thermal conductivity of about 2000 W/(m·K) and a band gap of 5.5 eV. Find the gallery of its element’s forms.',
      },
      'pt-pt': {
        kid: 'O material natural mais duro da Terra! Encontra a galeria onde ele brilha, ao lado do seu gémeo cinzento e macio. Um empurrãozinho: é feito dos mesmos átomos que o teu lápis.',
        sci: '10 na escala de Mohs, uma condutividade térmica de cerca de 2000 W/(m·K) e uma banda proibida de 5,5 eV. Encontra a galeria das formas do seu elemento.',
      },
      pl: {
        kid: 'Najtwardszy naturalny materiał na Ziemi! Znajdź galerię, w której błyszczy obok swojego miękkiego, szarego bliźniaka. Mała pomoc: jest zrobiony z tych samych atomów co twój ołówek.',
        sci: '10 w skali Mohsa, przewodnictwo cieplne około 2000 W/(m·K) i przerwa energetyczna 5,5 eV. Znajdź galerię odmian jego pierwiastka.',
      },
      de: {
        kid: 'Das härteste natürliche Material der Erde! Finde die Galerie, in der es funkelt, neben seinem weichen grauen Zwilling. Kleiner Schubs: Es besteht aus denselben Atomen wie dein Bleistift.',
        sci: '10 auf der Mohs-Skala, eine Wärmeleitfähigkeit von etwa 2000 W/(m·K) und eine Bandlücke von 5,5 eV. Finde die Galerie der Formen seines Elements.',
      },
    },
    found: {
      en: {
        kid: 'Diamond: every carbon atom holds four others, locked into one strong net in every direction. It is the hardest natural material, and it carries heat about five times better than copper.',
        sci: 'Diamond cubic, a = 3.567 Å, C-C 1.545 Å (sp3). At room pressure diamond is metastable: graphite is slightly more stable, but the change would have to break every bond, so at room temperature it never happens.',
      },
      'pt-pt': {
        kid: 'O diamante: cada átomo de carbono agarra outros quatro, presos numa rede forte em todas as direções. É o material natural mais duro, e conduz o calor cerca de cinco vezes melhor do que o cobre.',
        sci: 'Diamante cúbico, a = 3,567 Å, C-C 1,545 Å (sp3). À pressão ambiente o diamante é metaestável: a grafite é um pouco mais estável, mas a mudança teria de partir todas as ligações, por isso, à temperatura ambiente, nunca acontece.',
      },
      pl: {
        kid: 'Diament: każdy atom węgla trzyma cztery inne, połączone w jedną mocną sieć we wszystkich kierunkach. To najtwardszy naturalny materiał, a ciepło przewodzi mniej więcej pięć razy lepiej niż miedź.',
        sci: 'Sieć diamentu, a = 3,567 Å, C-C 1,545 Å (sp3). Pod zwykłym ciśnieniem diament jest metastabilny: grafit jest nieco trwalszy, ale przemiana wymagałaby zerwania wszystkich wiązań, więc w temperaturze pokojowej nigdy nie zachodzi.',
      },
      de: {
        kid: 'Diamant: Jedes Kohlenstoffatom hält vier andere fest, verbunden zu einem starken Netz in alle Richtungen. Er ist das härteste natürliche Material und leitet Wärme etwa fünfmal besser als Kupfer.',
        sci: 'Diamantgitter, a = 3,567 Å, C-C 1,545 Å (sp3). Bei Normaldruck ist Diamant metastabil: Graphit ist etwas stabiler, aber die Umwandlung müsste jede Bindung brechen, deshalb geschieht sie bei Raumtemperatur nie.',
      },
    },
  },
  'records.commonest': {
    riddle: {
      en: {
        kid: 'This element is about two thirds of your weight, and almost half of the rocks under your feet! Find its fact file. A nudge: you breathe it.',
        sci: 'About 65% of the human body and 46% of the Earth’s crust by mass: the most abundant element in both. Find its fact file.',
      },
      'pt-pt': {
        kid: 'Este elemento é cerca de dois terços do teu peso e quase metade das rochas debaixo dos teus pés! Encontra a sua ficha técnica. Um empurrãozinho: respira-lo.',
        sci: 'Cerca de 65% do corpo humano e 46% da crosta terrestre em massa: o elemento mais abundante nos dois. Encontra a sua ficha técnica.',
      },
      pl: {
        kid: 'Ten pierwiastek to około dwóch trzecich twojej wagi i prawie połowa skał pod twoimi stopami! Znajdź jego metryczkę. Mała pomoc: oddychasz nim.',
        sci: 'Około 65% masy ciała człowieka i 46% masy skorupy ziemskiej: najpowszechniejszy pierwiastek w obu. Znajdź jego metryczkę.',
      },
      de: {
        kid: 'Dieses Element ist etwa zwei Drittel deines Gewichts und fast die Hälfte der Gesteine unter deinen Füßen! Finde seinen Steckbrief. Kleiner Schubs: Du atmest es.',
        sci: 'Etwa 65% des menschlichen Körpers und 46% der Erdkruste nach Masse: das häufigste Element in beiden. Finde seinen Steckbrief.',
      },
    },
    found: {
      en: {
        kid: 'Oxygen is everywhere: 21 of every 100 molecules of air, most of the weight of water, almost half of the rocks, and about two thirds of you.',
        sci: 'The most abundant element in the crust (46% by mass, in silicates and oxides), 89% of water by mass and about 65% of the human body, and the third most abundant in the universe.',
      },
      'pt-pt': {
        kid: 'O oxigénio está em todo o lado: 21 em cada 100 moléculas do ar, a maior parte do peso da água, quase metade das rochas e cerca de dois terços de ti.',
        sci: 'O elemento mais abundante da crosta (46% em massa, em silicatos e óxidos), 89% da água em massa e cerca de 65% do corpo humano, e o terceiro mais abundante do Universo.',
      },
      pl: {
        kid: 'Tlen jest wszędzie: to 21 na każde 100 cząsteczek powietrza, większość masy wody, prawie połowa skał i około dwóch trzecich ciebie.',
        sci: 'Najpowszechniejszy pierwiastek skorupy ziemskiej (46% masy, w krzemianach i tlenkach), 89% masy wody i około 65% masy ciała człowieka, a we Wszechświecie trzeci pod względem ilości.',
      },
      de: {
        kid: 'Sauerstoff ist überall: 21 von 100 Teilchen der Luft, das meiste Gewicht des Wassers, fast die Hälfte der Gesteine und etwa zwei Drittel von dir.',
        sci: 'Das häufigste Element der Erdkruste (46% nach Masse, in Silikaten und Oxiden), 89% der Masse des Wassers und etwa 65% des menschlichen Körpers, und das dritthäufigste im Universum.',
      },
    },
  },
  'records.densest': {
    riddle: {
      en: {
        kid: 'The densest element of all: a cube 10 cm on each side would weigh about 22.6 kg, twice as much as the same cube of lead! Find out what it is like. A nudge: its name comes from the Greek word for smell.',
        sci: '22.59 g/cm³, a whisker ahead of its right-hand neighbour (22.56 g/cm³): the densest element. Find the station on its state.',
      },
      'pt-pt': {
        kid: 'O elemento mais denso de todos: um cubo com 10 cm de lado pesaria cerca de 22,6 kg, o dobro do mesmo cubo de chumbo! Descobre como é. Um empurrãozinho: o seu nome vem da palavra grega para cheiro.',
        sci: '22,59 g/cm³, um nadinha à frente do seu vizinho da direita (22,56 g/cm³): o elemento mais denso. Encontra o painel sobre o seu estado.',
      },
      pl: {
        kid: 'Najgęstszy pierwiastek ze wszystkich: sześcian o boku 10 cm ważyłby około 22,6 kg, dwa razy więcej niż taki sam sześcian z ołowiu! Sprawdź, jaki jest. Mała pomoc: jego nazwa pochodzi od greckiego słowa oznaczającego zapach.',
        sci: '22,59 g/cm³, o włos przed sąsiadem z prawej (22,56 g/cm³): najgęstszy pierwiastek. Znajdź tablicę o jego stanie skupienia.',
      },
      de: {
        kid: 'Das dichteste Element von allen: Ein Würfel mit 10 cm Kantenlänge würde etwa 22,6 kg wiegen, doppelt so viel wie derselbe Würfel aus Blei! Finde heraus, wie es ist. Kleiner Schubs: Sein Name kommt vom griechischen Wort für Geruch.',
        sci: '22,59 g/cm³, eine Haaresbreite vor seinem rechten Nachbarn (22,56 g/cm³): das dichteste Element. Finde die Station zu seinem Zustand.',
      },
    },
    found: {
      en: {
        kid: 'Osmium, a hard, brittle, bluish-white metal, is the densest of all the elements. Its neighbour iridium comes a very, very close second.',
        sci: 'Osmium 22.59 g/cm³, iridium 22.56: densities worked out from their crystals put osmium ahead by a hair. Hexagonal close-packed, it melts at 3033 °C and is one of the least compressible substances known.',
      },
      'pt-pt': {
        kid: 'O ósmio, um metal duro, quebradiço e branco-azulado, é o mais denso de todos os elementos. O seu vizinho, o irídio, fica em segundo, mesmo, mesmo perto.',
        sci: 'Ósmio 22,59 g/cm³, irídio 22,56: as densidades calculadas a partir dos seus cristais põem o ósmio à frente por um fio. Hexagonal compacto, funde a 3033 °C e é uma das substâncias menos compressíveis que se conhecem.',
      },
      pl: {
        kid: 'Osm, twardy, kruchy, niebieskawobiały metal, jest najgęstszym ze wszystkich pierwiastków. Jego sąsiad, iryd, jest drugi, bardzo, bardzo blisko.',
        sci: 'Osm 22,59 g/cm³, iryd 22,56: gęstości wyliczone z ich kryształów stawiają osm na prowadzeniu o włos. Ma heksagonalną strukturę gęsto upakowaną, topi się w temperaturze 3033 °C i jest jedną z najmniej ściśliwych znanych substancji.',
      },
      de: {
        kid: 'Osmium, ein hartes, sprödes, bläulich weißes Metall, ist das dichteste aller Elemente. Sein Nachbar Iridium wird ganz, ganz knapp Zweiter.',
        sci: 'Osmium 22,59 g/cm³, Iridium 22,56: Aus ihren Kristallen berechnete Dichten setzen Osmium um Haaresbreite vorn. Hexagonal dicht gepackt, schmilzt es bei 3033 °C und gehört zu den am wenigsten kompressiblen Stoffen.',
      },
    },
  },
  'records.liquid': {
    riddle: {
      en: {
        kid: 'A metal you can pour! It is liquid at room temperature and rolls about in shiny beads. Find the real thing in its hall. A nudge: old thermometers were filled with it.',
        sci: 'Liquid from −38.83 °C to 356.7 °C, with a surface tension nearly seven times water’s and a density of 13.5 g/cm³. Find the specimen in its hall.',
      },
      'pt-pt': {
        kid: 'Um metal que se pode despejar! É líquido à temperatura ambiente e rola em bolinhas brilhantes. Encontra a amostra verdadeira no seu salão. Um empurrãozinho: os termómetros antigos eram cheios dele.',
        sci: 'Líquido de −38,83 °C a 356,7 °C, com uma tensão superficial quase sete vezes a da água e uma densidade de 13,5 g/cm³. Encontra a amostra no seu salão.',
      },
      pl: {
        kid: 'Metal, który można przelewać! W temperaturze pokojowej jest cieczą i toczy się błyszczącymi kuleczkami. Znajdź prawdziwą próbkę w sali tego pierwiastka. Mała pomoc: dawniej napełniano nim termometry.',
        sci: 'Ciecz od −38,83 °C do 356,7 °C, o napięciu powierzchniowym prawie siedem razy większym niż woda i gęstości 13,5 g/cm³. Znajdź próbkę w sali tego pierwiastka.',
      },
      de: {
        kid: 'Ein Metall, das man gießen kann! Es ist bei Raumtemperatur flüssig und rollt in glänzenden Kügelchen herum. Finde die echte Probe in seiner Halle. Kleiner Schubs: Alte Thermometer waren damit gefüllt.',
        sci: 'Flüssig von −38,83 °C bis 356,7 °C, mit einer Oberflächenspannung von fast dem Siebenfachen des Wassers und einer Dichte von 13,5 g/cm³. Finde die Probe in seiner Halle.',
      },
    },
    found: {
      en: {
        kid: 'Mercury is the only metal anyone has seen liquid at room temperature. Gallium and caesium melt on a hot day, at about 30 °C and 28 °C: gallium even melts in your hand!',
        sci: 'Mercury melts at −38.83 °C. Caesium (28.44 °C) and gallium (29.76 °C) melt just above room temperature; copernicium and flerovium are predicted to be liquids too, but only a few atoms of either have ever been made.',
      },
      'pt-pt': {
        kid: 'O mercúrio é o único metal que alguém já viu líquido à temperatura ambiente. O gálio e o césio derretem num dia de calor, a cerca de 30 °C e 28 °C: o gálio derrete-se até na tua mão!',
        sci: 'O mercúrio funde a −38,83 °C. O césio (28,44 °C) e o gálio (29,76 °C) fundem pouco acima da temperatura ambiente; prevê-se que o copernício e o fleróvio também sejam líquidos, mas só se fizeram alguns átomos de cada um.',
      },
      pl: {
        kid: 'Rtęć to jedyny metal, jaki ktokolwiek widział w stanie ciekłym w temperaturze pokojowej. Gal i cez topią się w upalny dzień, w temperaturze około 30 °C i 28 °C: gal topi się nawet w dłoni!',
        sci: 'Rtęć topi się w temperaturze −38,83 °C. Cez (28,44 °C) i gal (29,76 °C) topią się tuż powyżej temperatury pokojowej; przewiduje się, że kopernik i flerow też są cieczami, ale wytworzono dotąd tylko po kilka atomów każdego z nich.',
      },
      de: {
        kid: 'Quecksilber ist das einzige Metall, das man je bei Raumtemperatur flüssig gesehen hat. Gallium und Caesium schmelzen an einem heißen Tag, bei etwa 30 °C und 28 °C: Gallium schmilzt sogar in deiner Hand!',
        sci: 'Quecksilber schmilzt bei −38,83 °C. Caesium (28,44 °C) und Gallium (29,76 °C) schmelzen knapp über Raumtemperatur; Copernicium und Flerovium sind vermutlich auch flüssig, doch von beiden wurden nur ein paar Atome hergestellt.',
      },
    },
  },
  'records.heaviest': {
    riddle: {
      en: {
        kid: 'The heaviest element ever made: every one of its atoms has 118 protons, and only a handful have ever existed! Find its identity card. A nudge: it is in the very last box of the table.',
        sci: 'Z = 118: californium-249 struck by calcium-48 at Dubna, the first atom in 2002, announced in 2006, credited in 2015. Find its identity card.',
      },
      'pt-pt': {
        kid: 'O elemento mais pesado alguma vez feito: cada um dos seus átomos tem 118 protões, e só existiram uns poucos! Encontra o seu bilhete de identidade. Um empurrãozinho: está na última casa de todas da tabela.',
        sci: 'Z = 118: califórnio-249 bombardeado com cálcio-48 em Dubna, o primeiro átomo em 2002, anunciado em 2006, reconhecido em 2015. Encontra o seu bilhete de identidade.',
      },
      pl: {
        kid: 'Najcięższy pierwiastek, jaki kiedykolwiek wytworzono: każdy jego atom ma 118 protonów, a istniało ich tylko kilka! Znajdź jego dowód osobisty. Mała pomoc: jest w ostatniej kratce układu okresowego.',
        sci: 'Z = 118: kaliforn-249 bombardowany wapniem-48 w Dubnej, pierwszy atom w 2002 roku, ogłoszenie w 2006, uznanie w 2015. Znajdź jego dowód osobisty.',
      },
      de: {
        kid: 'Das schwerste Element, das je hergestellt wurde: Jedes seiner Atome hat 118 Protonen, und es gab nur eine Handvoll davon! Finde seinen Steckbrief. Kleiner Schubs: Es steht im allerletzten Kästchen des Periodensystems.',
        sci: 'Z = 118: Californium-249, beschossen mit Calcium-48 in Dubna, das erste Atom 2002, bekannt gegeben 2006, anerkannt 2015. Finde seinen Steckbrief.',
      },
    },
    found: {
      en: {
        kid: 'Oganesson: each of its atoms broke apart in less than a thousandth of a second. It sits with the noble gases, but calculations predict that it would be a solid!',
        sci: 'Og-294, its only confirmed isotope, alpha-decays in about 0.7 ms. Its bulk properties are predictions: a solid at room temperature, melting near 325 K, possibly a semiconductor.',
      },
      'pt-pt': {
        kid: 'O oganésson: cada um dos seus átomos desfez-se em menos de uma milésima de segundo. Está com os gases nobres, mas os cálculos preveem que seria sólido!',
        sci: 'O Og-294, o seu único isótopo confirmado, sofre decaimento alfa em cerca de 0,7 ms. As suas propriedades em bloco são previsões: sólido à temperatura ambiente, fundindo perto de 325 K, talvez um semicondutor.',
      },
      pl: {
        kid: 'Oganeson: każdy jego atom rozpadł się w mniej niż tysięczną część sekundy. Stoi razem z gazami szlachetnymi, ale obliczenia przewidują, że byłby ciałem stałym!',
        sci: 'Og-294, jego jedyny potwierdzony izotop, ulega rozpadowi alfa w około 0,7 ms. Jego właściwości makroskopowe to prognozy: ciało stałe w temperaturze pokojowej, topniejące w pobliżu 325 K, być może półprzewodnik.',
      },
      de: {
        kid: 'Oganesson: Jedes seiner Atome zerfiel in weniger als einer tausendstel Sekunde. Es steht bei den Edelgasen, aber Berechnungen sagen voraus, dass es fest wäre!',
        sci: 'Og-294, sein einziges bestätigtes Isotop, zerfällt in etwa 0,7 ms durch Alphazerfall. Seine Stoffeigenschaften sind Vorhersagen: bei Raumtemperatur fest, Schmelzpunkt nahe 325 K, vielleicht ein Halbleiter.',
      },
    },
  },
}

/** A text of the hunts at the level, in the language (English where a language lacks it). */
export function huntText(entry, lang, level) {
  const l = entry?.[lang] ?? entry?.en
  if (!l) return ''
  return (level === 'scientist' ? l.sci : l.kid) ?? l.kid ?? l.sci ?? ''
}
