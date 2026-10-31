// The words of iron's cereal room ("Can a magnet pull iron from cereal?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Fe.js (the easel shows it); the room shows it happening and adds to it.
// Sources: NIH Office of Dietary Supplements, Iron fact sheet (RDA 8 mg for ages 9 to 13; haem iron better
// absorbed; vitamin C, tea polyphenols, phytate, calcium); EFSA's dietary reference values for iron (2015:
// 11 mg for ages 7 to 11); WHO, Guidelines on food fortification with micronutrients (2006: reduced,
// electrolytic and carbonyl iron powders, grain sizes); USDA FoodData Central, SR Legacy (lentils cooked
// 3.33 mg/100 g, spinach cooked 3.57 mg/100 g, a large egg about 0.9 mg, wholemeal bread 2.5 mg/100 g, lean
// beef about 2.5 mg/100 g); physiology textbooks (DMT1, ferroportin, hepcidin; macrophages recycle about 20 to
// 25 mg a day; losses about 1 mg a day; stomach pH about 1.5 to 3.5). The absorption shares the room uses
// (haem 25%, non-haem 8%, x2.5 with orange juice, x0.4 with tea) are a model inside the published ranges.
// The spinach "decimal point" story is left out on purpose: it is itself doubtful (Sutton, 2010).
// Placeholders: {mg}, {got}, {total}, {ph}, {h}, {food}, {kind}, {eaten}, {in}, {pct}.
export const CEREAL_WORDS = {
  en: {
    title: 'The breakfast table',
    greet: {
      kid: 'We are inside the picture, and we are as small as a mouse! The bowl is a pond, the cereal box a tower. Some cereals have real iron metal in them: let\'s catch it with the magnet. The picture\'s story is on the easel.',
      sci: 'A breakfast table at twenty times life size: a bowl of iron-fortified flakes, a magnet hung from a spoon on a pepper mill, a flask of model stomach acid and a plate of foods with iron. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'A grown-up\'s whole body holds only about 4 grams of iron, about as much as one nail. Most of it is in the blood, and it makes the blood red.',
        'The iron in cereal is a powder so fine that you could never feel it on your tongue. Your stomach turns it into iron your body can use.',
        'Lots of people think spinach is packed with iron. It has some, about as much as lentils, but it keeps most of it to itself.',
      ],
      sci: [
        'An adult holds about 3 to 4 g of iron, roughly two thirds of it in haemoglobin; much of the rest is stored as ferritin, mainly in the liver.',
        'Elemental iron powders are cheap and keep well, and unlike soluble iron salts they hardly change a cereal\'s colour or taste. The price: they are absorbed less well than ferrous sulfate.',
        'Cooked spinach has about 3.6 mg of iron per 100 g, close to cooked lentils\' 3.3 mg, but only a small share of it is absorbed: its oxalate and polyphenols bind it.',
      ],
    },
    bowl: {
      label: 'The magnet and the bowl',
      title: 'Pull the iron out of cereal',
      box: { name: 'FLAKES', sub: 'with added iron', facts: 'In one bowl', iron: 'Iron', rows: [['Flakes', '30 g']] },
      signs: { caught: 'Iron pulled out', of: '{mg} mg of {total} mg' },
      hints: { crush: 'Tap the flakes to crush them', sweep: 'Tap the magnet to stir it through', more: 'Tap the flakes to crush them finer', flask: 'Tap the flask to drop the specks in', fresh: 'Tap the box for a fresh bowl', busy: 'Watch the magnet' },
      buttons: { crush: 'Crush the flakes', sweep: 'Stir with the magnet', fresh: 'A fresh bowl' },
      says: {
        crush: [
          { kid: 'Crunch! The flakes break into pieces.', sci: 'Broken up: more of the iron grains are freed from the flakes.' },
          { kid: 'Crunch, crunch! Now they are crumbs.', sci: 'Crumbs: still more of the powder is free.' },
          { kid: 'Now it is a soggy mush. The tiny iron grains can move about.', sci: 'A slurry: most of the iron powder can now reach the magnet.' },
        ],
        mush: { kid: 'It cannot get any mushier! Stir it with the magnet.', sci: 'Already a fine slurry: stir it.' },
        sweep: { kid: 'Look at the black specks jumping onto the magnet! That is real iron metal: {mg} mg so far.', sci: '{got} mg on this stir, {mg} mg in all: ferromagnetic elemental iron, pulled out of the slurry.' },
        little: { kid: 'Only a few specks. The iron is stuck inside the flakes: crush them first!', sci: 'Very little ({got} mg): the powder is locked inside the flakes. Crush them to a slurry.' },
        empty: { kid: 'Hardly anything more comes out. Tap the box for a fresh bowl.', sci: 'The free iron is nearly all out; what is left stays in the crumbs.' },
        fresh: { kid: 'A fresh bowl of flakes!', sci: 'A fresh serving: 30 g of flakes with 4 mg of added iron.' },
      },
      panel: {
        kid: [
          'Many breakfast cereals have iron added as a fine powder of real iron metal. Each grain is thinner than a hair, so you never notice it.',
          'A magnet pulls iron. In whole flakes the grains are stuck inside, so the magnet gets very little. Crush the flakes, stir slowly, and the freed grains gather on the magnet as black specks.',
          'You can try it at home with a grown-up: crushed cereal in water, a strong magnet in a plastic bag, and lots of slow stirring. It works only if the cereal has iron metal in it: its label says "iron" or "reduced iron".',
        ],
        sci: [
          'Cereals and flours are often fortified with elemental iron powder: reduced iron (iron oxide reduced with hydrogen or carbon monoxide), electrolytic iron, or carbonyl iron (made from iron pentacarbonyl). Most grains are under 45 µm, carbonyl iron only a few µm. Being ferromagnetic, they can be pulled out with a magnet; iron salts such as ferrous sulfate or fumarate cannot.',
          'How much comes out depends on how finely the cereal is broken up and how long it is stirred: little from whole flakes, much more from a slurry. The room\'s numbers are a model: a 30 g serving with 4 mg of added iron. Fortified cereals carry from about 2 mg to 18 mg a serving: many European ones a few mg, some American ones 18 mg, the whole US daily value.',
        ],
      },
    },
    flask: {
      label: 'The stomach flask',
      title: 'Acid dissolves the iron',
      signs: { ph: 'pH {ph}', acid: 'like stomach acid', weak: 'a weak acid', water: 'like plain water', gone: 'Iron dissolved {mg} mg' },
      slider: 'pH (lower is more acid)',
      hints: { none: 'Catch iron with the magnet first', drop: 'Tap the flask to drop the specks in', fizz: 'Tap the lens to see the atoms', water: 'No fizz in water, slide the pH down (press E)', done: 'All dissolved, catch more with the magnet', busy: 'Watch the specks fall' },
      buttons: { drop: 'Drop the specks in', lens: 'Next step in the lens', stomach: 'Stomach acid (pH 2)', water: 'Plain water (pH 7)' },
      says: {
        empty: { kid: 'The magnet has no specks yet. Stir it through the cereal first.', sci: 'No iron on the magnet yet.' },
        drop: { kid: 'The funnel scrapes the specks off, they fall into the acid, and it fizzes! The bubbles are hydrogen gas, and the iron slowly disappears into the liquid.', sci: 'Fe + 2 H⁺ → Fe²⁺ + H₂: hydrogen bubbles off and the iron goes into solution as Fe²⁺.' },
        water: { kid: 'In plain water nothing happens: it is not acid enough.', sci: 'pH {ph}: too few H⁺ ions, and the iron does not dissolve (in water and air it would only rust, slowly).' },
        faster: { kid: 'More acid: faster fizzing!', sci: 'pH {ph}: [H⁺] = {h} mol/L, faster.' },
        slower: { kid: 'Less acid: the fizz slows down.', sci: 'pH {ph}: [H⁺] = {h} mol/L, slower.' },
        fizz: { kid: 'Fizzing away! Tap the lens to see what the atoms do.', sci: 'Still dissolving: hydrogen is given off at the iron\'s surface.' },
        done: { kid: 'All the specks are gone. The iron is still there, as invisible iron ions in the liquid, ready to be taken in.', sci: 'All dissolved: the iron is Fe²⁺ in solution, the form the gut takes up.' },
      },
      lens: [
        { kid: 'A new iron atom sits at the surface. Tap the lens again to watch it.', sci: 'The next atom at the surface: tap to watch again.' },
        { kid: 'Two H+ come close to an iron atom. An H+ is a hydrogen atom without its electron, and acid is full of them.', sci: 'Two H⁺ ions (H₃O⁺ in water) meet an iron atom at the metal\'s surface.' },
        { kid: 'The iron atom gives away two electrons, one to each H+.', sci: 'Fe → Fe²⁺ + 2 e⁻ (oxidation); 2 H⁺ + 2 e⁻ → 2 H (reduction).' },
        { kid: 'The two hydrogens join up into H2 and bubble away. The iron atom, now Fe2+, swims off into the liquid: dissolved!', sci: 'The two H atoms join as H₂, a bubble; Fe²⁺ leaves the metal for the solution, surrounded by water molecules.' },
      ],
      panel: {
        kid: [
          'Your stomach makes acid, strong enough to fizz iron metal away. When iron meets acid, each iron atom gives away two electrons and floats off into the liquid as an iron ion. The bubbles are hydrogen gas.',
          'Slide the pH: pH 7 is plain water, and nothing happens. The lower the pH, the stronger the acid and the faster the fizz. A stomach is about pH 1.5 to 3.5. The flask here goes much faster than a real stomach.',
        ],
        sci: [
          'Gastric acid (hydrochloric acid, pH about 1.5 to 3.5) dissolves elemental iron: Fe + 2 H⁺ → Fe²⁺ + H₂. The iron is oxidised, losing two electrons; the hydrogen ions are reduced and leave as gas. Solutions of Fe²⁺ are pale green; the flask\'s colour is made stronger to be seen.',
          'pH = −log₁₀[H⁺]: each step down is ten times more acid, and at pH 7 the reaction all but stops. A finer powder has more surface and dissolves faster, one reason why the finest powders are absorbed best. Less stomach acid (with antacids, for example) means less of such iron is taken in. The flask runs much faster than a real stomach.',
        ],
      },
    },
    gate: {
      label: 'The gut\'s gate',
      title: 'How much iron gets in?',
      foods: { steak: { name: 'Steak' }, egg: { name: 'Egg' }, bread: { name: 'Wholemeal bread' }, cereal: { name: 'Bowl of flakes' }, lentils: { name: 'Lentils' }, spinach: { name: 'Spinach' } },
      kinds: {
        meat: { kid: 'some of it haem iron, the easy kind', sci: 'part of it haem iron' },
        plant: { kid: 'the kind that is harder to take in', sci: 'non-haem iron' },
      },
      signs: { wall: 'Your gut\'s wall', letIn: 'Let in {mg} mg', loop: 'Used again', loopSub: '20 to 25 mg a day', red: 'old red cells', cleaner: 'cleaner cells', with: 'with the meal', oj: 'Orange juice', tea: 'Tea' },
      board: {
        title: 'Today',
        eaten: 'Eaten',
        letIn: 'Let in',
        used: 'Used again',
        usedValue: '20 to 25 mg a day',
        need: { kid: '{mg} mg, a day\'s need', sci: 'RDA {mg} mg (age 9 to 13)' },
        needIn: { kid: '1 to 2 mg is enough', sci: 'absorbed 1 to 2 mg a day' },
      },
      hints: { food: 'Tap foods to put them on the plate', eat: 'Tap the plate to eat', again: 'Tap more foods, the juice or the tea', busy: 'Watch the iron' },
      buttons: { eat: 'Eat it all', oj: 'Orange juice with it', ojOff: 'No orange juice', tea: 'Tea with it', teaOff: 'No tea', day: 'A new day', add: 'On the plate: {food}', remove: 'Off the plate: {food}' },
      says: {
        add: { kid: '{food} on the plate: {mg} mg of iron, {kind}.', sci: '{food}: {mg} mg of iron, {kind}.' },
        remove: { kid: '{food} back on the table.', sci: '{food} taken off.' },
        eat: { kid: 'Yum! {eaten} mg of iron eaten, but the gate let in only {in} mg.', sci: '{eaten} mg eaten, {in} mg absorbed ({pct}%).' },
        oj: { kid: 'A glass of orange juice with the meal: its vitamin C helps plant iron through the gate.', sci: 'Ascorbic acid with the meal keeps non-haem iron soluble as Fe²⁺: two to three times more is absorbed.' },
        ojOff: { kid: 'No juice this time.', sci: 'No ascorbic acid.' },
        tea: { kid: 'A cup of tea with the meal: tea holds plant iron back.', sci: 'Tea with the meal: its polyphenols bind non-haem iron, and absorption falls by more than half.' },
        teaOff: { kid: 'No tea this time.', sci: 'No tea.' },
        empty: { kid: 'The plate is empty. Tap some food first!', sci: 'Nothing on the plate.' },
        day: { kid: 'A new day: the bars start again.', sci: 'A new day: the counts start again.' },
        loop: { kid: 'Your body keeps its iron! Every day it takes about 20 to 25 mg back from old red blood cells and uses it again, far more than the 1 to 2 mg it lets in.', sci: 'Macrophages recycle about 20 to 25 mg of iron a day from red cells at the end of their life of about 120 days, against 1 to 2 mg absorbed. The body has no active way to excrete iron: about 1 mg a day is lost with shed cells and small bleeds.' },
      },
      panel: {
        kid: [
          'Your gut\'s wall is the gate where iron gets into your body, and it lets in only a little. A child of 9 to 13 should eat about 8 mg of iron a day, yet only about 1 to 2 mg of it gets in.',
          'Iron from meat and fish, called haem iron, gets through best. Iron from plants, and the iron added to cereals, get through less: orange juice helps them, tea holds them back. Your body uses its iron again and again, so a little each day is enough.',
        ],
        sci: [
          'Iron is absorbed mainly in the duodenum. Non-haem iron is reduced to Fe²⁺ (vitamin C helps) and carried into the lining cells by the transporter DMT1; haem is taken up whole. Typical shares: haem about 15 to 35%, non-haem about 2 to 20%, depending on the meal and the body\'s stores. The room uses 25% and 8%, times 2.5 with orange juice and 0.4 with tea; spinach, egg and wholemeal bread hold some of theirs back (oxalate, phosvitin, phytate).',
          'The body cannot excrete iron, so it controls what comes in: when the stores are full, the liver\'s hormone hepcidin shuts ferroportin, the exit from the gut cells. About 1 to 2 mg a day is absorbed, matching the losses; macrophages recycle 20 to 25 mg a day. The US recommendation for ages 9 to 13 is 8 mg a day (EFSA advises 11 mg for ages 7 to 11).',
          'Portions: steak 100 g (2.5 mg, taken as 40% haem iron, a common average for meat), one egg (0.9 mg), a slice of wholemeal bread (0.8 mg), the bowl of flakes (4 mg), lentils and spinach 100 g cooked (3.3 and 3.6 mg). USDA values, rounded.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A mesa do pequeno-almoço',
    greet: {
      kid: 'Estamos dentro da imagem, e somos do tamanho de um rato! A taça é um lago, a caixa de cereais uma torre. Alguns cereais têm ferro metálico a sério: vamos apanhá-lo com o íman. A história da imagem está no cavalete.',
      sci: 'Uma mesa de pequeno-almoço vinte vezes maior do que a real: uma taça de flocos fortificados com ferro, um íman pendurado numa colher sobre um moinho de pimenta, um balão com ácido do estômago a fingir e um prato de alimentos com ferro. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O corpo inteiro de um adulto tem só cerca de 4 gramas de ferro, mais ou menos o que há num prego. A maior parte está no sangue, e é ela que o faz vermelho.',
        'O ferro dos cereais é um pó tão fino que nunca o sentirias na língua. O teu estômago transforma-o em ferro que o teu corpo pode usar.',
        'Muita gente pensa que os espinafres estão cheios de ferro. Têm algum, mais ou menos o mesmo que as lentilhas, mas guardam quase todo para eles.',
      ],
      sci: [
        'Um adulto tem cerca de 3 a 4 g de ferro, uns dois terços na hemoglobina; boa parte do resto fica guardada como ferritina, sobretudo no fígado.',
        'Os pós de ferro elementar são baratos e conservam-se bem e, ao contrário dos sais de ferro solúveis, quase não mudam a cor nem o sabor dos cereais. O preço: são menos bem absorvidos do que o sulfato ferroso.',
        'Os espinafres cozidos têm cerca de 3,6 mg de ferro por 100 g, perto dos 3,3 mg das lentilhas cozidas, mas só uma pequena parte é absorvida: o oxalato e os polifenóis da folha prendem-no.',
      ],
    },
    bowl: {
      label: 'O íman e a taça',
      title: 'Tirar o ferro dos cereais',
      box: { name: 'FLOCOS', sub: 'com ferro adicionado', facts: 'Numa taça', iron: 'Ferro', rows: [['Flocos', '30 g']] },
      signs: { caught: 'Ferro tirado', of: '{mg} mg de {total} mg' },
      hints: { crush: 'Toca nos flocos para os esmagar', sweep: 'Toca no íman para mexer com ele', more: 'Toca nos flocos para os esmagar mais', flask: 'Toca no balão para deixar cair os grãos', fresh: 'Toca na caixa para uma taça nova', busy: 'Olha para o íman' },
      buttons: { crush: 'Esmagar os flocos', sweep: 'Mexer com o íman', fresh: 'Uma taça nova' },
      says: {
        crush: [
          { kid: 'Crunch! Os flocos partem-se em bocados.', sci: 'Partidos: mais grãos de ferro ficam soltos dos flocos.' },
          { kid: 'Crunch, crunch! Agora são migalhas.', sci: 'Migalhas: ainda mais pó fica livre.' },
          { kid: 'Agora é uma papa mole. Os grãozinhos de ferro já se podem mexer.', sci: 'Uma papa: quase todo o pó de ferro já chega ao íman.' },
        ],
        mush: { kid: 'Não dá para ficar mais papa! Mexe com o íman.', sci: 'Já é uma papa fina: mexe.' },
        sweep: { kid: 'Olha os pontinhos pretos a saltar para o íman! É ferro metálico a sério: {mg} mg até agora.', sci: '{got} mg nesta volta, {mg} mg ao todo: ferro elementar, ferromagnético, tirado da papa.' },
        little: { kid: 'Só uns pontinhos. O ferro está preso dentro dos flocos: esmaga-os primeiro!', sci: 'Muito pouco ({got} mg): o pó está fechado dentro dos flocos. Esmaga-os até fazer uma papa.' },
        empty: { kid: 'Já quase não sai mais nada. Toca na caixa para uma taça nova.', sci: 'O ferro livre já saiu quase todo; o resto fica nas migalhas.' },
        fresh: { kid: 'Uma taça nova de flocos!', sci: 'Uma dose nova: 30 g de flocos com 4 mg de ferro adicionado.' },
      },
      panel: {
        kid: [
          'Muitos cereais de pequeno-almoço levam ferro acrescentado, como um pó fininho de ferro metálico a sério. Cada grão é mais fino do que um cabelo, por isso nunca dás por ele.',
          'Um íman puxa o ferro. Nos flocos inteiros os grãos estão presos lá dentro, e o íman apanha muito pouco. Esmaga os flocos, mexe devagar, e os grãos soltos juntam-se no íman como pontinhos pretos.',
          'Podes experimentar em casa com um adulto: cereais esmagados em água, um íman forte dentro de um saco de plástico e muito tempo a mexer devagar. Só funciona se os cereais tiverem ferro metálico: o rótulo diz "ferro" ou "ferro reduzido".',
        ],
        sci: [
          'Os cereais e as farinhas são muitas vezes fortificados com pó de ferro elementar: ferro reduzido (óxido de ferro reduzido com hidrogénio ou monóxido de carbono), ferro eletrolítico ou ferro carbonilo (feito a partir do pentacarbonilo de ferro). A maior parte dos grãos tem menos de 45 µm, o ferro carbonilo só alguns µm. Por serem ferromagnéticos, um íman consegue tirá-los; os sais de ferro, como o sulfato ou o fumarato ferroso, não.',
          'Quanto sai depende de quão bem se esmagam os cereais e de quanto tempo se mexe: pouco dos flocos inteiros, muito mais de uma papa. Os números da sala são um modelo: uma dose de 30 g com 4 mg de ferro adicionado. Os cereais fortificados levam de cerca de 2 mg a 18 mg por dose: muitos europeus alguns mg, alguns americanos 18 mg, todo o valor diário dos EUA.',
        ],
      },
    },
    flask: {
      label: 'O balão do estômago',
      title: 'O ácido dissolve o ferro',
      signs: { ph: 'pH {ph}', acid: 'como o ácido do estômago', weak: 'um ácido fraco', water: 'como água simples', gone: 'Ferro dissolvido {mg} mg' },
      slider: 'pH (mais baixo é mais ácido)',
      hints: { none: 'Primeiro apanha ferro com o íman', drop: 'Toca no balão para deixar cair os grãos', fizz: 'Toca na lupa para ver os átomos', water: 'Na água não borbulha, desce o pH (carrega em E)', done: 'Tudo dissolvido, apanha mais com o íman', busy: 'Olha os grãos a cair' },
      buttons: { drop: 'Deixar cair os grãos', lens: 'Passo seguinte na lupa', stomach: 'Ácido do estômago (pH 2)', water: 'Água simples (pH 7)' },
      says: {
        empty: { kid: 'O íman ainda não tem grãos. Primeiro mexe com ele nos cereais.', sci: 'Ainda não há ferro no íman.' },
        drop: { kid: 'O funil raspa os grãos, eles caem no ácido, e borbulha! As bolhas são hidrogénio, e o ferro desaparece devagar no líquido.', sci: 'Fe + 2 H⁺ → Fe²⁺ + H₂: liberta-se hidrogénio e o ferro passa para a solução como Fe²⁺.' },
        water: { kid: 'Na água simples não acontece nada: não é ácida o suficiente.', sci: 'pH {ph}: poucos iões H⁺, e o ferro não se dissolve (na água e ao ar só enferrujaria, devagar).' },
        faster: { kid: 'Mais ácido: borbulha mais depressa!', sci: 'pH {ph}: [H⁺] = {h} mol/L, mais depressa.' },
        slower: { kid: 'Menos ácido: o borbulhar abranda.', sci: 'pH {ph}: [H⁺] = {h} mol/L, mais devagar.' },
        fizz: { kid: 'Está a borbulhar! Toca na lupa para ver o que fazem os átomos.', sci: 'Ainda a dissolver: liberta-se hidrogénio na superfície do ferro.' },
        done: { kid: 'Os grãos desapareceram todos. O ferro continua lá, como iões de ferro invisíveis no líquido, pronto a ser absorvido.', sci: 'Tudo dissolvido: o ferro é Fe²⁺ em solução, a forma que o intestino absorve.' },
      },
      lens: [
        { kid: 'Um átomo de ferro novo está à superfície. Toca outra vez na lupa para ver.', sci: 'O átomo seguinte à superfície: toca para ver outra vez.' },
        { kid: 'Dois H+ aproximam-se de um átomo de ferro. Um H+ é um átomo de hidrogénio sem o seu eletrão, e o ácido está cheio deles.', sci: 'Dois iões H⁺ (H₃O⁺ na água) encontram um átomo de ferro à superfície do metal.' },
        { kid: 'O átomo de ferro dá dois eletrões, um a cada H+.', sci: 'Fe → Fe²⁺ + 2 e⁻ (oxidação); 2 H⁺ + 2 e⁻ → 2 H (redução).' },
        { kid: 'Os dois hidrogénios juntam-se em H2 e vão-se numa bolha. O átomo de ferro, agora Fe2+, nada para o líquido: dissolveu-se!', sci: 'Os dois átomos de H juntam-se em H₂, uma bolha; o Fe²⁺ deixa o metal e passa para a solução, rodeado de moléculas de água.' },
      ],
      panel: {
        kid: [
          'O teu estômago faz ácido, forte o suficiente para fazer o ferro metálico desaparecer a borbulhar. Quando o ferro encontra o ácido, cada átomo de ferro dá dois eletrões e vai para o líquido como um ião de ferro. As bolhas são hidrogénio.',
          'Mexe no pH: pH 7 é água simples, e não acontece nada. Quanto mais baixo o pH, mais forte o ácido e mais depressa borbulha. Um estômago tem um pH de cerca de 1,5 a 3,5. Aqui o balão vai muito mais depressa do que um estômago a sério.',
        ],
        sci: [
          'O suco gástrico (ácido clorídrico, pH de cerca de 1,5 a 3,5) dissolve o ferro elementar: Fe + 2 H⁺ → Fe²⁺ + H₂. O ferro oxida-se, perdendo dois eletrões; os iões de hidrogénio reduzem-se e saem como gás. As soluções de Fe²⁺ são verde-claras; a cor do balão está reforçada para se ver.',
          'pH = −log₁₀[H⁺]: cada degrau para baixo é dez vezes mais ácido, e a pH 7 a reação quase para. Um pó mais fino tem mais superfície e dissolve-se mais depressa, uma das razões por que os pós mais finos são os mais bem absorvidos. Menos ácido no estômago (com antiácidos, por exemplo) quer dizer menos deste ferro absorvido. O balão anda muito mais depressa do que um estômago a sério.',
        ],
      },
    },
    gate: {
      label: 'A porta do intestino',
      title: 'Quanto ferro entra?',
      foods: { steak: { name: 'Bife' }, egg: { name: 'Ovo' }, bread: { name: 'Pão integral' }, cereal: { name: 'Taça de flocos' }, lentils: { name: 'Lentilhas' }, spinach: { name: 'Espinafres' } },
      kinds: {
        meat: { kid: 'parte dele ferro heme, o tipo fácil', sci: 'parte dele ferro heme' },
        plant: { kid: 'o tipo que custa mais a absorver', sci: 'ferro não heme' },
      },
      signs: { wall: 'A parede do teu intestino', letIn: 'Entrou {mg} mg', loop: 'Usado outra vez', loopSub: '20 a 25 mg por dia', red: 'glóbulos vermelhos velhos', cleaner: 'células limpadoras', with: 'com a refeição', oj: 'Sumo de laranja', tea: 'Chá' },
      board: {
        title: 'Hoje',
        eaten: 'Comido',
        letIn: 'Entrou',
        used: 'Reusado',
        usedValue: '20 a 25 mg por dia',
        need: { kid: '{mg} mg, o que precisas por dia', sci: 'DDR {mg} mg (9 a 13 anos)' },
        needIn: { kid: '1 a 2 mg chegam', sci: 'absorvido 1 a 2 mg por dia' },
      },
      hints: { food: 'Toca nos alimentos para os pôr no prato', eat: 'Toca no prato para comer', again: 'Toca em mais alimentos, no sumo ou no chá', busy: 'Olha para o ferro' },
      buttons: { eat: 'Comer tudo', oj: 'Com sumo de laranja', ojOff: 'Sem sumo de laranja', tea: 'Com chá', teaOff: 'Sem chá', day: 'Um dia novo', add: 'Para o prato: {food}', remove: 'Fora do prato: {food}' },
      says: {
        add: { kid: '{food} no prato: {mg} mg de ferro, {kind}.', sci: '{food}: {mg} mg de ferro, {kind}.' },
        remove: { kid: '{food} de volta à mesa.', sci: '{food} retirado.' },
        eat: { kid: 'Que bom! Comeste {eaten} mg de ferro, mas a porta só deixou entrar {in} mg.', sci: '{eaten} mg comidos, {in} mg absorvidos ({pct}%).' },
        oj: { kid: 'Um copo de sumo de laranja com a refeição: a vitamina C ajuda o ferro das plantas a passar a porta.', sci: 'O ácido ascórbico na refeição mantém o ferro não heme solúvel como Fe²⁺: absorve-se duas a três vezes mais.' },
        ojOff: { kid: 'Desta vez sem sumo.', sci: 'Sem ácido ascórbico.' },
        tea: { kid: 'Uma chávena de chá com a refeição: o chá trava o ferro das plantas.', sci: 'Chá na refeição: os polifenóis prendem o ferro não heme, e a absorção desce para menos de metade.' },
        teaOff: { kid: 'Desta vez sem chá.', sci: 'Sem chá.' },
        empty: { kid: 'O prato está vazio. Primeiro toca nalguns alimentos!', sci: 'Não há nada no prato.' },
        day: { kid: 'Um dia novo: as barras começam outra vez.', sci: 'Um dia novo: as contas recomeçam.' },
        loop: { kid: 'O teu corpo guarda o seu ferro! Todos os dias vai buscar cerca de 20 a 25 mg aos glóbulos vermelhos velhos e usa-o outra vez, muito mais do que os 1 a 2 mg que deixa entrar.', sci: 'Os macrófagos reciclam cerca de 20 a 25 mg de ferro por dia dos glóbulos vermelhos no fim da sua vida de cerca de 120 dias, contra 1 a 2 mg absorvidos. O corpo não tem maneira ativa de excretar ferro: perde-se cerca de 1 mg por dia com células que se soltam e pequenas perdas de sangue.' },
      },
      panel: {
        kid: [
          'A parede do teu intestino é a porta por onde o ferro entra no corpo, e deixa entrar só um bocadinho. Uma criança dos 9 aos 13 anos deve comer cerca de 8 mg de ferro por dia, mas só entram cerca de 1 a 2 mg.',
          'O ferro da carne e do peixe, chamado ferro heme, é o que passa melhor. O ferro das plantas, e o que se junta aos cereais, passam menos: o sumo de laranja ajuda, o chá trava. O teu corpo usa o seu ferro vezes sem conta, por isso um bocadinho por dia chega.',
        ],
        sci: [
          'O ferro é absorvido sobretudo no duodeno. O ferro não heme é reduzido a Fe²⁺ (a vitamina C ajuda) e levado para dentro das células da parede pelo transportador DMT1; o heme entra inteiro. Proporções típicas: heme cerca de 15 a 35%, não heme cerca de 2 a 20%, conforme a refeição e as reservas do corpo. A sala usa 25% e 8%, vezes 2,5 com sumo de laranja e 0,4 com chá; os espinafres, o ovo e o pão integral prendem parte do seu (oxalato, fosvitina, fitato).',
          'O corpo não consegue excretar ferro, por isso controla o que entra: quando as reservas estão cheias, a hormona hepcidina, do fígado, fecha a ferroportina, a saída das células do intestino. Absorve-se cerca de 1 a 2 mg por dia, o mesmo que se perde; os macrófagos reciclam 20 a 25 mg por dia. A recomendação dos EUA para os 9 aos 13 anos é 8 mg por dia (a EFSA aconselha 11 mg dos 7 aos 11 anos).',
          'Doses: bife 100 g (2,5 mg, contado como 40% de ferro heme, uma média comum para a carne), um ovo (0,9 mg), uma fatia de pão integral (0,8 mg), a taça de flocos (4 mg), lentilhas e espinafres 100 g cozidos (3,3 e 3,6 mg). Valores do USDA, arredondados.',
        ],
      },
    },
  },
  pl: {
    title: 'Stół śniadaniowy',
    greet: {
      kid: 'Jesteśmy w środku obrazka i jesteśmy mali jak mysz! Miska to staw, a pudełko płatków to wieża. Niektóre płatki mają w sobie prawdziwe metaliczne żelazo: złapmy je magnesem. Historia obrazka jest na sztaludze.',
      sci: 'Stół śniadaniowy dwadzieścia razy większy niż naprawdę: miska płatków wzbogaconych żelazem, magnes zawieszony na łyżce opartej na młynku do pieprzu, kolba z modelowym kwasem żołądkowym i talerz z jedzeniem zawierającym żelazo. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Całe ciało dorosłego ma tylko około 4 gramów żelaza, mniej więcej tyle, ile jest w jednym gwoździu. Większość jest we krwi i to ono robi ją czerwoną.',
        'Żelazo w płatkach to proszek tak drobny, że nigdy nie poczujesz go na języku. Twój żołądek zamienia je w żelazo, którego ciało może używać.',
        'Wiele osób myśli, że szpinak jest pełen żelaza. Ma go trochę, mniej więcej tyle co soczewica, ale prawie wszystko zatrzymuje dla siebie.',
      ],
      sci: [
        'Dorosły ma około 3 do 4 g żelaza, mniej więcej dwie trzecie w hemoglobinie; duża część reszty jest zmagazynowana jako ferrytyna, głównie w wątrobie.',
        'Proszki żelaza pierwiastkowego są tanie i trwałe, a w przeciwieństwie do rozpuszczalnych soli żelaza prawie nie zmieniają koloru ani smaku płatków. Cena: wchłaniają się gorzej niż siarczan żelaza(II).',
        'Gotowany szpinak ma około 3,6 mg żelaza na 100 g, blisko 3,3 mg gotowanej soczewicy, ale wchłania się tylko mała część: szczawiany i polifenole liścia je wiążą.',
      ],
    },
    bowl: {
      label: 'Magnes i miska',
      title: 'Wyciągnij żelazo z płatków',
      box: { name: 'PŁATKI', sub: 'z dodatkiem żelaza', facts: 'W jednej misce', iron: 'Żelazo', rows: [['Płatki', '30 g']] },
      signs: { caught: 'Wyciągnięte żelazo', of: '{mg} mg z {total} mg' },
      hints: { crush: 'Dotknij płatków, żeby je rozgnieść', sweep: 'Dotknij magnesu, żeby nim zamieszać', more: 'Dotknij płatków, żeby rozgnieść je drobniej', flask: 'Dotknij kolby, żeby wrzucić drobinki', fresh: 'Dotknij pudełka, żeby nasypać nową miskę', busy: 'Patrz na magnes' },
      buttons: { crush: 'Rozgnieć płatki', sweep: 'Zamieszaj magnesem', fresh: 'Nowa miska' },
      says: {
        crush: [
          { kid: 'Chrup! Płatki łamią się na kawałki.', sci: 'Połamane: więcej ziaren żelaza uwalnia się z płatków.' },
          { kid: 'Chrup, chrup! Teraz to okruchy.', sci: 'Okruchy: jeszcze więcej proszku jest wolne.' },
          { kid: 'Teraz to rozmoknięta papka. Malutkie ziarenka żelaza mogą się ruszać.', sci: 'Papka: prawie cały proszek żelaza może teraz dotrzeć do magnesu.' },
        ],
        mush: { kid: 'Bardziej papkowate już nie będzie! Zamieszaj magnesem.', sci: 'To już drobna papka: zamieszaj.' },
        sweep: { kid: 'Zobacz, jak czarne drobinki skaczą na magnes! To prawdziwe metaliczne żelazo: na razie {mg} mg.', sci: '{got} mg za tym razem, razem {mg} mg: ferromagnetyczne żelazo pierwiastkowe wyciągnięte z papki.' },
        little: { kid: 'Tylko kilka drobinek. Żelazo jest uwięzione w płatkach: najpierw je rozgnieć!', sci: 'Bardzo mało ({got} mg): proszek jest zamknięty w płatkach. Rozgnieć je na papkę.' },
        empty: { kid: 'Prawie nic już nie wychodzi. Dotknij pudełka, żeby nasypać nową miskę.', sci: 'Wolne żelazo prawie całe wyszło; reszta zostaje w okruchach.' },
        fresh: { kid: 'Nowa miska płatków!', sci: 'Nowa porcja: 30 g płatków z 4 mg dodanego żelaza.' },
      },
      panel: {
        kid: [
          'Do wielu płatków śniadaniowych dodaje się żelazo jako drobny proszek z prawdziwego metalicznego żelaza. Każde ziarenko jest cieńsze niż włos, więc nigdy go nie zauważysz.',
          'Magnes przyciąga żelazo. W całych płatkach ziarenka są uwięzione w środku, więc magnes łapie bardzo mało. Rozgnieć płatki, mieszaj powoli, a uwolnione ziarenka zbiorą się na magnesie jako czarne drobinki.',
          'Możesz spróbować w domu z dorosłym: rozgniecione płatki w wodzie, silny magnes w plastikowej torebce i długie, powolne mieszanie. Działa tylko wtedy, gdy płatki zawierają metaliczne żelazo: na etykiecie jest „żelazo” albo „żelazo redukowane”.',
        ],
        sci: [
          'Płatki i mąki często wzbogaca się proszkiem żelaza pierwiastkowego: żelazem redukowanym (tlenek żelaza zredukowany wodorem lub tlenkiem węgla), elektrolitycznym albo karbonylkowym (otrzymywanym z pentakarbonylku żelaza). Większość ziaren ma mniej niż 45 µm, żelazo karbonylkowe tylko kilka µm. Jako ferromagnetyczne dają się wyciągnąć magnesem; sole żelaza, takie jak siarczan czy fumaran żelaza(II), nie.',
          'Ile wyjdzie, zależy od tego, jak drobno rozgniecie się płatki i jak długo się miesza: mało z całych płatków, dużo więcej z papki. Liczby w tym pokoju to model: porcja 30 g z 4 mg dodanego żelaza. Płatki wzbogacane mają od około 2 mg do 18 mg na porcję: wiele europejskich kilka mg, niektóre amerykańskie 18 mg, całą amerykańską wartość dzienną.',
        ],
      },
    },
    flask: {
      label: 'Kolba żołądkowa',
      title: 'Kwas rozpuszcza żelazo',
      signs: { ph: 'pH {ph}', acid: 'jak kwas żołądkowy', weak: 'słaby kwas', water: 'jak zwykła woda', gone: 'Rozpuszczone żelazo {mg} mg' },
      slider: 'pH (niższe to kwaśniej)',
      hints: { none: 'Najpierw złap żelazo magnesem', drop: 'Dotknij kolby, żeby wrzucić drobinki', fizz: 'Dotknij lupy, żeby zobaczyć atomy', water: 'W wodzie nie musuje, obniż pH (naciśnij E)', done: 'Wszystko rozpuszczone, złap więcej magnesem', busy: 'Patrz, jak spadają drobinki' },
      buttons: { drop: 'Wrzuć drobinki', lens: 'Następny krok w lupie', stomach: 'Kwas żołądkowy (pH 2)', water: 'Zwykła woda (pH 7)' },
      says: {
        empty: { kid: 'Na magnesie nie ma jeszcze drobinek. Najpierw zamieszaj nim w płatkach.', sci: 'Na magnesie nie ma jeszcze żelaza.' },
        drop: { kid: 'Lejek zdrapuje drobinki, wpadają do kwasu i musuje! Bąbelki to wodór, a żelazo powoli znika w cieczy.', sci: 'Fe + 2 H⁺ → Fe²⁺ + H₂: wydziela się wodór, a żelazo przechodzi do roztworu jako Fe²⁺.' },
        water: { kid: 'W zwykłej wodzie nic się nie dzieje: nie jest dość kwaśna.', sci: 'pH {ph}: za mało jonów H⁺ i żelazo się nie rozpuszcza (w wodzie i powietrzu tylko by powoli rdzewiało).' },
        faster: { kid: 'Więcej kwasu: szybciej musuje!', sci: 'pH {ph}: [H⁺] = {h} mol/l, szybciej.' },
        slower: { kid: 'Mniej kwasu: musowanie zwalnia.', sci: 'pH {ph}: [H⁺] = {h} mol/l, wolniej.' },
        fizz: { kid: 'Musuje! Dotknij lupy, żeby zobaczyć, co robią atomy.', sci: 'Wciąż się rozpuszcza: na powierzchni żelaza wydziela się wodór.' },
        done: { kid: 'Wszystkie drobinki zniknęły. Żelazo nadal tam jest, jako niewidoczne jony żelaza w cieczy, gotowe do wchłonięcia.', sci: 'Wszystko rozpuszczone: żelazo to Fe²⁺ w roztworze, postać, którą wchłania jelito.' },
      },
      lens: [
        { kid: 'Na powierzchni jest nowy atom żelaza. Dotknij lupy jeszcze raz, żeby popatrzeć.', sci: 'Następny atom na powierzchni: dotknij, żeby obejrzeć jeszcze raz.' },
        { kid: 'Dwa H+ zbliżają się do atomu żelaza. H+ to atom wodoru bez swojego elektronu, a kwas jest ich pełen.', sci: 'Dwa jony H⁺ (H₃O⁺ w wodzie) spotykają atom żelaza na powierzchni metalu.' },
        { kid: 'Atom żelaza oddaje dwa elektrony, po jednym każdemu H+.', sci: 'Fe → Fe²⁺ + 2 e⁻ (utlenianie); 2 H⁺ + 2 e⁻ → 2 H (redukcja).' },
        { kid: 'Dwa wodory łączą się w H2 i odpływają w bąbelku. Atom żelaza, teraz Fe2+, odpływa do cieczy: rozpuścił się!', sci: 'Dwa atomy H łączą się w H₂, bąbelek; Fe²⁺ opuszcza metal i przechodzi do roztworu, otoczony cząsteczkami wody.' },
      ],
      panel: {
        kid: [
          'Twój żołądek wytwarza kwas, tak mocny, że metaliczne żelazo znika w nim z musowaniem. Gdy żelazo spotyka kwas, każdy atom żelaza oddaje dwa elektrony i odpływa do cieczy jako jon żelaza. Bąbelki to wodór.',
          'Przesuń pH: pH 7 to zwykła woda i nic się nie dzieje. Im niższe pH, tym mocniejszy kwas i tym szybciej musuje. Żołądek ma pH około 1,5 do 3,5. Ta kolba działa dużo szybciej niż prawdziwy żołądek.',
        ],
        sci: [
          'Sok żołądkowy (kwas solny, pH około 1,5 do 3,5) rozpuszcza żelazo pierwiastkowe: Fe + 2 H⁺ → Fe²⁺ + H₂. Żelazo się utlenia, tracąc dwa elektrony; jony wodorowe się redukują i uchodzą jako gaz. Roztwory Fe²⁺ są bladozielone; kolor w kolbie jest wzmocniony, żeby było go widać.',
          'pH = −log₁₀[H⁺]: każdy stopień w dół to dziesięć razy więcej kwasu, a przy pH 7 reakcja prawie staje. Drobniejszy proszek ma większą powierzchnię i rozpuszcza się szybciej, to jeden z powodów, dla których najdrobniejsze proszki wchłaniają się najlepiej. Mniej kwasu w żołądku (na przykład po lekach zobojętniających) oznacza, że wchłania się mniej takiego żelaza. Kolba działa dużo szybciej niż prawdziwy żołądek.',
        ],
      },
    },
    gate: {
      label: 'Brama jelita',
      title: 'Ile żelaza wchodzi?',
      foods: { steak: { name: 'Stek' }, egg: { name: 'Jajko' }, bread: { name: 'Chleb razowy' }, cereal: { name: 'Miska płatków' }, lentils: { name: 'Soczewica' }, spinach: { name: 'Szpinak' } },
      kinds: {
        meat: { kid: 'część to żelazo hemowe, łatwy rodzaj', sci: 'część to żelazo hemowe' },
        plant: { kid: 'rodzaj, który trudniej wchłonąć', sci: 'żelazo niehemowe' },
      },
      signs: { wall: 'Ściana twojego jelita', letIn: 'Wpuszczone {mg} mg', loop: 'Użyte znowu', loopSub: '20 do 25 mg dziennie', red: 'stare krwinki', cleaner: 'komórki sprzątające', with: 'do posiłku', oj: 'Sok pomarańczowy', tea: 'Herbata' },
      board: {
        title: 'Dzisiaj',
        eaten: 'Zjedzone',
        letIn: 'Wpuszczone',
        used: 'Znowu',
        usedValue: '20 do 25 mg dziennie',
        need: { kid: '{mg} mg, dzienna potrzeba', sci: 'RDA {mg} mg (9 do 13 lat)' },
        needIn: { kid: 'wystarczy 1 do 2 mg', sci: 'wchłaniane 1 do 2 mg dziennie' },
      },
      hints: { food: 'Dotknij jedzenia, żeby położyć je na talerzu', eat: 'Dotknij talerza, żeby zjeść', again: 'Dotknij więcej jedzenia, soku albo herbaty', busy: 'Patrz na żelazo' },
      buttons: { eat: 'Zjedz wszystko', oj: 'Z sokiem pomarańczowym', ojOff: 'Bez soku pomarańczowego', tea: 'Z herbatą', teaOff: 'Bez herbaty', day: 'Nowy dzień', add: 'Na talerz: {food}', remove: 'Z talerza: {food}' },
      says: {
        add: { kid: 'Na talerzu: {food}, {mg} mg żelaza, {kind}.', sci: '{food}: {mg} mg żelaza, {kind}.' },
        remove: { kid: 'Z powrotem na stole: {food}.', sci: 'Zdjęte z talerza: {food}.' },
        eat: { kid: 'Pycha! Zjedzone {eaten} mg żelaza, ale brama wpuściła tylko {in} mg.', sci: 'Zjedzone {eaten} mg, wchłonięte {in} mg ({pct}%).' },
        oj: { kid: 'Szklanka soku pomarańczowego do posiłku: witamina C pomaga żelazu z roślin przejść przez bramę.', sci: 'Kwas askorbinowy w posiłku utrzymuje żelazo niehemowe w rozpuszczalnej postaci Fe²⁺: wchłania się go dwa do trzech razy więcej.' },
        ojOff: { kid: 'Tym razem bez soku.', sci: 'Bez kwasu askorbinowego.' },
        tea: { kid: 'Filiżanka herbaty do posiłku: herbata zatrzymuje żelazo z roślin.', sci: 'Herbata do posiłku: jej polifenole wiążą żelazo niehemowe, a wchłanianie spada o ponad połowę.' },
        teaOff: { kid: 'Tym razem bez herbaty.', sci: 'Bez herbaty.' },
        empty: { kid: 'Talerz jest pusty. Najpierw dotknij jakiegoś jedzenia!', sci: 'Na talerzu nic nie ma.' },
        day: { kid: 'Nowy dzień: paski zaczynają od nowa.', sci: 'Nowy dzień: liczenie od nowa.' },
        loop: { kid: 'Twoje ciało oszczędza żelazo! Każdego dnia odzyskuje około 20 do 25 mg ze starych czerwonych krwinek i używa go znowu, dużo więcej niż 1 do 2 mg, które wpuszcza.', sci: 'Makrofagi odzyskują około 20 do 25 mg żelaza dziennie z czerwonych krwinek pod koniec ich życia, trwającego około 120 dni, wobec 1 do 2 mg wchłanianych. Ciało nie ma czynnego sposobu wydalania żelaza: około 1 mg dziennie traci się ze złuszczonymi komórkami i drobnymi krwawieniami.' },
      },
      panel: {
        kid: [
          'Ściana twojego jelita to brama, przez którą żelazo wchodzi do ciała, i wpuszcza tylko trochę. Dziecko w wieku od 9 do 13 lat powinno zjadać około 8 mg żelaza dziennie, a wchodzi tylko około 1 do 2 mg.',
          'Żelazo z mięsa i ryb, zwane żelazem hemowym, przechodzi najlepiej. Żelazo z roślin i to dodawane do płatków przechodzą gorzej: sok pomarańczowy im pomaga, herbata je zatrzymuje. Twoje ciało używa swojego żelaza wciąż od nowa, więc trochę każdego dnia wystarczy.',
        ],
        sci: [
          'Żelazo wchłania się głównie w dwunastnicy. Żelazo niehemowe jest redukowane do Fe²⁺ (witamina C pomaga) i przenoszone do komórek nabłonka przez transporter DMT1; hem wchodzi w całości. Typowe udziały: hemowe około 15 do 35%, niehemowe około 2 do 20%, zależnie od posiłku i zapasów organizmu. W tym pokoju 25% i 8%, razy 2,5 z sokiem pomarańczowym i razy 0,4 z herbatą; szpinak, jajko i chleb razowy zatrzymują część swojego (szczawiany, fosfityna, fityniany).',
          'Ciało nie umie wydalać żelaza, więc pilnuje tego, co wchodzi: gdy zapasy są pełne, hormon wątroby hepcydyna zamyka ferroportynę, wyjście z komórek jelita. Wchłania się około 1 do 2 mg dziennie, tyle, ile się traci; makrofagi odzyskują 20 do 25 mg dziennie. Amerykańskie zalecenie dla wieku od 9 do 13 lat to 8 mg dziennie (EFSA zaleca 11 mg dla wieku od 7 do 11 lat).',
          'Porcje: stek 100 g (2,5 mg, przyjęte 40% żelaza hemowego, częsta średnia dla mięsa), jedno jajko (0,9 mg), kromka chleba razowego (0,8 mg), miska płatków (4 mg), soczewica i szpinak 100 g po ugotowaniu (3,3 i 3,6 mg). Wartości USDA, zaokrąglone.',
        ],
      },
    },
  },
  de: {
    title: 'Der Frühstückstisch',
    greet: {
      kid: 'Wir sind im Bild, und wir sind so klein wie eine Maus! Die Schüssel ist ein Teich, die Cornflakes-Packung ein Turm. Manche Frühstücksflocken enthalten echtes metallisches Eisen: Fangen wir es mit dem Magneten! Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Ein Frühstückstisch in zwanzigfacher Größe: eine Schüssel mit eisenangereicherten Flocken, ein Magnet an einem Löffel auf einer Pfeffermühle, ein Kolben mit nachgemachter Magensäure und ein Teller mit eisenhaltigen Lebensmitteln. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Der ganze Körper eines Erwachsenen enthält nur etwa 4 Gramm Eisen, ungefähr so viel wie ein Nagel. Das meiste ist im Blut, und es macht das Blut rot.',
        'Das Eisen in Frühstücksflocken ist ein so feines Pulver, dass du es nie auf der Zunge spüren würdest. Dein Magen macht daraus Eisen, das dein Körper nutzen kann.',
        'Viele glauben, Spinat steckt voller Eisen. Er hat etwas, ungefähr so viel wie Linsen, aber das meiste behält er für sich.',
      ],
      sci: [
        'Ein Erwachsener hat etwa 3 bis 4 g Eisen, rund zwei Drittel davon im Hämoglobin; ein großer Teil des Rests ist als Ferritin gespeichert, vor allem in der Leber.',
        'Elementare Eisenpulver sind billig und haltbar und verändern, anders als lösliche Eisensalze, Farbe und Geschmack der Flocken kaum. Der Preis: Sie werden schlechter aufgenommen als Eisen(II)-sulfat.',
        'Gekochter Spinat hat etwa 3,6 mg Eisen pro 100 g, nah an den 3,3 mg gekochter Linsen, aber nur ein kleiner Teil wird aufgenommen: Oxalat und Polyphenole im Blatt binden es.',
      ],
    },
    bowl: {
      label: 'Der Magnet und die Schüssel',
      title: 'Zieh das Eisen aus den Flocken',
      box: { name: 'FLOCKEN', sub: 'mit zugesetztem Eisen', facts: 'In einer Schüssel', iron: 'Eisen', rows: [['Flocken', '30 g']] },
      signs: { caught: 'Herausgezogenes Eisen', of: '{mg} mg von {total} mg' },
      hints: { crush: 'Tippe auf die Flocken, um sie zu zerdrücken', sweep: 'Tippe auf den Magneten, um damit zu rühren', more: 'Tippe auf die Flocken, um sie feiner zu zerdrücken', flask: 'Tippe auf den Kolben, um die Krümel hineinfallen zu lassen', fresh: 'Tippe auf die Packung für eine frische Schüssel', busy: 'Schau auf den Magneten' },
      buttons: { crush: 'Flocken zerdrücken', sweep: 'Mit dem Magneten rühren', fresh: 'Eine frische Schüssel' },
      says: {
        crush: [
          { kid: 'Knack! Die Flocken brechen in Stücke.', sci: 'Zerbrochen: Mehr Eisenkörner kommen aus den Flocken frei.' },
          { kid: 'Knack, knack! Jetzt sind es Krümel.', sci: 'Krümel: Noch mehr Pulver ist frei.' },
          { kid: 'Jetzt ist es ein matschiger Brei. Die winzigen Eisenkörnchen können sich bewegen.', sci: 'Ein Brei: Fast das ganze Eisenpulver erreicht jetzt den Magneten.' },
        ],
        mush: { kid: 'Matschiger geht es nicht! Rühr mit dem Magneten.', sci: 'Schon ein feiner Brei: rühren.' },
        sweep: { kid: 'Schau, wie die schwarzen Krümel auf den Magneten springen! Das ist echtes metallisches Eisen: bis jetzt {mg} mg.', sci: '{got} mg bei diesem Rühren, {mg} mg insgesamt: ferromagnetisches elementares Eisen, aus dem Brei gezogen.' },
        little: { kid: 'Nur ein paar Krümel. Das Eisen steckt in den Flocken fest: zerdrück sie zuerst!', sci: 'Sehr wenig ({got} mg): Das Pulver ist in den Flocken eingeschlossen. Zerdrück sie zu einem Brei.' },
        empty: { kid: 'Fast nichts kommt mehr heraus. Tippe auf die Packung für eine frische Schüssel.', sci: 'Das freie Eisen ist fast ganz heraus; der Rest bleibt in den Krümeln.' },
        fresh: { kid: 'Eine frische Schüssel Flocken!', sci: 'Eine frische Portion: 30 g Flocken mit 4 mg zugesetztem Eisen.' },
      },
      panel: {
        kid: [
          'Vielen Frühstücksflocken wird Eisen zugesetzt, als feines Pulver aus echtem metallischem Eisen. Jedes Körnchen ist dünner als ein Haar, deshalb merkst du nie etwas davon.',
          'Ein Magnet zieht Eisen an. In ganzen Flocken stecken die Körnchen fest, deshalb fängt der Magnet sehr wenig. Zerdrück die Flocken, rühr langsam, und die freien Körnchen sammeln sich als schwarze Krümel am Magneten.',
          'Du kannst es zu Hause mit einem Erwachsenen ausprobieren: zerdrückte Flocken in Wasser, ein starker Magnet in einer Plastiktüte und viel langsames Rühren. Es klappt nur, wenn die Flocken metallisches Eisen enthalten: Auf dem Etikett steht „Eisen“ oder „reduziertes Eisen“.',
        ],
        sci: [
          'Flocken und Mehle werden oft mit elementarem Eisenpulver angereichert: reduziertem Eisen (Eisenoxid, mit Wasserstoff oder Kohlenmonoxid reduziert), elektrolytischem Eisen oder Carbonyleisen (aus Eisenpentacarbonyl). Die meisten Körner sind kleiner als 45 µm, Carbonyleisen nur wenige µm. Weil sie ferromagnetisch sind, lassen sie sich mit einem Magneten herausziehen; Eisensalze wie Eisen(II)-sulfat oder -fumarat nicht.',
          'Wie viel herauskommt, hängt davon ab, wie fein die Flocken zerkleinert und wie lange gerührt wird: wenig aus ganzen Flocken, viel mehr aus einem Brei. Die Zahlen hier sind ein Modell: eine Portion von 30 g mit 4 mg zugesetztem Eisen. Angereicherte Flocken enthalten etwa 2 mg bis 18 mg pro Portion: viele europäische einige mg, manche amerikanische 18 mg, den ganzen US-Tageswert.',
        ],
      },
    },
    flask: {
      label: 'Der Magenkolben',
      title: 'Säure löst das Eisen',
      signs: { ph: 'pH {ph}', acid: 'wie Magensäure', weak: 'eine schwache Säure', water: 'wie reines Wasser', gone: 'Gelöstes Eisen {mg} mg' },
      slider: 'pH (niedriger ist saurer)',
      hints: { none: 'Fang zuerst Eisen mit dem Magneten', drop: 'Tippe auf den Kolben, um die Krümel hineinfallen zu lassen', fizz: 'Tippe auf die Lupe, um die Atome zu sehen', water: 'In Wasser sprudelt nichts, senk den pH (drück E)', done: 'Alles gelöst, fang mehr mit dem Magneten', busy: 'Schau, wie die Krümel fallen' },
      buttons: { drop: 'Krümel hineinfallen lassen', lens: 'Nächster Schritt in der Lupe', stomach: 'Magensäure (pH 2)', water: 'Reines Wasser (pH 7)' },
      says: {
        empty: { kid: 'Am Magneten sind noch keine Krümel. Rühr zuerst mit ihm in den Flocken.', sci: 'Noch kein Eisen am Magneten.' },
        drop: { kid: 'Der Trichter kratzt die Krümel ab, sie fallen in die Säure, und es sprudelt! Die Bläschen sind Wasserstoff, und das Eisen verschwindet langsam in der Flüssigkeit.', sci: 'Fe + 2 H⁺ → Fe²⁺ + H₂: Wasserstoff perlt ab, und das Eisen geht als Fe²⁺ in Lösung.' },
        water: { kid: 'In reinem Wasser passiert nichts: Es ist nicht sauer genug.', sci: 'pH {ph}: zu wenige H⁺-Ionen, und das Eisen löst sich nicht (in Wasser und Luft würde es nur langsam rosten).' },
        faster: { kid: 'Mehr Säure: Es sprudelt schneller!', sci: 'pH {ph}: [H⁺] = {h} mol/l, schneller.' },
        slower: { kid: 'Weniger Säure: Das Sprudeln wird langsamer.', sci: 'pH {ph}: [H⁺] = {h} mol/l, langsamer.' },
        fizz: { kid: 'Es sprudelt! Tippe auf die Lupe, um zu sehen, was die Atome tun.', sci: 'Löst sich noch: An der Eisenoberfläche entsteht Wasserstoff.' },
        done: { kid: 'Alle Krümel sind weg. Das Eisen ist noch da, als unsichtbare Eisen-Ionen in der Flüssigkeit, bereit zur Aufnahme.', sci: 'Alles gelöst: Das Eisen ist Fe²⁺ in Lösung, die Form, die der Darm aufnimmt.' },
      },
      lens: [
        { kid: 'Ein neues Eisenatom sitzt an der Oberfläche. Tippe noch einmal auf die Lupe, um zuzuschauen.', sci: 'Das nächste Atom an der Oberfläche: tippen, um es noch einmal zu sehen.' },
        { kid: 'Zwei H+ kommen nah an ein Eisenatom. Ein H+ ist ein Wasserstoffatom ohne sein Elektron, und Säure ist voll davon.', sci: 'Zwei H⁺-Ionen (H₃O⁺ in Wasser) treffen an der Metalloberfläche auf ein Eisenatom.' },
        { kid: 'Das Eisenatom gibt zwei Elektronen ab, eins an jedes H+.', sci: 'Fe → Fe²⁺ + 2 e⁻ (Oxidation); 2 H⁺ + 2 e⁻ → 2 H (Reduktion).' },
        { kid: 'Die zwei Wasserstoffe verbinden sich zu H2 und blubbern davon. Das Eisenatom, jetzt Fe2+, schwimmt in die Flüssigkeit: gelöst!', sci: 'Die zwei H-Atome verbinden sich zu H₂, einem Bläschen; Fe²⁺ verlässt das Metall und geht in Lösung, umgeben von Wassermolekülen.' },
      ],
      panel: {
        kid: [
          'Dein Magen macht Säure, stark genug, um metallisches Eisen wegzusprudeln. Wenn Eisen auf Säure trifft, gibt jedes Eisenatom zwei Elektronen ab und schwimmt als Eisen-Ion in die Flüssigkeit. Die Bläschen sind Wasserstoff.',
          'Schieb den pH-Wert: pH 7 ist reines Wasser, und nichts passiert. Je niedriger der pH, desto stärker die Säure und desto schneller sprudelt es. Ein Magen hat etwa pH 1,5 bis 3,5. Der Kolben hier ist viel schneller als ein echter Magen.',
        ],
        sci: [
          'Magensaft (Salzsäure, pH etwa 1,5 bis 3,5) löst elementares Eisen: Fe + 2 H⁺ → Fe²⁺ + H₂. Das Eisen wird oxidiert und verliert zwei Elektronen; die Wasserstoff-Ionen werden reduziert und entweichen als Gas. Fe²⁺-Lösungen sind blassgrün; die Farbe im Kolben ist verstärkt, damit man sie sieht.',
          'pH = −log₁₀[H⁺]: Jede Stufe nach unten ist zehnmal saurer, und bei pH 7 kommt die Reaktion fast zum Stillstand. Ein feineres Pulver hat mehr Oberfläche und löst sich schneller, ein Grund, warum die feinsten Pulver am besten aufgenommen werden. Weniger Magensäure (zum Beispiel mit säurebindenden Mitteln) heißt, dass weniger von solchem Eisen aufgenommen wird. Der Kolben läuft viel schneller als ein echter Magen.',
        ],
      },
    },
    gate: {
      label: 'Das Tor des Darms',
      title: 'Wie viel Eisen kommt hinein?',
      foods: { steak: { name: 'Steak' }, egg: { name: 'Ei' }, bread: { name: 'Vollkornbrot' }, cereal: { name: 'Schüssel Flocken' }, lentils: { name: 'Linsen' }, spinach: { name: 'Spinat' } },
      kinds: {
        meat: { kid: 'ein Teil davon Häm-Eisen, die leichte Sorte', sci: 'ein Teil davon Häm-Eisen' },
        plant: { kid: 'die Sorte, die schwerer hineinkommt', sci: 'Nicht-Häm-Eisen' },
      },
      signs: { wall: 'Die Wand deines Darms', letIn: 'Hereingelassen {mg} mg', loop: 'Wiederverwendet', loopSub: '20 bis 25 mg am Tag', red: 'alte rote Blutkörperchen', cleaner: 'Aufräumzellen', with: 'zum Essen', oj: 'Orangensaft', tea: 'Tee' },
      board: {
        title: 'Heute',
        eaten: 'Gegessen',
        letIn: 'Herein',
        used: 'Wieder',
        usedValue: '20 bis 25 mg am Tag',
        need: { kid: '{mg} mg, der Tagesbedarf', sci: 'RDA {mg} mg (9 bis 13 Jahre)' },
        needIn: { kid: '1 bis 2 mg reichen', sci: 'aufgenommen 1 bis 2 mg am Tag' },
      },
      hints: { food: 'Tippe auf Essen, um es auf den Teller zu legen', eat: 'Tippe auf den Teller, um zu essen', again: 'Tippe auf mehr Essen, den Saft oder den Tee', busy: 'Schau auf das Eisen' },
      buttons: { eat: 'Alles essen', oj: 'Mit Orangensaft', ojOff: 'Ohne Orangensaft', tea: 'Mit Tee', teaOff: 'Ohne Tee', day: 'Ein neuer Tag', add: 'Auf den Teller: {food}', remove: 'Vom Teller: {food}' },
      says: {
        add: { kid: 'Auf dem Teller: {food}, {mg} mg Eisen, {kind}.', sci: '{food}: {mg} mg Eisen, {kind}.' },
        remove: { kid: 'Zurück auf den Tisch: {food}.', sci: 'Vom Teller genommen: {food}.' },
        eat: { kid: 'Lecker! {eaten} mg Eisen gegessen, aber das Tor hat nur {in} mg hereingelassen.', sci: '{eaten} mg gegessen, {in} mg aufgenommen ({pct} %).' },
        oj: { kid: 'Ein Glas Orangensaft zum Essen: Sein Vitamin C hilft dem Pflanzeneisen durchs Tor.', sci: 'Ascorbinsäure zur Mahlzeit hält Nicht-Häm-Eisen als lösliches Fe²⁺: Es wird zwei- bis dreimal so viel aufgenommen.' },
        ojOff: { kid: 'Diesmal kein Saft.', sci: 'Keine Ascorbinsäure.' },
        tea: { kid: 'Eine Tasse Tee zum Essen: Tee hält das Pflanzeneisen zurück.', sci: 'Tee zur Mahlzeit: Seine Polyphenole binden Nicht-Häm-Eisen, und die Aufnahme sinkt um mehr als die Hälfte.' },
        teaOff: { kid: 'Diesmal kein Tee.', sci: 'Kein Tee.' },
        empty: { kid: 'Der Teller ist leer. Tippe zuerst auf etwas zu essen!', sci: 'Nichts auf dem Teller.' },
        day: { kid: 'Ein neuer Tag: Die Balken fangen von vorn an.', sci: 'Ein neuer Tag: Die Zählung beginnt neu.' },
        loop: { kid: 'Dein Körper hebt sein Eisen auf! Jeden Tag holt er sich etwa 20 bis 25 mg aus alten roten Blutkörperchen zurück und benutzt es wieder, viel mehr als die 1 bis 2 mg, die er hereinlässt.', sci: 'Makrophagen gewinnen täglich etwa 20 bis 25 mg Eisen aus roten Blutkörperchen am Ende ihres etwa 120 Tage langen Lebens zurück, gegenüber 1 bis 2 mg, die aufgenommen werden. Der Körper kann Eisen nicht aktiv ausscheiden: Etwa 1 mg am Tag geht mit abgestoßenen Zellen und kleinen Blutungen verloren.' },
      },
      panel: {
        kid: [
          'Die Wand deines Darms ist das Tor, durch das Eisen in deinen Körper kommt, und sie lässt nur wenig herein. Ein Kind von 9 bis 13 Jahren sollte etwa 8 mg Eisen am Tag essen, aber nur etwa 1 bis 2 mg davon kommen hinein.',
          'Eisen aus Fleisch und Fisch, Häm-Eisen genannt, kommt am besten durch. Eisen aus Pflanzen und das Eisen, das Flocken zugesetzt wird, kommen schlechter durch: Orangensaft hilft ihnen, Tee hält sie zurück. Dein Körper benutzt sein Eisen immer wieder, deshalb reicht jeden Tag ein bisschen.',
        ],
        sci: [
          'Eisen wird vor allem im Zwölffingerdarm aufgenommen. Nicht-Häm-Eisen wird zu Fe²⁺ reduziert (Vitamin C hilft) und vom Transporter DMT1 in die Zellen der Darmwand gebracht; Häm wird als Ganzes aufgenommen. Typische Anteile: Häm etwa 15 bis 35 %, Nicht-Häm etwa 2 bis 20 %, je nach Mahlzeit und Eisenspeichern. Hier gelten 25 % und 8 %, mal 2,5 mit Orangensaft und mal 0,4 mit Tee; Spinat, Ei und Vollkornbrot halten einen Teil ihres Eisens zurück (Oxalat, Phosvitin, Phytat).',
          'Der Körper kann Eisen nicht ausscheiden, also regelt er, was hereinkommt: Sind die Speicher voll, schließt das Leberhormon Hepcidin das Ferroportin, den Ausgang aus den Darmzellen. Etwa 1 bis 2 mg am Tag werden aufgenommen, so viel wie verloren geht; Makrophagen gewinnen 20 bis 25 mg am Tag zurück. Die US-Empfehlung für 9 bis 13 Jahre ist 8 mg am Tag (die EFSA rät zu 11 mg für 7 bis 11 Jahre).',
          'Portionen: Steak 100 g (2,5 mg, gerechnet mit 40 % Häm-Eisen, einem üblichen Mittelwert für Fleisch), ein Ei (0,9 mg), eine Scheibe Vollkornbrot (0,8 mg), die Schüssel Flocken (4 mg), Linsen und Spinat 100 g gekocht (3,3 und 3,6 mg). USDA-Werte, gerundet.',
        ],
      },
    },
  },
}
