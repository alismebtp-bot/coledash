import { useMemo, useState } from 'react'
import { CalendarClock, Euro, Gift, Pause, Percent, Play, Plus, Tag, Trash2, Truck, Users } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, StatCard, StatusPill, type Tone } from '@/components/portal/PortalUI'
import ChipFilter from '@/components/shared/ChipFilter'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import PromotionDialog from '@/components/merchant/PromotionDialog'
import { describePromotion, promotionStatus, statsForPeriod, summarize, PROMOTION_TYPE_LABELS, type PromotionStatus, type PromotionType } from '@/data/portals/merchant'
import { formatDate, formatNumber, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useMerchant } from '@/store/merchant'

const STATUS_META: Record<PromotionStatus, { label: string; tone: Tone }> = {
  active: { label: 'Active', tone: 'success' },
  scheduled: { label: 'Programmée', tone: 'info' },
  paused: { label: 'En pause', tone: 'warning' },
  expired: { label: 'Terminée', tone: 'neutral' },
}

const TYPE_ICONS: Record<PromotionType, typeof Percent> = { percent: Percent, amount: Euro, free_delivery: Truck, bogo: Gift }

type Filter = 'all' | PromotionStatus

export default function MerchantPromotions() {
  const promotions = useMerchant((s) => s.promotions)
  const items = useMerchant((s) => s.items)
  const { addPromotion, togglePromotionPause, removePromotion } = useMerchant()
  const [filter, setFilter] = useState<Filter>('all')
  const [creating, setCreating] = useState(false)
  // Captured once per mount: status is evaluated against the page's opening time.
  const [now] = useState(() => Date.now())

  const withStatus = useMemo(() => promotions.map((p) => ({ promo: p, status: promotionStatus(p, now) })), [promotions, now])
  const counts = (s: PromotionStatus) => withStatus.filter((p) => p.status === s).length
  const order: PromotionStatus[] = ['active', 'paused', 'scheduled', 'expired']
  const list = withStatus
    .filter((p) => filter === 'all' || p.status === filter)
    .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || b.promo.startDate.localeCompare(a.promo.startDate))

  const live = withStatus.filter((p) => p.status === 'active' || p.status === 'paused')
  const totalUses = live.reduce((s, p) => s + p.promo.uses, 0)
  const totalRevenue = live.reduce((s, p) => s + p.promo.revenue, 0)

  return (
    <div>
      <PortalPageHeader
        title="Promotions"
        description="Attirez de nouveaux clients et relancez vos plats avec des offres ciblées."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus /> Créer une promotion
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Promotions actives" value={counts('active')} icon={Tag} hint={`${counts('scheduled')} programmée(s)`} />
        <StatCard label="Utilisations" value={formatNumber(totalUses)} icon={Users} hint="offres en cours" />
        <StatCard label="CA généré" value={formatPrice(totalRevenue)} icon={Euro} hint="offres en cours" />
        <StatCard label="Panier moyen promo" value={formatPrice(totalUses ? totalRevenue / totalUses : 0)} icon={CalendarClock} hint={`vs ${formatPrice(summarize(statsForPeriod(30)).basket)} en moyenne`} />
      </div>

      <ChipFilter
        className="mt-6"
        label="Filtrer les promotions"
        value={filter}
        onChange={(v) => setFilter(v as Filter)}
        chips={[
          { id: 'all', label: 'Toutes', count: promotions.length },
          { id: 'active', label: 'Actives', count: counts('active') },
          { id: 'scheduled', label: 'Programmées', count: counts('scheduled') },
          { id: 'paused', label: 'En pause', count: counts('paused') },
          { id: 'expired', label: 'Terminées', count: counts('expired') },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState
          className="mt-4"
          icon={Tag}
          title="Aucune promotion"
          description="Créez votre première offre pour booster vos ventes."
          action={<Button onClick={() => setCreating(true)}>Créer une promotion</Button>}
        />
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(({ promo: p, status }) => {
            const Icon = TYPE_ICONS[p.type]
            const meta = STATUS_META[status]
            const itemName = items.find((i) => i.id === p.itemId)?.name
            const canToggle = status === 'active' || status === 'paused'
            return (
              <article key={p.id} className={cn('flex flex-col rounded-2xl border bg-card p-5 shadow-soft', status === 'expired' && 'opacity-75')}>
                <div className="flex items-start justify-between gap-3">
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', status === 'active' ? 'bg-brand-50 text-brand-700' : 'bg-secondary text-ink')}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                </div>
                <h2 className="mt-3 font-sans text-base font-semibold text-ink">{p.name}</h2>
                <p className="text-sm text-muted-foreground">{describePromotion(p, itemName)}</p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li>{PROMOTION_TYPE_LABELS[p.type]}</li>
                  <li>
                    Du {formatDate(p.startDate, { day: 'numeric', month: 'short' })} au {formatDate(p.endDate, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </li>
                  <li>
                    {p.minOrder ? `Dès ${formatPrice(p.minOrder)} de commande` : 'Sans minimum de commande'}
                    {p.newCustomersOnly && ' · nouveaux clients'}
                  </li>
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Utilisations</p>
                    <p className="font-semibold tabular-nums text-ink">{formatNumber(p.uses)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CA généré</p>
                    <p className="font-semibold tabular-nums text-ink">{formatPrice(p.revenue)}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 pt-1">
                  {canToggle && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        togglePromotionPause(p.id)
                        toast(p.paused ? `« ${p.name} » relancée` : `« ${p.name} » mise en pause`)
                      }}
                    >
                      {p.paused ? <Play /> : <Pause />}
                      {p.paused ? 'Reprendre' : 'Mettre en pause'}
                    </Button>
                  )}
                  {status !== 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(!canToggle && 'ml-auto')}
                      onClick={() => {
                        removePromotion(p.id)
                        toast(`« ${p.name} » supprimée`, { action: { label: 'Annuler', onClick: () => addPromotion(p) } })
                      }}
                    >
                      <Trash2 /> Supprimer
                    </Button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <PromotionDialog
        open={creating}
        onOpenChange={setCreating}
        items={items}
        onCreate={(p) => {
          addPromotion(p)
          setCreating(false)
          setFilter('all')
          toast.success(`Promotion « ${p.name} » créée`, {
            description: promotionStatus(p) === 'scheduled' ? `Elle démarrera le ${formatDate(p.startDate, { day: 'numeric', month: 'long' })}.` : 'Elle est déjà visible par les clients.',
          })
        }}
      />
    </div>
  )
}
