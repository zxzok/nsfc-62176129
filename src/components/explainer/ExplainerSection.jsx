import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

export default function ExplainerSection({ title, items, sectionColor = 'ocean' }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''

  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-ocean/30" />
          <span className="text-ocean/60 text-xs font-medium uppercase tracking-[0.2em]">
            {language === 'zh' ? '研究背景' : 'Background'}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-navy mb-10 leading-tight">{title}</h2>
      </ScrollReveal>

      <div className="space-y-0">
        {items.map((item, i) => (
          <ScrollReveal key={i} delay={i * 60}>
            <div className={`flex gap-6 group py-6 ${i < items.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex-shrink-0 pt-0.5">
                <span className="flex w-8 h-8 rounded-full bg-white border-2 border-ocean/15 text-ocean items-center justify-center text-xs font-bold group-hover:bg-ocean group-hover:text-white group-hover:border-ocean transition-all">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy mb-1.5 text-[14px] leading-snug">
                  {L(item.subtitle)}
                </h3>
                <p className="text-[14px] text-slate-500 leading-[1.75]">
                  {L(item.content)}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
