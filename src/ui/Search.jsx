/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ELEMENTS, FAMILY, nameOf } from '../data/elements.js'

const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

/** Find an element by its name (either language, accents optional), symbol or number; picking one
 *  selects its cube (the camera flies to it). wide: fills its box (the plaza's drawer on a phone),
 *  and the list opens upwards (the drawer sits at the bottom). */
export default function Search({ onPick, wide = false }) {
  const { t, i18n } = useTranslation()
  const [q, setQ] = useState('')
  const lang = i18n.resolvedLanguage
  const hits = useMemo(() => {
    const f = fold(q.trim())
    if (!f) return []
    const score = e => {
      if (String(e.z) === f) return 0
      if (e.symbol.toLowerCase() === f) return 1
      const names = [nameOf(e, lang), e.name.en, e.name['pt-pt']].map(fold)
      if (names.some(n => n.startsWith(f))) return 2
      if (names.some(n => n.includes(f))) return 3
      return 9
    }
    return ELEMENTS.map(e => [score(e), e]).filter(([s]) => s < 9).sort((a, b) => a[0] - b[0] || a[1].z - b[1].z).slice(0, 6).map(([, e]) => e)
  }, [q, lang])
  const pick = e => {
    onPick(e.z)
    setQ('')
  }
  return (
    <div className="relative pointer-events-auto">
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && hits[0]) pick(hits[0])
          if (e.key === 'Escape') setQ('')
          e.stopPropagation()
        }}
        placeholder={t('search.placeholder')}
        autoFocus={wide}
        aria-label={t('search.placeholder')}
        className={`glass rounded-xl px-3 py-1.5 text-sm outline-none ${wide ? 'w-full' : 'w-40 sm:w-56'} focus:ring-2 focus:ring-sky-300/60 placeholder:text-white/50`}
      />
      {hits.length > 0 && (
        <ul className={`absolute left-0 right-0 glass rounded-xl overflow-hidden text-sm z-10 ${wide ? 'bottom-full mb-1' : 'mt-1'}`}>
          {hits.map(e => (
            <li key={e.z}>
              <button type="button" onClick={() => pick(e)} className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center gap-2">
                <span className="w-7 text-center font-display font-bold rounded" style={{ background: `${FAMILY[e.family].color}33`, color: FAMILY[e.family].color }}>{e.symbol}</span>
                <span className="truncate">{nameOf(e, lang)}</span>
                <span className="ml-auto opacity-60 text-xs">{e.z}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
