import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n'
import { publications, categories } from '../../data/publications'
import ScrollReveal from '../shared/ScrollReveal'

const categoryColorMap = {
  'network-control': { pill: 'bg-navy/10 text-navy', accent: 'text-navy', border: 'border-navy/20', tab: 'bg-navy text-white' },
  'precision-medicine': { pill: 'bg-ocean/10 text-ocean', accent: 'text-ocean', border: 'border-ocean/20', tab: 'bg-ocean text-white' },
  'digital-phenotype': { pill: 'bg-cyan/10 text-cyan', accent: 'text-cyan', border: 'border-cyan/20', tab: 'bg-cyan text-white' },
  clinical: { pill: 'bg-coral/10 text-coral', accent: 'text-coral', border: 'border-coral/20', tab: 'bg-coral text-white' },
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

  const filtered = useMemo(() => {
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

        {/* Publications display */}
        {activeCategory === 'all' ? (
          /* Grouped view: show by category sections */
          <div className="space-y-12">
            {categoryOrder.map((catId) => {
              const catPubs = grouped[catId]
              if (!catPubs || catPubs.length === 0) return null
              const catLabel = categories.find((c) => c.id === catId)?.label[language] || catId
              const colors = categoryColorMap[catId]

              return (
                <div key={catId}>
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.pill}`}>
                        {catLabel}
                      </span>
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-sm text-slate-400">
                        {catPubs.length} {language === 'zh' ? '篇' : catPubs.length > 1 ? 'papers' : 'paper'}
                      </span>
                    </div>
                  </ScrollReveal>

                  <div className="space-y-3">
                    {catPubs.map((pub, i) => (
                      <PubCard key={pub.id} pub={pub} language={language} t={t} basePath={basePath} delay={i * 60} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Filtered view: show papers in selected category */
          <div className="space-y-3">
            {filtered.map((pub, i) => (
              <PubCard key={pub.id} pub={pub} language={language} t={t} basePath={basePath} delay={i * 60} />
            ))}
          </div>
        )}

        {/* View detailed publications page link */}
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

function PubCard({ pub, language, t, basePath, delay }) {
  const colors = categoryColorMap[pub.category] || categoryColorMap['network-control']
  const catLabel = categories.find((c) => c.id === pub.category)?.label[language] || pub.category

  return (
    <ScrollReveal delay={Math.min(delay, 300)}>
      <div className={`card-base p-5 group hover:-translate-y-0.5 transition-all duration-300 ${
        pub.representative ? 'border-l-4 border-ocean shadow-sm' : ''
      }`}>
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Tags row */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {pub.representative && (
                <span className="px-2 py-0.5 rounded-full bg-coral/10 text-coral text-xs font-medium">
                  ★ {t('featured.representative')}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.pill}`}>
                {catLabel}
              </span>
              <span className="text-xs text-slate-400">{pub.year}</span>
            </div>

            {/* Title */}
            <Link
              to={`/publications/${pub.slug}`}
              className="font-semibold text-navy text-[15px] leading-snug mb-2 block hover:text-ocean transition-colors line-clamp-2"
            >
              {pub.title}
            </Link>

            {/* Authors */}
            <p className="text-xs text-slate-500 mb-1.5 line-clamp-1">
              {pub.authors}
            </p>

            {/* Journal info */}
            <p className="text-xs text-slate-400">
              <span className="italic font-medium">{pub.journal}</span>
              {pub.volume && <span>, {pub.volume}</span>}
              <span>, {pub.year}</span>
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Link
                to={`/publications/${pub.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:border-ocean hover:text-ocean transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-ocean to-cyan text-white text-xs font-medium hover:shadow-md transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {t('featured.readExplainer')}
                </a>
              )}
            </div>
          </div>

          {/* Paper number */}
          <span className="text-sm font-mono text-slate-300 flex-shrink-0">
            #{pub.id}
          </span>
        </div>
      </div>
    </ScrollReveal>
  )
}
