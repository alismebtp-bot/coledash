import { Flame, Leaf, Sparkles, Sprout, WheatOff } from 'lucide-react'
import type { MenuItem } from '@/data/restaurants'
import { cn } from '@/lib/utils'

const base = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold'

/** Dietary / popularity badges for a dish. */
export default function MenuItemBadges({ item, className }: { item: MenuItem; className?: string }) {
  const badges: { key: string; label: string; icon?: typeof Leaf; cls: string }[] = []
  if (item.isPopular || item.isBestseller) badges.push({ key: 'pop', label: 'Populaire', icon: Sparkles, cls: 'bg-brand-50 text-brand-700' })
  if (item.isNew) badges.push({ key: 'new', label: 'Nouveau', cls: 'bg-sky-100 text-sky-800' })
  if (item.isVegan) badges.push({ key: 'vegan', label: 'Vegan', icon: Sprout, cls: 'bg-emerald-100 text-emerald-800' })
  else if (item.isVegetarian) badges.push({ key: 'vege', label: 'Végé', icon: Leaf, cls: 'bg-emerald-100 text-emerald-800' })
  if (item.isSpicy) badges.push({ key: 'spicy', label: 'Épicé', icon: Flame, cls: 'bg-orange-100 text-orange-800' })
  if (item.isGlutenFree) badges.push({ key: 'gf', label: 'Sans gluten', icon: WheatOff, cls: 'bg-amber-100 text-amber-800' })
  if (badges.length === 0) return null
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {badges.map((b) => (
        <span key={b.key} className={cn(base, b.cls)}>
          {b.icon && <b.icon className="h-3 w-3" aria-hidden />}
          {b.label}
        </span>
      ))}
    </div>
  )
}
