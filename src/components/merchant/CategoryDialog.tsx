import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Existing name when renaming. */
  initialName?: string
  existingNames: string[]
  onSave: (name: string) => void
}

export default function CategoryDialog({ open, onOpenChange, initialName, existingNames, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{initialName ? 'Renommer la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
          <DialogDescription>Les catégories organisent votre carte côté client.</DialogDescription>
        </DialogHeader>
        <CategoryForm initialName={initialName} existingNames={existingNames} onSave={onSave} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function CategoryForm({ initialName, existingNames, onSave, onCancel }: Pick<Props, 'initialName' | 'existingNames' | 'onSave'> & { onCancel: () => void }) {
  const [name, setName] = useState(initialName ?? '')
  const trimmed = name.trim()
  const duplicate = existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase() && n !== initialName)
  const valid = trimmed.length >= 2 && !duplicate

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (valid) onSave(trimmed)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cat-name">Nom</Label>
        <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. : Boissons" autoFocus />
        {duplicate && <p className="text-xs text-red-600">Cette catégorie existe déjà.</p>}
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!valid}>
          {initialName ? 'Renommer' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  )
}
