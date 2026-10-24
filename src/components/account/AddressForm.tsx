import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormField from './FormField'
import type { Address } from '@/types'
import { cn } from '@/lib/utils'

export type AddressInput = Omit<Address, 'id'> & { id?: string }

const LABELS = ['Maison', 'Travail', 'Autre']

interface Props {
  initial?: Partial<Address>
  submitLabel?: string
  onSubmit: (address: AddressInput) => void
  onCancel?: () => void
  idPrefix?: string
}

type Errors = Partial<Record<'label' | 'line1' | 'postalCode' | 'city', string>>

function validateAddress(a: Omit<Address, 'id'>): Errors {
  const errors: Errors = {}
  if (!a.label.trim()) errors.label = 'Donnez un nom à cette adresse.'
  if (a.line1.trim().length < 5) errors.line1 = 'Indiquez le numéro et le nom de la rue.'
  if (!/^\d{5}$/.test(a.postalCode.trim())) errors.postalCode = 'Code postal à 5 chiffres.'
  if (a.city.trim().length < 2) errors.city = 'Indiquez la ville.'
  return errors
}

export default function AddressForm({ initial, submitLabel = 'Enregistrer l’adresse', onSubmit, onCancel, idPrefix = 'addr' }: Props) {
  const [form, setForm] = useState({
    label: initial?.label ?? 'Maison',
    line1: initial?.line1 ?? '',
    postalCode: initial?.postalCode ?? '',
    city: initial?.city ?? '',
    instructions: initial?.instructions ?? '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateAddress(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSubmit({
      ...(initial?.id ? { id: initial.id } : {}),
      label: form.label.trim(),
      line1: form.line1.trim(),
      postalCode: form.postalCode.trim(),
      city: form.city.trim(),
      instructions: form.instructions.trim() || undefined,
    })
  }

  const id = (k: string) => `${idPrefix}-${k}`

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink">Type d’adresse</legend>
        <div className="flex flex-wrap gap-2">
          {LABELS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={form.label === l}
              onClick={() => set('label')(l)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                form.label === l ? 'border-ink bg-ink text-white' : 'bg-card hover:border-ink/40',
              )}
            >
              {l}
            </button>
          ))}
        </div>
        {!LABELS.slice(0, 2).includes(form.label) && (
          <FormField id={id('label')} label="Nom de l’adresse" error={errors.label} className="mt-3">
            <Input
              id={id('label')}
              value={form.label === 'Autre' ? '' : form.label}
              placeholder="Chez mes parents, Salle de sport…"
              onChange={(e) => set('label')(e.target.value || 'Autre')}
              aria-describedby={`${id('label')}-msg`}
            />
          </FormField>
        )}
      </fieldset>
      <FormField id={id('line1')} label="Adresse" error={errors.line1}>
        <Input
          id={id('line1')}
          value={form.line1}
          onChange={(e) => set('line1')(e.target.value)}
          placeholder="24 rue de la Roquette"
          autoComplete="street-address"
          aria-invalid={!!errors.line1}
          aria-describedby={`${id('line1')}-msg`}
        />
      </FormField>
      <div className="grid grid-cols-[120px_1fr] gap-3">
        <FormField id={id('postalCode')} label="Code postal" error={errors.postalCode}>
          <Input
            id={id('postalCode')}
            value={form.postalCode}
            onChange={(e) => set('postalCode')(e.target.value.replace(/\D/g, '').slice(0, 5))}
            inputMode="numeric"
            placeholder="75011"
            autoComplete="postal-code"
            aria-invalid={!!errors.postalCode}
            aria-describedby={`${id('postalCode')}-msg`}
          />
        </FormField>
        <FormField id={id('city')} label="Ville" error={errors.city}>
          <Input
            id={id('city')}
            value={form.city}
            onChange={(e) => set('city')(e.target.value)}
            placeholder="Paris"
            autoComplete="address-level2"
            aria-invalid={!!errors.city}
            aria-describedby={`${id('city')}-msg`}
          />
        </FormField>
      </div>
      <FormField id={id('instructions')} label="Instructions pour le livreur (facultatif)">
        <Textarea
          id={id('instructions')}
          value={form.instructions}
          onChange={(e) => set('instructions')(e.target.value.slice(0, 160))}
          placeholder="Digicode, étage, interphone…"
          rows={2}
        />
      </FormField>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="ink">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}
