// What happens in the game, sent to the family's database so we can see what is liked, revisited, never
// found or confusing (the user, 2026-10-29; docs/knowledge/usage-data.md). Two kinds of visitor:
// - a family member's device, marked once with ?who=artur (?who=off unmarks it): its events carry the
//   device's id and are kept as its history; a device can be retagged or unmarked on the dashboard;
// - everyone else: anonymous, nothing stored in the browser, one random id per page load, and nothing at
//   all when the browser asks not to be tracked (Global Privacy Control, Do Not Track).
// No names, no addresses. Nothing is recorded on the dev server or under a test browser (the probes).
// track(kind, data) anywhere; the store's changes (world, selection, panels, level, view) are watched here.
import { rpc } from './config.js'

const DEVICE = 'ew-device'
const WHO = 'ew-who'
const QUEUE = 'ew-queue'
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

let device = null // the marked device's id, or null (anonymous)
let who = null
let visit = null
let queue = []
let on = false
let timer = null

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

/** Who this device records as (null when it is anonymous). */
export const recordingAs = () => who

/** Note something that happened: a short kind and a little data. */
export function track(kind, data) {
  if (!on) return
  queue.push({ at: new Date().toISOString(), k: kind, p: location.pathname, d: data ?? undefined })
  if (device) safe(() => localStorage.setItem(QUEUE, JSON.stringify(queue.slice(-500))))
  if (queue.length >= 60) flush()
}

async function flush(keepalive = false) {
  if (!queue.length) return
  const batch = queue.splice(0, 250)
  if (device) safe(() => localStorage.setItem(QUEUE, JSON.stringify(queue)))
  try {
    await rpc('ew_log', { p_device: device, p_visit: visit, p_events: batch }, { keepalive })
  } catch {
    // offline or the database away: put them back for the next try (a marked device keeps them)
    queue = [...batch, ...queue].slice(-500)
    if (device) safe(() => localStorage.setItem(QUEUE, JSON.stringify(queue)))
  }
}

/** Start: read ?who=, decide what is recorded, watch the page. Call once, before the app. */
export async function startTelemetry() {
  if (on || !allowed()) return
  const params = new URLSearchParams(location.search)
  const tag = params.get('who')
  if (tag != null) {
    // take the tag out of the address, so a shared link does not mark another device
    params.delete('who')
    const rest = params.toString()
    history.replaceState(history.state, '', `${location.pathname}${rest ? `?${rest}` : ''}${location.hash}`)
  }
  device = safe(() => localStorage.getItem(DEVICE))
  who = safe(() => localStorage.getItem(WHO))
  if (tag != null) {
    if (tag.toLowerCase() === 'off') {
      if (device) rpc('ew_mark', { p_device: device, p_label: 'off' }).catch(() => {})
      safe(() => [DEVICE, WHO, QUEUE].forEach(k => localStorage.removeItem(k)))
      device = who = null
    } else {
      device = device || uuid()
      const r = await rpc('ew_mark', { p_device: device, p_label: tag, p_kind: deviceKind(), p_browser: browserName() }).catch(() => null)
      if (r?.marked) {
        who = r.label
        safe(() => {
          localStorage.setItem(DEVICE, device)
          localStorage.setItem(WHO, who)
        })
      }
    }
  } else if (device) {
    // still marked? (the dashboard can unmark a device that was marked by mistake)
    rpc('ew_status', { p_device: device })
      .then(r => {
        if (r && !r.marked) {
          safe(() => [DEVICE, WHO, QUEUE].forEach(k => localStorage.removeItem(k)))
          device = who = null
        } else if (r?.label && r.label !== who) {
          who = r.label
          safe(() => localStorage.setItem(WHO, who))
        }
      })
      .catch(() => {})
  }
  if (!device && declined()) return
  on = true
  visit = uuid()
  // a marked device sends what was left from its last visit
  if (device) queue = safe(() => JSON.parse(localStorage.getItem(QUEUE) ?? '[]')) ?? []
  track('start', {
    kind: deviceKind(),
    browser: browserName(),
    w: innerWidth,
    h: innerHeight,
    app: matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || undefined,
  })
  timer = setInterval(() => flush(), FLUSH_MS)
  window.__ewTelemetry = { flush: () => flush(), device: () => device, visit: () => visit } // for tools/usage_probe.py
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
 *  (and how long they stayed open), level, view and language changes. */
export function watchStore(store, i18n) {
  if (!on) return
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
  store.subscribe(s => {
    const was = prev
    prev = s
    // a world is the same world while its key is (the store gets a new object for it on every set)
    const key = s.world ? [s.world.kind, s.world.symbol, s.world.wing].filter(Boolean).join(':') : null
    if (key && key !== where) {
      leaveWorld()
      where = key
      since = performance.now()
      activeAt = activeNow()
      track('enter', { w: where })
    }
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
