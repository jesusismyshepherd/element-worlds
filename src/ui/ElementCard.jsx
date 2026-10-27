/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next'
import { FAMILY, nameOf } from '../data/elements.js'
import { temperature, density, num, config, LANG_TAG } from './format.js'
import { WINGS } from '../worlds/registry.js'

/** An element's card on the plaza: the tile as on a printed table and what matters at each level. */
export default function ElementCard({ el, level, selected, onEnter, touch }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const tag = LANG_TAG[lang] ?? lang
  const color = FAMILY[el.family].color
  const state = el.state ? t(el.statePredicted ? 'state.at20Predicted' : 'state.at20', { state: t(`state.${el.state}`) }) : null
  const sci = level === 'scientist'
  return (
    <div className="glass rounded-2xl p-3 sm:p-4 w-[min(92vw,22rem)] shadow-2xl text-left">
      <div className="flex gap-3 items-stretch">
        <div
          className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex flex-col justify-between p-1.5 font-display"
          style={{ background: `linear-gradient(160deg, ${color}55, ${color}18)`, border: `2px solid ${color}` }}
        >
          <div className="text-xs sm:text-sm leading-none opacity-90">{el.z}</div>
          <div className="text-4xl sm:text-5xl font-bold leading-none text-center">{el.symbol}</div>
          <div className="text-[10px] sm:text-xs leading-none text-center opacity-80">{num(el.mass, tag, 5)}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-2xl sm:text-3xl font-bold leading-tight truncate">{nameOf(el, lang)}</div>
          <div className="text-sm font-bold" style={{ color }}>{t(`family.${el.family}`)}</div>
          {state && <div className="text-sm opacity-90 mt-0.5">{state}</div>}
          {el.radioactive && <div className="text-xs mt-0.5 text-lime-300">☢ {t('card.radioactive')}</div>}
          {WINGS[el.symbol] && <div className="text-xs mt-0.5 text-amber-300">★ {t('card.worlds', { count: WINGS[el.symbol].length })}</div>}
        </div>
      </div>
      {!sci && <p className="text-sm mt-2 opacity-90">{t('card.atomSentence', { count: el.z })}</p>}
      {sci && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[13px] mt-2">
          <dt className="opacity-70">{t('card.mass')}</dt><dd>{num(el.mass, tag, 6)} u</dd>
          <dt className="opacity-70">{t('card.config')}</dt><dd>{config(el.config)}</dd>
          <dt className="opacity-70">{t('card.group')} · {t('card.period')} · {t('card.block')}</dt>
          <dd>{el.group ?? '–'} · {el.period} · {el.block}</dd>
          <dt className="opacity-70">{t('card.en')}</dt><dd>{el.en ?? '?'}</dd>
          <dt className="opacity-70">{t('card.melt')}</dt><dd>{temperature(el.melt, level, tag)}</dd>
          <dt className="opacity-70">{t('card.boil')}</dt><dd>{temperature(el.boil, level, tag)}</dd>
          <dt className="opacity-70">{t('card.density')}</dt><dd>{density(el, tag)}</dd>
          <dt className="opacity-70">{t('card.discovered')}</dt><dd>{el.ancient ? t('card.ancient') : el.discovered ?? '?'}</dd>
        </dl>
      )}
      {selected && (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onEnter}
            className="font-display font-bold text-lg px-5 py-2 rounded-xl text-[#0b0f24] shadow-lg active:scale-95 transition"
            style={{ background: color }}
          >
            {t('card.enter')} ▶
          </button>
          <span className="text-xs opacity-70 leading-tight">{t(touch ? 'card.tapAgain' : 'card.clickAgain')}</span>
        </div>
      )}
    </div>
  )
}
