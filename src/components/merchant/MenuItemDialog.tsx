import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import SafeImage from '@/components/shared/SafeImage'
import { ALL_BADGES, BADGE_LABELS, type CatalogCategory, type CatalogItem, type ItemBadge } from '@/data/portals/merchant'
import { cn } from '@/lib/utils'

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: CatalogItem | null
  categories: CatalogCategory[]
  defaultCategoryId?: string
  onSave: (item: CatalogItem) => void
}

export default function MenuItemDialog(props: Props) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{props.item ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
          <DialogDescription>Les modifications sont visibles immédiatement sur votre fiche ColeDash.</DialogDescription>
        </DialogHeader>
        {/* Content unmounts when closed, so the form state re-initialises on every opening. */}
        <ItemForm {...props} />
      </DialogContent>
    </Dialog>
  )
}

function ItemForm({ onOpenChange, item, categories, defaultCategoryId, onSave }: Props) {
  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [price, setPrice] = useState(item ? item.price.toFixed(2).replace('.', ',') : '')
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? '')
  const [image, setImage] = useState(item?.image ?? '')
  const [available, setAvailable] = useState(item?.available ?? true)
  const [badges, setBadges] = useState<ItemBadge[]>(item?.badges ?? [])
  const [touched, setTouched] = useState(false)

  const parsedPrice = Number(price.replace(',', '.'))
  const priceValid = price.trim() !== '' && Number.isFinite(parsedPrice) && parsedPrice > 0 && parsedPrice < 1000
  const valid = name.trim().length >= 2 && priceValid && !!categoryId

  const toggleBadge = (b: ItemBadge) => setBadges((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    onSave({
      id: item?.id ?? `item-${Date.now().toString(36)}`,
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price: Math.round(parsedPrice * 100) / 100,
      image: image.trim() || PLACEHOLDER_IMAGE,
      available,
      badges,
      allergens: item?.allergens ?? [],
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="flex gap-4">
        <SafeImage src={image || PLACEHOLDER_IMAGE} alt="" wrapperClassName="h-20 w-20 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="item-image">URL de la photo</Label>
          <Input id="item-image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="item-name">Nom du produit</Label>
        <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={touched && name.trim().length < 2} />
        {touched && name.trim().length < 2 && <p className="text-xs text-red-600">Indiquez un nom d’au moins 2 caractères.</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="item-desc">Description</Label>
        <Textarea
          id="item-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ingrédients, accompagnement…"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="item-price">Prix (€ TTC)</Label>
          <Input
            id="item-price"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="12,90"
            aria-invalid={touched && !priceValid}
          />
          {touched && !priceValid && <p className="text-xs text-red-600">Prix invalide.</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-cat">Catégorie</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="item-cat">
              <SelectValue placeholder="Choisir" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Badges</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_BADGES.map((b) => {
            const on = badges.includes(b)
            return (
              <button
                key={b}
                type="button"
                aria-pressed={on}
                onClick={() => toggleBadge(b)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  on ? 'border-brand-600 bg-brand-50 text-brand-700' : 'bg-card text-muted-foreground hover:text-ink',
                )}
              >
                {BADGE_LABELS[b]}
              </button>
            )
          })}
        </div>
      </fieldset>
      <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
        <div>
          <Label htmlFor="item-available">Disponible à la commande</Label>
          <p className="text-xs text-muted-foreground">Désactivez pour signaler une rupture.</p>
        </div>
        <Switch id="item-available" checked={available} onCheckedChange={setAvailable} />
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button type="submit">{item ? 'Enregistrer' : 'Ajouter le produit'}</Button>
      </DialogFooter>
    </form>
  )
}
