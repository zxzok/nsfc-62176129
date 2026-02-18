import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

export default function FindingsSection({ findings, dark = false }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''

  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-px w-8 ${dark ? 'bg-cyan/40' : 'bg-ocean/30'}`} />
          <span className={`text-xs font-medium uppercase tracking-[0.2em] ${dark ? 'text-cyan/60' : 'text-ocean/60'}`}>
            {language === 'zh' ? '核心结果' : 'Core Results'}
          </span>
        </div>
        <h2 className={`font-serif text-2xl sm:text-3xl mb-10 leading-tight ${dark ? 'text-white' : 'text-navy'}`}>
          {language === 'zh' ? '我们发现了什么' : 'What We Found'}
        </h2>
      </ScrollReveal>

      <div className="space-y-8">
        {findings.map((f, i) => (
          <ScrollReveal key={f.id} delay={i * 100}>
            <div className="group">
              <div className="flex gap-6">
                <div className="flex-shrink-0 relative">
                  <span className={`flex w-10 h-10 rounded-full items-center justify-center text-sm font-bold transition-all ${
                    dark
                      ? 'bg-white/[0.06] text-cyan/80 border border-white/[0.08] group-hover:bg-cyan/20 group-hover:text-cyan group-hover:border-cyan/30'
                      : 'bg-ocean/[0.06] text-ocean border border-ocean/10 group-hover:bg-ocean group-hover:text-white group-hover:border-ocean'
                  }`}>
                    {i + 1}
                  </span>
                  {i < findings.length - 1 && (
                    <div className={`absolute top-12 left-1/2 -translate-x-1/2 w-px h-8 ${
                      dark ? 'bg-gradient-to-b from-white/10 to-transparent' : 'bg-gradient-to-b from-slate-100 to-transparent'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`font-semibold text-base mb-2.5 leading-snug ${dark ? 'text-white/90' : 'text-navy'}`}>
                    {L(f.title)}
                  </h3>
                  <p className={`text-[14px] leading-[1.75] whitespace-pre-line mb-4 ${dark ? 'text-white/50' : 'text-slate-500'}`}>
                    {L(f.content)}
                  </p>

                  {/* Highlight callout */}
                  <div className={`rounded-xl px-5 py-4 ${
                    dark
                      ? 'bg-white/[0.04] border border-white/[0.06]'
                      : 'bg-gradient-to-r from-slate-50 to-white border border-slate-100'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-0.5 ${dark ? 'text-cyan/60' : 'text-ocean/40'}`}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                        </svg>
                      </div>
                      <p className={`text-[14px] font-medium leading-relaxed ${dark ? 'text-white/80' : 'text-navy'}`}>
                        {L(f.highlight)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
