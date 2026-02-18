import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '../i18n'
import { publications, categories, getPublicationBySlug } from '../data/publications'
import ScrollReveal from '../components/shared/ScrollReveal'
import FloatingParticles from '../components/shared/FloatingParticles'

const categoryColorMap = {
  'network-control': {
    bg: 'from-navy to-ocean/80',
    accent: 'text-navy',
    pill: 'bg-navy/10 text-navy',
    btnBg: 'bg-navy hover:bg-navy/90',
    btnBorder: 'border-navy text-navy hover:bg-navy/5',
  },
  'precision-medicine': {
    bg: 'from-ocean/90 to-navy',
    accent: 'text-ocean',
    pill: 'bg-ocean/10 text-ocean',
    btnBg: 'bg-ocean hover:bg-ocean/90',
    btnBorder: 'border-ocean text-ocean hover:bg-ocean/5',
  },
  'digital-phenotype': {
    bg: 'from-cyan/90 to-ocean',
    accent: 'text-cyan',
    pill: 'bg-cyan/10 text-cyan',
    btnBg: 'bg-cyan hover:bg-cyan/90',
    btnBorder: 'border-cyan text-cyan hover:bg-cyan/5',
  },
  clinical: {
    bg: 'from-coral/90 to-ocean',
    accent: 'text-coral',
    pill: 'bg-coral/10 text-coral',
    btnBg: 'bg-coral hover:bg-coral/90',
    btnBorder: 'border-coral text-coral hover:bg-coral/5',
  },
}

export default function PublicationDetailPage() {
  const { slug } = useParams()
  const { language, t } = useTranslation()
  const pub = getPublicationBySlug(slug)

  if (!pub) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">
            {language === 'zh' ? '论文未找到' : 'Publication Not Found'}
          </h1>
          <Link
            to="/publications"
            className="text-ocean hover:underline"
          >
            {t('publicationDetail.backToList')}
          </Link>
        </div>
      </div>
    )
  }

  const colors = categoryColorMap[pub.category] || categoryColorMap['network-control']
  const categoryLabel = categories.find((c) => c.id === pub.category)?.label[language] || pub.category
  const abstract = t(`publicationDetail.pub${pub.id}.abstract`)
  const hasAbstract = abstract && !abstract.startsWith('publicationDetail.')
  const relatedPubs = publications.filter((p) => p.category === pub.category && p.id !== pub.id)
  const basePath = import.meta.env.BASE_URL || '/'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section
        className={`relative pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-br ${colors.bg} overflow-hidden`}
      >
        <FloatingParticles count={12} color="rgba(255,255,255,0.08)" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative section-container">
          {/* Back link */}
          <Link
            to="/publications"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {t('publicationDetail.backToList')}
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium">
              {categoryLabel}
            </span>
            {pub.representative && (
              <span className="px-3 py-1 rounded-full bg-coral/20 text-white text-xs font-medium">
                ★ {t('publicationDetail.representative')}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">
              {pub.year}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-[1.15] max-w-4xl">
            {pub.title}
          </h1>

          {/* Journal info */}
          <p className="text-white/70 italic text-[15px] sm:text-base">
            {pub.journal}
            {pub.volume ? `, ${pub.volume}` : ''}
            , {pub.year}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0 mesh-gradient-1" />
        <div className="relative section-container max-w-4xl">
          {/* Authors Card */}
          <ScrollReveal>
            <div className="card-base card-glow p-6 mb-8">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {t('publicationDetail.authorsLabel')}
              </h2>
              <p className="text-slate-700 leading-relaxed text-[15px]">{pub.authors}</p>
            </div>
          </ScrollReveal>

          {/* Abstract */}
          {hasAbstract && (
            <ScrollReveal delay={100}>
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-ocean"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  {t('publicationDetail.abstractLabel')}
                </h2>
                <p className="text-slate-600 leading-[1.8] text-base">{abstract}</p>
              </div>
            </ScrollReveal>
          )}

          {/* PDF Buttons */}
          {pub.pdf && (
            <ScrollReveal delay={200}>
              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href={`${basePath}papers/${pub.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg ${colors.btnBg} text-white text-sm font-medium transition-colors`}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {t('publicationDetail.viewPdf')}
                </a>
                <a
                  href={`${basePath}papers/${pub.pdf}`}
                  download
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border ${colors.btnBorder} text-sm font-medium transition-colors`}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {t('publicationDetail.downloadPdf')}
                </a>
                {pub.explainerUrl && (
                  <a
                    href={`${basePath}${pub.explainerUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-ocean to-cyan text-white text-sm font-medium hover:shadow-lg transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {language === 'zh' ? '阅读科普解读' : 'Read Explainer'}
                  </a>
                )}
                {pub.hasExplainer && (
                  <Link
                    to={`/publications/${pub.slug}/explainer`}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border ${colors.btnBorder} text-sm font-medium transition-colors`}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {language === 'zh' ? '详细解读' : 'Detailed Explainer'}
                  </Link>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Related Publications */}
      {relatedPubs.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="section-container max-w-4xl">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-navy mb-8">
                {t('publicationDetail.relatedPubs')}
              </h2>
            </ScrollReveal>
            <div className="space-y-4">
              {relatedPubs.map((rp, i) => (
                <ScrollReveal key={rp.id} delay={i * 60}>
                  <Link to={`/publications/${rp.slug}`} className="block">
                    <div className="card-base p-5 hover:-translate-y-0.5 transition-all duration-300">
                      <h3 className="text-sm font-medium text-navy leading-snug mb-2 hover:text-ocean transition-colors">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-1">{rp.authors}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-ocean">{rp.journal}</span>
                        {rp.volume && <span>· {rp.volume}</span>}
                        <span>· {rp.year}</span>
                        {rp.representative && (
                          <span className="ml-auto px-2 py-0.5 rounded-full bg-coral/10 text-coral text-xs font-medium">
                            ★
                          </span>
                        )}
                      </div>
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
