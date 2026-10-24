import { Flame } from 'lucide-react'
import { DEMAND_LABELS, type DemandLevel, type DemandZone } from '@/data/portals/driver'
import { cn } from '@/lib/utils'

const DEMAND_STYLES: Record<DemandLevel, string> = {
  faible: 'bg-stone-100 text-stone-600 border-stone-200',
  normale: 'bg-amber-50 text-amber-800 border-amber-200',
  forte: 'bg-orange-100 text-orange-800 border-orange-200',
  tres_forte: 'bg-brand-600 text-white border-brand-600',
}

export function DemandBadge({ level, className }: { level: DemandLevel; className?: string }) {
  const hot = level === 'forte' || level === 'tres_forte'
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold', DEMAND_STYLES[level], className)}>
      {hot && <Flame className="h-3 w-3" aria-hidden />}
      {DEMAND_LABELS[level]}
    </span>
  )
}

export default function DemandChips({ zones }: { zones: DemandZone[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {zones.map((z) => (
        <li key={z.id} className={cn('flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5', DEMAND_STYLES[z.level])}>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{z.name}</p>
            <p className="text-xs opacity-80">
              {DEMAND_LABELS[z.level]} · attente ~{z.waitMinutes} min
            </p>
          </div>
          {z.boost ? (
            <span className="shrink-0 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-brand-700">×{z.boost.toLocaleString('fr-FR')}</span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
