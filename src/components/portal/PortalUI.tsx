import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PortalPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  className,
}: {
  label: string
  value: ReactNode
  /** Percentage change vs previous period, e.g. 12.5 or -3 */
  delta?: number
  icon?: LucideIcon
  hint?: string
  className?: string
}) {
  const up = (delta ?? 0) >= 0
  return (
    <div className={cn('rounded-2xl border bg-card p-5 shadow-soft', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-ink">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-ink sm:text-3xl">{value}</p>
      {(delta !== undefined || hint) && (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {delta !== undefined && (
            <span className={cn('inline-flex items-center gap-0.5 font-semibold', up ? 'text-emerald-600' : 'text-red-600')}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {up ? '+' : ''}
              {delta.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %
            </span>
          )}
          {hint}
        </p>
      )}
    </div>
  )
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border bg-card shadow-soft', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
          {title && <h2 className="font-sans text-base font-semibold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

const TONES = {
  neutral: 'bg-stone-100 text-stone-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-800',
  brand: 'bg-brand-50 text-brand-700',
} as const

export type Tone = keyof typeof TONES

export function StatusPill({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', TONES[tone])}>{children}</span>
}
