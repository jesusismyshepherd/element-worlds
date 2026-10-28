// Languages as in pokemon-site (src/i18n): the choice is kept on the device (app_language), else the
// browser's. European Portuguese, English, Polish and German (langs.js); a key missing in one falls
// back to English.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ptPt from './locales/pt-pt.json'
import pl from './locales/pl.json'
import de from './locales/de.json'
import { CODES, codeFor, tagOf } from './langs.js'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: { pt: ['pt-pt'], default: ['en'] },
    supportedLngs: CODES,
    lowerCaseLng: true,
    load: 'currentOnly',
    nonExplicitSupportedLngs: false,
    resources: { en: { translation: en }, 'pt-pt': { translation: ptPt }, pl: { translation: pl }, de: { translation: de } },
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language',
      convertDetectedLanguage: codeFor,
    },
  })

document.documentElement.lang = tagOf(i18n.resolvedLanguage)
i18n.on('languageChanged', l => {
  document.documentElement.lang = tagOf(l)
})

export default i18n
