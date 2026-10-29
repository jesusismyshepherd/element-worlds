// What happens in the game, sent to the family's database so we can see what is liked, revisited, never
// found or confusing (the user, 2026-10-29; docs/knowledge/usage-data.md). Two kinds of player:
// - signed in (src/net/account.js): the events go under the account and are kept as its history;
//   the account's switch ("Record what I play", on by default) turns it off on every device;
// - everyone else: anonymous, nothing stored in the browser, one random id per page load; the same
//   switch, kept on the device, turns it off, and nothing is recorded when the browser asks not to be
//   tracked (Global Privacy Control, Do Not Track).
// No names, no addresses. Nothing is recorded on the dev server or under a test browser (the probes).
// track(kind, data) anywhere; the store's changes (world, selection, panels, level, view) are watched here.
// (Until 2026-10-29 a family device was marked with ?who=<tag>; accounts replaced the tags.)
import { rpc, signedIn } from './config.js'

const SWITCH = 'ew-track' // 'off': this device records nothing while signed out
const FLUSH_MS = 15000
const IDLE_MS = 60000

const safe = f => {
  try {
    return f()
  } catch {
    return null
  }
}
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)))

let visit = null
let queue = []
let on = false
let started = false
let account = null // { username, tracking } while signed in
let ready = Promise.resolve() // the sign-in check: nothing is sent before it (else a returning player's first events go out anonymous)

/** Is anything recorded at all on this page? */
const allowed = () => {
  if (typeof window === 'undefined') return false
  if (/[?&]track=1/.test(location.search)) return true // a probe that checks the recording itself
  if (navigator.webdriver) return false // the probes (Playwright)
  if (/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname)) return false
  if (location.pathname.startsWith('/stats')) return false // the family dashboard itself
  return true
}
const declined = () => navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1'

/** The device's own switch (signed out). */
export const deviceSwitch = () => safe(() => localStorage.getItem(SWITCH)) !== 'off'

export function deviceKind() {
  const touch = matchMedia('(pointer: coarse)').matches
  const short = Math.min(screen.width, screen.height)
  return !touch ? 'computer' : short < 600 ? 'phone' : 'tablet'
}

export function browserName() {
  const ua = navigator.userAgent
  const b = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser'
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '?'
  return `${b} on ${os}`
}

/** Who is recorded on this page (the signed-in username, while recording), or null. */
export const recordingAs = () => (on && account?.tracking ? account.username : null)

/** Is this page recording? */
export const recording = () => on

/** Note something that happened: a short kind and a little data. */
export function track(kind, data) {
  if (!on) return
  queue.push({ at: new Date().toISOString(), k: kind, p: location.pathname, d: data ?? undefined })
  if (queue.length >= 60) flush()
}

async function flush(keepalive = false) {
  await ready
  if (!queue.length || !on) return
  const batch = queue.splice(0, 250)
  try {
    await rpc('ew_log', { p_visit: visit, p_events: batch }, { keepalive })
  } catch {
    // offline or the database away: put them back for the next try
    queue = [...batch, ...queue].slice(-500)
  }
}

/** What to record now: called when the account is known, and when a switch is turned. */
function decide() {
  const want = allowed() && (account ? account.tracking : deviceSwitch() && !declined())
  if (want === on) return
  on = want
  if (!on) queue = []
  else if (!visit) begin()
}

/** The sign-in state (from src/net/account.js): null when signed out. */
export function setAccount(a) {
  account = a
  decide()
}

/** Hold sending until the sign-in check is done (account.js passes its promise). */
export function waitFor(p) {
  ready = Promise.race([p.catch(() => {}), new Promise(r => setTimeout(r, 8000))])
}

/** The switch while signed out (kept on this device). */
export function setDeviceSwitch(v) {
  safe(() => (v ? localStorage.removeItem(SWITCH) : localStorage.setItem(SWITCH, 'off')))
  decide()
}

/** Start: decide what is recorded, watch the page. Call once, before the app. */
export function startTelemetry() {
  if (started) return
  started = true
  // the tags of before: out of the address and the device
  const params = new URLSearchParams(location.search)
  if (params.has('who')) {
    params.delete('who')
    const rest = params.toString()
    history.replaceState(history.state, '', `${location.pathname}${rest ? `?${rest}` : ''}${location.hash}`)
  }
  safe(() => ['ew-device', 'ew-who', 'ew-queue'].forEach(k => localStorage.removeItem(k)))
  decide()
}

function begin() {
  visit = uuid()
  track('start', {
    kind: deviceKind(),
    browser: browserName(),
    w: innerWidth,
    h: innerHeight,
    app: matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || undefined,
  })
  setInterval(() => flush(), FLUSH_MS)
  addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      track('hide')
      flush(true)
    } else track('show')
  })
  addEventListener('pagehide', () => flush(true))
  // errors: the most useful thing to know about a device we cannot look at
  addEventListener('error', e => track('err', { m: String(e.message ?? '').slice(0, 200), s: `${String(e.filename ?? '').split('/').pop()}:${e.lineno ?? ''}` }))
  addEventListener('unhandledrejection', e => track('err', { m: String(e.reason?.message ?? e.reason ?? '').slice(0, 200), s: 'promise' }))
  watchActivity()
  window.__ewTelemetry = { flush: () => flush(), visit: () => visit, on: () => on, signedIn } // for the probes
  if (pendingWatch) pendingWatch()
}

// ---- time spent: only while the page is on show and someone touched it in the last minute ----
let lastInput = performance.now()
let lastTick = performance.now()
let active = 0
function watchActivity() {
  const touched = () => (lastInput = performance.now())
  for (const ev of ['pointerdown', 'keydown', 'wheel', 'touchstart']) addEventListener(ev, touched, { passive: true, capture: true })
  let moved = 0
  addEventListener('pointermove', () => {
    const now = performance.now()
    if (now - moved > 2000) {
      moved = now
      touched()
    }
  }, { passive: true, capture: true })
  setInterval(activeNow, 1000)
}
/** The active time so far, to the millisecond (counted up to now, not in whole ticks). */
function activeNow() {
  const now = performance.now()
  if (document.visibilityState === 'visible' && now - lastInput < IDLE_MS) active += now - lastTick
  lastTick = now
  return active
}

/** Watch the store: worlds entered and left (with the time spent), the plaza's selection, panels opened
 *  (and how long they stayed open), level, view and language changes. Waits for the recording to
 *  start when it is off at first (it may be turned on later). */
let pendingWatch = null
export function watchStore(store, i18n) {
  if (!visit) {
    pendingWatch = () => {
      pendingWatch = null
      watchStore(store, i18n)
    }
    return
  }
  let where = null
  let since = 0
  let activeAt = 0
  let panel = null
  const leaveWorld = () => {
    if (!where) return
    const ms = performance.now() - since
    track('leave', { w: where, ms: Math.round(ms), act: Math.round(Math.min(ms, activeNow() - activeAt)) })
  }
  let prev = store.get()
  const enter = s => {
    // a world is the same world while its key is (the store gets a new object for it on every set)
    const key = s.world ? [s.world.kind, s.world.symbol, s.world.wing].filter(Boolean).join(':') : null
    if (key && key !== where) {
      leaveWorld()
      where = key
      since = performance.now()
      activeAt = activeNow()
      track('enter', { w: where })
    }
  }
  enter(prev)
  store.subscribe(s => {
    const was = prev
    prev = s
    enter(s)
    if (s.selected !== was.selected && s.selected != null) track('sel', { z: s.selected })
    const id = s.panel ? s.panelFrom ?? s.panel.title : null
    if (id !== (panel?.id ?? null)) {
      if (panel) track('pclose', { id: panel.id, ms: Math.round(performance.now() - panel.at) })
      panel = id ? { id: String(id).slice(0, 60), at: performance.now() } : null
      if (panel) track('panel', { id: panel.id })
    }
    if (s.level !== was.level) track('level', { v: s.level })
    if (s.mode !== was.mode) track('view', { v: s.mode })
  })
  i18n.on('languageChanged', lng => track('lang', { v: lng }))
  addEventListener('pagehide', leaveWorld)
}
