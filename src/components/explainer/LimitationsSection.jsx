import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

export default function LimitationsSection({ data }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''

  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-slate-300/50" />
          <span className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
            {language === 'zh' ? '研究局限' : 'Caveats'}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-navy mb-10 leading-tight">{L(data.title)}</h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <ol className="space-y-5">
          {data.items.map((item, i) => (
            <li key={i} className="flex items-start gap-5 group">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white border-2 border-slate-150 text-slate-400 flex items-center justify-center text-xs font-bold group-hover:border-slate-300 group-hover:text-slate-500 transition-colors">
                {i + 1}
              </span>
              <p className="text-[14px] text-slate-500 leading-[1.75] pt-0.5">{L(item)}</p>
            </li>
          ))}
        </ol>
      </ScrollReveal>
    </div>
  )
}
