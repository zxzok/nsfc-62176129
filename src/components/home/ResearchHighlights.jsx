import { Link } from 'react-router-dom'
import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'

const cardRoutes = {
  card1: '/research/subtyping',
  card2: '/research/network-control',
  card3: '/research/biomarkers',
  card4: '/research/translation',
}

/* ── Inline SVG illustrations ── */

function BrainSubtypingSVG() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Brain outline */}
      <path d="M60 8C35 8 18 25 18 45c0 15 10 25 22 28 4 1 8 1 12 0h16c4 1 8 1 12 0 12-3 22-13 22-28C102 25 85 8 60 8z" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Subtype regions */}
      <ellipse cx="45" cy="35" rx="14" ry="12" fill="rgb(var(--color-ocean))" opacity="0.15" />
      <ellipse cx="75" cy="35" rx="14" ry="12" fill="rgb(var(--color-coral))" opacity="0.15" />
      <ellipse cx="60" cy="52" rx="12" ry="10" fill="rgb(var(--color-cyan))" opacity="0.15" />
      {/* Division lines */}
      <path d="M60 20v40M42 45h36" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.2" />
      {/* Labels */}
      <circle cx="45" cy="35" r="2" fill="rgb(var(--color-ocean))" opacity="0.6" />
      <circle cx="75" cy="35" r="2" fill="rgb(var(--color-coral))" opacity="0.6" />
      <circle cx="60" cy="52" r="2" fill="rgb(var(--color-cyan))" opacity="0.6" />
    </svg>
  )
}

function NetworkHubSVG() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Edges */}
      <line x1="60" y1="40" x2="30" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="60" y1="40" x2="90" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="60" y1="40" x2="25" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="60" y1="40" x2="95" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="60" y1="40" x2="45" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="60" y1="40" x2="75" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="30" y1="20" x2="25" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <line x1="90" y1="20" x2="95" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      {/* Peripheral nodes */}
      {[[30,20],[90,20],[25,55],[95,55],[45,70],[75,70]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="currentColor" opacity="0.12" />
      ))}
      {/* Hub node (highlighted) */}
      <circle cx="60" cy="40" r="8" fill="rgb(var(--color-navy))" opacity="0.15" />
      <circle cx="60" cy="40" r="5" fill="rgb(var(--color-navy))" opacity="0.3" />
      {/* Pulse ring */}
      <circle cx="60" cy="40" r="12" stroke="rgb(var(--color-navy))" strokeWidth="0.8" opacity="0.1" />
    </svg>
  )
}

function MultimodalSignalSVG() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Sound wave */}
      <path d="M10 25c5-8 10 8 15 0s10 8 15 0s10 8 15 0" stroke="rgb(var(--color-cyan))" strokeWidth="1.5" opacity="0.3" />
      {/* Face outline */}
      <circle cx="85" cy="25" r="12" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="81" cy="23" r="1.5" fill="currentColor" opacity="0.2" />
      <circle cx="89" cy="23" r="1.5" fill="currentColor" opacity="0.2" />
      <path d="M81 29c2 2 6 2 8 0" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      {/* Wearable / wristband icon */}
      <rect x="35" y="48" width="22" height="14" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M39 55h4l2-4 3 8 2-4h4" stroke="rgb(var(--color-ocean))" strokeWidth="1" opacity="0.4" />
      {/* Connecting dots */}
      <circle cx="70" cy="55" r="1.5" fill="currentColor" opacity="0.15" />
      <path d="M57 55h13M70 55l15-30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.12" />
    </svg>
  )
}

function ClinicalLoopSVG() {
  return (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* Hospital icon */}
      <rect x="12" y="25" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M22 28v6M19 31h6" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
      {/* Arrow to data */}
      <path d="M34 34h16" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <path d="M48 31l4 3-4 3" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      {/* Data / processing icon */}
      <rect x="52" y="27" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M55 31h10M55 35h7" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      {/* Arrow to feedback */}
      <path d="M70 34h16" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <path d="M84 31l4 3-4 3" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      {/* Feedback icon */}
      <circle cx="98" cy="34" r="10" stroke="rgb(var(--color-coral))" strokeWidth="1" opacity="0.2" />
      <path d="M94 34l3 3 6-6" stroke="rgb(var(--color-coral))" strokeWidth="1.2" opacity="0.3" />
      {/* Feedback loop arrow back */}
      <path d="M98 46c0 12-30 16-60 12" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.12" />
      <path d="M40 57l-3 1 0-3" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
    </svg>
  )
}

const cards = [
  { key: 'card1', hasStat: true, iconBg: 'bg-ocean/10', iconColor: 'text-ocean',
    illustration: BrainSubtypingSVG,
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { key: 'card2', hasStat: false, iconBg: 'bg-navy/10', iconColor: 'text-navy',
    illustration: NetworkHubSVG,
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><line x1="8" y1="11" x2="16" y2="13"/><circle cx="18" cy="6" r="2"/><line x1="10" y1="7" x2="16" y2="6"/></svg> },
  { key: 'card3', hasStat: true, iconBg: 'bg-cyan/10', iconColor: 'text-cyan',
    illustration: MultimodalSignalSVG,
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/></svg> },
  { key: 'card4', hasStat: false, iconBg: 'bg-coral/10', iconColor: 'text-coral',
    illustration: ClinicalLoopSVG,
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
]

export default function ResearchHighlights() {
  const { t } = useTranslation()

  return (
    <section id="research" className="relative py-16 sm:py-24 bg-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 mesh-gradient-2" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      {/* Floating dots */}
      <div className="absolute top-[20%] left-[5%] w-2 h-2 rounded-full bg-cyan/20 animate-float" />
      <div className="absolute top-[60%] right-[8%] w-3 h-3 rounded-full bg-ocean/15 animate-float-reverse" />
      <div className="absolute bottom-[15%] left-[12%] w-2 h-2 rounded-full bg-coral/20 animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative section-container">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-center mb-5">
            {t('research.heading')}
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan to-ocean mx-auto mb-14" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const Illustration = card.illustration
            return (
              <ScrollReveal key={card.key} delay={i * 100}>
                <div className="card-base card-glow p-8 h-full group hover:-translate-y-1 transition-all duration-300">
                  {/* SVG Illustration */}
                  <div className="h-20 mb-5 text-slate-400">
                    <Illustration />
                  </div>
                  {/* Icon + Title row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform`}>
                      {card.icon}
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-navy">
                      {t(`research.${card.key}Title`)}
                    </h3>
                  </div>
                  <p className="text-[15px] text-slate-600 leading-[1.75] mb-5">
                    {t(`research.${card.key}Desc`)}
                  </p>
                  {card.hasStat && (
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                      <span className="font-mono text-3xl font-bold text-gradient">
                        {t(`research.${card.key}Stat`)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t(`research.${card.key}StatLabel`)}
                      </span>
                    </div>
                  )}
                  {/* Learn more link */}
                  <Link
                    to={cardRoutes[card.key]}
                    className={`inline-flex items-center gap-1 mt-4 text-sm font-medium ${
                      card.iconColor
                    } hover:underline transition-colors`}
                  >
                    {t(`research.${card.key}LearnMore`)}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-4-4l4 4-4 4" />
                    </svg>
                  </Link>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
