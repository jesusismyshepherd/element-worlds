// The Atom Forge's words: the missions and what the forge says about the atom on the table, in every
// language (i18n/langs.js: pt-pt, en, pl, de; a missing one falls back to English) and at both depths
// (kid: Explorer, sci: Scientist). The HUD's button labels are in the locale files (forge.*).
// Polish words that follow a count have three forms (1 proton, 2 protony, 5 protonów) and a fourth for
// fractions (2,5 roku); German two (1 Jahr, 2 Jahre): `counted` picks one with Intl.PluralRules.
import { tagOf, decimalOf } from '../../i18n/langs.js'
import { ELEMENTS, nameOf } from '../../data/elements.js'
import { halfLifeParts, modeFamily, nuclideSymbol } from '../../chem/nucleus.js'

const el = Z => ELEMENTS[Z - 1]
// element names in running text: lowercase, except in German (nouns keep their capital: Kohlenstoff-12)
const KEEPS_CAPITALS = new Set(['de'])
const nm = (Z, lang) => (KEEPS_CAPITALS.has(lang) ? nameOf(el(Z), lang) : nameOf(el(Z), lang).toLowerCase())
const SPECIAL = {
  en: { '1-1': 'protium', '1-2': 'deuterium', '1-3': 'tritium' },
  'pt-pt': { '1-1': 'prótio', '1-2': 'deutério', '1-3': 'trítio' },
  pl: { '1-1': 'prot', '1-2': 'deuter', '1-3': 'tryt' },
  de: { '1-1': 'Protium', '1-2': 'Deuterium', '1-3': 'Tritium' },
}

const RULES = {}
/** The plural category of n in the language ('one', 'few', 'many', 'other'). */
const pluralOf = (n, lang) => (RULES[lang] ??= new Intl.PluralRules(tagOf(lang))).select(n)
/** A word for a count: a string (the same for every count) or { one, few, many, other }. */
const counted = (forms, n, lang) => (typeof forms === 'string' ? forms : forms[pluralOf(n, lang)] ?? forms.other)

// counted nouns in Polish (one, few, many, other: fractions) and German (one, other)
const PL = {
  proton: { one: 'proton', few: 'protony', many: 'protonów', other: 'protonu' },
  neutron: { one: 'neutron', few: 'neutrony', many: 'neutronów', other: 'neutronu' },
  extra: { one: 'dodatkowy elektron', few: 'dodatkowe elektrony', many: 'dodatkowych elektronów', other: 'dodatkowego elektronu' },
}
const DE = {
  proton: { one: 'Proton', other: 'Protonen' },
  neutron: { one: 'Neutron', other: 'Neutronen' },
  electron: { one: 'Elektron', other: 'Elektronen' },
}

/** "carbon-14", "hydrogen-2 (deuterium)". */
export function isotopeName(Z, N, lang) {
  const special = SPECIAL[lang]?.[`${Z}-${Z + N}`]
  return `${nm(Z, lang)}-${Z + N}${special ? ` (${special})` : ''}`
}

// a half-life's unit (yearsSci: after "× 10ⁿ", a large number); Polish and German by count. They read
// in the nominative ("Halbwertszeit 5700 Jahre", "okres półtrwania 2 lata"): sentences put them there.
const UNITS = {
  en: {
    years: 'years', billionYears: 'billion years', millionYears: 'million years', days: 'days', hours: 'hours',
    minutes: 'minutes', seconds: 'seconds', ms: 'thousandths of a second', us: 'millionths of a second',
    ns: 'billionths of a second', yearsSci: 'years',
  },
  'pt-pt': {
    years: 'anos', billionYears: 'mil milhões de anos', millionYears: 'milhões de anos', days: 'dias', hours: 'horas',
    minutes: 'minutos', seconds: 'segundos', ms: 'milésimos de segundo', us: 'milionésimos de segundo',
    ns: 'mil-milionésimos de segundo', yearsSci: 'anos',
  },
  pl: {
    years: { one: 'rok', few: 'lata', many: 'lat', other: 'roku' },
    billionYears: { one: 'miliard lat', few: 'miliardy lat', many: 'miliardów lat', other: 'miliarda lat' },
    millionYears: { one: 'milion lat', few: 'miliony lat', many: 'milionów lat', other: 'miliona lat' },
    days: { one: 'dzień', few: 'dni', many: 'dni', other: 'dnia' },
    hours: { one: 'godzina', few: 'godziny', many: 'godzin', other: 'godziny' },
    minutes: { one: 'minuta', few: 'minuty', many: 'minut', other: 'minuty' },
    seconds: { one: 'sekunda', few: 'sekundy', many: 'sekund', other: 'sekundy' },
    ms: { one: 'tysięczna sekundy', few: 'tysięczne sekundy', many: 'tysięcznych sekundy', other: 'tysięcznej sekundy' },
    us: { one: 'milionowa sekundy', few: 'milionowe sekundy', many: 'milionowych sekundy', other: 'milionowej sekundy' },
    ns: { one: 'miliardowa sekundy', few: 'miliardowe sekundy', many: 'miliardowych sekundy', other: 'miliardowej sekundy' },
    yearsSci: 'lat',
  },
  de: {
    years: { one: 'Jahr', other: 'Jahre' },
    billionYears: { one: 'Milliarde Jahre', other: 'Milliarden Jahre' },
    millionYears: { one: 'Million Jahre', other: 'Millionen Jahre' },
    days: { one: 'Tag', other: 'Tage' },
    hours: { one: 'Stunde', other: 'Stunden' },
    minutes: { one: 'Minute', other: 'Minuten' },
    seconds: { one: 'Sekunde', other: 'Sekunden' },
    ms: { one: 'Tausendstelsekunde', other: 'Tausendstelsekunden' },
    us: { one: 'Millionstelsekunde', other: 'Millionstelsekunden' },
    ns: { one: 'Milliardstelsekunde', other: 'Milliardstelsekunden' },
    yearsSci: 'Jahre',
  },
}
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const power = (v, lang) => {
  const e = Math.floor(Math.log10(v))
  const m = Number((v / 10 ** e).toPrecision(2))
  return `${String(m).replace('.', decimalOf(lang))} × 10${String(e).replace('-', '⁻').replace(/\d/g, d => SUP[d])}`
}

/** A half-life for people: "5700 years", "0.7 thousandths of a second", "6 × 10⁻²² s". */
export function halfLifeText(t, lang) {
  const p = halfLifeParts(t)
  if (!p) return ''
  const n = v => v.toLocaleString(tagOf(lang), { maximumFractionDigits: 3 })
  const U = UNITS[lang] ?? UNITS.en
  if (p.unit === 'secondsSci') return `${power(p.value, lang)} s`
  if (p.unit === 'yearsSci') return `${power(p.value, lang)} ${counted(U.yearsSci ?? UNITS.en.yearsSci, p.value, lang)}`
  return `${n(p.value)} ${counted(U[p.unit] ?? UNITS.en[p.unit], p.value, lang)}`
}

const W = {
  en: {
    empty: {
      kid: 'Build an atom! Protons make the element, neutrons glue the nucleus together, electrons whizz around it.',
      sci: 'Choose Z (protons), N (neutrons) and the electron count: the forge looks the nuclide up in the chart of nuclides (NUBASE, 3552 known).',
    },
    neutron: {
      kid: 'One neutron on its own: no protons, so no element yet. Left alone it turns into a proton and an electron in about 10 minutes: a hydrogen atom!',
      sci: 'A free neutron: mean life 878 s (half-life 609 s), n → p + e⁻ + antineutrino. Too long for the forge to wait: press decay to see it.',
    },
    neutrons: {
      kid: 'Neutrons on their own do not stick together. Add a proton!',
      sci: 'No bound state of neutrons alone exists (the dineutron is unbound); a neutron star is held by gravity, not by the nuclear force.',
    },
    element: (Z, lang) => ({
      kid: `${Z} proton${Z > 1 ? 's' : ''}: that makes it ${nm(Z, lang)}! The number of protons decides which element an atom is.`,
      sci: `Z = ${Z}: ${nm(Z, lang)}. The atomic number alone fixes the element; N and the electrons only change its isotope and its charge.`,
    }),
    isotope: (Z, N, common) => ({
      kid: N === common ? `With ${N} neutron${N === 1 ? '' : 's'} this is the commonest kind.` : `With ${N} neutron${N === 1 ? '' : 's'} (the commonest kind has ${common}) it is another isotope: the same element, a ${N > common ? 'heavier' : 'lighter'} nucleus.`,
      sci: `N = ${N}, A = ${Z + N}${N === common ? ' (the commonest isotope)' : ` (the commonest has N = ${common})`}.`,
    }),
    ion: (q, sym) => ({
      kid: q === 0 ? 'As many electrons as protons: a neutral atom.' : q > 0 ? `${q} electron${q > 1 ? 's' : ''} short: a positive ion (${sym}). Metals like to lose electrons this way.` : `${-q} extra electron${q < -1 ? 's' : ''}: a negative ion (${sym}).`,
      sci: q === 0 ? 'Neutral: Z electrons.' : `Charge ${q > 0 ? '+' : '−'}${Math.abs(q)} (${sym}).`,
    }),
    crystalOnly: {
      kid: 'More than one extra electron only stays put inside a crystal, where neighbours share the push (like the oxide ions in rust).',
      sci: 'Free atomic dianions are unbound in the gas phase (O²⁻ exists only stabilised by a lattice, the Madelung energy).',
    },
    noExtra: (Z, lang) => ({
      kid: `${cap(nm(Z, lang))} does not want an extra electron: it flies off.`,
      sci: `${cap(nm(Z, lang))} has no positive electron affinity: its anion is unbound.`,
    }),
    beyond: {
      kid: 'That would make an element beyond 118, and nobody has ever made one. Laboratories in Japan, the United States and Russia are trying to make 119 and 120: so far, nothing has stuck.',
      sci: 'No element beyond oganesson (118) has been made. The searches for 119 and 120 (RIKEN, Berkeley, Dubna) have found no event yet; their cross-sections are expected at femtobarns or less.',
    },
    tooMany: { kid: 'No room: the extra electrons push each other away.', sci: 'Beyond a charge of −3 nothing binds an atomic anion.' },
    noHold: { kid: 'With no protons, nothing holds an electron.', sci: 'No nuclear charge: an electron cannot be bound.' },
    stable: {
      kid: 'Its nucleus is stable: it can last for ever.',
      sci: 'Stable (no decay observed).',
    },
    natural: ab => ({ kid: `This is how ${ab >= 50 ? 'most' : 'some'} of it is found in nature (${ab}%).`, sci: `Natural abundance ${ab}%.` }),
    radioactive: (hl, mode) => ({
      kid: `Radioactive! Half of a pile of these breaks apart in ${hl}. It decays by ${KIDMODE.en[mode] ?? 'breaking apart'}.`,
      sci: `Radioactive: half-life ${hl}, decay mode ${SCIMODE.en[mode] ?? mode}.`,
    }),
    instant: { kid: 'Far too wobbly: it falls apart at once!', sci: 'Unbound or nearly so: it decays within about 10⁻¹² s, often by shedding a nucleon.' },
    unmeasured: { kid: 'Scientists have made this one, but nobody has timed how long it lasts.', sci: 'Observed, half-life not measured.' },
    rich: { kid: 'Too many neutrons: the nucleus cannot hold them, so they drip out.', sci: 'Beyond the known isotopes on the neutron-rich side (past the neutron drip line): neutrons are shed.' },
    poor: { kid: 'Too few neutrons: the protons push each other apart, and one flies out.', sci: 'Beyond the known isotopes on the proton-rich side (past the proton drip line): protons are shed.' },
    notMade: { kid: 'Nobody has made this one yet! Maybe one day...', sci: 'Not yet observed: no measurement exists.' },
    held: { kid: 'The force field is holding it together while you build.', sci: 'Held (auto-decay off).' },
  },
  'pt-pt': {
    empty: {
      kid: 'Constrói um átomo! Os protões fazem o elemento, os neutrões colam o núcleo, os eletrões giram à volta.',
      sci: 'Escolhe Z (protões), N (neutrões) e o número de eletrões: a forja procura o nuclídeo na carta de nuclídeos (NUBASE, 3552 conhecidos).',
    },
    neutron: {
      kid: 'Um neutrão sozinho: sem protões ainda não há elemento. Deixado sozinho, transforma-se num protão e num eletrão em cerca de 10 minutos: um átomo de hidrogénio!',
      sci: 'Um neutrão livre: vida média de 878 s (meia-vida de 609 s), n → p + e⁻ + antineutrino. Demasiado tempo para a forja esperar: carrega em decair para ver.',
    },
    neutrons: {
      kid: 'Os neutrões sozinhos não se colam uns aos outros. Junta um protão!',
      sci: 'Não existe nenhum estado ligado só de neutrões (o dineutrão não é ligado); uma estrela de neutrões segura-se pela gravidade, não pela força nuclear.',
    },
    element: (Z, lang) => ({
      kid: `${Z} ${Z > 1 ? 'protões' : 'protão'}: isto é ${nm(Z, lang)}! É o número de protões que decide de que elemento é um átomo.`,
      sci: `Z = ${Z}: ${nm(Z, lang)}. Só o número atómico fixa o elemento; N e os eletrões só mudam o isótopo e a carga.`,
    }),
    isotope: (Z, N, common) => ({
      kid: N === common ? `Com ${N} ${N === 1 ? 'neutrão' : 'neutrões'}, é a forma mais comum.` : `Com ${N} ${N === 1 ? 'neutrão' : 'neutrões'} (a forma mais comum tem ${common}), é outro isótopo: o mesmo elemento, um núcleo mais ${N > common ? 'pesado' : 'leve'}.`,
      sci: `N = ${N}, A = ${Z + N}${N === common ? ' (o isótopo mais comum)' : ` (o mais comum tem N = ${common})`}.`,
    }),
    ion: (q, sym) => ({
      kid: q === 0 ? 'Tantos eletrões como protões: um átomo neutro.' : q > 0 ? `${q === 1 ? 'Falta-lhe 1 eletrão' : `Faltam-lhe ${q} eletrões`}: um ião positivo (${sym}). Os metais gostam de perder eletrões assim.` : `${-q === 1 ? '1 eletrão a mais' : `${-q} eletrões a mais`}: um ião negativo (${sym}).`,
      sci: q === 0 ? 'Neutro: Z eletrões.' : `Carga ${q > 0 ? '+' : '−'}${Math.abs(q)} (${sym}).`,
    }),
    crystalOnly: {
      kid: 'Mais de um eletrão extra só fica no sítio dentro de um cristal, onde os vizinhos ajudam a aguentar o empurrão (como os iões óxido da ferrugem).',
      sci: 'Os dianiões atómicos livres não são ligados em fase gasosa (o O²⁻ só existe estabilizado por uma rede cristalina, a energia de Madelung).',
    },
    noExtra: (Z, lang) => ({
      kid: `${cap(art(Z))} ${nm(Z, lang)} não quer um eletrão a mais: ele foge.`,
      sci: `${cap(art(Z))} ${nm(Z, lang)} não tem afinidade eletrónica positiva: o seu anião não é ligado.`,
    }),
    beyond: {
      kid: 'Isso daria um elemento para lá do 118, e nunca ninguém fez nenhum. Laboratórios no Japão, nos Estados Unidos e na Rússia estão a tentar fazer o 119 e o 120: até agora, nada pegou.',
      sci: 'Nenhum elemento para lá do oganésson (118) foi feito. As buscas do 119 e do 120 (RIKEN, Berkeley, Dubna) ainda não encontraram nenhum evento; espera-se que as suas secções eficazes sejam de femtobarns ou menos.',
    },
    tooMany: { kid: 'Não há espaço: os eletrões a mais empurram-se uns aos outros para fora.', sci: 'Para lá da carga −3, nada liga um anião atómico.' },
    noHold: { kid: 'Sem protões, nada segura um eletrão.', sci: 'Sem carga nuclear, um eletrão não fica ligado.' },
    stable: {
      kid: 'O núcleo é estável: pode durar para sempre.',
      sci: 'Estável (nunca se observou decaimento).',
    },
    natural: ab => ({ kid: `É assim que ${ab >= 50 ? 'a maior parte dele' : 'uma parte dele'} se encontra na natureza (${String(ab).replace('.', ',')}%).`, sci: `Abundância natural: ${String(ab).replace('.', ',')}%.` }),
    radioactive: (hl, mode) => ({
      kid: `Radioativo! Metade de um monte destes desfaz-se em ${hl}. Decai por ${KIDMODE['pt-pt'][mode] ?? 'se desfazer'}.`,
      sci: `Radioativo: meia-vida de ${hl}, modo de decaimento ${SCIMODE['pt-pt'][mode] ?? mode}.`,
    }),
    instant: { kid: 'Treme demasiado: desfaz-se logo!', sci: 'Não ligado ou quase: decai em cerca de 10⁻¹² s, muitas vezes largando um nucleão.' },
    unmeasured: { kid: 'Os cientistas já fizeram este, mas ninguém mediu quanto tempo dura.', sci: 'Observado, meia-vida por medir.' },
    rich: { kid: 'Neutrões a mais: o núcleo não os consegue segurar, por isso vão pingando para fora.', sci: 'Para lá dos isótopos conhecidos, do lado rico em neutrões (além da linha de gotejamento de neutrões): largam-se neutrões.' },
    poor: { kid: 'Neutrões a menos: os protões empurram-se uns aos outros e um sai disparado.', sci: 'Para lá dos isótopos conhecidos, do lado rico em protões (além da linha de gotejamento de protões): largam-se protões.' },
    notMade: { kid: 'Ainda ninguém fez este! Talvez um dia...', sci: 'Ainda não observado: não há nenhuma medição.' },
    held: { kid: 'O campo de forças está a segurá-lo enquanto constróis.', sci: 'Seguro (decaimento automático desligado).' },
  },
  pl: {
    empty: {
      kid: 'Zbuduj atom! Protony decydują o pierwiastku, neutrony sklejają jądro, a elektrony śmigają dookoła.',
      sci: 'Wybierz Z (protony), N (neutrony) i liczbę elektronów: kuźnia odszukuje nuklid w tablicy nuklidów (NUBASE, 3552 znane).',
    },
    neutron: {
      kid: 'Jeden neutron, zupełnie sam: bez protonów nie ma jeszcze pierwiastka. Pozostawiony sam sobie po mniej więcej 10 minutach zamienia się w proton i elektron: atom wodoru!',
      sci: 'Swobodny neutron: średni czas życia 878 s (okres półtrwania 609 s), n → p + e⁻ + antyneutrino. Kuźnia nie będzie tyle czekać: naciśnij przycisk rozpadu, żeby to zobaczyć.',
    },
    neutrons: {
      kid: 'Same neutrony nie trzymają się razem. Dodaj proton!',
      sci: 'Nie istnieje stan związany samych neutronów (dineutron jest niezwiązany); gwiazdę neutronową utrzymuje grawitacja, a nie siły jądrowe.',
    },
    element: (Z, lang) => ({
      kid: `${Z} ${counted(PL.proton, Z, 'pl')}: to ${nm(Z, lang)}! To liczba protonów decyduje, jakim pierwiastkiem jest atom.`,
      sci: `Z = ${Z}: ${nm(Z, lang)}. Sama liczba atomowa wyznacza pierwiastek; N i elektrony zmieniają tylko izotop i ładunek.`,
    }),
    isotope: (Z, N, common) => ({
      kid: N === common ? `${N} ${counted(PL.neutron, N, 'pl')}: to najczęstsza odmiana.` : `${N} ${counted(PL.neutron, N, 'pl')} (najczęstsza odmiana ma ${common}): to inny izotop, ten sam pierwiastek, ale ${N > common ? 'cięższe' : 'lżejsze'} jądro.`,
      sci: `N = ${N}, A = ${Z + N}${N === common ? ' (najczęstszy izotop)' : ` (najczęstszy ma N = ${common})`}.`,
    }),
    ion: (q, sym) => ({
      kid: q === 0 ? 'Tyle samo elektronów co protonów: obojętny atom.' : q > 0 ? `${q === 1 ? 'Brakuje mu 1 elektronu' : `Brakuje mu ${q} elektronów`}: to jon dodatni (${sym}). Metale chętnie oddają w ten sposób elektrony.` : `${-q} ${counted(PL.extra, -q, 'pl')}: to jon ujemny (${sym}).`,
      sci: q === 0 ? 'Obojętny: Z elektronów.' : `Ładunek ${q > 0 ? '+' : '−'}${Math.abs(q)} (${sym}).`,
    }),
    crystalOnly: {
      kid: 'Więcej niż jeden dodatkowy elektron zostaje na miejscu tylko w krysztale, gdzie sąsiedzi dzielą między siebie odpychanie (jak jony tlenkowe w rdzy).',
      sci: 'Swobodne dwuujemne aniony atomowe są niezwiązane w fazie gazowej (O²⁻ istnieje tylko stabilizowany przez sieć krystaliczną, energię Madelunga).',
    },
    noExtra: (Z, lang) => ({
      kid: `${cap(nm(Z, lang))} nie chce dodatkowego elektronu: elektron odlatuje.`,
      sci: `${cap(nm(Z, lang))} nie ma dodatniego powinowactwa elektronowego: anion jest niezwiązany.`,
    }),
    beyond: {
      kid: 'To byłby pierwiastek cięższy niż 118, a nikt jeszcze żadnego takiego nie otrzymał. Laboratoria w Japonii, Stanach Zjednoczonych i Rosji próbują otrzymać pierwiastki 119 i 120: jak dotąd nic się nie udało.',
      sci: 'Nie otrzymano żadnego pierwiastka cięższego od oganesonu (118). Poszukiwania pierwiastków 119 i 120 (RIKEN, Berkeley, Dubna) nie przyniosły jeszcze żadnego zdarzenia; oczekiwane przekroje czynne to femtobarny lub mniej.',
    },
    tooMany: { kid: 'Nie ma miejsca: dodatkowe elektrony odpychają się nawzajem.', sci: 'Żaden anion atomowy o ładunku poniżej −3 nie jest związany.' },
    noHold: { kid: 'Bez protonów nic nie utrzyma elektronu.', sci: 'Brak ładunku jądra: elektron nie może być związany.' },
    stable: {
      kid: 'Jego jądro jest stabilne: może przetrwać wiecznie.',
      sci: 'Stabilny (nie zaobserwowano rozpadu).',
    },
    natural: ab => ({ kid: `W tej postaci występuje w przyrodzie ${ab >= 50 ? 'większość' : 'część'} tego pierwiastka (${String(ab).replace('.', ',')}%).`, sci: `Naturalne rozpowszechnienie: ${String(ab).replace('.', ',')}%.` }),
    radioactive: (hl, mode) => ({
      kid: `Promieniotwórczy! Czas, po którym z kupki takich atomów zostaje połowa, to ${hl}. Rozpada się, ${KIDMODE.pl[mode] ?? 'rozlatując się na kawałki'}.`,
      sci: `Promieniotwórczy: okres półtrwania ${hl}, rodzaj rozpadu: ${SCIMODE.pl[mode] ?? mode}.`,
    }),
    instant: { kid: 'Za bardzo się chwieje: od razu się rozpada!', sci: 'Niezwiązany lub prawie: rozpada się w ciągu około 10⁻¹² s, często emitując nukleon.' },
    unmeasured: { kid: 'Naukowcy już go zrobili, ale nikt nie zmierzył, jak długo istnieje.', sci: 'Zaobserwowany, okres półtrwania niezmierzony.' },
    rich: { kid: 'Za dużo neutronów: jądro nie może ich utrzymać, więc wyciekają.', sci: 'Poza znanymi izotopami po stronie bogatej w neutrony (za neutronową granicą stabilności, ang. neutron drip line): emitowane są neutrony.' },
    poor: { kid: 'Za mało neutronów: protony odpychają się nawzajem i jeden z nich wylatuje.', sci: 'Poza znanymi izotopami po stronie bogatej w protony (za protonową granicą stabilności, ang. proton drip line): emitowane są protony.' },
    notMade: { kid: 'Nikt jeszcze tego nie zrobił! Może kiedyś...', sci: 'Jeszcze nie zaobserwowany: brak pomiarów.' },
    held: { kid: 'Pole siłowe utrzymuje jądro w całości, kiedy budujesz.', sci: 'Utrzymywany (automatyczny rozpad wyłączony).' },
  },
  de: {
    empty: {
      kid: 'Bau ein Atom! Protonen bestimmen das Element, Neutronen kleben den Kern zusammen, Elektronen sausen um ihn herum.',
      sci: 'Wähle Z (Protonen), N (Neutronen) und die Zahl der Elektronen: Die Schmiede schlägt das Nuklid in der Nuklidkarte nach (NUBASE, 3552 bekannte).',
    },
    neutron: {
      kid: 'Ein Neutron ganz allein: keine Protonen, also noch kein Element. Allein gelassen verwandelt es sich in etwa 10 Minuten in ein Proton und ein Elektron: ein Wasserstoffatom!',
      sci: 'Ein freies Neutron: mittlere Lebensdauer 878 s (Halbwertszeit 609 s), n → p + e⁻ + Antineutrino. Zu lang, als dass die Schmiede warten könnte: Drück auf Zerfall, um es zu sehen.',
    },
    neutrons: {
      kid: 'Neutronen allein halten nicht zusammen. Füg ein Proton hinzu!',
      sci: 'Es gibt keinen gebundenen Zustand aus Neutronen allein (das Dineutron ist ungebunden); einen Neutronenstern hält die Schwerkraft zusammen, nicht die Kernkraft.',
    },
    element: (Z, lang) => ({
      kid: `${Z} ${counted(DE.proton, Z, 'de')}: Das ist ${nm(Z, lang)}! Die Zahl der Protonen entscheidet, welches Element ein Atom ist.`,
      sci: `Z = ${Z}: ${nm(Z, lang)}. Die Ordnungszahl allein legt das Element fest; N und die Elektronen ändern nur das Isotop und die Ladung.`,
    }),
    isotope: (Z, N, common) => ({
      kid: N === common ? `Mit ${N} ${counted(DE.neutron, N, 'de')} ist das die häufigste Sorte.` : `Mit ${N} ${counted(DE.neutron, N, 'de')} (die häufigste Sorte hat ${common}) ist es ein anderes Isotop: dasselbe Element, ein ${N > common ? 'schwererer' : 'leichterer'} Kern.`,
      sci: `N = ${N}, A = ${Z + N}${N === common ? ' (das häufigste Isotop)' : ` (das häufigste hat N = ${common})`}.`,
    }),
    ion: (q, sym) => ({
      kid: q === 0 ? 'So viele Elektronen wie Protonen: ein neutrales Atom.' : q > 0 ? `${q} ${counted(DE.electron, q, 'de')} zu wenig: ein positives Ion (${sym}). Metalle geben auf diese Weise gern Elektronen ab.` : `${-q} ${counted(DE.electron, -q, 'de')} zu viel: ein negatives Ion (${sym}).`,
      sci: q === 0 ? 'Neutral: Z Elektronen.' : `Ladung ${q > 0 ? '+' : '−'}${Math.abs(q)} (${sym}).`,
    }),
    crystalOnly: {
      kid: 'Mehr als ein zusätzliches Elektron bleibt nur in einem Kristall an seinem Platz, wo sich die Nachbarn das Drängeln teilen (wie die Oxid-Ionen im Rost).',
      sci: 'Freie atomare Dianionen sind in der Gasphase ungebunden (O²⁻ existiert nur durch ein Kristallgitter stabilisiert, die Madelung-Energie).',
    },
    noExtra: (Z, lang) => ({
      kid: `${cap(nm(Z, lang))} will kein zusätzliches Elektron: Es fliegt davon.`,
      sci: `${cap(nm(Z, lang))} hat keine positive Elektronenaffinität: Sein Anion ist ungebunden.`,
    }),
    beyond: {
      kid: 'Das wäre ein Element jenseits von 118, und niemand hat je eines hergestellt. Labore in Japan, den USA und Russland versuchen, 119 und 120 zu erzeugen: Bisher hat nichts gehalten.',
      sci: 'Kein Element jenseits von Oganesson (118) wurde bisher erzeugt. Die Suche nach 119 und 120 (RIKEN, Berkeley, Dubna) hat noch kein Ereignis gefunden; erwartet werden Wirkungsquerschnitte von Femtobarn oder weniger.',
    },
    tooMany: { kid: 'Kein Platz: Die zusätzlichen Elektronen stoßen sich gegenseitig ab.', sci: 'Jenseits einer Ladung von −3 bindet nichts ein atomares Anion.' },
    noHold: { kid: 'Ohne Protonen hält nichts ein Elektron fest.', sci: 'Keine Kernladung: Ein Elektron kann nicht gebunden werden.' },
    stable: {
      kid: 'Sein Kern ist stabil: Er kann ewig halten.',
      sci: 'Stabil (kein Zerfall beobachtet).',
    },
    natural: ab => ({ kid: `So kommt ${ab >= 50 ? 'das meiste' : 'ein Teil'} davon in der Natur vor (${String(ab).replace('.', ',')}%).`, sci: `Natürliche Häufigkeit ${String(ab).replace('.', ',')}%.` }),
    radioactive: (hl, mode) => ({
      kid: `Radioaktiv! Es dauert ${hl}, bis von einem Haufen davon die Hälfte zerfallen ist. Es zerfällt, indem es ${KIDMODE.de[mode] ?? 'auseinanderbricht'}.`,
      sci: `Radioaktiv: Halbwertszeit ${hl}, Zerfallsart ${SCIMODE.de[mode] ?? mode}.`,
    }),
    instant: { kid: 'Viel zu wackelig: Es fällt sofort auseinander!', sci: 'Ungebunden oder fast: Es zerfällt innerhalb von etwa 10⁻¹² s, oft unter Abgabe eines Nukleons.' },
    unmeasured: { kid: 'Wissenschaftler haben es schon hergestellt, aber niemand hat gemessen, wie lange es hält.', sci: 'Beobachtet, Halbwertszeit nicht gemessen.' },
    rich: { kid: 'Zu viele Neutronen: Der Kern kann sie nicht halten, also tropfen sie heraus.', sci: 'Jenseits der bekannten Isotope auf der neutronenreichen Seite (hinter der Neutronen-Abbruchkante): Neutronen werden abgegeben.' },
    poor: { kid: 'Zu wenige Neutronen: Die Protonen stoßen sich gegenseitig ab, und eines fliegt heraus.', sci: 'Jenseits der bekannten Isotope auf der protonenreichen Seite (hinter der Protonen-Abbruchkante): Protonen werden abgegeben.' },
    notMade: { kid: 'Das hat noch niemand hergestellt! Vielleicht eines Tages...', sci: 'Noch nicht beobachtet: Es gibt keine Messung.' },
    held: { kid: 'Das Kraftfeld hält es zusammen, während du baust.', sci: 'Gehalten (automatischer Zerfall aus).' },
  },
}

const FEMININE = new Set(['Ag', 'Pt'])
const art = Z => (FEMININE.has(el(Z).symbol) ? 'a' : 'o')
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

const KIDMODE = {
  en: { alpha: 'shooting out an alpha particle (2 protons and 2 neutrons)', betaMinus: 'turning a neutron into a proton and shooting out an electron', betaPlus: 'turning a proton into a neutron and shooting out a positron', capture: 'swallowing one of its own electrons', proton: 'spitting out a proton', neutron: 'spitting out a neutron', fission: 'splitting in two', cluster: 'shooting out a whole small nucleus' },
  'pt-pt': { alpha: 'disparar uma partícula alfa (2 protões e 2 neutrões)', betaMinus: 'transformar um neutrão num protão e disparar um eletrão', betaPlus: 'transformar um protão num neutrão e disparar um positrão', capture: 'engolir um dos seus próprios eletrões', proton: 'cuspir um protão', neutron: 'cuspir um neutrão', fission: 'se partir em dois', cluster: 'disparar um pequeno núcleo inteiro' },
  // "Rozpada się, ..." (participles)
  pl: { alpha: 'wystrzeliwując cząstkę alfa (2 protony i 2 neutrony)', betaMinus: 'zamieniając neutron w proton i wystrzeliwując elektron', betaPlus: 'zamieniając proton w neutron i wystrzeliwując pozyton', capture: 'połykając jeden ze swoich własnych elektronów', proton: 'wypluwając proton', neutron: 'wypluwając neutron', fission: 'dzieląc się na dwie części', cluster: 'wystrzeliwując całe małe jądro' },
  // "Es zerfällt, indem es ..." (the verb at the end)
  de: { alpha: 'ein Alphateilchen (2 Protonen und 2 Neutronen) ausstößt', betaMinus: 'ein Neutron in ein Proton verwandelt und ein Elektron ausstößt', betaPlus: 'ein Proton in ein Neutron verwandelt und ein Positron ausstößt', capture: 'eines seiner eigenen Elektronen verschluckt', proton: 'ein Proton ausspuckt', neutron: 'ein Neutron ausspuckt', fission: 'sich in zwei Teile spaltet', cluster: 'einen ganzen kleinen Kern ausstößt' },
}
const SCIMODE = {
  en: { alpha: 'α', betaMinus: 'β⁻', betaPlus: 'β⁺', capture: 'electron capture (EC)', proton: 'proton emission', neutron: 'neutron emission', fission: 'spontaneous fission', cluster: 'cluster decay' },
  'pt-pt': { alpha: 'α', betaMinus: 'β⁻', betaPlus: 'β⁺', capture: 'captura eletrónica (CE)', proton: 'emissão de protão', neutron: 'emissão de neutrão', fission: 'fissão espontânea', cluster: 'decaimento por agregado' },
  pl: { alpha: 'α', betaMinus: 'β⁻', betaPlus: 'β⁺', capture: 'wychwyt elektronu (EC)', proton: 'emisja protonu', neutron: 'emisja neutronu', fission: 'spontaniczne rozszczepienie', cluster: 'rozpad klastrowy' },
  de: { alpha: 'α', betaMinus: 'β⁻', betaPlus: 'β⁺', capture: 'Elektroneneinfang (EC)', proton: 'Protonenemission', neutron: 'Neutronenemission', fission: 'Spontanspaltung', cluster: 'Clusterzerfall' },
}

const DECAYED = {
  en: {
    alpha: (a, b) => `It shot out an alpha particle: 2 protons and 2 neutrons. Two steps back in the table: now it is ${b}.`,
    betaMinus: (a, b) => `A neutron turned into a proton and shot out an electron (and a ghostly antineutrino). One step forward: now it is ${b}.`,
    betaPlus: (a, b) => `A proton turned into a neutron and shot out a positron, the electron's antiparticle. One step back: now it is ${b}.`,
    capture: (a, b) => `The nucleus swallowed one of its own electrons: a proton became a neutron. One step back: now it is ${b}.`,
    proton: (a, b) => `A proton flew out: now it is ${b}.`,
    neutron: (a, b) => `A neutron dripped out: now it is ${b}.`,
    fission: (a, b) => `It split in two! One piece flew away with a few neutrons; the bigger piece stayed: ${b}.`,
    cluster: (a, b) => `It shot out a whole small nucleus! What is left is ${b}.`,
  },
  'pt-pt': {
    alpha: (a, b) => `Disparou uma partícula alfa: 2 protões e 2 neutrões. Dois passos atrás na tabela: agora é ${b}.`,
    betaMinus: (a, b) => `Um neutrão transformou-se num protão e disparou um eletrão (e um antineutrino quase fantasma). Um passo em frente: agora é ${b}.`,
    betaPlus: (a, b) => `Um protão transformou-se num neutrão e disparou um positrão, a antipartícula do eletrão. Um passo atrás: agora é ${b}.`,
    capture: (a, b) => `O núcleo engoliu um dos seus próprios eletrões: um protão passou a neutrão. Um passo atrás: agora é ${b}.`,
    proton: (a, b) => `Saiu disparado um protão: agora é ${b}.`,
    neutron: (a, b) => `Pingou um neutrão para fora: agora é ${b}.`,
    fission: (a, b) => `Partiu-se em dois! Um pedaço voou com alguns neutrões; ficou o pedaço maior: ${b}.`,
    cluster: (a, b) => `Disparou um pequeno núcleo inteiro! O que ficou é ${b}.`,
  },
  pl: {
    alpha: (a, b) => `Jądro wystrzeliło cząstkę alfa: 2 protony i 2 neutrony. Dwa miejsca wstecz w układzie okresowym: teraz to ${b}.`,
    betaMinus: (a, b) => `Neutron zamienił się w proton i wystrzelił elektron (oraz antyneutrino, nieuchwytne jak duch). Jedno miejsce do przodu: teraz to ${b}.`,
    betaPlus: (a, b) => `Proton zamienił się w neutron i wystrzelił pozyton, antycząstkę elektronu. Jedno miejsce wstecz: teraz to ${b}.`,
    capture: (a, b) => `Jądro połknęło jeden ze swoich własnych elektronów: proton stał się neutronem. Jedno miejsce wstecz: teraz to ${b}.`,
    proton: (a, b) => `Wyleciał proton: teraz to ${b}.`,
    neutron: (a, b) => `Wykapał neutron: teraz to ${b}.`,
    fission: (a, b) => `Jądro rozszczepiło się na dwie części! Jedna odleciała z kilkoma neutronami; większa została: ${b}.`,
    cluster: (a, b) => `Jądro wystrzeliło całe małe jądro! To, co zostało, to ${b}.`,
  },
  de: {
    alpha: (a, b) => `Es hat ein Alphateilchen ausgestoßen: 2 Protonen und 2 Neutronen. Zwei Schritte zurück im Periodensystem: Jetzt ist es ${b}.`,
    betaMinus: (a, b) => `Ein Neutron hat sich in ein Proton verwandelt und ein Elektron ausgestoßen (und ein geisterhaftes Antineutrino). Ein Schritt vorwärts: Jetzt ist es ${b}.`,
    betaPlus: (a, b) => `Ein Proton hat sich in ein Neutron verwandelt und ein Positron ausgestoßen, das Antiteilchen des Elektrons. Ein Schritt zurück: Jetzt ist es ${b}.`,
    capture: (a, b) => `Der Kern hat eines seiner eigenen Elektronen verschluckt: Ein Proton wurde zum Neutron. Ein Schritt zurück: Jetzt ist es ${b}.`,
    proton: (a, b) => `Ein Proton ist herausgeflogen: Jetzt ist es ${b}.`,
    neutron: (a, b) => `Ein Neutron ist herausgetropft: Jetzt ist es ${b}.`,
    fission: (a, b) => `Es hat sich in zwei Teile gespalten! Ein Stück ist mit ein paar Neutronen davongeflogen; das größere Stück ist geblieben: ${b}.`,
    cluster: (a, b) => `Es hat einen ganzen kleinen Kern ausgestoßen! Übrig ist ${b}.`,
  },
}

const EQUATION_PARTICLE = { alpha: '⁴He (α)', betaMinus: 'e⁻ + ν̄', betaPlus: 'e⁺ + ν', capture: 'ν', proton: 'p', neutron: 'n', fission: '…', cluster: '…' }
// what a decay left when no proton is left (decayText's `to`)
const A_NEUTRON = { en: 'a neutron', 'pt-pt': 'um neutrão', pl: 'neutron', de: 'ein Neutron' }

/** What the forge says after a decay: { kid, sci } (sci: the nuclear equation). */
export function decayText(ev, lang) {
  const fam = modeFamily(ev.mode) ?? 'neutron'
  const to = ev.to.Z ? isotopeName(ev.to.Z, ev.to.N, lang) : A_NEUTRON[lang] ?? A_NEUTRON.en
  const from = ev.from.Z ? nuclideSymbol(ev.from.Z, ev.from.N, ev.from.Z) : 'n'
  const toSym = ev.to.Z ? nuclideSymbol(ev.to.Z, ev.to.N, ev.to.Z) : 'n'
  const L = DECAYED[lang] ?? DECAYED.en
  // the mode's name after the equation, unless its particle already says it (⁴He (α))
  const mode = SCIMODE[lang]?.[fam] ?? ev.mode
  return { kid: L[fam](from, to), sci: `${from} → ${toSym} + ${EQUATION_PARTICLE[fam]}${EQUATION_PARTICLE[fam].includes(mode) ? '' : ` (${mode})`}` }
}

// what the beam particles are called, and their symbols (A up front)
export const BEAM_NAMES = {
  en: { n: 'neutron', p: 'proton', d: 'deuteron', t: 'triton', a: 'alpha particle', C12: 'carbon-12', O16: 'oxygen-16', Ca48: 'calcium-48', Fe58: 'iron-58', Zn70: 'zinc-70' },
  'pt-pt': { n: 'neutrão', p: 'protão', d: 'deuterão', t: 'tritão', a: 'partícula alfa', C12: 'carbono-12', O16: 'oxigénio-16', Ca48: 'cálcio-48', Fe58: 'ferro-58', Zn70: 'zinco-70' },
  pl: { n: 'neutron', p: 'proton', d: 'deuteron', t: 'tryton', a: 'cząstka alfa', C12: 'węgiel-12', O16: 'tlen-16', Ca48: 'wapń-48', Fe58: 'żelazo-58', Zn70: 'cynk-70' },
  de: { n: 'Neutron', p: 'Proton', d: 'Deuteron', t: 'Triton', a: 'Alphateilchen', C12: 'Kohlenstoff-12', O16: 'Sauerstoff-16', Ca48: 'Calcium-48', Fe58: 'Eisen-58', Zn70: 'Zink-70' },
}
// their German articles (reactionText: "Das Neutron ist mit dem Kern verschmolzen")
const DE_ARTICLE = { n: 'Das', p: 'Das', d: 'Das', t: 'Das', a: 'Das', C12: 'Der', O16: 'Der', Ca48: 'Das', Fe58: 'Das', Zn70: 'Das' }
export const BEAM_SYMBOLS = { n: 'n', p: 'p', d: 'd', t: 't', a: 'α', C12: '¹²C', O16: '¹⁶O', Ca48: '⁴⁸Ca', Fe58: '⁵⁸Fe', Zn70: '⁷⁰Zn' }

// the famous reactions, as history saw them (chem/nucleus.js REACTIONS)
const FAMOUS = {
  en: {
    transmute: {
      kid: 'You did what Ernest Rutherford did in 1919: an alpha particle hit nitrogen and knocked out a proton, and nitrogen became oxygen. The first time anyone turned one element into another!',
      sci: '¹⁴N + α → ¹⁷O + p (Rutherford, 1919; seen in a cloud chamber by Blackett, 1925): the first artificial transmutation.',
    },
    neutron: {
      kid: 'Beryllium hit by an alpha particle shoots out a neutron: that is how James Chadwick discovered the neutron, in 1932.',
      sci: '⁹Be + α → ¹²C + n (Chadwick, 1932): the penetrating neutral radiation that knocked protons out of paraffin was a particle about as heavy as the proton.',
    },
    splitLi: {
      kid: 'A proton split lithium into two helium nuclei: Cockcroft and Walton did it in 1932 with the first particle accelerator.',
      sci: '⁷Li + p → 2 ⁴He + 17.3 MeV (Cockcroft and Walton, 1932): the first reaction made with accelerated particles, and a check of E = mc².',
    },
    artificial: {
      kid: 'Aluminium hit by alpha particles became phosphorus-30, which is radioactive: Irène and Frédéric Joliot-Curie made the first artificial radioactivity, in 1934.',
      sci: '²⁷Al + α → ³⁰P + n; ³⁰P decays by β⁺ with a half-life of 2.5 minutes (Joliot-Curie, 1934; Nobel Prize in Chemistry, 1935).',
    },
    fission: {
      kid: 'A slow neutron made uranium-235 split in two, and more neutrons flew out: they can split more uranium. That chain reaction runs nuclear power stations.',
      sci: '²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n, about 200 MeV a fission (Hahn and Strassmann, 1938; explained by Meitner and Frisch).',
    },
    fusion: {
      kid: 'Deuterium and tritium fused into helium and a fast neutron: the reaction that fusion power stations like ITER hope to run on.',
      sci: '²H + ³H → ⁴He (3.5 MeV) + n (14.1 MeV): 17.6 MeV, the easiest fusion reaction to ignite.',
    },
    sun: {
      kid: 'Two protons fused and one of them turned into a neutron: deuterium! This is the first step of how the Sun shines. It is so rare that a proton in the Sun waits billions of years for it.',
      sci: 'p + p → ²H + e⁺ + νₑ, the weak-interaction step of the proton-proton chain (Bethe and Critchfield, 1938); its slowness sets the Sun\'s life of about ten billion years.',
    },
    hoyle: {
      kid: 'Beryllium-8 lasts almost no time, but inside old stars a third alpha particle can hit it first and make carbon-12. The carbon in you was made like this.',
      sci: '⁸Be + α → ¹²C through the 7.65 MeV Hoyle state (predicted by Hoyle, 1953, and found by Fowler\'s group): the triple-alpha process.',
    },
    c14: {
      kid: 'Neutrons from cosmic rays hit nitrogen in the air and make carbon-14 like this, all the time: the clock archaeologists read.',
      sci: '¹⁴N + n → ¹⁴C + p in the upper atmosphere; the basis of Libby\'s radiocarbon dating (1946 to 1949).',
    },
  },
  'pt-pt': {
    transmute: {
      kid: 'Fizeste o que Ernest Rutherford fez em 1919: uma partícula alfa bateu no azoto e arrancou-lhe um protão, e o azoto passou a oxigénio. A primeira vez que alguém transformou um elemento noutro!',
      sci: '¹⁴N + α → ¹⁷O + p (Rutherford, 1919; visto numa câmara de nevoeiro por Blackett, 1925): a primeira transmutação artificial.',
    },
    neutron: {
      kid: 'O berílio atingido por uma partícula alfa dispara um neutrão: foi assim que James Chadwick descobriu o neutrão, em 1932.',
      sci: '⁹Be + α → ¹²C + n (Chadwick, 1932): a radiação neutra e penetrante que arrancava protões à parafina era uma partícula quase tão pesada como o protão.',
    },
    splitLi: {
      kid: 'Um protão partiu o lítio em dois núcleos de hélio: Cockcroft e Walton fizeram-no em 1932, com o primeiro acelerador de partículas.',
      sci: '⁷Li + p → 2 ⁴He + 17,3 MeV (Cockcroft e Walton, 1932): a primeira reação feita com partículas aceleradas, e uma prova de E = mc².',
    },
    artificial: {
      kid: 'O alumínio atingido por partículas alfa passou a fósforo-30, que é radioativo: Irène e Frédéric Joliot-Curie fizeram a primeira radioatividade artificial, em 1934.',
      sci: '²⁷Al + α → ³⁰P + n; o ³⁰P decai por β⁺ com meia-vida de 2,5 minutos (Joliot-Curie, 1934; Prémio Nobel da Química, 1935).',
    },
    fission: {
      kid: 'Um neutrão lento fez o urânio-235 partir-se em dois, e saíram mais neutrões: podem partir mais urânio. Essa reação em cadeia faz funcionar as centrais nucleares.',
      sci: '²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n, cerca de 200 MeV por fissão (Hahn e Strassmann, 1938; explicada por Meitner e Frisch).',
    },
    fusion: {
      kid: 'O deutério e o trítio fundiram-se em hélio e num neutrão rápido: a reação com que as centrais de fusão, como o ITER, esperam funcionar.',
      sci: '²H + ³H → ⁴He (3,5 MeV) + n (14,1 MeV): 17,6 MeV, a reação de fusão mais fácil de acender.',
    },
    sun: {
      kid: 'Dois protões fundiram-se e um deles passou a neutrão: deutério! É o primeiro passo da maneira como o Sol brilha. É tão raro que um protão do Sol espera milhares de milhões de anos por ele.',
      sci: 'p + p → ²H + e⁺ + νₑ, o passo de interação fraca da cadeia protão-protão (Bethe e Critchfield, 1938); a sua lentidão fixa a vida do Sol em cerca de dez mil milhões de anos.',
    },
    hoyle: {
      kid: 'O berílio-8 quase não dura nada, mas dentro das estrelas velhas uma terceira partícula alfa pode bater-lhe antes e fazer carbono-12. O carbono do teu corpo foi feito assim.',
      sci: '⁸Be + α → ¹²C através do estado de Hoyle, a 7,65 MeV (previsto por Hoyle, 1953, e encontrado pelo grupo de Fowler): o processo triplo-alfa.',
    },
    c14: {
      kid: 'Os neutrões dos raios cósmicos batem no azoto do ar e fazem carbono-14 assim, a toda a hora: o relógio que os arqueólogos leem.',
      sci: '¹⁴N + n → ¹⁴C + p na alta atmosfera; a base da datação por radiocarbono de Libby (1946 a 1949).',
    },
  },
  pl: {
    transmute: {
      kid: 'To samo zrobił Ernest Rutherford w 1919 roku: cząstka alfa uderzyła w azot i wybiła z niego proton, a azot stał się tlenem. Pierwszy raz ktoś zamienił jeden pierwiastek w inny!',
      sci: '¹⁴N + α → ¹⁷O + p (Rutherford, 1919; zaobserwowana w komorze mgłowej przez Blacketta, 1925): pierwsza sztuczna transmutacja.',
    },
    neutron: {
      kid: 'Beryl trafiony cząstką alfa wystrzeliwuje neutron: tak James Chadwick odkrył neutron, w 1932 roku.',
      sci: '⁹Be + α → ¹²C + n (Chadwick, 1932): przenikliwe obojętne promieniowanie, które wybijało protony z parafiny, okazało się cząstką prawie tak ciężką jak proton.',
    },
    splitLi: {
      kid: 'Proton rozbił lit na dwa jądra helu: Cockcroft i Walton zrobili to w 1932 roku za pomocą pierwszego akceleratora cząstek.',
      sci: '⁷Li + p → 2 ⁴He + 17,3 MeV (Cockcroft i Walton, 1932): pierwsza reakcja wywołana przyspieszonymi cząstkami i sprawdzian E = mc².',
    },
    artificial: {
      kid: 'Glin trafiony cząstkami alfa stał się fosforem-30, który jest promieniotwórczy: Irène i Frédéric Joliot-Curie wywołali pierwszą sztuczną promieniotwórczość, w 1934 roku.',
      sci: '²⁷Al + α → ³⁰P + n; ³⁰P rozpada się przez β⁺ z okresem półtrwania 2,5 minuty (Joliot-Curie, 1934; Nagroda Nobla z chemii, 1935).',
    },
    fission: {
      kid: 'Wolny neutron sprawił, że uran-235 rozszczepił się na dwie części, a wyleciały kolejne neutrony: mogą one rozszczepić następne jądra uranu. Taka reakcja łańcuchowa napędza elektrownie jądrowe.',
      sci: '²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n, około 200 MeV na jedno rozszczepienie (Hahn i Strassmann, 1938; wyjaśnili je Meitner i Frisch).',
    },
    fusion: {
      kid: 'Deuter i tryt połączyły się w hel i szybki neutron: to reakcja, na której mają kiedyś działać elektrownie termojądrowe, takie jak ITER.',
      sci: '²H + ³H → ⁴He (3,5 MeV) + n (14,1 MeV): 17,6 MeV, reakcja syntezy najłatwiejsza do zapłonu.',
    },
    sun: {
      kid: 'Dwa protony połączyły się, a jeden z nich zamienił się w neutron: powstał deuter! To pierwszy krok tego, jak świeci Słońce. Zdarza się tak rzadko, że proton w Słońcu czeka na to miliardy lat.',
      sci: 'p + p → ²H + e⁺ + νₑ, krok łańcucha proton-proton zachodzący przez oddziaływanie słabe (Bethe i Critchfield, 1938); jego powolność wyznacza życie Słońca na około dziesięć miliardów lat.',
    },
    hoyle: {
      kid: 'Beryl-8 rozpada się niemal natychmiast, ale we wnętrzu starych gwiazd trzecia cząstka alfa może w niego trafić wcześniej i powstaje węgiel-12. Węgiel w twoim ciele powstał właśnie tak.',
      sci: "⁸Be + α → ¹²C przez stan Hoyle'a przy 7,65 MeV (przewidziany przez Hoyle'a w 1953 roku, znaleziony przez grupę Fowlera): proces potrójnej alfa.",
    },
    c14: {
      kid: 'Neutrony z promieniowania kosmicznego uderzają w azot w powietrzu i bez przerwy tworzą w ten sposób węgiel-14: to zegar, który odczytują archeolodzy.',
      sci: "¹⁴N + n → ¹⁴C + p w górnych warstwach atmosfery; podstawa datowania radiowęglowego Libby'ego (1946 do 1949).",
    },
  },
  de: {
    transmute: {
      kid: 'Du hast getan, was Ernest Rutherford 1919 tat: Ein Alphateilchen traf Stickstoff und schlug ein Proton heraus, und aus Stickstoff wurde Sauerstoff. Das erste Mal, dass jemand ein Element in ein anderes verwandelt hat!',
      sci: '¹⁴N + α → ¹⁷O + p (Rutherford, 1919; 1925 von Blackett in einer Nebelkammer beobachtet): die erste künstliche Kernumwandlung.',
    },
    neutron: {
      kid: 'Beryllium, das von einem Alphateilchen getroffen wird, stößt ein Neutron aus: So hat James Chadwick 1932 das Neutron entdeckt.',
      sci: '⁹Be + α → ¹²C + n (Chadwick, 1932): Die durchdringende neutrale Strahlung, die Protonen aus Paraffin schlug, war ein Teilchen, etwa so schwer wie das Proton.',
    },
    splitLi: {
      kid: 'Ein Proton hat Lithium in zwei Heliumkerne gespalten: Cockcroft und Walton schafften das 1932 mit dem ersten Teilchenbeschleuniger.',
      sci: '⁷Li + p → 2 ⁴He + 17,3 MeV (Cockcroft und Walton, 1932): die erste Reaktion mit beschleunigten Teilchen und eine Überprüfung von E = mc².',
    },
    artificial: {
      kid: 'Aluminium, von Alphateilchen getroffen, wurde zu Phosphor-30, und das ist radioaktiv: Irène und Frédéric Joliot-Curie schufen 1934 die erste künstliche Radioaktivität.',
      sci: '²⁷Al + α → ³⁰P + n; ³⁰P zerfällt durch β⁺ mit einer Halbwertszeit von 2,5 Minuten (Joliot-Curie, 1934; Nobelpreis für Chemie, 1935).',
    },
    fission: {
      kid: 'Ein langsames Neutron hat Uran-235 in zwei Teile gespalten, und weitere Neutronen flogen heraus: Sie können noch mehr Uran spalten. Diese Kettenreaktion treibt Kernkraftwerke an.',
      sci: '²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n, etwa 200 MeV pro Spaltung (Hahn und Straßmann, 1938; erklärt von Meitner und Frisch).',
    },
    fusion: {
      kid: 'Deuterium und Tritium sind zu Helium und einem schnellen Neutron verschmolzen: die Reaktion, mit der Fusionskraftwerke wie ITER einmal laufen sollen.',
      sci: '²H + ³H → ⁴He (3,5 MeV) + n (14,1 MeV): 17,6 MeV, die am leichtesten zu zündende Fusionsreaktion.',
    },
    sun: {
      kid: 'Zwei Protonen sind verschmolzen, und eines davon wurde zu einem Neutron: Deuterium! Das ist der erste Schritt, mit dem die Sonne leuchtet. Er ist so selten, dass ein Proton in der Sonne Milliarden Jahre darauf wartet.',
      sci: 'p + p → ²H + e⁺ + νₑ, der Schritt der Proton-Proton-Kette, der über die schwache Wechselwirkung läuft (Bethe und Critchfield, 1938); seine Langsamkeit legt die Lebensdauer der Sonne auf etwa zehn Milliarden Jahre fest.',
    },
    hoyle: {
      kid: 'Beryllium-8 hält fast gar nicht, aber im Inneren alter Sterne kann ein drittes Alphateilchen es vorher treffen und Kohlenstoff-12 bilden. Der Kohlenstoff in dir ist so entstanden.',
      sci: '⁸Be + α → ¹²C über den Hoyle-Zustand bei 7,65 MeV (1953 von Hoyle vorhergesagt und von Fowlers Gruppe gefunden): der Drei-Alpha-Prozess.',
    },
    c14: {
      kid: 'Neutronen aus der kosmischen Strahlung treffen den Stickstoff in der Luft und machen so ständig Kohlenstoff-14: die Uhr, die Archäologen ablesen.',
      sci: '¹⁴N + n → ¹⁴C + p in der oberen Atmosphäre; die Grundlage von Libbys Radiokarbonmethode (1946 bis 1949).',
    },
  },
}

// any other reaction: the beam fused with the nucleus, a hot heavy one boiling off k neutrons
// (nothing: what is left when nothing is; how: the kind of reaction, after the equation)
const FUSED = {
  en: {
    nothing: 'nothing',
    kid: (beam, to, k, heavy) => `The ${BEAM_NAMES.en[beam]} fused with the nucleus: now it is ${to}.${k ? ` It was so hot that it boiled off ${k} neutron${k > 1 ? 's' : ''}.` : ''}${heavy ? ' This is how the laboratories in Dubna, Darmstadt, Berkeley and RIKEN make new elements: one atom at a time.' : ''}`,
    how: k => `fusion${k ? '-evaporation' : ''}`,
  },
  'pt-pt': {
    nothing: 'nada',
    kid: (beam, to, k, heavy) => `O ${BEAM_NAMES['pt-pt'][beam]} fundiu-se com o núcleo: agora é ${to}.${k ? ` Estava tão quente que largou ${k} ${k > 1 ? 'neutrões' : 'neutrão'}.` : ''}${heavy ? ' É assim que os laboratórios de Dubna, Darmstadt, Berkeley e RIKEN fazem elementos novos: um átomo de cada vez.' : ''}`,
    how: k => `fusão${k ? '-evaporação' : ''}`,
  },
  pl: {
    nothing: 'nic',
    // the verb agrees with the count: 1 neutron wyparował, 2 neutrony wyparowały, 5 neutronów wyparowało
    kid: (beam, to, k, heavy) => `${cap(BEAM_NAMES.pl[beam])} i jądro połączyły się w jedno: teraz to ${to}.${k ? ` Nowe jądro było tak gorące, że ${counted({ one: 'wyparował', few: 'wyparowały', many: 'wyparowało' }, k, 'pl')} z niego ${k} ${counted(PL.neutron, k, 'pl')}.` : ''}${heavy ? ' Tak laboratoria w Dubnej, Darmstadt, Berkeley i RIKEN tworzą nowe pierwiastki: atom po atomie.' : ''}`,
    how: k => `fuzja${k ? ' z odparowaniem neutronów' : ''}`,
  },
  de: {
    nothing: 'nichts',
    kid: (beam, to, k, heavy) => `${DE_ARTICLE[beam] ?? 'Das'} ${BEAM_NAMES.de[beam]} ist mit dem Kern verschmolzen: Jetzt ist es ${to}.${k ? ` Der neue Kern war so heiß, dass er ${k} ${counted(DE.neutron, k, 'de')} abgedampft hat.` : ''}${heavy ? ' So stellen die Labore in Dubna, Darmstadt, Berkeley und am RIKEN neue Elemente her: ein Atom nach dem anderen.' : ''}`,
    how: k => `Fusion${k ? ' mit Neutronenverdampfung' : ''}`,
  },
}

/** What the forge says after a beam's reaction: { kid, sci }. */
export function reactionText(ev, lang) {
  const famous = ev.famous && ((FAMOUS[lang] ?? FAMOUS.en)[ev.famous] ?? FAMOUS.en[ev.famous])
  if (famous) return famous
  const F = FUSED[lang] ?? FUSED.en
  const to = ev.to.Z ? isotopeName(ev.to.Z, ev.to.N, lang) : F.nothing
  const k = ev.out.filter(o => o === 'neutron').length
  const target = ev.from.Z ? nuclideSymbol(ev.from.Z, ev.from.N, ev.from.Z) : '∅'
  const toSym = ev.to.Z ? nuclideSymbol(ev.to.Z, ev.to.N, ev.to.Z) : '∅'
  const sci = `${target} + ${BEAM_SYMBOLS[ev.beam]} → ${toSym}${k ? ` + ${k > 1 ? k : ''}n` : ''}`
  return { kid: F.kid(ev.beam, to, k, ev.to.Z >= 104), sci: `${sci} (${F.how(k)}).` }
}

/**
 * The lines the forge shows about the atom on the table: [{ text, tone }], tone one of 'info', 'good',
 * 'warn', 'bad'. s: { Z, N, E, nuc (nucleus.js nuclide), common (the commonest N), held, note }.
 */
export function describe(s, lang, level) {
  const L = W[lang] ?? W.en
  const d = x => (level === 'scientist' ? x.sci : x.kid)
  const out = []
  const { Z, N, E, nuc } = s
  if (nuc.kind === 'empty') return [{ text: d(L.empty), tone: 'info' }]
  if (Z === 0) {
    out.push({ text: d(nuc.kind === 'neutron' ? L.neutron : L.neutrons), tone: nuc.kind === 'neutron' ? 'warn' : 'bad' })
    if (s.note) out.push({ text: d(L[s.note] ?? s.note), tone: 'warn' })
    return out
  }
  out.push({ text: d(L.element(Z, lang)), tone: 'info' })
  out.push({ text: d(L.isotope(Z, N, s.common)), tone: 'info' })
  if (nuc.kind === 'stable') out.push({ text: d(L.stable), tone: 'good' })
  else if (nuc.kind === 'radioactive') out.push({ text: d(L.radioactive(halfLifeText(nuc.t, lang), modeFamily(nuc.modes[0]) ?? nuc.modes[0])), tone: 'warn' })
  else if (nuc.kind === 'instant') out.push({ text: d(L.instant), tone: 'bad' })
  else if (nuc.kind === 'unmeasured') out.push({ text: d(L.unmeasured), tone: 'warn' })
  else if (nuc.kind === 'unknown') out.push({ text: d(nuc.side === 'rich' ? L.rich : nuc.side === 'poor' ? L.poor : L.notMade), tone: nuc.side ? 'bad' : 'warn' })
  if (nuc.abundance > 0) out.push({ text: d(L.natural(nuc.abundance)), tone: 'good' })
  const q = Z - E
  out.push({ text: d(L.ion(q, nuclideSymbol(Z, N, E))), tone: 'info' })
  if (s.note === 'crystalOnly') out.push({ text: d(L.crystalOnly), tone: 'warn' })
  if (s.note === 'noExtra') out.push({ text: d(L.noExtra(Z, lang)), tone: 'warn' })
  if (s.note === 'tooMany') out.push({ text: d(L.tooMany), tone: 'warn' })
  if (s.note === 'beyond') out.push({ text: d(L.beyond), tone: 'warn' })
  if (s.held && nuc.kind !== 'stable') out.push({ text: d(L.held), tone: 'info' })
  return out
}

/** A note without an atom (an electron with no protons to hold it). */
export const noteText = (note, lang, level) => {
  const x = (W[lang] ?? W.en)[note]
  return x ? (level === 'scientist' ? x.sci : x.kid) : null
}

/**
 * The missions, easy to hard. check(s, ev) with s the state { Z, N, E, nuc } and ev the last decay
 * ({ mode, from, to, origin }) or null.
 */
export const MISSIONS = [
  {
    id: 'H', check: s => s.Z === 1 && s.N === 0 && s.E === 1,
    name: { en: 'A hydrogen atom', 'pt-pt': 'Um átomo de hidrogénio', pl: 'Atom wodoru', de: 'Ein Wasserstoffatom' },
    hint: { en: '1 proton and 1 electron: the simplest atom of all.', 'pt-pt': '1 protão e 1 eletrão: o átomo mais simples de todos.', pl: '1 proton i 1 elektron: najprostszy atom ze wszystkich.', de: '1 Proton und 1 Elektron: das einfachste Atom von allen.' },
  },
  {
    id: 'D', check: s => s.Z === 1 && s.N === 1 && s.E === 1,
    name: { en: 'Deuterium, heavy hydrogen', 'pt-pt': 'Deutério, o hidrogénio pesado', pl: 'Deuter, ciężki wodór', de: 'Deuterium, schwerer Wasserstoff' },
    hint: { en: 'Hydrogen with a neutron too. About 1 in 6400 hydrogen atoms in the sea is one.', 'pt-pt': 'Hidrogénio com um neutrão. Cerca de 1 em cada 6400 átomos de hidrogénio do mar é assim.', pl: 'Wodór z dodatkowym neutronem. Mniej więcej 1 na 6400 atomów wodoru w morzu jest taki.', de: 'Wasserstoff, dazu ein Neutron. Etwa 1 von 6400 Wasserstoffatomen im Meer ist so eines.' },
  },
  {
    id: 'He4', check: s => s.Z === 2 && s.N === 2 && s.E === 2,
    name: { en: 'Helium-4', 'pt-pt': 'Hélio-4', pl: 'Hel-4', de: 'Helium-4' },
    hint: { en: '2 protons, 2 neutrons, 2 electrons: what the Sun makes from hydrogen.', 'pt-pt': '2 protões, 2 neutrões, 2 eletrões: o que o Sol faz a partir do hidrogénio.', pl: '2 protony, 2 neutrony, 2 elektrony: to, co Słońce robi z wodoru.', de: '2 Protonen, 2 Neutronen, 2 Elektronen: das, was die Sonne aus Wasserstoff macht.' },
  },
  {
    id: 'alpha', check: s => s.Z === 2 && s.N === 2 && s.E === 0,
    name: { en: 'An alpha particle', 'pt-pt': 'Uma partícula alfa', pl: 'Cząstka alfa', de: 'Ein Alphateilchen' },
    hint: { en: 'A helium nucleus with no electrons at all: what radium and uranium shoot out.', 'pt-pt': 'Um núcleo de hélio sem eletrão nenhum: o que o rádio e o urânio disparam.', pl: 'Jądro helu bez żadnych elektronów: to, co wystrzeliwują rad i uran.', de: 'Ein Heliumkern ganz ohne Elektronen: das, was Radium und Uran ausstoßen.' },
  },
  {
    id: 'C12', check: s => s.Z === 6 && s.N === 6 && s.E === 6,
    name: { en: 'Carbon-12', 'pt-pt': 'Carbono-12', pl: 'Węgiel-12', de: 'Kohlenstoff-12' },
    hint: { en: '6 of each: the carbon of every living thing.', 'pt-pt': '6 de cada: o carbono de todos os seres vivos.', pl: 'Po 6 każdego rodzaju: węgiel wszystkich żywych istot.', de: 'Von jedem 6: der Kohlenstoff aller Lebewesen.' },
  },
  {
    id: 'C14', check: (s, ev) => !!ev && ev.from.Z === 6 && ev.from.N === 8,
    name: { en: 'Carbon-14 turning into nitrogen', 'pt-pt': 'Carbono-14 a virar azoto', pl: 'Węgiel-14 zmienia się w azot', de: 'Kohlenstoff-14 wird zu Stickstoff' },
    hint: { en: 'Make carbon-14 (8 neutrons) and press decay: the clock of archaeologists.', 'pt-pt': 'Faz carbono-14 (8 neutrões) e carrega em decair: o relógio dos arqueólogos.', pl: 'Zbuduj węgiel-14 (8 neutronów) i naciśnij rozpad: zegar archeologów.', de: 'Bau Kohlenstoff-14 (8 Neutronen) und drück auf Zerfall: die Uhr der Archäologen.' },
  },
  {
    id: 'O16', check: s => s.Z === 8 && s.N === 8 && s.E === 8,
    name: { en: 'Oxygen-16', 'pt-pt': 'Oxigénio-16', pl: 'Tlen-16', de: 'Sauerstoff-16' },
    hint: { en: '8 protons, 8 neutrons, 8 electrons: the oxygen you breathe.', 'pt-pt': '8 protões, 8 neutrões, 8 eletrões: o oxigénio que respiras.', pl: '8 protonów, 8 neutronów, 8 elektronów: tlen, którym oddychasz.', de: '8 Protonen, 8 Neutronen, 8 Elektronen: der Sauerstoff, den du atmest.' },
  },
  {
    id: 'Na+', check: s => s.Z === 11 && s.N === 12 && s.E === 10,
    name: { en: 'A sodium ion, Na⁺', 'pt-pt': 'Um ião sódio, Na⁺', pl: 'Jon sodu, Na⁺', de: 'Ein Natrium-Ion, Na⁺' },
    hint: { en: 'Sodium-23 with one electron given away, as in table salt.', 'pt-pt': 'Sódio-23 que deu um eletrão, como no sal de cozinha.', pl: 'Sód-23, który oddał jeden elektron, jak w soli kuchennej.', de: 'Natrium-23, das ein Elektron abgegeben hat, wie im Kochsalz.' },
  },
  {
    id: 'Cl-', check: s => s.Z === 17 && (s.N === 18 || s.N === 20) && s.E === 18,
    name: { en: 'A chloride ion, Cl⁻', 'pt-pt': 'Um ião cloreto, Cl⁻', pl: 'Jon chlorkowy, Cl⁻', de: 'Ein Chlorid-Ion, Cl⁻' },
    hint: { en: 'Chlorine-35 or 37 with one extra electron: the other half of salt.', 'pt-pt': 'Cloro-35 ou 37 com um eletrão a mais: a outra metade do sal.', pl: 'Chlor-35 lub 37 z jednym dodatkowym elektronem: druga połowa soli.', de: 'Chlor-35 oder 37 mit einem zusätzlichen Elektron: die andere Hälfte des Salzes.' },
  },
  {
    id: 'Fe56', check: s => s.Z === 26 && s.N === 30 && s.E === 26,
    name: { en: 'Iron-56', 'pt-pt': 'Ferro-56', pl: 'Żelazo-56', de: 'Eisen-56' },
    hint: { en: 'Where the stars stop: fusing past iron costs energy instead of giving it.', 'pt-pt': 'Onde as estrelas param: fundir para lá do ferro gasta energia em vez de a dar.', pl: 'Tu gwiazdy się zatrzymują: synteza dalej niż żelazo zużywa energię, zamiast ją dawać.', de: 'Hier hören die Sterne auf: Fusion über Eisen hinaus kostet Energie, statt welche zu liefern.' },
  },
  {
    id: 'Tc', check: s => s.Z === 43 && s.nuc.kind !== 'unknown',
    name: { en: 'Technetium', 'pt-pt': 'Tecnécio', pl: 'Technet', de: 'Technetium' },
    hint: { en: '43 protons: the first element made by people (1937), none of it stable.', 'pt-pt': '43 protões: o primeiro elemento feito pelas pessoas (1937), sem nenhum isótopo estável.', pl: '43 protony: pierwszy pierwiastek zrobiony przez ludzi (1937), bez żadnego stabilnego izotopu.', de: '43 Protonen: das erste von Menschen gemachte Element (1937), kein Isotop davon stabil.' },
  },
  {
    id: 'flash', check: s => s.nuc.t != null && s.nuc.t > 0 && s.nuc.t < 1e-6,
    name: { en: 'A millionth-of-a-second nucleus', 'pt-pt': 'Um núcleo de um milionésimo de segundo', pl: 'Jądro na milionową sekundy', de: 'Ein Kern für eine Millionstelsekunde' },
    hint: { en: 'Find a nucleus with a half-life under a millionth of a second (try too many neutrons).', 'pt-pt': 'Encontra um núcleo com meia-vida abaixo de um milionésimo de segundo (experimenta neutrões a mais).', pl: 'Znajdź jądro o okresie półtrwania krótszym niż milionowa sekundy (spróbuj dać za dużo neutronów).', de: 'Finde einen Kern mit einer Halbwertszeit unter einer Millionstelsekunde (probier es mit zu vielen Neutronen).' },
  },
  {
    id: 'U238', check: (s, ev) => !!ev && ev.to.Z === 82 && ev.to.N === 124 && ev.origin?.Z === 92 && ev.origin?.N === 146,
    name: { en: 'From uranium to lead', 'pt-pt': 'Do urânio ao chumbo', pl: 'Od uranu do ołowiu', de: 'Vom Uran zum Blei' },
    hint: { en: 'Make uranium-238 (92 protons, 146 neutrons) and keep pressing decay until it is lead-206: 14 steps.', 'pt-pt': 'Faz urânio-238 (92 protões, 146 neutrões) e carrega em decair até ser chumbo-206: 14 passos.', pl: 'Zbuduj uran-238 (92 protony, 146 neutronów) i naciskaj rozpad, aż zostanie ołów-206: 14 kroków.', de: 'Bau Uran-238 (92 Protonen, 146 Neutronen) und drück so lange auf Zerfall, bis es Blei-206 ist: 14 Schritte.' },
  },
  {
    id: 'Og', check: s => s.Z === 118 && s.N === 176,
    name: { en: 'Oganesson-294', 'pt-pt': 'Oganésson-294', pl: 'Oganeson-294', de: 'Oganesson-294' },
    hint: { en: 'The heaviest atom ever made: 118 protons, 176 neutrons, gone in under a thousandth of a second.', 'pt-pt': 'O átomo mais pesado alguma vez feito: 118 protões, 176 neutrões, desaparece em menos de um milésimo de segundo.', pl: 'Najcięższy atom, jaki kiedykolwiek zrobiono: 118 protonów, 176 neutronów, znika w czasie krótszym niż tysięczna sekundy.', de: 'Das schwerste Atom, das je gemacht wurde: 118 Protonen, 176 Neutronen, in weniger als einer Tausendstelsekunde wieder weg.' },
  },
  // the beam
  {
    id: 'transmute', check: (s, ev) => ev?.famous === 'transmute',
    name: { en: "Rutherford's transmutation", 'pt-pt': 'A transmutação de Rutherford', pl: 'Transmutacja Rutherforda', de: 'Rutherfords Kernumwandlung' },
    hint: { en: 'Make nitrogen-14 and fire an alpha particle at it (1919).', 'pt-pt': 'Faz azoto-14 e dispara-lhe uma partícula alfa (1919).', pl: 'Zbuduj azot-14 i wystrzel w niego cząstkę alfa (1919).', de: 'Bau Stickstoff-14 und schieß ein Alphateilchen darauf (1919).' },
  },
  {
    id: 'neutronFound', check: (s, ev) => ev?.famous === 'neutron',
    name: { en: 'Find the neutron', 'pt-pt': 'Descobre o neutrão', pl: 'Odkryj neutron', de: 'Entdecke das Neutron' },
    hint: { en: 'Make beryllium-9 and fire an alpha particle at it, as Chadwick did (1932).', 'pt-pt': 'Faz berílio-9 e dispara-lhe uma partícula alfa, como Chadwick (1932).', pl: 'Zbuduj beryl-9 i wystrzel w niego cząstkę alfa, jak Chadwick (1932).', de: 'Bau Beryllium-9 und schieß ein Alphateilchen darauf, wie Chadwick (1932).' },
  },
  {
    id: 'sun', check: (s, ev) => ev?.famous === 'sun',
    name: { en: 'The first step of the Sun', 'pt-pt': 'O primeiro passo do Sol', pl: 'Pierwszy krok Słońca', de: 'Der erste Schritt der Sonne' },
    hint: { en: 'Make a hydrogen nucleus (one proton) and fire a proton at it.', 'pt-pt': 'Faz um núcleo de hidrogénio (um protão) e dispara-lhe um protão.', pl: 'Zbuduj jądro wodoru (jeden proton) i wystrzel w nie proton.', de: 'Bau einen Wasserstoffkern (ein Proton) und schieß ein Proton darauf.' },
  },
  {
    id: 'fusion', check: (s, ev) => ev?.famous === 'fusion',
    name: { en: 'Fusion power', 'pt-pt': 'Energia de fusão', pl: 'Energia z syntezy jądrowej', de: 'Fusionsenergie' },
    hint: { en: 'Fire a triton at deuterium (or a deuteron at tritium).', 'pt-pt': 'Dispara um tritão contra deutério (ou um deuterão contra trítio).', pl: 'Wystrzel tryton w deuter (albo deuteron w tryt).', de: 'Schieß ein Triton auf Deuterium (oder ein Deuteron auf Tritium).' },
  },
  {
    id: 'hoyle', check: (s, ev) => ev?.famous === 'hoyle',
    name: { en: 'Carbon from the stars', 'pt-pt': 'Carbono das estrelas', pl: 'Węgiel z gwiazd', de: 'Kohlenstoff aus den Sternen' },
    hint: { en: 'Hold beryllium-8 together (it falls apart at once) and fire an alpha particle at it.', 'pt-pt': 'Segura o berílio-8 (desfaz-se logo) e dispara-lhe uma partícula alfa.', pl: 'Przytrzymaj beryl-8 w całości (od razu się rozpada) i wystrzel w niego cząstkę alfa.', de: 'Halte Beryllium-8 zusammen (es fällt sofort auseinander) und schieß ein Alphateilchen darauf.' },
  },
  {
    id: 'fission', check: (s, ev) => ev?.famous === 'fission',
    name: { en: 'Split uranium', 'pt-pt': 'Parte o urânio', pl: 'Rozszczep uran', de: 'Spalte Uran' },
    hint: { en: 'Make uranium-235 (143 neutrons) and fire a neutron at it (1938).', 'pt-pt': 'Faz urânio-235 (143 neutrões) e dispara-lhe um neutrão (1938).', pl: 'Zbuduj uran-235 (143 neutrony) i wystrzel w niego neutron (1938).', de: 'Bau Uran-235 (143 Neutronen) und schieß ein Neutron darauf (1938).' },
  },
  {
    id: 'beamNew', check: (s, ev) => ev?.mode === 'fusion' && ev.to.Z >= 104,
    name: { en: 'A new element by beam', 'pt-pt': 'Um elemento novo com um feixe', pl: 'Nowy pierwiastek z wiązki', de: 'Ein neues Element mit dem Strahl' },
    hint: { en: 'Fire calcium-48 at californium-249 (98 protons, 151 neutrons): oganesson, as at Dubna in 2006.', 'pt-pt': 'Dispara cálcio-48 contra califórnio-249 (98 protões, 151 neutrões): oganésson, como em Dubna em 2006.', pl: 'Wystrzel wapń-48 w kaliforn-249 (98 protonów, 151 neutronów): oganeson, jak w Dubnej w 2006 roku.', de: 'Schieß Calcium-48 auf Californium-249 (98 Protonen, 151 Neutronen): Oganesson, wie 2006 in Dubna.' },
  },
]

// every table by language, for the tests (words.test.js compares their shapes)
export const TABLES = { W, UNITS, SPECIAL, KIDMODE, SCIMODE, DECAYED, A_NEUTRON, BEAM_NAMES, FAMOUS, FUSED }
