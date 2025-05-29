// Test script to measure performance improvements
const { performance } = require('perf_hooks');
const fs = require('fs');

async function testOptimizations() {
  console.log('=== Performance Optimization Test ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  const baseUrl = 'http://localhost:3000';
  
  // Test scenarios that should benefit from optimizations
  const testScenarios = [
    {
      name: 'Homepage (Redis cached photos)',
      url: '/',
      expectedImprovement: 'High - should hit Redis cache for photo list'
    },
    {
      name: 'Grid page (Optimized columns)',
      url: '/grid',
      expectedImprovement: 'High - reduced column selection + Redis cache'
    },
    {
      name: 'Feed page (Cached unique data)',
      url: '/feed',
      expectedImprovement: 'Medium - cached tags/cameras/lenses'
    },
    {
      name: 'Admin photos (Optimized admin queries)',
      url: '/admin/photos',
      expectedImprovement: 'Medium - admin column selection + indexes'
    },
    {
      name: 'Performance metrics (Cache stats)',
      url: '/api/perf-test',
      expectedImprovement: 'Low - should show cache hit rates'
    }
  ];

  const results = {
    timestamp: new Date().toISOString(),
    optimizations: {
      redis_caching: true,
      column_optimization: true,
      database_indexes: 'created_manually', // Will be created via admin UI
      connection_pooling: true
    },
    tests: []
  };

  console.log('🚀 Testing optimized performance...\n');

  // Test each scenario
  for (const scenario of testScenarios) {
    console.log(`Testing: ${scenario.name}`);
    console.log(`Expected: ${scenario.expectedImprovement}`);
    
    const times = [];
    let statusCodes = [];
    
    // Warm up the cache first
    try {
      await fetch(baseUrl + scenario.url);
    } catch (e) {
      // Ignore warmup errors
    }
    
    // Run tests
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        const response = await fetch(baseUrl + scenario.url);
        const duration = performance.now() - start;
        
        statusCodes.push(response.status);
        if (response.ok) {
          times.push(duration);
          process.stdout.write(`  ${i + 1}: ${duration.toFixed(2)}ms\r`);
        } else {
          process.stdout.write(`  ${i + 1}: ${duration.toFixed(2)}ms (${response.status})\r`);
        }
      } catch (error) {
        console.error(`  Error: ${error.message}`);
      }
    }
    
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
      
      console.log(`\n  Results: Avg ${avg.toFixed(2)}ms, Median ${median.toFixed(2)}ms, Min ${min.toFixed(2)}ms, Max ${max.toFixed(2)}ms`);
      
      results.tests.push({
        name: scenario.name,
        url: scenario.url,
        expectedImprovement: scenario.expectedImprovement,
        runs: times.length,
        avg: parseFloat(avg.toFixed(2)),
        median: parseFloat(median.toFixed(2)),
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        statusCodes,
        times
      });
    }
    console.log('');
  }

  // Get cache performance metrics
  console.log('📊 Fetching cache performance metrics...');
  try {
    const metricsResponse = await fetch(`${baseUrl}/api/perf-test`);
    if (metricsResponse.ok) {
      const metricsData = await metricsResponse.json();
      results.cacheMetrics = metricsData.performance;
      
      const { cacheHits, cacheMisses, queryCount, avgQueryTime } = metricsData.performance;
      const hitRate = cacheHits + cacheMisses > 0 
        ? ((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(1)
        : '0';
      
      console.log(`\n=== Cache Performance ===`);
      console.log(`Cache Hits: ${cacheHits}`);
      console.log(`Cache Misses: ${cacheMisses}`);
      console.log(`Hit Rate: ${hitRate}%`);
      console.log(`Database Queries: ${queryCount}`);
      console.log(`Avg Query Time: ${avgQueryTime.toFixed(2)}ms`);
    }
  } catch (error) {
    console.error('Failed to fetch cache metrics:', error.message);
  }

  // Save results
  const filename = `optimized-performance-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to ${filename}`);
  
  // Compare with baseline if available
  try {
    const baselineFiles = fs.readdirSync('.')
      .filter(f => f.startsWith('baseline-full-'))
      .sort()
      .reverse();
    
    if (baselineFiles.length > 0) {
      const baseline = JSON.parse(fs.readFileSync(baselineFiles[0], 'utf8'));
      
      console.log(`\n📈 Comparison with baseline (${baselineFiles[0]}):`);
      
      // Compare common endpoints
      const comparisons = [];
      results.tests.forEach(test => {
        const baselineTest = baseline.endpoints?.find(b => 
          b.name.toLowerCase().includes(test.name.toLowerCase().split(' ')[0])
        );
        
        if (baselineTest) {
          const improvement = ((baselineTest.avg - test.avg) / baselineTest.avg * 100);
          console.log(`${test.name}:`);
          console.log(`  Before: ${baselineTest.avg}ms → After: ${test.avg}ms`);
          console.log(`  Improvement: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%`);
          
          comparisons.push({
            endpoint: test.name,
            before: baselineTest.avg,
            after: test.avg,
            improvement: parseFloat(improvement.toFixed(1))
          });
        }
      });
      
      results.comparison = {
        baselineFile: baselineFiles[0],
        comparisons
      };
    }
  } catch (error) {
    console.log('\nNo baseline found for comparison');
  }

  console.log(`\n✅ Performance test complete!`);
  
  return results;
}

testOptimizations().catch(console.error);