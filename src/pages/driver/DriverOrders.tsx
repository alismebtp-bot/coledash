import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navigation, PowerOff, RefreshCw, SearchX } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader } from '@/components/portal/PortalUI'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import OfferCard from '@/components/driver/OfferCard'
import { useNow } from '@/components/driver/useDriverToday'
import { generateOffers } from '@/data/portals/driver'
import { useDriver } from '@/store/driver'

export default function DriverOrders() {
  const navigate = useNavigate()
  const online = useDriver((s) => s.online)
  const setOnline = useDriver((s) => s.setOnline)
  const batch = useDriver((s) => s.offerBatch)
  const declined = useDriver((s) => s.declined)
  const current = useDriver((s) => s.current)
  const refresh = useDriver((s) => s.refreshOffers)
  const decline = useDriver((s) => s.decline)
  const accept = useDriver((s) => s.accept)

  const now = useNow(1000)
  const [shownAt, setShownAt] = useState(now)
  // Restart the countdowns whenever a new batch of offers arrives.
  useEffect(() => {
    setShownAt(Date.now())
  }, [batch])

  const elapsed = Math.max(0, Math.floor((now - shownAt) / 1000))
  const offers = useMemo(() => generateOffers(batch), [batch])
  const visible = offers.filter((o) => !declined.includes(o.id) && o.expiresIn - elapsed > 0)

  const onRefresh = () => {
    refresh()
    toast('Nouvelles propositions chargées')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PortalPageHeader
        title="Courses disponibles"
        description={online ? 'Propositions autour de vous, triées par proximité.' : 'Passez en ligne pour recevoir des propositions.'}
        actions={
          online && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw aria-hidden /> Actualiser
            </Button>
          )
        }
      />

      {current && (
        <Link to="/livreur/livraison" className="mb-4 flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          <Navigation className="h-5 w-5 shrink-0" aria-hidden />
          <span>
            Terminez d'abord la livraison <strong>{current.offer.orderCode}</strong> pour accepter une nouvelle course.
          </span>
        </Link>
      )}

      {!online ? (
        <EmptyState
          icon={PowerOff}
          title="Vous êtes hors ligne"
          description="Les propositions de courses n'apparaissent que lorsque vous êtes disponible."
          action={
            <Button
              size="lg"
              onClick={() => {
                setOnline(true)
                toast.success('Vous êtes en ligne')
              }}
            >
              Passer en ligne
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Aucune course pour le moment"
          description="Restez dans une zone à forte demande, de nouvelles propositions arrivent souvent."
          action={
            <Button onClick={onRefresh}>
              <RefreshCw aria-hidden /> Actualiser
            </Button>
          }
        />
      ) : (
        <ul className="space-y-4">
          <AnimatePresence initial={false}>
            {visible.map((o) => (
              <OfferCard
                key={o.id}
                offer={o}
                secondsLeft={o.expiresIn - elapsed}
                disabled={Boolean(current)}
                onDecline={() => {
                  decline(o.id)
                  toast('Course refusée')
                }}
                onAccept={() => {
                  accept(o)
                  toast.success(`Course acceptée : direction ${o.merchantName}`)
                  navigate('/livreur/livraison')
                }}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
