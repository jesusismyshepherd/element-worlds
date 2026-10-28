// An Atomling read aloud: each feature and what it says about the element (the Atomlings page's
// card). Pure: traits in, sentences out, in every language of the site (English where one is missing).
import { decimalOf } from '../i18n/langs.js'
import { ELEMENTS, nameOf } from '../data/elements.js'
import { traitsOf } from './traits.js'
import { HELMET, SIGNATURE, TAKES_HEAD } from './look.js'

/** What each signature (look.js SIGNATURE) says about its element, by language. */
export const SIG = {
  drop: {
    en: 'The water drop: two hydrogens and an oxygen make water.',
    'pt-pt': 'A gota de água: dois hidrogénios e um oxigénio fazem água.',
    pl: 'Kropla wody: dwa atomy wodoru i atom tlenu tworzą wodę.',
    de: 'Der Wassertropfen: Zwei Wasserstoffatome und ein Sauerstoffatom bilden Wasser.',
  },
  balloon: {
    en: 'The balloon: helium is lighter than air, so it lifts party balloons.',
    'pt-pt': 'O balão: o hélio é mais leve do que o ar, por isso faz subir os balões.',
    pl: 'Balon: hel jest lżejszy od powietrza, więc unosi balony na przyjęciach.',
    de: 'Der Luftballon: Helium ist leichter als Luft, deshalb lässt es Partyballons aufsteigen.',
  },
  battery: {
    en: 'The battery: lithium-ion batteries power phones and electric cars.',
    'pt-pt': 'A pilha: as baterias de iões de lítio alimentam telemóveis e carros elétricos.',
    pl: 'Bateria: akumulatory litowo-jonowe zasilają telefony i samochody elektryczne.',
    de: 'Der Akku: Lithium-Ionen-Akkus versorgen Handys und Elektroautos mit Strom.',
  },
  salt: {
    en: 'The salt shaker: table salt is sodium chloride.',
    'pt-pt': 'O saleiro: o sal de cozinha é cloreto de sódio.',
    pl: 'Solniczka: sól kuchenna to chlorek sodu.',
    de: 'Der Salzstreuer: Kochsalz ist Natriumchlorid.',
  },
  leaf: {
    en: 'The leaf: every chlorophyll molecule, the green of leaves, has a magnesium atom at its heart.',
    'pt-pt': 'A folha: cada molécula de clorofila, o verde das folhas, tem um átomo de magnésio no centro.',
    pl: 'Liść: każda cząsteczka chlorofilu, zieleni liści, ma w samym środku atom magnezu.',
    de: 'Das Blatt: Jedes Chlorophyllmolekül, das Grün der Blätter, hat in seiner Mitte ein Magnesiumatom.',
  },
  match: {
    en: "The match: matches light thanks to phosphorus, on the box's striking strip.",
    'pt-pt': 'O fósforo de acender: acende graças ao fósforo da lixa da caixa.',
    pl: 'Zapałka: zapałki zapalają się dzięki fosforowi na drasce pudełka.',
    de: 'Das Streichholz: Streichhölzer zünden dank Phosphor, der auf der Reibfläche der Schachtel sitzt.',
  },
  banana: {
    en: 'The banana: bananas are rich in potassium.',
    'pt-pt': 'A banana: as bananas são ricas em potássio.',
    pl: 'Banan: banany są bogate w potas.',
    de: 'Die Banane: Bananen sind reich an Kalium.',
  },
  bone: {
    en: 'The bone: our bones and teeth are made with calcium.',
    'pt-pt': 'O osso: os nossos ossos e dentes são feitos com cálcio.',
    pl: 'Kość: nasze kości i zęby są zbudowane z wapnia.',
    de: 'Der Knochen: Unsere Knochen und Zähne sind mit Calcium gebaut.',
  },
  chip: {
    en: 'The chip: computer chips are made of silicon.',
    'pt-pt': 'O chip: os chips dos computadores são feitos de silício.',
    pl: 'Chip: chipy komputerowe są zrobione z krzemu.',
    de: 'Der Chip: Computerchips sind aus Silicium.',
  },
  magnet: {
    en: 'The magnet and the nail: iron is magnetic.',
    'pt-pt': 'O íman e o prego: o ferro é magnético.',
    pl: 'Magnes i gwóźdź: żelazo jest magnetyczne.',
    de: 'Der Magnet und der Nagel: Eisen ist magnetisch.',
  },
  coil: {
    en: 'The coil: copper wires carry electricity.',
    'pt-pt': 'A bobina: os fios de cobre levam a eletricidade.',
    pl: 'Cewka: miedziane przewody przewodzą prąd.',
    de: 'Die Spule: Kupferdrähte leiten Strom.',
  },
  bulb: {
    en: 'The bulb: old light bulbs glowed with a tungsten filament, the metal with the highest melting point.',
    'pt-pt': 'A lâmpada: as lâmpadas antigas brilhavam com um filamento de tungsténio, o metal com o ponto de fusão mais alto.',
    pl: 'Żarówka: dawne żarówki świeciły dzięki włóknu z wolframu, metalu o najwyższej temperaturze topnienia.',
    de: 'Die Glühbirne: Alte Glühbirnen leuchteten mit einem Glühfaden aus Wolfram, dem Metall mit dem höchsten Schmelzpunkt.',
  },
  crown: {
    en: 'The crown: gold has been the metal of kings and treasures for thousands of years.',
    'pt-pt': 'A coroa: o ouro é o metal dos reis e dos tesouros há milhares de anos.',
    pl: 'Korona: złoto od tysięcy lat jest metalem królów i skarbów.',
    de: 'Die Krone: Gold ist seit Tausenden von Jahren das Metall der Könige und der Schätze.',
  },
  mirror: {
    en: "The golden hexagons: the James Webb Space Telescope's 18 mirrors are beryllium, light and stiff, covered in gold.",
    'pt-pt': 'Os hexágonos dourados: os 18 espelhos do Telescópio Espacial James Webb são de berílio, leve e rígido, coberto de ouro.',
    pl: 'Złote sześciokąty: 18 zwierciadeł Kosmicznego Teleskopu Jamesa Webba zrobiono z berylu, lekkiego i sztywnego, pokrytego złotem.',
    de: 'Die goldenen Sechsecke: Die 18 Spiegel des James-Webb-Weltraumteleskops sind aus Beryllium, leicht und steif, mit Gold überzogen.',
  },
  slime: {
    en: 'The slime: borax, a boron compound, turns glue into slime.',
    'pt-pt': 'O slime: o bórax, um composto de boro, transforma a cola em slime.',
    pl: 'Slime: boraks, związek boru, zamienia klej w slime.',
    de: 'Der Schleim: Borax, eine Borverbindung, macht aus Kleber Schleim.',
  },
  pencil: {
    en: "The pencil: a pencil's 'lead' is graphite, carbon just like diamond.",
    'pt-pt': 'O lápis: a mina do lápis é grafite, carbono tal como o diamante.',
    pl: 'Ołówek: rysik ołówka to grafit, węgiel tak samo jak diament.',
    de: 'Der Bleistift: Seine „Mine“ ist kein Blei, sondern Graphit, Kohlenstoff genau wie Diamant.',
  },
  crisps: {
    en: 'The bag of crisps: it is puffed up with nitrogen, which keeps the crisps fresh and stops them breaking.',
    'pt-pt': 'O pacote de batatas fritas: vem cheio de azoto, que mantém as batatas frescas e não as deixa partir.',
    pl: 'Paczka chipsów: jest napompowana azotem, który utrzymuje chipsy świeże i chroni je przed pokruszeniem.',
    de: 'Die Chipstüte: Sie ist mit Stickstoff aufgeblasen, der die Chips frisch hält und vor dem Zerbrechen schützt.',
  },
  fishbowl: {
    en: 'The fishbowl: fish breathe the oxygen dissolved in the water.',
    'pt-pt': 'O aquário: os peixes respiram o oxigénio dissolvido na água.',
    pl: 'Akwarium: ryby oddychają tlenem rozpuszczonym w wodzie.',
    de: 'Das Goldfischglas: Fische atmen den Sauerstoff, der im Wasser gelöst ist.',
  },
  toothbrush: {
    en: 'The toothbrush: fluoride in toothpaste makes teeth stronger.',
    'pt-pt': 'A escova de dentes: o flúor da pasta de dentes torna os dentes mais fortes.',
    pl: 'Szczoteczka do zębów: fluorek w paście do zębów wzmacnia zęby.',
    de: 'Die Zahnbürste: Fluorid in der Zahnpasta macht die Zähne stärker.',
  },
  neonsign: {
    en: 'The glowing sign: neon glows red-orange inside a glass tube, the light of neon signs.',
    'pt-pt': 'O letreiro luminoso: o néon brilha vermelho-alaranjado dentro de um tubo de vidro, a luz dos letreiros de néon.',
    pl: 'Świecący napis: neon świeci na czerwono-pomarańczowo w szklanej rurce, to światło neonów.',
    de: 'Das Leuchtschild: Neon leuchtet in einer Glasröhre rot-orange, das Licht der Neonreklamen.',
  },
  can: {
    en: 'The can: drink cans are aluminium, light and easy to recycle.',
    'pt-pt': 'A lata: as latas de bebidas são de alumínio, leve e fácil de reciclar.',
    pl: 'Puszka: puszki po napojach są z aluminium (czyli glinu), lekkiego i łatwego do przetworzenia.',
    de: 'Die Dose: Getränkedosen sind aus Aluminium, leicht und gut zu recyceln.',
  },
  egg: {
    en: 'The rotten egg: its stink is hydrogen sulfide, a sulfur compound.',
    'pt-pt': 'O ovo podre: o mau cheiro é sulfureto de hidrogénio, um composto de enxofre.',
    pl: 'Zgniłe jajo: jego smród to siarkowodór, związek siarki.',
    de: 'Das faule Ei: Sein Gestank ist Schwefelwasserstoff, eine Schwefelverbindung.',
  },
  swimring: {
    en: 'The swim ring: swimming pools are kept clean with chlorine.',
    'pt-pt': 'A boia: as piscinas mantêm-se limpas com cloro.',
    pl: 'Koło do pływania: baseny utrzymuje się w czystości dzięki chlorowi.',
    de: 'Der Schwimmreifen: Schwimmbäder werden mit Chlor sauber gehalten.',
  },
  pillow: {
    en: "The pillow: argon's name means 'lazy' in Greek, because it hardly ever reacts.",
    'pt-pt': "A almofada: árgon quer dizer 'preguiçoso' em grego, porque quase nunca reage.",
    pl: 'Poduszka: nazwa argonu po grecku znaczy „leniwy”, bo prawie nigdy nie reaguje.',
    de: 'Das Kissen: Der Name Argon bedeutet auf Griechisch „träge“, weil es fast nie reagiert.',
  },
  plane: {
    en: 'The plane: titanium is strong and light, so jet engines and planes are built with it.',
    'pt-pt': 'O avião: o titânio é forte e leve, por isso faz parte de motores a jato e de aviões.',
    pl: 'Samolot: tytan jest mocny i lekki, dlatego buduje się z niego silniki odrzutowe i samoloty.',
    de: 'Das Flugzeug: Titan ist stark und leicht, deshalb baut man damit Düsentriebwerke und Flugzeuge.',
  },
  spanner: {
    en: "The spanner: strong tools are made of chrome-vanadium steel (look for 'Cr-V' on one).",
    'pt-pt': "A chave de bocas: as ferramentas fortes são de aço de crómio-vanádio (procura 'Cr-V' numa).",
    pl: 'Klucz płaski: mocne narzędzia robi się ze stali chromowo-wanadowej (poszukaj na nich napisu „Cr-V”).',
    de: 'Der Schraubenschlüssel: Starke Werkzeuge sind aus Chrom-Vanadium-Stahl (such mal nach „Cr-V“ darauf).',
  },
  ruby: {
    en: "The ruby: a pinch of chromium makes rubies red; chromium's name means 'colour'.",
    'pt-pt': "O rubi: uma pitada de crómio torna os rubis vermelhos; crómio quer dizer 'cor'.",
    pl: 'Rubin: szczypta chromu barwi rubiny na czerwono; nazwa chromu znaczy „kolor”.',
    de: 'Der Rubin: Eine Prise Chrom macht Rubine rot; der Name Chrom bedeutet „Farbe“.',
  },
  brush: {
    en: 'The paintbrush: cobalt makes the deep blue of paints, glass and porcelain.',
    'pt-pt': 'O pincel: o cobalto dá o azul forte das tintas, do vidro e da porcelana.',
    pl: 'Pędzel: kobalt daje głęboki błękit farb, szkła i porcelany.',
    de: 'Der Pinsel: Cobalt gibt Farben, Glas und Porzellan ihr tiefes Blau.',
  },
  coin: {
    en: 'The coin: the 1 and 2 euro coins have nickel in them.',
    'pt-pt': 'A moeda: as moedas de 1 e 2 euros têm níquel.',
    pl: 'Moneta: w monetach 1 i 2 euro jest nikiel.',
    de: 'Die Münze: In den 1- und 2-Euro-Münzen steckt Nickel.',
  },
  sunscreen: {
    en: "The sun cream: zinc oxide in it blocks the sun's rays.",
    'pt-pt': 'O protetor solar: o óxido de zinco que tem bloqueia os raios do sol.',
    pl: 'Krem z filtrem: tlenek cynku, który zawiera, blokuje promienie słońca.',
    de: 'Die Sonnencreme: Das Zinkoxid darin blockiert die Sonnenstrahlen.',
  },
  melt: {
    en: 'The melting spoon: gallium melts at about 30 °C, so a gallium spoon droops in a cup of warm tea (and melts in your hand).',
    'pt-pt': 'A colher a derreter: o gálio funde a cerca de 30 °C, por isso uma colher de gálio derrete numa chávena de chá quente (e na tua mão).',
    pl: 'Topniejąca łyżeczka: gal topi się w temperaturze około 30 °C, więc łyżeczka z galu wygina się w kubku ciepłej herbaty (i topi się w twojej dłoni).',
    de: 'Der schmelzende Löffel: Gallium schmilzt bei etwa 30 °C, deshalb sackt ein Galliumlöffel in einer Tasse warmem Tee zusammen (und schmilzt in deiner Hand).',
  },
  'flag-de': {
    en: 'The flag: germanium is named after Germany, the homeland of Clemens Winkler, who found it.',
    'pt-pt': 'A bandeira: o germânio tem o nome da Alemanha, a terra de Clemens Winkler, que o descobriu.',
    pl: 'Flaga: nazwa germanu pochodzi od Niemiec, ojczyzny Clemensa Winklera, który go odkrył.',
    de: 'Die Flagge: Germanium ist nach Deutschland benannt, der Heimat von Clemens Winkler, der es entdeckt hat.',
  },
  moon: {
    en: 'The Moon: selenium is named after Selene, the Moon (its neighbour tellurium is named after the Earth).',
    'pt-pt': 'A Lua: o selénio tem o nome de Selene, a Lua (o vizinho telúrio tem o nome da Terra).',
    pl: 'Księżyc: nazwa selenu pochodzi od Selene, Księżyca (nazwa jego sąsiada, telluru, pochodzi od Ziemi).',
    de: 'Der Mond: Selen ist nach Selene benannt, dem Mond (sein Nachbar Tellur ist nach der Erde benannt).',
  },
  earth: {
    en: 'The Earth: tellurium is named after Tellus, the Earth.',
    'pt-pt': 'A Terra: o telúrio tem o nome de Tellus, a Terra.',
    pl: 'Ziemia: nazwa telluru pochodzi od Tellus, Ziemi.',
    de: 'Die Erde: Tellur ist nach Tellus benannt, der Erde.',
  },
  magnifier: {
    en: "The magnifying glass: krypton means 'the hidden one': it hid in the air until 1898.",
    'pt-pt': "A lupa: crípton quer dizer 'o escondido': esteve escondido no ar até 1898.",
    pl: 'Lupa: krypton znaczy „ukryty”: chował się w powietrzu aż do 1898 roku.',
    de: 'Die Lupe: Krypton bedeutet „das Verborgene“: Es versteckte sich bis 1898 in der Luft.',
  },
  glowstar: {
    en: 'The glow-in-the-dark star: it glows thanks to strontium aluminate.',
    'pt-pt': 'A estrela que brilha no escuro: brilha graças ao aluminato de estrôncio.',
    pl: 'Gwiazdka świecąca w ciemności: świeci dzięki glinianowi strontu.',
    de: 'Der Leuchtstern: Er leuchtet im Dunkeln dank Strontiumaluminat.',
  },
  firework: {
    en: 'The green firework: barium gives fireworks their green.',
    'pt-pt': 'O fogo de artifício verde: o bário dá o verde ao fogo de artifício.',
    pl: 'Zielone fajerwerki: bar nadaje fajerwerkom zielony kolor.',
    de: 'Das grüne Feuerwerk: Barium gibt Feuerwerk sein Grün.',
  },
  rose: {
    en: "The rose: rhodium's name means 'rose', for the colour of its salts.",
    'pt-pt': "A rosa: ródio quer dizer 'rosa', pela cor dos seus sais.",
    pl: 'Róża: nazwa rodu znaczy „róża”, od koloru jego soli.',
    de: 'Die Rose: Der Name Rhodium bedeutet „Rose“, wegen der Farbe seiner Salze.',
  },
  car: {
    en: 'The car: the palladium in catalytic converters cleans the fumes of cars.',
    'pt-pt': 'O carro: o paládio dos catalisadores limpa os fumos dos carros.',
    pl: 'Samochód: pallad w katalizatorach oczyszcza spaliny samochodów.',
    de: 'Das Auto: Das Palladium in Katalysatoren reinigt die Abgase von Autos.',
  },
  medal: {
    en: 'The medal: Olympic silver medals are made of silver (and gold medals are silver covered in gold).',
    'pt-pt': 'A medalha: as medalhas de prata olímpicas são de prata (e as de ouro são de prata coberta de ouro).',
    pl: 'Medal: olimpijskie srebrne medale są ze srebra (a złote to srebro pokryte złotem).',
    de: 'Die Medaille: Olympische Silbermedaillen sind aus Silber (und Goldmedaillen sind Silber, mit Gold überzogen).',
  },
  phone: {
    en: 'The phone: touchscreens have a see-through layer of indium tin oxide that feels your finger.',
    'pt-pt': 'O telemóvel: os ecrãs táteis têm uma camada transparente de óxido de índio e estanho que sente o teu dedo.',
    pl: 'Telefon: ekrany dotykowe mają przezroczystą warstwę tlenku indu i cyny, która czuje twój palec.',
    de: 'Das Handy: Touchscreens haben eine durchsichtige Schicht aus Indiumzinnoxid, die deinen Finger spürt.',
  },
  soldier: {
    en: 'The toy soldier: tin melts easily (232 °C), so toy soldiers were cast from it.',
    'pt-pt': 'O soldadinho: o estanho funde com facilidade (232 °C), por isso faziam-se soldadinhos de brinquedo de estanho (e de chumbo).',
    pl: 'Żołnierzyk: cyna łatwo się topi (232 °C), dlatego odlewano z niej żołnierzyki.',
    de: 'Der Zinnsoldat: Zinn schmilzt leicht (232 °C), deshalb goss man daraus Spielzeugsoldaten.',
  },
  flask: {
    en: "The flask: warm iodine turns into a violet vapour; its name means 'violet'.",
    'pt-pt': "O frasco: o iodo aquecido liberta um vapor violeta; o nome quer dizer 'violeta'.",
    pl: 'Kolba: ogrzany jod zamienia się w fioletową parę; jego nazwa znaczy „fioletowy”.',
    de: 'Der Kolben: Warmes Iod wird zu violettem Dampf; sein Name bedeutet „violett“.',
  },
  probe: {
    en: 'The space probe: xenon ion engines push probes like Dawn through space, glowing blue.',
    'pt-pt': 'A sonda espacial: os motores iónicos de xénon empurram sondas como a Dawn pelo espaço, com um brilho azul.',
    pl: 'Sonda kosmiczna: ksenonowe silniki jonowe pchają sondy takie jak Dawn przez kosmos, świecąc na niebiesko.',
    de: 'Die Raumsonde: Xenon-Ionentriebwerke schieben Sonden wie Dawn durchs All und leuchten dabei blau.',
  },
  clock: {
    en: 'The clock: the second is defined by caesium atoms, in atomic clocks.',
    'pt-pt': 'O relógio: o segundo é definido pelos átomos de césio, nos relógios atómicos.',
    pl: 'Zegar: sekundę wyznaczają atomy cezu, w zegarach atomowych.',
    de: 'Die Uhr: Die Sekunde ist durch Caesiumatome festgelegt, in Atomuhren.',
  },
  dumbbell: {
    en: 'The dumbbell: osmium is the densest element: a litre of it weighs 22.6 kg.',
    'pt-pt': 'O haltere: o ósmio é o elemento mais denso: um litro pesa 22,6 kg.',
    pl: 'Hantla: osm to pierwiastek o największej gęstości: litr osmu waży 22,6 kg.',
    de: 'Die Hantel: Osmium ist das dichteste Element: Ein Liter davon wiegt 22,6 kg.',
  },
  asteroid: {
    en: 'The asteroid: a layer of iridium all over the Earth shows the asteroid that ended the dinosaurs, 66 million years ago.',
    'pt-pt': 'O asteroide: uma camada de irídio em toda a Terra mostra o asteroide que acabou com os dinossauros, há 66 milhões de anos.',
    pl: 'Asteroida: warstwa irydu na całej Ziemi zdradza asteroidę, która 66 milionów lat temu zakończyła czasy dinozaurów.',
    de: 'Der Asteroid: Eine Iridiumschicht überall auf der Erde zeigt den Asteroiden, der vor 66 Millionen Jahren das Ende der Dinosaurier brachte.',
  },
  ring: {
    en: 'The ring: platinum is a precious white metal for rings and jewels.',
    'pt-pt': 'O anel: a platina é um metal precioso e branco para anéis e joias.',
    pl: 'Pierścionek: platyna to szlachetny biały metal na pierścionki i biżuterię.',
    de: 'Der Ring: Platin ist ein kostbares weißes Metall für Ringe und Schmuck.',
  },
  thermometer: {
    en: 'The thermometer: old thermometers held mercury, the metal that is liquid at room temperature.',
    'pt-pt': 'O termómetro: os termómetros antigos tinham mercúrio, o metal que é líquido à temperatura ambiente.',
    pl: 'Termometr: w dawnych termometrach była rtęć, metal, który w temperaturze pokojowej jest cieczą.',
    de: 'Das Thermometer: Alte Thermometer enthielten Quecksilber, das Metall, das bei Zimmertemperatur flüssig ist.',
  },
  fishing: {
    en: "The fishing weight: sinkers are lead, soft and heavy (in Portuguese a sinker is a 'chumbada', from chumbo, lead).",
    'pt-pt': 'A chumbada: os pesos de pesca são de chumbo, mole e pesado (daí o nome).',
    pl: 'Ciężarek wędkarski: ciężarki są z ołowiu, miękkiego i ciężkiego (po portugalsku ciężarek to „chumbada”, od chumbo, ołów).',
    de: 'Das Angelblei: Angelgewichte sind aus Blei, weich und schwer (auf Portugiesisch heißt so ein Gewicht „chumbada“, von chumbo, Blei).',
  },
  crystal: {
    en: 'The rainbow crystal: bismuth grows crystals shaped like little staircases, with a rainbow skin.',
    'pt-pt': 'O cristal arco-íris: o bismuto forma cristais em forma de escadinhas, com uma pele de arco-íris.',
    pl: 'Tęczowy kryształ: bizmut tworzy kryształy w kształcie małych schodków, z tęczową skórką.',
    de: 'Der Regenbogenkristall: Bismut bildet Kristalle wie kleine Treppen, mit einer Regenbogenhaut.',
  },
  'flag-pl': {
    en: 'The flag: Marie Curie named polonium after Poland, her homeland.',
    'pt-pt': 'A bandeira: Marie Curie deu ao polónio o nome da Polónia, a sua terra.',
    pl: 'Flaga: Maria Skłodowska-Curie nazwała polon od Polski, swojej ojczyzny.',
    de: 'Die Flagge: Marie Curie benannte Polonium nach Polen, ihrer Heimat.',
  },
  warning: {
    en: 'The warning sign: radon is a radioactive gas that seeps from the ground into cellars, so houses are tested for it.',
    'pt-pt': 'O sinal de aviso: o rádon é um gás radioativo que sai do chão e se junta nas caves, por isso as casas são testadas.',
    pl: 'Znak ostrzegawczy: radon to promieniotwórczy gaz, który przesącza się z ziemi do piwnic, dlatego bada się go w domach.',
    de: 'Das Warnschild: Radon ist ein radioaktives Gas, das aus dem Boden in Keller sickert, deshalb werden Häuser darauf geprüft.',
  },
  'flag-fr': {
    en: 'The flag: francium is named after France, where Marguerite Perey found it in 1939.',
    'pt-pt': 'A bandeira: o frâncio tem o nome da França, onde Marguerite Perey o descobriu em 1939.',
    pl: 'Flaga: nazwa fransu pochodzi od Francji, gdzie Marguerite Perey odkryła go w 1939 roku.',
    de: 'Die Flagge: Francium ist nach Frankreich benannt, wo Marguerite Perey es 1939 entdeckte.',
  },
  watch: {
    en: 'The watch: radium once made watch numbers glow in the dark, until people learnt it was harmful.',
    'pt-pt': 'O relógio de pulso: o rádio fazia brilhar os números dos relógios no escuro, até se perceber que fazia mal.',
    pl: 'Zegarek: rad kiedyś sprawiał, że cyfry zegarków świeciły w ciemności, dopóki ludzie nie odkryli, że szkodzi.',
    de: 'Die Armbanduhr: Radium ließ früher die Ziffern von Uhren im Dunkeln leuchten, bis man merkte, dass es schädlich ist.',
  },
  'flag-jp': {
    en: 'The flag: nihonium is named after Japan (Nihon), the first element found in Asia.',
    'pt-pt': 'A bandeira: o nihónio tem o nome do Japão (Nihon), o primeiro elemento descoberto na Ásia.',
    pl: 'Flaga: nazwa nihonu pochodzi od Japonii (Nihon); to pierwszy pierwiastek odkryty w Azji.',
    de: 'Die Flagge: Nihonium ist nach Japan (Nihon) benannt, das erste in Asien entdeckte Element.',
  },
  camera: {
    en: 'The camera: good camera lenses are made of lanthanum glass, which bends light strongly.',
    'pt-pt': 'A máquina fotográfica: as boas lentes são de vidro de lantânio, que desvia muito a luz.',
    pl: 'Aparat fotograficzny: dobre obiektywy robi się ze szkła lantanowego, które mocno załamuje światło.',
    de: 'Die Kamera: Gute Kameraobjektive sind aus Lanthanglas, das Licht stark bricht.',
  },
  sparks: {
    en: "The sparks: a lighter's 'flint' is cerium and iron, which spark when scratched.",
    'pt-pt': "As faíscas: a 'pedra' dos isqueiros é cério e ferro, que fazem faíscas quando raspados.",
    pl: 'Iskry: „kamień” w zapalniczce to cer i żelazo, które sypią iskrami, gdy się je potrze.',
    de: 'Die Funken: Der „Feuerstein“ eines Feuerzeugs ist Cer und Eisen, die beim Reiben Funken sprühen.',
  },
  headphones: {
    en: 'The headphones: their tiny, strong magnets are made with neodymium.',
    'pt-pt': 'Os auscultadores: os ímanes pequenos e fortes deles são feitos com neodímio.',
    pl: 'Słuchawki: ich malutkie, silne magnesy robi się z neodymem.',
    de: 'Die Kopfhörer: Ihre winzigen, starken Magnete werden mit Neodym gemacht.',
  },
  torch: {
    en: 'The torch: promethium is named after Prometheus, who stole fire from the gods (a Greek myth).',
    'pt-pt': 'A tocha: o promécio tem o nome de Prometeu, que roubou o fogo aos deuses (um mito grego).',
    pl: 'Pochodnia: nazwa prometu pochodzi od Prometeusza, który ukradł bogom ogień (to grecki mit).',
    de: 'Die Fackel: Promethium ist nach Prometheus benannt, der den Göttern das Feuer stahl (eine griechische Sage).',
  },
  banknote: {
    en: 'The banknote: euro notes hide marks that glow under ultraviolet light, to catch fakes, and europium makes the red glow.',
    'pt-pt': 'A nota: as notas de euro escondem marcas que brilham com luz ultravioleta, para apanhar as falsas, e o európio faz o brilho vermelho.',
    pl: 'Banknot: banknoty euro kryją znaki, które świecą w świetle ultrafioletowym, żeby wykrywać podróbki, a europ daje czerwone świecenie.',
    de: 'Der Geldschein: Euroscheine verstecken Zeichen, die unter ultraviolettem Licht leuchten, um Fälschungen zu entlarven, und Europium macht das rote Leuchten.',
  },
  hammer: {
    en: 'The hammer: thorium is named after Thor, the Norse god of thunder.',
    'pt-pt': 'O martelo: o tório tem o nome de Thor, o deus nórdico do trovão.',
    pl: 'Młot: nazwa toru pochodzi od Thora, nordyckiego boga grzmotu.',
    de: 'Der Hammer: Thorium ist nach Thor benannt, dem nordischen Gott des Donners.',
  },
  uranus: {
    en: 'The planet Uranus: uranium is named after it, found eight years before; today uranium fuels nuclear power stations.',
    'pt-pt': 'O planeta Úrano: o urânio tem o nome dele, descoberto oito anos antes; hoje o urânio alimenta as centrais nucleares.',
    pl: 'Planeta Uran: od niej, odkrytej osiem lat wcześniej, pochodzi nazwa uranu; dziś uran jest paliwem elektrowni jądrowych.',
    de: 'Der Planet Uranus: Uran ist nach ihm benannt, er wurde acht Jahre vorher entdeckt; heute ist Uran der Brennstoff von Kernkraftwerken.',
  },
  neptune: {
    en: 'The planet Neptune: neptunium comes after uranium, as Neptune comes after Uranus.',
    'pt-pt': 'O planeta Neptuno: o neptúnio vem depois do urânio, como Neptuno vem depois de Úrano.',
    pl: 'Planeta Neptun: pierwiastek neptun jest zaraz po uranie, tak jak planeta Neptun po Uranie.',
    de: 'Der Planet Neptun: Neptunium kommt nach Uran, wie Neptun nach Uranus kommt.',
  },
  pluto: {
    en: 'Pluto and its heart: plutonium is named after it, and plutonium powers space probes like New Horizons, which flew past Pluto in 2015.',
    'pt-pt': 'Plutão e o seu coração: o plutónio tem o nome dele, e o plutónio dá energia a sondas como a New Horizons, que passou por Plutão em 2015.',
    pl: 'Pluton i jego serce: od niego pochodzi nazwa pierwiastka pluton, a pluton zasila sondy kosmiczne takie jak New Horizons, która w 2015 roku przeleciała obok Plutona.',
    de: 'Pluto und sein Herz: Plutonium ist nach ihm benannt, und Plutonium liefert die Energie für Raumsonden wie New Horizons, die 2015 an Pluto vorbeiflog.',
  },
  smoke: {
    en: 'The smoke alarm: many smoke alarms hold a speck of americium.',
    'pt-pt': 'O detetor de fumo: muitos detetores de fumo têm um grãozinho de amerício.',
    pl: 'Czujnik dymu: w wielu czujnikach dymu jest drobinka ameryku.',
    de: 'Der Rauchmelder: Viele Rauchmelder enthalten ein Körnchen Americium.',
  },
  hair: {
    en: 'The wild white hair: einsteinium is named after Albert Einstein.',
    'pt-pt': 'O cabelo branco despenteado: o einsténio tem o nome de Albert Einstein.',
    pl: 'Rozczochrane siwe włosy: nazwa einsteinu pochodzi od Alberta Einsteina.',
    de: 'Die wilden weißen Haare: Einsteinium ist nach Albert Einstein benannt.',
  },
  table: {
    en: 'The little periodic table: mendelevium is named after Dmitri Mendeleev, who made the periodic table in 1869.',
    'pt-pt': 'A pequena tabela periódica: o mendelévio tem o nome de Dmitri Mendeleev, que fez a tabela periódica em 1869.',
    pl: 'Mały układ okresowy: nazwa mendelewu pochodzi od Dmitrija Mendelejewa, który w 1869 roku ułożył układ okresowy.',
    de: 'Das kleine Periodensystem: Mendelevium ist nach Dmitri Mendelejew benannt, der 1869 das Periodensystem aufstellte.',
  },
  goggles: {
    en: 'The goggles: glassblowers wear didymium glasses, praseodymium with neodymium, which block the dazzling yellow glow of hot glass.',
    'pt-pt': 'Os óculos de proteção: os sopradores de vidro usam óculos de didímio, praseodímio com neodímio, que tapam o brilho amarelo e ofuscante do vidro quente.',
    pl: 'Gogle: dmuchacze szkła noszą okulary z didymu, prazeodymu z neodymem, które zatrzymują oślepiający żółty blask gorącego szkła.',
    de: 'Die Schutzbrille: Glasbläser tragen Didymbrillen, Praseodym mit Neodym, die das grelle gelbe Leuchten von heißem Glas abhalten.',
  },
  turbine: {
    en: 'The wind turbine: a little dysprosium keeps the magnets in wind turbines and electric cars strong when they get hot.',
    'pt-pt': 'A turbina eólica: um pouco de disprósio mantém fortes os ímanes das turbinas eólicas e dos carros elétricos quando aquecem.',
    pl: 'Turbina wiatrowa: odrobina dysprozu sprawia, że magnesy w turbinach wiatrowych i samochodach elektrycznych pozostają silne, gdy się nagrzewają.',
    de: 'Das Windrad: Ein wenig Dysprosium hält die Magnete in Windrädern und Elektroautos stark, wenn sie heiß werden.',
  },
  'flag-se': {
    en: 'The flag: ytterbium is named after Ytterby, a village in Sweden that gave its name to four elements.',
    'pt-pt': 'A bandeira: o itérbio tem o nome de Ytterby, uma aldeia da Suécia que deu nome a quatro elementos.',
    pl: 'Flaga: nazwa iterbu pochodzi od Ytterby, wioski w Szwecji, która dała nazwę czterem pierwiastkom.',
    de: 'Die Flagge: Ytterbium ist nach Ytterby benannt, einem Dorf in Schweden, das vier Elementen seinen Namen gab.',
  },
  eiffel: {
    en: 'The Eiffel Tower: lutetium is named after Lutetia, the old Roman name of Paris.',
    'pt-pt': 'A Torre Eiffel: o lutécio tem o nome de Lutécia, o antigo nome romano de Paris.',
    pl: 'Wieża Eiffla: nazwa lutetu pochodzi od Lutecji, dawnej rzymskiej nazwy Paryża.',
    de: 'Der Eiffelturm: Lutetium ist nach Lutetia benannt, dem alten römischen Namen von Paris.',
  },
  rover: {
    en: 'The Mars rover: a speck of curium on Mars rovers helps them find out what the rocks of Mars are made of.',
    'pt-pt': 'O robô de Marte: um grãozinho de cúrio nos robôs de Marte ajuda-os a descobrir de que são feitas as rochas de Marte.',
    pl: 'Łazik marsjański: drobinka kiuru na łazikach pomaga im odkryć, z czego są zbudowane skały Marsa.',
    de: 'Der Marsrover: Ein Körnchen Curium auf Marsrovern hilft ihnen herauszufinden, woraus die Gesteine des Mars bestehen.',
  },
  nobel: {
    en: 'The gold medal: nobelium is named after Alfred Nobel, whose Nobel Prizes come with a gold medal.',
    'pt-pt': 'A medalha de ouro: o nobélio tem o nome de Alfred Nobel, cujos Prémios Nobel vêm com uma medalha de ouro.',
    pl: 'Złoty medal: nazwa nobla pochodzi od Alfreda Nobla, którego Nagrody Nobla wręcza się ze złotym medalem.',
    de: 'Die Goldmedaille: Nobelium ist nach Alfred Nobel benannt, zu dessen Nobelpreisen eine Goldmedaille gehört.',
  },
  sun: {
    en: 'The Sun and the Earth: copernicium is named after Nicolaus Copernicus, who said the Earth goes round the Sun.',
    'pt-pt': 'O Sol e a Terra: o copernício tem o nome de Nicolau Copérnico, que disse que a Terra anda à volta do Sol.',
    pl: 'Słońce i Ziemia: nazwa kopernika pochodzi od Mikołaja Kopernika, który powiedział, że Ziemia krąży wokół Słońca.',
    de: 'Die Sonne und die Erde: Copernicium ist nach Nikolaus Kopernikus benannt, der sagte, dass die Erde um die Sonne kreist.',
  },
}

const art = el => (el.symbol === 'Ag' || el.symbol === 'Pt' ? 'a' : 'o')
const byRadius = [...ELEMENTS].filter(e => e.radius.covalent != null).sort((a, b) => b.radius.covalent - a.radius.covalent)
const radiusRank = new Map(byRadius.map((e, i) => [e.z, i + 1]))

const ordinal = n => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
// Polish counts: one (1), few (2-4, 22-24...), many (0, 5-21, 25...)
const PL_PLURAL = new Intl.PluralRules('pl')
const plN = (n, one, few, many) => ({ one, few }[PL_PLURAL.select(n)] ?? many)
const plOuter = n => plN(n, 'elektron zewnętrzny', 'elektrony zewnętrzne', 'elektronów zewnętrznych')
const deOuter = n => (n === 1 ? 'Außenelektron' : 'Außenelektronen')

const S = {
  en: {
    hands0: 'No hands: its outer shell is full, so it almost never bonds.',
    giving: n => `${n} hand${n > 1 ? 's' : ''} holding out ${n > 1 ? 'electrons' : 'an electron'}: a metal gives electrons away.`,
    hands: n => `${n} hand${n > 1 ? 's' : ''}: it usually makes ${n} bond${n > 1 ? 's' : ''}.`,
    hoop: (v, free, places) => `Its hoop: ${v} outer electron${v === 1 ? '' : 's'}, and ${free ? `${free} free place${free > 1 ? 's' : ''}` : 'no free place'} of ${places}.`,
    inHands: n => (n > 1 ? 'Its outer electrons are in its hands, ready to be given away.' : 'Its outer electron is in its hand, ready to be given away.'),
    hoopInner: v => `Its hoop: ${v} outer electron${v === 1 ? '' : 's'}; the others hide in inner shells.`,
    size: (h, r, rank, of) => rank <= of / 2
      ? `${h} m tall: its atomic radius is ${r} pm, the ${rank > 1 ? `${ordinal(rank)} ` : ''}largest of ${of}.`
      : `${h} m tall: its atomic radius is ${r} pm, the ${of + 1 - rank > 1 ? `${ordinal(of + 1 - rank)} ` : ''}smallest of ${of}.`,
    walk: 'It walks: at 20 °C it is a solid.',
    slide: 'It slides: at 20 °C it is a liquid.',
    floatHigh: 'It floats high: a gas lighter than air.',
    floatLow: 'It floats low: a gas heavier than air.',
    metal: 'A shiny metal body: it is a metal.',
    nonmetal: 'A see-through body with its nucleus inside: a non-metal.',
    metalloid: 'Half metal, half not: a metalloid.',
    noble: 'A glowing see-through body: a noble gas.',
    marks: {
      flame: 'The flame: alkali metals react wildly, even with water.',
      nubs: 'Two nubs: an alkaline earth metal.',
      helmet: "A smith's helmet: a transition metal.",
      cap: 'A cap: a post-transition metal, softer than its neighbours.',
      antenna: 'An antenna: a metalloid, between the metals and the non-metals.',
      crest: 'Spikes: a halogen, always grabbing one more electron.',
      halo: 'A halo: a noble gas, complete and calm.',
      gem: 'A gem: a lanthanide or an actinide.',
      curl: 'One curl: hydrogen, the simplest atom of all.',
    },
    // the flame-test colours' names (look.js FLAME)
    flameName: { Li: 'crimson', Na: 'yellow-orange', K: 'lilac', Rb: 'red-violet', Cs: 'blue-violet', Ca: 'orange-red', Sr: 'crimson', Ba: 'apple green', Ra: 'crimson' },
    flame: (c, el) => `It glows ${c}: the colour ${nameOf(el, 'en').toLowerCase()} gives a flame.`,
    shape: {
      round: 'a round helmet', crest: 'a crest', horns: 'two horns', visor: 'a visor', spike: 'a spike', plume: 'a plume',
      bolts: 'two bolts', band: 'a band', coin: 'a coin', drop: 'a drop',
    },
    helmet: (shape, group) => `On its helmet, ${shape}: the mark of group ${group}, worn by its whole column.`,
    radioactive: 'Its glow: it is radioactive.',
    superheavy: 'It flickers: only a few atoms of it have ever been made.',
  },
  'pt-pt': {
    hands0: 'Sem mãos: a camada de fora está cheia, por isso quase nunca faz ligações.',
    giving: n => `${n} ${n > 1 ? 'mãos a estender eletrões' : 'mão a estender um eletrão'}: um metal dá eletrões.`,
    hands: n => `${n} ${n > 1 ? 'mãos' : 'mão'}: costuma fazer ${n} ${n > 1 ? 'ligações' : 'ligação'}.`,
    hoop: (v, free, places) => `O arco: ${v} ${v === 1 ? 'eletrão' : 'eletrões'} de fora e ${free ? `${free} ${free > 1 ? 'lugares livres' : 'lugar livre'}` : 'nenhum lugar livre'} em ${places}.`,
    inHands: n => (n > 1 ? 'Os eletrões de fora estão nas mãos, prontos a ser dados.' : 'O eletrão de fora está na mão, pronto a ser dado.'),
    hoopInner: v => `O arco: ${v} ${v === 1 ? 'eletrão' : 'eletrões'} de fora; os outros escondem-se nas camadas de dentro.`,
    size: (h, r, rank, of) => rank <= of / 2
      ? `${h} m de altura: o raio atómico é ${r} pm, o ${rank > 1 ? `${rank}.º ` : ''}maior de ${of}.`
      : `${h} m de altura: o raio atómico é ${r} pm, o ${of + 1 - rank > 1 ? `${of + 1 - rank}.º ` : ''}mais pequeno de ${of}.`,
    walk: 'Anda: a 20 °C é sólido.',
    slide: 'Desliza: a 20 °C é líquido.',
    floatHigh: 'Flutua alto: um gás mais leve do que o ar.',
    floatLow: 'Flutua baixo: um gás mais pesado do que o ar.',
    metal: 'Um corpo de metal brilhante: é um metal.',
    nonmetal: 'Um corpo transparente com o núcleo lá dentro: um não metal.',
    metalloid: 'Metade metal, metade não: um semimetal.',
    noble: 'Um corpo transparente que brilha: um gás nobre.',
    marks: {
      flame: 'A chama: os metais alcalinos reagem com força, até com a água.',
      nubs: 'Duas bolinhas: um metal alcalinoterroso.',
      helmet: 'Um capacete de ferreiro: um metal de transição.',
      cap: 'Um gorro: um metal pós-transição, mais mole do que os vizinhos.',
      antenna: 'Uma antena: um semimetal, entre os metais e os não metais.',
      crest: 'Espinhos: um halogéneo, sempre a agarrar mais um eletrão.',
      halo: 'Um halo: um gás nobre, completo e tranquilo.',
      gem: 'Uma pedra preciosa: um lantanídeo ou um actinídeo.',
      curl: 'Um caracol: o hidrogénio, o átomo mais simples de todos.',
    },
    flameName: { Li: 'carmesim', Na: 'amarelo-alaranjado', K: 'lilás', Rb: 'vermelho-violeta', Cs: 'azul-violeta', Ca: 'vermelho-alaranjado', Sr: 'carmesim', Ba: 'verde-maçã', Ra: 'carmesim' },
    flame: (c, el) => `Brilha ${c}: a cor que ${art(el)} ${nameOf(el, 'pt-pt').toLowerCase()} dá a uma chama.`,
    shape: {
      round: 'um capacete redondo', crest: 'uma crista', horns: 'dois chifres', visor: 'uma viseira', spike: 'um espigão', plume: 'um penacho',
      bolts: 'dois parafusos', band: 'um aro', coin: 'uma moeda', drop: 'uma gota',
    },
    helmet: (shape, group) => `No capacete, ${shape}: a marca do grupo ${group}, que toda a coluna usa.`,
    radioactive: 'O brilho: é radioativo.',
    superheavy: 'Pisca: só se fizeram alguns átomos dele.',
  },
  // Polish: no possessive pronouns (an element may be masculine, feminine or neuter: tlen, siarka, złoto)
  pl: {
    hands0: 'Bez rąk: zewnętrzna powłoka jest pełna, więc prawie nigdy nie tworzy wiązań.',
    giving: n => `${n} ${plN(n, 'ręka podaje', 'ręce podają', 'rąk podaje')} ${n > 1 ? 'elektrony' : 'elektron'}: metal oddaje elektrony.`,
    hands: n => `${n} ${plN(n, 'ręka', 'ręce', 'rąk')}: zwykle tworzy ${n} ${plN(n, 'wiązanie', 'wiązania', 'wiązań')}.`,
    hoop: (v, free, places) => `Obręcz: ${v} ${plOuter(v)} i ${free ? `${free} ${plN(free, 'wolne miejsce', 'wolne miejsca', 'wolnych miejsc')}` : 'zero wolnych miejsc'} na ${places}.`,
    inHands: n => (n > 1 ? 'Elektrony zewnętrzne są w rękach, gotowe do oddania.' : 'Elektron zewnętrzny jest w ręce, gotowy do oddania.'),
    hoopInner: v => `Obręcz: ${v} ${plOuter(v)}; pozostałe chowają się w wewnętrznych powłokach.`,
    size: (h, r, rank, of) => rank <= of / 2
      ? `${h} m wzrostu: promień atomowy wynosi ${r} pm, ${rank > 1 ? `${rank}. ` : ''}największy z ${of}.`
      : `${h} m wzrostu: promień atomowy wynosi ${r} pm, ${of + 1 - rank > 1 ? `${of + 1 - rank}. ` : ''}najmniejszy z ${of}.`,
    walk: 'Chodzi: w temperaturze 20 °C jest ciałem stałym.',
    slide: 'Ślizga się: w temperaturze 20 °C jest cieczą.',
    floatHigh: 'Unosi się wysoko: to gaz lżejszy od powietrza.',
    floatLow: 'Unosi się nisko: to gaz cięższy od powietrza.',
    metal: 'Błyszczące metalowe ciało: to metal.',
    nonmetal: 'Przezroczyste ciało z jądrem w środku: niemetal.',
    metalloid: 'Pół metal, pół nie: półmetal.',
    noble: 'Świecące przezroczyste ciało: gaz szlachetny.',
    marks: {
      flame: 'Płomień: metale alkaliczne reagują gwałtownie, nawet z wodą.',
      nubs: 'Dwie kuleczki: metal ziem alkalicznych.',
      helmet: 'Hełm kowala: metal przejściowy.',
      cap: 'Czapka: metal bloku p, bardziej miękki od sąsiadów.',
      antenna: 'Antena: półmetal, między metalami a niemetalami.',
      crest: 'Kolce: halogen, który zawsze łapie jeszcze jeden elektron.',
      halo: 'Aureola: gaz szlachetny, kompletny i spokojny.',
      gem: 'Klejnot: lantanowiec albo aktynowiec.',
      curl: 'Jeden loczek: wodór, najprostszy atom ze wszystkich.',
    },
    // in the instrumental, agreeing with "kolorem"
    flameName: { Li: 'karminowym', Na: 'żółtopomarańczowym', K: 'liliowym', Rb: 'czerwonofioletowym', Cs: 'niebieskofioletowym', Ca: 'pomarańczowoczerwonym', Sr: 'karminowym', Ba: 'jasnozielonym', Ra: 'karminowym' },
    flame: (c, el) => `Świeci kolorem ${c}: na taki kolor ${nameOf(el, 'pl').toLowerCase()} barwi płomień.`,
    // the whole helmet, its adjective agreeing with "hełm"
    shape: {
      round: 'Okrągły hełm', crest: 'Hełm z grzebieniem', horns: 'Hełm z dwoma rogami', visor: 'Hełm z daszkiem', spike: 'Hełm z kolcem',
      plume: 'Hełm z pióropuszem', bolts: 'Hełm z dwiema śrubami', band: 'Hełm z obręczą', coin: 'Hełm z monetą', drop: 'Hełm z kroplą',
    },
    helmet: (shape, group) => `${shape}: znak grupy ${group}; nosi go cała kolumna.`,
    radioactive: 'Blask: to pierwiastek promieniotwórczy.',
    superheavy: 'Migocze: wytworzono dotąd tylko kilka atomów tego pierwiastka.',
  },
  // German: no "es" or "sein" for the element (der Sauerstoff, das Helium, and the Atomling is der Atomling)
  de: {
    hands0: 'Keine Hände: Die äußere Schale ist voll, deshalb geht dieses Element fast nie Bindungen ein.',
    giving: n => `${n} ${n > 1 ? 'Hände halten Elektronen' : 'Hand hält ein Elektron'} hin: Ein Metall gibt Elektronen ab.`,
    hands: n => `${n} ${n > 1 ? 'Hände' : 'Hand'}: Meist ${n > 1 ? `entstehen ${n} Bindungen` : `entsteht ${n} Bindung`}.`,
    hoop: (v, free, places) => `Der Reifen: ${v} ${deOuter(v)} und ${free ? `${free} ${free > 1 ? 'freie Plätze' : 'freier Platz'}` : 'kein freier Platz'} von ${places}.`,
    inHands: n => (n > 1 ? 'Die Außenelektronen sind in den Händen, bereit zum Abgeben.' : 'Das Außenelektron ist in der Hand, bereit zum Abgeben.'),
    hoopInner: v => `Der Reifen: ${v} ${deOuter(v)}; die anderen verstecken sich in inneren Schalen.`,
    size: (h, r, rank, of) => rank <= of / 2
      ? `${h} m groß: Der Atomradius beträgt ${r} pm, der ${rank > 1 ? `${rank}.-` : ''}größte von ${of}.`
      : `${h} m groß: Der Atomradius beträgt ${r} pm, der ${of + 1 - rank > 1 ? `${of + 1 - rank}.-` : ''}kleinste von ${of}.`,
    walk: 'Läuft: bei 20 °C ein Feststoff.',
    slide: 'Gleitet: bei 20 °C eine Flüssigkeit.',
    floatHigh: 'Schwebt hoch: ein Gas, leichter als Luft.',
    floatLow: 'Schwebt tief: ein Gas, schwerer als Luft.',
    metal: 'Ein glänzender Metallkörper: ein Metall.',
    nonmetal: 'Ein durchsichtiger Körper mit dem Kern darin: ein Nichtmetall.',
    metalloid: 'Halb Metall, halb nicht: ein Halbmetall.',
    noble: 'Ein leuchtender, durchsichtiger Körper: ein Edelgas.',
    marks: {
      flame: 'Die Flamme: Alkalimetalle reagieren heftig, sogar mit Wasser.',
      nubs: 'Zwei Kügelchen: ein Erdalkalimetall.',
      helmet: 'Ein Schmiedehelm: ein Übergangsmetall.',
      cap: 'Eine Mütze: ein Metall des p-Blocks, weicher als seine Nachbarn.',
      antenna: 'Eine Antenne: ein Halbmetall, zwischen den Metallen und den Nichtmetallen.',
      crest: 'Stacheln: ein Halogen, das immer noch ein Elektron mehr schnappt.',
      halo: 'Ein Heiligenschein: ein Edelgas, vollständig und ruhig.',
      gem: 'Ein Edelstein: ein Lanthanoid oder ein Actinoid.',
      curl: 'Eine Locke: Wasserstoff, das einfachste Atom von allen.',
    },
    flameName: { Li: 'karminrot', Na: 'gelborange', K: 'lila', Rb: 'rotviolett', Cs: 'blauviolett', Ca: 'orangerot', Sr: 'karminrot', Ba: 'apfelgrün', Ra: 'karminrot' },
    flame: (c, el) => `Leuchtet ${c}: So färbt ${nameOf(el, 'de')} eine Flamme.`,
    // the whole helmet
    shape: {
      round: 'Ein runder Helm', crest: 'Ein Helm mit einem Kamm', horns: 'Ein Helm mit zwei Hörnern', visor: 'Ein Helm mit einem Schirm',
      spike: 'Ein Helm mit einer Spitze', plume: 'Ein Helm mit einem Federbusch', bolts: 'Ein Helm mit zwei Schrauben',
      band: 'Ein Helm mit einem Reif', coin: 'Ein Helm mit einer Münze', drop: 'Ein Helm mit einem Tropfen',
    },
    helmet: (shape, group) => `${shape}: das Zeichen der Gruppe ${group}, das die ganze Spalte trägt.`,
    radioactive: 'Das Leuchten: radioaktiv.',
    superheavy: 'Flackert: Davon wurden bisher nur wenige Atome hergestellt.',
  },
}

/** The sentences that read an Atomling, in order: hands, hoop, size, movement, body, mark, glow. */
export function explain(el, lang) {
  const L = S[lang] ?? S.en
  const tr = traitsOf(el)
  const out = []
  out.push(tr.hands === 0 ? L.hands0 : tr.giving ? L.giving(tr.hands) : L.hands(tr.hands))
  if (tr.electronsInHands) out.push(L.inHands(tr.valence))
  else if (tr.places) out.push(L.hoop(tr.valence, tr.places - tr.valence, tr.places))
  else out.push(L.hoopInner(tr.valence))
  const h = tr.height.toFixed(2).replace('.', decimalOf(lang))
  out.push(L.size(h, el.radius.covalent, radiusRank.get(el.z), byRadius.length))
  out.push(tr.locomotion === 'walk' ? L.walk : tr.locomotion === 'slide' ? L.slide : tr.hover > 0.5 ? L.floatHigh : L.floatLow)
  out.push(L[tr.material])
  const replaced = tr.mark === 'helmet' && TAKES_HEAD.has(SIGNATURE[el.symbol])
  if (tr.mark && L.marks[tr.mark] && !replaced) out.push(L.marks[tr.mark])
  if (L.flameName[el.symbol] && (tr.mark === 'flame' || tr.mark === 'nubs')) out.push(L.flame(L.flameName[el.symbol], el))
  if (tr.mark === 'helmet' && HELMET[el.group] && !replaced) out.push(L.helmet(L.shape[HELMET[el.group]], el.group))
  const sig = SIG[SIGNATURE[el.symbol]]
  if (sig) out.push(sig[lang] ?? sig.en)
  if (tr.superheavy) out.push(L.superheavy)
  else if (tr.radioactive) out.push(L.radioactive)
  return out
}
