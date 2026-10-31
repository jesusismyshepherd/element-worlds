/* eslint-disable react/prop-types */
// A Bible passage on a page or in a HUD card (src/content/scripture/): the words, a poem line by line, and
// the reference with the translation, at the visitor's level (Explorer's translation or the Scientist's).
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { verseOf } from '../content/scripture/index.js'

export default function VerseLine({ id, className = '' }) {
  const { i18n } = useTranslation()
  const level = useStore(store, s => s.level)
  const v = verseOf(id, i18n.resolvedLanguage, level)
  if (!v) return null
  return (
    <blockquote className={`m-0 border-l-2 border-amber-200/60 pl-2.5 ${className}`}>
      <p className="font-serif italic leading-snug whitespace-pre-line">{v.text}</p>
      <footer className="text-[11px] font-bold text-amber-200/90 mt-0.5">{v.label}</footer>
    </blockquote>
  )
}
