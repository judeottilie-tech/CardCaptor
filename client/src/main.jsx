import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { installMockApi } from './mock/mockApi'

// The hosted backend is shut down, so by default the app runs against an
// in-browser mock API. Set VITE_USE_REAL_API=true to talk to a real backend.
if (import.meta.env.VITE_USE_REAL_API !== 'true') {
  installMockApi()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
