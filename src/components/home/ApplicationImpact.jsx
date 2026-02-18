import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

const panels = [
  {
    key: 'clinic',
    titleKey: 'clinicTitle',
    descKey: 'clinicDesc',
    points: ['clinicPoint1', 'clinicPoint2', 'clinicPoint3'],
    milestone: '2023',
    gradient: 'from-ocean/10 via-cyan/5 to-transparent',
    accent: 'ocean',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    decorIcon: (
      <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.06">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    key: 'school',
    titleKey: 'schoolTitle',
    descKey: 'schoolDesc',
    points: ['schoolPoint1', 'schoolPoint2', 'schoolPoint3'],
    milestone: '2024',
    gradient: 'from-cyan/10 via-ocean/5 to-transparent',
    accent: 'cyan',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    decorIcon: (
      <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.06">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
]

export default function ApplicationImpact() {
  const { t } = useTranslation()

  return (
    <section id="impact" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-1" />

      {/* Decorative floating shapes */}
      <div className="absolute top-[15%] right-[5%] w-40 h-40 rounded-full bg-ocean/5 animate-float" />
      <div className="absolute bottom-[10%] left-[3%] w-28 h-28 rounded-full bg-cyan/5 animate-float-reverse" />

      {/* Subtle connecting line between panels */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-dashed border-cyan/10 animate-spin-slow opacity-50" />

      <div className="relative section-container">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-center mb-5">
            {t('impact.heading')}
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-ocean to-cyan mx-auto mb-14" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {panels.map((panel, i) => (
            <ScrollReveal key={panel.key} delay={i * 150}>
              <div className={`relative card-base card-glow p-8 h-full bg-gradient-to-br ${panel.gradient} group hover:-translate-y-1 transition-all duration-300`}>
                {/* Large decorative icon */}
                <div className="absolute top-4 right-4 text-navy">
                  {panel.decorIcon}
                </div>

                {/* Milestone badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-${panel.accent}/10 text-${panel.accent}`}>
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="6" cy="6" r="5" />
                    <path d="M6 3v3l2 1" />
                  </svg>
                  {panel.milestone}
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-${panel.accent}/10 flex items-center justify-center text-${panel.accent} group-hover:scale-110 transition-transform`}>
                    {panel.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-navy">
                    {t(`impact.${panel.titleKey}`)}
                  </h3>
                </div>

                <p className="text-[15px] text-slate-600 leading-[1.75] mb-6">
                  {t(`impact.${panel.descKey}`)}
                </p>

                {/* Points with animated check marks */}
                <ul className="space-y-3">
                  {panel.points.map((k) => {
                    const val = t(`impact.${k}`)
                    if (!val || val.startsWith('impact.')) return null
                    return (
                      <li key={k} className="flex items-start gap-3 text-[15px] text-slate-600 group/item">
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-${panel.accent}/10 flex items-center justify-center mt-0.5`}>
                          <svg className={`w-3 h-3 text-${panel.accent}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        </span>
                        <span className="group-hover/item:text-slate-800 transition-colors">
                          {val}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {/* Bottom accent bar */}
                <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-${panel.accent} opacity-0 group-hover:opacity-30 transition-opacity rounded-full`} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
