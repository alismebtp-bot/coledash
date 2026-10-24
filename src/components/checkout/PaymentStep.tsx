import { Banknote, CreditCard, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import FormField from '@/components/account/FormField'
import { OptionTile } from './CheckoutSection'
import { BRAND_LABEL, detectBrand, formatCardNumber, formatExpiry, type CardErrors, type CardState } from './card'
import type { PaymentMethod } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  method: PaymentMethod
  onMethod: (m: PaymentMethod) => void
  card: CardState
  onCard: (c: CardState) => void
  errors: CardErrors
  allowCash: boolean
}

function BrandMark({ brand }: { brand: ReturnType<typeof detectBrand> }) {
  if (brand === 'visa') return <span className="text-sm font-extrabold italic tracking-tight text-[#1a1f71]">VISA</span>
  if (brand === 'mastercard')
    return (
      <span className="flex" aria-label="Mastercard">
        <span className="h-5 w-5 rounded-full bg-[#eb001b]" />
        <span className="-ml-2 h-5 w-5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
    )
  if (brand === 'amex') return <span className="rounded bg-[#2e77bc] px-1 text-[10px] font-bold text-white">AMEX</span>
  return <CreditCard className="h-5 w-5 text-muted-foreground" aria-hidden />
}

const METHODS: { id: PaymentMethod; label: string; sub: string }[] = [
  { id: 'card', label: 'Carte bancaire', sub: 'CB, Visa, Mastercard, Amex' },
  { id: 'apple_pay', label: 'Apple Pay', sub: 'Validation avec Face ID' },
  { id: 'paypal', label: 'PayPal', sub: 'Redirection sécurisée' },
  { id: 'cash', label: 'Espèces', sub: 'À la livraison' },
]

function MethodIcon({ id }: { id: PaymentMethod }) {
  if (id === 'card') return <CreditCard className="h-5 w-5 text-ink" aria-hidden />
  if (id === 'apple_pay')
    return (
      <span className="rounded-md bg-black px-1.5 py-0.5 text-[11px] font-semibold text-white" aria-hidden>
         Pay
      </span>
    )
  if (id === 'paypal')
    return (
      <span className="text-sm font-extrabold italic" aria-hidden>
        <span className="text-[#003087]">Pay</span>
        <span className="text-[#009cde]">Pal</span>
      </span>
    )
  return <Banknote className="h-5 w-5 text-emerald-700" aria-hidden />
}

export default function PaymentStep({ method, onMethod, card, onCard, errors, allowCash }: Props) {
  const brand = detectBrand(card.number)
  const methods = METHODS.filter((m) => m.id !== 'cash' || allowCash)

  return (
    <div className="space-y-4">
      <div className={cn('grid gap-2', methods.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3')} role="radiogroup" aria-label="Moyen de paiement">
        {methods.map((m) => (
          <OptionTile key={m.id} selected={method === m.id} onSelect={() => onMethod(m.id)} className="flex flex-col gap-2">
            <span className="flex h-6 items-center">
              <MethodIcon id={m.id} />
            </span>
            <span className="text-sm">
              <span className="block font-semibold text-ink">{m.label}</span>
              <span className="block text-xs text-muted-foreground">{m.sub}</span>
            </span>
          </OptionTile>
        ))}
      </div>

      {method === 'card' && (
        <div className="space-y-3 rounded-xl border bg-background p-4">
          <FormField id="cc-number" label="Numéro de carte" error={errors.number}>
            <div className="relative">
              <Input
                id="cc-number"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={(e) => onCard({ ...card, number: formatCardNumber(e.target.value) })}
                className="pr-16 font-mono tracking-wide"
                aria-invalid={!!errors.number}
                aria-describedby="cc-number-msg"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2" title={BRAND_LABEL[brand]}>
                <BrandMark brand={brand} />
              </span>
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField id="cc-exp" label="Expiration" error={errors.expiry}>
              <Input
                id="cc-exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM / AA"
                value={card.expiry}
                onChange={(e) => onCard({ ...card, expiry: formatExpiry(e.target.value, card.expiry) })}
                className="font-mono"
                aria-invalid={!!errors.expiry}
                aria-describedby="cc-exp-msg"
              />
            </FormField>
            <FormField id="cc-cvc" label="Cryptogramme" error={errors.cvc}>
              <Input
                id="cc-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder={brand === 'amex' ? '1234' : '123'}
                value={card.cvc}
                onChange={(e) => onCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, brand === 'amex' ? 4 : 3) })}
                className="font-mono"
                aria-invalid={!!errors.cvc}
                aria-describedby="cc-cvc-msg"
              />
            </FormField>
          </div>
          <FormField id="cc-name" label="Titulaire de la carte" error={errors.name}>
            <Input
              id="cc-name"
              autoComplete="cc-name"
              placeholder="Camille Martin"
              value={card.name}
              onChange={(e) => onCard({ ...card, name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby="cc-name-msg"
            />
          </FormField>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Démo : aucun paiement réel. Essayez 4242 4242 4242 4242, une date future et 123.
          </p>
        </div>
      )}
      {method === 'apple_pay' && (
        <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
          Vous validerez le paiement avec Apple Pay en confirmant la commande.
        </p>
      )}
      {method === 'paypal' && (
        <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
          Une fenêtre PayPal s’ouvrira pour autoriser le paiement (simulée dans cette démo).
        </p>
      )}
      {method === 'cash' && (
        <p className="rounded-xl bg-secondary/60 p-3 text-sm text-muted-foreground">
          Merci de prévoir l’appoint : nos livreurs n’ont que peu de monnaie.
        </p>
      )}
    </div>
  )
}
