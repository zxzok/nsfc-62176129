import { useState } from 'react'
import { useTranslation } from '../../i18n'

export default function FigureCard({ visual, compact = false, featured = false, dark = false }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (featured) {
    return (
      <>
        <figure
          className="group cursor-pointer"
          onClick={() => setExpanded(true)}
          role="button"
          tabIndex={0}
        >
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-lg hover:shadow-slate-100/50">
            <div className="aspect-[16/9] sm:aspect-[2/1]">
              {!imgError ? (
                <img
                  src={import.meta.env.BASE_URL + visual.src.replace(/^\//, '')}
                  alt={L(visual.alt)}
                  className="w-full h-full object-contain p-4 sm:p-6"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <p className="text-sm">{visual.paperFigure}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/[0.03] transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium text-navy shadow-sm">
                {language === 'zh' ? '点击放大' : 'Click to enlarge'}
              </span>
            </div>
          </div>
          <figcaption className="mt-4 px-1">
            <p className="font-medium text-navy text-[15px]">
              {visual.paperFigure}: {L(visual.figureName)}
            </p>
            <p className="text-[13px] text-slate-400 mt-1.5 leading-relaxed">{L(visual.coreMessage)}</p>
            <p className="text-[11px] text-slate-300 mt-2 font-mono">
              {visual.type === 'reuse' ? 'Guo et al. BMC Medicine 2025, CC BY-NC-ND 4.0' : ''}
            </p>
          </figcaption>
        </figure>

        {expanded && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setExpanded(false)}
          >
            <div className="max-w-5xl max-h-[90vh] w-full relative" onClick={(e) => e.stopPropagation()}>
              {!imgError ? (
                <img
                  src={import.meta.env.BASE_URL + visual.src.replace(/^\//, '')}
                  alt={L(visual.alt)}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="bg-slate-900 rounded-xl p-12 text-center text-white/50">
                  <p className="text-lg">{visual.paperFigure}: {L(visual.figureName)}</p>
                  <p className="text-sm mt-2">{L(visual.alt)}</p>
                </div>
              )}
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-white/50 text-sm">{visual.paperFigure}: {L(visual.figureName)}</p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <figure
        className={`rounded-xl overflow-hidden transition-all ${
          dark
            ? 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07]'
            : 'border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
        } ${compact ? 'p-2.5' : 'p-4'} ${!compact ? 'cursor-pointer' : ''}`}
        onClick={() => !compact && setExpanded(true)}
        role={compact ? undefined : 'button'}
        tabIndex={compact ? undefined : 0}
      >
        <div className={`relative rounded-lg overflow-hidden ${
          dark ? 'bg-white/[0.03]' : 'bg-slate-50'
        } ${compact ? 'aspect-[4/3]' : 'aspect-video'}`}>
          {!imgError ? (
            <img
              src={import.meta.env.BASE_URL + visual.src.replace(/^\//, '')}
              alt={L(visual.alt)}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center ${dark ? 'text-white/20' : 'text-slate-300'}`}>
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <p className="text-[11px]">{visual.paperFigure}</p>
              </div>
            </div>
          )}
        </div>
        <figcaption className={`${compact ? 'mt-2' : 'mt-3'}`}>
          <p className={`font-medium ${compact ? 'text-[11px]' : 'text-[13px]'} ${dark ? 'text-white/80' : 'text-navy'}`}>
            {visual.paperFigure}: {L(visual.figureName)}
          </p>
          {!compact && (
            <p className={`text-[12px] mt-1 leading-relaxed ${dark ? 'text-white/40' : 'text-slate-400'}`}>
              {L(visual.coreMessage)}
            </p>
          )}
          <p className={`text-[11px] mt-1 ${dark ? 'text-white/20' : 'text-slate-300'}`}>
            {visual.type === 'reuse' ? 'Guo et al. BMC Medicine 2025, CC BY-NC-ND 4.0' : ''}
          </p>
        </figcaption>
      </figure>

      {expanded && !compact && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setExpanded(false)}
        >
          <div className="max-w-4xl max-h-[90vh] w-full relative" onClick={(e) => e.stopPropagation()}>
            {!imgError ? (
              <img
                src={import.meta.env.BASE_URL + visual.src.replace(/^\//, '')}
                alt={L(visual.alt)}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="bg-slate-900 rounded-lg p-12 text-center text-white/50">
                <p>{visual.paperFigure}: {L(visual.figureName)}</p>
                <p className="text-sm mt-2">{L(visual.alt)}</p>
              </div>
            )}
            <button
              onClick={() => setExpanded(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
