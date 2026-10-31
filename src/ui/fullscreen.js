// Full screen (no address bar, no tabs): a button in the top bar on every screen whose browser has
// full screen, and on touch screens it comes on by itself at the first touch, as in the arena on
// pokemon-site (src/games/arena/useFullscreen.js), and again on a touch after the back gesture took it
// away, until the player leaves it with the button. An iPhone's browser has no full screen for a
// page: there the site added to the home screen opens without the browser's bars
// (public/manifest.webmanifest).
import { useEffect, useState } from 'react'

const OFF = 'ew-fullscreen-off'
const page = () => document.documentElement
const current = () => document.fullscreenElement ?? document.webkitFullscreenElement ?? null

/** Whether this browser can show the page full screen. */
export const canFullscreen = () => {
  const el = page()
  return !!(el.requestFullscreen || el.webkitRequestFullscreen) && document.fullscreenEnabled !== false
}

function request() {
  const el = page()
  const go = el.requestFullscreen ?? el.webkitRequestFullscreen
  const p = go?.call(el, { navigationUI: 'hide' })
  return p instanceof Promise ? p : Promise.resolve()
}

function exit() {
  const go = document.exitFullscreen ?? document.webkitExitFullscreen
  const p = go?.call(document)
  return p instanceof Promise ? p.catch(() => {}) : Promise.resolve()
}

const optedOut = () => {
  try {
    return sessionStorage.getItem(OFF) === '1'
  } catch {
    return false
  }
}

const setOptedOut = off => {
  try {
    if (off) sessionStorage.setItem(OFF, '1')
    else sessionStorage.removeItem(OFF)
  } catch {
    // storage blocked: the choice lasts until the next touch
  }
}

/** Touch screens: full screen at the end of the first touch (a browser grants it only to a tap,
 *  and for a finger the tap counts when it lifts), and again after the back gesture left it; never
 *  after the player left it with the button, nor after the browser refused twice. */
export function autoFullscreen() {
  if (!window.matchMedia?.('(pointer: coarse)').matches || !canFullscreen()) return
  let refusals = 0
  const ask = e => {
    if (e.pointerType === 'mouse' || current() || optedOut() || refusals >= 2) return
    request().catch(() => {
      refusals += 1
    })
  }
  window.addEventListener('pointerup', ask, true)
}

/** For the button: { can, on, toggle }. */
export function useFullscreen() {
  const [on, setOn] = useState(() => !!current())
  useEffect(() => {
    const change = () => setOn(!!current())
    document.addEventListener('fullscreenchange', change)
    document.addEventListener('webkitfullscreenchange', change)
    return () => {
      document.removeEventListener('fullscreenchange', change)
      document.removeEventListener('webkitfullscreenchange', change)
    }
  }, [])
  const toggle = () => {
    if (current()) {
      setOptedOut(true)
      exit()
    } else {
      setOptedOut(false)
      request().catch(() => {})
    }
  }
  return { can: canFullscreen(), on, toggle }
}

/** A page that is read, not played (/stats, /studio): no full screen at the first touch, the same
 *  opt-out the button sets, for as long as the page is open. */
export function useNoAutoFullscreen() {
  useEffect(() => {
    let before = null
    try {
      before = sessionStorage.getItem(OFF)
      sessionStorage.setItem(OFF, '1')
    } catch {
      // storage blocked: nothing to undo
    }
    return () => {
      try {
        if (before == null) sessionStorage.removeItem(OFF)
      } catch {
        // as above
      }
    }
  }, [])
}
