// What the Atom Forge says about its electron clouds (clouds.js): where each new electron went, why an ion
// fills 3d before 4s, a rule breaker made whole, electrons spreading out before they pair, a closed shell.
// Four languages, both depths (kid: Explorer, sci: Scientist). docs/knowledge/atom-forge.md, "Clouds".
import { ELEMENTS, nameOf } from '../../data/elements.js'

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const sup = n => String(n).split('').map(c => SUP[c]).join('')
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
// the noble gases' cores, by their electrons: [Ar] stands for 1s² 2s² 2p⁶ 3s² 3p⁶
const CORES = [[86, 'Rn'], [54, 'Xe'], [36, 'Kr'], [18, 'Ar'], [10, 'Ne'], [2, 'He']]
const CORE_SUBS = {
  2: ['1s'], 10: ['1s', '2s', '2p'], 18: ['1s', '2s', '2p', '3s', '3p'], 36: ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p'],
  54: ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p'],
  86: ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p'],
}
const FULL = { s: 2, p: 6, d: 10, f: 14 }

/** A configuration as chemists write it, in filling order, a noble gas's core in brackets when every one
 *  of its subshells is full and there is more besides: Fe²⁺ "[Ar] 3d⁶", Cl⁻ "[Ne] 3s² 3p⁶". */
export function configLine(subs) {
  const e = subs.reduce((a, s) => a + s.count, 0)
  const of = Object.fromEntries(subs.map(s => [s.id, s.count]))
  const core = CORES.find(([k]) => k < e && CORE_SUBS[k].every(id => of[id] === FULL[id[1]]))
  const rest = subs.filter(s => !core || !CORE_SUBS[core[0]].includes(s.id))
  return [core ? `[${core[1]}]` : null, ...rest.map(s => `${s.id}${sup(s.count)}`)].filter(Boolean).join(' ')
}
/** The same for a list of { id, count } (a rule breaker's two arrangements, only the subshells that differ). */
const parts = list => list.map(s => `${s.id}${sup(s.count)}`).join(' ')

const NOBLE_E = new Set([2, 10, 18, 36, 54, 86, 118])

const L = {
  en: {
    shape: { s: 'a ball', p: 'dumbbells', d: 'four-leaf clovers', f: 'flowers' },
    went: {
      kid: v => `Electron number ${v.e} went into ${v.id}${v.first ? `: a new kind of cloud, shaped like ${v.shape}` : ''}.`,
      sci: v => `Electron ${v.e} enters ${v.id} (Z_eff ${v.zeff}): ${v.config}.`,
    },
    left: {
      kid: v => `An electron left ${v.id}: the outermost ones go first.`,
      sci: v => `Ionisation removes the outermost electron first: one leaves ${v.id}. ${v.config}.`,
    },
    before: {
      kid: v => `${v.inner} before ${v.outer}! With ${v.q} ${v.q === 1 ? 'electron' : 'electrons'} still missing, the nucleus pulls the ${v.inner} clouds in below ${v.outer}. ${v.outer} only fills when the atom is nearly whole.`,
      sci: v => `With charge +${v.q}, ${v.inner} lies below ${v.outer}, so the ion fills ${v.inner} first (Fe²⁺ is [Ar] 3d⁶, not [Ar] 4s² 3d⁴); ${v.outer} is occupied only near the neutral atom.`,
    },
    rule: {
      kid: v => `${v.name} breaks the filling rule: the rule says ${v.rule}, but it really is ${v.real}. ${v.half ? 'A half-full or full set of clouds is extra steady.' : 'Its clouds are so close in energy that the electrons find a more comfortable arrangement.'}`,
      sci: v => `Madelung’s rule predicts ${v.rule}; the ground state is ${v.real}${v.half ? ': a half-filled or filled subshell is extra stable.' : ': these subshells are so close in energy that the electrons’ repulsion reorders them.'}`,
    },
    pair: {
      kid: v => `The ${v.id} clouds each took one electron first; now they start to pair up (Hund’s rule).`,
      sci: v => `Hund’s rule: the ${v.k} ${v.id} orbitals were first singly occupied with parallel spins; electron ${v.e} is the first to pair (${v.unpaired} unpaired).`,
    },
    noble: {
      kid: 'Every shell closed: a noble gas, happy as it is.',
      sci: v => `Closed shells: ${v.config}, a noble gas’s configuration.`,
    },
    closed: {
      kid: v => `The ${v.id} clouds are full: a closed shell, as many electrons as ${v.noble}.`,
      sci: v => `${v.id} filled: ${v.config}, isoelectronic with ${v.noble}.`,
    },
  },
  'pt-pt': {
    shape: { s: 'uma bola', p: 'halteres', d: 'trevos de quatro folhas', f: 'flores' },
    went: {
      kid: v => `O eletrão número ${v.e} foi para ${v.id}${v.first ? `: um tipo novo de nuvem, com a forma de ${v.shape}` : ''}.`,
      sci: v => `O eletrão ${v.e} entra em ${v.id} (Z_ef ${v.zeff}): ${v.config}.`,
    },
    left: {
      kid: v => `Saiu um eletrão de ${v.id}: os de fora saem primeiro.`,
      sci: v => `A ionização tira primeiro o eletrão mais exterior: sai um de ${v.id}. ${v.config}.`,
    },
    before: {
      kid: v => `${v.inner} antes de ${v.outer}! Com ${v.q} ${v.q === 1 ? 'eletrão' : 'eletrões'} ainda em falta, o núcleo puxa as nuvens ${v.inner} para baixo de ${v.outer}. As ${v.outer} só se enchem quando o átomo está quase completo.`,
      sci: v => `Com carga +${v.q}, ${v.inner} fica abaixo de ${v.outer}, por isso o ião enche primeiro ${v.inner} (Fe²⁺ é [Ar] 3d⁶, não [Ar] 4s² 3d⁴); ${v.outer} só se ocupa perto do átomo neutro.`,
    },
    rule: {
      kid: v => `${v.name} foge à regra de enchimento: a regra diz ${v.rule}, mas na realidade é ${v.real}. ${v.half ? 'Um conjunto de nuvens meio cheio ou cheio é mais estável.' : 'As suas nuvens têm energias tão próximas que os eletrões encontram um arranjo mais confortável.'}`,
      sci: v => `A regra de Madelung prevê ${v.rule}; o estado fundamental é ${v.real}${v.half ? ': uma subcamada meio cheia ou cheia é especialmente estável.' : ': estas subcamadas têm energias tão próximas que a repulsão entre os eletrões as reordena.'}`,
    },
    pair: {
      kid: v => `As nuvens ${v.id} receberam primeiro um eletrão cada uma; agora começam a formar pares (regra de Hund).`,
      sci: v => `Regra de Hund: as ${v.k} orbitais ${v.id} ficaram primeiro com um eletrão cada, de spins paralelos; o eletrão ${v.e} é o primeiro a emparelhar (${v.unpaired} desemparelhados).`,
    },
    noble: {
      kid: 'Todas as camadas fechadas: um gás nobre, feliz como está.',
      sci: v => `Camadas fechadas: ${v.config}, a configuração de um gás nobre.`,
    },
    closed: {
      kid: v => `As nuvens ${v.id} estão cheias: uma camada fechada, tantos eletrões como o ${v.noble}.`,
      sci: v => `${v.id} completa: ${v.config}, isoeletrónico do ${v.noble}.`,
    },
  },
  pl: {
    shape: { s: 'kuli', p: 'hantli', d: 'czterolistnej koniczyny', f: 'kwiatu' },
    went: {
      kid: v => `Elektron nr ${v.e} trafił do ${v.id}${v.first ? `: to nowy rodzaj chmury, w kształcie ${v.shape}` : ''}.`,
      sci: v => `Elektron nr ${v.e} obsadza ${v.id} (Z_ef ${v.zeff}): ${v.config}.`,
    },
    left: {
      kid: v => `Elektron opuścił ${v.id}: najpierw odchodzą te z zewnątrz.`,
      sci: v => `Jonizacja usuwa najpierw najbardziej zewnętrzny elektron: jeden opuszcza ${v.id}. ${v.config}.`,
    },
    before: {
      kid: v => `${v.inner} przed ${v.outer}! Gdy brakuje jeszcze ${v.q} ${v.q === 1 ? 'elektronu' : 'elektronów'}, jądro przyciąga chmury ${v.inner} niżej niż ${v.outer}. ${v.outer} zapełnia się dopiero, gdy atom jest prawie cały.`,
      sci: v => `Przy ładunku +${v.q} ${v.inner} leży niżej niż ${v.outer}, więc jon najpierw zapełnia ${v.inner} (Fe²⁺ to [Ar] 3d⁶, a nie [Ar] 4s² 3d⁴); ${v.outer} obsadza się dopiero blisko obojętnego atomu.`,
    },
    rule: {
      kid: v => `${v.name} łamie regułę zapełniania: według reguły byłoby ${v.rule}, a naprawdę jest ${v.real}. ${v.half ? 'Zestaw chmur zapełniony do połowy albo w całości jest wyjątkowo stabilny.' : 'Jego chmury mają tak bliskie energie, że elektrony znajdują wygodniejszy układ.'}`,
      sci: v => `Reguła Madelunga przewiduje ${v.rule}; stan podstawowy to ${v.real}${v.half ? ': podpowłoka zapełniona do połowy lub całkowicie jest szczególnie trwała.' : ': energie tych podpowłok są tak bliskie, że odpychanie elektronów zmienia ich kolejność.'}`,
    },
    pair: {
      kid: v => `Każda z chmur ${v.id} dostała najpierw po jednym elektronie; teraz zaczynają tworzyć pary (reguła Hunda).`,
      sci: v => `Reguła Hunda: orbitale ${v.id} (${v.k}) obsadzono najpierw pojedynczo, ze spinami równoległymi; elektron nr ${v.e} jako pierwszy tworzy parę (niesparowane: ${v.unpaired}).`,
    },
    noble: {
      kid: 'Wszystkie powłoki zamknięte: gaz szlachetny, zadowolony z tego, jaki jest.',
      sci: v => `Powłoki zamknięte: ${v.config}, konfiguracja gazu szlachetnego.`,
    },
    closed: {
      kid: v => `Chmury ${v.id} są pełne: zamknięta powłoka, tyle elektronów co ${v.noble}.`,
      sci: v => `${v.id} zapełniona: ${v.config}, tyle elektronów co ${v.noble} (konfiguracja gazu szlachetnego).`,
    },
  },
  de: {
    shape: { s: 'eine Kugel', p: 'Hanteln', d: 'vierblättrige Kleeblätter', f: 'Blumen' },
    went: {
      kid: v => `Elektron Nr. ${v.e} ging in ${v.id}${v.first ? `: eine neue Art Wolke, geformt wie ${v.shape}` : ''}.`,
      sci: v => `Elektron Nr. ${v.e} besetzt ${v.id} (Z_eff ${v.zeff}): ${v.config}.`,
    },
    left: {
      kid: v => `Ein Elektron hat ${v.id} verlassen: Die äußersten gehen zuerst.`,
      sci: v => `Ionisation entfernt zuerst das äußerste Elektron: Eines verlässt ${v.id}. ${v.config}.`,
    },
    before: {
      kid: v => `${v.inner} vor ${v.outer}! Solange noch ${v.q} ${v.q === 1 ? 'Elektron fehlt' : 'Elektronen fehlen'}, zieht der Kern die ${v.inner}-Wolken unter ${v.outer}. ${v.outer} füllt sich erst, wenn das Atom fast vollständig ist.`,
      sci: v => `Bei Ladung +${v.q} liegt ${v.inner} unter ${v.outer}, daher füllt das Ion zuerst ${v.inner} (Fe²⁺ ist [Ar] 3d⁶, nicht [Ar] 4s² 3d⁴); ${v.outer} wird erst nahe am neutralen Atom besetzt.`,
    },
    rule: {
      kid: v => `${v.name} bricht die Füllregel: Nach der Regel wäre es ${v.rule}, in Wirklichkeit ist es ${v.real}. ${v.half ? 'Ein halb oder ganz gefüllter Satz Wolken ist besonders stabil.' : 'Seine Wolken liegen energetisch so nah beieinander, dass die Elektronen eine bequemere Anordnung finden.'}`,
      sci: v => `Die Madelung-Regel sagt ${v.rule} voraus; der Grundzustand ist ${v.real}${v.half ? ': Eine halb oder ganz gefüllte Unterschale ist besonders stabil.' : ': Diese Unterschalen liegen energetisch so nah, dass die Abstoßung der Elektronen ihre Reihenfolge ändert.'}`,
    },
    pair: {
      kid: v => `Die ${v.id}-Wolken haben zuerst je ein Elektron bekommen; jetzt bilden sich Paare (Hundsche Regel).`,
      sci: v => `Hundsche Regel: Die ${v.k} ${v.id}-Orbitale waren zuerst einfach besetzt, mit parallelen Spins; Elektron Nr. ${v.e} ist das erste, das sich paart (${v.unpaired} ungepaart).`,
    },
    noble: {
      kid: 'Alle Schalen geschlossen: ein Edelgas, zufrieden, wie es ist.',
      sci: v => `Geschlossene Schalen: ${v.config}, die Konfiguration eines Edelgases.`,
    },
    closed: {
      kid: v => `Die ${v.id}-Wolken sind voll: eine geschlossene Schale, so viele Elektronen wie ${v.noble}.`,
      sci: v => `${v.id} gefüllt: ${v.config}, isoelektronisch mit ${v.noble}.`,
    },
  },
}
export const CLOUD_WORDS = L

const pick = (entry, level, v) => {
  const x = level === 'scientist' ? entry.sci : entry.kid
  return typeof x === 'function' ? x(v) : x
}
const KEEPS_CAPITALS = new Set(['de'])
const nameIn = (z, lang) => (KEEPS_CAPITALS.has(lang) ? nameOf(ELEMENTS[z - 1], lang) : nameOf(ELEMENTS[z - 1], lang).toLowerCase())
const num = (x, lang) => x.toFixed(2).replace('.', lang === 'en' ? '.' : ',')

/**
 * The one line about the clouds after a change: `c` is clouds.js's report { z, e, subs, change, exception }
 * with change { kind: 'add' | 'remove', id, first, pairs, before: { inner, outer } | null } or null.
 */
export function cloudLine(c, lang, level) {
  const W = L[lang] ?? L.en
  if (!c || !c.e) return null
  const config = configLine(c.subs)
  const ch = c.change
  // a rule breaker made whole: what the rule says against what it is
  if (c.e === c.z && c.exception && ch?.kind === 'add') {
    return pick(W.rule, level, { name: cap(nameOf(ELEMENTS[c.z - 1], lang)), rule: parts(c.exception.rule), real: parts(c.exception.real), half: c.exception.halfOrFull })
  }
  if (ch?.kind === 'add' && ch.before) return pick(W.before, level, { inner: ch.before.inner, outer: ch.before.outer, q: c.z - c.e })
  if (ch?.kind === 'add' && NOBLE_E.has(c.e)) {
    if (c.e === c.z) return pick(W.noble, level, { config })
    return pick(W.closed, level, { id: ch.id, config, noble: nameIn(c.e, lang) })
  }
  if (ch?.kind === 'add' && ch.pairs) {
    const sub = c.subs.find(s => s.id === ch.id)
    return pick(W.pair, level, { id: ch.id, k: sub.boxes.length, e: c.e, unpaired: c.unpaired })
  }
  if (ch?.kind === 'add') {
    const sub = c.subs.find(s => s.id === ch.id)
    return pick(W.went, level, { e: c.e, id: ch.id, first: ch.first, shape: W.shape[ch.id[1]], zeff: num(sub.zeff, lang), config })
  }
  if (ch?.kind === 'remove') return pick(W.left, level, { id: ch.id, config })
  return null
}
