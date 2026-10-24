import { useMemo, useState } from 'react'
import ChipFilter from '@/components/shared/ChipFilter'
import QuantityStepper from '@/components/shared/QuantityStepper'
import { flowerCatalog, flowerCategoryLabels, type FlowerItem } from '@/data/flowerCatalog'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { FlowerIcon } from '../FlowerGlyph'
import { MAX_STEMS } from '../composer'

interface Props {
  stems: Record<string, number>
  total: number
  onChange: (id: string, count: number) => void
}

export default function StemPicker({ stems, total, onChange }: Props) {
  const [category, setCategory] = useState('all')
  const chips = useMemo(() => {
    const cats = [...new Set(flowerCatalog.map((f) => f.category))]
    return [{ id: 'all', label: 'Toutes' }, ...cats.map((c) => ({ id: c, label: flowerCategoryLabels[c] }))]
  }, [])
  const list = category === 'all' ? flowerCatalog : flowerCatalog.filter((f) => f.category === category)
  const left = MAX_STEMS - total

  return (
    <div>
      <ChipFilter chips={chips} value={category} onChange={setCategory} label="Famille de fleurs" />
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((f) => (
          <StemTile key={f.id} flower={f} count={stems[f.id] ?? 0} max={(stems[f.id] ?? 0) + left} onChange={(q) => onChange(f.id, q)} />
        ))}
      </ul>
    </div>
  )
}

function StemTile({ flower, count, max, onChange }: { flower: FlowerItem; count: number; max: number; onChange: (q: number) => void }) {
  const full = max <= count
  return (
    <li
      className={cn(
        'relative flex flex-col rounded-2xl border bg-card p-3 transition-all',
        count > 0 ? 'border-brand-200 bg-brand-50/50 shadow-soft' : 'hover:border-ink/20',
      )}
    >
      <div className="mx-auto h-20 w-20">
        <FlowerIcon item={flower} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-tight text-ink">{flower.nameFr}</p>
      <p className="mt-0.5 line-clamp-1 text-xs italic text-muted-foreground" title={flower.symbolism}>
        {flower.symbolism}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink">
          {formatPrice(flower.stemPrice)}
          <span className="font-normal text-muted-foreground"> /tige</span>
        </span>
        {count > 0 ? (
          <QuantityStepper value={count} onChange={onChange} max={max} size="sm" label={`Tiges de ${flower.nameFr}`} />
        ) : (
          <button
            type="button"
            onClick={() => onChange(1)}
            disabled={full}
            className="h-8 rounded-full bg-ink px-3 text-xs font-semibold text-white transition-transform hover:scale-105 disabled:opacity-40"
            aria-label={`Ajouter une tige de ${flower.nameFr}`}
          >
            Ajouter
          </button>
        )}
      </div>
    </li>
  )
}
