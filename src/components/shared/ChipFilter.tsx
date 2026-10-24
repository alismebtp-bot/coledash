import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Chip {
  id: string
  label: string
  icon?: LucideIcon
  count?: number
}

interface Props {
  chips: Chip[]
  value: string
  onChange: (id: string) => void
  className?: string
  label?: string
}

/** Horizontally scrollable single-select pill group. */
export default function ChipFilter({ chips, value, onChange, className, label = 'Filtrer' }: Props) {
  return (
    <div className={cn('-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0', className)}>
      <div className="flex w-max gap-2" role="radiogroup" aria-label={label}>
        {chips.map((chip) => {
          const active = chip.id === value
          return (
            <button
              key={chip.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(chip.id)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors',
                active ? 'border-ink bg-ink text-white' : 'border-border bg-card text-ink hover:border-ink/40',
              )}
            >
              {chip.icon && <chip.icon className="h-4 w-4" aria-hidden />}
              {chip.label}
              {chip.count !== undefined && (
                <span className={cn('text-xs', active ? 'text-white/70' : 'text-muted-foreground')}>{chip.count}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
