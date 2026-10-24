import { Timer } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useMerchant } from '@/store/merchant'

const PREP_OPTIONS = [10, 15, 20, 25, 30, 40, 50]

/** Open/closed switch + default preparation time selector. */
export default function StoreControls({ className }: { className?: string }) {
  const storeOpen = useMerchant((s) => s.storeOpen)
  const setStoreOpen = useMerchant((s) => s.setStoreOpen)
  const prepTime = useMerchant((s) => s.prepTime)
  const setPrepTime = useMerchant((s) => s.setPrepTime)

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div
        className={cn(
          'flex h-10 items-center gap-2.5 rounded-lg border px-3',
          storeOpen ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 bg-stone-100',
        )}
      >
        <span className={cn('relative flex h-2.5 w-2.5')} aria-hidden>
          {storeOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
          <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', storeOpen ? 'bg-emerald-500' : 'bg-stone-400')} />
        </span>
        <Label htmlFor="store-open" className="cursor-pointer text-sm font-semibold text-ink">
          {storeOpen ? 'Ouvert' : 'Fermé'}
        </Label>
        <Switch
          id="store-open"
          checked={storeOpen}
          onCheckedChange={(v) => {
            setStoreOpen(v)
            toast(v ? 'Établissement ouvert' : 'Établissement fermé', {
              description: v ? 'Vous recevez à nouveau des commandes.' : 'Votre carte est masquée des clients jusqu’à réouverture.',
            })
          }}
          aria-label="Ouvrir ou fermer l’établissement"
        />
      </div>
      <Select
        value={String(prepTime)}
        onValueChange={(v) => {
          setPrepTime(Number(v))
          toast.success(`Temps de préparation : ${v} min`)
        }}
      >
        <SelectTrigger className="h-10 w-auto gap-2 bg-card" aria-label="Temps de préparation par défaut">
          <Timer className="h-4 w-4 text-muted-foreground" aria-hidden />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PREP_OPTIONS.map((m) => (
            <SelectItem key={m} value={String(m)}>
              Préparation {m} min
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
