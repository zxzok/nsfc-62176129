import { useState } from 'react'
import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

export default function GlossaryPanel({ items }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''
  const [expandedIdx, setExpandedIdx] = useState(null)

  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-ocean/30" />
          <span className="text-ocean/60 text-[10px] font-medium uppercase tracking-[0.2em]">
            {language === 'zh' ? '术语' : 'Terms'}
          </span>
        </div>
        <h2 className="font-serif text-2xl text-navy mb-8">
          {language === 'zh' ? '术语小词典' : 'Glossary'}
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-0">
          {items.map((item, i) => (
            <div key={i} className={`${i > 0 ? 'border-t border-slate-100' : ''}`}>
              <button
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full text-left py-4 flex items-center justify-between gap-3 group"
              >
                <span className="text-[14px] text-navy font-medium group-hover:text-ocean transition-colors">
                  {L(item.term)}
                </span>
                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  expandedIdx === i
                    ? 'bg-ocean/10 text-ocean rotate-180'
                    : 'text-slate-300 group-hover:text-ocean/50'
                }`}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                expandedIdx === i ? 'max-h-60 pb-4' : 'max-h-0'
              }`}>
                <p className="text-[13px] text-slate-500 leading-relaxed">{L(item.definition)}</p>
                <p className="text-[12px] text-ocean/50 italic mt-2 pl-3 border-l-2 border-ocean/10">
                  {language === 'zh' ? '类比：' : 'Analogy: '}{L(item.analogy)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  )
}
