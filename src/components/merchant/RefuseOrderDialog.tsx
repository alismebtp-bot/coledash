import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { REFUSAL_REASONS, type MerchantOrder } from '@/data/portals/merchant'

interface Props {
  order: MerchantOrder | null
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export default function RefuseOrderDialog({ order, onOpenChange, onConfirm }: Props) {
  const [reason, setReason] = useState<string>(REFUSAL_REASONS[0])
  const [details, setDetails] = useState('')

  const submit = () => {
    const full = reason === 'Autre raison' ? details.trim() || 'Autre raison' : details.trim() ? `${reason} — ${details.trim()}` : reason
    onConfirm(full)
    setReason(REFUSAL_REASONS[0])
    setDetails('')
  }

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refuser la commande {order?.number}</DialogTitle>
          <DialogDescription>Le client sera remboursé intégralement et recevra le motif indiqué.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
          {REFUSAL_REASONS.map((r) => (
            <Label
              key={r}
              htmlFor={`refuse-${r}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
            >
              <RadioGroupItem id={`refuse-${r}`} value={r} />
              {r}
            </Label>
          ))}
        </RadioGroup>
        <div className="space-y-1.5">
          <Label htmlFor="refuse-details">Précisions {reason === 'Autre raison' ? '' : '(facultatif)'}</Label>
          <Textarea id="refuse-details" rows={2} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Ex. : plus de magret ce midi" />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={submit} disabled={reason === 'Autre raison' && !details.trim()}>
            Refuser la commande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
