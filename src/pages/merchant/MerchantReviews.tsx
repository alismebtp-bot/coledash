import { useMemo, useState } from 'react'
import { MessageSquareText, Star } from 'lucide-react'
import { Panel, PortalPageHeader } from '@/components/portal/PortalUI'
import ChipFilter from '@/components/shared/ChipFilter'
import EmptyState from '@/components/shared/EmptyState'
import { StarRating } from '@/components/shared/Rating'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ReviewCard from '@/components/merchant/ReviewCard'
import { formatNumber, pluralize } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useMerchant } from '@/store/merchant'

type ReplyFilter = 'all' | 'unanswered' | 'answered'
type Sort = 'recent' | 'lowest' | 'helpful'

export default function MerchantReviews() {
  const reviews = useMerchant((s) => s.reviews)
  const [rating, setRating] = useState<number | null>(null)
  const [reply, setReply] = useState<ReplyFilter>('all')
  const [sort, setSort] = useState<Sort>('recent')

  const stats = useMemo(() => {
    const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }))
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)
    const answered = reviews.filter((r) => r.reply).length
    return { dist, avg, answered, unanswered: reviews.length - answered }
  }, [reviews])

  const list = useMemo(() => {
    const filtered = reviews.filter(
      (r) => (rating === null || r.rating === rating) && (reply === 'all' || (reply === 'answered' ? !!r.reply : !r.reply)),
    )
    return [...filtered].sort((a, b) =>
      sort === 'recent' ? b.date.localeCompare(a.date) : sort === 'lowest' ? a.rating - b.rating || b.date.localeCompare(a.date) : b.helpful - a.helpful,
    )
  }, [reviews, rating, reply, sort])

  const maxCount = Math.max(...stats.dist.map((d) => d.count), 1)
  const responseRate = reviews.length ? Math.round((stats.answered / reviews.length) * 100) : 0

  return (
    <div>
      <PortalPageHeader title="Avis clients" description="Répondez rapidement : un avis traité sous 24 h améliore la fidélité de vos clients." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Panel>
            <div className="flex items-end gap-3">
              <p className="font-display text-5xl font-bold tabular-nums text-ink">{stats.avg.toLocaleString('fr-FR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</p>
              <div className="pb-1.5">
                <StarRating value={stats.avg} size="sm" />
                <p className="text-xs text-muted-foreground">{pluralize(reviews.length, 'avis', 'avis')} récents</p>
              </div>
            </div>
            <ul className="mt-5 space-y-1.5">
              {stats.dist.map((d) => (
                <li key={d.n}>
                  <button
                    type="button"
                    onClick={() => setRating(rating === d.n ? null : d.n)}
                    aria-pressed={rating === d.n}
                    className={cn('flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-secondary', rating === d.n && 'bg-secondary')}
                  >
                    <span className="flex w-7 items-center gap-0.5 tabular-nums text-ink">
                      {d.n} <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span className="block h-full rounded-full bg-amber-400" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                    </span>
                    <span className="w-6 text-right text-xs tabular-nums text-muted-foreground">{d.count}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Taux de réponse</p>
                <p className="font-display text-xl font-bold tabular-nums text-ink">{responseRate} %</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sans réponse</p>
                <p className={cn('font-display text-xl font-bold tabular-nums', stats.unanswered ? 'text-brand-700' : 'text-ink')}>
                  {formatNumber(stats.unanswered)}
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ChipFilter
              label="Filtrer par réponse"
              value={reply}
              onChange={(v) => setReply(v as ReplyFilter)}
              chips={[
                { id: 'all', label: 'Tous', count: reviews.length },
                { id: 'unanswered', label: 'Sans réponse', count: stats.unanswered },
                { id: 'answered', label: 'Répondus', count: stats.answered },
              ]}
            />
            <div className="flex items-center gap-2">
              <Select value={rating === null ? 'all' : String(rating)} onValueChange={(v) => setRating(v === 'all' ? null : Number(v))}>
                <SelectTrigger className="w-36 bg-card" aria-label="Filtrer par note">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} étoile{n > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger className="w-40 bg-card" aria-label="Trier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="lowest">Notes les plus basses</SelectItem>
                  <SelectItem value="helpful">Plus utiles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {list.length === 0 ? (
            <EmptyState icon={MessageSquareText} title="Aucun avis" description="Aucun avis ne correspond à ces filtres." />
          ) : (
            <div className="space-y-4">
              {list.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
