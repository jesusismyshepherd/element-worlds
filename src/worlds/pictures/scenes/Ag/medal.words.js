// The words of silver's medal room ("Is a gold medal made of gold?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Ag.js (the easel
// shows it). Facts and where they come from:
// - Paris 2024 medals: 85 mm across, 9.2 mm thick; gold 529 g, silver 525 g, bronze 455 g; each set with an 18 g
//   hexagon of puddled iron taken from the Eiffel Tower; made by the Monnaie de Paris, designed by Chaumet
//   (paris.fr, olympics.com). The gold medal's 505 g of silver is worked out as 529 - 18 - 6 (press reports give
//   "about 506 g"; the board says "about 505 g").
// - The rule: first- and second-place medals of silver of at least 925/1000, the gold medal gilded with at least
//   6 g of pure gold (Olympic Charter's rules for medals, as Olympedia gives them). Whether Paris 2024's gold was laid
//   by electroplating is not stated: it is the usual way, and the words say "usual".
// - Densities from src/data/elements.json: silver 10.501, gold 19.282, iron 7.874 g/cm3; molar masses Ag 107.87,
//   Au 196.97 g/mol; Faraday's constant 96 485 C/mol. One ampere for one hour: 196.97 * 3600 / 96 485 = 7.35 g of
//   gold (gold(I), one electron per atom, at best), 107.87 * 3600 / 96 485 = 4.02 g of silver.
// - The solid gold copy: (505 / 10.501 + 6 / 19.282) cm3 = 48.4 cm3 of metal; as gold 48.4 * 19.282 = 933 g; plus the
//   18 g hexagon = about 951 g. Worked out here, so "about". The price tag: "tens of thousands of euros" as the board
//   says (gold's price moves; 933 g of gold is far above ten thousand euros at any price of the last years).
// - The skin: 6 g / 19.282 g/cm3 = 0.311 cm3 over about 138 cm2 (two faces of 56.7 cm2 and the edge of 24.6 cm2) =
//   22.5 micrometres; at about 0.25 nm a layer, about 90 000 layers. Sterling at 925/1000 by mass: 7.5 g of copper
//   (63.55) per 92.5 g of silver is 0.118 mol against 0.857 mol, about 12% of the atoms (one in eight).
// - Games: 1896 Athens, in the Panathenaic Stadium, winners a silver medal, an olive branch and a diploma, runners-up
//   a medal of copper (some sources say bronze) and a laurel branch, nothing for third; medals by Jules-Clement
//   Chaplain, struck at the Monnaie de Paris (the board's story, from the IOC's Olympic Studies Centre). 1900 Paris:
//   many prizes were cups, trophies and objects, which the IOC later counted as gold, silver and bronze. 1904
//   St. Louis: the first Games with gold, silver and bronze for first, second and third (some sources say 1908).
//   1912 Stockholm: the last solid gold medals (Olympedia, Guinness). After 1912: gilded silver. What the solid gold
//   medals of 1904 to 1912 weighed is not used. Doubtful: the early Games' details; the room says only what the
//   sources share.
// In the 3D labels no subscripts or emoji (the fonts have none): the HUD panels hold the real formulas.
// {n}-style numbers are filled in by the room.
export const MEDAL_WORDS = {
  en: {
    title: 'Under the gold',
    greet: {
      kid: 'Welcome to the Panathenaic Stadium in Athens, where the very first modern Olympic Games were held in 1896! I am silver, and I hide inside every gold medal. Try the three stations: peel a medal, gild a silver one, and see who got what. The picture\'s story is on the easel.',
      sci: 'The Panathenaic Stadium in Athens at dusk, the marble horseshoe where the Games of 1896 were run. Three stations: what lies under a gold medal\'s gold, how silver is gilded by electroplating, and what the medals of different Games were made of. The picture\'s story is on the easel.',
    },
    talk: {
      kid: [
        'Silver shines brighter than any other metal and it costs much less than gold, so a gold medal is mostly silver with a thin golden coat.',
        'I am silver, number 47 in the table. My symbol is Ag, from argentum, the Latin word for silver.',
        'Only first place gets gold. The silver medal is silver all the way through.',
      ],
      sci: [
        'Sterling silver is at least 92.5% silver by mass; the rest, usually copper, makes it harder than pure silver. The rules ask for it in the first- and second-place medals.',
        'Silver, Ag, Z = 47: density 10.501 g/cm³ against gold\'s 19.282, so the same volume of gold weighs about 1.8 times as much.',
        'A Paris 2024 gold medal is 85 mm across and 9.2 mm thick: roughly 505 g of silver, 18 g of iron and 6 g of gold.',
      ],
    },
    under: {
      label: 'The gold medal',
      hints: { peel: 'Tap the medal\'s corner', weigh: 'Tap the balance', hex: 'Tap the iron hexagon', again: 'Tap anything again' },
      title: 'What is under the gold?',
      buttons: { peel: 'Peel the gold skin', weigh: 'Weigh it', hex: 'The iron hexagon' },
      says: {
        peel: {
          kid: 'Look! Under the thin golden skin it is silver, grey and shiny. In the lens are the atoms: gold on top, silver below, and a few orange copper atoms mixed into the silver.',
          sci: 'The skin is only about 22 micrometres of gold (6 g over some 138 cm²). Under it is sterling silver: if it is exactly 925 parts in 1000, about one atom in eight is copper.',
        },
        unpeel: {
          kid: 'The skin goes back on: gold outside, silver inside.',
          sci: 'Skin back on: about 6 g of gold over about 505 g of silver.',
        },
        weigh: {
          kid: 'The real medal weighs 529 g. A copy of the same size made all of gold would weigh almost twice as much, about 950 g, and cost tens of thousands of euros.',
          sci: '505 g of silver and 6 g of gold fill about 48.4 cm³. As gold that volume weighs 933 g; add the 18 g of iron and it is about 950 g, against the real 529 g. Worked out from the densities, so only "about".',
        },
        unweigh: { kid: 'The pans are empty again.', sci: 'Pans empty.' },
        hex: {
          kid: 'In the middle of every Paris 2024 medal sits a hexagon of iron from the Eiffel Tower! Iron has its own hall, with the tower in one of its pictures.',
          sci: 'The hexagon is 18 g of puddled iron taken from the Eiffel Tower, set into the middle of each medal. Iron\'s hall tells how the tower was built.',
        },
        unhex: { kid: 'The hexagon sinks back into place.', sci: 'Hexagon back in place.' },
      },
      hex: {
        title: 'Iron from the Eiffel Tower',
        line: {
          kid: 'A hexagon of iron, 18 g, set in the middle of every Paris 2024 medal.',
          sci: '18 g of puddled iron taken from the Eiffel Tower, set in every Paris 2024 medal.',
        },
        go: 'See iron\'s hall',
      },
      ironLink: 'Iron\'s hall',
      scale: {
        real: { kid: 'The real medal', sci: 'Real gold medal' },
        copy: { kid: 'A solid gold copy', sci: 'Same size, solid gold' },
        copyG: { kid: 'about 950 g', sci: 'about 950 g' },
        price: { kid: 'tens of thousands of euros', sci: 'tens of thousands of euros' },
        same: { kid: 'mostly silver', sci: '505 g Ag, 6 g Au, 18 g Fe' },
      },
      panel: {
        kid: [
          'A gold medal is mostly silver! At the Paris Games of 2024 it weighed 529 g, but only 6 g was gold: a thin golden skin over silver, with a hexagon of iron from the Eiffel Tower in the middle.',
          'Why not solid gold? Gold is very heavy and very expensive. A solid gold medal of the same size would weigh almost twice as much. Tap the corner to peel the skin, the balance to weigh, and the hexagon to see where the iron came from.',
        ],
        sci: [
          'Paris 2024: medals 85 mm by 9.2 mm; gold 529 g (about 505 g of silver, at least 6 g of gold and 18 g of iron), silver 525 g, bronze 455 g. The Olympic rules ask for silver of at least 925 parts in 1000 in the first- and second-place medals, and a gilding of at least 6 g of pure gold on the gold one.',
          'The skin: 6 g of gold over about 138 cm² (two faces and the edge) is 6 g ÷ 19.282 g/cm³ ÷ 138 cm² = 22 micrometres, about 90 000 layers of atoms. In the lens the gold is three layers deep; the real skin is thousands of times thicker than that. Sterling at 925/1000 by mass is about 12% copper by number of atoms: one in eight.',
          'The copy in solid gold: 505 g ÷ 10.501 g/cm³ + 6 g ÷ 19.282 g/cm³ = 48.4 cm³ of metal. As gold that weighs 933 g, and with the 18 g hexagon about 950 g. Worked out, not weighed. Gold\'s price moves every day: only the order of magnitude is meant.',
        ],
      },
    },
    gild: {
      label: 'The medal-maker\'s bench',
      hints: { hang: 'Tap the silver blank', switch: 'Tap the switch', stop: 'Tap the switch to stop', lift: 'Tap the medal to lift it out', again: 'Tap the blank to hang it again' },
      title: 'Gild it',
      slider: 'Current',
      buttons: { hang: 'Hang or lift the blank', switch: 'Switch on or off', swap: 'Swap the clips', fresh: 'A new silver blank' },
      says: {
        hang: {
          kid: 'The blank hangs in the golden bath. Now tap the switch.',
          sci: 'The blank hangs in the gold bath. With the current on, it is the cathode if the black clip (minus) is on its bar.',
        },
        lift: { kid: 'The blank comes out of the bath.', sci: 'Blank out of the bath.' },
        noMedal: {
          kid: 'The switch does nothing yet: there is no medal in the bath. Tap the silver blank first.',
          sci: 'No medal in the bath, so no circuit: no current can flow. Hang the blank first.',
        },
        runCath: {
          kid: 'Current on! Tiny pieces of gold from the bath land on the medal and stick, and the silver turns gold. The counter shows how much.',
          sci: 'Current on, the medal as cathode (minus): each gold ion takes one electron at the surface and becomes a gold atom. By Faraday, one ampere for one hour lays about 7.35 g of gold, at best.',
        },
        runAnode: {
          kid: 'Careful: the medal is on the plus side now! Instead of getting gold it loses silver into the bath. Watch the grey bits float away.',
          sci: 'The medal is the anode (plus): its silver atoms give up electrons and dissolve as silver ions, about 4 g per ampere-hour. No gold is laid.',
        },
        stop: { kid: 'Current off.', sci: 'Current off.' },
        swap: {
          kid: 'You swapped the clips: now the medal is on the plus side. Switch on and see what happens to its silver.',
          sci: 'Polarity reversed: the medal is now the anode (plus).',
        },
        swapBack: {
          kid: 'Swapped back: the medal is on the minus side again, where gold lands.',
          sci: 'Polarity restored: the medal is the cathode (minus) again.',
        },
        fresh: { kid: 'A new silver blank hangs on the hook.', sci: 'A new silver blank on the hook.' },
        half: { kid: 'Halfway to the gold of a real medal! That is 3 g.', sci: '3 g laid: half of the 6 g the rules ask for.' },
        full: {
          kid: '6 g: that is how much gold a real gold medal has. You made one!',
          sci: '6 g: the rules\' minimum for a gold medal. The skin is about 22 micrometres thick, roughly a third of a hair\'s width.',
        },
        lost: {
          kid: '2 g of silver have dissolved into the bath. Gold goes on at the minus side; silver leaves from the plus side.',
          sci: '2 g of silver dissolved. That is why a real gilding bath uses an inert anode, one that does not dissolve.',
        },
        enough: {
          kid: 'That is already twice what a medal needs, so the power supply stops.',
          sci: '12 g laid, twice the minimum: the supply stops here.',
        },
      },
      board: {
        current: { kid: 'Current', sci: 'Current' },
        time: { kid: 'Time', sci: 'Time (sped up 450 times)' },
        gold: { kid: 'Gold laid on', sci: 'Gold deposited' },
        skin: { kid: 'Skin thickness', sci: 'Skin thickness' },
        lost: { kid: 'Silver lost', sci: 'Silver dissolved' },
        idle: { kid: 'Tap the silver blank', sci: 'No medal in the bath' },
        ready: { kid: 'Tap the switch', sci: 'Circuit open' },
        cath: { kid: 'Gold is landing on the medal', sci: 'Cathode: Au(I) + e- gives Au' },
        enough: { kid: 'A real medal has 6 g!', sci: '6 g: the rules\' minimum' },
        anode: { kid: 'The medal is losing silver!', sci: 'Anode: silver dissolves' },
      },
      panel: {
        kid: [
          'Gold is put on silver with electricity: it is called electroplating. The silver blank hangs in a bath with gold in it, on the minus side. The power supply pushes electrons onto the blank, and gold from the bath grabs them and sticks as a layer of gold.',
          'The medal here is shown about 8 times bigger than a real one, and the bath runs 450 times faster than real life. Drag the current: more current, and the gold goes on faster. Swap the clips and the medal loses silver instead. Why? The plus side takes electrons away from the silver, and silver atoms float off.',
        ],
        sci: [
          'Electroplating is the usual way to gild a medal: the blank is the cathode (minus) in a gold bath. Gold(I) in the bath is held in a complex ion such as Au(CN)2− or Au(SO3)23−; stirring brings it to the surface, where each gold takes one electron: Au(I) + e− → Au. The other electrode is inert (platinum-coated titanium).',
          'Faraday\'s law: mass = I·t·M ÷ (z·F). With M = 196.97 g/mol, z = 1 and F = 96 485 C/mol, one ampere for one hour lays 7.35 g, at best (real baths waste some current). 6 g takes about 0.8 A for an hour. Spread over about 138 cm² that is 6 g ÷ 19.282 g/cm³ ÷ 138 cm² = 22 micrometres.',
          'Reverse the clips and the medal is the anode: silver gives up electrons and dissolves as silver ions (107.87 g/mol), about 4 g per ampere-hour. A real bath uses an inert anode for this reason. The room blows the medal up about 8 times and runs the bath 450 times faster.',
        ],
      },
    },
    games: {
      label: 'The podium',
      hints: { tap: 'Tap a step', slide: 'Drag the year' },
      title: 'Who got what?',
      slider: 'The Games',
      buttons: ['First place', 'Second place', 'Third place'],
      years: ['1896', '1900', '1904', '1912', '1920', '2024'],
      rows: [
        {
          head: 'Athens 1896',
          what: {
            kid: 'The first modern Games, in this very stadium! The winner got a silver medal, an olive branch and a diploma. The runner-up got a copper medal and a laurel branch. Third place got nothing.',
            sci: 'Athens, April 1896, in the Panathenaic Stadium rebuilt in marble. Winners received a silver medal, an olive branch and a diploma; runners-up a medal of copper (some sources say bronze) and a laurel branch; nothing for third place.',
          },
        },
        {
          head: 'Paris 1900',
          what: {
            kid: 'Many winners were given cups, trophies or other prizes instead of medals. Today the records count them as gold, silver and bronze.',
            sci: 'Paris, 1900: the Games were spread over months beside a World\'s Fair, and many winners received cups, trophies or objects rather than medals. The IOC has since counted the results as gold, silver and bronze.',
          },
        },
        {
          head: 'St. Louis 1904',
          what: {
            kid: 'The first Games with three medals: gold for first, silver for second, bronze for third. The gold ones were solid gold.',
            sci: 'St. Louis, 1904: the first Games to give gold, silver and bronze for first, second and third place (some sources say 1908). Gold medals were solid gold until 1912.',
          },
        },
        {
          head: 'Stockholm 1912',
          what: {
            kid: 'The last Games with medals of solid gold. After this, gold medals are silver with a coat of gold.',
            sci: 'Stockholm, 1912: the last Olympic gold medals of solid gold. Since then the first-place medal has been silver with a gold coating.',
          },
        },
        {
          head: 'Antwerp 1920',
          what: {
            kid: 'Now the gold medal is mostly silver with gold on top, just like the one you gilded.',
            sci: 'Antwerp, 1920: the first Games after the last solid gold medals. First place gets gilded silver.',
          },
        },
        {
          head: 'Paris 2024',
          what: {
            kid: 'A gold medal weighs 529 g, but only 6 g of it is gold. In the middle sits a hexagon of iron from the Eiffel Tower, 18 g.',
            sci: 'Paris 2024: gold 529 g, silver 525 g, bronze 455 g, each 85 mm across and 9.2 mm thick, each with an 18 g hexagon of puddled iron from the Eiffel Tower. The gold medal is about 505 g of silver under at least 6 g of gold.',
          },
        },
      ],
      says: {
        step: [
          { kid: 'First place: see its medal cut through on the board.', sci: 'First place: the medal is shown cut through on the board.' },
          { kid: 'Second place: see its medal cut through on the board.', sci: 'Second place: the medal is shown cut through on the board.' },
          { kid: 'Third place: see its medal cut through on the board.', sci: 'Third place: the medal is shown cut through on the board.' },
        ],
        none: { kid: 'Nothing lies on this step: no prize was given for this place in these Games.', sci: 'No medal is shown for this place in these Games.' },
      },
      board: {
        tap: { kid: 'Tap a step', sci: 'Tap a step to cut its medal through' },
        none: { kid: 'Nothing here', sci: 'No medal for this place' },
        cup: { kid: 'A cup, not a medal', sci: 'A cup or other prize' },
        step: ['First place', 'Second place', 'Third place'],
      },
      mats: {
        gold: 'solid gold',
        silver: 'silver',
        copper: 'copper',
        bronze: 'bronze',
        bronze24: 'bronze (copper and zinc)',
        gilded: 'silver under a skin of gold',
        skin: { kid: 'gold skin (drawn much too thick)', sci: 'gold skin (drawn far too thick)' },
        hex: 'iron hexagon 18 g',
      },
      panel: {
        kid: [
          'Drag the year to travel through the Games. At the first modern Olympics in 1896, right here in Athens, the winner got a silver medal and an olive branch, and the runner-up a copper medal. Gold medals came later.',
          'Tap a step and the board shows its medal cut through, so you can see what it is made of. The last medals of solid gold were given in 1912. Since then they are silver with gold on top.',
        ],
        sci: [
          'The slider: Athens 1896, Paris 1900, St. Louis 1904, Stockholm 1912, Antwerp 1920, Paris 2024. The sources differ on details of the early Games, so only what they share is shown: in 1896 silver for first place (with an olive branch and a diploma) and copper (some say bronze) for second; in 1900 many prizes were cups and objects; from 1904 gold, silver and bronze; solid gold until 1912.',
          'The 1896 medals, designed by Jules-Clément Chaplain, were struck at the Monnaie de Paris, which struck the Paris 2024 medals too. The board draws each cut-through true in width, but the gold skin far too thick: really it is a few hundredths of a millimetre.',
        ],
      },
    },
  },
  'pt-pt': {
    title: 'Por baixo do ouro',
    greet: {
      kid: 'Bem-vindo ao Estádio Panatenaico, em Atenas, onde se realizaram os primeiros Jogos Olímpicos modernos, em 1896! Sou a prata e escondo-me dentro de todas as medalhas de ouro. Experimenta as três estações: descasca uma medalha, doura uma de prata e vê quem ganhou o quê. A história da imagem está no cavalete.',
      sci: 'O Estádio Panatenaico, em Atenas, ao entardecer: a ferradura de mármore onde se disputaram os Jogos de 1896. Três estações: o que há por baixo do ouro de uma medalha de ouro, como se doura a prata por eletrodeposição e de que eram feitas as medalhas de diferentes Jogos. A história da imagem está no cavalete.',
    },
    talk: {
      kid: [
        'A prata brilha mais do que qualquer outro metal e custa muito menos do que o ouro, por isso uma medalha de ouro é quase toda de prata, com uma camada dourada fininha.',
        'Sou a prata, o número 47 da tabela. O meu símbolo é Ag, de argentum, a palavra latina para prata.',
        'Só o primeiro lugar recebe ouro. A medalha de prata é de prata de uma ponta à outra.',
      ],
      sci: [
        'A prata de lei tem pelo menos 92,5% de prata em massa; o resto, geralmente cobre, torna-a mais dura do que a prata pura. As regras pedem-na nas medalhas do primeiro e do segundo lugar.',
        'Prata, Ag, Z = 47: densidade 10,501 g/cm³ contra 19,282 do ouro, pelo que o mesmo volume de ouro pesa cerca de 1,8 vezes mais.',
        'Uma medalha de ouro de Paris 2024 tem 85 mm de diâmetro e 9,2 mm de espessura: cerca de 505 g de prata, 18 g de ferro e 6 g de ouro.',
      ],
    },
    under: {
      label: 'A medalha de ouro',
      hints: { peel: 'Toca no canto da medalha', weigh: 'Toca na balança', hex: 'Toca no hexágono de ferro', again: 'Toca em qualquer coisa outra vez' },
      title: 'O que há por baixo do ouro?',
      buttons: { peel: 'Descascar a pele de ouro', weigh: 'Pesá-la', hex: 'O hexágono de ferro' },
      says: {
        peel: {
          kid: 'Olha! Por baixo da pele dourada fininha é prata, cinzenta e brilhante. Na lupa vêem-se os átomos: ouro por cima, prata por baixo e alguns átomos de cobre cor de laranja misturados na prata.',
          sci: 'A pele tem apenas cerca de 22 micrómetros de ouro (6 g sobre uns 138 cm²). Por baixo está prata de lei: se for exatamente 925 partes em 1000, cerca de um átomo em cada oito é de cobre.',
        },
        unpeel: {
          kid: 'A pele volta ao lugar: ouro por fora, prata por dentro.',
          sci: 'Pele de volta: cerca de 6 g de ouro sobre cerca de 505 g de prata.',
        },
        weigh: {
          kid: 'A medalha verdadeira pesa 529 g. Uma cópia do mesmo tamanho, toda de ouro, pesaria quase o dobro, cerca de 950 g, e custaria dezenas de milhares de euros.',
          sci: '505 g de prata e 6 g de ouro ocupam cerca de 48,4 cm³. Esse volume de ouro pesaria 933 g; com os 18 g de ferro dá cerca de 950 g, contra os 529 g da verdadeira. Calculado a partir das densidades, por isso só «cerca de».',
        },
        unweigh: { kid: 'Os pratos estão vazios outra vez.', sci: 'Pratos vazios.' },
        hex: {
          kid: 'No meio de todas as medalhas de Paris 2024 está um hexágono de ferro da Torre Eiffel! O ferro tem o seu próprio salão, com a torre numa das imagens.',
          sci: 'O hexágono são 18 g de ferro pudelado retirado da Torre Eiffel, embutido no meio de cada medalha. O salão do ferro conta como a torre foi construída.',
        },
        unhex: { kid: 'O hexágono volta ao seu lugar.', sci: 'Hexágono de volta ao lugar.' },
      },
      hex: {
        title: 'Ferro da Torre Eiffel',
        line: {
          kid: 'Um hexágono de ferro, 18 g, no meio de todas as medalhas de Paris 2024.',
          sci: '18 g de ferro pudelado retirado da Torre Eiffel, embutido em todas as medalhas de Paris 2024.',
        },
        go: 'Ver o salão do ferro',
      },
      ironLink: 'O salão do ferro',
      scale: {
        real: { kid: 'A medalha verdadeira', sci: 'Medalha de ouro real' },
        copy: { kid: 'Uma cópia de ouro maciço', sci: 'Mesmo tamanho, ouro maciço' },
        copyG: { kid: 'cerca de 950 g', sci: 'cerca de 950 g' },
        price: { kid: 'dezenas de milhares de euros', sci: 'dezenas de milhares de euros' },
        same: { kid: 'quase toda de prata', sci: '505 g Ag, 6 g Au, 18 g Fe' },
      },
      panel: {
        kid: [
          'Uma medalha de ouro é quase toda de prata! Nos Jogos de Paris de 2024 pesava 529 g, mas só 6 g eram de ouro: uma pele dourada fininha por cima da prata, com um hexágono de ferro da Torre Eiffel no meio.',
          'Porque não de ouro maciço? O ouro é muito pesado e muito caro. Uma medalha de ouro maciço do mesmo tamanho pesaria quase o dobro. Toca no canto para descascar a pele, na balança para pesar e no hexágono para ver de onde veio o ferro.',
        ],
        sci: [
          'Paris 2024: medalhas de 85 mm por 9,2 mm; ouro 529 g (cerca de 505 g de prata, pelo menos 6 g de ouro e 18 g de ferro), prata 525 g, bronze 455 g. As regras olímpicas pedem prata com pelo menos 925 partes em 1000 nas medalhas do primeiro e do segundo lugar, e uma douradura de pelo menos 6 g de ouro puro na de ouro.',
          'A pele: 6 g de ouro sobre cerca de 138 cm² (duas faces e o rebordo) dão 6 g ÷ 19,282 g/cm³ ÷ 138 cm² = 22 micrómetros, cerca de 90 000 camadas de átomos. Na lupa o ouro tem três camadas; a pele verdadeira é milhares de vezes mais espessa. A prata de lei a 925/1000 em massa tem cerca de 12% de cobre em número de átomos: um em cada oito.',
          'A cópia em ouro maciço: 505 g ÷ 10,501 g/cm³ + 6 g ÷ 19,282 g/cm³ = 48,4 cm³ de metal. Em ouro pesa 933 g e, com o hexágono de 18 g, cerca de 950 g. Calculado, não pesado. O preço do ouro muda todos os dias: só se quer dar a ordem de grandeza.',
        ],
      },
    },
    gild: {
      label: 'A bancada do fabricante de medalhas',
      hints: { hang: 'Toca no disco de prata', switch: 'Toca no interruptor', stop: 'Toca no interruptor para parar', lift: 'Toca na medalha para a tirar', again: 'Toca no disco para o pendurar outra vez' },
      title: 'Doura-a',
      slider: 'Corrente',
      buttons: { hang: 'Pendurar ou tirar o disco', switch: 'Ligar ou desligar', swap: 'Trocar as pinças', fresh: 'Um disco de prata novo' },
      says: {
        hang: {
          kid: 'O disco está pendurado no banho dourado. Agora toca no interruptor.',
          sci: 'O disco está pendurado no banho de ouro. Com a corrente ligada, é o cátodo se a pinça preta (menos) estiver na sua barra.',
        },
        lift: { kid: 'O disco sai do banho.', sci: 'Disco fora do banho.' },
        noMedal: {
          kid: 'O interruptor ainda não faz nada: não há medalha no banho. Toca primeiro no disco de prata.',
          sci: 'Sem medalha no banho não há circuito: a corrente não passa. Pendura primeiro o disco.',
        },
        runCath: {
          kid: 'Corrente ligada! Pedacinhos de ouro do banho caem na medalha e ficam presos, e a prata fica dourada. O contador mostra quanto.',
          sci: 'Corrente ligada, a medalha como cátodo (menos): cada ião de ouro recebe um eletrão à superfície e torna-se um átomo de ouro. Segundo Faraday, um ampere durante uma hora deposita cerca de 7,35 g de ouro, no máximo.',
        },
        runAnode: {
          kid: 'Cuidado: a medalha está agora do lado do mais! Em vez de ganhar ouro, perde prata para o banho. Vê os bocadinhos cinzentos a flutuar.',
          sci: 'A medalha é o ânodo (mais): os seus átomos de prata cedem eletrões e dissolvem-se como iões prata, cerca de 4 g por ampere-hora. Não se deposita ouro.',
        },
        stop: { kid: 'Corrente desligada.', sci: 'Corrente desligada.' },
        swap: {
          kid: 'Trocaste as pinças: agora a medalha está do lado do mais. Liga e vê o que acontece à prata.',
          sci: 'Polaridade invertida: a medalha é agora o ânodo (mais).',
        },
        swapBack: {
          kid: 'Trocaste outra vez: a medalha está de novo do lado do menos, onde o ouro se deposita.',
          sci: 'Polaridade reposta: a medalha é de novo o cátodo (menos).',
        },
        fresh: { kid: 'Um disco de prata novo está no gancho.', sci: 'Um disco de prata novo no gancho.' },
        half: { kid: 'Metade do ouro de uma medalha verdadeira! São 3 g.', sci: '3 g depositados: metade dos 6 g que as regras pedem.' },
        full: {
          kid: '6 g: é este o ouro que tem uma medalha de ouro verdadeira. Fizeste uma!',
          sci: '6 g: o mínimo das regras para uma medalha de ouro. A pele tem cerca de 22 micrómetros de espessura, mais ou menos um terço da largura de um cabelo.',
        },
        lost: {
          kid: '2 g de prata dissolveram-se no banho. O ouro deposita-se do lado do menos; a prata sai do lado do mais.',
          sci: '2 g de prata dissolvidos. É por isso que um banho de douradura a sério usa um ânodo inerte, que não se dissolve.',
        },
        enough: {
          kid: 'Isto já é o dobro do que uma medalha precisa, por isso a fonte de alimentação pára.',
          sci: '12 g depositados, o dobro do mínimo: a fonte pára aqui.',
        },
      },
      board: {
        current: { kid: 'Corrente', sci: 'Corrente' },
        time: { kid: 'Tempo', sci: 'Tempo (450 vezes mais depressa)' },
        gold: { kid: 'Ouro depositado', sci: 'Ouro depositado' },
        skin: { kid: 'Espessura da pele', sci: 'Espessura da pele' },
        lost: { kid: 'Prata perdida', sci: 'Prata dissolvida' },
        idle: { kid: 'Toca no disco de prata', sci: 'Sem medalha no banho' },
        ready: { kid: 'Toca no interruptor', sci: 'Circuito aberto' },
        cath: { kid: 'O ouro está a pousar na medalha', sci: 'Cátodo: Au(I) + e- dá Au' },
        enough: { kid: 'Uma medalha a sério tem 6 g!', sci: '6 g: o mínimo das regras' },
        anode: { kid: 'A medalha está a perder prata!', sci: 'Ânodo: a prata dissolve-se' },
      },
      panel: {
        kid: [
          'O ouro põe-se na prata com eletricidade: chama-se eletrodeposição. O disco de prata fica pendurado num banho com ouro lá dentro, do lado do menos. A fonte de alimentação empurra eletrões para o disco, e o ouro do banho agarra-os e fica preso numa camada de ouro.',
          'A medalha aqui está cerca de 8 vezes maior do que uma verdadeira, e o banho corre 450 vezes mais depressa do que na vida real. Arrasta a corrente: com mais corrente, o ouro deposita-se mais depressa. Troca as pinças e a medalha perde prata em vez disso. Porquê? O lado do mais tira eletrões à prata, e os átomos de prata saem a flutuar.',
        ],
        sci: [
          'A eletrodeposição é o modo habitual de dourar uma medalha: o disco é o cátodo (menos) num banho de ouro. O ouro(I) do banho está num ião complexo como Au(CN)2− ou Au(SO3)23−; a agitação traz-o à superfície, onde cada ouro recebe um eletrão: Au(I) + e− → Au. O outro elétrodo é inerte (titânio revestido de platina).',
          'Lei de Faraday: massa = I·t·M ÷ (z·F). Com M = 196,97 g/mol, z = 1 e F = 96 485 C/mol, um ampere durante uma hora deposita 7,35 g, no máximo (nos banhos reais perde-se alguma corrente). 6 g pedem cerca de 0,8 A durante uma hora. Espalhados por cerca de 138 cm², dão 6 g ÷ 19,282 g/cm³ ÷ 138 cm² = 22 micrómetros.',
          'Inverte as pinças e a medalha é o ânodo: a prata cede eletrões e dissolve-se como iões prata (107,87 g/mol), cerca de 4 g por ampere-hora. Um banho a sério usa um ânodo inerte por esta razão. A sala aumenta a medalha cerca de 8 vezes e faz o banho correr 450 vezes mais depressa.',
        ],
      },
    },
    games: {
      label: 'O pódio',
      hints: { tap: 'Toca num degrau', slide: 'Arrasta o ano' },
      title: 'Quem ganhou o quê?',
      slider: 'Os Jogos',
      buttons: ['Primeiro lugar', 'Segundo lugar', 'Terceiro lugar'],
      years: ['1896', '1900', '1904', '1912', '1920', '2024'],
      rows: [
        {
          head: 'Atenas 1896',
          what: {
            kid: 'Os primeiros Jogos modernos, neste mesmo estádio! O vencedor recebeu uma medalha de prata, um ramo de oliveira e um diploma. O segundo classificado recebeu uma medalha de cobre e um ramo de louro. O terceiro não recebeu nada.',
            sci: 'Atenas, abril de 1896, no Estádio Panatenaico reconstruído em mármore. Os vencedores receberam uma medalha de prata, um ramo de oliveira e um diploma; os segundos classificados uma medalha de cobre (algumas fontes dizem bronze) e um ramo de louro; nada para o terceiro lugar.',
          },
        },
        {
          head: 'Paris 1900',
          what: {
            kid: 'Muitos vencedores receberam taças, troféus ou outros prémios em vez de medalhas. Hoje os registos contam-nos como ouro, prata e bronze.',
            sci: 'Paris, 1900: os Jogos estenderam-se por meses ao lado de uma Exposição Universal, e muitos vencedores receberam taças, troféus ou objetos em vez de medalhas. O COI passou depois a contar os resultados como ouro, prata e bronze.',
          },
        },
        {
          head: 'Saint Louis 1904',
          what: {
            kid: 'Os primeiros Jogos com três medalhas: ouro para o primeiro, prata para o segundo, bronze para o terceiro. As de ouro eram de ouro maciço.',
            sci: 'Saint Louis, 1904: os primeiros Jogos a dar ouro, prata e bronze ao primeiro, segundo e terceiro lugar (algumas fontes dizem 1908). As medalhas de ouro foram de ouro maciço até 1912.',
          },
        },
        {
          head: 'Estocolmo 1912',
          what: {
            kid: 'Os últimos Jogos com medalhas de ouro maciço. Depois disto, as medalhas de ouro são de prata com uma camada de ouro.',
            sci: 'Estocolmo, 1912: as últimas medalhas de ouro olímpicas de ouro maciço. Desde então a medalha do primeiro lugar é de prata com um revestimento de ouro.',
          },
        },
        {
          head: 'Antuérpia 1920',
          what: {
            kid: 'Agora a medalha de ouro é quase toda de prata com ouro por cima, tal como a que douraste.',
            sci: 'Antuérpia, 1920: os primeiros Jogos depois das últimas medalhas de ouro maciço. O primeiro lugar recebe prata dourada.',
          },
        },
        {
          head: 'Paris 2024',
          what: {
            kid: 'Uma medalha de ouro pesa 529 g, mas só 6 g são de ouro. No meio está um hexágono de ferro da Torre Eiffel, de 18 g.',
            sci: 'Paris 2024: ouro 529 g, prata 525 g, bronze 455 g, cada uma com 85 mm de diâmetro e 9,2 mm de espessura, cada uma com um hexágono de 18 g de ferro pudelado da Torre Eiffel. A medalha de ouro tem cerca de 505 g de prata sob pelo menos 6 g de ouro.',
          },
        },
      ],
      says: {
        step: [
          { kid: 'Primeiro lugar: vê a sua medalha cortada ao meio no quadro.', sci: 'Primeiro lugar: a medalha aparece cortada ao meio no quadro.' },
          { kid: 'Segundo lugar: vê a sua medalha cortada ao meio no quadro.', sci: 'Segundo lugar: a medalha aparece cortada ao meio no quadro.' },
          { kid: 'Terceiro lugar: vê a sua medalha cortada ao meio no quadro.', sci: 'Terceiro lugar: a medalha aparece cortada ao meio no quadro.' },
        ],
        none: { kid: 'Não há nada neste degrau: nestes Jogos não se deu nenhum prémio para este lugar.', sci: 'Nestes Jogos não se mostra nenhuma medalha para este lugar.' },
      },
      board: {
        tap: { kid: 'Toca num degrau', sci: 'Toca num degrau para cortar a medalha ao meio' },
        none: { kid: 'Aqui não há nada', sci: 'Sem medalha para este lugar' },
        cup: { kid: 'Uma taça, não uma medalha', sci: 'Uma taça ou outro prémio' },
        step: ['Primeiro lugar', 'Segundo lugar', 'Terceiro lugar'],
      },
      mats: {
        gold: 'ouro maciço',
        silver: 'prata',
        copper: 'cobre',
        bronze: 'bronze',
        bronze24: 'bronze (cobre e zinco)',
        gilded: 'prata sob uma pele de ouro',
        skin: { kid: 'pele de ouro (desenhada muito grossa)', sci: 'pele de ouro (desenhada grossa demais)' },
        hex: 'hexágono de ferro 18 g',
      },
      panel: {
        kid: [
          'Arrasta o ano para viajares pelos Jogos. Nos primeiros Jogos Olímpicos modernos, em 1896, aqui em Atenas, o vencedor recebeu uma medalha de prata e um ramo de oliveira, e o segundo uma medalha de cobre. As medalhas de ouro vieram depois.',
          'Toca num degrau e o quadro mostra a medalha cortada ao meio, para veres de que é feita. As últimas medalhas de ouro maciço foram dadas em 1912. Desde então são de prata com ouro por cima.',
        ],
        sci: [
          'A barra: Atenas 1896, Paris 1900, Saint Louis 1904, Estocolmo 1912, Antuérpia 1920, Paris 2024. As fontes divergem em pormenores dos primeiros Jogos, por isso só se mostra o que têm em comum: em 1896 prata para o primeiro lugar (com ramo de oliveira e diploma) e cobre (alguns dizem bronze) para o segundo; em 1900 muitos prémios foram taças e objetos; a partir de 1904 ouro, prata e bronze; ouro maciço até 1912.',
          'As medalhas de 1896, desenhadas por Jules-Clément Chaplain, foram cunhadas na Monnaie de Paris, que também cunhou as de Paris 2024. O quadro desenha cada corte com a largura certa, mas a pele de ouro grossa demais: na realidade tem alguns centésimos de milímetro.',
        ],
      },
    },
  },
  pl: {
    title: 'Pod złotem',
    greet: {
      kid: 'Cześć! Witaj na Stadionie Panatenajskim w Atenach, gdzie w 1896 roku odbyły się pierwsze nowożytne igrzyska olimpijskie! Jestem Srebro i chowam się w każdym złotym medalu. Wypróbuj trzy stanowiska: zdejmij skórkę z medalu, pozłoć srebrny krążek i zobacz, kto co dostał. Historia obrazka jest na sztalugach.',
      sci: 'Stadion Panatenajski w Atenach o zmierzchu, marmurowa podkowa, na której rozegrano igrzyska 1896 roku. Trzy stanowiska: co kryje się pod złotem złotego medalu, jak srebro się złoci galwanicznie i z czego były medale różnych igrzysk. Historia obrazka jest na sztalugach.',
    },
    talk: {
      kid: [
        'Srebro błyszczy mocniej niż każdy inny metal i kosztuje dużo mniej niż złoto, więc złoty medal to prawie same srebro z cieniutką złotą powłoką.',
        'Jestem srebro, numer 47 w układzie okresowym. Mój symbol to Ag, od łacińskiego argentum, czyli srebro.',
        'Tylko pierwsze miejsce dostaje złoto. Srebrny medal jest ze srebra na wylot.',
      ],
      sci: [
        'Srebro próby 925 to co najmniej 92,5% srebra w masie; reszta, zwykle miedź, czyni je twardszym od czystego srebra. Przepisy wymagają go w medalach za pierwsze i drugie miejsce.',
        'Srebro, Ag, Z = 47: gęstość 10,501 g/cm³ wobec 19,282 złota, więc ta sama objętość złota waży około 1,8 raza więcej.',
        'Złoty medal z Paryża 2024 ma średnicę 85 mm i grubość 9,2 mm: około 505 g srebra, 18 g żelaza i 6 g złota.',
      ],
    },
    under: {
      label: 'Złoty medal',
      hints: { peel: 'Dotknij rogu medalu', weigh: 'Dotknij wagi', hex: 'Dotknij żelaznego sześciokąta', again: 'Dotknij czegokolwiek jeszcze raz' },
      title: 'Co jest pod złotem?',
      buttons: { peel: 'Zdejmij złotą skórkę', weigh: 'Zważ go', hex: 'Żelazny sześciokąt' },
      says: {
        peel: {
          kid: 'Patrz! Pod cieniutką złotą skórką jest srebro, szare i błyszczące. W soczewce widać atomy: złoto na wierzchu, srebro pod spodem i kilka pomarańczowych atomów miedzi wmieszanych w srebro.',
          sci: 'Skórka to tylko około 22 mikrometrów złota (6 g na około 138 cm²). Pod nią jest srebro próby: jeśli dokładnie 925 na 1000, co ósmy atom to miedź.',
        },
        unpeel: {
          kid: 'Skórka wraca na miejsce: złoto na zewnątrz, srebro w środku.',
          sci: 'Skórka z powrotem: około 6 g złota na około 505 g srebra.',
        },
        weigh: {
          kid: 'Prawdziwy medal waży 529 g. Kopia tej samej wielkości, cała ze złota, ważyłaby prawie dwa razy więcej, około 950 g, i kosztowałaby dziesiątki tysięcy euro.',
          sci: '505 g srebra i 6 g złota zajmują około 48,4 cm³. Ta objętość złota waży 933 g; z 18 g żelaza daje to około 950 g, wobec prawdziwych 529 g. Obliczone z gęstości, więc tylko „około”.',
        },
        unweigh: { kid: 'Szalki są znów puste.', sci: 'Szalki puste.' },
        hex: {
          kid: 'W środku każdego medalu z Paryża 2024 tkwi sześciokąt z żelaza z wieży Eiffla! Żelazo ma własną salę, a wieża jest na jednym z jej obrazów.',
          sci: 'Sześciokąt to 18 g żelaza pudlarskiego z wieży Eiffla, wprawione w środek każdego medalu. Sala żelaza opowiada, jak zbudowano wieżę.',
        },
        unhex: { kid: 'Sześciokąt wraca na miejsce.', sci: 'Sześciokąt z powrotem na miejscu.' },
      },
      hex: {
        title: 'Żelazo z wieży Eiffla',
        line: {
          kid: 'Sześciokąt z żelaza, 18 g, w środku każdego medalu z Paryża 2024.',
          sci: '18 g żelaza pudlarskiego z wieży Eiffla, wprawione w każdy medal z Paryża 2024.',
        },
        go: 'Zobacz salę żelaza',
      },
      ironLink: 'Sala żelaza',
      scale: {
        real: { kid: 'Prawdziwy medal', sci: 'Prawdziwy złoty medal' },
        copy: { kid: 'Kopia z litego złota', sci: 'Ta sama wielkość, lite złoto' },
        copyG: { kid: 'około 950 g', sci: 'około 950 g' },
        price: { kid: 'dziesiątki tysięcy euro', sci: 'dziesiątki tysięcy euro' },
        same: { kid: 'prawie same srebro', sci: '505 g Ag, 6 g Au, 18 g Fe' },
      },
      panel: {
        kid: [
          'Złoty medal to prawie same srebro! Na igrzyskach w Paryżu w 2024 roku ważył 529 g, ale tylko 6 g to było złoto: cienka złota skórka na srebrze, a w środku sześciokąt z żelaza z wieży Eiffla.',
          'Dlaczego nie z litego złota? Złoto jest bardzo ciężkie i bardzo drogie. Medal z litego złota tej samej wielkości ważyłby prawie dwa razy więcej. Dotknij rogu, żeby zdjąć skórkę, wagi, żeby zważyć, i sześciokąta, żeby zobaczyć, skąd jest żelazo.',
        ],
        sci: [
          'Paryż 2024: medale 85 mm na 9,2 mm; złoty 529 g (około 505 g srebra, co najmniej 6 g złota i 18 g żelaza), srebrny 525 g, brązowy 455 g. Przepisy olimpijskie wymagają w medalach za pierwsze i drugie miejsce srebra próby co najmniej 925 na 1000, a w złotym pozłoty co najmniej 6 g czystego złota.',
          'Skórka: 6 g złota na około 138 cm² (dwie strony i brzeg) to 6 g ÷ 19,282 g/cm³ ÷ 138 cm² = 22 mikrometry, około 90 000 warstw atomów. W soczewce złoto ma trzy warstwy; prawdziwa skórka jest tysiące razy grubsza. Srebro próby 925 na 1000 w masie to około 12% miedzi pod względem liczby atomów: co ósmy.',
          'Kopia z litego złota: 505 g ÷ 10,501 g/cm³ + 6 g ÷ 19,282 g/cm³ = 48,4 cm³ metalu. Ze złota waży 933 g, a z 18-gramowym sześciokątem około 950 g. Obliczone, nie zważone. Cena złota zmienia się codziennie: chodzi tylko o rząd wielkości.',
        ],
      },
    },
    gild: {
      label: 'Stół wytwórcy medali',
      hints: { hang: 'Dotknij srebrnego krążka', switch: 'Dotknij wyłącznika', stop: 'Dotknij wyłącznika, by wyłączyć', lift: 'Dotknij medalu, by go wyjąć', again: 'Dotknij krążka, by go znów zawiesić' },
      title: 'Pozłoć go',
      slider: 'Natężenie prądu',
      buttons: { hang: 'Zawieś lub wyjmij krążek', switch: 'Włącz lub wyłącz', swap: 'Zamień klipsy', fresh: 'Nowy srebrny krążek' },
      says: {
        hang: {
          kid: 'Krążek wisi w złotej kąpieli. Teraz dotknij wyłącznika.',
          sci: 'Krążek wisi w kąpieli ze złotem. Gdy płynie prąd, jest katodą, jeśli czarny klips (minus) jest na jego pręcie.',
        },
        lift: { kid: 'Krążek wychodzi z kąpieli.', sci: 'Krążek poza kąpielą.' },
        noMedal: {
          kid: 'Wyłącznik jeszcze nic nie robi: w kąpieli nie ma medalu. Najpierw dotknij srebrnego krążka.',
          sci: 'Bez medalu w kąpieli nie ma obwodu: prąd nie popłynie. Najpierw zawieś krążek.',
        },
        runCath: {
          kid: 'Prąd włączony! Drobinki złota z kąpieli lądują na medalu i się do niego przyklejają, a srebro robi się złote. Licznik pokazuje, ile ich jest.',
          sci: 'Prąd włączony, medal jako katoda (minus): każdy jon złota przyjmuje na powierzchni jeden elektron i staje się atomem złota. Według Faradaya jeden amper przez godzinę osadza najwyżej około 7,35 g złota.',
        },
        runAnode: {
          kid: 'Uwaga: medal jest teraz po stronie plusa! Zamiast dostawać złoto, traci srebro do kąpieli. Patrz, jak szare drobinki odpływają.',
          sci: 'Medal jest anodą (plus): jego atomy srebra oddają elektrony i rozpuszczają się jako jony srebra, około 4 g na amperogodzinę. Złoto się nie osadza.',
        },
        stop: { kid: 'Prąd wyłączony.', sci: 'Prąd wyłączony.' },
        swap: {
          kid: 'Klipsy zamienione: teraz medal jest po stronie plusa. Włącz i zobacz, co dzieje się z jego srebrem.',
          sci: 'Biegunowość odwrócona: medal jest teraz anodą (plus).',
        },
        swapBack: {
          kid: 'Znów zamienione: medal jest z powrotem po stronie minusa, gdzie osadza się złoto.',
          sci: 'Biegunowość przywrócona: medal znów jest katodą (minus).',
        },
        fresh: { kid: 'Nowy srebrny krążek wisi na haczyku.', sci: 'Nowy srebrny krążek na haczyku.' },
        half: { kid: 'Połowa złota prawdziwego medalu! To 3 g.', sci: 'Osadzone 3 g: połowa z 6 g wymaganych przez przepisy.' },
        full: {
          kid: '6 g: tyle złota ma prawdziwy złoty medal. Masz już taki medal!',
          sci: '6 g: minimum wymagane przez przepisy dla złotego medalu. Skórka ma około 22 mikrometrów grubości, mniej więcej jedną trzecią grubości włosa.',
        },
        lost: {
          kid: '2 g srebra rozpuściły się w kąpieli. Złoto osadza się po stronie minusa; srebro odchodzi od strony plusa.',
          sci: 'Rozpuszczone 2 g srebra. Dlatego prawdziwa kąpiel do złocenia ma anodę obojętną, która się nie rozpuszcza.',
        },
        enough: {
          kid: 'To już dwa razy tyle, ile potrzeba medalowi, więc zasilacz się zatrzymuje.',
          sci: 'Osadzone 12 g, dwa razy minimum: zasilacz zatrzymuje się tutaj.',
        },
      },
      board: {
        current: { kid: 'Natężenie', sci: 'Natężenie prądu' },
        time: { kid: 'Czas', sci: 'Czas (przyspieszony 450 razy)' },
        gold: { kid: 'Osadzone złoto', sci: 'Osadzone złoto' },
        skin: { kid: 'Grubość skórki', sci: 'Grubość warstwy' },
        lost: { kid: 'Utracone srebro', sci: 'Rozpuszczone srebro' },
        idle: { kid: 'Dotknij srebrnego krążka', sci: 'Brak medalu w kąpieli' },
        ready: { kid: 'Dotknij wyłącznika', sci: 'Obwód otwarty' },
        cath: { kid: 'Złoto ląduje na medalu', sci: 'Katoda: Au(I) + e- daje Au' },
        enough: { kid: 'Prawdziwy medal ma 6 g!', sci: '6 g: minimum z przepisów' },
        anode: { kid: 'Medal traci srebro!', sci: 'Anoda: srebro się rozpuszcza' },
      },
      panel: {
        kid: [
          'Złoto nakłada się na srebro prądem: to się nazywa złocenie galwaniczne. Srebrny krążek wisi w kąpieli ze złotem, po stronie minusa. Zasilacz wpycha elektrony na krążek, a złoto z kąpieli je chwyta i przykleja się jako warstwa złota.',
          'Medal jest tu około 8 razy większy niż prawdziwy, a kąpiel biegnie 450 razy szybciej niż w prawdziwym życiu. Przeciągnij natężenie: im większy prąd, tym szybciej osadza się złoto. Zamień klipsy, a medal zacznie tracić srebro. Dlaczego? Strona plusa zabiera srebru elektrony i atomy srebra odpływają.',
        ],
        sci: [
          'Złocenie galwaniczne to zwykły sposób złocenia medalu: krążek jest katodą (minus) w kąpieli ze złotem. Złoto(I) w kąpieli jest w jonie kompleksowym, takim jak Au(CN)2− lub Au(SO3)23−; mieszanie przynosi je do powierzchni, gdzie każdy atom złota przyjmuje jeden elektron: Au(I) + e− → Au. Druga elektroda jest obojętna (tytan pokryty platyną).',
          'Prawo Faradaya: masa = I·t·M ÷ (z·F). Dla M = 196,97 g/mol, z = 1 i F = 96 485 C/mol jeden amper przez godzinę osadza 7,35 g, najwyżej (w prawdziwych kąpielach część prądu się marnuje). 6 g wymaga około 0,8 A przez godzinę. Rozłożone na około 138 cm² daje to 6 g ÷ 19,282 g/cm³ ÷ 138 cm² = 22 mikrometry.',
          'Odwróć klipsy, a medal jest anodą: srebro oddaje elektrony i rozpuszcza się jako jony srebra (107,87 g/mol), około 4 g na amperogodzinę. Prawdziwa kąpiel używa z tego powodu anody obojętnej. Sala powiększa medal około 8 razy i puszcza kąpiel 450 razy szybciej.',
        ],
      },
    },
    games: {
      label: 'Podium',
      hints: { tap: 'Dotknij stopnia', slide: 'Przeciągnij rok' },
      title: 'Kto co dostał?',
      slider: 'Igrzyska',
      buttons: ['Pierwsze miejsce', 'Drugie miejsce', 'Trzecie miejsce'],
      years: ['1896', '1900', '1904', '1912', '1920', '2024'],
      rows: [
        {
          head: 'Ateny 1896',
          what: {
            kid: 'Pierwsze nowożytne igrzyska, na tym właśnie stadionie! Zwycięzca dostał srebrny medal, gałązkę oliwną i dyplom. Drugi dostał medal z miedzi i gałązkę laurową. Trzeci nie dostał nic.',
            sci: 'Ateny, kwiecień 1896, Stadion Panatenajski odbudowany z marmuru. Zwycięzcy dostawali srebrny medal, gałązkę oliwną i dyplom; zdobywcy drugich miejsc medal z miedzi (niektóre źródła mówią: z brązu) i gałązkę laurową; za trzecie miejsce nic.',
          },
        },
        {
          head: 'Paryż 1900',
          what: {
            kid: 'Wielu zwycięzców dostało puchary, trofea lub inne nagrody zamiast medali. Dziś zapisy liczą je jako złoto, srebro i brąz.',
            sci: 'Paryż, 1900: igrzyska rozciągnięto na miesiące obok wystawy światowej, a wielu zwycięzców dostało puchary, trofea lub przedmioty zamiast medali. MKOl policzył później te wyniki jako złoto, srebro i brąz.',
          },
        },
        {
          head: 'St. Louis 1904',
          what: {
            kid: 'Pierwsze igrzyska z trzema medalami: złoto za pierwsze miejsce, srebro za drugie, brąz za trzecie. Złote były z litego złota.',
            sci: 'St. Louis, 1904: pierwsze igrzyska, na których dawano złoto, srebro i brąz za pierwsze, drugie i trzecie miejsce (niektóre źródła mówią: 1908). Złote medale były z litego złota do 1912 roku.',
          },
        },
        {
          head: 'Sztokholm 1912',
          what: {
            kid: 'Ostatnie igrzyska z medalami z litego złota. Potem złote medale są ze srebra z powłoką ze złota.',
            sci: 'Sztokholm, 1912: ostatnie olimpijskie złote medale z litego złota. Od tamtej pory medal za pierwsze miejsce jest ze srebra pokrytego złotem.',
          },
        },
        {
          head: 'Antwerpia 1920',
          what: {
            kid: 'Teraz złoty medal to prawie same srebro ze złotem na wierzchu, tak jak ten, który tu pozłacasz.',
            sci: 'Antwerpia, 1920: pierwsze igrzyska po ostatnich medalach z litego złota. Pierwsze miejsce dostaje srebro pozłacane.',
          },
        },
        {
          head: 'Paryż 2024',
          what: {
            kid: 'Złoty medal waży 529 g, ale tylko 6 g to złoto. W środku tkwi sześciokąt z żelaza z wieży Eiffla, 18 g.',
            sci: 'Paryż 2024: złoty 529 g, srebrny 525 g, brązowy 455 g, każdy o średnicy 85 mm i grubości 9,2 mm, każdy z 18-gramowym sześciokątem z żelaza pudlarskiego z wieży Eiffla. Złoty medal to około 505 g srebra pod co najmniej 6 g złota.',
          },
        },
      ],
      says: {
        step: [
          { kid: 'Pierwsze miejsce: zobacz jego medal przekrojony na tablicy.', sci: 'Pierwsze miejsce: medal pokazany w przekroju na tablicy.' },
          { kid: 'Drugie miejsce: zobacz jego medal przekrojony na tablicy.', sci: 'Drugie miejsce: medal pokazany w przekroju na tablicy.' },
          { kid: 'Trzecie miejsce: zobacz jego medal przekrojony na tablicy.', sci: 'Trzecie miejsce: medal pokazany w przekroju na tablicy.' },
        ],
        none: { kid: 'Na tym stopniu nic nie leży: za to miejsce na tych igrzyskach nie dawano nagrody.', sci: 'Dla tego miejsca na tych igrzyskach nie pokazano medalu.' },
      },
      board: {
        tap: { kid: 'Dotknij stopnia', sci: 'Dotknij stopnia, by przekroić jego medal' },
        none: { kid: 'Nic tu nie ma', sci: 'Brak medalu dla tego miejsca' },
        cup: { kid: 'Puchar, nie medal', sci: 'Puchar lub inna nagroda' },
        step: ['Pierwsze miejsce', 'Drugie miejsce', 'Trzecie miejsce'],
      },
      mats: {
        gold: 'lite złoto',
        silver: 'srebro',
        copper: 'miedź',
        bronze: 'brąz',
        bronze24: 'brąz (miedź i cynk)',
        gilded: 'srebro pod skórką ze złota',
        skin: { kid: 'złota skórka (narysowana za gruba)', sci: 'złota warstwa (narysowana o wiele za gruba)' },
        hex: 'żelazny sześciokąt 18 g',
      },
      panel: {
        kid: [
          'Przeciągnij rok, żeby podróżować przez igrzyska. Na pierwszych nowożytnych igrzyskach w 1896 roku, tu w Atenach, zwycięzca dostał srebrny medal i gałązkę oliwną, a drugi medal z miedzi. Złote medale przyszły później.',
          'Dotknij stopnia, a tablica pokaże jego medal w przekroju, żeby zobaczyć, z czego jest zrobiony. Ostatnie medale z litego złota rozdano w 1912 roku. Od tamtej pory są ze srebra ze złotem na wierzchu.',
        ],
        sci: [
          'Suwak: Ateny 1896, Paryż 1900, St. Louis 1904, Sztokholm 1912, Antwerpia 1920, Paryż 2024. Źródła różnią się w szczegółach wczesnych igrzysk, więc pokazano tylko to, co mają wspólne: w 1896 srebro za pierwsze miejsce (z gałązką oliwną i dyplomem) i miedź (niektóre mówią: brąz) za drugie; w 1900 wiele nagród to puchary i przedmioty; od 1904 złoto, srebro i brąz; lite złoto do 1912.',
          'Medale z 1896 roku, zaprojektowane przez Jules’a-Clémenta Chaplaina, wybiła Monnaie de Paris, która wybiła też medale z Paryża 2024. Tablica rysuje każdy przekrój w prawdziwej szerokości, ale złotą warstwę o wiele za grubo: naprawdę ma ona kilka setnych milimetra.',
        ],
      },
    },
  },
  de: {
    title: 'Unter dem Gold',
    greet: {
      kid: 'Hallo! Willkommen im Panathenäischen Stadion in Athen, wo 1896 die allerersten modernen Olympischen Spiele stattfanden! Ich bin das Silber und stecke in jeder Goldmedaille. Probier die drei Stationen aus: Zieh einer Medaille die Haut ab, vergolde eine silberne Scheibe und sieh, wer was bekam. Die Geschichte des Bildes steht auf der Staffelei.',
      sci: 'Das Panathenäische Stadion in Athen im Abendlicht, das marmorne Hufeisen, in dem die Spiele von 1896 ausgetragen wurden. Drei Stationen: was unter dem Gold einer Goldmedaille liegt, wie Silber galvanisch vergoldet wird und woraus die Medaillen verschiedener Spiele bestanden. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Silber glänzt heller als jedes andere Metall und kostet viel weniger als Gold, darum besteht eine Goldmedaille fast ganz aus Silber mit einer dünnen goldenen Schicht.',
        'Ich bin das Silber, Nummer 47 im Periodensystem. Mein Zeichen ist Ag, von argentum, dem lateinischen Wort für Silber.',
        'Nur der erste Platz bekommt Gold. Die Silbermedaille ist durch und durch aus Silber.',
      ],
      sci: [
        'Sterlingsilber besteht zu mindestens 92,5% aus Silber (Massenanteil); der Rest, meist Kupfer, macht es härter als reines Silber. Die Regeln verlangen es für die Medaillen von Platz eins und zwei.',
        'Silber, Ag, Z = 47: Dichte 10,501 g/cm³ gegenüber 19,282 beim Gold, das gleiche Volumen Gold wiegt also etwa 1,8-mal so viel.',
        'Eine Goldmedaille von Paris 2024 ist 85 mm breit und 9,2 mm dick: etwa 505 g Silber, 18 g Eisen und 6 g Gold.',
      ],
    },
    under: {
      label: 'Die Goldmedaille',
      hints: { peel: 'Berühre die Ecke der Medaille', weigh: 'Berühre die Waage', hex: 'Berühre das Eisen-Sechseck', again: 'Berühre noch einmal etwas' },
      title: 'Was ist unter dem Gold?',
      buttons: { peel: 'Die Goldhaut abziehen', weigh: 'Wiegen', hex: 'Das Eisen-Sechseck' },
      says: {
        peel: {
          kid: 'Schau! Unter der dünnen goldenen Haut ist Silber, grau und glänzend. In der Lupe siehst du die Atome: oben Gold, darunter Silber und ein paar orangefarbene Kupferatome mitten im Silber.',
          sci: 'Die Haut ist nur etwa 22 Mikrometer Gold (6 g auf rund 138 cm²). Darunter liegt Sterlingsilber: Bei genau 925 Teilen von 1000 ist etwa jedes achte Atom Kupfer.',
        },
        unpeel: {
          kid: 'Die Haut ist wieder drauf: außen Gold, innen Silber.',
          sci: 'Haut wieder drauf: etwa 6 g Gold über etwa 505 g Silber.',
        },
        weigh: {
          kid: 'Die echte Medaille wiegt 529 g. Eine gleich große Kopie ganz aus Gold wöge fast doppelt so viel, etwa 950 g, und kostete Zehntausende Euro.',
          sci: '505 g Silber und 6 g Gold füllen etwa 48,4 cm³. Als Gold wöge dieses Volumen 933 g; mit den 18 g Eisen sind es etwa 950 g, gegenüber den echten 529 g. Aus den Dichten berechnet, darum nur „etwa“.',
        },
        unweigh: { kid: 'Die Schalen sind wieder leer.', sci: 'Schalen leer.' },
        hex: {
          kid: 'In der Mitte jeder Medaille von Paris 2024 sitzt ein Sechseck aus Eisen vom Eiffelturm! Das Eisen hat seine eigene Halle, und der Turm ist auf einem ihrer Bilder.',
          sci: 'Das Sechseck sind 18 g Puddeleisen vom Eiffelturm, in die Mitte jeder Medaille eingesetzt. Die Halle des Eisens erzählt, wie der Turm gebaut wurde.',
        },
        unhex: { kid: 'Das Sechseck sinkt zurück an seinen Platz.', sci: 'Sechseck wieder an seinem Platz.' },
      },
      hex: {
        title: 'Eisen vom Eiffelturm',
        line: {
          kid: 'Ein Sechseck aus Eisen, 18 g, in der Mitte jeder Medaille von Paris 2024.',
          sci: '18 g Puddeleisen vom Eiffelturm, in jede Medaille von Paris 2024 eingesetzt.',
        },
        go: 'Zur Halle des Eisens',
      },
      ironLink: 'Die Halle des Eisens',
      scale: {
        real: { kid: 'Die echte Medaille', sci: 'Echte Goldmedaille' },
        copy: { kid: 'Eine Kopie aus massivem Gold', sci: 'Gleiche Größe, massives Gold' },
        copyG: { kid: 'etwa 950 g', sci: 'etwa 950 g' },
        price: { kid: 'Zehntausende Euro', sci: 'Zehntausende Euro' },
        same: { kid: 'fast ganz Silber', sci: '505 g Ag, 6 g Au, 18 g Fe' },
      },
      panel: {
        kid: [
          'Eine Goldmedaille ist fast ganz aus Silber! Bei den Spielen in Paris 2024 wog sie 529 g, aber nur 6 g davon waren Gold: eine dünne goldene Haut über dem Silber, mit einem Sechseck aus Eisen vom Eiffelturm in der Mitte.',
          'Warum nicht aus massivem Gold? Gold ist sehr schwer und sehr teuer. Eine gleich große Medaille aus massivem Gold wöge fast doppelt so viel. Berühre die Ecke, um die Haut abzuziehen, die Waage zum Wiegen und das Sechseck, um zu sehen, woher das Eisen kam.',
        ],
        sci: [
          'Paris 2024: Medaillen 85 mm mal 9,2 mm; Gold 529 g (etwa 505 g Silber, mindestens 6 g Gold und 18 g Eisen), Silber 525 g, Bronze 455 g. Die olympischen Regeln verlangen für Platz eins und zwei Silber mit mindestens 925 Tausendteilen und für die Goldmedaille eine Vergoldung mit mindestens 6 g reinem Gold.',
          'Die Haut: 6 g Gold auf etwa 138 cm² (zwei Flächen und der Rand) sind 6 g ÷ 19,282 g/cm³ ÷ 138 cm² = 22 Mikrometer, etwa 90 000 Atomlagen. In der Lupe ist das Gold drei Lagen tief; die wirkliche Haut ist tausendfach dicker. Sterling mit 925/1000 Massenanteil ist etwa zu 12% Kupfer, gezählt in Atomen: jedes achte.',
          'Die Kopie aus massivem Gold: 505 g ÷ 10,501 g/cm³ + 6 g ÷ 19,282 g/cm³ = 48,4 cm³ Metall. Als Gold wiegt das 933 g, mit dem 18-g-Sechseck etwa 950 g. Berechnet, nicht gewogen. Der Goldpreis ändert sich täglich: Gemeint ist nur die Größenordnung.',
        ],
      },
    },
    gild: {
      label: 'Die Werkbank des Medaillenmachers',
      hints: { hang: 'Berühre die Silberscheibe', switch: 'Berühre den Schalter', stop: 'Berühre den Schalter zum Ausschalten', lift: 'Berühre die Medaille, um sie herauszuheben', again: 'Berühre die Scheibe, um sie wieder aufzuhängen' },
      title: 'Vergolde sie',
      slider: 'Stromstärke',
      buttons: { hang: 'Scheibe aufhängen oder herausheben', switch: 'Ein- oder ausschalten', swap: 'Die Klemmen tauschen', fresh: 'Eine neue Silberscheibe' },
      says: {
        hang: {
          kid: 'Die Scheibe hängt im goldenen Bad. Berühre jetzt den Schalter.',
          sci: 'Die Scheibe hängt im Goldbad. Bei eingeschaltetem Strom ist sie die Kathode, wenn die schwarze Klemme (Minus) an ihrer Stange sitzt.',
        },
        lift: { kid: 'Die Scheibe kommt aus dem Bad.', sci: 'Scheibe aus dem Bad.' },
        noMedal: {
          kid: 'Der Schalter tut noch nichts: Im Bad hängt keine Medaille. Berühre zuerst die Silberscheibe.',
          sci: 'Ohne Medaille im Bad gibt es keinen Stromkreis: Es kann kein Strom fließen. Hänge zuerst die Scheibe auf.',
        },
        runCath: {
          kid: 'Strom an! Winzige Goldstückchen aus dem Bad landen auf der Medaille und bleiben kleben, und das Silber wird golden. Der Zähler zeigt, wie viel.',
          sci: 'Strom an, die Medaille als Kathode (Minus): Jedes Goldion nimmt an der Oberfläche ein Elektron auf und wird zum Goldatom. Nach Faraday scheidet ein Ampere in einer Stunde höchstens etwa 7,35 g Gold ab.',
        },
        runAnode: {
          kid: 'Vorsicht: Die Medaille hängt jetzt am Pluspol! Statt Gold zu bekommen, verliert sie Silber ans Bad. Sieh zu, wie die grauen Teilchen davontreiben.',
          sci: 'Die Medaille ist die Anode (Plus): Ihre Silberatome geben Elektronen ab und lösen sich als Silberionen, etwa 4 g je Amperestunde. Es wird kein Gold abgeschieden.',
        },
        stop: { kid: 'Strom aus.', sci: 'Strom aus.' },
        swap: {
          kid: 'Du hast die Klemmen getauscht: Jetzt hängt die Medaille am Pluspol. Schalte ein und sieh, was mit ihrem Silber geschieht.',
          sci: 'Polung umgekehrt: Die Medaille ist jetzt die Anode (Plus).',
        },
        swapBack: {
          kid: 'Wieder getauscht: Die Medaille hängt wieder am Minuspol, wo das Gold landet.',
          sci: 'Polung wiederhergestellt: Die Medaille ist wieder die Kathode (Minus).',
        },
        fresh: { kid: 'Eine neue Silberscheibe hängt am Haken.', sci: 'Eine neue Silberscheibe am Haken.' },
        half: { kid: 'Die Hälfte des Goldes einer echten Medaille! Das sind 3 g.', sci: '3 g abgeschieden: die Hälfte der 6 g, die die Regeln verlangen.' },
        full: {
          kid: '6 g: so viel Gold hat eine echte Goldmedaille. Du hast eine gemacht!',
          sci: '6 g: das Mindestmaß der Regeln für eine Goldmedaille. Die Haut ist etwa 22 Mikrometer dick, ungefähr ein Drittel der Breite eines Haares.',
        },
        lost: {
          kid: '2 g Silber haben sich im Bad aufgelöst. Gold setzt sich am Minuspol ab; Silber geht vom Pluspol weg.',
          sci: '2 g Silber aufgelöst. Darum hat ein echtes Vergoldungsbad eine inerte Anode, die sich nicht auflöst.',
        },
        enough: {
          kid: 'Das ist schon doppelt so viel, wie eine Medaille braucht, darum hält das Netzteil an.',
          sci: '12 g abgeschieden, das Doppelte des Mindestmaßes: Das Netzteil hält hier an.',
        },
      },
      board: {
        current: { kid: 'Stromstärke', sci: 'Stromstärke' },
        time: { kid: 'Zeit', sci: 'Zeit (450-fach beschleunigt)' },
        gold: { kid: 'Aufgetragenes Gold', sci: 'Abgeschiedenes Gold' },
        skin: { kid: 'Dicke der Haut', sci: 'Schichtdicke' },
        lost: { kid: 'Verlorenes Silber', sci: 'Aufgelöstes Silber' },
        idle: { kid: 'Berühre die Silberscheibe', sci: 'Keine Medaille im Bad' },
        ready: { kid: 'Berühre den Schalter', sci: 'Stromkreis offen' },
        cath: { kid: 'Gold landet auf der Medaille', sci: 'Kathode: Au(I) + e- ergibt Au' },
        enough: { kid: 'Eine echte Medaille hat 6 g!', sci: '6 g: das Mindestmaß der Regeln' },
        anode: { kid: 'Die Medaille verliert Silber!', sci: 'Anode: Silber löst sich auf' },
      },
      panel: {
        kid: [
          'Gold wird mit Strom auf Silber aufgebracht: Das heißt Galvanisieren. Die Silberscheibe hängt in einem Bad mit Gold darin, am Minuspol. Das Netzteil drückt Elektronen auf die Scheibe, und das Gold aus dem Bad schnappt sie sich und bleibt als Goldschicht kleben.',
          'Die Medaille ist hier etwa 8-mal größer als eine echte, und das Bad läuft 450-mal schneller als im echten Leben. Ziehe an der Stromstärke: Mehr Strom, und das Gold setzt sich schneller ab. Tausche die Klemmen, und die Medaille verliert stattdessen Silber. Warum? Der Pluspol nimmt dem Silber Elektronen weg, und Silberatome treiben davon.',
        ],
        sci: [
          'Galvanisieren ist die übliche Art, eine Medaille zu vergolden: Die Scheibe ist die Kathode (Minus) in einem Goldbad. Gold(I) im Bad steckt in einem Komplexion wie Au(CN)2− oder Au(SO3)23−; Rühren bringt es an die Oberfläche, wo jedes Gold ein Elektron aufnimmt: Au(I) + e− → Au. Die andere Elektrode ist inert (platinbeschichtetes Titan).',
          'Faradaysches Gesetz: Masse = I·t·M ÷ (z·F). Mit M = 196,97 g/mol, z = 1 und F = 96 485 C/mol scheidet ein Ampere in einer Stunde 7,35 g ab, höchstens (in echten Bädern geht etwas Strom verloren). 6 g brauchen etwa 0,8 A eine Stunde lang. Auf etwa 138 cm² verteilt sind das 6 g ÷ 19,282 g/cm³ ÷ 138 cm² = 22 Mikrometer.',
          'Vertausche die Klemmen, und die Medaille ist die Anode: Silber gibt Elektronen ab und löst sich als Silberionen (107,87 g/mol), etwa 4 g je Amperestunde. Ein echtes Bad hat aus diesem Grund eine inerte Anode. Der Raum vergrößert die Medaille etwa 8-fach und lässt das Bad 450-mal schneller laufen.',
        ],
      },
    },
    games: {
      label: 'Das Siegerpodest',
      hints: { tap: 'Berühre eine Stufe', slide: 'Ziehe das Jahr' },
      title: 'Wer bekam was?',
      slider: 'Die Spiele',
      buttons: ['Erster Platz', 'Zweiter Platz', 'Dritter Platz'],
      years: ['1896', '1900', '1904', '1912', '1920', '2024'],
      rows: [
        {
          head: 'Athen 1896',
          what: {
            kid: 'Die ersten modernen Spiele, in genau diesem Stadion! Der Sieger bekam eine Silbermedaille, einen Olivenzweig und eine Urkunde. Der Zweite bekam eine Kupfermedaille und einen Lorbeerzweig. Der Dritte bekam nichts.',
            sci: 'Athen, April 1896, im Panathenäischen Stadion, das in Marmor wiederaufgebaut worden war. Sieger erhielten eine Silbermedaille, einen Olivenzweig und eine Urkunde; Zweite eine Medaille aus Kupfer (manche Quellen sagen Bronze) und einen Lorbeerzweig; für den dritten Platz gab es nichts.',
          },
        },
        {
          head: 'Paris 1900',
          what: {
            kid: 'Viele Sieger bekamen Pokale, Trophäen oder andere Preise statt Medaillen. Heute zählen die Rekorde sie als Gold, Silber und Bronze.',
            sci: 'Paris, 1900: Die Spiele zogen sich über Monate neben einer Weltausstellung hin, und viele Sieger erhielten Pokale, Trophäen oder Gegenstände statt Medaillen. Das IOC zählt die Ergebnisse inzwischen als Gold, Silber und Bronze.',
          },
        },
        {
          head: 'St. Louis 1904',
          what: {
            kid: 'Die ersten Spiele mit drei Medaillen: Gold für den Ersten, Silber für den Zweiten, Bronze für den Dritten. Die goldenen waren aus massivem Gold.',
            sci: 'St. Louis, 1904: die ersten Spiele, die Gold, Silber und Bronze für Platz eins, zwei und drei vergaben (manche Quellen sagen 1908). Goldmedaillen waren bis 1912 aus massivem Gold.',
          },
        },
        {
          head: 'Stockholm 1912',
          what: {
            kid: 'Die letzten Spiele mit Medaillen aus massivem Gold. Danach sind Goldmedaillen aus Silber mit einer Goldschicht.',
            sci: 'Stockholm, 1912: die letzten olympischen Goldmedaillen aus massivem Gold. Seitdem besteht die Medaille für Platz eins aus Silber mit einer Goldauflage.',
          },
        },
        {
          head: 'Antwerpen 1920',
          what: {
            kid: 'Jetzt ist die Goldmedaille fast ganz aus Silber mit Gold obendrauf, genau wie die, die du vergoldet hast.',
            sci: 'Antwerpen, 1920: die ersten Spiele nach den letzten Medaillen aus massivem Gold. Platz eins bekommt vergoldetes Silber.',
          },
        },
        {
          head: 'Paris 2024',
          what: {
            kid: 'Eine Goldmedaille wiegt 529 g, aber nur 6 g davon sind Gold. In der Mitte sitzt ein Sechseck aus Eisen vom Eiffelturm, 18 g.',
            sci: 'Paris 2024: Gold 529 g, Silber 525 g, Bronze 455 g, jede 85 mm breit und 9,2 mm dick, jede mit einem 18 g schweren Sechseck aus Puddeleisen vom Eiffelturm. Die Goldmedaille besteht aus etwa 505 g Silber unter mindestens 6 g Gold.',
          },
        },
      ],
      says: {
        step: [
          { kid: 'Erster Platz: Sieh dir seine Medaille durchgeschnitten auf der Tafel an.', sci: 'Erster Platz: Die Medaille ist auf der Tafel im Schnitt gezeigt.' },
          { kid: 'Zweiter Platz: Sieh dir seine Medaille durchgeschnitten auf der Tafel an.', sci: 'Zweiter Platz: Die Medaille ist auf der Tafel im Schnitt gezeigt.' },
          { kid: 'Dritter Platz: Sieh dir seine Medaille durchgeschnitten auf der Tafel an.', sci: 'Dritter Platz: Die Medaille ist auf der Tafel im Schnitt gezeigt.' },
        ],
        none: { kid: 'Auf dieser Stufe liegt nichts: Für diesen Platz gab es bei diesen Spielen keinen Preis.', sci: 'Für diesen Platz ist bei diesen Spielen keine Medaille gezeigt.' },
      },
      board: {
        tap: { kid: 'Berühre eine Stufe', sci: 'Berühre eine Stufe, um ihre Medaille zu durchschneiden' },
        none: { kid: 'Hier ist nichts', sci: 'Keine Medaille für diesen Platz' },
        cup: { kid: 'Ein Pokal, keine Medaille', sci: 'Ein Pokal oder ein anderer Preis' },
        step: ['Erster Platz', 'Zweiter Platz', 'Dritter Platz'],
      },
      mats: {
        gold: 'massives Gold',
        silver: 'Silber',
        copper: 'Kupfer',
        bronze: 'Bronze',
        bronze24: 'Bronze (Kupfer und Zink)',
        gilded: 'Silber unter einer Goldhaut',
        skin: { kid: 'Goldhaut (viel zu dick gezeichnet)', sci: 'Goldhaut (weit zu dick gezeichnet)' },
        hex: 'Eisen-Sechseck 18 g',
      },
      panel: {
        kid: [
          'Ziehe das Jahr, um durch die Spiele zu reisen. Bei den ersten modernen Olympischen Spielen 1896, hier in Athen, bekam der Sieger eine Silbermedaille und einen Olivenzweig, der Zweite eine Kupfermedaille. Goldmedaillen kamen später.',
          'Berühre eine Stufe, und die Tafel zeigt ihre Medaille durchgeschnitten, damit du siehst, woraus sie besteht. Die letzten Medaillen aus massivem Gold wurden 1912 vergeben. Seitdem sind sie aus Silber mit Gold obendrauf.',
        ],
        sci: [
          'Der Regler: Athen 1896, Paris 1900, St. Louis 1904, Stockholm 1912, Antwerpen 1920, Paris 2024. Die Quellen unterscheiden sich in Einzelheiten der frühen Spiele, darum ist nur gezeigt, was sie gemeinsam haben: 1896 Silber für Platz eins (mit Olivenzweig und Urkunde) und Kupfer (manche sagen Bronze) für Platz zwei; 1900 waren viele Preise Pokale und Gegenstände; ab 1904 Gold, Silber und Bronze; massives Gold bis 1912.',
          'Die Medaillen von 1896, entworfen von Jules-Clément Chaplain, wurden in der Monnaie de Paris geprägt, die auch die Medaillen von Paris 2024 prägte. Die Tafel zeichnet jeden Schnitt in der richtigen Breite, die Goldhaut aber weit zu dick: In Wirklichkeit ist sie einige Hundertstelmillimeter stark.',
        ],
      },
    },
  },
}
