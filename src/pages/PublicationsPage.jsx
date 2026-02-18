import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n'
import { publications, categories } from '../data/publications'
import ScrollReveal from '../components/shared/ScrollReveal'

export default function PublicationsPage() {
  const { language, t } = useTranslation()
  const basePath = import.meta.env.BASE_URL || '/'
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeYear, setActiveYear] = useState('all')
  const [search, setSearch] = useState('')

  const years = useMemo(() => {
    const set = new Set(publications.map((p) => p.year))
    return ['all', ...Array.from(set).sort((a, b) => b - a)]
  }, [])

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false
      if (activeYear !== 'all' && p.year !== Number(activeYear)) return false
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [activeCategory, activeYear, search])

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50">
      <div className="section-container">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">{t('publications.heading')}</h1>
          <p className="text-[15px] text-slate-500 mb-4">
            {t('publications.total').replace('{count}', String(publications.length))}
          </p>
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-3xl mb-8">
            {t('publications.introDesc')}
          </p>
        </ScrollReveal>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-ocean text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label[language]}
              </button>
            ))}
          </div>

          {/* Year + Search */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(String(y))}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    String(activeYear) === String(y)
                      ? 'bg-navy text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {y === 'all' ? (language === 'zh' ? '全部年份' : 'All Years') : y}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('publications.search')}
              className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-ocean"
            />
          </div>
        </div>

        {/* Publication list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-12">{t('publications.noResults')}</p>
          ) : (
            filtered.map((pub, i) => (
              <ScrollReveal key={pub.id} delay={Math.min(i * 50, 300)}>
                <div className={`card-base p-5 ${pub.representative ? 'border-l-4 border-ocean' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {pub.representative && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-ocean/10 text-ocean font-medium">
                            {t('publications.representative')}
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {categories.find((c) => c.id === pub.category)?.label[language] || pub.category}
                        </span>
                        {pub.explainerUrl && (
                          <a
                            href={`${basePath}${pub.explainerUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-0.5 rounded-full bg-cyan/10 text-cyan font-medium hover:bg-cyan/20 transition-colors"
                          >
                            {language === 'zh' ? '科普解读' : 'Explainer'}
                          </a>
                        )}
                      </div>
                      <Link to={`/publications/${pub.slug}`} className="font-medium text-navy text-[15px] leading-snug mb-1.5 block hover:text-ocean transition-colors">
                        {pub.title}
                      </Link>
                      <p className="text-xs text-slate-400 mb-1">{pub.authors}</p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium italic">{pub.journal}</span>
                        {pub.volume && <span>, {pub.volume}</span>}
                        <span>, {pub.year}</span>
                      </p>
                    </div>
                    <span className="text-sm font-mono text-slate-300 flex-shrink-0">
                      #{pub.id}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
