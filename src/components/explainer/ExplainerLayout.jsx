import { useTranslation } from '../../i18n'
import ExplainerHero from './ExplainerHero'
import ExplainerSection from './ExplainerSection'
import FindingsSection from './FindingsSection'
import SoWhatSection from './SoWhatSection'
import LimitationsSection from './LimitationsSection'
import TableOfContents from './TableOfContents'
import BalanceExplorer from './BalanceExplorer'
import EvidenceCards from './EvidenceCards'
import PredictionDashboard from './PredictionDashboard'
import GlossaryPanel from './GlossaryPanel'
import FAQAccordion from './FAQAccordion'
import Disclaimer from './Disclaimer'
import FigureCard from './FigureCard'
import ScrollReveal from '../shared/ScrollReveal'

const tocSections = [
  { id: 'quick-read', zh: '30秒速读', en: 'Quick Read' },
  { id: 'why', zh: '为什么做', en: 'Why' },
  { id: 'how', zh: '怎么做', en: 'How' },
  { id: 'findings', zh: '主要发现', en: 'Findings' },
  { id: 'so-what', zh: '有什么用', en: 'So What' },
  { id: 'interactive', zh: '交互探索', en: 'Explore' },
  { id: 'limitations', zh: '局限性', en: 'Limitations' },
  { id: 'faq', zh: 'FAQ', en: 'FAQ' },
  { id: 'glossary', zh: '术语表', en: 'Glossary' },
]

export default function ExplainerLayout({ data, publication }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''

  return (
    <div className="min-h-screen">
      <ExplainerHero data={data} publication={publication} />

      {/* Fixed dot-nav TOC — desktop only */}
      <div className="hidden xl:block fixed left-6 2xl:left-10 top-1/2 -translate-y-1/2 z-30">
        <TableOfContents sections={tocSections} />
      </div>

      {/* Mobile TOC — sticky */}
      <div className="xl:hidden sticky top-16 z-20 bg-white/90 backdrop-blur-lg border-b border-slate-100">
        <div className="px-4 py-2.5">
          <TableOfContents sections={tocSections} mobile />
        </div>
      </div>

      {/* ═══ SECTION 1: Quick Read ═══ */}
      <section id="quick-read" className="bg-white">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-ocean/30" />
              <span className="text-ocean/60 text-xs font-medium uppercase tracking-[0.2em]">
                {language === 'zh' ? '30秒速读' : 'Quick Read'}
              </span>
            </div>
            <div className="text-lg sm:text-xl text-slate-700 leading-[1.75] whitespace-pre-line font-light">
              {L(data.sections.quickRead.content)}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ SECTION 2: Why ═══ */}
      <section id="why" className="bg-gradient-to-b from-slate-50/80 to-white">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <ExplainerSection
            title={L(data.sections.why.title)}
            items={data.sections.why.items}
            sectionColor="ocean"
          />
        </div>
      </section>

      {/* ═══ SECTION 3: How ═══ */}
      <section id="how" className="bg-white">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-ocean/30" />
              <span className="text-ocean/60 text-xs font-medium uppercase tracking-[0.2em]">
                {language === 'zh' ? '研究方法' : 'Methods'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-navy mb-10 leading-tight">
              {L(data.sections.how.title)}
            </h2>
          </ScrollReveal>

          {/* Steps as editorial timeline */}
          <div className="relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-ocean/20 via-ocean/10 to-transparent" />
            <div className="space-y-8">
              {data.sections.how.steps.map((step, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="flex gap-6 group">
                    <div className="flex-shrink-0 relative z-10">
                      <span className="flex w-8 h-8 rounded-full bg-white border-2 border-ocean/20 text-ocean items-center justify-center text-xs font-bold group-hover:bg-ocean group-hover:text-white group-hover:border-ocean transition-all">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 pb-2">
                      <h3 className="font-semibold text-navy mb-2">{L(step.title)}</h3>
                      <p className="text-slate-500 leading-[1.75] text-[14px]">{L(step.content)}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Pipeline figure — PROMINENT */}
          {data.visuals[0] && (
            <ScrollReveal delay={200}>
              <div className="mt-16">
                <FigureCard visual={data.visuals[0]} featured />
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ═══ SECTION 4: Findings — DARK DRAMATIC ═══ */}
      <section id="findings" className="bg-navy relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ocean/[0.05] rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan/[0.03] rounded-full blur-[160px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <FindingsSection findings={data.sections.findings} dark />

          {/* Figures grid */}
          <div className="mt-16 grid gap-5 sm:grid-cols-3">
            {data.visuals.slice(1, 4).map((v, i) => (
              <ScrollReveal key={v.id} delay={i * 80}>
                <FigureCard visual={v} compact dark />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: So What ═══ */}
      <section id="so-what" className="bg-white">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <SoWhatSection data={data.sections.soWhat} />
        </div>
      </section>

      {/* ═══ SECTION 6: Interactive — SUBTLE GRADIENT ═══ */}
      <section id="interactive" className="bg-gradient-to-b from-slate-50/80 to-white">
        <div className="max-w-4xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-ocean/30" />
              <span className="text-ocean/60 text-xs font-medium uppercase tracking-[0.2em]">
                {language === 'zh' ? '数据探索' : 'Data Explorer'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-navy mb-10 leading-tight">
              {language === 'zh' ? '交互探索' : 'Interactive Exploration'}
            </h2>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal><BalanceExplorer data={data.interactives.balanceExplorer} /></ScrollReveal>
            <ScrollReveal delay={100}><EvidenceCards data={data.interactives.evidenceCards} /></ScrollReveal>
            <ScrollReveal delay={200}><PredictionDashboard data={data.interactives.predictionDashboard} /></ScrollReveal>
          </div>

          {/* Remaining figures */}
          <div className="mt-16 grid gap-4 grid-cols-2 lg:grid-cols-4">
            {data.visuals.slice(3).map((v, i) => (
              <ScrollReveal key={v.id} delay={i * 60}>
                <FigureCard visual={v} compact />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7: Limitations ═══ */}
      <section id="limitations" className="bg-white">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <LimitationsSection data={data.sections.limitations} />
        </div>
      </section>

      {/* ═══ SECTION 8+9: FAQ + Glossary ═══ */}
      <div className="bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-8 sm:px-12 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-16">
            <section id="faq"><FAQAccordion items={data.faq} /></section>
            <section id="glossary"><GlossaryPanel items={data.glossary} /></section>
          </div>
        </div>
      </div>

      {/* ═══ Take Home — DARK BOOKEND ═══ */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative max-w-3xl mx-auto px-8 sm:px-12 py-16 sm:py-20 text-center">
          <ScrollReveal>
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-white/90 leading-relaxed italic">
              &ldquo;{L(data.sections.takeHome.text)}&rdquo;
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 text-white/25 text-sm">
              <div className="w-10 h-px bg-white/15" />
              <span className="font-mono text-xs">{data.meta.paperReference}</span>
              <div className="w-10 h-px bg-white/15" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-8 sm:px-12 py-12">
          <Disclaimer text={L(data.disclaimer.text)} />
        </div>
      </div>
    </div>
  )
}
