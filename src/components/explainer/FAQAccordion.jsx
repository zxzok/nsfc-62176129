import { useState } from 'react'
import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

export default function FAQAccordion({ items }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-ocean/30" />
          <span className="text-ocean/60 text-[10px] font-medium uppercase tracking-[0.2em]">
            Q&A
          </span>
        </div>
        <h2 className="font-serif text-2xl text-navy mb-8">
          {language === 'zh' ? '常见问题' : 'FAQ'}
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-0">
          {items.map((item, i) => (
            <div key={i} className={`${i > 0 ? 'border-t border-slate-100' : ''}`}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left py-5 flex items-start justify-between gap-4 group"
              >
                <span className="text-[14px] text-navy leading-snug group-hover:text-ocean transition-colors">
                  {L(item.question)}
                </span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  openIdx === i
                    ? 'bg-ocean/10 text-ocean rotate-180'
                    : 'bg-slate-50 text-slate-300 group-hover:bg-ocean/5 group-hover:text-ocean/50'
                }`}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                openIdx === i ? 'max-h-96 pb-5' : 'max-h-0'
              }`}>
                <p className="text-[13px] text-slate-500 leading-[1.7] whitespace-pre-line pl-0">
                  {L(item.answer)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  )
}
