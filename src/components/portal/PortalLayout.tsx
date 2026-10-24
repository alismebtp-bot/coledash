import { NavLink, Outlet, Link } from 'react-router-dom'
import { Suspense, useState } from 'react'
import { ArrowLeft, Menu, type LucideIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import PageLoader from '@/components/shared/PageLoader'
import { cn } from '@/lib/utils'

export interface PortalNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  badge?: string | number
}

export interface PortalConfig {
  title: string
  nav: PortalNavItem[]
  identity: { name: string; subtitle: string; initials: string }
}

function Sidebar({ config, onNavigate }: { config: PortalConfig; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-display font-extrabold text-white">C</span>
        <div className="leading-tight">
          <p className="font-display text-base font-bold text-white">ColeDash</p>
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">{config.title}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label={config.title}>
        {config.nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-4 w-4', isActive && 'text-brand-500')} aria-hidden />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">{item.badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {config.identity.initials}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-white">{config.identity.name}</p>
            <p className="truncate text-xs text-white/50">{config.identity.subtitle}</p>
          </div>
        </div>
        <Link to="/" className="mt-4 flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour au site client
        </Link>
      </div>
    </div>
  )
}

export default function PortalLayout({ config }: { config: PortalConfig }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[hsl(36_30%_96%)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar config={config} />
      </aside>
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-sidebar px-4 text-white lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className="rounded-md p-1.5 hover:bg-white/10" aria-label="Ouvrir le menu">
          <Menu className="h-5 w-5" />
        </button>
        <p className="font-display font-bold">ColeDash · {config.title}</p>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <SheetTitle className="sr-only">{config.title}</SheetTitle>
          <Sidebar config={config} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
