import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from '../../i18n'
import { useTheme } from '../../theme'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'

const sectionIds = ['overview', 'research', 'results', 'impact', 'timeline', 'team']

const researchLinks = [
  { path: '/research/subtyping', key: 'subtyping' },
  { path: '/research/network-control', key: 'networkControl' },
  { path: '/research/biomarkers', key: 'biomarkers' },
  { path: '/research/translation', key: 'translation' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isResearch = location.pathname.startsWith('/research/')
  const activeSection = useScrollSpy(isHome ? sectionIds : [], 80)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Academic and Tesla themes have light heroes, so navbar text should be dark even at top
  const isLightHero = theme === 'academic' || theme === 'tesla'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false) }, [location])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  const showDarkText = scrolled || isLightHero
  const textColor = showDarkText ? 'text-slate-600 hover:text-navy' : 'text-white/80 hover:text-white'
  const activeColor = showDarkText ? 'text-cyan font-medium' : 'text-cyan font-medium'

  // Nav background
  let navBg
  if (scrolled) {
    if (theme === 'dark') {
      navBg = 'backdrop-blur-md shadow-sm border-b'
      // Use inline style for dark theme bg
    } else {
      navBg = 'bg-white/90 backdrop-blur-md shadow-sm'
    }
  } else {
    navBg = 'bg-transparent'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      style={scrolled && theme === 'dark' ? {
        backgroundColor: 'rgba(var(--color-surface-card), 0.9)',
        borderColor: 'rgba(var(--color-cyan), 0.1)',
      } : undefined}
    >
      <div className="section-container flex items-center justify-between h-16">
        <Link to="/" className={`font-semibold text-sm tracking-wide ${showDarkText ? 'text-navy' : 'text-white'}`}>
          <span className="text-cyan">NSFC</span> 62176129
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isHome ? (
            sectionIds.map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeSection === id ? activeColor : textColor
                }`}
              >
                {t(`nav.${id}`)}
              </button>
            ))
          ) : (
            <Link to="/" className={`px-3 py-1.5 rounded-lg text-sm ${textColor}`}>
              {t('nav.backHome')}
            </Link>
          )}

          <span className={`mx-1 ${showDarkText ? 'text-slate-300' : 'text-white/30'}`}>|</span>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                isResearch ? activeColor : textColor
              }`}
            >
              {t('nav.researchDetail')}
              <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-xl shadow-lg py-2 z-50"
                style={{
                  backgroundColor: 'rgba(var(--color-surface-card), 0.95)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgb(var(--color-border))',
                }}
              >
                {researchLinks.map((r) => (
                  <Link
                    key={r.path}
                    to={r.path}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      location.pathname === r.path
                        ? 'text-cyan font-medium'
                        : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    {t(`nav.${r.key}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/publications" className={`px-3 py-1.5 rounded-lg text-sm ${location.pathname.startsWith('/publications') ? activeColor : textColor}`}>
            {t('nav.publications')}
          </Link>
          <Link to="/patents" className={`px-3 py-1.5 rounded-lg text-sm ${location.pathname === '/patents' ? activeColor : textColor}`}>
            {t('nav.patents')}
          </Link>

          <div className="ml-2"><ThemeSwitcher /></div>
          <div className="ml-1"><LayoutSwitcher /></div>
          <div className="ml-1"><LanguageSwitcher /></div>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg className={`w-6 h-6 ${showDarkText ? 'text-navy' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden shadow-lg"
          style={{
            backgroundColor: 'rgba(var(--color-surface-card), 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgb(var(--color-border))',
          }}
        >
          <div className="section-container py-4 flex flex-col gap-2">
            {isHome ? (
              sectionIds.map((id) => (
                <button key={id} onClick={() => scrollTo(id)} className="text-left px-3 py-2 text-sm text-slate-700 hover:text-cyan rounded-lg hover:bg-slate-50">
                  {t(`nav.${id}`)}
                </button>
              ))
            ) : (
              <Link to="/" className="px-3 py-2 text-sm text-slate-700 hover:text-cyan">{t('nav.backHome')}</Link>
            )}
            <hr style={{ borderColor: 'rgb(var(--color-border))' }} className="my-1" />
            <div className="px-3 py-1 text-xs font-medium text-slate-400 uppercase tracking-wide">{t('nav.researchDetail')}</div>
            {researchLinks.map((r) => (
              <Link key={r.path} to={r.path} className={`px-5 py-2 text-sm rounded-lg ${location.pathname === r.path ? 'text-cyan font-medium' : 'text-slate-600 hover:text-cyan'}`}>
                {t(`nav.${r.key}`)}
              </Link>
            ))}
            <hr style={{ borderColor: 'rgb(var(--color-border))' }} className="my-1" />
            <Link to="/publications" className="px-3 py-2 text-sm text-slate-700 hover:text-cyan">{t('nav.publications')}</Link>
            <Link to="/patents" className="px-3 py-2 text-sm text-slate-700 hover:text-cyan">{t('nav.patents')}</Link>
            <div className="px-3 pt-2 flex items-center gap-2">
              <ThemeSwitcher />
              <LayoutSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
