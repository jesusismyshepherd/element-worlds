/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import TouchStick from './TouchStick.jsx'
import Panel from './Panel.jsx'
import { voice } from '../audio/sound.js'
import { element } from '../data/elements.js'
import { traitsOf } from '../characters/traits.js'
import { useViewport } from './layout.js'

/** The HUD of the walking worlds, all of it at the edges so the middle stays free to look round and
 *  walk (docs/knowledge/hud-layout.md): what the Atomling says (top left), the prompt to use what is
 *  near (bottom; by the right thumb on a touch screen), the panel it opens (a side sheet, or a top
 *  sheet on an upright phone; the stick keeps working under it and walking away closes it), and on
 *  touch screens the stick and the jump button. The view switch and "talk" are in the top bar. */
export default function WalkHud({ engine }) {
  const { t } = useTranslation()
  const prompt = useStore(store, s => s.prompt)
  const panel = useStore(store, s => s.panel)
  const speech = useStore(store, s => s.speech)
  const overlay = useStore(store, s => s.overlay)
  const { touch, portrait, short } = useViewport()
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setHint(false), 9000)
    return () => clearTimeout(id)
  }, [])

  // what the Atomling says stays a few seconds; it says it in its own voice (big atoms speak low)
  useEffect(() => {
    if (!speech) return undefined
    const el = element(store.get().world?.symbol ?? 'C')
    if (el) voice(speech.text, { pitch: 1.3 - (traitsOf(el).height - 0.7) * 0.5 })
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

  // with a panel open on a phone there is no room for both beside the middle: the bubble waits
  const bubble = speech && !(panel && (portrait || short))
  return (
    <>
      {bubble && (
        <div className="absolute left-2 sm:left-3 top-[calc(var(--bar)+0.25rem)] pointer-events-none" style={{ width: portrait ? 'calc(100vw - 1rem)' : short ? 'min(18rem, 30vw)' : 'min(24rem, 40vw)' }}>
          <button
            type="button"
            onClick={() => store.set({ speech: null })}
            className={`glass rounded-2xl text-left pointer-events-auto shadow-xl w-full ${short ? 'px-3 py-1.5' : 'px-3.5 py-2.5'}`}
            style={{ borderColor: `${speech.color}aa` }}
          >
            <div className="text-xs font-bold mb-0.5" style={{ color: speech.color }}>{t('hud.says', { who: speech.who })}</div>
            <div className={`leading-snug ${short ? 'text-[13px] line-clamp-3' : 'text-[14px] sm:text-[15px]'}`}>{speech.text}</div>
          </button>
        </div>
      )}

      {prompt && !panel && !overlay && (touch ? (
        // by the right thumb, above the jump button; on a phone on its side, between the thumbs
        <div className={`absolute flex pointer-events-none ${short ? 'left-[7.5rem] right-[5.5rem] bottom-2 justify-center' : 'right-3 bottom-24 justify-end'}`} style={short ? undefined : { maxWidth: 'min(16rem, 46vw)' }}>
          <button
            type="button"
            onClick={() => engine?.use()}
            className="glass rounded-2xl px-3 py-2 pointer-events-auto font-display font-bold text-sm leading-tight text-left flex items-center gap-2 active:scale-95 transition border-white/50"
          >
            <span className="text-lg" aria-hidden="true">✋</span>
            <span className={short ? 'line-clamp-1' : 'line-clamp-2'}>{prompt.verb ?? t('hud.use')}: {prompt.label}</span>
          </button>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={() => engine?.use()}
            className="glass rounded-2xl px-4 py-2 pointer-events-auto font-display font-bold text-base flex items-center gap-2 hover:bg-white/10 active:scale-95 transition"
          >
            <kbd className="rounded-md bg-white text-[#0b0f24] px-2 py-0.5 text-sm">E</kbd>
            <span>{prompt.verb ?? t('hud.use')}: {prompt.label}</span>
          </button>
        </div>
      ))}

      {panel && <Panel panel={panel} onClose={() => store.set({ panel: null })} />}

      {touch && (
        <>
          <TouchStick onChange={v => engine?.input.setStick(v)} small={short} />
          <button
            type="button"
            data-thumb
            aria-label={t('hud.jump')}
            onPointerDown={e => {
              e.preventDefault()
              engine?.input.pressed.push('Space')
            }}
            className={`absolute right-4 rounded-full bg-white/20 border border-white/50 text-white/90 pointer-events-auto touch-none flex items-center justify-center active:bg-white/40 ${short ? 'bottom-4 w-14 h-14' : 'bottom-6 w-16 h-16'}`}
          >
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 19h14M12 15V5M7.5 9.5L12 5l4.5 4.5" />
            </svg>
          </button>
        </>
      )}

      {hint && !panel && !touch && !prompt && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
          <div className="text-xs opacity-75 glass rounded-lg px-3 py-1">{t('hud.help')}</div>
        </div>
      )}
    </>
  )
}
