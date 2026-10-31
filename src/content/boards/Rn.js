// Radon's picture boards in its hall (docs/knowledge/hall-boards.md): seven pictures on the walls, each a
// question that makes you walk up, and the story it opens (Explorer and Scientist). They add to the noble
// gases' neon sign workshop (/e/Rn/signs: radon's lead box and Geiger counter, the spectroscope, the
// balloons that sink, the history board of 1898 and 1910) instead of repeating it; 'glow' points to it.
// Told calmly for a child: where radon comes from and what people do to keep it low. Pictures:
// public/boards/Rn/<id>.svg, drawn by tools/boards/Rn/ (no words in them: the title is drawn in the
// visitor's language). Each picture has a room designed for it (picture-rooms.md).
// Sources: Gray and Ramsay, J. Chem. Soc. 95, 1073 (1909); Rutherford, Phil. Mag. 49, 1 (1900);
// Gorenstein and Bjorkholm, Science 179 (1973); Lawson et al., J. Geophys. Res. 110 (2005); Igarashi et
// al., Science 269, 60 (1995); Gregorič et al., Nat. Hazards Earth Syst. Sci. 11, 1523 (2011, Postojna);
// Decreto-Lei 108/2018 and Directive 2013/59/Euratom; WHO Handbook on Indoor Radon (2009).
// Each text: { en, 'pt-pt', pl, de }; a title is one string, a story { kid: [paragraphs], sci: [...] }.
export default [
  {
    id: 'glow',
    color: '#ff8c42',
    wing: 'signs',
    title: {
      en: 'Can a frozen gas glow by itself?',
      'pt-pt': 'Um gás congelado que brilha sozinho?',
      pl: 'Zamrożony gaz, który sam świeci?',
      de: 'Kann gefrorenes Gas selbst leuchten?',
    },
    story: {
      en: {
        kid: [
          'London, 1909. Robert Whytlaw-Gray and William Ramsay collected all the radon that a little radium gave off in a week: a bubble about the size of a grain of salt. They cooled it, squeezed it into a glass tube almost as thin as a hair, and watched it through a microscope.',
          'At −62 °C it became a tiny drop, clear like water, that made the glass around it glow blue or lilac. At −71 °C it froze, and the frozen speck shone all by itself like a tiny blue lamp; colder still it glowed yellow, then bright orange-red. Its own radioactivity made the light. Radon is a noble gas like neon, yet it never goes into a sign: find out why in the workshop.',
        ],
        sci: [
          'Gray and Ramsay (J. Chem. Soc. 95, 1909) collected the emanation of 0.2111 g of radium (as bromide) over seven days, about 0.09 mm³ of gas at 0 °C and 1 atm, condensed it with liquid air and pressed it into a capillary about 1/20 mm across: roughly 0.00025 mm³ of liquid, read with a microscope. They found that it boils at −62 °C and melts at −71 °C (today: −61.7 °C and −71 °C).',
          'The liquid is colourless but makes the glass phosphoresce: blue in silica, bluish green in lead-potash glass, lilac in soda glass. The opaque solid glows “like a small, steel-blue arc-light”, turns yellow on further cooling and brilliant orange-red in liquid air; the red fades sharply when warmed past −118 °C. In 1910 and 1911 they weighed samples of about 0.0006 mg on a microbalance and found an atomic weight of 220 to 223 (today 222): the densest gas, 9.73 g/L at 0 °C against 1.29 for air.',
        ],
      },
      'pt-pt': {
        kid: [
          'Londres, 1909. Robert Whytlaw-Gray e William Ramsay juntaram todo o rádon que um pouco de rádio libertou numa semana: uma bolha do tamanho de um grão de sal. Arrefeceram-na, apertaram-na num tubo de vidro quase tão fino como um cabelo e observaram-na ao microscópio.',
          'A −62 °C virou uma gotinha, transparente como a água, que fazia brilhar o vidro à volta, azul ou lilás. A −71 °C congelou, e o grãozinho gelado brilhava sozinho como uma lâmpada azul minúscula; ainda mais frio, brilhava amarelo e depois laranja-avermelhado vivo. Era a sua própria radioatividade que fazia a luz. O rádon é um gás nobre como o néon, mas nunca vai para um reclamo: descobre porquê na oficina.',
        ],
        sci: [
          'Gray e Ramsay (J. Chem. Soc. 95, 1909) recolheram durante sete dias a emanação de 0,2111 g de rádio (como brometo), cerca de 0,09 mm³ de gás a 0 °C e 1 atm, condensaram-na com ar líquido e comprimiram-na num capilar com cerca de 1/20 mm de diâmetro: perto de 0,00025 mm³ de líquido, medido ao microscópio. Viram que ferve a −62 °C e funde a −71 °C (hoje: −61,7 °C e −71 °C).',
          'O líquido é incolor, mas faz o vidro fosforescer: azul na sílica, azul-esverdeado no vidro de chumbo e potássio, lilás no vidro de soda. O sólido, opaco, brilha «como uma pequena lâmpada de arco azul-aço», fica amarelo ao arrefecer mais e laranja-avermelhado brilhante em ar líquido; o vermelho apaga-se de repente ao aquecer acima de −118 °C. Em 1910 e 1911 pesaram amostras de cerca de 0,0006 mg numa microbalança e obtiveram um peso atómico de 220 a 223 (hoje 222): o gás mais denso, 9,73 g/L a 0 °C, contra 1,29 do ar.',
        ],
      },
      pl: {
        kid: [
          'Londyn, rok 1909. Robert Whytlaw-Gray i William Ramsay zebrali cały radon, jaki odrobina radu wydzieliła w ciągu tygodnia: pęcherzyk wielkości ziarenka soli. Schłodzili go, wcisnęli do szklanej rurki cienkiej prawie jak włos i oglądali pod mikroskopem.',
          'W −62 °C zmienił się w maleńką kropelkę, przezroczystą jak woda, od której szkło wokół świeciło na niebiesko albo liliowo. W −71 °C zamarzł, a zamrożony okruszek świecił sam z siebie jak malutka niebieska lampka; jeszcze zimniejszy świecił na żółto, a potem jaskrawo na pomarańczowoczerwono. Światło brało się z jego własnej promieniotwórczości. Radon jest gazem szlachetnym jak neon, a jednak nigdy nie trafia do neonu: sprawdź dlaczego w pracowni.',
        ],
        sci: [
          'Gray i Ramsay (J. Chem. Soc. 95, 1909) zbierali przez siedem dni emanację z 0,2111 g radu (w postaci bromku), około 0,09 mm³ gazu w 0 °C i pod ciśnieniem 1 atm, skroplili ją ciekłym powietrzem i wtłoczyli do kapilary o średnicy około 1/20 mm: mniej więcej 0,00025 mm³ cieczy, odczytanej pod mikroskopem. Ustalili, że wrze w −62 °C i topi się w −71 °C (dziś: −61,7 °C i −71 °C).',
          'Ciecz jest bezbarwna, ale pobudza szkło do fosforescencji: niebieskiej w krzemionce, niebieskozielonej w szkle ołowiowo-potasowym, liliowej w szkle sodowym. Nieprzezroczyste ciało stałe świeci „jak mała, stalowoniebieska lampa łukowa”, po dalszym ochłodzeniu staje się żółte, a w ciekłym powietrzu jaskrawo pomarańczowoczerwone; czerwień gaśnie gwałtownie po ogrzaniu powyżej −118 °C. W latach 1910 i 1911 zważyli na mikrowadze próbki około 0,0006 mg i otrzymali masę atomową od 220 do 223 (dziś 222): najgęstszy gaz, 9,73 g/L w 0 °C wobec 1,29 dla powietrza.',
        ],
      },
      de: {
        kid: [
          'London, 1909. Robert Whytlaw-Gray und William Ramsay sammelten das ganze Radon, das ein wenig Radium in einer Woche abgab: ein Bläschen so groß wie ein Salzkorn. Sie kühlten es ab, pressten es in ein Glasröhrchen, fast so dünn wie ein Haar, und beobachteten es unter dem Mikroskop.',
          'Bei −62 °C wurde es ein winziger Tropfen, klar wie Wasser, der das Glas um sich herum blau oder lila leuchten ließ. Bei −71 °C gefror es, und das gefrorene Krümelchen strahlte ganz von selbst wie ein winziges blaues Lämpchen; noch kälter leuchtete es gelb und dann hell orangerot. Das Licht kam aus seiner eigenen Radioaktivität. Radon ist ein Edelgas wie Neon und kommt doch nie in eine Leuchtreklame: Finde in der Werkstatt heraus, warum.',
        ],
        sci: [
          'Gray und Ramsay (J. Chem. Soc. 95, 1909) sammelten sieben Tage lang die Emanation von 0,2111 g Radium (als Bromid), etwa 0,09 mm³ Gas bei 0 °C und 1 atm, kondensierten sie mit flüssiger Luft und pressten sie in eine Kapillare von etwa 1/20 mm Durchmesser: rund 0,00025 mm³ Flüssigkeit, unter dem Mikroskop abgelesen. Sie fanden, dass es bei −62 °C siedet und bei −71 °C schmilzt (heute: −61,7 °C und −71 °C).',
          'Die Flüssigkeit ist farblos, bringt aber das Glas zum Phosphoreszieren: blau in Quarzglas, blaugrün in Bleikaliglas, lila in Natronglas. Der undurchsichtige Feststoff leuchtet „wie eine kleine, stahlblaue Bogenlampe“, wird beim weiteren Abkühlen gelb und in flüssiger Luft leuchtend orangerot; das Rot verschwindet ziemlich plötzlich beim Erwärmen über −118 °C. 1910 und 1911 wogen sie auf einer Mikrowaage Proben von etwa 0,0006 mg und fanden ein Atomgewicht von 220 bis 223 (heute 222): das dichteste Gas, 9,73 g/L bei 0 °C gegenüber 1,29 bei Luft.',
        ],
      },
    },
  },
  {
    id: 'cellar',
    color: '#ffd25e',
    title: {
      en: 'Why do people air their cellars?',
      'pt-pt': 'Porque é que se arejam as caves?',
      pl: 'Po co wietrzy się piwnice?',
      de: 'Warum lüftet man den Keller?',
    },
    story: {
      en: {
        kid: [
          'The granite under many houses in the north and centre of Portugal holds a tiny bit of uranium, which slowly makes radon. Outdoors the wind spreads it so thin that it does not matter. But radon can creep into a house through cracks in the floor, and when the windows stay shut it can gather in cellars and on ground floors.',
          'So people check. A little detector, about the size of a biscuit, sits in a room for a few months and then goes to a lab, which counts the tiny tracks left by the bits that radon shoots out. If there is too much, the fixes are simple: air the rooms, seal the cracks, and sometimes a small fan sucks the air from under the floor and blows it outside.',
        ],
        sci: [
          'Soil gas carries Rn-222 from the ground into buildings (granite holds a few grams of uranium per tonne), driven by pressure differences of only a few pascals: warm indoor air rises and leaks out high up (the stack effect), wind and extractor fans add suction, and the house draws soil air in through cracks, joints and pipe entries. That, more than radon’s weight, is why cellars and ground floors have most. Outdoors radon averages about 10 Bq/m³; indoors it can reach hundreds or thousands.',
          'To test, an alpha-track detector (a chip of CR-39 plastic in a small chamber that radon diffuses into) stays for about three months, ideally through the heating season; the lab etches the chip in hot sodium hydroxide and counts the pits under a microscope. Portugal’s reference level for homes and workplaces is 300 Bq/m³ as an annual average (Decreto-Lei 108/2018, from Directive 2013/59/Euratom); the WHO recommends 100 where possible. Remedies: ventilation, sealing the floor, and sub-slab depressurisation, a sump under the floor with a small fan, which can cut radon by up to 99%.',
        ],
      },
      'pt-pt': {
        kid: [
          'O granito debaixo de muitas casas do norte e do centro de Portugal tem um bocadinho de urânio, que vai fazendo rádon devagarinho. Ao ar livre, o vento espalha-o tanto que não tem importância. Mas o rádon pode entrar numa casa pelas frinchas do chão e, quando as janelas ficam fechadas, juntar-se nas caves e nos rés-do-chão.',
          'Por isso, as pessoas medem. Um pequeno detetor, do tamanho de uma bolacha, fica numa divisão durante alguns meses e depois vai para um laboratório, que conta os rastos minúsculos deixados pelos bocadinhos que o rádon dispara. Se houver demasiado, as soluções são simples: arejar a casa, tapar as frinchas e, às vezes, uma pequena ventoinha aspira o ar de debaixo do chão e sopra-o para fora.',
        ],
        sci: [
          'O gás do solo leva o Rn-222 da terra para dentro dos edifícios (o granito tem alguns gramas de urânio por tonelada), empurrado por diferenças de pressão de apenas alguns pascais: o ar quente de dentro sobe e escapa-se pelo alto (o efeito chaminé), o vento e os exaustores aspiram mais, e a casa puxa o ar do solo pelas fissuras, juntas e passagens de tubos. É isto, mais do que o peso do rádon, que faz com que as caves e os rés-do-chão tenham mais. Ao ar livre, o rádon anda pelos 10 Bq/m³ em média; dentro de casa pode chegar a centenas ou milhares.',
          'Para medir, um detetor de traços alfa (um pedacinho de plástico CR-39 numa pequena câmara onde o rádon entra por difusão) fica cerca de três meses, de preferência durante a estação de aquecimento; o laboratório ataca o plástico com hidróxido de sódio quente e conta as covinhas ao microscópio. O nível de referência português para habitações e locais de trabalho é de 300 Bq/m³ em média anual (Decreto-Lei 108/2018, que transpõe a Diretiva 2013/59/Euratom); a OMS recomenda 100 sempre que possível. Remédios: ventilação, vedação do pavimento e despressurização sob a laje, um poço sob o chão com uma pequena ventoinha, que pode reduzir o rádon até 99%.',
        ],
      },
      pl: {
        kid: [
          'Granit pod wieloma domami na północy i w środku Portugalii zawiera odrobinę uranu, który powoli wytwarza radon. Na dworze wiatr tak go rozprasza, że nie ma to znaczenia. Ale radon może wkradać się do domu przez szczeliny w podłodze, a gdy okna są zamknięte, gromadzić się w piwnicach i na parterze.',
          'Dlatego ludzie to sprawdzają. Mały detektor wielkości herbatnika leży w pokoju przez kilka miesięcy, a potem trafia do laboratorium, które liczy malutkie ślady zostawione przez drobinki wystrzeliwane przez radon. Jeśli jest go za dużo, rozwiązania są proste: wietrzyć pokoje, uszczelnić szczeliny, a czasem mały wentylator wysysa powietrze spod podłogi i wydmuchuje je na zewnątrz.',
        ],
        sci: [
          'Gaz glebowy przenosi Rn-222 z gruntu do budynków (granit zawiera kilka gramów uranu na tonę), pchany różnicami ciśnień rzędu zaledwie kilku paskali: ciepłe powietrze w domu unosi się i ucieka górą (efekt kominowy), wiatr i wentylatory wyciągowe dokładają ssania, a dom zasysa powietrze glebowe przez pęknięcia, styki i przejścia rur. To, bardziej niż ciężar radonu, sprawia, że najwięcej go jest w piwnicach i na parterach. Na zewnątrz stężenie radonu wynosi średnio około 10 Bq/m³; w pomieszczeniach może sięgać setek lub tysięcy.',
          'Do pomiaru służy detektor śladów alfa (płytka z tworzywa CR-39 w małej komorze, do której radon wnika przez dyfuzję), pozostawiony na około trzy miesiące, najlepiej w sezonie grzewczym; laboratorium trawi płytkę w gorącym wodorotlenku sodu i liczy wżery pod mikroskopem. Portugalski poziom referencyjny dla mieszkań i miejsc pracy to 300 Bq/m³ średnio w roku (Decreto-Lei 108/2018, wdrażający dyrektywę 2013/59/Euratom); WHO zaleca 100, gdzie to możliwe. Środki zaradcze: wentylacja, uszczelnienie podłogi i podciśnienie pod płytą, studzienka pod podłogą z małym wentylatorem, która może obniżyć stężenie radonu nawet o 99%.',
        ],
      },
      de: {
        kid: [
          'Der Granit unter vielen Häusern im Norden und in der Mitte Portugals enthält ein klein wenig Uran, das langsam Radon bildet. Draußen verteilt der Wind es so dünn, dass es keine Rolle spielt. Aber Radon kann durch Ritzen im Boden in ein Haus kriechen und sich, wenn die Fenster zu bleiben, in Kellern und Erdgeschossen sammeln.',
          'Deshalb wird gemessen. Ein kleiner Detektor, so groß wie ein Keks, liegt ein paar Monate in einem Zimmer und kommt dann in ein Labor, das die winzigen Spuren zählt, die die vom Radon abgeschossenen Teilchen hinterlassen haben. Ist es zu viel, sind die Lösungen einfach: lüften, die Ritzen abdichten, und manchmal saugt ein kleiner Ventilator die Luft unter dem Boden ab und bläst sie nach draußen.',
        ],
        sci: [
          'Bodenluft trägt Rn-222 aus dem Untergrund in Gebäude (Granit enthält einige Gramm Uran pro Tonne), angetrieben von Druckunterschieden von nur wenigen Pascal: Warme Innenluft steigt auf und entweicht oben (der Kamineffekt), Wind und Abluftventilatoren saugen zusätzlich, und das Haus zieht Bodenluft durch Risse, Fugen und Rohrdurchführungen an. Das, mehr als das Gewicht des Radons, ist der Grund, warum Keller und Erdgeschosse am meisten haben. Im Freien liegt Radon im Mittel bei etwa 10 Bq/m³; in Innenräumen kann es Hunderte oder Tausende erreichen.',
          'Zum Messen bleibt ein Kernspurdetektor (ein Plättchen aus CR-39-Kunststoff in einer kleinen Kammer, in die Radon hineindiffundiert) etwa drei Monate stehen, am besten während der Heizperiode; das Labor ätzt das Plättchen in heißer Natronlauge und zählt die Ätzgruben unter dem Mikroskop. Der portugiesische Referenzwert für Wohnungen und Arbeitsplätze ist 300 Bq/m³ im Jahresmittel (Decreto-Lei 108/2018, nach der Richtlinie 2013/59/Euratom); die WHO empfiehlt, wo möglich, 100. Abhilfen: Lüften, den Boden abdichten und eine Unterbodenabsaugung, ein Schacht unter dem Boden mit einem kleinen Ventilator, die Radon um bis zu 99% senken kann.',
        ],
      },
    },
  },
  {
    id: 'rock',
    color: '#ff6f91',
    title: {
      en: 'How does a rock breathe out a gas?',
      'pt-pt': 'Como é que uma rocha solta um gás?',
      pl: 'Jak skała wypuszcza gaz?',
      de: 'Wie atmet ein Stein Gas aus?',
    },
    story: {
      en: {
        kid: [
          'Inside a granite rock sit tiny grains with a little uranium in them. Uranium is radioactive: very, very slowly its atoms change into other elements, one step after another, fourteen steps in all, until they become lead, which stays lead for ever.',
          'Every other member of that family is a solid, but radon is a gas. When a radium atom breaks apart, the new radon atom is kicked away like a ball. If it lands in a tiny crack or a film of water between the grains, it can wander out of the rock, into the soil and the air. Most radon breaks apart again within a few days, before it gets far.',
        ],
        sci: [
          'U-238 (half-life 4.47 billion years) becomes stable Pb-206 by 8 alpha and 6 beta decays: through Th-234, Pa-234m, U-234, Th-230 and Ra-226 (1600 years) to Rn-222 (3.82 days), then Po-218, Pb-214, Bi-214, Po-214 (164 µs), Pb-210 (22 years), Bi-210 and Po-210. Radon is the only gas in the series, so it is the one member that can leave the mineral the uranium sits in.',
          'When Ra-226 emits an alpha particle, the new Rn-222 recoils a few tens of nanometres through the crystal; only atoms born that close to a grain’s surface can escape into the pores, and a film of pore water stops them before they bury themselves in the next grain, so damp soil releases more. The share that escapes (the emanation coefficient) ranges from a few percent to over half; in its few days radon diffuses about one to two metres through soil, so most of what reaches the air comes from the top metre or two.',
        ],
      },
      'pt-pt': {
        kid: [
          'Dentro de uma rocha de granito há grãozinhos com um pouco de urânio. O urânio é radioativo: muito, muito devagar, os seus átomos transformam-se noutros elementos, um passo de cada vez, catorze passos ao todo, até se tornarem chumbo, que fica chumbo para sempre.',
          'Todos os outros membros dessa família são sólidos, mas o rádon é um gás. Quando um átomo de rádio se parte, o novo átomo de rádon é atirado para longe como uma bola. Se cair numa fenda minúscula ou numa película de água entre os grãos, pode sair da rocha para a terra e para o ar. A maior parte do rádon volta a partir-se em poucos dias, antes de ir muito longe.',
        ],
        sci: [
          'O U-238 (meia-vida de 4,47 mil milhões de anos) torna-se Pb-206 estável por 8 decaimentos alfa e 6 beta: passa por Th-234, Pa-234m, U-234, Th-230 e Ra-226 (1600 anos) até ao Rn-222 (3,82 dias), depois Po-218, Pb-214, Bi-214, Po-214 (164 µs), Pb-210 (22 anos), Bi-210 e Po-210. O rádon é o único gás da série, por isso é o único membro que pode sair do mineral onde está o urânio.',
          'Quando o Ra-226 emite uma partícula alfa, o novo Rn-222 recua algumas dezenas de nanómetros pelo cristal; só os átomos nascidos assim tão perto da superfície de um grão podem escapar para os poros, e uma película de água nos poros trava-os antes de se enterrarem no grão seguinte, por isso o solo húmido liberta mais. A fração que escapa (o coeficiente de emanação) vai de poucos por cento a mais de metade; nos seus poucos dias, o rádon difunde-se cerca de um a dois metros pelo solo, por isso a maior parte do que chega ao ar vem do primeiro metro ou dois.',
        ],
      },
      pl: {
        kid: [
          'W skale granitowej siedzą malutkie ziarenka z odrobiną uranu. Uran jest promieniotwórczy: bardzo, bardzo powoli jego atomy zamieniają się w inne pierwiastki, krok po kroku, w sumie w czternastu krokach, aż staną się ołowiem, który zostaje ołowiem na zawsze.',
          'Wszyscy inni członkowie tej rodziny są ciałami stałymi, ale radon jest gazem. Kiedy atom radu się rozpada, nowy atom radonu zostaje odrzucony jak piłka. Jeśli trafi do maleńkiej szczeliny albo do warstewki wody między ziarnami, może wywędrować ze skały do gleby i do powietrza. Większość radonu rozpada się znowu w ciągu kilku dni, zanim zajdzie daleko.',
        ],
        sci: [
          'U-238 (okres półtrwania 4,47 miliarda lat) przechodzi w trwały Pb-206 przez 8 rozpadów alfa i 6 beta: przez Th-234, Pa-234m, U-234, Th-230 i Ra-226 (1600 lat) do Rn-222 (3,82 dnia), potem Po-218, Pb-214, Bi-214, Po-214 (164 µs), Pb-210 (22 lata), Bi-210 i Po-210. Radon jest jedynym gazem w tym szeregu, więc tylko on może opuścić minerał, w którym siedzi uran.',
          'Gdy Ra-226 emituje cząstkę alfa, nowy Rn-222 odskakuje o kilkadziesiąt nanometrów przez kryształ; uciec do porów mogą tylko atomy powstałe tak blisko powierzchni ziarna, a warstewka wody w porach zatrzymuje je, zanim wbiją się w sąsiednie ziarno, dlatego wilgotna gleba uwalnia więcej. Ułamek, który ucieka (współczynnik emanacji), wynosi od kilku procent do ponad połowy; w ciągu swoich kilku dni radon dyfunduje w glebie na jakieś jeden do dwóch metrów, więc większość tego, co dociera do powietrza, pochodzi z górnego metra lub dwóch.',
        ],
      },
      de: {
        kid: [
          'In einem Granitstein stecken winzige Körnchen mit ein wenig Uran. Uran ist radioaktiv: Ganz, ganz langsam verwandeln sich seine Atome in andere Elemente, Schritt für Schritt, vierzehn Schritte insgesamt, bis sie zu Blei werden, das für immer Blei bleibt.',
          'Alle anderen Mitglieder dieser Familie sind fest, aber Radon ist ein Gas. Wenn ein Radiumatom zerfällt, wird das neue Radonatom weggestoßen wie ein Ball. Landet es in einem winzigen Riss oder in einem Wasserfilm zwischen den Körnern, kann es aus dem Stein hinaus in den Boden und in die Luft wandern. Das meiste Radon zerfällt innerhalb weniger Tage wieder, bevor es weit kommt.',
        ],
        sci: [
          'U-238 (Halbwertszeit 4,47 Milliarden Jahre) wird durch 8 Alpha- und 6 Betazerfälle zu stabilem Pb-206: über Th-234, Pa-234m, U-234, Th-230 und Ra-226 (1600 Jahre) zu Rn-222 (3,82 Tage), dann Po-218, Pb-214, Bi-214, Po-214 (164 µs), Pb-210 (22 Jahre), Bi-210 und Po-210. Radon ist das einzige Gas der Reihe und damit das einzige Glied, das das Mineral verlassen kann, in dem das Uran sitzt.',
          'Wenn Ra-226 ein Alphateilchen aussendet, fliegt das neue Rn-222 durch den Rückstoß einige zehn Nanometer durch den Kristall; nur Atome, die so nah an der Oberfläche eines Korns entstehen, können in die Poren entkommen, und ein Wasserfilm in den Poren bremst sie, bevor sie sich ins nächste Korn bohren, deshalb gibt feuchter Boden mehr ab. Der entweichende Anteil (der Emanationskoeffizient) reicht von wenigen Prozent bis über die Hälfte; in seinen wenigen Tagen diffundiert Radon etwa ein bis zwei Meter durch den Boden, sodass das meiste, was die Luft erreicht, aus dem obersten Meter oder zwei stammt.',
        ],
      },
    },
  },
  {
    id: 'draught',
    color: '#74b9ff',
    title: {
      en: 'Why did a door spoil the experiment?',
      'pt-pt': 'Uma porta estragava a experiência?',
      pl: 'Dlaczego drzwi psuły pomiar?',
      de: 'Warum störte eine Tür den Versuch?',
    },
    story: {
      en: {
        kid: [
          'Montreal, Canada, 1899. In a cold physics lab, Robert Owens was measuring the rays that come out of thorium, and his readings kept jumping about. Ernest Rutherford found the strange reason: even opening or closing a door at the far end of the room changed them!',
          'The thorium was giving off a radioactive gas, and the draughts blew it away. Rutherford called it an “emanation”, something that flows out. It went straight through cotton wool, and half of its power was gone in about a minute. A year later, in Halle in Germany, Friedrich Ernst Dorn found that radium gives one off too, one that lasts for days: the radon of this hall.',
        ],
        sci: [
          'Robert B. Owens at McGill found the radiation of thorium oxide in open vessels inconstant and traced it to air currents (Phil. Mag., October 1899). Rutherford showed why (Phil. Mag., January 1900): thorium compounds release a radioactive “emanation” that ionises the air wherever it is carried; “the opening or closing of a door” at the end of the room was enough to change the reading, and in a closed vessel it was steady.',
          'The emanation passed through a plug of cotton wool without loss, so it was no dust, and its activity fell to half “about one minute after the current of air has stopped”: the idea of a half-life starts here (thoron, Rn-220: 55.6 s). In 1900 Friedrich Ernst Dorn in Halle reported radium’s emanation (Rn-222, 3.82 days); Debierne and Giesel found actinium’s (Rn-219, 4 s) in 1903 and 1904. Rutherford and Soddy found the emanations chemically inert, like argon, and in 1903 condensed them with liquid air.',
        ],
      },
      'pt-pt': {
        kid: [
          'Montreal, Canadá, 1899. Num laboratório de física cheio de frio, Robert Owens media os raios que saem do tório, e as leituras não paravam de saltar. Ernest Rutherford descobriu a razão estranha: até abrir ou fechar uma porta ao fundo da sala as mudava!',
          'O tório soltava um gás radioativo, e as correntes de ar levavam-no. Rutherford chamou-lhe «emanação», uma coisa que sai e se espalha. Passava direitinho por algodão, e metade da sua força desaparecia em cerca de um minuto. Um ano depois, em Halle, na Alemanha, Friedrich Ernst Dorn descobriu que o rádio também solta um, que dura dias: o rádon desta sala.',
        ],
        sci: [
          'Robert B. Owens, na Universidade McGill, viu que a radiação do óxido de tório em recipientes abertos era inconstante e atribuiu-a às correntes de ar (Phil. Mag., outubro de 1899). Rutherford mostrou porquê (Phil. Mag., janeiro de 1900): os compostos de tório libertam uma «emanação» radioativa que ioniza o ar para onde for levada; abrir ou fechar uma porta ao fundo da sala bastava para mudar a leitura, e num recipiente fechado ela ficava constante.',
          'A emanação atravessava um tampão de algodão sem perda, por isso não era poeira, e a atividade caía para metade cerca de um minuto depois de parar a corrente de ar: aqui começa a ideia de meia-vida (o thoron, Rn-220: 55,6 s). Em 1900, Friedrich Ernst Dorn, em Halle, descreveu a emanação do rádio (Rn-222, 3,82 dias); Debierne e Giesel encontraram a do actínio (Rn-219, 4 s) em 1903 e 1904. Rutherford e Soddy viram que as emanações eram quimicamente inertes, como o árgon, e em 1903 condensaram-nas com ar líquido.',
        ],
      },
      pl: {
        kid: [
          'Montreal w Kanadzie, rok 1899. W zimnym laboratorium fizycznym Robert Owens mierzył promienie wychodzące z toru, a jego odczyty ciągle skakały. Ernest Rutherford odkrył dziwny powód: zmieniało je nawet otwarcie lub zamknięcie drzwi na drugim końcu sali!',
          'Tor wydzielał promieniotwórczy gaz, a przeciągi go wywiewały. Rutherford nazwał go „emanacją”, czymś, co wypływa. Przechodził prosto przez watę, a połowa jego mocy znikała w około minutę. Rok później w Halle w Niemczech Friedrich Ernst Dorn odkrył, że rad też wydziela taki gaz, który utrzymuje się przez kilka dni: to radon z tej sali.',
        ],
        sci: [
          'Robert B. Owens z Uniwersytetu McGill zauważył, że promieniowanie tlenku toru w otwartych naczyniach jest niestałe, i przypisał to ruchom powietrza (Phil. Mag., październik 1899). Rutherford wyjaśnił dlaczego (Phil. Mag., styczeń 1900): związki toru uwalniają promieniotwórczą „emanację”, która jonizuje powietrze wszędzie, dokąd zostanie zaniesiona; otwarcie lub zamknięcie drzwi na końcu sali wystarczało, by zmienić odczyt, a w zamkniętym naczyniu był on stały.',
          'Emanacja przechodziła bez strat przez korek z waty, więc nie była pyłem, a jej aktywność spadała do połowy po około minucie od zatrzymania przepływu powietrza: tu zaczyna się pojęcie okresu półtrwania (toron, Rn-220: 55,6 s). W 1900 roku Friedrich Ernst Dorn w Halle opisał emanację radu (Rn-222, 3,82 dnia); Debierne i Giesel znaleźli emanację aktynu (Rn-219, 4 s) w latach 1903 i 1904. Rutherford i Soddy stwierdzili, że emanacje są chemicznie obojętne jak argon, i w 1903 roku skroplili je ciekłym powietrzem.',
        ],
      },
      de: {
        kid: [
          'Montreal, Kanada, 1899. In einem kalten Physiklabor maß Robert Owens die Strahlen, die aus Thorium kommen, und seine Messwerte sprangen ständig hin und her. Ernest Rutherford fand den seltsamen Grund: Schon das Öffnen oder Schließen einer Tür am anderen Ende des Raums veränderte sie!',
          'Das Thorium gab ein radioaktives Gas ab, und der Luftzug blies es weg. Rutherford nannte es „Emanation“, etwas, das herausströmt. Es ging glatt durch Watte, und die Hälfte seiner Kraft war nach etwa einer Minute weg. Ein Jahr später fand Friedrich Ernst Dorn in Halle in Deutschland heraus, dass auch Radium so ein Gas abgibt, eines, das tagelang hält: das Radon dieser Halle.',
        ],
        sci: [
          'Robert B. Owens an der McGill-Universität fand die Strahlung von Thoriumoxid in offenen Gefäßen unbeständig und führte das auf Luftströmungen zurück (Phil. Mag., Oktober 1899). Rutherford zeigte, warum (Phil. Mag., Januar 1900): Thoriumverbindungen geben eine radioaktive „Emanation“ ab, die die Luft ionisiert, wohin sie auch getragen wird; das Öffnen oder Schließen einer Tür am Ende des Raums genügte, um den Messwert zu ändern, und in einem geschlossenen Gefäß blieb er konstant.',
          'Die Emanation ging ohne Verlust durch einen Wattepfropfen, war also kein Staub, und ihre Aktivität fiel etwa eine Minute nach dem Abstellen des Luftstroms auf die Hälfte: Hier beginnt die Idee der Halbwertszeit (Thoron, Rn-220: 55,6 s). 1900 beschrieb Friedrich Ernst Dorn in Halle die Emanation des Radiums (Rn-222, 3,82 Tage); Debierne und Giesel fanden 1903 und 1904 die des Actiniums (Rn-219, 4 s). Rutherford und Soddy fanden die Emanationen chemisch träge wie Argon und verflüssigten sie 1903 mit flüssiger Luft.',
        ],
      },
    },
  },
  {
    id: 'moon',
    color: '#b39dff',
    title: {
      en: 'Does the Moon breathe out a gas?',
      'pt-pt': 'A Lua também solta um gás?',
      pl: 'Czy Księżyc wydycha gaz?',
      de: 'Atmet der Mond ein Gas aus?',
    },
    story: {
      en: {
        kid: [
          'In 1971 the Apollo 15 spaceship circled the Moon carrying a special counter that could feel radon atoms breaking apart far below. Over the bright crater Aristarchus it found some: radon seeping out of the Moon’s rocks, just as it does from the ground on Earth.',
          'The Moon has no air, so radon atoms hop across the dust until they break apart a few days later. What they turn into stays put for years, like footprints showing where gas came out not long ago. In 1998 and 1999 the Lunar Prospector probe found radon again, near the craters Aristarchus and Kepler.',
        ],
        sci: [
          'Apollo 15 and 16 carried an alpha-particle spectrometer in the service module’s instrument bay. Apollo 15 detected Rn-222 over the crater Aristarchus (Gorenstein and Bjorkholm, Science 1973), and both found excess Po-210 along the edges of the maria. On the airless Moon, radon atoms hop ballistically from grain to grain until they decay; the daughters stick where they land.',
          'Po-210 builds up through Pb-210 (half-life 22 years), so an excess of it marks radon released over the past few decades, while Rn-222 itself (3.8 days) shows release happening now. Lunar Prospector’s alpha-particle spectrometer (1998–1999) mapped radon near Aristarchus and Kepler (Lawson et al., 2005): the Moon still lets out gas from below, now and then.',
        ],
      },
      'pt-pt': {
        kid: [
          'Em 1971, a nave Apollo 15 deu voltas à Lua com um contador especial que sentia, lá de cima, os átomos de rádon a partirem-se. Por cima da cratera brilhante Aristarco encontrou algum: rádon a sair das rochas da Lua, tal como sai do chão aqui na Terra.',
          'A Lua não tem ar, por isso os átomos de rádon vão aos saltinhos pelo pó até se partirem, uns dias depois. Aquilo em que se transformam fica ali durante anos, como pegadas a mostrar por onde saiu gás há pouco tempo. Em 1998 e 1999, a sonda Lunar Prospector voltou a encontrar rádon, perto das crateras Aristarco e Kepler.',
        ],
        sci: [
          'As Apollo 15 e 16 levavam um espetrómetro de partículas alfa no compartimento de instrumentos do módulo de serviço. A Apollo 15 detetou Rn-222 sobre a cratera Aristarco (Gorenstein e Bjorkholm, Science, 1973), e as duas encontraram em órbita um excesso de Po-210 ao longo das orlas dos mares lunares. Na Lua sem ar, os átomos de rádon saltam em trajetórias balísticas de grão em grão até decaírem; os descendentes ficam presos onde caem.',
          'O Po-210 acumula-se através do Pb-210 (meia-vida de 22 anos), por isso um excesso dele marca rádon libertado nas últimas décadas, enquanto o próprio Rn-222 (3,8 dias) mostra libertação a acontecer agora. O espetrómetro de partículas alfa da Lunar Prospector (1998–1999) cartografou rádon perto de Aristarco e Kepler (Lawson et al., 2005): a Lua ainda deixa sair gás de baixo, de vez em quando.',
        ],
      },
      pl: {
        kid: [
          'W 1971 roku statek Apollo 15 okrążał Księżyc ze specjalnym licznikiem, który z góry wyczuwał rozpadające się atomy radonu. Nad jasnym kraterem Arystarch trochę go znalazł: radon sączący się ze skał Księżyca, tak samo jak na Ziemi sączy się z gruntu.',
          'Księżyc nie ma powietrza, więc atomy radonu skaczą po pyle, aż po kilku dniach się rozpadną. To, w co się zamieniają, zostaje na miejscu przez lata, jak ślady stóp pokazujące, gdzie niedawno wydobył się gaz. W latach 1998 i 1999 sonda Lunar Prospector znów znalazła radon, w pobliżu kraterów Arystarch i Kepler.',
        ],
        sci: [
          'Apollo 15 i 16 miały spektrometr cząstek alfa we wnęce przyrządów modułu serwisowego. Apollo 15 wykrył Rn-222 nad kraterem Arystarch (Gorenstein i Bjorkholm, Science 1973), a oba statki znalazły z orbity nadmiar Po-210 wzdłuż brzegów mórz księżycowych. Na pozbawionym powietrza Księżycu atomy radonu przeskakują balistycznie z ziarna na ziarno, aż się rozpadną; produkty rozpadu przywierają tam, gdzie spadną.',
          'Po-210 narasta przez Pb-210 (okres półtrwania 22 lata), więc jego nadmiar wskazuje radon uwolniony w ciągu ostatnich kilkudziesięciu lat, a sam Rn-222 (3,8 dnia) pokazuje uwalnianie trwające teraz. Spektrometr cząstek alfa sondy Lunar Prospector (1998–1999) zmapował radon w pobliżu Arystarcha i Keplera (Lawson i in., 2005): Księżyc wciąż od czasu do czasu wypuszcza gaz z głębi.',
        ],
      },
      de: {
        kid: [
          '1971 umkreiste das Raumschiff Apollo 15 den Mond mit einem besonderen Zählgerät, das von oben spüren konnte, wie Radonatome zerfallen. Über dem hellen Krater Aristarchus fand es welches: Radon, das aus den Gesteinen des Mondes sickert, genau wie auf der Erde aus dem Boden.',
          'Der Mond hat keine Luft, deshalb hüpfen Radonatome über den Staub, bis sie ein paar Tage später zerfallen. Was aus ihnen wird, bleibt jahrelang liegen, wie Fußspuren, die zeigen, wo vor Kurzem Gas herauskam. 1998 und 1999 fand die Sonde Lunar Prospector wieder Radon, nahe den Kratern Aristarchus und Kepler.',
        ],
        sci: [
          'Apollo 15 und 16 trugen ein Alphateilchen-Spektrometer im Instrumentenschacht des Servicemoduls. Apollo 15 entdeckte Rn-222 über dem Krater Aristarchus (Gorenstein und Bjorkholm, Science 1973), und beide fanden aus der Umlaufbahn einen Überschuss an Po-210 entlang der Ränder der Maria. Auf dem luftlosen Mond hüpfen Radonatome auf Wurfbahnen von Korn zu Korn, bis sie zerfallen; die Folgeprodukte bleiben haften, wo sie landen.',
          'Po-210 baut sich über Pb-210 auf (Halbwertszeit 22 Jahre), daher zeigt ein Überschuss davon Radon an, das in den letzten Jahrzehnten frei wurde, während Rn-222 selbst (3,8 Tage) eine Freisetzung gerade jetzt zeigt. Das Alphateilchen-Spektrometer von Lunar Prospector (1998–1999) kartierte Radon nahe Aristarchus und Kepler (Lawson u. a., 2005): Der Mond lässt noch immer ab und zu Gas aus der Tiefe entweichen.',
        ],
      },
    },
  },
  {
    id: 'quake',
    color: '#5ee08f',
    title: {
      en: 'Can a gas warn of earthquakes?',
      'pt-pt': 'Um gás pode avisar dos sismos?',
      pl: 'Czy gaz zapowie trzęsienie ziemi?',
      de: 'Kann ein Gas vor Erdbeben warnen?',
    },
    story: {
      en: {
        kid: [
          'Along a fault, deep underground, huge blocks of rock press harder and harder against each other until they slip: an earthquake. Some scientists wonder whether the squeezed rock cracks a little first and lets more radon out into wells and soil, like a warning puff.',
          'Before the Kobe earthquake in Japan in 1995, the radon in the water of one well rose to more than ten times its level a few months earlier, nine days before the quake, and then began to fall. But nobody can predict earthquakes yet: radon also changes with rain, wind and the seasons, and many earthquakes come with no radon sign at all. So scientists keep measuring and comparing, to learn what it can and cannot tell us.',
        ],
        sci: [
          'Soil-gas and groundwater radon are monitored along faults as a possible earthquake precursor: the idea is that rising stress opens microcracks, exposes fresh grain surfaces and changes how gas and water move. Fault zones often show raised soil-gas radon anyway, which geologists use to map them.',
          'The best-known case: from late October 1994 radon in the groundwater of a well at Nishinomiya, about 30 km from the epicentre, rose about fourfold, peaked on 8 January 1995 at more than ten times the starting level and fell again in the days before the Mw 6.9 Kobe earthquake of 17 January (Igarashi et al., Science 1995). Such anomalies are not consistent: rainfall, air pressure, tides and pumping move radon too, many quakes show none, and no method, with radon or anything else, predicts earthquakes reliably today.',
        ],
      },
      'pt-pt': {
        kid: [
          'Ao longo de uma falha, bem fundo debaixo da terra, enormes blocos de rocha empurram-se cada vez com mais força até escorregarem: um sismo. Alguns cientistas perguntam-se se a rocha apertada não racha um pouco antes, deixando sair mais rádon para os poços e para a terra, como um sopro de aviso.',
          'Antes do sismo de Kobe, no Japão, em 1995, o rádon na água de um poço subiu até mais de dez vezes o que tinha uns meses antes, nove dias antes do sismo, e depois começou a descer. Mas ainda ninguém consegue prever sismos: o rádon também muda com a chuva, o vento e as estações, e muitos sismos chegam sem sinal nenhum de rádon. Por isso os cientistas continuam a medir e a comparar, para perceber o que ele pode e não pode dizer.',
        ],
        sci: [
          'O rádon no gás do solo e nas águas subterrâneas é vigiado ao longo de falhas como possível precursor de sismos: a ideia é que o aumento da tensão abre microfissuras, expõe superfícies de grão novas e muda a maneira como o gás e a água circulam. As zonas de falha costumam ter, de qualquer modo, mais rádon no gás do solo, o que os geólogos usam para as cartografar.',
          'O caso mais conhecido: a partir do fim de outubro de 1994, o rádon na água de um poço em Nishinomiya, a cerca de 30 km do epicentro, subiu cerca de quatro vezes, atingiu a 8 de janeiro de 1995 mais de dez vezes o nível inicial e voltou a descer nos dias antes do sismo de Kobe (Mw 6,9) de 17 de janeiro (Igarashi et al., Science, 1995). Estas anomalias não são constantes: a chuva, a pressão do ar, as marés e a bombagem também mexem no rádon, muitos sismos não mostram nenhuma, e hoje nenhum método, com rádon ou outro, prevê sismos de forma fiável.',
        ],
      },
      pl: {
        kid: [
          'Wzdłuż uskoku, głęboko pod ziemią, ogromne bloki skalne naciskają na siebie coraz mocniej, aż się przesuną: to trzęsienie ziemi. Niektórzy naukowcy zastanawiają się, czy ściśnięta skała nie pęka najpierw trochę i nie wypuszcza więcej radonu do studni i gleby, jak ostrzegawczego dmuchnięcia.',
          'Przed trzęsieniem ziemi w Kobe w Japonii w 1995 roku radon w wodzie z jednej studni wzrósł do ponad dziesięciu razy więcej niż kilka miesięcy wcześniej, dziewięć dni przed trzęsieniem, a potem zaczął spadać. Ale nikt jeszcze nie umie przewidywać trzęsień ziemi: radon zmienia się też z deszczem, wiatrem i porami roku, a wiele trzęsień przychodzi bez żadnego radonowego znaku. Dlatego naukowcy wciąż mierzą i porównują, żeby się dowiedzieć, co radon może nam powiedzieć, a czego nie.',
        ],
        sci: [
          'Radon w gazie glebowym i w wodach podziemnych jest monitorowany wzdłuż uskoków jako możliwy zwiastun trzęsień ziemi: chodzi o to, że rosnące naprężenia otwierają mikropęknięcia, odsłaniają świeże powierzchnie ziaren i zmieniają przepływ gazu i wody. Strefy uskoków i tak często mają podwyższone stężenie radonu w gazie glebowym, co geolodzy wykorzystują do ich kartowania.',
          'Najbardziej znany przypadek: od końca października 1994 roku radon w wodzie ze studni w Nishinomiya, około 30 km od epicentrum, wzrósł mniej więcej czterokrotnie, 8 stycznia 1995 roku osiągnął ponad dziesięciokrotność poziomu początkowego i znów spadał w dniach przed trzęsieniem ziemi w Kobe (Mw 6,9) 17 stycznia (Igarashi i in., Science 1995). Takie anomalie nie są regularne: deszcz, ciśnienie powietrza, pływy i pompowanie też zmieniają stężenie radonu, wiele trzęsień nie wykazuje żadnej anomalii, a dziś żadna metoda, radonowa czy inna, nie przewiduje trzęsień ziemi wiarygodnie.',
        ],
      },
      de: {
        kid: [
          'Entlang einer Verwerfung, tief unter der Erde, drücken riesige Gesteinsblöcke immer stärker gegeneinander, bis sie rutschen: ein Erdbeben. Manche Forscher fragen sich, ob das gepresste Gestein vorher ein wenig reißt und mehr Radon in Brunnen und Boden entweichen lässt, wie ein warnender Hauch.',
          'Vor dem Erdbeben von Kobe in Japan 1995 stieg das Radon im Wasser eines Brunnens auf mehr als das Zehnfache von ein paar Monaten zuvor, neun Tage vor dem Beben, und begann dann zu sinken. Aber niemand kann Erdbeben bisher vorhersagen: Radon ändert sich auch mit Regen, Wind und Jahreszeiten, und viele Erdbeben kommen ganz ohne Radonzeichen. Deshalb messen und vergleichen Forscher weiter, um herauszufinden, was es uns sagen kann und was nicht.',
        ],
        sci: [
          'Radon in Bodenluft und Grundwasser wird entlang von Verwerfungen als möglicher Erdbebenvorbote überwacht: Die Idee ist, dass wachsende Spannung Mikrorisse öffnet, frische Kornoberflächen freilegt und verändert, wie Gas und Wasser fließen. Verwerfungszonen zeigen ohnehin oft erhöhtes Radon in der Bodenluft, womit Geologen sie kartieren.',
          'Der bekannteste Fall: Ab Ende Oktober 1994 stieg das Radon im Grundwasser eines Brunnens in Nishinomiya, etwa 30 km vom Epizentrum, um etwa das Vierfache, erreichte am 8. Januar 1995 mehr als das Zehnfache des Anfangswerts und sank in den Tagen vor dem Kobe-Erdbeben (Mw 6,9) vom 17. Januar wieder (Igarashi u. a., Science 1995). Solche Anomalien sind nicht verlässlich: Regen, Luftdruck, Gezeiten und Pumpen verändern Radon ebenfalls, viele Beben zeigen keine, und heute sagt keine Methode, ob mit Radon oder anders, Erdbeben zuverlässig vorher.',
        ],
      },
    },
  },
  {
    id: 'cave',
    color: '#3cc7d8',
    title: {
      en: 'Do caves breathe in and out?',
      'pt-pt': 'As grutas também respiram?',
      pl: 'Czy jaskinie oddychają?',
      de: 'Atmen Höhlen ein und aus?',
    },
    story: {
      en: {
        kid: [
          'A cave is a hole in rock, and rock breathes out a little radon, so a cave’s quiet air collects it. But caves breathe too! In winter the cave is warmer than the frosty air outside, so its air rises out of openings high up while fresh air flows in at the bottom, and the radon is swept away.',
          'In summer the cave is the cooler place: its cold, heavy air slides slowly out of the bottom entrance and the cave hardly airs at all, so radon builds up. In Postojna Cave in Slovenia there is about fifteen times more in summer than in winter. That is why show caves measure their air and plan how long their guides work underground; a visit of an hour or two adds only a tiny amount.',
        ],
        sci: [
          'Caves exchange air with the outside by the chimney effect: when it is colder outside, the warmer, lighter cave air rises out of upper openings and draws outside air in through lower ones, flushing the radon; when it is warmer outside, the cold, dense cave air drains from the lower entrance and ventilation weakens or reverses, so radon accumulates. Continuous monitoring in Postojna Cave (2005–2009) found about 200 Bq/m³ in winter and about 3000 Bq/m³ in summer, highest in early autumn.',
          'Some caves show the reverse pattern or none, depending on their shape and on where the radon comes from, and cave scientists use radon as a tracer of how a cave ventilates. Show caves are workplaces, so radon is monitored and guides’ hours are planned to keep their dose within limits; a visitor’s short tour adds very little. Some spas, such as the Gastein healing gallery in Austria (an old mine tunnel), still offer radon treatments; for everyday air, the public-health advice is to keep radon as low as reasonably possible.',
        ],
      },
      'pt-pt': {
        kid: [
          'Uma gruta é um buraco na rocha, e a rocha solta um pouco de rádon, por isso o ar parado de uma gruta vai-o juntando. Mas as grutas também respiram! No inverno, a gruta está mais quente do que o ar gelado lá de fora, por isso o ar dela sobe e sai pelas aberturas de cima enquanto entra ar fresco por baixo, e o rádon vai embora.',
          'No verão, a gruta é o sítio mais fresco: o ar frio e pesado escorre devagarinho pela entrada de baixo e a gruta quase não areja, por isso o rádon acumula-se. Na gruta de Postojna, na Eslovénia, há cerca de quinze vezes mais no verão do que no inverno. É por isso que as grutas turísticas medem o ar e planeiam quanto tempo os guias trabalham lá dentro; uma visita de uma ou duas horas acrescenta só um bocadinho.',
        ],
        sci: [
          'As grutas trocam ar com o exterior pelo efeito chaminé: quando lá fora está mais frio, o ar da gruta, mais quente e leve, sobe e sai pelas aberturas de cima e puxa ar de fora pelas de baixo, varrendo o rádon; quando lá fora está mais quente, o ar frio e denso da gruta escorre pela entrada de baixo e a ventilação enfraquece ou inverte-se, e o rádon acumula-se. A monitorização contínua na gruta de Postojna (2005–2009) mediu cerca de 200 Bq/m³ no inverno e cerca de 3000 Bq/m³ no verão, com o máximo no início do outono.',
          'Algumas grutas têm o padrão inverso ou nenhum, conforme a forma e a origem do rádon, e os espeleólogos usam o rádon como traçador da ventilação de uma gruta. As grutas turísticas são locais de trabalho, por isso o rádon é vigiado e o horário dos guias é planeado para manter a dose dentro dos limites; a visita curta de um turista acrescenta muito pouco. Algumas termas, como a galeria de cura de Gastein, na Áustria (um antigo túnel de mina), ainda oferecem tratamentos com rádon; para o ar do dia a dia, a recomendação de saúde pública é manter o rádon tão baixo quanto razoavelmente possível.',
        ],
      },
      pl: {
        kid: [
          'Jaskinia to dziura w skale, a skała wypuszcza trochę radonu, więc nieruchome powietrze w jaskini go zbiera. Ale jaskinie też oddychają! Zimą w jaskini jest cieplej niż na mroźnym dworze, więc jej powietrze unosi się i uchodzi górnymi otworami, a dołem wpływa świeże, i radon zostaje wywiany.',
          'Latem to jaskinia jest chłodniejsza: jej zimne, ciężkie powietrze powoli wysuwa się dolnym wejściem, a jaskinia prawie się nie wietrzy, więc radon się gromadzi. W jaskini Postojna w Słowenii latem jest go około piętnaście razy więcej niż zimą. Dlatego jaskinie turystyczne mierzą powietrze i planują, jak długo przewodnicy pracują pod ziemią; wizyta trwająca godzinę czy dwie dodaje tylko odrobinę.',
        ],
        sci: [
          'Jaskinie wymieniają powietrze z otoczeniem dzięki efektowi kominowemu: gdy na zewnątrz jest zimniej, cieplejsze, lżejsze powietrze jaskini unosi się i uchodzi górnymi otworami, zasysając powietrze z zewnątrz dolnymi i wymiatając radon; gdy na zewnątrz jest cieplej, zimne, gęste powietrze jaskini spływa dolnym wejściem, a wentylacja słabnie lub się odwraca, więc radon się gromadzi. Ciągły monitoring w jaskini Postojna (2005–2009) wykazał około 200 Bq/m³ zimą i około 3000 Bq/m³ latem, z maksimum na początku jesieni.',
          'Niektóre jaskinie mają odwrotny wzorzec albo żaden, zależnie od kształtu i od tego, skąd pochodzi radon, a speleolodzy używają radonu jako znacznika wentylacji jaskini. Jaskinie turystyczne są miejscami pracy, więc radon się monitoruje, a godziny przewodników planuje tak, by ich dawka mieściła się w limitach; krótka wycieczka turysty dodaje bardzo niewiele. Niektóre uzdrowiska, jak lecznicza sztolnia w Gastein w Austrii (dawny tunel kopalni), wciąż oferują zabiegi radonowe; dla powietrza na co dzień zalecenie zdrowia publicznego brzmi: utrzymywać radon na tak niskim poziomie, jak to rozsądnie możliwe.',
        ],
      },
      de: {
        kid: [
          'Eine Höhle ist ein Loch im Gestein, und Gestein atmet ein wenig Radon aus, deshalb sammelt die stille Luft einer Höhle es an. Aber Höhlen atmen auch! Im Winter ist die Höhle wärmer als die frostige Luft draußen, also steigt ihre Luft durch Öffnungen weit oben hinaus, während unten frische Luft hereinströmt, und das Radon wird fortgetragen.',
          'Im Sommer ist die Höhle der kühlere Ort: Ihre kalte, schwere Luft gleitet langsam aus dem unteren Eingang, und die Höhle lüftet kaum, also sammelt sich Radon an. In der Höhle von Postojna in Slowenien ist es im Sommer etwa fünfzehnmal mehr als im Winter. Deshalb messen Schauhöhlen ihre Luft und planen, wie lange ihre Führer unter Tage arbeiten; ein Besuch von ein, zwei Stunden fügt nur ganz wenig hinzu.',
        ],
        sci: [
          'Höhlen tauschen Luft mit draußen über den Kamineffekt aus: Ist es draußen kälter, steigt die wärmere, leichtere Höhlenluft aus oberen Öffnungen und zieht Außenluft durch untere herein, die das Radon ausspült; ist es draußen wärmer, fließt die kalte, dichte Höhlenluft aus dem unteren Eingang ab, die Lüftung wird schwächer oder kehrt sich um, und Radon reichert sich an. Dauermessungen in der Höhle von Postojna (2005–2009) ergaben etwa 200 Bq/m³ im Winter und etwa 3000 Bq/m³ im Sommer, am höchsten im Frühherbst.',
          'Manche Höhlen zeigen das umgekehrte Muster oder keines, je nach ihrer Form und der Herkunft des Radons, und Höhlenforscher nutzen Radon als Tracer dafür, wie eine Höhle lüftet. Schauhöhlen sind Arbeitsplätze, deshalb wird Radon überwacht und die Arbeitszeit der Führer so geplant, dass ihre Dosis innerhalb der Grenzwerte bleibt; eine kurze Führung fügt einem Besucher sehr wenig hinzu. Manche Kurorte, etwa der Gasteiner Heilstollen in Österreich (ein alter Bergwerksstollen), bieten noch Radonkuren an; für die Luft im Alltag lautet der Rat des Gesundheitsschutzes, Radon so niedrig wie vernünftigerweise möglich zu halten.',
        ],
      },
    },
  },
]
