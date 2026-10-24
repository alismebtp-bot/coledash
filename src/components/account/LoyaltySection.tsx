import { Award, Crown, Gift, Medal, Truck } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

const TIERS = [
  { name: 'Bronze', min: 0, icon: Medal, color: 'text-amber-700 bg-amber-100', perks: ['1 point par euro dépensé', 'Offres d’anniversaire'] },
  { name: 'Argent', min: 500, icon: Award, color: 'text-slate-600 bg-slate-100', perks: ['Livraison offerte une fois par mois', 'Accès anticipé aux nouveautés'] },
  { name: 'Or', min: 1500, icon: Crown, color: 'text-yellow-700 bg-yellow-100', perks: ['Livraison offerte illimitée', 'Service client prioritaire', 'Surprises chez nos partenaires'] },
]

export default function LoyaltySection({ points }: { points: number }) {
  const index = TIERS.reduce((acc, t, i) => (points >= t.min ? i : acc), 0)
  const tier = TIERS[index]
  const nextTier = TIERS[index + 1]
  const progress = nextTier ? ((points - tier.min) / (nextTier.min - tier.min)) * 100 : 100
  const euros = Math.floor(points / 100)

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl bg-ink p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/70">Vos points ColeDash</p>
            <p className="font-display text-4xl font-extrabold tabular-nums">{formatNumber(points)}</p>
            <p className="mt-1 text-sm text-white/70">Soit {euros} € de réduction disponibles</p>
          </div>
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold', tier.color)}>
            <tier.icon className="h-4 w-4" aria-hidden /> Niveau {tier.name}
          </span>
        </div>
        <div className="mt-6">
          <Progress value={progress} className="h-2 bg-white/15 [&>div]:bg-brand-500" aria-label="Progression vers le niveau suivant" />
          <p className="mt-2 text-sm text-white/80">
            {nextTier
              ? `Plus que ${formatNumber(nextTier.min - points)} points pour atteindre le niveau ${nextTier.name}.`
              : 'Vous avez atteint le niveau maximal. Merci pour votre fidélité !'}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <div key={t.name} className={cn('rounded-2xl border bg-background p-4', i === index && 'border-ink ring-1 ring-ink')}>
            <div className="flex items-center justify-between">
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold', t.color)}>
                <t.icon className="h-3.5 w-3.5" aria-hidden /> {t.name}
              </span>
              <span className="text-xs text-muted-foreground">dès {formatNumber(t.min)} pts</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-ink">
              {t.perks.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-600" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-background p-5">
        <h3 className="font-semibold text-ink">Comment ça marche ?</h3>
        <ul className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
          <li className="flex gap-3">
            <Truck className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
            <span>Chaque commande livrée vous rapporte 1 point par euro dépensé.</span>
          </li>
          <li className="flex gap-3">
            <Gift className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
            <span>100 points = 1 € de réduction, utilisable dès 500 points cumulés.</span>
          </li>
          <li className="flex gap-3">
            <Crown className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
            <span>Vos points restent valables 12 mois après votre dernière commande.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
