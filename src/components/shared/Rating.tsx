import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'

export function RatingBadge({ rating, count, className }: { rating: number; count?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-semibold text-ink', className)}>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
      {rating.toFixed(1)}
      {count !== undefined && <span className="font-normal text-muted-foreground">({formatNumber(count)})</span>}
      <span className="sr-only">sur 5</span>
    </span>
  )
}

export function StarRating({
  value,
  onChange,
  size = 'md',
}: {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const px = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-7 w-7' }[size]
  return (
    <div className="inline-flex items-center gap-0.5" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <Star
            className={cn(px, n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-stone-300')}
            aria-hidden
          />
        )
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n)}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        )
      })}
    </div>
  )
}
