import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, Package, DollarSign, BarChart3, Settings, Star, Megaphone, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', icon: Home, href: '/merchant' },
  { label: 'Orders', icon: Package, href: '/merchant/orders' },
  { label: 'Menu', icon: Package, href: '/merchant/menu' },
  { label: 'Analytics', icon: BarChart3, href: '/merchant/analytics' },
  { label: 'Reviews', icon: Star, href: '/merchant/reviews' },
  { label: 'Payouts', icon: DollarSign, href: '/merchant/payouts' },
  { label: 'Promotions', icon: Megaphone, href: '/merchant/promotions' },
  { label: 'Settings', icon: Settings, href: '/merchant/settings' },
]

export default function MerchantLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-card">
        <div className="flex items-center gap-2 px-4 py-4 md:py-6">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CD</span>
          </div>
          <span className="font-semibold">Merchant</span>
        </div>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-2 gap-1">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                className={cn('justify-start gap-2 w-auto md:w-full', location.pathname === item.href && 'bg-secondary')}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
        <div className="hidden md:block mt-auto p-3 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
