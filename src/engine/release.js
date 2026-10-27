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

/** Vite's own signal that a preloaded chunk failed (the same cause). */
export function watchReleases() {
  window.addEventListener('vite:preloadError', e => {
    if (reloadOnce()) e.preventDefault()
  })
}
