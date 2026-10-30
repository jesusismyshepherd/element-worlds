// The words of sodium's baking kitchen ("What makes a cake rise?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Na.js
// (the easel shows it). Each step is done by tapping its thing: `hints` are what the prompt shows as the
// next step, `verbs` the panels' buttons that do the same; `signs` are drawn in 3D (plain text, no
// subscripts): the words on the tiles over the glasses and jars, the cards in front of the cake tins.
export const KITCHEN_WORDS = {
  en: {
    title: 'The baking kitchen',
    greet: {
      kid: "Good morning, and welcome to the kitchen in the picture! I am sodium, and today we are baking. I am in baking soda, and baking soda is what makes cakes rise. Three things to try, and the picture's story is on the easel.",
      sci: "Good morning. Baking soda is sodium bicarbonate, NaHCO₃: this kitchen is about the carbon dioxide it gives off, with an acid and with heat alone. Three things to try, and the picture's story on the easel.",
    },
    talk: {
      kid: [
        'Baking soda is a white powder made of sodium, hydrogen, carbon and oxygen. All the bubbles come from its carbon and oxygen: they are carbon dioxide gas.',
        'One spoonful of baking soda, with enough vinegar, makes more than a litre of gas! In a cake, that gas becomes thousands of tiny holes.',
        'Baking soda is not only for cakes: people also clean pans with it and put a little in the fridge to soak up smells.',
      ],
      sci: [
        'One gram of NaHCO₃ (84 g/mol) gives about 12 mmol of CO₂ with an acid: some 0.29 L at 20 °C and normal pressure. A level teaspoon, roughly 5 g, gives about 1.4 L.',
        'Heated alone, two NaHCO₃ give only one CO₂: half the gas, and sodium carbonate left behind. That is why recipes pair soda with an acid such as yoghurt, buttermilk or lemon juice.',
        'Most baking soda comes from the Solvay process (salt, ammonia and carbon dioxide in water) or from the mineral trona.',
      ],
    },
    fizz: {
      label: 'The fizz test',
      title: 'Which ones fizz?',
      signs: { vinegar: 'vinegar', lemon: 'lemon juice', water: 'water', soda: 'baking soda', powder: 'baking powder' },
      verbs: { vinegar: 'Vinegar', lemon: 'Lemon juice', water: 'Water', soda: 'A spoon of baking soda', powder: 'A spoon of baking powder' },
      hints: { pick: 'Tap a glass to choose it', spoon: 'Tap a jar to spoon some in', more: 'Tap another glass, or the other jar' },
      picked: {
        vinegar: { kid: 'The vinegar! Now tap a jar to spoon some powder in.', sci: 'Vinegar: a few per cent acetic acid, CH₃COOH. Now a jar.' },
        lemon: { kid: 'The lemon juice! Now tap a jar to spoon some powder in.', sci: 'Lemon juice: about 5 % citric acid. Now a jar.' },
        water: { kid: 'The water! Now tap a jar to spoon some powder in.', sci: 'Plain water, neutral. Now a jar.' },
      },
      first: { kid: 'First choose a glass: tap it.', sci: 'Choose a liquid first: tap a glass.' },
      says: {
        'vinegar:soda': {
          kid: 'Whoosh! It foams up and spills over! The sour vinegar makes the soda give off bubbles of carbon dioxide.',
          sci: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂: the foam is carbon dioxide caught in the liquid.',
        },
        'lemon:soda': {
          kid: 'Fizz! Lemon juice is sour too, so the soda bubbles up just the same.',
          sci: '3 NaHCO₃ + C₆H₈O₇ → Na₃C₆H₅O₇ + 3 H₂O + 3 CO₂: each citric acid gives three H⁺.',
        },
        'water:soda': {
          kid: 'Nothing! The soda just sinks and dissolves. Baking soda needs something sour to fizz.',
          sci: 'No acid, no gas: NaHCO₃ simply dissolves (96 g/L at 20 °C), giving a mildly alkaline solution, pH about 8.',
        },
        'water:powder': {
          kid: 'It fizzes in plain water! Baking powder has its own sour part hidden inside, waiting for water.',
          sci: 'Baking powder carries its own dry acid: water dissolves both, and HCO₃⁻ + H⁺ → H₂O + CO₂.',
        },
        'vinegar:powder': {
          kid: 'Fizz, but less than with soda: only part of baking powder is soda.',
          sci: 'Less gas than from soda: baking powder is only about 30 % bicarbonate, the rest acid salt and starch.',
        },
        'lemon:powder': {
          kid: 'Fizz! A little gentler than with soda: baking powder is only partly soda.',
          sci: 'Less CO₂ than from the same spoon of pure soda: there is less bicarbonate in it.',
        },
      },
      found: 'What you found',
      results: { big: 'Lots of fizz!', some: 'Fizz', none: 'Nothing' },
      panel: {
        kid: [
          'Baking soda is sodium bicarbonate, a powder with sodium in it. On its own it stays calm, but with something sour (an acid) it fizzes out bubbles of carbon dioxide gas.',
          'Try each glass with each jar, in any order: tap a glass to choose it, then tap a jar. Which ones fizz? Baking powder is baking soda already mixed with a dry sour powder and some starch, so water alone starts it.',
        ],
        sci: [
          'Sodium bicarbonate, NaHCO₃, is the salt of a weak acid: an acid stronger than carbonic acid takes the hydrogen carbonate ion and frees carbon dioxide, HCO₃⁻ + H⁺ → H₂O + CO₂. Vinegar brings acetic acid, lemon juice citric acid; water alone only dissolves it, a mildly alkaline solution of pH about 8.',
          'Baking powder is soda already mixed with a dry acid, such as cream of tartar (potassium hydrogen tartrate) or an acid phosphate, and with starch, which keeps it dry until water dissolves both. At 84 g/mol, every gram of soda can give about 0.29 L of CO₂ at room temperature.',
        ],
      },
    },
    cakes: {
      label: 'Two cakes',
      title: 'Why does a cake rise?',
      signs: { yoghurt: 'yoghurt', soda: 'baking soda', plain: 'plain' },
      verbs: { a: 'The left tin', b: 'The right tin', yoghurt: 'Add yoghurt', soda: 'Add baking soda', bake: 'Bake both', cutA: 'Cut the left cake', cutB: 'Cut the right cake', mix: 'New batter' },
      hints: { add: 'Tap the yoghurt or the soda', bake: 'Tap the oven to bake both', watch: 'Watch through the oven door', cut: 'Tap a cake to cut a slice', mix: 'Tap the mixer for new batter' },
      says: {
        pick: { kid: 'This tin, then. Tap the yoghurt or the soda to add some.', sci: 'This tin. Add yoghurt, soda, both or neither.' },
        yoghurt: { kid: 'A spoon of yoghurt goes in. Yoghurt is a little sour.', sci: 'Yoghurt: lactic acid, made by its bacteria; pH about 4 to 4.5.' },
        soda: { kid: 'A spoon of baking soda goes in.', sci: 'Sodium bicarbonate in: on its own it waits for an acid, or for heat.' },
        fizzing: { kid: 'Look, tiny bubbles already! The soda has met the sour yoghurt.', sci: 'Acid and bicarbonate together: CO₂ forms in the batter at once, so it should go into the oven soon.' },
        again: { kid: 'That is already in this tin.', sci: 'Already added to this tin.' },
        mix: { kid: 'Whirr! Fresh batter in both tins: flour, sugar, eggs, butter and milk.', sci: 'Fresh batter, nothing added yet: flour, sugar, eggs, butter and milk, with air beaten in.' },
        baked: { kid: 'These cakes are baked. Tap the mixer for new batter first.', sci: 'Already baked: new batter first (the mixer).' },
        bake: { kid: 'Into the oven at 180 °C! Baking takes about half an hour, so here it is sped up.', sci: '180 °C, some 30 minutes in real life (sped up here): the gas expands, water turns to steam, and the batter sets.' },
        risen: { kid: 'The cake with soda and yoghurt rose tall and light!', sci: 'Soda and acid made plenty of CO₂: the bubbles swelled in the heat and the crumb set round them.' },
        soapy: { kid: 'The cake with only soda rose a little, but it is yellowish, and it would taste soapy!', sci: 'Soda without acid: heat alone frees half its CO₂ and leaves sodium carbonate, yellow and soapy.' },
        flat: { kid: 'Both cakes stayed flat and heavy: nothing made bubbles in them.', sci: 'No leavening: only the air beaten in and a little steam, so a dense, flat crumb.' },
        cutRisen: { kid: 'Look inside: a sponge full of holes! Each hole was a bubble of gas that the heat made bigger.', sci: 'An open, foam-like crumb: gas cells held in place as the starch gelatinised and the proteins set.' },
        cutSoapy: { kid: 'Some holes, but the inside is yellowish: soda with nothing sour to use it up.', sci: 'Fewer, uneven cells and a yellow crumb, from the alkaline sodium carbonate.' },
        cutFlat: { kid: 'Inside it is tight and heavy, with only tiny holes.', sci: 'A close, dense crumb: few gas cells to expand.' },
      },
      panel: {
        kid: [
          'A cake rises because of bubbles. Baking soda makes bubbles of carbon dioxide when it meets something sour, like yoghurt, and the bubbles get trapped in the sticky batter.',
          'In the hot oven the bubbles grow bigger, and then the batter round them sets firm, like a sponge. Try the tins different ways (soda and yoghurt, only soda, only yoghurt, nothing), then cut the cakes to see inside.',
        ],
        sci: [
          'Chemical leavening: NaHCO₃ and an acid (here the lactic acid of yoghurt) release CO₂ into the batter, which also holds air beaten in while mixing. In the oven the gas cells grow: a gas expands by about a quarter between 20 and 100 °C (373/293 K), dissolved CO₂ comes out of solution, and water turns to steam.',
          'Meanwhile the starch gelatinises and the egg and flour proteins set, fixing the cells as an open foam; the middle of a cake stays at about 100 °C or below while it holds water. Without acid, soda gives only half its CO₂, by heat, and leaves sodium carbonate: a yellow crumb with a soapy, bitter taste.',
        ],
      },
    },
    heat: {
      label: 'Soda in the flame',
      title: 'Heat alone',
      temp: 'Temperature of the soda',
      signs: { fresh: 'fresh soda', tube: 'from the tube', lime: 'limewater', soda: 'baking soda' },
      verbs: { fire: 'Light the burner', out: 'Put the burner out', fresh: 'A pinch of fresh soda', tube: 'A pinch from the tube', refill: 'Fresh soda in the tube' },
      hints: { fire: 'Tap the burner, or slide the heat', wait: 'Watch the tube and the limewater', test: 'Tap the cabbage juice', refill: 'Tap the soda jar to start again' },
      says: {
        fire: { kid: 'The burner is lit. Watch the soda as it gets hotter.', sci: 'Heating dry NaHCO₃; any gas it gives off goes through the tube into limewater.' },
        out: { kid: 'Burner out. The soda cools down.', sci: 'Heat off: the decomposition slows and stops.' },
        cool: { kid: 'Still too cool: nothing happens yet.', sci: 'Below about 80 °C, solid NaHCO₃ barely changes.' },
        starts: { kid: 'Above about 80 °C, the soda starts to break apart by itself! Bubbles go into the limewater.', sci: 'From about 80 °C it decomposes, slowly: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂.' },
        fast: { kid: 'At 200 °C it goes fast! Drops of water in the tube, and the limewater turns milky.', sci: 'Fast at 200 °C. The water condenses on the cool glass; the CO₂ turns limewater milky, Ca(OH)₂ + CO₂ → CaCO₃ + H₂O.' },
        done: { kid: 'No more bubbles: all the soda has changed into something new, sodium carbonate.', sci: 'Decomposition complete: what is left is Na₂CO₃, 63 % of the starting mass (106 g from every 168 g).' },
        fresh: { kid: 'Fresh baking soda turns the purple cabbage juice blue: a gentle alkali.', sci: 'NaHCO₃ solution, pH about 8: the anthocyanins of red cabbage turn blue.' },
        tubeSame: { kid: 'Blue, the same as fresh soda: it has not changed yet. Heat it more!', sci: 'Still mostly NaHCO₃: the same blue. Heat it above 80 °C first.' },
        tubeGreen: { kid: 'Green! What is left in the tube is a stronger alkali, sodium carbonate. That is why too much soda makes a cake taste soapy.', sci: 'Na₂CO₃ solution, pH about 11: the indicator turns green. This is the soapy, bitter taste of a cake with too much soda.' },
        refill: { kid: 'A clean tube with fresh soda, and fresh limewater. Ready again!', sci: 'Fresh NaHCO₃, fresh limewater, fresh indicator.' },
      },
      panel: {
        kid: [
          'Baking soda does not need something sour to make gas: heat alone breaks it apart. Above about 80 °C it slowly turns into a new powder, sodium carbonate, and gives off water and carbon dioxide.',
          'Slide the temperature or tap the burner. Drops of water appear at the cool end of the tube, and the gas turns the clear limewater milky: that is how chemists spot carbon dioxide. Then test both powders in the purple cabbage juice.',
        ],
        sci: [
          'Thermal decomposition: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂. It runs slowly from about 80 to 100 °C and fast at 200 °C. Only one CO₂ for every two NaHCO₃, half what an acid frees; 37 % of the mass leaves as water and gas, so 10 g of soda leaves 6.3 g of sodium carbonate.',
          'Limewater identifies the CO₂: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O, a milky precipitate. Red cabbage juice (its anthocyanins) is a pH indicator: blue for NaHCO₃ (pH about 8), green for Na₂CO₃ (pH about 11). In a cake with too much soda, this sodium carbonate gives the soapy taste and the yellow colour.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A cozinha dos bolos',
    greet: {
      kid: 'Bom dia, e bem-vindo à cozinha da imagem! Eu sou o sódio, e hoje vamos fazer bolos. Estou no bicarbonato de sódio, e é o bicarbonato que faz os bolos crescer. Há três coisas para experimentar, e a história da imagem está no cavalete.',
      sci: 'Bom dia. O bicarbonato de sódio é o hidrogenocarbonato de sódio, NaHCO₃: esta cozinha é sobre o dióxido de carbono que ele liberta, com um ácido e só com calor. Há três coisas para experimentar, e a história da imagem no cavalete.',
    },
    talk: {
      kid: [
        'O bicarbonato é um pó branco feito de sódio, hidrogénio, carbono e oxigénio. As bolhas vêm todas do seu carbono e oxigénio: são dióxido de carbono, um gás.',
        'Uma colher de bicarbonato, com vinagre que chegue, faz mais de um litro de gás! Num bolo, esse gás transforma-se em milhares de buraquinhos.',
        'O bicarbonato não serve só para bolos: também se limpam tachos com ele, e põe-se um pouco no frigorífico para tirar os maus cheiros.',
      ],
      sci: [
        'Um grama de NaHCO₃ (84 g/mol) dá cerca de 12 mmol de CO₂ com um ácido: uns 0,29 L a 20 °C e à pressão normal. Uma colher de chá rasa, cerca de 5 g, dá cerca de 1,4 L.',
        'Só com calor, dois NaHCO₃ dão apenas um CO₂: metade do gás, e fica carbonato de sódio. É por isso que as receitas juntam o bicarbonato a um ácido, como iogurte, leitelho ou sumo de limão.',
        'Quase todo o bicarbonato vem do processo Solvay (sal, amoníaco e dióxido de carbono em água) ou do mineral trona.',
      ],
    },
    fizz: {
      label: 'O teste da efervescência',
      title: 'Quais fazem espuma?',
      signs: { vinegar: 'vinagre', lemon: 'sumo de limão', water: 'água', soda: 'bicarbonato', powder: 'fermento em pó' },
      verbs: { vinegar: 'Vinagre', lemon: 'Sumo de limão', water: 'Água', soda: 'Uma colher de bicarbonato', powder: 'Uma colher de fermento em pó' },
      hints: { pick: 'Toca num copo para o escolher', spoon: 'Toca num frasco para deitar uma colher', more: 'Toca noutro copo, ou no outro frasco' },
      picked: {
        vinegar: { kid: 'O vinagre! Agora toca num frasco para deitar uma colher de pó.', sci: 'Vinagre: alguns por cento de ácido acético, CH₃COOH. Agora um frasco.' },
        lemon: { kid: 'O sumo de limão! Agora toca num frasco para deitar uma colher de pó.', sci: 'Sumo de limão: cerca de 5 % de ácido cítrico. Agora um frasco.' },
        water: { kid: 'A água! Agora toca num frasco para deitar uma colher de pó.', sci: 'Água simples, neutra. Agora um frasco.' },
      },
      first: { kid: 'Primeiro escolhe um copo: toca nele.', sci: 'Escolhe primeiro um líquido: toca num copo.' },
      says: {
        'vinegar:soda': {
          kid: 'Uau! Faz espuma e transborda! O vinagre, que é ácido, faz o bicarbonato libertar bolhas de dióxido de carbono.',
          sci: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂: a espuma é dióxido de carbono preso no líquido.',
        },
        'lemon:soda': {
          kid: 'Espuma! O sumo de limão também é ácido, por isso o bicarbonato borbulha na mesma.',
          sci: '3 NaHCO₃ + C₆H₈O₇ → Na₃C₆H₅O₇ + 3 H₂O + 3 CO₂: cada ácido cítrico dá três H⁺.',
        },
        'water:soda': {
          kid: 'Nada! O bicarbonato só vai ao fundo e dissolve-se. O bicarbonato precisa de uma coisa ácida para fazer espuma.',
          sci: 'Sem ácido não há gás: o NaHCO₃ apenas se dissolve (96 g/L a 20 °C) e dá uma solução ligeiramente alcalina, de pH cerca de 8.',
        },
        'water:powder': {
          kid: 'Faz espuma em água simples! O fermento em pó tem a sua própria parte ácida escondida, à espera da água.',
          sci: 'O fermento em pó traz o seu próprio ácido seco: a água dissolve os dois, e HCO₃⁻ + H⁺ → H₂O + CO₂.',
        },
        'vinegar:powder': {
          kid: 'Espuma, mas menos do que com bicarbonato: só uma parte do fermento em pó é bicarbonato.',
          sci: 'Menos gás do que com bicarbonato: o fermento em pó tem só cerca de 30 % de bicarbonato, o resto é sal ácido e amido.',
        },
        'lemon:powder': {
          kid: 'Espuma! Um pouco mais calma do que com bicarbonato: o fermento em pó só em parte é bicarbonato.',
          sci: 'Menos CO₂ do que a mesma colher de bicarbonato puro: tem menos hidrogenocarbonato.',
        },
      },
      found: 'O que descobriste',
      results: { big: 'Muita espuma!', some: 'Espuma', none: 'Nada' },
      panel: {
        kid: [
          'O bicarbonato de sódio é um pó com sódio. Sozinho fica sossegado, mas com uma coisa ácida faz bolhas de dióxido de carbono, um gás.',
          'Experimenta cada copo com cada frasco, pela ordem que quiseres: toca num copo para o escolher e depois toca num frasco. Quais fazem espuma? O fermento em pó é bicarbonato já misturado com um pó ácido e seco e um pouco de amido, por isso basta a água para começar.',
        ],
        sci: [
          'O hidrogenocarbonato de sódio, NaHCO₃, é o sal de um ácido fraco: um ácido mais forte do que o ácido carbónico capta o ião hidrogenocarbonato e liberta dióxido de carbono, HCO₃⁻ + H⁺ → H₂O + CO₂. O vinagre traz ácido acético, o sumo de limão ácido cítrico; a água sozinha só o dissolve, numa solução ligeiramente alcalina de pH cerca de 8.',
          'O fermento em pó é bicarbonato já misturado com um ácido seco, como o cremor tártaro (hidrogenotartarato de potássio) ou um fosfato ácido, e com amido, que o mantém seco até a água dissolver os dois. Com 84 g/mol, cada grama de bicarbonato pode dar cerca de 0,29 L de CO₂ à temperatura ambiente.',
        ],
      },
    },
    cakes: {
      label: 'Dois bolos',
      title: 'Porque cresce um bolo?',
      signs: { yoghurt: 'iogurte', soda: 'bicarbonato', plain: 'simples' },
      verbs: { a: 'A forma da esquerda', b: 'A forma da direita', yoghurt: 'Juntar iogurte', soda: 'Juntar bicarbonato', bake: 'Cozer os dois', cutA: 'Cortar o bolo da esquerda', cutB: 'Cortar o bolo da direita', mix: 'Massa nova' },
      hints: { add: 'Toca no iogurte ou no bicarbonato', bake: 'Toca no forno para cozer os dois', watch: 'Espreita pela porta do forno', cut: 'Toca num bolo para cortar uma fatia', mix: 'Toca na batedeira para fazer massa nova' },
      says: {
        pick: { kid: 'Então esta forma. Toca no iogurte ou no bicarbonato para juntar um pouco.', sci: 'Esta forma. Junta iogurte, bicarbonato, os dois ou nenhum.' },
        yoghurt: { kid: 'Lá vai uma colher de iogurte. O iogurte é um bocadinho ácido.', sci: 'Iogurte: ácido láctico, feito pelas suas bactérias; pH cerca de 4 a 4,5.' },
        soda: { kid: 'Lá vai uma colher de bicarbonato.', sci: 'Hidrogenocarbonato de sódio: sozinho, espera por um ácido, ou pelo calor.' },
        fizzing: { kid: 'Olha, já há bolhinhas! O bicarbonato encontrou o iogurte ácido.', sci: 'Ácido e bicarbonato juntos: o CO₂ forma-se logo na massa, por isso deve ir depressa ao forno.' },
        again: { kid: 'Isso já está nesta forma.', sci: 'Já foi juntado a esta forma.' },
        mix: { kid: 'Zzzz! Massa fresquinha nas duas formas: farinha, açúcar, ovos, manteiga e leite.', sci: 'Massa nova, ainda sem nada: farinha, açúcar, ovos, manteiga e leite, com ar batido lá dentro.' },
        baked: { kid: 'Estes bolos já estão cozidos. Primeiro toca na batedeira para fazer massa nova.', sci: 'Já cozidos: primeiro massa nova (a batedeira).' },
        bake: { kid: 'Para o forno a 180 °C! Cozer demora cerca de meia hora, por isso aqui vês tudo acelerado.', sci: '180 °C, uns 30 minutos na vida real (aqui acelerado): o gás dilata, a água passa a vapor e a massa solidifica.' },
        risen: { kid: 'O bolo com bicarbonato e iogurte cresceu alto e fofo!', sci: 'Bicarbonato e ácido fizeram muito CO₂: as bolhas incharam com o calor e o miolo solidificou à volta delas.' },
        soapy: { kid: 'O bolo só com bicarbonato cresceu um pouco, mas está amarelado, e ia saber a sabão!', sci: 'Bicarbonato sem ácido: só o calor liberta metade do seu CO₂ e deixa carbonato de sódio, amarelo e com sabor a sabão.' },
        flat: { kid: 'Os dois bolos ficaram baixos e pesados: nada fez bolhas lá dentro.', sci: 'Sem levedante: só o ar batido e um pouco de vapor, por isso um miolo denso e baixo.' },
        cutRisen: { kid: 'Olha lá para dentro: uma esponja cheia de buracos! Cada buraco foi uma bolha de gás que o calor fez crescer.', sci: 'Um miolo aberto, como uma espuma: as células de gás ficaram presas enquanto o amido gelatinizava e as proteínas solidificavam.' },
        cutSoapy: { kid: 'Alguns buracos, mas o interior está amarelado: bicarbonato sem nada ácido para o gastar.', sci: 'Menos células, desiguais, e um miolo amarelo, por causa do carbonato de sódio, alcalino.' },
        cutFlat: { kid: 'Por dentro está apertado e pesado, só com buraquinhos minúsculos.', sci: 'Um miolo fechado e denso: poucas células de gás para dilatar.' },
      },
      panel: {
        kid: [
          'Um bolo cresce por causa das bolhas. O bicarbonato faz bolhas de dióxido de carbono quando encontra uma coisa ácida, como o iogurte, e as bolhas ficam presas na massa pegajosa.',
          'No forno quente as bolhas crescem, e depois a massa à volta delas fica firme, como uma esponja. Experimenta as formas de maneiras diferentes (bicarbonato e iogurte, só bicarbonato, só iogurte, nada) e depois corta os bolos para ver por dentro.',
        ],
        sci: [
          'Levedura química: o NaHCO₃ e um ácido (aqui o ácido láctico do iogurte) libertam CO₂ na massa, que também tem ar batido durante a mistura. No forno, as células de gás crescem: um gás dilata cerca de um quarto entre 20 e 100 °C (373/293 K), o CO₂ dissolvido sai da solução e a água passa a vapor.',
          'Entretanto o amido gelatiniza e as proteínas do ovo e da farinha solidificam, fixando as células numa espuma aberta; o centro de um bolo fica a cerca de 100 °C ou menos enquanto tiver água. Sem ácido, o bicarbonato só dá metade do seu CO₂, pelo calor, e deixa carbonato de sódio: um miolo amarelo, com sabor a sabão, amargo.',
        ],
      },
    },
    heat: {
      label: 'Bicarbonato na chama',
      title: 'Só com calor',
      temp: 'Temperatura do bicarbonato',
      signs: { fresh: 'bicarbonato novo', tube: 'do tubo', lime: 'água de cal', soda: 'bicarbonato' },
      verbs: { fire: 'Acender a lamparina', out: 'Apagar a lamparina', fresh: 'Uma pitada de bicarbonato novo', tube: 'Uma pitada do tubo', refill: 'Bicarbonato novo no tubo' },
      hints: { fire: 'Toca na lamparina, ou mexe no calor', wait: 'Observa o tubo e a água de cal', test: 'Toca no sumo de couve-roxa', refill: 'Toca no frasco de bicarbonato para recomeçar' },
      says: {
        fire: { kid: 'A lamparina está acesa. Observa o bicarbonato a aquecer.', sci: 'A aquecer NaHCO₃ seco; o gás que libertar passa pelo tubo para a água de cal.' },
        out: { kid: 'Lamparina apagada. O bicarbonato arrefece.', sci: 'Sem calor: a decomposição abranda e para.' },
        cool: { kid: 'Ainda está frio demais: ainda não acontece nada.', sci: 'Abaixo de cerca de 80 °C, o NaHCO₃ sólido quase não muda.' },
        starts: { kid: 'Acima de cerca de 80 °C, o bicarbonato começa a desfazer-se sozinho! Vão bolhas para a água de cal.', sci: 'A partir de cerca de 80 °C decompõe-se, devagar: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂.' },
        fast: { kid: 'A 200 °C vai depressa! Gotas de água no tubo, e a água de cal fica turva, branca como leite.', sci: 'Rápido a 200 °C. A água condensa no vidro frio; o CO₂ turva a água de cal, Ca(OH)₂ + CO₂ → CaCO₃ + H₂O.' },
        done: { kid: 'Já não há bolhas: todo o bicarbonato se transformou numa coisa nova, o carbonato de sódio.', sci: 'Decomposição completa: o que resta é Na₂CO₃, 63 % da massa inicial (106 g por cada 168 g).' },
        fresh: { kid: 'O bicarbonato novo põe o sumo roxo de couve azul: é uma base suave.', sci: 'Solução de NaHCO₃, pH cerca de 8: as antocianinas da couve-roxa ficam azuis.' },
        tubeSame: { kid: 'Azul, igual ao bicarbonato novo: ainda não mudou. Aquece mais!', sci: 'Ainda é quase só NaHCO₃: o mesmo azul. Aquece-o primeiro acima de 80 °C.' },
        tubeGreen: { kid: 'Verde! O que ficou no tubo é uma base mais forte, o carbonato de sódio. É por isso que bicarbonato a mais deixa o bolo a saber a sabão.', sci: 'Solução de Na₂CO₃, pH cerca de 11: o indicador fica verde. É o sabor a sabão, amargo, de um bolo com bicarbonato a mais.' },
        refill: { kid: 'Um tubo limpo com bicarbonato novo, e água de cal nova. Pronto outra vez!', sci: 'NaHCO₃ novo, água de cal nova, indicador novo.' },
      },
      panel: {
        kid: [
          'O bicarbonato não precisa de uma coisa ácida para fazer gás: só o calor desfá-lo. Acima de cerca de 80 °C transforma-se devagar num pó novo, o carbonato de sódio, e liberta água e dióxido de carbono.',
          'Mexe na temperatura ou toca na lamparina. Aparecem gotas de água na ponta fria do tubo, e o gás deixa a água de cal turva, branca como leite: é assim que os químicos descobrem o dióxido de carbono. Depois testa os dois pós no sumo roxo de couve.',
        ],
        sci: [
          'Decomposição térmica: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂. Decorre devagar entre cerca de 80 e 100 °C e depressa a 200 °C. Só um CO₂ por cada dois NaHCO₃, metade do que um ácido liberta; 37 % da massa sai como água e gás, por isso 10 g de bicarbonato deixam 6,3 g de carbonato de sódio.',
          'A água de cal identifica o CO₂: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O, um precipitado branco. O sumo de couve-roxa (as suas antocianinas) é um indicador de pH: azul para o NaHCO₃ (pH cerca de 8), verde para o Na₂CO₃ (pH cerca de 11). Num bolo com bicarbonato a mais, é este carbonato de sódio que dá o sabor a sabão e a cor amarela.',
        ],
      },
    },
  },
  pl: {
    title: 'Kuchnia pełna ciast',
    greet: {
      kid: 'Dzień dobry i witaj w kuchni z obrazka! Jestem Sód i dziś pieczemy. Jestem w sodzie oczyszczonej, a to właśnie soda sprawia, że ciasto rośnie. Trzy rzeczy do wypróbowania, a historia obrazka jest na sztaludze.',
      sci: 'Dzień dobry. Soda oczyszczona to wodorowęglan sodu, NaHCO₃: ta kuchnia jest o dwutlenku węgla, który z niej uchodzi, z kwasem i od samego ciepła. Trzy rzeczy do wypróbowania, a historia obrazka na sztaludze.',
    },
    talk: {
      kid: [
        'Soda oczyszczona to biały proszek z sodu, wodoru, węgla i tlenu. Wszystkie bąbelki biorą się z jej węgla i tlenu: to dwutlenek węgla, gaz.',
        'Jedna łyżeczka sody z dużą ilością octu daje ponad litr gazu! W cieście ten gaz zamienia się w tysiące malutkich dziurek.',
        'Soda jest nie tylko do ciast: ludzie czyszczą nią garnki i wkładają trochę do lodówki, żeby pochłaniała zapachy.',
      ],
      sci: [
        'Jeden gram NaHCO₃ (84 g/mol) daje z kwasem około 12 mmol CO₂: jakieś 0,29 l w 20 °C pod normalnym ciśnieniem. Płaska łyżeczka, około 5 g, daje mniej więcej 1,4 l.',
        'Od samego ciepła dwie cząsteczki NaHCO₃ dają tylko jedną CO₂: połowę gazu, a zostaje węglan sodu. Dlatego przepisy łączą sodę z kwasem, na przykład z jogurtem, maślanką albo sokiem z cytryny.',
        'Większość sody oczyszczonej pochodzi z metody Solvaya (sól, amoniak i dwutlenek węgla w wodzie) albo z minerału trony.',
      ],
    },
    fizz: {
      label: 'Próba musowania',
      title: 'Co musuje?',
      signs: { vinegar: 'ocet', lemon: 'sok z cytryny', water: 'woda', soda: 'soda oczyszczona', powder: 'proszek do pieczenia' },
      verbs: { vinegar: 'Ocet', lemon: 'Sok z cytryny', water: 'Woda', soda: 'Łyżeczka sody', powder: 'Łyżeczka proszku do pieczenia' },
      hints: { pick: 'Dotknij szklanki, żeby ją wybrać', spoon: 'Dotknij słoika, żeby nasypać łyżeczkę', more: 'Dotknij innej szklanki albo drugiego słoika' },
      picked: {
        vinegar: { kid: 'Ocet! Teraz dotknij słoika, żeby nasypać łyżeczkę proszku.', sci: 'Ocet: kilka procent kwasu octowego, CH₃COOH. Teraz słoik.' },
        lemon: { kid: 'Sok z cytryny! Teraz dotknij słoika, żeby nasypać łyżeczkę proszku.', sci: 'Sok z cytryny: około 5 % kwasu cytrynowego. Teraz słoik.' },
        water: { kid: 'Woda! Teraz dotknij słoika, żeby nasypać łyżeczkę proszku.', sci: 'Zwykła woda, obojętna. Teraz słoik.' },
      },
      first: { kid: 'Najpierw wybierz szklankę: dotknij jej.', sci: 'Najpierw wybierz ciecz: dotknij szklanki.' },
      says: {
        'vinegar:soda': {
          kid: 'Fiuuu! Pieni się i wylewa! Kwaśny ocet sprawia, że soda wypuszcza bąbelki dwutlenku węgla.',
          sci: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂: piana to dwutlenek węgla uwięziony w cieczy.',
        },
        'lemon:soda': {
          kid: 'Musuje! Sok z cytryny też jest kwaśny, więc soda bąbelkuje tak samo.',
          sci: '3 NaHCO₃ + C₆H₈O₇ → Na₃C₆H₅O₇ + 3 H₂O + 3 CO₂: każda cząsteczka kwasu cytrynowego oddaje trzy H⁺.',
        },
        'water:soda': {
          kid: 'Nic! Soda tylko opada na dno i się rozpuszcza. Żeby musowała, potrzebuje czegoś kwaśnego.',
          sci: 'Bez kwasu nie ma gazu: NaHCO₃ po prostu się rozpuszcza (96 g/l w 20 °C) i daje lekko zasadowy roztwór o pH około 8.',
        },
        'water:powder': {
          kid: 'Musuje w zwykłej wodzie! Proszek do pieczenia ma w sobie ukrytą kwaśną część, która czeka na wodę.',
          sci: 'Proszek do pieczenia ma własny suchy kwas: woda rozpuszcza oba składniki i HCO₃⁻ + H⁺ → H₂O + CO₂.',
        },
        'vinegar:powder': {
          kid: 'Musuje, ale słabiej niż soda: tylko część proszku do pieczenia to soda.',
          sci: 'Mniej gazu niż z sody: proszek do pieczenia to tylko około 30 % wodorowęglanu, reszta to kwaśna sól i skrobia.',
        },
        'lemon:powder': {
          kid: 'Musuje! Trochę spokojniej niż soda: proszek do pieczenia to soda tylko w części.',
          sci: 'Mniej CO₂ niż z takiej samej łyżeczki czystej sody: jest w nim mniej wodorowęglanu.',
        },
      },
      found: 'Co już wiesz',
      results: { big: 'Mnóstwo piany!', some: 'Musuje', none: 'Nic' },
      panel: {
        kid: [
          'Soda oczyszczona to wodorowęglan sodu, proszek, w którym jest sód. Sama jest spokojna, ale z czymś kwaśnym musuje i wypuszcza bąbelki dwutlenku węgla.',
          'Wypróbuj każdą szklankę z każdym słoikiem, w dowolnej kolejności: dotknij szklanki, żeby ją wybrać, a potem słoika. Co musuje? Proszek do pieczenia to soda już zmieszana z suchym kwaśnym proszkiem i odrobiną skrobi, więc wystarczy mu sama woda.',
        ],
        sci: [
          'Wodorowęglan sodu, NaHCO₃, to sól słabego kwasu: kwas mocniejszy od kwasu węglowego przejmuje jon wodorowęglanowy i uwalnia dwutlenek węgla, HCO₃⁻ + H⁺ → H₂O + CO₂. Ocet wnosi kwas octowy, sok z cytryny kwas cytrynowy; sama woda tylko go rozpuszcza, w lekko zasadowy roztwór o pH około 8.',
          'Proszek do pieczenia to soda zmieszana już z suchym kwasem, na przykład z kamieniem winnym (wodorowinianem potasu) albo kwaśnym fosforanem, oraz ze skrobią, która trzyma go w suchości, dopóki woda nie rozpuści obu składników. Przy 84 g/mol każdy gram sody może dać około 0,29 l CO₂ w temperaturze pokojowej.',
        ],
      },
    },
    cakes: {
      label: 'Dwa ciasta',
      title: 'Dlaczego ciasto rośnie?',
      signs: { yoghurt: 'jogurt', soda: 'soda', plain: 'bez dodatków' },
      verbs: { a: 'Lewa forma', b: 'Prawa forma', yoghurt: 'Dodaj jogurt', soda: 'Dodaj sodę', bake: 'Upiecz oba', cutA: 'Pokrój lewe ciasto', cutB: 'Pokrój prawe ciasto', mix: 'Nowe ciasto' },
      hints: { add: 'Dotknij jogurtu albo sody', bake: 'Dotknij piekarnika, żeby upiec oba', watch: 'Patrz przez drzwiczki piekarnika', cut: 'Dotknij ciasta, żeby ukroić kawałek', mix: 'Dotknij miksera, żeby zrobić nowe ciasto' },
      says: {
        pick: { kid: 'Dobrze, ta forma. Dotknij jogurtu albo sody, żeby coś dodać.', sci: 'Ta forma. Dodaj jogurt, sodę, oba albo nic.' },
        yoghurt: { kid: 'Łyżka jogurtu ląduje w cieście. Jogurt jest trochę kwaśny.', sci: 'Jogurt: kwas mlekowy, wytwarzany przez jego bakterie; pH około 4 do 4,5.' },
        soda: { kid: 'Łyżeczka sody ląduje w cieście.', sci: 'Wodorowęglan sodu: sam czeka na kwas albo na ciepło.' },
        fizzing: { kid: 'Patrz, już są malutkie bąbelki! Soda spotkała kwaśny jogurt.', sci: 'Kwas i wodorowęglan razem: CO₂ powstaje w cieście od razu, więc powinno szybko trafić do piekarnika.' },
        again: { kid: 'To już jest w tej formie.', sci: 'Już dodane do tej formy.' },
        mix: { kid: 'Bzzz! Świeże ciasto w obu formach: mąka, cukier, jajka, masło i mleko.', sci: 'Świeże ciasto, jeszcze bez dodatków: mąka, cukier, jajka, masło i mleko, z wbitym powietrzem.' },
        baked: { kid: 'Te ciasta są już upieczone. Najpierw dotknij miksera, żeby zrobić nowe.', sci: 'Już upieczone: najpierw nowe ciasto (mikser).' },
        bake: { kid: 'Do piekarnika, 180 °C! Pieczenie trwa około pół godziny, więc tutaj jest przyspieszone.', sci: '180 °C, w rzeczywistości jakieś 30 minut (tu przyspieszone): gaz się rozszerza, woda zamienia się w parę, a ciasto tężeje.' },
        risen: { kid: 'Ciasto z sodą i jogurtem urosło wysokie i puszyste!', sci: 'Soda z kwasem dały dużo CO₂: pęcherzyki napęczniały w cieple, a miękisz stężał wokół nich.' },
        soapy: { kid: 'Ciasto z samą sodą urosło trochę, ale jest żółtawe i smakowałoby jak mydło!', sci: 'Soda bez kwasu: samo ciepło uwalnia połowę jej CO₂ i zostawia węglan sodu, żółty i mydlany w smaku.' },
        flat: { kid: 'Oba ciasta zostały płaskie i ciężkie: nic nie zrobiło w nich bąbelków.', sci: 'Bez spulchniacza: tylko wbite powietrze i trochę pary, więc zbity, płaski miękisz.' },
        cutRisen: { kid: 'Zajrzyj do środka: gąbka pełna dziurek! Każda dziurka to był bąbelek gazu, który ciepło powiększyło.', sci: 'Otwarty miękisz jak piana: pęcherzyki gazu utrwaliły się, gdy skrobia kleikowała, a białka tężały.' },
        cutSoapy: { kid: 'Trochę dziurek, ale środek jest żółtawy: soda bez niczego kwaśnego, co by ją zużyło.', sci: 'Mniej pęcherzyków, nierównych, i żółty miękisz, przez zasadowy węglan sodu.' },
        cutFlat: { kid: 'W środku jest zbite i ciężkie, z malutkimi dziurkami.', sci: 'Zwarty, gęsty miękisz: mało pęcherzyków gazu, które mogłyby się rozszerzyć.' },
      },
      panel: {
        kid: [
          'Ciasto rośnie dzięki bąbelkom. Soda oczyszczona robi bąbelki dwutlenku węgla, gdy spotka coś kwaśnego, na przykład jogurt, a bąbelki zostają uwięzione w lepkim cieście.',
          'W gorącym piekarniku bąbelki rosną, a potem ciasto wokół nich tężeje jak gąbka. Wypróbuj formy na różne sposoby (soda i jogurt, sama soda, sam jogurt, nic), a potem pokrój ciasta i zajrzyj do środka.',
        ],
        sci: [
          'Spulchnianie chemiczne: NaHCO₃ i kwas (tu kwas mlekowy z jogurtu) uwalniają CO₂ do ciasta, w którym jest też powietrze wbite przy mieszaniu. W piekarniku pęcherzyki rosną: gaz rozszerza się o mniej więcej jedną czwartą między 20 a 100 °C (373/293 K), rozpuszczony CO₂ wydziela się z roztworu, a woda zamienia się w parę.',
          'W tym czasie skrobia kleikuje, a białka jajek i mąki tężeją, utrwalając pęcherzyki w otwartą pianę; środek ciasta ma około 100 °C lub mniej, dopóki jest w nim woda. Bez kwasu soda daje tylko połowę swojego CO₂, od ciepła, i zostawia węglan sodu: żółty miękisz o mydlanym, gorzkim smaku.',
        ],
      },
    },
    heat: {
      label: 'Soda w płomieniu',
      title: 'Samo ciepło',
      temp: 'Temperatura sody',
      signs: { fresh: 'świeża soda', tube: 'z probówki', lime: 'woda wapienna', soda: 'soda oczyszczona' },
      verbs: { fire: 'Zapal palnik', out: 'Zgaś palnik', fresh: 'Szczypta świeżej sody', tube: 'Szczypta z probówki', refill: 'Świeża soda do probówki' },
      hints: { fire: 'Dotknij palnika albo przesuń ciepło', wait: 'Obserwuj probówkę i wodę wapienną', test: 'Dotknij soku z kapusty', refill: 'Dotknij słoika z sodą, żeby zacząć od nowa' },
      says: {
        fire: { kid: 'Palnik się pali. Patrz, co się dzieje z sodą, gdy robi się coraz cieplejsza.', sci: 'Ogrzewamy suchy NaHCO₃; gaz, który się wydzieli, przejdzie rurką do wody wapiennej.' },
        out: { kid: 'Palnik zgaszony. Soda stygnie.', sci: 'Bez ciepła: rozkład zwalnia i ustaje.' },
        cool: { kid: 'Jeszcze za zimno: na razie nic się nie dzieje.', sci: 'Poniżej około 80 °C stały NaHCO₃ prawie się nie zmienia.' },
        starts: { kid: 'Powyżej około 80 °C soda zaczyna się rozpadać sama! Bąbelki płyną do wody wapiennej.', sci: 'Od około 80 °C rozkłada się, powoli: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂.' },
        fast: { kid: 'W 200 °C idzie szybko! Krople wody w probówce, a woda wapienna mętnieje i robi się mleczna.', sci: 'Szybko w 200 °C. Woda skrapla się na zimnym szkle; CO₂ zmętnia wodę wapienną, Ca(OH)₂ + CO₂ → CaCO₃ + H₂O.' },
        done: { kid: 'Nie ma już bąbelków: cała soda zmieniła się w coś nowego, w węglan sodu.', sci: 'Rozkład zakończony: zostaje Na₂CO₃, 63 % masy początkowej (106 g z każdych 168 g).' },
        fresh: { kid: 'Świeża soda zmienia fioletowy sok z kapusty na niebieski: to łagodna zasada.', sci: 'Roztwór NaHCO₃, pH około 8: antocyjany czerwonej kapusty robią się niebieskie.' },
        tubeSame: { kid: 'Niebieski, tak samo jak świeża soda: jeszcze się nie zmieniła. Podgrzej mocniej!', sci: 'Wciąż głównie NaHCO₃: ten sam niebieski. Najpierw podgrzej powyżej 80 °C.' },
        tubeGreen: { kid: 'Zielony! To, co zostało w probówce, to mocniejsza zasada, węglan sodu. Dlatego za dużo sody sprawia, że ciasto smakuje jak mydło.', sci: 'Roztwór Na₂CO₃, pH około 11: wskaźnik robi się zielony. To ten mydlany, gorzki smak ciasta z nadmiarem sody.' },
        refill: { kid: 'Czysta probówka ze świeżą sodą i świeża woda wapienna. Znowu gotowe!', sci: 'Świeży NaHCO₃, świeża woda wapienna, świeży wskaźnik.' },
      },
      panel: {
        kid: [
          'Soda nie potrzebuje niczego kwaśnego, żeby zrobić gaz: samo ciepło ją rozkłada. Powyżej około 80 °C powoli zamienia się w nowy proszek, węglan sodu, i wydziela wodę i dwutlenek węgla.',
          'Przesuń temperaturę albo dotknij palnika. Na zimnym końcu probówki pojawiają się krople wody, a gaz zmienia przezroczystą wodę wapienną w mleczną: tak chemicy rozpoznają dwutlenek węgla. Potem sprawdź oba proszki w fioletowym soku z kapusty.',
        ],
        sci: [
          'Rozkład termiczny: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂. Zachodzi powoli od około 80 do 100 °C i szybko w 200 °C. Tylko jedna cząsteczka CO₂ na dwie NaHCO₃, połowa tego, co uwalnia kwas; 37 % masy uchodzi jako woda i gaz, więc z 10 g sody zostaje 6,3 g węglanu sodu.',
          'Woda wapienna wykrywa CO₂: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O, mleczny osad. Sok z czerwonej kapusty (jej antocyjany) to wskaźnik pH: niebieski dla NaHCO₃ (pH około 8), zielony dla Na₂CO₃ (pH około 11). W cieście z nadmiarem sody to właśnie węglan sodu daje mydlany smak i żółty kolor.',
        ],
      },
    },
  },
  de: {
    title: 'Die Backküche',
    greet: {
      kid: 'Guten Morgen und willkommen in der Küche aus dem Bild! Ich bin das Natrium, und heute wird gebacken. Ich stecke im Natron, und Natron lässt Kuchen aufgehen. Drei Dinge zum Ausprobieren, und die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Guten Morgen. Natron ist Natriumhydrogencarbonat, NaHCO₃: In dieser Küche geht es um das Kohlenstoffdioxid, das es abgibt, mit einer Säure und durch Hitze allein. Drei Dinge zum Ausprobieren, und die Geschichte des Bildes auf der Staffelei.',
    },
    talk: {
      kid: [
        'Natron ist ein weißes Pulver aus Natrium, Wasserstoff, Kohlenstoff und Sauerstoff. Alle Bläschen kommen aus seinem Kohlenstoff und Sauerstoff: Sie sind Kohlenstoffdioxid, ein Gas.',
        'Ein Löffel Natron gibt mit genug Essig mehr als einen Liter Gas! Im Kuchen wird aus diesem Gas eine Unmenge winziger Löcher.',
        'Natron ist nicht nur zum Backen da: Man putzt auch Töpfe damit und stellt ein wenig in den Kühlschrank, damit es Gerüche schluckt.',
      ],
      sci: [
        'Ein Gramm NaHCO₃ (84 g/mol) gibt mit einer Säure etwa 12 mmol CO₂: rund 0,29 L bei 20 °C und Normaldruck. Ein gestrichener Teelöffel, etwa 5 g, gibt ungefähr 1,4 L.',
        'Durch Hitze allein geben zwei NaHCO₃ nur ein CO₂: die Hälfte des Gases, und Natriumcarbonat bleibt zurück. Deshalb kombinieren Rezepte Natron mit einer Säure wie Joghurt, Buttermilch oder Zitronensaft.',
        'Das meiste Natron stammt aus dem Solvay-Verfahren (Salz, Ammoniak und Kohlenstoffdioxid in Wasser) oder aus dem Mineral Trona.',
      ],
    },
    fizz: {
      label: 'Der Sprudeltest',
      title: 'Was sprudelt?',
      signs: { vinegar: 'Essig', lemon: 'Zitronensaft', water: 'Wasser', soda: 'Natron', powder: 'Backpulver' },
      verbs: { vinegar: 'Essig', lemon: 'Zitronensaft', water: 'Wasser', soda: 'Ein Löffel Natron', powder: 'Ein Löffel Backpulver' },
      hints: { pick: 'Tipp ein Glas an, um es auszuwählen', spoon: 'Tipp ein Glas mit Pulver an, um einen Löffel hineinzugeben', more: 'Tipp ein anderes Glas an, oder das andere Pulver' },
      picked: {
        vinegar: { kid: 'Der Essig! Jetzt tipp ein Pulverglas an, um einen Löffel hineinzugeben.', sci: 'Essig: einige Prozent Essigsäure, CH₃COOH. Jetzt ein Pulver.' },
        lemon: { kid: 'Der Zitronensaft! Jetzt tipp ein Pulverglas an, um einen Löffel hineinzugeben.', sci: 'Zitronensaft: etwa 5 % Citronensäure. Jetzt ein Pulver.' },
        water: { kid: 'Das Wasser! Jetzt tipp ein Pulverglas an, um einen Löffel hineinzugeben.', sci: 'Reines Wasser, neutral. Jetzt ein Pulver.' },
      },
      first: { kid: 'Wähl zuerst ein Glas: Tipp es an.', sci: 'Wähl zuerst eine Flüssigkeit: Tipp ein Glas an.' },
      says: {
        'vinegar:soda': {
          kid: 'Wusch! Es schäumt hoch und läuft über! Der saure Essig bringt das Natron dazu, Bläschen aus Kohlenstoffdioxid abzugeben.',
          sci: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂: Der Schaum ist Kohlenstoffdioxid, gefangen in der Flüssigkeit.',
        },
        'lemon:soda': {
          kid: 'Es sprudelt! Zitronensaft ist auch sauer, also sprudelt das Natron genauso.',
          sci: '3 NaHCO₃ + C₆H₈O₇ → Na₃C₆H₅O₇ + 3 H₂O + 3 CO₂: Jede Citronensäure gibt drei H⁺ ab.',
        },
        'water:soda': {
          kid: 'Nichts! Das Natron sinkt nur nach unten und löst sich auf. Zum Sprudeln braucht Natron etwas Saures.',
          sci: 'Ohne Säure kein Gas: NaHCO₃ löst sich einfach (96 g/L bei 20 °C), die Lösung ist schwach basisch, pH etwa 8.',
        },
        'water:powder': {
          kid: 'Es sprudelt in reinem Wasser! Backpulver hat seinen eigenen sauren Teil versteckt dabei, der auf Wasser wartet.',
          sci: 'Backpulver bringt seine eigene trockene Säure mit: Wasser löst beides, und HCO₃⁻ + H⁺ → H₂O + CO₂.',
        },
        'vinegar:powder': {
          kid: 'Es sprudelt, aber weniger als mit Natron: Nur ein Teil des Backpulvers ist Natron.',
          sci: 'Weniger Gas als aus Natron: Backpulver ist nur etwa zu 30 % Hydrogencarbonat, der Rest saures Salz und Stärke.',
        },
        'lemon:powder': {
          kid: 'Es sprudelt! Etwas sanfter als mit Natron: Backpulver ist nur zum Teil Natron.',
          sci: 'Weniger CO₂ als aus demselben Löffel reinem Natron: Es steckt weniger Hydrogencarbonat darin.',
        },
      },
      found: 'Was du herausgefunden hast',
      results: { big: 'Viel Schaum!', some: 'Sprudelt', none: 'Nichts' },
      panel: {
        kid: [
          'Natron ist Natriumhydrogencarbonat, ein Pulver mit Natrium darin. Allein bleibt es ruhig, aber mit etwas Saurem sprudelt es Bläschen aus Kohlenstoffdioxid heraus.',
          'Probier jedes Glas mit jedem Pulver, in beliebiger Reihenfolge: Tipp ein Glas an, um es auszuwählen, dann ein Pulverglas. Was sprudelt? Backpulver ist Natron, schon gemischt mit einem trockenen sauren Pulver und etwas Stärke, deshalb genügt Wasser, um es zu starten.',
        ],
        sci: [
          'Natriumhydrogencarbonat, NaHCO₃, ist das Salz einer schwachen Säure: Eine Säure, die stärker ist als Kohlensäure, übernimmt das Hydrogencarbonat-Ion und setzt Kohlenstoffdioxid frei, HCO₃⁻ + H⁺ → H₂O + CO₂. Essig bringt Essigsäure, Zitronensaft Citronensäure; Wasser allein löst es nur, eine schwach basische Lösung mit pH etwa 8.',
          'Backpulver ist Natron, schon gemischt mit einer trockenen Säure, etwa Weinstein (Kaliumhydrogentartrat) oder einem sauren Phosphat, und mit Stärke, die es trocken hält, bis Wasser beides löst. Bei 84 g/mol kann jedes Gramm Natron bei Raumtemperatur etwa 0,29 L CO₂ geben.',
        ],
      },
    },
    cakes: {
      label: 'Zwei Kuchen',
      title: 'Warum geht ein Kuchen auf?',
      signs: { yoghurt: 'Joghurt', soda: 'Natron', plain: 'ohne alles' },
      verbs: { a: 'Die linke Form', b: 'Die rechte Form', yoghurt: 'Joghurt dazu', soda: 'Natron dazu', bake: 'Beide backen', cutA: 'Den linken Kuchen anschneiden', cutB: 'Den rechten Kuchen anschneiden', mix: 'Neuer Teig' },
      hints: { add: 'Tipp den Joghurt oder das Natron an', bake: 'Tipp den Ofen an, um beide zu backen', watch: 'Schau durch die Ofentür', cut: 'Tipp einen Kuchen an, um ein Stück abzuschneiden', mix: 'Tipp die Küchenmaschine an für neuen Teig' },
      says: {
        pick: { kid: 'Also diese Form. Tipp den Joghurt oder das Natron an, um etwas dazuzugeben.', sci: 'Diese Form. Gib Joghurt dazu, Natron, beides oder nichts.' },
        yoghurt: { kid: 'Ein Löffel Joghurt kommt hinein. Joghurt ist ein bisschen sauer.', sci: 'Joghurt: Milchsäure, von seinen Bakterien gemacht; pH etwa 4 bis 4,5.' },
        soda: { kid: 'Ein Löffel Natron kommt hinein.', sci: 'Natriumhydrogencarbonat: Allein wartet es auf eine Säure oder auf Hitze.' },
        fizzing: { kid: 'Schau, schon winzige Bläschen! Das Natron hat den sauren Joghurt getroffen.', sci: 'Säure und Hydrogencarbonat zusammen: Im Teig bildet sich sofort CO₂, also sollte er bald in den Ofen.' },
        again: { kid: 'Das ist schon in dieser Form.', sci: 'Schon in dieser Form.' },
        mix: { kid: 'Surr! Frischer Teig in beiden Formen: Mehl, Zucker, Eier, Butter und Milch.', sci: 'Frischer Teig, noch ohne Zusatz: Mehl, Zucker, Eier, Butter und Milch, mit eingeschlagener Luft.' },
        baked: { kid: 'Diese Kuchen sind schon gebacken. Tipp zuerst die Küchenmaschine an für neuen Teig.', sci: 'Schon gebacken: zuerst neuer Teig (die Küchenmaschine).' },
        bake: { kid: 'Ab in den Ofen, 180 °C! Backen dauert etwa eine halbe Stunde, deshalb geht es hier schneller.', sci: '180 °C, in Wirklichkeit etwa 30 Minuten (hier beschleunigt): Das Gas dehnt sich aus, Wasser wird zu Dampf, und der Teig wird fest.' },
        risen: { kid: 'Der Kuchen mit Natron und Joghurt ist hoch und locker aufgegangen!', sci: 'Natron und Säure gaben viel CO₂: Die Bläschen schwollen in der Hitze, und die Krume wurde um sie herum fest.' },
        soapy: { kid: 'Der Kuchen mit nur Natron ist ein bisschen aufgegangen, aber er ist gelblich und würde seifig schmecken!', sci: 'Natron ohne Säure: Hitze allein setzt die Hälfte seines CO₂ frei und hinterlässt Natriumcarbonat, gelb und seifig.' },
        flat: { kid: 'Beide Kuchen sind flach und schwer geblieben: Nichts hat Bläschen in ihnen gemacht.', sci: 'Kein Triebmittel: nur die eingeschlagene Luft und etwas Dampf, also eine dichte, flache Krume.' },
        cutRisen: { kid: 'Schau hinein: ein Schwamm voller Löcher! Jedes Loch war ein Gasbläschen, das die Hitze größer gemacht hat.', sci: 'Eine offene, schaumartige Krume: Die Gasbläschen wurden festgehalten, als die Stärke verkleisterte und die Eiweiße fest wurden.' },
        cutSoapy: { kid: 'Ein paar Löcher, aber innen ist er gelblich: Natron ohne etwas Saures, das es aufbraucht.', sci: 'Weniger, ungleichmäßige Bläschen und eine gelbe Krume, vom basischen Natriumcarbonat.' },
        cutFlat: { kid: 'Innen ist er fest und schwer, mit nur winzigen Löchern.', sci: 'Eine dichte, kompakte Krume: wenige Gasbläschen, die sich ausdehnen konnten.' },
      },
      panel: {
        kid: [
          'Ein Kuchen geht wegen der Bläschen auf. Natron macht Bläschen aus Kohlenstoffdioxid, wenn es auf etwas Saures trifft, wie Joghurt, und die Bläschen bleiben im klebrigen Teig gefangen.',
          'Im heißen Ofen werden die Bläschen größer, und dann wird der Teig um sie herum fest, wie ein Schwamm. Probier die Formen auf verschiedene Weise aus (Natron und Joghurt, nur Natron, nur Joghurt, nichts) und schneide dann die Kuchen an, um hineinzuschauen.',
        ],
        sci: [
          'Chemische Lockerung: NaHCO₃ und eine Säure (hier die Milchsäure des Joghurts) setzen CO₂ im Teig frei, der auch beim Rühren eingeschlagene Luft enthält. Im Ofen wachsen die Gasbläschen: Ein Gas dehnt sich zwischen 20 und 100 °C um etwa ein Viertel aus (373/293 K), gelöstes CO₂ entweicht aus der Lösung, und Wasser wird zu Dampf.',
          'Gleichzeitig verkleistert die Stärke, und die Eiweiße aus Ei und Mehl werden fest, sodass die Bläschen als offener Schaum fixiert werden; die Mitte eines Kuchens bleibt bei etwa 100 °C oder darunter, solange sie Wasser enthält. Ohne Säure gibt Natron nur die Hälfte seines CO₂ ab, durch Hitze, und hinterlässt Natriumcarbonat: eine gelbe Krume mit seifigem, bitterem Geschmack.',
        ],
      },
    },
    heat: {
      label: 'Natron in der Flamme',
      title: 'Nur Hitze',
      temp: 'Temperatur des Natrons',
      signs: { fresh: 'frisches Natron', tube: 'aus dem Reagenzglas', lime: 'Kalkwasser', soda: 'Natron' },
      verbs: { fire: 'Brenner anzünden', out: 'Brenner löschen', fresh: 'Eine Prise frisches Natron', tube: 'Eine Prise aus dem Reagenzglas', refill: 'Frisches Natron ins Reagenzglas' },
      hints: { fire: 'Tipp den Brenner an, oder verschieb die Hitze', wait: 'Beobachte das Reagenzglas und das Kalkwasser', test: 'Tipp den Rotkohlsaft an', refill: 'Tipp das Natronglas an, um neu anzufangen' },
      says: {
        fire: { kid: 'Der Brenner brennt. Schau, was mit dem Natron passiert, wenn es heißer wird.', sci: 'Trockenes NaHCO₃ wird erhitzt; Gas, das es abgibt, strömt durch das Röhrchen ins Kalkwasser.' },
        out: { kid: 'Brenner aus. Das Natron kühlt ab.', sci: 'Hitze aus: Die Zersetzung wird langsamer und hört auf.' },
        cool: { kid: 'Noch zu kühl: Es passiert noch nichts.', sci: 'Unterhalb von etwa 80 °C verändert sich festes NaHCO₃ kaum.' },
        starts: { kid: 'Über etwa 80 °C zerfällt das Natron von selbst! Bläschen strömen ins Kalkwasser.', sci: 'Ab etwa 80 °C zersetzt es sich, langsam: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂.' },
        fast: { kid: 'Bei 200 °C geht es schnell! Wassertropfen im Reagenzglas, und das Kalkwasser wird milchig trüb.', sci: 'Schnell bei 200 °C. Das Wasser kondensiert am kühlen Glas; das CO₂ trübt das Kalkwasser, Ca(OH)₂ + CO₂ → CaCO₃ + H₂O.' },
        done: { kid: 'Keine Bläschen mehr: Das ganze Natron ist etwas Neues geworden, Natriumcarbonat.', sci: 'Zersetzung vollständig: Übrig ist Na₂CO₃, 63 % der Anfangsmasse (106 g aus je 168 g).' },
        fresh: { kid: 'Frisches Natron färbt den lila Rotkohlsaft blau: eine sanfte Base.', sci: 'NaHCO₃-Lösung, pH etwa 8: Die Anthocyane des Rotkohls werden blau.' },
        tubeSame: { kid: 'Blau, genau wie frisches Natron: Es hat sich noch nicht verändert. Erhitz es weiter!', sci: 'Noch fast nur NaHCO₃: dasselbe Blau. Erhitz es zuerst über 80 °C.' },
        tubeGreen: { kid: 'Grün! Was im Reagenzglas übrig ist, ist eine stärkere Base, Natriumcarbonat. Deshalb schmeckt ein Kuchen mit zu viel Natron seifig.', sci: 'Na₂CO₃-Lösung, pH etwa 11: Der Indikator wird grün. Das ist der seifige, bittere Geschmack eines Kuchens mit zu viel Natron.' },
        refill: { kid: 'Ein sauberes Reagenzglas mit frischem Natron, und frisches Kalkwasser. Wieder bereit!', sci: 'Frisches NaHCO₃, frisches Kalkwasser, frischer Indikator.' },
      },
      panel: {
        kid: [
          'Natron braucht nichts Saures, um Gas zu machen: Hitze allein bricht es auseinander. Über etwa 80 °C wird es langsam zu einem neuen Pulver, Natriumcarbonat, und gibt Wasser und Kohlenstoffdioxid ab.',
          'Verschieb die Temperatur oder tipp den Brenner an. Am kühlen Ende des Reagenzglases erscheinen Wassertropfen, und das Gas macht das klare Kalkwasser milchig: So erkennen Chemiker Kohlenstoffdioxid. Dann teste beide Pulver im lila Rotkohlsaft.',
        ],
        sci: [
          'Thermische Zersetzung: 2 NaHCO₃ → Na₂CO₃ + H₂O + CO₂. Sie läuft langsam ab etwa 80 bis 100 °C und schnell bei 200 °C. Nur ein CO₂ auf zwei NaHCO₃, die Hälfte dessen, was eine Säure freisetzt; 37 % der Masse entweichen als Wasser und Gas, also bleiben von 10 g Natron 6,3 g Natriumcarbonat.',
          'Kalkwasser weist das CO₂ nach: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O, ein milchiger Niederschlag. Rotkohlsaft (seine Anthocyane) ist ein pH-Indikator: blau für NaHCO₃ (pH etwa 8), grün für Na₂CO₃ (pH etwa 11). In einem Kuchen mit zu viel Natron gibt dieses Natriumcarbonat, auch Soda genannt, den seifigen Geschmack und die gelbe Farbe.',
        ],
      },
    },
  },
}
