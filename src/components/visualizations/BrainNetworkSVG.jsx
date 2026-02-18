import { useEffect, useRef } from 'react'

const nodes = [
  { cx: 120, cy: 80, r: 4 }, { cx: 220, cy: 50, r: 5 },
  { cx: 340, cy: 70, r: 6 }, { cx: 460, cy: 55, r: 4 },
  { cx: 580, cy: 85, r: 5 },
  { cx: 80, cy: 180, r: 5 }, { cx: 190, cy: 160, r: 7 },
  { cx: 310, cy: 170, r: 9 }, { cx: 420, cy: 155, r: 7 },
  { cx: 540, cy: 175, r: 5 }, { cx: 650, cy: 160, r: 4 },
  { cx: 100, cy: 280, r: 4 }, { cx: 230, cy: 270, r: 6 },
  { cx: 350, cy: 260, r: 8 }, { cx: 470, cy: 275, r: 6 },
  { cx: 600, cy: 265, r: 5 },
  { cx: 160, cy: 360, r: 5 }, { cx: 290, cy: 350, r: 6 },
  { cx: 420, cy: 355, r: 5 }, { cx: 550, cy: 365, r: 4 },
  { cx: 680, cy: 350, r: 3 },
  { cx: 50, cy: 130, r: 3 }, { cx: 700, cy: 120, r: 3 },
  { cx: 40, cy: 320, r: 3 }, { cx: 710, cy: 280, r: 3 },
]

const edges = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[0,6],[1,6],[1,7],[2,7],[2,8],[3,8],[3,9],[4,9],[4,10],
  [5,6],[6,7],[7,8],[8,9],[9,10],
  [5,11],[6,12],[7,12],[7,13],[8,13],[8,14],[9,14],[9,15],[10,15],
  [11,12],[12,13],[13,14],[14,15],
  [11,16],[12,16],[12,17],[13,17],[13,18],[14,18],[14,19],[15,19],[15,20],
  [16,17],[17,18],[18,19],[19,20],
  [1,8],[3,7],[6,13],[8,12],[13,17],[14,16],
  [21,0],[21,5],[22,4],[22,10],[23,11],[23,16],[24,15],[24,20],
]

const hubs = [7, 13]
const flowPaths = [[1,7],[7,13],[13,17],[2,8],[8,14],[6,12],[9,15]]

export default function BrainNetworkSVG() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onMove = (e) => {
      const r = svg.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width - 0.5) * 12
      const y = ((e.clientY - r.top) / r.height - 0.5) * 12
      svg.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <svg ref={svgRef} viewBox="0 0 750 420" className="w-full h-full transition-transform duration-700 ease-out" aria-hidden="true">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="ng"><stop offset="0%" stopColor="var(--svg-node)" stopOpacity="0.6"/><stop offset="100%" stopColor="var(--svg-node)" stopOpacity="0"/></radialGradient>
      </defs>

      {edges.map(([a,b],i) => (
        <line key={`e${i}`} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="var(--svg-edge)" strokeWidth="0.6" opacity="0.12">
          <animate attributeName="opacity" values="0.06;0.22;0.06" dur={`${4+(i%5)}s`} begin={`${(i*0.2)%5}s`} repeatCount="indefinite"/>
        </line>
      ))}

      {flowPaths.map(([a,b],i) => (
        <circle key={`f${i}`} r="1.8" fill="var(--svg-edge)" opacity="0">
          <animateMotion dur={`${2.5+i*0.4}s`} begin={`${i*0.7}s`} repeatCount="indefinite"
            path={`M${nodes[a].cx},${nodes[a].cy} L${nodes[b].cx},${nodes[b].cy}`}/>
          <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${2.5+i*0.4}s`} begin={`${i*0.7}s`} repeatCount="indefinite"/>
        </circle>
      ))}

      {nodes.map((n,i) => {
        const isHub = hubs.includes(i)
        return (
          <g key={`n${i}`}>
            {isHub && (
              <>
                <circle cx={n.cx} cy={n.cy} r={n.r*4} fill="url(#ng)" opacity="0.3">
                  <animate attributeName="r" values={`${n.r*3};${n.r*5};${n.r*3}`} dur="5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.15;0.35;0.15" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx={n.cx} cy={n.cy} r={n.r*2} fill="none" stroke="var(--svg-node)" strokeWidth="0.8" opacity="0">
                  <animate attributeName="r" values={`${n.r*1.5};${n.r*4}`} dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.4;0" dur="3s" repeatCount="indefinite"/>
                </circle>
              </>
            )}
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={isHub ? 'var(--svg-node)' : 'var(--svg-node-alt)'}
              opacity={isHub?0.9:0.45} filter={isHub?'url(#glow)':undefined}>
              <animate attributeName="r" values={`${n.r};${n.r*(isHub?1.5:1.25)};${n.r}`}
                dur={`${3+(i%4)}s`} begin={`${(i*0.4)%5}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values={isHub?'0.7;1;0.7':'0.25;0.55;0.25'}
                dur={`${3+(i%4)}s`} begin={`${(i*0.4)%5}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        )
      })}
    </svg>
  )
}
