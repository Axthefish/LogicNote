// Performance monitoring utilities for development

class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number[]> = new Map();

  mark(name: string) {
    if (process.env.NODE_ENV === 'development') {
      this.marks.set(name, performance.now());
    }
  }

  measure(name: string, startMark: string) {
    if (process.env.NODE_ENV === 'development') {
      const start = this.marks.get(startMark);
      if (start) {
        const duration = performance.now() - start;
        const measures = this.measures.get(name) || [];
        measures.push(duration);
        this.measures.set(name, measures);
        
        // Log slow operations
        if (duration > 100) {
          console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
        }
      }
    }
  }

  getStats(name: string) {
    const measures = this.measures.get(name) || [];
    if (measures.length === 0) return null;

    const sum = measures.reduce((a, b) => a + b, 0);
    const avg = sum / measures.length;
    const max = Math.max(...measures);
    const min = Math.min(...measures);

    return { avg, max, min, count: measures.length };
  }

  logAllStats() {
    if (process.env.NODE_ENV === 'development') {
      console.group('[Performance Stats]');
      this.measures.forEach((_, name) => {
        const stats = this.getStats(name);
        if (stats) {
          console.log(`${name}:`, {
            avg: `${stats.avg.toFixed(2)}ms`,
            max: `${stats.max.toFixed(2)}ms`,
            min: `${stats.min.toFixed(2)}ms`,
            count: stats.count,
          });
        }
      });
      console.groupEnd();
    }
  }

  clear() {
    this.marks.clear();
    this.measures.clear();
  }
}

export const perfMonitor = new PerformanceMonitor();

// React component render tracker
export function useRenderTracker(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    console.count(`[Render] ${componentName}`);
  }
}

// Memory usage reporter (development only)
export function reportMemoryUsage() {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log('[Memory Usage]', {
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
} 