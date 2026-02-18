import { useMemo } from 'react'
import { useTheme } from '../../theme'

export default function FloatingParticles({ count = 20, color, className = '' }) {
  const { theme } = useTheme()

  const hidden = theme === 'academic' || theme === 'tesla'

  const resolvedColor = color || (theme === 'dark'
    ? 'rgba(34,211,238,0.15)'
    : 'rgba(0,180,216,0.15)')

  const particles = useMemo(() => {
    const seed = (i) => {
      // Simple seeded pseudo-random for deterministic output
      const x = Math.sin(i * 127.1 + count * 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${seed(i) * 100}%`,
      size: 2 + seed(i + 100) * 4,
      delay: seed(i + 200) * 10,
      duration: 12 + seed(i + 300) * 18,
      opacity: 0.2 + seed(i + 400) * 0.4,
    }))
  }, [count])

  if (hidden) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: resolvedColor,
            opacity: 0,
            animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
