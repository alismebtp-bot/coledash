import { Link } from "react-router-dom";
import { Flower2, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import CitySelector from "./CitySelector";
import { useCart } from "../context/CartContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Flower2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-800 hidden sm:inline">ColeDash</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/restaurants"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Restaurants
            </Link>
            <Link
              to="/epicerie"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Épicerie
            </Link>
            <Link
              to="/fleurs"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Fleurs
            </Link>
            <Link
              to="/boutiques"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Boutiques
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <CitySelector />
          </div>
          <Link
            to="/panier"
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/compte"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/restaurants"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Restaurants
            </Link>
            <Link
              to="/epicerie"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Épicerie
            </Link>
            <Link
              to="/fleurs"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Fleurs
            </Link>
            <Link
              to="/boutiques"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Boutiques
            </Link>
            <div className="pt-2">
              <CitySelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
