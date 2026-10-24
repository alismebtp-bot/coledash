import { NavLink } from 'react-router-dom'
import { Home, Search, ShoppingBag, Receipt, User } from 'lucide-react'
import { useCart, selectCount } from '@/store/cart'
import { useAuth } from '@/store/auth'
import { cn } from '@/lib/utils'

export default function MobileTabBar() {
  const count = useCart(selectCount)
  const user = useAuth((s) => s.user)
  const tabs = [
    { to: '/', label: 'Accueil', icon: Home, end: true },
    { to: '/recherche', label: 'Recherche', icon: Search },
    { to: '/panier', label: 'Panier', icon: ShoppingBag, badge: count },
    { to: '/commandes', label: 'Commandes', icon: Receipt },
    { to: user ? '/compte' : '/connexion', label: 'Compte', icon: User },
  ]
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Navigation principale"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => (
          <li key={t.label}>
            <NavLink
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn('relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium', isActive ? 'text-brand-600' : 'text-muted-foreground')
              }
            >
              <t.icon className="h-5 w-5" aria-hidden />
              {t.label}
              {!!t.badge && (
                <span className="absolute right-[calc(50%-18px)] top-1 min-w-[18px] rounded-full bg-brand-600 px-1 text-center text-[10px] font-bold leading-[18px] text-white">
                  {t.badge}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
