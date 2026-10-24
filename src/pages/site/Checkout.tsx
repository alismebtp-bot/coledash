import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import CheckoutSection from '@/components/checkout/CheckoutSection'
import GuestPrompt from '@/components/checkout/GuestPrompt'
import AddressStep from '@/components/checkout/AddressStep'
import SlotStep from '@/components/checkout/SlotStep'
import GiftStep from '@/components/checkout/GiftStep'
import TipStep from '@/components/checkout/TipStep'
import PaymentStep from '@/components/checkout/PaymentStep'
import OrderRecap from '@/components/checkout/OrderRecap'
import { slotEnd, slotToIso, type SlotValue } from '@/components/checkout/slots'
import { EMPTY_CARD, validateCard, type CardState } from '@/components/checkout/card'
import { readStoredPromo, vendorInfo, writeStoredPromo } from '@/components/checkout/helpers'
import { useCart } from '@/store/cart'
import { useAuth, useDefaultAddress } from '@/store/auth'
import { useOrders } from '@/store/orders'
import { computeTotals, findPromo } from '@/lib/pricing'
import { formatDate, formatPrice } from '@/lib/format'
import type { Address, PaymentMethod } from '@/types'

type SectionId = 'adresse' | 'creneau' | 'cadeau' | 'paiement'

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCart((s) => s.items)
  const clearCart = useCart((s) => s.clear)
  const user = useAuth((s) => s.user)
  const addPoints = useAuth((s) => s.addPoints)
  const defaultAddress = useDefaultAddress()
  const placeOrder = useOrders((s) => s.place)

  const [guestMode, setGuestMode] = useState(false)
  const [chosenAddress, setChosenAddress] = useState<Address | null>(null)
  const [instructionsDraft, setInstructionsDraft] = useState<string | null>(null)
  const [slot, setSlot] = useState<SlotValue>({ mode: 'asap' })
  const [recipient, setRecipient] = useState('')
  const [giftMessage, setGiftMessage] = useState('')
  const [tip, setTip] = useState(2)
  const [method, setMethod] = useState<PaymentMethod>('card')
  const [card, setCard] = useState<CardState>(EMPTY_CARD)
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const placed = useRef(false)

  const promo = useMemo(() => findPromo(readStoredPromo()), [])
  const totals = useMemo(() => computeTotals(items, { promo, tip }), [items, promo, tip])

  // Adresse : choix explicite, sinon adresse par défaut du compte
  const address = chosenAddress ?? (user ? defaultAddress : null)
  const instructions = instructionsDraft ?? address?.instructions ?? ''

  if (items.length === 0 && !placed.current) return <Navigate to="/panier" replace />
  if (items.length === 0) return null

  const first = items[0]
  const kind = first.vendorKind
  const isFlowers = kind === 'flowers'
  const info = vendorInfo(first.vendorId)
  const effectiveMethod: PaymentMethod = method === 'cash' && kind !== 'restaurant' ? 'card' : method
  const cardErrors = effectiveMethod === 'card' ? validateCard(card) : {}
  const belowMin = totals.subtotal < first.vendorMinOrder

  const valid: Record<SectionId, boolean> = {
    adresse: !!address,
    creneau: slot.mode === 'asap' || !!slot.slot,
    cadeau: !isFlowers || recipient.trim().length >= 2,
    paiement: Object.keys(cardErrors).length === 0,
  }
  const show = (id: SectionId) => attempted && !valid[id]

  const scheduledFor = slotToIso(slot)
  const ctaLabel = `Payer ${formatPrice(totals.total)}`

  const submit = () => {
    setAttempted(true)
    if (belowMin) {
      toast.error(`Minimum de commande : ${formatPrice(first.vendorMinOrder)}`)
      return
    }
    const firstInvalid = (Object.keys(valid) as SectionId[]).find((k) => !valid[k])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      toast.error('Il manque quelques informations', { description: 'Vérifiez les champs signalés en rouge.' })
      return
    }
    if (!address) return
    setSubmitting(true)
    // Paiement simulé
    window.setTimeout(() => {
      const order = placeOrder({
        vendorId: first.vendorId,
        vendorName: first.vendorName,
        vendorKind: kind,
        items,
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        serviceFee: totals.serviceFee,
        tip: totals.tip,
        discount: totals.discount,
        total: totals.total,
        address: { ...address, instructions: instructions.trim() || undefined },
        paymentMethod: effectiveMethod,
        scheduledFor,
        recipientName: isFlowers ? recipient.trim() : undefined,
        giftMessage: isFlowers && giftMessage.trim() ? giftMessage.trim() : undefined,
      })
      placed.current = true
      clearCart()
      writeStoredPromo(null)
      const points = Math.floor(totals.total)
      if (user && points > 0) addPoints(points)
      toast.success(`Commande ${order.number} confirmée`, {
        description: user ? `+${points} points fidélité` : 'Suivez votre livraison en temps réel.',
      })
      navigate(`/suivi/${order.id}`, { replace: true })
    }, 1100)
  }

  let step = 0
  const next = () => ++step

  return (
    <div className="container max-w-6xl py-6 pb-44 md:py-10 md:pb-16">
      <Link to="/panier" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour au panier
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold text-ink">Finaliser la commande</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 text-emerald-600" aria-hidden /> Paiement sécurisé
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {!user && !guestMode && <GuestPrompt onContinue={() => setGuestMode(true)} />}
          {belowMin && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <p>
                Le minimum de commande chez {first.vendorName} est de {formatPrice(first.vendorMinOrder)}.{' '}
                <Link to="/panier" className="font-semibold underline">
                  Modifier le panier
                </Link>
              </p>
            </div>
          )}

          <CheckoutSection id="adresse" step={next()} title="Adresse de livraison" done={valid.adresse} invalid={show('adresse')}>
            <AddressStep
              key={user?.id ?? 'guest'}
              value={address}
              onChange={(a) => {
                setChosenAddress(a)
                setInstructionsDraft(null)
              }}
              instructions={instructions}
              onInstructions={setInstructionsDraft}
            />
            {show('adresse') && (
              <p className="mt-3 text-xs font-medium text-destructive" role="alert">
                Indiquez où livrer votre commande.
              </p>
            )}
          </CheckoutSection>

          <CheckoutSection id="creneau" step={next()} title="Quand ?" done={valid.creneau} invalid={show('creneau')}>
            <SlotStep value={slot} onChange={setSlot} asapLabel={info.deliveryTime ?? '30-45 min'} invalid={attempted} />
          </CheckoutSection>

          {isFlowers && (
            <CheckoutSection id="cadeau" step={next()} title="Pour qui sont ces fleurs ?" done={valid.cadeau} invalid={show('cadeau')}>
              <GiftStep
                recipient={recipient}
                message={giftMessage}
                onRecipient={setRecipient}
                onMessage={setGiftMessage}
                error={show('cadeau') ? 'Indiquez le nom du destinataire.' : undefined}
              />
            </CheckoutSection>
          )}

          <CheckoutSection id="pourboire" step={next()} title="Pourboire pour le livreur" done>
            <TipStep value={tip} onChange={setTip} />
          </CheckoutSection>

          <CheckoutSection id="paiement" step={next()} title="Paiement" done={valid.paiement} invalid={show('paiement')}>
            <PaymentStep
              method={effectiveMethod}
              onMethod={setMethod}
              card={card}
              onCard={setCard}
              errors={attempted ? cardErrors : {}}
              allowCash={kind === 'restaurant'}
            />
          </CheckoutSection>
        </motion.div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderRecap
            vendorName={first.vendorName}
            vendorImage={info.image}
            items={items}
            totals={totals}
            promoCode={promo?.code}
            submitting={submitting}
            onSubmit={submit}
            ctaLabel={ctaLabel}
          />
          <p className="mt-3 px-1 text-xs text-muted-foreground">
            {slot.mode === 'scheduled' && slot.slot && scheduledFor
              ? `Livraison prévue le ${formatDate(scheduledFor, { weekday: 'long', day: 'numeric', month: 'long' })} entre ${slot.slot} et ${slotEnd(slot.slot)}.`
              : `Livraison estimée en ${info.deliveryTime ?? '30-45 min'}.`}{' '}
            En confirmant, vous acceptez nos conditions générales de vente.
          </p>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-background/95 p-3 backdrop-blur md:bottom-0 lg:hidden">
        <Button size="lg" className="w-full" onClick={submit} disabled={submitting}>
          {submitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
          ) : (
            <Lock aria-hidden />
          )}
          {submitting ? 'Paiement en cours…' : ctaLabel}
        </Button>
      </div>
    </div>
  )
}
