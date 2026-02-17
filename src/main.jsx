import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LozenApp from './LozenApp.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <LozenApp />
    </ErrorBoundary>
  </StrictMode>,
)
