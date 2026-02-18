import { useTranslation } from '../../i18n'
import { useTheme } from '../../theme'
import BrainNetworkSVG from '../visualizations/BrainNetworkSVG'
import FloatingParticles from '../shared/FloatingParticles'

function DarkHero({ t }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden wave-divider">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-navy to-navy-light animate-gradient-shift" />

      {/* Morphing gradient orbs */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-ocean/20 animate-morph animate-glow-pulse" />
      <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-cyan/15 animate-morph animate-glow-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ocean/10 animate-morph" style={{ animationDelay: '4s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgb(var(--color-cyan) / 0.3) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-cyan) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      <FloatingParticles count={30} />

      {/* Brain network */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
        <div className="w-full max-w-5xl px-8">
          <BrainNetworkSVG />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center text-white py-20">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-cyan text-sm font-medium mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          {t('hero.subtitle')}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-8 text-balance max-w-4xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}>
          {t('hero.title')}
        </h1>

        <p className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-[1.65] animate-fade-in-up"
          style={{ animationDelay: '0.25s' }}>
          {t('hero.introDesc')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}>
          {[t('hero.grant'), t('hero.duration'), t('hero.pi')].map((text, i) => (
            <span key={i} className="px-4 py-2 rounded-full glass text-white/70 text-[13px] tracking-wide">
              {text}
            </span>
          ))}
        </div>

        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 mx-auto flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-cyan animate-bounce" />
          </div>
          <span className="text-xs text-white/30 mt-3 block">{t('hero.scroll')}</span>
        </div>
      </div>
    </section>
  )
}

function LightHero({ t, theme }) {
  const isTesla = theme === 'tesla'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0" style={{ backgroundColor: isTesla ? '#000' : 'rgb(var(--color-surface-page))' }} />

      {isTesla ? (
        /* Tesla: subtle grid on black */
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      ) : (
        /* Academic: subtle top accent line */
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ocean to-transparent opacity-40" />
      )}

      {/* Content */}
      <div className="relative z-10 section-container text-center py-20 max-w-4xl mx-auto">
        {!isTesla && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ocean/20 text-ocean text-sm font-medium mb-8 animate-fade-in-up">
            {t('hero.subtitle')}
          </div>
        )}

        <h1 className={`leading-[1.1] mb-8 text-balance max-w-4xl mx-auto animate-fade-in-up ${
          isTesla
            ? 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-white tracking-tight'
            : 'text-4xl sm:text-5xl lg:text-6xl font-bold text-navy'
        }`}
          style={{ animationDelay: '0.15s', fontFamily: 'var(--font-heading)' }}>
          {t('hero.title')}
        </h1>

        <p className={`max-w-2xl mx-auto mb-10 leading-[1.65] animate-fade-in-up ${
          isTesla
            ? 'text-lg sm:text-xl text-white/50 font-light'
            : 'text-lg sm:text-xl text-slate-500'
        }`}
          style={{ animationDelay: '0.25s' }}>
          {t('hero.introDesc')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}>
          {[t('hero.grant'), t('hero.duration'), t('hero.pi')].map((text, i) => (
            <span key={i} className={`px-4 py-2 rounded-full text-[13px] tracking-wide ${
              isTesla
                ? 'border border-white/20 text-white/60'
                : 'border border-ocean/15 text-slate-500'
            }`}>
              {text}
            </span>
          ))}
        </div>

        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className={`w-6 h-10 rounded-full border-2 mx-auto flex justify-center pt-2 ${
            isTesla ? 'border-white/20' : 'border-slate-300'
          }`}>
            <div className={`w-1 h-2.5 rounded-full animate-bounce ${
              isTesla ? 'bg-white/40' : 'bg-ocean'
            }`} />
          </div>
          <span className={`text-xs mt-3 block ${isTesla ? 'text-white/30' : 'text-slate-400'}`}>
            {t('hero.scroll')}
          </span>
        </div>
      </div>
    </section>
  )
}

export default function HeroSection() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  if (theme === 'academic' || theme === 'tesla') {
    return <LightHero t={t} theme={theme} />
  }

  return <DarkHero t={t} theme={theme} />
}
