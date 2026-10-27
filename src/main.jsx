import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/700.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'
import './i18n'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
