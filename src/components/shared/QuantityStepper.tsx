import { Minus, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
  label?: string
}

export default function QuantityStepper({ value, onChange, min = 0, max = 99, size = 'md', className, label = 'Quantité' }: Props) {
  const btn = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const showTrash = min === 0 && value === 1
  return (
    <div
      className={cn('inline-flex items-center rounded-full border bg-card p-0.5 shadow-sm', className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn(btn, 'flex items-center justify-center rounded-full text-ink transition-colors hover:bg-muted disabled:opacity-40')}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={showTrash ? 'Retirer' : 'Diminuer'}
      >
        {showTrash ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
      </button>
      <span className={cn('min-w-[2ch] text-center font-semibold tabular-nums', size === 'sm' ? 'text-sm' : 'text-base')} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cn(btn, 'flex items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-ink/85 disabled:opacity-40')}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
