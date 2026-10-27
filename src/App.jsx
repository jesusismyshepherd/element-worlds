import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Explore from './pages/Explore.jsx'

const Atomlings = lazy(() => import('./pages/Atomlings.jsx'))

export default function App() {
  return (
    <Routes>
      <Route path="/atomlings" element={<Suspense fallback={null}><Atomlings /></Suspense>} />
      <Route path="/*" element={<Explore />} />
    </Routes>
  )
}
