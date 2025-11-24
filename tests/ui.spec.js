import { test, expect } from '@playwright/test';

test.describe('Infiy Wings UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Helper function to navigate on mobile or desktop
  async function navigateToPage(page, pageName) {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    if (isMobile) {
      // On mobile, check if menu is already open
      const mobileMenu = page.locator('div.md\\:hidden.bg-white.border-t');
      const isMenuOpen = await mobileMenu.isVisible().catch(() => false);
      
      if (!isMenuOpen) {
        // Find and click the hamburger menu button (button with Menu/X icon)
        // The menu button is the last button in the nav that's visible on mobile
        const menuButton = page.locator('nav button.md\\:hidden').last();
        await menuButton.click();
        await page.waitForTimeout(300); // Wait for menu to open
      }
      
      // Click the navigation button in the mobile menu
      await mobileMenu.getByRole('button', { name: pageName, exact: true }).first().click();
      await page.waitForTimeout(200); // Wait for navigation to complete
    } else {
      // On desktop, click directly
      await page.getByRole('button', { name: pageName, exact: true }).first().click();
    }
  }

  async function openPaymentForFirstPackage(page) {
    await navigateToPage(page, 'packages');
    const bookNowButton = page.locator('button:has-text("Book Now")').first();
    await bookNowButton.scrollIntoViewIfNeeded();
    await bookNowButton.click();
    await expect(page.locator('h1:has-text("Complete Your Booking")')).toBeVisible();
  }

  test('should load the home page with hero section', async ({ page }) => {
    // Check if hero section is visible
    await expect(page.locator('h1:has-text("Discover Your Next Adventure")')).toBeVisible();
    await expect(page.locator('text=Explore the world with Infiy Wings')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    
    // Check logo
    await expect(page.getByText('Infiy Wings').first()).toBeVisible();
    
    if (isMobile) {
      // On mobile, check for menu button
      const menuButton = page.locator('button.md\\:hidden').first();
      await expect(menuButton).toBeVisible();
      
      // Open menu and check navigation items
      await menuButton.click();
      await page.waitForTimeout(300);
      
      const mobileMenu = page.locator('div.md\\:hidden.bg-white.border-t');
      await expect(mobileMenu.getByText('home', { exact: false }).first()).toBeVisible();
      await expect(mobileMenu.getByText('about', { exact: false }).first()).toBeVisible();
      await expect(mobileMenu.getByText('packages', { exact: false }).first()).toBeVisible();
      await expect(mobileMenu.getByText('contact', { exact: false }).first()).toBeVisible();
    } else {
      // On desktop, check navigation items directly
      await expect(page.getByRole('button', { name: 'home', exact: true }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: 'about', exact: true }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: 'packages', exact: true }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: 'contact', exact: true }).first()).toBeVisible();
    }
  });

  test('should navigate to About page', async ({ page }) => {
    await navigateToPage(page, 'about');
    await expect(page.locator('h1:has-text("About Infiy Wings")')).toBeVisible();
    await expect(page.getByText('Crafting Unforgettable Travel Experiences').first()).toBeVisible();
  });

  test('should navigate to Packages page', async ({ page }) => {
    await navigateToPage(page, 'packages');
    await expect(page.locator('h1:has-text("Travel Packages")')).toBeVisible();
    
    // Check if packages are displayed
    await expect(page.getByText('Bali Beach Paradise').first()).toBeVisible();
    await expect(page.getByText('Swiss Alps Adventure').first()).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await navigateToPage(page, 'contact');
    await expect(page.locator('h1:has-text("Get In Touch")')).toBeVisible();
    
    // Check contact form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should display Why Choose Us section on home page', async ({ page }) => {
    await expect(page.locator('h2:has-text("Why Choose Us")')).toBeVisible();
    await expect(page.locator('text=Best Prices')).toBeVisible();
    await expect(page.locator('text=24/7 Support')).toBeVisible();
    await expect(page.locator('text=Secure Booking')).toBeVisible();
    await expect(page.locator('text=Expert Guides')).toBeVisible();
  });

  test('should display popular packages on home page', async ({ page }) => {
    await expect(page.locator('h2:has-text("Popular Packages")')).toBeVisible();
    
    // Check if at least one package is visible
    await expect(page.locator('text=Bali Beach Paradise').first()).toBeVisible();
  });

  test('should display testimonials section', async ({ page }) => {
    await expect(page.locator('h2:has-text("What Our Travelers Say")')).toBeVisible();
    
    // Scroll to testimonials
    await page.locator('h2:has-text("What Our Travelers Say")').scrollIntoViewIfNeeded();
    
    // Check if testimonials are visible
    await expect(page.locator('text=Sarah Johnson')).toBeVisible();
  });

  test('should have working mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for layout to adjust
    
    // Check if mobile menu button is visible - look for Menu icon button
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible();
    
    // Click menu button
    await menuButton.click();
    await page.waitForTimeout(300); // Wait for menu to open
    
    // Check if mobile menu items are visible - use the mobile menu container
    const mobileMenu = page.locator('.md\\:hidden');
    await expect(mobileMenu.getByText('Home', { exact: false }).first()).toBeVisible();
    await expect(mobileMenu.getByText('About', { exact: false }).first()).toBeVisible();
  });

  test('should submit contact form', async ({ page }) => {
    await navigateToPage(page, 'contact');
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '1234567890');
    await page.selectOption('select[name="subject"]', 'General Inquiry');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Submit the form
    await page.click('button:has-text("Send Message")');
    
    // Check for success message
    await expect(page.getByText('Thank you! We will get back to you soon.').first()).toBeVisible();
  });

  test('should validate contact form required fields', async ({ page }) => {
    await navigateToPage(page, 'contact');
    
    // Try to submit without filling required fields
    await page.click('button:has-text("Send Message")');
    
    // HTML5 validation should prevent submission
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    
    // Check if fields are required
    await expect(nameInput).toHaveAttribute('required', '');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should display all packages on Packages page', async ({ page }) => {
    await navigateToPage(page, 'packages');
    
    // Check all 6 packages
    const packages = [
      'Bali Beach Paradise',
      'Swiss Alps Adventure',
      'Paris Romance Getaway',
      'Tokyo Cultural Experience',
      'Maldives Luxury Escape',
      'Safari in Kenya'
    ];
    
    for (const pkg of packages) {
      await expect(page.getByText(pkg).first()).toBeVisible();
    }
  });

  test('should have working footer links', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer content
    await expect(page.locator('footer').getByText('Infiy Wings').first()).toBeVisible();
    await expect(page.locator('footer').getByText('Quick Links').first()).toBeVisible();
    
    // Test footer navigation
    await page.locator('footer').getByRole('button', { name: 'Home' }).click();
    await expect(page.locator('h1:has-text("Discover Your Next Adventure")')).toBeVisible();
  });

  test('should display package details correctly', async ({ page }) => {
    await navigateToPage(page, 'packages');
    
    // Check if package cards have all required elements
    // Check for price - on packages page, "From" and price are in separate divs
    // So we check for the price value and "From" text separately
    await expect(page.getByText('$1299').first()).toBeVisible();
    await expect(page.getByText('From').first()).toBeVisible();
    
    // Check for duration
    await expect(page.getByText('7 Days / 6 Nights').first()).toBeVisible();
    
    // Check for rating
    await expect(page.getByText('(4.8)').first()).toBeVisible();
  });

  test('should navigate to payment page after booking a package', async ({ page }) => {
    await openPaymentForFirstPackage(page);
    
    await expect(page.locator('h2:has-text("Payment Details")')).toBeVisible();
    await expect(page.locator('h3:has-text("Booking Summary")')).toBeVisible();
    await expect(page.getByText('Bali Beach Paradise').first()).toBeVisible();
    await expect(page.getByText('Price per ticket:').first()).toBeVisible();
    await expect(page.getByText('Number of tickets:').first()).toBeVisible();
    await expect(page.locator('button:has-text("Pay $1299")')).toBeVisible();
  });

  test('should submit payment form and show success popup', async ({ page }) => {
    await openPaymentForFirstPackage(page);

    await page.fill('input[name="name"]', 'Payment Tester');
    await page.fill('input[name="email"]', 'payment@test.com');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="tickets"]', '2');
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="cardName"]', 'Payment Tester');
    await page.fill('input[name="cardExpiry"]', '12/30');
    await page.fill('input[name="cardCVV"]', '123');

    await expect(page.locator('button:has-text("Pay $2598")')).toBeVisible();
    await page.locator('button:has-text("Pay $2598")').click();

    await expect(page.locator('h2:has-text("Payment Successful!")')).toBeVisible();
    await expect(page.getByText('Total Paid:').first()).toBeVisible();
    await expect(page.getByText('$2598').first()).toBeVisible();
    await expect(page.getByText('A confirmation email has been sent').first()).toBeVisible();

    await page.getByRole('button', { name: 'Back to Home' }).click();
    await expect(page.locator('h1:has-text("Discover Your Next Adventure")')).toBeVisible();
  });

  test('should navigate using hero section buttons', async ({ page }) => {
    // Click "Explore Packages" button
    await page.click('button:has-text("Explore Packages")');
    await expect(page.locator('h1:has-text("Travel Packages")')).toBeVisible();
    
    // Go back to home
    await navigateToPage(page, 'home');
    
    // Click "Learn More" button
    await page.click('button:has-text("Learn More")');
    await expect(page.locator('h1:has-text("About Infiy Wings")')).toBeVisible();
  });

  test('should display About page statistics', async ({ page }) => {
    await navigateToPage(page, 'about');
    
    // Check statistics
    await expect(page.getByText('10,000+').first()).toBeVisible();
    await expect(page.getByText('Happy Travelers').first()).toBeVisible();
    await expect(page.getByText('50+').first()).toBeVisible();
    // Use more specific selector to avoid matching "Top Destinations"
    await expect(page.locator('div:has-text("50+") + div:has-text("Destinations")')).toBeVisible();
  });

  test('should navigate to payment page when booking a package', async ({ page }) => {
    await openPaymentForFirstPackage(page);
    await expect(page.locator('h2:has-text("Payment Details")')).toBeVisible();
    await expect(page.locator('h3:has-text("Booking Summary")')).toBeVisible();
    await navigateToPage(page, 'home');
  });

  test('should complete payment and show success popup', async ({ page }) => {
    await openPaymentForFirstPackage(page);

    await page.fill('input[name="name"]', 'Payment Tester');
    await page.fill('input[name="email"]', 'tester@example.com');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="tickets"]', '2');
    await page.selectOption('select[name="paymentMethod"]', 'card');
    await page.fill('input[name="cardNumber"]', '4111111111111111');
    await page.fill('input[name="cardName"]', 'Payment Tester');
    await page.fill('input[name="cardExpiry"]', '12/30');
    await page.fill('input[name="cardCVV"]', '123');

    await page.locator('form button:has-text("Pay")').first().click();

    await expect(page.locator('h2:has-text("Payment Successful!")')).toBeVisible();
    await expect(page.locator('button:has-text("Back to Home")')).toBeVisible();

    await page.locator('button:has-text("Back to Home")').click();
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    // await expect(page.locator('text=Book Now').first()).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1:has-text("Discover Your Next Adventure")')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("Discover Your Next Adventure")')).toBeVisible();
  });
});

