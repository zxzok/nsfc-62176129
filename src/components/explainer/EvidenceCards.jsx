import { useTranslation } from '../../i18n'

const iconMap = {
  brain: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a7 7 0 017 7c0 2.5-1.5 4.5-3 6s-2 3.5-2 5h-4c0-1.5-.5-3.5-2-5s-3-3.5-3-6a7 7 0 017-7z" />
      <path d="M9 20h6M10 22h4" />
    </svg>
  ),
  dna: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6" />
    </svg>
  ),
  microscope: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v4M8 21h8M12 17h.01" />
    </svg>
  ),
  flask: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 3h6M10 3v6l-5 8.5c-.5.8.2 1.5 1 1.5h12c.8 0 1.5-.7 1-1.5L14 9V3" />
    </svg>
  ),
}

export default function EvidenceCards({ data }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''

  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 sm:px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
        <h3 className="font-serif text-lg text-navy">{L(data.title)}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-lg">{L(data.description)}</p>
      </div>

      {/* Comparison columns */}
      <div className="grid sm:grid-cols-2">
        {data.subtypes.map((subtype, idx) => {
          const isOcean = subtype.color === 'ocean'
          return (
            <div
              key={subtype.id}
              className={`p-5 sm:p-6 ${idx === 0 ? 'sm:border-r border-b sm:border-b-0 border-slate-100' : ''}`}
            >
              {/* Subtype label */}
              <div className="mb-5 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${isOcean ? 'bg-ocean' : 'bg-coral'}`} />
                  <p className={`text-sm font-semibold ${isOcean ? 'text-ocean' : 'text-coral'}`}>
                    {L(subtype.name)}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 ml-[18px]">{L(subtype.animalModel)}</p>
              </div>

              {/* Evidence dimensions */}
              <div className="space-y-4">
                {data.dimensions.map((dim) => (
                  <div key={dim.id} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${
                      isOcean ? 'bg-ocean/[0.06] text-ocean' : 'bg-coral/[0.06] text-coral'
                    }`}>
                      {iconMap[dim.icon]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {L(dim.label)}
                      </p>
                      <p className="text-[13px] text-slate-600 leading-[1.7]">
                        {L(subtype.evidence[dim.id])}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
