import { useTranslation } from '../../i18n'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <button
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-300 hover:border-cyan hover:text-cyan transition-colors"
      aria-label="Switch language"
    >
      {language === 'zh' ? 'EN' : '中文'}
    </button>
  )
}
