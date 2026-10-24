import { useState } from 'react'
import { Check, ChevronDown, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import SafeImage from '@/components/shared/SafeImage'
import { cities } from '@/data/cities'
import { useCity } from '@/store/city'
import { cn } from '@/lib/utils'

export function CityPickerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { cityId, setCity } = useCity()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Où livrer ?</DialogTitle>
          <DialogDescription>Choisissez votre ville pour voir les commerces qui livrent chez vous.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cities.map((c) => {
            const active = c.id === cityId
            return (
              <button
                key={c.id}
                type="button"
                disabled={!c.available}
                onClick={() => {
                  setCity(c.id)
                  onOpenChange(false)
                }}
                className={cn(
                  'group relative overflow-hidden rounded-xl text-left ring-2 transition',
                  active ? 'ring-brand-600' : 'ring-transparent hover:ring-ink/20',
                  !c.available && 'cursor-not-allowed opacity-60',
                )}
              >
                <SafeImage src={c.image} alt="" wrapperClassName="aspect-[4/3]" className="transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="font-display text-lg font-bold leading-tight">{c.name}</p>
                  <p className="text-xs text-white/75">{c.available ? c.region : 'Bientôt disponible'}</p>
                </div>
                {active && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CityPicker({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false)
  const { city } = useCity()
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors',
          tone === 'light' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-secondary text-ink hover:bg-secondary/70',
          className,
        )}
        aria-label={`Ville de livraison : ${city.name}. Changer`}
      >
        <MapPin className="h-4 w-4 text-brand-600" aria-hidden />
        {city.name}
        <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
      </button>
      <CityPickerDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
