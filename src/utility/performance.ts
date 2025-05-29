
export interface PerformanceMetrics {
  queryCount: number;
  totalQueryTime: number;
  cacheHits: number;
  cacheMisses: number;
  avgQueryTime: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    queryCount: 0,
    totalQueryTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    avgQueryTime: 0,
    timestamp: Date.now(),
  };

  private queryTimes: number[] = [];

  reset() {
    this.metrics = {
      queryCount: 0,
      totalQueryTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      avgQueryTime: 0,
      timestamp: Date.now(),
    };
    this.queryTimes = [];
  }

  recordQuery(duration: number) {
    this.metrics.queryCount++;
    this.metrics.totalQueryTime += duration;
    this.queryTimes.push(duration);
    this.metrics.avgQueryTime = this.metrics.totalQueryTime / this.metrics.queryCount;
  }

  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  getMetrics(): PerformanceMetrics & { p95QueryTime: number; p99QueryTime: number } {
    const sortedTimes = [...this.queryTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);

    return {
      ...this.metrics,
      p95QueryTime: sortedTimes[p95Index] || 0,
      p99QueryTime: sortedTimes[p99Index] || 0,
    };
  }

  async logDatabaseMetrics() {
    // This will be implemented when needed
    // For now, return null to avoid import issues
    return null;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Wrapper for timed queries
export async function timedQuery<T>(
  name: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await queryFn();
    const duration = performance.now() - start;
    performanceMonitor.recordQuery(duration);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] Query "${name}" took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor.recordQuery(duration);
    throw error;
  }
}