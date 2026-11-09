// The DNA bench's words, in every language (i18n/langs.js: pt-pt, en, pl, de; a missing one falls back to
// English) and at both depths (kid: Explorer, sci: Scientist). The title is in the locale files
// (bench.dna.title). Numbers come from bases.js (the model) and from the sources in docs/knowledge/dna.md.
// Polish words after a count have three forms (1 para, 2 pary, 5 par): plPlural.
import { tagOf } from '../../../i18n/langs.js'

const plPlural = (n, one, few, many) => {
  if (n === 1) return one
  const t = n % 10
  const h = n % 100
  return t >= 2 && t <= 4 && !(h >= 12 && h <= 14) ? few : many
}

const PAIR_SCI = {
  AT: {
    en: 'two hydrogen bonds, N6-H···O4 and N3-H···N1 (about 3 Å each).',
    'pt-pt': 'duas ligações de hidrogénio, N6-H···O4 e N3-H···N1 (cerca de 3 Å cada).',
    pl: 'dwa wiązania wodorowe, N6-H···O4 i N3-H···N1 (około 3 Å każde).',
    de: 'zwei Wasserstoffbrücken, N6-H···O4 und N3-H···N1 (je etwa 3 Å).',
  },
  GC: {
    en: 'three hydrogen bonds, N4-H···O6, N1-H···N3 and N2-H···O2 (about 3 Å each).',
    'pt-pt': 'três ligações de hidrogénio, N4-H···O6, N1-H···N3 e N2-H···O2 (cerca de 3 Å cada).',
    pl: 'trzy wiązania wodorowe, N4-H···O6, N1-H···N3 i N2-H···O2 (około 3 Å każde).',
    de: 'drei Wasserstoffbrücken, N4-H···O6, N1-H···N3 und N2-H···O2 (je etwa 3 Å).',
  },
}
const kindOf = b => (b === 'A' || b === 'T' ? 'AT' : 'GC')

export const WORDS = {
  en: {
    name: { A: 'adenine', T: 'thymine', G: 'guanine', C: 'cytosine' },
    family: { A: 'purine', G: 'purine', T: 'pyrimidine', C: 'pyrimidine' },
    holds: p => `holds ${p}`,
    tray: { kid: 'Tap a letter', sci: 'Tap a base' },
    start: {
      kid: 'Tap a letter to start your DNA. Each one brings its partner: A always holds T, and G always holds C.',
      sci: 'Tap a base to add a nucleotide (base, deoxyribose, phosphate) to the 3′ end of the strand. Its complement pairs with it by hydrogen bonds.',
    },
    pair: {
      kid: ({ b, p }) => (kindOf(b) === 'AT' ? `${b} and ${p} click together with two hydrogen bonds.` : `${b} and ${p} hold on with three hydrogen bonds: the stronger pair!`),
      sci: ({ b, p }) => `${b}·${p}: ${PAIR_SCI[kindOf(b)].en}`,
    },
    undo: { kid: 'One pair taken off.', sci: 'The last nucleotide pair removed from the 3′ end.' },
    cleared: { kid: 'All gone. Tap a letter to start again.', sci: 'Cleared. Tap a base to start a new strand.' },
    full: {
      kid: 'This bench holds 24 pairs. One set of your chromosomes holds about 3.1 billion!',
      sci: 'The bench\'s limit: 24 bp. One set of human chromosomes: about 3.1 billion bp (3.1 × 10⁹), about 1 m of DNA.',
    },
    needMore: { kid: 'Add at least three letters first, then copy.', sci: 'Build at least 3 bp before replicating.' },
    copying: {
      kid: 'Unzipping! The two halves come apart and each one gets new partners.',
      sci: 'Replication: the strands separate at the fork (in a cell, a helicase unwinds them) and each strand is a template; new nucleotides pair with it by the base-pairing rule.',
    },
    copied: {
      kid: 'Two copies, exactly the same! Each one has an old half and a new half.',
      sci: 'Two identical double helices, each with one parental strand and one new strand: semi-conservative, as Meselson and Stahl showed in 1958.',
    },
    joined: { kid: 'One helix again. Keep building!', sci: 'Back to one duplex (the other copy would go to the second cell).' },
    help: {
      kid: 'Tap a letter to add it · tap the helix to copy it · drag to look round',
      sci: 'Tap a base to add a nucleotide · tap the helix to replicate it · drag to turn the view',
    },
    status: {
      kid: ({ n, hb }) => `${n} ${n === 1 ? 'pair' : 'pairs'} · ${hb} hydrogen ${hb === 1 ? 'bond' : 'bonds'}`,
      sci: ({ n, nm, turns, gc }) => `${n} bp · ${nm} nm · ${turns} turns · G+C ${gc}%`,
    },
    undoBtn: 'Undo',
    clearBtn: 'Clear',
    copyBtn: { kid: 'Copy it', sci: 'Replicate' },
    keepBtn: 'Keep one',
    twist: { kid: 'Twist', sci: 'Twist per pair' },
    ladder: 'ladder',
    helix: 'helix',
    finds: 'Finds',
    about: { kid: 'Did you know?', sci: 'The numbers' },
    find: {
      at: { title: 'An A-T pair', kid: 'Your first A-T pair: two hydrogen bonds hold them.', sci: 'A·T: two hydrogen bonds; in human DNA about 59% of the pairs are A·T.' },
      gc: { title: 'A G-C pair', kid: 'Your first G-C pair: three hydrogen bonds, the strongest grip.', sci: 'G·C: three hydrogen bonds; DNA rich in G·C holds together up to higher temperatures (about 41% of human DNA).' },
      atg: { title: 'The start signal', kid: 'You wrote ATG! In a real gene these three letters mean "start here".', sci: 'ATG, the start codon: read as AUG in messenger RNA, it codes for methionine and starts almost every protein.' },
      turn: { title: 'A full turn', kid: 'A full turn! Ten and a half pairs make the ladder twist once all the way round.', sci: 'One full turn of B-DNA: 10.5 bp, about 3.5 nm along the axis (34.3° and 0.34 nm per pair).' },
      copy: { title: 'A copy', kid: 'Two copies, exactly the same! Each one has an old half and a new half.', sci: 'Semi-conservative replication: each daughter helix keeps one parental strand (Meselson and Stahl, 1958).' },
    },
    facts: {
      kid: [
        'DNA is a recipe book. Its four letters, in the right order, tell your body how to build you.',
        'If you stretched out the DNA in just one of your cells, it would be about 2 metres long.',
        'Before a cell splits in two, it copies all of its DNA, so each new cell gets a whole set.',
        'You share about 99.9% of your DNA letters with every other person on Earth.',
        'A is always across from T, and G from C. So if you know one strand, you know the other!',
        'Rosalind Franklin took a famous X-ray photo, "Photo 51", that showed DNA is a helix.',
        'Half of your DNA came from your mum and half from your dad.',
      ],
      sci: [
        'B-DNA: right-handed, 10.5 bp per turn, 0.34 nm rise, 34.3° twist, 2 nm across (the form in cells).',
        'The two strands are antiparallel: one runs 5′ to 3′, its partner 3′ to 5′. Polymerases only add to a 3′ end.',
        'Chargaff\'s rule (1950): in double-stranded DNA, A = T and G = C.',
        'One set of human chromosomes: about 3.1 billion bp (the complete sequence, T2T, 2022: 3.055 billion).',
        'Watson and Crick proposed the double helix in 1953, building on the X-ray photos of Franklin and Wilkins.',
        'The grooves: the major one about 2.2 nm across, the minor about 1.2 nm. Proteins read the letters through the major groove.',
        'Copying is accurate: with proofreading and repair, about one mistake in a billion letters.',
      ],
    },
    numbers: [['Helix', 'right-handed'], ['Pairs per turn', '10.5'], ['Rise per pair', '0.34 nm'], ['Twist per pair', '34.3°'], ['Width', '2 nm'], ['Major / minor groove', '2.2 / 1.2 nm'], ['Human genome (one set)', '3.1 × 10⁹ bp']],
  },
  'pt-pt': {
    name: { A: 'adenina', T: 'timina', G: 'guanina', C: 'citosina' },
    family: { A: 'purina', G: 'purina', T: 'pirimidina', C: 'pirimidina' },
    holds: p => `segura o ${p}`,
    tray: { kid: 'Toca numa letra', sci: 'Toca numa base' },
    start: {
      kid: 'Toca numa letra para começar o teu ADN. Cada uma traz o seu par: o A segura sempre o T, e o G segura sempre o C.',
      sci: 'Toca numa base para juntar um nucleótido (base, desoxirribose, fosfato) à ponta 3′ da cadeia. A base complementar emparelha com ela por ligações de hidrogénio.',
    },
    pair: {
      kid: ({ b, p }) => (kindOf(b) === 'AT' ? `O ${b} e o ${p} encaixam com duas ligações de hidrogénio.` : `O ${b} e o ${p} seguram-se com três ligações de hidrogénio: o par mais forte!`),
      sci: ({ b, p }) => `${b}·${p}: ${PAIR_SCI[kindOf(b)]['pt-pt']}`,
    },
    undo: { kid: 'Saiu um par.', sci: 'Retirado o último par de nucleótidos da ponta 3′.' },
    cleared: { kid: 'Tudo limpo. Toca numa letra para recomeçar.', sci: 'Limpo. Toca numa base para começar uma nova cadeia.' },
    full: {
      kid: 'Esta bancada leva 24 pares. Um conjunto dos teus cromossomas tem cerca de 3,1 mil milhões!',
      sci: 'O limite da bancada: 24 pb. Um conjunto de cromossomas humanos: cerca de 3,1 mil milhões de pb (3,1 × 10⁹), cerca de 1 m de ADN.',
    },
    needMore: { kid: 'Junta pelo menos três letras primeiro, depois copia.', sci: 'Constrói pelo menos 3 pb antes de replicar.' },
    copying: {
      kid: 'A abrir o fecho! As duas metades separam-se e cada uma recebe novos pares.',
      sci: 'Replicação: as cadeias separam-se na forquilha (numa célula, uma helicase desenrola-as) e cada cadeia serve de molde; novos nucleótidos emparelham com ela pela regra das bases.',
    },
    copied: {
      kid: 'Duas cópias, exatamente iguais! Cada uma tem uma metade velha e uma metade nova.',
      sci: 'Duas duplas hélices idênticas, cada uma com uma cadeia original e uma nova: replicação semiconservativa, como Meselson e Stahl mostraram em 1958.',
    },
    joined: { kid: 'Outra vez uma só hélice. Continua a construir!', sci: 'De volta a um só dúplex (a outra cópia iria para a segunda célula).' },
    help: {
      kid: 'Toca numa letra para a juntar · toca na hélice para a copiar · arrasta para olhar em volta',
      sci: 'Toca numa base para juntar um nucleótido · toca na hélice para a replicar · arrasta para rodar a vista',
    },
    status: {
      kid: ({ n, hb }) => `${n} ${n === 1 ? 'par' : 'pares'} · ${hb} ${hb === 1 ? 'ligação' : 'ligações'} de hidrogénio`,
      sci: ({ n, nm, turns, gc }) => `${n} pb · ${nm} nm · ${turns} voltas · G+C ${gc}%`,
    },
    undoBtn: 'Desfazer',
    clearBtn: 'Limpar',
    copyBtn: { kid: 'Copiar', sci: 'Replicar' },
    keepBtn: 'Ficar com uma',
    twist: { kid: 'Torção', sci: 'Torção por par' },
    ladder: 'escada',
    helix: 'hélice',
    finds: 'Descobertas',
    about: { kid: 'Sabias que?', sci: 'Os números' },
    find: {
      at: { title: 'Um par A-T', kid: 'O teu primeiro par A-T: duas ligações de hidrogénio seguram-nos.', sci: 'A·T: duas ligações de hidrogénio; no ADN humano cerca de 59% dos pares são A·T.' },
      gc: { title: 'Um par G-C', kid: 'O teu primeiro par G-C: três ligações de hidrogénio, o aperto mais forte.', sci: 'G·C: três ligações de hidrogénio; o ADN rico em G·C aguenta-se unido até temperaturas mais altas (cerca de 41% do ADN humano).' },
      atg: { title: 'O sinal de início', kid: 'Escreveste ATG! Num gene a sério, estas três letras querem dizer «começa aqui».', sci: 'ATG, o codão de iniciação: lido como AUG no ARN mensageiro, codifica a metionina e dá início a quase todas as proteínas.' },
      turn: { title: 'Uma volta completa', kid: 'Uma volta completa! Dez pares e meio fazem a escada dar uma volta inteira.', sci: 'Uma volta completa do ADN-B: 10,5 pb, cerca de 3,5 nm ao longo do eixo (34,3° e 0,34 nm por par).' },
      copy: { title: 'Uma cópia', kid: 'Duas cópias, exatamente iguais! Cada uma tem uma metade velha e uma metade nova.', sci: 'Replicação semiconservativa: cada hélice filha fica com uma cadeia original (Meselson e Stahl, 1958).' },
    },
    facts: {
      kid: [
        'O ADN é um livro de receitas. As suas quatro letras, pela ordem certa, dizem ao teu corpo como te construir.',
        'Se esticasses o ADN de uma só das tuas células, teria cerca de 2 metros.',
        'Antes de se dividir em duas, uma célula copia todo o seu ADN, e assim cada célula nova recebe um conjunto completo.',
        'Cerca de 99,9% das letras do teu ADN são iguais às de qualquer outra pessoa da Terra.',
        'O A fica sempre em frente ao T, e o G em frente ao C. Por isso, se conheces uma cadeia, conheces a outra!',
        'Rosalind Franklin tirou uma fotografia de raios X famosa, a «Fotografia 51», que mostrou que o ADN é uma hélice.',
        'Metade do teu ADN veio da tua mãe e metade do teu pai.',
      ],
      sci: [
        'ADN-B: hélice direita, 10,5 pb por volta, 0,34 nm de subida, 34,3° de torção, 2 nm de diâmetro (a forma nas células).',
        'As duas cadeias são antiparalelas: uma vai de 5′ para 3′, a outra de 3′ para 5′. As polimerases só acrescentam numa ponta 3′.',
        'Regra de Chargaff (1950): no ADN de cadeia dupla, A = T e G = C.',
        'Um conjunto de cromossomas humanos: cerca de 3,1 mil milhões de pb (a sequência completa, T2T, 2022: 3055 milhões).',
        'Watson e Crick propuseram a dupla hélice em 1953, com base nas fotografias de raios X de Franklin e Wilkins.',
        'Os sulcos: o maior com cerca de 2,2 nm, o menor com cerca de 1,2 nm. As proteínas leem as letras pelo sulco maior.',
        'A cópia é rigorosa: com a revisão e a reparação, há cerca de um erro em cada mil milhões de letras.',
      ],
    },
    numbers: [['Hélice', 'direita'], ['Pares por volta', '10,5'], ['Subida por par', '0,34 nm'], ['Torção por par', '34,3°'], ['Diâmetro', '2 nm'], ['Sulco maior / menor', '2,2 / 1,2 nm'], ['Genoma humano (um conjunto)', '3,1 × 10⁹ pb']],
  },
  pl: {
    name: { A: 'adenina', T: 'tymina', G: 'guanina', C: 'cytozyna' },
    family: { A: 'puryna', G: 'puryna', T: 'pirymidyna', C: 'pirymidyna' },
    holds: p => `trzyma ${p}`,
    tray: { kid: 'Dotknij litery', sci: 'Dotknij zasady' },
    start: {
      kid: 'Dotknij litery, żeby zacząć swoje DNA. Każda przyprowadza partnera: A zawsze trzyma T, a G zawsze trzyma C.',
      sci: 'Dotknij zasady, żeby dołączyć nukleotyd (zasada, deoksyryboza, fosforan) do końca 3′ nici. Zasada komplementarna łączy się z nią wiązaniami wodorowymi.',
    },
    pair: {
      kid: ({ b, p }) => (kindOf(b) === 'AT' ? `${b} i ${p} zatrzaskują się dwoma wiązaniami wodorowymi.` : `${b} i ${p} trzymają się trzema wiązaniami wodorowymi: to mocniejsza para!`),
      sci: ({ b, p }) => `${b}·${p}: ${PAIR_SCI[kindOf(b)].pl}`,
    },
    undo: { kid: 'Jedna para zdjęta.', sci: 'Usunięto ostatnią parę nukleotydów z końca 3′.' },
    cleared: { kid: 'Wszystko zniknęło. Dotknij litery, żeby zacząć od nowa.', sci: 'Wyczyszczono. Dotknij zasady, żeby zacząć nową nić.' },
    full: {
      kid: 'Ten stół mieści 24 pary. Jeden komplet twoich chromosomów ma ich około 3,1 miliarda!',
      sci: 'Limit stołu: 24 pz. Jeden zestaw ludzkich chromosomów: około 3,1 miliarda pz (3,1 × 10⁹), czyli około 1 m DNA.',
    },
    needMore: { kid: 'Najpierw dodaj co najmniej trzy litery, potem kopiuj.', sci: 'Zbuduj co najmniej 3 pz przed replikacją.' },
    copying: {
      kid: 'Rozpinamy! Dwie połówki się rozchodzą i każda dostaje nowych partnerów.',
      sci: 'Replikacja: nici rozchodzą się w widełkach (w komórce rozplata je helikaza) i każda nić jest matrycą; nowe nukleotydy łączą się z nią zgodnie z regułą parowania zasad.',
    },
    copied: {
      kid: 'Dwie kopie, dokładnie takie same! Każda ma starą połówkę i nową połówkę.',
      sci: 'Dwie identyczne podwójne helisy, każda z jedną nicią macierzystą i jedną nową: replikacja semikonserwatywna, jak pokazali Meselson i Stahl w 1958 roku.',
    },
    joined: { kid: 'Znowu jedna helisa. Buduj dalej!', sci: 'Znowu jeden dupleks (druga kopia trafiłaby do drugiej komórki).' },
    help: {
      kid: 'Dotknij litery, żeby ją dodać · dotknij helisy, żeby ją skopiować · przeciągnij, żeby się rozejrzeć',
      sci: 'Dotknij zasady, żeby dodać nukleotyd · dotknij helisy, żeby ją zreplikować · przeciągnij, żeby obrócić widok',
    },
    status: {
      kid: ({ n, hb }) => `${n} ${plPlural(n, 'para', 'pary', 'par')} · ${hb} ${plPlural(hb, 'wiązanie wodorowe', 'wiązania wodorowe', 'wiązań wodorowych')}`,
      sci: ({ n, nm, turns, gc }) => `${n} pz · ${nm} nm · ${turns} zwoju · G+C ${gc}%`,
    },
    undoBtn: 'Cofnij',
    clearBtn: 'Wyczyść',
    copyBtn: { kid: 'Skopiuj', sci: 'Replikuj' },
    keepBtn: 'Zostaw jedną',
    twist: { kid: 'Skręt', sci: 'Skręt na parę' },
    ladder: 'drabina',
    helix: 'helisa',
    finds: 'Odkrycia',
    about: { kid: 'Czy wiesz, że?', sci: 'Liczby' },
    find: {
      at: { title: 'Para A-T', kid: 'Twoja pierwsza para A-T: trzymają ją dwa wiązania wodorowe.', sci: 'A·T: dwa wiązania wodorowe; w ludzkim DNA około 59% par to A·T.' },
      gc: { title: 'Para G-C', kid: 'Twoja pierwsza para G-C: trzy wiązania wodorowe, najmocniejszy uścisk.', sci: 'G·C: trzy wiązania wodorowe; DNA bogate w G·C trzyma się razem do wyższej temperatury (około 41% ludzkiego DNA).' },
      atg: { title: 'Sygnał startu', kid: 'ATG! W prawdziwym genie te trzy litery znaczą „zacznij tutaj”.', sci: 'ATG, kodon start: w mRNA czytany jako AUG, koduje metioninę i rozpoczyna prawie każde białko.' },
      turn: { title: 'Pełny zwój', kid: 'Pełny zwój! Dziesięć i pół pary skręca drabinę raz dookoła.', sci: 'Pełny zwój B-DNA: 10,5 pz, około 3,5 nm wzdłuż osi (34,3° i 0,34 nm na parę).' },
      copy: { title: 'Kopia', kid: 'Dwie kopie, dokładnie takie same! Każda ma starą połówkę i nową połówkę.', sci: 'Replikacja semikonserwatywna: każda helisa potomna zachowuje jedną nić macierzystą (Meselson i Stahl, 1958).' },
    },
    facts: {
      kid: [
        'DNA to książka kucharska. Jego cztery litery, ułożone we właściwej kolejności, mówią twojemu ciału, jak cię zbudować.',
        'Gdyby rozciągnąć DNA z jednej twojej komórki, miałoby około 2 metrów długości.',
        'Zanim komórka się podzieli, kopiuje całe swoje DNA, żeby każda nowa komórka dostała cały komplet.',
        'Około 99,9% liter twojego DNA jest takich samych jak u każdego innego człowieka na Ziemi.',
        'Naprzeciw A zawsze stoi T, a naprzeciw G stoi C. Jeśli znasz jedną nić, znasz też drugą!',
        'Rosalind Franklin zrobiła słynne zdjęcie rentgenowskie, „Zdjęcie 51”, które pokazało, że DNA jest helisą.',
        'Połowa twojego DNA pochodzi od mamy, a połowa od taty.',
      ],
      sci: [
        'B-DNA: prawoskrętna, 10,5 pz na zwój, 0,34 nm wzrostu, skręt 34,3°, średnica 2 nm (forma występująca w komórkach).',
        'Nici są antyrównoległe: jedna biegnie od 5′ do 3′, druga od 3′ do 5′. Polimerazy dokładają nukleotydy tylko do końca 3′.',
        'Reguła Chargaffa (1950): w dwuniciowym DNA A = T i G = C.',
        'Jeden zestaw ludzkich chromosomów: około 3,1 miliarda pz (pełna sekwencja, T2T, 2022: 3,055 miliarda).',
        'Watson i Crick zaproponowali podwójną helisę w 1953 roku, opierając się na zdjęciach rentgenowskich Franklin i Wilkinsa.',
        'Bruzdy: większa ma około 2,2 nm szerokości, mniejsza około 1,2 nm. Białka odczytują litery przez bruzdę większą.',
        'Kopiowanie jest dokładne: dzięki korekcie i naprawie zdarza się około jednego błędu na miliard liter.',
      ],
    },
    numbers: [['Helisa', 'prawoskrętna'], ['Pary na zwój', '10,5'], ['Wzrost na parę', '0,34 nm'], ['Skręt na parę', '34,3°'], ['Średnica', '2 nm'], ['Bruzda większa / mniejsza', '2,2 / 1,2 nm'], ['Genom człowieka (jeden zestaw)', '3,1 × 10⁹ pz']],
  },
  de: {
    name: { A: 'Adenin', T: 'Thymin', G: 'Guanin', C: 'Cytosin' },
    family: { A: 'Purin', G: 'Purin', T: 'Pyrimidin', C: 'Pyrimidin' },
    holds: p => `hält ${p}`,
    tray: { kid: 'Tippe auf einen Buchstaben', sci: 'Tippe auf eine Base' },
    start: {
      kid: 'Tippe auf einen Buchstaben, um deine DNA zu beginnen. Jeder bringt seinen Partner mit: A hält immer T, und G hält immer C.',
      sci: 'Tippe auf eine Base, um ein Nukleotid (Base, Desoxyribose, Phosphat) an das 3′-Ende des Strangs zu hängen. Die komplementäre Base paart sich über Wasserstoffbrücken mit ihr.',
    },
    pair: {
      kid: ({ b, p }) => (kindOf(b) === 'AT' ? `${b} und ${p} rasten mit zwei Wasserstoffbrücken ein.` : `${b} und ${p} halten sich mit drei Wasserstoffbrücken fest: das stärkere Paar!`),
      sci: ({ b, p }) => `${b}·${p}: ${PAIR_SCI[kindOf(b)].de}`,
    },
    undo: { kid: 'Ein Paar abgenommen.', sci: 'Das letzte Nukleotidpaar am 3′-Ende entfernt.' },
    cleared: { kid: 'Alles weg. Tippe auf einen Buchstaben, um neu anzufangen.', sci: 'Geleert. Tippe auf eine Base für einen neuen Strang.' },
    full: {
      kid: 'Dieser Tisch fasst 24 Paare. Ein Satz deiner Chromosomen hat etwa 3,1 Milliarden!',
      sci: 'Grenze des Tischs: 24 bp. Ein Satz menschlicher Chromosomen: etwa 3,1 Milliarden bp (3,1 × 10⁹), etwa 1 m DNA.',
    },
    needMore: { kid: 'Füge erst mindestens drei Buchstaben hinzu, dann kopiere.', sci: 'Baue vor dem Replizieren mindestens 3 bp.' },
    copying: {
      kid: 'Reißverschluss auf! Die zwei Hälften gehen auseinander, und jede bekommt neue Partner.',
      sci: 'Replikation: Die Stränge trennen sich an der Gabel (in der Zelle entwindet sie eine Helikase), und jeder Strang dient als Vorlage; neue Nukleotide paaren sich nach der Basenpaarungsregel.',
    },
    copied: {
      kid: 'Zwei Kopien, genau gleich! Jede hat eine alte und eine neue Hälfte.',
      sci: 'Zwei identische Doppelhelices, jede mit einem Elternstrang und einem neuen Strang: semikonservativ, wie Meselson und Stahl 1958 zeigten.',
    },
    joined: { kid: 'Wieder eine Helix. Bau weiter!', sci: 'Wieder ein Duplex (die andere Kopie ginge in die zweite Zelle).' },
    help: {
      kid: 'Tippe auf einen Buchstaben, um ihn anzuhängen · tippe auf die Helix, um sie zu kopieren · ziehe, um dich umzusehen',
      sci: 'Tippe auf eine Base für ein Nukleotid · tippe auf die Helix, um sie zu replizieren · ziehe, um die Ansicht zu drehen',
    },
    status: {
      kid: ({ n, hb }) => `${n} ${n === 1 ? 'Paar' : 'Paare'} · ${hb} ${hb === 1 ? 'Wasserstoffbrücke' : 'Wasserstoffbrücken'}`,
      sci: ({ n, nm, turns, gc }) => `${n} bp · ${nm} nm · ${turns} Windungen · G+C ${gc}%`,
    },
    undoBtn: 'Zurück',
    clearBtn: 'Leeren',
    copyBtn: { kid: 'Kopieren', sci: 'Replizieren' },
    keepBtn: 'Eine behalten',
    twist: { kid: 'Drehung', sci: 'Drehung pro Paar' },
    ladder: 'Leiter',
    helix: 'Helix',
    finds: 'Entdeckungen',
    about: { kid: 'Wusstest du?', sci: 'Die Zahlen' },
    find: {
      at: { title: 'Ein A-T-Paar', kid: 'Dein erstes A-T-Paar: zwei Wasserstoffbrücken halten es.', sci: 'A·T: zwei Wasserstoffbrücken; in menschlicher DNA sind etwa 59% der Paare A·T.' },
      gc: { title: 'Ein G-C-Paar', kid: 'Dein erstes G-C-Paar: drei Wasserstoffbrücken, der festeste Griff.', sci: 'G·C: drei Wasserstoffbrücken; G·C-reiche DNA hält bis zu höheren Temperaturen zusammen (etwa 41% der menschlichen DNA).' },
      atg: { title: 'Das Startsignal', kid: 'Du hast ATG geschrieben! In einem echten Gen heißen diese drei Buchstaben „fang hier an“.', sci: 'ATG, das Startcodon: in der Boten-RNA als AUG gelesen, codiert es Methionin und beginnt fast jedes Protein.' },
      turn: { title: 'Eine ganze Windung', kid: 'Eine ganze Windung! Zehneinhalb Paare drehen die Leiter einmal ganz herum.', sci: 'Eine ganze Windung der B-DNA: 10,5 bp, etwa 3,5 nm entlang der Achse (34,3° und 0,34 nm pro Paar).' },
      copy: { title: 'Eine Kopie', kid: 'Zwei Kopien, genau gleich! Jede hat eine alte und eine neue Hälfte.', sci: 'Semikonservative Replikation: Jede Tochterhelix behält einen Elternstrang (Meselson und Stahl, 1958).' },
    },
    facts: {
      kid: [
        'DNA ist ein Rezeptbuch. Ihre vier Buchstaben sagen deinem Körper in der richtigen Reihenfolge, wie er dich baut.',
        'Würde man die DNA aus nur einer deiner Zellen ausziehen, wäre sie etwa 2 Meter lang.',
        'Bevor sich eine Zelle teilt, kopiert sie ihre ganze DNA, damit jede neue Zelle einen vollständigen Satz bekommt.',
        'Etwa 99,9% deiner DNA-Buchstaben sind dieselben wie bei jedem anderen Menschen auf der Erde.',
        'Gegenüber von A steht immer T, gegenüber von G immer C. Kennst du einen Strang, kennst du also auch den anderen!',
        'Rosalind Franklin machte ein berühmtes Röntgenfoto, „Foto 51“, das zeigte, dass DNA eine Helix ist.',
        'Die Hälfte deiner DNA hast du von deiner Mutter, die andere Hälfte von deinem Vater.',
      ],
      sci: [
        'B-DNA: rechtsgängig, 10,5 bp pro Windung, 0,34 nm Anstieg, 34,3° Verdrehung, 2 nm Durchmesser (die Form in Zellen).',
        'Die Stränge sind antiparallel: einer läuft von 5′ nach 3′, der andere von 3′ nach 5′. Polymerasen hängen nur an ein 3′-Ende an.',
        'Chargaff-Regel (1950): In doppelsträngiger DNA gilt A = T und G = C.',
        'Ein Satz menschlicher Chromosomen: etwa 3,1 Milliarden bp (die vollständige Sequenz, T2T, 2022: 3,055 Milliarden).',
        'Watson und Crick schlugen 1953 die Doppelhelix vor, gestützt auf die Röntgenbilder von Franklin und Wilkins.',
        'Die Furchen: die große etwa 2,2 nm breit, die kleine etwa 1,2 nm. Proteine lesen die Buchstaben über die große Furche.',
        'Das Kopieren ist genau: Mit Korrekturlesen und Reparatur passiert etwa ein Fehler auf eine Milliarde Buchstaben.',
      ],
    },
    numbers: [['Helix', 'rechtsgängig'], ['Paare pro Windung', '10,5'], ['Anstieg pro Paar', '0,34 nm'], ['Drehung pro Paar', '34,3°'], ['Durchmesser', '2 nm'], ['Große / kleine Furche', '2,2 / 1,2 nm'], ['Menschliches Genom (ein Satz)', '3,1 × 10⁹ bp']],
  },
}

const depth = level => (level === 'scientist' ? 'sci' : 'kid')

/** A text of the bench: the language's (else English), at the level's depth when it has two, filled with
 *  `vars` when it is written as a function. */
export function say(key, lang, level, vars = {}) {
  const w = (WORDS[lang] ?? WORDS.en)[key] ?? WORDS.en[key]
  const pickDepth = x => (x && typeof x === 'object' && !Array.isArray(x) && ('kid' in x || 'sci' in x) ? x[depth(level)] ?? x.kid : x)
  const t = pickDepth(w)
  return typeof t === 'function' ? t(vars) : t
}

/** A find's title and its words at the level's depth. */
export function findText(id, lang, level) {
  const f = (WORDS[lang] ?? WORDS.en).find[id] ?? WORDS.en.find[id]
  return { title: f.title, text: f[depth(level)] }
}

/** A number in the language's way (a decimal comma but in English). */
export const num = (x, lang, digits = 1) => new Intl.NumberFormat(tagOf(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(x)
