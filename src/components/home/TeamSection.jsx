import { useTranslation } from '../../i18n'
import ScrollReveal from '../shared/ScrollReveal'
import { team } from '../../data/team'

export default function TeamSection() {
  const { language, t } = useTranslation()
  const lang = language

  return (
    <section id="team" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-1" />

      {/* Decorative shapes */}
      <div className="absolute top-[15%] left-[8%] w-24 h-24 rounded-full bg-ocean/5 animate-float" />
      <div className="absolute bottom-[20%] right-[5%] w-32 h-32 rounded-full bg-cyan/5 animate-float-reverse" />

      <div className="relative section-container">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy text-center mb-5">
            {t('team.heading')}
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-ocean to-cyan mx-auto mb-14" />
        </ScrollReveal>

        {/* PI */}
        <ScrollReveal>
          <div className="card-base card-glow p-8 mb-8 max-w-2xl mx-auto bg-gradient-to-br from-ocean/5 to-transparent group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ocean/20 to-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <span className="inline-block text-xs font-medium text-ocean uppercase tracking-wide px-2 py-0.5 rounded-full bg-ocean/10">
                  {t('team.pi')}
                </span>
                <h3 className="text-xl font-bold text-navy mt-2">
                  {team.pi.name[lang]}
                </h3>
                <p className="text-[15px] text-slate-600 mt-2 leading-[1.75]">
                  {team.pi.desc[lang]}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Collaboration */}
        <ScrollReveal delay={100}>
          <div className="card-base card-glow p-6 mb-8 max-w-2xl mx-auto group hover:-translate-y-0.5 transition-all duration-300">
            <h4 className="font-semibold text-navy mb-2">{t('team.collaborator')}</h4>
            <p className="text-[15px] text-slate-600 leading-relaxed">
              {t('team.collabNote')}
            </p>
          </div>
        </ScrollReveal>

        {/* Talent Development */}
        <ScrollReveal delay={200}>
          <div className="card-base card-glow p-7 max-w-2xl mx-auto">
            <h4 className="font-semibold text-navy mb-5">{t('team.training')}</h4>
            <p className="text-[15px] text-slate-600 leading-relaxed mb-5">
              {t('team.trainingDesc')}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Postdocs */}
              <div className="rounded-xl bg-gradient-to-br from-ocean/5 to-transparent p-4 hover:from-ocean/10 transition-all duration-300">
                <span className="text-xs font-medium text-ocean px-2 py-0.5 rounded-full bg-ocean/10">
                  {lang === 'zh' ? '博士后' : 'Postdoctoral Fellows'}
                </span>
                <div className="mt-2 text-sm text-slate-700">
                  {team.training.postdocs.map(p => p.name[lang]).join('、')}
                </div>
              </div>
              {/* PhD */}
              <div className="rounded-xl bg-gradient-to-br from-cyan/5 to-transparent p-4 hover:from-cyan/10 transition-all duration-300">
                <span className="text-xs font-medium text-cyan px-2 py-0.5 rounded-full bg-cyan/10">
                  {lang === 'zh' ? '博士研究生' : 'PhD Graduate'}
                </span>
                <div className="mt-2 text-sm text-slate-700">
                  {team.training.phd.map(p => p.name[lang]).join('、')}
                </div>
              </div>
              {/* Masters */}
              <div className="sm:col-span-2 rounded-xl bg-gradient-to-br from-coral/5 to-transparent p-4 hover:from-coral/10 transition-all duration-300">
                <span className="text-xs font-medium text-coral px-2 py-0.5 rounded-full bg-coral/10">
                  {lang === 'zh' ? '硕士研究生' : "Master's Graduates"}
                </span>
                <div className="mt-3 space-y-2">
                  {team.training.masters.map((m) => (
                    <div key={m.name.zh} className="text-sm text-slate-700 flex items-baseline gap-2">
                      <span className="font-medium">{m.name[lang]}</span>
                      <span className="text-slate-300">—</span>
                      <span className="text-xs text-slate-500">{m.thesis[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
