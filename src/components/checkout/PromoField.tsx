import { useState, type FormEvent } from 'react'
import { Check, Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PROMO_CODES, findPromo, type PromoCode } from '@/lib/pricing'

interface Props {
  applied: PromoCode | undefined
  onApply: (promo: PromoCode) => void
  onRemove: () => void
}

export default function PromoField({ applied, onApply, onRemove }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return setError('Saisissez un code.')
    const promo = findPromo(code)
    if (!promo) return setError('Ce code n’existe pas ou a expiré.')
    setError(null)
    setCode('')
    onApply(promo)
  }

  if (applied) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-emerald-900">{applied.code}</p>
          <p className="truncate text-xs text-emerald-800">{applied.label}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Retirer le code promo"
          className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-900 hover:bg-emerald-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={submit} className="flex gap-2" noValidate>
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="promo" className="sr-only">
            Code promo
          </label>
          <Input
            id="promo"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            placeholder="Code promo"
            className="pl-9 uppercase"
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? 'promo-error' : undefined}
          />
        </div>
        <Button type="submit" variant="outline">
          Appliquer
        </Button>
      </form>
      {error && (
        <p id="promo-error" className="mt-1.5 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="sr-only">Codes disponibles :</span>
        {PROMO_CODES.map((p) => (
          <button
            key={p.code}
            type="button"
            onClick={() => onApply(p)}
            title={p.label}
            className="rounded-full border border-dashed border-brand-200 bg-brand-50/60 px-2.5 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
          >
            {p.code} <span className="text-brand-700/70">· {p.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
