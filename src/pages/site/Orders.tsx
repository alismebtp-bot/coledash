import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { History, PackageOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import EmptyState from '@/components/shared/EmptyState'
import { StarRating } from '@/components/shared/Rating'
import LoginRequired from '@/components/account/LoginRequired'
import OrderCard from '@/components/account/OrderCard'
import { useNow } from '@/components/checkout/useNow'
import { useAuth } from '@/store/auth'
import { useCart } from '@/store/cart'
import { getOrderStatus, useOrders } from '@/store/orders'
import type { Order } from '@/types'

function reorder(order: Order) {
  const { clear, add } = useCart.getState()
  clear()
  for (const { key: _key, quantity, ...rest } of order.items) {
    void _key
    add({ ...rest, quantity })
  }
}

export default function Orders() {
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)
  const allOrders = useOrders((s) => s.orders)
  const rate = useOrders((s) => s.rate)
  const cartItems = useCart((s) => s.items)
  const now = useNow(5000)
  const [pendingReorder, setPendingReorder] = useState<Order | null>(null)
  const [rating, setRating] = useState<Order | null>(null)

  const orders = useMemo(() => allOrders.filter((o) => o.userId === user?.id), [allOrders, user])
  const withStatus = useMemo(() => orders.map((o) => ({ order: o, status: getOrderStatus(o, now) })), [orders, now])
  const current = withStatus.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
  const past = withStatus.filter((o) => o.status === 'delivered' || o.status === 'cancelled')

  if (!user) {
    return (
      <div className="container max-w-2xl py-12 pb-28">
        <h1 className="mb-6 text-3xl font-bold text-ink">Mes commandes</h1>
        <LoginRequired
          redirect="/commandes"
          title="Connectez-vous pour voir vos commandes"
          description="Retrouvez vos commandes en cours, votre historique et recommandez vos plats préférés en un geste."
        />
      </div>
    )
  }

  const doReorder = (order: Order) => {
    reorder(order)
    toast.success('Articles ajoutés au panier', { description: order.vendorName })
    navigate('/panier')
  }

  const requestReorder = (order: Order) => {
    if (cartItems.length > 0) setPendingReorder(order)
    else doReorder(order)
  }

  const list = (entries: typeof withStatus, empty: ReactNode) =>
    entries.length === 0 ? (
      empty
    ) : (
      <div className="grid gap-4 lg:grid-cols-2">
        {entries.map(({ order, status }, i) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
            <OrderCard order={order} status={status} onReorder={() => requestReorder(order)} onRate={() => setRating(order)} />
          </motion.div>
        ))}
      </div>
    )

  return (
    <div className="container py-8 pb-28 md:py-12">
      <h1 className="text-3xl font-bold text-ink">Mes commandes</h1>
      <p className="mt-1 text-muted-foreground">Suivez vos livraisons et retrouvez votre historique.</p>

      <Tabs defaultValue={current.length > 0 || past.length === 0 ? 'en-cours' : 'passees'} className="mt-6">
        <TabsList className="h-11 rounded-full p-1">
          <TabsTrigger value="en-cours" className="rounded-full px-4">
            En cours {current.length > 0 && <span className="ml-1.5 rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">{current.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="passees" className="rounded-full px-4">
            Passées
          </TabsTrigger>
        </TabsList>
        <TabsContent value="en-cours" className="mt-6">
          {list(
            current,
            <EmptyState
              icon={PackageOpen}
              title="Aucune commande en cours"
              description="Une envie soudaine ? Les meilleurs commerces de votre ville livrent en moins d’une heure."
              action={
                <Button asChild variant="ink">
                  <Link to="/restaurants">Découvrir les restaurants</Link>
                </Button>
              }
            />,
          )}
        </TabsContent>
        <TabsContent value="passees" className="mt-6">
          {list(past, <EmptyState icon={History} title="Pas encore d’historique" description="Vos commandes livrées apparaîtront ici." />)}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!pendingReorder} onOpenChange={(o) => !o && setPendingReorder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remplacer votre panier ?</AlertDialogTitle>
            <AlertDialogDescription>
              Votre panier actuel sera vidé pour y ajouter la commande chez {pendingReorder?.vendorName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Garder mon panier</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingReorder && doReorder(pendingReorder)}>Vider et recommander</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!rating} onOpenChange={(o) => !o && setRating(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-center">Noter {rating?.vendorName}</DialogTitle>
            <DialogDescription className="text-center">Votre avis aide les autres clients et le commerce.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2">
            <StarRating
              size="lg"
              value={0}
              onChange={(n) => {
                if (!rating) return
                rate(rating.id, n)
                setRating(null)
                toast.success('Merci pour votre note !')
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
