import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug,
  Play,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Terminal,
  Loader2,
  Zap,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance';
  status: TestStatus;
  duration?: number;
  error?: string;
  logs: string[];
}

interface TestRun {
  id: string;
  timestamp: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

/* ─────────────────────── mock tests ─────────────────────── */

const initialTests: TestCase[] = [
  {
    id: 't-001',
    name: 'Auth — Login avec credentials valides',
    description: 'Vérifie que l\'utilisateur peut se connecter avec email + mot de passe',
    category: 'unit',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-002',
    name: 'Auth — Token JWT refresh',
    description: 'Vérifie le renouvellement automatique du token',
    category: 'unit',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-003',
    name: 'Cart — Ajout article au panier',
    description: 'Vérifie l\'ajout d\'un article avec options',
    category: 'unit',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-004',
    name: 'Cart — Calcul du total',
    description: 'Vérifie le calcul correct du sous-total, taxes et livraison',
    category: 'unit',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-005',
    name: 'Checkout — Paiement Stripe',
    description: 'Vérifie le flux de paiement complet',
    category: 'integration',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-006',
    name: 'Checkout — Webhook confirmation',
    description: 'Vérifie la réception et le traitement du webhook',
    category: 'integration',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-007',
    name: 'E2E — Commande complète',
    description: 'Simule une commande de bout en bout',
    category: 'e2e',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-008',
    name: 'Perf — Temps de chargement homepage',
    description: 'Vérifie que la page d\'accueil charge en < 2s',
    category: 'performance',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-009',
    name: 'Perf — FPS animation menu',
    description: 'Vérifie les animations à 60fps',
    category: 'performance',
    status: 'pending',
    logs: [],
  },
  {
    id: 't-010',
    name: 'Security — XSS protection',
    description: 'Vérifie la sanitization des entrées utilisateur',
    category: 'unit',
    status: 'pending',
    logs: [],
  },
];

/* ─────────────────────── helpers ─────────────────────── */

const categoryColors: Record<string, { bg: string; text: string }> = {
  unit: { bg: 'bg-cd-info-light', text: 'text-cd-info' },
  integration: { bg: 'bg-cd-warning-light', text: 'text-cd-warning' },
  e2e: { bg: 'bg-cd-primary-light', text: 'text-cd-primary' },
  performance: { bg: 'bg-cd-success-light', text: 'text-cd-success' },
};

function StatusIcon({ status }: { status: TestStatus }) {
  switch (status) {
    case 'passed':
      return <CheckCircle2 size={16} className="text-cd-success" />;
    case 'failed':
      return <XCircle size={16} className="text-cd-error" />;
    case 'running':
      return <Loader2 size={16} className="text-cd-primary animate-spin" />;
    case 'skipped':
      return <AlertTriangle size={16} className="text-cd-warning" />;
    default:
      return <div className="w-4 h-4 rounded-full border-2 border-cd-border" />;
  }
}

/* ─────────────────────── main component ─────────────────────── */

export default function DebugEngineer() {
  const [tests, setTests] = useState<TestCase[]>(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [filter, setFilter] = useState<'all' | 'unit' | 'integration' | 'e2e' | 'performance'>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const filteredTests = filter === 'all' ? tests : tests.filter((t) => t.category === filter);

  const stats = {
    total: tests.length,
    passed: tests.filter((t) => t.status === 'passed').length,
    failed: tests.filter((t) => t.status === 'failed').length,
    pending: tests.filter((t) => t.status === 'pending').length,
    running: tests.filter((t) => t.status === 'running').length,
  };

  const runTests = async () => {
    if (isRunning) return;
    setIsRunning(true);

    // Reset all to pending
    setTests((prev) => prev.map((t) => ({ ...t, status: 'pending' as TestStatus, logs: [], duration: undefined, error: undefined })));

    const startTime = Date.now();
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];

      setTests((prev) =>
        prev.map((t) => (t.id === test.id ? { ...t, status: 'running' as TestStatus, logs: ['Démarrage du test...'] } : t))
      );

      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

      const duration = Math.floor(Math.random() * 150) + 20;
      const shouldPass = Math.random() > 0.2; // 80% pass rate

      const logs: string[] = [
        'Initialisation...',
        `Exécution: ${test.name}`,
        `Durée: ${duration}ms`,
      ];

      if (shouldPass) {
        logs.push('✓ Assertions OK');
        logs.push('✓ Test réussi');
        passed++;

        setTests((prev) =>
          prev.map((t) =>
            t.id === test.id
              ? { ...t, status: 'passed' as TestStatus, duration, logs }
              : t
          )
        );
      } else {
        logs.push('✗ Assertion failed');
        logs.push('✗ Test échoué');
        failed++;

        setTests((prev) =>
          prev.map((t) =>
            t.id === test.id
              ? { ...t, status: 'failed' as TestStatus, duration, logs, error: 'Expected value to be true, received false' }
              : t
          )
        );
      }
    }

    const run: TestRun = {
      id: `run-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      total: tests.length,
      passed,
      failed,
      skipped,
      duration: Date.now() - startTime,
    };

    setRuns((prev) => [run, ...prev].slice(0, 10));
    setIsRunning(false);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTest?.logs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[900px] mx-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-mp-text flex items-center gap-3">
            <Bug size={28} className="text-cd-error" />
            Debug Engineer
          </h1>
          <p className="text-sm text-cd-text-secondary mt-1">
            Suite de tests automatisés pour garantir la qualité du code
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-5 py-2.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {isRunning ? 'Exécution...' : 'Lancer tous les tests'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-extrabold text-cd-text-primary">{stats.total}</p>
        </div>
        <div className="bg-cd-success-light rounded-xl p-4 shadow-sm text-center">
          <p className="text-[11px] font-medium text-cd-success uppercase tracking-wider mb-1">Réussis</p>
          <p className="text-2xl font-extrabold text-cd-success">{stats.passed}</p>
        </div>
        <div className="bg-cd-error-light rounded-xl p-4 shadow-sm text-center">
          <p className="text-[11px] font-medium text-cd-error uppercase tracking-wider mb-1">Échoués</p>
          <p className="text-2xl font-extrabold text-cd-error">{stats.failed}</p>
        </div>
        <div className="bg-cd-info-light rounded-xl p-4 shadow-sm text-center">
          <p className="text-[11px] font-medium text-cd-info uppercase tracking-wider mb-1">En cours</p>
          <p className="text-2xl font-extrabold text-cd-info">{stats.running}</p>
        </div>
        <div className="bg-cd-bg-warm rounded-xl p-4 shadow-sm text-center">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">En attente</p>
          <p className="text-2xl font-extrabold text-cd-text-tertiary">{stats.pending}</p>
        </div>
      </div>

      {/* Filter + List */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Filter tabs */}
        <div className="flex gap-1 p-2 border-b border-cd-border">
          {(['all', 'unit', 'integration', 'e2e', 'performance'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-cd-primary text-white'
                  : 'text-cd-text-secondary hover:bg-cd-bg-warm'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'e2e' ? 'E2E' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Test list */}
        <div className="divide-y divide-cd-border">
          {filteredTests.map((test) => {
            const colors = categoryColors[test.category];
            return (
              <div
                key={test.id}
                onClick={() => setSelectedTest(test)}
                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-cd-bg-warm transition-colors ${
                  selectedTest?.id === test.id ? 'bg-cd-bg-warm' : ''
                }`}
              >
                <StatusIcon status={test.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-cd-text-primary">{test.name}</p>
                  <p className="text-xs text-cd-text-tertiary">{test.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                  {test.category === 'e2e' ? 'E2E' : test.category}
                </span>
                {test.duration && (
                  <span className="text-xs text-cd-text-tertiary w-14 text-right">{test.duration}ms</span>
                )}
                <ChevronRight size={14} className="text-cd-text-tertiary" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected test detail */}
      <AnimatePresence>
        {selectedTest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-[#0d1117] rounded-xl shadow-sm p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-cd-primary" />
                <span className="text-sm font-semibold text-white">{selectedTest.name}</span>
              </div>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-cd-text-tertiary hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="font-mono text-xs space-y-1 max-h-[200px] overflow-y-auto">
              {selectedTest.logs.map((log, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-cd-text-tertiary">[{new Date().toLocaleTimeString('fr-FR')}]</span>
                  <span className={log.includes('✗') ? 'text-cd-error' : log.includes('✓') ? 'text-cd-success' : 'text-cd-text-primary'}>
                    {log}
                  </span>
                </div>
              ))}
              {selectedTest.error && (
                <div className="text-cd-error mt-2 p-2 bg-cd-error/10 rounded">
                  {selectedTest.error}
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run history */}
      {runs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-mp-text">Historique des exécutions</h3>
          {runs.map((run) => (
            <div key={run.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm text-sm">
              <div className="flex items-center gap-3">
                <span className="text-cd-text-tertiary">{run.timestamp}</span>
                <span className="text-cd-success font-medium">{run.passed} ✓</span>
                {run.failed > 0 && <span className="text-cd-error font-medium">{run.failed} ✗</span>}
              </div>
              <span className="text-xs text-cd-text-tertiary">{run.duration}ms</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
