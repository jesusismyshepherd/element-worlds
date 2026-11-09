/* eslint-disable react/prop-types */
// The treasure hunts' sheet on the plaza (game/hunts.js; docs/knowledge/hunts.md): down the left side (across
// the top of an upright phone), like today's element. The clue of the hunt on, with the way to leave it; then
// every track with its clues found, its finishes and best time, to start, go on with (where it was left) or
// play again. Starting closes the sheet: the clue card (HuntCard.jsx) follows the player into every world.
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { TRACKS, currentClue, progressOf } from '../game/hunts.js'
import { inLang } from '../i18n/langs.js'
import { hunts, useHunts, useHuntWords } from './useHunts.js'
import { Riddle, Steps, duration } from './HuntCard.jsx'
import { useCover, useViewport } from './layout.js'

const BTN = 'rounded-xl bg-amber-400 text-[#1a1030] font-bold text-sm px-3.5 py-1.5 hover:bg-amber-300 active:scale-95 transition'
const SOFT = 'rounded-xl bg-white/10 font-bold text-sm px-3 py-1.5 hover:bg-white/20 active:scale-95 transition'

/** The sheet. select(z) flies the table to an element, overview() shows the whole table, onClose() closes. */
export default function HuntHud({ select, overview, onClose }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const level = useStore(store, s => s.level)
  const ctx = { t, lang, level }
  const { state, hintAt } = useHunts()
  const words = useHuntWords()
  const { portrait } = useViewport()
  const box = useRef(null)
  useCover(box, portrait ? 'top' : 'left')

  // opened: the whole table beside the sheet (the cover is reported by now: useCover measures in a layout effect)
  useEffect(() => {
    select(null)
    overview()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const cur = currentClue(state)
  const sci = level === 'scientist' ? 'sci' : 'kid'
  const go = id => {
    hunts.start(id)
    onClose()
  }

  const place = portrait
    ? { left: '0.5rem', right: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', maxHeight: '44vh' }
    : { left: '0.5rem', top: 'calc(var(--bar) + 0.25rem)', width: 'min(26rem, 46vw)', maxHeight: 'calc(100vh - var(--bar) - 0.75rem)' }

  return (
    <div ref={box} data-hunts className="absolute glass rounded-2xl p-3 sm:p-4 pointer-events-auto shadow-2xl overflow-y-auto overscroll-contain" style={place}>
      <div className="flex items-center gap-2">
        <div className="font-display text-lg font-bold whitespace-nowrap truncate">🗺️ {t('hunts.title')}</div>
        <button type="button" onClick={onClose} className="ml-auto rounded-lg px-2 py-0.5 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
      </div>
      <p className="mt-1 text-[13px] leading-snug opacity-90">{t('hunts.intro')}</p>

      {cur && (
        <div className="mt-3 rounded-xl bg-amber-300/10 ring-1 ring-amber-300/50 p-2.5" data-hunt-current={cur.track.id}>
          <div className="flex items-center gap-1.5">
            <span className="text-lg leading-none" aria-hidden="true">{cur.track.icon}</span>
            <span className="font-display font-bold">{words ? inLang(words.TRACK_WORDS[cur.track.id].title, lang) : ''}</span>
            <span className="ml-auto text-[11px] font-bold text-amber-200">● {t('hunts.on')}</span>
          </div>
          <div className="mt-1.5">
            <Riddle cur={cur} hintAt={hintAt} ctx={ctx} words={words} />
          </div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <button type="button" data-hunt-go className={BTN} onClick={onClose}>▶ {t('hunts.continue')}</button>
            <button type="button" data-hunt-stop className={SOFT} onClick={() => hunts.stop()}>{t('hunts.stop')}</button>
          </div>
        </div>
      )}

      <ul className="mt-3 space-y-2">
        {TRACKS.map(tr => {
          const p = progressOf(state, tr.id)
          const w = words?.TRACK_WORDS[tr.id]
          const going = !p.finished && p.started
          const label = p.on || going ? t('hunts.continue') : p.done ? t('hunts.again') : t('hunts.start')
          const status = [
            going && t('hunts.progress', { n: p.step + 1, of: p.of }),
            p.done > 0 && `✓ ${t('hunts.done', { count: p.done })}`,
            p.best && t('hunts.best', { time: duration(p.best, t) }),
            !going && !p.done && t('hunts.clues', { n: p.of }),
          ].filter(Boolean)
          return (
            <li key={tr.id} data-hunt-track={tr.id} data-done={p.done} className={`rounded-xl p-2.5 ${p.on ? 'bg-white/10 ring-1 ring-amber-300/40' : 'bg-white/5'}`}>
              <div className="flex items-start gap-2">
                <span className="text-2xl leading-none mt-0.5" aria-hidden="true">{tr.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold leading-tight">{w ? inLang(w.title, lang) : tr.id}</div>
                  <div className="text-[12px] leading-snug opacity-80">{w ? (w.about[lang] ?? w.about.en)[sci] : ''}</div>
                </div>
              </div>
              <div className="mt-1.5">
                <Steps track={tr} step={going || p.on ? p.step : p.finished ? tr.clues.length : 0} current={going || p.on} t={t} years={tr.id === 'discoverers'} />
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[12px] opacity-85 min-w-0">{status.join(' · ')}</span>
                {!p.on && (
                  <button type="button" data-hunt-start={tr.id} className={`${p.done && !going ? SOFT : BTN} ml-auto shrink-0`} onClick={() => go(tr.id)}>
                    {label}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
