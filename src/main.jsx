import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker registered with scope:', reg.scope)
        
        // Check for updates every hour
        setInterval(() => {
          reg.update().then(() => {
            console.log('Checked for service worker update')
          })
        }, 60 * 60 * 1000)
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err)
      })
  })
}