/**
 * ═══════════════════════════════════════════════════════════════════
 *  BrowseRestaurants — Full restaurant browsing page
 *  with real restaurants, menus, filters, and city context
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Star, MapPin, Clock, ChevronDown,
  ChevronUp, ArrowLeft, Heart, Utensils, TrendingUp, Tag, Sparkles,
  Filter, X, Truck, ShoppingBag, Info, Clock3
} from 'lucide-react';
import { restaurants, cuisineTypes, priceRanges } from '@/data/restaurants-real';
import { useCity } from '@/context/CityContext';
import { useToast } from '@/hooks/use-toast';
import { SafeImage } from '@/components/SafeImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonLoader from '@/components/SkeletonLoader';

/* ── types ─────────────────────────────────────────────────────── */
interface FilterState {
  search: string;
  cuisine: string;
  priceRange: string;
  minRating: number;
  sortBy: string;
  onlyOpen: boolean;
  onlyPromo: boolean;
  onlyNew: boolean;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'delivery-time', label: 'Livraison rapide' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
];

/* ── helpers ───────────────────────────────────────────────────── */
const toEuro = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

export default function BrowseRestaurants() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedCity } = useCity();
  const { toast } = useToast();

  /* filter state */
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    cuisine: 'all',
    priceRange: 'all',
    minRating: 0,
    sortBy: 'featured',
    onlyOpen: false,
    onlyPromo: false,
    onlyNew: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  /* favs */
  const [favs, setFavs] = useState<Set<string>>(new Set());

  /* quick filter */
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  /* expanded restaurant (mobile) */
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* city-based filtering */
  const cityRestaurants = useMemo(() => {
    if (!selectedCity) return restaurants;
    return restaurants.filter((r) => r.city.toLowerCase() === selectedCity.name.toLowerCase());
  }, [selectedCity]);

  /* ── derived data ─────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...cityRestaurants];

    /* search */
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.cuisineType.some((c) => c.toLowerCase().includes(q))
      );
    }

    /* cuisine */
    if (filters.cuisine !== 'all') {
      list = list.filter((r) =>
        r.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase()) ||
        r.cuisineType.some((c) => c.toLowerCase().includes(filters.cuisine.toLowerCase()))
      );
    }

    /* price range */
    if (filters.priceRange !== 'all') {
      list = list.filter((r) => r.priceRange === filters.priceRange);
    }

    /* min rating */
    if (filters.minRating > 0) {
      list = list.filter((r) => r.rating >= filters.minRating);
    }

    /* toggles */
    if (filters.onlyOpen) list = list.filter((r) => r.isOpen);
    if (filters.onlyPromo) list = list.filter((r) => r.isPromo);
    if (filters.onlyNew) list = list.filter((r) => r.isNew);

    /* quick filter */
    if (quickFilter === 'bestseller') list = list.filter((r) => r.isBestseller);
    if (quickFilter === 'new') list = list.filter((r) => r.isNew);
    if (quickFilter === 'promo') list = list.filter((r) => r.isPromo);

    /* sort */
    switch (filters.sortBy) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery-time':
        list.sort((a, b) => {
          const getMinutes = (time: string) => {
            const match = time.match(/(\d+)/);
            return match ? parseInt(match[1]) : 999;
          };
          return getMinutes(a.deliveryTime) - getMinutes(b.deliveryTime);
        });
        break;
      case 'price-asc':
        list.sort((a, b) => {
          const getPrice = (r: typeof restaurants[number]) => {
            switch (r.priceRange) {
              case '€': return 1;
              case '€€': return 2;
              case '€€€': return 3;
              case '€€€€': return 4;
              default: return 0;
            }
          };
          return getPrice(a) - getPrice(b);
        });
        break;
      case 'price-desc':
        list.sort((a, b) => {
          const getPrice = (r: typeof restaurants[number]) => {
            switch (r.priceRange) {
              case '€': return 1;
              case '€€': return 2;
              case '€€€': return 3;
              case '€€€€': return 4;
              default: return 0;
            }
          };
          return getPrice(b) - getPrice(a);
        });
        break;
      default:
        break;
    }

    return list;
  }, [cityRestaurants, filters, quickFilter]);

  /* ── actions ──────────────────────────────────────────────────── */
  const toggleFav = useCallback((id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: 'Retiré des favoris' });
      } else {
        next.add(id);
        toast({ title: 'Ajouté aux favoris' });
      }
      return next;
    });
  }, [toast]);

  const handleRestaurantClick = useCallback((id: string) => {
    navigate(`/restaurant/${id}`);
  }, [navigate]);

  /* ── render ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative bg-[#f59e0b] pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} /> Retour
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-3">
              <Utensils size={32} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Restaurants</h1>
            </div>
            <p className="text-white/80 text-lg max-w-xl">
              Découvrez les meilleurs restaurants de {selectedCity?.name || 'votre ville'} livrés chez vous
            </p>
          </motion.div>

          {/* Quick filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {[
              { key: 'bestseller', label: 'Populaires', icon: TrendingUp },
              { key: 'promo', label: 'Promotions', icon: Tag },
              { key: 'new', label: 'Nouveautés', icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setQuickFilter(quickFilter === key ? null : key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  quickFilter === key
                    ? 'bg-white text-[#f59e0b]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
            {quickFilter && (
              <button
                onClick={() => setQuickFilter(null)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 flex items-center gap-1"
              >
                <X size={14} /> Effacer
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar filters ─────────────────────────────────── */}
          <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filtres
                </h3>
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      cuisine: 'all',
                      priceRange: 'all',
                      minRating: 0,
                      sortBy: 'featured',
                      onlyOpen: false,
                      onlyPromo: false,
                      onlyNew: false,
                    })
                  }
                  className="text-xs text-[#f59e0b] hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="text-xs font-medium text-stone-500 mb-2 block">Recherche</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    placeholder="Nom, cuisine..."
                    className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <label className="text-xs font-medium text-stone-500 mb-2 block">Type de cuisine</label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilters((f) => ({ ...f, cuisine: 'all' }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.cuisine === 'all'
                        ? 'bg-[#f59e0b]/10 text-[#f59e0b] font-medium'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Toutes les cuisines
                  </button>
                  {cuisineTypes.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => setFilters((f) => ({ ...f, cuisine }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.cuisine === cuisine
                          ? 'bg-[#f59e0b]/10 text-[#f59e0b] font-medium'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-medium text-stone-500 mb-2 block">Fourchette de prix</label>
                <div className="flex gap-2">
                  {priceRanges.map((pr) => (
                    <button
                      key={pr.value}
                      onClick={() => setFilters((f) => ({ ...f, priceRange: pr.value }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        filters.priceRange === pr.value
                          ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]'
                          : 'border-stone-200 text-stone-500 hover:border-stone-300'
                      }`}
                    >
                      {pr.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min rating */}
              <div>
                <label className="text-xs font-medium text-stone-500 mb-2 block">
                  Note minimum: {filters.minRating > 0 ? `${filters.minRating}+` : 'Toutes'}
                </label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={filters.minRating}
                  onChange={(e) => setFilters((f) => ({ ...f, minRating: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-[#f59e0b]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Toutes</span>
                  <span>5★</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  { key: 'onlyOpen', label: 'Ouvert maintenant' },
                  { key: 'onlyPromo', label: 'En promotion' },
                  { key: 'onlyNew', label: 'Nouveaux restaurants' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        // @ts-ignore
                        filters[key] ? 'bg-[#f59e0b]' : 'bg-stone-300'
                      }`}
                      onClick={() => setFilters((f) => ({ ...f, [key]: !f[key as keyof FilterState] }))}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          // @ts-ignore
                          filters[key] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-stone-600">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Restaurant grid ─────────────────────────────────── */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm text-stone-500">
                {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50"
                >
                  <SlidersHorizontal size={16} /> Filtres
                </button>

                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
                    className="appearance-none bg-white border border-stone-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonLoader key={i} type="card" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Utensils size={48} className="mx-auto text-stone-300 mb-4" />
                <h3 className="text-lg font-semibold text-stone-600 mb-2">Aucun restaurant trouvé</h3>
                <p className="text-stone-400">Essayez d'autres filtres ou termes de recherche</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((restaurant, idx) => (
                    <motion.div
                      key={restaurant.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 bg-stone-100 overflow-hidden">
                          <SafeImage
                            src={restaurant.image}
                            alt={restaurant.name}
                            containerClassName="w-full h-full"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            placeholderSize={24}
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {restaurant.isNew && (
                              <span className="px-2 py-1 bg-[#f59e0b] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                                Nouveau
                              </span>
                            )}
                            {restaurant.isPromo && (
                              <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                                Promo
                              </span>
                            )}
                            {!restaurant.isOpen && (
                              <span className="px-2 py-1 bg-stone-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                                Fermé
                              </span>
                            )}
                          </div>

                          {/* Fav */}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFav(restaurant.id); }}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Heart
                              size={16}
                              className={favs.has(restaurant.id) ? 'fill-[#e11d48] text-[#e11d48]' : 'text-stone-600'}
                            />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-stone-800 text-lg">{restaurant.name}</h3>
                              <p className="text-xs text-stone-400">{restaurant.cuisine} · {restaurant.priceRange}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 bg-amber-50 px-2 py-1 rounded-lg">
                              <Star size={14} className="fill-amber-400 text-amber-400" />
                              <span className="text-sm font-bold text-amber-700">{restaurant.rating}</span>
                              <span className="text-[10px] text-amber-500">({restaurant.reviewCount})</span>
                            </div>
                          </div>

                          <p className="text-sm text-stone-500 mb-3 line-clamp-2">{restaurant.description}</p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {restaurant.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {restaurant.deliveryTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Truck size={12} /> Livraison {restaurant.deliveryFee.toFixed(2)}€
                            </span>
                          </div>

                          {/* Badges */}
                          {restaurant.badges && restaurant.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {restaurant.badges.map((badge) => (
                                <span key={badge} className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] rounded-full">
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Promo text */}
                          {restaurant.isPromo && restaurant.promoText && (
                            <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 bg-amber-50 rounded-lg">
                              <Tag size={12} className="text-amber-500" />
                              <span className="text-xs text-amber-600 font-medium">{restaurant.promoText}</span>
                            </div>
                          )}

                          {/* Menu preview (desktop) */}
                          <div className="hidden sm:block mt-auto">
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                              {restaurant.menu.slice(0, 2).map((cat) => (
                                cat.items.slice(0, 2).map((item) => (
                                  <div key={item.id} className="shrink-0 flex items-center gap-2 bg-stone-50 rounded-lg p-2">
                                    <SafeImage
                                      src={item.image}
                                      alt={item.name}
                                      containerClassName="w-10 h-10 rounded-md"
                                      className="object-cover"
                                      placeholderSize={8}
                                    />
                                    <div>
                                      <p className="text-[11px] font-medium text-stone-700">{item.name}</p>
                                      <p className="text-[10px] text-stone-400">{toEuro(item.price)}</p>
                                    </div>
                                  </div>
                                ))
                              ))}
                            </div>
                          </div>

                          {/* CTA */}
                          <button
                            onClick={() => handleRestaurantClick(restaurant.id)}
                            className="mt-3 w-full sm:w-auto px-6 py-2.5 bg-[#f59e0b] text-white rounded-lg text-sm font-semibold hover:bg-[#d97706] transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingBag size={16} />
                            Commander
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
