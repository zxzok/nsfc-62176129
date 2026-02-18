import { createContext, useContext, useState, useCallback } from 'react'
import zh from './zh.json'
import en from './en.json'

const translations = { zh, en }
const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('lang') || 'zh' } catch { return 'zh' }
  })

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang)
    try { localStorage.setItem('lang', lang) } catch {}
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value ?? key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useTranslation must be used within LanguageProvider')
  return context
}
