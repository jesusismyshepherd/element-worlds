// What the player has discovered (a station read, an exhibit tried), kept on the device: keys like
// "C:identity" or "O:air:candle". A small game for Artur: every world counts its discoveries.
const KEY = 'ew-found'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

let found = load()

export const isFound = key => found.has(key)

export function markFound(key) {
  if (found.has(key)) return false
  found.add(key)
  try {
    localStorage.setItem(KEY, JSON.stringify([...found]))
  } catch {
    // storage blocked: kept for this visit
  }
  return true
}

/** How many of these keys are found. */
export const countFound = keys => keys.filter(k => found.has(k)).length

export function resetFound() {
  found = new Set()
  try {
    localStorage.removeItem(KEY)
  } catch {
    // storage blocked
  }
}
