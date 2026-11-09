// The room inside the atom, in words: four languages, two depths (kid: Explorer, sci: Scientist). Entries
// that need numbers are functions of `v` ({ name, z, id, count, cap, zeff, n, rn, an, e, size, ...}).
// Our own words without em dashes (the user's taste); quantities as the language writes them.
import { decimalOf } from '../../i18n/langs.js'

/** The entry at a depth: a string, { kid, sci }, or functions of v. */
export const say = (entry, level, v = {}) => {
  const e = entry == null ? '' : typeof entry === 'string' || typeof entry === 'function' ? entry : (level === 'scientist' ? entry.sci : entry.kid) ?? entry.kid ?? entry.sci
  return typeof e === 'function' ? e(v) : e
}

/** A number rounded to `digits`, with the language's decimal mark. */
export const num = (x, digits, lang) => (Math.round(x * 10 ** digits) / 10 ** digits).toFixed(digits).replace('.', decimalOf(lang))

const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' }
/** 1.3e11 as "1,3 × 10¹¹" (the HUD's font has the superscript digits). */
export function sci10(x, lang) {
  const e = Math.floor(Math.log10(x))
  const m = x / 10 ** e
  return `${num(m, 1, lang)} × 10${String(e).split('').map(c => SUP[c]).join('')}`
}

/** A length in metres the reader can picture: µm, mm, cm or m with two significant figures. */
export function length(m, lang) {
  const two = v => (v >= 10 ? num(v, 0, lang) : num(v, 1, lang))
  if (m < 1e-3) return `${two(m * 1e6)} µm`
  if (m < 1e-2) return `${two(m * 1e3)} mm`
  if (m < 1) return `${two(m * 100)} cm`
  return `${two(m)} m`
}

// a configuration as text: "4s² 3d⁴"
export const configText = parts => parts.map(p => `${p.id}${String(p.count).split('').map(c => SUP[c]).join('')}`).join(' ')
/** The data's configuration, "[Ar]4s2 3d6", as "[Ar] 4s² 3d⁶". */
export const shortConfig = text =>
  text.replace(/(\d)([spdf])(\d+)/g, (m, n, l, c) => `${n}${l}${c.split('').map(d => SUP[d]).join('')}`).replace(/\]\s*/, '] ')

const plPlural = (n, one, few, many) => {
  if (n === 1) return one
  const t = n % 10
  const h = n % 100
  return t >= 2 && t <= 4 && !(h >= 12 && h <= 14) ? few : many
}

// how big something of a size (m) is, in things a child knows
const SIZE = {
  en: [[1e-5, 'far too small to see, smaller than a speck of dust'], [1e-4, 'the size of a speck of dust'], [2e-3, 'the size of a grain of sand'], [2e-2, 'the size of a pea'], [4e-2, 'the size of a marble'], [0.15, 'the size of a tennis ball'], [0.6, 'the size of a football'], [Infinity, 'as big as a beach ball']],
  'pt-pt': [[1e-5, 'pequeno demais para se ver, menor do que um grão de pó'], [1e-4, 'do tamanho de um grão de pó'], [2e-3, 'do tamanho de um grão de areia'], [2e-2, 'do tamanho de uma ervilha'], [4e-2, 'do tamanho de um berlinde'], [0.15, 'do tamanho de uma bola de ténis'], [0.6, 'do tamanho de uma bola de futebol'], [Infinity, 'do tamanho de uma bola de praia']],
  pl: [[1e-5, 'o wiele za małe, żeby je zobaczyć, mniejsze niż pyłek kurzu'], [1e-4, 'wielkości pyłku kurzu'], [2e-3, 'wielkości ziarenka piasku'], [2e-2, 'wielkości ziarnka grochu'], [4e-2, 'wielkości szklanej kulki'], [0.15, 'wielkości piłki tenisowej'], [0.6, 'wielkości piłki nożnej'], [Infinity, 'wielkości piłki plażowej']],
  de: [[1e-5, 'viel zu klein zum Sehen, kleiner als ein Staubkorn'], [1e-4, 'so groß wie ein Staubkorn'], [2e-3, 'so groß wie ein Sandkorn'], [2e-2, 'so groß wie eine Erbse'], [4e-2, 'so groß wie eine Murmel'], [0.15, 'so groß wie ein Tennisball'], [0.6, 'so groß wie ein Fußball'], [Infinity, 'so groß wie ein Wasserball']],
}
export const sizeWords = (m, lang) => (SIZE[lang] ?? SIZE.en).find(([top]) => m < top)[1]

const EN = {
  title: 'Inside the atom',
  back: 'Back to the hall',
  board: {
    title: 'Electron map',
    all: z => (z === 1 ? 'The one electron' : `All ${z} electrons`),
    hint: 'Tap a cloud’s name, or one of its boxes',
    config: 'Configuration',
  },
  label: { board: 'the electron map', camera: 'the electron camera', nucleus: 'the nucleus' },
  verb: { board: 'Choose a cloud', camera: 'Take a photo', look: 'Look at', talk: 'Talk to' },
  greet: {
    kid: v => (v.z === 1
      ? 'Welcome inside me! This glowing mist is my one electron. It is not a little ball going round: it is a cloud. Tap the electron map to choose what you see.'
      : `Welcome inside me! This glowing mist is my ${v.z} electrons. They are not little balls going round: each one is a cloud. Tap the electron map to see each cloud’s shape.`),
    sci: v => `You are inside an atom of ${v.name}, magnified about ${v.mag} times. The glow is where its ${v.z === 1 ? 'electron is' : `${v.z} electrons are`} likely to be found: quantum mechanics’ orbitals, not orbits. The electron map shows one subshell or one orbital at a time.`,
  },
  all: {
    kid: v => (v.z === 1
      ? 'Here is my one electron: a single cloud round my nucleus.'
      : `Here are all ${v.z} of my electrons at once, in layers like an onion: the inner ones hug my nucleus, the outer ones meet other atoms. Slide to shrink yourself and dive inside.`),
    sci: 'Every electron: each subshell glows where its electrons are most often found (its radial distribution), in its block’s colour. The inner shells are pulled in tight by the nucleus; the zoom slider takes you down to them.',
  },
  sub: {
    s: {
      kid: v => `My ${v.id} cloud is round like a ball${v.n > 1 ? `, with ${v.rn === 1 ? 'a hollow layer' : `${v.rn} hollow layers`} inside where the electron is never found` : ''}. ${v.count === 2 ? 'Two electrons share it, spinning opposite ways.' : 'One electron lives in it.'}`,
      sci: v => `${v.id}: l = 0, spherical, ${v.rn} radial node${v.rn === 1 ? '' : 's'}. Holds 2; ${v.count} here. Effective charge ${v.zeff} (Slater).`,
    },
    p: {
      kid: v => `My ${v.id} clouds are three dumbbells, one along each direction. Each holds two electrons, so six fit; I have ${v.count} here.`,
      sci: v => `${v.id}: l = 1, three orbitals along x, y and z, each with a nodal plane; ${v.rn} radial node${v.rn === 1 ? '' : 's'}. Holds 6; ${v.count} here. Effective charge ${v.zeff} (Slater).`,
    },
    d: {
      kid: v => `My ${v.id} clouds: five of them, four like four-leaf clovers and one like a dumbbell wearing a ring. Ten electrons fit; I have ${v.count} here.`,
      sci: v => `${v.id}: l = 2, five orbitals (dxy, dxz, dyz, dx²−y², dz²), two angular nodes each. Holds 10; ${v.count} here. Effective charge ${v.zeff} (Slater).`,
    },
    f: {
      kid: v => `My ${v.id} clouds are the fanciest: seven of them, like flowers with six or eight petals. Fourteen electrons fit; I have ${v.count} here.`,
      sci: v => `${v.id}: l = 3, seven orbitals, three angular nodes each. Holds 14; ${v.count} here. Effective charge ${v.zeff} (Slater).`,
    },
  },
  empty: { kid: 'The faint ones are empty: places still free.', sci: 'The faint orbitals are empty.' },
  one: {
    kid: v => `Just one ${v.id} cloud. Its two colours are the two halves of the electron’s wave; where they meet, the electron is never found. ${['It is empty: a free place, waiting for an electron.', 'One electron lives here.', 'Two electrons share it, spinning opposite ways.'][v.e]}`,
    sci: v => `${v.label}: ψ = R(r)·Y(θ, φ). The colours are the sign of ψ; it is zero on ${v.rn} spherical and ${v.an} angular node${v.an === 1 ? '' : 's'}. ${['Empty.', 'One electron.', 'Two electrons, opposite spins (Pauli).'][v.e]}`,
  },
  photo: {
    first: {
      kid: 'Click! The camera found my electron, right there. Take another and it will be somewhere else: nobody can say where it will be next, only where it is likely to be.',
      sci: 'One position measurement: the electron is found at a point drawn at random with probability density |ψ|² (Born’s rule). Each photo is a fresh measurement.',
    },
    some: { kid: 'See the dots gather where the cloud is thickest?', sci: 'The dots pile up where |ψ|² is largest.' },
    many: {
      kid: 'Now the dots draw my cloud by themselves. That is what the cloud is: all the places the electron is likely to be found.',
      sci: 'The dots now trace the orbital: nine in ten fall inside the drawn skin, the 90 % boundary surface.',
    },
  },
  nucleus: {
    kid: v => `That tiny spark is my nucleus: ${v.p} proton${v.p === 1 ? '' : 's'}${v.nn ? ` and ${v.nn} neutron${v.nn === 1 ? '' : 's'}` : ''}. Blown up as big as I am here, it would be ${v.size}. Yet it holds almost all my weight!`,
    sci: v => `${v.p} p + ${v.nn} n. Radius about 1.2·A^(1/3) fm = ${v.r} fm, so at this magnification it would be ${v.d} across. The atom (radius ${v.R} pm) is about ${v.ratio} times bigger, and the nucleus holds ${v.share} % of its mass.`,
  },
  core: {
    kid: v => `We have shrunk right down to my innermost cloud, 1s, beside my nucleus. Its electrons are pulled in tight by my ${v.z} protons.`,
    sci: v => `1s: effective charge ${v.zeff}; its electrons are most often about ${v.pm} pm from the nucleus, ${v.ratio} times nearer than the outermost shell’s.`,
  },
  exception: {
    kid: v => `Funny thing: I break the filling rule a little. ${v.half ? 'An electron moves to another cloud, because a half-full or full set of clouds is extra steady.' : 'My clouds are so close in energy that my electrons find a more comfortable arrangement.'}`,
    sci: v => `Madelung’s rule predicts ${v.rule}; the ground state is ${v.real}${v.half ? ': a half-filled or filled subshell is extra stable.' : ': these subshells are so close in energy that the electrons’ repulsion reorders them.'}`,
  },
  predicted: {
    kid: 'Nobody has made enough of me to measure my electrons: this arrangement is scientists’ best prediction.',
    sci: 'Predicted configuration (relativistic calculations); not yet measured.',
  },
  zoom: { kid: 'Shrink yourself', sci: 'Zoom' },
  scale: { kid: 'Everything here is blown up so much that a grain of sand would be bigger than the Earth.', sci: v => `Magnified about ${v.mag} times.` },
  panel: {
    map: {
      title: 'Electron map',
      intro: {
        kid: 'Every electron lives in a cloud called an orbital. Clouds come in four shapes, s, p, d and f: the same letters as the blocks of the periodic table. Tap a name to see those clouds, or a box to see one cloud alone; tap again for the next.',
        sci: 'Rows are shells (n), columns subshells (l: s, p, d, f), boxes orbitals (m), arrows electrons and their spins: two to an orbital with opposite spins (Pauli), spread out before they pair (Hund). The same blocks shape the periodic table.',
      },
      rows: { shell: 'Shell n', shape: 'Shape l', orbitals: 'Orbitals', here: 'Electrons here', nodes: 'Nodes', zeff: 'Effective charge (Slater)', order: 'Filling order', unpaired: 'Unpaired electrons', config: 'Configuration' },
      nodes: v => `${v.rn} spherical, ${v.an} angular`,
      unpaired: { kid: v => (v.u ? `${v.u === 1 ? 'One electron is' : `${v.u} electrons are`} alone in ${v.u === 1 ? 'its' : 'their'} clouds: lone electrons act like tiny magnets.` : 'Every electron has a partner: none is left alone.'), sci: '' },
      model: 'Drawn from hydrogen’s exact orbitals, sized by the effective nuclear charge (Slater’s rules): the shapes are exact for hydrogen and close for other atoms; the sizes are a model.',
      showAll: 'Show every electron',
    },
    camera: {
      title: 'Electron camera',
      text: {
        kid: 'An electron is not a tiny ball whizzing round. Until you look, it is a cloud of chances. Each photo finds it in one place, never the same twice. Take lots of photos and the cloud appears from the dots.',
        sci: 'Born’s rule: the probability density of finding the electron at a point is |ψ|². Each photo is one position measurement drawn from that density; enough of them reproduce the orbital.',
      },
      count: n => (n === 1 ? '1 photo' : `${n} photos`),
      take10: 'Take 10 photos',
      take100: 'Take 100 photos',
      hide: 'Hide the cloud',
      show: 'Show the cloud',
      clear: 'Clear the photos',
    },
    nucleus: { title: 'The nucleus' },
  },
}

const PT = {
  title: 'Dentro do átomo',
  back: 'Voltar ao salão',
  board: {
    title: 'Mapa dos eletrões',
    all: z => (z === 1 ? 'O único eletrão' : `Os ${z} eletrões`),
    hint: 'Toca no nome de uma nuvem ou numa das suas caixas',
    config: 'Configuração',
  },
  label: { board: 'o mapa dos eletrões', camera: 'a câmara de eletrões', nucleus: 'o núcleo' },
  verb: { board: 'Escolher uma nuvem', camera: 'Tirar uma fotografia', look: 'Ver', talk: 'Falar com' },
  greet: {
    kid: v => (v.z === 1
      ? 'Bem-vindo ao meu interior! Esta névoa brilhante é o meu único eletrão. Não é uma bolinha às voltas: é uma nuvem. Toca no mapa dos eletrões para escolher o que vês.'
      : `Bem-vindo ao meu interior! Esta névoa brilhante são os meus ${v.z} eletrões. Não são bolinhas às voltas: cada um é uma nuvem. Toca no mapa dos eletrões para veres a forma de cada nuvem.`),
    sci: v => `Estás dentro de um átomo de ${v.name}, ampliado cerca de ${v.mag} vezes. O brilho mostra onde ${v.z === 1 ? 'o seu eletrão tem' : `os seus ${v.z} eletrões têm`} maior probabilidade de estar: as orbitais da mecânica quântica, não órbitas. O mapa mostra um subnível ou uma orbital de cada vez.`,
  },
  all: {
    kid: v => (v.z === 1
      ? 'Aqui está o meu único eletrão: uma só nuvem à volta do meu núcleo.'
      : `Aqui estão os meus ${v.z} eletrões ao mesmo tempo, em camadas como uma cebola: os de dentro abraçam o núcleo, os de fora encontram outros átomos. Desliza para encolheres e mergulhares lá dentro.`),
    sci: 'Todos os eletrões: cada subnível brilha onde os seus eletrões se encontram mais vezes (a sua distribuição radial), na cor do seu bloco. As camadas interiores são puxadas para perto pelo núcleo; o zoom leva-te até elas.',
  },
  sub: {
    s: {
      kid: v => `A minha nuvem ${v.id} é redonda como uma bola${v.n > 1 ? `, com ${v.rn === 1 ? 'uma camada oca' : `${v.rn} camadas ocas`} lá dentro onde o eletrão nunca se encontra` : ''}. ${v.count === 2 ? 'Dois eletrões partilham-na, a girar em sentidos opostos.' : 'Vive nela um eletrão.'}`,
      sci: v => `${v.id}: l = 0, esférica, ${v.rn} ${v.rn === 1 ? 'nó radial' : 'nós radiais'}. Comporta 2; aqui há ${v.count}. Carga efetiva ${v.zeff} (Slater).`,
    },
    p: {
      kid: v => `As minhas nuvens ${v.id} são três halteres, um em cada direção. Cada uma leva dois eletrões, por isso cabem seis; aqui tenho ${v.count}.`,
      sci: v => `${v.id}: l = 1, três orbitais segundo x, y e z, cada uma com um plano nodal; ${v.rn} ${v.rn === 1 ? 'nó radial' : 'nós radiais'}. Comporta 6; aqui há ${v.count}. Carga efetiva ${v.zeff} (Slater).`,
    },
    d: {
      kid: v => `As minhas nuvens ${v.id}: são cinco, quatro como trevos de quatro folhas e uma como um haltere com um anel. Cabem dez eletrões; aqui tenho ${v.count}.`,
      sci: v => `${v.id}: l = 2, cinco orbitais (dxy, dxz, dyz, dx²−y², dz²), cada uma com dois nós angulares. Comporta 10; aqui há ${v.count}. Carga efetiva ${v.zeff} (Slater).`,
    },
    f: {
      kid: v => `As minhas nuvens ${v.id} são as mais vistosas: sete, como flores de seis ou oito pétalas. Cabem catorze eletrões; aqui tenho ${v.count}.`,
      sci: v => `${v.id}: l = 3, sete orbitais, cada uma com três nós angulares. Comporta 14; aqui há ${v.count}. Carga efetiva ${v.zeff} (Slater).`,
    },
  },
  empty: { kid: 'As mais ténues estão vazias: lugares ainda livres.', sci: 'As orbitais ténues estão vazias.' },
  one: {
    kid: v => `Só uma nuvem ${v.id}. As suas duas cores são as duas metades da onda do eletrão; onde se encontram, o eletrão nunca está. ${['Está vazia: um lugar livre à espera de um eletrão.', 'Vive aqui um eletrão.', 'Dois eletrões partilham-na, a girar em sentidos opostos.'][v.e]}`,
    sci: v => `${v.label}: ψ = R(r)·Y(θ, φ). As cores são o sinal de ψ; anula-se em ${v.rn} ${v.rn === 1 ? 'nó esférico' : 'nós esféricos'} e ${v.an} ${v.an === 1 ? 'nó angular' : 'nós angulares'}. ${['Vazia.', 'Um eletrão.', 'Dois eletrões, de spins opostos (Pauli).'][v.e]}`,
  },
  photo: {
    first: {
      kid: 'Clique! A câmara encontrou o meu eletrão, ali mesmo. Tira outra e ele estará noutro sítio: ninguém sabe dizer onde estará a seguir, só onde é provável que esteja.',
      sci: 'Uma medição da posição: o eletrão é encontrado num ponto sorteado com densidade de probabilidade |ψ|² (regra de Born). Cada fotografia é uma medição nova.',
    },
    some: { kid: 'Vês os pontos a juntarem-se onde a nuvem é mais espessa?', sci: 'Os pontos acumulam-se onde |ψ|² é maior.' },
    many: {
      kid: 'Agora os pontos desenham a minha nuvem sozinhos. É isso a nuvem: todos os sítios onde é provável encontrar o eletrão.',
      sci: 'Os pontos já desenham a orbital: nove em cada dez caem dentro da pele desenhada, a superfície que contém 90 %.',
    },
  },
  nucleus: {
    kid: v => `Aquela faísca minúscula é o meu núcleo: ${v.p} ${v.p === 1 ? 'protão' : 'protões'}${v.nn ? ` e ${v.nn} ${v.nn === 1 ? 'neutrão' : 'neutrões'}` : ''}. Ampliado tanto quanto eu estou aqui, seria ${v.size}. E mesmo assim tem quase todo o meu peso!`,
    sci: v => `${v.p} p + ${v.nn} n. Raio de cerca de 1,2·A^(1/3) fm = ${v.r} fm, por isso com esta ampliação teria ${v.d} de diâmetro. O átomo (raio ${v.R} pm) é cerca de ${v.ratio} vezes maior, e o núcleo tem ${v.share} % da sua massa.`,
  },
  core: {
    kid: v => `Encolhemos até à minha nuvem mais interior, a 1s, junto ao núcleo. Os seus eletrões são puxados com força pelos meus ${v.z} protões.`,
    sci: v => `1s: carga efetiva ${v.zeff}; os seus eletrões estão mais vezes a cerca de ${v.pm} pm do núcleo, ${v.ratio} vezes mais perto do que os da camada exterior.`,
  },
  exception: {
    kid: v => `Uma curiosidade: eu fujo um pouco à regra de enchimento. ${v.half ? 'Um eletrão muda de nuvem, porque um conjunto de nuvens meio cheio ou cheio é mais estável.' : 'As minhas nuvens têm energias tão próximas que os meus eletrões encontram um arranjo mais confortável.'}`,
    sci: v => `A regra de Madelung prevê ${v.rule}; o estado fundamental é ${v.real}${v.half ? ': um subnível semipreenchido ou preenchido é mais estável.' : ': estes subníveis têm energias tão próximas que a repulsão entre eletrões os reordena.'}`,
  },
  predicted: {
    kid: 'Ninguém fez átomos meus suficientes para medir os meus eletrões: este arranjo é a melhor previsão dos cientistas.',
    sci: 'Configuração prevista (cálculos relativistas); ainda não medida.',
  },
  zoom: { kid: 'Encolhe-te', sci: 'Zoom' },
  scale: { kid: 'Aqui tudo está tão ampliado que um grão de areia seria maior do que a Terra.', sci: v => `Ampliado cerca de ${v.mag} vezes.` },
  panel: {
    map: {
      title: 'Mapa dos eletrões',
      intro: {
        kid: 'Cada eletrão vive numa nuvem chamada orbital. Há nuvens de quatro formas, s, p, d e f: as mesmas letras dos blocos da tabela periódica. Toca num nome para veres essas nuvens, ou numa caixa para veres uma nuvem sozinha; toca outra vez para a seguinte.',
        sci: 'As linhas são camadas (n), as colunas subníveis (l: s, p, d, f), as caixas orbitais (m), as setas eletrões e os seus spins: dois por orbital, de spins opostos (Pauli), espalhados antes de emparelharem (Hund). Os mesmos blocos dão forma à tabela periódica.',
      },
      rows: { shell: 'Camada n', shape: 'Forma l', orbitals: 'Orbitais', here: 'Eletrões aqui', nodes: 'Nós', zeff: 'Carga efetiva (Slater)', order: 'Ordem de preenchimento', unpaired: 'Eletrões desemparelhados', config: 'Configuração' },
      nodes: v => `${v.rn} ${v.rn === 1 ? 'esférico' : 'esféricos'}, ${v.an} ${v.an === 1 ? 'angular' : 'angulares'}`,
      unpaired: { kid: v => (v.u ? `${v.u === 1 ? 'Um eletrão está sozinho na sua nuvem' : `${v.u} eletrões estão sozinhos nas suas nuvens`}: eletrões sozinhos portam-se como ímanes minúsculos.` : 'Todos os eletrões têm par: nenhum fica sozinho.'), sci: '' },
      model: 'Desenhado com as orbitais exatas do hidrogénio, dimensionadas pela carga nuclear efetiva (regras de Slater): as formas são exatas para o hidrogénio e próximas para os outros átomos; os tamanhos são um modelo.',
      showAll: 'Mostrar todos os eletrões',
    },
    camera: {
      title: 'Câmara de eletrões',
      text: {
        kid: 'Um eletrão não é uma bolinha a zunir às voltas. Até olhares, é uma nuvem de possibilidades. Cada fotografia encontra-o num sítio, nunca o mesmo duas vezes. Tira muitas fotografias e a nuvem aparece a partir dos pontos.',
        sci: 'Regra de Born: a densidade de probabilidade de encontrar o eletrão num ponto é |ψ|². Cada fotografia é uma medição da posição sorteada dessa densidade; com medições suficientes, reaparece a orbital.',
      },
      count: n => (n === 1 ? '1 fotografia' : `${n} fotografias`),
      take10: 'Tirar 10 fotografias',
      take100: 'Tirar 100 fotografias',
      hide: 'Esconder a nuvem',
      show: 'Mostrar a nuvem',
      clear: 'Apagar as fotografias',
    },
    nucleus: { title: 'O núcleo' },
  },
}

const PL = {
  title: 'Wnętrze atomu',
  back: 'Z powrotem do sali',
  board: {
    title: 'Mapa elektronów',
    all: z => (z === 1 ? 'Jedyny elektron' : `Wszystkie elektrony (${z})`),
    hint: 'Dotknij nazwy chmury albo jednej z jej kratek',
    config: 'Konfiguracja',
  },
  label: { board: 'mapę elektronów', camera: 'aparat do elektronów', nucleus: 'jądro' },
  verb: { board: 'Wybierz chmurę', camera: 'Zrób zdjęcie', look: 'Zobacz', talk: 'Porozmawiaj' },
  greet: {
    kid: v => (v.z === 1
      ? 'Witaj w moim wnętrzu! Ta świecąca mgiełka to mój jedyny elektron. To nie kuleczka, która krąży: to chmura. Dotknij mapy elektronów, żeby wybrać, co widzisz.'
      : `Witaj w moim wnętrzu! Ta świecąca mgiełka to moje ${v.z} ${plPlural(v.z, 'elektron', 'elektrony', 'elektronów')}. To nie kuleczki, które krążą: każdy jest chmurą. Dotknij mapy elektronów, żeby zobaczyć kształt każdej chmury.`),
    sci: v => `Jesteś wewnątrz atomu (${v.name}), powiększonego około ${v.mag} razy. Blask pokazuje, gdzie ${v.z === 1 ? 'jego elektron najpewniej jest' : `jego ${v.z} ${plPlural(v.z, 'elektron', 'elektrony', 'elektronów')} najpewniej są`}: orbitale mechaniki kwantowej, nie orbity. Mapa pokazuje jedną podpowłokę albo jeden orbital naraz.`,
  },
  all: {
    kid: v => (v.z === 1
      ? 'Oto mój jedyny elektron: jedna chmura wokół mojego jądra.'
      : `Oto wszystkie moje elektrony naraz (jest ich ${v.z}), warstwami jak cebula: wewnętrzne tulą się do jądra, zewnętrzne spotykają inne atomy. Przesuń suwak, żeby się zmniejszyć i zanurkować do środka.`),
    sci: 'Wszystkie elektrony: każda podpowłoka świeci tam, gdzie jej elektrony bywają najczęściej (rozkład radialny), w kolorze swojego bloku. Wewnętrzne powłoki są mocno przyciągnięte przez jądro; suwak powiększenia zabiera cię do nich.',
  },
  sub: {
    s: {
      kid: v => `Moja chmura ${v.id} jest okrągła jak piłka${v.n > 1 ? `, a w środku ma ${v.rn === 1 ? 'pustą warstwę' : `${v.rn} ${plPlural(v.rn, 'pustą warstwę', 'puste warstwy', 'pustych warstw')}`}, gdzie elektronu nigdy nie ma` : ''}. ${v.count === 2 ? 'Dzielą ją dwa elektrony o przeciwnych spinach.' : 'Mieszka w niej jeden elektron.'}`,
      sci: v => `${v.id}: l = 0, sferyczny, ${v.rn} ${plPlural(v.rn, 'węzeł radialny', 'węzły radialne', 'węzłów radialnych')}. Mieści 2; tu ${v.count}. Ładunek efektywny ${v.zeff} (Slater).`,
    },
    p: {
      kid: v => `Moje chmury ${v.id} to trzy hantle, po jednej w każdym kierunku. Każda mieści dwa elektrony, więc zmieści się sześć; mam tu ${v.count}.`,
      sci: v => `${v.id}: l = 1, trzy orbitale wzdłuż x, y i z, każdy z płaszczyzną węzłową; ${v.rn} ${plPlural(v.rn, 'węzeł radialny', 'węzły radialne', 'węzłów radialnych')}. Mieści 6; tu ${v.count}. Ładunek efektywny ${v.zeff} (Slater).`,
    },
    d: {
      kid: v => `Moje chmury ${v.id}: jest ich pięć, cztery jak czterolistne koniczyny i jedna jak hantla z obręczą. Zmieści się dziesięć elektronów; mam tu ${v.count}.`,
      sci: v => `${v.id}: l = 2, pięć orbitali (dxy, dxz, dyz, dx²−y², dz²), każdy z dwoma węzłami kątowymi. Mieści 10; tu ${v.count}. Ładunek efektywny ${v.zeff} (Slater).`,
    },
    f: {
      kid: v => `Moje chmury ${v.id} są najbardziej wymyślne: siedem, jak kwiaty o sześciu albo ośmiu płatkach. Zmieści się czternaście elektronów; mam tu ${v.count}.`,
      sci: v => `${v.id}: l = 3, siedem orbitali, każdy z trzema węzłami kątowymi. Mieści 14; tu ${v.count}. Ładunek efektywny ${v.zeff} (Slater).`,
    },
  },
  empty: { kid: 'Te bladsze są puste: to wolne miejsca.', sci: 'Blade orbitale są puste.' },
  one: {
    kid: v => `Tylko jedna chmura ${v.id}. Jej dwa kolory to dwie połówki fali elektronu; tam, gdzie się stykają, elektronu nigdy nie ma. ${['Jest pusta: wolne miejsce, które czeka na elektron.', 'Mieszka tu jeden elektron.', 'Dzielą ją dwa elektrony o przeciwnych spinach.'][v.e]}`,
    sci: v => `${v.label}: ψ = R(r)·Y(θ, φ). Kolory to znak ψ; zeruje się na ${v.rn} ${plPlural(v.rn, 'węźle sferycznym', 'węzłach sferycznych', 'węzłach sferycznych')} i ${v.an} ${plPlural(v.an, 'węźle kątowym', 'węzłach kątowych', 'węzłach kątowych')}. ${['Pusty.', 'Jeden elektron.', 'Dwa elektrony o przeciwnych spinach (Pauli).'][v.e]}`,
  },
  photo: {
    first: {
      kid: 'Pstryk! Aparat znalazł mój elektron, właśnie tam. Zrób następne zdjęcie, a będzie gdzie indziej: nikt nie powie, gdzie będzie za chwilę, tylko gdzie pewnie będzie.',
      sci: 'Jeden pomiar położenia: elektron znajduje się w punkcie wylosowanym z gęstością prawdopodobieństwa |ψ|² (reguła Borna). Każde zdjęcie to nowy pomiar.',
    },
    some: { kid: 'Widzisz, jak kropki zbierają się tam, gdzie chmura jest najgęstsza?', sci: 'Kropki gromadzą się tam, gdzie |ψ|² jest największe.' },
    many: {
      kid: 'Teraz kropki same rysują moją chmurę. Tym właśnie jest chmura: wszystkimi miejscami, gdzie pewnie znajdziesz elektron.',
      sci: 'Kropki odtwarzają już orbital: dziewięć na dziesięć leży wewnątrz narysowanej powierzchni, granicy 90 %.',
    },
  },
  nucleus: {
    kid: v => `Ta malutka iskierka to moje jądro: ${v.p} ${plPlural(v.p, 'proton', 'protony', 'protonów')}${v.nn ? ` i ${v.nn} ${plPlural(v.nn, 'neutron', 'neutrony', 'neutronów')}` : ''}. Powiększone tak jak ja tutaj, byłoby ${v.size}. A jednak to w nim jest prawie cała moja waga!`,
    sci: v => `${v.p} p + ${v.nn} n. Promień około 1,2·A^(1/3) fm = ${v.r} fm, więc w tym powiększeniu miałoby ${v.d} średnicy. Atom (promień ${v.R} pm) jest około ${v.ratio} razy większy, a jądro skupia ${v.share} % jego masy.`,
  },
  core: {
    kid: v => `Zmniejszyliśmy się aż do mojej najgłębszej chmury, 1s, tuż przy jądrze. Jej elektrony przyciąga mocno ${v.z} ${plPlural(v.z, 'proton', 'protony', 'protonów')}.`,
    sci: v => `1s: ładunek efektywny ${v.zeff}; jej elektrony są najczęściej około ${v.pm} pm od jądra, ${v.ratio} razy bliżej niż elektrony zewnętrznej powłoki.`,
  },
  exception: {
    kid: v => `Ciekawostka: trochę łamię regułę zapełniania. ${v.half ? 'Jeden elektron przenosi się do innej chmury, bo zestaw chmur zapełniony do połowy albo całkiem jest szczególnie stabilny.' : 'Moje chmury mają tak podobne energie, że elektrony znajdują wygodniejsze ułożenie.'}`,
    sci: v => `Reguła Madelunga przewiduje ${v.rule}; stan podstawowy to ${v.real}${v.half ? ': podpowłoka zapełniona do połowy albo całkiem jest szczególnie trwała.' : ': energie tych podpowłok są tak bliskie, że odpychanie elektronów zmienia ich kolejność.'}`,
  },
  predicted: {
    kid: 'Nikt nie zrobił tyle moich atomów, żeby zmierzyć moje elektrony: to ułożenie to najlepsze przewidywanie naukowców.',
    sci: 'Konfiguracja przewidywana (obliczenia relatywistyczne); jeszcze niezmierzona.',
  },
  zoom: { kid: 'Zmniejsz się', sci: 'Powiększenie' },
  scale: { kid: 'Wszystko jest tu tak powiększone, że ziarenko piasku byłoby większe niż Ziemia.', sci: v => `Powiększenie około ${v.mag} razy.` },
  panel: {
    map: {
      title: 'Mapa elektronów',
      intro: {
        kid: 'Każdy elektron mieszka w chmurze zwanej orbitalem. Chmury mają cztery kształty, s, p, d i f: te same litery co bloki układu okresowego. Dotknij nazwy, żeby zobaczyć te chmury, albo kratki, żeby zobaczyć jedną chmurę; dotknij jeszcze raz, żeby zobaczyć następną.',
        sci: 'Wiersze to powłoki (n), kolumny podpowłoki (l: s, p, d, f), kratki orbitale (m), strzałki elektrony i ich spiny: dwa na orbital o przeciwnych spinach (Pauli), najpierw pojedynczo, potem w parach (Hund). Te same bloki tworzą układ okresowy.',
      },
      rows: { shell: 'Powłoka n', shape: 'Kształt l', orbitals: 'Orbitale', here: 'Elektrony tutaj', nodes: 'Węzły', zeff: 'Ładunek efektywny (Slater)', order: 'Kolejność zapełniania', unpaired: 'Elektrony niesparowane', config: 'Konfiguracja' },
      nodes: v => `${v.rn} ${plPlural(v.rn, 'sferyczny', 'sferyczne', 'sferycznych')}, ${v.an} ${plPlural(v.an, 'kątowy', 'kątowe', 'kątowych')}`,
      unpaired: { kid: v => (v.u ? `${v.u === 1 ? 'Jeden elektron jest sam w swojej chmurze' : `${v.u} ${plPlural(v.u, 'elektron jest sam', 'elektrony są same', 'elektronów jest samych')} w swoich chmurach`}: samotne elektrony zachowują się jak malutkie magnesy.` : 'Każdy elektron ma parę: żaden nie jest sam.'), sci: '' },
      model: 'Narysowane z dokładnych orbitali wodoru, przeskalowanych przez efektywny ładunek jądra (reguły Slatera): kształty są dokładne dla wodoru i bliskie dla innych atomów; rozmiary to model.',
      showAll: 'Pokaż wszystkie elektrony',
    },
    camera: {
      title: 'Aparat do elektronów',
      text: {
        kid: 'Elektron to nie malutka kulka, która śmiga w kółko. Dopóki nie patrzysz, jest chmurą możliwości. Każde zdjęcie znajduje go w jednym miejscu, nigdy dwa razy w tym samym. Zrób dużo zdjęć, a z kropek wyłoni się chmura.',
        sci: 'Reguła Borna: gęstość prawdopodobieństwa znalezienia elektronu w punkcie to |ψ|². Każde zdjęcie to jeden pomiar położenia wylosowany z tej gęstości; dość pomiarów odtwarza orbital.',
      },
      count: n => `${n} ${plPlural(n, 'zdjęcie', 'zdjęcia', 'zdjęć')}`,
      take10: 'Zrób 10 zdjęć',
      take100: 'Zrób 100 zdjęć',
      hide: 'Ukryj chmurę',
      show: 'Pokaż chmurę',
      clear: 'Usuń zdjęcia',
    },
    nucleus: { title: 'Jądro' },
  },
}

const DE = {
  title: 'Im Inneren des Atoms',
  back: 'Zurück in die Halle',
  board: {
    title: 'Elektronenkarte',
    all: z => (z === 1 ? 'Das eine Elektron' : `Alle ${z} Elektronen`),
    hint: 'Tippe auf den Namen einer Wolke oder auf eines ihrer Kästchen',
    config: 'Konfiguration',
  },
  label: { board: 'die Elektronenkarte', camera: 'die Elektronenkamera', nucleus: 'den Atomkern' },
  verb: { board: 'Wähle eine Wolke', camera: 'Mach ein Foto', look: 'Betrachte', talk: 'Sprich mit' },
  greet: {
    kid: v => (v.z === 1
      ? 'Willkommen in meinem Inneren! Dieser leuchtende Nebel ist mein einziges Elektron. Es ist kein Kügelchen, das herumsaust: Es ist eine Wolke. Tippe auf die Elektronenkarte, um auszuwählen, was du siehst.'
      : `Willkommen in meinem Inneren! Dieser leuchtende Nebel sind meine ${v.z} Elektronen. Es sind keine Kügelchen, die herumsausen: Jedes ist eine Wolke. Tippe auf die Elektronenkarte, um die Form jeder Wolke zu sehen.`),
    sci: v => `Du bist in einem Atom des Elements ${v.name}, etwa ${v.mag}-fach vergrößert. Das Leuchten zeigt, wo ${v.z === 1 ? 'sein Elektron' : `seine ${v.z} Elektronen`} wahrscheinlich anzutreffen ${v.z === 1 ? 'ist' : 'sind'}: Orbitale der Quantenmechanik, keine Umlaufbahnen. Die Karte zeigt jeweils eine Unterschale oder ein Orbital.`,
  },
  all: {
    kid: v => (v.z === 1
      ? 'Hier ist mein einziges Elektron: eine einzige Wolke um meinen Kern.'
      : `Hier sind alle ${v.z} Elektronen auf einmal, in Schichten wie eine Zwiebel: Die inneren schmiegen sich an den Kern, die äußeren treffen andere Atome. Schieb den Regler, um dich zu verkleinern und hineinzutauchen.`),
    sci: 'Alle Elektronen: Jede Unterschale leuchtet dort, wo ihre Elektronen am häufigsten sind (ihre radiale Verteilung), in der Farbe ihres Blocks. Die inneren Schalen zieht der Kern eng heran; der Zoom-Regler bringt dich zu ihnen.',
  },
  sub: {
    s: {
      kid: v => `Meine ${v.id}-Wolke ist rund wie ein Ball${v.n > 1 ? `, mit ${v.rn === 1 ? 'einer hohlen Schicht' : `${v.rn} hohlen Schichten`} darin, wo das Elektron nie ist` : ''}. ${v.count === 2 ? 'Zwei Elektronen teilen sie sich, mit entgegengesetztem Spin.' : 'Ein Elektron wohnt darin.'}`,
      sci: v => `${v.id}: l = 0, kugelförmig, ${v.rn} ${v.rn === 1 ? 'radialer Knoten' : 'radiale Knoten'}. Fasst 2; hier ${v.count}. Effektive Ladung ${v.zeff} (Slater).`,
    },
    p: {
      kid: v => `Meine ${v.id}-Wolken sind drei Hanteln, eine in jede Richtung. Jede fasst zwei Elektronen, also passen sechs hinein; ich habe hier ${v.count}.`,
      sci: v => `${v.id}: l = 1, drei Orbitale entlang x, y und z, jedes mit einer Knotenebene; ${v.rn} ${v.rn === 1 ? 'radialer Knoten' : 'radiale Knoten'}. Fasst 6; hier ${v.count}. Effektive Ladung ${v.zeff} (Slater).`,
    },
    d: {
      kid: v => `Meine ${v.id}-Wolken: fünf Stück, vier wie vierblättrige Kleeblätter und eine wie eine Hantel mit Ring. Zehn Elektronen passen hinein; ich habe hier ${v.count}.`,
      sci: v => `${v.id}: l = 2, fünf Orbitale (dxy, dxz, dyz, dx²−y², dz²), jedes mit zwei Winkelknoten. Fasst 10; hier ${v.count}. Effektive Ladung ${v.zeff} (Slater).`,
    },
    f: {
      kid: v => `Meine ${v.id}-Wolken sind die verrücktesten: sieben Stück, wie Blumen mit sechs oder acht Blütenblättern. Vierzehn Elektronen passen hinein; ich habe hier ${v.count}.`,
      sci: v => `${v.id}: l = 3, sieben Orbitale, jedes mit drei Winkelknoten. Fasst 14; hier ${v.count}. Effektive Ladung ${v.zeff} (Slater).`,
    },
  },
  empty: { kid: 'Die blassen sind leer: noch freie Plätze.', sci: 'Die blassen Orbitale sind leer.' },
  one: {
    kid: v => `Nur eine ${v.id}-Wolke. Ihre zwei Farben sind die zwei Hälften der Elektronenwelle; wo sie sich treffen, ist das Elektron nie. ${['Sie ist leer: ein freier Platz, der auf ein Elektron wartet.', 'Hier wohnt ein Elektron.', 'Zwei Elektronen teilen sie sich, mit entgegengesetztem Spin.'][v.e]}`,
    sci: v => `${v.label}: ψ = R(r)·Y(θ, φ). Die Farben sind das Vorzeichen von ψ; es ist null auf ${v.rn} Kugelknoten und ${v.an} Winkelknoten. ${['Leer.', 'Ein Elektron.', 'Zwei Elektronen mit entgegengesetztem Spin (Pauli).'][v.e]}`,
  },
  photo: {
    first: {
      kid: 'Klick! Die Kamera hat mein Elektron gefunden, genau dort. Mach noch eins, und es ist woanders: Niemand kann sagen, wo es als Nächstes ist, nur wo es wahrscheinlich ist.',
      sci: 'Eine Ortsmessung: Das Elektron wird an einem zufälligen Punkt gefunden, mit der Wahrscheinlichkeitsdichte |ψ|² (Bornsche Regel). Jedes Foto ist eine neue Messung.',
    },
    some: { kid: 'Siehst du, wie sich die Punkte dort sammeln, wo die Wolke am dichtesten ist?', sci: 'Die Punkte häufen sich dort, wo |ψ|² am größten ist.' },
    many: {
      kid: 'Jetzt zeichnen die Punkte meine Wolke ganz von selbst. Genau das ist die Wolke: alle Orte, an denen man das Elektron wahrscheinlich findet.',
      sci: 'Die Punkte bilden nun das Orbital nach: Neun von zehn liegen innerhalb der gezeichneten Hülle, der 90-%-Grenzfläche.',
    },
  },
  nucleus: {
    kid: v => `Dieser winzige Funke ist mein Kern: ${v.p} ${v.p === 1 ? 'Proton' : 'Protonen'}${v.nn ? ` und ${v.nn} ${v.nn === 1 ? 'Neutron' : 'Neutronen'}` : ''}. So stark vergrößert wie ich hier wäre er ${v.size}. Und doch steckt fast mein ganzes Gewicht darin!`,
    sci: v => `${v.p} p + ${v.nn} n. Radius etwa 1,2·A^(1/3) fm = ${v.r} fm, bei dieser Vergrößerung also ${v.d} im Durchmesser. Das Atom (Radius ${v.R} pm) ist etwa ${v.ratio}-mal größer, und der Kern trägt ${v.share} % seiner Masse.`,
  },
  core: {
    kid: v => `Wir sind bis zu meiner innersten Wolke geschrumpft, 1s, direkt am Kern. Ihre Elektronen werden von meinen ${v.z} Protonen fest herangezogen.`,
    sci: v => `1s: effektive Ladung ${v.zeff}; ihre Elektronen sind meist etwa ${v.pm} pm vom Kern entfernt, ${v.ratio}-mal näher als die der äußersten Schale.`,
  },
  exception: {
    kid: v => `Lustig: Ich breche die Füllregel ein bisschen. ${v.half ? 'Ein Elektron wechselt in eine andere Wolke, weil ein halb volles oder volles Wolkenset besonders stabil ist.' : 'Meine Wolken liegen energetisch so nah beieinander, dass meine Elektronen eine bequemere Anordnung finden.'}`,
    sci: v => `Die Madelung-Regel sagt ${v.rule} voraus; der Grundzustand ist ${v.real}${v.half ? ': Eine halb oder ganz gefüllte Unterschale ist besonders stabil.' : ': Diese Unterschalen liegen energetisch so nah, dass die Abstoßung der Elektronen ihre Reihenfolge ändert.'}`,
  },
  predicted: {
    kid: 'Niemand hat genug Atome von mir hergestellt, um meine Elektronen zu messen: Diese Anordnung ist die beste Vorhersage der Forschung.',
    sci: 'Vorhergesagte Konfiguration (relativistische Rechnungen); noch nicht gemessen.',
  },
  zoom: { kid: 'Mach dich klein', sci: 'Zoom' },
  scale: { kid: 'Hier ist alles so stark vergrößert, dass ein Sandkorn größer wäre als die Erde.', sci: v => `Etwa ${v.mag}-fach vergrößert.` },
  panel: {
    map: {
      title: 'Elektronenkarte',
      intro: {
        kid: 'Jedes Elektron wohnt in einer Wolke, die Orbital heißt. Es gibt Wolken in vier Formen, s, p, d und f: dieselben Buchstaben wie die Blöcke des Periodensystems. Tippe auf einen Namen, um diese Wolken zu sehen, oder auf ein Kästchen für eine Wolke allein; tippe noch einmal für die nächste.',
        sci: 'Zeilen sind Schalen (n), Spalten Unterschalen (l: s, p, d, f), Kästchen Orbitale (m), Pfeile Elektronen mit ihrem Spin: zwei pro Orbital mit entgegengesetztem Spin (Pauli), erst einzeln verteilt, dann gepaart (Hund). Dieselben Blöcke formen das Periodensystem.',
      },
      rows: { shell: 'Schale n', shape: 'Form l', orbitals: 'Orbitale', here: 'Elektronen hier', nodes: 'Knoten', zeff: 'Effektive Ladung (Slater)', order: 'Füllreihenfolge', unpaired: 'Ungepaarte Elektronen', config: 'Konfiguration' },
      nodes: v => `${v.rn} Kugelknoten, ${v.an} Winkelknoten`,
      unpaired: { kid: v => (v.u ? `${v.u === 1 ? 'Ein Elektron ist allein in seiner Wolke' : `${v.u} Elektronen sind allein in ihren Wolken`}: Einzelne Elektronen verhalten sich wie winzige Magnete.` : 'Jedes Elektron hat einen Partner: Keines ist allein.'), sci: '' },
      model: 'Gezeichnet mit den exakten Orbitalen des Wasserstoffs, skaliert mit der effektiven Kernladung (Slater-Regeln): Die Formen sind für Wasserstoff exakt und für andere Atome ähnlich; die Größen sind ein Modell.',
      showAll: 'Alle Elektronen zeigen',
    },
    camera: {
      title: 'Elektronenkamera',
      text: {
        kid: 'Ein Elektron ist kein winziges Kügelchen, das herumsaust. Bis du hinschaust, ist es eine Wolke von Möglichkeiten. Jedes Foto findet es an einem Ort, nie zweimal am selben. Mach viele Fotos, und aus den Punkten erscheint die Wolke.',
        sci: 'Bornsche Regel: Die Wahrscheinlichkeitsdichte, das Elektron an einem Punkt zu finden, ist |ψ|². Jedes Foto ist eine Ortsmessung, gezogen aus dieser Dichte; genug davon ergeben das Orbital.',
      },
      count: n => (n === 1 ? '1 Foto' : `${n} Fotos`),
      take10: '10 Fotos machen',
      take100: '100 Fotos machen',
      hide: 'Wolke ausblenden',
      show: 'Wolke zeigen',
      clear: 'Fotos löschen',
    },
    nucleus: { title: 'Der Atomkern' },
  },
}

export const WORDS = { en: EN, 'pt-pt': PT, pl: PL, de: DE }
export const wordsFor = lang => WORDS[lang] ?? EN
