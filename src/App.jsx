import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Explore from './pages/Explore.jsx'

const Atomlings = lazy(() => import('./pages/Atomlings.jsx'))
const Passport = lazy(() => import('./pages/Passport.jsx'))
// the family dashboard of what was visited and done (docs/knowledge/usage-data.md)
const Stats = lazy(() => import('./pages/Stats.jsx'))
// the family studio: the backlog, and ideas, notes and verdicts sent to Claude (docs/knowledge/update-dashboard.md)
const Studio = lazy(() => import('./pages/Studio.jsx'))

export default function App() {
  return (
    <Routes>
      <Route path="/atomlings" element={<Suspense fallback={null}><Atomlings /></Suspense>} />
      <Route path="/passport" element={<Suspense fallback={null}><Passport /></Suspense>} />
      <Route path="/stats" element={<Suspense fallback={null}><Stats /></Suspense>} />
      <Route path="/studio" element={<Suspense fallback={null}><Studio /></Suspense>} />
      <Route path="/*" element={<Explore />} />
    </Routes>
  )
}
