import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLayout } from '../../layout'
import { useTranslation } from '../../i18n'

const layoutMeta = {
  classic: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="3" width="16" height="4" rx="1" />
        <rect x="4" y="10" width="16" height="4" rx="1" />
        <rect x="4" y="17" width="16" height="4" rx="1" />
      </svg>
    ),
    zh: '经典长页',
    en: 'Classic',
  },
  magazine: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="18" height="8" rx="1" />
      </svg>
    ),
    zh: '杂志双栏',
    en: 'Magazine',
  },
  dashboard: {
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="4" rx="1" />
        <rect x="14" y="10" width="7" height="7" rx="1" />
        <rect x="3" y="13" width="7" height="4" rx="1" />
        <rect x="3" y="20" width="18" height="1" rx="0.5" />
      </svg>
    ),
    zh: '仪表盘',
    en: 'Dashboard',
  },
}

export default function LayoutSwitcher() {
  const location = useLocation()
  const { layout, setLayout, layouts } = useLayout()
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

  if (location.pathname !== '/') return null

  const current = layoutMeta[layout]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-current/20 hover:border-cyan transition-colors"
        aria-label="Switch layout"
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
          {layouts.map((l) => {
            const meta = layoutMeta[l]
            return (
              <button
                key={l}
                onClick={() => { setLayout(l); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                  l === layout ? 'font-medium' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ color: 'rgb(var(--color-text-body))' }}
              >
                {meta.icon}
                {meta[lang]}
                {l === layout && (
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
