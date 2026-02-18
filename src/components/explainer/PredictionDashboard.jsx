import { useState } from 'react'
import { useTranslation } from '../../i18n'

function GaugeSVG({ r, color, size = 110 }) {
  const radius = 38
  const circumference = Math.PI * radius
  const offset = circumference * (1 - r)

  const colors = {
    ocean: { stroke: '#1E6091', glow: 'rgba(30,96,145,0.15)' },
    coral: { stroke: '#F77F6B', glow: 'rgba(247,127,107,0.15)' },
  }
  const c = colors[color] || colors.ocean

  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 100 65">
      {/* Glow filter */}
      <defs>
        <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <path
        d="M 10 60 A 40 40 0 0 1 90 60"
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Fill */}
      <path
        d="M 10 60 A 40 40 0 0 1 90 60"
        fill="none"
        stroke={c.stroke}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={offset}
        filter={`url(#glow-${color})`}
        className="transition-all duration-1000 ease-out"
      />

      {/* Value */}
      <text x="50" y="46" textAnchor="middle" fill="#0F2B46" fontSize="18" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
        {r}
      </text>
      <text x="50" y="62" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500" letterSpacing="0.05em">
        R
      </text>
    </svg>
  )
}

export default function PredictionDashboard({ data }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 sm:px-7 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
        <h3 className="font-serif text-lg text-navy">{L(data.title)}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-lg">{L(data.description)}</p>
      </div>

      {/* Gauges */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.scenarios.map((s) => {
            const isOcean = s.color === 'ocean'
            return (
              <div
                key={s.id}
                className={`relative text-center rounded-xl p-5 transition-all cursor-default ${
                  isOcean
                    ? 'bg-ocean/[0.02] hover:bg-ocean/[0.05] border border-ocean/[0.06]'
                    : 'bg-coral/[0.02] hover:bg-coral/[0.05] border border-coral/[0.06]'
                }`}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <GaugeSVG r={s.r} color={s.color} />
                <p className="text-[13px] font-medium text-navy mt-1.5">{L(s.label)}</p>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">P = {s.p}</p>

                {/* Tooltip */}
                {hoveredId === s.id && (
                  <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 bg-navy text-white rounded-xl p-4 text-xs leading-relaxed shadow-xl shadow-navy/20">
                    <p className="font-semibold mb-1.5">{L(s.model)}</p>
                    <p className="text-white/60">
                      {language === 'zh' ? '预测目标' : 'Target'}: <span className="text-white/80">{L(s.target)}</span>
                    </p>
                    <p className="text-white/60 mt-0.5">
                      {language === 'zh' ? '预测因子' : 'Predictors'}: <span className="text-white/80">{L(s.predictors)}</span>
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-navy" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mt-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-ocean/40" />
            {language === 'zh' ? '动物模型' : 'Animal Models'}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-coral/40" />
            {language === 'zh' ? '人类队列' : 'Human Cohorts'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 sm:px-7 py-3.5 border-t border-slate-50 bg-slate-50/30">
        <p className="text-[11px] text-slate-400 italic">{L(data.disclaimer)}</p>
      </div>
    </div>
  )
}
