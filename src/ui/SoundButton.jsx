import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isMuted, setMuted, onMuted } from '../audio/sound.js'

/** Sound on or off, kept on the device. `wide`: a row of the phone's ☰ menu, with its words. */
// eslint-disable-next-line react/prop-types
export default function SoundButton({ wide = false }) {
  const { t } = useTranslation()
  const [muted, set] = useState(isMuted)
  useEffect(() => onMuted(set), [])
  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-label={t(muted ? 'hud.soundOn' : 'hud.soundOff')}
      title={t(muted ? 'hud.soundOn' : 'hud.soundOff')}
      className={wide ? 'rounded-lg px-2.5 py-1.5 text-sm font-bold hover:bg-white/10 text-left' : 'glass rounded-xl px-2.5 py-1.5 text-xs font-bold hover:bg-white/10'}
    >
      {muted ? '🔇' : '🔊'}
      {wide && <span> {t(muted ? 'hud.soundOn' : 'hud.soundOff')}</span>}
    </button>
  )
}
