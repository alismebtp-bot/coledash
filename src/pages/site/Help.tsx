import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FREE_DELIVERY_THRESHOLD } from '@/lib/pricing'

const FAQ = [
  {
    q: 'Combien coûte la livraison ?',
    a: `Les frais dépendent du commerce (de 1,49 € à 4,90 €) et sont affichés avant la commande. La livraison est offerte dès ${FREE_DELIVERY_THRESHOLD} € d’achat. Des frais de service de 5 % (entre 0,99 € et 3,99 €) s’appliquent.`,
  },
  {
    q: 'Puis-je programmer une livraison ?',
    a: 'Oui. À l’étape de paiement, choisissez « Programmer » puis un jour et un créneau de 30 minutes, jusqu’à 6 jours à l’avance.',
  },
  {
    q: 'Comment suivre ma commande ?',
    a: 'Dès la validation, la page de suivi affiche chaque étape en temps réel et la position de votre livreur. Retrouvez-la à tout moment dans « Mes commandes ».',
  },
  {
    q: 'Puis-je annuler une commande ?',
    a: 'Tant que le commerçant n’a pas commencé la préparation, vous pouvez annuler depuis la page de suivi et êtes remboursé intégralement.',
  },
  {
    q: 'Un article manque ou est abîmé, que faire ?',
    a: 'Écrivez-nous via le formulaire ci-dessous dans les 48 h avec votre numéro de commande : nous vous remboursons l’article ou vous offrons un avoir.',
  },
  {
    q: 'Les fleurs sont-elles livrées avec un message ?',
    a: 'Oui, vous pouvez ajouter le nom du destinataire et un mot de 200 caractères, imprimé sur une carte glissée dans le bouquet.',
  },
]

export default function Help() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    toast.success('Message envoyé', { description: 'Notre équipe vous répond sous 2 h en moyenne.' })
    e.currentTarget.reset()
  }

  return (
    <div className="container max-w-5xl py-10 sm:py-14">
      <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Aide & contact</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Une question sur une commande ? La réponse est sûrement ci-dessous. Sinon, notre équipe répond 7j/7 de 8 h à minuit.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: MessageCircle, title: 'Chat', text: 'Réponse en 3 min', action: () => toast('Le chat ouvre bientôt', { description: 'Utilisez le formulaire en attendant.' }) },
          { icon: Phone, title: '01 84 88 20 20', text: 'Appel non surtaxé', href: 'tel:+33184882020' },
          { icon: Mail, title: 'aide@coledash.fr', text: 'Réponse sous 2 h', href: 'mailto:aide@coledash.fr' },
        ].map((c) => {
          const inner = (
            <>
              <c.icon className="h-5 w-5 text-brand-600" aria-hidden />
              <p className="mt-3 font-semibold text-ink">{c.title}</p>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </>
          )
          const cls = 'block rounded-2xl border bg-card p-5 text-left shadow-soft transition-shadow hover:shadow-lift'
          return c.href ? (
            <a key={c.title} href={c.href} className={cls}>
              {inner}
            </a>
          ) : (
            <button key={c.title} type="button" onClick={c.action} className={cls}>
              {inner}
            </button>
          )
        })}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <h2 className="text-2xl font-bold text-ink">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="mt-4">
            {FAQ.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-sm text-muted-foreground">
            Une commande en cours ? <Link to="/commandes" className="font-semibold text-ink underline underline-offset-4">Voir mes commandes</Link>
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Écrivez-nous</h2>
          {sent && <p className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Merci ! Votre message a bien été transmis.</p>}
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="help-email">E-mail</Label>
              <Input id="help-email" name="email" type="email" required autoComplete="email" placeholder="vous@exemple.fr" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="help-order">N° de commande (facultatif)</Label>
              <Input id="help-order" name="order" placeholder="CD-12345" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="help-msg">Message</Label>
              <Textarea id="help-msg" name="message" required minLength={10} rows={5} placeholder="Décrivez votre demande…" />
            </div>
            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}
