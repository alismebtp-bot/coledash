import { Bike, Clock4, Leaf, Search, Tag, X, type LucideIcon } from 'lucide-react'
import ChipFilter, { type Chip } from '@/components/shared/ChipFilter'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { LOW_FEE_THRESHOLD, SORT_OPTIONS, type SortKey, type ToggleState } from './utils'

interface Props {
  query: string
  onQueryChange: (q: string) => void
  cuisineChips: Chip[]
  cuisine: string
  onCuisineChange: (id: string) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  toggles: ToggleState
  onToggle: (key: keyof ToggleState) => void
  showVeggie: boolean
}

function TogglePill({ active, icon: Icon, label, onClick }: { active: boolean; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors',
        active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border bg-card text-ink hover:border-ink/40',
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
      {active && <X className="h-3.5 w-3.5 opacity-70" aria-hidden />}
    </button>
  )
}

export default function RestaurantFilters(props: Props) {
  const { query, onQueryChange, cuisineChips, cuisine, onCuisineChange, sort, onSortChange, toggles, onToggle, showVeggie } = props
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Filtrer les restaurants</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Un restaurant, un plat, une envie…"
            className="h-11 w-full rounded-full border bg-card pl-10 pr-4 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ink/30 focus:ring-2 focus:ring-ring/30"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground" id="sort-label">
            Trier par
          </span>
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
            <SelectTrigger className="h-11 w-full rounded-full bg-card sm:w-[230px]" aria-labelledby="sort-label">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ChipFilter chips={cuisineChips} value={cuisine} onChange={onCuisineChange} label="Type de cuisine" />

      <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2" role="group" aria-label="Filtres rapides">
          <TogglePill active={toggles.open} icon={Clock4} label="Ouvert maintenant" onClick={() => onToggle('open')} />
          <TogglePill active={toggles.promo} icon={Tag} label="Promotions" onClick={() => onToggle('promo')} />
          <TogglePill
            active={toggles.lowFee}
            icon={Bike}
            label={`Livraison < ${LOW_FEE_THRESHOLD.toFixed(2).replace('.', ',')} €`}
            onClick={() => onToggle('lowFee')}
          />
          {showVeggie && <TogglePill active={toggles.veggie} icon={Leaf} label="Végétarien" onClick={() => onToggle('veggie')} />}
        </div>
      </div>
    </div>
  )
}
