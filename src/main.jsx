import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { LanguageProvider } from './i18n'
import { ThemeProvider } from './theme'
import { LayoutProvider } from './layout'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <ThemeProvider>
          <LayoutProvider>
            <App />
          </LayoutProvider>
        </ThemeProvider>
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>
)
