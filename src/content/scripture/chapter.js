// The whole chapters behind the passages (chapterPanel in index.js): asked of the site's /api/chapter
// (api/chapter.js) when a visitor opens one, and kept for the visit. docs/knowledge/scripture.md.
const loaded = new Map() // `${v}:${ch}` -> { status: 'loading' | 'ready' | 'away', data, waiting }

/** A chapter's state now ({ status, data }): one not asked for yet is asked for, and `onReady` is called
 *  when it has come (or turned out not to be available: the panel then links to the Bible App). */
export function chapterState(c, onReady) {
  const key = `${c.v}:${c.ch}`
  let e = loaded.get(key)
  if (!e) {
    e = { status: 'loading', data: null, waiting: new Set() }
    loaded.set(key, e)
    fetch(`/api/chapter?v=${encodeURIComponent(c.v)}&ch=${encodeURIComponent(c.ch)}`)
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null)
      .then(data => {
        e.status = data?.verses?.length ? 'ready' : 'away'
        e.data = data
        for (const f of e.waiting) f()
        e.waiting.clear()
      })
  }
  if (e.status === 'loading' && onReady) e.waiting.add(onReady)
  return { status: e.status, data: e.data }
}
