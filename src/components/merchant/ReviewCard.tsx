import { useState } from 'react'
import { CornerDownRight, Pencil, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
import { StarRating } from '@/components/shared/Rating'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { MerchantReview } from '@/data/portals/merchant'
import { formatDate, formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useMerchant } from '@/store/merchant'

const TEMPLATES = [
  'Merci beaucoup pour votre retour, toute l’équipe est ravie !',
  'Merci pour votre avis. Nous sommes désolés pour ce désagrément et en avons parlé en cuisine.',
]

export default function ReviewCard({ review }: { review: MerchantReview }) {
  const replyToReview = useMerchant((s) => s.replyToReview)
  const toggleHelpful = useMerchant((s) => s.toggleHelpful)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEdit = () => {
    setDraft(review.reply?.text ?? '')
    setEditing(true)
  }
  const submit = () => {
    if (!draft.trim()) return
    replyToReview(review.id, draft.trim())
    setEditing(false)
    toast.success('Réponse publiée', { description: `${review.author} sera notifié(e).` })
  }

  const initials = review.author
    .split(' ')
    .map((p) => p[0])
    .join('')

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-soft">
      <header className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
            review.rating >= 4 ? 'bg-emerald-50 text-emerald-800' : review.rating === 3 ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700',
          )}
          aria-hidden
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-sans text-sm font-semibold text-ink">{review.author}</h3>
            <StarRating value={review.rating} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground" title={formatDate(review.date)}>
            {formatRelative(review.date)} · {review.items.join(', ')}
          </p>
        </div>
        {!review.reply && <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">À traiter</span>}
      </header>

      <p className="mt-3 text-sm leading-relaxed text-ink">{review.comment}</p>

      {review.reply && !editing && (
        <div className="mt-4 rounded-xl bg-secondary/60 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <CornerDownRight className="h-3.5 w-3.5" aria-hidden /> Votre réponse · {formatRelative(review.reply.date)}
          </p>
          <p className="mt-1 text-sm text-ink">{review.reply.text}</p>
        </div>
      )}

      {editing && (
        <div className="mt-4 space-y-2">
          <label htmlFor={`reply-${review.id}`} className="sr-only">
            Votre réponse à {review.author}
          </label>
          <Textarea
            id={`reply-${review.id}`}
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Répondre à ${review.author}…`}
            autoFocus
          />
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDraft(t)}
                className="max-w-full truncate rounded-full border px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-ink"
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button size="sm" onClick={submit} disabled={!draft.trim()}>
              Publier la réponse
            </Button>
          </div>
        </div>
      )}

      {!editing && (
        <footer className="mt-4 flex items-center gap-2">
          <Button variant={review.reply ? 'ghost' : 'soft'} size="sm" onClick={startEdit}>
            {review.reply ? <Pencil /> : <CornerDownRight />}
            {review.reply ? 'Modifier la réponse' : 'Répondre'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={!!review.markedHelpful}
            onClick={() => toggleHelpful(review.id)}
            className={cn('ml-auto', review.markedHelpful && 'text-brand-700')}
          >
            <ThumbsUp className={cn(review.markedHelpful && 'fill-current')} />
            Utile · {review.helpful}
          </Button>
        </footer>
      )}
    </article>
  )
}
