import { useTranslation } from '../../i18n'
import { useTheme } from '../../theme'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const isTesla = theme === 'tesla'
  const isAcademic = theme === 'academic'

  return (
    <footer className={`py-14 ${
      isTesla ? 'bg-black text-white/60' :
      isAcademic ? 'bg-slate-800 text-slate-400' :
      'bg-navy text-white/70'
    }`}>
      <div className="section-container">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="font-semibold text-white mb-3">
              <span className="text-cyan">NSFC</span> 62176129
            </div>
            <p className="text-[13px] leading-relaxed">
              {t('contact.funding')}
            </p>
          </div>
          <div>
            <div className="font-medium text-white mb-3">
              {t('nav.researchDetail')}
            </div>
            <Link to="/research/subtyping" className="text-[13px] hover:text-cyan transition-colors block mb-2">
              {t('nav.subtyping')}
            </Link>
            <Link to="/research/network-control" className="text-[13px] hover:text-cyan transition-colors block mb-2">
              {t('nav.networkControl')}
            </Link>
            <Link to="/research/biomarkers" className="text-[13px] hover:text-cyan transition-colors block mb-2">
              {t('nav.biomarkers')}
            </Link>
            <Link to="/research/translation" className="text-[13px] hover:text-cyan transition-colors block">
              {t('nav.translation')}
            </Link>
          </div>
          <div>
            <div className="font-medium text-white mb-3">
              {t('nav.publications')}
            </div>
            <Link to="/publications" className="text-[13px] hover:text-cyan transition-colors block mb-2">
              {t('results.viewAll')} &rarr;
            </Link>
            <Link to="/patents" className="text-[13px] hover:text-cyan transition-colors block">
              {t('nav.patents')} &rarr;
            </Link>
          </div>
          <div>
            <div className="font-medium text-white mb-3">
              {t('contact.heading')}
            </div>
            <p className="text-[13px] leading-relaxed">
              Nanjing Medical University, Nanjing, China
            </p>
          </div>
        </div>
        <div className={`border-t pt-6 text-center text-xs space-y-2 ${
          isTesla ? 'border-white/10' : isAcademic ? 'border-white/10' : 'border-white/10'
        }`}>
          <div>&copy; {t('contact.copyright')}</div>
          <div>
            {t('contact.reprint')}{' '}
            <a href="mailto:zhangxizhe@njmu.edu.cn" className="text-cyan hover:underline">zhangxizhe@njmu.edu.cn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
