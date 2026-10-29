/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import TouchStick from './TouchStick.jsx'
import Panel, { sheetWidth } from './Panel.jsx'
import { voice } from '../audio/sound.js'
import { element } from '../data/elements.js'
import { traitsOf } from '../characters/traits.js'
import { useViewport } from './layout.js'

/** The HUD of the walking worlds, all of it at the edges so the middle stays free to look round and
 *  walk (docs/knowledge/hud-layout.md): what the Atomling says (top left), the prompt to use what is
 *  near (bottom; by the right thumb on a touch screen; still offered beside an open panel when it is
 *  another exhibit, and using it switches the panel), the panel it opens (a side sheet, or a top
 *  sheet on an upright phone; the stick keeps working under it and walking away closes it), and on
 *  touch screens the stick (no jump button: the user, 2026-10-28, a museum floor needs none, and it
 *  crowded the screen; Space still jumps). The view switch and "talk" are in the top bar; "talk"
 *  switches the Atomling's bubble on and off, and the bubble's own arrow (or T) tells the next thing
 *  (the user, 2026-10-29: the bubble went away by itself after 9 s). */
export default function WalkHud({ engine }) {
  const { t } = useTranslation()
  const prompt = useStore(store, s => s.prompt)
  const panel = useStore(store, s => s.panel)
  const speech = useStore(store, s => s.speech)
  const overlay = useStore(store, s => s.overlay)
  const panelFrom = useStore(store, s => s.panelFrom)
  const { touch, portrait, short } = useViewport()
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setHint(false), 9000)
    return () => clearTimeout(id)
  }, [])

  // what the Atomling says stays until the player switches it off; it says it in its own voice (big
  // atoms speak low)
  useEffect(() => {
    if (!speech) return
    const el = element(store.get().world?.symbol ?? 'C')
    if (el) voice(speech.text, { pitch: 1.3 - (traitsOf(el).height - 0.7) * 0.5 })
  }, [speech])

  useEffect(() => {
    if (!panel) return undefined
    const close = e => {
      if (e.code !== 'Escape' && e.code !== 'KeyE') return
      // another exhibit in reach: E uses it, and its panel takes this one's place
      const s = store.get()
      if (e.code === 'KeyE' && s.prompt && s.prompt.id !== s.panelFrom) return
      e.stopPropagation()
      store.set({ panel: null })
    }
    window.addEventListener('keydown', close, true)
    return () => window.removeEventListener('keydown', close, true)
  }, [panel])

  // with a panel open on a phone there is no room for both beside the middle: the bubble waits
  const bubble = speech && !(panel && (portrait || short))
  // the prompt: hidden only for the exhibit whose panel is open (and under a world's own window)
  const offer = prompt && !overlay && (!panel || prompt.id !== panelFrom)
  // beside a side sheet, the touch prompt stands left of it
  const besideSheet = panel && !portrait
  return (
    <>
      {bubble && (
        <div className="absolute left-2 sm:left-3 top-[calc(var(--bar)+0.25rem)] pointer-events-none" style={{ width: portrait ? 'calc(100vw - 1rem)' : short ? 'min(18rem, 30vw)' : 'min(24rem, 40vw)' }}>
          <div
            data-speech
            className={`glass rounded-2xl text-left pointer-events-auto shadow-xl w-full ${short ? 'px-3 py-1.5' : 'px-3.5 py-2.5'}`}
            style={{ borderColor: `${speech.color}aa` }}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold mb-0.5" style={{ color: speech.color }}>{t('hud.says', { who: speech.who })}</div>
                <div className={`leading-snug ${short ? 'text-[13px] line-clamp-3' : 'text-[14px] sm:text-[15px]'}`}>{speech.text}</div>
              </div>
              {engine?.world?.talk && (
                <button
                  type="button"
                  data-speech-next
                  onClick={() => engine.world.talk()}
                  aria-label={t('card.nextFact')}
                  title={touch ? t('card.nextFact') : `${t('card.nextFact')} (T)`}
                  className="shrink-0 self-end w-9 h-9 -mr-1 -mb-0.5 rounded-xl text-xl leading-none hover:bg-white/10 active:scale-95 transition"
                  style={{ color: speech.color }}
                >
                  ›
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {offer && (touch ? (
        // by the right thumb (left of a side sheet)
        <div
          className={`absolute flex justify-end pointer-events-none ${short ? 'bottom-2' : 'bottom-4'}`}
          style={{ right: besideSheet ? `calc(${sheetWidth(short)} + 1.25rem)` : '0.75rem', maxWidth: besideSheet ? 'min(16rem, 30vw)' : 'min(16rem, 46vw)' }}
        >
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
