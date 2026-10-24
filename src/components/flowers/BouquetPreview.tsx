import { useId, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Flower2 } from 'lucide-react'
import type { FlowerItem } from '@/data/flowerCatalog'
import { FlowerGlyph } from './FlowerGlyph'
import { chosenFlowers, pricing, type Composition } from './composer'
import { shade } from './color'

const W = 400
const H = 480
const CX = 200
const CY = 190
const TIE = { x: 200, y: 345 }

const SIZE: Record<FlowerItem['category'], number> = {
  rose: 1,
  tulip: 0.9,
  peony: 1.2,
  lily: 1.1,
  sunflower: 1.15,
  orchid: 1,
  hydrangea: 1.25,
  dahlia: 1.1,
  delphinium: 0.7,
  ranunculus: 0.9,
  lisianthus: 0.95,
  calla: 0.9,
  gerbera: 1.05,
  chrysanthemum: 1,
  greenery: 1,
  filler: 0.75,
}
const UPRIGHT = new Set<FlowerItem['category']>(['tulip', 'calla', 'delphinium'])

interface Placed {
  key: string
  item: FlowerItem
  x: number
  y: number
  r: number
  rot: number
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5))

/** Deterministic dome layout: big blooms near the centre, greenery around. */
function layoutBouquet(c: Composition): { blooms: Placed[]; greens: Placed[]; R: number } {
  const chosen = chosenFlowers(c)
  const total = chosen.reduce((a, b) => a + b.count, 0)
  const R = 72 + 78 * Math.sqrt(Math.min(total, 40) / 40)

  const greenStems = chosen.filter((f) => f.item.category === 'greenery')
  const bloomGroups = chosen
    .filter((f) => f.item.category !== 'greenery')
    .sort((a, b) => SIZE[b.item.category] - SIZE[a.item.category])
    .map((g) => ({ ...g, left: g.count, used: 0 }))

  // Round-robin so kinds are mixed through the dome.
  const sequence: { item: FlowerItem; idx: number }[] = []
  let remaining = bloomGroups.reduce((a, g) => a + g.left, 0)
  while (remaining > 0) {
    for (const g of bloomGroups) {
      if (g.left > 0) {
        sequence.push({ item: g.item, idx: g.used })
        g.left--
        g.used++
        remaining--
      }
    }
  }

  // Deterministic shuffle so colours are spread out, larger blooms biased to the centre.
  const rand = (key: string) => {
    let h = 2166136261
    for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619)
    return ((h >>> 0) % 1000) / 1000
  }
  sequence.sort((a, b) => {
    const ka = rand(`${a.item.id}${a.idx}`) * 0.75 + (1.25 - SIZE[a.item.category]) * 0.5
    const kb = rand(`${b.item.id}${b.idx}`) * 0.75 + (1.25 - SIZE[b.item.category]) * 0.5
    return ka - kb
  })

  const N = Math.max(sequence.length, 1)
  const base = Math.min(56, Math.max(18, (R * 1.18) / Math.sqrt(N)))
  const blooms = sequence.map(({ item, idx }, i) => {
    const dist = R * 0.84 * Math.sqrt((i + 0.5) / N)
    const angle = i * GOLDEN - Math.PI / 2
    const x = CX + Math.cos(angle) * dist
    const y = CY + Math.sin(angle) * dist * 0.78 - (R - dist) * 0.14
    const rot = UPRIGHT.has(item.category) ? ((x - CX) / R) * 22 : ((i * 53) % 50) - 25
    return { key: `${item.id}-${idx}`, item, x, y, r: base * SIZE[item.category] * (0.94 + ((i * 7) % 5) * 0.03), rot }
  })
  blooms.sort((a, b) => a.y - b.y)

  const greenSeq: { item: FlowerItem; idx: number }[] = []
  for (const g of greenStems) for (let k = 0; k < g.count; k++) greenSeq.push({ item: g.item, idx: k })
  // Interleave the greenery kinds as well.
  greenSeq.sort((a, b) => a.idx - b.idx)
  const G = greenSeq.length
  const greens = greenSeq.map(({ item, idx }, j) => {
    const a = Math.PI * (0.92 + (1.16 * (j + 0.5)) / Math.max(G, 1))
    const x = CX + Math.cos(a) * R * 0.88
    const y = CY + Math.sin(a) * R * 0.72
    return { key: `${item.id}-${idx}`, item, x, y, r: R * 0.4, rot: (a * 180) / Math.PI + 90 }
  })
  return { blooms, greens, R }
}

const VASES: Record<string, { fill: string; stroke: string; opacity: number; shape: 'cylinder' | 'round' }> = {
  'glass-cylinder': { fill: '#e0f2fe', stroke: '#93c5fd', opacity: 0.55, shape: 'cylinder' },
  'ceramic-white': { fill: '#fafaf9', stroke: '#d6d3d1', opacity: 1, shape: 'round' },
  'ceramic-rose': { fill: '#fbcfe8', stroke: '#f472b6', opacity: 1, shape: 'round' },
  'gold-vase': { fill: '#d4a24c', stroke: '#a16207', opacity: 1, shape: 'round' },
}

export default function BouquetPreview({ composition, className }: { composition: Composition; className?: string }) {
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const haloId = `halo-${uid}`
  const goldId = `gold-${uid}`
  const { blooms, greens, R } = useMemo(() => layoutBouquet(composition), [composition])
  const { wrap, vase, count } = pricing(composition)
  const empty = count === 0
  const cello = wrap.id === 'cellophane'
  const paper = wrap.color
  const paperLine = shade(paper, paper === '#1c1917' ? 0.25 : -0.22)
  const ribbon = wrap.id === 'black-luxe' ? '#d4af37' : wrap.id === 'pink-tissue' ? '#be123c' : '#e11d48'
  const v = VASES[vase.id]
  const bundle = Math.min(14, Math.max(4, Math.round(count / 3)))

  const enter = reduce ? false : { scale: 0, opacity: 0 }
  const spring = { type: 'spring' as const, stiffness: 260, damping: 22 }

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={empty ? 'Aperçu du bouquet : vide' : `Aperçu du bouquet : ${count} tiges`}>
        <defs>
          <radialGradient id={haloId} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#fff1f3" />
            <stop offset="100%" stopColor="#fff1f3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={goldId} x1="0" x2="1">
            <stop offset="0%" stopColor="#b8862f" />
            <stop offset="45%" stopColor="#f1d18a" />
            <stop offset="100%" stopColor="#a8741f" />
          </linearGradient>
        </defs>
        <circle cx={CX} cy={CY + 20} r={190} fill={`url(#${haloId})`} />
        <ellipse cx={CX} cy={H - 10} rx={v ? 70 : 90} ry={8} fill="#1c1917" opacity={0.08} />

        {empty ? (
          <g>
            <path
              d={`M${TIE.x} ${TIE.y} L${CX - 120} ${CY + 10} Q${CX - 110} ${CY - 110} ${CX} ${CY - 115} Q${CX + 110} ${CY - 110} ${CX + 120} ${CY + 10} Z`}
              fill="none"
              stroke="#e7a3b3"
              strokeWidth={2}
              strokeDasharray="6 8"
            />
            <path d={`M${TIE.x} ${TIE.y} L${TIE.x} ${H - 30}`} stroke="#e7a3b3" strokeWidth={2} strokeDasharray="6 8" />
          </g>
        ) : (
          <g>
            {/* Stems */}
            <g stroke="#5f7d3a" strokeWidth={2.2} strokeLinecap="round" opacity={0.9}>
              {blooms.map((b) => (
                <line key={b.key} x1={b.x} y1={b.y} x2={TIE.x + (b.x - CX) * 0.06} y2={TIE.y} />
              ))}
              {Array.from({ length: bundle }, (_, j) => {
                const o = j - (bundle - 1) / 2
                return <line key={j} x1={TIE.x + o * 2.4} y1={TIE.y} x2={TIE.x + o * 4.2} y2={H - 22} />
              })}
            </g>

            {/* Back sheet of paper */}
            <path
              d={`M${TIE.x - 14} ${TIE.y + 8} L${CX - R - 30} ${CY - R * 0.22} Q${CX - R * 0.55} ${CY - R * 1.08} ${CX} ${CY - R * 0.86} Q${CX + R * 0.55} ${CY - R * 1.08} ${CX + R + 30} ${CY - R * 0.22} L${TIE.x + 14} ${TIE.y + 8} Z`}
              fill={shade(paper, paper === '#1c1917' ? 0.08 : -0.07)}
              stroke={paperLine}
              strokeWidth={1.5}
              opacity={cello ? 0.45 : 1}
              strokeLinejoin="round"
            />

            {greens.map((g) => (
              <motion.g key={g.key} initial={false} animate={{ x: g.x, y: g.y }} transition={spring}>
                <motion.g initial={enter} animate={{ scale: 1, opacity: 1 }} transition={spring}>
                  <g transform={`rotate(${g.rot.toFixed(1)})`}>
                    <FlowerGlyph category={g.item.category} color={g.item.color} r={g.r} variant={g.item.id} />
                  </g>
                </motion.g>
              </motion.g>
            ))}

            {blooms.map((b) => (
              <motion.g key={b.key} initial={false} animate={{ x: b.x, y: b.y }} transition={spring}>
                <motion.g initial={enter} animate={{ scale: 1, opacity: 1 }} transition={spring}>
                  <g transform={`rotate(${b.rot.toFixed(1)})`}>
                    <FlowerGlyph category={b.item.category} color={b.item.color} r={b.r} variant={b.item.id} />
                  </g>
                </motion.g>
              </motion.g>
            ))}

            {/* Front sheet of paper */}
            <path
              d={`M${TIE.x - 18} ${TIE.y + 12} L${CX - R * 0.98} ${CY + R * 0.42} Q${CX - R * 0.45} ${CY + R * 0.64} ${CX} ${CY + R * 0.56} Q${CX + R * 0.45} ${CY + R * 0.64} ${CX + R * 0.98} ${CY + R * 0.42} L${TIE.x + 18} ${TIE.y + 12} Z`}
              fill={paper}
              stroke={paperLine}
              strokeWidth={1.5}
              opacity={cello ? 0.5 : 1}
              strokeLinejoin="round"
            />
            <path d={`M${TIE.x - 6} ${TIE.y + 6} L${CX - R * 0.22} ${CY + R * 0.59}`} stroke={paperLine} strokeWidth={1.2} opacity={0.6} fill="none" />
            <path d={`M${TIE.x + 6} ${TIE.y + 6} L${CX + R * 0.5} ${CY + R * 0.57}`} stroke={paperLine} strokeWidth={1.2} opacity={0.45} fill="none" />

            {v &&
              (v.shape === 'cylinder' ? (
                <g>
                  <rect x={TIE.x - 42} y={TIE.y - 2} width={84} height={H - 18 - TIE.y} rx={10} fill={v.fill} stroke={v.stroke} strokeWidth={2} opacity={v.opacity} />
                  <path d={`M${TIE.x - 40} ${TIE.y + 40} Q${TIE.x} ${TIE.y + 46} ${TIE.x + 40} ${TIE.y + 40}`} stroke={v.stroke} strokeWidth={1.5} fill="none" opacity={0.8} />
                </g>
              ) : (
                <path
                  d={`M${TIE.x - 34} ${TIE.y - 2} C${TIE.x - 34} ${TIE.y + 22} ${TIE.x - 72} ${TIE.y + 48} ${TIE.x - 60} ${TIE.y + 92} C${TIE.x - 52} ${H - 22} ${TIE.x - 30} ${H - 16} ${TIE.x} ${H - 16} C${TIE.x + 30} ${H - 16} ${TIE.x + 52} ${H - 22} ${TIE.x + 60} ${TIE.y + 92} C${TIE.x + 72} ${TIE.y + 48} ${TIE.x + 34} ${TIE.y + 22} ${TIE.x + 34} ${TIE.y - 2} Z`}
                  fill={vase.id === 'gold-vase' ? `url(#${goldId})` : v.fill}
                  stroke={v.stroke}
                  strokeWidth={2}
                />
              ))}

            {/* Ribbon */}
            <g transform={`translate(${TIE.x} ${TIE.y + 4})`}>
              <path d="M-4 0 L-16 34 L-8 31 L-4 38 Z M4 0 L14 33 L6 31 L3 38 Z" fill={shade(ribbon, -0.12)} />
              <ellipse cx={-15} cy={-4} rx={16} ry={8} transform="rotate(-18 -15 -4)" fill={ribbon} stroke={shade(ribbon, -0.3)} strokeWidth={1.2} />
              <ellipse cx={15} cy={-4} rx={16} ry={8} transform="rotate(18 15 -4)" fill={ribbon} stroke={shade(ribbon, -0.3)} strokeWidth={1.2} />
              <rect x={-6} y={-9} width={12} height={11} rx={3} fill={shade(ribbon, -0.08)} stroke={shade(ribbon, -0.3)} strokeWidth={1.2} />
            </g>
          </g>
        )}
      </svg>
      {empty && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <Flower2 className="h-8 w-8 text-brand-500" aria-hidden />
          <p className="mt-3 font-serif text-xl text-ink">Votre bouquet prendra forme ici</p>
          <p className="mt-1 text-sm text-muted-foreground">Ajoutez des tiges ou partez d’une palette.</p>
        </div>
      )}
    </div>
  )
}
