import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

export default function SoWhatSection({ data }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''

  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-ocean/30" />
          <span className="text-ocean/60 text-xs font-medium uppercase tracking-[0.2em]">
            {language === 'zh' ? '实际意义' : 'Implications'}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-navy mb-10 leading-tight">
          {L(data.title)}
        </h2>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Evidence-based column */}
        <ScrollReveal>
          <div className="h-full rounded-2xl border border-ocean/10 bg-gradient-to-br from-ocean/[0.02] to-transparent p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-full bg-ocean/[0.08] text-ocean flex items-center justify-center">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="font-semibold text-navy text-[15px]">{L(data.evidence.title)}</h3>
            </div>
            <ul className="space-y-4">
              {data.evidence.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-slate-600 leading-[1.7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocean/40 mt-2.5 flex-shrink-0" />
                  {L(item)}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Speculative column */}
        <ScrollReveal delay={100}>
          <div className="h-full rounded-2xl border border-coral/10 bg-gradient-to-br from-coral/[0.02] to-transparent p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-9 rounded-full bg-coral/[0.08] text-coral flex items-center justify-center">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="font-semibold text-navy text-[15px]">{L(data.speculative.title)}</h3>
            </div>
            <ul className="space-y-4">
              {data.speculative.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-slate-600 leading-[1.7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral/40 mt-2.5 flex-shrink-0" />
                  {L(item)}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
