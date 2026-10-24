import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  step: number
  title: string
  done?: boolean
  invalid?: boolean
  aside?: ReactNode
  children: ReactNode
}

export default function CheckoutSection({ id, step, title, done, invalid, aside, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        'scroll-mt-24 rounded-2xl border bg-card p-4 shadow-soft transition-colors sm:p-6',
        invalid && 'border-destructive/60 ring-2 ring-destructive/15',
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            done ? 'bg-emerald-600 text-white' : 'bg-ink text-white',
          )}
          aria-hidden
        >
          {done ? <Check className="h-4 w-4" /> : step}
        </span>
        <h2 id={`${id}-title`} className="flex-1 text-lg font-semibold text-ink">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

/** Selectable tile used as a radio option. */
export function OptionTile({
  selected,
  onSelect,
  children,
  className,
  disabled,
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'relative rounded-xl border bg-background p-3 text-left transition-all hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-50',
        selected && 'border-ink bg-card ring-1 ring-ink',
        className,
      )}
    >
      {children}
    </button>
  )
}
