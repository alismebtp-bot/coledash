import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  CreditCard,
  Megaphone,
  Headphones,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Restaurants", href: "/admin/restaurants", icon: Store },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingBag },
  { label: "Finances", href: "/admin/finance", icon: CreditCard },
  { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { label: "Support", href: "/admin/support", icon: Headphones },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
            C
          </div>
          <span className="text-lg font-bold text-slate-800">ColeDash</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
              C
            </div>
            <span className="text-lg font-bold text-slate-800">ColeDash</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)}>
            <div
              className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-16 items-center justify-between border-b px-4">
                <span className="text-lg font-bold text-slate-800">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1 p-4">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
