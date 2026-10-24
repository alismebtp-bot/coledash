import { useId, useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import SafeImage from '@/components/shared/SafeImage'
import QuantityStepper from '@/components/shared/QuantityStepper'
import MenuItemBadges from './MenuItemBadges'
import type { MenuItem, Restaurant } from '@/data/restaurants'
import { useAddToCart } from '@/hooks/useAddToCart'
import { formatPrice } from '@/lib/format'
import { round } from '@/lib/pricing'
import { cn } from '@/lib/utils'

interface Props {
  restaurant: Restaurant
  item: MenuItem | null
  onClose: () => void
}

export default function MenuItemDialog({ restaurant, item, onClose }: Props) {
  // Keep showing the last dish while the closing animation plays.
  const [shown, setShown] = useState<MenuItem | null>(item)
  const [prev, setPrev] = useState<MenuItem | null>(item)
  const [session, setSession] = useState(0)
  if (item !== prev) {
    setPrev(item)
    if (item) {
      setShown(item)
      setSession((n) => n + 1)
    }
  }
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-xl flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:rounded-3xl [&>button:last-child]:hidden"
      >
        {shown && <ItemForm key={`${shown.id}-${session}`} restaurant={restaurant} item={shown} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  )
}

function deltaLabel(price?: number) {
  return price ? `+ ${formatPrice(price)}` : null
}

function ItemForm({ restaurant, item, onDone }: { restaurant: Restaurant; item: MenuItem; onDone: () => void }) {
  const uid = useId()
  const addToCart = useAddToCart()
  const options = item.options ?? []
  const extras = item.extras ?? []
  const [choices, setChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.filter((o) => o.required && o.choices[0]).map((o) => [o.id, o.choices[0].id])),
  )
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')

  const optionDelta = options.reduce((sum, o) => sum + (o.choices.find((c) => c.id === choices[o.id])?.price ?? 0), 0)
  const extrasDelta = extras.filter((e) => selectedExtras.includes(e.id)).reduce((s, e) => s + e.price, 0)
  const unitPrice = round(item.price + optionDelta + extrasDelta)
  const missing = options.filter((o) => o.required && !choices[o.id])

  const submit = () => {
    if (missing.length) return
    const labels = [
      ...options.flatMap((o) => {
        const c = o.choices.find((ch) => ch.id === choices[o.id])
        return c ? [c.name] : []
      }),
      ...extras.filter((e) => selectedExtras.includes(e.id)).map((e) => `+ ${e.name}`),
    ]
    const ok = addToCart({
      productId: item.id,
      vendorId: restaurant.id,
      vendorName: restaurant.name,
      vendorKind: 'restaurant',
      vendorDeliveryFee: restaurant.deliveryFee,
      vendorMinOrder: restaurant.minOrder,
      name: item.name,
      image: item.image,
      unitPrice,
      quantity,
      options: labels.length ? labels : undefined,
      note: note.trim() || undefined,
    })
    if (ok) onDone()
  }

  return (
    <>
      <div className="overflow-y-auto overscroll-contain">
        <div className="relative">
          <SafeImage src={item.image} alt={item.name} wrapperClassName="aspect-[16/9] w-full" />
          <button
            type="button"
            onClick={onDone}
            aria-label="Fermer"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow transition hover:scale-105"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <DialogTitle className="text-2xl font-bold leading-tight text-ink">{item.name}</DialogTitle>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={cn('text-lg font-bold', item.originalPrice ? 'text-brand-600' : 'text-ink')}>{formatPrice(item.price)}</span>
              {item.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>}
            </div>
            <DialogDescription className="mt-2 text-[15px] text-muted-foreground">{item.description}</DialogDescription>
            <MenuItemBadges item={item} className="mt-3" />
            {!!item.allergens?.length && (
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold text-ink">Allergènes :</span> {item.allergens.join(', ')}
              </p>
            )}
          </div>

          {options.map((o) => (
            <fieldset key={o.id} className="space-y-2">
              <legend className="mb-2 flex w-full items-center justify-between">
                <span className="font-display text-base font-semibold text-ink">{o.name}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                    o.required ? 'bg-ink text-white' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {o.required ? 'Obligatoire' : 'Facultatif'}
                </span>
              </legend>
              <RadioGroup
                value={choices[o.id] ?? ''}
                onValueChange={(v) => setChoices((prev) => ({ ...prev, [o.id]: v }))}
                className="gap-0 overflow-hidden rounded-xl border"
              >
                {o.choices.map((c) => {
                  const id = `${uid}-${o.id}-${c.id}`
                  return (
                    <label
                      key={c.id}
                      htmlFor={id}
                      className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/60 has-[[data-state=checked]]:bg-brand-50/60"
                    >
                      <RadioGroupItem id={id} value={c.id} className="border-ink/40 text-brand-600" />
                      <span className="flex-1 font-medium text-ink">{c.name}</span>
                      {deltaLabel(c.price) && <span className="text-muted-foreground">{deltaLabel(c.price)}</span>}
                    </label>
                  )
                })}
              </RadioGroup>
            </fieldset>
          ))}

          {extras.length > 0 && (
            <fieldset className="space-y-2">
              <legend className="mb-2 flex w-full items-center justify-between">
                <span className="font-display text-base font-semibold text-ink">Suppléments</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">Facultatif</span>
              </legend>
              <div className="overflow-hidden rounded-xl border">
                {extras.map((e) => {
                  const id = `${uid}-${e.id}`
                  const checked = selectedExtras.includes(e.id)
                  return (
                    <label
                      key={e.id}
                      htmlFor={id}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 border-b px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-muted/60',
                        checked && 'bg-brand-50/60',
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={(v) =>
                          setSelectedExtras((prev) => (v ? [...prev, e.id] : prev.filter((x) => x !== e.id)))
                        }
                        className="border-ink/40 data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600"
                      />
                      <span className="flex-1 font-medium text-ink">{e.name}</span>
                      <span className="text-muted-foreground">+ {formatPrice(e.price)}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          <div className="space-y-2">
            <label htmlFor={`${uid}-note`} className="font-display text-base font-semibold text-ink">
              Une précision pour le restaurant ?
            </label>
            <Textarea
              id={`${uid}-note`}
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 140))}
              placeholder="Ex. : sans oignons, sauce à part…"
              rows={2}
              className="resize-none rounded-xl bg-card"
            />
            <p className="text-right text-xs text-muted-foreground">{note.length}/140</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t bg-background/95 p-4 backdrop-blur sm:px-6">
        <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={20} label={`Quantité de ${item.name}`} />
        <Button variant="ink" size="lg" className="flex-1 justify-between" onClick={submit} disabled={missing.length > 0}>
          <span>{missing.length ? `Choisir : ${missing[0].name.toLowerCase()}` : 'Ajouter au panier'}</span>
          <span className="tabular-nums">{formatPrice(round(unitPrice * quantity))}</span>
        </Button>
      </div>
    </>
  )
}
