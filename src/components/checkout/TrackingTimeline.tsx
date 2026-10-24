import { Check } from 'lucide-react'
import { ORDER_STEPS } from '@/store/orders'
import { formatTime } from '@/lib/format'
import type { OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  status: OrderStatus
  start: number
}

export default function TrackingTimeline({ status, start }: Props) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.status === status)
  return (
    <ol className="relative space-y-0">
      {ORDER_STEPS.map((step, i) => {
        const done = status !== 'cancelled' && i < currentIndex
        const current = status !== 'cancelled' && i === currentIndex
        const isLast = i === ORDER_STEPS.length - 1
        const at = start + step.at * 60000
        return (
          <li key={step.status} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                className={cn('absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5', done ? 'bg-emerald-500' : 'bg-border')}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                done && 'border-emerald-500 bg-emerald-500 text-white',
                current && (isLast ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-brand-600 bg-white'),
                !done && !current && 'border-border bg-card',
              )}
              aria-hidden
            >
              {done || (current && isLast) ? (
                <Check className="h-3.5 w-3.5" />
              ) : current ? (
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-600" />
              ) : null}
            </span>
            <div className="flex flex-1 items-baseline justify-between gap-2">
              <p className={cn('text-sm', current ? 'font-semibold text-ink' : done ? 'text-ink' : 'text-muted-foreground')}>
                {step.label}
                {current && !isLast && <span className="sr-only"> (étape en cours)</span>}
              </p>
              <span className="text-xs tabular-nums text-muted-foreground">
                {done || current ? formatTime(at) : `vers ${formatTime(at)}`}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
