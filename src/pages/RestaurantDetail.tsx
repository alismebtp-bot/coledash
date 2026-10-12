import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star, Clock, MapPin, Phone, Heart, Share2,
  Plus, Minus, ShoppingBag, Info, Truck, X, Check, ChevronDown,
  ChevronUp, Search, SlidersHorizontal, UtensilsCrossed,
  Leaf, Flame, Snowflake, WheatOff, Timer, BadgeCheck,
  MessageSquare, ThumbsUp, Filter, ArrowRight, Sparkles,
  Percent, Gift, Crown, Bike, Calendar, AlertCircle,
  Eye, Bookmark, Navigation, Zap, ScrollText, Store
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/Toast';
import SafeImage from '@/components/SafeImage';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabaseClient';

// ─── Types ───────────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  calories?: number;
  allergens?: string[];
  prepTime?: number;
  options?: { name: string; choices: { label: string; price: number }[] }[];
}

interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  images?: string[];
  verified: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  priceRange: string;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: string;
  phone: string;
  isOpen: boolean;
  openingHours: { day: string; hours: string }[];
  tags: string[];
  description: string;
  photos: string[];
  promotions?: { type: string; value: string }[];
  badges?: string[];
}

// ─── Mock Data ───────────────────────────────────────────────────────
const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Le Petit Bistro',
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
  rating: 4.7,
  reviewCount: 1240,
  cuisine: 'Française',
  priceRange: '€€',
  deliveryTime: '25-35 min',
  deliveryFee: 2.99,
  minOrder: 15,
  address: '12 Rue de la Paix, 75002 Paris',
  phone: '+33 1 42 00 00 01',
  isOpen: true,
  openingHours: [
    { day: 'Lun', hours: '11:30 - 14:30, 19:00 - 22:30' },
    { day: 'Mar', hours: '11:30 - 14:30, 19:00 - 22:30' },
    { day: 'Mer', hours: '11:30 - 14:30, 19:00 - 22:30' },
    { day: 'Jeu', hours: '11:30 - 14:30, 19:00 - 22:30' },
    { day: 'Ven', hours: '11:30 - 14:30, 19:00 - 23:00' },
    { day: 'Sam', hours: '12:00 - 15:00, 19:00 - 23:00' },
    { day: 'Dim', hours: '12:00 - 15:00, 19:00 - 22:00' },
  ],
  tags: ['Française', 'Traditionnelle', 'Bistro', 'Vins'],
  description: 'Un bistro parisien authentique où tradition et modernité se rencontrent. Nos plats sont préparés avec des produits frais et locaux, dans le respect des saisons.',
  photos: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=400&h=300&fit=crop',
  ],
  promotions: [
    { type: 'reduction', value: '-15% sur toute la carte' },
    { type: 'livraison', value: 'Livraison offerte dès €25' },
  ],
  badges: ['Coup de cœur', 'Éco-responsable', 'Produits locaux'],
};

const menuItems: MenuItem[] = [
  {
    id: 'm1', name: 'Steak frites', description: 'Entrecôte grillée, frites maison, sauce béarnaise', price: 24.90,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&h=300&fit=crop',
    category: 'Plats', tags: ['populaire', 'viande'], isPopular: true, calories: 850, prepTime: 20,
    options: [{ name: 'Cuisson', choices: [{ label: 'Saignant', price: 0 }, { label: 'À point', price: 0 }, { label: 'Bien cuit', price: 0 }] }],
  },
  {
    id: 'm2', name: 'Burger Signature', description: 'Bœuf Angus, cheddar affiné, bacon croustillant, sauce secrète', price: 18.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
    category: 'Burgers', tags: ['populaire', 'viande'], isPopular: true, calories: 720, prepTime: 15,
    options: [{ name: 'Pain', choices: [{ label: 'Brioche', price: 0 }, { label: 'Céréales', price: 0.50 }] }],
  },
  {
    id: 'm3', name: 'Salade César', description: 'Poulet rôti, croûtons, parmesan, sauce César maison', price: 14.90,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&h=300&fit=crop',
    category: 'Salades', tags: ['végétarien'], calories: 450, prepTime: 10,
  },
  {
    id: 'm4', name: 'Pâtes Carbonara', description: 'Spaghetti, guanciale, œuf, pecorino, poivre noir', price: 16.50,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=300&fit=crop',
    category: 'Pâtes', tags: ['populaire'], isPopular: true, calories: 680, prepTime: 15,
  },
  {
    id: 'm5', name: 'Tarte Tatin', description: 'Pommes caramélisées, pâte feuilletée, crème fraîche', price: 9.90,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop',
    category: 'Desserts', tags: ['végétarien'], isNew: true, calories: 420, prepTime: 10,
  },
  {
    id: 'm6', name: 'Risotto aux champignons', description: 'Riz carnaroli, champignons sauvages, parmesan, truffe', price: 19.90,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&h=300&fit=crop',
    category: 'Plats', tags: ['végétarien'], calories: 550, prepTime: 18,
  },
  {
    id: 'm7', name: 'Fish & Chips', description: 'Cabillaud pané, frites épaisses, sauce tartare', price: 17.90,
    image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=300&h=300&fit=crop',
    category: 'Plats', tags: ['poisson'], calories: 780, prepTime: 18,
  },
  {
    id: 'm8', name: 'Tiramisu', description: 'Mascarpone, café espresso, cacao amer, biscuits ladyfinger', price: 8.90,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=300&fit=crop',
    category: 'Desserts', tags: ['végétarien'], calories: 380, prepTime: 5,
  },
  {
    id: 'm9', name: 'Bowl Açaï', description: 'Açaï, granola, fruits frais, coco râpée', price: 12.50,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=300&fit=crop',
    category: 'Bowls', tags: ['végétarien', 'healthy'], isNew: true, calories: 320, prepTime: 8,
  },
  {
    id: 'm10', name: 'Pizza Margherita', description: 'Tomate San Marzano, mozzarella di bufala, basilic frais', price: 13.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop',
    category: 'Pizzas', tags: ['végétarien'], calories: 650, prepTime: 15,
    options: [{ name: 'Taille', choices: [{ label: 'Médium', price: 0 }, { label: 'Large', price: 3 }] }],
  },
  {
    id: 'm11', name: 'Croque-Monsieur', description: 'Jambon blanc, emmental, béchamel, pain de mie grillé', price: 11.90,
    image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=300&h=300&fit=crop',
    category: 'Sandwichs', tags: ['populaire'], isPopular: true, calories: 580, prepTime: 10,
  },
  {
    id: 'm12', name: 'Soupe à l\'oignon', description: 'Oignons caramélisés, bouillon de bœuf, gruyère, croûtons', price: 9.50,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop',
    category: 'Entrées', tags: ['végétarien'], calories: 320, prepTime: 12,
  },
];

const reviews: Review[] = [
  { id: 'r1', user: 'Marie D.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie', rating: 5, date: '2025-01-10', text: 'Une expérience exceptionnelle ! Le steak était parfaitement cuit et les frites croustillantes. La livraison était rapide et le packaging soigné.', helpful: 12, verified: true },
  { id: 'r2', user: 'Jean M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean', rating: 4, date: '2025-01-08', text: 'Très bonne cuisine française traditionnelle. Le burger signature est un régal. Seul bémol : la livraison a pris un peu plus de temps que prévu.', helpful: 8, verified: true },
  { id: 'r3', user: 'Sophie L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', rating: 5, date: '2025-01-05', text: 'Le meilleur bistro de Paris en livraison ! Les portions sont généreuses et les produits de qualité. Je recommande vivement la tarte tatin.', helpful: 15, images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop'], verified: true },
  { id: 'r4', user: 'Pierre B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre', rating: 3, date: '2025-01-02', text: 'La nourriture est bonne mais le prix est un peu élevé pour la quantité. Le delivery fee de 3€ est aussi un peu cher.', helpful: 3, verified: true },
];

// ─── Tag Config ──────────────────────────────────────────────────────
const tagConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  populaire: { icon: Flame, color: '#FF3008', bg: '#FFF0ED', label: 'Populaire' },
  végétarien: { icon: Leaf, color: '#00C853', bg: '#E8F5E9', label: 'Végé' },
  healthy: { icon: Heart, color: '#00C853', bg: '#E8F5E9', label: 'Healthy' },
  viande: { icon: Flame, color: '#FF3008', bg: '#FFF0ED', label: 'Viande' },
  poisson: { icon: Snowflake, color: '#2962FF', bg: '#E3F2FD', label: 'Poisson' },
};

// ─── Main Component ──────────────────────────────────────────────────
export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items: cartItems, total: cartTotal } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info' | 'photos'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showItemModal, setShowItemModal] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showHours, setShowHours] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'positive' | 'critical'>('all');
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [showCartBar, setShowCartBar] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((item) => item.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeFilters.length > 0 && !activeFilters.some((f) => item.tags.includes(f))) return false;
      return true;
    });
  }, [selectedCategory, searchQuery, activeFilters]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const restaurantCartCount = cartItems.filter((item) => item.restaurantId === mockRestaurant.id).reduce((sum, item) => sum + item.quantity, 0);
  const restaurantCartTotal = cartItems.filter((item) => item.restaurantId === mockRestaurant.id).reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    setShowCartBar(restaurantCartCount > 0);
  }, [restaurantCartCount]);

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price + Object.entries(selectedOptions).reduce((sum, [optName, choiceLabel]) => {
        const option = item.options?.find((o) => o.name === optName);
        const choice = option?.choices.find((c) => c.label === choiceLabel);
        return sum + (choice?.price || 0);
      }, 0),
      image: item.image,
      restaurantId: mockRestaurant.id,
      restaurantName: mockRestaurant.name,
      quantity,
      category: item.category,
    });
    toast?.show?.(`${item.name} ajouté au panier`);
    setShowItemModal(null);
    setItemQuantity(1);
    setSelectedOptions({});
  };

  const handleToggleFilter = (filter: string) => {
    setActiveFilters((prev) => prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]);
  };

  const handleToggleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId); else next.add(reviewId);
      return next;
    });
  };

  const filteredReviews = useMemo(() => {
    switch (reviewFilter) {
      case 'positive': return reviews.filter((r) => r.rating >= 4);
      case 'critical': return reviews.filter((r) => r.rating <= 2);
      default: return reviews;
    }
  }, [reviewFilter]);

  // ─── Item Modal ────────────────────────────────────────────────────
  const ItemModal = () => {
    if (!showItemModal) return null;
    const item = showItemModal;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[300] flex items-end sm:items-center justify-center"
          onClick={() => setShowItemModal(null)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Image */}
            <div className="relative">
              <SafeImage src={item.image} alt={item.name} className="w-full h-56 object-cover rounded-t-3xl" />
              <button
                onClick={() => setShowItemModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
              >
                <X size={18} className="text-[#1A1A1A]" />
              </button>
              {item.isPopular && (
                <span className="absolute top-4 left-4 px-2 py-1 rounded-lg bg-[#FF3008] text-white text-[10px] font-bold">POPULAIRE</span>
              )}
              {item.isNew && (
                <span className="absolute top-4 left-4 px-2 py-1 rounded-lg bg-[#2962FF] text-white text-[10px] font-bold">NOUVEAU</span>
              )}
            </div>

            <div className="p-5">
              {/* Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#1A1A1A]">{item.name}</h3>
                <p className="text-sm text-[#6B6B6B] mt-1">{item.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  {item.calories && (
                    <span className="text-xs text-[#A6A6A6] flex items-center gap-1">
                      <Flame size={12} /> {item.calories} kcal
                    </span>
                  )}
                  {item.prepTime && (
                    <span className="text-xs text-[#A6A6A6] flex items-center gap-1">
                      <Timer size={12} /> {item.prepTime} min
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.tags.map((tag) => {
                  const config = tagConfig[tag];
                  if (!config) return null;
                  return (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ backgroundColor: config.bg, color: config.color }}>
                      <config.icon size={10} /> {config.label}
                    </span>
                  );
                })}
              </div>

              {/* Options */}
              {item.options?.map((option) => (
                <div key={option.name} className="mb-4">
                  <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">{option.name}</h4>
                  <div className="space-y-2">
                    {option.choices.map((choice) => (
                      <button
                        key={choice.label}
                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: choice.label }))}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          selectedOptions[option.name] === choice.label ? 'border-[#FF3008] bg-[#FFF0ED]' : 'border-[#F0EEEA] hover:border-[#E8E8E8]'
                        }`}
                      >
                        <span className="text-sm text-[#1A1A1A]">{choice.label}</span>
                        <div className="flex items-center gap-2">
                          {choice.price > 0 && <span className="text-xs text-[#A6A6A6]">+ €{choice.price.toFixed(2)}</span>}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOptions[option.name] === choice.label ? 'border-[#FF3008] bg-[#FF3008]' : 'border-[#E8E8E8]'}`}>
                            {selectedOptions[option.name] === choice.label && <Check size={12} className="text-white" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF8E1] mb-4">
                  <AlertCircle size={16} className="text-[#FFB300] flex-shrink-0" />
                  <p className="text-xs text-[#6B6B6B]">Allergènes : {item.allergens.join(', ')}</p>
                </div>
              )}

              {/* Quantity & Add */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#F0EEEA]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="w-10 h-10 rounded-xl border border-[#E8E8E8] flex items-center justify-center hover:border-[#FF3008] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{itemQuantity}</span>
                  <button
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="w-10 h-10 rounded-xl border border-[#E8E8E8] flex items-center justify-center hover:border-[#FF3008] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(item, itemQuantity)}
                  className="flex-1 h-12 rounded-xl bg-[#FF3008] text-white font-semibold hover:bg-[#E62B07] transition-colors flex items-center justify-center gap-2"
                >
                  Ajouter · €{((item.price + Object.entries(selectedOptions).reduce((sum, [optName, choiceLabel]) => {
                    const option = item.options?.find((o) => o.name === optName);
                    const choice = option?.choices.find((c) => c.label === choiceLabel);
                    return sum + (choice?.price || 0);
                  }, 0)) * itemQuantity).toFixed(2)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ─── Photo Gallery ─────────────────────────────────────────────────
  const PhotoGallery = () => {
    if (!showPhotoGallery) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center"
          onClick={() => setShowPhotoGallery(false)}
        >
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white" onClick={() => setShowPhotoGallery(false)}>
            <X size={20} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            onClick={(e) => { e.stopPropagation(); setPhotoIndex((prev) => (prev - 1 + mockRestaurant.photos.length) % mockRestaurant.photos.length); }}
          >
            <ChevronLeft size={20} />
          </button>
          <SafeImage
            src={mockRestaurant.photos[photoIndex]}
            alt=""
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl"
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            onClick={(e) => { e.stopPropagation(); setPhotoIndex((prev) => (prev + 1) % mockRestaurant.photos.length); }}
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {mockRestaurant.photos.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setPhotoIndex(i); }} className={`w-2 h-2 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Header Image */}
      <div className="relative h-[280px] sm:h-[360px]">
        <SafeImage src={mockRestaurant.image} alt={mockRestaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <ChevronLeft size={20} className="text-[#1A1A1A]" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(mockRestaurant.id)}
              className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors ${
                isFavorite(mockRestaurant.id) ? 'bg-[#FF3008] text-white' : 'bg-white/90 text-[#1A1A1A] hover:bg-white'
              }`}
            >
              <Heart size={18} fill={isFavorite(mockRestaurant.id) ? 'currentColor' : 'none'} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Share2 size={18} className="text-[#1A1A1A]" />
            </button>
          </div>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{mockRestaurant.name}</h1>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Star size={14} fill="#FFB300" className="text-[#FFB300]" /> {mockRestaurant.rating}
                </span>
                <span>·</span>
                <span>({mockRestaurant.reviewCount}+ avis)</span>
                <span>·</span>
                <span>{mockRestaurant.cuisine}</span>
                <span>·</span>
                <span>{mockRestaurant.priceRange}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {mockRestaurant.isOpen ? (
                <span className="px-2 py-1 rounded-lg bg-[#00C853] text-white text-xs font-medium">Ouvert</span>
              ) : (
                <span className="px-2 py-1 rounded-lg bg-[#FF3008] text-white text-xs font-medium">Fermé</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Promotions */}
      {mockRestaurant.promotions && mockRestaurant.promotions.length > 0 && (
        <div className="px-4 -mt-2 relative z-10">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {mockRestaurant.promotions.map((promo, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#FF3008] text-xs font-medium">
                <Percent size={12} /> {promo.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
          <span className="flex items-center gap-1"><Clock size={14} className="text-[#FF3008]" /> {mockRestaurant.deliveryTime}</span>
          <span className="flex items-center gap-1"><Truck size={14} className="text-[#FF3008]" /> {mockRestaurant.deliveryFee === 0 ? 'Gratuite' : `€${mockRestaurant.deliveryFee}`}</span>
          <span className="flex items-center gap-1"><ShoppingBag size={14} className="text-[#FF3008]" /> Min. €{mockRestaurant.minOrder}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-[#FDF8F3]/95 backdrop-blur-xl border-b border-[#F0EEEA]">
        <div className="flex gap-1 px-4">
          {[
            { key: 'menu' as const, label: 'Menu', icon: UtensilsCrossed },
            { key: 'reviews' as const, label: 'Avis', icon: Star },
            { key: 'info' as const, label: 'Infos', icon: Info },
            { key: 'photos' as const, label: 'Photos', icon: Camera },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-[#FF3008] text-[#FF3008]' : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 pb-28">
        {activeTab === 'menu' && (
          <div className="space-y-5">
            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans le menu..."
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-3 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  showFilters || activeFilters.length > 0 ? 'border-[#FF3008] bg-[#FFF0ED] text-[#FF3008]' : 'border-[#E8E8E8] bg-white text-[#6B6B6B]'
                }`}
              >
                <SlidersHorizontal size={16} /> Filtres {activeFilters.length > 0 && `(${activeFilters.length})`}
              </button>
            </div>

            {/* Filter Tags */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {Object.entries(tagConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleToggleFilter(key)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeFilters.includes(key)
                          ? 'bg-[#FF3008] text-white'
                          : 'bg-white border border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF3008]'
                      }`}
                    >
                      <config.icon size={12} /> {config.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === cat ? 'bg-[#FF3008] text-white' : 'bg-white border border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF3008]'
                  }`}
                >
                  {cat === 'all' ? 'Tout' : cat}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">{category}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl border border-[#F0EEEA] p-4 flex gap-4 cursor-pointer hover:border-[#FF3008]/30 transition-colors"
                      onClick={() => { setShowItemModal(item); setItemQuantity(1); setSelectedOptions({}); }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-[#1A1A1A]">{item.name}</h4>
                              {item.isPopular && <Flame size={14} className="text-[#FF3008]" />}
                              {item.isNew && <span className="px-1.5 py-0.5 rounded bg-[#2962FF] text-white text-[9px] font-bold">NEW</span>}
                            </div>
                            <p className="text-xs text-[#A6A6A6] mt-0.5 line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-bold text-[#1A1A1A]">€{item.price.toFixed(2)}</span>
                          {item.calories && <span className="text-[10px] text-[#A6A6A6]">{item.calories} kcal</span>}
                          {item.prepTime && <span className="text-[10px] text-[#A6A6A6]">{item.prepTime} min</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag) => {
                            const config = tagConfig[tag];
                            if (!config) return null;
                            return (
                              <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ backgroundColor: config.bg, color: config.color }}>
                                <config.icon size={8} /> {config.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="relative flex-shrink-0">
                        <SafeImage src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#FF3008] text-white flex items-center justify-center shadow-lg hover:bg-[#E62B07] transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-5">
            {/* Rating Overview */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#1A1A1A]">{mockRestaurant.rating}</p>
                  <div className="flex items-center gap-0.5 justify-center my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= Math.round(mockRestaurant.rating) ? '#FFB300' : '#E8E8E8'} className={star <= Math.round(mockRestaurant.rating) ? 'text-[#FFB300]' : 'text-[#E8E8E8]'} />
                    ))}
                  </div>
                  <p className="text-xs text-[#A6A6A6]">{mockRestaurant.reviewCount} avis</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter((r) => r.rating === rating).length;
                    const pct = (count / reviews.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs text-[#A6A6A6] w-3">{rating}</span>
                        <Star size={10} className="text-[#FFB300]" fill="#FFB300" />
                        <div className="flex-1 h-1.5 bg-[#F0EEEA] rounded-full overflow-hidden">
                          <div className="h-full bg-[#FFB300] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-[#A6A6A6] w-4">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Review Filters */}
            <div className="flex gap-2">
              {[
                { key: 'all' as const, label: 'Tous' },
                { key: 'positive' as const, label: 'Positifs' },
                { key: 'critical' as const, label: 'Critiques' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setReviewFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    reviewFilter === f.key ? 'bg-[#FF3008] text-white' : 'bg-white border border-[#E8E8E8] text-[#6B6B6B]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-[#F0EEEA] p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <SafeImage src={review.avatar} alt={review.user} containerClassName="w-9 h-9 rounded-full" placeholderSize={18} />
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{review.user}</p>
                        <p className="text-[10px] text-[#A6A6A6]">{new Date(review.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} fill={star <= review.rating ? '#FFB300' : '#E8E8E8'} className={star <= review.rating ? 'text-[#FFB300]' : 'text-[#E8E8E8]'} />
                      ))}
                    </div>
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E8F5E9] text-[#00C853] text-[10px] font-medium mb-2">
                      <BadgeCheck size={10} /> Client vérifié
                    </span>
                  )}
                  <p className="text-sm text-[#6B6B6B] mt-2">{review.text}</p>
                  {review.images && (
                    <div className="flex gap-2 mt-3">
                      {review.images.map((img, i) => (
                        <SafeImage key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F0EEEA]">
                    <button
                      onClick={() => handleToggleHelpful(review.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${helpfulReviews.has(review.id) ? 'text-[#FF3008]' : 'text-[#A6A6A6] hover:text-[#6B6B6B]'}`}
                    >
                      <ThumbsUp size={12} fill={helpfulReviews.has(review.id) ? 'currentColor' : 'none'} />
                      Utile ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-5">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">À propos</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{mockRestaurant.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {mockRestaurant.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-lg bg-[#F9F9FB] text-[#6B6B6B] text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <button
                onClick={() => setShowHours(!showHours)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <Clock size={18} className="text-[#FF3008]" /> Horaires
                </h3>
                {showHours ? <ChevronUp size={18} className="text-[#A6A6A6]" /> : <ChevronDown size={18} className="text-[#A6A6A6]" />}
              </button>
              <AnimatePresence>
                {showHours && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div className="mt-3 space-y-2">
                      {mockRestaurant.openingHours.map((oh) => (
                        <div key={oh.day} className="flex items-center justify-between text-sm">
                          <span className="text-[#1A1A1A] font-medium">{oh.day}</span>
                          <span className="text-[#6B6B6B]">{oh.hours}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Address & Contact */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5 space-y-3">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">Adresse & Contact</h3>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FF3008] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A1A1A]">{mockRestaurant.address}</p>
                  <button className="text-xs text-[#FF3008] font-medium mt-1 hover:underline">Voir sur la carte</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF3008] flex-shrink-0" />
                <p className="text-sm text-[#1A1A1A]">{mockRestaurant.phone}</p>
              </div>
            </div>

            {/* Badges */}
            {mockRestaurant.badges && mockRestaurant.badges.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">Badges & Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {mockRestaurant.badges.map((badge) => (
                    <span key={badge} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#FF3008] text-xs font-medium">
                      <BadgeCheck size={14} /> {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {mockRestaurant.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => { setPhotoIndex(i); setShowPhotoGallery(true); }}
                  className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`}
                >
                  <SafeImage src={photo} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Bar */}
      <AnimatePresence>
        {showCartBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-16 sm:bottom-0 inset-x-0 z-40 px-4 pb-4"
          >
            <button
              onClick={() => navigate('/cart')}
              className="w-full h-14 rounded-2xl bg-[#FF3008] text-white font-semibold shadow-lg flex items-center justify-between px-5 hover:bg-[#E62B07] transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <span>{restaurantCartCount} article{restaurantCartCount > 1 ? 's' : ''}</span>
              </div>
              <span>€{restaurantCartTotal.toFixed(2)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ItemModal />
      <PhotoGallery />

      <BottomNav />
    </div>
  );
}

// ─── Camera icon helper ──────────────────────────────────────────────
function Camera(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
    </svg>
  );
}
