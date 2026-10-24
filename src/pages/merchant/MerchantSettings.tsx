import { useState, type FormEvent } from 'react'
import { MapPin, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Panel, PortalPageHeader } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import HoursEditor from '@/components/merchant/HoursEditor'
import TeamPanel from '@/components/merchant/TeamPanel'
import { DAY_KEYS, NOTIFICATION_OPTIONS, validateDay, type ShopInfo } from '@/data/portals/merchant'
import { formatPrice } from '@/lib/format'
import { useMerchant } from '@/store/merchant'

function ShopInfoPanel() {
  const shop = useMerchant((s) => s.shop)
  const saveShop = useMerchant((s) => s.saveShop)
  const [form, setForm] = useState<ShopInfo>(shop)
  const dirty = JSON.stringify(form) !== JSON.stringify(shop)
  const set = (k: keyof ShopInfo) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Vérifiez le nom et l’adresse e-mail')
      return
    }
    saveShop(form)
    toast.success('Informations enregistrées')
  }

  const fields: { key: keyof ShopInfo; label: string; type?: string; span?: boolean }[] = [
    { key: 'name', label: 'Nom de l’établissement', span: true },
    { key: 'phone', label: 'Téléphone', type: 'tel' },
    { key: 'email', label: 'E-mail de contact', type: 'email' },
    { key: 'address', label: 'Adresse', span: true },
    { key: 'postalCode', label: 'Code postal' },
    { key: 'city', label: 'Ville' },
    { key: 'siret', label: 'SIRET', span: true },
  ]

  return (
    <Panel title="Informations de l’établissement">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.span ? 'space-y-1.5 sm:col-span-2' : 'space-y-1.5'}>
            <Label htmlFor={`shop-${f.key}`}>{f.label}</Label>
            <Input id={`shop-${f.key}`} type={f.type ?? 'text'} value={form[f.key]} onChange={set(f.key)} />
          </div>
        ))}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="shop-description">Description affichée aux clients</Label>
          <Textarea id="shop-description" rows={3} value={form.description} onChange={set('description')} maxLength={280} />
          <p className="text-right text-xs text-muted-foreground">{form.description.length} / 280</p>
        </div>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="ghost" disabled={!dirty} onClick={() => setForm(shop)}>
            Annuler
          </Button>
          <Button type="submit" disabled={!dirty}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Panel>
  )
}

function HoursPanel() {
  const hours = useMerchant((s) => s.hours)
  const saveHours = useMerchant((s) => s.saveHours)
  const [draft, setDraft] = useState(hours)
  const dirty = JSON.stringify(draft) !== JSON.stringify(hours)
  const hasError = DAY_KEYS.some((k) => validateDay(draft[k]))

  return (
    <Panel
      title="Horaires d’ouverture"
      action={
        <Button
          size="sm"
          disabled={!dirty || hasError}
          onClick={() => {
            saveHours(draft)
            toast.success('Horaires mis à jour', { description: 'Ils sont visibles sur votre fiche client.' })
          }}
        >
          Enregistrer
        </Button>
      }
    >
      <div className="-my-3">
        <HoursEditor value={draft} onChange={setDraft} />
      </div>
    </Panel>
  )
}

function DeliveryPanel() {
  const delivery = useMerchant((s) => s.delivery)
  const saveDelivery = useMerchant((s) => s.saveDelivery)
  const [radius, setRadius] = useState(delivery.radiusKm)
  const [minOrder, setMinOrder] = useState(String(delivery.minOrder).replace('.', ','))
  const [fee, setFee] = useState(String(delivery.deliveryFee).replace('.', ','))
  const parse = (v: string) => Number(v.replace(',', '.'))
  const valid = parse(minOrder) >= 0 && parse(fee) >= 0 && !Number.isNaN(parse(minOrder)) && !Number.isNaN(parse(fee))
  // Rough reach estimate around Paris 2e (≈ 21 000 hab./km²).
  const households = Math.round((Math.PI * radius * radius * 21000) / 2.1 / 100) * 100

  return (
    <Panel title="Zone de livraison">
      <div className="grid gap-6 md:grid-cols-[1fr_200px]">
        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Label htmlFor="radius">Rayon de livraison</Label>
              <span className="font-semibold tabular-nums text-ink">{radius.toLocaleString('fr-FR')} km</span>
            </div>
            <Slider id="radius" min={1} max={8} step={0.5} value={[radius]} onValueChange={([v]) => setRadius(v)} aria-label="Rayon de livraison en kilomètres" />
            <p className="mt-2 text-xs text-muted-foreground">Environ {households.toLocaleString('fr-FR')} foyers dans votre zone.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="min-order">Minimum (€)</Label>
              <Input id="min-order" inputMode="decimal" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fee">Livraison (€)</Label>
              <Input id="fee" inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} />
            </div>
          </div>
          <Button
            disabled={!valid}
            onClick={() => {
              saveDelivery({ radiusKm: radius, minOrder: parse(minOrder), deliveryFee: parse(fee) })
              toast.success('Zone de livraison enregistrée', { description: `${radius} km · minimum ${formatPrice(parse(minOrder))}` })
            }}
          >
            Enregistrer la zone
          </Button>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-2xl border bg-[repeating-linear-gradient(0deg,hsl(30_18%_92%)_0_1px,transparent_1px_24px),repeating-linear-gradient(90deg,hsl(30_18%_92%)_0_1px,transparent_1px_24px)] bg-secondary/40" aria-hidden>
          <span
            className="absolute rounded-full border-2 border-brand-500 bg-brand-500/10 transition-all duration-300"
            style={{ width: `${(radius / 8) * 92}%`, height: `${(radius / 8) * 92}%` }}
          />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift">
            <MapPin className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Panel>
  )
}

function NotificationsPanel() {
  const notifications = useMerchant((s) => s.notifications)
  const setNotification = useMerchant((s) => s.setNotification)
  return (
    <Panel title="Notifications">
      <ul className="-my-3 divide-y">
        {NOTIFICATION_OPTIONS.map((o) => (
          <li key={o.key} className="flex items-center justify-between gap-4 py-3">
            <div>
              <Label htmlFor={`notif-${o.key}`} className="cursor-pointer">
                {o.label}
              </Label>
              <p className="text-xs text-muted-foreground">{o.description}</p>
            </div>
            <Switch
              id={`notif-${o.key}`}
              checked={notifications[o.key]}
              onCheckedChange={(v) => {
                setNotification(o.key, v)
                toast(`${o.label} ${v ? 'activé' : 'désactivé'}`)
              }}
            />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export default function MerchantSettings() {
  const reset = useMerchant((s) => s.reset)
  // Bumped after a reset so local form drafts re-initialise from the store.
  const [version, setVersion] = useState(0)
  return (
    <div>
      <PortalPageHeader
        title="Paramètres"
        description="Gérez votre fiche, vos horaires, votre zone de livraison et votre équipe."
        actions={
          <Button
            variant="ghost"
            onClick={() => {
              reset()
              setVersion((v) => v + 1)
              toast('Données de démonstration réinitialisées')
            }}
          >
            <RotateCcw /> Réinitialiser la démo
          </Button>
        }
      />
      <div key={version} className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ShopInfoPanel />
          <DeliveryPanel />
        </div>
        <div className="space-y-6">
          <HoursPanel />
          <NotificationsPanel />
        </div>
      </div>
      <div className="mt-6">
        <TeamPanel />
      </div>
    </div>
  )
}
