import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Store,
  MapPin,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Megaphone,
  ClipboardList,
  HeadphonesIcon,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Restaurants', icon: Store, href: '/admin/restaurants' },
  { label: 'Cities', icon: MapPin, href: '/admin/cities' },
  { label: 'Orders', icon: ClipboardList, href: '/admin/orders' },
  { label: 'Finance', icon: DollarSign, href: '/admin/finance' },
  { label: 'Marketing', icon: Megaphone, href: '/admin/marketing' },
  { label: 'Support', icon: HeadphonesIcon, href: '/admin/support' },
  { label: 'Error Logs', icon: AlertTriangle, href: '/admin/error-logs' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
]

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">CD</span>
        </div>
        <span className="font-semibold text-lg">Admin</span>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
            >
              <Button
                variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start gap-2', location.pathname === item.href && 'bg-secondary')}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
