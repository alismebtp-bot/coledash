export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'fps' | 'bytes'
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: Map<string, (metric: PerformanceMetric) => void> = new Map()

  recordMetric(name: string, value: number, unit: 'ms' | 'fps' | 'bytes') {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    }
    this.metrics.push(metric)
    
    // Notify observers
    this.observers.forEach((callback) => callback(metric))
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    return fn().finally(() => {
      this.recordMetric(name, performance.now() - start, 'ms')
    })
  }

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    this.recordMetric(name, performance.now() - start, 'ms')
    return result
  }

  subscribe(name: string, callback: (metric: PerformanceMetric) => void) {
    this.observers.set(name, callback)
    return () => this.observers.delete(name)
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  getAverage(name: string): number {
    const relevant = this.metrics.filter((m) => m.name === name)
    if (relevant.length === 0) return 0
    return relevant.reduce((sum, m) => sum + m.value, 0) / relevant.length
  }

  clear() {
    this.metrics = []
  }
}

export const performanceMonitor = new PerformanceMonitor()
