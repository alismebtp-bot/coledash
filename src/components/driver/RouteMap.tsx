import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { createRng } from '@/data/portals/driver'

interface Props {
  seed: number
  /** Which leg is active: 0 = to merchant, 1 = to customer. */
  leg: 0 | 1
  className?: string
}

type Pt = [number, number]

/** Manhattan-style path between two points, for a street-grid look. */
function legPath(a: Pt, b: Pt, rng: () => number): Pt[] {
  const midX = Math.round(a[0] + (b[0] - a[0]) * (0.3 + rng() * 0.4))
  return [a, [midX, a[1]], [midX, b[1]], b]
}

const toD = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')

export default function RouteMap({ seed, leg, className }: Props) {
  const geo = useMemo(() => {
    const rng = createRng(seed)
    const driver: Pt = [40 + Math.round(rng() * 40), 170 + Math.round(rng() * 25)]
    const merchant: Pt = [130 + Math.round(rng() * 50), 70 + Math.round(rng() * 60)]
    const customer: Pt = [250 + Math.round(rng() * 40), 30 + Math.round(rng() * 60)]
    const streetsV = Array.from({ length: 8 }, (_, i) => 20 + i * 42 + Math.round(rng() * 10))
    const streetsH = Array.from({ length: 5 }, (_, i) => 18 + i * 48 + Math.round(rng() * 8))
    const blocks = Array.from({ length: 9 }, () => ({
      x: Math.round(rng() * 300),
      y: Math.round(rng() * 200),
      w: 18 + Math.round(rng() * 22),
      h: 14 + Math.round(rng() * 18),
      park: rng() < 0.3,
    }))
    return { driver, merchant, customer, streetsV, streetsH, blocks, leg1: legPath(driver, merchant, rng), leg2: legPath(merchant, customer, rng) }
  }, [seed])

  const active = leg === 0 ? geo.leg1 : geo.leg2
  const done = leg === 1 ? geo.leg1 : null
  const upcoming = leg === 0 ? geo.leg2 : null
  const courier = leg === 0 ? geo.driver : geo.merchant

  return (
    <svg viewBox="0 0 320 220" className={className} role="img" aria-label="Plan schématique de l'itinéraire">
      <rect width="320" height="220" fill="#f4efe6" />
      {geo.blocks.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.park ? '#d9ead3' : '#ebe4d6'} />
      ))}
      {/* Seine */}
      <path d="M-10 150 C 60 120, 110 205, 190 180 S 290 120, 335 150" fill="none" stroke="#bcd7ea" strokeWidth="14" strokeLinecap="round" />
      {geo.streetsV.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="220" stroke="#fff" strokeWidth="5" />
      ))}
      {geo.streetsH.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="320" y2={y} stroke="#fff" strokeWidth="5" />
      ))}
      {done && <path d={toD(done)} fill="none" stroke="#a8a29e" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
      {upcoming && <path d={toD(upcoming)} fill="none" stroke="#1c1917" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="5 6" strokeLinejoin="round" strokeLinecap="round" />}
      <path d={toD(active)} fill="none" stroke="#fff" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
      <motion.path
        key={`${seed}-${leg}`}
        d={toD(active)}
        fill="none"
        stroke="#e11d48"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
      {/* Merchant pin */}
      <g transform={`translate(${geo.merchant[0]} ${geo.merchant[1]})`}>
        <circle r="11" fill="#1c1917" stroke="#fff" strokeWidth="3" />
        <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">C</text>
      </g>
      {/* Customer pin */}
      <g transform={`translate(${geo.customer[0]} ${geo.customer[1]})`}>
        <path d="M0 -20 C 8 -20 12 -14 12 -9 C 12 -2 0 8 0 8 C 0 8 -12 -2 -12 -9 C -12 -14 -8 -20 0 -20 Z" fill="#e11d48" stroke="#fff" strokeWidth="2.5" />
        <circle cy="-10" r="4" fill="#fff" />
      </g>
      {/* Courier */}
      <g transform={`translate(${courier[0]} ${courier[1]})`}>
        <circle r="14" fill="#e11d48" opacity="0.18">
          <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="7" fill="#2563eb" stroke="#fff" strokeWidth="3" />
      </g>
    </svg>
  )
}
