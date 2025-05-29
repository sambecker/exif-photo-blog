#!/usr/bin/env node
// Run this script before making changes to get baseline metrics
import { performance } from 'perf_hooks';
import { getPhotos, getPhoto, getUniqueTags, getUniqueCameras } from '../src/photo/db/query';

async function measureQueryPerformance(name: string, queryFn: () => Promise<any>) {
  console.log(`\nMeasuring: ${name}`);
  const times: number[] = [];
  
  for (let i = 0; i < 5; i++) {
    const start = performance.now();
    try {
      await queryFn();
      const duration = performance.now() - start;
      times.push(duration);
      console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms`);
    } catch (error) {
      console.error(`  Error: ${error}`);
    }
  }
  
  if (times.length > 0) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    console.log(`  Summary - Avg: ${avg.toFixed(2)}ms, Min: ${min.toFixed(2)}ms, Max: ${max.toFixed(2)}ms`);
  }
}

async function runBaseline() {
  console.log('=== Performance Baseline Test ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  // Test various query patterns
  await measureQueryPerformance('Get 10 photos', () => getPhotos({ limit: 10 }));
  await measureQueryPerformance('Get 50 photos', () => getPhotos({ limit: 50 }));
  await measureQueryPerformance('Get photos by tag', () => getPhotos({ tag: 'example', limit: 10 }));
  await measureQueryPerformance('Get single photo', () => getPhoto('example-id'));
  await measureQueryPerformance('Get unique tags', () => getUniqueTags());
  await measureQueryPerformance('Get unique cameras', () => getUniqueCameras());
  
  // Test concurrent queries
  console.log('\nMeasuring: Concurrent queries');
  const concurrentStart = performance.now();
  await Promise.all([
    getPhotos({ limit: 10 }),
    getUniqueTags(),
    getUniqueCameras(),
  ]);
  const concurrentDuration = performance.now() - concurrentStart;
  console.log(`  Duration: ${concurrentDuration.toFixed(2)}ms`);

  console.log('\n=== Test Complete ===');
}

runBaseline().catch(console.error).finally(() => process.exit(0));