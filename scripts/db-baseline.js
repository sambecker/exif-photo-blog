// Database performance baseline test
const { performance } = require('perf_hooks');
const fs = require('fs');

async function measureDatabasePerformance() {
  console.log('=== Database Performance Baseline ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  const baseUrl = 'http://localhost:3001';
  
  // Test endpoints that trigger database queries
  const endpoints = [
    { name: 'Homepage (photos query)', url: '/' },
    { name: 'Grid page (photos query)', url: '/grid' },
    { name: 'Tags page', url: '/tag' },
    { name: 'Cameras page', url: '/shot-on' },
    { name: 'Single photo page', url: '/p' },
  ];

  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  for (const endpoint of endpoints) {
    console.log(`\nTesting: ${endpoint.name}`);
    const times = [];
    
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        const response = await fetch(baseUrl + endpoint.url);
        const duration = performance.now() - start;
        
        if (response.ok) {
          times.push(duration);
          console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms`);
        } else {
          console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms (Status: ${response.status})`);
        }
      } catch (error) {
        console.error(`  Error: ${error.message}`);
      }
    }
    
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      console.log(`  Summary:`);
      console.log(`    Average: ${avg.toFixed(2)}ms`);
      console.log(`    Min: ${min.toFixed(2)}ms`);
      console.log(`    Max: ${max.toFixed(2)}ms`);
      
      results.tests.push({
        endpoint: endpoint.name,
        url: endpoint.url,
        runs: times.length,
        avg: avg.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2)
      });
    }
  }

  // Save results
  const filename = `baseline-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n=== Results saved to ${filename} ===`);
  
  return results;
}

measureDatabasePerformance()
  .then(results => {
    console.log('\n=== Summary ===');
    console.log('Average response times:');
    results.tests.forEach(test => {
      console.log(`  ${test.endpoint}: ${test.avg}ms`);
    });
  })
  .catch(console.error);