import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Bike, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Restaurant } from '@/data/restaurants'
import { FREE_DELIVERY_THRESHOLD, subtotalOf } from '@/lib/pricing'
import { formatPrice, pluralize } from '@/lib/format'
import { cn } from '@/lib/utils'

function useRestaurantCart(restaurantId: string) {
  const items = useCart((s) => s.items)
  const lines = items.filter((i) => i.vendorId === restaurantId)
  const count = lines.reduce((n, i) => n + i.quantity, 0)
  return { lines, count, subtotal: subtotalOf(lines) }
}

function MinOrderProgress({ subtotal, minOrder, tone = 'light' }: { subtotal: number; minOrder: number; tone?: 'light' | 'dark' }) {
  const reached = subtotal >= minOrder
  const pct = Math.min(100, (subtotal / minOrder) * 100)
  return (
    <div>
      <div
        className={cn('h-1.5 overflow-hidden rounded-full', tone === 'dark' ? 'bg-white/15' : 'bg-secondary')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label="Progression vers le minimum de commande"
      >
        <div className={cn('h-full rounded-full transition-all duration-500', reached ? 'bg-emerald-500' : 'bg-brand-500')} style={{ width: `${pct}%` }} />
      </div>
      <p className={cn('mt-1.5 text-xs', tone === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
        {reached
          ? subtotal >= FREE_DELIVERY_THRESHOLD
            ? 'Minimum atteint · livraison offerte'
            : `Minimum atteint · livraison offerte dès ${formatPrice(FREE_DELIVERY_THRESHOLD)}`
          : `Encore ${formatPrice(minOrder - subtotal)} pour atteindre le minimum de ${formatPrice(minOrder)}`}
      </p>
    </div>
  )
}

/** Fixed bar at the bottom of the screen, below lg. Sits above the mobile tab bar. */
export function CartBar({ restaurant }: { restaurant: Restaurant }) {
  const { count, subtotal } = useRestaurantCart(restaurant.id)
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-30 px-3 pb-3 md:bottom-0 lg:hidden"
        >
          <div className="mx-auto max-w-2xl rounded-2xl bg-ink p-3 text-white shadow-lift">
            <Link to="/panier" className="flex items-center gap-3 rounded-xl">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <ShoppingBag className="h-5 w-5" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-brand-600 px-1 text-center text-[11px] font-bold leading-5">{count}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Voir le panier</span>
                <span className="block truncate text-xs text-white/70">
                  {pluralize(count, 'article')} · {restaurant.name}
                </span>
              </span>
              <span className="font-bold tabular-nums">{formatPrice(subtotal)}</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <div className="mt-3 px-1">
              <MinOrderProgress subtotal={subtotal} minOrder={restaurant.minOrder} tone="dark" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Side card for desktop (≥ lg): cart recap when it has items, delivery info otherwise. */
export function CartSideCard({ restaurant }: { restaurant: Restaurant }) {
  const { lines, count, subtotal } = useRestaurantCart(restaurant.id)
  const setQuantity = useCart((s) => s.setQuantity)

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      {count === 0 ? (
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <ShoppingBag className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-ink">Votre panier est vide</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ajoutez des plats pour commencer votre commande.</p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-ink">
            <Bike className="h-3.5 w-3.5" aria-hidden />
            Minimum {formatPrice(restaurant.minOrder)} · livraison {formatPrice(restaurant.deliveryFee)}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-ink">Votre commande</h2>
            <span className="text-sm text-muted-foreground">{pluralize(count, 'article')}</span>
          </div>
          <ul className="mt-4 max-h-[40vh] space-y-3 overflow-y-auto pr-1">
            {lines.map((l) => (
              <li key={l.key} className="flex items-start gap-3 text-sm">
                <span className="inline-flex shrink-0 items-center overflow-hidden rounded-md border">
                  <button
                    type="button"
                    className="px-1.5 py-0.5 text-muted-foreground hover:bg-muted"
                    onClick={() => setQuantity(l.key, l.quantity - 1)}
                    aria-label={`Retirer un ${l.name}`}
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center font-semibold tabular-nums">{l.quantity}</span>
                  <button
                    type="button"
                    className="px-1.5 py-0.5 text-muted-foreground hover:bg-muted"
                    onClick={() => setQuantity(l.key, l.quantity + 1)}
                    aria-label={`Ajouter un ${l.name}`}
                  >
                    +
                  </button>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium leading-snug text-ink">{l.name}</span>
                  {!!l.options?.length && <span className="block text-xs text-muted-foreground">{l.options.join(', ')}</span>}
                  {l.note && <span className="block text-xs italic text-muted-foreground">« {l.note} »</span>}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-ink">{formatPrice(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Sous-total</span>
              <span className="text-lg font-bold tabular-nums text-ink">{formatPrice(subtotal)}</span>
            </div>
            <MinOrderProgress subtotal={subtotal} minOrder={restaurant.minOrder} />
            <Link
              to="/panier"
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-white transition hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Voir le panier <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
