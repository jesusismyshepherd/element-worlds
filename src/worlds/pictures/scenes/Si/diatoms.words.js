// The words of silicon's diatom room ("Who lives in a house made of glass?"), in English, European
// Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Si.js (the easel shows it).
export const DIATOMS_WORDS = {
  en: {
    title: 'The glass houses',
    greet: {
      kid: 'Whoa, we have shrunk smaller than a grain of sand! These floating glass boxes are diatoms, and they are alive. The story of this picture is on the easel beside you.',
      sci: 'Everything here is about ten thousand times its real size. These are diatoms: single-celled algae in shells of silica. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Each diatom is one single cell, and it builds its own glass house from the silicon in the water.',
        'The tiny holes let water and food in, and the oxygen they make out.',
        'When diatoms die, their glass shells sink and pile up into white rock.',
      ],
      sci: [
        'Diatoms take up dissolved silicon as silicic acid, Si(OH)4, and lay it down as amorphous silica in a vesicle inside the cell.',
        'Their glass has no crystal order, like window glass: hydrated amorphous silica, SiO2·nH2O.',
        'About 20,000 species have been described, and there may be many more, each known by the pattern of its glass.',
      ],
    },
    house: {
      label: 'The round diatom',
      open: 'Open it',
      close: 'Close it',
      title: 'A glass box with a lid',
      says: {
        open: { kid: 'The lid comes off! Inside is the living cell, with golden-brown parts that catch sunlight.', sci: 'The epitheca lifts off the hypotheca: inside is the protoplast, with its golden-brown chloroplasts.' },
        close: { kid: 'Lid back on. The two halves fit together like a box and its lid.', sci: 'The epitheca overlaps the hypotheca at the girdle bands, like the two halves of a Petri dish.' },
      },
      panel: {
        kid: [
          'A diatom\'s glass house has two halves: a slightly bigger one that fits over a smaller one, like the lid of a box. Glass bands hold them together round the middle.',
          'The glass is full of tiny holes, in a pattern each kind of diatom has of its own. They let water, food and gases in and out. Inside lives the cell, with golden-brown parts that catch sunlight to make food. A real one this big would be about a third of a millimetre across: a giant among diatoms.',
        ],
        sci: [
          'The frustule: two valves of hydrated amorphous silica, the larger epitheca over the hypotheca, joined by overlapping girdle bands. Each valve is pierced by areolae, chambers with fine pores in a pattern typical of the species, which let water, nutrients and gases through while the silica protects the cell.',
          'Inside, the protoplast carries chloroplasts coloured golden-brown by fucoxanthin, a pigment that absorbs the blue-green light that reaches down into water. Round, radially patterned diatoms like this one are centric diatoms; the boat-shaped ones are pennate. Shown here about 10,000 times life size: about 0.3 mm across, large for a diatom.',
        ],
      },
    },
    sun: {
      label: 'Diatoms in the sun',
      on: 'Let the sun in',
      off: 'Hide the sun',
      title: 'Oxygen from the sea',
      says: {
        on: { kid: 'Sunshine! They are making oxygen: can you see it bubbling up?', sci: 'Photosynthesis: 6 CO2 + 6 H2O + light -> C6H12O6 + 6 O2. The O2 leaves the cells.' },
        off: { kid: 'No light, no oxygen. They wait for the sun.', sci: 'In the dark photosynthesis stops; the cells go on respiring and use a little oxygen.' },
      },
      panel: {
        kid: [
          'Like plants, diatoms make their food from sunlight, water and the carbon dioxide dissolved in the sea, and they give off oxygen. These boat-shaped ones glide along the bottom; many others float near the surface.',
          'There are so many diatoms in the seas, lakes and rivers that scientists think they make about a fifth of all the oxygen made on Earth each year. For about one breath in every five you take, you can thank a diatom.',
        ],
        sci: [
          'Diatoms photosynthesise as plants do: 6 CO2 + 6 H2O + light -> C6H12O6 + 6 O2. They are thought to carry out about a fifth of all the photosynthesis on Earth (estimates vary), and up to about 40% of the ocean\'s.',
          'Part of the carbon they fix sinks with their shells when they die, so diatoms are a large part of the biological pump that carries carbon from the surface to the deep sea. These pennate, boat-shaped diatoms glide over the sediment by pushing out mucilage through a slit in the valve, the raphe.',
        ],
      },
    },
    family: {
      label: 'A diatom family',
      divide: 'Divide',
      regrow: 'Grow big again',
      title: 'Smaller and smaller',
      says: {
        divide: { kid: 'Two babies! Each kept half of the old box as its lid and built a new bottom inside it, so one is smaller.', sci: 'Each daughter keeps one parent valve as its epitheca and forms a new hypotheca inside it: one daughter is smaller.' },
        last: { kid: 'This one is very small now. Press again and watch what it does!', sci: 'Near the critical size: now sexual reproduction makes an auxospore.' },
        regrow: { kid: 'It left its glass, swelled up like a balloon and built a brand new big house!', sci: 'The auxospore, free of the rigid frustule, swells and lays down new valves at full size.' },
      },
      panel: {
        kid: [
          'When a diatom divides, the two halves of its glass box come apart. Each new diatom keeps one half as its lid and builds a new, smaller bottom inside it. So one of the two is a little smaller than its parent, and after many divisions some diatoms are much smaller than their great-great-grandparents.',
          'Glass cannot stretch, so how do they ever get big again? When a diatom is small enough, it leaves its glass behind, swells up like a balloon and builds a brand new house at full size. In good light diatoms can divide once or twice a day.',
        ],
        sci: [
          'At division each daughter keeps one parent valve as its epitheca and builds a new hypotheca inside it, so the mean cell size of a population falls with each generation (the MacDonald-Pfitzer rule, 1869). The glass cannot grow: the shrinking goes on until the cells reach a critical size, in many species well under half the largest.',
          'Then sexual reproduction restores the size: gametes fuse into a zygote that grows into an auxospore, a cell without a rigid frustule (wrapped in thin scales and bands) that swells to full size and builds new valves. Here each smaller daughter is 0.84 times as wide as its parent.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'As casas de vidro',
    greet: {
      kid: 'Uau, encolhemos e ficámos mais pequenos do que um grão de areia! Estas caixinhas de vidro a flutuar são diatomáceas, e estão vivas. A história desta imagem está no cavalete ao teu lado.',
      sci: 'Aqui tudo está cerca de dez mil vezes maior do que na realidade. Isto são diatomáceas: algas de uma só célula, com carapaças de sílica. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Cada diatomácea é uma única célula, e constrói a sua própria casa de vidro com o silício da água.',
        'Os buraquinhos deixam entrar água e alimento, e deixam sair o oxigénio que elas fazem.',
        'Quando as diatomáceas morrem, as carapaças de vidro afundam e acumulam-se numa rocha branca.',
      ],
      sci: [
        'As diatomáceas absorvem o silício dissolvido na forma de ácido silícico, Si(OH)4, e depositam-no como sílica amorfa numa vesícula dentro da célula.',
        'O vidro delas não tem ordem cristalina, como o vidro de uma janela: sílica amorfa hidratada, SiO2·nH2O.',
        'Já foram descritas cerca de 20 000 espécies, e pode haver muitas mais, cada uma reconhecida pelo padrão do seu vidro.',
      ],
    },
    house: {
      label: 'A diatomácea redonda',
      open: 'Abrir',
      close: 'Fechar',
      title: 'Uma caixa de vidro com tampa',
      says: {
        open: { kid: 'A tampa sai! Lá dentro está a célula viva, com partes castanho-douradas que apanham a luz do sol.', sci: 'A epiteca levanta-se da hipoteca: lá dentro está o protoplasto, com os seus cloroplastos castanho-dourados.' },
        close: { kid: 'Tampa no sítio. As duas metades encaixam como uma caixa e a sua tampa.', sci: 'A epiteca sobrepõe-se à hipoteca nas bandas do cíngulo, como as duas metades de uma caixa de Petri.' },
      },
      panel: {
        kid: [
          'A casa de vidro de uma diatomácea tem duas metades: uma um pouco maior, que encaixa por cima de outra mais pequena, como a tampa de uma caixa. Umas bandas de vidro seguram-nas à volta do meio.',
          'O vidro está cheio de buraquinhos, num padrão que cada tipo de diatomácea tem só seu. Deixam entrar e sair água, alimento e gases. Lá dentro vive a célula, com partes castanho-douradas que apanham a luz do sol para fazer alimento. Uma verdadeira deste tamanho teria cerca de um terço de milímetro: uma gigante entre as diatomáceas.',
        ],
        sci: [
          'A frústula: duas valvas de sílica amorfa hidratada, a epiteca, maior, por cima da hipoteca, unidas por bandas do cíngulo sobrepostas. Cada valva é perfurada por aréolas, câmaras com poros finos num padrão próprio de cada espécie, que deixam passar água, nutrientes e gases enquanto a sílica protege a célula.',
          'Lá dentro, o protoplasto tem cloroplastos castanho-dourados por causa da fucoxantina, um pigmento que absorve a luz azul-esverdeada que chega ao fundo da água. As diatomáceas redondas, com padrão radial, como esta, são cêntricas; as que têm forma de barco são penadas. Aqui está cerca de 10 000 vezes maior do que ao natural: teria cerca de 0,3 mm, grande para uma diatomácea.',
        ],
      },
    },
    sun: {
      label: 'Diatomáceas ao sol',
      on: 'Deixar entrar o sol',
      off: 'Tapar o sol',
      title: 'Oxigénio do mar',
      says: {
        on: { kid: 'Sol! Estão a fazer oxigénio: vês as bolhas a subir?', sci: 'Fotossíntese: 6 CO2 + 6 H2O + luz -> C6H12O6 + 6 O2. O O2 sai das células.' },
        off: { kid: 'Sem luz, não há oxigénio. Ficam à espera do sol.', sci: 'No escuro a fotossíntese para; as células continuam a respirar e gastam um pouco de oxigénio.' },
      },
      panel: {
        kid: [
          'Tal como as plantas, as diatomáceas fazem o seu alimento com a luz do sol, a água e o dióxido de carbono dissolvido no mar, e libertam oxigénio. Estas, em forma de barco, deslizam pelo fundo; muitas outras flutuam perto da superfície.',
          'Há tantas diatomáceas nos mares, lagos e rios que os cientistas pensam que fazem cerca de um quinto de todo o oxigénio produzido na Terra em cada ano. Mais ou menos uma em cada cinco vezes que respiras, podes agradecer a uma diatomácea.',
        ],
        sci: [
          'As diatomáceas fazem fotossíntese como as plantas: 6 CO2 + 6 H2O + luz -> C6H12O6 + 6 O2. Pensa-se que fazem cerca de um quinto de toda a fotossíntese da Terra (as estimativas variam) e até cerca de 40% da do oceano.',
          'Parte do carbono que fixam afunda com as carapaças quando morrem, por isso as diatomáceas são uma grande parte da bomba biológica que leva carbono da superfície para o mar profundo. Estas diatomáceas penadas, em forma de barco, deslizam sobre o sedimento expelindo mucilagem por uma fenda da valva, a rafe.',
        ],
      },
    },
    family: {
      label: 'Uma família de diatomáceas',
      divide: 'Dividir',
      regrow: 'Voltar a crescer',
      title: 'Cada vez mais pequenas',
      says: {
        divide: { kid: 'Dois bebés! Cada um ficou com metade da caixa velha como tampa e fez um fundo novo lá dentro, por isso um é mais pequeno.', sci: 'Cada célula-filha fica com uma valva da mãe como epiteca e forma uma hipoteca nova dentro dela: uma das filhas é mais pequena.' },
        last: { kid: 'Esta já é muito pequenina. Carrega outra vez e vê o que ela faz!', sci: 'Perto do tamanho crítico: agora a reprodução sexuada forma um auxósporo.' },
        regrow: { kid: 'Saiu do vidro, inchou como um balão e construiu uma casa nova e grande!', sci: 'O auxósporo, livre da frústula rígida, incha e forma valvas novas em tamanho máximo.' },
      },
      panel: {
        kid: [
          'Quando uma diatomácea se divide, as duas metades da caixa de vidro separam-se. Cada diatomácea nova fica com uma metade como tampa e constrói lá dentro um fundo novo, mais pequeno. Por isso uma das duas é um pouco mais pequena do que a mãe, e depois de muitas divisões algumas diatomáceas são muito mais pequenas do que as suas tetravós.',
          'O vidro não estica, então como é que voltam a ficar grandes? Quando uma diatomácea já é pequena o suficiente, deixa o vidro para trás, incha como um balão e constrói uma casa nova em tamanho grande. Com boa luz, as diatomáceas podem dividir-se uma ou duas vezes por dia.',
        ],
        sci: [
          'Na divisão, cada célula-filha fica com uma valva da mãe como epiteca e constrói uma hipoteca nova dentro dela, por isso o tamanho médio das células de uma população diminui a cada geração (a regra de MacDonald-Pfitzer, 1869). O vidro não cresce: a redução continua até as células chegarem a um tamanho crítico, em muitas espécies bem abaixo de metade do máximo.',
          'Depois, a reprodução sexuada repõe o tamanho: os gâmetas fundem-se num zigoto que se torna um auxósporo, uma célula sem frústula rígida (envolta em escamas e bandas finas) que incha até ao tamanho máximo e constrói valvas novas. Aqui, cada filha mais pequena tem 0,84 da largura da mãe.',
        ],
      },
    },
  },
  pl: {
    title: 'Szklane domki',
    greet: {
      kid: 'Ojej, zmalaliśmy, jesteśmy mniejsi niż ziarenko piasku! Te pływające szklane pudełeczka to okrzemki i one żyją. Historia tego obrazka jest na sztaludze obok ciebie.',
      sci: 'Wszystko tutaj jest około dziesięciu tysięcy razy większe niż w rzeczywistości. To okrzemki: jednokomórkowe glony w pancerzykach z krzemionki. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Każda okrzemka to jedna komórka i sama buduje sobie szklany domek z krzemu z wody.',
        'Malutkie dziurki wpuszczają wodę i pokarm, a wypuszczają tlen, który okrzemki wytwarzają.',
        'Kiedy okrzemki umierają, ich szklane pancerzyki opadają na dno i układają się w białą skałę.',
      ],
      sci: [
        'Okrzemki pobierają rozpuszczony krzem w postaci kwasu krzemowego, Si(OH)4, i odkładają go jako bezpostaciową krzemionkę w pęcherzyku wewnątrz komórki.',
        'Ich szkło nie ma uporządkowania kryształu, tak jak szkło okienne: uwodniona bezpostaciowa krzemionka, SiO2·nH2O.',
        'Opisano około 20 000 gatunków, a może ich być znacznie więcej; każdy rozpoznaje się po wzorze jego szkła.',
      ],
    },
    house: {
      label: 'Okrągła okrzemka',
      open: 'Otwórz',
      close: 'Zamknij',
      title: 'Szklane pudełko z wieczkiem',
      says: {
        open: { kid: 'Wieczko schodzi! W środku jest żywa komórka ze złotobrązowymi częściami, które łapią światło słońca.', sci: 'Epiteka unosi się z hipoteki: w środku jest protoplast ze złotobrązowymi chloroplastami.' },
        close: { kid: 'Wieczko z powrotem na miejscu. Obie połówki pasują do siebie jak pudełko i jego wieczko.', sci: 'Epiteka zachodzi na hipotekę w miejscu pasków obwodowych, jak dwie połówki szalki Petriego.' },
      },
      panel: {
        kid: [
          'Szklany domek okrzemki ma dwie połówki: trochę większą, która nakłada się na mniejszą, jak wieczko na pudełko. Szklane paski trzymają je razem dookoła środka.',
          'Szkło jest pełne malutkich dziurek ułożonych we wzór, który każdy rodzaj okrzemki ma swój własny. Przez nie wchodzą i wychodzą woda, pokarm i gazy. W środku mieszka komórka ze złotobrązowymi częściami, które łapią światło słońca, żeby zrobić pokarm. Prawdziwa okrzemka tej wielkości miałaby około jednej trzeciej milimetra: olbrzym wśród okrzemek.',
        ],
        sci: [
          'Pancerzyk (frustula): dwie skorupki z uwodnionej bezpostaciowej krzemionki, większa epiteka nad hipoteką, połączone zachodzącymi na siebie paskami obwodowymi. Każda skorupka jest przebita areolami, komorami z drobnymi porami ułożonymi we wzór typowy dla gatunku; przepuszczają one wodę, składniki odżywcze i gazy, a krzemionka chroni komórkę.',
          'W środku protoplast ma chloroplasty zabarwione na złotobrązowo przez fukoksantynę, barwnik pochłaniający niebieskozielone światło, które dociera w głąb wody. Okrągłe okrzemki o promienistym wzorze, takie jak ta, to okrzemki centryczne; te w kształcie łódki to okrzemki pierzaste. Pokazana tu w powiększeniu około 10 000 razy: miałaby około 0,3 mm średnicy, dużo jak na okrzemkę.',
        ],
      },
    },
    sun: {
      label: 'Okrzemki w słońcu',
      on: 'Wpuść słońce',
      off: 'Zasłoń słońce',
      title: 'Tlen z morza',
      says: {
        on: { kid: 'Słońce! Robią tlen: widzisz, jak jego bąbelki płyną w górę?', sci: 'Fotosynteza: 6 CO2 + 6 H2O + światło -> C6H12O6 + 6 O2. O2 wychodzi z komórek.' },
        off: { kid: 'Bez światła nie ma tlenu. Czekają na słońce.', sci: 'W ciemności fotosynteza staje; komórki nadal oddychają i zużywają trochę tlenu.' },
      },
      panel: {
        kid: [
          'Tak jak rośliny, okrzemki robią sobie pokarm ze światła słońca, wody i dwutlenku węgla rozpuszczonego w morzu, i wydzielają tlen. Te w kształcie łódek suną po dnie; wiele innych unosi się blisko powierzchni.',
          'W morzach, jeziorach i rzekach jest tyle okrzemek, że naukowcy uważają, że wytwarzają około jednej piątej całego tlenu powstającego co roku na Ziemi. Mniej więcej za co piąty twój oddech możesz podziękować okrzemce.',
        ],
        sci: [
          'Okrzemki prowadzą fotosyntezę jak rośliny: 6 CO2 + 6 H2O + światło -> C6H12O6 + 6 O2. Uważa się, że odpowiadają za około jedną piątą całej fotosyntezy na Ziemi (szacunki się różnią) i nawet za około 40% fotosyntezy w oceanie.',
          'Część związanego przez nie węgla opada razem z pancerzykami, gdy okrzemki umierają, dlatego są one dużą częścią pompy biologicznej, która przenosi węgiel z powierzchni w głąb oceanu. Te pierzaste okrzemki w kształcie łódek suną po osadzie, wydzielając śluz przez szczelinę w skorupce, rafę.',
        ],
      },
    },
    family: {
      label: 'Rodzina okrzemek',
      divide: 'Podziel',
      regrow: 'Urośnij znowu',
      title: 'Coraz mniejsze',
      says: {
        divide: { kid: 'Dwie maleńkie! Każda zatrzymała połówkę starego pudełka jako wieczko i zbudowała w środku nowe dno, więc jedna jest mniejsza.', sci: 'Każda komórka potomna zatrzymuje jedną skorupkę rodzica jako epitekę i tworzy w niej nową hipotekę: jedna z nich jest mniejsza.' },
        last: { kid: 'Ta jest już bardzo mała. Naciśnij jeszcze raz i zobacz, co zrobi!', sci: 'Blisko rozmiaru krytycznego: teraz rozmnażanie płciowe tworzy auksosporę.' },
        regrow: { kid: 'Wyszła ze szkła, napuchła jak balon i zbudowała nowy, duży domek!', sci: 'Auksospora, wolna od sztywnego pancerzyka, pęcznieje i tworzy nowe skorupki w pełnym rozmiarze.' },
      },
      panel: {
        kid: [
          'Kiedy okrzemka się dzieli, dwie połówki jej szklanego pudełka rozchodzą się. Każda nowa okrzemka zatrzymuje jedną połówkę jako wieczko i buduje w niej nowe, mniejsze dno. Dlatego jedna z dwóch jest trochę mniejsza od rodzica, a po wielu podziałach niektóre okrzemki są dużo mniejsze od swoich prapradziadków.',
          'Szkło się nie rozciąga, więc jak one znowu robią się duże? Kiedy okrzemka jest już wystarczająco mała, zostawia szkło, puchnie jak balon i buduje nowy domek w pełnym rozmiarze. Przy dobrym świetle okrzemki mogą dzielić się raz lub dwa razy dziennie.',
        ],
        sci: [
          'Przy podziale każda komórka potomna zatrzymuje jedną skorupkę rodzica jako epitekę i buduje w niej nową hipotekę, więc średnia wielkość komórek w populacji maleje z każdym pokoleniem (reguła MacDonalda-Pfitzera, 1869). Szkło nie rośnie: zmniejszanie trwa, aż komórki osiągną rozmiar krytyczny, u wielu gatunków znacznie poniżej połowy największego.',
          'Wtedy rozmnażanie płciowe przywraca rozmiar: gamety łączą się w zygotę, która rozwija się w auksosporę, komórkę bez sztywnego pancerzyka (otuloną cienkimi łuskami i paskami), która pęcznieje do pełnego rozmiaru i tworzy nowe skorupki. Tutaj każda mniejsza komórka potomna ma 0,84 szerokości komórki macierzystej.',
        ],
      },
    },
  },
  de: {
    title: 'Die Glashäuser',
    greet: {
      kid: 'Wow, wir sind kleiner geworden als ein Sandkorn! Diese schwebenden Glasdöschen sind Kieselalgen, und sie leben. Die Geschichte dieses Bildes steht auf der Staffelei neben dir.',
      sci: 'Hier ist alles etwa zehntausendmal so groß wie in Wirklichkeit. Das sind Kieselalgen: einzellige Algen in Schalen aus Siliciumdioxid. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Jede Kieselalge ist eine einzige Zelle und baut sich ihr Glashaus selbst, aus dem Silicium im Wasser.',
        'Durch die winzigen Löcher kommen Wasser und Nahrung hinein und der Sauerstoff, den sie machen, hinaus.',
        'Wenn Kieselalgen sterben, sinken ihre Glasschalen nach unten und häufen sich zu weißem Gestein an.',
      ],
      sci: [
        'Kieselalgen nehmen gelöstes Silicium als Kieselsäure, Si(OH)4, auf und lagern es in einem Bläschen in der Zelle als amorphes Siliciumdioxid ab.',
        'Ihr Glas hat keine Kristallordnung, wie Fensterglas: wasserhaltiges amorphes Siliciumdioxid, SiO2·nH2O.',
        'Etwa 20 000 Arten sind beschrieben, und es gibt vielleicht noch viel mehr; jede erkennt man am Muster ihres Glases.',
      ],
    },
    house: {
      label: 'Die runde Kieselalge',
      open: 'Öffnen',
      close: 'Schließen',
      title: 'Eine Glasdose mit Deckel',
      says: {
        open: { kid: 'Der Deckel geht ab! Drinnen ist die lebende Zelle, mit goldbraunen Teilen, die Sonnenlicht einfangen.', sci: 'Die Epitheka hebt sich von der Hypotheka: Drinnen liegt der Protoplast mit seinen goldbraunen Chloroplasten.' },
        close: { kid: 'Deckel wieder drauf. Die zwei Hälften passen zusammen wie eine Dose und ihr Deckel.', sci: 'Die Epitheka übergreift die Hypotheka an den Gürtelbändern, wie die zwei Hälften einer Petrischale.' },
      },
      panel: {
        kid: [
          'Das Glashaus einer Kieselalge hat zwei Hälften: eine etwas größere, die über eine kleinere greift, wie der Deckel einer Dose. Gläserne Bänder halten sie in der Mitte zusammen.',
          'Das Glas ist voller winziger Löcher, in einem Muster, das jede Art von Kieselalge für sich hat. Durch sie kommen Wasser, Nahrung und Gase hinein und hinaus. Drinnen lebt die Zelle, mit goldbraunen Teilen, die Sonnenlicht einfangen, um Nahrung zu machen. Eine echte in dieser Größe wäre etwa einen Drittelmillimeter groß: eine Riesin unter den Kieselalgen.',
        ],
        sci: [
          'Die Frustel: zwei Schalen aus wasserhaltigem amorphem Siliciumdioxid, die größere Epitheka über der Hypotheka, verbunden durch überlappende Gürtelbänder. Jede Schale ist von Areolen durchbrochen, Kammern mit feinen Poren in einem arttypischen Muster, die Wasser, Nährstoffe und Gase durchlassen, während das Siliciumdioxid die Zelle schützt.',
          'Innen trägt der Protoplast Chloroplasten, die das Fucoxanthin goldbraun färbt, ein Farbstoff, der das blaugrüne Licht aufnimmt, das tief ins Wasser vordringt. Runde, strahlig gemusterte Kieselalgen wie diese heißen zentrisch; die bootförmigen heißen pennat. Hier etwa 10 000-fach vergrößert: etwa 0,3 mm groß, viel für eine Kieselalge.',
        ],
      },
    },
    sun: {
      label: 'Kieselalgen in der Sonne',
      on: 'Lass die Sonne herein',
      off: 'Verdecke die Sonne',
      title: 'Sauerstoff aus dem Meer',
      says: {
        on: { kid: 'Sonnenschein! Sie machen Sauerstoff: Siehst du die Bläschen nach oben steigen?', sci: 'Fotosynthese: 6 CO2 + 6 H2O + Licht -> C6H12O6 + 6 O2. Das O2 verlässt die Zellen.' },
        off: { kid: 'Kein Licht, kein Sauerstoff. Sie warten auf die Sonne.', sci: 'Im Dunkeln stoppt die Fotosynthese; die Zellen atmen weiter und verbrauchen etwas Sauerstoff.' },
      },
      panel: {
        kid: [
          'Wie Pflanzen machen Kieselalgen ihre Nahrung aus Sonnenlicht, Wasser und dem Kohlenstoffdioxid, das im Meer gelöst ist, und geben dabei Sauerstoff ab. Diese bootförmigen gleiten über den Boden; viele andere schweben nahe der Oberfläche.',
          'In Meeren, Seen und Flüssen gibt es so viele Kieselalgen, dass Forschende glauben, dass sie etwa ein Fünftel des ganzen Sauerstoffs machen, der jedes Jahr auf der Erde entsteht. Ungefähr für jeden fünften Atemzug kannst du dich bei einer Kieselalge bedanken.',
        ],
        sci: [
          'Kieselalgen betreiben Fotosynthese wie Pflanzen: 6 CO2 + 6 H2O + Licht -> C6H12O6 + 6 O2. Man schätzt, dass sie etwa ein Fünftel der gesamten Fotosynthese der Erde leisten (die Schätzungen schwanken) und bis zu etwa 40 % der im Ozean.',
          'Ein Teil des Kohlenstoffs, den sie binden, sinkt mit ihren Schalen ab, wenn sie sterben; so sind Kieselalgen ein großer Teil der biologischen Pumpe, die Kohlenstoff von der Oberfläche in die Tiefsee bringt. Diese pennaten, bootförmigen Kieselalgen gleiten über das Sediment, indem sie Schleim durch einen Spalt in der Schale ausscheiden, die Raphe.',
        ],
      },
    },
    family: {
      label: 'Eine Kieselalgenfamilie',
      divide: 'Teilen',
      regrow: 'Wieder wachsen',
      title: 'Immer kleiner',
      says: {
        divide: { kid: 'Zwei Babys! Jedes hat eine Hälfte der alten Dose als Deckel behalten und innen einen neuen Boden gebaut, darum ist eines kleiner.', sci: 'Jede Tochterzelle behält eine Schale der Mutter als Epitheka und bildet darin eine neue Hypotheka: Eine Tochter ist kleiner.' },
        last: { kid: 'Die hier ist jetzt ganz klein. Drück noch einmal und schau, was sie macht!', sci: 'Nahe der kritischen Größe: Jetzt bildet geschlechtliche Fortpflanzung eine Auxospore.' },
        regrow: { kid: 'Sie hat ihr Glas verlassen, ist wie ein Ballon aufgequollen und hat ein brandneues großes Haus gebaut!', sci: 'Die Auxospore, frei von der starren Frustel, schwillt an und bildet neue Schalen in voller Größe.' },
      },
      panel: {
        kid: [
          'Wenn sich eine Kieselalge teilt, gehen die zwei Hälften ihrer Glasdose auseinander. Jede neue Kieselalge behält eine Hälfte als Deckel und baut darin einen neuen, kleineren Boden. Darum ist eine der beiden etwas kleiner als ihre Mutter, und nach vielen Teilungen sind manche Kieselalgen viel kleiner als ihre Ururgroßeltern.',
          'Glas kann sich nicht dehnen, wie werden sie also je wieder groß? Wenn eine Kieselalge klein genug ist, lässt sie ihr Glas zurück, quillt auf wie ein Ballon und baut ein brandneues Haus in voller Größe. Bei gutem Licht können sich Kieselalgen ein- oder zweimal am Tag teilen.',
        ],
        sci: [
          'Bei der Teilung behält jede Tochterzelle eine Schale der Mutter als Epitheka und baut darin eine neue Hypotheka, deshalb sinkt die mittlere Zellgröße einer Population mit jeder Generation (die MacDonald-Pfitzer-Regel, 1869). Das Glas kann nicht wachsen: Die Verkleinerung geht weiter, bis die Zellen eine kritische Größe erreichen, bei vielen Arten deutlich unter der Hälfte der größten.',
          'Dann stellt die geschlechtliche Fortpflanzung die Größe wieder her: Gameten verschmelzen zu einer Zygote, die zu einer Auxospore wird, einer Zelle ohne starre Frustel (umhüllt von dünnen Schuppen und Bändern), die auf volle Größe anschwillt und neue Schalen bildet. Hier ist jede kleinere Tochterzelle 0,84-mal so breit wie die Mutterzelle.',
        ],
      },
    },
  },
}
