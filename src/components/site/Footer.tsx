import { Link } from 'react-router-dom'
import Logo from './Logo'
import { cities } from '@/data/cities'

const columns = [
  {
    title: 'Commander',
    links: [
      { to: '/restaurants', label: 'Restaurants' },
      { to: '/courses', label: 'Courses' },
      { to: '/fleurs', label: 'Fleurs' },
      { to: '/fleurs/atelier', label: 'Composer un bouquet' },
      { to: '/boutiques', label: 'Boutiques' },
    ],
  },
  {
    title: 'Partenaires',
    links: [
      { to: '/partenaires', label: 'Devenir partenaire' },
      { to: '/partenaires#livreur', label: 'Devenir livreur' },
      { to: '/marchand', label: 'Espace commerçant' },
      { to: '/livreur', label: 'Espace livreur' },
      { to: '/admin', label: 'Administration' },
    ],
  },
  {
    title: 'Mon compte',
    links: [
      { to: '/compte', label: 'Profil' },
      { to: '/commandes', label: 'Mes commandes' },
      { to: '/panier', label: 'Panier' },
      { to: '/aide', label: 'Aide & contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink pb-24 text-white/70 md:pb-0">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Les meilleurs restaurants, épiceries, fleuristes et boutiques de votre ville, livrés en 30 minutes en moyenne.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.14em] text-white/40">Disponible à</p>
          <p className="mt-2 text-sm text-white/80">
            {cities.filter((c) => c.available).map((c) => c.name).join(' · ')}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-sans text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ColeDash SAS. Projet de démonstration — aucune commande réelle n'est passée.</p>
          <p>Paiements sécurisés · Service client 7j/7</p>
        </div>
      </div>
    </footer>
  )
}
