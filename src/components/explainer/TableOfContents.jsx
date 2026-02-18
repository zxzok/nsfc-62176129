import { useState, useEffect } from 'react'
import { useTranslation } from '../../i18n'

export default function TableOfContents({ sections, mobile = false }) {
  const { language } = useTranslation()
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  const handleClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (mobile) {
    return (
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
        <div className="flex gap-1.5 pb-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleClick(s.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-all ${
                activeId === s.id
                  ? 'bg-navy text-white'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s[language] || s.zh}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Desktop: dot-nav with connecting line
  return (
    <nav className="flex flex-col items-center">
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200/50" />

        <ul className="relative space-y-5">
          {sections.map((s) => {
            const isActive = activeId === s.id
            return (
              <li key={s.id} className="relative">
                <button
                  onClick={() => handleClick(s.id)}
                  className="group flex items-center gap-3"
                  title={s[language] || s.zh}
                >
                  {/* Dot */}
                  <span className={`relative z-10 block rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-3 h-3 bg-ocean shadow-sm shadow-ocean/30'
                      : 'w-2 h-2 bg-slate-300 group-hover:bg-ocean/50 group-hover:scale-125'
                  }`} />

                  {/* Label — appears on hover or active */}
                  <span className={`text-[11px] whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'opacity-100 translate-x-0 text-navy font-medium'
                      : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400'
                  }`}>
                    {s[language] || s.zh}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
