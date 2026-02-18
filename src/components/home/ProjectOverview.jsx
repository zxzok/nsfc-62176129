import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

const pillars = [
  {
    key: 'pillar1',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="5" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
        <circle cx="8" cy="19" r="2" /><circle cx="16" cy="19" r="2" />
        <line x1="12" y1="7" x2="5" y2="10" /><line x1="12" y1="7" x2="19" y2="10" />
        <line x1="5" y1="14" x2="8" y2="17" /><line x1="19" y1="14" x2="16" y2="17" />
        <line x1="8" y1="19" x2="16" y2="19" />
      </svg>
    ),
    gradient: 'from-ocean/10 to-cyan/5',
    accent: 'bg-ocean',
    iconColor: 'text-ocean',
  },
  {
    key: 'pillar2',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    gradient: 'from-cyan/10 to-emerald-100/30',
    accent: 'bg-cyan',
    iconColor: 'text-cyan',
  },
  {
    key: 'pillar3',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    gradient: 'from-coral/10 to-orange-100/30',
    accent: 'bg-coral',
    iconColor: 'text-coral',
  },
]

export default function ProjectOverview({ compact = false }) {
  const { t } = useTranslation()

  if (compact) {
    return (
      <section id="overview" className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-1" />
        <div className="relative section-container">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center mb-3">
              {t('overview.heading')}
            </h2>
            <p className="text-base text-ocean font-medium text-center mb-8 max-w-2xl mx-auto">
              {t('overview.question')}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.key} delay={i * 100}>
                <div className={`card-base card-glow p-5 bg-gradient-to-br ${p.gradient} group`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${p.accent}/10 flex items-center justify-center flex-shrink-0`}>
                      <div className={p.iconColor}>{p.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-navy mb-1">
                        {t(`overview.${p.key}Title`)}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {t(`overview.${p.key}Desc`)}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="overview" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-1" />
      {/* Decorative floating shapes */}
      <div className="absolute top-20 right-[10%] w-32 h-32 rounded-full bg-cyan/5 animate-float" />
      <div className="absolute bottom-16 left-[8%] w-24 h-24 rounded-full bg-ocean/5 animate-float-reverse" />
      {/* Spinning ring decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] rounded-full border border-slate-200/30 animate-spin-slow opacity-30" />

      <div className="relative section-container">
        {/* Section Header */}
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-center mb-5">
            {t('overview.heading')}
          </h2>
          <p className="text-lg sm:text-xl text-ocean font-medium text-center mb-6 max-w-2xl mx-auto">
            {t('overview.question')}
          </p>
        </ScrollReveal>

        {/* Lead-in text */}
        <ScrollReveal delay={80}>
          <p className="text-[15px] text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-4">
            {t('overview.leadIn')}
          </p>
        </ScrollReveal>

        {/* Main Description Block */}
        <ScrollReveal delay={100}>
          <div className="max-w-4xl mx-auto mb-10">
            <p className="text-[15px] text-slate-600 text-center leading-relaxed">
              {t('overview.desc')}
            </p>
          </div>
        </ScrollReveal>

        {/* Detailed Background */}
        <ScrollReveal delay={150}>
          <div className="card-base card-glow p-8 sm:p-10 max-w-4xl mx-auto mb-12 bg-gradient-to-br from-ocean/[0.03] to-transparent">
            <h3 className="font-semibold text-lg text-navy mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-ocean" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {t('overview.bgTitle')}
            </h3>
            <p className="text-[15px] text-slate-600 leading-[1.75] mb-4">
              {t('overview.bgPara1')}
            </p>
            <p className="text-[15px] text-slate-600 leading-[1.75]">
              {t('overview.bgPara2')}
            </p>
          </div>
        </ScrollReveal>

        {/* Research Objectives */}
        <ScrollReveal delay={200}>
          <div className="card-base card-glow p-8 sm:p-10 max-w-4xl mx-auto mb-12 bg-gradient-to-br from-cyan/[0.03] to-transparent">
            <h3 className="font-semibold text-lg text-navy mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              {t('overview.objTitle')}
            </h3>
            <div className="space-y-4">
              {['obj1', 'obj2', 'obj3'].map((k, i) => (
                <div key={k} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-ocean/10 to-cyan/10 flex items-center justify-center text-xs font-bold text-ocean mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[15px] text-slate-600 leading-[1.75]">
                    {t(`overview.${k}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Technical Approach */}
        <ScrollReveal delay={250}>
          <div className="card-base card-glow p-8 sm:p-10 max-w-4xl mx-auto mb-14 bg-gradient-to-br from-coral/[0.03] to-transparent">
            <h3 className="font-semibold text-lg text-navy mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-coral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              {t('overview.approachTitle')}
            </h3>
            <p className="text-[15px] text-slate-600 leading-[1.75] mb-5">
              {t('overview.approachDesc')}
            </p>
            {/* Pipeline Steps - card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {['step1', 'step2', 'step3', 'step4', 'step5'].map((k, i) => (
                <div key={k} className="relative group">
                  <div className="bg-white/80 rounded-xl border border-slate-100 p-4 h-full hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-ocean/20 to-cyan/20 flex items-center justify-center text-xs font-bold text-ocean">
                        {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-navy">{t(`overview.${k}`)}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t(`overview.${k}Desc`)}
                    </p>
                  </div>
                  {/* Arrow connector (hidden on last item and on mobile) */}
                  {i < 4 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-4-4l4 4-4 4" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Three Pillars */}
        <ScrollReveal delay={100}>
          <h3 className="text-xl font-semibold text-navy text-center mb-8">
            {t('overview.pillarsHeading')}
          </h3>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.key} delay={i * 150}>
              <div className={`relative card-base card-glow p-7 h-full bg-gradient-to-br ${p.gradient} group hover:-translate-y-1`}>
                {/* Accent dot */}
                <div className={`w-10 h-10 rounded-xl ${p.accent}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={p.iconColor}>{p.icon}</div>
                </div>
                <h3 className="font-semibold text-lg text-navy mb-3">
                  {t(`overview.${p.key}Title`)}
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
                  {t(`overview.${p.key}Desc`)}
                </p>
                {/* Detail points */}
                <ul className="space-y-2">
                  {['d1', 'd2', 'd3'].map((d) => {
                    const val = t(`overview.${p.key}${d.charAt(0).toUpperCase() + d.slice(1)}`)
                    if (!val || val.startsWith('overview.')) return null
                    return (
                      <li key={d} className="flex items-start gap-2 text-[13px] text-slate-500 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                        <span>{val}</span>
                      </li>
                    )
                  })}
                </ul>
                {/* Bottom accent bar */}
                <div className={`absolute bottom-0 left-6 right-6 h-0.5 ${p.accent} opacity-0 group-hover:opacity-30 transition-opacity rounded-full`} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
