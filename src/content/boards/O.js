// Oxygen's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls, each
// a question that makes you walk up, and the story it opens (Explorer and Scientist). The picture is
// public/boards/O/<id>.svg (no words in it: the title is drawn in the visitor's language). `wing` links
// the story to one of the element's wings.
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'breath',
    color: '#ff7b7b',
    wing: 'air',
    title: {
      en: 'Why do you breathe?',
      'pt-pt': 'Porque é que respiras?',
      pl: 'Po co oddychasz?',
      de: 'Warum atmest du?',
    },
    story: {
      en: {
        kid: [
          'Every breath brings oxygen into your lungs. Your red blood cells pick it up and carry it all round your body.',
          'There it helps turn your food into energy, a bit like a very slow, gentle fire. You breathe out what is left over as carbon dioxide.',
        ],
        sci: [
          'Haemoglobin binds O2 in the lungs (up to four O2 per molecule, on the iron of its haem groups) and releases it in the tissues.',
          'In the mitochondria O2 is the final electron acceptor of the respiratory chain, which makes most of the cell\'s ATP. An adult at rest uses roughly 250 mL of O2 a minute.',
        ],
      },
      'pt-pt': {
        kid: [
          'Cada vez que respiras, o oxigénio entra nos teus pulmões. Os glóbulos vermelhos do sangue apanham-no e levam-no por todo o corpo.',
          'Lá, ajuda a transformar a comida em energia, um pouco como um fogo muito lento e suave. O que sobra sai quando expiras, como dióxido de carbono.',
        ],
        sci: [
          'A hemoglobina fixa o O2 nos pulmões (até quatro O2 por molécula, no ferro dos seus grupos heme) e liberta-o nos tecidos.',
          'Nas mitocôndrias, o O2 é o aceitador final de eletrões da cadeia respiratória, que produz a maior parte do ATP da célula. Um adulto em repouso gasta cerca de 250 mL de O2 por minuto.',
        ],
      },
      pl: {
        kid: [
          'Z każdym oddechem tlen trafia do twoich płuc. Czerwone krwinki go zabierają i roznoszą po całym twoim ciele.',
          'Tam pomaga zamieniać jedzenie w energię, trochę jak bardzo powolny, łagodny ogień. To, co zostaje, wydychasz jako dwutlenek węgla.',
        ],
        sci: [
          'Hemoglobina wiąże O2 w płucach (do czterech O2 na cząsteczkę, na żelazie swoich grup hemowych) i uwalnia go w tkankach.',
          'W mitochondriach O2 jest końcowym akceptorem elektronów w łańcuchu oddechowym, który wytwarza większość ATP komórki. Dorosły w spoczynku zużywa mniej więcej 250 mL O2 na minutę.',
        ],
      },
      de: {
        kid: [
          'Jeder Atemzug bringt Sauerstoff in deine Lunge. Deine roten Blutkörperchen nehmen ihn auf und tragen ihn durch deinen ganzen Körper.',
          'Dort hilft er, dein Essen in Energie zu verwandeln, ein bisschen wie ein ganz langsames, sanftes Feuer. Was übrig bleibt, atmest du als Kohlenstoffdioxid aus.',
        ],
        sci: [
          'Hämoglobin bindet O2 in der Lunge (bis zu vier O2 pro Molekül, am Eisen seiner Hämgruppen) und gibt es im Gewebe wieder ab.',
          'In den Mitochondrien ist O2 der terminale Elektronenakzeptor der Atmungskette, die den größten Teil des ATP der Zelle erzeugt. Ein Erwachsener in Ruhe verbraucht ungefähr 250 mL O2 pro Minute.',
        ],
      },
    },
  },
  {
    id: 'fire',
    color: '#ffa94d',
    wing: 'fire',
    title: {
      en: 'What does a fire need?',
      'pt-pt': 'De que precisa o fogo?',
      pl: 'Czego potrzebuje ogień?',
      de: 'Was braucht ein Feuer?',
    },
    story: {
      en: {
        kid: [
          'A fire needs three things: something to burn, heat, and oxygen.',
          'Take one away and the flame dies. That is why a lid, a fire blanket or sand puts out a small fire: they keep the oxygen out.',
        ],
        sci: [
          'Combustion is fast oxidation: fuel + O2 → CO2 + H2O + heat.',
          'Many flames go out when the air has less than about 15% oxygen (air has 21%); in pure oxygen things burn fiercely, which is why oxygen cylinders are kept away from oil and flames.',
        ],
      },
      'pt-pt': {
        kid: [
          'O fogo precisa de três coisas: algo que arda, calor e oxigénio.',
          'Tira uma delas e a chama morre. É por isso que uma tampa, uma manta corta-fogo ou areia apagam um fogo pequeno: não deixam entrar o oxigénio.',
        ],
        sci: [
          'A combustão é uma oxidação rápida: combustível + O2 → CO2 + H2O + calor.',
          'Muitas chamas apagam-se quando o ar tem menos de cerca de 15% de oxigénio (o ar tem 21%); em oxigénio puro as coisas ardem com violência, e é por isso que as garrafas de oxigénio se mantêm longe de óleos e de chamas.',
        ],
      },
      pl: {
        kid: [
          'Ogień potrzebuje trzech rzeczy: czegoś, co może się palić, ciepła i tlenu.',
          'Zabierz jedną z nich, a płomień zgaśnie. Dlatego pokrywka, koc gaśniczy albo piasek gaszą mały ogień: odcinają dopływ tlenu.',
        ],
        sci: [
          'Spalanie to szybkie utlenianie: paliwo + O2 → CO2 + H2O + ciepło.',
          'Wiele płomieni gaśnie, gdy w powietrzu jest mniej niż około 15% tlenu (powietrze ma 21%); w czystym tlenie wszystko pali się gwałtownie, dlatego butle z tlenem trzyma się z dala od oleju i płomieni.',
        ],
      },
      de: {
        kid: [
          'Ein Feuer braucht drei Dinge: etwas, das brennt, Hitze und Sauerstoff.',
          'Nimm eins davon weg, und die Flamme geht aus. Deshalb löschen ein Deckel, eine Löschdecke oder Sand ein kleines Feuer: Sie halten den Sauerstoff fern.',
        ],
        sci: [
          'Verbrennung ist schnelle Oxidation: Brennstoff + O2 → CO2 + H2O + Wärme.',
          'Viele Flammen gehen aus, wenn die Luft weniger als etwa 15% Sauerstoff enthält (Luft hat 21%); in reinem Sauerstoff brennen Dinge heftig, deshalb hält man Sauerstoffflaschen von Öl und Flammen fern.',
        ],
      },
    },
  },
  {
    id: 'ozone',
    color: '#9b8cff',
    wing: 'air',
    title: {
      en: "Earth's invisible sunscreen",
      'pt-pt': 'O protetor solar invisível da Terra',
      pl: 'Niewidzialny krem z filtrem dla Ziemi',
      de: 'Die unsichtbare Sonnencreme der Erde',
    },
    story: {
      en: {
        kid: [
          'High up in the sky, oxygen atoms team up in threes to make ozone.',
          'This thin layer stops most of the Sun\'s harmful ultraviolet light, the kind that burns your skin. Without it, life on land would be in danger.',
        ],
        sci: [
          'In the stratosphere UV light splits O2 into atoms, which join other O2 molecules to form O3 (the Chapman cycle); O3 absorbs UV between about 200 and 315 nm.',
          'Squeezed to the pressure at the ground, the whole ozone layer would be only about 3 mm thick (300 Dobson units).',
        ],
      },
      'pt-pt': {
        kid: [
          'Lá no alto do céu, os átomos de oxigénio juntam-se três a três para formar ozono.',
          'Esta camada fina trava a maior parte da luz ultravioleta nociva do Sol, a que te queima a pele. Sem ela, a vida em terra estaria em perigo.',
        ],
        sci: [
          'Na estratosfera, a luz UV parte o O2 em átomos, que se juntam a outras moléculas de O2 para formar O3 (o ciclo de Chapman); o O3 absorve a UV entre cerca de 200 e 315 nm.',
          'Comprimida à pressão ao nível do solo, toda a camada de ozono teria só cerca de 3 mm de espessura (300 unidades Dobson).',
        ],
      },
      pl: {
        kid: [
          'Wysoko na niebie atomy tlenu łączą się po trzy i tworzą ozon.',
          'Ta cienka warstwa zatrzymuje większość szkodliwego ultrafioletu ze Słońca, tego, który parzy ci skórę. Bez niej życie na lądzie byłoby w niebezpieczeństwie.',
        ],
        sci: [
          'W stratosferze światło UV rozbija O2 na atomy, które łączą się z innymi cząsteczkami O2 w O3 (cykl Chapmana); O3 pochłania UV w zakresie od około 200 do 315 nm.',
          'Sprężona do ciśnienia panującego przy ziemi, cała warstwa ozonowa miałaby tylko około 3 mm grubości (300 jednostek Dobsona).',
        ],
      },
      de: {
        kid: [
          'Hoch oben am Himmel tun sich Sauerstoffatome zu dritt zusammen und bilden Ozon.',
          'Diese dünne Schicht hält das meiste schädliche UV-Licht der Sonne ab, das Licht, das dir die Haut verbrennt. Ohne sie wäre das Leben an Land in Gefahr.',
        ],
        sci: [
          'In der Stratosphäre spaltet UV-Licht O2 in Atome, die sich mit anderen O2-Molekülen zu O3 verbinden (der Chapman-Zyklus); O3 absorbiert UV zwischen etwa 200 und 315 nm.',
          'Auf den Druck am Erdboden zusammengepresst, wäre die ganze Ozonschicht nur etwa 3 mm dick (300 Dobson-Einheiten).',
        ],
      },
    },
  },
  {
    id: 'first',
    color: '#4fd1c5',
    title: {
      en: 'The great oxygen surprise',
      'pt-pt': 'A grande surpresa do oxigénio',
      pl: 'Wielka tlenowa niespodzianka',
      de: 'Die große Sauerstoffüberraschung',
    },
    story: {
      en: {
        kid: [
          'For about two billion years the air had almost no oxygen. Then tiny blue-green microbes in the sea started to make it with sunlight.',
          'Their oxygen rusted the iron dissolved in the oceans into red stripes of rock you can still see today, and then slowly filled the air.',
        ],
        sci: [
          'Cyanobacteria invented oxygenic photosynthesis; around 2.4 billion years ago O2 began to build up in the atmosphere (the Great Oxidation Event).',
          'Banded iron formations, layers of iron oxide laid down in the oceans mostly between 3.8 and 1.8 billion years ago, record the oxygen reacting with dissolved iron.',
        ],
      },
      'pt-pt': {
        kid: [
          'Durante cerca de dois mil milhões de anos, o ar quase não teve oxigénio. Depois, uns micróbios minúsculos, azul-esverdeados, começaram a fabricá-lo no mar com a luz do Sol.',
          'O oxigénio deles enferrujou o ferro dissolvido nos oceanos e transformou-o em riscas vermelhas de rocha, que ainda hoje podes ver; depois, foi enchendo o ar devagarinho.',
        ],
        sci: [
          'As cianobactérias inventaram a fotossíntese oxigénica; há cerca de 2,4 mil milhões de anos, o O2 começou a acumular-se na atmosfera (o Grande Evento de Oxidação).',
          'As formações de ferro bandado, camadas de óxido de ferro depositadas nos oceanos sobretudo entre 3,8 e 1,8 mil milhões de anos atrás, registam o oxigénio a reagir com o ferro dissolvido.',
        ],
      },
      pl: {
        kid: [
          'Przez mniej więcej dwa miliardy lat w powietrzu prawie nie było tlenu. Potem malutkie niebieskozielone mikroby w morzu zaczęły go wytwarzać z pomocą światła słonecznego.',
          'Ich tlen sprawił, że żelazo rozpuszczone w oceanach zardzewiało i ułożyło się w czerwone pasy skał, które możesz zobaczyć do dziś, a potem powoli wypełnił powietrze.',
        ],
        sci: [
          'Sinice wynalazły fotosyntezę oksygeniczną; około 2,4 miliarda lat temu O2 zaczął gromadzić się w atmosferze (tzw. katastrofa tlenowa).',
          'Wstęgowe formacje żelaziste, warstwy tlenku żelaza osadzone w oceanach głównie od 3,8 do 1,8 miliarda lat temu, zapisują reakcję tlenu z rozpuszczonym żelazem.',
        ],
      },
      de: {
        kid: [
          'Etwa zwei Milliarden Jahre lang hatte die Luft fast keinen Sauerstoff. Dann fingen winzige blaugrüne Mikroben im Meer an, ihn mit Sonnenlicht herzustellen.',
          'Ihr Sauerstoff ließ das in den Ozeanen gelöste Eisen zu roten Gesteinsstreifen rosten, die du heute noch sehen kannst, und füllte dann langsam die Luft.',
        ],
        sci: [
          'Cyanobakterien erfanden die oxygene Fotosynthese; vor etwa 2,4 Milliarden Jahren begann sich O2 in der Atmosphäre anzureichern (die Große Sauerstoffkatastrophe).',
          'Bändereisenerze, Schichten aus Eisenoxid, die sich vor allem vor 3,8 bis 1,8 Milliarden Jahren in den Ozeanen ablagerten, zeichnen auf, wie der Sauerstoff mit gelöstem Eisen reagierte.',
        ],
      },
    },
  },
  {
    id: 'water',
    color: '#5ab8ff',
    title: {
      en: 'Water is mostly oxygen',
      'pt-pt': 'A água é sobretudo oxigénio',
      pl: 'Woda to głównie tlen',
      de: 'Wasser ist größtenteils Sauerstoff',
    },
    story: {
      en: {
        kid: [
          'Every water molecule is one oxygen atom holding two small hydrogen atoms.',
          'Oxygen is so much heavier that almost nine tenths of the weight of water is oxygen: in a 150-litre bath, about 133 kilograms of the water is oxygen!',
        ],
        sci: [
          'In H2O, 16.00 of every 18.02 g is oxygen (88.8%).',
          'The molecule is bent (104.5°) and oxygen pulls the shared electrons towards itself, so water is polar: that is why it dissolves salt and sugar so well.',
        ],
      },
      'pt-pt': {
        kid: [
          'Cada molécula de água é um átomo de oxigénio a segurar dois pequenos átomos de hidrogénio.',
          'O oxigénio é tão mais pesado que quase nove décimos do peso da água são oxigénio: numa banheira de 150 litros, cerca de 133 quilogramas da água são oxigénio!',
        ],
        sci: [
          'No H2O, 16,00 de cada 18,02 g são oxigénio (88,8%).',
          'A molécula é angular (104,5°) e o oxigénio puxa para si os eletrões partilhados, por isso a água é polar: é essa a razão de dissolver tão bem o sal e o açúcar.',
        ],
      },
      pl: {
        kid: [
          'Każda cząsteczka wody to jeden atom tlenu, który trzyma dwa małe atomy wodoru.',
          'Tlen jest o tyle cięższy, że prawie dziewięć dziesiątych wagi wody to tlen: w 150-litrowej wannie około 133 kilogramów wody to tlen!',
        ],
        sci: [
          'W H2O 16,00 z każdych 18,02 g to tlen (88,8%).',
          'Cząsteczka ma budowę kątową (104,5°), a tlen przyciąga wspólne elektrony do siebie, więc woda jest polarna: dlatego tak dobrze rozpuszcza sól i cukier.',
        ],
      },
      de: {
        kid: [
          'Jedes Wassermolekül ist ein Sauerstoffatom, das zwei kleine Wasserstoffatome festhält.',
          'Sauerstoff ist so viel schwerer, dass fast neun Zehntel des Gewichts von Wasser Sauerstoff sind: In einer 150-Liter-Badewanne sind etwa 133 Kilogramm des Wassers Sauerstoff!',
        ],
        sci: [
          'In H2O sind 16,00 von je 18,02 g Sauerstoff (88,8%).',
          'Das Molekül ist gewinkelt (104,5°), und der Sauerstoff zieht die gemeinsamen Elektronen zu sich, deshalb ist Wasser polar: Darum löst es Salz und Zucker so gut.',
        ],
      },
    },
  },
  {
    id: 'aurora',
    color: '#6ef0a0',
    title: {
      en: 'Who paints the sky green?',
      'pt-pt': 'Quem pinta o céu de verde?',
      pl: 'Kto maluje niebo na zielono?',
      de: 'Wer malt den Himmel grün?',
    },
    story: {
      en: {
        kid: [
          'The northern lights are oxygen glowing!',
          'Particles from the Sun crash into oxygen atoms high above the Earth, and the atoms give the energy back as green light, or as red light even higher up.',
        ],
        sci: [
          'The aurora\'s green is the 557.7 nm line of atomic oxygen, emitted at about 100 to 150 km.',
          'The red 630.0 nm line comes from higher up, where the excited atoms live long enough (about 110 s) to glow before a collision takes their energy.',
        ],
      },
      'pt-pt': {
        kid: [
          'As auroras boreais são oxigénio a brilhar!',
          'Partículas vindas do Sol chocam com átomos de oxigénio muito acima da Terra, e os átomos devolvem a energia como luz verde, ou como luz vermelha ainda mais acima.',
        ],
        sci: [
          'O verde da aurora é a risca de 557,7 nm do oxigénio atómico, emitida a cerca de 100 a 150 km de altitude.',
          'A risca vermelha de 630,0 nm vem de mais acima, onde os átomos excitados vivem o tempo suficiente (cerca de 110 s) para brilhar antes que uma colisão lhes roube a energia.',
        ],
      },
      pl: {
        kid: [
          'Zorza polarna to świecący tlen!',
          'Cząstki ze Słońca zderzają się z atomami tlenu wysoko nad Ziemią, a atomy oddają energię jako zielone światło albo, jeszcze wyżej, jako czerwone.',
        ],
        sci: [
          'Zieleń zorzy to linia 557,7 nm tlenu atomowego, emitowana na wysokości około 100 do 150 km.',
          'Czerwona linia 630,0 nm pochodzi z większych wysokości, gdzie wzbudzone atomy żyją wystarczająco długo (około 110 s), by zaświecić, zanim zderzenie odbierze im energię.',
        ],
      },
      de: {
        kid: [
          'Die Polarlichter sind leuchtender Sauerstoff!',
          'Teilchen von der Sonne prallen hoch über der Erde auf Sauerstoffatome, und die Atome geben die Energie als grünes Licht wieder ab, oder noch weiter oben als rotes Licht.',
        ],
        sci: [
          'Das Grün des Polarlichts ist die 557,7-nm-Linie des atomaren Sauerstoffs, ausgesendet in etwa 100 bis 150 km Höhe.',
          'Die rote 630,0-nm-Linie kommt von weiter oben, wo die angeregten Atome lange genug leben (etwa 110 s), um zu leuchten, bevor ein Zusammenstoß ihnen die Energie nimmt.',
        ],
      },
    },
  },
  {
    id: 'magnet',
    color: '#8fd0ff',
    title: {
      en: 'Oxygen that sticks to a magnet',
      'pt-pt': 'Oxigénio que se agarra a um íman',
      pl: 'Tlen, który przyczepia się do magnesu',
      de: 'Sauerstoff, der am Magneten hängt',
    },
    story: {
      en: {
        kid: [
          'Cool oxygen to −183 °C and it turns into a pale blue liquid. Pour it past a strong magnet and it sticks between the poles!',
          'Rockets carry huge tanks of this liquid oxygen to burn their fuel in space, where there is no air.',
        ],
        sci: [
          'O2 has two unpaired electrons (a triplet ground state), so it is paramagnetic: liquid O2 is drawn into a magnetic field, liquid N2 is not.',
          'Liquid oxygen (LOX, 90 K) is the oxidiser of many rockets, from the Saturn V to the Falcon 9.',
        ],
      },
      'pt-pt': {
        kid: [
          'Arrefece o oxigénio a −183 °C e ele torna-se um líquido azul-claro. Despeja-o junto a um íman forte e ele fica agarrado entre os polos!',
          'Os foguetões levam enormes tanques deste oxigénio líquido para queimarem o combustível no espaço, onde não há ar.',
        ],
        sci: [
          'O O2 tem dois eletrões desemparelhados (um estado fundamental tripleto), por isso é paramagnético: o O2 líquido é atraído para um campo magnético, o N2 líquido não.',
          'O oxigénio líquido (LOX, 90 K) é o comburente de muitos foguetões, do Saturn V ao Falcon 9.',
        ],
      },
      pl: {
        kid: [
          'Ochłódź tlen do −183 °C, a zamieni się w bladoniebieską ciecz. Lej ją tuż obok silnego magnesu, a przyczepi się między jego biegunami!',
          'Rakiety zabierają ogromne zbiorniki tego ciekłego tlenu, żeby spalać paliwo w kosmosie, gdzie nie ma powietrza.',
        ],
        sci: [
          'O2 ma dwa niesparowane elektrony (trypletowy stan podstawowy), więc jest paramagnetyczny: ciekły O2 jest wciągany w pole magnetyczne, a ciekły N2 nie.',
          'Ciekły tlen (LOX, 90 K) jest utleniaczem w wielu rakietach, od Saturna V po Falcona 9.',
        ],
      },
      de: {
        kid: [
          'Kühl Sauerstoff auf −183 °C ab, und er wird zu einer hellblauen Flüssigkeit. Gieß sie an einem starken Magneten vorbei, und sie bleibt zwischen den Polen hängen!',
          'Raketen haben riesige Tanks mit diesem flüssigen Sauerstoff dabei, um ihren Treibstoff im Weltraum zu verbrennen, wo es keine Luft gibt.',
        ],
        sci: [
          'O2 hat zwei ungepaarte Elektronen (ein Triplett-Grundzustand), deshalb ist es paramagnetisch: Flüssiges O2 wird in ein Magnetfeld gezogen, flüssiges N2 nicht.',
          'Flüssiger Sauerstoff (LOX, 90 K) ist das Oxidationsmittel vieler Raketen, von der Saturn V bis zur Falcon 9.',
        ],
      },
    },
  },
]
