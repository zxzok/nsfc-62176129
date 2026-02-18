import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n'

export default function ExplainerHero({ data, publication }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''

  return (
    <section className="relative min-h-[80vh] flex items-end bg-navy overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-ocean/30" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Abstract neural network decoration */}
        <svg className="absolute top-10 right-0 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] opacity-[0.04]" viewBox="0 0 700 700" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="520" cy="140" r="90" className="text-cyan" />
          <circle cx="340" cy="300" r="140" className="text-ocean-light" />
          <circle cx="580" cy="380" r="50" className="text-cyan" />
          <circle cx="200" cy="120" r="70" className="text-ocean" />
          <circle cx="150" cy="400" r="100" className="text-cyan" />
          <line x1="520" y1="140" x2="340" y2="300" className="text-cyan" />
          <line x1="340" y1="300" x2="580" y2="380" className="text-cyan" />
          <line x1="200" y1="120" x2="340" y2="300" className="text-cyan" />
          <line x1="200" y1="120" x2="520" y2="140" className="text-cyan" />
          <line x1="150" y1="400" x2="340" y2="300" className="text-cyan" />
          <circle cx="520" cy="140" r="4" fill="currentColor" className="text-cyan" opacity="0.6" />
          <circle cx="340" cy="300" r="4" fill="currentColor" className="text-cyan" opacity="0.6" />
          <circle cx="580" cy="380" r="4" fill="currentColor" className="text-cyan" opacity="0.6" />
          <circle cx="200" cy="120" r="4" fill="currentColor" className="text-cyan" opacity="0.6" />
          <circle cx="150" cy="400" r="4" fill="currentColor" className="text-cyan" opacity="0.6" />
        </svg>

        {/* Glow accents */}
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-ocean/[0.06] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 left-[10%] w-[400px] h-[400px] bg-cyan/[0.04] rounded-full blur-[160px]" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-5xl mx-auto px-8 sm:px-12 lg:px-16 pb-16 sm:pb-24 pt-32">
        <Link
          to={`/publications/${publication.slug}`}
          className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm mb-16 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {language === 'zh' ? '返回论文详情' : 'Back to Paper'}
        </Link>

        {/* Label with line accent */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-cyan/40" />
          <span className="text-cyan/60 text-xs font-medium uppercase tracking-[0.3em]">
            {language === 'zh' ? '科普解读' : 'Science Explainer'}
          </span>
        </div>

        {/* Title — editorial serif */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] text-white mb-6 leading-[1.12] max-w-4xl">
          {L(data.sections.hero.title)}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/40 max-w-2xl mb-12 leading-relaxed font-light">
          {L(data.sections.hero.subtitle)}
        </p>

        {/* Takeaway quote with gradient accent line */}
        <div className="max-w-2xl relative">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan/60 to-cyan/0" />
          <p className="pl-6 text-white/60 text-base sm:text-lg leading-relaxed italic">
            {L(data.sections.hero.takeaway)}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-white/20 text-xs mt-12 font-mono">
          <span>{data.meta.paperReference}</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>DOI: {data.meta.doi}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
      </div>
    </section>
  )
}
