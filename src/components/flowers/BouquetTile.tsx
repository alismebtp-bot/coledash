import { motion } from 'framer-motion'
import SafeImage from '@/components/shared/SafeImage'
import { occasions, type Bouquet } from '@/data/bouquets'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Props {
  bouquet: Bouquet
  floristName?: string
  onOpen: (b: Bouquet) => void
  index?: number
  className?: string
}

export default function BouquetTile({ bouquet, floristName, onOpen, index = 0, className }: Props) {
  const occasion = occasions.find((o) => o.id === bouquet.occasions[0])
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
      className={cn('group', className)}
    >
      <button type="button" onClick={() => onOpen(bouquet)} className="block w-full rounded-[1.75rem] text-left focus-visible:ring-offset-4" aria-label={`${bouquet.name}, dès ${formatPrice(bouquet.price)}`}>
        <div className="relative">
          <SafeImage src={bouquet.image} alt={bouquet.name} wrapperClassName="aspect-[4/5] rounded-[1.75rem]" className="transition-transform duration-700 group-hover:scale-[1.05]" />
          <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {bouquet.isBestseller && <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">Le préféré</span>}
            {bouquet.isNew && <span className="rounded-full bg-[#3f2a2e] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">Nouveauté</span>}
          </div>
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            Choisir la taille
          </span>
        </div>
        <div className="mt-3 px-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl font-semibold leading-tight text-ink">{bouquet.name}</h3>
            <span className="flex shrink-0 -space-x-1.5 pt-1.5" aria-hidden>
              {bouquet.tones.map((t) => (
                <span key={t} className="h-3.5 w-3.5 rounded-full border border-white shadow-sm" style={{ background: t }} />
              ))}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{bouquet.tagline}</p>
          <p className="mt-2 flex items-baseline justify-between gap-2 text-sm">
            <span className="text-ink">
              <span className="text-xs text-muted-foreground">dès </span>
              <span className="font-semibold">{formatPrice(bouquet.price)}</span>
            </span>
            <span className="truncate text-xs text-muted-foreground">{occasion?.label}{floristName ? ` · ${floristName}` : ''}</span>
          </p>
        </div>
      </button>
    </motion.article>
  )
}
