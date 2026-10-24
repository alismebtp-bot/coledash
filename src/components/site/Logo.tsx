import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function Logo({ className, tone = 'dark', to = '/' }: { className?: string; tone?: 'dark' | 'light'; to?: string }) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2 rounded-lg', className)} aria-label="ColeDash, accueil">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-display text-lg font-extrabold text-white shadow-sm">
        C
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-300" />
      </span>
      <span className={cn('font-display text-xl font-extrabold tracking-tight', tone === 'light' ? 'text-white' : 'text-ink')}>
        ColeDash
      </span>
    </Link>
  )
}
