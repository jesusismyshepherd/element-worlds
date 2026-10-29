import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/700.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'
import i18n from './i18n'
import './index.css'
import App from './App'
import { watchReleases } from './engine/release.js'
import { autoFullscreen } from './ui/fullscreen.js'
import { startTelemetry, watchStore } from './net/telemetry.js'
import { store } from './state.js'

watchReleases()
// phones and tablets go full screen at the first touch (src/ui/fullscreen.js)
autoFullscreen()
// what is visited and done, for the family dashboard (src/net/telemetry.js, docs/knowledge/usage-data.md)
startTelemetry().then(() => watchStore(store, i18n))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
