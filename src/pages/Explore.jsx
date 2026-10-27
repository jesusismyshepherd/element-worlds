import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Engine } from '../engine/engine.js'
import { store } from '../state.js'
import { targetFrom } from '../worlds/registry.js'
import Hud from '../ui/Hud.jsx'

/** The 3D experience: one engine for the plaza, the atriums and the wings; the address picks the world. */
export default function Explore() {
  const canvas = useRef(null)
  const [engine, setEngine] = useState(null)
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const lang = i18n.resolvedLanguage

  useEffect(() => {
    const e = new Engine(canvas.current, { store, i18n })
    setEngine(e)
    return () => e.dispose()
  }, [i18n])

  useEffect(() => {
    if (engine) engine.navigate = navigate
  }, [engine, navigate])

  useEffect(() => {
    engine?.show(targetFrom(location.pathname, location.search))
  }, [engine, location.pathname, location.search])

  // the worlds write their words at build time: build the current one again in the new language
  const firstLang = useRef(lang)
  useEffect(() => {
    if (!engine || lang === firstLang.current) return
    firstLang.current = lang
    engine.reload(targetFrom(location.pathname, location.search))
  }, [engine, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas ref={canvas} className="world" tabIndex={0} />
      <Hud engine={engine} />
    </div>
  )
}
