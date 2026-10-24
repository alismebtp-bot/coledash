import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Bike, Clock, Star } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
  image: string
  quote: string
}

export default function AuthShell({ title, subtitle, children, image, quote }: Props) {
  return (
    <div className="container py-8 pb-28 md:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-soft lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <SafeImage src={image} alt="" wrapperClassName="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="font-display text-2xl font-bold leading-snug">{quote}</p>
            <ul className="mt-6 space-y-2 text-sm text-white/85">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden /> Livraison en 30 minutes en moyenne
              </li>
              <li className="flex items-center gap-2">
                <Bike className="h-4 w-4" aria-hidden /> 2 400 commerces à Paris, Lyon, Marseille et Nice
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4" aria-hidden /> 1 point fidélité par euro dépensé
              </li>
            </ul>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-w-0 p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-1.5 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}

export function DemoNotice() {
  return (
    <p className="mt-6 rounded-xl bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
      Site de démonstration : n’importe quelle adresse e-mail et un mot de passe de 6 caractères minimum suffisent. Aucune donnée
      n’est envoyée, tout reste dans votre navigateur.
    </p>
  )
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      ou
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
