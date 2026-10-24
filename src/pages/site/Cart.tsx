import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Bike, ChevronRight, Flower2, ShieldCheck, ShoppingBag, ShoppingBasket, Store, Trash2, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import EmptyState from '@/components/shared/EmptyState'
import SafeImage from '@/components/shared/SafeImage'
import CartLine from '@/components/checkout/CartLine'
import PromoField from '@/components/checkout/PromoField'
import TotalsList from '@/components/checkout/TotalsList'
import { KIND_LABEL, readStoredPromo, vendorHref, vendorInfo, writeStoredPromo } from '@/components/checkout/helpers'
import { groupByVendor, selectCount, useCart } from '@/store/cart'
import { FREE_DELIVERY_THRESHOLD, computeTotals, findPromo, type PromoCode } from '@/lib/pricing'
import { formatPrice, pluralize } from '@/lib/format'

const CATEGORIES = [
  { to: '/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { to: '/courses', label: 'Courses', icon: ShoppingBasket },
  { to: '/fleurs', label: 'Fleurs', icon: Flower2 },
  { to: '/boutiques', label: 'Boutiques', icon: Store },
]

export default function Cart() {
  const navigate = useNavigate()
  const items = useCart((s) => s.items)
  const count = useCart(selectCount)
  const setQuantity = useCart((s) => s.setQuantity)
  const remove = useCart((s) => s.remove)
  const add = useCart((s) => s.add)
  const clear = useCart((s) => s.clear)
  const [promo, setPromo] = useState<PromoCode | undefined>(() => findPromo(readStoredPromo()))

  const groups = useMemo(() => groupByVendor(items), [items])
  const totals = useMemo(() => computeTotals(items, { promo }), [items, promo])

  const applyPromo = (p: PromoCode) => {
    setPromo(p)
    writeStoredPromo(p.code)
    toast.success(`Code ${p.code} appliqué`, { description: p.label })
  }
  const removePromo = () => {
    setPromo(undefined)
    writeStoredPromo(null)
  }

  const removeLine = (key: string) => {
    const item = items.find((i) => i.key === key)
    remove(key)
    if (item) {
      toast(`${item.name} retiré du panier`, {
        action: { label: 'Annuler', onClick: () => add({ ...item }) },
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-3xl py-10 pb-28 md:py-16">
        <h1 className="mb-6 text-3xl font-bold text-ink">Votre panier</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Votre panier est vide"
          description="Un petit creux, un bouquet à offrir ou les courses de la semaine ? Tout est livré en moins d’une heure."
          action={
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIES.map((c) => (
                <Button key={c.to} asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
                  <Link to={c.to}>
                    <c.icon className="!size-5 text-brand-600" aria-hidden />
                    {c.label}
                  </Link>
                </Button>
              ))}
            </div>
          }
        />
      </div>
    )
  }

  const first = items[0]
  const minOrder = first.vendorMinOrder
  const belowMin = totals.subtotal < minOrder
  const remainingFree = Math.max(FREE_DELIVERY_THRESHOLD - totals.subtotal, 0)
  const freeProgress = Math.min((totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)

  return (
    <div className="container py-8 pb-40 md:py-12 md:pb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">Votre panier</h1>
          <p className="mt-1 text-muted-foreground">{pluralize(count, 'article')}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            if (window.confirm('Vider entièrement le panier ?')) {
              clear()
              removePromo()
            }
          }}
        >
          <Trash2 aria-hidden />
          Vider le panier
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
        <div className="space-y-4">
          {groups.map((group) => {
            const info = vendorInfo(group.vendorId)
            const kind = group.items[0].vendorKind
            return (
              <motion.section
                key={group.vendorId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border bg-card shadow-soft"
                aria-labelledby={`vendor-${group.vendorId}`}
              >
                <Link
                  to={vendorHref(group.items[0])}
                  className="flex items-center gap-3 rounded-t-2xl border-b px-4 py-3 transition-colors hover:bg-muted/50 sm:px-5"
                >
                  <SafeImage src={info.image} alt="" wrapperClassName="h-11 w-11 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{KIND_LABEL[kind]}</p>
                    <h2 id={`vendor-${group.vendorId}`} className="truncate text-base font-semibold text-ink">
                      {group.vendorName}
                    </h2>
                  </div>
                  <span className="hidden text-sm font-medium text-brand-700 sm:inline">Ajouter des articles</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </Link>
                <ul className="divide-y px-4 sm:px-5">
                  {group.items.map((item) => (
                    <CartLine
                      key={item.key}
                      item={item}
                      onQuantity={(q) => (q <= 0 ? removeLine(item.key) : setQuantity(item.key, q))}
                      onRemove={() => removeLine(item.key)}
                    />
                  ))}
                </ul>
              </motion.section>
            )
          })}

          {belowMin && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900" role="status">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold">Minimum de commande : {formatPrice(minOrder)}</p>
                <p>
                  Ajoutez encore {formatPrice(minOrder - totals.subtotal)} chez {first.vendorName} pour valider votre commande.
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft">
            <div className="rounded-xl bg-secondary/60 p-3.5">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Bike className="h-4 w-4 text-brand-600" aria-hidden />
                {remainingFree > 0 ? (
                  <span className="text-ink">
                    Plus que <strong>{formatPrice(remainingFree)}</strong> pour la livraison offerte
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-700">Livraison offerte débloquée !</span>
                )}
              </div>
              <Progress value={freeProgress} className="h-2" aria-label="Progression vers la livraison offerte" />
            </div>

            <PromoField applied={promo} onApply={applyPromo} onRemove={removePromo} />

            <TotalsList totals={totals} promoCode={promo?.code} />

            <Button
              size="lg"
              className="hidden w-full lg:flex"
              disabled={belowMin}
              onClick={() => navigate('/commande')}
            >
              Passer commande
              <ArrowRight aria-hidden />
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Paiement sécurisé · Annulation gratuite avant préparation
            </p>
          </div>
        </aside>
      </div>

      {/* Barre d'action mobile, au-dessus de la barre d'onglets */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-background/95 p-3 backdrop-blur md:bottom-0 lg:hidden">
        <Button size="lg" className="w-full justify-between" disabled={belowMin} onClick={() => navigate('/commande')}>
          <span>{belowMin ? `Minimum ${formatPrice(minOrder)}` : 'Passer commande'}</span>
          <span className="tabular-nums">{formatPrice(totals.total)}</span>
        </Button>
      </div>
    </div>
  )
}
