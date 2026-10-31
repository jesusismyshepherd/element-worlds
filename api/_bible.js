// Whole chapters for the verse panels' "Read the whole chapter" (api/chapter.js, docs/knowledge/scripture.md):
// where each translation's chapter comes from, live, and how its page is read into numbered verses. The
// chapters are never kept in the repository: the publishers allow quotations to be copied, not chapters.

// the Bible App's number for each translation (the same in its developer API; src/content/scripture/index.js
// keeps them too, for links, and scripture.test.js checks the two agree)
export const YV = { NLT: 116, CSB: 1713, BPT09: 432, ARC: 215, SNP: 2095, BW1975: 3490, HFA: 73, SCH2000: 157 }

// the books the passages come from, as Tyndale's NLT API names them
export const NLT_BOOKS = {
  GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', DEU: 'Deuteronomy', JOB: 'Job', PSA: 'Psalm', PRO: 'Proverbs',
  ISA: 'Isaiah', LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', MAT: 'Matthew', MRK: 'Mark', JHN: 'John',
  COL: 'Colossians', HEB: 'Hebrews', JAS: 'James', REV: 'Revelation',
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', mdash: '—', ndash: '–', hellip: '…' }
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
  return ENTITIES[e.toLowerCase()] ?? m
})

/** Reads a page of verses into [{ n, text }]: `verseAt(tag, attrs)` says where a verse starts (its
 *  number, or null), `skip(tag, classes)` what is not the text (numbers, notes, headings), `upper(classes)`
 *  the divine name in small capitals, `line(tag, classes)` where a line of poetry starts. */
function readVerses(html, { verseAt, skip, upper, line }) {
  const verses = []
  let cur = null
  let poem = false
  const stack = [] // [tag, skipping, upper]
  const tokens = /<!--[\s\S]*?-->|<(\/?)([a-z][\w-]*)([^>]*?)(\/?)>|([^<]+)/gi
  let pendingLine = false
  for (const m of html.matchAll(tokens)) {
    const [, close, tagRaw, attrs = '', self, text] = m
    if (text != null) {
      const top = stack[stack.length - 1]
      if (!cur || top?.[1] || !text.trim()) {
        if (cur && !top?.[1] && /\s/.test(text) && cur.parts.length) cur.parts.push(' ')
        continue
      }
      if (pendingLine && cur.parts.length) cur.parts.push('\n')
      pendingLine = false
      cur.parts.push(top?.[2] ? decode(text).toUpperCase() : decode(text))
      continue
    }
    if (!tagRaw) continue
    const tag = tagRaw.toLowerCase()
    const classes = (/class="([^"]*)"/i.exec(attrs)?.[1] ?? '').split(/\s+/).filter(Boolean)
    if (close) {
      const i = stack.map(s => s[0]).lastIndexOf(tag)
      if (i >= 0) stack.length = i
      continue
    }
    const n = verseAt(tag, attrs, classes)
    if (n != null && n !== cur?.n) {
      cur = verses.find(v => v.n === n) ?? null
      if (!cur) {
        cur = { n, parts: [] }
        verses.push(cur)
      }
    }
    if (line(tag, classes)) {
      pendingLine = true
      poem = true
    }
    const parent = stack[stack.length - 1]
    if (self || /^(br|img|hr|meta|link|input)$/.test(tag)) continue
    stack.push([tag, !!parent?.[1] || skip(tag, classes), !!parent?.[2] || upper(classes)])
  }
  const out = verses
    .map(v => ({ n: v.n, text: v.parts.join('').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim() }))
    .filter(v => v.text)
  return { verses: out, poem }
}

/** Tyndale's NLT API page (verse_export blocks with vn="N"; numbers in span.vn, notes in a.a-tn and
 *  span.tn, LORD in span.sc, poetry in p.poet1 / p.poet2). */
export function parseNlt(html) {
  return readVerses(html, {
    verseAt: (tag, attrs) => (tag === 'verse_export' ? Number(/\bvn="(\d+)"/.exec(attrs)?.[1]) || null : null),
    skip: (tag, c) => /^h[1-6]$/.test(tag) || c.some(x => ['vn', 'tn', 'a-tn', 'psa-title', 'subhead', 'chapter-number', 'bk_ch_vs_header'].includes(x)),
    upper: c => c.includes('sc'),
    line: (tag, c) => tag === 'p' && c.some(x => x.startsWith('poet')),
  })
}

/** The YouVersion developer API's passage HTML (format=html). Its markup follows the Bible App's reader:
 *  a verse is an element with data-usfm "BOOK.C.V" (or class "v<N>", or v="N"); labels, notes and headings
 *  are left out; lines of poetry are q, q1, q2... blocks. Checked against the API once the app key exists. */
export function parseYouVersion(html) {
  return readVerses(html, {
    verseAt: (tag, attrs, c) => {
      const usfm = /data-usfm="[1-3A-Z]{3}\.\d+\.(\d+)/.exec(attrs)
      if (usfm) return Number(usfm[1])
      const v = /\bv="(\d+)"/.exec(attrs) ?? /\bdata-verse="(\d+)"/.exec(attrs)
      if (v && c.some(x => /verse|yv-v/.test(x))) return Number(v[1])
      const cls = c.find(x => /^v\d+$/.test(x))
      return cls && c.includes('verse') ? Number(cls.slice(1)) : null
    },
    skip: (tag, c) => /^h[1-6]$/.test(tag) || c.some(x => /(^|_|-)(label|note|heading|vlbl|n|s\d?|d|r|ms\d?|mr|cl|ft|fr|x)$/.test(x)),
    upper: c => c.some(x => /(^|_|-)nd$/.test(x)),
    line: (tag, c) => tag === 'div' && c.some(x => /(^|_|-)q[a-z]?\d?$/.test(x)),
  })
}

/** A chapter of the NLT from Tyndale's API: anonymous use allows 50 verses a request, non-commercial
 *  (https://api.nlt.to), so a long chapter is asked for in parts. */
export async function nltChapter(book, ch, get = fetch) {
  const name = NLT_BOOKS[book]
  if (!name) return null
  const verses = []
  let poem = false
  for (let from = 1; from < 400; from += 50) {
    const r = await get(`https://api.nlt.to/api/passages?ref=${encodeURIComponent(`${name}.${ch}.${from}-${from + 49}`)}&version=NLT`)
    if (!r.ok) throw new Error(`NLT API ${r.status}`)
    const part = parseNlt(await r.text())
    verses.push(...part.verses.filter(v => v.n >= from))
    poem ||= part.poem
    if (!part.verses.some(v => v.n === from + 49)) break
  }
  return verses.length ? { verses, poem } : null
}

/** A chapter from the YouVersion developer API (an app key, YVP_APP_KEY, with the translation's licence
 *  accepted in its portal: https://platform.youversion.com). */
export async function youVersionChapter(version, book, ch, key, get = fetch) {
  const id = YV[version]
  if (!id || !key) return null
  const r = await get(`https://api.youversion.com/v1/bibles/${id}/passages/${book}.${ch}?format=html&include_headings=false&include_notes=false`, {
    headers: { 'X-YVP-App-Key': key },
  })
  if (r.status === 403 || r.status === 404) return null // not licensed for this key, or not there
  if (!r.ok) throw new Error(`YouVersion API ${r.status}`)
  const body = await r.json()
  const out = parseYouVersion(String(body.content ?? ''))
  return out.verses.length ? out : null
}
