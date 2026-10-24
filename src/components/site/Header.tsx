import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Search, ShoppingBag, User } from 'lucide-react'
import Logo from './Logo'
import CityPicker from './CityPicker'
import { useCart, selectCount } from '@/store/cart'
import { useAuth } from '@/store/auth'
import { cn } from '@/lib/utils'

const SITE_NAV = [
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/courses', label: 'Courses' },
  { to: '/fleurs', label: 'Fleurs' },
  { to: '/boutiques', label: 'Boutiques' },
]

export default function Header() {
  const count = useCart(selectCount)
  const user = useAuth((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q')
    setQuery(location.pathname === '/recherche' && q ? q : '')
  }, [location])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md transition-shadow supports-[backdrop-filter]:bg-background/75',
        scrolled ? 'border-border shadow-soft' : 'border-transparent',
      )}
    >
      <div className="container flex h-16 items-center gap-3">
        <Logo />
        <CityPicker className="ml-1 hidden sm:inline-flex" />

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Catégories">
          {SITE_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'bg-ink text-white' : 'text-ink/75 hover:bg-secondary hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form
          role="search"
          className="ml-auto hidden max-w-xs flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault()
            if (query.trim()) navigate(`/recherche?q=${encodeURIComponent(query.trim())}`)
          }}
        >
          <label className="relative block">
            <span className="sr-only">Rechercher</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Plat, restaurant, produit…"
              className="h-10 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-ink/40 focus:ring-2 focus:ring-ring/30"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link
            to="/recherche"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-secondary md:hidden"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to={user ? '/compte' : '/connexion'}
            className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink hover:bg-secondary sm:flex"
          >
            <User className="h-5 w-5" aria-hidden />
            <span className="hidden xl:inline">{user ? user.firstName : 'Se connecter'}</span>
            <span className="sr-only xl:hidden">{user ? 'Mon compte' : 'Se connecter'}</span>
          </Link>
          <Link
            to="/panier"
            className="relative flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink/85"
            aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            <span className="tabular-nums">{count}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
