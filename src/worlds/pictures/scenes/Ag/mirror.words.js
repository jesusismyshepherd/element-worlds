// The words of silver's mirror room ("What is behind a mirror?"), in English, European Portuguese, Polish and
// German, kid (Explorer) and sci (Scientist). The picture's own story stays in src/content/boards/Ag.js (the
// easel shows it). `{nm}`, `{r}`, `{cm}`, `{g}`, `{p}`, `{d}` and the like are filled in by the room with
// numbers written the language's way. Sources: Porter (Scientific American, 1929, quoted in Mount Wilson's
// "Reflections", June 2016), Humason (PASP 47, 1935), Carnegie's plate H335H, coating makers' reflectance curves.
export const MIRROR_WORDS = {
  en: {
    title: 'The dome on Mount Wilson',
    greet: {
      kid: 'We are inside the great dome on Mount Wilson, California, on a night in the 1920s. The big mirror has come out of the telescope to get a fresh coat of silver. Three things to try. The story of this picture is on the easel beside you.',
      sci: "The dome of the 100-inch Hooker telescope on Mount Wilson, a night in the 1920s. The 2.5 m mirror is out of the telescope for its new silver coat. Three stations: silvering the mirror, comparing mirror metals, and the plate on which Hubble found a Cepheid in Andromeda. The picture's story is on the easel.",
    },
    talk: {
      kid: [
        'Silver sends back more light than any other metal. That is why it makes the brightest mirrors.',
        'Silver goes dull in the air, so the great mirror was given a fresh silver skin about twice a year.',
        'With this telescope, Edwin Hubble found out that our galaxy is not alone in the universe.',
      ],
      sci: [
        'Silver reflects about 95 to 98% of visible light. A film is opaque from about 100 nm, so a coat a few hundred nanometres thick is a mirror.',
        'Tarnish is silver sulfide, made by traces of sulfur compounds in the air. Russell Porter wrote in 1929 that the Hooker mirror was silvered about twice a year.',
        'In 1935 John Strong aluminised the mirror: aluminium holds up in the ultraviolet and lasts far longer than silver.',
      ],
    },
    silver: {
      label: 'Silvering the mirror',
      hints: { acid: 'Tap the acid jar', reducer: 'Tap the reducer jar', silver: 'Tap the silver jar', watch: 'Watch the film grow', dish: 'Tap the little dish', done: 'Slide the minutes' },
      title: 'A skin of silver',
      meter: 'Light sent back',
      meterLine: { kid: 'film: {nm} nm\nsends back {r} of 100', sci: 'film {nm} nm\nreflectance {r}%' },
      cubeLine: { kid: 'all the silver: a cube {cm} cm across', sci: '{cm3} cm3 = {g} g\ncube {cm} cm' },
      jars: { acid: 'Acid', reducer: 'Reducer', silver: 'Silver nitrate in ammonia' },
      says: {
        acid: {
          kid: 'The acid eats the old, dull silver away. Underneath there is bare glass, dark green-blue. It is not a mirror at all!',
          sci: 'Strong acid dissolves the old tarnished coat. What is left is bare glass, which sends back only about 4% of the light.',
        },
        strip: {
          kid: 'The acid washes the new silver off too, and the liquids with it. Back to bare glass: you can start again.',
          sci: 'The acid strips the new film as well and rinses the liquids away: bare glass again.',
        },
        reducer: {
          kid: 'The reducer is on the glass. It is full of spare electrons, but there is no silver yet.',
          sci: 'The reducing agent is on the glass, ready to give electrons, but there are no silver ions yet.',
        },
        silverAlone: {
          kid: 'The silver is on the glass, but nothing happens! The silver in the jar is invisible silver ions, and they need electrons. Pour the reducer too.',
          sci: 'The silver stays dissolved as Ag(NH₃)₂⁺ ions: with no reducing agent there are no electrons to turn them into metal.',
        },
        dirty: {
          kid: 'The old coat is still on! New silver would not stick to old dull silver. Wash it off with the acid first.',
          sci: 'Silver deposited over old tarnish would be uneven and would not stick: strip the coat first.',
        },
        film: {
          kid: 'Both liquids are on the glass and the swabs keep them moving. Silver atoms start to settle.',
          sci: 'Each Ag⁺ takes an electron from the reducer and becomes a silver atom that settles on the glass. The swabs keep fresh liquid moving over it.',
        },
        start: { kid: 'Silver atoms are starting to settle on the glass.', sci: 'Silver atoms are settling on the glass: isolated grains first.' },
        haze: {
          kid: 'A brownish haze. The silver is so thin that light still goes through it.',
          sci: 'Isolated grains and a patchy film, brown by transmission because light still passes through.',
        },
        shine: {
          kid: 'The haze turns shiny and a mirror is appearing. You can see the dome in it!',
          sci: 'The grains join into a continuous film and the reflectance climbs. Light stops passing at about 100 nm.',
        },
        done: {
          kid: 'A mirror! The meter says it sends back {r} of every 100 bits of light. The film is {nm} nm thick, hundreds of times thinner than a hair.',
          sci: 'Film {nm} nm, reflectance {r}% on the meter\'s illustrative curve (fresh silver reflects 95 to 98% of visible light). More than about 100 nm adds little to the reflectance.',
        },
        again: { kid: 'This coat is finished. To start over, wash it off with the acid.', sci: 'Coat finished. Strip it with the acid to run it again.' },
        nofilm: {
          kid: 'There is nothing to grow yet. Pour the acid, the reducer and the silver first.',
          sci: 'No film yet: wash with acid, then apply reducer and silver before running the minutes.',
        },
        dishEmpty: { kid: 'There is no silver on the glass yet.', sci: 'No film yet, so no silver to gather.' },
        dish: {
          kid: 'All the silver of this coat, gathered up, makes a cube only {cm} cm across. It is smaller than a sugar cube ({sugar} cm). Here both are drawn 8 times too big.',
          sci: '{nm} nm over {area} m² is {cm3} cm³ of silver: about {g} g, a cube {cm} cm on a side. Porter (1929) gave a cube about 3/8 inch. Both cubes are drawn 8 times too big.',
        },
      },
      panel: {
        kid: [
          'Before 1835, mirrors were glass backed with a poisonous mix of tin and mercury. Then the chemist Justus von Liebig found how to make silver come out of a clear liquid and coat glass with a skin of shining metal. Astronomers loved it: when the silver went dull, they could wash it off and make a new skin.',
          'Try it yourself. Tap the acid jar to wash off the old silver. Then pour the reducer and the silver jar. The silver in its jar is invisible: silver atoms that have lost an electron, dissolved in ammonia. The reducer gives the electrons back, and real silver atoms drop out of the liquid onto the glass.',
          'The skin is hundreds of times thinner than a hair. All the silver on this 2.5 m mirror would fit in a cube about 1 cm across: tap the little dish to see it. (The cradle here tilts the mirror so that you can see its face.)',
        ],
        sci: [
          "Liebig's silvering (1835): silver nitrate dissolved in ammonia, as the diamminesilver(I) ion Ag(NH₃)₂⁺, is reduced by an aldehyde or a sugar, the reaction of Tollens' test, and silver deposits on glass as a film. Before it, mirrors were backed with a tin-mercury amalgam. Steinheil (1856) and Foucault (1857) silvered the front of figured glass and replaced speculum metal.",
          "The glass must be bare, so the old coat is stripped first with strong acid. Which reducing agent the observatory used is not given in Porter's account (sugar, Rochelle salt and formaldehyde have all been used for big mirrors), so the jar just says reducer. Over the minutes the film goes from isolated grains, brown because light still passes through, to a continuous layer. Light stops passing at about 100 nm; the meter shows an illustrative curve.",
          "Porter (Scientific American, 1929): about three pounds (1.4 kg) of silver nitrate in solution, a film about 1/100 000 inch (254 nm) thick, a new coat about twice a year; all the silver on the disc would make a cube about 3/8 inch on a side. Here: the disc's area, 5.07 m², times 254 nm is 1.29 cm³, about 13.5 g, a cube 1.09 cm across (so most of the silver in the solution ends up elsewhere). John Strong aluminised the mirror in 1935.",
        ],
      },
      tip: 'Drag the slider to run the minutes yourself. Tap the little dish to see all the silver of this coat in one lump.',
      minutes: 'Minutes in the bath',
      buttons: { acid: 'Pour the acid', reducer: 'Pour the reducer', silver: 'Pour the silver', dish: 'Show the dish' },
    },
    metals: {
      label: 'Mirror metals',
      hints: { mirror: 'Tap a mirror', slide: 'Slide the colour', foul: 'Tap the jar of foul air', again: 'Tap the silver mirror' },
      title: 'Which metal shines best?',
      foulLabel: 'Foul air',
      cards: {
        speculum: 'Speculum metal\nNewton, 1668',
        amalgam: 'Tin and mercury\nVenice, 1500s',
        aluminium: 'Aluminium\nHooker, 1935',
        silver: 'Silver\nLiebig, 1835',
        gold: 'Gold\nfor comparison',
      },
      names: { speculum: 'Speculum metal', amalgam: 'Tin and mercury', aluminium: 'Aluminium', silver: 'Silver', gold: 'Gold' },
      chart: { title: 'Light sent back', read: '{name}: {r}%', axis: 'colour of the light, in nanometres', none: 'tap a mirror' },
      bands: { uv: 'ultraviolet, invisible', violet: 'violet', blue: 'blue', green: 'green', yellow: 'yellow', orange: 'orange', red: 'red', ir: 'infrared, invisible' },
      says: {
        speculum: {
          kid: 'Speculum metal is copper and tin, polished. Newton made his telescope mirror of it in 1668. It sends back only about 6 of every 10 bits of light, and it goes dull and has to be polished again.',
          sci: "Speculum metal, about two parts copper to one of tin: reflectance roughly 60 to 65% in the visible, pale and a little pink. It tarnished, and every repolishing risked the mirror's shape.",
        },
        amalgam: {
          kid: "Venice's mirrors were glass backed with tin and mercury. They beat speculum, but the mercury fumes made the mirror makers ill.",
          sci: 'Tin-mercury amalgam on glass (Venice, from the 1500s): roughly 70% (the curve here is a rough estimate), and poisonous to make.',
        },
        aluminium: {
          kid: 'Aluminium sends back about 9 of every 10 bits of light and keeps working even in colours we cannot see. In 1935 the great mirror was given an aluminium skin.',
          sci: 'Aluminium: about 90% across the visible with a dip near 800 nm, and still about 90% far into the ultraviolet. John Strong coated the Hooker mirror with it in 1935, evaporated in a vacuum; a coat lasts far longer than silver.',
        },
        silver: {
          kid: 'Silver is the best in the visible: 95 to 98 of every 100 bits of light. But try violet, and ultraviolet!',
          sci: 'Silver: 95 to 98% of visible light, the best of any metal, but it falls through the violet and almost stops reflecting near 320 nm.',
        },
        gold: {
          kid: 'Gold sends back red and yellow light very well but swallows blue. That is why gold looks gold.',
          sci: 'Gold: above 90% from about 600 nm into the infrared, but only about 40% in the blue. Its electrons absorb blue light, which gives gold its colour.',
        },
        slide: {
          kid: '{nm} nm, {band}. Silver sends back {ag} of 100, aluminium {al}, gold {au}.',
          sci: '{nm} nm ({band}): silver {ag}%, aluminium {al}%, gold {au}%, speculum {sp}%.',
        },
        foul: {
          kid: 'A jar of foul air, with a whiff of rotten eggs. Silver turns black in it. Watch the reading fall!',
          sci: 'Hydrogen sulfide and other sulfur compounds in air turn silver into black silver sulfide, Ag₂S, even in traces. The reading falls as the film darkens (an illustrative curve).',
        },
        tarnished: {
          kid: 'Tarnished! The black stuff soaks up light. This is why the great mirror needed a fresh coat about twice a year.',
          sci: 'Silver now reads {r}% here. A tarnished mirror throws light away, hence the recoating about twice a year.',
        },
        fresh: { kid: 'A fresh coat of silver, bright again. That was the job, about twice a year.', sci: 'Freshly silvered: back to the full curve.' },
      },
      panel: {
        kid: [
          'A mirror is a very smooth sheet of something shiny, but some shiny things are shinier than others. Tap a mirror and a lamp sends a beam at it. The meter tells how much light comes back.',
          'Slide the colour of the light from violet to red and watch each metal. Silver is the best, except in violet. Aluminium keeps working even in colours we cannot see. Gold only likes red and yellow, so it looks yellow.',
          "Silver has one big problem: it tarnishes. Tap the jar of foul air beside the silver mirror and watch the reading. That is why the great telescope's mirror got a new coat of silver about twice a year. Telescopes like Gemini use silver again today, but under a thin, clear, protective layer.",
        ],
        sci: [
          "Reflectance at normal incidence, the share of the light sent back: speculum metal (Newton, 1668) roughly 60 to 65%; tin-mercury amalgam (Venice) roughly 70%; aluminium about 90%; silver 95 to 98%; gold above 90% in the red and infrared. The curves on the chart are smooth approximations of coating makers' published curves, good to a few points (speculum and amalgam only roughly).",
          "Silver's reflectance falls through the violet and near 320 nm it is a few per cent; aluminium stays near 90% from about 200 nm into the near infrared, with a dip near 800 nm. That, and a coat that lasts years, is why the Hooker mirror was aluminised in 1935. Gold absorbs blue (about 40% at 450 nm) and reflects the red and infrared above 90%.",
          "Silver tarnishes into black silver sulfide from traces of sulfur compounds in the air, so the Hooker mirror was resilvered about twice a year (Porter, 1929). Since 2004 the Gemini telescopes' 8.1 m mirrors are silvered again, under a protective layer, because silver radiates so little heat in the infrared.",
        ],
      },
      tip: "Slide the colour of the light. Tap the jar of foul air next to the silver mirror, then 'Silver it again' to start over.",
      wave: 'Colour of the light',
      buttons: { foul: 'Open the jar of foul air', fresh: 'Silver it again' },
    },
    galaxy: {
      label: 'The galaxy hunt',
      hints: { scope: 'Tap the telescope', wait: 'Wait for the plate', plate: 'Tap the glass plate', spots: 'Tap a spot marked N', slide: 'Slide the pulse' },
      title: 'Another galaxy?',
      holder: 'Plate H335H',
      days: 'days',
      curveAxis: 'days',
      boards: { curve: 'The star over the days', dist: 'How far away?' },
      plates: { older: 'older plate', now: '5 to 6 October 1923, 45 minutes' },
      says: {
        point: {
          kid: 'The dome turns, the slit swings to Andromeda and the telescope follows it. The starlight now collects on a glass plate. 45 minutes pass in a few seconds.',
          sci: 'Dome and telescope slewed to Andromeda (M31). Plate H335H, the night of 5 to 6 October 1923: a 45-minute exposure, sped up here.',
        },
        away: { kid: 'The telescope turns back to the Milky Way.', sci: 'Telescope turned back to the Milky Way; the dome follows.' },
        expoDone: { kid: 'The plate is full of stars! Tap it to put it on the light box.', sci: 'Exposure complete, 45 minutes. Tap the plate to look at it on the light box.' },
        noScope: { kid: 'Point the telescope at Andromeda first.', sci: 'Slew the telescope to Andromeda before exposing.' },
        plateOn: {
          kid: 'On the light box, stars are black dots. Hubble was hunting for new stars that flash up bright, called novae. He marked three with an N. Tap each N, and compare it with the older plate beside it.',
          sci: 'On the light box the plate is a negative: stars are dark. Hubble marked three candidate novae with N; a nova should be absent from earlier plates. Compare each with the older plate beside it.',
        },
        noPlate: { kid: 'There is no plate yet. Point the telescope and wait for the exposure.', sci: 'No exposed plate yet: slew the telescope and let the exposure run.' },
        faint: { kid: 'Too faint to see yet: the plate needs more exposure.', sci: 'Not enough exposure yet to show that star.' },
        nova: {
          kid: 'It is not on the older plate, so it looks like a nova: a star that flared up.',
          sci: 'Absent from the older plate and present on the new one: consistent with a nova.',
        },
        var: {
          kid: 'Look! This star is on the older plate too, but fainter. It is not a new star: its light goes up and down. Hubble crossed out the N and wrote VAR!',
          sci: 'Present on the older plate at a different brightness: not a nova but a variable. Hubble crossed out the N and wrote VAR! on the plate.',
        },
        curve: {
          kid: 'Every 31 days the star swells bright, fades, and swells again, over and over. A star that pulses like this is called a Cepheid.',
          sci: 'A Cepheid variable: a regular pulse of 31.4 days with a quick rise and a slow fall (a typical Cepheid shape, not Hubble\'s own measurements).',
        },
        slide: {
          kid: 'A star that pulses every {p} days is really about {l} times brighter than the Sun. It looks very faint, so it must be {d} light-years away.',
          sci: 'P = {p} d gives M = {M} mag, L = {l} suns. At a fixed apparent magnitude of about 19, the distance is {d} ly.',
        },
        old: {
          kid: "These are Hubble's numbers of 1925, as large as anyone dared then.",
          sci: '1925 zero point of the period-luminosity relation: about 930 000 ly (285 000 pc), usually quoted as about 900 000 ly.',
        },
        now: {
          kid: "And today's numbers: more than twice as far. Andromeda is a whole galaxy, far outside ours!",
          sci: "With today's calibration the same star is about 2.5 million ly away: Baade (1952) found two kinds of Cepheids and doubled the scale; better calibrations and dust corrections followed.",
        },
      },
      board: {
        kid: 'pulse: {p} days\nreally: {l} Suns\nfar: {d} light-years',
        sci: 'P = {p} d\nM = {M}, L = {l} suns\nd = {d} ly',
      },
      panel: {
        kid: [
          "In 1923 many astronomers thought the Milky Way was the whole universe, and the fuzzy 'Andromeda nebula' was a cloud inside it. Edwin Hubble used the great mirror of this telescope to find out.",
          'He took long photographs on glass plates and looked for stars that flash up bright. Tap the telescope, tap the plate, then tap the spots marked N. One of them was not a new star at all: it pulsed, again and again.',
          'Henrietta Leavitt had found that the slower such a star pulses, the brighter it truly is. So from the pulse Hubble knew how bright the star really was, and from how faint it looked, how far away. Slide the pulse and see! It was far outside the Milky Way: Andromeda is another galaxy.',
        ],
        sci: [
          'Plate H335H, 5 to 6 October 1923, the 100-inch Hooker, 45 minutes. Hubble marked three apparent novae with N in M31, then compared earlier plates: one star was present at different brightness, so he crossed out its N and wrote VAR!. It was a Cepheid (V1) with a period of 31.4 days.',
          "Leavitt's period-luminosity relation (1908, 1912): the longer the period, the greater the luminosity. The room uses M = -2.43 (log P - 1) - 4.05 for today's scale, shifted by 2.15 mag for the 1925 scale, with the star's apparent magnitude fixed at 19.16 (a round figure chosen so that the distances come out as published: 285 000 pc, about 930 000 ly, in 1925; about 2.5 million ly today).",
          "Why the scale changed: the zero point of the relation (Shapley's calibration) was off, Baade (1952) separated two populations of Cepheids and roughly doubled extragalactic distances, and later calibrations and dust corrections brought M31 to about 2.5 million ly. Even in 1925 the distance was far beyond Shapley's size for the Milky Way (about 300 000 ly).",
        ],
      },
      tip: "Slide the exposure to see which stars appear. Slide the period to see how a star's pulse tells its distance.",
      expo: 'Minutes of exposure',
      period: 'Days between peaks',
      buttons: { scope: 'Point the telescope', plate: 'Look at the plate', spot: 'Check the next spot', scale: '1925 or today' },
    },
  },
  'pt-pt': {
    title: 'A cúpula do Monte Wilson',
    greet: {
      kid: 'Estamos dentro da grande cúpula do Monte Wilson, na Califórnia, numa noite dos anos 1920. O espelho grande saiu do telescópio para receber uma camada nova de prata. Há três coisas para experimentar. A história deste quadro está no cavalete ao teu lado.',
      sci: 'A cúpula do telescópio Hooker de 100 polegadas, no Monte Wilson, numa noite dos anos 1920. O espelho de 2,5 m está fora do telescópio para receber a nova camada de prata. Três estações: prateação do espelho, comparação de metais de espelho e a placa em que Hubble encontrou uma cefeida em Andrómeda. A história do quadro está no cavalete.',
    },
    talk: {
      kid: [
        'A prata devolve mais luz do que qualquer outro metal. Por isso faz os espelhos mais brilhantes.',
        'A prata fica baça no ar, por isso o grande espelho recebia uma pele nova de prata cerca de duas vezes por ano.',
        'Com este telescópio, Edwin Hubble descobriu que a nossa galáxia não está sozinha no universo.',
      ],
      sci: [
        'A prata reflete cerca de 95 a 98% da luz visível. Uma película é opaca a partir de uns 100 nm, por isso uma camada de umas centenas de nanómetros é um espelho.',
        'O embaciamento é sulfureto de prata, formado por vestígios de compostos de enxofre no ar. Russell Porter escreveu, em 1929, que o espelho do Hooker era prateado cerca de duas vezes por ano.',
        'Em 1935, John Strong aluminizou o espelho: o alumínio aguenta bem o ultravioleta e dura muito mais do que a prata.',
      ],
    },
    silver: {
      label: 'Prateação do espelho',
      hints: { acid: 'Toca no frasco do ácido', reducer: 'Toca no frasco do redutor', silver: 'Toca no frasco da prata', watch: 'Vê a película crescer', dish: 'Toca no pratinho', done: 'Desliza os minutos' },
      title: 'Uma pele de prata',
      meter: 'Luz devolvida',
      meterLine: { kid: 'película: {nm} nm\ndevolve {r} em 100', sci: 'película {nm} nm\nrefletância {r}%' },
      cubeLine: { kid: 'toda a prata: um cubo de {cm} cm', sci: '{cm3} cm3 = {g} g\ncubo de {cm} cm' },
      jars: { acid: 'Ácido', reducer: 'Redutor', silver: 'Nitrato de prata em amoníaco' },
      says: {
        acid: {
          kid: 'O ácido come a prata velha e baça. Por baixo fica vidro nu, azul-esverdeado escuro. Não é espelho nenhum!',
          sci: 'O ácido forte dissolve a camada velha e embaciada. Fica vidro nu, que devolve só cerca de 4% da luz.',
        },
        strip: {
          kid: 'O ácido leva também a prata nova e os líquidos. Voltamos ao vidro nu: podes recomeçar.',
          sci: 'O ácido tira também a película nova e leva os líquidos: de novo vidro nu.',
        },
        reducer: {
          kid: 'O redutor está no vidro. Está cheio de eletrões de sobra, mas ainda não há prata.',
          sci: 'O agente redutor está no vidro, pronto a dar eletrões, mas ainda não há iões de prata.',
        },
        silverAlone: {
          kid: 'A prata está no vidro, mas não acontece nada! A prata do frasco são iões de prata invisíveis e precisam de eletrões. Deita também o redutor.',
          sci: 'A prata continua dissolvida como iões Ag(NH₃)₂⁺: sem agente redutor não há eletrões para a transformar em metal.',
        },
        dirty: {
          kid: 'A camada velha ainda lá está! A prata nova não pega na prata velha e baça. Primeiro tira-a com o ácido.',
          sci: 'A prata depositada sobre o embaciamento seria irregular e não aderia: retira primeiro a camada.',
        },
        film: {
          kid: 'Os dois líquidos estão no vidro e os esfregões mantêm-nos em movimento. Os átomos de prata começam a assentar.',
          sci: 'Cada Ag⁺ recebe um eletrão do redutor e torna-se um átomo de prata que assenta no vidro. Os esfregões mantêm líquido novo a passar por cima.',
        },
        start: { kid: 'Os átomos de prata começam a assentar no vidro.', sci: 'Os átomos de prata assentam no vidro: primeiro grãos isolados.' },
        haze: {
          kid: 'Uma neblina acastanhada. A prata é tão fina que a luz ainda passa.',
          sci: 'Grãos isolados e uma película irregular, castanha por transmissão porque a luz ainda passa.',
        },
        shine: {
          kid: 'A neblina fica brilhante e surge um espelho. Já se vê a cúpula nele!',
          sci: 'Os grãos juntam-se numa película contínua e a refletância sobe. A luz deixa de passar a cerca de 100 nm.',
        },
        done: {
          kid: 'Um espelho! O medidor diz que devolve {r} em cada 100 pedacinhos de luz. A película tem {nm} nm de espessura, centenas de vezes mais fina do que um cabelo.',
          sci: 'Película de {nm} nm, refletância de {r}% na curva ilustrativa do medidor (a prata nova reflete 95 a 98% da luz visível). Mais de cerca de 100 nm pouco acrescenta à refletância.',
        },
        again: { kid: 'Esta camada está pronta. Para recomeçar, tira-a com o ácido.', sci: 'Camada pronta. Retira-a com o ácido para a repetir.' },
        nofilm: {
          kid: 'Ainda não há nada para crescer. Deita primeiro o ácido, o redutor e a prata.',
          sci: 'Ainda não há película: lava com ácido e aplica o redutor e a prata antes de correr os minutos.',
        },
        dishEmpty: { kid: 'Ainda não há prata no vidro.', sci: 'Ainda não há película, logo não há prata para juntar.' },
        dish: {
          kid: 'Toda a prata desta camada, juntinha, dá um cubo com só {cm} cm de lado. É mais pequeno do que um torrão de açúcar ({sugar} cm). Aqui os dois estão desenhados 8 vezes maiores.',
          sci: '{nm} nm sobre {area} m² são {cm3} cm³ de prata: cerca de {g} g, um cubo de {cm} cm de aresta. Porter (1929) deu um cubo de cerca de 3/8 de polegada. Os dois cubos estão desenhados 8 vezes maiores.',
        },
      },
      panel: {
        kid: [
          'Antes de 1835, os espelhos eram vidro com uma mistura venenosa de estanho e mercúrio por trás. Depois, o químico Justus von Liebig descobriu como fazer a prata sair de um líquido transparente e cobrir o vidro com uma pele de metal brilhante. Os astrónomos adoraram: quando a prata ficava baça, lavavam-na e faziam uma pele nova.',
          'Experimenta tu. Toca no frasco do ácido para tirar a prata velha. Depois deita o redutor e o frasco da prata. A prata do frasco é invisível: são átomos de prata que perderam um eletrão, dissolvidos em amoníaco. O redutor devolve os eletrões e átomos de prata a sério caem do líquido para o vidro.',
          'A pele é centenas de vezes mais fina do que um cabelo. Toda a prata deste espelho de 2,5 m cabia num cubo de cerca de 1 cm de lado: toca no pratinho para o ver. (O berço tem o espelho inclinado para poderes ver a sua face.)',
        ],
        sci: [
          'A prateação de Liebig (1835): nitrato de prata dissolvido em amoníaco, como o ião Ag(NH₃)₂⁺, é reduzido por um aldeído ou por um açúcar, a reação do teste de Tollens, e a prata deposita-se no vidro como uma película. Antes, os espelhos levavam por trás uma amálgama de estanho e mercúrio. Steinheil (1856) e Foucault (1857) pratearam a frente de vidro já polido na forma certa e substituíram o espéculo.',
          'O vidro tem de estar nu, por isso a camada velha sai primeiro com ácido forte. O relato de Porter não diz que agente redutor o observatório usou (açúcar, sal de Rochelle e formaldeído foram todos usados em espelhos grandes), por isso o frasco diz apenas redutor. Ao longo dos minutos a película passa de grãos isolados, castanhos porque a luz ainda passa, a uma camada contínua. A luz deixa de passar a cerca de 100 nm; o medidor mostra uma curva ilustrativa.',
          'Porter (Scientific American, 1929): cerca de três libras (1,4 kg) de nitrato de prata em solução, uma película de cerca de 1/100 000 de polegada (254 nm), uma camada nova cerca de duas vezes por ano; toda a prata do disco daria um cubo de cerca de 3/8 de polegada de lado. Aqui: a área do disco, 5,07 m², vezes 254 nm dá 1,29 cm³, cerca de 13,5 g, um cubo de 1,09 cm de aresta (por isso a maior parte da prata da solução acaba noutro sítio). John Strong aluminizou o espelho em 1935.',
        ],
      },
      tip: 'Arrasta o cursor para correres tu os minutos. Toca no pratinho para ver toda a prata desta camada num montinho.',
      minutes: 'Minutos no banho',
      buttons: { acid: 'Deitar o ácido', reducer: 'Deitar o redutor', silver: 'Deitar a prata', dish: 'Mostrar o pratinho' },
    },
    metals: {
      label: 'Metais de espelho',
      hints: { mirror: 'Toca num espelho', slide: 'Desliza a cor', foul: 'Toca no frasco de ar podre', again: 'Toca no espelho de prata' },
      title: 'Que metal brilha mais?',
      foulLabel: 'Ar podre',
      cards: {
        speculum: 'Espéculo\nNewton, 1668',
        amalgam: 'Estanho e mercúrio\nVeneza, séc. XVI',
        aluminium: 'Alumínio\nHooker, 1935',
        silver: 'Prata\nLiebig, 1835',
        gold: 'Ouro\npara comparar',
      },
      names: { speculum: 'Espéculo', amalgam: 'Estanho e mercúrio', aluminium: 'Alumínio', silver: 'Prata', gold: 'Ouro' },
      chart: { title: 'Luz devolvida', read: '{name}: {r}%', axis: 'cor da luz, em nanómetros', none: 'toca num espelho' },
      bands: { uv: 'ultravioleta, invisível', violet: 'violeta', blue: 'azul', green: 'verde', yellow: 'amarelo', orange: 'laranja', red: 'vermelho', ir: 'infravermelho, invisível' },
      says: {
        speculum: {
          kid: 'O espéculo é cobre e estanho polidos. Newton fez com ele o espelho do seu telescópio, em 1668. Devolve só cerca de 6 em cada 10 pedacinhos de luz, fica baço e tem de ser polido outra vez.',
          sci: 'Espéculo, cerca de duas partes de cobre para uma de estanho: refletância de uns 60 a 65% no visível, pálido e um pouco rosado. Embaciava, e cada novo polimento punha em risco a forma do espelho.',
        },
        amalgam: {
          kid: 'Os espelhos de Veneza eram vidro com estanho e mercúrio por trás. Eram melhores do que o espéculo, mas os vapores do mercúrio punham os espelheiros doentes.',
          sci: 'Amálgama de estanho e mercúrio sobre vidro (Veneza, a partir do século XVI): cerca de 70% (a curva aqui é uma estimativa grosseira), e venenosa de fazer.',
        },
        aluminium: {
          kid: 'O alumínio devolve cerca de 9 em cada 10 pedacinhos de luz e continua a funcionar mesmo nas cores que não vemos. Em 1935, o grande espelho ganhou uma pele de alumínio.',
          sci: 'Alumínio: cerca de 90% em todo o visível, com uma quebra perto dos 800 nm, e ainda uns 90% bem dentro do ultravioleta. John Strong revestiu com ele o espelho do Hooker em 1935, evaporado no vácuo; uma camada dura muito mais do que a de prata.',
        },
        silver: {
          kid: 'A prata é a melhor no visível: 95 a 98 em cada 100 pedacinhos de luz. Mas experimenta o violeta e o ultravioleta!',
          sci: 'Prata: 95 a 98% da luz visível, o melhor de todos os metais, mas cai ao longo do violeta e quase deixa de refletir perto dos 320 nm.',
        },
        gold: {
          kid: 'O ouro devolve muito bem a luz vermelha e amarela, mas engole o azul. É por isso que o ouro parece dourado.',
          sci: 'Ouro: mais de 90% de cerca de 600 nm para o infravermelho, mas só uns 40% no azul. Os seus eletrões absorvem a luz azul, o que dá ao ouro a sua cor.',
        },
        slide: {
          kid: '{nm} nm, {band}. A prata devolve {ag} em 100, o alumínio {al}, o ouro {au}.',
          sci: '{nm} nm ({band}): prata {ag}%, alumínio {al}%, ouro {au}%, espéculo {sp}%.',
        },
        foul: {
          kid: 'Um frasco de ar podre, com um cheirinho a ovos podres. A prata fica preta lá dentro. Vê a leitura descer!',
          sci: 'O sulfureto de hidrogénio e outros compostos de enxofre no ar transformam a prata em sulfureto de prata preto, Ag₂S, mesmo em vestígios. A leitura desce à medida que a película escurece (uma curva ilustrativa).',
        },
        tarnished: {
          kid: 'Embaciada! O preto engole a luz. É por isso que o grande espelho precisava de uma camada nova cerca de duas vezes por ano.',
          sci: 'A prata lê agora {r}% aqui. Um espelho embaciado deita luz fora, daí a nova camada cerca de duas vezes por ano.',
        },
        fresh: { kid: 'Uma camada nova de prata, brilhante outra vez. Era esse o trabalho, cerca de duas vezes por ano.', sci: 'Prateado de fresco: de volta à curva completa.' },
      },
      panel: {
        kid: [
          'Um espelho é uma folha muito lisa de algo brilhante, mas há coisas brilhantes mais brilhantes do que outras. Toca num espelho e uma lâmpada manda-lhe um feixe. O medidor diz quanta luz volta.',
          'Desliza a cor da luz do violeta ao vermelho e vê cada metal. A prata é a melhor, exceto no violeta. O alumínio continua a funcionar mesmo nas cores que não vemos. O ouro só gosta de vermelho e amarelo, por isso parece amarelo.',
          'A prata tem um grande problema: embaça. Toca no frasco de ar podre ao lado do espelho de prata e vê a leitura. É por isso que o espelho do grande telescópio recebia uma camada nova de prata cerca de duas vezes por ano. Telescópios como o Gemini voltam hoje a usar prata, mas debaixo de uma camada protetora fina e transparente.',
        ],
        sci: [
          'Refletância em incidência normal, a parte da luz que volta: espéculo (Newton, 1668) cerca de 60 a 65%; amálgama de estanho e mercúrio (Veneza) cerca de 70%; alumínio cerca de 90%; prata 95 a 98%; ouro mais de 90% no vermelho e no infravermelho. As curvas do gráfico são aproximações suaves de curvas publicadas por fabricantes de revestimentos, boas até uns pontos percentuais (o espéculo e a amálgama só grosseiramente).',
          'A refletância da prata cai ao longo do violeta e perto dos 320 nm é de uns poucos por cento; o alumínio fica perto de 90% de cerca de 200 nm até ao infravermelho próximo, com uma quebra perto dos 800 nm. Isso, e uma camada que dura anos, é a razão por que o espelho do Hooker foi aluminizado em 1935. O ouro absorve o azul (uns 40% aos 450 nm) e reflete mais de 90% do vermelho e do infravermelho.',
          'A prata embaça em sulfureto de prata preto por causa de vestígios de compostos de enxofre no ar, por isso o espelho do Hooker era prateado de novo cerca de duas vezes por ano (Porter, 1929). Desde 2004, os espelhos de 8,1 m dos telescópios Gemini voltaram a ser prateados, sob uma camada protetora, porque a prata irradia muito pouco calor no infravermelho.',
        ],
      },
      tip: 'Desliza a cor da luz. Toca no frasco de ar podre junto ao espelho de prata e depois em «Pratear outra vez» para recomeçar.',
      wave: 'Cor da luz',
      buttons: { foul: 'Abrir o frasco de ar podre', fresh: 'Pratear outra vez' },
    },
    galaxy: {
      label: 'A caça às galáxias',
      hints: { scope: 'Toca no telescópio', wait: 'Espera pela placa', plate: 'Toca na placa de vidro', spots: 'Toca num ponto marcado N', slide: 'Desliza a pulsação' },
      title: 'Outra galáxia?',
      holder: 'Placa H335H',
      days: 'dias',
      curveAxis: 'dias',
      boards: { curve: 'A estrela ao longo dos dias', dist: 'A que distância?' },
      plates: { older: 'placa antiga', now: '5 a 6 de outubro de 1923, 45 minutos' },
      says: {
        point: {
          kid: 'A cúpula roda, a fenda vira-se para Andrómeda e o telescópio acompanha-a. A luz das estrelas junta-se agora numa placa de vidro. Passam 45 minutos em poucos segundos.',
          sci: 'Cúpula e telescópio apontados a Andrómeda (M31). Placa H335H, noite de 5 para 6 de outubro de 1923: exposição de 45 minutos, aqui acelerada.',
        },
        away: { kid: 'O telescópio volta-se para a Via Láctea.', sci: 'Telescópio de volta à Via Láctea; a cúpula acompanha-o.' },
        expoDone: { kid: 'A placa está cheia de estrelas! Toca nela para a pôr na mesa de luz.', sci: 'Exposição completa, 45 minutos. Toca na placa para a ver na mesa de luz.' },
        noScope: { kid: 'Aponta primeiro o telescópio a Andrómeda.', sci: 'Aponta o telescópio a Andrómeda antes de expor.' },
        plateOn: {
          kid: 'Na mesa de luz, as estrelas são pontos pretos. Hubble andava à procura de estrelas novas que acendem de repente, chamadas novas. Marcou três com um N. Toca em cada N e compara com a placa antiga ao lado.',
          sci: 'Na mesa de luz a placa é um negativo: as estrelas são escuras. Hubble marcou com N três candidatas a nova; uma nova deve faltar nas placas anteriores. Compara cada uma com a placa antiga ao lado.',
        },
        noPlate: { kid: 'Ainda não há placa. Aponta o telescópio e espera pela exposição.', sci: 'Ainda não há placa exposta: aponta o telescópio e deixa correr a exposição.' },
        faint: { kid: 'Ainda é demasiado fraca para se ver: a placa precisa de mais exposição.', sci: 'Ainda não há exposição suficiente para mostrar essa estrela.' },
        nova: {
          kid: 'Não está na placa antiga, por isso parece uma nova: uma estrela que se acendeu de repente.',
          sci: 'Ausente da placa antiga e presente na nova: compatível com uma nova.',
        },
        var: {
          kid: 'Olha! Esta estrela também está na placa antiga, mas mais fraca. Não é uma estrela nova: a luz dela sobe e desce. Hubble riscou o N e escreveu VAR!',
          sci: 'Presente na placa antiga com outro brilho: não é uma nova, mas uma variável. Hubble riscou o N e escreveu VAR! na placa.',
        },
        curve: {
          kid: 'De 31 em 31 dias a estrela fica brilhante, esmorece e volta a ficar brilhante, vezes sem conta. Uma estrela que pulsa assim chama-se cefeida.',
          sci: 'Uma variável cefeida: pulsação regular de 31,4 dias, com subida rápida e descida lenta (uma forma típica de cefeida, não as medições do próprio Hubble).',
        },
        slide: {
          kid: 'Uma estrela que pulsa de {p} em {p} dias é na verdade cerca de {l} vezes mais brilhante do que o Sol. Parece muito fraca, por isso tem de estar a {d} anos-luz.',
          sci: 'P = {p} d dá M = {M} mag, L = {l} sóis. Com uma magnitude aparente fixa de cerca de 19, a distância é {d} anos-luz.',
        },
        old: {
          kid: 'Estes são os números de Hubble, de 1925, tão grandes como qualquer pessoa ousava então.',
          sci: 'Ponto zero de 1925 da relação período-luminosidade: cerca de 930 000 anos-luz (285 000 pc), geralmente citada como cerca de 900 000 anos-luz.',
        },
        now: {
          kid: 'E os números de hoje: mais do dobro da distância. Andrómeda é uma galáxia inteira, muito para lá da nossa!',
          sci: 'Com a calibração de hoje, a mesma estrela está a cerca de 2,5 milhões de anos-luz: Baade (1952) descobriu dois tipos de cefeidas e duplicou a escala; seguiram-se melhores calibrações e correções da poeira.',
        },
      },
      board: {
        kid: 'pulsação: {p} dias\nna verdade: {l} Sóis\nlonge: {d} anos-luz',
        sci: 'P = {p} d\nM = {M}, L = {l} sóis\nd = {d} anos-luz',
      },
      panel: {
        kid: [
          'Em 1923, muitos astrónomos achavam que a Via Láctea era o universo inteiro e que a «nebulosa de Andrómeda», toda esborratada, era uma nuvem lá dentro. Edwin Hubble usou o grande espelho deste telescópio para descobrir a verdade.',
          'Tirou longas fotografias em placas de vidro e procurou estrelas que acendem de repente. Toca no telescópio, toca na placa e depois nos pontos marcados com N. Um deles não era uma estrela nova: pulsava, vezes sem conta.',
          'Henrietta Leavitt tinha descoberto que, quanto mais devagar uma estrela assim pulsa, mais brilhante ela é na verdade. Assim, pela pulsação, Hubble soube quão brilhante a estrela era mesmo e, pelo quão fraca parecia, a que distância estava. Desliza a pulsação e vê! Estava muito fora da Via Láctea: Andrómeda é outra galáxia.',
        ],
        sci: [
          'Placa H335H, 5 a 6 de outubro de 1923, o Hooker de 100 polegadas, 45 minutos. Hubble marcou com N três aparentes novas em M31 e comparou depois placas anteriores: uma estrela estava lá com outro brilho, por isso riscou o N e escreveu VAR!. Era uma cefeida (V1) com período de 31,4 dias.',
          'A relação período-luminosidade de Leavitt (1908, 1912): quanto maior o período, maior a luminosidade. A sala usa M = −2,43 (log P − 1) − 4,05 para a escala de hoje, deslocada de 2,15 mag para a de 1925, com a magnitude aparente da estrela fixa em 19,16 (um valor redondo escolhido para as distâncias saírem como as publicadas: 285 000 pc, cerca de 930 000 anos-luz, em 1925; cerca de 2,5 milhões de anos-luz hoje).',
          'Porque mudou a escala: o ponto zero da relação (a calibração de Shapley) estava errado, Baade (1952) separou duas populações de cefeidas e duplicou, grosso modo, as distâncias extragalácticas, e calibrações e correções da poeira posteriores levaram M31 a cerca de 2,5 milhões de anos-luz. Mesmo em 1925, a distância ia muito além do tamanho que Shapley dava à Via Láctea (cerca de 300 000 anos-luz).',
        ],
      },
      tip: 'Desliza a exposição para ver que estrelas aparecem. Desliza o período para ver como a pulsação de uma estrela diz a sua distância.',
      expo: 'Minutos de exposição',
      period: 'Dias entre picos',
      buttons: { scope: 'Apontar o telescópio', plate: 'Ver a placa', spot: 'Verificar o ponto seguinte', scale: '1925 ou hoje' },
    },
  },
  pl: {
    title: 'Kopuła na Mount Wilson',
    greet: {
      kid: 'Jesteśmy w wielkiej kopule na Mount Wilson w Kalifornii, w pewną noc w latach dwudziestych. Duże zwierciadło wyjęto z teleskopu, żeby dostało świeżą warstwę srebra. Są trzy rzeczy do wypróbowania. Historia tego obrazu jest na sztalugach obok ciebie.',
      sci: 'Kopuła 100-calowego teleskopu Hookera na Mount Wilson, noc w latach dwudziestych. Zwierciadło o średnicy 2,5 m wyjęto z teleskopu, by dostało nową warstwę srebra. Trzy stanowiska: srebrzenie zwierciadła, porównanie metali na lustra i klisza, na której Hubble znalazł cefeidę w Andromedzie. Historia obrazu jest na sztalugach.',
    },
    talk: {
      kid: [
        'Srebro odbija więcej światła niż jakikolwiek inny metal. Dlatego daje najjaśniejsze lustra.',
        'Srebro matowieje na powietrzu, więc wielkie zwierciadło dostawało nową srebrną skórkę mniej więcej dwa razy w roku.',
        'Przez ten teleskop Edwin Hubble odkrył, że nasza galaktyka nie jest sama we wszechświecie.',
      ],
      sci: [
        'Srebro odbija około 95 do 98% światła widzialnego. Warstwa jest nieprzezroczysta od około 100 nm, więc powłoka grubości kilkuset nanometrów jest już lustrem.',
        'Nalot to siarczek srebra, który powstaje ze śladów związków siarki w powietrzu. Russell Porter pisał w 1929 roku, że zwierciadło Hookera srebrzono mniej więcej dwa razy w roku.',
        'W 1935 roku John Strong pokrył zwierciadło glinem: glin dobrze znosi nadfiolet i trzyma się znacznie dłużej niż srebro.',
      ],
    },
    silver: {
      label: 'Srebrzenie zwierciadła',
      hints: { acid: 'Dotknij słoika z kwasem', reducer: 'Dotknij słoika z reduktorem', silver: 'Dotknij słoika ze srebrem', watch: 'Patrz, jak rośnie warstwa', dish: 'Dotknij miseczki', done: 'Przesuń minuty' },
      title: 'Skórka ze srebra',
      meter: 'Odbite światło',
      meterLine: { kid: 'warstwa: {nm} nm\nodbija {r} ze 100', sci: 'warstwa {nm} nm\nodbicie {r}%' },
      cubeLine: { kid: 'całe srebro: sześcian {cm} cm', sci: '{cm3} cm3 = {g} g\nsześcian {cm} cm' },
      jars: { acid: 'Kwas', reducer: 'Reduktor', silver: 'Azotan srebra w amoniaku' },
      says: {
        acid: {
          kid: 'Kwas zjada stare, matowe srebro. Pod spodem jest czyste szkło, ciemne zielononiebieskie. To wcale nie jest lustro!',
          sci: 'Mocny kwas rozpuszcza stary, zmatowiały nalot. Zostaje czyste szkło, które odbija tylko około 4% światła.',
        },
        strip: {
          kid: 'Kwas zmywa też nowe srebro i ciecze. Znów jest czyste szkło: możesz zacząć od nowa.',
          sci: 'Kwas zdziera także nową warstwę i spłukuje ciecze: znów czyste szkło.',
        },
        reducer: {
          kid: 'Reduktor jest na szkle. Ma pełno zapasowych elektronów, ale srebra jeszcze nie ma.',
          sci: 'Reduktor jest na szkle, gotowy oddawać elektrony, ale nie ma jeszcze jonów srebra.',
        },
        silverAlone: {
          kid: 'Srebro jest na szkle, ale nic się nie dzieje! Srebro w słoiku to niewidzialne jony srebra i potrzebują elektronów. Wylej też reduktor.',
          sci: 'Srebro zostaje rozpuszczone jako jony Ag(NH₃)₂⁺: bez reduktora nie ma elektronów, które zamieniłyby je w metal.',
        },
        dirty: {
          kid: 'Stara powłoka nadal tam jest! Nowe srebro nie przyczepi się do starego, matowego. Najpierw zmyj je kwasem.',
          sci: 'Srebro osadzone na starym nalocie byłoby nierówne i nie trzymałoby się: najpierw zdejmij powłokę.',
        },
        film: {
          kid: 'Obie ciecze są na szkle, a tampony przesuwają je po powierzchni. Atomy srebra zaczynają osiadać.',
          sci: 'Każdy jon Ag⁺ bierze elektron od reduktora i staje się atomem srebra, który osiada na szkle. Tampony stale przesuwają po nim świeżą ciecz.',
        },
        start: { kid: 'Atomy srebra zaczynają osiadać na szkle.', sci: 'Atomy srebra osiadają na szkle: najpierw pojedyncze ziarna.' },
        haze: {
          kid: 'Brązowawa mgiełka. Srebro jest tak cienkie, że światło jeszcze przez nie przechodzi.',
          sci: 'Pojedyncze ziarna i dziurawa warstwa, brązowa w świetle przechodzącym, bo światło jeszcze przez nią przechodzi.',
        },
        shine: {
          kid: 'Mgiełka zaczyna lśnić i pojawia się lustro. Widać w nim kopułę!',
          sci: 'Ziarna łączą się w ciągłą warstwę i odbicie rośnie. Światło przestaje przechodzić przy około 100 nm.',
        },
        done: {
          kid: 'Lustro! Miernik mówi, że odbija {r} ze 100 kawałeczków światła. Warstwa ma {nm} nm grubości, setki razy mniej niż włos.',
          sci: 'Warstwa {nm} nm, odbicie {r}% na ilustracyjnej krzywej miernika (świeże srebro odbija 95 do 98% światła widzialnego). Powyżej około 100 nm odbicie rośnie już niewiele.',
        },
        again: { kid: 'Ta warstwa jest gotowa. Żeby zacząć od nowa, zmyj ją kwasem.', sci: 'Powłoka gotowa. Zdejmij ją kwasem, by powtórzyć.' },
        nofilm: {
          kid: 'Nie ma jeszcze czego hodować. Najpierw wylej kwas, reduktor i srebro.',
          sci: 'Jeszcze nie ma warstwy: umyj kwasem, nałóż reduktor i srebro, dopiero potem puszczaj minuty.',
        },
        dishEmpty: { kid: 'Na szkle nie ma jeszcze srebra.', sci: 'Nie ma jeszcze warstwy, więc nie ma srebra do zebrania.' },
        dish: {
          kid: 'Całe srebro z tej powłoki, zebrane razem, tworzy sześcian o boku zaledwie {cm} cm. To mniej niż kostka cukru ({sugar} cm). Tu oba są narysowane 8 razy za duże.',
          sci: '{nm} nm na powierzchni {area} m² to {cm3} cm³ srebra: około {g} g, sześcian o boku {cm} cm. Porter (1929) podał sześcian o boku około 3/8 cala. Oba sześciany narysowano 8 razy za duże.',
        },
      },
      panel: {
        kid: [
          'Przed 1835 rokiem lustra były ze szkła podklejonego trującą mieszaniną cyny i rtęci. Potem chemik Justus von Liebig odkrył, jak sprawić, by srebro wydzieliło się z przezroczystego płynu i pokryło szkło lśniącą metalową skórką. Astronomowie byli zachwyceni: kiedy srebro matowiało, można je było zmyć i zrobić nową skórkę.',
          'Spróbuj sam. Dotknij słoika z kwasem, żeby zmyć stare srebro. Potem wylej reduktor i srebro. Srebro w słoiku jest niewidzialne: to atomy srebra, które straciły elektron, rozpuszczone w amoniaku. Reduktor oddaje elektrony i prawdziwe atomy srebra wypadają z płynu na szkło.',
          'Skórka jest setki razy cieńsza od włosa. Całe srebro na tym zwierciadle o średnicy 2,5 m zmieściłoby się w sześcianie o boku około 1 cm: dotknij miseczki, żeby go zobaczyć. (Kołyska przechyla tu zwierciadło, żeby było widać jego powierzchnię.)',
        ],
        sci: [
          'Srebrzenie Liebiga (1835): azotan srebra rozpuszczony w amoniaku, jako jon Ag(NH₃)₂⁺, jest redukowany aldehydem lub cukrem, tak jak w próbie Tollensa, i srebro osadza się na szkle jako warstwa. Wcześniej lustra podklejano amalgamatem cyny i rtęci. Steinheil (1856) i Foucault (1857) srebrzyli przód oszlifowanego szkła i zastąpili nim stop zwierciadlany.',
          "Szkło musi być czyste, więc starą powłokę zdejmuje się najpierw mocnym kwasem. Relacja Portera nie podaje, jakiego reduktora używało obserwatorium (do dużych zwierciadeł stosowano cukier, sól Seignette'a i formaldehyd), dlatego słoik mówi tylko: reduktor. W ciągu minut warstwa przechodzi od pojedynczych ziaren, brązowych, bo światło jeszcze przez nie przechodzi, do ciągłej powłoki. Światło przestaje przechodzić przy około 100 nm; miernik pokazuje krzywą ilustracyjną.",
          'Porter (Scientific American, 1929): około trzech funtów (1,4 kg) azotanu srebra w roztworze, warstwa grubości około 1/100 000 cala (254 nm), nowa powłoka mniej więcej dwa razy w roku; całe srebro na tarczy dałoby sześcian o boku około 3/8 cala. Tutaj: powierzchnia tarczy 5,07 m² razy 254 nm to 1,29 cm³, około 13,5 g, sześcian o boku 1,09 cm (większość srebra z roztworu ląduje więc gdzie indziej). John Strong pokrył zwierciadło glinem w 1935 roku.',
        ],
      },
      tip: 'Przeciągnij suwak, żeby samemu puszczać minuty. Dotknij miseczki, żeby zobaczyć całe srebro tej powłoki w jednej grudce.',
      minutes: 'Minuty w kąpieli',
      buttons: { acid: 'Wylej kwas', reducer: 'Wylej reduktor', silver: 'Wylej srebro', dish: 'Pokaż miseczkę' },
    },
    metals: {
      label: 'Metale na lustra',
      hints: { mirror: 'Dotknij lustra', slide: 'Przesuń kolor', foul: 'Dotknij słoika z zepsutym powietrzem', again: 'Dotknij srebrnego lustra' },
      title: 'Który metal błyszczy najlepiej?',
      foulLabel: 'Zepsute powietrze',
      cards: {
        speculum: 'Stop zwierciadlany\nNewton, 1668',
        amalgam: 'Cyna i rtęć\nWenecja, XVI w.',
        aluminium: 'Glin\nHooker, 1935',
        silver: 'Srebro\nLiebig, 1835',
        gold: 'Złoto\ndla porównania',
      },
      names: { speculum: 'Stop zwierciadlany', amalgam: 'Cyna i rtęć', aluminium: 'Glin', silver: 'Srebro', gold: 'Złoto' },
      chart: { title: 'Odbite światło', read: '{name}: {r}%', axis: 'barwa światła w nanometrach', none: 'dotknij lustra' },
      bands: { uv: 'nadfiolet, niewidzialny', violet: 'fiolet', blue: 'niebieski', green: 'zielony', yellow: 'żółty', orange: 'pomarańczowy', red: 'czerwony', ir: 'podczerwień, niewidzialna' },
      says: {
        speculum: {
          kid: 'Stop zwierciadlany to wypolerowana miedź z cyną. Newton zrobił z niego lustro swojego teleskopu w 1668 roku. Odbija tylko około 6 ze 10 kawałeczków światła, matowieje i trzeba go polerować od nowa.',
          sci: 'Stop zwierciadlany, około dwóch części miedzi na jedną cyny: odbicie z grubsza 60 do 65% w świetle widzialnym, blady i lekko różowawy. Matowiał, a każde ponowne szlifowanie groziło zepsuciem kształtu zwierciadła.',
        },
        amalgam: {
          kid: 'Weneckie lustra to szkło podklejone cyną i rtęcią. Były lepsze od stopu zwierciadlanego, ale od oparów rtęci chorowali lustrzarze.',
          sci: 'Amalgamat cyny i rtęci na szkle (Wenecja, od XVI wieku): z grubsza 70% (krzywa jest tu zgrubnym oszacowaniem), a w produkcji trujący.',
        },
        aluminium: {
          kid: 'Glin odbija około 9 z 10 kawałeczków światła i działa nawet w kolorach, których nie widzimy. W 1935 roku wielkie zwierciadło dostało glinową skórkę.',
          sci: 'Glin: około 90% w całym zakresie widzialnym, z dołkiem przy 800 nm, i nadal około 90% głęboko w nadfiolecie. John Strong pokrył nim zwierciadło Hookera w 1935 roku, odparowanym w próżni; powłoka trzyma się znacznie dłużej niż srebro.',
        },
        silver: {
          kid: 'Srebro jest najlepsze w świetle widzialnym: 95 do 98 ze 100 kawałeczków światła. Ale spróbuj fioletu i nadfioletu!',
          sci: 'Srebro: 95 do 98% światła widzialnego, najwięcej ze wszystkich metali, ale odbicie spada w fiolecie i przy około 320 nm prawie znika.',
        },
        gold: {
          kid: 'Złoto odbija bardzo dobrze światło czerwone i żółte, ale połyka niebieskie. Dlatego złoto jest złote.',
          sci: 'Złoto: ponad 90% od około 600 nm w podczerwień, ale tylko około 40% w niebieskim. Jego elektrony pochłaniają światło niebieskie, co daje złotu barwę.',
        },
        slide: {
          kid: '{nm} nm, {band}. Srebro odbija {ag} ze 100, glin {al}, złoto {au}.',
          sci: '{nm} nm ({band}): srebro {ag}%, glin {al}%, złoto {au}%, stop zwierciadlany {sp}%.',
        },
        foul: {
          kid: 'Słoik zepsutego powietrza, pachnie zgniłymi jajami. Srebro czernieje w nim. Patrz, jak spada odczyt!',
          sci: 'Siarkowodór i inne związki siarki w powietrzu zamieniają srebro w czarny siarczek srebra, Ag₂S, nawet w śladowych ilościach. Odczyt spada, gdy warstwa ciemnieje (krzywa ilustracyjna).',
        },
        tarnished: {
          kid: 'Zmatowiało! Czerń połyka światło. Dlatego wielkie zwierciadło potrzebowało nowej powłoki mniej więcej dwa razy w roku.',
          sci: 'Srebro pokazuje tu teraz {r}%. Zmatowiałe lustro marnuje światło, stąd nowa powłoka mniej więcej dwa razy w roku.',
        },
        fresh: { kid: 'Świeża warstwa srebra, znów lśni. Na tym polegała praca, mniej więcej dwa razy w roku.', sci: 'Świeżo posrebrzone: z powrotem pełna krzywa.' },
      },
      panel: {
        kid: [
          'Lustro to bardzo gładka tafla czegoś błyszczącego, ale jedne błyszczące rzeczy błyszczą bardziej niż inne. Dotknij lustra, a lampa skieruje na nie wiązkę. Miernik pokaże, ile światła wraca.',
          'Przesuwaj kolor światła od fioletu do czerwieni i patrz na każdy metal. Srebro jest najlepsze, tylko nie w fiolecie. Glin działa nawet w kolorach, których nie widzimy. Złoto lubi tylko czerwień i żółć, dlatego wygląda na żółte.',
          'Srebro ma jeden duży kłopot: matowieje. Dotknij słoika zepsutego powietrza obok srebrnego lustra i patrz na odczyt. Dlatego zwierciadło wielkiego teleskopu dostawało nową warstwę srebra mniej więcej dwa razy w roku. Teleskopy takie jak Gemini znów używają dziś srebra, ale pod cienką, przezroczystą warstwą ochronną.',
        ],
        sci: [
          'Odbicie przy padaniu prostopadłym, czyli część odbitego światła: stop zwierciadlany (Newton, 1668) z grubsza 60 do 65%; amalgamat cyny i rtęci (Wenecja) z grubsza 70%; glin około 90%; srebro 95 do 98%; złoto ponad 90% w czerwieni i podczerwieni. Krzywe na wykresie to gładkie przybliżenia krzywych publikowanych przez producentów powłok, z dokładnością do kilku punktów (stop zwierciadlany i amalgamat tylko zgrubnie).',
          'Odbicie srebra spada w fiolecie, a przy 320 nm wynosi kilka procent; glin trzyma około 90% od około 200 nm do bliskiej podczerwieni, z dołkiem przy 800 nm. To i powłoka trzymająca się latami jest powodem, dla którego zwierciadło Hookera pokryto glinem w 1935 roku. Złoto pochłania niebieskie (około 40% przy 450 nm), a czerwień i podczerwień odbija w ponad 90%.',
          'Srebro matowieje, tworząc czarny siarczek srebra ze śladów związków siarki w powietrzu, dlatego zwierciadło Hookera srebrzono ponownie mniej więcej dwa razy w roku (Porter, 1929). Od 2004 roku 8,1-metrowe zwierciadła teleskopów Gemini znów są srebrzone, pod warstwą ochronną, bo srebro bardzo słabo promieniuje ciepło w podczerwieni.',
        ],
      },
      tip: 'Przesuwaj kolor światła. Dotknij słoika zepsutego powietrza obok srebrnego lustra, a potem „Posrebrz jeszcze raz”, żeby zacząć od nowa.',
      wave: 'Kolor światła',
      buttons: { foul: 'Otwórz słoik zepsutego powietrza', fresh: 'Posrebrz jeszcze raz' },
    },
    galaxy: {
      label: 'Polowanie na galaktyki',
      hints: { scope: 'Dotknij teleskopu', wait: 'Poczekaj na kliszę', plate: 'Dotknij szklanej kliszy', spots: 'Dotknij punktu z literą N', slide: 'Przesuń pulsowanie' },
      title: 'Inna galaktyka?',
      holder: 'Klisza H335H',
      days: 'dni',
      curveAxis: 'dni',
      boards: { curve: 'Gwiazda w ciągu dni', dist: 'Jak daleko?' },
      plates: { older: 'starsza klisza', now: '5 do 6 października 1923, 45 minut' },
      says: {
        point: {
          kid: 'Kopuła się obraca, szczelina zwraca się ku Andromedzie, a teleskop podąża za nią. Światło gwiazd zbiera się teraz na szklanej kliszy. 45 minut mija w kilka sekund.',
          sci: 'Kopuła i teleskop skierowane na Andromedę (M31). Klisza H335H, noc z 5 na 6 października 1923: ekspozycja 45 minut, tu przyspieszona.',
        },
        away: { kid: 'Teleskop wraca do Drogi Mlecznej.', sci: 'Teleskop wrócił do Drogi Mlecznej; kopuła podąża za nim.' },
        expoDone: { kid: 'Klisza jest pełna gwiazd! Dotknij jej, żeby położyć ją na stole podświetlanym.', sci: 'Ekspozycja zakończona, 45 minut. Dotknij kliszy, by obejrzeć ją na stole podświetlanym.' },
        noScope: { kid: 'Najpierw skieruj teleskop na Andromedę.', sci: 'Skieruj teleskop na Andromedę przed naświetlaniem.' },
        plateOn: {
          kid: 'Na stole podświetlanym gwiazdy to czarne kropki. Hubble szukał nowych gwiazd, które nagle rozbłyskują, zwanych nowymi. Zaznaczył trzy literą N. Dotknij każdego N i porównaj ze starszą kliszą obok.',
          sci: 'Na stole podświetlanym klisza jest negatywem: gwiazdy są ciemne. Hubble zaznaczył literą N trzech kandydatów na nowe; nowej powinno brakować na wcześniejszych kliszach. Porównaj każdą ze starszą kliszą obok.',
        },
        noPlate: { kid: 'Nie ma jeszcze kliszy. Skieruj teleskop i poczekaj na ekspozycję.', sci: 'Nie ma jeszcze naświetlonej kliszy: skieruj teleskop i pozwól biec ekspozycji.' },
        faint: { kid: 'Jeszcze za słaba, żeby ją zobaczyć: klisza potrzebuje dłuższej ekspozycji.', sci: 'Ekspozycja jeszcze za krótka, by pokazać tę gwiazdę.' },
        nova: {
          kid: 'Nie ma jej na starszej kliszy, więc wygląda na nową: gwiazdę, która nagle rozbłysła.',
          sci: 'Brak na starszej kliszy, jest na nowej: zgodnie z tym, czego oczekuje się od nowej.',
        },
        var: {
          kid: 'Patrz! Ta gwiazda jest też na starszej kliszy, ale słabsza. To nie nowa gwiazda: jej światło rośnie i maleje. Hubble przekreślił N i napisał VAR!',
          sci: 'Jest na starszej kliszy o innej jasności: to nie nowa, tylko gwiazda zmienna. Hubble przekreślił N i napisał na kliszy VAR!.',
        },
        curve: {
          kid: 'Co 31 dni gwiazda rozjaśnia się, przygasa i rozjaśnia się znowu, raz za razem. Gwiazdę, która tak pulsuje, nazywamy cefeidą.',
          sci: "Cefeida: regularne pulsowanie co 31,4 doby, z szybkim wzrostem i powolnym spadkiem (typowy kształt cefeidy, nie własne pomiary Hubble'a).",
        },
        slide: {
          kid: 'Gwiazda, która pulsuje co {p} dni, jest naprawdę około {l} razy jaśniejsza od Słońca. Wygląda na bardzo słabą, więc musi być oddalona o {d} lat świetlnych.',
          sci: 'P = {p} d daje M = {M} mag, L = {l} Słońc. Przy stałej jasności widomej około 19 odległość wynosi {d} lat świetlnych.',
        },
        old: {
          kid: "To liczby Hubble'a z 1925 roku, tak duże, jak wtedy ktokolwiek śmiał przypuszczać.",
          sci: 'Zero skali zależności okres-jasność z 1925 roku: około 930 000 lat świetlnych (285 000 pc), zwykle podawane jako około 900 000 lat świetlnych.',
        },
        now: {
          kid: 'A oto dzisiejsze liczby: ponad dwa razy dalej. Andromeda to cała galaktyka, daleko poza naszą!',
          sci: 'Według dzisiejszej kalibracji ta sama gwiazda jest odległa o około 2,5 miliona lat świetlnych: Baade (1952) odkrył dwa rodzaje cefeid i podwoił skalę; potem przyszły lepsze kalibracje i poprawki na pył.',
        },
      },
      board: {
        kid: 'pulsuje co: {p} dni\nnaprawdę: {l} Słońc\ndaleko: {d} lat świetlnych',
        sci: 'P = {p} d\nM = {M}, L = {l} Słońc\nd = {d} lat świetlnych',
      },
      panel: {
        kid: [
          'W 1923 roku wielu astronomów uważało, że Droga Mleczna to cały wszechświat, a rozmyta „mgławica Andromedy” to chmura w jej wnętrzu. Edwin Hubble użył wielkiego zwierciadła tego teleskopu, żeby się przekonać.',
          'Robił długie zdjęcia na szklanych kliszach i szukał gwiazd, które nagle rozbłyskują. Dotknij teleskopu, dotknij kliszy, a potem punktów z literą N. Jeden z nich wcale nie był nową gwiazdą: pulsował, raz za razem.',
          'Henrietta Leavitt odkryła, że im wolniej taka gwiazda pulsuje, tym jaśniejsza jest naprawdę. Dzięki pulsowaniu Hubble wiedział więc, jak jasna jest gwiazda naprawdę, a z tego, jak słabo wygląda, jak daleko jest. Przesuń pulsowanie i zobacz! Była daleko poza Drogą Mleczną: Andromeda to inna galaktyka.',
        ],
        sci: [
          'Klisza H335H, 5 do 6 października 1923, 100-calowy teleskop Hookera, 45 minut. Hubble zaznaczył literą N trzy rzekome nowe w M31, po czym porównał wcześniejsze klisze: jedna z gwiazd była tam o innej jasności, więc przekreślił jej N i napisał VAR!. To była cefeida (V1) o okresie 31,4 doby.',
          'Zależność okres-jasność Leavitt (1908, 1912): im dłuższy okres, tym większa jasność. Pokój używa wzoru M = −2,43 (log P − 1) − 4,05 dla dzisiejszej skali, przesuniętego o 2,15 mag dla skali z 1925 roku, przy jasności widomej gwiazdy ustalonej na 19,16 (okrągła liczba dobrana tak, by odległości wyszły jak opublikowane: 285 000 pc, około 930 000 lat świetlnych w 1925; około 2,5 miliona lat świetlnych dziś).',
          'Dlaczego skala się zmieniła: zero zależności (kalibracja Shapleya) było błędne, Baade (1952) rozdzielił dwie populacje cefeid i mniej więcej podwoił odległości pozagalaktyczne, a późniejsze kalibracje i poprawki na pył przesunęły M31 na około 2,5 miliona lat świetlnych. Nawet w 1925 roku ta odległość znacznie przekraczała rozmiar Drogi Mlecznej według Shapleya (około 300 000 lat świetlnych).',
        ],
      },
      tip: 'Przesuń ekspozycję, by zobaczyć, które gwiazdy się pojawiają. Przesuń okres, by zobaczyć, jak pulsowanie gwiazdy zdradza jej odległość.',
      expo: 'Minuty ekspozycji',
      period: 'Dni między szczytami',
      buttons: { scope: 'Skieruj teleskop', plate: 'Obejrzyj kliszę', spot: 'Sprawdź następny punkt', scale: '1925 czy dziś' },
    },
  },
  de: {
    title: 'Die Kuppel auf dem Mount Wilson',
    greet: {
      kid: 'Wir sind in der großen Kuppel auf dem Mount Wilson in Kalifornien, in einer Nacht in den 1920er-Jahren. Der große Spiegel wurde aus dem Teleskop genommen, um frisches Silber zu bekommen. Du kannst drei Dinge ausprobieren. Die Geschichte dieses Bildes steht auf der Staffelei neben dir.',
      sci: 'Die Kuppel des 100-Zoll-Hooker-Teleskops auf dem Mount Wilson, eine Nacht in den 1920er-Jahren. Der 2,5-m-Spiegel ist für seine neue Silberschicht aus dem Teleskop genommen. Drei Stationen: den Spiegel versilbern, Spiegelmetalle vergleichen und die Platte, auf der Hubble eine Cepheide in Andromeda fand. Die Geschichte des Bildes steht auf der Staffelei.',
    },
    talk: {
      kid: [
        'Silber wirft mehr Licht zurück als jedes andere Metall. Darum macht es die hellsten Spiegel.',
        'Silber wird an der Luft matt, deshalb bekam der große Spiegel etwa zweimal im Jahr eine frische Silberhaut.',
        'Mit diesem Teleskop fand Edwin Hubble heraus, dass unsere Galaxie nicht allein im Universum ist.',
      ],
      sci: [
        'Silber reflektiert etwa 95 bis 98% des sichtbaren Lichts. Ein Film ist ab etwa 100 nm undurchsichtig, eine Schicht von einigen hundert Nanometern Dicke ist also ein Spiegel.',
        'Das Anlaufen ist Silbersulfid, entstanden aus Spuren von Schwefelverbindungen in der Luft. Russell Porter schrieb 1929, der Hooker-Spiegel sei etwa zweimal im Jahr neu versilbert worden.',
        '1935 aluminisierte John Strong den Spiegel: Aluminium hält im Ultravioletten gut aus und hält viel länger als Silber.',
      ],
    },
    silver: {
      label: 'Den Spiegel versilbern',
      hints: { acid: 'Tippe auf das Säureglas', reducer: 'Tippe auf das Reduktionsmittel-Glas', silver: 'Tippe auf das Silberglas', watch: 'Sieh dem Silberfilm beim Wachsen zu', dish: 'Tippe auf das Schälchen', done: 'Schiebe die Minuten' },
      title: 'Eine Haut aus Silber',
      meter: 'Zurückgeworfenes Licht',
      meterLine: { kid: 'Film: {nm} nm\nwirft {r} von 100 zurück', sci: 'Film {nm} nm\nReflexionsgrad {r}%' },
      cubeLine: { kid: 'alles Silber: ein Würfel von {cm} cm', sci: '{cm3} cm3 = {g} g\nWürfel {cm} cm' },
      jars: { acid: 'Säure', reducer: 'Reduktionsmittel', silver: 'Silbernitrat in Ammoniak' },
      says: {
        acid: {
          kid: 'Die Säure frisst das alte, matte Silber weg. Darunter liegt blankes Glas, dunkel grünblau. Ein Spiegel ist das noch gar nicht!',
          sci: 'Starke Säure löst die alte, angelaufene Schicht auf. Übrig bleibt blankes Glas, das nur etwa 4% des Lichts zurückwirft.',
        },
        strip: {
          kid: 'Die Säure wäscht auch das neue Silber ab und die Flüssigkeiten dazu. Wieder blankes Glas: Du kannst neu anfangen.',
          sci: 'Die Säure löst auch den neuen Film ab und spült die Flüssigkeiten weg: wieder blankes Glas.',
        },
        reducer: {
          kid: 'Das Reduktionsmittel ist auf dem Glas. Es hat Elektronen im Überfluss, aber noch gibt es kein Silber.',
          sci: 'Das Reduktionsmittel ist auf dem Glas und gibt gern Elektronen ab, aber es gibt noch keine Silberionen.',
        },
        silverAlone: {
          kid: 'Das Silber ist auf dem Glas, aber nichts passiert! Das Silber im Glas sind unsichtbare Silberionen, und die brauchen Elektronen. Gieß auch das Reduktionsmittel dazu.',
          sci: 'Das Silber bleibt als Ag(NH₃)₂⁺-Ionen gelöst: Ohne Reduktionsmittel gibt es keine Elektronen, die es in Metall verwandeln.',
        },
        dirty: {
          kid: 'Die alte Schicht ist noch drauf! Neues Silber haftet nicht auf altem, mattem Silber. Wasch sie zuerst mit der Säure ab.',
          sci: 'Silber, das sich über altem Anlaufbelag abscheidet, wäre uneben und würde nicht haften: Zuerst die Schicht abätzen.',
        },
        film: {
          kid: 'Beide Flüssigkeiten sind auf dem Glas, und die Wischer halten sie in Bewegung. Silberatome setzen sich ab.',
          sci: 'Jedes Ag⁺ nimmt ein Elektron vom Reduktionsmittel und wird zu einem Silberatom, das sich auf dem Glas absetzt. Die Wischer führen frische Flüssigkeit darüber.',
        },
        start: { kid: 'Silberatome beginnen, sich auf dem Glas abzusetzen.', sci: 'Silberatome setzen sich auf dem Glas ab: zuerst einzelne Körnchen.' },
        haze: {
          kid: 'Ein bräunlicher Schleier. Das Silber ist so dünn, dass noch Licht hindurchgeht.',
          sci: 'Einzelne Körnchen und ein lückenhafter Film, braun im durchfallenden Licht, weil noch Licht hindurchgeht.',
        },
        shine: {
          kid: 'Der Schleier beginnt zu glänzen, und ein Spiegel entsteht. Du siehst schon die Kuppel darin!',
          sci: 'Die Körnchen wachsen zu einem geschlossenen Film zusammen, und der Reflexionsgrad steigt. Bei etwa 100 nm geht kein Licht mehr hindurch.',
        },
        done: {
          kid: 'Ein Spiegel! Das Messgerät sagt, er wirft {r} von 100 Lichtstückchen zurück. Der Film ist {nm} nm dick, hunderte Male dünner als ein Haar.',
          sci: 'Film {nm} nm, Reflexionsgrad {r}% auf der Anschauungskurve des Messgeräts (frisches Silber reflektiert 95 bis 98% des sichtbaren Lichts). Mehr als etwa 100 nm bringt kaum noch Reflexion.',
        },
        again: { kid: 'Diese Schicht ist fertig. Um neu anzufangen, wasch sie mit der Säure ab.', sci: 'Schicht fertig. Löse sie mit der Säure ab, um sie zu wiederholen.' },
        nofilm: {
          kid: 'Es gibt noch nichts, was wachsen könnte. Gieß zuerst die Säure, das Reduktionsmittel und das Silber auf.',
          sci: 'Noch kein Film: Erst mit Säure waschen, dann Reduktionsmittel und Silber auftragen, bevor die Minuten laufen.',
        },
        dishEmpty: { kid: 'Auf dem Glas ist noch kein Silber.', sci: 'Noch kein Film, also kein Silber zum Sammeln.' },
        dish: {
          kid: 'Das ganze Silber dieser Schicht, zusammengesammelt, ergibt einen Würfel von nur {cm} cm Kantenlänge. Er ist kleiner als ein Zuckerwürfel ({sugar} cm). Hier sind beide 8-mal zu groß gezeichnet.',
          sci: '{nm} nm über {area} m² sind {cm3} cm³ Silber: etwa {g} g, ein Würfel von {cm} cm Kantenlänge. Porter (1929) nannte einen Würfel von etwa 3/8 Zoll. Beide Würfel sind 8-mal zu groß gezeichnet.',
        },
      },
      panel: {
        kid: [
          'Vor 1835 waren Spiegel Glas mit einer giftigen Mischung aus Zinn und Quecksilber auf der Rückseite. Dann fand der Chemiker Justus von Liebig heraus, wie man Silber aus einer klaren Flüssigkeit auf Glas abscheiden lässt, als Haut aus glänzendem Metall. Astronomen liebten das: Wurde das Silber matt, konnten sie es abwaschen und eine neue Haut machen.',
          'Probier es selbst. Tippe auf das Säureglas, um das alte Silber abzuwaschen. Gieß dann das Reduktionsmittel und das Silberglas auf. Das Silber im Glas ist unsichtbar: Silberatome, denen ein Elektron fehlt, gelöst in Ammoniak. Das Reduktionsmittel gibt die Elektronen zurück, und richtige Silberatome fallen aus der Flüssigkeit aufs Glas.',
          'Die Haut ist hunderte Male dünner als ein Haar. Alles Silber auf diesem 2,5 m großen Spiegel passte in einen Würfel von etwa 1 cm Kantenlänge: Tippe auf das Schälchen, um ihn zu sehen. (Die Wiege kippt den Spiegel hier, damit man seine Fläche sehen kann.)',
        ],
        sci: [
          'Liebigs Versilberung (1835): In Ammoniak gelöstes Silbernitrat, als Diamminsilber(I)-Ion Ag(NH₃)₂⁺, wird von einem Aldehyd oder einem Zucker reduziert, wie bei der Tollensprobe, und das Silber scheidet sich als Film auf dem Glas ab. Davor wurden Spiegel mit einem Zinn-Quecksilber-Amalgam belegt. Steinheil (1856) und Foucault (1857) versilberten die Vorderseite geschliffenen Glases und ersetzten damit Spiegelmetall.',
          'Das Glas muss blank sein, deshalb wird die alte Schicht zuerst mit starker Säure entfernt. Welches Reduktionsmittel die Sternwarte nahm, steht in Porters Bericht nicht (für große Spiegel wurden Zucker, Seignettesalz und Formaldehyd verwendet), darum steht auf dem Glas nur Reduktionsmittel. Im Lauf der Minuten wird der Film von einzelnen Körnchen, braun, weil noch Licht hindurchgeht, zu einer geschlossenen Schicht. Bei etwa 100 nm geht kein Licht mehr hindurch; das Messgerät zeigt eine Anschauungskurve.',
          'Porter (Scientific American, 1929): etwa drei Pfund (1,4 kg) Silbernitrat in Lösung, ein Film von etwa 1/100 000 Zoll (254 nm) Dicke, eine neue Schicht etwa zweimal im Jahr; alles Silber auf der Scheibe ergäbe einen Würfel von etwa 3/8 Zoll Kantenlänge. Hier: Die Fläche der Scheibe, 5,07 m², mal 254 nm ergibt 1,29 cm³, etwa 13,5 g, einen Würfel von 1,09 cm Kantenlänge (der größte Teil des Silbers in der Lösung landet also woanders). John Strong aluminisierte den Spiegel 1935.',
        ],
      },
      tip: 'Zieh am Regler, um die Minuten selbst ablaufen zu lassen. Tippe auf das Schälchen, um alles Silber dieser Schicht auf einem Häufchen zu sehen.',
      minutes: 'Minuten im Bad',
      buttons: { acid: 'Säure aufgießen', reducer: 'Reduktionsmittel aufgießen', silver: 'Silber aufgießen', dish: 'Schälchen zeigen' },
    },
    metals: {
      label: 'Spiegelmetalle',
      hints: { mirror: 'Tippe auf einen Spiegel', slide: 'Schiebe die Farbe', foul: 'Tippe auf das Glas mit der schlechten Luft', again: 'Tippe auf den Silberspiegel' },
      title: 'Welches Metall glänzt am besten?',
      foulLabel: 'Schlechte Luft',
      cards: {
        speculum: 'Spiegelmetall\nNewton, 1668',
        amalgam: 'Zinn und Quecksilber\nVenedig, 1500er',
        aluminium: 'Aluminium\nHooker, 1935',
        silver: 'Silber\nLiebig, 1835',
        gold: 'Gold\nzum Vergleich',
      },
      names: { speculum: 'Spiegelmetall', amalgam: 'Zinn und Quecksilber', aluminium: 'Aluminium', silver: 'Silber', gold: 'Gold' },
      chart: { title: 'Zurückgeworfenes Licht', read: '{name}: {r}%', axis: 'Farbe des Lichts in Nanometern', none: 'tippe auf einen Spiegel' },
      bands: { uv: 'ultraviolett, unsichtbar', violet: 'violett', blue: 'blau', green: 'grün', yellow: 'gelb', orange: 'orange', red: 'rot', ir: 'infrarot, unsichtbar' },
      says: {
        speculum: {
          kid: 'Spiegelmetall ist polierte Bronze aus Kupfer und Zinn. Newton machte 1668 den Spiegel seines Teleskops daraus. Es wirft nur etwa 6 von 10 Lichtstückchen zurück, läuft matt an und muss neu poliert werden.',
          sci: 'Spiegelmetall, etwa zwei Teile Kupfer auf einen Teil Zinn: Reflexionsgrad grob 60 bis 65% im Sichtbaren, blass und leicht rosa. Es lief an, und jedes Nachpolieren gefährdete die Form des Spiegels.',
        },
        amalgam: {
          kid: 'Venedigs Spiegel waren Glas mit Zinn und Quecksilber auf der Rückseite. Sie waren besser als Spiegelmetall, aber die Quecksilberdämpfe machten die Spiegelmacher krank.',
          sci: 'Zinn-Quecksilber-Amalgam auf Glas (Venedig, ab dem 16. Jahrhundert): grob 70% (die Kurve hier ist eine grobe Schätzung), und giftig in der Herstellung.',
        },
        aluminium: {
          kid: 'Aluminium wirft etwa 9 von 10 Lichtstückchen zurück und funktioniert sogar bei Farben, die wir nicht sehen. 1935 bekam der große Spiegel eine Aluminiumhaut.',
          sci: 'Aluminium: etwa 90% im ganzen Sichtbaren, mit einer Senke bei 800 nm, und noch etwa 90% weit ins Ultraviolette hinein. John Strong beschichtete den Hooker-Spiegel 1935 damit, im Vakuum aufgedampft; die Schicht hält viel länger als Silber.',
        },
        silver: {
          kid: 'Silber ist im Sichtbaren das Beste: 95 bis 98 von 100 Lichtstückchen. Aber probiere Violett und Ultraviolett!',
          sci: 'Silber: 95 bis 98% des sichtbaren Lichts, mehr als jedes andere Metall, aber der Reflexionsgrad fällt im Violetten ab und verschwindet bei etwa 320 nm fast ganz.',
        },
        gold: {
          kid: 'Gold wirft rotes und gelbes Licht sehr gut zurück, schluckt aber Blau. Darum sieht Gold golden aus.',
          sci: 'Gold: über 90% von etwa 600 nm bis ins Infrarote, aber nur etwa 40% im Blauen. Seine Elektronen absorbieren blaues Licht, und das gibt Gold seine Farbe.',
        },
        slide: {
          kid: '{nm} nm, {band}. Silber wirft {ag} von 100 zurück, Aluminium {al}, Gold {au}.',
          sci: '{nm} nm ({band}): Silber {ag}%, Aluminium {al}%, Gold {au}%, Spiegelmetall {sp}%.',
        },
        foul: {
          kid: 'Ein Glas mit schlechter Luft, es riecht nach faulen Eiern. Silber wird darin schwarz. Sieh zu, wie die Anzeige fällt!',
          sci: 'Schwefelwasserstoff und andere Schwefelverbindungen in der Luft machen Silber zu schwarzem Silbersulfid, Ag₂S, schon in Spuren. Die Anzeige fällt, während der Film dunkler wird (eine Anschauungskurve).',
        },
        tarnished: {
          kid: 'Angelaufen! Das Schwarze schluckt Licht. Darum brauchte der große Spiegel etwa zweimal im Jahr eine frische Schicht.',
          sci: 'Silber zeigt hier jetzt {r}%. Ein angelaufener Spiegel verschenkt Licht, darum die Neubeschichtung etwa zweimal im Jahr.',
        },
        fresh: { kid: 'Eine frische Silberschicht, wieder hell. Das war die Arbeit, etwa zweimal im Jahr.', sci: 'Frisch versilbert: wieder die volle Kurve.' },
      },
      panel: {
        kid: [
          'Ein Spiegel ist eine sehr glatte Fläche aus etwas Glänzendem, aber manches Glänzende glänzt mehr als anderes. Tippe auf einen Spiegel, und eine Lampe schickt einen Strahl darauf. Das Messgerät zeigt, wie viel Licht zurückkommt.',
          'Schiebe die Farbe des Lichts von Violett nach Rot und sieh dir jedes Metall an. Silber ist am besten, außer in Violett. Aluminium funktioniert sogar bei Farben, die wir nicht sehen. Gold mag nur Rot und Gelb, darum sieht es gelb aus.',
          'Silber hat ein großes Problem: Es läuft an. Tippe auf das Glas mit schlechter Luft neben dem Silberspiegel und sieh auf die Anzeige. Darum bekam der Spiegel des großen Teleskops etwa zweimal im Jahr eine neue Silberschicht. Teleskope wie Gemini nehmen heute wieder Silber, aber unter einer dünnen, klaren Schutzschicht.',
        ],
        sci: [
          'Reflexionsgrad bei senkrechtem Einfall, der Anteil des zurückgeworfenen Lichts: Spiegelmetall (Newton, 1668) grob 60 bis 65%; Zinn-Quecksilber-Amalgam (Venedig) grob 70%; Aluminium etwa 90%; Silber 95 bis 98%; Gold über 90% im Roten und Infraroten. Die Kurven im Diagramm sind glatte Näherungen veröffentlichter Kurven von Beschichtungsherstellern, auf wenige Punkte genau (Spiegelmetall und Amalgam nur grob).',
          'Der Reflexionsgrad von Silber fällt durch das Violette ab, und bei 320 nm beträgt er nur noch wenige Prozent; Aluminium bleibt von etwa 200 nm bis ins nahe Infrarot bei etwa 90%, mit einer Senke bei 800 nm. Das und eine Schicht, die Jahre hält, ist der Grund, warum der Hooker-Spiegel 1935 aluminisiert wurde. Gold absorbiert Blau (etwa 40% bei 450 nm) und reflektiert Rot und Infrarot zu über 90%.',
          'Silber läuft zu schwarzem Silbersulfid an, wegen Spuren von Schwefelverbindungen in der Luft, darum wurde der Hooker-Spiegel etwa zweimal im Jahr neu versilbert (Porter, 1929). Seit 2004 sind die 8,1-m-Spiegel der Gemini-Teleskope wieder versilbert, unter einer Schutzschicht, weil Silber im Infraroten so wenig Wärme abstrahlt.',
        ],
      },
      tip: 'Schiebe die Farbe des Lichts. Tippe auf das Glas mit schlechter Luft neben dem Silberspiegel, dann auf „Noch einmal versilbern“, um von vorn anzufangen.',
      wave: 'Farbe des Lichts',
      buttons: { foul: 'Das Glas mit schlechter Luft öffnen', fresh: 'Noch einmal versilbern' },
    },
    galaxy: {
      label: 'Die Galaxienjagd',
      hints: { scope: 'Tippe auf das Teleskop', wait: 'Warte auf die Platte', plate: 'Tippe auf die Glasplatte', spots: 'Tippe auf einen mit N markierten Punkt', slide: 'Schiebe den Puls' },
      title: 'Eine andere Galaxie?',
      holder: 'Platte H335H',
      days: 'Tage',
      curveAxis: 'Tage',
      boards: { curve: 'Der Stern über die Tage', dist: 'Wie weit weg?' },
      plates: { older: 'ältere Platte', now: '5. bis 6. Oktober 1923, 45 Minuten' },
      says: {
        point: {
          kid: 'Die Kuppel dreht sich, der Spalt schwenkt zu Andromeda, und das Teleskop folgt. Das Sternenlicht sammelt sich nun auf einer Glasplatte. 45 Minuten vergehen in ein paar Sekunden.',
          sci: 'Kuppel und Teleskop auf Andromeda (M31) gerichtet. Platte H335H, Nacht vom 5. auf den 6. Oktober 1923: 45 Minuten Belichtung, hier beschleunigt.',
        },
        away: { kid: 'Das Teleskop dreht sich zurück zur Milchstraße.', sci: 'Teleskop wieder auf die Milchstraße gerichtet; die Kuppel folgt.' },
        expoDone: { kid: 'Die Platte ist voller Sterne! Tippe darauf, um sie auf den Leuchttisch zu legen.', sci: 'Belichtung fertig, 45 Minuten. Tippe auf die Platte, um sie auf dem Leuchttisch anzusehen.' },
        noScope: { kid: 'Richte zuerst das Teleskop auf Andromeda.', sci: 'Richte das Teleskop auf Andromeda, bevor du belichtest.' },
        plateOn: {
          kid: 'Auf dem Leuchttisch sind Sterne schwarze Punkte. Hubble suchte neue Sterne, die hell aufleuchten, sogenannte Novae. Drei markierte er mit einem N. Tippe auf jedes N und vergleiche mit der älteren Platte daneben.',
          sci: 'Auf dem Leuchttisch ist die Platte ein Negativ: Sterne sind dunkel. Hubble markierte drei Nova-Kandidaten mit N; eine Nova sollte auf früheren Platten fehlen. Vergleiche jeden mit der älteren Platte daneben.',
        },
        noPlate: { kid: 'Es gibt noch keine Platte. Richte das Teleskop aus und warte auf die Belichtung.', sci: 'Noch keine belichtete Platte: Richte das Teleskop aus und lass die Belichtung laufen.' },
        faint: { kid: 'Noch zu schwach zu sehen: Die Platte braucht mehr Belichtung.', sci: 'Noch nicht genug Belichtung, um diesen Stern zu zeigen.' },
        nova: {
          kid: 'Auf der älteren Platte ist er nicht, also sieht er nach einer Nova aus: ein Stern, der aufgeflammt ist.',
          sci: 'Auf der älteren Platte nicht vorhanden, auf der neuen schon: vereinbar mit einer Nova.',
        },
        var: {
          kid: 'Sieh mal! Dieser Stern ist auch auf der älteren Platte, aber schwächer. Er ist kein neuer Stern: Sein Licht geht auf und ab. Hubble strich das N durch und schrieb VAR!',
          sci: 'Auf der älteren Platte mit anderer Helligkeit vorhanden: keine Nova, sondern ein Veränderlicher. Hubble strich das N durch und schrieb VAR! auf die Platte.',
        },
        curve: {
          kid: 'Alle 31 Tage schwillt der Stern hell an, wird schwächer und schwillt wieder an, immer wieder. Ein Stern, der so pulsiert, heißt Cepheide.',
          sci: 'Eine Cepheide: regelmäßiger Puls von 31,4 Tagen mit schnellem Anstieg und langsamem Abfall (eine typische Cepheidenform, nicht Hubbles eigene Messungen).',
        },
        slide: {
          kid: 'Ein Stern, der alle {p} Tage pulsiert, ist in Wirklichkeit etwa {l}-mal heller als die Sonne. Er sieht sehr schwach aus, also muss er {d} Lichtjahre entfernt sein.',
          sci: 'P = {p} d ergibt M = {M} mag, L = {l} Sonnen. Bei einer festen scheinbaren Helligkeit von etwa 19 beträgt die Entfernung {d} Lichtjahre.',
        },
        old: {
          kid: 'Das sind Hubbles Zahlen von 1925, so groß, wie damals jemand zu denken wagte.',
          sci: 'Nullpunkt der Perioden-Leuchtkraft-Beziehung von 1925: etwa 930 000 Lichtjahre (285 000 pc), meist genannt als etwa 900 000 Lichtjahre.',
        },
        now: {
          kid: 'Und die heutigen Zahlen: mehr als doppelt so weit. Andromeda ist eine ganze Galaxie, weit außerhalb unserer!',
          sci: 'Mit der heutigen Eichung ist derselbe Stern etwa 2,5 Millionen Lichtjahre entfernt: Baade (1952) fand zwei Arten von Cepheiden und verdoppelte die Skala; bessere Eichungen und Staubkorrekturen folgten.',
        },
      },
      board: {
        kid: 'Puls: {p} Tage\nin Wirklichkeit: {l} Sonnen\nweit: {d} Lichtjahre',
        sci: 'P = {p} d\nM = {M}, L = {l} Sonnen\nd = {d} Lichtjahre',
      },
      panel: {
        kid: [
          '1923 dachten viele Astronomen, die Milchstraße sei das ganze Universum und der verschwommene „Andromedanebel“ eine Wolke darin. Edwin Hubble benutzte den großen Spiegel dieses Teleskops, um es herauszufinden.',
          'Er machte lange Aufnahmen auf Glasplatten und suchte Sterne, die hell aufleuchten. Tippe auf das Teleskop, tippe auf die Platte und dann auf die mit N markierten Punkte. Einer davon war gar kein neuer Stern: Er pulsierte, immer wieder.',
          'Henrietta Leavitt hatte gefunden: Je langsamer ein solcher Stern pulsiert, desto heller ist er in Wirklichkeit. Aus dem Puls wusste Hubble also, wie hell der Stern wirklich war, und aus seiner Schwäche, wie weit er entfernt war. Schiebe den Puls und sieh nach! Er war weit außerhalb der Milchstraße: Andromeda ist eine andere Galaxie.',
        ],
        sci: [
          'Platte H335H, 5. bis 6. Oktober 1923, das 100-Zoll-Hooker-Teleskop, 45 Minuten. Hubble markierte in M31 drei scheinbare Novae mit N und verglich dann frühere Platten: Ein Stern war mit anderer Helligkeit vorhanden, also strich er sein N durch und schrieb VAR!. Es war eine Cepheide (V1) mit einer Periode von 31,4 Tagen.',
          'Leavitts Perioden-Leuchtkraft-Beziehung (1908, 1912): Je länger die Periode, desto größer die Leuchtkraft. Der Raum benutzt M = −2,43 (log P − 1) − 4,05 für die heutige Skala, für die Skala von 1925 um 2,15 mag verschoben, bei einer auf 19,16 festgehaltenen scheinbaren Helligkeit des Sterns (eine runde Zahl, so gewählt, dass die Entfernungen wie veröffentlicht herauskommen: 285 000 pc, etwa 930 000 Lichtjahre, 1925; etwa 2,5 Millionen Lichtjahre heute).',
          'Warum sich die Skala änderte: Der Nullpunkt der Beziehung (Shapleys Eichung) war falsch, Baade (1952) trennte zwei Populationen von Cepheiden und verdoppelte die extragalaktischen Entfernungen etwa, und spätere Eichungen und Staubkorrekturen brachten M31 auf etwa 2,5 Millionen Lichtjahre. Schon 1925 lag die Entfernung weit jenseits von Shapleys Größe der Milchstraße (etwa 300 000 Lichtjahre).',
        ],
      },
      tip: 'Schiebe die Belichtung, um zu sehen, welche Sterne erscheinen. Schiebe die Periode, um zu sehen, wie der Puls eines Sterns seine Entfernung verrät.',
      expo: 'Minuten Belichtung',
      period: 'Tage zwischen den Maxima',
      buttons: { scope: 'Teleskop ausrichten', plate: 'Die Platte ansehen', spot: 'Nächsten Punkt prüfen', scale: '1925 oder heute' },
    },
  },
}
