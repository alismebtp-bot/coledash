import type { ReactNode } from 'react'
import { Home, Store } from 'lucide-react'
import type { OrderStatus } from '@/types'

type Pt = [number, number]

const APPROACH: Pt[] = [
  [24, 236],
  [88, 236],
  [88, 196],
]
const ROUTE: Pt[] = [
  [88, 196],
  [88, 132],
  [196, 132],
  [196, 72],
  [316, 72],
  [316, 52],
]
const SHOP = ROUTE[0]
const HOME = ROUTE[ROUTE.length - 1]

function along(points: Pt[], t: number): Pt {
  const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]))
  const total = lens.reduce((a, b) => a + b, 0)
  let d = Math.min(Math.max(t, 0), 1) * total
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const r = lens[i] === 0 ? 0 : d / lens[i]
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * r, points[i][1] + (points[i + 1][1] - points[i][1]) * r]
    }
    d -= lens[i]
  }
  return points[points.length - 1]
}

const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')

interface Props {
  /** Elapsed minutes in the lifecycle (0–10). */
  minutes: number
  status: OrderStatus
}

/** Stylised city map (pure SVG) with the courier moving shop → home. */
export default function TrackingMap({ minutes, status }: Props) {
  // 0–4 min : le livreur rejoint le commerce ; 4–10 min : trajet vers vous
  const pos: Pt =
    status === 'cancelled' ? APPROACH[0] : minutes < 4 ? along(APPROACH, minutes / 4) : along(ROUTE, (minutes - 4) / 6)
  const routeDone = minutes > 4 ? (minutes - 4) / 6 : 0

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-[#efe9df]">
      <svg viewBox="0 0 400 260" className="block h-auto w-full" role="img" aria-label="Carte du trajet de votre livreur">
        {/* Îlots d'immeubles */}
        <g fill="#e2dacb">
          {Array.from({ length: 6 }).map((_, c) =>
            Array.from({ length: 4 }).map((__, r) => (
              <rect key={`${c}-${r}`} x={c * 70 + 8} y={r * 64 + 8} width={54} height={46} rx={6} />
            )),
          )}
        </g>
        {/* Parc */}
        <rect x={218} y={136} width={124} height={46} rx={10} fill="#cfe3c2" />
        <circle cx={240} cy={158} r={7} fill="#b4d3a1" />
        <circle cx={262} cy={150} r={5} fill="#b4d3a1" />
        <circle cx={318} cy={164} r={8} fill="#b4d3a1" />
        {/* Fleuve */}
        <path d="M0 214 C 90 196, 140 250, 230 222 S 360 196, 400 210 L 400 232 C 360 220, 300 246, 230 244 S 90 220, 0 236 Z" fill="#bcd7e6" />
        {/* Rues principales */}
        <g stroke="#fbf8f2" strokeWidth={8} strokeLinecap="round">
          <line x1={0} y1={132} x2={400} y2={132} />
          <line x1={0} y1={72} x2={400} y2={72} />
          <line x1={88} y1={0} x2={88} y2={260} />
          <line x1={196} y1={0} x2={196} y2={260} />
          <line x1={316} y1={0} x2={316} y2={260} />
        </g>
        {/* Trajet */}
        <path d={toPath(ROUTE)} fill="none" stroke="#1c1917" strokeOpacity={0.25} strokeWidth={4} strokeDasharray="2 7" strokeLinecap="round" />
        <path
          d={toPath(ROUTE)}
          fill="none"
          stroke="#e11d48"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - routeDone}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        {/* Livreur */}
        {status !== 'delivered' && status !== 'cancelled' && (
          <g style={{ transform: `translate(${pos[0]}px, ${pos[1]}px)`, transition: 'transform 1s linear' }}>
            <circle r={16} fill="#e11d48" opacity={0.18}>
              <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r={9} fill="#e11d48" stroke="#fff" strokeWidth={3} />
          </g>
        )}
      </svg>
      {/* Repères HTML pour des icônes nettes */}
      <Marker x={SHOP[0]} y={SHOP[1]} label="Commerce" tone="ink">
        <Store className="h-4 w-4" aria-hidden />
      </Marker>
      <Marker x={HOME[0]} y={HOME[1]} label="Vous" tone="brand">
        <Home className="h-4 w-4" aria-hidden />
      </Marker>
    </div>
  )
}

function Marker({ x, y, label, tone, children }: { x: number; y: number; label: string; tone: 'ink' | 'brand'; children: ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
      style={{ left: `${(x / 400) * 100}%`, top: `${(y / 260) * 100}%` }}
    >
      <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-white shadow ${tone === 'ink' ? 'bg-ink' : 'bg-brand-600'}`}>
        {children}
        <span className="hidden sm:inline">{label}</span>
      </span>
      <span className={`h-2 w-0.5 ${tone === 'ink' ? 'bg-ink' : 'bg-brand-600'}`} />
    </div>
  )
}
