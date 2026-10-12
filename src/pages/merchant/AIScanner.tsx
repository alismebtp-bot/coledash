import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Search,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Download,
  ChefHat,
  ArrowRight,
  ImageIcon,
  RefreshCw,
  FileText,
  Sparkles,
  Star,
  Clock,
  Zap,
  X,
} from 'lucide-react';
import {
  scrapeWebsite,
  generateItemImages,
  importRestaurant,
  type ScrapedRestaurant,
  type ScrapeProgress,
} from '@/utils/AIScraper';

/* ─────────────────────── types ─────────────────────── */

interface ScanResult {
  id: string;
  url: string;
  status: 'scanning' | 'extracting' | 'generating' | 'completed' | 'error';
  restaurant?: ScrapedRestaurant;
  progress: number;
  logs: string[];
}

/* ─────────────────────── mock history ─────────────────────── */

const mockHistory: ScanResult[] = [
  {
    id: 'scan-001',
    url: 'https://lepizza-napoli.fr',
    status: 'completed',
    progress: 100,
    logs: ['URL analysée', 'Cuisine détectée : Italienne', '28 articles extraits', 'SEO généré'],
  },
  {
    id: 'scan-002',
    url: 'https://sushi-zen-paris.com',
    status: 'completed',
    progress: 100,
    logs: ['URL analysée', 'Cuisine détectée : Asiatique', '35 articles extraits', 'SEO généré'],
  },
];

/* ─────────────────────── sub-components ─────────────────────── */

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-cd-border rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-cd-primary to-cd-primary-light rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

function ScanLog({ logs }: { logs: string[] }) {
  return (
    <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs space-y-1.5">
      {logs.map((log, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-cd-success">✓</span>
          <span className="text-cd-text-primary">{log}</span>
        </motion.div>
      ))}
      {logs.length > 0 && logs[logs.length - 1].includes('...') && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-cd-primary"
        >
          _
        </motion.div>
      )}
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: ScrapedRestaurant }) {
  const [imported, setImported] = useState(false);

  const handleImport = () => {
    importRestaurant(restaurant);
    setImported(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-mp-text">{restaurant.name}</h3>
          <p className="text-sm text-cd-text-secondary capitalize">{restaurant.cuisine} · {restaurant.items.length} articles</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-cd-success-light text-cd-success text-[10px] font-bold rounded-full">
            AI SCAN
          </span>
        </div>
      </div>

      {/* SEO Preview */}
      <div className="bg-cd-bg-warm rounded-lg p-4">
        <p className="text-[10px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-2">SEO généré</p>
        <div className="flex flex-wrap gap-1.5">
          {restaurant.seoKeywords.slice(0, 10).map((kw) => (
            <span key={kw} className="px-2 py-0.5 bg-white text-cd-text-secondary text-[11px] rounded border border-cd-border">
              {kw}
            </span>
          ))}
        </div>
        <p className="text-xs text-cd-text-secondary mt-2 italic">{restaurant.metaDescription}</p>
      </div>

      {/* Items preview */}
      <div>
        <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-2">Aperçu du menu</p>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {restaurant.items.slice(0, 6).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2.5 bg-cd-bg-warm rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cd-border flex items-center justify-center">
                  <ImageIcon size={14} className="text-cd-text-tertiary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-cd-text-primary">{item.name}</p>
                  <p className="text-[11px] text-cd-text-tertiary">{item.category}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-cd-text-primary">{item.price.toFixed(2)} €</span>
            </div>
          ))}
        </div>
        {restaurant.items.length > 6 && (
          <p className="text-xs text-cd-text-tertiary text-center mt-2">+ {restaurant.items.length - 6} autres articles</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleImport}
          disabled={imported}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
            imported
              ? 'bg-cd-success text-white'
              : 'bg-cd-primary text-white hover:bg-cd-primary-hover'
          }`}
        >
          {imported ? <CheckCircle2 size={16} /> : <Download size={16} />}
          {imported ? 'Importé !' : 'Importer dans le catalogue'}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function AIScanner() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>(mockHistory);

  const runScan = useCallback(async () => {
    if (!url.trim() || isScanning) return;

    const scanId = `scan-${Date.now()}`;
    const newScan: ScanResult = {
      id: scanId,
      url: url.trim(),
      status: 'scanning',
      progress: 0,
      logs: ['Analyse de l\'URL...'],
    };

    setCurrentScan(newScan);
    setIsScanning(true);

    try {
      const result = await scrapeWebsite(url.trim(), (progress: ScrapeProgress) => {
        setCurrentScan((prev) =>
          prev
            ? {
                ...prev,
                progress: progress.percentage,
                logs: [...prev.logs, progress.message],
              }
            : prev
        );
      });

      // Generate images
      setCurrentScan((prev) =>
        prev
          ? {
              ...prev,
              status: 'generating',
              logs: [...prev.logs, 'Génération des images IA...'],
            }
          : prev
      );

      const itemsWithImages = await generateItemImages(
        result.items,
        result.cuisine,
        (current, total, itemName) => {
          setCurrentScan((prev) =>
            prev
              ? {
                  ...prev,
                  progress: 40 + Math.floor((current / total) * 60),
                  logs: [...prev.logs.slice(0, -1), `Image ${current}/${total}: ${itemName}`],
                }
              : prev
          );
        }
      );

      const finalResult = { ...result, items: itemsWithImages };

      setCurrentScan((prev) =>
        prev
          ? {
              ...prev,
              status: 'completed',
              progress: 100,
              restaurant: finalResult,
              logs: [...prev.logs, `${itemsWithImages.length} images générées`, 'Scan terminé !'],
            }
          : prev
      );

      setHistory((prev) => [
        { ...newScan, status: 'completed', progress: 100, restaurant: finalResult },
        ...prev,
      ]);
    } catch {
      setCurrentScan((prev) =>
        prev
          ? {
              ...prev,
              status: 'error',
              logs: [...prev.logs, 'Erreur lors du scan'],
            }
          : prev
      );
    } finally {
      setIsScanning(false);
    }
  }, [url, isScanning]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[700px] mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-cd-primary/10 flex items-center justify-center mx-auto">
          <Sparkles size={28} className="text-cd-primary" />
        </div>
        <h1 className="text-[28px] font-bold text-mp-text">Scanner IA</h1>
        <p className="text-sm text-cd-text-secondary max-w-md mx-auto">
          Analysez le site web de n'importe quel restaurant pour extraire automatiquement le menu, générer des images et optimiser le référencement.
        </p>
      </div>

      {/* URL Input */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://restaurant-exemple.fr"
              className="w-full pl-10 pr-4 py-3 border border-cd-border rounded-xl text-sm text-cd-text-primary focus:outline-none focus:border-cd-primary focus:ring-2 focus:ring-cd-primary/15 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && runScan()}
              disabled={isScanning}
            />
          </div>
          <button
            onClick={runScan}
            disabled={isScanning || !url.trim()}
            className="px-6 py-3 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isScanning ? <Loader2 size={16} className="animate-spin" /> : <Scan size={16} />}
            {isScanning ? 'Scan en cours...' : 'Scanner'}
          </button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-cd-text-tertiary">Exemples :</span>
          {['https://lepizza-napoli.fr', 'https://sushi-zen.com', 'https://bistrot-parisien.fr'].map((ex) => (
            <button
              key={ex}
              onClick={() => setUrl(ex)}
              className="text-xs text-cd-primary hover:underline"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <AnimatePresence>
        {currentScan && currentScan.status !== 'completed' && currentScan.status !== 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Loader2 size={18} className="text-cd-primary animate-spin" />
                <span className="text-sm font-semibold text-cd-text-primary">Scan en cours...</span>
              </div>
              <span className="text-sm font-bold text-cd-primary">{currentScan.progress}%</span>
            </div>
            <ProgressBar value={currentScan.progress} />
            <ScanLog logs={currentScan.logs} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {currentScan?.restaurant && (
          <RestaurantCard restaurant={currentScan.restaurant} />
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-mp-text">Historique des scans</h2>
          <div className="space-y-2">
            {history.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-cd-success" />
                  <span className="text-sm text-cd-text-primary">{scan.url}</span>
                </div>
                <span className="text-xs text-cd-text-tertiary">
                  {scan.restaurant?.items.length || '?'} articles
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
