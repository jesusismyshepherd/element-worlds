// The atrium's stations for any element: what the data says, in both languages and at both depths,
// plus the element's own words where they exist (content/<Symbol>.js). Each station:
// { id, title, teaser: [short lines for the wall], panel(): { title, kicker, color, blocks } }.
import { ELEMENTS, FAMILY, nameOf } from '../data/elements.js'
import { nucleus, valenceElectrons, hands } from '../chem/atom.js'
import { temperature, density, num, config } from '../ui/format.js'
import C from './C.js'
import O from './O.js'

const CONTENT = { C, O }
export const contentOf = el => CONTENT[el.symbol] ?? null

/** A text at the right depth: the scientist's where there is one, else the explorer's. */
export function pick(entry, lang, level) {
  if (!entry) return null
  const l = entry[lang] ?? entry.en
  return (level === 'scientist' ? l.sci : null) ?? l.kid ?? l.sci
}

const FEMININE = new Set(['Ag', 'Pt']) // a prata, a platina
const art = el => (FEMININE.has(el.symbol) ? 'a' : 'o')
const SHELL = 'KLMNOPQ'

const HALF_LIFE = {
  en: { ysec: 'ys', zsec: 'zs', asec: 'as', fsec: 'fs', psec: 'ps', nsec: 'ns', usec: 'µs', msec: 'ms', sec: 's', minute: 'minutes', hour: 'hours', day: 'days', year: 'years', kyear: 'thousand years', Myear: 'million years', Gyear: 'billion years', Tyear: 'trillion years' },
  'pt-pt': { ysec: 'ys', zsec: 'zs', asec: 'as', fsec: 'fs', psec: 'ps', nsec: 'ns', usec: 'µs', msec: 'ms', sec: 's', minute: 'minutos', hour: 'horas', day: 'dias', year: 'anos', kyear: 'mil anos', Myear: 'milhões de anos', Gyear: 'mil milhões de anos', Tyear: 'biliões de anos' },
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
      const list = shells.map((c, i) => `${c} in shell ${SHELL[i]}`).join(', ')
      const end = el.family === 'noble-gas'
        ? 'Its outer shell is full, so it hardly ever holds hands with anyone: that is why noble gases have no hands.'
        : h.giving
          ? `${cap(n)} usually gives away ${h.count} electron${h.count > 1 ? 's' : ''}: its Atomling holds ${h.count > 1 ? 'them' : 'it'} out in its hands.`
          : `The ${v} on the outside are the ones that hold hands with other atoms: that is why ${n} has ${h.count} hand${h.count > 1 ? 's' : ''}.`
      return `In the middle is the nucleus, with ${p} protons (red) and ${ne} neutrons (grey). Around it, ${el.z} electrons whizz in ${shells.length} shell${shells.length > 1 ? 's' : ''}: ${list}. ${end}`
    },
    stateIs: (el, n, s) => `At 20 °C ${n} is a ${s}.`,
    melts: (m, b) => `It melts at ${m} and boils at ${b}.`,
    unknownState: 'Nobody has measured it: only a few atoms of it have ever been made.',
    litre: (kg, heavier) => `A litre of it would weigh ${kg} kg, ${heavier ? 'more' : 'less'} than a litre of water (1 kg): it would ${heavier ? 'sink' : 'float'} in water.`,
    litreGas: g => `A litre of it weighs ${g} g (a litre of air: about 1.2 g).`,
    states: { solid: 'solid', liquid: 'liquid', gas: 'gas' },
    year: 'Year', who: 'By', where: 'Where', ancient: 'Ancient times', ancientText: 'Known since ancient times: nobody knows who first found it.',
    crust: (n, mg, rank) => `In every kilogram of the Earth's crust there are about ${mg} milligrams of ${n}: number ${rank} among the most common elements in the crust.`,
    synthetic: 'Made only in laboratories, a few atoms at a time.',
    trace: 'Almost none in nature: it is radioactive and slowly breaks apart.',
    crustLabel: 'In the crust', seaLabel: 'In seawater', rankLabel: 'Rank in the crust',
    usesSoon: 'The story of what it is used for is still being written.',
    family: (n, f, g, list) => `${cap(n)} is one of the ${f}. Elements in the same column have the same number of outer electrons, so they behave alike. Its column (group ${g}): ${list}.`,
    fBlock: (n, f, list) => `${cap(n)} is one of the ${f}: ${list}. They are so alike that chemists took about a century to separate them all.`,
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
  },
  'pt-pt': {
    titles: {
      identity: 'Bilhete de identidade', atom: 'Dentro do átomo', state: 'À temperatura ambiente', discovery: 'Descoberta',
      found: 'Onde se encontra', uses: 'Para que serve', family: 'A sua família', isotopes: 'Isótopos',
    },
    number: (el, n) => `O seu número é ${el.z}: todos os átomos de ${n} têm exatamente ${el.z} protões, e é isso que os torna ${n}. Muda o número de protões e tens outro elemento.`,
    atom: (el, n, p, ne, shells, v, h) => {
      const list = shells.map((c, i) => `${c} na camada ${SHELL[i]}`).join(', ')
      const end = el.family === 'noble-gas'
        ? 'A camada de fora está cheia, por isso quase nunca dá a mão a ninguém: é por isso que os gases nobres não têm mãos.'
        : h.giving
          ? `${cap(art(el))} ${n} costuma dar ${h.count} ${h.count > 1 ? 'eletrões' : 'eletrão'}: o seu Atomito estende-${h.count > 1 ? 'os' : 'o'} nas mãos.`
          : `Os ${v} de fora são os que dão a mão a outros átomos: é por isso que ${art(el)} ${n} tem ${h.count} ${h.count > 1 ? 'mãos' : 'mão'}.`
      return `No meio está o núcleo, com ${p} protões (vermelhos) e ${ne} neutrões (cinzentos). À volta giram ${el.z} eletrões em ${shells.length} ${shells.length > 1 ? 'camadas' : 'camada'}: ${list}. ${end}`
    },
    stateIs: (el, n, s) => `A 20 °C, ${art(el)} ${n} é ${art(el) === 'a' ? s.replace(/o$/, 'a') : s}.`,
    melts: (m, b) => `Funde a ${m} e ferve a ${b}.`,
    unknownState: 'Ninguém o mediu: só se fizeram uns poucos átomos.',
    litre: (kg, heavier) => `Um litro pesaria ${kg} kg, ${heavier ? 'mais' : 'menos'} do que um litro de água (1 kg): ${heavier ? 'iria ao fundo' : 'flutuaria'} na água.`,
    litreGas: g => `Um litro pesa ${g} g (um litro de ar: cerca de 1,2 g).`,
    states: { solid: 'sólido', liquid: 'líquido', gas: 'um gás' },
    year: 'Ano', who: 'Por', where: 'Onde', ancient: 'Antiguidade', ancientText: 'Conhecido desde a Antiguidade: ninguém sabe quem o encontrou primeiro.',
    crust: (n, mg, rank) => `Em cada quilograma da crosta terrestre há cerca de ${mg} miligramas de ${n}: é o ${rank}.º elemento mais comum na crosta.`,
    synthetic: 'Só se faz em laboratório, poucos átomos de cada vez.',
    trace: 'Quase não existe na natureza: é radioativo e vai-se desfazendo.',
    crustLabel: 'Na crosta', seaLabel: 'Na água do mar', rankLabel: 'Posição na crosta',
    usesSoon: 'A história dos seus usos ainda está a ser escrita.',
    family: (n, f, g, list) => `${cap(n)} pertence aos ${f}. Os elementos da mesma coluna têm o mesmo número de eletrões de fora, por isso comportam-se de maneira parecida. A sua coluna (grupo ${g}): ${list}.`,
    fBlock: (n, f, list) => `${cap(n)} é um dos ${f}: ${list}. São tão parecidos que os químicos levaram cerca de um século a separá-los todos.`,
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
  },
}

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
const TAG = { 'pt-pt': 'pt-PT', en: 'en' }

export function stationsOf(el, { lang, level, familyName }) {
  const L = T[lang] ?? T.en
  const tag = TAG[lang] ?? 'en'
  const sci = level === 'scientist'
  const n = nameOf(el, lang).toLowerCase()
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
  const halfLife = i => `${fmt(i.halfLife, 3)} ${HALF_LIFE[lang]?.[i.halfLifeUnit] ?? i.halfLifeUnit}`

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
    make('state', [el.state ? cap(L.states[el.state].replace(/^um /, '')) : '?', el.melt != null ? `${temperature(el.melt, 'explorer', tag)}` : ''], () => {
      const liquidOrSolid = el.state !== 'gas'
      const d = el.density
      return [
        { big: el.state ? cap(L.states[el.state].replace(/^um /, '')) : '?' },
        { p: el.state && el.melt != null ? `${L.stateIs(el, n, L.states[el.state])} ${L.melts(temperature(el.melt, level, tag), temperature(el.boil, level, tag))}` : L.unknownState },
        d != null && { p: liquidOrSolid ? L.litre(fmt(d, 3), d > 1) : L.litreGas(fmt(d * 1000, 3)) },
        text('stateNote') && { p: text('stateNote') },
        sci && {
          rows: [
            [L.rows.melt, temperature(el.melt, 'scientist', tag)],
            [L.rows.boil, temperature(el.boil, 'scientist', tag)],
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
          ...(el.discoverers ? [[L.who, el.discoverers]] : []),
          ...(el.discoveryPlace ? [[L.where, el.discoveryPlace]] : []),
        ],
      },
    ]),
    make('found', [el.abundance.crust != null ? `${fmt(el.abundance.crust, 3)} mg/kg` : '–'], () => {
      const mg = el.abundance.crust
      const rank = crustRank.get(el.z)
      const base = mg != null ? L.crust(n, fmt(mg, 3), rank) : el.z > 94 ? L.synthetic : L.trace
      return [
        mg != null ? { big: `${fmt(mg, 3)} mg/kg`, small: L.crustLabel } : null,
        { p: text('found') ?? base },
        text('found') && mg != null && !sci ? { p: base } : null,
        sci && {
          rows: [
            [L.crustLabel, mg != null ? `${fmt(mg, 3)} mg/kg` : '–'],
            [L.rankLabel, rank ? `${rank}.º`.replace('.º', lang === 'en' ? '' : '.º') : '–'],
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
      const members = el.block === 'f'
        ? ELEMENTS.filter(e => e.family === el.family)
        : ELEMENTS.filter(e => e.group === el.group && e.block !== 'f')
      const list = members.map(e => (sci ? `${e.symbol}` : `${nameOf(e, lang)}`)).join(', ')
      return [
        { big: familyName },
        { p: el.block === 'f' ? L.fBlock(n, familyName.toLowerCase(), list) : L.family(n, familyName.toLowerCase(), el.group, list) },
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
            `${el.symbol}-${i.A}`,
            [i.abundance ? `${fmt(i.abundance, 4)}%` : null, i.halfLife ? `${L.rows.halfLife}: ${halfLife(i)}` : i.abundance ? L.rows.stable : null].filter(Boolean).join(' · '),
          ]),
        },
      ]
    }),
  ]
}

/** What the element's Atomling says when you talk to it. */
export function greetingOf(el, lang, level) {
  const own = pick(contentOf(el)?.greeting, lang, level)
  if (own) return own
  const n = nameOf(el, lang)
  return lang === 'pt-pt'
    ? `Olá! Chamo-me ${n}. Explora o meu salão: cada painel conta uma parte da minha história.`
    : `Hi! I'm ${n}. Explore my hall: each panel tells part of my story.`
}
