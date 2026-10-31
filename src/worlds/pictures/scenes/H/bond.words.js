// The words of hydrogen's pond ("Why can an insect walk on water?"), in English, European Portuguese, Polish
// and German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/H.js
// (the easel shows it). Each step is done by tapping its thing: `hints` are what the prompt shows as the next
// step, `verbs` the panels' buttons that do the same; `signs` are drawn in 3D (plain text: no subscripts).
// Sources: surface tension of water, IAPWS R1-76(2014): 75.6 mN/m at 0 °C, 72.0 at 25 °C, 58.9 at 100 °C;
// soapy water about 25 to 30 mN/m; ethanol 22, mercury about 485 mN/m (20 to 25 °C). Water striders' legs:
// Gao and Jiang, Nature 432, 36 (2004): contact angle about 167°, one leg bears about 15 times the insect's
// weight, a dimple about 4.4 mm deep before it breaks through (the insect about 10 mg). Their rowing middle
// legs: Hu, Chan and Bush, Nature 424, 663 (2003). Capillary length of water √(γ/ρg) ≈ 2.7 mm. Hydrogen bond
// about 20 kJ/mol. Trees: the cohesion-tension theory (Dixon and Joly, 1894 to 1895); Koch, Sillett,
// Jennings and Davis, Nature 428, 851 (2004): maximum tree height 122 to 130 m; Hyperion, a coast redwood
// in Redwood National Park, found in 2006, about 116 m; a suction pump lifts water at most about 10.3 m.
// Boiling points at 1 atm: H2O 100 °C, H2S −60 °C, H2Se −41 °C, H2Te −2 °C; CH4 −161.5, SiH4 −111.9,
// GeH4 −88.5, SnH4 −52 °C; the trend of H2Se and H2S carried on to H2O about −80 °C (sources give −80 to
// −100 °C); heat of vaporisation of water 40.7 kJ/mol at 100 °C.
const EN = {
  title: "The pond skater's pond",
  greet: {
    kid: "Hi! I'm hydrogen. You have shrunk to the size of an ant, on a pond at dusk: everything here is about 200 times bigger than real. The water has a skin, and that skin is made of my little tugs, the hydrogen bonds. Try the pond skater and the floating paper clip, the giant molecules, the tall tree and the lever. The picture's story is on the easel.",
    sci: "Welcome. A pond at dusk, everything about 200 times life size. Water's surface tension, about 72 mN/m, comes from hydrogen bonds (O-H···O, about 20 kJ/mol each). Four things to try: the skater and a floating clip, a slice of the surface at molecular scale, a redwood's water column, and water without its hydrogen bonds. The picture's story is on the easel.",
  },
  talk: {
    kid: [
      "I float above the pond: I'm the lightest gas of all. But the pond skater stands right on the water, and at this size you could too!",
      'Look at the drops on the lily pad: they stay round. Water molecules pull on each other so hard that a small drop pulls itself into a ball.',
      'Every water molecule has two of me. Each of my hydrogens holds its own oxygen tight and gives a little tug to the oxygen next door.',
    ],
    sci: [
      'Surface tension is energy per area as well as force per length: about 72 mJ to make 1 m² of new water surface at 25 °C, the same as 72 mN of pull along every metre of edge.',
      "Water's capillary length, √(γ/ρg), is about 2.7 mm: the size of the dimples round a skater's feet, and why drops smaller than that stay round on a waxy leaf.",
      'In liquid water each molecule has between three and four hydrogen bonds at any moment, and each one lasts only picoseconds before it breaks and another forms.',
    ],
  },
  skin: {
    label: 'The skin of the water',
    title: 'Standing on water',
    sand: 'Sand on the clip',
    lens: { air: 'air', water: 'water', hairs: 'hairs', pull: 'the skin pulls', weight: 'weight' },
    signs: { sand: 'sand', soap: 'soap', clip: 'paper clip', thread: 'cotton thread', weight: 'weight', hold: 'what the skin holds' },
    verbs: { pour: 'Pour some sand', soap: 'Drop the soap', fish: 'Fish the clip out', front: 'Front leg', middle: 'Middle leg', hind: 'Hind leg' },
    hints: { leg: 'Tap a leg of the pond skater', pour: 'Tap the funnel to pour sand', more: 'Tap the funnel or the soap dropper', fish: 'Tap the sunken clip', watch: 'Watch' },
    rows: { clean: 'Clean water, 25 °C', soapy: 'Soapy water', soapyValue: 'about 25 to 30 mN/m', load: 'Weight against what the skin holds' },
    says: {
      front: {
        kid: 'A front leg: short and strong, for grabbing tiny insects that fall on the water. It hardly dents the skin.',
        sci: 'Front legs: short, for seizing prey trapped on the surface. They carry little weight, so their dimples are shallow.',
      },
      middle: {
        kid: "A middle leg, the longest. The skater rows with these to shoot forward. Look in the lens: the hairs hold a cushion of air, so the water can't wet the foot.",
        sci: 'Middle legs: the longest, and the oars. Their hairs (thousands of waxy microsetae) trap air, and water meets them at about 167°, so they never wet.',
      },
      hind: {
        kid: 'A hind leg, for steering and braking like a rudder. Its foot rests in its own little dimple.',
        sci: "Hind legs: rudder and brake. The six feet share the insect's weight along several centimetres of contact line, so each dimple stays shallow.",
      },
      pour: { kid: 'Sand trickles onto the clip. Look: the dimple under it gets deeper.', sci: "Sand added: the clip's load rises and the meniscus round it deepens to carry it." },
      deeper: { kid: 'More sand! The skin stretches further down. How much more can it take?', sci: 'The dimple deepens: the surface along the clip tilts more steeply to push up harder.' },
      heavy: { kid: "Oh! I think that's too much...", sci: 'Past what the surface can carry...' },
      sink: {
        kid: 'Plop! The skin tore and the clip sank. The skin can hold a lot, but not everything.',
        sci: 'The meniscus could tilt no further: the surface broke and the clip sank (steel is about 7.9 times denser than water).',
      },
      soap: {
        kid: 'The soap spread inside the loop. The clean water outside pulled the thread into a circle, and the soapy skin was too weak to hold the clip. Down it went! The pond skater, outside the loop, is fine.',
        sci: 'Soap lowered the surface tension inside the loop to about 25 to 30 mN/m and let the water wet the steel. The stronger pull of the clean surface outside drew the thread into a circle, and the weakened surface let the clip through.',
      },
      soapAgain: { kid: 'The soap is already in. Fish the clip out first.', sci: 'Already soapy: fish the clip out for fresh water.' },
      sunkFirst: { kid: 'The clip has sunk. Tap it under the water to fish it out first.', sci: 'The clip is down: fish it out first.' },
      floats: { kid: "The clip floats on the water's skin, even though it is made of steel!", sci: 'Floating: held by surface tension along its contact line, not by buoyancy.' },
      fish: { kid: 'Fished out and dried! It floats again, on fresh, clean water.', sci: 'Clip retrieved and dried, fresh water in the loop.' },
    },
    panel: {
      kid: [
        "The pond skater does not float like a boat: it stands on the water's skin. The water molecules at the top pull on each other and hold together like a stretched sheet, and the skater's feet only press little dimples into it. Its legs are covered in tiny hairs that trap air, so the water cannot wet them. Tap a leg to look at its dimple.",
        'Now the paper clip: steel is much heavier than water, yet the skin holds it up. Pour sand on it and the dimple deepens until the skin tears. Or drop in some soap: soap weakens the skin and the clip sinks at once. The thread shows it too, as the clean water outside pulls the loop into a circle.',
      ],
      sci: [
        'A pond skater of the genus Gerris weighs about 10 mg and spreads it over long legs whose hairs, thousands of waxy microsetae, trap air: water meets them at a contact angle of about 167°. One leg can press a dimple about 4 mm deep and bear about 15 times the insect\'s weight before it breaks through (Gao and Jiang, Nature, 2004). It rows with its middle legs.',
        'A floating object is held along its edge by at most γ = 72 mN for every metre of contact line, pulling along the tilted surface: so a steel clip floats although steel is 7.9 times denser than water. Each grain deepens the dimple until the surface can tilt no further. Soap crowds into the surface, lowers γ to about 25 to 30 mN/m and lets water wet the steel: the clip sinks. The thread becomes a circle because the clean surface outside pulls harder than the soapy one inside.',
      ],
    },
  },
  pull: {
    label: 'Every molecule pulled',
    title: 'Why water has a skin',
    temp: 'Temperature of the water',
    rows: {
      gamma: 'Surface tension',
      bonds: 'Bonds breaking and re-forming',
      speed: {
        slow: { kid: 'slowly', sci: 'least often (cold)' },
        mid: { kid: 'faster', sci: 'more often' },
        fast: { kid: 'very fast', sci: 'most often (hot)' },
      },
    },
    signs: {
      air: 'air',
      water: 'water',
      surface: 'the surface',
      scale: 'water molecules, about 3 billion times bigger',
      foot: "a skater's foot (not to scale)",
      gammaSci: '{g} mN/m at {t} °C',
      gammaKid: 'skin strength {g} at {t} °C',
    },
    verbs: { inside: 'A molecule inside', surface: 'A molecule on top', press: 'Press the foot down', lift: 'Lift the foot' },
    hints: { inside: 'Tap a molecule deep inside', surface: 'Now tap one on the top', foot: "Tap the skater's foot", any: 'Tap a molecule or the foot' },
    says: {
      inside: {
        kid: 'This one is deep inside. It holds on to four neighbours (the glowing dashes), and they pull it equally in every direction, so all the pulls cancel out.',
        sci: 'Inside the liquid each molecule has neighbours all round: up to four hydrogen bonds, two from its hydrogens and two to its lone pairs, pulling in a tetrahedron. The forces cancel: no net pull.',
      },
      surface: {
        kid: 'This one is on top. It has neighbours beside it and below it, but none above, only air. So it is pulled down into the water. All the top molecules are pulled in like this, and together they make the skin!',
        sci: 'At the surface, neighbours lie only beside and below: the pulls no longer cancel and leave a net force inward. Bringing a molecule to the surface costs energy, so the liquid keeps its surface as small as it can: that is surface tension.',
      },
      press: {
        kid: 'The foot presses down: the top layers bend, but the hydrogen bonds hold, like a trampoline.',
        sci: 'Under load the surface bends into a dimple; the bonds stretch and tilt rather than break. (One hair of a real foot is thousands of molecules wide: not to scale.)',
      },
      lift: { kid: 'The foot lifts, and the skin springs back flat.', sci: 'Unloaded, the surface relaxes flat: the smallest area.' },
      warm: {
        kid: '{t} °C: warm molecules jiggle harder, their bonds break more often, and the skin gets weaker: {g} mN/m.',
        sci: '{t} °C: more thermal motion, shorter-lived hydrogen bonds: σ = {g} mN/m.',
      },
      cold: { kid: '{t} °C: cold molecules move slowly and hold on tight. A strong skin: {g} mN/m.', sci: '{t} °C: σ = {g} mN/m, near its highest for liquid water.' },
      mild: { kid: "{t} °C: the skin's strength is {g} mN/m.", sci: '{t} °C: σ = {g} mN/m.' },
    },
    panel: {
      kid: [
        'Here the top of the pond is magnified about 3 billion times: red oxygens, white hydrogens, and the glowing dashes are hydrogen bonds, each hydrogen tugging at the oxygen of a neighbour. Tap a molecule deep inside, then one on the top, and compare their pulls.',
        'Slide the temperature: warmer molecules jiggle more, their hydrogen bonds break and re-form faster, and the skin gets weaker. Even boiling water still has a skin, just a weaker one. Tap the foot to press on the skin.',
      ],
      sci: [
        'A slice of the surface, neighbouring oxygens 0.8 m apart here for 2.8 Å (about 3 × 10⁹ times). Each molecule can donate two hydrogen bonds and accept two, about 20 kJ/mol each; in the liquid they break and re-form within picoseconds (shown here about 10¹² times slower). Inside, the pulls cancel; at the surface they leave a net inward force.',
        'Surface tension is the energy of new surface per unit area, or the force along it per unit length: 75.6 mN/m at 0 °C, 72.0 at 25 °C, 58.9 at 100 °C (IAPWS), among the highest of common liquids (ethanol 22, mercury about 485). Warmer, the molecules carry more thermal energy, fewer bonds hold at any moment, and σ falls.',
      ],
    },
  },
  drink: {
    label: 'The tallest drink',
    title: 'Water to the top of a tree',
    height: 'Height of the tree',
    rows: { height: 'Height', pull: 'Pull needed at the top, just to hold the water up', atm: 'That is', atmValue: "{n} times the air's pressure" },
    signs: { model: 'a coast redwood (model)', sun: 'sun', m: '{n} m', limit: 'the limit', hyperion: 'Hyperion 116 m', pump: 'a pump: 10 m' },
    verbs: { sun: 'Let the sun shine', hyperion: 'As tall as Hyperion' },
    hints: { watch: 'Watch the water climb', broken: 'Tap the ruler lower down', sun: 'Tap the sun', any: 'Tap the sun or the ruler' },
    says: {
      drink: {
        kid: 'The sun warms the leaves and they breathe out water. Each molecule that leaves pulls the next one up behind it, because they hold on with hydrogen bonds. The whole thread moves up one step, from the roots to the top!',
        sci: 'Transpiration: water evaporates from the leaves and the column behind it comes under tension. Held together by hydrogen bonds (cohesion) and to the vessel walls (adhesion), it rises as one: the cohesion-tension theory of Dixon and Joly, 1894.',
      },
      step: { kid: 'Another sip! One more step up for the whole thread.', sci: 'Another step: the column moves as a whole.' },
      noDrink: {
        kid: "The leaves are thirsty, but a bubble has broken the thread: the water can't be pulled past it. Make the tree shorter.",
        sci: 'The column has cavitated: an air bubble (an embolism) breaks it, and tension can no longer pull water across the gap.',
      },
      broken: { kid: 'Too tall! The pull at the top is so strong that the thread can snap and a bubble of air gets in.', sci: 'Beyond about 130 m the tension needed is past what the leaves can live with, and the columns risk breaking by cavitation.' },
      thirsty: {
        kid: 'Taller than about 122 m, the leaves at the top hardly get any water: they turn pale and stop growing.',
        sci: '122 to 130 m: the predicted maximum height (Koch and colleagues, Nature, 2004). At the top, water stress stops leaves growing and slows photosynthesis.',
      },
      hyperion: {
        kid: 'This is about as tall as Hyperion, a coast redwood in California: about 116 m, the tallest living tree we know!',
        sci: 'Hyperion, a coast redwood (Sequoia sempervirens) in Redwood National Park, found in 2006: about 116 m, the tallest known living tree.',
      },
      lower: { kid: 'A shorter tree: an easy drink.', sci: 'A lower tree: less tension needed at the top.' },
    },
    panel: {
      kid: [
        'A tree has no pump. The sun warms its leaves and they breathe out water vapour; each water molecule that leaves pulls the next one up, and that one the next, all the way down to the roots. The water hangs together in one long thread, held by hydrogen bonds.',
        'A pump that sucks can lift water only about 10 m. A tree pulls it more than ten times higher! Slide the height or tap the ruler: past about 122 to 130 m the pull would be too much, and that is about as tall as the tallest trees grow.',
      ],
      sci: [
        'Holding up a column h metres high takes a tension of ρgh at its top: about 0.01 MPa per metre, 1.1 MPa for 116 m, eleven times the pressure of the air, and the flow through the wood needs more. Water can bear such tension only because hydrogen bonds hold it together; a suction pump, pushed by the air, stops at about 10.3 m.',
        'Koch, Sillett, Jennings and Davis climbed the tallest redwoods and measured their leaves\' water stress rising with height. They predicted a maximum tree height of 122 to 130 m (Nature, 2004): above it, leaves would be too short of water to grow, and the stretched columns would risk breaking. The tallest measured, Hyperion, is about 116 m.',
      ],
    },
  },
  whatif: {
    label: 'What if?',
    title: 'Water without hydrogen bonds',
    signs: { chart: 'Boiling point', about: 'about −80 °C', far: 'far below zero', pond: 'the pond tonight, about 20 °C', jar: 'pond water', on: 'hydrogen bonds: ON', off: 'hydrogen bonds: OFF' },
    verbs: { off: 'Switch the hydrogen bonds off', on: 'Switch them back on' },
    hints: { off: 'Tap the lever', on: 'Tap the lever again' },
    rows: { trend: 'H₂O by the trend', trendValue: 'about −80 °C' },
    says: {
      off: {
        kid: 'What if water had no hydrogen bonds? It would boil far below zero, like its cousin hydrogen sulfide. The pond is much warmer than that, so it boils away into steam! No seas, no ponds, no pond skaters.',
        sci: "Without hydrogen bonds, water's boiling point would follow its heavier cousins H₂Te, H₂Se and H₂S down to about −80 °C. At 20 °C the pond would be a hundred degrees above it, and turn to vapour.",
      },
      on: {
        kid: 'Phew! Hydrogen bonds back on: the steam turns back into water, and the pond is a pond again.',
        sci: 'Hydrogen bonds restored: boiling point 100 °C at 1 atm, and the vapour condenses.',
      },
    },
    panel: {
      kid: [
        "This lever does something impossible, just to see: it switches water's hydrogen bonds off. Water's cousins, made of hydrogen with sulfur, selenium or tellurium (the elements below oxygen), have no strong hydrogen bonds, and they are all gases on a warm day.",
        "Follow their dots on the chart to water's place: water should boil far below zero. Instead it boils at 100 °C, because its molecules hold on to each other. That's why the Earth has seas, and why you and the pond skater are here.",
      ],
      sci: [
        'Boiling points at 1 atm: H₂Te −2 °C, H₂Se −41 °C, H₂S −60 °C. Lighter molecules have weaker dispersion forces, so the trend falls towards the top of the group, to about −80 °C for H₂O. Water boils at 100 °C instead: each molecule must break free of its hydrogen bonds.',
        'The group 14 hydrides (grey: CH₄, SiH₄, GeH₄, SnH₄) form no hydrogen bonds and fall smoothly to methane at −161.5 °C. NH₃ and HF break their trends in the same way, less strongly. Water\'s high boiling point, its heat of vaporisation (40.7 kJ/mol at 100 °C) and its heat capacity keep the oceans liquid.',
      ],
    },
  },
}

const PT = {
  title: 'O lago do alfaiate',
  greet: {
    kid: 'Olá! Eu sou o hidrogénio. Encolheste até ao tamanho de uma formiga, num lago ao anoitecer: aqui tudo é cerca de 200 vezes maior do que na realidade. A água tem uma pele, e essa pele é feita dos meus pequenos puxões, as ligações de hidrogénio. Experimenta o alfaiate e o clipe a flutuar, as moléculas gigantes, a árvore alta e a alavanca. A história da imagem está no cavalete.',
    sci: 'Bem-vindo. Um lago ao anoitecer, tudo cerca de 200 vezes maior do que o real. A tensão superficial da água, cerca de 72 mN/m, vem das ligações de hidrogénio (O-H···O, cerca de 20 kJ/mol cada). Quatro coisas para experimentar: o alfaiate e um clipe a flutuar, uma fatia da superfície à escala molecular, a coluna de água de uma sequoia e a água sem as suas ligações de hidrogénio. A história da imagem está no cavalete.',
  },
  talk: {
    kid: [
      'Eu flutuo por cima do lago: sou o gás mais leve de todos. Mas o alfaiate está mesmo em cima da água, e com este tamanho tu também podias estar!',
      'Olha para as gotas na folha do nenúfar: ficam redondas. As moléculas de água puxam-se umas às outras com tanta força que uma gota pequena se puxa a si própria até ficar uma bola.',
      'Cada molécula de água tem dois de mim. Cada um dos meus hidrogénios agarra bem o seu oxigénio e dá um pequeno puxão ao oxigénio do lado.',
    ],
    sci: [
      'A tensão superficial é energia por área e também força por comprimento: cerca de 72 mJ para criar 1 m² de nova superfície de água a 25 °C, o mesmo que 72 mN de puxão ao longo de cada metro de bordo.',
      'O comprimento capilar da água, √(γ/ρg), é cerca de 2,7 mm: o tamanho das covinhas à volta das patas de um alfaiate, e a razão por que as gotas mais pequenas do que isso ficam redondas numa folha cerosa.',
      'Na água líquida cada molécula tem, em cada momento, entre três e quatro ligações de hidrogénio, e cada uma dura apenas picossegundos antes de se quebrar e se formar outra.',
    ],
  },
  skin: {
    label: 'A pele da água',
    title: 'De pé sobre a água',
    sand: 'Areia no clipe',
    lens: { air: 'ar', water: 'água', hairs: 'pelos', pull: 'a pele puxa', weight: 'peso' },
    signs: { sand: 'areia', soap: 'sabão', clip: 'clipe', thread: 'linha de algodão', weight: 'peso', hold: 'o que a pele aguenta' },
    verbs: { pour: 'Deita areia', soap: 'Deixa cair o sabão', fish: 'Tira o clipe', front: 'Pata da frente', middle: 'Pata do meio', hind: 'Pata de trás' },
    hints: { leg: 'Toca numa pata do alfaiate', pour: 'Toca no funil para deitar areia', more: 'Toca no funil ou no conta-gotas do sabão', fish: 'Toca no clipe afundado', watch: 'Observa' },
    rows: { clean: 'Água limpa, 25 °C', soapy: 'Água com sabão', soapyValue: 'cerca de 25 a 30 mN/m', load: 'Peso face ao que a pele aguenta' },
    says: {
      front: {
        kid: 'Uma pata da frente: curta e forte, para agarrar pequenos insetos que caem na água. Quase não amolga a pele.',
        sci: 'Patas da frente: curtas, para apanhar presas caídas na superfície. Levam pouco peso, por isso as suas covinhas são pouco fundas.',
      },
      middle: {
        kid: 'Uma pata do meio, a mais comprida. O alfaiate rema com estas para se lançar para a frente. Olha para a lente: os pelos guardam uma almofada de ar, por isso a água não consegue molhar a pata.',
        sci: 'Patas do meio: as mais compridas, e os remos. Os seus pelos (milhares de microsetas cerosas) prendem ar, e a água toca-lhes com um ângulo de cerca de 167°, por isso nunca se molham.',
      },
      hind: {
        kid: 'Uma pata de trás, para virar e travar, como um leme. A ponta assenta numa covinha só sua.',
        sci: 'Patas de trás: leme e travão. As seis patas repartem o peso do inseto por vários centímetros de linha de contacto, por isso cada covinha fica pouco funda.',
      },
      pour: { kid: 'A areia cai em fio sobre o clipe. Olha: a covinha por baixo dele fica mais funda.', sci: 'Areia acrescentada: a carga do clipe aumenta e o menisco à sua volta afunda para a suportar.' },
      deeper: { kid: 'Mais areia! A pele estica mais para baixo. Quanto mais aguentará?', sci: 'A covinha afunda: a superfície ao longo do clipe inclina-se mais para empurrar com mais força.' },
      heavy: { kid: 'Oh! Acho que é demais...', sci: 'Para lá do que a superfície consegue suportar...' },
      sink: {
        kid: 'Ploc! A pele rasgou-se e o clipe afundou. A pele aguenta muito, mas não tudo.',
        sci: 'O menisco não podia inclinar-se mais: a superfície rompeu-se e o clipe afundou (o aço é cerca de 7,9 vezes mais denso do que a água).',
      },
      soap: {
        kid: 'O sabão espalhou-se dentro do laço. A água limpa lá fora puxou a linha num círculo, e a pele com sabão ficou fraca demais para segurar o clipe. Lá foi ele ao fundo! O alfaiate, fora do laço, está bem.',
        sci: 'O sabão baixou a tensão superficial dentro do laço para cerca de 25 a 30 mN/m e deixou a água molhar o aço. O puxão mais forte da superfície limpa lá fora puxou a linha num círculo, e a superfície enfraquecida deixou passar o clipe.',
      },
      soapAgain: { kid: 'O sabão já lá está. Tira primeiro o clipe.', sci: 'Já tem sabão: tira o clipe para ter água limpa.' },
      sunkFirst: { kid: 'O clipe afundou. Toca nele debaixo de água para o tirar primeiro.', sci: 'O clipe está no fundo: tira-o primeiro.' },
      floats: { kid: 'O clipe flutua na pele da água, apesar de ser de aço!', sci: 'A flutuar: seguro pela tensão superficial ao longo da linha de contacto, não pela impulsão.' },
      fish: { kid: 'Tirado e seco! Flutua outra vez, em água limpa e fresca.', sci: 'Clipe recuperado e seco, água limpa dentro do laço.' },
    },
    panel: {
      kid: [
        'O alfaiate não flutua como um barco: está de pé sobre a pele da água. As moléculas de água de cima puxam-se umas às outras e mantêm-se juntas como um lençol esticado, e as patas do alfaiate só fazem pequenas covinhas nele. As patas estão cobertas de pelinhos que prendem ar, por isso a água não as consegue molhar. Toca numa pata para ver a sua covinha.',
        'Agora o clipe: o aço é muito mais pesado do que a água, e mesmo assim a pele segura-o. Deita-lhe areia e a covinha afunda até a pele se rasgar. Ou deixa cair sabão: o sabão enfraquece a pele e o clipe afunda logo. A linha também o mostra, quando a água limpa lá fora puxa o laço num círculo.',
      ],
      sci: [
        'Um alfaiate do género Gerris pesa cerca de 10 mg e reparte esse peso por patas compridas cujos pelos, milhares de microsetas cerosas, prendem ar: a água toca-lhes com um ângulo de contacto de cerca de 167°. Uma pata consegue fazer uma covinha com cerca de 4 mm de fundo e aguentar cerca de 15 vezes o peso do inseto antes de furar a superfície (Gao e Jiang, Nature, 2004). Rema com as patas do meio.',
        'Um objeto a flutuar é segurado ao longo do seu bordo por, no máximo, γ = 72 mN por cada metro de linha de contacto, a puxar ao longo da superfície inclinada: por isso um clipe de aço flutua, embora o aço seja 7,9 vezes mais denso do que a água. Cada grão afunda a covinha até a superfície não se poder inclinar mais. O sabão junta-se na superfície, baixa γ para cerca de 25 a 30 mN/m e deixa a água molhar o aço: o clipe afunda. A linha fica num círculo porque a superfície limpa lá fora puxa com mais força do que a superfície com sabão lá dentro.',
      ],
    },
  },
  pull: {
    label: 'Cada molécula puxada',
    title: 'Porque é que a água tem pele',
    temp: 'Temperatura da água',
    rows: {
      gamma: 'Tensão superficial',
      bonds: 'Ligações a quebrar-se e a refazer-se',
      speed: {
        slow: { kid: 'devagar', sci: 'com menos frequência (frio)' },
        mid: { kid: 'mais depressa', sci: 'com mais frequência' },
        fast: { kid: 'muito depressa', sci: 'com a maior frequência (quente)' },
      },
    },
    signs: {
      air: 'ar',
      water: 'água',
      surface: 'a superfície',
      scale: 'moléculas de água, cerca de 3 mil milhões de vezes maiores',
      foot: 'uma pata de alfaiate (fora de escala)',
      gammaSci: '{g} mN/m a {t} °C',
      gammaKid: 'força da pele {g} a {t} °C',
    },
    verbs: { inside: 'Uma molécula lá dentro', surface: 'Uma molécula em cima', press: 'Carrega com a pata', lift: 'Levanta a pata' },
    hints: { inside: 'Toca numa molécula bem lá dentro', surface: 'Agora toca numa de cima', foot: 'Toca na pata do alfaiate', any: 'Toca numa molécula ou na pata' },
    says: {
      inside: {
        kid: 'Esta está bem lá dentro. Agarra-se a quatro vizinhas (os tracinhos a brilhar), e elas puxam-na igualmente em todas as direções, por isso os puxões anulam-se.',
        sci: 'Dentro do líquido cada molécula tem vizinhas à volta toda: até quatro ligações de hidrogénio, duas dos seus hidrogénios e duas para os seus pares não partilhados, a puxar num tetraedro. As forças anulam-se: nenhum puxão resultante.',
      },
      surface: {
        kid: 'Esta está em cima. Tem vizinhas ao lado e por baixo, mas nenhuma por cima, só ar. Por isso é puxada para dentro da água. Todas as moléculas de cima são puxadas assim, e juntas fazem a pele!',
        sci: 'À superfície, as vizinhas estão só ao lado e por baixo: os puxões já não se anulam e deixam uma força resultante para dentro. Trazer uma molécula para a superfície custa energia, por isso o líquido mantém a superfície tão pequena quanto pode: é a tensão superficial.',
      },
      press: {
        kid: 'A pata carrega: as camadas de cima dobram, mas as ligações de hidrogénio aguentam, como num trampolim.',
        sci: 'Com carga, a superfície dobra-se numa covinha; as ligações esticam e inclinam-se em vez de se quebrarem. (Um só pelo de uma pata verdadeira tem milhares de moléculas de largura: fora de escala.)',
      },
      lift: { kid: 'A pata levanta-se e a pele volta a ficar lisa.', sci: 'Sem carga, a superfície volta a ficar plana: a menor área.' },
      warm: {
        kid: '{t} °C: as moléculas quentes agitam-se mais, as ligações quebram-se mais vezes, e a pele enfraquece: {g} mN/m.',
        sci: '{t} °C: mais agitação térmica, ligações de hidrogénio de vida mais curta: σ = {g} mN/m.',
      },
      cold: { kid: '{t} °C: as moléculas frias mexem-se devagar e agarram-se bem. Uma pele forte: {g} mN/m.', sci: '{t} °C: σ = {g} mN/m, perto do seu máximo para a água líquida.' },
      mild: { kid: '{t} °C: a força da pele é {g} mN/m.', sci: '{t} °C: σ = {g} mN/m.' },
    },
    panel: {
      kid: [
        'Aqui o cimo do lago está ampliado cerca de 3 mil milhões de vezes: oxigénios vermelhos, hidrogénios brancos, e os tracinhos a brilhar são ligações de hidrogénio, cada hidrogénio a puxar o oxigénio de uma vizinha. Toca numa molécula bem lá dentro, depois numa de cima, e compara os puxões.',
        'Desliza a temperatura: as moléculas mais quentes agitam-se mais, as suas ligações de hidrogénio quebram-se e refazem-se mais depressa, e a pele fica mais fraca. Até a água a ferver tem pele, só que mais fraca. Toca na pata para carregar na pele.',
      ],
      sci: [
        'Uma fatia da superfície, com oxigénios vizinhos a 0,8 m aqui por 2,8 Å (cerca de 3 × 10⁹ vezes). Cada molécula pode dar duas ligações de hidrogénio e receber duas, cerca de 20 kJ/mol cada; no líquido quebram-se e refazem-se em picossegundos (aqui mostradas cerca de 10¹² vezes mais devagar). Lá dentro, os puxões anulam-se; à superfície deixam uma força resultante para dentro.',
        'A tensão superficial é a energia de nova superfície por unidade de área, ou a força ao longo dela por unidade de comprimento: 75,6 mN/m a 0 °C, 72,0 a 25 °C, 58,9 a 100 °C (IAPWS), das mais altas entre os líquidos comuns (etanol 22, mercúrio cerca de 485). Mais quentes, as moléculas têm mais energia térmica, menos ligações se mantêm em cada momento, e σ desce.',
      ],
    },
  },
  drink: {
    label: 'A bebida mais alta',
    title: 'Água até ao cimo de uma árvore',
    height: 'Altura da árvore',
    rows: { height: 'Altura', pull: 'Puxão necessário no cimo, só para segurar a água', atm: 'Ou seja', atmValue: '{n} vezes a pressão do ar' },
    signs: { model: 'uma sequoia-vermelha (maqueta)', sun: 'sol', m: '{n} m', limit: 'o limite', hyperion: 'Hyperion 116 m', pump: 'uma bomba: 10 m' },
    verbs: { sun: 'Deixa o sol brilhar', hyperion: 'Tão alta como o Hyperion' },
    hints: { watch: 'Vê a água subir', broken: 'Toca na régua mais abaixo', sun: 'Toca no sol', any: 'Toca no sol ou na régua' },
    says: {
      drink: {
        kid: 'O sol aquece as folhas e elas expiram água. Cada molécula que sai puxa a seguinte para cima atrás de si, porque se agarram com ligações de hidrogénio. O fio todo sobe um passo, das raízes até ao cimo!',
        sci: 'Transpiração: a água evapora-se das folhas e a coluna atrás dela fica sob tensão. Unida por ligações de hidrogénio (coesão) e às paredes dos vasos (adesão), sobe toda junta: a teoria da coesão-tensão de Dixon e Joly, 1894.',
      },
      step: { kid: 'Mais um gole! Mais um passo para cima, para o fio todo.', sci: 'Mais um passo: a coluna move-se como um todo.' },
      noDrink: {
        kid: 'As folhas têm sede, mas uma bolha partiu o fio: a água não pode ser puxada para lá dela. Faz a árvore mais baixa.',
        sci: 'A coluna cavitou: uma bolha de ar (uma embolia) parte-a, e a tensão já não consegue puxar a água através do espaço vazio.',
      },
      broken: { kid: 'Alta demais! O puxão no cimo é tão forte que o fio pode partir-se e entra uma bolha de ar.', sci: 'Acima de cerca de 130 m a tensão necessária vai para lá do que as folhas aguentam, e as colunas arriscam partir-se por cavitação.' },
      thirsty: {
        kid: 'Mais alta do que cerca de 122 m, as folhas do cimo quase não recebem água: ficam pálidas e deixam de crescer.',
        sci: '122 a 130 m: a altura máxima prevista (Koch e colegas, Nature, 2004). No cimo, a falta de água impede as folhas de crescer e abranda a fotossíntese.',
      },
      hyperion: {
        kid: 'Isto é mais ou menos a altura do Hyperion, uma sequoia-vermelha na Califórnia: cerca de 116 m, a árvore viva mais alta que conhecemos!',
        sci: 'Hyperion, uma sequoia-vermelha (Sequoia sempervirens) no Parque Nacional de Redwood, encontrada em 2006: cerca de 116 m, a árvore viva mais alta que se conhece.',
      },
      lower: { kid: 'Uma árvore mais baixa: um gole fácil.', sci: 'Uma árvore mais baixa: menos tensão necessária no cimo.' },
    },
    panel: {
      kid: [
        'Uma árvore não tem bomba. O sol aquece as folhas e elas expiram vapor de água; cada molécula de água que sai puxa a seguinte para cima, e essa a seguinte, até lá abaixo às raízes. A água mantém-se junta num só fio comprido, segura por ligações de hidrogénio.',
        'Uma bomba de sucção só consegue levantar água cerca de 10 m. Uma árvore puxa-a mais de dez vezes mais alto! Desliza a altura ou toca na régua: acima de cerca de 122 a 130 m o puxão seria demasiado, e é mais ou menos essa a altura das árvores mais altas.',
      ],
      sci: [
        'Segurar uma coluna com h metros de altura exige uma tensão de ρgh no topo: cerca de 0,01 MPa por metro, 1,1 MPa para 116 m, onze vezes a pressão do ar, e o fluxo através da madeira exige mais. A água só aguenta tal tensão porque as ligações de hidrogénio a mantêm unida; uma bomba de sucção, empurrada pelo ar, para a cerca de 10,3 m.',
        'Koch, Sillett, Jennings e Davis subiram às sequoias mais altas e mediram o stress hídrico das folhas a aumentar com a altura. Previram uma altura máxima das árvores de 122 a 130 m (Nature, 2004): acima disso as folhas teriam pouca água para crescer, e as colunas esticadas arriscariam partir-se. A mais alta medida, o Hyperion, tem cerca de 116 m.',
      ],
    },
  },
  whatif: {
    label: 'E se?',
    title: 'Água sem ligações de hidrogénio',
    signs: { chart: 'Ponto de ebulição', about: 'cerca de −80 °C', far: 'muito abaixo de zero', pond: 'o lago esta noite, cerca de 20 °C', jar: 'água do lago', on: 'ligações de hidrogénio: LIGADAS', off: 'ligações de hidrogénio: DESLIGADAS' },
    verbs: { off: 'Desliga as ligações de hidrogénio', on: 'Volta a ligá-las' },
    hints: { off: 'Toca na alavanca', on: 'Toca outra vez na alavanca' },
    rows: { trend: 'H₂O pela tendência', trendValue: 'cerca de −80 °C' },
    says: {
      off: {
        kid: 'E se a água não tivesse ligações de hidrogénio? Ferveria muito abaixo de zero, como o seu primo, o sulfureto de hidrogénio. O lago está muito mais quente do que isso, por isso ferve e desaparece em vapor! Sem mares, sem lagos, sem alfaiates.',
        sci: 'Sem ligações de hidrogénio, o ponto de ebulição da água seguiria o dos seus primos mais pesados, H₂Te, H₂Se e H₂S, até cerca de −80 °C. A 20 °C o lago estaria cem graus acima dele, e passaria a vapor.',
      },
      on: {
        kid: 'Ufa! Ligações de hidrogénio outra vez ligadas: o vapor volta a ser água, e o lago volta a ser um lago.',
        sci: 'Ligações de hidrogénio repostas: ponto de ebulição de 100 °C a 1 atm, e o vapor condensa.',
      },
    },
    panel: {
      kid: [
        'Esta alavanca faz uma coisa impossível, só para ver: desliga as ligações de hidrogénio da água. Os primos da água, feitos de hidrogénio com enxofre, selénio ou telúrio (os elementos por baixo do oxigénio), não têm ligações de hidrogénio fortes, e são todos gases num dia quente.',
        'Segue os pontos deles no gráfico até ao lugar da água: a água devia ferver muito abaixo de zero. Em vez disso ferve a 100 °C, porque as suas moléculas se agarram umas às outras. É por isso que a Terra tem mares, e que tu e o alfaiate estão aqui.',
      ],
      sci: [
        'Pontos de ebulição a 1 atm: H₂Te −2 °C, H₂Se −41 °C, H₂S −60 °C. As moléculas mais leves têm forças de dispersão mais fracas, por isso a tendência desce para o topo do grupo, até cerca de −80 °C para o H₂O. A água ferve a 100 °C em vez disso: cada molécula tem de se soltar das suas ligações de hidrogénio.',
        'Os hidretos do grupo 14 (a cinzento: CH₄, SiH₄, GeH₄, SnH₄) não formam ligações de hidrogénio e descem suavemente até ao metano, a −161,5 °C. O NH₃ e o HF quebram as suas tendências da mesma maneira, com menos força. O ponto de ebulição alto da água, o seu calor de vaporização (40,7 kJ/mol a 100 °C) e a sua capacidade térmica mantêm os oceanos líquidos.',
      ],
    },
  },
}

const PL = {
  title: 'Staw nartnika',
  greet: {
    kid: 'Cześć! Jestem Wodór. Jesteś teraz wielkości mrówki, nad stawem o zmierzchu: wszystko tu jest około 200 razy większe niż naprawdę. Woda ma skórkę, a ta skórka jest zrobiona z moich małych pociągnięć, wiązań wodorowych. Wypróbuj nartnika i pływający spinacz, olbrzymie cząsteczki, wysokie drzewo i dźwignię. Historia obrazka jest na sztaludze.',
    sci: 'Cześć! Jestem Wodór. Staw o zmierzchu, wszystko około 200 razy większe niż w rzeczywistości. Napięcie powierzchniowe wody, około 72 mN/m, bierze się z wiązań wodorowych (O-H···O, każde około 20 kJ/mol). Cztery rzeczy do wypróbowania: nartnik i pływający spinacz, wycinek powierzchni w skali cząsteczek, słup wody w sekwoi i woda bez wiązań wodorowych. Historia obrazka jest na sztaludze.',
  },
  talk: {
    kid: [
      'Unoszę się nad stawem: jestem najlżejszym gazem ze wszystkich. Ale nartnik stoi prosto na wodzie, a w tym rozmiarze tobie też by się udało!',
      'Popatrz na krople na liściu lilii wodnej: zostają okrągłe. Cząsteczki wody przyciągają się tak mocno, że mała kropla sama ściąga się w kulkę.',
      'Każda cząsteczka wody ma w sobie dwa atomy wodoru, czyli mnie. Każdy z nich mocno trzyma swój tlen i lekko ciągnie tlen sąsiada.',
    ],
    sci: [
      'Napięcie powierzchniowe to energia na powierzchnię i zarazem siła na długość: około 72 mJ na wytworzenie 1 m² nowej powierzchni wody w 25 °C, tyle samo co 72 mN siły na każdym metrze brzegu.',
      'Długość kapilarna wody, √(γ/ρg), wynosi około 2,7 mm: to rozmiar dołków wokół nóg nartnika i powód, dla którego mniejsze krople pozostają okrągłe na woskowym liściu.',
      'W ciekłej wodzie każda cząsteczka ma w danej chwili od trzech do czterech wiązań wodorowych, a każde trwa tylko pikosekundy, zanim pęknie i powstanie inne.',
    ],
  },
  skin: {
    label: 'Skórka wody',
    title: 'Stać na wodzie',
    sand: 'Piasek na spinaczu',
    lens: { air: 'powietrze', water: 'woda', hairs: 'włoski', pull: 'skórka ciągnie', weight: 'ciężar' },
    signs: { sand: 'piasek', soap: 'mydło', clip: 'spinacz', thread: 'bawełniana nitka', weight: 'ciężar', hold: 'co utrzyma skórka' },
    verbs: { pour: 'Nasyp piasku', soap: 'Upuść mydło', fish: 'Wyłów spinacz', front: 'Przednia noga', middle: 'Środkowa noga', hind: 'Tylna noga' },
    hints: { leg: 'Dotknij nogi nartnika', pour: 'Dotknij lejka, żeby nasypać piasku', more: 'Dotknij lejka albo zakraplacza z mydłem', fish: 'Dotknij zatopionego spinacza', watch: 'Patrz' },
    rows: { clean: 'Czysta woda, 25 °C', soapy: 'Woda z mydłem', soapyValue: 'około 25 do 30 mN/m', load: 'Ciężar wobec tego, co utrzyma skórka' },
    says: {
      front: {
        kid: 'Przednia noga: krótka i mocna, do łapania małych owadów, które wpadną do wody. Prawie nie ugina skórki.',
        sci: 'Przednie nogi: krótkie, do chwytania zdobyczy uwięzionej na powierzchni. Niosą mały ciężar, więc ich dołki są płytkie.',
      },
      middle: {
        kid: 'Środkowa noga, najdłuższa. Nartnik wiosłuje nimi, żeby wystrzelić do przodu. Zajrzyj w soczewkę: włoski trzymają poduszkę powietrza, więc woda nie może zamoczyć stopy.',
        sci: 'Środkowe nogi: najdłuższe, to wiosła. Ich włoski (tysiące woskowych mikroszczecinek) więżą powietrze, a woda styka się z nimi pod kątem około 167°, więc nigdy się nie moczą.',
      },
      hind: {
        kid: 'Tylna noga, do skręcania i hamowania jak ster. Jej stopa spoczywa we własnym małym dołku.',
        sci: 'Tylne nogi: ster i hamulec. Sześć stóp rozkłada ciężar owada na kilka centymetrów linii kontaktu, więc każdy dołek pozostaje płytki.',
      },
      pour: { kid: 'Piasek sypie się na spinacz. Patrz: dołek pod nim się pogłębia.', sci: 'Dodano piasek: obciążenie spinacza rośnie, a menisk wokół niego pogłębia się, żeby je unieść.' },
      deeper: { kid: 'Więcej piasku! Skórka rozciąga się coraz niżej. Ile jeszcze wytrzyma?', sci: 'Dołek się pogłębia: powierzchnia wzdłuż spinacza nachyla się bardziej stromo, żeby mocniej pchać w górę.' },
      heavy: { kid: 'Oj! Chyba za dużo...', sci: 'Ponad to, co powierzchnia może unieść...' },
      sink: {
        kid: 'Plum! Skórka się rozdarła i spinacz zatonął. Skórka utrzyma dużo, ale nie wszystko.',
        sci: 'Menisk nie mógł się bardziej nachylić: powierzchnia pękła i spinacz zatonął (stal jest około 7,9 razy gęstsza od wody).',
      },
      soap: {
        kid: 'Mydło rozlało się w pętli. Czysta woda na zewnątrz wyciągnęła nitkę w okrąg, a skórka z mydłem była za słaba, żeby utrzymać spinacz. I poszedł na dno! Nartnik, poza pętlą, ma się dobrze.',
        sci: 'Mydło obniżyło napięcie powierzchniowe w pętli do około 25 do 30 mN/m i pozwoliło wodzie zwilżyć stal. Silniejsze ciągnięcie czystej powierzchni na zewnątrz wyciągnęło nitkę w okrąg, a osłabiona powierzchnia przepuściła spinacz.',
      },
      soapAgain: { kid: 'Mydło już jest w wodzie. Najpierw wyłów spinacz.', sci: 'Już jest mydło: wyłów spinacz, żeby była świeża woda.' },
      sunkFirst: { kid: 'Spinacz zatonął. Najpierw dotknij go pod wodą, żeby go wyłowić.', sci: 'Spinacz jest na dnie: najpierw go wyłów.' },
      floats: { kid: 'Spinacz pływa na skórce wody, chociaż jest ze stali!', sci: 'Pływa: trzyma go napięcie powierzchniowe wzdłuż linii kontaktu, a nie wypór.' },
      fish: { kid: 'Wyłowiony i osuszony! Znowu pływa, na świeżej, czystej wodzie.', sci: 'Spinacz wyłowiony i osuszony, świeża woda w pętli.' },
    },
    panel: {
      kid: [
        'Nartnik nie unosi się jak łódka: stoi na skórce wody. Cząsteczki wody na górze przyciągają się nawzajem i trzymają razem jak napięte prześcieradło, a stopy nartnika robią w nim tylko małe dołki. Jego nogi pokrywają malutkie włoski, które więżą powietrze, więc woda nie może ich zamoczyć. Dotknij nogi, żeby zobaczyć jej dołek.',
        'Teraz spinacz: stal jest dużo cięższa od wody, a jednak skórka go utrzymuje. Nasyp na niego piasku, a dołek będzie się pogłębiał, aż skórka się rozedrze. Albo upuść trochę mydła: mydło osłabia skórkę i spinacz od razu tonie. Pokazuje to też nitka, gdy czysta woda na zewnątrz wyciąga pętlę w okrąg.',
      ],
      sci: [
        'Nartnik z rodzaju Gerris waży około 10 mg i rozkłada ten ciężar na długie nogi, których włoski, tysiące woskowych mikroszczecinek, więżą powietrze: woda styka się z nimi pod kątem zwilżania około 167°. Jedna noga może wcisnąć dołek głęboki na około 4 mm i unieść około 15 razy więcej, niż waży owad, zanim przebije powierzchnię (Gao i Jiang, Nature, 2004). Wiosłuje środkowymi nogami.',
        'Pływający przedmiot jest trzymany wzdłuż brzegu siłą co najwyżej γ = 72 mN na każdy metr linii kontaktu, ciągnącą wzdłuż nachylonej powierzchni: dlatego stalowy spinacz pływa, choć stal jest 7,9 razy gęstsza od wody. Każde ziarenko pogłębia dołek, aż powierzchnia nie może się już bardziej nachylić. Mydło gromadzi się na powierzchni, obniża γ do około 25 do 30 mN/m i pozwala wodzie zwilżyć stal: spinacz tonie. Nitka układa się w okrąg, bo czysta powierzchnia na zewnątrz ciągnie mocniej niż ta z mydłem w środku.',
      ],
    },
  },
  pull: {
    label: 'Każda cząsteczka przyciągana',
    title: 'Dlaczego woda ma skórkę',
    temp: 'Temperatura wody',
    rows: {
      gamma: 'Napięcie powierzchniowe',
      bonds: 'Wiązania pękają i powstają',
      speed: {
        slow: { kid: 'powoli', sci: 'najrzadziej (zimno)' },
        mid: { kid: 'szybciej', sci: 'częściej' },
        fast: { kid: 'bardzo szybko', sci: 'najczęściej (gorąco)' },
      },
    },
    signs: {
      air: 'powietrze',
      water: 'woda',
      surface: 'powierzchnia',
      scale: 'cząsteczki wody, około 3 miliardy razy większe',
      foot: 'stopa nartnika (nie w skali)',
      gammaSci: '{g} mN/m w {t} °C',
      gammaKid: 'siła skórki {g} w {t} °C',
    },
    verbs: { inside: 'Cząsteczka w środku', surface: 'Cząsteczka na górze', press: 'Naciśnij stopą', lift: 'Podnieś stopę' },
    hints: { inside: 'Dotknij cząsteczki głęboko w środku', surface: 'Teraz dotknij jednej na górze', foot: 'Dotknij stopy nartnika', any: 'Dotknij cząsteczki albo stopy' },
    says: {
      inside: {
        kid: 'Ta jest głęboko w środku. Trzyma się czterech sąsiadek (świecące kreski), a one ciągną ją tak samo we wszystkie strony, więc wszystkie pociągnięcia się znoszą.',
        sci: 'Wewnątrz cieczy każda cząsteczka ma sąsiadów dookoła: do czterech wiązań wodorowych, dwa od jej wodorów i dwa do jej wolnych par elektronowych, ciągnących w czworościanie. Siły się znoszą: brak siły wypadkowej.',
      },
      surface: {
        kid: 'Ta jest na górze. Ma sąsiadki obok i pod sobą, ale żadnej nad sobą, tylko powietrze. Więc jest wciągana w głąb wody. Wszystkie cząsteczki na górze są tak wciągane i razem tworzą skórkę!',
        sci: 'Na powierzchni sąsiedzi są tylko obok i poniżej: siły już się nie znoszą i zostaje siła wypadkowa skierowana do wnętrza. Wyniesienie cząsteczki na powierzchnię kosztuje energię, więc ciecz utrzymuje jak najmniejszą powierzchnię: to jest napięcie powierzchniowe.',
      },
      press: {
        kid: 'Stopa naciska: górne warstwy się uginają, ale wiązania wodorowe trzymają, jak trampolina.',
        sci: 'Pod obciążeniem powierzchnia ugina się w dołek; wiązania rozciągają się i przechylają zamiast pękać. (Jeden włosek prawdziwej stopy ma szerokość tysięcy cząsteczek: nie w skali.)',
      },
      lift: { kid: 'Stopa się podnosi, a skórka wraca do płaskiej.', sci: 'Bez obciążenia powierzchnia wraca do płaskiej: najmniejsze pole.' },
      warm: {
        kid: '{t} °C: ciepłe cząsteczki drgają mocniej, ich wiązania częściej pękają, a skórka słabnie: {g} mN/m.',
        sci: '{t} °C: więcej ruchu cieplnego, krócej żyjące wiązania wodorowe: σ = {g} mN/m.',
      },
      cold: { kid: '{t} °C: zimne cząsteczki poruszają się wolno i mocno się trzymają. Mocna skórka: {g} mN/m.', sci: '{t} °C: σ = {g} mN/m, blisko maksimum dla ciekłej wody.' },
      mild: { kid: '{t} °C: siła skórki wynosi {g} mN/m.', sci: '{t} °C: σ = {g} mN/m.' },
    },
    panel: {
      kid: [
        'Tu wierzch stawu jest powiększony około 3 miliardy razy: czerwone tleny, białe wodory, a świecące kreski to wiązania wodorowe, każdy wodór ciągnie tlen sąsiadki. Dotknij cząsteczki głęboko w środku, potem jednej na górze, i porównaj ich pociągnięcia.',
        'Przesuń temperaturę: cieplejsze cząsteczki drgają mocniej, ich wiązania wodorowe szybciej pękają i powstają na nowo, a skórka słabnie. Nawet wrząca woda ma jeszcze skórkę, tylko słabszą. Dotknij stopy, żeby nacisnąć na skórkę.',
      ],
      sci: [
        'Wycinek powierzchni: sąsiednie tleny są tu 0,8 m od siebie zamiast 2,8 Å (około 3 × 10⁹ razy). Każda cząsteczka może dać dwa wiązania wodorowe i przyjąć dwa, każde około 20 kJ/mol; w cieczy pękają i powstają w ciągu pikosekund (tu pokazane około 10¹² razy wolniej). W środku siły się znoszą; na powierzchni zostaje siła wypadkowa skierowana do wnętrza.',
        'Napięcie powierzchniowe to energia nowej powierzchni na jednostkę pola albo siła wzdłuż niej na jednostkę długości: 75,6 mN/m w 0 °C, 72,0 w 25 °C, 58,9 w 100 °C (IAPWS), jedno z najwyższych wśród zwykłych cieczy (etanol 22, rtęć około 485). W wyższej temperaturze cząsteczki mają więcej energii cieplnej, w każdej chwili trzyma mniej wiązań, a σ spada.',
      ],
    },
  },
  drink: {
    label: 'Najwyższy łyk',
    title: 'Woda na szczyt drzewa',
    height: 'Wysokość drzewa',
    rows: { height: 'Wysokość', pull: 'Ciąg potrzebny na szczycie, żeby tylko utrzymać wodę', atm: 'To jest', atmValue: '{n} razy ciśnienie powietrza' },
    signs: { model: 'sekwoja wieczniezielona (model)', sun: 'słońce', m: '{n} m', limit: 'granica', hyperion: 'Hyperion 116 m', pump: 'pompa: 10 m' },
    verbs: { sun: 'Niech świeci słońce', hyperion: 'Wysoka jak Hyperion' },
    hints: { watch: 'Patrz, jak woda się wspina', broken: 'Dotknij linijki niżej', sun: 'Dotknij słońca', any: 'Dotknij słońca albo linijki' },
    says: {
      drink: {
        kid: 'Słońce ogrzewa liście, a one wydychają wodę. Każda cząsteczka, która odchodzi, ciągnie za sobą następną w górę, bo trzymają się wiązaniami wodorowymi. Cała nitka przesuwa się o krok, od korzeni aż na szczyt!',
        sci: "Transpiracja: woda paruje z liści, a słup za nią znajduje się pod napięciem. Połączony wiązaniami wodorowymi (kohezja) i ze ściankami naczyń (adhezja), wznosi się jako całość: teoria kohezyjno-napięciowa Dixona i Joly'ego, 1894.",
      },
      step: { kid: 'Jeszcze łyk! Cała nitka o krok wyżej.', sci: 'Kolejny krok: słup przesuwa się jako całość.' },
      noDrink: {
        kid: 'Liście są spragnione, ale bąbelek przerwał nitkę: wody nie da się przez niego przeciągnąć. Zrób drzewo niższe.',
        sci: 'W słupie nastąpiła kawitacja: pęcherzyk powietrza (zator) go przerywa i napięcie nie może już przeciągnąć wody przez przerwę.',
      },
      broken: { kid: 'Za wysokie! Ciąg na szczycie jest tak silny, że nitka może pęknąć i dostaje się bąbelek powietrza.', sci: 'Powyżej około 130 m potrzebne napięcie przekracza to, co liście mogą znieść, a słupy grożą przerwaniem przez kawitację.' },
      thirsty: {
        kid: 'Powyżej około 122 m liście na szczycie prawie nie dostają wody: bledną i przestają rosnąć.',
        sci: '122 do 130 m: przewidywana największa wysokość (Koch i współpracownicy, Nature, 2004). Na szczycie niedobór wody zatrzymuje wzrost liści i spowalnia fotosyntezę.',
      },
      hyperion: {
        kid: 'To mniej więcej wysokość Hyperiona, sekwoi wieczniezielonej w Kalifornii: około 116 m, najwyższego żywego drzewa, jakie znamy!',
        sci: 'Hyperion, sekwoja wieczniezielona (Sequoia sempervirens) w Parku Narodowym Redwood, odkryta w 2006 roku: około 116 m, najwyższe znane żywe drzewo.',
      },
      lower: { kid: 'Niższe drzewo: łatwy łyk.', sci: 'Niższe drzewo: na szczycie potrzeba mniejszego napięcia.' },
    },
    panel: {
      kid: [
        'Drzewo nie ma pompy. Słońce ogrzewa jego liście, a one wydychają parę wodną; każda cząsteczka wody, która odchodzi, ciągnie w górę następną, a ta kolejną, aż do samych korzeni. Woda trzyma się razem w jednej długiej nitce, dzięki wiązaniom wodorowym.',
        'Pompa ssąca podniesie wodę tylko na około 10 m. Drzewo ciągnie ją ponad dziesięć razy wyżej! Przesuń wysokość albo dotknij linijki: powyżej około 122 do 130 m ciąg byłby za duży, a mniej więcej tak wysokie rosną najwyższe drzewa.',
      ],
      sci: [
        'Utrzymanie słupa o wysokości h metrów wymaga na jego szczycie napięcia ρgh: około 0,01 MPa na metr, 1,1 MPa dla 116 m, jedenaście razy więcej niż ciśnienie powietrza, a przepływ przez drewno wymaga jeszcze więcej. Woda wytrzymuje takie napięcie tylko dlatego, że trzymają ją razem wiązania wodorowe; pompa ssąca, pchana przez powietrze, zatrzymuje się na około 10,3 m.',
        'Koch, Sillett, Jennings i Davis wspięli się na najwyższe sekwoje i zmierzyli, jak niedobór wody w liściach rośnie z wysokością. Przewidzieli największą wysokość drzew na 122 do 130 m (Nature, 2004): powyżej liście miałyby za mało wody, żeby rosnąć, a rozciągnięte słupy groziłyby przerwaniem. Najwyższe zmierzone, Hyperion, ma około 116 m.',
      ],
    },
  },
  whatif: {
    label: 'A gdyby?',
    title: 'Woda bez wiązań wodorowych',
    signs: { chart: 'Temperatura wrzenia', about: 'około −80 °C', far: 'dużo poniżej zera', pond: 'staw dziś wieczorem, około 20 °C', jar: 'woda ze stawu', on: 'wiązania wodorowe: WŁ.', off: 'wiązania wodorowe: WYŁ.' },
    verbs: { off: 'Wyłącz wiązania wodorowe', on: 'Włącz je z powrotem' },
    hints: { off: 'Dotknij dźwigni', on: 'Dotknij dźwigni jeszcze raz' },
    rows: { trend: 'H₂O według trendu', trendValue: 'około −80 °C' },
    says: {
      off: {
        kid: 'A gdyby woda nie miała wiązań wodorowych? Wrzałaby dużo poniżej zera, jak jej kuzyn siarkowodór. Staw jest dużo cieplejszy, więc wygotowuje się w parę! Nie byłoby mórz, stawów ani nartników.',
        sci: 'Bez wiązań wodorowych temperatura wrzenia wody szłaby za jej cięższymi kuzynami H₂Te, H₂Se i H₂S, do około −80 °C. W 20 °C staw byłby sto stopni powyżej niej i zamieniłby się w parę.',
      },
      on: {
        kid: 'Uff! Wiązania wodorowe znowu włączone: para zamienia się z powrotem w wodę, a staw znowu jest stawem.',
        sci: 'Wiązania wodorowe przywrócone: temperatura wrzenia 100 °C pod ciśnieniem 1 atm, a para się skrapla.',
      },
    },
    panel: {
      kid: [
        'Ta dźwignia robi coś niemożliwego, tylko po to, żeby zobaczyć: wyłącza wiązania wodorowe wody. Kuzyni wody, zbudowani z wodoru i siarki, selenu albo telluru (pierwiastków pod tlenem), nie mają silnych wiązań wodorowych i w ciepły dzień wszyscy są gazami.',
        'Prześledź ich kropki na wykresie aż do miejsca wody: woda powinna wrzeć dużo poniżej zera. A wrze w 100 °C, bo jej cząsteczki trzymają się siebie nawzajem. Dlatego Ziemia ma morza i dlatego ty i nartnik tu jesteście.',
      ],
      sci: [
        'Temperatury wrzenia pod ciśnieniem 1 atm: H₂Te −2 °C, H₂Se −41 °C, H₂S −60 °C. Lżejsze cząsteczki mają słabsze siły dyspersyjne, więc trend spada ku górze grupy, do około −80 °C dla H₂O. Woda wrze tymczasem w 100 °C: każda cząsteczka musi się uwolnić od swoich wiązań wodorowych.',
        'Wodorki grupy 14 (szare: CH₄, SiH₄, GeH₄, SnH₄) nie tworzą wiązań wodorowych i spadają łagodnie do metanu w −161,5 °C. NH₃ i HF łamią swoje trendy w ten sam sposób, słabiej. Wysoka temperatura wrzenia wody, jej ciepło parowania (40,7 kJ/mol w 100 °C) i pojemność cieplna utrzymują oceany w stanie ciekłym.',
      ],
    },
  },
}

const DE = {
  title: 'Der Teich des Wasserläufers',
  greet: {
    kid: 'Hallo! Ich bin der Wasserstoff. Du bist so klein wie eine Ameise, an einem Teich in der Dämmerung: Alles hier ist etwa 200-mal größer als in Wirklichkeit. Das Wasser hat eine Haut, und diese Haut besteht aus meinen kleinen Griffen, den Wasserstoffbrücken. Probier den Wasserläufer, die schwimmende Büroklammer, die riesigen Moleküle, den hohen Baum und den Hebel aus. Die Geschichte des Bildes steht auf der Staffelei.',
    sci: 'Hallo! Ich bin der Wasserstoff. Ein Teich in der Dämmerung, alles etwa 200-mal größer als in Wirklichkeit. Die Oberflächenspannung des Wassers, etwa 72 mN/m, kommt von Wasserstoffbrücken (O-H···O, je etwa 20 kJ/mol). Vier Dinge zum Ausprobieren: der Wasserläufer und eine schwimmende Klammer, ein Ausschnitt der Oberfläche im Maßstab der Moleküle, die Wassersäule eines Mammutbaums und Wasser ohne seine Wasserstoffbrücken. Die Geschichte des Bildes steht auf der Staffelei.',
  },
  talk: {
    kid: [
      'Ich schwebe über dem Teich: Ich bin das leichteste Gas von allen. Aber der Wasserläufer steht direkt auf dem Wasser, und so klein könntest du das auch!',
      'Schau dir die Tropfen auf dem Seerosenblatt an: Sie bleiben rund. Wassermoleküle ziehen so stark aneinander, dass sich ein kleiner Tropfen selbst zu einer Kugel zusammenzieht.',
      'Jedes Wassermolekül hat zwei von mir. Jedes meiner Wasserstoffatome hält seinen eigenen Sauerstoff fest und zieht ein bisschen am Sauerstoff nebenan.',
    ],
    sci: [
      'Oberflächenspannung ist Energie pro Fläche und zugleich Kraft pro Länge: etwa 72 mJ, um 1 m² neue Wasseroberfläche bei 25 °C zu schaffen, dasselbe wie 72 mN Zug an jedem Meter Rand.',
      'Die Kapillarlänge des Wassers, √(γ/ρg), beträgt etwa 2,7 mm: die Größe der Dellen um die Füße eines Wasserläufers, und der Grund, warum kleinere Tropfen auf einem wachsigen Blatt rund bleiben.',
      'In flüssigem Wasser hat jedes Molekül in jedem Moment drei bis vier Wasserstoffbrücken, und jede hält nur Pikosekunden, bevor sie reißt und sich eine andere bildet.',
    ],
  },
  skin: {
    label: 'Die Haut des Wassers',
    title: 'Auf dem Wasser stehen',
    sand: 'Sand auf der Klammer',
    lens: { air: 'Luft', water: 'Wasser', hairs: 'Härchen', pull: 'die Haut zieht', weight: 'Gewicht' },
    signs: { sand: 'Sand', soap: 'Seife', clip: 'Büroklammer', thread: 'Baumwollfaden', weight: 'Gewicht', hold: 'was die Haut hält' },
    verbs: { pour: 'Schütte etwas Sand', soap: 'Lass die Seife fallen', fish: 'Fisch die Klammer heraus', front: 'Vorderbein', middle: 'Mittelbein', hind: 'Hinterbein' },
    hints: { leg: 'Tipp ein Bein des Wasserläufers an', pour: 'Tipp den Trichter an, um Sand zu schütten', more: 'Tipp den Trichter oder die Seifenpipette an', fish: 'Tipp die versunkene Klammer an', watch: 'Schau zu' },
    rows: { clean: 'Sauberes Wasser, 25 °C', soapy: 'Seifenwasser', soapyValue: 'etwa 25 bis 30 mN/m', load: 'Gewicht gegen das, was die Haut hält' },
    says: {
      front: {
        kid: 'Ein Vorderbein: kurz und kräftig, um kleine Insekten zu packen, die aufs Wasser fallen. Es drückt die Haut kaum ein.',
        sci: 'Vorderbeine: kurz, zum Ergreifen von Beute, die auf der Oberfläche gefangen ist. Sie tragen wenig Gewicht, darum sind ihre Dellen flach.',
      },
      middle: {
        kid: 'Ein Mittelbein, das längste. Damit rudert der Wasserläufer und schießt nach vorn. Schau in die Lupe: Die Härchen halten ein Luftpolster, darum kann das Wasser den Fuß nicht nass machen.',
        sci: 'Mittelbeine: die längsten, die Ruder. Ihre Härchen (Tausende wachsige Mikroborsten) halten Luft fest, und Wasser trifft sie unter etwa 167°, darum werden sie nie nass.',
      },
      hind: {
        kid: 'Ein Hinterbein, zum Lenken und Bremsen wie ein Steuerruder. Sein Fuß ruht in seiner eigenen kleinen Delle.',
        sci: 'Hinterbeine: Steuer und Bremse. Die sechs Füße verteilen das Gewicht des Insekts auf mehrere Zentimeter Kontaktlinie, darum bleibt jede Delle flach.',
      },
      pour: { kid: 'Sand rieselt auf die Klammer. Schau: Die Delle darunter wird tiefer.', sci: 'Sand dazu: Die Last der Klammer steigt, und der Meniskus um sie wird tiefer, um sie zu tragen.' },
      deeper: { kid: 'Mehr Sand! Die Haut dehnt sich weiter nach unten. Wie viel hält sie noch aus?', sci: 'Die Delle wird tiefer: Die Oberfläche entlang der Klammer neigt sich steiler, um stärker nach oben zu drücken.' },
      heavy: { kid: 'Oh! Ich glaube, das ist zu viel...', sci: 'Mehr, als die Oberfläche tragen kann...' },
      sink: {
        kid: 'Plumps! Die Haut ist gerissen und die Klammer gesunken. Die Haut hält viel, aber nicht alles.',
        sci: 'Der Meniskus konnte sich nicht weiter neigen: Die Oberfläche brach, und die Klammer sank (Stahl ist etwa 7,9-mal dichter als Wasser).',
      },
      soap: {
        kid: 'Die Seife hat sich in der Schlinge ausgebreitet. Das saubere Wasser draußen hat den Faden zu einem Kreis gezogen, und die seifige Haut war zu schwach, um die Klammer zu halten. Ab nach unten! Der Wasserläufer außerhalb der Schlinge ist wohlauf.',
        sci: 'Die Seife hat die Oberflächenspannung in der Schlinge auf etwa 25 bis 30 mN/m gesenkt und das Wasser den Stahl benetzen lassen. Der stärkere Zug der sauberen Oberfläche draußen hat den Faden zu einem Kreis gezogen, und die geschwächte Oberfläche ließ die Klammer durch.',
      },
      soapAgain: { kid: 'Die Seife ist schon drin. Fisch zuerst die Klammer heraus.', sci: 'Schon seifig: Fisch die Klammer heraus, dann gibt es frisches Wasser.' },
      sunkFirst: { kid: 'Die Klammer ist gesunken. Tipp sie unter Wasser an, um sie zuerst herauszufischen.', sci: 'Die Klammer liegt unten: Fisch sie zuerst heraus.' },
      floats: { kid: 'Die Klammer schwimmt auf der Haut des Wassers, obwohl sie aus Stahl ist!', sci: 'Sie schwimmt: getragen von der Oberflächenspannung entlang ihrer Kontaktlinie, nicht vom Auftrieb.' },
      fish: { kid: 'Herausgefischt und getrocknet! Sie schwimmt wieder, auf frischem, sauberem Wasser.', sci: 'Klammer geborgen und getrocknet, frisches Wasser in der Schlinge.' },
    },
    panel: {
      kid: [
        'Der Wasserläufer schwimmt nicht wie ein Boot: Er steht auf der Haut des Wassers. Die Wassermoleküle oben ziehen aneinander und halten zusammen wie ein gespanntes Tuch, und die Füße des Wasserläufers drücken nur kleine Dellen hinein. Seine Beine sind mit winzigen Härchen bedeckt, die Luft festhalten, darum kann das Wasser sie nicht nass machen. Tipp ein Bein an, um seine Delle anzuschauen.',
        'Jetzt die Büroklammer: Stahl ist viel schwerer als Wasser, und trotzdem hält die Haut sie. Schütte Sand darauf, und die Delle wird tiefer, bis die Haut reißt. Oder lass etwas Seife fallen: Seife schwächt die Haut, und die Klammer sinkt sofort. Auch der Faden zeigt es, wenn das saubere Wasser draußen die Schlinge zu einem Kreis zieht.',
      ],
      sci: [
        'Ein Wasserläufer der Gattung Gerris wiegt etwa 10 mg und verteilt das auf lange Beine, deren Härchen, Tausende wachsige Mikroborsten, Luft festhalten: Wasser trifft sie unter einem Kontaktwinkel von etwa 167°. Ein Bein kann eine etwa 4 mm tiefe Delle drücken und etwa das 15-Fache des Körpergewichts tragen, bevor es durchbricht (Gao und Jiang, Nature, 2004). Er rudert mit den Mittelbeinen.',
        'Ein schwimmender Gegenstand wird entlang seines Randes von höchstens γ = 72 mN pro Meter Kontaktlinie gehalten, die entlang der geneigten Oberfläche ziehen: Darum schwimmt eine Stahlklammer, obwohl Stahl 7,9-mal dichter ist als Wasser. Jedes Körnchen vertieft die Delle, bis sich die Oberfläche nicht weiter neigen kann. Seife sammelt sich in der Oberfläche, senkt γ auf etwa 25 bis 30 mN/m und lässt das Wasser den Stahl benetzen: Die Klammer sinkt. Der Faden wird zum Kreis, weil die saubere Oberfläche draußen stärker zieht als die seifige drinnen.',
      ],
    },
  },
  pull: {
    label: 'Jedes Molekül gezogen',
    title: 'Warum Wasser eine Haut hat',
    temp: 'Temperatur des Wassers',
    rows: {
      gamma: 'Oberflächenspannung',
      bonds: 'Brücken reißen und bilden sich neu',
      speed: {
        slow: { kid: 'langsam', sci: 'am seltensten (kalt)' },
        mid: { kid: 'schneller', sci: 'öfter' },
        fast: { kid: 'sehr schnell', sci: 'am häufigsten (heiß)' },
      },
    },
    signs: {
      air: 'Luft',
      water: 'Wasser',
      surface: 'die Oberfläche',
      scale: 'Wassermoleküle, etwa 3 Milliarden Mal größer',
      foot: 'ein Fuß des Wasserläufers (nicht maßstabsgetreu)',
      gammaSci: '{g} mN/m bei {t} °C',
      gammaKid: 'Hautstärke {g} bei {t} °C',
    },
    verbs: { inside: 'Ein Molekül innen', surface: 'Ein Molekül oben', press: 'Drück den Fuß hinunter', lift: 'Heb den Fuß' },
    hints: { inside: 'Tipp ein Molekül tief innen an', surface: 'Jetzt tipp eins oben an', foot: 'Tipp den Fuß des Wasserläufers an', any: 'Tipp ein Molekül oder den Fuß an' },
    says: {
      inside: {
        kid: 'Dieses ist tief innen. Es hält sich an vier Nachbarn fest (die leuchtenden Striche), und die ziehen gleich stark in alle Richtungen, darum heben sich alle Züge auf.',
        sci: 'Im Inneren der Flüssigkeit hat jedes Molekül ringsum Nachbarn: bis zu vier Wasserstoffbrücken, zwei von seinen Wasserstoffatomen und zwei zu seinen freien Elektronenpaaren, die in einem Tetraeder ziehen. Die Kräfte heben sich auf: kein Netto-Zug.',
      },
      surface: {
        kid: 'Dieses ist oben. Es hat Nachbarn neben sich und unter sich, aber keine darüber, nur Luft. Darum wird es ins Wasser hineingezogen. Alle Moleküle oben werden so gezogen, und zusammen sind sie die Haut!',
        sci: 'An der Oberfläche liegen Nachbarn nur daneben und darunter: Die Züge heben sich nicht mehr auf und hinterlassen eine Kraft nach innen. Ein Molekül an die Oberfläche zu bringen kostet Energie, darum hält die Flüssigkeit ihre Oberfläche so klein wie möglich: Das ist die Oberflächenspannung.',
      },
      press: {
        kid: 'Der Fuß drückt hinunter: Die oberen Schichten biegen sich, aber die Wasserstoffbrücken halten, wie ein Trampolin.',
        sci: 'Unter Last biegt sich die Oberfläche zu einer Delle; die Brücken dehnen und neigen sich, statt zu reißen. (Ein einziges Härchen eines echten Fußes ist Tausende Moleküle breit: nicht maßstabsgetreu.)',
      },
      lift: { kid: 'Der Fuß hebt sich, und die Haut federt wieder flach.', sci: 'Ohne Last entspannt sich die Oberfläche flach: die kleinste Fläche.' },
      warm: {
        kid: '{t} °C: Warme Moleküle zappeln stärker, ihre Brücken reißen öfter, und die Haut wird schwächer: {g} mN/m.',
        sci: '{t} °C: mehr Wärmebewegung, kurzlebigere Wasserstoffbrücken: σ = {g} mN/m.',
      },
      cold: { kid: '{t} °C: Kalte Moleküle bewegen sich langsam und halten sich fest. Eine starke Haut: {g} mN/m.', sci: '{t} °C: σ = {g} mN/m, nahe dem Höchstwert für flüssiges Wasser.' },
      mild: { kid: '{t} °C: Die Haut hat eine Stärke von {g} mN/m.', sci: '{t} °C: σ = {g} mN/m.' },
    },
    panel: {
      kid: [
        'Hier ist die Oberseite des Teichs etwa 3 Milliarden Mal vergrößert: rote Sauerstoffatome, weiße Wasserstoffatome, und die leuchtenden Striche sind Wasserstoffbrücken, jedes Wasserstoffatom zieht am Sauerstoff eines Nachbarn. Tipp ein Molekül tief innen an, dann eins oben, und vergleiche, wie an ihnen gezogen wird.',
        'Schieb die Temperatur: Wärmere Moleküle zappeln mehr, ihre Wasserstoffbrücken reißen und bilden sich schneller neu, und die Haut wird schwächer. Sogar kochendes Wasser hat noch eine Haut, nur eine schwächere. Tipp den Fuß an, um auf die Haut zu drücken.',
      ],
      sci: [
        'Ein Ausschnitt der Oberfläche, benachbarte Sauerstoffatome hier 0,8 m auseinander statt 2,8 Å (etwa 3 × 10⁹-fach). Jedes Molekül kann zwei Wasserstoffbrücken geben und zwei annehmen, je etwa 20 kJ/mol; in der Flüssigkeit reißen sie und bilden sich neu innerhalb von Pikosekunden (hier etwa 10¹²-mal langsamer gezeigt). Im Inneren heben sich die Züge auf; an der Oberfläche bleibt eine Kraft nach innen.',
        'Oberflächenspannung ist die Energie neuer Oberfläche pro Flächeneinheit oder die Kraft entlang der Oberfläche pro Längeneinheit: 75,6 mN/m bei 0 °C, 72,0 bei 25 °C, 58,9 bei 100 °C (IAPWS), einer der höchsten Werte gewöhnlicher Flüssigkeiten (Ethanol 22, Quecksilber etwa 485). Wärmer tragen die Moleküle mehr Wärmeenergie, in jedem Moment halten weniger Brücken, und σ sinkt.',
      ],
    },
  },
  drink: {
    label: 'Der höchste Schluck',
    title: 'Wasser bis in die Baumspitze',
    height: 'Höhe des Baums',
    rows: { height: 'Höhe', pull: 'Nötiger Zug an der Spitze, nur um das Wasser zu halten', atm: 'Das ist', atmValue: 'das {n}-Fache des Luftdrucks' },
    signs: { model: 'ein Küstenmammutbaum (Modell)', sun: 'Sonne', m: '{n} m', limit: 'die Grenze', hyperion: 'Hyperion 116 m', pump: 'eine Pumpe: 10 m' },
    verbs: { sun: 'Lass die Sonne scheinen', hyperion: 'So hoch wie Hyperion' },
    hints: { watch: 'Schau, wie das Wasser steigt', broken: 'Tipp das Lineal weiter unten an', sun: 'Tipp die Sonne an', any: 'Tipp die Sonne oder das Lineal an' },
    says: {
      drink: {
        kid: 'Die Sonne wärmt die Blätter, und sie atmen Wasser aus. Jedes Molekül, das geht, zieht das nächste hinter sich nach oben, weil sie sich mit Wasserstoffbrücken festhalten. Der ganze Faden rückt einen Schritt hoch, von den Wurzeln bis zur Spitze!',
        sci: 'Transpiration: Wasser verdunstet aus den Blättern, und die Säule dahinter gerät unter Zug. Zusammengehalten durch Wasserstoffbrücken (Kohäsion) und an den Gefäßwänden (Adhäsion), steigt sie als Ganzes: die Kohäsions-Spannungs-Theorie von Dixon und Joly, 1894.',
      },
      step: { kid: 'Noch ein Schluck! Der ganze Faden einen Schritt höher.', sci: 'Noch ein Schritt: Die Säule bewegt sich als Ganzes.' },
      noDrink: {
        kid: 'Die Blätter haben Durst, aber eine Blase hat den Faden zerrissen: Das Wasser lässt sich nicht an ihr vorbeiziehen. Mach den Baum kleiner.',
        sci: 'Die Säule ist kavitiert: Eine Luftblase (eine Embolie) unterbricht sie, und der Zug kann kein Wasser mehr über die Lücke ziehen.',
      },
      broken: { kid: 'Zu hoch! Der Zug an der Spitze ist so stark, dass der Faden reißen kann und eine Luftblase hineinkommt.', sci: 'Über etwa 130 m übersteigt die nötige Spannung, was die Blätter vertragen, und die Säulen drohen durch Kavitation zu reißen.' },
      thirsty: {
        kid: 'Höher als etwa 122 m bekommen die Blätter an der Spitze kaum noch Wasser: Sie werden blass und wachsen nicht mehr.',
        sci: '122 bis 130 m: die vorhergesagte Höchsthöhe (Koch und Kollegen, Nature, 2004). An der Spitze hält Wassermangel die Blätter vom Wachsen ab und bremst die Photosynthese.',
      },
      hyperion: {
        kid: 'Das ist ungefähr so hoch wie Hyperion, ein Küstenmammutbaum in Kalifornien: etwa 116 m, der höchste lebende Baum, den wir kennen!',
        sci: 'Hyperion, ein Küstenmammutbaum (Sequoia sempervirens) im Redwood-Nationalpark, 2006 entdeckt: etwa 116 m, der höchste bekannte lebende Baum.',
      },
      lower: { kid: 'Ein kleinerer Baum: ein leichter Schluck.', sci: 'Ein niedrigerer Baum: weniger Spannung an der Spitze nötig.' },
    },
    panel: {
      kid: [
        'Ein Baum hat keine Pumpe. Die Sonne wärmt seine Blätter, und sie atmen Wasserdampf aus; jedes Wassermolekül, das geht, zieht das nächste nach oben, und das wieder das nächste, bis hinunter zu den Wurzeln. Das Wasser hängt in einem langen Faden zusammen, gehalten von Wasserstoffbrücken.',
        'Eine Saugpumpe kann Wasser nur etwa 10 m hochheben. Ein Baum zieht es mehr als zehnmal so hoch! Schieb die Höhe oder tipp das Lineal an: Über etwa 122 bis 130 m wäre der Zug zu stark, und ungefähr so hoch werden die höchsten Bäume.',
      ],
      sci: [
        'Eine h Meter hohe Säule zu halten, braucht an ihrer Spitze eine Spannung von ρgh: etwa 0,01 MPa pro Meter, 1,1 MPa für 116 m, das Elffache des Luftdrucks, und das Fließen durch das Holz braucht noch mehr. Wasser hält eine solche Spannung nur aus, weil Wasserstoffbrücken es zusammenhalten; eine Saugpumpe, von der Luft gedrückt, schafft höchstens etwa 10,3 m.',
        'Koch, Sillett, Jennings und Davis kletterten auf die höchsten Mammutbäume und maßen, wie der Wasserstress der Blätter mit der Höhe zunimmt. Sie sagten eine größte Baumhöhe von 122 bis 130 m voraus (Nature, 2004): Darüber hätten die Blätter zu wenig Wasser zum Wachsen, und die gedehnten Säulen drohten zu reißen. Der höchste gemessene, Hyperion, ist etwa 116 m hoch.',
      ],
    },
  },
  whatif: {
    label: 'Was wäre, wenn?',
    title: 'Wasser ohne Wasserstoffbrücken',
    signs: { chart: 'Siedepunkt', about: 'etwa −80 °C', far: 'weit unter null', pond: 'der Teich heute Abend, etwa 20 °C', jar: 'Teichwasser', on: 'Wasserstoffbrücken: AN', off: 'Wasserstoffbrücken: AUS' },
    verbs: { off: 'Schalte die Wasserstoffbrücken aus', on: 'Schalte sie wieder ein' },
    hints: { off: 'Tipp den Hebel an', on: 'Tipp den Hebel noch einmal an' },
    rows: { trend: 'H₂O nach dem Trend', trendValue: 'etwa −80 °C' },
    says: {
      off: {
        kid: 'Was wäre, wenn Wasser keine Wasserstoffbrücken hätte? Es würde weit unter null kochen, wie sein Cousin, der Schwefelwasserstoff. Der Teich ist viel wärmer, also verkocht er zu Dampf! Keine Meere, keine Teiche, keine Wasserläufer.',
        sci: 'Ohne Wasserstoffbrücken würde der Siedepunkt des Wassers seinen schwereren Cousins H₂Te, H₂Se und H₂S folgen, bis etwa −80 °C. Bei 20 °C läge der Teich hundert Grad darüber und würde zu Dampf.',
      },
      on: {
        kid: 'Puh! Wasserstoffbrücken wieder an: Der Dampf wird wieder zu Wasser, und der Teich ist wieder ein Teich.',
        sci: 'Wasserstoffbrücken zurück: Siedepunkt 100 °C bei 1 atm, und der Dampf kondensiert.',
      },
    },
    panel: {
      kid: [
        'Dieser Hebel macht etwas Unmögliches, nur zum Anschauen: Er schaltet die Wasserstoffbrücken des Wassers aus. Die Cousins des Wassers, aus Wasserstoff mit Schwefel, Selen oder Tellur (den Elementen unter dem Sauerstoff), haben keine starken Wasserstoffbrücken, und an einem warmen Tag sind sie alle Gase.',
        'Folge ihren Punkten auf dem Diagramm bis zum Platz des Wassers: Wasser müsste weit unter null kochen. Stattdessen kocht es bei 100 °C, weil seine Moleküle einander festhalten. Darum hat die Erde Meere, und darum gibt es dich und den Wasserläufer.',
      ],
      sci: [
        'Siedepunkte bei 1 atm: H₂Te −2 °C, H₂Se −41 °C, H₂S −60 °C. Leichtere Moleküle haben schwächere Dispersionskräfte, darum fällt der Trend zum oberen Ende der Gruppe hin, bis etwa −80 °C für H₂O. Wasser kocht stattdessen bei 100 °C: Jedes Molekül muss sich von seinen Wasserstoffbrücken losreißen.',
        'Die Hydride der Gruppe 14 (grau: CH₄, SiH₄, GeH₄, SnH₄) bilden keine Wasserstoffbrücken und fallen gleichmäßig bis zum Methan bei −161,5 °C. NH₃ und HF brechen ihre Trends auf dieselbe Weise, schwächer. Der hohe Siedepunkt des Wassers, seine Verdampfungswärme (40,7 kJ/mol bei 100 °C) und seine Wärmekapazität halten die Ozeane flüssig.',
      ],
    },
  },
}

export const BOND_WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
