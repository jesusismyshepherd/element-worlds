// A new version of the site went live while this page was open (or a cached page names files the new
// version no longer has): a world's code then fails to load ("Failed to fetch dynamically imported
// module", or the server answers a script with the HTML page). The page reloads itself once to pick up
// the new version; a second failure within a minute is shown as an error instead (no reload loop).
const KEY = 'ew-reloaded-at'

/** Whether an error is a chunk of code that could not be loaded. */
export const isStaleChunk = err => /dynamically imported module|Importing a module script failed|module script|MIME type|Failed to fetch|error loading dynamically/i.test(String(err?.message ?? err))

/** Reload the page once for a stale chunk; true when it does (the caller then shows nothing). */
export function reloadOnce() {
  let last = 0
  try {
    last = Number(sessionStorage.getItem(KEY) ?? 0)
  } catch {
    // storage blocked: reload anyway, once per page
  }
  if (Date.now() - last < 60000) return false
  try {
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    // storage blocked
  }
  window.location.reload()
  return true
}

/** A newer version went live while this page stayed open (an installed app is rarely closed): asked
 *  when the page comes back on screen and every ten minutes; sets `update` in the store, and the HUD
 *  offers to reload (a reload keeps the walker's place and the room). */
export function watchUpdates(store) {
  // the dev server has no version.json (it answers with the page)
  // eslint-disable-next-line no-undef
  const mine = typeof __BUILD__ === 'string' ? __BUILD__ : null
  if (!mine || import.meta.env.DEV) return
  let asked = 0
  const ask = async () => {
    if (document.hidden || store.get().update || Date.now() - asked < 30000) return
    asked = Date.now()
    try {
      const r = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
      const { build } = await r.json()
      if (build && build !== mine) store.set({ update: true })
    } catch {
      // offline, or not deployed yet: ask again later
    }
  }
  document.addEventListener('visibilitychange', ask)
  window.addEventListener('focus', ask)
  window.addEventListener('online', ask)
  setInterval(ask, 600000)
}

/** Vite's own signal that a preloaded chunk failed (the same cause). */
export function watchReleases() {
  window.addEventListener('vite:preloadError', e => {
    if (reloadOnce()) e.preventDefault()
  })
}
