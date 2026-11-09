// The words of silver's wire room ("Can a rock grow silver hair?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Ag.js (the easel
// shows it). Facts and what is a model:
// - The legend: two children, Helga and Jacob, their ox butting the rock on Gruveaasen, early July 1623 (Norsk
//   Bergverksmuseum; Wikipedia: "between 1 and 5 July 1623"; the story is the town's legend, probably romanticised).
//   The Silver Works run from 1623 to 1958 (some sources say 1957), about 1350 tonnes of silver in all (Wikipedia:
//   1.3 million kg), the King's Mine over 1000 m deep (1068 m; its bottom about 500 m below sea level, Wikipedia says
//   560 m: the words say neither); Christian IV founds the town in 1624; over 4000 people work for the mines in the
//   1770s. The board's tonnes and metres between 1623 and 1958 are a smooth curve (a model), and the words say so.
// - Fire-setting: 10 to 15 cm of rock per fire (Bjoern Ivar Berg, quoted by Blaafarveveerket and bergverkshistorie.no),
//   fires lit on Friday and the miners back on Monday (Galissard de Marignac, 1839, in Mines ParisTech's "Grand Tour
//   industriel"), the last fire in 1890, a smoke loft along the top of the gallery. The model weekend lasts 15 s. A
//   fire a weekend would be 4 or 5 a month (40 to 75 cm) and 52 a year (5 to 8 m): arithmetic on the 10 to 15 cm.
// - Wire silver: Anderson, Mathur, Rakovan and Tremsin, Geology 47 (2019): wire grows at its base from silver
//   sulfide as argentite, a superionic conductor, above about 177 C (the board's figure; acanthite changes to
//   argentite between 173 and 180 C by source); wires up to 7 mm in an hour in a Bunsen flame (Anderson, Cedarville
//   2016); the board says 450 to 700 C and millimetres in half an hour, and the room's growth follows that (30
//   minutes in 5 seconds, 3 mm a half hour at 650 C and more). Silver sulfide melts at about 830 C (sources give 825
//   to 836 C). Whether Kongsberg's own wires grew hot or slowly and cool in groundwater is debated (Geology 2019
//   against Scientific Reports 2018). The lump is drawn about 50 times too big; the lens is a model.
export const WIRE_WORDS = {
  en: {
    title: 'The King’s Mine',
    greet: {
      kid: 'Welcome to Kongsberg in Norway, at dusk! I am silver, and in this mountain I once grew like hair. Three stations: the ox’s find, fire against the rock and a forge that grows silver hair. The picture’s story is on the easel.',
      sci: 'Kongsberg’s King’s Mine at dusk, then its gallery: the ox’s find, fire-setting and wire silver grown from silver sulfide. Three stations. The picture’s story is on the easel.',
    },
    talk: {
      kid: [
        'Silver does not often grow like hair, but in the rock of Kongsberg it did, in curls and wires. The miners must have gasped!',
        'Miners dug here for 335 years, from 1623 to 1958. Imagine all the tunnels hiding inside this mountain!',
        'Silver sulfide is black and brittle. Heat it, and silver creeps out of it like hair out of a head.',
      ],
      sci: [
        'Wire silver is native silver in curls, wires and sheets. Kongsberg’s veins formed some 265 million years ago, when hot brines rose through cracks in the gneiss.',
        'The Silver Works ran from 1623 to 1958 and gave about 1350 tonnes of silver; the King’s Mine went down more than 1000 m.',
        'Curls grow on silver sulfide: in a flame, silver ions run through the solid to the wire’s root. Whether Kongsberg’s own wires grew like that is still debated.',
      ],
    },
    ox: {
      label: 'The ox’s find',
      verbOx: 'Tap the ox',
      verbGlint: 'Tap the glint',
      verbYear: 'Drag the year',
      title: '1623: the ox’s find',
      tip: 'Tap the ox, then the glint, or drag the year.',
      slider: 'Year',
      buttons: { butt: 'Send the ox at the rock' },
      panel: {
        kid: [
          'The town tells that in 1623 two children, Helga and Jacob, were minding cattle on this hill when their ox butted the rock and something shone: silver! Tap the ox, then the glint.',
          'Then drag the year and watch the town grow: miners came, shaft houses and waterwheels were built, and houses with lit windows filled the valley.',
        ],
        sci: [
          'The story of Helga and Jacob and their ox is the town’s legend, and probably romanticised. Silver was found on Gruveåsen in early July 1623 and the Silver Works began that year; Christian IV founded Kongsberg in 1624.',
          'The board draws the silver (to about 1350 t) and the depth of the King’s Mine (to 1068 m) as smooth curves between the first and last numbers: a model, not records. In the 1770s about 4000 people worked for the mines.',
        ],
      },
      board: {
        title: 'Kongsberg',
        silver: 'Silver so far',
        depth: 'King’s Mine depth',
        about: 'about',
        model: 'The dates are records; the tonnes and metres between 1623 and 1958 are a smooth curve (a model).',
      },
      events: {
        e1623: { kid: 'Silver is found on the hill.', sci: 'July 1623: silver is found on Gruveåsen and the Silver Works begin.' },
        e1624: { kid: 'The king comes and founds the town of Kongsberg, the King’s Mountain.', sci: 'Christian IV founds the town of Kongsberg.' },
        e1770: { kid: 'About 4000 people work for the mines.', sci: 'In the 1770s about 4000 people work for the mines, at the peak.' },
        e1890: { kid: 'The last fire is lit against the rock.', sci: '1890: the last fire-setting. Its smooth, rounded galleries remain.' },
        e1958: { kid: 'After 335 years the mines close.', sci: '1958: the Silver Works close (some sources say 1957).' },
      },
      says: {
        butt: { kid: 'Look, the ox lowers its horns!', sci: 'The ox butts the outcrop, as the town tells it.' },
        glint: { kid: 'Something shines in the rock! Tap the glint.', sci: 'A flake falls and a metallic glint shows. Tap it.' },
        take: {
          kid: 'Silver! A black lump with curls of silver in it. Now drag the year and watch Kongsberg grow.',
          sci: 'Black ore with wire silver. The legend says this began a mine that ran for 335 years: drag the year.',
        },
      },
    },
    fire: {
      label: 'Fire against the rock',
      verbLogs: 'Tap the logs',
      verbTorch: 'Tap the torch',
      verbWait: 'Watch the fire',
      verbTools: 'Tap the hammer and pick',
      title: 'Cracking rock with fire',
      tip: 'Tap the logs, the torch, then the hammer and pick, or drag the fires.',
      slider: 'Fires lit, one each weekend',
      buttons: { logs: 'Stack the logs', torch: 'Light the fire', tools: 'Break the loosened rock' },
      panel: {
        kid: [
          'Hard rock is very tough to dig. So the miners made a fire against it! The hot rock cracked and flaked, and afterwards they could knock the loose bits away. The fire also made the tunnel’s walls smooth and round.',
          'They lit a fire on Friday and went home; on Monday the smoke had cleared. Tap the logs, the torch, and later the hammer and pick.',
        ],
        sci: [
          'Fire-setting: logs are stacked against the face and burned; the heated surface expands, cracks and spalls, and the miners loosen it with hammer and pick. At Kongsberg a fire took away about 10 to 15 cm of rock and left the galleries’ walls smoothly rounded.',
          'Fires were lit on Friday and the miners came back on Monday (Galissard de Marignac, 1839); a wooden smoke loft along the top of the gallery carried the smoke away, and the last fire was lit in 1890. Here a weekend lasts 15 seconds.',
        ],
      },
      board: {
        title: 'Fire-setting',
        days: { fri: 'Fri', sat: 'Sat', sun: 'Sun', mon: 'Mon' },
        fires: 'fires lit',
        advance: 'Advance',
        kid: 'Each fire loosens about a hand’s width of rock, 10 to 15 cm. A month of weekend fires digs less than a metre!',
        sci: '10 to 15 cm a fire (the pale band). A fire every weekend: 4 or 5 a month make 40 to 75 cm, a year of weekends 5 to 8 m.',
      },
      says: {
        logs: { kid: 'Split logs, stacked against the rock. Now light them with the torch.', sci: 'Split logs stacked against the face, as the miners did. Now the torch.' },
        torch: { kid: 'The fire is lit! It burns all weekend: watch the rock.', sci: 'Lit on Friday. The weekend is sped up to 15 seconds.' },
        tools: { kid: 'Knock, knock! The cracked rock falls away.', sci: 'Hammer and pick: the loosened plates come away and the face moves on 12.5 cm, the middle of 10 to 15.' },
        cooled: { kid: 'Monday! The fire is out and the rock is cracked and flaking. Tap the hammer and pick.', sci: 'Monday: the rock is cracked and spalling. Hammer and pick next.' },
        enough: { kid: 'Twelve weekends, three months of fires, and the tunnel has gone on only about a metre and a half!', sci: 'Twelve weekends of fires: 1.2 to 1.8 m of gallery.' },
      },
    },
    hair: {
      label: 'Grow silver hair',
      verbBellows: 'Tap the bellows',
      verbVein: 'Tap a curl in the vein',
      verbRake: 'Tap the rake',
      title: 'Silver hair from black rock',
      tip: 'Tap the bellows to heat the lump, the rake to cool it, and a curl in the vein, or drag the temperature.',
      slider: 'Temperature',
      buttons: { hotter: 'Blow the bellows', cooler: 'Rake out the coals', fresh: 'A fresh lump', vein: 'Tap a curl in the vein' },
      panel: {
        kid: [
          'On the hearth is a lump of silver sulfide, black and hard, made about 50 times bigger so you can see it. Heat it, and silver hair grows out of it, like toothpaste out of a tube!',
          'The lens shows why: when it is warm enough, silver atoms start to creep through the black crystal to the root of each hair and push it out from below. Too hot, and the lump melts.',
        ],
        sci: [
          'Silver sulfide (Ag2S) is acanthite below about 177 °C. Above that it is argentite, a superionic conductor: its silver ions move through the solid sulfur lattice almost like a liquid. Where they meet a wire they become metal, so the wire is built at its base and pushed out.',
          'In a flame at 450 to 700 °C wires grow millimetres in half an hour (Anderson and others, 2019; here 30 minutes pass in 5 seconds). Silver sulfide melts at about 830 °C (sources give 825 to 836) and the curls are lost. The lump is drawn about 50 times too big.',
        ],
      },
      lens: { sulfide: 'silver sulfide', wire: 'silver wire', root: 'Ag+ arrives and becomes silver' },
      plate: { acanthite: 'acanthite', argentite: 'argentite', grow: 'growing', melt: 'melting', wire: 'longest curl' },
      ideas: {
        title: 'How did Kongsberg’s grow?',
        hot: { head: 'Hot', line: 'From argentite, as in the lab' },
        cool: { head: 'Slow and cool', line: 'Groundwater changing sulfide' },
        unknown: { head: 'Nobody knows yet', line: 'The rock does not say' },
      },
      says: {
        acanthite: { kid: 'Cold: the silver atoms sit still in the black crystal.', sci: 'Below about 177 °C: acanthite. The silver ions stay in their places.' },
        argentite: { kid: 'Warm enough! The silver atoms start to creep through the black crystal.', sci: 'Above about 177 °C: argentite. The silver ions run through the sulfur lattice.' },
        grow: { kid: 'Hot! Silver gathers at the root of each hair and pushes it out.', sci: 'From 450 °C the ions plate out at the wires’ roots: growth from the base, millimetres per half hour.' },
        melt: { kid: 'Too hot! The lump melts and the hair is lost. Tap the lump for a fresh one.', sci: 'At about 830 °C silver sulfide melts and the curls are lost. Tap the lump for a fresh one.' },
        rake: { kid: 'The coals are raked out and the lump cools.', sci: 'Coals raked out: the lump cools toward room temperature.' },
        fresh: { kid: 'A fresh lump of silver sulfide.', sci: 'A fresh lump: black silver sulfide, no wires yet.' },
        lump: { kid: 'A lump of silver sulfide. Heat it with the bellows!', sci: 'Silver sulfide, Ag2S. Heat it with the bellows.' },
        lumpHot: { kid: 'It is growing hair! Look at the lens.', sci: 'Wires are growing: watch the lens.' },
        idea1: { kid: 'Maybe Kongsberg’s silver hair grew hot, like in the flame.', sci: 'One idea: the wires grew hot from argentite, as in the 2019 study in Geology.' },
        idea2: { kid: 'Or maybe it grew slowly and cool, while water in the ground changed the black ore over ages.', sci: 'Another: slowly and cool, as groundwater altered the sulfide (Scientific Reports, 2018).' },
        idea3: { kid: 'Nobody knows yet which! Scientists are still looking.', sci: 'The question is open: the natural wires may have grown either way.' },
      },
    },
  },
  'pt-pt': {
    title: 'A Mina do Rei',
    greet: {
      kid: 'Bem-vindo a Kongsberg, na Noruega, ao anoitecer! Eu sou a prata e, nesta montanha, cresci como cabelo. Três estações: o achado do boi, o fogo contra a rocha e uma forja que faz crescer cabelo de prata. A história da imagem está no cavalete.',
      sci: 'A Mina do Rei de Kongsberg ao anoitecer e depois a sua galeria: o achado do boi, o fogo na rocha e a prata em fio crescida a partir do sulfureto de prata. Três estações. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'A prata raramente cresce como cabelo, mas na rocha de Kongsberg crescia, em caracóis e fios. Os mineiros devem ter ficado de boca aberta!',
        'Houve mineiros a escavar aqui durante 335 anos, de 1623 a 1958. Imagina todos os túneis escondidos dentro desta montanha!',
        'O sulfureto de prata é negro e quebradiço. Aquece-o e a prata sai dele devagarinho, como o cabelo de uma cabeça.',
      ],
      sci: [
        'A prata em fio é prata nativa em caracóis, fios e lâminas. Os filões de Kongsberg formaram-se há cerca de 265 milhões de anos, quando salmouras quentes subiram por fendas no gnaisse.',
        'A Silver Works funcionou de 1623 a 1958 e deu cerca de 1350 toneladas de prata; a Mina do Rei desceu mais de 1000 m.',
        'Os caracóis crescem sobre sulfureto de prata: numa chama, os iões de prata atravessam o sólido até à raiz do fio. Se os fios de Kongsberg cresceram assim, ainda se discute.',
      ],
    },
    ox: {
      label: 'O achado do boi',
      verbOx: 'Toca no boi',
      verbGlint: 'Toca no brilho',
      verbYear: 'Arrasta o ano',
      title: '1623: o achado do boi',
      tip: 'Toca no boi, depois no brilho, ou arrasta o ano.',
      slider: 'Ano',
      buttons: { butt: 'Mandar o boi à rocha' },
      panel: {
        kid: [
          'Conta a vila que, em 1623, duas crianças, a Helga e o Jacob, guardavam o gado nesta colina quando o boi deles marrou na rocha e algo brilhou: prata! Toca no boi e depois no brilho.',
          'Depois arrasta o ano e vê a vila crescer: chegaram mineiros, construíram-se casas de poços e rodas de água, e o vale encheu-se de casas com janelas acesas.',
        ],
        sci: [
          'A história da Helga, do Jacob e do boi é a lenda da vila, provavelmente embelezada. A prata foi encontrada em Gruveåsen no início de julho de 1623 e a Silver Works começou nesse ano; Cristiano IV fundou Kongsberg em 1624.',
          'O quadro desenha a prata (até cerca de 1350 t) e a profundidade da Mina do Rei (até 1068 m) como curvas suaves entre o primeiro e o último número: um modelo, não registos. Na década de 1770 trabalhavam para as minas cerca de 4000 pessoas.',
        ],
      },
      board: {
        title: 'Kongsberg',
        silver: 'Prata até agora',
        depth: 'Profundidade da mina',
        about: 'cerca de',
        model: 'As datas são registos; as toneladas e os metros entre 1623 e 1958 são uma curva suave (um modelo).',
      },
      events: {
        e1623: { kid: 'Encontra-se prata na colina.', sci: 'Julho de 1623: encontra-se prata em Gruveåsen e começa a Silver Works.' },
        e1624: { kid: 'O rei vem e funda a vila de Kongsberg, a Montanha do Rei.', sci: 'Cristiano IV funda a vila de Kongsberg.' },
        e1770: { kid: 'Cerca de 4000 pessoas trabalham para as minas.', sci: 'Na década de 1770, cerca de 4000 pessoas trabalham para as minas, no auge.' },
        e1890: { kid: 'Acende-se o último fogo contra a rocha.', sci: '1890: o último fogo na rocha. Ficaram as galerias lisas e arredondadas.' },
        e1958: { kid: 'Ao fim de 335 anos, as minas fecham.', sci: '1958: a Silver Works fecha (algumas fontes dizem 1957).' },
      },
      says: {
        butt: { kid: 'Olha, o boi baixa os chifres!', sci: 'O boi marra no afloramento, como conta a vila.' },
        glint: { kid: 'Algo brilha na rocha! Toca no brilho.', sci: 'Cai uma lasca e aparece um brilho metálico. Toca nele.' },
        take: {
          kid: 'Prata! Um pedaço negro com caracóis de prata. Agora arrasta o ano e vê Kongsberg crescer.',
          sci: 'Minério negro com prata em fio. A lenda diz que isto deu início a uma mina que durou 335 anos: arrasta o ano.',
        },
      },
    },
    fire: {
      label: 'Fogo contra a rocha',
      verbLogs: 'Toca nos troncos',
      verbTorch: 'Toca na tocha',
      verbWait: 'Vê o fogo',
      verbTools: 'Toca no martelo e na picareta',
      title: 'Partir a rocha com fogo',
      tip: 'Toca nos troncos, na tocha, depois no martelo e na picareta, ou arrasta os fogos.',
      slider: 'Fogos acesos, um por fim de semana',
      buttons: { logs: 'Empilhar os troncos', torch: 'Acender o fogo', tools: 'Partir a rocha solta' },
      panel: {
        kid: [
          'A rocha dura é muito difícil de escavar. Por isso os mineiros faziam uma fogueira contra ela! A rocha quente rachava e descascava, e depois eles tiravam os bocados soltos à martelada. O fogo também deixava as paredes do túnel lisas e redondas.',
          'Acendiam o fogo na sexta-feira e iam para casa; na segunda-feira o fumo já tinha saído. Toca nos troncos, na tocha e, mais tarde, no martelo e na picareta.',
        ],
        sci: [
          'Abertura a fogo: empilham-se troncos contra a frente e queimam-se; a superfície aquecida dilata, racha e descama, e os mineiros soltam-na com martelo e picareta. Em Kongsberg, cada fogo retirava cerca de 10 a 15 cm de rocha e deixava as paredes das galerias lisas e arredondadas.',
          'Os fogos acendiam-se à sexta-feira e os mineiros voltavam na segunda (Galissard de Marignac, 1839); um sótão de madeira ao longo do topo da galeria levava o fumo, e o último fogo foi aceso em 1890. Aqui um fim de semana dura 15 segundos.',
        ],
      },
      board: {
        title: 'Abertura a fogo',
        days: { fri: 'Sex', sat: 'Sáb', sun: 'Dom', mon: 'Seg' },
        fires: 'fogos acesos',
        advance: 'Avanço',
        kid: 'Cada fogo solta cerca de um palmo de rocha, 10 a 15 cm. Um mês de fogos ao fim de semana escava menos de um metro!',
        sci: '10 a 15 cm por fogo (a faixa clara). Um fogo cada fim de semana: 4 ou 5 por mês dão 40 a 75 cm; um ano de fins de semana, 5 a 8 m.',
      },
      says: {
        logs: { kid: 'Troncos rachados, empilhados contra a rocha. Agora acende-os com a tocha.', sci: 'Troncos rachados empilhados contra a frente, como faziam os mineiros. Agora a tocha.' },
        torch: { kid: 'O fogo está aceso! Arde todo o fim de semana: olha a rocha.', sci: 'Aceso à sexta-feira. O fim de semana está acelerado para 15 segundos.' },
        tools: { kid: 'Toc, toc! A rocha rachada cai.', sci: 'Martelo e picareta: as lascas soltas caem e a frente avança 12,5 cm, o meio de 10 a 15.' },
        cooled: { kid: 'Segunda-feira! O fogo apagou-se e a rocha está rachada e a descascar. Toca no martelo e na picareta.', sci: 'Segunda-feira: a rocha está rachada e a descamar. Segue-se o martelo e a picareta.' },
        enough: { kid: 'Doze fins de semana, três meses de fogos, e o túnel avançou só cerca de um metro e meio!', sci: 'Doze fins de semana de fogos: 1,2 a 1,8 m de galeria.' },
      },
    },
    hair: {
      label: 'Fazer crescer cabelo de prata',
      verbBellows: 'Toca no fole',
      verbVein: 'Toca num caracol do filão',
      verbRake: 'Toca no ancinho',
      title: 'Cabelo de prata de uma rocha negra',
      tip: 'Toca no fole para aquecer o pedaço, no ancinho para o arrefecer e num caracol do filão, ou arrasta a temperatura.',
      slider: 'Temperatura',
      buttons: { hotter: 'Soprar o fole', cooler: 'Tirar as brasas', fresh: 'Um pedaço novo', vein: 'Tocar num caracol do filão' },
      panel: {
        kid: [
          'Na lareira está um pedaço de sulfureto de prata, negro e duro, feito umas 50 vezes maior para o veres. Aquece-o e dele cresce cabelo de prata, como a pasta de dentes sai do tubo!',
          'A lente mostra porquê: quando está quente que chegue, os átomos de prata começam a deslizar pelo cristal negro até à raiz de cada fio e empurram-no por baixo. Se aquecer demais, o pedaço derrete.',
        ],
        sci: [
          'O sulfureto de prata (Ag2S) é acantite abaixo de cerca de 177 °C. Acima disso é argentite, um condutor superiónico: os iões de prata movem-se pela rede sólida de enxofre quase como num líquido. Onde encontram um fio, tornam-se metal, por isso o fio é construído pela base e empurrado para fora.',
          'Numa chama a 450 a 700 °C, os fios crescem milímetros em meia hora (Anderson e outros, 2019; aqui passam 30 minutos em 5 segundos). O sulfureto de prata funde a cerca de 830 °C (as fontes dão 825 a 836) e os caracóis perdem-se. O pedaço está desenhado umas 50 vezes maior.',
        ],
      },
      lens: { sulfide: 'sulfureto de prata', wire: 'fio de prata', root: 'Ag+ chega e torna-se prata' },
      plate: { acanthite: 'acantite', argentite: 'argentite', grow: 'a crescer', melt: 'a derreter', wire: 'caracol maior' },
      ideas: {
        title: 'Como cresceram os de Kongsberg?',
        hot: { head: 'A quente', line: 'De argentite, como no laboratório' },
        cool: { head: 'Devagar e a frio', line: 'Água subterrânea a mudar o sulfureto' },
        unknown: { head: 'Ainda ninguém sabe', line: 'A rocha não o diz' },
      },
      says: {
        acanthite: { kid: 'Frio: os átomos de prata estão quietos no cristal negro.', sci: 'Abaixo de cerca de 177 °C: acantite. Os iões de prata ficam nos seus lugares.' },
        argentite: { kid: 'Quente que chegue! Os átomos de prata começam a deslizar pelo cristal negro.', sci: 'Acima de cerca de 177 °C: argentite. Os iões de prata correm pela rede de enxofre.' },
        grow: { kid: 'Quente! A prata junta-se na raiz de cada fio e empurra-o para fora.', sci: 'A partir de 450 °C os iões depositam-se nas raízes dos fios: crescimento pela base, milímetros por meia hora.' },
        melt: { kid: 'Demasiado quente! O pedaço derrete e o cabelo perde-se. Toca no pedaço para ter um novo.', sci: 'A cerca de 830 °C o sulfureto de prata funde e os caracóis perdem-se. Toca no pedaço para ter um novo.' },
        rake: { kid: 'As brasas saem e o pedaço arrefece.', sci: 'Brasas retiradas: o pedaço arrefece para a temperatura ambiente.' },
        fresh: { kid: 'Um pedaço novo de sulfureto de prata.', sci: 'Um pedaço novo: sulfureto de prata negro, ainda sem fios.' },
        lump: { kid: 'Um pedaço de sulfureto de prata. Aquece-o com o fole!', sci: 'Sulfureto de prata, Ag2S. Aquece-o com o fole.' },
        lumpHot: { kid: 'Está a crescer cabelo! Olha para a lente.', sci: 'Os fios estão a crescer: olha para a lente.' },
        idea1: { kid: 'Talvez o cabelo de prata de Kongsberg tenha crescido a quente, como na chama.', sci: 'Uma ideia: os fios cresceram a quente a partir de argentite, como no estudo de 2019 na Geology.' },
        idea2: { kid: 'Ou talvez tenha crescido devagar e a frio, enquanto a água do chão mudava o minério negro ao longo de eras.', sci: 'Outra: devagar e a frio, enquanto a água subterrânea alterava o sulfureto (Scientific Reports, 2018).' },
        idea3: { kid: 'Ainda ninguém sabe qual! Os cientistas continuam a investigar.', sci: 'A questão está em aberto: os fios naturais podem ter crescido de qualquer das formas.' },
      },
    },
  },
  pl: {
    title: 'Kopalnia Królewska',
    greet: {
      kid: 'Witaj w Kongsbergu w Norwegii o zmroku! Jestem srebrem i w tej górze kiedyś rosłem jak włosy. Trzy stanowiska: znalezisko wołu, ogień przy skale i kuźnia, w której rosną srebrne włosy. Historia obrazka jest na sztalugach.',
      sci: 'Kopalnia Królewska w Kongsbergu o zmroku, a potem jej chodnik: znalezisko wołu, kruszenie skały ogniem i srebro drutowe rosnące na siarczku srebra. Trzy stanowiska. Historia obrazka jest na sztalugach.',
    },
    talk: {
      kid: [
        'Srebro rzadko rośnie jak włosy, ale w skale Kongsbergu rosło: w loczkach i drucikach. Górnicy musieli być zachwyceni!',
        'Górnicy kopali tu przez 335 lat, od 1623 do 1958 roku. Wyobraź sobie wszystkie korytarze ukryte w tej górze!',
        'Siarczek srebra jest czarny i kruchy. Ogrzej go, a srebro wyrośnie z niego jak włosy z głowy.',
      ],
      sci: [
        'Srebro drutowe to srebro rodzime w loczkach, drutach i blaszkach. Żyły Kongsbergu powstały około 265 milionów lat temu, gdy gorące solanki podnosiły się szczelinami w gnejsie.',
        'Kopalnie srebra działały od 1623 do 1958 roku i dały około 1350 ton srebra; Kopalnia Królewska sięgała ponad 1000 m w głąb.',
        'Loczki rosną na siarczku srebra: w płomieniu jony srebra przesuwają się przez ciało stałe do korzenia drucika. Czy druty z Kongsbergu rosły tak samo, wciąż jest sporne.',
      ],
    },
    ox: {
      label: 'Znalezisko wołu',
      verbOx: 'Dotknij wołu',
      verbGlint: 'Dotknij błysku',
      verbYear: 'Przeciągnij rok',
      title: '1623: znalezisko wołu',
      tip: 'Dotknij wołu, potem błysku, albo przeciągnij rok.',
      slider: 'Rok',
      buttons: { butt: 'Poślij wołu na skałę' },
      panel: {
        kid: [
          'Miasto opowiada, że w 1623 roku dwoje dzieci, Helga i Jacob, pasło bydło na tym wzgórzu, gdy ich wół uderzył rogami w skałę i coś zalśniło: srebro! Dotknij wołu, potem błysku.',
          'Potem przeciągnij rok i patrz, jak miasto rośnie: przybyli górnicy, stanęły szybowe budynki i koła wodne, a dolinę wypełniły domy ze świecącymi oknami.',
        ],
        sci: [
          'Historia Helgi, Jacoba i wołu to legenda miasta, prawdopodobnie podkolorowana. Srebro znaleziono na Gruveåsen na początku lipca 1623 roku i w tym roku ruszyły Kopalnie Srebra; Chrystian IV założył Kongsberg w 1624 roku.',
          'Tablica rysuje srebro (do około 1350 t) i głębokość Kopalni Królewskiej (do 1068 m) jako gładkie krzywe między pierwszą a ostatnią liczbą: to model, nie zapisy. W latach 70. XVIII wieku dla kopalń pracowało około 4000 osób.',
        ],
      },
      board: {
        title: 'Kongsberg',
        silver: 'Srebro dotąd',
        depth: 'Głębokość kopalni',
        about: 'około',
        model: 'Daty są udokumentowane; tony i metry między 1623 a 1958 to gładka krzywa (model).',
      },
      events: {
        e1623: { kid: 'Na wzgórzu znaleziono srebro.', sci: 'Lipiec 1623: na Gruveåsen znaleziono srebro i ruszają Kopalnie Srebra.' },
        e1624: { kid: 'Król przybywa i zakłada miasto Kongsberg, Królewską Górę.', sci: 'Chrystian IV zakłada miasto Kongsberg.' },
        e1770: { kid: 'Dla kopalń pracuje około 4000 osób.', sci: 'W latach 70. XVIII wieku dla kopalń pracuje około 4000 osób, w szczycie.' },
        e1890: { kid: 'Pali się ostatni ogień przy skale.', sci: '1890: ostatnie kruszenie ogniem. Zostały gładkie, zaokrąglone chodniki.' },
        e1958: { kid: 'Po 335 latach kopalnie się zamykają.', sci: '1958: Kopalnie Srebra się zamykają (niektóre źródła podają 1957).' },
      },
      says: {
        butt: { kid: 'Patrz, wół schyla rogi!', sci: 'Wół bodzie skałkę, tak jak opowiada miasto.' },
        glint: { kid: 'Coś błyszczy w skale! Dotknij błysku.', sci: 'Odpada odłamek i pojawia się metaliczny błysk. Dotknij go.' },
        take: {
          kid: 'Srebro! Czarna bryłka z loczkami srebra. Teraz przeciągnij rok i patrz, jak rośnie Kongsberg.',
          sci: 'Czarna ruda ze srebrem drutowym. Legenda mówi, że tak zaczęła się kopalnia, która działała 335 lat: przeciągnij rok.',
        },
      },
    },
    fire: {
      label: 'Ogień przy skale',
      verbLogs: 'Dotknij polan',
      verbTorch: 'Dotknij pochodni',
      verbWait: 'Patrz na ogień',
      verbTools: 'Dotknij młotka i kilofa',
      title: 'Kruszenie skały ogniem',
      tip: 'Dotknij polan, pochodni, potem młotka i kilofa, albo przeciągnij liczbę ognisk.',
      slider: 'Rozpalone ogniska, jedno na weekend',
      buttons: { logs: 'Ułóż polana', torch: 'Rozpal ogień', tools: 'Odbij poluzowaną skałę' },
      panel: {
        kid: [
          'Twardą skałę bardzo trudno kopać. Górnicy rozpalali więc przy niej ogień! Gorąca skała pękała i łuszczyła się, a potem można było odbić luźne kawałki. Ogień sprawiał też, że ściany chodnika były gładkie i okrągłe.',
          'Rozpalali ogień w piątek i szli do domu; w poniedziałek dym już ustępował. Dotknij polan, pochodni, a później młotka i kilofa.',
        ],
        sci: [
          'Kruszenie ogniem: polana układa się przy przodku i pali; rozgrzana powierzchnia rozszerza się, pęka i odpada płytami, a górnicy luzują ją młotkiem i kilofem. W Kongsbergu jedno ognisko zabierało około 10 do 15 cm skały i zostawiało ściany chodników gładko zaokrąglone.',
          'Ogniska rozpalano w piątek, a górnicy wracali w poniedziałek (Galissard de Marignac, 1839); drewniany strop dymowy wzdłuż góry chodnika odprowadzał dym, a ostatni ogień rozpalono w 1890 roku. Tu weekend trwa 15 sekund.',
        ],
      },
      board: {
        title: 'Kruszenie ogniem',
        days: { fri: 'Pt', sat: 'So', sun: 'Nd', mon: 'Pn' },
        fires: 'ognisk',
        advance: 'Postęp',
        kid: 'Każde ognisko luzuje skałę na szerokość dłoni, 10 do 15 cm. Miesiąc weekendowych ognisk to mniej niż metr!',
        sci: '10 do 15 cm na ognisko (jasny pas). Ognisko co weekend: 4 lub 5 miesięcznie daje 40 do 75 cm, rok weekendów 5 do 8 m.',
      },
      says: {
        logs: { kid: 'Rozłupane polana ułożone przy skale. Teraz podpal je pochodnią.', sci: 'Rozłupane polana przy przodku, tak jak układali górnicy. Teraz pochodnia.' },
        torch: { kid: 'Ogień płonie! Pali się cały weekend: patrz na skałę.', sci: 'Rozpalony w piątek. Weekend jest przyspieszony do 15 sekund.' },
        tools: { kid: 'Puk, puk! Popękana skała odpada.', sci: 'Młotek i kilof: poluzowane płyty odpadają, a przodek postępuje o 12,5 cm, czyli środek z 10 do 15.' },
        cooled: { kid: 'Poniedziałek! Ogień zgasł, a skała jest popękana i łuszczy się. Dotknij młotka i kilofa.', sci: 'Poniedziałek: skała jest popękana i łuszczy się. Teraz młotek i kilof.' },
        enough: { kid: 'Dwanaście weekendów, trzy miesiące ognisk, a chodnik przesunął się tylko o około półtora metra!', sci: 'Dwanaście weekendów ognisk: 1,2 do 1,8 m chodnika.' },
      },
    },
    hair: {
      label: 'Hodowla srebrnych włosów',
      verbBellows: 'Dotknij miecha',
      verbVein: 'Dotknij loczka w żyle',
      verbRake: 'Dotknij grabi',
      title: 'Srebrne włosy z czarnej skały',
      tip: 'Dotknij miecha, by nagrzać bryłkę, grabi, by ją ochłodzić, i loczka w żyle, albo przeciągnij temperaturę.',
      slider: 'Temperatura',
      buttons: { hotter: 'Dmuchnij miechem', cooler: 'Wygrab żar', fresh: 'Nowa bryłka', vein: 'Dotknij loczka w żyle' },
      panel: {
        kid: [
          'Na palenisku leży bryłka siarczku srebra, czarna i twarda, powiększona około 50 razy, żebyś ją widział. Ogrzej ją, a wyrosną z niej srebrne włosy, jak pasta z tubki!',
          'Soczewka pokazuje dlaczego: gdy jest dość ciepło, atomy srebra zaczynają się przesuwać przez czarny kryształ do korzenia każdego włoska i wypychają go od dołu. Przy zbyt wysokiej temperaturze bryłka się topi.',
        ],
        sci: [
          'Siarczek srebra (Ag2S) poniżej około 177 °C to akantyt. Powyżej jest argentytem, przewodnikiem superjonowym: jego jony srebra poruszają się przez stałą sieć siarki prawie jak w cieczy. Gdy trafią na drucik, stają się metalem, więc drucik buduje się od podstawy i jest wypychany.',
          'W płomieniu w 450 do 700 °C druciki rosną o milimetry w pół godziny (Anderson i in., 2019; tu 30 minut mija w 5 sekund). Siarczek srebra topi się w około 830 °C (źródła podają 825 do 836) i loczki giną. Bryłka jest narysowana około 50 razy za duża.',
        ],
      },
      lens: { sulfide: 'siarczek srebra', wire: 'srebrny drut', root: 'Ag+ dociera i staje się srebrem' },
      plate: { acanthite: 'akantyt', argentite: 'argentyt', grow: 'rośnie', melt: 'topi się', wire: 'najdłuższy loczek' },
      ideas: {
        title: 'Jak rosły te z Kongsbergu?',
        hot: { head: 'Gorąco', line: 'Z argentytu, jak w laboratorium' },
        cool: { head: 'Wolno i chłodno', line: 'Woda gruntowa zmienia siarczek' },
        unknown: { head: 'Nikt jeszcze nie wie', line: 'Skała tego nie mówi' },
      },
      says: {
        acanthite: { kid: 'Zimno: atomy srebra siedzą spokojnie w czarnym krysztale.', sci: 'Poniżej około 177 °C: akantyt. Jony srebra zostają na swoich miejscach.' },
        argentite: { kid: 'Dość ciepło! Atomy srebra zaczynają się przesuwać przez czarny kryształ.', sci: 'Powyżej około 177 °C: argentyt. Jony srebra biegną przez sieć siarki.' },
        grow: { kid: 'Gorąco! Srebro zbiera się u korzenia każdego włoska i wypycha go.', sci: 'Od 450 °C jony osadzają się u korzeni drucików: wzrost od podstawy, milimetry na pół godziny.' },
        melt: { kid: 'Za gorąco! Bryłka się topi i włosy giną. Dotknij bryłki, by dostać nową.', sci: 'W około 830 °C siarczek srebra się topi i loczki giną. Dotknij bryłki, by dostać nową.' },
        rake: { kid: 'Żar wygrabiony, bryłka stygnie.', sci: 'Żar wygrabiony: bryłka stygnie do temperatury pokojowej.' },
        fresh: { kid: 'Nowa bryłka siarczku srebra.', sci: 'Nowa bryłka: czarny siarczek srebra, jeszcze bez drucików.' },
        lump: { kid: 'Bryłka siarczku srebra. Ogrzej ją miechem!', sci: 'Siarczek srebra, Ag2S. Ogrzej go miechem.' },
        lumpHot: { kid: 'Rosną włosy! Spójrz na soczewkę.', sci: 'Druciki rosną: patrz na soczewkę.' },
        idea1: { kid: 'Może srebrne włosy z Kongsbergu rosły w gorącu, jak w płomieniu.', sci: 'Jedna myśl: druty rosły w gorącu z argentytu, jak w badaniu z 2019 roku w Geology.' },
        idea2: { kid: 'A może rosły wolno i w chłodzie, gdy woda w ziemi przez wieki zmieniała czarną rudę.', sci: 'Druga: wolno i w chłodzie, gdy woda gruntowa zmieniała siarczek (Scientific Reports, 2018).' },
        idea3: { kid: 'Nikt jeszcze nie wie, które! Naukowcy wciąż szukają.', sci: 'Pytanie jest otwarte: naturalne druty mogły rosnąć na oba sposoby.' },
      },
    },
  },
  de: {
    title: 'Die Königsgrube',
    greet: {
      kid: 'Willkommen in Kongsberg in Norwegen, in der Abenddämmerung! Ich bin Silber, und in diesem Berg bin ich einmal wie Haare gewachsen. Drei Stationen: der Fund des Ochsen, Feuer am Fels und eine Esse, in der Silberhaare wachsen. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Kongsbergs Königsgrube in der Dämmerung, dann ihr Stollen: der Fund des Ochsen, das Feuersetzen und Drahtsilber, das auf Silbersulfid wächst. Drei Stationen. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Silber wächst selten wie Haare, aber im Fels von Kongsberg tat es das, in Locken und Drähten. Die Bergleute müssen gestaunt haben!',
        'Bergleute gruben hier 335 Jahre lang, von 1623 bis 1958. Stell dir all die Gänge vor, die in diesem Berg stecken!',
        'Silbersulfid ist schwarz und spröde. Erhitze es, und Silber kriecht heraus wie Haare aus einem Kopf.',
      ],
      sci: [
        'Drahtsilber ist gediegenes Silber in Locken, Drähten und Blechen. Kongsbergs Gänge entstanden vor etwa 265 Millionen Jahren, als heiße Salzlösungen durch Risse im Gneis aufstiegen.',
        'Das Silberwerk lief von 1623 bis 1958 und lieferte rund 1350 Tonnen Silber; die Königsgrube reichte mehr als 1000 m tief.',
        'Locken wachsen auf Silbersulfid: In einer Flamme laufen Silberionen durch den Festkörper zur Wurzel des Drahts. Ob Kongsbergs eigene Drähte so wuchsen, ist noch umstritten.',
      ],
    },
    ox: {
      label: 'Der Fund des Ochsen',
      verbOx: 'Tippe den Ochsen an',
      verbGlint: 'Tippe das Glitzern an',
      verbYear: 'Ziehe das Jahr',
      title: '1623: der Fund des Ochsen',
      tip: 'Tippe den Ochsen an, dann das Glitzern, oder ziehe das Jahr.',
      slider: 'Jahr',
      buttons: { butt: 'Den Ochsen zum Fels schicken' },
      panel: {
        kid: [
          'Die Stadt erzählt, dass 1623 zwei Kinder, Helga und Jacob, auf diesem Hügel das Vieh hüteten, als ihr Ochse mit den Hörnern gegen den Fels stieß und etwas glänzte: Silber! Tippe den Ochsen an, dann das Glitzern.',
          'Dann ziehe das Jahr und sieh die Stadt wachsen: Bergleute kamen, Schachthäuser und Wasserräder wurden gebaut, und Häuser mit erleuchteten Fenstern füllten das Tal.',
        ],
        sci: [
          'Die Geschichte von Helga, Jacob und dem Ochsen ist die Legende der Stadt und wohl ausgeschmückt. Silber wurde Anfang Juli 1623 auf dem Gruveåsen gefunden, und das Silberwerk begann in diesem Jahr; Christian IV. gründete Kongsberg 1624.',
          'Die Tafel zeichnet das Silber (bis etwa 1350 t) und die Tiefe der Königsgrube (bis 1068 m) als glatte Kurven zwischen der ersten und der letzten Zahl: ein Modell, keine Aufzeichnung. In den 1770er-Jahren arbeiteten etwa 4000 Menschen für die Gruben.',
        ],
      },
      board: {
        title: 'Kongsberg',
        silver: 'Silber bisher',
        depth: 'Tiefe der Grube',
        about: 'etwa',
        model: 'Die Jahreszahlen sind belegt; die Tonnen und Meter zwischen 1623 und 1958 sind eine glatte Kurve (ein Modell).',
      },
      events: {
        e1623: { kid: 'Auf dem Hügel wird Silber gefunden.', sci: 'Juli 1623: Auf dem Gruveåsen wird Silber gefunden, das Silberwerk beginnt.' },
        e1624: { kid: 'Der König kommt und gründet die Stadt Kongsberg, den Königsberg.', sci: 'Christian IV. gründet die Stadt Kongsberg.' },
        e1770: { kid: 'Etwa 4000 Menschen arbeiten für die Gruben.', sci: 'In den 1770er-Jahren arbeiten etwa 4000 Menschen für die Gruben, auf dem Höhepunkt.' },
        e1890: { kid: 'Das letzte Feuer wird am Fels angezündet.', sci: '1890: das letzte Feuersetzen. Die glatten, gerundeten Stollen bleiben.' },
        e1958: { kid: 'Nach 335 Jahren schließen die Gruben.', sci: '1958: das Silberwerk schließt (manche Quellen sagen 1957).' },
      },
      says: {
        butt: { kid: 'Schau, der Ochse senkt die Hörner!', sci: 'Der Ochse stößt gegen den Felsen, wie die Stadt es erzählt.' },
        glint: { kid: 'Etwas glänzt im Fels! Tippe das Glitzern an.', sci: 'Ein Splitter fällt ab, und ein metallisches Glitzern zeigt sich. Tippe es an.' },
        take: {
          kid: 'Silber! Ein schwarzer Brocken mit Silberlocken. Jetzt ziehe das Jahr und sieh Kongsberg wachsen.',
          sci: 'Schwarzes Erz mit Drahtsilber. Die Legende sagt, daraus wurde eine Grube, die 335 Jahre lief: Ziehe das Jahr.',
        },
      },
    },
    fire: {
      label: 'Feuer am Fels',
      verbLogs: 'Tippe die Holzscheite an',
      verbTorch: 'Tippe die Fackel an',
      verbWait: 'Sieh dem Feuer zu',
      verbTools: 'Tippe Hammer und Spitzhacke an',
      title: 'Fels mit Feuer sprengen',
      tip: 'Tippe Holzscheite, Fackel, dann Hammer und Spitzhacke an, oder ziehe die Feuer.',
      slider: 'Entzündete Feuer, eines pro Wochenende',
      buttons: { logs: 'Scheite stapeln', torch: 'Feuer anzünden', tools: 'Gelockerten Fels abschlagen' },
      panel: {
        kid: [
          'Harten Fels zu graben ist sehr schwer. Darum machten die Bergleute ein Feuer davor! Der heiße Fels bekam Risse und blätterte ab, und danach konnten sie die losen Stücke abschlagen. Das Feuer machte auch die Wände des Stollens glatt und rund.',
          'Sie zündeten das Feuer am Freitag an und gingen heim; am Montag war der Rauch abgezogen. Tippe Scheite, Fackel und später Hammer und Spitzhacke an.',
        ],
        sci: [
          'Feuersetzen: Scheite werden vor der Ortsbrust gestapelt und verbrannt; die erhitzte Oberfläche dehnt sich, reißt und platzt ab, und die Bergleute lösen sie mit Hammer und Spitzhacke. In Kongsberg trug ein Feuer etwa 10 bis 15 cm Fels ab und ließ die Stollenwände glatt gerundet zurück.',
          'Die Feuer wurden am Freitag angezündet, und die Bergleute kamen am Montag zurück (Galissard de Marignac, 1839); ein hölzerner Rauchboden oben im Stollen leitete den Rauch ab, und das letzte Feuer wurde 1890 gesetzt. Hier dauert ein Wochenende 15 Sekunden.',
        ],
      },
      board: {
        title: 'Feuersetzen',
        days: { fri: 'Fr', sat: 'Sa', sun: 'So', mon: 'Mo' },
        fires: 'Feuer',
        advance: 'Vortrieb',
        kid: 'Jedes Feuer lockert etwa eine Handbreit Fels, 10 bis 15 cm. Ein Monat Wochenendfeuer gräbt weniger als einen Meter!',
        sci: '10 bis 15 cm pro Feuer (das helle Band). Jedes Wochenende ein Feuer: 4 oder 5 im Monat ergeben 40 bis 75 cm, ein Jahr Wochenenden 5 bis 8 m.',
      },
      says: {
        logs: { kid: 'Gespaltene Scheite, am Fels gestapelt. Jetzt zünde sie mit der Fackel an.', sci: 'Gespaltene Scheite vor der Ortsbrust, wie die Bergleute es taten. Nun die Fackel.' },
        torch: { kid: 'Das Feuer brennt! Es brennt das ganze Wochenende: Schau auf den Fels.', sci: 'Am Freitag angezündet. Das Wochenende ist auf 15 Sekunden beschleunigt.' },
        tools: { kid: 'Klopf, klopf! Der rissige Fels fällt ab.', sci: 'Hammer und Spitzhacke: die gelockerten Platten fallen, und die Ortsbrust rückt 12,5 cm vor, die Mitte von 10 bis 15.' },
        cooled: { kid: 'Montag! Das Feuer ist aus, und der Fels ist rissig und blättert ab. Tippe Hammer und Spitzhacke an.', sci: 'Montag: Der Fels ist rissig und platzt ab. Als Nächstes Hammer und Spitzhacke.' },
        enough: { kid: 'Zwölf Wochenenden, drei Monate Feuer, und der Stollen ist nur etwa anderthalb Meter weiter!', sci: 'Zwölf Wochenenden Feuer: 1,2 bis 1,8 m Stollen.' },
      },
    },
    hair: {
      label: 'Silberhaare wachsen lassen',
      verbBellows: 'Tippe den Blasebalg an',
      verbVein: 'Tippe eine Locke im Gang an',
      verbRake: 'Tippe die Harke an',
      title: 'Silberhaare aus schwarzem Fels',
      tip: 'Tippe den Blasebalg an, um den Brocken zu erhitzen, die Harke, um ihn abzukühlen, und eine Locke im Gang, oder ziehe die Temperatur.',
      slider: 'Temperatur',
      buttons: { hotter: 'Blasebalg treten', cooler: 'Glut ausharken', fresh: 'Ein frischer Brocken', vein: 'Eine Locke im Gang antippen' },
      panel: {
        kid: [
          'Auf der Esse liegt ein Brocken Silbersulfid, schwarz und hart, etwa 50-mal vergrößert, damit du ihn siehst. Erhitze ihn, und Silberhaare wachsen heraus, wie Zahnpasta aus der Tube!',
          'Die Lupe zeigt, warum: Wenn es warm genug ist, kriechen Silberatome durch den schwarzen Kristall zur Wurzel jedes Haares und schieben es von unten heraus. Wird es zu heiß, schmilzt der Brocken.',
        ],
        sci: [
          'Silbersulfid (Ag2S) ist unterhalb von etwa 177 °C Akanthit. Darüber ist es Argentit, ein superionischer Leiter: Seine Silberionen bewegen sich durch das feste Schwefelgitter fast wie in einer Flüssigkeit. Wo sie auf einen Draht treffen, werden sie zu Metall, der Draht wird also an der Basis aufgebaut und herausgeschoben.',
          'In einer Flamme bei 450 bis 700 °C wachsen Drähte Millimeter in einer halben Stunde (Anderson u. a., 2019; hier vergehen 30 Minuten in 5 Sekunden). Silbersulfid schmilzt bei etwa 830 °C (Quellen nennen 825 bis 836), und die Locken gehen verloren. Der Brocken ist etwa 50-mal zu groß gezeichnet.',
        ],
      },
      lens: { sulfide: 'Silbersulfid', wire: 'Silberdraht', root: 'Ag+ kommt an und wird Silber' },
      plate: { acanthite: 'Akanthit', argentite: 'Argentit', grow: 'wächst', melt: 'schmilzt', wire: 'längste Locke' },
      ideas: {
        title: 'Wie wuchsen die von Kongsberg?',
        hot: { head: 'Heiß', line: 'Aus Argentit, wie im Labor' },
        cool: { head: 'Langsam und kühl', line: 'Grundwasser verändert Sulfid' },
        unknown: { head: 'Noch weiß es niemand', line: 'Der Fels sagt es nicht' },
      },
      says: {
        acanthite: { kid: 'Kalt: Die Silberatome sitzen still im schwarzen Kristall.', sci: 'Unterhalb von etwa 177 °C: Akanthit. Die Silberionen bleiben an ihren Plätzen.' },
        argentite: { kid: 'Warm genug! Die Silberatome beginnen, durch den schwarzen Kristall zu kriechen.', sci: 'Oberhalb von etwa 177 °C: Argentit. Die Silberionen laufen durch das Schwefelgitter.' },
        grow: { kid: 'Heiß! Silber sammelt sich an der Wurzel jedes Haares und schiebt es heraus.', sci: 'Ab 450 °C scheiden sich die Ionen an den Wurzeln der Drähte ab: Wachstum von der Basis, Millimeter pro halber Stunde.' },
        melt: { kid: 'Zu heiß! Der Brocken schmilzt und die Haare gehen verloren. Tippe den Brocken für einen frischen an.', sci: 'Bei etwa 830 °C schmilzt Silbersulfid, und die Locken gehen verloren. Tippe den Brocken für einen frischen an.' },
        rake: { kid: 'Die Glut ist ausgeharkt, und der Brocken kühlt ab.', sci: 'Glut ausgeharkt: Der Brocken kühlt Richtung Raumtemperatur ab.' },
        fresh: { kid: 'Ein frischer Brocken Silbersulfid.', sci: 'Ein frischer Brocken: schwarzes Silbersulfid, noch keine Drähte.' },
        lump: { kid: 'Ein Brocken Silbersulfid. Erhitze ihn mit dem Blasebalg!', sci: 'Silbersulfid, Ag2S. Erhitze es mit dem Blasebalg.' },
        lumpHot: { kid: 'Es wachsen Haare! Schau in die Lupe.', sci: 'Drähte wachsen: Schau in die Lupe.' },
        idea1: { kid: 'Vielleicht wuchsen Kongsbergs Silberhaare heiß, wie in der Flamme.', sci: 'Eine Idee: Die Drähte wuchsen heiß aus Argentit, wie in der Studie von 2019 in Geology.' },
        idea2: { kid: 'Oder sie wuchsen langsam und kühl, während Wasser im Boden das schwarze Erz über Zeitalter veränderte.', sci: 'Eine andere: langsam und kühl, während Grundwasser das Sulfid veränderte (Scientific Reports, 2018).' },
        idea3: { kid: 'Noch weiß niemand, welche! Die Forscher suchen weiter.', sci: 'Die Frage ist offen: Die natürlichen Drähte können auf beide Weisen gewachsen sein.' },
      },
    },
  },
}
