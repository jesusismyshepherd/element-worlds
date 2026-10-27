import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ELEMENTS, FAMILY, cellOf, nameOf } from '../data/elements.js'
import { MISSIONS } from '../chem/build.js'
import { MISSIONS as FORGE } from '../worlds/forge/words.js'
import { Formula } from '../ui/LabHud.jsx'

const STATIONS = 9 // eight stations and the specimen case in every hall

function found() {
  try {
    return new Set(JSON.parse(localStorage.getItem('ew-found') ?? '[]'))
  } catch {
    return new Set()
  }
}

function quizBest() {
  try {
    const b = JSON.parse(localStorage.getItem('ew-quiz-best') ?? '{}')
    return Math.max(0, ...Object.values(b).map(Number).filter(Number.isFinite))
  } catch {
    return 0
  }
}

/** The player's passport: every element's hall as a tile that fills with what was discovered there,
 *  the molecules made in the lab, the atoms forged, the quiz's best round, and badges. */
export default function Passport() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.resolvedLanguage
  const keys = useMemo(found, [])
  const per = useMemo(() => {
    const m = {}
    for (const k of keys) {
      const [sym, part] = k.split(':')
      if (sym === 'lab' || sym === 'forge') continue
      m[sym] ??= { hall: 0, wings: 0 }
      if (k.split(':').length === 2 && part) m[sym].hall++
      else m[sym].wings++
    }
    return m
  }, [keys])
  const visited = Object.keys(per).length
  const molecules = MISSIONS.filter(k => keys.has(`lab:${k.show}`))
  const forged = FORGE.filter(m => keys.has(`forge:${m.id}`))
  const best = useMemo(quizBest, [])
  const total = keys.size
  const badges = [
    { id: 'first', got: total >= 1 },
    { id: 'hall', got: Object.values(per).some(p => p.hall >= STATIONS) },
    { id: 'ten', got: visited >= 10 },
    { id: 'wing', got: Object.values(per).some(p => p.wings >= 3) },
    { id: 'chemist', got: molecules.length >= 5 },
    { id: 'master', got: molecules.length === MISSIONS.length },
    { id: 'smith', got: forged.length >= 5 },
    { id: 'detective', got: best >= 40 },
  ]

  return (
    <div className="min-h-full bg-[#0b0f24] text-white p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link to="/" className="glass rounded-xl px-3 py-1.5 font-display font-bold">← {t('hud.table')}</Link>
          <h1 className="font-display text-3xl font-bold">{t('passport.title')}</h1>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-3xl mb-5">
          {[['visited', `${visited}/118`], ['found', total], ['molecules', `${molecules.length}/${MISSIONS.length}`], ['forgeStat', `${forged.length}/${FORGE.length}`], ['quizStat', best]].map(([k, v]) => (
            <div key={k} className="glass rounded-xl p-3 text-center">
              <div className="font-display text-2xl font-bold">{v}</div>
              <div className="text-xs opacity-80">{t(`passport.${k}`)}</div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid gap-[3px] min-w-[640px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
            {ELEMENTS.map(el => {
              const { col, row } = cellOf(el)
              const p = per[el.symbol]
              const fill = p ? Math.min(1, p.hall / STATIONS) : 0
              const color = FAMILY[el.family].color
              return (
                <button
                  key={el.z}
                  type="button"
                  onClick={() => navigate(`/e/${el.symbol}`)}
                  title={nameOf(el, lang)}
                  className="relative aspect-square rounded-md overflow-hidden text-left hover:scale-110 transition"
                  style={{ gridColumn: col, gridRow: row, border: `1px solid ${color}${p ? 'ff' : '55'}`, background: '#121838' }}
                >
                  <div className="absolute inset-x-0 bottom-0" style={{ height: `${fill * 100}%`, background: `${color}66` }} />
                  <div className="relative p-0.5 leading-none">
                    <div className="text-[8px] opacity-70">{el.z}</div>
                    <div className="font-display font-bold text-[13px] text-center">{el.symbol}</div>
                    {p?.wings ? <div className="absolute top-0.5 right-0.5 text-[8px]">★</div> : null}
                  </div>
                </button>
              )
            })}
            <div style={{ gridColumn: '1 / 19', gridRow: 8, height: 8 }} />
          </div>
        </div>
        <div className="text-xs opacity-70 mt-1">{t('passport.legend')}</div>

        <h2 className="font-display text-xl font-bold mt-6 mb-2">{t('passport.badges')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {badges.map(b => (
            <div key={b.id} className={`glass rounded-xl p-3 ${b.got ? '' : 'opacity-40'}`}>
              <div className="text-2xl">{t(`passport.badge.${b.id}.icon`)}</div>
              <div className="font-display font-bold">{t(`passport.badge.${b.id}.name`)}</div>
              <div className="text-xs opacity-80">{t(`passport.badge.${b.id}.how`)}</div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mt-6 mb-2">{t('passport.lab')}</h2>
        <div className="flex flex-wrap gap-2">
          {MISSIONS.map(k => (
            <div key={k.show} className={`glass rounded-xl px-3 py-2 ${keys.has(`lab:${k.show}`) ? '' : 'opacity-40'}`}>
              <span className="font-display font-bold"><Formula text={k.show} /></span>
              <span className="text-sm opacity-80 ml-1.5">{k.name[lang] ?? k.name.en}</span>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mt-6 mb-2">{t('passport.forge')}</h2>
        <div className="flex flex-wrap gap-2">
          {FORGE.map(m => (
            <Link key={m.id} to="/forge" className={`glass rounded-xl px-3 py-2 text-sm ${keys.has(`forge:${m.id}`) ? '' : 'opacity-40'}`} title={m.hint[lang] ?? m.hint.en}>
              {keys.has(`forge:${m.id}`) ? '✔ ' : ''}{m.name[lang] ?? m.name.en}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
