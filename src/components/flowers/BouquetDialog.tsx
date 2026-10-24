import { useState } from 'react'
import { Check, Flower2, Store as StoreIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import SafeImage from '@/components/shared/SafeImage'
import { occasions, resolveFlorist, type Bouquet, type BouquetSize } from '@/data/bouquets'
import { vendorFields } from '@/components/store/catalog'
import type { Store } from '@/data/stores'
import { useAddToCart } from '@/hooks/useAddToCart'
import { selectProductQuantity, useCart } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Props {
  bouquet: Bouquet | null
  cityId: string
  /** Force the preparing florist (store page); otherwise resolved from the city. */
  florist?: Store
  onOpenChange: (open: boolean) => void
}

export default function BouquetDialog({ bouquet, cityId, florist, onOpenChange }: Props) {
  return (
    <Dialog open={!!bouquet} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl gap-0 overflow-y-auto rounded-3xl border-0 bg-[#fffaf7] p-0 sm:rounded-3xl">
        {bouquet && <Body key={bouquet.id} bouquet={bouquet} florist={florist ?? resolveFlorist(bouquet, cityId)} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function Body({ bouquet, florist, onDone }: { bouquet: Bouquet; florist?: Store; onDone: () => void }) {
  const [size, setSize] = useState<BouquetSize>('M')
  const [message, setMessage] = useState('')
  const addToCart = useAddToCart()
  const inCart = useCart(selectProductQuantity(florist?.id ?? '', bouquet.id))
  const chosen = bouquet.sizes.find((s) => s.id === size) ?? bouquet.sizes[0]

  const add = () => {
    if (!florist) return
    const ok = addToCart({
      ...vendorFields(florist),
      productId: bouquet.id,
      name: `Bouquet ${bouquet.name}`,
      image: bouquet.image,
      unitPrice: chosen.price,
      options: [`Taille ${chosen.label} · ${chosen.stems} tiges`],
      note: message.trim() ? `Carte : « ${message.trim()} »` : undefined,
    })
    if (ok) onDone()
  }

  return (
    <div className="grid md:grid-cols-[1fr_1.05fr]">
      <SafeImage src={bouquet.image} alt={bouquet.name} wrapperClassName="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[560px]" />
      <div className="flex flex-col p-6 sm:p-8">
        <ul className="flex flex-wrap gap-1.5" aria-label="Occasions">
          {bouquet.occasions.map((id) => (
            <li key={id} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700">
              {occasions.find((o) => o.id === id)?.label}
            </li>
          ))}
        </ul>
        <DialogTitle className="mt-3 pr-6 font-serif text-3xl font-semibold leading-tight text-ink">{bouquet.name}</DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-relaxed text-ink/75">{bouquet.description}</DialogDescription>

        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Dans le bouquet</h3>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink">
            {bouquet.flowers.map((f) => (
              <span key={f} className="inline-flex items-center gap-1">
                <Flower2 className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                {f}
              </span>
            ))}
          </p>
        </div>

        <fieldset className="mt-6">
          <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Taille</legend>
          <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
            {bouquet.sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={size === s.id}
                onClick={() => setSize(s.id)}
                className={cn(
                  'relative rounded-2xl border bg-white p-3 text-left transition-all',
                  size === s.id ? 'border-ink ring-1 ring-ink' : 'hover:border-ink/30',
                )}
              >
                {size === s.id && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                )}
                <span className="block font-serif text-lg font-semibold text-ink">{s.id}</span>
                <span className="block text-xs text-muted-foreground">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.stems} tiges</span>
                <span className="mt-1 block text-sm font-semibold tabular-nums text-ink">{formatPrice(s.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <Label htmlFor={`msg-${bouquet.id}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Carte message offerte
          </Label>
          <Textarea
            id={`msg-${bouquet.id}`}
            value={message}
            maxLength={200}
            rows={2}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Quelques mots écrits à la main par le fleuriste…"
            className="mt-2 resize-none bg-white font-serif italic"
          />
        </div>

        <div className="mt-auto pt-6">
          <Button variant="ink" size="lg" className="w-full" onClick={add} disabled={!florist}>
            Ajouter au panier · {formatPrice(chosen.price)}
          </Button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <StoreIcon className="h-3.5 w-3.5" aria-hidden />
            {florist ? `Composé par ${florist.name} · ${florist.deliveryTime}` : 'Pas encore de fleuriste dans votre ville'}
            {inCart > 0 && ` · déjà ${inCart} au panier`}
          </p>
        </div>
      </div>
    </div>
  )
}
