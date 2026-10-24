import { useState, type FormEvent } from 'react'
import { Gift, Percent, Euro, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PROMOTION_TYPE_LABELS, type CatalogItem, type Promotion, type PromotionType } from '@/data/portals/merchant'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<PromotionType, typeof Percent> = { percent: Percent, amount: Euro, free_delivery: Truck, bogo: Gift }

const toInputDate = (d: Date) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CatalogItem[]
  onCreate: (p: Promotion) => void
}

export default function PromotionDialog({ open, onOpenChange, items, onCreate }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer une promotion</DialogTitle>
          <DialogDescription>Elle apparaîtra sur votre fiche et dans les recherches des clients ColeDash.</DialogDescription>
        </DialogHeader>
        <PromotionForm items={items} onCreate={onCreate} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function PromotionForm({ items, onCreate, onCancel }: { items: CatalogItem[]; onCreate: (p: Promotion) => void; onCancel: () => void }) {
  const today = new Date()
  const [type, setType] = useState<PromotionType>('percent')
  const [name, setName] = useState('')
  const [value, setValue] = useState('15')
  const [itemId, setItemId] = useState(items[0]?.id ?? '')
  const [minOrder, setMinOrder] = useState('20')
  const [newOnly, setNewOnly] = useState(false)
  const [start, setStart] = useState(toInputDate(today))
  const [end, setEnd] = useState(toInputDate(new Date(today.getTime() + 14 * 86_400_000)))
  const [touched, setTouched] = useState(false)

  const numValue = Number(value.replace(',', '.'))
  const needsValue = type === 'percent' || type === 'amount'
  const valueOk = !needsValue || (numValue > 0 && (type === 'amount' || numValue <= 80))
  const datesOk = !!start && !!end && end >= start
  const valid = name.trim().length >= 3 && valueOk && datesOk && (type !== 'bogo' || !!itemId)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    const min = Number(minOrder.replace(',', '.'))
    onCreate({
      id: `pr-${Date.now().toString(36)}`,
      name: name.trim(),
      type,
      value: needsValue ? numValue : undefined,
      itemId: type === 'bogo' ? itemId : undefined,
      minOrder: min > 0 ? min : undefined,
      newCustomersOnly: newOnly,
      startDate: new Date(`${start}T00:00:00`).toISOString(),
      endDate: new Date(`${end}T23:59:59`).toISOString(),
      paused: false,
      uses: 0,
      revenue: 0,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Type d’offre</legend>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PROMOTION_TYPE_LABELS) as PromotionType[]).map((t) => {
            const Icon = TYPE_ICONS[t]
            const on = t === type
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setType(t)
                  if (t === 'percent') setValue('15')
                  if (t === 'amount') setValue('5')
                }}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'bg-card text-ink hover:bg-secondary',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {PROMOTION_TYPE_LABELS[t]}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="promo-name">Nom de la promotion</Label>
        <Input id="promo-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. : Midi gourmand" />
        {touched && name.trim().length < 3 && <p className="text-xs text-red-600">Au moins 3 caractères.</p>}
      </div>

      {needsValue && (
        <div className="space-y-1.5">
          <Label htmlFor="promo-value">{type === 'percent' ? 'Réduction (%)' : 'Montant offert (€)'}</Label>
          <Input id="promo-value" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
          {touched && !valueOk && <p className="text-xs text-red-600">{type === 'percent' ? 'Entre 1 et 80 %.' : 'Montant invalide.'}</p>}
        </div>
      )}
      {type === 'bogo' && (
        <div className="space-y-1.5">
          <Label htmlFor="promo-item">Produit concerné</Label>
          <Select value={itemId} onValueChange={setItemId}>
            <SelectTrigger id="promo-item">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="promo-start">Début</Label>
          <Input id="promo-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="promo-end">Fin</Label>
          <Input id="promo-end" type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} />
        </div>
        {touched && !datesOk && <p className="col-span-2 text-xs text-red-600">La date de fin doit suivre la date de début.</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="promo-min">Commande minimum (€)</Label>
        <Input id="promo-min" inputMode="decimal" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="0 = aucune condition" />
      </div>
      <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
        <div>
          <Label htmlFor="promo-new">Nouveaux clients uniquement</Label>
          <p className="text-xs text-muted-foreground">Réservée à une première commande chez vous.</p>
        </div>
        <Switch id="promo-new" checked={newOnly} onCheckedChange={setNewOnly} />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Créer la promotion</Button>
      </DialogFooter>
    </form>
  )
}
