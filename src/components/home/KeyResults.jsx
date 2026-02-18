import { useTranslation } from '../../i18n'
import { useTheme } from '../../theme'
import { Link } from 'react-router-dom'
import AnimatedCounter from '../shared/AnimatedCounter'
import ScrollReveal from '../shared/ScrollReveal'
import FloatingParticles from '../shared/FloatingParticles'

const stats = [
  { key: 'papers', value: 21, suffix: '', link: '/publications',
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { key: 'patents', value: 7, suffix: '', link: '/patents',
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
  { key: 'patients', value: 3000, suffix: '+', link: null,
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { key: 'screening', value: 200000, suffix: '+', link: null,
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
]

function DarkResults({ t }) {
  return (
    <section id="results" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-navy to-ocean animate-gradient-shift" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan/5 animate-glow-pulse" />
      <FloatingParticles count={15} />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, rgb(var(--color-cyan) / 0.4) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative section-container text-white">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-center mb-5">{t('results.heading')}</h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan to-ocean mx-auto mb-6" />
          <p className="text-center text-[15px] text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed">{t('results.introDesc')}</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((s, i) => (
            <ScrollReveal key={s.key} delay={i * 120}>
              <div className="group relative text-center p-7 rounded-2xl glass hover:bg-white/[0.08] transition-all duration-400 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4 text-cyan/70 group-hover:text-cyan group-hover:scale-110 transition-all">
                  {s.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-cyan mb-2">
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">
                  {t(`results.${s.key}`)}
                  {t(`results.${s.key}Unit`) && <span className="ml-1">{t(`results.${s.key}Unit`)}</span>}
                </div>
                {s.link && (
                  <Link to={s.link} className="inline-block mt-4 text-[13px] text-cyan/60 hover:text-cyan transition-colors">
                    {t('results.viewAll')} &rarr;
                  </Link>
                )}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <p className="text-center text-sm text-white/40 max-w-2xl mx-auto">{t('results.journalLabel')}</p>
          <p className="text-center text-xs text-white/30 mt-2">{t('results.patentNote')}</p>
        </ScrollReveal>
      </div>
    </section>
  )
}

function LightResults({ t, theme }) {
  const isTesla = theme === 'tesla'

  return (
    <section id="results" className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: isTesla ? '#000' : 'rgb(var(--color-surface-page))' }}
    >
      <div className="relative section-container">
        <ScrollReveal>
          <h2 className={`text-3xl sm:text-4xl lg:text-[2.75rem] text-center mb-5 ${isTesla ? 'text-white font-light' : 'text-navy font-bold'}`}
            style={{ fontFamily: 'var(--font-heading)' }}>
            {t('results.heading')}
          </h2>
          {!isTesla && <div className="w-16 h-1 rounded-full bg-gradient-to-r from-ocean to-cyan mx-auto mb-6" />}
          {isTesla && <div className="w-12 h-px bg-white/20 mx-auto mb-6" />}
          <p className={`text-center text-[15px] max-w-2xl mx-auto mb-14 leading-relaxed ${isTesla ? 'text-white/40' : 'text-slate-500'}`}>
            {t('results.introDesc')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map((s, i) => (
            <ScrollReveal key={s.key} delay={i * 120}>
              <div className={`group relative text-center p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                isTesla
                  ? 'border border-white/10 hover:border-white/20'
                  : 'card-base'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all ${
                  isTesla ? 'bg-white/5 text-white/50' : 'bg-ocean/5 text-ocean/60'
                }`}>
                  {s.icon}
                </div>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${
                  isTesla ? 'text-white' : 'text-gradient'
                }`}>
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className={`text-[13px] leading-relaxed ${isTesla ? 'text-white/50' : 'text-slate-500'}`}>
                  {t(`results.${s.key}`)}
                  {t(`results.${s.key}Unit`) && <span className="ml-1">{t(`results.${s.key}Unit`)}</span>}
                </div>
                {s.link && (
                  <Link to={s.link} className={`inline-block mt-4 text-[13px] transition-colors ${
                    isTesla ? 'text-white/40 hover:text-white/70' : 'text-ocean/60 hover:text-ocean'
                  }`}>
                    {t('results.viewAll')} &rarr;
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <p className={`text-center text-sm max-w-2xl mx-auto ${isTesla ? 'text-white/30' : 'text-slate-400'}`}>
            {t('results.journalLabel')}
          </p>
          <p className={`text-center text-xs mt-2 ${isTesla ? 'text-white/20' : 'text-slate-300'}`}>
            {t('results.patentNote')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default function KeyResults() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  if (theme === 'academic' || theme === 'tesla') {
    return <LightResults t={t} theme={theme} />
  }

  return <DarkResults t={t} />
}
