import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const THEMES = ['modern', 'academic', 'dark', 'tesla', 'nature', 'rose', 'lavender', 'sunset']
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('theme') || 'modern' } catch { return 'modern' }
  })

  const setTheme = useCallback((t) => {
    if (!THEMES.includes(t)) return
    setThemeState(t)
    try { localStorage.setItem('theme', t) } catch { /* noop */ }
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export { THEMES }
