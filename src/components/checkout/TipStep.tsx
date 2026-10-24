import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PRESETS = [0, 1, 2, 3]

export default function TipStep({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [custom, setCustom] = useState(!PRESETS.includes(value))
  const [raw, setRaw] = useState(custom ? String(value) : '')

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Heart className="h-4 w-4 text-brand-600" aria-hidden />
        100 % du pourboire est reversé à votre livreur.
      </p>
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Pourboire">
        {PRESETS.map((p) => {
          const active = !custom && value === p
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setCustom(false)
                onChange(p)
              }}
              className={cn(
                'rounded-lg border py-2 text-sm font-semibold transition-colors',
                active ? 'border-ink bg-ink text-white' : 'bg-background hover:border-ink/40',
              )}
            >
              {p === 0 ? 'Non' : `${p} €`}
            </button>
          )
        })}
        <button
          type="button"
          role="radio"
          aria-checked={custom}
          onClick={() => {
            setCustom(true)
            onChange(Number(raw.replace(',', '.')) || 0)
          }}
          className={cn(
            'rounded-lg border py-2 text-sm font-semibold transition-colors',
            custom ? 'border-ink bg-ink text-white' : 'bg-background hover:border-ink/40',
          )}
        >
          Autre
        </button>
      </div>
      {custom && (
        <div className="relative max-w-[160px]">
          <label htmlFor="tip-custom" className="sr-only">
            Montant du pourboire en euros
          </label>
          <Input
            id="tip-custom"
            inputMode="decimal"
            autoFocus
            value={raw}
            placeholder="5"
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d,.]/g, '').slice(0, 5)
              setRaw(v)
              const n = Math.min(Number(v.replace(',', '.')) || 0, 50)
              onChange(Math.round(n * 100) / 100)
            }}
            className="pr-8"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
        </div>
      )}
    </div>
  )
}
