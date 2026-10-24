import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Panel, PortalPageHeader } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OrderCard from '@/components/merchant/OrderCard'
import OrderDetailSheet from '@/components/merchant/OrderDetailSheet'
import OrdersHistory from '@/components/merchant/OrdersHistory'
import RefuseOrderDialog from '@/components/merchant/RefuseOrderDialog'
import StoreControls from '@/components/merchant/StoreControls'
import { useNow, useSimulateOrder } from '@/components/merchant/orderUtils'
import type { MerchantOrder, MerchantOrderStatus } from '@/data/portals/merchant'
import { cn } from '@/lib/utils'
import { useMerchant } from '@/store/merchant'

const COLUMNS: { status: MerchantOrderStatus; title: string; dot: string; empty: string }[] = [
  { status: 'new', title: 'Nouvelles', dot: 'bg-brand-600', empty: 'Aucune nouvelle commande' },
  { status: 'preparing', title: 'En préparation', dot: 'bg-amber-500', empty: 'Rien en cuisine' },
  { status: 'ready', title: 'Prêtes', dot: 'bg-sky-500', empty: 'Aucune commande en attente du livreur' },
  { status: 'picked_up', title: 'Récupérées', dot: 'bg-emerald-500', empty: 'Aucune commande récupérée récemment' },
]

export default function MerchantOrders() {
  const orders = useMerchant((s) => s.orders)
  const prepTime = useMerchant((s) => s.prepTime)
  const { acceptOrder, refuseOrder, markReady, markPickedUp, extendPrep } = useMerchant()
  const simulate = useSimulateOrder()
  const now = useNow()
  const [detailId, setDetailId] = useState<string | null>(null)
  const [refusing, setRefusing] = useState<MerchantOrder | null>(null)
  const detail = orders.find((o) => o.id === detailId) ?? null

  const accept = (o: MerchantOrder) => {
    acceptOrder(o.id, prepTime)
    toast.success(`Commande ${o.number} acceptée`, { description: `Prête dans ${prepTime} min — le client est prévenu.` })
  }
  const ready = (o: MerchantOrder) => {
    markReady(o.id)
    toast.success(`Commande ${o.number} prête`, { description: 'Le livreur a été notifié.' })
  }
  const pickedUp = (o: MerchantOrder) => {
    markPickedUp(o.id)
    toast(`Commande ${o.number} remise au livreur`)
  }

  // Recently picked-up orders only (last 2 hours) on the board.
  const boardFor = (status: MerchantOrderStatus) =>
    orders
      .filter((o) => o.status === status && (status !== 'picked_up' || now - new Date(o.pickedUpAt ?? o.createdAt).getTime() < 2 * 3_600_000))
      .sort((a, b) => (status === 'picked_up' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)))

  const history = orders.filter((o) => o.status === 'picked_up' || o.status === 'refused' || o.status === 'cancelled')

  return (
    <div>
      <PortalPageHeader
        title="Commandes"
        description="Acceptez, préparez et remettez vos commandes aux livreurs en temps réel."
        actions={
          <>
            <StoreControls />
            <Button onClick={simulate}>
              <Sparkles /> Simuler une commande
            </Button>
          </>
        }
      />

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">En cours</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4">
          <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            <div className="grid min-w-[1000px] grid-cols-4 gap-4 xl:min-w-0">
              {COLUMNS.map((col) => {
                const list = boardFor(col.status)
                return (
                  <section key={col.status} aria-label={col.title} className="flex flex-col rounded-2xl border bg-secondary/40 p-3">
                    <header className="mb-3 flex items-center gap-2 px-1">
                      <span className={cn('h-2 w-2 rounded-full', col.dot)} aria-hidden />
                      <h2 className="font-sans text-sm font-semibold text-ink">{col.title}</h2>
                      <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold tabular-nums text-ink">{list.length}</span>
                    </header>
                    <div className="flex min-h-[120px] flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {list.map((o) => (
                          <OrderCard
                            key={o.id}
                            order={o}
                            now={now}
                            onOpen={() => setDetailId(o.id)}
                            onAccept={() => accept(o)}
                            onRefuse={() => setRefusing(o)}
                            onReady={() => ready(o)}
                            onExtend={() => {
                              extendPrep(o.id, 5)
                              toast(`+5 min sur ${o.number}`, { description: 'Le client voit la nouvelle heure estimée.' })
                            }}
                            onPickedUp={() => pickedUp(o)}
                          />
                        ))}
                      </AnimatePresence>
                      {list.length === 0 && <p className="rounded-xl border border-dashed px-3 py-8 text-center text-xs text-muted-foreground">{col.empty}</p>}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Panel title="Historique des commandes">
            <OrdersHistory orders={history} onOpen={(o) => setDetailId(o.id)} />
          </Panel>
        </TabsContent>
      </Tabs>

      <OrderDetailSheet
        order={detail}
        onOpenChange={(open) => !open && setDetailId(null)}
        onAccept={accept}
        onRefuse={(o) => setRefusing(o)}
        onReady={ready}
        onPickedUp={pickedUp}
      />
      <RefuseOrderDialog
        order={refusing}
        onOpenChange={(open) => !open && setRefusing(null)}
        onConfirm={(reason) => {
          if (!refusing) return
          refuseOrder(refusing.id, reason)
          toast(`Commande ${refusing.number} refusée`, { description: `Motif : ${reason}. Le client est remboursé.` })
          setRefusing(null)
        }}
      />
    </div>
  )
}
