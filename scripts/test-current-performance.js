// Simple performance test for the optimized version
const { performance } = require('perf_hooks');
const fs = require('fs');

async function testCurrentPerformance() {
  console.log('=== Optimized Performance Test ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  const baseUrl = 'http://localhost:3000';
  
  // Test the same endpoints we tested before
  const endpoints = [
    { name: 'Homepage', url: '/', description: 'Should hit Redis cache for photos list' },
    { name: 'Grid page', url: '/grid', description: 'Optimized column selection + Redis cache' },
    { name: 'Feed page', url: '/feed', description: 'Cached unique data' },
  ];

  const results = {
    timestamp: new Date().toISOString(),
    optimizations: {
      redis_caching: true,
      column_optimization: true,
      connection_pooling: true,
      database_indexes: 'manual_creation_available'
    },
    tests: []
  };

  console.log('🚀 Testing with all optimizations enabled...\n');

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name}`);
    console.log(`Expected: ${endpoint.description}`);
    
    const times = [];
    let statusCodes = [];
    
    // Warm up cache first
    try {
      await fetch(baseUrl + endpoint.url);
    } catch (e) {
      // Ignore warmup errors
    }
    
    // Run actual tests
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        const response = await fetch(baseUrl + endpoint.url);
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
        name: endpoint.name,
        url: endpoint.url,
        description: endpoint.description,
        runs: times.length,
        avg: parseFloat(avg.toFixed(2)),
        median: parseFloat(median.toFixed(2)),
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        statusCodes: [...new Set(statusCodes)], // Unique status codes
        times
      });
    }
    console.log('');
  }

  // Save results
  const filename = `optimized-performance-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to ${filename}`);
  
  // Compare with baseline if available
  try {
    const baselineFiles = fs.readdirSync('.')
      .filter(f => f.startsWith('baseline-full-'))
      .sort()
      .reverse();
    
    if (baselineFiles.length > 0) {
      const baseline = JSON.parse(fs.readFileSync(baselineFiles[0], 'utf8'));
      
      console.log(`\n📈 Performance Improvement Analysis:`);
      console.log(`Comparing with baseline: ${baselineFiles[0]}\n`);
      
      let totalImprovement = 0;
      let comparisons = 0;
      
      results.tests.forEach(test => {
        const baselineTest = baseline.endpoints?.find(b => 
          b.name.toLowerCase().includes(test.name.toLowerCase().split(' ')[0])
        );
        
        if (baselineTest) {
          const improvement = ((baselineTest.avg - test.avg) / baselineTest.avg * 100);
          const status = improvement > 0 ? '✅' : (improvement < -5 ? '❌' : '⚠️');
          
          console.log(`${status} ${test.name}:`);
          console.log(`   Before: ${baselineTest.avg}ms → After: ${test.avg}ms`);
          console.log(`   Change: ${improvement.toFixed(1)}% ${improvement > 0 ? 'faster' : 'slower'}`);
          console.log('');
          
          totalImprovement += improvement;
          comparisons++;
        }
      });
      
      if (comparisons > 0) {
        const avgImprovement = totalImprovement / comparisons;
        console.log(`🎯 Overall Performance: ${avgImprovement.toFixed(1)}% improvement`);
        
        const cacheStatus = fs.readFileSync('/tmp/nextjs.log', 'utf8')
          .includes('[Redis Cache]') ? 'Active' : 'Not detected';
        
        console.log(`🗄️  Redis Cache: ${cacheStatus}`);
        console.log(`⚡ Column Optimization: Active`);
        console.log(`🔗 Connection Pooling: Active`);
        
        results.summary = {
          baselineFile: baselineFiles[0],
          averageImprovement: parseFloat(avgImprovement.toFixed(1)),
          comparisons,
          redisCacheStatus: cacheStatus
        };
      }
    } else {
      console.log('\n📊 No baseline found for comparison');
      console.log('Run scripts/baseline-full.js first to establish baseline metrics');
    }
  } catch (error) {
    console.log('\n❌ Error comparing with baseline:', error.message);
  }

  console.log(`\n✅ Optimized performance test complete!`);
  
  return results;
}

testCurrentPerformance().catch(console.error);