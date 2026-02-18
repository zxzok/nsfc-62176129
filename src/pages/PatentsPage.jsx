import { useTranslation } from '../i18n'
import { patents } from '../data/patents'
import ScrollReveal from '../components/shared/ScrollReveal'

export default function PatentsPage() {
  const { language, t } = useTranslation()

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      <div className="section-container">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{t('patentsPage.heading')}</h1>
          <p className="text-[15px] text-slate-500 mb-4">
            {t('patentsPage.total').replace('{count}', String(patents.length))}
          </p>
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-3xl mb-8">
            {t('patentsPage.introDesc')}
          </p>
        </ScrollReveal>

        <div className="space-y-4">
          {patents.map((patent, i) => (
            <ScrollReveal key={patent.id} delay={i * 80}>
              <div className="card-base p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        patent.country === 'US'
                          ? 'bg-coral/10 text-coral'
                          : 'bg-ocean/10 text-ocean'
                      }`}>
                        {patent.country === 'US' ? t('patentsPage.us') : t('patentsPage.cn')}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {t('patentsPage.invention')}
                      </span>
                    </div>
                    <h3 className="font-medium text-navy text-[15px] leading-snug mb-1.5">
                      {patent.title[language]}
                    </h3>
                    <p className="text-xs text-slate-400 mb-1">
                      {patent.inventors[language]}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {patent.number}
                    </p>
                  </div>
                  <span className="text-sm font-mono text-slate-300 flex-shrink-0">
                    {patent.year}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
