import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { flowerCatalog } from '@/data/flowerCatalog'
import { cn } from '@/lib/utils'
import { FlowerGlyph } from './FlowerGlyph'

const DECOR = ['peony-pink', 'rose-red', 'ranunculus-pink', 'eucalyptus', 'tulip-yellow', 'lisianthus-purple', 'rose-white']
const SPOTS: [number, number, number, number][] = [
  [150, 120, 52, -10],
  [90, 160, 40, 20],
  [215, 165, 42, 8],
  [60, 90, 46, -40],
  [235, 85, 36, 12],
  [140, 205, 34, -6],
  [170, 60, 30, 18],
]

export default function AtelierCta({ compact = false, className }: { compact?: boolean; className?: string }) {
  const items = DECOR.map((id) => flowerCatalog.find((f) => f.id === id)).filter((f): f is (typeof flowerCatalog)[number] => !!f)
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[2rem] bg-[#3f2a2e] text-white',
        compact ? 'p-6 pb-48 sm:p-8 sm:pr-72' : 'p-8 pb-64 sm:p-12 sm:pb-72 lg:pb-12 lg:pr-[26rem]',
        className,
      )}
    >
      <div className="relative z-10 max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f5c6cf]">L’atelier ColeDash</p>
        <h2 className={cn('mt-2 font-serif font-semibold leading-tight text-white', compact ? 'text-3xl' : 'text-4xl sm:text-5xl')}>
          Composez votre bouquet, tige par tige.
        </h2>
        <p className="mt-3 text-white/75">
          Choisissez parmi {flowerCatalog.length} variétés de saison, l’emballage, le vase et votre mot doux. Votre fleuriste de quartier s’occupe du reste.
        </p>
        <Link
          to="/fleurs/atelier"
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#3f2a2e] transition-transform hover:-translate-y-0.5"
        >
          Ouvrir l’atelier
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <svg
        viewBox="0 0 300 260"
        className={cn('pointer-events-none absolute opacity-90', compact ? '-bottom-16 -right-16 h-64 w-72 sm:right-0' : '-bottom-10 -right-16 h-72 w-80 sm:right-4 lg:h-96 lg:w-[26rem]')}
        aria-hidden
      >
        <circle cx={150} cy={140} r={120} fill="#ffffff" opacity={0.06} />
        {items.map((f, i) => {
          const [x, y, r, rot] = SPOTS[i]
          return (
            <g key={f.id} transform={`translate(${x} ${y}) rotate(${rot})`}>
              <FlowerGlyph category={f.category} color={f.color} r={r} variant={f.id} />
            </g>
          )
        })}
      </svg>
    </section>
  )
}
