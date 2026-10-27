/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next'

/** What a station or an exhibit tells, opened by using it. A world sets store.panel to
 *  { title, kicker?, color?, blocks: [{ p }, { big, small? }, { rows: [[label, value]] }, { list: [] }] }. */
export default function Panel({ panel, onClose }) {
  const { t } = useTranslation()
  return (
    <div className="absolute inset-0 flex items-end sm:items-center justify-center sm:justify-end p-2 sm:p-6 pointer-events-none">
      <div
        className="glass rounded-2xl w-full sm:w-[28rem] max-h-[78vh] overflow-y-auto pointer-events-auto shadow-2xl"
        style={{ borderColor: panel.color ? `${panel.color}88` : undefined }}
      >
        <div className="sticky top-0 flex items-start justify-between gap-2 p-4 pb-2 bg-[#10163a]/90 backdrop-blur">
          <div>
            {panel.kicker && <div className="text-xs font-bold uppercase tracking-wide" style={{ color: panel.color }}>{panel.kicker}</div>}
            <h2 className="font-display text-2xl font-bold leading-tight">{panel.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded-lg px-2 py-1 text-sm hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
        </div>
        <div className="px-4 pb-4 flex flex-col gap-3 text-[15px] leading-relaxed">
          {panel.blocks.map((b, i) => {
            if (b.p) return <p key={i}>{b.p}</p>
            if (b.big) return (
              <div key={i} className="rounded-xl bg-white/5 p-3 text-center">
                <div className="font-display text-3xl font-bold" style={{ color: panel.color }}>{b.big}</div>
                {b.small && <div className="text-sm opacity-80">{b.small}</div>}
              </div>
            )
            if (b.rows) return (
              <dl key={i} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                {b.rows.map(([k, v]) => [<dt key={`${k}k`} className="opacity-70">{k}</dt>, <dd key={`${k}v`}>{v}</dd>])}
              </dl>
            )
            if (b.list) return (
              <ul key={i} className="list-disc pl-5 space-y-1">
                {b.list.map(x => <li key={x}>{x}</li>)}
              </ul>
            )
            return null
          })}
        </div>
      </div>
    </div>
  )
}
