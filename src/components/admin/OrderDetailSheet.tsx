import { useState, type ReactNode } from 'react'
import { Ban, Bike, CreditCard, MapPin, Store, Undo2, User } from 'lucide-react'
import { StatusPill } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ORDER_TONES } from './tones'
import { ADMIN_STATUS_LABELS, PAYMENT_LABELS, VENDOR_KIND_LABELS, cityName, type AdminOrder } from '@/data/portals/admin'
import { formatDate, formatPrice, formatTime } from '@/lib/format'

interface Props {
  order: AdminOrder | null
  onOpenChange: (open: boolean) => void
  onRefund: (order: AdminOrder, amount: number) => void
  onCancel: (order: AdminOrder) => void
}

function Row({ icon: Icon, label, children }: { icon: typeof User; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 text-sm">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="font-medium text-ink">{children}</div>
      </div>
    </div>
  )
}

export default function OrderDetailSheet({ order, onOpenChange, onRefund, onCancel }: Props) {
  const [refundAmount, setRefundAmount] = useState('')
  const [refundOpen, setRefundOpen] = useState(false)

  const refundable = order ? Math.max(0, Math.round((order.total - (order.refunded ?? 0)) * 100) / 100) : 0
  const cancellable = order ? !['delivered', 'cancelled'].includes(order.status) : false
  const parsed = Number(refundAmount.replace(',', '.'))
  const validRefund = Number.isFinite(parsed) && parsed > 0 && parsed <= refundable

  return (
    <Sheet
      open={Boolean(order)}
      onOpenChange={(o) => {
        if (!o) {
          setRefundOpen(false)
          setRefundAmount('')
        }
        onOpenChange(o)
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {order && (
          <>
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2">
                <SheetTitle>Commande {order.number}</SheetTitle>
                <StatusPill tone={ORDER_TONES[order.status]}>{ADMIN_STATUS_LABELS[order.status]}</StatusPill>
              </div>
              <SheetDescription>
                Passée le {formatDate(order.createdAt, { day: 'numeric', month: 'long' })} à {formatTime(order.createdAt)} · {cityName(order.cityId)}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 grid gap-4">
              <Row icon={User} label="Client">
                {order.customer}
                <span className="block text-xs font-normal text-muted-foreground">{order.customerEmail}</span>
              </Row>
              <Row icon={Store} label="Commerce">
                {order.vendorName} <span className="font-normal text-muted-foreground">· {VENDOR_KIND_LABELS[order.vendorKind]}</span>
              </Row>
              <Row icon={MapPin} label="Adresse de livraison">{order.address}</Row>
              <Row icon={Bike} label="Livreur">{order.driver ?? <span className="font-normal text-muted-foreground">Non assigné</span>}</Row>
              <Row icon={CreditCard} label="Paiement">{PAYMENT_LABELS[order.paymentMethod]}</Row>
            </div>

            <div className="mt-6 rounded-xl border">
              <ul className="divide-y text-sm">
                {order.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-3 px-3 py-2">
                    <span>
                      <span className="font-semibold tabular-nums">{l.quantity}×</span> {l.name}
                    </span>
                    <span className="tabular-nums">{formatPrice(l.quantity * l.unitPrice)}</span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-1 border-t bg-secondary/40 px-3 py-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Sous-total</dt><dd className="tabular-nums">{formatPrice(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Livraison</dt><dd className="tabular-nums">{order.deliveryFee ? formatPrice(order.deliveryFee) : 'Offerte'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Frais de service</dt><dd className="tabular-nums">{formatPrice(order.serviceFee)}</dd></div>
                <div className="flex justify-between font-semibold text-ink"><dt>Total</dt><dd className="tabular-nums">{formatPrice(order.total)}</dd></div>
                {order.refunded ? (
                  <div className="flex justify-between font-semibold text-red-700"><dt>Remboursé</dt><dd className="tabular-nums">−{formatPrice(order.refunded)}</dd></div>
                ) : null}
              </dl>
            </div>

            {refundOpen ? (
              <form
                className="mt-6 rounded-xl border p-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!validRefund) return
                  onRefund(order, Math.round(parsed * 100) / 100)
                  setRefundOpen(false)
                  setRefundAmount('')
                }}
              >
                <Label htmlFor="refund-amount">Montant à rembourser (max. {formatPrice(refundable)})</Label>
                <div className="mt-2 flex gap-2">
                  <Input id="refund-amount" inputMode="decimal" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="0,00" />
                  <Button type="button" variant="outline" onClick={() => setRefundAmount(String(refundable).replace('.', ','))}>
                    Total
                  </Button>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setRefundOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={!validRefund}>
                    Confirmer le remboursement
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="flex-1" disabled={refundable === 0 || order.status === 'cancelled'} onClick={() => setRefundOpen(true)}>
                  <Undo2 aria-hidden /> Rembourser
                </Button>
                <Button variant="destructive" className="flex-1" disabled={!cancellable} onClick={() => onCancel(order)}>
                  <Ban aria-hidden /> Annuler la commande
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
