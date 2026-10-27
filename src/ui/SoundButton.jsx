import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isMuted, setMuted, onMuted } from '../audio/sound.js'

/** Sound on or off, kept on the device. */
export default function SoundButton() {
  const { t } = useTranslation()
  const [muted, set] = useState(isMuted)
  useEffect(() => onMuted(set), [])
  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-label={t(muted ? 'hud.soundOn' : 'hud.soundOff')}
      title={t(muted ? 'hud.soundOn' : 'hud.soundOff')}
      className="glass rounded-xl px-2.5 py-1.5 text-xs font-bold hover:bg-white/10"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
