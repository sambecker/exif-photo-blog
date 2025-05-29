// Simple baseline test that doesn't require TypeScript
const { performance } = require('perf_hooks');

async function runSimpleTest() {
  console.log('=== Simple Performance Baseline ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  // Since we can't directly import the query functions, we'll test via HTTP
  const baseUrl = 'http://localhost:3001';
  
  const tests = [
    { name: 'Homepage', url: '/' },
    { name: 'Grid page', url: '/grid' },
    { name: 'API root', url: '/api' },
  ];

  for (const test of tests) {
    console.log(`\nTesting: ${test.name}`);
    const times = [];
    
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      try {
        const response = await fetch(baseUrl + test.url);
        const duration = performance.now() - start;
        times.push(duration);
        console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms (Status: ${response.status})`);
      } catch (error) {
        console.error(`  Error: ${error.message}`);
      }
    }
    
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`  Average: ${avg.toFixed(2)}ms`);
    }
  }

  console.log('\n=== Test Complete ===');
  console.log('\nNote: Run this test before and after implementing caching to compare performance.');
}

runSimpleTest().catch(console.error);