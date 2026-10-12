/**
 * ═══════════════════════════════════════════════════════════════════
 *  BouquetBuilder — World-class bouquet customization page
 *  (shadcn/ui + Tailwind + Framer Motion + Lucide)
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  ArrowLeft, ShoppingBag, Sparkles, Flower2, Heart, Trash2, ChevronRight,
  RotateCcw, Save, Copy, Move, Layers, ChevronUp, ChevronDown,
  Package, Minus, X, Check, Info, Leaf, Sun, Droplets, RefreshCw,
  Search, SlidersHorizontal, Palette, Share2, Download, Smartphone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { builderFlowers, builderVases, colorPalettes, wrappingOptions, getFlowerById, getVaseById } from '@/data/bouquetBuilder';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SafeImage } from '@/components/SafeImage';

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
interface BouquetItem {
  flowerId: string;
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  scale: number;
  rotation: number;
  zIndex: number;
}

interface SavedBouquet {
  id: string;
  name: string;
  items: BouquetItem[];
  vaseId: string;
  wrappingId: string;
  paletteId: string | null;
  createdAt: string;
  totalPrice: number;
}

const CATEGORIES = ['all', 'classic', 'exotic', 'romantic', 'seasonal', 'foliage'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  all: 'Toutes',
  classic: 'Classiques',
  exotic: 'Exotiques',
  romantic: 'Romantiques',
  seasonal: 'Saisonnières',
  foliage: 'Feuillages',
};

/* ═══════════════════════════════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════════════════════════════ */
const panelVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

/* ═══════════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════════ */
export default function BouquetBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const canvasRef = useRef<HTMLDivElement>(null);

  /* ── State ────────────────────────────────────────────────── */
  const [selectedItems, setSelectedItems] = useState<BouquetItem[]>([]);
  const [selectedVase, setSelectedVase] = useState<string>('');
  const [selectedWrapping, setSelectedWrapping] = useState<string>('paper-kraft');
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [selectedFlowerIdx, setSelectedFlowerIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredFlower, setHoveredFlower] = useState<string | null>(null);

  /* AI preview mode */
  const [aiPreviewMode, setAiPreviewMode] = useState(false);
  const [aiParams, setAiParams] = useState({ density: 50, height: 50, spread: 50, formality: 50 });
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [aiSeed, setAiSeed] = useState(0);

  /* Save / load */
  const [savedBouquets, setSavedBouquets] = useState<SavedBouquet[]>(() => {
    try {
      const raw = localStorage.getItem('coledash-saved-bouquets');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showLoadPanel, setShowLoadPanel] = useState(false);

  /* Mobile panels */
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [showMobileConfig, setShowMobileConfig] = useState(false);

  /* Canvas interaction */
  const [canvasMode, setCanvasMode] = useState<'select' | 'pan'>('select');
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

  /* ═══════════════════════════════════════════════════════════
     Derived state
     ═══════════════════════════════════════════════════════════ */
  const filteredFlowers = useMemo(() => {
    let list = builderFlowers;
    if (activeCategory !== 'all') {
      list = list.filter((f) => f.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((f) => f.nameFr.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return list;
  }, [activeCategory, searchQuery]);

  const flowerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedItems.forEach((item) => {
      counts[item.flowerId] = (counts[item.flowerId] || 0) + 1;
    });
    return counts;
  }, [selectedItems]);

  const selectedFlower = selectedFlowerIdx !== null ? selectedItems[selectedFlowerIdx] : null;

  const priceBreakdown = useMemo(() => {
    const flowersCost = selectedItems.reduce((sum, item) => {
      const f = getFlowerById(item.flowerId);
      return sum + (f?.price || 0);
    }, 0);
    const vaseCost = selectedVase ? (getVaseById(selectedVase)?.price || 0) : 0;
    const wrapCost = wrappingOptions.find((w) => w.id === selectedWrapping)?.price || 0;
    const arrangementFee = selectedItems.length > 0 ? 5.99 : 0;
    const total = flowersCost + vaseCost + wrapCost + arrangementFee;
    return { flowersCost, vaseCost, wrapCost, arrangementFee, total };
  }, [selectedItems, selectedVase, selectedWrapping]);

  /* ═══════════════════════════════════════════════════════════
     Actions
     ═══════════════════════════════════════════════════════════ */
  const addFlower = useCallback((flowerId: string) => {
    const flower = getFlowerById(flowerId);
    if (!flower) return;
    setSelectedItems((prev) => [
      ...prev,
      {
        flowerId,
        x: 40 + Math.random() * 20,
        y: 20 + Math.random() * 30,
        scale: 0.8 + Math.random() * 0.4,
        rotation: -15 + Math.random() * 30,
        zIndex: prev.length,
      },
    ]);
    setSelectedFlowerIdx(selectedItems.length);
    toast({ title: `${flower.nameFr} ajoutée`, description: `+${flower.price.toFixed(2)}€` });
  }, [selectedItems.length, toast]);

  const removeFlower = useCallback((idx: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
    if (selectedFlowerIdx === idx) setSelectedFlowerIdx(null);
    else if (selectedFlowerIdx !== null && selectedFlowerIdx > idx) {
      setSelectedFlowerIdx(selectedFlowerIdx - 1);
    }
  }, [selectedFlowerIdx]);

  const updateFlower = useCallback((idx: number, update: Partial<BouquetItem>) => {
    setSelectedItems((prev) => prev.map((item, i) => (i === idx ? { ...item, ...update } : item)));
  }, []);

  const bringForward = useCallback((idx: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      if (idx < next.length - 1) {
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      }
      return next;
    });
  }, []);

  const sendBackward = useCallback((idx: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      if (idx > 0) {
        [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      }
      return next;
    });
  }, []);

  const bringToFront = useCallback((idx: number) => {
    setSelectedItems((prev) => {
      const item = prev[idx];
      return [...prev.filter((_, i) => i !== idx), item];
    });
    setSelectedFlowerIdx(selectedItems.length - 1);
  }, [selectedItems.length]);

  const sendToBack = useCallback((idx: number) => {
    setSelectedItems((prev) => {
      const item = prev[idx];
      return [item, ...prev.filter((_, i) => i !== idx)];
    });
    setSelectedFlowerIdx(0);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedItems([]);
    setSelectedFlowerIdx(null);
    setSelectedVase('');
    setSelectedPalette(null);
    toast({ title: 'Bouquet réinitialisé' });
  }, [toast]);

  const applyPalette = useCallback((paletteId: string) => {
    const palette = colorPalettes.find((p) => p.id === paletteId);
    if (!palette) return;
    setSelectedPalette(paletteId);
    setSelectedItems((prev) =>
      prev.map((item) => ({
        ...item,
        scale: 0.85 + Math.random() * 0.3,
        rotation: -20 + Math.random() * 40,
      }))
    );
    toast({ title: `Palette "${palette.nameFr}" appliquée` });
  }, [toast]);

  const professionalArrange = useCallback(() => {
    setSelectedItems((prev) =>
      prev.map((item, i) => ({
        ...item,
        x: 30 + (i % 5) * 10 + Math.random() * 5,
        y: 15 + Math.floor(i / 5) * 12 + Math.random() * 5,
        scale: 0.9 + Math.random() * 0.2,
        rotation: -10 + Math.random() * 20,
        zIndex: i,
      }))
    );
    toast({ title: 'Arrangement professionnel appliqué' });
  }, [toast]);

  /* AI preview */
  const enterAIPreview = useCallback(() => {
    setAiPreviewMode(true);
    setAiSeed(Math.random());
    toast({ title: 'Mode Aperçu IA activé', description: 'Ajustez les paramètres et appliquez' });
  }, [toast]);

  const updateAIParam = useCallback((key: 'density' | 'height' | 'spread' | 'formality', value: number) => {
    setAiParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyAIPreview = useCallback(() => {
    setSelectedItems((prev) =>
      prev.map((item, i) => {
        const densityFactor = aiParams.density / 50;
        const heightFactor = aiParams.height / 50;
        const spreadFactor = aiParams.spread / 50;
        const formalityFactor = aiParams.formality / 50;
        return {
          ...item,
          x: 20 + (i % Math.max(1, Math.floor(8 * densityFactor))) * (12 * spreadFactor) + Math.random() * 5,
          y: 10 + Math.floor(i / Math.max(1, Math.floor(8 * densityFactor))) * (10 * heightFactor) + Math.random() * 5,
          scale: 0.7 + formalityFactor * 0.5,
          rotation: formalityFactor > 0.7 ? -5 + Math.random() * 10 : -25 + Math.random() * 50,
        };
      })
    );
    setAiPreviewMode(false);
    toast({ title: 'Arrangement IA appliqué' });
  }, [aiParams, toast]);

  const cancelAIPreview = useCallback(() => {
    setAiPreviewMode(false);
  }, []);

  const toggleBeforeAfter = useCallback(() => setShowBeforeAfter((p) => !p), []);
  const regenerateAIPreview = useCallback(() => setAiSeed(Math.random()), []);

  const getAIExplanation = useCallback(() => {
    const parts: string[] = [];
    if (aiParams.density > 60) parts.push('composition dense et opulente');
    else if (aiParams.density < 40) parts.push('composition aérée et minimaliste');
    else parts.push('composition équilibrée');

    if (aiParams.height > 60) parts.push('haute stature pour un effet spectaculaire');
    else if (aiParams.height < 40) parts.push('profil bas pour un effet intime');

    if (aiParams.spread > 60) parts.push('large étalement pour un bouquet généreux');
    else if (aiParams.spread < 40) parts.push('forme compacte et concentrée');

    if (aiParams.formality > 66) parts.push('style structuré et formel');
    else if (aiParams.formality < 33) parts.push('style naturel et déstructuré');
    else parts.push('style mi-formel, mi-naturel');

    return `Le floriste IA propose une ${parts.join(', ')}.`;
  }, [aiParams]);

  /* Save / load */
  const saveBouquet = useCallback(() => {
    if (!saveName.trim()) return;
    const bouquet: SavedBouquet = {
      id: Date.now().toString(),
      name: saveName.trim(),
      items: selectedItems,
      vaseId: selectedVase,
      wrappingId: selectedWrapping,
      paletteId: selectedPalette,
      createdAt: new Date().toISOString(),
      totalPrice: priceBreakdown.total,
    };
    const next = [...savedBouquets, bouquet];
    setSavedBouquets(next);
    localStorage.setItem('coledash-saved-bouquets', JSON.stringify(next));
    setShowSaveDialog(false);
    setSaveName('');
    toast({ title: 'Bouquet sauvegardé', description: bouquet.name });
  }, [saveName, selectedItems, selectedVase, selectedWrapping, selectedPalette, priceBreakdown.total, savedBouquets, toast]);

  const loadBouquet = useCallback((bouquet: SavedBouquet) => {
    setSelectedItems(bouquet.items);
    setSelectedVase(bouquet.vaseId);
    setSelectedWrapping(bouquet.wrappingId);
    setSelectedPalette(bouquet.paletteId);
    setSelectedFlowerIdx(null);
    setShowLoadPanel(false);
    toast({ title: 'Bouquet chargé', description: bouquet.name });
  }, [toast]);

  const deleteSavedBouquet = useCallback((id: string) => {
    const next = savedBouquets.filter((b) => b.id !== id);
    setSavedBouquets(next);
    localStorage.setItem('coledash-saved-bouquets', JSON.stringify(next));
  }, [savedBouquets]);

  /* Cart */
  const handleAddToCart = useCallback(() => {
    if (selectedItems.length === 0) {
      toast({ title: 'Bouquet vide', description: 'Ajoutez des fleurs avant de continuer', variant: 'destructive' });
      return;
    }
    const bouquetName = saveName.trim() || `Bouquet personnalisé (${selectedItems.length} fleurs)`;
    addItem({
      id: `bouquet-${Date.now()}`,
      name: bouquetName,
      price: priceBreakdown.total,
      image: selectedItems[0] ? getFlowerById(selectedItems[0].flowerId)?.image || '' : '',
      quantity: 1,
      storeId: 'bouquet-builder',
      category: 'bouquet',
    });
    toast({ title: 'Bouquet ajouté au panier', description: `${bouquetName} — ${priceBreakdown.total.toFixed(2)}€` });
  }, [selectedItems, priceBreakdown.total, saveName, addItem, toast]);

  /* ═══════════════════════════════════════════════════════════
     Render helpers
     ═══════════════════════════════════════════════════════════ */
  const canvasWidth = 500;
  const canvasHeight = 500;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* ═══════════════ Header ═══════════════ */}
      <header className="pt-24 pb-4 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
              <ArrowLeft size={18} /> Retour
            </button>
            <h1 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <Flower2 size={24} className="text-[#e11d48]" /> Composez votre bouquet
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSaveDialog(true)} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500" title="Sauvegarder">
                <Save size={18} />
              </button>
              <button onClick={() => setShowLoadPanel((p) => !p)} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500" title="Charger">
                <RotateCcw size={18} />
              </button>
              <button onClick={clearAll} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500" title="Tout effacer">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════ Main ═══════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Flower palette ── */}
          <section className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              {/* Search + categories */}
              <div className="p-4 border-b border-stone-100">
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une fleur..."
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 focus:border-[#e11d48]"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-stone-800 text-white'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flower grid */}
              <div className="p-3 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {filteredFlowers.map((flower) => (
                    <FlowerCard
                      key={flower.id}
                      flower={flower}
                      onAdd={() => addFlower(flower.id)}
                      isHovered={hoveredFlower === flower.id}
                      onHover={() => setHoveredFlower(flower.id)}
                      onLeave={() => setHoveredFlower(null)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Center: Canvas ── */}
          <section className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              {/* Canvas toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">{selectedItems.length} fleur{selectedItems.length !== 1 ? 's' : ''}</span>
                  <span className="text-xs text-stone-300">|</span>
                  <span className="text-xs font-semibold text-stone-700">{priceBreakdown.total.toFixed(2)}€</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={professionalArrange} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500" title="Arrangement pro">
                    <Sparkles size={14} />
                  </button>
                  <button onClick={() => setCanvasMode(canvasMode === 'select' ? 'pan' : 'select')} className={`p-1.5 rounded-lg text-xs font-medium ${canvasMode === 'pan' ? 'bg-stone-800 text-white' : 'hover:bg-stone-100 text-stone-500'}`} title="Mode">
                    <Move size={14} />
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div
                ref={canvasRef}
                className="relative bg-stone-50 overflow-hidden"
                style={{ aspectRatio: '1/1', maxHeight: '60vh' }}
              >
                {/* Vase */}
                {selectedVase && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-32">
                    <SafeImage
                      src={getVaseById(selectedVase)?.image || ''}
                      alt="Vase"
                      containerClassName="w-full h-full"
                      className="object-contain"
                      placeholderSize={16}
                    />
                  </div>
                )}

                {/* Wrapping background */}
                {selectedWrapping && (
                  <div
                    className="absolute inset-4 rounded-xl opacity-30"
                    style={{ background: wrappingOptions.find((w) => w.id === selectedWrapping)?.color || '#f5f5f4' }}
                  />
                )}

                {/* Palette gradient overlay */}
                {selectedPalette && (
                  <div
                    className="absolute inset-4 rounded-xl opacity-10 pointer-events-none"
                    style={{ background: colorPalettes.find((p) => p.id === selectedPalette)?.gradient || 'transparent' }}
                  />
                )}

                {/* Flowers */}
                {selectedItems.map((item, idx) => {
                  const flower = getFlowerById(item.flowerId);
                  if (!flower) return null;
                  const isSelected = selectedFlowerIdx === idx;
                  return (
                    <motion.div
                      key={idx}
                      drag
                      dragMomentum={false}
                      onDragEnd={(_, info) => {
                        if (!canvasRef.current) return;
                        const rect = canvasRef.current.getBoundingClientRect();
                        updateFlower(idx, {
                          x: ((item.x / 100) * rect.width + info.offset.x) / rect.width * 100,
                          y: ((item.y / 100) * rect.height + info.offset.y) / rect.height * 100,
                        });
                      }}
                      onClick={() => setSelectedFlowerIdx(isSelected ? null : idx)}
                      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-[#e11d48] ring-offset-2' : ''}`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        zIndex: item.zIndex,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                      }}
                    >
                      <SafeImage
                        src={flower.image}
                        alt={flower.nameFr}
                        containerClassName="w-16 h-16"
                        className="object-contain drop-shadow-md"
                        placeholderSize={12}
                      />
                    </motion.div>
                  );
                })}

                {/* Empty state */}
                {selectedItems.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300">
                    <Flower2 size={48} />
                    <p className="mt-3 text-sm">Cliquez sur une fleur pour commencer</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Right: Config panel ── */}
          <section className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden max-h-[70vh] overflow-y-auto">
              <ConfigPanelContent
                selectedItems={selectedItems}
                selectedVase={selectedVase}
                setSelectedVase={setSelectedVase}
                selectedWrapping={selectedWrapping}
                setSelectedWrapping={setSelectedWrapping}
                selectedPalette={selectedPalette}
                applyPalette={applyPalette}
                flowerCounts={flowerCounts}
                removeFlower={removeFlower}
                clearAll={clearAll}
                selectedFlowerIdx={selectedFlowerIdx}
                selectedFlower={selectedFlower}
                updateFlower={updateFlower}
                bringForward={bringForward}
                sendBackward={sendBackward}
                bringToFront={bringToFront}
                sendToBack={sendToBack}
                professionalArrange={professionalArrange}
                aiPreviewMode={aiPreviewMode}
                aiParams={aiParams}
                enterAIPreview={enterAIPreview}
                updateAIParam={updateAIParam}
                applyAIPreview={applyAIPreview}
                cancelAIPreview={cancelAIPreview}
                showBeforeAfter={showBeforeAfter}
                toggleBeforeAfter={toggleBeforeAfter}
                aiSeed={aiSeed}
                regenerateAIPreview={regenerateAIPreview}
                getAIExplanation={getAIExplanation}
                priceBreakdown={priceBreakdown}
                handleAddToCart={handleAddToCart}
                addFlower={addFlower}
                setSelectedFlowerIdx={setSelectedFlowerIdx}
              />
            </div>
          </section>
        </div>
      </main>

      {/* ═══════════════ Save Dialog ═══════════════ */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-stone-800 mb-4">Sauvegarder le bouquet</h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Nom du bouquet..."
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 focus:border-[#e11d48] mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => setShowSaveDialog(false)} className="flex-1 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50">
                  Annuler
                </button>
                <button
                  onClick={saveBouquet}
                  disabled={!saveName.trim()}
                  className="flex-1 py-3 bg-[#e11d48] text-white rounded-xl text-sm font-semibold hover:bg-[#be123c] transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
                >
                  Sauvegarder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ Load Panel ═══════════════ */}
      <AnimatePresence>
        {showLoadPanel && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoadPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-stone-800">Bouquets sauvegardés</h3>
                <button onClick={() => setShowLoadPanel(false)} className="p-1 rounded-lg hover:bg-stone-100">
                  <X size={18} className="text-stone-500" />
                </button>
              </div>
              {savedBouquets.length === 0 ? (
                <p className="text-stone-400 text-center py-8">Aucun bouquet sauvegardé</p>
              ) : (
                <div className="space-y-3">
                  {savedBouquets.map((bouquet) => (
                    <div key={bouquet.id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        <Flower2 size={20} className="text-stone-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">{bouquet.name}</p>
                        <p className="text-xs text-stone-400">{bouquet.items.length} fleurs · {bouquet.totalPrice.toFixed(2)}€</p>
                      </div>
                      <button onClick={() => loadBouquet(bouquet)} className="px-3 py-1.5 bg-[#e11d48] text-white rounded-lg text-xs font-medium hover:bg-[#be123c]">
                        Charger
                      </button>
                      <button onClick={() => deleteSavedBouquet(bouquet.id)} className="p-1.5 text-stone-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FlowerCard — Individual flower in the palette
   ═══════════════════════════════════════════════════════════════ */
function FlowerCard({
  flower,
  onAdd,
  isHovered,
  onHover,
  onLeave,
}: {
  flower: (typeof builderFlowers)[number];
  onAdd: () => void;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="relative bg-stone-50 rounded-xl border border-stone-100 p-2 hover:border-stone-300 hover:shadow-sm transition-all group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 relative">
        <SafeImage
          src={flower.image}
          alt={flower.nameFr}
          containerClassName="w-full h-full"
          className="object-contain p-1"
          placeholderSize={16}
        />
        {/* Add button overlay */}
        <button
          onClick={onAdd}
          className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-[#e11d48] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#be123c] hover:scale-110 shadow-sm"
        >
          <Plus size={14} />
        </button>
      </div>
      <p className="text-[11px] font-medium text-stone-700 truncate leading-tight">{flower.nameFr}</p>
      <p className="text-[10px] text-stone-400">{flower.price.toFixed(2)}€</p>

      {/* Meaning tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-800 text-white text-[10px] rounded-md whitespace-nowrap z-50 pointer-events-none"
          >
            {flower.meaning}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ConfigPanelContent — Right sidebar content
   ═══════════════════════════════════════════════════════════════ */
function ConfigPanelContent(props: {
  selectedItems: BouquetItem[];
  selectedVase: string;
  setSelectedVase: (v: string) => void;
  selectedWrapping: string;
  setSelectedWrapping: (w: string) => void;
  selectedPalette: string | null;
  applyPalette: (id: string) => void;
  flowerCounts: Record<string, number>;
  removeFlower: (idx: number) => void;
  clearAll: () => void;
  selectedFlowerIdx: number | null;
  selectedFlower: BouquetItem | null;
  updateFlower: (idx: number, u: Partial<BouquetItem>) => void;
  bringForward: (idx: number) => void;
  sendBackward: (idx: number) => void;
  bringToFront: (idx: number) => void;
  sendToBack: (idx: number) => void;
  professionalArrange: () => void;
  aiPreviewMode: boolean;
  aiParams: { density: number; height: number; spread: number; formality: number };
  enterAIPreview: () => void;
  updateAIParam: (key: 'density' | 'height' | 'spread' | 'formality', value: number) => void;
  applyAIPreview: () => void;
  cancelAIPreview: () => void;
  showBeforeAfter: boolean;
  toggleBeforeAfter: () => void;
  aiSeed: number;
  regenerateAIPreview: () => void;
  getAIExplanation: () => string;
  priceBreakdown: {
    flowersCost: number;
    vaseCost: number;
    wrapCost: number;
    arrangementFee: number;
    total: number;
  };
  handleAddToCart: () => void;
  addFlower: (id: string) => void;
  setSelectedFlowerIdx: (idx: number | null) => void;
}) {
  const {
    selectedItems,
    selectedVase, setSelectedVase,
    selectedWrapping, setSelectedWrapping,
    selectedPalette, applyPalette,
    removeFlower, clearAll,
    selectedFlowerIdx, selectedFlower, updateFlower,
    bringForward, sendBackward, bringToFront, sendToBack,
    aiPreviewMode, aiParams,
    enterAIPreview, updateAIParam, applyAIPreview, cancelAIPreview,
    showBeforeAfter, toggleBeforeAfter,
    regenerateAIPreview, getAIExplanation,
    priceBreakdown, handleAddToCart,
    addFlower, setSelectedFlowerIdx,
  } = props;

  return (
    <div className="p-4 space-y-5">
      {/* Selected flowers list — INDIVIDUAL instances */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 flex items-center gap-1.5">
            <Flower2 size={13} /> Fleurs sélectionnées
          </h3>
          {selectedItems.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[10px] text-stone-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
            >
              <RotateCcw size={10} /> Tout effacer
            </button>
          )}
        </div>
        {selectedItems.length === 0 ? (
          <p className="text-[11px] text-stone-300 py-2">Aucune fleur sélectionnée</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {selectedItems.map((item, idx) => {
              const flower = getFlowerById(item.flowerId);
              if (!flower) return null;
              const isSelected = selectedFlowerIdx === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                    isSelected ? 'bg-rose-50 border border-rose-200' : 'hover:bg-stone-50 border border-transparent'
                  }`}
                  onClick={() => setSelectedFlowerIdx(isSelected ? null : idx)}
                >
                  {/* Flower image */}
                  <SafeImage src={flower.image} alt={flower.nameFr} containerClassName="w-6 h-6 rounded" className="object-contain" placeholderSize={10} />
                  {/* Name + price */}
                  <span className="flex-1 text-stone-600 truncate">{flower.nameFr}</span>
                  <span className="text-stone-400 text-[10px]">{flower.price.toFixed(2)}€</span>
                  {/* Action buttons */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); addFlower(item.flowerId); }}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Dupliquer"
                    >
                      <Copy size={11} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFlower(idx); }}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Selected flower controls */}
      <AnimatePresence>
        {selectedFlowerIdx !== null && selectedFlower && (
          <motion.section
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                <Move size={12} /> Ajuster la fleur
              </h4>
              <button
                onClick={() => removeFlower(selectedFlowerIdx)}
                className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-0.5"
              >
                <Trash2 size={10} /> Supprimer
              </button>
            </div>

            {/* Scale slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-stone-500">Taille</label>
                <span className="text-[10px] text-stone-500">{selectedFlower.scale.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.05}
                value={selectedFlower.scale}
                onChange={(e) => updateFlower(selectedFlowerIdx, { scale: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-[#e11d48]"
              />
            </div>

            {/* Rotation slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-stone-500">Rotation</label>
                <span className="text-[10px] text-stone-500">{selectedFlower.rotation}°</span>
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                step={5}
                value={selectedFlower.rotation}
                onChange={(e) => updateFlower(selectedFlowerIdx, { rotation: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-[#e11d48]"
              />
            </div>

            {/* ABSOLUTE Layer controls — Premier plan / Arrière-plan */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => sendToBack(selectedFlowerIdx)}
                className="py-2 bg-white border border-stone-200 rounded-lg text-[10px] font-medium text-stone-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors flex items-center justify-center gap-1"
              >
                <Layers size={10} /> Fond
              </button>
              <button
                onClick={() => bringToFront(selectedFlowerIdx)}
                className="py-2 bg-white border border-stone-200 rounded-lg text-[10px] font-medium text-stone-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles size={10} /> 1er plan
              </button>
            </div>
            {/* Fine-tune layer — step by step */}
            <div className="flex gap-2">
              <button
                onClick={() => sendBackward(selectedFlowerIdx)}
                className="flex-1 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-[10px] text-stone-500 hover:bg-stone-100 transition-colors flex items-center justify-center gap-1"
              >
                <ChevronDown size={10} /> -1
              </button>
              <button
                onClick={() => bringForward(selectedFlowerIdx)}
                className="flex-1 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-[10px] text-stone-500 hover:bg-stone-100 transition-colors flex items-center justify-center gap-1"
              >
                <ChevronUp size={10} /> +1
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* AI Professional Florist */}
      {selectedItems.length > 0 && (
        !aiPreviewMode ? (
          <section className="relative overflow-hidden rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-sm shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-stone-700">Mode Floriste IA</h4>
                <p className="text-[10px] text-stone-500">Voyez comment un pro arrangerait votre bouquet</p>
              </div>
              <button onClick={enterAIPreview} className="shrink-0 px-4 py-2 bg-stone-800 text-white rounded-lg text-[11px] font-semibold hover:bg-stone-900 active:scale-95 transition-all shadow-sm">Apercu</button>
            </div>
          </section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="rounded-xl border border-rose-100 overflow-hidden bg-white shadow-lg shadow-rose-100/30"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={13} className="text-white" />
                </div>
                <h4 className="text-xs font-semibold text-white">Mode Apercu IA</h4>
              </div>
              <button onClick={cancelAIPreview} className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <X size={11} className="text-white" />
              </button>
            </div>

            {/* AI Explanation */}
            <div className="px-3 py-2 bg-amber-50/50 border-b border-stone-100">
              <p className="text-[10px] text-stone-500 leading-relaxed">{getAIExplanation()}</p>
            </div>

            {/* Before/After + Regenerate */}
            <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
              <button onClick={toggleBeforeAfter} className="flex bg-stone-100 rounded-lg p-0.5">
                <span className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all ${!showBeforeAfter ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}>Apres IA</span>
                <span className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all ${showBeforeAfter ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}>Avant</span>
              </button>
              <button
                onClick={regenerateAIPreview}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-medium hover:bg-rose-100 active:scale-95 transition-all"
                title="Nouvelle variation"
              >
                <RefreshCw size={10} /> Variation
              </button>
            </div>

            {/* Sliders */}
            <div className="px-3 py-2.5 space-y-2.5">
              {[
                { key: 'density' as const, label: 'Densite' },
                { key: 'height' as const, label: 'Hauteur' },
                { key: 'spread' as const, label: 'Largeur' },
                { key: 'formality' as const, label: 'Style', format: (v: number) => v <= 33 ? 'Sauvage' : v <= 66 ? 'Equilibre' : 'Structure' },
              ].map(({ key, label, format }) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-[10px] font-semibold text-stone-600">{label}</label>
                    <span className="text-[10px] text-rose-500 font-medium tabular-nums">
                      {format ? format(aiParams[key]) : `${aiParams[key]}%`}
                    </span>
                  </div>
                  <input
                    type="range" min={0} max={100} step={1} value={aiParams[key]}
                    onChange={(e) => updateAIParam(key, parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-[#e11d48]"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-3 py-2.5 border-t border-stone-100 flex gap-2">
              <button onClick={applyAIPreview} className="flex-1 py-2.5 bg-gradient-to-r from-stone-800 to-stone-700 text-white rounded-lg text-xs font-semibold hover:from-stone-900 hover:to-stone-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5">
                <Sparkles size={13} /> Appliquer
              </button>
              <button onClick={cancelAIPreview} className="flex-1 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-50 active:scale-95 transition-all">
                Annuler
              </button>
            </div>
          </motion.section>
        )
      )}

      {/* Vase selector */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2 flex items-center gap-1.5">
          <Package size={13} /> Vase
        </h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setSelectedVase('')}
            className={`shrink-0 w-16 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
              selectedVase === '' ? 'border-rose-400 bg-rose-50' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <Minus size={20} className="text-stone-400 my-3" />
            <span className="text-[9px] text-stone-500 text-center leading-tight">Sans vase</span>
            <span className="text-[9px] text-stone-400">Gratuit</span>
          </button>
          {builderVases.map((vase) => (
            <button
              key={vase.id}
              onClick={() => setSelectedVase(vase.id)}
              className={`shrink-0 w-16 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                selectedVase === vase.id ? 'border-rose-400 bg-rose-50' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <SafeImage src={vase.image} alt={vase.nameFr} containerClassName="w-10 h-10" className="object-contain" placeholderSize={16} />
              <span className="text-[9px] text-stone-500 text-center leading-tight truncate w-full">{vase.nameFr}</span>
              <span className="text-[9px] text-stone-400">{vase.price.toFixed(0)}€</span>
            </button>
          ))}
        </div>
      </section>

      {/* Wrapping options */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2">Emballage</h3>
        <div className="flex flex-wrap gap-1.5">
          {wrappingOptions.map((wrap) => (
            <button
              key={wrap.id}
              onClick={() => setSelectedWrapping(wrap.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                selectedWrapping === wrap.id
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
              }`}
            >
              {wrap.name}
              {wrap.price > 0 && <span className="ml-1 opacity-70">+{wrap.price.toFixed(0)}€</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Color palette presets */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2 flex items-center gap-1.5">
          <Sparkles size={13} /> Palettes prédéfinies
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {colorPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => applyPalette(palette.id)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                selectedPalette === palette.id
                  ? 'border-rose-400 bg-rose-50 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div
                className="h-6 rounded-lg mb-1.5"
                style={{ background: palette.gradient }}
              />
              <p className="text-[11px] font-medium text-stone-700">{palette.nameFr}</p>
              <p className="text-[9px] text-stone-400 leading-tight mt-0.5 line-clamp-2">{palette.description}</p>
              <div className="flex gap-0.5 mt-1.5">
                {palette.flowerIds.slice(0, 4).map((fid) => {
                  const f = getFlowerById(fid);
                  return f ? (
                    <SafeImage key={fid} src={f.image} alt={f.nameFr} containerClassName="w-4 h-4 rounded-sm" className="object-contain" placeholderSize={8} />
                  ) : null;
                })}
                {palette.flowerIds.length > 4 && (
                  <span className="text-[8px] text-stone-400 self-center">+{palette.flowerIds.length - 4}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Price summary */}
      <section className="bg-stone-50 rounded-xl p-3 space-y-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 mb-2">Récapitulatif</h3>
        <PriceRow label={`Fleurs (${selectedItems.length} tige${selectedItems.length !== 1 ? 's' : ''})`} value={priceBreakdown.flowersCost} />
        <PriceRow label={`Vase (${selectedVase ? getVaseById(selectedVase)?.nameFr || 'Aucun' : 'Aucun'})`} value={priceBreakdown.vaseCost} />
        <PriceRow label="Emballage" value={priceBreakdown.wrapCost} />
        <PriceRow label="Frais d'arrangement" value={priceBreakdown.arrangementFee} />
        <div className="border-t border-stone-200 pt-1.5 mt-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">TOTAL</span>
            <motion.span
              key={priceBreakdown.total}
              initial={{ scale: 1.1, color: '#e11d48' }}
              animate={{ scale: 1, color: '#1c1917' }}
              className="text-sm font-bold"
            >
              {priceBreakdown.total.toFixed(2)}€
            </motion.span>
          </div>
        </div>
      </section>

      {/* Add to cart button (desktop) */}
      <button
        onClick={handleAddToCart}
        disabled={selectedItems.length === 0}
        className="w-full py-3.5 bg-[#e11d48] text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-sm flex items-center justify-center gap-2"
      >
        <ShoppingBag size={16} />
        Continuer — {priceBreakdown.total.toFixed(2)}€
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PriceRow — Single price line
   ═══════════════════════════════════════════════════════════════ */
function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-stone-500">{label}</span>
      <span className="text-stone-700 font-medium">{value.toFixed(2)}€</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PriceAnimator — Animated price number
   ═══════════════════════════════════════════════════════════════ */
function PriceAnimator({ value }: { value: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value.toFixed(2)}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.2 }}
      >
        {value.toFixed(2)}€
      </motion.span>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MobilePalette — Bottom sheet for flower palette on mobile
   ═══════════════════════════════════════════════════════════════ */
function MobilePalette({
  activeCategory,
  setActiveCategory,
  filteredFlowers,
  addFlower,
  onClose,
  setShowMobilePalette,
}: {
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filteredFlowers: typeof builderFlowers;
  addFlower: (id: string) => void;
  onClose: () => void;
  setShowMobilePalette: (v: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-[80] bg-white rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.15)] max-h-[45vh] flex flex-col"
    >
      {/* Handle */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 rounded-full bg-stone-300" />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700">Fleurs</h3>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs"
        >
          Fermer
        </button>
      </div>
      {/* Categories */}
      <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all min-w-[52px] text-center ${
              activeCategory === cat ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
      {/* Flower grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2">
          {filteredFlowers.map((flower) => (
            <button
              key={flower.id}
              onClick={() => {
                addFlower(flower.id);
                setShowMobilePalette(false);
              }}
              className="bg-stone-50 rounded-xl border border-stone-100 p-2 text-left active:scale-95 transition-transform"
            >
              <SafeImage src={flower.image} alt={flower.nameFr} containerClassName="w-full aspect-square mb-1" className="object-contain p-0.5" placeholderSize={16} />
              <p className="text-[10px] font-medium text-stone-700 truncate">{flower.nameFr}</p>
              <p className="text-[9px] text-stone-400">{flower.price.toFixed(2)}€</p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MobileConfig — Bottom sheet for config on mobile
   ═══════════════════════════════════════════════════════════════ */
function MobileConfig(props: {
  selectedItems: BouquetItem[];
  selectedVase: string;
  setSelectedVase: (v: string) => void;
  selectedWrapping: string;
  setSelectedWrapping: (w: string) => void;
  selectedPalette: string | null;
  applyPalette: (id: string) => void;
  flowerCounts: Record<string, number>;
  removeFlower: (idx: number) => void;
  clearAll: () => void;
  selectedFlowerIdx: number | null;
  selectedFlower: BouquetItem | null;
  updateFlower: (idx: number, u: Partial<BouquetItem>) => void;
  bringForward: (idx: number) => void;
  sendBackward: (idx: number) => void;
  bringToFront: (idx: number) => void;
  sendToBack: (idx: number) => void;
  professionalArrange: () => void;
  aiPreviewMode: boolean;
  aiParams: { density: number; height: number; spread: number; formality: number };
  enterAIPreview: () => void;
  updateAIParam: (key: 'density' | 'height' | 'spread' | 'formality', value: number) => void;
  applyAIPreview: () => void;
  cancelAIPreview: () => void;
  showBeforeAfter: boolean;
  toggleBeforeAfter: () => void;
  aiSeed: number;
  regenerateAIPreview: () => void;
  getAIExplanation: () => string;
  priceBreakdown: {
    flowersCost: number;
    vaseCost: number;
    wrapCost: number;
    arrangementFee: number;
    total: number;
  };
  handleAddToCart: () => void;
  addFlower: (id: string) => void;
  setSelectedFlowerIdx: (idx: number | null) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-[80] bg-white rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.15)] max-h-[70vh] flex flex-col"
    >
      {/* Handle */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 rounded-full bg-stone-300" />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700">Configuration</h3>
        <button onClick={props.onClose} className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs">
          Fermer
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <ConfigPanelContent {...props} />
      </div>
    </motion.div>
  );
}
