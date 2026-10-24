import {
  BarChart3,
  Bike,

  CalendarDays,
  ClipboardList,
  CreditCard,
  Gauge,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Megaphone,
  MessageSquareText,
  Navigation,
  Percent,
  Settings,
  Store,
  Target,
  User,
  UtensilsCrossed,
  Users,
  Wallet,
} from 'lucide-react'
import PortalLayout, { type PortalConfig } from './PortalLayout'

export const merchantPortal: PortalConfig = {
  title: 'Espace commerçant',
  identity: { name: 'Le Bistrot du Coin', subtitle: 'Paris 2e · Restaurant', initials: 'BC' },
  nav: [
    { to: '/marchand', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/marchand/commandes', label: 'Commandes', icon: ClipboardList },
    { to: '/marchand/carte', label: 'Carte & produits', icon: UtensilsCrossed },
    { to: '/marchand/statistiques', label: 'Statistiques', icon: BarChart3 },
    { to: '/marchand/avis', label: 'Avis clients', icon: MessageSquareText },
    { to: '/marchand/promotions', label: 'Promotions', icon: Percent },
    { to: '/marchand/paiements', label: 'Paiements', icon: Wallet },
    { to: '/marchand/parametres', label: 'Paramètres', icon: Settings },
  ],
}

export const driverPortal: PortalConfig = {
  title: 'Espace livreur',
  identity: { name: 'Karim Benali', subtitle: 'Vélo électrique · Paris', initials: 'KB' },
  nav: [
    { to: '/livreur', label: 'Accueil', icon: Gauge, end: true },
    { to: '/livreur/courses', label: 'Courses disponibles', icon: Bike },
    { to: '/livreur/livraison', label: 'Livraison en cours', icon: Navigation },
    { to: '/livreur/gains', label: 'Gains', icon: Wallet },
    { to: '/livreur/planning', label: 'Planning', icon: CalendarDays },
    { to: '/livreur/profil', label: 'Profil', icon: User },
  ],
}

export const adminPortal: PortalConfig = {
  title: 'Administration',
  identity: { name: 'Équipe Ops', subtitle: 'admin@coledash.fr', initials: 'OP' },
  nav: [
    { to: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
    { to: '/admin/commandes', label: 'Commandes', icon: ClipboardList },
    { to: '/admin/commerces', label: 'Commerces', icon: Store },
    { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
    { to: '/admin/villes', label: 'Villes', icon: MapPin },
    { to: '/admin/finance', label: 'Finance', icon: CreditCard },
    { to: '/admin/marketing', label: 'Marketing', icon: Megaphone },
    { to: '/admin/prospection', label: 'Prospection', icon: Target },
    { to: '/admin/support', label: 'Support', icon: LifeBuoy },
    { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
  ],
}


export const MerchantLayout = () => <PortalLayout config={merchantPortal} />
export const DriverLayout = () => <PortalLayout config={driverPortal} />
export const AdminLayout = () => <PortalLayout config={adminPortal} />
