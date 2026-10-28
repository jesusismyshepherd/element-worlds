/* eslint-disable react/prop-types */
// The on-screen stick for touch screens, from pokemon-site's arena (src/games/arena/TouchStick.jsx):
// reports { x, y } in -1..1 (y up = forward), or null when let go; it lets go when the page loses
// focus (a call, the app switcher), since the pointer-up never comes then.
import { useEffect, useRef, useState } from 'react'

/** small: a phone on its side (little height), a smaller stick nearer the corner. */
export default function TouchStick({ onChange, small = false }) {
  const RADIUS = small ? 40 : 48
  const baseRef = useRef(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  const update = e => {
    const r = baseRef.current.getBoundingClientRect()
    let dx = e.clientX - (r.left + r.width / 2)
    let dy = e.clientY - (r.top + r.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS
      dy = (dy / len) * RADIUS
    }
    setKnob({ x: dx, y: dy })
    onChange({ x: dx / RADIUS, y: -dy / RADIUS })
  }

  const release = () => {
    setKnob({ x: 0, y: 0 })
    onChange(null)
  }
  const ref = useRef(release)
  ref.current = release
  useEffect(() => {
    const blur = () => ref.current()
    const hidden = () => document.hidden && ref.current()
    window.addEventListener('blur', blur)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      window.removeEventListener('blur', blur)
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [])

  return (
    <div
      ref={baseRef}
      data-thumb
      className={`absolute rounded-full ${small ? 'left-3 bottom-3 w-[6.5rem] h-[6.5rem]' : 'left-4 bottom-4 w-32 h-32'} bg-white/10 border border-white/30 touch-none pointer-events-auto`}
      onPointerDown={e => {
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={e => e.buttons && update(e)}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      <div
        className="absolute left-1/2 top-1/2 w-14 h-14 -ml-7 -mt-7 rounded-full bg-white/60 shadow-lg pointer-events-none"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  )
}
