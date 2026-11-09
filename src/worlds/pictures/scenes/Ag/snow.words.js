// The words of silver's snow room ("Can people make it snow?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Ag.js (the
// easel shows it). {jar}, {t}: a jar's name and a temperature, filled in.
// Facts (checked 2026-11-09): pure water droplets freeze by themselves near -38 C (homogeneous freezing);
// dry ice, solid CO2, sublimates at -78.5 C; Vincent Schaefer, General Electric Research Laboratory,
// Schenectady, the cold box in July 1946 and the flight over Mount Greylock on 13 November 1946 (about
// 4300 m, -18.5 C); how much dry ice he dropped is told as about 3 lb (his own account, before his dispenser
// froze and he let the rest go) and 6 lb (Time), so the words say "a few pounds, one to three kilograms";
// Bernard Vonnegut found silver iodide's power in November 1946 (the board says 14 November), older brother of
// the writer Kurt Vonnegut; silver iodide is a yellow powder, active as an ice nucleus from about -4 C (studies
// say -3 to -5 C; the board says "a few degrees below zero"); beta-AgI a = 4.59 angstrom, ice Ih a = 4.52
// angstrom (1.5% apart; the board says "within about 2%"), NaCl a = 5.64 angstrom; Marcolli et al., Atmos. Chem.
// Phys. 16 (2016): the lattice match is not the whole story; the Bergeron process; SNOWIE, Idaho, 2017 (French
// et al., PNAS 2018; Friedrich et al., PNAS 2020): the extra snow is small and hard to measure (the words give
// no figure). Mount Greylock, 1064 m, the highest point in Massachusetts; the Veterans War Memorial Tower, 1933.
// The 3D fonts have no angstrom sign: signs say nm, panels may say the angstrom.
export const SNOW_WORDS = {
  en: {
    title: 'Mount Greylock, 1946',
    greet: {
      kid: 'We are inside the picture, on top of Mount Greylock in November! In the little hut stands Schaefer’s freezer, where a cloud in a box turned into snow. On the left are two crystals that look alike. Above us a plane is flying through a real cloud. The story of this picture is on the easel.',
      sci: 'The summit of Mount Greylock, Massachusetts, in November 1946: a cold box like the one in Schaefer’s laboratory at General Electric, models of ice and silver iodide side by side, and the cloud deck that a plane or a burner can seed. The picture’s story is on the easel.',
    },
    talk: {
      kid: [
        'A cloud is made of tiny drops of water, so small that millions of them would fit in a teaspoon.',
        'Water can stay liquid far below zero if nothing tells it how to freeze. It is waiting for a seed.',
        'Silver iodide is a yellow powder. A tiny speck of it is enough to start a snowflake.',
      ],
      sci: [
        'Pure water droplets freeze on their own only near −38 °C. Real clouds freeze sooner because of ice nuclei: dust, soot, bacteria, and sometimes silver iodide.',
        'Bernard Vonnegut, who found silver iodide’s power, was the older brother of the writer Kurt Vonnegut.',
        'Mount Greylock, 1064 m, is the highest point in Massachusetts. Its war memorial tower, built in 1933, has a lamp on top.',
      ],
    },
    box: {
      label: 'Schaefer’s cold box',
      title: 'A cloud in a freezer',
      slider: 'Temperature of the box',
      hints: {
        breath: 'Tap the breathing tube',
        jar: 'Tap a jar to drop its dust in',
        watch: 'Watch the crystals',
        lid: 'Tap the lid to clear the cloud',
      },
      buttons: { breath: 'Breathe in', lid: 'Clear the box' },
      jars: { talc: 'Talc', salt: 'Salt', ash: 'Ash', soot: 'Soot', dry: 'Dry ice', agi: 'Silver iodide' },
      signs: { thermo: 'Inside the box', lens: 'Through the lens', liquid: 'liquid drops', ice: 'ice crystals', tube: 'Breathe here' },
      says: {
        breath: {
          kid: 'Hhhh! Your breath makes a cloud of tiny drops. Even though the box is below zero, they are still liquid: look through the lens!',
          sci: 'Breath: warm moist air meets the cold box and condenses into droplets about ten micrometres across. At {t} °C they are supercooled, still liquid (the lens).',
        },
        noCloud: {
          kid: 'The dust falls to the bottom of an empty box. There is no cloud for it to meet. Breathe in first!',
          sci: 'No cloud yet, so the dust has nothing to act on. Breathe into the box first.',
        },
        nothing: {
          kid: '{jar}: the dust drifts through the cloud, but the drops stay liquid. It is not an ice-maker.',
          sci: '{jar}: the droplets stay liquid. At these temperatures most dusts give them nothing to start freezing on.',
        },
        dry: {
          kid: 'A little dry ice, −78 °C! The air round it gets so cold that the drops freeze at once: millions of crystals sparkle in the lamp and snow down to the floor.',
          sci: 'Dry ice, −78.5 °C: the air beside it falls far below −38 °C, so droplets freeze there, and the crystals grow at the droplets’ expense and fall. It works at any box temperature below 0 °C.',
        },
        agi: {
          kid: 'Silver iodide smoke! Its crystals are shaped like ice, so water molecules line up on them. The drops turn into crystals that sparkle and snow down.',
          sci: 'Silver iodide at {t} °C, colder than about −4 °C: its crystals start ice on contact, the droplets freeze, and the crystals fall as snow.',
        },
        agiWarm: {
          kid: 'Silver iodide in a box this warm? Nothing happens. It needs to be colder than about −4 °C. Try the slider!',
          sci: 'At {t} °C, warmer than about −4 °C, silver iodide is not active yet: the droplets stay liquid. (Studies put the threshold between −3 and −5 °C.)',
        },
        self: {
          kid: 'Brrr! At −38 °C the drops freeze all by themselves. It is so cold that they cannot wait for a seed any longer.',
          sci: 'At about −38 °C pure water droplets freeze on their own (homogeneous freezing), with no seed.',
        },
        lid: {
          kid: 'Lid up and wave! The air in the box is clear again.',
          sci: 'The box is cleared of cloud and crystals.',
        },
      },
      lens: {
        liquid: { kid: 'Still liquid!', sci: 'Liquid droplets at {t} °C' },
        ice: { kid: 'Ice crystals!', sci: 'Ice crystals' },
        none: { kid: 'Empty', sci: 'No cloud' },
      },
      panel: {
        kid: [
          'In July 1946 a scientist called Vincent Schaefer, who worked at General Electric, breathed into a home freezer lined with black velvet and shone a lamp in. His breath made a cloud of tiny water drops. Even below 0 °C they stayed liquid, because a drop needs a tiny seed to start freezing. Scientists call this supercooled.',
          'Then he dropped in a small piece of dry ice, which is very, very cold (−78 °C), and millions of ice crystals sparkled in the lamp and snowed to the bottom. Try it: breathe in, then tap the jars. Most dust does nothing. Dry ice works. Silver iodide works too, but only when the box is cold enough.',
        ],
        sci: [
          'Small cloud droplets stay liquid far below 0 °C: pure water freezes by itself only near −38 °C (homogeneous freezing). A cooler spot, or a surface with the right structure (an ice nucleus), starts the first crystal. Schaefer, at the General Electric Research Laboratory in Schenectady, worked in a freezer cold box lined with black velvet and lit by a lamp; his breath made a supercooled cloud.',
          'A small piece of dry ice (solid CO2, −78.5 °C) cools the air round it far below −38 °C, so droplets freeze there and the crystals spread, growing at the expense of the droplets near them (the Bergeron process). Silver iodide, whose power Bernard Vonnegut found in November 1946, starts ice at a few degrees below zero: in this model from about −4 °C (studies say −3 to −5 °C). Most other dusts do nothing at these temperatures.',
        ],
      },
    },
    crystals: {
      label: 'Two crystals',
      title: 'Why silver iodide works',
      hints: {
        agi: 'Tap silver iodide to lay the ice on it',
        salt: 'Tap the salt to try the ice on it',
        back: 'Tap the ice layer to bring it back',
      },
      buttons: { agi: 'Ice onto silver iodide', salt: 'Ice onto salt', back: 'Bring the ice back' },
      signs: { ice: 'Ice', agi: 'Silver iodide', salt: 'Salt', water: 'rings of water molecules', ag: 'silver and iodine', na: 'sodium and chlorine' },
      board: {
        idle: { kid: 'Which one fits the ice?', sci: 'Ice a = 0.452 nm' },
        fit: { kid: 'They almost match!', sci: 'ice 0.452 nm, silver iodide 0.459 nm: 1.5% apart' },
        nofit: { kid: 'No match: squares, not hexagons', sci: 'salt 0.564 nm, square net: no match' },
      },
      rows: { ice: 'Ice, hexagonal layer', agi: 'Silver iodide, hexagonal layer', gap: 'Difference', salt: 'Salt, square net' },
      says: {
        agi: {
          kid: 'It fits! The rings of water sit right on the rings of silver and iodine, hexagon on hexagon. That is why silver iodide starts snowflakes.',
          sci: 'Ice a = 0.452 nm on silver iodide a = 0.459 nm: 1.5% apart, so a layer of water lies on the AgI face with little strain, as the first layer of an ice crystal does.',
        },
        salt: {
          kid: 'It does not fit! Salt’s atoms sit in squares, but ice is made of rings of six. The water cannot line up, so salt does not make snowflakes.',
          sci: 'Salt (NaCl) has a square net with a = 0.564 nm: no match for ice’s hexagonal layer.',
        },
        back: {
          kid: 'The ice layer is back on its stand.',
          sci: 'The ice layer is back on its stand.',
        },
      },
      panel: {
        kid: [
          'A snowflake begins when water molecules join into a tiny ice crystal. Ice is built of rings of six water molecules, like a honeycomb. Silver iodide is built of silver and iodine atoms in rings of six too, and the rings are almost exactly the same size. Water molecules that land on it find their places at once, as if it were ice.',
          'Tap silver iodide to slide a layer of ice onto it: hexagon on hexagon. Then try the salt. Its atoms sit in squares, so the ice layer does not fit. That is why silver iodide can make snow and salt cannot.',
        ],
        sci: [
          'Ice (hexagonal ice Ih) and β-silver iodide have the same hexagonal layers: a = 4.52 Å for ice, 4.59 Å for AgI, about 1.5% apart (the picture says within 2%). A layer of water molecules laid on the AgI face can take the ice pattern with little strain, which lowers the barrier to the first crystal. Salt (NaCl) has a square net, a = 5.64 Å: no match.',
          'A good match is not the whole story. Marcolli and colleagues (2016) reviewed the evidence and found that the surface charge and how a surface holds water matter too, and that some poorly matched materials also work. The match is a good rule of thumb, not a law.',
        ],
      },
    },
    seed: {
      label: 'Seed the cloud',
      title: 'Seeding a real cloud',
      slider: 'Temperature of the cloud',
      hints: {
        both: 'Tap the plane or the burner',
        watch: 'Watch the snow',
      },
      buttons: { plane: 'Send the plane', burner: 'Light the burner' },
      signs: { burner: 'Silver iodide burner' },
      sign: {
        title: 'How much more snow?',
        text: {
          kid: 'A little. It is hard to measure.',
          sci: 'A little, and hard to measure (SNOWIE, Idaho, 2017).',
        },
      },
      says: {
        plane: {
          kid: 'Off goes the plane, scattering dry ice into the cloud! Where it flies, the cloud turns to ice, and curtains of snow hang down, fading before they reach the ground.',
          sci: 'Dry ice along the plane’s track: the droplets freeze, and the crystals grow and fall. As on 13 November 1946, the snow evaporates in the drier air below the cloud.',
        },
        burner: {
          kid: 'The burner makes a smoke of tiny silver iodide crystals. Up it floats into the cloud, and a little snow begins to fall.',
          sci: 'The burner’s smoke of silver iodide particles rises into the cloud. At {t} °C they are active: seeded ice grows and falls.',
        },
        burnerWarm: {
          kid: 'The smoke rises into the cloud, but nothing happens. The cloud is warmer than about −4 °C, too warm for silver iodide. Make it colder with the slider!',
          sci: 'At {t} °C silver iodide is not active yet (about −4 °C or colder is needed): the smoke just mixes into the cloud.',
        },
      },
      panel: {
        kid: [
          'On 13 November 1946 Schaefer flew over Mount Greylock in a small plane and threw dry ice into a real cloud of supercooled drops. Streamers of snow fell from the cloud, though the flakes melted away in the air before they reached the ground. People had made snow! Tap the plane to do it again.',
          'Today most seeding uses silver iodide, in smoke from planes or from burners on the ground; the smoke rises into the cloud. It only works if the cloud is cold enough, and it can only help if the cloud already has water to spare. How much extra snow it brings is still being studied: it is small and hard to measure.',
        ],
        sci: [
          '13 November 1946: Schaefer dropped crushed dry ice, a few pounds (one to three kilograms), into a supercooled altocumulus at about 4300 m and −18.5 °C. His dispenser froze, so he let the rest go by hand. Along the plane’s track the cloud turned to ice and snow fell from its base, evaporating in the drier air below.',
          'Modern seeding mostly uses silver iodide (aircraft flares or ground generators) in winter mountain clouds in China, the USA and many other countries. The SNOWIE project (Idaho, 2017) used radars and aircraft to watch seeded ice crystals form along a plane’s track and grow into snow (French et al., 2018). The extra snow it estimated was modest and hard to tell from natural variation (Friedrich et al., 2020).',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Monte Greylock, 1946',
    greet: {
      kid: 'Estamos dentro do quadro, no cimo do monte Greylock, em novembro! Na casinha está a arca congeladora de Schaefer, onde uma nuvem dentro de uma caixa se transformou em neve. À esquerda há dois cristais parecidos. Lá em cima, um avião voa por uma nuvem verdadeira. A história deste quadro está no cavalete.',
      sci: 'O cume do monte Greylock, Massachusetts, em novembro de 1946: uma arca fria como a do laboratório de Schaefer na General Electric, modelos de gelo e de iodeto de prata lado a lado, e o manto de nuvens que um avião ou um queimador podem semear. A história do quadro está no cavalete.',
    },
    talk: {
      kid: [
        'Uma nuvem é feita de gotinhas de água tão pequenas que milhões delas caberiam numa colher de chá.',
        'A água pode ficar líquida muito abaixo de zero se nada lhe disser como congelar. Está à espera de uma semente.',
        'O iodeto de prata é um pó amarelo. Basta uma pontinha dele para começar um floco de neve.',
      ],
      sci: [
        'As gotas de água pura só congelam sozinhas perto de −38 °C. As nuvens reais congelam mais cedo por causa dos núcleos de gelo: pó, fuligem, bactérias e, às vezes, iodeto de prata.',
        'Bernard Vonnegut, que descobriu o poder do iodeto de prata, era irmão mais velho do escritor Kurt Vonnegut.',
        'O monte Greylock, com 1064 m, é o ponto mais alto de Massachusetts. A torre memorial de guerra, construída em 1933, tem uma lâmpada no topo.',
      ],
    },
    box: {
      label: 'A arca fria de Schaefer',
      title: 'Uma nuvem num congelador',
      slider: 'Temperatura da arca',
      hints: {
        breath: 'Toca no tubo de respirar',
        jar: 'Toca num frasco para deitar o pó lá dentro',
        watch: 'Vê os cristais',
        lid: 'Toca na tampa para limpar a nuvem',
      },
      buttons: { breath: 'Soprar', lid: 'Limpar a arca' },
      jars: { talc: 'Talco', salt: 'Sal', ash: 'Cinza', soot: 'Fuligem', dry: 'Gelo seco', agi: 'Iodeto de prata' },
      signs: { thermo: 'Dentro da arca', lens: 'Pela lupa', liquid: 'gotas líquidas', ice: 'cristais de gelo', tube: 'Sopra aqui' },
      says: {
        breath: {
          kid: 'Hhhh! O teu bafo faz uma nuvem de gotinhas. Mesmo com a arca abaixo de zero, ainda são líquidas: espreita pela lupa!',
          sci: 'Bafo: o ar quente e húmido encontra a arca fria e condensa em gotículas com cerca de dez micrómetros. A {t} °C estão sobrearrefecidas, ainda líquidas (a lupa).',
        },
        noCloud: {
          kid: 'O pó cai para o fundo de uma arca vazia. Não há nuvem para ele encontrar. Sopra primeiro!',
          sci: 'Ainda não há nuvem, por isso o pó não tem onde atuar. Sopra primeiro para dentro da arca.',
        },
        nothing: {
          kid: '{jar}: o pó flutua pela nuvem, mas as gotas continuam líquidas. Não faz gelo.',
          sci: '{jar}: as gotículas continuam líquidas. A estas temperaturas, a maioria dos pós não dá às gotas nada onde começar a congelar.',
        },
        dry: {
          kid: 'Um bocadinho de gelo seco, −78 °C! O ar à volta fica tão frio que as gotas congelam logo: milhões de cristais cintilam na lâmpada e caem como neve até ao chão.',
          sci: 'Gelo seco, −78,5 °C: o ar junto dele desce muito abaixo de −38 °C, por isso as gotículas congelam aí, e os cristais crescem à custa das gotículas e caem. Funciona com a arca a qualquer temperatura abaixo de 0 °C.',
        },
        agi: {
          kid: 'Fumo de iodeto de prata! Os cristais dele têm a forma do gelo, por isso as moléculas de água alinham-se neles. As gotas viram cristais que cintilam e caem como neve.',
          sci: 'Iodeto de prata a {t} °C, mais frio do que cerca de −4 °C: os cristais dele começam gelo ao contacto, as gotículas congelam e os cristais caem como neve.',
        },
        agiWarm: {
          kid: 'Iodeto de prata numa arca tão quente? Não acontece nada. Precisa de estar mais frio do que cerca de −4 °C. Experimenta o cursor!',
          sci: 'A {t} °C, mais quente do que cerca de −4 °C, o iodeto de prata ainda não está ativo: as gotículas continuam líquidas. (Os estudos põem o limiar entre −3 e −5 °C.)',
        },
        self: {
          kid: 'Brrr! A −38 °C as gotas congelam sozinhas. Está tão frio que já não podem esperar por uma semente.',
          sci: 'A cerca de −38 °C as gotículas de água pura congelam sozinhas (congelação homogénea), sem semente.',
        },
        lid: {
          kid: 'Tampa para cima e abana! O ar da arca ficou limpo outra vez.',
          sci: 'A arca ficou sem nuvem e sem cristais.',
        },
      },
      lens: {
        liquid: { kid: 'Ainda líquidas!', sci: 'Gotículas líquidas a {t} °C' },
        ice: { kid: 'Cristais de gelo!', sci: 'Cristais de gelo' },
        none: { kid: 'Vazia', sci: 'Sem nuvem' },
      },
      panel: {
        kid: [
          'Em julho de 1946, um cientista chamado Vincent Schaefer, que trabalhava na General Electric, soprou para dentro de uma arca congeladora forrada a veludo preto e acendeu uma lâmpada lá dentro. O bafo dele fez uma nuvem de gotinhas de água. Mesmo abaixo de 0 °C ficaram líquidas, porque uma gota precisa de uma sementinha para começar a congelar. Os cientistas chamam a isto sobrearrefecida.',
          'Depois deitou lá um pedacinho de gelo seco, que é muito, muito frio (−78 °C), e milhões de cristais de gelo cintilaram na lâmpada e caíram como neve até ao fundo. Experimenta: sopra e toca nos frascos. A maior parte dos pós não faz nada. O gelo seco funciona. O iodeto de prata também, mas só quando a arca está suficientemente fria.',
        ],
        sci: [
          'As gotículas pequenas das nuvens ficam líquidas muito abaixo de 0 °C: a água pura só congela sozinha perto de −38 °C (congelação homogénea). Um ponto mais frio, ou uma superfície com a estrutura certa (um núcleo de gelo), começa o primeiro cristal. Schaefer, no Laboratório de Investigação da General Electric, em Schenectady, trabalhava numa arca fria forrada a veludo preto e iluminada por uma lâmpada; o bafo dele fazia uma nuvem sobrearrefecida.',
          'Um pedacinho de gelo seco (CO2 sólido, −78,5 °C) arrefece o ar à volta muito abaixo de −38 °C, por isso as gotículas congelam aí e os cristais espalham-se, crescendo à custa das gotículas vizinhas (o processo de Bergeron). O iodeto de prata, cujo poder Bernard Vonnegut descobriu em novembro de 1946, começa gelo a poucos graus abaixo de zero: neste modelo a partir de cerca de −4 °C (os estudos dizem entre −3 e −5 °C). A maioria dos outros pós não faz nada a estas temperaturas.',
        ],
      },
    },
    crystals: {
      label: 'Dois cristais',
      title: 'Porque funciona o iodeto de prata',
      hints: {
        agi: 'Toca no iodeto de prata para pôr o gelo em cima',
        salt: 'Toca no sal para experimentar o gelo nele',
        back: 'Toca na camada de gelo para a trazer de volta',
      },
      buttons: { agi: 'Gelo no iodeto de prata', salt: 'Gelo no sal', back: 'Trazer o gelo de volta' },
      signs: { ice: 'Gelo', agi: 'Iodeto de prata', salt: 'Sal', water: 'anéis de moléculas de água', ag: 'prata e iodo', na: 'sódio e cloro' },
      board: {
        idle: { kid: 'Qual encaixa no gelo?', sci: 'Gelo a = 0,452 nm' },
        fit: { kid: 'Quase coincidem!', sci: 'gelo 0,452 nm, iodeto de prata 0,459 nm: 1,5% de diferença' },
        nofit: { kid: 'Não coincidem: quadrados, não hexágonos', sci: 'sal 0,564 nm, rede quadrada: não coincide' },
      },
      rows: { ice: 'Gelo, camada hexagonal', agi: 'Iodeto de prata, camada hexagonal', gap: 'Diferença', salt: 'Sal, rede quadrada' },
      says: {
        agi: {
          kid: 'Encaixa! Os anéis de água assentam mesmo nos anéis de prata e iodo, hexágono sobre hexágono. É por isso que o iodeto de prata começa flocos de neve.',
          sci: 'Gelo a = 0,452 nm sobre iodeto de prata a = 0,459 nm: 1,5% de diferença, por isso uma camada de água assenta na face do AgI com pouca tensão, como a primeira camada de um cristal de gelo.',
        },
        salt: {
          kid: 'Não encaixa! Os átomos do sal ficam em quadrados, mas o gelo é feito de anéis de seis. A água não se consegue alinhar, por isso o sal não faz flocos de neve.',
          sci: 'O sal (NaCl) tem uma rede quadrada com a = 0,564 nm: não coincide com a camada hexagonal do gelo.',
        },
        back: {
          kid: 'A camada de gelo voltou ao suporte.',
          sci: 'A camada de gelo voltou ao suporte.',
        },
      },
      panel: {
        kid: [
          'Um floco de neve começa quando moléculas de água se juntam num pequeno cristal de gelo. O gelo é feito de anéis de seis moléculas de água, como um favo de mel. O iodeto de prata é feito de átomos de prata e de iodo, também em anéis de seis, e os anéis têm quase exatamente o mesmo tamanho. As moléculas de água que lá pousam encontram logo o seu lugar, como se fosse gelo.',
          'Toca no iodeto de prata para deslizar uma camada de gelo para cima dele: hexágono sobre hexágono. Depois experimenta o sal. Os átomos dele ficam em quadrados, por isso a camada de gelo não encaixa. É por isso que o iodeto de prata consegue fazer neve e o sal não.',
        ],
        sci: [
          'O gelo (gelo hexagonal Ih) e o iodeto de prata β têm as mesmas camadas hexagonais: a = 4,52 Å no gelo, 4,59 Å no AgI, cerca de 1,5% de diferença (o quadro diz dentro de 2%). Uma camada de moléculas de água pousada na face do AgI pode tomar o padrão do gelo com pouca tensão, o que baixa a barreira até ao primeiro cristal. O sal (NaCl) tem uma rede quadrada, a = 5,64 Å: não coincide.',
          'Uma boa correspondência não é toda a história. Marcolli e colegas (2016) analisaram as provas e concluíram que a carga da superfície e a forma como ela prende a água também contam, e que alguns materiais mal combinados também funcionam. A correspondência é uma boa regra prática, não uma lei.',
        ],
      },
    },
    seed: {
      label: 'Semear a nuvem',
      title: 'Semear uma nuvem verdadeira',
      slider: 'Temperatura da nuvem',
      hints: {
        both: 'Toca no avião ou no queimador',
        watch: 'Vê a neve',
      },
      buttons: { plane: 'Enviar o avião', burner: 'Acender o queimador' },
      signs: { burner: 'Queimador de iodeto de prata' },
      sign: {
        title: 'Quanta neve a mais?',
        text: {
          kid: 'Um bocadinho. É difícil de medir.',
          sci: 'Um pouco, e difícil de medir (SNOWIE, Idaho, 2017).',
        },
      },
      says: {
        plane: {
          kid: 'Lá vai o avião, a espalhar gelo seco na nuvem! Por onde voa, a nuvem vira gelo e cortinas de neve ficam penduradas, a desvanecer antes de chegarem ao chão.',
          sci: 'Gelo seco ao longo do trajeto do avião: as gotículas congelam, e os cristais crescem e caem. Como a 13 de novembro de 1946, a neve evapora-se no ar mais seco por baixo da nuvem.',
        },
        burner: {
          kid: 'O queimador faz um fumo de cristaizinhos de iodeto de prata. Sobe para a nuvem e começa a cair um pouco de neve.',
          sci: 'O fumo de partículas de iodeto de prata do queimador sobe para a nuvem. A {t} °C estão ativas: o gelo semeado cresce e cai.',
        },
        burnerWarm: {
          kid: 'O fumo sobe para a nuvem, mas não acontece nada. A nuvem está mais quente do que cerca de −4 °C, quente de mais para o iodeto de prata. Arrefece-a com o cursor!',
          sci: 'A {t} °C o iodeto de prata ainda não está ativo (é preciso cerca de −4 °C ou menos): o fumo apenas se mistura na nuvem.',
        },
      },
      panel: {
        kid: [
          'A 13 de novembro de 1946, Schaefer voou sobre o monte Greylock num avião pequeno e atirou gelo seco para uma nuvem verdadeira de gotas sobrearrefecidas. Caíram da nuvem fitas de neve, embora os flocos se desfizessem no ar antes de chegarem ao chão. As pessoas tinham feito neve! Toca no avião para o fazer outra vez.',
          'Hoje a maior parte da sementeira usa iodeto de prata, em fumo de aviões ou de queimadores no chão; o fumo sobe para a nuvem. Só funciona se a nuvem estiver suficientemente fria, e só pode ajudar se a nuvem já tiver água de sobra. Quanta neve a mais traz ainda está a ser estudado: é pouca e difícil de medir.',
        ],
        sci: [
          '13 de novembro de 1946: Schaefer largou gelo seco esmagado, uns quilos (de um a três quilogramas), num altocúmulo sobrearrefecido a cerca de 4300 m e −18,5 °C. O doseador gelou, por isso largou o resto à mão. Ao longo do trajeto do avião a nuvem virou gelo e caiu neve da sua base, a evaporar-se no ar mais seco por baixo.',
          'A sementeira moderna usa sobretudo iodeto de prata (rastilhos de aviões ou geradores no chão) em nuvens de montanha no inverno, na China, nos EUA e em muitos outros países. O projeto SNOWIE (Idaho, 2017) usou radares e aviões para ver cristais de gelo semeados formarem-se ao longo do trajeto de um avião e crescerem até virar neve (French et al., 2018). A neve extra que estimou foi modesta e difícil de distinguir da variação natural (Friedrich et al., 2020).',
        ],
      },
    },
  },
  pl: {
    title: 'Góra Greylock, 1946',
    greet: {
      kid: 'Jesteśmy w obrazie, na szczycie góry Greylock w listopadzie! W małej chatce stoi zamrażarka Schaefera, w której chmura w pudle zmieniła się w śnieg. Po lewej stoją dwa podobne kryształy. Nad nami samolot leci przez prawdziwą chmurę. Historia tego obrazu stoi na sztalugach.',
      sci: 'Szczyt góry Greylock w Massachusetts w listopadzie 1946 roku: skrzynia chłodnicza taka jak w laboratorium Schaefera w General Electric, modele lodu i jodku srebra obok siebie oraz pokrywa chmur, którą może zasiać samolot lub palnik. Historia obrazu stoi na sztalugach.',
    },
    talk: {
      kid: [
        'Chmura składa się z maleńkich kropelek wody, tak małych, że miliony z nich zmieściłyby się w łyżeczce.',
        'Woda może pozostać ciekła dużo poniżej zera, jeśli nic jej nie podpowie, jak zamarznąć. Czeka na zalążek.',
        'Jodek srebra to żółty proszek. Wystarczy odrobinka, żeby zaczął się płatek śniegu.',
      ],
      sci: [
        'Krople czystej wody zamarzają same dopiero w pobliżu −38 °C. Prawdziwe chmury zamarzają wcześniej dzięki jądrom lodowym: pyłowi, sadzy, bakteriom, a czasem jodkowi srebra.',
        'Bernard Vonnegut, który odkrył moc jodku srebra, był starszym bratem pisarza Kurta Vonneguta.',
        'Góra Greylock, 1064 m, to najwyższy punkt Massachusetts. Wieża pamięci poległych, zbudowana w 1933 roku, ma na szczycie lampę.',
      ],
    },
    box: {
      label: 'Skrzynia chłodnicza Schaefera',
      title: 'Chmura w zamrażarce',
      slider: 'Temperatura skrzyni',
      hints: {
        breath: 'Dotknij rurki do dmuchania',
        jar: 'Dotknij słoika, żeby wsypać jego proszek',
        watch: 'Patrz na kryształki',
        lid: 'Dotknij wieka, żeby oczyścić chmurę',
      },
      buttons: { breath: 'Dmuchnij', lid: 'Oczyść skrzynię' },
      jars: { talc: 'Talk', salt: 'Sól', ash: 'Popiół', soot: 'Sadza', dry: 'Suchy lód', agi: 'Jodek srebra' },
      signs: { thermo: 'We wnętrzu skrzyni', lens: 'Przez lupę', liquid: 'ciekłe krople', ice: 'kryształki lodu', tube: 'Dmuchaj tu' },
      says: {
        breath: {
          kid: 'Hhhh! Twój oddech tworzy chmurkę maleńkich kropelek. Chociaż w skrzyni jest poniżej zera, nadal są ciekłe: spójrz przez lupę!',
          sci: 'Oddech: ciepłe wilgotne powietrze trafia na zimną skrzynię i skrapla się w kropelki o średnicy około dziesięciu mikrometrów. W {t} °C są przechłodzone, wciąż ciekłe (lupa).',
        },
        noCloud: {
          kid: 'Proszek spada na dno pustej skrzyni. Nie ma chmury, którą mógłby spotkać. Najpierw dmuchnij!',
          sci: 'Nie ma jeszcze chmury, więc proszek nie ma na co działać. Najpierw dmuchnij do skrzyni.',
        },
        nothing: {
          kid: '{jar}: proszek dryfuje przez chmurę, ale krople zostają ciekłe. Nie robi lodu.',
          sci: '{jar}: krople pozostają ciekłe. W tych temperaturach większość pyłów nie daje kroplom punktu zaczepienia do zamarzania.',
        },
        dry: {
          kid: 'Odrobina suchego lodu, −78 °C! Powietrze wokół niego robi się tak zimne, że krople od razu zamarzają: miliony kryształków migoczą w lampie i opadają śniegiem na dno.',
          sci: 'Suchy lód, −78,5 °C: powietrze przy nim spada daleko poniżej −38 °C, więc krople zamarzają tam, a kryształki rosną kosztem kropel i opadają. Działa przy każdej temperaturze skrzyni poniżej 0 °C.',
        },
        agi: {
          kid: 'Dym z jodku srebra! Jego kryształy mają kształt jak lód, więc cząsteczki wody układają się na nich. Krople zamieniają się w kryształki, które migoczą i opadają jak śnieg.',
          sci: 'Jodek srebra w {t} °C, poniżej około −4 °C: jego kryształy zapoczątkowują lód przy zetknięciu, krople zamarzają, a kryształki opadają jako śnieg.',
        },
        agiWarm: {
          kid: 'Jodek srebra w tak ciepłej skrzyni? Nic się nie dzieje. Musi być zimniej niż około −4 °C. Spróbuj suwaka!',
          sci: 'W {t} °C, powyżej około −4 °C, jodek srebra jeszcze nie działa: krople pozostają ciekłe. (Badania podają próg między −3 a −5 °C.)',
        },
        self: {
          kid: 'Brr! W −38 °C krople zamarzają całkiem same. Jest tak zimno, że nie mogą już czekać na zalążek.',
          sci: 'W około −38 °C krople czystej wody zamarzają same (zamarzanie homogeniczne), bez zalążka.',
        },
        lid: {
          kid: 'Wieko w górę i machnij! Powietrze w skrzyni znów jest czyste.',
          sci: 'Skrzynia jest oczyszczona z chmury i kryształków.',
        },
      },
      lens: {
        liquid: { kid: 'Wciąż ciekłe!', sci: 'Ciekłe kropelki w {t} °C' },
        ice: { kid: 'Kryształki lodu!', sci: 'Kryształki lodu' },
        none: { kid: 'Pusto', sci: 'Brak chmury' },
      },
      panel: {
        kid: [
          'W lipcu 1946 roku naukowiec Vincent Schaefer z firmy General Electric dmuchnął do domowej zamrażarki wyłożonej czarnym aksamitem i zaświecił w niej lampę. Jego oddech utworzył chmurkę maleńkich kropelek wody. Nawet poniżej 0 °C pozostały ciekłe, bo kropla potrzebuje drobnego zalążka, żeby zacząć zamarzać. Naukowcy mówią na to przechłodzenie.',
          'Potem wrzucił mały kawałek suchego lodu, który jest bardzo, bardzo zimny (−78 °C), i miliony kryształków lodu zamigotały w lampie i opadły śniegiem na dno. Spróbuj: dmuchnij, potem dotykaj słoików. Większość proszków nic nie robi. Suchy lód działa. Jodek srebra też, ale tylko gdy skrzynia jest dość zimna.',
        ],
        sci: [
          'Małe krople w chmurach pozostają ciekłe daleko poniżej 0 °C: czysta woda zamarza sama dopiero w pobliżu −38 °C (zamarzanie homogeniczne). Chłodniejsze miejsce albo powierzchnia o odpowiedniej strukturze (jądro lodowe) zapoczątkowuje pierwszy kryształ. Schaefer, w laboratorium badawczym General Electric w Schenectady, pracował w skrzyni chłodniczej wyłożonej czarnym aksamitem i oświetlonej lampą; jego oddech tworzył przechłodzoną chmurę.',
          'Mały kawałek suchego lodu (stałe CO2, −78,5 °C) schładza powietrze wokół daleko poniżej −38 °C, więc krople zamarzają tam, a kryształki się rozprzestrzeniają, rosnąc kosztem pobliskich kropel (proces Bergerona). Jodek srebra, którego moc odkrył Bernard Vonnegut w listopadzie 1946 roku, zapoczątkowuje lód kilka stopni poniżej zera: w tym modelu od około −4 °C (badania podają od −3 do −5 °C). Większość innych pyłów w tych temperaturach nic nie robi.',
        ],
      },
    },
    crystals: {
      label: 'Dwa kryształy',
      title: 'Dlaczego jodek srebra działa',
      hints: {
        agi: 'Dotknij jodku srebra, żeby położyć na nim lód',
        salt: 'Dotknij soli, żeby spróbować z lodem',
        back: 'Dotknij warstwy lodu, żeby ją przynieść z powrotem',
      },
      buttons: { agi: 'Lód na jodek srebra', salt: 'Lód na sól', back: 'Przynieś lód z powrotem' },
      signs: { ice: 'Lód', agi: 'Jodek srebra', salt: 'Sól', water: 'pierścienie cząsteczek wody', ag: 'srebro i jod', na: 'sód i chlor' },
      board: {
        idle: { kid: 'Który pasuje do lodu?', sci: 'Lód a = 0,452 nm' },
        fit: { kid: 'Prawie pasują!', sci: 'lód 0,452 nm, jodek srebra 0,459 nm: różnica 1,5%' },
        nofit: { kid: 'Nie pasują: kwadraty, nie sześciokąty', sci: 'sól 0,564 nm, sieć kwadratowa: brak dopasowania' },
      },
      rows: { ice: 'Lód, warstwa heksagonalna', agi: 'Jodek srebra, warstwa heksagonalna', gap: 'Różnica', salt: 'Sól, sieć kwadratowa' },
      says: {
        agi: {
          kid: 'Pasuje! Pierścienie wody leżą dokładnie na pierścieniach srebra i jodu, sześciokąt na sześciokącie. Dlatego jodek srebra zapoczątkowuje płatki śniegu.',
          sci: 'Lód a = 0,452 nm na jodku srebra a = 0,459 nm: różnica 1,5%, więc warstwa wody leży na ścianie AgI z niewielkim naprężeniem, jak pierwsza warstwa kryształu lodu.',
        },
        salt: {
          kid: 'Nie pasuje! Atomy soli leżą w kwadratach, a lód składa się z pierścieni po sześć. Woda nie może się ułożyć, więc sól nie tworzy płatków śniegu.',
          sci: 'Sól (NaCl) ma sieć kwadratową o a = 0,564 nm: nie pasuje do heksagonalnej warstwy lodu.',
        },
        back: {
          kid: 'Warstwa lodu wróciła na swoją podstawkę.',
          sci: 'Warstwa lodu wróciła na swoją podstawkę.',
        },
      },
      panel: {
        kid: [
          'Płatek śniegu zaczyna się, gdy cząsteczki wody łączą się w maleńki kryształ lodu. Lód jest zbudowany z pierścieni po sześć cząsteczek wody, jak plaster miodu. Jodek srebra jest zbudowany z atomów srebra i jodu, też w pierścieniach po sześć, a pierścienie mają prawie dokładnie ten sam rozmiar. Cząsteczki wody, które na nim siadają, od razu znajdują swoje miejsca, jakby to był lód.',
          'Dotknij jodku srebra, żeby przesunąć na niego warstwę lodu: sześciokąt na sześciokącie. Potem spróbuj z solą. Jej atomy leżą w kwadratach, więc warstwa lodu nie pasuje. Dlatego jodek srebra potrafi zrobić śnieg, a sól nie.',
        ],
        sci: [
          'Lód (lód heksagonalny Ih) i β-jodek srebra mają takie same warstwy heksagonalne: a = 4,52 Å dla lodu, 4,59 Å dla AgI, różnica około 1,5% (obraz mówi: do 2%). Warstwa cząsteczek wody ułożona na ścianie AgI może przyjąć wzór lodu przy niewielkim naprężeniu, co obniża barierę do pierwszego kryształu. Sól (NaCl) ma sieć kwadratową, a = 5,64 Å: brak dopasowania.',
          'Dobre dopasowanie to nie cała historia. Marcolli i współpracownicy (2016) przejrzeli dowody i stwierdzili, że ważny jest też ładunek powierzchni i to, jak powierzchnia wiąże wodę, oraz że działają też niektóre słabo dopasowane materiały. Dopasowanie to dobra reguła praktyczna, nie prawo.',
        ],
      },
    },
    seed: {
      label: 'Zasiej chmurę',
      title: 'Zasiewanie prawdziwej chmury',
      slider: 'Temperatura chmury',
      hints: {
        both: 'Dotknij samolotu albo palnika',
        watch: 'Patrz na śnieg',
      },
      buttons: { plane: 'Wyślij samolot', burner: 'Zapal palnik' },
      signs: { burner: 'Palnik z jodkiem srebra' },
      sign: {
        title: 'Ile więcej śniegu?',
        text: {
          kid: 'Trochę. Trudno to zmierzyć.',
          sci: 'Trochę, i trudno to zmierzyć (SNOWIE, Idaho, 2017).',
        },
      },
      says: {
        plane: {
          kid: 'Samolot leci i sypie suchy lód w chmurę! Tam, gdzie przeleciał, chmura zamienia się w lód, a z niej zwisają zasłony śniegu, które zanikają, zanim dotrą do ziemi.',
          sci: 'Suchy lód wzdłuż toru samolotu: krople zamarzają, a kryształki rosną i opadają. Tak jak 13 listopada 1946 roku śnieg wyparowuje w suchszym powietrzu pod chmurą.',
        },
        burner: {
          kid: 'Palnik robi dym z maleńkich kryształków jodku srebra. Unosi się do chmury i zaczyna padać trochę śniegu.',
          sci: 'Dym z cząstek jodku srebra z palnika unosi się do chmury. W {t} °C są aktywne: zasiany lód rośnie i opada.',
        },
        burnerWarm: {
          kid: 'Dym unosi się do chmury, ale nic się nie dzieje. Chmura jest cieplejsza niż około −4 °C, za ciepła dla jodku srebra. Ochłódź ją suwakiem!',
          sci: 'W {t} °C jodek srebra jeszcze nie działa (potrzeba około −4 °C lub zimniej): dym tylko miesza się z chmurą.',
        },
      },
      panel: {
        kid: [
          '13 listopada 1946 roku Schaefer przeleciał małym samolotem nad górą Greylock i rzucił suchy lód w prawdziwą chmurę przechłodzonych kropel. Z chmury spadły smugi śniegu, choć płatki rozpłynęły się w powietrzu, zanim dotarły do ziemi. Ludzie zrobili śnieg! Dotknij samolotu, żeby zrobić to jeszcze raz.',
          'Dziś zasiewanie najczęściej używa jodku srebra, w dymie z samolotów albo z palników na ziemi; dym unosi się do chmury. Działa tylko wtedy, gdy chmura jest dość zimna, i może pomóc tylko wtedy, gdy chmura ma zapas wody. Ile dodatkowego śniegu to daje, wciąż się bada: to niewiele i trudno to zmierzyć.',
        ],
        sci: [
          '13 listopada 1946: Schaefer zrzucił kruszony suchy lód, kilka funtów (od jednego do trzech kilogramów), do przechłodzonej chmury altocumulus na wysokości około 4300 m, w temperaturze −18,5 °C. Jego dozownik zamarzł, więc resztę wysypał ręką. Wzdłuż toru samolotu chmura zamieniła się w lód i z jej podstawy spadł śnieg, parujący w suchszym powietrzu poniżej.',
          'Współczesne zasiewanie używa głównie jodku srebra (race z samolotów albo generatory naziemne) w zimowych chmurach górskich w Chinach, USA i wielu innych krajach. Projekt SNOWIE (Idaho, 2017) użył radarów i samolotów, żeby zobaczyć, jak zasiane kryształki lodu powstają wzdłuż toru samolotu i rosną w śnieg (French i in., 2018). Szacowany dodatkowy śnieg był skromny i trudny do odróżnienia od naturalnej zmienności (Friedrich i in., 2020).',
        ],
      },
    },
  },
  de: {
    title: 'Mount Greylock, 1946',
    greet: {
      kid: 'Wir sind im Bild, oben auf dem Mount Greylock im November! In der kleinen Hütte steht Schaefers Truhe, in der eine Wolke in einer Kiste zu Schnee wurde. Links stehen zwei Kristalle, die sich ähneln. Über uns fliegt ein Flugzeug durch eine echte Wolke. Die Geschichte dieses Bildes steht auf der Staffelei.',
      sci: 'Der Gipfel des Mount Greylock, Massachusetts, im November 1946: eine Kühltruhe wie in Schaefers Labor bei General Electric, Modelle von Eis und Silberiodid nebeneinander und die Wolkendecke, die ein Flugzeug oder ein Brenner impfen kann. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Eine Wolke besteht aus winzigen Wassertröpfchen, so klein, dass Millionen davon in einen Teelöffel passen.',
        'Wasser kann weit unter null flüssig bleiben, wenn ihm nichts sagt, wie es gefrieren soll. Es wartet auf einen Keim.',
        'Silberiodid ist ein gelbes Pulver. Ein winziges Körnchen genügt, um eine Schneeflocke zu beginnen.',
      ],
      sci: [
        'Tropfen aus reinem Wasser gefrieren von selbst erst bei etwa −38 °C. Echte Wolken gefrieren früher wegen Eiskeimen: Staub, Ruß, Bakterien und manchmal Silberiodid.',
        'Bernard Vonnegut, der die Wirkung von Silberiodid fand, war der ältere Bruder des Schriftstellers Kurt Vonnegut.',
        'Der Mount Greylock, 1064 m, ist der höchste Punkt von Massachusetts. Sein Kriegerdenkmal-Turm, 1933 gebaut, trägt oben eine Lampe.',
      ],
    },
    box: {
      label: 'Schaefers Kühltruhe',
      title: 'Eine Wolke im Tiefkühler',
      slider: 'Temperatur der Truhe',
      hints: {
        breath: 'Tippe auf den Blasschlauch',
        jar: 'Tippe auf ein Glas, um sein Pulver hineinzugeben',
        watch: 'Schau auf die Kristalle',
        lid: 'Tippe auf den Deckel, um die Wolke zu leeren',
      },
      buttons: { breath: 'Hineinhauchen', lid: 'Truhe leeren' },
      jars: { talc: 'Talkum', salt: 'Salz', ash: 'Asche', soot: 'Ruß', dry: 'Trockeneis', agi: 'Silberiodid' },
      signs: { thermo: 'In der Truhe', lens: 'Durch die Lupe', liquid: 'flüssige Tröpfchen', ice: 'Eiskristalle', tube: 'Hier hauchen' },
      says: {
        breath: {
          kid: 'Hhhh! Dein Atem macht eine Wolke aus winzigen Tröpfchen. Obwohl es in der Truhe unter null ist, sind sie noch flüssig: schau durch die Lupe!',
          sci: 'Atem: warme feuchte Luft trifft auf die kalte Truhe und kondensiert zu Tröpfchen von etwa zehn Mikrometern. Bei {t} °C sind sie unterkühlt, noch flüssig (die Lupe).',
        },
        noCloud: {
          kid: 'Das Pulver fällt auf den Boden einer leeren Truhe. Es gibt keine Wolke, die es trifft. Hauche zuerst hinein!',
          sci: 'Noch keine Wolke, das Pulver hat also nichts, worauf es wirken kann. Hauche zuerst in die Truhe.',
        },
        nothing: {
          kid: '{jar}: Das Pulver treibt durch die Wolke, aber die Tröpfchen bleiben flüssig. Es macht kein Eis.',
          sci: '{jar}: Die Tröpfchen bleiben flüssig. Bei diesen Temperaturen geben die meisten Stäube den Tröpfchen nichts, woran sie gefrieren könnten.',
        },
        dry: {
          kid: 'Ein bisschen Trockeneis, −78 °C! Die Luft darum wird so kalt, dass die Tröpfchen sofort gefrieren: Millionen Kristalle funkeln in der Lampe und schneien zu Boden.',
          sci: 'Trockeneis, −78,5 °C: Die Luft daneben fällt weit unter −38 °C, also gefrieren dort Tröpfchen, und die Kristalle wachsen auf Kosten der Tröpfchen und fallen. Es wirkt bei jeder Truhentemperatur unter 0 °C.',
        },
        agi: {
          kid: 'Silberiodid-Rauch! Seine Kristalle sind gebaut wie Eis, darum reihen sich Wassermoleküle daran auf. Die Tröpfchen werden zu Kristallen, die funkeln und herabschneien.',
          sci: 'Silberiodid bei {t} °C, kälter als etwa −4 °C: Seine Kristalle lösen bei Kontakt Eis aus, die Tröpfchen gefrieren, und die Kristalle fallen als Schnee.',
        },
        agiWarm: {
          kid: 'Silberiodid in einer so warmen Truhe? Es passiert nichts. Es muss kälter sein als etwa −4 °C. Probiere den Schieber!',
          sci: 'Bei {t} °C, wärmer als etwa −4 °C, ist Silberiodid noch nicht aktiv: Die Tröpfchen bleiben flüssig. (Studien nennen eine Schwelle zwischen −3 und −5 °C.)',
        },
        self: {
          kid: 'Brrr! Bei −38 °C gefrieren die Tröpfchen ganz von selbst. Es ist so kalt, dass sie nicht mehr auf einen Keim warten können.',
          sci: 'Bei etwa −38 °C gefrieren Tröpfchen aus reinem Wasser von selbst (homogenes Gefrieren), ohne Keim.',
        },
        lid: {
          kid: 'Deckel hoch und wedeln! Die Luft in der Truhe ist wieder klar.',
          sci: 'Die Truhe ist von Wolke und Kristallen geleert.',
        },
      },
      lens: {
        liquid: { kid: 'Noch flüssig!', sci: 'Flüssige Tröpfchen bei {t} °C' },
        ice: { kid: 'Eiskristalle!', sci: 'Eiskristalle' },
        none: { kid: 'Leer', sci: 'Keine Wolke' },
      },
      panel: {
        kid: [
          'Im Juli 1946 hauchte ein Wissenschaftler namens Vincent Schaefer, der bei General Electric arbeitete, in eine Tiefkühltruhe, die mit schwarzem Samt ausgekleidet war, und leuchtete mit einer Lampe hinein. Sein Atem machte eine Wolke aus winzigen Wassertröpfchen. Auch unter 0 °C blieben sie flüssig, denn ein Tröpfchen braucht einen winzigen Keim, um zu gefrieren. Die Forscher nennen das unterkühlt.',
          'Dann warf er ein kleines Stück Trockeneis hinein, das sehr, sehr kalt ist (−78 °C), und Millionen Eiskristalle funkelten in der Lampe und schneiten zu Boden. Probiere es: hauche hinein und tippe dann auf die Gläser. Die meisten Pulver tun nichts. Trockeneis wirkt. Silberiodid auch, aber nur, wenn die Truhe kalt genug ist.',
        ],
        sci: [
          'Kleine Wolkentröpfchen bleiben weit unter 0 °C flüssig: Reines Wasser gefriert von selbst erst bei etwa −38 °C (homogenes Gefrieren). Eine kältere Stelle oder eine Oberfläche mit der richtigen Struktur (ein Eiskeim) löst den ersten Kristall aus. Schaefer arbeitete im Forschungslabor von General Electric in Schenectady an einer Kühltruhe, ausgekleidet mit schwarzem Samt und beleuchtet von einer Lampe; sein Atem machte eine unterkühlte Wolke.',
          'Ein kleines Stück Trockeneis (festes CO2, −78,5 °C) kühlt die Luft ringsum weit unter −38 °C, also gefrieren dort Tröpfchen, und die Kristalle breiten sich aus und wachsen auf Kosten der Tröpfchen in der Nähe (Bergeron-Prozess). Silberiodid, dessen Wirkung Bernard Vonnegut im November 1946 fand, löst Eis schon wenige Grad unter null aus: in diesem Modell ab etwa −4 °C (Studien nennen −3 bis −5 °C). Die meisten anderen Stäube tun bei diesen Temperaturen nichts.',
        ],
      },
    },
    crystals: {
      label: 'Zwei Kristalle',
      title: 'Warum Silberiodid wirkt',
      hints: {
        agi: 'Tippe auf Silberiodid, um das Eis darauf zu legen',
        salt: 'Tippe auf das Salz, um das Eis dort zu probieren',
        back: 'Tippe auf die Eisschicht, um sie zurückzuholen',
      },
      buttons: { agi: 'Eis auf Silberiodid', salt: 'Eis auf Salz', back: 'Eis zurückholen' },
      signs: { ice: 'Eis', agi: 'Silberiodid', salt: 'Salz', water: 'Ringe aus Wassermolekülen', ag: 'Silber und Iod', na: 'Natrium und Chlor' },
      board: {
        idle: { kid: 'Welcher passt zum Eis?', sci: 'Eis a = 0,452 nm' },
        fit: { kid: 'Sie passen fast genau!', sci: 'Eis 0,452 nm, Silberiodid 0,459 nm: 1,5% Unterschied' },
        nofit: { kid: 'Passt nicht: Quadrate, keine Sechsecke', sci: 'Salz 0,564 nm, quadratisches Netz: passt nicht' },
      },
      rows: { ice: 'Eis, hexagonale Schicht', agi: 'Silberiodid, hexagonale Schicht', gap: 'Unterschied', salt: 'Salz, quadratisches Netz' },
      says: {
        agi: {
          kid: 'Es passt! Die Wasserringe liegen genau auf den Ringen aus Silber und Iod, Sechseck auf Sechseck. Darum löst Silberiodid Schneeflocken aus.',
          sci: 'Eis a = 0,452 nm auf Silberiodid a = 0,459 nm: 1,5% Unterschied, also liegt eine Wasserschicht mit wenig Spannung auf der AgI-Fläche, wie die erste Schicht eines Eiskristalls.',
        },
        salt: {
          kid: 'Es passt nicht! Die Atome des Salzes sitzen in Quadraten, aber Eis besteht aus Ringen zu sechst. Das Wasser kann sich nicht ordnen, darum macht Salz keine Schneeflocken.',
          sci: 'Salz (NaCl) hat ein quadratisches Netz mit a = 0,564 nm: passt nicht zur hexagonalen Schicht des Eises.',
        },
        back: {
          kid: 'Die Eisschicht ist wieder auf ihrem Ständer.',
          sci: 'Die Eisschicht ist wieder auf ihrem Ständer.',
        },
      },
      panel: {
        kid: [
          'Eine Schneeflocke beginnt, wenn sich Wassermoleküle zu einem winzigen Eiskristall zusammenfügen. Eis ist aus Ringen zu sechs Wassermolekülen gebaut, wie eine Honigwabe. Silberiodid ist aus Silber- und Iodatomen gebaut, ebenfalls in Sechserringen, und die Ringe sind fast genau gleich groß. Wassermoleküle, die darauf landen, finden sofort ihren Platz, als wäre es Eis.',
          'Tippe auf Silberiodid, um eine Eisschicht daraufzuschieben: Sechseck auf Sechseck. Probiere dann das Salz. Seine Atome sitzen in Quadraten, darum passt die Eisschicht nicht. Deshalb kann Silberiodid Schnee machen und Salz nicht.',
        ],
        sci: [
          'Eis (hexagonales Eis Ih) und β-Silberiodid haben dieselben hexagonalen Schichten: a = 4,52 Å bei Eis, 4,59 Å bei AgI, etwa 1,5% Unterschied (das Bild sagt: innerhalb von 2%). Eine Schicht Wassermoleküle auf der AgI-Fläche kann das Eismuster mit wenig Spannung annehmen, was die Hürde zum ersten Kristall senkt. Salz (NaCl) hat ein quadratisches Netz, a = 5,64 Å: passt nicht.',
          'Eine gute Passung ist nicht die ganze Geschichte. Marcolli und Kollegen (2016) werteten die Befunde aus und fanden, dass auch die Oberflächenladung und die Art, wie eine Oberfläche Wasser bindet, zählen, und dass auch manche schlecht passenden Stoffe wirken. Die Passung ist eine gute Faustregel, kein Gesetz.',
        ],
      },
    },
    seed: {
      label: 'Die Wolke impfen',
      title: 'Eine echte Wolke impfen',
      slider: 'Temperatur der Wolke',
      hints: {
        both: 'Tippe auf das Flugzeug oder den Brenner',
        watch: 'Schau auf den Schnee',
      },
      buttons: { plane: 'Flugzeug schicken', burner: 'Brenner anzünden' },
      signs: { burner: 'Silberiodid-Brenner' },
      sign: {
        title: 'Wie viel mehr Schnee?',
        text: {
          kid: 'Ein bisschen. Es ist schwer zu messen.',
          sci: 'Ein bisschen, und schwer zu messen (SNOWIE, Idaho, 2017).',
        },
      },
      says: {
        plane: {
          kid: 'Los fliegt das Flugzeug und streut Trockeneis in die Wolke! Wo es fliegt, wird die Wolke zu Eis, und Vorhänge aus Schnee hängen herab und verschwinden, bevor sie den Boden erreichen.',
          sci: 'Trockeneis entlang der Flugbahn: Die Tröpfchen gefrieren, und die Kristalle wachsen und fallen. Wie am 13. November 1946 verdunstet der Schnee in der trockeneren Luft unter der Wolke.',
        },
        burner: {
          kid: 'Der Brenner macht einen Rauch aus winzigen Silberiodid-Kristallen. Er steigt in die Wolke, und ein wenig Schnee beginnt zu fallen.',
          sci: 'Der Rauch aus Silberiodid-Teilchen steigt vom Brenner in die Wolke. Bei {t} °C sind sie aktiv: Das geimpfte Eis wächst und fällt.',
        },
        burnerWarm: {
          kid: 'Der Rauch steigt in die Wolke, aber es passiert nichts. Die Wolke ist wärmer als etwa −4 °C, zu warm für Silberiodid. Mach sie mit dem Schieber kälter!',
          sci: 'Bei {t} °C ist Silberiodid noch nicht aktiv (etwa −4 °C oder kälter ist nötig): Der Rauch mischt sich nur in die Wolke.',
        },
      },
      panel: {
        kid: [
          'Am 13. November 1946 flog Schaefer in einem kleinen Flugzeug über den Mount Greylock und warf Trockeneis in eine echte Wolke aus unterkühlten Tröpfchen. Aus der Wolke fielen Schneeschleier, obwohl sich die Flocken in der Luft auflösten, bevor sie den Boden erreichten. Menschen hatten Schnee gemacht! Tippe auf das Flugzeug, um es noch einmal zu tun.',
          'Heute wird meist Silberiodid zum Impfen benutzt, als Rauch aus Flugzeugen oder von Brennern am Boden; der Rauch steigt in die Wolke. Es wirkt nur, wenn die Wolke kalt genug ist, und kann nur helfen, wenn die Wolke schon Wasser übrig hat. Wie viel zusätzlicher Schnee dabei herauskommt, wird noch erforscht: Es ist wenig und schwer zu messen.',
        ],
        sci: [
          '13. November 1946: Schaefer warf zerstoßenes Trockeneis, einige Pfund (ein bis drei Kilogramm), in einen unterkühlten Altocumulus in etwa 4300 m Höhe bei −18,5 °C. Sein Streuer fror ein, also ließ er den Rest von Hand hinaus. Entlang der Flugbahn wurde die Wolke zu Eis, und aus ihrer Unterseite fiel Schnee, der in der trockeneren Luft darunter verdunstete.',
          'Das heutige Impfen nutzt meist Silberiodid (Flugzeugfackeln oder Bodengeneratoren) in winterlichen Bergwolken in China, den USA und vielen anderen Ländern. Das Projekt SNOWIE (Idaho, 2017) beobachtete mit Radar und Flugzeugen, wie sich geimpfte Eiskristalle entlang einer Flugbahn bildeten und zu Schnee wuchsen (French et al., 2018). Der geschätzte Zusatzschnee war bescheiden und schwer von natürlicher Schwankung zu unterscheiden (Friedrich et al., 2020).',
        ],
      },
    },
  },
}
