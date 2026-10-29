/* eslint-disable react/prop-types */
// The account (docs/knowledge/accounts.md): the top bar's 👤 button (on a phone, a row of the ☰ menu)
// opens a sheet under the bar on the right. Signed out: sign in, or a new account (the pokemon-site's
// accounts: a name and a password), and the switch "Record what I play" for this device. Signed in:
// who, what came over from this device, the switch (kept with the account), sign out, and for an admin
// the family dashboard.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { account } from '../net/account.js'
import { deviceSwitch, setDeviceSwitch } from '../net/telemetry.js'

const BTN = 'glass rounded-xl px-2.5 py-1.5 text-xs font-bold hover:bg-white/10'
const INPUT = 'mt-0.5 w-full rounded-lg bg-white/10 px-2.5 py-1.5 text-sm outline-none focus:ring-1 ring-white/50'

/** The 👤 button (a row when `row`: the phone's ☰ menu). */
export function AccountButton({ compact, row, onOpen }) {
  const { t } = useTranslation()
  const me = useStore(store, s => s.account)
  if (row) {
    return (
      <button type="button" data-account-row onClick={onOpen} className="rounded-lg px-2.5 py-1.5 text-sm font-bold hover:bg-white/10 text-left">
        👤 {me ? me.username : t('account.signIn')}
      </button>
    )
  }
  return (
    <button type="button" data-account-button onClick={onOpen} className={`${BTN} ${me ? 'ring-1 ring-sky-300/70' : ''}`} title={me ? t('account.signedInAs', { name: me.username }) : t('account.title')}>
      👤{!compact && <span className="hidden 2xl:inline ml-1">{me ? me.username : t('account.signIn')}</span>}
    </button>
  )
}

/** A switch: on and off, with its words beside it. */
function Switch({ on, onChange, label, help, data }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        data-switch={data}
        onClick={() => onChange(!on)}
        className={`shrink-0 mt-0.5 w-10 h-6 rounded-full transition relative ${on ? 'bg-emerald-400' : 'bg-white/20'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-[1.125rem]' : 'left-0.5'}`} />
      </button>
      <span className="text-sm leading-snug">
        <span className="font-bold">{label}</span>
        {help && <span className="block text-xs opacity-75">{help}</span>}
      </span>
    </label>
  )
}

/** The sheet, under the bar on the right. */
export function AccountSheet({ onClose }) {
  const { t } = useTranslation()
  const me = useStore(store, s => s.account)
  const [tab, setTab] = useState('in')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState(null)
  const [local, setLocal] = useState(deviceSwitch)

  const submit = async e => {
    e?.preventDefault()
    if (busy || !name.trim() || !password) return
    setBusy(true)
    setProblem(null)
    try {
      if (tab === 'in') await account.signIn(name, password)
      else await account.signUp(name, password)
      setPassword('')
    } catch (err) {
      setProblem(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div data-account-sheet className="absolute right-2 sm:right-3 glass rounded-xl p-3 w-[min(21rem,calc(100vw-1rem))] z-20 max-h-[calc(100vh-5rem)] overflow-y-auto text-sm pointer-events-auto" style={{ top: 'calc(var(--bar) + 0.25rem)' }}>
      <div className="flex items-center justify-between gap-2">
        <div className="font-display font-bold text-base">👤 {me ? me.username : t('account.title')}</div>
        <button type="button" onClick={onClose} className="rounded-lg px-2 py-0.5 hover:bg-white/10" aria-label={t('hud.close')}>✕</button>
      </div>

      {me ? (
        <div className="mt-2 flex flex-col gap-3">
          <div className="text-[13px] opacity-90">
            {t('account.signedInAs', { name: me.username })}. {t('account.saved')}
          </div>
          {me.moved && me.moved.found > 0 && <div data-account-moved className="text-[13px] text-emerald-300">✓ {t('account.moved', { count: me.moved.found })}</div>}
          <Switch on={me.tracking} onChange={v => account.setTracking(v)} label={t('account.track')} help={t('account.trackHelp')} data="tracking" />
          {me.admin && (
            <Link to="/stats" onClick={onClose} className="self-start rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20">
              📊 {t('account.admin')}
            </Link>
          )}
          <button type="button" data-account-out onClick={() => account.signOut()} className="self-start rounded-xl px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20">
            {t('account.signOut')}
          </button>
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-[13px] opacity-85 leading-snug">{t('account.intro')}</p>
          <div className="flex rounded-lg bg-white/5 p-0.5 text-xs font-bold" role="tablist">
            {[['in', t('account.signIn')], ['up', t('account.signUp')]].map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} data-account-tab={k} onClick={() => { setTab(k); setProblem(null) }} className={`flex-1 rounded-md px-2 py-1 ${tab === k ? 'bg-white text-[#0b0f24]' : 'opacity-80 hover:bg-white/10'}`}>
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="flex flex-col gap-2">
            <label className="text-xs opacity-80">
              {t('account.username')}
              <input data-account-name value={name} maxLength={20} autoComplete="username" autoCapitalize="none" spellCheck={false} onChange={e => setName(e.target.value)} className={INPUT} />
            </label>
            <label className="text-xs opacity-80">
              {t('account.password')}
              <div className="flex gap-1.5 items-center">
                <input data-account-password type={show ? 'text' : 'password'} value={password} autoComplete={tab === 'in' ? 'current-password' : 'new-password'} onChange={e => setPassword(e.target.value)} className={INPUT} />
                <button type="button" onClick={() => setShow(s => !s)} className="shrink-0 rounded-lg px-2 py-1.5 text-[11px] font-bold bg-white/10 hover:bg-white/20 mt-0.5">{show ? t('account.hide') : t('account.show')}</button>
              </div>
            </label>
            {problem && <div data-account-problem className="text-xs text-rose-300">{t(`account.errors.${problem}`, { defaultValue: t('account.errors.failed') })}</div>}
            <button type="submit" data-account-submit disabled={busy || !name.trim() || !password} className="rounded-xl px-3 py-2 font-bold bg-sky-300 text-[#0b0f24] disabled:opacity-40">
              {busy ? t('account.working') : tab === 'in' ? t('account.doSignIn') : t('account.doSignUp')}
            </button>
          </form>
          <p className="text-[12px] opacity-70 leading-snug">{t('account.pokemon')}</p>
          <div className="pt-2 border-t border-white/10">
            <Switch on={local} onChange={v => { setDeviceSwitch(v); setLocal(v) }} label={t('account.track')} help={t('account.trackHelp')} data="device-tracking" />
          </div>
        </div>
      )}
    </div>
  )
}
