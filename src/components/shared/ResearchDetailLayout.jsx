import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n'
import ScrollReveal from './ScrollReveal'
import FloatingParticles from './FloatingParticles'
import { publications } from '../../data/publications'

const colorMap = {
  ocean: { bg: 'from-ocean/90 to-navy', accent: 'text-ocean', pill: 'bg-ocean/10 text-ocean' },
  navy: { bg: 'from-navy to-ocean/80', accent: 'text-navy', pill: 'bg-navy/10 text-navy' },
  cyan: { bg: 'from-cyan/90 to-ocean', accent: 'text-cyan', pill: 'bg-cyan/10 text-cyan' },
  coral: { bg: 'from-coral/90 to-ocean', accent: 'text-coral', pill: 'bg-coral/10 text-coral' },
}

export default function ResearchDetailLayout({ topicKey, accentColor = 'ocean', relatedCategory, icon }) {
  const { t } = useTranslation()
  const colors = colorMap[accentColor] || colorMap.ocean
  const prefix = `researchDetail.${topicKey}`

  const relatedPubs = relatedCategory
    ? publications.filter((p) => p.category === relatedCategory)
    : []

  const sections = ['section1', 'section2', 'section3'].map((s) => ({
    title: t(`${prefix}.${s}Title`),
    content: t(`${prefix}.${s}Content`),
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className={`relative pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-br ${colors.bg} overflow-hidden`}>
        <FloatingParticles count={12} color="rgba(255,255,255,0.08)" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative section-container">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {t('researchDetail.backToHome')}
          </Link>

          {icon && (
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-5">
              {icon}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.15]">
            {t(`${prefix}.title`)}
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
            {t(`${prefix}.subtitle`)}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 mesh-gradient-1" />
        <div className="relative section-container max-w-4xl">
          {/* Intro */}
          <ScrollReveal>
            <p className="text-slate-600 leading-[1.8] text-lg mb-12">
              {t(`${prefix}.intro`)}
            </p>
          </ScrollReveal>

          {/* Content Sections */}
          {sections.map((s, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="mb-10 last:mb-0">
                <h2 className={`text-xl font-semibold text-navy mb-4 flex items-center gap-2`}>
                  <span className={`w-7 h-7 rounded-lg ${colors.pill} flex items-center justify-center text-xs font-bold`}>
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                <p className="text-[15px] text-slate-600 leading-[1.8] pl-9">
                  {s.content}
                </p>
              </div>
            </ScrollReveal>
          ))}

          {/* Key Finding Card */}
          <ScrollReveal delay={300}>
            <div className="mt-12 card-base card-glow p-8 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-shrink-0 text-center">
                  <div className={`text-4xl font-bold ${colors.accent}`}>
                    {t(`${prefix}.stat`)}
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1">
                    {t(`${prefix}.statLabel`)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[15px] text-slate-600 leading-relaxed italic">
                    {t(`${prefix}.keyFinding`)}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Publications */}
      {relatedPubs.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="section-container max-w-4xl">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-navy mb-8">
                {t('researchDetail.relatedPapers')}
              </h2>
            </ScrollReveal>
            <div className="space-y-4">
              {relatedPubs.map((pub, i) => (
                <ScrollReveal key={pub.id} delay={i * 60}>
                  <Link to={`/publications/${pub.slug}`} className="block card-base p-5 hover:-translate-y-0.5 transition-all duration-300">
                    <h3 className="text-sm font-medium text-navy leading-snug mb-2 hover:text-ocean transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-1">{pub.authors}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-ocean">{pub.journal}</span>
                      {pub.volume && <span>· {pub.volume}</span>}
                      <span>· {pub.year}</span>
                      {pub.representative && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-coral/10 text-coral text-xs font-medium">
                          ★
                        </span>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
