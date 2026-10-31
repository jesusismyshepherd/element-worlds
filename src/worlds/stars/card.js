// What the Star Forge's card says (ui/StarHud.jsx), from the world's state in the store: the title, the
// lines at the reader's depth, the prompt naming the next tap, a link where one fits. Pure, so the words
// of every state can be checked in every language (words.test.js).
import { nuclide, nuclideSymbol } from '../../chem/nucleus.js'
import { halfLifeText } from '../forge/words.js'
import { phasesOf, lifeYears, NURSERY } from './life.js'
import { wordsOf, at, fill, timeKid, timeSci, tempText, sunsText, listOf, isoName } from './words.js'

/** "The Sun", "A star of 15 suns", "A star of 4.2 suns". */
export function starName(m, lang) {
  const W = wordsOf(lang)
  const n = NURSERY.find(s => Math.abs(s.m - m) < 1e-6)
  return n ? W.names[n.id] : fill(W.starOf, { m: sunsText(m, lang) })
}

/** A phase of a star of m suns in words, at the reader's depth. */
export function phaseText(m, p, lang, level) {
  const W = wordsOf(lang)
  const sci = level === 'scientist'
  const time = sci ? timeSci(p.years, lang) : timeKid(p.years, lang)
  const T = p.T ? tempText(p.T, lang, !sci) : W.cooler
  const entry = p.id === 'h' ? W.h[p.chain] : p.id === 'he' ? W.he[m < 8 ? 'low' : 'big'] : W[p.id]
  const text = fill(at(entry, level), { time, T })
  return p.id === 'h' && m < 0.5 && !sci ? `${text} ${fill(W.h.dwarf, { time })}` : text
}

/** "a star of the Sun's size lives ... makes helium, carbon and oxygen, and then ..." (the Explorer's). */
export function summaryOf(m, lang, end) {
  const W = wordsOf(lang)
  const main = []
  for (const p of phasesOf(m)) {
    for (const z of p.id === 'h' || p.id === 'he' ? p.makes : p.makes.slice(0, 1)) if (!main.includes(z)) main.push(z)
  }
  return fill(W.summary, { name: starName(m, lang), life: timeKid(lifeYears(m), lang), makes: listOf(main.slice(0, 7), lang), end: W.endShort[end] })
}

const halfOf = (Z, N, lang) => {
  const nuc = nuclide(Z, N)
  return nuc.t ? halfLifeText(nuc.t, lang) : ''
}

/**
 * The card for the state s (the store's `stars`): { title, symbol, lines, prompt, sub, link }.
 */
export function cardOf(s, lang, level) {
  const W = wordsOf(lang)
  const sci = level === 'scientist'
  if (s.place === 'slow') {
    const { Z, N, ev } = s.slow
    const lines = []
    const iso = (z, n) => isoName(z, n, lang)
    if (!ev) lines.push(at(W.slow.intro, level))
    else if (ev.op === 'n') {
      const stable = nuclide(Z, N).kind === 'stable'
      lines.push(fill(at(stable ? W.slow.stable : W.slow.caught, level), { iso: iso(Z, N), life: halfOf(Z, N, lang) }))
    } else {
      const k = ev.op === 'A' ? 'alpha' : ev.op === 'B-' ? 'beta' : 'capture'
      lines.push(fill(at(W.slow[k], level), { from: iso(ev.from.Z, ev.from.N), to: iso(ev.to.Z, ev.to.N), life: halfOf(ev.from.Z, ev.from.N, lang) }))
    }
    if (Z === 43) lines.push(W.slow.tc)
    if (ev) lines.push(at(W.slow.intro, level))
    return { title: iso(Z, N), symbol: nuclideSymbol(Z, N, Z), kicker: W.place.slow, lines, prompt: W.prompt.slow }
  }
  if (s.place === 'rapid') {
    const { phase, Z, N, count } = s.rapid
    const key = phase === 'decay' ? 'done' : phase
    const lines = [fill(at(W.rapid[key], level), { count })]
    const prompt = phase === 'orbit' ? W.prompt.merge : phase === 'merge' || phase === 'flood' ? W.prompt.wait : phase === 'cool' ? W.prompt.cool : W.prompt.again
    const showNuc = phase === 'flood' || phase === 'cool'
    return { title: showNuc ? isoName(Z, N, lang) : W.place.rapid, symbol: showNuc ? nuclideSymbol(Z, N, Z) : '', kicker: W.place.rapid, lines, prompt }
  }
  // a star's life
  const { m, i, lit, end } = s
  const ph = phasesOf(m)
  const p = ph[Math.min(i, ph.length - 1)]
  const name = starName(m, lang)
  if (end) {
    const e = at(W.ends[end.kind], level)
    const lines = [fill(e, { life: sci ? timeSci(lifeYears(m), lang) : timeKid(lifeYears(m), lang) })]
    if (end.remnant === 'ns' || end.remnant === 'bh') lines.push(at(W.ends[end.remnant], level))
    if (end.notYet && end.kind !== 'fade') lines.push(W.notYet)
    const prompt = end.remnant === 'ns' ? W.prompt.ns : end.remnant === 'bh' ? W.prompt.bh : W.prompt.wd
    return { title: `${name} · ${W.phase.dead}`, kicker: W.place.star, lines, prompt, sub: W.prompt.pick }
  }
  if (!lit) {
    const lines = [at(W.proto, level)]
    if (!sci) lines.push(summaryOf(m, lang, endKind(m)))
    return { title: `${name} · ${W.phase.proto}`, kicker: W.place.star, lines, prompt: W.prompt.light, sub: W.prompt.pick }
  }
  const lines = [phaseText(m, p, lang, level)]
  if (!sci) lines.push(summaryOf(m, lang, endKind(m)))
  const last = i >= ph.length - 1
  let prompt = last ? W.prompt.die : fill(W.prompt.next, { next: W.nextPhase[ph[i + 1].id] })
  if (p.id === 'agb') prompt = `${prompt}, ${W.prompt.shell}`
  return {
    title: `${name} · ${W.phase[p.id]}`, kicker: W.place.star, lines, prompt, sub: W.prompt.pick,
    link: p.id === 'he' ? { to: '/e/C/stars', label: W.he.link } : null,
  }
}

const endKind = m => (m < 0.5 ? 'fade' : m < 8 ? 'pn' : m < 10 ? 'one' : 'sn')
