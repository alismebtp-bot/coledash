/**
 * AISiteMaintainer — Automated site maintenance and health monitoring
 * Monitors performance, detects issues, and suggests optimizations.
 */

/* ─────────────────────── types ─────────────────────── */

export interface HealthCheck {
  id: string;
  name: string;
  category: 'performance' | 'seo' | 'accessibility' | 'security' | 'uptime';
  status: 'pass' | 'warn' | 'fail';
  score: number;
  message: string;
  details?: string[];
  recommendation?: string;
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint (ms)
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte (ms)
  tti: number; // Time to Interactive (ms)
}

export interface MaintenanceReport {
  timestamp: string;
  overallScore: number;
  checks: HealthCheck[];
  metrics: PerformanceMetrics;
  issues: string[];
  suggestions: string[];
}

/* ─────────────────────── health checks ─────────────────────── */

const defaultChecks: HealthCheck[] = [
  {
    id: 'perf-bundle',
    name: 'Taille du bundle JS',
    category: 'performance',
    status: 'pass',
    score: 85,
    message: 'Bundle principal: 142KB (gzipped)',
    details: ['Main chunk: 89KB', 'Vendor chunk: 53KB'],
    recommendation: 'Activer le code splitting pour les routes moins utilisées',
  },
  {
    id: 'perf-images',
    name: 'Optimisation des images',
    category: 'performance',
    status: 'warn',
    score: 72,
    message: '3 images non optimisées détectées',
    details: ['hero-banner.jpg: 2.4MB → suggéré: 180KB WebP', 'menu-item-1.png: 890KB → suggéré: 45KB', 'logo.png: 340KB → suggéré: 15KB SVG'],
    recommendation: 'Convertir les images en WebP/AVIF et implémenter le lazy loading',
  },
  {
    id: 'perf-cache',
    name: 'Stratégie de cache',
    category: 'performance',
    status: 'pass',
    score: 92,
    message: 'Cache navigateur configuré correctement',
    details: ['Static assets: 1 an', 'API responses: 5 min', 'HTML: no-cache'],
  },
  {
    id: 'seo-meta',
    name: 'Balises meta',
    category: 'seo',
    status: 'pass',
    score: 95,
    message: 'Toutes les pages ont des meta tags complets',
    details: ['Title: OK', 'Description: OK', 'OG tags: OK', 'Canonical: OK'],
  },
  {
    id: 'seo-structure',
    name: 'Structure des données',
    category: 'seo',
    status: 'warn',
    score: 68,
    message: 'Schema.org incomplet sur 2 pages',
    details: ['Restaurant schema: missing on /menu', 'BreadcrumbList: missing on /orders'],
    recommendation: 'Ajouter le JSON-LD Schema.org sur toutes les pages',
  },
  {
    id: 'seo-mobile',
    name: 'Compatibilité mobile',
    category: 'seo',
    status: 'pass',
    score: 90,
    message: 'Site responsive et mobile-friendly',
    details: ['Viewport: OK', 'Touch targets: OK', 'Font size: OK'],
  },
  {
    id: 'a11y-contrast',
    name: 'Contraste des couleurs',
    category: 'accessibility',
    status: 'pass',
    score: 88,
    message: 'Contraste suffisant sur la plupart des éléments',
    details: ['Primary text: 7.2:1 ✓', 'Secondary text: 4.8:1 ✓', 'Button text: 4.5:1 ✓'],
  },
  {
    id: 'a11y-aria',
    name: 'Attributs ARIA',
    category: 'accessibility',
    status: 'warn',
    score: 65,
    message: '5 éléments interactifs sans label ARIA',
    details: ['Modal close button: missing aria-label', 'Tab navigation: missing role', 'Icon buttons: missing aria-label (3)'],
    recommendation: 'Ajouter des attributs aria-label sur tous les boutons icônes',
  },
  {
    id: 'sec-https',
    name: 'HTTPS',
    category: 'security',
    status: 'pass',
    score: 100,
    message: 'HTTPS activé avec certificat valide',
    details: ['TLS 1.3', 'HSTS enabled', 'Certificate valid until 2026'],
  },
  {
    id: 'sec-headers',
    name: 'Headers de sécurité',
    category: 'security',
    status: 'warn',
    score: 70,
    message: '2 headers de sécurité manquants',
    details: ['Content-Security-Policy: missing', 'X-Frame-Options: OK', 'X-Content-Type-Options: OK', 'Referrer-Policy: missing'],
    recommendation: 'Ajouter CSP et Referrer-Policy headers',
  },
  {
    id: 'uptime',
    name: 'Disponibilité',
    category: 'uptime',
    status: 'pass',
    score: 99,
    message: 'Uptime: 99.8% sur les 30 derniers jours',
    details: ['Total requests: 2.4M', 'Failed requests: 4.8K', 'Avg response time: 45ms'],
  },
];

/* ─────────────────────── main functions ─────────────────────── */

export async function runHealthCheck(): Promise<MaintenanceReport> {
  // Simulate async health check
  await delay(800);

  const checks = [...defaultChecks];

  // Add some randomness to scores
  checks.forEach((check) => {
    const variation = Math.floor(Math.random() * 10) - 5;
    check.score = Math.max(0, Math.min(100, check.score + variation));

    // Update status based on score
    if (check.score >= 80) check.status = 'pass';
    else if (check.score >= 60) check.status = 'warn';
    else check.status = 'fail';
  });

  const metrics: PerformanceMetrics = {
    fcp: 850 + Math.floor(Math.random() * 200),
    lcp: 1200 + Math.floor(Math.random() * 400),
    fid: 12 + Math.floor(Math.random() * 20),
    cls: 0.05 + Math.random() * 0.1,
    ttfb: 45 + Math.floor(Math.random() * 30),
    tti: 2200 + Math.floor(Math.random() * 500),
  };

  const overallScore = Math.round(checks.reduce((sum, c) => sum + c.score, 0) / checks.length);

  const issues = checks
    .filter((c) => c.status === 'fail')
    .map((c) => `${c.name}: ${c.message}`);

  const suggestions = checks
    .filter((c) => c.status === 'warn' && c.recommendation)
    .map((c) => c.recommendation!);

  return {
    timestamp: new Date().toISOString(),
    overallScore,
    checks,
    metrics,
    issues,
    suggestions,
  };
}

export function getPerformanceGrade(metrics: PerformanceMetrics): {
  grade: string;
  color: string;
} {
  const score = calculatePerformanceScore(metrics);

  if (score >= 90) return { grade: 'A', color: '#00C853' };
  if (score >= 80) return { grade: 'B', color: '#7CB342' };
  if (score >= 70) return { grade: 'C', color: '#FFB300' };
  if (score >= 60) return { grade: 'D', color: '#FF9800' };
  return { grade: 'F', color: '#FF3008' };
}

export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  // Simplified scoring based on Core Web Vitals thresholds
  let score = 100;

  // LCP: <2.5s good, >4s poor
  if (metrics.lcp > 4000) score -= 25;
  else if (metrics.lcp > 2500) score -= 10;

  // FID: <100ms good, >300ms poor
  if (metrics.fid > 300) score -= 25;
  else if (metrics.fid > 100) score -= 10;

  // CLS: <0.1 good, >0.25 poor
  if (metrics.cls > 0.25) score -= 25;
  else if (metrics.cls > 0.1) score -= 10;

  // FCP: <1.8s good, >3s poor
  if (metrics.fcp > 3000) score -= 15;
  else if (metrics.fcp > 1800) score -= 5;

  // TTFB: <600ms good, >1000ms poor
  if (metrics.ttfb > 1000) score -= 10;
  else if (metrics.ttfb > 600) score -= 5;

  return Math.max(0, score);
}

export function formatMetricValue(name: keyof PerformanceMetrics, value: number): string {
  switch (name) {
    case 'fcp':
    case 'lcp':
    case 'fid':
    case 'ttfb':
    case 'tti':
      return `${Math.round(value)} ms`;
    case 'cls':
      return value.toFixed(3);
    default:
      return String(value);
  }
}

export function getMetricStatus(name: keyof PerformanceMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'lcp':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'fid':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'cls':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'fcp':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'ttfb':
      return value <= 600 ? 'good' : value <= 1000 ? 'needs-improvement' : 'poor';
    case 'tti':
      return value <= 3800 ? 'good' : value <= 7300 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}

/* ─────────────────────── optimization suggestions ─────────────────────── */

export interface OptimizationSuggestion {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  estimatedImpact: string;
  effort: 'easy' | 'medium' | 'hard';
}

export function generateOptimizations(report: MaintenanceReport): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  // Performance suggestions
  const imageCheck = report.checks.find((c) => c.id === 'perf-images');
  if (imageCheck && imageCheck.status !== 'pass') {
    suggestions.push({
      id: 'opt-img-compression',
      priority: 'high',
      category: 'performance',
      title: 'Compresser les images',
      description: 'Convertir les images en WebP/AVIF et implémenter le lazy loading. Potentiel de réduction de 80% du poids des images.',
      estimatedImpact: '-1.2s LCP',
      effort: 'easy',
    });
  }

  const bundleCheck = report.checks.find((c) => c.id === 'perf-bundle');
  if (bundleCheck && bundleCheck.score < 90) {
    suggestions.push({
      id: 'opt-code-split',
      priority: 'medium',
      category: 'performance',
      title: 'Code splitting par route',
      description: 'Utiliser React.lazy() et dynamic imports pour charger les pages à la demande.',
      estimatedImpact: '-45KB initial',
      effort: 'medium',
    });
  }

  // SEO suggestions
  const seoCheck = report.checks.find((c) => c.id === 'seo-structure');
  if (seoCheck && seoCheck.status !== 'pass') {
    suggestions.push({
      id: 'opt-schema',
      priority: 'medium',
      category: 'seo',
      title: 'Ajouter Schema.org JSON-LD',
      description: 'Implémenter les structured data pour le restaurant, le menu et les avis.',
      estimatedImpact: '+15% CTR',
      effort: 'easy',
    });
  }

  // Accessibility suggestions
  const a11yCheck = report.checks.find((c) => c.id === 'a11y-aria');
  if (a11yCheck && a11yCheck.status !== 'pass') {
    suggestions.push({
      id: 'opt-aria',
      priority: 'high',
      category: 'accessibility',
      title: 'Corriger les labels ARIA',
      description: 'Ajouter aria-label sur tous les boutons icônes et les éléments interactifs.',
      estimatedImpact: 'WCAG 2.1 AA',
      effort: 'easy',
    });
  }

  // Security suggestions
  const secCheck = report.checks.find((c) => c.id === 'sec-headers');
  if (secCheck && secCheck.status !== 'pass') {
    suggestions.push({
      id: 'opt-csp',
      priority: 'high',
      category: 'security',
      title: 'Implémenter Content-Security-Policy',
      description: 'Ajouter un header CSP strict pour prévenir les attaques XSS.',
      estimatedImpact: 'Protection XSS',
      effort: 'medium',
    });
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/* ─────────────────────── utilities ─────────────────────── */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ─────────────────────── export report ─────────────────────── */

export function exportReport(report: MaintenanceReport): string {
  const lines = [
    '# ColeDash — Maintenance Report',
    `Generated: ${new Date(report.timestamp).toLocaleString('fr-FR')}`,
    `Overall Score: ${report.overallScore}/100`,
    '',
    '## Performance Metrics',
    `- First Contentful Paint: ${formatMetricValue('fcp', report.metrics.fcp)}`,
    `- Largest Contentful Paint: ${formatMetricValue('lcp', report.metrics.lcp)}`,
    `- First Input Delay: ${formatMetricValue('fid', report.metrics.fid)}`,
    `- Cumulative Layout Shift: ${formatMetricValue('cls', report.metrics.cls)}`,
    `- Time to First Byte: ${formatMetricValue('ttfb', report.metrics.ttfb)}`,
    '',
    '## Health Checks',
    ...report.checks.map((c) => `- [${c.status.toUpperCase()}] ${c.name}: ${c.score}/100 — ${c.message}`),
    '',
    '## Issues',
    ...(report.issues.length > 0 ? report.issues.map((i) => `- ❌ ${i}`) : ['- No critical issues found']),
    '',
    '## Suggestions',
    ...(report.suggestions.length > 0 ? report.suggestions.map((s) => `- 💡 ${s}`) : ['- No suggestions']),
  ];

  return lines.join('\n');
}
