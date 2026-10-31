// The words of hydrogen's airship room ("How can a gas lift a ship?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/H.js (the easel shows it); the room shows it happening and adds to it.
// Sources: Charles's flight of 1 December 1783 (Wikipedia, "Jacques Charles": 13:45 from the Tuileries,
// 2 h 5 min, 36 km to Nesles-la-Vallée, the valve, net and sand ballast, Joseph Montgolfier's green pilot
// balloon, Franklin in the enclosure, about 400,000 people reported, Charles alone to about 3000 m where he
// saw the sun again, down about 3 km away; the V&A's "Flying high": barrels of iron filings and acid, the gas
// through water into the envelope, rubberised silk in red and yellow, the blue and gold car; R. Béving,
// Arc-en-ciel 136: 26 French feet across). The Montgolfier flight of 21 November 1783 from the Château de la
// Muette. Densities at 20 °C and 1 atm: air 1.204, helium 0.166, hydrogen 0.084 kg/m3; hot air by Charles's
// law. LZ 129 Hindenburg (Wikipedia): first flight 4 March 1936, 245 m, 41 m across, 16 gas cells, about
// 200,000 m3, decks A and B in the hull, 17 round trips in 1936 (10 to the US, 7 to Brazil), the Helium
// Control Act of 1927; 6 May 1937 at Lakehurst, 36 passengers and 61 crew, 13 and 22 of them and one man of
// the ground crew died. The size of Charles's balloon and its load are not known exactly: the room's balance
// shows a model, and the words say "about" and "accounts give".
// Placeholders: {n} (a percentage, or bags left), {t} (°C), {kg} (lift per cubic metre), {rho} (density).
export const AIRSHIP_WORDS = {
  en: {
    title: 'The Tuileries, 1783',
    greet: {
      kid: 'We are inside the picture: the Tuileries garden in Paris, on 1 December 1783. A huge crowd has come to watch two men go up in a balloon full of hydrogen! The picture\'s story is on the easel beside you.',
      sci: 'The Jardin des Tuileries, Paris, 1 December 1783, early afternoon: Jacques Charles and Nicolas-Louis Robert are about to ascend in a balloon of hydrogen. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Before the launch, Charles asked Joseph Montgolfier, who had invented the hot-air balloon, to let a little green balloon go first, to see which way the wind was blowing.',
        'After landing, Charles went up again on his own. He rose so high that he saw the sun again, after it had already set for the people on the ground!',
        'Charles gave his balloon a valve at the top to let gas out, sandbags to throw out, and a net to hold the car. Gas balloons are still built like that.',
      ],
      sci: [
        'Joseph Montgolfier released a small green pilot balloon to read the wind before the ascent. Benjamin Franklin, the American envoy in Paris, watched from the subscribers\' enclosure; the crowd was reported at some 400,000.',
        'After landing at Nesles-la-Vallée, Charles went up again alone, the balloon lighter by Robert\'s weight: to about 3000 m by his barometer, where he saw the sun, already set below, once more. Then he let gas out and came down about 3 km away.',
        'Charles\'s law, the volume of a gas at constant pressure growing in proportion to its absolute temperature, carries his name: he found it around 1787, and Gay-Lussac published it in 1802.',
      ],
    },
    charliere: {
      label: 'Charles\'s balloon',
      title: 'Filling La Charlière',
      dial: 'pull',
      slider: 'Hydrogen in the balloon',
      percent: '{n}% full',
      hints: {
        fill: 'Tap the barrels to make hydrogen',
        more: 'Tap the barrels again ({n}% full)',
        heavy: 'Too heavy, tap a sandbag or the barrels',
        ropes: 'Light enough! Tap the ropes to let go',
        flying: 'Tap a sandbag to climb faster',
        watch: 'Watch it fly away',
        gone: 'A new balloon is coming',
      },
      buttons: { fill: 'Acid on the iron', bag: 'Drop a sandbag', ropes: 'Let go of the ropes' },
      says: {
        fill: { kid: 'The acid fizzes on the iron filings, and hydrogen bubbles through the tub of water and up the hose. The balloon swells: {n}% full.', sci: 'Iron and dilute sulfuric acid, Fe + H2SO4 -> FeSO4 + H2, the gas washed through the water tub into the envelope. {n}% full.' },
        full: { kid: 'Full! The silk is round and tight.', sci: 'Full: a sphere about 8.5 m across, some 320 m³ of hydrogen.' },
        already: { kid: 'It is already full: the silk cannot hold any more.', sci: 'Full: no room for more gas.' },
        empty: { kid: 'Let go now? With so little gas it could not even lift its own silk. Tap the barrels!', sci: 'Far too little hydrogen to lift even the envelope.' },
        heavy: { kid: 'The men let go of the ropes, but it just sat there: too heavy! The silk, the car, two men and their sand weigh more than the lift. More gas, or less sand.', sci: 'Lift below load: it stays down. Add hydrogen or drop ballast.' },
        bag: { kid: 'Out goes a sandbag. Sandbags left: {n}.', sci: 'Ballast dropped. Bags left: {n}.' },
        light: { kid: 'Out goes a sandbag, and the balloon tugs at its ropes: now everything together is lighter than the air it pushes aside!', sci: 'Ballast dropped: lift now exceeds load. Bags left: {n}.' },
        rise: { kid: 'Let go! Up they go, waving their hats, while the crowd cheers. The wind carries them away over the trees.', sci: 'Released: lift exceeds weight, so it climbs, and the wind carries it north, toward Nesles-la-Vallée, 36 km away.' },
        bagUp: { kid: 'Sand pours out, and up it goes, faster!', sci: 'Ballast dropped in flight: lighter, it climbs faster.' },
        noBags: { kid: 'There is no sand left to drop.', sci: 'No ballast left.' },
        flying: { kid: 'They are flying! When they are out of sight, a new balloon will be laid out.', sci: 'In flight. A fresh envelope will be laid out after it.' },
      },
      panel: {
        kid: [
          'Charles and the Robert brothers made their hydrogen in barrels: acid poured onto iron filings fizzes and gives off the gas. It bubbled through a tub of water and up a hose into the balloon. It was slow work.',
          'The silk was painted with rubber, so the tiny hydrogen molecules could not slip through. A balloon goes up when everything together, the gas, the silk, the car, the people and the sand, weighs less than the air the balloon pushes aside. Drop sand, and it rises; let gas out, and it comes down.',
          'On 1 December 1783 Charles and Robert flew for about two hours, over the countryside to the village of Nesles-la-Vallée, 36 km away.',
        ],
        sci: [
          'Hydrogen from iron and dilute sulfuric acid, Fe + H₂SO₄ → FeSO₄ + H₂, made in barrels whose gas was led through a vessel of water, which cleaned and cooled it, into an envelope of silk varnished with rubber, about 26 French feet (some 8.5 m) across.',
          'Buoyancy: the air displaced weighs about 1.2 kg per cubic metre and hydrogen 0.08 kg, so each cubic metre lifts about 1.1 kg. A sphere 8.5 m across holds about 320 m³ (accounts give up to 380), enough in principle for some 350 kg: envelope, net, car, two men and ballast. The balance on the post shows the pull left over; its load is a model, not a recorded weight.',
          'Charles\'s balloon had the features of every gas balloon since: a valve at the crown to let gas out, sand ballast to drop, a net over the envelope carrying the car. Released at 13:45 on 1 December 1783, it flew 2 hours 5 minutes and about 36 km, to Nesles-la-Vallée.',
        ],
      },
    },
    race: {
      label: 'The gas race',
      title: 'Which gas lifts best?',
      names: { hot: 'hot air', air: 'air', he: 'helium', h2: 'hydrogen' },
      slider: 'Hot air',
      degrees: '{t} °C',
      hints: {
        first: 'Tap a balloon to fill it',
        more: 'Tap another balloon',
        lens: 'Tap the lens to weigh the molecules',
        hot: 'Tap a balloon to empty or fill it',
      },
      buttons: { all: 'Fill them all', none: 'Empty them all', lens: 'Weigh the molecules' },
      lensWords: {
        inside: { kid: '12 hydrogen molecules: light', sci: '12 H2 × 2 u = 24 u' },
        outside: { kid: '12 air molecules: heavy', sci: '12 air × 29 u = 348 u' },
      },
      says: {
        air: { kid: 'Air inside air: it just lies on the ground. The scale reads nothing.', sci: 'Air in air displaces its own weight: no lift (the skin\'s own weight not counted).' },
        he: { kid: 'Helium! It pulls up about 1 kg for every cubic metre.', sci: 'Helium, 0.166 kg/m³: lift 1.04 kg per cubic metre, 93% of hydrogen\'s.' },
        h2: { kid: 'Hydrogen pulls hardest of all: about 1.1 kg for every cubic metre!', sci: 'Hydrogen, 0.084 kg/m³: lift 1.12 kg per cubic metre, the most any gas can give.' },
        hot: { kid: 'Air heated to {t} °C lifts only {kg} kg per cubic metre. That is why hot-air balloons are so big!', sci: 'Air at {t} °C: {rho} kg/m³ against 1.20 outside, so the lift is {kg} kg per cubic metre.' },
        cold: { kid: 'The fire is so low that the air inside is no warmer than outside: no lift.', sci: 'At 20 °C inside and out: no lift.' },
        all: { kid: 'All four filled: look at the scales!', sci: 'All four filled: compare the scales.' },
        empty: { kid: 'Emptied.', sci: 'Emptied.' },
        lens: { kid: 'Count them: 12 on each side! At the same push and warmth, every gas has the same number of molecules in a box. But each hydrogen molecule weighs about 14 times less than an air molecule.', sci: 'Equal volumes at equal temperature and pressure hold equal numbers of molecules (Avogadro, 1811). H₂ has a mass of 2 u, air about 29 u on average: the hydrogen side is about 14 times lighter.' },
        lensOff: { kid: 'Look how the little hydrogen molecules zoom about, much faster than the air ones!', sci: 'At the same temperature H₂ moves about four times faster than the air\'s molecules: on average about 1.75 km/s against 0.46 km/s.' },
      },
      panel: {
        kid: [
          'Each balloon here holds one cubic metre, as much as a box one metre long on every side. That much air weighs about 1.2 kg. Fill the balloon with a lighter gas and the air around pushes it up with the difference: that is what the scales show.',
          'Hydrogen is the lightest gas, so it pulls hardest. Helium is twice as heavy as hydrogen but still very light, so it pulls almost as hard. Hot air is only a little lighter than cold air, so hot-air balloons have to be huge.',
          'The lens shows the skin of the hydrogen balloon. You might think there are fewer molecules inside, but there are just as many as outside! Hydrogen wins because each of its molecules is so light.',
        ],
        sci: [
          'Archimedes: the upward force equals the weight of the air displaced. At 20 °C and 1 atm air weighs 1.204 kg/m³, helium 0.166 and hydrogen 0.084, so a cubic metre of helium lifts 1.04 kg and one of hydrogen 1.12 kg; the envelope\'s own weight comes off both.',
          'Hot air: at constant pressure a gas\'s density falls as 1/T (Charles\'s law). At 100 °C air weighs 0.95 kg/m³ and lifts only 0.26 kg per cubic metre, under a quarter of hydrogen\'s lift. The Montgolfiers\' first crewed flight, on 21 November 1783 (Pilâtre de Rozier and the Marquis d\'Arlandes, from the Château de la Muette), came ten days before Charles\'s.',
          'Avogadro (1811): equal volumes of gases at the same temperature and pressure hold equal numbers of molecules, about 2.5 × 10²⁵ per cubic metre at 20 °C. The pressure on both sides of the skin is the same, the light H₂ molecules hitting just as hard by moving faster. The lift comes from the air pressing about 12 Pa per metre of height harder below than above.',
        ],
      },
    },
    helium: {
      label: 'Why helium now',
      title: 'Hydrogen burns, helium does not',
      hints: {
        model: 'Tap the airship model',
        decks: 'Tap the model again for its decks',
        h2: 'Tap the hydrogen balloon',
        he: 'Tap the helium balloon',
        again: 'Tap a balloon or the model',
      },
      buttons: { model: 'Light the model', h2: 'Candle to the hydrogen', he: 'Candle to the helium' },
      says: {
        cells: { kid: 'Inside its silver skin: 16 enormous gas bags, all full of hydrogen.', sci: 'LZ 129 at 1:100: 245 m long, 16 gas cells holding about 200,000 m³ of hydrogen.' },
        decks: { kid: 'And here the passengers lived: cabins, a dining room and a lounge with windows, inside the airship\'s belly.', sci: 'Decks A and B inside the hull: cabins, dining room, lounge and writing room above; washrooms, a bar and even a smoking room below.' },
        dark: { kid: 'The model goes dark again.', sci: 'Lights off.' },
        whoomp: { kid: 'Whoomp! The hydrogen burns all at once in a ball of flame.', sci: 'The torn skin lets the hydrogen meet the air: it burns in one flash, 2 H2 + O2 -> 2 H2O.' },
        pop: { kid: 'Pop! The helium balloon just bursts. Helium cannot burn at all.', sci: 'Helium, a noble gas, does not burn: the flame only melts the rubber.' },
      },
      panel: {
        kid: [
          'This is a model of the Hindenburg, the biggest airship that ever flew: longer than two football pitches. In 1936 it carried passengers across the Atlantic. It was built to fly on helium, but it had to use hydrogen, because the United States, which had nearly all the world\'s helium, would not sell it.',
          'In 1937, as it came in to land in New Jersey, it caught fire and burned in about half a minute. Most of the people on board, 62 of the 97, escaped. Since then airships use helium, which lifts almost as well and cannot burn.',
          'The candle test is a classic science-show trick that teachers do with great care: a hydrogen balloon goes up in a ball of flame, a helium balloon only pops. Never try it yourself!',
        ],
        sci: [
          'LZ 129 Hindenburg (first flight 4 March 1936): 245 m long, 41 m across, 16 gas cells, about 200,000 m³. It was designed for helium, but the United States, nearly the only source, would not export it under the Helium Control Act (1927), so it was filled with hydrogen. In 1936 it made 17 round trips across the Atlantic, 10 to the United States and 7 to Brazil.',
          'On 6 May 1937, while mooring at Lakehurst, New Jersey, it caught fire and burned in about half a minute: 35 of the 97 on board (13 passengers, 22 crew) and one man of the ground crew died; 62 survived. Airships since have flown on helium, which the US Navy had used from the Shenandoah (1923) on.',
          'Hydrogen burns in air at anywhere from 4% to 75% by volume and needs very little energy to ignite; helium, a noble gas, cannot burn. It lifts 93% as much, but it is scarce: it comes from natural gas, where it gathered over millions of years from radioactive decay in the rocks.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'As Tulherias, 1783',
    greet: {
      kid: 'Estamos dentro da imagem: o jardim das Tulherias, em Paris, a 1 de dezembro de 1783. Juntou-se uma multidão enorme para ver dois homens subirem num balão cheio de hidrogénio! A história da imagem está no cavalete ao teu lado.',
      sci: 'O Jardin des Tuileries, Paris, 1 de dezembro de 1783, início da tarde: Jacques Charles e Nicolas-Louis Robert vão subir num balão de hidrogénio. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Antes da partida, Charles pediu a Joseph Montgolfier, o inventor do balão de ar quente, que soltasse primeiro um pequeno balão verde, para ver para que lado soprava o vento.',
        'Depois de aterrar, Charles voltou a subir sozinho. Subiu tão alto que voltou a ver o sol, quando para as pessoas lá em baixo ele já se tinha posto!',
        'Charles deu ao seu balão uma válvula no topo para deixar sair gás, sacos de areia para atirar fora e uma rede para segurar a barquinha. Os balões de gás ainda hoje se fazem assim.',
      ],
      sci: [
        'Joseph Montgolfier soltou um pequeno balão-piloto verde para ler o vento antes da subida. Benjamin Franklin, o enviado americano em Paris, assistiu do recinto dos subscritores; a multidão foi estimada em cerca de 400 000 pessoas.',
        'Depois de aterrar em Nesles-la-Vallée, Charles voltou a subir sozinho, com o balão mais leve sem o peso de Robert: até cerca de 3000 m, segundo o seu barómetro, onde voltou a ver o sol, que lá em baixo já se tinha posto. Depois deixou sair gás e desceu a cerca de 3 km dali.',
        'A lei de Charles, segundo a qual o volume de um gás a pressão constante cresce em proporção da sua temperatura absoluta, tem o seu nome: descobriu-a por volta de 1787, e Gay-Lussac publicou-a em 1802.',
      ],
    },
    charliere: {
      label: 'O balão de Charles',
      title: 'Encher a Charlière',
      dial: 'puxa',
      slider: 'Hidrogénio no balão',
      percent: '{n}% cheio',
      hints: {
        fill: 'Toca nos barris para fazer hidrogénio',
        more: 'Toca outra vez nos barris ({n}% cheio)',
        heavy: 'Pesado demais, toca num saco de areia ou nos barris',
        ropes: 'Já é leve que chegue! Toca nas cordas para o soltar',
        flying: 'Toca num saco de areia para subir mais depressa',
        watch: 'Vê-o voar para longe',
        gone: 'Vem aí um balão novo',
      },
      buttons: { fill: 'Ácido no ferro', bag: 'Largar um saco de areia', ropes: 'Soltar as cordas' },
      says: {
        fill: { kid: 'O ácido borbulha sobre a limalha de ferro, e o hidrogénio passa pela tina de água e sobe pela mangueira. O balão incha: {n}% cheio.', sci: 'Ferro e ácido sulfúrico diluído, Fe + H2SO4 -> FeSO4 + H2, o gás lavado na tina de água antes de entrar no invólucro. {n}% cheio.' },
        full: { kid: 'Cheio! A seda está redonda e esticada.', sci: 'Cheio: uma esfera com cerca de 8,5 m de diâmetro, uns 320 m³ de hidrogénio.' },
        already: { kid: 'Já está cheio: a seda não aguenta mais.', sci: 'Cheio: não há lugar para mais gás.' },
        empty: { kid: 'Soltá-lo já? Com tão pouco gás nem conseguia levantar a própria seda. Toca nos barris!', sci: 'Hidrogénio a menos até para levantar só o invólucro.' },
        heavy: { kid: 'Os homens largaram as cordas, mas ele ficou ali parado: pesado demais! A seda, a barquinha, dois homens e a areia pesam mais do que a força que o levanta. Mais gás, ou menos areia.', sci: 'Impulsão abaixo da carga: fica no chão. Junta hidrogénio ou larga lastro.' },
        bag: { kid: 'Lá vai um saco de areia. Sacos que restam: {n}.', sci: 'Lastro largado. Sacos que restam: {n}.' },
        light: { kid: 'Lá vai um saco de areia, e o balão puxa pelas cordas: agora tudo junto pesa menos do que o ar que ele afasta!', sci: 'Lastro largado: a impulsão já excede a carga. Sacos que restam: {n}.' },
        rise: { kid: 'Soltem! Lá vão eles para cima, a acenar com os chapéus, enquanto a multidão aplaude. O vento leva-os para longe, por cima das árvores.', sci: 'Solto: a impulsão excede o peso, por isso sobe, e o vento leva-o para norte, na direção de Nesles-la-Vallée, a 36 km.' },
        bagUp: { kid: 'A areia cai, e lá sobe ele, mais depressa!', sci: 'Lastro largado em voo: mais leve, sobe mais depressa.' },
        noBags: { kid: 'Já não há areia para largar.', sci: 'Sem lastro.' },
        flying: { kid: 'Estão a voar! Quando desaparecerem de vista, vão estender um balão novo.', sci: 'Em voo. Depois dele será estendido um invólucro novo.' },
      },
      panel: {
        kid: [
          'Charles e os irmãos Robert faziam o hidrogénio em barris: o ácido deitado sobre limalha de ferro borbulha e liberta o gás. Este passava por uma tina de água e subia por uma mangueira até ao balão. Era um trabalho lento.',
          'A seda estava pintada com borracha, para que as minúsculas moléculas de hidrogénio não passassem por ela. Um balão sobe quando tudo junto, o gás, a seda, a barquinha, as pessoas e a areia, pesa menos do que o ar que o balão afasta. Larga areia e ele sobe; deixa sair gás e ele desce.',
          'A 1 de dezembro de 1783, Charles e Robert voaram cerca de duas horas, por cima dos campos, até à aldeia de Nesles-la-Vallée, a 36 km.',
        ],
        sci: [
          'Hidrogénio a partir de ferro e ácido sulfúrico diluído, Fe + H₂SO₄ → FeSO₄ + H₂, produzido em barris cujo gás passava por um recipiente com água, que o lavava e arrefecia, até um invólucro de seda envernizada com borracha, com cerca de 26 pés franceses (uns 8,5 m) de diâmetro.',
          'Impulsão: o ar deslocado pesa cerca de 1,2 kg por metro cúbico e o hidrogénio 0,08 kg, por isso cada metro cúbico levanta cerca de 1,1 kg. Uma esfera com 8,5 m de diâmetro contém cerca de 320 m³ (há relatos de até 380), o que em princípio chega para uns 350 kg: invólucro, rede, barquinha, dois homens e lastro. A balança no poste mostra a força que sobra; a carga dela é um modelo, não um peso registado.',
          'O balão de Charles tinha o que todos os balões de gás têm desde então: uma válvula no topo para deixar sair gás, lastro de areia para largar, uma rede sobre o invólucro a segurar a barquinha. Solto às 13h45 de 1 de dezembro de 1783, voou 2 horas e 5 minutos e cerca de 36 km, até Nesles-la-Vallée.',
        ],
      },
    },
    race: {
      label: 'A corrida dos gases',
      title: 'Que gás levanta mais?',
      names: { hot: 'ar quente', air: 'ar', he: 'hélio', h2: 'hidrogénio' },
      slider: 'Ar quente',
      degrees: '{t} °C',
      hints: {
        first: 'Toca num balão para o encher',
        more: 'Toca noutro balão',
        lens: 'Toca na lupa para pesar as moléculas',
        hot: 'Toca num balão para o esvaziar ou encher',
      },
      buttons: { all: 'Encher todos', none: 'Esvaziar todos', lens: 'Pesar as moléculas' },
      lensWords: {
        inside: { kid: '12 moléculas de hidrogénio: leves', sci: '12 H2 × 2 u = 24 u' },
        outside: { kid: '12 moléculas de ar: pesadas', sci: '12 ar × 29 u = 348 u' },
      },
      says: {
        air: { kid: 'Ar dentro de ar: fica deitado no chão. A balança não marca nada.', sci: 'Ar no ar desloca o seu próprio peso: nenhuma impulsão (sem contar com o peso da pele).' },
        he: { kid: 'Hélio! Puxa para cima cerca de 1 kg por cada metro cúbico.', sci: 'Hélio, 0,166 kg/m³: impulsão de 1,04 kg por metro cúbico, 93% da do hidrogénio.' },
        h2: { kid: 'O hidrogénio é o que puxa com mais força: cerca de 1,1 kg por cada metro cúbico!', sci: 'Hidrogénio, 0,084 kg/m³: impulsão de 1,12 kg por metro cúbico, o máximo que um gás pode dar.' },
        hot: { kid: 'Ar aquecido a {t} °C levanta só {kg} kg por metro cúbico. É por isso que os balões de ar quente são tão grandes!', sci: 'Ar a {t} °C: {rho} kg/m³ contra 1,20 cá fora, por isso a impulsão é de {kg} kg por metro cúbico.' },
        cold: { kid: 'O fogo está tão baixo que o ar lá dentro não está mais quente do que cá fora: nada de impulsão.', sci: 'A 20 °C dentro e fora: nenhuma impulsão.' },
        all: { kid: 'Os quatro cheios: olha para as balanças!', sci: 'Os quatro cheios: compara as balanças.' },
        empty: { kid: 'Esvaziado.', sci: 'Esvaziado.' },
        lens: { kid: 'Conta-as: 12 de cada lado! Com o mesmo empurrão e o mesmo calor, qualquer gás tem o mesmo número de moléculas numa caixa. Mas cada molécula de hidrogénio pesa cerca de 14 vezes menos do que uma molécula de ar.', sci: 'Volumes iguais à mesma temperatura e pressão contêm o mesmo número de moléculas (Avogadro, 1811). O H₂ tem massa 2 u, o ar cerca de 29 u em média: o lado do hidrogénio é cerca de 14 vezes mais leve.' },
        lensOff: { kid: 'Olha como as pequenas moléculas de hidrogénio andam a toda a velocidade, muito mais depressa do que as do ar!', sci: 'À mesma temperatura, o H₂ move-se cerca de quatro vezes mais depressa do que as moléculas do ar: em média cerca de 1,75 km/s contra 0,46 km/s.' },
      },
      panel: {
        kid: [
          'Cada balão aqui leva um metro cúbico, tanto como uma caixa com um metro de cada lado. Esse ar todo pesa cerca de 1,2 kg. Enche o balão com um gás mais leve e o ar à volta empurra-o para cima com a diferença: é isso que as balanças mostram.',
          'O hidrogénio é o gás mais leve, por isso é o que puxa com mais força. O hélio pesa o dobro do hidrogénio, mas continua muito leve, por isso puxa quase tanto. O ar quente é só um bocadinho mais leve do que o ar frio, por isso os balões de ar quente têm de ser enormes.',
          'A lupa mostra a pele do balão de hidrogénio. Talvez penses que há menos moléculas lá dentro, mas há tantas como cá fora! O hidrogénio ganha porque cada uma das suas moléculas é muito leve.',
        ],
        sci: [
          'Arquimedes: a força para cima é igual ao peso do ar deslocado. A 20 °C e 1 atm, o ar pesa 1,204 kg/m³, o hélio 0,166 e o hidrogénio 0,084, por isso um metro cúbico de hélio levanta 1,04 kg e um de hidrogénio 1,12 kg; o peso do próprio invólucro desconta-se aos dois.',
          'Ar quente: a pressão constante, a densidade de um gás cai como 1/T (lei de Charles). A 100 °C o ar pesa 0,95 kg/m³ e levanta só 0,26 kg por metro cúbico, menos de um quarto da impulsão do hidrogénio. O primeiro voo tripulado dos Montgolfier, a 21 de novembro de 1783 (Pilâtre de Rozier e o marquês d\'Arlandes, a partir do Château de la Muette), foi dez dias antes do de Charles.',
          'Avogadro (1811): volumes iguais de gases à mesma temperatura e pressão contêm o mesmo número de moléculas, cerca de 2,5 × 10²⁵ por metro cúbico a 20 °C. A pressão é a mesma dos dois lados da pele: as leves moléculas de H₂ batem com a mesma força porque andam mais depressa. A impulsão vem do ar, que empurra cerca de 12 Pa por metro de altura mais por baixo do que por cima.',
        ],
      },
    },
    helium: {
      label: 'Porquê hélio hoje',
      title: 'O hidrogénio arde, o hélio não',
      hints: {
        model: 'Toca na maqueta do dirigível',
        decks: 'Toca outra vez na maqueta para veres os conveses',
        h2: 'Toca no balão de hidrogénio',
        he: 'Toca no balão de hélio',
        again: 'Toca num balão ou na maqueta',
      },
      buttons: { model: 'Iluminar a maqueta', h2: 'Vela ao hidrogénio', he: 'Vela ao hélio' },
      says: {
        cells: { kid: 'Debaixo da pele prateada: 16 sacos de gás enormes, todos cheios de hidrogénio.', sci: 'LZ 129 à escala 1:100: 245 m de comprimento, 16 células de gás com cerca de 200 000 m³ de hidrogénio.' },
        decks: { kid: 'E aqui viviam os passageiros: camarotes, uma sala de jantar e uma sala de estar com janelas, dentro da barriga do dirigível.', sci: 'Os conveses A e B dentro do casco: camarotes, sala de jantar, sala de estar e sala de escrita em cima; casas de banho, um bar e até uma sala de fumo em baixo.' },
        dark: { kid: 'A maqueta volta a ficar às escuras.', sci: 'Luzes apagadas.' },
        whoomp: { kid: 'Vuuum! O hidrogénio arde todo de uma vez, numa bola de fogo.', sci: 'A pele rasgada deixa o hidrogénio encontrar o ar: arde num só clarão, 2 H2 + O2 -> 2 H2O.' },
        pop: { kid: 'Pum! O balão de hélio só rebenta. O hélio não consegue arder.', sci: 'O hélio, um gás nobre, não arde: a chama só derrete a borracha.' },
      },
      panel: {
        kid: [
          'Esta é uma maqueta do Hindenburg, o maior dirigível que alguma vez voou: mais comprido do que dois campos de futebol. Em 1936 levou passageiros através do Atlântico. Foi construído para voar com hélio, mas teve de usar hidrogénio, porque os Estados Unidos, que tinham quase todo o hélio do mundo, não o vendiam.',
          'Em 1937, quando chegava para aterrar em Nova Jérsia, pegou fogo e ardeu em cerca de meio minuto. A maior parte das pessoas a bordo, 62 das 97, escapou. Desde então os dirigíveis usam hélio, que levanta quase tanto e não arde.',
          'O teste da vela é um truque clássico dos espetáculos de ciência, que os professores fazem com muito cuidado: um balão de hidrogénio sobe numa bola de fogo, um balão de hélio só rebenta. Nunca o experimentes sozinho!',
        ],
        sci: [
          'LZ 129 Hindenburg (primeiro voo a 4 de março de 1936): 245 m de comprimento, 41 m de diâmetro, 16 células de gás, cerca de 200 000 m³. Foi projetado para hélio, mas os Estados Unidos, praticamente a única fonte, não o exportavam ao abrigo do Helium Control Act (1927), por isso foi cheio com hidrogénio. Em 1936 fez 17 viagens de ida e volta através do Atlântico, 10 aos Estados Unidos e 7 ao Brasil.',
          'A 6 de maio de 1937, ao atracar em Lakehurst, Nova Jérsia, pegou fogo e ardeu em cerca de meio minuto: morreram 35 das 97 pessoas a bordo (13 passageiros, 22 tripulantes) e um homem da equipa de terra; 62 sobreviveram. Desde então os dirigíveis voam com hélio, que a Marinha dos Estados Unidos já usava desde o Shenandoah (1923).',
          'O hidrogénio arde no ar em qualquer proporção entre 4% e 75% em volume e precisa de muito pouca energia para se inflamar; o hélio, um gás nobre, não arde. Levanta 93% do que o hidrogénio levanta, mas é escasso: vem do gás natural, onde se foi juntando ao longo de milhões de anos a partir do decaimento radioativo nas rochas.',
        ],
      },
    },
  },
  pl: {
    title: 'Tuileries, 1783',
    greet: {
      kid: 'Jesteśmy w środku obrazka: w ogrodzie Tuileries w Paryżu, 1 grudnia 1783 roku. Zebrał się ogromny tłum, żeby zobaczyć, jak dwaj ludzie wznoszą się w balonie pełnym wodoru! Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Jardin des Tuileries, Paryż, 1 grudnia 1783 roku, wczesne popołudnie: Jacques Charles i Nicolas-Louis Robert zaraz wzniosą się w balonie z wodorem. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Przed startem Charles poprosił Josepha Montgolfiera, wynalazcę balonu na ogrzane powietrze, żeby najpierw puścił mały zielony balonik i sprawdził, w którą stronę wieje wiatr.',
        'Po wylądowaniu Charles wzniósł się jeszcze raz, sam. Poleciał tak wysoko, że znowu zobaczył słońce, choć dla ludzi na ziemi już zaszło!',
        'Charles dał swojemu balonowi zawór na górze do wypuszczania gazu, worki z piaskiem do wyrzucania i siatkę, na której wisiał kosz. Balony gazowe buduje się tak do dziś.',
      ],
      sci: [
        'Joseph Montgolfier wypuścił przed startem mały zielony balon pilotowy, żeby odczytać wiatr. Benjamin Franklin, wysłannik amerykański w Paryżu, patrzył z ogrodzenia dla subskrybentów; tłum szacowano na około 400 000 osób.',
        'Po wylądowaniu w Nesles-la-Vallée Charles wzniósł się ponownie sam, w balonie lżejszym o wagę Roberta: na około 3000 m według barometru, gdzie znowu zobaczył słońce, które na dole już zaszło. Potem wypuścił gaz i wylądował około 3 km dalej.',
        'Prawo Charles’a, według którego objętość gazu przy stałym ciśnieniu rośnie proporcjonalnie do jego temperatury bezwzględnej, nosi jego imię: odkrył je około 1787 roku, a Gay-Lussac opublikował je w 1802.',
      ],
    },
    charliere: {
      label: 'Balon Charles’a',
      title: 'Napełnianie Charlière',
      dial: 'ciąg',
      slider: 'Wodór w balonie',
      percent: 'pełny w {n}%',
      hints: {
        fill: 'Dotknij beczek, żeby zrobić wodór',
        more: 'Dotknij beczek jeszcze raz (pełny w {n}%)',
        heavy: 'Za ciężki, dotknij worka z piaskiem albo beczek',
        ropes: 'Już dość lekki! Dotknij lin, żeby go puścić',
        flying: 'Dotknij worka z piaskiem, żeby wznosić się szybciej',
        watch: 'Patrz, jak odlatuje',
        gone: 'Nadchodzi nowy balon',
      },
      buttons: { fill: 'Kwas na żelazo', bag: 'Zrzuć worek z piaskiem', ropes: 'Puść liny' },
      says: {
        fill: { kid: 'Kwas syczy na opiłkach żelaza, a wodór bulgocze przez kadź z wodą i płynie wężem w górę. Balon pęcznieje: pełny w {n}%.', sci: 'Żelazo i rozcieńczony kwas siarkowy, Fe + H2SO4 -> FeSO4 + H2; gaz przemyty w kadzi z wodą płynie do powłoki. Pełny w {n}%.' },
        full: { kid: 'Pełny! Jedwab jest okrągły i napięty.', sci: 'Pełny: kula o średnicy około 8,5 m, jakieś 320 m³ wodoru.' },
        already: { kid: 'Już jest pełny: jedwab nie zmieści więcej.', sci: 'Pełny: nie ma miejsca na więcej gazu.' },
        empty: { kid: 'Puścić go już teraz? Przy tak małej ilości gazu nie uniósłby nawet własnego jedwabiu. Dotknij beczek!', sci: 'Za mało wodoru, żeby unieść choćby samą powłokę.' },
        heavy: { kid: 'Ludzie puścili liny, ale balon ani drgnął: za ciężki! Jedwab, kosz, dwaj ludzie i piasek ważą więcej, niż wynosi siła nośna. Więcej gazu albo mniej piasku.', sci: 'Siła nośna mniejsza od obciążenia: zostaje na ziemi. Dodaj wodoru albo zrzuć balast.' },
        bag: { kid: 'Leci worek z piaskiem. Worki na pokładzie: {n}.', sci: 'Balast zrzucony. Worki na pokładzie: {n}.' },
        light: { kid: 'Leci worek z piaskiem, a balon szarpie za liny: teraz wszystko razem waży mniej niż powietrze, które rozpycha!', sci: 'Balast zrzucony: siła nośna przewyższa obciążenie. Worki na pokładzie: {n}.' },
        rise: { kid: 'Puszczamy! W górę, a oni machają kapeluszami, a tłum wiwatuje. Wiatr unosi ich daleko nad drzewami.', sci: 'Puszczony: siła nośna przewyższa ciężar, więc się wznosi, a wiatr niesie go na północ, w stronę Nesles-la-Vallée, 36 km stąd.' },
        bagUp: { kid: 'Piasek się sypie, a balon leci w górę, szybciej!', sci: 'Balast zrzucony w locie: lżejszy, wznosi się szybciej.' },
        noBags: { kid: 'Nie ma już piasku do zrzucenia.', sci: 'Brak balastu.' },
        flying: { kid: 'Lecą! Kiedy znikną z oczu, ludzie rozłożą nowy balon.', sci: 'W locie. Potem zostanie rozłożona nowa powłoka.' },
      },
      panel: {
        kid: [
          'Charles i bracia Robert robili wodór w beczkach: kwas wylany na opiłki żelaza syczy i wydziela gaz. Gaz bulgotał przez kadź z wodą i płynął wężem do balonu. To była powolna praca.',
          'Jedwab był pomalowany gumą, żeby malutkie cząsteczki wodoru nie mogły się przez niego przecisnąć. Balon unosi się, kiedy wszystko razem, gaz, jedwab, kosz, ludzie i piasek, waży mniej niż powietrze, które balon rozpycha. Zrzuć piasek, a się wzniesie; wypuść gaz, a opadnie.',
          '1 grudnia 1783 roku Charles i Robert lecieli około dwóch godzin, nad polami, aż do wioski Nesles-la-Vallée, 36 km dalej.',
        ],
        sci: [
          'Wodór z żelaza i rozcieńczonego kwasu siarkowego, Fe + H₂SO₄ → FeSO₄ + H₂, wytwarzany w beczkach, z których gaz płynął przez naczynie z wodą, która go oczyszczała i chłodziła, do powłoki z jedwabiu powleczonego gumą, o średnicy około 26 stóp francuskich (jakieś 8,5 m).',
          'Wypór: wypierane powietrze waży około 1,2 kg na metr sześcienny, a wodór 0,08 kg, więc każdy metr sześcienny unosi około 1,1 kg. Kula o średnicy 8,5 m mieści około 320 m³ (relacje podają do 380), czyli w zasadzie dość na jakieś 350 kg: powłokę, siatkę, kosz, dwóch ludzi i balast. Waga na słupku pokazuje nadwyżkę siły; jej obciążenie to model, a nie zapisany ciężar.',
          'Balon Charles’a miał to, co mają wszystkie balony gazowe od tamtej pory: zawór na szczycie do wypuszczania gazu, piasek jako balast do zrzucania, siatkę na powłoce, na której wisi kosz. Puszczony o 13:45 1 grudnia 1783 roku, leciał 2 godziny i 5 minut, około 36 km, do Nesles-la-Vallée.',
        ],
      },
    },
    race: {
      label: 'Wyścig gazów',
      title: 'Który gaz unosi najwięcej?',
      names: { hot: 'gorące powietrze', air: 'powietrze', he: 'hel', h2: 'wodór' },
      slider: 'Gorące powietrze',
      degrees: '{t} °C',
      hints: {
        first: 'Dotknij balonu, żeby go napełnić',
        more: 'Dotknij następnego balonu',
        lens: 'Dotknij lupy, żeby zważyć cząsteczki',
        hot: 'Dotknij balonu, żeby go opróżnić albo napełnić',
      },
      buttons: { all: 'Napełnij wszystkie', none: 'Opróżnij wszystkie', lens: 'Zważ cząsteczki' },
      lensWords: {
        inside: { kid: '12 cząsteczek wodoru: lekkie', sci: '12 H2 × 2 u = 24 u' },
        outside: { kid: '12 cząsteczek powietrza: ciężkie', sci: '12 powietrza × 29 u = 348 u' },
      },
      says: {
        air: { kid: 'Powietrze w powietrzu: po prostu leży na ziemi. Waga nic nie pokazuje.', sci: 'Powietrze w powietrzu wypiera własny ciężar: żadnej siły nośnej (bez ciężaru powłoki).' },
        he: { kid: 'Hel! Ciągnie w górę mniej więcej 1 kg na każdy metr sześcienny.', sci: 'Hel, 0,166 kg/m³: siła nośna 1,04 kg na metr sześcienny, 93% siły wodoru.' },
        h2: { kid: 'Wodór ciągnie najmocniej ze wszystkich: około 1,1 kg na każdy metr sześcienny!', sci: 'Wodór, 0,084 kg/m³: siła nośna 1,12 kg na metr sześcienny, najwięcej, ile może dać gaz.' },
        hot: { kid: 'Powietrze ogrzane do {t} °C unosi tylko {kg} kg na metr sześcienny. Dlatego balony na ogrzane powietrze są takie wielkie!', sci: 'Powietrze w {t} °C: {rho} kg/m³ wobec 1,20 na zewnątrz, więc siła nośna to {kg} kg na metr sześcienny.' },
        cold: { kid: 'Ogień jest tak słaby, że powietrze w środku nie jest cieplejsze niż na zewnątrz: żadnej siły nośnej.', sci: 'W 20 °C w środku i na zewnątrz: brak siły nośnej.' },
        all: { kid: 'Wszystkie cztery pełne: popatrz na wagi!', sci: 'Wszystkie cztery pełne: porównaj wagi.' },
        empty: { kid: 'Opróżniony.', sci: 'Opróżniony.' },
        lens: { kid: 'Policz je: po 12 z każdej strony! Przy tym samym nacisku i cieple każdy gaz ma w pudełku tyle samo cząsteczek. Ale każda cząsteczka wodoru waży około 14 razy mniej niż cząsteczka powietrza.', sci: 'Równe objętości gazów w tej samej temperaturze i pod tym samym ciśnieniem zawierają tyle samo cząsteczek (Avogadro, 1811). H₂ ma masę 2 u, powietrze średnio około 29 u: strona wodoru jest około 14 razy lżejsza.' },
        lensOff: { kid: 'Zobacz, jak małe cząsteczki wodoru śmigają, dużo szybciej niż cząsteczki powietrza!', sci: 'W tej samej temperaturze H₂ porusza się mniej więcej cztery razy szybciej niż cząsteczki powietrza: średnio około 1,75 km/s wobec 0,46 km/s.' },
      },
      panel: {
        kid: [
          'Każdy balon mieści tu jeden metr sześcienny, tyle co pudło o boku jednego metra. Tyle powietrza waży około 1,2 kg. Napełnij balon lżejszym gazem, a otaczające powietrze wypchnie go w górę z siłą równą różnicy: to właśnie pokazują wagi.',
          'Wodór to najlżejszy gaz, więc ciągnie najmocniej. Hel jest dwa razy cięższy od wodoru, ale nadal bardzo lekki, więc ciągnie prawie tak samo. Gorące powietrze jest tylko trochę lżejsze od zimnego, więc balony na ogrzane powietrze muszą być ogromne.',
          'Lupa pokazuje powłokę balonu z wodorem. Może myślisz, że w środku jest mniej cząsteczek, ale jest ich tyle samo co na zewnątrz! Wodór wygrywa, bo każda jego cząsteczka jest bardzo lekka.',
        ],
        sci: [
          'Archimedes: siła wyporu równa się ciężarowi wypartego powietrza. W 20 °C i pod ciśnieniem 1 atm powietrze waży 1,204 kg/m³, hel 0,166, a wodór 0,084, więc metr sześcienny helu unosi 1,04 kg, a wodoru 1,12 kg; od obu odejmuje się ciężar samej powłoki.',
          'Gorące powietrze: przy stałym ciśnieniu gęstość gazu maleje jak 1/T (prawo Charles’a). W 100 °C powietrze waży 0,95 kg/m³ i unosi tylko 0,26 kg na metr sześcienny, mniej niż ćwierć tego co wodór. Pierwszy załogowy lot Montgolfierów, 21 listopada 1783 roku (Pilâtre de Rozier i markiz d’Arlandes, z Château de la Muette), odbył się dziesięć dni przed lotem Charles’a.',
          'Avogadro (1811): równe objętości gazów w tej samej temperaturze i pod tym samym ciśnieniem zawierają tyle samo cząsteczek, około 2,5 × 10²⁵ na metr sześcienny w 20 °C. Ciśnienie po obu stronach powłoki jest takie samo: lekkie cząsteczki H₂ uderzają równie mocno, bo poruszają się szybciej. Wypór bierze się stąd, że powietrze naciska od dołu o około 12 Pa na metr wysokości mocniej niż od góry.',
        ],
      },
    },
    helium: {
      label: 'Dlaczego teraz hel',
      title: 'Wodór się pali, hel nie',
      hints: {
        model: 'Dotknij modelu sterowca',
        decks: 'Dotknij modelu jeszcze raz, żeby zobaczyć pokłady',
        h2: 'Dotknij balonu z wodorem',
        he: 'Dotknij balonu z helem',
        again: 'Dotknij balonu albo modelu',
      },
      buttons: { model: 'Oświetl model', h2: 'Świeca do wodoru', he: 'Świeca do helu' },
      says: {
        cells: { kid: 'Pod srebrną powłoką: 16 ogromnych worków z gazem, wszystkie pełne wodoru.', sci: 'LZ 129 w skali 1:100: 245 m długości, 16 komór gazowych z około 200 000 m³ wodoru.' },
        decks: { kid: 'A tutaj mieszkali pasażerowie: kabiny, jadalnia i salon z oknami, w brzuchu sterowca.', sci: 'Pokłady A i B wewnątrz kadłuba: kabiny, jadalnia, salon i pokój do pisania na górze; łazienki, bar, a nawet palarnia na dole.' },
        dark: { kid: 'Model znowu gaśnie.', sci: 'Światła zgaszone.' },
        whoomp: { kid: 'Buuum! Wodór spala się cały naraz w kuli ognia.', sci: 'Rozdarta powłoka pozwala wodorowi spotkać się z powietrzem: spala się w jednym błysku, 2 H2 + O2 -> 2 H2O.' },
        pop: { kid: 'Pyk! Balon z helem po prostu pęka. Hel w ogóle nie może się palić.', sci: 'Hel, gaz szlachetny, nie pali się: płomień tylko topi gumę.' },
      },
      panel: {
        kid: [
          'To model Hindenburga, największego sterowca, jaki kiedykolwiek latał: dłuższego niż dwa boiska piłkarskie. W 1936 roku woził pasażerów przez Atlantyk. Zbudowano go do latania na helu, ale musiał używać wodoru, bo Stany Zjednoczone, które miały prawie cały hel świata, nie chciały go sprzedać.',
          'W 1937 roku, podczas lądowania w New Jersey, zapalił się i spłonął w około pół minuty. Większość ludzi na pokładzie, 62 z 97, się uratowała. Od tamtej pory sterowce latają na helu, który unosi prawie tak samo i nie może się palić.',
          'Próba ze świecą to klasyczna sztuczka z pokazów naukowych, którą nauczyciele robią bardzo ostrożnie: balon z wodorem znika w kuli ognia, balon z helem tylko pęka. Nigdy nie próbuj tego sam!',
        ],
        sci: [
          'LZ 129 Hindenburg (pierwszy lot 4 marca 1936 roku): 245 m długości, 41 m średnicy, 16 komór gazowych, około 200 000 m³. Zaprojektowano go do helu, ale Stany Zjednoczone, praktycznie jedyne źródło, nie eksportowały go na mocy Helium Control Act (1927), więc napełniono go wodorem. W 1936 roku odbył 17 rejsów tam i z powrotem przez Atlantyk, 10 do Stanów Zjednoczonych i 7 do Brazylii.',
          '6 maja 1937 roku, podczas cumowania w Lakehurst w stanie New Jersey, zapalił się i spłonął w około pół minuty: zginęło 35 z 97 osób na pokładzie (13 pasażerów, 22 członków załogi) i jeden człowiek z obsługi naziemnej; 62 przeżyły. Od tamtej pory sterowce latają na helu, którego Marynarka Wojenna USA używała już od Shenandoah (1923).',
          'Wodór pali się w powietrzu przy każdym stężeniu od 4% do 75% objętości i do zapłonu potrzebuje bardzo mało energii; hel, gaz szlachetny, nie może się palić. Unosi 93% tego co wodór, ale jest go mało: pochodzi z gazu ziemnego, w którym zbierał się przez miliony lat z rozpadu promieniotwórczego w skałach.',
        ],
      },
    },
  },
  de: {
    title: 'Die Tuilerien, 1783',
    greet: {
      kid: 'Wir sind im Bild: im Tuileriengarten in Paris, am 1. Dezember 1783. Eine riesige Menschenmenge ist gekommen, um zwei Männer in einem Ballon voller Wasserstoff aufsteigen zu sehen! Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Der Jardin des Tuileries, Paris, 1. Dezember 1783, früher Nachmittag: Jacques Charles und Nicolas-Louis Robert steigen gleich in einem Wasserstoffballon auf. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Vor dem Start bat Charles Joseph Montgolfier, den Erfinder des Heißluftballons, zuerst einen kleinen grünen Ballon steigen zu lassen, um zu sehen, woher der Wind wehte.',
        'Nach der Landung stieg Charles allein noch einmal auf. Er kam so hoch, dass er die Sonne wiedersah, obwohl sie für die Leute am Boden schon untergegangen war!',
        'Charles gab seinem Ballon ein Ventil oben, um Gas abzulassen, Sandsäcke zum Abwerfen und ein Netz, an dem der Korb hing. So baut man Gasballone bis heute.',
      ],
      sci: [
        'Joseph Montgolfier ließ vor dem Aufstieg einen kleinen grünen Pilotballon steigen, um den Wind zu prüfen. Benjamin Franklin, der amerikanische Gesandte in Paris, sah aus dem Bereich der Subskribenten zu; die Menge wurde auf etwa 400.000 geschätzt.',
        'Nach der Landung in Nesles-la-Vallée stieg Charles allein wieder auf, der Ballon um Roberts Gewicht leichter: auf etwa 3000 m nach seinem Barometer, wo er die Sonne, unten schon untergegangen, noch einmal sah. Dann ließ er Gas ab und landete etwa 3 km entfernt.',
        'Das Gesetz von Charles, nach dem das Volumen eines Gases bei konstantem Druck proportional zu seiner absoluten Temperatur wächst, trägt seinen Namen: Er fand es um 1787, Gay-Lussac veröffentlichte es 1802.',
      ],
    },
    charliere: {
      label: 'Charles’ Ballon',
      title: 'Die Charlière füllen',
      dial: 'Zug',
      slider: 'Wasserstoff im Ballon',
      percent: 'zu {n}% voll',
      hints: {
        fill: 'Tippe auf die Fässer, um Wasserstoff zu machen',
        more: 'Tippe noch einmal auf die Fässer (zu {n}% voll)',
        heavy: 'Zu schwer, tippe auf einen Sandsack oder die Fässer',
        ropes: 'Leicht genug! Tippe auf die Seile, um ihn loszulassen',
        flying: 'Tippe auf einen Sandsack, um schneller zu steigen',
        watch: 'Sieh ihm nach, wie er davonfliegt',
        gone: 'Ein neuer Ballon kommt',
      },
      buttons: { fill: 'Säure aufs Eisen', bag: 'Sandsack abwerfen', ropes: 'Seile loslassen' },
      says: {
        fill: { kid: 'Die Säure sprudelt auf den Eisenspänen, und Wasserstoff blubbert durch den Wasserbottich und den Schlauch hinauf. Der Ballon schwillt an: zu {n}% voll.', sci: 'Eisen und verdünnte Schwefelsäure, Fe + H2SO4 -> FeSO4 + H2, das Gas im Wasserbottich gewaschen und in die Hülle geleitet. Zu {n}% voll.' },
        full: { kid: 'Voll! Die Seide ist rund und straff.', sci: 'Voll: eine Kugel von etwa 8,5 m Durchmesser, rund 320 m³ Wasserstoff.' },
        already: { kid: 'Er ist schon voll: Mehr passt nicht in die Seide.', sci: 'Voll: kein Platz für mehr Gas.' },
        empty: { kid: 'Jetzt schon loslassen? Mit so wenig Gas könnte er nicht einmal seine eigene Seide heben. Tippe auf die Fässer!', sci: 'Viel zu wenig Wasserstoff, um auch nur die Hülle zu heben.' },
        heavy: { kid: 'Die Männer ließen die Seile los, aber er blieb einfach stehen: zu schwer! Seide, Korb, zwei Männer und ihr Sand wiegen mehr als der Auftrieb. Mehr Gas oder weniger Sand.', sci: 'Auftrieb kleiner als die Last: Er bleibt unten. Mehr Wasserstoff oder Ballast abwerfen.' },
        bag: { kid: 'Ein Sandsack fliegt hinaus. Sandsäcke an Bord: {n}.', sci: 'Ballast abgeworfen. Säcke an Bord: {n}.' },
        light: { kid: 'Ein Sandsack fliegt hinaus, und der Ballon zerrt an seinen Seilen: Jetzt wiegt alles zusammen weniger als die Luft, die er verdrängt!', sci: 'Ballast abgeworfen: Der Auftrieb übersteigt die Last. Säcke an Bord: {n}.' },
        rise: { kid: 'Los! Hinauf geht es, sie schwenken ihre Hüte, und die Menge jubelt. Der Wind trägt sie über die Bäume davon.', sci: 'Losgelassen: Der Auftrieb übersteigt das Gewicht, also steigt er, und der Wind trägt ihn nach Norden, Richtung Nesles-la-Vallée, 36 km entfernt.' },
        bagUp: { kid: 'Der Sand rieselt hinaus, und hinauf geht es, schneller!', sci: 'Ballast im Flug abgeworfen: leichter, steigt er schneller.' },
        noBags: { kid: 'Es ist kein Sand mehr zum Abwerfen da.', sci: 'Kein Ballast mehr.' },
        flying: { kid: 'Sie fliegen! Wenn sie außer Sicht sind, wird ein neuer Ballon ausgelegt.', sci: 'Im Flug. Danach wird eine neue Hülle ausgelegt.' },
      },
      panel: {
        kid: [
          'Charles und die Brüder Robert machten ihren Wasserstoff in Fässern: Säure, auf Eisenspäne gegossen, sprudelt und gibt das Gas ab. Es blubberte durch einen Bottich mit Wasser und einen Schlauch hinauf in den Ballon. Das ging langsam.',
          'Die Seide war mit Gummi bestrichen, damit die winzigen Wasserstoffmoleküle nicht hindurchschlüpfen konnten. Ein Ballon steigt, wenn alles zusammen, Gas, Seide, Korb, Menschen und Sand, weniger wiegt als die Luft, die der Ballon verdrängt. Wirf Sand ab, und er steigt; lass Gas ab, und er sinkt.',
          'Am 1. Dezember 1783 flogen Charles und Robert etwa zwei Stunden lang über das Land bis zum Dorf Nesles-la-Vallée, 36 km weit.',
        ],
        sci: [
          'Wasserstoff aus Eisen und verdünnter Schwefelsäure, Fe + H₂SO₄ → FeSO₄ + H₂, in Fässern erzeugt, deren Gas durch ein Gefäß mit Wasser, das es reinigte und kühlte, in eine Hülle aus gummierter Seide geleitet wurde, etwa 26 französische Fuß (rund 8,5 m) im Durchmesser.',
          'Auftrieb: Die verdrängte Luft wiegt etwa 1,2 kg pro Kubikmeter, Wasserstoff 0,08 kg, also hebt jeder Kubikmeter etwa 1,1 kg. Eine Kugel von 8,5 m Durchmesser fasst etwa 320 m³ (Berichte nennen bis zu 380), im Prinzip genug für etwa 350 kg: Hülle, Netz, Korb, zwei Männer und Ballast. Die Waage auf dem Pfosten zeigt den übrigen Zug; ihre Last ist ein Modell, kein überliefertes Gewicht.',
          'Charles’ Ballon hatte, was jeder Gasballon seither hat: ein Ventil am Scheitel zum Ablassen von Gas, Sand als Ballast zum Abwerfen, ein Netz über der Hülle, das den Korb trägt. Um 13:45 Uhr am 1. Dezember 1783 losgelassen, flog er 2 Stunden und 5 Minuten und etwa 36 km weit bis Nesles-la-Vallée.',
        ],
      },
    },
    race: {
      label: 'Das Gas-Wettrennen',
      title: 'Welches Gas trägt am meisten?',
      names: { hot: 'Heißluft', air: 'Luft', he: 'Helium', h2: 'Wasserstoff' },
      slider: 'Heißluft',
      degrees: '{t} °C',
      hints: {
        first: 'Tippe auf einen Ballon, um ihn zu füllen',
        more: 'Tippe auf einen weiteren Ballon',
        lens: 'Tippe auf die Lupe, um die Moleküle zu wiegen',
        hot: 'Tippe auf einen Ballon, um ihn zu leeren oder zu füllen',
      },
      buttons: { all: 'Alle füllen', none: 'Alle leeren', lens: 'Moleküle wiegen' },
      lensWords: {
        inside: { kid: '12 Wasserstoffmoleküle: leicht', sci: '12 H2 × 2 u = 24 u' },
        outside: { kid: '12 Luftmoleküle: schwer', sci: '12 Luft × 29 u = 348 u' },
      },
      says: {
        air: { kid: 'Luft in Luft: Er liegt einfach auf dem Boden. Die Waage zeigt nichts.', sci: 'Luft in Luft verdrängt ihr eigenes Gewicht: kein Auftrieb (ohne das Gewicht der Hülle).' },
        he: { kid: 'Helium! Es zieht pro Kubikmeter etwa 1 kg nach oben.', sci: 'Helium, 0,166 kg/m³: Auftrieb 1,04 kg pro Kubikmeter, 93% des Wasserstoffs.' },
        h2: { kid: 'Wasserstoff zieht am stärksten von allen: etwa 1,1 kg pro Kubikmeter!', sci: 'Wasserstoff, 0,084 kg/m³: Auftrieb 1,12 kg pro Kubikmeter, das Meiste, was ein Gas geben kann.' },
        hot: { kid: 'Luft, auf {t} °C erhitzt, trägt nur {kg} kg pro Kubikmeter. Darum sind Heißluftballone so riesig!', sci: 'Luft bei {t} °C: {rho} kg/m³ gegen 1,20 draußen, der Auftrieb ist also {kg} kg pro Kubikmeter.' },
        cold: { kid: 'Das Feuer ist so klein, dass die Luft drinnen nicht wärmer ist als draußen: kein Auftrieb.', sci: 'Bei 20 °C innen und außen: kein Auftrieb.' },
        all: { kid: 'Alle vier gefüllt: Schau auf die Waagen!', sci: 'Alle vier gefüllt: Vergleiche die Waagen.' },
        empty: { kid: 'Geleert.', sci: 'Geleert.' },
        lens: { kid: 'Zähl sie: 12 auf jeder Seite! Bei gleichem Druck und gleicher Wärme hat jedes Gas gleich viele Moleküle in einer Kiste. Aber jedes Wasserstoffmolekül wiegt etwa 14-mal weniger als ein Luftmolekül.', sci: 'Gleiche Volumina bei gleicher Temperatur und gleichem Druck enthalten gleich viele Moleküle (Avogadro, 1811). H₂ hat die Masse 2 u, Luft im Mittel etwa 29 u: Die Wasserstoffseite ist etwa 14-mal leichter.' },
        lensOff: { kid: 'Schau, wie die kleinen Wasserstoffmoleküle herumflitzen, viel schneller als die der Luft!', sci: 'Bei gleicher Temperatur bewegt sich H₂ etwa viermal schneller als die Moleküle der Luft: im Mittel etwa 1,75 km/s gegen 0,46 km/s.' },
      },
      panel: {
        kid: [
          'Jeder Ballon hier fasst einen Kubikmeter, so viel wie eine Kiste mit einem Meter an jeder Seite. So viel Luft wiegt etwa 1,2 kg. Füll den Ballon mit einem leichteren Gas, und die Luft ringsum drückt ihn mit dem Unterschied nach oben: Das zeigen die Waagen.',
          'Wasserstoff ist das leichteste Gas, darum zieht er am stärksten. Helium ist doppelt so schwer wie Wasserstoff, aber immer noch sehr leicht, darum zieht es fast genauso stark. Heiße Luft ist nur ein bisschen leichter als kalte, darum müssen Heißluftballone riesig sein.',
          'Die Lupe zeigt die Haut des Wasserstoffballons. Vielleicht denkst du, drinnen sind weniger Moleküle, aber es sind genauso viele wie draußen! Wasserstoff gewinnt, weil jedes seiner Moleküle so leicht ist.',
        ],
        sci: [
          'Archimedes: Die Auftriebskraft ist gleich dem Gewicht der verdrängten Luft. Bei 20 °C und 1 atm wiegt Luft 1,204 kg/m³, Helium 0,166 und Wasserstoff 0,084, also hebt ein Kubikmeter Helium 1,04 kg und einer Wasserstoff 1,12 kg; das Gewicht der Hülle geht bei beiden ab.',
          'Heißluft: Bei konstantem Druck sinkt die Dichte eines Gases wie 1/T (Gesetz von Charles). Bei 100 °C wiegt Luft 0,95 kg/m³ und trägt nur 0,26 kg pro Kubikmeter, weniger als ein Viertel des Wasserstoffs. Der erste bemannte Flug der Montgolfiers am 21. November 1783 (Pilâtre de Rozier und der Marquis d’Arlandes, vom Château de la Muette) war zehn Tage vor dem von Charles.',
          'Avogadro (1811): Gleiche Volumina von Gasen bei gleicher Temperatur und gleichem Druck enthalten gleich viele Moleküle, etwa 2,5 × 10²⁵ pro Kubikmeter bei 20 °C. Der Druck ist auf beiden Seiten der Hülle gleich: Die leichten H₂-Moleküle stoßen genauso kräftig, weil sie schneller sind. Der Auftrieb kommt daher, dass die Luft pro Meter Höhe etwa 12 Pa stärker von unten drückt als von oben.',
        ],
      },
    },
    helium: {
      label: 'Warum heute Helium',
      title: 'Wasserstoff brennt, Helium nicht',
      hints: {
        model: 'Tippe auf das Luftschiffmodell',
        decks: 'Tippe noch einmal auf das Modell für seine Decks',
        h2: 'Tippe auf den Wasserstoffballon',
        he: 'Tippe auf den Heliumballon',
        again: 'Tippe auf einen Ballon oder das Modell',
      },
      buttons: { model: 'Modell beleuchten', h2: 'Kerze zum Wasserstoff', he: 'Kerze zum Helium' },
      says: {
        cells: { kid: 'Unter seiner silbernen Haut: 16 riesige Gaszellen, alle voller Wasserstoff.', sci: 'LZ 129 im Maßstab 1:100: 245 m lang, 16 Gaszellen mit etwa 200.000 m³ Wasserstoff.' },
        decks: { kid: 'Und hier wohnten die Fahrgäste: Kabinen, ein Speisesaal und ein Aufenthaltsraum mit Fenstern, im Bauch des Luftschiffs.', sci: 'Die Decks A und B im Rumpf: Kabinen, Speisesaal, Aufenthalts- und Schreibraum oben; Waschräume, eine Bar und sogar ein Rauchsalon unten.' },
        dark: { kid: 'Das Modell wird wieder dunkel.', sci: 'Licht aus.' },
        whoomp: { kid: 'Wuuumm! Der Wasserstoff verbrennt auf einmal in einem Feuerball.', sci: 'Durch die zerrissene Hülle trifft der Wasserstoff auf Luft: Er verbrennt in einem Blitz, 2 H2 + O2 -> 2 H2O.' },
        pop: { kid: 'Peng! Der Heliumballon platzt nur. Helium kann gar nicht brennen.', sci: 'Helium, ein Edelgas, brennt nicht: Die Flamme schmilzt nur den Gummi.' },
      },
      panel: {
        kid: [
          'Das ist ein Modell der Hindenburg, des größten Luftschiffs, das je geflogen ist: länger als zwei Fußballfelder. 1936 brachte sie Fahrgäste über den Atlantik. Sie war für Helium gebaut, musste aber Wasserstoff nehmen, weil die USA, die fast das ganze Helium der Welt hatten, es nicht verkaufen wollten.',
          '1937, beim Landen in New Jersey, fing sie Feuer und verbrannte in etwa einer halben Minute. Die meisten Menschen an Bord, 62 von 97, kamen davon. Seitdem fliegen Luftschiffe mit Helium, das fast genauso gut trägt und nicht brennen kann.',
          'Der Kerzentest ist ein klassischer Trick aus Wissenschaftsshows, den Lehrer mit großer Vorsicht vorführen: Ein Wasserstoffballon geht in einem Feuerball auf, ein Heliumballon platzt nur. Probier das nie selbst aus!',
        ],
        sci: [
          'LZ 129 Hindenburg (Erstflug am 4. März 1936): 245 m lang, 41 m Durchmesser, 16 Gaszellen, etwa 200.000 m³. Sie war für Helium entworfen, aber die USA, praktisch die einzige Quelle, exportierten es nach dem Helium Control Act (1927) nicht, also wurde sie mit Wasserstoff gefüllt. 1936 machte sie 17 Hin- und Rückfahrten über den Atlantik, 10 in die USA und 7 nach Brasilien.',
          'Am 6. Mai 1937 fing sie beim Festmachen in Lakehurst, New Jersey, Feuer und verbrannte in etwa einer halben Minute: 35 der 97 Menschen an Bord (13 Fahrgäste, 22 Besatzungsmitglieder) und ein Mann der Bodenmannschaft starben; 62 überlebten. Seitdem fliegen Luftschiffe mit Helium, das die US Navy schon seit der Shenandoah (1923) verwendete.',
          'Wasserstoff brennt in Luft bei jedem Anteil zwischen 4% und 75% (Volumen) und braucht zum Zünden sehr wenig Energie; Helium, ein Edelgas, kann nicht brennen. Es trägt 93% so viel, ist aber knapp: Es kommt aus Erdgas, in dem es sich über Jahrmillionen aus dem radioaktiven Zerfall im Gestein gesammelt hat.',
        ],
      },
    },
  },
}
