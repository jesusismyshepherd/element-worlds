// Today's element's state for the HUD and the passport: the kept days, boxes and guesses (read again
// when a lesson is done, a guess made or an account's days come in) and the day itself (again when the
// page comes back on screen or the clock passes midnight). docs/knowledge/daily.md.
import { useEffect, useState } from 'react'
import { dailyState, onDaily } from '../engine/progress.js'
import { dayOf, streakOf } from '../game/daily.js'

export function useDaily() {
  const [state, setState] = useState(dailyState)
  const [today, setToday] = useState(dayOf)
  useEffect(() => onDaily(() => setState(dailyState())), [])
  useEffect(() => {
    const check = () => setToday(dayOf())
    const id = setInterval(check, 60000)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])
  return { state, today, streak: streakOf(state.days, today) }
}
