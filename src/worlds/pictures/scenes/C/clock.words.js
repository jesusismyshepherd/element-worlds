// The words of carbon's dig room ("A clock inside every bone"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/C.js (the
// easel shows it); the room shows carbon-14 being made, taken up, dug up and counted.
// Sources: carbon-14 production 9 to 15 km up and about 1.6 to 1.9 atoms per cm2 per second (Wikipedia,
// "Carbon-14", and the models it cites); Arnold and Libby, Science 110 (1949), wood from the tombs of Djoser
// and Sneferu; AMS radiocarbon from 1977 on milligram samples (Gove); IntCal20 (Reimer et al. 2020): tree
// rings to 13 910 cal BP, the curve to 55 000; Godwin (1962), 5730 +- 40 years; NUBASE2020, 5700 +- 30;
// Otzi about 3300 BC (Kutschera; Bonani et al.). The four finds and their ages are invented examples, and
// their ages use 5730 years without calibration, as the panels say.
// Functions take counts (the hourglass's atoms): numbers stand after a colon where a language would
// otherwise need its verb to agree with them.

export const CLOCK_WORDS = {
  en: {
    title: 'The dig at sunset',
    greet: {
      kid: "We are inside the picture: an archaeologists' dig at sunset! Here carbon-14 is the clock that tells how old the finds are. The picture's story is on the easel beside you.",
      sci: "An excavation at golden hour, with a radiocarbon lab in the tent: carbon-14 made in the air above us, taken up by everything alive, and counted in what comes out of the ground. The picture's story is on the easel.",
    },
    talk: {
      kid: [
        'Right now more than a thousand carbon-14 atoms in your body are turning into nitrogen every second! You never feel it, and new ones come in with your food.',
        'Ötzi the Iceman, found frozen in the Alps in 1991, was dated with carbon-14: he lived about 5300 years ago.',
        'Archaeologists dig slowly, with small trowels and brushes, and write down exactly where each find lay. The deeper the layer, the older it usually is.',
      ],
      sci: [
        'Living carbon decays at about 0.23 becquerel per gram, some 14 decays a minute. A 70 kg adult, 18% carbon, carries about 3 kBq of carbon-14.',
        'Nuclear weapons tests nearly doubled the ¹⁴C in the northern air by 1963. That bomb peak has been falling ever since, and it dates recent tissue and wood almost to the year.',
        'Ötzi, found in 1991, was dated by AMS at several laboratories: milligrams of his bone and tissue place him around 3300 BC, some 5300 years ago.',
      ],
    },
    sky: {
      label: 'Made in the sky',
      title: 'Carbon-14 is made in the sky',
      sign: 'Made in the sky',
      hints: { tap: 'Tap the sky for a cosmic ray', watch: 'Watch the carbon-14 come down', again: 'Tap the sky for another cosmic ray' },
      button: 'Send a cosmic ray',
      labels: { ray: 'cosmic ray', neutron: 'neutron', n14: 'nitrogen-14', c14: 'carbon-14', proton: 'proton', co2: 'carbon dioxide' },
      says: {
        ray: { kid: 'A cosmic ray! A speck of an atom from deep space crashes into the air high above us and knocks a neutron loose.', sci: 'A cosmic-ray proton shatters a nucleus in the upper air; the spallation sets neutrons free, which slow down in collisions with air molecules.' },
        made: { kid: 'The neutron hits a nitrogen atom. Nitrogen-14 lets go of a proton and becomes carbon-14!', sci: 'Neutron capture by nitrogen: n + ¹⁴N → ¹⁴C + p. Seven protons become six: nitrogen turns into carbon.' },
        co2: { kid: 'The new carbon-14 grabs two oxygen atoms and becomes carbon dioxide, like the rest of the carbon in the air. Down it drifts.', sci: '¹⁴C is oxidised, first to ¹⁴CO, then to ¹⁴CO₂, and mixes through the atmosphere within a few years.' },
        tree: { kid: 'The oak takes it in through a leaf and builds it into itself, just like ordinary carbon.', sci: "Photosynthesis fixes ¹⁴CO₂ like any CO₂: the leaves carry the air's ratio, about 1.2 atoms of ¹⁴C per trillion carbon atoms." },
        deer: { kid: 'And the deer eats the leaves! Now that carbon-14 is part of the deer. While it lives it keeps eating, so it always has the same tiny share as the air.', sci: "Through the food chain every living thing keeps the atmosphere's share of ¹⁴C. At death the intake stops and the clock starts: half the ¹⁴C is gone every 5730 years." },
      },
      panel: {
        kid: [
          "Cosmic rays are specks of atoms flying in from space, faster than anything on Earth. When one crashes into the air high above us, about as high as airliners fly and higher, it knocks neutrons out of the air's atoms. A neutron that hits a nitrogen atom turns it into carbon-14.",
          'Carbon-14 joins oxygen to make carbon dioxide, just like ordinary carbon. Plants take it in, animals eat the plants, and we eat both. So everything alive has a tiny share of carbon-14: about 1.2 atoms in every trillion carbon atoms. If every carbon atom were a grain of sand a millimetre across, a heap as big as a house would hold only about one grain of carbon-14.',
        ],
        sci: [
          "Primary cosmic rays, mostly protons, shatter nuclei of the upper atmosphere and set neutrons free; slowed by collisions, the neutrons are captured by nitrogen: n + ¹⁴N → ¹⁴C + p. Production is greatest about 9 to 15 km up and at high geomagnetic latitudes: models give about 1.6 to 1.9 atoms per square centimetre of the Earth's surface every second.",
          "¹⁴C oxidises to ¹⁴CO₂ and mixes through the atmosphere and the oceans; photosynthesis and food chains give every living thing the air's ratio, ¹⁴C/¹²C ≈ 1.2 × 10⁻¹². The cosmic-ray flux changes with the Sun's activity and the Earth's magnetic field, so that ratio has not always been the same: hence calibration (see the lab).",
        ],
      },
    },
    dig: {
      label: 'The trench',
      title: 'Digging down through time',
      finds: {
        linen: { name: 'A scrap of linen', short: 'linen' },
        bowl: { name: 'A wooden bowl', short: 'bowl' },
        bone: { name: "A deer's bone", short: 'bone' },
        hearth: { name: 'Charcoal from a hearth', short: 'charcoal' },
      },
      hints: { tap: 'Tap a find to dig it up', lab: 'Now date it in the tent', more: 'Tap another find to dig it up', done: 'All dug up, tap the shovel for a new dig' },
      buttons: { linen: 'Dig up the linen', bowl: 'Dig up the bowl', bone: 'Dig up the bone', hearth: 'Dig up the charcoal', again: 'A new dig' },
      says: {
        linen: { kid: 'A scrap of linen cloth, woven from flax. The flax plants took in carbon-14 from the air while they grew. Off it goes to the lab in the tent!', sci: 'Linen: cellulose from flax. A textile dates the season its plants were harvested; a few milligrams are enough for AMS. To the lab.' },
        bowl: { kid: 'A wooden bowl, carved long ago. Its wood still holds the carbon-14 the tree took in. Off to the lab!', sci: 'Carved wood dates the growth of its rings, not the carving: the heartwood of an old tree can be centuries older than the bowl (the old-wood problem). To the lab.' },
        bone: { kid: "A deer's bone! That deer got its carbon-14 from the leaves it ate, like the deer under the oak. Off to the lab!", sci: "Bone is dated on its collagen, extracted and purified; its carbon came from the deer's food, so from the air of its lifetime. To the lab." },
        hearth: { kid: 'Charcoal from a campfire, deepest of all, so probably the oldest. Charcoal is nearly pure carbon: perfect for the clock. Off to the lab!', sci: 'Charcoal: nearly pure carbon and chemically tough, the commonest radiocarbon sample. An acid, base, acid wash removes carbonates and humic acids, which would bring in younger carbon. To the lab.' },
        again: { kid: 'A new dig! The finds are back in their layers, waiting.', sci: 'Reset: every find back in its layer.' },
      },
      panel: {
        kid: [
          'Archaeologists dig slowly, layer by layer, with small trowels and brushes. Each layer of earth was laid down on top of the one before, so the deeper you dig, the further back in time you go.',
          'These four finds are examples made up for this dig, but they are the kinds of things that are dated every day: cloth, wood, bone and charcoal. Each was once part of something alive, so each has a carbon-14 clock inside. Tap one to dig it up; it goes to the lab in the tent.',
        ],
        sci: [
          "Stratigraphy: in undisturbed deposits each layer is younger than the one beneath it (Nicolas Steno's law of superposition, 1669). Excavators record the layer and position of every find, then date samples from the layers to turn the sequence into years.",
          'The four finds here are invented examples of the usual materials: textile, wood, bone collagen and charcoal. Anything that took its carbon from the air while it lived can be dated. Shells and lake fish need care: their carbon came from water that can hold older carbon (the reservoir effect).',
        ],
      },
    },
    lab: {
      label: 'The dating lab',
      title: 'Counting carbon-14',
      sign: 'Dating lab',
      hints: { date: 'Tap the machine to count the carbon-14', counting: 'Counting the atoms', none: 'Dig up a find in the trench first', rings: 'Tap the tree slice to see why', done: 'Read the clock on the board' },
      buttons: { date: 'Count its carbon-14', rings: 'The tree rings' },
      screen: {
        title: 'Carbon-14 counter',
        ready: 'Put in a find',
        counting: 'Counting...',
        left: { kid: '{pct}% of its carbon-14 left', sci: '{pct}% of modern C-14' },
        years: { kid: 'about {age} years old', sci: '{age} ± {err} years' },
      },
      board: { title: 'The carbon-14 clock', left: 'carbon-14 left', years: 'years', alive: 'alive', half: 'half-life' },
      says: {
        counting: { kid: 'In goes a tiny piece! The machine turns it into a beam and counts the carbon-14 atoms one by one.', sci: 'AMS: the sample, burnt and turned into graphite, is sputtered into a beam of negative ions; the accelerator strips them, breaking up molecules of the same mass, and magnets sort ¹⁴C from ¹²C and ¹³C to be counted atom by atom.' },
        linen: { kid: 'Three quarters of its carbon-14 is left: about 2380 years old. People of the Iron Age wove this cloth.', sci: '75.0% of modern ¹⁴C: 8267 · ln(1/0.75) = 2380 ± 25 years, with t½ = 5730 years (not calibrated).' },
        bowl: { kid: 'Half is left: one half-life, so about 5730 years old! It was carved in the time of the early farmers.', sci: '50.0% of modern: one half-life, 5730 ± 30 years.' },
        bone: { kid: 'A quarter is left: two half-lives, about 11 460 years. That is near the end of the last Ice Age.', sci: '25.0% of modern: two half-lives, 11 460 ± 45 years.' },
        hearth: { kid: 'Only 1.6% is left, after six half-lives: about 34 380 years! Ice Age hunters sat round this fire, when mammoths still roamed.', sci: '1.56% of modern: six half-lives, 34 380 ± 450 years. A few atoms in a hundred: only atom counting reaches this far.' },
        rings: { kid: "Every ring is one year of the tree's life. Scientists measured the carbon-14 in rings whose year they knew, back about 14 000 years, and found that the air has not always had the same amount. So every carbon-14 age is corrected with the tree rings' help.", sci: 'Calibration: tree rings dated year by year give ¹⁴C against calendar age. IntCal20 (2020) is built from tree rings back to 13 910 years before 1950, then from lake sediments, cave formations and corals back to 55 000 years.' },
        nothing: { kid: 'Nothing to count yet: dig up a find in the trench first.', sci: 'No sample in the lab: dig one up first.' },
      },
      found: 'Dated here',
      panel: {
        kid: [
          'Willard Libby worked out the carbon-14 clock in Chicago in the late 1940s and won the Nobel Prize in Chemistry in 1960. He tested it on wood from the tombs of Egyptian kings, whose age was known from history, and it worked.',
          'Today a machine with a particle accelerator counts the carbon-14 atoms themselves, one by one, in a speck of carbon smaller than a grain of rice. It can date things up to about 50 000 years old; after that too little is left. Real finds travel to a lab like this one; our dig has its own in the tent.',
        ],
        sci: [
          "Willard Libby's group at the University of Chicago published the first radiocarbon dates in 1949, checked against wood of known age from the Egyptian tombs of Djoser and Sneferu; Libby received the Nobel Prize in Chemistry in 1960. Age = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) years.",
          'Libby counted decays and needed grams of carbon. Since 1977, accelerator mass spectrometry counts the ¹⁴C atoms themselves in about a milligram; nitrogen-14 forms no negative ions, so it cannot be mistaken for ¹⁴C. The limit is about 50 000 years, with about 0.2% left.',
          "By convention, labs report a conventional radiocarbon age with Libby's half-life of 5568 years and then calibrate it: the air's ¹⁴C changed with the Sun, the Earth's magnetic field and the carbon cycle, so ages are turned into calendar years with the IntCal20 curve, built from tree rings. The ages here use 5730 years and are not calibrated.",
        ],
      },
    },
    jar: {
      label: 'The atom hourglass',
      title: 'Half-life: the atom hourglass',
      hints: { run: 'Tap the hourglass to let time run', stop: 'Tap the hourglass to stop time', again: 'Tap the lever for 128 new atoms' },
      buttons: { run: 'Run time', stop: 'Stop', half: 'One half-life', again: 'New atoms' },
      slider: 'Time',
      kyears: 'thousand years',
      board: { years: 'years', c14: 'carbon-14', n14: 'nitrogen-14', runs: 'At 5730 years' },
      says: {
        start: { kid: 'Time runs! Watch the glowing carbon-14 atoms: nobody can tell which one will turn into nitrogen next.', sci: 'Each nucleus has the same chance of decaying in any instant, whatever its age; which one goes next is pure chance.' },
        half: { kid: n => `5730 years, one half-life: ${n} of the 128 are still carbon-14. About half, but not exactly 64!`, sci: n => `t = t½ = 5730 years: N = ${n} of N₀ = 128 (expected 64, standard deviation about 5.7).` },
        quarter: { kid: n => `Two half-lives: ${n} left, about a quarter.`, sci: n => `t = 2 t½: N = ${n} (expected 32 ± 4.9).` },
        end: { kid: n => `40 000 years, about seven half-lives: ${n} left. Nearly all gone, and that is why carbon dating stops at about 50 000 years.`, sci: n => `t = 40 000 years ≈ 7 t½: N = ${n} (expected 1.0).` },
        again: { kid: 'New atoms! Let time run again and see how many are left at 5730 years this time.', sci: 'A fresh set of 128 nuclei, with new random decay times.' },
        compare: { kid: (n, b) => `This time ${n} at 5730 years, last time ${b}. Always close to half, never sure: each atom goes by chance.`, sci: (n, b) => `At t½: ${n} this run, ${b} the last. The count is binomial (p = ½), not exactly N₀/2.` },
      },
      panel: {
        kid: [
          'Each glowing bead is a carbon-14 atom. Nobody can say when one of them will turn into nitrogen: it happens by chance. When it does, it shoots out an electron, becomes nitrogen-14 and here drops to the bottom of the hourglass.',
          'But a crowd of atoms keeps time very well: after 5730 years about half are left, after twice as long about a quarter, then an eighth. Pull the lever for new atoms: the count at 5730 years is never exactly half, but always close. A real bone holds billions of carbon-14 atoms, so there the chance evens out almost perfectly.',
        ],
        sci: [
          'Radioactive decay is random: every ¹⁴C nucleus has the same chance of decaying in any moment, however long it has existed. The decay is beta minus, ¹⁴C → ¹⁴N + e⁻ + ν̄ₑ, releasing up to 156 keV. With λ = ln 2 / t½: N(t) = N₀ · e^(−λt) = N₀ · 2^(−t/t½).',
          'With only 128 nuclei the count scatters: at one half-life the expected 64 has a standard deviation of about 5.7. A gram of modern carbon holds about 6 × 10¹⁰ ¹⁴C atoms, so in real samples that scatter is negligible; what limits a date is how many atoms the instrument counts. Half-life 5730 ± 40 years (Godwin, 1962); recent measurements give 5700 ± 30.',
        ],
      },
    },
  },

  'pt-pt': {
    title: 'A escavação ao pôr do sol',
    greet: {
      kid: 'Estamos dentro da imagem: uma escavação de arqueólogos ao pôr do sol! Aqui o carbono-14 é o relógio que diz a idade dos achados. A história da imagem está no cavalete ao teu lado.',
      sci: 'Uma escavação à hora dourada, com um laboratório de radiocarbono na tenda: o carbono-14 produzido no ar por cima de nós, absorvido por tudo o que vive e contado no que sai da terra. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Neste momento, mais de mil átomos de carbono-14 do teu corpo transformam-se em azoto a cada segundo! Nunca o sentes, e chegam átomos novos com a comida.',
        'O Ötzi, o Homem do Gelo encontrado congelado nos Alpes em 1991, foi datado com carbono-14: viveu há cerca de 5300 anos.',
        'Os arqueólogos escavam devagar, com pequenas colheres de pedreiro e pincéis, e registam exatamente onde estava cada achado. Quanto mais funda a camada, mais antiga costuma ser.',
      ],
      sci: [
        'O carbono vivo decai a cerca de 0,23 becquerel por grama, uns 14 decaimentos por minuto. Um adulto de 70 kg, com 18% de carbono, tem cerca de 3 kBq de carbono-14.',
        'Os ensaios de armas nucleares quase duplicaram o ¹⁴C do ar do hemisfério norte até 1963. Esse pico das bombas tem vindo a descer desde então e data tecidos e madeira recentes quase ao ano.',
        'O Ötzi, encontrado em 1991, foi datado por AMS em vários laboratórios: miligramas do seu osso e dos seus tecidos situam-no por volta de 3300 a.C., há cerca de 5300 anos.',
      ],
    },
    sky: {
      label: 'Feito no céu',
      title: 'O carbono-14 é feito no céu',
      sign: 'Feito no céu',
      hints: { tap: 'Toca no céu para um raio cósmico', watch: 'Vê o carbono-14 a descer', again: 'Toca no céu para outro raio cósmico' },
      button: 'Enviar um raio cósmico',
      labels: { ray: 'raio cósmico', neutron: 'neutrão', n14: 'azoto-14', c14: 'carbono-14', proton: 'protão', co2: 'dióxido de carbono' },
      says: {
        ray: { kid: 'Um raio cósmico! Um pedacinho de átomo vindo do espaço choca com o ar lá no alto e solta um neutrão.', sci: 'Um protão dos raios cósmicos despedaça um núcleo na alta atmosfera; a espalação liberta neutrões, que abrandam em colisões com as moléculas do ar.' },
        made: { kid: 'O neutrão acerta num átomo de azoto. O azoto-14 larga um protão e torna-se carbono-14!', sci: 'Captura de um neutrão pelo azoto: n + ¹⁴N → ¹⁴C + p. Sete protões passam a seis: o azoto transforma-se em carbono.' },
        co2: { kid: 'O carbono-14 novo agarra dois átomos de oxigénio e torna-se dióxido de carbono, como o resto do carbono do ar. E lá vai ele a descer.', sci: 'O ¹⁴C oxida-se, primeiro a ¹⁴CO e depois a ¹⁴CO₂, e mistura-se em toda a atmosfera em poucos anos.' },
        tree: { kid: 'O carvalho absorve-o por uma folha e usa-o para crescer, tal como o carbono comum.', sci: 'A fotossíntese fixa o ¹⁴CO₂ como qualquer CO₂: as folhas ficam com a proporção do ar, cerca de 1,2 átomos de ¹⁴C por cada bilião de átomos de carbono.' },
        deer: { kid: 'E o veado come as folhas! Agora esse carbono-14 faz parte do veado. Enquanto vive, continua a comer, por isso tem sempre a mesma pequeníssima parte que o ar.', sci: 'Pela cadeia alimentar, todos os seres vivos mantêm a parte de ¹⁴C da atmosfera. Com a morte, a entrada para e o relógio começa: metade do ¹⁴C desaparece a cada 5730 anos.' },
      },
      panel: {
        kid: [
          'Os raios cósmicos são pedacinhos de átomos que chegam do espaço, mais rápidos do que qualquer coisa na Terra. Quando um choca com o ar lá no alto, mais ou menos à altura a que voam os aviões e ainda mais acima, arranca neutrões aos átomos do ar. Um neutrão que acerte num átomo de azoto transforma-o em carbono-14.',
          'O carbono-14 junta-se ao oxigénio e forma dióxido de carbono, tal como o carbono comum. As plantas absorvem-no, os animais comem as plantas e nós comemos uns e outros. Por isso tudo o que vive tem uma pequeníssima parte de carbono-14: cerca de 1,2 átomos em cada bilião de átomos de carbono. Se cada átomo de carbono fosse um grão de areia com um milímetro, um monte do tamanho de uma casa teria só cerca de um grão de carbono-14.',
        ],
        sci: [
          'Os raios cósmicos primários, sobretudo protões, despedaçam núcleos da alta atmosfera e libertam neutrões; abrandados por colisões, os neutrões são capturados pelo azoto: n + ¹⁴N → ¹⁴C + p. A produção é maior entre cerca de 9 e 15 km de altitude e nas latitudes geomagnéticas altas: os modelos dão cerca de 1,6 a 1,9 átomos por centímetro quadrado da superfície da Terra a cada segundo.',
          'O ¹⁴C oxida-se a ¹⁴CO₂ e mistura-se na atmosfera e nos oceanos; a fotossíntese e as cadeias alimentares dão a todos os seres vivos a proporção do ar, ¹⁴C/¹²C ≈ 1,2 × 10⁻¹². O fluxo de raios cósmicos muda com a atividade do Sol e com o campo magnético da Terra, por isso essa proporção nem sempre foi a mesma: daí a calibração (vê o laboratório).',
        ],
      },
    },
    dig: {
      label: 'A vala',
      title: 'Escavar é recuar no tempo',
      finds: {
        linen: { name: 'Um pedaço de linho', short: 'linho' },
        bowl: { name: 'Uma tigela de madeira', short: 'tigela' },
        bone: { name: 'Um osso de veado', short: 'osso' },
        hearth: { name: 'Carvão de uma fogueira', short: 'carvão' },
      },
      hints: { tap: 'Toca num achado para o desenterrar', lab: 'Agora data-o na tenda', more: 'Toca noutro achado para o desenterrar', done: 'Tudo desenterrado, toca na pá para uma nova escavação' },
      buttons: { linen: 'Desenterrar o linho', bowl: 'Desenterrar a tigela', bone: 'Desenterrar o osso', hearth: 'Desenterrar o carvão', again: 'Uma nova escavação' },
      says: {
        linen: { kid: 'Um pedaço de tecido de linho, feito com as fibras da planta do linho. As plantas absorveram carbono-14 do ar enquanto cresciam. Lá vai ele para o laboratório na tenda!', sci: 'Linho: celulose da planta do linho. Um tecido data a estação em que as plantas foram colhidas; bastam alguns miligramas para a AMS. Para o laboratório.' },
        bowl: { kid: 'Uma tigela de madeira, esculpida há muito tempo. A madeira ainda guarda o carbono-14 que a árvore absorveu. Para o laboratório!', sci: 'A madeira esculpida data o crescimento dos seus anéis, não o trabalho do escultor: o cerne de uma árvore velha pode ser séculos mais antigo do que a tigela (o problema da madeira velha). Para o laboratório.' },
        bone: { kid: 'Um osso de veado! Esse veado recebeu o carbono-14 das folhas que comia, como o veado debaixo do carvalho. Para o laboratório!', sci: 'O osso é datado pelo seu colagénio, extraído e purificado; o seu carbono veio da comida do veado e, portanto, do ar do seu tempo de vida. Para o laboratório.' },
        hearth: { kid: 'Carvão de uma fogueira, o mais fundo de todos, por isso provavelmente o mais antigo. O carvão é quase só carbono: perfeito para o relógio. Para o laboratório!', sci: 'Carvão: quase carbono puro e quimicamente resistente, a amostra de radiocarbono mais comum. Uma lavagem com ácido, base e ácido remove carbonatos e ácidos húmicos, que trariam carbono mais recente. Para o laboratório.' },
        again: { kid: 'Uma nova escavação! Os achados voltaram às suas camadas, à espera.', sci: 'Reposto: cada achado de volta à sua camada.' },
      },
      panel: {
        kid: [
          'Os arqueólogos escavam devagar, camada a camada, com pequenas colheres de pedreiro e pincéis. Cada camada de terra depositou-se por cima da anterior, por isso quanto mais fundo escavas, mais recuas no tempo.',
          'Estes quatro achados são exemplos inventados para esta escavação, mas são o tipo de coisas que se datam todos os dias: tecido, madeira, osso e carvão. Cada um já fez parte de algo vivo, por isso cada um tem um relógio de carbono-14 lá dentro. Toca num para o desenterrar; vai para o laboratório na tenda.',
        ],
        sci: [
          'Estratigrafia: em depósitos não perturbados, cada camada é mais recente do que a que está por baixo (lei da sobreposição de Nicolau Steno, 1669). Os arqueólogos registam a camada e a posição de cada achado e depois datam amostras das camadas para transformar a sequência em anos.',
          'Os quatro achados são exemplos inventados dos materiais habituais: tecido, madeira, colagénio de osso e carvão. Pode datar-se tudo o que, em vida, tirou o seu carbono do ar. Conchas e peixes de lago exigem cuidado: o seu carbono veio de água que pode conter carbono mais antigo (o efeito de reservatório).',
        ],
      },
    },
    lab: {
      label: 'O laboratório de datação',
      title: 'Contar o carbono-14',
      sign: 'Datação',
      hints: { date: 'Toca na máquina para contar o carbono-14', counting: 'A contar os átomos', none: 'Primeiro desenterra um achado na vala', rings: 'Toca no corte do tronco para saberes porquê', done: 'Lê o relógio no quadro' },
      buttons: { date: 'Contar o carbono-14', rings: 'Os anéis da árvore' },
      screen: {
        title: 'Contador de carbono-14',
        ready: 'Põe um achado',
        counting: 'A contar...',
        left: { kid: 'resta {pct}% do carbono-14', sci: '{pct}% do C-14 atual' },
        years: { kid: 'cerca de {age} anos', sci: '{age} ± {err} anos' },
      },
      board: { title: 'O relógio do carbono-14', left: 'carbono-14 que resta', years: 'anos', alive: 'vivo', half: 'meia-vida' },
      says: {
        counting: { kid: 'Lá vai um pedacinho! A máquina transforma-o num feixe e conta os átomos de carbono-14 um a um.', sci: 'AMS: a amostra, queimada e transformada em grafite, é pulverizada num feixe de iões negativos; o acelerador arranca-lhes eletrões, desfazendo moléculas com a mesma massa, e ímanes separam o ¹⁴C do ¹²C e do ¹³C, para serem contados átomo a átomo.' },
        linen: { kid: 'Restam três quartos do carbono-14: tem cerca de 2380 anos. Este tecido foi feito na Idade do Ferro.', sci: '75,0% do ¹⁴C atual: 8267 · ln(1/0,75) = 2380 ± 25 anos, com t½ = 5730 anos (sem calibração).' },
        bowl: { kid: 'Resta metade: uma meia-vida, por isso tem cerca de 5730 anos! Foi esculpida no tempo dos primeiros agricultores.', sci: '50,0% do atual: uma meia-vida, 5730 ± 30 anos.' },
        bone: { kid: 'Resta um quarto: duas meias-vidas, cerca de 11 460 anos. Isso é perto do fim da última Idade do Gelo.', sci: '25,0% do atual: duas meias-vidas, 11 460 ± 45 anos.' },
        hearth: { kid: 'Resta só 1,6%, depois de seis meias-vidas: cerca de 34 380 anos! Caçadores da Idade do Gelo sentaram-se à volta desta fogueira, quando ainda havia mamutes.', sci: '1,56% do atual: seis meias-vidas, 34 380 ± 450 anos. Uns poucos átomos em cada cem: só a contagem de átomos chega tão longe.' },
        rings: { kid: 'Cada anel é um ano da vida da árvore. Os cientistas mediram o carbono-14 em anéis de ano conhecido, até cerca de 14 000 anos atrás, e descobriram que o ar nem sempre teve a mesma quantidade. Por isso cada idade de carbono-14 é corrigida com a ajuda dos anéis das árvores.', sci: 'Calibração: anéis de árvore datados ano a ano dão o ¹⁴C em função da idade de calendário. A IntCal20 (2020) é feita com anéis de árvore até 13 910 anos antes de 1950 e, para trás, com sedimentos de lagos, formações de grutas e corais, até 55 000 anos.' },
        nothing: { kid: 'Ainda não há nada para contar: primeiro desenterra um achado na vala.', sci: 'Não há amostra no laboratório: desenterra uma primeiro.' },
      },
      found: 'Datados aqui',
      panel: {
        kid: [
          'Willard Libby descobriu o relógio do carbono-14 em Chicago, no fim dos anos 1940, e ganhou o Prémio Nobel da Química em 1960. Experimentou-o com madeira dos túmulos de reis do Egito, cuja idade se conhecia pela história, e funcionou.',
          'Hoje, uma máquina com um acelerador de partículas conta os próprios átomos de carbono-14, um a um, num grão de carbono mais pequeno do que um bago de arroz. Consegue datar coisas até cerca de 50 000 anos; depois disso, sobra demasiado pouco. Os achados verdadeiros viajam até um laboratório como este; a nossa escavação tem o seu na tenda.',
        ],
        sci: [
          'O grupo de Willard Libby na Universidade de Chicago publicou as primeiras datas de radiocarbono em 1949, confirmadas com madeira de idade conhecida dos túmulos egípcios de Djoser e Seneferu; Libby recebeu o Prémio Nobel da Química em 1960. Idade = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) anos.',
          'Libby contava decaimentos e precisava de gramas de carbono. Desde 1977, a espectrometria de massa com acelerador conta os próprios átomos de ¹⁴C em cerca de um miligrama; o azoto-14 não forma iões negativos, por isso não pode ser confundido com o ¹⁴C. O limite é de cerca de 50 000 anos, quando resta cerca de 0,2%.',
          'Por convenção, os laboratórios dão uma idade de radiocarbono convencional com a meia-vida de Libby, 5568 anos, e depois calibram-na: o ¹⁴C do ar mudou com o Sol, com o campo magnético da Terra e com o ciclo do carbono, por isso as idades passam a anos de calendário com a curva IntCal20, construída com anéis de árvores. As idades daqui usam 5730 anos e não estão calibradas.',
        ],
      },
    },
    jar: {
      label: 'A ampulheta de átomos',
      title: 'Meia-vida: a ampulheta de átomos',
      hints: { run: 'Toca na ampulheta para o tempo correr', stop: 'Toca na ampulheta para parar o tempo', again: 'Toca na alavanca para 128 átomos novos' },
      buttons: { run: 'Fazer correr o tempo', stop: 'Parar', half: 'Uma meia-vida', again: 'Átomos novos' },
      slider: 'Tempo',
      kyears: 'mil anos',
      board: { years: 'anos', c14: 'carbono-14', n14: 'azoto-14', runs: 'Aos 5730 anos' },
      says: {
        start: { kid: 'O tempo corre! Olha para os átomos de carbono-14 a brilhar: ninguém sabe qual será o próximo a transformar-se em azoto.', sci: 'Cada núcleo tem a mesma probabilidade de decair em qualquer instante, seja qual for a sua idade; qual decai a seguir é puro acaso.' },
        half: { kid: n => `5730 anos, uma meia-vida. Carbono-14 que resta: ${n} dos 128. Mais ou menos metade, mas não exatamente 64!`, sci: n => `t = t½ = 5730 anos: N = ${n} de N₀ = 128 (esperado 64, desvio-padrão de cerca de 5,7).` },
        quarter: { kid: n => `Duas meias-vidas. Restam: ${n}, mais ou menos um quarto.`, sci: n => `t = 2 t½: N = ${n} (esperado 32 ± 4,9).` },
        end: { kid: n => `40 000 anos, cerca de sete meias-vidas. Restam: ${n}. Quase todos desapareceram, e é por isso que a datação por carbono acaba por volta dos 50 000 anos.`, sci: n => `t = 40 000 anos ≈ 7 t½: N = ${n} (esperado 1,0).` },
        again: { kid: 'Átomos novos! Deixa o tempo correr outra vez e vê quantos restam aos 5730 anos desta vez.', sci: 'Um novo conjunto de 128 núcleos, com novos tempos de decaimento ao acaso.' },
        compare: { kid: (n, b) => `Desta vez ${n} aos 5730 anos, da última vez ${b}. Sempre perto de metade, nunca certo: cada átomo vai ao acaso.`, sci: (n, b) => `Em t½: ${n} nesta corrida, ${b} na anterior. A contagem segue uma binomial (p = ½), não é exatamente N₀/2.` },
      },
      panel: {
        kid: [
          'Cada conta a brilhar é um átomo de carbono-14. Ninguém sabe dizer quando é que um deles se vai transformar em azoto: acontece por acaso. Quando acontece, dispara um eletrão, torna-se azoto-14 e, aqui, cai para o fundo da ampulheta.',
          'Mas uma multidão de átomos marca o tempo muito bem: ao fim de 5730 anos resta cerca de metade, ao fim do dobro do tempo cerca de um quarto, depois um oitavo. Puxa a alavanca para ter átomos novos: a contagem aos 5730 anos nunca é exatamente metade, mas fica sempre perto. Um osso de verdade tem milhares de milhões de átomos de carbono-14, por isso aí o acaso compensa-se quase na perfeição.',
        ],
        sci: [
          'O decaimento radioativo é aleatório: cada núcleo de ¹⁴C tem a mesma probabilidade de decair em cada instante, independentemente de há quanto tempo existe. O decaimento é beta menos, ¹⁴C → ¹⁴N + e⁻ + ν̄ₑ, e liberta até 156 keV. Com λ = ln 2 / t½: N(t) = N₀ · e^(−λt) = N₀ · 2^(−t/t½).',
          'Com só 128 núcleos a contagem dispersa-se: a uma meia-vida, os 64 esperados têm um desvio-padrão de cerca de 5,7. Um grama de carbono atual tem cerca de 6 × 10¹⁰ átomos de ¹⁴C, por isso nas amostras reais essa dispersão é desprezável; o que limita uma data é quantos átomos o aparelho conta. Meia-vida de 5730 ± 40 anos (Godwin, 1962); medições recentes dão 5700 ± 30.',
        ],
      },
    },
  },

  pl: {
    title: 'Wykopalisko o zachodzie słońca',
    greet: {
      kid: 'Jesteśmy w środku obrazka: na wykopaliskach archeologów o zachodzie słońca! Tutaj węgiel-14 to zegar, który mówi, ile lat mają znaleziska. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Wykopalisko w złotej godzinie, z laboratorium radiowęglowym w namiocie: węgiel-14 powstający w powietrzu nad nami, pobierany przez wszystko, co żyje, i liczony w tym, co wychodzi z ziemi. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'W tej chwili ponad tysiąc atomów węgla-14 w twoim ciele co sekundę zamienia się w azot! Wcale tego nie czujesz, a nowe przychodzą z jedzeniem.',
        'Ötzi, człowiek lodu znaleziony zamarznięty w Alpach w 1991 roku, został datowany węglem-14: żył około 5300 lat temu.',
        'Archeolodzy kopią powoli, małymi kielniami i pędzelkami, i zapisują dokładnie, gdzie leżało każde znalezisko. Im głębsza warstwa, tym zwykle starsza.',
      ],
      sci: [
        'Żywy węgiel rozpada się z aktywnością około 0,23 bekerela na gram, czyli około 14 rozpadów na minutę. Dorosły o masie 70 kg, w 18% z węgla, ma w sobie około 3 kBq węgla-14.',
        'Próby broni jądrowej do 1963 roku niemal podwoiły ilość ¹⁴C w powietrzu półkuli północnej. Ten bombowy szczyt od tamtej pory maleje i pozwala datować współczesne tkanki i drewno niemal co do roku.',
        'Ötzi, znaleziony w 1991 roku, został datowany metodą AMS w kilku laboratoriach: miligramy jego kości i tkanek wskazują na około 3300 lat p.n.e., czyli około 5300 lat temu.',
      ],
    },
    sky: {
      label: 'Powstaje w niebie',
      title: 'Węgiel-14 powstaje w niebie',
      sign: 'Powstaje w niebie',
      hints: { tap: 'Dotknij nieba, by wysłać promień kosmiczny', watch: 'Patrz, jak węgiel-14 opada', again: 'Dotknij nieba, by wysłać kolejny promień' },
      button: 'Wyślij promień kosmiczny',
      labels: { ray: 'promień kosmiczny', neutron: 'neutron', n14: 'azot-14', c14: 'węgiel-14', proton: 'proton', co2: 'dwutlenek węgla' },
      says: {
        ray: { kid: 'Promień kosmiczny! Okruch atomu z głębi kosmosu uderza w powietrze wysoko nad nami i wybija neutron.', sci: 'Proton promieniowania kosmicznego rozbija jądro w górnej atmosferze; w tej spalacji uwalniają się neutrony, które zwalniają w zderzeniach z cząsteczkami powietrza.' },
        made: { kid: 'Neutron trafia w atom azotu. Azot-14 oddaje proton i staje się węglem-14!', sci: 'Wychwyt neutronu przez azot: n + ¹⁴N → ¹⁴C + p. Z siedmiu protonów robi się sześć: azot zamienia się w węgiel.' },
        co2: { kid: 'Nowy węgiel-14 łapie dwa atomy tlenu i staje się dwutlenkiem węgla, jak reszta węgla w powietrzu. I powoli opada.', sci: '¹⁴C utlenia się najpierw do ¹⁴CO, potem do ¹⁴CO₂ i w ciągu kilku lat miesza się z całą atmosferą.' },
        tree: { kid: 'Dąb wchłania go przez liść i wbudowuje w siebie, tak jak zwykły węgiel.', sci: 'Fotosynteza wiąże ¹⁴CO₂ jak każdy CO₂: liście mają proporcję z powietrza, około 1,2 atomu ¹⁴C na bilion atomów węgla.' },
        deer: { kid: 'A jeleń zjada liście! Teraz ten węgiel-14 jest częścią jelenia. Dopóki żyje, wciąż je, więc ma zawsze taką samą malutką część jak powietrze.', sci: 'Przez łańcuch pokarmowy każdy organizm utrzymuje udział ¹⁴C z atmosfery. Po śmierci dopływ ustaje i zegar rusza: co 5730 lat znika połowa ¹⁴C.' },
      },
      panel: {
        kid: [
          'Promienie kosmiczne to okruchy atomów lecące z kosmosu szybciej niż cokolwiek na Ziemi. Kiedy taki promień uderzy w powietrze wysoko nad nami, mniej więcej tam, gdzie latają samoloty, i jeszcze wyżej, wybija neutrony z atomów powietrza. Neutron, który trafi w atom azotu, zamienia go w węgiel-14.',
          'Węgiel-14 łączy się z tlenem w dwutlenek węgla, tak jak zwykły węgiel. Rośliny go pobierają, zwierzęta jedzą rośliny, a my jemy jedne i drugie. Dlatego wszystko, co żyje, ma w sobie malutką część węgla-14: około 1,2 atomu na każdy bilion atomów węgla. Gdyby każdy atom węgla był ziarnkiem piasku wielkości milimetra, w kupie piasku wielkiej jak dom byłoby tylko około jednego ziarnka węgla-14.',
        ],
        sci: [
          'Pierwotne promieniowanie kosmiczne, głównie protony, rozbija jądra w górnej atmosferze i uwalnia neutrony; spowolnione w zderzeniach, neutrony są wychwytywane przez azot: n + ¹⁴N → ¹⁴C + p. Produkcja jest największa na wysokości około 9 do 15 km i na dużych szerokościach geomagnetycznych: według modeli około 1,6 do 1,9 atomu na centymetr kwadratowy powierzchni Ziemi na sekundę.',
          '¹⁴C utlenia się do ¹⁴CO₂ i miesza z atmosferą i oceanami; fotosynteza i łańcuchy pokarmowe dają każdemu organizmowi proporcję z powietrza, ¹⁴C/¹²C ≈ 1,2 × 10⁻¹². Strumień promieniowania kosmicznego zmienia się z aktywnością Słońca i polem magnetycznym Ziemi, więc ta proporcja nie zawsze była taka sama: stąd kalibracja (zobacz laboratorium).',
        ],
      },
    },
    dig: {
      label: 'Wykop',
      title: 'Kopanie w głąb czasu',
      finds: {
        linen: { name: 'Skrawek lnianego płótna', short: 'płótno' },
        bowl: { name: 'Drewniana miska', short: 'miska' },
        bone: { name: 'Kość jelenia', short: 'kość' },
        hearth: { name: 'Węgiel drzewny z paleniska', short: 'węgiel drzewny' },
      },
      hints: { tap: 'Dotknij znaleziska, by je wykopać', lab: 'Teraz zbadaj je w namiocie', more: 'Dotknij kolejnego znaleziska, by je wykopać', done: 'Wszystko wykopane, dotknij łopaty, by zacząć od nowa' },
      buttons: { linen: 'Wykop płótno', bowl: 'Wykop miskę', bone: 'Wykop kość', hearth: 'Wykop węgiel drzewny', again: 'Nowe wykopalisko' },
      says: {
        linen: { kid: 'Skrawek lnianego płótna, utkanego z włókien lnu. Len pobierał węgiel-14 z powietrza, kiedy rósł. Do laboratorium w namiocie!', sci: 'Płótno lniane: celuloza z lnu. Tkanina datuje sezon, w którym zebrano rośliny; do AMS wystarczy kilka miligramów. Do laboratorium.' },
        bowl: { kid: 'Drewniana miska, wyrzeźbiona dawno temu. Drewno wciąż ma w sobie węgiel-14, który pobrało drzewo. Do laboratorium!', sci: 'Rzeźbione drewno datuje przyrost jego słojów, a nie rzeźbienie: twardziel starego drzewa może być o stulecia starsza od miski (problem starego drewna). Do laboratorium.' },
        bone: { kid: 'Kość jelenia! Ten jeleń dostał swój węgiel-14 z liści, które jadł, tak jak jeleń pod dębem. Do laboratorium!', sci: 'Kość datuje się na podstawie kolagenu, wydobytego i oczyszczonego; jego węgiel pochodzi z pokarmu jelenia, a więc z powietrza z czasów jego życia. Do laboratorium.' },
        hearth: { kid: 'Węgiel drzewny z ogniska, najgłębiej ze wszystkiego, więc pewnie najstarszy. Węgiel drzewny to prawie czysty węgiel: idealny dla zegara. Do laboratorium!', sci: 'Węgiel drzewny: prawie czysty węgiel, odporny chemicznie, najczęstsza próbka radiowęglowa. Płukanie kwasem, zasadą i znów kwasem usuwa węglany i kwasy humusowe, które wniosłyby młodszy węgiel. Do laboratorium.' },
        again: { kid: 'Nowe wykopalisko! Znaleziska wróciły do swoich warstw i czekają.', sci: 'Od nowa: każde znalezisko z powrotem w swojej warstwie.' },
      },
      panel: {
        kid: [
          'Archeolodzy kopią powoli, warstwa po warstwie, małymi kielniami i pędzelkami. Każda warstwa ziemi osadziła się na poprzedniej, więc im głębiej kopiesz, tym dalej cofasz się w czasie.',
          'Te cztery znaleziska to przykłady wymyślone dla tego wykopaliska, ale właśnie takie rzeczy datuje się codziennie: tkaniny, drewno, kości i węgiel drzewny. Każde było kiedyś częścią czegoś żywego, więc każde ma w środku zegar z węgla-14. Dotknij jednego, by je wykopać; trafi do laboratorium w namiocie.',
        ],
        sci: [
          'Stratygrafia: w nienaruszonych osadach każda warstwa jest młodsza od tej pod nią (prawo superpozycji Nicolasa Stenona, 1669). Archeolodzy zapisują warstwę i położenie każdego znaleziska, a potem datują próbki z warstw, by zamienić kolejność w lata.',
          'Cztery znaleziska to wymyślone przykłady typowych materiałów: tkaniny, drewna, kolagenu z kości i węgla drzewnego. Datować można wszystko, co za życia brało węgiel z powietrza. Muszle i ryby z jezior wymagają ostrożności: ich węgiel pochodził z wody, w której może być starszy węgiel (efekt rezerwuarowy).',
        ],
      },
    },
    lab: {
      label: 'Laboratorium datowania',
      title: 'Liczenie węgla-14',
      sign: 'Datowanie',
      hints: { date: 'Dotknij maszyny, by policzyć węgiel-14', counting: 'Liczenie atomów', none: 'Najpierw wykop znalezisko w wykopie', rings: 'Dotknij plastra drzewa, by zobaczyć dlaczego', done: 'Odczytaj zegar na tablicy' },
      buttons: { date: 'Policz węgiel-14', rings: 'Słoje drzewa' },
      screen: {
        title: 'Licznik węgla-14',
        ready: 'Włóż znalezisko',
        counting: 'Liczenie...',
        left: { kid: 'zostało {pct}% węgla-14', sci: '{pct}% współczesnego C-14' },
        years: { kid: 'ma około {age} lat', sci: '{age} ± {err} lat' },
      },
      board: { title: 'Zegar węgla-14', left: 'zostało węgla-14', years: 'lat', alive: 'żywy', half: 'okres półtrwania' },
      says: {
        counting: { kid: 'Do środka trafia malutki kawałek! Maszyna zamienia go w wiązkę i liczy atomy węgla-14 jeden po drugim.', sci: 'AMS: próbka, spalona i zamieniona w grafit, jest rozpylana w wiązkę jonów ujemnych; akcelerator odziera je z elektronów, rozbijając cząsteczki o tej samej masie, a magnesy oddzielają ¹⁴C od ¹²C i ¹³C, by liczyć je atom po atomie.' },
        linen: { kid: 'Zostały trzy czwarte węgla-14: płótno ma około 2380 lat. Utkali je ludzie epoki żelaza.', sci: '75,0% współczesnego ¹⁴C: 8267 · ln(1/0,75) = 2380 ± 25 lat, przy t½ = 5730 lat (bez kalibracji).' },
        bowl: { kid: 'Została połowa: jeden okres półtrwania, czyli około 5730 lat! Wyrzeźbiono ją w czasach pierwszych rolników.', sci: '50,0% współczesnego: jeden okres półtrwania, 5730 ± 30 lat.' },
        bone: { kid: 'Została jedna czwarta: dwa okresy półtrwania, około 11 460 lat. To blisko końca ostatniej epoki lodowcowej.', sci: '25,0% współczesnego: dwa okresy półtrwania, 11 460 ± 45 lat.' },
        hearth: { kid: 'Zostało tylko 1,6%, po sześciu okresach półtrwania: około 34 380 lat! Przy tym ognisku siedzieli łowcy z epoki lodowcowej, kiedy żyły jeszcze mamuty.', sci: '1,56% współczesnego: sześć okresów półtrwania, 34 380 ± 450 lat. Kilka atomów na sto: tak daleko sięga tylko liczenie atomów.' },
        rings: { kid: 'Każdy słój to jeden rok życia drzewa. Naukowcy zmierzyli węgiel-14 w słojach, których rok znali, aż do około 14 000 lat wstecz, i odkryli, że w powietrzu nie zawsze było go tyle samo. Dlatego każdy wiek z węgla-14 poprawia się z pomocą słojów drzew.', sci: 'Kalibracja: słoje drzew datowane rok po roku dają ¹⁴C w zależności od wieku kalendarzowego. IntCal20 (2020) opiera się na słojach drzew do 13 910 lat przed 1950 rokiem, a dalej na osadach jezior, naciekach jaskiniowych i koralowcach, aż do 55 000 lat.' },
        nothing: { kid: 'Na razie nie ma czego liczyć: najpierw wykop znalezisko w wykopie.', sci: 'Brak próbki w laboratorium: najpierw jakąś wykop.' },
      },
      found: 'Datowane tutaj',
      panel: {
        kid: [
          'Willard Libby wymyślił zegar węgla-14 w Chicago pod koniec lat 40. XX wieku i dostał Nagrodę Nobla w dziedzinie chemii w 1960 roku. Sprawdził go na drewnie z grobowców egipskich królów, których wiek znano z historii, i zadziałał.',
          'Dziś maszyna z akceleratorem cząstek liczy same atomy węgla-14, jeden po drugim, w okruchu węgla mniejszym niż ziarnko ryżu. Potrafi datować rzeczy do około 50 000 lat; potem zostaje za mało. Prawdziwe znaleziska jadą do laboratorium takiego jak to; nasze wykopalisko ma swoje w namiocie.',
        ],
        sci: [
          'Grupa Willarda Libby’ego z Uniwersytetu Chicagowskiego opublikowała pierwsze daty radiowęglowe w 1949 roku, sprawdzone na drewnie o znanym wieku z egipskich grobowców Dżesera i Snofru; Libby otrzymał Nagrodę Nobla w dziedzinie chemii w 1960 roku. Wiek = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) lat.',
          'Libby liczył rozpady i potrzebował gramów węgla. Od 1977 roku akceleratorowa spektrometria mas liczy same atomy ¹⁴C w około miligramie; azot-14 nie tworzy jonów ujemnych, więc nie da się go pomylić z ¹⁴C. Granica to około 50 000 lat, gdy zostaje około 0,2%.',
          'Umownie laboratoria podają konwencjonalny wiek radiowęglowy z okresem półtrwania Libby’ego, 5568 lat, a potem go kalibrują: ¹⁴C w powietrzu zmieniał się wraz ze Słońcem, polem magnetycznym Ziemi i obiegiem węgla, więc wiek zamienia się na lata kalendarzowe krzywą IntCal20, zbudowaną ze słojów drzew. Wieki tutaj liczone są z 5730 lat i nie są kalibrowane.',
        ],
      },
    },
    jar: {
      label: 'Atomowa klepsydra',
      title: 'Okres półtrwania: atomowa klepsydra',
      hints: { run: 'Dotknij klepsydry, by puścić czas', stop: 'Dotknij klepsydry, by zatrzymać czas', again: 'Dotknij dźwigni, by dostać 128 nowych atomów' },
      buttons: { run: 'Puść czas', stop: 'Stop', half: 'Jeden okres półtrwania', again: 'Nowe atomy' },
      slider: 'Czas',
      kyears: 'tys. lat',
      board: { years: 'lat', c14: 'węgiel-14', n14: 'azot-14', runs: 'Po 5730 latach' },
      says: {
        start: { kid: 'Czas płynie! Patrz na świecące atomy węgla-14: nikt nie wie, który następny zamieni się w azot.', sci: 'Każde jądro ma w każdej chwili taką samą szansę rozpadu, niezależnie od wieku; które rozpadnie się następne, to czysty przypadek.' },
        half: { kid: n => `5730 lat, jeden okres półtrwania. Węgiel-14: ${n} ze 128 atomów. Mniej więcej połowa, ale nie dokładnie 64!`, sci: n => `t = t½ = 5730 lat: N = ${n} z N₀ = 128 (oczekiwane 64, odchylenie standardowe około 5,7).` },
        quarter: { kid: n => `Dwa okresy półtrwania. Zostało: ${n}, mniej więcej jedna czwarta.`, sci: n => `t = 2 t½: N = ${n} (oczekiwane 32 ± 4,9).` },
        end: { kid: n => `40 000 lat, około siedmiu okresów półtrwania. Zostało: ${n}. Prawie wszystkie zniknęły i dlatego datowanie węglem kończy się na około 50 000 lat.`, sci: n => `t = 40 000 lat ≈ 7 t½: N = ${n} (oczekiwane 1,0).` },
        again: { kid: 'Nowe atomy! Puść znowu czas i zobacz, ile zostanie po 5730 latach tym razem.', sci: 'Nowy zestaw 128 jąder, z nowymi losowymi czasami rozpadu.' },
        compare: { kid: (n, b) => `Tym razem po 5730 latach: ${n}, poprzednio: ${b}. Zawsze blisko połowy, ale nigdy na pewno: każdy atom rozpada się przypadkiem.`, sci: (n, b) => `Przy t½: ${n} w tym przebiegu, ${b} w poprzednim. Liczba ma rozkład dwumianowy (p = ½), a nie dokładnie N₀/2.` },
      },
      panel: {
        kid: [
          'Każdy świecący koralik to atom węgla-14. Nikt nie potrafi powiedzieć, kiedy któryś zamieni się w azot: dzieje się to przypadkiem. Kiedy to się stanie, atom wystrzeliwuje elektron, staje się azotem-14 i tutaj spada na dno klepsydry.',
          'Ale tłum atomów bardzo dobrze odmierza czas: po 5730 latach zostaje mniej więcej połowa, po dwa razy dłuższym czasie mniej więcej ćwierć, potem jedna ósma. Pociągnij dźwignię, by dostać nowe atomy: liczba po 5730 latach nigdy nie jest dokładnie połową, ale zawsze jest blisko. Prawdziwa kość ma miliardy atomów węgla-14, więc tam przypadek wyrównuje się niemal idealnie.',
        ],
        sci: [
          'Rozpad promieniotwórczy jest losowy: każde jądro ¹⁴C ma w każdej chwili taką samą szansę rozpadu, niezależnie od tego, jak długo istnieje. To rozpad beta minus, ¹⁴C → ¹⁴N + e⁻ + ν̄ₑ, z energią do 156 keV. Przy λ = ln 2 / t½: N(t) = N₀ · e^(−λt) = N₀ · 2^(−t/t½).',
          'Przy zaledwie 128 jądrach liczba się rozrzuca: po jednym okresie półtrwania oczekiwane 64 ma odchylenie standardowe około 5,7. Gram współczesnego węgla zawiera około 6 × 10¹⁰ atomów ¹⁴C, więc w prawdziwych próbkach ten rozrzut jest pomijalny; datę ogranicza to, ile atomów zliczy przyrząd. Okres półtrwania 5730 ± 40 lat (Godwin, 1962); nowsze pomiary dają 5700 ± 30.',
        ],
      },
    },
  },

  de: {
    title: 'Die Ausgrabung bei Sonnenuntergang',
    greet: {
      kid: 'Wir sind im Bild: bei einer Ausgrabung von Archäologen, bei Sonnenuntergang! Hier ist Kohlenstoff-14 die Uhr, die verrät, wie alt die Funde sind. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Eine Ausgrabung zur goldenen Stunde, mit einem Radiokarbonlabor im Zelt: Kohlenstoff-14, in der Luft über uns gebildet, von allem Lebendigen aufgenommen und in dem gezählt, was aus dem Boden kommt. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Gerade jetzt verwandeln sich in deinem Körper jede Sekunde mehr als tausend Kohlenstoff-14-Atome in Stickstoff! Du spürst es nie, und mit dem Essen kommen neue dazu.',
        'Ötzi, der Mann aus dem Eis, 1991 gefroren in den Alpen gefunden, wurde mit Kohlenstoff-14 datiert: Er lebte vor etwa 5300 Jahren.',
        'Archäologen graben langsam, mit kleinen Kellen und Pinseln, und schreiben genau auf, wo jeder Fund lag. Je tiefer die Schicht, desto älter ist sie meistens.',
      ],
      sci: [
        'Lebender Kohlenstoff zerfällt mit etwa 0,23 Becquerel pro Gramm, rund 14 Zerfällen pro Minute. Ein Erwachsener mit 70 kg, zu 18% Kohlenstoff, trägt etwa 3 kBq Kohlenstoff-14 in sich.',
        'Kernwaffentests haben das ¹⁴C in der Luft der Nordhalbkugel bis 1963 fast verdoppelt. Dieser Bombenpeak sinkt seither und datiert junges Gewebe und Holz fast aufs Jahr genau.',
        'Ötzi, 1991 gefunden, wurde in mehreren Laboren mit AMS datiert: Milligramm seiner Knochen und Gewebe setzen ihn um 3300 v. Chr., vor etwa 5300 Jahren.',
      ],
    },
    sky: {
      label: 'Im Himmel gemacht',
      title: 'Kohlenstoff-14 entsteht im Himmel',
      sign: 'Im Himmel gemacht',
      hints: { tap: 'Tippe in den Himmel für einen kosmischen Strahl', watch: 'Schau, wie das Kohlenstoff-14 herabkommt', again: 'Tippe in den Himmel für noch einen Strahl' },
      button: 'Einen kosmischen Strahl schicken',
      labels: { ray: 'kosmischer Strahl', neutron: 'Neutron', n14: 'Stickstoff-14', c14: 'Kohlenstoff-14', proton: 'Proton', co2: 'Kohlenstoffdioxid' },
      says: {
        ray: { kid: 'Ein kosmischer Strahl! Ein Stückchen eines Atoms aus dem Weltall prallt hoch über uns in die Luft und schlägt ein Neutron heraus.', sci: 'Ein Proton der kosmischen Strahlung zertrümmert einen Atomkern in der oberen Atmosphäre; bei dieser Spallation werden Neutronen frei, die durch Stöße mit Luftmolekülen langsamer werden.' },
        made: { kid: 'Das Neutron trifft ein Stickstoffatom. Stickstoff-14 gibt ein Proton ab und wird zu Kohlenstoff-14!', sci: 'Neutroneneinfang durch Stickstoff: n + ¹⁴N → ¹⁴C + p. Aus sieben Protonen werden sechs: Stickstoff wird zu Kohlenstoff.' },
        co2: { kid: 'Das neue Kohlenstoff-14 schnappt sich zwei Sauerstoffatome und wird zu Kohlenstoffdioxid, wie der übrige Kohlenstoff in der Luft. Langsam sinkt es herab.', sci: '¹⁴C wird oxidiert, erst zu ¹⁴CO, dann zu ¹⁴CO₂, und verteilt sich innerhalb weniger Jahre in der ganzen Atmosphäre.' },
        tree: { kid: 'Die Eiche nimmt es durch ein Blatt auf und baut es in sich ein, genau wie gewöhnlichen Kohlenstoff.', sci: 'Die Photosynthese bindet ¹⁴CO₂ wie jedes CO₂: Die Blätter tragen das Verhältnis der Luft, etwa 1,2 Atome ¹⁴C pro Billion Kohlenstoffatome.' },
        deer: { kid: 'Und der Hirsch frisst die Blätter! Jetzt ist dieses Kohlenstoff-14 ein Teil des Hirsches. Solange er lebt, frisst er weiter und hat darum immer denselben winzigen Anteil wie die Luft.', sci: 'Über die Nahrungskette hält jedes Lebewesen den ¹⁴C-Anteil der Atmosphäre. Mit dem Tod endet die Aufnahme, und die Uhr beginnt: Alle 5730 Jahre ist die Hälfte des ¹⁴C weg.' },
      },
      panel: {
        kid: [
          'Kosmische Strahlen sind Stückchen von Atomen, die aus dem Weltall kommen, schneller als alles auf der Erde. Wenn einer hoch über uns in die Luft kracht, etwa so hoch, wie Flugzeuge fliegen, und noch höher, schlägt er Neutronen aus den Atomen der Luft. Ein Neutron, das ein Stickstoffatom trifft, verwandelt es in Kohlenstoff-14.',
          'Kohlenstoff-14 verbindet sich mit Sauerstoff zu Kohlenstoffdioxid, genau wie gewöhnlicher Kohlenstoff. Pflanzen nehmen es auf, Tiere fressen die Pflanzen, und wir essen beides. Darum hat alles Lebendige einen winzigen Anteil Kohlenstoff-14: etwa 1,2 Atome in jeder Billion Kohlenstoffatome. Wäre jedes Kohlenstoffatom ein Sandkorn von einem Millimeter, dann steckte in einem Sandhaufen so groß wie ein Haus nur etwa ein Korn Kohlenstoff-14.',
        ],
        sci: [
          'Die primäre kosmische Strahlung, meist Protonen, zertrümmert Kerne der oberen Atmosphäre und setzt Neutronen frei; durch Stöße abgebremst, werden sie von Stickstoff eingefangen: n + ¹⁴N → ¹⁴C + p. Am meisten entsteht in etwa 9 bis 15 km Höhe und in hohen geomagnetischen Breiten: Modelle ergeben etwa 1,6 bis 1,9 Atome pro Quadratzentimeter Erdoberfläche und Sekunde.',
          '¹⁴C oxidiert zu ¹⁴CO₂ und verteilt sich in Atmosphäre und Ozeanen; Photosynthese und Nahrungsketten geben jedem Lebewesen das Verhältnis der Luft, ¹⁴C/¹²C ≈ 1,2 × 10⁻¹². Der Fluss der kosmischen Strahlung ändert sich mit der Aktivität der Sonne und dem Magnetfeld der Erde, deshalb war dieses Verhältnis nicht immer gleich: daher die Kalibrierung (siehe Labor).',
        ],
      },
    },
    dig: {
      label: 'Der Grabungsschnitt',
      title: 'Hinab durch die Zeit graben',
      finds: {
        linen: { name: 'Ein Stück Leinen', short: 'Leinen' },
        bowl: { name: 'Eine Holzschale', short: 'Schale' },
        bone: { name: 'Ein Hirschknochen', short: 'Knochen' },
        hearth: { name: 'Holzkohle aus einer Feuerstelle', short: 'Holzkohle' },
      },
      hints: { tap: 'Tippe auf einen Fund, um ihn auszugraben', lab: 'Jetzt im Zelt datieren', more: 'Tippe auf den nächsten Fund, um ihn auszugraben', done: 'Alles ausgegraben, tippe auf die Schaufel für eine neue Grabung' },
      buttons: { linen: 'Das Leinen ausgraben', bowl: 'Die Schale ausgraben', bone: 'Den Knochen ausgraben', hearth: 'Die Holzkohle ausgraben', again: 'Eine neue Grabung' },
      says: {
        linen: { kid: 'Ein Stück Leinenstoff, gewebt aus Flachs. Die Flachspflanzen haben beim Wachsen Kohlenstoff-14 aus der Luft aufgenommen. Ab ins Labor im Zelt!', sci: 'Leinen: Cellulose aus Flachs. Ein Gewebe datiert die Saison, in der seine Pflanzen geerntet wurden; für AMS reichen wenige Milligramm. Ab ins Labor.' },
        bowl: { kid: 'Eine Holzschale, vor langer Zeit geschnitzt. Das Holz enthält noch das Kohlenstoff-14, das der Baum aufgenommen hat. Ab ins Labor!', sci: 'Geschnitztes Holz datiert das Wachstum seiner Jahresringe, nicht das Schnitzen: Das Kernholz eines alten Baumes kann Jahrhunderte älter sein als die Schale (das Altholzproblem). Ab ins Labor.' },
        bone: { kid: 'Ein Hirschknochen! Dieser Hirsch bekam sein Kohlenstoff-14 aus den Blättern, die er fraß, wie der Hirsch unter der Eiche. Ab ins Labor!', sci: 'Knochen wird an seinem Kollagen datiert, das herausgelöst und gereinigt wird; dessen Kohlenstoff stammt aus dem Futter des Hirsches, also aus der Luft seiner Lebenszeit. Ab ins Labor.' },
        hearth: { kid: 'Holzkohle aus einem Lagerfeuer, am tiefsten von allem, also wohl am ältesten. Holzkohle ist fast reiner Kohlenstoff: perfekt für die Uhr. Ab ins Labor!', sci: 'Holzkohle: fast reiner Kohlenstoff, chemisch robust, die häufigste Radiokarbonprobe. Eine Wäsche mit Säure, Lauge und Säure entfernt Carbonate und Huminsäuren, die jüngeren Kohlenstoff einschleppen würden. Ab ins Labor.' },
        again: { kid: 'Eine neue Grabung! Die Funde liegen wieder in ihren Schichten und warten.', sci: 'Zurückgesetzt: jeder Fund wieder in seiner Schicht.' },
      },
      panel: {
        kid: [
          'Archäologen graben langsam, Schicht für Schicht, mit kleinen Kellen und Pinseln. Jede Erdschicht hat sich auf die vorige gelegt, darum reist du umso weiter in die Vergangenheit, je tiefer du gräbst.',
          'Diese vier Funde sind für diese Grabung erfundene Beispiele, aber genau solche Dinge werden jeden Tag datiert: Stoff, Holz, Knochen und Holzkohle. Jedes war einmal Teil von etwas Lebendigem, darum steckt in jedem eine Kohlenstoff-14-Uhr. Tippe auf einen, um ihn auszugraben; er kommt ins Labor im Zelt.',
        ],
        sci: [
          'Stratigrafie: In ungestörten Ablagerungen ist jede Schicht jünger als die darunter (Nicolaus Stenos Lagerungsgesetz, 1669). Ausgräber halten Schicht und Lage jedes Fundes fest und datieren dann Proben aus den Schichten, um die Abfolge in Jahre zu verwandeln.',
          'Die vier Funde sind erfundene Beispiele für die üblichen Materialien: Gewebe, Holz, Knochenkollagen und Holzkohle. Datieren lässt sich alles, was zu Lebzeiten seinen Kohlenstoff aus der Luft nahm. Muscheln und Fische aus Seen brauchen Vorsicht: Ihr Kohlenstoff stammt aus Wasser, das älteren Kohlenstoff enthalten kann (der Reservoireffekt).',
        ],
      },
    },
    lab: {
      label: 'Das Datierungslabor',
      title: 'Kohlenstoff-14 zählen',
      sign: 'Datierung',
      hints: { date: 'Tippe auf die Maschine, um das Kohlenstoff-14 zu zählen', counting: 'Die Atome werden gezählt', none: 'Grab zuerst einen Fund im Schnitt aus', rings: 'Tippe auf die Baumscheibe, um zu sehen warum', done: 'Lies die Uhr auf der Tafel' },
      buttons: { date: 'Kohlenstoff-14 zählen', rings: 'Die Baumringe' },
      screen: {
        title: 'Kohlenstoff-14-Zähler',
        ready: 'Leg einen Fund ein',
        counting: 'Zähle...',
        left: { kid: 'noch {pct}% Kohlenstoff-14', sci: '{pct}% des heutigen C-14' },
        years: { kid: 'etwa {age} Jahre alt', sci: '{age} ± {err} Jahre' },
      },
      board: { title: 'Die Kohlenstoff-14-Uhr', left: 'Kohlenstoff-14 übrig', years: 'Jahre', alive: 'lebend', half: 'Halbwertszeit' },
      says: {
        counting: { kid: 'Hinein kommt ein winziges Stück! Die Maschine macht daraus einen Strahl und zählt die Kohlenstoff-14-Atome, eins nach dem anderen.', sci: 'AMS: Die Probe, verbrannt und zu Graphit gemacht, wird zu einem Strahl negativer Ionen zerstäubt; der Beschleuniger streift ihnen Elektronen ab und zerbricht so Moleküle gleicher Masse, und Magnete trennen ¹⁴C von ¹²C und ¹³C, damit es Atom für Atom gezählt wird.' },
        linen: { kid: 'Drei Viertel des Kohlenstoff-14 sind noch da: etwa 2380 Jahre alt. Menschen der Eisenzeit haben diesen Stoff gewebt.', sci: '75,0% des heutigen ¹⁴C: 8267 · ln(1/0,75) = 2380 ± 25 Jahre, mit t½ = 5730 Jahren (nicht kalibriert).' },
        bowl: { kid: 'Die Hälfte ist noch da: eine Halbwertszeit, also etwa 5730 Jahre alt! Geschnitzt zur Zeit der ersten Bauern.', sci: '50,0% des heutigen: eine Halbwertszeit, 5730 ± 30 Jahre.' },
        bone: { kid: 'Ein Viertel ist noch da: zwei Halbwertszeiten, etwa 11 460 Jahre. Das ist nahe am Ende der letzten Eiszeit.', sci: '25,0% des heutigen: zwei Halbwertszeiten, 11 460 ± 45 Jahre.' },
        hearth: { kid: 'Nur noch 1,6%, nach sechs Halbwertszeiten: etwa 34 380 Jahre! Eiszeitjäger saßen an diesem Feuer, als es noch Mammuts gab.', sci: '1,56% des heutigen: sechs Halbwertszeiten, 34 380 ± 450 Jahre. Ein paar Atome von hundert: So weit reicht nur das Zählen der Atome.' },
        rings: { kid: 'Jeder Ring ist ein Jahr im Leben des Baumes. Forscher haben das Kohlenstoff-14 in Ringen gemessen, deren Jahr sie kannten, zurück bis vor etwa 14 000 Jahren, und herausgefunden, dass die Luft nicht immer gleich viel davon hatte. Darum wird jedes Kohlenstoff-14-Alter mit Hilfe der Baumringe korrigiert.', sci: 'Kalibrierung: Jahr für Jahr datierte Baumringe liefern ¹⁴C gegen das Kalenderalter. IntCal20 (2020) beruht auf Baumringen bis 13 910 Jahre vor 1950, davor auf Seesedimenten, Tropfsteinen und Korallen bis 55 000 Jahre.' },
        nothing: { kid: 'Noch nichts zu zählen: Grab zuerst einen Fund im Schnitt aus.', sci: 'Keine Probe im Labor: Grab zuerst eine aus.' },
      },
      found: 'Hier datiert',
      panel: {
        kid: [
          'Willard Libby hat die Kohlenstoff-14-Uhr Ende der 1940er-Jahre in Chicago erfunden und 1960 den Nobelpreis für Chemie bekommen. Er hat sie an Holz aus den Gräbern ägyptischer Könige getestet, deren Alter man aus der Geschichte kannte, und sie hat funktioniert.',
          'Heute zählt eine Maschine mit einem Teilchenbeschleuniger die Kohlenstoff-14-Atome selbst, eins nach dem anderen, in einem Krümel Kohlenstoff, kleiner als ein Reiskorn. Sie kann Dinge bis etwa 50 000 Jahre datieren; danach ist zu wenig übrig. Echte Funde reisen in ein Labor wie dieses; unsere Grabung hat ihres im Zelt.',
        ],
        sci: [
          'Willard Libbys Gruppe an der Universität Chicago veröffentlichte 1949 die ersten Radiokarbondaten, geprüft an Holz bekannten Alters aus den ägyptischen Gräbern von Djoser und Snofru; Libby erhielt 1960 den Nobelpreis für Chemie. Alter = (5730 / ln 2) · ln(N₀/N) ≈ 8267 · ln(N₀/N) Jahre.',
          'Libby zählte Zerfälle und brauchte Gramm von Kohlenstoff. Seit 1977 zählt die Beschleuniger-Massenspektrometrie die ¹⁴C-Atome selbst, in etwa einem Milligramm; Stickstoff-14 bildet keine negativen Ionen und kann darum nicht mit ¹⁴C verwechselt werden. Die Grenze liegt bei etwa 50 000 Jahren, wenn noch etwa 0,2% übrig sind.',
          'Vereinbarungsgemäß geben Labore ein konventionelles Radiokarbonalter mit Libbys Halbwertszeit von 5568 Jahren an und kalibrieren es dann: Das ¹⁴C der Luft änderte sich mit der Sonne, dem Erdmagnetfeld und dem Kohlenstoffkreislauf, deshalb werden Alter mit der Kurve IntCal20, gebaut aus Baumringen, in Kalenderjahre umgerechnet. Die Alter hier verwenden 5730 Jahre und sind nicht kalibriert.',
        ],
      },
    },
    jar: {
      label: 'Die Atom-Sanduhr',
      title: 'Halbwertszeit: die Atom-Sanduhr',
      hints: { run: 'Tippe auf die Sanduhr, damit die Zeit läuft', stop: 'Tippe auf die Sanduhr, um die Zeit anzuhalten', again: 'Tippe auf den Hebel für 128 neue Atome' },
      buttons: { run: 'Zeit laufen lassen', stop: 'Anhalten', half: 'Eine Halbwertszeit', again: 'Neue Atome' },
      slider: 'Zeit',
      kyears: 'Tausend Jahre',
      board: { years: 'Jahre', c14: 'Kohlenstoff-14', n14: 'Stickstoff-14', runs: 'Nach 5730 Jahren' },
      says: {
        start: { kid: 'Die Zeit läuft! Schau auf die leuchtenden Kohlenstoff-14-Atome: Niemand weiß, welches als Nächstes zu Stickstoff wird.', sci: 'Jeder Kern hat in jedem Augenblick dieselbe Chance zu zerfallen, egal wie alt er ist; welcher als Nächstes zerfällt, ist reiner Zufall.' },
        half: { kid: n => `5730 Jahre, eine Halbwertszeit. Kohlenstoff-14 übrig: ${n} von 128. Ungefähr die Hälfte, aber nicht genau 64!`, sci: n => `t = t½ = 5730 Jahre: N = ${n} von N₀ = 128 (erwartet 64, Standardabweichung etwa 5,7).` },
        quarter: { kid: n => `Zwei Halbwertszeiten. Übrig: ${n}, ungefähr ein Viertel.`, sci: n => `t = 2 t½: N = ${n} (erwartet 32 ± 4,9).` },
        end: { kid: n => `40 000 Jahre, etwa sieben Halbwertszeiten. Übrig: ${n}. Fast alle sind weg, und deshalb endet die Radiokarbondatierung bei etwa 50 000 Jahren.`, sci: n => `t = 40 000 Jahre ≈ 7 t½: N = ${n} (erwartet 1,0).` },
        again: { kid: 'Neue Atome! Lass die Zeit noch einmal laufen und schau, wie viele diesmal nach 5730 Jahren übrig sind.', sci: 'Ein neuer Satz von 128 Kernen, mit neuen zufälligen Zerfallszeiten.' },
        compare: { kid: (n, b) => `Diesmal ${n} nach 5730 Jahren, letztes Mal ${b}. Immer nah an der Hälfte, nie sicher: Jedes Atom zerfällt zufällig.`, sci: (n, b) => `Bei t½: ${n} in diesem Lauf, ${b} im letzten. Die Anzahl ist binomialverteilt (p = ½), nicht genau N₀/2.` },
      },
      panel: {
        kid: [
          'Jede leuchtende Perle ist ein Kohlenstoff-14-Atom. Niemand kann sagen, wann eines davon zu Stickstoff wird: Es passiert zufällig. Wenn es passiert, schießt es ein Elektron hinaus, wird zu Stickstoff-14 und fällt hier auf den Boden der Sanduhr.',
          'Aber eine Menge Atome hält die Zeit sehr gut: Nach 5730 Jahren ist etwa die Hälfte übrig, nach doppelt so langer Zeit etwa ein Viertel, dann ein Achtel. Tippe auf den Hebel für neue Atome: Die Zahl nach 5730 Jahren ist nie genau die Hälfte, aber immer nah dran. Ein echter Knochen hat Milliarden Kohlenstoff-14-Atome, dort gleicht sich der Zufall fast perfekt aus.',
        ],
        sci: [
          'Radioaktiver Zerfall ist zufällig: Jeder ¹⁴C-Kern hat in jedem Moment dieselbe Chance zu zerfallen, egal wie lange er schon existiert. Es ist ein Beta-minus-Zerfall, ¹⁴C → ¹⁴N + e⁻ + ν̄ₑ, mit bis zu 156 keV. Mit λ = ln 2 / t½: N(t) = N₀ · e^(−λt) = N₀ · 2^(−t/t½).',
          'Mit nur 128 Kernen streut die Zahl: Bei einer Halbwertszeit hat der Erwartungswert 64 eine Standardabweichung von etwa 5,7. Ein Gramm heutiger Kohlenstoff enthält etwa 6 × 10¹⁰ ¹⁴C-Atome, in echten Proben ist diese Streuung also vernachlässigbar; ein Datum begrenzt vielmehr, wie viele Atome das Gerät zählt. Halbwertszeit 5730 ± 40 Jahre (Godwin, 1962); neuere Messungen ergeben 5700 ± 30.',
        ],
      },
    },
  },
}
