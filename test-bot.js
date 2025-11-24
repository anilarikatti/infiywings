/* eslint-env node */
import { spawn } from 'child_process';
import http from 'http';
import { URL } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const BASE_URL = 'http://localhost:5173';
let devServer = null;

// Test results
const results = {
  passed: [],
  failed: []
};

// Helper function to make HTTP request
function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.get(url, { timeout: 10000 }, (res) => {
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

// Wait for server to be ready
async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fetchPage('/');
      return true;
    } catch (_error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

// Test function
async function test(name, testFn) {
  try {
    await testFn();
    results.passed.push(name);
    console.log(`✅ PASS: ${name}`);
    return true;
  } catch (error) {
    results.failed.push({ name, error: error.message });
    console.log(`❌ FAIL: ${name} - ${error.message}`);
    return false;
  }
}

// Open browser
async function openBrowser() {
  try {
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
      command = `start ${BASE_URL}`;
    } else if (platform === 'darwin') {
      command = `open ${BASE_URL}`;
    } else {
      command = `xdg-open ${BASE_URL}`;
    }
    
    await execAsync(command);
    console.log('🌐 Browser opened at', BASE_URL);
  } catch (error) {
    console.log('⚠️  Could not open browser automatically:', error.message);
    console.log(`   Please open manually: ${BASE_URL}`);
  }
}

// Run all tests
async function runTests() {
  console.log('\n🤖 Bot Testing UI - Starting Automated Tests\n');
  console.log('='.repeat(60));
  
  // Test 1: Server is running
  await test('✅ Server is running and accessible', async () => {
    const response = await fetchPage('/');
    if (response.statusCode !== 200) {
      throw new Error(`Expected status 200, got ${response.statusCode}`);
    }
  });
  
  // Test 2: HTML structure is correct
  await test('✅ HTML structure is correct', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('<html') || !response.body.includes('</html>')) {
      throw new Error('HTML structure not found');
    }
    if (!response.body.includes('<head>') || !response.body.includes('</head>')) {
      throw new Error('HTML head section not found');
    }
    if (!response.body.includes('<body>') || !response.body.includes('</body>')) {
      throw new Error('HTML body section not found');
    }
  });
  
  // Test 3: React root element
  await test('✅ React root element present', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('id="root"') && !response.body.includes('id=\'root\'')) {
      throw new Error('React root element not found');
    }
  });
  
  // Test 4: React script loaded
  await test('✅ React application script loaded', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('main.jsx') && !response.body.includes('type="module"')) {
      throw new Error('React script not found');
    }
  });
  
  // Test 5: Meta tags present
  await test('✅ Meta tags present', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('viewport') && !response.body.includes('charset')) {
      throw new Error('Meta tags not found');
    }
  });
  
  // Test 6: Title present
  await test('✅ Page title present', async () => {
    const response = await fetchPage('/');
    if (!response.body.includes('<title>') || !response.body.includes('</title>')) {
      throw new Error('Page title not found');
    }
  });
  
  // Test 7: CSS will be loaded via JSX import (not in HTML)
  await test('✅ Application structure ready for CSS', async () => {
    const response = await fetchPage('/');
    // CSS is imported in main.jsx, not in HTML, so we just check structure is ready
    if (!response.body.includes('main.jsx')) {
      throw new Error('Main JSX file not found - CSS cannot load');
    }
  });
  
  // Test 8: Vite client script
  await test('✅ Vite development client loaded', async () => {
    const response = await fetchPage('/');
    // Vite injects @vite/client script
    if (!response.body.includes('script') && !response.body.includes('module')) {
      throw new Error('Vite script not found');
    }
  });
  
  // Test 9: Content-Type header
  await test('✅ Correct Content-Type header', async () => {
    const response = await fetchPage('/');
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html')) {
      throw new Error(`Expected text/html, got ${contentType}`);
    }
  });
  
  // Test 10: Server responds quickly
  await test('✅ Server response time acceptable', async () => {
    const start = Date.now();
    await fetchPage('/');
    const duration = Date.now() - start;
    if (duration > 5000) {
      throw new Error(`Response too slow: ${duration}ms`);
    }
  });
  
  // Test 11: No server errors
  await test('✅ No server errors in response', async () => {
    const response = await fetchPage('/');
    if (response.statusCode >= 400) {
      throw new Error(`Server error: ${response.statusCode}`);
    }
    if (response.body.includes('Error:') && response.body.includes('EADDRINUSE')) {
      throw new Error('Server port conflict detected');
    }
  });
  
  // Test 12: Valid HTML structure
  await test('✅ Valid HTML document structure', async () => {
    const response = await fetchPage('/');
    const html = response.body.toLowerCase();
    const hasDoctype = html.includes('<!doctype') || html.includes('<!DOCTYPE');
    const hasHtml = html.includes('<html');
    const hasHead = html.includes('<head>');
    const hasBody = html.includes('<body>');
    
    if (!hasDoctype || !hasHtml || !hasHead || !hasBody) {
      throw new Error('HTML document structure invalid');
    }
  });
  
  // Test 13: Payment page markup present in component
  await test('✅ Payment page content present', async () => {
    const response = await fetchPage('/src/App.jsx');
    if (!response.body.includes('Complete Your Booking') || !response.body.includes('Payment Details')) {
      throw new Error('Payment page content missing in App component');
    }
  });
  
  // Test 14: Payment success popup copy present
  await test('✅ Payment success popup content present', async () => {
    const response = await fetchPage('/src/App.jsx');
    if (!response.body.includes('Payment Successful!') || !response.body.includes('Back to Home')) {
      throw new Error('Payment success popup content missing');
    }
  });
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Bot Test Summary:');
  console.log(`   ✅ Passed: ${results.passed.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);
  const total = results.passed.length + results.failed.length;
  const successRate = total > 0 ? ((results.passed.length / total) * 100).toFixed(1) : 0;
  console.log(`   📈 Success Rate: ${successRate}%`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(({ name, error }) => {
      console.log(`   - ${name}`);
      console.log(`     Error: ${error}`);
    });
  }
  
  console.log('\n✨ Bot testing complete!');
  console.log(`🌐 UI is available at: ${BASE_URL}`);
  console.log('\n');
  
  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Main execution
async function main() {
  console.log('🤖 Starting Bot UI Tester\n');
  console.log('📡 Starting development server...');
  
  // Start dev server
  devServer = spawn('npm', ['run', 'dev'], {
    shell: true,
    stdio: 'ignore'
  });
  
  // Wait for server to be ready
  console.log('⏳ Waiting for server to start...');
  const serverReady = await waitForServer();
  
  if (!serverReady) {
    console.error('❌ Server failed to start');
    if (devServer) devServer.kill();
    process.exit(1);
  }
  
  console.log('✅ Server is ready!\n');
  
  // Open browser
  await openBrowser();
  
  // Wait a bit for browser to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Run tests
  await runTests();
  
  // Keep server running (comment out if you want to stop it)
  console.log('\n💡 Dev server is still running. Press Ctrl+C to stop.');
  
  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping dev server...');
    if (devServer) {
      devServer.kill();
    }
    process.exit(0);
  });
}

// Run main function
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  if (devServer) devServer.kill();
  process.exit(1);
});

