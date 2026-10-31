// The family dashboard (/stats): what is visited and done in Element Worlds, for the parent; in English
// only (an admin page, not part of the game). docs/knowledge/usage-data.md says what is recorded, why,
// and how to read it. Behind a password, or open to a signed-in admin account (profiles.is_admin; the
// account's session goes with every call): every call goes through ew_admin (src/stats/api.js). The
// numbers come from src/stats/analyze.js, the words from readings.js and timeline.js, the charts from
// ui.jsx. Nothing on this page is recorded by the game's telemetry (the Explore page is not mounted
// here, and analyze.js drops any event whose address is /stats).
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { admin, refused, savedPass, keepPass, dropPass, savedFilter, keepFilter } from '../stats/api.js'
import { analyze, periodStart, PERIODS, LIMIT, visitSummary, SKIM_MS, QUICK_MS } from '../stats/analyze.js'
import * as R from '../stats/readings.js'
import { timelineOf, compact } from '../stats/timeline.js'
import { dur, durShort, when, whenFrom, clock, day, shortDay, plural, times, niceCeil, niceDuration, pct, dec, cap } from '../stats/format.js'
import { PlaceName, placeName, panelName, whereName, elementName, setBoardTitles, personName, deviceName, featureName, missionName, beamName, drawerTitle, levelName, viewName, langName } from '../stats/names.js'
import { loadBoards } from '../content/boards/index.js'
import { Card, Kpi, Table, Columns, BarRows, StackRows, Legend, Chip, INK, SERIES, STATUS, BUTTON } from '../stats/ui.jsx'
import { useStore } from '../engine/store.js'
import { store } from '../state.js'
import { useNoAutoFullscreen } from '../ui/fullscreen.js'

// the halls with picture boards (src/content/boards/<Symbol>.js), known without loading them
const BOARD_HALLS = Object.keys(import.meta.glob('../content/boards/[A-Z]*.js')).map(k => k.match(/([A-Za-z]+)\.js$/)[1])
const BOARDS_LOADED = new Set()
const SITE = 'https://element-worlds.vercel.app'
const INPUT = 'rounded-lg bg-[#121838] border border-white/20 px-2.5 py-1.5 text-sm outline-none focus:border-[#3987e5]'
const PRIMARY = 'rounded-lg px-3 py-1.5 text-sm font-bold bg-[#256abf] hover:bg-[#2a78d6] disabled:opacity-50'

// phones go full screen at their first touch on every page (src/ui/fullscreen.js); not this one, which
// is read, not played (useNoAutoFullscreen, shared with /studio)

export default function Stats() {
  const [pass, setPass] = useState(savedPass)
  const [state, setState] = useState(() => (savedPass() ? 'checking' : 'gate'))
  const [note, setNote] = useState(null)
  useNoAutoFullscreen()
  useEffect(() => {
    const before = document.title
    document.title = 'Family dashboard · Element Worlds'
    return () => {
      document.title = before
    }
  }, [])
  // a password kept from before: still the right one?
  useEffect(() => {
    if (state !== 'checking' || !pass) return undefined
    let live = true
    admin(pass, 'check')
      .then(r => {
        if (!live) return
        if (r?.ok) setState('in')
        else {
          dropPass()
          setPass(null)
          setState('gate')
          setNote(refused(r) ? 'The saved password is no longer right. Log in again.' : 'The password could not be checked. Try again.')
        }
      })
      .catch(() => {
        if (!live) return
        setState('gate')
        setNote('The database could not be reached. Check the connection and try again.')
      })
    return () => {
      live = false
    }
  }, [state, pass])
  const logout = useCallback(msg => {
    dropPass()
    setPass(null)
    setState('gate')
    setNote(typeof msg === 'string' ? msg : null)
  }, [])
  // signed in as an admin on this device: no password needed
  const me = useStore(store, s => s.account)
  useEffect(() => {
    if (me?.admin && state === 'gate') {
      setPass('')
      setState('in')
    }
  }, [me?.admin, state])

  return (
    <div className="min-h-full text-[#eef2ff]" style={{ background: '#0b0f24', colorScheme: 'dark' }}>
      {state === 'in' && pass != null ? (
        <Dashboard pass={pass} logout={logout} />
      ) : (
        <Gate
          checking={state === 'checking'}
          note={note}
          onIn={p => {
            keepPass(p)
            setPass(p)
            setNote(null)
            setState('in')
          }}
        />
      )}
    </div>
  )
}

/** The password gate: one field; the password is kept on this device once it worked. */
function Gate({ checking, note, onIn }) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const submit = async e => {
    e.preventDefault()
    if (!value || busy) return
    setBusy(true)
    setError(null)
    try {
      const r = await admin(value, 'check')
      if (r?.ok) {
        onIn(value)
        return
      }
      setError(refused(r) ? 'Wrong password.' : 'Something went wrong. Try again.')
    } catch {
      setError('The database could not be reached. Check the connection and try again.')
    }
    setBusy(false)
  }
  return (
    <div className="sm:min-h-[85vh] flex items-start sm:items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="glass rounded-2xl p-5 w-full max-w-sm" data-gate>
        <Link to="/" className="text-xs uppercase tracking-wider" style={{ color: INK.muted }}>
          Element Worlds
        </Link>
        <h1 className="font-display text-2xl font-bold mt-0.5">Family dashboard</h1>
        <p className="text-sm mt-2" style={{ color: INK.secondary }}>
          What is visited and done in the game. The password stays on this device until you log out.
        </p>
        {checking ? (
          <p className="mt-4 text-sm">Checking the saved password…</p>
        ) : (
          <>
            <label className="block mt-4 text-sm font-bold" htmlFor="dash-pass">
              Password
            </label>
            <input id="dash-pass" type="password" autoComplete="current-password" value={value} onChange={e => setValue(e.target.value)} className={`${INPUT} mt-1 w-full text-base`} autoFocus />
            <button type="submit" disabled={busy || !value} className={`${PRIMARY} mt-3 w-full py-2`}>
              {busy ? 'Checking…' : 'Open'}
            </button>
            {(error || note) && (
              <p role="alert" className="mt-3 text-sm" data-gate-error>
                {error ?? note}
              </p>
            )}
          </>
        )}
      </form>
    </div>
  )
}

const NAV = [
  ['devices', 'People'],
  ['summary', 'Summary'],
  ['days', 'Days'],
  ['places', 'Places'],
  ['halls', 'Halls'],
  ['panels', 'Panels'],
  ['plaza', 'Plaza'],
  ['quiz', 'Quiz'],
  ['forge', 'Forge'],
  ['errors', 'Errors'],
  ['timeline', 'Timeline'],
]

function Dashboard({ pass, logout }) {
  const [filter] = useState(savedFilter)
  const [who, setWho] = useState(typeof filter.who === 'string' ? filter.who : '')
  const [period, setPeriod] = useState(PERIODS.some(p => p.id === filter.period) ? filter.period : '7')
  const [devices, setDevices] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)
  const [, setNamesReady] = useState(0)
  useEffect(() => {
    keepFilter({ who, period })
  }, [who, period])

  const call = useCallback(
    async (action, args) => {
      const r = await admin(pass, action, args)
      if (refused(r)) {
        logout('The password is no longer accepted. Log in again.')
        throw new Error('password')
      }
      return r
    },
    [pass, logout],
  )

  const loadDevices = useCallback(
    () =>
      call('devices')
        .then(r => setDevices(Array.isArray(r) ? r : []))
        .catch(e => e.message !== 'password' && setError(`The devices could not be loaded (${e.message}).`)),
    [call],
  )
  useEffect(() => {
    loadDevices()
  }, [loadDevices, tick])

  useEffect(() => {
    let live = true
    const now = Date.now()
    const args = { since: new Date(periodStart(period, now)).toISOString(), limit: LIMIT }
    if (who) args.who = who
    setLoading(true)
    call('events', args)
      .then(raw => {
        if (!live) return
        setData({ raw: Array.isArray(raw) ? raw : [], period, who, now })
        setError(null)
      })
      .catch(e => {
        if (live && e.message !== 'password') setError(`The events could not be loaded (${e.message}).`)
      })
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [call, who, period, tick])

  const a = useMemo(() => (data ? analyze(data.raw, { period: data.period, now: data.now, boards: BOARD_HALLS }) : null), [data])

  // the picture boards' titles, to name their panels (loaded with the halls that have them)
  useEffect(() => {
    if (!a) return
    const need = new Set(a.readings.filter(r => r.id.startsWith('board:') && r.place.startsWith('atrium:')).map(r => r.place.slice(7)))
    const todo = [...need].filter(s => !BOARDS_LOADED.has(s))
    if (!todo.length) return
    todo.forEach(s => BOARDS_LOADED.add(s))
    Promise.all(todo.map(s => loadBoards(s).then(b => setBoardTitles(s, b)).catch(() => {}))).then(() => setNamesReady(n => n + 1))
  }, [a])

  const tags = useMemo(() => {
    const t = new Set((devices ?? []).map(d => d.label).filter(Boolean))
    if (who && who !== 'anon') t.add(who)
    return [...t].sort()
  }, [devices, who])

  const refresh = () => setTick(t => t + 1)
  const status = !data ? 'Loading…' : `${data.raw.length.toLocaleString('en-GB')} ${data.raw.length === 1 ? 'event' : 'events'} · loaded ${clock(data.now)}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <header className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <Link to="/" className="text-xs uppercase tracking-wider" style={{ color: INK.muted }}>
            Element Worlds
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">Family dashboard</h1>
        </div>
        {/* the family studio: ideas, the queue, Claude's answers (docs/knowledge/update-dashboard.md) */}
        <Link to="/studio" className={BUTTON} data-studio-link>
          Studio
        </Link>
        <button type="button" className={BUTTON} onClick={refresh} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
        <button type="button" className={BUTTON} onClick={() => logout()} data-logout>
          Log out
        </button>
      </header>

      <nav className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-4" aria-label="Sections" style={{ color: INK.secondary }}>
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="underline decoration-white/20 underline-offset-2 hover:text-white">
            {label}
          </a>
        ))}
      </nav>

      <Devices
        devices={devices}
        call={call}
        reload={loadDevices}
        onChanged={refresh}
        onRetag={(id, from, to) => {
          // the filter follows a renamed tag, unless another device still has the old one
          if (who === from && !(devices ?? []).some(d => d.id !== id && d.label === from)) setWho(to)
        }}
      />

      <div className="flex flex-wrap items-center gap-2 mt-4 mb-4" data-filters>
        <div role="group" aria-label="Period" className="flex rounded-lg border border-white/20 overflow-hidden">
          {PERIODS.map(p => (
            <button key={p.id} type="button" aria-pressed={period === p.id} onClick={() => setPeriod(p.id)} className={`px-2.5 py-1.5 text-sm ${period === p.id ? 'bg-[#256abf] font-bold' : 'hover:bg-white/10'}`} data-period={p.id}>
              {p.label}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="dash-who">
          Who
        </label>
        <select id="dash-who" value={who} onChange={e => setWho(e.target.value)} className={INPUT}>
          <option value="">Everyone</option>
          {tags.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value="anon">Anonymous visitors</option>
        </select>
        <span className="text-xs" style={{ color: INK.muted }} data-status>
          {status}
        </span>
      </div>

      {error && (
        <div role="alert" className="glass rounded-xl px-3 py-2 mb-4 text-sm" style={{ borderColor: STATUS.critical }}>
          ⚠ {error}
        </div>
      )}
      {data && data.raw.length >= LIMIT && (
        <div className="glass rounded-xl px-3 py-2 mb-4 text-sm">Only the newest {LIMIT.toLocaleString('en-GB')} events of this period were loaded: its first days are incomplete. A shorter period reads them all.</div>
      )}

      {!a ? (
        <p className="text-sm" style={{ color: INK.secondary }}>
          Loading…
        </p>
      ) : (
        <div className={`space-y-4 transition-opacity ${loading ? 'opacity-60' : ''}`} data-dashboard>
          <Summary a={a} />
          {a.events.length ? (
            <>
              <Days a={a} />
              <div className="grid lg:grid-cols-2 gap-4 items-start">
                <Places a={a} />
                <div className="space-y-4 min-w-0">
                  <Quick a={a} />
                  <Never a={a} />
                </div>
              </div>
              <Halls a={a} />
              <Panels a={a} />
              <div className="grid lg:grid-cols-2 gap-4 items-start">
                <Plaza a={a} />
                <Quiz a={a} />
              </div>
              <div className="grid lg:grid-cols-2 gap-4 items-start">
                <Forge a={a} />
                <Tools a={a} />
              </div>
              <Errors a={a} />
              {a.others.length > 0 && <Others a={a} />}
              <Timeline a={a} call={call} onForgot={refresh} />
            </>
          ) : (
            <section className="glass rounded-2xl p-5" data-section="empty">
              <h2 className="font-display text-lg font-bold">Nothing recorded</h2>
              <p className="text-sm mt-1" style={{ color: INK.secondary }}>
                No visit for this choice of who and period. A longer period, or Everyone, may have some.
              </p>
            </section>
          )}
        </div>
      )}

      <footer className="text-xs mt-6 mb-2 leading-relaxed" style={{ color: INK.muted }}>
        What is recorded: places entered and for how long, panels opened, talks, picks, quiz answers, forge actions and errors. Signed-in players keep a history under their account
        (unless they switch it off); other visitors are anonymous, one visit at a time, with nothing stored in their browser, and nothing at all when their browser asks not to be tracked
        or they switch it off. No names or addresses. Kept for 180 days. Times are in this device's time zone.
      </footer>
    </div>
  )
}

// ---- people (the signed-in accounts that played) ----

function Devices({ devices, call, reload, onChanged }) {
  const [ask, setAsk] = useState(null) // the account waiting for "forget their history?"
  const [busy, setBusy] = useState(null)
  const [msg, setMsg] = useState(null)
  const act = async (id, action, args = {}) => {
    setBusy(id)
    setMsg(null)
    try {
      const r = await call(action, { device: id, ...args })
      if (r?.error) setMsg(`That did not work (${r.error}).`)
      else {
        setAsk(null)
        await reload()
        onChanged()
      }
    } catch (e) {
      if (e.message !== 'password') setMsg(`The database could not be reached (${e.message}).`)
    }
    setBusy(null)
  }
  return (
    <Card id="devices" title="People">
      <p className="text-sm -mt-0.5 mb-3" style={{ color: INK.secondary }}>
        Everyone who signs in on the game (the 👤 button; the same accounts as the Pokémon site) is recorded under their account, unless they switched &quot;Record what I play&quot; off. Their discoveries
        follow them to every device.
      </p>
      {msg && (
        <p role="alert" className="text-sm mb-2">
          ⚠ {msg}
        </p>
      )}
      {!devices ? (
        <p className="text-sm" style={{ color: INK.muted }}>
          Loading…
        </p>
      ) : !devices.length ? (
        <p className="text-sm" style={{ color: INK.muted }}>
          Nobody has signed in on the game yet.
        </p>
      ) : (
        <ul className="divide-y divide-white/10" data-devices>
          {devices.map(d => (
            <li key={d.id} className="py-2 flex flex-wrap items-center gap-x-3 gap-y-1.5" data-device={d.id}>
              <div className="min-w-0 flex-1 basis-64">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold" data-tag>
                    {d.label}
                  </span>
                  {d.removed ? <Chip mark="○">recording off</Chip> : <Chip mark="●" color={INK.primary}>recording</Chip>}
                  {d.kind && (
                    <span className="text-sm" style={{ color: INK.secondary }}>
                      {deviceName(d.kind, d.browser)}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: INK.muted }}>
                  first seen {when(Date.parse(d.first_seen))}
                  {d.last_seen ? <> · last seen {when(Date.parse(d.last_seen))}</> : null} · <span data-events>{plural(Number(d.events) || 0, 'event')}</span> · {plural(Number(d.discoveries) || 0, 'discovery', 'discoveries')}
                </div>
              </div>
              {ask === d.id ? (
                <div className="flex flex-wrap items-center gap-1.5 text-sm" data-confirm>
                  <span>Forget their {plural(Number(d.events) || 0, 'event')}? The account and its discoveries stay. This cannot be undone.</span>
                  <button type="button" className={`${BUTTON} border-[#d03b3b]`} disabled={busy === d.id} onClick={() => act(d.id, 'forget')} data-forget-yes>
                    Forget the history
                  </button>
                  <button type="button" className={BUTTON} onClick={() => setAsk(null)}>
                    Keep
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" className={BUTTON} disabled={busy === d.id || !(Number(d.events) > 0)} onClick={() => setAsk(d.id)} data-forget>
                    Forget the history
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// ---- the summary: numbers, then guesses ----

function Summary({ a }) {
  const t = a.totals
  const q = a.quiz
  const signals = R.signalsOf(a)
  return (
    <section id="summary" data-section="summary" className="space-y-4 scroll-mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Kpi label="Visits" value={t.visits} sub={t.anon ? `${t.anon} anonymous` : t.visits ? 'all marked devices' : 'none'} />
        <Kpi label="Active time" value={dur(t.active)} sub="on show and touched" />
        <Kpi label="Active per visit" value={dur(t.perVisit)} sub={t.visits ? `over ${plural(t.visits, 'visit')}` : 'none'} />
        <Kpi label="Places entered" value={t.places} sub={`${plural(t.halls, 'hall')} among them`} />
        <Kpi label="Panels read" value={`${t.read} of ${t.opened}`} sub={`open ${SKIM_MS / 1000} s or longer`} />
        <Kpi label="Quiz answers right" value={q.answers ? pct(q.right, q.answers) : 'none'} sub={q.answers ? `of ${plural(q.answers, 'answer')}` : 'not played'} />
      </div>
      <Card id="suggests" title="What it suggests" reading="Guesses from the numbers below, to look into, not facts.">
        {signals.length ? (
          <ul className="space-y-2" data-signals>
            {signals.map((s, i) => (
              <li key={i} className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2 text-sm" data-tone={s.tone}>
                <span className="shrink-0 sm:w-[8.5rem]">
                  <Chip mark={R.TONES[s.tone]?.mark} markColor={s.tone === 'broken' ? STATUS.critical : null} color={INK.primary}>
                    {R.TONES[s.tone]?.label ?? s.tone}
                  </Chip>
                </span>
                <span className="min-w-0">{s.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm" style={{ color: INK.muted }}>
            Nothing recorded in this period.
          </p>
        )}
      </Card>
    </section>
  )
}

// ---- visits and active time over time ----

const HOUR = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
const WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric' })
const countAxis = m => (m <= 2 ? 2 : m <= 4 ? 4 : m <= 6 ? 6 : m <= 10 ? 10 : 2 * niceCeil(m / 2))

function Days({ a }) {
  const unit = a.days[0]?.unit ?? 'day'
  const label = b => (unit === 'hour' ? HOUR.format(new Date(b.start)) : unit === 'week' ? shortDay(b.start) : a.days.length <= 7 ? WEEKDAY.format(new Date(b.start)) : shortDay(b.start))
  const every = unit === 'hour' ? 6 : unit === 'week' ? 4 : a.days.length <= 7 ? 1 : 5
  const what = b => (unit === 'hour' ? `${HOUR.format(new Date(b.start))} to ${HOUR.format(new Date(b.end))}` : unit === 'week' ? `week of ${shortDay(b.start)}` : day(b.start))
  const title = unit === 'hour' ? 'Today, hour by hour' : unit === 'week' ? 'Visits and active time, week by week' : 'Visits and active time, day by day'
  return (
    <Card
      id="days"
      title={title}
      reading={R.readDays(a)}
      table={() => (
        <Table head={['When', 'Visits', 'Active']} align={['', 'r', 'r']} rows={a.days.filter(b => b.visits || b.active).map(b => [what(b), b.visits, dur(b.active)])} empty="No visits." />
      )}
    >
      <div className="text-xs font-bold mb-1" style={{ color: INK.secondary }}>
        Active time
      </div>
      <Columns name="active" buckets={a.days} value={b => b.active} axis={niceDuration} fmt={durShort} tip={b => [`${dur(b.active)} active`, `${what(b)} · ${plural(b.visits, 'visit')}`]} xLabels={false} height={110} />
      <div className="text-xs font-bold mt-5 mb-1" style={{ color: INK.secondary }}>
        Visits
      </div>
      <Columns name="visits" buckets={a.days} value={b => b.visits} axis={countAxis} fmt={n => String(Math.round(n))} tip={b => [plural(b.visits, 'visit'), `${what(b)} · ${dur(b.active)} active`]} label={label} every={every} height={56} />
    </Card>
  )
}

// ---- places ----

function Places({ a }) {
  const [all, setAll] = useState(false)
  const rows = a.places.filter(p => p.active > 0 || p.entries > 0)
  const shown = all ? rows : rows.slice(0, 12)
  return (
    <Card
      id="places"
      title="Where the active time goes"
      reading={R.readPlaces(a)}
      table={() => (
        <Table
          head={['Place', 'Active', 'Open', 'Entered', 'Visits', 'Quick exits', 'Talks']}
          align={['', 'r', 'r', 'r', 'r', 'r', 'r']}
          rows={rows.map(p => [PlaceName(p.w) + (p.est ? ' (partly estimated)' : ''), dur(p.active), dur(p.open), p.entries, p.visits, p.quick, p.talks])}
        />
      )}
    >
      <BarRows
        name="places"
        rows={shown.map(p => ({
          key: p.w,
          name: PlaceName(p.w),
          value: p.active,
          label: `${durShort(p.active)} · ${plural(p.visits, 'visit')}`,
          tip: [`${dur(p.active)} active`, `${PlaceName(p.w)}: entered ${times(p.entries)}, in ${plural(p.visits, 'visit')}${p.quick ? `, ${p.quick} quick exits` : ''}`],
        }))}
      />
      {rows.length > 12 && (
        <button type="button" className={`${BUTTON} mt-3`} onClick={() => setAll(x => !x)}>
          {all ? 'Show the first 12' : `Show all ${rows.length}`}
        </button>
      )}
    </Card>
  )
}

function Quick({ a }) {
  const entries = new Map(a.places.map(p => [p.w, p]))
  return (
    <Card id="quick" title={`Left within ${QUICK_MS / 1000} s`} reading={R.readQuick(a)}>
      {a.quick.places.length > 0 && (
        <BarRows
          name="quick"
          nameWidth="11rem"
          rows={a.quick.places.map(p => {
            const of = entries.get(p.w)?.entries ?? p.n
            return { key: p.w, name: PlaceName(p.w), value: p.n, label: `${p.n} of ${of}`, tip: [`${plural(p.n, 'quick exit')}`, `${PlaceName(p.w)}, of ${plural(of, 'entry', 'entries')}`] }
          })}
        />
      )}
    </Card>
  )
}

function Never({ a }) {
  const unused = a.features.filter(f => f.n === 0)
  const used = a.features.filter(f => f.n > 0)
  return (
    <Card id="never" title="Never entered, never used" reading={R.readNever(a)}>
      {a.never.length > 0 && (
        <ul className="text-sm space-y-0.5 mb-3" data-never>
          {R.neverGroups(a.never).map(g => (
            <li key={g.key}>
              {cap(g.name)}
              {g.note && <span style={{ color: INK.muted }}> ({g.note})</span>}
            </li>
          ))}
        </ul>
      )}
      {used.length > 0 && (
        <p className="text-xs" style={{ color: INK.muted }}>
          Used: {used.map(f => `${featureName(f.id)} (${f.n})`).join(', ')}.
        </p>
      )}
      {!unused.length && !a.never.length && <p className="text-sm">Everything was found.</p>}
    </Card>
  )
}

// ---- halls ----

function Halls({ a }) {
  const [all, setAll] = useState(false)
  const every = a.halls.filter(h => h.entries > 0 || h.opened || h.talks)
  const halls = all ? every : every.slice(0, 15)
  return (
    <Card id="halls" title="In the halls" reading={R.readHalls(a)}>
      <Table
        head={['Hall', 'Active', 'Visits', 'Panels read', 'Skimmed', 'Reading', 'Talks', 'Floor table', 'Wings entered']}
        align={['', 'r', 'r', 'r', 'r', 'r', 'r', 'r', '']}
        empty="No hall was entered."
        rows={halls.map(h => [
          <span key="n" className="whitespace-nowrap">
            {elementName(h.symbol)}
            {h.boards && (
              <span className="ml-1.5">
                <Chip title="This hall has picture boards">boards</Chip>
              </span>
            )}
          </span>,
          dur(h.active) + (h.est ? '*' : ''),
          h.visits,
          h.read,
          h.skimmed,
          h.read ? dur(h.avgRead) : 'none',
          h.talks,
          h.tiles,
          <span key="w" className="whitespace-nowrap">
            {h.wings.length ? h.wings.map(w => `${placeName(`wing:${h.symbol}:${w.id}`).replace(/^.*?wing /, '')}${w.n > 1 ? ` (${w.n})` : ''}`).join(', ') : 'none'}
          </span>,
        ])}
      />
      {halls.some(h => h.est) && (
        <p className="text-xs mt-2" style={{ color: INK.muted }}>
          * includes a stay estimated from the last thing recorded (the page was closed or put away there).
        </p>
      )}
      {every.length > 15 && (
        <button type="button" className={`${BUTTON} mt-3`} onClick={() => setAll(x => !x)}>
          {all ? 'Show the first 15' : `Show all ${every.length}`}
        </button>
      )}
    </Card>
  )
}

// ---- panels ----

function Panels({ a }) {
  const [all, setAll] = useState(false)
  const groups = a.panels
  const shown = all ? groups : groups.slice(0, 12)
  const unknown = groups.some(g => g.unknown)
  const series = [
    { key: 'read', color: SERIES.blue, label: `Read (open ${SKIM_MS / 1000} s or more)` },
    { key: 'skimmed', color: SERIES.orange, label: `Skimmed (closed within ${SKIM_MS / 1000} s)` },
    ...(unknown ? [{ key: 'unknown', color: SERIES.rest, label: 'Open when the page was closed' }] : []),
  ]
  const nameOf = g => `${cap(panelName(g.id, g.places[0]))}, ${whereName(g.where, g.places)}`
  return (
    <Card
      id="panels"
      title="Panels: read or skimmed"
      reading={R.readPanels(a)}
      table={() => (
        <Table
          head={['Panel', 'Where', 'Opened', 'Read', 'Skimmed', 'Average reading']}
          align={['', '', 'r', 'r', 'r', 'r']}
          rows={groups.map(g => [cap(panelName(g.id, g.places[0])), whereName(g.where, g.places), g.opened, g.read, g.skimmed, g.read ? dur(g.avgRead) : 'none'])}
          empty="No panel was opened."
        />
      )}
    >
      {groups.length ? (
        <>
          <Legend items={series} />
          <StackRows
            name="panels"
            nameWidth="16rem"
            series={series}
            rows={shown.map(g => ({
              key: g.key,
              name: nameOf(g),
              values: { read: g.read, skimmed: g.skimmed, unknown: g.unknown },
              label: `${g.read} read · ${g.skimmed} skimmed${g.read ? ` · ${durShort(g.avgRead)}` : ''}`,
              tip: k =>
                k === 'read'
                  ? [`${g.read} read, ${dur(g.avgRead)} on average`, nameOf(g)]
                  : k === 'skimmed'
                    ? [`${g.skimmed} skimmed`, nameOf(g)]
                    : [`${g.unknown} open when the page was closed`, nameOf(g)],
            }))}
          />
          {groups.length > 12 && (
            <button type="button" className={`${BUTTON} mt-3`} onClick={() => setAll(x => !x)}>
              {all ? 'Show the first 12' : `Show all ${groups.length}`}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm" style={{ color: INK.muted }}>
          No panel was opened.
        </p>
      )}
    </Card>
  )
}

// ---- the plaza, the quiz, the forge, the tools ----

function Plaza({ a }) {
  const p = a.plaza
  return (
    <Card id="plaza" title="On the plaza" reading={R.readPlaza(a)}>
      {p.picks.length > 0 && (
        <>
          <div className="text-xs font-bold mb-1" style={{ color: INK.secondary }}>
            Elements picked most
          </div>
          <BarRows
            name="picks"
            nameWidth="8rem"
            rows={p.picks.slice(0, 8).map(x => ({ key: x.symbol, name: elementName(x.symbol), value: x.n, label: `${x.n}${x.entered ? ' · hall entered' : ''}`, tip: [plural(x.n, 'pick'), `${elementName(x.symbol)}${x.entered ? ', its hall entered' : ', its hall not entered'}`] }))}
          />
        </>
      )}
      {p.facts.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-bold mb-1" style={{ color: INK.secondary }}>
            The card&apos;s facts
          </div>
          <Table head={['Element', 'Clicks', 'Facts seen']} align={['', 'r', 'r']} rows={p.facts.map(f => [elementName(f.symbol), f.clicks, f.n ? `${f.seen} of ${f.n}` : f.seen])} />
        </div>
      )}
    </Card>
  )
}

function Quiz({ a }) {
  const q = a.quiz
  return (
    <Card id="quiz" title="The quiz “Who am I?”" reading={R.readQuiz(a)}>
      {q.answers > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Kpi label="Answers" value={q.answers} sub={`opened ${times(q.opened)}`} />
            <Kpi label="Right" value={pct(q.right, q.answers)} sub={`${q.right} of ${q.answers}`} />
            <Kpi label="Clues shown" value={dec(q.clues)} sub={q.of ? `of ${dec(q.of)} on average` : 'on average'} />
            <Kpi label="Rounds finished" value={q.rounds} sub="of 10 questions" />
          </div>
          {q.missed.length > 5 && (
            <p className="text-sm mt-3">
              <span style={{ color: INK.secondary }}>Missed: </span>
              {q.missed.map(m => `${elementName(m.symbol)}${m.n > 1 ? ` (${m.n})` : ''}`).join(', ')}
            </p>
          )}
        </>
      )}
    </Card>
  )
}

const PART = { p: 'proton', n: 'neutron', e: 'electron' }
const parts = counts =>
  Object.entries(counts)
    .filter(([, n]) => n)
    .map(([k, n]) => plural(n, PART[k]))
    .join(', ') || 'none'

function Forge({ a }) {
  const f = a.forge
  return (
    <Card id="forge" title="The Atom Forge" reading={R.readForge(a)}>
      {f.actions > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Kpi label="Actions" value={f.actions} sub={f.entries ? `in ${plural(f.entries, 'stay')}` : ''} />
            <Kpi label="Added" value={f.add} sub={parts(f.parts)} />
            <Kpi label="Removed" value={f.remove} sub={parts(f.removed)} />
            <Kpi label="Beams fired" value={f.fire} sub={f.beams.map(b => `${beamName(b.id)} (${b.n})`).join(', ') || 'none'} />
          </div>
          {f.missions.length > 5 && (
            <p className="text-sm mt-3">
              <span style={{ color: INK.secondary }}>Missions done: </span>
              {f.missions.map(missionName).join(', ')}
            </p>
          )}
        </>
      )}
    </Card>
  )
}

function Tools({ a }) {
  const t = a.tools
  const rows = [
    ...t.drawers.map(d => [`${drawerTitle(d.id)} drawer`, d.n]),
    ...t.level.map(x => [`Switched to ${levelName(x.v)}`, x.n]),
    ...t.view.map(x => [`Switched to ${viewName(x.v)}`, x.n]),
    ...t.lang.map(x => [`Language changed to ${langName(x.v)}`, x.n]),
  ]
  return (
    <Card id="tools" title="Drawers and settings" reading={R.readTools(a)}>
      {rows.length > 0 && <Table head={['What', 'Times']} align={['', 'r']} rows={rows} />}
    </Card>
  )
}

// ---- errors and the rest ----

function Errors({ a }) {
  return (
    <Card id="errors" title="Errors" reading={R.readErrors(a)}>
      {a.errors.length > 0 && (
        <Table
          head={['Last seen', 'Message', 'Where', 'Device', 'Times']}
          align={['', '', '', '', 'r']}
          rows={a.errors.map(g => {
            const devices = [...new Set(g.list.map(x => `${personName(x.label)} (${deviceName(x.kind, x.browser)})`))]
            return [
              <span key="w" className="whitespace-nowrap">{when(g.last)}</span>,
              <span key="m" className="break-words">
                <span aria-hidden="true" style={{ color: STATUS.critical }}>
                  ⚠{' '}
                </span>
                {g.m}
                {g.s && <span style={{ color: INK.muted }}> ({g.s})</span>}
              </span>,
              g.places.map(placeName).join(', '),
              devices.join(', '),
              g.n,
            ]
          })}
        />
      )}
    </Card>
  )
}

function Others({ a }) {
  return (
    <Card id="others" title="Other events" reading={R.readOthers(a)}>
      <Table head={['Kind', 'Count', 'Latest data']} align={['', 'r', '']} rows={a.others.map(o => [o.kind, o.n, <span key="d" className="break-all text-xs">{compact(o.sample) || 'none'}</span>])} />
    </Card>
  )
}

// ---- one visit at a time ----

function Timeline({ a, call, onForgot }) {
  const visits = useMemo(() => [...a.visits].reverse(), [a])
  const [sel, setSel] = useState(null)
  const [shown, setShown] = useState(30)
  const [ask, setAsk] = useState(false)
  const [busy, setBusy] = useState(false)
  const v = visits.find(x => x.id === sel) ?? visits[0] ?? null
  const lines = useMemo(() => (v ? timelineOf(v) : []), [v])
  useEffect(() => setAsk(false), [v?.id])
  const forget = async () => {
    setBusy(true)
    try {
      await call('forget_visit', { visit: v.id })
      setSel(null)
      onForgot()
    } catch {
      // the password check logs out; anything else: the visit stays
    }
    setBusy(false)
    setAsk(false)
  }
  const reading = visits.length ? `${plural(visits.length, 'visit')} in this period, newest first; choose the person with Who above. Pick a visit to read it as it happened.` : 'No visits.'
  return (
    <Card id="timeline" title="One visit at a time" reading={reading}>
      <div className="grid md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] gap-4">
        <ol className="max-h-[30rem] overflow-y-auto overscroll-contain space-y-1 pr-1" data-visits>
          {visits.slice(0, shown).map(x => {
            const s = visitSummary(x)
            const on = x.id === v?.id
            return (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => setSel(x.id)}
                  aria-pressed={on}
                  data-visit={x.id}
                  className={`w-full text-left rounded-lg px-2.5 py-1.5 border ${on ? 'bg-white/10 border-[#3987e5]' : 'border-transparent hover:bg-white/5'}`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm flex-1 min-w-0 truncate">{when(s.start)}</span>
                    <span className="text-xs tabular-nums" style={{ color: INK.secondary }}>
                      {dur(s.ms)}
                    </span>
                  </div>
                  <div className="text-xs truncate" style={{ color: INK.muted }}>
                    {personName(s.label)} · {deviceName(s.kind, s.browser)} · {dur(s.active)} active · {plural(s.places, 'place')}
                    {s.errors ? ` · ⚠ ${plural(s.errors, 'error')}` : ''}
                  </div>
                </button>
              </li>
            )
          })}
          {visits.length > shown && (
            <li>
              <button type="button" className={`${BUTTON} mt-1`} onClick={() => setShown(n => n + 30)}>
                Show {Math.min(30, visits.length - shown)} more
              </button>
            </li>
          )}
        </ol>
        <div className="min-w-0" data-timeline>
          {v ? (
            <>
              <div className="flex flex-wrap items-baseline gap-x-2 mb-2">
                <h3 className="font-display font-bold">{when(v.start)}</h3>
                <span className="text-sm" style={{ color: INK.secondary }}>
                  {personName(v.label)} · {deviceName(v.kind, v.browser)} · {dur(Math.max(0, v.end - v.start))} open, {dur(v.active)} active
                </span>
              </div>
              <ol className="text-sm space-y-0.5" data-lines>
                {lines.map((l, i) => (
                  <li
                    key={i}
                    className={`flex gap-2 ${l.head ? 'font-bold mt-2' : ''} ${l.tone === 'error' ? 'rounded px-1 -mx-1' : ''}`}
                    style={l.tone === 'error' ? { boxShadow: `inset 3px 0 0 ${STATUS.critical}`, background: 'rgba(208, 59, 59, 0.12)' } : l.tone === 'note' ? { color: INK.muted, fontStyle: 'italic' } : undefined}
                  >
                    <span className="tabular-nums shrink-0 min-w-[3rem] whitespace-nowrap font-normal" style={{ color: INK.muted }}>
                      {whenFrom(l.at, v.start)}
                    </span>
                    <span className="min-w-0">
                      {l.tone === 'error' ? '⚠ ' : ''}
                      {l.text}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                {ask ? (
                  <>
                    <span>Forget this visit&apos;s {plural(v.events.length, 'event')}? This cannot be undone.</span>
                    <button type="button" className={BUTTON} disabled={busy} onClick={forget} data-forget-visit-yes>
                      Forget for good
                    </button>
                    <button type="button" className={BUTTON} onClick={() => setAsk(false)}>
                      Keep
                    </button>
                  </>
                ) : (
                  <button type="button" className={BUTTON} onClick={() => setAsk(true)} data-forget-visit>
                    Forget this visit
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm" style={{ color: INK.muted }}>
              No visits.
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
