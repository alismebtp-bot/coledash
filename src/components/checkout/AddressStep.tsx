import { useState } from 'react'
import { Home, MapPin, Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import AddressForm from '@/components/account/AddressForm'
import { OptionTile } from './CheckoutSection'
import { useAuth } from '@/store/auth'
import type { Address } from '@/types'

interface Props {
  value: Address | null
  onChange: (a: Address | null) => void
  instructions: string
  onInstructions: (v: string) => void
}

export default function AddressStep({ value, onChange, instructions, onInstructions }: Props) {
  const user = useAuth((s) => s.user)
  const addresses = useAuth((s) => s.addresses)
  const saveAddress = useAuth((s) => s.saveAddress)
  const [adding, setAdding] = useState(!value)

  const select = (a: Address) => {
    onChange(a)
    onInstructions(a.instructions ?? '')
  }

  if (!user) {
    // Invité : saisie libre, non enregistrée
    if (value && !adding) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border bg-background p-3">
            <MapPin className="mt-0.5 h-5 w-5 text-brand-600" aria-hidden />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold text-ink">{value.line1}</p>
              <p className="text-muted-foreground">
                {value.postalCode} {value.city}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
              <Pencil aria-hidden /> Modifier
            </Button>
          </div>
          <InstructionsField value={instructions} onChange={onInstructions} />
        </div>
      )
    }
    return (
      <AddressForm
        idPrefix="guest-addr"
        initial={value ?? undefined}
        submitLabel="Livrer à cette adresse"
        onSubmit={(a) => {
          onChange({ ...a, id: 'guest' })
          onInstructions(a.instructions ?? '')
          setAdding(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {addresses.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Adresses enregistrées">
          {addresses.map((a) => (
            <OptionTile key={a.id} selected={value?.id === a.id} onSelect={() => select(a)} className="flex gap-3">
              <Home className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
              <span className="min-w-0 text-sm">
                <span className="block font-semibold text-ink">{a.label}</span>
                <span className="block truncate text-muted-foreground">{a.line1}</span>
                <span className="block text-muted-foreground">
                  {a.postalCode} {a.city}
                </span>
              </span>
            </OptionTile>
          ))}
        </div>
      )}
      {adding || addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed p-4">
          <p className="mb-3 text-sm font-semibold text-ink">Nouvelle adresse</p>
          <AddressForm
            idPrefix="new-addr"
            submitLabel="Enregistrer et livrer ici"
            onCancel={addresses.length ? () => setAdding(false) : undefined}
            onSubmit={(a) => {
              const saved = saveAddress(a)
              select(saved)
              setAdding(false)
            }}
          />
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus aria-hidden /> Ajouter une adresse
        </Button>
      )}
      {value && <InstructionsField value={instructions} onChange={onInstructions} />}
    </div>
  )
}

function InstructionsField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="delivery-instructions">Instructions pour le livreur</Label>
      <Textarea
        id="delivery-instructions"
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 160))}
        placeholder="Digicode, étage, laisser devant la porte…"
      />
    </div>
  )
}
