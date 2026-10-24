import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Heart, LogOut, MapPin, Receipt, Sparkles, UserRound, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileSection from '@/components/account/ProfileSection'
import AddressesSection from '@/components/account/AddressesSection'
import FavoritesSection from '@/components/account/FavoritesSection'
import LoyaltySection from '@/components/account/LoyaltySection'
import PreferencesSection from '@/components/account/PreferencesSection'
import { useAuth } from '@/store/auth'
import { useFavorites } from '@/store/favorites'
import { useOrders } from '@/store/orders'
import { formatNumber } from '@/lib/format'

const SECTIONS: { id: string; label: string; icon: LucideIcon; title: string; description: string }[] = [
  { id: 'profil', label: 'Profil', icon: UserRound, title: 'Informations personnelles', description: 'Ces informations sont partagées avec le livreur uniquement le temps de la livraison.' },
  { id: 'adresses', label: 'Adresses', icon: MapPin, title: 'Mes adresses', description: 'Gérez vos adresses de livraison et choisissez celle par défaut.' },
  { id: 'favoris', label: 'Favoris', icon: Heart, title: 'Mes favoris', description: 'Vos restaurants et boutiques préférés, à portée de main.' },
  { id: 'fidelite', label: 'Fidélité', icon: Sparkles, title: 'Programme fidélité', description: 'Cumulez des points à chaque commande et débloquez des avantages.' },
  { id: 'preferences', label: 'Préférences', icon: Bell, title: 'Notifications', description: 'Choisissez comment ColeDash vous tient informé.' },
]

export default function Account() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const orderCount = useOrders((s) => s.orders.length)
  const favCount = useFavorites((s) => s.ids.length)

  if (!user) return <Navigate to="/connexion?redirect=/compte" replace />

  const requested = params.get('section')
  const section = SECTIONS.some((s) => s.id === requested) ? (requested as string) : 'profil'

  const signOut = () => {
    navigate('/', { replace: true })
    logout()
    toast('Vous êtes déconnecté. À bientôt !')
  }

  return (
    <div className="container py-8 pb-28 md:py-12">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-600">Mon compte</p>
          <h1 className="text-3xl font-bold text-ink">Bonjour {user.firstName} !</h1>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Commandes', value: orderCount, to: '/commandes' },
            { label: 'Points', value: user.loyaltyPoints, to: '/compte?section=fidelite' },
            { label: 'Favoris', value: favCount, to: '/compte?section=favoris' },
          ].map((s) => (
            <Link key={s.label} to={s.to} className="rounded-xl border bg-card px-4 py-2 text-center shadow-soft transition-shadow hover:shadow-lift">
              <span className="block font-display text-xl font-bold tabular-nums text-ink">{formatNumber(s.value)}</span>
              <span className="block text-xs text-muted-foreground">{s.label}</span>
            </Link>
          ))}
        </div>
      </motion.header>

      <Tabs
        value={section}
        onValueChange={(v) => setParams(v === 'profil' ? {} : { section: v }, { replace: true })}
        orientation="vertical"
        className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8"
      >
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
            <TabsList className="h-auto w-max gap-1 rounded-2xl border bg-card p-1.5 shadow-soft lg:flex lg:w-full lg:flex-col lg:items-stretch">
              {SECTIONS.map((s) => (
                <TabsTrigger
                  key={s.id}
                  value={s.id}
                  className="justify-start gap-2 rounded-xl px-3 py-2 data-[state=active]:bg-ink data-[state=active]:text-white lg:py-2.5"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="mt-2 hidden flex-col gap-1 lg:flex">
            <Button asChild variant="ghost" className="justify-start text-muted-foreground">
              <Link to="/commandes">
                <Receipt aria-hidden /> Mes commandes
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start text-destructive hover:text-destructive" onClick={signOut}>
              <LogOut aria-hidden /> Se déconnecter
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          {SECTIONS.map((s) => (
            <TabsContent key={s.id} value={s.id} className="mt-0">
              <section className="rounded-2xl border bg-card p-5 shadow-soft sm:p-7" aria-labelledby={`titre-${s.id}`}>
                <h2 id={`titre-${s.id}`} className="text-xl font-bold text-ink">
                  {s.title}
                </h2>
                <p className="mb-6 mt-1 text-sm text-muted-foreground">{s.description}</p>
                {s.id === 'profil' && <ProfileSection key={user.id} user={user} />}
                {s.id === 'adresses' && <AddressesSection />}
                {s.id === 'favoris' && <FavoritesSection />}
                {s.id === 'fidelite' && <LoyaltySection points={user.loyaltyPoints} />}
                {s.id === 'preferences' && <PreferencesSection />}
              </section>
            </TabsContent>
          ))}
          <Button variant="outline" className="mt-6 w-full text-destructive hover:text-destructive lg:hidden" onClick={signOut}>
            <LogOut aria-hidden /> Se déconnecter
          </Button>
        </div>
      </Tabs>
    </div>
  )
}
