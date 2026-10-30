// The words of silicon's glass room ("How does sand turn into glass?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Si.js (the easel shows it); the room shows it happening and adds to it.
export const GLASS_WORDS = {
  en: {
    title: 'The glassblower\'s workshop',
    greet: {
      kid: 'We are inside the picture: a glassblower\'s workshop at night! Feel the heat from the furnace? Here sand becomes glass. The picture\'s story is on the easel beside you.',
      sci: 'A glass workshop at night: a pot furnace to melt the batch, the working furnace with a gather on the blowpipe, and a bench for testing light. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Glass is mostly sand, the same kind as on a beach, only very clean and white.',
        'Look at the big lens over the shelf: inside glass, silicon and oxygen hold hands in a jumble, with no neat rows like a crystal has.',
        'Some old church windows are thicker at the bottom. Not because glass slowly runs down: they were made uneven, and the builders put the thick side down.',
      ],
      sci: [
        'Glass sand is nearly pure quartz, SiO2. The little iron it brings is what tints window glass green.',
        'The lens shows Zachariasen\'s random network (1932), drawn flat: in real glass every silicon holds four oxygens and every oxygen bridges two silicons, in rings of every size with no repeating order.',
        'Medieval panes are often thicker at the bottom because crown glass was uneven and glaziers set the heavy edge down; at room temperature glass would need far longer than the age of the universe to sag visibly.',
      ],
    },
    batch: {
      label: 'The melting pot',
      title: 'Sand, soda and limestone',
      bins: { sand: 'Sand', soda: 'Soda', lime: 'Limestone' },
      gauge: 'pure sand melts',
      slider: 'The fire',
      hints: { sand: 'Tap the sand pile', soda: 'Tap the soda pile', lime: 'Tap the limestone pile', fire: 'Tap the pot to light the fire', empty: 'Tap the ladle to empty the pot' },
      buttons: { sand: 'Add sand', soda: 'Add soda', lime: 'Add limestone', fire: 'Fire on or off', empty: 'Empty the pot' },
      says: {
        sand: { kid: 'In goes the sand: millions of tiny grains of quartz, made of silicon and oxygen.', sci: 'Silica sand, SiO2, nearly pure quartz: almost three quarters of the finished glass.' },
        hot: { kid: '1500 °C, as hot as this furnace goes, and the sand is still sand! It glows, but it does not melt. Pure sand needs about 1700 °C.', sci: 'At 1500 °C the quartz glows but stays solid: pure silica melts only at about 1700 °C, too hot for an ordinary furnace.' },
        soda: { kid: 'In goes the soda: a white powder made of sodium, carbon and oxygen.', sci: 'Soda ash, sodium carbonate, Na2CO3: the flux that lets the sand melt.' },
        lime: { kid: 'In goes the limestone: the same rock as chalk and marble.', sci: 'Limestone, calcium carbonate, CaCO3: in the heat it turns into lime, CaO.' },
        again: { kid: 'That is in the pot already. Try something else!', sci: 'Already in the batch.' },
        fire: { kid: 'Fire! Watch the dial climb.', sci: 'The burner is on: the pot heats toward 1500 °C, this furnace\'s top.' },
        out: { kid: 'Fire out. The pot slowly cools down.', sci: 'Burner off: the pot cools.' },
        water: { kid: 'Glass! But glass of only sand and soda would slowly dissolve in the rain. Add some limestone.', sci: 'A sodium silicate melt: soluble in water (water glass). It needs lime to be durable.' },
        sodaAlone: { kid: 'The soda melts all by itself, but without sand it is not glass: cooled, it turns back into white soda.', sci: 'Na2CO3 melts at 851 °C, but alone it crystallises again as it cools: no network former, no glass.' },
        set: { kid: 'The fire is out and the melt has set hard: glass! It cooled without making crystals.', sci: 'Below about 550 °C the melt is rigid: a glass, its atoms frozen in disorder, with no crystals.' },
        melts: { kid: 'It melts! The soda melts first and eats into the sand grains. The bubbles are carbon dioxide.', sci: 'Soda ash melts at 851 °C and attacks the quartz: Na2CO3 + SiO2 -> Na2SiO3 + CO2. The hotter, the faster; at 1500 °C the melt flows.' },
        window: { kid: 'The limestone fizzed in. Now the glass will not dissolve in the rain: this is window glass!', sci: 'CaCO3 -> CaO + CO2. The calcium makes the glass durable: about 72% SiO2, 14% Na2O and 9% CaO, soda-lime glass.' },
        empty: { kid: 'Out it goes with the ladle, to the big furnace for the glassblower. Make another batch!', sci: 'Ladled out to the working furnace; the pot is ready for the next batch.' },
      },
      panel: {
        kid: [
          'Glass starts as a mix called the batch: mostly sand, some soda and a little limestone. Sand alone would need about 1700 °C to melt, hotter than an ordinary furnace can get. Soda makes it melt at about 1500 °C, which is still six times as hot as a kitchen oven at full blast.',
          'But glass of only sand and soda slowly dissolves in water: chemists call it water glass. Limestone makes it tough, so windows can stand in the rain for hundreds of years. Molten glass is terribly hot, so only trained glassmakers work at a furnace.',
        ],
        sci: [
          'The batch: silica sand (SiO2), soda ash (Na2CO3) and limestone (CaCO3). Pure silica melts only at about 1700 °C. Soda is a flux: it melts at 851 °C and reacts with the sand, Na2CO3 + SiO2 -> Na2SiO3 + CO2, breaking Si-O-Si bridges so that the melt flows at about 1500 °C. Limestone gives off its CO2 too, CaCO3 -> CaO + CO2, and the gas bubbles out of the melt.',
          'Sodium ions alone leave the glass soluble: sodium silicate dissolves in water (water glass). Calcium ions bind the loosened network and make it durable. Window glass ends at about 72% SiO2, 14% Na2O and 9% CaO, with a little MgO and Al2O3: soda-lime glass, about 90% of all glass made. Broken glass, cullet, goes into the batch too: it melts more easily and saves energy.',
        ],
      },
    },
    blow: {
      label: 'The blowpipe',
      title: 'Blowing glass',
      shelf: 'Made here',
      hints: { blow: 'Tap the glowing glass to blow', more: 'Tap the glass to blow it bigger', shape: 'Tap the bottle or the vase on the stool' },
      buttons: { blow: 'Blow', bottle: 'Shape a bottle', vase: 'Shape a vase' },
      says: {
        blow: { kid: 'Puff! A bubble of air opens inside the hot glass.', sci: 'A puff opens a bubble in the gather: the first step of every blown piece.' },
        more: { kid: 'Bigger! The pipe keeps turning, or the soft glass would droop.', sci: 'The blower turns the pipe all the time; at about 1000 °C the glass would sag under its own weight.' },
        early: { kid: 'First blow a bubble into it: a solid lump cannot become a hollow bottle.', sci: 'A gather must be blown into a parison before it can be shaped.' },
        big: { kid: 'That is big enough! Now tap the bottle or the vase to choose its shape.', sci: 'The parison is ready: choose its shape.' },
        bottle: { kid: 'A bottle! Watch it cool from orange to red to clear, then it goes on the shelf.', sci: 'A bottle. Below about 500 °C it stops glowing, but it is still far too hot to touch; a real one would now cool for hours in an annealing oven.' },
        vase: { kid: 'A vase! Watch it cool from orange to red to clear, then it goes on the shelf.', sci: 'A vase. Below about 500 °C it stops glowing, but it is still far too hot to touch; a real one would now cool for hours in an annealing oven.' },
      },
      panel: {
        kid: [
          'The glassblower dips an iron pipe into the furnace and gathers a glob of molten glass, soft and stretchy like warm toffee. A puff down the pipe makes a bubble inside, and turning, swinging and shaping it makes bottles, vases and bowls.',
          'People made glass beads for more than 2000 years before anyone thought of blowing glass. Glassblowing was invented about 2000 years ago on the coast of the eastern Mediterranean, and suddenly bottles and cups of glass were cheap. Careful: glass that has stopped glowing can still burn you.',
        ],
        sci: [
          'Glass has no melting point: cooling, it simply gets stiffer. It is worked at about 1000 to 1100 °C, near its working point (a viscosity of about 1000 Pa·s): stiff enough to hold a shape, soft enough to inflate. It stops glowing visibly below about 500 °C, long before it is safe to touch.',
          'Glassblowing began on the eastern Mediterranean coast in the 1st century BC; the oldest glass objects, beads from Mesopotamia, are about 4500 years old. Finished pieces go into an annealer, held a little above 500 °C and cooled slowly for hours, so that stresses frozen in by uneven cooling cannot crack them.',
        ],
      },
    },
    light: {
      label: 'Sand, glass and light',
      title: 'Why is glass clear?',
      hints: { start: 'Tap the sand or the glass pane', pane: 'Tap the glass pane', turn: 'Tap the pane again to turn its edge to the lamp', fibre: 'Tap the coil of glass fibre', sand: 'Tap the sand' },
      buttons: { sand: 'Shine at the sand', pane: 'Shine at the glass', edge: 'Shine into its edge', fibre: 'Shine into the fibre', off: 'Lamp off' },
      says: {
        sand: { kid: 'The sand lights up white, but nothing gets through to the card: every grain\'s edges bounce the light away, as snow does.', sci: 'Every grain surface reflects a little and bends the rest; after many grains the light leaves in all directions. Diffuse white, and opaque.' },
        off: { kid: 'Lamp off. Tap the sand, the pane or the fibre to light it again.', sci: 'Lamp off.' },
        pane: { kid: 'Straight through! The glass is one piece with no edges inside, so the light goes on to the card.', sci: 'Only about 4% is reflected at each surface (n = 1.52). Visible photons, 1.6 to 3.3 eV, cannot excite its electrons: pure silica needs about 9 eV, and window glass absorbs only in the ultraviolet.' },
        edge: { kid: 'Green! Going the long way through the glass, the light shows its colour: a trace of iron from the sand.', sci: 'Fed into the edge, light runs the length of the pane by total internal reflection; Fe2+ ions absorb red and near-infrared light, so the long path looks green.' },
        fibre: { kid: 'The light follows the curly glass thread round every bend and comes out at the end! Internet cables under the sea work like this.', sci: 'Total internal reflection guides the light along the fibre\'s core. Silica fibre loses about 0.2 dB per km at 1550 nm: half the light remains after about 15 km.' },
      },
      panel: {
        kid: [
          'Sand and glass are made of the same stuff, so why can you see through only one? A heap of sand is millions of grains, and each grain\'s edges bounce a little light away. After so many bounces the light comes back out in every direction: the heap looks white, and nothing gets through. Snow, sugar and even crushed glass look white for the same reason.',
          'Glass is one piece with no edges inside, so light goes straight through. Window glass is a tiny bit green from a trace of iron in its sand, which shows only when light goes a long way through it, along its edge. Very pure glass drawn into thin fibres carries light for kilometres: that is how the internet crosses the oceans.',
        ],
        sci: [
          'Quartz sand and window glass are both mostly SiO2. A heap of sand scatters light at every grain surface (quartz n = 1.54, against air), and many scatterings send it out in all directions: diffuse white, opaque. Glass has no grain boundaries, and visible photons (1.6 to 3.3 eV) carry too little energy to excite its electrons (about 9 eV in pure silica), so they pass; about 4% is reflected at each surface.',
          'Ordinary glass carries about 0.1% iron oxide from its sand; Fe2+ absorbs in the red and near-infrared, which shows as green along a long path. In 1966 Charles Kao showed that glass fibres could carry signals far if their impurities were removed (Nobel Prize in Physics 2009). Today\'s silica fibre loses about 0.2 dB per km at 1550 nm, so half the light is left after about 15 km.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'A oficina do vidreiro',
    greet: {
      kid: 'Estamos dentro da imagem: a oficina de um vidreiro, à noite! Sentes o calor do forno? Aqui a areia transforma-se em vidro. A história da imagem está no cavalete ao teu lado.',
      sci: 'Uma oficina de vidro à noite: um forno de cadinho para fundir a mistura, o forno de trabalho com uma bola de vidro na cana de sopro, e uma bancada para testar a luz. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'O vidro é feito sobretudo de areia, igual à da praia, só que muito limpa e branca.',
        'Olha para a lupa grande por cima da prateleira: dentro do vidro, o silício e o oxigénio dão as mãos todos baralhados, sem as filas certinhas de um cristal.',
        'Alguns vitrais antigos são mais grossos em baixo. Não é porque o vidro escorra devagar: foram feitos irregulares, e os construtores puseram o lado grosso para baixo.',
      ],
      sci: [
        'A areia para vidro é quartzo quase puro, SiO2. O pouco ferro que traz é o que dá ao vidro das janelas o tom verde.',
        'A lupa mostra a rede aleatória de Zachariasen (1932), desenhada em plano: no vidro verdadeiro cada silício segura quatro oxigénios e cada oxigénio liga dois silícios, em anéis de todos os tamanhos, sem ordem que se repita.',
        'Os vidros medievais são muitas vezes mais grossos em baixo porque o vidro de coroa era irregular e os vidraceiros punham a borda pesada para baixo; à temperatura ambiente, o vidro levaria muito mais do que a idade do Universo a deformar-se de forma visível.',
      ],
    },
    batch: {
      label: 'O cadinho',
      title: 'Areia, soda e calcário',
      bins: { sand: 'Areia', soda: 'Soda', lime: 'Calcário' },
      gauge: 'a areia pura funde',
      slider: 'O fogo',
      hints: { sand: 'Toca no monte de areia', soda: 'Toca no monte de soda', lime: 'Toca no monte de calcário', fire: 'Toca no cadinho para acender o fogo', empty: 'Toca na concha para esvaziar o cadinho' },
      buttons: { sand: 'Juntar areia', soda: 'Juntar soda', lime: 'Juntar calcário', fire: 'Acender ou apagar o fogo', empty: 'Esvaziar o cadinho' },
      says: {
        sand: { kid: 'Lá vai a areia: milhões de grãozinhos de quartzo, feitos de silício e oxigénio.', sci: 'Areia de sílica, SiO2, quartzo quase puro: quase três quartos do vidro acabado.' },
        hot: { kid: '1500 °C, o máximo deste forno, e a areia continua a ser areia! Brilha, mas não derrete. A areia pura precisa de cerca de 1700 °C.', sci: 'A 1500 °C o quartzo brilha mas continua sólido: a sílica pura só funde a cerca de 1700 °C, quente demais para um forno comum.' },
        soda: { kid: 'Lá vai a soda: um pó branco feito de sódio, carbono e oxigénio.', sci: 'Carbonato de sódio, Na2CO3: o fundente que deixa a areia fundir.' },
        lime: { kid: 'Lá vai o calcário: a mesma rocha do giz e do mármore.', sci: 'Calcário, carbonato de cálcio, CaCO3: com o calor transforma-se em cal, CaO.' },
        again: { kid: 'Isso já está no cadinho. Experimenta outra coisa!', sci: 'Já está na mistura.' },
        fire: { kid: 'Fogo! Vê o mostrador a subir.', sci: 'O queimador está aceso: o cadinho aquece até 1500 °C, o máximo deste forno.' },
        out: { kid: 'Fogo apagado. O cadinho vai arrefecendo devagar.', sci: 'Queimador desligado: o cadinho arrefece.' },
        water: { kid: 'Vidro! Mas vidro só de areia e soda dissolvia-se devagar com a chuva. Junta-lhe calcário.', sci: 'Um banho de silicato de sódio: solúvel na água (vidro solúvel). Precisa de cal para ser durável.' },
        sodaAlone: { kid: 'A soda derrete sozinha, mas sem areia não é vidro: ao arrefecer, volta a ser soda branca.', sci: 'O Na2CO3 funde a 851 °C, mas sozinho volta a cristalizar ao arrefecer: sem formador de rede, não há vidro.' },
        set: { kid: 'O fogo apagou-se e o banho endureceu: é vidro! Arrefeceu sem formar cristais.', sci: 'Abaixo de cerca de 550 °C o banho fica rígido: um vidro, com os átomos congelados em desordem, sem cristais.' },
        melts: { kid: 'Está a derreter! A soda derrete primeiro e vai comendo os grãos de areia. As bolhas são dióxido de carbono.', sci: 'O carbonato de sódio funde a 851 °C e ataca o quartzo: Na2CO3 + SiO2 -> Na2SiO3 + CO2. Quanto mais quente, mais depressa; a 1500 °C o banho escorre.' },
        window: { kid: 'O calcário borbulhou e misturou-se. Agora o vidro já não se dissolve com a chuva: é vidro de janela!', sci: 'CaCO3 -> CaO + CO2. O cálcio torna o vidro durável: cerca de 72% de SiO2, 14% de Na2O e 9% de CaO, vidro sodocálcico.' },
        empty: { kid: 'Lá vai com a concha para o forno grande, para o vidreiro. Faz outra mistura!', sci: 'Retirado com a concha para o forno de trabalho; o cadinho está pronto para a próxima mistura.' },
      },
      panel: {
        kid: [
          'O vidro começa numa mistura: muita areia, alguma soda e um pouco de calcário. A areia sozinha precisaria de cerca de 1700 °C para derreter, mais do que um forno comum consegue. A soda fá-la derreter a cerca de 1500 °C, que ainda é seis vezes mais quente do que um forno de cozinha no máximo.',
          'Mas o vidro só de areia e soda dissolve-se devagar na água: os químicos chamam-lhe vidro solúvel. O calcário torna-o resistente, e assim as janelas aguentam a chuva durante centenas de anos. O vidro derretido é quentíssimo: só vidreiros treinados trabalham junto a um forno.',
        ],
        sci: [
          'A mistura: areia de sílica (SiO2), carbonato de sódio (Na2CO3) e calcário (CaCO3). A sílica pura só funde a cerca de 1700 °C. A soda é um fundente: funde a 851 °C e reage com a areia, Na2CO3 + SiO2 -> Na2SiO3 + CO2, quebrando pontes Si-O-Si para que o banho escorra a cerca de 1500 °C. O calcário também liberta o seu CO2, CaCO3 -> CaO + CO2, e o gás sai do banho em bolhas.',
          'Só com iões de sódio, o vidro fica solúvel: o silicato de sódio dissolve-se na água (vidro solúvel). Os iões de cálcio prendem a rede afrouxada e tornam-na durável. O vidro de janela acaba com cerca de 72% de SiO2, 14% de Na2O e 9% de CaO, com um pouco de MgO e Al2O3: vidro sodocálcico, cerca de 90% de todo o vidro produzido. Também se junta vidro partido, o casco, à mistura: funde mais facilmente e poupa energia.',
        ],
      },
    },
    blow: {
      label: 'A cana de sopro',
      title: 'Soprar vidro',
      shelf: 'Feito aqui',
      hints: { blow: 'Toca no vidro incandescente para soprar', more: 'Toca no vidro para o soprar maior', shape: 'Toca na garrafa ou na jarra em cima do banco' },
      buttons: { blow: 'Soprar', bottle: 'Fazer uma garrafa', vase: 'Fazer uma jarra' },
      says: {
        blow: { kid: 'Fuu! Abre-se uma bolha de ar dentro do vidro quente.', sci: 'Um sopro abre uma bolha na bola de vidro: o primeiro passo de qualquer peça soprada.' },
        more: { kid: 'Maior! A cana não para de rodar, senão o vidro mole descaía.', sci: 'O vidreiro roda a cana sem parar; a cerca de 1000 °C o vidro descairia com o próprio peso.' },
        early: { kid: 'Primeiro sopra uma bolha: uma bola maciça não se transforma numa garrafa oca.', sci: 'A bola de vidro tem de ser insuflada antes de se lhe dar forma.' },
        big: { kid: 'Já chega de soprar! Agora toca na garrafa ou na jarra para escolher a forma.', sci: 'A bolha está pronta: escolhe a forma.' },
        bottle: { kid: 'Uma garrafa! Vê-a arrefecer de laranja para vermelho e depois para transparente; a seguir vai para a prateleira.', sci: 'Uma garrafa. Abaixo de cerca de 500 °C deixa de brilhar, mas continua quente demais para tocar; uma verdadeira arrefeceria agora durante horas num forno de recozimento.' },
        vase: { kid: 'Uma jarra! Vê-a arrefecer de laranja para vermelho e depois para transparente; a seguir vai para a prateleira.', sci: 'Uma jarra. Abaixo de cerca de 500 °C deixa de brilhar, mas continua quente demais para tocar; uma verdadeira arrefeceria agora durante horas num forno de recozimento.' },
      },
      panel: {
        kid: [
          'O vidreiro mergulha uma cana de ferro no forno e apanha uma bola de vidro derretido, mole e elástica como caramelo quente. Um sopro pela cana faz uma bolha lá dentro e, rodando, balançando e moldando, faz garrafas, jarras e taças.',
          'As pessoas fizeram contas de vidro durante mais de 2000 anos antes de alguém pensar em soprar vidro. O sopro de vidro foi inventado há cerca de 2000 anos na costa oriental do Mediterrâneo, e de repente as garrafas e os copos de vidro ficaram baratos. Cuidado: o vidro que já não brilha ainda pode queimar.',
        ],
        sci: [
          'O vidro não tem ponto de fusão: ao arrefecer, vai ficando cada vez mais rígido. Trabalha-se a cerca de 1000 a 1100 °C, perto do seu ponto de trabalho (uma viscosidade de cerca de 1000 Pa·s): rígido o bastante para manter a forma, mole o bastante para inchar. Deixa de brilhar à vista abaixo de cerca de 500 °C, muito antes de se poder tocar.',
          'O sopro de vidro começou na costa oriental do Mediterrâneo no século I a.C.; os objetos de vidro mais antigos, contas da Mesopotâmia, têm cerca de 4500 anos. As peças acabadas vão para um forno de recozimento, mantidas um pouco acima de 500 °C e arrefecidas devagar durante horas, para que as tensões deixadas por um arrefecimento desigual não as partam.',
        ],
      },
    },
    light: {
      label: 'Areia, vidro e luz',
      title: 'Porque é que o vidro é transparente?',
      hints: { start: 'Toca na areia ou no vidro', pane: 'Toca no vidro', turn: 'Toca outra vez no vidro para virar a aresta para a lâmpada', fibre: 'Toca no rolo de fibra de vidro', sand: 'Toca na areia' },
      buttons: { sand: 'Iluminar a areia', pane: 'Iluminar o vidro', edge: 'Iluminar a aresta', fibre: 'Iluminar a fibra', off: 'Apagar a lâmpada' },
      says: {
        sand: { kid: 'A areia acende-se toda branca, mas nada chega ao cartão: as arestas de cada grão espalham a luz, como faz a neve.', sci: 'Cada superfície de grão reflete um pouco e desvia o resto; depois de muitos grãos, a luz sai em todas as direções. Branco difuso, e opaco.' },
        off: { kid: 'Lâmpada apagada. Toca na areia, no vidro ou na fibra para a acender outra vez.', sci: 'Lâmpada apagada.' },
        pane: { kid: 'Passa a direito! O vidro é uma peça só, sem arestas lá dentro, por isso a luz segue até ao cartão.', sci: 'Só cerca de 4% é refletido em cada superfície (n = 1,52). Os fotões visíveis, de 1,6 a 3,3 eV, não conseguem excitar os seus eletrões: a sílica pura precisa de cerca de 9 eV, e o vidro de janela só absorve no ultravioleta.' },
        edge: { kid: 'Verde! Ao atravessar o vidro pelo caminho comprido, a luz mostra a sua cor: um bocadinho de ferro da areia.', sci: 'Entrando pela aresta, a luz percorre o vidro de ponta a ponta por reflexão interna total; os iões Fe2+ absorvem o vermelho e o infravermelho próximo, e o caminho longo parece verde.' },
        fibre: { kid: 'A luz segue o fio de vidro enrolado em todas as curvas e sai na ponta! Os cabos da internet no fundo do mar funcionam assim.', sci: 'A reflexão interna total guia a luz pelo núcleo da fibra. A fibra de sílica perde cerca de 0,2 dB por km a 1550 nm: metade da luz ainda lá está ao fim de cerca de 15 km.' },
      },
      panel: {
        kid: [
          'A areia e o vidro são feitos da mesma coisa; então porque é que só se vê através de um? Um monte de areia são milhões de grãos, e as arestas de cada grão desviam um pouco de luz. Depois de tantos desvios, a luz volta a sair em todas as direções: o monte parece branco, e nada passa. A neve, o açúcar e até o vidro moído parecem brancos pela mesma razão.',
          'O vidro é uma peça só, sem arestas lá dentro, e a luz passa a direito. O vidro das janelas é um bocadinho verde por causa de um pouco de ferro da areia, e isso só se vê quando a luz atravessa muito vidro, pela aresta. Vidro muito puro, puxado em fibras finas, leva a luz por quilómetros: é assim que a internet atravessa os oceanos.',
        ],
        sci: [
          'A areia de quartzo e o vidro de janela são ambos sobretudo SiO2. Um monte de areia espalha a luz em cada superfície de grão (quartzo n = 1,54, contra o ar), e muitas dispersões mandam-na para todas as direções: branco difuso, opaco. O vidro não tem fronteiras de grão, e os fotões visíveis (1,6 a 3,3 eV) trazem pouca energia para excitar os seus eletrões (cerca de 9 eV na sílica pura), por isso passam; cerca de 4% é refletido em cada superfície.',
          'O vidro comum tem cerca de 0,1% de óxido de ferro vindo da areia; o Fe2+ absorve no vermelho e no infravermelho próximo, o que se vê como verde ao longo de um caminho comprido. Em 1966, Charles Kao mostrou que as fibras de vidro podiam levar sinais longe se lhes tirassem as impurezas (Prémio Nobel da Física de 2009). A fibra de sílica de hoje perde cerca de 0,2 dB por km a 1550 nm, por isso metade da luz ainda lá está ao fim de cerca de 15 km.',
        ],
      },
    },
  },
  pl: {
    title: 'Pracownia dmuchacza szkła',
    greet: {
      kid: 'Jesteśmy w środku obrazka: w pracowni dmuchacza szkła, nocą! Czujesz ciepło z pieca? Tutaj piasek zmienia się w szkło. Historia obrazka jest na sztaludze obok ciebie.',
      sci: 'Pracownia szkła nocą: piec tyglowy do topienia zestawu, piec roboczy z kulą szkła na piszczeli i stół do prób ze światłem. Historia obrazka jest na sztaludze.',
    },
    talk: {
      kid: [
        'Szkło robi się głównie z piasku, takiego jak na plaży, tylko bardzo czystego i białego.',
        'Popatrz na wielką lupę nad półką: w szkle krzem i tlen trzymają się za ręce bezładnie, bez równych rzędów, jakie ma kryształ.',
        'Niektóre stare witraże są grubsze na dole. Nie dlatego, że szkło powoli spływa: zrobiono je nierówne, a budowniczowie wstawiali je grubszą stroną w dół.',
      ],
      sci: [
        'Piasek szklarski to prawie czysty kwarc, SiO2. Odrobina żelaza, którą wnosi, nadaje szybom zielony odcień.',
        'Lupa pokazuje bezładną sieć Zachariasena (1932), narysowaną płasko: w prawdziwym szkle każdy atom krzemu wiąże cztery atomy tlenu, a każdy atom tlenu łączy dwa atomy krzemu, w pierścieniach każdej wielkości, bez powtarzającego się porządku.',
        'Średniowieczne szyby bywają grubsze na dole, bo szkło koronowe było nierówne, a szklarze osadzali je cięższą krawędzią w dół; w temperaturze pokojowej szkło potrzebowałoby znacznie więcej czasu niż wiek Wszechświata, żeby widocznie się odkształcić.',
      ],
    },
    batch: {
      label: 'Tygiel',
      title: 'Piasek, soda i wapień',
      bins: { sand: 'Piasek', soda: 'Soda', lime: 'Wapień' },
      gauge: 'czysty piasek się topi',
      slider: 'Ogień',
      hints: { sand: 'Dotknij kupki piasku', soda: 'Dotknij kupki sody', lime: 'Dotknij kupki wapienia', fire: 'Dotknij tygla, żeby rozpalić ogień', empty: 'Dotknij chochli, żeby opróżnić tygiel' },
      buttons: { sand: 'Dosyp piasku', soda: 'Dosyp sody', lime: 'Dosyp wapienia', fire: 'Rozpal lub zgaś ogień', empty: 'Opróżnij tygiel' },
      says: {
        sand: { kid: 'Wsypujemy piasek: miliony malutkich ziarenek kwarcu, zrobionych z krzemu i tlenu.', sci: 'Piasek kwarcowy, SiO2, prawie czysty kwarc: blisko trzy czwarte gotowego szkła.' },
        hot: { kid: '1500 °C, tyle, ile ten piec potrafi, a piasek dalej jest piaskiem! Świeci, ale się nie topi. Czysty piasek potrzebuje około 1700 °C.', sci: 'W 1500 °C kwarc świeci, ale pozostaje stały: czysta krzemionka topi się dopiero w około 1700 °C, za gorąco jak na zwykły piec.' },
        soda: { kid: 'Wsypujemy sodę: biały proszek z sodu, węgla i tlenu.', sci: 'Soda kalcynowana, węglan sodu, Na2CO3: topnik, dzięki któremu piasek się topi.' },
        lime: { kid: 'Wsypujemy wapień: tę samą skałę, z której jest kreda i marmur.', sci: 'Wapień, węglan wapnia, CaCO3: w gorącu zmienia się w wapno, CaO.' },
        again: { kid: 'To już jest w tyglu. Spróbuj czegoś innego!', sci: 'To już jest w zestawie.' },
        fire: { kid: 'Ogień! Patrz, jak wskazówka idzie w górę.', sci: 'Palnik włączony: tygiel nagrzewa się do 1500 °C, maksimum tego pieca.' },
        out: { kid: 'Ogień zgaszony. Tygiel powoli stygnie.', sci: 'Palnik wyłączony: tygiel stygnie.' },
        water: { kid: 'Szkło! Ale szkło z samego piasku i sody powoli rozpuszczałoby się w deszczu. Dosyp wapienia.', sci: 'Stop krzemianu sodu: rozpuszczalny w wodzie (szkło wodne). Żeby był trwały, potrzebuje wapna.' },
        sodaAlone: { kid: 'Soda topi się sama, ale bez piasku to nie jest szkło: po ostygnięciu znowu będzie białą sodą.', sci: 'Na2CO3 topi się w 851 °C, ale sam krystalizuje z powrotem przy stygnięciu: bez składnika tworzącego sieć nie ma szkła.' },
        set: { kid: 'Ogień zgasł, a stop stwardniał: to szkło! Ostygło, nie tworząc kryształów.', sci: 'Poniżej około 550 °C stop jest sztywny: to szkło, którego atomy zastygły w nieładzie, bez kryształów.' },
        melts: { kid: 'Topi się! Najpierw topi się soda i zjada ziarenka piasku. Bąbelki to dwutlenek węgla.', sci: 'Soda kalcynowana topi się w 851 °C i atakuje kwarc: Na2CO3 + SiO2 -> Na2SiO3 + CO2. Im goręcej, tym szybciej; w 1500 °C stop płynie.' },
        window: { kid: 'Wapień zamusował i się rozpuścił. Teraz szkło nie rozpuści się w deszczu: to szkło okienne!', sci: 'CaCO3 -> CaO + CO2. Wapń czyni szkło trwałym: około 72% SiO2, 14% Na2O i 9% CaO, szkło sodowo-wapniowe.' },
        empty: { kid: 'Chochlą do dużego pieca, dla dmuchacza szkła. Zrób następny zestaw!', sci: 'Przeniesione chochlą do pieca roboczego; tygiel jest gotowy na następny zestaw.' },
      },
      panel: {
        kid: [
          'Szkło zaczyna się od mieszanki zwanej zestawem: dużo piasku, trochę sody i odrobina wapienia. Sam piasek potrzebowałby około 1700 °C, żeby się stopić, więcej, niż daje zwykły piec. Dzięki sodzie topi się w około 1500 °C, a to wciąż sześć razy goręcej niż w piekarniku nastawionym na maksimum.',
          'Ale szkło z samego piasku i sody powoli rozpuszcza się w wodzie: chemicy nazywają je szkłem wodnym. Wapień czyni je wytrzymałym, więc okna mogą stać w deszczu setki lat. Stopione szkło jest strasznie gorące: przy piecu pracują tylko wyszkoleni hutnicy.',
        ],
        sci: [
          'Zestaw: piasek kwarcowy (SiO2), soda kalcynowana (Na2CO3) i wapień (CaCO3). Czysta krzemionka topi się dopiero w około 1700 °C. Soda jest topnikiem: topi się w 851 °C i reaguje z piaskiem, Na2CO3 + SiO2 -> Na2SiO3 + CO2, rozrywając mostki Si-O-Si, tak że stop płynie w około 1500 °C. Wapień też oddaje CO2, CaCO3 -> CaO + CO2, a gaz uchodzi ze stopu w bąblach.',
          'Same jony sodu zostawiają szkło rozpuszczalnym: krzemian sodu rozpuszcza się w wodzie (szkło wodne). Jony wapnia wiążą rozluźnioną sieć i czynią ją trwałą. Szkło okienne ma w końcu około 72% SiO2, 14% Na2O i 9% CaO, z odrobiną MgO i Al2O3: szkło sodowo-wapniowe, około 90% całego wytwarzanego szkła. Do zestawu dodaje się też stłuczkę: topi się łatwiej i oszczędza energię.',
        ],
      },
    },
    blow: {
      label: 'Piszczel',
      title: 'Dmuchanie szkła',
      shelf: 'Zrobione tutaj',
      hints: { blow: 'Dotknij świecącego szkła, żeby dmuchnąć', more: 'Dotknij szkła, żeby je bardziej nadmuchać', shape: 'Dotknij butelki albo wazonu na stołku' },
      buttons: { blow: 'Dmuchnij', bottle: 'Uformuj butelkę', vase: 'Uformuj wazon' },
      says: {
        blow: { kid: 'Fuu! W gorącym szkle otwiera się bańka powietrza.', sci: 'Dmuchnięcie otwiera bańkę w nabranej kuli szkła: to pierwszy krok każdego wyrobu dmuchanego.' },
        more: { kid: 'Większa! Piszczel cały czas się obraca, inaczej miękkie szkło by opadło.', sci: 'Dmuchacz cały czas obraca piszczel; w około 1000 °C szkło opadłoby pod własnym ciężarem.' },
        early: { kid: 'Najpierw wdmuchnij bańkę: z pełnej kuli nie zrobisz pustej w środku butelki.', sci: 'Nabraną kulę szkła trzeba najpierw nadmuchać, zanim nada się jej kształt.' },
        big: { kid: 'Wystarczy! Teraz dotknij butelki albo wazonu i wybierz kształt.', sci: 'Bańka jest gotowa: wybierz kształt.' },
        bottle: { kid: 'Butelka! Zobacz, jak stygnie: z pomarańczowej robi się czerwona, a potem przezroczysta. Potem trafi na półkę.', sci: 'Butelka. Poniżej około 500 °C przestaje świecić, ale wciąż jest o wiele za gorąca, żeby jej dotknąć; prawdziwa stygłaby teraz godzinami w odprężarce.' },
        vase: { kid: 'Wazon! Zobacz, jak stygnie: z pomarańczowego robi się czerwony, a potem przezroczysty. Potem trafi na półkę.', sci: 'Wazon. Poniżej około 500 °C przestaje świecić, ale wciąż jest o wiele za gorący, żeby go dotknąć; prawdziwy stygłby teraz godzinami w odprężarce.' },
      },
      panel: {
        kid: [
          'Dmuchacz zanurza w piecu żelazną rurę, piszczel, i nabiera kulę stopionego szkła, miękką i ciągnącą się jak ciepłe toffi. Dmuchnięcie w rurę robi w środku bańkę, a obracanie, kołysanie i formowanie zamienia ją w butelki, wazony i miski.',
          'Ludzie robili szklane paciorki przez ponad 2000 lat, zanim ktoś wpadł na pomysł, żeby szkło dmuchać. Dmuchanie szkła wynaleziono około 2000 lat temu na wschodnim wybrzeżu Morza Śródziemnego i nagle szklane butelki i kubki stały się tanie. Uwaga: szkło, które już nie świeci, wciąż może poparzyć.',
        ],
        sci: [
          'Szkło nie ma temperatury topnienia: stygnąc, po prostu sztywnieje. Formuje się je w około 1000 do 1100 °C, blisko punktu roboczego (lepkość około 1000 Pa·s): jest dość sztywne, żeby trzymać kształt, i dość miękkie, żeby dało się je nadmuchać. Poniżej około 500 °C przestaje widocznie świecić, na długo zanim można go dotknąć.',
          'Dmuchanie szkła zaczęło się na wschodnim wybrzeżu Morza Śródziemnego w I wieku p.n.e.; najstarsze szklane przedmioty, paciorki z Mezopotamii, mają około 4500 lat. Gotowe wyroby trafiają do odprężarki, gdzie trzyma się je nieco powyżej 500 °C i chłodzi powoli przez wiele godzin, żeby naprężenia zamrożone przez nierówne stygnięcie ich nie rozsadziły.',
        ],
      },
    },
    light: {
      label: 'Piasek, szkło i światło',
      title: 'Dlaczego szkło jest przezroczyste?',
      hints: { start: 'Dotknij piasku albo szyby', pane: 'Dotknij szyby', turn: 'Dotknij szyby jeszcze raz, żeby obrócić ją krawędzią do lampy', fibre: 'Dotknij zwoju światłowodu', sand: 'Dotknij piasku' },
      buttons: { sand: 'Poświeć na piasek', pane: 'Poświeć na szkło', edge: 'Poświeć w krawędź', fibre: 'Poświeć we włókno', off: 'Zgaś lampę' },
      says: {
        sand: { kid: 'Piasek rozjaśnia się na biało, ale do kartonu nic nie dociera: krawędzie każdego ziarenka odbijają światło na boki, tak jak śnieg.', sci: 'Każda powierzchnia ziarna odbija trochę światła, a resztę załamuje; po wielu ziarnach światło wychodzi we wszystkich kierunkach. Rozproszona biel, nieprzezroczysta.' },
        off: { kid: 'Lampa zgaszona. Dotknij piasku, szyby albo włókna, żeby znowu ją zapalić.', sci: 'Lampa zgaszona.' },
        pane: { kid: 'Prosto na wylot! Szkło to jeden kawałek bez krawędzi w środku, więc światło leci dalej, aż do kartonu.', sci: 'Na każdej powierzchni odbija się tylko około 4% (n = 1,52). Fotony światła widzialnego, od 1,6 do 3,3 eV, nie mogą wzbudzić jego elektronów: czysta krzemionka potrzebuje około 9 eV, a szkło okienne pochłania dopiero w nadfiolecie.' },
        edge: { kid: 'Zielone! Gdy światło idzie przez szkło długą drogą, widać jego kolor: odrobinę żelaza z piasku.', sci: 'Wpuszczone w krawędź światło biegnie przez całą długość szyby dzięki całkowitemu wewnętrznemu odbiciu; jony Fe2+ pochłaniają czerwień i bliską podczerwień, więc długa droga wygląda na zieloną.' },
        fibre: { kid: 'Światło idzie za skręconą szklaną nitką przez każdy zakręt i wychodzi na końcu! Tak działają kable internetowe na dnie morza.', sci: 'Całkowite wewnętrzne odbicie prowadzi światło rdzeniem włókna. Włókno krzemionkowe traci około 0,2 dB na km przy 1550 nm: po około 15 km zostaje połowa światła.' },
      },
      panel: {
        kid: [
          'Piasek i szkło są zrobione z tego samego, więc dlaczego tylko przez jedno widać? Kupka piasku to miliony ziarenek, a krawędzie każdego odbijają trochę światła na bok. Po tylu odbiciach światło wychodzi z powrotem na wszystkie strony: kupka wygląda na białą i nic nie przechodzi na drugą stronę. Śnieg, cukier, a nawet szkło stłuczone na proszek wyglądają na białe z tego samego powodu.',
          'Szkło to jeden kawałek bez krawędzi w środku, więc światło przechodzi na wprost. Szyba w oknie jest troszkę zielona przez odrobinę żelaza z piasku, a widać to tylko wtedy, gdy światło idzie przez szkło długą drogą, wzdłuż krawędzi. Bardzo czyste szkło wyciągnięte w cienkie włókna niesie światło przez kilometry: tak internet przechodzi przez oceany.',
        ],
        sci: [
          'Piasek kwarcowy i szkło okienne to w obu przypadkach głównie SiO2. Kupka piasku rozprasza światło na każdej powierzchni ziarna (kwarc n = 1,54, wobec powietrza), a wiele rozproszeń wysyła je we wszystkich kierunkach: rozproszona biel, nieprzezroczystość. Szkło nie ma granic ziaren, a fotony widzialne (1,6 do 3,3 eV) niosą za mało energii, żeby wzbudzić jego elektrony (około 9 eV w czystej krzemionce), więc przechodzą; na każdej powierzchni odbija się około 4%.',
          'Zwykłe szkło zawiera około 0,1% tlenku żelaza z piasku; Fe2+ pochłania w czerwieni i bliskiej podczerwieni, co na długiej drodze widać jako zieleń. W 1966 roku Charles Kao wykazał, że szklane włókna mogłyby nieść sygnały daleko, gdyby usunąć z nich zanieczyszczenia (Nagroda Nobla w dziedzinie fizyki 2009). Dzisiejsze włókno krzemionkowe traci około 0,2 dB na km przy 1550 nm, więc po około 15 km zostaje połowa światła.',
        ],
      },
    },
  },
  de: {
    title: 'Die Glasbläserwerkstatt',
    greet: {
      kid: 'Wir sind im Bild: in der Werkstatt eines Glasbläsers, bei Nacht! Spürst du die Hitze vom Ofen? Hier wird aus Sand Glas. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Eine Glaswerkstatt bei Nacht: ein Hafenofen, der das Gemenge schmilzt, der Arbeitsofen mit einem Glasposten an der Glasmacherpfeife und ein Tisch für Versuche mit Licht. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Glas ist vor allem aus Sand, so wie am Strand, nur ganz sauber und weiß.',
        'Schau dir die große Lupe über dem Regal an: Im Glas halten sich Silicium und Sauerstoff kreuz und quer an den Händen, ohne ordentliche Reihen wie in einem Kristall.',
        'Manche alten Kirchenfenster sind unten dicker. Nicht weil Glas langsam nach unten fließt: Sie wurden ungleichmäßig gemacht, und man hat die dicke Seite nach unten gesetzt.',
      ],
      sci: [
        'Glassand ist fast reiner Quarz, SiO2. Das bisschen Eisen, das er mitbringt, färbt Fensterglas grün.',
        'Die Lupe zeigt Zachariasens Zufallsnetzwerk (1932), flach gezeichnet: Im echten Glas ist jedes Siliciumatom an vier Sauerstoffatome gebunden, und jedes Sauerstoffatom verbrückt zwei Siliciumatome, in Ringen jeder Größe, ohne sich wiederholende Ordnung.',
        'Mittelalterliche Scheiben sind oft unten dicker, weil Mondglas ungleichmäßig war und die Glaser die schwere Kante nach unten setzten; bei Raumtemperatur bräuchte Glas viel länger als das Alter des Universums, um sich sichtbar zu verformen.',
      ],
    },
    batch: {
      label: 'Der Schmelztiegel',
      title: 'Sand, Soda und Kalkstein',
      bins: { sand: 'Sand', soda: 'Soda', lime: 'Kalkstein' },
      gauge: 'reiner Sand schmilzt',
      slider: 'Das Feuer',
      hints: { sand: 'Tippe auf den Sandhaufen', soda: 'Tippe auf den Sodahaufen', lime: 'Tippe auf den Kalksteinhaufen', fire: 'Tippe auf den Tiegel, um das Feuer anzuzünden', empty: 'Tippe auf die Kelle, um den Tiegel zu leeren' },
      buttons: { sand: 'Gib Sand dazu', soda: 'Gib Soda dazu', lime: 'Gib Kalkstein dazu', fire: 'Feuer an oder aus', empty: 'Leere den Tiegel' },
      says: {
        sand: { kid: 'Hinein mit dem Sand: Millionen winziger Quarzkörner, aus Silicium und Sauerstoff.', sci: 'Quarzsand, SiO2, fast reiner Quarz: knapp drei Viertel des fertigen Glases.' },
        hot: { kid: '1500 °C, heißer kann dieser Ofen nicht, und der Sand ist immer noch Sand! Er glüht, aber er schmilzt nicht. Reiner Sand braucht etwa 1700 °C.', sci: 'Bei 1500 °C glüht der Quarz, bleibt aber fest: Reines Siliciumdioxid schmilzt erst bei etwa 1700 °C, zu heiß für einen gewöhnlichen Ofen.' },
        soda: { kid: 'Hinein mit dem Soda: ein weißes Pulver aus Natrium, Kohlenstoff und Sauerstoff.', sci: 'Soda, Natriumcarbonat, Na2CO3: das Flussmittel, das den Sand schmelzen lässt.' },
        lime: { kid: 'Hinein mit dem Kalkstein: dasselbe Gestein wie Kreide und Marmor.', sci: 'Kalkstein, Calciumcarbonat, CaCO3: In der Hitze wird daraus Branntkalk, CaO.' },
        again: { kid: 'Das ist schon im Tiegel. Probier etwas anderes!', sci: 'Schon im Gemenge.' },
        fire: { kid: 'Feuer! Schau, wie der Zeiger steigt.', sci: 'Der Brenner läuft: Der Tiegel heizt sich auf 1500 °C auf, das Höchste dieses Ofens.' },
        out: { kid: 'Feuer aus. Der Tiegel kühlt langsam ab.', sci: 'Brenner aus: Der Tiegel kühlt ab.' },
        water: { kid: 'Glas! Aber Glas nur aus Sand und Soda würde sich im Regen langsam auflösen. Gib Kalkstein dazu.', sci: 'Eine Natriumsilicatschmelze: wasserlöslich (Wasserglas). Damit sie beständig wird, braucht sie Kalk.' },
        sodaAlone: { kid: 'Das Soda schmilzt ganz allein, aber ohne Sand ist es kein Glas: Abgekühlt wird es wieder weißes Soda.', sci: 'Na2CO3 schmilzt bei 851 °C, kristallisiert aber allein beim Abkühlen wieder: ohne Netzwerkbildner kein Glas.' },
        set: { kid: 'Das Feuer ist aus und die Schmelze ist hart geworden: Glas! Sie ist abgekühlt, ohne Kristalle zu bilden.', sci: 'Unter etwa 550 °C ist die Schmelze starr: ein Glas, dessen Atome in Unordnung erstarrt sind, ohne Kristalle.' },
        melts: { kid: 'Es schmilzt! Zuerst schmilzt das Soda und frisst sich in die Sandkörner. Die Blasen sind Kohlenstoffdioxid.', sci: 'Soda schmilzt bei 851 °C und greift den Quarz an: Na2CO3 + SiO2 -> Na2SiO3 + CO2. Je heißer, desto schneller; bei 1500 °C fließt die Schmelze.' },
        window: { kid: 'Der Kalkstein ist hineingesprudelt. Jetzt löst sich das Glas im Regen nicht mehr auf: Das ist Fensterglas!', sci: 'CaCO3 -> CaO + CO2. Das Calcium macht das Glas beständig: etwa 72% SiO2, 14% Na2O und 9% CaO, Kalk-Natron-Glas.' },
        empty: { kid: 'Mit der Kelle ab in den großen Ofen, für den Glasbläser. Mach noch ein Gemenge!', sci: 'Mit der Kelle in den Arbeitsofen geschöpft; der Tiegel ist bereit für das nächste Gemenge.' },
      },
      panel: {
        kid: [
          'Glas beginnt als Mischung, dem Gemenge: viel Sand, etwas Soda und ein wenig Kalkstein. Sand allein bräuchte etwa 1700 °C zum Schmelzen, mehr, als ein gewöhnlicher Ofen schafft. Soda lässt ihn bei etwa 1500 °C schmelzen, und das ist immer noch sechsmal so heiß wie ein Backofen auf höchster Stufe.',
          'Aber Glas nur aus Sand und Soda löst sich langsam in Wasser auf: Chemiker nennen es Wasserglas. Kalkstein macht es fest, sodass Fenster Hunderte von Jahren im Regen stehen können. Geschmolzenes Glas ist furchtbar heiß: Nur ausgebildete Glasmacher arbeiten an einem Ofen.',
        ],
        sci: [
          'Das Gemenge: Quarzsand (SiO2), Soda (Na2CO3) und Kalkstein (CaCO3). Reines Siliciumdioxid schmilzt erst bei etwa 1700 °C. Soda ist ein Flussmittel: Es schmilzt bei 851 °C und reagiert mit dem Sand, Na2CO3 + SiO2 -> Na2SiO3 + CO2, und bricht Si-O-Si-Brücken auf, sodass die Schmelze bei etwa 1500 °C fließt. Auch der Kalkstein gibt sein CO2 ab, CaCO3 -> CaO + CO2, und das Gas perlt aus der Schmelze.',
          'Natriumionen allein lassen das Glas löslich: Natriumsilicat löst sich in Wasser (Wasserglas). Calciumionen binden das gelockerte Netzwerk und machen es beständig. Fensterglas hat am Ende etwa 72% SiO2, 14% Na2O und 9% CaO, mit etwas MgO und Al2O3: Kalk-Natron-Glas, etwa 90% allen hergestellten Glases. Auch Glasscherben kommen ins Gemenge: Sie schmelzen leichter und sparen Energie.',
        ],
      },
    },
    blow: {
      label: 'Die Glasmacherpfeife',
      title: 'Glas blasen',
      shelf: 'Hier gemacht',
      hints: { blow: 'Tippe auf das glühende Glas, um zu blasen', more: 'Tippe auf das Glas, um es größer zu blasen', shape: 'Tippe auf die Flasche oder die Vase auf dem Hocker' },
      buttons: { blow: 'Blase', bottle: 'Forme eine Flasche', vase: 'Forme eine Vase' },
      says: {
        blow: { kid: 'Puh! Im heißen Glas öffnet sich eine Luftblase.', sci: 'Ein Hauch öffnet eine Blase im Glasposten: der erste Schritt jedes geblasenen Stücks.' },
        more: { kid: 'Größer! Die Pfeife dreht sich immer weiter, sonst würde das weiche Glas heruntersacken.', sci: 'Der Glasbläser dreht die Pfeife ständig; bei etwa 1000 °C würde das Glas unter seinem eigenen Gewicht absacken.' },
        early: { kid: 'Blase zuerst eine Blase hinein: Aus einem vollen Klumpen wird keine hohle Flasche.', sci: 'Der Glasposten muss erst zu einem Külbel aufgeblasen werden, bevor er geformt werden kann.' },
        big: { kid: 'Groß genug! Tippe jetzt auf die Flasche oder die Vase, um die Form zu wählen.', sci: 'Das Külbel ist bereit: Wähle die Form.' },
        bottle: { kid: 'Eine Flasche! Schau, wie sie abkühlt: von Orange zu Rot und dann klar. Dann kommt sie ins Regal.', sci: 'Eine Flasche. Unter etwa 500 °C hört sie auf zu glühen, ist aber noch viel zu heiß zum Anfassen; eine echte würde jetzt stundenlang in einem Kühlofen abkühlen.' },
        vase: { kid: 'Eine Vase! Schau, wie sie abkühlt: von Orange zu Rot und dann klar. Dann kommt sie ins Regal.', sci: 'Eine Vase. Unter etwa 500 °C hört sie auf zu glühen, ist aber noch viel zu heiß zum Anfassen; eine echte würde jetzt stundenlang in einem Kühlofen abkühlen.' },
      },
      panel: {
        kid: [
          'Der Glasbläser taucht ein Eisenrohr in den Ofen und holt einen Klumpen geschmolzenes Glas heraus, weich und zäh wie warmes Toffee. Ein Pusten durch das Rohr macht innen eine Blase, und mit Drehen, Schwenken und Formen werden daraus Flaschen, Vasen und Schalen.',
          'Menschen haben mehr als 2000 Jahre lang Glasperlen gemacht, bevor jemand auf die Idee kam, Glas zu blasen. Das Glasblasen wurde vor etwa 2000 Jahren an der Ostküste des Mittelmeers erfunden, und plötzlich waren Flaschen und Becher aus Glas billig. Vorsicht: Glas, das nicht mehr glüht, kann immer noch verbrennen.',
        ],
        sci: [
          'Glas hat keinen Schmelzpunkt: Beim Abkühlen wird es einfach immer zäher. Verarbeitet wird es bei etwa 1000 bis 1100 °C, nahe seinem Verarbeitungspunkt (eine Viskosität von etwa 1000 Pa·s): fest genug, um eine Form zu halten, weich genug, um es aufzublasen. Unter etwa 500 °C hört es sichtbar auf zu glühen, lange bevor man es anfassen kann.',
          'Das Glasblasen begann im 1. Jahrhundert v. Chr. an der Ostküste des Mittelmeers; die ältesten Glasgegenstände, Perlen aus Mesopotamien, sind etwa 4500 Jahre alt. Fertige Stücke kommen in einen Kühlofen, werden knapp über 500 °C gehalten und über Stunden langsam abgekühlt, damit Spannungen aus ungleichmäßigem Abkühlen sie nicht sprengen.',
        ],
      },
    },
    light: {
      label: 'Sand, Glas und Licht',
      title: 'Warum ist Glas durchsichtig?',
      hints: { start: 'Tippe auf den Sand oder die Glasscheibe', pane: 'Tippe auf die Glasscheibe', turn: 'Tippe noch einmal auf die Scheibe, um ihre Kante zur Lampe zu drehen', fibre: 'Tippe auf die Rolle Glasfaser', sand: 'Tippe auf den Sand' },
      buttons: { sand: 'Leuchte auf den Sand', pane: 'Leuchte auf das Glas', edge: 'Leuchte in die Kante', fibre: 'Leuchte in die Faser', off: 'Lampe aus' },
      says: {
        sand: { kid: 'Der Sand leuchtet weiß auf, aber zur Karte kommt nichts durch: Die Kanten jedes Korns werfen das Licht zur Seite, wie Schnee.', sci: 'Jede Kornoberfläche wirft etwas Licht zurück und bricht den Rest; nach vielen Körnern verlässt das Licht sie in alle Richtungen. Diffuses Weiß, undurchsichtig.' },
        off: { kid: 'Lampe aus. Tippe auf den Sand, die Scheibe oder die Faser, um sie wieder anzuschalten.', sci: 'Lampe aus.' },
        pane: { kid: 'Geradewegs hindurch! Das Glas ist ein einziges Stück ohne Kanten im Inneren, also geht das Licht weiter bis zur Karte.', sci: 'Nur etwa 4% werden an jeder Oberfläche reflektiert (n = 1,52). Sichtbare Photonen, 1,6 bis 3,3 eV, können seine Elektronen nicht anregen: Reines Siliciumdioxid braucht etwa 9 eV, und Fensterglas absorbiert erst im Ultravioletten.' },
        edge: { kid: 'Grün! Auf dem langen Weg durch das Glas zeigt das Licht seine Farbe: eine Spur Eisen aus dem Sand.', sci: 'In die Kante geleitet, läuft das Licht durch Totalreflexion die ganze Scheibe entlang; Fe2+-Ionen absorbieren Rot und nahes Infrarot, darum sieht der lange Weg grün aus.' },
        fibre: { kid: 'Das Licht folgt dem gewundenen Glasfaden um jede Kurve und kommt am Ende heraus! So funktionieren die Internetkabel unter dem Meer.', sci: 'Totalreflexion führt das Licht im Kern der Faser. Quarzglasfasern verlieren bei 1550 nm etwa 0,2 dB pro km: Nach etwa 15 km ist noch die Hälfte des Lichts da.' },
      },
      panel: {
        kid: [
          'Sand und Glas sind aus demselben Stoff, warum kann man dann nur durch eins hindurchsehen? Ein Sandhaufen besteht aus Millionen Körnern, und die Kanten jedes Korns werfen ein bisschen Licht zur Seite. Nach so vielen Würfen kommt das Licht in alle Richtungen wieder heraus: Der Haufen sieht weiß aus, und nichts kommt hindurch. Schnee, Zucker und sogar zerstoßenes Glas sehen aus demselben Grund weiß aus.',
          'Glas ist ein einziges Stück ohne Kanten im Inneren, also geht das Licht geradewegs hindurch. Fensterglas ist ein klein wenig grün, wegen einer Spur Eisen aus seinem Sand, und das sieht man nur, wenn das Licht einen langen Weg durch das Glas nimmt, an der Kante entlang. Sehr reines Glas, zu dünnen Fasern gezogen, trägt Licht kilometerweit: So kommt das Internet über die Ozeane.',
        ],
        sci: [
          'Quarzsand und Fensterglas bestehen beide vor allem aus SiO2. Ein Sandhaufen streut Licht an jeder Kornoberfläche (Quarz n = 1,54, gegen Luft), und viele Streuungen schicken es in alle Richtungen: diffuses Weiß, undurchsichtig. Glas hat keine Korngrenzen, und sichtbare Photonen (1,6 bis 3,3 eV) tragen zu wenig Energie, um seine Elektronen anzuregen (etwa 9 eV in reinem Siliciumdioxid), also gehen sie hindurch; etwa 4% werden an jeder Oberfläche reflektiert.',
          'Gewöhnliches Glas enthält etwa 0,1% Eisenoxid aus seinem Sand; Fe2+ absorbiert im Roten und nahen Infraroten, was auf einem langen Weg grün erscheint. 1966 zeigte Charles Kao, dass Glasfasern Signale weit tragen könnten, wenn man ihre Verunreinigungen entfernt (Nobelpreis für Physik 2009). Heutige Quarzglasfasern verlieren bei 1550 nm etwa 0,2 dB pro km, also ist nach etwa 15 km noch die Hälfte des Lichts da.',
        ],
      },
    },
  },
}
