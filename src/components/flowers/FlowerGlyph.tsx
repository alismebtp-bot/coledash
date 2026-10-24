import type { ReactNode } from 'react'
import type { FlowerItem } from '@/data/flowerCatalog'
import { isPale, mix, shade } from './color'
import { cn } from '@/lib/utils'

type Category = FlowerItem['category']

interface GlyphProps {
  category: Category
  color: string
  /** Radius of the bloom in the parent SVG's units. */
  r: number
  /** Item id, used for a few variants (eucalyptus vs ruscus…). */
  variant?: string
}

const n = (v: number) => Math.round(v * 100) / 100

/** Teardrop petal pointing up (towards -y), from the origin. */
function petal(length: number, width: number): string {
  const L = n(length)
  const w = n(width)
  return `M0 0 C${w} ${n(-L * 0.25)} ${w} ${n(-L * 0.8)} 0 ${-L} C${-w} ${n(-L * 0.8)} ${-w} ${n(-L * 0.25)} 0 0Z`
}

function ring(count: number, offset: number, render: (angle: number, i: number) => ReactNode) {
  return Array.from({ length: count }, (_, i) => render(offset + (360 / count) * i, i))
}

function spiral(r: number, turns: number): string {
  const pts: string[] = []
  const steps = Math.round(turns * 18)
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * turns * Math.PI * 2
    const d = r * (0.08 + 0.92 * t)
    pts.push(`${n(Math.cos(a) * d)} ${n(Math.sin(a) * d)}`)
  }
  return `M${pts.join(' L')}`
}

/**
 * Stylised bloom drawn around (0, 0). Meant to be placed inside a parent
 * <svg> with a transform. Every category has its own silhouette.
 */
export function FlowerGlyph({ category, color, r, variant }: GlyphProps) {
  const pale = isPale(color)
  const line = shade(color, pale ? -0.32 : -0.38)
  const deep = shade(color, -0.18)
  const light = shade(color, 0.35)
  const sw = n(Math.max(0.6, r * 0.045))
  const common = { stroke: line, strokeWidth: sw, strokeLinejoin: 'round' as const }

  switch (category) {
    case 'rose':
      return (
        <g>
          {ring(6, 15, (a) => (
            <circle key={a} cx={n(Math.cos((a * Math.PI) / 180) * r * 0.55)} cy={n(Math.sin((a * Math.PI) / 180) * r * 0.55)} r={n(r * 0.45)} fill={deep} {...common} />
          ))}
          <circle r={n(r * 0.72)} fill={color} {...common} />
          <path d={spiral(r * 0.62, 2.6)} fill="none" stroke={line} strokeWidth={n(sw * 1.3)} strokeLinecap="round" />
        </g>
      )
    case 'ranunculus':
      return (
        <g>
          {[1, 0.8, 0.6, 0.42, 0.25].map((k, i) => (
            <circle key={k} r={n(r * k)} fill={i % 2 ? light : color} {...common} />
          ))}
          <circle r={n(r * 0.1)} fill={mix(line, '#3f6212', 0.5)} />
        </g>
      )
    case 'peony':
      return (
        <g>
          {ring(10, 0, (a) => (
            <ellipse key={a} cx={0} cy={n(-r * 0.55)} rx={n(r * 0.42)} ry={n(r * 0.36)} transform={`rotate(${a})`} fill={deep} {...common} />
          ))}
          {ring(8, 20, (a) => (
            <ellipse key={a} cx={0} cy={n(-r * 0.32)} rx={n(r * 0.32)} ry={n(r * 0.26)} transform={`rotate(${a})`} fill={color} {...common} />
          ))}
          {ring(5, 10, (a) => (
            <ellipse key={a} cx={0} cy={n(-r * 0.13)} rx={n(r * 0.2)} ry={n(r * 0.16)} transform={`rotate(${a})`} fill={light} {...common} />
          ))}
        </g>
      )
    case 'tulip':
      return (
        <g>
          <path
            d={`M${n(-r * 0.62)} ${n(-r * 0.2)} Q${n(-r * 0.7)} ${n(r * 0.75)} 0 ${n(r * 0.8)} Q${n(r * 0.7)} ${n(r * 0.75)} ${n(r * 0.62)} ${n(-r * 0.2)} L${n(r * 0.36)} ${n(-r * 0.62)} L${n(r * 0.18)} ${n(-r * 0.1)} L0 ${n(-r * 0.8)} L${n(-r * 0.18)} ${n(-r * 0.1)} L${n(-r * 0.36)} ${n(-r * 0.62)} Z`}
            fill={color}
            {...common}
          />
          <path d={`M${n(-r * 0.3)} ${n(r * 0.75)} Q0 ${n(-r * 0.2)} 0 ${n(-r * 0.75)} Q0 ${n(-r * 0.2)} ${n(r * 0.3)} ${n(r * 0.75)}`} fill={deep} {...common} />
        </g>
      )
    case 'lily':
      return (
        <g>
          {ring(6, 0, (a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d={petal(r, r * 0.34)} fill={color} {...common} />
              <path d={`M0 ${n(-r * 0.15)} L0 ${n(-r * 0.75)}`} stroke={shade(color === '#fefce8' ? '#e879f9' : color, -0.25)} strokeWidth={sw} strokeLinecap="round" opacity={0.7} />
            </g>
          ))}
          {ring(6, 30, (a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d={`M0 0 L0 ${n(-r * 0.45)}`} stroke="#65a30d" strokeWidth={sw} />
              <ellipse cx={0} cy={n(-r * 0.48)} rx={n(r * 0.05)} ry={n(r * 0.1)} fill="#b45309" />
            </g>
          ))}
        </g>
      )
    case 'sunflower':
      return (
        <g>
          {ring(18, 10, (a) => (
            <path key={`b${a}`} d={petal(r, r * 0.2)} transform={`rotate(${a})`} fill={deep} {...common} />
          ))}
          {ring(18, 0, (a) => (
            <path key={a} d={petal(r * 0.92, r * 0.2)} transform={`rotate(${a})`} fill="#fbbf24" {...common} />
          ))}
          <circle r={n(r * 0.46)} fill="#5b3716" stroke="#3b2410" strokeWidth={sw} />
          {ring(12, 0, (a) => (
            <circle key={a} cx={n(Math.cos((a * Math.PI) / 180) * r * 0.28)} cy={n(Math.sin((a * Math.PI) / 180) * r * 0.28)} r={n(r * 0.05)} fill="#8a5a2b" />
          ))}
        </g>
      )
    case 'gerbera':
      return (
        <g>
          {ring(22, 0, (a) => (
            <path key={a} d={petal(r, r * 0.13)} transform={`rotate(${a})`} fill={color} {...common} />
          ))}
          {ring(18, 9, (a) => (
            <path key={a} d={petal(r * 0.62, r * 0.1)} transform={`rotate(${a})`} fill={light} {...common} />
          ))}
          <circle r={n(r * 0.26)} fill="#facc15" stroke="#a16207" strokeWidth={sw} />
          <circle r={n(r * 0.14)} fill="#3f3f1f" />
        </g>
      )
    case 'chrysanthemum':
      return (
        <g>
          {[
            [24, 1, 0.12, 0],
            [18, 0.74, 0.11, 7],
            [12, 0.48, 0.1, 3],
          ].map(([count, len, w, off], idx) =>
            ring(count, off, (a) => (
              <path key={`${idx}-${a}`} d={petal(r * len, r * w)} transform={`rotate(${a})`} fill={idx === 1 ? light : color} {...common} />
            )),
          )}
          <circle r={n(r * 0.12)} fill={mix(color, '#a3e635', 0.4)} {...common} />
        </g>
      )
    case 'dahlia':
      return (
        <g>
          {[
            [12, 1, 0.3, 0],
            [10, 0.74, 0.26, 18],
            [8, 0.5, 0.2, 8],
            [6, 0.28, 0.14, 30],
          ].map(([count, len, w, off], idx) =>
            ring(count, off, (a) => (
              <path key={`${idx}-${a}`} d={petal(r * len, r * w)} transform={`rotate(${a})`} fill={idx % 2 ? light : idx === 0 ? deep : color} {...common} />
            )),
          )}
        </g>
      )
    case 'hydrangea': {
      const florets: [number, number][] = [[0, 0]]
      ring(6, 0, (a) => florets.push([Math.cos((a * Math.PI) / 180) * r * 0.42, Math.sin((a * Math.PI) / 180) * r * 0.42]))
      ring(11, 15, (a) => florets.push([Math.cos((a * Math.PI) / 180) * r * 0.8, Math.sin((a * Math.PI) / 180) * r * 0.8]))
      return (
        <g>
          <circle r={n(r * 0.95)} fill={deep} opacity={0.5} />
          {florets.map(([x, y], i) => (
            <g key={i} transform={`translate(${n(x)} ${n(y)}) rotate(${(i * 37) % 90})`}>
              {[0, 90, 180, 270].map((a) => (
                <ellipse key={a} cx={0} cy={n(-r * 0.1)} rx={n(r * 0.1)} ry={n(r * 0.12)} transform={`rotate(${a})`} fill={i % 3 ? color : light} {...common} strokeWidth={n(sw * 0.7)} />
              ))}
              <circle r={n(r * 0.03)} fill={line} />
            </g>
          ))}
        </g>
      )
    }
    case 'delphinium':
      return (
        <g>
          <path d={`M0 ${n(r)} L0 ${n(-r * 1.5)}`} stroke="#4d7c0f" strokeWidth={n(sw * 1.4)} strokeLinecap="round" />
          {Array.from({ length: 7 }, (_, i) => {
            const y = r * 0.8 - i * r * 0.36
            const s = r * (0.36 - i * 0.032)
            const x = (i % 2 ? 1 : -1) * r * 0.08
            return (
              <g key={i} transform={`translate(${n(x)} ${n(y)})`}>
                {ring(5, i * 12, (a) => (
                  <path key={a} d={petal(s, s * 0.45)} transform={`rotate(${a})`} fill={i % 2 ? color : light} {...common} strokeWidth={n(sw * 0.8)} />
                ))}
                <circle r={n(s * 0.18)} fill={shade(color, -0.5)} />
              </g>
            )
          })}
        </g>
      )
    case 'orchid':
      return (
        <g>
          {[0, 125, 235].map((a) => (
            <ellipse key={a} cx={0} cy={n(-r * 0.55)} rx={n(r * 0.2)} ry={n(r * 0.48)} transform={`rotate(${a})`} fill={color} {...common} />
          ))}
          {[-62, 62].map((a) => (
            <ellipse key={a} cx={0} cy={n(-r * 0.45)} rx={n(r * 0.38)} ry={n(r * 0.44)} transform={`rotate(${a})`} fill={light} {...common} />
          ))}
          <path d={`M${n(-r * 0.22)} ${n(r * 0.05)} Q0 ${n(r * 0.75)} ${n(r * 0.22)} ${n(r * 0.05)} Q0 ${n(r * 0.18)} ${n(-r * 0.22)} ${n(r * 0.05)}Z`} fill="#c026d3" stroke="#86198f" strokeWidth={sw} />
          <circle r={n(r * 0.09)} fill="#fde047" stroke="#a16207" strokeWidth={n(sw * 0.6)} />
        </g>
      )
    case 'lisianthus':
      return (
        <g>
          {ring(5, 0, (a) => (
            <circle key={a} cx={n(Math.cos((a * Math.PI) / 180) * r * 0.4)} cy={n(Math.sin((a * Math.PI) / 180) * r * 0.4)} r={n(r * 0.55)} fill={color} {...common} />
          ))}
          <circle r={n(r * 0.36)} fill={light} {...common} />
          <circle r={n(r * 0.12)} fill={shade(color, -0.45)} />
        </g>
      )
    case 'calla':
      return (
        <g>
          <path
            d={`M0 ${n(r * 0.95)} C${n(-r * 0.75)} ${n(r * 0.2)} ${n(-r * 0.62)} ${n(-r * 0.75)} ${n(r * 0.05)} ${n(-r)} C${n(r * 0.5)} ${n(-r * 0.9)} ${n(r * 0.8)} ${n(-r * 0.2)} 0 ${n(r * 0.95)}Z`}
            fill={color}
            {...common}
          />
          <path d={`M${n(r * 0.05)} ${n(-r)} C${n(-r * 0.25)} ${n(-r * 0.55)} ${n(-r * 0.1)} ${n(r * 0.1)} 0 ${n(r * 0.95)}`} fill="none" stroke={line} strokeWidth={sw} />
          <ellipse cx={n(r * 0.08)} cy={n(-r * 0.15)} rx={n(r * 0.08)} ry={n(r * 0.42)} fill="#facc15" stroke="#a16207" strokeWidth={n(sw * 0.6)} />
        </g>
      )
    case 'greenery': {
      const leaf = mix(color, '#3f6212', 0.55)
      const leafLine = shade(leaf, -0.3)
      const round = variant === 'eucalyptus'
      const pairs = 5
      return (
        <g>
          <path d={`M0 ${n(r)} Q${n(r * 0.15)} 0 0 ${n(-r * 1.25)}`} stroke={leafLine} strokeWidth={n(sw * 1.3)} fill="none" strokeLinecap="round" />
          {Array.from({ length: pairs }, (_, i) => {
            const y = r * 0.7 - i * r * 0.42
            const s = r * (0.42 - i * 0.04)
            return [-1, 1].map((side) => (
              <g key={`${i}${side}`} transform={`translate(0 ${n(y)}) rotate(${side * (round ? 70 : 52)})`}>
                {round ? (
                  <ellipse cx={0} cy={n(-s * 0.85)} rx={n(s * 0.62)} ry={n(s * 0.7)} fill={mix(leaf, '#94a3b8', 0.35)} stroke={leafLine} strokeWidth={sw} />
                ) : (
                  <path d={petal(s * 1.5, s * 0.38)} fill={leaf} stroke={leafLine} strokeWidth={sw} />
                )}
              </g>
            ))
          })}
          {round ? (
            <ellipse cx={0} cy={n(-r * 1.25)} rx={n(r * 0.22)} ry={n(r * 0.26)} fill={mix(leaf, '#94a3b8', 0.35)} stroke={leafLine} strokeWidth={sw} />
          ) : (
            <path d={petal(r * 0.55, r * 0.16)} transform={`translate(0 ${n(-r * 1.1)})`} fill={leaf} stroke={leafLine} strokeWidth={sw} />
          )}
        </g>
      )
    }
    case 'filler': {
      const dots: [number, number][] = [
        [0, 0],
        [0.55, -0.2],
        [-0.5, -0.35],
        [0.2, -0.7],
        [-0.25, 0.45],
        [0.6, 0.4],
        [-0.7, 0.2],
        [0.05, 0.85],
        [-0.15, -1],
      ]
      return (
        <g>
          {dots.map(([x, y], i) => (
            <path key={`s${i}`} d={`M0 ${n(r * 1.1)} Q${n(x * r * 0.3)} ${n(r * 0.4)} ${n(x * r)} ${n(y * r)}`} stroke="#84a98c" strokeWidth={n(sw * 0.8)} fill="none" />
          ))}
          {dots.map(([x, y], i) => (
            <g key={i} transform={`translate(${n(x * r)} ${n(y * r)})`}>
              {ring(5, i * 20, (a) => (
                <circle key={a} cx={n(Math.cos((a * Math.PI) / 180) * r * 0.1)} cy={n(Math.sin((a * Math.PI) / 180) * r * 0.1)} r={n(r * 0.09)} fill={color} stroke={line} strokeWidth={n(sw * 0.6)} />
              ))}
              <circle r={n(r * 0.05)} fill={variant === 'waxflower' ? '#be185d' : '#d6d3d1'} />
            </g>
          ))}
        </g>
      )
    }
  }
}

/** Standalone square illustration of one flower (for catalogue tiles). */
export function FlowerIcon({ item, className, title }: { item: Pick<FlowerItem, 'category' | 'color' | 'id'>; className?: string; title?: string }) {
  const tall = item.category === 'delphinium' || item.category === 'greenery'
  return (
    <svg viewBox={tall ? '-52 -70 104 124' : '-52 -52 104 104'} className={cn('h-full w-full', className)} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <FlowerGlyph category={item.category} color={item.color} r={tall ? 38 : 44} variant={item.id} />
    </svg>
  )
}
