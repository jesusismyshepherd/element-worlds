// The words of krypton's hands room ("Can a noble gas hold hands?"), in English, European Portuguese,
// Polish and German, kid (Explorer) and sci (Scientist). The picture's own story stays in
// src/content/boards/Kr.js (the easel shows it); the room adds the things to do.
// Sources and what is flagged: krypton difluoride, 1963 (one early report, Grosse and coworkers at Temple
// University's Research Institute, took it for KrF4); a colourless volatile solid, linear F-Kr-F with a
// three-centre, four-electron bond, stable at -78 C, decomposing about 10% an hour at room temperature;
// 7 KrF2 + 2 Au -> 2 [KrF]+[AuF6]- + 5 Kr (Lehmann, Zemva and Bartlett; the room states the equation only,
// not the conditions). The second table: first ionisation energies and van der Waals radii from
// src/data/elements.json (He 24.59, Ne 21.56, Ar 15.76, Kr 14.00, Xe 12.13, Rn 10.75 eV); Bartlett's
// xenon hexafluoroplatinate 1962; HArF (Khriachtchev and coworkers, Nature 2000: made at about 8 K in
// solid argon, stable up to about 27 K; unsure of the exact kelvins, the words say "about"); radon
// fluoride reported 1962 (Fields, Stein, Zirin: not checked at the source); helium's only compounds (Na2He
// above about 113 GPa, Dong and coworkers, 2017: said as "over a million atmospheres"); neon: no stable
// neutral compound, ions such as NeH+ in the gas. The laser: KrF excimer, 248 nm, a few nanoseconds in the
// excited state, a repulsive ground state, a neon buffer gas; reducing 4x lenses; 248 nm lithography
// printed the 250 nm to 130 nm generations from the late 1990s; production lasers fire about 4000 to
// 6000 pulses a second; the Nike laser at the US Naval Research Laboratory is a KrF laser.
export const HANDS_WORDS = {
  en: {
    title: 'A laboratory in 1963',
    greet: {
      kid: 'We are inside the picture: a chemistry laboratory in 1963, the year krypton first held hands with another atom. Through the doorway at the back is a laser room, where krypton and fluorine hold hands for a flash. The picture\'s story is on the easel beside you.',
      sci: 'A chemistry laboratory of 1963, the year the first krypton compound was made: a vacuum line, cylinders of krypton and fluorine, liquid nitrogen, a UV lamp. At the back right, a doorway onto a KrF excimer laser room. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'My outer shell of electrons is full, so I almost never join another atom. For decades chemists called us the "inert" gases.',
        'Fluorine is the greediest atom of all: it pulls on electrons harder than any other. It is the one atom that can tug on a krypton.',
        'The crystals only live in the cold. At room temperature they fall apart and let go, and on the way they are fierce enough to eat gold.',
        'A laser room is the opposite of a freezer: krypton and fluorine join for a few billionths of a second, and the flash they give out prints computer chips.',
      ],
      sci: [
        'Bartlett\'s xenon hexafluoroplatinate of 1962 broke the rule that noble gases form no compounds; krypton followed in 1963 with KrF2.',
        'Fluorine is the most electronegative element (3.98 on the Pauling scale). Krypton, first ionisation energy 14.00 eV, is the lightest noble gas that gives a compound you can keep in a flask, cold.',
        'KrF2 is formed with energy put in (its enthalpy of formation is positive), which is why it is such a powerful fluorinating agent, and why the solid has to be kept cold.',
        'The excimer KrF* has no stable ground state: it is bound only while excited. Its lower state falls apart at once, so keeping more atoms in the upper state than the lower, which a laser needs, comes easily.',
      ],
    },
    make: {
      label: 'The cold bulb',
      title: 'Making krypton difluoride',
      tags: { ln2: 'liquid nitrogen', ice: 'dry ice', air: 'in the room', lamp: 'UV lamp', gold: 'gold leaf', lens: 'lens' },
      hints: {
        kr: 'Tap the krypton cylinder',
        f2: 'Tap the fluorine cylinder',
        cool: 'Chill the bulb by tapping the liquid nitrogen',
        lamp: 'Tap the UV lamp',
        wait: 'Watch the bulb',
        melting: 'Watch the crystals fall apart, or tap the liquid nitrogen',
        keeps: 'Tap the gold leaf, or tap the bulb to lift it out',
        lift: 'Tap the bulb to lift it out into the room',
      },
      slider: 'Temperature of the bulb',
      buttons: { kr: 'Let krypton in', f2: 'Let fluorine in', lamp: 'Switch the UV lamp on', gold: 'Dip the gold leaf', newGold: 'New gold leaf', reset: 'Empty the bulb' },
      says: {
        kr: {
          kid: 'The valve opens and krypton gas runs down the pipe into the quartz bulb. On its own it just sits there: krypton does not react with anything by itself.',
          sci: 'Krypton flows from its cylinder through the nickel pipe into the quartz bulb. On its own it stays a monatomic gas.',
        },
        f2: {
          kid: 'Now fluorine, a pale yellow-green gas that attacks almost everything. That is why it lives in a ventilated cabinet and runs through nickel pipes.',
          sci: 'Fluorine, F2, a pale yellow gas that attacks glass, most metals and nearly everything else: hence the ventilated cabinet and the nickel line, which a skin of nickel fluoride protects.',
        },
        dewar: {
          kid: 'The bulb goes into liquid nitrogen, about −196 °C. That is cold enough for the crystals to keep.',
          sci: 'In liquid nitrogen, −196 °C: far below the −78 °C at which KrF2 keeps.',
        },
        ice: {
          kid: 'Dry ice, about −78 °C. Still cold enough for the crystals to keep.',
          sci: 'Dry ice, −78 °C: the temperature at which solid KrF2 can be kept.',
        },
        air: {
          kid: 'Out in the room, about 25 °C. That is far too warm for crystals to last.',
          sci: 'At 25 °C: too warm for KrF2 to last, so nothing to keep here.',
        },
        melt: {
          kid: 'Out in the room the crystals start to fall apart, back into krypton and fluorine. This is sped up: one second here is half an hour.',
          sci: 'At 25 °C KrF2 decomposes into Kr and F2, about 10% an hour (one second here is half an hour).',
        },
        noKr: {
          kid: 'Nothing to zap yet: there is no krypton in the bulb. Tap the krypton cylinder first.',
          sci: 'The lamp needs both gases in the bulb, and krypton is still missing.',
        },
        noF2: {
          kid: 'Nothing to zap yet: there is no fluorine in the bulb. Tap the fluorine cylinder first.',
          sci: 'The lamp needs both gases in the bulb, and fluorine is still missing.',
        },
        warmLamp: {
          kid: 'The lamp is on, but the bulb is too warm and nothing sticks. Chill it in the liquid nitrogen first!',
          sci: 'UV on, but while the bulb is warm the product falls apart as fast as it forms. Chill it first.',
        },
        lamp: {
          kid: 'The ultraviolet light splits fluorine molecules into single fluorine atoms. They grab krypton, and colourless crystals start to grow on the cold glass!',
          sci: 'UV splits F2 into F atoms, which attack krypton: KrF2 deposits on the cold wall. (An electric discharge through the cold gases works too.)',
        },
        grow: {
          kid: 'Crystals! Colourless, like ice. A noble gas has joined another atom, here on this bench. Look through the lens at what they are made of.',
          sci: 'Colourless KrF2 crystals are growing on the wall. The lens shows the linear F-Kr-F molecules packed in the crystal.',
        },
        done: {
          kid: 'The bulb is full of crystals. Now try the gold leaf, or lift the bulb out into the room.',
          sci: 'The gases are used up: KrF2 on the wall. Gold leaf tests its oxidising power; warming tests its stability.',
        },
        gone: {
          kid: 'The crystals have gone: krypton and fluorine are loose gases again.',
          sci: 'Fully decomposed: Kr and F2 gas again.',
        },
        noGold: {
          kid: 'Make some crystals first: the gold leaf needs something fierce to attack it.',
          sci: 'There is no KrF2 in the bulb yet to oxidise the gold.',
        },
        gold: {
          kid: 'The gold leaf goes in and the crystals eat it! Gold hardly reacts with anything, but krypton difluoride is fiercer. Krypton gas is set free.',
          sci: 'KrF2 oxidises gold: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr, gold in the +5 state. Krypton is released.',
        },
        lens: {
          kid: 'Each molecule has a krypton in the middle and a fluorine on each side, in a straight line: F-Kr-F. Krypton holds two hands.',
          sci: 'KrF2 is linear, F-Kr-F, held by a three-centre, four-electron bond.',
        },
        noLens: {
          kid: 'Make some crystals, and this lens shows what they are made of.',
          sci: 'The lens shows the structure of the crystals once there are some.',
        },
      },
      panel: {
        kid: [
          'This is how it was done: put krypton and fluorine gas in a bulb, make it very cold, and add energy as electric sparks or ultraviolet light. Fluorine is the greediest atom there is, so it can pull on krypton\'s electrons even though krypton\'s outer shell is full.',
          'Krypton difluoride only keeps in the cold. Slide the temperature up and the crystals fall apart little by little. At room temperature about a tenth goes every hour; here a second is half an hour, so you can watch.',
          'Try the gold leaf too. Krypton difluoride is fierce enough to eat gold.',
        ],
        sci: [
          'Krypton difluoride was reported in 1963: Kr and F2 held at low temperature, an electric discharge or UV light supplying the energy. A first report (Grosse and coworkers) took the product for KrF4; it is KrF2.',
          'KrF2: linear F-Kr-F, a three-centre, four-electron bond; a colourless volatile solid, kept at −78 °C and decomposing at about 10% an hour at room temperature. Here one second is half an hour, and the rate drops steeply as it cools (a model, not a measurement).',
          'It is among the strongest oxidising agents known and takes gold to its +5 state: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr.',
        ],
      },
    },
    who: {
      label: 'Who will hold hands?',
      title: 'The noble gases and fluorine',
      hints: { start: 'Tap a bulb to offer it fluorine', more: 'Tap another bulb', all: 'Tap a bulb to see it again' },
      boardTitle: { kid: 'The taller the bar, the tighter the atom holds its outer electrons', sci: 'First ionisation energy (eV)' },
      results: { He: 'no compound', Ne: 'no compound', Ar: 'HArF, in ice only', Kr: 'KrF2', Xe: 'XeF2, XeF4, XeF6', Rn: 'RnF2 (radioactive)' },
      says: {
        He: {
          kid: 'Helium has only two electrons and holds them tighter than any other atom. Fluorine bounces off: no helium compound with fluorine has ever been made.',
          sci: 'Helium, 24.59 eV, the highest of all: no fluoride is known. The few helium compounds (Na2He, made at over a million atmospheres in 2017) are no bulb chemistry.',
        },
        Ne: {
          kid: 'Neon is the most stubborn of all. It also holds its electrons very tight, and no neon compound that lasts has ever been made.',
          sci: 'Neon, 21.56 eV: no stable neutral compound is known, only short-lived ions such as NeH+ in a gas.',
        },
        Ar: {
          kid: 'Argon only joined in, in the year 2000, and only in ice colder than −250 °C: chemists in Finland made HArF, hydrogen-argon-fluorine, and it falls apart as the ice warms.',
          sci: 'Argon, 15.76 eV: HArF (Khriachtchev and coworkers, Helsinki, Nature 2000), made in solid argon at about 8 K and stable only up to about 27 K.',
        },
        Kr: {
          kid: 'Krypton takes fluorine, but only in the cold: krypton difluoride, KrF2. It was the first krypton compound, from 1963, the one in the cold bulb.',
          sci: 'Krypton, 14.00 eV: KrF2 (1963), kept cold, the starting point for nearly every other krypton compound.',
        },
        Xe: {
          kid: 'Xenon holds its outer electrons loosely, so it joins fluorine easily. In 1962 Neil Bartlett made the first noble gas compound with xenon. Xenon makes XeF2, XeF4 and XeF6.',
          sci: 'Xenon, 12.13 eV: Bartlett\'s xenon hexafluoroplatinate (1962) was the first, then XeF2, XeF4 and XeF6, which keep at room temperature.',
        },
        Rn: {
          kid: 'Radon holds its electrons most loosely, so it joins fluorine too. But radon is radioactive and vanishes fast, so only tiny amounts have ever been studied.',
          sci: 'Radon, 10.75 eV: fluorine takes it, a fluoride reported in 1962 and still hard to study, since every radon isotope is radioactive (radon-222: 3.8 days).',
        },
        all: {
          kid: 'All six tried! The lower the bar, the easier it is for fluorine to take hold. That is why the heavy ones are the ones that hold hands.',
          sci: 'The ionisation energy falls down the group, from 24.59 to 10.75 eV: the farther the outer electrons are from the nucleus, the easier to oxidise, and the more compounds. Argon needed a frozen matrix.',
        },
      },
      panel: {
        kid: [
          'Each bulb holds one noble gas, drawn at its true size compared with the others: the atoms get bigger down the row. The little lights are its outer electrons.',
          'The bars behind show how hard it is to pull one electron away. Helium, with the tallest bar, holds on hardest. Radon, with the shortest, lets go most easily, which is just what fluorine needs.',
          'Tap a bulb to offer it fluorine and see who holds hands.',
        ],
        sci: [
          'Atoms are drawn at their van der Waals radii (He 140 pm to Rn 220 pm) with their valence electrons (2 for helium, 8 for the others).',
          'The bars are first ionisation energies in eV: He 24.59, Ne 21.56, Ar 15.76, Kr 14.00, Xe 12.13, Rn 10.75. Lower means an outer electron that is easier for fluorine to take: the atom is bigger and the nucleus holds the outer electrons more weakly.',
          'Known fluorides: none for helium or neon; HArF at about 8 K; KrF2; XeF2, XeF4 and XeF6; RnF2.',
        ],
      },
    },
    flash: {
      label: 'The laser room',
      title: 'A molecule that lives for a flash',
      tags: { door: 'LASER ROOM', excimer: 'KrF 248 nm', laser: 'KrF laser', card: 'card', mask: 'mask', lens: 'lens', wafer: 'wafer' },
      hints: {
        laser: 'Tap the laser to fire its discharge',
        card: 'Tap the card to see the beam',
        print: 'Tap the lens to print the mask',
        cardOut: 'Tap the card to take it out of the beam',
        look: 'Watch the wafer fill up, or slow the laser down',
        done: 'Tap the wafer for a new one',
      },
      slider: 'Pulses a second',
      buttons: { laser: 'Fire the laser', laserOff: 'Stop the laser', card: 'Put the card in the beam', cardOut: 'Take the card out', print: 'Print the mask', printOff: 'Stop printing', wafer: 'New wafer' },
      says: {
        on: {
          kid: 'Zap! An electric discharge goes through krypton with a little fluorine. Look at the magnifier: a krypton and a fluorine join for a few billionths of a second, then spring apart with a flash of ultraviolet light. That flash is the laser.',
          sci: 'Discharge on: in the Kr, F2 and neon mixture, excited KrF* forms, lives a few nanoseconds and comes apart (its ground state is repulsive), emitting at 248 nm. Mirrors send the light back and forth through the gas until a pulse leaves. The magnifier slows one cycle down.',
        },
        off: { kid: 'Laser off. The krypton and fluorine let go for good.', sci: 'Laser off: the discharge stops and no more KrF* forms.' },
        card: {
          kid: 'The beam is invisible, because ultraviolet light is, but the card glows blue where it hits. Do you see the flashes?',
          sci: '248 nm light is invisible; the card fluoresces, turning the UV into visible blue wherever the beam crosses it.',
        },
        cardOff: { kid: 'The card is in the beam. Fire the laser and it will glow.', sci: 'The card is in place; it will fluoresce when the laser fires.' },
        cardOut: { kid: 'Card out: the beam goes on to the lens.', sci: 'Card removed: the beam goes on through the mask and the lens.' },
        print: {
          kid: 'The light goes through the mask, which has the pattern of a tiny computer circuit on it, and the lens shrinks it four times onto the silicon wafer. Each square is a new copy.',
          sci: 'The beam crosses the mask (drawn here at four times the printed size) and the lens reduces it 4x onto the wafer, coated with photoresist. Each die takes a few pulses.',
        },
        printOff: { kid: 'The laser is not running. Fire it first.', sci: 'The laser is off, so there is nothing to print with. Fire it first.' },
        printStop: { kid: 'Printing stopped.', sci: 'Printing stopped.' },
        blocked: { kid: 'The card is in the way: the beam never reaches the lens. Take it out.', sci: 'The card blocks the beam. Take it out for the lens to see it.' },
        full: {
          kid: 'A whole wafer of tiny circuits! Real machines print hundreds of chips on one wafer, with thousands of flashes a second.',
          sci: 'A full wafer. Production lasers of this kind fire about 4000 to 6000 pulses a second (here 1 to 20, so you can see them).',
        },
        wafer: { kid: 'A fresh wafer.', sci: 'New wafer.' },
        mask: {
          kid: 'The mask: the pattern of a circuit, four times as big as what is printed on the wafer.',
          sci: 'The mask: the circuit pattern at four times the printed size (4x reduction).',
        },
        ring: {
          kid: 'This is slowed down by about a billion times: krypton and fluorine join, glow, and spring apart with ultraviolet light.',
          sci: 'One cycle of KrF*, hugely slowed down: association, a lifetime of a few nanoseconds, then dissociation with a 248 nm photon.',
        },
      },
      panel: {
        kid: [
          'Inside the glass, electricity gives krypton atoms a push, and they join with fluorine. But this hold lasts only a few billionths of a second: the pair springs apart and gives out a flash of ultraviolet light, 248 nanometres long.',
          'Mirrors send the flashes back and forth through the gas until they grow into a strong beam. You cannot see ultraviolet light, but the card glows in it.',
          'The beam goes through a mask and a lens that shrinks it, and prints tiny circuits onto silicon. Chips made this way were in computers around the year 2000. Slow the laser down to see each flash.',
        ],
        sci: [
          'KrF excimer laser: an electric discharge through a Kr, F2 and Ne mixture makes excited KrF*, which lives a few nanoseconds; its ground state is repulsive, so the molecule comes apart as it emits at 248 nm, and a population inversion comes easily.',
          'Deep-ultraviolet lithography: the mask is imaged by a reducing lens (4x) onto resist-coated silicon, one die per exposure, step by step. KrF lithography at 248 nm printed the 250 nm to 130 nm generations from the late 1990s (ArF at 193 nm followed).',
          'The same molecule drives the Nike laser at the US Naval Research Laboratory, built for fusion research.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Um laboratório em 1963',
    greet: {
      kid: 'Estamos dentro da imagem: um laboratório de química em 1963, o ano em que o crípton deu pela primeira vez a mão a outro átomo. Pela porta ao fundo há uma sala de laser, onde o crípton e o flúor dão as mãos por um clarão. A história da imagem está no cavalete ao teu lado.',
      sci: 'Um laboratório de química de 1963, o ano em que se fez o primeiro composto de crípton: uma linha de vácuo, cilindros de crípton e de flúor, azoto líquido, uma lâmpada UV. Ao fundo, à direita, uma porta para uma sala de laser excímero de KrF. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'A minha camada de eletrões de fora está cheia, por isso quase nunca me junto a outro átomo. Durante décadas, os químicos chamaram-nos gases "inertes".',
        'O flúor é o átomo mais guloso de todos: puxa os eletrões com mais força do que qualquer outro. É o único átomo que consegue dar um puxão a um crípton.',
        'Os cristais só vivem no frio. À temperatura ambiente desfazem-se e largam-se e, pelo caminho, são tão ferozes que comem ouro.',
        'Uma sala de laser é o contrário de um congelador: o crípton e o flúor juntam-se por uns mil-milionésimos de segundo, e o clarão que dão imprime chips de computador.',
      ],
      sci: [
        'O hexafluoroplatinato de xénon de Bartlett, de 1962, quebrou a regra de que os gases nobres não formam compostos; o crípton seguiu-se em 1963 com o KrF2.',
        'O flúor é o elemento mais eletronegativo (3,98 na escala de Pauling). O crípton, com energia de primeira ionização de 14,00 eV, é o gás nobre mais leve que dá um composto que se pode guardar num balão, frio.',
        'O KrF2 forma-se com energia fornecida (a sua entalpia de formação é positiva), e por isso é um agente fluorante tão poderoso e o sólido tem de ser guardado frio.',
        'O excímero KrF* não tem estado fundamental estável: só está ligado enquanto excitado. O seu estado inferior desfaz-se logo, e por isso manter mais átomos no estado superior do que no inferior, o que um laser exige, é fácil.',
      ],
    },
    make: {
      label: 'A ampola fria',
      title: 'Fazer o difluoreto de crípton',
      tags: { ln2: 'azoto líquido', ice: 'gelo seco', air: 'na sala', lamp: 'lâmpada UV', gold: 'folha de ouro', lens: 'lente' },
      hints: {
        kr: 'Toca no cilindro de crípton',
        f2: 'Toca no cilindro de flúor',
        cool: 'Arrefece a ampola tocando no azoto líquido',
        lamp: 'Toca na lâmpada UV',
        wait: 'Observa a ampola',
        melting: 'Vê os cristais desfazerem-se, ou toca no azoto líquido',
        keeps: 'Toca na folha de ouro, ou na ampola para a levantar',
        lift: 'Toca na ampola para a levantar para a sala',
      },
      slider: 'Temperatura da ampola',
      buttons: { kr: 'Deixar entrar crípton', f2: 'Deixar entrar flúor', lamp: 'Ligar a lâmpada UV', gold: 'Mergulhar a folha de ouro', newGold: 'Nova folha de ouro', reset: 'Esvaziar a ampola' },
      says: {
        kr: {
          kid: 'A válvula abre-se e o gás crípton corre pelo tubo até à ampola de quartzo. Sozinho, fica ali parado: o crípton não reage com nada por si só.',
          sci: 'O crípton flui do cilindro, pelo tubo de níquel, até à ampola de quartzo. Sozinho continua a ser um gás monoatómico.',
        },
        f2: {
          kid: 'Agora o flúor, um gás amarelo-esverdeado pálido que ataca quase tudo. Por isso vive num armário ventilado e corre por tubos de níquel.',
          sci: 'O flúor, F2, um gás amarelo pálido que ataca o vidro, a maioria dos metais e quase tudo o resto: daí o armário ventilado e a linha de níquel, protegida por uma película de fluoreto de níquel.',
        },
        dewar: {
          kid: 'A ampola vai para o azoto líquido, a cerca de −196 °C. É frio que chegue para os cristais se conservarem.',
          sci: 'No azoto líquido, a −196 °C: muito abaixo dos −78 °C a que o KrF2 se conserva.',
        },
        ice: {
          kid: 'Gelo seco, a cerca de −78 °C. Ainda é frio que chegue para os cristais se conservarem.',
          sci: 'Gelo seco, −78 °C: a temperatura a que o KrF2 sólido se pode conservar.',
        },
        air: {
          kid: 'Cá fora, na sala, a cerca de 25 °C. É quente demais para os cristais durarem.',
          sci: 'A 25 °C: quente demais para o KrF2 durar, por isso não há nada a conservar.',
        },
        melt: {
          kid: 'Cá fora, os cristais começam a desfazer-se, voltando a crípton e flúor. Isto está acelerado: um segundo aqui é meia hora.',
          sci: 'A 25 °C o KrF2 decompõe-se em Kr e F2, cerca de 10% por hora (um segundo aqui é meia hora).',
        },
        noKr: {
          kid: 'Ainda não há nada para acender: não há crípton na ampola. Toca primeiro no cilindro de crípton.',
          sci: 'A lâmpada precisa dos dois gases na ampola, e falta o crípton.',
        },
        noF2: {
          kid: 'Ainda não há nada para acender: não há flúor na ampola. Toca primeiro no cilindro de flúor.',
          sci: 'A lâmpada precisa dos dois gases na ampola, e falta o flúor.',
        },
        warmLamp: {
          kid: 'A lâmpada está ligada, mas a ampola está quente demais e nada se agarra. Arrefece-a primeiro no azoto líquido!',
          sci: 'UV ligada, mas com a ampola quente o produto desfaz-se tão depressa como se forma. Arrefece-a primeiro.',
        },
        lamp: {
          kid: 'A luz ultravioleta parte as moléculas de flúor em átomos de flúor soltos. Eles agarram o crípton, e começam a crescer cristais incolores no vidro frio!',
          sci: 'A luz UV parte o F2 em átomos de F, que atacam o crípton: o KrF2 deposita-se na parede fria. (Uma descarga elétrica através dos gases frios também resulta.)',
        },
        grow: {
          kid: 'Cristais! Incolores, como gelo. Um gás nobre juntou-se a outro átomo, aqui nesta bancada. Espreita pela lente para ver de que são feitos.',
          sci: 'Estão a crescer cristais incolores de KrF2 na parede. A lente mostra as moléculas lineares F-Kr-F empacotadas no cristal.',
        },
        done: {
          kid: 'A ampola está cheia de cristais. Experimenta agora a folha de ouro, ou levanta a ampola para a sala.',
          sci: 'Os gases esgotaram-se: KrF2 na parede. A folha de ouro testa o seu poder oxidante; aquecê-lo testa a sua estabilidade.',
        },
        gone: {
          kid: 'Os cristais desapareceram: o crípton e o flúor voltaram a ser gases soltos.',
          sci: 'Decomposição completa: voltou a haver Kr e F2 gasosos.',
        },
        noGold: {
          kid: 'Faz primeiro uns cristais: a folha de ouro precisa de algo feroz que a ataque.',
          sci: 'Ainda não há KrF2 na ampola para oxidar o ouro.',
        },
        gold: {
          kid: 'A folha de ouro entra e os cristais comem-na! O ouro quase não reage com nada, mas o difluoreto de crípton é mais feroz. O gás crípton fica livre.',
          sci: 'O KrF2 oxida o ouro: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr, com o ouro no estado +5. O crípton é libertado.',
        },
        lens: {
          kid: 'Cada molécula tem um crípton no meio e um flúor de cada lado, em linha reta: F-Kr-F. O crípton segura duas mãos.',
          sci: 'O KrF2 é linear, F-Kr-F, mantido por uma ligação de três centros e quatro eletrões.',
        },
        noLens: {
          kid: 'Faz uns cristais, e esta lente mostra de que são feitos.',
          sci: 'A lente mostra a estrutura dos cristais, quando os houver.',
        },
      },
      panel: {
        kid: [
          'Foi assim que se fez: pôr gás crípton e gás flúor numa ampola, arrefecê-la muito e dar-lhes energia, com faíscas elétricas ou luz ultravioleta. O flúor é o átomo mais guloso que existe, por isso consegue puxar os eletrões do crípton, mesmo com a camada de fora do crípton cheia.',
          'O difluoreto de crípton só se conserva no frio. Sobe a temperatura e os cristais desfazem-se aos poucos. À temperatura ambiente vai-se cerca de um décimo por hora; aqui um segundo é meia hora, para poderes ver.',
          'Experimenta também a folha de ouro. O difluoreto de crípton é feroz ao ponto de comer ouro.',
        ],
        sci: [
          'O difluoreto de crípton foi relatado em 1963: Kr e F2 mantidos a baixa temperatura, com uma descarga elétrica ou luz UV a fornecer a energia. Um primeiro relato (Grosse e colaboradores) tomou o produto por KrF4; é KrF2.',
          'KrF2: linear F-Kr-F, ligação de três centros e quatro eletrões; sólido incolor e volátil, conservado a −78 °C e a decompor-se cerca de 10% por hora à temperatura ambiente. Aqui um segundo é meia hora, e a velocidade cai muito ao arrefecer (um modelo, não uma medição).',
          'Está entre os oxidantes mais fortes que se conhecem e leva o ouro ao estado +5: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr.',
        ],
      },
    },
    who: {
      label: 'Quem dá as mãos?',
      title: 'Os gases nobres e o flúor',
      hints: { start: 'Toca numa ampola para lhe oferecer flúor', more: 'Toca noutra ampola', all: 'Toca numa ampola para a ver outra vez' },
      boardTitle: { kid: 'Quanto mais alta a barra, mais força o átomo faz para agarrar os eletrões de fora', sci: 'Primeira energia de ionização (eV)' },
      results: { He: 'sem composto', Ne: 'sem composto', Ar: 'HArF, só em gelo', Kr: 'KrF2', Xe: 'XeF2, XeF4, XeF6', Rn: 'RnF2 (radioativo)' },
      says: {
        He: {
          kid: 'O hélio só tem dois eletrões e agarra-os com mais força do que qualquer outro átomo. O flúor ressalta: nunca se fez nenhum composto de hélio com flúor.',
          sci: 'Hélio, 24,59 eV, o valor mais alto de todos: não se conhece nenhum fluoreto. Os poucos compostos de hélio (Na2He, feito a mais de um milhão de atmosferas em 2017) não são química de ampola.',
        },
        Ne: {
          kid: 'O néon é o mais teimoso de todos. Também agarra os eletrões com muita força, e nunca se fez nenhum composto de néon que dure.',
          sci: 'Néon, 21,56 eV: não se conhece nenhum composto neutro estável, só iões de vida curta, como o NeH+, num gás.',
        },
        Ar: {
          kid: 'O árgon só alinhou no ano 2000, e só em gelo mais frio do que −250 °C: uns químicos na Finlândia fizeram HArF, hidrogénio-árgon-flúor, que se desfaz quando o gelo aquece.',
          sci: 'Árgon, 15,76 eV: HArF (Khriachtchev e colaboradores, Helsínquia, Nature 2000), feito em árgon sólido a cerca de 8 K e estável só até cerca de 27 K.',
        },
        Kr: {
          kid: 'O crípton aceita o flúor, mas só no frio: difluoreto de crípton, KrF2. Foi o primeiro composto de crípton, de 1963, o da ampola fria.',
          sci: 'Crípton, 14,00 eV: KrF2 (1963), conservado frio, ponto de partida de quase todos os outros compostos de crípton.',
        },
        Xe: {
          kid: 'O xénon segura mal os eletrões de fora, por isso junta-se ao flúor com facilidade. Em 1962, Neil Bartlett fez com xénon o primeiro composto de um gás nobre. O xénon faz XeF2, XeF4 e XeF6.',
          sci: 'Xénon, 12,13 eV: o hexafluoroplatinato de xénon de Bartlett (1962) foi o primeiro, depois XeF2, XeF4 e XeF6, que se conservam à temperatura ambiente.',
        },
        Rn: {
          kid: 'O rádon é quem segura pior os eletrões, por isso também se junta ao flúor. Mas o rádon é radioativo e desaparece depressa, por isso só se estudaram quantidades minúsculas.',
          sci: 'Rádon, 10,75 eV: o flúor apodera-se dele, um fluoreto relatado em 1962 e ainda difícil de estudar, pois todos os isótopos do rádon são radioativos (rádon-222: 3,8 dias).',
        },
        all: {
          kid: 'Experimentaste os seis! Quanto mais baixa a barra, mais fácil é ao flúor agarrar. Por isso são os pesados que dão as mãos.',
          sci: 'A energia de ionização desce ao longo do grupo, de 24,59 a 10,75 eV: quanto mais longe do núcleo estão os eletrões de fora, mais fácil é oxidá-lo, e mais compostos forma. O árgon precisou de uma matriz congelada.',
        },
      },
      panel: {
        kid: [
          'Cada ampola tem um gás nobre, desenhado ao seu tamanho verdadeiro em comparação com os outros: os átomos vão ficando maiores ao longo da fila. As luzinhas são os eletrões de fora.',
          'As barras atrás mostram a dificuldade de arrancar um eletrão. O hélio, com a barra mais alta, é o que agarra com mais força. O rádon, com a mais baixa, larga com mais facilidade, que é exatamente o que o flúor quer.',
          'Toca numa ampola para lhe oferecer flúor e ver quem dá as mãos.',
        ],
        sci: [
          'Os átomos estão desenhados com os seus raios de van der Waals (He 140 pm a Rn 220 pm) e os seus eletrões de valência (2 no hélio, 8 nos outros).',
          'As barras são as primeiras energias de ionização em eV: He 24,59, Ne 21,56, Ar 15,76, Kr 14,00, Xe 12,13, Rn 10,75. Mais baixa quer dizer um eletrão de fora mais fácil de tirar ao flúor: o átomo é maior e o núcleo segura pior os eletrões de fora.',
          'Fluoretos conhecidos: nenhum de hélio ou néon; HArF a cerca de 8 K; KrF2; XeF2, XeF4 e XeF6; RnF2.',
        ],
      },
    },
    flash: {
      label: 'A sala do laser',
      title: 'Uma molécula que vive um clarão',
      tags: { door: 'SALA DO LASER', excimer: 'KrF 248 nm', laser: 'laser de KrF', card: 'cartão', mask: 'máscara', lens: 'lente', wafer: 'wafer' },
      hints: {
        laser: 'Toca no laser para disparar a descarga',
        card: 'Toca no cartão para ver o feixe',
        print: 'Toca na lente para imprimir a máscara',
        cardOut: 'Toca no cartão para o tirar do feixe',
        look: 'Vê o wafer a encher-se, ou abranda o laser',
        done: 'Toca no wafer para trocar por um novo',
      },
      slider: 'Pulsos por segundo',
      buttons: { laser: 'Disparar o laser', laserOff: 'Parar o laser', card: 'Pôr o cartão no feixe', cardOut: 'Tirar o cartão', print: 'Imprimir a máscara', printOff: 'Parar a impressão', wafer: 'Novo wafer' },
      says: {
        on: {
          kid: 'Zás! Uma descarga elétrica atravessa o crípton com um pouco de flúor. Olha para a lupa: um crípton e um flúor juntam-se por uns mil-milionésimos de segundo e depois separam-se de repente com um clarão de luz ultravioleta. Esse clarão é o laser.',
          sci: 'Descarga ligada: na mistura de Kr, F2 e néon forma-se KrF* excitado, que vive uns nanossegundos e se desfaz (o estado fundamental é repulsivo), emitindo a 248 nm. Espelhos mandam a luz para trás e para a frente no gás até sair um pulso. A lupa abranda um ciclo.',
        },
        off: { kid: 'Laser desligado. O crípton e o flúor largam-se de vez.', sci: 'Laser desligado: a descarga pára e deixa de se formar KrF*.' },
        card: {
          kid: 'O feixe é invisível, porque a luz ultravioleta é invisível, mas o cartão brilha em azul onde ela bate. Vês os clarões?',
          sci: 'A luz de 248 nm é invisível; o cartão é fluorescente e converte o UV em azul visível onde o feixe o atravessa.',
        },
        cardOff: { kid: 'O cartão está no feixe. Dispara o laser e ele vai brilhar.', sci: 'O cartão está no sítio; fluoresce quando o laser disparar.' },
        cardOut: { kid: 'Cartão fora: o feixe segue para a lente.', sci: 'Cartão retirado: o feixe segue pela máscara e pela lente.' },
        print: {
          kid: 'A luz atravessa a máscara, que tem o desenho de um circuito de computador minúsculo, e a lente encolhe-o quatro vezes sobre o wafer de silício. Cada quadrado é uma cópia nova.',
          sci: 'O feixe atravessa a máscara (aqui desenhada com quatro vezes o tamanho impresso) e a lente reduz 4x sobre o wafer, revestido de fotorresina. Cada chip leva alguns pulsos.',
        },
        printOff: { kid: 'O laser não está a funcionar. Dispara-o primeiro.', sci: 'O laser está desligado, por isso não há com que imprimir. Dispara-o primeiro.' },
        printStop: { kid: 'Impressão parada.', sci: 'Impressão parada.' },
        blocked: { kid: 'O cartão está no caminho: o feixe nunca chega à lente. Tira-o.', sci: 'O cartão bloqueia o feixe. Tira-o para a lente o receber.' },
        full: {
          kid: 'Um wafer inteiro de circuitos minúsculos! As máquinas a sério imprimem centenas de chips num wafer, com milhares de clarões por segundo.',
          sci: 'Um wafer completo. Os lasers de produção deste tipo disparam cerca de 4000 a 6000 pulsos por segundo (aqui 1 a 20, para os poderes ver).',
        },
        wafer: { kid: 'Um wafer novo.', sci: 'Wafer novo.' },
        mask: {
          kid: 'A máscara: o desenho de um circuito, quatro vezes maior do que o que fica impresso no wafer.',
          sci: 'A máscara: o desenho do circuito com quatro vezes o tamanho impresso (redução de 4x).',
        },
        ring: {
          kid: 'Isto está abrandado cerca de mil milhões de vezes: o crípton e o flúor juntam-se, brilham e separam-se de repente com luz ultravioleta.',
          sci: 'Um ciclo de KrF*, muitíssimo abrandado: associação, um tempo de vida de uns nanossegundos e dissociação com um fotão de 248 nm.',
        },
      },
      panel: {
        kid: [
          'Dentro do vidro, a eletricidade dá um empurrão aos átomos de crípton, e eles juntam-se ao flúor. Mas este aperto de mão só dura uns mil-milionésimos de segundo: o par separa-se e solta um clarão de luz ultravioleta, de 248 nanómetros.',
          'Espelhos mandam os clarões para trás e para a frente no gás até crescerem num feixe forte. Não se vê a luz ultravioleta, mas o cartão brilha com ela.',
          'O feixe atravessa uma máscara e uma lente que o encolhe, e imprime circuitos minúsculos no silício. Chips feitos assim estavam nos computadores por volta do ano 2000. Abranda o laser para veres cada clarão.',
        ],
        sci: [
          'Laser excímero de KrF: uma descarga elétrica numa mistura de Kr, F2 e Ne forma KrF* excitado, que vive uns nanossegundos; o estado fundamental é repulsivo, por isso a molécula desfaz-se ao emitir a 248 nm, e a inversão de população surge com facilidade.',
          'Litografia no ultravioleta profundo: a máscara é projetada por uma lente redutora (4x) sobre silício revestido de resina, um chip por exposição, passo a passo. A litografia de KrF a 248 nm imprimiu as gerações de 250 nm a 130 nm a partir do fim da década de 1990 (seguiu-se o ArF a 193 nm).',
          'A mesma molécula move o laser Nike do US Naval Research Laboratory, construído para a investigação da fusão.',
        ],
      },
    },
  },
  pl: {
    title: 'Laboratorium w 1963 roku',
    greet: {
      kid: 'Jesteśmy w środku obrazu: laboratorium chemicznego w 1963 roku, w którym krypton po raz pierwszy podał rękę innemu atomowi. Za drzwiami w głębi jest pracownia laserowa, gdzie krypton i fluor trzymają się za ręce na czas jednego błysku. Historia obrazu jest na sztalugach obok.',
      sci: 'Laboratorium chemiczne z 1963 roku, kiedy otrzymano pierwszy związek kryptonu: linia próżniowa, butle z kryptonem i fluorem, ciekły azot, lampa UV. W głębi po prawej drzwi do pracowni lasera ekscymerowego KrF. Historia obrazu jest na sztalugach.',
    },
    talk: {
      kid: [
        'Moja zewnętrzna powłoka elektronowa jest pełna, więc prawie nigdy nie łączę się z innym atomem. Przez dziesiątki lat chemicy nazywali nas gazami „obojętnymi".',
        'Fluor jest najbardziej łakomym atomem ze wszystkich: przyciąga elektrony mocniej niż jakikolwiek inny. To jedyny atom, który potrafi pociągnąć krypton.',
        'Kryształy żyją tylko w zimnie. W temperaturze pokojowej rozpadają się i puszczają, a przy tym są tak gwałtowne, że zjadają złoto.',
        'Pracownia laserowa to przeciwieństwo zamrażarki: krypton i fluor łączą się na kilka miliardowych części sekundy, a błysk, który dają, drukuje układy scalone.',
      ],
      sci: [
        'Heksafluoroplatynian ksenonu Bartletta z 1962 roku złamał regułę, że gazy szlachetne nie tworzą związków; krypton poszedł w 1963 roku z KrF2.',
        'Fluor jest najbardziej elektroujemnym pierwiastkiem (3,98 w skali Paulinga). Krypton, o pierwszej energii jonizacji 14,00 eV, to najlżejszy gaz szlachetny dający związek, który można przechowywać w kolbie, w chłodzie.',
        'KrF2 powstaje przy dostarczeniu energii (jego entalpia tworzenia jest dodatnia), dlatego jest tak silnym środkiem fluorującym, i dlatego ciało stałe trzeba trzymać w chłodzie.',
        'Ekscymer KrF* nie ma trwałego stanu podstawowego: jest związany tylko w stanie wzbudzonym. Jego stan niższy rozpada się natychmiast, więc utrzymanie większej liczby atomów w stanie wyższym niż w niższym, czego potrzebuje laser, przychodzi łatwo.',
      ],
    },
    make: {
      label: 'Zimna bańka',
      title: 'Jak otrzymać difluorek kryptonu',
      tags: { ln2: 'ciekły azot', ice: 'suchy lód', air: 'w pokoju', lamp: 'lampa UV', gold: 'płatek złota', lens: 'soczewka' },
      hints: {
        kr: 'Dotknij butli z kryptonem',
        f2: 'Dotknij butli z fluorem',
        cool: 'Ochłodź bańkę, dotykając ciekłego azotu',
        lamp: 'Dotknij lampy UV',
        wait: 'Patrz na bańkę',
        melting: 'Patrz, jak kryształy się rozpadają, albo dotknij ciekłego azotu',
        keeps: 'Dotknij płatka złota albo bańki, żeby ją wyjąć',
        lift: 'Dotknij bańki, żeby wynieść ją do pokoju',
      },
      slider: 'Temperatura bańki',
      buttons: { kr: 'Wpuść krypton', f2: 'Wpuść fluor', lamp: 'Włącz lampę UV', gold: 'Zanurz płatek złota', newGold: 'Nowy płatek złota', reset: 'Opróżnij bańkę' },
      says: {
        kr: {
          kid: 'Zawór się otwiera i gazowy krypton płynie rurą do kwarcowej bańki. Sam z siebie tylko tam siedzi: krypton z niczym nie reaguje.',
          sci: 'Krypton płynie z butli niklową rurą do kwarcowej bańki. Sam pozostaje gazem jednoatomowym.',
        },
        f2: {
          kid: 'Teraz fluor, bladożółtozielony gaz, który atakuje prawie wszystko. Dlatego trzyma się go w wentylowanej szafie i puszcza niklowymi rurami.',
          sci: 'Fluor, F2, bladożółty gaz atakujący szkło, większość metali i prawie wszystko inne: stąd wentylowana szafa i niklowa linia, chroniona warstewką fluorku niklu.',
        },
        dewar: {
          kid: 'Bańka trafia do ciekłego azotu, około −196 °C. To dość zimno, żeby kryształy przetrwały.',
          sci: 'W ciekłym azocie, −196 °C: daleko poniżej −78 °C, w których KrF2 daje się przechowywać.',
        },
        ice: {
          kid: 'Suchy lód, około −78 °C. Nadal dość zimno, żeby kryształy przetrwały.',
          sci: 'Suchy lód, −78 °C: temperatura, w której stały KrF2 daje się przechowywać.',
        },
        air: {
          kid: 'W pokoju jest około 25 °C. To za ciepło, żeby kryształy przetrwały.',
          sci: 'W 25 °C: za ciepło dla trwałości KrF2, więc nie ma czego przechowywać.',
        },
        melt: {
          kid: 'W pokoju kryształy zaczynają się rozpadać z powrotem na krypton i fluor. To przyspieszone: jedna sekunda tutaj to pół godziny.',
          sci: 'W 25 °C KrF2 rozkłada się na Kr i F2, około 10% na godzinę (jedna sekunda tutaj to pół godziny).',
        },
        noKr: {
          kid: 'Nie ma jeszcze czego rozświetlać: w bańce nie ma kryptonu. Najpierw dotknij butli z kryptonem.',
          sci: 'Lampa potrzebuje obu gazów w bańce, a brakuje kryptonu.',
        },
        noF2: {
          kid: 'Nie ma jeszcze czego rozświetlać: w bańce nie ma fluoru. Najpierw dotknij butli z fluorem.',
          sci: 'Lampa potrzebuje obu gazów w bańce, a brakuje fluoru.',
        },
        warmLamp: {
          kid: 'Lampa świeci, ale bańka jest za ciepła i nic się nie trzyma. Najpierw ochłodź ją w ciekłym azocie!',
          sci: 'UV włączone, ale gdy bańka jest ciepła, produkt rozpada się tak szybko, jak powstaje. Najpierw ją ochłodź.',
        },
        lamp: {
          kid: 'Światło ultrafioletowe rozrywa cząsteczki fluoru na pojedyncze atomy fluoru. Chwytają one krypton i na zimnym szkle zaczynają rosnąć bezbarwne kryształy!',
          sci: 'UV rozszczepia F2 na atomy F, które atakują krypton: KrF2 osadza się na zimnej ściance. (Wyładowanie elektryczne w zimnych gazach też działa.)',
        },
        grow: {
          kid: 'Kryształy! Bezbarwne jak lód. Gaz szlachetny połączył się z innym atomem, tu, na tym stole. Zajrzyj przez soczewkę, z czego są zrobione.',
          sci: 'Na ściance rosną bezbarwne kryształy KrF2. Soczewka pokazuje liniowe cząsteczki F-Kr-F ułożone w krysztale.',
        },
        done: {
          kid: 'Bańka jest pełna kryształów. Teraz spróbuj płatka złota albo wynieś bańkę do pokoju.',
          sci: 'Gazy zużyte: KrF2 na ściance. Płatek złota sprawdza jego moc utleniającą, ogrzanie jego trwałość.',
        },
        gone: {
          kid: 'Kryształy zniknęły: krypton i fluor znów są luźnymi gazami.',
          sci: 'Rozkład całkowity: znów gazowe Kr i F2.',
        },
        noGold: {
          kid: 'Najpierw zrób trochę kryształów: płatek złota potrzebuje czegoś gwałtownego, co go zaatakuje.',
          sci: 'W bańce nie ma jeszcze KrF2, który mógłby utlenić złoto.',
        },
        gold: {
          kid: 'Płatek złota wpada do środka, a kryształy go zjadają! Złoto prawie z niczym nie reaguje, ale difluorek kryptonu jest gwałtowniejszy. Krypton zostaje uwolniony.',
          sci: 'KrF2 utlenia złoto: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr, złoto na stopniu +5. Krypton zostaje uwolniony.',
        },
        lens: {
          kid: 'Każda cząsteczka ma krypton pośrodku i po fluorze z każdej strony, w jednej linii: F-Kr-F. Krypton trzyma dwie ręce.',
          sci: 'KrF2 jest liniowy, F-Kr-F, utrzymywany wiązaniem trójcentrowym czteroelektronowym.',
        },
        noLens: {
          kid: 'Zrób trochę kryształów, a ta soczewka pokaże, z czego są zrobione.',
          sci: 'Soczewka pokaże budowę kryształów, gdy już jakieś będą.',
        },
      },
      panel: {
        kid: [
          'Tak to zrobiono: wpuść do bańki gazowy krypton i fluor, bardzo je ochłodź i dodaj energii, w postaci iskier elektrycznych albo światła ultrafioletowego. Fluor jest najbardziej łakomym atomem, więc potrafi ciągnąć elektrony kryptonu, chociaż zewnętrzna powłoka kryptonu jest pełna.',
          'Difluorek kryptonu przetrwa tylko w zimnie. Podnieś temperaturę, a kryształy będą się powoli rozpadać. W temperaturze pokojowej ubywa około jednej dziesiątej na godzinę; tu sekunda to pół godziny, żebyś mógł to zobaczyć.',
          'Spróbuj też płatka złota. Difluorek kryptonu jest dość gwałtowny, żeby zjeść złoto.',
        ],
        sci: [
          'Difluorek kryptonu opisano w 1963 roku: Kr i F2 w niskiej temperaturze, energię dostarczało wyładowanie elektryczne lub światło UV. Pierwszy raport (Grosse i współpracownicy) wziął produkt za KrF4; to KrF2.',
          'KrF2: liniowy F-Kr-F, wiązanie trójcentrowe czteroelektronowe; bezbarwne, lotne ciało stałe, przechowywane w −78 °C, rozkładające się w temperaturze pokojowej o około 10% na godzinę. Tu jedna sekunda to pół godziny, a szybkość gwałtownie maleje przy ochładzaniu (model, nie pomiar).',
          'Należy do najsilniejszych znanych utleniaczy i utlenia złoto do stopnia +5: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr.',
        ],
      },
    },
    who: {
      label: 'Kto poda rękę?',
      title: 'Gazy szlachetne i fluor',
      hints: { start: 'Dotknij bańki, żeby podać jej fluor', more: 'Dotknij innej bańki', all: 'Dotknij bańki, żeby zobaczyć ją jeszcze raz' },
      boardTitle: { kid: 'Im wyższy słupek, tym mocniej atom trzyma swoje zewnętrzne elektrony', sci: 'Pierwsza energia jonizacji (eV)' },
      results: { He: 'brak związku', Ne: 'brak związku', Ar: 'HArF, tylko w lodzie', Kr: 'KrF2', Xe: 'XeF2, XeF4, XeF6', Rn: 'RnF2 (promieniotwórczy)' },
      says: {
        He: {
          kid: 'Hel ma tylko dwa elektrony i trzyma je mocniej niż jakikolwiek inny atom. Fluor odbija się: nigdy nie otrzymano związku helu z fluorem.',
          sci: 'Hel, 24,59 eV, najwięcej ze wszystkich: nie znamy żadnego fluorku. Nieliczne związki helu (Na2He, otrzymany w 2017 roku pod ciśnieniem ponad miliona atmosfer) to nie chemia w bańce.',
        },
        Ne: {
          kid: 'Neon jest najbardziej uparty ze wszystkich. Też bardzo mocno trzyma elektrony i nigdy nie otrzymano żadnego trwałego związku neonu.',
          sci: 'Neon, 21,56 eV: nie znamy żadnego trwałego obojętnego związku, tylko krótko żyjące jony, jak NeH+ w gazie.',
        },
        Ar: {
          kid: 'Argon dołączył dopiero w 2000 roku i tylko w lodzie zimniejszym niż −250 °C: chemicy w Finlandii otrzymali HArF, wodór-argon-fluor, który rozpada się, gdy lód się ogrzewa.',
          sci: 'Argon, 15,76 eV: HArF (Khriachtchev i współpracownicy, Helsinki, Nature 2000), otrzymany w stałym argonie w około 8 K i trwały tylko do około 27 K.',
        },
        Kr: {
          kid: 'Krypton przyjmuje fluor, ale tylko w zimnie: difluorek kryptonu, KrF2. To pierwszy związek kryptonu, z 1963 roku, ten w zimnej bańce.',
          sci: 'Krypton, 14,00 eV: KrF2 (1963), przechowywany w chłodzie, punkt wyjścia prawie wszystkich innych związków kryptonu.',
        },
        Xe: {
          kid: 'Ksenon słabo trzyma zewnętrzne elektrony, więc łatwo łączy się z fluorem. W 1962 roku Neil Bartlett otrzymał z ksenonem pierwszy związek gazu szlachetnego. Ksenon tworzy XeF2, XeF4 i XeF6.',
          sci: 'Ksenon, 12,13 eV: heksafluoroplatynian ksenonu Bartletta (1962) był pierwszy, potem XeF2, XeF4 i XeF6, trwałe w temperaturze pokojowej.',
        },
        Rn: {
          kid: 'Radon najsłabiej trzyma elektrony, więc też łączy się z fluorem. Ale radon jest promieniotwórczy i szybko znika, więc badano tylko maleńkie ilości.',
          sci: 'Radon, 10,75 eV: fluor go chwyta, fluorek opisany w 1962 roku i wciąż trudny do badań, bo każdy izotop radonu jest promieniotwórczy (radon-222: 3,8 doby).',
        },
        all: {
          kid: 'Wszystkie sześć wypróbowane! Im niższy słupek, tym łatwiej fluorowi się uczepić. Dlatego ręce podają te ciężkie.',
          sci: 'Energia jonizacji maleje w dół grupy, od 24,59 do 10,75 eV: im dalej od jądra są zewnętrzne elektrony, tym łatwiej utlenić atom i tym więcej tworzy związków. Argon wymagał zamarzniętej matrycy.',
        },
      },
      panel: {
        kid: [
          'W każdej bańce jest jeden gaz szlachetny, narysowany w prawdziwej wielkości w porównaniu z innymi: atomy rosną wzdłuż rzędu. Małe światełka to ich zewnętrzne elektrony.',
          'Słupki z tyłu pokazują, jak trudno oderwać jeden elektron. Hel, z najwyższym słupkiem, trzyma najmocniej. Radon, z najniższym, puszcza najłatwiej, a tego właśnie potrzebuje fluor.',
          'Dotknij bańki, żeby podać jej fluor i zobaczyć, kto poda rękę.',
        ],
        sci: [
          'Atomy narysowano w promieniach van der Waalsa (He 140 pm do Rn 220 pm) z ich elektronami walencyjnymi (2 dla helu, 8 dla pozostałych).',
          'Słupki to pierwsze energie jonizacji w eV: He 24,59, Ne 21,56, Ar 15,76, Kr 14,00, Xe 12,13, Rn 10,75. Niższa oznacza zewnętrzny elektron łatwiejszy do zabrania przez fluor: atom jest większy, a jądro słabiej trzyma elektrony zewnętrzne.',
          'Znane fluorki: żadnego helu ani neonu; HArF w około 8 K; KrF2; XeF2, XeF4 i XeF6; RnF2.',
        ],
      },
    },
    flash: {
      label: 'Pracownia laserowa',
      title: 'Cząsteczka, która żyje jeden błysk',
      tags: { door: 'PRACOWNIA LASERA', excimer: 'KrF 248 nm', laser: 'laser KrF', card: 'karta', mask: 'maska', lens: 'soczewka', wafer: 'wafel' },
      hints: {
        laser: 'Dotknij lasera, żeby odpalić wyładowanie',
        card: 'Dotknij karty, żeby zobaczyć wiązkę',
        print: 'Dotknij soczewki, żeby wydrukować maskę',
        cardOut: 'Dotknij karty, żeby wyjąć ją z wiązki',
        look: 'Patrz, jak wafel się zapełnia, albo zwolnij laser',
        done: 'Dotknij wafla, żeby dać nowy',
      },
      slider: 'Impulsów na sekundę',
      buttons: { laser: 'Odpal laser', laserOff: 'Zatrzymaj laser', card: 'Włóż kartę w wiązkę', cardOut: 'Wyjmij kartę', print: 'Drukuj maskę', printOff: 'Przestań drukować', wafer: 'Nowy wafel' },
      says: {
        on: {
          kid: 'Bzzt! Wyładowanie elektryczne przechodzi przez krypton z odrobiną fluoru. Spójrz na lupę: krypton i fluor łączą się na kilka miliardowych części sekundy, a potem odskakują od siebie z błyskiem światła ultrafioletowego. Ten błysk to laser.',
          sci: 'Wyładowanie włączone: w mieszaninie Kr, F2 i neonu powstaje wzbudzony KrF*, żyje kilka nanosekund i rozpada się (jego stan podstawowy jest odpychający), emitując 248 nm. Lustra odbijają światło tam i z powrotem w gazie, aż impuls wyjdzie. Lupa spowalnia jeden cykl.',
        },
        off: { kid: 'Laser wyłączony. Krypton i fluor puszczają się na dobre.', sci: 'Laser wyłączony: wyładowanie ustaje i nie powstaje już KrF*.' },
        card: {
          kid: 'Wiązka jest niewidoczna, bo światło ultrafioletowe jest niewidoczne, ale karta świeci na niebiesko tam, gdzie ją trafia. Widzisz błyski?',
          sci: 'Światło 248 nm jest niewidoczne; karta fluoryzuje, zamieniając UV w widzialny błękit tam, gdzie przecina ją wiązka.',
        },
        cardOff: { kid: 'Karta jest w wiązce. Odpal laser, a zaświeci.', sci: 'Karta jest na miejscu; będzie fluoryzować, gdy laser wystrzeli.' },
        cardOut: { kid: 'Karta wyjęta: wiązka biegnie dalej do soczewki.', sci: 'Karta usunięta: wiązka biegnie dalej przez maskę i soczewkę.' },
        print: {
          kid: 'Światło przechodzi przez maskę, na której jest wzór maleńkiego układu elektronicznego, a soczewka zmniejsza go czterokrotnie na krzemowym waflu. Każdy kwadrat to nowa kopia.',
          sci: 'Wiązka przechodzi przez maskę (tu narysowaną w czterokrotnym rozmiarze wydruku), a soczewka zmniejsza ją 4x na waflu pokrytym fotorezystem. Każdy układ potrzebuje kilku impulsów.',
        },
        printOff: { kid: 'Laser nie działa. Najpierw go odpal.', sci: 'Laser jest wyłączony, więc nie ma czym drukować. Najpierw go odpal.' },
        printStop: { kid: 'Drukowanie zatrzymane.', sci: 'Drukowanie zatrzymane.' },
        blocked: { kid: 'Karta stoi na drodze: wiązka nie dociera do soczewki. Wyjmij ją.', sci: 'Karta blokuje wiązkę. Wyjmij ją, żeby soczewka ją dostała.' },
        full: {
          kid: 'Cały wafel maleńkich układów! Prawdziwe maszyny drukują setki chipów na jednym waflu, z tysiącami błysków na sekundę.',
          sci: 'Pełny wafel. Produkcyjne lasery tego typu dają około 4000 do 6000 impulsów na sekundę (tu 1 do 20, żebyś je widział).',
        },
        wafer: { kid: 'Nowy wafel.', sci: 'Nowy wafel.' },
        mask: {
          kid: 'Maska: wzór układu, cztery razy większy niż to, co drukuje się na waflu.',
          sci: 'Maska: wzór układu w czterokrotnym rozmiarze wydruku (redukcja 4x).',
        },
        ring: {
          kid: 'To spowolnione około miliard razy: krypton i fluor łączą się, świecą i odskakują od siebie ze światłem ultrafioletowym.',
          sci: 'Jeden cykl KrF*, ogromnie spowolniony: asocjacja, czas życia kilku nanosekund, potem dysocjacja z fotonem 248 nm.',
        },
      },
      panel: {
        kid: [
          'Wewnątrz szkła prąd popycha atomy kryptonu i łączą się z fluorem. Ale ten uścisk trwa tylko kilka miliardowych części sekundy: para odskakuje i wysyła błysk światła ultrafioletowego o długości 248 nanometrów.',
          'Lustra odbijają błyski tam i z powrotem w gazie, aż urosną w silną wiązkę. Światła ultrafioletowego nie widać, ale karta w nim świeci.',
          'Wiązka przechodzi przez maskę i soczewkę, która ją zmniejsza, i drukuje maleńkie układy na krzemie. Układy robione w ten sposób były w komputerach około roku 2000. Zwolnij laser, żeby zobaczyć każdy błysk.',
        ],
        sci: [
          'Laser ekscymerowy KrF: wyładowanie elektryczne w mieszaninie Kr, F2 i Ne tworzy wzbudzony KrF*, żyjący kilka nanosekund; jego stan podstawowy jest odpychający, więc cząsteczka rozpada się, emitując 248 nm, a inwersja obsadzeń powstaje łatwo.',
          'Litografia w głębokim ultrafiolecie: maska jest odwzorowywana przez soczewkę redukującą (4x) na krzemie pokrytym fotorezystem, jeden układ na ekspozycję, krok po kroku. Litografia KrF przy 248 nm drukowała generacje od 250 nm do 130 nm od końca lat 90. (potem przyszedł ArF przy 193 nm).',
          'Ta sama cząsteczka napędza laser Nike w US Naval Research Laboratory, zbudowany do badań nad fuzją.',
        ],
      },
    },
  },
  de: {
    title: 'Ein Labor im Jahr 1963',
    greet: {
      kid: 'Wir sind im Bild: ein Chemielabor im Jahr 1963, dem Jahr, in dem Krypton zum ersten Mal einem anderen Atom die Hand gab. Durch die Tür hinten geht es in einen Laserraum, wo Krypton und Fluor sich für einen Blitz die Hände halten. Die Geschichte des Bildes steht auf der Staffelei neben dir.',
      sci: 'Ein Chemielabor von 1963, dem Jahr der ersten Kryptonverbindung: eine Vakuumlinie, Flaschen mit Krypton und Fluor, flüssiger Stickstoff, eine UV-Lampe. Hinten rechts eine Tür in einen KrF-Excimerlaser-Raum. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Meine äußere Elektronenschale ist voll, deshalb verbinde ich mich fast nie mit einem anderen Atom. Jahrzehntelang nannten die Chemiker uns die „trägen" Gase.',
        'Fluor ist das gierigste Atom von allen: Es zieht stärker an Elektronen als jedes andere. Es ist das einzige Atom, das an einem Krypton zerren kann.',
        'Die Kristalle leben nur in der Kälte. Bei Zimmertemperatur zerfallen sie und lassen los, und dabei sind sie wild genug, Gold zu fressen.',
        'Ein Laserraum ist das Gegenteil eines Gefrierschranks: Krypton und Fluor verbinden sich für ein paar milliardstel Sekunden, und der Blitz, den sie abgeben, druckt Computerchips.',
      ],
      sci: [
        'Bartletts Xenonhexafluoroplatinat von 1962 brach die Regel, dass Edelgase keine Verbindungen bilden; Krypton folgte 1963 mit KrF2.',
        'Fluor ist das elektronegativste Element (3,98 auf der Pauling-Skala). Krypton, erste Ionisierungsenergie 14,00 eV, ist das leichteste Edelgas, das eine Verbindung ergibt, die man im Kolben aufbewahren kann, kalt.',
        'KrF2 entsteht unter Energiezufuhr (seine Bildungsenthalpie ist positiv), darum ist es ein so starkes Fluorierungsmittel und darum muss der Feststoff kalt gehalten werden.',
        'Das Excimer KrF* hat keinen stabilen Grundzustand: Es ist nur im angeregten Zustand gebunden. Sein unterer Zustand zerfällt sofort, daher ist es leicht, mehr Atome im oberen als im unteren Zustand zu halten, wie ein Laser es braucht.',
      ],
    },
    make: {
      label: 'Der kalte Kolben',
      title: 'Kryptondifluorid herstellen',
      tags: { ln2: 'flüssiger Stickstoff', ice: 'Trockeneis', air: 'im Raum', lamp: 'UV-Lampe', gold: 'Blattgold', lens: 'Linse' },
      hints: {
        kr: 'Tippe auf die Kryptonflasche',
        f2: 'Tippe auf die Fluorflasche',
        cool: 'Kühle den Kolben, indem du auf den flüssigen Stickstoff tippst',
        lamp: 'Tippe auf die UV-Lampe',
        wait: 'Schau auf den Kolben',
        melting: 'Sieh den Kristallen beim Zerfallen zu, oder tippe auf den flüssigen Stickstoff',
        keeps: 'Tippe auf das Blattgold oder auf den Kolben, um ihn herauszuheben',
        lift: 'Tippe auf den Kolben, um ihn in den Raum zu heben',
      },
      slider: 'Temperatur des Kolbens',
      buttons: { kr: 'Krypton einlassen', f2: 'Fluor einlassen', lamp: 'UV-Lampe einschalten', gold: 'Blattgold eintauchen', newGold: 'Neues Blattgold', reset: 'Kolben leeren' },
      says: {
        kr: {
          kid: 'Das Ventil öffnet sich, und Kryptongas strömt durch das Rohr in den Quarzkolben. Allein sitzt es einfach da: Krypton reagiert von sich aus mit nichts.',
          sci: 'Krypton strömt aus der Flasche durch das Nickelrohr in den Quarzkolben. Allein bleibt es ein einatomiges Gas.',
        },
        f2: {
          kid: 'Jetzt Fluor, ein blassgelbgrünes Gas, das fast alles angreift. Darum steht es in einem belüfteten Schrank und strömt durch Nickelrohre.',
          sci: 'Fluor, F2, ein blassgelbes Gas, das Glas, die meisten Metalle und fast alles andere angreift: daher der belüftete Schrank und die Nickelleitung, die eine Haut aus Nickelfluorid schützt.',
        },
        dewar: {
          kid: 'Der Kolben kommt in flüssigen Stickstoff, etwa −196 °C. Das ist kalt genug, damit die Kristalle halten.',
          sci: 'In flüssigem Stickstoff, −196 °C: weit unter den −78 °C, bei denen sich KrF2 aufbewahren lässt.',
        },
        ice: {
          kid: 'Trockeneis, etwa −78 °C. Immer noch kalt genug, damit die Kristalle halten.',
          sci: 'Trockeneis, −78 °C: die Temperatur, bei der sich festes KrF2 aufbewahren lässt.',
        },
        air: {
          kid: 'Draußen im Raum sind es etwa 25 °C. Das ist viel zu warm, damit Kristalle halten.',
          sci: 'Bei 25 °C: zu warm, als dass KrF2 hielte, also ist hier nichts aufzubewahren.',
        },
        melt: {
          kid: 'Draußen im Raum fangen die Kristalle an zu zerfallen, zurück in Krypton und Fluor. Das ist beschleunigt: Eine Sekunde hier ist eine halbe Stunde.',
          sci: 'Bei 25 °C zerfällt KrF2 in Kr und F2, etwa 10% pro Stunde (eine Sekunde hier ist eine halbe Stunde).',
        },
        noKr: {
          kid: 'Noch gibt es nichts zu bestrahlen: Im Kolben ist kein Krypton. Tippe zuerst auf die Kryptonflasche.',
          sci: 'Die Lampe braucht beide Gase im Kolben, und das Krypton fehlt noch.',
        },
        noF2: {
          kid: 'Noch gibt es nichts zu bestrahlen: Im Kolben ist kein Fluor. Tippe zuerst auf die Fluorflasche.',
          sci: 'Die Lampe braucht beide Gase im Kolben, und das Fluor fehlt noch.',
        },
        warmLamp: {
          kid: 'Die Lampe brennt, aber der Kolben ist zu warm, und nichts bleibt haften. Kühle ihn zuerst im flüssigen Stickstoff!',
          sci: 'UV an, aber solange der Kolben warm ist, zerfällt das Produkt so schnell, wie es entsteht. Kühle ihn zuerst.',
        },
        lamp: {
          kid: 'Das ultraviolette Licht spaltet Fluormoleküle in einzelne Fluoratome. Die packen das Krypton, und auf dem kalten Glas wachsen farblose Kristalle!',
          sci: 'UV spaltet F2 in F-Atome, die Krypton angreifen: KrF2 schlägt sich an der kalten Wand nieder. (Eine elektrische Entladung durch die kalten Gase geht auch.)',
        },
        grow: {
          kid: 'Kristalle! Farblos wie Eis. Ein Edelgas hat sich mit einem anderen Atom verbunden, hier auf diesem Tisch. Schau durch die Linse, woraus sie bestehen.',
          sci: 'An der Wand wachsen farblose KrF2-Kristalle. Die Linse zeigt die linearen F-Kr-F-Moleküle, im Kristall gepackt.',
        },
        done: {
          kid: 'Der Kolben ist voller Kristalle. Probiere jetzt das Blattgold, oder hebe den Kolben in den Raum.',
          sci: 'Die Gase sind verbraucht: KrF2 an der Wand. Blattgold prüft seine Oxidationskraft, Erwärmen seine Stabilität.',
        },
        gone: {
          kid: 'Die Kristalle sind weg: Krypton und Fluor sind wieder lose Gase.',
          sci: 'Vollständig zerfallen: wieder gasförmiges Kr und F2.',
        },
        noGold: {
          kid: 'Mach zuerst ein paar Kristalle: Das Blattgold braucht etwas Wildes, das es angreift.',
          sci: 'Im Kolben ist noch kein KrF2, das das Gold oxidieren könnte.',
        },
        gold: {
          kid: 'Das Blattgold kommt hinein, und die Kristalle fressen es! Gold reagiert fast mit nichts, aber Kryptondifluorid ist wilder. Das Kryptongas wird frei.',
          sci: 'KrF2 oxidiert Gold: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr, Gold in der Stufe +5. Krypton wird frei.',
        },
        lens: {
          kid: 'Jedes Molekül hat ein Krypton in der Mitte und auf jeder Seite ein Fluor, in einer geraden Linie: F-Kr-F. Krypton hält zwei Hände.',
          sci: 'KrF2 ist linear, F-Kr-F, zusammengehalten von einer Drei-Zentren-vier-Elektronen-Bindung.',
        },
        noLens: {
          kid: 'Mach ein paar Kristalle, dann zeigt diese Linse, woraus sie bestehen.',
          sci: 'Die Linse zeigt den Aufbau der Kristalle, sobald es welche gibt.',
        },
      },
      panel: {
        kid: [
          'So wurde es gemacht: Kryptongas und Fluorgas in einen Kolben füllen, ihn sehr kalt machen und Energie zugeben, als elektrische Funken oder ultraviolettes Licht. Fluor ist das gierigste Atom, das es gibt, darum kann es an den Elektronen des Kryptons ziehen, obwohl die äußere Schale des Kryptons voll ist.',
          'Kryptondifluorid hält nur in der Kälte. Schiebe die Temperatur hoch, und die Kristalle zerfallen nach und nach. Bei Zimmertemperatur geht etwa ein Zehntel pro Stunde verloren; hier ist eine Sekunde eine halbe Stunde, damit du zusehen kannst.',
          'Probiere auch das Blattgold. Kryptondifluorid ist wild genug, Gold zu fressen.',
        ],
        sci: [
          'Kryptondifluorid wurde 1963 berichtet: Kr und F2 bei tiefer Temperatur, die Energie lieferten eine elektrische Entladung oder UV-Licht. Ein erster Bericht (Grosse und Mitarbeiter) hielt das Produkt für KrF4; es ist KrF2.',
          'KrF2: linear F-Kr-F, Drei-Zentren-vier-Elektronen-Bindung; ein farbloser, flüchtiger Feststoff, bei −78 °C aufbewahrbar und bei Zimmertemperatur um etwa 10% pro Stunde zerfallend. Hier ist eine Sekunde eine halbe Stunde, und die Rate fällt beim Abkühlen steil ab (ein Modell, keine Messung).',
          'Es gehört zu den stärksten bekannten Oxidationsmitteln und bringt Gold in die Stufe +5: 7 KrF2 + 2 Au → 2 [KrF]+[AuF6]− + 5 Kr.',
        ],
      },
    },
    who: {
      label: 'Wer gibt die Hand?',
      title: 'Die Edelgase und Fluor',
      hints: { start: 'Tippe auf einen Kolben, um ihm Fluor anzubieten', more: 'Tippe auf einen anderen Kolben', all: 'Tippe auf einen Kolben, um ihn noch einmal zu sehen' },
      boardTitle: { kid: 'Je höher der Balken, desto fester hält das Atom seine äußeren Elektronen', sci: 'Erste Ionisierungsenergie (eV)' },
      results: { He: 'keine Verbindung', Ne: 'keine Verbindung', Ar: 'HArF, nur im Eis', Kr: 'KrF2', Xe: 'XeF2, XeF4, XeF6', Rn: 'RnF2 (radioaktiv)' },
      says: {
        He: {
          kid: 'Helium hat nur zwei Elektronen und hält sie fester als jedes andere Atom. Fluor prallt ab: Eine Heliumverbindung mit Fluor hat noch nie jemand hergestellt.',
          sci: 'Helium, 24,59 eV, der höchste Wert von allen: Kein Fluorid ist bekannt. Die wenigen Heliumverbindungen (Na2He, 2017 bei über einer Million Atmosphären hergestellt) sind keine Kolbenchemie.',
        },
        Ne: {
          kid: 'Neon ist der sturste von allen. Es hält seine Elektronen ebenfalls sehr fest, und eine beständige Neonverbindung hat noch nie jemand hergestellt.',
          sci: 'Neon, 21,56 eV: Keine stabile neutrale Verbindung ist bekannt, nur kurzlebige Ionen wie NeH+ in einem Gas.',
        },
        Ar: {
          kid: 'Argon machte erst im Jahr 2000 mit, und nur in Eis, kälter als −250 °C: Chemiker in Finnland stellten HArF her, Wasserstoff-Argon-Fluor, und es zerfällt, wenn das Eis wärmer wird.',
          sci: 'Argon, 15,76 eV: HArF (Khriachtchev und Mitarbeiter, Helsinki, Nature 2000), in festem Argon bei etwa 8 K hergestellt und nur bis etwa 27 K stabil.',
        },
        Kr: {
          kid: 'Krypton nimmt Fluor, aber nur in der Kälte: Kryptondifluorid, KrF2. Es war die erste Kryptonverbindung, von 1963, die im kalten Kolben.',
          sci: 'Krypton, 14,00 eV: KrF2 (1963), kalt aufbewahrt, Ausgangspunkt fast aller anderen Kryptonverbindungen.',
        },
        Xe: {
          kid: 'Xenon hält seine äußeren Elektronen locker, darum verbindet es sich leicht mit Fluor. 1962 stellte Neil Bartlett mit Xenon die erste Edelgasverbindung her. Xenon bildet XeF2, XeF4 und XeF6.',
          sci: 'Xenon, 12,13 eV: Bartletts Xenonhexafluoroplatinat (1962) war die erste, dann XeF2, XeF4 und XeF6, die bei Zimmertemperatur halten.',
        },
        Rn: {
          kid: 'Radon hält seine Elektronen am lockersten, darum verbindet es sich auch mit Fluor. Aber Radon ist radioaktiv und verschwindet schnell, deshalb hat man nur winzige Mengen untersucht.',
          sci: 'Radon, 10,75 eV: Fluor nimmt es, ein Fluorid, 1962 berichtet und noch immer schwer zu untersuchen, denn jedes Radonisotop ist radioaktiv (Radon-222: 3,8 Tage).',
        },
        all: {
          kid: 'Alle sechs probiert! Je niedriger der Balken, desto leichter kann Fluor zupacken. Darum sind es die schweren, die sich die Hände halten.',
          sci: 'Die Ionisierungsenergie sinkt in der Gruppe nach unten, von 24,59 auf 10,75 eV: Je weiter die äußeren Elektronen vom Kern entfernt sind, desto leichter lässt sich das Atom oxidieren und desto mehr Verbindungen bildet es. Argon brauchte eine gefrorene Matrix.',
        },
      },
      panel: {
        kid: [
          'Jeder Kolben enthält ein Edelgas, gezeichnet in seiner wahren Größe im Vergleich zu den anderen: Die Atome werden in der Reihe größer. Die kleinen Lichter sind seine äußeren Elektronen.',
          'Die Balken dahinter zeigen, wie schwer es ist, ein Elektron wegzuziehen. Helium, mit dem höchsten Balken, hält am festesten. Radon, mit dem niedrigsten, lässt am leichtesten los, und genau das braucht Fluor.',
          'Tippe auf einen Kolben, um ihm Fluor anzubieten und zu sehen, wer die Hand gibt.',
        ],
        sci: [
          'Die Atome sind mit ihren van-der-Waals-Radien gezeichnet (He 140 pm bis Rn 220 pm) und mit ihren Valenzelektronen (2 bei Helium, 8 bei den anderen).',
          'Die Balken sind erste Ionisierungsenergien in eV: He 24,59, Ne 21,56, Ar 15,76, Kr 14,00, Xe 12,13, Rn 10,75. Niedriger heißt, ein äußeres Elektron ist für Fluor leichter zu nehmen: Das Atom ist größer, und der Kern hält die äußeren Elektronen schwächer.',
          'Bekannte Fluoride: keines von Helium oder Neon; HArF bei etwa 8 K; KrF2; XeF2, XeF4 und XeF6; RnF2.',
        ],
      },
    },
    flash: {
      label: 'Der Laserraum',
      title: 'Ein Molekül, das einen Blitz lang lebt',
      tags: { door: 'LASERRAUM', excimer: 'KrF 248 nm', laser: 'KrF-Laser', card: 'Karte', mask: 'Maske', lens: 'Linse', wafer: 'Wafer' },
      hints: {
        laser: 'Tippe auf den Laser, um die Entladung zu zünden',
        card: 'Tippe auf die Karte, um den Strahl zu sehen',
        print: 'Tippe auf die Linse, um die Maske zu drucken',
        cardOut: 'Tippe auf die Karte, um sie aus dem Strahl zu nehmen',
        look: 'Sieh zu, wie der Wafer sich füllt, oder bremse den Laser',
        done: 'Tippe auf den Wafer für einen neuen',
      },
      slider: 'Pulse pro Sekunde',
      buttons: { laser: 'Laser zünden', laserOff: 'Laser stoppen', card: 'Karte in den Strahl halten', cardOut: 'Karte herausnehmen', print: 'Maske drucken', printOff: 'Drucken stoppen', wafer: 'Neuer Wafer' },
      says: {
        on: {
          kid: 'Zack! Eine elektrische Entladung geht durch Krypton mit ein wenig Fluor. Sieh in die Lupe: Ein Krypton und ein Fluor verbinden sich für ein paar milliardstel Sekunden und springen dann mit einem Blitz ultravioletten Lichts auseinander. Dieser Blitz ist der Laser.',
          sci: 'Entladung an: In der Mischung aus Kr, F2 und Neon entsteht angeregtes KrF*, lebt einige Nanosekunden und zerfällt (sein Grundzustand ist abstoßend) unter Emission bei 248 nm. Spiegel schicken das Licht durch das Gas hin und her, bis ein Puls austritt. Die Lupe verlangsamt einen Zyklus.',
        },
        off: { kid: 'Laser aus. Krypton und Fluor lassen für immer los.', sci: 'Laser aus: Die Entladung endet, und es bildet sich kein KrF* mehr.' },
        card: {
          kid: 'Der Strahl ist unsichtbar, weil ultraviolettes Licht unsichtbar ist, aber die Karte leuchtet blau, wo er sie trifft. Siehst du die Blitze?',
          sci: 'Licht von 248 nm ist unsichtbar; die Karte fluoresziert und macht das UV dort sichtbar blau, wo der Strahl sie kreuzt.',
        },
        cardOff: { kid: 'Die Karte steht im Strahl. Zünde den Laser, dann leuchtet sie.', sci: 'Die Karte steht an ihrem Platz; sie fluoresziert, wenn der Laser feuert.' },
        cardOut: { kid: 'Karte draußen: Der Strahl geht weiter zur Linse.', sci: 'Karte entfernt: Der Strahl geht weiter durch Maske und Linse.' },
        print: {
          kid: 'Das Licht geht durch die Maske, auf der das Muster einer winzigen Computerschaltung ist, und die Linse verkleinert es viermal auf den Silizium-Wafer. Jedes Quadrat ist eine neue Kopie.',
          sci: 'Der Strahl durchquert die Maske (hier in vierfacher Größe des Drucks gezeichnet), und die Linse bildet sie 4x verkleinert auf den mit Fotolack beschichteten Wafer ab. Jeder Chip braucht einige Pulse.',
        },
        printOff: { kid: 'Der Laser läuft nicht. Zünde ihn zuerst.', sci: 'Der Laser ist aus, also gibt es nichts, womit gedruckt werden könnte. Zünde ihn zuerst.' },
        printStop: { kid: 'Drucken gestoppt.', sci: 'Drucken gestoppt.' },
        blocked: { kid: 'Die Karte steht im Weg: Der Strahl erreicht die Linse nie. Nimm sie heraus.', sci: 'Die Karte blockiert den Strahl. Nimm sie heraus, damit die Linse ihn bekommt.' },
        full: {
          kid: 'Ein ganzer Wafer voller winziger Schaltungen! Echte Maschinen drucken Hunderte Chips auf einen Wafer, mit Tausenden Blitzen pro Sekunde.',
          sci: 'Ein voller Wafer. Produktionslaser dieser Art geben etwa 4000 bis 6000 Pulse pro Sekunde ab (hier 1 bis 20, damit du sie sehen kannst).',
        },
        wafer: { kid: 'Ein frischer Wafer.', sci: 'Neuer Wafer.' },
        mask: {
          kid: 'Die Maske: das Muster einer Schaltung, viermal so groß wie das, was auf den Wafer gedruckt wird.',
          sci: 'Die Maske: das Schaltungsmuster in vierfacher Größe des Drucks (4x Verkleinerung).',
        },
        ring: {
          kid: 'Das ist etwa eine Milliarde Mal verlangsamt: Krypton und Fluor verbinden sich, leuchten und springen mit ultraviolettem Licht auseinander.',
          sci: 'Ein Zyklus von KrF*, enorm verlangsamt: Assoziation, eine Lebensdauer von einigen Nanosekunden, dann Dissoziation mit einem 248-nm-Photon.',
        },
      },
      panel: {
        kid: [
          'Im Glas gibt Elektrizität den Kryptonatomen einen Stoß, und sie verbinden sich mit Fluor. Aber dieser Händedruck dauert nur ein paar milliardstel Sekunden: Das Paar springt auseinander und gibt einen Blitz ultravioletten Lichts ab, 248 Nanometer lang.',
          'Spiegel schicken die Blitze im Gas hin und her, bis sie zu einem starken Strahl anwachsen. Ultraviolettes Licht sieht man nicht, aber die Karte leuchtet darin.',
          'Der Strahl geht durch eine Maske und eine Linse, die ihn verkleinert, und druckt winzige Schaltungen auf Silizium. Chips, die so gemacht wurden, steckten um das Jahr 2000 in Computern. Bremse den Laser, um jeden Blitz zu sehen.',
        ],
        sci: [
          'KrF-Excimerlaser: Eine elektrische Entladung durch ein Gemisch aus Kr, F2 und Ne erzeugt angeregtes KrF*, das einige Nanosekunden lebt; sein Grundzustand ist abstoßend, das Molekül zerfällt also unter Emission bei 248 nm, und die Besetzungsinversion stellt sich leicht ein.',
          'Lithografie im tiefen Ultraviolett: Die Maske wird durch eine verkleinernde Linse (4x) auf lackbeschichtetes Silizium abgebildet, ein Chip pro Belichtung, Schritt für Schritt. KrF-Lithografie bei 248 nm druckte die Generationen von 250 nm bis 130 nm ab Ende der 1990er (ArF bei 193 nm folgte).',
          'Dasselbe Molekül treibt den Nike-Laser am US Naval Research Laboratory an, gebaut für die Fusionsforschung.',
        ],
      },
    },
  },
}
