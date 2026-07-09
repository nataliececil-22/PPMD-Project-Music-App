import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Polyfill window.storage for local dev (the component expects this API)
window.storage = {
  get: async (key) => {
    const value = localStorage.getItem(key)
    return value ? { value } : null
  },
  set: async (key, value) => {
    localStorage.setItem(key, value)
  },
  delete: async (key) => {
    localStorage.removeItem(key)
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
