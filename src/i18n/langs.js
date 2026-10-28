// The site's languages, in the picker's order: the i18next code, the picker's label, the BCP 47 tag for
// numbers and case (decimal commas in all but English), and the language's own name. A text the code
// keeps itself is an object by code ({ en, 'pt-pt', pl, de }); one missing in a language falls back to
// English (inLang), so a half-translated page still reads.
export const LANGS = [
  { code: 'pt-pt', label: 'PT', tag: 'pt-PT', name: 'Português' },
  { code: 'en', label: 'EN', tag: 'en', name: 'English' },
  { code: 'pl', label: 'PL', tag: 'pl-PL', name: 'Polski' },
  { code: 'de', label: 'DE', tag: 'de-DE', name: 'Deutsch' },
]

export const CODES = LANGS.map(l => l.code)

/** The BCP 47 tag for a code (numbers, upper and lower case). */
export const tagOf = lang => LANGS.find(l => l.code === lang)?.tag ?? 'en'

/** The decimal mark: a point in English, a comma in the others. */
export const decimalOf = lang => (lang === 'en' ? '.' : ',')

/** A text in the language, else in English. */
export const inLang = (obj, lang) => obj?.[lang] ?? obj?.en

/** The language a detected one (a browser's 'pt-BR', 'de-AT', 'pl') is served in. */
export function codeFor(detected) {
  const l = String(detected ?? '').toLowerCase()
  if (l.startsWith('pt')) return 'pt-pt'
  if (l.startsWith('pl')) return 'pl'
  if (l.startsWith('de')) return 'de'
  return l.startsWith('en') ? 'en' : l
}
