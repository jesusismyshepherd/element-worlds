/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next'
import { recordingAs } from '../net/telemetry.js'
import { VERSIONS } from '../content/scripture/index.js'

/** What this is, how to play, and where the numbers come from. */
export default function About({ onClose }) {
  const { t } = useTranslation()
  return (
    <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-auto bg-black/40" onClick={onClose}>
      <div className="glass rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-2xl font-bold">{t('about.title')}</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed">{t('about.what')}</p>
        <h3 className="font-display font-bold mt-4">{t('about.howTitle')}</h3>
        <ul className="list-disc pl-5 text-[14px] leading-relaxed space-y-1 mt-1">
          {['table', 'inside', 'views', 'levels', 'time'].map(k => <li key={k}>{t(`about.how.${k}`)}</li>)}
        </ul>
        <h3 className="font-display font-bold mt-4">{t('about.dataTitle')}</h3>
        <p className="text-[13px] leading-relaxed opacity-90 mt-1">{t('about.data')}</p>
        <h3 className="font-display font-bold mt-4">{t('about.bibleTitle')}</h3>
        <p className="text-[13px] leading-relaxed opacity-90 mt-1">{t('about.bible')}</p>
        <ul className="text-[11px] leading-snug opacity-75 mt-1 space-y-1">
          {Object.values(VERSIONS).map(v => <li key={v.short}>{v.notice}</li>)}
        </ul>
        <h3 className="font-display font-bold mt-4">{t('about.privacyTitle')}</h3>
        <p className="text-[13px] leading-relaxed opacity-90 mt-1">{t('about.privacy')}</p>
        {recordingAs() && <p className="text-[13px] leading-relaxed mt-1 text-amber-200">{t('about.recording', { who: recordingAs() })}</p>}
      </div>
    </div>
  )
}
