/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore, saveLevel } from '../engine/store.js'
import { store } from '../state.js'
import { element, nameOf } from '../data/elements.js'
import { atriumPath, plazaPath } from '../worlds/registry.js'
import { useEffect, useState } from 'react'
import PlazaHud from './PlazaHud.jsx'
import About from './About.jsx'
import WalkHud from './WalkHud.jsx'
import LabHud from './LabHud.jsx'
import ForgeHud from './ForgeHud.jsx'
import SoundButton from './SoundButton.jsx'

// the pages linked from the plaza: [address, icon, words, when the words show beside the icon]
const PAGES = [
  ['/passport', '🏅', 'passport.title', 'lg:inline'],
  ['/lab', '🧪', 'hud.lab', 'sm:inline'],
  ['/forge', '⚛️', 'hud.forge', 'sm:inline'],
  ['/atomlings', '🙂', 'atomlings.title', 'sm:inline'],
]

/** Everything drawn over the 3D: the top bar (where you are, level, language), the HUD of the
 *  current world, the fade between worlds. */
export default function Hud({ engine }) {
  const { t, i18n } = useTranslation()
  const world = useStore(store, s => s.world)
  const fading = useStore(store, s => s.fading)
  const error = useStore(store, s => s.error)
  const level = useStore(store, s => s.level)
  const title = useStore(store, s => s.title)
  const lang = i18n.resolvedLanguage
  const el = world?.symbol ? element(world.symbol) : null
  const [about, setAbout] = useState(false)
  // on a phone the pages (passport, lab, forge, Atomlings, about) fold into one menu
  const [menu, setMenu] = useState(false)
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

  const setLevel = l => {
    saveLevel(l)
    store.set({ level: l })
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute top-0 inset-x-0 p-2 sm:p-3 flex items-start justify-between gap-2">
        <nav className="glass rounded-xl px-3 py-1.5 pointer-events-auto flex items-center gap-2 min-w-0 text-sm">
          {world?.kind === 'plaza' || !world ? (
            <div className="min-w-0">
              <div className="font-display font-bold text-base sm:text-lg leading-tight">{t('app.title')}</div>
              <div className="text-xs opacity-75 leading-tight">{t('app.tagline')}</div>
            </div>
          ) : (
            <>
              <Link to={plazaPath(world.symbol)} className="font-display font-bold hover:underline whitespace-nowrap">← {t('hud.table')}</Link>
              {el && (
                <>
                  <span className="opacity-50">/</span>
                  {world.kind === 'wing' ? (
                    <Link to={atriumPath(el.symbol)} className="font-display hover:underline truncate">{nameOf(el, lang)}</Link>
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
            </>
          )}
        </nav>
        <div className="flex gap-1.5 pointer-events-auto shrink-0">
          <SoundButton />
          {world?.kind === 'plaza' && (
            <>
              <button type="button" onClick={() => setAbout(true)} className="hidden sm:block glass rounded-xl px-2.5 py-1.5 text-xs font-bold hover:bg-white/10" aria-label={t('about.title')}>
                ⓘ
              </button>
              {PAGES.map(([to, icon, key, wide]) => (
                <Link key={to} to={to} className="hidden sm:flex glass rounded-xl px-2.5 py-1.5 text-xs font-bold hover:bg-white/10 items-center" title={t(key)}>
                  {icon}<span className={`hidden ${wide} ml-1`}>{t(key)}</span>
                </Link>
              ))}
              <div className="relative sm:hidden">
                <button type="button" onClick={() => setMenu(m => !m)} className={`glass rounded-xl px-2.5 py-1.5 text-xs font-bold ${menu ? 'bg-white/15' : ''}`} aria-label={t('hud.menu')} aria-expanded={menu}>
                  ☰
                </button>
                {menu && (
                  <div className="absolute right-0 top-full mt-1.5 glass rounded-xl p-1.5 flex flex-col min-w-[11rem] z-10">
                    {PAGES.map(([to, icon, key]) => (
                      <Link key={to} to={to} onClick={() => setMenu(false)} className="rounded-lg px-2.5 py-2 text-sm font-bold hover:bg-white/10">
                        {icon} {t(key)}
                      </Link>
                    ))}
                    <button type="button" onClick={() => { setMenu(false); setAbout(true) }} className="rounded-lg px-2.5 py-2 text-sm font-bold hover:bg-white/10 text-left">
                      ⓘ {t('about.title')}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="glass rounded-xl p-1 flex text-xs font-bold" role="group" aria-label={t('level.label')}>
            {['explorer', 'scientist'].map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`px-2 py-1 rounded-lg ${level === l ? 'bg-white text-[#0b0f24]' : 'opacity-80 hover:bg-white/10'}`}
              >
                {l === 'explorer' ? '🧭' : '🔬'}<span className="hidden sm:inline"> {t(`level.${l}`)}</span>
              </button>
            ))}
          </div>
          <div className="glass rounded-xl p-1 flex text-xs font-bold" role="group" aria-label={t('hud.language')}>
            {[['pt-pt', 'PT'], ['en', 'EN']].map(([code, label]) => (
              <button
                key={code}
                type="button"
                onClick={() => i18n.changeLanguage(code)}
                className={`px-2 py-1 rounded-lg ${lang === code ? 'bg-white text-[#0b0f24]' : 'opacity-80 hover:bg-white/10'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {world?.kind === 'plaza' && <PlazaHud engine={engine} />}
      {world?.kind === 'lab' && <LabHud engine={engine} />}
      {world?.kind === 'forge' && <ForgeHud engine={engine} />}
      {world && world.kind !== 'plaza' && world.kind !== 'lab' && world.kind !== 'forge' && <WalkHud engine={engine} />}

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
