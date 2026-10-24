import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bike } from 'lucide-react'
import { useOrders, getOrderStatus, getOrderEta, isActive, STATUS_LABELS } from '@/store/orders'

/** Shown on the home page while an order is on its way. */
export default function ActiveOrderBanner() {
  const orders = useOrders((s) => s.orders)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(t)
  }, [])
  const active = orders.find((o) => isActive(o, now))
  if (!active) return null
  const minutes = Math.max(1, Math.round((getOrderEta(active) - now) / 60000))
  return (
    <div className="container pt-4">
      <Link
        to={`/suivi/${active.id}`}
        className="group flex items-center gap-4 rounded-2xl bg-ink p-4 text-white shadow-lift transition-transform hover:-translate-y-0.5"
      >
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600">
          <Bike className="h-5 w-5" aria-hidden />
          <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-amber-300" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white/70">
            {active.vendorName} · {STATUS_LABELS[getOrderStatus(active, now)]}
          </p>
          <p className="font-semibold">Arrivée estimée dans {minutes} min</p>
        </div>
        <span className="hidden items-center gap-1 text-sm font-semibold sm:flex">
          Suivre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  )
}
