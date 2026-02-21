import { useTranslation } from '../../i18n'
import { useTheme } from '../../theme'
import ScrollReveal from '../shared/ScrollReveal'
import FloatingParticles from '../shared/FloatingParticles'

function PICard({ t, variant }) {
  const isDark = variant === 'dark'
  const isTesla = variant === 'tesla'

  const subTextClass = isDark ? 'text-white/50' : isTesla ? 'text-white/40' : 'text-slate-500'
  const linkClass = isDark ? 'text-cyan hover:text-cyan/80' : isTesla ? 'text-white/60 hover:text-white/80' : 'text-ocean hover:text-ocean/80'

  return (
    <div className={`flex items-start gap-4 rounded-xl px-5 py-5 max-w-md mx-auto mb-8 ${
      isDark ? 'glass' :
      isTesla ? 'border border-white/10' :
      'border border-ocean/10 bg-ocean/[0.02]'
    }`}>
      {/* Avatar placeholder */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold mt-0.5 ${
        isDark ? 'bg-white/[0.08] text-cyan' :
        isTesla ? 'bg-white/5 text-white/60' :
        'bg-ocean/10 text-ocean'
      }`}>
        {(t('contact.piName') || '').charAt(0)}
      </div>
      <div className="text-left">
        <div className={`font-semibold text-[15px] mb-1 ${
          isDark ? 'text-white' :
          isTesla ? 'text-white/80' :
          'text-navy'
        }`}>
          {t('contact.piName')}
        </div>
        <div className={`text-[13px] ${subTextClass}`}>
          {t('contact.piTitle')}
        </div>
        <div className={`text-[13px] ${subTextClass}`}>
          {t('contact.piRole')}
        </div>
        <div className={`text-[13px] ${subTextClass}`}>
          {t('contact.piAffiliation')}
        </div>
        <a href="mailto:zhangxizhe@njmu.edu.cn"
          className={`inline-flex items-center gap-1.5 text-[13px] mt-1.5 transition-colors ${linkClass}`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          zhangxizhe@njmu.edu.cn
        </a>
      </div>
    </div>
  )
}

function DarkContact({ t }) {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-navy to-ocean/80 animate-gradient-shift" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/5 animate-glow-pulse" />
      <FloatingParticles count={10} />
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, rgb(var(--color-cyan) / 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative section-container text-center text-white">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">{t('contact.heading')}</h2>

          <PICard t={t} variant="dark" />

          <div className="glass rounded-xl px-6 py-5 max-w-xl mx-auto mb-8 text-left">
            <h3 className="text-[13px] font-semibold text-white/70 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-coral/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('contact.disclaimerTitle')}
            </h3>
            <p className="text-[13px] text-white/40 leading-relaxed">{t('contact.disclaimer')}</p>
          </div>
          <p className="text-[15px] text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">{t('contact.funding')}</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-white/70 text-sm">
            <svg className="w-4 h-4 text-cyan/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Nanjing Medical University, Nanjing, China
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function LightContact({ t, theme }) {
  const isTesla = theme === 'tesla'

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden"
      style={{ backgroundColor: isTesla ? '#000' : 'rgb(var(--color-surface-page))' }}
    >
      {!isTesla && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ocean/20 to-transparent" />}

      <div className="relative section-container text-center">
        <ScrollReveal>
          <h2 className={`text-3xl sm:text-4xl mb-8 ${isTesla ? 'text-white font-light' : 'text-navy font-bold'}`}
            style={{ fontFamily: 'var(--font-heading)' }}>
            {t('contact.heading')}
          </h2>

          <PICard t={t} variant={isTesla ? 'tesla' : 'light'} />

          <div className={`rounded-xl px-6 py-4 max-w-xl mx-auto mb-8 text-left ${
            isTesla ? 'border border-white/10' : 'border border-ocean/10 bg-ocean/[0.02]'
          }`}>
            <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
              isTesla ? 'text-white/60' : 'text-slate-600'
            }`}>
              <svg className="w-4 h-4 text-coral/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('contact.disclaimerTitle')}
            </h3>
            <p className={`text-[13px] leading-relaxed ${isTesla ? 'text-white/30' : 'text-slate-400'}`}>
              {t('contact.disclaimer')}
            </p>
          </div>

          <p className={`text-[15px] max-w-xl mx-auto mb-8 leading-relaxed ${
            isTesla ? 'text-white/40' : 'text-slate-500'
          }`}>
            {t('contact.funding')}
          </p>

          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm ${
            isTesla ? 'border border-white/15 text-white/50' : 'border border-ocean/15 text-slate-500'
          }`}>
            <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Nanjing Medical University, Nanjing, China
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default function ContactSection() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  if (theme === 'academic' || theme === 'tesla') {
    return <LightContact t={t} theme={theme} />
  }

  return <DarkContact t={t} />
}
