import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '../i18n'
import { getPublicationBySlug } from '../data/publications'
import { loadExplainer, hasExplainer } from '../data/explainers'
import ExplainerLayout from '../components/explainer/ExplainerLayout'

export default function ExplainerPage() {
  const { slug } = useParams()
  const { t, language } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const pub = getPublicationBySlug(slug)

  useEffect(() => {
    if (!slug || !hasExplainer(slug)) {
      setLoading(false)
      return
    }
    loadExplainer(slug).then((d) => {
      setData(d)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ocean/30 border-t-ocean rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">
            {language === 'zh' ? '加载中...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (!pub || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">
            {language === 'zh' ? '页面未找到' : 'Page Not Found'}
          </h2>
          <Link
            to="/publications"
            className="text-ocean hover:text-ocean/80 transition-colors"
          >
            {language === 'zh' ? '← 返回论文列表' : '← Back to Publications'}
          </Link>
        </div>
      </div>
    )
  }

  return <ExplainerLayout data={data} publication={pub} />
}
