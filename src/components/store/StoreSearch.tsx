import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function StoreSearch({ value, onChange, placeholder, id }: { value: string; onChange: (v: string) => void; placeholder: string; id: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor={id} className="sr-only">
        Rechercher dans la boutique
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-full bg-card pl-10 pr-10 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
