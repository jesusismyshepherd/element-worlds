// What the Molecule Lab says about its clouds (bondDomains.js, the ☁ switch): the colours' key and one line
// about what is on the table, the most telling first. Four languages, both depths (kid: Explorer, sci:
// Scientist). docs/knowledge/molecule-lab.md, "Clouds".
import { element, nameOf } from '../../data/elements.js'

// the colours of the kinds of cloud (bondCloud.js draws them; the HUD's key shows them): a shared pair the
// lab's clasp colour, a π pair bluer, a lone pair pink, a single electron (a free hand) the gold of a picked
// atom, an ion's pair the anion's charge colour
export const CLOUD_COLORS = { sigma: '#4cc9ff', pi: '#7b8cff', lone: '#ff6fc4', free: '#ffc94d', ion: '#6fd0ff' }

const L = {
  en: {
    key: { sigma: 'a shared pair', pi: 'a π pair', lone: 'a lone pair', free: 'one electron', ion: 'a pair handed over' },
    oxygen: {
      kid: 'This picture pairs every electron, yet liquid oxygen sticks to a magnet: two of its electrons are really alone. Scientists explain it with clouds that spread over the whole molecule.',
      sci: 'The valence-bond picture pairs every electron, but O₂ is paramagnetic: its ground state has two unpaired electrons in π* orbitals, which molecular-orbital theory predicts.',
    },
    ion: {
      kid: v => `The metal gave its electrons away: the whole pair now sits on the ${v.name}, and the two ions hold on by attraction.`,
      sci: v => `Fully polar: the pair belongs to ${v.name} alone (the anion); the cation keeps only its core. Electronegativities ${v.ea} and ${v.eb}.`,
    },
    polar: {
      kid: v => `${v.name} pulls the shared clouds toward itself, so it ends up a little negative and its partners a little positive.`,
      sci: v => `Polar bonds: ${v.name} (electronegativity ${v.en}) draws the shared pairs toward itself (δ−), its partners are left δ+.`,
    },
    pi: {
      kid: 'A double bond is two clouds: one between the atoms, and one above and below them, like two hands held two ways.',
      sci: 'A double bond is a σ pair along the axis and a π pair from side-by-side p orbitals above and below it; a triple bond has two π pairs at right angles.',
    },
    free: {
      kid: v => `${v.n === 1 ? 'A gold cloud is one electron' : `The ${v.n} gold clouds are single electrons`} waiting for a partner: join two hands and their clouds merge into one.`,
      sci: v => `${v.n === 1 ? 'One singly occupied orbital' : `${v.n} singly occupied orbitals`} (free hands): overlap with another atom's pairs the electrons into a bond.`,
    },
    bond: {
      kid: 'Each bond is one cloud that two atoms share, holding two electrons. Pink clouds are pairs an atom keeps for itself; they push the bonds apart.',
      sci: 'Each σ bond is two hybrid orbitals overlapping (sp³ with four clouds round an atom, sp² with three, sp with two), holding two electrons; lone pairs push the bonds apart (VSEPR).',
    },
  },
  'pt-pt': {
    key: { sigma: 'um par partilhado', pi: 'um par π', lone: 'um par isolado', free: 'um eletrão', ion: 'um par entregue' },
    oxygen: {
      kid: 'Este desenho junta todos os eletrões aos pares, mas o oxigénio líquido cola-se a um íman: dois dos seus eletrões estão mesmo sozinhos. Os cientistas explicam-no com nuvens que se espalham pela molécula inteira.',
      sci: 'O modelo da ligação de valência emparelha todos os eletrões, mas o O₂ é paramagnético: o estado fundamental tem dois eletrões desemparelhados em orbitais π*, como prevê a teoria das orbitais moleculares.',
    },
    ion: {
      kid: v => `O metal deu os seus eletrões: o par inteiro está agora no ${v.name}, e os dois iões ficam presos por atração.`,
      sci: v => `Totalmente polar: o par pertence só ao ${v.name} (o anião); o catião fica só com o seu cerne. Eletronegatividades ${v.ea} e ${v.eb}.`,
    },
    polar: {
      kid: v => `O ${v.name} puxa as nuvens partilhadas para si, por isso fica um pouco negativo e os parceiros um pouco positivos.`,
      sci: v => `Ligações polares: o ${v.name} (eletronegatividade ${v.en}) puxa os pares partilhados para si (δ−), e os parceiros ficam δ+.`,
    },
    pi: {
      kid: 'Uma ligação dupla são duas nuvens: uma entre os átomos e outra por cima e por baixo deles, como duas mãos dadas de duas maneiras.',
      sci: 'Uma ligação dupla é um par σ ao longo do eixo e um par π de orbitais p lado a lado, por cima e por baixo; uma ligação tripla tem dois pares π em ângulo reto.',
    },
    free: {
      kid: v => `${v.n === 1 ? 'Uma nuvem dourada é um eletrão' : `As ${v.n} nuvens douradas são eletrões sozinhos`} à espera de um par: junta duas mãos e as nuvens fundem-se numa só.`,
      sci: v => `${v.n === 1 ? 'Uma orbital semipreenchida' : `${v.n} orbitais semipreenchidas`} (mãos livres): ao sobrepor-se às de outro átomo, os eletrões emparelham numa ligação.`,
    },
    bond: {
      kid: 'Cada ligação é uma nuvem que dois átomos partilham, com dois eletrões. As nuvens cor-de-rosa são pares que um átomo guarda para si; afastam as ligações.',
      sci: 'Cada ligação σ são duas orbitais híbridas sobrepostas (sp³ com quatro nuvens à volta de um átomo, sp² com três, sp com duas), com dois eletrões; os pares isolados afastam as ligações (VSEPR).',
    },
  },
  pl: {
    key: { sigma: 'wspólna para', pi: 'para π', lone: 'wolna para', free: 'jeden elektron', ion: 'oddana para' },
    oxygen: {
      kid: 'Ten obrazek łączy wszystkie elektrony w pary, a jednak ciekły tlen przyczepia się do magnesu: dwa jego elektrony są naprawdę samotne. Naukowcy tłumaczą to chmurami rozciągniętymi na całą cząsteczkę.',
      sci: 'Model wiązań walencyjnych paruje wszystkie elektrony, ale O₂ jest paramagnetyczny: w stanie podstawowym ma dwa niesparowane elektrony na orbitalach π*, co przewiduje teoria orbitali molekularnych.',
    },
    ion: {
      kid: v => `Metal oddał swoje elektrony: cała para jest teraz przy atomie: ${v.name}, a dwa jony trzymają się dzięki przyciąganiu.`,
      sci: v => `Wiązanie w pełni spolaryzowane: para należy wyłącznie do anionu (${v.name}); kation zachowuje tylko rdzeń. Elektroujemności ${v.ea} i ${v.eb}.`,
    },
    polar: {
      kid: v => `${v.name} przyciąga wspólne chmury do siebie, więc ma lekki ładunek ujemny, a jego partnerzy lekki dodatni.`,
      sci: v => `Wiązania spolaryzowane: ${v.name} (elektroujemność ${v.en}) przyciąga wspólne pary do siebie (δ−), partnerzy zostają δ+.`,
    },
    pi: {
      kid: 'Wiązanie podwójne to dwie chmury: jedna między atomami i druga nad nimi i pod nimi, jak dłonie złapane na dwa sposoby.',
      sci: 'Wiązanie podwójne to para σ wzdłuż osi i para π z ułożonych obok siebie orbitali p, nad i pod nią; wiązanie potrójne ma dwie pary π pod kątem prostym.',
    },
    free: {
      kid: v => `${v.n === 1 ? 'Złota chmura to jeden elektron' : 'Złote chmury to samotne elektrony'} czekające na partnera: połącz dwie ręce, a ich chmury złączą się w jedną.`,
      sci: v => `Orbitale obsadzone pojedynczo (wolne ręce: ${v.n}): po nałożeniu z orbitalem innego atomu elektrony łączą się w parę wiązania.`,
    },
    bond: {
      kid: 'Każde wiązanie to jedna chmura, którą dzielą dwa atomy, z dwoma elektronami. Różowe chmury to pary, które atom zatrzymuje dla siebie; odpychają wiązania.',
      sci: 'Każde wiązanie σ to dwa nakładające się orbitale zhybrydyzowane (sp³ przy czterech chmurach wokół atomu, sp² przy trzech, sp przy dwóch) z dwoma elektronami; wolne pary odpychają wiązania (VSEPR).',
    },
  },
  de: {
    key: { sigma: 'ein geteiltes Paar', pi: 'ein π-Paar', lone: 'ein freies Paar', free: 'ein Elektron', ion: 'ein abgegebenes Paar' },
    oxygen: {
      kid: 'Dieses Bild paart jedes Elektron, und doch klebt flüssiger Sauerstoff an einem Magneten: Zwei seiner Elektronen sind in Wirklichkeit allein. Forscher erklären das mit Wolken, die sich über das ganze Molekül ausbreiten.',
      sci: 'Das Valenzbindungsbild paart jedes Elektron, aber O₂ ist paramagnetisch: Sein Grundzustand hat zwei ungepaarte Elektronen in π*-Orbitalen, wie die Molekülorbitaltheorie vorhersagt.',
    },
    ion: {
      kid: v => `Das Metall hat seine Elektronen abgegeben: Das ganze Paar sitzt jetzt beim ${v.name}, und die beiden Ionen halten sich durch Anziehung.`,
      sci: v => `Vollständig polar: Das Paar gehört allein dem Anion (${v.name}); dem Kation bleibt nur sein Rumpf. Elektronegativitäten ${v.ea} und ${v.eb}.`,
    },
    polar: {
      kid: v => `${v.name} zieht die geteilten Wolken zu sich, darum sitzt dort ein bisschen negative Ladung und bei den Partnern ein bisschen positive.`,
      sci: v => `Polare Bindungen: ${v.name} (Elektronegativität ${v.en}) zieht die geteilten Paare zu sich (δ−), die Partner bleiben δ+.`,
    },
    pi: {
      kid: 'Eine Doppelbindung sind zwei Wolken: eine zwischen den Atomen und eine darüber und darunter, wie zwei Hände, die sich auf zwei Arten halten.',
      sci: 'Eine Doppelbindung ist ein σ-Paar entlang der Achse und ein π-Paar aus nebeneinanderliegenden p-Orbitalen darüber und darunter; eine Dreifachbindung hat zwei π-Paare im rechten Winkel.',
    },
    free: {
      kid: v => `${v.n === 1 ? 'Eine goldene Wolke ist ein einzelnes Elektron' : `Die ${v.n} goldenen Wolken sind einzelne Elektronen`}, die auf einen Partner warten: Verbinde zwei Hände, und ihre Wolken verschmelzen zu einer.`,
      sci: v => `${v.n === 1 ? 'Ein einfach besetztes Orbital' : `${v.n} einfach besetzte Orbitale`} (freie Hände): Überlappt es mit dem eines anderen Atoms, paaren sich die Elektronen zu einer Bindung.`,
    },
    bond: {
      kid: 'Jede Bindung ist eine Wolke, die sich zwei Atome teilen, mit zwei Elektronen darin. Rosa Wolken sind Paare, die ein Atom für sich behält; sie drücken die Bindungen auseinander.',
      sci: 'Jede σ-Bindung sind zwei überlappende Hybridorbitale (sp³ bei vier Wolken um ein Atom, sp² bei drei, sp bei zwei) mit zwei Elektronen; freie Paare drücken die Bindungen auseinander (VSEPR).',
    },
  },
}
export const LAB_CLOUD_WORDS = L

const pick = (entry, level, v) => {
  const x = level === 'scientist' ? entry.sci : entry.kid
  return typeof x === 'function' ? x(v) : x
}
const KEEPS_CAPITALS = new Set(['de'])
const nameIn = (sym, lang) => (KEEPS_CAPITALS.has(lang) ? nameOf(element(sym), lang) : nameOf(element(sym), lang).toLowerCase())
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
const num = (x, lang) => String(x).replace('.', lang === 'en' ? '.' : ',')

/**
 * The clouds' one line. `c` is the lab's report: { show (a known molecule's formula or null), free (single
 * electrons), bonds, pi, ionic: { anion, cation } | null, polar: { sym } | null }.
 */
export function labCloudLine(c, lang, level) {
  const W = L[lang] ?? L.en
  if (!c || (!c.free && !c.bonds && !c.ionic)) return null
  if (c.show === 'O2') return pick(W.oxygen, level)
  if (c.ionic) return pick(W.ion, level, { name: nameIn(c.ionic.anion, lang), ea: num(element(c.ionic.anion).en, lang), eb: num(element(c.ionic.cation).en, lang) })
  if (c.free) return pick(W.free, level, { n: c.free })
  if (c.polar) return pick(W.polar, level, { name: cap(nameIn(c.polar.sym, lang)), en: num(element(c.polar.sym).en, lang) })
  if (c.pi) return pick(W.pi, level)
  return pick(W.bond, level)
}

/** The colours' key in the language. */
export const cloudKey = lang => (L[lang] ?? L.en).key
