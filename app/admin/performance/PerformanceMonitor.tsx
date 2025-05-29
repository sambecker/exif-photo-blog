'use client';

import { useState, useEffect } from 'react';
import { ScoreCard } from '@/components';
import LoaderButton from '@/components/primitives/LoaderButton';
import WarmCacheButton from '@/admin/WarmCacheButton';

interface PerformanceData {
  performance: {
    queryCount: number;
    totalQueryTime: number;
    avgQueryTime: number;
    cacheHits: number;
    cacheMisses: number;
    p95QueryTime?: number;
    p99QueryTime?: number;
  };
  database?: {
    database: {
      active_connections: number;
      blocks_hit: number;
      blocks_read: number;
    };
    photos_table: {
      sequential_scans: number;
      index_scans: number;
      live_rows: number;
    };
    cache_hit_ratio: number;
  };
  timestamp: string;
}

export default function PerformanceMonitor() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/performance');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const metrics = await response.json();
      setData(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data && loading) {
    return <div>Loading performance metrics...</div>;
  }

  const cacheHitRate = data?.performance.cacheHits && data?.performance.cacheMisses
    ? (data.performance.cacheHits / (data.performance.cacheHits + data.performance.cacheMisses) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Current Session Metrics</h2>
        <LoaderButton
          onClick={fetchMetrics}
          isLoading={loading}
          hideTextOnMobile={false}
        >
          Refresh
        </LoaderButton>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreCard
              title="Total Queries"
              value={data.performance.queryCount}
            />
            <ScoreCard
              title="Avg Query Time"
              value={`${data.performance.avgQueryTime.toFixed(2)}ms`}
            />
            <ScoreCard
              title="Cache Hit Rate"
              value={`${cacheHitRate}%`}
            />
            <ScoreCard
              title="Total Query Time"
              value={`${(data.performance.totalQueryTime / 1000).toFixed(2)}s`}
            />
          </div>

          {data.performance.p95QueryTime && (
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard
                title="P95 Query Time"
                value={`${data.performance.p95QueryTime.toFixed(2)}ms`}
              />
              <ScoreCard
                title="P99 Query Time"
                value={`${data.performance.p99QueryTime?.toFixed(2)}ms`}
              />
            </div>
          )}

          {data.database && (
            <>
              <h2 className="text-lg font-semibold mt-6">Database Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ScoreCard
                  title="Active Connections"
                  value={data.database.database.active_connections}
                />
                <ScoreCard
                  title="DB Cache Hit Rate"
                  value={`${data.database.cache_hit_ratio.toFixed(1)}%`}
                />
                <ScoreCard
                  title="Live Rows"
                  value={data.database.photos_table.live_rows}
                />
                <ScoreCard
                  title="Sequential Scans"
                  value={data.database.photos_table.sequential_scans}
                />
                <ScoreCard
                  title="Index Scans"
                  value={data.database.photos_table.index_scans}
                />
                <ScoreCard
                  title="Index/Seq Ratio"
                  value={data.database.photos_table.sequential_scans > 0
                    ? (data.database.photos_table.index_scans / data.database.photos_table.sequential_scans).toFixed(2)
                    : 'N/A'
                  }
                />
              </div>
            </>
          )}

          <div className="text-sm text-gray-500">
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
}