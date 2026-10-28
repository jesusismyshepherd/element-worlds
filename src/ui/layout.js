// The HUD's layout rules (docs/knowledge/hud-layout.md): the middle of the screen stays free for the
// 3D; everything the HUD shows hugs an edge. A piece that covers a good part of an edge reports it
// (useCover) and the engine draws the world's centre in the part left free.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { coverId, setCover } from '../engine/covers.js'

const measure = () => {
  const w = window.innerWidth
  const h = window.innerHeight
  return {
    w,
    h,
    narrow: w < 640, // an upright phone
    short: h < 520, // a phone on its side
    portrait: h > w,
    touch: !!window.matchMedia?.('(pointer: coarse)').matches,
  }
}

/** The screen's size and kind, kept up to date: { w, h, narrow, short, portrait, touch, compact }
 *  (compact: a phone either way up, where panels fold away). */
export function useViewport() {
  const [v, setV] = useState(measure)
  useEffect(() => {
    const on = () => setV(measure())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return { ...v, compact: v.narrow || v.short }
}

/** Report what an element covers of the screen from one edge ('top', 'right', 'bottom', 'left'),
 *  while `on`; the engine then keeps the world's centre in the part left free. */
export function useCover(ref, side, on = true) {
  const st = useRef(null)
  if (!st.current) {
    const s = { id: coverId(), el: null, side: null, ro: null }
    s.update = () => {
      const el = s.el
      if (!el || !el.isConnected) {
        setCover(s.id, null)
        return
      }
      const r = el.getBoundingClientRect()
      const size = s.side === 'left' ? r.right : s.side === 'right' ? window.innerWidth - r.left : s.side === 'top' ? r.bottom : window.innerHeight - r.top
      setCover(s.id, r.width && r.height ? { side: s.side, size } : null)
    }
    st.current = s
  }
  // after every render: a layout that swaps the element for another (a phone turned) is followed
  useLayoutEffect(() => {
    const s = st.current
    const el = on && side ? ref.current : null
    if (el !== s.el || side !== s.side) {
      s.ro?.disconnect()
      s.ro = null
      s.el = el
      s.side = side
      if (el) {
        s.ro = new ResizeObserver(s.update)
        s.ro.observe(el)
      }
    }
    s.update()
  })
  useEffect(() => {
    const s = st.current
    window.addEventListener('resize', s.update)
    return () => {
      window.removeEventListener('resize', s.update)
      s.ro?.disconnect()
      s.ro = null
      s.el = null
      setCover(s.id, null)
    }
  }, [])
}
