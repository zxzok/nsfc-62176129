import { useEffect, useRef, useState } from 'react'

export default function ResponseRateChart({ rate, label, color = 'var(--svg-node)' }) {
  const ref = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const pct = animated ? rate : 0

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(var(--color-border))" strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-lg">
          {animated ? `${rate}%` : '0%'}
        </div>
      </div>
      <span className="text-xs text-slate-500 text-center">{label}</span>
    </div>
  )
}
