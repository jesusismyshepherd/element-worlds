// The atrium's stations for any element: what the data says, in every language and at both depths,
// plus the element's own words where they exist (content/<Symbol>.js). Each station:
// { id, title, teaser: [short lines for the wall], panel(): { title, kicker, color, blocks } }.
import { discoverersOf, discoveryPlaceOf } from '../data/discovery.js'
import { tagOf } from '../i18n/langs.js'
import { ELEMENTS, FAMILY, nameOf } from '../data/elements.js'
import { nucleus, valenceElectrons, hands, bondCount } from '../chem/atom.js'
import { temperature, density, num, config } from '../ui/format.js'
import { contentCached } from './index.js'

/** The element's own words, once loaded (content/index.js loadContent; the atrium waits for it). */
export const contentOf = el => contentCached(el.symbol)

/** A text at the right depth: the scientist's where there is one, else the explorer's. */
export function pick(entry, lang, level) {
  if (!entry) return null
  const l = entry[lang] ?? entry.en
  return (level === 'scientist' ? l.sci : null) ?? l.kid ?? l.sci
}

const FEMININE = new Set(['Ag', 'Pt']) // a prata, a platina
const art = el => (FEMININE.has(el.symbol) ? 'a' : 'o')
const SHELL = 'KLMNOPQ'

// Polish: a noun after a number takes one of three forms (1 proton, 2 protony, 5 protonów; 12 to 14
// are "many", 22 to 24 "few"); a fraction takes a fourth (1,5 roku), the "few" one unless given.
const PL_PLURAL = new Intl.PluralRules('pl')
const plN = (n, one, few, many, other = few) => ({ one, few, many })[PL_PLURAL.select(n)] ?? other
// Polish possessive by the name's gender: siarka, cyna, platyna, miedź, rtęć are feminine (jej)
const PL_FEMININE = new Set(['S', 'Sn', 'Pt', 'Cu', 'Hg'])
const plHis = el => (PL_FEMININE.has(el.symbol) ? 'jej' : 'jego')
// German: one / other; der Wasserstoff, Kohlenstoff, Stickstoff, Sauerstoff, Phosphor, Schwefel (er),
// every other element is neuter (es)
const deN = (n, one, other) => (n === 1 ? one : other)
const DE_MASCULINE = new Set(['H', 'C', 'N', 'O', 'P', 'S'])
const deEr = el => (el && DE_MASCULINE.has(el.symbol) ? 'er' : 'es')

const HALF_LIFE = {
  en: { ysec: 'ys', zsec: 'zs', asec: 'as', fsec: 'fs', psec: 'ps', nsec: 'ns', usec: 'µs', msec: 'ms', sec: 's', minute: 'minutes', hour: 'hours', day: 'days', year: 'years', kyear: 'thousand years', Myear: 'million years', Gyear: 'billion years', Tyear: 'trillion years', Pyear: 'quadrillion years', Eyear: 'quintillion years', Zyear: 'sextillion years', Yyear: 'septillion years' },
  'pt-pt': { ysec: 'ys', zsec: 'zs', asec: 'as', fsec: 'fs', psec: 'ps', nsec: 'ns', usec: 'µs', msec: 'ms', sec: 's', minute: 'minutos', hour: 'horas', day: 'dias', year: 'anos', kyear: 'mil anos', Myear: 'milhões de anos', Gyear: 'mil milhões de anos', Tyear: 'biliões de anos', Pyear: 'mil biliões de anos', Eyear: 'triliões de anos', Zyear: 'mil triliões de anos', Yyear: 'quatriliões de anos' },
  // Polish and German words change with the number (functions of it)
  pl: {
    ysec: 'ys', zsec: 'zs', asec: 'as', fsec: 'fs', psec: 'ps', nsec: 'ns', usec: 'µs', msec: 'ms', sec: 's',
    minute: v => plN(v, 'minuta', 'minuty', 'minut', 'minuty'),
    hour: v => plN(v, 'godzina', 'godziny', 'godzin', 'godziny'),
    day: v => plN(v, 'dzień', 'dni', 'dni', 'dnia'),
    year: v => plN(v, 'rok', 'lata', 'lat', 'roku'),
    kyear: v => plN(v, 'tysiąc lat', 'tysiące lat', 'tysięcy lat', 'tysiąca lat'),
    Myear: v => plN(v, 'milion lat', 'miliony lat', 'milionów lat', 'miliona lat'),
    Gyear: v => plN(v, 'miliard lat', 'miliardy lat', 'miliardów lat', 'miliarda lat'),
    Tyear: v => plN(v, 'bilion lat', 'biliony lat', 'bilionów lat', 'biliona lat'),
    Pyear: v => plN(v, 'biliard lat', 'biliardy lat', 'biliardów lat', 'biliarda lat'),
    Eyear: v => plN(v, 'trylion lat', 'tryliony lat', 'trylionów lat', 'tryliona lat'),
    Zyear: v => plN(v, 'tryliard lat', 'tryliardy lat', 'tryliardów lat', 'tryliarda lat'),
    Yyear: v => plN(v, 'kwadrylion lat', 'kwadryliony lat', 'kwadrylionów lat', 'kwadryliona lat'),
  },
  de: {
    ysec: 'ys', zsec: 'zs', asec: 'as', fsec: 'fs', psec: 'ps', nsec: 'ns', usec: 'µs', msec: 'ms', sec: 's',
    minute: v => deN(v, 'Minute', 'Minuten'),
    hour: v => deN(v, 'Stunde', 'Stunden'),
    day: v => deN(v, 'Tag', 'Tage'),
    year: v => deN(v, 'Jahr', 'Jahre'),
    kyear: () => 'Tausend Jahre',
    Myear: v => deN(v, 'Million Jahre', 'Millionen Jahre'),
    Gyear: v => deN(v, 'Milliarde Jahre', 'Milliarden Jahre'),
    Tyear: v => deN(v, 'Billion Jahre', 'Billionen Jahre'),
    Pyear: v => deN(v, 'Billiarde Jahre', 'Billiarden Jahre'),
    Eyear: v => deN(v, 'Trillion Jahre', 'Trillionen Jahre'),
    Zyear: v => deN(v, 'Trilliarde Jahre', 'Trilliarden Jahre'),
    Yyear: v => deN(v, 'Quadrillion Jahre', 'Quadrillionen Jahre'),
  },
}

const crustRank = (() => {
  const sorted = ELEMENTS.filter(e => e.abundance.crust != null).sort((a, b) => b.abundance.crust - a.abundance.crust)
  return new Map(sorted.map((e, i) => [e.z, i + 1]))
})()

const T = {
  en: {
    titles: {
      identity: 'Identity card', atom: 'Inside the atom', state: 'At room temperature', discovery: 'Discovery',
      found: 'Where it is found', uses: 'What it is for', family: 'Its family', isotopes: 'Isotopes',
    },
    number: (el, n) => `Its number is ${el.z}: every atom of ${n} has exactly ${el.z} protons, and that is what makes it ${n}. Change the number of protons and you get another element.`,
    atom: (el, n, p, ne, shells, v, h) => {
      const bonds = bondCount(el)
      const list = shells.map((c, i) => `${c} in shell ${SHELL[i]}`).join(', ')
      const end = el.family === 'noble-gas'
        ? 'Its outer shell is full, so it hardly ever holds hands with anyone: that is why noble gases have no hands.'
        : h.giving
          ? `${cap(n)} usually gives away ${bonds} electron${bonds > 1 ? 's' : ''}: its Atomling holds ${bonds > 1 ? 'them' : 'it'} out in its hands${bonds > 4 ? ' (it has room for only four)' : ''}.`
          : `The ${v} on the outside are the ones that hold hands with other atoms: that is why ${n} has ${h.count} hand${h.count > 1 ? 's' : ''}.`
      return `In the middle is the nucleus, with ${p} protons (red) and ${ne} neutrons (grey). Around it, ${el.z} electrons whizz in ${shells.length} shell${shells.length > 1 ? 's' : ''}: ${list}. ${end}`
    },
    stateIs: (el, n, s) => `At 20 °C ${n} is a ${s}.`,
    stateWould: (el, n, s) => `At 20 °C ${n} would be a ${s}: a prediction, because nobody has ever had enough of it in one place to look.`,
    meltsAbout: m => `It is expected to melt at about ${m}.`,
    predicted: 'predicted',
    melts: (m, b) => `It melts at ${m} and boils at ${b}.`,
    boils: b => `It boils at ${b}.`,
    sublimes: b => `At normal pressure it does not melt: it turns straight into a gas at ${b}.`,
    unknownState: 'Nobody has measured it: only a few atoms of it have ever been made.',
    litre: (kg, heavier) => `A litre of it would weigh ${kg} kg, ${heavier ? 'more' : 'less'} than a litre of water (1 kg): it would ${heavier ? 'sink' : 'float'} in water.`,
    litreGas: g => `A litre of it weighs ${g} g (a litre of air: about 1.2 g).`,
    states: { solid: 'solid', liquid: 'liquid', gas: 'gas' },
    year: 'Year', who: 'By', where: 'Where', ancient: 'Ancient times', ancientText: 'Known since ancient times: nobody knows who first found it.',
    crust: (n, mg, rank) => `In every kilogram of the Earth's crust there are about ${mg} milligrams of ${n}: number ${rank} among the most common elements in the crust.`,
    synthetic: 'Made only in laboratories, a few atoms at a time.',
    reactor: 'Not found in nature: it is made in nuclear reactors, in small amounts.',
    trace: 'Almost none in nature: it is radioactive and slowly breaks apart.',
    crustTiny: n => `There is so little ${n} in the Earth's crust that you could never see it: far less than a thousandth of a milligram in every kilogram of rock.`,
    crustLabel: 'In the crust', seaLabel: 'In seawater', rankLabel: 'Rank in the crust', traces: 'Only traces',
    usesSoon: 'The story of what it is used for is still being written.',
    family: (n, f, g, list) => `${cap(n)} is one of the ${f}. Elements in the same column have the same number of outer electrons, so they behave alike. Its column (group ${g}): ${list}.`,
    fBlock: (n, f, list, actinide) => `${cap(n)} is one of the ${f}: ${list}. ${actinide ? 'They fill the 5f shell. Only the first ones (actinium to uranium, with traces of neptunium and plutonium) are found in nature; the rest were first made in laboratories, between 1940 and 1961.' : 'They are so alike that chemists took about a century to separate them all.'}`,
    isotopes: (n, A, ab) => `Atoms of ${n} can have different numbers of neutrons: these are its isotopes. The commonest is ${n}-${A} (${ab}% of all its atoms).`,
    unstable: (n, A, hl) => `It has no stable isotope: every atom of it breaks apart in the end (it is radioactive). Its longest-lived isotope, ${n}-${A}, lasts a half-life of ${hl}.`,
    naturalCount: c => `${c} natural isotope${c > 1 ? 's' : ''}`,
    radioactive: 'Radioactive',
    rows: {
      family: 'Family', group: 'Group', period: 'Period', block: 'Block', mass: 'Atomic mass', config: 'Configuration',
      protons: 'Protons', neutrons: 'Neutrons', electrons: 'Electrons', shells: 'Shells', valence: 'Outer electrons',
      en: 'Electronegativity', ie: 'First ionisation energy', ea: 'Electron affinity', radius: 'Covalent radius',
      melt: 'Melting point', boil: 'Boiling point', density: 'Density', heat: 'Specific heat', isotope: 'Isotope',
      abundance: 'Abundance', halfLife: 'Half-life', stable: 'stable', origin: 'Name',
    },
    teaser: { protons: p => `${p} protons`, discovered: y => `in ${y}` },
    forge: 'Build this atom in the Atom Forge',
    ordinal: r => String(r),
  },
  'pt-pt': {
    titles: {
      identity: 'Bilhete de identidade', atom: 'Dentro do átomo', state: 'À temperatura ambiente', discovery: 'Descoberta',
      found: 'Onde se encontra', uses: 'Para que serve', family: 'A sua família', isotopes: 'Isótopos',
    },
    number: (el, n) => `O seu número é ${el.z}: todos os átomos de ${n} têm exatamente ${el.z} protões, e é isso que os torna ${n}. Muda o número de protões e tens outro elemento.`,
    atom: (el, n, p, ne, shells, v, h) => {
      const bonds = bondCount(el)
      const list = shells.map((c, i) => `${c} na camada ${SHELL[i]}`).join(', ')
      const end = el.family === 'noble-gas'
        ? 'A camada de fora está cheia, por isso quase nunca dá a mão a ninguém: é por isso que os gases nobres não têm mãos.'
        : h.giving
          ? `${cap(art(el))} ${n} costuma dar ${bonds} ${bonds > 1 ? 'eletrões' : 'eletrão'}: o seu Atomito estende-${bonds > 1 ? 'os' : 'o'} nas mãos${bonds > 4 ? ' (só tem lugar para quatro)' : ''}.`
          : `Os ${v} de fora são os que dão a mão a outros átomos: é por isso que ${art(el)} ${n} tem ${h.count} ${h.count > 1 ? 'mãos' : 'mão'}.`
      return `No meio está o núcleo, com ${p} protões (vermelhos) e ${ne} neutrões (cinzentos). À volta giram ${el.z} eletrões em ${shells.length} ${shells.length > 1 ? 'camadas' : 'camada'}: ${list}. ${end}`
    },
    stateIs: (el, n, s) => `A 20 °C, ${art(el)} ${n} é ${art(el) === 'a' ? s.replace(/o$/, 'a') : s}.`,
    stateWould: (el, n, s) => `A 20 °C, ${art(el)} ${n} seria ${art(el) === 'a' ? s.replace(/o$/, 'a') : s}: é uma previsão, porque nunca ninguém teve o suficiente num só sítio para ver.`,
    meltsAbout: m => `Deve fundir a cerca de ${m}.`,
    predicted: 'previsto',
    melts: (m, b) => `Funde a ${m} e ferve a ${b}.`,
    boils: b => `Ferve a ${b}.`,
    sublimes: b => `À pressão normal não funde: passa diretamente a gás a ${b}.`,
    unknownState: 'Ninguém o mediu: só se fizeram uns poucos átomos.',
    litre: (kg, heavier) => `Um litro pesaria ${kg} kg, ${heavier ? 'mais' : 'menos'} do que um litro de água (1 kg): ${heavier ? 'iria ao fundo' : 'flutuaria'} na água.`,
    litreGas: g => `Um litro pesa ${g} g (um litro de ar: cerca de 1,2 g).`,
    states: { solid: 'sólido', liquid: 'líquido', gas: 'um gás' },
    year: 'Ano', who: 'Por', where: 'Onde', ancient: 'Antiguidade', ancientText: 'Conhecido desde a Antiguidade: ninguém sabe quem o encontrou primeiro.',
    crust: (n, mg, rank) => `Em cada quilograma da crosta terrestre há cerca de ${mg} miligramas de ${n}: é o ${rank}.º elemento mais comum na crosta.`,
    synthetic: 'Só se faz em laboratório, poucos átomos de cada vez.',
    reactor: 'Não existe na natureza: faz-se em reatores nucleares, em pequenas quantidades.',
    trace: 'Quase não existe na natureza: é radioativo e vai-se desfazendo.',
    crustTiny: n => `Há tão pouco ${n} na crosta terrestre que nunca o conseguirias ver: muito menos do que uma milésima de miligrama em cada quilograma de rocha.`,
    crustLabel: 'Na crosta', seaLabel: 'Na água do mar', rankLabel: 'Posição na crosta', traces: 'Só vestígios',
    usesSoon: 'A história dos seus usos ainda está a ser escrita.',
    family: (n, f, g, list) => `${cap(n)} pertence aos ${f}. Os elementos da mesma coluna têm o mesmo número de eletrões de fora, por isso comportam-se de maneira parecida. A sua coluna (grupo ${g}): ${list}.`,
    fBlock: (n, f, list, actinide) => `${cap(n)} é um dos ${f}: ${list}. ${actinide ? 'Enchem a camada 5f. Só os primeiros (do actínio ao urânio, com vestígios de neptúnio e plutónio) existem na natureza; os outros foram feitos pela primeira vez em laboratório, entre 1940 e 1961.' : 'São tão parecidos que os químicos levaram cerca de um século a separá-los todos.'}`,
    isotopes: (n, A, ab) => `Os átomos de ${n} podem ter números diferentes de neutrões: são os seus isótopos. O mais comum é o ${n}-${A} (${ab}% de todos os seus átomos).`,
    unstable: (n, A, hl) => `Não tem nenhum isótopo estável: todos os seus átomos acabam por se desfazer (é radioativo). O isótopo que dura mais, ${n}-${A}, tem meia-vida de ${hl}.`,
    naturalCount: c => `${c} ${c > 1 ? 'isótopos naturais' : 'isótopo natural'}`,
    radioactive: 'Radioativo',
    rows: {
      family: 'Família', group: 'Grupo', period: 'Período', block: 'Bloco', mass: 'Massa atómica', config: 'Configuração',
      protons: 'Protões', neutrons: 'Neutrões', electrons: 'Eletrões', shells: 'Camadas', valence: 'Eletrões de fora',
      en: 'Eletronegatividade', ie: '1.ª energia de ionização', ea: 'Afinidade eletrónica', radius: 'Raio covalente',
      melt: 'Ponto de fusão', boil: 'Ponto de ebulição', density: 'Densidade', heat: 'Calor específico', isotope: 'Isótopo',
      abundance: 'Abundância', halfLife: 'Meia-vida', stable: 'estável', origin: 'Nome',
    },
    teaser: { protons: p => `${p} protões`, discovered: y => `em ${y}` },
    forge: 'Constrói este átomo na Forja de Átomos',
    ordinal: r => `${r}.º`,
  },
  // Polish: the element's name stays in the nominative (węgiel); where a case would be needed the
  // sentence says "tego pierwiastka" (of this element) instead, so no declension table is needed
  pl: {
    titles: {
      identity: 'Dowód osobisty', atom: 'Wnętrze atomu', state: 'W temperaturze pokojowej', discovery: 'Odkrycie',
      found: 'Gdzie występuje', uses: 'Do czego służy', family: 'Rodzina', isotopes: 'Izotopy',
    },
    number: (el, n) => `${cap(n)} ma liczbę atomową ${el.z}: każdy atom tego pierwiastka ma dokładnie ${el.z} ${plN(el.z, 'proton', 'protony', 'protonów')} i właśnie dlatego jest to ${n}. Zmień liczbę protonów, a dostaniesz inny pierwiastek.`,
    atom: (el, n, p, ne, shells, v, h) => {
      const bonds = bondCount(el)
      const list = shells.map((c, i) => `${c} na powłoce ${SHELL[i]}`).join(', ')
      const end = el.family === 'noble-gas'
        ? 'Zewnętrzna powłoka jest pełna, więc prawie nigdy nie podaje nikomu ręki: dlatego gazy szlachetne nie mają rąk.'
        : h.giving
          ? `${cap(n)} zwykle oddaje ${bonds} ${plN(bonds, 'elektron', 'elektrony', 'elektronów')}: ${plHis(el)} Atomek trzyma ${bonds > 1 ? 'je' : 'go'} w wyciągniętych rękach${bonds > 4 ? ' (ma miejsce tylko na cztery)' : ''}.`
          : `To elektrony z zewnątrz (tutaj ${v}) podają ręce innym atomom: dlatego ${n} ma ${h.count} ${plN(h.count, 'rękę', 'ręce', 'rąk')}.`
      return `W środku jest jądro: ${p} ${plN(p, 'proton', 'protony', 'protonów')} (na czerwono) i ${ne} ${plN(ne, 'neutron', 'neutrony', 'neutronów')} (na szaro). Wokół niego ${plN(el.z, 'krąży', 'krążą', 'krąży')} ${el.z} ${plN(el.z, 'elektron', 'elektrony', 'elektronów')} na ${shells.length} ${shells.length > 1 ? 'powłokach' : 'powłoce'}: ${list}. ${end}`
    },
    stateIs: (el, n, s) => `W temperaturze 20 °C ${n} jest ${s}.`,
    stateWould: (el, n, s) => `Przewiduje się, że w temperaturze 20 °C ${n} jest ${s}: nikt nigdy nie miał tyle tego pierwiastka w jednym miejscu, żeby to sprawdzić.`,
    meltsAbout: m => `Prawdopodobnie topi się w temperaturze około ${m}.`,
    predicted: 'prognoza',
    melts: (m, b) => `Topi się w temperaturze ${m}, a wrze w temperaturze ${b}.`,
    boils: b => `Wrze w temperaturze ${b}.`,
    sublimes: b => `Pod zwykłym ciśnieniem nie topi się: w temperaturze ${b} od razu zamienia się w gaz.`,
    unknownState: 'Nikt tego nie zmierzył: wytworzono dotąd tylko kilka atomów.',
    litre: (kg, heavier) => `Litr tego pierwiastka ważyłby ${kg} kg, ${heavier ? 'więcej' : 'mniej'} niż litr wody (1 kg): w wodzie ${heavier ? 'poszedłby na dno' : 'unosiłby się na powierzchni'}.`,
    litreGas: g => `Litr tego gazu waży ${g} g (litr powietrza: około 1,2 g).`,
    // in a sentence (jest ciałem stałym) and as a label
    states: { solid: 'ciałem stałym', liquid: 'cieczą', gas: 'gazem' },
    stateLabels: { solid: 'Ciało stałe', liquid: 'Ciecz', gas: 'Gaz' },
    year: 'Rok', who: 'Kto odkrył', where: 'Gdzie', ancient: 'Starożytność', ancientText: 'Ten pierwiastek znano już w starożytności: nikt nie wie, kto odkrył go pierwszy.',
    crust: (n, mg, rank) => `W każdym kilogramie skorupy ziemskiej jest około ${mg} mg tego pierwiastka: ${n} zajmuje ${rank}. miejsce wśród najczęstszych pierwiastków skorupy ziemskiej.`,
    synthetic: 'Powstaje tylko w laboratoriach, po kilka atomów naraz.',
    reactor: 'Nie występuje w przyrodzie: powstaje w reaktorach jądrowych, w małych ilościach.',
    trace: 'W przyrodzie prawie nie występuje: to pierwiastek promieniotwórczy, który powoli się rozpada.',
    crustTiny: () => 'W skorupie ziemskiej jest tak mało tego pierwiastka, że nigdy nie dałoby się go zobaczyć: dużo mniej niż tysięczna część miligrama w każdym kilogramie skały.',
    crustLabel: 'W skorupie ziemskiej', seaLabel: 'W wodzie morskiej', rankLabel: 'Miejsce w skorupie', traces: 'Tylko ślady',
    usesSoon: 'Historia zastosowań tego pierwiastka wciąż jest pisana.',
    family: (n, f, g, list) => `${cap(n)} należy do rodziny, którą tworzą ${f}. Pierwiastki z tej samej kolumny mają tyle samo elektronów na zewnątrz, więc zachowują się podobnie. Kolumna tego pierwiastka (grupa ${g}): ${list}.`,
    fBlock: (n, f, list, actinide) => `${cap(n)} należy do rodziny, którą tworzą ${f}: ${list}. ${actinide ? 'Wypełniają powłokę 5f. W przyrodzie występują tylko pierwsze z nich (od aktynu do uranu, ze śladami neptunu i plutonu); pozostałe po raz pierwszy wytworzono w laboratoriach, między 1940 a 1961 rokiem.' : 'Są tak do siebie podobne, że chemicy potrzebowali około stu lat, żeby je wszystkie rozdzielić.'}`,
    isotopes: (n, A, ab) => `Atomy tego pierwiastka mogą mieć różną liczbę neutronów: to właśnie izotopy. Najczęstszy izotop to ${n}-${A} (${ab}% wszystkich atomów).`,
    unstable: (n, A, hl) => `Nie ma żadnego trwałego izotopu: każdy atom tego pierwiastka w końcu się rozpada (to pierwiastek promieniotwórczy). Najdłużej żyje izotop ${n}-${A}: jego okres półtrwania to ${hl}.`,
    naturalCount: c => `${c} ${plN(c, 'naturalny izotop', 'naturalne izotopy', 'naturalnych izotopów')}`,
    radioactive: 'Promieniotwórczy',
    rows: {
      family: 'Rodzina', group: 'Grupa', period: 'Okres', block: 'Blok', mass: 'Masa atomowa', config: 'Konfiguracja',
      protons: 'Protony', neutrons: 'Neutrony', electrons: 'Elektrony', shells: 'Powłoki', valence: 'Elektrony zewnętrzne',
      en: 'Elektroujemność', ie: 'Pierwsza energia jonizacji', ea: 'Powinowactwo elektronowe', radius: 'Promień kowalencyjny',
      melt: 'Temperatura topnienia', boil: 'Temperatura wrzenia', density: 'Gęstość', heat: 'Ciepło właściwe', isotope: 'Izotop',
      abundance: 'Udział', halfLife: 'Okres półtrwania', stable: 'trwały', origin: 'Nazwa',
    },
    teaser: { protons: p => `${p} ${plN(p, 'proton', 'protony', 'protonów')}`, discovered: y => `w ${y} roku` },
    // element names in running text are lower case in Polish, in a list too (węgiel, krzem, german)
    inList: s => s.toLowerCase(),
    forge: 'Zbuduj ten atom w Kuźni Atomów',
    ordinal: r => `${r}.`,
  },
  // German: element names are nouns and keep their capital; most are neuter (es), six masculine (er)
  de: {
    nounCase: s => s,
    titles: {
      identity: 'Steckbrief', atom: 'Im Inneren des Atoms', state: 'Bei Raumtemperatur', discovery: 'Entdeckung',
      found: 'Vorkommen', uses: 'Verwendung', family: 'Familie', isotopes: 'Isotope',
    },
    number: (el, n) => `Seine Ordnungszahl ist ${el.z}: Jedes ${n}atom hat genau ${el.z} ${deN(el.z, 'Proton', 'Protonen')}, und genau das macht es zu ${n}. Ändere die Zahl der Protonen, und du bekommst ein anderes Element.`,
    atom: (el, n, p, ne, shells, v, h) => {
      const bonds = bondCount(el)
      const list = shells.map((c, i) => `${c} auf Schale ${SHELL[i]}`).join(', ')
      const end = el.family === 'noble-gas'
        ? `Seine äußere Schale ist voll, deshalb gibt ${deEr(el)} fast nie jemandem die Hand: Darum haben Edelgase keine Hände.`
        : h.giving
          ? `${n} gibt meist ${bonds} ${deN(bonds, 'Elektron', 'Elektronen')} ab: Sein Atomling hält ${bonds > 1 ? 'sie' : 'es'} in den ausgestreckten Händen${bonds > 4 ? ' (er hat nur Platz für vier)' : ''}.`
          : `Die Elektronen außen (hier ${v}) geben anderen Atomen die Hand: Deshalb hat ${n} ${h.count} ${deN(h.count, 'Hand', 'Hände')}.`
      return `In der Mitte ist der Kern mit ${p} ${deN(p, 'Proton', 'Protonen')} (rot) und ${ne} ${deN(ne, 'Neutron', 'Neutronen')} (grau). Um ihn herum ${deN(el.z, 'saust', 'sausen')} ${el.z} ${deN(el.z, 'Elektron', 'Elektronen')} auf ${shells.length} ${deN(shells.length, 'Schale', 'Schalen')}: ${list}. ${end}`
    },
    stateIs: (el, n, s) => `Bei 20 °C ist ${n} ${s}.`,
    stateWould: (el, n, s) => `Bei 20 °C wäre ${n} vermutlich ${s}: Das ist eine Vorhersage, denn niemand hatte je genug davon an einem Ort, um nachzusehen.`,
    meltsAbout: (m, el) => `${cap(deEr(el))} schmilzt vermutlich bei etwa ${m}.`,
    predicted: 'vorhergesagt',
    melts: (m, b, el) => `${cap(deEr(el))} schmilzt bei ${m} und siedet bei ${b}.`,
    boils: (b, el) => `${cap(deEr(el))} siedet bei ${b}.`,
    sublimes: (b, el) => `Bei normalem Druck schmilzt ${deEr(el)} nicht: Bei ${b} wird ${deEr(el)} direkt zu Gas.`,
    unknownState: 'Niemand hat das gemessen: Es wurden immer nur ein paar Atome davon hergestellt.',
    litre: (kg, heavier) => `Ein Liter davon würde ${kg} kg wiegen, ${heavier ? 'mehr' : 'weniger'} als ein Liter Wasser (1 kg): Er würde im Wasser ${heavier ? 'untergehen' : 'schwimmen'}.`,
    litreGas: g => `Ein Liter davon wiegt ${g} g (ein Liter Luft: etwa 1,2 g).`,
    states: { solid: 'ein Feststoff', liquid: 'eine Flüssigkeit', gas: 'ein Gas' },
    stateLabels: { solid: 'Fest', liquid: 'Flüssig', gas: 'Gasförmig' },
    year: 'Jahr', who: 'Von', where: 'Wo', ancient: 'Altertum', ancientText: 'Schon im Altertum bekannt: Niemand weiß, wer dieses Element zuerst gefunden hat.',
    crust: (n, mg, rank) => `In jedem Kilogramm Erdkruste stecken etwa ${mg} Milligramm ${n}: Platz ${rank} unter den häufigsten Elementen der Erdkruste.`,
    synthetic: 'Wird nur im Labor hergestellt, ein paar Atome auf einmal.',
    reactor: 'Kommt in der Natur nicht vor: Es wird in Kernreaktoren hergestellt, in kleinen Mengen.',
    trace: 'In der Natur gibt es fast nichts davon: Es ist radioaktiv und zerfällt langsam.',
    crustTiny: n => `In der Erdkruste gibt es so wenig ${n}, dass du nie etwas davon sehen könntest: viel weniger als ein Tausendstel Milligramm in jedem Kilogramm Gestein.`,
    crustLabel: 'In der Erdkruste', seaLabel: 'Im Meerwasser', rankLabel: 'Rang in der Erdkruste', traces: 'Nur Spuren',
    usesSoon: 'Die Geschichte seiner Verwendung wird gerade noch geschrieben.',
    family: (n, f, g, list) => `${n} gehört zur Familie der ${f}. Elemente in derselben Spalte haben gleich viele Außenelektronen, deshalb verhalten sie sich ähnlich. Seine Spalte (Gruppe ${g}): ${list}.`,
    fBlock: (n, f, list, actinide) => `${n} gehört zur Familie der ${f}: ${list}. ${actinide ? 'Sie füllen die 5f-Schale. Nur die ersten (Actinium bis Uran, dazu Spuren von Neptunium und Plutonium) kommen in der Natur vor; die übrigen wurden zuerst in Laboren hergestellt, zwischen 1940 und 1961.' : 'Sie sind einander so ähnlich, dass Chemiker etwa ein Jahrhundert brauchten, um sie alle voneinander zu trennen.'}`,
    isotopes: (n, A, ab) => `${n}atome können unterschiedlich viele Neutronen haben: Das sind seine Isotope. Das häufigste ist ${n}-${A} (${ab}% aller seiner Atome).`,
    unstable: (n, A, hl) => `${n} hat kein stabiles Isotop: Jedes seiner Atome zerfällt irgendwann (das nennt man radioaktiv). Am längsten lebt ${n}-${A}: Seine Halbwertszeit beträgt ${hl}.`,
    naturalCount: c => `${c} ${deN(c, 'natürliches Isotop', 'natürliche Isotope')}`,
    radioactive: 'Radioaktiv',
    rows: {
      family: 'Familie', group: 'Gruppe', period: 'Periode', block: 'Block', mass: 'Atommasse', config: 'Konfiguration',
      protons: 'Protonen', neutrons: 'Neutronen', electrons: 'Elektronen', shells: 'Schalen', valence: 'Außenelektronen',
      en: 'Elektronegativität', ie: 'Erste Ionisierungsenergie', ea: 'Elektronenaffinität', radius: 'Kovalenzradius',
      melt: 'Schmelzpunkt', boil: 'Siedepunkt', density: 'Dichte', heat: 'Spezifische Wärmekapazität', isotope: 'Isotop',
      abundance: 'Häufigkeit', halfLife: 'Halbwertszeit', stable: 'stabil', origin: 'Name',
    },
    teaser: { protons: p => `${p} ${deN(p, 'Proton', 'Protonen')}`, discovered: y => `im Jahr ${y}` },
    forge: 'Bau dieses Atom in der Atomschmiede',
    ordinal: r => `${r}.`,
  },
}

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

export function stationsOf(el, { lang, level, familyName }) {
  const L = T[lang] ?? T.en
  const tag = tagOf(lang)
  const sci = level === 'scientist'
  // names inside a sentence: lower case, except in German, where nouns keep their capital
  const low = L.nounCase ?? (s => s.toLowerCase())
  const n = low(nameOf(el, lang))
  const content = contentOf(el)
  const text = key => pick(content?.[key], lang, level)
  const color = FAMILY[el.family].color
  const nuc = nucleus(el)
  const h = hands(el)
  const v = valenceElectrons(el)
  const fmt = (x, d = 4) => num(x, tag, d)
  const make = (id, teaser, blocks) => ({
    id,
    title: L.titles[id],
    teaser,
    panel: () => ({ title: L.titles[id], kicker: `${el.symbol} · ${nameOf(el, lang)}`, color, blocks: blocks().filter(Boolean) }),
  })

  const natural = el.isotopes.filter(i => i.abundance)
  const lasting = [...el.isotopes].filter(i => i.halfLifeSeconds).sort((a, b) => b.halfLifeSeconds - a.halfLifeSeconds)[0]
  const halfLife = i => {
    const unit = HALF_LIFE[lang]?.[i.halfLifeUnit] ?? i.halfLifeUnit
    return `${fmt(i.halfLife, 3)} ${typeof unit === 'function' ? unit(Number(i.halfLife.toPrecision(3))) : unit}`
  }
  const stateLabel = el.state ? (L.stateLabels?.[el.state] ?? cap(L.states[el.state].replace(/^um /, ''))) + (el.statePredicted ? ` (${L.predicted})` : '') : '?'

  return [
    make('identity', [`${el.symbol} · ${el.z}`, nameOf(el, lang)], () => [
      { big: el.symbol, small: `${nameOf(el, lang)} · ${el.z}` },
      { p: L.number(el, n) },
      text('nameOrigin') && { p: text('nameOrigin') },
      {
        rows: [
          [L.rows.family, familyName],
          [L.rows.group, el.group ?? '–'],
          [L.rows.period, el.period],
          [L.rows.block, el.block],
          [L.rows.mass, `${fmt(el.mass, sci ? 7 : 4)} u`],
          ...(sci ? [[L.rows.config, config(el.config)]] : []),
        ],
      },
    ]),
    make('atom', [`${nuc.protons} p · ${nuc.neutrons} n · ${el.z} e`], () => [
      { big: `${nuc.protons} p⁺ · ${nuc.neutrons} n · ${el.z} e⁻` },
      { p: L.atom(el, n, nuc.protons, nuc.neutrons, el.shells, v, h) },
      { link: { to: `/forge?z=${el.symbol}`, label: L.forge } },
      sci && {
        rows: [
          [L.rows.config, config(el.config) + (el.configPredicted ? ' *' : '')],
          [L.rows.shells, el.shells.join(' · ')],
          [L.rows.valence, v],
          [L.rows.en, el.en ?? '?'],
          [L.rows.ie, el.ie[0] != null ? `${fmt(el.ie[0])} eV` : '?'],
          [L.rows.ea, el.ea != null ? `${fmt(el.ea)} eV` : '?'],
          [L.rows.radius, el.radius.covalent != null ? `${el.radius.covalent} pm` : '?'],
        ],
      },
    ]),
    make('state', [stateLabel, el.melt != null ? `${el.statePredicted ? '~' : ''}${temperature(el.melt, 'explorer', tag)}` : ''], () => {
      const liquidOrSolid = el.state !== 'gas'
      const d = el.density
      const guess = el.statePredicted
      const said = el.state && (guess ? L.stateWould : L.stateIs)(el, n, L.states[el.state])
      // (el last: German says er or es by the name's gender)
      const temps = el.sublimes
        ? L.sublimes(temperature(el.sublimes, level, tag), el)
        : guess
          ? (el.melt != null ? L.meltsAbout(temperature(el.melt, level, tag), el) : L.unknownState)
          : el.melt != null
            ? L.melts(temperature(el.melt, level, tag), temperature(el.boil, level, tag), el)
            : el.boil != null ? L.boils(temperature(el.boil, level, tag), el) : L.unknownState
      const mark = v => (guess && v != null ? `${temperature(v, 'scientist', tag)} (${L.predicted})` : temperature(v, 'scientist', tag))
      return [
        { big: stateLabel },
        { p: said ? `${said} ${temps}` : L.unknownState },
        d != null && { p: liquidOrSolid ? L.litre(fmt(d, 3), d > 1) : L.litreGas(fmt(d * 1000 * 273.15 / 293.15, 3)) },
        text('stateNote') && { p: text('stateNote') },
        sci && {
          rows: [
            [L.rows.melt, mark(el.melt)],
            [L.rows.boil, mark(el.boil)],
            [L.rows.density, density(el, tag)],
            ...(el.specificHeat ? [[L.rows.heat, `${fmt(el.specificHeat, 3)} J/(g·K)`]] : []),
          ],
        },
      ]
    }),
    make('discovery', [el.ancient ? L.ancient : String(el.discovered ?? '?')], () => [
      { big: el.ancient ? L.ancient : String(el.discovered ?? '?') },
      text('discovery') ? { p: text('discovery') } : el.ancient ? { p: L.ancientText } : null,
      !el.ancient && {
        rows: [
          [L.year, el.discovered ?? '?'],
          ...(el.discoverers ? [[L.who, discoverersOf(el, lang)]] : []),
          ...(el.discoveryPlace ? [[L.where, discoveryPlaceOf(el, lang)]] : []),
        ],
      },
    ]),
    make('found', [el.abundance.crust == null ? '–' : el.abundance.crust < 1e-3 ? L.traces : `${fmt(el.abundance.crust, 3)} mg/kg`], () => {
      const mg = el.abundance.crust
      const rank = crustRank.get(el.z)
      const base = mg != null ? (mg < 1e-3 && !sci ? L.crustTiny(n) : L.crust(n, fmt(mg, 3), rank)) : el.z > 100 ? L.synthetic : el.z > 94 ? L.reactor : L.trace
      return [
        mg != null ? { big: `${fmt(mg, 3)} mg/kg`, small: L.crustLabel } : null,
        { p: text('found') ?? base },
        text('found') && mg != null && !sci ? { p: base } : null,
        sci && {
          rows: [
            [L.crustLabel, mg != null ? `${fmt(mg, 3)} mg/kg` : '–'],
            [L.rankLabel, rank ? L.ordinal(rank) : '–'],
            [L.seaLabel, el.abundance.sea != null ? `${fmt(el.abundance.sea, 3)} mg/L` : '–'],
          ],
        },
      ]
    }),
    make('uses', [content?.uses ? '★' : '…'], () => {
      const list = pick(content?.uses, lang, level)
      return [list ? { list } : { p: L.usesSoon }]
    }),
    make('family', [familyName], () => {
      // the lanthanides and actinides as the table draws them (lanthanum and actinium in their rows)
      const fRow = el.family === 'lanthanide' || el.family === 'actinide'
      const members = fRow
        ? ELEMENTS.filter(e => e.family === el.family)
        : ELEMENTS.filter(e => e.group === el.group && e.family !== 'lanthanide' && e.family !== 'actinide')
      const list = members.map(e => (sci ? `${e.symbol}` : (L.inList ?? String)(nameOf(e, lang)))).join(', ')
      return [
        { big: familyName },
        { p: fRow ? L.fBlock(n, low(familyName), list, el.family === 'actinide') : L.family(n, low(familyName), el.group, list) },
      ]
    }),
    make('isotopes', [natural.length ? L.naturalCount(natural.length) : L.radioactive], () => {
      const top = natural[0]
      return [
        { big: natural.length ? L.naturalCount(natural.length) : L.radioactive },
        { p: top ? L.isotopes(n, top.A, fmt(top.abundance, 4)) : lasting ? L.unstable(n, lasting.A, halfLife(lasting)) : L.unknownState },
        text('isotopes') && { p: text('isotopes') },
        sci && el.isotopes.length > 0 && {
          rows: el.isotopes.slice(0, 6).map(i => [
            `${el.symbol}-${i.A}${i.meta ? 'm' : ''}`,
            [i.abundance ? `${fmt(i.abundance, 4)}%` : null, i.halfLife ? `${L.rows.halfLife}: ${halfLife(i)}` : i.abundance ? L.rows.stable : null].filter(Boolean).join(' · '),
          ]),
        },
      ]
    }),
  ]
}

const GREETING = {
  en: n => `Hi! I'm ${n}. Explore my hall: each panel tells part of my story.`,
  'pt-pt': n => `Olá! Chamo-me ${n}. Explora o meu salão: cada painel conta uma parte da minha história.`,
  pl: n => `Cześć! Jestem ${n}. Zwiedź moją salę: każda tablica opowiada część mojej historii.`,
  de: (n, el) => `Hallo! Ich bin ${DE_MASCULINE.has(el.symbol) ? 'der' : 'das'} ${n}. Erkunde meine Halle: Jede Tafel erzählt einen Teil meiner Geschichte.`,
}

/** What the element's Atomling says when you talk to it. */
export function greetingOf(el, lang, level) {
  const own = pick(contentOf(el)?.greeting, lang, level)
  if (own) return own
  return (GREETING[lang] ?? GREETING.en)(nameOf(el, lang), el)
}
