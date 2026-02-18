import { useState } from 'react'
import { useTranslation } from '../../i18n'

export default function BalanceExplorer({ data }) {
  const { language } = useTranslation()
  const L = (obj) => obj?.[language] || obj?.zh || ''
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 sm:px-7 py-5 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
        <div>
          <h3 className="font-serif text-lg text-navy">{L(data.title)}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">{L(data.description)}</p>
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-xs px-4 py-2 rounded-full border border-ocean/20 text-ocean hover:bg-ocean hover:text-white transition-all font-medium"
        >
          {showStats
            ? (language === 'zh' ? '显示方向' : 'Direction')
            : (language === 'zh' ? '显示T/P值' : 'T/P Values')}
        </button>
      </div>

      {/* Grid */}
      <div className="p-5 sm:p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {data.data.map((row) => {
            const isOcean = row.color === 'ocean'
            const accentColor = isOcean ? 'ocean' : 'coral'

            return (
              <div
                key={row.id}
                className={`rounded-xl p-5 border transition-all hover:shadow-sm ${
                  isOcean
                    ? 'bg-ocean/[0.02] border-ocean/10 hover:border-ocean/20'
                    : 'bg-coral/[0.02] border-coral/10 hover:border-coral/20'
                }`}
              >
                <div className="mb-4">
                  <p className={`text-sm font-semibold ${isOcean ? 'text-ocean' : 'text-coral'}`}>
                    {L(row.label)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{L(row.type)}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {['subcortical', 'sensorimotor'].map((region) => (
                    <div key={region} className="bg-white rounded-lg p-3.5 text-center border border-slate-50">
                      <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-medium">
                        {region === 'subcortical'
                          ? (language === 'zh' ? '皮层下' : 'Subcortical')
                          : (language === 'zh' ? '感觉运动' : 'Sensorimotor')}
                      </p>
                      {showStats ? (
                        <div>
                          <p className="text-base font-mono font-semibold text-navy">
                            T = {row[region].t}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 font-mono">
                            P = {row[region].p}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className={`text-2xl font-light leading-none ${
                            row[region].direction === 'up' ? 'text-rose-400' : 'text-sky-400'
                          }`}>
                            {row[region].direction === 'up' ? '\u2191' : '\u2193'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {row[region].direction === 'up'
                              ? (language === 'zh' ? '增强' : 'Up')
                              : (language === 'zh' ? '减弱' : 'Down')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 sm:px-7 py-3.5 border-t border-slate-50 bg-slate-50/30">
        <p className="text-[11px] text-slate-400 italic">{L(data.disclaimer)}</p>
      </div>
    </div>
  )
}
