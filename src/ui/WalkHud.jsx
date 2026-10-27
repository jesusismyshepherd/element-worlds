/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import TouchStick from './TouchStick.jsx'
import Panel from './Panel.jsx'

const touchScreen = () => window.matchMedia?.('(pointer: coarse)').matches

/** The HUD of the walking worlds: the view switch, the prompt to use what is near, the panel it
 *  opens, and on touch screens the stick and the buttons. */
export default function WalkHud({ engine }) {
  const { t } = useTranslation()
  const mode = useStore(store, s => s.mode)
  const prompt = useStore(store, s => s.prompt)
  const panel = useStore(store, s => s.panel)
  const speech = useStore(store, s => s.speech)
  const found = useStore(store, s => s.discoveries)
  const [touch] = useState(touchScreen)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setHint(false), 9000)
    return () => clearTimeout(id)
  }, [])

  // what the Atomling says stays a few seconds
  useEffect(() => {
    if (!speech) return undefined
    const id = setTimeout(() => store.set({ speech: null }), 9000)
    return () => clearTimeout(id)
  }, [speech])

  useEffect(() => {
    if (!panel) return undefined
    const close = e => {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.stopPropagation()
        store.set({ panel: null })
      }
    }
    window.addEventListener('keydown', close, true)
    return () => window.removeEventListener('keydown', close, true)
  }, [panel])

  const other = mode === 'first' ? 'third' : 'first'
  return (
    <>
      <div className="absolute top-14 sm:top-16 right-2 sm:right-3 pointer-events-auto">
        <button
          type="button"
          title={t('hud.mode.switch')}
          onClick={() => engine?.setMode(other)}
          className="glass rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-white/10"
        >
          {mode === 'first' ? '👁' : '🧍'} {t(`hud.mode.${mode}`)} <span className="opacity-60">⇄</span>
        </button>
      </div>

      {found && (
        <div className="absolute top-14 sm:top-16 left-2 sm:left-3 glass rounded-xl px-3 py-1.5 text-xs font-bold pointer-events-none">
          ✦ {t('hud.discoveries')}: {found.found}/{found.total}
        </div>
      )}

      {speech && !panel && (
        <div className="absolute inset-x-0 top-28 sm:top-24 flex justify-center px-3 pointer-events-none">
          <button
            type="button"
            onClick={() => store.set({ speech: null })}
            className="glass rounded-2xl px-4 py-3 max-w-xl text-left pointer-events-auto shadow-xl"
            style={{ borderColor: `${speech.color}aa` }}
          >
            <div className="text-xs font-bold mb-0.5" style={{ color: speech.color }}>{t('hud.says', { who: speech.who })}</div>
            <div className="text-[15px] leading-snug">{speech.text}</div>
          </button>
        </div>
      )}

      {prompt && !panel && (
        <div className="absolute inset-x-0 bottom-24 sm:bottom-10 flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={() => engine?.use()}
            className="glass rounded-2xl px-4 py-2 pointer-events-auto font-display font-bold text-base sm:text-lg flex items-center gap-2 hover:bg-white/10 active:scale-95 transition"
          >
            {!touch && <kbd className="rounded-md bg-white text-[#0b0f24] px-2 py-0.5 text-sm">E</kbd>}
            <span>{prompt.verb ?? t('hud.use')}: {prompt.label}</span>
          </button>
        </div>
      )}

      {panel && <Panel panel={panel} onClose={() => store.set({ panel: null })} />}

      {touch && !panel && (
        <>
          <TouchStick onChange={v => engine?.input.setStick(v)} />
          <button
            type="button"
            aria-label={t('hud.jump')}
            onPointerDown={e => {
              e.preventDefault()
              engine?.input.pressed.push('Space')
            }}
            className="absolute right-4 bottom-6 w-16 h-16 rounded-full bg-white/20 border border-white/50 text-white/90 pointer-events-auto touch-none flex items-center justify-center active:bg-white/40"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 19h14M12 15V5M7.5 9.5L12 5l4.5 4.5" />
            </svg>
          </button>
        </>
      )}

      {hint && !panel && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
          <div className="text-xs opacity-75 glass rounded-lg px-3 py-1 hidden sm:block">{t('hud.help')}</div>
        </div>
      )}
    </>
  )
}
