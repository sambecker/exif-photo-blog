// Comprehensive baseline test with performance metrics
const { performance } = require('perf_hooks');
const fs = require('fs');

async function runFullBaseline() {
  console.log('=== Comprehensive Performance Baseline ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  const baseUrl = 'http://localhost:3000';
  
  // Reset performance metrics
  await fetch(`${baseUrl}/api/perf-test`);
  
  // Test various endpoints
  const endpoints = [
    { name: 'Homepage', url: '/', expectedQueries: true },
    { name: 'Grid page', url: '/grid', expectedQueries: true },
    { name: 'Feed page', url: '/feed', expectedQueries: true },
    { name: 'API endpoint', url: '/api', expectedQueries: false },
  ];

  const results = {
    timestamp: new Date().toISOString(),
    endpoints: [],
    performanceMetrics: null
  };

  console.log('Running tests...\n');

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name}`);
    const times = [];
    
    // Warm up
    await fetch(baseUrl + endpoint.url).catch(() => {});
    
    // Test runs
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        const response = await fetch(baseUrl + endpoint.url);
        const duration = performance.now() - start;
        
        if (response.ok || response.status === 404) {
          times.push(duration);
          process.stdout.write(`  Run ${i + 1}: ${duration.toFixed(2)}ms\r`);
        }
      } catch (error) {
        console.error(`  Error: ${error.message}`);
      }
    }
    
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      console.log(`\n  Average: ${avg.toFixed(2)}ms (Min: ${min.toFixed(2)}ms, Max: ${max.toFixed(2)}ms)\n`);
      
      results.endpoints.push({
        name: endpoint.name,
        url: endpoint.url,
        runs: times.length,
        avg: parseFloat(avg.toFixed(2)),
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        times
      });
    }
  }

  // Get performance metrics after tests
  console.log('Fetching performance metrics...');
  try {
    const metricsResponse = await fetch(`${baseUrl}/api/perf-test`);
    const metricsData = await metricsResponse.json();
    results.performanceMetrics = metricsData.performance;
    
    console.log('\n=== Database Query Metrics ===');
    console.log(`Total Queries: ${metricsData.performance.queryCount}`);
    console.log(`Average Query Time: ${metricsData.performance.avgQueryTime.toFixed(2)}ms`);
    console.log(`Total Query Time: ${metricsData.performance.totalQueryTime.toFixed(2)}ms`);
    console.log(`Cache Hits: ${metricsData.performance.cacheHits}`);
    console.log(`Cache Misses: ${metricsData.performance.cacheMisses}`);
    
    if (metricsData.performance.p95QueryTime) {
      console.log(`P95 Query Time: ${metricsData.performance.p95QueryTime.toFixed(2)}ms`);
      console.log(`P99 Query Time: ${metricsData.performance.p99QueryTime.toFixed(2)}ms`);
    }
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
  }

  // Save results
  const filename = `baseline-full-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n=== Results saved to ${filename} ===`);
  
  // Summary
  console.log('\n=== Summary ===');
  results.endpoints.forEach(endpoint => {
    console.log(`${endpoint.name}: ${endpoint.avg}ms average response time`);
  });
  
  if (results.performanceMetrics && results.performanceMetrics.queryCount > 0) {
    const avgQueriesPerRequest = results.performanceMetrics.queryCount / 
      results.endpoints.reduce((sum, e) => sum + e.runs, 0);
    console.log(`\nAverage queries per request: ${avgQueriesPerRequest.toFixed(1)}`);
  }

  return results;
}

runFullBaseline().catch(console.error);