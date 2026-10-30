// The words of sodium's salt room ("Why is the sea salty?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Na.js
// (the easel shows it); the room shows it happening and adds to it. Sources for Aveiro: M. da Maia
// Alcoforado, "As marinhas de Portugal: marinhas de Aveiro" (1877; the compartments, the Baumé degrees,
// codejo, the tools ugalho and rasoila, the heaps on the eiras covered with rushes, the daily stirring of
// the surface crust); the will of Countess Mumadona Dias (959). Seawater: the reference composition per
// kilogram; crust and sea abundances as src/data/elements.json has them (CRC).
export const SALT_WORDS = {
  en: {
    title: 'The salt pans of Aveiro',
    greet: {
      kid: 'We are inside the picture: the salt pans of Aveiro, in Portugal! Feel the sun and the wind? Here they turn seawater into salt. The picture\'s story is on the easel beside you.',
      sci: 'Aveiro\'s salinas on a hot, windy afternoon: shallow clay pans filled from the lagoon, where sun and wind evaporate seawater until sodium chloride crystallises. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'The water in these pans comes from the lagoon, the Ria de Aveiro, and the lagoon gets it from the sea, through a gap in the sand dunes.',
        'See the long boat with the painted front? It is a moliceiro. It was made for gathering moliço, the water plants of the lagoon, which farmers spread on their fields.',
        'Pink birds sometimes wade in salt pans like these: flamingos! They eat tiny shrimp that live in water much saltier than the sea.',
      ],
      sci: [
        'The Ria de Aveiro is a lagoon behind a long barrier of dunes, open to the Atlantic at the barra. In 1877 the marnotos let water in only at the top of the spring tides, every 15 days, when it came in fastest and saltiest.',
        'The moliceiro, about 15 m long and 2.5 m wide, has a low side for loading moliço (submerged lagoon plants, once the region\'s fertiliser) and four painted panels, two at the bow and two at the stern. Today it mostly carries visitors.',
        'Flamingos feed in salinas on brine shrimp (Artemia), which thrive at several times the salinity of the sea; their pink comes from carotenoids in their food.',
      ],
    },
    sea: {
      label: 'Where the salt comes from',
      title: 'How the sea got its salt',
      meter: { title: 'Salt in the sea', unit: 'grams in every kilogram', today: 'today\'s sea', other: 'other salts' },
      hints: { cloud: 'Tap the cloud to make it rain', volcano: 'Tap the volcano', empty: 'The cloud is empty: tap the sun', done: 'As salty as today: E to start again' },
      buttons: { cloud: 'Rain', volcano: 'Volcano', sun: 'Sun', again: 'A fresh sea' },
      says: {
        rain: { kid: 'Rain! It washes tiny bits out of the rocks: the violet ones are sodium. The river carries them down to the sea.', sci: 'Rain, made slightly acid by dissolved CO2, weathers feldspars such as albite (NaAlSi3O8) and frees Na+; rivers carry it to the sea along with Ca2+, Mg2+, K+ and bicarbonate.' },
        empty: { kid: 'The cloud has rained itself empty. Tap the sun: it lifts water from the sea back up into the sky.', sci: 'The cloud is spent: evaporation must lift more water from the sea first.' },
        volcano: { kid: 'The volcano breathes out gas with chlorine in it. Rain washes it down, and in the sea it becomes chloride: the green ones.', sci: 'Volcanic gases carry HCl; dissolved in rain and seawater it gives Cl−. Over Earth\'s history, outgassing supplied most of the ocean\'s chloride.' },
        sun: { kid: 'The sun warms the sea and lifts its water into the sky as invisible vapour. But salt cannot fly: it stays behind, and the sea gets a little saltier.', sci: 'Evaporation removes only H2O: the ions stay behind and the salinity rises. The vapour condenses into cloud and falls again as fresh water.' },
        full: { kid: 'The cloud is full of water now. Tap it and let it rain!', sci: 'The cloud holds all it can: let it rain.' },
        today: { kid: '35 grams of salt in every kilogram of water: as salty as today\'s sea! Now as much salt leaves the sea as comes in, so it stays about this salty.', sci: 'About 35 g/kg, today\'s mean salinity. Inputs and losses now balance: salt is buried as rock salt where shallow seas dry up and taken up by sea-floor sediments, so the salinity changes only very slowly.' },
        steady: { kid: 'More salt comes in, but just as much leaves: some is buried as rock salt where seas dry up. The sea stays about as salty.', sci: 'At steady state each new input is matched by burial in evaporites and sediments: the salinity holds near 35 g/kg.' },
        again: { kid: 'A fresh sea of rain water. Make it salty again!', sci: 'Reset: a freshwater ocean, 0 g/kg.' },
      },
      panel: {
        kid: [
          'Rain is very slightly sour: it has a little carbon dioxide in it. Over thousands of years it eats into rocks and washes out tiny bits of them, sodium among them. Rivers carry them to the sea, and the sea keeps them, because when the sun lifts water into the sky the salt stays behind. Volcanoes added the chlorine. Sodium and chloride together make the salt we eat.',
          'River water tastes fresh because it carries only a little salt, but the sea has been collecting it for billions of years. Today every kilogram of seawater holds about 35 grams of salts: a 10-litre bucket of it, about 360 grams.',
        ],
        sci: [
          'A kilogram of seawater holds about 35 g of dissolved salts: 19.4 g of chloride, 10.8 g of sodium, 2.7 g of sulfate, 1.3 g of magnesium and about 0.4 g each of calcium and potassium; Na+ and Cl− make up 86%. Weathering of silicate rocks such as albite feldspar supplies the sodium. But the crust holds about 160 times more sodium than chlorine (2.36% against 0.0145%), so most of the chloride must come from elsewhere: volcanic HCl, William Rubey\'s excess volatiles (1951).',
          'Edmond Halley proposed in 1715 that rivers bring the salt and evaporation keeps it, and that the sea\'s saltiness could date the Earth. John Joly tried it in 1899 with sodium and got less than 100 million years; the Earth is about 4.5 billion years old. The sea also loses salt, buried as evaporites, taken up by sediments and at hydrothermal vents, so inputs and losses nearly balance.',
        ],
      },
    },
    pans: {
      label: 'The salt pans',
      title: 'From seawater to salt',
      ponds: ['1  Reservoir', '2  Evaporating pond', '3  Crystallising pan'],
      board: { title: 'The brine', salt: 'Salt in the water', gone: 'Water gone', lime: 'Calcium carbonate', gypsum: 'Gypsum', halite: 'Sodium chloride', flor: 'Flor de sal' },
      slider: 'Sun and wind',
      weather: ['Calm and hazy', 'Sunny with a breeze', 'Hot and windy'],
      hints: {
        sea: 'Tap the sluice gate to let in seawater',
        gate2: 'Tap the next gate to move the brine on',
        gate3: 'Tap the last gate to move the brine on',
        wait: 'Sun and wind are drying it (E: the slider)',
        hot: 'Turn up the sun and wind (E) for flor de sal',
        skim: 'Tap the skimmer to gather the flor de sal',
        again: 'Tap the sluice gate for new seawater',
      },
      buttons: { sea: 'Let in seawater', next: 'Move the brine on', skim: 'Skim the flor de sal' },
      says: {
        sea: { kid: 'Splash! Seawater from the canal fills the reservoir. Mud and sand settle on the bottom.', sci: 'The sluice opens: seawater at about 35 g/kg (3 degrees Baumé) fills the viveiro, the reservoir, where silt and sand settle.' },
        gate2: { kid: 'On to the next pond! It is shallower, so the sun and the wind dry it faster.', sci: 'The brine moves on to a shallower pond: a thin layer evaporates faster. In 1877 Aveiro\'s pans held 20 cm of water at first and only a few centimetres near the end.' },
        gate3: { kid: 'Into the salt pan! The brine is so salty now that it can hardly hold any more salt.', sci: 'The brine reaches the crystalliser close to saturation, at about 25 degrees Baumé (density 1.21).' },
        lime: { kid: 'Half the water is gone, and the first thing comes out: a thin chalky film of calcium carbonate, the stuff of chalk and seashells.', sci: 'At about half the water evaporated, calcium carbonate (aragonite) precipitates: the least soluble of seawater\'s salts comes out first.' },
        gypsum: { kid: 'Four fifths of the water gone: now gypsum comes out, soft white crystals. Aveiro\'s marnotos called it codejo.', sci: 'At about four fifths evaporated, gypsum, CaSO4·2H2O, crystallises: the most plentiful deposit in the evaporating ponds, called codejo by the marnotos (1877).' },
        halite: { kid: 'Nine tenths of the water gone: salt! Little white cubes of sodium chloride grow on the bottom.', sci: 'At about nine tenths evaporated the brine is saturated in NaCl (about 26%) and halite crystallises in small cubes and hollow hopper crystals.' },
        flor: { kid: 'Hot sun and a dry wind: a thin crust of salt floats on top, like ice on a pond. It is flor de sal, the flower of salt! Tap the skimmer.', sci: 'On hot, dry days with a breeze the surface evaporates fastest and becomes supersaturated first: thin halite flakes form there and float on the surface tension until they sink. Skimmed off, they are flor de sal.' },
        skim: { kid: 'Gently does it: the skimmer lifts the flakes from the top without touching the bottom. Flor de sal is gathered by hand like this.', sci: 'Flor de sal is taken from the surface only, never from the clay floor; it is a small share of the harvest and sells for far more than coarse salt.' },
        noflor: { kid: 'Nothing to skim yet: flor de sal needs nearly saturated brine, strong sun and a dry wind.', sci: 'No crust: it forms only on brine near saturation, under strong evaporation.' },
        bitter: { kid: 'Stop here! If the very last water dried up too, bitter salts would come out and spoil the taste of the salt.', sci: 'Salt makers never let the brine dry out: the last of it is rich in magnesium and potassium salts, which would make the salt bitter.' },
        again: { kid: 'Fresh seawater in! The salt pans work all summer long, a little at a time.', sci: 'Production runs through the season: new water comes in at the spring tides while saturated brine keeps reaching the crystallisers.' },
        oneBatch: { kid: 'One batch at a time: move this brine on first.', sci: 'The ponds are in use: move the brine on first.' },
        noBrine: { kid: 'There is no brine waiting at this gate. Follow the water from the canal!', sci: 'No brine behind this gate.' },
      },
      panel: {
        kid: [
          'The marnotos let seawater in from the canal and move it from pond to pond, each one shallower than the last. The sun and the wind take the water away a little at a time, and what is left gets saltier and saltier.',
          'Not everything comes out at once. First a little chalky calcium carbonate, then gypsum, and only when about nine tenths of the water has gone, the salt we eat. On hot days with a dry wind a thin crust of salt floats on top: flor de sal, the flower of salt, skimmed off gently by hand.',
        ],
        sci: [
          'Seawater enters at about 3 degrees Baumé and is concentrated compartment by compartment: in Aveiro\'s own names the viveiro, then algibés, caldeiros, sobre-cabeceiras and more, down to the meios, where the salt crystallises at about 25 degrees Baumé. The salts come out in order of solubility, as Usiglio measured in 1849: calcium carbonate from about half the water gone, gypsum from about four fifths, sodium chloride from about nine tenths.',
          'Salt makers never let the brine dry out: the last of it is rich in magnesium and potassium salts, which would make the salt bitter. Flor de sal is the thin crust of halite that forms on the surface on hot, dry days. In 1877 Aveiro\'s marnotos stirred the brine every day to sink it, for small grains; today it is skimmed off and sold apart. A kilogram of seawater holds enough sodium for about 27 g of sodium chloride.',
        ],
      },
    },
    rake: {
      label: 'The marnoto\'s rake',
      title: 'Raking the salt',
      hints: { rake: 'Tap the rake to draw the salt', more: 'Tap the rake again: the heap grows' },
      buttons: { rake: 'Rake the salt' },
      says: {
        rake: { kid: 'Swish! The long wooden rake draws the salt to the side, onto the heap.', sci: 'The marnoto draws the crystals lightly over the pan floor, leaving a thin bed of salt, so that no clay comes up to grey it (Alcoforado, 1877).' },
        grow: { kid: 'The heap grows! Every tap is another rakeful of salt.', sci: 'In summer a crystalliser could be harvested every few days: in 1877 the first salt was ready about three days after the brine went in.' },
        full: { kid: 'That heap is done: a shining white pyramid, like the ones in the picture!', sci: 'Heaps stood on the eiras as cones or as long ridges called mulas; they were beaten smooth and covered with rushes, held down with turf, against the rain (1877).' },
        all: { kid: 'Three heaps! Long ago the salt was carried away in baskets on people\'s heads, to big heaps and wooden sheds. Let\'s start again.', sci: 'The salt went in baskets carried on the head to the heaps, and on to wooden storehouses, the palheiros. A new heap begins.' },
      },
      panel: {
        kid: [
          'The salt workers of Aveiro are called marnotos. From spring to the end of summer they look after their salt pans: they let the water in, move it on from pond to pond, and when the salt has grown they draw it out with a long wooden rake and pile it into shining white heaps to drain and dry.',
          'It is very old work: Aveiro\'s salt pans are named in a document from the year 959, more than a thousand years ago. Back then salt was precious: it kept fish and meat from going bad, long before there were fridges.',
        ],
        sci: [
          'In the crystallisers (the meios) the marnoto first pushes the salt into a ridge and then draws it to the side; Alcoforado, in 1877, named the tools ugalho and rasoila. A light hand leaves a thin bed of salt on the floor, so no clay comes up with it. The salt drains for a few hours, then is carried to the heaps on the eiras.',
          'The oldest known mention of Aveiro, the will of Countess Mumadona Dias of 959, already names its salt pans. Before refrigeration salt was the great preservative, and for centuries the salinas were one of the region\'s main sources of wealth.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'As salinas de Aveiro',
    greet: {
      kid: 'Estamos dentro da imagem: as salinas de Aveiro, em Portugal! Sentes o sol e o vento? Aqui transformam a água do mar em sal. A história da imagem está no cavalete ao teu lado.',
      sci: 'As salinas de Aveiro numa tarde quente e ventosa: tanques de barro pouco fundos, cheios com água da ria, onde o sol e o vento evaporam a água do mar até o cloreto de sódio cristalizar. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'A água destes tanques vem da Ria de Aveiro, e a ria recebe-a do mar, por uma abertura nas dunas de areia.',
        'Vês o barco comprido com a proa pintada? É um moliceiro. Foi feito para apanhar o moliço, as plantas do fundo da ria, que os agricultores espalhavam nos campos.',
        'Às vezes há aves cor-de-rosa a passear em salinas como estas: flamingos! Comem uns camarõezinhos minúsculos que vivem em água muito mais salgada do que o mar.',
      ],
      sci: [
        'A Ria de Aveiro é uma laguna por trás de uma longa barreira de dunas, aberta ao Atlântico na barra. Em 1877 os marnotos só metiam água na cabeça das marés vivas, de 15 em 15 dias, quando entrava mais depressa e mais salgada.',
        'O moliceiro, com cerca de 15 m de comprido e 2,5 m de largo, tem a borda baixa para carregar o moliço (plantas submersas da ria, outrora o adubo da região) e quatro painéis pintados, dois na proa e dois na ré. Hoje leva sobretudo turistas.',
        'Os flamingos alimentam-se nas salinas de artémias (Artemia), que vivem bem com salinidades várias vezes superiores à do mar; o cor-de-rosa vem dos carotenoides do que comem.',
      ],
    },
    sea: {
      label: 'De onde vem o sal',
      title: 'Como o mar ficou salgado',
      meter: { title: 'Sal no mar', unit: 'gramas em cada quilograma', today: 'o mar de hoje', other: 'outros sais' },
      hints: { cloud: 'Toca na nuvem para chover', volcano: 'Toca no vulcão', empty: 'A nuvem está vazia: toca no sol', done: 'Tão salgado como hoje: E para recomeçar' },
      buttons: { cloud: 'Chuva', volcano: 'Vulcão', sun: 'Sol', again: 'Um mar novo' },
      says: {
        rain: { kid: 'Chuva! Arranca bocadinhos minúsculos às rochas: os roxos são de sódio. O rio leva-os até ao mar.', sci: 'A chuva, ligeiramente ácida pelo CO2 dissolvido, meteoriza feldspatos como a albite (NaAlSi3O8) e liberta Na+; os rios levam-no para o mar, com Ca2+, Mg2+, K+ e bicarbonato.' },
        empty: { kid: 'A nuvem já choveu tudo. Toca no sol: ele leva a água do mar de volta para o céu.', sci: 'A nuvem esgotou-se: a evaporação tem primeiro de levantar mais água do mar.' },
        volcano: { kid: 'O vulcão deita gases com cloro. A chuva trá-los para baixo e no mar ficam cloreto: os verdes.', sci: 'Os gases vulcânicos levam HCl; dissolvido na chuva e na água do mar dá Cl−. Ao longo da história da Terra, a desgaseificação forneceu a maior parte do cloreto do oceano.' },
        sun: { kid: 'O sol aquece o mar e leva a água para o céu, em vapor invisível. Mas o sal não voa: fica para trás, e o mar fica um bocadinho mais salgado.', sci: 'A evaporação só leva H2O: os iões ficam e a salinidade sobe. O vapor condensa em nuvens e volta a cair como água doce.' },
        full: { kid: 'A nuvem já está cheia de água. Toca nela e deixa chover!', sci: 'A nuvem tem toda a água que pode: deixa chover.' },
        today: { kid: '35 gramas de sal em cada quilograma de água: tão salgado como o mar de hoje! Agora sai do mar tanto sal como entra, por isso fica mais ou menos assim.', sci: 'Cerca de 35 g/kg, a salinidade média de hoje. As entradas e as perdas equilibram-se: o sal fica enterrado como sal-gema onde mares pouco fundos secam e é retido pelos sedimentos do fundo, por isso a salinidade muda muito devagar.' },
        steady: { kid: 'Chega mais sal, mas sai outro tanto: parte fica enterrada como sal-gema onde os mares secam. O mar fica igualmente salgado.', sci: 'Em equilíbrio, cada nova entrada é compensada pelo enterramento em evaporitos e sedimentos: a salinidade mantém-se perto de 35 g/kg.' },
        again: { kid: 'Um mar novo, de água da chuva. Torna-o salgado outra vez!', sci: 'Recomeço: um oceano de água doce, 0 g/kg.' },
      },
      panel: {
        kid: [
          'A chuva é um bocadinho ácida: tem um pouco de dióxido de carbono. Ao longo de milhares de anos vai roendo as rochas e arrancando-lhes bocadinhos minúsculos, entre eles o sódio. Os rios levam-nos para o mar, e o mar guarda-os, porque quando o sol leva a água para o céu o sal fica para trás. Os vulcões juntaram o cloro. O sódio e o cloreto juntos são o sal que comemos.',
          'A água dos rios não sabe a sal porque traz muito pouco, mas o mar anda a juntá-lo há milhares de milhões de anos. Hoje cada quilograma de água do mar tem cerca de 35 gramas de sais: um balde de 10 litros, cerca de 360 gramas.',
        ],
        sci: [
          'Um quilograma de água do mar tem cerca de 35 g de sais dissolvidos: 19,4 g de cloreto, 10,8 g de sódio, 2,7 g de sulfato, 1,3 g de magnésio e cerca de 0,4 g de cálcio e outro tanto de potássio; o Na+ e o Cl− são 86%. A meteorização de rochas silicatadas como o feldspato albite fornece o sódio. Mas a crusta tem cerca de 160 vezes mais sódio do que cloro (2,36% contra 0,0145%), por isso a maior parte do cloreto tem de vir de outro lado: o HCl vulcânico, os voláteis em excesso de William Rubey (1951).',
          'Edmond Halley propôs em 1715 que os rios trazem o sal e a evaporação o guarda, e que a salinidade do mar podia datar a Terra. John Joly experimentou-o em 1899 com o sódio e obteve menos de 100 milhões de anos; a Terra tem cerca de 4,5 mil milhões de anos. O mar também perde sal, enterrado em evaporitos, retido pelos sedimentos e nas fontes hidrotermais, por isso as entradas e as perdas quase se equilibram.',
        ],
      },
    },
    pans: {
      label: 'Os tanques da salina',
      title: 'Da água do mar ao sal',
      ponds: ['1  Viveiro', '2  Caldeiros', '3  Meios'],
      board: { title: 'A salmoura', salt: 'Sal na água', gone: 'Água evaporada', lime: 'Carbonato de cálcio', gypsum: 'Gesso', halite: 'Cloreto de sódio', flor: 'Flor de sal' },
      slider: 'Sol e vento',
      weather: ['Calmo e enevoado', 'Sol e uma brisa', 'Calor e vento'],
      hints: {
        sea: 'Toca na comporta para deixar entrar água do mar',
        gate2: 'Toca na comporta seguinte para passar a salmoura',
        gate3: 'Toca na última comporta para passar a salmoura',
        wait: 'O sol e o vento estão a secá-la (E: o cursor)',
        hot: 'Aumenta o sol e o vento (E) para haver flor de sal',
        skim: 'Toca na escumadeira para apanhar a flor de sal',
        again: 'Toca na comporta para deixar entrar água nova',
      },
      buttons: { sea: 'Deixar entrar água do mar', next: 'Passar a salmoura', skim: 'Apanhar a flor de sal' },
      says: {
        sea: { kid: 'Chape! A água do mar entra do canal e enche o viveiro. A lama e a areia assentam no fundo.', sci: 'A comporta abre: água do mar com cerca de 35 g/kg (3 graus Baumé) enche o viveiro, onde assentam o lodo e a areia.' },
        gate2: { kid: 'Para o tanque seguinte! É menos fundo, por isso o sol e o vento secam-no mais depressa.', sci: 'A salmoura passa a um tanque menos fundo: uma camada fina evapora mais depressa. Em 1877 os tanques de Aveiro tinham 20 cm de água no princípio e só poucos centímetros perto do fim.' },
        gate3: { kid: 'Para os meios! A salmoura já está tão salgada que quase não aguenta mais sal.', sci: 'A salmoura chega ao cristalizador perto da saturação, a cerca de 25 graus Baumé (densidade 1,21).' },
        lime: { kid: 'Já evaporou metade da água, e sai a primeira coisa: uma película fina de carbonato de cálcio, a matéria do giz e das conchas.', sci: 'Com cerca de metade da água evaporada precipita o carbonato de cálcio (aragonite): o menos solúvel dos sais do mar sai primeiro.' },
        gypsum: { kid: 'Já evaporaram quatro quintos da água: agora sai o gesso, cristais brancos e moles. Os marnotos de Aveiro chamavam-lhe codejo.', sci: 'Com cerca de quatro quintos evaporados cristaliza o gesso, CaSO4·2H2O: o depósito mais abundante nos tanques de evaporação, a que os marnotos chamavam codejo (1877).' },
        halite: { kid: 'Nove décimos da água evaporados: sal! Crescem no fundo cubinhos brancos de cloreto de sódio.', sci: 'Com cerca de nove décimos evaporados, a salmoura fica saturada em NaCl (cerca de 26%) e a halite cristaliza em pequenos cubos e em cristais ocos em tremonha.' },
        flor: { kid: 'Sol forte e vento seco: forma-se à superfície uma crosta fina de sal a flutuar, como gelo num lago. É a flor de sal! Toca na escumadeira.', sci: 'Nos dias quentes e secos, com brisa, a superfície evapora mais depressa e fica sobressaturada primeiro: formam-se ali lâminas finas de halite que flutuam presas pela tensão superficial até afundarem. Recolhidas, são a flor de sal.' },
        skim: { kid: 'Com cuidado: a escumadeira tira as lâminas de cima sem tocar no fundo. A flor de sal apanha-se à mão assim.', sci: 'A flor de sal tira-se só da superfície, nunca do fundo de barro; é uma pequena parte da colheita e vende-se muito mais cara do que o sal grosso.' },
        noflor: { kid: 'Ainda não há nada para apanhar: a flor de sal precisa de salmoura quase saturada, sol forte e vento seco.', sci: 'Sem crosta: só se forma em salmoura perto da saturação, com evaporação forte.' },
        bitter: { kid: 'Para aqui! Se a última água também secasse, saíam sais amargos que estragavam o sabor do sal.', sci: 'Os salineiros nunca deixam a salmoura secar: o que resta é rico em sais de magnésio e de potássio, que tornariam o sal amargo.' },
        again: { kid: 'Água do mar nova! As salinas trabalham o verão inteiro, um bocadinho de cada vez.', sci: 'A produção dura toda a safra: entra água nova nas marés vivas enquanto a salmoura saturada continua a chegar aos cristalizadores.' },
        oneBatch: { kid: 'Uma salmoura de cada vez: passa primeiro esta.', sci: 'Os tanques estão ocupados: passa primeiro a salmoura.' },
        noBrine: { kid: 'Não há salmoura à espera nesta comporta. Segue a água desde o canal!', sci: 'Não há salmoura atrás desta comporta.' },
      },
      panel: {
        kid: [
          'Os marnotos deixam entrar a água do mar pelo canal e passam-na de tanque em tanque, cada um menos fundo do que o anterior. O sol e o vento levam a água pouco a pouco, e a que fica é cada vez mais salgada.',
          'Não sai tudo de uma vez. Primeiro um pouco de carbonato de cálcio, como giz, depois o gesso, e só quando já evaporaram cerca de nove décimos da água sai o sal que comemos. Nos dias quentes, com vento seco, flutua à superfície uma crosta fina de sal: a flor de sal, apanhada à mão com muito cuidado.',
        ],
        sci: [
          'A água do mar entra com cerca de 3 graus Baumé e vai-se concentrando de compartimento em compartimento: pelos nomes de Aveiro, o viveiro, depois os algibés, os caldeiros, as sobre-cabeceiras e outros, até aos meios, onde o sal cristaliza a cerca de 25 graus Baumé. Os sais saem por ordem de solubilidade, como Usiglio mediu em 1849: o carbonato de cálcio com cerca de metade da água evaporada, o gesso com cerca de quatro quintos, o cloreto de sódio com cerca de nove décimos.',
          'Os salineiros nunca deixam a salmoura secar: o que resta é rico em sais de magnésio e de potássio, que tornariam o sal amargo. A flor de sal é a crosta fina de halite que se forma à superfície nos dias quentes e secos. Em 1877 os marnotos de Aveiro mexiam a salmoura todos os dias para a afundar e ter o grão miúdo; hoje recolhe-se e vende-se à parte. Um quilograma de água do mar tem sódio para cerca de 27 g de cloreto de sódio.',
        ],
      },
    },
    rake: {
      label: 'O rodo do marnoto',
      title: 'Puxar o sal',
      hints: { rake: 'Toca no rodo para puxar o sal', more: 'Toca outra vez no rodo: o monte cresce' },
      buttons: { rake: 'Puxar o sal' },
      says: {
        rake: { kid: 'Zás! O rodo comprido de madeira puxa o sal para o lado, para o monte.', sci: 'O marnoto puxa os cristais ao de leve sobre o fundo do meio, deixando uma camada fina de sal, para não levantar o barro que o acinzentaria (Alcoforado, 1877).' },
        grow: { kid: 'O monte cresce! Cada toque é mais uma puxada de sal.', sci: 'No verão um cristalizador podia colher-se de poucos em poucos dias: em 1877 o primeiro sal estava pronto cerca de três dias depois de entrar a salmoura.' },
        full: { kid: 'Esse monte está pronto: uma pirâmide branca e brilhante, como as da imagem!', sci: 'Os montes ficavam nas eiras, em cone ou em cumes compridos chamados mulas; eram batidos até ficarem lisos e cobertos com junça, presa com leivas de terra, contra a chuva (1877).' },
        all: { kid: 'Três montes! Antigamente o sal era levado em canastras à cabeça para os montes grandes e para os palheiros de madeira. Vamos começar outra vez.', sci: 'O sal ia em canastras à cabeça para os montes e depois para armazéns de madeira, os palheiros. Começa um monte novo.' },
      },
      panel: {
        kid: [
          'Os trabalhadores das salinas de Aveiro chamam-se marnotos. Da primavera até ao fim do verão tratam das suas salinas: deixam entrar a água, passam-na de tanque em tanque e, quando o sal cresce, puxam-no com um rodo comprido de madeira e fazem montes brancos e brilhantes, para escorrer e secar.',
          'É um trabalho muito antigo: as salinas de Aveiro aparecem num documento do ano 959, há mais de mil anos. Nesse tempo o sal era precioso: conservava o peixe e a carne, muito antes de haver frigoríficos.',
        ],
        sci: [
          'Nos cristalizadores (os meios) o marnoto primeiro junta o sal num cordão e depois puxa-o para o lado; Alcoforado, em 1877, chamou às alfaias ugalho e rasoila. Uma mão leve deixa uma camada fina de sal no fundo, para que não venha barro com ele. O sal escorre umas horas e depois é levado para os montes nas eiras.',
          'A referência mais antiga a Aveiro, o testamento da condessa Mumadona Dias, de 959, já fala das suas salinas. Antes da refrigeração o sal era o grande conservante, e durante séculos as salinas foram uma das principais fontes de riqueza da região.',
        ],
      },
    },
  },
  pl: {
    title: 'Saliny w Aveiro',
    greet: {
      kid: 'Jesteśmy w środku obrazka: w salinach w Aveiro, w Portugalii! Czujesz słońce i wiatr? To one zamieniają tu morską wodę w sól. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Saliny w Aveiro w gorące, wietrzne popołudnie: płytkie gliniane baseny napełniane wodą z laguny, w których słońce i wiatr odparowują wodę morską, aż krystalizuje chlorek sodu. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Woda w tych basenach pochodzi z laguny Ria de Aveiro, a laguna dostaje ją z morza, przez przerwę w piaszczystych wydmach.',
        'Widzisz długą łódź z malowanym dziobem? To moliceiro. Zbudowano ją do zbierania moliço, roślin z dna laguny, którymi rolnicy nawozili pola.',
        'W takich salinach brodzą czasem różowe ptaki: flamingi! Jedzą malutkie skorupiaki, które żyją w wodzie dużo bardziej słonej niż morze.',
      ],
      sci: [
        'Ria de Aveiro to laguna za długim wałem wydm, otwarta na Atlantyk w miejscu zwanym barra. W 1877 roku marnotos wpuszczali wodę tylko w szczycie przypływów syzygijnych, co 15 dni, gdy wpływała najszybciej i była najbardziej słona.',
        'Moliceiro, długie na około 15 m i szerokie na 2,5 m, ma niską burtę do ładowania moliço (zanurzonych roślin laguny, dawniej nawozu regionu) i cztery malowane panele, dwa na dziobie i dwa na rufie. Dziś wozi głównie turystów.',
        'Flamingi żerują w salinach na solowcach (Artemia), które dobrze znoszą zasolenie kilkakrotnie wyższe niż w morzu; różowy kolor zawdzięczają karotenoidom z pożywienia.',
      ],
    },
    sea: {
      label: 'Skąd się bierze sól',
      title: 'Jak morze stało się słone',
      meter: { title: 'Sól w morzu', unit: 'gramów w każdym kilogramie', today: 'dzisiejsze morze', other: 'inne sole' },
      hints: { cloud: 'Dotknij chmury, żeby padało', volcano: 'Dotknij wulkanu', empty: 'Chmura jest pusta: dotknij słońca', done: 'Słone jak dziś: E, żeby zacząć od nowa' },
      buttons: { cloud: 'Deszcz', volcano: 'Wulkan', sun: 'Słońce', again: 'Nowe morze' },
      says: {
        rain: { kid: 'Deszcz! Wypłukuje ze skał maleńkie okruszki: te fioletowe to sód. Rzeka niesie je do morza.', sci: 'Deszcz, lekko kwaśny od rozpuszczonego CO2, rozkłada skalenie, takie jak albit (NaAlSi3O8), i uwalnia Na+; rzeki niosą go do morza razem z Ca2+, Mg2+, K+ i wodorowęglanami.' },
        empty: { kid: 'Chmura wypadała się do sucha. Dotknij słońca: zabierze wodę z morza z powrotem do nieba.', sci: 'Chmura jest pusta: najpierw parowanie musi unieść z morza więcej wody.' },
        volcano: { kid: 'Wulkan wydycha gazy z chlorem. Deszcz sprowadza je na dół, a w morzu zmieniają się w chlorek: te zielone.', sci: 'Gazy wulkaniczne niosą HCl; rozpuszczony w deszczu i wodzie morskiej daje Cl−. W historii Ziemi to odgazowanie dostarczyło większość chlorków oceanu.' },
        sun: { kid: 'Słońce grzeje morze i unosi wodę do nieba jako niewidzialną parę. Ale sól nie umie latać: zostaje, a morze robi się trochę bardziej słone.', sci: 'Parowanie zabiera tylko H2O: jony zostają, a zasolenie rośnie. Para skrapla się w chmury i spada znowu jako słodka woda.' },
        full: { kid: 'Chmura jest już pełna wody. Dotknij jej i niech pada!', sci: 'Chmura mieści już całą wodę, jaką może: niech pada.' },
        today: { kid: '35 gramów soli w każdym kilogramie wody: tak słone jak dzisiejsze morze! Teraz z morza ubywa tyle soli, ile przybywa, więc zostaje mniej więcej tak słone.', sci: 'Około 35 g/kg, dzisiejsze średnie zasolenie. Dopływ i ubytek się równoważą: sól zostaje pogrzebana jako sól kamienna tam, gdzie wysychają płytkie morza, i wiązana przez osady dna, więc zasolenie zmienia się bardzo powoli.' },
        steady: { kid: 'Przybywa soli, ale tyle samo ubywa: część zostaje pogrzebana jako sól kamienna tam, gdzie morza wysychają. Morze jest wciąż tak samo słone.', sci: 'W stanie równowagi każdy nowy dopływ równoważy pogrzebanie w ewaporatach i osadach: zasolenie trzyma się blisko 35 g/kg.' },
        again: { kid: 'Nowe morze z deszczówki. Zrób je znowu słonym!', sci: 'Od nowa: ocean słodkiej wody, 0 g/kg.' },
      },
      panel: {
        kid: [
          'Deszcz jest troszeczkę kwaśny: ma w sobie odrobinę dwutlenku węgla. Przez tysiące lat podgryza skały i wypłukuje z nich maleńkie okruszki, a wśród nich sód. Rzeki niosą je do morza, a morze je zatrzymuje, bo kiedy słońce unosi wodę do nieba, sól zostaje. Chlor dodały wulkany. Sód i chlorek razem to sól, którą jemy.',
          'Woda w rzekach nie jest słona, bo niesie bardzo mało soli, ale morze zbiera ją od miliardów lat. Dziś każdy kilogram wody morskiej zawiera około 35 gramów soli: 10-litrowe wiadro około 360 gramów.',
        ],
        sci: [
          'Kilogram wody morskiej zawiera około 35 g rozpuszczonych soli: 19,4 g chlorków, 10,8 g sodu, 2,7 g siarczanów, 1,3 g magnezu i po około 0,4 g wapnia i potasu; Na+ i Cl− to 86%. Sodu dostarcza wietrzenie skał krzemianowych, takich jak skaleń albit. Ale skorupa ziemska ma około 160 razy więcej sodu niż chloru (2,36% wobec 0,0145%), więc większość chlorków musi pochodzić skądinąd: z wulkanicznego HCl, „nadmiarowych substancji lotnych” Williama Rubeya (1951).',
          'Edmond Halley zaproponował w 1715 roku, że rzeki przynoszą sól, a parowanie ją zatrzymuje, i że zasolenie morza mogłoby posłużyć do datowania Ziemi. John Joly spróbował tego w 1899 roku z sodem i otrzymał mniej niż 100 milionów lat; Ziemia ma około 4,5 miliarda lat. Morze też traci sól, grzebaną w ewaporatach, wiązaną przez osady i w kominach hydrotermalnych, więc dopływ i ubytek prawie się równoważą.',
        ],
      },
    },
    pans: {
      label: 'Baseny saliny',
      title: 'Od wody morskiej do soli',
      ponds: ['1  Zbiornik', '2  Basen parowania', '3  Krystalizator'],
      board: { title: 'Solanka', salt: 'Sól w wodzie', gone: 'Woda odparowana', lime: 'Węglan wapnia', gypsum: 'Gips', halite: 'Chlorek sodu', flor: 'Flor de sal' },
      slider: 'Słońce i wiatr',
      weather: ['Cicho i mglisto', 'Słońce i bryza', 'Upał i wiatr'],
      hints: {
        sea: 'Dotknij zastawki, żeby wpuścić wodę morską',
        gate2: 'Dotknij następnej zastawki, żeby przepuścić solankę',
        gate3: 'Dotknij ostatniej zastawki, żeby przepuścić solankę',
        wait: 'Słońce i wiatr ją osuszają (E: suwak)',
        hot: 'Podkręć słońce i wiatr (E), żeby powstał flor de sal',
        skim: 'Dotknij cedzaka, żeby zebrać flor de sal',
        again: 'Dotknij zastawki, żeby wpuścić nową wodę',
      },
      buttons: { sea: 'Wpuść wodę morską', next: 'Przepuść solankę dalej', skim: 'Zbierz flor de sal' },
      says: {
        sea: { kid: 'Plusk! Woda morska z kanału napełnia zbiornik. Muł i piasek opadają na dno.', sci: 'Zastawka się otwiera: woda morska o zasoleniu około 35 g/kg (3 stopnie Baumé) napełnia viveiro, zbiornik, w którym osiada muł i piasek.' },
        gate2: { kid: 'Do następnego basenu! Jest płytszy, więc słońce i wiatr osuszają go szybciej.', sci: 'Solanka przechodzi do płytszego basenu: cienka warstwa paruje szybciej. W 1877 roku baseny w Aveiro miały na początku 20 cm wody, a pod koniec tylko kilka centymetrów.' },
        gate3: { kid: 'Do krystalizatora! Solanka jest już tak słona, że prawie nie zmieści więcej soli.', sci: 'Solanka dociera do krystalizatora blisko nasycenia, przy około 25 stopniach Baumé (gęstość 1,21).' },
        lime: { kid: 'Połowa wody wyparowała i wychodzi pierwsza rzecz: cieniutka warstewka węglanu wapnia, tego, z czego zrobiona jest kreda i muszelki.', sci: 'Gdy odparuje mniej więcej połowa wody, wytrąca się węglan wapnia (aragonit): najsłabiej rozpuszczalna z soli morskich wychodzi pierwsza.' },
        gypsum: { kid: 'Wyparowały cztery piąte wody: teraz wychodzi gips, miękkie białe kryształki. Marnotos z Aveiro nazywali go codejo.', sci: 'Przy około czterech piątych odparowanej wody krystalizuje gips, CaSO4·2H2O: najobfitszy osad w basenach parowania, przez marnotos zwany codejo (1877).' },
        halite: { kid: 'Dziewięć dziesiątych wody wyparowało: sól! Na dnie rosną białe sześcianiki chlorku sodu.', sci: 'Przy około dziewięciu dziesiątych odparowanej wody solanka jest nasycona NaCl (około 26%) i halit krystalizuje w małych sześcianach i w pustych w środku kryształach lejkowatych.' },
        flor: { kid: 'Mocne słońce i suchy wiatr: na wierzchu pływa cieniutka skorupka soli, jak lód na stawie. To flor de sal, „kwiat soli”! Dotknij cedzaka.', sci: 'W gorące, suche dni z bryzą najszybciej paruje powierzchnia i to ona pierwsza staje się przesycona: tworzą się tam cienkie płatki halitu, które pływają dzięki napięciu powierzchniowemu, dopóki nie opadną. Zebrane to flor de sal.' },
        skim: { kid: 'Delikatnie: cedzak zbiera płatki z wierzchu, nie dotykając dna. Tak ręcznie zbiera się flor de sal.', sci: 'Flor de sal zbiera się tylko z powierzchni, nigdy z glinianego dna; to niewielka część zbiorów, a kosztuje dużo więcej niż gruba sól.' },
        noflor: { kid: 'Na razie nie ma czego zbierać: flor de sal potrzebuje prawie nasyconej solanki, mocnego słońca i suchego wiatru.', sci: 'Brak skorupki: tworzy się tylko na solance bliskiej nasycenia, przy silnym parowaniu.' },
        bitter: { kid: 'Tu stop! Gdyby wyschła też ostatnia woda, wyszłyby gorzkie sole i zepsuły smak soli.', sci: 'Producenci soli nigdy nie pozwalają solance wyschnąć: reszta jest bogata w sole magnezu i potasu, które nadałyby soli gorzki smak.' },
        again: { kid: 'Nowa woda morska! Saliny pracują przez całe lato, po trochu.', sci: 'Produkcja trwa cały sezon: nowa woda wpływa w przypływy syzygijne, a nasycona solanka wciąż dociera do krystalizatorów.' },
        oneBatch: { kid: 'Jedna porcja naraz: najpierw przepuść tę solankę.', sci: 'Baseny są zajęte: najpierw przepuść solankę dalej.' },
        noBrine: { kid: 'Przy tej zastawce nie czeka żadna solanka. Idź za wodą od kanału!', sci: 'Za tą zastawką nie ma solanki.' },
      },
      panel: {
        kid: [
          'Marnotos wpuszczają wodę morską z kanału i przepuszczają ją z basenu do basenu, a każdy jest płytszy od poprzedniego. Słońce i wiatr po trochu zabierają wodę, a to, co zostaje, robi się coraz bardziej słone.',
          'Nie wszystko wychodzi naraz. Najpierw trochę kredowego węglanu wapnia, potem gips, a dopiero gdy wyparuje około dziewięciu dziesiątych wody, sól, którą jemy. W gorące dni z suchym wiatrem na wierzchu pływa cienka skorupka soli: flor de sal, „kwiat soli”, zbierany delikatnie ręcznie.',
        ],
        sci: [
          'Woda morska wpływa przy około 3 stopniach Baumé i zagęszcza się z przedziału do przedziału: według nazw z Aveiro viveiro, potem algibés, caldeiros, sobre-cabeceiras i inne, aż do meios, gdzie sól krystalizuje przy około 25 stopniach Baumé. Sole wytrącają się w kolejności rozpuszczalności, jak zmierzył Usiglio w 1849 roku: węglan wapnia od około połowy odparowanej wody, gips od około czterech piątych, chlorek sodu od około dziewięciu dziesiątych.',
          'Producenci soli nigdy nie pozwalają solance wyschnąć: reszta jest bogata w sole magnezu i potasu, które nadałyby soli gorzki smak. Flor de sal to cienka skorupka halitu, która tworzy się na powierzchni w gorące, suche dni. W 1877 roku marnotos z Aveiro codziennie mieszali solankę, żeby ją zatopić i mieć drobne ziarno; dziś zbiera się ją i sprzedaje osobno. Kilogram wody morskiej zawiera sód na około 27 g chlorku sodu.',
        ],
      },
    },
    rake: {
      label: 'Grabie marnoto',
      title: 'Zgarnianie soli',
      hints: { rake: 'Dotknij grabi, żeby zgarnąć sól', more: 'Dotknij grabi jeszcze raz: kopiec rośnie' },
      buttons: { rake: 'Zgarnij sól' },
      says: {
        rake: { kid: 'Szuuu! Długie drewniane grabie zgarniają sól na bok, na kopiec.', sci: 'Marnoto lekko przeciąga kryształy po dnie basenu, zostawiając cienką warstwę soli, żeby nie poderwać gliny, która zszarzyłaby sól (Alcoforado, 1877).' },
        grow: { kid: 'Kopiec rośnie! Każde dotknięcie to kolejna porcja soli.', sci: 'Latem krystalizator można było zbierać co kilka dni: w 1877 roku pierwsza sól była gotowa około trzech dni po wpuszczeniu solanki.' },
        full: { kid: 'Ten kopiec jest gotowy: lśniąca biała piramida, jak te na obrazku!', sci: 'Kopce stały na eiras jako stożki albo długie grzbiety zwane mulas; ubijano je na gładko i przykrywano sitowiem przyciśniętym darnią, chroniąc przed deszczem (1877).' },
        all: { kid: 'Trzy kopce! Dawniej sól noszono w koszach na głowie do wielkich kopców i drewnianych szop. Zaczynamy od nowa.', sci: 'Sól noszono w koszach na głowie do kopców, a potem do drewnianych magazynów, palheiros. Zaczyna się nowy kopiec.' },
      },
      panel: {
        kid: [
          'Pracownicy salin w Aveiro to marnotos. Od wiosny do końca lata opiekują się swoimi salinami: wpuszczają wodę, przepuszczają ją z basenu do basenu, a gdy sól urośnie, zgarniają ją długimi drewnianymi grabiami w lśniące białe kopce, żeby ociekła i wyschła.',
          'To bardzo stara praca: saliny w Aveiro wymienia dokument z 959 roku, sprzed ponad tysiąca lat. Wtedy sól była cenna: chroniła ryby i mięso przed zepsuciem, na długo przed lodówkami.',
        ],
        sci: [
          'W krystalizatorach (meios) marnoto najpierw zgarnia sól w wał, a potem przeciąga ją na bok; Alcoforado w 1877 roku nazwał te narzędzia ugalho i rasoila. Lekka ręka zostawia na dnie cienką warstwę soli, żeby nie zabrać z nią gliny. Sól ocieka kilka godzin, a potem trafia do kopców na eiras.',
          'Najstarsza znana wzmianka o Aveiro, testament hrabiny Mumadony Dias z 959 roku, wymienia już tamtejsze saliny. Przed wynalezieniem chłodzenia sól była głównym środkiem konserwującym i przez stulecia saliny były jednym z głównych źródeł bogactwa regionu.',
        ],
      },
    },
  },
  de: {
    title: 'Die Salinen von Aveiro',
    greet: {
      kid: 'Wir sind im Bild: in den Salinen von Aveiro, in Portugal! Spürst du die Sonne und den Wind? Sie machen hier aus Meerwasser Salz. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Die Salinen von Aveiro an einem heißen, windigen Nachmittag: flache Lehmbecken, gefüllt aus der Lagune, in denen Sonne und Wind Meerwasser verdunsten, bis Natriumchlorid auskristallisiert. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Das Wasser in diesen Becken kommt aus der Lagune, der Ria de Aveiro, und die Lagune bekommt es vom Meer, durch eine Lücke in den Sanddünen.',
        'Siehst du das lange Boot mit dem bemalten Bug? Das ist ein Moliceiro. Es wurde gebaut, um Moliço zu sammeln, die Wasserpflanzen der Lagune, die die Bauern auf ihre Felder streuten.',
        'Manchmal waten rosa Vögel durch solche Salinen: Flamingos! Sie fressen winzige Krebschen, die in Wasser leben, das viel salziger ist als das Meer.',
      ],
      sci: [
        'Die Ria de Aveiro ist eine Lagune hinter einem langen Dünenwall, zum Atlantik hin offen an der Barra. 1877 ließen die Marnotos Wasser nur auf dem Höchststand der Springfluten ein, alle 15 Tage, wenn es am schnellsten und salzigsten hereinkam.',
        'Der Moliceiro, etwa 15 m lang und 2,5 m breit, hat eine niedrige Bordwand zum Laden von Moliço (untergetauchten Lagunenpflanzen, einst der Dünger der Region) und vier bemalte Tafeln, zwei am Bug und zwei am Heck. Heute fährt er vor allem Besucher.',
        'Flamingos fressen in Salinen Salinenkrebse (Artemia), die bei einem Vielfachen des Salzgehalts des Meeres gedeihen; ihr Rosa stammt von Carotinoiden in ihrer Nahrung.',
      ],
    },
    sea: {
      label: 'Woher das Salz kommt',
      title: 'Wie das Meer salzig wurde',
      meter: { title: 'Salz im Meer', unit: 'Gramm in jedem Kilogramm', today: 'das Meer heute', other: 'andere Salze' },
      hints: { cloud: 'Tippe auf die Wolke, damit es regnet', volcano: 'Tippe auf den Vulkan', empty: 'Die Wolke ist leer: Tippe auf die Sonne', done: 'So salzig wie heute: E für einen Neuanfang' },
      buttons: { cloud: 'Regen', volcano: 'Vulkan', sun: 'Sonne', again: 'Ein neues Meer' },
      says: {
        rain: { kid: 'Regen! Er wäscht winzige Stückchen aus dem Gestein: Die violetten sind Natrium. Der Fluss trägt sie ins Meer.', sci: 'Regen, durch gelöstes CO2 leicht sauer, verwittert Feldspäte wie Albit (NaAlSi3O8) und setzt Na+ frei; Flüsse tragen es mit Ca2+, Mg2+, K+ und Hydrogencarbonat ins Meer.' },
        empty: { kid: 'Die Wolke hat sich leer geregnet. Tippe auf die Sonne: Sie hebt Wasser aus dem Meer zurück in den Himmel.', sci: 'Die Wolke ist leer: Erst muss die Verdunstung mehr Wasser aus dem Meer heben.' },
        volcano: { kid: 'Der Vulkan atmet Gas mit Chlor aus. Der Regen bringt es herunter, und im Meer wird es zu Chlorid: die grünen.', sci: 'Vulkangase führen HCl; in Regen und Meerwasser gelöst ergibt es Cl−. Im Lauf der Erdgeschichte lieferte die Entgasung den größten Teil des Chlorids im Ozean.' },
        sun: { kid: 'Die Sonne wärmt das Meer und hebt sein Wasser als unsichtbaren Dampf in den Himmel. Aber Salz kann nicht fliegen: Es bleibt zurück, und das Meer wird ein bisschen salziger.', sci: 'Verdunstung nimmt nur H2O mit: Die Ionen bleiben, der Salzgehalt steigt. Der Dampf kondensiert zu Wolken und fällt wieder als Süßwasser.' },
        full: { kid: 'Die Wolke ist jetzt voller Wasser. Tippe auf sie und lass es regnen!', sci: 'Die Wolke hält so viel Wasser, wie sie kann: Lass es regnen.' },
        today: { kid: '35 Gramm Salz in jedem Kilogramm Wasser: so salzig wie das Meer heute! Jetzt verlässt so viel Salz das Meer, wie hineinkommt, deshalb bleibt es etwa so salzig.', sci: 'Etwa 35 g/kg, der heutige mittlere Salzgehalt. Zufuhr und Verluste gleichen sich aus: Salz wird als Steinsalz begraben, wo flache Meere austrocknen, und von Sedimenten am Meeresboden aufgenommen, darum ändert sich der Salzgehalt nur sehr langsam.' },
        steady: { kid: 'Es kommt mehr Salz, aber genauso viel geht: Ein Teil wird als Steinsalz begraben, wo Meere austrocknen. Das Meer bleibt etwa so salzig.', sci: 'Im Gleichgewicht wird jede neue Zufuhr durch Ablagerung in Evaporiten und Sedimenten ausgeglichen: Der Salzgehalt bleibt nahe 35 g/kg.' },
        again: { kid: 'Ein neues Meer aus Regenwasser. Mach es wieder salzig!', sci: 'Neustart: ein Süßwasserozean, 0 g/kg.' },
      },
      panel: {
        kid: [
          'Regen ist ein kleines bisschen sauer: Er enthält etwas Kohlenstoffdioxid. Über Tausende von Jahren nagt er am Gestein und wäscht winzige Stückchen heraus, darunter Natrium. Flüsse tragen sie ins Meer, und das Meer behält sie, denn wenn die Sonne das Wasser in den Himmel hebt, bleibt das Salz zurück. Das Chlor kam von den Vulkanen. Natrium und Chlorid zusammen sind das Salz, das wir essen.',
          'Flusswasser schmeckt nicht salzig, weil es nur wenig Salz trägt, aber das Meer sammelt es schon seit Milliarden Jahren. Heute enthält jedes Kilogramm Meerwasser etwa 35 Gramm Salze: ein 10-Liter-Eimer davon etwa 360 Gramm.',
        ],
        sci: [
          'Ein Kilogramm Meerwasser enthält etwa 35 g gelöste Salze: 19,4 g Chlorid, 10,8 g Natrium, 2,7 g Sulfat, 1,3 g Magnesium und je etwa 0,4 g Calcium und Kalium; Na+ und Cl− machen 86% aus. Die Verwitterung von Silikatgestein wie dem Feldspat Albit liefert das Natrium. Aber die Erdkruste enthält etwa 160-mal mehr Natrium als Chlor (2,36% gegen 0,0145%), also muss das meiste Chlorid von anderswo stammen: aus vulkanischem HCl, William Rubeys „überschüssigen flüchtigen Stoffen“ (1951).',
          'Edmond Halley schlug 1715 vor, dass Flüsse das Salz bringen und die Verdunstung es behält, und dass sich mit dem Salzgehalt des Meeres das Alter der Erde bestimmen ließe. John Joly versuchte es 1899 mit Natrium und kam auf weniger als 100 Millionen Jahre; die Erde ist etwa 4,5 Milliarden Jahre alt. Das Meer verliert auch Salz, in Evaporiten begraben, von Sedimenten und an hydrothermalen Quellen aufgenommen, darum gleichen sich Zufuhr und Verluste fast aus.',
        ],
      },
    },
    pans: {
      label: 'Die Salzbecken',
      title: 'Vom Meerwasser zum Salz',
      ponds: ['1  Vorratsbecken', '2  Verdunstungsbecken', '3  Kristallisationsbecken'],
      board: { title: 'Die Sole', salt: 'Salz im Wasser', gone: 'Verdunstet', lime: 'Calciumcarbonat', gypsum: 'Gips', halite: 'Natriumchlorid', flor: 'Flor de Sal' },
      slider: 'Sonne und Wind',
      weather: ['Windstill und dunstig', 'Sonnig mit Brise', 'Heiß und windig'],
      hints: {
        sea: 'Tippe auf die Schleuse, um Meerwasser einzulassen',
        gate2: 'Tippe auf die nächste Schleuse, um die Sole weiterzuleiten',
        gate3: 'Tippe auf die letzte Schleuse, um die Sole weiterzuleiten',
        wait: 'Sonne und Wind trocknen sie (E: der Schieberegler)',
        hot: 'Dreh Sonne und Wind auf (E) für Flor de Sal',
        skim: 'Tippe auf den Abschöpfer, um die Flor de Sal zu ernten',
        again: 'Tippe auf die Schleuse für neues Meerwasser',
      },
      buttons: { sea: 'Meerwasser einlassen', next: 'Sole weiterleiten', skim: 'Flor de Sal abschöpfen' },
      says: {
        sea: { kid: 'Platsch! Meerwasser aus dem Kanal füllt das Vorratsbecken. Schlamm und Sand sinken auf den Boden.', sci: 'Die Schleuse öffnet sich: Meerwasser mit etwa 35 g/kg (3 Grad Baumé) füllt den Viveiro, das Vorratsbecken, in dem sich Schlick und Sand absetzen.' },
        gate2: { kid: 'Weiter ins nächste Becken! Es ist flacher, deshalb trocknen Sonne und Wind es schneller.', sci: 'Die Sole fließt in ein flacheres Becken: Eine dünne Schicht verdunstet schneller. 1877 standen in den Becken von Aveiro anfangs 20 cm Wasser, gegen Ende nur wenige Zentimeter.' },
        gate3: { kid: 'Ins Kristallisationsbecken! Die Sole ist jetzt so salzig, dass kaum noch Salz hineinpasst.', sci: 'Die Sole erreicht das Kristallisationsbecken nahe der Sättigung, bei etwa 25 Grad Baumé (Dichte 1,21).' },
        lime: { kid: 'Die Hälfte des Wassers ist weg, und das Erste kommt heraus: ein dünner Film aus Calciumcarbonat, dem Stoff von Kreide und Muscheln.', sci: 'Wenn etwa die Hälfte des Wassers verdunstet ist, fällt Calciumcarbonat (Aragonit) aus: Das am schwersten lösliche Salz des Meerwassers kommt zuerst.' },
        gypsum: { kid: 'Vier Fünftel des Wassers sind weg: Jetzt kommt Gips heraus, weiche weiße Kristalle. Die Marnotos von Aveiro nannten ihn Codejo.', sci: 'Bei etwa vier Fünfteln verdunstet kristallisiert Gips, CaSO4·2H2O: die reichlichste Ablagerung in den Verdunstungsbecken, von den Marnotos Codejo genannt (1877).' },
        halite: { kid: 'Neun Zehntel des Wassers sind weg: Salz! Auf dem Boden wachsen kleine weiße Würfel aus Natriumchlorid.', sci: 'Bei etwa neun Zehnteln verdunstet ist die Sole an NaCl gesättigt (etwa 26%), und Halit kristallisiert in kleinen Würfeln und hohlen Trichterkristallen.' },
        flor: { kid: 'Starke Sonne und trockener Wind: Oben schwimmt eine dünne Salzkruste, wie Eis auf einem Teich. Das ist Flor de Sal, die Salzblume! Tippe auf den Abschöpfer.', sci: 'An heißen, trockenen Tagen mit Brise verdunstet die Oberfläche am schnellsten und wird zuerst übersättigt: Dort bilden sich dünne Halitplättchen, die von der Oberflächenspannung getragen schwimmen, bis sie sinken. Abgeschöpft sind sie die Flor de Sal.' },
        skim: { kid: 'Ganz vorsichtig: Der Abschöpfer hebt die Plättchen von oben ab, ohne den Boden zu berühren. So wird Flor de Sal von Hand geerntet.', sci: 'Flor de Sal wird nur von der Oberfläche genommen, nie vom Lehmboden; sie ist ein kleiner Teil der Ernte und kostet weit mehr als grobes Salz.' },
        noflor: { kid: 'Noch nichts abzuschöpfen: Flor de Sal braucht fast gesättigte Sole, starke Sonne und trockenen Wind.', sci: 'Keine Kruste: Sie bildet sich nur auf Sole nahe der Sättigung bei starker Verdunstung.' },
        bitter: { kid: 'Hier anhalten! Würde auch das letzte Wasser trocknen, kämen bittere Salze heraus und verdürben den Geschmack des Salzes.', sci: 'Salzgärtner lassen die Sole nie eintrocknen: Der Rest ist reich an Magnesium- und Kaliumsalzen, die das Salz bitter machen würden.' },
        again: { kid: 'Neues Meerwasser! Die Salinen arbeiten den ganzen Sommer, immer ein bisschen.', sci: 'Die Produktion läuft die ganze Saison: Neues Wasser kommt bei Springflut herein, während gesättigte Sole weiter die Kristallisationsbecken erreicht.' },
        oneBatch: { kid: 'Eine Ladung nach der anderen: Leite erst diese Sole weiter.', sci: 'Die Becken sind belegt: erst die Sole weiterleiten.' },
        noBrine: { kid: 'An dieser Schleuse wartet keine Sole. Folge dem Wasser vom Kanal aus!', sci: 'Hinter dieser Schleuse ist keine Sole.' },
      },
      panel: {
        kid: [
          'Die Marnotos lassen Meerwasser aus dem Kanal ein und leiten es von Becken zu Becken, jedes flacher als das vorige. Sonne und Wind nehmen das Wasser nach und nach mit, und was zurückbleibt, wird immer salziger.',
          'Nicht alles kommt auf einmal heraus. Zuerst etwas kreidiges Calciumcarbonat, dann Gips, und erst wenn etwa neun Zehntel des Wassers weg sind, das Salz, das wir essen. An heißen Tagen mit trockenem Wind schwimmt oben eine dünne Salzkruste: Flor de Sal, die Salzblume, vorsichtig von Hand abgeschöpft.',
        ],
        sci: [
          'Meerwasser kommt mit etwa 3 Grad Baumé herein und wird von Abteil zu Abteil konzentriert: mit den Namen von Aveiro der Viveiro, dann Algibés, Caldeiros, Sobre-cabeceiras und weitere bis zu den Meios, wo das Salz bei etwa 25 Grad Baumé kristallisiert. Die Salze fallen in der Reihenfolge ihrer Löslichkeit aus, wie Usiglio 1849 maß: Calciumcarbonat ab etwa der Hälfte des verdunsteten Wassers, Gips ab etwa vier Fünfteln, Natriumchlorid ab etwa neun Zehnteln.',
          'Salzgärtner lassen die Sole nie eintrocknen: Der Rest ist reich an Magnesium- und Kaliumsalzen, die das Salz bitter machen würden. Flor de Sal ist die dünne Halitkruste, die sich an heißen, trockenen Tagen an der Oberfläche bildet. 1877 rührten die Marnotos von Aveiro die Sole jeden Tag um, um sie zu versenken und feine Körner zu bekommen; heute wird sie abgeschöpft und eigens verkauft. Ein Kilogramm Meerwasser enthält Natrium für etwa 27 g Natriumchlorid.',
        ],
      },
    },
    rake: {
      label: 'Der Rechen des Marnoto',
      title: 'Salz rechen',
      hints: { rake: 'Tippe auf den Rechen, um das Salz heranzuziehen', more: 'Tippe noch einmal auf den Rechen: Der Haufen wächst' },
      buttons: { rake: 'Salz rechen' },
      says: {
        rake: { kid: 'Wusch! Der lange Holzrechen zieht das Salz zur Seite, auf den Haufen.', sci: 'Der Marnoto zieht die Kristalle leicht über den Beckenboden und lässt eine dünne Salzschicht liegen, damit kein Lehm aufsteigt und das Salz grau färbt (Alcoforado, 1877).' },
        grow: { kid: 'Der Haufen wächst! Jedes Tippen ist noch eine Ladung Salz.', sci: 'Im Sommer ließ sich ein Kristallisationsbecken alle paar Tage abernten: 1877 war das erste Salz etwa drei Tage nach dem Einlassen der Sole fertig.' },
        full: { kid: 'Dieser Haufen ist fertig: eine glänzende weiße Pyramide, wie die auf dem Bild!', sci: 'Die Haufen standen auf den Eiras als Kegel oder als lange Rücken, Mulas genannt; sie wurden glatt geklopft und gegen den Regen mit Binsen bedeckt, die Grassoden festhielten (1877).' },
        all: { kid: 'Drei Haufen! Früher trug man das Salz in Körben auf dem Kopf zu großen Haufen und in Holzschuppen. Fangen wir von vorn an.', sci: 'Das Salz kam in Körben auf dem Kopf zu den Haufen und weiter in hölzerne Lagerhäuser, die Palheiros. Ein neuer Haufen beginnt.' },
      },
      panel: {
        kid: [
          'Die Salzarbeiter von Aveiro heißen Marnotos. Vom Frühling bis zum Ende des Sommers kümmern sie sich um ihre Salinen: Sie lassen das Wasser ein, leiten es von Becken zu Becken, und wenn das Salz gewachsen ist, ziehen sie es mit einem langen Holzrechen heraus und schichten es zu glänzenden weißen Haufen, damit es abtropft und trocknet.',
          'Das ist uralte Arbeit: Die Salinen von Aveiro werden in einer Urkunde aus dem Jahr 959 genannt, vor mehr als tausend Jahren. Damals war Salz kostbar: Es hielt Fisch und Fleisch frisch, lange bevor es Kühlschränke gab.',
        ],
        sci: [
          'In den Kristallisationsbecken (den Meios) schiebt der Marnoto das Salz erst zu einem Wall zusammen und zieht es dann zur Seite; Alcoforado nannte die Geräte 1877 Ugalho und Rasoila. Eine leichte Hand lässt eine dünne Salzschicht auf dem Boden, damit kein Lehm mitkommt. Das Salz tropft einige Stunden ab und kommt dann auf die Haufen auf den Eiras.',
          'Die älteste bekannte Erwähnung Aveiros, das Testament der Gräfin Mumadona Dias von 959, nennt schon seine Salinen. Vor der Kühlung war Salz das große Konservierungsmittel, und über Jahrhunderte waren die Salinen eine der wichtigsten Quellen des Reichtums der Region.',
        ],
      },
    },
  },
}
