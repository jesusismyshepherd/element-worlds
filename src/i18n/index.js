// Languages as in pokemon-site (src/i18n): the choice is kept on the device (app_language), else the
// browser's. European Portuguese and English now; German, Japanese and Chinese can follow.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ptPt from './locales/pt-pt.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: { pt: ['pt-pt'], default: ['en'] },
    supportedLngs: ['en', 'pt-pt'],
    lowerCaseLng: true,
    load: 'currentOnly',
    nonExplicitSupportedLngs: false,
    resources: { en: { translation: en }, 'pt-pt': { translation: ptPt } },
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language',
      convertDetectedLanguage: lng => {
        const l = lng.toLowerCase()
        return l.startsWith('pt') ? 'pt-pt' : l.startsWith('en') ? 'en' : l
      },
    },
  })

document.documentElement.lang = i18n.resolvedLanguage === 'pt-pt' ? 'pt-PT' : 'en'
i18n.on('languageChanged', l => {
  document.documentElement.lang = l === 'pt-pt' ? 'pt-PT' : 'en'
})

export default i18n
