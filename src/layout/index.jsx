import { createContext, useContext, useState, useCallback } from 'react'

const LAYOUTS = ['classic', 'magazine', 'dashboard']
const LayoutContext = createContext()

export function LayoutProvider({ children }) {
  const [layout, setLayoutState] = useState(() => {
    try { return localStorage.getItem('layout') || 'classic' } catch { return 'classic' }
  })

  const setLayout = useCallback((l) => {
    if (!LAYOUTS.includes(l)) return
    setLayoutState(l)
    try { localStorage.setItem('layout', l) } catch { /* noop */ }
  }, [])

  return (
    <LayoutContext.Provider value={{ layout, setLayout, layouts: LAYOUTS }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) throw new Error('useLayout must be used within LayoutProvider')
  return context
}

export { LAYOUTS }
