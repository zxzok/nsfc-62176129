import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n'
import { publications, categories } from '../../data/publications'
import ScrollReveal from '../shared/ScrollReveal'

const categoryColorMap = {
  'network-control': { pill: 'bg-navy/10 text-navy', tab: 'bg-navy text-white' },
  'precision-medicine': { pill: 'bg-ocean/10 text-ocean', tab: 'bg-ocean text-white' },
  'digital-phenotype': { pill: 'bg-cyan/10 text-cyan', tab: 'bg-cyan text-white' },
  clinical: { pill: 'bg-coral/10 text-coral', tab: 'bg-coral text-white' },
}

const categoryOrder = ['network-control', 'precision-medicine', 'digital-phenotype', 'clinical']

export default function FeaturedPublications() {
  const { language, t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')
  const basePath = import.meta.env.BASE_URL || '/'

  const filteredCategories = categories.filter((c) => c.id !== 'all')

  const grouped = useMemo(() => {
    const map = {}
    for (const cat of categoryOrder) {
      map[cat] = publications.filter((p) => p.category === cat)
    }
    return map
  }, [])

  const displayPubs = useMemo(() => {
    if (activeCategory === 'all') return publications
    return publications.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  return (
    <section id="featured" className="relative py-16 sm:py-24 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 mesh-gradient-2" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ocean/20 to-transparent" />

      <div className="relative section-container">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-center mb-4">
            {t('featured.heading')}
          </h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-4 text-[15px] leading-relaxed">
            {t('featured.desc')}
          </p>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-ocean to-cyan mx-auto mb-10" />
        </ScrollReveal>

        {/* Category tabs */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {language === 'zh' ? '全部' : 'All'}
              <span className="ml-1.5 text-xs opacity-70">({publications.length})</span>
            </button>
            {filteredCategories.map((cat) => {
              const count = grouped[cat.id]?.length || 0
              const colors = categoryColorMap[cat.id]
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? `${colors.tab} shadow-md`
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label[language]}
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPubs.map((pub, i) => {
            const colors = categoryColorMap[pub.category] || categoryColorMap['network-control']
            const catLabel = categories.find((c) => c.id === pub.category)?.label[language] || pub.category

            return (
              <ScrollReveal key={pub.id} delay={Math.min(i * 80, 400)}>
                <div className="card-base card-glow p-6 h-full flex flex-col group hover:-translate-y-1 transition-all duration-300">
                  {/* Category + Year + Representative badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.pill}`}>
                      {catLabel}
                    </span>
                    <span className="text-xs text-slate-400">{pub.year}</span>
                    {pub.representative && (
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-coral/10 text-coral text-xs font-medium">
                        ★
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-navy text-[15px] leading-snug mb-3 line-clamp-3 group-hover:text-ocean transition-colors">
                    {pub.title}
                  </h3>

                  {/* Journal */}
                  <p className="text-xs text-slate-400 italic mb-3">
                    {pub.journal}, {pub.year}
                  </p>

                  {/* Authors (truncated) */}
                  <p className="text-xs text-slate-500 mb-5 line-clamp-2 flex-grow">
                    {pub.authors}
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link
                      to={`/publications/${pub.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:border-ocean hover:text-ocean transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {t('featured.viewDetail')}
                    </Link>
                    {pub.explainerUrl && (
                      <a
                        href={`${basePath}${pub.explainerUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-ocean to-cyan text-white text-xs font-medium hover:shadow-md transition-all"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {t('featured.readExplainer')}
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* View publications page link */}
        <ScrollReveal delay={300}>
          <div className="text-center mt-12">
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-ocean hover:text-ocean transition-colors"
            >
              {t('featured.viewAll')}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-4-4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
