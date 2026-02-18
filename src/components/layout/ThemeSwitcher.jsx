import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../theme'
import { useTranslation } from '../../i18n'

const themeMeta = {
  modern: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    zh: '现代渐变',
    en: 'Modern',
  },
  academic: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    zh: '学术极简',
    en: 'Academic',
  },
  dark: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
    zh: '沉浸暗色',
    en: 'Dark',
  },
  tesla: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
    zh: '极致简约',
    en: 'Tesla',
  },
  nature: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22V8M12 8C12 8 8 4 4 6c-2 1 0 6 8 2M12 8c0 0 4-4 8-2 2 1 0 6-8 2" />
        <path d="M7 21h10" />
      </svg>
    ),
    zh: '自然森林',
    en: 'Nature',
  },
  rose: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    zh: '玫瑰金',
    en: 'Rose',
  },
  lavender: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7L2 9.4h7.6z" />
      </svg>
    ),
    zh: '薰衣草',
    en: 'Lavender',
  },
  sunset: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 18a5 5 0 10-10 0" />
        <line x1="12" y1="9" x2="12" y2="2" />
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
        <line x1="1" y1="18" x2="3" y2="18" />
        <line x1="21" y1="18" x2="23" y2="18" />
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
        <line x1="23" y1="22" x2="1" y2="22" />
        <polyline points="8 6 12 2 16 6" />
      </svg>
    ),
    zh: '日落暖阳',
    en: 'Sunset',
  },
}

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const { language } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const lang = language === 'zh' ? 'zh' : 'en'

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = themeMeta[theme]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-current/20 hover:border-cyan transition-colors"
        aria-label="Switch theme"
      >
        {current.icon}
        <span className="hidden sm:inline">{current[lang]}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-40 rounded-xl shadow-lg border py-1 z-50"
          style={{
            backgroundColor: 'rgb(var(--color-surface-card))',
            borderColor: 'rgb(var(--color-border))',
          }}
        >
          {themes.map((t) => {
            const meta = themeMeta[t]
            return (
              <button
                key={t}
                onClick={() => { setTheme(t); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                  t === theme ? 'font-medium' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: 'rgb(var(--color-text-body))' }}
              >
                {meta.icon}
                {meta[lang]}
                {t === theme && (
                  <svg className="w-3.5 h-3.5 ml-auto" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 12.5l-4-4 1.5-1.5 2.5 2.5 5.5-5.5 1.5 1.5z" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
