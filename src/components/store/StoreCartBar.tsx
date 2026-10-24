import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useCart } from '@/store/cart'
import { formatPrice, pluralize } from '@/lib/format'
import type { Store } from '@/data/stores'

/** Floating bar summarising the cart lines of one store. Sits above the mobile tab bar. */
export default function StoreCartBar({ store }: { store: Store }) {
  const lines = useCart(useShallow((s) => s.items.filter((i) => i.vendorId === store.id)))
  const count = lines.reduce((n, i) => n + i.quantity, 0)
  const subtotal = lines.reduce((n, i) => n + i.quantity * i.unitPrice, 0)
  const missing = Math.max(0, store.minOrder - subtotal)

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 px-4 md:bottom-6"
        >
          <Link
            to="/panier"
            className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-lift transition-transform hover:-translate-y-0.5"
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <ShoppingBag className="h-5 w-5" aria-hidden />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold">
                {count}
              </span>
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-sm font-semibold">Voir le panier · {pluralize(count, 'article')}</span>
              <span className="block truncate text-xs text-white/70">
                {missing > 0 ? `Encore ${formatPrice(missing)} pour le minimum de commande` : store.name}
              </span>
            </span>
            <span className="text-base font-bold tabular-nums">{formatPrice(subtotal)}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
