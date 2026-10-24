import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  title: ReactNode
  eyebrow?: string
  description?: string
  href?: string
  linkLabel?: string
  className?: string
}

export default function SectionHeading({ title, eyebrow, description, href, linkLabel = 'Tout voir', className }: Props) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">{eyebrow}</p>}
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {href && (
        <Link
          to={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink hover:text-brand-600"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
