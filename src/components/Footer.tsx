import { Link } from "react-router-dom";
import { Flower2, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Flower2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-800">ColeDash</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Livraison de repons et de fleurs fraîches dans toute la France. Qualité, rapidité et éco-responsabilité.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Découvrir</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/restaurants" className="text-sm text-slate-500 hover:text-emerald-600">Restaurants</Link></li>
              <li><Link to="/epicerie" className="text-sm text-slate-500 hover:text-emerald-600">Épicerie</Link></li>
              <li><Link to="/fleurs" className="text-sm text-slate-500 hover:text-emerald-600">Fleurs</Link></li>
              <li><Link to="/boutiques" className="text-sm text-slate-500 hover:text-emerald-600">Boutiques</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Aide</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/aide" className="text-sm text-slate-500 hover:text-emerald-600">Centre d'aide</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 hover:text-emerald-600">Nous contacter</Link></li>
              <li><Link to="/livraison" className="text-sm text-slate-500 hover:text-emerald-600">Livraison</Link></li>
              <li><Link to="/faq" className="text-sm text-slate-500 hover:text-emerald-600">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Légal</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/cgv" className="text-sm text-slate-500 hover:text-emerald-600">CGV</Link></li>
              <li><Link to="/confidentialite" className="text-sm text-slate-500 hover:text-emerald-600">Confidentialité</Link></li>
              <li><Link to="/cookies" className="text-sm text-slate-500 hover:text-emerald-600">Cookies</Link></li>
              <li><Link to="/mentions-legales" className="text-sm text-slate-500 hover:text-emerald-600">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} ColeDash. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
