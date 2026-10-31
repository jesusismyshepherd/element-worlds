// The words of the room behind oxygen's picture "The great oxygen surprise": a shallow sea about 2.5 billion
// years ago, in English, European Portuguese, Polish and German, kid (Explorer) and sci (Scientist). The
// picture's own story stays in src/content/boards/O.js (the easel shows it). Each step is done by tapping
// its thing: `hints` are what the prompt shows as the next step (no colon of their own), `verbs` the
// panels' buttons that do the same; `signs` and `board` are drawn in 3D (plain text: O2, not O₂).
//
// Facts (checked 2026-10-31): the Great Oxidation Event began about 2.46 to 2.43 billion years ago (often
// "about 2.4"); its onset is debated. Ruben, Randall, Kamen and Hyde, J. Am. Chem. Soc. 63, 877 (1941): the
// green alga Chlorella given water with oxygen-18, the O2 it released matched the water's label; van Niel
// had proposed it in the 1930s. Banded iron formations from about 3.8 to 1.8 billion years ago, most near
// 2.5; more than 60 % of the world's iron reserves; 4 Fe2+ + O2 + 10 H2O -> 4 Fe(OH)3 + 8 H+; the banding's
// cause is debated (cyanobacterial O2, iron-oxidising phototrophs without O2). The Hamersley iron formations,
// cut by Karijini's gorges (the Dales Gorge Member of the Brockman Iron Formation), about 2.5 to 2.45 billion
// years old. Hamelin Pool's stromatolites: growth at most a few tenths of a millimetre a year (Chivas et al.
// 1990: at most about 0.4 mm; Collins and Jahnert 2014: under 0.1 to 0.5 mm; about 0.3 mm often quoted),
// water about twice as salty as the sea. The Huronian glaciations about 2.45 to 2.2 billion years ago; their
// link to the loss of methane and how global they were are debated.
export const FIRST_WORDS = {
  en: {
    title: 'A sea 2.5 billion years ago',
    greet: {
      kid: 'Welcome to the sea 2.5 billion years ago! No plants, no animals, only tiny microbes, and they are just starting to make me: oxygen. Three things to try, and the picture\'s story is on the easel.',
      sci: 'A shallow sea about 2.5 billion years ago, just before the Great Oxidation Event: almost no free oxygen in the air, and every living thing a microbe. Three stations: water split by sunlight, the iron the oxygen rusted, and stromatolites still alive today. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Look around: bare red rock, warm water, and not one plant or animal anywhere. The only life is microbes, far too small to see, living in those slimy mats.',
        'The mounds in the water are stromatolites. Microbes build them, one thin layer on top of another, very, very slowly.',
        'You could not breathe here: the air has almost no oxygen. My big job is only just starting!',
        'Some scientists think the sky may sometimes have been hazy and orange, because of a gas called methane. And the Sun was a little fainter than it is today.',
      ],
      sci: [
        'Before about 2.4 billion years ago, free O₂ stayed below about a hundred-thousandth of today\'s level: older rocks keep an unusual pattern of sulfur isotopes that only an oxygen-poor air leaves behind.',
        'The Sun shone about a fifth less brightly than today, yet the sea did not freeze: greenhouse gases, carbon dioxide and methane, kept the young Earth warm.',
        'Methane-rich air may at times have made an orange organic haze, as on Saturn\'s moon Titan. The idea comes from carbon and sulfur isotopes in rocks about 2.65 to 2.5 billion years old, and it is still debated.',
        'Cyanobacteria were probably already making oxygen, but it was used up as fast as it was made, by iron in the sea and gases from volcanoes, until about 2.4 billion years ago it began to build up in the air.',
      ],
    },
    makers: {
      label: 'The first oxygen makers',
      title: 'The first oxygen makers',
      sunLabel: 'Sunlight on the cells',
      verbs: { sun: 'Send sunlight with the mirror', shade: 'Turn the mirror away', mud: 'Look into the mud', mat: 'Look at the green mat' },
      hints: { sun: 'Tap the mirror to send sunlight', mud: 'Tap the mud beside the lens', mat: 'Tap the green mat to look back', shade: 'Tap the mirror to turn it away' },
      signs: { water: 'water', oxygen: 'oxygen', cells: 'cyanobacteria', anaerobes: 'microbes that need no oxygen', mat: 'green mat', mudBank: 'mud', mirror: 'mirror' },
      says: {
        sun: { kid: 'Sunlight! Now watch: the cells pull water apart and let out bubbles of oxygen. This is how the first oxygen was made.', sci: 'Light drives the splitting of water: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. The O₂ is let go as waste; the hydrogen goes on to turn CO₂ into sugar.' },
        shade: { kid: 'No light, no oxygen. The cells rest.', sci: 'Without light, water splitting stops at once.' },
        mud: { kid: 'Down in the mud live microbes that never needed oxygen. For them the new gas was a poison! Watch them move away, deeper down, where it cannot reach them.', sci: 'Obligate anaerobes, such as methane makers and sulfate reducers. O₂, and the reactive forms it makes inside cells, damage their enzymes, and many of them lack the enzymes that would clear those away.' },
        mudDark: { kid: 'No sunlight now, so no oxygen comes down, and the mud microbes are happy. Send some light and see what happens.', sci: 'In the dark the mat makes no O₂, and the mud stays anoxic.' },
        mat: { kid: 'Back to the oxygen makers: chains of tiny blue-green cells.', sci: 'Filamentous cyanobacteria: each cell a few micrometres across, drawn here tens of thousands of times bigger.' },
      },
      panel: {
        kid: [
          'These chains of tiny blue-green cells are cyanobacteria. With sunlight they pull water apart: they keep the hydrogen to make their food, and let the oxygen go. Nothing alive had done that before, and it changed the whole world.',
          'Tap the mirror to send sunlight onto them, then tap the mud. The microbes in the mud had never met oxygen, and for them it was a poison. Many moved into places oxygen cannot reach, and their family still lives there today: in deep mud, in swamps, even inside your tummy.',
        ],
        sci: [
          'Oxygenic photosynthesis: 6 CO₂ + 12 H₂O + light → C₆H₁₂O₆ + 6 O₂ + 6 H₂O. Every O₂ comes from water, split in photosystem II (2 H₂O → O₂ + 4 H⁺ + 4 e⁻); the electrons and protons reduce CO₂ to sugar. Cornelis van Niel proposed in the 1930s that the oxygen comes from water. In 1941 Samuel Ruben, Martin Kamen and colleagues gave the green alga Chlorella water enriched in heavy oxygen-18, and the O₂ it released carried the water\'s share of oxygen-18, not the carbon dioxide\'s.',
          'When cyanobacteria began making oxygen is debated, from about 3 to 2.5 billion years ago or earlier; by 2.4 billion years O₂ was building up. For obligate anaerobes such as methanogens and sulfate reducers, O₂ and its reactive products are toxic. Their descendants live on where it cannot reach: sea and lake mud, wetlands, hot springs, deep rock and animal guts, ours included (methanogens live in the human gut).',
        ],
      },
    },
    sea: {
      label: 'The rusting sea',
      title: 'The rusting sea',
      timeLabel: 'Millions of years later',
      timeFmt: { start: 'The sea, 2.5 billion years ago', later: '{n} million years later', today: 'Today' },
      verbs: { bloom: 'A sunny season: the microbes bloom', quiet: 'A quiet season', again: 'Start a new sample' },
      hints: { bloom: 'Tap the microbes to make them bloom', quiet: 'Tap the microbes for a quiet season', time: 'Open the panel and slide the years', gorge: 'Tap the gorge in the rock', wait: 'Wait for the layer to settle' },
      signs: { microbes: 'microbes', iron: 'invisible iron in the water', cut: 'Today: Karijini, Australia' },
      board: {
        layers: 'Layers: {r} red, {g} grey',
        sea: 'Tap the microbes on top.',
        laid: 'Laid down, layer on layer, for millions of years',
        buried: 'Buried deep and pressed into rock',
        lifted: 'Lifted up, worn down by rain and rivers',
        today: 'Today: the walls of a gorge',
      },
      rows: { red: 'Red layers (iron)', grey: 'Grey layers (silica)' },
      says: {
        bloom: { kid: 'A sunny season: the microbes bloom and make lots of oxygen. It grabs the iron hidden in the water, and rust snows down: a red layer!', sci: 'A bloom: O₂ oxidises dissolved Fe²⁺ to Fe³⁺, which comes out as iron(III) hydroxide: 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. It settles as an iron-rich band.' },
        quiet: { kid: 'A quiet season: few microbes, little oxygen, no rust. A fine grey dust of silica settles instead: a grey layer.', sci: 'Little O₂, little iron oxide: silica, plentiful in a sea where nothing yet built glass shells, settles as a silica-rich band, the future chert.' },
        full: { kid: 'What a stack of stripes! Now let millions of years go by: open the panel and slide the years.', sci: 'Enough bands for a sample: now slide the time on.' },
        laid: { kid: 'Season after season, for millions of years: thousands and thousands of layers, hundreds of metres thick!', sci: 'Banded iron formations piled up over millions of years; the Hamersley Basin\'s are hundreds of metres thick.' },
        buried: { kid: 'Buried deep, squeezed and warmed: the soft layers turn into hard rock, and the rust into shiny iron minerals.', sci: 'Burial and diagenesis: the iron hydroxide becomes hematite (Fe₂O₃) and magnetite (Fe₃O₄), the silica gel becomes chert, often red jasper.' },
        lifted: { kid: 'Very slowly the rock is pushed up again, and rain and rivers wear away the land above it.', sci: 'Uplift and erosion bring the formation back to the surface.' },
        today: { kid: 'Today! Look through the cut in the rock: the same red and grey stripes, now the walls of a gorge in Australia.', sci: 'Today: Karijini National Park in the Pilbara, Western Australia, where gorges cut through the Brockman Iron Formation, about 2.5 billion years old.' },
        gorge: { kid: 'These stripes are the rust of the first oxygen, nearly 2.5 billion years old. Most of the iron people dig up to make steel comes from rocks like these!', sci: 'Banded iron formations hold more than 60 % of the world\'s iron reserves and give most of the iron ore mined today, often where water has washed out the silica and left a richer ore. The Pilbara round these gorges is one of the biggest iron ore regions on Earth.' },
        again: { kid: 'A new sample: clear sea water, with iron hiding in it.', sci: 'A fresh column of anoxic seawater.' },
      },
      panel: {
        kid: [
          'The ancient sea was full of iron, dissolved and invisible, which came out of hot springs deep in the ocean. When the microbes made oxygen, it grabbed the iron, and together they made rust that snowed down onto the sea floor.',
          'Tap the microbes: a sunny season makes a red layer of rust, a quiet season a grey layer of silica. Build a stack of stripes, then slide the years and see where those stripes are today.',
        ],
        sci: [
          'Before the oxygen, the deep ocean was anoxic and carried dissolved iron(II), Fe²⁺, from hydrothermal vents along mid-ocean ridges. Where upwelling brought it into sunlit shallows, oxygen from cyanobacteria oxidised it: 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. In this model the iron bands follow blooms; microbes that oxidise iron with light directly, without O₂, may have made some too, and the cause of the banding is still debated. (At Scientist level the water is tinted green, as dissolved Fe²⁺ is in a test tube; in the sea it was far too dilute to see.)',
          'Banded iron formations date from about 3.8 to 1.8 billion years ago, most of them from around 2.5 billion. Their bands range from under a millimetre (some may be yearly) to metres thick. Silica was plentiful because nothing yet built glass shells: today diatoms and radiolarians take it out of the sea. Buried, the iron hydroxide became hematite and magnetite, the silica gel chert.',
        ],
      },
    },
    living: {
      label: 'Stromatolites alive today',
      title: 'Stromatolites alive today',
      yearsLabel: 'Years of growth',
      yearsFmt: '{y} years: {cm} cm',
      years: '{y} years',
      verbs: { cut: 'Cut the stromatolite open', close: 'Put it back together', look: 'Look closer at the layers', away: 'Put the magnifier away' },
      hints: { cut: 'Tap the stromatolite to cut it open', look: 'Tap the cut face to look closer', grow: 'Open the panel and slide the years', close: 'Tap the stromatolite to close it' },
      signs: { cut: 'Today: Hamelin Pool, Australia', sand: 'sand grains', mat: 'sticky microbes', top: 'the living top' },
      rows: { rate: 'Growth', rateValue: 'about 0.3 mm a year' },
      says: {
        cut: { kid: 'Cut in half! See the thin layers, like the rings of a tree? Each one was the top once: a sticky mat of microbes covered in sand.', sci: 'In section: domed laminae of sediment grains trapped and bound by microbial mats. Hamelin Pool\'s are coarser and less regular than many ancient ones.' },
        close: { kid: 'Back together, as it stands in the water.', sci: 'Closed again.' },
        look: { kid: 'Up close: sticky threads of microbes catch grains of sand. Then they climb up through the sand to the light and make a new mat on top. Layer by layer!', sci: 'Trapping and binding: cyanobacteria and their sticky slime catch carbonate grains, then glide up through them toward the light; some calcium carbonate also comes out of the water in the mat.' },
        away: { kid: 'Magnifier away.', sci: 'Magnifier away.' },
        young: { kid: 'A young one, only a few centimetres. It grows so slowly!', sci: 'At a few tenths of a millimetre a year, a century adds only about 3 cm.' },
        old: { kid: 'This tall, it took about 3000 years: it started growing long before ancient Rome was built!', sci: 'About 0.9 m at 0.3 mm a year: some 3000 years of growth.' },
      },
      panel: {
        kid: [
          'Stromatolites are still alive today! In Hamelin Pool, in Shark Bay in Western Australia, the water is about twice as salty as the open sea, so the snails and other animals that would eat the microbes cannot live there. The mats go on building, as they did billions of years ago.',
          'They grow very slowly, less than half a millimetre a year, so a mound as tall as you took thousands of years. Tap one to cut it open and see its layers, and slide the years to watch it grow.',
        ],
        sci: [
          'Hamelin Pool\'s stromatolites grow at most a few tenths of a millimetre a year (estimates run from under 0.1 to about 0.5 mm; about 0.3 mm is often quoted). A sandbank across the bay and strong evaporation make the water about twice as salty as normal seawater, which keeps most grazing animals away. Living marine stromatolites like these are rare today; the oldest fossil ones, also in Western Australia, are about 3.5 billion years old.',
          'What the oxygen made possible: as O₂ built up after about 2.4 billion years ago, an ozone layer formed that screens out much of the Sun\'s ultraviolet. Oxygen may also have destroyed much of the methane that kept the young Earth warm, helping to bring the Huronian ice ages (about 2.45 to 2.2 billion years ago), possibly the first Snowball Earth; both the cause and how far the ice reached are debated. Animals that breathe oxygen came much later: their first clear fossils are less than 600 million years old.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Um mar de há 2,5 mil milhões de anos',
    greet: {
      kid: 'Bem-vindo ao mar de há 2,5 mil milhões de anos! Não há plantas nem animais, só micróbios minúsculos, e eles estão mesmo a começar a fabricar-me: o oxigénio. Há três coisas para experimentar, e a história da imagem está no cavalete.',
      sci: 'Um mar pouco fundo há cerca de 2,5 mil milhões de anos, mesmo antes do Grande Evento de Oxidação: quase não há oxigénio livre no ar, e todos os seres vivos são micróbios. Três estações: a água partida pela luz do Sol, o ferro que o oxigénio enferrujou e estromatólitos ainda vivos hoje. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'Olha à tua volta: rocha vermelha nua, água morna e nem uma planta ou um animal em lado nenhum. A única vida são micróbios, pequenos demais para se verem, que vivem naqueles tapetes viscosos.',
        'Os montes dentro de água são estromatólitos. São os micróbios que os constroem, uma camada fina por cima da outra, muito, muito devagar.',
        'Aqui não conseguias respirar: o ar quase não tem oxigénio. O meu grande trabalho ainda agora está a começar!',
        'Alguns cientistas pensam que o céu às vezes podia estar enevoado e cor de laranja, por causa de um gás chamado metano. E o Sol brilhava um pouco menos do que hoje.',
      ],
      sci: [
        'Até há cerca de 2,4 mil milhões de anos, o O₂ livre ficava abaixo de cerca de um cem milésimo do nível atual: as rochas mais antigas guardam um padrão invulgar de isótopos de enxofre que só um ar pobre em oxigénio deixa.',
        'O Sol brilhava cerca de um quinto menos do que hoje, e mesmo assim o mar não gelou: os gases com efeito de estufa, o dióxido de carbono e o metano, mantinham a jovem Terra quente.',
        'Um ar rico em metano pode, por vezes, ter formado uma neblina orgânica cor de laranja, como em Titã, a lua de Saturno. A ideia vem de isótopos de carbono e de enxofre em rochas com cerca de 2,65 a 2,5 mil milhões de anos, e ainda é debatida.',
        'As cianobactérias provavelmente já produziam oxigénio, mas ele era gasto tão depressa quanto era feito, pelo ferro do mar e pelos gases dos vulcões, até que, há cerca de 2,4 mil milhões de anos, começou a acumular-se no ar.',
      ],
    },
    makers: {
      label: 'Os primeiros fabricantes de oxigénio',
      title: 'Os primeiros fabricantes de oxigénio',
      sunLabel: 'Luz do Sol nas células',
      verbs: { sun: 'Mandar luz com o espelho', shade: 'Desviar o espelho', mud: 'Olhar para dentro da lama', mat: 'Olhar para o tapete verde' },
      hints: { sun: 'Toca no espelho para mandar luz do Sol', mud: 'Toca na lama ao lado da lente', mat: 'Toca no tapete verde para voltar', shade: 'Toca no espelho para o desviar' },
      signs: { water: 'água', oxygen: 'oxigénio', cells: 'cianobactérias', anaerobes: 'micróbios que não precisam de oxigénio', mat: 'tapete verde', mudBank: 'lama', mirror: 'espelho' },
      says: {
        sun: { kid: 'Luz do Sol! Agora repara: as células partem a água e libertam bolhas de oxigénio. Foi assim que se fez o primeiro oxigénio.', sci: 'A luz faz partir a água: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. O O₂ é libertado como resíduo; o hidrogénio serve depois para transformar o CO₂ em açúcar.' },
        shade: { kid: 'Sem luz, não há oxigénio. As células descansam.', sci: 'Sem luz, a água deixa logo de ser partida.' },
        mud: { kid: 'Lá em baixo, na lama, vivem micróbios que nunca precisaram de oxigénio. Para eles, o novo gás era um veneno! Vê como se afastam, mais para o fundo, onde ele não os consegue alcançar.', sci: 'Anaeróbios obrigatórios, como os produtores de metano e os redutores de sulfato. O O₂, e as formas reativas que ele cria dentro das células, danificam as suas enzimas, e muitos deles não têm as enzimas que as eliminariam.' },
        mudDark: { kid: 'Agora não há luz do Sol, por isso não desce oxigénio, e os micróbios da lama estão contentes. Manda um pouco de luz e vê o que acontece.', sci: 'No escuro, o tapete não produz O₂, e a lama continua anóxica.' },
        mat: { kid: 'De volta aos fabricantes de oxigénio: cadeias de minúsculas células azul-esverdeadas.', sci: 'Cianobactérias filamentosas: cada célula tem alguns micrómetros, aqui desenhada dezenas de milhares de vezes maior.' },
      },
      panel: {
        kid: [
          'Estas cadeias de minúsculas células azul-esverdeadas são cianobactérias. Com a luz do Sol, partem a água: guardam o hidrogénio para fazer o seu alimento e deixam sair o oxigénio. Nenhum ser vivo tinha feito isto antes, e isso mudou o mundo inteiro.',
          'Toca no espelho para mandar luz do Sol para elas e depois toca na lama. Os micróbios da lama nunca tinham encontrado oxigénio, e para eles era um veneno. Muitos mudaram-se para sítios onde o oxigénio não chega, e a família deles ainda hoje lá vive: na lama funda, nos pântanos e até dentro da tua barriga.',
        ],
        sci: [
          'Fotossíntese oxigénica: 6 CO₂ + 12 H₂O + luz → C₆H₁₂O₆ + 6 O₂ + 6 H₂O. Todo o O₂ vem da água, partida no fotossistema II (2 H₂O → O₂ + 4 H⁺ + 4 e⁻); os eletrões e os protões reduzem o CO₂ a açúcar. Cornelis van Niel propôs, nos anos 1930, que o oxigénio vem da água. Em 1941, Samuel Ruben, Martin Kamen e colegas deram à alga verde Chlorella água enriquecida em oxigénio pesado, o oxigénio-18, e o O₂ libertado tinha a proporção de oxigénio-18 da água, não a do dióxido de carbono.',
          'Quando é que as cianobactérias começaram a produzir oxigénio é debatido: entre cerca de 3 e 2,5 mil milhões de anos atrás, ou antes; há 2,4 mil milhões de anos o O₂ já se acumulava. Para os anaeróbios obrigatórios, como os metanogénicos e os redutores de sulfato, o O₂ e os seus produtos reativos são tóxicos. Os seus descendentes vivem onde ele não chega: lama do mar e dos lagos, zonas húmidas, fontes termais, rocha profunda e intestinos de animais, incluindo os nossos (há metanogénicos no intestino humano).',
        ],
      },
    },
    sea: {
      label: 'O mar que enferruja',
      title: 'O mar que enferruja',
      timeLabel: 'Milhões de anos depois',
      timeFmt: { start: 'O mar, há 2,5 mil milhões de anos', later: '{n} milhões de anos depois', today: 'Hoje' },
      verbs: { bloom: 'Uma estação de sol: os micróbios florescem', quiet: 'Uma estação calma', again: 'Começar uma nova amostra' },
      hints: { bloom: 'Toca nos micróbios para florescerem', quiet: 'Toca nos micróbios para uma estação calma', time: 'Abre o painel e desliza os anos', gorge: 'Toca no desfiladeiro dentro da rocha', wait: 'Espera que a camada assente' },
      signs: { microbes: 'micróbios', iron: 'ferro invisível na água', cut: 'Hoje: Karijini, Austrália' },
      board: {
        layers: 'Camadas: vermelhas {r}, cinzentas {g}',
        sea: 'Toca nos micróbios lá em cima.',
        laid: 'Depositadas, camada sobre camada, durante milhões de anos',
        buried: 'Enterradas fundo e apertadas até virarem rocha',
        lifted: 'Levantadas e gastas pela chuva e pelos rios',
        today: 'Hoje: as paredes de um desfiladeiro',
      },
      rows: { red: 'Camadas vermelhas (ferro)', grey: 'Camadas cinzentas (sílica)' },
      says: {
        bloom: { kid: 'Uma estação de sol: os micróbios florescem e fazem muito oxigénio. Ele agarra o ferro escondido na água, e cai uma neve de ferrugem: uma camada vermelha!', sci: 'Uma floração: o O₂ oxida o Fe²⁺ dissolvido a Fe³⁺, que precipita como hidróxido de ferro(III): 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. Assenta numa banda rica em ferro.' },
        quiet: { kid: 'Uma estação calma: poucos micróbios, pouco oxigénio, nada de ferrugem. Em vez disso, assenta um pó cinzento e fino de sílica: uma camada cinzenta.', sci: 'Pouco O₂, pouco óxido de ferro: a sílica, abundante num mar onde ainda ninguém fazia conchas de vidro, assenta numa banda rica em sílica, o futuro sílex.' },
        full: { kid: 'Que pilha de riscas! Agora deixa passar milhões de anos: abre o painel e desliza os anos.', sci: 'Bandas suficientes para uma amostra: agora faz avançar o tempo.' },
        laid: { kid: 'Estação após estação, durante milhões de anos: milhares e milhares de camadas, com centenas de metros de espessura!', sci: 'As formações de ferro bandado acumularam-se durante milhões de anos; as da bacia de Hamersley têm centenas de metros de espessura.' },
        buried: { kid: 'Enterradas fundo, apertadas e aquecidas: as camadas moles transformam-se em rocha dura, e a ferrugem em minerais de ferro brilhantes.', sci: 'Soterramento e diagénese: o hidróxido de ferro passa a hematite (Fe₂O₃) e magnetite (Fe₃O₄), e o gel de sílica passa a sílex, muitas vezes jaspe vermelho.' },
        lifted: { kid: 'Muito devagar, a rocha volta a ser empurrada para cima, e a chuva e os rios gastam a terra que está por cima dela.', sci: 'O levantamento e a erosão trazem a formação de volta à superfície.' },
        today: { kid: 'Hoje! Espreita pelo corte na rocha: as mesmas riscas vermelhas e cinzentas, agora as paredes de um desfiladeiro na Austrália.', sci: 'Hoje: o Parque Nacional de Karijini, no Pilbara, na Austrália Ocidental, onde os desfiladeiros cortam a Formação de Ferro de Brockman, com cerca de 2,5 mil milhões de anos.' },
        gorge: { kid: 'Estas riscas são a ferrugem do primeiro oxigénio, com quase 2,5 mil milhões de anos. A maior parte do ferro que as pessoas tiram da terra para fazer aço vem de rochas como estas!', sci: 'As formações de ferro bandado guardam mais de 60 % das reservas de ferro do mundo e dão a maior parte do minério de ferro extraído hoje, muitas vezes onde a água levou a sílica e deixou um minério mais rico. O Pilbara, à volta destes desfiladeiros, é uma das maiores regiões de minério de ferro da Terra.' },
        again: { kid: 'Uma nova amostra: água do mar limpa, com ferro escondido lá dentro.', sci: 'Uma coluna nova de água do mar anóxica.' },
      },
      panel: {
        kid: [
          'O mar antigo estava cheio de ferro, dissolvido e invisível, que saía de fontes quentes no fundo do oceano. Quando os micróbios fizeram oxigénio, ele agarrou o ferro, e juntos fizeram ferrugem, que caía como neve no fundo do mar.',
          'Toca nos micróbios: uma estação de sol faz uma camada vermelha de ferrugem, uma estação calma uma camada cinzenta de sílica. Constrói uma pilha de riscas e depois desliza os anos para veres onde estão hoje essas riscas.',
        ],
        sci: [
          'Antes do oxigénio, o oceano profundo era anóxico e transportava ferro(II) dissolvido, Fe²⁺, vindo de fontes hidrotermais ao longo das dorsais oceânicas. Onde as correntes ascendentes o traziam para águas pouco fundas e iluminadas, o oxigénio das cianobactérias oxidava-o: 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. Neste modelo, as bandas de ferro acompanham as florações; micróbios que oxidam o ferro diretamente com a luz, sem O₂, também podem ter feito algumas, e a causa das bandas ainda é debatida. (No nível Cientista, a água aparece esverdeada, como o Fe²⁺ dissolvido num tubo de ensaio; no mar estava diluído demais para se ver.)',
          'As formações de ferro bandado têm entre cerca de 3,8 e 1,8 mil milhões de anos, a maioria por volta de 2,5 mil milhões. As suas bandas vão de menos de um milímetro (algumas podem ser anuais) até metros de espessura. Havia muita sílica porque ainda ninguém fazia conchas de vidro: hoje são as diatomáceas e os radiolários que a tiram do mar. Enterrado, o hidróxido de ferro tornou-se hematite e magnetite, e o gel de sílica tornou-se sílex.',
        ],
      },
    },
    living: {
      label: 'Estromatólitos vivos hoje',
      title: 'Estromatólitos vivos hoje',
      yearsLabel: 'Anos de crescimento',
      yearsFmt: '{y} anos: {cm} cm',
      years: '{y} anos',
      verbs: { cut: 'Cortar o estromatólito ao meio', close: 'Voltar a juntá-lo', look: 'Ver as camadas de perto', away: 'Guardar a lupa' },
      hints: { cut: 'Toca no estromatólito para o cortar ao meio', look: 'Toca na face cortada para ver de perto', grow: 'Abre o painel e desliza os anos', close: 'Toca no estromatólito para o fechar' },
      signs: { cut: 'Hoje: Hamelin Pool, Austrália', sand: 'grãos de areia', mat: 'micróbios pegajosos', top: 'o topo vivo' },
      rows: { rate: 'Crescimento', rateValue: 'cerca de 0,3 mm por ano' },
      says: {
        cut: { kid: 'Cortado ao meio! Vês as camadas finas, como os anéis de uma árvore? Cada uma já foi o topo: um tapete pegajoso de micróbios coberto de areia.', sci: 'Em corte: lâminas abauladas de grãos de sedimento apanhados e colados por tapetes microbianos. As de Hamelin Pool são mais grosseiras e menos regulares do que muitas antigas.' },
        close: { kid: 'Inteiro outra vez, tal como está na água.', sci: 'Fechado outra vez.' },
        look: { kid: 'De perto: fios pegajosos de micróbios apanham grãos de areia. Depois sobem por entre a areia em direção à luz e fazem um tapete novo por cima. Camada a camada!', sci: 'Captura e fixação: as cianobactérias e o seu muco pegajoso apanham grãos de carbonato e depois deslizam por entre eles em direção à luz; algum carbonato de cálcio também precipita no tapete.' },
        away: { kid: 'Lupa guardada.', sci: 'Lupa guardada.' },
        young: { kid: 'Um jovem, só com alguns centímetros. Cresce tão devagar!', sci: 'A poucas décimas de milímetro por ano, um século acrescenta só cerca de 3 cm.' },
        old: { kid: 'Para ficar assim alto, demorou uns 3000 anos: começou a crescer muito antes de a Roma antiga ser construída!', sci: 'Cerca de 0,9 m a 0,3 mm por ano: uns 3000 anos de crescimento.' },
      },
      panel: {
        kid: [
          'Os estromatólitos ainda estão vivos! Em Hamelin Pool, em Shark Bay, na Austrália Ocidental, a água é cerca de duas vezes mais salgada do que o mar aberto, por isso os caracóis e outros animais que comeriam os micróbios não conseguem viver lá. Os tapetes continuam a construir, como faziam há milhares de milhões de anos.',
          'Crescem muito devagar, menos de meio milímetro por ano, por isso um monte da tua altura demorou milhares de anos. Toca num para o cortar ao meio e ver as camadas, e desliza os anos para o veres crescer.',
        ],
        sci: [
          'Os estromatólitos de Hamelin Pool crescem no máximo umas décimas de milímetro por ano (as estimativas vão de menos de 0,1 a cerca de 0,5 mm; é muitas vezes citado cerca de 0,3 mm). Um banco de areia à entrada da baía e a forte evaporação tornam a água cerca de duas vezes mais salgada do que a água do mar normal, o que afasta a maior parte dos animais que pastam. Estromatólitos marinhos vivos como estes são raros hoje; os fósseis mais antigos, também na Austrália Ocidental, têm cerca de 3,5 mil milhões de anos.',
          'O que o oxigénio tornou possível: à medida que o O₂ se acumulou, a partir de há cerca de 2,4 mil milhões de anos, formou-se uma camada de ozono que filtra grande parte do ultravioleta do Sol. O oxigénio também pode ter destruído boa parte do metano que mantinha a jovem Terra quente, ajudando a trazer as glaciações huronianas (há cerca de 2,45 a 2,2 mil milhões de anos), talvez a primeira Terra Bola de Neve; tanto a causa como a extensão do gelo são debatidas. Os animais que respiram oxigénio vieram muito mais tarde: os seus primeiros fósseis claros têm menos de 600 milhões de anos.',
        ],
      },
    },
  },
  pl: {
    title: 'Morze sprzed 2,5 miliarda lat',
    greet: {
      kid: 'Cześć! Jestem Tlen. Witaj nad morzem sprzed 2,5 miliarda lat! Nie ma tu roślin ani zwierząt, są tylko malutkie mikroby, które właśnie zaczynają mnie wytwarzać. Są tu trzy rzeczy do wypróbowania, a historia obrazka jest na sztaludze.',
      sci: 'Cześć! Jestem Tlen. To płytkie morze sprzed około 2,5 miliarda lat, tuż przed katastrofą tlenową: w powietrzu prawie nie ma wolnego tlenu, a wszystkie żywe istoty to mikroby. Trzy stanowiska: woda rozszczepiana światłem słonecznym, żelazo, które tlen zamienił w rdzę, i stromatolity żyjące do dziś. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Rozejrzyj się: naga czerwona skała, ciepła woda i ani jednej rośliny czy zwierzęcia. Jedyne życie to mikroby, o wiele za małe, żeby je zobaczyć, mieszkające w tych śliskich matach.',
        'Te kopce w wodzie to stromatolity. Budują je mikroby, cienka warstwa na cienkiej warstwie, bardzo, bardzo powoli.',
        'Tu nie dałoby się oddychać: w powietrzu prawie nie ma tlenu. Moja wielka praca dopiero się zaczyna!',
        'Niektórzy naukowcy sądzą, że niebo bywało wtedy zamglone i pomarańczowe przez gaz zwany metanem. A Słońce świeciło trochę słabiej niż dziś.',
      ],
      sci: [
        'Mniej więcej do 2,4 miliarda lat temu wolnego O₂ było mniej niż około jednej stutysięcznej dzisiejszej ilości: starsze skały zachowały nietypowy układ izotopów siarki, jaki zostawia tylko powietrze ubogie w tlen.',
        'Słońce świeciło o mniej więcej jedną piątą słabiej niż dziś, a jednak morze nie zamarzło: młodą Ziemię ogrzewały gazy cieplarniane, dwutlenek węgla i metan.',
        'Powietrze bogate w metan mogło czasem tworzyć pomarańczową mgłę organiczną, jak na Tytanie, księżycu Saturna. Ten pomysł opiera się na izotopach węgla i siarki w skałach liczących około 2,65 do 2,5 miliarda lat i wciąż budzi spory.',
        'Sinice prawdopodobnie już wytwarzały tlen, ale był on zużywany tak szybko, jak powstawał, przez żelazo w morzu i gazy z wulkanów, aż około 2,4 miliarda lat temu zaczął gromadzić się w powietrzu.',
      ],
    },
    makers: {
      label: 'Pierwsi wytwórcy tlenu',
      title: 'Pierwsi wytwórcy tlenu',
      sunLabel: 'Światło słoneczne na komórkach',
      verbs: { sun: 'Skieruj światło lusterkiem', shade: 'Odwróć lusterko', mud: 'Zajrzyj do mułu', mat: 'Popatrz na zieloną matę' },
      hints: { sun: 'Dotknij lusterka, żeby skierować światło', mud: 'Dotknij mułu obok soczewki', mat: 'Dotknij zielonej maty, żeby wrócić', shade: 'Dotknij lusterka, żeby je odwrócić' },
      signs: { water: 'woda', oxygen: 'tlen', cells: 'sinice', anaerobes: 'mikroby, którym tlen jest niepotrzebny', mat: 'zielona mata', mudBank: 'muł', mirror: 'lusterko' },
      says: {
        sun: { kid: 'Światło słoneczne! Teraz patrz: komórki rozrywają wodę i wypuszczają bąbelki tlenu. Tak powstał pierwszy tlen.', sci: 'Światło napędza rozszczepianie wody: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. O₂ jest wypuszczany jako odpad; wodór służy dalej do zamiany CO₂ w cukier.' },
        shade: { kid: 'Nie ma światła, nie ma tlenu. Komórki odpoczywają.', sci: 'Bez światła rozszczepianie wody od razu staje.' },
        mud: { kid: 'W mule na dole żyją mikroby, którym tlen nigdy nie był potrzebny. Dla nich nowy gaz był trucizną! Patrz, jak odsuwają się głębiej, tam, gdzie tlen do nich nie dotrze.', sci: 'Bezwzględne beztlenowce, na przykład wytwórcy metanu i bakterie redukujące siarczany. O₂ i reaktywne formy, które tworzy w komórkach, niszczą ich enzymy, a wielu z nich brakuje enzymów, które by je usuwały.' },
        mudDark: { kid: 'Teraz nie ma słońca, więc tlen nie schodzi w dół i mikroby z mułu są zadowolone. Skieruj trochę światła i zobacz, co się stanie.', sci: 'W ciemności mata nie wytwarza O₂ i muł pozostaje beztlenowy.' },
        mat: { kid: 'Wracamy do wytwórców tlenu: łańcuszków malutkich niebieskozielonych komórek.', sci: 'Nitkowate sinice: każda komórka ma kilka mikrometrów, tutaj jest narysowana dziesiątki tysięcy razy większa.' },
      },
      panel: {
        kid: [
          'Te łańcuszki malutkich niebieskozielonych komórek to sinice. Dzięki światłu słonecznemu rozrywają wodę: zatrzymują wodór, żeby zrobić z niego jedzenie, a tlen wypuszczają. Żadna żywa istota wcześniej tego nie robiła, i to zmieniło cały świat.',
          'Dotknij lusterka, żeby skierować na nie światło, a potem dotknij mułu. Mikroby w mule nigdy wcześniej nie spotkały tlenu i był dla nich trucizną. Wiele z nich przeniosło się tam, gdzie tlen nie dociera, i ich rodzina mieszka tam do dziś: w głębokim mule, na bagnach, a nawet w twoim brzuchu.',
        ],
        sci: [
          'Fotosynteza oksygeniczna: 6 CO₂ + 12 H₂O + światło → C₆H₁₂O₆ + 6 O₂ + 6 H₂O. Cały O₂ pochodzi z wody rozszczepianej w fotoukładzie II (2 H₂O → O₂ + 4 H⁺ + 4 e⁻); elektrony i protony redukują CO₂ do cukru. Cornelis van Niel zaproponował w latach 30. XX wieku, że tlen pochodzi z wody. W 1941 roku Samuel Ruben, Martin Kamen i współpracownicy podali zielonej aldze Chlorella wodę wzbogaconą w ciężki tlen-18, a uwolniony O₂ miał taki udział tlenu-18 jak woda, a nie jak dwutlenek węgla.',
          'Kiedy sinice zaczęły wytwarzać tlen, wciąż budzi spory: od około 3 do 2,5 miliarda lat temu albo wcześniej; 2,4 miliarda lat temu O₂ już się gromadził. Dla bezwzględnych beztlenowców, takich jak metanogeny i bakterie redukujące siarczany, O₂ i jego reaktywne produkty są toksyczne. Ich potomkowie żyją tam, gdzie tlen nie dociera: w mule mórz i jezior, na mokradłach, w gorących źródłach, w głębokich skałach i w jelitach zwierząt, także naszych (metanogeny żyją w ludzkim jelicie).',
        ],
      },
    },
    sea: {
      label: 'Rdzewiejące morze',
      title: 'Rdzewiejące morze',
      timeLabel: 'Miliony lat później',
      timeFmt: { start: 'Morze 2,5 miliarda lat temu', later: '{n} mln lat później', today: 'Dziś' },
      verbs: { bloom: 'Słoneczna pora: mikroby zakwitają', quiet: 'Spokojna pora', again: 'Zacznij nową próbkę' },
      hints: { bloom: 'Dotknij mikrobów, żeby zakwitły', quiet: 'Dotknij mikrobów, żeby nastała spokojna pora', time: 'Otwórz tablicę i przesuń lata', gorge: 'Dotknij wąwozu w skale', wait: 'Poczekaj, aż warstwa opadnie' },
      signs: { microbes: 'mikroby', iron: 'niewidzialne żelazo w wodzie', cut: 'Dziś: Karijini, Australia' },
      board: {
        layers: 'Warstwy: czerwone {r}, szare {g}',
        sea: 'Dotknij mikrobów na górze.',
        laid: 'Odkładane warstwa po warstwie przez miliony lat',
        buried: 'Zakopane głęboko i ściśnięte w skałę',
        lifted: 'Wypiętrzone, zdzierane przez deszcz i rzeki',
        today: 'Dziś: ściany wąwozu',
      },
      rows: { red: 'Czerwone warstwy (żelazo)', grey: 'Szare warstwy (krzemionka)' },
      says: {
        bloom: { kid: 'Słoneczna pora: mikroby zakwitają i robią mnóstwo tlenu. Tlen łapie żelazo ukryte w wodzie i zaczyna padać śnieg z rdzy: czerwona warstwa!', sci: 'Zakwit: O₂ utlenia rozpuszczony Fe²⁺ do Fe³⁺, który wytrąca się jako wodorotlenek żelaza(III): 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. Osiada jako pasmo bogate w żelazo.' },
        quiet: { kid: 'Spokojna pora: mało mikrobów, mało tlenu, brak rdzy. Zamiast niej opada drobny szary pył krzemionki: szara warstwa.', sci: 'Mało O₂, mało tlenku żelaza: krzemionka, obfita w morzu, w którym nic jeszcze nie budowało szklanych pancerzyków, osiada jako pasmo bogate w krzemionkę, przyszły czert.' },
        full: { kid: 'Ale stos pasków! Teraz niech miną miliony lat: otwórz tablicę i przesuń lata.', sci: 'Dość pasm na próbkę: teraz przesuń czas dalej.' },
        laid: { kid: 'Pora za porą, przez miliony lat: tysiące i tysiące warstw, setki metrów grubości!', sci: 'Wstęgowe formacje żelaziste narastały przez miliony lat; te z basenu Hamersley mają setki metrów grubości.' },
        buried: { kid: 'Zakopane głęboko, ściśnięte i ogrzane: miękkie warstwy zamieniają się w twardą skałę, a rdza w lśniące minerały żelaza.', sci: 'Pogrzebanie i diageneza: wodorotlenek żelaza przechodzi w hematyt (Fe₂O₃) i magnetyt (Fe₃O₄), a żel krzemionkowy w czert, często w czerwony jaspis.' },
        lifted: { kid: 'Bardzo powoli skała jest wypychana z powrotem w górę, a deszcz i rzeki ścierają ląd nad nią.', sci: 'Wypiętrzenie i erozja wynoszą formację z powrotem na powierzchnię.' },
        today: { kid: 'Dziś! Zajrzyj przez szczelinę w skale: te same czerwone i szare paski, teraz to ściany wąwozu w Australii.', sci: 'Dziś: Park Narodowy Karijini w regionie Pilbara w Australii Zachodniej, gdzie wąwozy przecinają formację żelazistą Brockman, liczącą około 2,5 miliarda lat.' },
        gorge: { kid: 'Te paski to rdza z pierwszego tlenu, prawie 2,5 miliarda lat. Większość żelaza, które ludzie wydobywają, żeby robić stal, pochodzi ze skał takich jak te!', sci: 'Wstęgowe formacje żelaziste zawierają ponad 60 % światowych zasobów żelaza i dają większość wydobywanej dziś rudy żelaza, często tam, gdzie woda wypłukała krzemionkę i zostawiła bogatszą rudę. Pilbara wokół tych wąwozów to jeden z największych regionów rudy żelaza na Ziemi.' },
        again: { kid: 'Nowa próbka: czysta morska woda, a w niej ukryte żelazo.', sci: 'Świeża kolumna beztlenowej wody morskiej.' },
      },
      panel: {
        kid: [
          'Pradawne morze było pełne żelaza, rozpuszczonego i niewidzialnego, które wypływało z gorących źródeł głęboko w oceanie. Kiedy mikroby wytworzyły tlen, tlen złapał żelazo i razem zrobiły rdzę, która opadała jak śnieg na dno morza.',
          'Dotknij mikrobów: słoneczna pora daje czerwoną warstwę rdzy, spokojna pora szarą warstwę krzemionki. Zbuduj stos pasków, a potem przesuń lata i zobacz, gdzie te paski są dziś.',
        ],
        sci: [
          'Przed pojawieniem się tlenu głęboki ocean był beztlenowy i niósł rozpuszczone żelazo(II), Fe²⁺, z kominów hydrotermalnych wzdłuż grzbietów śródoceanicznych. Tam, gdzie prądy wstępujące wynosiły je do płytkich, nasłonecznionych wód, tlen z sinic je utleniał: 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. W tym modelu pasma żelaza podążają za zakwitami; mikroby utleniające żelazo bezpośrednio światłem, bez O₂, mogły też wytworzyć ich część, a przyczyna pasmowania wciąż budzi spory. (Na poziomie „Naukowiec” woda jest zabarwiona na zielono, tak jak rozpuszczony Fe²⁺ w probówce; w morzu był zbyt rozcieńczony, żeby go zobaczyć.)',
          'Wstęgowe formacje żelaziste mają od około 3,8 do 1,8 miliarda lat, większość z nich około 2,5 miliarda. Ich pasma mają grubość od poniżej milimetra (niektóre mogą być roczne) do metrów. Krzemionki było dużo, bo nic jeszcze nie budowało szklanych pancerzyków: dziś wyjmują ją z morza okrzemki i promienice. Pogrzebany wodorotlenek żelaza stał się hematytem i magnetytem, a żel krzemionkowy czertem.',
        ],
      },
    },
    living: {
      label: 'Stromatolity żywe do dziś',
      title: 'Stromatolity żywe do dziś',
      yearsLabel: 'Lata wzrostu',
      yearsFmt: '{y} lat: {cm} cm',
      years: '{y} lat',
      verbs: { cut: 'Przetnij stromatolit', close: 'Złóż go z powrotem', look: 'Przyjrzyj się warstwom', away: 'Odłóż lupę' },
      hints: { cut: 'Dotknij stromatolitu, żeby go przeciąć', look: 'Dotknij przekroju, żeby przyjrzeć się z bliska', grow: 'Otwórz tablicę i przesuń lata', close: 'Dotknij stromatolitu, żeby go złożyć' },
      signs: { cut: 'Dziś: Hamelin Pool, Australia', sand: 'ziarna piasku', mat: 'lepkie mikroby', top: 'żywy wierzch' },
      rows: { rate: 'Wzrost', rateValue: 'około 0,3 mm na rok' },
      says: {
        cut: { kid: 'Przecięty na pół! Widzisz cienkie warstwy, jak słoje drzewa? Każda z nich była kiedyś na wierzchu: lepką matą mikrobów przykrytą piaskiem.', sci: 'W przekroju: wypukłe laminy ziaren osadu, wyłapanych i sklejonych przez maty mikrobowe. Te z Hamelin Pool są grubsze i mniej regularne niż wiele dawnych.' },
        close: { kid: 'Znowu w całości, tak jak stoi w wodzie.', sci: 'Znów zamknięty.' },
        look: { kid: 'Z bliska: lepkie nitki mikrobów łapią ziarna piasku. Potem przeciskają się przez piasek w górę, do światła, i robią na wierzchu nową matę. Warstwa po warstwie!', sci: 'Wyłapywanie i wiązanie: sinice i ich lepki śluz łapią ziarna węglanu, a potem wślizgują się między nie w stronę światła; w macie wytrąca się też trochę węglanu wapnia.' },
        away: { kid: 'Lupa odłożona.', sci: 'Lupa odłożona.' },
        young: { kid: 'Młodziak, ma tylko kilka centymetrów. Rośnie tak powoli!', sci: 'Przy kilku dziesiątych milimetra rocznie stulecie dodaje tylko około 3 cm.' },
        old: { kid: 'Żeby urosnąć tak wysoko, potrzebował około 3000 lat: zaczął rosnąć dużo wcześniej, niż zbudowano starożytny Rzym!', sci: 'Około 0,9 m przy 0,3 mm rocznie: jakieś 3000 lat wzrostu.' },
      },
      panel: {
        kid: [
          'Stromatolity żyją do dziś! W Hamelin Pool, w zatoce Shark Bay w Australii Zachodniej, woda jest mniej więcej dwa razy bardziej słona niż w otwartym morzu, więc ślimaki i inne zwierzęta, które zjadałyby mikroby, nie mogą tam żyć. Maty wciąż budują, tak jak miliardy lat temu.',
          'Rosną bardzo powoli, mniej niż pół milimetra na rok, więc kopiec tak wysoki jak ty rósł tysiące lat. Dotknij jednego, żeby go przeciąć i zobaczyć warstwy, i przesuń lata, żeby zobaczyć, jak rośnie.',
        ],
        sci: [
          'Stromatolity w Hamelin Pool rosną najwyżej kilka dziesiątych milimetra rocznie (szacunki wahają się od poniżej 0,1 do około 0,5 mm; często podaje się około 0,3 mm). Mielizna w poprzek zatoki i silne parowanie sprawiają, że woda jest mniej więcej dwa razy bardziej słona niż zwykła woda morska, co trzyma z daleka większość zwierząt pasących się na matach. Żywe stromatolity morskie takie jak te są dziś rzadkie; najstarsze kopalne, również w Australii Zachodniej, mają około 3,5 miliarda lat.',
          'Co umożliwił tlen: gdy O₂ gromadził się po około 2,4 miliarda lat temu, powstała warstwa ozonowa, która zatrzymuje dużą część słonecznego ultrafioletu. Tlen mógł też zniszczyć znaczną część metanu, który ogrzewał młodą Ziemię, i przyczynić się do zlodowaceń huronijskich (około 2,45 do 2,2 miliarda lat temu), być może pierwszej Ziemi-śnieżki; zarówno przyczyna, jak i zasięg lodu budzą spory. Zwierzęta oddychające tlenem pojawiły się znacznie później: ich pierwsze wyraźne skamieniałości mają mniej niż 600 milionów lat.',
        ],
      },
    },
  },
  de: {
    title: 'Ein Meer vor 2,5 Milliarden Jahren',
    greet: {
      kid: 'Hallo! Ich bin der Sauerstoff. Willkommen am Meer vor 2,5 Milliarden Jahren! Keine Pflanzen, keine Tiere, nur winzige Mikroben, und die fangen gerade erst an, mich zu machen. Hier gibt es drei Dinge zum Ausprobieren, und die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Hallo! Ich bin der Sauerstoff. Das ist ein flaches Meer vor etwa 2,5 Milliarden Jahren, kurz vor der Großen Sauerstoffkatastrophe: fast kein freier Sauerstoff in der Luft, und jedes Lebewesen ist eine Mikrobe. Drei Stationen: Wasser, vom Sonnenlicht gespalten, das Eisen, das der Sauerstoff rosten ließ, und Stromatolithen, die heute noch leben. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Schau dich um: kahler roter Fels, warmes Wasser und keine einzige Pflanze, kein einziges Tier. Das einzige Leben sind Mikroben, viel zu klein zum Sehen, die in diesen schleimigen Matten wohnen.',
        'Die Hügel im Wasser sind Stromatolithen. Mikroben bauen sie, eine dünne Schicht auf der anderen, ganz, ganz langsam.',
        'Hier könntest du nicht atmen: Die Luft hat fast keinen Sauerstoff. Meine große Aufgabe fängt gerade erst an!',
        'Manche Forschende glauben, dass der Himmel damals manchmal dunstig und orange war, wegen eines Gases namens Methan. Und die Sonne schien etwas schwächer als heute.',
      ],
      sci: [
        'Bis vor etwa 2,4 Milliarden Jahren lag freies O₂ unter etwa einem Hunderttausendstel des heutigen Werts: Ältere Gesteine bewahren ein ungewöhnliches Muster von Schwefelisotopen, das nur eine sauerstoffarme Luft hinterlässt.',
        'Die Sonne strahlte etwa ein Fünftel schwächer als heute, und doch fror das Meer nicht zu: Treibhausgase, Kohlenstoffdioxid und Methan, hielten die junge Erde warm.',
        'Methanreiche Luft hat vielleicht zeitweise einen orangen organischen Dunst gebildet, wie auf dem Saturnmond Titan. Die Idee stützt sich auf Kohlenstoff- und Schwefelisotope in etwa 2,65 bis 2,5 Milliarden Jahre alten Gesteinen und ist noch umstritten.',
        'Cyanobakterien machten wahrscheinlich schon Sauerstoff, aber er wurde so schnell verbraucht, wie er entstand, vom Eisen im Meer und von Gasen aus Vulkanen, bis er sich vor etwa 2,4 Milliarden Jahren in der Luft anzureichern begann.',
      ],
    },
    makers: {
      label: 'Die ersten Sauerstoffmacher',
      title: 'Die ersten Sauerstoffmacher',
      sunLabel: 'Sonnenlicht auf den Zellen',
      verbs: { sun: 'Licht mit dem Spiegel schicken', shade: 'Den Spiegel wegdrehen', mud: 'In den Schlamm schauen', mat: 'Die grüne Matte ansehen' },
      hints: { sun: 'Tippe auf den Spiegel, um Sonnenlicht zu schicken', mud: 'Tippe auf den Schlamm neben der Linse', mat: 'Tippe auf die grüne Matte, um zurückzuschauen', shade: 'Tippe auf den Spiegel, um ihn wegzudrehen' },
      signs: { water: 'Wasser', oxygen: 'Sauerstoff', cells: 'Cyanobakterien', anaerobes: 'Mikroben, die keinen Sauerstoff brauchen', mat: 'grüne Matte', mudBank: 'Schlamm', mirror: 'Spiegel' },
      says: {
        sun: { kid: 'Sonnenlicht! Jetzt pass auf: Die Zellen ziehen Wasser auseinander und lassen Sauerstoffbläschen frei. So entstand der erste Sauerstoff.', sci: 'Licht treibt die Spaltung von Wasser an: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. Das O₂ wird als Abfall abgegeben; der Wasserstoff hilft dann, aus CO₂ Zucker zu machen.' },
        shade: { kid: 'Kein Licht, kein Sauerstoff. Die Zellen ruhen.', sci: 'Ohne Licht hört die Wasserspaltung sofort auf.' },
        mud: { kid: 'Unten im Schlamm leben Mikroben, die nie Sauerstoff gebraucht haben. Für sie war das neue Gas ein Gift! Schau, wie sie weggehen, tiefer hinab, wo er sie nicht erreicht.', sci: 'Obligate Anaerobier, etwa Methanbildner und Sulfatreduzierer. O₂ und die reaktiven Formen, die es in Zellen bildet, schädigen ihre Enzyme, und vielen fehlen die Enzyme, die diese beseitigen würden.' },
        mudDark: { kid: 'Jetzt kein Sonnenlicht, also kommt kein Sauerstoff herunter, und die Mikroben im Schlamm sind zufrieden. Schick etwas Licht und schau, was passiert.', sci: 'Im Dunkeln bildet die Matte kein O₂, und der Schlamm bleibt sauerstofffrei.' },
        mat: { kid: 'Zurück zu den Sauerstoffmachern: Ketten aus winzigen blaugrünen Zellen.', sci: 'Fädige Cyanobakterien: jede Zelle einige Mikrometer groß, hier Zehntausende Male größer gezeichnet.' },
      },
      panel: {
        kid: [
          'Diese Ketten aus winzigen blaugrünen Zellen sind Cyanobakterien. Mit Sonnenlicht ziehen sie Wasser auseinander: Den Wasserstoff behalten sie für ihr Futter, den Sauerstoff lassen sie frei. Kein Lebewesen hatte das vorher getan, und es hat die ganze Welt verändert.',
          'Tippe auf den Spiegel, um Sonnenlicht auf sie zu schicken, und dann auf den Schlamm. Die Mikroben im Schlamm waren noch nie Sauerstoff begegnet, und für sie war er ein Gift. Viele zogen dorthin, wo kein Sauerstoff hinkommt, und ihre Familie lebt heute noch dort: in tiefem Schlamm, in Sümpfen, sogar in deinem Bauch.',
        ],
        sci: [
          'Oxygene Fotosynthese: 6 CO₂ + 12 H₂O + Licht → C₆H₁₂O₆ + 6 O₂ + 6 H₂O. Jedes O₂ stammt aus Wasser, gespalten im Photosystem II (2 H₂O → O₂ + 4 H⁺ + 4 e⁻); die Elektronen und Protonen reduzieren CO₂ zu Zucker. Cornelis van Niel schlug in den 1930er-Jahren vor, dass der Sauerstoff aus dem Wasser kommt. 1941 gaben Samuel Ruben, Martin Kamen und Kollegen der Grünalge Chlorella Wasser, das mit schwerem Sauerstoff-18 angereichert war, und das abgegebene O₂ trug den Sauerstoff-18-Anteil des Wassers, nicht den des Kohlenstoffdioxids.',
          'Wann Cyanobakterien begannen, Sauerstoff zu bilden, ist umstritten: vor etwa 3 bis 2,5 Milliarden Jahren oder früher; vor 2,4 Milliarden Jahren reicherte sich O₂ an. Für obligate Anaerobier wie Methanogene und Sulfatreduzierer sind O₂ und seine reaktiven Produkte giftig. Ihre Nachfahren leben, wo er nicht hinkommt: im Schlamm von Meeren und Seen, in Feuchtgebieten, heißen Quellen, tiefem Gestein und im Darm von Tieren, auch in unserem (im menschlichen Darm leben Methanogene).',
        ],
      },
    },
    sea: {
      label: 'Das rostende Meer',
      title: 'Das rostende Meer',
      timeLabel: 'Millionen Jahre später',
      timeFmt: { start: 'Das Meer vor 2,5 Milliarden Jahren', later: '{n} Millionen Jahre später', today: 'Heute' },
      verbs: { bloom: 'Eine sonnige Zeit: Die Mikroben blühen', quiet: 'Eine ruhige Zeit', again: 'Eine neue Probe beginnen' },
      hints: { bloom: 'Tippe auf die Mikroben, damit sie blühen', quiet: 'Tippe auf die Mikroben für eine ruhige Zeit', time: 'Öffne die Tafel und schiebe die Jahre', gorge: 'Tippe auf die Schlucht im Fels', wait: 'Warte, bis sich die Schicht gesetzt hat' },
      signs: { microbes: 'Mikroben', iron: 'unsichtbares Eisen im Wasser', cut: 'Heute: Karijini, Australien' },
      board: {
        layers: 'Schichten: {r} rot, {g} grau',
        sea: 'Tippe auf die Mikroben oben.',
        laid: 'Abgelagert, Schicht auf Schicht, über Millionen Jahre',
        buried: 'Tief begraben und zu Gestein gepresst',
        lifted: 'Gehoben, von Regen und Flüssen abgetragen',
        today: 'Heute: die Wände einer Schlucht',
      },
      rows: { red: 'Rote Schichten (Eisen)', grey: 'Graue Schichten (Kieselerde)' },
      says: {
        bloom: { kid: 'Eine sonnige Zeit: Die Mikroben blühen und machen viel Sauerstoff. Er schnappt sich das im Wasser versteckte Eisen, und Rost schneit herab: eine rote Schicht!', sci: 'Eine Blüte: O₂ oxidiert gelöstes Fe²⁺ zu Fe³⁺, das als Eisen(III)-hydroxid ausfällt: 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. Es setzt sich als eisenreiches Band ab.' },
        quiet: { kid: 'Eine ruhige Zeit: wenige Mikroben, wenig Sauerstoff, kein Rost. Stattdessen setzt sich feiner grauer Kieselstaub ab: eine graue Schicht.', sci: 'Wenig O₂, wenig Eisenoxid: Siliciumdioxid, reichlich in einem Meer, in dem noch nichts Glasschalen baute, setzt sich als kieselreiches Band ab, der spätere Chert.' },
        full: { kid: 'Was für ein Stapel Streifen! Jetzt lass Millionen Jahre vergehen: Öffne die Tafel und schiebe die Jahre.', sci: 'Genug Bänder für eine Probe: Jetzt schiebe die Zeit weiter.' },
        laid: { kid: 'Zeit um Zeit, Millionen Jahre lang: Tausende und Abertausende Schichten, Hunderte Meter dick!', sci: 'Bändereisenerze wuchsen über Millionen Jahre; die des Hamersley-Beckens sind Hunderte Meter mächtig.' },
        buried: { kid: 'Tief begraben, zusammengepresst und erwärmt: Die weichen Schichten werden zu hartem Gestein und der Rost zu glänzenden Eisenmineralen.', sci: 'Versenkung und Diagenese: Aus dem Eisenhydroxid werden Hämatit (Fe₂O₃) und Magnetit (Fe₃O₄), aus dem Kieselgel Chert, oft roter Jaspis.' },
        lifted: { kid: 'Ganz langsam wird das Gestein wieder nach oben gedrückt, und Regen und Flüsse tragen das Land darüber ab.', sci: 'Hebung und Abtragung bringen die Formation wieder an die Oberfläche.' },
        today: { kid: 'Heute! Schau durch den Spalt im Fels: dieselben roten und grauen Streifen, jetzt die Wände einer Schlucht in Australien.', sci: 'Heute: der Karijini-Nationalpark in der Pilbara in Westaustralien, wo Schluchten die etwa 2,5 Milliarden Jahre alte Brockman-Eisenformation durchschneiden.' },
        gorge: { kid: 'Diese Streifen sind der Rost des ersten Sauerstoffs, fast 2,5 Milliarden Jahre alt. Das meiste Eisen, das Menschen ausgraben, um Stahl zu machen, kommt aus Gestein wie diesem!', sci: 'Bändereisenerze enthalten mehr als 60 % der Eisenreserven der Welt und liefern das meiste heute geförderte Eisenerz, oft dort, wo Wasser das Siliciumdioxid ausgewaschen und ein reicheres Erz hinterlassen hat. Die Pilbara rund um diese Schluchten ist eine der größten Eisenerzregionen der Erde.' },
        again: { kid: 'Eine neue Probe: klares Meerwasser, mit Eisen darin versteckt.', sci: 'Eine frische Säule sauerstofffreien Meerwassers.' },
      },
      panel: {
        kid: [
          'Das uralte Meer war voller Eisen, gelöst und unsichtbar, das aus heißen Quellen tief im Ozean kam. Als die Mikroben Sauerstoff machten, schnappte er sich das Eisen, und zusammen wurden sie zu Rost, der auf den Meeresboden herabschneite.',
          'Tippe auf die Mikroben: Eine sonnige Zeit macht eine rote Rostschicht, eine ruhige Zeit eine graue Kieselschicht. Bau einen Stapel Streifen, dann schiebe die Jahre und sieh nach, wo diese Streifen heute sind.',
        ],
        sci: [
          'Vor dem Sauerstoff war der tiefe Ozean sauerstofffrei und führte gelöstes Eisen(II), Fe²⁺, aus Hydrothermalquellen entlang der Mittelozeanischen Rücken. Wo Auftrieb es in flaches, sonniges Wasser brachte, oxidierte es der Sauerstoff der Cyanobakterien: 4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺. In diesem Modell folgen die Eisenbänder den Blüten; Mikroben, die Eisen direkt mit Licht oxidieren, ohne O₂, könnten einige ebenfalls gebildet haben, und die Ursache der Bänderung ist noch umstritten. (Auf der Stufe „Wissenschaftler“ ist das Wasser grün getönt, wie gelöstes Fe²⁺ im Reagenzglas; im Meer war es viel zu verdünnt, um es zu sehen.)',
          'Bändereisenerze stammen aus der Zeit vor etwa 3,8 bis 1,8 Milliarden Jahren, die meisten aus der Zeit um 2,5 Milliarden. Ihre Bänder reichen von unter einem Millimeter (manche sind vielleicht Jahreslagen) bis zu Metern Dicke. Siliciumdioxid gab es reichlich, weil noch nichts Glasschalen baute: Heute holen Kieselalgen und Strahlentierchen es aus dem Meer. Begraben wurde das Eisenhydroxid zu Hämatit und Magnetit, das Kieselgel zu Chert.',
        ],
      },
    },
    living: {
      label: 'Stromatolithen, heute lebendig',
      title: 'Stromatolithen, heute lebendig',
      yearsLabel: 'Jahre des Wachstums',
      yearsFmt: '{y} Jahre: {cm} cm',
      years: '{y} Jahre',
      verbs: { cut: 'Den Stromatolithen aufschneiden', close: 'Wieder zusammensetzen', look: 'Die Schichten genauer ansehen', away: 'Die Lupe wegstecken' },
      hints: { cut: 'Tippe auf den Stromatolithen, um ihn aufzuschneiden', look: 'Tippe auf die Schnittfläche, um genauer hinzusehen', grow: 'Öffne die Tafel und schiebe die Jahre', close: 'Tippe auf den Stromatolithen, um ihn zu schließen' },
      signs: { cut: 'Heute: Hamelin Pool, Australien', sand: 'Sandkörner', mat: 'klebrige Mikroben', top: 'die lebende Oberseite' },
      rows: { rate: 'Wachstum', rateValue: 'etwa 0,3 mm im Jahr' },
      says: {
        cut: { kid: 'In zwei Hälften! Siehst du die dünnen Schichten, wie die Jahresringe eines Baums? Jede war einmal oben: eine klebrige Mikrobenmatte voller Sand.', sci: 'Im Schnitt: gewölbte Lagen aus Sedimentkörnern, von Mikrobenmatten gefangen und gebunden. Die von Hamelin Pool sind gröber und unregelmäßiger als viele alte.' },
        close: { kid: 'Wieder ganz, so wie er im Wasser steht.', sci: 'Wieder geschlossen.' },
        look: { kid: 'Ganz nah: Klebrige Fäden aus Mikroben fangen Sandkörner. Dann klettern sie durch den Sand hinauf zum Licht und machen oben eine neue Matte. Schicht um Schicht!', sci: 'Fangen und Binden: Cyanobakterien und ihr klebriger Schleim fangen Karbonatkörner und gleiten dann zwischen ihnen hindurch zum Licht; etwas Calciumcarbonat fällt in der Matte auch aus dem Wasser aus.' },
        away: { kid: 'Lupe weggesteckt.', sci: 'Lupe weggesteckt.' },
        young: { kid: 'Ein junger, nur ein paar Zentimeter. Er wächst so langsam!', sci: 'Bei wenigen Zehntelmillimetern im Jahr legt ein Jahrhundert nur etwa 3 cm zu.' },
        old: { kid: 'So hoch zu werden hat etwa 3000 Jahre gedauert: Er fing an zu wachsen, lange bevor das alte Rom gebaut wurde!', sci: 'Etwa 0,9 m bei 0,3 mm im Jahr: rund 3000 Jahre Wachstum.' },
      },
      panel: {
        kid: [
          'Stromatolithen leben noch heute! Im Hamelin Pool, in der Shark Bay in Westaustralien, ist das Wasser etwa doppelt so salzig wie das offene Meer, deshalb können Schnecken und andere Tiere, die die Mikroben fressen würden, dort nicht leben. Die Matten bauen weiter, so wie vor Milliarden Jahren.',
          'Sie wachsen sehr langsam, weniger als einen halben Millimeter im Jahr, also hat ein Hügel so groß wie du Tausende Jahre gebraucht. Tippe auf einen, um ihn aufzuschneiden und seine Schichten zu sehen, und schiebe die Jahre, um ihm beim Wachsen zuzusehen.',
        ],
        sci: [
          'Die Stromatolithen von Hamelin Pool wachsen höchstens einige Zehntelmillimeter im Jahr (Schätzungen reichen von unter 0,1 bis etwa 0,5 mm; oft werden etwa 0,3 mm genannt). Eine Sandbank quer über die Bucht und starke Verdunstung machen das Wasser etwa doppelt so salzig wie normales Meerwasser, was die meisten weidenden Tiere fernhält. Lebende Meeresstromatolithen wie diese sind heute selten; die ältesten fossilen, ebenfalls in Westaustralien, sind etwa 3,5 Milliarden Jahre alt.',
          'Was der Sauerstoff möglich machte: Als sich O₂ ab vor etwa 2,4 Milliarden Jahren anreicherte, entstand eine Ozonschicht, die einen Großteil des ultravioletten Sonnenlichts abschirmt. Sauerstoff hat vielleicht auch viel von dem Methan zerstört, das die junge Erde warm hielt, und so zu den huronischen Eiszeiten beigetragen (vor etwa 2,45 bis 2,2 Milliarden Jahren), womöglich der ersten Schneeball-Erde; sowohl die Ursache als auch die Ausdehnung des Eises sind umstritten. Tiere, die Sauerstoff atmen, kamen viel später: Ihre ersten eindeutigen Fossilien sind weniger als 600 Millionen Jahre alt.',
        ],
      },
    },
  },
}
