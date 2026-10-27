import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Explore from './pages/Explore.jsx'

const Atomlings = lazy(() => import('./pages/Atomlings.jsx'))
const Passport = lazy(() => import('./pages/Passport.jsx'))

export default function App() {
  return (
    <Routes>
      <Route path="/atomlings" element={<Suspense fallback={null}><Atomlings /></Suspense>} />
      <Route path="/passport" element={<Suspense fallback={null}><Passport /></Suspense>} />
      <Route path="/*" element={<Explore />} />
    </Routes>
  )
}
