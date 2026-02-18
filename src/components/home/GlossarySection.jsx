import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

const terms = [
  { key: 'term1', accent: 'ocean', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )},
  { key: 'term2', accent: 'cyan', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  )},
  { key: 'term3', accent: 'coral', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )},
  { key: 'term4', accent: 'navy', icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="5" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
      <line x1="12" y1="7" x2="5" y2="10" /><line x1="12" y1="7" x2="19" y2="10" />
      <line x1="5" y1="14" x2="12" y2="19" /><line x1="19" y1="14" x2="12" y2="19" />
    </svg>
  )},
]

export default function GlossarySection() {
  const { t } = useTranslation()

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 mesh-gradient-2" />
      <div className="absolute bottom-[10%] right-[5%] w-24 h-24 rounded-full bg-cyan/5 animate-float" />

      <div className="relative section-container">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-center mb-5">
            {t('glossary.heading')}
          </h2>
          <p className="text-slate-500 text-center text-[15px] max-w-xl mx-auto mb-14">
            {t('glossary.intro')}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {terms.map((term, i) => (
            <ScrollReveal key={term.key} delay={i * 100}>
              <div className="card-base card-glow p-6 h-full group hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-9 h-9 rounded-xl bg-${term.accent}/10 flex items-center justify-center text-${term.accent} mb-3 group-hover:scale-110 transition-transform`}>
                  {term.icon}
                </div>
                <h3 className="font-semibold text-navy mb-3">
                  {t(`glossary.${term.key}Title`)}
                </h3>
                <p className="text-[15px] text-slate-600 leading-[1.75]">
                  {t(`glossary.${term.key}Desc`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
