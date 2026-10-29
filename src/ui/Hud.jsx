/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore, saveLevel } from '../engine/store.js'
import { store } from '../state.js'
import { element, nameOf } from '../data/elements.js'
import { atriumPath, plazaPath } from '../worlds/registry.js'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PlazaHud from './PlazaHud.jsx'
import About from './About.jsx'
import WalkHud from './WalkHud.jsx'
import LabHud from './LabHud.jsx'
import ForgeHud from './ForgeHud.jsx'
import SoundButton from './SoundButton.jsx'
import { useCover, useViewport } from './layout.js'
import { useFullscreen } from './fullscreen.js'
import { LANGS } from '../i18n/langs.js'
import { RoomButton, RoomToasts } from './RoomHud.jsx'

// the pages linked from the plaza: [address, icon, words, when the words show beside the icon]
const PAGES = [
  ['/passport', '🏅', 'passport.title', 'lg:inline'],
  ['/lab', '🧪', 'hud.lab', 'sm:inline'],
  ['/forge', '⚛️', 'hud.forge', 'sm:inline'],
  ['/atomlings', '🙂', 'atomlings.title', 'sm:inline'],
]
const BTN = 'glass rounded-xl px-2.5 py-1.5 text-xs font-bold hover:bg-white/10'

/** Full screen on and off (hidden where the browser has none: an iPhone). */
function FullscreenButton() {
  const { t } = useTranslation()
  const { can, on, toggle } = useFullscreen()
  if (!can) return null
  return (
    <button type="button" onClick={toggle} className={BTN} aria-label={t(on ? 'hud.exitFullscreen' : 'hud.fullscreen')} title={t(on ? 'hud.exitFullscreen' : 'hud.fullscreen')}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {on ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
      </svg>
    </button>
  )
}

/** A choice of two or more (the level, the language). */
function Toggle({ label, options, value, onPick, wide }) {
  return (
    <div className={`glass rounded-xl p-1 flex text-xs font-bold ${wide ? 'w-full' : ''}`} role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          onClick={() => onPick(v)}
          className={`px-2 py-1 rounded-lg ${wide ? 'flex-1' : ''} ${value === v ? 'bg-white text-[#0b0f24]' : 'opacity-80 hover:bg-white/10'}`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

/** Everything drawn over the 3D: the top bar (where you are, the view, sound, full screen, level,
 *  language; on a phone the pages, level and language fold into one menu), the HUD of the current
 *  world, the fade between worlds. Nothing here sits in the middle of the screen
 *  (docs/knowledge/hud-layout.md). */
export default function Hud({ engine }) {
  const { t, i18n } = useTranslation()
  const world = useStore(store, s => s.world)
  const fading = useStore(store, s => s.fading)
  const error = useStore(store, s => s.error)
  const level = useStore(store, s => s.level)
  const title = useStore(store, s => s.title)
  const mode = useStore(store, s => s.mode)
  const speech = useStore(store, s => s.speech)
  const found = useStore(store, s => s.discoveries)
  const lang = i18n.resolvedLanguage
  const el = world?.symbol ? element(world.symbol) : null
  const vp = useViewport()
  const [about, setAbout] = useState(false)
  const [menu, setMenu] = useState(false)
  const walking = !!world && !['plaza', 'lab', 'forge'].includes(world.kind)
  const canTalk = walking && !!engine?.world?.talk
  // a long wait (a big world's first visit compiles its shaders): say why
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    if (!fading) {
      setSlow(false)
      return undefined
    }
    const id = setTimeout(() => setSlow(true), 1500)
    return () => clearTimeout(id)
  }, [fading])
  useEffect(() => setMenu(false), [world?.kind, world?.symbol, world?.wing])

  // the top bar covers the top edge; panels below it (and the worlds' own windows) read its height
  // from --bar, set on the page's root
  const bar = useRef(null)
  useCover(bar, 'top')
  useLayoutEffect(() => {
    const el = bar.current
    const set = () => document.documentElement.style.setProperty('--bar', `${Math.round(el.getBoundingClientRect().bottom)}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const setLevel = l => {
    saveLevel(l)
    store.set({ level: l })
  }
  const levels = [['explorer', '🧭'], ['scientist', '🔬']]
  const langs = LANGS.map(l => [l.code, l.label])
  const other = mode === 'first' ? 'third' : 'first'

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div ref={bar} className={`absolute top-0 inset-x-0 flex items-start justify-between gap-2 ${vp.short ? 'p-1.5' : 'p-2 sm:p-3'}`}>
        <nav className="glass rounded-xl px-3 py-1.5 pointer-events-auto flex items-center gap-2 min-w-0 text-sm">
          {world?.kind === 'plaza' || !world ? (
            <div className="min-w-0">
              <div className="font-display font-bold text-base sm:text-lg leading-tight truncate">{t('app.title')}</div>
              {!vp.compact && <div className="text-xs opacity-75 leading-tight">{t('app.tagline')}</div>}
            </div>
          ) : (
            <>
              <Link to={plazaPath(world.symbol)} className="font-display font-bold hover:underline whitespace-nowrap">← {vp.narrow && el ? '' : t('hud.table')}</Link>
              {el && (
                <>
                  {!vp.narrow && <span className="opacity-50">/</span>}
                  {world.kind === 'wing' ? (
                    <Link to={atriumPath(el.symbol)} className={`font-display hover:underline ${vp.narrow ? 'shrink-0' : 'truncate'}`}>{vp.narrow ? el.symbol : nameOf(el, lang)}</Link>
                  ) : (
                    <span className="font-display font-bold truncate">{nameOf(el, lang)}</span>
                  )}
                </>
              )}
              {(world.kind === 'lab' || world.kind === 'forge') && (
                <>
                  <span className="opacity-50">/</span>
                  <span className="font-display font-bold truncate">{t(`${world.kind}.title`)}</span>
                </>
              )}
              {world.kind === 'wing' && title && (
                <>
                  <span className="opacity-50">/</span>
                  <span className="font-display font-bold truncate">{title}</span>
                </>
              )}
              {walking && found && (
                <span className="shrink-0 text-xs font-bold opacity-90 whitespace-nowrap" title={t('hud.discoveries')}>✦ {found.found}/{found.total}</span>
              )}
            </>
          )}
        </nav>
        <div className="flex gap-1.5 pointer-events-auto shrink-0">
          {walking && (
            <button type="button" title={t('hud.mode.switch')} onClick={() => engine?.setMode(other)} className={BTN}>
              {mode === 'first' ? '👁' : '🧍'}
              {!vp.compact && <> {t(`hud.mode.${mode}`)} <span className="opacity-60">⇄</span></>}
            </button>
          )}
          {canTalk && (
            // switches the Atomling's bubble on and off (its own arrow tells the next thing)
            <button
              type="button"
              data-talk
              title={t('hud.talk')}
              aria-pressed={!!speech}
              onClick={() => (store.get().speech ? store.set({ speech: null }) : engine.talk())}
              className={`${BTN} ${speech ? 'bg-white/20 ring-1 ring-white/50' : ''}`}
            >
              💬{!vp.compact && <span> {t('hud.talk')}</span>}
            </button>
          )}
          <RoomButton engine={engine} compact={vp.compact} />
          {/* on a phone the sound switch is in the ☰ menu: the room button took its place (the bar
              may not grow: hud_probe's forge on a phone on its side was at its limit) */}
          {!vp.compact && <SoundButton />}
          <FullscreenButton />
          {world?.kind === 'plaza' && !vp.compact && (
            <>
              <button type="button" onClick={() => setAbout(true)} className={BTN} aria-label={t('about.title')}>ⓘ</button>
              {PAGES.map(([to, icon, key, wide]) => (
                <Link key={to} to={to} className={`${BTN} flex items-center`} title={t(key)}>
                  {icon}<span className={`hidden ${wide} ml-1`}>{t(key)}</span>
                </Link>
              ))}
            </>
          )}
          {!vp.compact && (
            <>
              <Toggle label={t('level.label')} value={level} onPick={setLevel} options={levels.map(([l, icon]) => [l, <span key={l}>{icon}<span className="hidden sm:inline"> {t(`level.${l}`)}</span></span>])} />
              <Toggle label={t('hud.language')} value={lang} onPick={code => i18n.changeLanguage(code)} options={langs} />
            </>
          )}
          {vp.compact && (
            <div className="relative">
              <button type="button" onClick={() => setMenu(m => !m)} className={`${BTN} ${menu ? 'bg-white/15' : ''}`} aria-label={t('hud.menu')} aria-expanded={menu}>☰</button>
              {menu && (
                <div className="absolute right-0 top-full mt-1.5 glass rounded-xl p-1.5 flex flex-col gap-1 min-w-[12rem] z-10 max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <Toggle wide label={t('level.label')} value={level} onPick={setLevel} options={levels.map(([l, icon]) => [l, `${icon} ${t(`level.${l}`)}`])} />
                  <Toggle wide label={t('hud.language')} value={lang} onPick={code => i18n.changeLanguage(code)} options={langs} />
                  <SoundButton wide />
                  {PAGES.map(([to, icon, key]) => (
                    <Link key={to} to={to} onClick={() => setMenu(false)} className="rounded-lg px-2.5 py-1.5 text-sm font-bold hover:bg-white/10">
                      {icon} {t(key)}
                    </Link>
                  ))}
                  <button type="button" onClick={() => { setMenu(false); setAbout(true) }} className="rounded-lg px-2.5 py-1.5 text-sm font-bold hover:bg-white/10 text-left">
                    ⓘ {t('about.title')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {world?.kind === 'plaza' && <PlazaHud engine={engine} />}
      {world?.kind === 'lab' && <LabHud engine={engine} />}
      {world?.kind === 'forge' && <ForgeHud engine={engine} />}
      {walking && <WalkHud engine={engine} />}

      <RoomToasts engine={engine} />
      {about && <About onClose={() => setAbout(false)} />}

      {error && (
        <div className="absolute inset-x-0 top-20 flex justify-center pointer-events-auto">
          <div className="glass rounded-xl px-4 py-3 text-sm max-w-md">
            <div className="font-bold">{t('app.error')}</div>
            <div className="opacity-70 text-xs mt-1 break-words">{error}</div>
            <Link to="/" className="underline text-xs mt-2 inline-block">{t('hud.back')}</Link>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 bg-[#0b0f24] transition-opacity duration-300 flex items-center justify-center"
        style={{ opacity: fading ? 1 : 0, pointerEvents: fading ? 'auto' : 'none' }}
      >
        {fading && (
          <div className="text-center px-6">
            <div className="font-display text-lg opacity-70 animate-pulse">{t('app.loading')}</div>
            {slow && <div className="text-sm opacity-60 mt-2 max-w-sm">{t('app.firstTime')}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
