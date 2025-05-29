#!/usr/bin/env node
import { performance } from 'perf_hooks';
import { getPhotos, getPhoto } from '../src/photo/db/query';
import { performanceMonitor } from '../src/utility/performance';
import { sql } from '@vercel/postgres';

async function runPerformanceTest() {
  console.log('Starting performance test...\n');

  // Reset metrics
  performanceMonitor.reset();

  // Get initial database metrics
  const initialDbMetrics = await performanceMonitor.logDatabaseMetrics();
  console.log('Initial DB Metrics:', JSON.stringify(initialDbMetrics, null, 2));

  const testCases = [
    { name: 'Get all photos', fn: () => getPhotos() },
    { name: 'Get photos with limit', fn: () => getPhotos({ limit: 10 }) },
    { name: 'Get photos by tag', fn: () => getPhotos({ tag: 'example' }) },
    { name: 'Get photos by camera', fn: () => getPhotos({ camera: 'fujifilm' }) },
    { name: 'Get hidden photos', fn: () => getPhotos({ hidden: 'only' }) },
  ];

  console.log('\n--- Running Query Tests ---');
  
  for (const testCase of testCases) {
    const runs = 5;
    const times: number[] = [];
    
    for (let i = 0; i < runs; i++) {
      const start = performance.now();
      try {
        await testCase.fn();
        const duration = performance.now() - start;
        times.push(duration);
      } catch (error) {
        console.error(`Error in ${testCase.name}:`, error);
      }
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    console.log(`\n${testCase.name}:`);
    console.log(`  Avg: ${avg.toFixed(2)}ms`);
    console.log(`  Min: ${min.toFixed(2)}ms`);
    console.log(`  Max: ${max.toFixed(2)}ms`);
  }

  // Test concurrent requests
  console.log('\n--- Testing Concurrent Requests ---');
  const concurrentStart = performance.now();
  await Promise.all([
    getPhotos({ limit: 10 }),
    getPhotos({ tag: 'example' }),
    getPhotos({ camera: 'fujifilm' }),
  ]);
  const concurrentDuration = performance.now() - concurrentStart;
  console.log(`Concurrent requests took: ${concurrentDuration.toFixed(2)}ms`);

  // Get final metrics
  const finalMetrics = performanceMonitor.getMetrics();
  const finalDbMetrics = await performanceMonitor.logDatabaseMetrics();

  console.log('\n--- Final Performance Metrics ---');
  console.log(JSON.stringify({
    ...finalMetrics,
    dbMetrics: finalDbMetrics,
  }, null, 2));

  // Save results to file
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    metrics: finalMetrics,
    dbMetrics: {
      initial: initialDbMetrics,
      final: finalDbMetrics,
    },
  };

  const fs = require('fs');
  const filename = `performance-results-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${filename}`);
}

// Run the test
runPerformanceTest().catch(console.error).finally(() => process.exit(0));