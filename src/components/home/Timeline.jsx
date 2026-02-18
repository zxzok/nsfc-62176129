import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'
import { milestones } from '../../data/milestones'

export default function Timeline({ compact = false }) {
  const { t } = useTranslation()

  if (compact) {
    return (
      <section id="timeline" className="relative py-12 bg-white overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-2" />
        <div className="relative section-container">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center mb-8">
              {t('timeline.heading')}
            </h2>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4">
            {milestones.map((milestone, mi) => {
              const color = `var(${milestone.colorVar})`
              return (
                <ScrollReveal key={milestone.year} delay={mi * 80}>
                  <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl card-base min-w-[120px]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: color }}
                    >
                      {milestone.year}
                    </div>
                    <p className="text-xs text-slate-500 text-center leading-snug max-w-[140px]">
                      {t(`timeline.${milestone.events[0].key.replace(/e\d+$/, 't')}`)}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="timeline" className="relative py-24 sm:py-32 bg-white overflow-hidden">
      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 mesh-gradient-2" />

      {/* Decorative elements */}
      <div className="absolute top-[10%] right-[8%] w-3 h-3 rounded-full bg-ocean/15 animate-float" />
      <div className="absolute bottom-[20%] left-[5%] w-2 h-2 rounded-full bg-cyan/20 animate-float-reverse" />
      <div className="absolute top-[40%] right-[3%] w-2 h-2 rounded-full bg-coral/15 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative section-container">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-center mb-5">
            {t('timeline.heading')}
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan to-ocean mx-auto mb-14" />
        </ScrollReveal>

        <div className="relative max-w-2xl mx-auto">
          {/* Animated vertical line with gradient */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px">
            <div className="w-full h-full bg-gradient-to-b from-ocean via-cyan to-ocean/30 origin-top" />
            {/* Flowing glow dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-8 rounded-full bg-cyan/40 blur-sm"
              style={{ animation: 'timeline-flow 4s ease-in-out infinite' }} />
          </div>

          {milestones.map((milestone, mi) => {
            const color = `var(${milestone.colorVar})`
            return (
              <div key={milestone.year} className="mb-12 last:mb-0">
                {/* Year marker */}
                <ScrollReveal delay={mi * 100}>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base z-10 shadow-lg group transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 rounded-full animate-glow-pulse"
                        style={{ boxShadow: `0 0 20px ${color}` }} />
                      {milestone.year}
                    </div>
                    <h3 className="text-lg font-semibold text-navy">
                      {t(`timeline.${milestone.events[0].key.replace(/e\d+$/, 't')}`)}
                    </h3>
                  </div>
                </ScrollReveal>

                {/* Events */}
                <div className="ml-14 sm:ml-20 space-y-3">
                  {milestone.events.map((event, ei) => (
                    <ScrollReveal key={event.key} delay={mi * 100 + (ei + 1) * 80}>
                      <div className="relative pl-5 group/event">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 to-transparent" />
                        <div className="absolute -left-[3px] top-2.5 w-[7px] h-[7px] rounded-full transition-all duration-300 group-hover/event:scale-150"
                          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                        <p className="text-[15px] text-slate-600 leading-[1.75] group-hover/event:text-slate-800 transition-colors">
                          {t(`timeline.${event.key}`)}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
