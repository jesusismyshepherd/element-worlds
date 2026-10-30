// The words of the room inside carbon's leaf ("Plants eat air!"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/C.js
// (the easel shows it). Each step is done by tapping its thing: `hints` are what the prompt shows as the
// next step (no colon of their own), `verbs` the panels' buttons that do the same; `signs`, `from`,
// `board` and `weights` are drawn in 3D (plain text: no subscripts, CO2 not CO₂).
// Van Helmont's numbers are his own account's (Ortus medicinae, 1648), in the pounds and ounces of his day.
export const LEAF_WORDS = {
  en: {
    title: 'Inside a leaf',
    greet: {
      kid: 'Whoa, we have shrunk smaller than the cells of a leaf! I am carbon, and this leaf catches me right out of the air. Three things to try, and the picture\'s story is on the easel.',
      sci: 'We are inside a leaf, in the air spaces of its spongy layer, tens of thousands of times smaller than usual; overhead, the palisade cells full of chloroplasts. Three stations: where a tree\'s mass comes from, the stoma, and RuBisCO. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Look up! Those tall green cells are packed with chloroplasts, the leaf\'s little green kitchens. That is where sunlight turns air and water into sugar.',
        'Almost half of a dry log is carbon, and all that carbon once floated in the air as carbon dioxide. Wood is mostly made of air!',
        'The big tube at the back is a vein. It brings water all the way up from the roots, and carries sugar away to the rest of the tree.',
      ],
      sci: [
        'Photosynthesis in one line: 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂. The carbon comes from the air, the hydrogen from water, and the oxygen given off from the water too.',
        'Air is only about 0.04 % CO₂ (some 420 parts per million), yet land plants take more than a hundred billion tonnes of carbon out of it every year.',
        'A leaf is thin, often a few tenths of a millimetre, so light and gas reach every cell. The stomata let the gas in; the veins bring water in the xylem and carry sugar away in the phloem.',
      ],
    },
    willow: {
      label: "Van Helmont's willow",
      title: "Van Helmont's willow",
      years: 'Years of watering',
      yearsFmt: '{y} of 5',
      verbs: { water: 'Water it for a year', weigh: 'Weigh the willow and the soil', sort: 'What is the willow made of?', again: 'Start again' },
      hints: { water: 'Tap the watering can', weigh: 'Tap the willow to weigh it', sort: 'Tap the scale to see what it is made of', again: 'Tap the pot to start again' },
      signs: { water: 'water', carbon: 'carbon', oxygen: 'oxygen', hydrogen: 'hydrogen', minerals: 'minerals' },
      from: { air: 'from the air', water: 'from water', soil: 'from the soil' },
      weights: { treeStart: '5 pounds', soilStart: '200 pounds', tree: '169 pounds 3 ounces', soil: '200 pounds, less about 2 ounces' },
      rows: { treeStart: 'Willow at the start', soilStart: 'Soil at the start, dried', tree: 'Willow after 5 years', soil: 'Soil after 5 years, dried' },
      board: {
        grow: 'Year {y} of 5\nAt the start: a willow of 5 pounds in 200 pounds of dried soil. Only rainwater goes in.',
        weighed: 'After 5 years: the willow weighs 169 pounds 3 ounces.\nThe dried soil: only about 2 ounces lighter!',
        sorted: 'A living willow is about half water.\nThe dry wood came almost all from the air.',
      },
      says: {
        years: [
          { kid: 'One year of rainwater. The willow grew new branches, and in autumn its leaves fell.', sci: 'Year one. Only rainwater (or distilled water) goes in, and a plate pierced with holes covers the pot against dust.' },
          { kid: 'Two years. See the leaves on the deck? Van Helmont never weighed those!', sci: 'Year two. The leaves shed each autumn were not weighed: van Helmont says so himself.' },
          { kid: 'Three years, and the willow keeps growing. The soil stays in its pot.', sci: 'Year three. Nothing has gone into the pot but water.' },
          { kid: 'Four years! One more to go.', sci: 'Year four: four autumns of fallen leaves, none of them weighed.' },
        ],
        five: { kid: 'Five years! Now tap the willow: we lift it out and weigh it, roots and all.', sci: 'Five years done. Now weigh the tree, then dry the soil and weigh it again.' },
        weighed: {
          kid: '169 pounds of willow! And the soil? It lost only about 2 ounces, almost nothing. So van Helmont decided the whole tree was made of water.',
          sci: 'The willow: 169 lb 3 oz, a gain of about 164 lb. The soil, dried again: 200 lb less about 2 oz. Van Helmont concluded that 164 pounds of wood, bark and roots had come from water alone.',
        },
        sortedNow: {
          kid: 'He was partly right: about half of a living willow is water. But dry the wood, and almost all of it is carbon and oxygen, and those came from the air, from carbon dioxide!',
          sci: 'Fresh wood is often about half water. Dry wood is about 50 % carbon, 43 % oxygen and 6 % hydrogen: the carbon and that oxygen were fixed from atmospheric CO₂, the hydrogen taken from water, and only about 1 %, nitrogen and minerals, came from the soil.',
        },
        sorted: { kid: 'Air, water and a pinch of soil: that is what a tree is made of. Tap the pot to start again.', sci: 'More than nine tenths of the dry mass came from CO₂; the soil gave the ash. Tap the pot to start again.' },
        again: { kid: 'A new willow cutting, 5 pounds, in a pot of 200 pounds of dried soil. Tap the watering can!', sci: 'Start again: a 5 lb cutting in 200 lb of oven-dried soil.' },
        done: { kid: 'This willow has been weighed. Tap the pot to start again.', sci: 'Already weighed: start again with the pot.' },
        notYet: { kid: 'Not yet: the willow must grow for five years first. Tap the watering can.', sci: 'First the five years: water it.' },
        weighFirst: { kid: 'First weigh the willow: tap it.', sci: 'Weigh the willow first: tap the tree.' },
      },
      panel: {
        kid: [
          'Almost 400 years ago, a Flemish doctor and chemist, Jan Baptist van Helmont, wanted to know where a tree\'s wood comes from. He dried 200 pounds of soil in an oven, put it in a big pot, and planted a little willow that weighed 5 pounds.',
          'For five years he gave it only rainwater. Then he weighed the willow: 169 pounds! The soil had lost only about 2 ounces. So he decided the tree was made of water. Tap the watering can for each year, weigh the willow, then find out what it is really made of.',
        ],
        sci: [
          'Jan Baptist van Helmont (Flemish, died 1644) tells of it in Ortus medicinae, published after his death in 1648: 200 lb of oven-dried soil in an earthen pot, moistened with rainwater, a willow of 5 lb planted in it, the pot covered with a plate pierced with holes against dust. After five years the willow weighed 169 lb 3 oz; the soil, dried again, had lost about 2 oz. He did not weigh the leaves shed in four autumns.',
          'He concluded that 164 lb of wood, bark and roots had come from water alone. Water is indeed about half of fresh wood, but the dry mass is about half carbon, fixed from the air\'s CO₂ by photosynthesis, which no one then could imagine. Van Helmont himself coined the word gas, and described the "gas sylvestre" given off by burning charcoal: carbon dioxide, the very gas his willow was eating.',
        ],
      },
    },
    stoma: {
      label: 'The stoma',
      title: 'A door in the leaf',
      dryLabel: 'How dry the air outside is',
      dryFmt: '{v} %',
      verbs: { open: 'Open the stoma', close: 'Close the stoma', dry: 'A hot, dry day', damp: 'A damp day' },
      hints: { open: 'Tap the stoma to open it', close: 'Tap the stoma to close it', wait: 'Wait for the water to come back' },
      signs: { water: 'water in the leaf', stoma: 'stoma' },
      says: {
        open: { kid: 'The door is open! Carbon dioxide comes in for the leaf to use, and water vapour slips out.', sci: 'Open: CO₂ diffuses in toward the chloroplasts, where it is used up; water vapour diffuses out of the nearly saturated air spaces.' },
        close: { kid: 'Closed. Now no water escapes, but no carbon dioxide comes in either.', sci: 'Closed: transpiration almost stops, and so does the supply of CO₂.' },
        night: { kid: 'Open, but it is dark: without light nobody uses the carbon dioxide, and water still escapes. Real leaves close their doors at night.', sci: 'Open in the dark: no CO₂ is fixed without light, while water still leaves. Most plants close their stomata at night.' },
        dry: { kid: 'A hot, dry day: see how fast the water leaves now, and keep an eye on the water gauge!', sci: 'Dry air: a steeper water vapour gradient out of the leaf, so transpiration rises.' },
        damp: { kid: 'A damp day: much less water escapes.', sci: 'Humid air: a shallower vapour gradient, less water lost.' },
        shut: { kid: 'Uh oh, the leaf was drying out! The guard cells went limp and the door shut by itself, to save water.', sci: 'Water deficit: the guard cells lose turgor (signalled by the hormone abscisic acid) and the stoma closes.' },
        thirsty: { kid: 'The guard cells are too limp to open: the leaf needs water first. The vein is bringing some.', sci: 'Not enough turgor to open: wait for the xylem to refill the leaf.' },
      },
      panel: {
        kid: [
          'Leaves breathe through tiny doors called stomata, mostly on their underside, and one leaf has thousands of them. Each door is a gap between two guard cells shaped like beans.',
          'When the guard cells fill with water, they bend apart and the door opens: carbon dioxide comes in, and water vapour goes out. So a leaf has to choose: open to get carbon dioxide, or close to keep its water. Try it on a dry day, and watch the water gauge.',
        ],
        sci: [
          'A stoma (plural stomata) is a pore between two guard cells, often more than 100 per square millimetre on a leaf\'s underside. Guard cells take up potassium ions, water follows by osmosis and their turgor rises; because cellulose fibres hoop round their walls, they bow apart. Blue light opens them; in drought the hormone abscisic acid (ABA) closes them.',
          'Every open stoma trades water for carbon. Inside the leaf the air is nearly saturated with water vapour (about 3 % of the air at 25 °C), while CO₂ is only about 0.04 % of the air outside, and water molecules diffuse about 1.6 times faster than CO₂. So a plant like a willow loses some hundreds of water molecules for every CO₂ it fixes.',
        ],
      },
    },
    catcher: {
      label: 'The carbon catcher',
      title: 'RuBisCO, the carbon catcher',
      sunLabel: 'Sunlight on the leaf',
      verbs: { feed: 'Send a CO₂ to RuBisCO', dim: 'A cloud over the sun', bright: 'The sun out again' },
      hints: { tap: 'Tap a CO₂ molecule', dark: 'Slide the sunlight up, or tap the sunbeam', empty: 'Open the stoma to let CO₂ in', wait: 'Wait for more CO₂ to drift in' },
      signs: { chloroplast: 'chloroplast', starch: 'starch', sugar: 'sugar: {n} of 6 carbons' },
      rows: { carbons: 'Carbons in this sugar', of6: '{n} of 6', sugars: 'Sugars stored as starch' },
      says: {
        first: { kid: 'Snap! RuBisCO caught it. Its carbon goes into the sugar being built: six carbons make one sugar.', sci: 'Carboxylation: RuBisCO fixes CO₂ onto ribulose-1,5-bisphosphate (RuBP). Six fixed carbons make one glucose\'s worth.' },
        sugar: { kid: 'Six carbons caught: a whole sugar! The leaf keeps some as starch for the night and sends the rest down the tree to build wood.', sci: 'Six CO₂ fixed: one hexose, C₆H₁₂O₆. Some is stored as starch in the chloroplast for the night; most leaves as sucrose through the phloem, to become cellulose and lignin.' },
        dark: { kid: 'It is too dark: without light the carbon catcher has no energy. Slide the sunlight up!', sci: 'In the dark there is no ATP or NADPH to rebuild RuBP: the cycle stalls.' },
        stall: { kid: 'The light went out, and the carbon catcher stopped. It holds on to the carbon dioxide and waits.', sci: 'No light, no ATP or NADPH: RuBP is not rebuilt, and fixation stops.' },
        going: { kid: 'Light again: the carbon catcher gets back to work!', sci: 'Light again: the Calvin-Benson cycle turns once more.' },
        dim: { kid: 'A cloud over the sun: dimmer light, a slower catcher.', sci: 'Less light, less ATP and NADPH: fixation slows.' },
        bright: { kid: 'The sun is out: the green stacks glow, and energy flies to RuBisCO.', sci: 'Full light: the thylakoids make ATP and NADPH, which keep the cycle turning.' },
        full: { kid: 'RuBisCO\'s hands are full: give it light so it can work.', sci: 'Every active site is taken: it needs light to turn over.' },
        empty: { kid: 'No more carbon dioxide in here: the stoma is shut. Open it to let more in.', sci: 'The air spaces are running out of CO₂: the stoma is closed.' },
        wait: { kid: 'More carbon dioxide is drifting in through the stoma. Wait a moment.', sci: 'CO₂ is diffusing in through the open stoma.' },
      },
      panel: {
        kid: [
          'Inside the green chloroplasts, a tiny machine called RuBisCO catches carbon dioxide from the air and holds on to its carbon. Six carbons caught make one sugar, and out of sugar a tree builds its wood.',
          'The green stacks catch sunlight and turn it into energy for the work: in the dark, the catcher stops. RuBisCO is slow, only about three catches a second, so plants make huge amounts of it. It may be the most common protein on Earth.',
        ],
        sci: [
          'RuBisCO (ribulose-1,5-bisphosphate carboxylase/oxygenase) fixes CO₂ onto RuBP, a five-carbon sugar, giving two molecules of 3-phosphoglycerate. The Calvin-Benson cycle, traced with carbon-14 in the 1940s and 1950s, turns them into sugar with ATP and NADPH from the light reactions in the thylakoids and rebuilds the RuBP: six turns fix the six carbons of one hexose. Drawn here far too big: a real RuBisCO is about 11 nm across.',
          'It is slow, about 3 CO₂ per second at each active site, and sometimes grabs O₂ by mistake. So leaves are packed with it, up to half of their soluble protein; an estimate from 2019 puts all the RuBisCO on Earth at about 0.7 billion tonnes, which is why it is often called the most abundant protein. The O₂ a leaf gives off comes from water split in the thylakoids, not from CO₂.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Dentro de uma folha',
    greet: {
      kid: 'Uau, encolhemos e ficámos mais pequenos do que as células de uma folha! Eu sou o carbono, e esta folha apanha-me diretamente do ar. Há três coisas para experimentar, e a história da imagem está no cavalete.',
      sci: 'Estamos dentro de uma folha, nos espaços de ar do seu parênquima lacunoso, dezenas de milhares de vezes mais pequenos do que o normal; por cima, as células do parênquima em paliçada, cheias de cloroplastos. Três estações: de onde vem a massa de uma árvore, o estoma e a RuBisCO. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Olha para cima! Aquelas células verdes e altas estão cheias de cloroplastos, as pequenas cozinhas verdes da folha. É lá que a luz do Sol transforma ar e água em açúcar.',
        'Quase metade de um tronco seco é carbono, e todo esse carbono já andou a flutuar no ar como dióxido de carbono. A madeira é feita sobretudo de ar!',
        'O tubo grande lá atrás é uma nervura. Traz água desde as raízes e leva o açúcar para o resto da árvore.',
      ],
      sci: [
        'A fotossíntese numa linha: 6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂. O carbono vem do ar, o hidrogénio da água, e o oxigénio libertado também vem da água.',
        'O ar tem só cerca de 0,04 % de CO₂ (umas 420 partes por milhão), e mesmo assim as plantas terrestres retiram-lhe mais de cem mil milhões de toneladas de carbono por ano.',
        'Uma folha é fina, muitas vezes com poucas décimas de milímetro, para que a luz e o gás cheguem a todas as células. Os estomas deixam entrar o gás; as nervuras trazem água pelo xilema e levam o açúcar pelo floema.',
      ],
    },
    willow: {
      label: 'O salgueiro de van Helmont',
      title: 'O salgueiro de van Helmont',
      years: 'Anos de rega',
      yearsFmt: '{y} de 5',
      verbs: { water: 'Regar durante um ano', weigh: 'Pesar o salgueiro e a terra', sort: 'De que é feito o salgueiro?', again: 'Começar de novo' },
      hints: { water: 'Toca no regador', weigh: 'Toca no salgueiro para o pesar', sort: 'Toca na balança para ver de que é feito', again: 'Toca no vaso para começar de novo' },
      signs: { water: 'água', carbon: 'carbono', oxygen: 'oxigénio', hydrogen: 'hidrogénio', minerals: 'minerais' },
      from: { air: 'do ar', water: 'da água', soil: 'da terra' },
      weights: { treeStart: '5 libras', soilStart: '200 libras', tree: '169 libras e 3 onças', soil: '200 libras, menos cerca de 2 onças' },
      rows: { treeStart: 'Salgueiro no início', soilStart: 'Terra no início, seca', tree: 'Salgueiro ao fim de 5 anos', soil: 'Terra ao fim de 5 anos, seca' },
      board: {
        grow: 'Ano {y} de 5\nNo início: um salgueiro de 5 libras em 200 libras de terra seca. Só leva água da chuva.',
        weighed: 'Ao fim de 5 anos: o salgueiro pesa 169 libras e 3 onças.\nA terra seca: só cerca de 2 onças mais leve!',
        sorted: 'Um salgueiro vivo é cerca de metade água.\nA madeira seca veio quase toda do ar.',
      },
      says: {
        years: [
          { kid: 'Um ano de água da chuva. O salgueiro ganhou ramos novos, e no outono as folhas caíram.', sci: 'Primeiro ano. Só entra água da chuva (ou destilada), e uma placa cheia de furos tapa o vaso contra o pó.' },
          { kid: 'Dois anos. Vês as folhas no estrado? O van Helmont nunca as pesou!', sci: 'Segundo ano. As folhas caídas em cada outono não foram pesadas: é o próprio van Helmont que o diz.' },
          { kid: 'Três anos, e o salgueiro continua a crescer. A terra fica no vaso.', sci: 'Terceiro ano. Para o vaso só foi água.' },
          { kid: 'Quatro anos! Falta só um.', sci: 'Quarto ano: quatro outonos de folhas caídas, nenhuma pesada.' },
        ],
        five: { kid: 'Cinco anos! Agora toca no salgueiro: tiramo-lo do vaso e pesamo-lo, com raízes e tudo.', sci: 'Cinco anos completos. Agora pesa-se a árvore, e depois seca-se a terra e pesa-se outra vez.' },
        weighed: {
          kid: '169 libras de salgueiro! E a terra? Perdeu só cerca de 2 onças, quase nada. Por isso o van Helmont concluiu que a árvore inteira era feita de água.',
          sci: 'O salgueiro: 169 libras e 3 onças, mais cerca de 164 libras. A terra, seca de novo: 200 libras menos cerca de 2 onças. O van Helmont concluiu que 164 libras de madeira, casca e raízes tinham vindo só da água.',
        },
        sortedNow: {
          kid: 'Ele tinha alguma razão: cerca de metade de um salgueiro vivo é água. Mas seca a madeira, e quase tudo o que fica é carbono e oxigénio, e esses vieram do ar, do dióxido de carbono!',
          sci: 'A madeira fresca é muitas vezes cerca de metade água. A madeira seca tem cerca de 50 % de carbono, 43 % de oxigénio e 6 % de hidrogénio: o carbono e esse oxigénio foram fixados a partir do CO₂ da atmosfera, o hidrogénio veio da água, e só cerca de 1 %, azoto e minerais, veio da terra.',
        },
        sorted: { kid: 'Ar, água e uma pitada de terra: é disso que uma árvore é feita. Toca no vaso para começar de novo.', sci: 'Mais de nove décimos da massa seca vieram do CO₂; a terra deu as cinzas. Toca no vaso para começar de novo.' },
        again: { kid: 'Uma nova estaca de salgueiro, com 5 libras, num vaso com 200 libras de terra seca. Toca no regador!', sci: 'De novo: uma estaca de 5 libras em 200 libras de terra seca no forno.' },
        done: { kid: 'Este salgueiro já foi pesado. Toca no vaso para começar de novo.', sci: 'Já pesado: começa de novo pelo vaso.' },
        notYet: { kid: 'Ainda não: primeiro o salgueiro tem de crescer cinco anos. Toca no regador.', sci: 'Primeiro os cinco anos: rega-o.' },
        weighFirst: { kid: 'Primeiro pesa o salgueiro: toca nele.', sci: 'Pesa primeiro o salgueiro: toca na árvore.' },
      },
      panel: {
        kid: [
          'Há quase 400 anos, um médico e químico flamengo, Jan Baptist van Helmont, quis saber de onde vem a madeira de uma árvore. Secou 200 libras de terra num forno, pô-la num vaso grande e plantou um pequeno salgueiro que pesava 5 libras.',
          'Durante cinco anos só lhe deu água da chuva. Depois pesou o salgueiro: 169 libras! A terra tinha perdido só cerca de 2 onças. Por isso concluiu que a árvore era feita de água. Toca no regador para cada ano, pesa o salgueiro e descobre de que é feito na verdade.',
        ],
        sci: [
          'Jan Baptist van Helmont (flamengo, morreu em 1644) conta-o no Ortus medicinae, publicado depois da sua morte, em 1648: 200 libras de terra seca no forno num vaso de barro, humedecida com água da chuva, nela plantado um salgueiro de 5 libras, o vaso tapado com uma placa cheia de furos contra o pó. Ao fim de cinco anos o salgueiro pesava 169 libras e 3 onças; a terra, seca de novo, tinha perdido cerca de 2 onças. Não pesou as folhas caídas em quatro outonos.',
          'Concluiu que 164 libras de madeira, casca e raízes tinham vindo só da água. A água é de facto cerca de metade da madeira fresca, mas a massa seca é cerca de metade carbono, fixado do CO₂ do ar pela fotossíntese, algo que ninguém podia imaginar na época. Foi o próprio van Helmont que inventou a palavra gás, e descreveu o "gas sylvestre" libertado pelo carvão a arder: o dióxido de carbono, o mesmo gás de que o seu salgueiro se alimentava.',
        ],
      },
    },
    stoma: {
      label: 'O estoma',
      title: 'Uma porta na folha',
      dryLabel: 'Quão seco está o ar lá fora',
      dryFmt: '{v} %',
      verbs: { open: 'Abrir o estoma', close: 'Fechar o estoma', dry: 'Um dia quente e seco', damp: 'Um dia húmido' },
      hints: { open: 'Toca no estoma para o abrir', close: 'Toca no estoma para o fechar', wait: 'Espera que a água volte' },
      signs: { water: 'água na folha', stoma: 'estoma' },
      says: {
        open: { kid: 'A porta está aberta! Entra dióxido de carbono para a folha usar, e sai vapor de água.', sci: 'Aberto: o CO₂ difunde-se para dentro, até aos cloroplastos, onde é consumido; o vapor de água difunde-se para fora dos espaços de ar quase saturados.' },
        close: { kid: 'Fechado. Agora não sai água, mas também não entra dióxido de carbono.', sci: 'Fechado: a transpiração quase para, e o fornecimento de CO₂ também.' },
        night: { kid: 'Aberto, mas está escuro: sem luz ninguém usa o dióxido de carbono, e a água continua a sair. As folhas a sério fecham as portas à noite.', sci: 'Aberto no escuro: sem luz não se fixa CO₂, e a água continua a sair. A maioria das plantas fecha os estomas à noite.' },
        dry: { kid: 'Um dia quente e seco: vê como a água sai depressa agora, e não percas de vista o medidor de água!', sci: 'Ar seco: o gradiente de vapor de água para fora da folha é maior, e a transpiração aumenta.' },
        damp: { kid: 'Um dia húmido: sai muito menos água.', sci: 'Ar húmido: gradiente de vapor menor, menos água perdida.' },
        shut: { kid: 'Ai, a folha estava a secar! As células-guarda ficaram moles e a porta fechou-se sozinha, para poupar água.', sci: 'Falta de água: as células-guarda perdem turgescência (sinalizada pela hormona ácido abscísico) e o estoma fecha-se.' },
        thirsty: { kid: 'As células-guarda estão demasiado moles para abrir: primeiro a folha precisa de água. A nervura está a trazer alguma.', sci: 'Sem turgescência para abrir: espera que o xilema volte a encher a folha.' },
      },
      panel: {
        kid: [
          'As folhas respiram por portinhas minúsculas chamadas estomas, sobretudo na parte de baixo, e uma folha tem milhares delas. Cada porta é uma abertura entre duas células-guarda com forma de feijão.',
          'Quando as células-guarda se enchem de água, curvam-se e afastam-se, e a porta abre: entra dióxido de carbono e sai vapor de água. Por isso a folha tem de escolher: abrir para ter dióxido de carbono, ou fechar para guardar a água. Experimenta num dia seco e olha para o medidor de água.',
        ],
        sci: [
          'Um estoma é um poro entre duas células-guarda, muitas vezes mais de 100 por milímetro quadrado na página inferior da folha. As células-guarda absorvem iões de potássio, a água segue-os por osmose e a turgescência aumenta; como as fibras de celulose as envolvem como aros, curvam-se e afastam-se. A luz azul abre-os; na seca, a hormona ácido abscísico (ABA) fecha-os.',
          'Cada estoma aberto troca água por carbono. Dentro da folha o ar está quase saturado de vapor de água (cerca de 3 % do ar a 25 °C), enquanto lá fora o CO₂ é só cerca de 0,04 % do ar, e as moléculas de água difundem-se cerca de 1,6 vezes mais depressa do que as de CO₂. Por isso uma planta como o salgueiro perde algumas centenas de moléculas de água por cada CO₂ que fixa.',
        ],
      },
    },
    catcher: {
      label: 'O apanhador de carbono',
      title: 'A RuBisCO, a apanhadora de carbono',
      sunLabel: 'Luz do Sol na folha',
      verbs: { feed: 'Mandar um CO₂ à RuBisCO', dim: 'Uma nuvem à frente do Sol', bright: 'O Sol de volta' },
      hints: { tap: 'Toca numa molécula de CO₂', dark: 'Sobe a luz do Sol, ou toca no raio de sol', empty: 'Abre o estoma para entrar CO₂', wait: 'Espera que entre mais CO₂' },
      signs: { chloroplast: 'cloroplasto', starch: 'amido', sugar: 'açúcar: {n} de 6 carbonos' },
      rows: { carbons: 'Carbonos neste açúcar', of6: '{n} de 6', sugars: 'Açúcares guardados como amido' },
      says: {
        first: { kid: 'Zás! A RuBisCO apanhou-a. O carbono vai para o açúcar que está a ser construído: seis carbonos fazem um açúcar.', sci: 'Carboxilação: a RuBisCO fixa o CO₂ na ribulose-1,5-bisfosfato (RuBP). Seis carbonos fixados dão o equivalente a uma glucose.' },
        sugar: { kid: 'Seis carbonos apanhados: um açúcar inteiro! A folha guarda algum como amido para a noite e manda o resto pela árvore abaixo para fazer madeira.', sci: 'Seis CO₂ fixados: uma hexose, C₆H₁₂O₆. Parte fica guardada como amido no cloroplasto para a noite; a maior parte sai como sacarose pelo floema, para se tornar celulose e lenhina.' },
        dark: { kid: 'Está demasiado escuro: sem luz, o apanhador de carbono não tem energia. Sobe a luz do Sol!', sci: 'No escuro não há ATP nem NADPH para refazer a RuBP: o ciclo para.' },
        stall: { kid: 'A luz apagou-se e o apanhador de carbono parou. Fica agarrado ao dióxido de carbono, à espera.', sci: 'Sem luz, sem ATP nem NADPH: a RuBP não é refeita e a fixação para.' },
        going: { kid: 'Luz outra vez: o apanhador de carbono volta ao trabalho!', sci: 'Luz outra vez: o ciclo de Calvin-Benson volta a girar.' },
        dim: { kid: 'Uma nuvem à frente do Sol: menos luz, um apanhador mais lento.', sci: 'Menos luz, menos ATP e NADPH: a fixação abranda.' },
        bright: { kid: 'O Sol está de volta: as pilhas verdes brilham e a energia voa até à RuBisCO.', sci: 'Luz plena: os tilacoides fazem ATP e NADPH, que mantêm o ciclo a girar.' },
        full: { kid: 'A RuBisCO tem as mãos cheias: dá-lhe luz para poder trabalhar.', sci: 'Todos os locais ativos estão ocupados: precisa de luz para avançar.' },
        empty: { kid: 'Já não há dióxido de carbono aqui dentro: o estoma está fechado. Abre-o para entrar mais.', sci: 'Os espaços de ar estão a ficar sem CO₂: o estoma está fechado.' },
        wait: { kid: 'Está a entrar mais dióxido de carbono pelo estoma. Espera um bocadinho.', sci: 'O CO₂ está a difundir-se pelo estoma aberto.' },
      },
      panel: {
        kid: [
          'Dentro dos cloroplastos verdes, uma máquina minúscula chamada RuBisCO apanha dióxido de carbono do ar e fica com o seu carbono. Seis carbonos apanhados fazem um açúcar, e é com açúcar que a árvore constrói a sua madeira.',
          'As pilhas verdes apanham a luz do Sol e transformam-na em energia para o trabalho: no escuro, o apanhador para. A RuBisCO é lenta, só cerca de três apanhas por segundo, por isso as plantas fazem quantidades enormes dela. Talvez seja a proteína mais comum da Terra.',
        ],
        sci: [
          'A RuBisCO (ribulose-1,5-bisfosfato carboxilase/oxigenase) fixa o CO₂ na RuBP, um açúcar de cinco carbonos, dando duas moléculas de 3-fosfoglicerato. O ciclo de Calvin-Benson, seguido com carbono-14 nos anos 1940 e 1950, transforma-as em açúcar com ATP e NADPH das reações luminosas nos tilacoides e refaz a RuBP: seis voltas fixam os seis carbonos de uma hexose. Aqui desenhada grande demais: uma RuBisCO real tem cerca de 11 nm.',
          'É lenta, cerca de 3 CO₂ por segundo em cada local ativo, e às vezes agarra O₂ por engano. Por isso as folhas estão cheias dela, até metade da sua proteína solúvel; uma estimativa de 2019 aponta para cerca de 0,7 mil milhões de toneladas de RuBisCO na Terra, e é por isso que é muitas vezes chamada a proteína mais abundante. O O₂ que a folha liberta vem da água partida nos tilacoides, não do CO₂.',
        ],
      },
    },
  },
  pl: {
    title: 'Wewnątrz liścia',
    greet: {
      kid: 'Cześć! Jestem Węgiel. Zmalaliśmy, jesteśmy mniejsi niż komórki liścia! Ten liść łapie mnie prosto z powietrza. Są tu trzy rzeczy do wypróbowania, a historia obrazka jest na sztaludze.',
      sci: 'Cześć! Jestem Węgiel. Jesteśmy w liściu, w przestworach międzykomórkowych miękiszu gąbczastego, dziesiątki tysięcy razy mniejsi niż zwykle; nad nami komórki miękiszu palisadowego pełne chloroplastów. Trzy stanowiska: skąd bierze się masa drzewa, aparat szparkowy i RuBisCO. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Spójrz w górę! Te wysokie zielone komórki są pełne chloroplastów, małych zielonych kuchni liścia. To tam światło słoneczne zamienia powietrze i wodę w cukier.',
        'Prawie połowa suchego polana to węgiel, a cały ten węgiel unosił się kiedyś w powietrzu jako dwutlenek węgla. Drewno jest zrobione głównie z powietrza!',
        'Ta duża rura z tyłu to wiązka przewodząca, żyłka liścia. Przynosi wodę aż od korzeni i odprowadza cukier do reszty drzewa.',
      ],
      sci: [
        'Fotosynteza w jednej linijce: 6 CO₂ + 6 H₂O + światło → C₆H₁₂O₆ + 6 O₂. Węgiel pochodzi z powietrza, wodór z wody, a wydzielany tlen też z wody.',
        'Powietrze zawiera tylko około 0,04 % CO₂ (jakieś 420 części na milion), a mimo to rośliny lądowe pobierają z niego co roku ponad sto miliardów ton węgla.',
        'Liść jest cienki, często ma kilka dziesiątych milimetra, więc światło i gaz docierają do każdej komórki. Aparaty szparkowe wpuszczają gaz; wiązki przewodzące doprowadzają wodę ksylemem i odprowadzają cukier floemem.',
      ],
    },
    willow: {
      label: 'Wierzba van Helmonta',
      title: 'Wierzba van Helmonta',
      years: 'Lata podlewania',
      yearsFmt: '{y} z 5',
      verbs: { water: 'Podlewaj przez rok', weigh: 'Zważ wierzbę i ziemię', sort: 'Z czego jest zrobiona wierzba?', again: 'Zacznij od nowa' },
      hints: { water: 'Dotknij konewki', weigh: 'Dotknij wierzby, żeby ją zważyć', sort: 'Dotknij wagi, żeby zobaczyć, z czego jest zrobiona', again: 'Dotknij donicy, żeby zacząć od nowa' },
      signs: { water: 'woda', carbon: 'węgiel', oxygen: 'tlen', hydrogen: 'wodór', minerals: 'minerały' },
      from: { air: 'z powietrza', water: 'z wody', soil: 'z ziemi' },
      weights: { treeStart: '5 funtów', soilStart: '200 funtów', tree: '169 funtów i 3 uncje', soil: '200 funtów, bez około 2 uncji' },
      rows: { treeStart: 'Wierzba na początku', soilStart: 'Ziemia na początku, wysuszona', tree: 'Wierzba po 5 latach', soil: 'Ziemia po 5 latach, wysuszona' },
      board: {
        grow: 'Rok {y} z 5\nNa początku: wierzba ważąca 5 funtów w 200 funtach suchej ziemi. Dostaje tylko deszczówkę.',
        weighed: 'Po 5 latach: wierzba waży 169 funtów i 3 uncje.\nSucha ziemia: lżejsza tylko o około 2 uncje!',
        sorted: 'Żywa wierzba to w około połowie woda.\nSuche drewno wzięło się prawie całe z powietrza.',
      },
      says: {
        years: [
          { kid: 'Rok deszczówki. Wierzba wypuściła nowe gałęzie, a jesienią spadły jej liście.', sci: 'Rok pierwszy. Dolewa się tylko deszczówkę (albo wodę destylowaną), a donicę przykrywa płyta z mnóstwem dziurek, przed kurzem.' },
          { kid: 'Dwa lata. Widzisz liście na podeście? Van Helmont nigdy ich nie zważył!', sci: 'Rok drugi. Liści opadłych każdej jesieni nie ważono: van Helmont sam o tym pisze.' },
          { kid: 'Trzy lata, a wierzba ciągle rośnie. Ziemia zostaje w donicy.', sci: 'Rok trzeci. Do donicy trafiła tylko woda.' },
          { kid: 'Cztery lata! Został jeszcze jeden.', sci: 'Rok czwarty: liście z czterech jesieni, żadnego nie zważono.' },
        ],
        five: { kid: 'Pięć lat! Teraz dotknij wierzby: wyjmiemy ją i zważymy, razem z korzeniami.', sci: 'Pięć lat minęło. Teraz waży się drzewo, a potem suszy ziemię i waży ją jeszcze raz.' },
        weighed: {
          kid: '169 funtów wierzby! A ziemia? Straciła tylko około 2 uncji, prawie nic. Dlatego van Helmont uznał, że całe drzewo jest zrobione z wody.',
          sci: 'Wierzba: 169 funtów i 3 uncje, przybyło około 164 funtów. Ziemia, wysuszona ponownie: 200 funtów bez około 2 uncji. Van Helmont wywnioskował, że 164 funty drewna, kory i korzeni powstały z samej wody.',
        },
        sortedNow: {
          kid: 'Trochę miał racji: żywa wierzba to w około połowie woda. Ale wysusz drewno, a prawie wszystko, co zostanie, to węgiel i tlen, a one przyszły z powietrza, z dwutlenku węgla!',
          sci: 'Świeże drewno to często w około połowie woda. Suche drewno zawiera około 50 % węgla, 43 % tlenu i 6 % wodoru: węgiel i ten tlen zostały związane z atmosferycznego CO₂, wodór pochodzi z wody, a tylko około 1 %, azot i minerały, z ziemi.',
        },
        sorted: { kid: 'Powietrze, woda i szczypta ziemi: z tego jest zrobione drzewo. Dotknij donicy, żeby zacząć od nowa.', sci: 'Ponad dziewięć dziesiątych suchej masy pochodzi z CO₂; ziemia dała popiół. Dotknij donicy, żeby zacząć od nowa.' },
        again: { kid: 'Nowa sadzonka wierzby, 5 funtów, w donicy z 200 funtami suchej ziemi. Dotknij konewki!', sci: 'Od nowa: sadzonka ważąca 5 funtów w 200 funtach ziemi wysuszonej w piecu.' },
        done: { kid: 'Ta wierzba jest już zważona. Dotknij donicy, żeby zacząć od nowa.', sci: 'Już zważona: zacznij od nowa od donicy.' },
        notYet: { kid: 'Jeszcze nie: najpierw wierzba musi rosnąć pięć lat. Dotknij konewki.', sci: 'Najpierw pięć lat: podlewaj ją.' },
        weighFirst: { kid: 'Najpierw zważ wierzbę: dotknij jej.', sci: 'Najpierw zważ wierzbę: dotknij drzewa.' },
      },
      panel: {
        kid: [
          'Prawie 400 lat temu flamandzki lekarz i chemik, Jan Baptist van Helmont, chciał się dowiedzieć, skąd się bierze drewno drzewa. Wysuszył w piecu 200 funtów ziemi, włożył ją do dużej donicy i posadził małą wierzbę ważącą 5 funtów.',
          'Przez pięć lat podlewał ją tylko deszczówką. Potem zważył wierzbę: 169 funtów! Ziemia straciła tylko około 2 uncji. Uznał więc, że drzewo jest zrobione z wody. Dotknij konewki raz na każdy rok, zważ wierzbę i sprawdź, z czego jest naprawdę zrobiona.',
        ],
        sci: [
          'Jan Baptist van Helmont (Flamand, zm. 1644) opisuje to w dziele Ortus medicinae, wydanym po jego śmierci, w 1648 roku: 200 funtów wysuszonej w piecu ziemi w glinianym naczyniu, zwilżonej deszczówką, posadzona w niej wierzba ważąca 5 funtów, naczynie przykryte płytą z mnóstwem dziurek przed kurzem. Po pięciu latach wierzba ważyła 169 funtów i 3 uncje; ziemia, wysuszona ponownie, straciła około 2 uncji. Nie zważył liści opadłych przez cztery jesienie.',
          'Wywnioskował, że 164 funty drewna, kory i korzeni powstały z samej wody. Woda to rzeczywiście około połowy świeżego drewna, ale sucha masa to w około połowie węgiel, związany z CO₂ z powietrza w fotosyntezie, czego nikt wtedy nie mógł sobie wyobrazić. To sam van Helmont wymyślił słowo gaz i opisał „gas sylvestre” wydzielany przez palący się węgiel drzewny: dwutlenek węgla, ten sam gaz, którym żywiła się jego wierzba.',
        ],
      },
    },
    stoma: {
      label: 'Aparat szparkowy',
      title: 'Drzwi w liściu',
      dryLabel: 'Jak suche jest powietrze na zewnątrz',
      dryFmt: '{v} %',
      verbs: { open: 'Otwórz szparkę', close: 'Zamknij szparkę', dry: 'Gorący, suchy dzień', damp: 'Wilgotny dzień' },
      hints: { open: 'Dotknij aparatu szparkowego, żeby go otworzyć', close: 'Dotknij aparatu szparkowego, żeby go zamknąć', wait: 'Poczekaj, aż wróci woda' },
      signs: { water: 'woda w liściu', stoma: 'aparat szparkowy' },
      says: {
        open: { kid: 'Drzwi są otwarte! Wchodzi dwutlenek węgla, którego liść potrzebuje, a wymyka się para wodna.', sci: 'Otwarty: CO₂ dyfunduje do środka, ku chloroplastom, gdzie jest zużywany; para wodna dyfunduje na zewnątrz z prawie nasyconych przestworów.' },
        close: { kid: 'Zamknięte. Teraz woda nie ucieka, ale dwutlenek węgla też nie wchodzi.', sci: 'Zamknięty: transpiracja prawie ustaje, a z nią dopływ CO₂.' },
        night: { kid: 'Otwarte, ale jest ciemno: bez światła nikt nie używa dwutlenku węgla, a woda dalej ucieka. Prawdziwe liście zamykają drzwi na noc.', sci: 'Otwarty w ciemności: bez światła CO₂ nie jest wiązany, a woda dalej ucieka. Większość roślin zamyka aparaty szparkowe na noc.' },
        dry: { kid: 'Gorący, suchy dzień: zobacz, jak szybko teraz ucieka woda, i pilnuj wskaźnika wody!', sci: 'Suche powietrze: większy gradient pary wodnej na zewnątrz liścia, więc transpiracja rośnie.' },
        damp: { kid: 'Wilgotny dzień: ucieka dużo mniej wody.', sci: 'Wilgotne powietrze: mniejszy gradient pary, mniejsza utrata wody.' },
        shut: { kid: 'Ojej, liść wysychał! Komórki szparkowe zwiotczały i drzwi zamknęły się same, żeby oszczędzić wodę.', sci: 'Niedobór wody: komórki szparkowe tracą turgor (sygnałem jest hormon kwas abscysynowy) i szparka się zamyka.' },
        thirsty: { kid: 'Komórki szparkowe są za wiotkie, żeby się otworzyć: liść najpierw potrzebuje wody. Żyłka już ją przynosi.', sci: 'Za mały turgor, żeby otworzyć: poczekaj, aż ksylem znów napełni liść.' },
      },
      panel: {
        kid: [
          'Liście oddychają przez malutkie drzwi zwane aparatami szparkowymi, głównie od spodu, a jeden liść ma ich tysiące. Każde drzwi to szparka między dwiema komórkami szparkowymi w kształcie fasolek.',
          'Kiedy komórki szparkowe napełniają się wodą, wyginają się i rozchodzą, a drzwi się otwierają: wchodzi dwutlenek węgla, wychodzi para wodna. Liść musi więc wybierać: otworzyć się po dwutlenek węgla albo zamknąć, żeby zatrzymać wodę. Spróbuj w suchy dzień i patrz na wskaźnik wody.',
        ],
        sci: [
          'Aparat szparkowy to dwie komórki szparkowe ze szparką między nimi, często ponad 100 na milimetr kwadratowy na spodniej stronie liścia. Komórki szparkowe pobierają jony potasu, woda napływa za nimi przez osmozę i rośnie turgor; ponieważ włókna celulozy oplatają ich ściany jak obręcze, wyginają się i rozchodzą. Światło niebieskie je otwiera; w czasie suszy hormon kwas abscysynowy (ABA) je zamyka.',
          'Każda otwarta szparka wymienia wodę na węgiel. W liściu powietrze jest prawie nasycone parą wodną (około 3 % powietrza w 25 °C), a CO₂ to na zewnątrz tylko około 0,04 % powietrza, przy czym cząsteczki wody dyfundują około 1,6 razy szybciej niż CO₂. Dlatego roślina taka jak wierzba traci kilkaset cząsteczek wody na każdą związaną cząsteczkę CO₂.',
        ],
      },
    },
    catcher: {
      label: 'Łapacz węgla',
      title: 'RuBisCO, łapacz węgla',
      sunLabel: 'Światło słoneczne na liściu',
      verbs: { feed: 'Wyślij CO₂ do RuBisCO', dim: 'Chmura zasłania słońce', bright: 'Znów słońce' },
      hints: { tap: 'Dotknij cząsteczki CO₂', dark: 'Zwiększ światło słoneczne albo dotknij promienia słońca', empty: 'Otwórz aparat szparkowy, żeby wpuścić CO₂', wait: 'Poczekaj, aż napłynie więcej CO₂' },
      signs: { chloroplast: 'chloroplast', starch: 'skrobia', sugar: 'cukier: {n} z 6 atomów węgla' },
      rows: { carbons: 'Atomy węgla w tym cukrze', of6: '{n} z 6', sugars: 'Cukry zmagazynowane jako skrobia' },
      says: {
        first: { kid: 'Cap! RuBisCO ją złapał. Jej węgiel trafia do budowanego cukru: sześć atomów węgla to jeden cukier.', sci: 'Karboksylacja: RuBisCO przyłącza CO₂ do rybulozo-1,5-bisfosforanu (RuBP). Sześć związanych atomów węgla to równowartość jednej glukozy.' },
        sugar: { kid: 'Sześć atomów węgla złapanych: cały cukier! Liść zatrzymuje trochę jako skrobię na noc, a resztę wysyła w dół drzewa, żeby budować drewno.', sci: 'Sześć związanych CO₂: jedna heksoza, C₆H₁₂O₆. Część zostaje w chloroplaście jako skrobia na noc; większość odpływa floemem jako sacharoza, by stać się celulozą i ligniną.' },
        dark: { kid: 'Jest za ciemno: bez światła łapacz węgla nie ma energii. Zwiększ światło słoneczne!', sci: 'W ciemności nie ma ATP ani NADPH, by odtworzyć RuBP: cykl staje.' },
        stall: { kid: 'Światło zgasło i łapacz węgla stanął. Trzyma dwutlenek węgla i czeka.', sci: 'Bez światła nie ma ATP ani NADPH: RuBP nie jest odtwarzany i wiązanie ustaje.' },
        going: { kid: 'Znów jest światło: łapacz węgla wraca do pracy!', sci: 'Znów światło: cykl Calvina-Bensona znów się kręci.' },
        dim: { kid: 'Chmura zasłania słońce: mniej światła, wolniejszy łapacz.', sci: 'Mniej światła, mniej ATP i NADPH: wiązanie zwalnia.' },
        bright: { kid: 'Wyszło słońce: zielone stosy świecą, a energia leci do RuBisCO.', sci: 'Pełne światło: tylakoidy wytwarzają ATP i NADPH, które napędzają cykl.' },
        full: { kid: 'RuBisCO ma pełne ręce: daj mu światło, żeby mógł pracować.', sci: 'Wszystkie centra aktywne są zajęte: potrzeba światła, by ruszył dalej.' },
        empty: { kid: 'Nie ma tu już dwutlenku węgla: aparat szparkowy jest zamknięty. Otwórz go, żeby wpuścić więcej.', sci: 'W przestworach kończy się CO₂: aparat szparkowy jest zamknięty.' },
        wait: { kid: 'Przez aparat szparkowy napływa więcej dwutlenku węgla. Poczekaj chwilkę.', sci: 'CO₂ dyfunduje przez otwartą szparkę.' },
      },
      panel: {
        kid: [
          'W zielonych chloroplastach malutka maszyna o nazwie RuBisCO łapie dwutlenek węgla z powietrza i zatrzymuje jego węgiel. Sześć złapanych atomów węgla to jeden cukier, a z cukru drzewo buduje swoje drewno.',
          'Zielone stosy łapią światło słoneczne i zamieniają je w energię do pracy: w ciemności łapacz staje. RuBisCO jest powolny, łapie tylko około trzech cząsteczek na sekundę, więc rośliny robią go ogromnie dużo. Może to najpowszechniejsze białko na Ziemi.',
        ],
        sci: [
          'RuBisCO (karboksylaza/oksygenaza rybulozo-1,5-bisfosforanu) przyłącza CO₂ do RuBP, cukru o pięciu atomach węgla, dając dwie cząsteczki 3-fosfoglicerynianu. Cykl Calvina-Bensona, prześledzony dzięki węglowi-14 w latach 40. i 50. XX wieku, zamienia je w cukier przy użyciu ATP i NADPH z fazy jasnej w tylakoidach i odtwarza RuBP: sześć obrotów wiąże sześć atomów węgla jednej heksozy. Narysowany tu o wiele za duży: prawdziwy RuBisCO ma około 11 nm średnicy.',
          'Jest powolny, około 3 CO₂ na sekundę w każdym centrum aktywnym, i czasem przez pomyłkę chwyta O₂. Dlatego liście są go pełne, aż do połowy ich rozpuszczalnego białka; szacunek z 2019 roku podaje, że na Ziemi jest około 0,7 miliarda ton RuBisCO, i dlatego często nazywa się go najpowszechniejszym białkiem. O₂ wydzielany przez liść pochodzi z wody rozszczepianej w tylakoidach, nie z CO₂.',
        ],
      },
    },
  },
  de: {
    title: 'Im Inneren eines Blattes',
    greet: {
      kid: 'Hallo! Ich bin der Kohlenstoff. Wir sind kleiner geworden als die Zellen eines Blattes! Dieses Blatt fängt mich direkt aus der Luft. Hier gibt es drei Dinge zum Ausprobieren, und die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Hallo! Ich bin der Kohlenstoff. Wir sind in einem Blatt, in den Luftlücken seines Schwammgewebes, zehntausende Male kleiner als sonst; über uns die Zellen des Palisadengewebes voller Chloroplasten. Drei Stationen: woher die Masse eines Baumes kommt, die Spaltöffnung und RuBisCO. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Schau nach oben! Diese hohen grünen Zellen sind voller Chloroplasten, den kleinen grünen Küchen des Blattes. Dort macht das Sonnenlicht aus Luft und Wasser Zucker.',
        'Fast die Hälfte eines trockenen Holzscheits ist Kohlenstoff, und dieser ganze Kohlenstoff ist einmal als Kohlenstoffdioxid durch die Luft geschwebt. Holz ist vor allem aus Luft gemacht!',
        'Das dicke Rohr hinten ist eine Blattader. Sie bringt Wasser von den Wurzeln ganz nach oben und trägt Zucker zum Rest des Baumes.',
      ],
      sci: [
        'Fotosynthese in einer Zeile: 6 CO₂ + 6 H₂O + Licht → C₆H₁₂O₆ + 6 O₂. Der Kohlenstoff kommt aus der Luft, der Wasserstoff aus dem Wasser und der abgegebene Sauerstoff ebenfalls aus dem Wasser.',
        'Luft enthält nur etwa 0,04 % CO₂ (rund 420 Teile pro Million), und doch holen Landpflanzen jedes Jahr mehr als hundert Milliarden Tonnen Kohlenstoff aus ihr.',
        'Ein Blatt ist dünn, oft nur wenige Zehntelmillimeter, damit Licht und Gas jede Zelle erreichen. Die Spaltöffnungen lassen das Gas herein; die Leitbündel bringen Wasser im Xylem und tragen Zucker im Phloem fort.',
      ],
    },
    willow: {
      label: 'Van Helmonts Weide',
      title: 'Van Helmonts Weide',
      years: 'Jahre des Gießens',
      yearsFmt: '{y} von 5',
      verbs: { water: 'Ein Jahr lang gießen', weigh: 'Weide und Erde wiegen', sort: 'Woraus besteht die Weide?', again: 'Von vorn beginnen' },
      hints: { water: 'Tippe auf die Gießkanne', weigh: 'Tippe auf die Weide, um sie zu wiegen', sort: 'Tippe auf die Waage, um zu sehen, woraus sie besteht', again: 'Tippe auf den Topf, um von vorn zu beginnen' },
      signs: { water: 'Wasser', carbon: 'Kohlenstoff', oxygen: 'Sauerstoff', hydrogen: 'Wasserstoff', minerals: 'Mineralstoffe' },
      from: { air: 'aus der Luft', water: 'aus Wasser', soil: 'aus der Erde' },
      weights: { treeStart: '5 Pfund', soilStart: '200 Pfund', tree: '169 Pfund 3 Unzen', soil: '200 Pfund, weniger etwa 2 Unzen' },
      rows: { treeStart: 'Weide am Anfang', soilStart: 'Erde am Anfang, getrocknet', tree: 'Weide nach 5 Jahren', soil: 'Erde nach 5 Jahren, getrocknet' },
      board: {
        grow: 'Jahr {y} von 5\nAm Anfang: eine Weide von 5 Pfund in 200 Pfund getrockneter Erde. Sie bekommt nur Regenwasser.',
        weighed: 'Nach 5 Jahren: Die Weide wiegt 169 Pfund 3 Unzen.\nDie getrocknete Erde: nur etwa 2 Unzen leichter!',
        sorted: 'Eine lebende Weide ist etwa zur Hälfte Wasser.\nDas trockene Holz kam fast ganz aus der Luft.',
      },
      says: {
        years: [
          { kid: 'Ein Jahr Regenwasser. Die Weide hat neue Zweige bekommen, und im Herbst sind ihre Blätter gefallen.', sci: 'Erstes Jahr. Nur Regenwasser (oder destilliertes Wasser) kommt hinein, und eine Platte voller Löcher deckt den Topf gegen Staub ab.' },
          { kid: 'Zwei Jahre. Siehst du die Blätter auf dem Podest? Die hat van Helmont nie gewogen!', sci: 'Zweites Jahr. Die in jedem Herbst abgefallenen Blätter wurden nicht gewogen: Das schreibt van Helmont selbst.' },
          { kid: 'Drei Jahre, und die Weide wächst weiter. Die Erde bleibt in ihrem Topf.', sci: 'Drittes Jahr. In den Topf kam nichts als Wasser.' },
          { kid: 'Vier Jahre! Noch eins.', sci: 'Viertes Jahr: vier Herbste voller abgefallener Blätter, keines davon gewogen.' },
        ],
        five: { kid: 'Fünf Jahre! Tippe jetzt auf die Weide: Wir heben sie heraus und wiegen sie, mit allen Wurzeln.', sci: 'Fünf Jahre sind um. Jetzt wird der Baum gewogen, dann die Erde getrocknet und noch einmal gewogen.' },
        weighed: {
          kid: '169 Pfund Weide! Und die Erde? Sie hat nur etwa 2 Unzen verloren, fast nichts. Darum meinte van Helmont, der ganze Baum sei aus Wasser gemacht.',
          sci: 'Die Weide: 169 Pfund 3 Unzen, ein Zuwachs von etwa 164 Pfund. Die Erde, erneut getrocknet: 200 Pfund weniger etwa 2 Unzen. Van Helmont schloss, dass 164 Pfund Holz, Rinde und Wurzeln allein aus Wasser entstanden seien.',
        },
        sortedNow: {
          kid: 'Ein bisschen hatte er recht: Eine lebende Weide ist etwa zur Hälfte Wasser. Aber trockne das Holz, und fast alles, was übrig bleibt, ist Kohlenstoff und Sauerstoff, und die kamen aus der Luft, aus dem Kohlenstoffdioxid!',
          sci: 'Frisches Holz ist oft etwa zur Hälfte Wasser. Trockenes Holz besteht zu etwa 50 % aus Kohlenstoff, 43 % Sauerstoff und 6 % Wasserstoff: Der Kohlenstoff und dieser Sauerstoff wurden aus dem CO₂ der Atmosphäre gebunden, der Wasserstoff stammt aus Wasser, und nur etwa 1 %, Stickstoff und Mineralstoffe, kam aus der Erde.',
        },
        sorted: { kid: 'Luft, Wasser und eine Prise Erde: Daraus ist ein Baum gemacht. Tippe auf den Topf, um von vorn zu beginnen.', sci: 'Mehr als neun Zehntel der Trockenmasse stammen aus CO₂; die Erde lieferte die Asche. Tippe auf den Topf, um von vorn zu beginnen.' },
        again: { kid: 'Ein neuer Weidensteckling, 5 Pfund, in einem Topf mit 200 Pfund getrockneter Erde. Tippe auf die Gießkanne!', sci: 'Von vorn: ein Steckling von 5 Pfund in 200 Pfund im Ofen getrockneter Erde.' },
        done: { kid: 'Diese Weide ist schon gewogen. Tippe auf den Topf, um von vorn zu beginnen.', sci: 'Schon gewogen: Beginne mit dem Topf von vorn.' },
        notYet: { kid: 'Noch nicht: Erst muss die Weide fünf Jahre wachsen. Tippe auf die Gießkanne.', sci: 'Erst die fünf Jahre: Gieß sie.' },
        weighFirst: { kid: 'Wieg zuerst die Weide: Tippe auf sie.', sci: 'Wieg zuerst die Weide: Tippe auf den Baum.' },
      },
      panel: {
        kid: [
          'Vor fast 400 Jahren wollte ein flämischer Arzt und Chemiker, Jan Baptist van Helmont, wissen, woher das Holz eines Baumes kommt. Er trocknete 200 Pfund Erde in einem Ofen, füllte sie in einen großen Topf und pflanzte eine kleine Weide hinein, die 5 Pfund wog.',
          'Fünf Jahre lang gab er ihr nur Regenwasser. Dann wog er die Weide: 169 Pfund! Die Erde hatte nur etwa 2 Unzen verloren. Also meinte er, der Baum sei aus Wasser gemacht. Tippe für jedes Jahr auf die Gießkanne, wieg die Weide und finde heraus, woraus sie wirklich besteht.',
        ],
        sci: [
          'Jan Baptist van Helmont (Flame, gestorben 1644) beschreibt es in Ortus medicinae, nach seinem Tod 1648 erschienen: 200 Pfund im Ofen getrocknete Erde in einem irdenen Gefäß, mit Regenwasser befeuchtet, darin eine Weide von 5 Pfund gepflanzt, das Gefäß gegen Staub mit einer durchlöcherten Platte abgedeckt. Nach fünf Jahren wog die Weide 169 Pfund 3 Unzen; die erneut getrocknete Erde hatte etwa 2 Unzen verloren. Die in vier Herbsten abgefallenen Blätter wog er nicht.',
          'Er schloss, dass 164 Pfund Holz, Rinde und Wurzeln allein aus Wasser entstanden seien. Wasser ist tatsächlich etwa die Hälfte frischen Holzes, aber die Trockenmasse ist etwa zur Hälfte Kohlenstoff, durch Fotosynthese aus dem CO₂ der Luft gebunden, was sich damals niemand vorstellen konnte. Van Helmont selbst prägte das Wort Gas und beschrieb das „gas sylvestre“ aus brennender Holzkohle: Kohlenstoffdioxid, genau das Gas, von dem seine Weide lebte.',
        ],
      },
    },
    stoma: {
      label: 'Die Spaltöffnung',
      title: 'Eine Tür im Blatt',
      dryLabel: 'Wie trocken die Luft draußen ist',
      dryFmt: '{v} %',
      verbs: { open: 'Spaltöffnung öffnen', close: 'Spaltöffnung schließen', dry: 'Ein heißer, trockener Tag', damp: 'Ein feuchter Tag' },
      hints: { open: 'Tippe auf die Spaltöffnung, um sie zu öffnen', close: 'Tippe auf die Spaltöffnung, um sie zu schließen', wait: 'Warte, bis das Wasser zurückkommt' },
      signs: { water: 'Wasser im Blatt', stoma: 'Spaltöffnung' },
      says: {
        open: { kid: 'Die Tür ist offen! Kohlenstoffdioxid kommt herein, damit das Blatt es nutzen kann, und Wasserdampf schlüpft hinaus.', sci: 'Offen: CO₂ diffundiert hinein zu den Chloroplasten, wo es verbraucht wird; Wasserdampf diffundiert aus den fast gesättigten Luftlücken hinaus.' },
        close: { kid: 'Zu. Jetzt entweicht kein Wasser mehr, aber es kommt auch kein Kohlenstoffdioxid herein.', sci: 'Geschlossen: Die Transpiration hört fast auf, und die CO₂-Zufuhr auch.' },
        night: { kid: 'Offen, aber es ist dunkel: Ohne Licht braucht niemand das Kohlenstoffdioxid, und Wasser entweicht trotzdem. Echte Blätter schließen ihre Türen nachts.', sci: 'Offen im Dunkeln: Ohne Licht wird kein CO₂ gebunden, aber Wasser entweicht weiter. Die meisten Pflanzen schließen ihre Spaltöffnungen nachts.' },
        dry: { kid: 'Ein heißer, trockener Tag: Schau, wie schnell das Wasser jetzt entweicht, und behalte die Wasseranzeige im Blick!', sci: 'Trockene Luft: ein steileres Wasserdampfgefälle aus dem Blatt, also steigt die Transpiration.' },
        damp: { kid: 'Ein feuchter Tag: Es entweicht viel weniger Wasser.', sci: 'Feuchte Luft: ein flacheres Dampfgefälle, weniger Wasserverlust.' },
        shut: { kid: 'Oje, das Blatt ist ausgetrocknet! Die Schließzellen sind schlaff geworden, und die Tür ist von selbst zugegangen, um Wasser zu sparen.', sci: 'Wassermangel: Die Schließzellen verlieren Turgor (Signal ist das Hormon Abscisinsäure), und die Spaltöffnung schließt sich.' },
        thirsty: { kid: 'Die Schließzellen sind zu schlaff zum Öffnen: Das Blatt braucht erst Wasser. Die Blattader bringt schon welches.', sci: 'Zu wenig Turgor zum Öffnen: Warte, bis das Xylem das Blatt wieder füllt.' },
      },
      panel: {
        kid: [
          'Blätter atmen durch winzige Türen, die Spaltöffnungen, meist auf ihrer Unterseite, und ein Blatt hat Tausende davon. Jede Tür ist ein Spalt zwischen zwei Schließzellen, die wie Bohnen geformt sind.',
          'Wenn sich die Schließzellen mit Wasser füllen, biegen sie sich auseinander und die Tür geht auf: Kohlenstoffdioxid kommt herein, Wasserdampf geht hinaus. Ein Blatt muss also wählen: öffnen, um Kohlenstoffdioxid zu bekommen, oder schließen, um sein Wasser zu behalten. Probier es an einem trockenen Tag und schau auf die Wasseranzeige.',
        ],
        sci: [
          'Eine Spaltöffnung (Stoma, Mehrzahl Stomata) ist eine Pore zwischen zwei Schließzellen, oft mehr als 100 pro Quadratmillimeter auf der Blattunterseite. Die Schließzellen nehmen Kaliumionen auf, Wasser folgt durch Osmose und ihr Turgor steigt; weil Cellulosefasern ihre Wände wie Reifen umfassen, biegen sie sich auseinander. Blaues Licht öffnet sie; bei Trockenheit schließt sie das Hormon Abscisinsäure (ABA).',
          'Jede offene Spaltöffnung tauscht Wasser gegen Kohlenstoff. Im Blatt ist die Luft fast mit Wasserdampf gesättigt (etwa 3 % der Luft bei 25 °C), während CO₂ draußen nur etwa 0,04 % der Luft ausmacht, und Wassermoleküle diffundieren etwa 1,6-mal so schnell wie CO₂. Darum verliert eine Pflanze wie die Weide einige hundert Wassermoleküle für jedes CO₂, das sie bindet.',
        ],
      },
    },
    catcher: {
      label: 'Der Kohlenstofffänger',
      title: 'RuBisCO, der Kohlenstofffänger',
      sunLabel: 'Sonnenlicht auf dem Blatt',
      verbs: { feed: 'Ein CO₂ zu RuBisCO schicken', dim: 'Eine Wolke vor der Sonne', bright: 'Wieder Sonne' },
      hints: { tap: 'Tippe auf ein CO₂-Molekül', dark: 'Schieb das Sonnenlicht hoch oder tippe auf den Sonnenstrahl', empty: 'Öffne die Spaltöffnung, um CO₂ hereinzulassen', wait: 'Warte, bis mehr CO₂ hereinkommt' },
      signs: { chloroplast: 'Chloroplast', starch: 'Stärke', sugar: 'Zucker: {n} von 6 Kohlenstoffatomen' },
      rows: { carbons: 'Kohlenstoffatome in diesem Zucker', of6: '{n} von 6', sugars: 'Als Stärke gespeicherte Zucker' },
      says: {
        first: { kid: 'Schnapp! RuBisCO hat es gefangen. Sein Kohlenstoff kommt in den Zucker, der gerade gebaut wird: Sechs Kohlenstoffatome ergeben einen Zucker.', sci: 'Carboxylierung: RuBisCO bindet CO₂ an Ribulose-1,5-bisphosphat (RuBP). Sechs gebundene Kohlenstoffatome ergeben eine Glucose.' },
        sugar: { kid: 'Sechs Kohlenstoffatome gefangen: ein ganzer Zucker! Das Blatt behält etwas als Stärke für die Nacht und schickt den Rest den Baum hinunter, um Holz zu bauen.', sci: 'Sechs CO₂ gebunden: eine Hexose, C₆H₁₂O₆. Ein Teil bleibt als Stärke im Chloroplasten für die Nacht; das meiste verlässt das Blatt als Saccharose durch das Phloem und wird zu Cellulose und Lignin.' },
        dark: { kid: 'Es ist zu dunkel: Ohne Licht hat der Kohlenstofffänger keine Energie. Schieb das Sonnenlicht hoch!', sci: 'Im Dunkeln gibt es kein ATP und kein NADPH, um RuBP neu zu bilden: Der Zyklus steht still.' },
        stall: { kid: 'Das Licht ist aus, und der Kohlenstofffänger hat angehalten. Er hält das Kohlenstoffdioxid fest und wartet.', sci: 'Kein Licht, kein ATP, kein NADPH: RuBP wird nicht neu gebildet, und die Fixierung hört auf.' },
        going: { kid: 'Wieder Licht: Der Kohlenstofffänger macht sich wieder an die Arbeit!', sci: 'Wieder Licht: Der Calvin-Benson-Zyklus dreht sich wieder.' },
        dim: { kid: 'Eine Wolke vor der Sonne: weniger Licht, ein langsamerer Fänger.', sci: 'Weniger Licht, weniger ATP und NADPH: Die Fixierung wird langsamer.' },
        bright: { kid: 'Die Sonne ist da: Die grünen Stapel leuchten, und Energie fliegt zu RuBisCO.', sci: 'Volles Licht: Die Thylakoide bilden ATP und NADPH, die den Zyklus antreiben.' },
        full: { kid: 'RuBisCO hat die Hände voll: Gib ihm Licht, damit es arbeiten kann.', sci: 'Alle aktiven Zentren sind besetzt: Es braucht Licht, um weiterzumachen.' },
        empty: { kid: 'Hier drin ist kein Kohlenstoffdioxid mehr: Die Spaltöffnung ist zu. Öffne sie, um mehr hereinzulassen.', sci: 'In den Luftlücken geht das CO₂ aus: Die Spaltöffnung ist geschlossen.' },
        wait: { kid: 'Durch die Spaltöffnung kommt mehr Kohlenstoffdioxid herein. Warte einen Moment.', sci: 'CO₂ diffundiert durch die offene Spaltöffnung herein.' },
      },
      panel: {
        kid: [
          'In den grünen Chloroplasten fängt eine winzige Maschine namens RuBisCO Kohlenstoffdioxid aus der Luft und hält seinen Kohlenstoff fest. Sechs gefangene Kohlenstoffatome ergeben einen Zucker, und aus Zucker baut ein Baum sein Holz.',
          'Die grünen Stapel fangen Sonnenlicht und machen daraus Energie für die Arbeit: Im Dunkeln hält der Fänger an. RuBisCO ist langsam, nur etwa drei Fänge pro Sekunde, darum bilden Pflanzen riesige Mengen davon. Vielleicht ist es das häufigste Protein der Erde.',
        ],
        sci: [
          'RuBisCO (Ribulose-1,5-bisphosphat-Carboxylase/-Oxygenase) bindet CO₂ an RuBP, einen Zucker mit fünf Kohlenstoffatomen; es entstehen zwei Moleküle 3-Phosphoglycerat. Der Calvin-Benson-Zyklus, in den 1940er- und 1950er-Jahren mit Kohlenstoff-14 aufgeklärt, macht daraus mit ATP und NADPH aus den Lichtreaktionen in den Thylakoiden Zucker und bildet RuBP neu: Sechs Umläufe binden die sechs Kohlenstoffatome einer Hexose. Hier viel zu groß gezeichnet: Ein echtes RuBisCO misst etwa 11 nm.',
          'Es ist langsam, etwa 3 CO₂ pro Sekunde an jedem aktiven Zentrum, und greift manchmal aus Versehen O₂. Darum sind Blätter voll davon, bis zur Hälfte ihres löslichen Proteins; eine Schätzung von 2019 kommt auf etwa 0,7 Milliarden Tonnen RuBisCO auf der Erde, weshalb es oft das häufigste Protein genannt wird. Das O₂, das ein Blatt abgibt, stammt aus Wasser, das in den Thylakoiden gespalten wird, nicht aus CO₂.',
        ],
      },
    },
  },
}
