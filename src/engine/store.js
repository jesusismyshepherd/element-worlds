// A small store between the 3D (plain modules) and the HUD (React): the engine sets, the HUD reads.
import { useSyncExternalStore } from 'react'

export function createStore(initial) {
  let state = initial
  const subs = new Set()
  return {
    get: () => state,
    set(patch) {
      const next = typeof patch === 'function' ? patch(state) : patch
      if (Object.keys(next).every(k => Object.is(state[k], next[k]))) return
      state = { ...state, ...next }
      subs.forEach(f => f(state))
    },
    subscribe(f) {
      subs.add(f)
      return () => subs.delete(f)
    },
  }
}

/** A value from the store; select something stable (a field, not a new object each time). */
export function useStore(store, select) {
  const get = () => select(store.get())
  return useSyncExternalStore(store.subscribe, get, get)
}

const LEVEL = 'ew-level'

/** Explorer (plain words, the default) or Scientist (numbers, units, the why), kept on the device. */
export function savedLevel() {
  try {
    return localStorage.getItem(LEVEL) === 'scientist' ? 'scientist' : 'explorer'
  } catch {
    return 'explorer'
  }
}

export function saveLevel(level) {
  try {
    localStorage.setItem(LEVEL, level)
  } catch {
    // storage blocked
  }
}
