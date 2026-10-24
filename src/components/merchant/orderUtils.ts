import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { generateOrder, seededRandom, type MerchantOrder } from '@/data/portals/merchant'
import { formatPrice } from '@/lib/format'
import { useMerchant } from '@/store/merchant'

/** Current timestamp, refreshed every `intervalMs` (default 1 s). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(t)
  }, [intervalMs])
  return now
}

/** Seconds left before the planned ready time (negative = late). */
export function secondsLeft(order: MerchantOrder, now: number): number {
  const start = new Date(order.acceptedAt ?? order.createdAt).getTime()
  return Math.round((start + order.prepMinutes * 60_000 - now) / 1000)
}

export function formatCountdown(seconds: number): string {
  const abs = Math.abs(seconds)
  const m = Math.floor(abs / 60)
  const s = abs % 60
  return `${seconds < 0 ? '+' : ''}${m}:${String(s).padStart(2, '0')}`
}

export function minutesSince(iso: string, now: number): number {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60_000))
}

/** Returns a callback that drops a random new order onto the board (with a toast). */
export function useSimulateOrder() {
  const addOrder = useMerchant((s) => s.addOrder)
  const storeOpen = useMerchant((s) => s.storeOpen)
  return () => {
    if (!storeOpen) {
      toast.warning('Votre établissement est fermé', { description: 'Rouvrez-le pour recevoir de nouvelles commandes.' })
      return
    }
    const now = Date.now()
    const order = generateOrder(seededRandom(now % 2_147_483_647), now, 'new')
    addOrder(order)
    toast.success(`Nouvelle commande ${order.number}`, {
      description: `${order.customerName} · ${order.lines.reduce((s, l) => s + l.quantity, 0)} articles · ${formatPrice(order.subtotal)}`,
    })
  }
}
