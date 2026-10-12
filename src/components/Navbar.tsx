import { Link } from 'react-router-dom'
import { ShoppingCart, Menu, X, Store, Truck, Flower2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import CitySelector from './CitySelector'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { itemCount } = useCart()

  const navLinks = [
    { label: 'Restaurants', href: '/restaurants', icon: Store },
    { label: 'Grocery', href: '/grocery', icon: Store },
    { label: 'Flowers', href: '/flowers', icon: Flower2 },
    { label: 'Retail', href: '/retail', icon: Store },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">ColeDash</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="transition-colors hover:text-foreground/80">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <CitySelector />
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
