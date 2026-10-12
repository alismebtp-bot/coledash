import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">ColeDash</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop delivery platform for food, grocery, flowers, and retail.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/restaurants" className="hover:text-foreground">Food Delivery</Link></li>
              <li><Link to="/grocery" className="hover:text-foreground">Grocery</Link></li>
              <li><Link to="/flowers" className="hover:text-foreground">Flowers</Link></li>
              <li><Link to="/retail" className="hover:text-foreground">Retail</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ColeDash. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
