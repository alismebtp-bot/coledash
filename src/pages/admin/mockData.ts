// ─── Shared Mock Data for Admin Pages ────────────────────────────────

export interface Order {
  id: string;
  customer: { name: string; email: string; phone: string; avatar: string };
  restaurant: { name: string; image: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  deliveryAddress: string;
  createdAt: string;
  deliveryTime?: string;
  driver?: { name: string; phone: string; rating: number };
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'in_app';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  audience: string;
  scheduledAt?: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
}

export interface FinancialTransaction {
  id: string;
  type: 'order' | 'refund' | 'commission' | 'payout' | 'fee';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  party: string;
}

export interface Prospect {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  cuisine: string;
  address: string;
  status: 'new' | 'contacted' | 'meeting' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  lastContact?: string;
  estimatedValue: number;
  assignedTo?: string;
}

// ─── Orders Mock Data ────────────────────────────────────────────────
export const mockOrders: Order[] = [
  {
    id: 'CMD-2025-001',
    customer: {
      name: 'Marie Dupont',
      email: 'marie@example.com',
      phone: '+33 6 12 34 56 78',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    restaurant: {
      name: 'Le Petit Bistro',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop',
    },
    items: [
      { name: 'Burger Classic', quantity: 2, price: 14.90 },
      { name: 'Frites maison', quantity: 1, price: 4.50 },
      { name: 'Coca-Cola', quantity: 2, price: 3.50 },
    ],
    total: 41.30,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryAddress: '12 Rue de la Paix, 75002 Paris',
    createdAt: '2025-01-15 12:30',
    deliveryTime: '13:05',
    driver: { name: 'Pierre M.', phone: '+33 6 34 56 78 90', rating: 4.9 },
  },
  {
    id: 'CMD-2025-002',
    customer: {
      name: 'Jean Martin',
      email: 'jean@example.com',
      phone: '+33 6 23 45 67 89',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    restaurant: {
      name: 'Sushi Master',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop',
    },
    items: [
      { name: 'Plateau 24 pièces', quantity: 1, price: 28.90 },
      { name: 'Miso Soup', quantity: 2, price: 4.50 },
    ],
    total: 37.90,
    status: 'delivering',
    paymentStatus: 'paid',
    deliveryAddress: '25 Avenue des Champs-Élysées, 75008 Paris',
    createdAt: '2025-01-15 14:00',
    driver: { name: 'Lucas B.', phone: '+33 6 45 67 89 01', rating: 4.7 },
  },
  {
    id: 'CMD-2025-003',
    customer: {
      name: 'Alice Bernard',
      email: 'alice@example.com',
      phone: '+33 6 45 67 89 01',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    restaurant: {
      name: 'Pizza Roma',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop',
    },
    items: [
      { name: 'Pizza Margherita', quantity: 1, price: 12.90 },
      { name: 'Pizza 4 Fromages', quantity: 1, price: 15.90 },
      { name: 'Tiramisu', quantity: 1, price: 6.50 },
    ],
    total: 35.30,
    status: 'preparing',
    paymentStatus: 'paid',
    deliveryAddress: '8 Rue Montorgueil, 75001 Paris',
    createdAt: '2025-01-15 14:30',
  },
  {
    id: 'CMD-2025-004',
    customer: {
      name: 'Thomas Petit',
      email: 'thomas@example.com',
      phone: '+33 6 34 56 78 90',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    restaurant: {
      name: 'Burger House',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop',
    },
    items: [
      { name: 'Double Cheeseburger', quantity: 1, price: 16.90 },
      { name: 'Onion Rings', quantity: 1, price: 5.50 },
      { name: 'Milkshake Oreo', quantity: 1, price: 6.90 },
    ],
    total: 29.30,
    status: 'pending',
    paymentStatus: 'pending',
    deliveryAddress: '15 Rue de Rivoli, 75001 Paris',
    createdAt: '2025-01-15 14:45',
  },
  {
    id: 'CMD-2025-005',
    customer: {
      name: 'Sophie Lefebvre',
      email: 'sophie@restaurant.fr',
      phone: '+33 1 42 00 00 01',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    restaurant: {
      name: 'Le Petit Bistro',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop',
    },
    items: [
      { name: 'Salade César', quantity: 1, price: 13.90 },
      { name: 'Eau minérale', quantity: 1, price: 2.50 },
    ],
    total: 16.40,
    status: 'cancelled',
    paymentStatus: 'refunded',
    deliveryAddress: '33 Boulevard Saint-Germain, 75005 Paris',
    createdAt: '2025-01-15 11:00',
  },
];

// ─── Campaigns Mock Data ─────────────────────────────────────────────
export const mockCampaigns: Campaign[] = [
  {
    id: 'CAMP-001',
    name: 'Soldes d\'hiver 2025',
    type: 'email',
    status: 'completed',
    audience: 'Tous les clients',
    sentCount: 15420,
    openRate: 42.5,
    clickRate: 18.3,
    conversionRate: 8.7,
    revenue: 8750,
  },
  {
    id: 'CAMP-002',
    name: 'Nouveaux restaurants',
    type: 'push',
    status: 'active',
    audience: 'Clients Paris',
    sentCount: 8200,
    openRate: 65.2,
    clickRate: 32.1,
    conversionRate: 12.4,
    revenue: 4200,
  },
  {
    id: 'CAMP-003',
    name: 'Offre ColePass',
    type: 'in_app',
    status: 'scheduled',
    audience: 'Non-abonnés',
    scheduledAt: '2025-01-20 10:00',
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    revenue: 0,
  },
  {
    id: 'CAMP-004',
    name: 'Panier abandonné',
    type: 'email',
    status: 'active',
    audience: 'Paniers abandonnés',
    sentCount: 3400,
    openRate: 55.8,
    clickRate: 28.4,
    conversionRate: 15.2,
    revenue: 5600,
  },
  {
    id: 'CAMP-005',
    name: 'Anniversaire clients',
    type: 'sms',
    status: 'paused',
    audience: 'Anniversaires du mois',
    sentCount: 1200,
    openRate: 95.0,
    clickRate: 45.2,
    conversionRate: 22.1,
    revenue: 3100,
  },
];

// ─── Financial Transactions Mock Data ────────────────────────────────
export const mockTransactions: FinancialTransaction[] = [
  { id: 'TRX-001', type: 'order', amount: 41.30, status: 'completed', date: '2025-01-15', description: 'Commande CMD-2025-001', party: 'Marie Dupont' },
  { id: 'TRX-002', type: 'commission', amount: -6.20, status: 'completed', date: '2025-01-15', description: 'Commission 15% - Le Petit Bistro', party: 'Le Petit Bistro' },
  { id: 'TRX-003', type: 'order', amount: 37.90, status: 'completed', date: '2025-01-15', description: 'Commande CMD-2025-002', party: 'Jean Martin' },
  { id: 'TRX-004', type: 'commission', amount: -5.69, status: 'completed', date: '2025-01-15', description: 'Commission 15% - Sushi Master', party: 'Sushi Master' },
  { id: 'TRX-005', type: 'payout', amount: -2500.00, status: 'completed', date: '2025-01-14', description: 'Virement hebdomadaire', party: 'Le Petit Bistro' },
  { id: 'TRX-006', type: 'refund', amount: -16.40, status: 'completed', date: '2025-01-15', description: 'Remboursement CMD-2025-005', party: 'Sophie Lefebvre' },
  { id: 'TRX-007', type: 'fee', amount: -29.99, status: 'completed', date: '2025-01-15', description: 'Abonnement ColePass', party: 'Marie Dupont' },
  { id: 'TRX-008', type: 'order', amount: 35.30, status: 'pending', date: '2025-01-15', description: 'Commande CMD-2025-003', party: 'Alice Bernard' },
];

// ─── Prospects Mock Data ─────────────────────────────────────────────
export const mockProspects: Prospect[] = [
  {
    id: 'PRO-001',
    businessName: 'Chez Antoine',
    contactName: 'Antoine Dubois',
    email: 'antoine@chezantoine.fr',
    phone: '+33 1 42 00 00 10',
    cuisine: 'Française',
    address: '18 Rue de Buci, 75006 Paris',
    status: 'negotiation',
    priority: 'high',
    notes: 'Très intéressé par notre offre. En attente de la signature du contrat.',
    lastContact: '2025-01-14',
    estimatedValue: 45000,
    assignedTo: 'Pierre M.',
  },
  {
    id: 'PRO-002',
    businessName: 'Sakura Sushi',
    contactName: 'Yuki Tanaka',
    email: 'yuki@sakurasushi.fr',
    phone: '+33 1 42 00 00 11',
    cuisine: 'Japonaise',
    address: '42 Rue Saint-Denis, 75001 Paris',
    status: 'meeting',
    priority: 'medium',
    notes: 'Rendez-vous prévu le 20/01. Demande une commission réduite à 12%.',
    lastContact: '2025-01-10',
    estimatedValue: 32000,
    assignedTo: 'Sophie L.',
  },
  {
    id: 'PRO-003',
    businessName: 'Tacos El Rey',
    contactName: 'Miguel Rodriguez',
    email: 'miguel@tacoselrey.fr',
    phone: '+33 1 42 00 00 12',
    cuisine: 'Mexicaine',
    address: '55 Boulevard Voltaire, 75011 Paris',
    status: 'contacted',
    priority: 'medium',
    notes: 'A répondu positivement à notre premier email. À relancer.',
    lastContact: '2025-01-08',
    estimatedValue: 18000,
    assignedTo: 'Pierre M.',
  },
  {
    id: 'PRO-004',
    businessName: 'Pasta Bella',
    contactName: 'Giuseppe Rossi',
    email: 'giuseppe@pastabella.fr',
    phone: '+33 1 42 00 00 13',
    cuisine: 'Italienne',
    address: '22 Rue de la Harpe, 75005 Paris',
    status: 'new',
    priority: 'low',
    notes: 'Nouveau prospect identifié via LinkedIn. Pas encore contacté.',
    estimatedValue: 25000,
  },
  {
    id: 'PRO-005',
    businessName: 'Green Bowl',
    contactName: 'Emma Green',
    email: 'emma@greenbowl.fr',
    phone: '+33 1 42 00 00 14',
    cuisine: 'Healthy',
    address: '10 Rue des Martyrs, 75009 Paris',
    status: 'won',
    priority: 'high',
    notes: 'Contrat signé ! Lancement prévu le 01/02.',
    lastContact: '2025-01-12',
    estimatedValue: 38000,
    assignedTo: 'Sophie L.',
  },
  {
    id: 'PRO-006',
    businessName: 'Le Gourmet',
    contactName: 'Philippe Martin',
    email: 'philippe@legourmet.fr',
    phone: '+33 1 42 00 00 15',
    cuisine: 'Française',
    address: '8 Place de la Bastille, 75011 Paris',
    status: 'lost',
    priority: 'medium',
    notes: 'A choisi un concurrent. À recontacter dans 6 mois.',
    lastContact: '2024-12-20',
    estimatedValue: 55000,
    assignedTo: 'Pierre M.',
  },
];

// ─── Helper Configs ──────────────────────────────────────────────────
export const orderStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#FFB300', bg: '#FFF8E1' },
  preparing: { label: 'En préparation', color: '#2962FF', bg: '#E3F2FD' },
  ready: { label: 'Prête', color: '#00C853', bg: '#E8F5E9' },
  delivering: { label: 'En livraison', color: '#FF3008', bg: '#FFF0ED' },
  delivered: { label: 'Livrée', color: '#00C853', bg: '#E8F5E9' },
  cancelled: { label: 'Annulée', color: '#A6A6A6', bg: '#F0EEEA' },
};

export const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: '#FFB300' },
  paid: { label: 'Payé', color: '#00C853' },
  refunded: { label: 'Remboursé', color: '#A6A6A6' },
  failed: { label: 'Échoué', color: '#FF3008' },
};

export const campaignTypeConfig: Record<string, { label: string; icon: string }> = {
  email: { label: 'Email', icon: 'Mail' },
  push: { label: 'Push', icon: 'Smartphone' },
  sms: { label: 'SMS', icon: 'MessageSquare' },
  in_app: { label: 'In-App', icon: 'Layout' },
};

export const campaignStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Brouillon', color: '#A6A6A6', bg: '#F0EEEA' },
  scheduled: { label: 'Planifiée', color: '#2962FF', bg: '#E3F2FD' },
  active: { label: 'Active', color: '#00C853', bg: '#E8F5E9' },
  paused: { label: 'En pause', color: '#FFB300', bg: '#FFF8E1' },
  completed: { label: 'Terminée', color: '#A6A6A6', bg: '#F0EEEA' },
};

export const transactionTypeConfig: Record<string, { label: string; color: string }> = {
  order: { label: 'Commande', color: '#00C853' },
  refund: { label: 'Remboursement', color: '#FF3008' },
  commission: { label: 'Commission', color: '#FFB300' },
  payout: { label: 'Virement', color: '#2962FF' },
  fee: { label: 'Frais', color: '#A6A6A6' },
};

export const prospectStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Nouveau', color: '#2962FF', bg: '#E3F2FD' },
  contacted: { label: 'Contacté', color: '#FFB300', bg: '#FFF8E1' },
  meeting: { label: 'RDV', color: '#FF3008', bg: '#FFF0ED' },
  negotiation: { label: 'Négociation', color: '#9C27B0', bg: '#F3E5F5' },
  won: { label: 'Gagné', color: '#00C853', bg: '#E8F5E9' },
  lost: { label: 'Perdu', color: '#A6A6A6', bg: '#F0EEEA' },
};

export const prospectPriorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Basse', color: '#A6A6A6' },
  medium: { label: 'Moyenne', color: '#FFB300' },
  high: { label: 'Haute', color: '#FF3008' },
};

// ─── Analytics Data ──────────────────────────────────────────────────
export const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 1200, commission: 6750 },
  { month: 'Fév', revenue: 52000, orders: 1380, commission: 7800 },
  { month: 'Mar', revenue: 48000, orders: 1250, commission: 7200 },
  { month: 'Avr', revenue: 61000, orders: 1600, commission: 9150 },
  { month: 'Mai', revenue: 58000, orders: 1520, commission: 8700 },
  { month: 'Juin', revenue: 72000, orders: 1900, commission: 10800 },
  { month: 'Juil', revenue: 68000, orders: 1750, commission: 10200 },
  { month: 'Août', revenue: 75000, orders: 2000, commission: 11250 },
  { month: 'Sep', revenue: 64000, orders: 1680, commission: 9600 },
  { month: 'Oct', revenue: 71000, orders: 1850, commission: 10650 },
  { month: 'Nov', revenue: 82000, orders: 2100, commission: 12300 },
  { month: 'Déc', revenue: 95000, orders: 2400, commission: 14250 },
];

export const topRestaurants = [
  { name: 'Le Petit Bistro', revenue: 124500, orders: 3420, growth: 12.5 },
  { name: 'Sushi Master', revenue: 98700, orders: 2180, growth: 8.3 },
  { name: 'Pizza Roma', revenue: 72300, orders: 2900, growth: -2.1 },
  { name: 'Burger House', revenue: 86500, orders: 1850, growth: 15.7 },
  { name: 'Taco Fiesta', revenue: 0, orders: 0, growth: 0 },
];

export const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Fév', users: 1450 },
  { month: 'Mar', users: 1680 },
  { month: 'Avr', users: 1920 },
  { month: 'Mai', users: 2100 },
  { month: 'Juin', users: 2450 },
  { month: 'Juil', users: 2800 },
  { month: 'Août', users: 3200 },
  { month: 'Sep', users: 3600 },
  { month: 'Oct', users: 4100 },
  { month: 'Nov', users: 4800 },
  { month: 'Déc', users: 5600 },
];

export const satisfactionData = [
  { category: 'Livraison', score: 4.5, count: 1200 },
  { category: 'Qualité', score: 4.3, count: 980 },
  { category: 'Service client', score: 4.7, count: 450 },
  { category: 'Application', score: 4.1, count: 890 },
  { category: 'Prix', score: 3.9, count: 1100 },
];
