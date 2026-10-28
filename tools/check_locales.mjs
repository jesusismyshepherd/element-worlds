// Checks locale files against en.json: parses, every en key present (a plural family en_one/en_other
// counts as present when the language has its own forms of it), the same order of the en keys, every
// {{placeholder}} kept, no em or en dashes, Polish plural families complete (one, few, many, other),
// German (one, other). Then renders the plural keys through i18next for a few counts.
// usage: node check_locales.mjs <repo> [file.json ...]   (default: the repo's pl.json and de.json)
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repo = process.argv[2]
const dir = path.join(repo, 'src/i18n/locales')
const files = process.argv.slice(3)
const targets = files.length ? files.map(f => [path.basename(f, '.json'), f]) : [['pl', path.join(dir, 'pl.json')], ['de', path.join(dir, 'de.json')]]
const en = JSON.parse(fs.readFileSync(path.join(dir, 'en.json'), 'utf8'))

const flat = (o, p = '', out = []) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k
    if (v && typeof v === 'object') flat(v, key, out)
    else out.push([key, v])
  }
  return out
}
const SUFFIX = /_(zero|one|two|few|many|other)$/
const base = k => k.replace(SUFFIX, '')
const holes = s => [...String(s).matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map(m => m[1]).sort().join(',')
const NEED = { pl: ['one', 'few', 'many', 'other'], de: ['one', 'other'] }

let bad = 0
const fail = msg => {
  bad++
  console.log('  FAIL', msg)
}
const enFlat = flat(en)
const enKeys = new Map(enFlat)
const enBases = [...new Set(enFlat.map(([k]) => base(k)))]
for (const [lang, file] of targets) {
  console.log(`${lang}: ${file}`)
  let obj
  try {
    obj = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    fail(`does not parse: ${e.message}`)
    continue
  }
  const f = flat(obj)
  const keys = new Map(f)
  const bases = new Set(f.map(([k]) => base(k)))
  // every en key
  for (const [k, v] of enFlat) {
    if (keys.has(k)) continue
    if (SUFFIX.test(k) && [...keys.keys()].some(x => base(x) === base(k))) continue
    fail(`missing ${k} (${JSON.stringify(v).slice(0, 50)})`)
  }
  // nothing that en does not have (beyond plural forms of an en key)
  for (const [k] of f) if (!enKeys.has(k) && !enBases.includes(base(k))) fail(`extra key ${k}`)
  // order of the en keys' families
  const order = [...new Set(f.map(([k]) => base(k)))].filter(b => enBases.includes(b))
  const want = enBases.filter(b => bases.has(b))
  if (order.join('|') !== want.join('|')) {
    const i = order.findIndex((b, j) => b !== want[j])
    fail(`order differs from en at ${order[i]} (en: ${want[i]})`)
  }
  // plural families where en has them
  const enPlural = new Set(enFlat.filter(([k]) => SUFFIX.test(k)).map(([k]) => base(k)))
  for (const b of enPlural) {
    for (const s of NEED[lang] ?? ['one', 'other']) if (!keys.has(`${b}_${s}`)) fail(`plural ${b}_${s} missing`)
  }
  // placeholders and dashes
  for (const [k, v] of f) {
    // a plain key keeps exactly en's placeholders; a plural form any of its en family's (a "one" form
    // may leave {{count}} out, as en does), and the family as a whole all of them
    const fam = enFlat.filter(([x]) => base(x) === base(k))
    const allowed = new Set(fam.flatMap(([, x]) => holes(x).split(',').filter(Boolean)))
    const mine = holes(v).split(',').filter(Boolean)
    if (enKeys.has(k) && !SUFFIX.test(k) && holes(v) !== holes(enKeys.get(k))) fail(`placeholders differ in ${k}: {${holes(v)}} vs en {${holes(enKeys.get(k))}}`)
    else if (mine.some(h => !allowed.has(h))) fail(`unknown placeholder in ${k}: {${holes(v)}}`)
    if (!SUFFIX.test(k) || k.endsWith('_other')) {
      const famMine = new Set(f.filter(([x]) => base(x) === base(k)).flatMap(([, x]) => holes(x).split(',').filter(Boolean)))
      for (const h of allowed) if (!famMine.has(h)) fail(`placeholder {{${h}}} lost in ${base(k)}`)
    }
    if (/[—–]/.test(v)) fail(`dash in ${k}: ${v}`)
    if (typeof v === 'string' && v !== v.trim()) fail(`spaces at the ends of ${k}`)
  }
  console.log(`  ${f.length} strings (en ${enFlat.length})`)
}

// render the plural keys through i18next
const require = createRequire(path.join(repo, 'package.json'))
const i18next = require('i18next')
const res = { en: { translation: en } }
for (const [lang, file] of targets) {
  try {
    res[lang] = { translation: JSON.parse(fs.readFileSync(file, 'utf8')) }
  } catch {}
}
const inst = i18next.createInstance()
await inst.init({ resources: res, fallbackLng: 'en', interpolation: { escapeValue: false } })
const samples = [
  ['card.atomSentence', [1, 2, 5, 12, 22, 25, 118]],
  ['lab.hands', [1, 2, 4, 5]],
  ['lab.free', [1, 3, 6]],
  ['lab.gives', [1, 2]],
  ['quiz.score', [0, 1, 2, 5, 12, 22, 24, 25]],
  ['quiz.worth', [1, 3, 6]],
  ['quiz.best', [1, 44]],
  ['card.worlds', [1, 2, 5]],
  ['time.status', [13, 22, 92, 118]],
  ['forge.neutronsAlone', [2, 5, 23]],
]
for (const [lang] of targets) {
  if (!res[lang]) continue
  const t = inst.getFixedT(lang)
  console.log(`\n${lang}:`)
  for (const [k, ns] of samples) for (const n of ns) console.log(`  ${k}(${n}) = ${t(k, { count: n, year: 1800, name: 'X' })}`)
}
console.log(bad ? `\n${bad} problem(s)` : '\nall good')
process.exit(bad ? 1 : 0)
