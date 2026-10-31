// Bible passages through the worlds (the user, 2026-10-31: "interweave passages from the Bible throughout the
// world, relevant to where they are placed; for Explorer the NLT, for Scientist the CSB"). Each place quotes
// one passage about what stands there: the hall of an element, a wing, a forge, the plaza's sky. The words,
// word for word, in verses.json (scripts/data/fetch_verses.py fetches them; passages.json lists what is
// quoted); why each stands where it does in why.js. docs/knowledge/scripture.md.
import VERSES from './verses.json' with { type: 'json' }
import WHY from './why.js'
import { inLang } from '../../i18n/langs.js'

/** The translations, by the code the fetcher keeps: the Bible App's number (`yv`, for links to it), the
 *  short name shown after a quote, the full name and the publisher's notice (the About box lists them; each
 *  publisher allows quotations this size with it). */
export const VERSIONS = {
  NLT: { yv: 116, short: 'NLT', name: 'Holy Bible, New Living Translation', notice: 'Scripture quotations marked NLT are taken from the Holy Bible, New Living Translation, copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Carol Stream, Illinois 60188. All rights reserved.' },
  CSB: { yv: 1713, short: 'CSB', name: 'Christian Standard Bible', notice: 'Scripture quotations marked CSB have been taken from the Christian Standard Bible®, Copyright © 2017 by Holman Bible Publishers. Used by permission. Christian Standard Bible® and CSB® are federally registered trademarks of Holman Bible Publishers.' },
  BPT09: { yv: 432, short: 'BPT', name: 'a BÍBLIA para todos, Edição Comum', notice: 'Citações marcadas BPT: a BÍBLIA para todos, Edição Comum, Copyright © 1993, 2009 Sociedade Bíblica de Portugal.' },
  ARC: { yv: 215, short: 'ARC', name: 'Almeida Revista e Corrigida (Portugal)', notice: 'Citações marcadas ARC: Almeida Revista e Corrigida, edição de 1898 atualizada em 1968, Sociedade Bíblica de Portugal.' },
  SNP: { yv: 2095, short: 'SNP', name: 'Biblia, to jest Pismo Święte Starego i Nowego Przymierza, wydanie pierwsze 2018', notice: 'Cytaty oznaczone SNP: Biblia, to jest Pismo Święte Starego i Nowego Przymierza, wydanie pierwsze 2018, © Ewangeliczny Instytut Biblijny.' },
  BW1975: { yv: 3490, short: 'BW', name: 'Biblia Warszawska', notice: 'Cytaty oznaczone BW: Biblia Warszawska, © 1975-2020 Towarzystwo Biblijne w Polsce.' },
  HFA: { yv: 73, short: 'HFA', name: 'Hoffnung für alle', notice: 'Mit HFA gekennzeichnete Zitate: Hoffnung für alle®, Copyright © 1983, 1996, 2002, 2015 by Biblica, Inc.®' },
  SCH2000: { yv: 157, short: 'SLT', name: 'Die Bibel, Schlachter 2000', notice: 'Mit SLT gekennzeichnete Zitate: Die Bibel, Schlachter 2000, © 2000 Genfer Bibelgesellschaft.' },
}

/** The books quoted, as each language cites them (Polish and German with a comma before the verse). */
const BOOKS = {
  GEN: { en: 'Genesis', 'pt-pt': 'Génesis', pl: 'Rodzaju', de: '1. Mose' },
  EXO: { en: 'Exodus', 'pt-pt': 'Êxodo', pl: 'Wyjścia', de: '2. Mose' },
  LEV: { en: 'Leviticus', 'pt-pt': 'Levítico', pl: 'Kapłańska', de: '3. Mose' },
  DEU: { en: 'Deuteronomy', 'pt-pt': 'Deuteronómio', pl: 'Powtórzonego Prawa', de: '5. Mose' },
  JOB: { en: 'Job', 'pt-pt': 'Job', pl: 'Hioba', de: 'Hiob' },
  PSA: { en: 'Psalm', 'pt-pt': 'Salmo', pl: 'Psalm', de: 'Psalm' },
  PRO: { en: 'Proverbs', 'pt-pt': 'Provérbios', pl: 'Przysłów', de: 'Sprüche' },
  ISA: { en: 'Isaiah', 'pt-pt': 'Isaías', pl: 'Izajasza', de: 'Jesaja' },
  LAM: { en: 'Lamentations', 'pt-pt': 'Lamentações', pl: 'Lamentacje', de: 'Klagelieder' },
  EZK: { en: 'Ezekiel', 'pt-pt': 'Ezequiel', pl: 'Ezechiela', de: 'Hesekiel' },
  DAN: { en: 'Daniel', 'pt-pt': 'Daniel', pl: 'Daniela', de: 'Daniel' },
  MAT: { en: 'Matthew', 'pt-pt': 'Mateus', pl: 'Mateusza', de: 'Matthäus' },
  MRK: { en: 'Mark', 'pt-pt': 'Marcos', pl: 'Marka', de: 'Markus' },
  JHN: { en: 'John', 'pt-pt': 'João', pl: 'Jana', de: 'Johannes' },
  COL: { en: 'Colossians', 'pt-pt': 'Colossenses', pl: 'Kolosan', de: 'Kolosser' },
  HEB: { en: 'Hebrews', 'pt-pt': 'Hebreus', pl: 'Hebrajczyków', de: 'Hebräer' },
  JAS: { en: 'James', 'pt-pt': 'Tiago', pl: 'Jakuba', de: 'Jakobus' },
  REV: { en: 'Revelation', 'pt-pt': 'Apocalipse', pl: 'Objawienie', de: 'Offenbarung' },
}

/** 'PSA.19.2' as the language cites it: Psalm 19:1 (the verse numbers are the translation's own). */
export function citeOf(ref, lang) {
  const [book, ch, vs] = ref.split('.')
  const sep = lang === 'pl' || lang === 'de' ? ',' : ':'
  return `${inLang(BOOKS[book], lang) ?? book} ${ch}${sep}${vs}`
}

/** The word for "the Bible", the kicker over a passage's panel. */
const BIBLE = { en: 'The Bible', 'pt-pt': 'A Bíblia', pl: 'Biblia', de: 'Die Bibel' }
const READ = { en: 'Read', 'pt-pt': 'Ler', pl: 'Przeczytaj', de: 'Lies' }
// the passage's verse in the Bible App, where its chapter, its pictures and its plans are (appUrl)
const APP = { en: 'Read it in the Bible App', 'pt-pt': 'Ler na aplicação da Bíblia', pl: 'Czytaj w aplikacji Biblia', de: 'In der Bibel-App lesen' }

export const hasPassage = id => id in VERSES

/** A passage in the language at the level: { text, cite (Psalm 19:1), version (NLT), label (Psalm 19:1, NLT) }. */
export function verseOf(id, lang, level) {
  const entry = VERSES[id]
  if (!entry) return null
  const l = entry[lang] ?? entry.en
  const q = level === 'scientist' ? l.sci : l.kid
  const cite = citeOf(q.ref, lang in BOOKS.GEN ? lang : 'en')
  const version = VERSIONS[q.v]?.short ?? q.v
  return { text: q.text, cite, version, label: `${cite} (${version})` }
}

/** Why the passage stands where it does, for the level (one or two sentences). */
export function whyOf(id, lang, level) {
  const w = inLang(WHY[id], lang)
  return (level === 'scientist' ? w?.sci : null) ?? w?.kid ?? null
}

/** The passage on bible.com in the translation the level quotes, opened on its verses (the Bible App on a
 *  phone that has it): the whole chapter is a tap away there, with the app's pictures and plans for it
 *  (the user, 2026-10-31: better than the chapter fetched into the game). */
export function appUrl(id, lang, level) {
  const entry = VERSES[id]
  if (!entry) return null
  const l = entry[lang] ?? entry.en
  const q = level === 'scientist' ? l.sci : l.kid
  return `https://www.bible.com/bible/${VERSIONS[q.v].yv}/${q.ref}`
}

/** The panel a passage opens: the words, the reference and the translation, why it stands here, and the
 *  way to it in the Bible App. */
export function versePanel(id, lang, level, { color = '#ffd98a', kicker } = {}) {
  const v = verseOf(id, lang, level)
  const why = whyOf(id, lang, level)
  return {
    title: v.cite,
    kicker: kicker ?? inLang(BIBLE, lang),
    color,
    blocks: [
      { verse: { text: v.text, cite: v.label } },
      why && { p: why },
      { href: { url: appUrl(id, lang, level), label: `📖 ${inLang(APP, lang)}` } },
    ].filter(Boolean),
  }
}

/** The prompt's verb for a passage ("Read: Psalm 19:1"). */
export const readVerb = lang => inLang(READ, lang)

// elements named after a country, and after a scientist (their halls quote what fits the name)
const NATIONS = ['Ga', 'Ge', 'Ru', 'Po', 'Fr', 'Am', 'Nh']
const SCIENTISTS = ['Gd', 'Cm', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Sg', 'Bh', 'Mt', 'Rg', 'Cn', 'Fl', 'Og']

/** The passage over an element's hall: its own (salt, iron, gold, the rainbow in iridium's name), else
 *  its name's (a country, a scientist), else the superheavies', the radioactive elements' or its family's
 *  (every family but the noble gases and the actinides, whose members all have one of the others). */
export function hallPassage(el) {
  if (hasPassage(el.symbol)) return el.symbol
  if (NATIONS.includes(el.symbol)) return 'nations'
  if (SCIENTISTS.includes(el.symbol)) return 'scientists'
  if (el.z >= 104) return 'superheavy'
  if (el.radioactive) return 'radioactive'
  return el.family
}
