// The Star Forge's words (/stars, docs/knowledge/star-forge.md): the places, the star's phases and ends,
// the slow and the rapid neutron captures, the table, the prompts naming the next tap, the missions. All
// four languages (i18n/langs.js; a missing one falls back to English), both depths (kid: Explorer, sci:
// Scientist). The numbers come from life.js, neutrons.js and data/origins.js, where their sources are.
import { tagOf } from '../../i18n/langs.js'
import { ELEMENTS, nameOf } from '../../data/elements.js'
import { halfLifeText } from '../forge/words.js'
import { YEAR } from './neutrons.js'

const RULES = {}
const pluralOf = (n, lang) => (RULES[lang] ??= new Intl.PluralRules(tagOf(lang))).select(n)
/** A word for a count: a string, or { one, few, many, other }. */
export const counted = (forms, n, lang) => (typeof forms === 'string' ? forms : forms[pluralOf(n, lang)] ?? forms.other)
const fmt = (v, lang, digits = 2) => Number(v.toPrecision(digits)).toLocaleString(tagOf(lang), { maximumFractionDigits: 3, useGrouping: v >= 10000 })
export const fill = (text, vars = {}) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
const el = Z => ELEMENTS[Z - 1]
/** An element's name in running text (lowercase, but German nouns keep their capital). */
export const nm = (Z, lang) => (lang === 'de' ? nameOf(el(Z), lang) : nameOf(el(Z), lang).toLowerCase())

// ---- times and temperatures ----

const BIG = {
  en: { trillion: 'trillion', billion: 'billion', million: 'million', years: { one: 'year', other: 'years' }, months: { one: 'month', other: 'months' }, days: { one: 'day', other: 'days' }, hours: { one: 'hour', other: 'hours' }, of: ' years', second: 'less than a second' },
  'pt-pt': { trillion: { one: 'bilião', other: 'biliões' }, billion: 'mil milhões', million: { one: 'milhão', other: 'milhões' }, years: { one: 'ano', other: 'anos' }, months: { one: 'mês', other: 'meses' }, days: { one: 'dia', other: 'dias' }, hours: { one: 'hora', other: 'horas' }, of: ' de anos', second: 'menos de um segundo' },
  pl: {
    trillion: { one: 'bilion', few: 'biliony', many: 'bilionów', other: 'biliona' },
    billion: { one: 'miliard', few: 'miliardy', many: 'miliardów', other: 'miliarda' },
    million: { one: 'milion', few: 'miliony', many: 'milionów', other: 'miliona' },
    years: { one: 'rok', few: 'lata', many: 'lat', other: 'roku' },
    months: { one: 'miesiąc', few: 'miesiące', many: 'miesięcy', other: 'miesiąca' },
    days: { one: 'dzień', few: 'dni', many: 'dni', other: 'dnia' },
    hours: { one: 'godzina', few: 'godziny', many: 'godzin', other: 'godziny' },
    of: ' lat', second: 'niecała sekunda',
  },
  de: { trillion: { one: 'Billion', other: 'Billionen' }, billion: { one: 'Milliarde', other: 'Milliarden' }, million: { one: 'Million', other: 'Millionen' }, years: { one: 'Jahr', other: 'Jahre' }, months: { one: 'Monat', other: 'Monate' }, days: { one: 'Tag', other: 'Tage' }, hours: { one: 'Stunde', other: 'Stunden' }, of: ' Jahre', second: 'weniger als eine Sekunde' },
}

/** A length of time for a ten-year-old: "about 10 billion years", "7 months", "18 hours". */
export function timeKid(years, lang) {
  const B = BIG[lang] ?? BIG.en
  const big = (v, word) => {
    const n = Number(v.toPrecision(2))
    return `${fmt(n, lang)} ${counted(word, n, lang)}${B.of}`
  }
  if (years >= 1e12) return big(years / 1e12, B.trillion)
  if (years >= 1e9) return big(years / 1e9, B.billion)
  if (years >= 1e6) return big(years / 1e6, B.million)
  const plain = (v, word) => {
    const n = v >= 10 ? Math.round(v / (v >= 1000 ? 100 : v >= 100 ? 10 : 1)) * (v >= 1000 ? 100 : v >= 100 ? 10 : 1) : Number(v.toPrecision(2))
    return `${fmt(n, lang, 4)} ${counted(word, n, lang)}`
  }
  if (years >= 1.5) return plain(years, B.years)
  if (years >= 1 / 12) return plain(years * 12, B.months)
  if (years >= 1 / 365) return plain(years * 365.25, B.days)
  if (years * 8766 >= 1) return plain(years * 8766, B.hours)
  return B.second
}

/** A length of time for the Scientist: the forge's half-life words ("1.97 million years", "267 days"). */
export const timeSci = (years, lang) => halfLifeText(years * YEAR, lang)

const DEG = {
  en: { million: 'million', billion: 'billion', kid: 'degrees' },
  'pt-pt': { million: { one: 'milhão', other: 'milhões' }, billion: 'mil milhões', kid: 'graus' },
  pl: { million: { one: 'milion', few: 'miliony', many: 'milionów', other: 'miliona' }, billion: { one: 'miliard', few: 'miliardy', many: 'miliardów', other: 'miliarda' }, kid: 'stopni' },
  de: { million: { one: 'Million', other: 'Millionen' }, billion: { one: 'Milliarde', other: 'Milliarden' }, kid: 'Grad' },
}
/** A core temperature: "15.7 million K" (or "16 million degrees" for the Explorer). */
export function tempText(K, lang, kid = false) {
  const D = DEG[lang] ?? DEG.en
  const big = K >= 1e9
  const v = Number((K / (big ? 1e9 : 1e6)).toPrecision(kid ? (big ? 1 : 2) : 3))
  return `${fmt(v, lang, 3)} ${counted(big ? D.billion : D.million, v, lang)} ${kid ? D.kid : 'K'}`
}

/** A mass in suns: "1 sun", "0.25 suns", "15 suns". */
export function sunsText(m, lang) {
  const v = Number(m.toPrecision(2))
  const W = { en: { one: 'sun', other: 'suns' }, 'pt-pt': { one: 'sol', other: 'sóis' }, pl: { one: 'masa Słońca', few: 'masy Słońca', many: 'mas Słońca', other: 'masy Słońca' }, de: { one: 'Sonne', other: 'Sonnen' } }
  return `${fmt(v, lang)} ${counted(W[lang] ?? W.en, v, lang)}`
}

/** A list of elements in words: "carbon, nitrogen and oxygen". */
export function listOf(zs, lang) {
  const names = zs.map(z => nm(z, lang))
  if (names.length < 2) return names.join('')
  const and = { en: ' and ', 'pt-pt': ' e ', pl: ' i ', de: ' und ' }[lang] ?? ' and '
  return `${names.slice(0, -1).join(', ')}${and}${names[names.length - 1]}`
}

// ---- the words ----

const EN = {
  title: 'Star Forge',
  place: { star: 'A star’s life', slow: 'The slow catch', rapid: 'The rapid catch' },
  placeTip: {
    star: 'Choose a star and live its life, burning by burning',
    slow: 'Inside an old giant: neutrons caught one by one',
    rapid: 'Two neutron stars merge: a flood of neutrons',
  },
  nursery: { red: 'Red dwarf', sun: 'Sun', three: '3 suns', fifteen: '15 suns', blue: '25 suns' },
  names: { red: 'A red dwarf', sun: 'The Sun', three: 'A star of 3 suns', fifteen: 'A star of 15 suns', blue: 'A blue giant of 25 suns' },
  starOf: 'A star of {m}',
  mass: 'Mass',
  life: 'Its life',
  age: 'Age',
  core: 'Core',
  rate: 'Neutrons',
  rateOff: 'one per tap',
  rateOn: 'a steady rain',
  phase: { proto: 'Not shining yet', h: 'Burning hydrogen', rg: 'A red giant', he: 'Burning helium', agb: 'An old giant', c: 'Burning carbon', ne: 'Burning neon', o: 'Burning oxygen', si: 'Burning silicon', dead: 'Its end' },
  proto: {
    kid: 'A ball of gas pulled together by its own weight, getting hotter in the middle. Tap its core to light it: hydrogen starts to fuse.',
    sci: 'A protostar contracting on the Kelvin-Helmholtz timescale; hydrogen ignites near 10 million K. Below 0.08 suns it never does (a brown dwarf).',
  },
  summary: '{name} lives about {life}. It makes {makes}, and then {end}.',
  endShort: { fade: 'it shrinks into a white dwarf', pn: 'it puffs off its layers and leaves a white dwarf', one: 'it leaves a white dwarf of oxygen and neon (or explodes)', sn: 'it explodes as a supernova' },
  notYet: 'The universe is only 13.8 billion years old: no star like this has died yet.',
  h: {
    pp: {
      kid: 'Its core squeezes hydrogen into helium: four hydrogen nuclei become one helium nucleus, and a little of their mass turns into light. The Sun does this to 600 million tonnes of hydrogen every second. It lasts {time}.',
      sci: 'Core {T}: the proton-proton chain. p + p → d + e⁺ + ν (the slow step: a proton waits billions of years for it), d + p → ³He + γ, ³He + ³He → ⁴He + 2p. Net 4 ¹H → ⁴He + 2e⁺ + 2ν + 26.7 MeV: 0.7 % of the mass becomes energy. Lasts {time}.',
    },
    cno: {
      kid: 'Its core is hotter than the Sun’s, so carbon, nitrogen and oxygen help: they catch protons one by one and hand back helium. On the way they pile up nitrogen, like the nitrogen in the air you breathe. It lasts {time}.',
      sci: 'Core {T}: the CNO cycle. ¹²C catches four protons in turn (via ¹³N, ¹³C, ¹⁴N, ¹⁵O, ¹⁵N) and gives back ¹²C + ⁴He; its slowest step, ¹⁴N + p, piles up nitrogen. Above about 1.3 suns it beats the proton-proton chain (in the Sun it gives about 1 %, Borexino 2020). Lasts {time}.',
    },
    dwarf: 'A red dwarf sips its hydrogen so slowly that it lives about {time}: far longer than the universe has existed.',
  },
  rg: {
    kid: 'The core has run out of hydrogen. Hydrogen keeps burning in a shell round it, and the star swells into a red giant (the Sun will grow about 250 times wider, swallowing Mercury and Venus). It lasts {time}.',
    sci: 'Core hydrogen exhausted: the helium core contracts and heats while a hydrogen-burning shell pushes the envelope out; the Sun reaches about 256 times its radius at the tip of the red giant branch. Lasts {time} (approximate: scaled from the Sun).',
  },
  he: {
    low: {
      kid: 'The core is hot enough now (100 million degrees) to fuse helium: three helium nuclei make one carbon, and carbon and helium make oxygen. The carbon in you was made like this. It lasts {time}.',
      sci: 'Core {T}: the triple alpha, ⁴He + ⁴He ⇌ ⁸Be (it lives 8 × 10⁻¹⁷ s), ⁸Be + ⁴He → ¹²C via Hoyle’s state at 7.65 MeV; then ¹²C + ⁴He → ¹⁶O + γ. In a star like the Sun it begins with the helium flash, in a core of degenerate helium. Lasts {time}.',
    },
    big: {
      kid: 'A heavy star burns helium too, much faster: carbon and oxygen pile up in the core while it swells into a red supergiant. It lasts {time}.',
      sci: 'Core {T}: the triple alpha and ¹²C(α,γ)¹⁶O, the star a red supergiant; the carbon-to-oxygen ratio left behind sets everything after. Lasts {time}.',
    },
    link: 'See the triple alpha up close: carbon’s room “Made inside a giant star”',
  },
  agb: {
    kid: 'An old giant: helium and hydrogen burn in thin shells round a core of carbon and oxygen, flaring every few tens of thousands of years. In the helium shell neutrons fly free, and iron nuclei catch them, slowly growing into heavier elements. Tap the glowing helium shell to watch. It lasts {time}.',
    sci: 'The asymptotic giant branch: double-shell burning with thermal pulses (helium-shell flashes every 10⁴ to 10⁵ years); between them ¹³C(α,n)¹⁶O gives about 10⁸ neutrons per cm³ (the s-process). Dredge-ups bring carbon and the new elements up: technetium, which has no stable isotope, is seen in such stars (Merrill 1952). Lasts {time} (approximate).',
  },
  c: {
    kid: 'The core is now carbon and oxygen, and almost a billion degrees hot: carbon nuclei crash together into neon, sodium and magnesium. It lasts only {time}.',
    sci: 'Core {T}: ¹²C + ¹²C → ²⁰Ne + α, ²³Na + p (rarely ²³Mg + n). From now on neutrinos carry away more energy than light does, so each burning is shorter than the one before. Lasts {time}.',
  },
  ne: {
    kid: 'Neon burning: it is so hot that light itself breaks neon nuclei apart, and the pieces build oxygen and magnesium. It lasts {time}.',
    sci: 'Core {T}: photodisintegration ²⁰Ne(γ,α)¹⁶O, then ²⁰Ne(α,γ)²⁴Mg: net 2 ²⁰Ne → ¹⁶O + ²⁴Mg. Lasts {time}.',
  },
  o: {
    kid: 'Oxygen burning: oxygen nuclei fuse into silicon and sulfur, with a little chlorine, argon, potassium and calcium. It lasts {time}.',
    sci: 'Core {T}: ¹⁶O + ¹⁶O → ²⁸Si + α, ³¹P + p, ³²S + γ; about 90 % of the products by mass are silicon and sulfur. Lasts {time}.',
  },
  si: {
    kid: 'Silicon burning, the last: in {time} the core turns into iron and nickel. Fusing iron gives no energy at all, so the star has nothing left to burn. Tap the core.',
    sci: 'Core {T}: no fusion of two silicons but a melt: photodisintegration frees α particles that climb in quasi-equilibrium to ⁵⁶Ni (Z = N = 28), ⁵⁴Fe and ⁵⁶Fe. Iron-group nuclei are the most tightly bound (⁶²Ni 8.795 MeV per nucleon, ⁵⁶Fe 8.790): fusing past them costs energy. Lasts {time}.',
  },
  ends: {
    fade: {
      kid: 'A red dwarf never swells into a giant: when its hydrogen is used up, after about {life}, it turns hotter and bluer and shrinks into a white dwarf of helium.',
      sci: 'Fully convective, it burns nearly all its hydrogen (Laughlin, Bodenheimer & Adams 1997): a blue dwarf, then a helium white dwarf. Its life, {life}, is far longer than the universe’s 13.8 billion years.',
    },
    pn: {
      kid: 'Its outer layers drift away as a glowing planetary nebula, carrying carbon, nitrogen and the slowly made heavy elements into space for new stars and planets. Left behind: a white dwarf, a hot core as big as the Earth.',
      sci: 'A superwind and a planetary nebula (it glows for about 10⁴ years); the remnant a carbon-oxygen white dwarf of 0.5 to about 1.1 suns (the Sun: about 0.54), held up by electron degeneracy, cooling for billions of years.',
    },
    one: {
      kid: 'It sheds its layers and leaves a white dwarf of oxygen and neon. Some stars this size explode instead: astronomers are still finding out which.',
      sci: 'A super-AGB star: an O-Ne-Mg white dwarf of about 1.2 to 1.4 suns, or, if electron captures on ²⁴Mg and ²⁰Ne win, an electron-capture supernova. The border, about 8 to 10 suns, is still studied.',
    },
    sn: {
      kid: 'The iron core collapses in less than a second. The rest of the star bounces off it and blows out as a supernova, for weeks brighter than a whole galaxy, throwing out everything it made, and new elements are made in the blast itself.',
      sci: 'Core collapse (infall at up to a quarter of the speed of light) to a proto-neutron star; about 10⁴⁶ J, 99 % as neutrinos (SN 1987A: about two dozen caught on Earth); the shock blows the envelope off with about 10⁴⁴ J. Explosive burning makes nickel-56, which decays through cobalt-56 (77 days) into iron-56: the glow of the following months.',
    },
    ns: {
      kid: 'Left behind: a neutron star, as heavy as the Sun and only 20 km across. Tap it: find it a partner.',
      sci: 'The remnant: a neutron star of about 1.4 suns and 20 km, spinning fast (a pulsar). Two of them in orbit merge one day: tap it.',
    },
    bh: {
      kid: 'Left behind: a black hole, so heavy and small that not even light can get out. Tap it to start a new star.',
      sci: 'Above about 20 suns the core often becomes a black hole, by fallback or directly (a failed supernova); which stars do so is still studied (Sukhbold et al. 2016).',
    },
  },
  prompt: {
    light: 'Tap the star’s core to light it',
    next: 'Tap the core: {next}',
    die: 'Tap the core: its last fuel is gone',
    shell: 'or tap the glowing helium shell',
    wd: 'Tap the white dwarf to make a new star',
    ns: 'Tap the neutron star: find it a partner',
    bh: 'Tap the black hole to start again',
    pick: 'Tap a star below to choose another',
    slow: 'Tap the nucleus to give it a neutron',
    merge: 'Tap the two neutron stars',
    wait: 'Watch: the flood of neutrons',
    cool: 'Tap the glowing cloud to let it cool',
    again: 'Tap the cloud for another merger',
  },
  nextPhase: { h: 'light hydrogen', rg: 'its hydrogen runs out', he: 'light helium', agb: 'it grows old', c: 'light carbon', ne: 'light neon', o: 'light oxygen', si: 'light silicon' },
  slow: {
    intro: {
      kid: 'Inside an old giant, in a thin layer of helium: an iron nucleus, made by stars long ago. Neutrons fly about here, but slowly: one comes along about every hundred years. Tap the nucleus to give it one.',
      sci: 'The AGB helium intershell, near 10⁸ K: ¹³C(α,n)¹⁶O gives about 10⁸ neutrons per cm³, so a nucleus catches one about once a century (1/(nσv) with σ ≈ 100 mb). Seed: iron-56. Here a nucleus that would decay sooner decays first; one that lasts longer catches the next neutron (real branch points, like krypton-85, split both ways).',
    },
    caught: { kid: 'It caught a neutron: {iso}. It lasts long enough to wait for the next one.', sci: '{iso}: n capture; {life}, longer than the century until the next neutron.' },
    stable: { kid: 'It caught a neutron: {iso}, a stable nucleus. It waits for the next one.', sci: '{iso}: n capture; stable.' },
    beta: { kid: '{from} could not wait: one of its neutrons turned into a proton and shot out an electron. Now it is {to}: a new element!', sci: '{from} → {to} by β⁻ decay ({life}), before the next neutron.' },
    capture: { kid: '{from} grabbed one of its own electrons, and a proton turned back into a neutron: now it is {to}.', sci: '{from} → {to} by electron capture ({life}).' },
    alpha: { kid: '{from} threw out a helium nucleus: back to {to}. The slow way can go no further: lead and bismuth go round and round.', sci: '{from} → {to} by α decay (138 days): ²⁰⁹Bi(n,γ)²¹⁰Bi(β⁻)²¹⁰Po(α)²⁰⁶Pb, the cycle that ends the s-process.' },
    tc: 'Technetium! No technetium atom lasts for ever, yet astronomers see it in old giants (Paul Merrill, 1952): it must be made inside them. It was the first proof that stars make elements.',
  },
  rapid: {
    orbit: {
      kid: 'Two neutron stars, each heavier than the Sun and only 20 km across, circling each other faster and faster. Tap them to bring them together.',
      sci: 'A binary neutron star losing orbital energy to gravitational waves, as GW170817, seen by LIGO and Virgo on 17 August 2017, 130 million light-years away (with a gamma-ray burst 1.7 s after).',
    },
    merge: { kid: 'They crash! Space itself shakes (gravitational waves), and a cloud of matter full of neutrons flies out.', sci: 'Merger: tidal and disc-wind ejecta, very neutron-rich (few protons per neutron), at 0.1 to 0.3 of the speed of light.' },
    flood: {
      kid: 'A flood of neutrons: the nucleus swells far past anything stable, catching neutron after neutron, and now and then a neutron turns into a proton. In about a second it climbs all the way to plutonium.',
      sci: 'n > 10²⁰ cm⁻³, against the s-process’s 10⁸: captures far faster than β decays, so the path runs along the neutron-rich edge (here the most neutron-rich nuclei ever made in a laboratory; the real path lies farther out still), with waiting points at N = 50, 82, 126. The heaviest nuclei split (fission).',
    },
    cool: { kid: 'The neutrons are used up. Every swollen nucleus is about to decay back toward the stable ones. Tap the cloud.', sci: 'Freeze-out: the neutrons are exhausted; β decays (with β-delayed neutrons, and α decays for the heaviest) take each nucleus to the stable isobar of its mass number.' },
    done: {
      kid: 'Gold, platinum, uranium and {count} elements in all! The cloud glows red for days (a kilonova): astronomers saw it in 2017 and found strontium in its light. That one crash made several Earths’ worth of gold.',
      sci: '{count} elements: the stable (or longer than 500 million years) ends of each β-decay chain, peaks near A = 80, 130 and 195. The kilonova AT2017gfo: 0.03 to 0.05 suns of r-process ejecta; strontium identified in it (Watson et al. 2019); a few to ten Earth masses of gold, by the estimates.',
    },
  },
  table: {
    made: 'What you made',
    origins: 'Where the atoms came from',
    madeKid: 'Each element you made lights up, in the colour of where it was made. The Big Bang gave the first three.',
    madeSci: 'Lit by the burnings, the deaths and the captures you ran here; coloured by the source, as on Johnson’s chart.',
    originsKid: 'Where the atoms of each element in the Solar System were made, after Jennifer Johnson’s chart.',
    originsSci: 'Shares after J. A. Johnson (Science 363, 474, 2019), as read from her 2017 chart (Wikimedia Commons): approximate, a few per cent either way. Grey: no stable isotope.',
    body: 'You, by mass',
    bodyKid: 'Two thirds of you is oxygen from exploding massive stars. The hydrogen in you is a tenth of your weight but six of every ten of your atoms, and it is as old as the universe: from the Big Bang.',
    bodySci: 'A 70 kg body by mass (O 65 %, C 18 %, H 10 %, N 3 %, Ca 1.5 %, P 1 %, then K, S, Na, Cl, Mg), each element split by its sources on Johnson’s chart.',
    count: '{n} of 118 elements',
  },
  sources: { bigbang: 'The Big Bang', cosmic: 'Cosmic rays', lowmass: 'Dying low-mass stars', massive: 'Exploding massive stars', whitedwarf: 'Exploding white dwarfs', merger: 'Merging neutron stars', people: 'Made by people' },
  binding: {
    title: 'Why iron is the end',
    kid: 'How tightly each kind of nucleus holds together. Fusing small nuclei climbs the slope and gives energy; past the top, at iron and nickel, making bigger nuclei costs energy instead.',
    sci: 'Binding energy per nucleon (AME masses, via mendeleev): ⁴He 7.07, ¹²C 7.68, ¹⁶O 7.98, ⁵⁶Fe 8.790, ⁶²Ni 8.795 MeV (the peak), ²³⁸U 7.57. Fusion up to the peak releases energy; so does fission from the heavy side.',
    axis: 'MeV per nucleon',
    mass: 'mass number',
  },
  missions: 'Star missions',
  missionDone: 'Mission complete!',
  cooler: 'below the Sun’s 15.7 million K',
  restart: 'Start again from iron',
  more: 'more...',
  chart: 'The path on the chart of nuclides',
  chartKid: 'Every kind of nucleus: protons up, neutrons across. White: stable. The line is your nucleus’s way.',
  chartSci: 'Z up, N across; white the stable nuclides, grey the known radioactive ones; dashed lines the magic numbers 50, 82, 126.',
  tools: { table: 'The table', chart: 'The chart', curve: 'Why iron' },
}

const PT = {
  title: 'Forja de Estrelas',
  place: { star: 'A vida de uma estrela', slow: 'A captura lenta', rapid: 'A captura rápida' },
  placeTip: {
    star: 'Escolhe uma estrela e vive a vida dela, queima a queima',
    slow: 'Dentro de uma gigante velha: neutrões apanhados um a um',
    rapid: 'Duas estrelas de neutrões fundem-se: uma inundação de neutrões',
  },
  nursery: { red: 'Anã vermelha', sun: 'Sol', three: '3 sóis', fifteen: '15 sóis', blue: '25 sóis' },
  names: { red: 'Uma anã vermelha', sun: 'O Sol', three: 'Uma estrela de 3 sóis', fifteen: 'Uma estrela de 15 sóis', blue: 'Uma gigante azul de 25 sóis' },
  starOf: 'Uma estrela de {m}',
  mass: 'Massa',
  life: 'A sua vida',
  age: 'Idade',
  core: 'Núcleo',
  rate: 'Neutrões',
  rateOff: 'um por toque',
  rateOn: 'uma chuva contínua',
  phase: { proto: 'Ainda não brilha', h: 'A queimar hidrogénio', rg: 'Uma gigante vermelha', he: 'A queimar hélio', agb: 'Uma gigante velha', c: 'A queimar carbono', ne: 'A queimar néon', o: 'A queimar oxigénio', si: 'A queimar silício', dead: 'O seu fim' },
  proto: {
    kid: 'Uma bola de gás apertada pelo próprio peso, a aquecer no meio. Toca no núcleo para a acender: o hidrogénio começa a fundir-se.',
    sci: 'Uma protoestrela a contrair-se na escala de tempo de Kelvin-Helmholtz; o hidrogénio acende-se perto de 10 milhões de K. Abaixo de 0,08 sóis nunca se acende (uma anã castanha).',
  },
  summary: '{name} vive cerca de {life}. Faz {makes} e depois {end}.',
  endShort: { fade: 'encolhe numa anã branca', pn: 'sopra as suas camadas e deixa uma anã branca', one: 'deixa uma anã branca de oxigénio e néon (ou explode)', sn: 'explode numa supernova' },
  notYet: 'O universo tem só 13,8 mil milhões de anos: nenhuma estrela assim morreu ainda.',
  h: {
    pp: {
      kid: 'O seu núcleo aperta hidrogénio em hélio: quatro núcleos de hidrogénio tornam-se um núcleo de hélio, e um pouco da sua massa vira luz. O Sol faz isto a 600 milhões de toneladas de hidrogénio por segundo. Dura {time}.',
      sci: 'Núcleo a {T}: a cadeia protão-protão. p + p → d + e⁺ + ν (o passo lento: um protão espera milhares de milhões de anos por ele), d + p → ³He + γ, ³He + ³He → ⁴He + 2p. No total 4 ¹H → ⁴He + 2e⁺ + 2ν + 26,7 MeV: 0,7 % da massa vira energia. Dura {time}.',
    },
    cno: {
      kid: 'O seu núcleo é mais quente do que o do Sol, por isso o carbono, o azoto e o oxigénio ajudam: apanham protões um a um e devolvem hélio. Pelo caminho acumulam azoto, como o azoto do ar que respiras. Dura {time}.',
      sci: 'Núcleo a {T}: o ciclo CNO. O ¹²C apanha quatro protões, um de cada vez (via ¹³N, ¹³C, ¹⁴N, ¹⁵O, ¹⁵N), e devolve ¹²C + ⁴He; o passo mais lento, ¹⁴N + p, acumula azoto. Acima de cerca de 1,3 sóis vence a cadeia protão-protão (no Sol dá cerca de 1 %, Borexino 2020). Dura {time}.',
    },
    dwarf: 'Uma anã vermelha gasta o seu hidrogénio tão devagar que vive cerca de {time}: muito mais do que o universo já existe.',
  },
  rg: {
    kid: 'O núcleo ficou sem hidrogénio. O hidrogénio continua a arder numa camada à volta dele, e a estrela incha numa gigante vermelha (o Sol vai ficar cerca de 250 vezes mais largo, engolindo Mercúrio e Vénus). Dura {time}.',
    sci: 'Hidrogénio do núcleo esgotado: o núcleo de hélio contrai-se e aquece enquanto uma camada a queimar hidrogénio empurra o invólucro para fora; o Sol chega a cerca de 256 vezes o seu raio no topo do ramo das gigantes vermelhas. Dura {time} (aproximado: escalado a partir do Sol).',
  },
  he: {
    low: {
      kid: 'O núcleo já está quente que chegue (100 milhões de graus) para fundir hélio: três núcleos de hélio fazem um de carbono, e carbono com hélio faz oxigénio. O carbono de que és feito nasceu assim. Dura {time}.',
      sci: 'Núcleo a {T}: o triplo alfa, ⁴He + ⁴He ⇌ ⁸Be (vive 8 × 10⁻¹⁷ s), ⁸Be + ⁴He → ¹²C pelo estado de Hoyle a 7,65 MeV; depois ¹²C + ⁴He → ¹⁶O + γ. Numa estrela como o Sol começa com o flash de hélio, num núcleo de hélio degenerado. Dura {time}.',
    },
    big: {
      kid: 'Uma estrela pesada também queima hélio, muito mais depressa: carbono e oxigénio acumulam-se no núcleo enquanto ela incha numa supergigante vermelha. Dura {time}.',
      sci: 'Núcleo a {T}: o triplo alfa e ¹²C(α,γ)¹⁶O, a estrela uma supergigante vermelha; a razão carbono-oxigénio que fica decide tudo o que vem depois. Dura {time}.',
    },
    link: 'Vê o triplo alfa de perto: a sala do carbono “Feito dentro de uma estrela gigante”',
  },
  agb: {
    kid: 'Uma gigante velha: hélio e hidrogénio ardem em camadas finas à volta de um núcleo de carbono e oxigénio, com clarões a cada poucas dezenas de milhares de anos. Na camada de hélio andam neutrões soltos, e núcleos de ferro apanham-nos, crescendo devagar em elementos mais pesados. Toca na camada de hélio a brilhar para ver. Dura {time}.',
    sci: 'O ramo assimptótico das gigantes: queima em duas camadas com pulsos térmicos (clarões da camada de hélio a cada 10⁴ a 10⁵ anos); entre eles o ¹³C(α,n)¹⁶O dá cerca de 10⁸ neutrões por cm³ (o processo s). As dragagens trazem o carbono e os elementos novos à superfície: o tecnécio, que não tem isótopo estável, vê-se nestas estrelas (Merrill 1952). Dura {time} (aproximado).',
  },
  c: {
    kid: 'O núcleo é agora carbono e oxigénio, e está quase a mil milhões de graus: os núcleos de carbono chocam e fazem néon, sódio e magnésio. Dura só {time}.',
    sci: 'Núcleo a {T}: ¹²C + ¹²C → ²⁰Ne + α, ²³Na + p (raramente ²³Mg + n). A partir daqui os neutrinos levam mais energia do que a luz, por isso cada queima é mais curta do que a anterior. Dura {time}.',
  },
  ne: {
    kid: 'A queima do néon: está tão quente que a própria luz parte os núcleos de néon, e os pedaços constroem oxigénio e magnésio. Dura {time}.',
    sci: 'Núcleo a {T}: fotodesintegração ²⁰Ne(γ,α)¹⁶O, depois ²⁰Ne(α,γ)²⁴Mg: no total 2 ²⁰Ne → ¹⁶O + ²⁴Mg. Dura {time}.',
  },
  o: {
    kid: 'A queima do oxigénio: os núcleos de oxigénio fundem-se em silício e enxofre, com um pouco de cloro, árgon, potássio e cálcio. Dura {time}.',
    sci: 'Núcleo a {T}: ¹⁶O + ¹⁶O → ²⁸Si + α, ³¹P + p, ³²S + γ; cerca de 90 % dos produtos, em massa, são silício e enxofre. Dura {time}.',
  },
  si: {
    kid: 'A queima do silício, a última: em {time} o núcleo vira ferro e níquel. Fundir ferro não dá energia nenhuma, por isso a estrela já não tem nada para queimar. Toca no núcleo.',
    sci: 'Núcleo a {T}: não é uma fusão de dois silícios mas um derreter: a fotodesintegração solta partículas α que sobem em quase-equilíbrio até ao ⁵⁶Ni (Z = N = 28), ⁵⁴Fe e ⁵⁶Fe. Os núcleos do grupo do ferro são os mais ligados (⁶²Ni 8,795 MeV por nucleão, ⁵⁶Fe 8,790): fundir para lá deles custa energia. Dura {time}.',
  },
  ends: {
    fade: {
      kid: 'Uma anã vermelha nunca incha numa gigante: quando gasta o hidrogénio, ao fim de cerca de {life}, fica mais quente e mais azul e encolhe numa anã branca de hélio.',
      sci: 'Toda convectiva, queima quase todo o seu hidrogénio (Laughlin, Bodenheimer e Adams 1997): uma anã azul, depois uma anã branca de hélio. A sua vida, {life}, é muito mais longa do que os 13,8 mil milhões de anos do universo.',
    },
    pn: {
      kid: 'As camadas de fora afastam-se numa nebulosa planetária a brilhar, levando carbono, azoto e os elementos pesados feitos devagar para o espaço, para novas estrelas e planetas. Fica para trás uma anã branca, um núcleo quente do tamanho da Terra.',
      sci: 'Um supervento e uma nebulosa planetária (brilha cerca de 10⁴ anos); o resto, uma anã branca de carbono e oxigénio de 0,5 a cerca de 1,1 sóis (o Sol: cerca de 0,54), sustentada pela degenerescência dos eletrões, a arrefecer durante milhares de milhões de anos.',
    },
    one: {
      kid: 'Larga as suas camadas e deixa uma anã branca de oxigénio e néon. Algumas estrelas deste tamanho explodem em vez disso: os astrónomos ainda estão a descobrir quais.',
      sci: 'Uma estrela super-AGB: uma anã branca de O-Ne-Mg de cerca de 1,2 a 1,4 sóis, ou, se as capturas de eletrões no ²⁴Mg e no ²⁰Ne vencerem, uma supernova por captura eletrónica. A fronteira, cerca de 8 a 10 sóis, ainda se estuda.',
    },
    sn: {
      kid: 'O núcleo de ferro colapsa em menos de um segundo. O resto da estrela ressalta nele e é atirado para fora numa supernova, durante semanas mais brilhante do que uma galáxia inteira, espalhando tudo o que fez; e na própria explosão nascem elementos novos.',
      sci: 'Colapso do núcleo (queda a até um quarto da velocidade da luz) numa proto-estrela de neutrões; cerca de 10⁴⁶ J, 99 % em neutrinos (SN 1987A: cerca de duas dúzias apanhados na Terra); a onda de choque arranca o invólucro com cerca de 10⁴⁴ J. A queima explosiva faz níquel-56, que decai pelo cobalto-56 (77 dias) em ferro-56: o brilho dos meses seguintes.',
    },
    ns: {
      kid: 'Fica para trás uma estrela de neutrões, tão pesada como o Sol e com só 20 km de largura. Toca nela: arranja-lhe um par.',
      sci: 'O resto: uma estrela de neutrões de cerca de 1,4 sóis e 20 km, a rodar depressa (um pulsar). Duas delas em órbita fundem-se um dia: toca-lhe.',
    },
    bh: {
      kid: 'Fica para trás um buraco negro, tão pesado e pequeno que nem a luz consegue sair. Toca nele para começar uma estrela nova.',
      sci: 'Acima de cerca de 20 sóis o núcleo torna-se muitas vezes um buraco negro, por queda de matéria ou diretamente (uma supernova falhada); quais estrelas o fazem ainda se estuda (Sukhbold et al. 2016).',
    },
  },
  prompt: {
    light: 'Toca no núcleo da estrela para a acender',
    next: 'Toca no núcleo: {next}',
    die: 'Toca no núcleo: o último combustível acabou',
    shell: 'ou toca na camada de hélio a brilhar',
    wd: 'Toca na anã branca para fazer uma estrela nova',
    ns: 'Toca na estrela de neutrões: arranja-lhe um par',
    bh: 'Toca no buraco negro para recomeçar',
    pick: 'Toca numa estrela em baixo para escolher outra',
    slow: 'Toca no núcleo para lhe dar um neutrão',
    merge: 'Toca nas duas estrelas de neutrões',
    wait: 'Vê: a inundação de neutrões',
    cool: 'Toca na nuvem a brilhar para a deixar arrefecer',
    again: 'Toca na nuvem para outra fusão',
  },
  nextPhase: { h: 'acender o hidrogénio', rg: 'o hidrogénio acaba', he: 'acender o hélio', agb: 'ela envelhece', c: 'acender o carbono', ne: 'acender o néon', o: 'acender o oxigénio', si: 'acender o silício' },
  slow: {
    intro: {
      kid: 'Dentro de uma gigante velha, numa camada fina de hélio: um núcleo de ferro, feito por estrelas há muito tempo. Aqui andam neutrões, mas devagar: chega um mais ou menos a cada cem anos. Toca no núcleo para lhe dar um.',
      sci: 'A camada entre as queimas de uma AGB, perto de 10⁸ K: o ¹³C(α,n)¹⁶O dá cerca de 10⁸ neutrões por cm³, por isso um núcleo apanha um mais ou menos uma vez por século (1/(nσv) com σ ≈ 100 mb). Semente: ferro-56. Aqui um núcleo que decairia antes disso decai primeiro; um que dura mais apanha o neutrão seguinte (os pontos de ramificação reais, como o crípton-85, seguem os dois caminhos).',
    },
    caught: { kid: 'Apanhou um neutrão: {iso}. Dura o suficiente para esperar pelo próximo.', sci: '{iso}: captura de n; {life}, mais do que o século até ao neutrão seguinte.' },
    stable: { kid: 'Apanhou um neutrão: {iso}, um núcleo estável. Espera pelo próximo.', sci: '{iso}: captura de n; estável.' },
    beta: { kid: 'O {from} não conseguiu esperar: um dos seus neutrões virou protão e disparou um eletrão. Agora é {to}: um elemento novo!', sci: '{from} → {to} por decaimento β⁻ ({life}), antes do neutrão seguinte.' },
    capture: { kid: 'O {from} agarrou um dos seus próprios eletrões, e um protão voltou a ser neutrão: agora é {to}.', sci: '{from} → {to} por captura eletrónica ({life}).' },
    alpha: { kid: 'O {from} atirou fora um núcleo de hélio: de volta a {to}. O caminho lento não vai mais longe: o chumbo e o bismuto andam à roda.', sci: '{from} → {to} por decaimento α (138 dias): ²⁰⁹Bi(n,γ)²¹⁰Bi(β⁻)²¹⁰Po(α)²⁰⁶Pb, o ciclo que acaba o processo s.' },
    tc: 'Tecnécio! Nenhum átomo de tecnécio dura para sempre, e no entanto os astrónomos veem-no nas gigantes velhas (Paul Merrill, 1952): tem de ser feito dentro delas. Foi a primeira prova de que as estrelas fazem elementos.',
  },
  rapid: {
    orbit: {
      kid: 'Duas estrelas de neutrões, cada uma mais pesada do que o Sol e com só 20 km de largura, à roda uma da outra cada vez mais depressa. Toca-lhes para as juntar.',
      sci: 'Uma estrela de neutrões dupla a perder energia de órbita em ondas gravitacionais, como a GW170817, vista pelo LIGO e pelo Virgo a 17 de agosto de 2017, a 130 milhões de anos-luz (com uma explosão de raios gama 1,7 s depois).',
    },
    merge: { kid: 'Chocam! O próprio espaço treme (ondas gravitacionais), e voa uma nuvem de matéria cheia de neutrões.', sci: 'Fusão: matéria ejetada pelas marés e pelo vento do disco, muito rica em neutrões (poucos protões por neutrão), a 0,1 a 0,3 da velocidade da luz.' },
    flood: {
      kid: 'Uma inundação de neutrões: o núcleo incha muito para lá de tudo o que é estável, apanhando neutrão atrás de neutrão, e de vez em quando um neutrão vira protão. Em cerca de um segundo sobe até ao plutónio.',
      sci: 'n > 10²⁰ cm⁻³, contra os 10⁸ do processo s: capturas muito mais rápidas do que os decaimentos β, por isso o caminho segue a borda rica em neutrões (aqui os núcleos mais ricos em neutrões alguma vez feitos em laboratório; o caminho real fica ainda mais para fora), com pontos de espera em N = 50, 82, 126. Os núcleos mais pesados partem-se (fissão).',
    },
    cool: { kid: 'Os neutrões acabaram. Cada núcleo inchado está prestes a decair de volta para os estáveis. Toca na nuvem.', sci: 'Congelamento: os neutrões esgotam-se; decaimentos β (com neutrões atrasados, e decaimentos α nos mais pesados) levam cada núcleo ao isóbaro estável do seu número de massa.' },
    done: {
      kid: 'Ouro, platina, urânio e {count} elementos ao todo! A nuvem brilha vermelha durante dias (uma quilonova): os astrónomos viram-na em 2017 e encontraram estrôncio na sua luz. Esse único choque fez ouro que dava para várias Terras.',
      sci: '{count} elementos: as pontas estáveis (ou com mais de 500 milhões de anos) de cada cadeia de decaimentos β, com picos perto de A = 80, 130 e 195. A quilonova AT2017gfo: 0,03 a 0,05 sóis de matéria do processo r; estrôncio identificado nela (Watson et al. 2019); de algumas a dez massas terrestres de ouro, pelas estimativas.',
    },
  },
  table: {
    made: 'O que fizeste',
    origins: 'De onde vieram os átomos',
    madeKid: 'Cada elemento que fizeste acende-se, na cor de onde foi feito. O Big Bang deu os três primeiros.',
    madeSci: 'Acesos pelas queimas, pelas mortes e pelas capturas que fizeste aqui; com a cor da origem, como no gráfico de Johnson.',
    originsKid: 'Onde foram feitos os átomos de cada elemento do Sistema Solar, segundo o gráfico de Jennifer Johnson.',
    originsSci: 'Partes segundo J. A. Johnson (Science 363, 474, 2019), lidas do seu gráfico de 2017 (Wikimedia Commons): aproximadas, alguns por cento para cima ou para baixo. Cinzento: sem isótopo estável.',
    body: 'Tu, em massa',
    bodyKid: 'Dois terços de ti são oxigénio de estrelas de grande massa que explodiram. O hidrogénio é um décimo do teu peso mas seis de cada dez dos teus átomos, e é tão velho como o universo: vem do Big Bang.',
    bodySci: 'Um corpo de 70 kg em massa (O 65 %, C 18 %, H 10 %, N 3 %, Ca 1,5 %, P 1 %, depois K, S, Na, Cl, Mg), cada elemento repartido pelas suas origens no gráfico de Johnson.',
    count: '{n} de 118 elementos',
  },
  sources: { bigbang: 'O Big Bang', cosmic: 'Raios cósmicos', lowmass: 'Estrelas pequenas a morrer', massive: 'Estrelas de grande massa a explodir', whitedwarf: 'Anãs brancas a explodir', merger: 'Estrelas de neutrões a fundir-se', people: 'Feitos por pessoas' },
  binding: {
    title: 'Porque é que o ferro é o fim',
    kid: 'Quão bem se agarra cada tipo de núcleo. Fundir núcleos pequenos sobe a encosta e dá energia; depois do topo, no ferro e no níquel, fazer núcleos maiores custa energia.',
    sci: 'Energia de ligação por nucleão (massas AME, pelo mendeleev): ⁴He 7,07, ¹²C 7,68, ¹⁶O 7,98, ⁵⁶Fe 8,790, ⁶²Ni 8,795 MeV (o pico), ²³⁸U 7,57. A fusão até ao pico liberta energia; a fissão do lado pesado também.',
    axis: 'MeV por nucleão',
    mass: 'número de massa',
  },
  missions: 'Missões das estrelas',
  missionDone: 'Missão cumprida!',
  cooler: 'abaixo dos 15,7 milhões de K do Sol',
  restart: 'Recomeçar do ferro',
  more: 'mais...',
  chart: 'O caminho na carta de nuclídeos',
  chartKid: 'Todos os tipos de núcleo: protões para cima, neutrões para o lado. Branco: estável. A linha é o caminho do teu núcleo.',
  chartSci: 'Z para cima, N para o lado; a branco os nuclídeos estáveis, a cinzento os radioativos conhecidos; tracejados os números mágicos 50, 82, 126.',
  tools: { table: 'A tabela', chart: 'A carta', curve: 'Porquê o ferro' },
}

const PL = {
  title: 'Kuźnia Gwiazd',
  place: { star: 'Życie gwiazdy', slow: 'Powolne łapanie', rapid: 'Szybkie łapanie' },
  placeTip: {
    star: 'Wybierz gwiazdę i przeżyj jej życie, spalanie po spalaniu',
    slow: 'W starym olbrzymie: neutrony łapane jeden po drugim',
    rapid: 'Dwie gwiazdy neutronowe się zderzają: powódź neutronów',
  },
  nursery: { red: 'Czerwony karzeł', sun: 'Słońce', three: '3 masy Słońca', fifteen: '15 mas Słońca', blue: '25 mas Słońca' },
  names: { red: 'Czerwony karzeł', sun: 'Słońce', three: 'Gwiazda o masie 3 Słońc', fifteen: 'Gwiazda o masie 15 Słońc', blue: 'Niebieski olbrzym o masie 25 Słońc' },
  starOf: 'Gwiazda: {m}',
  mass: 'Masa',
  life: 'Jej życie',
  age: 'Wiek',
  core: 'Jądro',
  rate: 'Neutrony',
  rateOff: 'jeden na dotknięcie',
  rateOn: 'równy deszcz',
  phase: { proto: 'Jeszcze nie świeci', h: 'Spala wodór', rg: 'Czerwony olbrzym', he: 'Spala hel', agb: 'Stary olbrzym', c: 'Spala węgiel', ne: 'Spala neon', o: 'Spala tlen', si: 'Spala krzem', dead: 'Jej koniec' },
  proto: {
    kid: 'Kula gazu ściśnięta własnym ciężarem, coraz gorętsza w środku. Dotknij jej jądra, żeby ją zapalić: wodór zaczyna się łączyć.',
    sci: 'Protogwiazda kurczy się w skali czasu Kelvina-Helmholtza; wodór zapala się przy około 10 milionach K. Poniżej 0,08 masy Słońca nigdy (brązowy karzeł).',
  },
  summary: '{name}: żyje około {life}. Wytwarza {makes}, a potem {end}.',
  endShort: { fade: 'kurczy się w białego karła', pn: 'zrzuca warstwy i zostawia białego karła', one: 'zostawia białego karła z tlenu i neonu (albo wybucha)', sn: 'wybucha jako supernowa' },
  notYet: 'Wszechświat ma dopiero 13,8 miliarda lat: żadna taka gwiazda jeszcze nie umarła.',
  h: {
    pp: {
      kid: 'Jej jądro ściska wodór w hel: cztery jądra wodoru stają się jednym jądrem helu, a odrobina ich masy zamienia się w światło. Słońce robi tak z 600 milionami ton wodoru na sekundę. Trwa to {time}.',
      sci: 'Jądro: {T}. Cykl proton-proton: p + p → d + e⁺ + ν (powolny krok: proton czeka na niego miliardy lat), d + p → ³He + γ, ³He + ³He → ⁴He + 2p. W sumie 4 ¹H → ⁴He + 2e⁺ + 2ν + 26,7 MeV: 0,7 % masy staje się energią. Trwa {time}.',
    },
    cno: {
      kid: 'Jej jądro jest gorętsze niż jądro Słońca, więc pomagają węgiel, azot i tlen: łapią protony jeden po drugim i oddają hel. Po drodze gromadzą azot, taki jak azot w powietrzu, którym oddychasz. Trwa to {time}.',
      sci: 'Jądro: {T}. Cykl CNO: ¹²C łapie po kolei cztery protony (przez ¹³N, ¹³C, ¹⁴N, ¹⁵O, ¹⁵N) i oddaje ¹²C + ⁴He; najwolniejszy krok, ¹⁴N + p, gromadzi azot. Powyżej około 1,3 masy Słońca wygrywa z cyklem proton-proton (w Słońcu daje około 1 %, Borexino 2020). Trwa {time}.',
    },
    dwarf: 'Czerwony karzeł zużywa wodór tak powoli, że żyje około {time}: o wiele dłużej, niż istnieje Wszechświat.',
  },
  rg: {
    kid: 'W jądrze skończył się wodór. Wodór pali się dalej w powłoce wokół niego, a gwiazda puchnie w czerwonego olbrzyma (Słońce stanie się około 250 razy szersze i połknie Merkurego i Wenus). Trwa to {time}.',
    sci: 'Wodór w jądrze wyczerpany: helowe jądro kurczy się i grzeje, a powłoka spalająca wodór wypycha otoczkę; Słońce na szczycie gałęzi czerwonych olbrzymów osiągnie około 256 obecnych promieni. Trwa {time} (w przybliżeniu: przeskalowane od Słońca).',
  },
  he: {
    low: {
      kid: 'Jądro jest już dość gorące (100 milionów stopni), żeby łączyć hel: trzy jądra helu tworzą jedno jądro węgla, a węgiel z helem daje tlen. Węgiel, z którego jesteś zbudowany, powstał właśnie tak. Trwa to {time}.',
      sci: 'Jądro: {T}. Proces potrójnej alfa, ⁴He + ⁴He ⇌ ⁸Be (żyje 8 × 10⁻¹⁷ s), ⁸Be + ⁴He → ¹²C przez stan Hoyle’a przy 7,65 MeV; potem ¹²C + ⁴He → ¹⁶O + γ. W gwieździe takiej jak Słońce zaczyna się od błysku helowego w jądrze ze zdegenerowanego helu. Trwa {time}.',
    },
    big: {
      kid: 'Ciężka gwiazda też spala hel, dużo szybciej: węgiel i tlen gromadzą się w jądrze, a ona puchnie w czerwonego nadolbrzyma. Trwa to {time}.',
      sci: 'Jądro: {T}. Potrójna alfa i ¹²C(α,γ)¹⁶O, gwiazda jest czerwonym nadolbrzymem; pozostały stosunek węgla do tlenu decyduje o wszystkim, co dalej. Trwa {time}.',
    },
    link: 'Zobacz potrójną alfę z bliska: sala węgla „Zrobiony we wnętrzu olbrzymiej gwiazdy”',
  },
  agb: {
    kid: 'Stary olbrzym: hel i wodór palą się w cienkich powłokach wokół jądra z węgla i tlenu, rozbłyskując co kilkadziesiąt tysięcy lat. W powłoce helowej latają wolne neutrony, a jądra żelaza je łapią i powoli rosną w cięższe pierwiastki. Dotknij świecącej powłoki helowej, żeby zobaczyć. Trwa to {time}.',
    sci: 'Asymptotyczna gałąź olbrzymów: spalanie w dwóch powłokach z pulsami termicznymi (błyski powłoki helowej co 10⁴ do 10⁵ lat); między nimi ¹³C(α,n)¹⁶O daje około 10⁸ neutronów na cm³ (proces s). Wymieszania wynoszą węgiel i nowe pierwiastki na powierzchnię: technet, który nie ma trwałego izotopu, widać w takich gwiazdach (Merrill 1952). Trwa {time} (w przybliżeniu).',
  },
  c: {
    kid: 'Jądro to teraz węgiel i tlen, rozgrzane prawie do miliarda stopni: jądra węgla zderzają się i tworzą neon, sód i magnez. Trwa to tylko {time}.',
    sci: 'Jądro: {T}. ¹²C + ¹²C → ²⁰Ne + α, ²³Na + p (rzadko ²³Mg + n). Odtąd neutrina unoszą więcej energii niż światło, więc każde spalanie jest krótsze od poprzedniego. Trwa {time}.',
  },
  ne: {
    kid: 'Spalanie neonu: jest tak gorąco, że samo światło rozbija jądra neonu, a z kawałków powstają tlen i magnez. Trwa to {time}.',
    sci: 'Jądro: {T}. Fotodezintegracja ²⁰Ne(γ,α)¹⁶O, potem ²⁰Ne(α,γ)²⁴Mg: w sumie 2 ²⁰Ne → ¹⁶O + ²⁴Mg. Trwa {time}.',
  },
  o: {
    kid: 'Spalanie tlenu: jądra tlenu łączą się w krzem i siarkę, z odrobiną chloru, argonu, potasu i wapnia. Trwa to {time}.',
    sci: 'Jądro: {T}. ¹⁶O + ¹⁶O → ²⁸Si + α, ³¹P + p, ³²S + γ; około 90 % masy produktów to krzem i siarka. Trwa {time}.',
  },
  si: {
    kid: 'Spalanie krzemu, ostatnie: w {time} jądro zamienia się w żelazo i nikiel. Łączenie żelaza nie daje żadnej energii, więc gwieździe nie zostaje nic do spalenia. Dotknij jądra.',
    sci: 'Jądro: {T}. To nie łączenie dwóch jąder krzemu, ale topnienie: fotodezintegracja uwalnia cząstki α, które w quasi-równowadze wspinają się do ⁵⁶Ni (Z = N = 28), ⁵⁴Fe i ⁵⁶Fe. Jądra grupy żelaza są najmocniej związane (⁶²Ni 8,795 MeV na nukleon, ⁵⁶Fe 8,790): łączenie poza nie kosztuje energię. Trwa {time}.',
  },
  ends: {
    fade: {
      kid: 'Czerwony karzeł nigdy nie puchnie w olbrzyma: gdy zużyje wodór, po około {life}, robi się gorętszy i bardziej niebieski i kurczy się w białego karła z helu.',
      sci: 'W pełni konwektywny, spala prawie cały swój wodór (Laughlin, Bodenheimer i Adams 1997): niebieski karzeł, potem helowy biały karzeł. Jego życie, {life}, jest dużo dłuższe niż 13,8 miliarda lat Wszechświata.',
    },
    pn: {
      kid: 'Zewnętrzne warstwy odpływają jako świecąca mgławica planetarna i niosą węgiel, azot i powoli zrobione ciężkie pierwiastki w kosmos, dla nowych gwiazd i planet. Zostaje biały karzeł, gorące jądro wielkości Ziemi.',
      sci: 'Superwiatr i mgławica planetarna (świeci około 10⁴ lat); pozostałość to węglowo-tlenowy biały karzeł o masie od 0,5 do około 1,1 masy Słońca (Słońce: około 0,54), podtrzymywany przez degenerację elektronów, stygnący miliardy lat.',
    },
    one: {
      kid: 'Zrzuca warstwy i zostawia białego karła z tlenu i neonu. Niektóre gwiazdy tej wielkości zamiast tego wybuchają: astronomowie wciąż sprawdzają, które.',
      sci: 'Gwiazda super-AGB: biały karzeł O-Ne-Mg o masie około 1,2 do 1,4 masy Słońca albo, jeśli wygrają wychwyty elektronów na ²⁴Mg i ²⁰Ne, supernowa z wychwytu elektronów. Granica, około 8 do 10 mas Słońca, wciąż jest badana.',
    },
    sn: {
      kid: 'Żelazne jądro zapada się w mniej niż sekundę. Reszta gwiazdy odbija się od niego i zostaje wyrzucona jako supernowa, przez tygodnie jaśniejsza niż cała galaktyka, rozrzucając wszystko, co zrobiła; a w samym wybuchu powstają nowe pierwiastki.',
      sci: 'Zapadnięcie jądra (spadek z prędkością do jednej czwartej prędkości światła) w protogwiazdę neutronową; około 10⁴⁶ J, 99 % w neutrinach (SN 1987A: około dwóch tuzinów złapanych na Ziemi); fala uderzeniowa zrywa otoczkę z energią około 10⁴⁴ J. Wybuchowe spalanie tworzy nikiel-56, który rozpada się przez kobalt-56 (77 dni) w żelazo-56: blask kolejnych miesięcy.',
    },
    ns: {
      kid: 'Zostaje gwiazda neutronowa, ciężka jak Słońce i szeroka tylko na 20 km. Dotknij jej: znajdź jej parę.',
      sci: 'Pozostałość: gwiazda neutronowa o masie około 1,4 masy Słońca i średnicy 20 km, szybko wirująca (pulsar). Dwie takie na orbicie kiedyś się zderzą: dotknij jej.',
    },
    bh: {
      kid: 'Zostaje czarna dziura, tak ciężka i mała, że nawet światło nie może się wydostać. Dotknij jej, żeby zacząć nową gwiazdę.',
      sci: 'Powyżej około 20 mas Słońca jądro często staje się czarną dziurą, przez opadanie materii albo od razu (nieudana supernowa); które gwiazdy tak kończą, wciąż jest badane (Sukhbold i in. 2016).',
    },
  },
  prompt: {
    light: 'Dotknij jądra gwiazdy, żeby ją zapalić',
    next: 'Dotknij jądra: {next}',
    die: 'Dotknij jądra: skończyło się ostatnie paliwo',
    shell: 'albo dotknij świecącej powłoki helowej',
    wd: 'Dotknij białego karła, żeby zrobić nową gwiazdę',
    ns: 'Dotknij gwiazdy neutronowej: znajdź jej parę',
    bh: 'Dotknij czarnej dziury, żeby zacząć od nowa',
    pick: 'Dotknij gwiazdy na dole, żeby wybrać inną',
    slow: 'Dotknij jądra, żeby dać mu neutron',
    merge: 'Dotknij dwóch gwiazd neutronowych',
    wait: 'Patrz: powódź neutronów',
    cool: 'Dotknij świecącej chmury, żeby ostygła',
    again: 'Dotknij chmury, żeby zderzyć kolejne',
  },
  nextPhase: { h: 'zapal wodór', rg: 'kończy się wodór', he: 'zapal hel', agb: 'starzeje się', c: 'zapal węgiel', ne: 'zapal neon', o: 'zapal tlen', si: 'zapal krzem' },
  slow: {
    intro: {
      kid: 'W starym olbrzymie, w cienkiej warstwie helu: jądro żelaza, zrobione dawno temu przez inne gwiazdy. Latają tu neutrony, ale powoli: jeden przychodzi mniej więcej co sto lat. Dotknij jądra, żeby dać mu neutron.',
      sci: 'Warstwa między powłokami gwiazdy AGB, blisko 10⁸ K: ¹³C(α,n)¹⁶O daje około 10⁸ neutronów na cm³, więc jądro łapie jeden mniej więcej raz na stulecie (1/(nσv) przy σ ≈ 100 mb). Zarodek: żelazo-56. Tu jądro, które rozpadłoby się szybciej, najpierw się rozpada; trwalsze łapie następny neutron (prawdziwe punkty rozgałęzienia, jak krypton-85, idą w obie strony).',
    },
    caught: { kid: 'Złapało neutron: {iso}. Trwa dość długo, żeby poczekać na następny.', sci: '{iso}: wychwyt n; {life}, dłużej niż stulecie do następnego neutronu.' },
    stable: { kid: 'Złapało neutron: {iso}, trwałe jądro. Czeka na następny.', sci: '{iso}: wychwyt n; trwałe.' },
    beta: { kid: '{from} nie mogło czekać: jeden z jego neutronów zmienił się w proton i wystrzelił elektron. Teraz to {to}: nowy pierwiastek!', sci: '{from} → {to} przez rozpad β⁻ ({life}), przed następnym neutronem.' },
    capture: { kid: '{from} złapało jeden ze swoich elektronów i proton znów stał się neutronem: teraz to {to}.', sci: '{from} → {to} przez wychwyt elektronu ({life}).' },
    alpha: { kid: '{from} wyrzuciło jądro helu: z powrotem {to}. Powolna droga nie zajdzie dalej: ołów i bizmut krążą w kółko.', sci: '{from} → {to} przez rozpad α (138 dni): ²⁰⁹Bi(n,γ)²¹⁰Bi(β⁻)²¹⁰Po(α)²⁰⁶Pb, cykl kończący proces s.' },
    tc: 'Technet! Żaden atom technetu nie trwa wiecznie, a jednak astronomowie widzą go w starych olbrzymach (Paul Merrill, 1952): musi powstawać w ich wnętrzu. To był pierwszy dowód, że gwiazdy tworzą pierwiastki.',
  },
  rapid: {
    orbit: {
      kid: 'Dwie gwiazdy neutronowe, każda cięższa od Słońca i szeroka tylko na 20 km, krążą wokół siebie coraz szybciej. Dotknij ich, żeby je zbliżyć.',
      sci: 'Podwójna gwiazda neutronowa traci energię orbity na fale grawitacyjne, jak GW170817, zarejestrowana przez LIGO i Virgo 17 sierpnia 2017, 130 milionów lat świetlnych stąd (z błyskiem gamma 1,7 s później).',
    },
    merge: { kid: 'Zderzają się! Sama przestrzeń drży (fale grawitacyjne), a wylatuje chmura materii pełnej neutronów.', sci: 'Zlanie: materia wyrzucona przez pływy i wiatr z dysku, bardzo bogata w neutrony (mało protonów na neutron), z prędkością 0,1 do 0,3 prędkości światła.' },
    flood: {
      kid: 'Powódź neutronów: jądro puchnie daleko poza wszystko, co trwałe, łapie neutron za neutronem, a od czasu do czasu neutron zmienia się w proton. W około sekundę wspina się aż do plutonu.',
      sci: 'n > 10²⁰ cm⁻³, wobec 10⁸ w procesie s: wychwyty dużo szybsze niż rozpady β, więc ścieżka biegnie wzdłuż bogatej w neutrony krawędzi (tu najbogatsze w neutrony jądra, jakie kiedykolwiek zrobiono w laboratorium; prawdziwa ścieżka leży jeszcze dalej), z punktami oczekiwania przy N = 50, 82, 126. Najcięższe jądra się rozszczepiają.',
    },
    cool: { kid: 'Neutrony się skończyły. Każde napuchnięte jądro zaraz rozpadnie się z powrotem w stronę trwałych. Dotknij chmury.', sci: 'Wymrożenie: neutrony się wyczerpały; rozpady β (z opóźnionymi neutronami, a dla najcięższych rozpady α) prowadzą każde jądro do trwałego izobaru jego liczby masowej.' },
    done: {
      kid: 'Złoto, platyna, uran i w sumie {count} pierwiastków! Chmura świeci na czerwono przez wiele dni (kilonowa): astronomowie widzieli ją w 2017 i znaleźli w jej świetle stront. To jedno zderzenie zrobiło złota na kilka Ziem.',
      sci: '{count} pierwiastków: trwałe (albo dłuższe niż 500 milionów lat) końce łańcuchów rozpadów β, z maksimami przy A = 80, 130 i 195. Kilonowa AT2017gfo: 0,03 do 0,05 masy Słońca materii z procesu r; zidentyfikowany w niej stront (Watson i in. 2019); od kilku do dziesięciu mas Ziemi złota, według oszacowań.',
    },
  },
  table: {
    made: 'Co zrobiłeś',
    origins: 'Skąd się wzięły atomy',
    madeKid: 'Każdy pierwiastek, który powstał, zapala się w kolorze miejsca, gdzie go zrobiono. Pierwsze trzy dał Wielki Wybuch.',
    madeSci: 'Zapalone przez spalania, śmierci gwiazd i wychwyty uruchomione tutaj; w kolorze źródła, jak na wykresie Johnson.',
    originsKid: 'Gdzie powstały atomy każdego pierwiastka Układu Słonecznego, według wykresu Jennifer Johnson.',
    originsSci: 'Udziały według J. A. Johnson (Science 363, 474, 2019), odczytane z jej wykresu z 2017 (Wikimedia Commons): przybliżone, o kilka procent w górę lub w dół. Szary: brak trwałego izotopu.',
    body: 'Ty, według masy',
    bodyKid: 'Dwie trzecie ciebie to tlen z wybuchających masywnych gwiazd. Wodór to jedna dziesiąta twojej wagi, ale sześć na dziesięć twoich atomów, i jest stary jak Wszechświat: pochodzi z Wielkiego Wybuchu.',
    bodySci: 'Ciało o masie 70 kg (O 65 %, C 18 %, H 10 %, N 3 %, Ca 1,5 %, P 1 %, dalej K, S, Na, Cl, Mg), każdy pierwiastek rozdzielony na źródła według wykresu Johnson.',
    count: '{n} z 118 pierwiastków',
  },
  sources: { bigbang: 'Wielki Wybuch', cosmic: 'Promienie kosmiczne', lowmass: 'Umierające małe gwiazdy', massive: 'Wybuchające masywne gwiazdy', whitedwarf: 'Wybuchające białe karły', merger: 'Zderzenia gwiazd neutronowych', people: 'Zrobione przez ludzi' },
  binding: {
    title: 'Dlaczego żelazo to koniec',
    kid: 'Jak mocno trzyma się każdy rodzaj jądra. Łączenie małych jąder wspina się po zboczu i daje energię; za szczytem, przy żelazie i niklu, robienie większych jąder kosztuje energię.',
    sci: 'Energia wiązania na nukleon (masy AME, przez mendeleev): ⁴He 7,07, ¹²C 7,68, ¹⁶O 7,98, ⁵⁶Fe 8,790, ⁶²Ni 8,795 MeV (szczyt), ²³⁸U 7,57. Synteza aż do szczytu uwalnia energię; rozszczepienie od ciężkiej strony też.',
    axis: 'MeV na nukleon',
    mass: 'liczba masowa',
  },
  missions: 'Misje gwiazd',
  missionDone: 'Misja wykonana!',
  cooler: 'poniżej 15,7 miliona K Słońca',
  restart: 'Zacznij od żelaza',
  more: 'więcej...',
  chart: 'Droga na mapie nuklidów',
  chartKid: 'Każdy rodzaj jądra: protony w górę, neutrony w bok. Białe: trwałe. Linia to droga twojego jądra.',
  chartSci: 'Z w górę, N w bok; białe trwałe nuklidy, szare znane promieniotwórcze; przerywane linie to liczby magiczne 50, 82, 126.',
  tools: { table: 'Układ', chart: 'Mapa', curve: 'Czemu żelazo' },
}

const DE = {
  title: 'Sternenschmiede',
  place: { star: 'Das Leben eines Sterns', slow: 'Der langsame Fang', rapid: 'Der schnelle Fang' },
  placeTip: {
    star: 'Wähl einen Stern und erlebe sein Leben, Brennen für Brennen',
    slow: 'In einem alten Riesen: Neutronen, eins nach dem anderen gefangen',
    rapid: 'Zwei Neutronensterne verschmelzen: eine Flut von Neutronen',
  },
  nursery: { red: 'Roter Zwerg', sun: 'Sonne', three: '3 Sonnen', fifteen: '15 Sonnen', blue: '25 Sonnen' },
  names: { red: 'Ein Roter Zwerg', sun: 'Die Sonne', three: 'Ein Stern von 3 Sonnen', fifteen: 'Ein Stern von 15 Sonnen', blue: 'Ein Blauer Riese von 25 Sonnen' },
  starOf: 'Ein Stern von {m}',
  mass: 'Masse',
  life: 'Sein Leben',
  age: 'Alter',
  core: 'Kern',
  rate: 'Neutronen',
  rateOff: 'eins pro Tippen',
  rateOn: 'ein steter Regen',
  phase: { proto: 'Leuchtet noch nicht', h: 'Wasserstoffbrennen', rg: 'Ein Roter Riese', he: 'Heliumbrennen', agb: 'Ein alter Riese', c: 'Kohlenstoffbrennen', ne: 'Neonbrennen', o: 'Sauerstoffbrennen', si: 'Siliciumbrennen', dead: 'Sein Ende' },
  proto: {
    kid: 'Eine Gaskugel, von ihrem eigenen Gewicht zusammengedrückt, in der Mitte immer heißer. Tipp auf ihren Kern, um sie zu zünden: Der Wasserstoff beginnt zu verschmelzen.',
    sci: 'Ein Protostern, der sich auf der Kelvin-Helmholtz-Zeitskala zusammenzieht; Wasserstoff zündet bei etwa 10 Millionen K. Unter 0,08 Sonnen nie (ein Brauner Zwerg).',
  },
  summary: '{name} lebt etwa {life}. Er macht {makes}, und dann {end}.',
  endShort: { fade: 'schrumpft er zu einem Weißen Zwerg', pn: 'bläst er seine Hüllen weg und hinterlässt einen Weißen Zwerg', one: 'hinterlässt er einen Weißen Zwerg aus Sauerstoff und Neon (oder explodiert)', sn: 'explodiert er als Supernova' },
  notYet: 'Das Universum ist erst 13,8 Milliarden Jahre alt: Noch kein Stern wie dieser ist gestorben.',
  h: {
    pp: {
      kid: 'Sein Kern presst Wasserstoff zu Helium: Vier Wasserstoffkerne werden ein Heliumkern, und ein wenig ihrer Masse wird zu Licht. Die Sonne macht das mit 600 Millionen Tonnen Wasserstoff in jeder Sekunde. Das dauert {time}.',
      sci: 'Kern {T}: die Proton-Proton-Kette. p + p → d + e⁺ + ν (der langsame Schritt: Ein Proton wartet Milliarden Jahre darauf), d + p → ³He + γ, ³He + ³He → ⁴He + 2p. Insgesamt 4 ¹H → ⁴He + 2e⁺ + 2ν + 26,7 MeV: 0,7 % der Masse wird Energie. Dauer {time}.',
    },
    cno: {
      kid: 'Sein Kern ist heißer als der der Sonne, darum helfen Kohlenstoff, Stickstoff und Sauerstoff mit: Sie fangen Protonen, eins nach dem anderen, und geben Helium zurück. Unterwegs häufen sie Stickstoff an, wie den Stickstoff in der Luft, die du atmest. Das dauert {time}.',
      sci: 'Kern {T}: der CNO-Zyklus. ¹²C fängt nacheinander vier Protonen (über ¹³N, ¹³C, ¹⁴N, ¹⁵O, ¹⁵N) und gibt ¹²C + ⁴He zurück; sein langsamster Schritt, ¹⁴N + p, häuft Stickstoff an. Über etwa 1,3 Sonnen schlägt er die Proton-Proton-Kette (in der Sonne liefert er etwa 1 %, Borexino 2020). Dauer {time}.',
    },
    dwarf: 'Ein Roter Zwerg verbraucht seinen Wasserstoff so langsam, dass er etwa {time} lebt: viel länger, als es das Universum gibt.',
  },
  rg: {
    kid: 'Im Kern ist der Wasserstoff aus. Wasserstoff brennt in einer Schale um ihn herum weiter, und der Stern bläht sich zu einem Roten Riesen auf (die Sonne wird etwa 250-mal breiter und verschluckt Merkur und Venus). Das dauert {time}.',
    sci: 'Kernwasserstoff erschöpft: Der Heliumkern zieht sich zusammen und heizt sich auf, während eine wasserstoffbrennende Schale die Hülle nach außen drückt; die Sonne erreicht an der Spitze des Roten-Riesen-Asts etwa 256 Sonnenradien. Dauer {time} (genähert: von der Sonne hochgerechnet).',
  },
  he: {
    low: {
      kid: 'Der Kern ist jetzt heiß genug (100 Millionen Grad), um Helium zu verschmelzen: Drei Heliumkerne werden ein Kohlenstoffkern, und Kohlenstoff mit Helium wird Sauerstoff. Der Kohlenstoff in dir ist so entstanden. Das dauert {time}.',
      sci: 'Kern {T}: der Drei-Alpha-Prozess, ⁴He + ⁴He ⇌ ⁸Be (es lebt 8 × 10⁻¹⁷ s), ⁸Be + ⁴He → ¹²C über den Hoyle-Zustand bei 7,65 MeV; dann ¹²C + ⁴He → ¹⁶O + γ. In einem Stern wie der Sonne beginnt er mit dem Heliumblitz in einem Kern aus entartetem Helium. Dauer {time}.',
    },
    big: {
      kid: 'Ein schwerer Stern brennt auch Helium, viel schneller: Kohlenstoff und Sauerstoff sammeln sich im Kern, während er sich zu einem Roten Überriesen aufbläht. Das dauert {time}.',
      sci: 'Kern {T}: Drei-Alpha-Prozess und ¹²C(α,γ)¹⁶O, der Stern ein Roter Überriese; das übrige Verhältnis von Kohlenstoff zu Sauerstoff bestimmt alles Weitere. Dauer {time}.',
    },
    link: 'Sieh dir den Drei-Alpha-Prozess aus der Nähe an: der Raum des Kohlenstoffs „Gemacht in einem Riesenstern“',
  },
  agb: {
    kid: 'Ein alter Riese: Helium und Wasserstoff brennen in dünnen Schalen um einen Kern aus Kohlenstoff und Sauerstoff und flammen alle paar Zehntausend Jahre auf. In der Heliumschale fliegen freie Neutronen, und Eisenkerne fangen sie und wachsen langsam zu schwereren Elementen. Tipp auf die leuchtende Heliumschale, um zuzusehen. Das dauert {time}.',
    sci: 'Der asymptotische Riesenast: Zweischalenbrennen mit thermischen Pulsen (Heliumschalenblitze alle 10⁴ bis 10⁵ Jahre); dazwischen liefert ¹³C(α,n)¹⁶O etwa 10⁸ Neutronen pro cm³ (der s-Prozess). Durchmischungen bringen Kohlenstoff und die neuen Elemente nach oben: Technetium, das kein stabiles Isotop hat, sieht man in solchen Sternen (Merrill 1952). Dauer {time} (genähert).',
  },
  c: {
    kid: 'Der Kern ist jetzt Kohlenstoff und Sauerstoff und fast eine Milliarde Grad heiß: Kohlenstoffkerne prallen zusammen und werden Neon, Natrium und Magnesium. Das dauert nur {time}.',
    sci: 'Kern {T}: ¹²C + ¹²C → ²⁰Ne + α, ²³Na + p (selten ²³Mg + n). Von nun an tragen Neutrinos mehr Energie fort als das Licht, darum ist jedes Brennen kürzer als das vorige. Dauer {time}.',
  },
  ne: {
    kid: 'Neonbrennen: Es ist so heiß, dass das Licht selbst Neonkerne zerbricht, und aus den Stücken entstehen Sauerstoff und Magnesium. Das dauert {time}.',
    sci: 'Kern {T}: Photodesintegration ²⁰Ne(γ,α)¹⁶O, dann ²⁰Ne(α,γ)²⁴Mg: insgesamt 2 ²⁰Ne → ¹⁶O + ²⁴Mg. Dauer {time}.',
  },
  o: {
    kid: 'Sauerstoffbrennen: Sauerstoffkerne verschmelzen zu Silicium und Schwefel, mit etwas Chlor, Argon, Kalium und Calcium. Das dauert {time}.',
    sci: 'Kern {T}: ¹⁶O + ¹⁶O → ²⁸Si + α, ³¹P + p, ³²S + γ; etwa 90 % der Produkte (nach Masse) sind Silicium und Schwefel. Dauer {time}.',
  },
  si: {
    kid: 'Siliciumbrennen, das letzte: In {time} wird der Kern zu Eisen und Nickel. Eisen zu verschmelzen bringt überhaupt keine Energie, darum hat der Stern nichts mehr zu verbrennen. Tipp auf den Kern.',
    sci: 'Kern {T}: keine Verschmelzung zweier Siliciumkerne, sondern ein Schmelzen: Photodesintegration setzt α-Teilchen frei, die im Quasigleichgewicht bis zu ⁵⁶Ni (Z = N = 28), ⁵⁴Fe und ⁵⁶Fe aufsteigen. Kerne der Eisengruppe sind am stärksten gebunden (⁶²Ni 8,795 MeV pro Nukleon, ⁵⁶Fe 8,790): Fusion über sie hinaus kostet Energie. Dauer {time}.',
  },
  ends: {
    fade: {
      kid: 'Ein Roter Zwerg bläht sich nie zu einem Riesen auf: Wenn sein Wasserstoff nach etwa {life} verbraucht ist, wird er heißer und blauer und schrumpft zu einem Weißen Zwerg aus Helium.',
      sci: 'Vollständig konvektiv verbrennt er fast seinen ganzen Wasserstoff (Laughlin, Bodenheimer und Adams 1997): ein Blauer Zwerg, dann ein Weißer Zwerg aus Helium. Sein Leben, {life}, ist viel länger als die 13,8 Milliarden Jahre des Universums.',
    },
    pn: {
      kid: 'Seine äußeren Schichten treiben als leuchtender Planetarischer Nebel davon und tragen Kohlenstoff, Stickstoff und die langsam gemachten schweren Elemente ins All, für neue Sterne und Planeten. Zurück bleibt ein Weißer Zwerg, ein heißer Kern so groß wie die Erde.',
      sci: 'Ein Superwind und ein Planetarischer Nebel (er leuchtet etwa 10⁴ Jahre); der Rest ein Weißer Zwerg aus Kohlenstoff und Sauerstoff von 0,5 bis etwa 1,1 Sonnen (die Sonne: etwa 0,54), gehalten vom Entartungsdruck der Elektronen, der Milliarden Jahre lang abkühlt.',
    },
    one: {
      kid: 'Er wirft seine Schichten ab und hinterlässt einen Weißen Zwerg aus Sauerstoff und Neon. Manche Sterne dieser Größe explodieren stattdessen: Die Astronomen finden noch heraus, welche.',
      sci: 'Ein Super-AGB-Stern: ein O-Ne-Mg-Weißer-Zwerg von etwa 1,2 bis 1,4 Sonnen, oder, wenn Elektroneneinfänge an ²⁴Mg und ²⁰Ne gewinnen, eine Elektroneneinfang-Supernova. Die Grenze, etwa 8 bis 10 Sonnen, wird noch erforscht.',
    },
    sn: {
      kid: 'Der Eisenkern stürzt in weniger als einer Sekunde zusammen. Der Rest des Sterns prallt an ihm ab und fliegt als Supernova davon, wochenlang heller als eine ganze Galaxie, und wirft alles hinaus, was er gemacht hat; und in der Explosion selbst entstehen neue Elemente.',
      sci: 'Kernkollaps (Einfall mit bis zu einem Viertel der Lichtgeschwindigkeit) zu einem Proto-Neutronenstern; etwa 10⁴⁶ J, 99 % als Neutrinos (SN 1987A: etwa zwei Dutzend auf der Erde eingefangen); die Stoßwelle sprengt die Hülle mit etwa 10⁴⁴ J ab. Explosives Brennen macht Nickel-56, das über Cobalt-56 (77 Tage) zu Eisen-56 zerfällt: das Leuchten der folgenden Monate.',
    },
    ns: {
      kid: 'Zurück bleibt ein Neutronenstern, so schwer wie die Sonne und nur 20 km breit. Tipp darauf: Such ihm einen Partner.',
      sci: 'Der Rest: ein Neutronenstern von etwa 1,4 Sonnen und 20 km, der sich schnell dreht (ein Pulsar). Zwei davon in einer Umlaufbahn verschmelzen eines Tages: Tipp darauf.',
    },
    bh: {
      kid: 'Zurück bleibt ein Schwarzes Loch, so schwer und klein, dass nicht einmal Licht herauskommt. Tipp darauf, um einen neuen Stern zu beginnen.',
      sci: 'Über etwa 20 Sonnen wird der Kern oft ein Schwarzes Loch, durch zurückfallende Materie oder direkt (eine gescheiterte Supernova); welche Sterne das tun, wird noch erforscht (Sukhbold u. a. 2016).',
    },
  },
  prompt: {
    light: 'Tipp auf den Kern des Sterns, um ihn zu zünden',
    next: 'Tipp auf den Kern: {next}',
    die: 'Tipp auf den Kern: sein letzter Brennstoff ist aus',
    shell: 'oder tipp auf die leuchtende Heliumschale',
    wd: 'Tipp auf den Weißen Zwerg, um einen neuen Stern zu machen',
    ns: 'Tipp auf den Neutronenstern: Such ihm einen Partner',
    bh: 'Tipp auf das Schwarze Loch, um neu zu beginnen',
    pick: 'Tipp unten auf einen Stern, um einen anderen zu wählen',
    slow: 'Tipp auf den Kern, um ihm ein Neutron zu geben',
    merge: 'Tipp auf die zwei Neutronensterne',
    wait: 'Sieh zu: die Flut von Neutronen',
    cool: 'Tipp auf die leuchtende Wolke, damit sie abkühlt',
    again: 'Tipp auf die Wolke für eine neue Verschmelzung',
  },
  nextPhase: { h: 'Wasserstoff zünden', rg: 'der Wasserstoff geht aus', he: 'Helium zünden', agb: 'er wird alt', c: 'Kohlenstoff zünden', ne: 'Neon zünden', o: 'Sauerstoff zünden', si: 'Silicium zünden' },
  slow: {
    intro: {
      kid: 'In einem alten Riesen, in einer dünnen Heliumschicht: ein Eisenkern, vor langer Zeit von Sternen gemacht. Hier fliegen Neutronen, aber langsam: etwa alle hundert Jahre kommt eins vorbei. Tipp auf den Kern, um ihm eins zu geben.',
      sci: 'Die Zwischenschale eines AGB-Sterns, nahe 10⁸ K: ¹³C(α,n)¹⁶O liefert etwa 10⁸ Neutronen pro cm³, also fängt ein Kern etwa einmal pro Jahrhundert eins (1/(nσv) mit σ ≈ 100 mb). Saatkern: Eisen-56. Hier zerfällt ein Kern, der früher zerfallen würde, zuerst; einer, der länger lebt, fängt das nächste Neutron (echte Verzweigungspunkte wie Krypton-85 gehen beide Wege).',
    },
    caught: { kid: 'Er hat ein Neutron gefangen: {iso}. Er hält lange genug, um auf das nächste zu warten.', sci: '{iso}: n-Einfang; {life}, länger als das Jahrhundert bis zum nächsten Neutron.' },
    stable: { kid: 'Er hat ein Neutron gefangen: {iso}, ein stabiler Kern. Er wartet auf das nächste.', sci: '{iso}: n-Einfang; stabil.' },
    beta: { kid: '{from} konnte nicht warten: Eins seiner Neutronen wurde zu einem Proton und schoss ein Elektron heraus. Jetzt ist es {to}: ein neues Element!', sci: '{from} → {to} durch β⁻-Zerfall ({life}), vor dem nächsten Neutron.' },
    capture: { kid: '{from} hat eins seiner eigenen Elektronen geschnappt, und ein Proton wurde wieder ein Neutron: Jetzt ist es {to}.', sci: '{from} → {to} durch Elektroneneinfang ({life}).' },
    alpha: { kid: '{from} hat einen Heliumkern hinausgeworfen: zurück zu {to}. Weiter kommt der langsame Weg nicht: Blei und Bismut drehen sich im Kreis.', sci: '{from} → {to} durch α-Zerfall (138 Tage): ²⁰⁹Bi(n,γ)²¹⁰Bi(β⁻)²¹⁰Po(α)²⁰⁶Pb, der Kreislauf, mit dem der s-Prozess endet.' },
    tc: 'Technetium! Kein Technetiumatom hält ewig, und doch sehen Astronomen es in alten Riesen (Paul Merrill, 1952): Es muss in ihnen gemacht werden. Das war der erste Beweis, dass Sterne Elemente machen.',
  },
  rapid: {
    orbit: {
      kid: 'Zwei Neutronensterne, jeder schwerer als die Sonne und nur 20 km breit, kreisen immer schneller umeinander. Tipp auf sie, um sie zusammenzubringen.',
      sci: 'Ein Doppel-Neutronenstern, der Bahnenergie als Gravitationswellen verliert, wie GW170817, gesehen von LIGO und Virgo am 17. August 2017, 130 Millionen Lichtjahre entfernt (mit einem Gammablitz 1,7 s danach).',
    },
    merge: { kid: 'Sie prallen zusammen! Der Raum selbst bebt (Gravitationswellen), und eine Wolke voller Neutronen fliegt hinaus.', sci: 'Verschmelzung: Gezeiten- und Scheibenwind-Auswurf, sehr neutronenreich (wenige Protonen pro Neutron), mit 0,1 bis 0,3 der Lichtgeschwindigkeit.' },
    flood: {
      kid: 'Eine Flut von Neutronen: Der Kern schwillt weit über alles Stabile hinaus, fängt Neutron um Neutron, und ab und zu wird ein Neutron zu einem Proton. In etwa einer Sekunde klettert er bis zum Plutonium.',
      sci: 'n > 10²⁰ cm⁻³, gegen 10⁸ im s-Prozess: Einfänge viel schneller als β-Zerfälle, darum läuft der Pfad an der neutronenreichen Kante entlang (hier die neutronenreichsten Kerne, die je im Labor gemacht wurden; der echte Pfad liegt noch weiter draußen), mit Wartepunkten bei N = 50, 82, 126. Die schwersten Kerne spalten sich.',
    },
    cool: { kid: 'Die Neutronen sind verbraucht. Jeder aufgeblähte Kern zerfällt gleich zurück zu den stabilen. Tipp auf die Wolke.', sci: 'Ausfrieren: Die Neutronen sind erschöpft; β-Zerfälle (mit verzögerten Neutronen, bei den schwersten α-Zerfälle) bringen jeden Kern zum stabilen Isobar seiner Massenzahl.' },
    done: {
      kid: 'Gold, Platin, Uran und insgesamt {count} Elemente! Die Wolke glüht tagelang rot (eine Kilonova): Astronomen haben sie 2017 gesehen und Strontium in ihrem Licht gefunden. Dieser eine Zusammenstoß hat Gold für mehrere Erden gemacht.',
      sci: '{count} Elemente: die stabilen (oder über 500 Millionen Jahre langlebigen) Enden jeder β-Zerfallskette, mit Maxima nahe A = 80, 130 und 195. Die Kilonova AT2017gfo: 0,03 bis 0,05 Sonnen r-Prozess-Auswurf; Strontium darin nachgewiesen (Watson u. a. 2019); einige bis zehn Erdmassen Gold, je nach Schätzung.',
    },
  },
  table: {
    made: 'Was du gemacht hast',
    origins: 'Woher die Atome kommen',
    madeKid: 'Jedes Element, das du gemacht hast, leuchtet auf, in der Farbe des Ortes, wo es entstand. Die ersten drei gab der Urknall.',
    madeSci: 'Entzündet durch die Brennphasen, Sternentode und Einfänge, die du hier ausgelöst hast; gefärbt nach der Quelle, wie auf Johnsons Tafel.',
    originsKid: 'Wo die Atome jedes Elements im Sonnensystem gemacht wurden, nach der Tafel von Jennifer Johnson.',
    originsSci: 'Anteile nach J. A. Johnson (Science 363, 474, 2019), abgelesen von ihrer Tafel von 2017 (Wikimedia Commons): genähert, ein paar Prozent mehr oder weniger. Grau: kein stabiles Isotop.',
    body: 'Du, nach Masse',
    bodyKid: 'Zwei Drittel von dir sind Sauerstoff aus explodierenden massereichen Sternen. Der Wasserstoff ist ein Zehntel deines Gewichts, aber sechs von zehn deiner Atome, und er ist so alt wie das Universum: aus dem Urknall.',
    bodySci: 'Ein Körper von 70 kg nach Masse (O 65 %, C 18 %, H 10 %, N 3 %, Ca 1,5 %, P 1 %, dann K, S, Na, Cl, Mg), jedes Element nach seinen Quellen auf Johnsons Tafel aufgeteilt.',
    count: '{n} von 118 Elementen',
  },
  sources: { bigbang: 'Der Urknall', cosmic: 'Kosmische Strahlung', lowmass: 'Sterbende kleine Sterne', massive: 'Explodierende massereiche Sterne', whitedwarf: 'Explodierende Weiße Zwerge', merger: 'Verschmelzende Neutronensterne', people: 'Von Menschen gemacht' },
  binding: {
    title: 'Warum Eisen das Ende ist',
    kid: 'Wie fest jede Art von Kern zusammenhält. Kleine Kerne zu verschmelzen geht den Hang hinauf und bringt Energie; hinter dem Gipfel, bei Eisen und Nickel, kostet es Energie, größere Kerne zu machen.',
    sci: 'Bindungsenergie pro Nukleon (AME-Massen, über mendeleev): ⁴He 7,07, ¹²C 7,68, ¹⁶O 7,98, ⁵⁶Fe 8,790, ⁶²Ni 8,795 MeV (der Gipfel), ²³⁸U 7,57. Fusion bis zum Gipfel setzt Energie frei, Spaltung von der schweren Seite auch.',
    axis: 'MeV pro Nukleon',
    mass: 'Massenzahl',
  },
  missions: 'Sternmissionen',
  missionDone: 'Mission erfüllt!',
  cooler: 'unter den 15,7 Millionen K der Sonne',
  restart: 'Neu beim Eisen beginnen',
  more: 'mehr...',
  chart: 'Der Weg auf der Nuklidkarte',
  chartKid: 'Jede Art von Kern: Protonen nach oben, Neutronen zur Seite. Weiß: stabil. Die Linie ist der Weg deines Kerns.',
  chartSci: 'Z nach oben, N zur Seite; weiß die stabilen Nuklide, grau die bekannten radioaktiven; gestrichelt die magischen Zahlen 50, 82, 126.',
  tools: { table: 'Die Tafel', chart: 'Die Karte', curve: 'Warum Eisen' },
}

export const WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
export const wordsOf = lang => WORDS[lang] ?? EN

/** Text at the reader's depth from { kid, sci } (or a plain string). */
export const at = (entry, level) => (entry == null ? '' : typeof entry === 'string' ? entry : (level === 'scientist' ? entry.sci : entry.kid) ?? entry.kid ?? entry.sci)

/** "iron-56" (the forge's isotope name, without its specials). */
export const isoName = (Z, N, lang) => `${nm(Z, lang)}-${Z + N}`

/** The missions (discoveries `stars:<id>`): check(ev, state) on each event the visitor caused. */
export const MISSIONS = [
  {
    id: 'sun', check: ev => ev.type === 'phase' && ev.id === 'h' && Math.abs(ev.m - 1) < 0.15,
    name: { en: 'Light the Sun', 'pt-pt': 'Acender o Sol', pl: 'Zapal Słońce', de: 'Zünde die Sonne' },
    hint: { en: 'Tap the Sun’s core: hydrogen fuses into helium.', 'pt-pt': 'Toca no núcleo do Sol: o hidrogénio funde-se em hélio.', pl: 'Dotknij jądra Słońca: wodór łączy się w hel.', de: 'Tipp auf den Kern der Sonne: Wasserstoff verschmilzt zu Helium.' },
  },
  {
    id: 'carbon', check: ev => ev.type === 'phase' && ev.id === 'he' && ev.m < 8,
    name: { en: 'Carbon in a Sun-like star', 'pt-pt': 'Carbono numa estrela como o Sol', pl: 'Węgiel w gwieździe jak Słońce', de: 'Kohlenstoff in einem Stern wie der Sonne' },
    hint: { en: 'Take the Sun (or a star under 8 suns) to helium burning.', 'pt-pt': 'Leva o Sol (ou uma estrela abaixo de 8 sóis) até à queima do hélio.', pl: 'Doprowadź Słońce (albo gwiazdę poniżej 8 mas Słońca) do spalania helu.', de: 'Bring die Sonne (oder einen Stern unter 8 Sonnen) zum Heliumbrennen.' },
  },
  {
    id: 'nebula', check: ev => ev.type === 'end' && ev.kind === 'pn',
    name: { en: 'A planetary nebula', 'pt-pt': 'Uma nebulosa planetária', pl: 'Mgławica planetarna', de: 'Ein Planetarischer Nebel' },
    hint: { en: 'Live a Sun-like star’s whole life, to its white dwarf.', 'pt-pt': 'Vive a vida toda de uma estrela como o Sol, até à anã branca.', pl: 'Przeżyj całe życie gwiazdy jak Słońce, aż do białego karła.', de: 'Erlebe das ganze Leben eines sonnenähnlichen Sterns bis zum Weißen Zwerg.' },
  },
  {
    id: 'dwarf', check: ev => ev.type === 'end' && ev.kind === 'fade',
    name: { en: 'Outlive the universe', 'pt-pt': 'Viver mais do que o universo', pl: 'Przeżyj Wszechświat', de: 'Überlebe das Universum' },
    hint: { en: 'Take a red dwarf to its end: a trillion years.', 'pt-pt': 'Leva uma anã vermelha até ao fim: um bilião de anos.', pl: 'Doprowadź czerwonego karła do końca: bilion lat.', de: 'Bring einen Roten Zwerg an sein Ende: eine Billion Jahre.' },
  },
  {
    id: 'iron', check: ev => ev.type === 'phase' && ev.id === 'si',
    name: { en: 'Reach iron', 'pt-pt': 'Chegar ao ferro', pl: 'Dojdź do żelaza', de: 'Erreiche das Eisen' },
    hint: { en: 'A heavy star (over 10 suns) burning silicon makes an iron core.', 'pt-pt': 'Uma estrela pesada (mais de 10 sóis) a queimar silício faz um núcleo de ferro.', pl: 'Ciężka gwiazda (ponad 10 mas Słońca) spalająca krzem tworzy żelazne jądro.', de: 'Ein schwerer Stern (über 10 Sonnen), der Silicium brennt, macht einen Eisenkern.' },
  },
  {
    id: 'supernova', check: ev => ev.type === 'end' && ev.kind === 'sn',
    name: { en: 'A supernova', 'pt-pt': 'Uma supernova', pl: 'Supernowa', de: 'Eine Supernova' },
    hint: { en: 'When a heavy star’s core is iron, tap it once more.', 'pt-pt': 'Quando o núcleo de uma estrela pesada for ferro, toca-lhe mais uma vez.', pl: 'Gdy jądro ciężkiej gwiazdy jest z żelaza, dotknij go jeszcze raz.', de: 'Wenn der Kern eines schweren Sterns aus Eisen ist, tipp noch einmal darauf.' },
  },
  {
    id: 'blackhole', check: ev => ev.type === 'end' && ev.remnant === 'bh',
    name: { en: 'A black hole', 'pt-pt': 'Um buraco negro', pl: 'Czarna dziura', de: 'Ein Schwarzes Loch' },
    hint: { en: 'A star of 20 suns or more, to its end.', 'pt-pt': 'Uma estrela de 20 sóis ou mais, até ao fim.', pl: 'Gwiazda o masie 20 Słońc lub więcej, aż do końca.', de: 'Ein Stern von 20 Sonnen oder mehr, bis zu seinem Ende.' },
  },
  {
    id: 'technetium', check: ev => ev.type === 's' && ev.Z === 43,
    name: { en: 'Technetium in a giant', 'pt-pt': 'Tecnécio numa gigante', pl: 'Technet w olbrzymie', de: 'Technetium in einem Riesen' },
    hint: { en: 'Catch neutrons slowly from iron until you reach element 43.', 'pt-pt': 'Apanha neutrões devagar a partir do ferro até chegares ao elemento 43.', pl: 'Łap powoli neutrony od żelaza, aż dojdziesz do pierwiastka 43.', de: 'Fang vom Eisen aus langsam Neutronen, bis du Element 43 erreichst.' },
  },
  {
    id: 'lead', check: ev => ev.type === 's' && ev.Z === 82,
    name: { en: 'The slow way to lead', 'pt-pt': 'O caminho lento até ao chumbo', pl: 'Powolna droga do ołowiu', de: 'Der langsame Weg zum Blei' },
    hint: { en: 'About 150 neutrons, caught one by one in an old giant.', 'pt-pt': 'Cerca de 150 neutrões, apanhados um a um numa gigante velha.', pl: 'Około 150 neutronów, łapanych po jednym w starym olbrzymie.', de: 'Etwa 150 Neutronen, eins nach dem anderen in einem alten Riesen gefangen.' },
  },
  {
    id: 'gold', check: ev => ev.type === 'r' && ev.elements.includes(79),
    name: { en: 'Make gold', 'pt-pt': 'Fazer ouro', pl: 'Zrób złoto', de: 'Mach Gold' },
    hint: { en: 'Merge two neutron stars and let the cloud cool.', 'pt-pt': 'Junta duas estrelas de neutrões e deixa a nuvem arrefecer.', pl: 'Zderz dwie gwiazdy neutronowe i pozwól chmurze ostygnąć.', de: 'Lass zwei Neutronensterne verschmelzen und die Wolke abkühlen.' },
  },
  {
    id: 'table', check: (ev, s) => s.made >= 80,
    name: { en: 'Light 80 elements', 'pt-pt': 'Acender 80 elementos', pl: 'Zapal 80 pierwiastków', de: 'Bring 80 Elemente zum Leuchten' },
    hint: { en: 'Burn, explode, and catch neutrons both ways.', 'pt-pt': 'Queima, explode e apanha neutrões das duas maneiras.', pl: 'Spalaj, wysadzaj i łap neutrony na oba sposoby.', de: 'Brenne, explodiere und fang Neutronen auf beide Arten.' },
  },
  {
    id: 'you', check: ev => ev.type === 'origins',
    name: { en: 'Where your atoms came from', 'pt-pt': 'De onde vieram os teus átomos', pl: 'Skąd pochodzą twoje atomy', de: 'Woher deine Atome kommen' },
    hint: { en: 'Open the table’s second view.', 'pt-pt': 'Abre a segunda vista da tabela.', pl: 'Otwórz drugi widok układu.', de: 'Öffne die zweite Ansicht der Tafel.' },
  },
]
