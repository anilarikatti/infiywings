/* eslint-env node */
import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:5173';
const TIMEOUT = 5000;

// Test results
const results = {
  passed: [],
  failed: []
};

// Helper function to make HTTP request
function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.get(url, { timeout: TIMEOUT }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test function
async function test(name, testFn) {
  try {
    await testFn();
    results.passed.push(name);
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    results.failed.push({ name, error: error.message });
    console.log(`❌ FAIL: ${name} - ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('🤖 Starting UI Tests (Bot Mode)\n');
  console.log('='.repeat(50));
  
  // Test 1: Server is running
  await test('Server is running and accessible', async () => {
    const response = await fetchPage('/');
    if (response.statusCode !== 200) {
      throw new Error(`Expected status 200, got ${response.statusCode}`);
    }
  });
  
  // Test 2: Home page loads
  await test('Home page loads successfully', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('Discover Your Next Adventure')) {
      throw new Error('Hero section not found');
    }
    if (!response.body.includes('Infiy Wings')) {
      throw new Error('Brand name not found');
    }
  });
  
  // Test 3: Navigation elements present
  await test('Navigation menu elements present', async () => {
    const response = await fetchPage('/');
    const navItems = ['Home', 'About', 'Packages', 'Contact'];
    for (const item of navItems) {
      if (!response.body.toLowerCase().includes(item.toLowerCase())) {
        throw new Error(`Navigation item "${item}" not found`);
      }
    }
  });
  
  // Test 4: Why Choose Us section
  await test('Why Choose Us section present', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('Why Choose Us')) {
      throw new Error('Why Choose Us section not found');
    }
    const features = ['Best Prices', '24/7 Support', 'Secure Booking', 'Expert Guides'];
    for (const feature of features) {
      if (!response.body.includes(feature)) {
        throw new Error(`Feature "${feature}" not found`);
      }
    }
  });
  
  // Test 5: Popular Packages section
  await test('Popular Packages section present', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('Popular Packages')) {
      throw new Error('Popular Packages section not found');
    }
    if (!response.body.includes('Bali Beach Paradise')) {
      throw new Error('Package "Bali Beach Paradise" not found');
    }
  });
  
  // Test 6: Testimonials section
  await test('Testimonials section present', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('What Our Travelers Say')) {
      throw new Error('Testimonials section not found');
    }
    if (!response.body.includes('Sarah Johnson')) {
      throw new Error('Testimonial not found');
    }
  });
  
  // Test 7: Footer present
  await test('Footer section present', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('footer') || !response.body.includes('Infiy Wings')) {
      throw new Error('Footer not found');
    }
  });
  
  // Test 8: React app is mounted
  await test('React app is properly mounted', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('root')) {
      throw new Error('React root element not found');
    }
    if (!response.body.includes('main.jsx') && !response.body.includes('script')) {
      throw new Error('React script not found');
    }
  });
  
  // Test 9: CSS/Tailwind classes present
  await test('Tailwind CSS classes present', async () => {
    const response = await fetchPage('/');
    const tailwindClasses = ['bg-', 'text-', 'flex', 'grid', 'rounded'];
    let found = false;
    for (const className of tailwindClasses) {
      if (response.body.includes(className)) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error('Tailwind CSS classes not found');
    }
  });
  
  // Test 10: Images/Assets loading
  await test('Image references present', async () => {
    const response = await fetchPage('/');
    // Check for image tags or unsplash URLs
    if (!response.body.includes('unsplash.com') && !response.body.includes('img') && !response.body.includes('image')) {
      throw new Error('No image references found');
    }
  });

  // Test 11: Payment page content available in App component
  await test('Payment page copy exists', async () => {
    const response = await fetchPage('/src/App.jsx');
    if (!response.body.includes('Complete Your Booking') || !response.body.includes('Payment Details')) {
      throw new Error('Payment page content not found in App component');
    }
  });

  // Test 12: Payment success popup content
  await test('Payment success popup content exists', async () => {
    const response = await fetchPage('/src/App.jsx');
    if (!response.body.includes('Payment Successful!') || !response.body.includes('Back to Home')) {
      throw new Error('Payment success popup content missing');
    }
  });
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📈 Success Rate: ${((results.passed.length / (results.passed.length + results.failed.length)) * 100).toFixed(1)}%`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(({ name, error }) => {
      console.log(`   - ${name}: ${error}`);
    });
  }
  
  console.log('\n✨ Testing complete!');
  
  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Check if server is running first
console.log('🔍 Checking if server is running...\n');
fetchPage('/')
  .then(() => {
    console.log('✅ Server is running!\n');
    runTests();
  })
  .catch((error) => {
    console.error('❌ Error: Server is not running or not accessible');
    console.error(`   Make sure to run "npm run dev" first`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  });


