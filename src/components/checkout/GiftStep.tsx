import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormField from '@/components/account/FormField'

export const GIFT_MAX = 200

interface Props {
  recipient: string
  message: string
  onRecipient: (v: string) => void
  onMessage: (v: string) => void
  error?: string
}

export default function GiftStep({ recipient, message, onRecipient, onMessage, error }: Props) {
  return (
    <div className="space-y-4">
      <FormField id="gift-recipient" label="Nom du destinataire" error={error} hint="Le livreur demandera cette personne à la remise du bouquet.">
        <Input
          id="gift-recipient"
          value={recipient}
          onChange={(e) => onRecipient(e.target.value.slice(0, 60))}
          placeholder="Léa Dubois"
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby="gift-recipient-msg"
        />
      </FormField>
      <div className="space-y-1.5">
        <label htmlFor="gift-message" className="text-sm font-medium text-ink">
          Message sur la carte (facultatif)
        </label>
        <div className="rounded-xl border bg-[#fffaf3] p-3 shadow-inner">
          <Textarea
            id="gift-message"
            value={message}
            onChange={(e) => onMessage(e.target.value.slice(0, GIFT_MAX))}
            rows={3}
            placeholder="Joyeux anniversaire ! Je t’embrasse fort."
            className="resize-none border-0 bg-transparent font-serif text-base italic shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-describedby="gift-count"
          />
        </div>
        <p id="gift-count" className="text-right text-xs text-muted-foreground tabular-nums">
          {message.length}/{GIFT_MAX}
        </p>
      </div>
    </div>
  )
}
