import { useState } from 'react'
import { Home, MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/shared/EmptyState'
import AddressForm from './AddressForm'
import { useAuth } from '@/store/auth'

export default function AddressesSection() {
  const addresses = useAuth((s) => s.addresses)
  const defaultId = useAuth((s) => s.defaultAddressId)
  const save = useAuth((s) => s.saveAddress)
  const remove = useAuth((s) => s.removeAddress)
  const setDefault = useAuth((s) => s.setDefaultAddress)
  const [editing, setEditing] = useState<string | 'new' | null>(null)

  return (
    <div className="space-y-4">
      {addresses.length === 0 && editing !== 'new' && (
        <EmptyState icon={MapPin} title="Aucune adresse enregistrée" description="Ajoutez une adresse pour commander plus vite." />
      )}
      <ul className="grid gap-3 md:grid-cols-2">
        {addresses.map((a) => {
          const isDefault = (defaultId ?? addresses[0]?.id) === a.id
          if (editing === a.id) {
            return (
              <li key={a.id} className="rounded-2xl border bg-background p-4 md:col-span-2">
                <AddressForm
                  idPrefix={`edit-${a.id}`}
                  initial={a}
                  onCancel={() => setEditing(null)}
                  onSubmit={(input) => {
                    save(input)
                    setEditing(null)
                    toast.success('Adresse mise à jour')
                  }}
                />
              </li>
            )
          }
          return (
            <li key={a.id} className="flex flex-col rounded-2xl border bg-background p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Home className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-ink">
                    {a.label}
                    {isDefault && <Badge variant="success">Par défaut</Badge>}
                  </div>
                  <p className="text-ink">{a.line1}</p>
                  <p className="text-muted-foreground">
                    {a.postalCode} {a.city}
                  </p>
                  {a.instructions && <p className="mt-1 text-xs text-muted-foreground">{a.instructions}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1 border-t pt-3">
                {!isDefault && (
                  <Button size="sm" variant="ghost" onClick={() => setDefault(a.id)}>
                    <Star aria-hidden /> Définir par défaut
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setEditing(a.id)}>
                  <Pencil aria-hidden /> Modifier
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    remove(a.id)
                    toast('Adresse supprimée', { action: { label: 'Annuler', onClick: () => save(a) } })
                  }}
                >
                  <Trash2 aria-hidden /> Supprimer
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
      {editing === 'new' ? (
        <div className="rounded-2xl border border-dashed p-4">
          <p className="mb-3 font-semibold text-ink">Nouvelle adresse</p>
          <AddressForm
            idPrefix="account-new"
            onCancel={() => setEditing(null)}
            onSubmit={(input) => {
              save(input)
              setEditing(null)
              toast.success('Adresse ajoutée')
            }}
          />
        </div>
      ) : (
        <Button variant="outline" onClick={() => setEditing('new')}>
          <Plus aria-hidden /> Ajouter une adresse
        </Button>
      )}
    </div>
  )
}
